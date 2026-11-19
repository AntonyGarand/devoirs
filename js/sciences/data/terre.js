/* =====================================================================
   sciences/data/terre.js — saisons, précipitations, astres, eau (HLD § 3, § 5.1)
   Règle : on DÉCRIT les saisons, on n'explique jamais leur cause (3e cycle).
   La vapeur d'eau est invisible; le « nuage » au-dessus de la bouilloire = minuscules gouttes.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || {});

  SC.SAISONS = [
    { id: 'hiver', label: 'L\'hiver', icon: '❄️', erable: 'Branches nues', jour: 9, temp: 'Très froid (souvent sous 0 °C)', precip: 'Neige, parfois de la pluie verglaçante', vetements: '🧥 manteau, 🧢 tuque, 🧤 mitaines, 🥾 bottes',
      activites: ['🧤 Mettre ses mitaines et sa tuque', '⛄ Faire un bonhomme de neige', '⛸️ Patiner sur la patinoire dehors', '🛷 Glisser en traîneau'] },
    { id: 'printemps', label: 'Le printemps', icon: '🌱', erable: 'Bourgeons et petites feuilles', jour: 13, temp: 'De plus en plus doux', precip: 'Pluie, la neige fond', vetements: '🧥 imperméable, 🥾 bottes de pluie',
      activites: ['🍁 Aller à la cabane à sucre', '🌷 Voir les premières fleurs sortir', '☔ Sauter dans les flaques de neige fondue'] },
    { id: 'ete', label: 'L\'été', icon: '☀️', erable: 'Grandes feuilles vertes', jour: 15, temp: 'Chaud', precip: 'Pluie, orages, parfois de la grêle', vetements: '👕 t-shirt, 🩳 short, 🧢 casquette',
      activites: ['🩱 Mettre son maillot pour se baigner au lac', '🍓 Cueillir des fraises des champs', '🏖️ Jouer dans le sable à la plage'] },
    { id: 'automne', label: 'L\'automne', icon: '🍂', erable: 'Feuilles rouges et orange qui tombent', jour: 11, temp: 'De plus en plus frais', precip: 'Pluie, première neige', vetements: '🧥 veste chaude',
      activites: ['🍂 Ramasser les feuilles mortes', '🍎 Cueillir des pommes au verger', '🎃 Choisir une citrouille'] },
  ];
  SC.saison = (id) => SC.SAISONS.find((s) => s.id === id);

  SC.PRECIP = [
    { id: 'pluie', label: '🌧️ La pluie', def: 'Des gouttes d\'eau liquide qui tombent des nuages' },
    { id: 'neige', label: '🌨️ La neige', def: 'Des flocons de glace légers' },
    { id: 'grele', label: '🧊 La grêle', def: 'Des billes de glace dures, souvent pendant un orage' },
    { id: 'verglas', label: '🥶 La pluie verglaçante', def: 'De la pluie qui gèle en touchant le sol froid' },
  ];

  SC.ASTRES = [
    { id: 'soleil', label: '☀️ Le Soleil', type: 'Une étoile', def: 'Il fait sa propre lumière et sa chaleur.' },
    { id: 'terre', label: '🌍 La Terre', type: 'Une planète', def: 'On vit dessus. Elle tourne sur elle-même et autour du Soleil.' },
    { id: 'lune', label: '🌙 La Lune', type: 'Un satellite naturel', def: 'Elle tourne autour de la Terre. Elle est éclairée par le Soleil.' },
  ];
  SC.CIEL_VF = [
    { t: 'La Lune fait sa propre lumière.', v: false, e: 'Faux ! La Lune ne fait pas de lumière : elle est <b>éclairée par le Soleil</b>, comme un miroir.' },
    { t: 'Le Soleil est une étoile.', v: true, e: 'Vrai ! Le Soleil est une étoile : il fait sa propre lumière. C\'est l\'étoile la plus proche de nous.' },
    { t: 'La Terre tourne sur elle-même en un jour.', v: true, e: 'Vrai ! En un jour (24 heures), la Terre fait un tour sur elle-même : c\'est ce qui fait le jour et la nuit.' },
    { t: 'Chaque jour, le Soleil tourne autour de la Terre.', v: false, e: 'Faux ! Le Soleil semble bouger dans le ciel, mais c\'est <b>la Terre qui tourne sur elle-même</b>.' },
    { t: 'Quand il fait jour au Québec, il fait nuit de l\'autre côté de la Terre.', v: true, e: 'Vrai ! Le côté de la Terre qui fait face au Soleil est éclairé (le jour); l\'autre côté est dans l\'ombre (la nuit).' },
    { t: 'La Terre est une étoile.', v: false, e: 'Faux ! La Terre est une <b>planète</b>. Elle ne fait pas sa propre lumière.' },
  ];
  SC.SAISON_Q = [
    { t: 'En été, au Québec, les journées sont…', a: 'plus longues qu\'en hiver', d: ['plus courtes qu\'en hiver', 'aussi longues qu\'en hiver'], e: 'En été, le Soleil se lève tôt et se couche tard : les journées sont <b>plus longues</b>. En hiver, il fait noir très tôt.' },
    { t: 'En hiver, au Québec, il fait noir…', a: 'plus tôt le soir qu\'en été', d: ['plus tard le soir qu\'en été', 'jamais'], e: 'En hiver, les journées sont courtes : il fait noir <b>tôt</b>, parfois avant le souper.' },
    { t: 'En automne, les feuilles de l\'érable…', a: 'deviennent rouges ou orange, puis tombent', d: ['deviennent bleues', 'restent vertes tout l\'hiver'], e: 'En automne, les feuilles de l\'érable changent de couleur, puis tombent. L\'arbre passe l\'hiver avec ses branches nues.' },
    { t: 'Au printemps, la neige…', a: 'fond', d: ['devient plus épaisse', 'devient de la grêle'], e: 'Au printemps, il fait de plus en plus doux : la neige <b>fond</b> et devient de l\'eau.' },
    { t: 'La pluie verglaçante, c\'est…', a: 'de la pluie qui gèle en touchant le sol froid', d: ['de la neige très légère', 'de la pluie chaude'], e: 'La pluie verglaçante tombe liquide, puis <b>gèle</b> en touchant le sol, les arbres et les fils : tout devient glacé !' },
    { t: 'En été, au Québec, il fait…', a: 'chaud', d: ['très froid', 'toujours sous 0 °C'], e: 'L\'été, c\'est la saison la plus chaude au Québec.' },
  ];

  /* ---- États de l'eau ---- */
  SC.SOLIDE = ['🧊 le glaçon', '🪨 la roche', '❄️ le flocon de neige', '🪵 la bûche', '🥄 la cuillère', '🧱 la brique'];
  SC.LIQUIDE = ['🥛 le lait', '🧃 le jus', '💧 l\'eau du robinet', '🌧️ la pluie', '🫗 l\'huile', '🥤 la limonade'];
  SC.EAU_SALEE = { salee: ['🌊 la mer', '🐋 l\'océan'], douce: ['🛶 le lac', '🏞️ la rivière', '🌧️ la pluie', '🚰 l\'eau du robinet'] };
})();
