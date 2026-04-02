# ManaCredit - Setup Guide

## 🎯 Panoramica

ManaCredit è una PWA SaaS multi-tenant per negozi TCG/fumetterie. Gestisce il credito negozio (buoni) con un'interfaccia ottimizzata per cassa (2-3 tap max).

**Architecture:**
- Frontend: React + Vite + Tailwind CSS (mobile-first)
- Backend: Firebase (Auth, Firestore, Cloud Functions)
- PWA: Service Workers, offline UI, manifest

---

## 📋 Prerequisiti

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- Un progetto Firebase existente

---

## 🚀 Installation

### 1. Frontend Setup

```bash
# Installa dipendenze
npm install

# Sviluppo locale
npm run dev

# Build produzione
npm run build

# Preview
npm run preview
```

### 2. Variabili d'ambiente

Crea `.env.local` nella root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_USE_MOCK_DATA=false
```

### 3. Cloud Functions Setup

```bash
cd functions

# Installa dipendenze
npm install

# Deploy (richiede autenticazione Firebase)
npm run deploy

# Locale (per test)
npm run serve
```

### 4. Firestore Setup

Carica le Security Rules da `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

### 5. PWA Icons

Aggiungi questi file in `public/`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `screenshot-192.png` (192x192)
- `screenshot-512.png` (512x512)

---

## 🏗️ Architettura Database

### Firestore Structure

```
shops/
  {shop_id}/
    ├── name: string
    ├── createdAt: timestamp
    │
    ├── staff/
    │   └── {uid}/
    │       ├── displayName: string
    │       ├── email: string
    │       ├── role: 'owner' | 'cashier'
    │       └── createdAt: timestamp
    │
    ├── wallets/
    │   └── {CUST_ID}/
    │       ├── customerName: string
    │       ├── nickname?: string
    │       ├── phone?: string
    │       ├── balance: number
    │       ├── createdAt: timestamp
    │       └── updatedAt: timestamp
    │
    └── transactions/
        └── {tx_id}/
            ├── walletId: string
            ├── customerName: string
            ├── amount: number
            ├── type: 'credit' | 'debit' | 'reversal'
            ├── reason: string
            ├── reversedTxId?: string (per storno)
            ├── createdAt: timestamp
            └── createdBy: uid
```

### Multi-Tenancy

- **Isolamento:** Security Rules bloccano accesso se `shop_id` nel token ≠ `shop_id` nel path
- **Custom Claims:** Firebase Auth assegna JWT con `shop_id` + `role`
- **Transazioni:** Batch Firestore garantisce atomicità saldo + log

---

## 🔐 Autenticazione & Claims

### Setup Cassiere

1. Owner/Admin crea utente da Firebase Console
2. Chiama Cloud Function `setShopClaim`:

```javascript
const functions = httpsCallable(getFunctions(), 'setShopClaim');
await functions({ 
  targetUid: 'uid_del_cassiere',
  shopId: 'shop_123'
});
```

3. Cassiere fa login: ottiene JWT con `shop_id`
4. SecurityRules bloccano accesso a `shops` diversi

### Custom Claims

```json
{
  "shop_id": "shop_123",
  "role": "cashier" | "owner"
}
```

---

## 🎨 Palette Colori (Tailwind)

- **Sfondo:** `mana-bg` = `#0B0C10` (charcoal)
- **Card:** `mana-card` = `#14161C` (dark gray)
- **Primario:** `mana-primary` = `#8B5CF6` (viola)
- **Carica:** `mana-green` = `#10B981` (verde)
- **Scala:** `mana-orange` = `#F97316` (arancione)

---

## 📱 Flussi Principali

### Dashboard Cassiere
1. Apre app → vede Dashboard
2. Tap **SCANSIONA CLIENTE** → fotocamera QR
3. Scansiona QR cliente → CustomerCard

### Customer View (Post-Scansione)
1. Mostra saldo attuale (6xl, viola)
2. Due bottoni: **+CARICA** (verde) | **-SCALA** (arancione)
3. Tap → Bottom Sheet con tastierino numerico
4. Seleziona causale (Acquisto, Premio, Ricarica, Altro)
5. Digita importo + tap **Conferma**
6. Transazione registrata (batch Firestore)

### QR Viewer (`/qr/{CUST_ID}`)
- Cliente visita link o riceve QR
- Frontend genera QR dinamico con `qrcode.react`
- QR contiene stringa `manacredit:CUST_ID`
- Bottone download PNG per stampa

### Storico Cassa (`/history`)
- Seleziona data
- Lista transazioni giornaliere
- Bottone **Storno** per ciascuna (esegue batch inverso)

---

## 🔌 Componenti Principali

### UI Components
- `BigButton` - Large CTA buttons
- `NumPad` - Custom numeric keypad
- `BottomSheet` - Modal drawer
- `QrGenerator` - QR code renderer
- `TransactionList` - Transaction history

### Hooks
- `useAuth` - Auth state + shop_id
- `useWallet` - CRUD wallets
- `useTransactions` - CRUD transactions
- `useCashierOperations` - Batch operations

### Pages
- `Login` - Staff login
- `Dashboard` - Main hub
- `ScanPage` - QR scanner
- `CustomerCard` - Customer detail + operations
- `CashHistory` - Daily transactions + reversals
- `QrViewerPage` - Public QR display

---

## 🧪 Mock Mode (Offline Dev)

Set `VITE_USE_MOCK_DATA=true` in `.env.local` per usare `mockStore.ts`:

```typescript
// mockStore persiste in localStorage
import { getMockData, setMockData } from './lib/mockStore';

const data = getMockData();
data.wallets['CUST_001'].balance += 50;
setMockData(data);
```

---

## 🚨 Security Checklist

- [ ] Firestore Rules deployate
- [ ] Cloud Functions deployate
- [ ] Custom Claims assegnati correttamente
- [ ] JWT validation in sicurezza
- [ ] Batch operations atomiche
- [ ] Wallet non-negative check
- [ ] PWA HTTPS (requirement)

---

## 📞 Support

Per issues o feature requests, contatta il team backend.

---

**Last Updated:** April 2, 2026
