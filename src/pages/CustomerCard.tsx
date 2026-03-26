import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useTransactions } from '../hooks/useTransactions';
import BigButton from '../components/ui/BigButton';
import BottomSheet from '../components/ui/BottomSheet';
import NumPad from '../components/ui/NumPad';
import TransactionList from '../components/TransactionList';
import type { Wallet, Transaction, TransactionType } from '../types';

const reasons = ['Acquisto', 'Premio Torneo', 'Ricarica', 'Altro'];

export default function CustomerCard() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const walletId = params.get('id') ?? '';
  const searchTerm = params.get('search') ?? '';

  const { getWallet, searchWallets, updateBalance } = useWallet();
  const { addTransaction, getByWallet } = useTransactions();

  const [wallet, setWallet] = useState<(Wallet & { id: string }) | null>(null);
  const [results, setResults] = useState<(Wallet & { id: string })[]>([]);
  const [txs, setTxs] = useState<(Transaction & { id: string })[]>([]);
  const [sheetMode, setSheetMode] = useState<'credit' | 'debit' | null>(null);
  const [reason, setReason] = useState(reasons[0]);

  // Carica wallet da ID (post-scansione QR)
  useEffect(() => {
    if (walletId) {
      getWallet(walletId).then((w) => {
        if (w) setWallet({ ...w, id: walletId });
      });
      getByWallet(walletId).then(setTxs);
    }
  }, [walletId]);

  // Cerca wallet da termine
  useEffect(() => {
    if (searchTerm && !walletId) {
      searchWallets(searchTerm).then(setResults);
    }
  }, [searchTerm]);

  function selectFromResults(w: Wallet & { id: string }) {
    setWallet(w);
    setResults([]);
    getByWallet(w.id).then(setTxs);
  }

  async function handleConfirm(amount: number) {
    if (!wallet) return;
    const type: TransactionType = sheetMode === 'credit' ? 'credit' : 'debit';
    const delta = type === 'credit' ? amount : -amount;

    try {
      const newBalance = await updateBalance(wallet.id, delta);
      await addTransaction({
        walletId: wallet.id,
        customerName: wallet.customerName,
        amount,
        type,
        reason,
      });
      setWallet({ ...wallet, balance: newBalance });
      setSheetMode(null);
      const updated = await getByWallet(wallet.id);
      setTxs(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore');
    }
  }

  // Lista risultati ricerca
  if (!wallet && results.length > 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <button onClick={() => navigate('/')} className="text-indigo-600 mb-4 text-sm">
          ← Torna alla dashboard
        </button>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
          Risultati per "{searchTerm}"
        </h2>
        <ul className="flex flex-col gap-2">
          {results.map((w) => (
            <li key={w.id}>
              <button
                onClick={() => selectFromResults(w)}
                className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 text-left shadow-sm"
              >
                <span className="font-bold text-slate-900 dark:text-white">
                  {w.customerName}
                </span>
                {w.nickname && (
                  <span className="text-slate-500 ml-2">({w.nickname})</span>
                )}
                <span className="float-right font-bold text-indigo-600">
                  €{w.balance.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Scheda cliente
  if (!wallet) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <p className="text-slate-500">Caricamento cliente…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-2xl">←</button>
        <div>
          <h1 className="font-bold text-lg">{wallet.customerName}</h1>
          {wallet.nickname && (
            <p className="text-sm opacity-80">{wallet.nickname}</p>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4">
        {/* Saldo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-sm text-slate-500 mb-1">Saldo attuale</p>
          <p className="text-5xl font-extrabold text-slate-900 dark:text-white">
            €{wallet.balance.toFixed(2)}
          </p>
        </div>

        {/* Azioni */}
        <div className="grid grid-cols-2 gap-3">
          <BigButton variant="success" onClick={() => setSheetMode('credit')}>
            + CARICA
          </BigButton>
          <BigButton variant="danger" onClick={() => setSheetMode('debit')}>
            − SCALA
          </BigButton>
        </div>

        {/* Ultimi movimenti */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            Ultimi movimenti
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm">
            <TransactionList transactions={txs} />
          </div>
        </section>
      </main>

      {/* Bottom Sheet operazione */}
      <BottomSheet open={sheetMode !== null} onClose={() => setSheetMode(null)}>
        <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-3">
          {sheetMode === 'credit' ? '+ Carica credito' : '− Scala credito'}
        </h3>

        {/* Causale rapida */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                reason === r
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <NumPad
          label={sheetMode === 'credit' ? 'Conferma Carica' : 'Conferma Scala'}
          onConfirm={handleConfirm}
        />
      </BottomSheet>
    </div>
  );
}
