import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title }: Props) {
  // Blocca lo scroll del body quando aperto
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-mana-card rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl border-t border-slate-700">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-600" />
        
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        )}
        
        {children}
      </div>
    </div>
  );
}
