// LinguaForge: isolated offline cache limited to this campus and origin.
const SCOPE = new URL(self.registration.scope);
const PREFIX = "linguaforge-campus:" + SCOPE.pathname + ":";
const CACHE = PREFIX + "v3";
const CORE = [
  "./", "./index.html", "./ruta.html", "./tokens.css", "./app.js", "./quiz-logic.mjs",
  "./cursos/forja-linguistica/quiz.json",
  "./cursos/forja-linguistica/syllabus.md",
  "./cursos/forja-linguistica/semana-01.md",
  "./cursos/forja-linguistica/semana-02.md",
  "./cursos/forja-linguistica/semana-03.md",
  "./cursos/forja-linguistica/semana-04.md",
  "./cursos/forja-linguistica/recursos.md"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(names =>
    Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CACHE)
      .map(name => caches.delete(name)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type !== "opaque") {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(() => {}));
    }
    return response;
  }).catch(async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(event.request) || Response.error();
  }));
});
