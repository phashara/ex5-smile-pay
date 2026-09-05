import { LoanConfig } from "../types";
import { recalculatePayments } from "./calculator";

export const defaultLoanConfig: LoanConfig = {
  carModel: "Geely EX5 EV",
  totalLoanAmount: 800000,
  annualInterestRate: 3.67,
  monthlyInstallment: 13000,
  rateType: "effective",
  startDate: "2024-05-15",
  dentistName: "Dr. Oleo Oilly",
  clinicName: "Oleo Dental Studio",
};

// 13 payments matching user prompt - clean minimal notes without clutter
const rawHistoricalPayments = [
  { amount: 13000, date: "2024-06-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2024-07-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2024-08-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2024-09-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2024-10-15", notes: "ค่างวดปกติ" },
  {
    amount: 50000,
    date: "2024-11-15",
    notes: "โปะพิเศษ",
    bankName: "KBANK",
    transactionId: "TXN-0892",
  },
  {
    amount: 48000,
    date: "2024-12-15",
    notes: "โปะพิเศษ",
    bankName: "SCB",
    transactionId: "TXN-4421",
  },
  {
    amount: 130000,
    date: "2025-01-15",
    notes: "โปะพิเศษ",
    bankName: "KTB",
    transactionId: "TXN-9988",
  },
  { amount: 13000, date: "2025-02-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2025-03-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2025-04-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2025-05-15", notes: "ค่างวดปกติ" },
  { amount: 13000, date: "2025-06-15", notes: "ค่างวดปกติ" },
];

export const initialPayments = recalculatePayments(defaultLoanConfig, rawHistoricalPayments);
