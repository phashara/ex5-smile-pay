import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDocFromServer,
  setDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";
import { LoanConfig, PaymentRecord } from "./types";
import { defaultLoanConfig, initialPayments } from "./utils/initialData";

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Operation Types for Hardened Error Handling
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Boot (Required by Skill)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore connection: client is offline or starting up.");
      return false;
    }
    // Connection test document may not exist; this is expected
    return true;
  }
}

// Subscribe to Loan Configuration
export function subscribeLoanConfig(
  onData: (config: LoanConfig) => void,
  onError?: (err: unknown) => void
) {
  const configDocRef = doc(db, "loan_config", "geely_ex5");
  return onSnapshot(
    configDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData({
          carModel: data.carModel || defaultLoanConfig.carModel,
          totalLoanAmount: Number(data.totalLoanAmount) || defaultLoanConfig.totalLoanAmount,
          annualInterestRate: Number(data.annualInterestRate) || defaultLoanConfig.annualInterestRate,
          monthlyInstallment: Number(data.monthlyInstallment) || defaultLoanConfig.monthlyInstallment,
          rateType: "effective",
          startDate: data.startDate || defaultLoanConfig.startDate,
          dentistName: data.dentistName || defaultLoanConfig.dentistName,
          clinicName: data.clinicName || defaultLoanConfig.clinicName,
        });
      } else {
        // First boot initialization
        try {
          await setDoc(configDocRef, {
            ...defaultLoanConfig,
            updatedAt: new Date().toISOString(),
          });
          onData(defaultLoanConfig);
        } catch (e) {
          console.warn("Could not seed default loan config:", e);
        }
      }
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.GET, "loan_config/geely_ex5");
    }
  );
}

// Save Loan Configuration
export async function saveLoanConfigToFirestore(config: LoanConfig): Promise<void> {
  const configDocRef = doc(db, "loan_config", "geely_ex5");
  try {
    await setDoc(
      configDocRef,
      {
        carModel: config.carModel || "Geely EX5 EV",
        dentistName: config.dentistName || "Dr. Oleo Oilly",
        totalLoanAmount: Number(config.totalLoanAmount),
        annualInterestRate: Number(config.annualInterestRate),
        monthlyInstallment: Number(config.monthlyInstallment),
        startDate: config.startDate,
        rateType: "effective",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "loan_config/geely_ex5");
  }
}

// Subscribe to Payments Collection
export function subscribePayments(
  onData: (payments: PaymentRecord[]) => void,
  onError?: (err: unknown) => void
) {
  const paymentsCol = collection(db, "payments");
  return onSnapshot(
    paymentsCol,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial 13 payments into Firestore if collection is empty
        try {
          const batch = writeBatch(db);
          initialPayments.forEach((p) => {
            const pRef = doc(db, "payments", p.id);
            batch.set(pRef, {
              id: p.id,
              period: p.period,
              date: p.date,
              amount: p.amount,
              principalPaid: p.principalPaid,
              interestPaid: p.interestPaid,
              remainingBalance: p.remainingBalance,
              isExtraPayment: Boolean(p.isLumpSum),
              notes: p.notes || "",
              bankName: p.bankName || "",
              transactionId: p.transactionId || "",
              slipUrl: p.slipUrl || "",
              createdAt: p.createdAt || new Date().toISOString(),
            });
          });
          await batch.commit();
        } catch (e) {
          console.warn("Could not seed initial payments:", e);
          onData(initialPayments);
        }
      } else {
        const records: PaymentRecord[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          records.push({
            id: d.id || docSnap.id,
            period: Number(d.period) || 1,
            date: d.date || "",
            amount: Number(d.amount) || 0,
            principalPaid: Number(d.principalPaid) || 0,
            interestPaid: Number(d.interestPaid) || 0,
            remainingBalance: Number(d.remainingBalance) || 0,
            isLumpSum: Boolean(d.isExtraPayment || d.isLumpSum),
            notes: d.notes || "",
            bankName: d.bankName || "",
            transactionId: d.transactionId || "",
            slipUrl: d.slipUrl || "",
            createdAt: d.createdAt || new Date().toISOString(),
          });
        });
        // Sort chronologically 1..N
        records.sort((a, b) => a.period - b.period);
        onData(records);
      }
    },
    (err) => {
      if (onError) onError(err);
      handleFirestoreError(err, OperationType.LIST, "payments");
    }
  );
}

// Add or Update Single Payment
export async function savePaymentToFirestore(payment: PaymentRecord): Promise<void> {
  const pRef = doc(db, "payments", payment.id);
  try {
    await setDoc(
      pRef,
      {
        id: payment.id,
        period: Number(payment.period),
        date: payment.date,
        amount: Number(payment.amount),
        principalPaid: Number(payment.principalPaid),
        interestPaid: Number(payment.interestPaid),
        remainingBalance: Number(payment.remainingBalance),
        isExtraPayment: Boolean(payment.isLumpSum),
        notes: payment.notes || "",
        bankName: payment.bankName || "",
        transactionId: payment.transactionId || "",
        slipUrl: payment.slipUrl || "",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `payments/${payment.id}`);
  }
}

// Batch Save Payments (used when recalculating entire schedule)
export async function batchSavePaymentsToFirestore(payments: PaymentRecord[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    payments.forEach((p) => {
      const pRef = doc(db, "payments", p.id);
      batch.set(
        pRef,
        {
          id: p.id,
          period: Number(p.period),
          date: p.date,
          amount: Number(p.amount),
          principalPaid: Number(p.principalPaid),
          interestPaid: Number(p.interestPaid),
          remainingBalance: Number(p.remainingBalance),
          isExtraPayment: Boolean(p.isLumpSum),
          notes: p.notes || "",
          bankName: p.bankName || "",
          transactionId: p.transactionId || "",
          slipUrl: p.slipUrl || "",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "payments");
  }
}

// Delete Payment
export async function deletePaymentFromFirestore(id: string): Promise<void> {
  const pRef = doc(db, "payments", id);
  try {
    await deleteDoc(pRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `payments/${id}`);
  }
}

// Reset Payments in Firestore back to 13 initial payments
export async function resetPaymentsInFirestore(
  config: LoanConfig,
  fresh13: PaymentRecord[]
): Promise<void> {
  try {
    // Delete existing
    const existingSnap = await getDocs(collection(db, "payments"));
    const deleteBatch = writeBatch(db);
    existingSnap.forEach((docSnap) => {
      deleteBatch.delete(docSnap.ref);
    });
    await deleteBatch.commit();

    // Re-seed
    const seedBatch = writeBatch(db);
    fresh13.forEach((p) => {
      const pRef = doc(db, "payments", p.id);
      seedBatch.set(pRef, {
        id: p.id,
        period: p.period,
        date: p.date,
        amount: p.amount,
        principalPaid: p.principalPaid,
        interestPaid: p.interestPaid,
        remainingBalance: p.remainingBalance,
        isExtraPayment: Boolean(p.isLumpSum),
        notes: p.notes || "",
        bankName: p.bankName || "",
        transactionId: p.transactionId || "",
        slipUrl: p.slipUrl || "",
        createdAt: p.createdAt || new Date().toISOString(),
      });
    });
    await seedBatch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "payments");
  }
}

// Google Authentication
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    return null;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}
