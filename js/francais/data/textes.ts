/* data/textes.js — textes courts originaux (compréhension, ordre d'une histoire) */

type FrQuestionType = 'qui' | 'quoi' | 'ou' | 'quand' | 'inference' | 'substitution' | 'vocabulaire';
/** Question de compréhension : choices[0] = bonne réponse; preuve = passage du texte qui la justifie. */
interface FrTexteQuestion {
  type: FrQuestionType;
  q: string;
  choices: string[];
  preuve: string;
  explain: string;
}
interface FrTexte {
  id: string;
  titre: string;
  niveau: number;
  genre: string;
  texte: string;
  /** Étapes de l'histoire, dans l'ordre. */
  sequence?: { t: string; em: string }[];
  questions: FrTexteQuestion[];
}
interface FrancaisApi {
  TEXTES: FrTexte[];
}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi);
  M.FR.TEXTES = [
    /* ================= NIVEAU 0 ================= */
    {
      id: 'tuque',
      titre: 'La tuque de Malik',
      niveau: 0,
      genre: 'récit',
      texte:
        "Ce matin, Malik met sa tuque rouge. Il met aussi ses mitaines. Il sort dans la cour. La neige est toute blanche.\n\nMalik fait un gros bonhomme. Il lui donne sa tuque rouge. Le bonhomme a l'air content.",
      sequence: [
        { t: 'Malik met sa tuque et ses mitaines.', em: '🧤' },
        { t: 'Malik fait un gros bonhomme.', em: '⛄' },
        { t: 'Malik donne sa tuque au bonhomme.', em: '🎁' },
      ],
      questions: [
        {
          type: 'qui',
          q: 'Qui fait un bonhomme de neige ?',
          choices: ['Malik', 'Léa', 'Thomas'],
          preuve: 'Malik fait un gros bonhomme',
          explain: 'Le texte dit : « Malik fait un gros bonhomme. »',
        },
        {
          type: 'quand',
          q: 'Quand Malik sort-il jouer ?',
          choices: ['ce matin', 'ce soir', 'à minuit'],
          preuve: 'Ce matin, Malik met sa tuque rouge',
          explain: "La première phrase commence par « Ce matin ». C'est le moment de l'histoire.",
        },
        {
          type: 'ou',
          q: 'Où va Malik ?',
          choices: ['dans la cour', 'au parc', "à l'école"],
          preuve: 'Il sort dans la cour',
          explain: 'Le texte dit : « Il sort dans la cour. »',
        },
        {
          type: 'quoi',
          q: 'De quelle couleur est la tuque de Malik ?',
          choices: ['rouge', 'bleue', 'verte'],
          preuve: 'Malik met sa tuque rouge',
          explain: 'Le texte dit : « Malik met sa tuque rouge. »',
        },
        {
          type: 'quoi',
          q: 'Que donne Malik au bonhomme ?',
          choices: ['sa tuque rouge', 'ses mitaines', 'une carotte'],
          preuve: 'Il lui donne sa tuque rouge',
          explain: 'Le texte dit : « Il lui donne sa tuque rouge. »',
        },
        {
          type: 'vocabulaire',
          q: 'Des mitaines, on les met sur…',
          choices: ['les mains', 'les pieds', 'la tête'],
          preuve: 'Il met aussi ses mitaines',
          explain: 'Les mitaines gardent les mains au chaud en hiver. Le texte dit : « Il met aussi ses mitaines. »',
        },
      ],
    },
    {
      id: 'glissade',
      titre: 'La glissade de Léa',
      niveau: 0,
      genre: 'récit',
      texte:
        "Samedi, Léa va au parc avec papa. Elle apporte son traîneau bleu. La côte est très haute.\n\nLéa monte jusqu'en haut. Puis, elle glisse très vite. Papa l'attend en bas. Léa veut glisser encore !",
      sequence: [
        { t: 'Léa va au parc avec papa.', em: '🚶' },
        { t: 'Léa monte en haut de la côte.', em: '⛰️' },
        { t: 'Léa glisse très vite.', em: '🛷' },
      ],
      questions: [
        {
          type: 'qui',
          q: 'Avec qui Léa va-t-elle au parc ?',
          choices: ['avec papa', 'avec maman', 'avec son ami Félix'],
          preuve: 'Samedi, Léa va au parc avec papa',
          explain: 'Le texte dit : « Samedi, Léa va au parc avec papa. »',
        },
        {
          type: 'quand',
          q: 'Quel jour Léa va-t-elle glisser ?',
          choices: ['samedi', 'dimanche', 'lundi'],
          preuve: 'Samedi, Léa va au parc avec papa',
          explain: "La phrase commence par « Samedi ». C'est le jour de la glissade.",
        },
        {
          type: 'quoi',
          q: 'De quelle couleur est le traîneau ?',
          choices: ['bleu', 'rouge', 'jaune'],
          preuve: 'Elle apporte son traîneau bleu',
          explain: 'Le texte dit : « Elle apporte son traîneau bleu. »',
        },
        {
          type: 'quoi',
          q: 'Comment est la côte ?',
          choices: ['très haute', 'toute petite', 'pleine de roches'],
          preuve: 'La côte est très haute',
          explain: 'Le texte dit : « La côte est très haute. »',
        },
        {
          type: 'ou',
          q: 'Où papa attend-il Léa ?',
          choices: ['en bas de la côte', 'en haut de la côte', "dans l'auto"],
          preuve: "Papa l'attend en bas",
          explain: "Le texte dit : « Papa l'attend en bas. » Léa glisse jusqu'à lui.",
        },
      ],
    },
    {
      id: 'autobus',
      titre: "L'autobus jaune",
      niveau: 0,
      genre: 'récit',
      texte:
        "C'est le premier jour d'école. Thomas attend l'autobus avec Aya. L'autobus jaune arrive au coin de la rue.\n\nThomas monte le premier. Il s'assoit près de la fenêtre. Aya s'assoit à côté de lui. Les amis chantent jusqu'à l'école.",
      sequence: [
        { t: "Thomas attend l'autobus avec Aya.", em: '🚏' },
        { t: "Thomas monte dans l'autobus.", em: '🚌' },
        { t: "Les amis chantent jusqu'à l'école.", em: '🎵' },
      ],
      questions: [
        {
          type: 'qui',
          q: "Avec qui Thomas attend-il l'autobus ?",
          choices: ['avec Aya', 'avec Samuel', 'avec sa maman'],
          preuve: "Thomas attend l'autobus avec Aya",
          explain: "Le texte dit : « Thomas attend l'autobus avec Aya. »",
        },
        {
          type: 'quand',
          q: "C'est quel jour pour Thomas ?",
          choices: ["le premier jour d'école", "le dernier jour d'école", 'un jour de congé'],
          preuve: "C'est le premier jour d'école",
          explain: "Le texte dit : « C'est le premier jour d'école. »",
        },
        {
          type: 'quoi',
          q: "De quelle couleur est l'autobus ?",
          choices: ['jaune', 'rouge', 'vert'],
          preuve: "L'autobus jaune arrive au coin de la rue",
          explain: "Le texte dit : « L'autobus jaune arrive au coin de la rue. »",
        },
        {
          type: 'ou',
          q: "Où Thomas s'assoit-il ?",
          choices: ['près de la fenêtre', "au fond de l'autobus", 'à côté du chauffeur'],
          preuve: "Il s'assoit près de la fenêtre",
          explain: "Le texte dit : « Il s'assoit près de la fenêtre. »",
        },
        {
          type: 'quoi',
          q: "Que font les amis dans l'autobus ?",
          choices: ['Ils chantent.', 'Ils dorment.', 'Ils lisent un livre.'],
          preuve: "Les amis chantent jusqu'à l'école",
          explain: "Le texte dit : « Les amis chantent jusqu'à l'école. »",
        },
      ],
    },
    {
      id: 'ecureuil',
      titre: "L'écureuil roux",
      niveau: 0,
      genre: 'informatif',
      texte:
        "L'écureuil roux est un petit animal. Il a une longue queue touffue. Son poil est roux et blanc.\n\nIl vit dans les arbres. Il mange des noix et des cocottes. L'automne, il cache des noix. L'hiver, il les retrouve sous la neige.",
      questions: [
        {
          type: 'ou',
          q: "Où vit l'écureuil roux ?",
          choices: ['dans les arbres', "dans l'eau", 'sous la terre'],
          preuve: 'Il vit dans les arbres',
          explain: 'Le texte dit : « Il vit dans les arbres. »',
        },
        {
          type: 'quoi',
          q: "Que mange l'écureuil roux ?",
          choices: ['des noix et des cocottes', 'des poissons', 'des carottes'],
          preuve: 'Il mange des noix et des cocottes',
          explain: 'Le texte dit : « Il mange des noix et des cocottes. »',
        },
        {
          type: 'quoi',
          q: "Comment est la queue de l'écureuil ?",
          choices: ['longue et touffue', 'courte et lisse', 'toute petite'],
          preuve: 'Il a une longue queue touffue',
          explain: 'Le texte dit : « Il a une longue queue touffue. »',
        },
        {
          type: 'quand',
          q: "Quand l'écureuil cache-t-il des noix ?",
          choices: ["l'automne", "l'été", 'le printemps'],
          preuve: "L'automne, il cache des noix",
          explain: "Le texte dit : « L'automne, il cache des noix. »",
        },
        {
          type: 'vocabulaire',
          q: "Une queue « touffue », c'est une queue…",
          choices: ['pleine de poils', 'sans poils', 'toute mouillée'],
          preuve: 'Il a une longue queue touffue',
          explain: "Touffu veut dire qu'il y a beaucoup de poils serrés. Le texte dit : « Il a une longue queue touffue. »",
        },
      ],
    },

    /* ================= NIVEAU 1 ================= */
    {
      id: 'cabane',
      titre: 'La cabane de Zoé',
      niveau: 1,
      genre: 'récit',
      texte:
        "Samedi matin, Zoé et son grand-papa vont dans la forêt derrière la maison. Ils apportent des planches, des clous et un marteau. Grand-papa scie les planches. Zoé tient le bout de chaque planche pour l'aider.\n\nÀ midi, la cabane a un toit et une petite fenêtre. Zoé mange une pomme, assise sur le plancher. Soudain, des gouttes tombent sur le toit : toc, toc, toc ! Zoé sourit. Sa cabane est solide : Zoé reste bien au sec.",
      sequence: [
        { t: 'Zoé et grand-papa vont dans la forêt.', em: '🌲' },
        { t: 'Grand-papa scie les planches.', em: '🪚' },
        { t: 'Des gouttes tombent sur le toit.', em: '🌧️' },
      ],
      questions: [
        {
          type: 'qui',
          q: 'Avec qui Zoé construit-elle la cabane ?',
          choices: ['son grand-papa', 'sa maman', 'son ami Malik'],
          preuve: 'Zoé et son grand-papa vont dans la forêt',
          explain: 'Le texte dit : « Zoé et son grand-papa vont dans la forêt. »',
        },
        {
          type: 'ou',
          q: 'Où construisent-ils la cabane ?',
          choices: ['dans la forêt', "dans la cour d'école", 'au bord du lac'],
          preuve: 'vont dans la forêt derrière la maison',
          explain: "Le texte dit qu'ils « vont dans la forêt derrière la maison ».",
        },
        {
          type: 'substitution',
          q: "Dans « Ils apportent des planches », Ils, c'est qui ?",
          choices: ['Zoé et son grand-papa', 'grand-papa tout seul', 'les voisins'],
          preuve: 'Samedi matin, Zoé et son grand-papa vont dans la forêt',
          explain: "Juste avant, le texte parle de « Zoé et son grand-papa ». Ils sont deux : Ils, c'est Zoé et son grand-papa.",
        },
        {
          type: 'inference',
          q: "Quel temps fait-il à la fin de l'histoire ?",
          choices: ['🌧️ Il pleut', '☀️ Il fait soleil', '❄️ Il neige'],
          preuve: 'des gouttes tombent sur le toit',
          explain:
            "Le texte ne dit pas « il pleut », mais il dit : « des gouttes tombent sur le toit ». Des gouttes qui tombent du ciel, c'est de la pluie.",
        },
        {
          type: 'inference',
          q: 'Pourquoi Zoé sourit-elle ?',
          choices: ['Sa cabane la protège de la pluie.', "Elle a peur de l'orage.", 'Sa pomme est tombée.'],
          preuve: 'Sa cabane est solide : Zoé reste bien au sec',
          explain: "Le texte dit : « Sa cabane est solide : Zoé reste bien au sec. » La pluie n'entre pas, alors Zoé est contente.",
        },
        {
          type: 'vocabulaire',
          q: '« Rester au sec », ça veut dire…',
          choices: ['ne pas être mouillée', 'avoir très soif', 'être fatiguée'],
          preuve: 'Zoé reste bien au sec',
          explain: "Sec, c'est le contraire de mouillé. Le texte dit : « Zoé reste bien au sec. »",
        },
      ],
    },
    {
      id: 'castor',
      titre: 'Le castor, un grand bâtisseur',
      niveau: 1,
      genre: 'informatif',
      texte:
        "Le castor est un animal du Québec. Il vit près des rivières et des lacs. Il a de grandes dents orange et une queue plate.\n\nAvec ses dents, le castor coupe des arbres. Il construit un barrage avec des branches et de la boue. Derrière le barrage, l'eau forme un étang. Le castor bâtit aussi sa maison dans l'eau. Cette maison s'appelle une hutte.\n\nL'hiver, l'étang est gelé. Le castor reste au chaud dans sa hutte. Il mange l'écorce des branches qu'il garde sous l'eau.",
      questions: [
        {
          type: 'ou',
          q: 'Où vit le castor ?',
          choices: ['près des rivières et des lacs', 'dans le désert', 'en haut des montagnes'],
          preuve: 'Il vit près des rivières et des lacs',
          explain: 'Le texte dit : « Il vit près des rivières et des lacs. »',
        },
        {
          type: 'substitution',
          q: "Dans « Il a de grandes dents orange », Il, c'est qui ?",
          choices: ['le castor', 'le Québec', 'un lac'],
          preuve: 'Le castor est un animal du Québec',
          explain: "Le texte parle du castor depuis le début. C'est le castor qui a de grandes dents : Il, c'est le castor.",
        },
        {
          type: 'quoi',
          q: 'Avec quoi le castor construit-il son barrage ?',
          choices: ['des branches et de la boue', 'des pierres et du sable', 'des feuilles et de la neige'],
          preuve: 'Il construit un barrage avec des branches et de la boue',
          explain: 'Le texte dit : « Il construit un barrage avec des branches et de la boue. »',
        },
        {
          type: 'vocabulaire',
          q: "Comment s'appelle la maison du castor ?",
          choices: ['une hutte', 'un nid', 'un terrier'],
          preuve: "Cette maison s'appelle une hutte",
          explain: "Le texte dit : « Cette maison s'appelle une hutte. »",
        },
        {
          type: 'quand',
          q: "Quand l'étang est-il gelé ?",
          choices: ["l'hiver", "l'été", 'le printemps'],
          preuve: "L'hiver, l'étang est gelé",
          explain: "Le texte dit : « L'hiver, l'étang est gelé. »",
        },
        {
          type: 'inference',
          q: "Pourquoi le castor garde-t-il des branches sous l'eau ?",
          choices: ["pour manger pendant l'hiver", 'pour décorer sa hutte', 'pour faire un feu'],
          preuve: "Il mange l'écorce des branches qu'il garde sous l'eau",
          explain:
            "L'hiver, tout est gelé. Le texte dit : « Il mange l'écorce des branches qu'il garde sous l'eau. » Ces branches sont donc sa nourriture pour l'hiver.",
        },
      ],
    },
    {
      id: 'brochettes',
      titre: 'Des brochettes de fruits',
      niveau: 1,
      genre: 'consigne',
      texte:
        "Voici comment préparer des brochettes de fruits pour la collation. Il te faut des fraises, des raisins, une banane et des bâtonnets de bois.\n\nD'abord, lave les fraises et les raisins avec un adulte. Ensuite, coupe la banane en rondelles avec un couteau à beurre. Puis, pique les fruits sur un bâtonnet, un à la fois. Place une fraise, un raisin, puis une rondelle de banane. Recommence jusqu'au bout du bâtonnet.\n\nEnfin, dépose tes brochettes dans une assiette. Partage-les avec ta famille. Bon appétit !",
      sequence: [
        { t: 'Lave les fruits avec un adulte.', em: '💧' },
        { t: 'Coupe la banane en rondelles.', em: '🍌' },
        { t: 'Pique les fruits sur le bâtonnet.', em: '🍓' },
      ],
      questions: [
        {
          type: 'quoi',
          q: 'Quels fruits faut-il ?',
          choices: ['des fraises, des raisins et une banane', 'des pommes et des poires', 'des bleuets et des oranges'],
          preuve: 'Il te faut des fraises, des raisins, une banane',
          explain: 'Le texte dit : « Il te faut des fraises, des raisins, une banane et des bâtonnets de bois. »',
        },
        {
          type: 'qui',
          q: 'Avec qui faut-il laver les fruits ?',
          choices: ['avec un adulte', 'tout seul', 'avec un ami de la classe'],
          preuve: 'lave les fraises et les raisins avec un adulte',
          explain: "Le texte dit : « D'abord, lave les fraises et les raisins avec un adulte. »",
        },
        {
          type: 'quand',
          q: 'Quand coupe-t-on la banane ?',
          choices: ['après avoir lavé les fruits', 'avant de laver les fruits', 'à la toute fin'],
          preuve: 'Ensuite, coupe la banane en rondelles',
          explain: "Le mot « Ensuite » montre que cette étape vient après « D'abord, lave les fraises et les raisins ».",
        },
        {
          type: 'inference',
          q: 'Pourquoi utilise-t-on un couteau à beurre ?',
          choices: ['pour ne pas se couper', 'pour couper plus vite', 'parce que la banane est dure'],
          preuve: 'coupe la banane en rondelles avec un couteau à beurre',
          explain: 'Un couteau à beurre ne coupe pas beaucoup : il est assez bon pour une banane molle, et on ne se blesse pas.',
        },
        {
          type: 'substitution',
          q: "Dans « Partage-les avec ta famille », les, c'est quoi ?",
          choices: ['les brochettes', 'les bâtonnets vides', 'les assiettes'],
          preuve: 'Enfin, dépose tes brochettes dans une assiette',
          explain:
            "Juste avant, le texte dit : « Enfin, dépose tes brochettes dans une assiette. » Ce qu'on partage, ce sont les brochettes.",
        },
      ],
    },
    {
      id: 'patinoire',
      titre: 'Félix à la patinoire',
      niveau: 1,
      genre: 'récit',
      texte:
        'Dimanche après-midi, Félix et sa grande sœur Inès vont à la patinoire du quartier. Inès patine depuis longtemps. Félix, lui, commence à peine. Il tombe trois fois sur la glace froide.\n\nInès lui montre comment plier les genoux. Félix essaie encore. Il avance lentement, les bras ouverts comme un avion. Cette fois, il ne tombe pas !\n\nAprès, les deux enfants boivent un chocolat chaud dans le chalet. Félix a les joues toutes rouges.',
      sequence: [
        { t: 'Félix tombe trois fois sur la glace.', em: '💥' },
        { t: 'Inès lui montre comment plier les genoux.', em: '⛸️' },
        { t: 'Les enfants boivent un chocolat chaud.', em: '☕' },
      ],
      questions: [
        {
          type: 'qui',
          q: 'Avec qui Félix va-t-il à la patinoire ?',
          choices: ['sa grande sœur Inès', 'son papa', 'son ami Jacob'],
          preuve: 'Félix et sa grande sœur Inès vont à la patinoire du quartier',
          explain: 'Le texte dit : « Félix et sa grande sœur Inès vont à la patinoire du quartier. »',
        },
        {
          type: 'quand',
          q: 'Quand vont-ils à la patinoire ?',
          choices: ['dimanche après-midi', 'samedi matin', 'lundi soir'],
          preuve: 'Dimanche après-midi, Félix et sa grande sœur Inès',
          explain: 'La première phrase commence par « Dimanche après-midi ».',
        },
        {
          type: 'substitution',
          q: "Dans « Il tombe trois fois sur la glace froide », Il, c'est qui ?",
          choices: ['Félix', 'un grand patineur', 'le gardien de la patinoire'],
          preuve: 'Félix, lui, commence à peine',
          explain: "Juste avant, le texte dit : « Félix, lui, commence à peine. » Celui qui tombe, c'est Félix.",
        },
        {
          type: 'inference',
          q: 'Au début, qui patine le mieux ?',
          choices: ['Inès', 'Félix', 'Ils patinent pareil.'],
          preuve: 'Inès patine depuis longtemps',
          explain: 'Le texte dit : « Inès patine depuis longtemps. » Félix, lui, commence et tombe. Donc Inès patine mieux.',
        },
        {
          type: 'inference',
          q: 'Comment se sent Félix quand il ne tombe plus ?',
          choices: ['😊 fier', '😢 triste', '😠 fâché'],
          preuve: 'Cette fois, il ne tombe pas',
          explain: 'Félix est tombé trois fois. Le texte dit : « Cette fois, il ne tombe pas ! » Il a réussi, alors il est fier.',
        },
        {
          type: 'ou',
          q: 'Où les enfants boivent-ils un chocolat chaud ?',
          choices: ['dans le chalet', 'à la maison', 'au dépanneur'],
          preuve: 'boivent un chocolat chaud dans le chalet',
          explain: 'Le texte dit que les enfants « boivent un chocolat chaud dans le chalet ».',
        },
      ],
    },

    /* ================= NIVEAU 2 ================= */
    {
      id: 'camping',
      titre: 'Une nuit sous la tente',
      niveau: 2,
      genre: 'récit',
      texte:
        "Vendredi soir, Rosalie et Nicolas font du camping au bord d'un lac avec leur maman. Ils montent la tente près d'un grand pin. Maman allume un petit feu. Pour le souper, la famille mange des hot-dogs et des guimauves grillées.\n\nQuand la nuit tombe, Rosalie entend un drôle de bruit : hou, hou ! Elle regarde son frère. « C'est un monstre ? » demande Nicolas. « Mais non, c'est un hibou ! » répond maman en riant.\n\nLes enfants éclairent le grand pin avec une lampe de poche. Ils voient deux grands yeux jaunes. Le hibou les regarde, puis il s'envole sans bruit.\n\nLe lendemain matin, Rosalie se réveille la première. Elle ouvre la tente et voit un canard sur le lac. « Bonjour, le canard ! » chuchote-t-elle.",
      sequence: [
        { t: 'Maman allume un petit feu.', em: '🔥' },
        { t: 'Rosalie entend un drôle de bruit.', em: '👂' },
        { t: "Le hibou s'envole sans bruit.", em: '🦉' },
        { t: 'Rosalie voit un canard sur le lac.', em: '🦆' },
      ],
      questions: [
        {
          type: 'qui',
          q: 'Avec qui Rosalie et Nicolas font-ils du camping ?',
          choices: ['leur maman', 'leur papa', 'leurs grands-parents'],
          preuve: "Rosalie et Nicolas font du camping au bord d'un lac avec leur maman",
          explain: "Le texte dit : « Rosalie et Nicolas font du camping au bord d'un lac avec leur maman. »",
        },
        {
          type: 'ou',
          q: 'Où la famille fait-elle du camping ?',
          choices: ["au bord d'un lac", 'dans la cour de la maison', 'au bord de la mer'],
          preuve: "font du camping au bord d'un lac",
          explain: "Le texte dit qu'ils « font du camping au bord d'un lac ».",
        },
        {
          type: 'quoi',
          q: "Qu'est-ce qui fait le drôle de bruit ?",
          choices: ['un hibou', 'un monstre', 'un canard'],
          preuve: "Mais non, c'est un hibou",
          explain: "Maman répond : « Mais non, c'est un hibou ! » Ce n'est pas un monstre.",
        },
        {
          type: 'inference',
          q: 'Comment se sent Nicolas quand il entend le bruit ?',
          choices: ['😟 un peu inquiet', '😴 endormi', '😠 fâché'],
          preuve: "C'est un monstre",
          explain: "Nicolas demande : « C'est un monstre ? » Il ne sait pas d'où vient le bruit, alors il est un peu inquiet.",
        },
        {
          type: 'substitution',
          q: "Dans « Ils voient deux grands yeux jaunes », Ils, c'est qui ?",
          choices: ['Rosalie et Nicolas', 'maman et le hibou', 'les canards'],
          preuve: 'Les enfants éclairent le grand pin avec une lampe de poche',
          explain: 'Juste avant, le texte dit : « Les enfants éclairent le grand pin. » Les enfants, ce sont Rosalie et Nicolas.',
        },
        {
          type: 'quand',
          q: 'Quand Rosalie voit-elle le canard ?',
          choices: ['le lendemain matin', 'pendant le souper', 'au milieu de la nuit'],
          preuve: 'Le lendemain matin, Rosalie se réveille la première',
          explain:
            'Le texte dit : « Le lendemain matin, Rosalie se réveille la première. » Ensuite, elle ouvre la tente et voit le canard.',
        },
      ],
    },
    {
      id: 'epluchette',
      titre: "L'épluchette de blé d'Inde",
      niveau: 2,
      genre: 'récit',
      texte:
        "À la fin de l'été, la famille de Mei organise une épluchette de blé d'Inde dans la cour. Les voisins arrivent avec des chaises et des salades. Grand-maman remplit un énorme chaudron d'eau.\n\nMei et son ami Jacob enlèvent les feuilles vertes des épis. Les feuilles tombent dans une grosse boîte. Soudain, Jacob trouve un épi tout rouge. « Regarde, Mei ! Il est rouge ! » crie-t-il. « Wow ! Tu as gagné ! » dit Mei. Dans la famille de Mei, celui qui trouve un épi rouge choisit la première chanson de la soirée.\n\nLe blé d'Inde cuit dans le chaudron. Puis, tout le monde le mange avec du beurre et du sel. Jacob choisit sa chanson préférée et tout le monde danse sous les lumières de la cour.",
      sequence: [
        { t: 'Les voisins arrivent avec des chaises.', em: '🪑' },
        { t: 'Jacob trouve un épi tout rouge.', em: '🌽' },
        { t: "Tout le monde mange le blé d'Inde.", em: '🧈' },
        { t: 'Tout le monde danse dans la cour.', em: '💃' },
      ],
      questions: [
        {
          type: 'quand',
          q: "Quand a lieu l'épluchette ?",
          choices: ["à la fin de l'été", "au début de l'hiver", 'au printemps'],
          preuve: "À la fin de l'été, la famille de Mei organise une épluchette",
          explain: "Le texte commence par : « À la fin de l'été ».",
        },
        {
          type: 'ou',
          q: "Où a lieu l'épluchette ?",
          choices: ['dans la cour', 'au parc', "à l'école"],
          preuve: "organise une épluchette de blé d'Inde dans la cour",
          explain: "Le texte dit que la famille « organise une épluchette de blé d'Inde dans la cour ».",
        },
        {
          type: 'qui',
          q: "Qui trouve l'épi rouge ?",
          choices: ['Jacob', 'Mei', 'grand-maman'],
          preuve: 'Soudain, Jacob trouve un épi tout rouge',
          explain: 'Le texte dit : « Soudain, Jacob trouve un épi tout rouge. »',
        },
        {
          type: 'inference',
          q: 'Pourquoi Mei dit-elle « Tu as gagné ! » ?',
          choices: ['Jacob va choisir la première chanson.', "Jacob a mangé le plus d'épis.", 'Jacob a couru le plus vite.'],
          preuve: 'celui qui trouve un épi rouge choisit la première chanson de la soirée',
          explain: "Jacob a trouvé l'épi rouge. Le texte dit : « celui qui trouve un épi rouge choisit la première chanson de la soirée ».",
        },
        {
          type: 'substitution',
          q: "Dans « tout le monde le mange avec du beurre », le, c'est quoi ?",
          choices: ["le blé d'Inde", 'le chaudron', 'le sel'],
          preuve: "Le blé d'Inde cuit dans le chaudron",
          explain:
            "Juste avant, le texte dit : « Le blé d'Inde cuit dans le chaudron. » Ce qu'on mange avec du beurre, c'est le blé d'Inde.",
        },
        {
          type: 'vocabulaire',
          q: "Dans une épluchette, « éplucher » le blé d'Inde, c'est…",
          choices: ["enlever les feuilles de l'épi", "faire cuire l'épi", "couper l'épi en deux"],
          preuve: 'Mei et son ami Jacob enlèvent les feuilles vertes des épis',
          explain: "Le texte dit : « Mei et son ami Jacob enlèvent les feuilles vertes des épis. » C'est ça, éplucher.",
        },
      ],
    },
    {
      id: 'sirop',
      titre: 'Le temps des sucres',
      niveau: 2,
      genre: 'informatif',
      texte:
        "Au Québec, le printemps est la saison du sirop d'érable. Les journées deviennent plus chaudes, mais les nuits restent froides. C'est à ce moment que l'eau d'érable coule dans les arbres.\n\nLes acériculteurs, les gens qui fabriquent le sirop, font un petit trou dans le tronc des érables. Ils y placent un chalumeau, un petit tuyau. L'eau d'érable coule goutte à goutte dans un seau ou dans de longs tuyaux bleus.\n\nEnsuite, on fait bouillir l'eau d'érable très longtemps dans la cabane à sucre. L'eau s'en va en vapeur et le liquide devient épais et sucré. Il faut environ quarante seaux d'eau d'érable pour faire un seul seau de sirop !\n\nÀ la cabane à sucre, les familles mangent des crêpes, des fèves au lard et de la tire sur la neige. Miam !",
      questions: [
        {
          type: 'quand',
          q: "En quelle saison fait-on le sirop d'érable ?",
          choices: ['au printemps', 'en été', 'en automne'],
          preuve: "le printemps est la saison du sirop d'érable",
          explain: "Le texte dit : « Au Québec, le printemps est la saison du sirop d'érable. »",
        },
        {
          type: 'vocabulaire',
          q: "Un chalumeau, c'est…",
          choices: ['un petit tuyau', 'un gros seau', 'un arbre'],
          preuve: 'Ils y placent un chalumeau, un petit tuyau',
          explain: 'Le texte explique le mot juste après : « un chalumeau, un petit tuyau ».',
        },
        {
          type: 'substitution',
          q: "Dans « Ils y placent un chalumeau », Ils, c'est qui ?",
          choices: ['les acériculteurs', 'les enfants', 'les familles'],
          preuve: 'Les acériculteurs, les gens qui fabriquent le sirop, font un petit trou',
          explain: 'Juste avant, le texte parle des acériculteurs qui font un petit trou. Ce sont eux qui placent le chalumeau.',
        },
        {
          type: 'ou',
          q: "Où fait-on bouillir l'eau d'érable ?",
          choices: ['dans la cabane à sucre', "à l'école", 'au dépanneur'],
          preuve: "on fait bouillir l'eau d'érable très longtemps dans la cabane à sucre",
          explain: "Le texte dit : « on fait bouillir l'eau d'érable très longtemps dans la cabane à sucre ».",
        },
        {
          type: 'inference',
          q: "Faut-il beaucoup d'eau d'érable pour faire du sirop ?",
          choices: ['Oui, beaucoup plus que de sirop.', 'Non, juste un peu.', 'Il en faut autant que de sirop.'],
          preuve: "Il faut environ quarante seaux d'eau d'érable pour faire un seul seau de sirop",
          explain: "Quarante seaux d'eau pour un seul seau de sirop : il faut beaucoup, beaucoup d'eau d'érable !",
        },
        {
          type: 'quoi',
          q: 'Que mangent les familles à la cabane à sucre ?',
          choices: ['des crêpes et de la tire', 'de la pizza et des frites', 'de la soupe aux légumes'],
          preuve: 'les familles mangent des crêpes, des fèves au lard et de la tire sur la neige',
          explain: 'Le texte dit : « les familles mangent des crêpes, des fèves au lard et de la tire sur la neige ».',
        },
      ],
    },
    {
      id: 'invitation',
      titre: "L'invitation d'Aya",
      niveau: 2,
      genre: 'invitation',
      texte:
        "Bonjour Samuel !\n\nJe vais avoir huit ans et je fais une fête ! Je t'invite à venir glisser avec moi au parc des Érables, samedi prochain. La fête commence à une heure de l'après-midi et finit à quatre heures.\n\nApporte ton traîneau, ta tuque et tes mitaines. Mets aussi ton habit de neige, car nous allons jouer dehors longtemps. Après la glissade, nous irons chez moi pour manger du gâteau au chocolat et boire un chocolat chaud.\n\nMon papa viendra te chercher chez toi à midi et demi. Si tu ne peux pas venir, demande à tes parents d'appeler ma maman avant jeudi.\n\nJ'espère que tu pourras venir !\n\nTon amie Aya",
      questions: [
        {
          type: 'qui',
          q: 'Qui a écrit cette invitation ?',
          choices: ['Aya', 'Samuel', "le papa d'Aya"],
          preuve: 'Ton amie Aya',
          explain: 'On regarde la signature à la fin : « Ton amie Aya ».',
        },
        {
          type: 'quoi',
          q: 'Pourquoi Aya fait-elle une fête ?',
          choices: ['Elle va avoir huit ans.', "C'est Noël.", "C'est la fin de l'école."],
          preuve: 'Je vais avoir huit ans et je fais une fête',
          explain: "Aya écrit : « Je vais avoir huit ans et je fais une fête ! » C'est son anniversaire.",
        },
        {
          type: 'ou',
          q: 'Où les amis vont-ils glisser ?',
          choices: ['au parc des Érables', "dans la cour d'école", 'derrière le dépanneur'],
          preuve: 'venir glisser avec moi au parc des Érables',
          explain: "Aya écrit : « Je t'invite à venir glisser avec moi au parc des Érables ».",
        },
        {
          type: 'quand',
          q: 'À quelle heure la fête commence-t-elle ?',
          choices: ["à une heure de l'après-midi", 'à midi et demi', 'à quatre heures'],
          preuve: "La fête commence à une heure de l'après-midi",
          explain: "Le texte dit : « La fête commence à une heure de l'après-midi et finit à quatre heures. »",
        },
        {
          type: 'substitution',
          q: "Dans « Mon papa viendra te chercher », te, c'est qui ?",
          choices: ['Samuel', 'Aya', "le papa d'Aya"],
          preuve: 'Bonjour Samuel',
          explain: 'Aya écrit à Samuel : « Bonjour Samuel ! » Quand elle dit « te », elle parle à Samuel.',
        },
        {
          type: 'inference',
          q: 'Pourquoi Samuel doit-il mettre son habit de neige ?',
          choices: ['pour rester au chaud dehors', 'pour aller à la piscine', 'pour dormir chez Aya'],
          preuve: 'Mets aussi ton habit de neige, car nous allons jouer dehors longtemps',
          explain: "Aya écrit : « car nous allons jouer dehors longtemps ». En hiver, l'habit de neige garde au chaud.",
        },
      ],
    },
  ];
})();
