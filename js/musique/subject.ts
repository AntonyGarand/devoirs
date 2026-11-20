/* =====================================================================
   musique/subject.js — Musique (1er cycle, PFEQ Arts : Inventer, Interpréter, Apprécier)
   Matière + 4 domaines (docs/hld/musique.md) et aides partagées M.MU :
     M.MU.snd(ev)            un son : { inst, t?, midi?, dur?, vel? }  (Web Audio, rien à télécharger)
     M.MU.play(events, {onStep}) → Promise   suite de sons; M.MU.stop()
     M.MU.rhythm(pattern, {bpm, inst})       → events (ta = noire, titi = 2 croches, chut = soupir, taa = blanche)
     M.MU.rhythmSvg(pattern, {labels, hi})   → notation (noire, croches, soupir, blanche) en SVG
     M.MU.player(el, items, {autoplay})      boutons « ▶ Son 1 / Son 2 » animés pendant l'écoute
     M.MU.color(i)                           couleur du son i (même couleur sur le bouton et dans les choix)
   Les générateurs gen() ne touchent jamais au DOM : les sons sont des données (q._mu), le visuel les joue.
   Pendant une page de musique, la musique d'ambiance se tait (app.js → M.music.hold).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = (M.MU = M.MU || {});

  M.registerSubject({
    id: 'musique',
    title: 'Musique',
    icon: '🎵',
    color: '#e85d9e',
    soft: '#fde6f1',
    desc: 'Fort ou doux, aigu ou grave, long ou court : écouter, jouer et inventer des rythmes.',
    /** Règles propres à la matière (tools/check-skills.js). */
    lint(q) {
      if (/[ÉE]coute/.test(q.prompt) && !q.viz && !q.audio) return "question d'écoute sans son (q.viz manquant)";
      if (q._mu && q._mu.items && q._mu.items.some((it) => !it.events || !it.events.length)) return 'son vide';
      const t = JSON.stringify([q.prompt, q.explain]);
      if (/aigu/.test(t) && /plus fort/.test(t) && !/doux/.test(t)) return 'ne pas confondre aigu (hauteur) et fort (intensité)';
    },
  });
  [
    {
      id: 'mu-sons',
      title: 'Les sons',
      icon: '🔊',
      color: '#e85d9e',
      soft: '#fde6f1',
      pda: 'Langage musical (A.1 intensité, A.2 durée, A.3 hauteur, A.5 qualité du son); représentation graphique (B.2 code non traditionnel)',
    },
    {
      id: 'mu-rythme',
      title: 'Rythme et tempo',
      icon: '🥁',
      color: '#f78c40',
      soft: '#ffe9d6',
      pda: 'Durée (A.2 noire, croches, silence); organisation rythmique (G.3 pulsation); tempo (G.2 lent, rapide); code traditionnel (B.1)',
    },
    {
      id: 'mu-sources',
      title: 'Instruments et sources sonores',
      icon: '🪇',
      color: '#118ab2',
      soft: '#dff3fb',
      pda: 'Sources sonores (C.1 voix et corps, C.2 instruments de percussion, C.3 objets de bois et de métal); timbre (A.4.a)',
    },
    {
      id: 'mu-notes',
      title: 'Do, ré, mi',
      icon: '🎹',
      color: '#9b5de5',
      soft: '#efe4fb',
      pda: 'Hauteur (A.3 noms des sons de la gamme : do, ré, mi…); organisation mélodique (G.4 sons ascendants, descendants)',
    },
    {
      id: 'mu-ecoute',
      title: 'Écouter et inventer',
      icon: '🎧',
      color: '#06a77d',
      soft: '#dcf7ee',
      pda: 'Structures (G.1 forme A-B, G.4 organisation mélodique); procédés de composition (F.a); compétence 3 « Apprécier »',
    },
  ].forEach((d) => M.registerDomain({ subject: 'musique', ...d }));

  /* ================================================================ synthèse */
  /** [0, 1, …, n-1] (M.range est inclusif à deux bornes). */
  MU.seq = (n) => Array.from({ length: n }, (_, i) => i);
  const COLORS = ['#3a86ff', '#f78c40', '#06a77d', '#9b5de5'];
  MU.color = (i) => COLORS[i % COLORS.length];
  MU.reduced = () => {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  };
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  let bus = null,
    live = [],
    tok = 0,
    noise = null;
  const C = () => (M.sfx && M.sfx.ctx ? M.sfx.ctx() : null);
  function out() {
    const c = C();
    if (!c) return null;
    if (M.sfx && M.sfx.wake) M.sfx.wake(); // 'suspended' ou 'interrupted' (iOS)
    else if (c.state !== 'running' && c.resume) c.resume();
    if (!bus) {
      bus = c.createGain();
      bus.gain.value = 0.8;
      bus.connect(c.destination);
      noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return c;
  }
  function track(n) {
    live.push(n);
    n.onended = () => {
      live = live.filter((x) => x !== n);
    };
  }
  /** Oscillateur avec enveloppe : attaque a, maintien jusqu'à t+hold, chute d. */
  function tone(c, t, { f, type = 'sine', a = 0.005, peak = 0.3, hold = 0, d = 0.3, dest = bus, vib = 0, glideTo = 0 }) {
    const o = c.createOscillator(),
      g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + a + hold + d * 0.6);
    if (vib) {
      const l = c.createOscillator(),
        lg = c.createGain();
      l.frequency.value = 5.2;
      lg.gain.value = f * vib;
      l.connect(lg).connect(o.frequency);
      l.start(t);
      l.stop(t + a + hold + d + 0.1);
      track(l);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
    if (hold) g.gain.setValueAtTime(Math.max(0.0002, peak), t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + a + hold + d + 0.05);
    track(o);
  }
  function burst(c, t, { lo = 0, hi = 0, bp = 0, q = 1, a = 0.002, peak = 0.3, hold = 0, d = 0.1 }) {
    const s = c.createBufferSource(),
      g = c.createGain();
    s.buffer = noise;
    s.loop = true; // le tampon fait 1 s : sans boucle, le souffle s'arrêtait avant le son
    let node = s;
    if (hi) {
      const f = c.createBiquadFilter();
      f.type = 'highpass';
      f.frequency.value = hi;
      node.connect(f);
      node = f;
    }
    if (lo) {
      const f = c.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = lo;
      node.connect(f);
      node = f;
    }
    if (bp) {
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = bp;
      f.Q.value = q;
      node.connect(f);
      node = f;
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    if (hold) g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
    node.connect(g).connect(bus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + a + hold + d + 0.05);
    track(s);
  }
  /** Instruments : (c, t, {midi, dur, vel}). vel de 0 à 1. */
  const INST = {
    piano: (c, t, { midi = 60, dur = 0.5, vel = 0.7 }) => {
      [
        [1, 0.32],
        [2, 0.12],
        [3, 0.05],
      ].forEach(([k, p]) => tone(c, t, { f: hz(midi) * k, type: 'triangle', peak: p * vel, d: Math.max(0.4, dur * 1.6) / k }));
    },
    xylo: (c, t, { midi = 72, vel = 0.7 }) => {
      tone(c, t, { f: hz(midi), peak: 0.38 * vel, d: 0.45 });
      tone(c, t, { f: hz(midi) * 4, peak: 0.12 * vel, d: 0.07 });
    },
    flute: (c, t, { midi = 72, dur = 0.5, vel = 0.7 }) => {
      tone(c, t, { f: hz(midi), a: 0.06, hold: Math.max(0, dur - 0.1), peak: 0.26 * vel, d: 0.12, vib: 0.006 });
      tone(c, t, { f: hz(midi) * 2, a: 0.06, hold: Math.max(0, dur - 0.1), peak: 0.04 * vel, d: 0.1 });
      burst(c, t, { bp: hz(midi) * 2, q: 2, a: 0.03, peak: 0.03 * vel, hold: Math.max(0, dur - 0.1), d: 0.1 });
    },
    tambour: (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 150, glideTo: 62, peak: 0.7 * vel, d: 0.35 });
      burst(c, t, { lo: 900, peak: 0.25 * vel, d: 0.08 });
    },
    'tambour-sourd': (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 120, glideTo: 70, peak: 0.6 * vel, d: 0.09 });
      burst(c, t, { lo: 600, peak: 0.2 * vel, d: 0.03 });
    },
    tambourin: (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 240, glideTo: 160, peak: 0.3 * vel, d: 0.08 });
      [0, 0.012, 0.03].forEach((o) => burst(c, t + o, { hi: 6500, bp: 9000, q: 3, peak: 0.25 * vel, d: 0.18 }));
    },
    triangle: (c, t, { vel = 0.7 }) => {
      [
        [1, 0.2, 2.6],
        [2.76, 0.08, 1.6],
        [5.4, 0.05, 0.9],
        [8.9, 0.03, 0.5],
      ].forEach(([k, p, d]) => tone(c, t, { f: 1250 * k, peak: p * vel, d }));
    },
    cymbale: (c, t, { vel = 0.7 }) => {
      burst(c, t, { hi: 5000, peak: 0.3 * vel, d: 2.2 });
      burst(c, t, { bp: 3200, q: 0.8, peak: 0.12 * vel, d: 1.4 });
    },
    claves: (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 2500, peak: 0.45 * vel, d: 0.05 });
      burst(c, t, { bp: 2500, q: 6, peak: 0.2 * vel, d: 0.02 });
    },
    woodblock: (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 820, peak: 0.5 * vel, d: 0.08 });
      tone(c, t, { f: 1320, peak: 0.2 * vel, d: 0.04 });
    },
    maracas: (c, t, { vel = 0.7 }) => {
      burst(c, t, { hi: 4500, a: 0.012, peak: 0.28 * vel, d: 0.07 });
    },
    grelots: (c, t, { vel = 0.7 }) => {
      [0, 0.02, 0.045, 0.07, 0.1].forEach((o, i) => tone(c, t + o, { f: 3200 + i * 410, peak: 0.07 * vel, d: 0.35 }));
      burst(c, t, { hi: 7000, peak: 0.08 * vel, d: 0.25 });
    },
    gong: (c, t, { vel = 0.7 }) => {
      [
        [1, 0.3, 3],
        [1.48, 0.15, 2.4],
        [2.1, 0.1, 1.8],
        [2.9, 0.06, 1.2],
      ].forEach(([k, p, d]) => tone(c, t, { f: 110 * k, peak: p * vel, d, a: 0.02 }));
    },
    mains: (c, t, { vel = 0.8 }) => {
      [0, 0.008, 0.017].forEach((o) => burst(c, t + o, { bp: 1300, q: 1.2, peak: 0.45 * vel, d: 0.04 }));
    },
    pieds: (c, t, { vel = 0.8 }) => {
      tone(c, t, { f: 95, glideTo: 50, peak: 0.6 * vel, d: 0.16 });
      burst(c, t, { lo: 400, peak: 0.25 * vel, d: 0.05 });
    },
    doigts: (c, t, { vel = 0.8 }) => {
      burst(c, t, { hi: 2000, bp: 2800, q: 3, peak: 0.55 * vel, d: 0.025 });
    },
    cuisses: (c, t, { vel = 0.8 }) => {
      burst(c, t, { lo: 900, peak: 0.45 * vel, d: 0.06 });
      tone(c, t, { f: 180, glideTo: 120, peak: 0.15 * vel, d: 0.05 });
    },
    clic: (c, t, { vel = 0.5 }) => {
      tone(c, t, { f: 1600, peak: 0.12 * vel, d: 0.03 });
    },
  };
  MU.INSTS = Object.keys(INST);

  /* ---- Vrais sons enregistrés (js/musique/samples.js, généré par tools/mu-samples.js; CC0 / domaine public).
     Chargés à la demande sur les pages de musique; tant qu'ils ne sont pas prêts, la synthèse ci-dessus prend le relais. */
  const SMP = {};
  const LEVEL = 0.75;
  const MIDI0 = { piano: 60, flute: 72, xylo: 72 };
  let loading = null;
  const b64 = (s) => {
    const bin = atob(s),
      u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u.buffer;
  };
  const decode = (c, s) =>
    new Promise((res) => {
      try {
        const p = c.decodeAudioData(
          b64(s),
          (b) => res(b),
          () => res(null),
        );
        if (p && p.catch) p.catch(() => res(null));
      } catch (e) {
        res(null);
      }
    });
  /** Début réel du son (le MP3 ajoute un court silence d'encodage selon le navigateur). */
  const onset = (b) => {
    const d = b.getChannelData(0);
    let pk = 0;
    const n = Math.min(d.length, b.sampleRate * 0.3);
    for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(d[i]));
    let i = 0;
    while (i < n && Math.abs(d[i]) < pk * 0.03) i++;
    return Math.max(0, i / b.sampleRate - 0.002);
  };
  MU.load = () => {
    if (loading) return loading;
    const c = C();
    if (!c || typeof document === 'undefined' || typeof atob !== 'function') return (loading = Promise.resolve(false));
    loading = new Promise((res) => {
      if (M.MU_SAMPLES) return res();
      const s = document.createElement('script');
      s.src = 'js/musique/samples.js';
      s.async = true;
      s.onload = s.onerror = () => res();
      document.head.appendChild(s);
    }).then(async () => {
      const S = M.MU_SAMPLES;
      if (!S) return false;
      await Promise.all(
        Object.keys(S).map(async (k) => {
          const d = S[k];
          if (d.zones) {
            const z = await Promise.all(
              d.zones.map(async (q) => {
                const buf = await decode(c, q.data);
                return buf && { midi: q.midi, buf, off: onset(buf) };
              }),
            );
            if (z.every(Boolean)) SMP[k] = { gain: d.gain, zones: z };
          } else {
            const buf = await decode(c, d.data);
            if (buf) SMP[k] = { gain: d.gain, buf, off: onset(buf) };
          }
        }),
      );
      M.MU_SAMPLES = null; // le base64 n'est plus utile
      return true;
    });
    return loading;
  };
  MU.realSounds = () => Object.keys(SMP).length > 0;
  function playBuf(c, t, buf, off, { rate = 1, gain = 1, dur = 0, rel = 0.3 }) {
    const s = c.createBufferSource(),
      g = c.createGain();
    s.buffer = buf;
    s.playbackRate.value = rate;
    g.gain.setValueAtTime(gain, t);
    s.connect(g).connect(bus);
    const len = (buf.duration - off) / rate;
    s.start(t, off);
    if (dur && dur + rel < len) {
      g.gain.setValueAtTime(gain, t + dur);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
      s.stop(t + dur + rel + 0.03);
    }
    track(s);
  }
  /** Joue l'événement avec un vrai son s'il est prêt. Hauteur : zone la plus proche + playbackRate. */
  function sampled(c, t, ev) {
    const d = SMP[ev.inst];
    if (!d) return false;
    const gain = d.gain * (ev.vel ?? 0.75) * LEVEL;
    if (!d.zones) {
      playBuf(c, t, d.buf, d.off, { gain });
      return true;
    }
    const midi = ev.midi ?? MIDI0[ev.inst] ?? 60;
    let z = d.zones[0];
    for (const q of d.zones) if (Math.abs(q.midi - midi) < Math.abs(z.midi - midi)) z = q;
    const dur = ev.inst === 'flute' ? (ev.dur ?? 0.5) : ev.inst === 'piano' ? Math.max(0.35, (ev.dur ?? 0.5) * 1.6) : 0;
    playBuf(c, t, z.buf, z.off, { rate: Math.pow(2, (midi - z.midi) / 12), gain, dur, rel: ev.inst === 'flute' ? 0.08 : 0.35 });
    return true;
  }
  const fire = (c, t, ev) => {
    if (!sampled(c, t, ev) && INST[ev.inst]) INST[ev.inst](c, t, ev);
  };
  MU.snd = (ev, at) => {
    const c = out();
    if (!c || !INST[ev.inst]) return;
    MU.load();
    fire(c, at ?? c.currentTime + 0.02, ev);
  };
  MU.stop = () => {
    tok++;
    live.forEach((n) => {
      try {
        n.stop();
      } catch (e) {}
    });
    live = [];
  };
  /** Joue une suite d'événements {t, inst, midi, dur, vel}. onStep(i) au moment où chaque son commence. */
  MU.play = (events, { onStep } = {}) => {
    MU.stop();
    if (M.hush) M.hush();
    const c = out();
    const my = ++tok;
    if (!c) return Promise.resolve(false);
    const go = () => {
      if (my !== tok) return false;
      const t0 = c.currentTime + 0.08;
      events.forEach((ev, i) => {
        if (INST[ev.inst]) fire(c, t0 + (ev.t || 0), ev);
        if (onStep)
          setTimeout(
            () => {
              if (my === tok) onStep(i, ev);
            },
            ((ev.t || 0) + 0.08) * 1000,
          );
      });
      const end = events.reduce((m, e) => Math.max(m, (e.t || 0) + (e.dur || 0.3)), 0) + 0.25;
      return new Promise((res) => setTimeout(() => res(my === tok), end * 1000));
    };
    // premiers sons : on attend (au plus 1,5 s) que les vrais sons soient décodés
    return MU.realSounds() ? go() : Promise.race([MU.load(), new Promise((r) => setTimeout(r, 1500))]).then(go);
  };
  MU.dur = (events) => events.reduce((m, e) => Math.max(m, (e.t || 0) + (e.dur || 0.3)), 0);

  /* ================================================================ rythmes */
  MU.BEATS = { ta: [0], titi: [0, 0.5], chut: [], taa: [0] }; // taa = blanche (2 temps)
  MU.beatsOf = (p) => (p === 'taa' ? 2 : 1);
  /** Événements d'un rythme. countIn : 4 clics avant. */
  MU.rhythm = (pattern, { bpm = 90, inst = 'claves', countIn = false, pulse = false } = {}) => {
    const spb = 60 / bpm,
      ev = [];
    let beat = 0;
    if (countIn) {
      for (let i = 0; i < 4; i++) ev.push({ t: i * spb, inst: 'clic', vel: 0.6, cell: -1 });
      beat = 4;
    }
    pattern.forEach((p, ci) => {
      MU.BEATS[p].forEach((o) => ev.push({ t: (beat + o) * spb, inst, vel: 0.85, dur: p === 'taa' ? spb * 2 : spb / 2, cell: ci }));
      if (pulse) for (let b = 0; b < MU.beatsOf(p); b++) ev.push({ t: (beat + b) * spb, inst: 'clic', vel: 0.35, cell: ci });
      beat += MU.beatsOf(p);
    });
    return ev;
  };
  MU.SYL = { ta: 'ta', titi: 'ti-ti', chut: 'chut', taa: 'ta-a' };
  MU.NAME = { ta: 'noire', titi: 'deux croches', chut: 'soupir (silence)', taa: 'blanche' };

  /** Notation en SVG : une case par temps (la blanche en occupe 2). */
  MU.rhythmSvg = (pattern, { labels = true, hi = -1, w = 64, cls = '' } = {}) => {
    const total = pattern.reduce((s, p) => s + MU.beatsOf(p), 0);
    const H = labels ? 104 : 80,
      W = total * w + 8;
    const ink = '#2b2d42';
    const head = (x, y, hollow) =>
      `<ellipse cx="${x}" cy="${y}" rx="9" ry="6.6" transform="rotate(-22 ${x} ${y})" fill="${hollow ? '#fff' : ink}" stroke="${ink}" stroke-width="2.6"/>`;
    const stem = (x, y) => `<path d="M${x + 8} ${y - 2} V${y - 44}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
    let x = 4,
      body = '';
    pattern.forEach((p, i) => {
      const cw = MU.beatsOf(p) * w,
        cx = x + cw / 2,
        y = 62,
        on = i === hi;
      body += `<g class="mu-cell${on ? ' on' : ''}" data-i="${i}"><rect x="${x + 2}" y="4" width="${cw - 4}" height="${H - 8}" rx="12" fill="${on ? '#fff3c4' : '#fff'}" stroke="${on ? '#f4b400' : '#e3e6ef'}" stroke-width="2.5"/>`;
      if (p === 'ta') body += head(cx - 4, y) + stem(cx - 4, y);
      if (p === 'taa') body += head(cx - 4, y, true) + stem(cx - 4, y);
      if (p === 'titi')
        body +=
          head(cx - 18, y) +
          stem(cx - 18, y) +
          head(cx + 12, y) +
          stem(cx + 12, y) +
          `<path d="M${cx - 10} ${y - 46} H${cx + 20}" stroke="${ink}" stroke-width="7"/>`;
      if (p === 'chut')
        body += `<path d="M${cx - 6} ${y - 40} L${cx + 6} ${y - 27} L${cx - 4} ${y - 16} L${cx + 7} ${y - 3} C${cx - 6} ${y - 9} ${cx - 9} ${y + 2} ${cx} ${y + 10}" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      if (labels) body += `<text x="${cx}" y="${H - 12}" text-anchor="middle" class="mu-syl">${MU.SYL[p]}</text>`;
      body += '</g>';
      x += cw;
    });
    return `<svg class="mu-rhythm ${cls}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${pattern.map((p) => MU.SYL[p]).join(', ')}">${body}</svg>`;
  };

  /* ================================================================ lecteur */
  const wave = (col) =>
    `<svg viewBox="0 0 48 40" class="mu-spk" aria-hidden="true"><path d="M6 15 H14 L24 6 V34 L14 25 H6 Z" fill="${col}" stroke="#2b2d42" stroke-width="2.5" stroke-linejoin="round"/><path class="w1" d="M30 13 Q35 20 30 27" fill="none" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/><path class="w2" d="M35 8 Q43 20 35 32" fill="none" stroke="#2b2d42" stroke-width="3" stroke-linecap="round"/></svg>`;
  /**
   * Boutons d'écoute. items : [{ label, events, color?, fig? }] — fig : html montré sous le bouton (ex. notation).
   * opts.autoplay : joue tout à la suite une première fois (après un court délai). opts.onStep(itemIdx, evIdx, ev).
   */
  MU.player = (el, items, { autoplay = true, onStep, big = false } = {}) => {
    MU.load();
    el.innerHTML = `<div class="mu-player${big ? ' big' : ''}">${items.map((it, i) => `<div class="mu-pl-item"><button class="mu-pl-btn" data-i="${i}" style="--c:${it.color || MU.color(i)}" aria-label="Écouter ${M.esc(M.text ? M.text(it.label) : it.label)}">${wave(it.color || MU.color(i))}<b>${it.label}</b></button>${it.fig ? `<div class="mu-pl-fig">${it.fig}</div>` : ''}</div>`).join('')}</div>`;
    const btns = M.$$('.mu-pl-btn', el);
    let seq = 0;
    const playOne = async (i) => {
      const my = ++seq;
      btns.forEach((b) => b.classList.toggle('playing', +b.dataset.i === i));
      await MU.play(items[i].events, { onStep: onStep ? (k, ev) => onStep(i, k, ev) : null });
      if (my === seq) btns.forEach((b) => b.classList.remove('playing'));
      return my === seq;
    };
    btns.forEach((b) => (b.onclick = () => playOne(+b.dataset.i)));
    const playAll = async () => {
      for (let i = 0; i < items.length; i++) {
        if (!el.isConnected) return;
        if (!(await playOne(i))) return;
        await M.sleep(450);
      }
    };
    // Lecture automatique seulement quand le lecteur est visible (ex. mini-quiz en bas d'une page Apprendre).
    if (autoplay) {
      // Si une consigne est en train d'être lue (lecture automatique), on attend la fin de la voix :
      // jouer un son couperait la consigne (MU.play → M.hush).
      const go = () => {
        const t0 = Date.now();
        const wait = () => {
          if (!el.isConnected) return;
          if (M.isSpeaking && M.isSpeaking() && Date.now() - t0 < 30000) return setTimeout(wait, 200);
          setTimeout(() => {
            if (el.isConnected && !(M.isSpeaking && M.isSpeaking())) playAll();
            else if (el.isConnected) wait();
          }, 450);
        };
        // 500 ms : laisse le temps à la lecture automatique de la consigne (300 ms) de commencer
        setTimeout(wait, 500);
      };
      if (typeof IntersectionObserver === 'function') {
        const io = new IntersectionObserver(
          (ents) => {
            if (ents.some((e) => e.isIntersecting)) {
              io.disconnect();
              go();
            }
          },
          { threshold: 0.6 },
        );
        io.observe(el);
        if (M.onCleanup) M.onCleanup(() => io.disconnect());
      } else go();
    }
    if (M.onCleanup) M.onCleanup(() => MU.stop());
    return { playOne, playAll };
  };
  /** Pastille de couleur + nom du son, pour les choix de réponse. */
  MU.tag = (i, label) => `<span class="mu-tag"><i style="background:${MU.color(i)}"></i>${label}</span>`;

  /* ================================================================ styles (préfixe mu-) */
  try {
    M.css(`
    .mu-player { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; padding: 6px 0 }
    .mu-pl-item { display: flex; flex-direction: column; align-items: center; gap: 6px }
    .mu-pl-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 104px; padding: 10px 14px 8px; border-radius: 22px; border: 3px solid var(--c); background: #fff; box-shadow: 0 5px 0 var(--c); font: inherit; font-weight: 900; cursor: pointer; transition: transform var(--dur-1) var(--ease-spring), box-shadow var(--dur-1) }
    .mu-pl-btn:hover { transform: translateY(-2px) }
    .mu-pl-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--c) }
    .mu-pl-btn .mu-spk { width: 52px; height: 44px }
    .mu-player.big .mu-pl-btn { min-width: 150px } .mu-player.big .mu-spk { width: 72px; height: 60px }
    .mu-pl-btn .w1, .mu-pl-btn .w2 { opacity: .25; transition: opacity .2s }
    .mu-pl-btn.playing { background: #f3f6ff; background: color-mix(in srgb, var(--c) 14%, #fff) }
    .mu-pl-btn.playing .w1 { animation: mu-wave .6s ease-in-out infinite } .mu-pl-btn.playing .w2 { animation: mu-wave .6s ease-in-out .15s infinite }
    .mu-pl-btn.playing .mu-spk { animation: mu-bump .3s ease-in-out infinite alternate }
    @keyframes mu-wave { 0%, 100% { opacity: .2 } 50% { opacity: 1 } }
    @keyframes mu-bump { to { transform: scale(1.07) } }
    .mu-tag { display: inline-flex; align-items: center; gap: 8px; font-weight: 800 }
    .mu-tag i { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid #2b2d42; flex: none }
    .mu-rhythm { max-width: 100%; height: auto; display: block; margin: 0 auto }
    .mu-rhythm .mu-syl { font: 800 15px var(--font, sans-serif); fill: #555b6e }
    .mu-rhythm .mu-cell rect { transition: fill .12s, stroke .12s }
    .mu-rhythm .mu-cell.on rect { fill: #fff3c4; stroke: #f4b400 }
    .mu-rhythm .mu-cell.on { animation: mu-bump .14s ease-out 1 alternate }
    .mu-choice-fig { display: block; margin: 0 auto; max-width: 100%; height: auto }
    .mu-big { font-size: 2.6rem; line-height: 1 }
    .mu-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: center }
    .mu-card { background: #fff; border: 3px solid var(--line); border-radius: 18px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 0 var(--line); font-weight: 800; cursor: pointer; font: inherit; min-width: 112px; transition: transform var(--dur-1) var(--ease-spring) }
    .mu-card:hover { transform: translateY(-2px) } .mu-card.on { border-color: #e85d9e; background: #fff3f8 }
    .mu-card.hit { animation: mu-hit .25s var(--ease-out) }
    @keyframes mu-hit { 40% { transform: scale(1.08) rotate(-3deg) } }
    .mu-card small { font-weight: 700; color: var(--muted) }
    .mu-gal { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 10px }
    .mu-fam { border-radius: 18px; padding: 10px; margin-top: 10px }
    .mu-fam h4 { margin: 0 0 8px }
    .mu-pad { width: 150px; height: 150px; border-radius: 50%; border: 5px solid #2b2d42; background: radial-gradient(circle at 40% 35%, #fff 0 18%, #f6e7c8 19% 60%, #e7cf9f 61%); box-shadow: 0 8px 0 #b0472b, inset 0 0 0 10px #d1495b; font: 900 1.1rem var(--font, sans-serif); cursor: pointer; touch-action: manipulation; user-select: none }
    .mu-pad:active, .mu-pad.hit { transform: translateY(5px) scale(.98); box-shadow: 0 3px 0 #b0472b, inset 0 0 0 10px #d1495b }
    .mu-beat-ball { width: 28px; height: 28px; border-radius: 50%; background: #e85d9e; border: 3px solid #2b2d42; margin: 0 auto }
    .mu-beat-ball.hop { animation: mu-hop var(--spb, .6s) ease-out 1 }
    @keyframes mu-hop { 0% { transform: translateY(0) scale(1.15, .85) } 35% { transform: translateY(-34px) } 100% { transform: translateY(0) } }
    .mu-cells { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap }
    .mu-cells button { padding: 0; border: 0; background: none; cursor: pointer }
    .mu-blocks { display: flex; gap: 6px; justify-content: center; margin: 8px 0 }
    .mu-blocks span { min-width: 64px; padding: 10px 0; text-align: center; border-radius: 14px; border: 3px solid #2b2d42; font-weight: 900; font-size: 1.3rem; transition: transform .15s }
    .mu-blocks span.on { transform: translateY(-6px) scale(1.06); box-shadow: 0 6px 0 rgba(0, 0, 0, .15) }
    .mu-code { display: flex; align-items: flex-end; gap: 10px; min-height: 80px; justify-content: center }
    .mu-code i { display: block; background: #2b2d42; border-radius: 999px }
    @media (prefers-reduced-motion: reduce) { .mu-pl-btn.playing .w1, .mu-pl-btn.playing .w2, .mu-pl-btn.playing .mu-spk, .mu-beat-ball.hop, .mu-card.hit { animation: none } .mu-pl-btn.playing .w1, .mu-pl-btn.playing .w2 { opacity: 1 } }
    `);
  } catch (e) {
    /* hors navigateur */
  }
})();
