/* learn/sons.js — 🗺️ Ma carte des sons (fr-carte-sons) */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const gen = (id, lvl) => () => M.skillById[id].gen({ lvl });

  M.registerLearn({
    id: 'fr-carte-sons',
    domain: 'fr-sons',
    title: 'Ma carte des sons',
    icon: '🗺️',
    short: "Les voyelles, les sons qui s'écrivent de plusieurs façons, les syllabes.",
    intro:
      "Comme le mur des sons de ta classe ! Touche un mot pour l'entendre. On ne dit jamais un son tout seul : on l'écoute dans un <b>mot-repère</b>.",
    render(el) {
      const voy = [
        ['a', '🐱', 'chat'],
        ['e', '🐴', 'cheval'],
        ['i', '🛏️', 'lit'],
        ['o', '🚲', 'vélo'],
        ['u', '🌙', 'lune'],
        ['y', '🦢', 'cygne'],
      ];
      const SONS_TABS = ['o', 'an', 'in', 'è', 'é', 's', 'k', 'ou', 'on', 'oi', 'ch', 'gn'];
      const wordsOf = (id) => FR.mots((m) => m.gr && m.em && FR.hasSon(m, id)).slice(0, 8);
      const sylWords = ['chocolat', 'papillon', 'kangourou', 'lapin', 'ordinateur', 'éléphant'].map(FR.mot).filter(Boolean);
      el.innerHTML =
        M.ui.section({
          icon: '🅰️',
          title: 'Les voyelles',
          intro: 'Les voyelles sont <b>a, e, i, o, u, y</b>. Chaque syllabe a une voyelle !',
          body: M.ui.vocab(
            voy.map(([l, em, w]) => ({ emoji: em, word: `${l} <small>comme dans</small> ${w}`, say: `${l}, comme dans ${w}` })),
          ),
        }) +
        M.ui.section({
          icon: '🔡',
          title: "Les sons et leurs façons de s'écrire",
          intro: 'Choisis un son. Les lettres en couleur font ce son.',
          body: '<div class="fr-tabs-sons"></div>',
        }) +
        M.ui.section({
          icon: '👏',
          title: 'Les syllabes',
          intro:
            "Une syllabe, c'est un morceau de mot qu'on dit d'un seul coup de voix. Tape dans tes mains : un 👏 par syllabe ! Touche chaque morceau pour l'entendre.",
          body:
            sylWords
              .map(
                (m) =>
                  `<div style="margin:8px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:2rem">${m.em}</span>${M.ui.wordParts(m.w, m.syl)}<span class="fr-claps">${'👏'.repeat(m.syl.length)}</span></div>`,
              )
              .join('') +
            M.ui.callout(
              "Attention : on compte les syllabes qu'on <b>entend</b>. Dans <i>école</i>, on entend 2 syllabes : <i>é-cole</i>.",
              { tone: 'info' },
            ),
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.tabs(
        M.$('.fr-tabs-sons', el),
        SONS_TABS.map((id) => {
          const s = FR.son(id);
          return {
            id,
            label: `${s.em} ${s.label}`,
            render(p) {
              const ws = wordsOf(id);
              p.innerHTML =
                `<p>${FR.sonCard(id)}</p><p>Il s'écrit : ${s.graphies.map((g) => `<b class="fr-gr" style="font-size:1.4rem">${g}</b>`).join(' · ')}</p>` +
                (s.regle ? M.ui.callout(s.regle) : '') +
                M.ui.vocab(ws.map((m) => ({ emoji: m.em, word: FR.grHtml(m, id), say: m.w })));
            },
          };
        }),
      );
      M.ui.miniQuiz(M.$('.fr-mq', el), [gen('fr-entendre-son', 0), gen('fr-sons-ecrits', 1), gen('fr-rimes', 0)]);
    },
  });
})();
