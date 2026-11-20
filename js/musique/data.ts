/* =====================================================================
   musique/data.js — données de la matière Musique (M.MU.*)
     INSTRUMENTS : instruments de percussion de la classe (PDA C.2.a, C.3.a, A.4.a, A.5.a)
       { id, nom, le, art, inst (synthèse), matiere: 'bois'|'metal'|'peau'|'graines', qualite: 'sec'|'resonnant', geste }
     CORPS       : percussions corporelles (C.1.a)
     SOURCES     : phrases à classer : voix chantée / effet vocal / percussion corporelle (C.1.a)
     MOODS       : caractères pour l'appréciation (tempo, nuance, registre — vocabulaire pour justifier)
   Vocabulaire officiel (PDA 2009, 1er cycle) : fort / doux; aigu / grave; long, très long, court, très court, silence;
   lent / rapide; pulsation; noire, croches, soupir; sec / résonnant; forme A-B; sons qui montent / descendent / se répètent.
   ===================================================================== */

/** Ce qui fait le son d'un instrument. */
type MuMatiere = 'bois' | 'metal' | 'peau' | 'graines';
type MuQualite = 'sec' | 'resonnant';
type MuMood = 'joyeuse' | 'triste' | 'calme' | 'agitee';
interface MuMatiereInfo {
  id: MuMatiere;
  label: string;
  icon: string;
  soft: string;
}
/** Instrument de percussion de la classe. */
interface MuInstrument {
  id: string;
  nom: string;
  /** Avec l'article : « le tambour », « les maracas ». */
  le: string;
  /** Dessin (M.art). */
  art: string;
  /** Son de la synthèse (MuEvent.inst). */
  inst: string;
  matiere: MuMatiere;
  qualite: MuQualite;
  /** Comment on en joue. */
  geste: string;
}
/** Percussion corporelle. */
interface MuBodySound {
  id: string;
  nom: string;
  icon: string;
  inst: string;
}
/** Action à classer selon sa source sonore (bin : id de MU.SOURCE_BINS). */
interface MuSourceItem {
  t: string;
  bin: string;
}
interface MuMoodInfo {
  label: string;
  icon: string;
  /** Pourquoi (tempo, nuance, registre), html. */
  why: string;
}
interface MusiqueApi {
  MATIERES: MuMatiereInfo[];
  INSTRUMENTS: MuInstrument[];
  instById: Record<string, MuInstrument>;
  CORPS: MuBodySound[];
  SOURCES: MuSourceItem[];
  SOURCE_BINS: { id: string; label: string }[];
  MOODS: Record<MuMood, MuMoodInfo>;
}

(function () {
  'use strict';
  const M = window.M;
  const MU = (M.MU = M.MU || ({} as MusiqueApi));

  MU.MATIERES = [
    { id: 'bois', label: 'Bois', icon: '🪵', soft: '#f6e7d4' },
    { id: 'metal', label: 'Métal', icon: '🔩', soft: '#e7ecf3' },
    { id: 'peau', label: 'Peau tendue', icon: '🥁', soft: '#fde6f1' },
  ];
  MU.INSTRUMENTS = [
    {
      id: 'tambour',
      nom: 'tambour',
      le: 'le tambour',
      art: 'mu-tambour',
      inst: 'tambour',
      matiere: 'peau',
      qualite: 'resonnant',
      geste: 'on frappe la peau avec une baguette',
    },
    {
      id: 'tambourin',
      nom: 'tambourin',
      le: 'le tambourin',
      art: 'mu-tambourin',
      inst: 'tambourin',
      matiere: 'peau',
      qualite: 'resonnant',
      geste: 'on le frappe ou on le secoue : la peau et les petites cymbales sonnent',
    },
    {
      id: 'triangle',
      nom: 'triangle',
      le: 'le triangle',
      art: 'mu-triangle',
      inst: 'triangle',
      matiere: 'metal',
      qualite: 'resonnant',
      geste: 'on frappe le métal avec une petite tige',
    },
    {
      id: 'cymbales',
      nom: 'cymbales',
      le: 'les cymbales',
      art: 'mu-cymbales',
      inst: 'cymbale',
      matiere: 'metal',
      qualite: 'resonnant',
      geste: "on frappe les deux disques l'un contre l'autre",
    },
    {
      id: 'grelots',
      nom: 'grelots',
      le: 'les grelots',
      art: 'mu-grelots',
      inst: 'grelots',
      matiere: 'metal',
      qualite: 'resonnant',
      geste: 'on les secoue',
    },
    {
      id: 'claves',
      nom: 'bâtons rythmiques',
      le: 'les bâtons rythmiques',
      art: 'mu-claves',
      inst: 'claves',
      matiere: 'bois',
      qualite: 'sec',
      geste: "on frappe un bâton contre l'autre",
    },
    {
      id: 'woodblock',
      nom: 'bloc de bois',
      le: 'le bloc de bois',
      art: 'mu-woodblock',
      inst: 'woodblock',
      matiere: 'bois',
      qualite: 'sec',
      geste: 'on le frappe avec une baguette',
    },
    {
      id: 'maracas',
      nom: 'maracas',
      le: 'les maracas',
      art: 'mu-maracas',
      inst: 'maracas',
      matiere: 'graines',
      qualite: 'sec',
      geste: "on les secoue : les graines à l'intérieur font le son",
    },
    {
      id: 'xylophone',
      nom: 'xylophone',
      le: 'le xylophone',
      art: 'mu-xylophone',
      inst: 'xylo',
      matiere: 'bois',
      qualite: 'resonnant',
      geste: 'on frappe les lames avec une baguette; chaque lame fait une note',
    },
  ];
  MU.instById = Object.fromEntries(MU.INSTRUMENTS.map((x) => [x.id, x]));
  MU.CORPS = [
    { id: 'mains', nom: 'taper des mains', icon: '👏', inst: 'mains' },
    { id: 'pieds', nom: 'taper des pieds', icon: '🦶', inst: 'pieds' },
    { id: 'doigts', nom: 'claquer des doigts', icon: '🫰', inst: 'doigts' },
    { id: 'cuisses', nom: 'taper sur les cuisses', icon: '🦵', inst: 'cuisses' },
  ];
  MU.SOURCES = [
    { t: 'Chanter « Bonne fête »', bin: 'voix' },
    { t: 'Chanter une berceuse', bin: 'voix' },
    { t: 'Chanter « Ah ! vous dirai-je, maman »', bin: 'voix' },
    { t: 'Chanter une comptine en classe', bin: 'voix' },
    { t: 'Faire le bruit du vent : « Chhhhh »', bin: 'effet' },
    { t: 'Imiter le chat : « Miaou ! »', bin: 'effet' },
    { t: 'Faire « Boum ! » comme un tonnerre', bin: 'effet' },
    { t: 'Siffler comme un oiseau', bin: 'effet' },
    { t: 'Faire claquer sa langue : « clac clac »', bin: 'effet' },
    { t: 'Taper des mains', bin: 'corps' },
    { t: 'Taper des pieds', bin: 'corps' },
    { t: 'Claquer des doigts', bin: 'corps' },
    { t: 'Taper sur ses cuisses', bin: 'corps' },
    { t: 'Frotter ses mains ensemble', bin: 'corps' },
  ];
  MU.SOURCE_BINS = [
    { id: 'voix', label: '🎤 Voix chantée' },
    { id: 'effet', label: '🗣️ Effet vocal' },
    { id: 'corps', label: '👏 Percussion corporelle' },
  ];
  MU.MOODS = {
    joyeuse: { label: 'joyeuse', icon: '😄', why: 'elle est <b>rapide</b>, plutôt <b>aiguë</b>, avec des sons courts et sautillants' },
    triste: { label: 'triste', icon: '😢', why: 'elle est <b>lente</b>, plutôt <b>grave</b>, avec des sons longs et doux' },
    calme: { label: 'calme', icon: '😌', why: 'elle est <b>lente</b> et <b>douce</b>, comme une berceuse' },
    agitee: { label: 'agitée', icon: '😠', why: 'elle est <b>forte</b> et <b>rapide</b>, avec des sons graves qui frappent' },
  };
})();
