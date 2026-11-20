/* =====================================================================
   sciences/data/terre.js — saisons, précipitations, astres, eau (HLD § 3, § 5.1)
   Règle : on DÉCRIT les saisons, on n'explique jamais leur cause (3e cycle).
   La vapeur d'eau est invisible; le « nuage » au-dessus de la bouilloire = minuscules gouttes.
   ===================================================================== */

interface ScSaison {
  id: string;
  label: string;
  icon: string;
  /** L'érable à cette saison. */
  erable: string;
  /** Heures de clarté (environ). */
  jour: number;
  temp: string;
  precip: string;
  vetements: string;
  activites: string[];
}
/** Question à choix : t énoncé, a bonne réponse, e explication. */
interface ScQa {
  t: string;
  a: string;
  e: string;
}
/** Avec distracteurs [libellé, pourquoi]. */
interface ScQaWhy extends ScQa {
  d: [string, string][];
}
interface ScApi {
  SAISONS: ScSaison[];
  saison(id: string): ScSaison | undefined;
  PRECIP: { id: string; label: string; def: string }[];
  ASTRES: { id: string; label: string; type: string; def: string }[];
  CIEL_VF: ScVf[];
  JOUR_NUIT: { jour: string[]; nuit: string[] };
  /** a : id de l'astre. */
  ASTRE_Q: ScQa[];
  CIEL_Q2: ScQaWhy[];
  /** d : distracteurs. */
  SAISON_Q: (ScQa & { d: string[] })[];
  SOLIDE: string[];
  LIQUIDE: string[];
  ETAT_Q: ScQaWhy[];
  EAU_SALEE: { salee: string[]; douce: string[] };
}

(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || ({} as ScApi));

  SC.SAISONS = [
    {
      id: 'hiver',
      label: "L'hiver",
      icon: '❄️',
      erable: 'Branches nues',
      jour: 9,
      temp: 'Très froid (souvent sous 0 °C)',
      precip: 'Neige, parfois de la pluie verglaçante',
      vetements: '🧥 manteau, 🧢 tuque, 🧤 mitaines, 🥾 bottes',
      activites: [
        '🧤 Mettre ses mitaines et sa tuque',
        '⛄ Faire un bonhomme de neige',
        '⛸️ Patiner sur la patinoire dehors',
        '🛷 Glisser en traîneau',
      ],
    },
    {
      id: 'printemps',
      label: 'Le printemps',
      icon: '🌱',
      erable: 'Bourgeons et petites feuilles',
      jour: 13,
      temp: 'De plus en plus doux',
      precip: 'Pluie, la neige fond',
      vetements: '🧥 imperméable, 🥾 bottes de pluie',
      activites: ['🍁 Aller à la cabane à sucre', '🌷 Voir les premières fleurs sortir', '☔ Sauter dans les flaques de neige fondue'],
    },
    {
      id: 'ete',
      label: "L'été",
      icon: '☀️',
      erable: 'Grandes feuilles vertes',
      jour: 15,
      temp: 'Chaud',
      precip: 'Pluie, orages, parfois de la grêle',
      vetements: '👕 t-shirt, 🩳 short, 🧢 casquette',
      activites: [
        '🩱 Mettre son maillot pour se baigner au lac',
        '🍓 Cueillir des fraises des champs',
        '🏖️ Jouer dans le sable à la plage',
      ],
    },
    {
      id: 'automne',
      label: "L'automne",
      icon: '🍂',
      erable: 'Feuilles rouges et orange qui tombent',
      jour: 11,
      temp: 'De plus en plus frais',
      precip: 'Pluie, première neige',
      vetements: '🧥 veste chaude',
      activites: ['🍂 Ramasser les feuilles mortes', '🍎 Cueillir des pommes au verger', '🎃 Choisir une citrouille'],
    },
  ];
  SC.saison = (id) => SC.SAISONS.find((s) => s.id === id);

  SC.PRECIP = [
    { id: 'pluie', label: '🌧️ La pluie', def: "Des gouttes d'eau liquide qui tombent des nuages" },
    { id: 'neige', label: '🌨️ La neige', def: 'Des flocons de glace légers' },
    { id: 'grele', label: '🧊 La grêle', def: 'Des billes de glace dures, souvent pendant un orage' },
    { id: 'verglas', label: '🥶 La pluie verglaçante', def: 'De la pluie qui gèle en touchant le sol froid' },
  ];

  SC.ASTRES = [
    { id: 'soleil', label: '☀️ Le Soleil', type: 'Une étoile', def: 'Il fait sa propre lumière et sa chaleur.' },
    { id: 'terre', label: '🌍 La Terre', type: 'Une planète', def: 'On vit dessus. Elle tourne sur elle-même et autour du Soleil.' },
    {
      id: 'lune',
      label: '🌙 La Lune',
      type: 'Un satellite naturel',
      def: 'Elle tourne autour de la Terre. Elle est éclairée par le Soleil.',
    },
  ];
  SC.CIEL_VF = [
    {
      t: 'La Lune fait sa propre lumière.',
      v: false,
      e: 'Faux ! La Lune ne fait pas de lumière : elle est <b>éclairée par le Soleil</b>, comme un miroir.',
    },
    {
      t: 'Le Soleil est une étoile.',
      v: true,
      e: "Vrai ! Le Soleil est une étoile : il fait sa propre lumière. C'est l'étoile la plus proche de nous.",
    },
    {
      t: 'La Terre tourne sur elle-même en un jour.',
      v: true,
      e: "Vrai ! En un jour (24 heures), la Terre fait un tour sur elle-même : c'est ce qui fait le jour et la nuit.",
    },
    {
      t: 'Chaque jour, le Soleil tourne autour de la Terre.',
      v: false,
      e: "Faux ! Le Soleil semble bouger dans le ciel, mais c'est <b>la Terre qui tourne sur elle-même</b>.",
    },
    {
      t: "Quand il fait jour au Québec, il fait nuit de l'autre côté de la Terre.",
      v: true,
      e: "Vrai ! Le côté de la Terre qui fait face au Soleil est éclairé (le jour); l'autre côté est dans l'ombre (la nuit).",
    },
    { t: 'La Terre est une étoile.', v: false, e: 'Faux ! La Terre est une <b>planète</b>. Elle ne fait pas sa propre lumière.' },
    {
      t: 'On voit parfois la Lune pendant le jour.',
      v: true,
      facile: true,
      e: 'Vrai ! Certains jours, on voit la Lune dans le ciel bleu, en même temps que le Soleil.',
    },
    {
      t: 'La Lune tourne autour de la Terre.',
      v: true,
      facile: true,
      e: "Vrai ! La Lune est le satellite naturel de la Terre : elle tourne autour d'elle.",
    },
    {
      t: 'Le Soleil est une planète.',
      v: false,
      facile: true,
      e: 'Faux ! Le Soleil est une <b>étoile</b> : il fait sa propre lumière et sa chaleur.',
    },
    {
      t: 'On peut regarder le Soleil directement, sans danger.',
      v: false,
      facile: true,
      e: 'Faux ! Il ne faut <b>jamais</b> regarder le Soleil directement : ça abîme les yeux.',
    },
    {
      t: 'Le Soleil nous donne de la lumière et de la chaleur.',
      v: true,
      facile: true,
      e: 'Vrai ! Le Soleil nous éclaire et nous réchauffe.',
    },
    {
      t: 'La forme de la Lune semble changer au fil des jours.',
      v: true,
      e: 'Vrai ! On voit parfois un croissant, parfois la pleine lune : on ne voit pas toujours la même partie éclairée.',
    },
  ];
  /** Jour ou nuit ? (indices sûrs seulement) */
  SC.JOUR_NUIT = {
    jour: [
      '☀️ Le Soleil éclaire le ciel',
      "🏫 On va à l'école",
      '🥣 On déjeune le matin',
      '🌈 On voit un arc-en-ciel',
      '😎 On porte des lunettes de soleil',
    ],
    nuit: [
      '⭐ On voit les étoiles',
      '🛏️ On dort dans son lit',
      '🦇 La chauve-souris chasse',
      '🌃 Le ciel est noir',
      '🏮 Les lampadaires de la rue sont allumés',
    ],
  };
  /** Questions simples sur les astres (une seule bonne réponse parmi Soleil, Terre, Lune). */
  SC.ASTRE_Q = [
    { t: 'Qui nous éclaire pendant le jour ?', a: 'soleil', e: "Le <b>Soleil</b> nous éclaire le jour. C'est une étoile." },
    {
      t: 'Lequel fait sa propre lumière ?',
      a: 'soleil',
      e: 'Le <b>Soleil</b> est une étoile : il fait sa propre lumière. La Lune est seulement éclairée par lui.',
    },
    { t: 'Sur quelle planète vivons-nous ?', a: 'terre', e: 'Nous vivons sur la <b>Terre</b>, une planète.' },
    { t: 'Lequel tourne autour de la Terre ?', a: 'lune', e: "La <b>Lune</b> tourne autour de la Terre : c'est son satellite naturel." },
    { t: 'Lequel est une étoile ?', a: 'soleil', e: 'Le <b>Soleil</b> est une étoile, la plus proche de nous.' },
    { t: 'Lequel est un satellite naturel ?', a: 'lune', e: 'La <b>Lune</b> est un satellite naturel : elle tourne autour de la Terre.' },
  ];
  /** Questions de défi (lvl 2) : jour, nuit, ombre. */
  SC.CIEL_Q2 = [
    {
      t: 'Pourquoi fait-il nuit ?',
      a: 'Notre côté de la Terre ne fait plus face au Soleil',
      d: [
        ["Le Soleil s'éteint le soir", "Le Soleil ne s'éteint jamais : c'est la Terre qui tourne."],
        ['La Lune cache le Soleil', "Non : la nuit, c'est notre côté de la Terre qui est dans l'ombre."],
      ],
      e: "La Terre tourne sur elle-même. Quand notre côté ne fait plus face au Soleil, il est dans l'ombre : il fait <b>nuit</b>.",
    },
    {
      t: 'En combien de temps la Terre fait-elle un tour sur elle-même ?',
      a: 'En un jour (24 heures)',
      d: [
        ['En une heure', "C'est beaucoup plus long : un tour complet prend une journée."],
        ['En une semaine', 'Non : sinon, la nuit durerait plusieurs jours !'],
      ],
      e: "La Terre fait un tour sur elle-même en <b>un jour</b> (24 heures) : c'est ce qui fait le jour et la nuit.",
    },
    {
      t: 'Pourquoi voit-on la Lune briller la nuit ?',
      a: 'Elle est éclairée par le Soleil',
      d: [
        ['Elle fait sa propre lumière', 'La Lune ne fait pas de lumière : elle renvoie celle du Soleil.'],
        ['Elle est en feu', "La Lune n'est pas en feu : c'est une grosse boule de roche."],
      ],
      e: 'La Lune est <b>éclairée par le Soleil</b>, comme un miroir. Elle ne fait pas sa propre lumière.',
    },
    {
      t: 'À midi, le Soleil est très haut. Ton ombre est…',
      a: 'courte',
      d: [
        ['très longue', "Une ombre très longue, c'est quand le Soleil est bas : le matin ou le soir."],
        ['du même côté que le Soleil', "L'ombre est toujours du côté opposé au Soleil."],
      ],
      e: "À <b>midi</b>, le Soleil est haut : l'ombre est <b>courte</b>.",
    },
    {
      t: 'Le soir, le Soleil est bas dans le ciel. Ton ombre est…',
      a: 'longue',
      d: [
        ['courte', "L'ombre est courte quand le Soleil est haut, vers midi."],
        ['du même côté que le Soleil', "L'ombre est toujours du côté opposé au Soleil."],
      ],
      e: "Quand le Soleil est <b>bas</b>, l'ombre est <b>longue</b>.",
    },
    {
      t: 'Le Soleil semble traverser le ciel pendant la journée. Pourquoi ?',
      a: "C'est la Terre qui tourne sur elle-même",
      d: [
        ['Le Soleil tourne autour de la Terre chaque jour', "Ça en a l'air, mais c'est la Terre qui tourne."],
        ['Le vent pousse le Soleil', 'Le vent ne peut pas pousser le Soleil !'],
      ],
      e: "Le Soleil ne bouge pas autour de nous : c'est <b>la Terre qui tourne</b> sur elle-même, et on voit le Soleil se déplacer dans le ciel.",
    },
  ];
  SC.SAISON_Q = [
    {
      t: 'En été, au Québec, les journées sont…',
      a: "plus longues qu'en hiver",
      d: ["plus courtes qu'en hiver", "aussi longues qu'en hiver"],
      e: 'En été, le Soleil se lève tôt et se couche tard : les journées sont <b>plus longues</b>. En hiver, il fait noir très tôt.',
    },
    {
      t: 'En hiver, au Québec, il fait noir…',
      a: "plus tôt le soir qu'en été",
      d: ["plus tard le soir qu'en été", 'jamais'],
      e: 'En hiver, les journées sont courtes : il fait noir <b>tôt</b>, parfois avant le souper.',
    },
    {
      t: "En automne, les feuilles de l'érable…",
      a: 'deviennent rouges ou orange, puis tombent',
      d: ['deviennent bleues', "restent vertes tout l'hiver"],
      e: "En automne, les feuilles de l'érable changent de couleur, puis tombent. L'arbre passe l'hiver avec ses branches nues.",
    },
    {
      t: 'Au printemps, la neige…',
      a: 'fond',
      d: ['devient plus épaisse', 'devient de la grêle'],
      e: "Au printemps, il fait de plus en plus doux : la neige <b>fond</b> et devient de l'eau.",
    },
    {
      t: "La pluie verglaçante, c'est…",
      a: 'de la pluie qui gèle en touchant le sol froid',
      d: ['de la neige très légère', 'de la pluie chaude'],
      e: 'La pluie verglaçante tombe liquide, puis <b>gèle</b> en touchant le sol, les arbres et les fils : tout devient glacé !',
    },
    {
      t: 'En été, au Québec, il fait…',
      a: 'chaud',
      d: ['très froid', 'toujours sous 0 °C'],
      e: "L'été, c'est la saison la plus chaude au Québec.",
    },
  ];

  /* ---- États de l'eau ---- */
  SC.SOLIDE = ['🧊 le glaçon', '🪨 la roche', '❄️ le flocon de neige', '🪵 la bûche', '🥄 la cuillère', '🧱 la brique'];
  SC.LIQUIDE = ['🥛 le lait', '🧃 le jus', "💧 l'eau du robinet", '🌧️ la pluie', "🫗 l'huile", '🥤 la limonade'];
  /** États et changements d'état (défi). */
  SC.ETAT_Q = [
    {
      t: "La glace, c'est de l'eau…",
      a: 'solide',
      d: [
        ['liquide', "L'eau liquide coule. La glace garde sa forme : elle est solide."],
        ['gazeuse', "L'eau gazeuse, c'est la vapeur, invisible."],
      ],
      e: "La glace est de l'eau <b>solide</b> : elle garde sa forme.",
    },
    {
      t: "La vapeur d'eau, c'est de l'eau…",
      a: 'gazeuse',
      d: [
        ['solide', 'Le solide garde sa forme, comme la glace.'],
        ['liquide', "Le liquide coule, comme l'eau du robinet."],
      ],
      e: "La vapeur est de l'eau à l'état de <b>gaz</b> : elle est invisible et se mélange à l'air.",
    },
    {
      t: "L'eau du robinet, c'est de l'eau…",
      a: 'liquide',
      d: [
        ['solide', "Elle coule : elle n'est pas solide."],
        ['gazeuse', "On la voit couler : ce n'est pas de la vapeur."],
      ],
      e: "L'eau du robinet est <b>liquide</b> : elle coule et prend la forme du verre.",
    },
    {
      t: "Quand l'eau liquide devient de la glace, on dit qu'elle…",
      a: 'gèle',
      d: [
        ['fond', "Fondre, c'est le contraire : la glace devient liquide."],
        ['bout', "Bouillir, c'est quand l'eau devient très chaude."],
      ],
      e: "L'eau <b>gèle</b> quand il fait très froid : le liquide devient solide.",
    },
    {
      t: "Quand la glace devient de l'eau liquide, on dit qu'elle…",
      a: 'fond',
      d: [
        ['gèle', "Geler, c'est le contraire : le liquide devient solide."],
        ["s'évapore", "S'évaporer, c'est devenir de la vapeur."],
      ],
      e: 'La glace <b>fond</b> quand on la réchauffe : le solide devient liquide.',
    },
    {
      t: "Une flaque sèche au soleil. L'eau…",
      a: "s'évapore",
      d: [
        ['gèle', "Il fait chaud au soleil : l'eau ne peut pas geler."],
        ['entre dans le soleil', "L'eau ne va pas dans le soleil : elle part dans l'air."],
      ],
      e: "L'eau de la flaque <b>s'évapore</b> : elle devient de la vapeur invisible qui part dans l'air.",
    },
    {
      t: "Après une douche chaude, le miroir est couvert de gouttes. D'où viennent-elles ?",
      a: 'De la vapeur qui refroidit sur le miroir',
      d: [
        ['Le miroir fond', 'Un miroir ne fond pas sous la douche !'],
        ['Il pleut dans la salle de bain', "Il ne pleut pas dans la maison : c'est la vapeur de la douche."],
      ],
      e: "La vapeur de la douche chaude touche le miroir froid : elle <b>refroidit</b> et redevient de petites gouttes d'eau.",
    },
  ];
  SC.EAU_SALEE = { salee: ['🌊 la mer', "🐋 l'océan"], douce: ['🛶 le lac', '🏞️ la rivière', '🌧️ la pluie', "🚰 l'eau du robinet"] };
})();
