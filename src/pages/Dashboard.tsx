import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import BigButton from '../components/ui/BigButton';
import TransactionList from '../components/TransactionList';
import type { Transaction } from '../types';

export default function Dashboard() {
  const { shopId } = useAuth();
  const { signOut } = useAuthActions();
  const { getRecentGlobal } = useTransactions();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState('');
  const [recent, setRecent] = useState<(Transaction & { id: string })[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!shopId) return;
    // Carica nome negozio
    getDoc(doc(db, 'shops', shopId)).then((snap) => {
      if (snap.exists()) setShopName(snap.data().name ?? 'Negozio');
    });
    // Ultimi movimenti
    getRecentGlobal(5).then(setRecent);
  }, [shopId]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/customer?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{shopName || 'TCG Wallet'}</h1>
        </div>
        <button onClick={signOut} className="text-sm underline opacity-80">
          Esci
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-4 p-4">
        {/* Bottone Scansione */}
        <BigButton
          className="!min-h-[80px] !text-xl"
          onClick={() => navigate('/scan')}
        >
          📷 SCANSIONA CLIENTE
        </BigButton>

        {/* Ricerca rapida */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cerca Nome, Telefono, Nickname…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <BigButton type="submit" className="!w-auto px-6">
            Cerca
          </BigButton>
        </form>

        {/* Ultimi movimenti */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 mb-2">
            Ultimi movimenti
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm">
            <TransactionList transactions={recent} showCustomer />
          </div>
        </section>

        {/* Link storico */}
        <button
          onClick={() => navigate('/history')}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium underline"
        >
          Vedi storico cassa completo →
        </button>
      </main>
    </div>
  );
}
