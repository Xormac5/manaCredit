import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { getMockData, saveMockData, delay } from '../lib/mockStore';
import type { Wallet } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export function useWallet() {
  const { shopId } = useAuth();

  const walletsRef = () => {
    if (!shopId) throw new Error('No shopId');
    return collection(db, 'shops', shopId, 'wallets');
  };

  async function getWallet(walletId: string): Promise<Wallet | null> {
    if (USE_MOCK) {
      const data = getMockData();
      return delay(300, data.wallets[walletId] ?? null);
    }
    const snap = await getDoc(doc(walletsRef(), walletId));
    return snap.exists() ? (snap.data() as Wallet) : null;
  }

  async function searchWallets(term: string): Promise<(Wallet & { id: string })[]> {
    if (USE_MOCK) {
      const data = getMockData();
      const lowerTerm = term.toLowerCase();
      const results = Object.entries(data.wallets)
        .map(([walletId, w]) => ({ ...w, id: walletId }))
        .filter(
          (w) =>
            w.customerName.toLowerCase().includes(lowerTerm) ||
            w.nickname?.toLowerCase().includes(lowerTerm) ||
            w.phone?.includes(term) ||
            w.id.includes(term),
        );
      return delay(200, results);
    }
    const q = query(walletsRef(), orderBy('customerName'), limit(20));
    const snap = await getDocs(q);
    const lowerTerm = term.toLowerCase();
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Wallet) }))
      .filter(
        (w) =>
          w.customerName.toLowerCase().includes(lowerTerm) ||
          w.nickname?.toLowerCase().includes(lowerTerm) ||
          w.phone?.includes(term),
      );
  }

  async function createWallet(
    walletId: string,
    data: { customerName: string; nickname?: string; phone?: string },
  ) {
    if (USE_MOCK) {
      const mockData = getMockData();
      mockData.wallets[walletId] = {
        id: walletId,
        ...data,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveMockData(mockData);
      return delay(300, undefined);
    }
    await setDoc(doc(walletsRef(), walletId), {
      ...data,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateBalance(walletId: string, delta: number) {
    if (USE_MOCK) {
      const mockData = getMockData();
      const wallet = mockData.wallets[walletId];
      if (!wallet) throw new Error('Wallet not found');
      const newBalance = wallet.balance + delta;
      if (newBalance < 0) throw new Error('Saldo insufficiente');
      mockData.wallets[walletId].balance = newBalance;
      mockData.wallets[walletId].updatedAt = new Date();
      saveMockData(mockData);
      return delay(300, newBalance);
    }
    const wallet = await getWallet(walletId);
    if (!wallet) throw new Error('Wallet not found');
    const newBalance = wallet.balance + delta;
    if (newBalance < 0) throw new Error('Saldo insufficiente');
    await updateDoc(doc(walletsRef(), walletId), {
      balance: newBalance,
      updatedAt: serverTimestamp(),
    });
    return newBalance;
  }

  return { getWallet, searchWallets, createWallet, updateBalance };
}
