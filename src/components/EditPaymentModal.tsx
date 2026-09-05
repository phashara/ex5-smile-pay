import React, { useState, useEffect, FC } from "react";
import { X, Check, Trash2 } from "lucide-react";
import { PaymentRecord, LoanConfig } from "../types";
import { formatCurrency } from "../utils/calculator";

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentRecord | null;
  loanConfig: LoanConfig;
  onUpdatePayment: (updated: {
    id: string;
    amount: number;
    date: string;
    interestPaid?: number;
    principalPaid?: number;
    notes?: string;
  }) => void;
  onDeletePayment: (id: string) => void;
}

export const EditPaymentModal: FC<EditPaymentModalProps> = ({
  isOpen,
  onClose,
  payment,
  loanConfig,
  onUpdatePayment,
  onDeletePayment,
}) => {
  const [amount, setAmount] = useState<number>(13000);
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [customInterest, setCustomInterest] = useState<number | null>(null);

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount);
      setDate(payment.date);
      setNotes(payment.notes || "");
      setCustomInterest(payment.interestPaid);
    }
  }, [payment]);

  if (!isOpen || !payment) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePayment({
      id: payment.id,
      amount,
      date,
      interestPaid: customInterest !== null ? customInterest : undefined,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="ios-glass-card rounded-[28px] max-w-md w-full p-6 border border-white/20 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center font-bold text-white text-base">
            #{payment.period.toString().padStart(2, "0")}
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              แก้ไขข้อมูลค่างวดที่ {payment.period}
            </h3>
            <p className="text-xs text-neutral-400">
              ตรวจสอบหรือปรับยอดชำระให้ตรงตามสลิปจริง
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              ยอดชำระจริง (บาท)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                required
                className="w-full px-3.5 py-2.5 text-base font-bold bg-white/10 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
              <span className="absolute right-3.5 top-3 text-sm text-neutral-400 font-medium">฿</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                วันที่ชำระ
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-medium bg-white/10 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                ดอกเบี้ยที่ตัด (บาท)
              </label>
              <input
                type="number"
                step="0.01"
                value={customInterest !== null ? customInterest : ""}
                onChange={(e) => setCustomInterest(parseFloat(e.target.value) || 0)}
                placeholder="คำนวณอัตโนมัติ"
                className="w-full px-3 py-2 text-xs font-medium bg-white/10 border border-white/15 rounded-2xl text-amber-300 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              หมายเหตุ
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ค่างวดปกติ หรือ โปะพิเศษ"
              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/15 rounded-2xl text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Quick info tile */}
          <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-xs space-y-1.5">
            <div className="flex justify-between text-neutral-400">
              <span>เงินต้นที่ตัด:</span>
              <span className="text-emerald-400 font-bold">
                ฿{formatCurrency(Math.max(0, amount - (customInterest || 0)))}
              </span>
            </div>
            <div className="text-[11px] text-neutral-500">
              * เมื่อบันทึก ระบบจะคำนวณเงินต้นคงเหลือและดอกเบี้ยงวดถัดๆ ไปใหม่อัตโนมัติ
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm(`ยืนยันลบงวดที่ ${payment.period} หรือไม่?`)) {
                  onDeletePayment(payment.id);
                  onClose();
                }
              }}
              className="inline-flex items-center text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> ลบงวดนี้
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/30 cursor-pointer"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
