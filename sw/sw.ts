/* =====================================================================
   sw.js — service worker : l'application fonctionne hors ligne et se met à jour
     · coquille (index.html, css, js) : mise en cache à l'installation, puis
       « périmé pendant la revalidation » (réponse immédiate du cache, mise à jour en arrière-plan)
     · voix enregistrée audio/*.mp3 (noms = empreintes, jamais modifiés) et
       js/musique/samples.js : cache d'abord (téléchargés une seule fois)
     · nouvelle version (VERSION change) : installée tout de suite (skipWaiting),
       anciens caches supprimés; la page se recharge hors d'une série de questions (app.js)
   VERSION, SAMPLES_VERSION et SHELL sont remplis par la compilation (scripts/build.ts).
   Enregistré seulement en http(s) (jamais en file://).
   ===================================================================== */

const sw = self as unknown as ServiceWorkerGlobalScope; // contexte du service worker (typé)
// Remplis par scripts/build.ts dans dist/sw.js (empreinte du contenu, liste de la coquille)
const VERSION: string = '__VERSION__';
const SAMPLES_VERSION: string = '__SAMPLES_VERSION__';
const SHELL: string[] = JSON.parse('__SHELL__');

const SHELL_CACHE = 'devoirs-shell-' + VERSION;
const AUDIO_CACHE = 'devoirs-audio-v1';
const SAMPLES_CACHE = 'devoirs-samples-' + SAMPLES_VERSION;
const KEEP = [SHELL_CACHE, AUDIO_CACHE, SAMPLES_CACHE];

sw.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => sw.skipWaiting()),
  );
});

sw.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('devoirs-') && !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => sw.clients.claim()),
  );
});

/** Réponse partielle (206) à partir d'une réponse complète : Safari lit l'audio par plages (Range). */
async function sliced(req: Request, resp: Response): Promise<Response> {
  const range = req.headers.get('range');
  if (!range) return resp;
  const buf = await resp.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range) || [];
  const size = buf.byteLength;
  let start = m[1] ? +m[1] : 0,
    end = m[2] ? Math.min(+m[2], size - 1) : size - 1;
  if (!m[1] && m[2]) {
    start = Math.max(0, size - +m[2]);
    end = size - 1;
  }
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
async function cacheFirst(req: Request, cacheName: string): Promise<Response> {
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
async function staleWhileRevalidate(e: FetchEvent, req: Request, key?: string): Promise<Response> {
  const cache = await caches.open(SHELL_CACHE);
  const hit = await cache.match(key || req, { ignoreSearch: true });
  const net = fetch(req).then((resp) => {
    if (resp.ok && resp.status === 200 && resp.type === 'basic' && !resp.redirected)
      return cache.put(key || req, resp.clone()).then(() => resp);
    return resp;
  });
  if (hit) {
    e.waitUntil(net.catch(() => {}));
    return hit;
  }
  return net;
}

sw.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== sw.location.origin) return;
  const scope = new URL(sw.registration.scope).pathname;
  const rel = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length) : url.pathname;
  if (/^audio\/[^/]+\.mp3$/.test(rel)) return e.respondWith(cacheFirst(req, AUDIO_CACHE));
  if (rel === 'js/musique/samples.js') return e.respondWith(cacheFirst(req, SAMPLES_CACHE));
  if (req.mode === 'navigate') {
    // Page de l'application (avec ou sans « index.html ») : coquille en cache
    return e.respondWith(
      staleWhileRevalidate(e, req, new URL('index.html', sw.registration.scope).href).catch(
        async () => (await caches.match(new URL('index.html', sw.registration.scope).href)) || Response.error(),
      ),
    );
  }
  if (/^(index\.html|manifest\.webmanifest|css\/.+|js\/.+|audio\/index\.js|icons\/.+)$/.test(rel)) {
    e.respondWith(staleWhileRevalidate(e, req).catch(async () => (await caches.match(req, { ignoreSearch: true })) || Response.error()));
  }
});
