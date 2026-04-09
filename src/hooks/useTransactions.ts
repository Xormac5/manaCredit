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
import { getMockData, saveMockData, delay } from '../lib/mockStore';
import type { Transaction, TransactionType } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
    if (USE_MOCK) {
      const mockData = getMockData();
      const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      mockData.transactions[txId] = {
        id: txId,
        ...data,
        createdAt: new Date(),
        createdBy: user?.email ?? 'mock-user',
      };
      saveMockData(mockData);
      return delay(300, { id: txId } as any);
    }
    return addDoc(txRef(), {
      ...data,
      createdAt: serverTimestamp(),
      createdBy: user?.uid ?? 'unknown',
    });
  }

  async function getRecentGlobal(count = 5): Promise<(Transaction & { id: string })[]> {
    if (USE_MOCK) {
      const mockData = getMockData();
      const txs = Object.entries(mockData.transactions)
        .map(([txId, tx]) => ({ ...tx, id: txId }))
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, count);
      return delay(200, txs);
    }
    const q = query(txRef(), orderBy('createdAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Transaction) }));
  }

  async function getByWallet(
    walletId: string,
    count = 20,
  ): Promise<(Transaction & { id: string })[]> {
    if (USE_MOCK) {
      const mockData = getMockData();
      const txs = Object.entries(mockData.transactions)
        .map(([txId, tx]) => ({ ...tx, id: txId }))
        .filter((tx) => tx.walletId === walletId)
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, count);
      return delay(200, txs);
    }
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
    if (USE_MOCK) {
      const mockData = getMockData();
      // Costruisci range nel fuso locale
      const [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDate()];
      const start = new Date(year, month, day, 0, 0, 0, 0);
      const end = new Date(year, month, day, 23, 59, 59, 999);
      const txs = Object.entries(mockData.transactions)
        .map(([txId, tx]) => ({ ...tx, id: txId }))
        .filter((tx) => {
          const txTime = tx.createdAt instanceof Date ? tx.createdAt.getTime() : 0;
          return txTime >= start.getTime() && txTime <= end.getTime();
        })
        .sort((a, b) => {
          const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, count);
      return delay(200, txs);
    }
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
