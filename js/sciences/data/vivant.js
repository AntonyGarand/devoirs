/* =====================================================================
   sciences/data/vivant.js — plantes, cycles de vie, corps, sens, habitudes,
   produits du vivant, naturel / fabriqué, objets techniques (HLD § 3, § 5.1)
   Formulations validées : chrysalide (pas « cocon ») pour le monarque; la plante
   ne « mange » pas la terre (elle y puise de l'eau et des minéraux).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || {});

  /* ---- Plante : parties et rôles ---- */
  SC.PARTIES_PLANTE = [
    { id: 'racines', nom: 'les racines', label: 'Racines', role: 'Boivent l\'eau et les minéraux dans le sol', court: 'boivent l\'eau dans le sol', pl: true },
    { id: 'tige', nom: 'la tige', label: 'Tige', role: 'Tient la plante debout et transporte l\'eau', court: 'tient la plante debout', pl: false },
    { id: 'feuille', nom: 'les feuilles', label: 'Feuilles', role: 'Captent la lumière pour fabriquer la nourriture de la plante', court: 'captent la lumière du soleil', pl: true },
    { id: 'fleur', nom: 'la fleur', label: 'Fleur', role: 'Devient un fruit avec des graines', court: 'devient un fruit', pl: false },
    { id: 'fruit', nom: 'le fruit', label: 'Fruit', role: 'Protège les graines', court: 'protège les graines', pl: false, extra: true },
    { id: 'graine', nom: 'la graine', label: 'Graine', role: 'Peut devenir une nouvelle plante', court: 'devient une nouvelle plante', pl: false, extra: true },
  ];

  /* ---- Besoins ---- */
  SC.BESOINS_PLANTE = {
    oui: [{ id: 'eau', label: '💧 De l\'eau' }, { id: 'lumiere', label: '☀️ De la lumière' }, { id: 'air', label: '🌬️ De l\'air' }, { id: 'mineraux', label: '🟫 Des minéraux du sol', lvl: 1 }],
    non: [{ id: 'chocolat', label: '🍫 Du chocolat' }, { id: 'jouet', label: '🧸 Un jouet' }, { id: 'musique', label: '🎵 De la musique' }, { id: 'lait', label: '🥛 Du lait' }, { id: 'tele', label: '📺 La télévision' }, { id: 'bonbons', label: '🍬 Des bonbons' }],
  };
  SC.BESOINS_ANIMAL = {
    oui: [{ id: 'air', label: '🌬️ De l\'air pour respirer' }, { id: 'eau', label: '💧 De l\'eau' }, { id: 'nourriture', label: '🍽️ De la nourriture' }],
    non: [{ id: 'tele', label: '📺 La télévision' }, { id: 'jouet', label: '🧸 Un jouet' }, { id: 'bonbons', label: '🍬 Des bonbons' }, { id: 'velo', label: '🚲 Un vélo' }, { id: 'musique', label: '🎵 De la musique' }],
  };
  /** Pots de l'expérience : eau 0 rien · 1 un peu · 2 juste assez · 3 trop; lumière 0 placard · 1 ombre · 2 fenêtre. */
  SC.POTS = [
    { id: 'ok', eau: 2, lum: 2, texte: 'De l\'eau juste assez, près de la fenêtre', best: true },
    { id: 'sec', eau: 0, lum: 2, texte: 'Pas d\'eau, près de la fenêtre', why: 'Sans eau, la plante se fane : ses racines n\'ont rien à boire.' },
    { id: 'noir', eau: 2, lum: 0, texte: 'De l\'eau, dans un placard noir', why: 'Sans lumière, la plante devient pâle et faible.' },
    { id: 'noye', eau: 3, lum: 2, texte: 'Beaucoup trop d\'eau, près de la fenêtre', why: 'Trop d\'eau, c\'est mauvais : les racines manquent d\'air.' },
  ];
  SC.PLANTE_VF = [
    { t: 'Une plante mange la terre.', v: false, e: 'Faux ! La plante ne mange pas la terre : ses <b>racines</b> y boivent de l\'eau et des minéraux. Avec la lumière, la plante fabrique elle-même sa nourriture dans ses feuilles.' },
    { t: 'Une plante a besoin de lumière pour bien pousser.', v: true, e: 'Vrai ! Sans lumière, la plante devient pâle et faible.' },
    { t: 'Une plante peut vivre longtemps sans eau.', v: false, e: 'Faux ! Sans eau, la plante se fane, puis elle meurt.' },
    { t: 'Les racines boivent l\'eau qui est dans le sol.', v: true, e: 'Vrai ! Les racines boivent l\'eau, puis la tige la transporte jusqu\'aux feuilles.' },
    { t: 'Une plante a besoin d\'air.', v: true, e: 'Vrai ! Comme nous, la plante a besoin d\'air. Même ses racines en ont besoin : c\'est pour ça que trop d\'eau lui fait du mal.' },
    { t: 'Plus on donne d\'eau à une plante, mieux elle pousse.', v: false, e: 'Faux ! Trop d\'eau noie les racines : elles manquent d\'air. Il faut de l\'eau <b>juste assez</b>.' },
  ];

  /* ---- Cycles de vie (art = dessin si l'emoji n'existe pas) ---- */
  SC.CYCLES = {
    poule: { titre: 'La poule', icon: '🐔', stades: [
      { id: 'oeuf', emoji: '🥚', label: 'L\'œuf', texte: 'La poule pond un œuf. Le poussin grandit dedans pendant 3 semaines.' },
      { id: 'eclot', emoji: '🐣', label: 'L\'éclosion', texte: 'Le poussin casse sa coquille avec son bec : il éclot !' },
      { id: 'poussin', emoji: '🐥', label: 'Le poussin', texte: 'Le poussin est couvert de duvet. Il mange des grains et grandit.' },
      { id: 'poule', emoji: '🐔', label: 'La poule', texte: 'Devenue adulte, la poule pourra pondre des œufs à son tour.' },
    ] },
    grenouille: { titre: 'La grenouille', icon: '🐸', stades: [
      { id: 'oeufs', art: 'sc-frai', emoji: '🫧', label: 'Les œufs', texte: 'La grenouille pond des œufs dans l\'eau, collés ensemble comme de la gelée.' },
      { id: 'tetard', art: 'sc-tetard', emoji: '〰️', label: 'Le têtard', texte: 'Le têtard vit dans l\'eau. Il a une queue et respire avec des branchies.' },
      { id: 'pattes', art: 'sc-tetard-pattes', emoji: '🦵', label: 'Le têtard à pattes', texte: 'Ses pattes poussent, d\'abord en arrière, puis en avant. Sa queue raccourcit.' },
      { id: 'grenouille', emoji: '🐸', label: 'La grenouille', texte: 'Devenue adulte, elle respire de l\'air et peut sortir de l\'eau.' },
    ] },
    monarque: { titre: 'Le monarque', icon: '🦋', stades: [
      { id: 'oeuf', art: 'sc-oeuf-papillon', emoji: '⚪', label: 'L\'œuf', texte: 'Le papillon pond un tout petit œuf sous une feuille d\'asclépiade.' },
      { id: 'chenille', emoji: '🐛', label: 'La chenille', texte: 'La chenille mange des feuilles d\'asclépiade et grossit beaucoup.' },
      { id: 'chrysalide', art: 'sc-chrysalide', emoji: '💚', label: 'La chrysalide', texte: 'La chenille se transforme dans une chrysalide verte (le cocon, c\'est pour les papillons de nuit).' },
      { id: 'papillon', emoji: '🦋', label: 'Le papillon', texte: 'Le papillon sort de la chrysalide. Il boit le nectar des fleurs.' },
    ] },
    haricot: { titre: 'Le haricot', icon: '🫘', stades: [
      { id: 'graine', art: 'sc-graine', emoji: '🫘', label: 'La graine', texte: 'On plante une graine de haricot dans la terre humide.' },
      { id: 'germe', emoji: '🌱', label: 'La graine germe', texte: 'Une racine sort, puis une petite tige avec deux feuilles.' },
      { id: 'plant', emoji: '🌿', label: 'La jeune plante', texte: 'La plante grandit et fait beaucoup de feuilles.' },
      { id: 'gousse', art: 'sc-gousse', emoji: '🫛', label: 'Fleurs et haricots', texte: 'Les fleurs deviennent des haricots. Dedans, il y a de nouvelles graines !' },
    ] },
  };
  // Emoji récents (U14–U15) : remplacés par un dessin s'ils ne s'affichent pas
  SC.CYCLES.haricot.stades[0].recent = true;
  SC.CYCLES.haricot.stades[3].recent = true;

  /* ---- Corps humain (vu de face; jamais gauche / droite) ---- */
  SC.CORPS = [
    { id: 'tete', nom: 'la tête', label: 'Tête' }, { id: 'cou', nom: 'le cou', label: 'Cou' }, { id: 'epaule', nom: 'l\'épaule', label: 'Épaule' },
    { id: 'bras', nom: 'le bras', label: 'Bras' }, { id: 'coude', nom: 'le coude', label: 'Coude' }, { id: 'main', nom: 'la main', label: 'Main' },
    { id: 'ventre', nom: 'le ventre', label: 'Ventre' }, { id: 'jambe', nom: 'la jambe', label: 'Jambe' }, { id: 'genou', nom: 'le genou', label: 'Genou' },
    { id: 'pied', nom: 'le pied', label: 'Pied' },
  ];
  SC.FONCTIONS = [
    { id: 'coeur', left: '❤️ Le cœur', right: 'Pompe le sang dans tout le corps' },
    { id: 'estomac', left: '🍽️ L\'estomac', right: 'Digère les aliments' },
    { id: 'poumons', left: '🫁 Les poumons', right: 'Font entrer l\'air quand on respire' },
    { id: 'cerveau', left: '🧠 Le cerveau', right: 'Pense et commande le corps' },
    { id: 'jambes', left: '🦵 Les jambes', right: 'Servent à marcher et à courir' },
    { id: 'mains', left: '✋ Les mains', right: 'Servent à prendre les objets' },
    { id: 'squelette', left: '🦴 Les os', right: 'Tiennent le corps solide' },
  ];
  SC.HABITUDES = {
    saine: ['😴 Dormir environ 10 heures', '🪥 Se brosser les dents matin et soir', '⚽ Jouer dehors', '🥕 Manger des fruits et des légumes', '🧼 Se laver les mains avant de manger', '💧 Boire de l\'eau quand on a soif'],
    pas: ['📺 Regarder un écran jusque tard le soir', '🌙 Se coucher très tard tous les soirs', '🥤 Boire des boissons gazeuses tous les jours', '🍬 Manger des bonbons à chaque repas', '🚽 Oublier de se laver les mains après la toilette', '🛋️ Rester assis toute la journée'],
  };

  /* ---- Les cinq sens ---- */
  SC.SENS = [
    { id: 'vue', sens: 'la vue', organe: 'les yeux', icon: '👁️', label: '👁️ La vue' },
    { id: 'ouie', sens: 'l\'ouïe', organe: 'les oreilles', icon: '👂', label: '👂 L\'ouïe' },
    { id: 'odorat', sens: 'l\'odorat', organe: 'le nez', icon: '👃', label: '👃 L\'odorat' },
    { id: 'gout', sens: 'le goût', organe: 'la langue', icon: '👅', label: '👅 Le goût' },
    { id: 'toucher', sens: 'le toucher', organe: 'la peau', icon: '✋', label: '✋ Le toucher' },
  ];
  /** Situations où UN SEUL sens donne l'information. */
  SC.SENS_Q = [
    { t: 'Tu veux savoir si ta soupe est trop salée. Tu la goûtes.', a: 'gout' },
    { t: 'La cloche de la récréation sonne : « Driiing ! »', a: 'ouie', audio: 'Driiiing !' },
    { t: 'Quelqu\'un sonne à la porte : « Ding dong ! »', a: 'ouie', audio: 'Ding dong !' },
    { t: 'Ça sent les biscuits qui cuisent dans la cuisine.', a: 'odorat' },
    { t: 'Tu regardes les couleurs de l\'arc-en-ciel.', a: 'vue' },
    { t: 'Tu flattes le chaton pour savoir si son poil est doux.', a: 'toucher' },
    { t: 'Tu trempes ta main dans l\'eau du bain pour savoir si elle est chaude.', a: 'toucher' },
    { t: 'Tu lis le titre de ton livre.', a: 'vue' },
    { t: 'Tu sens l\'odeur des fleurs du jardin.', a: 'odorat' },
    { t: 'Tu croques un citron : c\'est très acide !', a: 'gout' },
  ];
  /** Plusieurs sens : on ne propose QUE des choix clairement vrais ou clairement faux. */
  SC.SENS_MULTI = [
    { t: 'Tu as les yeux fermés et on te donne un morceau de pomme. Quels sens t\'aident à savoir que c\'est une pomme ?', choix: ['vue', 'toucher', 'odorat', 'gout'], a: ['toucher', 'odorat', 'gout'], e: 'Les yeux sont fermés : pas de vue ! Mais on peut toucher la pomme, la sentir et la goûter.' },
    { t: 'Tu regardes un feu d\'artifice : « Boum ! » Quels sens utilises-tu ?', choix: ['vue', 'ouie', 'gout'], a: ['vue', 'ouie'], e: 'On voit les couleurs (la vue) et on entend « Boum ! » (l\'ouïe). On ne goûte pas un feu d\'artifice !' },
    { t: 'Tu flattes un chat qui ronronne. Quels sens utilises-tu ?', choix: ['toucher', 'ouie', 'gout'], a: ['toucher', 'ouie'], e: 'On sent le poil doux avec la peau (le toucher) et on entend le ronron (l\'ouïe).' },
    { t: 'Tu manges une soupe aux légumes bien chaude, les yeux fermés. Quels sens t\'aident ?', choix: ['vue', 'gout', 'odorat', 'toucher'], a: ['gout', 'odorat', 'toucher'], e: 'Les yeux sont fermés : pas de vue. On goûte la soupe, on sent son odeur, et la bouche sent qu\'elle est chaude (le toucher).' },
  ];

  /* ---- Produits du vivant (UV D.2.a, D.4.a) ---- */
  SC.PRODUITS = [
    { id: 'laine', produit: '🧶 La laine', origine: 'mouton', oLabel: '🐑 Le mouton' },
    { id: 'sirop', produit: '🥞 Le sirop d\'érable', origine: 'erable', oLabel: '🍁 L\'érable' },
    { id: 'beurre', produit: '🧈 Le beurre', origine: 'vache', oLabel: '🐄 La vache (son lait)' },
    { id: 'papier', produit: '📄 Le papier', origine: 'arbre', oLabel: '🌳 L\'arbre (son bois)' },
    { id: 'miel', produit: '🍯 Le miel', origine: 'abeille', oLabel: '🐝 L\'abeille' },
    { id: 'oeuf', produit: '🍳 L\'œuf au miroir', origine: 'poule', oLabel: '🐔 La poule' },
    { id: 'pain', produit: '🍞 Le pain', origine: 'ble', oLabel: '🌾 Le blé (sa farine)' },
    { id: 'frites', produit: '🍟 Les frites', origine: 'patate', oLabel: '🥔 La pomme de terre' },
    { id: 'fromage', produit: '🧀 Le fromage', origine: 'vache', oLabel: '🐄 La vache (son lait)' },
    { id: 'chaise', produit: '🪑 La chaise de bois', origine: 'arbre', oLabel: '🌳 L\'arbre (son bois)' },
    { id: 'jus', produit: '🧃 Le jus de pomme', origine: 'pommier', oLabel: '🍎 Le pommier' },
  ];
  SC.RECETTES = [
    { id: 'beurre', titre: 'le beurre', etapes: ['🥛 On verse de la crème dans un pot.', '🫙 On ferme le pot et on le secoue longtemps.', '🧈 Le beurre se forme : on le sépare du liquide.'] },
    { id: 'pain', titre: 'le pain', etapes: ['🥣 On mélange la farine, l\'eau et la levure.', '👐 On pétrit la pâte.', '⏳ On laisse la pâte lever.', '🔥 On cuit le pain au four.'] },
    { id: 'yogourt', titre: 'le yogourt', etapes: ['🥛 On fait chauffer du lait.', '🥄 On ajoute un peu de yogourt (ses ferments).', '⏳ On garde le tout au chaud plusieurs heures.', '❄️ On met le yogourt au frigo.'] },
    { id: 'sirop', titre: 'le sirop d\'érable', etapes: ['🍁 Au printemps, on récolte l\'eau d\'érable.', '🔥 On fait bouillir l\'eau d\'érable longtemps.', '🥞 L\'eau s\'évapore : il reste le sirop.'] },
  ];

  /* ---- Naturel ou fabriqué; vivant ou non vivant ---- */
  SC.NATUREL = ['🪨 le caillou', '🍎 la pomme', '🪶 la plume', '🍁 la feuille d\'érable', '🐚 le coquillage', '🌼 la fleur', '🌳 l\'arbre', '🍄 le champignon', '🥚 l\'œuf de poule', '☁️ le nuage'];
  SC.FABRIQUE = ['✏️ le crayon', '⚽ le ballon', '🪑 la chaise', '✂️ les ciseaux', '📱 le téléphone', '🚲 le vélo', '☕ la tasse', '📕 le livre', '🥄 la cuillère', '📎 le trombone', '☂️ le parapluie', '🚗 l\'auto', '🧸 la peluche', '👓 les lunettes'];
  SC.VIVANT = [{ l: '🌳 l\'arbre' }, { l: '🍄 le champignon' }, { l: '🌼 la fleur' }, { l: '🐱 le chat' }, { l: '🪱 le ver de terre' }, { l: '🫘 la graine de haricot', piege: true }];
  SC.NON_VIVANT = [{ l: '🪨 le caillou' }, { l: '☁️ le nuage', piege: true }, { l: '🔥 le feu', piege: true }, { l: '🤖 le robot', piege: true }, { l: '🚗 l\'auto' }, { l: '💧 l\'eau' }, { l: '⚽ le ballon' }];
  /** Objets techniques et besoin à l'origine (UM D.1.b) — fonctions toutes différentes. */
  SC.OBJETS_BESOIN = [
    { o: '☂️ un parapluie', b: 'Rester au sec sous la pluie' },
    { o: '🧤 des mitaines', b: 'Garder les mains au chaud' },
    { o: '✂️ des ciseaux', b: 'Couper du papier' },
    { o: '🚲 un vélo', b: 'Se déplacer plus vite' },
    { o: '🔦 une lampe de poche', b: 'Voir dans le noir' },
    { o: '🪥 une brosse à dents', b: 'Garder les dents propres' },
    { o: '🧊 un réfrigérateur', b: 'Garder les aliments au froid' },
    { o: '⏰ un réveille-matin', b: 'Se réveiller à l\'heure' },
  ];
})();
