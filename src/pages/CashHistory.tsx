import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { useCashierOperations } from '../hooks/useCashierOperations';
import type { Transaction } from '../types';

export default function CashHistory() {
  const navigate = useNavigate();
  const { getDailyTransactions } = useTransactions();
  const { processReversal } = useCashierOperations();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txs, setTxs] = useState<(Transaction & { id: string })[]>([]);

  useEffect(() => {
    getDailyTransactions(new Date(date)).then(setTxs);
  }, [date]);

  async function handleReversal(tx: Transaction & { id: string }) {
    if (!confirm(`Stornare ${tx.type === 'credit' ? '+' : '−'}€${tx.amount.toFixed(2)} di ${tx.customerName}?`)) {
      return;
    }
    
    await processReversal(tx);
    
    // Ricarica lista
    getDailyTransactions(new Date(date)).then(setTxs);
  }

  return (
    <div className="min-h-screen bg-mana-bg flex flex-col pb-20">
      {/* Header */}
      <header className="bg-mana-card border-b border-slate-700 text-white px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-mana-primary hover:text-mana-primary-hover transition-colors text-2xl">
          ←
        </button>
        <h1 className="font-bold text-xl">Storico Cassa</h1>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* Date picker */}
        <div>
          <label className="text-xs text-slate-400 font-semibold uppercase mb-2 block">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-700 bg-mana-card px-4 text-white focus:outline-none focus:ring-2 focus:ring-mana-primary transition-all"
          />
        </div>

        {/* Transactions list */}
        <div className="bg-mana-card rounded-2xl shadow-lg border border-slate-700 flex-1 overflow-y-auto">
          {txs.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Nessun movimento per questa data
            </p>
          ) : (
            <div className="divide-y divide-slate-700">
              {txs.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-4 px-4 hover:bg-mana-card-hover transition-colors border-b border-slate-700/50 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white truncate">
                      {tx.customerName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {tx.reason}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4 ml-2">
                    <span
                      className={`font-bold text-base ${
                        tx.type === 'credit'
                          ? 'text-mana-green'
                          : tx.type === 'debit'
                          ? 'text-mana-orange'
                          : 'text-slate-400'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '−' : '↻'}€
                      {tx.amount.toFixed(2)}
                    </span>
                    {tx.type !== 'reversal' && (
                      <button
                        onClick={() => handleReversal(tx)}
                        className="px-3 py-1 rounded-lg bg-mana-orange/20 text-mana-orange hover:bg-mana-orange/30 text-xs font-semibold transition-colors active:scale-95"
                      >
                        Storna
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
