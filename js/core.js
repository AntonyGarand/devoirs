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
  let frVoice = null;
  function loadVoice() {
    try {
      const vs = speechSynthesis.getVoices();
      frVoice = vs.find((v) => v.lang === 'fr-CA') || vs.find((v) => v.lang && v.lang.startsWith('fr')) || null;
    } catch (e) {}
  }
  try {
    if ('speechSynthesis' in window) {
      loadVoice();
      speechSynthesis.onvoiceschanged = loadVoice;
    }
  } catch (e) {}
  M.say = function (text) {
    try {
      if (!('speechSynthesis' in window) || !text) return;
      speechSynthesis.cancel();
      const t = String(text)
        .replace(/\s−\s|\s-\s/g, ' moins ')
        .replace(/\+/g, ' plus ')
        .replace(/=/g, ' égale ')
        .replace(/×/g, ' fois ')
        .replace(/÷/g, ' divisé par ')
        .replace(/[▢□]/g, ' combien ');
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'fr-CA';
      if (frVoice) u.voice = frVoice;
      u.rate = 0.9;
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

  /* ---------- Registre ---------- */
  M.DOMAINS = [
    { id: 'nombres', title: 'Les nombres', icon: '🔢', color: '#ef476f', soft: '#ffe1e8', pda: 'Arithmétique — Sens et écriture des nombres naturels (< 1000) et fractions' },
    { id: 'operations', title: 'Les opérations', icon: '➕', color: '#f78c40', soft: '#ffe9d6', pda: 'Arithmétique — Sens des opérations et opérations sur les nombres' },
    { id: 'geometrie', title: 'La géométrie', icon: '🔷', color: '#118ab2', soft: '#dff3fb', pda: 'Géométrie — Espace, solides, figures planes, frises' },
    { id: 'mesure', title: 'La mesure', icon: '📏', color: '#06a77d', soft: '#dcf7ee', pda: 'Mesure — Longueurs et temps' },
    { id: 'stats', title: 'Statistique et probabilité', icon: '📊', color: '#9b5de5', soft: '#efe4fb', pda: 'Statistique et Probabilité' },
  ];
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
  M.reviewItems = function (count = 10) {
    const practiced = M.skills.filter((s) => P.skills[s.id] && P.skills[s.id].n > 0);
    let pool;
    if (practiced.length < 3) {
      pool = M.shuffle(M.skills.filter((s) => s.starter)).slice(0, 5);
      if (pool.length < 3) pool = M.shuffle(M.skills).slice(0, 5);
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

  /* =====================================================================
     Session de questions
     Question = {
       prompt: html  (peut contenir {?} → case-réponse en ligne),
       say?: texte lu à voix haute,
       viz?: (el) => void            // visuel interactif
       showMe?: (el) => Promise|void // démonstration animée dans le même el
       input: 'number' | 'choice' | 'order',
       answer: nombre | valeur | [valeurs] (order),
       choices?: [{label, value}]    // choice / order
       unit?: 'cm'                   // suffixe pour number
       hint?: html, explain?: html
     }
     ===================================================================== */
  M.runSession = function (root, opts) {
    const items = opts.items.slice();
    const S = { i: 0, results: [], tok: 0 };
    root.innerHTML = `
      <div class="session">
        <div class="s-top">
          <a class="btn ghost" href="${opts.back || '#/'}">← Retour</a>
          <div class="progress"><i></i></div>
          <b class="s-count"></b>
        </div>
        <div class="card q-card">
          <div class="q-head"><span class="q-skill"></span></div>
          <div class="q-prompt-row"><div class="q-prompt"></div><button class="btn icon q-speak" title="Écouter">🔊</button></div>
          <div class="q-body">
            <div class="q-left"><div class="q-viz"></div><div class="q-tools"></div></div>
            <div class="q-right">
              <div class="q-input"></div>
              <div class="q-feedback"></div>
              <div class="q-explain"></div>
              <button class="btn primary big q-next" hidden>Suivant ➜</button>
            </div>
          </div>
        </div>
      </div>`;
    const el = (s) => M.$(s, root);
    const vizEl = el('.q-viz');

    function keyHandler(e) {
      if (!S.q) return;
      if (S.done) { if (e.key === 'Enter') { e.preventDefault(); next(); } return; }
      if (S.q.input === 'number') {
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === 'Backspace') press('del');
        else if (e.key === 'Enter') { e.preventDefault(); press('ok'); }
      } else if (S.q.input === 'choice' && /^[1-9]$/.test(e.key)) {
        const b = M.$$('.choice-btn', root)[+e.key - 1];
        if (b && !b.disabled) b.click();
      }
    }
    document.addEventListener('keydown', keyHandler);
    M.onCleanup(() => document.removeEventListener('keydown', keyHandler));

    el('.q-speak').onclick = () => M.say(S.q.say || M.text(S.q.prompt.replace('{?}', '▢')));
    el('.q-next').onclick = () => next();

    function show() {
      const id = items[S.i], sk = M.skillById[id];
      const lvl = Math.min(2, M.progress.mastery(id));
      let q;
      try { q = sk.gen({ lvl }); } catch (e) { console.error('gen', id, e); q = { prompt: 'Oups, une erreur. Passe à la suivante.', input: 'choice', answer: 1, choices: [{ label: 'OK', value: 1 }] }; }
      S.q = q; S.sk = sk; S.tries = 0; S.done = false; S.input = ''; S.tok++;
      el('.progress i').style.width = (S.i / items.length) * 100 + '%';
      el('.s-count').textContent = `${S.i + 1} / ${items.length}`;
      const dom = M.DOMAINS.find((d) => d.id === sk.domain) || {};
      el('.q-skill').innerHTML = `<span class="tag" style="background:${dom.soft};color:${dom.color}">${sk.icon || dom.icon} ${M.esc(sk.title)}</span>` + (sk.learn && M.learnById[sk.learn] ? ` <a class="learn-link" href="#/apprendre/${sk.learn}">📘 Apprendre</a>` : '');
      renderPrompt();
      el('.q-body').classList.toggle('noviz', !q.viz);
      mountViz();
      const tools = el('.q-tools');
      tools.innerHTML = (q.showMe ? '<button class="btn yellow q-show">👀 Montre-moi</button>' : '') + (q.viz ? '<button class="btn q-reset">↺ Effacer</button>' : '') + (q.hint ? '<button class="btn q-hint">💡 Indice</button>' : '');
      if (q.showMe) M.$('.q-show', tools).onclick = () => runShowMe();
      if (q.viz) M.$('.q-reset', tools).onclick = () => mountViz();
      if (q.hint) M.$('.q-hint', tools).onclick = () => { setFeedback('hint', '💡 ' + q.hint); };
      setFeedback('', q.input === 'number' ? 'Écris ta réponse 👇' : q.input === 'order' ? 'Touche dans le bon ordre 👇' : 'Choisis ta réponse 👇');
      el('.q-explain').innerHTML = '';
      el('.q-next').hidden = true;
      renderInput();
    }

    /* Chaque visuel est monté dans un nouvel élément enfant : les animations
       d'une question précédente (qui vérifient el.isConnected) s'arrêtent
       d'elles-mêmes et aucun gestionnaire de clic ne survit. */
    function mountViz() {
      vizEl.innerHTML = '';
      vizEl.onclick = null;
      S.vizInner = null;
      if (!S.q.viz) return;
      const inner = document.createElement('div');
      vizEl.appendChild(inner);
      S.vizInner = inner;
      try { S.q.viz(inner); } catch (e) { console.error('viz', S.sk.id, e); }
    }
    function runShowMe() {
      if (!S.q.showMe) return;
      try { return S.q.showMe(S.vizInner || vizEl); } catch (e) { console.error('showMe', S.sk.id, e); }
    }

    function renderPrompt() {
      if (!root.isConnected || !M.$('.q-prompt', root)) return;
      const q = S.q;
      const box = `<span class="ans-box${S.input ? ' filled' : ''}${S.done ? ' good' : ''}">${S.done && q.input === 'number' ? q.answer : S.input || '?'}</span>`;
      el('.q-prompt').innerHTML = q.prompt.includes('{?}') ? q.prompt.replace('{?}', box) : q.prompt;
      const inlineBox = q.prompt.includes('{?}');
      const solo = M.$('.solo-box', root);
      if (solo) solo.innerHTML = `${inlineBox ? '' : box}${q.unit ? `<span class="unit">${q.unit}</span>` : ''}`;
    }

    function renderInput() {
      const q = S.q, host = el('.q-input');
      if (q.input === 'number') {
        host.innerHTML = `<div class="solo-box"></div>
          <div class="pad">${['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((k) => `<button class="key" data-k="${k}">${k}</button>`).join('')}
          <button class="key del" data-k="del">⌫</button><button class="key" data-k="0">0</button><button class="key del" data-k="clr">✕</button>
          <button class="key ok" data-k="ok">✓ Vérifier</button></div>`;
        host.onclick = (e) => { const b = e.target.closest('.key'); if (b) press(b.dataset.k); };
        renderPrompt();
      } else if (q.input === 'choice') {
        const cols = q.cols || (q.choices.length <= 2 ? 2 : q.choices.length === 3 ? 3 : 2);
        host.innerHTML = `<div class="choices-grid" style="grid-template-columns:repeat(${cols},1fr)">${q.choices.map((c, i) => `<button class="choice-btn" data-i="${i}">${c.label}</button>`).join('')}</div>`;
        host.onclick = (e) => {
          const b = e.target.closest('.choice-btn');
          if (!b || S.done || b.disabled) return;
          const c = q.choices[+b.dataset.i];
          if (String(c.value) === String(q.answer)) { b.classList.add('right'); correct(b); }
          else { b.classList.add('wrong'); b.disabled = true; wrong(null, q.choices.length <= 2 ? 1 : 2); }
        };
      } else if (q.input === 'order') {
        S.order = [];
        const draw = () => {
          host.innerHTML = `<div class="order-slots">${q.choices.map((_, i) => `<span class="slot">${S.order[i] != null ? q.choices[S.order[i]].label : ''}</span>`).join('')}</div>
            <div class="choices-grid order" style="grid-template-columns:repeat(${Math.min(4, q.choices.length)},1fr)">${q.choices.map((c, i) => `<button class="choice-btn" data-i="${i}" ${S.order.includes(i) ? 'disabled' : ''}>${c.label}</button>`).join('')}</div>
            <button class="btn small-undo">↺ Recommencer</button>`;
        };
        draw();
        host.onclick = (e) => {
          if (S.done) return;
          if (e.target.closest('.small-undo')) { S.order = []; draw(); return; }
          const b = e.target.closest('.choice-btn');
          if (!b || b.disabled) return;
          S.order.push(+b.dataset.i);
          M.sfx.tap();
          draw();
          if (S.order.length === q.choices.length) {
            const got = S.order.map((i) => String(q.choices[i].value));
            if (got.join('|') === q.answer.map(String).join('|')) correct(host);
            else { wrong(null, 2); if (!S.done) setTimeout(() => { S.order = []; draw(); }, 900); }
          }
        };
      }
    }

    function press(k) {
      if (S.done) return;
      if (k === 'ok') {
        if (S.input === '') { setFeedback('bad', 'Écris un nombre d\'abord 🙂'); return; }
        const v = +S.input;
        if (v === +S.q.answer) correct(el('.q-prompt'));
        else wrong(v, 2);
        return;
      }
      if (k === 'del') S.input = S.input.slice(0, -1);
      else if (k === 'clr') S.input = '';
      else if (S.input.length < 4) S.input = (S.input === '0' ? '' : S.input) + k;
      M.sfx.tap();
      renderPrompt();
    }

    function setFeedback(cls, html) {
      const f = el('.q-feedback');
      f.className = 'q-feedback ' + cls;
      f.innerHTML = html;
    }
    function answerLabel() {
      const q = S.q;
      if (q.input === 'number') return q.answer + (q.unit ? ' ' + q.unit : '');
      if (q.input === 'choice') { const c = q.choices.find((c) => String(c.value) === String(q.answer)); return c ? c.label : q.answer; }
      return q.answer.map((v) => { const c = q.choices.find((c) => String(c.value) === String(v)); return c ? c.label : v; }).join(' → ');
    }
    function finish(first) {
      S.done = true;
      M.progress.record(S.sk.id, first);
      S.results.push({ id: S.sk.id, first });
      if (S.q.explain) el('.q-explain').innerHTML = `<div class="callout">🦫 ${S.q.explain}</div>`;
      el('.q-next').hidden = false;
      el('.q-next').textContent = S.i === items.length - 1 ? 'Voir mes résultats 🏆' : 'Suivant ➜';
      M.$$('.key', root).forEach((k) => (k.disabled = true));
      M.$$('.choice-btn', root).forEach((k) => (k.disabled = true));
      renderPrompt();
    }
    function correct(fromEl) {
      const first = S.tries === 0;
      finish(first);
      const msg = M.pick(M.BRAVO);
      setFeedback('good', msg + (first ? ' ⭐' : ' 🎉'));
      M.sfx.good();
      M.confetti(first ? 50 : 20);
      M.say(msg);
      if (first) M.flyStar(fromEl || el('.q-prompt'));
    }
    function wrong(val, maxTries) {
      S.tries++;
      M.sfx.bad();
      const p = el('.q-prompt');
      p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
      if (S.tries >= maxTries) {
        finish(false);
        setFeedback('bad', `La bonne réponse : <b>${answerLabel()}</b>`);
        runShowMe();
      } else {
        let msg = 'Pas tout à fait… Essaie encore 💪';
        if (val != null && typeof S.q.answer === 'number') msg = (val > S.q.answer ? 'C\'est un peu trop grand.' : 'C\'est un peu trop petit.') + ' Essaie encore 💪';
        if (S.q.hint) msg += `<div class="hint-text">💡 ${S.q.hint}</div>`;
        setFeedback('bad', msg);
        S.input = '';
        const tok = S.tok;
        setTimeout(() => { if (tok === S.tok && !S.done) renderPrompt(); }, 400);
      }
    }
    function next() {
      if (S.i < items.length - 1) { S.i++; show(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else end();
    }
    function end() {
      const first = S.results.filter((r) => r.first).length, n = items.length;
      const bySkill = {};
      S.results.forEach((r) => { (bySkill[r.id] = bySkill[r.id] || { ok: 0, n: 0 }).n++; if (r.first) bySkill[r.id].ok++; });
      root.innerHTML = `<div class="card end">
        <div class="trophy">${first === n ? '🏆' : first >= n * 0.7 ? '🥇' : '🌱'}</div>
        <h2>${first === n ? 'PARFAIT ! 🎉' : first >= n * 0.7 ? 'Bravo, super travail !' : 'Beau travail, continue !'}</h2>
        <p class="lead">Tu as réussi <b>${first}</b> question${first > 1 ? 's' : ''} sur ${n} du premier coup.</p>
        <div class="end-stars">${'⭐'.repeat(first)}${'☆'.repeat(n - first)}</div>
        <div class="end-skills">${Object.entries(bySkill).map(([id, r]) => `<div class="end-skill"><span>${M.skillById[id].icon || ''} ${M.esc(M.skillById[id].title)}</span><span>${r.ok}/${r.n}</span>${M.starsHtml(M.progress.mastery(id))}</div>`).join('')}</div>
        <div class="row-center">
          <button class="btn primary big again">Encore ! 🔁</button>
          <a class="btn big" href="${opts.back || '#/'}">Tableau de bord</a>
        </div>
      </div>`;
      M.confetti();
      M.say(M.$('h2', root).textContent + ' ' + M.$('.lead', root).textContent);
      M.$('.again', root).onclick = () => M.runSession(root, { ...opts, items: opts.regen ? opts.regen() : M.shuffle(items) });
    }
    show();
  };

  M.starsHtml = (n) => `<span class="mstars" title="Maîtrise : ${n}/3">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`;
})();
