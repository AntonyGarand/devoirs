/* =====================================================================
   data/verbes.js — formes mémorisées de l'indicatif présent (PDA Conjugaison C.1)
   aimer, aller, avoir, dire, être, faire — sans radical ni terminaison (3e année).
   P = pronoms de conjugaison (personnes 0..5); il/elle/on et ils/elles partagent la forme.
   ===================================================================== */

type FrVerbeId = 'etre' | 'avoir' | 'aimer' | 'aller' | 'dire' | 'faire';
/** Pronom de conjugaison et sa personne k (0..5). */
interface FrPronom {
  p: string;
  k: number;
}
interface FrVerbe {
  inf: string;
  em: string;
  /** Formes aux personnes 0..5. */
  f: string[];
}
interface FrancaisApi {
  PRONOMS: FrPronom[];
  VERBES: Record<FrVerbeId, FrVerbe>;
  /** Clés de VERBES, dans l'ordre. */
  VERBE_IDS: FrVerbeId[];
  /** Groupe pronom + verbe avec élision : « j'ai », « je suis ». */
  conj(v: FrVerbeId, pron: string): string;
  /** Compléments invariables qui vont avec chaque verbe. */
  SUITE: Record<FrVerbeId, string[]>;
}

(function () {
  'use strict';
  const M = window.M;
  M.FR = M.FR || ({} as FrancaisApi);
  M.FR.PRONOMS = [
    { p: 'je', k: 0 },
    { p: 'tu', k: 1 },
    { p: 'il', k: 2 },
    { p: 'elle', k: 2 },
    { p: 'on', k: 2 },
    { p: 'nous', k: 3 },
    { p: 'vous', k: 4 },
    { p: 'ils', k: 5 },
    { p: 'elles', k: 5 },
  ];
  M.FR.VERBES = {
    etre: { inf: 'être', em: '⭐', f: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] },
    avoir: { inf: 'avoir', em: '🎒', f: ['ai', 'as', 'a', 'avons', 'avez', 'ont'] },
    aimer: { inf: 'aimer', em: '❤️', f: ['aime', 'aimes', 'aime', 'aimons', 'aimez', 'aiment'] },
    aller: { inf: 'aller', em: '🚶', f: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'] },
    dire: { inf: 'dire', em: '💬', f: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'] },
    faire: { inf: 'faire', em: '🛠️', f: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'] },
  };
  M.FR.VERBE_IDS = ['etre', 'avoir', 'aimer', 'aller', 'dire', 'faire'];
  /** Groupe pronom + verbe avec élision : « j'ai », « j'aime », « je suis ». */
  M.FR.conj = (v, pron) => {
    const P = M.FR.PRONOMS.find((x) => x.p === pron);
    if (!P) throw new Error('pronom inconnu : ' + pron);
    const f = M.FR.VERBES[v].f[P.k];
    return (pron === 'je' && /^[aeiouéêh]/.test(f) ? "j'" : pron + ' ') + f;
  };
  /** Compléments qui vont avec chaque verbe (invariables : aucun accord à faire). */
  M.FR.SUITE = {
    etre: ["à l'école", 'dans la cour', 'au parc', 'en deuxième année'],
    avoir: ['faim', 'soif', 'sept ans', 'peur du noir', 'mal au ventre'],
    aimer: ['le chocolat', 'la neige', 'les pommes', 'jouer dehors'],
    aller: ['au parc', "à l'école", 'chez grand-maman', 'à la piscine'],
    dire: ['bonjour', 'merci', 'la vérité', 'une blague'],
    faire: ['un dessin', 'du vélo', 'un gâteau', 'un bonhomme de neige'],
  };
})();
