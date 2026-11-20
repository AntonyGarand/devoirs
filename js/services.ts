/* =====================================================================
   services.js — services partagés par toutes les matières
     Voix        : M.voices, M.say (segments, séquences, langues), M.sayHtml, M.hush
     Réglages    : M.settings (sons, lecture automatique)
     Données     : M.userData (données saisies par le parent), M.registerData / M.data
     Parents     : M.registerParentTool
     Dessins     : M.art.register / M.art.html (SVG avec repli emoji)
     Texte       : M.people, M.fr (élision / contraction, nombres, gabarits), M.typo (affichage)
                   M.fr.de('le chat') → du chat · de('les amis') → des amis · de('Amira') → d'Amira · de('hibou') → de hibou
                   M.fr.a('le parc') → au parc · a('les amis') → aux amis · a('la école') → à l'école · a('Laval') → à Laval
                   M.fr.que('Amira') → qu'Amira · ne('aime') → n'aime · je('aime') → j'aime · le('arbre') → l'arbre
                   M.fr.el(petit, mot) : de que ne le la je me te se ce si jusque… (+ voyelle ou h muet) · M.fr.elides(mot)
                   M.fr.uncap(phrase) : minuscule initiale sauf nom propre · M.typo(html) : espaces insécables (affichage seulement)
     Progression : M.progress.item, M.pickWeighted, M.progress.participate
     Habiletés   : M.skillStatus (needs / available), M.lint
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;

  /* ================= Voix ================= */
  const norm = (l) =>
    String(l || '')
      .replace('_', '-')
      .toLowerCase();
  const VO = { list: [], chosen: {} };
  function loadVoices() {
    try {
      VO.list = speechSynthesis.getVoices() || [];
    } catch (e) {
      VO.list = [];
    }
  }
  let readyResolve;
  const readyP = new Promise((r) => (readyResolve = r));
  try {
    if ('speechSynthesis' in window) {
      loadVoices();
      if (VO.list.length) readyResolve();
      speechSynthesis.addEventListener
        ? speechSynthesis.addEventListener('voiceschanged', () => {
            loadVoices();
            readyResolve();
          })
        : (speechSynthesis.onvoiceschanged = () => {
            loadVoices();
            readyResolve();
          });
    } else readyResolve();
  } catch (e) {
    readyResolve();
  }
  setTimeout(() => readyResolve(), 2000);

  M.voices = {
    ready: () => readyP,
    /** Voix pour une langue : exacte (fr-CA), de repli (fr-FR) ou aucune. */
    find(lang) {
      const want = norm(lang),
        base = want.slice(0, 2);
      if (VO.chosen[base]) {
        const v = VO.list.find((x) => x.name === VO.chosen[base]);
        if (v) return { voice: v, state: norm(v.lang) === want ? 'exact' : 'fallback' };
      }
      const exact = VO.list.find((v) => norm(v.lang) === want);
      if (exact) return { voice: exact, state: 'exact' };
      const prefs = base === 'en' ? ['en-ca', 'en-us', 'en-gb'] : base === 'fr' ? ['fr-ca', 'fr-fr'] : [];
      for (const p of prefs) {
        const v = VO.list.find((x) => norm(x.lang) === p);
        if (v) return { voice: v, state: 'fallback' };
      }
      const any = VO.list.find((v) => norm(v.lang).startsWith(base));
      return any ? { voice: any, state: 'fallback' } : { voice: null, state: 'none' };
    },
    status(lang) {
      const f = this.find(lang);
      return { state: f.state, name: f.voice ? f.voice.name + ' (' + f.voice.lang + ')' : null };
    },
    /** Voix de l'appareil disponible pour cette langue (null = liste pas encore chargée). */
    device(lang) {
      if (!('speechSynthesis' in window)) return false;
      if (!VO.list.length) return null;
      return this.find(lang).state !== 'none';
    },
    /**
     * Peut-on lire cette langue ? Sans texte : voix de l'appareil, ou voix enregistrée (textes de l'application).
     * Avec un texte (ex. mots saisis par le parent) : voix de l'appareil, ou CE texte précis est enregistré.
     */
    has(lang, text) {
      const dev = this.device(lang);
      if (dev !== false) return true; // null : voix pas encore chargées → on ne bloque pas
      const C = M.clips;
      if (!(C && C.enabled())) return false;
      return text == null ? true : !!C.plan(String(text), lang);
    },
    choose(base, name) {
      VO.chosen[base] = name;
    },
    all: () => VO.list.slice(),
  };

  const FR_MATH = (t) =>
    t
      .replace(/\s−\s|\s-\s/g, ' moins ')
      .replace(/\+/g, ' plus ')
      .replace(/=/g, ' égale ')
      .replace(/×/g, ' fois ')
      .replace(/÷/g, ' divisé par ')
      .replace(/[▢□]/g, ' combien ');
  let sayTok = 0,
    speakingNow = false;
  /** true pendant une lecture M.say (pour attendre la fin avant de jouer un son). */
  M.isSpeaking = () => speakingNow;
  /**
   * Lit à voix haute. Retourne une Promise (fin de lecture) — false si impossible.
   * M.say('texte', { lang:'fr-CA', rate:0.9, raw:false, pitch })
   * M.say([{ text, lang?, pauseAfter?, rate?, pitch? }, …], opts)   → séquence
   * Ne lit JAMAIS une langue avec la voix d'une autre langue.
   */
  M.say = function (text, opts = {}) {
    try {
      const C = M.clips,
        clipsOn = !!(C && C.enabled());
      if ((!('speechSynthesis' in window) && !clipsOn) || !text || (Array.isArray(text) && !text.length)) return Promise.resolve(false);
      try {
        speechSynthesis.cancel();
      } catch (e) {}
      if (C) C.stop();
      if (M.MU && M.MU.stop) M.MU.stop(); // un son d'instrument ne doit pas jouer par-dessus la voix
      const tok = ++sayTok;
      const segs = Array.isArray(text) ? text : [{ text }];
      let anySpoken = false;
      const speakOne = (seg) =>
        new Promise((res) => {
          const lang = seg.lang || opts.lang || 'fr-CA';
          const f = M.voices.find(lang);
          let t = String(seg.text);
          if (!(seg.raw ?? opts.raw) && lang.startsWith('fr')) t = FR_MATH(t);
          const rate = seg.rate || opts.rate || (M.settings && M.settings.get('rate')) || 0.9;
          // 1) voix préenregistrée (vitesse normale = 0.9)
          const ids = clipsOn && C.plan(t, lang);
          if (ids) {
            anySpoken = true;
            return C.play(ids, rate / 0.9).then((r) => (r === 'fail' ? speakTts(t, lang, f, rate, seg).then(res) : res(r)));
          }
          speakTts(t, lang, f, rate, seg).then(res);
        });
      const speakTts = (t, lang, f, rate, seg) =>
        new Promise((res) => {
          if (!('speechSynthesis' in window) || (f.state === 'none' && VO.list.length)) return res(false);
          const u = new SpeechSynthesisUtterance(t);
          u.lang = lang;
          if (f.voice) u.voice = f.voice;
          u.rate = rate;
          if (seg.pitch || opts.pitch) u.pitch = seg.pitch || opts.pitch;
          u.onend = () => res(true);
          u.onerror = () => res(false);
          anySpoken = true;
          speechSynthesis.speak(u);
          setTimeout(() => res(true), 1500 + t.length * 120); // filet de sécurité
        });
      const mu = M.music;
      if (mu) mu.speaking(true);
      speakingNow = true;
      return (async () => {
        try {
          for (const seg of segs) {
            if (tok !== sayTok) return false;
            await speakOne(seg);
            const pause = seg.pauseAfter ?? opts.pause ?? (segs.length > 1 ? 500 : 0);
            if (pause && tok === sayTok) await M.sleep(pause);
          }
          return anySpoken;
        } finally {
          if (tok === sayTok) {
            speakingNow = false;
            if (mu) mu.speaking(false);
          }
        }
      })();
    } catch (e) {
      return Promise.resolve(false);
    }
  };
  /** Lit du HTML : les passages <span lang="en">…</span> sont lus avec la voix anglaise. */
  M.sayHtml = function (html, opts = {}) {
    const d = document.createElement('div');
    d.innerHTML = String(html).replace('{?}', '▢');
    const segs = [];
    const walk = (node, lang) => {
      node.childNodes.forEach((n) => {
        if (n.nodeType === 3) {
          if (n.textContent.trim()) segs.push({ text: n.textContent, lang });
        } else if (n.nodeType === 1) walk(n, n.getAttribute('lang') ? (n.getAttribute('lang').startsWith('en') ? 'en-CA' : 'fr-CA') : lang);
      });
    };
    walk(d, opts.lang || 'fr-CA');
    // fusionner les segments consécutifs de même langue
    const merged = [];
    segs.forEach((s) => {
      const last = merged[merged.length - 1];
      if (last && last.lang === s.lang) last.text += ' ' + s.text;
      else merged.push({ ...s, pauseAfter: 150 });
    });
    return M.say(merged, opts);
  };
  M.hush = () => {
    sayTok++;
    speakingNow = false;
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    if (M.clips) M.clips.stop();
    if (M.music) M.music.speaking(false);
  };

  /* ================= Stockage ================= */
  const safeGet = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch (e) {
      return null;
    }
  };
  const safeSet = (k, v) => (M.store ? M.store(k, v) : false);
  const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);

  /* ---- Réglages ---- */
  const SKEY = 'devoirs2e:settings:v1';
  const DEF_SETTINGS = { sound: true, autoRead: false, rate: 0.9 };
  const loadSettings = () => {
    const r = safeGet(SKEY);
    return Object.assign({}, DEF_SETTINGS, isObj(r) ? r : {});
  };
  let settings = loadSettings();
  M.settings = {
    get: (k) => settings[k],
    set(k, v) {
      settings[k] = v;
      safeSet(SKEY, settings);
      if (k === 'sound') M.sfx.on = !!v;
    },
  };
  M.sfx.on = settings.sound;

  /* ---- Données de l'utilisateur (ex. : liste de mots de la semaine) ---- */
  const UKEY = 'devoirs2e:user:v1';
  const loadU = () => {
    const r = safeGet(UKEY);
    if (!isObj(r)) return {};
    Object.keys(r).forEach((ns) => {
      if (!isObj(r[ns])) delete r[ns];
    });
    return r;
  };
  let U = loadU();
  const fixtures = {};
  M.userData = {
    get(ns, key, def) {
      const v = U[ns] && U[ns][key];
      if (v !== undefined) return v;
      if (fixtures[ns + '/' + key] !== undefined && M.userData.useFixtures) return fixtures[ns + '/' + key];
      return def;
    },
    set(ns, key, value) {
      (U[ns] = U[ns] || {})[key] = value;
      safeSet(UKEY, U);
    },
    remove(ns, key) {
      if (U[ns]) {
        delete U[ns][key];
        safeSet(UKEY, U);
      }
    },
    exportAll: () => JSON.stringify(U),
    importAll(json) {
      const r = typeof json === 'string' ? JSON.parse(json) : json;
      if (!isObj(r)) throw new Error('données invalides');
      U = r;
      safeSet(UKEY, U);
    },
    /** Valeur d'essai utilisée par tools/check-skills.js (aucun effet dans le navigateur). */
    fixture(ns, key, value) {
      fixtures[ns + '/' + key] = value;
    },
    useFixtures: false,
  };

  // Autre onglet : on relit réglages et données du parent.
  if (typeof window.addEventListener === 'function')
    window.addEventListener('storage', (e) => {
      if (e.key === SKEY || e.key === null) {
        settings = loadSettings();
        M.sfx.on = settings.sound;
      }
      if (e.key === UKEY || e.key === null) U = loadU();
    });

  /* ---- Sauvegarde complète (page Parents) : toutes les clés « devoirs2e:* » dans un seul fichier JSON ---- */
  const BACKUP_APP = 'devoirs-2e-annee';
  M.backup = {
    keys() {
      const out = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.indexOf(M.STORE_PREFIX) === 0) out.push(k);
        }
      } catch (e) {}
      return out.sort();
    },
    /** → objet JSON prêt à télécharger. */
    export() {
      const data = {};
      this.keys().forEach((k) => {
        const v = safeGet(k);
        if (isObj(v)) data[k] = v;
      });
      // valeurs en mémoire (déjà vérifiées) pour les clés connues
      data['devoirs2e:v1'] = M.progress.data();
      data[SKEY] = settings;
      data[UKEY] = U;
      return { app: BACKUP_APP, format: 1, exported: new Date().toISOString(), data };
    },
    /** Vérifie un fichier importé : { ok:true, data, summary } ou { ok:false, error }. */
    check(obj) {
      if (!isObj(obj) || obj.app !== BACKUP_APP || !isObj(obj.data))
        return { ok: false, error: 'Ce fichier n’est pas une sauvegarde de « Mes devoirs ».' };
      const data = {};
      for (const k of Object.keys(obj.data)) {
        if (k.indexOf(M.STORE_PREFIX) !== 0) continue;
        let v = obj.data[k];
        if (k === 'devoirs2e:v1') {
          v = M.normalizeProgress(v);
          if (!v) return { ok: false, error: 'La progression du fichier est illisible.' };
        } else if (!isObj(v)) continue; // donnée secondaire illisible : ignorée
        data[k] = v;
      }
      if (!data['devoirs2e:v1']) return { ok: false, error: 'Le fichier ne contient pas de progression.' };
      const p = data['devoirs2e:v1'];
      return { ok: true, data, summary: { stars: p.stars, skills: Object.keys(p.skills).length, exported: obj.exported || '' } };
    },
    /** Remplace les données de cet appareil (après confirmation par l'appelant). */
    apply(data) {
      this.keys().forEach((k) => {
        if (!(k in data)) {
          try {
            localStorage.removeItem(k);
          } catch (e) {}
        }
      });
      return Object.keys(data).every((k) => safeSet(k, data[k]));
    },
  };

  /* ---- Outils pour les parents (affichés sur la page Parents) ---- */
  M.parentTools = [];
  /** def = { id, subject, title, icon, render(el) } */
  M.registerParentTool = (def) => {
    if (!M.parentTools.find((t) => t.id === def.id)) M.parentTools.push(def);
  };

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
    register(name, fn, emoji = '') {
      ART[name] = { fn, emoji };
    },
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
  const NAMES = [
    ['Léa', 'f'],
    ['Félix', 'm'],
    ['Florence', 'f'],
    ['Thomas', 'm'],
    ['Zoé', 'f'],
    ['William', 'm'],
    ['Rosalie', 'f'],
    ['Samuel', 'm'],
    ['Emma', 'f'],
    ['Olivier', 'm'],
    ['Alice', 'f'],
    ['Jacob', 'm'],
    ['Maëlle', 'f'],
    ['Nathan', 'm'],
    ['Charlotte', 'f'],
    ['Louis', 'm'],
    ['Amira', 'f'],
    ['Mamadou', 'm'],
    ['Mei', 'f'],
    ['Antoine', 'm'],
    ['Jade', 'f'],
    ['Arnaud', 'm'],
    ['Inès', 'f'],
    ['Malik', 'm'],
  ];
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
  /* ---- Élision et contraction ----
     el(petit, mot) : de, que, ne, le, la, je, me, te, se, ce, jusque, lorsque, puisque → d', qu', n', l', j'… devant une voyelle
     ou un h muet, aussi devant un nom propre (« d'Amira », « qu'Amira »); si + il(s) → s'il(s). Pas d'élision devant un h aspiré
     (le hibou, de hockey) ni devant onze, oui, ouaouaron, yogourt… Contraction : de + le → du, de + les → des, à + le → au, à + les → aux. */
  const H_ASPIRE = new Set(
    (
      'haricot haricots hibou hiboux hockey homard homards héros hamac hache haut haute hauteur honte hutte hérisson ' +
      'hérissons hamster hamsters hâte hall halte hamburger hangar hanche harpe hasard hausse hêtre hoquet houx huit huitième hurler hublot ' +
      'huard huards harfang hareng héron hotte houle housse hors hot-dog'
    ).split(' '),
  );
  const NO_ELIDE = new Set([
    'onze',
    'onzième',
    'oui',
    'ouistiti',
    'ouaouaron',
    'ouaouarons',
    'yogourt',
    'yaourt',
    'yoyo',
    'yo-yo',
    'yéti',
    'week-end',
  ]);
  const ELIDABLE = {
    de: "d'",
    que: "qu'",
    ne: "n'",
    le: "l'",
    la: "l'",
    je: "j'",
    me: "m'",
    te: "t'",
    se: "s'",
    ce: "c'",
    jusque: "jusqu'",
    lorsque: "lorsqu'",
    puisque: "puisqu'",
  };
  /** Le mot (ou nom propre) commence-t-il par une voyelle ou un h muet ? (balise HTML en tête ignorée) */
  const elides = (mot) => {
    const w = String(mot || '')
      .replace(/^\s*(<[^>]*>\s*)*/, '')
      .split(/[\s'’]/)[0]
      .toLocaleLowerCase('fr-CA');
    if (!w || NO_ELIDE.has(w)) return false;
    if (w.charAt(0) === 'h') return !H_ASPIRE.has(w) && !H_ASPIRE.has(w.split('-')[0]);
    return /^[aeiouàâäéèêëîïôöûüœæ]/.test(w);
  };
  const keepCase = (src, out) => (/^[A-ZÀ-Ý]/.test(src) ? out.charAt(0).toUpperCase() + out.slice(1) : out);
  /** el('de', 'Amira') → « d'Amira »; el('ne', 'mange') → « ne mange »; el('Je', 'aime') → « J'aime »; el('si', 'il') → « s'il ». */
  const el = (petit, mot) => {
    const p = String(petit),
      lp = p.toLocaleLowerCase('fr-CA'),
      m = String(mot).trim();
    if (lp === 'si') return /^ils?\b/i.test(m) ? keepCase(p, "s'") + m : p + ' ' + m;
    if (ELIDABLE[lp] && elides(m)) return keepCase(p, ELIDABLE[lp]) + m;
    return p + ' ' + m;
  };
  /** Préposition de / à + groupe du nom : contraction avec le / les, élision devant voyelle ou h muet. */
  const prep = (p, gn) => {
    const g = String(gn).trim(),
      m = /^(le|les)\s+(.+)$/.exec(g);
    if (m) {
      if (m[1] === 'le' && elides(m[2])) return p + " l'" + m[2]; // de + le arbre → de l'arbre
      return (p === 'de' ? (m[1] === 'le' ? 'du' : 'des') : m[1] === 'le' ? 'au' : 'aux') + ' ' + m[2];
    }
    const la = /^la\s+(.+)$/.exec(g);
    if (la && elides(la[1])) return p + " l'" + la[1];
    return p === 'de' ? el('de', g) : 'à ' + g;
  };
  M.fr = {
    /** « de pommes », « d'oranges », « d'Amira », « du chat » (de + le), « des amis » (de + les), « de l'arbre », « de hockey » */
    de: (mot) => prep('de', mot),
    /** « au parc » (à + le), « aux amis » (à + les), « à l'école », « à la plage », « à Laval » */
    a: (gn) => prep('à', gn),
    /** « que Léo » / « qu'Amira » */
    que: (mot) => el('que', mot),
    /** « ne mange » / « n'aime » / « n'habite » (→ « Il ne mange pas. ») */
    ne: (verbe) => el('ne', verbe),
    /** « je joue » / « j'aime » */
    je: (verbe) => el('je', verbe),
    /** Article défini : « le chat », « l'arbre », « le hibou »; la('école') → « l'école » */
    le: (nom) => el('le', nom),
    la: (nom) => el('la', nom),
    /** Élision générale : el('de'|'que'|'ne'|'le'|'la'|'je'|'me'|'te'|'se'|'ce'|'si'|'jusque'|'lorsque'|'puisque', mot) */
    el,
    /** true si le mot commence par une voyelle ou un h muet (h aspiré, onze, oui… → false). */
    elides,
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
    /** Première lettre en minuscule (« Le chat dort » → « le chat dort »), sauf devant un nom propre
        (prénoms de M.people, noms donnés en 2e argument, Papa/Maman gardent aussi leur majuscule s'ils y sont). */
    uncap(s, names = []) {
      const str = String(s),
        w = str.split(/[\s,.!?;:'’]/)[0];
      if (M.people.NAMES.some((x) => x[0] === w) || names.includes(w)) return str;
      return str.charAt(0).toLocaleLowerCase('fr-CA') + str.slice(1);
    },
  };
  /**
   * Typographie française, pour l'AFFICHAGE seulement (la voix lit toujours le texte d'origine; clés des clips inchangées) :
   * espace fine insécable U+202F avant ? ! ;  —  espace insécable U+00A0 avant : et à l'intérieur de « ».
   * Ne touche qu'au texte : jamais aux balises ni attributs, entités (&nbsp;), URL, <svg>, <style>, <script>, <code>,
   * ni aux passages en anglais (lang="en…"). Pas d'espace ajoutée dans 10:30, {?}, ?!. Idempotente.
   */
  const NNBSP = ' ',
    NBSP = ' ',
    SP = '[\\s\\u00A0\\u202F\\u2009]';
  const SKIP_TAGS = /^(svg|style|script|code|pre|math|textarea)$/;
  const RE_GUIL_O = new RegExp('«' + SP + '*', 'g'),
    RE_GUIL_F = new RegExp(SP + '*»', 'g'),
    RE_PUNCT = new RegExp('(' + SP + '*)([?!;:])', 'g');
  const typoText = (t, prev0) => {
    let prev = prev0;
    // zones protégées (indices impairs) : entités HTML, URL
    return String(t)
      .split(/(&[a-zA-Z][a-zA-Z0-9]*;|&#x?[0-9a-fA-F]+;|(?:https?:\/\/|www\.)\S+)/)
      .map((p, i) => {
        if (i % 2) {
          prev = p.slice(-1);
          return p;
        }
        if (!p) return p;
        const s = p
          .replace(RE_GUIL_O, '«' + NBSP)
          .replace(RE_GUIL_F, NBSP + '»')
          .replace(RE_PUNCT, (m, sp, c, off, str) => {
            const thin = c === ':' ? NBSP : NNBSP;
            const before = off > 0 ? str.charAt(off - 1) : prev;
            if (sp.length) return thin + c;
            const after = str.charAt(off + m.length);
            if (!before || !/[\p{L}\p{N}»)\]’'"…*]/u.test(before)) return c; // {?}, ?!, (?), début de texte
            if (c === ':' && /\d/.test(before) && /\d/.test(after)) return c; // 10:30
            if (after && !/[\s  ?!»)"'’.,…]/.test(after)) return c; // collé à un mot : a:b
            return thin + c;
          });
        prev = s.slice(-1);
        return s;
      })
      .join('');
  };
  M.typo = (s) => {
    const str = String(s ?? '');
    if (!/[?!:;«»]/.test(str)) return str;
    let skip = null,
      depth = 0,
      prev = '';
    return str
      .split(/(<\/?[a-zA-Z][^>]*>|<!--[\s\S]*?-->)/)
      .map((tk, i) => {
        if (i % 2) {
          const m = /^<(\/)?([a-zA-Z][\w-]*)/.exec(tk);
          if (!m) return tk;
          const close = !!m[1],
            name = m[2].toLowerCase(),
            selfClose = /\/>$/.test(tk);
          if (skip) {
            if (name === skip && !selfClose) depth += close ? -1 : 1;
            if (depth <= 0) skip = null;
          } else if (!close && !selfClose && (SKIP_TAGS.test(name) || /\slang\s*=\s*["']?en/i.test(tk))) {
            skip = name;
            depth = 1;
          }
          if (/^(br|p|div|li|tr|td|th|h\d|ul|ol)$/.test(name)) prev = '';
          return tk;
        }
        if (skip || !tk) return tk;
        const out = typoText(tk, prev);
        if (out) prev = out.slice(-1);
        return out;
      })
      .join('');
  };

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
    for (let i = 0; i < items.length; i++) {
      r -= w[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  };
  /** Participation aux cartes non notées (réflexion) — visible aux parents seulement. */
  M.progress.participate = (skillId) => {
    const d = P();
    d.participation = d.participation || {};
    d.participation[skillId] = (d.participation[skillId] || 0) + 1;
    M.save();
  };

  /* ================= Disponibilité des habiletés ================= */
  /** true si l'habileté peut être pratiquée, sinon une raison (texte). */
  M.skillStatus = (sk) => {
    for (const need of sk.needs || []) {
      const m = /^speech:(\w+)/.exec(need);
      if (!m) continue;
      const lang = m[1] === 'en' ? 'en-CA' : 'fr-CA';
      // sayTexts() : textes que l'habileté fera lire (ex. mots saisis par le parent, jamais enregistrés)
      let texts = null;
      try {
        texts = typeof sk.sayTexts === 'function' ? sk.sayTexts() : null;
      } catch (e) {
        texts = null;
      }
      const ok = texts && texts.length ? texts.every((t) => M.voices.has(lang, t)) : M.voices.has(lang);
      if (!ok)
        return m[1] === 'en'
          ? 'Il faut une voix anglaise sur cet appareil (voir Parents).'
          : 'Il faut une voix française sur cet appareil (voir Parents).';
    }
    if (sk.available) {
      const r = sk.available();
      if (r !== true) return r || "Pas disponible pour l'instant.";
    }
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
