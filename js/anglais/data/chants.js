/* =====================================================================
   anglais/data/chants.js — comptines ORIGINALES (M.EN.CHANTS) et rimes
   (M.EN.RHYMES). Aucune parole protégée, aucune mélodie connue.
   Chant : { id, title, fr, lines: [{ en, g (geste/image) }] }
   Rimes : M.EN.RW (mots imageables) et ensembles { target, rhymes, couplet }.
   Rimes FRANCHES seulement (même voyelle et même finale à l'oreille).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const C = (en, g) => ({ en, g });

  EN.CHANTS = [
    {
      id: 'touch-head', title: 'Touch Your Head', fr: 'Touche ta tête (chant à gestes)',
      lines: [C('Touch your head, touch your nose,', '🙆'), C('Touch your knees and touch your toes.', '🦶'), C('Clap, clap, clap! Stamp, stamp, stamp!', '👏'), C('Turn around and… sit down!', '🪑')],
    },
    {
      id: 'colours-snow', title: 'Colours in the Snow', fr: 'Les couleurs dans la neige',
      lines: [C('Red, red, my hat is red.', 'art:en-tuque:red'), C('Blue, blue, my mittens are blue.', 'art:en-mittens:blue'), C('Green, green, the tree is green.', '🌲'), C('White, white, the snow is white!', '❄️')],
    },
    {
      id: 'five-beavers', title: 'Five Little Beavers', fr: 'Cinq petits castors (on compte à rebours)',
      lines: [
        C('Five little beavers swim in the lake.', '5️⃣'), C('One goes home to eat some cake.', '🍰'),
        C('Four little beavers swim in the lake.', '4️⃣'), C('One goes home to eat some cake.', '🍰'),
        C('Three, two, one… swim, swim, swim!', '🦫'), C('No little beavers! Where are they? At home!', '🏠'),
      ],
    },
    {
      id: 'hello-song', title: 'Hello, Hello', fr: 'Bonjour, bonjour (chant du matin)',
      lines: [C('Hello, hello, how are you?', '👋'), C('I\'m fine, I\'m fine, and you, and you?', '👍'), C('Good morning, sun! Good morning, sky!', '☀️'), C('Wave your hand and say: "Hi, hi!"', '🙋')],
    },
    {
      id: 'winter-clothes', title: 'Winter Clothes', fr: 'Les vêtements d\'hiver',
      lines: [C('Hat on my head,', 'art:en-tuque:blue'), C('Scarf on my neck,', '🧣'), C('Mittens on my hands,', 'art:en-mittens:red'), C('Boots on my feet.', 'art:en-boots'), C('Ready, set… let\'s go and play in the snow!', '⛄')],
    },
    {
      id: 'cat-hat', title: 'The Cat in the Hat Shop', fr: 'Le chat chez le chapelier (mots qui riment)',
      lines: [C('A cat, a hat, a bat — look at that!', '🐱'), C('A frog, a dog, a log — hop, hop, hop!', '🐸'), C('A bee in a tree, one, two, three!', '🐝'), C('A goat in a boat — float, float, float!', '⛵')],
    },
  ];

  /* ---------- Mots qui riment : imageables, prononciation sûre ---------- */
  const RW = {};
  [
    ['cat', '🐱', 'a cat', 'chat'], ['hat', 'art:en-tuque:red', 'a hat', 'tuque'], ['bat', '🦇', 'a bat', 'chauve-souris'],
    ['bee', '🐝', 'a bee', 'abeille'], ['tree', '🌲', 'a tree', 'arbre'], ['key', '🔑', 'a key', 'clé'],
    ['frog', '🐸', 'a frog', 'grenouille'], ['dog', '🐶', 'a dog', 'chien'], ['log', '🪵', 'a log', 'bûche'],
    ['cake', '🍰', 'a cake', 'gâteau'], ['snake', '🐍', 'a snake', 'serpent'],
    ['goat', '🐐', 'a goat', 'chèvre'], ['boat', '⛵', 'a boat', 'bateau'], ['coat', '🧥', 'a coat', 'manteau'],
    ['fox', '🦊', 'a fox', 'renard'], ['box', '📦', 'a box', 'boîte'], ['socks', '🧦', 'socks', 'bas'],
    ['star', '⭐', 'a star', 'étoile'], ['car', 'art:en-car:blue', 'a car', 'auto'],
    ['mouse', '🐭', 'a mouse', 'souris'], ['house', 'art:en-house:yellow', 'a house', 'maison'],
    ['moon', '🌙', 'the moon', 'lune'], ['spoon', '🥄', 'a spoon', 'cuillère'],
    ['bed', '🛏️', 'a bed', 'lit'], ['bread', '🍞', 'bread', 'pain'],
    ['nose', '👃', 'a nose', 'nez'], ['rose', '🌹', 'a rose', 'rose'],
    ['train', '🚂', 'a train', 'train'], ['rain', '🌧️', 'rain', 'pluie'],
    ['shell', '🐚', 'a shell', 'coquillage'], ['bell', '🔔', 'a bell', 'cloche'],
    ['pie', '🥧', 'a pie', 'tarte'], ['tie', '👔', 'a tie', 'cravate'],
    ['sun', '☀️', 'the sun', 'soleil'], ['pig', '🐷', 'a pig', 'cochon'], ['duck', '🦆', 'a duck', 'canard'],
    ['fish', '🐟', 'a fish', 'poisson'], ['ball', 'art:en-ball:red', 'a ball', 'ballon'], ['book', '📕', 'a book', 'livre'],
    ['apple', '🍎', 'an apple', 'pomme'], ['bus', '🚌', 'a bus', 'autobus'], ['cow', '🐮', 'a cow', 'vache'],
  ].forEach(([id, pic, say, fr]) => (RW[id] = { id, pic, say, fr, word: id }));
  // Voyelle entendue : un distracteur ne partage jamais la voyelle de la cible (évite les quasi-rimes cake/rain, nose/goat).
  const VOW = { ae: 'cat hat bat apple', i: 'bee tree key', a: 'frog dog log fox box socks', ei: 'cake snake train rain', ou: 'goat boat coat nose rose',
    ar: 'star car', au: 'mouse house cow', u: 'moon spoon', e: 'bed bread shell bell', ai: 'pie tie', uh: 'sun duck bus', ih: 'pig fish', o: 'ball', oo: 'book' };
  Object.entries(VOW).forEach(([v, ws]) => ws.split(' ').forEach((w) => { if (RW[w]) RW[w].v = v; }));
  EN.RW = RW;

  /** Familles de rimes. couplet : vers à compléter (le dernier mot manque). */
  EN.RHYMES = [
    { target: 'cat', rhymes: ['hat', 'bat'], couplet: ['The cat has a…', 'hat'], lvl: 0 },
    { target: 'bee', rhymes: ['tree', 'key'], couplet: ['The bee is in the…', 'tree'], lvl: 0 },
    { target: 'frog', rhymes: ['dog', 'log'], couplet: ['The frog is on a…', 'log'], lvl: 0 },
    { target: 'cake', rhymes: ['snake'], couplet: ['Look! A snake eats a…', 'cake'], lvl: 1 },
    { target: 'goat', rhymes: ['boat', 'coat'], couplet: ['The goat is in a…', 'boat'], lvl: 0 },
    { target: 'fox', rhymes: ['box', 'socks'], couplet: ['The fox is in the…', 'box'], lvl: 0 },
    { target: 'star', rhymes: ['car'], couplet: ['I see a star on my…', 'car'], lvl: 1 },
    { target: 'mouse', rhymes: ['house'], couplet: ['A little mouse in a little…', 'house'], lvl: 0 },
    { target: 'moon', rhymes: ['spoon'], couplet: ['I eat my soup under the moon, with a big…', 'spoon'], lvl: 1 },
    { target: 'bed', rhymes: ['bread'], couplet: ['In my bed, I eat my…', 'bread'], lvl: 1 },
    { target: 'nose', rhymes: ['rose'], couplet: ['I smell the rose with my…', 'nose'], lvl: 1 },
    { target: 'train', rhymes: ['rain'], couplet: ['I ride the train in the…', 'rain'], lvl: 1 },
    { target: 'shell', rhymes: ['bell'], couplet: ['In the shell, I hear a…', 'bell'], lvl: 1 },
    { target: 'pie', rhymes: ['tie'], couplet: ['Oh my! Pie on my…', 'tie'], lvl: 1 },
  ];
  /** Groupe de rime d'un mot (pour éviter deux mots qui riment entre eux parmi les distracteurs). */
  EN.rhymeGroup = (id) => { const r = EN.RHYMES.find((x) => x.target === id || x.rhymes.includes(id)); return r ? r.target : id; };
})();
