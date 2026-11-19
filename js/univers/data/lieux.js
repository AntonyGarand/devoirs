/* Univers social — lieux et métiers du quartier (GHEC 2.3, 2.4).
   Métiers sans stéréotype : genres variés. besoin = à quoi sert le lieu. */
(function () {
  'use strict';
  const M = window.M;
  M.registerData('us-lieux', {
    lieux: [
      { id: 'epicerie', nom: 'l\'épicerie', court: 'épicerie', emoji: '🛒', besoin: 'acheter de la nourriture', pour: 'acheter des fruits et des légumes', metier: 'la caissière', outil: '🧾' },
      { id: 'clinique', nom: 'la clinique', court: 'clinique', emoji: '🏥', besoin: 'se faire soigner', pour: 'voir un médecin quand on est malade', metier: 'l\'infirmier', outil: '🩺' },
      { id: 'biblio', nom: 'la bibliothèque', court: 'bibliothèque', emoji: '📚', besoin: 'emprunter des livres', pour: 'emprunter des livres', metier: 'la bibliothécaire', outil: '📖' },
      { id: 'parc', nom: 'le parc', court: 'parc', emoji: '🌳', besoin: 'jouer dehors', pour: 'jouer dehors et se balancer', metier: 'le jardinier', outil: '🌷' },
      { id: 'ecole', nom: 'l\'école', court: 'école', emoji: '🏫', besoin: 'apprendre', pour: 'apprendre à lire et à compter', metier: 'l\'enseignant', outil: '✏️' },
      { id: 'caserne', nom: 'la caserne de pompiers', court: 'caserne de pompiers', emoji: '🚒', besoin: 'être protégé du feu', pour: 'trouver les pompiers et le camion', metier: 'la pompière', outil: '🧯' },
      { id: 'police', nom: 'le poste de police', court: 'poste de police', emoji: '🚓', besoin: 'être en sécurité', pour: 'demander de l\'aide à la police', metier: 'la policière', outil: '🚨' },
      { id: 'boulangerie', nom: 'la boulangerie', court: 'boulangerie', emoji: '🥖', besoin: 'acheter du pain', pour: 'acheter du pain frais', metier: 'le boulanger', outil: '🥐' },
      { id: 'pharmacie', nom: 'la pharmacie', court: 'pharmacie', emoji: '💊', besoin: 'acheter des médicaments', pour: 'acheter des médicaments', metier: 'la pharmacienne', outil: '💊' },
      { id: 'garage', nom: 'le garage', court: 'garage', emoji: '🔧', besoin: 'faire réparer l\'auto', pour: 'faire réparer l\'auto', metier: 'la mécanicienne', outil: '🔧' },
      { id: 'poste', nom: 'le bureau de poste', court: 'bureau de poste', emoji: '📮', besoin: 'envoyer des lettres', pour: 'envoyer une lettre ou un colis', metier: 'le facteur', outil: '✉️' },
      { id: 'piscine', nom: 'la piscine', court: 'piscine', emoji: '🏊', besoin: 'apprendre à nager', pour: 'nager et suivre des cours de natation', metier: 'la sauveteuse', outil: '🛟' },
      { id: 'coiffure', nom: 'le salon de coiffure', court: 'salon de coiffure', emoji: '💇', besoin: 'se faire couper les cheveux', pour: 'se faire couper les cheveux', metier: 'le coiffeur', outil: '✂️' },
      { id: 'hotel', nom: 'l\'hôtel de ville', court: 'hôtel de ville', emoji: '🏛️', besoin: 'prendre des décisions pour la ville', pour: 'voir le conseil municipal qui décide pour la ville', metier: 'la mairesse', outil: '📜' },
    ],
    /* Biens (choses qu'on achète) et services (travail fait pour nous) */
    biens: ['du pain 🥖', 'du lait 🥛', 'des pommes 🍎', 'un jouet 🧸', 'des bottes 🥾', 'un livre neuf 📕'],
    services: ['une coupe de cheveux ✂️', 'la réparation de l\'auto 🔧', 'un cours de natation 🏊', 'la livraison du courrier ✉️', 'un examen chez le dentiste 🦷', 'le ramassage des ordures 🚛'],
    /* Hôtel de ville et conseil municipal */
    municipal: [
      { q: 'Qui décide de construire un nouveau parc dans la ville ?', ok: 'Le conseil municipal', d: ['Le boulanger', 'La bibliothécaire'] },
      { q: 'Où se réunit le conseil municipal ?', ok: 'À l\'hôtel de ville 🏛️', d: ['À l\'épicerie 🛒', 'À la piscine 🏊'] },
      { q: 'Qui dirige le conseil municipal ?', ok: 'La mairesse ou le maire', d: ['La pompière ou le pompier', 'Le coiffeur ou la coiffeuse'] },
      { q: 'Il faut réparer les trous dans les rues de la ville. Qui s\'en occupe ?', ok: 'La ville (la municipalité)', d: ['La pharmacie', 'Le salon de coiffure'] },
    ],
  });
})();
