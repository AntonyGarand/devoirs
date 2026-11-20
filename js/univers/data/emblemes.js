/* Univers social — emblèmes du Québec (ENRICHISSEMENT : non nommé au 1er cycle).
   Faits vérifiés sur quebec.ca (Emblèmes; Drapeau et symboles nationaux) :
   fleurdelisé adopté le 21 janvier 1948, proportions 2 sur 3, croix blanche et 4 fleurs de lis blanches sur fond bleu;
   harfang des neiges (oiseau) depuis 1987; bouleau jaune (arbre) depuis 1993; iris versicolore (fleur) depuis 1999;
   devise : « Je me souviens ». */
(function () {
  'use strict';
  const M = window.M;
  const BLUE = '#003da5';
  /* Fleur de lis blanche stylisée (boîte ≈ 18 × 22, centrée sur 0,0) */
  const LIS = 'M0 -11 C3 -7 3.4 -3 1.6 1.5 L-1.6 1.5 C-3.4 -3 -3 -7 0 -11 Z'
    + 'M-1.8 1.5 C-3.5 -1.5 -8.6 -3.2 -8.8 0.2 C-9 2.6 -6.4 3.6 -5.4 2 C-6.6 1.2 -5.8 -0.6 -4.2 0.4 C-3.4 1 -3 1.6 -3 2.2 Z'
    + 'M1.8 1.5 C3.5 -1.5 8.6 -3.2 8.8 0.2 C9 2.6 6.4 3.6 5.4 2 C6.6 1.2 5.8 -0.6 4.2 0.4 C3.4 1 3 1.6 3 2.2 Z'
    + 'M-4.6 2.6 h9.2 v2 h-9.2 Z M-1.4 4.6 h2.8 l-0.4 3 l2.6 2.6 h-7.2 l2.6 -2.6 Z';
  const lis = (x, y) => `<path d="${LIS}" transform="translate(${x} ${y}) scale(0.36)" fill="#fff"/>`;
  /** Drapeau du Québec : 2 sur 3 (24 × 36), croix blanche, une fleur de lis dans chaque canton. */
  const quebec = () => `<svg class="us-flag" viewBox="0 0 36 24" role="img" aria-label="drapeau du Québec"><rect width="36" height="24" fill="${BLUE}"/><rect x="16" width="4" height="24" fill="#fff"/><rect y="10" width="36" height="4" fill="#fff"/>${lis(8, 5)}${lis(28, 5)}${lis(8, 19)}${lis(28, 19)}</svg>`;
  /** Drapeau du Canada (simplifié : bandes rouges, feuille d'érable). */
  const canada = () => `<svg class="us-flag" viewBox="0 0 36 18" role="img" aria-label="drapeau du Canada"><rect width="36" height="18" fill="#fff"/><rect width="9" height="18" fill="#d52b1e"/><rect x="27" width="9" height="18" fill="#d52b1e"/><text x="18" y="13.5" text-anchor="middle" font-size="12">🍁</text></svg>`;
  /** Drapeau inventé (neutre) */
  const invente = () => `<svg class="us-flag" viewBox="0 0 36 24" role="img" aria-label="drapeau inventé"><rect width="36" height="24" fill="#2a9d8f"/><rect y="9" width="36" height="6" fill="#fff"/><circle cx="18" cy="12" r="5" fill="#f4b400"/></svg>`;
  const invente2 = () => `<svg class="us-flag" viewBox="0 0 36 24" role="img" aria-label="drapeau inventé"><rect width="36" height="24" fill="#d62828"/><rect x="16" width="4" height="24" fill="#fff"/><rect y="10" width="36" height="4" fill="#fff"/><circle cx="8" cy="5" r="2.4" fill="#fff"/><circle cx="28" cy="19" r="2.4" fill="#fff"/></svg>`;

  const sv = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
  M.art.register('us-harfang', () => sv(`<rect width="100" height="100" rx="12" fill="#dff3fb"/><ellipse cx="50" cy="60" rx="28" ry="32" fill="#fff" stroke="#9aa3b5" stroke-width="2"/><circle cx="50" cy="38" r="22" fill="#fff" stroke="#9aa3b5" stroke-width="2"/><circle cx="41" cy="36" r="7" fill="#f4c20d"/><circle cx="59" cy="36" r="7" fill="#f4c20d"/><circle cx="41" cy="36" r="3.4" fill="#111"/><circle cx="59" cy="36" r="3.4" fill="#111"/><path d="M47 44 L50 50 L53 44 z" fill="#333"/>${[[38, 62], [56, 66], [46, 74], [62, 78], [34, 76], [52, 84]].map(([x, y]) => `<path d="M${x} ${y} l4 -2" stroke="#333" stroke-width="2.4" stroke-linecap="round"/>`).join('')}`), '🦉');
  M.art.register('us-iris', () => sv(`<rect width="100" height="100" rx="12" fill="#eef8ec"/><path d="M50 96 V54" stroke="#2f7d4a" stroke-width="4"/><path d="M50 92 C38 80 36 66 40 56" stroke="#2f7d4a" stroke-width="4" fill="none"/><path d="M50 52 C40 20 48 14 50 12 C52 14 60 20 50 52 Z" fill="#6a4fc7"/><path d="M50 54 C30 50 18 60 22 72 C30 70 42 64 50 54 Z" fill="#5b3fb8"/><path d="M50 54 C70 50 82 60 78 72 C70 70 58 64 50 54 Z" fill="#5b3fb8"/><path d="M28 64 L40 59 M72 64 L60 59" stroke="#f4c20d" stroke-width="3" stroke-linecap="round"/><path d="M50 52 C44 40 44 32 50 26" stroke="#fff" stroke-width="2" fill="none"/>`), '🌸');
  M.art.register('us-bouleau', () => sv(`<rect width="100" height="100" rx="12" fill="#e9f6ff"/><rect x="44" y="50" width="12" height="46" fill="#d4a94e"/>${[56, 64, 72, 80, 88].map((y) => `<path d="M45 ${y} h7" stroke="#8a6a24" stroke-width="1.6"/>`).join('')}<circle cx="50" cy="34" r="24" fill="#4fa65a"/><circle cx="32" cy="44" r="14" fill="#5cb85c"/><circle cx="68" cy="44" r="14" fill="#5cb85c"/><circle cx="40" cy="26" r="6" fill="#f2d16b"/><circle cx="62" cy="30" r="5" fill="#f2d16b"/>`), '🌳');

  M.registerData('us-emblemes', {
    flags: { quebec, canada, invente, invente2 },
    list: [
      { id: 'drapeau', nom: 'le fleurdelisé', type: 'drapeau', depuis: 1948, emoji: '⚜️', html: quebec, fait: 'Le drapeau du Québec s\'appelle le <b>fleurdelisé</b> : une croix blanche et quatre fleurs de lis blanches sur un fond bleu. Il flotte depuis 1948.', source: 'https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux' },
      { id: 'harfang', nom: 'le harfang des neiges', type: 'oiseau', depuis: 1987, art: 'us-harfang', fait: 'Le <b>harfang des neiges</b> est un grand hibou blanc. C\'est l\'oiseau emblème du Québec depuis 1987.', source: 'https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux/emblemes' },
      { id: 'iris', nom: 'l\'iris versicolore', type: 'fleur', depuis: 1999, art: 'us-iris', fait: 'L\'<b>iris versicolore</b> est une fleur bleu violet. C\'est la fleur emblème du Québec depuis 1999.', source: 'https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux/emblemes' },
      { id: 'bouleau', nom: 'le bouleau jaune', type: 'arbre', depuis: 1993, art: 'us-bouleau', fait: 'Le <b>bouleau jaune</b> a une écorce dorée. C\'est l\'arbre emblème du Québec depuis 1993.', source: 'https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux/emblemes' },
      { id: 'devise', nom: '« Je me souviens »', type: 'devise', emoji: '📜', fait: 'La devise du Québec est <b>« Je me souviens »</b>. On la lit sur les plaques des autos.', source: 'https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux' },
    ],
    /* Vrai ou faux, par niveau (lvl = niveau minimal). e = précision donnée après la réponse. */
    faits: [
      { t: 'Le drapeau du Québec est bleu et blanc.', v: true, lvl: 0 },
      { t: 'Le drapeau du Québec est rouge et blanc.', v: false, lvl: 0, e: 'Le drapeau rouge et blanc, c\'est celui du Canada.' },
      { t: 'Le fleurdelisé a quatre fleurs de lis.', v: true, lvl: 0 },
      { t: 'Le fleurdelisé a une croix blanche.', v: true, lvl: 0 },
      { t: 'La croix du drapeau du Québec est rouge.', v: false, lvl: 0, e: 'La croix du fleurdelisé est blanche.' },
      { t: 'Le drapeau du Québec s\'appelle le fleurdelisé.', v: true, lvl: 0 },
      { t: 'Le harfang des neiges est un oiseau.', v: true, lvl: 0 },
      { t: 'Le harfang des neiges est un poisson.', v: false, lvl: 0, e: 'Le harfang des neiges est un oiseau : un grand hibou blanc.' },
      { t: 'L\'iris versicolore est une fleur.', v: true, lvl: 0 },
      { t: 'Le bouleau jaune est un arbre.', v: true, lvl: 0 },
      { t: 'Le bouleau jaune est une fleur.', v: false, lvl: 0, e: 'Le bouleau jaune est un arbre.' },
      { t: 'Le harfang des neiges est l\'oiseau emblème du Québec.', v: true, lvl: 1 },
      { t: 'L\'oiseau emblème du Québec est le canard.', v: false, lvl: 1, e: 'C\'est le harfang des neiges.' },
      { t: 'La fleur emblème du Québec est la rose.', v: false, lvl: 1, e: 'C\'est l\'iris versicolore.' },
      { t: 'L\'arbre emblème du Québec est le bouleau jaune.', v: true, lvl: 1 },
      { t: 'L\'iris versicolore est une fleur bleu violet.', v: true, lvl: 1 },
      { t: 'La devise du Québec est « Je me souviens ».', v: true, lvl: 1 },
      { t: 'On peut lire « Je me souviens » sur les plaques des autos du Québec.', v: true, lvl: 1 },
      { t: 'Le fleurdelisé a une feuille d\'érable.', v: false, lvl: 1, e: 'La feuille d\'érable est sur le drapeau du Canada. Le fleurdelisé a quatre fleurs de lis.' },
      { t: 'Le drapeau du Canada a une feuille d\'érable rouge.', v: true, lvl: 2 },
      { t: 'Le drapeau du Canada est bleu et blanc.', v: false, lvl: 2, e: 'Le drapeau du Canada est rouge et blanc.' },
      { t: 'On appelle aussi le drapeau du Canada l\'unifolié.', v: true, lvl: 2, e: 'Unifolié veut dire « une seule feuille » : la feuille d\'érable.' },
      { t: 'Le castor est un symbole du Canada.', v: true, lvl: 2 },
      { t: '« Je me souviens » est la devise du Canada.', v: false, lvl: 2, e: '« Je me souviens » est la devise du Québec.' },
      { t: 'Le bouleau jaune a une écorce dorée.', v: true, lvl: 2 },
      { t: 'Le harfang des neiges vit bien dans le froid et la neige.', v: true, lvl: 2 },
    ],
    /* Distracteurs pour « Quel est l'oiseau / la fleur / l'arbre emblème du Québec ? » (aucun n'est un emblème du Québec). */
    autres: {
      harfang: ['le geai bleu', 'le merle d\'Amérique', 'le canard colvert', 'la mésange à tête noire', 'le cardinal rouge'],
      iris: ['la rose', 'la tulipe', 'le pissenlit', 'la marguerite', 'le tournesol'],
      bouleau: ['l\'érable à sucre', 'le sapin baumier', 'le pin blanc', 'le chêne', 'l\'épinette noire'],
    },
    /* Symbole du Québec ou du Canada ? (canada.ca : unifolié 1965, castor 1975, érable; « Ô Canada » hymne national) */
    symboles: [
      { nom: 'le fleurdelisé', flag: 'quebec', pays: 'quebec' }, { nom: 'le harfang des neiges', art: 'us-harfang', pays: 'quebec' },
      { nom: 'l\'iris versicolore', art: 'us-iris', pays: 'quebec' }, { nom: 'le bouleau jaune', art: 'us-bouleau', pays: 'quebec' },
      { nom: '« Je me souviens »', emoji: '📜', pays: 'quebec' },
      { nom: 'l\'unifolié (le drapeau à la feuille d\'érable)', flag: 'canada', pays: 'canada' }, { nom: 'le castor', emoji: '🦫', pays: 'canada' },
      { nom: 'la feuille d\'érable', emoji: '🍁', pays: 'canada' }, { nom: '« Ô Canada », l\'hymne national', emoji: '🎶', pays: 'canada' },
    ],
  });
})();
