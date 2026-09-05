import React, { useState, FC } from "react";
import { X, Copy, Check, Cpu, Database, Workflow, ShieldCheck, Sparkles, Terminal, FileCode } from "lucide-react";

interface SystemDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDesignModal: FC<SystemDesignModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const systemPromptContent = `[SYSTEM DESIGNER PROMPT: GEELY EX5 EFFECTIVE RATE LOAN MANAGEMENT SYSTEM]

คุณคือ Senior FinTech System Architect และ UI/UX Designer ผู้เชี่ยวชาญด้านสินเชื่อรถยนต์ไฟฟ้า (EV Financing) และสถาปัตยกรรมระบบคลาวด์แบบ Serverless & Event-Driven

เป้าหมายระบบ:
สร้างระบบคำนวณ วางแผน และติดตามการผ่อนชำระแบบ "ลดต้นลดดอก (Effective Rate)" สำหรับรถยนต์ไฟฟ้า Geely EX5 สำหรับผู้ใช้งานวิชาชีพทันตแพทย์ (Dentist Persona) โดยมีฟีเจอร์หลักคือ การอัปโหลดสลิปโอนเงิน (Slip OCR) เพื่อตัดยอดเงินต้นและดอกเบี้ยโดยอัตโนมัติ และรองรับการกรอกข้อมูลจากทุกอุปกรณ์ (Mobile, iPad ที่คลินิก, Desktop) จัดเก็บข้อมูลบน Firebase Firestore แบบ Real-time

1. Core Business Rules & Financial Mathematics:
- รถยนต์: Geely EX5
- ยอดกู้เริ่มต้น: 800,000 บาท
- อัตราดอกเบี้ย: 3.67% ต่อปี (ลดต้นลดดอก / Effective Rate)
- ค่างวดมาตรฐาน: 13,000 บาท / เดือน
- สูตรการคำนวณแต่ละงวด:
  * ดอกเบี้ยต่องวด = ยอดหนี้คงเหลือก่อนหน้า × (3.67 / 100) × (จำนวนวัน / 365 หรือ 1/12)
  * ตัดเงินต้น = ยอดชำระจริง - ดอกเบี้ยงวดนั้น
  * ยอดหนี้คงเหลือใหม่ = ยอดหนี้คงเหลือก่อนหน้า - ตัดเงินต้น
  * เงินโปะพิเศษ (Lump Sum): หากชำระเกิน 13,000 บาท ส่วนเกินทั้งหมดจะไปตัดเงินต้น 100% ทันที ส่งผลให้ดอกเบี้ยงวดถัดไปลดลงทันที

2. User Persona & UI/UX Aesthetic:
- ทันตแพทย์ (Dentist): เวลาทำงานไม่แน่นอน ต้องทำฟันคนไข้ การบันทึกต้องเร็วมาก (Zero-friction) ถ่ายรูปสลิปแล้วจบ หรือแตะ Quick Record
- อารมณ์และการออกแบบ (UI Theme): น่ารัก มีสีสันสดใส (Mint Green #14B8A6, Pastel Sky Blue, Soft Lavender, Sunny Gold) แทรกธีมฟันสะอาด (🦷 Clean Teeth, Sparkles ✨) คู่กับรถยนต์ไฟฟ้า EV (🚗⚡ แบตเตอรี่ปลดหนี้)

3. Data Pipeline & System Flow:
- Step 1 [Ingestion]: ถ่ายรูปหรืออัปโหลดสลิปธนาคารไทย (KBANK, SCB, KTB, BBL, PromptPay)
- Step 2 [AI Vision OCR]: ส่งรูปไปยัง Server-side Gemini API (gemini-3.8-flash) สกัดจำนวนเงิน, วันที่โอน, ธนาคาร, รหัสอ้างอิง
- Step 3 [Financial Engine]: ดึงยอดคงเหลือล่าสุดจาก Firestore คำนวณดอกเบี้ยงวดปัจจุบัน และหักเงินต้น
- Step 4 [Persistence]: บันทึกข้อมูลลง Firestore ใน collection \`installments\` และอัปเดต snapshot ที่ \`loans/geely_ex5\`
- Step 5 [Reactive UI]: แดชบอร์ดอัปเดตแบบ Real-time: ยอดเต็ม, ยอดคงเหลือ, ดอกที่จ่าย, ดอกคงเหลือ, ดอกเบี้ยที่ประหยัดได้ พร้อมแอนิเมชันเฉลิมฉลอง`;

  const firestoreSchemaContent = `{
  "firestore": {
    "collections": {
      "loans": {
        "documentId": "geely_ex5_{userId}",
        "fields": {
          "carModel": "Geely EX5 (Smart EV)",
          "totalLoanAmount": 800000,
          "annualInterestRate": 3.67,
          "monthlyInstallment": 13000,
          "rateType": "effective",
          "currentBalance": 468013.61,
          "totalInterestPaid": 25613.61,
          "totalPrincipalPaid": 331986.39,
          "totalPaidAmount": 358000,
          "updatedAt": "TIMESTAMP"
        }
      },
      "installments": {
        "documentId": "inst_{periodNumber}",
        "fields": {
          "loanId": "geely_ex5_{userId}",
          "period": 14,
          "paymentDate": "2025-07-15",
          "amount": 13000,
          "interestPaid": 1431.59,
          "principalPaid": 11568.41,
          "remainingBalance": 456445.20,
          "isLumpSum": false,
          "bankName": "KBANK",
          "transactionId": "TXN-20250715-0012",
          "slipStorageUrl": "gs://...",
          "notes": "ค่างวดประจำเดือน",
          "createdAt": "TIMESTAMP"
        }
      }
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-purple-100 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-xs">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>สถาปัตยกรรมระบบ & AI Prompt สำหรับนักออกแบบระบบ</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                System Blueprint
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              ผังการทำงาน (Flow), AI System Prompt และโครงสร้าง Firebase สำหรับระบบผ่อนลดต้นลดดอก Geely EX5
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 pr-1 text-slate-700">
          {/* Visual Architecture Flow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-purple-600" />
              <span>1. ผังการทำงานของระบบ (System Architecture Flow)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-teal-900 flex items-center gap-1">
                    <span>1. Ingestion (ทุกที่)</span>
                  </div>
                  <p className="text-[11px] text-teal-700 mt-1">
                    หมอฟันถ่ายรูปสลิปจากมือถือ/iPad ที่คลินิก หรืออัปโหลดไฟล์/พิมพ์ตัวเลขเอง
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-teal-600 font-semibold bg-white/80 px-2 py-0.5 rounded-md self-start">
                  Mobile / Web UI
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-blue-900">2. Gemini OCR</div>
                  <p className="text-[11px] text-blue-700 mt-1">
                    API อ่านภาพสลิปแบบ Vision สกัด ยอดเงิน, วันที่โอน, ธนาคาร, Ref อัตโนมัติ
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-blue-600 font-semibold bg-white/80 px-2 py-0.5 rounded-md self-start">
                  Gemini 2.5 Flash
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-amber-900">3. Effective Engine</div>
                  <p className="text-[11px] text-amber-700 mt-1">
                    คำนวณดอก 3.67%/ปี ตามวันจริง หักต้นเต็มเม็ด ยอดโปะตัดต้น 100%
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-600 font-semibold bg-white/80 px-2 py-0.5 rounded-md self-start">
                  Amortization Math
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-purple-900">4. Firebase Sync</div>
                  <p className="text-[11px] text-purple-700 mt-1">
                    บันทึก Firestore Real-time แดชบอร์ดอัปเดตยอดคงเหลือและดอกเบี้ยทันที
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-purple-600 font-semibold bg-white/80 px-2 py-0.5 rounded-md self-start">
                  Firestore & Cache
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompt Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-600" />
                <span>2. ข้อความ Prompt สำหรับ System Designer & AI Builder</span>
              </h4>
              <button
                onClick={() => copyToClipboard(systemPromptContent, "prompt")}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors cursor-pointer"
              >
                {copiedSection === "prompt" ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> คัดลอก Prompt
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
              {systemPromptContent}
            </div>
          </div>

          {/* Firebase Schema Spec */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-600" />
                <span>3. โครงสร้างฐานข้อมูล Firebase Firestore (Data Schema)</span>
              </h4>
              <button
                onClick={() => copyToClipboard(firestoreSchemaContent, "schema")}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors cursor-pointer"
              >
                {copiedSection === "schema" ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> คัดลอก Schema
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-teal-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-slate-800">
              {firestoreSchemaContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            สถาปัตยกรรมสำหรับ Geely EX5 Effective Rate Financing • Dentist Edition
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
