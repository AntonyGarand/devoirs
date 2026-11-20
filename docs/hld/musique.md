# HLD — Musique (2e année, fin du 1er cycle)

> Document de conception de haut niveau. S'appuie sur `docs/framework.md`. Préfixe des ids : `mu-`. Couleur `--subj-musique`
> (#e85d9e), fond doux #fde6f1. Code : `js/musique/` (subject.js, art.js, data.js, skills/, learn/).

## 1. Portée et alignement sur le programme

**Programme** : PFEQ, Domaine des arts — Musique (primaire). Trois compétences : **Inventer** des pièces vocales ou
instrumentales, **Interpréter** des pièces musicales, **Apprécier** des œuvres musicales.
**Progression des apprentissages (PDA) — Musique, 2009** : tableau « Connaissances » par cycle. Les énoncés « a » d'une
rubrique sont ceux du 1er cycle (texte vérifié sur la version anglaise officielle, *Progression of Learning — Music*, 2009;
les marques de cycle ne survivent pas à l'extraction texte : à revérifier sur le PDF imprimé).

| Notion (PDA) | Statut | Habileté(s) / page |
|---|---|---|
| A.1.a Sons forts et doux | **1er cycle** | `mu-fort-doux`, page *Les secrets des sons* |
| A.1.b Nuances : forte, piano, crescendo, decrescendo | 2e cycle — enrichissement (lvl 2) | `mu-fort-doux` |
| A.2.a Durée : noire, deux croches, silence; long, très long, court, très court, silence (code non traditionnel) | **1er cycle** | `mu-long-court`, `mu-ta-titi` |
| A.2.b Blanche | 2e cycle — enrichissement (lvl 2) | `mu-ta-titi` |
| A.3.b Registres aigu et grave | **1er cycle** | `mu-aigu-grave` |
| A.3.a Nommer les sons de la gamme (do, ré, mi…) | cycle à confirmer — nommé à l'aide du piano, jamais « à l'oreille » | `mu-do-re-mi`, page *Le piano do-ré-mi* |
| A.4.a Instruments de percussion de la classe | **1er cycle** | `mu-instruments` |
| A.4.b–c Voix d'enfant / d'adulte, d'homme / de femme | non couvert (demande des enregistrements de voix) | — |
| A.5.a Qualités du son : sec, résonnant | **1er cycle** | `mu-sec-resonnant` |
| B.1.a Symboles traditionnels (noire, croches, soupir) | **1er cycle** (« énumère ») | `mu-ta-titi` |
| B.2.a Code non traditionnel : durée, intensité, hauteur (aigu / grave, ascendant / descendant), sec / résonnant | **1er cycle** | `mu-long-court`, `mu-fort-doux`, `mu-aigu-grave`, page *Les secrets des sons* § 3 |
| C.1.a Voix chantée, effets vocaux, percussions corporelles | **1er cycle** | `mu-voix-corps` |
| C.2.a Quelques instruments de percussion | **1er cycle** | `mu-instruments` |
| C.3.a Objets de bois et de métal qui produisent des sons | **1er cycle** | `mu-instruments` (matières) |
| F.a Procédés de composition : question-réponse, contraste, reproduction sonore | **1er cycle** | `mu-forme`; page *Écouter une musique* § 2 |
| G.1.a Forme personnelle et forme A-B | **1er cycle** | `mu-forme` |
| G.1.b Forme A-B-A | 2e cycle — enrichissement (lvl 2) | `mu-forme` |
| G.2.a Tempos lent et rapide | **1er cycle** | `mu-vite-lent` |
| G.2.c Accelerando, rallentando | 3e cycle — enrichissement (lvl 2, « accélère / ralentit ») | `mu-vite-lent` |
| G.3.a Organisation rythmique : pulsation, noire, silence | **1er cycle** | `mu-pulsation`, `mu-ta-titi` |
| G.4.a Organisation mélodique : sons ascendants, descendants, répétés | **1er cycle** | `mu-aigu-grave` |
| Compétence 1 — Inventer | **1er cycle** | page *Ta, ti-ti, chut !* § 3 (compositeur de rythmes) |
| Compétence 2 — Interpréter | **1er cycle** | page *Ta, ti-ti, chut !* § 4 (jeu de l'écho : taper le rythme entendu) |
| Compétence 3 — Apprécier (exprimer et justifier) | **1er cycle** | `mu-caractere`, page *Écouter une musique* § 3 |
| Techniques vocales et instrumentales (D), règles de groupe (E) | non couvert (se travaille en classe, en groupe) | — |

## 2. Principes

- **Vrais sons enregistrés** : `js/musique/samples.js` (≈ 540 Ko, MP3 mono en base64 pour fonctionner en `file://`),
  généré par `tools/mu-samples.js` à partir de la VCSL (Versilian Community Sample Library, **CC0**) et de Wikimedia
  Commons (« Finger clicks.ogg », domaine public). Piano à queue Kawai, flûte à bec ténor, xylophone (plusieurs notes,
  hauteur ajustée par `playbackRate`), cymbales, triangle, tambourin, grelots, claves, bloc de bois, maracas, gong,
  tambour sur cadre, mains. Pieds = coup grave de cajón (bois + grave, comme un pied sur un plancher); cuisses = main à
  plat sur une peau. Chargé à la demande (`M.MU.load`) sur les pages de musique; la synthèse Web Audio prend le relais
  tant qu'il n'est pas décodé (le premier son attend au plus 1,5 s).
- **Do, ré, mi** : on nomme les notes **à partir du piano** (le do est à gauche des deux touches noires) ou d'un « do »
  donné, jamais à l'oreille seule (ce serait de l'oreille absolue). Couleurs des notes de type « boomwhackers ».
  Chansons : *Au clair de la lune*, *Frère Jacques*, *Ah ! vous dirai-je, maman* (traditionnelles).
- **On compare, on ne juge pas un son seul** : « lequel est le plus fort ? » ne dépend pas du volume de l'appareil;
  « ce son est-il fort ? » si. Même idée pour aigu / grave, long / court, rapide / lent. Exception : sec / résonnant
  d'un son seul (lvl 1), car la résonance s'entend quel que soit le volume.
- **Couleur = son** : le bouton « Son 1 » est bleu, « Son 2 » orange; les choix de réponse reprennent la pastille.
- **Aigu ≠ fort** : confusion fréquente chez l'enfant; rappel dans la page *Les secrets des sons* et règle de matière
  (`lint`) qui refuse une explication associant aigu et « plus fort ».
- **Apprécier** : les questions notées comparent deux musiques très contrastées (joyeuse / triste, calme / agitée) et
  demandent le **pourquoi** avec le vocabulaire (tempo, intensité, hauteur). Le ressenti personnel passe par une carte de
  réflexion jamais notée (« Comment te fait-elle sentir ? »). Triste et calme (toutes deux lentes et douces) ne sont jamais
  opposées l'une à l'autre.
- **Silence d'ambiance** : la musique d'ambiance (`js/music.js`) se tait sur toutes les pages de la matière
  (`M.music.hold`); elle brouillerait les sons à comparer.
- **Lecture automatique** : un lecteur joue ses sons une fois quand il devient visible (pas pendant que l'enfant lit le haut
  d'une page Apprendre).

## 3. Lacunes connues / v2

- Voix d'enfant / d'adulte, d'homme / de femme (A.4.b–c) : il faudrait de vrais enregistrements.
- Portée (lecture des notes sur les lignes) : 2e cycle; le piano do-ré-mi est la porte d'entrée.
- Le jeu de l'écho compare le nombre de coups et leurs positions relatives (tolérance d'un quart de temps après mise à
  l'échelle du tempo de l'enfant); il ne note rien.
