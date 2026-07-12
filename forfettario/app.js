/* Netto — gestione soldi per forfettari (dati locali).
   Ti dice quanto di ogni incasso è davvero tuo e quanto accantonare. */
(function () {
  "use strict";
  const APP_VERSION = "v0.1";
  const STORAGE_KEY = "netto_data_v1";

  // ---------- Icone ----------
  const ICONS = {
    home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V20h12v-9.5"/><path d="M10 20v-5h4v5"/>',
    euro: '<circle cx="12" cy="12" r="9"/><path d="M15.5 9.2A4 4 0 0 0 9 12a4 4 0 0 0 6.5 2.8M7.5 11h6M7.5 13.2h5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    cog: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M4.2 7l2.6 1.5M17.2 15.5l2.6 1.5M4.2 17l2.6-1.5M17.2 8.5l2.6-1.5"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6"/>',
    doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M9.5 12h5M9.5 15h5"/>',
  };
  function svg(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  }

  const COEFF = [
    { v: 40, label: "Commercio, alimentari, ristorazione, alloggio — 40%" },
    { v: 54, label: "Commercio ambulante (altri prodotti) — 54%" },
    { v: 62, label: "Intermediari del commercio — 62%" },
    { v: 67, label: "Altre attività economiche — 67%" },
    { v: 78, label: "Professionisti, servizi, tecnici, sanità — 78%" },
    { v: 86, label: "Costruzioni e attività immobiliari — 86%" },
  ];

  // ---------- Dati ----------
  function defaultData() {
    return {
      version: 1,
      onboarded: false,
      incassi: [], // { id, amount, description, date }
      settings: {
        coeff: 78, aliquota: 15,
        inpsType: "separata", inpsRate: 26.07, inpsFixed: 0, inpsMin: 18415, inpsReduce: false,
        theme: "light",
      },
    };
  }
  let data = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return Object.assign(defaultData(), JSON.parse(raw));
    } catch (e) {}
    return defaultData();
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {} }
  function settings() { if (!data.settings) data.settings = defaultData().settings; return data.settings; }
  function uid() { return "i" + (data.incassi.reduce((m, x) => Math.max(m, +String(x.id).slice(1) || 0), 0) + 1) + "_" + (data.incassi.length); }

  // ---------- Utility ----------
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const nf2 = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
  const nf0 = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const money = (n) => nf2.format(n || 0);
  const money0 = (n) => nf0.format(n || 0);
  function todayIso() { const d = new Date(); return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
  function p2(n) { return String(n).padStart(2, "0"); }
  function yearOf(iso) { return +String(iso).slice(0, 4); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2200); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  let currentYear = new Date().getFullYear();

  function incassatoYear(y) { return data.incassi.filter((i) => yearOf(i.date) === y).reduce((s, i) => s + (+i.amount || 0), 0); }
  function anniConDati() {
    const set = new Set(data.incassi.map((i) => yearOf(i.date)));
    set.add(new Date().getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }

  // ---------- Motore fiscale ----------
  function computeTax(y) {
    const s = settings();
    const inc = incassatoYear(y);
    const coeff = (s.coeff || 78) / 100;
    const imponibile = inc * coeff;
    let inps = 0;
    if (s.inpsType === "separata") inps = imponibile * ((s.inpsRate || 26.07) / 100);
    else if (s.inpsType === "artigiani") {
      inps = (s.inpsFixed || 0) + Math.max(0, imponibile - (s.inpsMin || 0)) * ((s.inpsRate || 24) / 100);
      if (s.inpsReduce) inps *= 0.65;
    } else if (s.inpsType === "cassa") inps = imponibile * ((s.inpsRate || 0) / 100) + (s.inpsFixed || 0);
    else inps = 0;
    const baseImposta = Math.max(0, imponibile - inps);
    const imposta = baseImposta * ((s.aliquota || 15) / 100);
    const accant = inps + imposta;
    const netto = inc - accant;
    return { inc, imponibile, inps, imposta, accant, netto, pct: inc > 0 ? accant / inc * 100 : 0 };
  }
  // Quanto accantonare per ogni 100€ incassati (aliquota marginale, indipendente dagli incassi)
  function per100() {
    const s = settings();
    const coeff = (s.coeff || 78) / 100;
    const imp = 100 * coeff;
    let inps = 0;
    if (s.inpsType === "separata") inps = imp * ((s.inpsRate || 26.07) / 100);
    else if (s.inpsType === "artigiani") inps = imp * ((s.inpsRate || 24) / 100) * (s.inpsReduce ? 0.65 : 1);
    else if (s.inpsType === "cassa") inps = imp * ((s.inpsRate || 0) / 100);
    const imposta = Math.max(0, imp - inps) * ((s.aliquota || 15) / 100);
    return inps + imposta;
  }

  // ---------- Render ----------
  function render() {
    renderNavIcons();
    renderCasa();
    renderIncassi();
    renderScadenze();
    renderProfileSummary();
    save();
  }
  function renderNavIcons() {
    $$(".tab-ico[data-i]").forEach((el) => { if (!el.dataset.done) { el.innerHTML = svg(el.dataset.i); el.dataset.done = "1"; } });
  }

  function renderCasa() {
    const y = new Date().getFullYear();
    const t = computeTax(y);
    $("#year-label").textContent = y;
    $("#hero-year").textContent = y;
    $("#hero-incassato").textContent = money0(t.inc);
    $("#hero-sub").textContent = t.inc > 0 ? data.incassi.filter((i) => yearOf(i.date) === y).length + " incassi registrati" : "Aggiungi il tuo primo incasso";

    $("#res-value").textContent = money0(t.netto);
    $("#res-pct").textContent = t.inc > 0 ? "il " + Math.round(100 - t.pct) + "% è tuo" : "";
    $("#res-note").textContent = t.inc > 0
      ? `Da mettere da parte: ${money0(t.accant)}`
      : "Registra gli incassi e ti dico quanto è davvero tuo.";

    const tot = Math.max(t.inc, 1);
    $("#bar-net").style.width = (Math.max(0, t.netto) / tot * 100) + "%";
    $("#bar-inps").style.width = (t.inps / tot * 100) + "%";
    $("#bar-tax").style.width = (t.imposta / tot * 100) + "%";

    $("#lg-net").textContent = money0(Math.max(0, t.netto));
    $("#lg-inps").textContent = money0(t.inps);
    $("#lg-tax").textContent = money0(t.imposta);
    $("#st-accant").textContent = money0(t.accant);
    $("#st-per100").textContent = money0(100 - per100());

    // prossima scadenza
    const sca = scadenzeFor(y);
    const next = sca[0];
    const card = $("#next-sca-card");
    if (next && t.inc > 0) {
      card.hidden = false;
      $("#next-sca").innerHTML = scaRow(next);
    } else card.hidden = true;
  }

  function renderIncassi() {
    // selettore anno
    const years = anniConDati();
    const seg = $("#year-seg");
    seg.innerHTML = years.map((yr) => `<button type="button" class="seg-btn ${yr === currentYear ? "active" : ""}" data-year="${yr}">${yr}</button>`).join("");

    const items = data.incassi.filter((i) => yearOf(i.date) === currentYear)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    const box = $("#incassi-list");
    if (!items.length) { box.innerHTML = `<div class="empty">Nessun incasso nel ${currentYear}. Tocca “Aggiungi” per registrarne uno.</div>`; return; }
    const tot = items.reduce((s, i) => s + (+i.amount || 0), 0);
    box.innerHTML = `<div class="card"><div class="card-head"><h3>Totale ${currentYear}</h3><span class="card-side">${items.length} incassi</span></div>
      <div class="hero-value" style="font-size:30px">${money(tot)}</div></div>
      <div class="card"><div class="list">` +
      items.map((i) => `<div class="row" data-edit="${i.id}">
        <div class="row-ico">${svg("euro")}</div>
        <div class="row-main"><div class="row-title">${esc(i.description || "Incasso")}</div>
          <div class="row-sub">${cap(fmtDate(i.date))}</div></div>
        <span class="amount">${money(i.amount)}</span>
      </div>`).join("") +
      `</div></div>`;
  }

  function fmtDate(iso) { return new Date(iso + "T00:00:00").toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" }); }

  // ---------- Scadenze ----------
  function scadenzeFor(y) {
    const t = computeTax(y);
    const list = [];
    // Saldo dell'anno y + acconti: si versano l'anno successivo
    list.push({
      date: `${y + 1}-06-30`, title: `Saldo ${y}`,
      desc: `Imposta sostitutiva + contributi sull'incassato ${y}. Stima da confermare con la dichiarazione.`,
      amount: t.accant, pill: "stima",
    });
    list.push({
      date: `${y + 1}-11-30`, title: `2° acconto ${y + 1}`,
      desc: `Acconto per l'anno successivo: dipende da quanto incasserai. Tieni da parte con lo stesso ritmo di quest'anno.`,
      amount: null, pill: "prossimo anno",
    });
    // ordina per data, mostra prima le future
    return list.sort((a, b) => (a.date < b.date ? -1 : 1));
  }
  function scaRow(s) {
    const d = new Date(s.date + "T00:00:00");
    return `<div class="sca">
      <div class="sca-date"><div class="sca-day">${d.getDate()}</div><div class="sca-mon">${d.toLocaleDateString("it-IT", { month: "short" })} ${d.getFullYear()}</div></div>
      <div class="sca-main"><div class="sca-title">${esc(s.title)} ${s.pill ? `<span class="pill ${s.amount == null ? "" : ""}">${s.pill}</span>` : ""}</div>
        <div class="sca-desc">${esc(s.desc)}</div></div>
      ${s.amount != null ? `<span class="sca-amt">${money0(s.amount)}</span>` : ""}
    </div>`;
  }
  function renderScadenze() {
    const y = new Date().getFullYear();
    const t = computeTax(y);
    const list = scadenzeFor(y);
    const box = $("#scadenze-list");
    box.innerHTML = `<div class="card"><div class="card-head"><h3>Da mettere da parte per il ${y}</h3></div>
        <div class="hero-value" style="font-size:30px;color:var(--tax)">${money0(t.accant)}</div>
        <p class="muted small" style="margin-top:6px">≈ ${money0(t.imposta)} di imposta + ${money0(t.inps)} di contributi</p></div>
      <div class="card"><div class="list-sca">` + list.map(scaRow).join("") + `</div></div>`;
  }

  function renderProfileSummary() {
    const s = settings();
    const c = COEFF.find((x) => x.v === s.coeff);
    const inpsLabel = { separata: "Gestione Separata " + (s.inpsRate || 26.07) + "%", artigiani: "Artigiani/Commercianti", cassa: "Cassa / % personalizzata", nessuna: "Nessun contributo" }[s.inpsType] || s.inpsType;
    $("#profile-summary").innerHTML = `Coefficiente <b>${s.coeff}%</b> · imposta <b>${s.aliquota}%</b> · ${inpsLabel}`;
  }

  // ---------- Modale incasso ----------
  let editId = null;
  function openModal(inc) {
    $("#modal").hidden = false;
    if (inc) {
      editId = inc.id;
      $("#modal-title").textContent = "Modifica incasso";
      $("#f-amount").value = inc.amount; $("#f-desc").value = inc.description || ""; $("#f-date").value = inc.date;
      $("#f-delete").hidden = false;
    } else {
      editId = null;
      $("#modal-title").textContent = "Nuovo incasso";
      $("#f-amount").value = ""; $("#f-desc").value = ""; $("#f-date").value = todayIso();
      $("#f-delete").hidden = true;
    }
  }
  function closeModal() { $("#modal").hidden = true; }
  function saveIncasso() {
    const amount = parseFloat(String($("#f-amount").value).replace(",", "."));
    if (!(amount > 0)) { toast("Inserisci un importo"); return; }
    const payload = { amount, description: $("#f-desc").value.trim(), date: $("#f-date").value || todayIso() };
    if (editId) { const it = data.incassi.find((x) => x.id === editId); if (it) Object.assign(it, payload); toast("Incasso aggiornato"); }
    else { data.incassi.push(Object.assign({ id: uid() }, payload)); currentYear = yearOf(payload.date); toast("Incasso registrato"); }
    save(); render(); closeModal();
  }
  function deleteIncasso() {
    if (editId && confirm("Eliminare questo incasso?")) { data.incassi = data.incassi.filter((x) => x.id !== editId); save(); render(); closeModal(); toast("Eliminato"); }
  }

  // ---------- Profilo ----------
  function fillCoeff(sel) { sel.innerHTML = COEFF.map((c) => `<option value="${c.v}">${c.label}</option>`).join(""); }
  function openProfile() {
    $("#profile-modal").hidden = false;
    const s = settings();
    fillCoeff($("#pm-coeff")); $("#pm-coeff").value = s.coeff;
    $$("#pm-aliquota .seg-btn").forEach((b) => b.classList.toggle("active", +b.dataset.al === s.aliquota));
    $("#pm-inps").value = s.inpsType;
    renderInpsExtra();
  }
  function closeProfile() { $("#profile-modal").hidden = true; }
  function renderInpsExtra() {
    const type = $("#pm-inps").value; const s = settings(); const box = $("#pm-inps-extra");
    if (type === "separata") box.innerHTML = `<label class="field"><span>Aliquota (%)</span><input id="pm-rate" type="number" step="0.01" value="${s.inpsRate || 26.07}"></label>`;
    else if (type === "artigiani") box.innerHTML =
      `<div class="field-row">
        <label class="field"><span>Contributi fissi annui (€)</span><input id="pm-fixed" type="number" step="1" value="${s.inpsFixed || 4427}"></label>
        <label class="field"><span>Aliquota su eccedenza (%)</span><input id="pm-rate" type="number" step="0.01" value="${s.inpsRate || 24}"></label>
      </div>
      <label class="field"><span>Minimale (€)</span><input id="pm-min" type="number" step="1" value="${s.inpsMin || 18415}"></label>
      <label class="switch-row"><span>Riduzione contributiva 35%</span><input type="checkbox" id="pm-reduce" class="switch" ${s.inpsReduce ? "checked" : ""}></label>`;
    else if (type === "cassa") box.innerHTML =
      `<div class="field-row">
        <label class="field"><span>Aliquota (%)</span><input id="pm-rate" type="number" step="0.01" value="${s.inpsRate || 0}"></label>
        <label class="field"><span>Quota fissa annua (€)</span><input id="pm-fixed" type="number" step="1" value="${s.inpsFixed || 0}"></label>
      </div>`;
    else box.innerHTML = "";
  }
  function saveProfile() {
    const s = settings();
    s.coeff = +$("#pm-coeff").value;
    s.aliquota = +($("#pm-aliquota .seg-btn.active") || {}).dataset?.al || s.aliquota;
    s.inpsType = $("#pm-inps").value;
    if ($("#pm-rate")) s.inpsRate = parseFloat(String($("#pm-rate").value).replace(",", ".")) || 0;
    if ($("#pm-fixed")) s.inpsFixed = parseFloat(String($("#pm-fixed").value).replace(",", ".")) || 0;
    if ($("#pm-min")) s.inpsMin = parseFloat(String($("#pm-min").value).replace(",", ".")) || 0;
    if ($("#pm-reduce")) s.inpsReduce = $("#pm-reduce").checked;
    save(); render(); closeProfile(); toast("Profilo salvato");
  }

  // ---------- Onboarding ----------
  function showOnboarding() {
    $("#onboarding").hidden = false;
    fillCoeff($("#onb-coeff")); $("#onb-coeff").value = 78;
  }
  function finishOnboarding() {
    const s = settings();
    s.coeff = +$("#onb-coeff").value;
    s.aliquota = +($("#onb-aliquota .seg-btn.active") || {}).dataset?.al || 5;
    s.inpsType = $("#onb-inps").value;
    s.inpsRate = s.inpsType === "separata" ? 26.07 : s.inpsType === "artigiani" ? 24 : 0;
    if (s.inpsType === "artigiani") { s.inpsFixed = 4427; s.inpsMin = 18415; }
    data.onboarded = true;
    save(); $("#onboarding").hidden = true; render();
  }

  // ---------- Tema ----------
  function applyTheme() {
    const t = settings().theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = t;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#191D1A" : "#2E5D4B");
    $$("#theme-seg .seg-btn").forEach((b) => b.classList.toggle("active", b.dataset.theme === t));
  }
  function setTheme(t) { settings().theme = t; save(); applyTheme(); }

  // ---------- Backup ----------
  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `netto-backup-${todayIso()}.json`; a.click(); URL.revokeObjectURL(url);
    toast("Backup esportato");
  }
  function importData(file) {
    const r = new FileReader();
    r.onload = () => { try { const p = JSON.parse(r.result); if (!p || !Array.isArray(p.incassi)) throw 0; data = Object.assign(defaultData(), p); save(); applyTheme(); render(); toast("Backup importato"); } catch (e) { toast("File non valido"); } };
    r.readAsText(file);
  }

  // ---------- Navigazione ----------
  function switchTab(tab) {
    $$(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    $$(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));
    $("#fab").style.display = tab === "incassi" || tab === "casa" ? "" : "none";
    window.scrollTo(0, 0);
  }

  function bind() {
    $$(".tab-btn").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) { openModal(null); return; }
      const goto = e.target.closest("[data-goto]");
      if (goto) { const b = $(`.tab-btn[data-tab="${goto.dataset.goto}"]`); if (b) b.click(); return; }
      const edit = e.target.closest("[data-edit]");
      if (edit) { const it = data.incassi.find((x) => x.id === edit.dataset.edit); if (it) openModal(it); return; }
      const yr = e.target.closest("[data-year]");
      if (yr) { currentYear = +yr.dataset.year; renderIncassi(); return; }
      if (e.target.hasAttribute("data-close")) closeModal();
      if (e.target.hasAttribute("data-close-pm")) closeProfile();
    });
    $("#modal-save").addEventListener("click", saveIncasso);
    $("#f-delete").addEventListener("click", deleteIncasso);
    $("#edit-profile").addEventListener("click", openProfile);
    $("#pm-save").addEventListener("click", saveProfile);
    $("#pm-inps").addEventListener("change", renderInpsExtra);
    $$("#pm-aliquota .seg-btn").forEach((b) => b.addEventListener("click", () => $$("#pm-aliquota .seg-btn").forEach((x) => x.classList.toggle("active", x === b))));
    $$("#onb-aliquota .seg-btn").forEach((b) => b.addEventListener("click", () => $$("#onb-aliquota .seg-btn").forEach((x) => x.classList.toggle("active", x === b))));
    $("#onb-start").addEventListener("click", finishOnboarding);
    $$("#theme-seg .seg-btn").forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.theme)));
    $("#btn-export").addEventListener("click", exportData);
    $("#btn-import").addEventListener("click", () => $("#import-file").click());
    $("#import-file").addEventListener("change", (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; });
    $("#btn-reset").addEventListener("click", () => { if (confirm("Cancellare TUTTI i dati? Operazione irreversibile.")) { localStorage.removeItem(STORAGE_KEY); location.reload(); } });
  }

  // ---------- Service worker ----------
  if ("serviceWorker" in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (refreshing) return; refreshing = true; location.reload(); });
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").then((reg) => {
      reg.update(); document.addEventListener("visibilitychange", () => { if (!document.hidden) reg.update(); });
    }).catch(() => {}));
  }

  // ---------- Avvio a prova di guasto ----------
  function safe(fn, label) { try { fn(); } catch (e) { console.error("Netto init:", label, e); } }
  safe(applyTheme, "applyTheme");
  safe(() => { const av = $("#app-version"); if (av) av.textContent = APP_VERSION; }, "version");
  safe(render, "render");
  safe(bind, "bind");
  safe(() => { if (!data.onboarded) showOnboarding(); }, "onboarding");
})();
