import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const SHOP_SETTINGS_KEY = 'manacredit_shop_settings';

interface ShopSettings {
  name: string;
  logo: string | null; // base64 data URL
  address: string;
  phone: string;
  email: string;
}

const defaultSettings: ShopSettings = {
  name: "Dragon's Lair Comics",
  logo: null,
  address: '',
  phone: '',
  email: '',
};

function loadSettings(): ShopSettings {
  try {
    const stored = localStorage.getItem(SHOP_SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: ShopSettings) {
  localStorage.setItem(SHOP_SETTINGS_KEY, JSON.stringify(settings));
}

export default function ShopInfo() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<ShopSettings>(loadSettings);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ShopSettings>(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Limita dimensione a 500KB
    if (file.size > 500 * 1024) {
      alert('Immagine troppo grande. Massimo 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setDraft({ ...draft, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSettings(draft);
    saveSettings(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCancel() {
    setDraft(settings);
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-mana-bg pb-24 font-sans text-white">
      {/* Header */}
      <header className="bg-mana-card border-b border-slate-700 text-white px-4 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-mana-primary hover:text-mana-primary-hover transition-colors text-2xl">
          ←
        </button>
        <h1 className="font-bold text-xl">Info Negozio</h1>
        <div className="flex-1" />
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-1.5 rounded-xl bg-mana-primary/15 text-mana-primary text-sm font-semibold hover:bg-mana-primary/25 transition-all active:scale-95"
          >
            ✏️ Modifica
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-600 transition-all active:scale-95"
            >
              Annulla
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-mana-green text-white text-sm font-bold hover:bg-mana-green-hover transition-all active:scale-95"
            >
              ✓ Salva
            </button>
          </div>
        )}
      </header>

      <main className="p-4 flex flex-col gap-6">
        {/* Toast salvataggio */}
        {saved && (
          <div className="bg-mana-green/20 border border-mana-green/40 rounded-2xl px-4 py-3 text-center text-mana-green text-sm font-semibold animate-fade-in">
            ✓ Impostazioni negozio salvate!
          </div>
        )}

        {/* Logo & Nome - Card principale */}
        <div className="bg-mana-card rounded-3xl p-6 border border-slate-700 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-mana-card-hover border-2 border-slate-600 overflow-hidden flex items-center justify-center shadow-lg">
                {(editing ? draft.logo : settings.logo) ? (
                  <img 
                    src={(editing ? draft.logo : settings.logo)!} 
                    alt="Shop logo" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <svg className="w-10 h-10 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
                  </svg>
                )}
              </div>
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-mana-primary text-white flex items-center justify-center shadow-lg hover:bg-mana-primary-hover transition-all active:scale-90"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden" 
              />
            </div>

            {/* Nome Negozio */}
            {editing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-mana-primary/50 pb-1 outline-none focus:border-mana-primary text-white"
                placeholder="Nome del negozio"
              />
            ) : (
              <h2 className="text-xl font-bold text-white">{settings.name}</h2>
            )}

            <p className="text-xs text-slate-500 uppercase tracking-widest">Il tuo negozio</p>
          </div>
        </div>

        {/* Dettagli Contatto */}
        <div className="bg-mana-card rounded-3xl p-5 border border-slate-700 shadow-lg">
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Dettagli Contatto</h3>
          
          <div className="flex flex-col gap-4">
            {/* Indirizzo */}
            <div>
              <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 block">
                📍 Indirizzo
              </label>
              {editing ? (
                <input
                  type="text"
                  value={draft.address}
                  onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                  className="w-full h-11 rounded-xl bg-mana-bg border border-slate-700 px-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary transition-all"
                  placeholder="Via Roma 1, Milano"
                />
              ) : (
                <p className="text-sm text-slate-300 py-2">{settings.address || '—'}</p>
              )}
            </div>

            {/* Telefono */}
            <div>
              <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 block">
                📞 Telefono
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  className="w-full h-11 rounded-xl bg-mana-bg border border-slate-700 px-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary transition-all"
                  placeholder="+39 02 1234567"
                />
              ) : (
                <p className="text-sm text-slate-300 py-2">{settings.phone || '—'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 block">
                ✉️ Email
              </label>
              {editing ? (
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  className="w-full h-11 rounded-xl bg-mana-bg border border-slate-700 px-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-mana-primary transition-all"
                  placeholder="info@negozio.it"
                />
              ) : (
                <p className="text-sm text-slate-300 py-2">{settings.email || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats veloce */}
        <div className="bg-mana-card rounded-3xl p-5 border border-slate-700 shadow-lg">
          <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-4">Info Rapide</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-mana-bg rounded-2xl p-4 text-center border border-slate-800">
              <p className="text-2xl font-extrabold text-mana-primary">v1.0</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">ManaCredit</p>
            </div>
            <div className="bg-mana-bg rounded-2xl p-4 text-center border border-slate-800">
              <p className="text-2xl font-extrabold text-mana-green">✓</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Mock Mode</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
