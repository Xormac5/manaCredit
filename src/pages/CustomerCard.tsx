import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useTransactions } from '../hooks/useTransactions';
import { useCashierOperations } from '../hooks/useCashierOperations';
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

  const { getWallet, searchWallets } = useWallet();
  const { getByWallet } = useTransactions();
  const { processTransaction } = useCashierOperations();

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

    try {
      const newBalance = await processTransaction({
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
      <div className="min-h-screen bg-mana-bg p-4 flex flex-col">
        <button onClick={() => navigate('/')} className="text-mana-primary hover:text-mana-primary-hover mb-4 text-sm font-semibold">
          ← Torna alla dashboard
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">
          Risultati per "{searchTerm}"
        </h2>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {results.map((w) => (
            <button
              key={w.id}
              onClick={() => selectFromResults(w)}
              className="bg-mana-card hover:bg-mana-card-hover rounded-2xl p-4 text-left border border-slate-700 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-lg">
                    {w.customerName}
                  </span>
                  {w.nickname && (
                    <span className="text-slate-400 ml-2">({w.nickname})</span>
                  )}
                </div>
                <span className="font-bold text-mana-green text-xl">
                  €{w.balance.toFixed(2)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Caricamento
  if (!wallet) {
    return (
      <div className="min-h-screen bg-mana-bg flex items-center justify-center p-4">
        <p className="text-slate-400">Caricamento cliente…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mana-bg flex flex-col pb-20">
      {/* Header */}
      <header className="bg-mana-card border-b border-slate-700 text-white px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-white hover:text-mana-primary transition-colors text-2xl">
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-xl text-white">{wallet.customerName}</h1>
          {wallet.nickname && (
            <p className="text-sm text-slate-400">{wallet.nickname}</p>
          )}
        </div>
      </header>

      <main className="flex flex-col gap-5 p-4">
        {/* Saldo - Elemento principale */}
        <div className="bg-mana-card rounded-3xl p-8 text-center shadow-lg border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Saldo attuale</p>
          <p className="text-6xl font-extrabold text-mana-primary mb-1">
            €{wallet.balance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500">Customer ID: {wallet.id}</p>
        </div>

        {/* Azioni veloce */}
        <div className="grid grid-cols-2 gap-3">
          <BigButton variant="success" onClick={() => setSheetMode('credit')} className="flex flex-col items-center justify-center text-xs leading-none gap-0.5">
            <span className="font-extrabold tracking-wide">+ ADD CREDIT</span>
            <span className="opacity-70 font-normal scale-90 mb-0.5">(CARICA)</span>
          </BigButton>
          <BigButton variant="danger" onClick={() => setSheetMode('debit')} className="flex flex-col items-center justify-center text-xs leading-none gap-0.5">
            <span className="font-extrabold tracking-wide">- CHARGE CREDIT</span>
            <span className="opacity-70 font-normal scale-90 mb-0.5">(SCALA)</span>
          </BigButton>
        </div>

        {/* Ultimi movimenti */}
        <section className="flex flex-col mt-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Movimenti Recenti
          </h2>
          <div className="bg-mana-card/50 rounded-2xl p-3 shadow-md border border-slate-700 overflow-visible">
            {txs.length > 0 ? (
              <TransactionList transactions={txs} />
            ) : (
              <p className="text-center text-slate-500 py-6">Nessun movimento</p>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Sheet operazione */}
      <BottomSheet 
        open={sheetMode !== null} 
        onClose={() => setSheetMode(null)}
        title={sheetMode === 'credit' ? '➕ Carica Credito' : '➖ Scala Credito'}
      >
        {/* Causale rapida */}
        <div className="mb-6">
          <p className="text-xs text-slate-400 font-semibold uppercase mb-3">Seleziona causale</p>
          <div className="flex flex-wrap gap-2">
            {reasons.map((r) => {
              const isActive = reason === r;
              return (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'shadow-lg bg-transparent border-2' 
                      : 'bg-transparent text-slate-400 hover:text-white border border-slate-700'
                  }`}
                  style={isActive ? {
                    borderColor: 'var(--mana-primary)',
                    color: 'var(--mana-primary)',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.2)'
                  } : undefined}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        <NumPad
          label={sheetMode === 'credit' ? '✓ Conferma Carica' : '✓ Conferma Scala'}
          onConfirm={handleConfirm}
        />
      </BottomSheet>
    </div>
  );
}
