# Money Pro 💶

Web app (PWA) per tenere sotto controllo la tua cassa: **entrate, uscite, rate fisse e mutui**.
I dati restano **solo sul tuo dispositivo** (localStorage); puoi spostarli con export/import.

## Caratteristiche

- **Saldo cassa** sempre in evidenza
- **Movimenti**: entrate e uscite con categoria, data e filtro per mese
- **Rate fisse / mutui**: importo mensile, giorno di addebito, numero rate totali
  - avanzamento (es. `12/120`), importo residuo, rate concluse
  - "Rate in scadenza" con pulsante **Paga** che registra il movimento
- **PWA installabile**: si aggiunge alla home come un'app e funziona **offline**
- **Backup**: esporta/importa un file `.json` per spostare i dati tra cellulare e PC

## Come usarla

### Provala subito (in locale)
```bash
cd MONEY-PRO
python3 -m http.server 8099
# apri http://localhost:8099
```

### Pubblicarla online (gratis, con GitHub Pages)
1. Su GitHub: **Settings → Pages**
2. Source: branch `main` (o quello attivo), cartella `/root`
3. In pochi minuti l'app è online a un indirizzo tipo `https://<utente>.github.io/money-pro/`
4. Aprila dal telefono e da **Condividi → Aggiungi a Home** per installarla

### Spostare i dati tra dispositivi
Poiché i dati sono locali: **Impostazioni → Esporta backup** su un dispositivo,
poi **Importa backup** sull'altro.

## Struttura del progetto

| File | Ruolo |
|------|-------|
| `index.html` | struttura dell'interfaccia |
| `styles.css` | stile (tema chiaro/scuro automatico) |
| `app.js` | logica: dati, calcoli, rendering |
| `manifest.json` | configurazione PWA |
| `sw.js` | service worker (offline) |
| `icons/` | icone dell'app (SVG + PNG) |

## Sviluppo da più dispositivi

Il progetto vive su GitHub, quindi puoi iniziare dal cellulare e continuare dal PC
(o viceversa): ogni modifica viene committata e pushata sul branch di lavoro.

## Idee per il futuro

- Grafici andamento mensile
- Categorie con budget
- Sincronizzazione cloud (per avere gli stessi dati su tutti i dispositivi)
