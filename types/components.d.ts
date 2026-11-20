/* =====================================================================
   types/components.d.ts — composants d'interface (M.ui : ui.ts, ui-extra.ts) et visuels (M.viz : viz.ts, viz-extra.ts)
   ===================================================================== */

/* ------------------------------------------------------------------ M.ui */
type CalloutTone = 'tip' | 'info' | 'success' | 'warn';
interface VocabItem {
  emoji?: string;
  word: string;
  say?: string;
  lang?: string;
  note?: string;
}
interface DemarcheStep {
  icon: string;
  label: string;
  detail?: string;
}
interface TabDef {
  id: string;
  label: string;
  render(panel: HTMLElement): void;
}
interface StepperOpts {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (v: number) => void;
}
interface ValueCtl<V> {
  get(): V;
  set(v: V, silent?: boolean): void;
}
interface Flashcard {
  front: string;
  back: string;
  say?: string;
  lang?: string;
}
interface SliderStop<V> {
  value: V;
  icon?: string;
  label?: string;
}
interface SliderBase {
  label?: string;
  /** Lire la valeur à chaque changement. */
  speak?: boolean;
}
/** Curseur à paliers illustrés. */
interface SliderStops<V> extends SliderBase {
  stops: SliderStop<V>[];
  value?: V;
  onChange?: (v: V) => void;
}
/** Curseur continu. */
interface SliderRange extends SliderBase {
  stops?: undefined;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (v: number) => void;
  /** Texte affiché pour la valeur. */
  format?: (v: number) => string | number;
}
interface CycleStage {
  emoji?: string;
  art?: string;
  label: string;
  say?: string;
}
/** Classe de mot (couleurs --cls-*). */
type WordTag = 'nom' | 'det' | 'adj' | 'verbe' | 'pron' | 'autre';
interface TaggedWord {
  w: string;
  tag?: WordTag | (string & {});
}
interface Feeling {
  emoji: string;
  label: string;
}
interface CompareCol {
  title: string;
  items?: (string | { emoji?: string; label?: string })[];
}

interface UiApi {
  /** Bloc d'une page Apprendre. */
  section(opts: { icon?: string; title: string; intro?: string; body?: string; id?: string }): string;
  callout(html: string, opts?: { tone?: CalloutTone; who?: string }): string;
  /** Bouton 🔊 déclaratif (data-say). */
  speak(text: string, opts?: { lang?: string; label?: string }): string;
  tag(text: string, color?: string, soft?: string): string;
  vocab(items: VocabItem[]): string;
  DEMARCHE: DemarcheStep[];
  demarche(steps?: DemarcheStep[], active?: number): string;
  tabs(el: HTMLElement, tabs: TabDef[], startId?: string): { show(id: string): void };
  stepper(el: HTMLElement, opts: StepperOpts): ValueCtl<number>;
  flashcards(el: HTMLElement, cards: Flashcard[]): void;
  reading(el: HTMLElement, opts: { title?: string; text: string; lang?: string }): void;
  /** Questions « Vérifie ta compréhension » (non comptées). */
  miniQuiz(el: HTMLElement, questions: QuizItem[], opts?: { title?: string }): void;
  slider<V>(el: HTMLElement, opts: SliderStops<V>): ValueCtl<V>;
  slider(el: HTMLElement, opts: SliderRange): ValueCtl<number>;
  /** Cycle en cercle (zones data-hot="c<i>"). */
  cycle(opts: { stages: CycleStage[]; hide?: number[]; size?: number }): string;
  wordParts(word: string, parts: string[], opts?: { mode?: 'syllabes' | 'sons'; say?: string[] | null; colors?: string[] }): string;
  tagged(tokens: TaggedWord[], opts?: { arrows?: [number, number][] }): string;
  gloss(word: string, fr: string, opts?: { lang?: string }): string;
  FEELINGS: Feeling[];
  feelings(el: HTMLElement, opts?: { onPick?: (f: Feeling) => void }): void;
  compare(opts: { left: CompareCol; right: CompareCol }): string;
}

/* ------------------------------------------------------------------ M.viz */
/** Démonstration animée d'un visuel. */
interface ShowMeCtl {
  showMe(): Promise<void>;
}
type CounterKind = 'A' | 'B' | 'E';
type CountersMode = 'count' | 'cross' | 'fill' | 'none';
interface CounterCellSpec {
  kind: CounterKind;
  crossed?: boolean;
}
interface CountersCommon {
  emoji?: string;
  hint?: string;
}
/** Jetons d'une opération : a op b (unknown : la valeur cherchée). */
interface CountersOp extends CountersCommon {
  a: number;
  b: number;
  op: 'add' | 'sub';
  unknown?: 'r' | 'a' | 'b';
  cells?: undefined;
}
/** Jetons donnés un par un. */
interface CountersCells extends CountersCommon {
  cells: CounterCellSpec[];
  mode?: CountersMode;
  /** Nombre à barrer (mode cross, showMe). */
  b?: number;
  op?: 'add' | 'sub';
  unknown?: 'r' | 'a' | 'b';
}
type CountersOpts = CountersOp | CountersCells;
interface BlocksOpts {
  a: number;
  b: number;
  op: 'add' | 'sub';
  unknown?: 'r' | 'a' | 'b';
}
interface NumberLineOpts {
  lo: number;
  hi: number;
  /** Départ de la grenouille (absent : pas de grenouille). */
  start?: number | null;
  /** Arrivée utilisée par showMe(). */
  end?: number;
  /** Pas des bonds de showMe (auto si absent). */
  step?: number;
  labelEvery?: number;
  tickEvery?: number;
  hideLabels?: number[];
  /** Flèche « ? » au-dessus d'une valeur. */
  arrowAt?: number | null;
  /** valeur → html */
  marks?: Record<number, string>;
  interactive?: boolean;
  /** Boutons de bonds (ex. [-10, -1, 1, 10]). */
  buttons?: number[];
  hint?: string;
}
interface NumberLineCtl {
  hop(to: number): Promise<void>;
  reset(): void;
  showMe(end?: number, stepSize?: number): Promise<void>;
}
type BarTone = 'A' | 'B' | 'C' | 'E' | 'X' | 'Q';
interface BarSeg {
  /** null : inconnue (en jaune). */
  v?: number | null;
  text?: string;
  tone?: BarTone;
  isNew?: boolean;
}
interface BarRow {
  label?: string;
  emoji?: string;
  segs: BarSeg[];
}
interface BarBrace {
  v?: number | null;
  text?: string;
  unknown?: boolean;
  isNew?: boolean;
}
interface BarModelSpec {
  type?: 'tout' | 'comparaison' | 'groupes';
  rows: BarRow[];
  /** Accolade au-dessus de la 1re barre. */
  total?: BarBrace;
  /** Comparaison : écart pointillé après la barre la plus courte. */
  diff?: BarBrace;
  scale?: 'prop' | 'schema';
  /** Remplace « ? » au showMe. */
  answer?: number | null;
  compact?: boolean;
  aria?: string;
}
interface BarModelHtmlOpts {
  compact?: boolean;
  /** Sans animation d'entrée. */
  static?: boolean;
  aria?: string;
  scale?: number;
}
interface TimelineEvent {
  at: number;
  id: string;
  label?: string;
  emoji?: string;
}
interface TimelineSpec {
  from: number;
  to: number;
  step?: number;
  title?: string;
  events?: TimelineEvent[];
  /** Ids d'événements cachés (« ? »). */
  hide?: string[];
  tickLabel?: (v: number) => string | number;
}
interface PlanRect {
  x: number;
  y: number;
  w?: number;
  h?: number;
}
interface PlanRoad {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface PlanPlace extends PlanRect {
  id: string;
  emoji?: string;
  art?: string;
  fill?: 'repeat' | 'stretch';
  label?: string;
  color?: string;
}
interface PlanSpec {
  title?: string;
  cols: number;
  rows: number;
  cell?: number;
  /** Quadrillage A, B, C… / 1, 2, 3… */
  grid?: boolean;
  north?: boolean;
  ground?: 'grass' | 'floor' | 'tiles';
  roads?: PlanRoad[];
  water?: (PlanRect & { w: number; h: number })[];
  places?: PlanPlace[];
  legend?: boolean;
  /** Arbres et fleurs (défaut : dehors sans quadrillage). */
  decor?: boolean;
  /** Autos et nuages (défaut : oui). */
  alive?: boolean;
}
interface VizApi {
  /** Jetons dans des cadres de dix. */
  counters(el: HTMLElement, opts: CountersOpts): ShowMeCtl;
  /** Blocs base 10 statiques. */
  base10Html(value: number, color?: string, opts?: { small?: boolean }): string;
  /** Blocs base 10 interactifs pour + et −. */
  blocks(el: HTMLElement, opts: BlocksOpts): ShowMeCtl;
  /** Droite numérique avec grenouille. */
  numberLine(el: HTMLElement, opts: NumberLineOpts): NumberLineCtl;
  /** Bornes « jolies » pour une droite contenant les valeurs. */
  lineRange(values: number[], small?: number): { lo: number; hi: number };
  svg(w: number, h: number, inner: string, cls?: string): string;
  barModelHtml(spec: BarModelSpec, opts?: BarModelHtmlOpts): string;
  barModel(el: HTMLElement, spec: BarModelSpec): ShowMeCtl;
  timeline(spec: TimelineSpec): string;
  plan(spec: PlanSpec): string;
}
