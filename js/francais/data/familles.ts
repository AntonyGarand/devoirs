/* =====================================================================
   data/familles.js — familles de mots, homophones, mots réels interdits comme fautes
     FAMILLES : { id, em, mots:[…] (le premier = mot de base), piege:[faux amis sonores],
                  loin:[mots de même thème mais d'une autre famille] }
     HOMOPHONES : groupes de mots qui se prononcent pareil (jamais distracteur l'un de l'autre;
                  une phrase de contexte est obligatoire en dictée)
     REELS : mots courants qui ne doivent jamais être proposés comme « faute »
   ===================================================================== */

/** Famille de mots : mots[0] = mot de base; piege = faux amis sonores; loin = même thème, autre famille. */
interface FrFamille {
  id: string;
  em: string;
  mots: string[];
  piege: string[];
  loin: string[];
}
interface FrancaisApi {
  FAMILLES: FrFamille[];
  /** Groupes de mots qui se prononcent pareil. */
  HOMOPHONES: string[][];
  /** Mots réels courants jamais proposés comme faute. */
  REELS: string[];
}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi);
  M.FR.FAMILLES = [
    { id: 'fleur', em: '🌸', mots: ['fleur', 'fleuriste', 'fleurir'], piege: ['fleuve'], loin: ['jardin', 'tulipe'] },
    { id: 'dent', em: '🦷', mots: ['dent', 'dentiste', 'dentier'], piege: ['danse', 'dans'], loin: ['bouche', 'brosse'] },
    { id: 'jardin', em: '🌻', mots: ['jardin', 'jardinier', 'jardiner'], piege: ['jaune'], loin: ['légume', 'pelle'] },
    { id: 'chant', em: '🎵', mots: ['chanter', 'chanson', 'chanteur'], piege: ['champ', 'chandail'], loin: ['musique', 'piano'] },
    { id: 'jeu', em: '🎲', mots: ['jeu', 'jouer', 'jouet', 'joueur'], piege: ['jeudi', 'jupe'], loin: ['ballon', 'parc'] },
    { id: 'lait', em: '🥛', mots: ['lait', 'laitier', 'laitage'], piege: ['laine', 'laid'], loin: ['vache', 'fromage'] },
    { id: 'chat', em: '🐱', mots: ['chat', 'chaton', 'chatte'], piege: ['château', 'chapeau'], loin: ['souris', 'chien'] },
    { id: 'poisson', em: '🐟', mots: ['poisson', 'poissonnerie', 'poissonnier'], piege: ['poison'], loin: ['lac', 'bateau'] },
    { id: 'pomme', em: '🍎', mots: ['pomme', 'pommier'], piege: ['pompier', 'pompe'], loin: ['poire', 'fruit'] },
    { id: 'patin', em: '⛸️', mots: ['patin', 'patiner', 'patineur', 'patinoire'], piege: ['patate'], loin: ['glace', 'hiver'] },
    { id: 'neige', em: '❄️', mots: ['neige', 'neiger', 'enneigé'], piege: ['neuf', 'nez'], loin: ['hiver', 'tuque'] },
    { id: 'grand', em: '🦒', mots: ['grand', 'grandir', 'grandeur'], piege: ['grange'], loin: ['haut', 'long'] },
    { id: 'ecole', em: '🏫', mots: ['école', 'écolier', 'écolière'], piege: ['écorce'], loin: ['classe', 'pupitre'] },
    { id: 'lire', em: '📖', mots: ['lire', 'lecture', 'lecteur'], piege: ['lion', 'lime'], loin: ['livre', 'page'] },
    { id: 'dessin', em: '🖍️', mots: ['dessin', 'dessiner', 'dessinateur'], piege: ['dessert', 'dessous'], loin: ['crayon', 'papier'] },
    { id: 'danse', em: '💃', mots: ['danse', 'danser', 'danseur'], piege: ['dent', 'dans'], loin: ['musique', 'fête'] },
    { id: 'nage', em: '🏊', mots: ['nager', 'nageur', 'nage'], piege: ['neige', 'nappe'], loin: ['piscine', 'lac'] },
    { id: 'cuisine', em: '🍳', mots: ['cuisine', 'cuisiner', 'cuisinier'], piege: ['cuisse'], loin: ['four', 'assiette'] },
    { id: 'sucre', em: '🍬', mots: ['sucre', 'sucré', 'sucrier'], piege: ['sucette'], loin: ['bonbon', 'gâteau'] },
    { id: 'froid', em: '🥶', mots: ['froid', 'refroidir', 'froidure'], piege: ['fraise', 'froisser'], loin: ['hiver', 'glace'] },
    { id: 'chaud', em: '🥵', mots: ['chaud', 'chaleur', 'réchauffer'], piege: ['chaussure', 'chaussette'], loin: ['soleil', 'été'] },
    { id: 'terre', em: '🌍', mots: ['terre', 'terrain', 'enterrer'], piege: ['terrible'], loin: ['ciel', 'roche'] },
    { id: 'jour', em: '🌞', mots: ['jour', 'journée', 'bonjour'], piege: ['jouet', 'jouer'], loin: ['matin', 'soir'] },
    { id: 'nuit', em: '🌙', mots: ['nuit', 'minuit'], piege: ['nuage'], loin: ['lune', 'étoile'] },
    { id: 'blanc', em: '⚪', mots: ['blanc', 'blanche', 'blanchir'], piege: ['blague'], loin: ['neige', 'noir'] },
    { id: 'rouge', em: '🔴', mots: ['rouge', 'rougir'], piege: ['route', 'roue'], loin: ['vert', 'fraise'] },
    { id: 'ferme', em: '🚜', mots: ['ferme', 'fermier', 'fermière'], piege: ['fer'], loin: ['vache', 'tracteur'] },
    { id: 'ski', em: '⛷️', mots: ['ski', 'skier', 'skieur'], piege: ['skate'], loin: ['neige', 'montagne'] },
    { id: 'glace', em: '🧊', mots: ['glace', 'glaçon', 'glacier'], piege: ['glaise'], loin: ['froid', 'eau'] },
    { id: 'peinture', em: '🎨', mots: ['peinture', 'peindre', 'peintre'], piege: ['pain', 'peigne'], loin: ['pinceau', 'couleur'] },
    { id: 'enfant', em: '🧒', mots: ['enfant', 'enfance', 'enfantin'], piege: ['enfin', 'en face'], loin: ['bébé', 'école'] },
    { id: 'long', em: '📏', mots: ['long', 'longue', 'longueur', 'allonger'], piege: ['loup', 'loin'], loin: ['court', 'grand'] },
    { id: 'dormir', em: '😴', mots: ['dormir', 'endormi', 'dortoir'], piege: ['dorer', 'dos'], loin: ['lit', 'nuit'] },
    { id: 'maison', em: '🏠', mots: ['maison', 'maisonnette'], piege: ['maïs', 'mais'], loin: ['toit', 'porte'] },
  ];

  M.FR.HOMOPHONES = [
    ['vert', 'verre', 'ver', 'vers'],
    ['mer', 'mère', 'maire'],
    ['cent', 'sans', 'sang'],
    ['pain', 'pin', 'peint'],
    ['eau', 'haut', 'au', 'oh', 'os'],
    ['cou', 'coup', 'coût'],
    ['dans', 'dent'],
    ['mot', 'maux'],
    ['ou', 'où'],
    ['et', 'est', 'ai'],
    ['son', 'sont'],
    ['on', 'ont'],
    ['a', 'à', 'as'],
    ['la', 'là', 'las'],
    ['mais', 'mes', 'mai', 'met', 'mets'],
    ['sept', 'cet', 'cette', 'set'],
    ['fois', 'foie', 'foi'],
    ['vent', 'vend', 'vends'],
    ['nom', 'non'],
    ['père', 'paire', 'pair', 'perd'],
    ['tant', 'temps', 'taon', 'tend'],
    ['cour', 'court', 'cours'],
    ['peau', 'pot'],
    ['peu', 'peut', 'peux'],
    ['près', 'prêt'],
    ['sur', 'sûr'],
    ['voix', 'voie', 'vois', 'voit'],
    ['vingt', 'vin', 'vain'],
    ['lait', 'laid', 'les'],
    ['faux', 'faut'],
    ['patte', 'pâte'],
    ['quand', 'camp', 'quant'],
    ['ton', 'thon'],
    ['vie', 'vis', 'vit'],
    ['terre', 'taire'],
    ['an', 'en'],
    ['porc', 'port', 'pore'],
    ['ses', 'ces', "c'est"],
    ['fin', 'faim'],
    ['sel', 'selle'],
    ['signe', 'cygne'],
    ['tante', 'tente'],
    ['chant', 'champ'],
    ['point', 'poing'],
    ['saint', 'sein', 'sain'],
    ['mur', 'mûr'],
    ['chêne', 'chaîne'],
    ['bal', 'balle'],
    ['conte', 'compte'],
    ['lit', 'lie'],
    ['roue', 'roux'],
    ['boue', 'bout'],
    ['nez', 'né'],
    ['mal', 'malle'],
    ['air', 'aire', 'ère'],
    ['fil', 'file'],
    ['tard', 'tare'],
    ['si', 'scie', 'six'],
    ['dix', 'dis', 'dit'],
    ['pois', 'poids'],
    ['toi', 'toit'],
    ['cœur', 'chœur'],
    ['bois', 'boit'],
    ['tes', 'thé'],
    ['verre', 'vers'],
  ];
  /** Mots réels courants (en plus de MOTS et des homophones) jamais proposés comme faute. */
  M.FR.REELS = (
    'sol sole ballet balai bas bah sale salle sel sept ami amis amie lien lion bon bond don dont son sa ça ça sac seau sot ' +
    'saut sceau mou moue mot mots chant champ chants pont pot peau pots vent vend van vain vin vingt pin pain peint main maint mien ' +
    'rein rien ri riz roi rois loi lois foi fois foie mois moi noix voix vois voie bois boit pois poids chaud chaux show faux faut ' +
    'tant temps tend ton thon tond mon mont son sont son nom non nez né les lait laid mais mes met mai cou coup coût sou sous soûl ' +
    "tout toux houx doux d'où loup cri cris prix pris gris grise vert verre vers ver mer mère maire père paire pair perd " +
    'chat chas shah rat ras raz pas pâte patte date datte tache tâche pêche pèche mâle mal malle chêne chaîne tête tète fête faite ' +
    'reine renne rêne sale sel selle cane canne car quart part pare camp quand dans dent sang sans cent semaine poule pool ' +
    'fille file fil cil sil mille mil vile ville bal balle cal cale halle hall ballon'
  )
    .split(' ')
    .filter(Boolean);
})();
