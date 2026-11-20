/* =====================================================================
   sciences/data/objets.js — objets et matériaux (HLD § 5.5)
   M.SC.OBJETS : { id, nom, emoji|art, mat, float, magnet, absorbe, transp, texture }
   Valeur null = ambigu → JAMAIS tiré pour cette notion :
     trombone / épingle (peuvent flotter grâce à la « peau » de l'eau), clé / pièce / cuillère
     (inox ou alliages parfois non attirés), éponge (flotte puis coule selon l'eau absorbée)…
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || {});

  SC.MATERIAUX = { bois: '🪵 Le bois', metal: '🔩 Le métal', plastique: '🧴 Le plastique', verre: '🫙 Le verre', tissu: '🧵 Le tissu' };
  SC.TRANSP = { transparent: { label: 'Transparent', icon: '🔍', def: 'On voit clairement à travers.' }, translucide: { label: 'Translucide', icon: '🌫️', def: 'La lumière passe, mais on voit flou.' }, opaque: { label: 'Opaque', icon: '⬛', def: 'La lumière ne passe pas.' } };

  // O(id, nom, image, propriétés)
  const O = (id, nom, img, p = {}) => ({
    id, nom, emoji: img.startsWith('sc-') ? '' : img, art: img.startsWith('sc-') ? img : p.art || null,
    mat: null, float: null, magnet: null, absorbe: null, transp: null, texture: null, ...p,
  });
  SC.OBJETS = [
    O('bouchon', 'le bouchon de liège', 'sc-bouchon', { float: true, magnet: false, transp: 'opaque' }),
    O('caillou', 'le caillou', '🪨', { float: false, magnet: false, transp: 'opaque', recent: true, art: 'sc-caillou' }),
    O('glacon', 'le glaçon', '🧊', { float: true, magnet: false }),
    O('clou', 'le clou', 'sc-clou', { mat: 'metal', float: false, magnet: true, absorbe: false, transp: 'opaque' }),
    O('trombone', 'le trombone', '📎', { mat: 'metal', magnet: true }),
    O('epingle', 'l\'épingle de sûreté', '🧷', { mat: 'metal', magnet: true }),
    O('conserve', 'la boîte de conserve', '🥫', { mat: 'metal', magnet: true, transp: 'opaque' }),
    O('canette', 'la canette d\'aluminium', 'sc-canette', { mat: 'metal', magnet: false, transp: 'opaque' }),
    O('orange', 'l\'orange avec sa pelure', '🍊', { float: true, magnet: false, transp: 'opaque' }),
    O('orange-pelee', 'l\'orange sans pelure', 'sc-orange-pelee', { float: false, magnet: false }),
    O('pomme', 'la pomme', '🍎', { float: true, magnet: false, transp: 'opaque' }),
    O('pingpong', 'la balle de ping-pong', 'sc-pingpong', { mat: 'plastique', float: true, magnet: false, absorbe: false }),
    O('bille', 'la bille de verre', 'sc-bille', { mat: 'verre', float: false, magnet: false, absorbe: false }),
    O('pate', 'la boule de pâte à modeler', 'sc-pate', { float: false, magnet: false }),
    O('bateau-pate', 'le bateau de pâte à modeler', 'sc-bateau-pate', { float: true, magnet: false }),
    O('cle', 'la clé', '🔑', { mat: 'metal', float: false }),
    O('piece', 'la pièce de monnaie', '🪙', { mat: 'metal', float: false, recent: true, art: 'sc-piece' }),
    O('cuillere', 'la cuillère en métal', '🥄', { mat: 'metal', float: false }),
    O('crayon', 'le crayon de bois', '✏️', { mat: 'bois', float: true, magnet: false, transp: 'opaque' }),
    O('feuille', 'la feuille d\'érable', '🍁', { float: true, magnet: false }),
    O('plume', 'la plume', '🪶', { float: true, magnet: false, texture: 'doux', recent: true, art: 'sc-plume' }),
    O('buche', 'la grosse bûche', '🪵', { mat: 'bois', float: true, magnet: false, transp: 'opaque', texture: 'rugueux', recent: true, art: 'sc-buche' }),
    O('eponge', 'l\'éponge', '🧽', { absorbe: true, magnet: false }),
    O('essuietout', 'l\'essuie-tout', '🧻', { absorbe: true, magnet: false }),
    O('chaussette', 'la chaussette de coton', '🧦', { mat: 'tissu', absorbe: true, magnet: false, transp: 'opaque' }),
    O('tshirt', 'le t-shirt de coton', '👕', { mat: 'tissu', absorbe: true, magnet: false, transp: 'opaque' }),
    O('sac', 'le sac de plastique', 'sc-sac', { mat: 'plastique', absorbe: false, magnet: false }),
    O('impermeable', 'le manteau imperméable', '🧥', { absorbe: false }),
    O('parapluie', 'le parapluie', '☂️', { absorbe: false }),
    O('assiette', 'l\'assiette', '🍽️', { absorbe: false, transp: 'opaque' }),
    O('vitre', 'la vitre de la fenêtre', '🪟', { mat: 'verre', absorbe: false, transp: 'transparent', recent: true, art: 'sc-vitre' }),
    O('bocal', 'le bocal de verre', '🫙', { mat: 'verre', absorbe: false, transp: 'transparent', recent: true, art: 'sc-bocal' }),
    O('lunettes', 'les lunettes', '👓', { transp: 'transparent' }),
    O('papier-cire', 'le papier ciré', 'sc-papier-cire', { absorbe: false, transp: 'translucide' }),
    O('verre-givre', 'la vitre givrée de la douche', 'sc-verre-givre', { mat: 'verre', transp: 'translucide', absorbe: false }),
    O('papier-soie', 'le papier de soie', 'sc-papier-soie', { transp: 'translucide' }),
    O('carton', 'la boîte de carton', '📦', { transp: 'opaque', absorbe: true, magnet: false }),
    O('livre', 'le livre', '📕', { transp: 'opaque', magnet: false }),
    O('brique', 'la brique', '🧱', { transp: 'opaque', texture: 'rugueux', magnet: false, float: false }),
    O('peluche', 'la peluche', '🧸', { texture: 'doux', magnet: false, transp: 'opaque' }),
    O('laine', 'la balle de laine', '🧶', { texture: 'doux', magnet: false }),
    O('papier-sable', 'le papier sablé', 'sc-papier-sable', { texture: 'rugueux', magnet: false }),
    O('regle', 'la règle de plastique', 'sc-regle', { mat: 'plastique', magnet: false }),
    O('foulard', 'le foulard de laine', '🧣', { texture: 'doux', magnet: false }),
    O('mitaine', 'la mitaine de laine', '🧤', { texture: 'doux', magnet: false }),
    O('coco', 'la noix de coco', '🥥', { texture: 'rugueux', magnet: false }),
    O('ananas', 'l\'ananas', '🍍', { texture: 'rugueux', magnet: false }),
  ];
  /** Genre et nombre (accords : il / elle / ils / elles, fait / faite). */
  SC.fem = (o) => o.nom.startsWith('la ') || ['epingle', 'orange', 'orange-pelee', 'eponge', 'assiette', 'lunettes'].includes(o.id);
  SC.pron = (o) => (o.nom.startsWith('les ') ? (SC.fem(o) ? 'elles' : 'ils') : SC.fem(o) ? 'elle' : 'il');
  SC.objet = (id) => SC.OBJETS.find((o) => o.id === id);
  /** Objets dont la propriété est sûre (valeur non nulle). */
  SC.objetsSurs = (prop, val) => SC.OBJETS.filter((o) => o[prop] !== null && o[prop] !== undefined && (val === undefined || o[prop] === val));

  SC.checkObjets = function () {
    const err = [];
    const seen = new Set();
    SC.OBJETS.forEach((o) => {
      if (seen.has(o.id)) err.push('id en double ' + o.id); seen.add(o.id);
      if (!o.emoji && !o.art) err.push(o.id + ' : pas d\'image');
      if (o.mat && !SC.MATERIAUX[o.mat]) err.push(o.id + ' : matériau');
      if (o.transp && !SC.TRANSP[o.transp]) err.push(o.id + ' : transparence');
      ['float', 'magnet', 'absorbe'].forEach((k) => { if (o[k] !== null && typeof o[k] !== 'boolean') err.push(o.id + ' : ' + k); });
    });
    return err.join(', ');
  };

  M.registerData('sc.objets', SC.OBJETS);
})();
