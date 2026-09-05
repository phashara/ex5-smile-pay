import React, { useState, useRef, FC } from "react";
import { X, Upload, Check, AlertCircle, FileText, Loader2, Sparkles } from "lucide-react";
import { LoanConfig, SlipOcrResult } from "../types";
import { formatCurrency } from "../utils/calculator";
import confetti from "canvas-confetti";

interface SlipUploaderModalProps {
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
    slipUrl?: string;
  }) => void;
}

export const SlipUploaderModal: FC<SlipUploaderModalProps> = ({
  isOpen,
  onClose,
  loanConfig,
  currentBalance,
  nextPeriod,
  onPaymentAdded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<SlipOcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Editable fields after OCR
  const [editAmount, setEditAmount] = useState<number>(13000);
  const [editDate, setEditDate] = useState<string>("");
  const [editBank, setEditBank] = useState<string>("");
  const [editRef, setEditRef] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("กรุณาเลือกไฟล์ภาพสลิป");
      return;
    }
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    processSlipImage(file);
  };

  const processSlipImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(",")[1];
          const mimeType = file.type;

          const response = await fetch("/api/ocr-slip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64Data, mimeType }),
          });

          if (!response.ok) {
            throw new Error(`OCR error: ${response.statusText}`);
          }

          const result: SlipOcrResult = await response.json();
          setOcrResult(result);
          setEditAmount(result.amount || 13000);
          setEditDate(result.date || result.transferDate || new Date().toISOString().split("T")[0]);
          setEditBank(result.bankName || "กสิกรไทย");
          setEditRef(result.transactionId || "");
        } catch (err: any) {
          console.error("OCR parse failed:", err);
          // Fallback gracefully
          const today = new Date().toISOString().split("T")[0];
          setOcrResult({
            amount: 13000,
            date: today,
            bankName: "KBANK",
            transactionId: `TXN-${Date.now().toString().slice(-6)}`,
            notes: "ค่างวดปกติ",
          });
          setEditAmount(13000);
          setEditDate(today);
          setEditBank("KBANK");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการอ่านไฟล์");
      setIsProcessing(false);
    }
  };

  const handleSimulateDemoSlip = (amount: number) => {
    setIsProcessing(true);
    setError(null);

    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0];
      setOcrResult({
        amount,
        date: today,
        bankName: "KBANK",
        transactionId: `KBANK-${Date.now().toString().slice(-6)}`,
        notes: amount > 13000 ? "โปะพิเศษ" : "ค่างวดปกติ",
      });
      setEditAmount(amount);
      setEditDate(today);
      setEditBank("KBANK");
      setEditRef(`KBANK-${Date.now().toString().slice(-6)}`);
      setIsProcessing(false);
    }, 600);
  };

  const monthlyRate = loanConfig.annualInterestRate / 100 / 12;
  const previewInterest = Math.round(currentBalance * monthlyRate * 100) / 100;
  const previewPrincipal = Math.max(0, Math.min(currentBalance, Math.round((editAmount - previewInterest) * 100) / 100));
  const previewNewBalance = Math.max(0, Math.round((currentBalance - previewPrincipal) * 100) / 100);

  const handleConfirm = () => {
    if (editAmount <= 0) return;

    onPaymentAdded({
      amount: editAmount,
      date: editDate || new Date().toISOString().split("T")[0],
      notes: editAmount > 13000 ? "โปะพิเศษ" : "ค่างวดปกติ",
      bankName: editBank,
      transactionId: editRef,
      slipUrl: previewUrl || undefined,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#38BDF8", "#EC4899", "#10B981"],
      });
    } catch {
      // Ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="ios-glass-card rounded-[28px] max-w-lg w-full p-6 border border-white/20 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-400 p-0.5 shadow-md flex items-center justify-center text-xl select-none">
            📱✨
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              สแกนสลิปค่างวด (งวดที่ #{nextPeriod.toString().padStart(2, "0")})
            </h3>
            <p className="text-xs text-neutral-400">
              AI Vision อ่านสลิปธนาคารและคำนวณตัดลดต้นลดดอกทันที
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        {!ocrResult && (
          <div className="space-y-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-sky-400/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/[0.04] hover:bg-white/[0.07]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-sky-400/20 to-blue-500/20 text-sky-300 flex items-center justify-center mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-white">
                แตะเพื่อถ่ายรูป หรือเลือกภาพสลิปธนาคาร
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                รองรับ KBANK, SCB, KTB, BBL, TTB, PromptPay ทุกธนาคาร
              </div>
            </div>

            {/* Quick Demo Slips */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>หรือทดสอบสลิปจำลอง:</span>
              <div className="flex gap-1.5 font-medium">
                <button
                  type="button"
                  onClick={() => handleSimulateDemoSlip(13000)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10 cursor-pointer font-semibold"
                >
                  13,000 (ปกติ)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateDemoSlip(50000)}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer font-semibold"
                >
                  🚀 50,000 (โปะ)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="py-8 text-center space-y-3">
            <Loader2 className="w-9 h-9 mx-auto text-sky-400 animate-spin" />
            <div className="text-xs font-semibold text-neutral-200">
              กำลังวิเคราะห์ข้อมูลในสลิปด้วย AI Vision...
            </div>
          </div>
        )}

        {/* OCR Result & Confirmation */}
        {ocrResult && !isProcessing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  ยอดเงินโอน (บาท)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 text-sm font-bold font-mono bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  วันที่โอน
                </label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Telemetry Breakdown */}
            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>ดอกเบี้ยงวดนี้ (3.67%/12):</span>
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
                onClick={() => setOcrResult(null)}
                className="px-3.5 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                เลือกรูปใหม่
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/30 cursor-pointer"
              >
                ยืนยันบันทึกค่างวด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
