/* =====================================================================
   data/sons.js — inventaire des sons du 1er cycle (M.FR.SONS)
   Règle : on ne fait JAMAIS lire un son isolé par la synthèse vocale; on dit
   toujours le mot-repère (« le son o comme dans auto »).
     id      : clé du son (même notation que gr dans mots.js)
     label   : affichage [o]
     repere  : mot-repère (dans mots.js) + emoji
     graphies: façons de l'écrire (la plus fréquente d'abord)
     regle   : régularité à dire à l'enfant
     confond : sons proches (jamais utilisés comme « non » pour ce son)
   ===================================================================== */

/** Son du 1er cycle (M.FR.SONS). */
interface FrSon {
  id: string;
  label: string;
  repere: string;
  em: string;
  graphies: string[];
  regle?: string;
  /** Plusieurs graphies fréquentes. */
  multi?: boolean;
  confond?: string[];
  voyelle?: boolean;
}
interface FrancaisApi {
  SONS: FrSon[];
  son(id: string): FrSon | undefined;
}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi);
  M.FR.SONS = [
    { id: 'a', label: '[a]', repere: 'chat', em: '🐱', graphies: ['a', 'à', 'â'], voyelle: true },
    { id: 'i', label: '[i]', repere: 'lit', em: '🛏️', graphies: ['i', 'y', 'î'], voyelle: true },
    {
      id: 'o',
      label: '[o]',
      repere: 'vélo',
      em: '🚲',
      graphies: ['o', 'au', 'eau'],
      regle: "À la fin d'un mot, [o] s'écrit souvent <b>eau</b> : chapeau, gâteau. Au milieu, souvent <b>o</b> ou <b>au</b>.",
      multi: true,
      confond: ['on', 'ou'],
    },
    { id: 'u', label: '[u]', repere: 'lune', em: '🌙', graphies: ['u'], voyelle: true },
    {
      id: 'é',
      label: '[é]',
      repere: 'bébé',
      em: '👶',
      graphies: ['é', 'er', 'ez'],
      regle: "[é] s'écrit souvent <b>é</b>. À la fin d'un verbe, c'est souvent <b>er</b> : chanter. Dans nez et chez : <b>ez</b>.",
      multi: true,
      confond: ['è', 'e'],
    },
    {
      id: 'è',
      label: '[è]',
      repere: 'fête',
      em: '🎉',
      graphies: ['è', 'ê', 'ai', 'ei'],
      regle: "[è] s'écrit <b>è</b>, <b>ê</b>, <b>ai</b> ou <b>ei</b> : mère, fête, maison, neige.",
      multi: true,
      confond: ['é', 'e'],
    },
    {
      id: 'ou',
      label: '[ou]',
      repere: 'loup',
      em: '🐺',
      graphies: ['ou'],
      regle: "[ou] s'écrit toujours avec deux lettres : <b>o</b> + <b>u</b>.",
    },
    {
      id: 'on',
      label: '[on]',
      repere: 'mouton',
      em: '🐑',
      graphies: ['on', 'om'],
      regle: "[on] s'écrit <b>on</b>; devant <b>b</b> ou <b>p</b>, il s'écrit <b>om</b> : nombre, pompier.",
      confond: ['an', 'o'],
    },
    {
      id: 'an',
      label: '[an]',
      repere: 'maman',
      em: '👩',
      graphies: ['an', 'en', 'am', 'em'],
      regle: "[an] s'écrit <b>an</b> ou <b>en</b> : maman, enfant, dent. Devant <b>b</b> ou <b>p</b> : <b>am</b>, <b>em</b> (champignon).",
      multi: true,
      confond: ['on', 'in'],
    },
    {
      id: 'in',
      label: '[in]',
      repere: 'lapin',
      em: '🐰',
      graphies: ['in', 'ain', 'ein', 'en'],
      regle: "[in] s'écrit souvent <b>in</b> : lapin, sapin. Parfois <b>ain</b> : main, pain, train.",
      multi: true,
      confond: ['an', 'eu'],
    },
    {
      id: 'oi',
      label: '[oi]',
      repere: 'roi',
      em: '👑',
      graphies: ['oi'],
      regle: "[oi] s'écrit avec <b>o</b> + <b>i</b> : roi, poisson, étoile.",
    },
    {
      id: 'eu',
      label: '[eu]',
      repere: 'feu',
      em: '🔥',
      graphies: ['eu', 'œu'],
      regle: "[eu] s'écrit <b>eu</b> : feu, fleur. Parfois <b>œu</b> : cœur, sœur.",
      confond: ['e', 'in'],
    },
    { id: 'ch', label: '[ch]', repere: 'chat', em: '🐱', graphies: ['ch'], regle: "[ch] s'écrit <b>c</b> + <b>h</b> : chat, vache." },
    {
      id: 'j',
      label: '[j]',
      repere: 'jardin',
      em: '🌻',
      graphies: ['j', 'g'],
      regle: "[j] s'écrit <b>j</b>; <b>g</b> devant <b>e</b> ou <b>i</b> fait aussi [j] : neige, girafe.",
      confond: ['ch'],
    },
    {
      id: 'gn',
      label: '[gn]',
      repere: 'montagne',
      em: '⛰️',
      graphies: ['gn'],
      regle: "[gn] s'écrit <b>g</b> + <b>n</b> : montagne, champignon.",
      confond: ['n'],
    },
    {
      id: 'ill',
      label: '[ill]',
      repere: 'papillon',
      em: '🦋',
      graphies: ['ill', 'll'],
      regle: "[ill] s'écrit souvent <b>ill</b> : papillon, feuille, fille.",
      confond: ['i', 'l'],
    },
    {
      id: 'k',
      label: '[k]',
      repere: 'cadeau',
      em: '🎁',
      graphies: ['c', 'k', 'qu'],
      regle: "[k] s'écrit souvent <b>c</b> : cadeau, carotte. Parfois <b>k</b> ou <b>qu</b> : koala, coq.",
      multi: true,
      confond: ['g'],
    },
    {
      id: 's',
      label: '[s]',
      repere: 'serpent',
      em: '🐍',
      graphies: ['s', 'ss', 'c', 'ç'],
      regle:
        "Entre deux voyelles, [s] s'écrit <b>ss</b> : poisson. <b>c</b> devant <b>e</b> ou <b>i</b> fait [s] : citron. <b>ç</b> : garçon.",
      multi: true,
      confond: ['z', 'ch'],
    },
    {
      id: 'z',
      label: '[z]',
      repere: 'zèbre',
      em: '🦓',
      graphies: ['z', 's'],
      regle: 'Un seul <b>s</b> entre deux voyelles fait [z] : maison, oiseau, fusée.',
      multi: true,
      confond: ['s'],
    },
    {
      id: 'f',
      label: '[f]',
      repere: 'fée',
      em: '🧚',
      graphies: ['f', 'ph'],
      regle: "[f] s'écrit <b>f</b>; parfois <b>ph</b> : éléphant, dauphin.",
      multi: true,
      confond: ['v'],
    },
  ];
  M.FR.son = (id) => M.FR.SONS.find((s) => s.id === id);
})();
