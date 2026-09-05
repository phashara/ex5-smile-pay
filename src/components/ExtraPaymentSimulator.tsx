import React, { useState, FC } from "react";
import { LoanConfig } from "../types";
import { formatCurrency, generateFutureProjection } from "../utils/calculator";
import { SlidersHorizontal, Sparkles, Zap, Trophy, HeartHandshake } from "lucide-react";

interface ExtraPaymentSimulatorProps {
  loanConfig: LoanConfig;
  currentBalance: number;
  currentInstallmentCount: number;
}

export const ExtraPaymentSimulator: FC<ExtraPaymentSimulatorProps> = ({
  loanConfig,
  currentBalance,
  currentInstallmentCount,
}) => {
  const [monthlySimPayment, setMonthlySimPayment] = useState<number>(15000);
  const [oneTimeLumpSum, setOneTimeLumpSum] = useState<number>(0);

  const annualRate = loanConfig.annualInterestRate;

  // Baseline standard 13,000/mo
  const baseProjection = generateFutureProjection(
    currentBalance,
    annualRate,
    loanConfig.monthlyInstallment,
    currentInstallmentCount + 1
  );
  const baseMonths = baseProjection.length;
  const baseTotalInterest = baseProjection.reduce((sum, p) => sum + p.interest, 0);

  // Simulated
  const simInitialBalance = Math.max(0, currentBalance - oneTimeLumpSum);
  const simProjection = generateFutureProjection(
    simInitialBalance,
    annualRate,
    Math.max(monthlySimPayment, 1000),
    currentInstallmentCount + 1
  );
  const simMonths = simProjection.length;
  const simTotalInterest = simProjection.reduce((sum, p) => sum + p.interest, 0);

  const monthsSaved = Math.max(0, baseMonths - simMonths);
  const interestSaved = Math.max(0, baseTotalInterest - simTotalInterest);

  const now = new Date();
  const simDebtFreeDate = new Date(now.getFullYear(), now.getMonth() + simMonths, 1);
  const formattedSimDate = simDebtFreeDate.toLocaleDateString("th-TH", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="ios-glass-card rounded-[28px] p-5 sm:p-6 border border-white/15 space-y-5 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 p-0.5 shadow-md flex items-center justify-center text-xl select-none">
            🔮
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
              <span>โปรแกรมจำลองการโปะ Geely EX5</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                What-If Planner
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              ทดลองปรับค่างวดหรือใส่เงินก้อนโบนัส เพื่อดูการประหยัดดอกเบี้ยสำหรับคุณหมอ
            </p>
          </div>
        </div>

        <div className="text-xs font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto text-neutral-300">
          เงินต้นปัจจุบัน: <strong className="text-emerald-400">฿{formatCurrency(currentBalance)}</strong>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slider 1: Monthly payment */}
        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <span>💵</span> ผ่อนประจำเดือนถัดๆ ไป
            </span>
            <span className="text-sky-300 font-extrabold text-base font-mono">
              ฿{formatCurrency(monthlySimPayment)}/ด.
            </span>
          </div>

          <input
            type="range"
            min="13000"
            max="40000"
            step="1000"
            value={monthlySimPayment}
            onChange={(e) => setMonthlySimPayment(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>13K (เดิม)</span>
            <span>20K</span>
            <span>30K</span>
            <span>40K</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[13000, 15000, 20000, 25000, 30000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setMonthlySimPayment(v)}
                className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                  monthlySimPayment === v
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
                }`}
              >
                {v === 13000 ? "13,000 (ปกติ)" : `+${formatCurrency(v)}`}
              </button>
            ))}
          </div>
        </div>

        {/* Slider 2: One-time Lump Sum */}
        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <span>🪙</span> จำลองโปะเงินก้อนงวดนี้
            </span>
            <span className="text-rose-400 font-extrabold text-base font-mono">
              ฿{formatCurrency(oneTimeLumpSum)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={oneTimeLumpSum}
            onChange={(e) => setOneTimeLumpSum(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />

          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>0</span>
            <span>50K</span>
            <span>100K</span>
            <span>200K</span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[0, 30000, 50000, 100000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setOneTimeLumpSum(v)}
                className={`px-2.5 py-1 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                  oneTimeLumpSum === v
                    ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm"
                    : "bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10"
                }`}
              >
                {v === 0 ? "ไม่มีเงินก้อน" : `โปะ ${formatCurrency(v)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Results Highlight Box (iPhone 17 Gradient Card) */}
      <div className="bg-gradient-to-br from-blue-600/30 via-indigo-600/30 to-fuchsia-600/30 rounded-[24px] p-5 border border-white/20 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 px-3 py-1 rounded-full text-amber-200">
              <span>✨</span>
              <span>ผลลัพธ์การวางแผนของคุณหมอ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black">
              ประหยัดดอกเบี้ยเพิ่มอีก{" "}
              <span className="text-amber-300 underline decoration-wavy">
                ฿{formatCurrency(interestSaved)}
              </span>{" "}
              บาท!
            </div>
            <p className="text-neutral-300 text-xs">
              และช่วยย่นเวลาให้ปิดหนี้เร็วขึ้นอีก <strong>{monthsSaved} เดือน</strong> (ปิดยอดได้ในประมาณ{" "}
              <strong className="text-white bg-white/20 px-2 py-0.5 rounded-lg">{simMonths} งวด</strong> ราวเดือน{" "}
              <strong>{formattedSimDate}</strong>)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 font-mono text-center">
            <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[11px] text-neutral-400">ดอกเบี้ยคงเหลือใหม่</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                ฿{formatCurrency(simTotalInterest)}
              </div>
              <div className="text-[10px] text-emerald-300">จากเดิม ฿{formatCurrency(baseTotalInterest)}</div>
            </div>
            <div className="bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/15">
              <div className="text-[11px] text-neutral-400">งวดที่เหลือ</div>
              <div className="text-base sm:text-lg font-bold text-sky-300 mt-0.5">
                {simMonths} งวด
              </div>
              <div className="text-[10px] text-rose-300">ลดลง {monthsSaved} งวด</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
