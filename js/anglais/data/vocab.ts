/* =====================================================================
   anglais/data/vocab.js — banque de mots (M.EN.VOCAB, ≈ 160 mots)
   Champs : id, word (orthographe canadienne), say (texte lu : article ou
   mini-phrase pour une bonne prononciation), emoji | art (+ color), fr,
   theme, lvl (0 très fréquent, 1 attendu, 2 défi), sameAs (jamais
   distracteurs l'un de l'autre), homophones, cognate (mot ami),
   picture : 'ok' (image claire) | 'context' (seulement en scène/avec le mot)
            | 'none' (pas d'image seule : nombres, actions → poses).
   Emoji ≤ Emoji 13 seulement; sinon dessin SVG (art.js).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const V = [];
  /** Ajoute un thème : rows = [id, word, pic, fr, lvl, extra?] */
  const theme = (name, rows) =>
    rows.forEach(([id, word, pic, fr, lvl, x = {}]) => {
      const it = { id, word, fr, theme: name, lvl, picture: 'ok', say: word, ...x };
      if (typeof pic === 'string') it.emoji = pic;
      else Object.assign(it, pic);
      V.push(it);
    });
  const sw = (color) => ({ art: 'en-swatch', color });

  theme('colours', [
    ['red', 'red', sw('red'), 'rouge', 0],
    ['blue', 'blue', sw('blue'), 'bleu', 0],
    ['yellow', 'yellow', sw('yellow'), 'jaune', 0],
    ['green', 'green', sw('green'), 'vert', 0],
    ['orange', 'orange', sw('orange'), 'orange', 1, { cognate: true }],
    ['purple', 'purple', sw('purple'), 'mauve', 1],
    ['pink', 'pink', sw('pink'), 'rose', 1],
    ['brown', 'brown', sw('brown'), 'brun', 1],
    ['black', 'black', sw('black'), 'noir', 0],
    ['white', 'white', sw('white'), 'blanc', 0],
    ['grey', 'grey', sw('grey'), 'gris', 2],
  ]);

  const NUM = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
    'twenty',
  ];
  const NUM_FR = [
    'zéro',
    'un',
    'deux',
    'trois',
    'quatre',
    'cinq',
    'six',
    'sept',
    'huit',
    'neuf',
    'dix',
    'onze',
    'douze',
    'treize',
    'quatorze',
    'quinze',
    'seize',
    'dix-sept',
    'dix-huit',
    'dix-neuf',
    'vingt',
  ];
  const HOMO = { two: ['too', 'to'], four: ['for'], eight: ['ate'], one: ['won'] };
  theme(
    'numbers',
    NUM.map((w, n) => [w, w, { digit: n }, NUM_FR[n], n <= 10 ? 0 : 1, { n, picture: 'none', homophones: HOMO[w] || [] }]),
  );

  theme('animals', [
    ['cat', 'cat', '🐱', 'chat', 0, { say: 'a cat' }],
    ['dog', 'dog', '🐶', 'chien', 0, { say: 'a dog' }],
    ['bird', 'bird', '🐦', 'oiseau', 0, { say: 'a bird' }],
    ['fish', 'fish', '🐟', 'poisson', 0, { say: 'a fish' }],
    ['horse', 'horse', '🐴', 'cheval', 1, { say: 'a horse' }],
    ['cow', 'cow', '🐮', 'vache', 0, { say: 'a cow' }],
    ['pig', 'pig', '🐷', 'cochon', 0, { say: 'a pig' }],
    ['duck', 'duck', '🦆', 'canard', 1, { say: 'a duck' }],
    ['rabbit', 'rabbit', '🐰', 'lapin', 0, { say: 'a rabbit' }],
    ['mouse', 'mouse', '🐭', 'souris', 1, { say: 'a mouse' }],
    ['frog', 'frog', '🐸', 'grenouille', 1, { say: 'a frog' }],
    ['bear', 'bear', '🐻', 'ours', 0, { say: 'a bear' }],
    ['beaver', 'beaver', '🦫', 'castor', 1, { say: 'a beaver' }],
    ['moose', 'moose', { art: 'en-moose' }, 'orignal', 2, { say: 'a moose', sameAs: ['deer'] }],
    ['raccoon', 'raccoon', '🦝', 'raton laveur', 2, { say: 'a raccoon' }],
    ['deer', 'deer', '🦌', 'chevreuil', 2, { say: 'a deer', sameAs: ['moose'] }],
    ['fox', 'fox', '🦊', 'renard', 1, { say: 'a fox' }],
    ['owl', 'owl', '🦉', 'hibou', 2, { say: 'an owl' }],
    ['lion', 'lion', '🦁', 'lion', 1, { say: 'a lion', cognate: true }],
    ['elephant', 'elephant', '🐘', 'éléphant', 1, { say: 'an elephant', cognate: true }],
    ['monkey', 'monkey', '🐵', 'singe', 1, { say: 'a monkey' }],
    ['zebra', 'zebra', '🦓', 'zèbre', 2, { say: 'a zebra', cognate: true }],
  ]);

  theme('food', [
    ['apple', 'apple', '🍎', 'pomme', 0, { say: 'an apple' }],
    ['banana', 'banana', '🍌', 'banane', 0, { say: 'a banana', cognate: true }],
    ['grapes', 'grapes', '🍇', 'raisins', 1, { say: 'grapes' }],
    ['strawberry', 'strawberry', '🍓', 'fraise', 1, { say: 'a strawberry' }],
    ['carrot', 'carrot', '🥕', 'carotte', 1, { say: 'a carrot', cognate: true }],
    ['bread', 'bread', '🍞', 'pain', 1, { say: 'bread' }],
    ['cheese', 'cheese', '🧀', 'fromage', 1, { say: 'cheese' }],
    ['milk', 'milk', '🥛', 'lait', 0, { say: 'milk' }],
    ['juice', 'juice', '🧃', 'jus', 0, { say: 'juice', cognate: true }],
    ['egg', 'egg', '🥚', 'œuf', 1, { say: 'an egg' }],
    ['cake', 'cake', '🍰', 'gâteau', 0, { say: 'a cake' }],
    ['cookie', 'cookie', '🍪', 'biscuit', 0, { say: 'a cookie' }],
    ['pizza', 'pizza', '🍕', 'pizza', 0, { say: 'pizza', cognate: true }],
    ['ice-cream', 'ice cream', '🍦', 'crème glacée', 1, { say: 'ice cream' }],
    ['sandwich', 'sandwich', '🥪', 'sandwich', 1, { say: 'a sandwich', cognate: true }],
    ['pancakes', 'pancakes', '🥞', 'crêpes', 2, { say: 'pancakes' }],
  ]);

  theme('clothes', [
    ['hat', 'toque', { art: 'en-tuque', color: 'red' }, 'tuque', 0, { say: 'a toque', sameAs: ['cap'] }], // id historique « hat » (progression); toque = mot canadien pour tuque
    ['mittens', 'mittens', { art: 'en-mittens', color: 'blue' }, 'mitaines', 1, { say: 'mittens' }],
    ['boots', 'boots', { art: 'en-boots', color: 'brown' }, 'bottes', 0, { say: 'boots', sameAs: ['shoes'] }],
    ['scarf', 'scarf', '🧣', 'foulard', 1, { say: 'a scarf' }],
    ['snowsuit', 'snowsuit', { art: 'en-snowsuit', color: 'purple' }, 'habit de neige', 2, { say: 'a snowsuit', sameAs: ['coat'] }],
    ['coat', 'coat', '🧥', 'manteau', 1, { say: 'a coat', sameAs: ['snowsuit'] }],
    ['t-shirt', 'T-shirt', '👕', 'chandail (t-shirt)', 0, { say: 'a T-shirt', sameAs: ['sweater'] }],
    ['pants', 'pants', '👖', 'pantalon', 1, { say: 'pants' }],
    ['dress', 'dress', '👗', 'robe', 1, { say: 'a dress' }],
    ['socks', 'socks', '🧦', 'bas', 0, { say: 'socks' }],
    ['shoes', 'shoes', '👟', 'souliers', 0, { say: 'shoes', sameAs: ['boots'] }],
    ['sweater', 'sweater', { art: 'en-sweater', color: 'green' }, 'chandail', 1, { say: 'a sweater', sameAs: ['t-shirt'] }],
    ['shorts', 'shorts', '🩳', 'short', 2, { say: 'shorts', cognate: true }],
    ['cap', 'cap', '🧢', 'casquette', 2, { say: 'a cap', sameAs: ['hat'] }],
  ]);

  theme('family', [
    ['mom', 'mom', '👩', 'maman', 0, { sameAs: ['sister'] }],
    ['dad', 'dad', '👨', 'papa', 0, { sameAs: ['brother'] }],
    ['baby', 'baby', '👶', 'bébé', 0, { say: 'a baby', cognate: true }],
    ['grandma', 'grandma', '👵', 'grand-maman', 1],
    ['grandpa', 'grandpa', '👴', 'grand-papa', 1],
    ['sister', 'sister', '👧', 'sœur', 1, { picture: 'context', sameAs: ['mom'] }],
    ['brother', 'brother', '👦', 'frère', 1, { picture: 'context', sameAs: ['dad'] }],
    ['family', 'family', '👪', 'famille', 2, { say: 'my family', cognate: true, picture: 'context' }],
  ]);

  theme('school', [
    ['book', 'book', '📕', 'livre', 0, { say: 'a book' }],
    ['pencil', 'pencil', '✏️', 'crayon (à mine)', 0, { say: 'a pencil', sameAs: ['crayon'] }],
    ['crayon', 'crayon', '🖍️', 'crayon de cire', 1, { say: 'a crayon', sameAs: ['pencil'] }],
    ['scissors', 'scissors', '✂️', 'ciseaux', 1, { say: 'scissors' }],
    ['ruler', 'ruler', '📏', 'règle', 1, { say: 'a ruler' }],
    ['eraser', 'eraser', { art: 'en-eraser' }, 'gomme à effacer', 1, { say: 'an eraser' }],
    ['backpack', 'backpack', '🎒', 'sac à dos', 1, { say: 'a backpack' }],
    ['desk', 'desk', { art: 'en-desk' }, 'pupitre', 2, { say: 'a desk', sameAs: ['chair'] }],
    ['chair', 'chair', '🪑', 'chaise', 1, { say: 'a chair', sameAs: ['desk'] }],
    ['computer', 'computer', '💻', 'ordinateur', 1, { say: 'a computer' }],
    ['school', 'school', '🏫', 'école', 0, { say: 'the school' }],
    ['bus', 'bus', '🚌', 'autobus', 0, { say: 'the bus', cognate: true }],
  ]);

  theme('body', [
    ['head', 'head', { art: 'en-body', part: 'head' }, 'tête', 0, { say: 'your head', picture: 'context' }],
    ['eyes', 'eyes', '👀', 'yeux', 0, { say: 'your eyes' }],
    ['nose', 'nose', '👃', 'nez', 0, { say: 'your nose' }],
    ['mouth', 'mouth', '👄', 'bouche', 0, { say: 'your mouth' }],
    ['ears', 'ears', '👂', 'oreilles', 1, { say: 'your ears' }],
    ['hair', 'hair', { art: 'en-body', part: 'hair' }, 'cheveux', 1, { say: 'your hair', picture: 'context' }],
    ['arms', 'arms', '💪', 'bras', 1, { say: 'your arms' }],
    ['hands', 'hands', '✋', 'mains', 0, { say: 'your hands' }],
    ['legs', 'legs', '🦵', 'jambes', 1, { say: 'your legs' }],
    ['knees', 'knees', { art: 'en-body', part: 'knees' }, 'genoux', 2, { say: 'your knees', picture: 'context' }],
    ['feet', 'feet', '🦶', 'pieds', 0, { say: 'your feet' }],
    ['toes', 'toes', { art: 'en-body', part: 'toes' }, 'orteils', 2, { say: 'your toes', picture: 'context' }],
    ['shoulders', 'shoulders', { art: 'en-body', part: 'shoulders' }, 'épaules', 2, { say: 'your shoulders', picture: 'context' }],
    ['tummy', 'tummy', { art: 'en-body', part: 'tummy' }, 'ventre', 1, { say: 'your tummy', picture: 'context' }],
  ]);

  theme('weather', [
    ['sunny', 'sunny', '☀️', 'il fait soleil', 0, { say: "It's sunny.", sameAs: ['hot', 'summer'] }],
    ['rainy', 'rainy', '🌧️', 'il pleut', 0, { say: "It's rainy.", sameAs: ['cloudy'] }],
    ['snowy', 'snowy', '🌨️', 'il neige', 1, { say: "It's snowy.", sameAs: ['cold', 'winter', 'cloudy'] }], // 🌨️ montre aussi un nuage
    ['windy', 'windy', '🌬️', 'il vente', 1, { say: "It's windy." }],
    ['cloudy', 'cloudy', '☁️', "c'est nuageux", 1, { say: "It's cloudy.", sameAs: ['rainy', 'snowy'] }],
    ['cold', 'cold', '🥶', 'il fait froid', 0, { say: "It's cold.", sameAs: ['snowy', 'winter'] }],
    ['hot', 'hot', '🥵', 'il fait chaud', 0, { say: "It's hot.", sameAs: ['sunny', 'summer'] }],
  ]);

  theme('seasons', [
    ['winter', 'winter', '⛄', "l'hiver", 1, { sameAs: ['snowy', 'cold'] }],
    ['spring', 'spring', '🌷', 'le printemps', 1],
    ['summer', 'summer', '🏖️', "l'été", 1, { sameAs: ['sunny', 'hot'] }],
    ['fall', 'fall', '🍂', "l'automne", 1],
  ]);

  theme('feelings', [
    ['happy', 'happy', '😀', 'content', 0, { say: "I'm happy." }],
    ['sad', 'sad', '😢', 'triste', 0, { say: "I'm sad." }],
    ['angry', 'angry', '😠', 'fâché', 0, { say: "I'm angry." }],
    ['tired', 'tired', '😴', 'fatigué', 1, { say: "I'm tired." }],
    ['scared', 'scared', '😨', "effrayé (j'ai peur)", 1, { say: "I'm scared." }],
    ['sick', 'sick', '🤒', 'malade', 1, { say: "I'm sick." }],
    ['surprised', 'surprised', '😮', 'surpris', 1, { say: "I'm surprised." }],
  ]);

  theme('toys', [
    ['ball', 'ball', { art: 'en-ball', color: 'red' }, 'ballon', 0, { say: 'a ball' }],
    ['kite', 'kite', '🪁', 'cerf-volant', 1, { say: 'a kite' }],
    ['teddy-bear', 'teddy bear', '🧸', 'ourson en peluche', 1, { say: 'a teddy bear', sameAs: ['bear'] }],
    ['robot', 'robot', '🤖', 'robot', 0, { say: 'a robot', cognate: true }],
    ['puzzle', 'puzzle', '🧩', 'casse-tête', 1, { say: 'a puzzle' }],
    ['train', 'train', '🚂', 'train', 0, { say: 'a train', cognate: true }],
    ['skates', 'skates', '⛸️', 'patins', 1, { say: 'skates' }],
    ['balloon', 'balloon', '🎈', 'ballon gonflable', 1, { say: 'a balloon' }],
  ]);

  theme('things', [
    ['tree', 'tree', '🌲', 'arbre', 0, { say: 'a tree' }],
    ['sun', 'sun', '☀️', 'soleil', 0, { say: 'the sun', homophones: ['son'], sameAs: ['sunny'] }],
    ['moon', 'moon', '🌙', 'lune', 1, { say: 'the moon' }],
    ['star', 'star', '⭐', 'étoile', 1, { say: 'a star' }],
    ['snowman', 'snowman', '⛄', 'bonhomme de neige', 1, { say: 'a snowman', sameAs: ['winter'] }],
    ['house', 'house', { art: 'en-house', color: 'yellow' }, 'maison', 0, { say: 'a house' }],
    ['car', 'car', { art: 'en-car', color: 'blue' }, 'auto', 0, { say: 'a car' }],
    ['bike', 'bike', '🚲', 'vélo', 1, { say: 'a bike' }],
    ['sled', 'sled', '🛷', 'traîneau', 2, { say: 'a sled' }],
  ]);

  // Actions : jamais d'emoji (dessins de poses). say = la consigne entendue.
  theme('actions', [
    ['stand-up', 'Stand up!', { art: 'en-pose-stand-up' }, 'Lève-toi !', 0],
    ['sit-down', 'Sit down!', { art: 'en-pose-sit-down' }, 'Assieds-toi !', 0],
    ['jump', 'Jump!', { art: 'en-pose-jump' }, 'Saute !', 0],
    ['clap', 'Clap your hands!', { art: 'en-pose-clap' }, 'Tape des mains !', 0],
    ['raise-hand', 'Raise your hand!', { art: 'en-pose-raise-hand' }, 'Lève la main !', 1],
    ['wave', 'Wave hello!', { art: 'en-pose-wave' }, 'Fais bonjour de la main !', 1],
    ['point', 'Point to the door!', { art: 'en-pose-point' }, 'Montre la porte du doigt !', 2],
    ['run', 'Run!', { art: 'en-pose-run' }, 'Cours !', 0],
    ['sleep', 'Go to sleep!', { art: 'en-pose-sleep' }, 'Va dormir !', 0],
    ['eat', 'Eat your apple!', { art: 'en-pose-eat' }, 'Mange ta pomme !', 1],
    ['drink', 'Drink your milk!', { art: 'en-pose-drink' }, 'Bois ton lait !', 1],
    ['read', 'Read a book!', { art: 'en-pose-read' }, 'Lis un livre !', 1],
  ]);

  EN.VOCAB = V;
  EN.word = {};
  V.forEach((w) => {
    if (EN.word[w.id]) console.warn('Mot en double :', w.id);
    EN.word[w.id] = w;
  });
  EN.THEMES = {
    colours: { fr: 'Les couleurs', icon: '🎨', box: '🎨 Couleurs' },
    numbers: { fr: 'Les nombres', icon: '🔢', box: '🔢 Nombres' },
    animals: { fr: 'Les animaux', icon: '🐾', box: '🐾 Animaux' },
    food: { fr: 'La nourriture', icon: '🍎', box: '🍽️ Nourriture' },
    clothes: { fr: 'Les vêtements', icon: '🧣', box: '👕 Vêtements' },
    family: { fr: 'La famille', icon: '👪', box: '👪 Famille' },
    school: { fr: "L'école", icon: '🏫', box: '🏫 École' },
    body: { fr: 'Le corps', icon: '🙋', box: '🙋 Corps' },
    weather: { fr: 'La météo', icon: '🌦️', box: '🌦️ Météo' },
    seasons: { fr: 'Les saisons', icon: '🍂', box: '🍂 Saisons' },
    feelings: { fr: 'Les sentiments', icon: '😀', box: '😀 Sentiments' },
    toys: { fr: 'Les jouets', icon: '🧸', box: '🧸 Jouets' },
    things: { fr: 'Autour de moi', icon: '🏠', box: '🏠 Autour de moi' },
    actions: { fr: 'Les actions', icon: '🏃', box: '🏃 Actions' },
  };
  EN.ofTheme = (t, maxLvl = 2) => V.filter((w) => w.theme === t && w.lvl <= maxLvl);
  /** Deux mots ne peuvent pas cohabiter dans un même choix (image proche ou même son). */
  EN.clash = (a, b) => {
    a = typeof a === 'string' ? EN.word[a] : a;
    b = typeof b === 'string' ? EN.word[b] : b;
    if (!a || !b) return false;
    if (a.id === b.id) return true;
    if ((a.sameAs || []).includes(b.id) || (b.sameAs || []).includes(a.id)) return true;
    if ((a.homophones || []).includes(b.word) || (b.homophones || []).includes(a.word)) return true;
    if (a.emoji && a.emoji === b.emoji) return true;
    if (a.art && a.art === b.art && (a.color || '') === (b.color || '')) return true;
    return false;
  };
  /** Image d'un mot (emoji, dessin ou chiffre). */
  EN.wordPic = (w, size = 64) => (w.digit !== undefined ? EN.digit(w.digit) : EN.pic(w, size));
})();
