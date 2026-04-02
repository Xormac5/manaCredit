# ✅ ManaCredit - Deployment Checklist

> Usa questa checklist prima di ogni deploy in produzione

---

## 🔧 Pre-Deploy Setup

### Firebase Project Configuration

- [ ] Crea Firebase project (console.firebase.google.com)
- [ ] Abilita **Firestore Database** (rules già pronte in `firestore.rules`)
- [ ] Abilita **Authentication** (Email/Password)
- [ ] Crea **Cloud Functions** region (eu-west1 recommended)
- [ ] Configura **Storage** (opzionale, non usato al momento)

### Environment Variables

- [ ] Copia `.env.local` e inserisci credenziali Firebase:
  ```
  VITE_FIREBASE_API_KEY=...
  VITE_FIREBASE_AUTH_DOMAIN=...
  VITE_FIREBASE_PROJECT_ID=...
  VITE_FIREBASE_STORAGE_BUCKET=...
  VITE_FIREBASE_MESSAGING_SENDER_ID=...
  VITE_FIREBASE_APP_ID=...
  VITE_USE_MOCK_DATA=false
  ```

### Local Testing

- [ ] Esegui `npm install` + `npm run dev`
- [ ] Verifica pagina Login
- [ ] Testa scansione QR (mock data con mock mode)
- [ ] Verifica dashboard responsive su mobile

---

## 🚀 Deployment Steps

### 1. Backend - Firestore & Rules

```bash
# Deploy Security Rules
firebase deploy --only firestore:rules

# Status check
firebase firestore:indexes
```

- [ ] Firestore rules deployate
- [ ] Nessun errore nelle console

### 2. Backend - Cloud Functions

```bash
cd functions
npm run build  # TypeScript compilation
npm run deploy # Deploy to Firebase
```

- [ ] Functions deployate
- [ ] `setShopClaim` disponibile
- [ ] `createShop` disponibile

### 3. Frontend - Build

```bash
npm run build
```

- [ ] Build senza errori
- [ ] Verifica output in `dist/`
- [ ] Controlla bundle size

### 4. Frontend - Deploy

```bash
# Opzione A: Firebase Hosting
firebase deploy --only hosting

# Opzione B: Vercel / Netlify
vercel deploy    # o: netlify deploy
```

- [ ] PWA indexata
- [ ] Service Worker registrato
- [ ] HTTPS attivo

### 5. PWA Setup

**In `public/`:**
- [ ] Aggiungi `icon-192.png` (192x192)
- [ ] Aggiungi `icon-512.png` (512x512)
- [ ] Aggiungi `screenshot-192.png` (per app store)
- [ ] Aggiungi `screenshot-512.png` (per app store)

---

## 🧪 Post-Deploy Tests

### Functionality

- [ ] Login con email/password
- [ ] Dashboard carica correttamente
- [ ] Ricerca clienti funziona
- [ ] Scansione QR funziona
- [ ] Bottom sheet operazioni appare
- [ ] Transazione completata (Firestore updated)
- [ ] Storico cassa mostra movimenti
- [ ] Storno transazione funziona

### Performance

- [ ] Lighthouse score > 80
- [ ] Core Web Vitals OK
- [ ] Time to interactive < 3s
- [ ] Bundle size < 500KB gzipped

### Security

- [ ] HTTPS enforced
- [ ] CSP headers set
- [ ] No API keys exposed in console
- [ ] JWT validation working
- [ ] Firestore rules blocking unauthorized access

### PWA

- [ ] App installabile su mobile
- [ ] "Add to home screen" funziona
- [ ] Offline page carica (service worker)
- [ ] Transazioni requiredono network (as expected)

---

## 👥 Staff Setup

### Crea Cassiere

1. Vai a Firebase Console → Authentication
2. Crea nuovo utente (email: `cassiere@shop.com`)
3. Noterai il UID
4. Crea shop prima (se non esiste) usando `createShop` function
5. Assegna claim usando `setShopClaim`:

```typescript
const functions = httpsCallable(getFunctions(), 'setShopClaim');
const result = await functions({
  targetUid: 'cassiere_uid',
  shopId: 'shop_id'
});
```

6. Cassiere fa login e ottiene accesso

---

## 🐛 Troubleshooting

### Login non funziona
- [ ] Verifica Firebase Console → Authentication abilitata
- [ ] Controlla CORS headers
- [ ] Verifica email/password corrette nel test account

### Firestore queries timeout
- [ ] Controlla Security Rules syntax
- [ ] Verifica custom claims nel JWT
- [ ] Accedi a Firebase Console → Firestore → Security Rules (test mode)

### PWA non si installa
- [ ] Controlla manifest.json in vite.config.ts
- [ ] Verifica icons path in public/
- [ ] HTTPS requirement (production only)

### QR scanner non accede camera
- [ ] Richiedi permessi su iOS/Android
- [ ] Testa su HTTPS (http localhost OK per dev)
- [ ] Verifica browser support

---

## 📊 Monitoring

### Firestore Dashboard
- [ ] Monitor read/write ops
- [ ] Check storage usage
- [ ] Verifica costs

### Cloud Functions
- [ ] Check execution time
- [ ] Monitor error rate
- [ ] Verifica logs

### Analytics (opzionale)
- [ ] Enable Google Analytics
- [ ] Track key events (login, transaction)

---

## 🔐 Production Security Checklist

- [ ] All environment variables set on server
- [ ] `.env.local` NOT committed to git
- [ ] API keys NOT visible in network panel
- [ ] CORS configured correctly
- [ ] Rate limiting enabled (optional)
- [ ] Error messages don't leak sensitive info
- [ ] Database backups configured
- [ ] 2FA enabled for Firebase Console access

---

## 📱 Mobile Testing

### iOS
- [ ] Testa su iPhone (Safari)
- [ ] Verifica QR scanner con telecamera
- [ ] Testa offline mode

### Android
- [ ] Testa su device (Chrome)
- [ ] Verifica notch compatibility
- [ ] Testa back gesture

---

## 📝 Documentation

- [ ] README.md updated
- [ ] SETUP_GUIDE.md completo
- [ ] API documentation (if applicable)
- [ ] Database schema documented
- [ ] Security policy documented

---

## ✨ Final Checks

- [ ] All features working
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] PWA installabile
- [ ] Documentazione completa
- [ ] Team informed

---

## 🎉 Go Live!

Once all items are checked:

```bash
# Final commit
git add -A
git commit -m "Production deployment - ManaCredit v1.0"

# Tag
git tag -a v1.0 -m "Production release"
git push origin main --tags
```

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Status:** ✅ LIVE / ⏳ IN PROGRESS

