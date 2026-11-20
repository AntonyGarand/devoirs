/* =====================================================================
   anglais/data/expressions.js — langage fonctionnel (M.EN.EXPR)
   Champs : id, en (affiché), say (lu), kind (greeting · courtesy · needs ·
   classroom · cheer · feelings · pairwork), situation (fr) + emoji, fr (sens),
   group : expressions équivalentes (jamais deux du même groupe dans un choix),
   lvl.
   ===================================================================== */

/** Expression du langage fonctionnel (M.EN.EXPR). */
interface EnExpr {
  id: string;
  /** Affiché. */
  en: string;
  /** Lu. */
  say: string;
  kind: 'greeting' | 'courtesy' | 'needs' | 'classroom' | 'cheer' | 'feelings' | 'pairwork';
  emoji: string;
  /** Situation (français). */
  situation: string;
  /** Sens (français). */
  fr: string;
  /** Expressions équivalentes : jamais deux du même groupe dans un choix. */
  group: string;
  lvl: number;
}

interface EnglishApi {
  EXPR: EnExpr[];
  /** id → expression. */
  expr: Record<string, EnExpr>;
  /** Expressions que l'enfant dit (sans les consignes de classe). */
  SAYABLE: EnExpr[];
}

(function () {
  'use strict';
  const M = window.M;
  const EN = M.EN;
  const E = (
    id: string,
    en: string,
    kind: EnExpr['kind'],
    emoji: string,
    situation: string,
    fr: string,
    group?: string,
    lvl = 0,
    say?: string,
  ): EnExpr => ({
    id,
    en,
    say: say || en,
    kind,
    emoji,
    situation,
    fr,
    group: group || id,
    lvl,
  });

  EN.EXPR = [
    // Salutations
    E('hello', 'Hello!', 'greeting', '👋', 'Au parc, tu vois ton amie.', 'Bonjour ! / Salut !', 'hello', 0),
    E('hi', 'Hi!', 'greeting', '👋', 'Tu croises ton ami dans le corridor.', 'Salut !', 'hello', 0),
    E('good-morning', 'Good morning!', 'greeting', '🌅', "Tu arrives à l'école le matin.", 'Bonjour ! (le matin)', 'hello', 1),
    E('goodbye', 'Goodbye!', 'greeting', '🚪', "L'école est finie, tu pars chez toi.", 'Au revoir !', 'bye', 0),
    E('bye', 'Bye!', 'greeting', '🚪', "Tu quittes ton ami après l'école.", 'Bye ! / Salut !', 'bye', 0),
    E('see-you', 'See you tomorrow!', 'greeting', '📅', 'Tu reverras ton ami demain.', 'À demain !', 'bye', 1),
    E('good-night', 'Good night!', 'greeting', '🛏️', 'Tu vas te coucher.', 'Bonne nuit !', 'night', 0),
    // Politesse
    E('please', 'Please.', 'courtesy', '🙏', 'Tu veux un crayon. Tu dis le mot magique.', "S'il te plaît.", 'please', 0),
    E('thank-you', 'Thank you!', 'courtesy', '🎁', 'Ton ami te donne un cadeau.', 'Merci !', 'thanks', 0),
    E('welcome', "You're welcome!", 'courtesy', '😊', 'Ton ami te dit merci.', 'De rien !', 'welcome', 1),
    E('sorry', 'Sorry!', 'courtesy', '💥', 'Tu fonces dans un ami par accident.', 'Pardon ! / Désolé !', 'sorry', 0),
    E('excuse-me', 'Excuse me.', 'courtesy', '🚶', "Tu veux passer, mais quelqu'un bloque le chemin.", 'Excuse-moi.', 'excuse', 1),
    // Besoins
    E(
      'washroom',
      'Washroom, please?',
      'needs',
      '🚻',
      "Tu as besoin d'aller aux toilettes.",
      'Je peux aller aux toilettes ?',
      'washroom',
      0,
    ),
    E('water', 'Water, please?', 'needs', '🚰', 'Tu as très soif.', "Je peux boire de l'eau ?", 'water', 1),
    E('help', 'Can you help me, please?', 'needs', '🆘', "Ta boîte à lunch ne s'ouvre pas.", "Peux-tu m'aider ?", 'help', 1),
    E('repeat', 'Can you repeat, please?', 'needs', '🔁', "Tu n'as pas bien entendu le professeur.", 'Peux-tu répéter ?', 'repeat', 1),
    E('dont-understand', "I don't understand.", 'needs', '❓', 'Tu ne comprends pas la consigne.', 'Je ne comprends pas.', 'repeat', 2),
    E('hungry', "I'm hungry.", 'needs', '🍽️', 'Ton ventre gargouille.', "J'ai faim.", 'hungry', 1),
    // Encouragements
    E('good-job', 'Good job!', 'cheer', '🏆', 'Ton ami a réussi son dessin.', 'Bon travail !', 'cheer', 0),
    E('hooray', 'Hooray!', 'cheer', '🎉', 'Ton équipe gagne la partie.', 'Hourra !', 'cheer', 1),
    // Travail en équipe
    E('my-turn', 'My turn!', 'pairwork', '🙋', "Dans un jeu, c'est à toi de jouer.", "C'est mon tour !", 'turn', 1),
    E('your-turn', 'Your turn!', 'pairwork', '👉', "Dans un jeu, c'est à ton ami de jouer.", "C'est ton tour !", 'turn2', 1),
    E('lets-play', "Let's play!", 'pairwork', '⚽', 'Tu veux jouer avec ton ami.', 'Viens jouer !', 'play', 0),
    E('here-you-go', 'Here you go.', 'pairwork', '🤲', 'Tu donnes un crayon à ton ami.', 'Tiens, voilà.', 'give', 2),
    // Consignes de classe (ce que dit le professeur)
    E('listen', 'Listen!', 'classroom', '👂', 'Le professeur veut que tu écoutes.', 'Écoute !', 'listen', 0),
    E('look', 'Look!', 'classroom', '👀', 'Le professeur veut que tu regardes.', 'Regarde !', 'look', 0),
    E('line-up', 'Line up!', 'classroom', '🚸', 'Tout le monde doit se mettre en rang.', 'Mettez-vous en rang !', 'line', 1),
    E('come-here', 'Come here!', 'classroom', '👈', 'Le professeur veut que tu viennes.', 'Viens ici !', 'come', 1),
    E('be-quiet', 'Quiet, please.', 'classroom', '🤫', 'Le professeur veut du silence.', "Silence, s'il vous plaît.", 'quiet', 1),
    E('clean-up', 'Clean up!', 'classroom', '🧹', "C'est l'heure de ranger la classe.", 'On range !', 'clean', 2),
    // Questions courantes
    E('how-are-you', 'How are you?', 'greeting', '🙂', 'Tu veux savoir comment va ton ami.', 'Comment ça va ?', 'how', 1),
    E('fine', "I'm fine, thank you.", 'greeting', '👍', 'On te demande comment ça va. Ça va bien !', 'Ça va bien, merci.', 'fine', 1),
    E(
      'whats-your-name',
      "What's your name?",
      'greeting',
      '🏷️',
      "Tu veux savoir le nom d'un nouvel ami.",
      "Comment t'appelles-tu ?",
      'name',
      1,
    ),
    E('happy-birthday', 'Happy birthday!', 'cheer', '🎂', "C'est la fête de ton amie.", 'Bonne fête !', 'birthday', 0),
    E('merry', 'Merry Christmas!', 'greeting', '🎄', "C'est le 25 décembre, Noël.", 'Joyeux Noël !', 'xmas', 1),
    E('i-like', 'I like blue!', 'feelings', '💙', 'Tu veux dire que tu aimes le bleu.', "J'aime le bleu !", 'like', 2),
    E(
      'i-dont-like',
      "I don't like rain.",
      'feelings',
      '🌧️',
      "Tu veux dire que tu n'aimes pas la pluie.",
      "Je n'aime pas la pluie.",
      'dislike',
      2,
    ),
    E('yes-please', 'Yes, please!', 'courtesy', '✅', "On t'offre un biscuit et tu en veux un.", "Oui, s'il te plaît !", 'yes', 1),
    E('no-thanks', 'No, thank you.', 'courtesy', '🙅', "On t'offre un biscuit, mais tu n'en veux pas.", 'Non, merci.', 'no', 1),
    E('ready', "I'm ready!", 'pairwork', '🏁', 'Tu as mis ton manteau pour jouer dehors.', 'Je suis prêt ! / Je suis prête !', 'ready', 2),
  ];
  EN.expr = {};
  EN.EXPR.forEach((x) => (EN.expr[x.id] = x));
  /** Expressions pour les jeux « situation » : les consignes de classe ne sont pas des choses que l'enfant dit. */
  EN.SAYABLE = EN.EXPR.filter((x) => x.kind !== 'classroom');
})();
