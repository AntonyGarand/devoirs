/* =====================================================================
   types/subjects-todo.d.ts — TEMPORAIRE (any volontaires).
   Membres de M, champs privés de questions et données partagées PROPRES À UNE MATIÈRE, en attendant leurs vrais types.
   Le cadre (js/*.ts) est typé; ces lignes évitent seulement que chaque matière croule sous des erreurs en cascade.

   TODO (agent de chaque matière) : déclarer le vrai type dans un fichier de la matière, au niveau supérieur
   (scripts globaux → fusion de déclarations), puis RETIRER la ligne correspondante d'ici
   (deux déclarations d'un même membre avec des types différents sont une erreur) :
       interface MApi { MU: MusiqueApi }                      // ex. js/musique/subject.ts
       interface QuestionExtras { _sc?: ScMeta }              // champ privé ajouté aux questions
       interface DataRegistry { 'fr.mots': Mot[] }            // M.registerData / M.data
   Supprimer ce fichier quand il est vide.
   ===================================================================== */

interface MApi {
  // TODO(maths)
  pb: any;
  opViz: any;
  opStrat: any;
  geo: any;
  mesure: any;
  stats: any;
  nb: any;
  // TODO(francais)
  FR: any;
  // TODO(anglais)
  EN: any;
  // TODO(univers)
  us: any;
  // TODO(sciences)
  SC: any;
  // TODO(musique) — services.ts appelle M.MU.stop() avant de parler (un son d'instrument ne joue pas par-dessus la voix) :
  // MusiqueApi doit garder stop?(): void.
  MU: any;
  MU_SAMPLES: any;
}

interface QuestionExtras {
  // TODO(maths) : métadonnées pour check()
  _sudoku?: any;
  _bal?: any;
  _clues?: any;
  _cluesIncl?: any;
  _n?: any;
  _money?: any;
  // TODO(sciences)
  _sc?: any;
}

interface DataRegistry {
  // TODO(francais)
  'fr.mots': any;
  // TODO(maths)
  'pb-contextes': any;
  // TODO(sciences)
  'sc.animaux': any;
  'sc.domestiques': any;
  'sc.objets': any;
  // TODO(univers)
  'us-autrefois': any;
  'us-besoins': any;
  'us-emblemes': any;
  'us-emotions': any;
  'us-familles': any;
  'us-fetes': any;
  'us-lieux': any;
  'us-lignes-temps': any;
  'us-paysages': any;
  'us-plans': any;
  'us-scenarios': any;
}
