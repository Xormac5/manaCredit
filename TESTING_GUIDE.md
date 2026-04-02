# 🧪 ManaCredit - Testing Guide

## 🚀 Quick Start (Local Testing)

### Option 1: Mock Mode (No Firebase Required)

Il **mock mode** ti permette di testare l'app completamente offline senza bisogno di configurare Firebase.

#### Setup Mock Mode

1. **Modifica `.env.local`:**
```bash
VITE_USE_MOCK_DATA=true
```

2. **Riavvia il dev server:**
```bash
npm run dev
```

3. **Accedi con qualsiasi credenziale:**
```
Email: test@shop.com
Password: anything
```

#### Mock Data Disponibili

Il mock mode include 2 customer di default in localStorage:

| ID | Nome | Balance | Nickname |
|----|----|---------|----------|
| CUST_001 | Alex Rossi | €45.50 | Mage |
| CUST_002 | Giulia Bianchi | €120.00 | Collector |

#### Feature Testate in Mock Mode

✅ Dashboard search (cerca per nome/ID)  
✅ QR scanning (scansiona QR viewer)  
✅ Credit operations (carica/scala)  
✅ Transaction history  
✅ Transaction reversal  
✅ Bottom navigation  
✅ Dark mode UI  

---

## 🔥 Option 2: Firebase Live (Real Testing)

Per testare con Firebase reale:

### 1. Crea Firebase Project

```bash
# A. Vai a https://console.firebase.google.com
# B. Clicca "Create Project"
# C. Nome: "manacredit-test" (o il nome che preferisci)
# D. Abilita Google Analytics (facoltativo)
# E. Aspetta il setup (1-2 minuti)
```

### 2. Configura Firestore

```bash
# A. Nel Firebase Console, vai a "Firestore Database"
# B. Clicca "Create Database"
# C. Seleziona "Start in test mode"
# D. Seleziona region: "europe-west1" (Belgica - più vicino)
# E. Clicca "Create"
```

### 3. Abilita Authentication

```bash
# A. Nel Firebase Console, vai a "Authentication"
# B. Clicca "Get started"
# C. Seleziona "Email/Password"
# D. Clicca "Enable" e salva
```

### 4. Copia Credenziali Firebase

```bash
# A. Nel Firebase Console, vai a "Project Settings" (icona ⚙️)
# B. Scorri a "Your apps"
# C. Clicca su Web (</>)
# D. Copia il config object
```

### 5. Aggiorna `.env.local`

```bash
# Sostituisci i placeholder con i tuoi dati Firebase:

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Disabilita mock mode
VITE_USE_MOCK_DATA=false
```

### 6. Crea Test User in Firebase

```bash
# A. Nel Firebase Console, vai a "Authentication" > "Users"
# B. Clicca "Add user"
# C. Email: test@manacredit.local
# D. Password: TestPassword123!
# E. Clicca "Add user"
```

### 7. Assegna Shop Custom Claim

Per ora, il custom claim `shop_id` NON è assegnato. Il login funzionerà ma avrai un accesso limitato.

**Prossimo step (Phase 2):**
```bash
# Sarà necessario:
# 1. Deploy Cloud Functions
# 2. Usare la funzione `setShopClaim` per assegnare shop_id
# 3. Eseguire: firebase functions:call setShopClaim --data '{"targetUid":"USER_UID","shopId":"SHOP_001"}'
```

### 8. Riavvia e Testa

```bash
npm run dev
# Vai a http://localhost:5173
# Login con le credenziali create
```

---

## 📱 Testing Checklist

### Funzionality Tests

- [ ] Login/Logout works
- [ ] Dashboard displays customers
- [ ] Search filters customers correctly
- [ ] QR scanner can scan codes
- [ ] QR viewer displays correct QR
- [ ] Credit operation (carica) works
- [ ] Debit operation (scala) works
- [ ] Transaction history loads
- [ ] Transaction reversal works
- [ ] Bottom navigation responsive

### Visual Tests

- [ ] Dark mode colors correct (mana palette)
- [ ] Responsive on mobile (test with DevTools)
- [ ] Buttons have proper hover states
- [ ] Animations smooth (scroll, transitions)
- [ ] Loading states visible
- [ ] Error messages display correctly

### Performance Tests

- [ ] First load < 3 seconds
- [ ] Dashboard search instant (< 500ms)
- [ ] QR scan fast (< 1 second)
- [ ] No console errors

---

## 🐛 Troubleshooting

### "Cannot find module 'qrcode.react'"
```bash
npm install --legacy-peer-deps
npm run dev
```

### Firebase credentials not working
- [ ] Check .env.local format (no spaces around `=`)
- [ ] Verify Firebase project created successfully
- [ ] Check API key is correct in console.firebase.google.com
- [ ] Restart dev server: `npm run dev`

### Login fails but no error message
- [ ] Check browser console (F12 > Console)
- [ ] Ensure Email/Password auth enabled in Firebase
- [ ] User exists in Firebase Console > Authentication > Users

### QR code not showing
- [ ] Check if `qrcode.react` installed: `npm list qrcode.react`
- [ ] Check browser console for errors
- [ ] Verify QR value is not empty

### Mock data not persisting
- [ ] Clear localStorage: `localStorage.clear()` in console
- [ ] Refresh page
- [ ] Mock mode should save to localStorage automatically

---

## 🚀 Next Steps (After Testing)

### When Ready for Production:

1. **Setup Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Cloud Functions**
   ```bash
   cd functions
   npm run deploy
   ```

3. **Create Staff Accounts**
   ```bash
   # Per ogni cassiere:
   # 1. Crea user in Firebase Console
   # 2. Chiama setShopClaim function
   # 3. Assegna shop_id claim
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy --only hosting
   ```

5. **Add PWA Icons**
   ```bash
   # Copia icon files a public/ folder
   cp icon-192.png public/
   cp icon-512.png public/
   ```

---

## 📞 Testing Support

**For issues:**
1. Check console: F12 > Console tab
2. Check Network tab (F12 > Network)
3. Check .env.local configuration
4. Review SETUP_GUIDE.md for Firebase setup issues

**Mock mode issues:** See mockStore.ts in src/lib/

**Firebase issues:** See firebase.ts in src/lib/

---

## ✨ Testing Tips

- **Fast iteration:** Keep mock mode ON for UI testing
- **Real data testing:** Switch to Firebase when ready
- **Cross-device testing:** Use ngrok to expose localhost (advanced)
- **Mobile testing:** Use Chrome DevTools mobile emulator

---

**Ready to test?** Start with mock mode! 🎉

```bash
# 1. Check .env.local has VITE_USE_MOCK_DATA=true
# 2. Run: npm run dev
# 3. Open: http://localhost:5173
# 4. Try: Login with any email/password
```
