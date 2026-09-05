import React, { FC } from "react";
import { AmortizationSummary } from "../types";
import { formatCurrency } from "../utils/calculator";

interface PayoffProgressProps {
  summary: AmortizationSummary;
  currentInstallment: number;
}

export const PayoffProgress: FC<PayoffProgressProps> = ({ summary, currentInstallment }) => {
  const percent = Math.min(100, Math.max(0, summary.percentagePaidOff));

  return (
    <div className="ios-glass-card rounded-[28px] p-5 border border-white/15 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {/* Cute Battery / Power Squircle */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shadow-md shadow-emerald-500/25 flex items-center justify-center text-lg select-none">
            🔋
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>สถานะการปลดหนี้ Geely EX5</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {percent}% สำเร็จ
              </span>
            </div>
            <div className="text-xs text-neutral-400">
              ผ่อนแล้ว {currentInstallment} งวด • อีกเพียง ~{summary.acceleratedRemainingMonths} งวดจะหมดหนี้!
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20 text-sky-300">
            จ่ายสุทธิรวม <strong className="text-white">฿{formatCurrency(summary.totalPaidAmount)}</strong>
          </div>
          <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-neutral-300">
            ตัดต้นแล้ว <strong className="text-white">฿{formatCurrency(summary.totalPrincipalPaid)}</strong>
          </div>
          <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-emerald-300">
            คงเหลือ <strong className="text-emerald-400">฿{formatCurrency(summary.currentBalance)}</strong>
          </div>
        </div>
      </div>

      {/* iPhone 17 Glowing Battery Bar */}
      <div className="space-y-2">
        <div className="relative w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/15 p-0.5 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 shadow-md shadow-teal-400/30 transition-all duration-700 relative overflow-hidden"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Scale labels with cute emojis */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5 font-medium">
          <span className="flex items-center gap-1">🚩 เริ่มต้น (800K)</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span className="text-emerald-300 font-bold flex items-center gap-1">
            <span>🎉</span> ปลอดหนี้ (0 บาท)
          </span>
        </div>
      </div>
    </div>
  );
};
