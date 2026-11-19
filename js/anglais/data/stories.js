/* =====================================================================
   anglais/data/stories.js — histoires ORIGINALES (M.EN.STORIES)
   { id, title, fr (titre français), lvl, lines: [{ en, pic, fr }], questions }
   pic : emoji, ou 'art:<nom>:<couleur>'; plusieurs images séparées par « | ».
   Chaque image de phrase est différente (sert à « Remets l'histoire en ordre »).
   Question : { lvl, type: 'pic' | 'tf' | 'say', fr (consigne), audio? (question
   anglaise entendue), choices (1er = bonne réponse; pic ou phrase anglaise),
   answer (tf), line (phrase qui donne la réponse), hint? }
   Présent simple, répétitions, contextes québécois, prénoms variés.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const L = (en, pic, fr) => ({ en, pic, fr });
  const SW = (c) => 'art:en-swatch:' + c;

  EN.STORIES = [
    {
      id: 'lily-lunch', title: 'Lily\'s Lunch', fr: 'Le dîner de Lily', lvl: 0,
      lines: [
        L('Lily is a rabbit. Lily is hungry.', '🐰|🍽️', 'Lily est un lapin. Lily a faim.'),
        L('She eats an apple and a carrot.', '🍎|🥕', 'Elle mange une pomme et une carotte.'),
        L('Then she drinks milk. Yum!', '🥛', 'Ensuite, elle boit du lait. Miam !'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Qui est Lily ?', choices: ['🐰', '🐱', '🐻'], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Qu\'est-ce que Lily boit ?', choices: ['🥛', '🧃', '☕'], line: 2 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is Lily hungry?', answer: true, line: 0 },
        { lvl: 1, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'What does Lily eat?', choices: ['🥕', '🧀', '🍪', '🍞'], line: 1 },
      ],
    },
    {
      id: 'big-red-ball', title: 'The Big Red Ball', fr: 'Le gros ballon rouge', lvl: 0,
      lines: [
        L('Sam has a big red ball.', 'art:en-ball:red', 'Sam a un gros ballon rouge.'),
        L('Oh no! The dog takes the ball!', '🐶', 'Oh non ! Le chien prend le ballon !'),
        L('Sam says: "Stop, dog! My ball!"', '✋', 'Sam dit : « Arrête, chien ! Mon ballon ! »'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'De quelle couleur est le ballon de Sam ?', choices: [SW('red'), SW('blue'), SW('yellow')], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Quel animal prend le ballon ?', choices: ['🐶', '🐱', '🐰'], line: 1 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is the ball small?', answer: false, line: 0, hint: 'Écoute : « a <b>big</b> red ball ». <i lang="en">Big</i> = gros.' },
        { lvl: 1, type: 'say', fr: 'Que dit Sam au chien ?', choices: ['Stop, dog!', 'Good night, dog!', 'Hello, dog!'], line: 2 },
      ],
    },
    {
      id: 'max-snow', title: 'Max and the Snow', fr: 'Max et la neige', lvl: 1,
      lines: [
        L('Max is a little beaver.', '🦫', 'Max est un petit castor.'),
        L('It is winter. It is cold and snowy.', '❄️|🌨️', 'C\'est l\'hiver. Il fait froid et il neige.'),
        L('Max puts on his red hat and his blue mittens.', 'art:en-tuque:red|art:en-mittens:blue', 'Max met sa tuque rouge et ses mitaines bleues.'),
        L('Max sees his friend Lily. Lily is a rabbit.', '🐰', 'Max voit son amie Lily. Lily est un lapin.'),
        L('"Hello, Lily! Let\'s play!"', '👋', '« Bonjour Lily ! Viens jouer ! »'),
        L('They make a big snowman. Max is happy!', '⛄|😀', 'Ils font un gros bonhomme de neige. Max est content !'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Qui est Max ?', choices: ['🦫', '🐰', '🐻'], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Quelle saison est-ce ?', choices: ['❄️', '☀️', '🍂', '🌷'], line: 1 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is Max sad?', answer: false, line: 5, hint: 'Regarde la dernière image 😀.' },
        { lvl: 1, type: 'pic', fr: 'De quelle couleur est la tuque de Max ?', choices: [SW('red'), SW('blue'), SW('green')], line: 2 },
        { lvl: 1, type: 'say', fr: 'Que dit Max à Lily ?', choices: ['Hello, Lily!', 'Goodbye, Lily!', 'Sorry, Lily!'], line: 4, hint: 'Max veut jouer avec Lily.' },
        { lvl: 2, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'What do they make?', choices: ['⛄', '🏠', '🍰', '🛷'], line: 5 },
      ],
    },
    {
      id: 'sugar-shack', title: 'At the Sugar Shack', fr: 'À la cabane à sucre', lvl: 1,
      lines: [
        L('Today, Zoe goes to the sugar shack with Grandpa.', '👧|👴', 'Aujourd\'hui, Zoé va à la cabane à sucre avec grand-papa.'),
        L('It is spring. The snow is melting.', '🌷', 'C\'est le printemps. La neige fond.'),
        L('They eat pancakes with maple syrup.', '🥞|🍁', 'Ils mangent des crêpes avec du sirop d\'érable.'),
        L('Yum, yum! Zoe eats a lot!', '😋', 'Miam, miam ! Zoé mange beaucoup !'),
        L('Zoe says: "Thank you, Grandpa!"', '🤗', 'Zoé dit : « Merci, grand-papa ! »'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Avec qui Zoé va-t-elle à la cabane à sucre ?', choices: ['👴', '👩', '👨'], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Qu\'est-ce qu\'ils mangent ?', choices: ['🥞', '🍕', '🍦'], line: 2 },
        { lvl: 1, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'What season is it?', choices: ['🌷', '⛄', '🏖️', '🍂'], line: 1 },
        { lvl: 1, type: 'say', fr: 'Que dit Zoé à la fin ?', choices: ['Thank you, Grandpa!', 'Good night, Grandpa!', 'Sorry, Grandpa!'], line: 4 },
        { lvl: 2, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Does Zoe like the pancakes?', answer: true, line: 3, hint: '« Yum, yum! » : c\'est bon !' },
      ],
    },
    {
      id: 'rink', title: 'At the Rink', fr: 'À la patinoire', lvl: 1,
      lines: [
        L('Noah puts on his skates.', '⛸️', 'Noah met ses patins.'),
        L('He goes to the rink with Mom.', '👦|👩', 'Il va à la patinoire avec maman.'),
        L('Oh no! Noah falls down.', '💥', 'Oh non ! Noah tombe.'),
        L('Mom says: "Are you okay?"', '❓', 'Maman dit : « Ça va ? »'),
        L('Noah stands up. He is okay!', 'art:en-pose-stand-up', 'Noah se relève. Il va bien !'),
        L('He skates again. He is happy!', '😀', 'Il patine encore. Il est content !'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Qu\'est-ce que Noah met ?', choices: ['⛸️', 'art:en-boots', '🧦'], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Avec qui Noah va-t-il à la patinoire ?', choices: ['👩', '👴', '👧'], line: 1 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Does Noah fall down?', answer: true, line: 2 },
        { lvl: 1, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'How is Noah at the end?', choices: ['😀', '😢', '😠'], line: 5 },
        { lvl: 2, type: 'say', fr: 'Que dit maman quand Noah tombe ?', choices: ['Are you okay?', 'Good job!', 'Let\'s play!'], line: 3 },
      ],
    },
    {
      id: 'rainy-day', title: 'A Rainy Day', fr: 'Une journée de pluie', lvl: 1,
      lines: [
        L('It is raining.', '🌧️', 'Il pleut.'),
        L('Ben is sad. He can\'t play outside.', '😢', 'Ben est triste. Il ne peut pas jouer dehors.'),
        L('Grandma says: "Let\'s read a book!"', '👵|📕', 'Grand-maman dit : « Lisons un livre ! »'),
        L('They read a book about a bear.', '🐻', 'Ils lisent un livre sur un ours.'),
        L('Now Ben is happy.', '😀', 'Maintenant, Ben est content.'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Quel temps fait-il ?', choices: ['🌧️', '☀️', '🌨️'], line: 0 },
        { lvl: 0, type: 'pic', fr: 'Qui lit avec Ben ?', choices: ['👵', '👨', '👩'], line: 2 },
        { lvl: 1, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'What is the book about?', choices: ['🐻', '🐶', '🦆', '🐟'], line: 3 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is it sunny?', answer: false, line: 0 },
        { lvl: 2, type: 'say', fr: 'Que dit grand-maman ?', choices: ['Let\'s read a book!', 'Let\'s go to school!', 'Good night!'], line: 2 },
      ],
    },
    {
      id: 'lost-mitten', title: 'The Lost Mitten', fr: 'La mitaine perdue', lvl: 2,
      lines: [
        L('It is a cold day. Ava has two green mittens.', 'art:en-mittens:green', 'C\'est une journée froide. Ava a deux mitaines vertes.'),
        L('At school, Ava plays in the snow.', '🏫|❄️', 'À l\'école, Ava joue dans la neige.'),
        L('Oh no! One mitten is lost!', '❓', 'Oh non ! Une mitaine est perdue !'),
        L('Ava is sad.', '😢', 'Ava est triste.'),
        L('Her friend Leo finds the mitten under a tree.', '🌲', 'Son ami Léo trouve la mitaine sous un arbre.'),
        L('"Thank you, Leo!" says Ava. Now Ava is happy.', '😀', '« Merci, Léo ! » dit Ava. Maintenant, Ava est contente.'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'De quelle couleur sont les mitaines d\'Ava ?', choices: [SW('green'), SW('red'), SW('blue'), SW('yellow')], line: 0 },
        { lvl: 1, type: 'pic', fr: 'Où Léo trouve-t-il la mitaine ?', choices: ['🌲', '🏠', '🚌'], line: 4 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is Ava happy at the end?', answer: true, line: 5 },
        { lvl: 2, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'How is Ava when the mitten is lost?', choices: ['😢', '😀', '😴', '😠'], line: 3 },
        { lvl: 2, type: 'say', fr: 'Que dit Ava à Léo ?', choices: ['Thank you, Leo!', 'Sorry, Leo!', 'Goodbye, Leo!'], line: 5 },
      ],
    },
    {
      id: 'birthday', title: 'Happy Birthday, Mia!', fr: 'Bonne fête, Mia !', lvl: 2,
      lines: [
        L('Today is Mia\'s birthday.', '🎂', 'Aujourd\'hui, c\'est la fête de Mia.'),
        L('She is seven!', '7️⃣', 'Elle a sept ans !'),
        L('Her friends come to her house.', '👧|👦', 'Ses amis viennent chez elle.'),
        L('They play with balloons.', '🎈', 'Ils jouent avec des ballons.'),
        L('Then they eat a big chocolate cake.', '🍰', 'Ensuite, ils mangent un gros gâteau au chocolat.'),
        L('Mia says: "This is the best day!"', '🥳', 'Mia dit : « C\'est la plus belle journée ! »'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Quel âge a Mia ?', choices: ['7️⃣', '6️⃣', '8️⃣'], line: 1 },
        { lvl: 1, type: 'pic', fr: 'Avec quoi les amis jouent-ils ?', choices: ['🎈', '🪁', '🧩'], line: 3 },
        { lvl: 1, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'What do they eat?', choices: ['🍰', '🍕', '🍎', '🥞'], line: 4 },
        { lvl: 2, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is Mia six?', answer: false, line: 1 },
        { lvl: 2, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is Mia happy?', answer: true, line: 5 },
      ],
    },
    {
      id: 'raccoon', title: 'The Hungry Raccoon', fr: 'Le raton laveur affamé', lvl: 2,
      lines: [
        L('It is night. The moon is big.', '🌙', 'C\'est la nuit. La lune est grosse.'),
        L('A little raccoon is hungry.', '🦝', 'Un petit raton laveur a faim.'),
        L('He finds a cookie on the table.', '🍪', 'Il trouve un biscuit sur la table.'),
        L('A cat sees the raccoon. "Meow! Go away!"', '🐱', 'Un chat voit le raton laveur. « Miaou ! Va-t\'en ! »'),
        L('The raccoon runs to the tree with his cookie.', '🌲', 'Le raton laveur court vers l\'arbre avec son biscuit.'),
        L('He eats the cookie and goes to sleep.', '😴', 'Il mange le biscuit et va dormir.'),
      ],
      questions: [
        { lvl: 0, type: 'pic', fr: 'Quel animal a faim ?', choices: ['🦝', '🦊', '🐻'], line: 1 },
        { lvl: 1, type: 'pic', fr: 'Qu\'est-ce que le raton laveur trouve ?', choices: ['🍪', '🍎', '🧀'], line: 2 },
        { lvl: 1, type: 'tf', fr: 'Écoute la question et réponds.', audio: 'Is it day?', answer: false, line: 0 },
        { lvl: 2, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'Who sees the raccoon?', choices: ['🐱', '🐶', '🦉', '🐭'], line: 3 },
        { lvl: 2, type: 'pic', fr: 'Écoute la question et touche la bonne image.', audio: 'Where does the raccoon run?', choices: ['🌲', '🏠', '🚗', '🏫'], line: 4 },
      ],
    },
  ];
  EN.story = {};
  EN.STORIES.forEach((s) => (EN.story[s.id] = s));

  /** Image d'une phrase (« 🦫 », « art:en-tuque:red|art:en-mittens:blue »). */
  EN.picStr = (s, size = 56) => String(s).split('|').map((seg) => {
    if (seg.startsWith('art:')) { const [, name, color] = seg.split(':'); return EN.pic({ art: name, color }, size); }
    return `<span class="en-emo" style="font-size:${Math.round(size * 0.8)}px">${seg}</span>`;
  }).join('');
  /** Texte complet d'une histoire (lecture 🔊). */
  EN.storyText = (st) => st.lines.map((l) => l.en).join(' ');
  /** Histoire illustrée : une ligne = image + phrase + 🔊 (fr = sens, pour les pages Apprendre). */
  EN.storyHtml = (st, { fr = false, text = true } = {}) => `<div class="en-story">${st.lines.map((l) => `<div class="en-line"><span class="en-lpic">${EN.picStr(l.pic, 40)}</span>
    <span class="en-ltext">${text ? `<span lang="en">${M.esc(l.en)}</span>` : ''}${fr ? `<span class="en-lfr">${M.esc(l.fr)}</span>` : ''}</span>${M.ui.speak(l.en, { lang: EN.LANG })}</div>`).join('')}</div>`;
})();
