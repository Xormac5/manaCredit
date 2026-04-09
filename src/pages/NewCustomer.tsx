import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

export default function NewCustomer() {
  const navigate = useNavigate();
  const { createWallet } = useWallet();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    nickname: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setError('Il nome è obbligatorio.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate a random ID for the new customer
      const autoId = `CUST_${Math.floor(100000 + Math.random() * 900000)}`;
      
      await createWallet(autoId, {
        customerName: formData.customerName.trim(),
        nickname: formData.nickname.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      });

      // Navigate to the newly created customer page
      navigate(`/customer?id=${autoId}`);
    } catch (err: any) {
      setError(err.message || "Errore durante la creazione del cliente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mana-bg flex flex-col font-sans text-white">
      {/* App Bar */}
      <header className="px-4 py-6 flex items-center justify-between border-b border-slate-800/50 sticky top-0 bg-mana-bg/95 backdrop-blur-md z-40">
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-semibold">Annulla</span>
        </button>
        <span className="font-bold tracking-wide uppercase text-xs text-mana-primary">Nuovo Cliente</span>
        <div className="w-8"></div> {/* Spacer for perfect centering */}
      </header>

      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full animate-in fade-in slide-in-from-bottom-4">
        
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-mana-primary/20 text-mana-primary flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Aggiungi<br/>Nuovo Cliente</h1>
          <p className="text-slate-400 text-sm">Crea una nuova tessera punti per il negozio.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Nome e Cognome *
            </label>
            <input
              type="text"
              required
              placeholder="Es. Alex Rossi"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full bg-mana-card border border-mana-card-hover rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Nickname Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Soprannome (Opzionale)
            </label>
            <input
              type="text"
              placeholder="Es. Mage"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              className="w-full bg-mana-card border border-mana-card-hover rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Telefono Input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Telefono (Opzionale)
            </label>
            <input
              type="tel"
              placeholder="+39 333..."
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-mana-card border border-mana-card-hover rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mana-primary hover:bg-mana-primary-hover active:bg-mana-primary-active text-white rounded-xl py-4 font-bold tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center h-[56px]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "CREA CLIENTE"
              )}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
