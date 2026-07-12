/* Netto service worker — network-first: online prende sempre l'ultima versione,
   offline usa la cache. I dati restano in localStorage e non vengono mai toccati. */
const CACHE = "netto-v0-1";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((res) => { const c = res.clone(); caches.open(CACHE).then((cache) => cache.put(req, c)).catch(() => {}); return res; }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html"))));
});
