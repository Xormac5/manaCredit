import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { getMockData, saveMockData, delay } from '../lib/mockStore';
import type { TransactionType, Wallet } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export function useCashierOperations() {
  const { shopId, user } = useAuth();
  
  async function processTransaction(data: {
    walletId: string;
    customerName: string;
    amount: number;
    type: TransactionType;
    reason: string;
  }) {
    if (!shopId) throw new Error('Negozio non definito');
    if (!user) throw new Error('Operatore non autenticato');

    if (USE_MOCK) {
      // Mock mode implementation
      const mockData = getMockData();
      const wallet = mockData.wallets[data.walletId];
      
      if (!wallet) throw new Error('Profilo cliente non trovato');
      
      const delta = data.type === 'credit' ? data.amount : -data.amount;
      const newBalance = wallet.balance + delta;
      
      if (newBalance < 0) {
        throw new Error('Saldo insufficiente per completare l\'operazione');
      }
      
      // Update wallet
      mockData.wallets[data.walletId].balance = newBalance;
      mockData.wallets[data.walletId].updatedAt = new Date();
      
      // Create transaction record
      const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      mockData.transactions[txId] = {
        id: txId,
        ...data,
        createdAt: new Date(),
        createdBy: user.email || 'mock-user',
      };
      
      saveMockData(mockData);
      return delay(300, newBalance);
    }

    const walletRef = doc(db, 'shops', shopId, 'wallets', data.walletId);
    const txRef = doc(collection(db, 'shops', shopId, 'transactions'));
    
    let finalBalance = 0;

    await runTransaction(db, async (transaction) => {
        const walletSnap = await transaction.get(walletRef);
        if (!walletSnap.exists()) throw new Error('Profilo cliente non trovato');
        
        const currentBalance = (walletSnap.data() as Wallet).balance || 0;
        const delta = data.type === 'credit' ? data.amount : -data.amount;
        const newBalance = currentBalance + delta;
        
        if (newBalance < 0) {
            throw new Error('Saldo insufficiente per completare l\'operazione');
        }

        // 1. Aggiorna saldo in modo atomico
        transaction.update(walletRef, {
            balance: newBalance,
            updatedAt: serverTimestamp(),
        });

        // 2. Crea log immutabile
        transaction.set(txRef, {
            ...data,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        });

        finalBalance = newBalance;
    });

    return finalBalance;
  }

  async function processReversal(tx: { id: string; walletId: string; customerName: string; amount: number; type: TransactionType; reason: string }) {
      if (!shopId) throw new Error('Negozio non definito');
      if (!user) throw new Error('Operatore non autenticato');
      if (tx.type === 'reversal') throw new Error('Impossibile stornare uno storno già effettuato');

      if (USE_MOCK) {
        // Mock mode implementation
        const mockData = getMockData();
        const wallet = mockData.wallets[tx.walletId];
        
        if (!wallet) throw new Error('Profilo cliente non trovato');
        
        const reverseDelta = tx.type === 'credit' ? -tx.amount : tx.amount;
        const newBalance = wallet.balance + reverseDelta;
        
        if (newBalance < 0) {
          throw new Error('Storno annullato. Il nuovo saldo del cliente diventerebbe negativo.');
        }
        
        // Update wallet
        mockData.wallets[tx.walletId].balance = newBalance;
        mockData.wallets[tx.walletId].updatedAt = new Date();
        
        // Create reversal transaction
        const reversalId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        mockData.transactions[reversalId] = {
          id: reversalId,
          walletId: tx.walletId,
          customerName: tx.customerName,
          amount: tx.amount,
          type: 'reversal' as TransactionType,
          reason: `Storno: ${tx.reason}`,
          reversedTxId: tx.id,
          createdAt: new Date(),
          createdBy: user.email || 'mock-user',
        };
        
        saveMockData(mockData);
        return delay(300, newBalance);
      }

      const reverseDelta = tx.type === 'credit' ? -tx.amount : tx.amount;
      const walletRef = doc(db, 'shops', shopId, 'wallets', tx.walletId);
      const newTxRef = doc(collection(db, 'shops', shopId, 'transactions'));
      
      let finalBalance = 0;

      await runTransaction(db, async (transaction) => {
          const walletSnap = await transaction.get(walletRef);
          if (!walletSnap.exists()) throw new Error('Profilo cliente non trovato');

          const currentBalance = (walletSnap.data() as Wallet).balance || 0;
          const newBalance = currentBalance + reverseDelta;

          if (newBalance < 0) {
              throw new Error('Storno annullato. Il nuovo saldo del cliente diventerebbe negativo.');
          }

          transaction.update(walletRef, {
              balance: newBalance,
              updatedAt: serverTimestamp(),
          });

          transaction.set(newTxRef, {
              walletId: tx.walletId,
              customerName: tx.customerName,
              amount: tx.amount,
              type: 'reversal',
              reason: `Storno: ${tx.reason}`,
              reversedTxId: tx.id,
              createdAt: serverTimestamp(),
              createdBy: user.uid,
          });

          finalBalance = newBalance;
      });

      return finalBalance;
  }

  return { processTransaction, processReversal };
}
