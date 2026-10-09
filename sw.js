// Demo: red primero y copia local de respaldo, para que funcione aunque falle el wifi del club
const C = 'club-demo-v1';
const FILES = ['./', 'index.html', 'app.html', 'panel.html', 'tv.html', 'assets/core.js', 'assets/ui.css', 'assets/icon.svg', 'assets/icon-180.png',
  'assets/fonts/BarlowCondensed-600.woff2', 'assets/fonts/BarlowCondensed-700.woff2', 'assets/fonts/BarlowCondensed-800.woff2', 'assets/fonts/Inter-var.woff2', 'assets/fonts/SpaceMono-700.woff2',
  'assets/img/red.jpg', 'assets/img/pista-lineas.jpg', 'assets/img/pala.jpg', 'assets/img/experiencia.jpg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(C).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(C).then((c) => c.put(e.request, copy)).catch(() => {}); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
