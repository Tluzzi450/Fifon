/* Service worker de Paternidad FIFA: la app funciona sin conexión. */
const VERSION = "pf-v2";
const SHELL = [
  "./", "index.html", "manifest.webmanifest", "config.js", "vendor/chart.umd.js", "data/seed.json",
  "icons/logo.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png",
  "icons/apple-touch-icon.png", "icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Firebase / Firestore: siempre por red (tiene su propio modo offline)
  if (url.hostname.endsWith("googleapis.com") && !url.hostname.startsWith("fonts.")) return;
  // Inicio de sesión de Firebase (firebaseapp.com, googleapis, accounts.google.com): nunca desde caché
  if (url.hostname.endsWith("firebaseapp.com") || url.hostname.endsWith("web.app") || url.hostname.endsWith("google.com")) return;
  // SDK de Firebase: se guarda para que la app abra sin conexión
  if (url.hostname === "www.gstatic.com" && url.pathname.includes("firebasejs")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })));
    return;
  }
  // Páginas y config: primero red, si no hay conexión, lo guardado
  if (req.mode === "navigate" || url.pathname.endsWith("config.js")) {
    e.respondWith(fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })
      .catch(() => caches.match(req).then(hit => hit || caches.match("index.html"))));
    return;
  }
  // Resto (íconos, fuentes, librerías): primero lo guardado
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return res;
  })));
});
