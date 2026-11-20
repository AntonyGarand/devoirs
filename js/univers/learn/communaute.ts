/* Univers social — page Apprendre « Ma famille et ma communauté » (us-communaute). */
(function () {
  'use strict';
  const M = window.M;
  const U = M.us;
  const ui = M.ui;
  const REL = {
    gm: 'Rose, la grand-mère de Léo (la maman de sa maman)',
    gp: 'Paul, le grand-père de Léo (le papa de sa maman)',
    ma: 'Lina, la maman de Léo',
    pa: 'Omar, le papa de Léo',
    ta: 'Sofia, la tante de Léo (la sœur de sa maman)',
    leo: 'Léo',
    co: 'Nina, la cousine de Léo (la fille de sa tante)',
  };

  M.registerLearn({
    id: 'us-communaute',
    domain: 'us-communaute',
    title: 'Ma famille et ma communauté',
    icon: '🏘️',
    short: 'Toutes sortes de familles, les mots de la parenté, le quartier, les animaux',
    intro: 'Il y a toutes sortes de familles, et chaque quartier a des lieux où des personnes travaillent pour nous aider.',
    parentNote:
      "Cette page parle des familles; toutes les configurations sont montrées comme également valables. L'éducation à la sexualité n'est pas couverte ici : elle appartient à l'école et à la famille.",
    render(el) {
      const F = U.d('familles'),
        L = U.d('lieux');
      const plan = U.d('plans').find((p) => p.id === 'quartier-maya');
      el.innerHTML = [
        ui.section({
          icon: '👨‍👩‍👧',
          title: '1. Toutes sortes de familles',
          intro: 'Une famille, ce sont des personnes qui prennent soin les unes des autres. Toutes ces familles sont de vraies familles !',
          body: `<div class="us-tiles">${F.familles.map((f) => `<div class="us-tile" data-say="${M.esc(`La famille ${M.fr.de(f.nom)} : ${f.membres.map((m) => m.role).join(', ')}.`)}"><span class="em" style="font-size:1.8rem">${f.membres.map((m) => m.emoji).join('')}</span><b>Famille ${M.fr.de(f.nom)}</b><small>${f.sorte}</small></div>`).join('')}</div><div class="us-read"></div>`,
        }),
        ui.section({
          icon: '🌳',
          title: '2. Les mots de la famille',
          intro: "Voici l'arbre de la famille de Léo ⭐. Touche une personne pour savoir qui elle est pour Léo.",
          body: `<div class="us-treebox">${U.treeSvg()}</div><div class="us-plan-info us-tree-info">👆 Touche une personne.</div>`,
        }),
        ui.section({
          icon: '🏪',
          title: '3. Mon quartier',
          intro: 'Touche un lieu sur le plan : tu sauras à quoi il sert et qui y travaille.',
          body:
            `<div class="us-qplan">${U.planHtml(plan)}</div><div class="us-plan-info us-q-info">👆 Touche un lieu.</div>` +
            ui.callout(
              "À l'<b>hôtel de ville</b> 🏛️, le conseil municipal, avec la mairesse ou le maire, prend des décisions pour toute la ville : les parcs, les rues, les bibliothèques…",
              { tone: 'info' },
            ),
        }),
        ui.section({
          icon: '🐕',
          title: '4. Les animaux et nous',
          intro: "Les animaux nous aident et nous tiennent compagnie. En retour, on prend soin d'eux.",
          body:
            ui.vocab([
              { emoji: '🦮', word: 'chien-guide', note: 'aide une personne aveugle' },
              { emoji: '🐈', word: 'chat', note: 'tient compagnie' },
              { emoji: '🐝', word: 'abeille', note: 'fait le miel, aide les fleurs' },
              { emoji: '🐄', word: 'vache', note: 'donne du lait' },
              { emoji: '🐔', word: 'poule', note: 'pond des œufs' },
              { emoji: '🐑', word: 'mouton', note: 'donne de la laine' },
            ]) +
            ui.callout(
              "Un animal a besoin d'eau fraîche, de nourriture, d'un abri, de soins et d'attention. Le chocolat est dangereux pour les chiens et les chats !",
            ),
        }),
        ui.section({ icon: '✅', title: '5. Vérifie ta compréhension', body: '<div class="us-mq"></div>' }),
      ].join('');
      ui.reading(M.$('.us-read', el), {
        title: 'Des familles différentes',
        text: "Zoé vit avec sa maman. Mei a deux papas. Félix habite chez ses grands-parents. Awa vit avec sa maman, son beau-père et son petit demi-frère. Chaque famille est différente. Dans chaque famille, on s'aime et on prend soin les uns des autres.",
      });
      M.$('.us-treebox', el).onclick = (e) => {
        const g = e.target.closest('[data-hot]');
        if (!g) return;
        M.$$('[data-hot] circle', el).forEach((c) => c.setAttribute('stroke-width', '3'));
        M.$('circle', g).setAttribute('stroke-width', '7');
        M.$('.us-tree-info', el).textContent = REL[g.dataset.hot];
        M.say(REL[g.dataset.hot]);
      };
      M.$('.us-qplan', el).addEventListener('click', (e) => {
        const g =
          e.target.closest('.plan-place') ||
          (e.target.closest('.plan-leg-it') && M.$(`.plan-place[data-hot="${e.target.closest('.plan-leg-it').dataset.for}"]`, el));
        if (!g) return;
        const id = g.dataset.hot,
          p = plan.places.find((x) => x.id === id),
          l = L.lieux.find((x) => x.id === id);
        M.$$('.plan-place', el).forEach((x) => x.classList.toggle('flash-on', x === g));
        const txt = l
          ? `${l.emoji} ${U.cap(l.nom)} : on y va pour ${l.pour}. ${U.cap(l.metier)} y travaille.`
          : `${p.emoji} ${U.cap(p.nom)} : ${p.fn}.`;
        M.$('.us-q-info', el).textContent = txt;
        M.say(txt);
      });
      ui.miniQuiz(M.$('.us-mq', el), [
        () => M.skillById['us-familles'].gen({ lvl: 0 }),
        () => M.skillById['us-lieux-metiers'].gen({ lvl: 0 }),
        () => M.skillById['us-animaux'].gen({ lvl: 1 }),
      ]);
    },
  });
})();
