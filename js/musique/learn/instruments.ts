/* =====================================================================
   musique/learn/instruments.js — « Les instruments de la classe » (mu-instruments, mu-sec-resonnant, mu-voix-corps)
   1. Les instruments, rangés par matière (bois, métal, peau, graines) : toucher = entendre.
   2. Sec ou résonnant : on VOIT la vibration s'arrêter… ou continuer.
   3. Ton corps est un instrument (percussions corporelles) et ta voix.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const MU = M.MU;
  if (!MU) return;
  const FAM = [
    { id: 'bois', t: '🪵 En bois', soft: '#f6e7d4' },
    { id: 'metal', t: '🔩 En métal', soft: '#e7ecf3' },
    { id: 'peau', t: '🥁 Avec une peau tendue', soft: '#fde6f1' },
    { id: 'graines', t: '🌰 Avec des graines dedans', soft: '#eef7dc' },
  ];
  const evsOf = (x) =>
    x.id === 'xylophone'
      ? MU.tune(140, { inst: 'xylo', notes: [0, 2, 4, 7, 9, 7, 4, 0] })
      : x.id === 'maracas'
        ? [0, 0.22, 0.44, 0.55, 0.66].map((t) => ({ t, inst: 'maracas', vel: 0.8 }))
        : [{ inst: x.inst, vel: 0.85, dur: 1.5 }];

  M.registerLearn({
    id: 'mu-l-instruments',
    domain: 'mu-sources',
    title: 'Les instruments de la classe',
    icon: '🪇',
    short: 'Bois, métal, peau; sec ou résonnant; le corps et la voix',
    intro:
      'Dans la classe de musique, il y a des instruments de <b>percussion</b> : on les frappe, on les secoue ou on les gratte. Touche-les pour les entendre !',
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '🪇',
          title: '1. Les instruments de percussion',
          intro: 'Ils sont rangés selon ce qui fait le son. Touche un instrument.',
          body: `<div class="mu-fams"></div><div class="callout mu-inst-txt" style="margin-top:10px">Touche un instrument ☝️</div>`,
        }) +
        M.ui.section({
          icon: '〰️',
          title: '2. Sec ou résonnant ?',
          intro: "Après le coup, un son <b>sec</b> s'arrête tout de suite. Un son <b>résonnant</b> continue de vibrer. Regarde la ligne !",
          body: '<div class="mu-row mu-qual"></div>',
        }) +
        M.ui.section({
          icon: '👏',
          title: '3. Ton corps et ta voix sont des instruments',
          intro: "Pas besoin d'instrument pour faire de la musique ! Touche un geste, puis fais-le toi aussi.",
          body: `<div class="mu-row mu-body"></div>
            ${M.ui.callout('Ta <b>voix</b> peut <b>chanter</b> (une chanson, une comptine) ou faire des <b>effets vocaux</b> : le vent « chhhh », un chat « miaou », un tonnerre « boum ! ». Essaie !', { tone: 'tip' })}`,
        }) +
        M.ui.section({ icon: '✅', title: '4. Vérifie ta compréhension', body: '<div class="mu-quiz"></div>' });
      const $ = (s) => M.$(s, el);

      /* 1. familles */
      $('.mu-fams').innerHTML = FAM.map(
        (f) =>
          `<div class="mu-fam" style="background:${f.soft}"><h4>${f.t}</h4><div class="mu-gal">${MU.INSTRUMENTS.filter(
            (x) => x.matiere === f.id,
          )
            .map(
              (x) =>
                `<button class="mu-card" data-id="${x.id}">${M.art.html(x.art, { size: 76, alt: x.nom })}<span>${x.nom}</span><small>${x.qualite === 'sec' ? '✋ sec' : '〰️ résonnant'}</small></button>`,
            )
            .join('')}</div></div>`,
      ).join('');
      $('.mu-fams').onclick = (e) => {
        const b = e.target.closest('.mu-card');
        if (!b) return;
        const x = MU.instById[b.dataset.id];
        M.$$('.mu-card', $('.mu-fams')).forEach((c) => c.classList.toggle('on', c === b));
        b.classList.remove('hit');
        void b.offsetWidth;
        b.classList.add('hit');
        MU.play(evsOf(x));
        $('.mu-inst-txt').innerHTML =
          `<b>${x.le.replace(/^./, (c) => c.toUpperCase())}</b> : ${x.geste}. Son ${x.qualite === 'sec' ? '<b>sec</b>' : '<b>résonnant</b>'}.`;
      };

      /* 2. sec / résonnant */
      const QUAL = [
        { x: MU.instById.claves, t: '✋ Sec' },
        { x: MU.instById.triangle, t: '〰️ Résonnant' },
      ];
      const waveSvg = `<svg viewBox="0 0 200 60" class="mu-vib"><path pathLength="100" d="M0 30 ${Array.from({ length: 40 }, (_, i) => `L${5 + i * 5} ${30 + (i % 2 ? -1 : 1) * 22 * Math.pow(0.93, i)}`).join(' ')}" fill="none" stroke="#e85d9e" stroke-width="3" stroke-linejoin="round"/></svg>`;
      $('.mu-qual').innerHTML = QUAL.map(
        (q, i) =>
          `<button class="mu-card mu-qual-card" data-i="${i}" data-q="${q.x.qualite}">${M.art.html(q.x.art, { size: 64, alt: q.x.nom })}<span>${q.t} : ${q.x.nom}</span>${waveSvg}</button>`,
      ).join('');
      $('.mu-qual').onclick = (e) => {
        const b = e.target.closest('.mu-card');
        if (!b) return;
        const q = QUAL[+b.dataset.i];
        b.classList.remove('vib');
        void b.offsetWidth;
        b.classList.add('vib');
        MU.play([{ inst: q.x.inst, vel: 0.9, dur: 2 }]);
      };

      /* 3. corps */
      $('.mu-body').innerHTML =
        MU.CORPS.map(
          (c) => `<button class="mu-card" data-id="${c.id}"><span class="mu-big">${c.icon}</span><span>${c.nom}</span></button>`,
        ).join('') + `<button class="mu-card mu-body-rhythm"><span class="mu-big">👏🦶👏🫰</span><span>Un petit rythme</span></button>`;
      $('.mu-body').onclick = (e) => {
        const b = e.target.closest('.mu-card');
        if (!b) return;
        b.classList.remove('hit');
        void b.offsetWidth;
        b.classList.add('hit');
        if (b.classList.contains('mu-body-rhythm'))
          return MU.play(
            ['mains', 'pieds', 'mains', 'doigts', 'mains', 'pieds', 'mains', 'doigts'].map((inst, i) => ({ t: i * 0.42, inst, vel: 0.9 })),
          );
        const c = MU.CORPS.find((x) => x.id === b.dataset.id);
        MU.play([0, 0.45, 0.9].map((t) => ({ t, inst: c.inst, vel: 0.9 })));
      };

      M.ui.miniQuiz($('.mu-quiz'), [
        () => M.skillById['mu-instruments'].gen({ lvl: 0 }),
        () => M.skillById['mu-sec-resonnant'].gen({ lvl: 0 }),
        () => M.skillById['mu-voix-corps'].gen({ lvl: 1 }),
      ]);
    },
  });

  try {
    M.css(`
    .mu-vib { width: 100%; max-width: 180px; height: 48px }
    .mu-vib path { stroke-dasharray: 100; stroke-dashoffset: 100 }
    .mu-qual-card.vib[data-q="sec"] .mu-vib path { animation: mu-vib-sec .9s var(--ease-out) forwards }
    .mu-qual-card.vib[data-q="resonnant"] .mu-vib path { animation: mu-vib-res 2.4s linear forwards }
    @keyframes mu-vib-sec { 0% { stroke-dashoffset: 100 } 30% { stroke-dashoffset: 90 } 100% { stroke-dashoffset: 90; opacity: .4 } }
    @keyframes mu-vib-res { to { stroke-dashoffset: 0 } }
    @media (prefers-reduced-motion: reduce) { .mu-vib path { stroke-dashoffset: 0 } .mu-qual-card[data-q="sec"] .mu-vib path { stroke-dashoffset: 90 } }
    `);
  } catch (e) {}
})();
