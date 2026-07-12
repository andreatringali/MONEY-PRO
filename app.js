/* Tasca — gestione cassa personale (dati locali)
   Conti, categorie con icone, movimenti e operazioni programmate. */
(function () {
  "use strict";

  const APP_VERSION = "v24";

  // ---------- Icone (SVG inline) ----------
  const ICONS = {
    today: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/>',
    dashboard: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/>',
    scale: '<path d="M12 3v17M6 20h12M6 7h12M6 7L3 13h6zM18 7l-3 6h6zM3 13a3 3 0 006 0M15 13a3 3 0 006 0"/>',
    swap: '<path d="M7 4v13M7 4L4 7.5M7 4l3 3.5M17 20V7M17 20l-3-3.5M17 20l3-3.5"/>',
    chart: '<path d="M5 20v-5M10 20v-10M15 20v-14M20 20v-8" stroke-width="2.4"/><path d="M3 20h18"/>',
    dots: '<g fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></g>',
    home: '<path d="M4 11l8-6 8 6M6 10v9h12v-9M10 19v-5h4v5"/>',
    cart: '<path d="M3 4h2l2.2 11.2a1 1 0 001 .8h8.4a1 1 0 001-.8L21 7H6"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
    restaurant: '<path d="M7 3v18M5 3v5a2 2 0 004 0V3M17 3c-1.8 1-3 4-3 7h3v11"/>',
    coffee: '<path d="M4 8h13v4a5 5 0 01-5 5H9a5 5 0 01-5-5zM17 9h2.5a2 2 0 010 4H17M7 3v2M11 3v2"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16M8 17v2M16 17v2"/><circle cx="8" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>',
    car: '<path d="M4 12l1.6-5.2A2 2 0 017.5 5.4h9a2 2 0 011.9 1.4L20 12M3 12h18v4H3zM6 16v2M18 16v2"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/>',
    bolt: '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.8.7 1 1.3 1 2.5h6c0-1.2.2-1.8 1-2.5A6 6 0 0012 3z"/>',
    health: '<path d="M9.5 4h5v5h5v5h-5v5h-5v-5h-5V9h5z"/>',
    bag: '<path d="M6 8h12l-1 12H7zM9 8V6a3 3 0 016 0v2"/>',
    subscription: '<path d="M4 9a8 8 0 0113-3l3 3M20 15a8 8 0 01-13 3l-3-3M20 4v5h-5M4 20v-5h5"/>',
    plane: '<path d="M22 3L2 10l7 3 3 7z"/><path d="M22 3L11 14"/>',
    fun: '<path d="M12 3l2.6 5.5 6 .8-4.3 4.2 1 6-5.3-2.9L6.7 19.5l1-6L3.4 9.3l6-.8z"/>',
    tax: '<path d="M4 9l8-5 8 5M5 9v9M9 9v9M15 9v9M19 9v9M3 21h18M3 9h18"/>',
    gift: '<path d="M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8C11 4 8 4 8 6.2 8 8 10 8 12 8zM12 8c1-4 4-4 4-1.8C16 8 14 8 12 8z"/>',
    mortgage: '<path d="M6 21V7l6-4 6 4v14M3 21h18M9 10h2M13 10h2M9 14h2M13 14h2M10 21v-4h4v4"/>',
    loan: '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2.3"/><path d="M6 10v.01M18 14v.01"/>',
    debt: '<path d="M6 6h15v9M3 9h15v9H3z"/><circle cx="10.5" cy="13.5" r="2"/>',
    savings: '<path d="M9.5 6.5h5L13 4h-2zM11 4c-3 2-4.5 6-4.5 9.5a5.5 5.5 0 0011 0C17.5 10 16 6 13 4M12 10.5v5M10 12.5h4"/>',
    family: '<circle cx="8" cy="7" r="2.5"/><circle cx="16" cy="7" r="2.5"/><path d="M3 20a5 5 0 0110 0M11 20a5 5 0 0110 0"/>',
    misc: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M9 8h6M9 16h6"/>',
    salary: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>',
    trading: '<path d="M4 16l4-5 3 3 5-7M4 20h16M14 7h4v4"/>',
    refund: '<path d="M9 7L4 12l5 5M4 12h10a5 5 0 010 10h-1"/>',
    wallet: '<path d="M4 7a2 2 0 012-2h11a2 2 0 012 2v1h1a1 1 0 011 1v8a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><circle cx="17" cy="12.5" r="1.2"/>',
    bank: '<path d="M4 9l8-5 8 5M5 9v9M9 9v9M15 9v9M19 9v9M3 21h18M3 9h18"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
    coins: '<ellipse cx="9" cy="7" rx="5" ry="2.5"/><path d="M4 7v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7"/><ellipse cx="15" cy="14" rx="5" ry="2.5"/><path d="M10 14v3c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-3"/>',
    tag: '<path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1.3"/>',
  };

  function svg(name) {
    const inner = ICONS[name] || ICONS.tag;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }

  // ---------- Dati ----------
  const STORAGE_KEY = "moneypro_data_v2";

  function defaultData() {
    return {
      version: 2,
      accounts: [{ id: "acc_cash", name: "Contanti", icon: "wallet", type: "payment", opening: 0 }],
      categories: defaultCategories(),
      transactions: [],
      goals: [],
      loans: [],
      favorites: [],
      settings: { pin: null, reminders: false, lastBackup: null, theme: "light", baseCurrency: "EUR", rates: {} },
    };
  }
  function defaultCategories() {
    const ex = [
      ["Casa", "home"], ["Alimentari", "cart"], ["Ristorante", "restaurant"], ["Bar", "coffee"],
      ["Trasporto", "bus"], ["Automobile", "car"], ["Bollette", "bolt"], ["Salute", "health"],
      ["Shopping", "bag"], ["Abbonamenti", "subscription"], ["Viaggi", "plane"], ["Svago", "fun"],
      ["Tasse", "tax"], ["Regali", "gift"], ["Mutuo", "mortgage"], ["Finanziamenti", "loan"],
      ["Debiti", "debt"], ["Banca", "savings"], ["Famiglia", "family"], ["Varie", "misc"],
    ];
    const inc = [
      ["Stipendio", "salary"], ["Extra", "trading"], ["Rimborso", "refund"],
      ["Regalo", "gift"], ["Interessi", "savings"],
    ];
    const mk = (arr, kind) => arr.map(([name, icon]) => ({ id: slug(name) + "_" + kind, name, icon, kind }));
    return [...mk(ex, "expense"), ...mk(inc, "income")];
  }
  function slug(s) { return s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  let data = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return migrateOrDefault();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultData(), parsed);
    } catch (e) { return defaultData(); }
  }
  function migrateOrDefault() {
    // Prova a importare dalla v1 se presente
    try {
      const oldRaw = localStorage.getItem("moneypro_data_v1");
      if (!oldRaw) return defaultData();
      const old = JSON.parse(oldRaw);
      const d = defaultData();
      const accId = d.accounts[0].id;
      const catByName = {};
      d.categories.forEach((c) => (catByName[c.name.toLowerCase()] = c.id));
      (old.transactions || []).forEach((t) => {
        d.transactions.push({
          id: t.id || uid(), accountId: accId,
          categoryId: catByName[(t.category || "").toLowerCase()] || null,
          kind: t.kind, amount: t.amount, description: t.description || "",
          date: t.date, planned: false, repeat: "none", groupId: null,
        });
      });
      return d;
    } catch (e) { return defaultData(); }
  }
  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  // ---------- Formattazione e valute ----------
  function baseCurrency() { return (data.settings && data.settings.baseCurrency) || "EUR"; }
  function currencyRate(cur) {
    if (!cur || cur === baseCurrency()) return 1;
    const r = data.settings && data.settings.rates && data.settings.rates[cur];
    return r > 0 ? r : 1;
  }
  // valore di "amount" (in valuta "cur") espresso nella valuta base
  function toBase(amount, cur) { return (amount || 0) * currencyRate(cur); }
  // converte da una valuta all'altra passando dalla base
  function convertCur(amount, from, to) {
    const b = toBase(amount, from), rt = currencyRate(to);
    return rt ? b / rt : b;
  }
  function accCurrency(accId) { const a = accById(accId); return (a && a.currency) || baseCurrency(); }
  // assicura che esista un tasso per la valuta (default 1 = da impostare in Altro)
  function ensureRateFor(code) {
    if (!code || code === baseCurrency()) return;
    if (!data.settings.rates) data.settings.rates = {};
    if (!(data.settings.rates[code] > 0)) data.settings.rates[code] = 1;
  }
  const _nfCache = {};
  function nf(cur, dec) {
    const key = cur + "|" + dec;
    if (!_nfCache[key]) {
      try { _nfCache[key] = new Intl.NumberFormat("it-IT", { style: "currency", currency: cur, maximumFractionDigits: dec }); }
      catch (e) { _nfCache[key] = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: dec }); }
    }
    return _nfCache[key];
  }
  function money(n, cur) { return nf(cur || baseCurrency(), 2).format(n || 0); }
  function money0(n, cur) { return nf(cur || baseCurrency(), 0).format(n || 0); }

  function todayIso() { return isoOf(new Date()); }
  function isoOf(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function p2(n) { return String(n).padStart(2, "0"); }
  function parseIso(iso) { return new Date(iso + "T00:00:00"); }
  function periodKey(iso) { return iso.slice(0, 7); }
  function currentPeriod() { return todayIso().slice(0, 7); }
  function shiftMonth(key, delta) {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return d.getFullYear() + "-" + p2(d.getMonth() + 1);
  }
  function fmtDateShort(iso) {
    return parseIso(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  }
  function periodLabel(key) {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function addInterval(iso, repeat) {
    const d = parseIso(iso);
    if (repeat === "weekly") d.setDate(d.getDate() + 7);
    else if (repeat === "monthly") {
      const day = d.getDate();
      d.setDate(1); d.setMonth(d.getMonth() + 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(day, last));
    } else if (repeat === "yearly") d.setFullYear(d.getFullYear() + 1);
    return isoOf(d);
  }

  // ---------- Lookup ----------
  const catById = (id) => data.categories.find((c) => c.id === id);
  const accById = (id) => data.accounts.find((a) => a.id === id);

  // ---------- Calcoli ----------
  function accountBalance(accId) {
    const acc = accById(accId);
    let bal = acc ? acc.opening || 0 : 0;
    const cur = accCurrency(accId);
    for (const t of data.transactions) {
      if (t.planned) continue;
      if (t.kind === "transfer") {
        if (t.fromAccountId === accId) bal -= t.amount;
        // il conto ricevente accredita l'importo convertito nella sua valuta
        if (t.toAccountId === accId) bal += convertCur(t.amount, accCurrency(t.fromAccountId), cur);
      } else if (t.accountId === accId) {
        bal += t.kind === "income" ? t.amount : -t.amount;
      }
    }
    return bal;
  }
  // saldo di un conto convertito nella valuta base (per i totali complessivi)
  function accountBalanceBase(accId) { return toBase(accountBalance(accId), accCurrency(accId)); }
  function totalBalance() {
    return data.accounts.filter((a) => a.type !== "liability")
      .reduce((s, a) => s + accountBalanceBase(a.id), 0);
  }
  function netWorth() { return data.accounts.reduce((s, a) => s + accountBalanceBase(a.id), 0); }

  function plannedSorted() {
    return data.transactions.filter((t) => t.planned).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }
  function monthTotals(pkey) {
    let income = 0, expense = 0;
    for (const t of data.transactions) {
      if (t.planned || periodKey(t.date) !== pkey) continue;
      const v = toBase(t.amount, accCurrency(t.accountId));
      if (t.kind === "income") income += v; else expense += v;
    }
    return { income, expense };
  }
  function forecast30() {
    const end = new Date(); end.setDate(end.getDate() + 30);
    const endIso = isoOf(end);
    let delta = 0;
    for (const t of plannedSorted()) {
      if (t.date <= endIso) delta += (t.kind === "income" ? 1 : -1) * toBase(t.amount, accCurrency(t.accountId));
    }
    return { now: totalBalance(), future: totalBalance() + delta, delta };
  }
  // "Disponibile davvero": quanto puoi spendere da qui al prossimo accredito,
  // già tolte le spese programmate (rate, bollette) in arrivo entro quella data.
  function computeSafe() {
    const today = todayIso();
    const incomes = plannedSorted().filter((t) => t.kind === "income" && t.date >= today);
    let horizon, nextIncomeDate = null;
    if (incomes.length) { nextIncomeDate = incomes[0].date; horizon = nextIncomeDate; }
    else { const d = parseIso(today); horizon = isoOf(new Date(d.getFullYear(), d.getMonth() + 1, 0)); }
    let committed = 0;
    for (const t of plannedSorted()) {
      if (t.kind === "expense" && t.date >= today && t.date <= horizon) committed += toBase(t.amount, accCurrency(t.accountId));
    }
    return { available: totalBalance() - committed, committed, horizon, nextIncomeDate };
  }

  // ---------- DOM ----------
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  function render() {
    renderNavIcons();
    renderToday();
    renderPlanned();
    renderCalendar();
    renderBilancio();
    renderLoans();
    renderFavorites();
    renderFavManage();
    renderMovimenti();
    renderResoconti();
    renderTrend();
    renderCurrencies();
    renderBackupStatus();
    save();
  }

  function renderNavIcons() {
    $$(".tab-ico[data-i]").forEach((el) => { if (!el.dataset.done) { el.innerHTML = svg(el.dataset.i); el.dataset.done = "1"; } });
  }

  function renderToday() {
    const now = new Date();
    $("#today-num").textContent = now.getDate();
    $("#today-dow").textContent = cap(now.toLocaleDateString("it-IT", { weekday: "long" }));
    $("#today-my").textContent = cap(now.toLocaleDateString("it-IT", { month: "long", year: "numeric" }));

    const bal = totalBalance();
    const hb = $("#hero-balance");
    hb.textContent = money(bal); hb.classList.toggle("neg", bal < 0);
    const f = forecast30();

    // Stat cards
    const pk = currentPeriod();
    const { income, expense } = monthTotals(pk);
    $("#dash-month").textContent = new Date().toLocaleDateString("it-IT", { month: "long" });
    $("#dash-in").textContent = money0(income);
    $("#dash-out").textContent = money0(expense);
    const net = $("#dash-net"); net.textContent = (income - expense >= 0 ? "" : "") + money0(income - expense);
    net.classList.toggle("neg", income - expense < 0);
    const fore = $("#dash-fore"); fore.textContent = money0(f.future);
    fore.classList.toggle("neg", f.future < 0);

    // Disponibile davvero (safe-to-spend)
    const safe = computeSafe();
    const sv = $("#safe-value");
    if (sv) {
      sv.textContent = money(safe.available);
      sv.classList.toggle("neg", safe.available < 0);
      const days = Math.max(0, Math.round((parseIso(safe.horizon) - parseIso(todayIso())) / 86400000));
      $("#safe-until").textContent = (safe.nextIncomeDate ? "al prossimo accredito" : "a fine mese") + " · " + cap(fmtDateShort(safe.horizon));
      $("#safe-note").textContent = safe.committed > 0
        ? `${days} giorni · tolte le spese in arrivo (${money0(safe.committed)})`
        : `${days} giorni · nessuna spesa programmata in arrivo`;
    }

    // Conti — grafico a torta (donut) + legenda
    const nw = netWorth();
    const nwEl = $("#dash-networth");
    nwEl.textContent = money(nw);
    nwEl.classList.toggle("neg", nw < 0);
    nwEl.classList.toggle("pos", nw >= 0);
    renderAccountsDonut();

    // Top spese del mese
    const byCat = {};
    for (const t of data.transactions) {
      if (t.planned || t.kind !== "expense" || periodKey(t.date) !== pk) continue;
      byCat[t.categoryId] = (byCat[t.categoryId] || 0) + toBase(t.amount, accCurrency(t.accountId));
    }
    const top = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const tmax = top.length ? top[0][1] : 1;
    $("#dash-topcat").innerHTML = top.length ? top.map(([cid, v]) => {
      const c = catById(cid);
      return `<div class="cat-line"><span class="cbico">${svg(c ? c.icon : "tag")}</span>
        <span>${c ? esc(c.name) : "—"}</span><b>${money0(v)}</b>
        <span class="cbbar"><i style="width:${v / tmax * 100}%"></i></span></div>`;
    }).join("") : `<div class="empty">Nessuna spesa registrata questo mese.</div>`;

    renderUpcoming();
    renderGoals();
  }

  // Prossimi movimenti — timeline dei prossimi 5 operazioni programmate
  function renderUpcoming() {
    const box = $("#dash-upcoming");
    if (!box) return;
    const today = todayIso();
    const up = plannedSorted().filter((t) => t.date >= today).slice(0, 5);
    if (!up.length) {
      box.innerHTML = `<div class="empty">Nessun movimento in programma nei prossimi giorni.</div>`;
      return;
    }
    box.innerHTML = up.map((t) => {
      const c = catById(t.categoryId);
      const inc = t.kind === "income";
      const xfer = t.kind === "transfer";
      const cls = inc ? "in" : xfer ? "xfer" : "out";
      const sign = inc ? "+" : xfer ? "" : "−";
      return `<div class="tl-row" data-edit="${t.id}">
        <span class="tl-dot ${cls}"></span>
        <div class="tl-ico">${svg(c ? c.icon : "tag")}</div>
        <div class="tl-main">
          <div class="tl-title">${esc(t.description || (c ? c.name : "Operazione"))}</div>
          <div class="tl-date">${cap(fmtDateShort(t.date))}${t.auto ? ' · <span class="pill auto">auto</span>' : ""}</div>
        </div>
        <b class="tl-amt ${cls}">${sign}${money0(t.amount, accCurrency(t.accountId))}</b>
      </div>`;
    }).join("");
  }

  // Grafico a torta (donut) dei conti + legenda
  const ACC_COLORS = ["#B4573F", "#1E4A4E", "#C1913F", "#5C8A63", "#8C6D9C", "#4A7BA6", "#C97F5D", "#7A8450"];
  function renderAccountsDonut() {
    const box = $("#dash-accounts");
    if (!box) return;
    const accs = data.accounts.map((a) => ({ a, b: accountBalance(a.id), bb: accountBalanceBase(a.id) }));
    const pos = accs.filter((x) => x.bb > 0);
    const totPos = pos.reduce((s, x) => s + x.bb, 0);
    const colorOf = {};
    pos.forEach((x, i) => { colorOf[x.a.id] = ACC_COLORS[i % ACC_COLORS.length]; });

    let donut = "";
    if (totPos > 0) {
      const R = 42, C = 2 * Math.PI * R, W = 20;
      let off = 0;
      const slices = pos.map((x) => {
        const len = C * (x.bb / totPos);
        const gap = pos.length > 1 ? 1.5 : 0; // piccolo stacco tra fette
        const seg = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${colorOf[x.a.id]}" stroke-width="${W}" stroke-dasharray="${Math.max(0, len - gap)} ${C - Math.max(0, len - gap)}" stroke-dashoffset="${-off}"/>`;
        off += len;
        return seg;
      }).join("");
      donut = `<svg viewBox="0 0 120 120" class="donut"><g transform="rotate(-90 60 60)">${slices}</g></svg>`;
    } else {
      donut = `<div class="donut-empty">—</div>`;
    }

    const legend = accs.map((x) => {
      const share = x.bb > 0 && totPos > 0 ? Math.round(x.bb / totPos * 100) : null;
      const dot = x.bb > 0 ? colorOf[x.a.id] : "var(--muted)";
      return `<div class="acc-leg-row" data-goto="bilancio">
        <span class="alr-dot" style="background:${dot}"></span>
        <span class="alr-name">${esc(x.a.name)}</span>
        <span class="alr-pct">${share != null ? share + "%" : "—"}</span>
        <b class="alr-val ${x.b < 0 ? "neg" : ""}">${money(x.b, accCurrency(x.a.id))}</b>
      </div>`;
    }).join("");

    box.innerHTML = `<div class="acc-donut">${donut}</div><div class="acc-legend">${legend}</div>`;
  }

  // In scadenza / da pagare — vive nella tab Giornaliero
  function renderPlanned() {
    const planned = plannedSorted();
    const today = todayIso();
    const card = $("#scadenze-card");
    if (card) card.style.display = planned.length ? "" : "none";
    $("#prev-total").textContent = planned.length ? planned.length + " voci" : "";
    const box = $("#planned-list");
    if (!box) return;
    box.innerHTML = planned.map((t) => {
      const c = catById(t.categoryId);
      const overdue = t.date < today;
      const badgeClass = t.kind === "income" ? "plan-in" : "plan-out";
      const sign = t.kind === "income" ? "+" : "";
      return `<div class="row" data-edit="${t.id}">
        <div class="row-ico">${svg(c ? c.icon : "tag")}</div>
        <div class="row-main">
          <div class="row-title">${esc(t.description || (c ? c.name : "Operazione"))}</div>
          <div class="row-sub ${overdue ? "warn" : ""}">
            ${overdue ? '<span class="warn-ico">!</span> Scaduta ·' : ""} ${cap(fmtDateShort(t.date))}${t.time ? " " + t.time : ""}
            ${t.repeat !== "none" ? "· ripete" : ""}${t.auto ? ' · <span class="pill auto">auto</span>' : ""}
          </div>
        </div>
        <span class="amount-badge ${badgeClass}">${sign}${money0(t.amount, accCurrency(t.accountId))}</span>
        <button class="pay-btn" data-pay="${t.id}">Paga</button>
      </div>`;
    }).join("");
  }

  function renderBilancio() {
    const groups = [
      { label: "Conti di pagamento", types: ["bank", "cash", "card", "payment"] },
      { label: "Investimenti", types: ["invest"] },
      { label: "Passività", types: ["liability"] },
    ];
    const box = $("#accounts-list");
    // ogni gruppo è un box: titolo + Aggiungi in intestazione, totale in fondo
    let html = "";
    let firstBox = true;
    for (const g of groups) {
      const accs = data.accounts.filter((a) => g.types.includes(a.type || "payment"));
      if (!accs.length) continue;
      const sum = accs.reduce((s, a) => s + accountBalanceBase(a.id), 0);
      const addBtn = firstBox ? `<button class="link-btn" data-add-account>Aggiungi</button>` : "";
      firstBox = false;
      html += `<div class="card">
        <div class="card-head"><h3>${g.label}</h3>${addBtn}</div>
        <div class="list inset">` +
        accs.map((a) => {
          const b = accountBalance(a.id);
          const cur = accCurrency(a.id);
          const meta = ACCOUNT_TYPES[a.type] || ACCOUNT_TYPES.payment;
          const curBadge = cur !== baseCurrency() ? ` · <span class="cur-badge">${esc(cur)}</span>` : "";
          return `<div class="row" data-acc-edit="${a.id}">
            <div class="row-ico">${svg(a.icon || meta.icon)}</div>
            <div class="row-main"><div class="row-title">${esc(a.name)}</div>
              <div class="row-sub">${meta.label}${curBadge}</div></div>
            <span class="acc-bal ${b < 0 ? "neg" : "pos"}">${money(b, cur)}</span>
          </div>`;
        }).join("") +
        `</div>
        <div class="acc-total"><span>Totale</span><b class="${sum < 0 ? "neg" : "pos"}">${money(sum)}</b></div>
      </div>`;
    }
    box.innerHTML = html;
  }

  function renderGoals() {
    const box = $("#goals-list");
    if (!data.goals || !data.goals.length) {
      box.innerHTML = `<div class="goals-empty">Nessun obiettivo. Tocca "Aggiungi" per crearne uno.</div>`;
      return;
    }
    box.innerHTML = data.goals.map((g) => {
      const cur = goalCurrent(g);
      const pct = g.target > 0 ? Math.max(0, Math.min(100, (cur / g.target) * 100)) : 0;
      const remaining = g.target - cur;
      const srcLabel = g.source === "total" ? "Totale" : (accById(g.source) ? accById(g.source).name : "Totale");
      return `<div class="goal" data-goal-edit="${g.id}">
        <div class="goal-top"><span class="goal-name">${esc(g.name)}</span>
          <span class="goal-target">obiettivo ${money0(g.target)}</span></div>
        <div class="goal-cur ${cur < 0 ? "neg" : "pos"}">${money(cur)}</div>
        <div class="goal-bar"><i style="width:${pct}%"></i></div>
        <div class="goal-foot"><span>${srcLabel}</span>
          ${remaining <= 0 ? '<span class="done">Raggiunto! 🎉</span>' : `<span>${Math.floor(pct)}% · manca ${money0(remaining)}</span>`}</div>
      </div>`;
    }).join("");
  }
  function goalCurrent(g) {
    return g.source === "total" || !accById(g.source) ? netWorth() : accountBalance(g.source);
  }

  // ---------- Calendario / ricerca ----------
  let calMonth = currentPeriod();  // 'YYYY-MM'
  let selectedDay = null;          // 'YYYY-MM-DD' o null
  let searchQuery = "";
  let movView = "daily";           // 'daily' | 'ledger'

  function renderCalendar() {
    const [y, m] = calMonth.split("-").map(Number);
    $("#cal-title").textContent = cap(new Date(y, m - 1, 1).toLocaleDateString("it-IT", { month: "long", year: "numeric" }));
    const startDow = (new Date(y, m - 1, 1).getDay() + 6) % 7; // lun=0
    const daysInMonth = new Date(y, m, 0).getDate();
    const hasTx = {}, hasPlan = {};
    for (const t of data.transactions) {
      if (periodKey(t.date) !== calMonth) continue;
      if (t.planned) hasPlan[t.date] = true; else hasTx[t.date] = true;
    }
    const dows = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map((d) => `<span class="cal-dow">${d}</span>`);
    const blanks = Array.from({ length: startDow }, () => "<span></span>");
    const todayI = todayIso();
    const cells = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = y + "-" + p2(m) + "-" + p2(d);
      const cls = (iso === todayI ? "today " : "") + (iso === selectedDay ? "sel" : "");
      const dot = hasPlan[iso] ? '<i class="dot plan"></i>' : hasTx[iso] ? '<i class="dot"></i>' : "";
      cells.push(`<button class="cal-day ${cls}" data-day="${iso}"><span>${d}</span>${dot}</button>`);
    }
    $("#cal-grid").innerHTML = dows.concat(blanks, cells).join("");
  }

  function renderMovimenti() {
    const sel = $("#filter-month"), selA = $("#filter-account");
    const periods = Array.from(new Set(data.transactions.filter((t) => !t.planned).map((t) => periodKey(t.date)))).sort().reverse();
    const pv = sel.value;
    sel.innerHTML = `<option value="all">Tutti i mesi</option>` + periods.map((p) => `<option value="${p}">${cap(periodLabel(p))}</option>`).join("");
    if (pv && (pv === "all" || periods.includes(pv))) sel.value = pv;
    const av = selA.value;
    selA.innerHTML = `<option value="all">Tutti i conti</option>` + data.accounts.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join("");
    if (av) selA.value = av;

    const fm = sel.value || "all", fa = selA.value || "all";
    let items = data.transactions.filter((t) => !t.planned).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    if (fm !== "all") items = items.filter((t) => periodKey(t.date) === fm);
    if (fa !== "all") items = items.filter((t) => t.accountId === fa || t.fromAccountId === fa || t.toAccountId === fa);
    if (selectedDay) items = items.filter((t) => t.date === selectedDay);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((t) => {
        const c = catById(t.categoryId), a = accById(t.accountId);
        return [t.description, c && c.name, a && a.name, String(t.amount).replace(".", ","), ...(t.tags || [])]
          .filter(Boolean).some((s) => String(s).toLowerCase().includes(q));
      });
    }

    const box = $("#movements-list");
    const dayBar = selectedDay
      ? `<div class="day-filter-bar"><span>Giorno: <b>${cap(fmtDayLong(selectedDay))}</b></span><button data-clear-day>Mostra tutti</button></div>`
      : "";

    // Quando è selezionato un giorno, mostra anche le operazioni PROGRAMMATE di quel giorno
    // (es. la rata di un finanziamento), così cliccando sul calendario si vede la spesa prevista.
    const plannedBlock = selectedDay ? plannedDayBlock(selectedDay) : "";

    if (movView === "forecast") { renderForecast(fa); return; }

    if (!items.length) {
      box.innerHTML = dayBar + plannedBlock +
        (plannedBlock ? "" : `<div class="empty">Nessun movimento in questo ${selectedDay ? "giorno" : "periodo"}.</div>`);
      return;
    }

    // Raggruppa per giorno
    const days = [];
    const byDay = {};
    for (const t of items) {
      if (!byDay[t.date]) { byDay[t.date] = []; days.push(t.date); }
      byDay[t.date].push(t);
    }
    box.innerHTML = days.map((day) => {
      const list = byDay[day];
      const net = list.reduce((s, t) => s + (t.kind === "income" ? 1 : t.kind === "expense" ? -1 : 0) * toBase(t.amount, accCurrency(t.accountId)), 0);
      const rows = list.map((t) => {
        if (t.kind === "transfer") {
          const fa = accById(t.fromAccountId), ta = accById(t.toAccountId);
          return `<div class="row" data-edit="${t.id}">
            <div class="row-ico">${svg("swap")}</div>
            <div class="row-main"><div class="row-title">${esc(t.description || "Trasferimento")}</div>
              <div class="row-sub">${t.time ? t.time + " · " : ""}${fa ? esc(fa.name) : "?"} → ${ta ? esc(ta.name) : "?"}</div>
              ${tagChips(t.tags)}</div>
            <span class="amount-plain xfer">${money(t.amount, accCurrency(t.fromAccountId))}</span>
          </div>`;
        }
        const c = catById(t.categoryId), a = accById(t.accountId);
        const sign = t.kind === "income" ? "+ " : "− ";
        return `<div class="row" data-edit="${t.id}">
          <div class="row-ico">${svg(c ? c.icon : "tag")}</div>
          <div class="row-main"><div class="row-title">${esc(t.description || (c ? c.name : "Movimento"))}</div>
            <div class="row-sub">${t.time ? t.time + " · " : ""}${a ? esc(a.name) : ""}${c ? " · " + esc(c.name) : ""}</div>
            ${tagChips(t.tags)}</div>
          <span class="amount-plain ${t.kind === "income" ? "in" : "out"}">${sign}${money(t.amount, accCurrency(t.accountId))}</span>
        </div>`;
      }).join("");
      return `<div class="card">
        <div class="card-head"><h3>${cap(fmtDayLong(day))}</h3>
          <span class="card-side ${net < 0 ? "neg" : "pos"}">${net >= 0 ? "+ " : "− "}${money(Math.abs(net))}</span></div>
        <div class="list inset">${rows}</div>
      </div>`;
    }).join("");
    box.innerHTML = dayBar + plannedBlock + box.innerHTML;
  }

  // Card con le operazioni programmate (previste) di un giorno specifico.
  function plannedDayBlock(iso) {
    const items = data.transactions.filter((t) => t.planned && t.date === iso);
    if (!items.length) return "";
    const today = todayIso();
    const rows = items.map((t) => {
      const c = catById(t.categoryId);
      const overdue = t.date < today;
      const badgeClass = t.kind === "income" ? "plan-in" : "plan-out";
      const sign = t.kind === "income" ? "+" : "";
      const a = accById(t.accountId);
      return `<div class="row" data-edit="${t.id}">
        <div class="row-ico">${svg(c ? c.icon : "tag")}</div>
        <div class="row-main">
          <div class="row-title">${esc(t.description || (c ? c.name : "Operazione"))}</div>
          <div class="row-sub ${overdue ? "warn" : ""}">
            ${overdue ? '<span class="warn-ico">!</span> Scaduta · ' : ""}Prevista${a ? " · " + esc(a.name) : ""}${t.repeat !== "none" ? " · ripete" : ""}${t.auto ? ' · <span class="pill auto">auto</span>' : ""}
          </div>
        </div>
        <span class="amount-badge ${badgeClass}">${sign}${money0(t.amount, accCurrency(t.accountId))}</span>
        <button class="pay-btn" data-pay="${t.id}">Paga</button>
      </div>`;
    }).join("");
    return `<div class="card">
      <div class="card-head"><h3>Previste</h3><span class="card-side">${items.length} ${items.length === 1 ? "voce" : "voci"}</span></div>
      <div class="list inset">${rows}</div>
    </div>`;
  }

  function fmtDayLong(iso) {
    const d = parseIso(iso);
    return d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "long" });
  }
  function fmtDayLongYear(iso) {
    const d = parseIso(iso);
    return d.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  }

  // ---------- Previsione (proiezione del saldo nel futuro) ----------
  let forecastMonths = 3; // orizzonte in mesi
  // Espande le operazioni programmate (incluse le ricorrenti) in singole occorrenze
  // da oggi fino all'orizzonte, ordinate per data.
  function forecastOccurrences(horizonIso) {
    const today = todayIso();
    const out = [];
    for (const t of data.transactions) {
      if (!t.planned || t.kind === "transfer") continue; // i trasferimenti non cambiano il totale
      if (t.repeat && t.repeat !== "none") {
        let d = t.date, guard = 0;
        while (d < today && guard < 1200) { d = addInterval(d, t.repeat); guard++; }
        while (d <= horizonIso && guard < 1200) { out.push({ t, date: d }); d = addInterval(d, t.repeat); guard++; }
      } else if (t.date >= today && t.date <= horizonIso) {
        out.push({ t, date: t.date });
      }
    }
    out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    return out;
  }
  function renderForecast(fa) {
    const box = $("#movements-list");
    const scope = fa === "all" ? "all" : fa;
    const cur = scope === "all" ? baseCurrency() : accCurrency(scope);
    const startBal = scope === "all" ? totalBalance() : accountBalance(scope);
    const scopeLabel = scope === "all" ? "Totale conti" : (accById(scope) ? accById(scope).name : "");

    const hz = new Date(); hz.setMonth(hz.getMonth() + forecastMonths);
    const horizonIso = isoOf(hz);
    const occ = forecastOccurrences(horizonIso).filter(({ t }) => scope === "all" || t.accountId === scope);

    const chips = [1, 3, 6, 12].map((m) =>
      `<button type="button" class="seg-btn ${m === forecastMonths ? "active" : ""}" data-fc-months="${m}">${m} ${m === 1 ? "mese" : "mesi"}</button>`
    ).join("");

    let html = `<div class="card forecast-card">
      <div class="card-head"><h3>Previsione</h3><span class="card-side">${esc(scopeLabel)}</span></div>
      <div class="seg fc-seg">${chips}</div>
      <div class="fc-today">
        <div class="fc-left"><span class="fc-dot today"></span><span class="fc-desc">Oggi</span></div>
        <div class="fc-bal-wrap"><span class="fc-bal-lab">Saldo attuale</span><b class="fc-bal ${startBal < 0 ? "neg" : ""}">${money(startBal, cur)}</b></div>
      </div>`;

    if (!occ.length) {
      html += `<div class="empty">Nessuna entrata o uscita programmata nei prossimi ${forecastMonths} ${forecastMonths === 1 ? "mese" : "mesi"}.</div></div>`;
      box.innerHTML = html;
      return;
    }

    let bal = startBal, lastMonth = periodKey(todayIso()), firstNeg = null;
    html += occ.map(({ t, date }) => {
      const inc = t.kind === "income";
      const amt = scope === "all" ? toBase(t.amount, accCurrency(t.accountId)) : t.amount;
      bal += inc ? amt : -amt;
      if (bal < 0 && !firstNeg) firstNeg = date;
      const c = catById(t.categoryId);
      const mk = periodKey(date);
      let sep = "";
      if (mk !== lastMonth) { sep = `<div class="fc-month">${cap(periodLabel(mk))}</div>`; lastMonth = mk; }
      const acc = accById(t.accountId);
      const sub = scope === "all" && acc ? esc(acc.name) : (c ? esc(c.name) : "");
      return `${sep}<div class="fc-row" data-edit="${t.id}">
        <div class="fc-left">
          <span class="fc-dot ${inc ? "in" : "out"}"></span>
          <div class="fc-main">
            <span class="fc-desc">${esc(t.description || (c ? c.name : "Operazione"))}</span>
            <span class="fc-sub">${cap(fmtDateShort(date))}${sub ? " · " + sub : ""}${t.auto ? ' · <span class="pill auto">auto</span>' : ""}</span>
          </div>
        </div>
        <div class="fc-bal-wrap">
          <span class="fc-amt ${inc ? "in" : "out"}">${inc ? "+ " : "− "}${money0(t.amount, accCurrency(t.accountId))}</span>
          <b class="fc-bal ${bal < 0 ? "neg" : ""}">${money(bal, cur)}</b>
        </div>
      </div>`;
    }).join("");

    html += `<div class="fc-end">
      <span>Saldo previsto tra ${forecastMonths} ${forecastMonths === 1 ? "mese" : "mesi"}</span>
      <b class="${bal < 0 ? "neg" : ""}">${money(bal, cur)}</b>
    </div>`;
    if (firstNeg) {
      html += `<div class="fc-warn"><span class="warn-ico">!</span> Il saldo va sotto zero il <b>${cap(fmtDateShort(firstNeg))}</b>. Occhio alle uscite in quel periodo.</div>`;
    }
    html += `</div>`;
    box.innerHTML = html;
  }

  function renderResoconti() {
    const pk = currentPeriod();
    $("#report-month").textContent = "· " + cap(periodLabel(pk));
    const { income, expense } = monthTotals(pk);
    const max = Math.max(income, expense, 1);
    $("#rep-in").textContent = money0(income); $("#rep-out").textContent = money0(expense);
    $("#bar-in").style.width = (income / max * 100) + "%";
    $("#bar-out").style.width = (expense / max * 100) + "%";
    $("#rep-net").textContent = money0(income - expense);

    // categorie uscite
    const byCat = {};
    for (const t of data.transactions) {
      if (t.planned || t.kind !== "expense" || periodKey(t.date) !== pk) continue;
      byCat[t.categoryId] = (byCat[t.categoryId] || 0) + toBase(t.amount, accCurrency(t.accountId));
    }
    const rows = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const cmax = rows.length ? rows[0][1] : 1;
    const cb = $("#cat-breakdown");
    cb.innerHTML = rows.length ? rows.map(([cid, v]) => {
      const c = catById(cid);
      return `<div class="cat-line"><span class="cbico">${svg(c ? c.icon : "tag")}</span>
        <span>${c ? esc(c.name) : "—"}</span><b>${money0(v)}</b>
        <span class="cbbar"><i style="width:${v / cmax * 100}%"></i></span></div>`;
    }).join("") : `<div class="empty">Nessuna uscita questo mese.</div>`;

    const f = forecast30();
    $("#forecast-box").innerHTML =
      `Saldo oggi: <b>${money(f.now)}</b><br>` +
      `Programmato nei prossimi 30 giorni: <b>${f.delta >= 0 ? "+" : ""}${money(f.delta)}</b><br>` +
      `Saldo previsto: <b>${money(f.future)}</b>`;

    renderBudget(pk, byCat);
    renderStats(pk);
  }

  // ---------- Statistiche & confronti ----------
  function renderStats(pk) {
    const periods = Array.from(new Set(
      data.transactions.filter((t) => !t.planned).map((t) => periodKey(t.date))
    )).sort();
    const prevKey = shiftMonth(pk, -1);
    const cur = monthTotals(pk), prev = monthTotals(prevKey);
    $("#stats-cur-label").textContent = "(" + cap(periodLabel(pk)) + ")";

    // Confronto mese vs mese scorso
    const cmpRow = (label, a, b, goodUp) => {
      const delta = a - b;
      const pct = b !== 0 ? Math.round(Math.abs(delta) / Math.abs(b) * 100) : null;
      const arrow = delta === 0 ? "→" : delta > 0 ? "↑" : "↓";
      const good = delta === 0 ? "" : (goodUp ? delta > 0 : delta < 0) ? "stat-good" : "stat-bad";
      const deltaTxt = delta === 0
        ? "invariato"
        : `${arrow} ${money0(Math.abs(delta))}${pct !== null ? " · " + pct + "%" : ""}`;
      return `<div class="stat-row">
        <span class="stat-name">${label}</span>
        <b class="stat-val">${money0(a)}</b>
        <span class="stat-delta ${good}">${deltaTxt}</span></div>`;
    };
    const hasPrev = prev.income || prev.expense;
    $("#stats-compare").innerHTML =
      cmpRow("Entrate", cur.income, prev.income, true) +
      cmpRow("Uscite", cur.expense, prev.expense, false) +
      cmpRow("Bilancio", cur.income - cur.expense, prev.income - prev.expense, true) +
      (hasPrev ? "" : `<div class="stat-note">Nessun dato per ${cap(periodLabel(prevKey))}: il confronto sarà più utile con più mesi registrati.</div>`);

    // Medie mensili su tutti i mesi con movimenti
    let ti = 0, te = 0;
    periods.forEach((p) => { const m = monthTotals(p); ti += m.income; te += m.expense; });
    const n = periods.length || 1;
    const mIn = ti / n, mOut = te / n, mSave = mIn - mOut;
    $("#stats-avg-note").textContent = periods.length
      ? "(su " + periods.length + (periods.length === 1 ? " mese" : " mesi") + ")" : "";
    $("#stats-averages").innerHTML = periods.length ? `
      <div class="stat-avg"><span>Entrate medie</span><b class="stat-good">${money0(mIn)}</b></div>
      <div class="stat-avg"><span>Uscite medie</span><b class="stat-bad">${money0(mOut)}</b></div>
      <div class="stat-avg"><span>Risparmio medio</span><b class="${mSave >= 0 ? "stat-good" : "stat-bad"}">${money0(mSave)}</b></div>`
      : `<div class="empty">Aggiungi qualche movimento per vedere le medie.</div>`;
  }

  function renderBudget(pk, spentByCat) {
    const box = $("#budget-list");
    const budgeted = data.categories.filter((c) => c.kind === "expense" && c.budget > 0);
    if (!budgeted.length) {
      box.innerHTML = `<div class="budget-empty">Nessun budget impostato. Tocca "Imposta" per iniziare.</div>`;
      return;
    }
    box.innerHTML = budgeted.map((c) => {
      const spent = spentByCat[c.id] || 0;
      const pct = Math.min(100, (spent / c.budget) * 100);
      const cls = spent > c.budget ? "over" : pct >= 80 ? "warn" : "";
      const left = c.budget - spent;
      return `<div class="budget-row">
        <div class="budget-top"><span class="bico">${svg(c.icon)}</span>
          <span class="bname">${esc(c.name)}</span>
          <span class="bval">${money0(spent)} / ${money0(c.budget)}</span></div>
        <div class="budget-bar"><i class="${cls}" style="width:${pct}%"></i></div>
        <div class="budget-top"><span class="bval" style="margin-left:28px">${left >= 0 ? "restano " + money0(left) : "sforato di " + money0(-left)}</span></div>
      </div>`;
    }).join("");
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  // Tag: normalizza una stringa "a, b, c" in un array pulito e senza duplicati
  function parseTags(str) {
    const seen = new Set(); const out = [];
    String(str || "").split(",").forEach((raw) => {
      const t = raw.trim().replace(/^#/, "");
      if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); out.push(t); }
    });
    return out;
  }
  // Tutti i tag già usati, per i suggerimenti
  function allTags() {
    const set = new Map(); // chiave lowercase -> forma originale
    for (const t of data.transactions) for (const g of (t.tags || [])) if (!set.has(g.toLowerCase())) set.set(g.toLowerCase(), g);
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b, "it"));
  }
  function tagChips(tags) {
    if (!tags || !tags.length) return "";
    return `<span class="row-tags">${tags.map((g) => `<button type="button" class="tag-chip" data-tag="${esc(g)}">${esc(g)}</button>`).join("")}</span>`;
  }
  // Suggerimenti tag nel modale: mostra i tag già usati che combaciano con l'ultimo digitato
  function renderTagSuggest() {
    const box = $("#tag-suggest"); if (!box) return;
    const val = $("#f-tags").value;
    const already = parseTags(val).map((t) => t.toLowerCase());
    const partial = (val.split(",").pop() || "").trim().toLowerCase();
    let opts = allTags().filter((g) => !already.includes(g.toLowerCase()) || g.toLowerCase() === partial);
    if (partial) opts = opts.filter((g) => g.toLowerCase().includes(partial) && g.toLowerCase() !== partial);
    else opts = opts.filter((g) => !already.includes(g.toLowerCase()));
    opts = opts.slice(0, 8);
    box.innerHTML = opts.map((g) => `<button type="button" class="tag-opt" data-tag-add="${esc(g)}">${esc(g)}</button>`).join("");
  }
  function addTagFromSuggest(tag) {
    const parts = $("#f-tags").value.split(",");
    parts[parts.length - 1] = " " + tag; // sostituisce l'ultimo (parziale) col tag completo
    $("#f-tags").value = parseTags(parts.join(",")).join(", ") + ", ";
    $("#f-tags").focus();
    renderTagSuggest();
  }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2200); }

  // ---------- Modale movimento ----------
  const modal = $("#modal");
  let editingId = null;
  const form = { kind: "expense", categoryId: null, accountId: null, toAccountId: null, repeat: "none" };

  function openModal(editTx) {
    modal.hidden = false;
    if (editTx) {
      editingId = editTx.id;
      form.kind = editTx.kind; form.categoryId = editTx.categoryId;
      form.accountId = editTx.kind === "transfer" ? editTx.fromAccountId : editTx.accountId;
      form.toAccountId = editTx.toAccountId || null; form.repeat = editTx.repeat || "none";
      $("#f-amount").value = editTx.amount;
      $("#f-desc").value = editTx.description || "";
      $("#f-tags").value = (editTx.tags || []).join(", ");
      $("#f-date").value = editTx.date;
      $("#f-time").value = editTx.time || "";
      $("#f-planned").checked = !!editTx.planned;
      $("#f-auto").checked = !!editTx.auto;
      $("#modal-title").textContent = "Modifica";
      $("#delete-entry").hidden = false;
    } else {
      editingId = null;
      form.kind = "expense"; form.categoryId = null;
      form.accountId = data.accounts[0] ? data.accounts[0].id : null;
      form.toAccountId = data.accounts[1] ? data.accounts[1].id : null; form.repeat = "none";
      $("#entry-form").reset();
      $("#f-date").value = todayIso();
      $("#modal-title").textContent = "Nuovo";
      $("#delete-entry").hidden = true;
    }
    $("#tag-suggest").innerHTML = "";
    syncKind(); syncRepeat(); syncPickers();
  }
  function closeModal() { modal.hidden = true; }

  function syncKind() {
    $$("#seg-kind .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.kind === form.kind));
    const isXfer = form.kind === "transfer";
    $("#pick-category").style.display = isXfer ? "none" : "";
    $("#pick-account2").hidden = !isXfer;
    $("#recur-fields").style.display = isXfer ? "none" : "";
    $("#acc-label").textContent = isXfer ? "Da conto" : "Conto";
  }
  function syncRepeat() { $$("#repeat-chips .chip").forEach((b) => b.classList.toggle("active", b.dataset.rep === form.repeat)); }
  function syncPickers() {
    const c = catById(form.categoryId);
    $("#cat-ico").innerHTML = svg(c ? c.icon : "tag");
    $("#cat-name").textContent = c ? c.name : "Scegli…";
    const fcur = $("#f-cur"); if (fcur) fcur.textContent = curInfo(accCurrency(form.accountId)).symbol;
    const a = accById(form.accountId);
    $("#acc-ico").innerHTML = svg(a ? a.icon || "wallet" : "wallet");
    $("#acc-name").textContent = a ? a.name : "—";
    const a2 = accById(form.toAccountId);
    $("#acc-ico2").innerHTML = svg(a2 ? a2.icon || "wallet" : "wallet");
    $("#acc-name2").textContent = a2 ? a2.name : "—";
  }

  function saveEntry() {
    const amount = parseFloat(String($("#f-amount").value).replace(",", "."));
    if (!(amount > 0)) { toast("Inserisci un importo"); return; }

    let payload;
    if (form.kind === "transfer") {
      if (!form.accountId || !form.toAccountId) { toast("Scegli i conti"); return; }
      if (form.accountId === form.toAccountId) { toast("Scegli due conti diversi"); return; }
      payload = {
        kind: "transfer", fromAccountId: form.accountId, toAccountId: form.toAccountId,
        amount, description: $("#f-desc").value.trim(),
        date: $("#f-date").value || todayIso(), time: $("#f-time").value || "",
        planned: false, repeat: "none", auto: false,
        accountId: null, categoryId: null, tags: parseTags($("#f-tags").value),
      };
    } else {
      if (!form.categoryId) { toast("Scegli una categoria"); return; }
      if (!form.accountId) { toast("Scegli un conto"); return; }
      const auto = $("#f-auto").checked;
      const planned = $("#f-planned").checked || auto || form.repeat !== "none";
      payload = {
        accountId: form.accountId, categoryId: form.categoryId, kind: form.kind,
        amount, description: $("#f-desc").value.trim(),
        date: $("#f-date").value || todayIso(), time: $("#f-time").value || "",
        planned, repeat: form.repeat, auto, fromAccountId: null, toAccountId: null,
        tags: parseTags($("#f-tags").value),
      };
    }
    // salva come preferito (solo movimenti, non trasferimenti)
    if (form.kind !== "transfer" && $("#f-fav").checked) {
      if (!data.favorites) data.favorites = [];
      data.favorites.push({ id: "fav_" + uid(), kind: form.kind, amount, description: payload.description, categoryId: form.categoryId, accountId: form.accountId });
    }
    if (editingId) {
      const t = data.transactions.find((x) => x.id === editingId);
      const recurring = (t.repeat && t.repeat !== "none") || t.loanId || (payload.repeat && payload.repeat !== "none");
      Object.assign(t, payload);
      if (recurring) {
        const applyAll = confirm("Apportare le modifiche anche ai pagamenti successivi?\n\nOK = applica a tutte le occorrenze future · Annulla = solo questa");
        if (applyAll && t.loanId) {
          const loan = (data.loans || []).find((l) => l.id === t.loanId);
          if (loan) {
            loan.rata = payload.amount;
            loan.accountId = payload.accountId;
            loan.dayOfMonth = Math.min(28, Math.max(1, parseIso(payload.date).getDate()));
            if (payload.description) loan.name = payload.description;
            loan.nextDue = payload.date;
            regenLoanSchedule(loan); // ricrea la rata futura dal finanziamento aggiornato
          }
        }
        // ricorrente generica: se "tutte", la modifica su questa occorrenza si propaga
        // alle successive (vengono copiate da qui); se "solo questa", nulla da fare.
      }
      toast("Modifica salvata");
    } else {
      data.transactions.push(Object.assign({ id: uid(), groupId: null }, payload));
      toast(form.kind === "transfer" ? "Trasferimento salvato" : payload.planned ? "Operazione programmata" : "Movimento salvato");
    }
    render(); closeModal();
  }

  function settlePlanned(t, useToday) {
    const schedDate = t.date;
    const loan = t.loanId ? (data.loans || []).find((l) => l.id === t.loanId) : null;
    if (!loan && t.repeat && t.repeat !== "none") {
      // ricorrente generica: la prossima occorrenza è copiata da questa
      data.transactions.push({
        id: uid(), accountId: t.accountId, categoryId: t.categoryId, kind: t.kind,
        amount: t.amount, description: t.description, date: addInterval(schedDate, t.repeat),
        time: t.time || "", planned: true, repeat: t.repeat, auto: t.auto,
        fromAccountId: t.fromAccountId || null, toAccountId: t.toAccountId || null,
        loanId: null, groupId: t.groupId || t.id, tags: (t.tags || []).slice(),
      });
    }
    t.planned = false;
    if (useToday) t.date = todayIso();
    t.repeat = "none";
    t.auto = false;
    // finanziamento: una rata in meno, residuo che cala, prossima rata dal template
    if (loan) {
      if (loan.residuo > 0) loan.residuo = Math.max(0, round2(loan.residuo - loanCapitalQuota(loan)));
      loan.paid = Math.min(loan.months, (loan.paid || 0) + 1);
      loan.nextDue = loan.paid >= loan.months ? "" : addInterval(schedDate, "monthly");
      ensureLoanSchedule(loan);
    }
  }

  function payPlanned(id) {
    const t = data.transactions.find((x) => x.id === id);
    if (!t) return;
    settlePlanned(t, true);
    render();
    toast("Segnata come pagata");
  }

  // Registra da sole le operazioni automatiche scadute (anche recuperando i mesi arretrati)
  function autoSettle() {
    const today = todayIso();
    let guard = 0;
    for (;;) {
      const due = data.transactions.find((t) => t.planned && t.auto && t.date <= today);
      if (!due || guard++ > 500) break;
      settlePlanned(due, false);
    }
  }

  // ---------- Picker categoria ----------
  const catModal = $("#cat-modal");
  let catPickMode = "select"; // 'select' | 'manage'
  function openCatPicker(mode) {
    catPickMode = mode || "select";
    catModal.hidden = false;
    $("#cat-modal-title").textContent = catPickMode === "manage" ? "Gestisci categorie" : "Scegli categoria";
    const kind = catPickMode === "manage" ? "expense" : form.kind;
    renderCatGrid(kind);
  }
  function renderCatGrid(kind) {
    const grid = $("#cat-grid");
    const cats = data.categories.filter((c) => c.kind === kind);
    grid.innerHTML = cats.map((c) =>
      `<button type="button" class="cat-cell ${form.categoryId === c.id ? "selected" : ""}" data-cat="${c.id}">
        <span class="cc-ico">${svg(c.icon)}</span><span>${esc(c.name)}</span></button>`
    ).join("") +
      `<button type="button" class="cat-cell" data-cat-add="${kind}">
        <span class="cc-ico">${svg("tag")}</span><span>Aggiungi</span></button>`;
  }
  function closeCatPicker() { catModal.hidden = true; }

  // ---------- Picker conto ----------
  const accModal = $("#acc-modal");
  let accPickerTarget = "from"; // 'from' (accountId) | 'to' (toAccountId)
  function openAccPicker(target) {
    accPickerTarget = target || "from";
    accModal.hidden = false;
    $("#acc-picker-list").innerHTML = data.accounts.map((a) =>
      `<div class="row" data-acc-pick="${a.id}"><div class="row-ico">${svg(a.icon || "wallet")}</div>
        <div class="row-main"><div class="row-title">${esc(a.name)}</div>
        <div class="row-sub">${money(accountBalance(a.id))}</div></div></div>`
    ).join("") + `<div class="row" data-acc-new><div class="row-ico">${svg("tag")}</div>
      <div class="row-main"><div class="row-title">Nuovo conto…</div></div></div>`;
  }
  function closeAccPicker() { accModal.hidden = true; }

  // ---------- Gestione conto (modale) ----------
  const ACCOUNT_TYPES = {
    bank: { label: "Banca", icon: "bank" },
    cash: { label: "Contanti", icon: "wallet" },
    card: { label: "Carta", icon: "card" },
    invest: { label: "Investimenti", icon: "trading" },
    liability: { label: "Debito", icon: "loan" },
    payment: { label: "Conto", icon: "wallet" }, // compatibilità v2
  };
  const ACCOUNT_ICONS = ["bank", "wallet", "card", "trading", "coins", "savings", "loan", "home"];
  const CURRENCIES = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "Dollaro USA" },
    { code: "GBP", symbol: "£", name: "Sterlina" },
    { code: "CHF", symbol: "CHF", name: "Franco svizzero" },
    { code: "JPY", symbol: "¥", name: "Yen giapponese" },
    { code: "CAD", symbol: "C$", name: "Dollaro canadese" },
    { code: "AUD", symbol: "A$", name: "Dollaro australiano" },
    { code: "SEK", symbol: "kr", name: "Corona svedese" },
    { code: "NOK", symbol: "kr", name: "Corona norvegese" },
    { code: "DKK", symbol: "kr", name: "Corona danese" },
    { code: "PLN", symbol: "zł", name: "Zloty polacco" },
    { code: "CZK", symbol: "Kč", name: "Corona ceca" },
    { code: "USDT", symbol: "₮", name: "Tether (USDT)" },
    { code: "BTC", symbol: "₿", name: "Bitcoin" },
  ];
  function curInfo(code) { return CURRENCIES.find((c) => c.code === code) || { code, symbol: code, name: code }; }
  // elenco valute selezionabili: quelle predefinite + eventuali già presenti nei dati
  function knownCurrencies() {
    const set = new Map();
    CURRENCIES.forEach((c) => set.set(c.code, c));
    (data.accounts || []).forEach((a) => { if (a.currency && !set.has(a.currency)) set.set(a.currency, curInfo(a.currency)); });
    Object.keys((data.settings && data.settings.rates) || {}).forEach((k) => { if (!set.has(k)) set.set(k, curInfo(k)); });
    return Array.from(set.values());
  }
  const accountModal = $("#account-modal");
  let accEditId = null;
  let pendingAccSelect = false;
  const accForm = { type: "bank", icon: "bank" };

  function openAccountEditor(acc) {
    accountModal.hidden = false;
    // popola le valute selezionabili
    const sel = $("#am-currency");
    if (sel) sel.innerHTML = knownCurrencies().map((c) => `<option value="${c.code}">${c.code} · ${esc(c.name)}</option>`).join("");
    if (acc) {
      accEditId = acc.id;
      accForm.type = acc.type && ACCOUNT_TYPES[acc.type] ? acc.type : "bank";
      accForm.icon = acc.icon || ACCOUNT_TYPES[accForm.type].icon;
      accForm.currency = acc.currency || baseCurrency();
      $("#am-title").textContent = "Modifica conto";
      $("#am-name").value = acc.name;
      $("#am-balance").value = round2(accountBalance(acc.id));
      $("#am-delete").hidden = data.accounts.length <= 1;
      $("#am-import-block").hidden = false;
    } else {
      accEditId = null;
      accForm.type = "bank"; accForm.icon = "bank";
      accForm.currency = baseCurrency();
      $("#am-title").textContent = "Nuovo conto";
      $("#am-name").value = "";
      $("#am-balance").value = "";
      $("#am-delete").hidden = true;
      $("#am-import-block").hidden = true; // l'import è disponibile dopo aver creato il conto
    }
    if (sel) sel.value = accForm.currency;
    syncAccCurrency();
    syncAccType(); syncAccIcons();
  }
  function syncAccCurrency() {
    const sym = $("#am-cur");
    if (sym) sym.textContent = curInfo(accForm.currency || baseCurrency()).symbol;
  }
  function closeAccountEditor() { accountModal.hidden = true; }
  function round2(n) { return Math.round(n * 100) / 100; }

  // ---------- Import estratto conto (CSV) ----------
  const csvState = { accountId: null, rows: [], header: [], mode: "single" };

  function parseCSV(text, delim) {
    const rows = []; let row = [], field = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === delim) { row.push(field); field = ""; }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else if (c !== "\r") field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function detectDelim(firstLine) {
    const counts = { ";": 0, ",": 0, "\t": 0 };
    let inQ = false;
    for (const c of firstLine) { if (c === '"') inQ = !inQ; else if (!inQ && counts[c] !== undefined) counts[c]++; }
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  }
  function parseCsvDate(s) {
    s = String(s || "").trim();
    let m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/); // YYYY-MM-DD
    if (m) return `${m[1]}-${p2(+m[2])}-${p2(+m[3])}`;
    m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/); // DD/MM/YYYY
    if (m) { let y = +m[3]; if (y < 100) y += 2000; return `${y}-${p2(+m[2])}-${p2(+m[1])}`; }
    return null;
  }
  function parseCsvAmount(s) {
    s = String(s == null ? "" : s).replace(/[^\d.,\-]/g, "").trim();
    if (!s) return null;
    const hasC = s.includes(","), hasD = s.includes(".");
    if (hasC && hasD) { // l'ultimo separatore è quello decimale
      if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
      else s = s.replace(/,/g, "");
    } else if (hasC) s = s.replace(",", ".");
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function guessCol(header, patterns) {
    for (let i = 0; i < header.length; i++) if (patterns.test(header[i])) return i;
    return -1;
  }
  function startCsvImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const firstLine = text.split("\n")[0] || "";
      const delim = detectDelim(firstLine);
      const all = parseCSV(text, delim).filter((r) => r.some((c) => String(c).trim() !== ""));
      if (all.length < 2) { toast("CSV vuoto o non riconosciuto"); return; }
      csvState.header = all[0].map((h) => h.trim());
      csvState.rows = all.slice(1);
      openCsvModal();
    };
    reader.readAsText(file);
  }
  function fillColSelect(sel, guessIdx, allowNone) {
    const opts = (allowNone ? `<option value="-1">—</option>` : "") +
      csvState.header.map((h, i) => `<option value="${i}">${esc(h || ("Colonna " + (i + 1)))}</option>`).join("");
    sel.innerHTML = opts;
    sel.value = String(guessIdx);
  }
  function openCsvModal() {
    const acc = accById(csvState.accountId);
    $("#csv-account-note").textContent = acc
      ? `${csvState.rows.length} righe · verranno aggiunte a "${acc.name}" (${accCurrency(acc.id)})` : "";
    const H = csvState.header;
    const gIn = guessCol(H, /entrat|accredit|avere|credit/i);
    const gOut = guessCol(H, /uscit|addebit|dare|debit/i);
    fillColSelect($("#csv-col-date"), guessCol(H, /data|date|valuta/i), false);
    fillColSelect($("#csv-col-desc"), guessCol(H, /descr|causal|operazion|dettagl|narrativ|movimento|beneficiar/i), false);
    fillColSelect($("#csv-col-amount"), Math.max(0, guessCol(H, /import|amount|valore|value/i)), false);
    fillColSelect($("#csv-col-in"), gIn, true);
    fillColSelect($("#csv-col-out"), gOut, true);
    // se il file ha due colonne Entrate/Uscite, scegli in automatico quella modalità
    csvState.mode = (gIn >= 0 && gOut >= 0) ? "split" : "single";
    $$("#csv-amt-mode .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === csvState.mode));
    $("#csv-single-fields").hidden = csvState.mode !== "single";
    $("#csv-split-fields").hidden = csvState.mode !== "split";
    $("#csv-note").value = "";
    $("#csv-future-planned").checked = true;
    $("#csv-modal").hidden = false;
    renderCsvPreview();
  }
  function closeCsvModal() { $("#csv-modal").hidden = true; }
  function csvParsedRows() {
    const di = +$("#csv-col-date").value, dsi = +$("#csv-col-desc").value;
    const out = [];
    for (const r of csvState.rows) {
      const date = parseCsvDate(r[di]);
      if (!date) continue;
      let amount = null;
      if (csvState.mode === "single") {
        const negOut = $("#csv-neg-out").checked;
        let v = parseCsvAmount(r[+$("#csv-col-amount").value]);
        if (v == null) continue;
        amount = negOut ? v : v; // il segno è già nel valore
      } else {
        const ii = +$("#csv-col-in").value, oi = +$("#csv-col-out").value;
        const vin = ii >= 0 ? parseCsvAmount(r[ii]) : null;
        const vout = oi >= 0 ? parseCsvAmount(r[oi]) : null;
        if (vin) amount = Math.abs(vin);
        else if (vout) amount = -Math.abs(vout);
        else continue;
      }
      if (amount === 0 || amount == null) continue;
      out.push({ date, description: String(r[dsi] || "").trim(), amount });
    }
    return out;
  }
  function renderCsvPreview() {
    const rows = csvParsedRows();
    const cur = accCurrency(csvState.accountId);
    let dup = 0;
    const fresh = rows.filter((r) => { const d = isCsvDup(r); if (d) dup++; return !d; });
    const fp = $("#csv-future-planned"); const futurePlanned = fp ? fp.checked : true;
    const today = todayIso();
    const planCount = fresh.filter((r) => futurePlanned && r.date > today).length;
    $("#csv-summary").innerHTML = rows.length
      ? `<b>${fresh.length}</b> movimenti da importare${planCount ? ` · ${planCount} come programmati` : ""}${dup ? ` · ${dup} già presenti (saltati)` : ""}`
      : `Nessun movimento riconosciuto: controlla le colonne.`;
    const show = rows.slice(0, 8);
    $("#csv-preview").innerHTML = show.length
      ? `<table class="csv-table"><thead><tr><th>Data</th><th>Descrizione</th><th>Importo</th></tr></thead><tbody>` +
        show.map((r) => `<tr class="${isCsvDup(r) ? "dup" : ""}"><td>${cap(fmtDateShort(r.date))}</td><td>${esc(r.description)}</td><td class="num ${r.amount < 0 ? "out" : "in"}">${money(r.amount, cur)}</td></tr>`).join("") +
        `</tbody></table>${rows.length > 8 ? `<p class="muted small center">…e altri ${rows.length - 8}</p>` : ""}`
      : "";
  }
  function isCsvDup(r) {
    const desc = r.description.toLowerCase();
    return data.transactions.some((t) => t.accountId === csvState.accountId &&
      t.date === r.date && Math.abs((t.kind === "income" ? t.amount : -t.amount) - r.amount) < 0.005 &&
      String(t.description || "").toLowerCase() === desc);
  }
  function confirmCsvImport() {
    const rows = csvParsedRows().filter((r) => !isCsvDup(r));
    if (!rows.length) { toast("Nessun nuovo movimento da importare"); return; }
    const note = ($("#csv-note").value || "").trim();
    const tags = note ? [note] : [];
    const futurePlanned = $("#csv-future-planned").checked;
    const today = todayIso();
    let planCount = 0;
    for (const r of rows) {
      const planned = futurePlanned && r.date > today;
      if (planned) planCount++;
      data.transactions.push({
        id: uid(), accountId: csvState.accountId, categoryId: null,
        kind: r.amount >= 0 ? "income" : "expense", amount: Math.abs(r.amount),
        description: r.description, date: r.date, time: "", planned,
        repeat: "none", auto: false, fromAccountId: null, toAccountId: null, groupId: "import", tags: tags.slice(),
      });
    }
    save(); render();
    closeCsvModal(); closeAccountEditor();
    const extra = planCount ? ` (${planCount} programmati)` : "";
    toast(rows.length + (rows.length === 1 ? " movimento importato" : " movimenti importati") + extra);
  }

  function syncAccType() {
    $$("#am-type-chips .chip").forEach((b) => b.classList.toggle("active", b.dataset.type === accForm.type));
  }
  function syncAccIcons() {
    $("#am-icon-row").innerHTML = ACCOUNT_ICONS.map((ic) =>
      `<button type="button" class="${ic === accForm.icon ? "active" : ""}" data-acc-icon="${ic}">${svg(ic)}</button>`
    ).join("");
  }

  function saveAccount() {
    const name = $("#am-name").value.trim();
    if (!name) { toast("Dai un nome al conto"); return; }
    const target = parseFloat(String($("#am-balance").value || "0").replace(",", ".")) || 0;
    const curCode = ($("#am-currency") && $("#am-currency").value) || accForm.currency || baseCurrency();
    ensureRateFor(curCode);
    if (accEditId) {
      const acc = accById(accEditId);
      const prevCur = accCurrency(accEditId);
      // se cambia la valuta, il saldo inserito è nella NUOVA valuta
      const current = prevCur === curCode ? accountBalance(accEditId) : target;
      acc.opening = round2((acc.opening || 0) + (target - current)); // porta il saldo al valore inserito
      acc.name = name; acc.type = accForm.type; acc.icon = accForm.icon; acc.currency = curCode;
      toast("Conto aggiornato");
    } else {
      const newAcc = { id: "acc_" + uid(), name, icon: accForm.icon, type: accForm.type, opening: target, currency: curCode };
      data.accounts.push(newAcc);
      if (pendingAccSelect) { if (accPickerTarget === "to") form.toAccountId = newAcc.id; else form.accountId = newAcc.id; syncPickers(); }
      toast("Conto aggiunto");
    }
    pendingAccSelect = false;
    save(); render(); closeAccountEditor();
  }

  function deleteAccount() {
    if (!accEditId) return;
    const hasTx = data.transactions.some((t) => t.accountId === accEditId);
    const msg = hasTx
      ? "Eliminare il conto? Verranno eliminati anche i movimenti collegati."
      : "Eliminare questo conto?";
    if (!confirm(msg)) return;
    data.transactions = data.transactions.filter((t) => t.accountId !== accEditId);
    data.accounts = data.accounts.filter((a) => a.id !== accEditId);
    if (form.accountId === accEditId) form.accountId = data.accounts[0] ? data.accounts[0].id : null;
    save(); render(); closeAccountEditor(); toast("Conto eliminato");
  }

  // ---------- Finanziamenti ----------
  function loanResiduo(l) { return l.residuo > 0 ? l.residuo : Math.max(0, (l.months || 0) - (l.paid || 0)) * (l.rata || 0); }
  // Tipo finanziamento: se non impostato, lo deduce dal nome (retrocompatibilità).
  function loanTipo(l) { return l.tipo || (/\bmutu/i.test(l.name || "") ? "mutuo" : "prestito"); }
  // Stima il tasso mensile dal piano corrente (rata, residuo capitale, rate rimaste),
  // così possiamo scomporre la rata in quota capitale e quota interessi.
  function loanMonthlyRate(l) {
    const P = l.residuo, R = l.rata, n = Math.max(0, (l.months || 0) - (l.paid || 0));
    if (!(P > 0) || !(R > 0) || n <= 0) return 0;
    if (R * n <= P + 0.005) return 0; // nessun interesse (rate ≤ capitale)
    const f = (i) => R * (1 - Math.pow(1 + i, -n)) / i - P; // decrescente in i
    let lo = 1e-9, hi = 1.0;
    if (f(hi) > 0) return hi;
    for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  // Quota capitale della prossima rata: la parte che riduce davvero il debito.
  function loanCapitalQuota(l) {
    if (!(l.residuo > 0)) return 0;
    const interest = round2(l.residuo * loanMonthlyRate(l));
    return Math.min(l.residuo, Math.max(0, round2(l.rata - interest)));
  }
  function finanziamentiCatId() { const c = data.categories.find((x) => x.id === "finanziamenti_expense") || data.categories.find((x) => x.kind === "expense"); return c ? c.id : null; }
  function loanPlannedTx(loanId) { return data.transactions.filter((t) => t.loanId === loanId && t.planned); }
  // Programma la prossima rata del finanziamento (se non c'è già), fino alla fine del piano
  function ensureLoanSchedule(l) {
    if (!l.nextDue || l.paid >= l.months) return;
    if (loanPlannedTx(l.id).length) return;
    data.transactions.push({
      id: uid(), accountId: l.accountId, categoryId: finanziamentiCatId(), kind: "expense",
      amount: l.rata, description: l.name, date: l.nextDue, time: "", planned: true,
      repeat: "monthly", auto: l.auto !== false, loanId: l.id,
      fromAccountId: null, toAccountId: null, groupId: null,
    });
  }
  function ensureLoanSchedules() { (data.loans || []).forEach(ensureLoanSchedule); }
  function regenLoanSchedule(l) {
    data.transactions = data.transactions.filter((t) => !(t.loanId === l.id && t.planned));
    ensureLoanSchedule(l);
  }
  function renderLoans() {
    const box = $("#loans-list");
    const loans = data.loans || [];
    if (!loans.length) {
      box.innerHTML = `<div class="loans-empty">Nessun finanziamento. Tocca "Aggiungi" per inserire un prestito con rata e residuo.</div>`;
      return;
    }
    const totRes = loans.reduce((s, l) => s + loanResiduo(l), 0);
    const totRata = loans.reduce((s, l) => s + (l.paid < l.months ? l.rata : 0), 0);
    let html = `<div class="loans-sum">Residuo totale <b>${money(totRes)}</b> · rata mensile <b>${money(totRata)}</b></div>`;
    html += loans.map((l) => {
      const rimaste = Math.max(0, l.months - l.paid);
      const done = l.paid >= l.months;
      const pct = l.months ? Math.min(100, l.paid / l.months * 100) : 0;
      const acc = accById(l.accountId);
      return `<div class="loan-row" data-loan-edit="${l.id}">
        <div class="loan-top">
          <span class="loan-name">${esc(l.name)} ${done ? '<span class="pill">estinto</span>' : ""}</span>
          <span class="loan-rata">${money0(l.rata)}/mese</span>
        </div>
        <div class="loan-bar"><i style="width:${pct}%"></i></div>
        <div class="loan-foot">
          <span>${l.paid}/${l.months} rate · <span class="res">residuo <b>${money0(loanResiduo(l))}</b></span></span>
          <span class="loan-actions">
            <button class="loan-plan" data-loan-plan="${l.id}">Piano</button>
            ${done ? '<span class="done">Estinto 🎉</span>' : `<button class="loan-pay" data-payloan="${l.id}">Paga rata</button>`}
          </span>
        </div>
      </div>`;
    }).join("");
    box.innerHTML = html;
  }

  // ---------- Piano di ammortamento (piano rate) ----------
  // Calcola l'elenco delle rate ancora da pagare: numero, scadenza, rata, residuo dopo.
  function loanSchedule(l) {
    const remaining = Math.max(0, (l.months || 0) - (l.paid || 0));
    if (!remaining) return [];
    // data di partenza: la prossima scadenza (o il giorno di addebito del mese prossimo)
    let date = l.nextDue;
    if (!date) {
      const t = parseIso(todayIso());
      const day = Math.min(l.dayOfMonth || 1, 28);
      let d = new Date(t.getFullYear(), t.getMonth(), day);
      if (d <= t) d = new Date(t.getFullYear(), t.getMonth() + 1, day);
      date = isoOf(d);
    }
    const rows = [];
    // "Residuo rate" = quanti soldi di rate restano da pagare DOPO ogni riga:
    // (rate ancora da versare dopo questa) × rata mensile → 0 all'ultima rata.
    for (let i = 0; i < remaining; i++) {
      const residuoAfter = round2((remaining - 1 - i) * l.rata);
      rows.push({ n: (l.paid || 0) + i + 1, date, rata: l.rata, residuoAfter });
      date = addInterval(date, "monthly");
    }
    return rows;
  }

  // Stima di quanto costa estinguere in anticipo il finanziamento oggi.
  // Serve il residuo capitale (dato dalla banca) per un calcolo sensato.
  function estinzioneBlock(l, remaining, interessi) {
    if (!(l.residuo > 0)) {
      return `<div class="plan-estinzione">
        <div class="pe-title">Estinzione anticipata</div>
        <p class="pe-note">Inserisci il <b>residuo capitale</b> del finanziamento (lo trovi nell'estratto della banca) per stimare quanto costerebbe chiuderlo oggi.</p>
      </div>`;
    }
    // Penale: mutuo prima casa (dal 2007) → 0; prestito/credito al consumo → max 1%, 0,5% se manca <1 anno.
    const mutuo = loanTipo(l) === "mutuo";
    const pct = mutuo ? 0 : (remaining > 12 ? 1 : 0.5);
    const penale = round2(l.residuo * pct / 100);
    const totale = round2(l.residuo + penale);
    const risparmio = interessi !== null ? round2(interessi - penale) : null;
    const penaleRow = mutuo
      ? `<div class="plan-sum-row"><span>Penale estinzione (mutuo)</span><b>0,00 €</b></div>`
      : `<div class="plan-sum-row"><span>Penale stimata (${String(pct).replace(".", ",")}%)</span><b>${money(penale)}</b></div>`;
    const note = mutuo
      ? `Per i <b>mutui prima casa</b> stipulati dal 2007 la penale è <b>zero</b> per legge. Il conteggio esatto (interessi maturati al giorno) lo fornisce sempre la banca.`
      : `Stima per <b>prestiti / credito al consumo</b>: penale max 1% del capitale (0,5% se manca meno di un anno). Il conteggio esatto lo fornisce sempre la banca.`;
    return `<div class="plan-estinzione">
      <div class="pe-title">Se estingui in anticipo oggi</div>
      <div class="plan-sum-row"><span>Capitale residuo da restituire</span><b>${money(l.residuo)}</b></div>
      ${penaleRow}
      <div class="plan-sum-row pe-tot"><span>Totale per chiudere</span><b>${money(totale)}</b></div>
      ${risparmio !== null ? `<div class="plan-sum-row pe-save"><span>Risparmi in interessi futuri</span><b>${money(risparmio)}</b></div>` : ""}
      <p class="pe-note">${note}</p>
    </div>`;
  }

  function openLoanPlan(loanId) {
    const l = (data.loans || []).find((x) => x.id === loanId);
    if (!l) return;
    planLoanId = loanId;
    const rows = loanSchedule(l);
    $("#plan-title").textContent = "Piano · " + (l.name || "Finanziamento");
    const totale = rows.reduce((s, r) => s + r.rata, 0);
    const fine = rows.length ? rows[rows.length - 1].date : null;
    const interessi = l.residuo > 0 && totale > l.residuo ? totale - l.residuo : null;
    const capNote = l.residuo > 0
      ? `<div class="plan-sum-row"><span>Residuo capitale (banca)</span><b>${money(l.residuo)}</b></div>` : "";
    const intNote = interessi !== null
      ? `<div class="plan-sum-row plan-int"><span>Interessi ancora da pagare</span><b>${money(interessi)}</b></div>` : "";
    $("#plan-summary").innerHTML = `
      <div class="plan-sum-row"><span>Rate rimaste</span><b>${rows.length} di ${l.months}</b></div>
      <div class="plan-sum-row"><span>Rata mensile</span><b>${money(l.rata)}</b></div>
      <div class="plan-sum-row"><span>Totale ancora da pagare</span><b>${money(totale)}</b></div>
      ${capNote}
      ${intNote}
      ${fine ? `<div class="plan-sum-row"><span>Ultima rata</span><b>${cap(fmtDayLongYear(fine))}</b></div>` : ""}
      ${estinzioneBlock(l, rows.length, interessi)}`;
    $("#plan-list").innerHTML = rows.length
      ? `<table class="plan-table">
          <thead><tr><th>#</th><th>Scadenza</th><th>Rata</th><th>Residuo rate</th></tr></thead>
          <tbody>${rows.map((r) => `<tr>
            <td>${r.n}</td>
            <td>${cap(fmtDateFull(r.date))}</td>
            <td class="num">${money(r.rata)}</td>
            <td class="num">${money(r.residuoAfter)}</td></tr>`).join("")}</tbody>
        </table>`
      : `<div class="empty">Finanziamento estinto: nessuna rata residua.</div>`;
    $("#plan-modal").hidden = false;
  }
  function closeLoanPlan() { $("#plan-modal").hidden = true; planLoanId = null; }
  function fmtDateFull(iso) {
    return parseIso(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  let planLoanId = null;

  // Stampa del piano di ammortamento
  function printLoanPlan() {
    const l = (data.loans || []).find((x) => x.id === planLoanId);
    if (!l) return;
    const area = $("#print-area");
    if (!area) return;
    const rows = loanSchedule(l);
    const totale = rows.reduce((s, r) => s + r.rata, 0);
    const now = parseIso(todayIso());
    area.innerHTML = `
      <h1 class="print-h1">Piano di ammortamento — ${esc(l.name || "Finanziamento")}</h1>
      <p class="print-sub">Generato il ${cap(now.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }))}</p>
      <table class="print-summary">
        <tr><td>Rate rimaste</td><td>${rows.length} di ${l.months}</td></tr>
        <tr><td>Rata mensile</td><td>${money(l.rata)}</td></tr>
        <tr><td><b>Totale ancora da pagare</b></td><td><b>${money(totale)}</b></td></tr>
        ${l.residuo > 0 ? `<tr><td>Residuo capitale (banca)</td><td>${money(l.residuo)}</td></tr>` : ""}
        ${l.residuo > 0 && totale > l.residuo ? `<tr><td>Interessi ancora da pagare</td><td>${money(totale - l.residuo)}</td></tr>` : ""}
        ${l.residuo > 0 ? (() => { const mutuo = loanTipo(l) === "mutuo"; const pct = mutuo ? 0 : (rows.length > 12 ? 1 : 0.5); const pen = round2(l.residuo * pct / 100); return `<tr><td>Estinzione anticipata (stima)</td><td>${money(round2(l.residuo + pen))} <span style="color:#888">(${mutuo ? "mutuo, penale 0" : "capitale + penale " + String(pct).replace(".", ",") + "%"})</span></td></tr>`; })() : ""}
      </table>
      <div class="print-section-title">Rate</div>
      <table class="print-table">
        <thead><tr><th>#</th><th>Scadenza</th><th>Rata</th><th>Residuo rate</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td>${r.n}</td><td>${fmtDateFull(r.date)}</td><td class="num">${money(r.rata)}</td><td class="num">${money(r.residuoAfter)}</td></tr>`).join("")}</tbody>
      </table>
      <p class="print-foot">Tasca · piano rate di ${esc(l.name || "finanziamento")}</p>`;
    window.print();
  }

  // ---------- Calcolatrice ----------
  const calc = { display: "0", acc: null, op: null, waiting: false, target: null };
  function openCalc(target) {
    calc.display = "0"; calc.acc = null; calc.op = null; calc.waiting = false; calc.target = target || null;
    // se aperta dal campo importo, precarica il valore esistente
    if (target === "amount") {
      const cur = String($("#f-amount").value || "").replace(",", ".");
      if (cur && !isNaN(parseFloat(cur))) { calc.display = cur; calc.waiting = true; }
    }
    $("#calc-use").hidden = target !== "amount";
    $("#calc-modal").hidden = false;
    syncCalc();
  }
  function closeCalc() { $("#calc-modal").hidden = true; }
  function syncCalc() {
    const d = $("#calc-display");
    if (d) d.textContent = calc.display.replace(".", ",");
  }
  function calcApply(a, op, b) {
    switch (op) { case "+": return a + b; case "-": return a - b; case "*": return a * b; case "/": return b === 0 ? 0 : a / b; }
    return b;
  }
  function calcKey(k) {
    if (/^[0-9]$/.test(k)) {
      if (calc.waiting || calc.display === "0") { calc.display = k; calc.waiting = false; }
      else if (calc.display.replace("-", "").length < 12) calc.display += k;
    } else if (k === ".") {
      if (calc.waiting) { calc.display = "0."; calc.waiting = false; }
      else if (!calc.display.includes(".")) calc.display += ".";
    } else if (k === "C") {
      calc.display = "0"; calc.acc = null; calc.op = null; calc.waiting = false;
    } else if (k === "back") {
      calc.display = calc.display.length > 1 ? calc.display.slice(0, -1) : "0";
      if (calc.display === "-" || calc.display === "") calc.display = "0";
    } else if (k === "%") {
      calc.display = calcFmt((parseFloat(calc.display) || 0) / 100);
      calc.waiting = true;
    } else if (k === "+" || k === "-" || k === "*" || k === "/") {
      const v = parseFloat(calc.display) || 0;
      if (calc.op !== null && !calc.waiting) { calc.acc = calcApply(calc.acc, calc.op, v); calc.display = calcFmt(calc.acc); }
      else calc.acc = v;
      calc.op = k; calc.waiting = true;
    } else if (k === "=") {
      if (calc.op !== null && calc.acc !== null) {
        calc.acc = calcApply(calc.acc, calc.op, parseFloat(calc.display) || 0);
        calc.display = calcFmt(calc.acc); calc.op = null; calc.waiting = true;
      }
    }
    syncCalc();
  }
  function calcFmt(n) {
    const r = Math.round(n * 1e8) / 1e8;
    return String(r);
  }
  function useCalcResult() {
    // completa eventuale operazione in sospeso
    if (calc.op !== null && calc.acc !== null && !calc.waiting) {
      calc.acc = calcApply(calc.acc, calc.op, parseFloat(calc.display) || 0);
      calc.display = calcFmt(calc.acc); calc.op = null;
    }
    const val = parseFloat(calc.display);
    if (calc.target === "amount" && !isNaN(val)) {
      $("#f-amount").value = round2(Math.abs(val));
    }
    closeCalc();
  }

  const loanModal = $("#loan-modal");
  let loanEditId = null;
  let lmTipo = "prestito";
  function openLoanEditor(loan) {
    loanModal.hidden = false;
    const accSel = $("#lm-account");
    accSel.innerHTML = data.accounts.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join("");
    if (loan) {
      loanEditId = loan.id;
      $("#lm-title").textContent = "Modifica finanziamento";
      $("#lm-rata").value = loan.rata; $("#lm-name").value = loan.name;
      $("#lm-months").value = loan.months; $("#lm-paid").value = loan.paid;
      $("#lm-day").value = loan.dayOfMonth || ""; accSel.value = loan.accountId || (data.accounts[0] && data.accounts[0].id);
      $("#lm-residuo").value = loan.residuo > 0 ? loan.residuo : "";
      $("#lm-next").value = loan.nextDue || "";
      $("#lm-auto").checked = loan.auto !== false;
      lmTipo = loanTipo(loan);
      $("#lm-delete").hidden = false;
    } else {
      loanEditId = null;
      $("#lm-title").textContent = "Nuovo finanziamento";
      $("#lm-rata").value = ""; $("#lm-name").value = "";
      $("#lm-months").value = ""; $("#lm-paid").value = "0"; $("#lm-day").value = ""; $("#lm-residuo").value = "";
      $("#lm-next").value = ""; $("#lm-auto").checked = true;
      lmTipo = "prestito";
      accSel.value = data.accounts[0] ? data.accounts[0].id : "";
      $("#lm-delete").hidden = true;
    }
    $$("#lm-type-chips .chip").forEach((c) => c.classList.toggle("active", c.dataset.tipo === lmTipo));
  }
  function closeLoanEditor() { loanModal.hidden = true; }
  function saveLoan() {
    const name = $("#lm-name").value.trim();
    const rata = parseFloat(String($("#lm-rata").value || "0").replace(",", ".")) || 0;
    const months = parseInt($("#lm-months").value, 10) || 0;
    const paid = Math.min(months, Math.max(0, parseInt($("#lm-paid").value, 10) || 0));
    const dayOfMonth = Math.min(28, Math.max(1, parseInt($("#lm-day").value, 10) || 1));
    const accountId = $("#lm-account").value || (data.accounts[0] && data.accounts[0].id);
    const residuo = parseFloat(String($("#lm-residuo").value || "0").replace(",", ".")) || 0;
    const nextDue = $("#lm-next").value || "";
    const auto = $("#lm-auto").checked;
    if (!name) { toast("Dai un nome al finanziamento"); return; }
    if (!(rata > 0) || !(months > 0)) { toast("Inserisci rata e numero rate"); return; }
    if (!data.loans) data.loans = [];
    let loan, isEdit = false;
    const tipo = lmTipo || "prestito";
    if (loanEditId) {
      loan = data.loans.find((x) => x.id === loanEditId); isEdit = true;
      Object.assign(loan, { name, rata, months, paid, dayOfMonth, accountId, residuo, nextDue, auto, tipo });
      toast("Finanziamento aggiornato");
    } else {
      loan = { id: "loan_" + uid(), name, rata, months, paid, dayOfMonth, accountId, residuo, nextDue, auto, tipo };
      data.loans.push(loan);
      toast("Finanziamento aggiunto");
    }
    const applyAll = !isEdit || confirm("Apportare le modifiche anche alle rate successive?\n\nOK = riprogramma tutte le rate future · Annulla = lascia le rate già programmate");
    if (applyAll) regenLoanSchedule(loan); // riprogramma le rate future
    autoSettle();            // registra subito le rate automatiche già scadute
    save(); render(); closeLoanEditor();
  }
  function deleteLoan() {
    if (loanEditId && confirm("Eliminare questo finanziamento? Le rate future programmate verranno rimosse.")) {
      data.transactions = data.transactions.filter((t) => !(t.loanId === loanEditId && t.planned));
      data.loans = data.loans.filter((l) => l.id !== loanEditId);
      save(); render(); closeLoanEditor(); toast("Finanziamento eliminato");
    }
  }
  function payLoanRata(id) {
    const l = (data.loans || []).find((x) => x.id === id);
    if (!l || l.paid >= l.months) return;
    const sched = loanPlannedTx(id).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
    if (sched) {
      settlePlanned(sched, false); // conferma la prossima rata e avanza il finanziamento
    } else {
      // nessuna rata programmata: avanza comunque e registra l'uscita
      if (l.residuo > 0) l.residuo = Math.max(0, round2(l.residuo - loanCapitalQuota(l)));
      l.paid += 1;
      data.transactions.push({
        id: uid(), accountId: l.accountId, categoryId: finanziamentiCatId(), kind: "expense",
        amount: l.rata, description: l.name, date: todayIso(), time: "", planned: false,
        repeat: "none", auto: false, fromAccountId: null, toAccountId: null, groupId: null,
      });
    }
    save(); render();
    toast(l.paid >= l.months ? "Finanziamento estinto! 🎉" : "Rata registrata");
  }

  // ---------- Obiettivi (modale) ----------
  const goalModal = $("#goal-modal");
  let goalEditId = null;
  const goalForm = { source: "total" };

  function openGoalEditor(goal) {
    goalModal.hidden = false;
    if (goal) {
      goalEditId = goal.id;
      goalForm.source = goal.source || "total";
      $("#gm-title").textContent = "Modifica obiettivo";
      $("#gm-name").value = goal.name;
      $("#gm-target").value = goal.target;
      $("#gm-delete").hidden = false;
    } else {
      goalEditId = null;
      goalForm.source = "total";
      $("#gm-title").textContent = "Nuovo obiettivo";
      $("#gm-name").value = "";
      $("#gm-target").value = "";
      $("#gm-delete").hidden = true;
    }
    renderGoalSources();
  }
  function closeGoalEditor() { goalModal.hidden = true; }
  function renderGoalSources() {
    const chips = [`<button type="button" class="chip ${goalForm.source === "total" ? "active" : ""}" data-gsource="total">Totale</button>`]
      .concat(data.accounts.map((a) =>
        `<button type="button" class="chip ${goalForm.source === a.id ? "active" : ""}" data-gsource="${a.id}">${esc(a.name)}</button>`));
    $("#gm-source").innerHTML = chips.join("");
  }
  function saveGoal() {
    const name = $("#gm-name").value.trim();
    const target = parseFloat(String($("#gm-target").value || "0").replace(",", ".")) || 0;
    if (!name) { toast("Dai un nome all'obiettivo"); return; }
    if (!(target > 0)) { toast("Inserisci l'importo da raggiungere"); return; }
    if (!data.goals) data.goals = [];
    if (goalEditId) {
      const g = data.goals.find((x) => x.id === goalEditId);
      Object.assign(g, { name, target, source: goalForm.source });
      toast("Obiettivo aggiornato");
    } else {
      data.goals.push({ id: "goal_" + uid(), name, target, source: goalForm.source });
      toast("Obiettivo creato");
    }
    save(); render(); closeGoalEditor();
  }
  function deleteGoal() {
    if (goalEditId && confirm("Eliminare questo obiettivo?")) {
      data.goals = data.goals.filter((g) => g.id !== goalEditId);
      save(); render(); closeGoalEditor(); toast("Obiettivo eliminato");
    }
  }

  // ---------- Budget (modale) ----------
  const budgetModal = $("#budget-modal");
  function openBudgetEditor() {
    budgetModal.hidden = false;
    const cats = data.categories.filter((c) => c.kind === "expense");
    $("#bm-list").innerHTML = cats.map((c) =>
      `<div class="bm-item"><span class="bmi-ico">${svg(c.icon)}</span>
        <span class="bmi-name">${esc(c.name)}</span>
        <input type="number" inputmode="decimal" step="0.01" min="0" data-budget-cat="${c.id}"
          placeholder="0" value="${c.budget > 0 ? c.budget : ""}" /></div>`
    ).join("");
  }
  function closeBudgetEditor() { budgetModal.hidden = true; }
  function saveBudget() {
    $$("#bm-list input[data-budget-cat]").forEach((inp) => {
      const c = catById(inp.dataset.budgetCat);
      if (c) c.budget = parseFloat(String(inp.value || "0").replace(",", ".")) || 0;
    });
    save(); render(); closeBudgetEditor(); toast("Budget salvato");
  }

  // ---------- Preferiti (inserimento veloce) ----------
  function renderFavorites() {
    const row = $("#fav-row");
    const favs = data.favorites || [];
    row.innerHTML = favs.map((f) => {
      const c = catById(f.categoryId);
      const sign = f.kind === "income" ? "+" : "−";
      return `<button class="fav-chip" data-fav="${f.id}">
        <span class="fc-ico">${svg(c ? c.icon : "tag")}</span>
        <span class="fc-txt">${esc(f.description || (c ? c.name : "Movimento"))}</span>
        <span class="fc-amt ${f.kind === "income" ? "in" : "out"}">${sign}${money(f.amount)}</span>
      </button>`;
    }).join("") + `<button class="fav-chip add" data-fav-add>+ Preferito</button>`;
  }
  function renderFavManage() {
    const box = $("#fav-manage");
    const favs = data.favorites || [];
    if (!favs.length) { box.innerHTML = `<div class="fav-manage-empty">Nessun preferito. Creane uno attivando "Salva come preferito" quando aggiungi un movimento.</div>`; return; }
    box.innerHTML = favs.map((f) => {
      const c = catById(f.categoryId);
      const sign = f.kind === "income" ? "+" : "−";
      return `<div class="fav-manage-item">
        <span class="fmi-ico">${svg(c ? c.icon : "tag")}</span>
        <span class="fmi-name">${esc(f.description || (c ? c.name : "Movimento"))}</span>
        <span class="fmi-amt ${f.kind === "income" ? "in" : "out"}">${sign}${money(f.amount)}</span>
        <button class="fmi-del" data-fav-del="${f.id}" aria-label="Elimina">×</button>
      </div>`;
    }).join("");
  }
  function quickAddFavorite(id) {
    const f = (data.favorites || []).find((x) => x.id === id);
    if (!f) return;
    data.transactions.push({
      id: uid(), accountId: f.accountId, categoryId: f.categoryId, kind: f.kind,
      amount: f.amount, description: f.description || "", date: todayIso(), time: "",
      planned: false, repeat: "none", auto: false, fromAccountId: null, toAccountId: null, groupId: null,
    });
    save(); render(); toast("Aggiunto: " + (f.description || money0(f.amount)));
  }

  // ---------- Andamento del saldo ----------
  function totalAsOf(endIso) {
    let bal = data.accounts.reduce((s, a) => s + toBase(a.opening || 0, accCurrency(a.id)), 0);
    for (const t of data.transactions) {
      if (t.planned || t.date > endIso) continue;
      if (t.kind === "income") bal += toBase(t.amount, accCurrency(t.accountId));
      else if (t.kind === "expense") bal -= toBase(t.amount, accCurrency(t.accountId));
    }
    return bal;
  }
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function renderTrend() {
    const box = $("#trend-chart");
    const cTerra = cssVar("--terra", "#B4573F");
    const cInk = cssVar("--ink", "#2C2A26");
    const cMuted = cssVar("--muted", "#8C867A");
    const now = new Date();
    const pts = [];
    for (let i = 5; i >= 0; i--) {
      const base = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = i === 0 ? now : new Date(base.getFullYear(), base.getMonth() + 1, 0);
      pts.push({ label: cap(base.toLocaleDateString("it-IT", { month: "short" })), value: totalAsOf(isoOf(end)) });
    }
    const vals = pts.map((p) => p.value);
    const min = Math.min(...vals), max = Math.max(...vals), range = (max - min) || 1;
    const W = 320, H = 130, padX = 12, padTop = 18, padBot = 24, n = pts.length;
    const X = (i) => padX + i * ((W - 2 * padX) / (n - 1));
    const Y = (v) => padTop + (1 - (v - min) / range) * (H - padTop - padBot);
    const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(" ");
    const area = `M${X(0).toFixed(1)},${(H - padBot).toFixed(1)} L` + pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(" L") + ` L${X(n - 1).toFixed(1)},${(H - padBot).toFixed(1)} Z`;
    const last = pts[n - 1];
    const labels = pts.map((p, i) => `<text x="${X(i).toFixed(1)}" y="${H - 8}" font-size="9" fill="${cMuted}" text-anchor="middle">${p.label}</text>`).join("");
    const dots = pts.map((p, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.value).toFixed(1)}" r="${i === n - 1 ? 4 : 2.5}" fill="${cTerra}"/>`).join("");
    box.className = "trend";
    box.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <path d="${area}" fill="${cTerra}" fill-opacity="0.10"/>
        <polyline points="${line}" fill="none" stroke="${cTerra}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
        <text x="${X(n - 1).toFixed(1)}" y="${(Y(last.value) - 8).toFixed(1)}" font-size="11" font-weight="700" fill="${cInk}" text-anchor="end">${money0(last.value)}</text>
        ${labels}
      </svg>
      <div class="trend-legend"><span>${pts[0].label}: ${money0(pts[0].value)}</span><span>oggi: ${money0(last.value)}</span></div>`;
  }

  // ---------- Sicurezza dati ----------
  function renderBackupStatus() {
    const el = $("#backup-status"); if (!el) return;
    const lb = settings().lastBackup;
    if (!lb) { el.textContent = "Nessun backup ancora fatto."; el.classList.toggle("backup-warn", (data.transactions || []).length > 0); return; }
    const days = Math.floor((parseIso(todayIso()) - parseIso(lb)) / 86400000);
    el.textContent = "Ultimo backup: " + (days === 0 ? "oggi" : days === 1 ? "ieri" : days + " giorni fa");
    el.classList.toggle("backup-warn", days >= 14);
  }
  function backupReminderOnOpen() {
    const lb = settings().lastBackup;
    const days = lb ? Math.floor((parseIso(todayIso()) - parseIso(lb)) / 86400000) : 999;
    if ((data.transactions || []).length >= 3 && days >= 14) {
      setTimeout(() => toast("💡 Fai un backup: Altro → Esporta"), 900);
    }
  }

  // ---------- Backup ----------
  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function exportData() {
    downloadBlob(JSON.stringify(data, null, 2), `tasca-backup-${todayIso()}.json`, "application/json");
    settings().lastBackup = todayIso(); save(); renderBackupStatus();
    toast("Backup esportato");
  }

  // ---- Backup cifrato (AES-GCM + PBKDF2) ----
  function b64(buf) { let s = ""; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); }
  function unb64(str) { return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)); }
  async function deriveKey(password, salt) {
    const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 150000, hash: "SHA-256" },
      km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }
  async function exportEncrypted() {
    if (!(crypto && crypto.subtle)) { toast("Cifratura non disponibile qui"); return; }
    const pw = prompt("Scegli una password per cifrare il backup.\nServirà per riaprirlo: annotala, non è recuperabile.");
    if (!pw) return;
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(pw, salt);
      const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(data)));
      const payload = { app: "tasca", enc: "aes-gcm", v: 1, salt: b64(salt), iv: b64(iv), data: b64(cipher) };
      downloadBlob(JSON.stringify(payload), `tasca-backup-cifrato-${todayIso()}.json`, "application/json");
      settings().lastBackup = todayIso(); save(); renderBackupStatus();
      toast("Backup cifrato esportato");
    } catch (e) { toast("Errore durante la cifratura"); }
  }
  async function importEncrypted(payload) {
    const pw = prompt("Questo backup è cifrato. Inserisci la password:");
    if (!pw) return;
    try {
      const key = await deriveKey(pw, unb64(payload.salt));
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(payload.iv) }, key, unb64(payload.data));
      const obj = JSON.parse(new TextDecoder().decode(plain));
      if (!obj || !Array.isArray(obj.transactions)) throw 0;
      data = Object.assign(defaultData(), obj);
      ensureLoanSchedules(); autoSettle();
      render(); toast("Backup importato");
    } catch (e) { toast("Password errata o file danneggiato"); }
  }
  function importData(file) {
    const r = new FileReader();
    r.onload = () => {
      let parsed;
      try { parsed = JSON.parse(r.result); } catch (e) { toast("File non valido"); return; }
      if (parsed && parsed.enc === "aes-gcm") { importEncrypted(parsed); return; }
      try {
        if (!parsed || !Array.isArray(parsed.transactions)) throw 0;
        data = Object.assign(defaultData(), parsed);
        ensureLoanSchedules(); autoSettle();
        render(); toast("Backup importato");
      } catch (e) { toast("File non valido"); }
    };
    r.readAsText(file);
  }

  // ---------- Esporta CSV ----------
  function csvCell(v) {
    const s = String(v == null ? "" : v);
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function exportCSV() {
    const rows = data.transactions.filter((t) => !t.planned)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    if (!rows.length) { toast("Nessun movimento da esportare"); return; }
    const head = ["Data", "Ora", "Tipo", "Categoria", "Conto", "Descrizione", "Tag", "Importo"];
    const lines = [head.join(";")];
    for (const t of rows) {
      let tipo, conto, importo;
      if (t.kind === "transfer") {
        tipo = "Trasferimento";
        const fa = accById(t.fromAccountId), ta = accById(t.toAccountId);
        conto = (fa ? fa.name : "?") + " -> " + (ta ? ta.name : "?");
        importo = t.amount;
      } else {
        tipo = t.kind === "income" ? "Entrata" : "Uscita";
        const a = accById(t.accountId);
        conto = a ? a.name : "";
        importo = (t.kind === "expense" ? -t.amount : t.amount);
      }
      const c = catById(t.categoryId);
      const val = String(importo.toFixed(2)).replace(".", ","); // formato numerico italiano
      lines.push([t.date, t.time || "", tipo, c ? c.name : "", conto, t.description || "", (t.tags || []).join(" "), val].map(csvCell).join(";"));
    }
    // BOM per far riconoscere l'UTF-8 a Excel
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `tasca-movimenti-${todayIso()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast("CSV esportato");
  }

  // ---------- Stampa / PDF ----------
  function printReport() {
    const area = $("#print-area");
    if (!area) return;
    const rows = data.transactions.filter((t) => !t.planned)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    let totIn = 0, totOut = 0;
    for (const t of rows) {
      if (t.kind === "income") totIn += toBase(t.amount, accCurrency(t.accountId));
      else if (t.kind === "expense") totOut += toBase(t.amount, accCurrency(t.accountId));
    }
    const accRows = data.accounts.map((a) =>
      `<tr><td>${esc(a.name)}</td><td>${money(accountBalance(a.id), accCurrency(a.id))}</td></tr>`).join("");
    const bodyRows = rows.map((t) => {
      let desc, cat, conto, cls, sign, amt;
      if (t.kind === "transfer") {
        const fa = accById(t.fromAccountId), ta = accById(t.toAccountId);
        desc = esc(t.description || "Trasferimento"); cat = "—";
        conto = (fa ? esc(fa.name) : "?") + " → " + (ta ? esc(ta.name) : "?");
        cls = ""; sign = ""; amt = money(t.amount, accCurrency(t.fromAccountId));
      } else {
        const c = catById(t.categoryId), a = accById(t.accountId);
        desc = esc(t.description || (c ? c.name : "Movimento"));
        cat = c ? esc(c.name) : "—"; conto = a ? esc(a.name) : "—";
        cls = t.kind === "income" ? "print-in" : "print-out";
        sign = t.kind === "income" ? "+ " : "− "; amt = money(t.amount, accCurrency(t.accountId));
      }
      return `<tr>
        <td>${cap(fmtDateShort(t.date))}</td>
        <td>${desc}</td><td>${cat}</td><td>${conto}</td>
        <td class="num ${cls}">${sign}${amt}</td></tr>`;
    }).join("");
    const now = parseIso(todayIso());
    area.innerHTML = `
      <h1 class="print-h1">Tasca — Resoconto</h1>
      <p class="print-sub">Generato il ${cap(now.toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }))}</p>
      <div class="print-section-title">Conti</div>
      <table class="print-summary">${accRows}
        <tr><td><b>Patrimonio netto</b></td><td><b>${money(netWorth())}</b></td></tr></table>
      <div class="print-section-title">Totali</div>
      <table class="print-summary">
        <tr><td>Entrate totali</td><td class="print-in">${money(totIn)}</td></tr>
        <tr><td>Uscite totali</td><td class="print-out">${money(totOut)}</td></tr>
        <tr><td><b>Saldo</b></td><td><b>${money(totIn - totOut)}</b></td></tr></table>
      <div class="print-section-title">Movimenti (${rows.length})</div>
      <table class="print-table">
        <thead><tr><th>Data</th><th>Descrizione</th><th>Categoria</th><th>Conto</th><th>Importo</th></tr></thead>
        <tbody>${bodyRows || '<tr><td colspan="5">Nessun movimento</td></tr>'}</tbody>
      </table>
      <p class="print-foot">Tasca · dati locali · ${data.accounts.length} conti · ${rows.length} movimenti</p>`;
    window.print();
  }

  // ---------- Eventi ----------
  function bind() {
    $$(".tab-btn").forEach((btn) => btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
      $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
      updateFab(tab);
      window.scrollTo(0, 0);
    }));

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) { openModal(null); return; }

      const goto = e.target.closest("[data-goto]");
      if (goto) { const t = $(`.tab-btn[data-tab="${goto.dataset.goto}"]`); if (t) t.click(); return; }

      const pay = e.target.closest("[data-pay]");
      if (pay) { e.stopPropagation(); payPlanned(pay.dataset.pay); return; }

      // clic su un tag in un movimento: filtra i movimenti per quel tag
      const tagChip = e.target.closest(".tag-chip[data-tag]");
      if (tagChip) {
        e.stopPropagation();
        searchQuery = tagChip.dataset.tag;
        const si = $("#search-input"); if (si) si.value = searchQuery;
        const t = $(`.tab-btn[data-tab="movimenti"]`); if (t && !$("#tab-movimenti").classList.contains("active")) t.click();
        renderMovimenti();
        return;
      }

      const edit = e.target.closest("[data-edit]");
      if (edit) { const t = data.transactions.find((x) => x.id === edit.dataset.edit); if (t) openModal(t); return; }

      if (e.target.closest("[data-add-account]")) { openAccountEditor(null); return; }
      const accEdit = e.target.closest("[data-acc-edit]");
      if (accEdit) { openAccountEditor(accById(accEdit.dataset.accEdit)); return; }

      const goalEdit = e.target.closest("[data-goal-edit]");
      if (goalEdit) { openGoalEditor((data.goals || []).find((g) => g.id === goalEdit.dataset.goalEdit)); return; }

      const favBtn = e.target.closest("[data-fav]");
      if (favBtn) { quickAddFavorite(favBtn.dataset.fav); return; }
      if (e.target.closest("[data-fav-add]")) { openModal(null); $("#f-fav").checked = true; return; }
      const favDel = e.target.closest("[data-fav-del]");
      if (favDel) { data.favorites = (data.favorites || []).filter((f) => f.id !== favDel.dataset.favDel); save(); render(); toast("Preferito eliminato"); return; }

      const payLoan = e.target.closest("[data-payloan]");
      if (payLoan) { e.stopPropagation(); payLoanRata(payLoan.dataset.payloan); return; }
      const loanPlan = e.target.closest("[data-loan-plan]");
      if (loanPlan) { e.stopPropagation(); openLoanPlan(loanPlan.dataset.loanPlan); return; }
      if (e.target.hasAttribute("data-close-plan")) { closeLoanPlan(); return; }
      const loanEdit = e.target.closest("[data-loan-edit]");
      if (loanEdit) { openLoanEditor((data.loans || []).find((l) => l.id === loanEdit.dataset.loanEdit)); return; }
      if (e.target.hasAttribute("data-close-lm")) { closeLoanEditor(); return; }
      const gsrc = e.target.closest("[data-gsource]");
      if (gsrc) { goalForm.source = gsrc.dataset.gsource; renderGoalSources(); return; }
      if (e.target.hasAttribute("data-close-gm")) { closeGoalEditor(); return; }
      if (e.target.hasAttribute("data-close-bm")) { closeBudgetEditor(); return; }

      const accIcon = e.target.closest("[data-acc-icon]");
      if (accIcon) { accForm.icon = accIcon.dataset.accIcon; syncAccIcons(); return; }
      const accType = e.target.closest("#am-type-chips .chip");
      if (accType) { accForm.type = accType.dataset.type; accForm.icon = ACCOUNT_TYPES[accForm.type].icon; syncAccType(); syncAccIcons(); return; }
      const loanTipoChip = e.target.closest("#lm-type-chips .chip");
      if (loanTipoChip) { lmTipo = loanTipoChip.dataset.tipo; $$("#lm-type-chips .chip").forEach((c) => c.classList.toggle("active", c === loanTipoChip)); return; }
      if (e.target.hasAttribute("data-close-am")) { closeAccountEditor(); return; }

      const catPick = e.target.closest("[data-cat]");
      if (catPick) {
        const cid = catPick.dataset.cat;
        if (catPickMode === "manage") { manageCategory(cid); }
        else { form.categoryId = cid; syncPickers(); closeCatPicker(); }
        return;
      }
      const catAdd = e.target.closest("[data-cat-add]");
      if (catAdd) { addCategory(catAdd.dataset.catAdd); return; }

      const accPick = e.target.closest("[data-acc-pick]");
      if (accPick) {
        if (accPickerTarget === "to") form.toAccountId = accPick.dataset.accPick;
        else form.accountId = accPick.dataset.accPick;
        syncPickers(); closeAccPicker(); return;
      }
      if (e.target.closest("[data-acc-new]")) { pendingAccSelect = true; closeAccPicker(); openAccountEditor(null); return; }

      const dayCell = e.target.closest("[data-day]");
      if (dayCell) {
        selectedDay = selectedDay === dayCell.dataset.day ? null : dayCell.dataset.day;
        renderCalendar(); renderMovimenti(); return;
      }
      if (e.target.closest("[data-clear-day]")) { selectedDay = null; renderCalendar(); renderMovimenti(); return; }
      const fcM = e.target.closest("[data-fc-months]");
      if (fcM) { forecastMonths = parseInt(fcM.dataset.fcMonths, 10) || 3; renderMovimenti(); return; }

      if (e.target.hasAttribute("data-close")) closeModal();
      if (e.target.hasAttribute("data-close-cat")) closeCatPicker();
      if (e.target.hasAttribute("data-close-acc")) closeAccPicker();
    });

    $("#cal-prev").addEventListener("click", () => { calMonth = shiftMonth(calMonth, -1); renderCalendar(); });
    $("#cal-next").addEventListener("click", () => { calMonth = shiftMonth(calMonth, 1); renderCalendar(); });

    $$("#seg-kind .seg-btn").forEach((b) => b.addEventListener("click", () => {
      form.kind = b.dataset.kind;
      // reset categoria se non appartiene al nuovo tipo
      const c = catById(form.categoryId);
      if (!c || c.kind !== form.kind) form.categoryId = null;
      syncKind(); syncPickers();
    }));
    $$("#repeat-chips .chip").forEach((b) => b.addEventListener("click", () => { form.repeat = b.dataset.rep; syncRepeat(); }));

    $("#modal-save").addEventListener("click", saveEntry);
    $("#entry-form").addEventListener("submit", (e) => { e.preventDefault(); saveEntry(); });
    $("#pick-category").addEventListener("click", () => openCatPicker("select"));
    $("#pick-account").addEventListener("click", () => openAccPicker("from"));
    $("#pick-account2").addEventListener("click", () => openAccPicker("to"));
    $("#delete-entry").addEventListener("click", () => {
      if (editingId && confirm("Eliminare questa voce?")) {
        data.transactions = data.transactions.filter((t) => t.id !== editingId);
        render(); closeModal(); toast("Eliminata");
      }
    });

    $("#am-save").addEventListener("click", saveAccount);
    $("#am-delete").addEventListener("click", deleteAccount);
    $("#am-currency").addEventListener("change", (e) => { accForm.currency = e.target.value; syncAccCurrency(); });
    // Import estratto conto CSV
    $("#am-import").addEventListener("click", () => { if (accEditId) $("#am-import-file").click(); });
    $("#am-import-file").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) { csvState.accountId = accEditId; startCsvImport(f); }
      e.target.value = "";
    });
    $("#csv-confirm").addEventListener("click", confirmCsvImport);
    $$("#csv-amt-mode .seg-btn").forEach((b) => b.addEventListener("click", () => {
      csvState.mode = b.dataset.mode;
      $$("#csv-amt-mode .seg-btn").forEach((x) => x.classList.toggle("active", x === b));
      $("#csv-single-fields").hidden = csvState.mode !== "single";
      $("#csv-split-fields").hidden = csvState.mode !== "split";
      renderCsvPreview();
    }));
    ["#csv-col-date", "#csv-col-desc", "#csv-col-amount", "#csv-col-in", "#csv-col-out", "#csv-neg-out", "#csv-future-planned"].forEach((id) =>
      $(id).addEventListener("change", renderCsvPreview));
    $("#csv-modal").addEventListener("click", (e) => { if (e.target.hasAttribute("data-close-csv")) closeCsvModal(); });
    $("#f-calc").addEventListener("click", () => openCalc("amount"));
    $("#btn-calc").addEventListener("click", () => openCalc(null));
    $("#calc-use").addEventListener("click", useCalcResult);
    $("#calc-modal").addEventListener("click", (e) => {
      const k = e.target.closest("[data-calc]");
      if (k) { calcKey(k.dataset.calc); return; }
      if (e.target.hasAttribute("data-close-calc")) closeCalc();
    });
    $("#btn-set-pin").addEventListener("click", setPinFlow);
    $("#btn-remove-pin").addEventListener("click", removePinFlow);
    $("#btn-reminders").addEventListener("click", enableReminders);
    $$("#theme-seg .seg-btn").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.theme)));
    $("#base-currency").addEventListener("change", (e) => setBaseCurrency(e.target.value));
    $("#rates-list").addEventListener("change", (e) => {
      const inp = e.target.closest("[data-rate]");
      if (inp) setRate(inp.dataset.rate, inp.value);
    });
    $("#lock-pad").addEventListener("click", (e) => { const k = e.target.closest("[data-key]"); if (k) pressKey(k.dataset.key); });
    $("#add-goal").addEventListener("click", () => openGoalEditor(null));
    $("#gm-save").addEventListener("click", saveGoal);
    $("#gm-delete").addEventListener("click", deleteGoal);
    $("#edit-budget").addEventListener("click", openBudgetEditor);
    $("#bm-save").addEventListener("click", saveBudget);
    $("#add-loan").addEventListener("click", () => openLoanEditor(null));
    $("#lm-save").addEventListener("click", saveLoan);
    $("#lm-delete").addEventListener("click", deleteLoan);
    $("#manage-cats").addEventListener("click", () => openCatPicker("manage"));
    $("#filter-month").addEventListener("change", renderMovimenti);
    $("#filter-account").addEventListener("change", renderMovimenti);
    $("#search-input").addEventListener("input", (e) => { searchQuery = e.target.value.trim(); renderMovimenti(); });
    $("#f-tags").addEventListener("input", renderTagSuggest);
    $("#f-tags").addEventListener("focus", renderTagSuggest);
    $("#tag-suggest").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tag-add]");
      if (b) addTagFromSuggest(b.dataset.tagAdd);
    });
    $$("#mov-view .seg-btn").forEach((btn) => btn.addEventListener("click", () => {
      movView = btn.dataset.view;
      $$("#mov-view .seg-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderMovimenti();
    }));

    $("#btn-export").addEventListener("click", exportData);
    $("#btn-export-enc").addEventListener("click", exportEncrypted);
    $("#btn-export-csv").addEventListener("click", exportCSV);
    $("#btn-print").addEventListener("click", printReport);
    $("#plan-print").addEventListener("click", printLoanPlan);
    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; });
    $("#btn-reset").addEventListener("click", () => {
      if ((data.transactions || []).length && settings().lastBackup == null && !confirm("Non hai mai fatto un backup: cancellando perdi tutto. Continuare comunque?")) return;
      const ans = prompt('Per cancellare TUTTI i dati scrivi CANCELLA:');
      if (ans && ans.trim().toUpperCase() === "CANCELLA") { data = defaultData(); render(); toast("Dati cancellati"); }
    });
  }

  function addCategory(kind) {
    const name = prompt("Nome nuova categoria:");
    if (!name || !name.trim()) return;
    const c = { id: slug(name) + "_" + kind + "_" + uid().slice(-3), name: name.trim(), icon: "tag", kind };
    data.categories.push(c); save(); renderCatGrid(kind);
  }
  function manageCategory(cid) {
    const c = catById(cid); if (!c) return;
    if (confirm(`Eliminare la categoria "${c.name}"? I movimenti restano ma senza categoria.`)) {
      data.categories = data.categories.filter((x) => x.id !== cid);
      data.transactions.forEach((t) => { if (t.categoryId === cid) t.categoryId = null; });
      save(); renderCatGrid(c.kind); render();
    }
  }

  // ---------- Blocco con PIN ----------
  function settings() {
    if (!data.settings) data.settings = { pin: null, reminders: false };
    if (!data.settings.baseCurrency) data.settings.baseCurrency = "EUR";
    if (!data.settings.rates) data.settings.rates = {};
    return data.settings;
  }
  function hashPin(s) { let h = 5381; for (const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return "h" + h; }

  const lock = $("#lock-screen");
  let pinEntry = "";
  const PIN_LEN = 4;

  function buildPad() {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
    $("#lock-pad").innerHTML = keys.map((k) =>
      k === "" ? `<button class="blank" disabled></button>` : `<button data-key="${k}">${k}</button>`
    ).join("");
  }
  function renderDots() {
    $("#lock-dots").innerHTML = Array.from({ length: PIN_LEN }, (_, i) =>
      `<span class="pd ${i < pinEntry.length ? "on" : ""}"></span>`).join("");
  }
  function showLock() {
    pinEntry = ""; buildPad(); renderDots();
    $("#lock-msg").textContent = "Inserisci il PIN";
    lock.hidden = false;
  }
  function pressKey(k) {
    if (k === "⌫") { pinEntry = pinEntry.slice(0, -1); renderDots(); return; }
    if (pinEntry.length >= PIN_LEN) return;
    pinEntry += k; renderDots();
    if (pinEntry.length === PIN_LEN) {
      setTimeout(() => {
        if (hashPin(pinEntry) === settings().pin) { lock.hidden = true; }
        else { lock.classList.add("shake"); $("#lock-msg").textContent = "PIN errato, riprova"; setTimeout(() => { lock.classList.remove("shake"); pinEntry = ""; renderDots(); }, 350); }
      }, 120);
    }
  }
  function setPinFlow() {
    const a = prompt("Scegli un PIN di 4 cifre:");
    if (a == null) return;
    if (!/^\d{4}$/.test(a)) { toast("Il PIN deve essere di 4 cifre"); return; }
    const bb = prompt("Ripeti il PIN:");
    if (bb == null) return;
    if (a !== bb) { toast("I PIN non coincidono"); return; }
    settings().pin = hashPin(a); save(); syncSecurityButtons(); toast("PIN impostato");
  }
  function removePinFlow() {
    if (confirm("Rimuovere il PIN?")) { settings().pin = null; save(); syncSecurityButtons(); toast("PIN rimosso"); }
  }
  function syncSecurityButtons() {
    const has = !!settings().pin;
    $("#btn-set-pin").textContent = has ? "Cambia PIN" : "Imposta PIN";
    $("#btn-remove-pin").hidden = !has;
  }

  // ---------- Tema (chiaro / scuro) ----------
  function applyTheme() {
    const t = settings().theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = t;
    // aggiorna il colore della barra di stato del sistema
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#211C17" : "#1E4A4E");
    syncThemeButtons();
    // il grafico dell'andamento usa i colori del tema: va ridisegnato
    if (typeof renderTrend === "function" && $("#trend-chart")) { try { renderTrend(); } catch (e) {} }
  }
  function setTheme(t) {
    settings().theme = t === "dark" ? "dark" : "light";
    save();
    applyTheme();
  }
  function syncThemeButtons() {
    const t = settings().theme === "dark" ? "dark" : "light";
    $$("#theme-seg .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.theme === t));
  }

  // ---------- Valute e cambi ----------
  function renderCurrencies() {
    const sel = $("#base-currency");
    if (sel) {
      sel.innerHTML = knownCurrencies().map((c) => `<option value="${c.code}">${c.code} · ${esc(c.name)}</option>`).join("");
      sel.value = baseCurrency();
    }
    const box = $("#rates-list");
    if (!box) return;
    const base = baseCurrency();
    // valute effettivamente usate dai conti, diverse dalla base
    const used = Array.from(new Set((data.accounts || []).map((a) => a.currency || base))).filter((c) => c !== base);
    if (!used.length) {
      box.innerHTML = `<p class="muted small" style="margin-top:10px">Tutti i conti sono in ${esc(base)}. Se crei un conto in un'altra valuta, qui potrai impostarne il cambio.</p>`;
      return;
    }
    box.innerHTML = used.map((c) => {
      const rate = currencyRate(c);
      return `<div class="rate-row">
        <span class="rate-label">1 ${esc(c)} =</span>
        <input class="rate-input" type="number" inputmode="decimal" step="0.0001" min="0" value="${rate}" data-rate="${esc(c)}" />
        <span class="rate-base">${esc(base)}</span>
      </div>`;
    }).join("");
  }
  function setRate(code, value) {
    const v = parseFloat(String(value).replace(",", "."));
    if (!data.settings.rates) data.settings.rates = {};
    if (v > 0) data.settings.rates[code] = v;
    save();
    // rimanda il render per non distruggere l'input mentre gestisce il change
    setTimeout(render, 0);
  }
  function setBaseCurrency(newBase) {
    const oldBase = baseCurrency();
    if (!newBase || newBase === oldBase) return;
    const rates = data.settings.rates || {};
    // valore di 1 unità di newBase espresso nella vecchia base
    const rNewInOld = rates[newBase] > 0 ? rates[newBase] : 1;
    const codes = new Set(Object.keys(rates)); codes.add(oldBase);
    const newRates = {};
    codes.forEach((cur) => {
      if (cur === newBase) return; // diventa la base, tasso implicito 1
      const rCurInOld = cur === oldBase ? 1 : (rates[cur] > 0 ? rates[cur] : 1);
      newRates[cur] = round2(rCurInOld / rNewInOld * 10000) / 10000;
    });
    data.settings.baseCurrency = newBase;
    data.settings.rates = newRates;
    save();
    setTimeout(render, 0); // rimanda per non distruggere la select durante il change
    toast("Valuta principale: " + newBase);
  }

  // ---------- Promemoria ----------
  function enableReminders() {
    if (!("Notification" in window)) { toast("Notifiche non supportate qui"); return; }
    Notification.requestPermission().then((perm) => {
      if (perm === "granted") { settings().reminders = true; save(); syncReminderButton(); toast("Promemoria attivati"); notifyDue(); }
      else toast("Permesso negato");
    }).catch(() => toast("Notifiche non disponibili"));
  }
  function syncReminderButton() {
    const on = settings().reminders && ("Notification" in window) && Notification.permission === "granted";
    $("#btn-reminders").textContent = on ? "Promemoria attivi ✓" : "Attiva promemoria";
  }
  function notifyDue() {
    try {
      if (!settings().reminders || !("Notification" in window) || Notification.permission !== "granted") return;
      const today = todayIso();
      const due = data.transactions.filter((t) => t.planned && !t.auto && t.date <= today);
      if (!due.length) return;
      const tot = due.reduce((s, t) => s + (t.kind === "income" ? 0 : t.amount), 0);
      new Notification("Tasca", {
        body: due.length === 1
          ? `Da pagare: ${due[0].description || "operazione"} (${money0(due[0].amount)})`
          : `Hai ${due.length} operazioni da pagare (${money0(tot)})`,
        icon: "icons/icon-192.png", badge: "icons/icon-192.png",
      });
    } catch (e) {}
  }

  // ---------- Service worker + aggiornamento automatico ----------
  if ("serviceWorker" in navigator) {
    let refreshing = false;
    // quando il nuovo service worker prende il controllo, ricarica una volta sola
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return; refreshing = true; location.reload();
    });
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        reg.update();
        // controlla se c'è una versione nuova ogni volta che riapri/torni sull'app
        document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update(); });
      }).catch(() => {});
    });
  }

  // La Dashboard è solo consuntiva: nessun inserimento, niente FAB
  function updateFab(tab) { $("#fab").style.display = tab === "oggi" ? "none" : ""; }

  // Avvio a prova di guasto: se un passaggio fallisce (es. file disallineati in
  // cache dopo un aggiornamento), gli altri continuano. Così i dati e le icone
  // restano SEMPRE visibili e non sembra che i dati siano spariti.
  function safe(fn, label) { try { fn(); } catch (e) { console.error("Tasca init:", label, e); } }
  safe(applyTheme, "applyTheme");
  safe(() => { const av = $("#app-version"); if (av) av.textContent = APP_VERSION; }, "version");
  safe(ensureLoanSchedules, "ensureLoanSchedules");
  safe(autoSettle, "autoSettle");
  safe(render, "render");              // disegna dati e icone: eseguito presto e protetto
  safe(bind, "bind");                  // gli eventi: se falliscono, i dati restano comunque a schermo
  safe(() => updateFab("oggi"), "updateFab");
  safe(syncSecurityButtons, "syncSecurityButtons");
  safe(syncReminderButton, "syncReminderButton");
  safe(() => { if (settings().pin) showLock(); }, "showLock");
  safe(notifyDue, "notifyDue");
  safe(backupReminderOnOpen, "backupReminderOnOpen");
})();
