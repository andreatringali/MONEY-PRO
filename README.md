# Tasca 🐷

Web app (PWA) per tenere sotto controllo la tua cassa, ispirata alle app di gestione
finanziaria personale: **conti, entrate, uscite, operazioni programmate, rate e mutui**.
I dati restano **solo sul tuo dispositivo** (localStorage); puoi spostarli con export/import.

## Caratteristiche

- **Oggi**: saldo attuale, previsione a 30 giorni e lista delle **operazioni programmate**
  (con stato *Scaduta*, badge colorati e pulsante **Paga** che le conferma in cassa)
- **Bilancio**: patrimonio netto e saldo di ogni **conto** (es. Andrea, Greta, Contanti)
- **Movimenti**: storico di entrate/uscite con filtro per mese e per conto
- **Categorie con icone**: griglia visuale (Casa, Auto, Spesa, Bollette, Mutuo…) personalizzabile
- **Ripetizione**: operazioni settimanali, mensili o annuali; pagando una rata ricompare la successiva
- **Resoconti**: entrate/uscite del mese, uscite per categoria, saldo previsto
- **PWA installabile**: si aggiunge alla home e funziona **offline**
- **Backup**: esporta/importa un file `.json` per spostare i dati tra cellulare e PC

## Come vederla online (GitHub Pages)

Il repository include un workflow che pubblica l'app automaticamente. Per attivarlo una volta sola:

1. Su GitHub apri **Settings → Pages**
2. Alla voce **Build and deployment → Source** scegli **GitHub Actions**
3. Attendi ~1 minuto: l'app sarà online a `https://<utente>.github.io/MONEY-PRO/`

Da lì, sul telefono, **Condividi → Aggiungi a Home** per installarla come app.
Ad ogni push sul branch di sviluppo l'app online si aggiorna da sola.

## Provala in locale

```bash
python3 -m http.server 8099
# apri http://localhost:8099
```

## Spostare i dati tra dispositivi

I dati sono locali: **Altro → Esporta** su un dispositivo, poi **Importa** sull'altro.

## Struttura

| File | Ruolo |
|------|-------|
| `index.html` | struttura dell'interfaccia (5 schede) |
| `styles.css` | stile scuro |
| `app.js` | logica: conti, categorie, movimenti, operazioni programmate |
| `manifest.json` / `sw.js` | configurazione PWA e supporto offline |
| `icons/` | icone dell'app |
| `.github/workflows/pages.yml` | pubblicazione automatica su GitHub Pages |

## Idee per il futuro

- Vista **calendario** mensile delle operazioni programmate
- **Budget** per categoria
- **Trasferimenti** tra conti
- Sincronizzazione cloud (stessi dati su tutti i dispositivi)
