// ── Firestore document types ────────────────────────────────────

export interface Shop {
  name: string;
  createdAt: Date;
}

export interface StaffMember {
  uid: string;
  displayName: string;
  email: string;
  role: 'owner' | 'cashier';
  createdAt: Date;
}

export interface Wallet {
  customerName: string;
  nickname?: string;
  phone?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'credit' | 'debit' | 'reversal';

export interface Transaction {
  id?: string;
  walletId: string;
  customerName: string;
  amount: number;
  type: TransactionType;
  reason: string;
  /** Populated only for reversals – points to the original tx */
  reversedTxId?: string;
  createdAt: Date;
  createdBy: string;
}
