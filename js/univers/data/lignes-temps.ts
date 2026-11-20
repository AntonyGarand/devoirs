/* Univers social — lignes du temps de personnages fictifs (jamais celle de l'enfant dans le noté, R5).
   Québec : maternelle à 5 ans (septembre de l'année des 5 ans). */

interface UsEvenement {
  annee: number;
  id: string;
  label: string;
  emoji: string;
}
interface UsPersonnage {
  nom: string;
  f: boolean;
  naissance: number;
  evenements: UsEvenement[];
}
interface UsAge {
  id: string;
  nom: string;
  court: string;
  emoji: string;
  activite: string;
}
interface UsLignesTemps {
  personnages: UsPersonnage[];
  /** Âges de la vie, dans l'ordre. */
  ages: UsAge[];
}
interface DataRegistry {
  'us-lignes-temps': UsLignesTemps;
}

(function () {
  'use strict';
  const M = window.M;
  const ev = (annee: number, id: string, label: string, emoji: string): UsEvenement => ({ annee, id, label, emoji });
  M.registerData('us-lignes-temps', {
    personnages: [
      {
        nom: 'Félix',
        f: false,
        naissance: 2018,
        evenements: [
          ev(2018, 'nais', 'Félix est né', '👶'),
          ev(2019, 'pas', 'premiers pas', '🚶'),
          ev(2021, 'velo', 'premier tricycle', '🚲'),
          ev(2023, 'mat', 'entrée à la maternelle', '🎒'),
          ev(2024, 'a1', 'entrée en 1re année', '📚'),
          ev(2025, 'a2', 'entrée en 2e année', '✏️'),
        ],
      },
      {
        nom: 'Awa',
        f: true,
        naissance: 2017,
        evenements: [
          ev(2017, 'nais', 'Awa est née', '👶'),
          ev(2020, 'frere', 'naissance de son petit frère', '🍼'),
          ev(2021, 'dem', 'déménagement', '📦'),
          ev(2022, 'mat', 'entrée à la maternelle', '🎒'),
          ev(2023, 'nage', 'apprend à nager', '🏊'),
          ev(2024, 'a2', 'entrée en 2e année', '✏️'),
        ],
      },
      {
        nom: 'Kevin',
        f: false,
        naissance: 2016,
        evenements: [
          ev(2016, 'nais', 'Kevin est né', '👶'),
          ev(2017, 'mot', 'premier mot', '💬'),
          ev(2019, 'chien', 'arrivée de son chien', '🐕'),
          ev(2021, 'mat', 'entrée à la maternelle', '🎒'),
          ev(2022, 'a1', 'entrée en 1re année', '📚'),
          ev(2023, 'patin', 'apprend à patiner', '⛸️'),
        ],
      },
      {
        nom: 'Mei',
        f: true,
        naissance: 2019,
        evenements: [
          ev(2019, 'nais', 'Mei est née', '👶'),
          ev(2020, 'pas', 'premiers pas', '🚶'),
          ev(2022, 'garderie', 'entrée à la garderie', '🧸'),
          ev(2024, 'mat', 'entrée à la maternelle', '🎒'),
          ev(2025, 'a1', 'entrée en 1re année', '📚'),
          ev(2026, 'velo', 'vélo sans petites roues', '🚲'),
        ],
      },
    ],
    ages: [
      { id: 'bebe', nom: 'bébé', court: 'bébé', emoji: '👶', activite: 'boit du lait et apprend à marcher 🍼' },
      { id: 'enfant', nom: 'enfant', court: 'enfant', emoji: '🧒', activite: "va à l'école primaire 🎒" },
      { id: 'ado', nom: 'adolescent ou adolescente', court: 'ado', emoji: '🧑', activite: "va à l'école secondaire 🏫" },
      { id: 'adulte', nom: 'adulte', court: 'adulte', emoji: '🧔', activite: "travaille et s'occupe d'une maison 💼" },
      {
        id: 'aine',
        nom: 'aîné ou aînée',
        court: 'aîné',
        emoji: '🧓',
        activite: 'est souvent à la retraite et a parfois des petits-enfants 🏡',
      },
    ],
  });
})();
