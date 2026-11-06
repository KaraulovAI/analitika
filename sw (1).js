// Сохраняет страницу приложения, чтобы оно открывалось и без интернета (с последними данными из кэша).
const CACHE = 'analitika-v3';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // запросы к ntfy не трогаем
  e.respondWith(fetch(e.request).then((r) => {             // сначала сеть, при её отсутствии — сохранённая копия
    const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
