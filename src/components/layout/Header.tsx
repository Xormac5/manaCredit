import { useState } from 'react';
import SideDrawer from './SideDrawer';

interface HeaderProps {
  shopName: string;
}

export default function Header({ shopName }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="px-4 pt-6 pb-4 flex items-center justify-between border-b border-slate-800/50">
        <button 
          onClick={() => setIsDrawerOpen(true)} 
          className="p-2 -ml-2 text-slate-400 hover:text-mana-primary transition-colors"
          title="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <span className="font-bold text-sm tracking-wide">{shopName || "Dragon's Lair Comics"}</span>
        
        <button className="w-8 h-8 rounded-full bg-mana-card border border-mana-primary/30 overflow-hidden active:scale-95 transition-transform">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" 
            alt="User avatar" 
            className="w-full h-full object-cover" 
          />
        </button>
      </header>

      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        shopName={shopName}
      />
    </>
  );
}
