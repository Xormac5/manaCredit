import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/TransactionList';
import BottomNav from '../components/BottomNav';
import Header from '../components/layout/Header';
import type { Transaction } from '../types';

const RECENT_SEARCHES_KEY = 'manacredit_recent_searches';

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(term: string) {
  const searches = getRecentSearches().filter((s) => s !== term);
  searches.unshift(term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches.slice(0, 5)));
}

export default function Dashboard() {
  const { shopId } = useAuth();
  const { getRecentGlobal } = useTransactions();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState('');
  const [recent, setRecent] = useState<(Transaction & { id: string })[]>([]);
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (!shopId) return;
    
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      setShopName("Dragon's Lair Comics");
    } else {
      // Carica nome negozio
      getDoc(doc(db, 'shops', shopId)).then((snap) => {
        if (snap.exists()) setShopName(snap.data().name ?? "Dragon's Lair Comics");
      }).catch(console.error);
    }

    // Ultimi movimenti
    getRecentGlobal(3).then(setRecent);
    
    // Ricerche recenti
    setRecentSearches(getRecentSearches());
  }, [shopId]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      addRecentSearch(search.trim());
      navigate(`/customer?search=${encodeURIComponent(search.trim())}`);
    }
  }

  function handleQuickSearch(term: string) {
    addRecentSearch(term);
    navigate(`/customer?search=${encodeURIComponent(term)}`);
  }

  return (
    <div className="min-h-screen bg-mana-bg pb-24 font-sans text-white">
      <Header shopName={shopName} />

      <main className="px-4">
        <div className="mt-2 mb-6">
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">Station 02</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff Dashboard</h1>
        </div>

        {/* Ricerca cliente - Sezione principale */}
        <section className="mb-6">
          <form onSubmit={handleSearch} className="relative mb-3">
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

          {/* Ricerche recenti */}
          {recentSearches.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-1">Cercati di recente</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearch(term)}
                    className="px-3 py-1.5 rounded-full bg-mana-card border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-mana-primary/50 transition-all active:scale-95"
                  >
                    🔍 {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/new-customer')}
              className="bg-mana-card rounded-2xl p-4 border border-slate-700/50 hover:border-mana-primary/30 transition-all active:scale-95 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-mana-green/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-mana-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Nuovo Cliente</p>
                <p className="text-[10px] text-slate-500">Registra</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="bg-mana-card rounded-2xl p-4 border border-slate-700/50 hover:border-mana-primary/30 transition-all active:scale-95 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-mana-primary/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-mana-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Storico Cassa</p>
                <p className="text-[10px] text-slate-500">Movimenti</p>
              </div>
            </button>
          </div>
        </section>

        {/* Ultimi movimenti */}
        <section className="animate-fade-in">
          <div className="flex justify-between items-end mb-3 px-1">
            <h2 className="text-sm font-semibold text-white">Ultimi Movimenti</h2>
            <Link to="/history" className="text-xs text-mana-primary hover:text-mana-primary-hover transition-colors font-semibold">
              Vedi tutto
            </Link>
          </div>
          <div className="bg-mana-card/50 rounded-2xl p-3 shadow-lg border border-slate-800/50 backdrop-blur">
            {recent.length > 0 ? (
              <TransactionList transactions={recent} showCustomer />
            ) : (
              <p className="text-center text-slate-500 py-6">Nessun movimento</p>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
