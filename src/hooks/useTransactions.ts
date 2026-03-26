import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { Transaction, TransactionType } from '../types';

export function useTransactions() {
  const { shopId, user } = useAuth();

  const txRef = () => {
    if (!shopId) throw new Error('No shopId');
    return collection(db, 'shops', shopId, 'transactions');
  };

  async function addTransaction(data: {
    walletId: string;
    customerName: string;
    amount: number;
    type: TransactionType;
    reason: string;
    reversedTxId?: string;
  }) {
    return addDoc(txRef(), {
      ...data,
      createdAt: serverTimestamp(),
      createdBy: user?.uid ?? 'unknown',
    });
  }

  async function getRecentGlobal(count = 5): Promise<(Transaction & { id: string })[]> {
    const q = query(txRef(), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }));
  }

  async function getByWallet(
    walletId: string,
    count = 20,
  ): Promise<(Transaction & { id: string })[]> {
    const q = query(
      txRef(),
      where('walletId', '==', walletId),
      orderBy('createdAt', 'desc'),
      limit(count),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }));
  }

  async function getDailyTransactions(
    date: Date,
    count = 100,
  ): Promise<(Transaction & { id: string })[]> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const q = query(
      txRef(),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end),
      orderBy('createdAt', 'desc'),
      limit(count),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }));
  }

  return { addTransaction, getRecentGlobal, getByWallet, getDailyTransactions };
}
