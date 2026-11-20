/* =====================================================================
   types/global.d.ts — l'espace global window.M (cadre commun)
   Les fichiers de js/ sont des scripts classiques (pas de modules) : les déclarations de types/*.d.ts sont globales,
   et une interface déclarée au niveau supérieur d'un script s'ajoute à celle-ci (fusion de déclarations).

   Ce fichier ne décrit que le CADRE (js/*.ts). Chaque matière déclare ses propres membres de M
   au début de son fichier (ex. js/musique/subject.ts) :
       interface MApi { MU: MusiqueApi }
       interface MusiqueApi { … }
   Voir docs/framework.md § 1 (Types).

   Autres types : question.d.ts (questions, formats), registry.d.ts (matières, habiletés, progression),
   services.d.ts (voix, réglages, données, dessins, texte), components.d.ts (M.ui, M.viz).
   ===================================================================== */

interface MApi {
  /* ---------- DOM (core.ts) ---------- */
  /** querySelector (dans r, défaut document) : null si absent. */
  $<K extends keyof HTMLElementTagNameMap>(s: K, r?: ParentNode): HTMLElementTagNameMap[K] | null;
  $<K extends keyof SVGElementTagNameMap>(s: K, r?: ParentNode): SVGElementTagNameMap[K] | null;
  $<E extends Element = HTMLElement>(s: string, r?: ParentNode): E | null;
  /** querySelectorAll en tableau. */
  $$<K extends keyof HTMLElementTagNameMap>(s: K, r?: ParentNode): HTMLElementTagNameMap[K][];
  $$<K extends keyof SVGElementTagNameMap>(s: K, r?: ParentNode): SVGElementTagNameMap[K][];
  $$<E extends Element = HTMLElement>(s: string, r?: ParentNode): E[];
  /** Élément touché (e.target ou un parent) qui correspond au sélecteur : M.closest(e, '.choice-btn'). */
  closest<E extends Element = HTMLElement>(e: Event, sel: string): E | null;
  /** Ajoute une feuille de style (CSS propre à une matière, classes préfixées). */
  css(str: string): void;
  /** Échappe & < > " pour du html. */
  esc(s: string | number): string;
  /** Texte d'un html. */
  text(html: string): string;
  toast(html: string, ms?: number): void;

  /* ---------- hasard et nombres (core.ts) ---------- */
  /** Entier de a à b inclus. */
  rnd(a: number, b: number): number;
  pick<T>(a: readonly T[]): T;
  shuffle<T>(a: readonly T[]): T[];
  sleep(ms: number): Promise<void>;
  /** a, a+s, …, b (inclus). */
  range(a: number, b: number, s?: number): number[];
  /** Accord simple : 0 et 1 au singulier. */
  plural(n: number, sing: string, plur?: string): string;
  /** Choix numériques distincts autour de la réponse. */
  numChoices(answer: number, n?: number, spread?: number, min?: number): Choice<number>[];
  /** Nombre en lettres (< 1000). */
  frNum(n: number): string;

  /* ---------- son et effets (core.ts) ---------- */
  sfx: SfxApi;
  confetti(n?: number): void;
  /** Étoile qui vole jusqu'au compteur. */
  flyStar(fromEl: Element | null): void;
  BRAVO: string[];

  /* ---------- stockage et progression (core.ts, services.ts) ---------- */
  STORE_PREFIX: string;
  /** Progression lue (stockage ou fichier) : copie nettoyée, ou null si ce n'en est pas une. */
  normalizeProgress(raw: unknown): ProgressData | null;
  /** Écriture sûre dans localStorage (false si elle échoue). */
  store(k: string, v: unknown): boolean;
  save(): boolean;
  persistStorage(): Promise<boolean>;
  progress: ProgressApi;
  updateStars(): void;
  starsHtml(n: number): string;
  /** Choisit un élément en favorisant ceux qui sont ratés, jamais vus ou anciens. */
  pickWeighted<T>(items: readonly T[], keyFn: (x: T) => string | number, skillId: string): T;
  backup: BackupApi;

  /* ---------- registre : matières → domaines → habiletés (core.ts) ---------- */
  SUBJECTS: Subject[];
  subjectById: Record<string, Subject>;
  registerSubject(def: SubjectDef): void;
  DOMAINS: Domain[];
  domainById: Record<string, Domain>;
  registerDomain(def: DomainDef): void;
  /** Id de la matière d'une habileté ou d'une page Apprendre. */
  subjectOf(skillOrLearn: { domain: string }): string | null;
  skills: Skill[];
  skillById: Record<string, Skill>;
  /** Q : voir SkillDef (jamais déduit : M.registerSkill<QuestionOf<'choice'>>({…}) pour le préciser). */
  registerSkill<Q extends Question = Question>(def: SkillDef<NoInfer<Q>>): void;
  learns: Learn[];
  learnById: Record<string, Learn>;
  registerLearn(def: LearnDef): void;
  /** true si l'habileté peut être pratiquée, sinon la raison. */
  skillStatus(sk: Skill): true | string;
  /** Habiletés d'une révision entrelacée. */
  reviewItems(count?: number, subject?: string | null): string[];
  /** Empreinte d'une question (deux questions de même empreinte = la même question). */
  qSig(q: unknown): string;
  /** Question dont l'empreinte n'est pas dans seen (l'y ajoute); null si l'habileté n'en a plus de nouvelle. */
  genUnique<Q>(make: () => Q, seen: Set<string>, opts?: { avoid?: Set<string> | null; tries?: number }): Q | null;
  onCleanup(fn: () => void): void;
  cleanup(): void;

  /* ---------- voix (services.ts, clips.ts) ---------- */
  voices: VoicesApi;
  isSpeaking(): boolean;
  /** Lit à voix haute; résolue à la fin (false si impossible). */
  say(text: SayText | null | undefined, opts?: SayOpts): Promise<boolean>;
  /** Lit du html (<span lang="en"> avec la voix anglaise). */
  sayHtml(html: string, opts?: SayOpts): Promise<boolean>;
  hush(): void;
  clips: ClipsApi;
  /** Ids des enregistrements (audio/index.js, généré). */
  CLIP_INDEX?: string;
  music: MusicApi;

  /* ---------- réglages et données (services.ts) ---------- */
  settings: SettingsApi;
  userData: UserDataApi;
  parentTools: ParentToolDef[];
  registerParentTool(def: ParentToolDef): void;
  data: DataRegistry;
  registerData<K extends keyof DataRegistry & string>(id: K, value: DataRegistry[K]): DataRegistry[K];

  /* ---------- dessins et texte (services.ts) ---------- */
  art: ArtApi;
  people: PeopleApi;
  fr: FrApi;
  /** Typographie française pour l'affichage (espaces insécables). */
  typo(s: string | null | undefined): string;
  lint: LintApi;

  /* ---------- formats et questions (formats.ts, session.ts) ---------- */
  formats: Record<string, FormatDef | undefined>;
  registerFormat<K extends FormatName>(name: K, def: FormatSpec<QuestionOf<K>>): void;
  /** Découpe un texte en jetons {w, s}. */
  tokenize(text: string): Token[];
  /** Lettres de la cible : vertes si bien écrites, « _ » sinon. */
  letterDiff(guess: string, target: string): string;
  isUngraded(q: Question): boolean;
  formatOf(q: Question): FormatName;
  /** Contenus audio déjà joués dans la série (autoplay: 'once'). */
  heard: Set<string>;
  renderQuestion(host: HTMLElement, q: Question, opts?: RenderQuestionOpts): QuestionCard;
  runSession(root: HTMLElement, opts: SessionOpts): void;

  /* ---------- composants et visuels ---------- */
  ui: UiApi;
  viz: VizApi;

  /* ---------- application (app.ts) et pages chargées à la demande ---------- */
  loadScript(src: string): Promise<void>;
  /** Un exemple par format (styleguide.ts, chargé par #/style et #/test). */
  FORMAT_SAMPLES?: { [K in FormatName]: () => QuestionOf<K> };
  styleguide?(app: HTMLElement): void;
  selfTest?(out?: HTMLElement | null): Promise<SelfTestResult>;
}

/** Résultat de M.selfTest (#/test). */
interface SelfTestResult {
  formats: [string, string, string][];
  errors: string[];
  ok: boolean;
  aborted?: boolean;
}

interface Window {
  M: MApi;
}
