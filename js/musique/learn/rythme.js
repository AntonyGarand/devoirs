/* =====================================================================
   musique/learn/rythme.js — « Ta, ti-ti, chut ! » (mu-vite-lent, mu-pulsation, mu-ta-titi)
   1. La pulsation et le tempo (balle qui saute, curseur lent ↔ rapide).
   2. Les trois rythmes (noire, croches, soupir).
   3. Invente ton rythme (compétence 1 « Inventer »).
   4. Le jeu de l'écho (compétence 2 « Interpréter ») : écoute, puis tape le rythme sur le tambour.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  if (!MU) return;
  const NEXT = { ta: 'titi', titi: 'chut', chut: 'ta' };

  M.registerLearn({
    id: 'mu-l-rythme', domain: 'mu-rythme', title: 'Ta, ti-ti, chut !', icon: '🥁',
    short: 'La pulsation, le tempo et les rythmes',
    intro: 'La musique a un cœur qui bat : la <b>pulsation</b>. Sur ce battement, on joue des <b>rythmes</b> : « ta », « ti-ti » et « chut ». Invente ton rythme, puis joue au jeu de l\'écho !',
    render(el) {
      el.innerHTML = M.ui.section({ icon: '💓', title: '1. La pulsation et le tempo', intro: 'La pulsation, c\'est le battement régulier de la musique, comme ton cœur. Le <b>tempo</b>, c\'est sa vitesse.',
        body: `<div class="mu-pulse"><div class="mu-pulse-stage"><div class="mu-beat-ball"></div><div class="mu-beat-floor"></div></div><div class="mu-ctrls"><div class="mu-tempo"></div><div class="row"><button class="btn primary mu-pulse-go">▶ Démarrer</button></div>
          ${M.ui.callout('Marche sur place avec la balle : un pas à chaque battement. C\'est facile quand c\'est <b>régulier</b> !', { tone: 'tip' })}</div></div>` })
        + M.ui.section({ icon: '🎶', title: '2. Trois rythmes à connaître', intro: 'Chaque case dure <b>un temps</b> (un battement). Touche une carte pour l\'entendre.', body: '<div class="mu-row mu-three"></div>' })
        + M.ui.section({ icon: '✨', title: '3. Invente ton rythme', intro: 'Touche une case pour la changer : ta → ti-ti → chut. Choisis un instrument, puis joue ton rythme !',
          body: `<div class="mu-comp"><div class="mu-cells mu-comp-cells"></div><div class="mu-row mu-comp-inst"></div>
            <div class="row" style="justify-content:center"><button class="btn primary big mu-comp-play">▶ Joue mon rythme</button><label class="btn"><input type="checkbox" class="mu-comp-pulse" checked> 💓 Avec la pulsation</label></div></div>` })
        + M.ui.section({ icon: '🔁', title: '4. Le jeu de l\'écho', intro: 'Écoute le rythme. Ensuite, tape-le sur le tambour (ou avec la barre d\'espace) !',
          body: `<div class="mu-echo"><div class="mu-echo-fig"></div><div class="row" style="justify-content:center"><button class="btn yellow mu-echo-new">🎲 Nouveau rythme</button><button class="btn mu-echo-listen">👂 Écouter</button><label class="btn"><input type="checkbox" class="mu-echo-show"> 👀 Voir les notes</label></div>
            <div class="mu-row"><button class="mu-pad" aria-label="Tambour : tape le rythme">Tape ici !</button></div><div class="callout mu-echo-fb">Touche 👂 Écouter pour commencer.</div></div>` })
        + M.ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="mu-quiz"></div>' });
      const $ = (s) => M.$(s, el);
      const alive = () => el.isConnected;

      /* 1. pulsation */
      let bpm = 96, running = false, timer = null;
      const ball = $('.mu-beat-ball');
      const beat = () => {
        if (!running || !alive()) { running = false; return; }
        MU.snd({ inst: 'woodblock', vel: 0.7 });
        ball.style.setProperty('--spb', (60 / bpm) + 's');
        ball.classList.remove('hop'); void ball.offsetWidth; ball.classList.add('hop');
        timer = setTimeout(beat, 60000 / bpm);
      };
      const setRun = (on) => { running = on; clearTimeout(timer); $('.mu-pulse-go').textContent = on ? '⏸ Arrêter' : '▶ Démarrer'; if (on) beat(); };
      $('.mu-pulse-go').onclick = () => setRun(!running);
      M.ui.slider($('.mu-tempo'), { label: '⏱️ Tempo', stops: [{ value: 60, icon: '🐢', label: 'Lent' }, { value: 96, icon: '🚶', label: 'Moyen' }, { value: 150, icon: '🐇', label: 'Rapide' }], value: 96, onChange: (v) => { bpm = v; if (!running) setRun(true); } });
      M.onCleanup(() => { running = false; clearTimeout(timer); });

      /* 2. trois rythmes */
      const THREE = [
        { k: 'ta', t: 'La <b>noire</b> : « ta »', d: 'un son sur un temps' },
        { k: 'titi', t: 'Deux <b>croches</b> : « ti-ti »', d: 'deux sons rapides sur un temps' },
        { k: 'chut', t: 'Le <b>soupir</b> : « chut »', d: 'un temps de silence' },
      ];
      $('.mu-three').innerHTML = THREE.map((x, i) => `<button class="mu-card" data-i="${i}">${MU.rhythmSvg([x.k, x.k], { w: 70 })}<span>${x.t}</span><small>${x.d}</small></button>`).join('');
      $('.mu-three').onclick = (e) => {
        const b = e.target.closest('.mu-card'); if (!b) return;
        const x = THREE[+b.dataset.i];
        const cells = M.$$('.mu-cell', b);
        MU.play(MU.rhythm([x.k, x.k, x.k, x.k], { bpm: 88, inst: 'claves', pulse: true }), { onStep: (k, ev) => cells.forEach((c, j) => c.classList.toggle('on', j === ev.cell % 2)) })
          .then(() => cells.forEach((c) => c.classList.remove('on')));
      };

      /* 3. composer */
      const comp = ['ta', 'titi', 'ta', 'chut'];
      let inst = 'claves';
      const INSTS = [['claves', '🥢 Bâtons'], ['tambour', '🥁 Tambour'], ['maracas', '🪇 Maracas'], ['triangle', '🔺 Triangle'], ['mains', '👏 Mains']];
      const drawComp = (hi = -1) => { $('.mu-comp-cells').innerHTML = comp.map((k, i) => `<button data-i="${i}" aria-label="Case ${i + 1} : ${MU.SYL[k]}">${MU.rhythmSvg([k], { hi: hi === i ? 0 : -1, w: 74 })}</button>`).join(''); };
      drawComp();
      $('.mu-comp-cells').onclick = (e) => {
        const b = e.target.closest('button'); if (!b) return;
        const i = +b.dataset.i; comp[i] = NEXT[comp[i]]; drawComp(i);
        MU.play(MU.rhythm([comp[i]], { bpm: 88, inst }));
      };
      $('.mu-comp-inst').innerHTML = INSTS.map(([id, l]) => `<button class="btn ${id === inst ? 'primary' : ''}" data-id="${id}">${l}</button>`).join('');
      $('.mu-comp-inst').onclick = (e) => { const b = e.target.closest('button'); if (!b) return; inst = b.dataset.id; M.$$('button', $('.mu-comp-inst')).forEach((x) => x.classList.toggle('primary', x === b)); MU.snd({ inst, vel: 0.8, dur: 0.5 }); };
      $('.mu-comp-play').onclick = () => {
        MU.play(MU.rhythm(comp, { bpm: 88, inst, pulse: $('.mu-comp-pulse').checked }), { onStep: (k, ev) => M.$$('.mu-comp-cells .mu-cell', el).forEach((c, j) => c.classList.toggle('on', j === ev.cell)) })
          .then(() => M.$$('.mu-comp-cells .mu-cell', el).forEach((c) => c.classList.remove('on')));
      };

      /* 4. jeu de l'écho */
      const BPM = 80, spb = 60 / BPM;
      let target = null, taps = [], listening = false, endTimer = null;
      const newRhythm = () => {
        let p;
        do { p = MU.seq(4).map(() => M.pick(['ta', 'ta', 'titi', 'chut'])); } while (p[0] === 'chut' || new Set(p).size < 2);
        target = p; taps = []; listening = false;
        $('.mu-echo-fig').innerHTML = $('.mu-echo-show').checked ? MU.rhythmSvg(p) : `<div class="mu-row" style="min-height:104px;font-size:2.4rem">❓ ❓ ❓ ❓</div>`;
        $('.mu-echo-fb').innerHTML = 'Touche 👂 Écouter, puis tape le rythme sur le tambour.';
      };
      const onsets = (p) => { const o = []; p.forEach((k, i) => MU.BEATS[k].forEach((b) => o.push(i + b))); return o; };
      const listen = async () => {
        if (!target) newRhythm();
        listening = false; taps = [];
        $('.mu-echo-fb').innerHTML = '👂 Écoute bien…';
        await MU.play(MU.rhythm(target, { bpm: BPM, inst: 'tambour', countIn: true }));
        if (!alive()) return;
        listening = true;
        $('.mu-echo-fb').innerHTML = '🥁 À toi ! Tape le rythme.';
      };
      const judge = () => {
        listening = false;
        const want = onsets(target);
        if (taps.length !== want.length) {
          $('.mu-echo-fb').innerHTML = `Tu as tapé <b>${taps.length}</b> fois. Le rythme a <b>${want.length}</b> sons. ${taps.length < want.length ? 'N\'oublie pas : « ti-ti », c\'est deux coups !' : 'Attention : « chut », c\'est un silence !'} Réécoute et essaie encore 💪`;
          M.sfx.bad();
          return;
        }
        // tempo de l'enfant : on étire le rythme pour qu'il commence et finisse avec ses coups
        const span = want[want.length - 1] - want[0];
        const s = span > 0 ? (taps[taps.length - 1] - taps[0]) / span : spb;
        const ok = want.every((w, i) => Math.abs((taps[i] - taps[0]) / s - (w - want[0])) <= 0.3);
        if (ok) {
          $('.mu-echo-fb').innerHTML = '🎉 Bravo ! Tu as répété le rythme parfaitement.';
          $('.mu-echo-fig').innerHTML = MU.rhythmSvg(target);
          M.sfx.good(); M.confetti(30);
        } else {
          $('.mu-echo-fb').innerHTML = 'Le bon nombre de coups 👍, mais pas tout à fait au bon moment. Dis « ta, ti-ti, chut » en tapant !';
        }
      };
      const hit = () => {
        const pad = $('.mu-pad');
        pad.classList.remove('hit'); void pad.offsetWidth; pad.classList.add('hit');
        MU.snd({ inst: 'tambour', vel: 0.9 });
        if (!listening) return;
        taps.push(performance.now() / 1000);
        clearTimeout(endTimer);
        const want = onsets(target).length;
        endTimer = setTimeout(judge, taps.length >= want ? 700 : 2200);
      };
      $('.mu-pad').addEventListener('pointerdown', (e) => { e.preventDefault(); hit(); });
      const key = (e) => { if (e.code === 'Space' && !e.repeat && document.activeElement && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && alive()) { e.preventDefault(); hit(); } };
      document.addEventListener('keydown', key);
      M.onCleanup(() => { document.removeEventListener('keydown', key); clearTimeout(endTimer); });
      $('.mu-echo-new').onclick = () => { newRhythm(); listen(); };
      $('.mu-echo-listen').onclick = listen;
      $('.mu-echo-show').onchange = () => { if (target) $('.mu-echo-fig').innerHTML = $('.mu-echo-show').checked ? MU.rhythmSvg(target) : `<div class="mu-row" style="min-height:104px;font-size:2.4rem">❓ ❓ ❓ ❓</div>`; };
      newRhythm();

      M.ui.miniQuiz($('.mu-quiz'), [
        () => M.skillById['mu-vite-lent'].gen({ lvl: 0 }),
        () => M.skillById['mu-pulsation'].gen({ lvl: 1 }),
        () => M.skillById['mu-ta-titi'].gen({ lvl: 0 }),
      ]);
    },
  });

  try {
    M.css(`
    .mu-pulse { display: grid; grid-template-columns: minmax(160px, 1fr) minmax(240px, 1.6fr); gap: 16px; align-items: center }
    @media (max-width: 680px) { .mu-pulse { grid-template-columns: 1fr } }
    .mu-pulse-stage { height: 120px; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; background: #fff6fb; border: 3px solid var(--line); border-radius: 18px; padding-bottom: 14px }
    .mu-pulse-stage .mu-beat-ball { width: 44px; height: 44px }
    .mu-beat-floor { width: 70%; height: 6px; border-radius: 3px; background: #e3e6ef; margin-top: 2px }
    .mu-ctrls { display: flex; flex-direction: column; gap: 10px }
    .mu-comp, .mu-echo { display: flex; flex-direction: column; gap: 12px }
    .mu-comp-cells svg { width: 82px; height: auto }
    .mu-comp-cells button:hover svg rect { stroke: #e85d9e }
    .mu-echo-fig { min-height: 104px; display: flex; justify-content: center }
    .mu-three .mu-card { max-width: 220px }
    `);
  } catch (e) {}
})();
