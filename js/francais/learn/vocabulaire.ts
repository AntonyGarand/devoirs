/* learn/vocabulaire.js — 🔤 L'alphabet et les familles de mots (fr-alphabet-dico) */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const gen = (id, lvl) => () => M.skillById[id].gen({ lvl });
  try {
    M.css(
      '.fr-abc .vocab-tile b { font-size: 1.6rem } .fr-v { background: #ffe1e8 } .fr-c { background: #dff3fb } .fr-lt-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center } .fr-lt-row span { width: 2.2em; height: 2.2em; display: inline-flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: 900; font-size: 1.3rem }',
    );
  } catch (e) {}
  const ABC = [
    ['a', '🍍', 'ananas'],
    ['b', '⛵', 'bateau'],
    ['c', '🎁', 'cadeau'],
    ['d', '🐬', 'dauphin'],
    ['e', '⭐', 'étoile'],
    ['f', '🧚', 'fée'],
    ['g', '🦒', 'girafe'],
    ['h', '🦉', 'hibou'],
    ['i', '🏝️', 'île'],
    ['j', '🧃', 'jus'],
    ['k', '🐨', 'koala'],
    ['l', '🐰', 'lapin'],
    ['m', '🐑', 'mouton'],
    ['n', '🪺', 'nid'],
    ['o', '🐦', 'oiseau'],
    ['p', '🍎', 'pomme'],
    ['q', '🎳', 'quille'],
    ['r', '🦊', 'renard'],
    ['s', '☀️', 'soleil'],
    ['t', '🐢', 'tortue'],
    ['u', '🏭', 'usine'],
    ['v', '🐄', 'vache'],
    ['w', '🚃', 'wagon'],
    ['x', '🎶', 'xylophone'],
    ['y', '🪀', 'yoyo'],
    ['z', '🦓', 'zèbre'],
  ];
  const VOY = ['a', 'e', 'i', 'o', 'u', 'y'];

  M.registerLearn({
    id: 'fr-alphabet-dico',
    domain: 'fr-vocabulaire',
    title: "L'alphabet et les familles",
    icon: '🔤',
    short: 'Les 26 lettres, voyelles et consonnes, ranger des mots, familles de mots.',
    intro:
      "L'alphabet a <b>26 lettres</b>. On les range toujours dans le même ordre : c'est l'<b>ordre alphabétique</b>. Touche une lettre pour l'entendre.",
    render(el) {
      const fams = M.shuffle(FR.FAMILLES).slice(0, 3);
      el.innerHTML =
        M.ui.section({
          icon: '🔤',
          title: 'Mon alphabet',
          body: `<div class="fr-abc">${M.ui.vocab(ABC.map(([l, em, w]) => ({ emoji: em, word: l, note: w, say: `${l}, comme dans ${w}` })))}</div>`,
        }) +
        M.ui.section({
          icon: '🔴',
          title: 'Voyelles et consonnes',
          intro: 'Il y a 6 <b>voyelles</b> (en rose). Les 20 autres lettres sont des <b>consonnes</b> (en bleu).',
          body: `<div class="fr-lt-row">${ABC.map(([l]) => `<span class="${VOY.includes(l) ? 'fr-v' : 'fr-c'}">${l}</span>`).join('')}</div>`,
        }) +
        M.ui.section({
          icon: '📚',
          title: 'Ranger des mots',
          intro: "Pour ranger des mots dans l'ordre alphabétique, je regarde leur <b>première lettre</b>.",
          body:
            `<div class="row" style="font-size:1.2rem"><span class="chip">🍎 <b>p</b>omme</span><span class="chip">⛵ <b>b</b>ateau</span><span class="chip">🐰 <b>l</b>apin</span> ➜ <span class="chip">⛵ <b>b</b>ateau</span><span class="chip">🐰 <b>l</b>apin</span><span class="chip">🍎 <b>p</b>omme</span></div>` +
            M.ui.callout('<b>b</b>ateau, <b>l</b>apin, <b>p</b>omme : b vient avant l, et l vient avant p.') +
            M.ui.callout("Si deux mots commencent par la même lettre, c'est plus difficile : tu apprendras ça en 3<sup>e</sup> année !", {
              tone: 'info',
            }),
        }) +
        M.ui.section({
          icon: '👪',
          title: 'Les familles de mots',
          intro:
            'Des mots de la même <b>famille</b> se ressemblent <b>et</b> parlent de la même chose. Attention aux mots qui se ressemblent seulement !',
          body: fams
            .map(
              (f) =>
                `<h3>${f.em} La famille de <b>${f.mots[0]}</b></h3>${M.ui.vocab(f.mots.map((w) => ({ emoji: f.em, word: w })))}${f.piege.length ? `<p class="muted">⚠️ <b>${f.piege[0]}</b> ressemble à <b>${f.mots[0]}</b>, mais ce n'est pas la même famille.</p>` : ''}`,
            )
            .join(''),
        }) +
        M.ui.section({ icon: '✅', title: 'Vérifie ta compréhension', body: '<div class="fr-mq"></div>' });
      M.ui.miniQuiz(M.$('.fr-mq', el), [gen('fr-alphabet', 0), gen('fr-alphabet', 1), gen('fr-familles-mots', 0)]);
    },
  });
})();
