import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useAuthActions } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/TransactionList';
import BottomNav from '../components/BottomNav';
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
      if (snap.exists()) setShopName(snap.data().name ?? "Dragon's Lair Comics");
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
    <div className="min-h-screen bg-mana-bg flex flex-col pb-24 font-sans text-white">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 flex items-center justify-between border-b border-slate-800/50">
        <button onClick={signOut} className="p-2 -ml-2 text-slate-400 hover:text-mana-primary transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-sm tracking-wide">{shopName || "Dragon's Lair Comics"}</span>
        <div className="w-8 h-8 rounded-full bg-mana-card border border-mana-primary/30 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-4 flex flex-col">
        <div className="mt-2 mb-8">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Station 02</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff Dashboard</h1>
        </div>

        {/* Bottone Scansione Centrale */}
        <div className="flex justify-center mb-12 relative animate-in fade-in zoom-in duration-500">
          <div className="absolute inset-0 bg-mana-primary opacity-20 blur-3xl rounded-full scale-110"></div>
          <button
            onClick={() => navigate('/scan')}
            className="relative w-64 h-64 rounded-full bg-mana-primary flex flex-col items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.3)] hover:shadow-[0_0_80px_rgba(139,92,246,0.5)] active:scale-95 transition-all duration-300"
          >
            <div className="mb-3 p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-base font-bold uppercase tracking-widest text-center">Scan Customer<br/>QR</span>
          </button>
        </div>

        {/* Ricerca rapida */}
        <form onSubmit={handleSearch} className="mb-10 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cerca cliente per nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 rounded-2xl bg-mana-card border border-mana-card-hover pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
          />
        </form>

        {/* Ultimi movimenti */}
        <section className="flex-1 animate-fade-in">
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-base font-semibold text-white">Ultimi Movimenti</h2>
            <Link to="/history" className="text-xs text-mana-primary hover:text-mana-primary-hover transition-colors font-semibold">
              Vedi tutto
            </Link>
          </div>
          <div className="bg-mana-card/50 rounded-3xl p-4 shadow-lg border border-slate-800/50 backdrop-blur">
            {recent.length > 0 ? (
              <TransactionList transactions={recent} showCustomer />
            ) : (
              <p className="text-center text-slate-500 py-8">Nessun movimento</p>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
