/* =====================================================================
   musique/learn/piano.js — « Le piano do-ré-mi » (mu-do-re-mi)
   1. Le piano : touches jouables (souris, doigt ou clavier de l'ordinateur), gamme qui monte / descend.
   2. Joue une chanson : écouter (les touches s'allument) ou « À toi ! » (la touche suivante brille).
   3. Vérifie ta compréhension.
   Chansons traditionnelles (domaine public).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  if (!MU) return;

  // [degré dans la gamme (0 = do), durée en temps]
  const SONGS = [
    {
      id: 'lune',
      title: '🌙 Au clair de la lune',
      notes: [
        [0, 1],
        [0, 1],
        [0, 1],
        [1, 1],
        [2, 2],
        [1, 2],
        [0, 1],
        [2, 1],
        [1, 1],
        [1, 1],
        [0, 3],
      ],
    },
    {
      id: 'jacques',
      title: '🔔 Frère Jacques',
      notes: [
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 1],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 1],
        [2, 1],
        [3, 1],
        [4, 2],
        [2, 1],
        [3, 1],
        [4, 2],
      ],
    },
    {
      id: 'maman',
      title: '⭐ Ah ! vous dirai-je, maman',
      notes: [
        [0, 1],
        [0, 1],
        [4, 1],
        [4, 1],
        [5, 1],
        [5, 1],
        [4, 2],
        [3, 1],
        [3, 1],
        [2, 1],
        [2, 1],
        [1, 1],
        [1, 1],
        [0, 2],
      ],
    },
  ];
  const SPB = 0.42;
  // clavier de l'ordinateur : rangée du milieu = touches blanches
  const KEYS = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72 };

  M.registerLearn({
    id: 'mu-l-piano',
    domain: 'mu-notes',
    title: 'Le piano do-ré-mi',
    icon: '🎹',
    short: 'La gamme, les touches et de petites chansons',
    intro:
      'Les notes ont des noms : <b>do, ré, mi, fa, sol, la, si</b>. Ensemble, elles font la <b>gamme</b>. Touche le piano pour les entendre, puis joue une chanson !',
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '🎹',
          title: '1. Le piano',
          intro: 'Touche les touches. Plus on va vers la <b>droite</b>, plus le son est <b>aigu</b>.',
          body: `<div class="mu-row mu-pno1"></div>
          <div class="row mu-row"><button class="btn primary mu-up">⬆️ La gamme qui monte</button><button class="btn mu-down">⬇️ La gamme qui descend</button></div>
          ${M.ui.callout('Pour trouver le <b>do</b> : il est juste à gauche des <b>deux</b> touches noires. Après, on compte : do, ré, mi, fa, sol, la, si… et ça recommence au do !', { tone: 'info', who: '💡' })}`,
        }) +
        M.ui.section({
          icon: '🎶',
          title: '2. Joue une chanson',
          intro: 'Choisis une chanson. Écoute-la, puis touche <b>À toi !</b> : la touche qui brille est la prochaine note.',
          body: `<div class="row mu-row mu-songs"></div><div class="mu-row mu-pno2"></div><div class="mu-song-notes"></div>
            <div class="row mu-row"><button class="btn mu-listen">▶ Écouter</button><button class="btn primary mu-play">🎹 À toi !</button></div><div class="callout blue mu-song-msg" hidden></div>`,
        }) +
        M.ui.section({ icon: '✅', title: '3. Vérifie ta compréhension', body: '<div class="mu-quiz"></div>' });
      const $ = (s) => M.$(s, el);
      const keyEl = (box, m) => box.querySelector(`.mu-key[data-midi="${m}"]`);
      const flash = (box, m, ms = 260) => {
        const k = keyEl(box, m);
        if (!k) return;
        k.classList.add('on');
        setTimeout(() => k.classList.remove('on'), ms);
      };
      const hit = (m) => MU.snd({ inst: 'piano', midi: m, vel: 0.75, dur: 0.6 });

      /** Rend un piano jouable dans box; onKey(midi) après chaque touche. */
      function piano(box, onKey) {
        box.innerHTML = MU.keyboardSvg(60, 72, { w: 46 });
        box.onpointerdown = (e) => {
          const k = e.target.closest('.mu-key');
          if (!k) return;
          e.preventDefault();
          const m = +k.dataset.midi;
          hit(m);
          flash(box, m);
          if (onKey) onKey(m);
        };
      }

      /* 1. piano libre + gammes */
      piano($('.mu-pno1'));
      const scale = (up) => {
        const ms = MU.seq(8).map((i) => MU.midiOf(up ? i : 7 - i));
        MU.play(
          ms.map((m, i) => ({ t: i * 0.38, inst: 'piano', midi: m, vel: 0.75, dur: 0.4 })),
          { onStep: (i) => flash($('.mu-pno1'), ms[i], 330) },
        );
      };
      $('.mu-up').onclick = () => scale(true);
      $('.mu-down').onclick = () => scale(false);

      /* 2. chansons */
      let song = SONGS[0],
        pos = -1;
      const box2 = $('.mu-pno2');
      const msg = (h) => {
        const m = $('.mu-song-msg');
        m.hidden = !h;
        m.innerHTML = h || '';
      };
      const drawNotes = () => {
        $('.mu-song-notes').innerHTML = song.notes
          .map(
            ([d], i) =>
              `<span class="mu-sn${i === pos ? ' cur' : ''}${pos >= 0 && i < pos ? ' done' : ''}" style="--c:${MU.noteCol(d)}">${MU.NOTES[d % 7]}</span>`,
          )
          .join('');
      };
      const glow = () => {
        M.$$('.mu-key', box2).forEach((k) => k.classList.remove('next'));
        if (pos >= 0 && pos < song.notes.length) {
          const k = keyEl(box2, MU.midiOf(song.notes[pos][0]));
          if (k) k.classList.add('next');
        }
        drawNotes();
      };
      piano(box2, (m) => {
        if (pos < 0) return;
        const want = MU.midiOf(song.notes[pos][0]);
        if (m !== want) {
          const k = keyEl(box2, m);
          if (k) {
            k.classList.add('oops');
            setTimeout(() => k.classList.remove('oops'), 300);
          }
          return;
        }
        pos++;
        if (pos >= song.notes.length) {
          pos = -1;
          glow();
          msg(`Bravo ! Tu as joué <b>${song.title.replace(/^\S+\s/, '')}</b> ! 🎉`);
          if (M.sfx && M.sfx.good) M.sfx.good();
          return;
        }
        glow();
      });
      $('.mu-songs').innerHTML = SONGS.map(
        (s, i) => `<button class="btn${i === 0 ? ' primary' : ''}" data-i="${i}">${s.title}</button>`,
      ).join('');
      $('.mu-songs').onclick = (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        song = SONGS[+b.dataset.i];
        pos = -1;
        msg('');
        M.$$('button', $('.mu-songs')).forEach((x) => x.classList.toggle('primary', x === b));
        MU.stop();
        glow();
      };
      $('.mu-listen').onclick = () => {
        pos = -1;
        msg('');
        glow();
        let t = 0;
        const evs = song.notes.map(([d, b]) => {
          const e = { t, inst: 'piano', midi: MU.midiOf(d), vel: 0.75, dur: b * SPB * 0.9 };
          t += b * SPB;
          return e;
        });
        const spans = () => M.$$('.mu-sn', $('.mu-song-notes'));
        MU.play(evs, {
          onStep: (i) => {
            flash(box2, evs[i].midi, Math.max(200, song.notes[i][1] * SPB * 800));
            spans().forEach((s, j) => s.classList.toggle('cur', j === i));
          },
        }).then(() => spans().forEach((s) => s.classList.remove('cur')));
      };
      $('.mu-play').onclick = () => {
        MU.stop();
        pos = 0;
        msg('Touche la touche qui brille ✨');
        glow();
      };
      glow();

      // clavier de l'ordinateur (A S D F G H J K = do ré mi fa sol la si do)
      const onKey = (e) => {
        if (!el.isConnected) {
          document.removeEventListener('keydown', onKey);
          return;
        }
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return;
        const m = KEYS[e.key.toLowerCase()];
        if (m == null) return;
        const box = pos >= 0 ? box2 : $('.mu-pno1');
        const k = keyEl(box, m);
        if (!k) return;
        k.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      };
      document.addEventListener('keydown', onKey);

      M.ui.miniQuiz($('.mu-quiz'), [
        () => M.skillById['mu-do-re-mi'].gen({ lvl: 0 }),
        () => M.skillById['mu-do-re-mi'].gen({ lvl: 1 }),
        () => M.skillById['mu-do-re-mi'].gen({ lvl: 1 }),
      ]);
    },
  });

  try {
    M.css(`
    .mu-pno1 .mu-kbd, .mu-pno2 .mu-kbd { width: 100%; max-width: 520px }
    .mu-song-notes { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin: 10px 0 }
    .mu-sn { min-width: 42px; padding: 4px 8px; border-radius: 999px; border: 2.5px solid var(--c); font-weight: 900; text-align: center; background: #fff; transition: all .15s }
    .mu-sn.cur { background: var(--c); color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.5); transform: scale(1.15) }
    .mu-sn.done { opacity: .45 }
    `);
  } catch (e) {}
})();
