/* =====================================================================
   sciences/learn/eau.js — « L'eau qui change » (habiletés 11 et 12)
   1. Thermomètre-curseur (−20 °C à 110 °C) : glace, eau, eau qui bout; même quantité d'eau.
   2. Le cycle de l'eau (enrichissement).
   3. Le labo « flotte ou coule » : prédire, essayer, noter.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  if (!SC) return;

  const zone = (v) =>
    v < 0
      ? { k: 'glace', icon: '❄️', t: 'Très froid' }
      : v < 10
        ? { k: 'eau', icon: '🧥', t: 'Froid' }
        : v < 30
          ? { k: 'eau', icon: '🙂', t: 'Doux' }
          : v < 100
            ? { k: 'eau', icon: '🔥', t: 'Très chaud' }
            : { k: 'bout', icon: '♨️', t: 'Ça bout !' };
  const fmt = (v) => `${zone(v).icon} ${zone(v).t}${v === 0 ? ' — 0 °C' : v === 100 ? ' — 100 °C' : ''}`;

  function potSvg(v) {
    const pct = (v + 20) / 130;
    const thermo = `<rect x="262" y="30" width="16" height="170" rx="8" fill="#fff" stroke="#7d8597" stroke-width="2"/>
      <rect x="265" y="${196 - 160 * pct}" width="10" height="${160 * pct}" rx="5" fill="${v < 0 ? '#118ab2' : v < 30 ? '#f4b400' : '#ef476f'}"/><circle cx="270" cy="206" r="12" fill="${v < 0 ? '#118ab2' : v < 30 ? '#f4b400' : '#ef476f'}" stroke="#7d8597" stroke-width="2"/>
      <line x1="252" y1="${196 - 160 * (20 / 130)}" x2="262" y2="${196 - 160 * (20 / 130)}" stroke="#2b2d42" stroke-width="2"/><text x="248" y="${200 - 160 * (20 / 130)}" text-anchor="end" font-size="12" font-weight="800">0 °C</text>
      <line x1="252" y1="${196 - 160 * (120 / 130)}" x2="262" y2="${196 - 160 * (120 / 130)}" stroke="#2b2d42" stroke-width="2"/><text x="248" y="${200 - 160 * (120 / 130)}" text-anchor="end" font-size="12" font-weight="800">100 °C</text>`;
    let inside;
    if (v < 0)
      inside = `<rect x="78" y="128" width="40" height="40" rx="6" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/><rect x="124" y="132" width="36" height="36" rx="6" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/><rect x="100" y="98" width="38" height="34" rx="6" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/>`;
    else if (v === 0)
      inside = `<rect x="64" y="150" width="112" height="22" fill="#8fd0f0"/><rect x="90" y="128" width="30" height="30" rx="6" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/><rect x="126" y="136" width="24" height="24" rx="5" fill="#e6f6fd" stroke="#7fb8d6" stroke-width="3"/>`;
    else if (v < 100)
      inside = `<rect x="64" y="132" width="112" height="40" fill="#8fd0f0"/>${v >= 30 ? '<path d="M100 120 q-6 -10 0 -20 M140 120 q-6 -10 0 -20" stroke="#b0b5c2" stroke-width="2" stroke-dasharray="3 5" fill="none"/>' : ''}`;
    else
      inside = `<rect x="64" y="132" width="112" height="40" fill="#8fd0f0"/>${M.range(0, 6)
        .map((k) => `<circle cx="${74 + k * 16}" cy="${140 + (k % 3) * 9}" r="${3 + (k % 3)}" fill="#fff"/>`)
        .join('')}
      ${[92, 120, 148].map((x) => `<path d="M${x} 116 v-26" stroke="#9aa6b6" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#sc-up)"/>`).join('')}
      <text x="120" y="80" text-anchor="middle" font-size="11" font-weight="800" fill="#7d8597">vapeur invisible</text>
      <g opacity=".95"><circle cx="100" cy="46" r="13" fill="#fff"/><circle cx="120" cy="40" r="17" fill="#fff"/><circle cx="140" cy="48" r="12" fill="#fff"/></g><text x="120" y="22" text-anchor="middle" font-size="11" font-weight="800">petites gouttes</text>`;
    const fire =
      v > 30
        ? `<path d="M80 196 q8 -14 0 -22 q14 8 10 22 M114 196 q8 -16 0 -26 q16 10 12 26 M150 196 q8 -14 0 -22 q14 8 10 22" fill="#f78c40" stroke="#ef476f" stroke-width="2"/>`
        : '';
    return `<svg viewBox="0 0 300 230" class="sc-fig" role="img" aria-label="Casserole d'eau" xmlns="http://www.w3.org/2000/svg"><defs><marker id="sc-up" markerWidth="8" markerHeight="8" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#9aa6b6"/></marker></defs>
      <rect width="300" height="230" rx="16" fill="${v < 0 ? '#e9f4fb' : v >= 100 ? '#fff0ea' : '#f6f1ff'}"/>
      ${inside}<path d="M60 110 v62 q0 10 10 10 h100 q10 0 10 -10 v-62" fill="none" stroke="#7d8597" stroke-width="5"/><rect x="40" y="182" width="160" height="12" rx="4" fill="#555"/>${fire}${thermo}</svg>`;
  }
  const etat = (v) =>
    v < 0
      ? '🧊 <b>Solide</b> : de la glace. Elle garde sa forme.'
      : v === 0
        ? "🧊💧 À 0 °C, la glace <b>fond</b> (ou l'eau <b>gèle</b>, si on refroidit)."
        : v < 100
          ? "💧 <b>Liquide</b> : l'eau coule et prend la forme de la casserole." +
            (v >= 30 ? " Un peu d'eau s'évapore lentement, comme une flaque qui sèche." : '')
          : "♨️ À 100 °C, l'eau <b>bout</b> : elle devient de la <b>vapeur</b>, un gaz invisible. Le petit nuage blanc, ce sont de minuscules gouttes.";

  const LAB = ['bouchon', 'caillou', 'pomme', 'clou', 'orange', 'orange-pelee', 'buche', 'bille'];

  M.registerLearn({
    id: 'sc-l-eau',
    domain: 'sc-matiere',
    title: "L'eau qui change",
    icon: '🧊',
    short: 'Glace, eau, vapeur… et flotte ou coule ?',
    intro:
      "L'eau peut être <b>solide</b> (la glace), <b>liquide</b> (l'eau qui coule) ou <b>gazeuse</b> (la vapeur). Fais chauffer et refroidir l'eau pour voir ce qui change… et ce qui ne change pas !",
    render(el) {
      el.innerHTML =
        M.ui.section({
          icon: '🌡️',
          title: "1. Chauffer et refroidir l'eau",
          intro: "Bouge le thermomètre. Regarde l'eau dans la casserole.",
          body: `<div class="sc-sim"><div class="sc-stage sc-eau-stage"></div><div class="sc-ctrls"><div class="sc-eau-sl"></div><div class="callout blue sc-eau-txt"></div>
          <div class="row"><button class="btn sc-eau-go" data-v="-15">❄️ Congélateur</button><button class="btn sc-eau-go" data-v="20">🏠 Cuisine</button><button class="btn sc-eau-go" data-v="105">♨️ Ça bout</button></div>
          ${SC.castor("Que l'eau soit glace, liquide ou vapeur, c'est <b>la même eau</b> ! Un glaçon qui fond donne la même quantité d'eau.")}</div></div>
          ${M.ui.callout("La chaleur et l'eau qui bout, c'est <b>toujours avec un adulte</b>.", { tone: 'warn', who: '⚠️' })}`,
        }) +
        M.ui.section({
          icon: '🔄',
          title: "2. Le cycle de l'eau 🌟",
          intro: "L'eau du lac voyage tout le temps ! Touche chaque étape. <small>(enrichissement)</small>",
          body: '<div class="sc-cycle-box"><div class="sc-eau-cyc"></div><div class="callout sc-eau-cyctxt">Touche une étape du cycle ☝️</div></div>',
        }) +
        M.ui.section({
          icon: '🛟',
          title: '3. Le labo : flotte ou coule ?',
          intro:
            "Pour chaque objet, <b>prédis</b> d'abord : va-t-il flotter ou couler ? Ensuite, touche « Essayer ». Le carnet note tes prédictions et les résultats.",
          body: `<div class="sc-sim"><div><div class="sc-eau-bac"></div></div><div class="sc-lab-items sc-eau-lab"></div></div>
          <div class="sc-msg sc-eau-score"></div>${SC.castor("Une grosse bûche lourde flotte, un petit clou léger coule. Ce n'est pas seulement le poids qui compte : la <b>matière</b> et l'<b>air</b> aussi !")}`,
        }) +
        M.ui.section({ icon: '✅', title: '4. Vérifie ta compréhension', body: '<div class="sc-eau-quiz"></div>' });
      const $ = (s) => M.$(s, el);

      /* 1. thermomètre */
      const show = (v) => {
        $('.sc-eau-stage').innerHTML = potSvg(v);
        $('.sc-eau-txt').innerHTML = etat(v);
      };
      const sl = M.ui.slider($('.sc-eau-sl'), {
        label: '🌡️ Température',
        min: -20,
        max: 110,
        step: 1,
        value: -10,
        format: fmt,
        onChange: show,
      });
      show(-10);
      M.$$('.sc-eau-go', el).forEach((b) => {
        b.onclick = () => {
          M.sfx.tap();
          sl.set(+b.dataset.v);
        };
      });

      /* 2. cycle */
      const CY = [
        {
          emoji: '☀️',
          label: 'Évaporation',
          texte: "Le soleil chauffe l'eau des lacs et de la mer. Une partie devient de la vapeur invisible qui monte.",
        },
        {
          emoji: '☁️',
          label: 'Condensation',
          texte: 'En haut, il fait froid : la vapeur redevient de minuscules gouttes. Ensemble, elles forment les nuages.',
        },
        { emoji: '🌧️', label: 'Précipitation', texte: "Les gouttes grossissent et tombent : c'est la pluie (ou la neige, l'hiver)." },
        {
          emoji: '🏞️',
          label: 'Retour au lac',
          texte: "L'eau coule dans les rivières et retourne dans les lacs et la mer. Et ça recommence !",
        },
      ];
      SC.mountCycle($('.sc-eau-cyc'), CY);
      $('.sc-eau-cyc').onclick = (e) => {
        const g = e.target.closest('[data-hot]');
        if (!g) return;
        const i = +g.dataset.hot.slice(1);
        M.$$('.cyc-st', $('.sc-eau-cyc')).forEach((x, k) => x.classList.toggle('sc-on', k === i));
        $('.sc-eau-cyctxt').innerHTML = `<b>${CY[i].emoji} ${CY[i].label}</b> : ${CY[i].texte}`;
        M.say(CY[i].label + '. ' + CY[i].texte);
      };

      /* 3. labo */
      const pred = {},
        res = {};
      let busy = false;
      const drawLab = () => {
        $('.sc-eau-lab').innerHTML = LAB.map((id) => {
          const o = SC.objet(id),
            p = pred[id],
            r = res[id];
          return `<div class="sc-lab-item ${r ? (o.float ? 'yes' : 'no') : ''}" data-id="${id}"><span class="sc-big">${SC.pic(o, 44)}</span>${SC.cap(o.nom)}
            ${
              r
                ? `<div>${o.float ? '🛟 Flotte' : '⚓ Coule'} ${p === (o.float ? 'f' : 'c') ? '👀' : '😮'}</div>`
                : `<div class="row"><button class="btn ${p === 'f' ? 'on' : ''}" data-p="f" aria-label="Flotte">🛟</button><button class="btn ${p === 'c' ? 'on' : ''}" data-p="c" aria-label="Coule">⚓</button>${p ? '<button class="btn blue" data-go="1">Essayer</button>' : ''}</div>`
            }</div>`;
        }).join('');
        const done = LAB.filter((id) => res[id]);
        const surprises = done.filter((id) => pred[id] !== (SC.objet(id).float ? 'f' : 'c')).length;
        $('.sc-eau-score').innerHTML = done.length
          ? `Essais : ${done.length} / ${LAB.length} · Surprises 😮 : ${surprises}${done.length === LAB.length ? " — Bravo ! Les surprises, c'est comme ça qu'on apprend. 🌱" : ''}`
          : '';
      };
      $('.sc-eau-bac').innerHTML = `<div class="sc-stage">${SC.svg.bac('')}</div>`;
      $('.sc-eau-lab').onclick = async (e) => {
        const it = e.target.closest('.sc-lab-item');
        if (!it || busy) return;
        const id = it.dataset.id;
        const pb = e.target.closest('[data-p]');
        if (pb) {
          pred[id] = pb.dataset.p;
          M.sfx.tap();
          drawLab();
          return;
        }
        if (e.target.closest('[data-go]')) {
          busy = true;
          try {
            await SC.sim.bac($('.sc-eau-bac'), SC.objet(id));
          } finally {
            busy = false;
          }
          if (!el.isConnected) return;
          res[id] = true;
          drawLab();
          const o = SC.objet(id);
          M.say(`${o.nom} ${o.float ? 'flotte' : 'coule'}.`);
        }
      };
      drawLab();

      M.ui.miniQuiz($('.sc-eau-quiz'), [
        () => M.skillById['sc-etats-eau'].gen({ lvl: 0 }),
        () => M.skillById['sc-etats-eau'].gen({ lvl: 1 }),
        () => M.skillById['sc-flotte-coule'].gen({ lvl: 2 }),
      ]);
    },
  });
})();
