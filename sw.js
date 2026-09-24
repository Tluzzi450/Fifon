/* Service worker de Paternidad FIFA: la app abre sin conexión y se actualiza sola. */
const VERSION = "pf-2026.09.24-0058";
const SHELL = ["./", "index.html", "manifest.webmanifest", "seed.json", "logo.png",
  "icon-192.png", "icon-512.png", "maskable-512.png", "apple-touch-icon.png", "favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, {cache: "reload"})).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Control de versión, login de Google y base de datos: siempre por internet
  if (url.pathname.endsWith("version.json")) return;
  if (url.hostname.endsWith("googleapis.com") && !url.hostname.startsWith("fonts.")) return;
  if (url.hostname.endsWith("firebaseapp.com") || url.hostname.endsWith("web.app") || url.hostname.endsWith("google.com")) return;
  // Página, config.js y datos iniciales: primero internet (así llegan los cambios), si no hay, lo guardado
  if (req.mode === "navigate" || /(config\.js|seed\.json|index\.html)$/.test(url.pathname)) {
    e.respondWith(fetch(req, {cache: "no-cache"}).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })
      .catch(() => caches.match(req).then(hit => hit || caches.match("index.html"))));
    return;
  }
  // Íconos, fuentes y SDK de Firebase: primero lo guardado
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return res;
  })));
});
