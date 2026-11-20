/* =====================================================================
   core.js — utilitaires, progression, registre des habiletés, sessions
   Aucun module ES : tout est exposé sur window.M pour fonctionner en file://
   ===================================================================== */
(function () {
  'use strict';
  const M = (window.M = {});

  /* ---------- Utilitaires ---------- */
  M.$ = (s, r = document) => r.querySelector(s);
  M.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  M.rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  M.pick = (a) => a[Math.floor(Math.random() * a.length)];
  M.shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  M.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  M.range = (a, b, s = 1) => {
    const r = [];
    for (let i = a; s > 0 ? i <= b : i >= b; i += s) r.push(i);
    return r;
  };
  /** Ajoute une feuille de style (pour le CSS propre à un domaine). */
  M.css = (str) => { const s = document.createElement('style'); s.textContent = str; document.head.appendChild(s); };
  M.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  M.text = (html) => {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent;
  };
  /** Accord simple : 0 et 1 au singulier (règle française). */
  M.plural = (n, sing, plur) => (Math.abs(n) >= 2 ? plur || sing + 's' : sing);
  /** Plusieurs choix numériques distincts autour d'une bonne réponse. */
  M.numChoices = (answer, n = 4, spread = 3, min = 0) => {
    const set = new Set([answer]);
    let guard = 0;
    while (set.size < n && guard++ < 200) {
      const v = answer + M.rnd(-spread, spread);
      if (v >= min) set.add(v);
    }
    return M.shuffle([...set]).map((v) => ({ label: String(v), value: v }));
  };

  /** Nombre en lettres (français, < 1000, orthographe traditionnelle). */
  const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const T = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  function below100(n) {
    if (n < 20) return U[n];
    const t = Math.floor(n / 10), u = n % 10;
    if (t === 7 || t === 9) {
      if (t === 7 && u === 1) return 'soixante et onze';
      return T[t] + '-' + U[10 + u];
    }
    if (u === 0) return t === 8 ? 'quatre-vingts' : T[t];
    if (u === 1 && t !== 8) return T[t] + ' et un';
    return T[t] + '-' + U[u];
  }
  M.frNum = function (n) {
    if (n < 100) return below100(n);
    if (n >= 1000) return n === 1000 ? 'mille' : String(n);
    const h = Math.floor(n / 100), r = n % 100;
    const pre = h === 1 ? 'cent' : U[h] + ' cent' + (r === 0 ? 's' : '');
    return r ? pre + ' ' + below100(r) : pre;
  };

  /* ---------- Son ---------- */
  let actx;
  const audioCtx = () => (actx = actx || new (window.AudioContext || window.webkitAudioContext)());
  function tone(freqs, dur = 0.12, type = 'triangle', vol = 0.18) {
    try {
      audioCtx();
      if (actx.state === 'suspended') actx.resume();
      const t = actx.currentTime;
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur);
        g.gain.exponentialRampToValueAtTime(vol, t + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * dur + dur);
        o.connect(g).connect(actx.destination);
        o.start(t + i * dur);
        o.stop(t + i * dur + dur + 0.05);
      });
    } catch (e) {}
  }
  M.sfx = {
    on: true,
    tap() { this.on && tone([700], 0.06, 'sine', 0.08); },
    hop() { this.on && tone([500, 750], 0.06, 'sine', 0.1); },
    good() { this.on && tone([523, 659, 784, 1047], 0.11); },
    bad() { this.on && tone([300, 220], 0.16, 'sawtooth', 0.07); },
    pop() { this.on && tone([880], 0.05, 'square', 0.05); },
    tone,
    ctx: audioCtx,
  };

  /* Voix : voir services.js (M.say, M.voices) */

  /* ---------- Effets ---------- */
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  /** Pluie de confettis (Web Animations : chute avec dérive, rotation 3D et balancement). */
  M.confetti = function (n = 50) {
    if (reduced() || !document.body.animate) return;
    const colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#f78c40', '#9b5de5'];
    const W = window.innerWidth, H = window.innerHeight;
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.background = M.pick(colors);
      const shape = Math.random();
      c.style.borderRadius = shape < 0.35 ? '50%' : '3px';
      if (shape > 0.75) { c.style.width = '7px'; c.style.height = '20px'; }
      document.body.appendChild(c);
      const x0 = Math.random() * W, drift = (Math.random() - 0.5) * 260, sway = 30 + Math.random() * 50;
      const rx = 360 + Math.random() * 720, rz = (Math.random() - 0.5) * 900, dur = 1800 + Math.random() * 1600;
      const kf = [0, 0.25, 0.5, 0.75, 1].map((k) => ({
        transform: `translate(${x0 + drift * k + Math.sin(k * Math.PI * 3) * sway}px, ${-30 + (H + 60) * k}px) rotateX(${rx * k}deg) rotateZ(${rz * k}deg)`,
        opacity: k > 0.85 ? 0 : 1,
      }));
      const an = c.animate(kf, { duration: dur, delay: Math.random() * 350, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'both' });
      an.onfinish = () => c.remove();
      setTimeout(() => c.remove(), dur + 800);
    }
  };
  /** Étoile qui vole en arc jusqu'au compteur d'étoiles, avec une traînée scintillante. */
  M.flyStar = function (fromEl) {
    const target = M.$('#starsTotal');
    if (!fromEl || !target) return;
    const done = () => { M.updateStars(); target.classList.remove('pop'); void target.offsetWidth; target.classList.add('pop'); };
    const r = fromEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    if (reduced() || !document.body.animate) return done();
    const s = document.createElement('div');
    s.className = 'flystar';
    s.textContent = '⭐';
    document.body.appendChild(s);
    const x0 = r.left + r.width / 2 - 24, y0 = r.top, x1 = t.left + 4, y1 = t.top - 8;
    const cx = (x0 + x1) / 2 + 60, cy = Math.min(y0, y1) - 140; // point de contrôle : un bel arc vers le haut
    const pt = (k) => { const m = 1 - k; return [m * m * x0 + 2 * m * k * cx + k * k * x1, m * m * y0 + 2 * m * k * cy + k * k * y1]; };
    const N = 12, kf = [];
    for (let i = 0; i <= N; i++) {
      const k = i / N, [x, y] = pt(k), sc = i === 0 ? 0.3 : 1.25 - 0.75 * k;
      kf.push({ transform: `translate(${x}px, ${y}px) scale(${sc}) rotate(${k * 360}deg)`, offset: k });
    }
    kf.splice(1, 0, { transform: `translate(${pt(0.06)[0]}px, ${pt(0.06)[1]}px) scale(1.5) rotate(20deg)`, offset: 0.06 });
    const dur = 900;
    s.animate(kf, { duration: dur, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' }).onfinish = () => { s.remove(); done(); };
    for (let j = 1; j <= 5; j++) {
      setTimeout(() => {
        const k = j / 6, [x, y] = pt(k), tr = document.createElement('div');
        tr.className = 'star-trail'; tr.textContent = '✨';
        document.body.appendChild(tr);
        tr.animate([{ transform: `translate(${x + 14}px, ${y + 14}px) scale(1)`, opacity: 1 }, { transform: `translate(${x + 14}px, ${y + 30}px) scale(.2)`, opacity: 0 }], { duration: 600, easing: 'ease-out', fill: 'forwards' }).onfinish = () => tr.remove();
      }, (dur * j) / 6);
    }
    setTimeout(() => { if (s.isConnected) { s.remove(); done(); } }, dur + 400);
  };
  M.BRAVO = ['Bravo !', 'Super !', 'Excellent !', 'Wow, bien joué !', 'Tu es un as !', 'Génial !', 'Champion !', 'Parfait !', 'Fantastique !', 'Bien raisonné !'];

  /* ---------- Stockage & progression ---------- */
  const KEY = 'devoirs2e:v1';
  const fresh = () => ({ skills: {}, stars: 0, days: {} });
  let P;
  try { P = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { P = fresh(); }
  M.save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };

  M.progress = {
    data: () => P,
    skill(id) { return P.skills[id] || (P.skills[id] = { hist: [], n: 0, ok: 0, last: 0 }); },
    record(id, ok) {
      const s = this.skill(id);
      s.hist.push(ok ? 1 : 0);
      if (s.hist.length > 20) s.hist.shift();
      s.n++;
      if (ok) { s.ok++; P.stars++; }
      s.last = Date.now();
      P.days[today()] = (P.days[today()] || 0) + 1;
      M.save();
    },
    /** 0 à 3 étoiles selon les 10 dernières réponses du premier coup. */
    mastery(id) {
      const s = P.skills[id];
      if (!s || !s.hist.length) return 0;
      const h = s.hist.slice(-10), acc = h.reduce((a, b) => a + b, 0) / h.length;
      if (h.length >= 10 && acc >= 0.9) return 3;
      if (h.length >= 6 && acc >= 0.75) return 2;
      if (h.length >= 3 && acc >= 0.5) return 1;
      return 0;
    },
    acc(id) {
      const s = P.skills[id];
      if (!s || !s.hist.length) return null;
      const h = s.hist.slice(-10);
      return h.reduce((a, b) => a + b, 0) / h.length;
    },
    daysSince(id) { const s = P.skills[id]; return s && s.last ? (Date.now() - s.last) / 864e5 : Infinity; },
    streak() {
      let n = 0;
      const d = new Date();
      if (!P.days[today()]) d.setDate(d.getDate() - 1);
      for (;;) {
        const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        if (!P.days[k]) break;
        n++;
        d.setDate(d.getDate() - 1);
      }
      return n;
    },
    reset() { P = fresh(); M.save(); M.updateStars(); },
  };
  M.updateStars = () => { const el = M.$('#starsTotal'); if (el) el.textContent = '⭐ ' + P.stars; };

  /* ---------- Registre : matières → domaines → habiletés ---------- */
  /** Matières. Les fichiers de chaque matière ajoutent les leurs avec M.registerSubject. */
  M.SUBJECTS = [];
  M.subjectById = {};
  /** def = { id, title, icon, color, soft, desc, order? } */
  M.registerSubject = (def) => {
    if (M.subjectById[def.id]) return;
    def.order = def.order ?? M.SUBJECTS.length;
    M.SUBJECTS.push(def);
    M.subjectById[def.id] = def;
  };
  M.DOMAINS = [];
  M.domainById = {};
  /** def = { id, subject, title, icon, color, soft, pda } */
  M.registerDomain = (def) => {
    if (M.domainById[def.id]) return;
    M.DOMAINS.push(def);
    M.domainById[def.id] = def;
  };
  M.subjectOf = (skillOrLearn) => { const d = M.domainById[skillOrLearn.domain]; return d ? d.subject : null; };
  M.skills = [];
  M.skillById = {};
  M.learns = [];
  M.learnById = {};
  /**
   * def = { id, domain, title, icon, desc, pda, learn?, order?, gen(ctx) }
   * gen({lvl}) → question (voir README.md)
   */
  M.registerSkill = (def) => {
    if (M.skillById[def.id]) console.warn('Habileté en double :', def.id);
    if (!M.domainById[def.domain]) console.warn('Domaine inconnu :', def.domain, def.id);
    def.order = def.order ?? M.skills.length;
    M.skills.push(def);
    M.skillById[def.id] = def;
  };
  /**
   * Empreinte d'une question : deux questions de même empreinte sont « la même question » pour l'enfant
   * (même consigne, même réponse, mêmes choix, mêmes sons), même si l'ordre des choix diffère.
   * Les id générés (SVG) sont retirés pour ne pas rendre deux questions identiques « différentes ».
   */
  M.qSig = (q) => {
    if (!q) return '';
    const txt = (h) => h.replace(/\s(id|href|clip-path|mask|filter)="[^"]*"/g, '').replace(/url\(#[^)]*\)/g, '').replace(/\s+/g, ' ').trim();
    // Sérialisation canonique : fonctions (viz…) ignorées, listes d'objets triées (l'ordre mélangé ne compte pas),
    // listes simples gardées dans l'ordre (ex. une réponse « 3, 1, 2 »).
    const canon = (v, depth = 0) => {
      if (depth > 8 || v == null || typeof v === 'function') return null;
      if (typeof v === 'string') return txt(v);
      if (typeof v !== 'object') return v;
      if (Array.isArray(v)) {
        const a = v.map((x) => canon(x, depth + 1));
        return v.some((x) => x && typeof x === 'object') ? a.map((x) => JSON.stringify(x)).sort() : a;
      }
      const o = {};
      Object.keys(v).sort().forEach((k) => { if (k !== 'hint' && typeof v[k] !== 'function') o[k] = canon(v[k], depth + 1); });
      return o;
    };
    return JSON.stringify(canon(q));
  };
  /**
   * Génère une question dont l'empreinte n'est PAS dans seen (Set), l'y ajoute et la retourne;
   * null si `tries` essais ne donnent que des questions déjà vues (habileté à peu de questions : à l'appelant de décider).
   * avoid (Set, facultatif) : à éviter si possible (ex. la série précédente), sans garantie.
   */
  M.genUnique = (make, seen, { avoid = null, tries = 40 } = {}) => {
    let fallback = null;
    for (let k = 0; k < tries; k++) {
      const q = make(), s = M.qSig(q);
      if (seen.has(s)) continue;
      if (avoid && avoid.has(s)) { if (!fallback) fallback = [q, s]; continue; }
      seen.add(s);
      return q;
    }
    if (fallback) { seen.add(fallback[1]); return fallback[0]; }
    return null;
  };
  /** def = { id, domain, title, icon, intro, render(el) } */
  M.registerLearn = (def) => {
    def.order = def.order ?? M.learns.length;
    M.learns.push(def);
    M.learnById[def.id] = def;
  };

  /* ---------- Nettoyage entre les pages ---------- */
  const cleanups = [];
  M.onCleanup = (fn) => cleanups.push(fn);
  M.cleanup = () => { while (cleanups.length) { try { cleanups.pop()(); } catch (e) {} } M.hush(); };

  /* ---------- Révision espacée ---------- */
  /** Choisit des habiletés pour une révision entrelacée (questions mélangées). */
  M.reviewItems = function (count = 10, subject = null) {
    const all = (subject ? M.skills.filter((s) => M.subjectOf(s) === subject) : M.skills)
      .filter((s) => !s.enrichment && !s.ungraded && (!M.skillStatus || M.skillStatus(s) === true));
    if (!all.length) return [];
    const practiced = all.filter((s) => P.skills[s.id] && P.skills[s.id].n > 0);
    let pool;
    if (practiced.length < 3) {
      pool = M.shuffle(all.filter((s) => s.starter)).slice(0, 5);
      if (pool.length < 3) pool = M.shuffle(all).slice(0, 5);
    } else {
      // Priorité : faible maîtrise, puis pratique ancienne (révision espacée)
      const scored = practiced.map((s) => ({
        s,
        score: (3 - M.progress.mastery(s.id)) * 2 + Math.min(7, M.progress.daysSince(s.id)) + Math.random() * 1.5,
      }));
      scored.sort((a, b) => b.score - a.score);
      pool = scored.slice(0, 5).map((o) => o.s);
    }
    const items = [];
    for (let i = 0; i < count; i++) items.push(pool[i % pool.length].id);
    return M.shuffle(items);
  };

  M.starsHtml = (n) => `<span class="mstars" title="Maîtrise : ${n}/3">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`;
})();
