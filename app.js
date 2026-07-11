/* Money Pro — gestione cassa personale (dati locali) */
(function () {
  "use strict";

  const STORAGE_KEY = "moneypro_data_v1";
  const DEFAULT_DATA = {
    version: 1,
    transactions: [], // {id, kind, amount, description, category, date, recurringId?, period?}
    recurring: [],    // {id, kind, amount, description, category, dayOfMonth, start, months, createdAt}
    categories: {
      expense: ["Alimentari", "Casa", "Trasporti", "Bollette", "Svago", "Salute", "Rata"],
      income: ["Stipendio", "Extra", "Rimborso"],
    },
  };

  // ---------- Stato ----------
  let data = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_DATA);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredClone(DEFAULT_DATA), parsed);
    } catch (e) {
      console.error("Errore nel caricamento dati", e);
      return structuredClone(DEFAULT_DATA);
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // ---------- Formattazione ----------
  const fmt = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });
  const money = (n) => fmt.format(n || 0);

  function fmtDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });
  }
  function periodKey(dateOrIso) {
    const d = typeof dateOrIso === "string" ? new Date(dateOrIso + "T00:00:00") : dateOrIso;
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  }
  function periodLabel(key) {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("it-IT", { month: "long", year: "numeric" });
  }
  function todayIso() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function currentPeriod() {
    return periodKey(new Date());
  }

  // ---------- Calcoli ----------
  function totalBalance() {
    return data.transactions.reduce(
      (s, t) => s + (t.kind === "income" ? t.amount : -t.amount),
      0
    );
  }

  function monthTotals(pkey) {
    let income = 0, expense = 0;
    for (const t of data.transactions) {
      if (periodKey(t.date) !== pkey) continue;
      if (t.kind === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense };
  }

  function monthlyCommitment() {
    // Somma delle rate ancora attive (indeterminate o non ancora concluse)
    return data.recurring.reduce((s, r) => {
      return isRecurringActive(r) ? s + r.amount : s;
    }, 0);
  }

  function paidCount(r) {
    return data.transactions.filter((t) => t.recurringId === r.id).length;
  }

  function isRecurringActive(r) {
    if (!r.months) return true; // indeterminata
    return paidCount(r) < r.months;
  }

  // Rate dovute e non ancora pagate fino al mese corrente incluso
  function dueInstallments() {
    const due = [];
    const cur = currentPeriod();
    for (const r of data.recurring) {
      const periods = schedulePeriods(r);
      for (const pk of periods) {
        if (pk > cur) break; // solo fino a questo mese
        const paid = data.transactions.some(
          (t) => t.recurringId === r.id && t.period === pk
        );
        if (!paid) due.push({ recurring: r, period: pk });
      }
    }
    // Ordina per periodo (più vecchie prima)
    due.sort((a, b) => (a.period < b.period ? -1 : 1));
    return due;
  }

  function schedulePeriods(r) {
    // Genera le chiavi periodo dalla prima scadenza in poi
    const out = [];
    const [sy, sm] = r.start.split("-").map(Number);
    const count = r.months || monthsSince(sy, sm) + 2; // se indeterminata, fino a mese prossimo
    for (let i = 0; i < count; i++) {
      const d = new Date(sy, sm - 1 + i, 1);
      out.push(periodKey(d));
    }
    return out;
  }

  function monthsSince(y, m) {
    const now = new Date();
    return (now.getFullYear() - y) * 12 + (now.getMonth() - (m - 1));
  }

  // ---------- Rendering ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function render() {
    renderHero();
    renderStats();
    renderDue();
    renderRecent();
    renderMovements();
    renderRecurring();
    renderCategoryList();
    save();
  }

  function renderHero() {
    const bal = totalBalance();
    const el = $("#hero-balance");
    el.textContent = money(bal);
    el.classList.toggle("neg", bal < 0);
  }

  function renderStats() {
    const { income, expense } = monthTotals(currentPeriod());
    const commit = monthlyCommitment();
    $("#stat-income").textContent = money(income);
    $("#stat-expense").textContent = money(expense);
    $("#stat-commit").textContent = money(commit);
    $("#stat-net").textContent = money(income - expense);
  }

  function rowHtml({ icoClass, ico, title, sub, amount, amountClass, actions }) {
    return `
      <div class="row">
        <div class="row-ico ${icoClass}">${ico}</div>
        <div class="row-main">
          <div class="row-title">${escapeHtml(title)}</div>
          ${sub ? `<div class="row-sub">${sub}</div>` : ""}
        </div>
        <div class="row-amount ${amountClass || ""}">${amount || ""}</div>
        ${actions || ""}
      </div>`;
  }

  function renderDue() {
    const box = $("#due-list");
    const due = dueInstallments();
    if (!due.length) {
      box.innerHTML = `<div class="empty">Nessuna rata in scadenza 🎉</div>`;
      return;
    }
    box.innerHTML = due
      .map(({ recurring: r, period }) =>
        rowHtml({
          icoClass: "commit",
          ico: "◷",
          title: r.description,
          sub: `Rata di ${periodLabel(period)} · giorno ${r.dayOfMonth}`,
          amount: money(r.amount),
          amountClass: "expense",
          actions: `<div class="row-actions">
            <button class="btn btn-primary btn-small" data-pay="${r.id}" data-period="${period}">Paga</button>
          </div>`,
        })
      )
      .join("");
  }

  function renderRecent() {
    const box = $("#recent-list");
    const items = [...data.transactions].sort(sortByDateDesc).slice(0, 6);
    if (!items.length) {
      box.innerHTML = `<div class="empty">Ancora nessun movimento. Tocca + per iniziare.</div>`;
      return;
    }
    box.innerHTML = items.map(txRow).join("");
  }

  function renderMovements() {
    const sel = $("#filter-month");
    const periods = uniquePeriods();
    const prev = sel.value;
    sel.innerHTML =
      `<option value="all">Tutti i mesi</option>` +
      periods.map((p) => `<option value="${p}">${capitalize(periodLabel(p))}</option>`).join("");
    if (periods.includes(prev) || prev === "all") sel.value = prev;

    const filter = sel.value || "all";
    const box = $("#movements-list");
    let items = [...data.transactions].sort(sortByDateDesc);
    if (filter !== "all") items = items.filter((t) => periodKey(t.date) === filter);

    if (!items.length) {
      box.innerHTML = `<div class="empty">Nessun movimento in questo periodo.</div>`;
      return;
    }
    box.innerHTML = items.map(txRow).join("");
  }

  function txRow(t) {
    const sign = t.kind === "income" ? "+" : "−";
    return rowHtml({
      icoClass: t.kind,
      ico: t.kind === "income" ? "↑" : "↓",
      title: t.description,
      sub: `${fmtDate(t.date)}${t.category ? " · " + escapeHtml(t.category) : ""}${t.recurringId ? " · <span class='pill'>rata</span>" : ""}`,
      amount: sign + " " + money(t.amount),
      amountClass: t.kind,
      actions: `<div class="row-actions">
        <button class="icon-btn" data-del-tx="${t.id}" aria-label="Elimina">🗑</button>
      </div>`,
    });
  }

  function renderRecurring() {
    const box = $("#recurring-list");
    if (!data.recurring.length) {
      box.innerHTML = `<div class="empty">Nessuna rata fissa. Tocca + e scegli "Rata fissa / Mutuo".</div>`;
      return;
    }
    box.innerHTML = data.recurring
      .map((r) => {
        const paid = paidCount(r);
        const active = isRecurringActive(r);
        let sub, progress = "";
        if (r.months) {
          const residuo = Math.max(0, r.months - paid) * r.amount;
          sub = `Giorno ${r.dayOfMonth} · ${paid}/${r.months} rate · residuo ${money(residuo)}`;
          const pct = Math.min(100, Math.round((paid / r.months) * 100));
          progress = `<div class="progress"><i style="width:${pct}%"></i></div>`;
        } else {
          sub = `Giorno ${r.dayOfMonth} · a tempo indeterminato · ${paid} pagate`;
        }
        return `
          <div class="row" style="flex-wrap:wrap">
            <div class="row-ico commit">${active ? "◷" : "✓"}</div>
            <div class="row-main">
              <div class="row-title">${escapeHtml(r.description)} ${active ? "" : "<span class='pill'>conclusa</span>"}</div>
              <div class="row-sub">${sub}</div>
              ${progress}
            </div>
            <div class="row-amount expense">${money(r.amount)}</div>
            <div class="row-actions">
              <button class="icon-btn" data-del-rec="${r.id}" aria-label="Elimina">🗑</button>
            </div>
          </div>`;
      })
      .join("");
  }

  function renderCategoryList() {
    const dl = $("#cat-list");
    const kind = form.kind;
    const cats = data.categories[kind] || [];
    dl.innerHTML = cats.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("");
  }

  // ---------- Helpers ----------
  function sortByDateDesc(a, b) {
    if (a.date === b.date) return b.id < a.id ? -1 : 1;
    return a.date < b.date ? 1 : -1;
  }
  function uniquePeriods() {
    const set = new Set(data.transactions.map((t) => periodKey(t.date)));
    return Array.from(set).sort().reverse();
  }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2200);
  }
  function rememberCategory(kind, cat) {
    if (!cat) return;
    const list = data.categories[kind];
    if (!list.includes(cat)) list.unshift(cat);
  }

  // ---------- Azioni ----------
  function addTransaction({ kind, amount, description, category, date, recurringId, period }) {
    data.transactions.push({
      id: uid(), kind, amount, description,
      category: category || "", date,
      recurringId: recurringId || null,
      period: period || null,
    });
    rememberCategory(kind, category);
  }

  function addRecurring({ kind, amount, description, category, dayOfMonth, start, months }) {
    data.recurring.push({
      id: uid(), kind, amount, description, category: category || "",
      dayOfMonth, start, months: months || null, createdAt: todayIso(),
    });
    rememberCategory(kind, category);
  }

  function payInstallment(recId, period) {
    const r = data.recurring.find((x) => x.id === recId);
    if (!r) return;
    const [y, m] = period.split("-").map(Number);
    const day = Math.min(r.dayOfMonth, 28);
    const date = y + "-" + String(m).padStart(2, "0") + "-" + String(day).padStart(2, "0");
    addTransaction({
      kind: r.kind, amount: r.amount, description: r.description,
      category: r.category || "Rata", date, recurringId: r.id, period,
    });
    render();
    toast("Rata registrata");
  }

  // ---------- Modale / Form ----------
  const modal = $("#modal");
  const form = { mode: "movimento", kind: "expense" };

  function openModal() {
    modal.hidden = false;
    resetForm();
  }
  function closeModal() { modal.hidden = true; }

  function resetForm() {
    $("#entry-form").reset();
    $("#f-date").value = todayIso();
    $("#f-start").value = currentPeriod();
    setMode("movimento");
    setKind("expense");
  }

  function setMode(mode) {
    form.mode = mode;
    $$("#seg-mode .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
    $("#modal-title").textContent = mode === "rata" ? "Nuova rata fissa / mutuo" : "Nuovo movimento";
    $$(".only-movimento").forEach((el) => (el.hidden = mode !== "movimento"));
    $$(".only-rata").forEach((el) => (el.hidden = mode !== "rata"));
    // required toggling
    $("#f-date").required = mode === "movimento";
    $("#f-day").required = mode === "rata";
    $("#f-start").required = mode === "rata";
  }

  function setKind(kind) {
    form.kind = kind;
    $$("#seg-kind .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.kind === kind));
    renderCategoryList();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const amount = parseFloat($("#f-amount").value.replace(",", "."));
    const description = $("#f-desc").value.trim();
    const category = $("#f-cat").value.trim();
    if (!(amount > 0) || !description) {
      toast("Inserisci importo e descrizione");
      return;
    }

    if (form.mode === "rata") {
      const dayOfMonth = parseInt($("#f-day").value, 10);
      const start = $("#f-start").value;
      const monthsRaw = $("#f-months").value;
      const months = monthsRaw ? parseInt(monthsRaw, 10) : null;
      if (!(dayOfMonth >= 1 && dayOfMonth <= 28) || !start) {
        toast("Controlla giorno e prima scadenza");
        return;
      }
      addRecurring({ kind: form.kind, amount, description, category, dayOfMonth, start, months });
      toast("Rata fissa aggiunta");
    } else {
      const date = $("#f-date").value || todayIso();
      addTransaction({ kind: form.kind, amount, description, category, date });
      toast("Movimento salvato");
    }
    render();
    closeModal();
  }

  // ---------- Backup ----------
  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `money-pro-backup-${todayIso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Backup esportato");
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !Array.isArray(parsed.transactions)) throw new Error("Formato non valido");
        data = Object.assign(structuredClone(DEFAULT_DATA), parsed);
        render();
        toast("Backup importato");
      } catch (err) {
        toast("File non valido");
      }
    };
    reader.readAsText(file);
  }

  // ---------- Eventi ----------
  function bind() {
    // Tab navigation
    $$(".tab-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        $$(".tab-btn").forEach((b) => b.classList.toggle("active", b === btn));
        $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
      })
    );

    // FAB + modal
    $("#fab").addEventListener("click", openModal);
    modal.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    $$("#seg-mode .seg-btn").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
    $$("#seg-kind .seg-btn").forEach((b) => b.addEventListener("click", () => setKind(b.dataset.kind)));
    $("#entry-form").addEventListener("submit", handleSubmit);

    // Filtro mese
    $("#filter-month").addEventListener("change", renderMovements);

    // Delegazione: pagamenti ed eliminazioni
    document.addEventListener("click", (e) => {
      const payBtn = e.target.closest("[data-pay]");
      if (payBtn) { payInstallment(payBtn.dataset.pay, payBtn.dataset.period); return; }

      const delTx = e.target.closest("[data-del-tx]");
      if (delTx) {
        if (confirm("Eliminare questo movimento?")) {
          data.transactions = data.transactions.filter((t) => t.id !== delTx.dataset.delTx);
          render();
          toast("Movimento eliminato");
        }
        return;
      }
      const delRec = e.target.closest("[data-del-rec]");
      if (delRec) {
        if (confirm("Eliminare questa rata fissa? I pagamenti già registrati restano nei movimenti.")) {
          data.recurring = data.recurring.filter((r) => r.id !== delRec.dataset.delRec);
          render();
          toast("Rata eliminata");
        }
        return;
      }
    });

    // Backup
    $("#btn-export").addEventListener("click", exportData);
    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => {
      if (e.target.files[0]) importData(e.target.files[0]);
      e.target.value = "";
    });
    $("#btn-reset").addEventListener("click", () => {
      if (confirm("Cancellare TUTTI i dati? Operazione irreversibile.")) {
        data = structuredClone(DEFAULT_DATA);
        render();
        toast("Dati cancellati");
      }
    });
  }

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  bind();
  render();
})();
