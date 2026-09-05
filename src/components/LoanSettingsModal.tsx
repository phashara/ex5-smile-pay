import React, { useState, FC } from "react";
import { X, Settings, RefreshCw } from "lucide-react";
import { LoanConfig } from "../types";

interface LoanSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanConfig: LoanConfig;
  onSaveConfig: (updated: LoanConfig) => void;
  onResetToDefault: () => void;
}

export const LoanSettingsModal: FC<LoanSettingsModalProps> = ({
  isOpen,
  onClose,
  loanConfig,
  onSaveConfig,
  onResetToDefault,
}) => {
  const [formData, setFormData] = useState<LoanConfig>(loanConfig);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
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

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-xl select-none">
            ⚙️
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              ตั้งค่าสัญญาเงินกู้ Geely EX5
            </h3>
            <p className="text-xs text-neutral-400">
              พารามิเตอร์อัตราดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              ชื่อผู้ผ่อน
            </label>
            <input
              type="text"
              value={formData.dentistName || ""}
              onChange={(e) => setFormData({ ...formData, dentistName: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                ยอดกู้ (บาท)
              </label>
              <input
                type="number"
                value={formData.totalLoanAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalLoanAmount: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2 text-sm font-bold font-mono bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                อัตราดอกเบี้ย (% ต่อปี)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.annualInterestRate}
                onChange={(e) =>
                  setFormData({ ...formData, annualInterestRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2 text-sm font-bold font-mono bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                ค่างวดปกติ (บาท/ด.)
              </label>
              <input
                type="number"
                value={formData.monthlyInstallment}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyInstallment: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                วันเริ่มสัญญา
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-white/10 border border-white/15 rounded-xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (confirm("รีเซ็ตเป็น 13 งวดเริ่มต้นตามข้อมูลที่กำหนด?")) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="inline-flex items-center text-xs text-neutral-400 hover:text-sky-300 transition-colors cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> รีเซ็ตข้อมูล 13 งวด
            </button>

            <div className="flex items-center space-x-2">
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
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
