import { LoanConfig, PaymentRecord, AmortizationSummary } from "../types";

/**
 * Recalculates all payment records sequentially using the Effective Rate (ลดต้นลดดอก) formula
 */
export function recalculatePayments(
  loanConfig: LoanConfig,
  rawPayments: {
    id?: string;
    date: string;
    amount: number;
    interestPaid?: number;
    principalPaid?: number;
    notes?: string;
    slipUrl?: string;
    bankName?: string;
    transactionId?: string;
  }[]
): PaymentRecord[] {
  let currentBalance = loanConfig.totalLoanAmount;
  const monthlyRate = loanConfig.annualInterestRate / 100 / 12;

  const results: PaymentRecord[] = [];

  rawPayments.forEach((p, idx) => {
    const period = idx + 1;
    // Monthly interest on previous balance (unless manually supplied)
    const interest =
      typeof p.interestPaid === "number"
        ? Math.round(p.interestPaid * 100) / 100
        : Math.round(currentBalance * monthlyRate * 100) / 100;

    // Principal deducted
    let principal =
      typeof p.principalPaid === "number"
        ? Math.round(p.principalPaid * 100) / 100
        : p.amount - interest;

    if (principal > currentBalance) {
      principal = currentBalance;
    }
    if (principal < 0) {
      principal = 0;
    }

    currentBalance = Math.max(0, Math.round((currentBalance - principal) * 100) / 100);

    const isLumpSum = p.amount > loanConfig.monthlyInstallment;

    results.push({
      id: p.id || `payment-${period}`,
      period,
      date: p.date,
      amount: p.amount,
      interestPaid: interest,
      principalPaid: principal,
      remainingBalance: currentBalance,
      isLumpSum,
      slipUrl: p.slipUrl,
      bankName: p.bankName,
      transactionId: p.transactionId,
      notes: p.notes,
      createdAt: new Date().toISOString(),
    });
  });

  return results;
}

/**
 * Calculates overall summary and future projections
 */
export function calculateAmortizationSummary(
  loanConfig: LoanConfig,
  payments: PaymentRecord[],
  futureMonthlyInstallment: number = loanConfig.monthlyInstallment
): AmortizationSummary {
  const totalLoanAmount = loanConfig.totalLoanAmount;
  const monthlyRate = loanConfig.annualInterestRate / 100 / 12;

  let totalPaidAmount = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  payments.forEach((p) => {
    totalPaidAmount += p.amount;
    totalInterestPaid += p.interestPaid;
    totalPrincipalPaid += p.principalPaid;
  });

  const currentBalance =
    payments.length > 0
      ? payments[payments.length - 1].remainingBalance
      : totalLoanAmount;

  // 1. Calculate standard schedule (without extra lump-sum payments)
  let standardBalance = totalLoanAmount;
  let standardTotalInterest = 0;
  let standardMonths = 0;
  while (standardBalance > 0 && standardMonths < 360) {
    standardMonths++;
    const interest = standardBalance * monthlyRate;
    standardTotalInterest += interest;
    const principal = Math.min(standardBalance, loanConfig.monthlyInstallment - interest);
    standardBalance -= principal;
  }

  // 2. Project remaining future payments from current balance
  let simBalance = currentBalance;
  let remainingInterest = 0;
  let remainingMonths = 0;

  while (simBalance > 0 && remainingMonths < 360) {
    remainingMonths++;
    const interest = simBalance * monthlyRate;
    remainingInterest += interest;
    const principal = Math.min(simBalance, futureMonthlyInstallment - interest);
    simBalance -= principal;
  }

  // Estimated interest saved thanks to previous extra payments
  const totalActualAndProjectedInterest = totalInterestPaid + remainingInterest;
  const interestSaved = Math.max(0, standardTotalInterest - totalActualAndProjectedInterest);

  // Estimate debt-free date
  const now = new Date();
  const debtFreeDate = new Date(now.getFullYear(), now.getMonth() + remainingMonths, 1);
  const formattedDebtFree = debtFreeDate.toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  const percentagePaidOff =
    totalLoanAmount > 0
      ? Math.min(100, Math.round(((totalLoanAmount - currentBalance) / totalLoanAmount) * 1000) / 10)
      : 0;

  return {
    totalLoanAmount,
    currentBalance,
    totalPaidAmount,
    totalInterestPaid,
    totalPrincipalPaid,
    estimatedRemainingInterest: Math.round(remainingInterest),
    estimatedTotalInterestStandard: Math.round(standardTotalInterest),
    estimatedInterestSaved: Math.round(interestSaved),
    standardTotalMonths: standardMonths,
    acceleratedRemainingMonths: remainingMonths,
    estimatedDebtFreeDate: formattedDebtFree,
    percentagePaidOff,
  };
}

/**
 * Formats numbers into Thai currency format with commas
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generates future month-by-month projection schedule
 */
export function generateFutureProjection(
  currentBalance: number,
  annualRate: number,
  monthlyPayment: number,
  startPeriod: number
) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = currentBalance;
  const projection = [];
  let period = startPeriod;

  while (balance > 0 && projection.length < 120) {
    const interest = Math.round(balance * monthlyRate * 100) / 100;
    const payment = Math.min(balance + interest, monthlyPayment);
    const principal = Math.round((payment - interest) * 100) / 100;
    balance = Math.max(0, Math.round((balance - principal) * 100) / 100);

    projection.push({
      period,
      payment,
      interest,
      principal,
      remainingBalance: balance,
    });
    period++;
  }

  return projection;
}
