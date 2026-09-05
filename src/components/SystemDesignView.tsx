import React, { useState, FC } from "react";
import { Copy, Check, Terminal, Database, Workflow } from "lucide-react";

export const SystemDesignView: FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const systemPromptContent = `[SYSTEM DESIGNER PROMPT: GEELY EX5 EFFECTIVE RATE FINANCING FOR DENTIST]

Role: Senior FinTech System Architect & UI/UX Designer
User Persona: ทันตแพทย์ (Dentist) Dr. Oleo Oilly
Vehicle: Geely EX5 Smart EV (ยอดกู้ 800,000 บาท ดอกเบี้ย 3.67% ต่อปี ผ่อนเดือนละ 13,000 บาท ลดต้นลดดอก)

Historical Baseline (13 Payments):
1. 13000
2. 13000
3. 13000
4. 13000
5. 13000
6. 50000 (โปะพิเศษ)
7. 48000 (โปะพิเศษ)
8. 130000 (โปะก้อนใหญ่)
9. 13000
10. 13000
11. 13000
12. 13000
13. 13000
ยอดชำระสะสมรวม: 358,000 บาท • ยอดเงินต้นคงเหลือปัจจุบัน: ~468,013.61 บาท • ประหยัดดอกเบี้ยสะสม: > 45,000 บาท

Core Architectural Principles:
1. Effective Rate Calculation Engine:
   - ดอกเบี้ยแต่ละงวด = เงินต้นคงเหลือก่อนหน้า x (3.67% / 12)
   - ตัดเงินต้น = ค่างวดจริง - ดอกเบี้ยงวดนั้น
   - ยอดเงินโปะ (ส่วนที่จ่ายเกิน 13,000 บาท) เข้าตัดเงินต้น 100% ทันที ส่งผลให้ดอกเบี้ยงวดถัดไปลดลงทันที
2. Zero-Friction Input & Vision OCR:
   - ถ่ายรูปสลิปธนาคารจากทุกอุปกรณ์ (Mobile, iPad ที่คลินิก, Desktop)
   - Server-side Gemini 2.5 Flash Vision OCR สกัด ยอดเงิน, วันที่โอน, ธนาคาร, รหัสอ้างอิง อัตโนมัติ
3. Cloud Persistence & Synchronization:
   - จัดเก็บข้อมูลบน Firebase Firestore ใน collections 'loans' และ 'installments'
   - รองรับการแก้ไขข้อมูลย้อนหลัง และคำนวณเงินต้นคงเหลือใหม่แบบ Reactive
4. UI/UX Aesthetic:
   - iPhone 17 Liquid Glass & Titanium พร้อมไอคอนน่ารักสไตล์ทันตแพทย์ (🦷✨) และรถยนต์ไฟฟ้า (🚙⚡)`;

  const firestoreSchemaContent = `{
  "firestore": {
    "collections": {
      "loans": {
        "geely_ex5": {
          "carModel": "Geely EX5 EV",
          "totalLoanAmount": 800000,
          "annualInterestRate": 3.67,
          "monthlyInstallment": 13000,
          "rateType": "effective",
          "currentBalance": 468013.61,
          "totalInterestPaid": 25613.61,
          "totalPrincipalPaid": 331986.39,
          "dentistName": "Dr. Oleo Oilly",
          "updatedAt": "TIMESTAMP"
        }
      },
      "installments": {
        "inst_{period}": {
          "period": 14,
          "paymentDate": "2025-07-15",
          "amount": 13000,
          "interestPaid": 1431.59,
          "principalPaid": 11568.41,
          "remainingBalance": 456445.20,
          "isLumpSum": false,
          "bankName": "KBANK",
          "transactionId": "TXN-20250715-0012",
          "createdAt": "TIMESTAMP"
        }
      }
    }
  }
}`;

  return (
    <div className="ios-glass-card rounded-[28px] p-5 sm:p-6 border border-white/15 space-y-6 text-white">
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center text-xl select-none">
            📐
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight">
              สถาปัตยกรรมระบบ & AI Prompt Specification
            </h3>
            <p className="text-xs text-neutral-400">
              ผังการทำงาน (Flow), โครงสร้าง Firestore และ Prompt สำหรับนักออกแบบระบบ
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pipeline Stages (Cute iPhone 17 Widgets) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sky-400">Step 01</span>
            <span>📱</span>
          </div>
          <div className="text-white font-bold text-sm">SLIP INGESTION</div>
          <p className="text-neutral-400 text-xs">
            อัปโหลดสลิปจาก iPad ในคลินิกหรือมือถือ บันทึกได้จากทุกที่
          </p>
        </div>

        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-fuchsia-400">Step 02</span>
            <span>🪄</span>
          </div>
          <div className="text-white font-bold text-sm">GEMINI VISION OCR</div>
          <p className="text-neutral-400 text-xs">
            อ่านสลิปธนาคารไทยอัตโนมัติ สกัดยอดเงิน วันที่ และเลขที่รายการ
          </p>
        </div>

        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Step 03</span>
            <span>⚡</span>
          </div>
          <div className="text-white font-bold text-sm">EFFECTIVE MATH</div>
          <p className="text-neutral-400 text-xs">
            คำนวณตัดดอกเบี้ย 3.67% เงินส่วนเกิน 13,000 บาท ตัดเงินต้น 100%
          </p>
        </div>

        <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-400">Step 04</span>
            <span>☁️</span>
          </div>
          <div className="text-white font-bold text-sm">FIREBASE SYNC</div>
          <p className="text-neutral-400 text-xs">
            บันทึก Firestore คลาวด์ แดชบอร์ดอัปเดตแบบเรียลไทม์
          </p>
        </div>
      </div>

      {/* AI System Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>AI SYSTEM DESIGNER PROMPT (ข้อความ Prompt สำหรับนักออกแบบระบบ)</span>
          </span>
          <button
            onClick={() => copyToClipboard(systemPromptContent, "prompt")}
            className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
          >
            {copiedSection === "prompt" ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> คัดลอกแล้ว!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" /> คัดลอก Prompt
              </>
            )}
          </button>
        </div>
        <pre className="bg-black/50 p-4 rounded-2xl font-mono text-xs text-neutral-200 overflow-x-auto border border-white/10 leading-relaxed">
          {systemPromptContent}
        </pre>
      </div>

      {/* Firestore Schema */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>FIREBASE FIRESTORE DATA SCHEMA</span>
          </span>
          <button
            onClick={() => copyToClipboard(firestoreSchemaContent, "schema")}
            className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
          >
            {copiedSection === "schema" ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> คัดลอกแล้ว!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" /> คัดลอก Schema
              </>
            )}
          </button>
        </div>
        <pre className="bg-black/50 p-4 rounded-2xl font-mono text-xs text-emerald-300/90 overflow-x-auto border border-white/10 leading-relaxed">
          {firestoreSchemaContent}
        </pre>
      </div>
    </div>
  );
};
