/* =====================================================================
   services.js — services partagés par toutes les matières
     Voix        : M.voices, M.say (segments, séquences, langues), M.sayHtml, M.hush
     Réglages    : M.settings (sons, lecture automatique)
     Données     : M.userData (données saisies par le parent), M.registerData / M.data
     Parents     : M.registerParentTool
     Dessins     : M.art.register / M.art.html (SVG avec repli emoji)
     Texte       : M.people, M.fr (de/d', nombres, gabarits), M.typo
     Progression : M.progress.item, M.pickWeighted, M.progress.participate
     Habiletés   : M.skillStatus (needs / available), M.lint
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;

  /* ================= Voix ================= */
  const norm = (l) => String(l || '').replace('_', '-').toLowerCase();
  const VO = { list: [], chosen: {} };
  function loadVoices() {
    try { VO.list = speechSynthesis.getVoices() || []; } catch (e) { VO.list = []; }
  }
  let readyResolve;
  const readyP = new Promise((r) => (readyResolve = r));
  try {
    if ('speechSynthesis' in window) {
      loadVoices();
      if (VO.list.length) readyResolve();
      speechSynthesis.addEventListener ? speechSynthesis.addEventListener('voiceschanged', () => { loadVoices(); readyResolve(); }) : (speechSynthesis.onvoiceschanged = () => { loadVoices(); readyResolve(); });
    } else readyResolve();
  } catch (e) { readyResolve(); }
  setTimeout(() => readyResolve(), 2000);

  M.voices = {
    ready: () => readyP,
    /** Voix pour une langue : exacte (fr-CA), de repli (fr-FR) ou aucune. */
    find(lang) {
      const want = norm(lang), base = want.slice(0, 2);
      if (VO.chosen[base]) { const v = VO.list.find((x) => x.name === VO.chosen[base]); if (v) return { voice: v, state: norm(v.lang) === want ? 'exact' : 'fallback' }; }
      const exact = VO.list.find((v) => norm(v.lang) === want);
      if (exact) return { voice: exact, state: 'exact' };
      const prefs = base === 'en' ? ['en-ca', 'en-us', 'en-gb'] : base === 'fr' ? ['fr-ca', 'fr-fr'] : [];
      for (const p of prefs) { const v = VO.list.find((x) => norm(x.lang) === p); if (v) return { voice: v, state: 'fallback' }; }
      const any = VO.list.find((v) => norm(v.lang).startsWith(base));
      return any ? { voice: any, state: 'fallback' } : { voice: null, state: 'none' };
    },
    status(lang) { const f = this.find(lang); return { state: f.state, name: f.voice ? f.voice.name + ' (' + f.voice.lang + ')' : null }; },
    has(lang) { return !('speechSynthesis' in window) ? false : this.find(lang).state !== 'none'; },
    choose(base, name) { VO.chosen[base] = name; },
    all: () => VO.list.slice(),
  };

  const FR_MATH = (t) => t.replace(/\s−\s|\s-\s/g, ' moins ').replace(/\+/g, ' plus ').replace(/=/g, ' égale ').replace(/×/g, ' fois ').replace(/÷/g, ' divisé par ').replace(/[▢□]/g, ' combien ');
  let sayTok = 0;
  /**
   * Lit à voix haute. Retourne une Promise (fin de lecture) — false si impossible.
   * M.say('texte', { lang:'fr-CA', rate:0.9, raw:false, pitch })
   * M.say([{ text, lang?, pauseAfter?, rate?, pitch? }, …], opts)   → séquence
   * Ne lit JAMAIS une langue avec la voix d'une autre langue.
   */
  M.say = function (text, opts = {}) {
    try {
      if (!('speechSynthesis' in window) || !text || (Array.isArray(text) && !text.length)) return Promise.resolve(false);
      speechSynthesis.cancel();
      const tok = ++sayTok;
      const segs = Array.isArray(text) ? text : [{ text }];
      let anySpoken = false;
      const speakOne = (seg) => new Promise((res) => {
        const lang = seg.lang || opts.lang || 'fr-CA';
        const f = M.voices.find(lang);
        if (f.state === 'none' && VO.list.length) return res(false);
        let t = String(seg.text);
        if (!(seg.raw ?? opts.raw) && lang.startsWith('fr')) t = FR_MATH(t);
        const u = new SpeechSynthesisUtterance(t);
        u.lang = lang;
        if (f.voice) u.voice = f.voice;
        u.rate = seg.rate || opts.rate || (M.settings && M.settings.get('rate')) || 0.9;
        if (seg.pitch || opts.pitch) u.pitch = seg.pitch || opts.pitch;
        u.onend = () => res(true);
        u.onerror = () => res(false);
        anySpoken = true;
        speechSynthesis.speak(u);
        setTimeout(() => res(true), 1500 + t.length * 120); // filet de sécurité
      });
      return (async () => {
        for (const seg of segs) {
          if (tok !== sayTok) return false;
          await speakOne(seg);
          const pause = seg.pauseAfter ?? opts.pause ?? (segs.length > 1 ? 500 : 0);
          if (pause && tok === sayTok) await M.sleep(pause);
        }
        return anySpoken;
      })();
    } catch (e) { return Promise.resolve(false); }
  };
  /** Lit du HTML : les passages <span lang="en">…</span> sont lus avec la voix anglaise. */
  M.sayHtml = function (html, opts = {}) {
    const d = document.createElement('div');
    d.innerHTML = String(html).replace('{?}', '▢');
    const segs = [];
    const walk = (node, lang) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) { if (n.textContent.trim()) segs.push({ text: n.textContent, lang }); }
        else if (n.nodeType === 1) walk(n, n.getAttribute('lang') ? (n.getAttribute('lang').startsWith('en') ? 'en-CA' : 'fr-CA') : lang);
      });
    };
    walk(d, opts.lang || 'fr-CA');
    // fusionner les segments consécutifs de même langue
    const merged = [];
    segs.forEach((s) => { const last = merged[merged.length - 1]; if (last && last.lang === s.lang) last.text += ' ' + s.text; else merged.push({ ...s, pauseAfter: 150 }); });
    return M.say(merged, opts);
  };
  M.hush = () => { sayTok++; try { speechSynthesis.cancel(); } catch (e) {} };

  /* ================= Stockage ================= */
  const safeGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---- Réglages ---- */
  const SKEY = 'devoirs2e:settings:v1';
  const settings = Object.assign({ sound: true, autoRead: false, rate: 0.9 }, safeGet(SKEY) || {});
  M.settings = {
    get: (k) => settings[k],
    set(k, v) { settings[k] = v; safeSet(SKEY, settings); if (k === 'sound') M.sfx.on = !!v; },
  };
  M.sfx.on = settings.sound;

  /* ---- Données de l'utilisateur (ex. : liste de mots de la semaine) ---- */
  const UKEY = 'devoirs2e:user:v1';
  let U = safeGet(UKEY) || {};
  const fixtures = {};
  M.userData = {
    get(ns, key, def) { const v = U[ns] && U[ns][key]; if (v !== undefined) return v; if (fixtures[ns + '/' + key] !== undefined && M.userData.useFixtures) return fixtures[ns + '/' + key]; return def; },
    set(ns, key, value) { (U[ns] = U[ns] || {})[key] = value; safeSet(UKEY, U); },
    remove(ns, key) { if (U[ns]) { delete U[ns][key]; safeSet(UKEY, U); } },
    exportAll: () => JSON.stringify(U),
    importAll(json) { U = typeof json === 'string' ? JSON.parse(json) : json; safeSet(UKEY, U); },
    /** Valeur d'essai utilisée par tools/check-skills.js (aucun effet dans le navigateur). */
    fixture(ns, key, value) { fixtures[ns + '/' + key] = value; },
    useFixtures: false,
  };

  /* ---- Outils pour les parents (affichés sur la page Parents) ---- */
  M.parentTools = [];
  /** def = { id, subject, title, icon, render(el) } */
  M.registerParentTool = (def) => { if (!M.parentTools.find((t) => t.id === def.id)) M.parentTools.push(def); };

  /* ---- Données partagées entre matières ---- */
  M.data = {};
  M.registerData = (id, value) => {
    if (M.data[id] !== undefined) console.warn('Données en double :', id);
    M.data[id] = value;
    return value;
  };

  /* ================= Dessins (SVG) avec repli emoji ================= */
  const ART = {};
  M.art = {
    /** fn(opts) → chaîne SVG ; emoji = repli texte. */
    register(name, fn, emoji = '') { ART[name] = { fn, emoji }; },
    has: (name) => !!ART[name],
    html(name, opts = {}) {
      const a = ART[name];
      if (!a) return opts.fallback || '';
      const size = opts.size || 64;
      return `<span class="art" style="width:${size}px;height:${size}px" role="img" aria-label="${M.esc(opts.alt || name)}">${a.fn(opts)}</span>`;
    },
    emoji: (name) => (ART[name] ? ART[name].emoji : ''),
    list: () => Object.keys(ART),
  };

  /* ================= Texte en français ================= */
  const NAMES = [['Léa', 'f'], ['Félix', 'm'], ['Florence', 'f'], ['Thomas', 'm'], ['Zoé', 'f'], ['William', 'm'], ['Rosalie', 'f'], ['Samuel', 'm'], ['Emma', 'f'], ['Olivier', 'm'], ['Alice', 'f'], ['Jacob', 'm'], ['Maëlle', 'f'], ['Nathan', 'm'], ['Charlotte', 'f'], ['Louis', 'm'], ['Amira', 'f'], ['Mamadou', 'm'], ['Mei', 'f'], ['Antoine', 'm'], ['Jade', 'f'], ['Arnaud', 'm'], ['Inès', 'f'], ['Malik', 'm']];
  M.people = {
    NAMES,
    /** → { n, f, il, Il, e, son, sa, ami } (e = accord féminin « e »). */
    pick({ not = [], genre } = {}) {
      const pool = NAMES.filter(([n, g]) => !not.includes(n) && (!genre || g === genre));
      const [n, g] = M.pick(pool.length ? pool : NAMES);
      const f = g === 'f';
      return { n, f, il: f ? 'elle' : 'il', Il: f ? 'Elle' : 'Il', e: f ? 'e' : '', ami: f ? 'amie' : 'ami', un: f ? 'une' : 'un' };
    },
  };
  const VOWEL = /^[aeiouyhàâäéèêëîïôöûüœæ]/i;
  M.fr = {
    /** « de pommes » / « d'oranges » */
    de: (mot) => (VOWEL.test(mot) ? 'd\'' : 'de ') + mot,
    /** « que » / « qu' » */
    que: (mot) => (VOWEL.test(mot) ? 'qu\'' : 'que ') + mot,
    /** 1 000 (espace insécable des milliers) */
    nb: (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
    /** Remplit {cle} ; lève une erreur si une variable manque (détecté par check-skills). */
    fill(tpl, vars) {
      return tpl.replace(/\{(\w+)\}/g, (m, k) => {
        if (vars[k] === undefined) throw new Error('Variable manquante dans le gabarit : ' + k);
        return vars[k];
      });
    },
    cap: (s) => s.charAt(0).toUpperCase() + s.slice(1),
  };
  /** Typographie française : espace insécable avant ? ! : ; et dans « ». Texte brut seulement. */
  M.typo = (s) => String(s).replace(/\s*([?!:;])(?=\s|$|<)/g, ' $1').replace(/«\s*/g, '« ').replace(/\s*»/g, ' »');

  /* ================= Progression par élément ================= */
  const P = () => M.progress.data();
  M.progress.item = (skillId, key) => ({
    record(ok) {
      const d = P();
      d.items = d.items || {};
      const k = skillId + '|' + key;
      const it = (d.items[k] = d.items[k] || { h: [], last: 0 });
      it.h.push(ok ? 1 : 0);
      if (it.h.length > 10) it.h.shift();
      it.last = Date.now();
      M.save();
    },
    stats() {
      const it = (P().items || {})[skillId + '|' + key];
      if (!it || !it.h.length) return { n: 0, acc: null, last: 0 };
      return { n: it.h.length, acc: it.h.reduce((a, b) => a + b, 0) / it.h.length, last: it.last };
    },
  });
  /** Choisit un élément en favorisant ceux qui sont ratés, jamais vus ou anciens. */
  M.pickWeighted = (items, keyFn, skillId) => {
    const w = items.map((x) => {
      const s = M.progress.item(skillId, keyFn(x)).stats();
      if (!s.n) return 3;
      const age = Math.min(7, (Date.now() - s.last) / 864e5);
      return 0.5 + (1 - s.acc) * 4 + age * 0.3;
    });
    let r = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  };
  /** Participation aux cartes non notées (réflexion) — visible aux parents seulement. */
  M.progress.participate = (skillId) => { const d = P(); d.participation = d.participation || {}; d.participation[skillId] = (d.participation[skillId] || 0) + 1; M.save(); };

  /* ================= Disponibilité des habiletés ================= */
  /** true si l'habileté peut être pratiquée, sinon une raison (texte). */
  M.skillStatus = (sk) => {
    for (const need of sk.needs || []) {
      const m = /^speech:(\w+)/.exec(need);
      if (m && !M.voices.has(m[1] === 'en' ? 'en-CA' : 'fr-CA') && M.voices.all().length) return m[1] === 'en' ? 'Il faut une voix anglaise sur cet appareil (voir Parents).' : 'Il faut une voix française sur cet appareil (voir Parents).';
    }
    if (sk.available) { const r = sk.available(); if (r !== true) return r || 'Pas disponible pour l\'instant.'; }
    return true;
  };

  /* ================= Vérifications de contenu ================= */
  M.lint = {
    /** Refuse les questions notées qui touchent la vie privée de l'enfant. */
    noPrivate(text) {
      const t = M.text ? String(text).toLowerCase() : String(text).toLowerCase();
      const bad = ['ta famille', 'tu ressens', 'ta religion', 'chez toi, est-ce que', 'tes parents sont'];
      const hit = bad.find((b) => t.includes(b));
      return hit ? `vie privée : « ${hit} »` : undefined;
    },
  };
})();
