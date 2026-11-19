/* Mathématique — matière et domaines (PFEQ, 1er cycle) */
(function () {
  'use strict';
  const M = window.M;
  M.registerSubject({ id: 'maths', title: 'Mathématique', icon: '🔢', color: '#f78c40', soft: '#ffe9d6', desc: 'Nombres, opérations, problèmes, géométrie, mesure, statistique.' });
  [
    { id: 'nombres', title: 'Les nombres', icon: '🔢', color: '#ef476f', soft: '#ffe1e8', pda: 'Arithmétique — Sens et écriture des nombres naturels (< 1000) et fractions' },
    { id: 'operations', title: 'Les opérations', icon: '➕', color: '#f78c40', soft: '#ffe9d6', pda: 'Arithmétique — Sens des opérations et opérations sur les nombres' },
    { id: 'problemes', title: 'Comprendre et résoudre', icon: '🧩', color: '#e76f51', soft: '#fde4dc', pda: 'Compétence 1 — Résoudre une situation-problème; Compétence 2 — Raisonner (compréhension de problèmes écrits)' },
    { id: 'geometrie', title: 'La géométrie', icon: '🔷', color: '#118ab2', soft: '#dff3fb', pda: 'Géométrie — Espace, solides, figures planes, frises' },
    { id: 'mesure', title: 'La mesure', icon: '📏', color: '#06a77d', soft: '#dcf7ee', pda: 'Mesure — Longueurs et temps' },
    { id: 'stats', title: 'Statistique et probabilité', icon: '📊', color: '#9b5de5', soft: '#efe4fb', pda: 'Statistique et Probabilité' },
  ].forEach((d) => M.registerDomain({ subject: 'maths', ...d }));
})();
