/* Univers social — plans déclaratifs pour M.viz.plan (vue de dessus, nord en haut).
   Coordonnées en cases. fn = « où on peut … » (lire la légende), pour les questions de niveau 1. */
(function () {
  'use strict';
  const M = window.M;
  // art = dessin de js/art-lib.js; emoji = ce même dessin en ligne (légende, consignes, choix)
  const P = (id, x, y, art, label, fn, extra = {}) => ({ id, x, y, w: 1.2, h: 1.2, art, emoji: M.art.html(art, { size: 30, alt: label }), label, fn, ...extra }); // nom = avec l'article
  M.registerData('us-plans', [
    { id: 'quartier-maya', titre: 'Le quartier de Maya', cols: 7, rows: 5,
      roads: [{ x1: 0, y1: 2.5, x2: 7, y2: 2.5 }, { x1: 3.5, y1: 0, x2: 3.5, y2: 5 }],
      places: [
        P('maison', 0.4, 0.6, 'pl-maison', 'maison de Maya', 'où Maya habite', { color: '#fff6d6', nom: 'la maison de Maya' }),
        P('caserne', 1.9, 0.6, 'pl-caserne', 'caserne de pompiers', 'où sont les pompiers', { nom: 'la caserne de pompiers' }),
        P('ecole', 4.1, 0.6, 'pl-ecole', 'école', 'où on va apprendre', { nom: 'l\'école' }),
        P('clinique', 5.5, 0.6, 'pl-clinique', 'clinique', 'où on se fait soigner', { nom: 'la clinique' }),
        P('biblio', 0.4, 3.2, 'pl-biblio', 'bibliothèque', 'où on emprunte des livres', { nom: 'la bibliothèque' }),
        P('parc', 1.9, 3.2, 'pl-parc', 'parc', 'où on joue dehors', { color: '#dcf7ee', nom: 'le parc' }),
        P('epicerie', 4.1, 3.2, 'pl-epicerie', 'épicerie', 'où on achète de la nourriture', { nom: 'l\'épicerie' }),
        P('piscine', 5.5, 3.2, 'pl-piscine', 'piscine', 'où on va nager', { color: '#dff3fb', nom: 'la piscine' }),
      ] },
    { id: 'classe', titre: 'La classe de Kevin', cols: 6, rows: 4, roads: [], ground: 'floor',
      places: [
        P('tableau', 2.4, 0.2, 'pl-tableau', 'tableau et bureau de l\'enseignante', 'où l\'enseignante écrit au tableau', { nom: 'le tableau' }),
        P('porte', 0.2, 0.2, 'pl-porte', 'porte', 'par où on entre dans la classe', { nom: 'la porte' }),
        P('lecture', 4.6, 0.2, 'pl-livres', 'coin lecture', 'où on lit des livres', { color: '#fff6d6', nom: 'le coin lecture' }),
        P('pupitres', 1.6, 1.45, 'pl-pupitres', 'pupitres des élèves', 'où les élèves s\'assoient', { w: 2.8, h: 1.1, fill: 'repeat', nom: 'les pupitres' }),
        P('evier', 0.2, 2.7, 'pl-evier', 'évier', 'où on se lave les mains', { color: '#dff3fb', nom: 'l\'évier' }),
        P('casiers', 2.4, 2.7, 'pl-sac', 'casiers', 'où on range son sac', { nom: 'les casiers' }),
        P('fenetre', 4.6, 2.7, 'pl-plante', 'plantes près de la fenêtre', 'où poussent les plantes de la classe', { color: '#dcf7ee', nom: 'les plantes' }),
      ] },
    { id: 'cour', titre: 'La cour d\'école', cols: 6, rows: 4, roads: [],
      places: [
        P('ecole', 0.2, 0.2, 'pl-ecole', 'école', 'où sont les classes', { w: 2.4, nom: 'l\'école' }),
        P('modules', 3.0, 0.2, 'pl-glissoire', 'modules de jeux', 'où on glisse et on grimpe', { color: '#fff6d6', nom: 'les modules de jeux' }),
        P('balancoires', 4.6, 0.2, 'pl-balancoire', 'balançoires', 'où on se balance', { nom: 'les balançoires' }),
        P('soccer', 0.2, 2.6, 'pl-soccer', 'terrain de soccer', 'où on joue au ballon', { w: 2.4, color: '#dcf7ee', fill: 'stretch', nom: 'le terrain de soccer' }),
        P('fontaine', 3.0, 2.6, 'pl-abreuvoir', 'abreuvoir', 'où on boit de l\'eau', { color: '#dff3fb', nom: 'l\'abreuvoir' }),
        P('support', 4.6, 2.6, 'pl-velo', 'support à vélos', 'où on range son vélo', { nom: 'le support à vélos' }),
      ] },
    { id: 'maison-awa', titre: 'La maison d\'Awa (vue de dessus)', cols: 6, rows: 4, roads: [], ground: 'floor',
      places: [
        P('cuisine', 0.2, 0.2, 'pl-cuisine', 'cuisine', 'où on prépare les repas', { w: 1.8, nom: 'la cuisine' }),
        P('salon', 2.2, 0.2, 'pl-divan', 'salon', 'où la famille se repose sur le divan', { w: 1.6, nom: 'le salon' }),
        P('chambre', 4.0, 0.2, 'pl-lit', 'chambre d\'Awa', 'où Awa dort', { w: 1.8, color: '#fff6d6', nom: 'la chambre d\'Awa' }),
        P('salle-bain', 0.2, 2.6, 'pl-bain', 'salle de bain', 'où on prend son bain', { w: 1.8, color: '#dff3fb', nom: 'la salle de bain' }),
        P('entree', 2.2, 2.6, 'pl-porte', 'entrée', 'par où on entre dans la maison', { w: 1.6, nom: 'l\'entrée' }),
        P('lavage', 4.0, 2.6, 'pl-laveuse', 'salle de lavage', 'où on lave les vêtements', { w: 1.8, nom: 'la salle de lavage' }),
      ] },
  ]);
})();
