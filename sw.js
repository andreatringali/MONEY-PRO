/* Tasca service worker — aggiornamento automatico + offline
   Strategia: network-first (quando online prende sempre l'ultima versione),
   con fallback alla cache quando sei offline. I dati restano in localStorage
   e non vengono mai toccati dagli aggiornamenti. */
const CACHE = "moneypro-v24";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=24",
  "./app.js?v=24",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // solo file dell'app

  // Network-first: prova la rete, aggiorna la cache, altrimenti usa la cache
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("./index.html"))
      )
  );
});
