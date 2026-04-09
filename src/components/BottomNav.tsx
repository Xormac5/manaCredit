import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-mana-card/95 backdrop-blur-md border-t border-slate-700 pb-safe z-50 shadow-2xl">
      <div className="flex items-center justify-around px-4 py-3 w-full">
        {/* Dashboard */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            isActive('/')
              ? 'text-mana-primary bg-mana-primary/10'
              : 'text-slate-400 hover:text-slate-300 hover:bg-mana-card-hover'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-widest">
            Dashboard
          </span>
        </Link>

        {/* New Customer */}
        <Link
          to="/new-customer"
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            isActive('/new-customer')
              ? 'text-mana-primary bg-mana-primary/10'
              : 'text-slate-400 hover:text-slate-300 hover:bg-mana-card-hover'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
             <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-widest">Nuovo</span>
        </Link>

        {/* Scan */}
        <Link
          to="/scan"
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            isActive('/scan')
              ? 'text-mana-primary bg-mana-primary/10'
              : 'text-slate-400 hover:text-slate-300 hover:bg-mana-card-hover'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5h5v5H5zm9-2h5v5h-5zM5 14h5v5H5zm9-2h5v5h-5z" />
            <path d="M4 3h7v7H4zm9 0h7v7h-7zM4 12h7v7H4zm9 0h7v7h-7z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-widest">Scansiona</span>
        </Link>

        {/* History */}
        <Link
          to="/history"
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
            isActive('/history')
              ? 'text-mana-primary bg-mana-primary/10'
              : 'text-slate-400 hover:text-slate-300 hover:bg-mana-card-hover'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <span className="text-[11px] font-bold uppercase tracking-widest">Storico</span>
        </Link>
      </div>
    </nav>
  );
}
