# HLD — Science et technologie / Découverte du monde (2e année, 1er cycle)

> Document de conception de haut niveau. **Aucun code.** Il s'appuie sur `docs/framework.md` (modèle matière → domaine →
> habileté → page Apprendre, 12 formats, `M.ui`) et signale chaque besoin non couvert comme **lacune générique du cadre**
> (§ 6). Préfixe des ids : `sc-`. Couleur : jeton existant `--subj-sciences` (#9b5de5).

**Matière** : `sciences` · titre « Science et technologie » · sous-titre « Découverte du monde » · icône 🔬 ·
couleur `#9b5de5` · fond doux proposé `#f1e8fd` · desc « Le vivant, la matière, la Terre et le ciel : observer, prédire, expliquer. »

---

## 1. Portée et alignement sur le programme

### 1.1 Ce que dit le programme (vérifié)

- **La science n'est pas une matière au 1er cycle.** PFEQ, chap. 6, p. 146 : « Bien que la science et la technologie ne soient
  pas inscrites à la grille-matières du premier cycle du primaire, il importe d'initier l'élève […] à travers l'observation, la
  manipulation, le questionnement […] la classification et la sériation. » Compétence unique du 1er cycle : **« Explorer le monde
  de la science et de la technologie »**, développée **à travers les autres disciplines** et les domaines généraux de formation.
- **Attentes de fin de 1er cycle** (p. 147) : formuler des questions, proposer des explications, faire des expériences simples,
  **distinguer le monde naturel des objets fabriqués**, comprendre le fonctionnement d'objets simples, utiliser le vocabulaire.
- **Savoirs essentiels 1er cycle** (p. 148, « ni prescriptive ni exhaustive ») : lumière et ombre; température (saisons);
  eau sous toutes ses formes (nuages, pluie, rivières, lacs, océans); système Terre-Lune-Soleil; anatomie externe de l'humain;
  croissance d'une plante (besoins); alimentation d'animaux domestiques et sauvages; adaptation d'un animal à son milieu;
  utilisation du vivant; techniques alimentaires (beurre, pain); classification d'objets; conservation de la matière; mélanges;
  absorption; perméabilité; états de la matière; friction; transparence; aimants; produits domestiques; objets techniques usuels.
- **Progression des apprentissages (PDA, 2009)** : chaque énoncé porte → (avec l'enseignant·e) et ★ (seul en fin d'année) par
  année. Les énoncés **→ 1re, ★ 2e** sont **officiels 1er cycle**. Vérifié sur le rendu des tableaux (l'extraction texte perd
  les flèches). Les stratégies (p. 14) : « Il est souhaitable que la mise en œuvre des stratégies s'amorce dès le premier cycle. »

### 1.2 Tableau d'alignement

Légende : **OFF** = officiel 1er cycle (PDA → 1re ★ 2e, ou savoir essentiel 1er cycle) · **ENR** = enrichissement (PDA 2e ou
3e cycle) · **INT** = intégration d'une autre discipline · **EXCL** = hors portée. UM = Univers matériel, TE = Terre et espace,
UV = Univers vivant (numérotation de la PDA).

| Notion                                                                                            | Réf. PDA                                                                                                                                       | Statut                                                   | Habileté(s)                   |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------- |
| Classer des objets selon leurs propriétés (couleur, forme, taille, texture, odeur)                | UM A.1.a                                                                                                                                       | **OFF**                                                  | `sc-proprietes`               |
| Absorption; perméable / imperméable; transparent / translucide / opaque                           | UM A.1.b–d                                                                                                                                     | **OFF**                                                  | `sc-proprietes`               |
| Reconnaître les matériaux qui composent un objet                                                  | UM A.1.k (3e cycle)                                                                                                                            | ENR (léger)                                              | `sc-proprietes` lvl 2         |
| Flotte ou coule (objets)                                                                          | UM A.1.h–i (2e–3e, densité des liquides)                                                                                                       | ENR (qualitatif seulement)                               | `sc-flotte-coule`             |
| 3 états; l'eau solide/liquide/gazeuse; chauffer ou refroidir; état d'objets courants              | UM A.3.a–d                                                                                                                                     | **OFF**                                                  | `sc-etats-eau`                |
| Conservation de la matière (glaçon fondu = même eau)                                              | UM A.4.a                                                                                                                                       | **OFF**                                                  | `sc-etats-eau` lvl 2          |
| Mélanges, miscible / non miscible, soluble / non soluble                                          | UM A.2.a–c                                                                                                                                     | OFF — **reporté v2**                                     | (`sc-melanges`, COULD)        |
| Produits domestiques, pictogrammes de danger                                                      | UM A.6.a–b                                                                                                                                     | OFF — **reporté v2** (dessin fidèle des symboles requis) | —                             |
| Aimants : attraction / répulsion; situations d'utilisation                                        | UM C.2.a–b                                                                                                                                     | **OFF**                                                  | `sc-aimants`                  |
| Friction (pousser, glisser, rouler)                                                               | UM C.6.a                                                                                                                                       | OFF — reporté v2                                         | —                             |
| Objets techniques usuels : pièces, besoin à l'origine de l'objet                                  | UM D.1.a–b                                                                                                                                     | **OFF**                                                  | `sc-naturel-fabrique` lvl 2   |
| Précipitations (pluie, neige, grêle, pluie verglaçante)                                           | TE A.3.a                                                                                                                                       | **OFF**                                                  | `sc-saisons-meteo`            |
| Eau douce / eau salée dans la nature                                                              | TE A.3.b                                                                                                                                       | **OFF**                                                  | `sc-etats-eau`                |
| Cycle de l'eau (évaporation, condensation, précipitation)                                         | TE A.3.c (2e cycle)                                                                                                                            | ENR (simplifié)                                          | `sc-etats-eau` lvl 2, page L5 |
| Jour / nuit associé à la rotation de la Terre                                                     | TE C.1.a (2e cycle)                                                                                                                            | ENR (savoir ess. 1er cycle « Terre-Lune-Soleil »)        | `sc-soleil-terre-lune`        |
| Position apparente du Soleil → longueur de l'ombre                                                | TE D.1.a                                                                                                                                       | **OFF**                                                  | `sc-soleil-terre-lune`        |
| Soleil = étoile, Terre = planète, Lune = satellite naturel                                        | TE D.2.a                                                                                                                                       | **OFF**                                                  | `sc-soleil-terre-lune`        |
| Phases de la Lune, éclipses                                                                       | TE D.2.c–d (2e)                                                                                                                                | EXCL                                                     | —                             |
| Changements au fil des saisons (température, luminosité, précipitations); sensations chaud/froid  | TE D.4.a–b                                                                                                                                     | **OFF**                                                  | `sc-saisons-meteo`            |
| Cause des saisons (révolution, inclinaison)                                                       | TE D.4.c (3e)                                                                                                                                  | **EXCL** (on décrit, on n'explique pas)                  | —                             |
| Lire un thermomètre                                                                               | TE E.2.a (2e)                                                                                                                                  | EXCL (qualitatif : froid / chaud)                        | —                             |
| Besoins d'une plante (eau, air, lumière, sels minéraux)                                           | UV A.3.a                                                                                                                                       | **OFF**                                                  | `sc-besoins`                  |
| Besoins essentiels des animaux (se nourrir, respirer)                                             | UV A.1.a (2e)                                                                                                                                  | ENR                                                      | `sc-besoins`                  |
| Fonctions de parties de son anatomie (membres, tête, cœur, estomac)                               | UV A.2.a                                                                                                                                       | **OFF**                                                  | `sc-corps`                    |
| Fonction sensorielle (peau, yeux, bouche, oreilles, nez)                                          | UV A.2.h (2e) ; « exploration à l'aide des sens » = stratégie dès le 1er cycle                                                                 | ENR                                                      | `sc-sens`                     |
| Parties d'une plante et leur fonction                                                             | UV A.2.e–f (2e)                                                                                                                                | ENR                                                      | `sc-plante-parties`           |
| Stades de croissance d'une plante à fleurs, d'animaux; métamorphose                               | UV A.3.b–c (2e), A.3.d (3e)                                                                                                                    | ENR (séquence seulement)                                 | `sc-cycles-vie`               |
| Alimentation des animaux domestiques vs sauvages                                                  | UV B.1.a                                                                                                                                       | **OFF**                                                  | `sc-animaux-alimentation`     |
| Régime alimentaire (herbivore, carnivore, omnivore)                                               | UV B.1.c (2e)                                                                                                                                  | ENR (mots en lvl 2 seulement)                            | `sc-animaux-alimentation`     |
| Caractéristiques physiques et comportements d'adaptation au milieu                                | UV D.1.a–b                                                                                                                                     | **OFF**                                                  | `sc-animaux-adaptation`       |
| Habitats; modes de locomotion (marche, reptation, vol, saut)                                      | UV D.1.c, C.1.a (2e)                                                                                                                           | ENR                                                      | `sc-animaux-habitats`         |
| Utilisation du vivant (viande, légume, bois, cuir); production d'aliments (beurre, pain, yogourt) | UV D.2.a, D.4.a                                                                                                                                | **OFF**                                                  | `sc-naturel-fabrique`         |
| Saines habitudes (sommeil, alimentation, hygiène, activité)                                       | Éducation physique et à la santé, compétence « Adopter un mode de vie sain et actif »; DGF Santé et bien-être (_réf. non revérifiée en ligne_) | INT                                                      | `sc-corps`                    |
| Terminologie de chaque univers                                                                    | UM/TE/UV F.1.a (→ dès la 1re)                                                                                                                  | **OFF**                                                  | toutes                        |
| Stratégies : anticiper ses résultats, explorer par les sens, comparer, classer, consigner         | Stratégies (p. 14)                                                                                                                             | **OFF** (amorce)                                         | `sc-demarche`, `predict`      |
| Classes d'animaux (mammifères, reptiles…)                                                         | UV A.2.d (2e)                                                                                                                                  | EXCL (on parle de poils, plumes, écailles)               | —                             |

**Bilan** : 11 habiletés sur 16 sont officielles (certaines avec un lvl 2 d'enrichissement); 5 sont de l'enrichissement assumé (3, 4, 7, 9, 12), marqué
« 🌟 Enrichissement » côté parents (lacune G11) et jamais présenté comme attendu de fin d'année.

### 1.3 Références

- PDA _Science et technologie_ (primaire, 24 août 2009), p. 4–14 :
  https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-science-technologie-primaire.pdf
- PFEQ, chap. 6.3 _Science et technologie_ (1er cycle : p. 146–149) :
  https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-science-technologie-primaire.pdf
- Page du programme : https://www.quebec.ca/en/education/preschool-elementary-and-secondary-schools/programs-training-evaluation/quebec-education-program/elementary/science-technology
- Version anglaise de la PDA (contrôle croisé) :
  https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-science-technologie-primaire-AN.pdf

Le champ `pda` de chaque habileté cite l'énoncé exact (ex. « Univers vivant B.1.a — Comparer l'alimentation d'animaux
domestiques et d'animaux sauvages (1er cycle) ») ou, pour l'enrichissement, « Enrichissement — PDA UV C.1.a (2e cycle) ».

---

## 2. Domaines

| id            | Titre                    | Icône | PDA (résumé)                     | Habiletés |
| ------------- | ------------------------ | ----- | -------------------------------- | --------- |
| `sc-vivant`   | Le vivant                | 🌱    | UV A, B, C, D (+ EPS)            | 9         |
| `sc-matiere`  | La matière et les objets | 🧲    | UM A, C, D                       | 4         |
| `sc-terre`    | La Terre et le ciel      | 🌍    | TE A, C, D                       | 2         |
| `sc-demarche` | Démarche scientifique    | 🔎    | Stratégies; compétence 1er cycle | 1         |

Les animaux, plantes et corps humain sont des sous-thèmes du domaine `sc-vivant` (pas de 4e niveau dans le modèle);
le tableau de bord les regroupe par l'ordre d'enregistrement (`order`).

---

## 3. Catalogue des habiletés (16)

### 3.1 Règles de correction automatique (obligatoires)

1. **Une seule vérité par question.** Les faits multivalués (un canard marche, nage _et_ vole) ne sont jamais posés en `choice`
   à réponse unique : on utilise `multi` (« Touche **tous** les… ») ou on demande une propriété exclusive.
2. **Données filtrées par drapeaux** : chaque fiche porte `foodQ`, `coverQ`, `moveQ`, `habitatQ`; un générateur n'utilise qu'une
   fiche dont le drapeau de la notion est vrai (cas ambigus exclus, § 5).
3. **L'image n'est jamais le seul indice si l'emoji est approximatif** (`emoji: '≈'`) : le nom écrit accompagne toujours l'emoji.
4. **La prédiction n'est jamais notée** (format `predict`, G1) : seule la question de compréhension qui suit compte pour ⭐.
5. **Distracteurs = idées naïves fréquentes** (« la Lune fait de la lumière », « les objets lourds coulent toujours »),
   chacune réfutée dans `explain` ou `choices[].why` (G7).
6. Vocabulaire hors cycle (herbivore, rotation, évaporation…) seulement en lvl 2 ou dans les pages Apprendre, toujours expliqué.

### 3.2 Habiletés

Formats : ceux de `framework.md` § 4 + `predict` / `label` (lacunes G1, G2). « Visuels » = `viz` / `showMe`.

**Domaine `sc-vivant`**

| #   | id · titre · statut                                                                                      | desc / données                                                                                                                                                                          | Formats                             | lvl 0 / 1 / 2                                                                                                                                                                                                                                                                                                            | Visuels · indice / explication                                                                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `sc-naturel-fabrique` 🏭 Naturel ou fabriqué ? **OFF** (attente fin de cycle; UV D.2.a, D.4.a; UM D.1.b) | Vivant / non vivant; naturel / fabriqué par l'humain; d'où vient ce produit; à quel besoin répond cet objet. `objets.js`, `produits.js`                                                 | `sort`, `match`, `order`, `choice`  | 0 : trier 4 items en 2 boîtes (naturel / fabriqué) · 1 : `match` produit → origine vivante (laine → mouton, sirop d'érable → érable, beurre → vache, papier → arbre); `order` des étapes du beurre (crème → on brasse → beurre) · 2 : `choice` « À quoi sert un parapluie ? » + vivant / non vivant (feu, nuage, graine) | Emoji. Indice : « Est-ce que ça pousse, mange ou grandit tout seul ? » · Expl. : « Un caillou est naturel mais **pas vivant** : il ne grandit pas, il ne se nourrit pas. » |
| 2   | `sc-besoins` 💧 Ce dont les vivants ont besoin. **OFF** (plantes, UV A.3.a) + ENR (animaux, A.1.a)       | Plante : eau, air, lumière, sels minéraux (dans le sol). Animal : air, eau, nourriture, abri                                                                                            | `multi`, `tf`, `choice`             | 0 : `multi` « Touche ce dont la plante a besoin » (💧 ☀️ 🌬️ + distracteurs 🍫 🧸) · 1 : `choice` expérience « Quelle plante va le mieux pousser ? » (3 pots illustrés) · 2 : `tf` « Une plante mange la terre » → faux (elle y puise eau et minéraux)                                                                    | SVG de 3 pots (variables : eau, lumière). `showMe` : semaine 1→3 de la simulation L1.                                                                                      |
| 3   | `sc-plante-parties` 🌻 Les parties d'une plante. **ENR** (UV A.2.e–f)                                    | racines, tige, feuilles, fleur, fruit, graines; fonction simple de chacune                                                                                                              | `hotspot` → `label` (G2), `match`   | 0 : `hotspot` racines / tige / feuille / fleur · 1 : `label` 4 étiquettes · 2 : `match` partie ↔ rôle (« boivent l'eau » ↔ racines) + fruit / graines                                                                                                                                                                    | SVG plante paramétrable (`M.art`, G8). Ex. complet § 5.6 Q3.                                                                                                               |
| 4   | `sc-cycles-vie` 🔄 Les cycles de vie. **ENR** (UV A.3.b–d)                                               | haricot, grenouille, monarque, poule; 3–4 stades                                                                                                                                        | `order` (+ G5 `fixed`), `choice`    | 0 : poule 3 stades (œuf → poussin → poule) · 1 : grenouille / haricot 4 stades, 1er stade donné · 2 : monarque 4 stades + « Quel stade manque ? » sur le cycle (G5)                                                                                                                                                      | `M.ui.cycle` (G5). Expl. : « Le têtard vit dans l'eau et respire avec des branchies; ses pattes poussent, puis il devient une grenouille. »                                |
| 5   | `sc-animaux-alimentation` 🍽️ Que mange cet animal ? **OFF** (UV B.1.a) + ENR (B.1.c en lvl 2)            | Domestique (nourri par l'humain : moulée, foin) vs sauvage (trouve sa nourriture); « des plantes / des animaux / les deux »                                                             | `sort`, `choice`, `match`           | 0 : `sort` domestique / sauvage · 1 : `sort` 3 boîtes 🌿 / 🍖 / 🌿+🍖 (fiches `foodQ`) · 2 : `choice` mots _herbivore, carnivore, omnivore_ avec définition rappelée                                                                                                                                                     | Emoji. Indice : « Pense à ce que tu as vu l'animal manger, ou à ses dents. »                                                                                               |
| 6   | `sc-animaux-adaptation` 🧥 Comment l'animal s'adapte. **OFF** (UV D.1.a–b)                               | Couverture du corps (poils, plumes, écailles, peau nue, carapace); adaptations d'hiver (fourrure blanche du lièvre, hibernation de la marmotte, migration de la bernache)               | `sort`, `choice`, `match`           | 0 : `sort` poils / plumes / écailles (fiches `coverQ`) · 1 : `match` animal → comportement d'hiver · 2 : `choice` « Pourquoi le lièvre devient blanc l'hiver ? » (se cacher dans la neige)                                                                                                                               | Ex. complet § 5.6 Q2. Bascule été / hiver dans `viz` (même animal, deux pelages).                                                                                          |
| 7   | `sc-animaux-habitats` 🏞️ Où vit-il ? Comment bouge-t-il ? **ENR** (UV D.1.c, C.1.a)                      | Habitats québécois : forêt, lac et rivière, étang et marais, champ, ville, fleuve et mer, Grand Nord; déplacements : marche, court, saute, vole, nage, rampe, grimpe                    | `sort`, `multi`, `hotspot`          | 0 : `multi` « Touche tous les animaux qui **volent** » · 1 : `sort` 3 habitats · 2 : `hotspot` scène paysage québécois (« Où vit le huard ? » → lac)                                                                                                                                                                     | Scène SVG paysage (forêt, lac, champ, ville) avec zones `data-hot`. Règle 1 (multivalué).                                                                                  |
| 8   | `sc-corps` 🧍 Mon corps et mes habitudes. **OFF** (UV A.2.a) + INT (EPS)                                 | Parties externes (tête, cou, épaule, bras, coude, main, jambe, genou, pied) et fonctions (cœur pompe le sang, estomac digère, poumons respirent — vus de l'extérieur); saines habitudes | `hotspot`, `label`, `match`, `sort` | 0 : `hotspot` silhouette « Touche le genou » · 1 : `match` partie ↔ fonction; `sort` habitude saine / pas saine · 2 : `label` 5 étiquettes; `choice` « Combien d'heures dort un enfant de 7 ans ? » → « environ 10 h » parmi 4                                                                                           | Silhouette SVG neutre (pas de genre marqué), de face; **jamais gauche/droite** (miroir).                                                                                   |
| 9   | `sc-sens` 👀 Mes cinq sens. **ENR** (UV A.2.h)                                                           | vue/yeux, ouïe/oreilles, odorat/nez, goût/langue, toucher/peau                                                                                                                          | `match`, `choice`, `multi`          | 0 : `match` organe ↔ sens (👁️ 👂 👃 👅 ✋) · 1 : `choice` « Quel sens utilises-tu pour savoir si la soupe est chaude ? » (toucher) · 2 : `multi` « Quels sens t'aident à reconnaître une pomme les yeux fermés ? » (toucher, odorat, goût)                                                                               | `audio` : bruit décrit + lu (ex. « Ding dong ! ») pour l'ouïe. Expl. : « Le toucher passe par **toute la peau**, pas seulement les mains. »                                |

**Domaine `sc-matiere`**

| #   | id · titre · statut                                                                                    | desc / données                                                                                                                                    | Formats                              | lvl 0 / 1 / 2                                                                                                                                                                                                                                              | Visuels · indice / explication                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 10  | `sc-proprietes` 🧽 Les propriétés des objets. **OFF** (UM A.1.a–d) + ENR (A.1.k)                       | Couleur, forme, taille, texture (doux, rugueux, lisse), odeur; absorbe l'eau / non; laisse passer l'eau / non; transparent / translucide / opaque | `sort`, `multi`, `predict` (G1)      | 0 : `sort` doux / rugueux · 1 : `predict` « L'éponge ou le sac de plastique boit l'eau renversée ? » puis question · 2 : `sort` transparent / translucide / opaque; « De quel matériau est fait… ? » (bois, métal, plastique, verre, tissu)                | Simulation goutte d'eau sur matériau (absorbée / perle). Expl. : « La lumière traverse la vitre : elle est **transparente**. »                             |
| 11  | `sc-etats-eau` 🧊 L'eau : solide, liquide, gaz. **OFF** (UM A.3.a–d, A.4.a; TE A.3.b) + ENR (TE A.3.c) | glace, neige = solide; eau = liquide; vapeur = gaz; chauffer → fond / s'évapore; refroidir → gèle; eau douce / salée                              | `sort`, `choice`, `cloze`, `predict` | 0 : `sort` solide / liquide (glaçon, lait, roche, jus) · 1 : `predict` « Le bonhomme de neige au soleil d'avril ? » puis `choice` (chaleur → fond) · 2 : `cloze` du cycle de l'eau simple; conservation (« Le glaçon fondu a la **même** quantité d'eau ») | Thermomètre qualitatif ❄️ … 🔥. Expl. : « La vapeur est invisible; le petit nuage blanc au-dessus de la bouilloire, ce sont de minuscules gouttes. »       |
| 12  | `sc-flotte-coule` 🛟 Flotte ou coule ? **ENR** (UM A.1.h–i)                                            | Objets de `objets.js` dont `float` est sûr; idées : l'air fait flotter, la forme compte, « lourd » n'explique pas tout                            | `predict` (G1), `sort`               | 0 : `predict` 1 objet évident (bouchon de liège, caillou) · 1 : `predict` objet surprenant (orange avec / sans pelure, grosse bûche) · 2 : `sort` 6 objets + `choice` « Pourquoi la boule de pâte coule mais le bateau de pâte flotte ? »                  | Bac d'eau SVG animé. Ex. complet § 5.6 Q1.                                                                                                                 |
| 13  | `sc-aimants` 🧲 Les aimants. **OFF** (UM C.2.a–b)                                                      | Attire les objets en fer ou en acier (pas tous les métaux); deux aimants s'attirent ou se repoussent; usages (porte du frigo, fermoir)            | `predict`, `sort`, `choice`          | 0 : `sort` attiré / pas attiré (fiches `magnetQ`) · 1 : `predict` aimant ↔ objet puis question · 2 : `predict` pôles N/S (rouge/bleu) attraction / répulsion; « Où utilise-t-on des aimants ? »                                                            | Aimant en U rouge/bleu SVG; animation de collage ou de recul. Expl. : « La canette est en **aluminium** : c'est un métal, mais l'aimant ne l'attire pas. » |

**Domaine `sc-terre`**

| #   | id · titre · statut                                                                              | desc / données                                                                                                                                                                                                          | Formats                            | lvl 0 / 1 / 2                                                                                                                                                                                                                                         | Visuels · indice / explication                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14  | `sc-soleil-terre-lune` ☀️ Soleil, Terre, Lune et ombres. **OFF** (TE D.1.a, D.2.a) + ENR (C.1.a) | Soleil = étoile qui fait sa propre lumière; Terre = planète; Lune = satellite qui renvoie la lumière du Soleil; ombre longue le matin et le soir, courte à midi; jour / nuit : la Terre tourne sur elle-même en un jour | `match`, `choice`, `tf`, `hotspot` | 0 : `match` Soleil / Terre / Lune ↔ étoile / planète / satellite · 1 : `choice` 3 dessins d'arbre et ombre : « Lequel est à midi ? » (ombre la plus courte) · 2 : `hotspot` sur la Terre éclairée : « Touche un endroit où il fait **nuit** »         | Terre SVG mi-éclairée; ombre d'arbre. Distracteur réfuté : « La Lune ne fait pas de lumière : elle est éclairée par le Soleil. »                                                                      |
| 15  | `sc-saisons-meteo` 🍂 Saisons et météo. **OFF** (TE D.4.a–b, A.3.a)                              | 4 saisons au Québec; température, longueur du jour, précipitations; pluie, neige, grêle, pluie verglaçante; vêtements adaptés                                                                                           | `sort`, `choice`, `order`, `match` | 0 : `sort` activité / vêtement → saison (tuque, maillot) · 1 : `order` des saisons à partir de l'hiver (1er donné, G5); `match` précipitation ↔ description · 2 : `choice` « En été, les jours sont… » (plus longs); « La pluie verglaçante, c'est… » | Bandeau 4 saisons (érable : bourgeons, feuilles vertes, rouges, branches nues). **Ne jamais expliquer la cause des saisons** (3e cycle) ni dire « la Terre est plus proche du Soleil en été » (faux). |

**Domaine `sc-demarche`**

| #   | id · titre · statut                                                                 | desc                                                                                                                                                                                       | Formats                    | lvl 0 / 1 / 2                                                                                                                                                                                                                                                                                     | Visuels                                                                                        |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 16  | `sc-demarche` 🔎 Comme une scientifique. **OFF** (stratégies; compétence 1er cycle) | Étapes : ❓ Je me questionne → 🤔 Je prédis → 👀 J'observe → 📝 Je note → 💬 Je conclus. Reconnaître une prédiction, une observation, une conclusion; essai juste (une seule chose change) | `steps`, `order`, `choice` | 0 : `order` des 5 étapes · 1 : `steps` sur une mini-expérience illustrée (2 plantes, une à l'ombre) : quelle est la question ? la prédiction de Léo ? que voit-on ? que conclut-on ? · 2 : `choice` « Pour savoir si la lumière aide la plante, que dois-tu garder **pareil** ? » (l'eau, le pot) | `M.ui.demarche(SC_STEPS)` (étapes personnalisées, déjà supporté). Tableau d'observation de G4. |

---

## 4. Pages « Apprendre » (7)

Toutes composées de `M.ui.section` / `callout` / `vocab` / `tabs` / `miniQuiz`; simulations via `M.ui.sim` + `M.ui.slider`
(G3, G4). **Toutes déterministes** (mêmes réglages → même résultat), pour que l'enfant puisse refaire et vérifier.
Mouvement réduit : l'état final s'affiche directement.

| id · titre                                                       | Sections et comportement                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Composants                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `sc-l-plante` 🌱 Le jardin de Castor (habiletés 2, 3)            | **1. Simulation de croissance.** Deux curseurs à paliers : 💧 Eau {0 rien, 1 un peu, 2 juste assez, 3 trop} et ☀️ Lumière {0 placard noir, 1 ombre, 2 fenêtre}. Bouton « ⏭️ Une semaine plus tard » (4 semaines max), « ↺ Recommencer ». Règle (table fixe) : eau 2 + lumière 2 → pousse 1 étape/semaine, fleurit à la semaine 4; eau 1 ou lumière 1 → ½ étape/semaine, feuilles pâles; eau 0 → la plante se fane dès la semaine 2; eau 3 → « trop d'eau : les racines manquent d'air », feuilles jaunes semaine 3; lumière 0 → tige longue et pâle, pas de fleur. Le carnet (G4 `log`) ajoute une ligne par semaine : réglages + emoji d'état. **2. Les parties de la plante** : SVG, toucher une partie → nom lu + rôle (`label` en mode exploration). **3. miniQuiz** (3 questions).  | `sim`, `slider`, `section`, `callout`, `miniQuiz` |
| `sc-l-cycles` 🔄 Ça grandit ! (habileté 4)                       | `tabs` : Haricot · Grenouille · Monarque · Poule. Chaque onglet : `M.ui.cycle` (G5) — toucher une étape la grossit, la lit et affiche 1 phrase; bouton « ▶ Voir le cycle » anime la flèche autour du cercle. Encadré : « La chenille se transforme dans une **chrysalide** (le cocon, c'est pour les papillons de nuit). »                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `tabs`, `cycle`, `callout`, `miniQuiz`            |
| `sc-l-animaux` 🦫 Les animaux du Québec (habiletés 5–7)          | **Galerie filtrable** : pastilles de filtre Habitat / Mange / Couverture / Se déplace; toucher une fiche → carte (emoji ou dessin, nom lu, 3 faits). **Bascule ❄️ Hiver / ☀️ Été** : la galerie montre qui hiberne 💤, qui migre ✈️, qui change de pelage. **Domestique ou sauvage ?** : `vocab` de 8 animaux domestiques avec ce qu'on leur donne à manger.                                                                                                                                                                                                                                                                                                                                                                                                                             | `tag`, `vocab`, fiche de faits (G9), `miniQuiz`   |
| `sc-l-corps` 🧍 Mon corps, mes sens (habiletés 8, 9)             | **1. Silhouette** : toucher une partie → nom lu (exploration `label`). **2. Les 5 sens** : 5 tuiles (👁️ 👂 👃 👅 ✋); chacune ouvre un mini-défi d'observation (« Ferme les yeux : qu'entends-tu ? »). **3. Mes saines habitudes** : journée type à ordonner (dormir, déjeuner, jouer dehors, se brosser les dents) en `miniQuiz`. Aucune donnée personnelle demandée.                                                                                                                                                                                                                                                                                                                                                                                                                   | `section`, `vocab`, `hotspot`, `miniQuiz`         |
| `sc-l-eau` 🧊 L'eau qui change (habiletés 11, 12)                | **1. Thermomètre-curseur** continu de −20 °C à 110 °C (affichage par zones : ❄️ très froid · 🧥 froid · 🙂 doux · 🔥 très chaud; nombres visibles seulement à 0 et 100). Un glaçon dans une casserole : < 0 °C solide; à 0 °C fond (animation); entre 0 et 100 liquide (+ texte « l'eau s'évapore lentement, comme une flaque qui sèche »); ≥ 100 °C bout, bulles, flèches de vapeur invisibles + nuage de gouttes. Redescendre refait l'inverse (gel, condensation sur un couvercle). Le volume d'eau affiché reste le même (conservation). **2. Le cycle de l'eau** (🌟 enrichissement) : `cycle` 4 étapes (Soleil chauffe → vapeur monte → nuage → pluie/neige → lac). **3. Flotte ou coule** : bac d'eau, 8 objets à glisser dans l'eau avec prédiction (même moteur que `predict`). | `slider`, `sim`, `cycle`, `predict`               |
| `sc-l-terre` 🌍 Le jour, la nuit et les ombres (habileté 14, 15) | **1. La Terre tourne** : vue de dessus du pôle Nord, Soleil à gauche; curseur « heure » 0–24 h fait tourner la Terre (sens antihoraire vu du nord); un repère 🏠 (Québec) passe du côté éclairé (☀️ jour) au côté sombre (🌙 nuit); bouton ▶ tourne 1 jour en 6 s. Phrase-clé : « Le Soleil ne tourne pas autour de nous : c'est la Terre qui tourne sur elle-même. » **2. L'ombre de l'arbre** : curseur « matin → midi → soir »; le Soleil monte puis descend à l'horizon sud; l'ombre de l'arbre raccourcit puis s'allonge, du côté opposé au Soleil. **3. Soleil, Terre, Lune** : 3 tuiles (étoile, planète, satellite). **4. Les saisons au Québec** : `tabs` 4 saisons (érable, vêtements, longueur du jour en barre jour/nuit, précipitations).                                   | `sim`, `slider`, `tabs`, `vocab`, `callout`       |
| `sc-l-demarche` 🔎 Comme une scientifique (habileté 16, 13)      | **1. Les étapes** : `M.ui.demarche(SC_STEPS)`. **2. Le labo des aimants** : 8 objets; l'enfant prédit (✔ / ✖) pour chacun, approche l'aimant, le carnet note prédiction vs résultat; à la fin : « Tu as eu X surprises : c'est comme ça qu'on apprend ! ». **3. Deux aimants** : bascule pour retourner un aimant → attirent / repoussent.                                                                                                                                                                                                                                                                                                                                                                                                                                               | `demarche`, `sim` (`log`), `predict`              |

---

## 5. Plan des données

### 5.1 Fichiers

```
js/sciences/subject.js            registerSubject + 4 registerDomain
js/sciences/data/animaux.js        M.SC.ANIMAUX (≈ 34 sauvages) + M.SC.DOMESTIQUES (8)
js/sciences/data/objets.js         M.SC.OBJETS (≈ 30 : matériau, flotte, aimant, absorbe, transparence, naturel/fabriqué)
js/sciences/data/vivant.js         plantes (parties, besoins), cycles de vie, corps, sens, habitudes, produits du vivant
js/sciences/data/terre.js          saisons, précipitations, astres
js/sciences/art.js                 dessins SVG (plante, silhouette, Terre, bac d'eau, aimant, paysage, animaux sans emoji) via M.art (G8)
js/sciences/skills/vivant.js       habiletés 1–9
js/sciences/skills/matiere.js      habiletés 10–13
js/sciences/skills/terre.js        habiletés 14–15
js/sciences/skills/demarche.js     habileté 16
js/sciences/learn/*.js             7 pages
```

Données enregistrées par `M.registerData` (lacune partagée G6 de `univers-social.md`) pour la réutilisation (ex. saisons en
mesure, animaux en anglais). Vérifiées par G9.

### 5.2 Schéma d'une fiche animal

`id` · `nom` (avec article : « le castor ») · `emoji` · `emojiOk` (`✅` fidèle / `≈` approximatif / `❌` absent → dessin `art`) ·
`habitats[]` · `mange` (`plantes` | `animaux` | `les deux`) · `couverture` (`poils` | `plumes` | `écailles` | `peau nue` |
`carapace` | `coquille` | `insecte`) · `bouge[]` (marche, court, saute, vole, nage, rampe, grimpe) · `hiver` (`actif` |
`hiberne` | `dort` | `migre` | `change de pelage`) · `fait` (1 phrase) · drapeaux `foodQ`, `coverQ`, `moveQ`, `habitatQ`.

### 5.3 Table des animaux du Québec (34)

Sources de vérification prévues : fiches publiques d'organismes québécois/canadiens (gouvernement du Québec — faune, Parcs
Canada, Biodôme); **faits reformulés**, aucun texte copié. Gris = drapeau désactivé pour la notion.

| Animal                               | Emoji | État                                 | Habitat                        | Mange                                   | Couverture       | Se déplace          | Hiver                          | Notes / drapeaux                                     |
| ------------------------------------ | ----- | ------------------------------------ | ------------------------------ | --------------------------------------- | ---------------- | ------------------- | ------------------------------ | ---------------------------------------------------- |
| castor                               | 🦫    | ✅ (U13)                             | lac, rivière, forêt            | plantes                                 | poils            | nage, marche        | actif (sous la glace, réserve) |                                                      |
| orignal                              | 🫎    | ✅ (U15, récent)                     | forêt, marais                  | plantes                                 | poils            | marche, court, nage | actif                          | repli `art` si non affiché                           |
| cerf de Virginie (chevreuil)         | 🦌    | ✅                                   | forêt, champ                   | plantes                                 | poils            | court, saute        | actif                          |                                                      |
| caribou                              | 🦌    | ≈ (cerf générique)                   | Grand Nord, forêt boréale      | plantes (lichens)                       | poils            | marche, nage        | migre                          | nom toujours écrit                                   |
| ours noir                            | 🐻    | ≈ (brun)                             | forêt                          | les deux                                | poils            | marche, grimpe      | dort dans sa tanière           | « dort » plutôt que « hiberne » (débat scientifique) |
| ours blanc                           | 🐻‍❄️    | ✅ (U13)                             | Grand Nord (Nunavik), banquise | animaux                                 | poils            | marche, nage        | actif                          | habitat : Nord seulement                             |
| renard roux                          | 🦊    | ✅                                   | forêt, champ, ville            | les deux                                | poils            | court, saute        | actif                          |                                                      |
| loup gris                            | 🐺    | ✅                                   | forêt                          | animaux                                 | poils            | court               | actif                          |                                                      |
| lynx du Canada                       | —     | ❌ (🐱 trompeur)                     | forêt boréale                  | animaux                                 | poils            | marche, saute       | actif                          | dessin `art`                                         |
| raton laveur                         | 🦝    | ✅                                   | forêt, ville                   | les deux                                | poils            | marche, grimpe      | dort beaucoup                  |                                                      |
| mouffette rayée                      | 🦨    | ✅ (U12)                             | champ, ville                   | les deux                                | poils            | marche              | dort beaucoup                  |                                                      |
| porc-épic d'Amérique                 | —     | ❌ (🦔 = hérisson, absent du Québec) | forêt                          | plantes                                 | poils + piquants | marche, grimpe      | actif                          | `coverQ` faux (piquants = poils durcis)              |
| tamia rayé (suisse)                  | 🐿️    | ✅ (le dessin est un tamia)          | forêt, jardin                  | les deux                                | poils            | court, grimpe       | dort dans son terrier          | `foodQ` faux (mange aussi insectes, œufs)            |
| écureuil roux                        | 🐿️    | ≈                                    | forêt                          | les deux                                | poils            | grimpe, saute       | actif                          | `foodQ` faux                                         |
| lièvre d'Amérique                    | 🐇    | ≈ (lapin)                            | forêt                          | plantes                                 | poils            | saute               | change de pelage (blanc)       | dire « lièvre », expliquer la différence en L3       |
| marmotte commune (siffleux)          | —     | ❌                                   | champ                          | plantes                                 | poils            | marche              | hiberne                        | dessin `art`                                         |
| chauve-souris (petite brune)         | 🦇    | ✅                                   | forêt, grange, près de l'eau   | animaux (insectes)                      | poils            | vole                | hiberne                        | piège utile : vole mais a des poils                  |
| béluga                               | 🐋    | ≈ (baleine qui souffle)              | fleuve Saint-Laurent           | animaux                                 | peau nue         | nage                | actif                          | piège utile : nage mais pas d'écailles               |
| phoque commun                        | 🦭    | ✅ (U13)                             | fleuve, mer                    | animaux                                 | poils            | nage                | actif                          |                                                      |
| huard                                | —     | ❌                                   | lac                            | animaux (poissons)                      | plumes           | nage, plonge, vole  | migre                          | dessin `art` (oiseau du 1 $)                         |
| bernache du Canada                   | 🪿    | ≈ (U15, oie générique)               | lac, champ                     | plantes                                 | plumes           | vole, nage, marche  | migre                          |                                                      |
| canard colvert                       | 🦆    | ✅                                   | étang, lac                     | les deux                                | plumes           | vole, nage, marche  | migre (la plupart)             | `moveQ` en `multi` seulement                         |
| harfang des neiges                   | 🦉    | ≈ (hibou brun)                       | toundra, champ l'hiver         | animaux                                 | plumes           | vole                | actif                          | oiseau emblème du Québec                             |
| mésange à tête noire                 | 🐦    | ≈                                    | forêt, jardin                  | les deux                                | plumes           | vole                | actif                          |                                                      |
| grenouille léopard                   | 🐸    | ≈ (visage)                           | étang, marais                  | animaux (insectes)                      | peau nue         | saute, nage         | hiberne au fond de l'étang     |                                                      |
| tortue peinte                        | 🐢    | ✅                                   | étang, lac                     | les deux                                | carapace         | nage, marche        | hiberne sous l'eau             | `coverQ` : boîte « carapace » seulement              |
| couleuvre rayée                      | 🐍    | ✅                                   | champ, jardin                  | animaux                                 | écailles         | rampe               | hiberne                        | non venimeuse (rassurer)                             |
| omble de fontaine (truite mouchetée) | 🐟    | ≈                                    | ruisseau, lac                  | animaux                                 | écailles         | nage                | actif                          |                                                      |
| saumon atlantique                    | 🐟    | ≈                                    | rivière et mer                 | animaux                                 | écailles         | nage, saute         | actif                          |                                                      |
| monarque                             | 🦋    | ≈                                    | champ (asclépiade)             | plantes (nectar; chenille : asclépiade) | insecte          | vole                | migre (Mexique)                | `coverQ` faux                                        |
| abeille                              | 🐝    | ✅                                   | champ, jardin                  | plantes (nectar, pollen)                | insecte          | vole                | reste dans la ruche            | `coverQ` faux                                        |
| coccinelle                           | 🐞    | ✅                                   | jardin                         | animaux (pucerons)                      | insecte          | vole, marche        | dort                           | `coverQ` faux                                        |
| ver de terre                         | 🪱    | ✅ (U13)                             | sol                            | feuilles mortes, terre                  | peau nue         | rampe               | sous la terre                  | `foodQ` faux                                         |
| escargot                             | 🐌    | ✅                                   | jardin, forêt humide           | plantes                                 | coquille         | rampe               | dort                           |                                                      |

Bilan emoji : **sans emoji (dessin requis)** : lynx, porc-épic, marmotte, huard. **Approximatifs** (nom toujours écrit, jamais
seul indice) : caribou, ours noir, écureuil roux, lièvre, béluga, bernache, harfang, mésange, grenouille, omble, saumon,
monarque. **Récents** (U13–U15, risque de carré vide sur vieux appareils) : 🦫 🫎 🪿 🦭 🪱 🐻‍❄️ → repli `art` (G8).
Domestiques (UV B.1.a) : chat 🐱, chien 🐶, vache 🐄, poule 🐔, cheval 🐴, mouton 🐑, cochon 🐷, poisson rouge 🐠 — champ
`nourriPar` (« croquettes », « foin », « grain »…).

### 5.4 Huit fiches exemples (complètes)

| id              | nom                   | emoji · état        | habitats            | mange    | couverture | bouge               | hiver            | fait                                                               | foodQ / coverQ / moveQ / habitatQ |
| --------------- | --------------------- | ------------------- | ------------------- | -------- | ---------- | ------------------- | ---------------- | ------------------------------------------------------------------ | --------------------------------- |
| `castor`        | le castor             | 🦫 ✅               | lac, rivière, forêt | plantes  | poils      | nage, marche        | actif            | « Il coupe des arbres avec ses dents et construit un barrage. »    | ✔ ✔ ✔ ✔                           |
| `orignal`       | l'orignal             | 🫎 ✅ (repli `art`) | forêt, marais       | plantes  | poils      | marche, court, nage | actif            | « C'est le plus grand animal de nos forêts. »                      | ✔ ✔ ✔ ✔                           |
| `lievre`        | le lièvre d'Amérique  | 🐇 ≈                | forêt               | plantes  | poils      | saute               | change de pelage | « Son pelage devient blanc l'hiver pour se cacher dans la neige. » | ✔ ✔ ✔ ✔                           |
| `huard`         | le huard              | — ❌ `art`          | lac                 | animaux  | plumes     | nage, vole          | migre            | « Il plonge sous l'eau pour attraper des poissons. »               | ✔ ✔ ✔ ✔                           |
| `chauve-souris` | la chauve-souris      | 🦇 ✅               | forêt, grange       | animaux  | poils      | vole                | hiberne          | « Elle vole la nuit et mange des insectes. »                       | ✔ ✔ ✔ ✘                           |
| `grenouille`    | la grenouille léopard | 🐸 ≈                | étang, marais       | animaux  | peau nue   | saute, nage         | hiberne          | « Elle attrape les insectes avec sa langue collante. »             | ✔ ✔ ✔ ✔                           |
| `tortue`        | la tortue peinte      | 🐢 ✅               | étang, lac          | les deux | carapace   | nage, marche        | hiberne          | « L'hiver, elle reste au fond de l'étang, sous la glace. »         | ✔ ✘ ✔ ✔                           |
| `monarque`      | le monarque           | 🦋 ≈                | champ               | plantes  | insecte    | vole                | migre            | « Il vole jusqu'au Mexique pour passer l'hiver. »                  | ✔ ✘ ✔ ✔                           |

### 5.5 Objets et matériaux (extrait du plan `objets.js`)

Chaque objet : `id`, nom, emoji/art, matériau, `float` (✔/✘/`null` = ambigu, exclu), `magnet`, `absorbe`, `transparence`,
`origine` (naturel / fabriqué).

| Objet                                                 | Matériau      | Flotte | Aimant | Remarque                                                                          |
| ----------------------------------------------------- | ------------- | ------ | ------ | --------------------------------------------------------------------------------- |
| bouchon de liège                                      | liège         | ✔      | ✘      |                                                                                   |
| caillou 🪨                                            | roche         | ✘      | ✘      |                                                                                   |
| glaçon 🧊                                             | eau solide    | ✔      | ✘      | lien avec états de l'eau                                                          |
| clou en fer 🔩                                        | fer           | ✘      | ✔      |                                                                                   |
| trombone en acier 📎                                  | acier         | `null` | ✔      | peut flotter par tension de surface → exclu de « flotte »                         |
| canette d'aluminium 🥫                                | aluminium     | `null` | ✘      | piège clé : métal non attiré                                                      |
| orange avec pelure 🍊                                 | —             | ✔      | ✘      | pelée : ✘ (lvl 1–2)                                                               |
| pomme 🍎                                              | —             | ✔      | ✘      |                                                                                   |
| balle de ping-pong                                    | plastique     | ✔      | ✘      |                                                                                   |
| bille de verre                                        | verre         | ✘      | ✘      | transparente                                                                      |
| boule de pâte à modeler / bateau de pâte              | pâte          | ✘ / ✔  | ✘      | forme (lvl 2)                                                                     |
| cuillère, clé, pièce de monnaie                       | variable      | —      | `null` | **exclus** : inox ou laiton parfois non magnétiques; pièces canadiennes variables |
| éponge 🧽, essuie-tout, sac de plastique, imperméable | —             | —      | —      | absorption / perméabilité                                                         |
| vitre, papier ciré, carton                            | verre, papier | —      | —      | transparent / translucide / opaque                                                |

### 5.6 Trois questions complètes

**Q1 — `sc-flotte-coule`, lvl 1, format `predict` (G1)**

- prompt : « Castor dépose une <b>orange avec sa pelure</b> dans le bac d'eau. Que va-t-il se passer ? »
- predict.choices : 🛟 « Elle flotte. » (`flotte`) · ⚓ « Elle coule. » (`coule`) — **outcome** : `flotte`
- simulate : l'orange tombe, s'enfonce à moitié, remonte et reste à la surface (1,5 s; état final direct si mouvement réduit).
- résultat (neutre) : « Tu avais prédit : elle coule. Résultat : elle flotte ! Les scientifiques aussi ont des surprises. »
- check (noté, `choice`, 2 essais) : « Pourquoi l'orange flotte-t-elle ? » → « Sa pelure est pleine de petites bulles d'air. » ✔ ·
  « Parce qu'elle est orange. » (why : « La couleur ne change rien : une orange pelée coule ! ») ·
  « Parce qu'elle est légère comme une plume. » (why : « Elle n'est pas si légère; c'est l'air dans la pelure qui l'aide. »)
- hint : « Regarde la pelure de près : elle est pleine de petits trous remplis d'air. »
- explain : « La pelure d'orange contient plein de minuscules poches d'air, comme une veste de sauvetage. Si on enlève la
  pelure, l'orange coule ! » · showMe : deux bacs côte à côte, orange avec pelure (flotte) et orange pelée (coule).

**Q2 — `sc-animaux-adaptation`, lvl 0, format `sort` (existant)**

- prompt : « Comment le corps de ces animaux est-il couvert ? Classe-les. »
- bins : `poils` « 🧶 Des poils » · `plumes` « 🪶 Des plumes » · `ecailles` « 🐟 Des écailles »
- items : « 🦫 le castor » → poils · « 🦆 le canard » → plumes · « 🐍 la couleuvre » → écailles · « 🦊 le renard » → poils ·
  « 🦉 le harfang » → plumes · « 🐟 la truite » → écailles (tirés au hasard parmi fiches `coverQ` vrai, 2 par boîte)
- hint : « Imagine que tu flattes l'animal : est-ce doux comme un chat, léger comme un oreiller ou glissant comme un poisson ? »
- explain : « Les oiseaux sont les seuls animaux qui ont des **plumes**. Le castor et le renard ont des **poils** (une fourrure).
  La couleuvre et la truite ont des **écailles**. »

**Q3 — `sc-plante-parties`, lvl 0, format `hotspot` (existant; version `label` en lvl 1)**

- prompt : « Touche les <b>racines</b> de la plante. » · say : « Touche les racines de la plante. »
- html : SVG 300 × 260 — bande de terre brune (y 170–260), tige verte (`data-hot="tige"`), 2 feuilles (`data-hot="feuille"`),
  fleur jaune (`data-hot="fleur"`), racines ramifiées sous la terre (`data-hot="racines"`). Chaque zone a une surface touchable
  ≥ 48 px (rectangle transparent élargi derrière les traits fins).
- answer : `racines` · answerText : « les racines (sous la terre) » · tirage : la partie demandée varie parmi les 4.
- hint : « Les racines sont cachées sous la terre. »
- explain : « Les **racines** sont sous la terre : elles boivent l'eau et tiennent la plante bien droite. »

---

## 6. Lacunes du cadre (FRAMEWORK GAPS)

Toutes génériques (utiles à d'autres matières); chacune = exemple dans `M.FORMAT_SAMPLES` ou le guide de style + entrée dans
`framework.md` + `validate` pour `tools/check-skills.js`. Les noms partagés avec les autres HLD sont réutilisés tels quels.

**G1 — Format `predict` (prédire → observer → expliquer)** — _MUST_

- MUST : champs `predict: { prompt?, choices:[{label,value}] }`, `outcome` (une `value` de `predict.choices`),
  `simulate(el, prediction) → Promise` (seul endroit, avec `viz`/`showMe`, qui touche au DOM), `result?: html`,
  `check?: { prompt, format: 'choice'|'tf'|'multi'|'sort', … }`.
- MUST : 3 phases dans une même carte : (1) prédiction — un toucher, **aucune couleur vert/rouge**, choix verrouillé;
  (2) « ▶ Voir l'expérience » joue `simulate` (état final direct si mouvement réduit); (3) bandeau neutre « Tu avais prédit X —
  Résultat : Y », puis `check` corrigée normalement (essais, indice, explication).
- MUST : la prédiction n'influence **jamais** ⭐ ni la maîtrise; sans `check`, la carte est « pratique » (non comptée).
- MUST : `validate` : `outcome` ∈ `predict.choices`; `check` validé par le `validate` de son format; `answerLabel` = celui de `check`.
- SHOULD : enregistrer « prédiction juste ? » à part (statistique parent « surprises »); clavier 1–9 puis Entrée.
- Pourquoi pas `steps` : chaque étape de `steps` est notée, donc une prédiction « fausse » coûterait l'étoile.

**G2 — Format `label` (diagramme à étiqueter)** — _MUST_

- MUST : `html` (SVG avec zones `data-hot`), `labels:[{ id, text, say? }]` (chaque `id` = une zone), `distractors?:[text]`.
- MUST : geste identique à `sort` (touche une étiquette, puis la zone); correction immédiate; étiquette placée affichée
  près de la zone (point d'ancrage `data-anchor="x,y"` ou centre de la boîte) avec trait de rappel; ⭐ si aucune erreur.
- MUST : zones touchables ≥ 48 px (rectangle transparent permis); `validate` : chaque `labels[].id` a une zone, pas d'id en double.
- SHOULD : glisser-déposer au pointeur en plus du toucher-toucher; mode `explore: true` (page Apprendre) : toucher une zone
  lit son nom, sans correction. Réutilisable : carte (univers social), parties d'un diagramme (maths).

**G3 — Composant `M.ui.slider` (curseur à paliers illustrés)** — _MUST_

- MUST : `slider(el, { label, stops:[{ value, icon, label }] | { min, max, step, format }, value, onChange })` → `{ get, set }`.
- MUST : pouce ≥ 48 px, flèches clavier, paliers cliquables avec emoji, valeur lue à 🔊 au changement (option), `aria-valuetext`.
- Pourquoi : `stepper` montre un nombre; les simulations ont besoin d'échelles qualitatives (💧 rien → 🌊 trop).

**G4 — Composant `M.ui.sim` (conteneur de simulation)** — _SHOULD_

- SHOULD : `sim(el, { state, controls:[{ type:'slider'|'stepper'|'toggle'|'choice', key, … }], draw(stage, state),
  actions?:[{ label, run(state) → state|Promise }], log?: { columns } })` → `{ get, set, reset }`.
- SHOULD : mise en page scène + commandes (côte à côte ≥ 760 px, empilées sinon); bouton « ↺ Recommencer »; carnet
  d'observation (tableau de lignes ajoutées par les actions) réutilisable par la démarche; nettoyage via `M.onCleanup`.
- MUST (si implanté) : déterministe — aucun hasard sans graine; mouvement réduit respecté.

**G5 — Composant `M.ui.cycle` + option `order.fixed`** — _SHOULD_

- SHOULD : `cycle(el, { stages:[{ art|emoji, label, say?, text? }], mode: 'explore'|'hide', hide?:[i] })` : étapes en cercle
  reliées par des flèches; toucher = agrandir + lire; zones `data-hot` pour `hotspot` (« Quelle étape manque ? »).
- MUST : `order` accepte `fixed:[indices]` (éléments déjà placés). Un cycle a N rotations valides : sans 1er élément donné,
  la correction serait ambiguë. Réutilisable : saisons, mois, jours de la semaine.

**G6 — `hotspot` à cibles multiples** — _SHOULD_

- SHOULD : `answer: [ids]` → sélection multiple + « Vérifier » (comme `multi`); `validate` : chaque id présent dans `html`.
  Usage : « Touche **toutes** les parties qui servent à sentir », « Touche tous les endroits où il fait nuit ».

**G7 — Rétroaction par distracteur (`choices[].why`)** — _COULD_

- COULD : dans `choice`/`multi`, `why` (html) remplace l'indice générique quand l'enfant touche ce distracteur. Cible les idées
  naïves (science), les erreurs typiques (maths), les faux amis (anglais).

**G8 — Registre de dessins `M.art` avec repli d'emoji** — _SHOULD_ (même lacune que `anglais.md` G14)

- SHOULD : `M.art.register(name, svgFn)`, `M.art.html(name, { size })`; `M.pic(id)` rend l'emoji s'il s'affiche, sinon le
  dessin, sinon le nom.
- SHOULD : détection unique au démarrage (mesure canvas) des emoji récents (U13–U15 : 🦫 🫎 🪿 🦭 🪱 🐻‍❄️).
- COULD : drapeau `approx: true` qui interdit, via G9, une question où l'image approximative est le seul indice.

**G9 — Données et vérification de contenu** — _SHOULD_ (mêmes lacunes que `univers-social.md` G6 `M.registerData` et G7 `lint`)

- SHOULD : `M.registerData(id, rows, schema)` avec énumérations (`mange`, `couverture`, `bouge`…); `check-skills.js` refuse
  une fiche incomplète ou une valeur hors énumération.
- SHOULD : `lint(q)` par habileté : ex. sciences — un `choice` n'a qu'une bonne réponse **compte tenu des données** (refuser
  « Lequel vole ? » si deux choix ont `vole`); aucun item `null`/ambigu tiré.

**G10 — Fiche de faits / galerie filtrable `M.ui.gallery`** — _COULD_

- COULD : `gallery(el, { items:[{ pic, title, say, facts:[], tags:{ dim: value } }], filters:[{ dim, label, values }] })` :
  pastilles de filtre, carte détaillée au toucher. Réutilisable : vocabulaire anglais, personnages historiques.

**G11 — Étiquette « Enrichissement »** — _SHOULD_ (même lacune que `univers-social.md` G8)

- SHOULD : `registerSkill/registerLearn({ enrichment: true })` → étiquette 🌟 aux parents, exclu des recommandations par défaut,
  compté à part dans les bilans.

**G12 — Aide d'animation `M.anim`** — _COULD_

- COULD : interpolation d'attributs SVG à base de promesses (`M.anim(el, { attr: [from, to] }, ms)`), résolue immédiatement
  si mouvement réduit; utilisée par `simulate`, `showMe` et les pages.

---

## 7. Risques, ambiguïtés et parades

| Risque                                | Exemple                                                                                                             | Parade                                                                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Simplification qui devient fausse     | « Les objets lourds coulent » ; « la Terre est plus proche du Soleil en été » ; « la vapeur, c'est le nuage blanc » | Liste de formulations validées dans `vivant.js`/`terre.js`; jamais de cause des saisons; « vapeur invisible » ; flottaison expliquée par l'air et la forme, pas le poids |
| Ambiguïté de correction               | trombone (tension de surface), cuillère inox, pièces de monnaie, canard (3 déplacements), tamia (omnivore)          | Valeur `null` = exclu; drapeaux `*Q`; `multi` pour le multivalué; lint G9                                                                                                |
| Emoji trompeur                        | 🦔 pour le porc-épic, 🐇 pour le lièvre, 🐋 pour le béluga, 🦉 brun pour le harfang blanc                           | État `≈`/`❌`; nom toujours écrit; dessin `art` pour les absents; L3 explique lièvre ≠ lapin                                                                             |
| Emoji non affiché                     | 🫎 🪿 sur Windows 10 ou vieil Android                                                                               | Détection + repli G8; test manuel par appareil                                                                                                                           |
| Faune régionale inexacte              | ours blanc « dans la forêt », kangourou dans un habitat québécois                                                   | Habitat « Grand Nord » distinct; uniquement des espèces présentes au Québec; vérification par source publique québécoise                                                 |
| Termes scientifiques débattus         | l'ours « hiberne »                                                                                                  | « dort une grande partie de l'hiver dans sa tanière »; « hiberne » réservé à marmotte, chauve-souris                                                                     |
| Métamorphose mal nommée               | « cocon » pour le monarque                                                                                          | « chrysalide » (le cocon = papillons de nuit)                                                                                                                            |
| Enrichissement présenté comme attendu | habitats, sens, cycle de l'eau                                                                                      | Étiquette G11 + champ `pda` « Enrichissement (2e cycle) »                                                                                                                |
| Prédiction vécue comme échec          | enfant « perd » sur une surprise                                                                                    | G1 : jamais de rouge sur la prédiction; message valorisant                                                                                                               |
| Sécurité                              | expériences à refaire à la maison (chaleur, aimants avalés)                                                         | Encadré `warn` : « Avec un adulte » pour la chaleur; aimants : « jamais dans la bouche » ; pas d'expérience avec un produit domestique                                   |
| Corps et vie privée                   | silhouette genrée, questions sur la santé de l'enfant                                                               | Silhouette neutre; aucune question personnelle; pas d'organes génitaux (UV A.2.i : 3e cycle)                                                                             |
| Gauche / droite en miroir             | « Touche la main gauche »                                                                                           | Exclu                                                                                                                                                                    |
| Droits d'auteur                       | pictogrammes officiels, photos                                                                                      | Emoji + SVG originaux uniquement; pictogrammes de danger reportés en v2 avec dessin original                                                                             |

---

## 8. Plan d'implémentation

1. **Cadre (MUST)** — G1 `predict`, G2 `label`, G3 `slider`, G5 `order.fixed` : formats/composants, `validate`, exemples
   `M.FORMAT_SAMPLES`, mise à jour `framework.md` § 4–5. Tests dans le guide de style à 360 et 1100 px.
2. **Squelette** — `subject.js` (matière + 4 domaines), balises `<script>` dans `index.html` avant `styleguide.js`.
3. **Données** — `animaux.js`, `objets.js`, `vivant.js`, `terre.js`; relecture scientifique de chaque fait (tableau § 5.3
   coché ligne par ligne avec la source); G9 si disponible, sinon vérification ad hoc dans `check-skills.js`.
4. **Habiletés officielles avec formats existants** — 1, 2, 5, 6, 8, 10, 11, 14, 15, 16 (`sort`, `match`, `choice`, `multi`,
   `hotspot`, `order`, `steps`); `art.js` minimal (plante, silhouette, Terre, ombre).
5. **Habiletés avec nouveaux formats et enrichissement** — 3 (`label`), 4 (`cycle`), 7, 9, 12, 13 (`predict`).
6. **Pages Apprendre** — G4 `sim` puis L1 (jardin), L5 (eau), L6 (Terre), L7 (démarche), L2, L3, L4.
7. **SHOULD/COULD** — G6, G8 (repli emoji), G11 (étiquette), G7, G10, G12 selon le temps.
8. **Validation** — `node tools/check-skills.js` (≥ 200 tirages par habileté et par niveau, aucune réponse ambiguë);
   navigateur 390 / 1100 px sans erreur de console; test emoji Windows 10/11, iPad, Android; lecture à voix haute fr-CA de
   chaque consigne; mise à jour de `docs/curriculum.md` (section Science et technologie avec statut OFF/ENR).
9. **v2** — `sc-melanges` (UM A.2), friction (UM C.6.a) avec `sim`, produits domestiques et pictogrammes (UM A.6).
