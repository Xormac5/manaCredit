import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const tabClass = (path: string) =>
    `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
      isActive(path)
        ? 'text-mana-primary'
        : 'text-slate-500 hover:text-slate-300'
    }`;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md pb-safe z-50">
      {/* Floating Scan Button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
        <button
          onClick={() => navigate('/scan')}
          className="w-16 h-16 rounded-full bg-mana-primary flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] active:scale-90 transition-all duration-200 border-4 border-mana-bg"
        >
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </button>
      </div>

      {/* Nav Bar */}
      <div className="bg-mana-card/95 backdrop-blur-md border-t border-slate-700/80 shadow-2xl">
        <div className="flex items-center justify-around px-2 pt-2 pb-1 w-full">
          {/* Dashboard */}
          <Link to="/" className={tabClass('/')}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-2h2v16h-2z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Dashboard</span>
          </Link>

          {/* New Customer */}
          <Link to="/new-customer" className={tabClass('/new-customer')}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Nuovo</span>
          </Link>

          {/* Spacer per bottone centrale */}
          <div className="w-16" />

          {/* Info Negozio */}
          <Link to="/shop-info" className={tabClass('/shop-info')}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Negozio</span>
          </Link>

          {/* History */}
          <Link to="/history" className={tabClass('/history')}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Storico</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
