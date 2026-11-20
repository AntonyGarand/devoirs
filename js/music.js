/* =====================================================================
   music.js — musique d'ambiance générée en direct (Web Audio, aucun fichier)
     M.music.mood('jeu' | 'calme', subjectId?)  — appelé par le routeur
     M.music.toggle() / set(on) / volume(v)      — réglages 'music', 'musicVol'
     M.music.duck(level)                          — M.say baisse la musique pendant la voix
   Composition : progression d'accords de 8 mesures, nappe douce, basse, arpèges
   « marimba », petite mélodie de boîte à musique (motif de 2 mesures répété
   puis varié), shaker léger. Tonalité propre à chaque matière. Un générateur
   pseudo-aléatoire à graine rend chaque section différente mais cohérente.
   Démarre au premier toucher (règle des navigateurs). Coupée quand l'onglet est caché.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;

  const KEYS = { maths: 0, francais: 5, anglais: 7, univers: 2, sciences: 9 }; // demi-tons au-dessus de do
  const MOODS = {
    // degrés (0 = I) de 8 mesures; tempo; densités
    jeu: { bpm: 92, progs: [[0, 4, 5, 3, 0, 4, 3, 4], [0, 5, 3, 4, 0, 5, 1, 4], [3, 4, 0, 5, 3, 4, 0, 0]], arp: 0.85, mel: 0.75, shaker: true, bassBeats: [0, 2] },
    calme: { bpm: 72, progs: [[0, 3, 5, 4, 0, 3, 1, 4], [5, 3, 0, 4, 5, 3, 4, 4], [0, 2, 3, 0, 5, 3, 4, 0]], arp: 0.45, mel: 0.35, shaker: false, bassBeats: [0] },
  };
  const MAJOR = [0, 2, 4, 5, 7, 9, 11];
  const PENTA = [0, 2, 4, 7, 9];
  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  const chordOf = (deg) => [0, 2, 4].map((k) => MAJOR[(deg + k) % 7] + 12 * Math.floor((deg + k) / 7));

  let ctx = null, master = null, duckGain = null, verb = null, noiseBuf = null;
  let timer = null, nextT = 0, step = 0, bar = 0, section = 0;
  let mood = 'jeu', key = 0, prog = MOODS.jeu.progs[0], motif = null, seed = 1;
  let started = false, speaking = false, focusOn = false, held = false;
  const holds = new Set(); // raisons de silence : 'route' (pages Musique), 'q' (question de musique), …
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const S = () => M.settings;
  const enabled = () => !S() || S().get('music') !== false;
  const vol = () => { const v = S() && S().get('musicVol'); return typeof v === 'number' ? v : 0.5; };

  function ensure() {
    if (ctx) return true;
    let c;
    try { c = (M.sfx && M.sfx.ctx) ? M.sfx.ctx() : new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return false; }
    build(c);
    return true;
  }
  function build(c) {
    ctx = c;
    master = ctx.createGain(); master.gain.value = 0;
    duckGain = ctx.createGain(); duckGain.gain.value = 1;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
    // réverbération : réponse impulsionnelle de bruit qui décroît
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    verb.connect(wet).connect(lp);
    master.connect(lp); master.connect(verb);
    lp.connect(duckGain).connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  /* ---- instruments ---- */
  function env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function pad(notes, t, dur) {
    notes.forEach((n) => [-6, 6].forEach((cents) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = hz(n); o.detune.value = cents;
      f.type = 'lowpass'; f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.022, t + Math.min(1.2, dur * 0.4));
      g.gain.setValueAtTime(0.022, t + dur * 0.8);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.9);
      o.connect(f).connect(g).connect(master); o.start(t); o.stop(t + dur + 1);
    }));
  }
  function bass(n, t, d) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = hz(n);
    env(g, t, 0.02, 0.11, d);
    o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.1);
  }
  function mallet(n, t, v = 0.07) { // marimba : fondamentale + 4e harmonique très brève
    [[1, v, 0.5], [4, v * 0.35, 0.08]].forEach(([mul, peak, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(n) * mul;
      env(g, t, 0.005, peak, d);
      o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.05);
    });
  }
  function bell(n, t, v = 0.05) { // boîte à musique : partiels inharmoniques légers
    [[1, v, 1.4], [2.76, v * 0.3, 0.5], [5.4, v * 0.12, 0.25]].forEach(([mul, peak, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = hz(n) * mul;
      env(g, t, 0.004, peak, d);
      o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.05);
    });
  }
  function shaker(t, v) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 7000;
    env(g, t, 0.003, v, 0.05);
    s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + 0.1);
  }

  /* ---- composition ---- */
  function newMotif() {
    // 2 mesures de croches : notes de la gamme pentatonique, notes d'accord sur les temps forts
    const m = [];
    let deg = Math.floor(rnd() * 5);
    for (let i = 0; i < 16; i++) {
      const strong = i % 4 === 0;
      const play = strong ? rnd() < 0.85 : rnd() < 0.32;
      if (!play) { m.push(null); continue; }
      deg = Math.max(0, Math.min(9, deg + Math.round((rnd() - 0.5) * 3)));
      m.push(deg);
    }
    if (m.every((x) => x === null)) m[0] = 2;
    return m;
  }
  function newSection() {
    const md = MOODS[mood];
    prog = md.progs[Math.floor(rnd() * md.progs.length)];
    motif = newMotif();
    section++;
  }
  const melNote = (deg) => 72 + key + PENTA[deg % 5] + 12 * Math.floor(deg / 5);

  function scheduleStep(t) {
    const md = MOODS[mood];
    const spb = 60 / md.bpm, eighth = spb / 2;
    const s = step % 8; // croche dans la mesure
    const deg = prog[bar % 8];
    const chord = chordOf(deg).map((x) => x + key);
    if (s === 0) {
      pad(chord.map((x) => x + 60), t, spb * 4);
      if (bar % 8 === 0 && bar > 0 && rnd() < 0.5) bell(84 + key, t, 0.03);
    }
    if (s % 2 === 0 && md.bassBeats.includes(s / 2)) bass(36 + key + chordOf(deg)[0] % 12, t, spb * 1.6);
    // arpège
    const pat = [0, 1, 2, 1, 0, 2, 1, 2];
    if (rnd() < md.arp * (s % 2 === 0 ? 1 : 0.6)) mallet(chord[pat[s]] + 60 + (s >= 4 ? 12 : 0), t, 0.045 + (s === 0 ? 0.02 : 0));
    // mélodie : motif (A A' B A) — variation légère à la 2e reprise
    const half = bar % 2, phrase = Math.floor((bar % 8) / 2);
    const idx = half * 8 + s;
    let d = motif[idx];
    if (phrase === 2 && d !== null) d = Math.min(9, d + 2);
    if (phrase === 1 && s === 7) d = null;
    if (d !== null && rnd() < md.mel + 0.2) bell(melNote(d), t + (s % 2 ? eighth * 0.08 : 0), 0.04);
    if (md.shaker && s % 2 === 1) shaker(t + eighth * 0.12, 0.012);
    if (md.shaker && s % 2 === 0) shaker(t, 0.006);
    step++;
    if (step % 8 === 0) { bar++; if (bar % 8 === 0) newSection(); }
    return eighth;
  }

  function loop() {
    clearTimeout(timer); // jamais deux chaînes de minuteries
    timer = null;
    if (!ctx || !started) return;
    while (nextT < ctx.currentTime + 0.35) nextT += scheduleStep(nextT);
    timer = setTimeout(loop, 90);
  }
  function fade(to, sec = 1.2) {
    if (!ctx) return;
    const g = master.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(to, t + sec);
  }
  const level = () => 1.1 * vol();
  function applyDuck() {
    if (!ctx) return;
    const l = focusOn ? 0.06 : speaking ? 0.22 : 1;
    const g = duckGain.gain, t = ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(l, t + (l < 1 ? 0.25 : 1.4));
  }

  function resumeCtx() { try { if (ctx && ctx.state !== 'running' && ctx.resume) { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } } catch (e) {} }
  function start() {
    if (!enabled() || held || started || (typeof document !== 'undefined' && document.hidden) || !ensure()) return;
    resumeCtx();
    started = true;
    seed = 7 + key * 31 + (mood === 'calme' ? 1000 : 0);
    step = 0; bar = 0; newSection();
    nextT = ctx.currentTime + 0.1;
    loop();
    fade(level(), 2.5);
  }
  function stop(sec = 0.8) {
    if (!started) return;
    started = false;
    fade(0, sec);
    clearTimeout(timer);
  }

  M.music = {
    mood(m, subject) {
      const k = KEYS[subject] ?? 0;
      if (m === mood && k === key) return;
      const was = started;
      if (was) stop(0.6);
      mood = MOODS[m] ? m : 'jeu'; key = k;
      if (was) setTimeout(start, 650);
    },
    /**
     * Pages et questions de musique : l'ambiance se tait (elle brouillerait les sons à comparer).
     * reason : 'route' (routeur), 'q' (carte-question)… la musique reprend quand plus aucune raison ne la retient.
     */
    hold(on, reason = 'route') {
      if (on) holds.add(reason); else holds.delete(reason);
      const h = holds.size > 0;
      if (h === held) return;
      held = h;
      if (held) stop(0.5); else setTimeout(start, 300);
    },
    set(on) { S() && S().set('music', !!on); on ? start() : stop(); },
    toggle() { this.set(!enabled()); return enabled(); },
    on: enabled,
    volume(v) { S() && S().set('musicVol', v); if (started) fade(level(), 0.3); },
    /** Pendant la voix : musique à 20 %. */
    speaking(on) { speaking = !!on; applyDuck(); },
    /** Question d'écoute (dictée, « écoute et touche ») : musique presque muette. */
    focus(on) { focusOn = !!on; applyDuck(); },
    start,
    /** Rendu hors ligne (outil d'écoute) : tout est planifié d'avance dans un OfflineAudioContext. */
    render(offline, secs, m = 'jeu', subject) {
      mood = MOODS[m] ? m : 'jeu'; key = KEYS[subject] ?? 0;
      build(offline);
      master.gain.value = 1.1 * 0.5;
      seed = 7 + key * 31 + (mood === 'calme' ? 1000 : 0); step = 0; bar = 0; newSection();
      for (let t = 0.1; t < secs - 1.5;) t += scheduleStep(t);
      return offline.startRendering();
    },
  };

  // Les navigateurs exigent un geste de l'utilisateur avant de jouer du son.
  const kick = () => {
    if (M.sfx && M.sfx.wake) M.sfx.wake();
    else resumeCtx();
    if (enabled()) start();
  };
  if (typeof window.addEventListener !== 'function' || !document.addEventListener) return; // outils hors navigateur
  ['pointerdown', 'keydown'].forEach((ev) => window.addEventListener(ev, kick, { passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) { clearTimeout(timer); timer = null; ctx.suspend && ctx.suspend(); }
    else {
      resumeCtx();
      if (started) { nextT = ctx.currentTime + 0.1; loop(); }
    }
  });
})();
