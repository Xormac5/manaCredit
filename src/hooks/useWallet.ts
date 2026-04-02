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
import type { Wallet } from '../types';

export function useWallet() {
  const { shopId } = useAuth();

  const walletsRef = () => {
    if (!shopId) throw new Error('No shopId');
    return collection(db, 'shops', shopId, 'wallets');
  };

  async function getWallet(walletId: string): Promise<Wallet | null> {
    const snap = await getDoc(doc(walletsRef(), walletId));
    return snap.exists() ? (snap.data() as Wallet) : null;
  }

  async function searchWallets(term: string): Promise<(Wallet & { id: string })[]> {
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
    await setDoc(doc(walletsRef(), walletId), {
      ...data,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async function updateBalance(walletId: string, delta: number) {
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
