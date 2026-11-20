/* Univers social — paysages (GHEC A.3) : éléments naturels / humains, plans d'eau et relief.
   Dessins SVG maison (M.art) avec repli emoji. */
(function () {
  'use strict';
  const M = window.M;
  const svg = (inner) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
  const SKY = '<rect width="100" height="100" rx="10" fill="#dff3fb"/>';
  const GRASS = (y) => `<rect y="${y}" width="100" height="${100 - y}" fill="#9bd38b"/>`;
  M.art.register(
    'us-fleuve',
    () =>
      svg(
        `${SKY}${GRASS(38)}<path d="M0 50 Q50 44 100 40 L100 80 Q50 84 0 92 z" fill="#3a8fd1"/><path d="M14 66 h22 l-4 6 h-14 z" fill="#fff"/><rect x="22" y="58" width="6" height="8" fill="#ef476f"/><path d="M60 62 q6 -3 12 0 M70 56 q6 -3 12 0" stroke="#bfe3ff" stroke-width="2.5" fill="none"/>`,
      ),
    '🌊',
  );
  M.art.register(
    'us-lac',
    () =>
      svg(
        `${SKY}${GRASS(40)}<ellipse cx="50" cy="68" rx="34" ry="18" fill="#3a8fd1"/><path d="M38 66 q5 -3 10 0 M54 72 q5 -3 10 0" stroke="#bfe3ff" stroke-width="2.5" fill="none"/><path d="M8 40 l8 -16 l8 16 z M80 42 l7 -14 l7 14 z" fill="#2f7d4a"/>`,
      ),
    '🏞️',
  );
  M.art.register(
    'us-riviere',
    () =>
      svg(
        `${SKY}${GRASS(36)}<path d="M40 36 C60 50 20 62 46 76 S70 92 56 100" stroke="#3a8fd1" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M14 46 l8 -16 l8 16 z M74 60 l8 -16 l8 16 z" fill="#2f7d4a"/>`,
      ),
    '🏞️',
  );
  M.art.register(
    'us-montagne',
    () =>
      svg(
        `${SKY}<path d="M0 90 L34 26 L52 58 L68 34 L100 90 z" fill="#8d7b68"/><path d="M34 26 L26 42 L34 38 L42 42 z M68 34 L62 44 L68 42 L74 46 z" fill="#fff"/>${GRASS(88)}`,
      ),
    '🏔️',
  );
  M.art.register(
    'us-foret',
    () =>
      svg(
        `${SKY}${GRASS(70)}${[
          [14, 72],
          [32, 64],
          [50, 74],
          [68, 62],
          [86, 72],
          [24, 86],
          [60, 88],
          [80, 90],
        ]
          .map(
            ([x, y]) =>
              `<path d="M${x} ${y - 34} l12 26 h-24 z M${x} ${y - 22} l14 26 h-28 z" fill="#2f7d4a"/><rect x="${x - 2}" y="${y + 4}" width="4" height="6" fill="#7a4f27"/>`,
          )
          .join('')}`,
      ),
    '🌲',
  );
  M.art.register(
    'us-champ',
    () =>
      svg(
        `${SKY}<rect y="44" width="100" height="56" fill="#e9c46a"/>${[52, 62, 72, 82, 92].map((y) => `<path d="M0 ${y} L100 ${y - 6}" stroke="#c9a227" stroke-width="3"/>`).join('')}<rect x="70" y="26" width="18" height="18" fill="#d62828"/><path d="M68 27 L79 16 L90 27 z" fill="#7a2e1f"/>`,
      ),
    '🌾',
  );

  M.registerData('us-paysages', {
    elements: [
      { nom: 'une montagne', emoji: '⛰️', kind: 'naturel' },
      { nom: 'une rivière', emoji: '🏞️', kind: 'naturel' },
      { nom: 'un arbre', emoji: '🌳', kind: 'naturel' },
      { nom: 'une roche', emoji: '🪨', kind: 'naturel' },
      { nom: 'un volcan', emoji: '🌋', kind: 'naturel' },
      { nom: 'des nuages', emoji: '☁️', kind: 'naturel' },
      { nom: 'des fleurs sauvages', emoji: '🌼', kind: 'naturel' },
      { nom: 'une vague', emoji: '🌊', kind: 'naturel' },
      { nom: 'une maison', emoji: '🏠', kind: 'humain' },
      { nom: 'un pont', emoji: '🌉', kind: 'humain' },
      { nom: 'une route', emoji: '🛣️', kind: 'humain' },
      { nom: 'une usine', emoji: '🏭', kind: 'humain' },
      { nom: 'un chemin de fer', emoji: '🛤️', kind: 'humain' },
      { nom: 'une école', emoji: '🏫', kind: 'humain' },
      { nom: 'une tour à bureaux', emoji: '🏢', kind: 'humain' },
      { nom: 'un stade', emoji: '🏟️', kind: 'humain' },
    ],
    mots: [
      { id: 'fleuve', nom: 'un fleuve', art: 'us-fleuve', def: "un très grand cours d'eau qui va jusqu'à la mer" },
      { id: 'lac', nom: 'un lac', art: 'us-lac', def: "de l'eau entourée de terre de tous les côtés" },
      { id: 'riviere', nom: 'une rivière', art: 'us-riviere', def: "un cours d'eau qui coule et serpente" },
      { id: 'montagne', nom: 'une montagne', art: 'us-montagne', def: 'un relief très haut' },
      { id: 'foret', nom: 'une forêt', art: 'us-foret', def: "beaucoup d'arbres ensemble" },
      { id: 'champ', nom: 'un champ', art: 'us-champ', def: 'une terre où on cultive des plantes' },
    ],
    faits: [
      { t: 'Le fleuve Saint-Laurent coule vers la mer.', v: true },
      { t: 'Un lac est entouré de terre.', v: true },
      { t: "Une forêt, c'est beaucoup d'arbres ensemble.", v: true },
      { t: 'Au Québec, il y a beaucoup de lacs et de rivières.', v: true },
      { t: 'Un pont est un élément naturel.', v: false },
      { t: 'Les montagnes ont été construites par les humains.', v: false },
      { t: 'Une rivière coule toujours dans un lac fermé, sans jamais en sortir.', v: false },
      { t: 'Une route est construite par les humains.', v: true },
    ],
    ailleurs: [
      {
        t: "Dans un pays où il fait très chaud toute l'année, quels vêtements porte-t-on le plus souvent ?",
        ok: 'Des vêtements légers et un chapeau de soleil 👒',
        d: ['Un habit de neige 🧥', 'Des mitaines et une tuque 🧤'],
      },
      {
        t: "Dans le Grand Nord du Québec, l'hiver est très long et très froid. De quoi a-t-on besoin ?",
        ok: "D'un manteau très chaud 🧥",
        d: ["D'un maillot de bain 🩱", 'De sandales 🩴'],
      },
      {
        t: "Dans un désert, il pleut très rarement. Qu'est-ce qui est précieux ?",
        ok: "L'eau 💧",
        d: ['La neige ❄️', 'Les bottes de pluie 🥾'],
      },
      {
        t: "Pour traverser une grande rivière à pied ou en auto, qu'ont construit les humains ?",
        ok: 'Un pont 🌉',
        d: ['Une montagne ⛰️', 'Une forêt 🌲'],
      },
      {
        t: "Où trouve-t-on des gratte-ciel et beaucoup d'autos ?",
        ok: 'Dans une grande ville 🏙️',
        d: ["Au milieu d'une forêt 🌲", 'Sur un lac gelé ❄️'],
      },
    ],
  });
})();
