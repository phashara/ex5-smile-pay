export interface LoanConfig {
  carModel: string;
  totalLoanAmount: number; // 800,000 THB
  annualInterestRate: number; // 3.67%
  monthlyInstallment: number; // 13,000 THB
  rateType: "effective"; // ลดต้นลดดอก (Effective Rate)
  startDate: string; // YYYY-MM-DD
  dentistName?: string;
  clinicName?: string;
}

export interface PaymentRecord {
  id: string;
  period: number; // งวดที่
  date: string; // YYYY-MM-DD
  amount: number; // ยอดที่จ่าย
  interestPaid: number; // ดอกเบี้ยที่ตัดงวดนี้
  principalPaid: number; // เงินต้นที่ตัดงวดนี้
  remainingBalance: number; // เงินต้นคงเหลือหลังตัด
  isLumpSum?: boolean; // จ่ายเกินค่างวดปกติ (โปะ)
  slipUrl?: string;
  bankName?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

export interface AmortizationSummary {
  totalLoanAmount: number;
  currentBalance: number;
  totalPaidAmount: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  estimatedRemainingInterest: number;
  estimatedTotalInterestStandard: number;
  estimatedInterestSaved: number;
  standardTotalMonths: number;
  acceleratedRemainingMonths: number;
  estimatedDebtFreeDate: string;
  percentagePaidOff: number;
}

export interface SlipOcrResult {
  amount: number;
  date?: string;
  transferDate?: string;
  transferTime?: string;
  bankName?: string;
  senderName?: string;
  receiverName?: string;
  transactionId?: string;
  memo?: string;
  notes?: string;
  isValidSlip?: boolean;
  summary?: string;
}
