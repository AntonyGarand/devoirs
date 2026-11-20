/* =====================================================================
   types/services.d.ts — son, voix, réglages, données, dessins, texte (core.ts, services.ts, clips.ts, music.ts)
   ===================================================================== */

interface Window {
  /** Safari ancien. */
  webkitAudioContext?: typeof AudioContext;
}

/* ------------------------------------------------------------------ sons courts (M.sfx) */
interface SfxApi {
  /** Réglage « sons » (Parents). */
  on: boolean;
  tap(): void;
  hop(): void;
  good(): void;
  bad(): void;
  pop(): void;
  tone(freqs: number[], dur?: number, type?: OscillatorType, vol?: number): void;
  /** Contexte audio partagé (créé au besoin). */
  ctx(): AudioContext;
  /** Réveille le contexte audio (autoplay, iOS). */
  wake(): void;
}

/* ------------------------------------------------------------------ voix (M.say, M.voices) */
interface SayOpts {
  lang?: string;
  rate?: number;
  pitch?: number;
  /** true : ne pas lire les symboles mathématiques en mots. */
  raw?: boolean;
  /** Pause entre les segments (ms). */
  pause?: number;
}
type VoiceState = 'exact' | 'fallback' | 'none';
interface VoiceMatch {
  voice: SpeechSynthesisVoice | null;
  state: VoiceState;
}
interface VoicesApi {
  /** Résolue quand la liste des voix est chargée (ou après 2 s). */
  ready(): Promise<void>;
  find(lang: string): VoiceMatch;
  status(lang: string): { state: VoiceState; name: string | null };
  /** Voix de l'appareil pour cette langue (null = liste pas encore chargée). */
  device(lang: string): boolean | null;
  /** Peut-on lire cette langue (et ce texte précis) ? */
  has(lang: string, text?: string | null): boolean;
  choose(base: string, name: string): void;
  all(): SpeechSynthesisVoice[];
}

/* ------------------------------------------------------------------ voix préenregistrée (M.clips) */
interface ClipPart {
  text: string;
  num?: true;
}
/** Fin d'une lecture : true (fini), false (arrêté) ou 'fail' (fichier introuvable). */
type ClipPlayResult = boolean | 'fail';
interface ClipsApi {
  base: string;
  clean(t: unknown): string;
  key(t: unknown, lang?: string): string;
  id(key: string): string;
  piece(t: unknown): string;
  split(t: unknown): ClipPart[];
  _set: Set<string> | null;
  has(id: string): boolean;
  count(): number;
  /** Ids à jouer pour ce texte, ou null. */
  plan(text: unknown, lang?: string): string[] | null;
  enabled(): boolean;
  stop(): void;
  play(ids: string[], rate?: number): Promise<ClipPlayResult>;
}

/* ------------------------------------------------------------------ musique d'ambiance (M.music) */
type MusicMood = 'jeu' | 'calme';
interface MusicApi {
  mood(m: MusicMood, subject?: string | null): void;
  /** Silence tant qu'une raison (ex. 'route', 'q') le demande. */
  hold(on: boolean, reason?: string): void;
  set(on: boolean): void;
  toggle(): boolean;
  on(): boolean;
  volume(v: number): void;
  speaking(on: boolean): void;
  focus(on: boolean): void;
  start(): void;
  /** Rendu hors ligne (tools/music-preview.ts). */
  render(offline: OfflineAudioContext, secs: number, m?: MusicMood, subject?: string): Promise<AudioBuffer>;
}

/* ------------------------------------------------------------------ réglages (M.settings) */
interface SettingsMap {
  sound: boolean;
  autoRead: boolean;
  rate: number;
  /** 'browser' : voix de l'appareil plutôt que les enregistrements. */
  voice?: 'browser' | 'clips';
  music?: boolean;
  musicVol?: number;
}
interface SettingsApi {
  get<K extends keyof SettingsMap>(k: K): SettingsMap[K];
  set<K extends keyof SettingsMap>(k: K, v: SettingsMap[K]): void;
}

/* ------------------------------------------------------------------ données saisies par le parent (M.userData) */
interface UserDataApi {
  /** Valeur enregistrée (JSON non vérifié : à valider par l'appelant), sinon la donnée d'essai, sinon def. */
  get(ns: string, key: string, def?: unknown): unknown;
  set(ns: string, key: string, value: unknown): void;
  remove(ns: string, key: string): void;
  exportAll(): string;
  importAll(json: unknown): void;
  /** Valeur d'essai pour tools/check-skills.ts (aucun effet dans le navigateur). */
  fixture(ns: string, key: string, value: unknown): void;
  useFixtures: boolean;
}

/* ------------------------------------------------------------------ sauvegarde (M.backup) */
interface BackupFile {
  app: string;
  format: number;
  exported: string;
  data: Record<string, unknown>;
}
type BackupCheck =
  | {
      ok: true;
      data: Record<string, unknown>;
      summary: { stars: number; skills: number; /** Valeur du fichier (date ISO normalement), non vérifiée. */ exported: unknown };
    }
  | { ok: false; error: string };
interface BackupApi {
  keys(): string[];
  export(): BackupFile;
  check(obj: unknown): BackupCheck;
  apply(data: Record<string, unknown>): boolean;
}

/**
 * Données partagées entre matières (M.registerData / M.data). Chaque matière précise les siennes :
 *   interface DataRegistry { 'fr.mots': Mot[] }
 * Une clé non déclarée vaut unknown.
 */
interface DataRegistry {
  [id: string]: unknown;
}

/* ------------------------------------------------------------------ dessins (M.art) */
interface ArtOpts {
  /** Taille en px (défaut 64). */
  size?: number;
  /** Texte de remplacement (défaut : le nom). */
  alt?: string;
  /** Html si le dessin n'existe pas. */
  fallback?: string;
}
interface ArtBox {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}
interface ArtApi {
  /** fn(opts) → chaîne SVG; emoji = repli texte. */
  register(name: string, fn: (opts: ArtOpts) => string, emoji?: string): void;
  has(name: string): boolean;
  html(name: string, opts?: ArtOpts): string;
  emoji(name: string): string;
  list(): string[];
  /** <svg> nu, à imbriquer dans un autre SVG (art-lib.ts). */
  svg(name: string, box?: ArtBox): string;
}

/* ------------------------------------------------------------------ texte en français (M.people, M.fr) */
type Genre = 'f' | 'm';
/** Personnage : prénom et accords. */
interface Person {
  n: string;
  /** Féminin. */
  f: boolean;
  il: string;
  Il: string;
  /** Accord féminin : 'e' ou ''. */
  e: string;
  ami: string;
  un: string;
}
interface PeopleApi {
  NAMES: [string, Genre][];
  pick(opts?: { not?: string[]; genre?: Genre }): Person;
}
interface FrApi {
  de(mot: string): string;
  a(gn: string): string;
  que(mot: string): string;
  ne(verbe: string): string;
  je(verbe: string): string;
  le(nom: string): string;
  la(nom: string): string;
  /** Élision générale : el('de'|'que'|'ne'|'le'|'la'|'je'|'me'|'te'|'se'|'ce'|'si'|'jusque'|'lorsque'|'puisque', mot). */
  el(petit: string, mot: string): string;
  /** Commence par une voyelle ou un h muet. */
  elides(mot: string): boolean;
  /** 1 000 (espace insécable des milliers). */
  nb(n: number | string): string;
  /** Remplit {cle}; lève une erreur si une variable manque. */
  fill(tpl: string, vars: Record<string, string | number>): string;
  cap(s: string): string;
  uncap(s: string, names?: string[]): string;
}

/* ------------------------------------------------------------------ disponibilité et vérifications */
interface LintApi {
  /** Refuse les questions notées qui touchent la vie privée de l'enfant. */
  noPrivate(text: string): string | undefined;
}
