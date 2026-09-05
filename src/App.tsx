import React, { useState, useEffect, useMemo } from "react";
import { Header, ActiveTab } from "./components/Header";
import { DashboardStats } from "./components/DashboardStats";
import { PayoffProgress } from "./components/PayoffProgress";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { ExtraPaymentSimulator } from "./components/ExtraPaymentSimulator";
import { SystemDesignView } from "./components/SystemDesignView";
import { SlipUploaderModal } from "./components/SlipUploaderModal";
import { AddPaymentModal } from "./components/AddPaymentModal";
import { EditPaymentModal } from "./components/EditPaymentModal";
import { LoanSettingsModal } from "./components/LoanSettingsModal";
import { LoanConfig, PaymentRecord } from "./types";
import { defaultLoanConfig, initialPayments } from "./utils/initialData";
import { calculateAmortizationSummary, recalculatePayments, formatCurrency } from "./utils/calculator";
import { Upload, ArrowRight, Sparkles, CheckCircle2, CloudCheck, RefreshCw } from "lucide-react";
import {
  testConnection,
  subscribeLoanConfig,
  saveLoanConfigToFirestore,
  subscribePayments,
  savePaymentToFirestore,
  batchSavePaymentsToFirestore,
  deletePaymentFromFirestore,
  resetPaymentsInFirestore,
} from "./firebase";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // State with localStorage and Firestore backing
  const [loanConfig, setLoanConfig] = useState<LoanConfig>(() => {
    try {
      const saved = localStorage.getItem("geely_ex5_config_v3");
      return saved ? JSON.parse(saved) : defaultLoanConfig;
    } catch {
      return defaultLoanConfig;
    }
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem("geely_ex5_payments_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return recalculatePayments(defaultLoanConfig, parsed);
        }
      }
      return initialPayments;
    } catch {
      return initialPayments;
    }
  });

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);

  // 1. Initial Firestore Connection Check and Real-time Subscriptions
  useEffect(() => {
    // Mandated test connection on boot
    testConnection().catch((err) => console.warn("Firestore test connection:", err));

    // Subscribe to Loan Config
    const unsubConfig = subscribeLoanConfig((cloudConfig) => {
      setLoanConfig(cloudConfig);
      localStorage.setItem("geely_ex5_config_v3", JSON.stringify(cloudConfig));
    });

    // Subscribe to Payments Collection
    const unsubPayments = subscribePayments((cloudPayments) => {
      if (cloudPayments && cloudPayments.length > 0) {
        setPayments(cloudPayments);
        localStorage.setItem("geely_ex5_payments_v3", JSON.stringify(cloudPayments));
        setIsCloudSynced(true);
      }
    });

    return () => {
      unsubConfig();
      unsubPayments();
    };
  }, []);

  // Sync to local fallback
  useEffect(() => {
    try {
      localStorage.setItem("geely_ex5_config_v3", JSON.stringify(loanConfig));
    } catch (e) {
      console.error(e);
    }
  }, [loanConfig]);

  useEffect(() => {
    try {
      localStorage.setItem("geely_ex5_payments_v3", JSON.stringify(payments));
    } catch (e) {
      console.error(e);
    }
  }, [payments]);

  // Recalculate summary
  const summary = useMemo(() => {
    return calculateAmortizationSummary(loanConfig, payments);
  }, [loanConfig, payments]);

  const currentBalance = summary.currentBalance;
  const nextPeriod = payments.length + 1;

  // Handlers with Firestore Persistence
  const handleAddPayment = async (newPayment: {
    date: string;
    amount: number;
    notes?: string;
    bankName?: string;
    transactionId?: string;
    slipUrl?: string;
  }) => {
    const rawList = payments.map((p) => ({
      id: p.id,
      date: p.date,
      amount: p.amount,
      interestPaid: p.interestPaid,
      principalPaid: p.principalPaid,
      notes: p.notes,
      bankName: p.bankName,
      transactionId: p.transactionId,
      slipUrl: p.slipUrl,
    }));

    rawList.push({
      id: `payment-${Date.now()}`,
      date: newPayment.date,
      amount: newPayment.amount,
      notes: newPayment.notes || (newPayment.amount > 13000 ? "โปะพิเศษ" : "ค่างวดปกติ"),
      bankName: newPayment.bankName,
      transactionId: newPayment.transactionId,
      slipUrl: newPayment.slipUrl,
    });

    const updated = recalculatePayments(loanConfig, rawList);
    setPayments(updated);
    try {
      await batchSavePaymentsToFirestore(updated);
    } catch (err) {
      console.error("Failed to save payment to Firestore:", err);
    }
  };

  const handleUpdatePayment = async (updated: {
    id: string;
    amount: number;
    date: string;
    interestPaid?: number;
    principalPaid?: number;
    notes?: string;
  }) => {
    const rawList = payments.map((p) => {
      if (p.id === updated.id) {
        return {
          ...p,
          amount: updated.amount,
          date: updated.date,
          interestPaid: updated.interestPaid,
          principalPaid: updated.principalPaid,
          notes: updated.notes,
        };
      }
      return p;
    });

    const recalculated = recalculatePayments(loanConfig, rawList);
    setPayments(recalculated);
    try {
      await batchSavePaymentsToFirestore(recalculated);
    } catch (err) {
      console.error("Failed to update payment in Firestore:", err);
    }
  };

  const handleDeletePayment = async (id: string) => {
    const filtered = payments.filter((p) => p.id !== id);
    const rawList = filtered.map((p) => ({
      id: p.id,
      date: p.date,
      amount: p.amount,
      interestPaid: p.interestPaid,
      principalPaid: p.principalPaid,
      notes: p.notes,
      bankName: p.bankName,
      transactionId: p.transactionId,
      slipUrl: p.slipUrl,
    }));
    const updated = recalculatePayments(loanConfig, rawList);
    setPayments(updated);
    try {
      await deletePaymentFromFirestore(id);
      await batchSavePaymentsToFirestore(updated);
    } catch (err) {
      console.error("Failed to delete payment from Firestore:", err);
    }
  };

  const handleResetToPromptData = async () => {
    setLoanConfig(defaultLoanConfig);
    setPayments(initialPayments);
    localStorage.setItem("geely_ex5_payments_v3", JSON.stringify(initialPayments));
    localStorage.setItem("geely_ex5_config_v3", JSON.stringify(defaultLoanConfig));
    try {
      await saveLoanConfigToFirestore(defaultLoanConfig);
      await resetPaymentsInFirestore(defaultLoanConfig, initialPayments);
    } catch (err) {
      console.error("Failed to reset Firestore data:", err);
    }
  };

  const handleSaveConfig = async (updatedConfig: LoanConfig) => {
    setLoanConfig(updatedConfig);
    const rawList = payments.map((p) => ({
      id: p.id,
      date: p.date,
      amount: p.amount,
      notes: p.notes,
      bankName: p.bankName,
      transactionId: p.transactionId,
      slipUrl: p.slipUrl,
    }));
    const recalculated = recalculatePayments(updatedConfig, rawList);
    setPayments(recalculated);
    try {
      await saveLoanConfigToFirestore(updatedConfig);
      await batchSavePaymentsToFirestore(recalculated);
    } catch (err) {
      console.error("Failed to save config to Firestore:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 font-['Plus_Jakarta_Sans','Prompt',sans-serif] relative overflow-x-hidden">
      {/* iPhone 17 Apple Intelligence Ambient Glow Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* iPhone 17 Liquid Glass Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAddPayment={() => setIsAddPaymentOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* KPI Cards: ยอดเต็ม, ยอดคงเหลือ, ดอกที่จ่าย, ดอกคงเหลือ */}
            <DashboardStats summary={summary} installmentCount={payments.length} />

            {/* Battery / Payoff Progress */}
            <PayoffProgress summary={summary} currentInstallment={payments.length} />

            {/* Quick Action Navigation Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab("history")}
                className="ios-glass-card hover:bg-white/[0.09] border border-white/15 hover:border-white/25 p-5 rounded-[26px] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-lg shadow-md shadow-blue-500/25">
                    📜
                  </div>
                  <div>
                    <div className="text-xs text-sky-300 font-semibold uppercase">ประวัติการผ่อนชำระ</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      ตรวจสอบยอดย้อนหลัง 13 งวด (คลิกดูรายละเอียด)
                    </div>
                  </div>
                </div>
                <div className="text-neutral-400 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("simulator")}
                className="ios-glass-card hover:bg-white/[0.09] border border-white/15 hover:border-white/25 p-5 rounded-[26px] cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-lg shadow-md shadow-rose-500/25">
                    🔮
                  </div>
                  <div>
                    <div className="text-xs text-amber-300 font-semibold uppercase">จำลองการโปะค่างวด</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      ทดลองใส่เงินก้อน คำนวณดอกเบี้ยที่ประหยัดได้
                    </div>
                  </div>
                </div>
                <div className="text-neutral-400 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Installments History */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <PaymentHistoryTable
              payments={payments}
              onDeletePayment={handleDeletePayment}
              onOpenUpload={() => setIsUploadOpen(true)}
              onEditPayment={(p) => setEditingPayment(p)}
              onResetToPromptData={handleResetToPromptData}
            />
          </div>
        )}

        {/* Tab 3: Payoff Simulator */}
        {activeTab === "simulator" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <ExtraPaymentSimulator
              loanConfig={loanConfig}
              currentBalance={currentBalance}
              currentInstallmentCount={payments.length}
            />
          </div>
        )}

        {/* Tab 4: System Architecture & Prompt */}
        {activeTab === "architecture" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <SystemDesignView />
          </div>
        )}
      </main>

      {/* Floating Action Button for Instant Slip Upload */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="fab-upload-slip-floating"
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 hover:opacity-95 text-white rounded-full shadow-lg shadow-rose-500/30 text-xs font-bold tracking-wider active:scale-95 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>สแกนสลิป</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-5 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span>🦷 Dr. Oleo Oilly</span>
            <span>•</span>
            <span>Geely EX5 Smart EV</span>
          </div>
          <div>ลดต้นลดดอก 3.67% ต่อปี • ยอดเริ่มต้น ฿800,000</div>
        </div>
      </footer>

      {/* Modals */}
      <SlipUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        loanConfig={loanConfig}
        currentBalance={currentBalance}
        nextPeriod={nextPeriod}
        onPaymentAdded={handleAddPayment}
      />

      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        loanConfig={loanConfig}
        currentBalance={currentBalance}
        nextPeriod={nextPeriod}
        onPaymentAdded={handleAddPayment}
      />

      <EditPaymentModal
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        payment={editingPayment}
        loanConfig={loanConfig}
        onUpdatePayment={handleUpdatePayment}
        onDeletePayment={handleDeletePayment}
      />

      <LoanSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        loanConfig={loanConfig}
        onSaveConfig={handleSaveConfig}
        onResetToDefault={handleResetToPromptData}
      />
    </div>
  );
}
