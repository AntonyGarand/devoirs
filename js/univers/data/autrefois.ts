/* Univers social — avant (il y a environ 100 ans, quand les arrière-grands-parents étaient enfants) et maintenant.
   GHEC — Changement : objets d'usage courant, transports, activités. Pas de dates précises. */

/** Objet illustré : emoji, ou dessin de M.art (art). */
interface UsObjet {
  nom: string;
  emoji?: string;
  art?: string;
  /** Sans ambiguïté pour le tri « autrefois / aujourd'hui » (niveau 0). */
  tri?: boolean;
}
interface UsPaireAutrefois {
  domaine: string;
  avant: UsObjet;
  maintenant: UsObjet;
}
/** Question à choix : q, bonne réponse ok, distracteurs d. */
interface UsQcm {
  q: string;
  ok: string;
  d: string[];
}
interface UsAutrefois {
  paires: UsPaireAutrefois[];
  /** rang : ordre d'apparition (du plus ancien au plus récent). */
  transports: { nom: string; emoji: string; rang: number }[];
  questions: UsQcm[];
}
interface DataRegistry {
  'us-autrefois': UsAutrefois;
}

(function () {
  'use strict';
  const M = window.M;
  const sv = (inner: string) => `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">${inner}</svg>`;
  M.art.register(
    'us-planche',
    () =>
      sv(
        '<rect x="10" y="60" width="80" height="34" rx="6" fill="#9ec5e8" stroke="#3d6b99" stroke-width="3"/><rect x="30" y="8" width="40" height="70" rx="4" fill="#c99a5b" stroke="#7a4f27" stroke-width="3"/>' +
          [22, 30, 38, 46, 54, 62].map((y) => `<path d="M34 ${y} h32" stroke="#7a4f27" stroke-width="3"/>`).join(''),
      ),
    '🧺',
  );
  M.art.register(
    'us-laveuse',
    () =>
      sv(
        '<rect x="18" y="10" width="64" height="82" rx="8" fill="#f4f6fa" stroke="#7a7f99" stroke-width="3"/><path d="M18 26 h64" stroke="#7a7f99" stroke-width="3"/><circle cx="30" cy="18" r="3.5" fill="#06a77d"/><circle cx="50" cy="58" r="22" fill="#bfe3ff" stroke="#7a7f99" stroke-width="4"/><path d="M36 62 q14 -8 28 0" stroke="#fff" stroke-width="3" fill="none"/>',
      ),
    '🫧',
  );
  M.art.register(
    'us-glaciere',
    () =>
      sv(
        '<rect x="20" y="10" width="60" height="84" rx="4" fill="#b07a46" stroke="#7a4f27" stroke-width="3"/><rect x="28" y="18" width="44" height="30" fill="#c99a5b" stroke="#7a4f27" stroke-width="2"/><rect x="36" y="24" width="28" height="18" fill="#dff3fb" stroke="#7fb3d5" stroke-width="2"/><rect x="28" y="54" width="44" height="32" fill="#c99a5b" stroke="#7a4f27" stroke-width="2"/><circle cx="66" cy="70" r="3" fill="#e9b949"/>',
      ),
    '🧊',
  );
  M.art.register(
    'us-frigo',
    () =>
      sv(
        '<rect x="24" y="6" width="52" height="90" rx="8" fill="#f4f6fa" stroke="#7a7f99" stroke-width="3"/><path d="M24 38 h52" stroke="#7a7f99" stroke-width="3"/><rect x="66" y="16" width="4" height="14" rx="2" fill="#7a7f99"/><rect x="66" y="48" width="4" height="22" rx="2" fill="#7a7f99"/>',
      ),
    '❄️',
  );
  M.art.register(
    'us-poele',
    () =>
      sv(
        '<rect x="14" y="36" width="72" height="44" rx="4" fill="#3a3a3a"/><rect x="24" y="48" width="26" height="22" rx="3" fill="#f78c40"/><path d="M30 66 q4 -12 8 -4 q4 -10 8 4" fill="#ffd166"/><rect x="62" y="10" width="10" height="26" fill="#555"/><rect x="18" y="80" width="6" height="12" fill="#3a3a3a"/><rect x="76" y="80" width="6" height="12" fill="#3a3a3a"/>',
      ),
    '🔥',
  );
  M.art.register(
    'us-cuisiniere',
    () =>
      sv(
        '<rect x="16" y="24" width="68" height="70" rx="6" fill="#f4f6fa" stroke="#7a7f99" stroke-width="3"/><rect x="16" y="24" width="68" height="14" fill="#2b2d42"/><circle cx="34" cy="31" r="5" fill="#ef476f"/><circle cx="66" cy="31" r="5" fill="#7a7f99"/><rect x="26" y="48" width="48" height="34" rx="4" fill="#dfe3ea" stroke="#7a7f99" stroke-width="2"/>',
      ),
    '🍳',
  );
  M.art.register(
    'us-ardoise',
    () =>
      sv(
        '<rect x="10" y="20" width="80" height="60" rx="4" fill="#c99a5b"/><rect x="16" y="26" width="68" height="48" fill="#2f3e46"/><text x="50" y="58" text-anchor="middle" font-size="22" fill="#fff" font-family="cursive">a b c</text>',
      ),
    '🪧',
  );
  M.art.register(
    'us-ecole-rang',
    () =>
      sv(
        '<rect width="100" height="100" rx="10" fill="#dff3fb"/><rect y="78" width="100" height="22" fill="#9bd38b"/><rect x="22" y="44" width="56" height="38" fill="#c0392b"/><path d="M16 46 L50 20 L84 46 z" fill="#7a2e1f"/><rect x="44" y="60" width="12" height="22" fill="#7a4f27"/><rect x="28" y="52" width="10" height="10" fill="#fff"/><rect x="62" y="52" width="10" height="10" fill="#fff"/><rect x="48" y="12" width="4" height="10" fill="#555"/><path d="M50 10 l-4 -2 v6 z" fill="#e9b949"/>',
      ),
    '🏚️',
  );

  M.registerData('us-autrefois', {
    /* tri: true = sans ambiguïté pour le tri « autrefois / aujourd'hui » (niveau 0) : l'objet d'autrefois n'est plus
       d'usage courant, l'objet d'aujourd'hui n'existait pas il y a 100 ans (écran, Internet, cellulaire).
       L'ampoule, l'auto, la laveuse ou le réfrigérateur existaient déjà vers 1925 : ils servent seulement aux paires (niveau 1). */
    paires: [
      {
        domaine: 'maison',
        avant: { nom: "la lampe à l'huile", emoji: '🪔', tri: true },
        maintenant: { nom: "l'ampoule électrique", emoji: '💡' },
      },
      {
        domaine: 'maison',
        avant: { nom: 'la glacière à bloc de glace', art: 'us-glaciere', tri: true },
        maintenant: { nom: 'le réfrigérateur', art: 'us-frigo' },
      },
      {
        domaine: 'maison',
        avant: { nom: 'la planche à laver', art: 'us-planche', tri: true },
        maintenant: { nom: 'la laveuse', art: 'us-laveuse' },
      },
      {
        domaine: 'maison',
        avant: { nom: 'le poêle à bois', art: 'us-poele' },
        maintenant: { nom: 'la cuisinière électrique', art: 'us-cuisiniere' },
      },
      {
        domaine: 'maison',
        avant: { nom: "le seau d'eau tiré du puits", emoji: '🪣', tri: true },
        maintenant: { nom: 'le robinet', emoji: '🚰' },
      },
      {
        domaine: 'communication',
        avant: { nom: 'le télégramme', emoji: '📜', tri: true },
        maintenant: { nom: 'le texto', emoji: '💬', tri: true },
      },
      {
        domaine: 'communication',
        avant: { nom: 'le téléphone à manivelle', emoji: '☎️', tri: true },
        maintenant: { nom: 'le téléphone cellulaire', emoji: '📱', tri: true },
      },
      {
        domaine: 'transport',
        avant: { nom: 'la calèche tirée par un cheval', emoji: '🐎', tri: true },
        maintenant: { nom: "l'automobile", emoji: '🚗' },
      },
      {
        domaine: 'transport',
        avant: { nom: 'le train à vapeur', emoji: '🚂', tri: true },
        maintenant: { nom: 'le train électrique', emoji: '🚄' },
      },
      {
        domaine: 'transport',
        avant: { nom: 'la carriole sur la neige', emoji: '🛷', tri: true },
        maintenant: { nom: "l'autobus scolaire", emoji: '🚌' },
      },
      {
        domaine: 'école',
        avant: { nom: "l'ardoise et la craie", art: 'us-ardoise', tri: true },
        maintenant: { nom: 'la tablette numérique', emoji: '💻', tri: true },
      },
      { domaine: 'école', avant: { nom: "la plume et l'encrier", emoji: '✒️', tri: true }, maintenant: { nom: 'le stylo', emoji: '🖊️' } },
      {
        domaine: 'école',
        avant: { nom: "l'école de rang (une seule classe)", art: 'us-ecole-rang', tri: true },
        maintenant: { nom: 'la grande école', emoji: '🏫' },
      },
      { domaine: 'loisir', avant: { nom: 'le yo-yo en bois', emoji: '🪀' }, maintenant: { nom: 'le jeu vidéo', emoji: '🎮', tri: true } },
      {
        domaine: 'loisir',
        avant: { nom: 'la photo en noir et blanc', emoji: '🖼️' },
        maintenant: { nom: 'la photo prise avec le cellulaire', emoji: '🤳', tri: true },
      },
    ],
    /* Transports : du plus ancien au plus récent (rang d'apparition). */
    transports: [
      { nom: 'le canot', emoji: '🛶', rang: 0 },
      { nom: 'la calèche', emoji: '🐎', rang: 0 },
      { nom: 'le train à vapeur', emoji: '🚂', rang: 1 },
      { nom: "l'avion", emoji: '✈️', rang: 2 },
      { nom: 'la fusée', emoji: '🚀', rang: 3 },
    ],
    questions: [
      {
        q: "Il y a environ 100 ans, comment beaucoup d'enfants allaient-ils à l'école ?",
        ok: "À pied, même l'hiver 🚶",
        d: ['En trottinette électrique 🛴', 'En avion ✈️'],
      },
      {
        q: 'Il y a environ 100 ans, comment gardait-on la nourriture au froid ?',
        ok: 'Dans une glacière avec un bloc de glace 🧊',
        d: ['Dans un réfrigérateur électrique', 'Dans un four à micro-ondes'],
      },
      {
        q: "Il y a environ 100 ans, comment parlait-on à quelqu'un qui habitait loin ?",
        ok: 'On lui écrivait une lettre ✉️',
        d: ['On lui envoyait un texto 📱', 'On lui faisait un appel vidéo 💻'],
      },
      {
        q: "Il y a environ 100 ans, comment s'éclairait-on dans beaucoup de maisons à la campagne ?",
        ok: "Avec une lampe à l'huile 🪔",
        d: ['Avec des lumières DEL 💡', "Avec l'écran d'une tablette 📱"],
      },
      {
        q: 'Il y a environ 100 ans, dans une école de rang, combien de classes y avait-il souvent ?',
        ok: 'Une seule classe pour tous les âges',
        d: ['Vingt classes', 'Aucune classe'],
      },
      {
        q: 'Il y a environ 100 ans, comment lavait-on les vêtements dans beaucoup de maisons ?',
        ok: 'À la main, avec une planche à laver 🧺',
        d: ["Avec une laveuse qu'on démarre avec un cellulaire 📱", 'Avec un robot laveur 🤖'],
      },
      {
        q: "Il y a environ 100 ans, à la campagne, où prenait-on souvent l'eau ?",
        ok: 'Au puits, avec un seau 🪣',
        d: ['Dans des bouteilles commandées sur Internet 💻', 'Dans une fontaine à écran tactile 📱'],
      },
      {
        q: "Il y a environ 100 ans, avec quoi écrivait-on à l'école ?",
        ok: "Avec une plume et de l'encre, ou sur une ardoise ✒️",
        d: ['Sur une tablette numérique 💻', "Avec le clavier d'un ordinateur ⌨️"],
      },
      {
        q: 'Il y a environ 100 ans, comment écoutait-on de la musique à la maison ?',
        ok: "On chantait ensemble ou on jouait d'un instrument 🎻",
        d: ['Avec des écouteurs sans fil 🎧', 'Sur une tablette 💻'],
      },
      {
        q: "Il y a environ 100 ans, comment voyageait-on souvent l'hiver à la campagne ?",
        ok: 'En carriole tirée par un cheval 🛷',
        d: ['En motoneige électrique 🛵', 'En avion privé ✈️'],
      },
    ],
  });
})();
