/* =====================================================================
   types/registry.d.ts — matières → domaines → habiletés, pages Apprendre, progression (core.ts, services.ts)
   ===================================================================== */

/** Message d'erreur, ou rien (falsy) si tout va bien. */
type CheckResult = string | false | null | undefined | void;

/** Encouragement d'une matière (dans sa langue). */
interface Cheer {
  text: string;
  lang?: string;
}

/** M.registerSubject(def) */
interface SubjectDef {
  id: string;
  title: string;
  icon: string;
  /** Couleur (jeton CSS, ex. 'var(--subj-francais)'). */
  color: string;
  soft: string;
  desc?: string;
  order?: number;
  cheers?: Cheer[];
  /** Règle de la matière appliquée à chaque question générée (tools/check-skills.ts). */
  lint?(q: Question, skill: Skill): CheckResult;
  /** Html ajouté en tête du tableau de bord de la matière. */
  banner?(): string | null | undefined | void;
  parentNote?: string;
}
interface Subject extends SubjectDef {
  order: number;
}

/** M.registerDomain(def) */
interface DomainDef {
  id: string;
  /** Id de la matière. */
  subject: string;
  title: string;
  icon: string;
  color: string;
  soft: string;
  /** Référence au programme (Progression des apprentissages). */
  pda?: string;
  parentNote?: string;
}
type Domain = DomainDef;

/** Contexte de gen() : niveau selon la maîtrise (0 découverte, 1 attendu, 2 défi). */
interface GenCtx {
  lvl: number;
}
/** Voix exigée par une habileté. */
type SkillNeed = 'speech:en' | 'speech:fr';

/**
 * M.registerSkill(def). Q = type des questions générées (défaut : Question);
 * M.registerSkill<QuestionOf<'choice'>>({ … }) donne des check(q) / gen() plus précis.
 */
interface SkillDef<Q extends Question = Question> {
  id: string;
  domain: string;
  title: string;
  icon?: string;
  desc?: string;
  /** Référence au programme, affichée aux parents. */
  pda: string;
  /** Id de la page Apprendre liée. */
  learn?: string;
  order?: number;
  /** Proposée dans la première révision. */
  starter?: boolean;
  /** Au-delà du programme : 🌟, exclue de la révision. */
  enrichment?: boolean;
  /** Discussion (reflect) : jamais notée, exclue de la révision. */
  ungraded?: boolean;
  needs?: SkillNeed[];
  /** true si disponible, sinon la raison. */
  available?(): true | string | false | null | undefined;
  /** Textes que l'habileté fera lire (vérifie qu'une voix peut les lire). */
  sayTexts?(): string[] | null | undefined;
  parentNote?: string;
  /** Contrôle de sens propre à l'habileté (tools/check-skills.ts). */
  check?(q: Q): CheckResult;
  lint?(q: Q): CheckResult;
  /** Retourne une question; ne touche jamais au DOM. */
  gen(ctx: GenCtx): Q;
}
interface Skill extends SkillDef {
  order: number;
}

/** M.registerLearn(def) */
interface LearnDef {
  id: string;
  domain: string;
  title: string;
  icon?: string;
  /** Sous-titre de l'index Apprendre. */
  short?: string;
  /** Introduction (html), lue par 🔊. */
  intro?: string;
  order?: number;
  parentNote?: string;
  render(el: HTMLElement): void;
}
interface Learn extends LearnDef {
  order: number;
}

/** M.registerParentTool(def) */
interface ParentToolDef {
  id: string;
  subject?: string;
  title: string;
  icon?: string;
  render(el: HTMLElement): void;
}

/* ------------------------------------------------------------------ progression */
type Bit = 0 | 1;
/** Maîtrise : 0 à 3 étoiles. */
type Mastery = 0 | 1 | 2 | 3;
interface SkillProgress {
  /** 20 dernières réponses du premier coup. */
  hist: Bit[];
  n: number;
  ok: number;
  /** Date.now() de la dernière réponse. */
  last: number;
}
interface ItemProgress {
  h: Bit[];
  last: number;
}
interface ProgressData {
  skills: Record<string, SkillProgress>;
  stars: number;
  /** 'AAAA-MM-JJ' → nombre de réponses. */
  days: Record<string, number>;
  /** 'skillId|clé' → historique (M.progress.item). */
  items?: Record<string, ItemProgress>;
  /** Cartes de réflexion faites, par habileté. */
  participation?: Record<string, number>;
}
interface ItemStats {
  n: number;
  acc: number | null;
  last: number;
}
interface ItemTracker {
  record(ok: boolean): void;
  stats(): ItemStats;
}
interface ProgressApi {
  data(): ProgressData;
  skill(id: string): SkillProgress;
  record(id: string, ok: boolean): void;
  mastery(id: string): Mastery;
  /** Taux de réussite récent, null si jamais essayé. */
  acc(id: string): number | null;
  daysSince(id: string): number;
  streak(): number;
  reset(): void;
  /** Progression par élément (mot, fait numérique…). */
  item(skillId: string, key: string | number): ItemTracker;
  participate(skillId: string): void;
}
