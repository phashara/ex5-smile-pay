import React, { useState, FC } from "react";
import { PaymentRecord } from "../types";
import { formatCurrency } from "../utils/calculator";
import { FileSpreadsheet, Search, ArrowUpDown, Edit3, Trash2, RotateCcw, Sparkles } from "lucide-react";

interface PaymentHistoryTableProps {
  payments: PaymentRecord[];
  onDeletePayment: (id: string) => void;
  onOpenUpload: () => void;
  onEditPayment: (payment: PaymentRecord) => void;
  onResetToPromptData: () => void;
}

export const PaymentHistoryTable: FC<PaymentHistoryTableProps> = ({
  payments,
  onDeletePayment,
  onOpenUpload,
  onEditPayment,
  onResetToPromptData,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  // Default to Chronological Order (1, 2, 3... 13) so user clearly sees historical sequence!
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.period.toString().includes(term) ||
      p.date.includes(term) ||
      p.amount.toString().includes(term) ||
      (p.notes && p.notes.toLowerCase().includes(term))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    return sortAsc ? a.period - b.period : b.period - a.period;
  });

  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleExportCSV = () => {
    const headers = ["งวด,วันที่,ยอดชำระ,ตัดดอกเบี้ย,ตัดเงินต้น,เงินต้นคงเหลือ,ประเภท"];
    const rows = payments.map(
      (p) =>
        `${p.period},"${p.date}",${p.amount},${p.interestPaid},${p.principalPaid},${p.remainingBalance},"${
          p.isLumpSum ? "โปะพิเศษ" : "ปกติ"
        }"`
    );
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `geely_ex5_installments_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ios-glass-card rounded-[28px] border border-white/15 overflow-hidden space-y-0 text-white">
      {/* Verification & Summary Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-fuchsia-600/20 p-4 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-sm shadow-md">
            🔍
          </div>
          <div>
            <span className="font-bold text-white block sm:inline">
              ตรวจสอบยอดย้อนหลัง 13 งวด
            </span>
            <span className="text-neutral-300 sm:ml-2">
              รวมชำระสะสม <strong>฿{formatCurrency(totalAmount)}</strong> บาท (คลิกที่แถวเพื่อแก้ไขตัวเลขได้ทันที)
            </span>
          </div>
        </div>

        <button
          onClick={onResetToPromptData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-white/15 transition-all text-xs font-semibold cursor-pointer shrink-0"
          title="รีเซ็ตย้อนหลัง 13 งวดให้ตรงกับข้อมูลตั้งต้น"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>รีเซ็ต 13 งวดเริ่มต้น</span>
        </button>
      </div>

      {/* Control Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-base shadow-md">
            📜
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>ตารางประวัติการผ่อน Geely EX5</span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {payments.length} รายการ
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              เรียงลำดับจากงวดที่ 1 ถึงงวดล่าสุด (ลดต้นลดดอก 3.67%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
            <input
              type="text"
              placeholder="ค้นหางวด, วันที่, ยอด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/15 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-400 w-36 sm:w-48 font-medium"
            />
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-1.5 px-2.5 rounded-xl border border-white/15 text-neutral-200 hover:text-white bg-white/10 hover:bg-white/15 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title={sortAsc ? "เรียงจากงวดล่าสุด" : "เรียงจากงวดแรก"}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline font-medium">
              {sortAsc ? "งวด 1 ➔ ล่าสุด" : "ล่าสุด ➔ งวด 1"}
            </span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-1.5 px-3 rounded-xl border border-white/15 text-neutral-200 hover:text-white bg-white/10 hover:bg-white/15 text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] text-[11px] uppercase tracking-wider text-neutral-400 border-b border-white/10">
              <th className="py-3 px-4">งวด</th>
              <th className="py-3 px-4">วันที่ชำระ</th>
              <th className="py-3 px-4 text-right">ยอดชำระจริง</th>
              <th className="py-3 px-4 text-right">ตัดดอกเบี้ย</th>
              <th className="py-3 px-4 text-right">ตัดเงินต้น</th>
              <th className="py-3 px-4 text-right">เงินต้นคงเหลือ</th>
              <th className="py-3 px-4 text-center">ประเภท</th>
              <th className="py-3 px-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {sorted.map((p) => {
              return (
                <tr
                  key={p.id}
                  onClick={() => onEditPayment(p)}
                  className={`hover:bg-white/[0.08] transition-colors cursor-pointer ${
                    p.isLumpSum ? "bg-amber-500/[0.06]" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold ${
                        p.isLumpSum
                          ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/40"
                          : "bg-white/10 text-neutral-300"
                      }`}
                    >
                      {p.isLumpSum && <span className="mr-1">🌟</span>}
                      #{p.period.toString().padStart(2, "0")}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-neutral-300 font-mono">
                    {p.date}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right font-black font-mono text-white text-sm">
                    ฿{formatCurrency(p.amount)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right text-amber-300 font-mono font-medium">
                    ฿{formatCurrency(p.interestPaid)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right text-emerald-400 font-bold font-mono">
                    ฿{formatCurrency(p.principalPaid)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right text-neutral-100 font-bold font-mono">
                    ฿{formatCurrency(p.remainingBalance)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    {p.isLumpSum ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <span>🚀</span> โปะพิเศษ
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">
                        ปกติ
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onEditPayment(p)}
                        className="p-1.5 text-neutral-400 hover:text-sky-300 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        title="แก้ไขงวดนี้"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบรายการงวดที่ ${p.period} หรือไม่?`)) {
                            onDeletePayment(p.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-400 text-xs">
                  ไม่พบรายการ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer link to upload */}
      <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
        <span>
          💡 คลิกที่แถวเพื่อแก้ไขยอดเงินหรือวันที่ให้ตรงกับเอกสารจริงได้ตลอดเวลา
        </span>
        <button
          onClick={onOpenUpload}
          className="text-sky-400 hover:text-sky-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>+ สแกนสลิปงวดที่ {payments.length + 1}</span>
        </button>
      </div>
    </div>
  );
};
