/* =====================================================================
   types/question.d.ts — questions, formats et carte-question (voir docs/framework.md § 3–4)
   Scripts globaux (pas de modules) : tout ce qui est déclaré ici est visible partout.

   Question = union discriminée sur `format` (ou son alias historique `input`) :
     { format: 'choice', prompt, choices, answer, … }   → QuestionOf<'choice'>
   Une matière peut :
     - ajouter des champs privés à toutes les questions :   interface QuestionExtras { _sc?: ScMeta }
     - (rare) ajouter un format :                           interface QuestionFormats { rythme: RythmeFields }
   ===================================================================== */

/** Valeur d'un choix, d'une tuile, d'une boîte… (comparée par String(a) === String(b)). */
type Value = string | number;

/** Segment lu par M.say (séquence, langues mélangées). */
interface SaySegment {
  text: string | number;
  lang?: string;
  /** Pause après le segment (ms). */
  pauseAfter?: number;
  rate?: number;
  pitch?: number;
  /** true : ne pas transformer les symboles mathématiques (+, −, =…) en mots. */
  raw?: boolean;
}
/** Ce que M.say accepte : un texte, ou une séquence de segments. */
type SayText = string | number | readonly SaySegment[];

/** Jeton d'un texte découpé par M.tokenize : mot (ponctuation attachée) et numéro de phrase. '¶' = paragraphe. */
interface Token {
  w: string;
  s: number;
}

/** Texte à lire au-dessus de la consigne. */
interface Passage {
  title?: string;
  html?: string;
  /** M.tokenize(texte) : mots touchables (lus au toucher), marquables par tapwords target:'passage'. */
  tokens?: Token[];
  /** Texte lu par 🔊 (par défaut : le texte). */
  say?: string;
  lang?: string;
  /** Compréhension orale : texte caché, « 👀 Voir le texte » après la réponse. */
  listenOnly?: boolean;
}

/** Écoute (dictée, anglais) : boutons 🔊 Écoute et 🐢 Lentement. */
interface AudioSpec {
  text?: string;
  /** Séquence (ex. mot – phrase – mot). */
  seq?: string[];
  lang?: string;
  /** Pause entre les éléments de seq (ms, défaut 900). */
  pause?: number;
  rate?: number;
  /** Lecture automatique (défaut true); 'once' : une seule fois par série. */
  autoplay?: boolean | 'once';
  /** Clé pour autoplay 'once' (défaut : le texte). */
  key?: string;
}

/** Image du bandeau au-dessus de la consigne. */
interface SceneItem {
  emoji?: string;
  /** Nom d'un dessin de M.art. */
  art?: string;
  label?: string;
}

/** Résultat d'une carte-question. */
interface QuestionResult {
  /** Réussie du premier coup. */
  first: boolean;
  ok: boolean;
  ungraded: boolean;
}

/**
 * Champs privés ajoutés aux questions par les matières (métadonnées pour check/lint/viz).
 * Chaque matière l'augmente à son niveau (fichier script, donc déclaration globale) :
 *   interface QuestionExtras { _sc?: { … } }
 */
interface QuestionExtras {}

/** Champs communs à toutes les questions. */
interface QuestionBase extends QuestionExtras {
  /** Consigne (html). {?} = case-réponse en ligne (format number). */
  prompt: string;
  /** Texte lu par 🔊 (défaut : la consigne); segments pour mélanger les langues. */
  say?: string | SaySegment[];
  /** Consigne entièrement dans une autre langue (ex. 'en-CA'). */
  sayLang?: string;
  /** Langue des éléments lus au toucher (choix, tuiles, paires…). */
  lang?: string;
  passage?: string | Passage;
  audio?: string | AudioSpec;
  scene?: SceneItem[];
  /** Visuel interactif (concret → imagé). Le seul endroit, avec showMe, où une question touche au DOM. */
  viz?: (el: HTMLElement) => unknown;
  /** Démonstration animée (aussi jouée après un échec). */
  showMe?: (el: HTMLElement) => unknown;
  /** Indice après la 1re erreur (html). */
  hint?: string;
  /** Explication après la réponse : COMMENT penser (html). */
  explain?: string;
  /** Forcer la réponse pleine largeur. */
  layout?: 'wide';
  /** Remplace le nombre d'essais du format. */
  tries?: number;
  /** Appelé à la fin de la carte (en plus de opts.onResult). */
  onResult?: (r: QuestionResult) => void;
  /** Question de secours (gen a planté) : jamais comptée. */
  _broken?: boolean;
  /** Question de musique : la musique d'ambiance se tait. */
  _mu?: unknown;
}

/** Choix de réponse (choice, multi, order, predict). */
interface Choice<V extends Value = Value> {
  /** Libellé (html : texte, emoji ou SVG). */
  label: string;
  value: V;
  /** Texte lu par le bouton 🔊 du choix. */
  say?: string;
  lang?: string;
  /** Message affiché si l'enfant choisit ce distracteur. */
  why?: string;
}

/* ------------------------------------------------------------------ champs propres à chaque format */
interface NumberFields {
  /** Entier ≥ 0. */
  answer: number;
  unit?: string;
}
interface ChoiceFields {
  choices: Choice[];
  answer: Value;
  cols?: number;
  /** Choix lus seulement (chaque choix doit avoir say). */
  audioOnly?: boolean;
}
interface TfLabel {
  label: string;
  say?: string;
  lang?: string;
}
interface TfFields {
  answer: boolean;
  /** [vrai, faux], ex. 👍 Yes / 👎 No. */
  labels?: [TfLabel, TfLabel];
}
interface MultiFields {
  choices: Choice[];
  answer: Value[];
  cols?: number;
  audioOnly?: boolean;
}
interface OrderFields {
  choices: Choice[];
  /** Valeurs dans le bon ordre. */
  answer: Value[];
  /** Positions déjà placées (cycles). */
  fixed?: number[];
  cols?: number;
  audioOnly?: boolean;
}
interface TextFields {
  answer: string | string[];
  caseSensitive?: boolean | 'first';
  /** false : accents non exigés (défaut : exigés). */
  accents?: boolean;
  keyboard?: 'accents' | 'full' | 'none';
  prefix?: string;
  suffix?: string;
  /** false : pas de diagnostic (accents, majuscule, une lettre). */
  diagnose?: boolean;
  placeholder?: string;
}
interface Tile {
  label: string;
  value: Value;
  say?: string;
  lang?: string;
}
interface BuildFields {
  tiles: (string | Tile)[];
  /** Valeurs des tuiles, dans l'ordre. */
  answer: Value[];
  /** Autres séquences acceptées. */
  accept?: Value[][];
  /** Séparateur ('' pour un mot, ' ' par défaut). */
  join?: string;
  fixedEnd?: string;
  capitalizeFirst?: boolean;
}
interface MatchPair {
  left: string;
  right: string;
  sayLeft?: string;
  sayRight?: string;
  langLeft?: string;
  langRight?: string;
}
interface MatchFields {
  pairs: MatchPair[];
  shuffleLeft?: boolean;
}
interface SortBin {
  id: Value;
  label: string;
  say?: string;
  lang?: string;
}
interface SortItem {
  label: string;
  bin: Value;
  say?: string;
  lang?: string;
  /** Clé privée (non affichée) : identifie l'élément pour check() (ex. id de la fiche). */
  key?: string;
}
interface SortFields {
  bins: SortBin[];
  items: SortItem[];
}
interface ClozeBlank {
  choices: string[];
  answer: string;
}
interface ClozeFields {
  /** Texte avec {0}, {1}… */
  text: string;
  blanks: ClozeBlank[];
}
interface TapwordsFields {
  /** Indices des jetons (ou des phrases si unit:'sentence'). */
  answer: number[];
  /** Mots de la phrase ('¶' = paragraphe); absent avec target:'passage'. */
  words?: string[];
  /** Toucher directement dans le texte de la question (passage.tokens). */
  target?: 'passage';
  unit?: 'word' | 'sentence';
  /** Marque persistante sur le passage : question, donnée, intrus. */
  mark?: 'q' | 'd' | 'x';
  select?: 'one' | 'many';
  mode?: 'letters';
  /** Jetons surlignés après une erreur [début, fin]. */
  hintSpan?: [number, number];
  /** Rempli par la validation de steps (jetons du passage de la question parente). */
  _passageTokens?: Token[];
}
interface HotspotFields {
  /** SVG avec des zones data-hot="id". */
  html: string;
  /** Une zone, ou toutes les zones (→ Vérifier). */
  answer: string | string[];
  answerText?: string;
  answerSay?: string;
}
interface LabelSpec {
  id: string;
  text: string;
  say?: string;
}
interface LabelFields {
  /** SVG avec des zones data-hot (data-anchor="x,y" facultatif). */
  html: string;
  labels: LabelSpec[];
  distractors?: string[];
  /** Page Apprendre : toucher = lire. */
  explore?: boolean;
}
interface EstimateFields {
  lo: number;
  hi: number;
  answer: number;
  /** Écart accepté. */
  tolerance: number;
  labelEvery?: number;
  unit?: string;
}
interface InfoFields {
  html?: string;
  button?: string;
}
interface ReflectFields {
  /** Libellés des boutons (défaut : « On en a parlé » / « Je préfère passer »). */
  actions?: string[];
  /** Jamais de réponse. */
  answer?: never;
}
/** Champs d'une étape (format steps). */
interface StepExtras {
  label?: string;
  /** Indice de M.ui.DEMARCHE (0 à 5). */
  demarche?: number;
  /** Texte ajouté à la rétroaction de l'étape. */
  after?: string;
}
interface StepsFields {
  /** Le prompt d'une étape peut citer la réponse d'une étape précédente : {s1}, {s2}… */
  steps: StepItem[];
  /** Étapes comptées pour l'étoile (défaut : toutes). */
  scoreSteps?: number[];
}
interface PredictFields {
  predict: { prompt?: string; choices: Choice[] };
  /** Valeur du choix qui se produit. */
  outcome: Value;
  /** Joue l'expérience dans el. */
  simulate: (el: HTMLElement, prediction: Value) => unknown;
  /** Html affiché après l'expérience. */
  result?: string;
  /** Question notée après l'expérience (sans check : carte non comptée). */
  check?: SubQuestion;
}

/** Champs propres à chaque format, par nom de format. Une matière peut l'augmenter (nouveau format). */
interface QuestionFormats {
  number: NumberFields;
  choice: ChoiceFields;
  tf: TfFields;
  multi: MultiFields;
  order: OrderFields;
  text: TextFields;
  build: BuildFields;
  match: MatchFields;
  sort: SortFields;
  cloze: ClozeFields;
  tapwords: TapwordsFields;
  hotspot: HotspotFields;
  label: LabelFields;
  estimate: EstimateFields;
  info: InfoFields;
  reflect: ReflectFields;
  steps: StepsFields;
  predict: PredictFields;
}
type FormatName = keyof QuestionFormats;

/** `format` (ou son alias historique `input`). */
type FormatKey<K extends FormatName> = { format: K; input?: K } | { format?: undefined; input: K };

/** Question d'un format précis. */
type QuestionOf<K extends FormatName> = QuestionBase & QuestionFormats[K] & FormatKey<K>;
/** N'importe quelle question (union discriminée sur format / input). */
type Question = { [K in FormatName]: QuestionOf<K> }[FormatName];
/** Formats permis dans une étape (steps) ou un check (predict). */
type SubFormatName = Exclude<FormatName, 'steps' | 'predict'>;
type SubQuestion = { [K in SubFormatName]: QuestionOf<K> }[SubFormatName];
/** Une étape du format steps. */
type StepItem = SubQuestion & StepExtras;

/* ------------------------------------------------------------------ définition d'un format (formats.ts) */
type AttemptResult = 'correct' | 'retry' | 'failed';
/** Gestionnaire de clavier d'un format; inputs:true → reçoit aussi les touches tapées dans un champ texte. */
type KeyHandler = ((e: KeyboardEvent) => void) & { inputs?: boolean };

/** Texte à jetons d'une question affichée (pour tapwords target:'passage'). */
interface PassageCtl {
  el: HTMLElement;
  /** Élément de chaque jeton (par indice). */
  tokens: HTMLElement[];
  tokenData: Token[];
  setMarking(on: boolean): void;
  onTap(fn: ((i: number) => void) | null): void;
}

/** Contexte passé à render() par la carte-question (ou par une étape). */
interface FormatCtx<Q = Question> {
  q: Q;
  host: HTMLElement;
  /** La consigne contient {?} : setInline remplit la case. */
  hasInline: boolean;
  setInline(html: string): void;
  passage: PassageCtl | null;
  readonly done: boolean;
  readonly tries: number;
  feedback(cls: string, html: string): void;
  /** Termine la carte (formats à correction immédiate). */
  complete(first: boolean, ok: boolean): void;
  /** Essai standard. */
  attempt(ok: boolean, val?: unknown): AttemptResult;
  onKey(fn: KeyHandler): void;
}

/** Ce que render() peut retourner. */
interface FormatInstance {
  /** Montre la bonne réponse (après l'échec). */
  reveal?(): void;
  /** Désactive les contrôles (fin de carte); sinon tous les boutons sont désactivés. */
  lock?(): void;
}

/** Définition passée à M.registerFormat. Méthodes (bivariance) : FormatSpec<QuestionOf<'choice'>> est un FormatSpec<Question>. */
interface FormatSpec<Q = Question> {
  doc: string;
  layout?: 'wide';
  /** Jamais noté (info, reflect). */
  ungraded?: boolean;
  /** Message d'erreur, ou rien si la question est valide (tools/check-skills.ts). */
  validate(q: Q): string | undefined | void;
  render(host: HTMLElement, q: Q, ctx: FormatCtx<Q>): FormatInstance | void;
  maxTries?(q: Q): number;
  answerLabel?(q: Q): string;
  instruction?(q: Q): string;
  retryMessage?(q: Q, val: unknown): string;
}
/** Format enregistré (M.formats[name]). */
interface FormatDef<Q = Question> extends FormatSpec<Q> {
  name: string;
}

/* ------------------------------------------------------------------ carte-question et série (session.ts) */
interface RenderQuestionOpts {
  skill?: Skill;
  onResult?: (r: QuestionResult) => void;
  onNext?: () => void;
  nextLabel?: string;
  /** false : ne pas faire voler l'étoile (mini-quiz, tests). */
  record?: boolean;
}
interface QuestionCard {
  destroy(): void;
  ctx?: FormatCtx;
}
interface SessionOpts {
  /** Ids d'habiletés, une question chacune. */
  items: string[];
  back?: string;
  /** Nouvelle série pour « Encore ! ». */
  regen?: () => string[];
  title?: string;
  /** Empreintes de la série précédente (évitées si possible). */
  avoid?: Set<string> | null;
}
/** Élément d'un mini-quiz : une question, ou un générateur (jamais deux fois la même question). */
type QuizItem = Question | (() => Question);
