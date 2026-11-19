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
  function tone(freqs, dur = 0.12, type = 'triangle', vol = 0.18) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
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
  };

  /* ---------- Voix (lecture à voix haute) ---------- */
  const voices = {};
  function loadVoice() {
    try {
      const vs = speechSynthesis.getVoices();
      voices.fr = vs.find((v) => v.lang === 'fr-CA') || vs.find((v) => v.lang && v.lang.startsWith('fr')) || null;
      voices.en = vs.find((v) => v.lang === 'en-CA') || vs.find((v) => v.lang === 'en-US') || vs.find((v) => v.lang && v.lang.startsWith('en')) || null;
    } catch (e) {}
  }
  try {
    if ('speechSynthesis' in window) {
      loadVoice();
      speechSynthesis.onvoiceschanged = loadVoice;
    }
  } catch (e) {}
  /**
   * Lit un texte. opts : { lang: 'fr-CA' (défaut) | 'en-CA', rate: 0.9, raw: false }
   * raw = true : ne pas transformer les symboles (+, =, −) en mots (dictées, anglais).
   */
  M.say = function (text, opts = {}) {
    try {
      if (!('speechSynthesis' in window) || !text) return;
      speechSynthesis.cancel();
      const lang = opts.lang || 'fr-CA';
      let t = String(text);
      if (!opts.raw && lang.startsWith('fr')) {
        t = t.replace(/\s−\s|\s-\s/g, ' moins ')
          .replace(/\+/g, ' plus ')
          .replace(/=/g, ' égale ')
          .replace(/×/g, ' fois ')
          .replace(/÷/g, ' divisé par ')
          .replace(/[▢□]/g, ' combien ');
      }
      const u = new SpeechSynthesisUtterance(t);
      u.lang = lang;
      const v = voices[lang.slice(0, 2)];
      if (v) u.voice = v;
      u.rate = opts.rate || 0.9;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  M.hush = () => { try { speechSynthesis.cancel(); } catch (e) {} };

  /* ---------- Effets ---------- */
  M.confetti = function (n = 50) {
    const colors = ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#f78c40', '#9b5de5'];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = M.pick(colors);
      c.style.animationDuration = 1.2 + Math.random() * 1.4 + 's';
      c.style.animationDelay = Math.random() * 0.3 + 's';
      c.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 3000);
    }
  };
  M.flyStar = function (fromEl) {
    const target = M.$('#starsTotal');
    if (!fromEl || !target) return;
    const r = fromEl.getBoundingClientRect(), t = target.getBoundingClientRect();
    const s = document.createElement('div');
    s.className = 'flystar';
    s.textContent = '⭐';
    s.style.left = r.left + r.width / 2 - 24 + 'px';
    s.style.top = r.top + 'px';
    document.body.appendChild(s);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      s.style.left = t.left + 10 + 'px';
      s.style.top = t.top + 'px';
      s.style.fontSize = '1.3rem';
    }));
    setTimeout(() => { s.remove(); M.updateStars(); target.classList.remove('pop'); void target.offsetWidth; target.classList.add('pop'); }, 850);
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
    const all = subject ? M.skills.filter((s) => M.subjectOf(s) === subject) : M.skills;
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
