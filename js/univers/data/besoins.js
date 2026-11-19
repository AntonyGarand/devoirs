/* Univers social — besoins et envies (CCQ 1re : besoins individuels).
   « Jouer » est un besoin (droit au jeu) : jamais dans les envies. type : corps | coeur | apprendre (null = pas classé au niveau 2). */
(function () {
  'use strict';
  const M = window.M;
  M.registerData('us-besoins', {
    items: [
      { label: 'manger', emoji: '🍎', kind: 'besoin', type: 'corps' },
      { label: 'boire de l\'eau', emoji: '💧', kind: 'besoin', type: 'corps' },
      { label: 'dormir', emoji: '😴', kind: 'besoin', type: 'corps' },
      { label: 'avoir un toit pour s\'abriter', emoji: '🏠', kind: 'besoin', type: 'corps' },
      { label: 'être soigné quand on est malade', emoji: '🩺', kind: 'besoin', type: 'corps' },
      { label: 's\'habiller chaudement l\'hiver', emoji: '🧥', kind: 'besoin', type: 'corps' },
      { label: 'être aimé', emoji: '💛', kind: 'besoin', type: 'coeur' },
      { label: 'avoir des amis', emoji: '🤝', kind: 'besoin', type: 'coeur' },
      { label: 'être écouté', emoji: '👂', kind: 'besoin', type: 'coeur' },
      { label: 'se sentir en sécurité', emoji: '🛡️', kind: 'besoin', type: 'coeur' },
      { label: 'aller à l\'école', emoji: '🏫', kind: 'besoin', type: 'apprendre' },
      { label: 'avoir des livres à lire', emoji: '📚', kind: 'besoin', type: 'apprendre' },
      { label: 'poser des questions', emoji: '❓', kind: 'besoin', type: 'apprendre' },
      { label: 'jouer', emoji: '🪀', kind: 'besoin', type: null },
      { label: 'des bonbons', emoji: '🍬', kind: 'envie' },
      { label: 'une console de jeux', emoji: '🎮', kind: 'envie' },
      { label: 'une troisième paire d\'espadrilles', emoji: '👟', kind: 'envie' },
      { label: 'une piscine dans la cour', emoji: '🏊', kind: 'envie' },
      { label: 'une limousine', emoji: '🚘', kind: 'envie' },
      { label: 'un chandail de vedette', emoji: '👕', kind: 'envie' },
      { label: 'de la crème glacée tous les jours', emoji: '🍨', kind: 'envie' },
    ],
    types: [
      { id: 'corps', label: '🍎 Mon corps' },
      { id: 'coeur', label: '💛 Mon cœur' },
      { id: 'apprendre', label: '📚 Apprendre' },
    ],
    /* Situation → ce qui répond au besoin (ok) */
    reponses: [
      { sit: 'Noah a très faim.', em: '😋', ok: 'Manger un bon repas', off: ['Regarder un film', 'Se brosser les cheveux'] },
      { sit: 'Awa a très soif après la course.', em: '🥵', ok: 'Boire de l\'eau', off: ['Lire un livre', 'Mettre ses bottes'] },
      { sit: 'Félix bâille et ses yeux se ferment.', em: '🥱', ok: 'Aller dormir', off: ['Manger des bonbons', 'Jouer au ballon'] },
      { sit: 'Mei a froid dehors en hiver.', em: '🥶', ok: 'Mettre sa tuque et son manteau', off: ['Boire un jus', 'Enlever ses mitaines'] },
      { sit: 'Samuel a de la fièvre et mal à la gorge.', em: '🤒', ok: 'Voir un médecin ou une infirmière', off: ['Aller à la piscine', 'Manger de la crème glacée'] },
      { sit: 'Inès a de la peine et se sent seule.', em: '😢', ok: 'Parler à une personne qui l\'aime', off: ['Ranger ses crayons', 'Compter jusqu\'à 100'] },
      { sit: 'Gabriel veut apprendre à lire.', em: '📖', ok: 'Aller à l\'école et lire avec un adulte', off: ['Dormir toute la journée', 'Regarder par la fenêtre'] },
    ],
  });
})();
