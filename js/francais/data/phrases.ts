/* =====================================================================
   data/phrases.js — phrases étiquetées (classes de mots, ordre des mots)
   Une phrase = « mot/étiquette » séparés par des espaces; le point final est un jeton « ./. ».
     d = déterminant, n = nom, a = adjectif, v = verbe, p = pronom,
     x = autre ou mot à double classe (jamais une cible)
   Niveau : 0 = 3–5 mots; 1 = 5–7 mots; 2 = négation ou plus long.
   « * » en tête = plusieurs ordres possibles → jamais utilisée pour « Je construis une phrase ».
   Toutes les phrases ont un seul sujet animé : l'ordre des mots est unique et a du sens.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || {};
  const RAW = {
    0: [
      'Le/d chat/n dort/v ./.',
      'Le/d chien/n jappe/v ./.',
      'La/d poule/n picore/v ./.',
      'Mon/d frère/n chante/v ./.',
      'Ma/d sœur/n danse/v ./.',
      'Le/d lapin/n saute/v ./.',
      'Les/d oiseaux/n chantent/v ./.',
      'Un/d bébé/n pleure/v ./.',
      'La/d fée/n vole/v ./.',
      'Le/d bébé/n boit/v son/d lait/n ./.',
      'Papa/n lit/v un/d livre/n ./.',
      'Le/d loup/n mange/v ./.',
      'La/d souris/n grignote/v du/d fromage/n ./.',
      'Le/d castor/n nage/v ./.',
      'Ma/d tante/n conduit/v un/d camion/n ./.',
      'Le/d cheval/n galope/v ./.',
    ],
    1: [
      '*Le/d petit/a chat/n dort/v sur/x le/d lit/n ./.',
      'Mon/d grand/a frère/n mange/v une/d pomme/n ./.',
      "*La/d vache/n noire/a mange/v de/x l'/d herbe/n ./.",
      '*Le/d gros/a chien/n creuse/v un/d trou/n ./.',
      'Ma/d petite/a sœur/n dessine/v un/d soleil/n ./.',
      'Le/d castor/n construit/v un/d barrage/n ./.',
      '*Une/d jolie/a fée/n chante/v une/d chanson/n ./.',
      '*Le/d vieux/a monsieur/n promène/v son/d chien/n ./.',
      '*Mon/d cousin/n lance/v la/d balle/n rouge/a ./.',
      'La/d petite/a souris/n mange/v du/d fromage/n ./.',
      'Le/d lapin/n blanc/a croque/v une/d carotte/n ./.',
      'Les/d enfants/n construisent/v un/d igloo/n ./.',
      'Ma/d grand-maman/n prépare/v une/d tarte/n ./.',
      'Le/d grand/a garçon/n lit/v une/d histoire/n ./.',
      'Mon/d chat/n gris/a attrape/v une/d mouche/n ./.',
      'La/d gentille/a dame/n arrose/v ses/d fleurs/n ./.',
      'Le/d petit/a oiseau/n mange/v des/d graines/n ./.',
      'Elle/p mange/v une/d grosse/a pomme/n ./.',
      'Il/p porte/v un/d chapeau/n bleu/a ./.',
      'Nous/p mangeons/v une/d soupe/n chaude/a ./.',
      'Mon/d oncle/n répare/v son/d vélo/n ./.',
      'La/d petite/a fille/n cueille/v une/d fleur/n ./.',
      'Le/d facteur/n apporte/v une/d lettre/n ./.',
      'Ma/d tante/n tricote/v une/d tuque/n ./.',
    ],
    2: [
      'Le/d chat/n ne/x dort/v pas/x ./.',
      'Mon/d frère/n ne/x mange/v pas/x de/x brocoli/n ./.',
      'Le/d petit/a lapin/n ne/x court/v pas/x ./.',
      'La/d tortue/n ne/x nage/v pas/x vite/x ./.',
      'Ma/d sœur/n ne/x regarde/v pas/x la/d télévision/n ./.',
      "Le/d chien/n n'/x aime/v pas/x la/d pluie/n ./.",
      '*Le/d gros/a ours/n brun/a mange/v du/d miel/n ./.',
      '*Ma/d petite/a cousine/n porte/v une/d robe/n verte/a ./.',
      'Les/d petits/a chats/n noirs/a boivent/v du/d lait/n ./.',
      '*Mon/d oncle/n conduit/v un/d gros/a camion/n rouge/a ./.',
      'Une/d grande/a girafe/n mange/v des/d feuilles/n ./.',
      'Le/d joli/a papillon/n vole/v vers/x la/d fleur/n ./.',
      'Il/p ne/x trouve/v pas/x sa/d tuque/n ./.',
      "Elle/p n'/x aime/v pas/x les/d épinards/n ./.",
      'Nous/p construisons/v un/d gros/a bonhomme/n ./.',
      '*La/d vieille/a jument/n tire/v une/d charrette/n ./.',
    ],
  };
  const parse = (s, lvl) => {
    const multi = s.startsWith('*');
    const toks = s
      .replace(/^\*/, '')
      .split(' ')
      .map((t) => {
        const i = t.lastIndexOf('/');
        return { w: t.slice(0, i), tag: t.slice(i + 1) };
      });
    return { lvl: +lvl, toks, multi };
  };
  M.FR.PHRASES = [].concat(...Object.entries(RAW).map(([lvl, arr]) => arr.map((s) => parse(s, lvl))));
  /** Mots de la phrase (élision recollée : « l' » + « herbe » → « l'herbe »), sans le point. */
  M.FR.phraseWords = (ph) => {
    const out = [];
    ph.toks.forEach((t) => {
      if (t.tag === '.') return;
      const prev = out[out.length - 1];
      if (prev && /'$/.test(prev.w)) {
        prev.w += t.w;
        prev.tags.push(t.tag);
      } else out.push({ w: t.w, tag: t.tag, tags: [t.tag] });
    });
    out.forEach((o) => {
      if (o.tags.length > 1) o.tag = 'x';
    });
    return out;
  };

  /* Scènes pour « Je lis une phrase » : sujet × relation × objet (3 scènes diffèrent d'un élément) */
  M.FR.SCENES = {
    sujets: [
      { id: 'chat', em: '🐱', le: 'Le chat' },
      { id: 'chien', em: '🐶', le: 'Le chien' },
      { id: 'lapin', em: '🐰', le: 'Le lapin' },
      { id: 'souris', em: '🐭', le: 'La souris' },
      { id: 'poule', em: '🐔', le: 'La poule' },
      { id: 'oiseau', em: '🐦', le: "L'oiseau" },
    ],
    objets: [
      { id: 'boite', em: '📦', le: 'la boîte', dans: true },
      { id: 'chaise', em: '🪑', le: 'la chaise' },
      { id: 'auto', em: '🚗', le: "l'auto" },
      { id: 'lit', em: '🛏️', le: 'le lit' },
      { id: 'panier', em: '🧺', le: 'le panier', dans: true },
      { id: 'arbre', em: '🌳', le: "l'arbre" },
    ],
    relations: [
      { id: 'sur', mot: 'sur' },
      { id: 'sous', mot: 'sous' },
      { id: 'cote', mot: 'à côté de' },
      { id: 'dans', mot: 'dans' },
    ],
  };
})();
