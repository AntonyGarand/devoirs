/* Univers social — page Apprendre « Lire un plan » (us-reperer) : vue d'oiseau, titre et légende,
   rose des vents, paysages. Renvoi à la page maths « Se repérer ». */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const ui = M.ui;
  const ROSE = `<svg viewBox="0 0 200 200" style="width:100%;max-width:220px;display:block;margin:0 auto" role="img" aria-label="Rose des vents">
    <circle cx="100" cy="100" r="62" fill="#fff" stroke="#2b2d42" stroke-width="3"/>
    <path d="M100 42 L112 100 L100 158 L88 100 Z" fill="#2b2d42"/><path d="M100 42 L112 100 L88 100 Z" fill="#d62828"/>
    <path d="M42 100 L100 88 L158 100 L100 112 Z" fill="#7a7f99"/>
    ${[['N', 100, 28, 'nord, en haut'], ['S', 100, 190, 'sud, en bas'], ['E', 184, 108, 'est, à droite'], ['O', 16, 108, 'ouest, à gauche']].map(([l, x, y, s]) => `<g data-say="${s}" style="cursor:pointer"><circle cx="${x}" cy="${y - 8}" r="17" fill="#fff6d6" stroke="#e9b949" stroke-width="2"/><text x="${x}" y="${y}" text-anchor="middle" font-size="24" font-weight="900" fill="#2b2d42">${l}</text></g>`).join('')}</svg>`;

  M.registerLearn({
    id: 'us-plans', domain: 'us-reperer', title: 'Lire un plan', icon: '🗺️',
    short: 'Vue d\'oiseau, titre, légende, rose des vents, paysages',
    intro: 'Un plan, c\'est un dessin d\'un lieu vu d\'en haut, comme un oiseau qui vole au-dessus. Deviens explorateur ou exploratrice !',
    render(el) {
      const plans = U.d('plans'), P = U.d('paysages');
      const q = plans.find((p) => p.id === 'quartier-maya'), maison = plans.find((p) => p.id === 'maison-awa');
      el.innerHTML = [
        ui.section({ icon: '🐦', title: '1. Qu\'est-ce qu\'un plan ?', intro: 'Sur un plan, on dessine chaque objet vu d\'en haut et on le remplace par un petit <b>symbole</b>.',
          body: '<div class="us-cmp">' + ui.compare({ left: { title: '👀 Ce que je vois', items: [{ emoji: '🛏️', label: 'un lit' }, { emoji: '🛁', label: 'un bain' }, { emoji: '🛋️', label: 'un divan' }] }, right: { title: '🗺️ Sur le plan', items: ['🛏️', '🛁', '🛋️'].map((e) => ({ emoji: `<span style="display:inline-block;border:3px solid #2b2d42;border-radius:8px;padding:0 6px;background:#fff">${e}</span>`, label: 'un symbole' })) } }) + '</div>' +
            `<div class="row-center" style="margin:10px 0"><button class="btn yellow us-bird">🐦 Vue d'oiseau : la maison d'Awa</button></div><div class="us-birdview"></div>` }),
        ui.section({ icon: '📋', title: '2. Le titre et la légende', intro: 'Le <b>titre</b> dit quel lieu on regarde. La <b>légende</b> explique chaque symbole. Touche un élément de la légende : il s\'allume sur le plan !',
          body: U.planHtml(q) + ui.callout('Pour lire un plan : 1) je lis le titre, 2) je regarde la légende, 3) je cherche le symbole sur le plan.') }),
        ui.section({ icon: '🧭', title: '3. La rose des vents', intro: 'La rose des vents montre les <b>points cardinaux</b>. Touche une lettre pour l\'entendre.',
          body: `<div class="l-grid"><div>${ROSE}</div><div>${ui.callout('Petite comptine : « <b>Nord</b> en haut, <b>sud</b> en bas, <b>est</b> à droite, <b>ouest</b> à gauche, voilà ! »')}${ui.speak('Nord en haut, sud en bas, est à droite, ouest à gauche, voilà !', { label: '🔊 La comptine' })}</div></div>` +
            U.planHtml(q, { north: true }) + `<p>Sur ce plan, l'école 🏫 est <b>au nord</b> de l'épicerie 🛒, et la maison 🏠 est <b>à l'ouest</b> de la caserne 🚒.</p>` +
            ui.callout('Pour la gauche, la droite et le quadrillage, va voir la page de mathématique <a href="#/apprendre/reperage">🧭 Se repérer</a>.', { tone: 'info' }) }),
        ui.section({ icon: '🏞️', title: '4. Les paysages', intro: 'Un paysage a des éléments <b>naturels</b> (faits par la nature) et des éléments <b>humains</b> (construits par les personnes).',
          body: ui.vocab(P.mots.map((m) => ({ emoji: M.art.html(m.art, { size: 64, alt: m.nom }), word: U.cap(m.nom), note: m.def, say: `${m.nom} : ${m.def}` }))) +
            ui.callout('Le <b>fleuve Saint-Laurent</b> traverse le Québec et coule vers la mer. Au Québec, il y a beaucoup de lacs et de rivières !') }),
        ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="us-mq"></div>' }),
      ].join('');
      M.$('.us-bird', el).onclick = () => { M.sfx.pop(); M.$('.us-birdview', el).innerHTML = U.planHtml(maison); };
      ui.miniQuiz(M.$('.us-mq', el), [() => M.skillById['us-plan'].gen({ lvl: 0 }), () => M.skillById['us-plan'].gen({ lvl: 1 }), () => M.skillById['us-paysages'].gen({ lvl: 0 })]);
    },
  });
})();
