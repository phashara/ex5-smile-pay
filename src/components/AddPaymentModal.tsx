import React, { useState, FC } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { LoanConfig } from "../types";
import { formatCurrency } from "../utils/calculator";
import confetti from "canvas-confetti";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanConfig: LoanConfig;
  currentBalance: number;
  nextPeriod: number;
  onPaymentAdded: (newPayment: {
    date: string;
    amount: number;
    notes?: string;
    bankName?: string;
    transactionId?: string;
  }) => void;
}

export const AddPaymentModal: FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  loanConfig,
  currentBalance,
  nextPeriod,
  onPaymentAdded,
}) => {
  const [amount, setAmount] = useState<number>(loanConfig.monthlyInstallment);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  if (!isOpen) return null;

  const monthlyRate = loanConfig.annualInterestRate / 100 / 12;
  const previewInterest = Math.round(currentBalance * monthlyRate * 100) / 100;
  const previewPrincipal = Math.max(0, Math.min(currentBalance, Math.round((amount - previewInterest) * 100) / 100));
  const previewNewBalance = Math.max(0, Math.round((currentBalance - previewPrincipal) * 100) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onPaymentAdded({
      date,
      amount,
      notes: amount > 13000 ? "โปะพิเศษ" : "ค่างวดปกติ",
      bankName: "กสิกรไทย",
    });

    try {
      confetti({
        particleCount: amount > 13000 ? 55 : 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#38BDF8", "#EC4899", "#10B981", "#F59E0B"],
      });
    } catch {
      // Ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="ios-glass-card rounded-[28px] max-w-md w-full p-6 border border-white/20 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shadow-md flex items-center justify-center text-xl select-none">
            💰
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              บันทึกค่างวด (งวดที่ #{nextPeriod.toString().padStart(2, "0")})
            </h3>
            <p className="text-xs text-neutral-400">
              ตัดลดต้นลดดอกทันที 3.67% ต่อปีสำหรับ Geely EX5
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              ยอดชำระ (บาท)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="any"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 text-base font-bold bg-white/10 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
              <span className="absolute right-3.5 top-3 text-sm text-neutral-400 font-medium">฿</span>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => setAmount(13000)}
                className="px-2.5 py-1 text-xs rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/10 font-semibold cursor-pointer"
              >
                13,000 (ปกติ)
              </button>
              <button
                type="button"
                onClick={() => setAmount(20000)}
                className="px-2.5 py-1 text-xs rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 border border-white/10 font-semibold cursor-pointer"
              >
                +20,000
              </button>
              <button
                type="button"
                onClick={() => setAmount(50000)}
                className="px-2.5 py-1 text-xs rounded-xl bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold cursor-pointer"
              >
                🚀 +50,000 (โปะ)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              วันที่ชำระ
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Breakdown preview card */}
          <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs space-y-2">
            <div className="flex justify-between text-neutral-400">
              <span>ตัดดอกเบี้ย:</span>
              <span className="text-amber-300 font-mono font-medium">฿{formatCurrency(previewInterest)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>ตัดเงินต้น:</span>
              <span className="text-emerald-400 font-bold font-mono">฿{formatCurrency(previewPrincipal)}</span>
            </div>
            <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2 font-mono">
              <span>เงินต้นคงเหลือใหม่:</span>
              <span className="text-emerald-300">฿{formatCurrency(previewNewBalance)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/30 cursor-pointer"
            >
              บันทึกค่างวด
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
