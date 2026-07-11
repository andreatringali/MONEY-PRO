/* Money Pro — gestione cassa personale (dati locali)
   Conti, categorie con icone, movimenti e operazioni programmate. */
(function () {
  "use strict";

  // ---------- Icone (SVG inline) ----------
  const ICONS = {
    today: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9h18M8 3v3M16 3v3"/>',
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

  // ---------- Formattazione ----------
  const fmt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
  const money = (n) => fmt.format(n || 0);
  const money0 = (n) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n || 0);

  function todayIso() { return isoOf(new Date()); }
  function isoOf(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function p2(n) { return String(n).padStart(2, "0"); }
  function parseIso(iso) { return new Date(iso + "T00:00:00"); }
  function periodKey(iso) { return iso.slice(0, 7); }
  function currentPeriod() { return todayIso().slice(0, 7); }
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
    for (const t of data.transactions) {
      if (t.accountId !== accId || t.planned) continue;
      bal += t.kind === "income" ? t.amount : -t.amount;
    }
    return bal;
  }
  function totalBalance() {
    return data.accounts.filter((a) => a.type !== "liability")
      .reduce((s, a) => s + accountBalance(a.id), 0);
  }
  function netWorth() { return data.accounts.reduce((s, a) => s + accountBalance(a.id), 0); }

  function plannedSorted() {
    return data.transactions.filter((t) => t.planned).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }
  function monthTotals(pkey) {
    let income = 0, expense = 0;
    for (const t of data.transactions) {
      if (t.planned || periodKey(t.date) !== pkey) continue;
      if (t.kind === "income") income += t.amount; else expense += t.amount;
    }
    return { income, expense };
  }
  function forecast30() {
    const end = new Date(); end.setDate(end.getDate() + 30);
    const endIso = isoOf(end);
    let delta = 0;
    for (const t of plannedSorted()) {
      if (t.date <= endIso) delta += t.kind === "income" ? t.amount : -t.amount;
    }
    return { now: totalBalance(), future: totalBalance() + delta, delta };
  }

  // ---------- DOM ----------
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  function render() {
    renderNavIcons();
    renderToday();
    renderBilancio();
    renderMovimenti();
    renderResoconti();
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
    $("#hero-forecast").textContent = f.delta
      ? `Tra 30 giorni previsto: ${money(f.future)}` : "";

    const planned = plannedSorted();
    const today = todayIso();
    $("#prev-total").textContent = planned.length ? planned.length + " voci" : "";
    const box = $("#planned-list");
    if (!planned.length) { box.innerHTML = `<div class="empty">Nessuna operazione programmata.<br>Tocca + e attiva "Da pagare".</div>`; return; }
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
            ${overdue ? '<span class="warn-ico">!</span> Scaduta ·' : ""} ${cap(fmtDateShort(t.date))}
            ${t.repeat !== "none" ? "· ripete" : ""}
          </div>
        </div>
        <span class="amount-badge ${badgeClass}">${sign}${money0(t.amount)}</span>
        <button class="pay-btn" data-pay="${t.id}">Paga</button>
      </div>`;
    }).join("");
  }

  function renderBilancio() {
    $("#net-worth").textContent = money(netWorth());
    const payment = data.accounts.filter((a) => a.type !== "liability");
    $("#accounts-total").textContent = money(payment.reduce((s, a) => s + accountBalance(a.id), 0));
    const box = $("#accounts-list");
    box.innerHTML = data.accounts.map((a) => {
      const b = accountBalance(a.id);
      return `<div class="row" data-acc-edit="${a.id}">
        <div class="row-ico">${svg(a.icon || "wallet")}</div>
        <div class="row-main"><div class="row-title">${esc(a.name)}</div>
          <div class="row-sub">${a.type === "liability" ? "Passività" : "Conto di pagamento"}</div></div>
        <span class="acc-bal ${b < 0 ? "neg" : "pos"}">${money(b)}</span>
      </div>`;
    }).join("");
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
    if (fa !== "all") items = items.filter((t) => t.accountId === fa);

    const box = $("#movements-list");
    if (!items.length) { box.innerHTML = `<div class="empty">Nessun movimento.</div>`; return; }
    box.innerHTML = items.map((t) => {
      const c = catById(t.categoryId), a = accById(t.accountId);
      const sign = t.kind === "income" ? "+ " : "− ";
      return `<div class="row" data-edit="${t.id}">
        <div class="row-ico">${svg(c ? c.icon : "tag")}</div>
        <div class="row-main"><div class="row-title">${esc(t.description || (c ? c.name : "Movimento"))}</div>
          <div class="row-sub">${cap(fmtDateShort(t.date))}${a ? " · " + esc(a.name) : ""}${c ? " · " + esc(c.name) : ""}</div></div>
        <span class="amount-plain ${t.kind === "income" ? "in" : "out"}">${sign}${money(t.amount)}</span>
      </div>`;
    }).join("");
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
      byCat[t.categoryId] = (byCat[t.categoryId] || 0) + t.amount;
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
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2200); }

  // ---------- Modale movimento ----------
  const modal = $("#modal");
  let editingId = null;
  const form = { kind: "expense", categoryId: null, accountId: null, repeat: "none" };

  function openModal(editTx) {
    modal.hidden = false;
    if (editTx) {
      editingId = editTx.id;
      form.kind = editTx.kind; form.categoryId = editTx.categoryId;
      form.accountId = editTx.accountId; form.repeat = editTx.repeat || "none";
      $("#f-amount").value = editTx.amount;
      $("#f-desc").value = editTx.description || "";
      $("#f-date").value = editTx.date;
      $("#f-planned").checked = !!editTx.planned;
      $("#modal-title").textContent = "Modifica";
      $("#delete-entry").hidden = false;
    } else {
      editingId = null;
      form.kind = "expense"; form.categoryId = null;
      form.accountId = data.accounts[0] ? data.accounts[0].id : null; form.repeat = "none";
      $("#entry-form").reset();
      $("#f-date").value = todayIso();
      $("#modal-title").textContent = "Nuovo";
      $("#delete-entry").hidden = true;
    }
    syncKind(); syncRepeat(); syncPickers();
  }
  function closeModal() { modal.hidden = true; }

  function syncKind() { $$("#seg-kind .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.kind === form.kind)); }
  function syncRepeat() { $$("#repeat-chips .chip").forEach((b) => b.classList.toggle("active", b.dataset.rep === form.repeat)); }
  function syncPickers() {
    const c = catById(form.categoryId);
    $("#cat-ico").innerHTML = svg(c ? c.icon : "tag");
    $("#cat-name").textContent = c ? c.name : "Scegli…";
    const a = accById(form.accountId);
    $("#acc-ico").innerHTML = svg(a ? a.icon || "wallet" : "wallet");
    $("#acc-name").textContent = a ? a.name : "—";
  }

  function saveEntry() {
    const amount = parseFloat(String($("#f-amount").value).replace(",", "."));
    if (!(amount > 0)) { toast("Inserisci un importo"); return; }
    if (!form.categoryId) { toast("Scegli una categoria"); return; }
    if (!form.accountId) { toast("Scegli un conto"); return; }
    const planned = $("#f-planned").checked || form.repeat !== "none";
    const payload = {
      accountId: form.accountId, categoryId: form.categoryId, kind: form.kind,
      amount, description: $("#f-desc").value.trim(),
      date: $("#f-date").value || todayIso(), planned, repeat: form.repeat,
    };
    if (editingId) {
      const t = data.transactions.find((x) => x.id === editingId);
      Object.assign(t, payload);
      toast("Modifica salvata");
    } else {
      data.transactions.push(Object.assign({ id: uid(), groupId: null }, payload));
      toast(planned ? "Operazione programmata" : "Movimento salvato");
    }
    render(); closeModal();
  }

  function payPlanned(id) {
    const t = data.transactions.find((x) => x.id === id);
    if (!t) return;
    if (t.repeat && t.repeat !== "none") {
      // crea la prossima occorrenza programmata
      data.transactions.push({
        id: uid(), accountId: t.accountId, categoryId: t.categoryId, kind: t.kind,
        amount: t.amount, description: t.description, date: addInterval(t.date, t.repeat),
        planned: true, repeat: t.repeat, groupId: t.groupId || t.id,
      });
    }
    t.planned = false;
    t.date = todayIso();
    t.repeat = "none";
    render();
    toast("Segnata come pagata");
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
  function openAccPicker() {
    accModal.hidden = false;
    $("#acc-picker-list").innerHTML = data.accounts.map((a) =>
      `<div class="row" data-acc-pick="${a.id}"><div class="row-ico">${svg(a.icon || "wallet")}</div>
        <div class="row-main"><div class="row-title">${esc(a.name)}</div>
        <div class="row-sub">${money(accountBalance(a.id))}</div></div></div>`
    ).join("") + `<div class="row" data-acc-new><div class="row-ico">${svg("tag")}</div>
      <div class="row-main"><div class="row-title">Nuovo conto…</div></div></div>`;
  }
  function closeAccPicker() { accModal.hidden = true; }

  function newAccount() {
    const name = prompt("Nome del nuovo conto (es. Carta, Conto Andrea):");
    if (!name) return null;
    const openStr = prompt("Saldo iniziale (€), lascia 0 se non lo sai:", "0");
    const opening = parseFloat(String(openStr || "0").replace(",", ".")) || 0;
    const acc = { id: "acc_" + uid(), name: name.trim(), icon: "wallet", type: "payment", opening };
    data.accounts.push(acc); save();
    return acc;
  }

  // ---------- Backup ----------
  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `money-pro-backup-${todayIso()}.json`; a.click();
    URL.revokeObjectURL(url); toast("Backup esportato");
  }
  function importData(file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        const parsed = JSON.parse(r.result);
        if (!parsed || !Array.isArray(parsed.transactions)) throw 0;
        data = Object.assign(defaultData(), parsed);
        render(); toast("Backup importato");
      } catch (e) { toast("File non valido"); }
    };
    r.readAsText(file);
  }

  // ---------- Eventi ----------
  function bind() {
    $$(".tab-btn").forEach((btn) => btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
      $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
      window.scrollTo(0, 0);
    }));

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) { openModal(null); return; }

      const pay = e.target.closest("[data-pay]");
      if (pay) { e.stopPropagation(); payPlanned(pay.dataset.pay); return; }

      const edit = e.target.closest("[data-edit]");
      if (edit) { const t = data.transactions.find((x) => x.id === edit.dataset.edit); if (t) openModal(t); return; }

      const accEdit = e.target.closest("[data-acc-edit]");
      if (accEdit) { editAccount(accEdit.dataset.accEdit); return; }

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
      if (accPick) { form.accountId = accPick.dataset.accPick; syncPickers(); closeAccPicker(); return; }
      if (e.target.closest("[data-acc-new]")) { const a = newAccount(); if (a) { form.accountId = a.id; syncPickers(); } openAccPicker(); return; }

      if (e.target.hasAttribute("data-close")) closeModal();
      if (e.target.hasAttribute("data-close-cat")) closeCatPicker();
      if (e.target.hasAttribute("data-close-acc")) closeAccPicker();
    });

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
    $("#pick-account").addEventListener("click", openAccPicker);
    $("#delete-entry").addEventListener("click", () => {
      if (editingId && confirm("Eliminare questa voce?")) {
        data.transactions = data.transactions.filter((t) => t.id !== editingId);
        render(); closeModal(); toast("Eliminata");
      }
    });

    $("#add-account").addEventListener("click", () => { if (newAccount()) render(); });
    $("#manage-cats").addEventListener("click", () => openCatPicker("manage"));
    $("#filter-month").addEventListener("change", renderMovimenti);
    $("#filter-account").addEventListener("change", renderMovimenti);

    $("#btn-export").addEventListener("click", exportData);
    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; });
    $("#btn-reset").addEventListener("click", () => {
      if (confirm("Cancellare TUTTI i dati? Irreversibile.")) { data = defaultData(); render(); toast("Dati cancellati"); }
    });
  }

  function editAccount(id) {
    const a = accById(id); if (!a) return;
    const name = prompt("Nome conto:", a.name);
    if (name === null) return;
    if (name.trim()) a.name = name.trim();
    const openStr = prompt("Saldo iniziale (€):", a.opening);
    if (openStr !== null) a.opening = parseFloat(String(openStr).replace(",", ".")) || 0;
    if (data.accounts.length > 1 && confirm("Vuoi ELIMINARE questo conto? (Annulla per tenerlo)") === false) { /* keep */ }
    render();
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

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  bind();
  render();
})();
