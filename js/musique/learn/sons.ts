/* =====================================================================
   musique/learn/sons.js — « Les secrets des sons » (mu-fort-doux, mu-aigu-grave, mu-long-court)
   1. Le son-jouet : 3 curseurs (doux ↔ fort, grave ↔ aigu, court ↔ long); le dessin du code change avec le son.
   2. Monter, descendre, se répéter.   3. Le code des sons (code non traditionnel, PDA B.2.a).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  if (!MU) return;

  M.registerLearn({
    id: 'mu-l-sons',
    domain: 'mu-sons',
    title: 'Les secrets des sons',
    icon: '🔊',
    short: 'Fort ou doux, aigu ou grave, long ou court',
    intro:
      'Chaque son a des secrets : il peut être <b>fort</b> ou <b>doux</b>, <b>aigu</b> ou <b>grave</b>, <b>long</b> ou <b>court</b>. Joue avec le son-jouet et écoute ce qui change !',
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '🎛️',
          title: '1. Le son-jouet',
          intro: 'Bouge un curseur, puis touche ▶. Regarde le dessin : il montre le son !',
          body: `<div class="mu-toy"><div class="mu-toy-fig"></div><div class="mu-toy-ctrls"><div class="mu-s-int"></div><div class="mu-s-hau"></div><div class="mu-s-dur"></div>
          <div class="row"><button class="btn primary big mu-toy-play">▶ Écouter le son</button></div><div class="callout blue mu-toy-txt"></div></div></div>
          ${M.ui.callout('Attention : <b>aigu</b> ne veut pas dire <b>fort</b> ! Un petit oiseau 🐦 peut chanter aigu et tout doucement. Un ours 🐻 peut grogner grave et très fort.', { tone: 'info', who: '💡' })}`,
        }) +
        M.ui.section({
          icon: '📈',
          title: '2. Monter, descendre, se répéter',
          intro: 'Touche une flèche : les sons montent comme un escalier, descendent comme une glissade ou restent sur place.',
          body: '<div class="mu-row mu-dirs"></div>',
        }) +
        M.ui.section({
          icon: '✏️',
          title: '3. Le code des sons',
          intro: "En musique, on peut <b>dessiner</b> les sons. Touche un dessin pour l'entendre.",
          body: '<div class="mu-gal mu-codes"></div>',
        }) +
        M.ui.section({ icon: '✅', title: '4. Vérifie ta compréhension', body: '<div class="mu-quiz"></div>' });
      // éléments rendus juste au-dessus (el.innerHTML) : jamais null
      const $ = <E extends Element = HTMLElement>(s: string) => M.$<E>(s, el)!;

      /* 1. son-jouet */
      const S = { int: 2, hau: 2, dur: 1 };
      const INT = [
        { value: 0, icon: '🐭', label: 'Très doux' },
        { value: 1, icon: '🤫', label: 'Doux' },
        { value: 2, icon: '🙂', label: 'Moyen' },
        { value: 3, icon: '📢', label: 'Fort' },
        { value: 4, icon: '🦁', label: 'Très fort' },
      ];
      const HAU = [
        { value: 0, icon: '🐻', label: 'Très grave' },
        { value: 1, icon: '🐘', label: 'Grave' },
        { value: 2, icon: '🙂', label: 'Moyen' },
        { value: 3, icon: '🐤', label: 'Aigu' },
        { value: 4, icon: '🐦', label: 'Très aigu' },
      ];
      const DUR = [
        { value: 0, icon: '·', label: 'Très court' },
        { value: 1, icon: '▬', label: 'Court' },
        { value: 2, icon: '▬▬', label: 'Long' },
        { value: 3, icon: '▬▬▬', label: 'Très long' },
      ];
      const VEL = [0.06, 0.18, 0.4, 0.7, 1],
        MIDI = [43, 52, 62, 74, 86],
        SEC = [0.09, 0.3, 1, 2];
      const draw = () => {
        // le son dessiné : longueur = durée, épaisseur = intensité, hauteur = hauteur
        const L = [0, 60, 130, 200][S.dur],
          T = 8 + S.int * 9,
          Y = 140 - S.hau * 27;
        const shape =
          S.dur === 0
            ? `<circle cx="120" cy="${Y}" r="${T / 2 + 3}" fill="#e85d9e" stroke="#2b2d42" stroke-width="3"/>`
            : `<rect x="${120 - L / 2}" y="${Y - T / 2}" width="${L}" height="${T}" rx="${T / 2}" fill="#e85d9e" stroke="#2b2d42" stroke-width="3"/>`;
        $('.mu-toy-fig').innerHTML =
          `<div class="mu-toy-stage"><svg class="mu-toy-svg" viewBox="0 0 240 170" aria-hidden="true"><text x="8" y="22" font-size="20">🐦</text><text x="8" y="160" font-size="20">🐻</text><path d="M36 20 V150" stroke="#e3c5d6" stroke-width="2" stroke-dasharray="4 5"/>${shape}</svg></div>`;
        $('.mu-toy-txt').innerHTML =
          `Un son <b>${INT[S.int].label.toLowerCase()}</b>, <b>${HAU[S.hau].label.toLowerCase()}</b> et <b>${DUR[S.dur].label.toLowerCase()}</b>.`;
      };
      const playToy = () => {
        const svg = $('.mu-toy-svg');
        if (svg) {
          svg.classList.remove('sing');
          void svg.getBoundingClientRect();
          svg.classList.add('sing');
        }
        MU.play([{ inst: 'flute', midi: MIDI[S.hau], vel: VEL[S.int], dur: SEC[S.dur] }]);
      };
      M.ui.slider($('.mu-s-int'), {
        label: '📢 Intensité',
        stops: INT,
        value: 2,
        onChange: (v) => {
          S.int = v;
          draw();
          playToy();
        },
      });
      M.ui.slider($('.mu-s-hau'), {
        label: '🎚️ Hauteur',
        stops: HAU,
        value: 2,
        onChange: (v) => {
          S.hau = v;
          draw();
          playToy();
        },
      });
      M.ui.slider($('.mu-s-dur'), {
        label: '⏱️ Durée',
        stops: DUR,
        value: 1,
        onChange: (v) => {
          S.dur = v;
          draw();
          playToy();
        },
      });
      $('.mu-toy-play').onclick = playToy;
      draw();

      /* 2. directions */
      const DIRS = [
        { id: 'monte', label: '⬆️ Ça monte', notes: [60, 62, 64, 65, 67, 69, 71, 72], dots: [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.85, 1] },
        {
          id: 'descend',
          label: '⬇️ Ça descend',
          notes: [72, 71, 69, 67, 65, 64, 62, 60],
          dots: [1, 0.85, 0.71, 0.57, 0.42, 0.28, 0.14, 0],
        },
        { id: 'pareil', label: '➡️ Ça se répète', notes: [67, 67, 67, 67, 67, 67, 67, 67], dots: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] },
      ];
      $('.mu-dirs').innerHTML = DIRS.map(
        (d, i) =>
          `<button class="mu-card" data-i="${i}">${MU.dotsSvg(d.dots, { w: 170, h: 90, cls: 'mu-dir-svg' })}<span>${d.label}</span></button>`,
      ).join('');
      $('.mu-dirs').onclick = (e) => {
        const b = M.closest(e, '.mu-card');
        if (!b) return;
        const d = DIRS[Number(b.dataset.i)];
        M.$$('.mu-card', $('.mu-dirs')).forEach((x) => x.classList.toggle('on', x === b));
        const dots = M.$$('circle', b);
        MU.play(
          d.notes.map((m, k) => ({ t: k * 0.28, inst: 'xylo', midi: m, vel: 0.7 })),
          { onStep: (k) => dots.forEach((c, j) => c.setAttribute('fill', j === k ? '#e85d9e' : '#2b2d42')) },
        ).then(() => dots.forEach((c) => c.setAttribute('fill', '#2b2d42')));
      };

      /* 3. code */
      const CODES: { t: string; parts: MuCodePart[]; ev: MuEvent[]; say?: string }[] = [
        { t: 'Son long', parts: [{ k: 'long' }], ev: [{ inst: 'flute', midi: 69, dur: 1.2 }] },
        { t: 'Son court', parts: [{ k: 'court' }], ev: [{ inst: 'flute', midi: 69, dur: 0.28 }] },
        { t: 'Très long', parts: [{ k: 'tres-long' }], ev: [{ inst: 'flute', midi: 69, dur: 2.2 }] },
        { t: 'Très court', parts: [{ k: 'tres-court' }], ev: [{ inst: 'flute', midi: 69, dur: 0.08 }] },
        { t: 'Silence', parts: [{ k: 'silence' }], ev: [], say: "Un silence : on n'entend rien… chut !" },
        { t: 'Fort', parts: [{ k: 'court', v: 1 }], ev: [{ inst: 'tambour', vel: 1 }] },
        { t: 'Doux', parts: [{ k: 'court', v: 0 }], ev: [{ inst: 'tambour', vel: 0.12 }] },
        { t: 'Aigu', parts: [{ k: 'court', y: 1 }], ev: [{ inst: 'piano', midi: 84, dur: 0.6 }] },
        { t: 'Grave', parts: [{ k: 'court', y: 0 }], ev: [{ inst: 'piano', midi: 43, dur: 0.6 }] },
      ];
      $('.mu-codes').innerHTML = CODES.map(
        (c, i) =>
          `<button class="mu-card" data-i="${i}">${MU.codeSvg(c.parts, { w: 150, h: 80, cls: 'mu-code-svg' })}<span>${c.t}</span></button>`,
      ).join('');
      $('.mu-codes').onclick = (e) => {
        const b = M.closest(e, '.mu-card');
        if (!b) return;
        const c = CODES[Number(b.dataset.i)];
        b.classList.remove('hit');
        void b.offsetWidth;
        b.classList.add('hit');
        if (c.say) M.say(c.say);
        else MU.play(c.ev.map((x) => ({ vel: 0.75, ...x })));
      };

      M.ui.miniQuiz($('.mu-quiz'), [
        () => M.skillById['mu-fort-doux'].gen({ lvl: 0 }),
        () => M.skillById['mu-aigu-grave'].gen({ lvl: 1 }),
        () => M.skillById['mu-long-court'].gen({ lvl: 1 }),
      ]);
    },
  });

  try {
    M.css(`
    .mu-toy { display: grid; grid-template-columns: minmax(220px, 1fr) minmax(240px, 1.2fr); gap: 16px; align-items: center }
    @media (max-width: 720px) { .mu-toy { grid-template-columns: 1fr } }
    .mu-toy-stage { background: linear-gradient(#fff6fb, #fde6f1); border: 3px solid var(--line); border-radius: 18px; padding: 10px; display: flex; justify-content: center }
    .mu-toy-svg { width: 100%; max-width: 340px; height: auto; overflow: visible }
    .mu-toy-svg rect, .mu-toy-svg circle { transform-box: fill-box; transform-origin: center; transition: all .35s var(--ease-spring) }
    .mu-toy-svg.sing rect, .mu-toy-svg.sing circle { animation: mu-sing .5s var(--ease-out) }
    @keyframes mu-sing { 30% { transform: scale(1.12, 1.4) } }
    .mu-toy-ctrls { display: flex; flex-direction: column; gap: 10px }
    .mu-dir-svg, .mu-code-svg { width: 100%; max-width: 170px; height: auto }
    `);
  } catch (e) {}
})();
