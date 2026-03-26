import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useWallet } from '../hooks/useWallet';
import TransactionList from '../components/TransactionList';
import type { Transaction } from '../types';

export default function CashHistory() {
  const navigate = useNavigate();
  const { getDailyTransactions, addTransaction } = useTransactions();
  const { updateBalance } = useWallet();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txs, setTxs] = useState<(Transaction & { id: string })[]>([]);

  useEffect(() => {
    getDailyTransactions(new Date(date)).then(setTxs);
  }, [date]);

  async function handleReversal(tx: Transaction & { id: string }) {
    if (!confirm(`Stornare ${tx.type === 'credit' ? '+' : '−'}€${tx.amount.toFixed(2)} di ${tx.customerName}?`)) {
      return;
    }
    const reverseDelta = tx.type === 'credit' ? -tx.amount : tx.amount;
    await updateBalance(tx.walletId, reverseDelta);
    await addTransaction({
      walletId: tx.walletId,
      customerName: tx.customerName,
      amount: tx.amount,
      type: 'reversal',
      reason: `Storno: ${tx.reason}`,
      reversedTxId: tx.id,
    });
    // Ricarica lista
    getDailyTransactions(new Date(date)).then(setTxs);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="bg-indigo-600 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-2xl">←</button>
        <h1 className="font-bold text-lg">Storico Cassa</h1>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm">
          {txs.length === 0 ? (
            <p className="text-center text-slate-400 py-6">
              Nessun movimento per questa data
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {txs.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between py-3 px-1"
                >
                  <div className="flex-1">
                    <span className="font-medium text-sm text-slate-800 dark:text-slate-200">
                      {tx.customerName}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      {tx.reason}
                    </span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span
                      className={`font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-orange-600'}`}
                    >
                      {tx.type === 'credit' ? '+' : '−'}€
                      {tx.amount.toFixed(2)}
                    </span>
                    {tx.type !== 'reversal' && (
                      <button
                        onClick={() => handleReversal(tx)}
                        className="text-xs text-red-500 underline"
                      >
                        Storna
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
