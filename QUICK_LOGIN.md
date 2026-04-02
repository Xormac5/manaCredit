# 🚀 Guida Rapida Login Mock Mode

## ✨ COME FARE LOGIN SUBITO

### Step 1: Accedi all'app
Apri il browser: **http://localhost:5174/**

### Step 2: Login
Usa **QUALSIASI** email e password:
```
Email:    test@shop.com
Password: anything
```

✅ Cliccato "Login" → Entra automaticamente!

---

## 📊 Dati Disponibili (Mock Mode)

Dentro l'app avrai 2 clienti con saldo:

| ID | Nome | Saldo | Nickname |
|----|------|-------|----------|
| CUST_001 | Alex Rossi | €45.50 | Mage |
| CUST_002 | Giulia Bianchi | €120.00 | Collector |

---

## 🎮 Cosa Puoi Fare

✅ **Dashboard** - Vedi i clienti  
✅ **Cerca** - Filtra per nome/ID  
✅ **Scansiona QR** - Leggi codici QR  
✅ **Carica Credito** - Aggiungi saldo  
✅ **Scala Credito** - Riduci saldo  
✅ **Visualizza Storico** - Transazioni per giorno  
✅ **QR Viewer** - `/qr/CUST_001` per visualizzare QR  

---

## 📝 Note Importanti

### ⚠️ Mock Mode = Test Only
- I dati restano solo nel **localStorage** del browser
- Se ripulisci la cache... spariscono! 😅
- In produzione usi **Firebase Firestore** per salvare

### 🔄 Come Resettare i Dati
Nel browser console (F12):
```javascript
localStorage.clear()
location.reload()
```

### 🔐 Cambio da Mock a Firebase
Nel file `.env.local` cambia:
```bash
# Da:
VITE_USE_MOCK_DATA=true

# A:
VITE_USE_MOCK_DATA=false
```

Poi riavvia: `npm run dev`

---

## 🧪 Test Scenario

### Test 1: Carica Credito
1. Dashboard → Clicca su "Alex Rossi"
2. Pulsante "➕ Carica"
3. Inserisci: `10` (euro)
4. Motivo: `Acquisto booster`
5. Clicca ✓ Conferma
6. Saldo passa da €45.50 a €55.50 ✅

### Test 2: Scala Credito
1. Dashboard → Clicca su "Alex Rossi"
2. Pulsante "➖ Scala"
3. Inserisci: `5` (euro)
4. Motivo: `Rimborso`
5. Clicca ✓ Conferma
6. Saldo passa da €55.50 a €50.50 ✅

### Test 3: Storico Transazioni
1. Menu Bottom → "📊 Storico"
2. Vedi tutte le transazioni del giorno
3. Clicca ⤴️ per stornare un movimento

### Test 4: QR Code
1. Menu Bottom → "📲 Scansiona"
2. Leggi il QR di un cliente
3. Oppure vai a `/qr/CUST_001` per vedere il QR generato

---

## 🎯 Prossimo Step (Quando Sei Pronto)

1. **Configura Firebase** (vedi SETUP_GUIDE.md)
2. **Cambia VITE_USE_MOCK_DATA=false** in .env.local
3. **Usa credenziali reali** per login
4. **Deploy in produzione** 🚀

---

## 📞 Troubleshooting

### "Login non funziona"
- [ ] Controlla che sia localhost:5174 (o la porta giusta)
- [ ] F12 → Console tab → Vedi errori?
- [ ] Ricarica: Ctrl+Shift+R (hard refresh)

### "Non vedo i clienti nel Dashboard"
- [ ] localStorage pulito? (`localStorage.clear()`)
- [ ] Mock mode attivato? (`.env.local` con `VITE_USE_MOCK_DATA=true`)
- [ ] Hai fatto login? (barra superiore dovrebbe mostrare email)

### "Operazioni non salvano"
- [ ] Controlla che sei in mock mode
- [ ] Apri DevTools (F12) → Application → localStorage
- [ ] Dovrebbe esserci `manacredit_mock_data`

---

**Buon Testing! 🎉**

Per info complete vedi: **TESTING_GUIDE.md**
