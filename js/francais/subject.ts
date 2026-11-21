/* Français, langue d'enseignement — matière et domaines (PDA 2009, fin du 1er cycle)
   Conception : docs/hld/francais.md */

/* ---------- Types (scripts globaux : fusion de déclarations) ----------
   M.FR est rempli par morceaux : chaque fichier (data/*.ts, skills/_commun.ts, skills/ma-liste.ts)
   ajoute ses membres à FrancaisApi au niveau supérieur. (M.fr, minuscule, est l'outil d'élision du cadre.) */
interface MApi {
  FR: FrancaisApi;
}
/** M.FR : données et outils du français. */
interface FrancaisApi {}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi); // rempli par data/ et skills/
  M.registerSubject({
    id: 'francais',
    title: 'Français',
    icon: '📚',
    color: 'var(--subj-francais)',
    soft: '#ffe1e8',
    desc: 'Sons, lecture, histoires, mots à écrire, grammaire, phrases et verbes.',
    cheers: [
      { text: 'Bravo !', lang: 'fr-CA' },
      { text: 'Super !', lang: 'fr-CA' },
      { text: 'Bien lu !', lang: 'fr-CA' },
      { text: 'Excellent !', lang: 'fr-CA' },
      { text: 'Tu es un champion des mots !', lang: 'fr-CA' },
      { text: 'Bien écrit !', lang: 'fr-CA' },
      { text: 'Wow, bien joué !', lang: 'fr-CA' },
      { text: 'Génial !', lang: 'fr-CA' },
    ],
  });
  [
    {
      id: 'fr-sons',
      title: 'Les sons et les syllabes',
      icon: '👂',
      color: '#9b5de5',
      soft: '#efe4fb',
      pda: "Lire C.1 b.iv, c.ii (décodage); Orthographe d'usage C.1 (correspondances graphème-phonème); jeux de sonorités (Lire A.3 j)",
    },
    {
      id: 'fr-lecture',
      title: 'Je lis et je comprends',
      icon: '📖',
      color: '#118ab2',
      soft: '#dff3fb',
      pda: 'Lire A (textes), C.1 (identification des mots), C.2 (gestion de la compréhension)',
    },
    {
      id: 'fr-orthographe',
      title: "J'écris les mots",
      icon: '✏️',
      color: '#ef476f',
      soft: '#ffe1e8',
      pda: "Orthographe d'usage A–C (mots de la Liste orthographique du 1er cycle, lettres muettes, majuscule, apostrophe)",
    },
    {
      id: 'fr-grammaire',
      title: 'Les classes de mots et les accords',
      icon: '🧩',
      color: '#06a77d',
      soft: '#dcf7ee',
      pda: 'Accords A (classes de mots), D (pluriel, féminin), E (accords dans le groupe du nom)',
    },
    { id: 'fr-phrase', title: 'La phrase', icon: '💬', color: '#f78c40', soft: '#ffe9d6', pda: 'Syntaxe et ponctuation A.1, B.1, D.1' },
    {
      id: 'fr-ecriture',
      title: "J'écris des phrases",
      icon: '✍️',
      color: '#8338ec',
      soft: '#ede3fd',
      pda: 'Écrire des textes variés (compétence 2) : phrases qui ont du sens, majuscule et point, se relire avec une liste de vérification',
    },
    {
      id: 'fr-verbes',
      title: 'Les verbes au présent',
      icon: '🏃',
      color: '#e76f51',
      soft: '#fde4dc',
      pda: 'Conjugaison C.1 (formes mémorisées de aimer, aller, avoir, dire, être, faire); Accords A.5 (pronoms de conjugaison)',
    },
    {
      id: 'fr-vocabulaire',
      title: "L'alphabet et les familles de mots",
      icon: '🔤',
      color: '#c9a227',
      soft: '#fff4cc',
      pda: "Orthographe d'usage B.1–B.3 (alphabet); Lexique B.1 (familles de mots)",
    },
  ].forEach((d) => M.registerDomain({ subject: 'francais', ...d }));
})();
