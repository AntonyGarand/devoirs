/* Univers social — familles fictives (R7 : toutes les familles sont valides; on compte, on nomme, on observe).
   Membres : emoji d'une personne seule (rendu fiable) + rôle. adulte = true pour les adultes. */
(function () {
  'use strict';
  const M = window.M;
  const m = (emoji, role, adulte) => ({ emoji, role, adulte: !!adulte });
  M.registerData('us-familles', {
    familles: [
      { id: 'noah', nom: 'Noah', sorte: 'deux parents', membres: [m('👩🏿', 'sa maman', 1), m('👨🏿', 'son papa', 1), m('👦🏿', 'Noah'), m('👶🏿', 'sa petite sœur')] },
      { id: 'zoe', nom: 'Zoé', sorte: 'un parent', membres: [m('👩🏽', 'sa maman', 1), m('👧🏽', 'Zoé')] },
      { id: 'amir', nom: 'Amir', sorte: 'deux mamans', membres: [m('👩🏻', 'sa maman Julie', 1), m('👩🏾', 'sa maman Sara', 1), m('👦🏾', 'Amir'), m('👦🏽', 'son grand frère')] },
      { id: 'mei', nom: 'Mei', sorte: 'deux papas', membres: [m('👨🏻', 'son papa Marc', 1), m('👨🏼', 'son papa Hugo', 1), m('👧🏻', 'Mei')] },
      { id: 'felix', nom: 'Félix', sorte: 'avec ses grands-parents', membres: [m('👵🏼', 'sa grand-mère', 1), m('👴🏼', 'son grand-père', 1), m('👦🏻', 'Félix')] },
      { id: 'awa', nom: 'Awa', sorte: 'recomposée', membres: [m('👩🏿', 'sa maman', 1), m('👨🏻', 'son beau-père', 1), m('👧🏿', 'Awa'), m('👶🏽', 'son demi-frère')] },
      { id: 'gabriel', nom: 'Gabriel', sorte: 'd\'accueil', membres: [m('👩🏼', 'sa mère d\'accueil', 1), m('👨🏽', 'son père d\'accueil', 1), m('👦🏽', 'Gabriel'), m('👧🏼', 'une autre enfant accueillie')] },
      { id: 'ines', nom: 'Inès', sorte: 'adoptive', membres: [m('👨🏽', 'son papa', 1), m('👩🏻', 'sa maman', 1), m('👧🏽', 'Inès')] },
      { id: 'kevin', nom: 'Kevin', sorte: 'avec sa grand-mère à la maison', membres: [m('👨🏼', 'son papa', 1), m('👵🏻', 'sa grand-mère', 1), m('👦🏼', 'Kevin'), m('👧🏼', 'sa sœur')] },
      { id: 'maya', nom: 'Maya', sorte: 'grande famille', membres: [m('👩🏾', 'sa maman', 1), m('👨🏾', 'son papa', 1), m('👧🏿', 'Maya'), m('👦🏿', 'son frère'), m('👦🏾', 'son autre frère')] },
    ],
    mots: [
      { emoji: '👶', mot: 'bébé' }, { emoji: '👵', mot: 'grand-mère' }, { emoji: '👴', mot: 'grand-père' },
      { emoji: '👧', mot: 'fille' }, { emoji: '👦', mot: 'garçon' },
    ],
    /* Vrai ou faux sur la diversité des familles (R7 : toutes les familles sont valides; jamais « vraie » famille). */
    faits: [
      { t: 'Une famille peut avoir un seul parent.', v: true },
      { t: 'Une famille peut avoir deux mamans.', v: true },
      { t: 'Une famille peut avoir deux papas.', v: true },
      { t: 'Des grands-parents peuvent s\'occuper de leurs petits-enfants à la maison.', v: true },
      { t: 'Un enfant adopté fait partie de sa famille.', v: true },
      { t: 'Une famille a toujours un papa et une maman.', v: false, e: 'Il y a toutes sortes de familles : un parent, deux mamans, deux papas, des grands-parents…' },
      { t: 'Toutes les familles ont le même nombre de personnes.', v: false, e: 'Certaines familles sont petites, d\'autres sont grandes.' },
      { t: 'Dans une famille, on prend soin les uns des autres.', v: true },
      { t: 'Dans une famille recomposée, il peut y avoir un beau-père ou une belle-mère.', v: true },
    ],
    /* Liens de parenté (définitions générales) */
    liens: [
      { q: 'La mère de ma mère, c\'est ma…', ok: 'grand-mère', d: ['tante', 'cousine'] },
      { q: 'Le père de mon père, c\'est mon…', ok: 'grand-père', d: ['oncle', 'cousin'] },
      { q: 'La sœur de ma mère, c\'est ma…', ok: 'tante', d: ['grand-mère', 'cousine'] },
      { q: 'Le frère de mon père, c\'est mon…', ok: 'oncle', d: ['grand-père', 'cousin'] },
      { q: 'Le fils de ma tante, c\'est mon…', ok: 'cousin', d: ['oncle', 'frère'] },
      { q: 'La fille de mon oncle, c\'est ma…', ok: 'cousine', d: ['tante', 'sœur'] },
      { q: 'La mère de mon père, c\'est ma…', ok: 'grand-mère', d: ['tante', 'sœur'] },
    ],
    /* Liens composés (familles recomposées) — situations fictives */
    composes: [
      { t: 'Awa vit avec sa maman et Marc, le conjoint de sa maman.', q: 'Pour Awa, Marc est son…', ok: 'beau-père', d: ['grand-père', 'oncle'] },
      { t: 'La maman d\'Awa et Marc ont eu un bébé, Léo. Awa et Léo ont la même maman, mais pas le même papa.', q: 'Pour Awa, Léo est son…', ok: 'demi-frère', d: ['cousin', 'oncle'] },
      { t: 'Le papa de Samuel vit avec Nadia, sa conjointe.', q: 'Pour Samuel, Nadia est sa…', ok: 'belle-mère', d: ['tante', 'grand-mère'] },
      { t: 'Le papa de Mei a une fille, Lili, avec une autre maman. Mei et Lili ont le même papa.', q: 'Pour Mei, Lili est sa…', ok: 'demi-sœur', d: ['cousine', 'tante'] },
    ],
    /* Arbre fictif : la famille de Léo. x,y en unités de l'arbre (SVG 520 × 330). */
    arbre: {
      gens: [
        { id: 'gm', emoji: '👵🏽', nom: 'Rose', x: 200, y: 40 }, { id: 'gp', emoji: '👴🏽', nom: 'Paul', x: 320, y: 40 },
        { id: 'ma', emoji: '👩🏽', nom: 'Lina', x: 120, y: 160 }, { id: 'pa', emoji: '👨🏾', nom: 'Omar', x: 230, y: 160 }, { id: 'ta', emoji: '👩🏽', nom: 'Sofia', x: 400, y: 160 },
        { id: 'leo', emoji: '👦🏽', nom: 'Léo', x: 175, y: 280 }, { id: 'co', emoji: '👧🏽', nom: 'Nina', x: 400, y: 280 },
      ],
      couples: [['gm', 'gp'], ['ma', 'pa']],
      enfants: [[['gm', 'gp'], ['ma', 'ta']], [['ma', 'pa'], ['leo']], [['ta'], ['co']]],
      // Questions : de qui parle-t-on, du point de vue de Léo ?
      q: [
        { lien: 'la tante', ok: 'Sofia', why: 'Sofia est la sœur de Lina, la maman de Léo' },
        { lien: 'la cousine', ok: 'Nina', why: 'Nina est la fille de Sofia, la tante de Léo' },
        { lien: 'la grand-mère', ok: 'Rose', why: 'Rose est la mère de Lina, la maman de Léo' },
        { lien: 'le grand-père', ok: 'Paul', why: 'Paul est le père de Lina, la maman de Léo' },
        { lien: 'le papa', ok: 'Omar', why: 'Omar est relié à Léo par la ligne du couple Lina et Omar' },
      ],
    },
  });
})();
