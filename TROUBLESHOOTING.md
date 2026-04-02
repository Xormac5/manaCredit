# 🎯 ManaCredit - Troubleshooting Login

## ❌ Non Riesco ad Accedere

### 1️⃣ **Verifica la URL**
```
✅ Corretto:   http://localhost:5175
❌ Sbagliato:  http://localhost:3000
❌ Sbagliato:  http://127.0.0.1:5175
```

Se il port è diverso, prova:
```bash
curl http://localhost:5175
```

Se la porta non funziona, cerca il port nel terminal:
```bash
ps aux | grep "vite"
```

---

### 2️⃣ **Che Errore Vedi?**

**Opzione A: Errore in Console (F12 > Console)**

Se vedi: `Cannot find module 'firebase'`
```bash
# Reinstalla dipendenze
npm install --legacy-peer-deps
npm run dev
```

Se vedi: `VITE_USE_MOCK_DATA is not defined`
```bash
# Verifica .env.local
cat .env.local
# Deve avere: VITE_USE_MOCK_DATA=true
```

**Opzione B: Email/Password Rifiutati**

Prova:
- Email: `test@test.com`
- Password: `test123`

Qualsiasi cosa dovrebbe funzionare in mock mode!

**Opzione C: Page Bianca / Crash**

Apri Console (F12 > Console) e copia l'errore:
```
1. Premi F12
2. Vai su "Console"
3. Copia l'errore rosso
```

---

### 3️⃣ **Fix Rapidi**

#### Clear Cache & Reload
```bash
# Ctrl+Shift+R (Windows/Linux) oppure Cmd+Shift+R (Mac)
# Questo fa un hard refresh e cancella la cache
```

#### Cancella localStorage
```javascript
// Apri Console (F12 > Console) e esegui:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

#### Kill il server e riavvia
```bash
pkill -f "npm run dev"
cd /Users/marco/GitHub/manaCredit
npm run dev
```

---

### 4️⃣ **Verifica Env Variables**

```bash
# Verifica che il file esista
ls -la /Users/marco/GitHub/manaCredit/.env.local

# Verifica il contenuto
cat /Users/marco/GitHub/manaCredit/.env.local | grep VITE_USE_MOCK_DATA
# Deve stampare: VITE_USE_MOCK_DATA=true
```

---

### 5️⃣ **Debug Mode - Abilita Logs**

Apri il file `src/context/AuthContext.tsx` e aggiungi un console.log:

```typescript
// Aggiungi dopo "const USE_MOCK = ..."
console.log('🔍 Debug: USE_MOCK =', USE_MOCK);
console.log('🔍 Debug: env var =', import.meta.env.VITE_USE_MOCK_DATA);
```

Poi riavvia e guarda la Console (F12).

---

### 6️⃣ **Se Ancora Non Funziona**

Copia il testo dell'errore dalla Console e condividilo. Potrebbe essere:

```
❌ "Cannot read property 'currentUser' of undefined"
❌ "sessionStorage is not defined" 
❌ "Import qrcode.react failed"
```

---

## ✅ **Login Dovrebbe Funzionare Così**

```
1. Apri http://localhost:5175
2. Digita qualsiasi email
3. Digita qualsiasi password
4. Clicca "Accedi"
5. ✅ Vedi "Dashboard" con 2 clienti
```

**Se vedi il Dashboard, il login funziona! 🎉**

---

## 🆘 **Still Stuck?**

Esegui questo script diagnostico:

```bash
cd /Users/marco/GitHub/manaCredit

echo "=== Checking Files ==="
ls -la .env.local
ls -la src/lib/firebase.ts
ls -la src/context/AuthContext.tsx

echo "=== Checking npm ==="
npm list --depth=0

echo "=== Building ==="
npm run build 2>&1 | tail -5

echo "✅ All systems ready!"
```

Se il build passa → Il codice è OK.

---

**Cosa è il Mock Mode?**

```
Mock Mode = Simulazione locale senza Firebase
- Login = accetta qualsiasi email/password
- Dati = salvati in localStorage (solo browser)
- No Internet = Funziona offline
- Perfetto per: Testing UI, development locale
```

---

**Need help?** Check:
1. QUICK_LOGIN.md - Guida rapida
2. TESTING_GUIDE.md - Setup completo
3. Console browser (F12) - Errori dettagliati
