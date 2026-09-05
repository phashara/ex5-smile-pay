import React, { FC } from "react";
import { AmortizationSummary } from "../types";
import { formatCurrency } from "../utils/calculator";
import { ArrowDownRight, Sparkles, TrendingDown, Clock, ShieldCheck, Zap, PieChart, Wallet } from "lucide-react";

interface DashboardStatsProps {
  summary: AmortizationSummary;
  installmentCount: number;
}

export const DashboardStats: FC<DashboardStatsProps> = ({ summary, installmentCount }) => {
  const principalPercent = summary.totalPaidAmount > 0
    ? Math.round((summary.totalPrincipalPaid / summary.totalPaidAmount) * 1000) / 10
    : 0;
  const interestPercent = summary.totalPaidAmount > 0
    ? Math.round((summary.totalInterestPaid / summary.totalPaidAmount) * 1000) / 10
    : 0;

  return (
    <div className="space-y-4">
      {/* 1. iPhone 17 Smart Highlight Widget (Dentist Loan Overview & Savings) */}
      <div className="ios-glass-card rounded-[28px] p-5 sm:p-6 border border-white/15 relative overflow-hidden">
        {/* Apple Intelligence ambient glowing halos */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-500/20 via-fuchsia-500/15 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-sky-500/15 via-teal-500/10 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            {/* Cute Tooth & Sparkle Squircle Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/25 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-[#121826]/90 rounded-[14px] flex items-center justify-center text-2xl select-none">
                🦷✨
              </div>
            </div>
            <div>
              <div className="text-xs text-sky-300 font-semibold tracking-wide flex items-center gap-1.5">
                <span>DENTIST LOAN TELEMETRY • DR. OLEO OILLY</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                จ่ายสุทธิแล้วทั้งหมด{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-emerald-300 to-teal-300 font-extrabold font-mono">
                  ฿{formatCurrency(summary.totalPaidAmount)}
                </span>{" "}
                <span className="text-xs text-neutral-400 font-normal">
                  (เข้าตัดเงินต้นไปแล้ว {summary.percentagePaidOff}% ของยอดกู้)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-2xl">
              <div className="text-[10px] text-emerald-300 font-semibold uppercase flex items-center gap-1">
                <span>🪙</span> ประหยัดดอกเบี้ยสะสม
              </div>
              <div className="text-emerald-400 font-extrabold text-sm sm:text-base font-mono mt-0.5">
                +฿{formatCurrency(summary.estimatedInterestSaved)}
              </div>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 px-3.5 py-2 rounded-2xl">
              <div className="text-[10px] text-rose-300 font-semibold uppercase flex items-center gap-1">
                <span>⏳</span> ผ่อนจบเร็วขึ้น
              </div>
              <div className="text-rose-400 font-extrabold text-sm sm:text-base font-mono mt-0.5">
                ~{Math.max(0, summary.standardTotalMonths - installmentCount - summary.acceleratedRemainingMonths)} เดือน
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 px-3.5 py-2 rounded-2xl">
              <div className="text-[10px] text-blue-300 font-semibold uppercase flex items-center gap-1">
                <span>📊</span> รวมยอดกู้+ดอกเบี้ยสุทธิ
              </div>
              <div className="text-blue-300 font-extrabold text-sm sm:text-base font-mono mt-0.5">
                ~฿{formatCurrency(summary.totalPaidAmount + summary.currentBalance + summary.estimatedRemainingInterest)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 5 Main Metric Widgets (Featuring "เงินสุทธิที่จ่ายทั้งหมด" Hero Widget) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Widget 1: ⭐ เงินสุทธิที่จ่ายทั้งหมด (FEATURED CARD) */}
        <div className="ios-glass-card rounded-[26px] p-5 border border-sky-400/30 hover:border-sky-400/50 transition-all relative overflow-hidden group shadow-lg shadow-sky-500/10 bg-gradient-to-br from-blue-900/30 via-slate-900/40 to-indigo-950/40">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold text-sky-300 flex items-center gap-1">
              <span>💎</span>
              <span>เงินสุทธิที่จ่ายทั้งหมด</span>
            </div>
            {/* Cute Diamond / Wallet Squircle */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-sm shadow-md shadow-blue-500/30 select-none">
              💳
            </div>
          </div>

          <div className="mt-2.5 text-2xl font-black font-mono tracking-tight text-white">
            ฿{formatCurrency(summary.totalPaidAmount)}
          </div>

          {/* Breakdown Pills: ตัดต้น vs ดอกเบี้ย */}
          <div className="mt-3 space-y-1.5 pt-2.5 border-t border-white/10 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ตัดเงินต้น:
              </span>
              <span className="font-mono font-bold text-emerald-300">
                ฿{formatCurrency(summary.totalPrincipalPaid)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                ตัดดอกเบี้ย:
              </span>
              <span className="font-mono font-medium text-amber-300">
                ฿{formatCurrency(summary.totalInterestPaid)}
              </span>
            </div>

            {/* Micro mini progress ratio */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden flex mt-1">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${principalPercent}%` }}
                title={`เงินต้น ${principalPercent}%`}
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: `${interestPercent}%` }}
                title={`ดอกเบี้ย ${interestPercent}%`}
              />
            </div>
          </div>
        </div>

        {/* Widget 2: ยอดกู้เต็มสัญญา */}
        <div className="ios-glass-card rounded-[26px] p-5 border border-white/15 hover:border-white/25 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-400">
              ยอดกู้เต็มสัญญา
            </div>
            {/* Cute EV Car Squircle */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-sm shadow-md shadow-blue-500/30 select-none">
              🚙
            </div>
          </div>

          <div className="mt-3 text-2xl font-black font-mono tracking-tight text-white">
            ฿{formatCurrency(summary.totalLoanAmount)}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400 flex items-center justify-between pt-2.5 border-t border-white/10">
            <span>อัตราดอกเบี้ย</span>
            <span className="font-semibold text-sky-300">3.67% ลดต้นลดดอก</span>
          </div>
        </div>

        {/* Widget 3: ยอดเงินต้นคงเหลือ */}
        <div className="ios-glass-card rounded-[26px] p-5 border border-white/15 hover:border-emerald-500/30 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-400">
              ยอดเงินต้นคงเหลือ
            </div>
            {/* Cute Coin / Sparkle Squircle */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-sm shadow-md shadow-emerald-500/30 select-none">
              🪙
            </div>
          </div>

          <div className="mt-3 text-2xl font-black font-mono tracking-tight text-emerald-400">
            ฿{formatCurrency(summary.currentBalance)}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400 flex items-center justify-between pt-2.5 border-t border-white/10">
            <span>ชำระไปแล้ว</span>
            <span className="font-semibold text-neutral-200">{installmentCount} งวด</span>
          </div>
        </div>

        {/* Widget 4: ดอกเบี้ยที่จ่ายแล้ว */}
        <div className="ios-glass-card rounded-[26px] p-5 border border-white/15 hover:border-amber-500/30 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-400">
              ดอกเบี้ยที่จ่ายสะสม
            </div>
            {/* Cute Receipt / Shield Squircle */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-sm shadow-md shadow-amber-500/30 select-none">
              🧾
            </div>
          </div>

          <div className="mt-3 text-2xl font-black font-mono tracking-tight text-amber-300">
            ฿{formatCurrency(summary.totalInterestPaid)}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400 flex items-center justify-between pt-2.5 border-t border-white/10">
            <span>สัดส่วนดอกเบี้ย</span>
            <span className="font-mono text-amber-200 font-semibold">{interestPercent}% ของยอดจ่าย</span>
          </div>
        </div>

        {/* Widget 5: ดอกคงเหลือประมาณการ */}
        <div className="ios-glass-card rounded-[26px] p-5 border border-white/15 hover:border-fuchsia-500/30 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-neutral-400">
              ดอกคงเหลือประมาณการ
            </div>
            {/* Cute Target Goal Squircle */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-400 to-pink-500 flex items-center justify-center text-sm shadow-md shadow-fuchsia-500/30 select-none">
              🎯
            </div>
          </div>

          <div className="mt-3 text-2xl font-black font-mono tracking-tight text-fuchsia-300">
            ~฿{formatCurrency(summary.estimatedRemainingInterest)}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400 flex items-center justify-between pt-2.5 border-t border-white/10">
            <span>เป้าหมายปลดหนี้</span>
            <span className="font-semibold text-white">{summary.estimatedDebtFreeDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
