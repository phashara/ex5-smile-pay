import React, { FC } from "react";
import { Upload, Plus, Settings, SlidersHorizontal, Layers, History, Cpu, Sparkles, Car } from "lucide-react";

export type ActiveTab = "overview" | "history" | "simulator" | "architecture";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenUpload: () => void;
  onOpenAddPayment: () => void;
  onOpenSettings: () => void;
}

export const Header: FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenUpload,
  onOpenAddPayment,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0C101A]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Driver Profile (iPhone 17 Dynamic Island / iOS Squircle Badges) */}
          <div className="flex items-center space-x-3">
            {/* Cute Tooth & Car Duo Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-[#0C101A] rounded-[12px] flex items-center justify-center text-lg select-none">
                  🦷
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-[#0C101A] flex items-center justify-center text-[10px] shadow-sm">
                ⚡
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  <span>Geely EX5</span>
                  <span className="text-xs">🚙</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-sky-300 border border-sky-400/30">
                  ลดต้นลดดอก 3.67%
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-medium flex items-center gap-1.5">
                <span className="text-white/90 font-medium">Dr. Oleo Oilly</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">วงเงิน ฿800,000</span>
              </div>
            </div>
          </div>

          {/* iPhone 17 Liquid Glass Segmented Navigation */}
          <nav className="hidden md:flex items-center bg-white/[0.06] p-1 rounded-2xl border border-white/[0.1] shadow-inner">
            <button
              onClick={() => onTabChange("overview")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>ภาพรวม</span>
            </button>

            <button
              onClick={() => onTabChange("history")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>📜</span>
              <span>ประวัติ 13 งวด</span>
            </button>

            <button
              onClick={() => onTabChange("simulator")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "simulator"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>⚡</span>
              <span>จำลองโปะ</span>
            </button>

            <button
              onClick={() => onTabChange("architecture")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>📐</span>
              <span>ผังระบบ & Prompt</span>
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-add-payment-header"
              onClick={onOpenAddPayment}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 sm:mr-1 text-sky-400" />
              <span className="hidden sm:inline">บันทึกค่างวด</span>
            </button>

            <button
              id="btn-upload-slip-header"
              onClick={onOpenUpload}
              className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 hover:opacity-95 shadow-md shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span>สแกนสลิป</span>
            </button>

            <button
              id="btn-settings-header"
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
              title="ตั้งค่าสัญญาเงินกู้"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Segmented Navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-white/[0.06] text-xs">
          <button
            onClick={() => onTabChange("overview")}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 ${
              activeTab === "overview"
                ? "bg-blue-600 text-white font-bold shadow-xs"
                : "text-neutral-400"
            }`}
          >
            <span>📊</span>
            <span>ภาพรวม</span>
          </button>
          <button
            onClick={() => onTabChange("history")}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 ${
              activeTab === "history"
                ? "bg-blue-600 text-white font-bold shadow-xs"
                : "text-neutral-400"
            }`}
          >
            <span>📜</span>
            <span>13 งวด</span>
          </button>
          <button
            onClick={() => onTabChange("simulator")}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 ${
              activeTab === "simulator"
                ? "bg-blue-600 text-white font-bold shadow-xs"
                : "text-neutral-400"
            }`}
          >
            <span>⚡</span>
            <span>จำลองโปะ</span>
          </button>
          <button
            onClick={() => onTabChange("architecture")}
            className={`px-2.5 py-1 rounded-xl flex items-center gap-1 ${
              activeTab === "architecture"
                ? "bg-blue-600 text-white font-bold shadow-xs"
                : "text-neutral-400"
            }`}
          >
            <span>📐</span>
            <span>ผังระบบ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
