import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../hooks/useAuth';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
}

export default function SideDrawer({ isOpen, onClose, shopName }: SideDrawerProps) {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    onClose();
    await signOut();
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 pointer-events-none">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-3/4 max-w-[80%] bg-mana-bg border-r border-slate-800/50 shadow-2xl flex flex-col pt-6 pb-8 animate-in slide-in-from-left duration-300 pointer-events-auto">
        
        {/* Header Drawer */}
        <div className="px-6 pb-6 border-b border-slate-800/50">
          <div className="w-12 h-12 rounded-full bg-mana-card border border-mana-primary/30 flex items-center justify-center mb-4">
             <span className="text-xl font-black text-mana-primary">M</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">{shopName}</h2>
          <p className="text-xs text-slate-400 font-medium">Dashboard Menu</p>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <button 
            onClick={() => handleNavigate('/')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-mana-card text-white hover:text-mana-primary transition-colors text-left"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-semibold text-sm">Dashboard</span>
          </button>

          <button 
            onClick={() => handleNavigate('/new-customer')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-mana-card text-white hover:text-mana-primary transition-colors text-left"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="font-semibold text-sm">Nuovo Cliente</span>
          </button>

          <button 
            onClick={() => handleNavigate('#')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-mana-card text-white hover:text-mana-primary transition-colors text-left opacity-50 cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-sm">Impostazioni</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="px-4 mt-auto">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-red-500/10 text-red-400 py-3.5 rounded-2xl font-bold transition-colors border border-transparent hover:border-red-500/30"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Esci</span>
          </button>
        </div>
      </div>
    </div>
  );
}
