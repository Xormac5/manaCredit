# 🎮 ManaCredit - PWA SaaS per Negozi TCG

**ManaCredit** è una Progressive Web App ultra-ottimizzata per gestire il credito negozio (buoni) dei clienti in cassa. Pensata per TCG shops e fumetterie: operazioni da 2-3 tap, zero caricamenti, interfaccia a prova di errore.

**Sviluppato da:** Marco | **Tech Stack:** React, Vite, Tailwind, Firebase, TypeScript

---

## ⚡ Caratteristiche Principali

- **Multi-Tenancy:** Isolamento dati per shop via Security Rules + Custom Claims
- **Atomic Transactions:** Batch Firestore garantisce atomicità saldo + audit log
- **QR Code Generation:** Genera QR dinamico lato client (niente salvataggio DB)
- **Offline-Ready:** PWA con Service Worker, caching UI, transazioni online-only
- **Dark Mode:** UI dark mode ottimizzata per ambienti negozio
- **Mobile-First:** Tailwind CSS responsive da smartphone/tablet

---

## 🚀 Quick Start

### Prerequisiti
- Node.js 20+
- Firebase CLI
- Progetto Firebase existente

### Setup

```bash
# 1. Clona repo
git clone <repo>
cd manaCredit

# 2. Installa dipendenze
npm install
cd functions && npm install && cd ..

# 3. Configura variabili ambiente
cp .env.local.example .env.local
# Modifica con tue credenziali Firebase

# 4. Sviluppo locale
npm run dev

# 5. Deploy Functions (in /functions)
npm run deploy
```

**Leggi [SETUP_GUIDE.md](./SETUP_GUIDE.md) per guida completa.**

---

## 📁 Struttura Progetto

```
manaCredit/
├── src/
│   ├── pages/              # Route pages
│   ├── components/         # Componenti riusabili
│   ├── hooks/              # Custom hooks
│   ├── context/            # Context API
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
│
├── functions/              # Cloud Functions
├── firestore.rules         # Security Rules
├── vite.config.ts          # PWA + Vite config
├── tailwind.config.ts      # Tema mana-*
└── SETUP_GUIDE.md
```

---

## 🎨 Palette Colori

- **`mana-bg`**: `#0B0C10` - Charcoal (sfondo)
- **`mana-card`**: `#14161C` - Dark gray
- **`mana-primary`**: `#8B5CF6` - Viola (CTA principale)
- **`mana-green`**: `#10B981` - Verde (carica +)
- **`mana-orange`**: `#F97316` - Arancione (scala -)

---

## 🛠️ Comandi Build

```bash
npm run dev        # Dev server (Vite HMR)
npm run build      # Build produzione
npm run preview    # Preview build locale
npm run lint       # ESLint check
```

---

## 🔐 Sicurezza

- **Firestore Rules:** Multi-tenancy via `shop_id` claim
- **Batch Atomicity:** Transazione = update saldo + create log
- **JWT Custom Claims:** Ogni cassiere ha `shop_id` + `role`
- **No negative balances:** Validation client + Firestore
- **Immutable logs:** Transazioni append-only

---

## 📝 Licenza

Proprietario - Marco Xormac5

**Last Updated:** April 2, 2026
