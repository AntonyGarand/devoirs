/* =====================================================================
   sw.js — service worker : l'application fonctionne hors ligne et se met à jour
     · coquille (index.html, css, js) : mise en cache à l'installation, puis
       « périmé pendant la revalidation » (réponse immédiate du cache, mise à jour en arrière-plan)
     · voix enregistrée audio/*.mp3 (noms = empreintes, jamais modifiés) et
       js/musique/samples.js : cache d'abord (téléchargés une seule fois)
     · nouvelle version (VERSION change) : installée tout de suite (skipWaiting),
       anciens caches supprimés; la page se recharge hors d'une série de questions (app.js)
   La liste SHELL et VERSION sont générées par `node tools/gen-sw.js`.
   Enregistré seulement en http(s) (jamais en file://).
   ===================================================================== */
'use strict';
// GÉNÉRÉ:debut — node tools/gen-sw.js (ne pas modifier à la main)
const VERSION = '29f66c4e485e';
const SAMPLES_VERSION = '028705e0df1c';
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-180.png",
  "css/ds/tokens.css",
  "css/ds/components.css",
  "css/ds/ui.css",
  "css/ds/question.css",
  "css/ds/formats.css",
  "css/ds/viz.css",
  "css/ds/extra.css",
  "css/ds/layout.css",
  "css/ds/motion.css",
  "js/core.js",
  "js/services.js",
  "js/clips.js",
  "audio/index.js",
  "js/music.js",
  "js/formats.js",
  "js/session.js",
  "js/ui.js",
  "js/ui-extra.js",
  "js/viz.js",
  "js/viz-extra.js",
  "js/art-lib.js",
  "js/maths/subject.js",
  "js/maths/skills/nombres.js",
  "js/maths/skills/operations.js",
  "js/maths/skills/geometrie.js",
  "js/maths/skills/mesure.js",
  "js/maths/skills/stats.js",
  "js/maths/learn/nombres.js",
  "js/maths/learn/operations.js",
  "js/maths/learn/geometrie.js",
  "js/maths/learn/mesure.js",
  "js/maths/learn/stats.js",
  "js/maths/data/pb-contextes.js",
  "js/maths/pb.js",
  "js/maths/skills/problemes.js",
  "js/maths/skills/defis.js",
  "js/maths/learn/problemes.js",
  "js/francais/subject.js",
  "js/francais/data/mots.js",
  "js/francais/data/sons.js",
  "js/francais/data/verbes.js",
  "js/francais/data/familles.js",
  "js/francais/data/phrases.js",
  "js/francais/data/textes.js",
  "js/francais/skills/_commun.js",
  "js/francais/skills/sons.js",
  "js/francais/skills/lecture.js",
  "js/francais/skills/orthographe.js",
  "js/francais/skills/ma-liste.js",
  "js/francais/skills/grammaire.js",
  "js/francais/skills/phrase.js",
  "js/francais/skills/verbes.js",
  "js/francais/skills/vocabulaire.js",
  "js/francais/skills/ecriture.js",
  "js/francais/learn/sons.js",
  "js/francais/learn/lecture.js",
  "js/francais/learn/orthographe.js",
  "js/francais/learn/grammaire.js",
  "js/francais/learn/phrase.js",
  "js/francais/learn/verbes.js",
  "js/francais/learn/vocabulaire.js",
  "js/anglais/subject.js",
  "js/anglais/art.js",
  "js/anglais/data/vocab.js",
  "js/anglais/data/expressions.js",
  "js/anglais/data/stories.js",
  "js/anglais/data/chants.js",
  "js/anglais/skills/mots.js",
  "js/anglais/skills/bouger.js",
  "js/anglais/skills/parler.js",
  "js/anglais/skills/histoires.js",
  "js/anglais/learn/mots.js",
  "js/anglais/learn/bouger.js",
  "js/anglais/learn/parler.js",
  "js/anglais/learn/histoires.js",
  "js/univers/subject.js",
  "js/univers/data/emotions.js",
  "js/univers/data/scenarios.js",
  "js/univers/data/besoins.js",
  "js/univers/data/familles.js",
  "js/univers/data/lieux.js",
  "js/univers/data/plans.js",
  "js/univers/data/paysages.js",
  "js/univers/data/fetes.js",
  "js/univers/data/emblemes.js",
  "js/univers/data/autrefois.js",
  "js/univers/data/lignes-temps.js",
  "js/univers/skills/moi-autres.js",
  "js/univers/skills/communaute.js",
  "js/univers/skills/reperer.js",
  "js/univers/skills/quebec.js",
  "js/univers/skills/temps.js",
  "js/univers/learn/vivre-ensemble.js",
  "js/univers/learn/communaute.js",
  "js/univers/learn/plans.js",
  "js/univers/learn/quebec.js",
  "js/univers/learn/temps.js",
  "js/sciences/subject.js",
  "js/sciences/art.js",
  "js/sciences/ciel.js",
  "js/sciences/data/animaux.js",
  "js/sciences/data/objets.js",
  "js/sciences/data/vivant.js",
  "js/sciences/data/terre.js",
  "js/sciences/skills/vivant.js",
  "js/sciences/skills/matiere.js",
  "js/sciences/skills/terre.js",
  "js/sciences/skills/demarche.js",
  "js/sciences/learn/plante.js",
  "js/sciences/learn/cycles.js",
  "js/sciences/learn/animaux.js",
  "js/sciences/learn/corps.js",
  "js/sciences/learn/eau.js",
  "js/sciences/learn/terre.js",
  "js/sciences/learn/demarche.js",
  "js/musique/subject.js",
  "js/musique/art.js",
  "js/musique/data.js",
  "js/musique/skills/sons.js",
  "js/musique/skills/rythme.js",
  "js/musique/skills/sources.js",
  "js/musique/skills/ecoute.js",
  "js/musique/skills/notes.js",
  "js/musique/learn/sons.js",
  "js/musique/learn/rythme.js",
  "js/musique/learn/instruments.js",
  "js/musique/learn/ecouter.js",
  "js/musique/learn/piano.js",
  "js/app.js",
  "js/styleguide.js",
  "js/selftest.js",
  "icons/icon-192.png",
  "icons/icon-512.png"
];
// GÉNÉRÉ:fin

const SHELL_CACHE = 'devoirs-shell-' + VERSION;
const AUDIO_CACHE = 'devoirs-audio-v1';
const SAMPLES_CACHE = 'devoirs-samples-' + SAMPLES_VERSION;
const KEEP = [SHELL_CACHE, AUDIO_CACHE, SAMPLES_CACHE];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('devoirs-') && !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/** Réponse partielle (206) à partir d'une réponse complète : Safari lit l'audio par plages (Range). */
async function sliced(req, resp) {
  const range = req.headers.get('range');
  if (!range) return resp;
  const buf = await resp.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const size = buf.byteLength;
  let start = m[1] ? +m[1] : 0, end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (!m[1] && m[2]) { start = Math.max(0, size - +m[2]); end = size - 1; }
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': resp.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

/** Cache d'abord (fichiers qui ne changent jamais sous le même nom). */
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const key = req.url;
  const hit = await cache.match(key);
  if (hit) return sliced(req, hit);
  const resp = await fetch(key); // toujours le fichier complet (sans Range), découpé ensuite si besoin
  if (resp.ok && resp.status === 200) {
    await cache.put(key, resp.clone()).catch(() => {});
    return sliced(req, resp);
  }
  return resp;
}

/** Réponse du cache tout de suite, mise à jour en arrière-plan. */
async function staleWhileRevalidate(e, req, key) {
  const cache = await caches.open(SHELL_CACHE);
  const hit = await cache.match(key || req, { ignoreSearch: true });
  const net = fetch(req).then((resp) => {
    if (resp.ok && resp.status === 200 && resp.type === 'basic' && !resp.redirected) return cache.put(key || req, resp.clone()).then(() => resp);
    return resp;
  });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  return net;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const scope = new URL(self.registration.scope).pathname;
  const rel = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : url.pathname;
  if (/^audio\/[^/]+\.mp3$/.test(rel)) return e.respondWith(cacheFirst(req, AUDIO_CACHE));
  if (rel === 'js/musique/samples.js') return e.respondWith(cacheFirst(req, SAMPLES_CACHE));
  if (req.mode === 'navigate') {
    // Page de l'application (avec ou sans « index.html ») : coquille en cache
    return e.respondWith(
      staleWhileRevalidate(e, req, new URL('index.html', self.registration.scope).href)
        .catch(() => caches.match(new URL('index.html', self.registration.scope).href))
    );
  }
  if (/^(index\.html|manifest\.webmanifest|css\/.+|js\/.+|audio\/index\.js|icons\/.+)$/.test(rel)) {
    e.respondWith(staleWhileRevalidate(e, req).catch(() => caches.match(req, { ignoreSearch: true })));
  }
});
