import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import type { TransactionType, Wallet } from '../types';

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
