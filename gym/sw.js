// Oarso Gym · service worker de la demo.
// HTML, JS y CSS: primero la red y, si no hay cobertura, la copia guardada. Fotos y fuentes: primero la copia guardada.
const V = 'oarsogym-v7';
const CORE = ['./', './index.html', './app.css?v=7', './app.js?v=7', './data.js?v=7', './anat.js?v=7', './manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cacheFirst = async () => { const c = await caches.open(V); const hit = await c.match(req); if (hit) return hit; const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; };
  const networkFirst = async () => { const c = await caches.open(V); try { const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; } catch (err) { return (await c.match(req)) || (await c.match('./index.html')); } };
  const swr = async () => { const c = await caches.open(V); const hit = await c.match(req); const net = fetch(req).then((r) => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; };
  if (url.origin !== location.origin) { e.respondWith(swr()); return; }
  if (/\.(jpg|jpeg|png|svg|woff2|webp)$/i.test(url.pathname)) { e.respondWith(cacheFirst()); return; }
  e.respondWith(networkFirst());
});
