# HLD — Mathématique : « Comprendre et résoudre » (domaine `problemes`) + extras

Statut : proposition de conception (aucun code). Public : auteur·e du site. Portée : domaine `problemes` déjà enregistré
(vide) dans `js/maths/subject.js`, plus de petits extras de mathématique (argent, énigmes, défi de calcul mental).
Lire avec `docs/framework.md` (cadre commun), `docs/curriculum.md`, `docs/methodologie.md`.

Constat de départ : l'habileté `problemes` (« Petits problèmes », `js/maths/skills/operations.js`) donne une histoire et
attend **un nombre**. Elle exerce le *calcul en contexte*, pas la *compréhension* : l'enfant peut réussir en devinant
l'opération, sans lire la question, sans modéliser, sans vérifier ni rédiger de phrase-réponse. Le nouveau domaine exerce
chaque geste de la démarche séparément, puis ensemble.

---

## 1. Justification et alignement

### 1.1 Ce que le programme demande (PFEQ, 1er cycle)

| Source | Ce qui compte ici |
|---|---|
| **C1 — Résoudre une situation-problème mathématique.** Composantes : *décoder* les éléments, *modéliser*, *appliquer différentes stratégies*, *valider*, *partager l'information* ([PFEQ primaire, ch. 6](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-mathematique-primaire.pdf)) | Une habileté par composante (question, données, schéma, calcul, vérification, phrase-réponse). |
| **Attente de fin de 1er cycle (C1)** : « résout une situation-problème comportant des **données complètes**. Il détermine la tâche et dégage les données utiles en ayant recours à différents modes de représentation (objets, dessins, tableaux, diagrammes, symboles, mots). Il élabore une solution qui comporte **une ou deux étapes** et vérifie **occasionnellement** le résultat obtenu. Il communique […] une solution (démarche et résultat) en utilisant un langage mathématique élémentaire. » (idem) | Données complètes aux niveaux 0–1; **données superflues = défi (lvl 2, enrichissement 2e cycle)**; jamais plus de 2 étapes; la vérification est exercée, pas exigée partout. |
| **Cheminement 1er cycle** : « l'élève apprend à reconnaître les données pertinentes […] établit un lien entre les données et la tâche à réaliser […] apprend à modéliser » (idem) | `pb-donnees`, `pb-schema` sont au cœur du domaine. |
| **Critères C1** (légende par cycle) : solution correcte (démarche et résultat) et explicitation des éléments pertinents dès le 1er cycle; explicitation de la **validation** à partir du 2e cycle (idem; voir aussi [CS Laval — CD1 évaluer](https://sites.google.com/cslaval.qc.ca/denominateurcommun/%C3%A9valuation/cd1-%C3%A9valuer) : compréhension de la situation, mobilisation des concepts, traces de la démarche, validation en rétroaction seulement) | La vérification (`pb-sens`) est formative : jamais pénalisante, ★ normale. |
| **C2 — Raisonner à l'aide de concepts et de processus.** Critères : analyse adéquate de la situation d'application, choix des concepts et processus appropriés, application adéquate, **justification** d'actions ou d'énoncés (idem) | Étapes « Pourquoi ? » à choix (justification), choix d'opération et de schéma. |
| **PDA — Sens des opérations A.1–A.3** : reconnaître l'opération; traduire une situation par du matériel, des schémas ou des équations et vice versa : transformation (ajout, retrait), réunion, comparaison; composition de transformations positive/négative (b) puis mixte (c); multiplication/division : disposition rectangulaire, addition répétée, partage, contenance ([PDA mathématique](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf)) | Ce sont exactement les **structures** du générateur (§ 3). « Et vice versa » justifie `pb-inventer` (équation → histoire). |
| **PDA — Opérations sur des nombres A.1a** : approximation du résultat d'une addition ou d'une soustraction | `pb-sens` (estimer avant / après). |
| **Vocabulaire 1er cycle (PDA)** : plus, moins, *de moins, de plus*, addition, soustraction, somme, différence | `pb-mots`. |

### 1.2 Ce que la recherche recommande

- **Enseignement par schémas** (*schema-based instruction*) : classer le problème selon sa **structure** (changement,
  réunion/total, comparaison/différence), puis appliquer la stratégie de ce type; les trois schémas additifs couvrent
  tous les problèmes additifs; la comparaison est la plus difficile ([Powell & Fuchs, 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6130842)).
  En 1re année, schémas **+ compréhension du langage** > schémas seuls ([Fuchs et al., 2021, n = 391](https://pmc.ncbi.nlm.nih.gov/articles/PMC7989819)).
  Revue pour jeunes enfants : [Journal of Numerical Cognition](https://jnc.psychopen.eu/index.php/jnc/article/download/17649/17649.pdf/).
- **Guide de pratique IES (2021), recommandation 5, preuve forte** : enseigner délibérément les problèmes écrits,
  identifier les **types** de problèmes, changer la présentation pour apprendre à repérer l'information pertinente,
  présenter ensuite des problèmes moins familiers du même type et mélanger les types
  ([résumé WWC](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC-PraxGuide-Elementary-Math-Summary-508c.pdf),
  [guide complet](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC2021006-Math-PG.pdf)).
- **Mots-clés : stratégie qui « expire »** ([Karp, Bush & Dougherty, 2014, *13 Rules That Expire*](https://www.nctm.org/Publications/Teaching-Children-Mathematics/2014/Vol21/Issue1/tcm2014-08-18a_pdf/)) :
  « de plus » ne veut pas toujours dire « + ». On enseigne le **sens** des mots, pas une table mot → opération.
- **Modèle en barres** (méthode de Singapour) : effets positifs, surtout sur les problèmes arithmétiques; recherche
  surtout à partir de la 3e année ([Kaur, 2019 — NIE](https://repository.nie.edu.sg/bitstreams/967c9b6e-31d0-4309-9093-06ec80fe69c7/download)).
  À 7 ans : barres **pré-dessinées à choisir**, jamais à construire seul au début; jetons → barres (concret → imagé).
- **Problèmes sans nombres** et **protocole des trois lectures** : 1) l'histoire (sans nombres), 2) les quantités,
  3) les questions possibles ([Math Coach's Corner](https://www.mathcoachscorner.com/2022/04/the-3-reads-protocol-for-solving-word-problems/),
  [Illustrative Mathematics — MLR6](https://illustrativemathematics.blog/2022/08/09/tackling-wordy-problems-how-the-three-reads-math-language-routine-supports-access-for-all-learners/)).
- **Démarches de classe québécoises** : « je lis deux fois, j'encercle la question, je souligne les données utiles, je fais
  un dessin, je calcule, j'écris une réponse complète » ([i+ Interactif, 2e cycle](https://www.iplusinteractif.com/wordpress/site_caractere/2e-cycle-mathematiques/resolution-problemes-ecrits/)).
  Elle correspond déjà à `M.ui.DEMARCHE` (📖 🔍 ✏️ 🧮 ✅ 💬). **On garde ces 6 pictogrammes** partout; seul le geste
  de surlignage est nommé : 🖍️ *la question en bleu*, ⭕ *les données en rouge*, ✖️ *les données inutiles barrées*.

### 1.3 Plage des nombres

| Niveau | Additif | Groupes / partage | Note |
|---|---|---|---|
| lvl 0 | résultats ≤ 10 | 2–3 groupes de 2–5 | 2–3 phrases; lecture auto proposée |
| lvl 1 | ≤ 20; dizaines rondes ≤ 100 (30 + 40) | ≤ 5 groupes, total ≤ 30 | 3–4 phrases |
| lvl 2 | ≤ 100 (avec retenue); parfois centaines rondes < 1000 (300 + 200) | total ≤ 40, contenance | 4–5 phrases; 2 étapes; données inutiles |

Toujours des entiers ≥ 0, inconnue ≠ 0, et la réponse n'est jamais égale à une donnée (sinon recopier « marche »).

---

## 2. Catalogue des habiletés (domaine `problemes`)

Ids non préfixés (règle mathématique historique) mais distincts grâce à `pb-`. Tous les problèmes viennent du
**générateur** (§ 3); chaque habileté choisit une « recette » d'étapes. `learn` renvoie aux pages du § 5.

| # | id · icône · titre | desc (affichée) | pda (référence) | Formats | Niveaux 0 / 1 / 2 | Visuels |
|---|---|---|---|---|---|---|
| 0 | `problemes` 📖 Petits problèmes *(déplacée)* | Des histoires à résoudre. | Sens des opérations A.1, A.2 a–b | `number` (inchangé) | inchangé, réécrit sur le générateur | jetons, barres |
| 1 | `pb-histoire` 🎬 Je comprends l'histoire | Une histoire sans nombres : que se passe-t-il ? | C1 Décoder; PDA Sens des op. A.1 | `choice`, `tf` | 0 : « il y en a plus ou moins à la fin ? » · 1 : quel schéma raconte l'histoire · 2 : quelle question irait avec l'histoire | emoji de scène, barres sans nombres |
| 2 | `pb-question` 🖍️ Trouve la question | Touche la phrase qui pose la question. | C1 Décoder (déterminer la tâche) | `tapwords` (sur le texte, mode phrase), `choice` « Que cherche-t-on ? » | 0 : question à la fin · 1 : question au milieu ou forme « Trouve combien… » · 2 : texte de 5 phrases + choisir ce qu'on cherche | surlignage bleu |
| 3 | `pb-donnees` ⭕ Les données | Encercle les nombres utiles et dis ce qu'ils comptent. | C1 Décoder (dégager les données utiles) | `tapwords` (mode mot, plusieurs), `match` nombre ↔ ce qu'il compte | 0 : toucher les 2 nombres · 1 : `match` « 8 → billes de Léa au début » · 2 : nombre écrit en lettres (« trois ») ou nombre non-donnée (« 2e année ») | cercle rouge |
| 4 | `pb-mots` 🗝️ Les mots des maths | De plus, de moins, en tout, il reste, chacun, autant que. | PDA Vocabulaire 1er cycle; C3 | `choice` avec images, `tf`, `cloze` | 0 : en tout / il reste avec jetons · 1 : de plus / de moins / autant que · 2 : chacun, « 3 de plus que » vs « 3 de plus » | jetons face à face |
| 5 | `pb-schema` 🧱 Quel schéma ? | Choisis le modèle en barres qui va avec l'histoire. | C1 Modéliser; PDA Sens des op. A.2a, A.3a | `choice` (libellés = barres SVG statiques) | 0 : 2 choix ajout/retrait · 1 : 3 choix, + réunion/comparaison · 2 : + groupes égaux / partage, inconnue au début | `M.viz.barModelHtml` |
| 6 | `pb-operation` 🔀 Quelle opération ? | Choisis le calcul qui répond à la question. | PDA Sens des op. A.1; C2 choix des processus | `choice` d'équations (`8 + 5`, `13 − 5`, `8 + ? = 13`), `choice` « Pourquoi ? » | 0 : + ou − · 1 : équation à trou acceptée · 2 : **pièges de mots-clés** (« de plus » qui se résout par −) | barres après réponse |
| 7 | `pb-inconnue` 🕵️ Le début caché | Quand on ne connaît pas le début ou le changement. | PDA Sens des op. A.2a, A.5 (terme manquant) | `steps` (schéma → équation → calcul) | 0 : changement inconnu ≤ 10 · 1 : début inconnu ≤ 20 · 2 : comparaison « grand inconnu » ≤ 100 | barres avec « ? » mobile |
| 8 | `pb-resoudre` 🧭 Ma démarche complète | Lis, comprends, planifie, calcule, vérifie, réponds. | C1 toutes composantes | `steps` 4–6 étapes (recette complète) | 0 : 4 étapes, ajout/retrait · 1 : 5 étapes, tous types 1 étape · 2 : 6 étapes, + groupes/partage | démarche active + barres |
| 9 | `pb-deux-etapes` 🪜 Problèmes à deux étapes | D'abord…, ensuite… | PDA Sens des op. A.2 b (positive/négative), c (mixte) | `steps` avec report de valeur | 0 : composition positive ≤ 20 · 1 : négative/mixte ≤ 20 · 2 : mixte ≤ 100 | barres en 2 temps |
| 10 | `pb-sens` ✅ Ma réponse a-t-elle du sens ? | Estimer, puis vérifier sa réponse. | PDA Opérations A.1a (approximation); C1 Valider (formatif) | `choice` (plus/moins que…), `tf` « Ali dit 11. Possible ? », `number` vérification inverse, `estimate` (G8) | 0 : plus ou moins qu'au début ? · 1 : réponse d'un ami à juger + pourquoi · 2 : estimer à la dizaine | droite numérique |
| 11 | `pb-phrase` 💬 La phrase-réponse | Réponds par une phrase complète. | C1 Partager l'information; C3 | `cloze` (qui, nombre, unité), `choice` parmi phrases | 0 : 1 trou (nombre) · 1 : 3 trous · 2 : choisir la phrase juste parmi 4 (mauvais nom, unité, nombre, question recopiée) | — |
| 12 | `pb-inventer` ❓ Invente la question | Quelle question peut-on poser avec cette histoire ? | PDA Sens des op. A.2 « et vice versa »; C1 Décoder | `choice` (questions possibles / impossibles), `match` équation ↔ histoire | 0 : 2 questions, 1 possible · 1 : quelle question va avec `12 − 4` · 2 : quelle question demande **deux** étapes | — |
| 13 | `pb-inutiles` ✖️ Les données inutiles *(défi)* | Barre le nombre qui ne sert pas. | C1 — données superflues : **2e cycle, enrichissement** | `tapwords` sur le texte (mode « barrer ») | 0 : âge du chien évident · 1 : nombre de même unité, autre personne · 2 : deux nombres inutiles | barré gris |

Règles communes à toutes les `pb-*` :
- `hint` = rappel d'**une** action de la démarche, avec les mots du problème (« Relis la dernière phrase : elle se termine par
  un point d'interrogation. »). `explain` = comment penser, avec les nombres (« Samuel en a **moins** que Rosalie, donc on
  enlève : 15 − 6 = 9. »).
- `say` du problème toujours fourni; 🔊 lit le texte; au niveau 0, lecture automatique si l'option parent est active (G9).
- `pb-mots` enseigne le sens par les images et les **phrases complètes** (« Léa a 3 billes de plus que Tom »), jamais une
  liste mot → opération.
- Entrelacement : `pb-resoudre` et `problemes` tirent toutes les structures; la Révision du jour les mêle aux calculs.

### 2.1 Refactorisation de `problemes` (operations.js)

Recommandation : **déplacer** l'habileté `problemes` dans le domaine `problemes` (changer `domain`, garder l'id : la
progression est indexée par id d'habileté, `M.progress.mastery(s.id)`), et remplacer son tableau `PROBS` par le
générateur. Elle reste l'habileté « réponse seule » (fluidité, `starter: true`). Les visuels `M.opViz.compare`,
`M.viz.counters` et `bagViz` restent proposés en onglet « Jetons » à côté du modèle en barres. `docs/curriculum.md` déplace
la ligne vers la nouvelle section.

---

## 3. Générateur de problèmes (`M.pb`)

Fichiers proposés : `js/maths/data/pb-contextes.js` (banque de contextes), `js/maths/pb.js` (moteur, chargé après
`subject.js`, avant `skills/`), `js/maths/skills/problemes.js` (habiletés), `js/maths/learn/problemes.js`.
Le moteur ne touche jamais au DOM (règle de `gen`).

### 3.1 Pipeline

```
choisir structure + inconnue (selon habileté, lvl)
  → tirer les nombres (contraintes de structure ∩ plage du lvl ∩ plage plausible du contexte)
  → choisir contexte compatible + personne(s) (il/elle)
  → réaliser le texte (phrases étiquetées, jetons étiquetés)
  → dériver : équation-situation, calcul-solution, barres, distracteurs, phrase-réponse
  → recette d'étapes de l'habileté → objet question (format `steps`, `choice`, `tapwords`…)
  → auto-contrôle (recalcul, invariants)  ✗ → on retire (max 30 essais)
```

### 3.2 Structures × inconnue

| Structure (`kind`) | Rôles | Inconnues (`unknown`) | Équation-situation → calcul-solution |
|---|---|---|---|
| `ajout` (changement +) | `debut`, `change`, `fin` | `fin` · `change` · `debut` | `d + c = ?` → `d + c`; `d + ? = f` → `f − d`; `? + c = f` → `f − c` |
| `retrait` (changement −) | `debut`, `change`, `fin` | `fin` · `change` · `debut` | `d − c = ?`; `d − ? = f` → `d − f`; `? − c = f` → `f + c` |
| `reunion` (partie-partie-tout) | `p1`, `p2`, `tout` | `tout` · `partie` | `p1 + p2 = ?`; `p1 + ? = t` → `t − p1` |
| `comparaison` | `grand`, `petit`, `ecart` (+ `qui` en a le plus) | `ecart` · `petit` · `grand` | `g − p = ?`; `g − e = ?`; `p + e = ?` |
| `groupes` (groupes égaux) | `nb`, `parGroupe`, `total` | `total` | `k + k + … = ?` (addition répétée) |
| `partage` | `total`, `nb`, `parPart` | `parPart` (partage) · `nb` (contenance) | « distribue un à la fois » / « fais des paquets de k » |
| `deux` (composition) | deux sous-problèmes `s1`, `s2`, `s2.debut = s1.fin` | `fin` de `s2` | `positive` (+,+), `negative` (−,−), `mixte` (+,− / −,+) |

Lvl par défaut : 0 = `fin`/`tout`; 1 = + `change`, `partie`, `ecart`; 2 = + `debut`, `petit`/`grand`, `deux` mixte.
Phrase de comparaison : toujours la forme « X a **n de plus que** Y » / « **n de moins que** », jamais « plus que Y de n ».

### 3.3 Formes de données

```text
PbContext = {
  id: 'peche-glace', theme: 'hiver', emoji: '🐟',
  unit: { sg: 'poisson', pl: 'poissons', genre: 'm' },        // « de poissons » calculé par M.fr.de()
  range: { min: 1, max: 30 },                                  // plausibilité (pas 87 tires mangées)
  people: 1 | 2,                                               // nombre de personnages requis
  kinds: {                                                     // une réalisation par structure supportée
    ajout: {
      setup:  '{P} pêche sur la glace avec {sa} grand-mère.',  // phrase de décor (optionnelle, sans nombre)
      debut:  '{Il} attrape {debut} poissons le matin.',
      change: "L'après-midi, {il} en attrape {change} autres.",
      fin:    'À la fin de la journée, {il} a {fin} poissons.',
      q: { fin: 'Combien de poissons {P} a-t-{il} attrapés en tout ?',
           change: "Combien de poissons {P} a-t-{il} attrapés l'après-midi ?",
           debut: 'Combien de poissons {P} a-t-{il} attrapés le matin ?' },
      answer: { fin: '{P} a attrapé {n} poissons en tout.', change: …, debut: … },   // phrase-réponse
      nonumber: { debut: '{Il} attrape des poissons le matin.', change: "L'après-midi, {il} en attrape d'autres." },
    },
    retrait: { … }, comparaison: { … },
  },
  distractor: [ '{P} porte {x} paires de bas de laine.' ],     // données inutiles (lvl 2 / pb-inutiles)
}

Person = { n: 'Rosalie', f: true, il: 'elle', Il: 'Elle', e: 'e', sa: 'sa' }   // {e} : accord avec être (« arrivée »)

Pb = {
  id: 'ajout:fin:peche-glace:4-3',      // trace pour débogage et pour éviter les doublons dans une série
  kind: 'ajout', unknown: 'fin', sub: null | 'positive' | 'negative' | 'mixte',
  v: { debut: 4, change: 3, fin: 7 },  // toutes les valeurs, inconnue comprise
  people: [Person], ctx: PbContext,
  sentences: [ { html, say, role: 'setup'|'data'|'question'|'distractor', data: ['debut'] } ],
  tokens:    [ { w: 'Félix', s: 0 }, { w: '4', s: 1, data: 'debut' }, … , { w: 'tout ?', s: 3, q: true } ],
  text: '…', html: '…',                // texte complet (passage)
  textNoNumbers: '…',                  // version « sans nombres » (pb-histoire, 1re lecture)
  situation: { left: [4, '+', 3], right: [null] },           // équation-situation, null = inconnue
  solve: { a: 4, op: '+', b: 3, r: 7 },                      // calcul-solution (peut différer de la situation)
  answer: 7,
  bar: BarSpec,                                               // § 4.1
  wrong: { op: { a: 4, op: '−', b: 3, r: 1 }, bars: [BarSpec, …] },   // distracteurs dérivés de la structure
  reply: { html: 'Félix a attrapé 7 poissons en tout.', cloze: { text, blanks } },
}

Recipe = [ 'histoire'|'question'|'donnees'|'schema'|'operation'|'calcul'|'calcul2'|'estimer'|'verifier'|'justifier'|'phrase' ]
M.pb.make({ kinds, unknowns, lvl, ctxFilter? }) → Pb
M.pb.toSteps(pb, recipe, { lvl }) → question au format `steps`
M.pb.step.<nom>(pb, lvl) → une étape (objet de format) — réutilisable seule (pb-question, pb-schema…)
M.pb.check(pb) → message | undefined   (branché dans tools/check-skills.js, G13)
```

### 3.4 Règles de cohérence (invariants vérifiés par `M.pb.check`)

1. `solve.r === answer`, recalculé depuis `v`; toutes les valeurs entières, `0 < v ≤ ctx.range.max`.
2. La phrase-question contient exactement un « ? » et c'est la seule phrase `role: 'question'`.
3. Chaque valeur connue apparaît **une seule fois** dans le texte; l'inconnue n'apparaît jamais.
4. Les jetons `data` correspondent exactement aux valeurs connues (utile pour la correction de `tapwords`).
5. `answer` ∉ valeurs connues; dans `comparaison`, `grand ≠ petit`; dans `partage`, `total % nb === 0`.
6. Distracteurs de `choice` : distincts entre eux et de la bonne réponse; résultats ≥ 0 (sinon remplacés).
7. Typographie : espace insécable avant `? ! :`; pas de « undefined/NaN » (déjà vérifié par check-skills).
8. Deux personnages : prénoms différents, et si même genre, la question nomme toujours la personne (jamais « il » ambigu).

### 3.5 Banque de contextes

≥ 24 contextes au départ, chacun avec ≥ 2 structures : cabane à sucre (tire), pêche sur la glace, patinoire, hockey
(buts, cartes), autobus scolaire, objets perdus (mitaines), verger (pommes), cueillette de bleuets, bibliothèque
(livres), Halloween (bonbons), Noël (biscuits), Saint-Jean (lampions), camp de jour (canots), dépanneur (enfants qui
achètent des objets — **sans argent** sauf extras § 6.1), jardin (tomates), ferme (œufs), parc (écureuils), lac
(canards), fête d'anniversaire (ballons), classe (crayons, autocollants), bricolage (cocottes), recyclage (canettes),
pluie de feuilles d'érable, bonhommes de neige. Prénoms : la liste `NAMES` actuelle (à déplacer dans `M.people`, G4),
élargie à des prénoms d'origines variées courants au Québec (Malik, Inès, Kenji, Amira, Tiago, Naomi…). Activités
attribuées sans stéréotype (le tirage du prénom est indépendant du contexte).

### 3.6 Exemples générés complets

**Exemple A — `pb-resoudre`, lvl 0, `ajout` / inconnue `fin`**

Texte (`passage`, titre « Le problème ») : « 🐟 Félix pêche sur la glace. Il attrape **4** poissons le matin.
L'après-midi, il en attrape **3** autres. Combien de poissons Félix a-t-il attrapés en tout ? »

| # | label | Format et champs | hint | after / explain |
|---|---|---|---|---|
| 1 | 🔍 Je comprends | `tapwords` cible `passage`, mode `sentence`, `answer: [phrase 3]` (G2) — « Touche la **question**. » | « La question se termine par un point d'interrogation (?). » | « Bravo ! On cherche combien de poissons **en tout**. » (surlignée en bleu, reste visible) |
| 2 | ⭕ Je comprends | `tapwords` cible `passage`, `select:'many'`, `answer: [jetons '4', '3']` — « Encercle les **données**. » | « Cherche les nombres dans l'histoire. » | « 4 poissons le matin, 3 l'après-midi. » |
| 3 | ✏️ Je planifie | `choice`, 2 choix SVG : barre `[4][3]` + accolade « ? » au-dessus (✔) / barre « 4 » entière avec une partie « 3 » enlevée | « Félix en attrape d'autres : il en a **plus** à la fin. » | « Deux parties, on cherche le tout. » |
| 4 | 🧮 Je calcule | `number`, `prompt: '4 + 3 = {?}'`, `answer: 7`, `viz` étape = barres (G3) | « Compte à partir de 4 : 5, 6, 7. » | « 4 + 3 = 7. » |
| 5 | 💬 Je réponds | `cloze`, `text: 'Félix a attrapé {0} poissons en tout.'`, `blanks: [{ choices: ['7','4','3'], answer: '7' }]` | « Mets le résultat de ton calcul. » | — |

`explain` (après la carte) : « On cherche le **tout** : le matin **et** l'après-midi. 4 + 3 = **7**. Félix a attrapé 7
poissons en tout. »

**Exemple B — `pb-operation`/`pb-resoudre`, lvl 1–2, `comparaison` / inconnue `petit` (piège « de plus »)**

Texte : « 🃏 Rosalie a **15** cartes de hockey. Elle a **6** cartes de plus que Samuel. Combien de cartes Samuel a-t-il ? »
`v = { grand: 15, ecart: 6, petit: 9, qui: 'Rosalie' }`, `situation: 9 + 6 = 15` → `solve: 15 − 6 = 9`.

| # | label | Format | hint | after |
|---|---|---|---|---|
| 1 | 🔍 Je comprends | `choice` « Qui a **le plus** de cartes ? » `[Rosalie ✔, Samuel]` | « Relis : “Elle a 6 cartes de plus que Samuel.” Elle, c'est Rosalie. » | « Rosalie en a plus. Samuel en a donc **moins**. » |
| 2 | ✏️ Je planifie | `choice` 3 barres SVG : Rosalie longue « 15 », Samuel courte « ? », écart « 6 » (✔) / Samuel longue / barres égales | « La barre la plus longue est celle de la personne qui en a le plus. » | « Il manque 6 cartes à Samuel pour en avoir autant que Rosalie. » |
| 3 | ✏️ Je planifie | `choice` `[15 − 6 ✔, 15 + 6, 6 − 15]` | « Samuel en a moins que 15. Ta réponse doit être **plus petite** que 15. » | « Les mots “de plus” ne veulent pas toujours dire + ! » |
| 4 | 🧮 Je calcule | `number` `15 − 6 = {?}`, `answer: 9` | « Recule de 5 jusqu'à 10, puis encore de 1. » | — |
| 5 | ✅ Je vérifie | `number` `9 + 6 = {?}`, `answer: 15`, `prompt` « Vérifie : si Samuel en avait 6 de plus… » | « Ajoute l'écart à ta réponse : tu dois retrouver les cartes de Rosalie. » | « On retrouve 15 : ça a du sens ! » |
| 6 | 💬 Je réponds | `choice` `[Samuel a 9 cartes. ✔ · Rosalie a 9 cartes. · Samuel a 21 cartes. · Samuel a 6 cartes.]` | « Qui ? Combien ? » | — |

`explain` : « Rosalie a 6 cartes **de plus** que Samuel, donc Samuel en a 6 **de moins** : 15 − 6 = **9**. Vérification :
9 + 6 = 15. »

**Exemple C — `pb-deux-etapes`, lvl 2, `deux` / `mixte` (+ puis −)**

Texte : « 🚌 Il y a **23** élèves dans l'autobus scolaire. Au premier arrêt, **8** élèves montent. Au deuxième arrêt,
**5** élèves descendent. Combien d'élèves y a-t-il maintenant dans l'autobus ? »
`s1 = ajout {23, 8, 31}`, `s2 = retrait {31, 5, 26}`, `answer: 26`.

| # | label | Format | hint | after |
|---|---|---|---|---|
| 1 | ⭕ Je comprends | `tapwords` cible `passage`, many, `answer: [23, 8, 5]` | « Il y a trois nombres dans l'histoire. » | — |
| 2 | ✏️ Je planifie | `order` « Mets les étapes dans l'ordre. » `[23 + 8 → ?, puis ? − 5]` sous forme de 2 cartes (+ 1 intrus `23 − 5`) — ou `choice` au lvl 1 | « Que se passe-t-il **d'abord** ? » | « D'abord des élèves montent, ensuite d'autres descendent. » |
| 3 | 🧮 Étape 1 | `number` `23 + 8 = {?}`, `answer: 31` | « 23 + 7 = 30, puis encore 1. » | « Après le 1er arrêt : 31 élèves. » (affiché dans « Mon travail », G5) |
| 4 | 🧮 Étape 2 | `number` `{s3} − 5 = {?}` → « 31 − 5 = ? », `answer: 26` | « Pars de 31 et recule de 5. » | — |
| 5 | ✅ Je vérifie | `choice` « À la fin, y a-t-il plus ou moins d'élèves qu'au départ (23) ? » `[plus ✔, moins, autant]` + `after` « 8 montent, seulement 5 descendent : 3 de plus. 23 + 3 = 26 ✔ » | « Compare ceux qui montent et ceux qui descendent. » | — |
| 6 | 💬 Je réponds | `cloze` `Il y a {0} {1} dans l'autobus maintenant.` `[{['26','31','23'], '26'}, {['élèves','arrêts'], 'élèves'}]` | — | — |

Valeur reportée : l'étape 4 affiche toujours la **bonne** valeur de l'étape 3 (révélée en cas d'échec), donc l'étape 4
reste juste et notable même si l'étape 3 est manquée.

---

## 4. Visuels

### 4.1 Modèle en barres — `M.viz.barModel(el, spec)` et `M.viz.barModelHtml(spec)` (G1)

```text
BarSpec = {
  type: 'tout' | 'comparaison' | 'groupes',
  rows: [ { label?: 'Rosalie', emoji?, segs: [ { v: 15 | null, text?: '15' | '?', tone: 'A'|'B'|'E'|'X' } ] } ],
  total?: { v, text, unknown? },             // accolade au-dessus (type 'tout' et 'groupes')
  diff?:  { v, text, unknown? },             // segment pointillé + accolade à droite de la barre courte ('comparaison')
  scale: 'prop' | 'schema',                  // proportionnel aux valeurs, ou schématique (barres sans nombres)
  mode: 'static' | 'reveal' | 'tokens',      // statique · « ? » se remplit au showMe · onglet jetons ↔ barres
}
```
Comportement :
- Largeurs proportionnelles (`prop`), segment minimum 56 px pour que « 3 » reste lisible; largeur max 100 % (360 → 1100 px).
- `?` = case jaune (couleur d'aide) avec bordure pointillée; `X` = segment barré (retrait); `E` = segment vide (à compléter).
- `comparaison` : barres alignées à gauche, l'une sous l'autre, étiquette du prénom à gauche; l'écart est pointillé.
- `groupes` : n segments égaux, accolade du total; `partage` : le total en haut, n parts égales en dessous.
- Toucher un segment : lecture vocale de son sens (« le matin, 4 poissons »), jamais de réponse.
- `showMe()` : anime la construction (barre du début → ajout de la partie → accolade → « ? » → résultat), ≤ 3 s,
  désactivé si `prefers-reduced-motion`.
- `barModelHtml` rend un SVG statique, sans état, utilisable comme `label` de `choice` (le format accepte le SVG).
- Couleurs : jetons `--A` (début/partie 1), `--B` (changement/partie 2), `--yel` (inconnue), `--line` (contour).
- Accessibilité : `aria-label` décrivant le schéma (« Deux parties : 4 et 3. Le tout est inconnu. »).

### 4.2 Surligneur de texte de problème (G2)

Le passage est rendu en **jetons** (`pb.tokens`) au lieu d'un HTML figé. Trois marques, des couleurs fixes partout :

| Marque | Geste | Rendu | Sens |
|---|---|---|---|
| `q` 🖍️ | toucher un mot de la question (mode `sentence` : toute la phrase s'allume) | fond bleu pâle | la question |
| `d` ⭕ | toucher un nombre (mode `word`) | anneau rouge autour du jeton | une donnée utile |
| `x` ✖️ | toucher un nombre en mode « barrer » | texte gris barré | une donnée inutile |

- Une étape `tapwords` avec `target: 'passage'` utilise le passage de la question comme surface : pas de copie du texte.
  Correction comme `tapwords` (indices de jetons; en mode `sentence`, l'indice de phrase).
- Les marques validées **restent** visibles pendant les étapes suivantes (la démarche laisse des traces, critère C1 3).
  Une marque fautive disparaît au réessai; après échec, les bonnes marques sont posées (`reveal`).
- Conflit avec « toucher un mot pour l'entendre » (`M.ui.reading`) : hors étape de marquage, toucher lit le mot; pendant
  une étape de marquage, toucher marque et 🔊 lit tout le texte.
- Clavier : flèches pour se déplacer de jeton en jeton, Espace pour marquer, Entrée pour vérifier.
- Le jeton garde la ponctuation attachée (comme `tapwords`), mais le nombre seul est la cible (le « . » de « 3. » n'est pas
  surligné).

---

## 5. Pages « Apprendre » (domaine `problemes`)

| id | Titre | Contenu |
|---|---|---|
| `pb-demarche` | 🧭 Ma démarche | `M.ui.demarche()` en haut; un problème d'exemple (généré, lvl 0) parcouru **pas à pas** : bouton « Étape suivante ➜ » active le pictogramme suivant (`demarche(steps, active)`), applique la marque (question bleue, données rouges), affiche les barres, le calcul, puis la phrase-réponse. Bouton 🔄 « Un autre problème ». Encadré parent : les trois lectures (1. l'histoire, 2. les nombres, 3. la question). `miniQuiz` : 2 étapes `tapwords` sur le passage. |
| `pb-types` | 🧱 Les types de problèmes | Onglets (`M.ui.tabs`) : Ajouter/Enlever (changement), Réunir (partie-partie-tout), Comparer, Groupes égaux et partage. Chaque onglet : histoire courte, jetons ↔ barres (onglet interne), `stepper` pour changer les nombres et voir la barre s'ajuster, phrase de Castor (« Quand on cherche le tout, on additionne les parties. Quand on cherche une partie, on enlève l'autre partie du tout. »). Renvoie à « Le sens des opérations » (opérations) pour l'aspect calcul, sans le répéter. |
| `pb-mots` | 🗝️ Les mots-clés… et leurs pièges | `M.ui.vocab` : en tout, il reste, de plus, de moins, autant que, chacun, ensemble — chacun illustré par des jetons, avec phrase lue. Section « Attention, piège ! » : deux histoires avec « de plus » côte à côte, l'une se résout par +, l'autre par − (barres). Règle de Castor : « Un mot ne choisit pas l'opération. **Le dessin** la choisit. » `miniQuiz` 3 `tf`. |
| `pb-sens` | ✅ Est-ce que ma réponse a du sens ? | Trois questions-réflexes : *Plus ou moins qu'au début ?* (droite numérique, flèche), *Est-ce possible ?* (« 25 poissons pour 4 + 3 ? »), *Je refais à l'envers* (addition ↔ soustraction). Jeu « Le robot calculateur se trompe-t-il ? » : 4 réponses de robot à juger (`tf`). |
| *(option)* `pb-lire` | 📖 Lire un problème trois fois | Problème sans nombres → nombres qui apparaissent → question qui apparaît (animation pas à pas), questions orales suggérées aux parents. Peut être fusionné dans `pb-demarche`. |

---

## 6. Extras de mathématique

| Extra | Statut programme | Où |
|---|---|---|
| L'argent | **Enrichissement** (voir 6.1) | domaine `defis` ou `nombres` |
| Énigmes logiques (régularités, sudoku 4 × 4, balances) | Régularités = **officiel** (Opérations A.13–A.14); sudoku/balances = **enrichissement C2** | nouveau domaine `defis` « Défis et énigmes » 🧠 |
| Défi calcul mental | **Officiel** (répertoire mémorisé A.2, calcul mental) — c'est un *mode*, pas du contenu | `M.runSession` |

### 6.1 L'argent (enrichissement)

Ce que dit le programme : la PDA cite l'**argent** comme matériel « aux groupements non apparents et non accessibles »
pour la valeur de position (Nombres naturels A.4c), et les nombres décimaux (notation 1,25 $) arrivent au **2e cycle**
([PDA](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf),
[Arithmétique 2e cycle](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/formations/Arithmetic-2e-cycle-math-primaire.pdf)).
Donc : **jamais de virgule**, et on ne mélange **jamais** dollars et cents dans une même question.

- Pièces et billets : 5 ¢, 10 ¢, 25 ¢, 1 $ (huard), 2 $; billets 5 $, 10 $, 20 $. Pas de 1 ¢ (plus distribuée depuis
  le 4 février 2013, [Budget 2012](https://www.budget.canada.ca/2012/themes/theme2-fra.html)).
- Écriture québécoise : « 25 ¢ », « 7 $ » (espace insécable avant le symbole).
- Visuels : **pièces génériques** en SVG (cercle de couleur/taille relative + valeur écrite), pas de reproduction des
  dessins officiels (G11).

| id | Titre | Formats / niveaux |
|---|---|---|
| `argent-reconnaitre` | 🪙 Les pièces et les billets | `match` pièce ↔ valeur; `choice` « Laquelle vaut le plus ? » (la plus grande pièce n'est pas toujours la plus chère : 10 ¢ vs 5 ¢) |
| `argent-compter` | 💰 Compter l'argent | lvl 0 : pièces identiques (bonds de 5, de 10) < 100 ¢ · lvl 1 : 2 sortes de pièces < 100 ¢ ou dollars ≤ 20 $ · lvl 2 : dollars ≤ 50 $ avec billets (dizaines/unités = valeur de position) |
| `argent-payer` | 🛒 Au dépanneur | `multi` « Touche les pièces pour payer exactement 35 ¢ »; problèmes du générateur avec contexte `depanneur` (dollars entiers seulement), structures `ajout`, `retrait` (« il lui reste »), `comparaison` (« combien de plus coûte… ») |

Page Apprendre `argent` : pièces et billets, compter par bonds, « 100 ¢ = 1 $ » (mention seulement, pas de conversion).

### 6.2 Énigmes logiques (domaine `defis`)

| id | Titre | Statut | Formats |
|---|---|---|---|
| `defi-suites` | 🔁 Qu'est-ce qui vient après ? | Officiel (A.13–14) — **ne pas dupliquer `suites`** : ici motifs à **deux attributs** (couleur + forme), motifs qui grandissent, trouver l'erreur dans la suite | `choice`, `tapwords` sur une rangée d'emoji (« touche l'intrus ») |
| `defi-sudoku` | 🧩 Mini-sudoku | Enrichissement C2 | `grid` 4 × 4 avec 4 emoji (🍎🍌🍇🍓), lvl 0 : 1 case vide par rangée; lvl 1 : 6–8 vides; lvl 2 : 9–10 vides, solution unique garantie (G10) |
| `defi-balances` | ⚖️ Les balances mystères | Enrichissement C2 (égalité, A.4) | `M.viz.balance` (G14) avec emoji : « 🍎 + 🍎 = 6 → 🍎 = ? », lvl 2 : deux balances en chaîne (🍎 = 3, 🍎 + 🍌 = 8). Réponse `number`. Ne pas dupliquer `egalite` (nombres) : ici objets de valeur inconnue. |
| `defi-qui-suis-je` | 🕵️ Qui suis-je ? | Officiel (nombres < 100, pair/impair, dizaines) + C2 | `choice` : « Je suis pair, entre 20 et 30, mon chiffre des unités est 4 » — indices au fil des étapes (`steps`) avec grille de 100 qui s'éteint |

### 6.3 Mode « Défi calcul mental »

- Une série de 10 calculs tirés de `add-10`, `add-20`, `sub-20`, `calcul-100` (lvl actuel de l'enfant).
- **Aucune minuterie visible ni pénalité** (`methodologie.md` § 4). Le défi compte les réussites du premier coup et la
  meilleure série 🔥; record personnel affiché, jamais de classement.
- Le guide IES (rec. 6) juge utiles les activités chronométrées pour la fluidité : option **parent** « chrono doux »
  (désactivée par défaut, affichage sablier sans compte à rebours, aucune conséquence) — COULD (G12).

---

## 7. LACUNES DU CADRE (spécifications génériques)

Toutes vont dans le cadre (`formats.js`, `ui.js`, `viz.js`, `core.js`, `session.js`) avec un exemple dans
`M.FORMAT_SAMPLES` / le guide de style, conformément à `framework.md` § 1.

### MUST

**G1 — `M.viz.barModel(el, spec)` + `M.viz.barModelHtml(spec)`.** Spécification au § 4.1. Doit : rendu statique SVG
(chaîne) et version montée avec `showMe`; types `tout`, `comparaison`, `groupes`; échelle `prop`/`schema`; inconnue
en jaune; libellés ≥ 1 rem; fonctionne de 360 à 1100 px; aucun accès DOM dans `barModelHtml`. Exemple au guide de style.

**G2 — Passage à jetons et marquage (`passage.tokens`, `tapwords.target: 'passage'`).**
- `passage` accepte `tokens: [{ w, s, data?, q? }]` en plus de `html`; s'il y a des jetons, le passage est rendu en boutons.
- `tapwords` accepte `target: 'passage'` (pas de `words`; les indices réfèrent aux jetons du passage), `unit: 'word' |
  'sentence'`, `mark: 'q' | 'd' | 'x'`. `validate` vérifie que les indices existent dans `passage.tokens`.
- Les marques réussies persistent sur le passage pendant toute la carte (et entre étapes de `steps`).
- Hors marquage, toucher un jeton le lit (comportement de `M.ui.reading`).

**G3 — Améliorations de `steps` (présentation).**
- Le passage reste accessible pendant toutes les étapes : collant (*sticky*) en colonne gauche à ≥ 800 px; sous 800 px,
  bouton « 📖 Relire le problème » qui déroule le texte au-dessus de l'étape courante.
- `step.viz?: (el) => {}` : visuel propre à l'étape (barres, droite numérique), affiché dans l'étape.
- `step.demarche?: 0..5` : bandeau `M.ui.demarche(steps, active)` compact au-dessus, pictogramme actif mis à jour.
- `step.label` facultatif déduit de `demarche` (icône + libellé de `M.ui.DEMARCHE`).

**G4 — Utilitaires de texte partagés (`M.people`, `M.fr`).** Déplacer `NAMES`/`person()` (dupliqués dans
`skills/operations.js` et `learn/operations.js`) dans `core.js` : `M.people.pick({ not?, genre? })` →
`{ n, f, il, Il, e, sa, son }`; `M.fr.de(mot)` (« de »/« d' »); `M.fr.nb(n)` (espace des milliers); `M.fr.fill(tpl, vars)`
(remplace `{P}`, `{il}`, `{e}`…, lève une erreur si une variable manque, pour check-skills).

### SHOULD

**G5 — Report de valeurs entre étapes (`steps`).** `{sK}` dans le `prompt` d'une étape = bonne réponse de l'étape K
(déjà connue du générateur, insérée au rendu); zone « 📝 Mon travail » sous l'en-tête qui accumule les résultats validés
(« 23 + 8 = 31 »), comme les traces écrites d'une copie.

**G6 — Étape non notée (`format: 'info'`).** Affiche du contenu (lecture, « Je lis le problème deux fois ») avec un
bouton « J'ai lu ✔ »; ne compte ni pour l'étoile ni pour les essais. Permet aussi la version « trois lectures » (le texte
change d'une étape à l'autre : sans nombres → avec nombres → avec question) via `step.passage` qui remplace le passage
de la carte.

**G7 — Pondération de l'étoile dans `steps` (`scoreSteps`).** Aujourd'hui ⭐ seulement si **toutes** les étapes sont
réussies du 1er coup : sur 6 étapes, la maîtrise baisse injustement. `scoreSteps: [indices]` (par défaut toutes) indique
les étapes qui comptent pour l'étoile et la maîtrise de l'habileté.

**G8 — Format `estimate`.** « Environ combien ? » : droite numérique (`M.viz.numberLine`) où l'enfant place un curseur
ou touche une zone; champs `answer` (valeur exacte), `tolerance` (absolue) ou `zones: [{ from, to, label }]` +
`answer: zoneId`; `validate` : zones disjointes, la bonne zone contient `answer`. Deux essais; rétroaction « trop loin à
droite ».

**G9 — Lecture à voix haute renforcée.** Option parent « Lire les problèmes automatiquement » (`passage.autoplay`);
surbrillance mot à mot pendant la lecture (événements `boundary` de la synthèse vocale fr-CA quand disponibles, sinon
phrase par phrase); 🐢 lecture lente aussi pour `passage` (existe déjà pour `audio`).

**G13 — Contrôle sémantique dans `tools/check-skills.js`.** Crochet facultatif `skill.check(q)` appelé sur chaque question
générée (ex. `M.pb.check` : recalcul, invariants § 3.4); vérification de typographie (espace avant `? ! :`); détection de
doublons de choix (déjà partiellement dans `choice.validate`).

### COULD

**G10 — Format `grid` (casse-tête en grille).** Champs : `size` (4), `symbols` (4 emoji), `givens` (grille avec `null`),
`answer` (grille complète), `rule: 'latin' | 'latin-boxes'`. Geste : toucher une case vide, puis un symbole de la palette.
`validate` : `givens` ⊂ `answer`, `answer` respecte la règle, **solution unique** (résolution par retour arrière ≤ 4⁴
cas). Correction à « Vérifier » : cases fausses en rouge, 2 essais.

**G11 — `M.viz.coins(spec)` / `M.viz.coinHtml(value)`.** Pièces et billets génériques (cercle/rectangle, couleur, taille
relative, valeur écrite), aucune reproduction des dessins officiels; utilisables comme libellés de `choice`/`multi`.

**G12 — Mode de série « défi » dans `M.runSession(opts)`.** `opts.mode: 'defi'` : n questions de plusieurs habiletés,
compteur de série 🔥 et record personnel en `M.progress`; option parent `chronoDoux` (sablier non bloquant). Les
réponses comptent normalement pour la maîtrise.

**G14 — `M.viz.balance` générique.** Promouvoir `M.opViz.balance` (opérations) dans `viz.js`, avec plateaux d'emoji de
valeur inconnue et chaînage de deux balances.

---

## 8. Risques, ambiguïtés et parades

| Risque | Parade |
|---|---|
| **Charge de lecture** : un enfant de 7 ans qui lit lentement échoue en *lecture*, pas en *mathématique*. | Phrases ≤ 12 mots, 2–5 phrases selon lvl; mots fréquents; nombres en chiffres (sauf défi `pb-donnees` lvl 2); prénoms courts; 🔊 toujours, lecture automatique au lvl 0 (G9); passage toujours visible (G3); interligne 1,8; étapes courtes (≤ 6). |
| **Mots-clés trompeurs** : « de plus » → +, « il reste » → −… apprendre la règle donne de bons résultats au début puis des erreurs systématiques (Karp et al., 2014). | On enseigne le sens et le schéma; items-pièges dès le lvl 1 dans `pb-operation`/`pb-resoudre` (≈ 1 sur 4); `explain` qui nomme le piège; page `pb-mots`. |
| **Langage ambigu** (« Combien de plus ? » sans référence; « chacun » en partage vs groupes; pronoms à deux personnages de même genre). | Formes fixes (§ 3.2), invariants § 3.4 n° 8, relecture de chaque gabarit par un adulte avant ajout à la banque. |
| **Correction automatique de réponses ouvertes** (phrase-réponse, justification, dessin). | Pas de texte libre : `cloze` à banques de mots, `choice` dont les distracteurs ne diffèrent que sur **un** critère (qui / combien / unité); justifications à choisir; schémas à choisir, pas à dessiner. Encourager les parents à faire **dire** la phrase à voix haute (C3). |
| **Surcharge des `steps`** : longues cartes, étoile difficile. | lvl 0 = 3–4 étapes; G7 (étoile sur les étapes clés); une seule nouveauté par étape. |
| **Fidélité au programme** : données inutiles (2e cycle), validation (critère 2e cycle), argent/décimaux (2e cycle). | Marqués « défi » ou « enrichissement » dans `pda` et dans `curriculum.md`; jamais dans les `starter`. |
| **Doublons avec `operations`** (problemes, groupes-egaux, partage, egalite, suites). | § 2.1 (déplacement + générateur commun); les `pb-*` exercent la compréhension, les habiletés d'opérations le calcul; renvois croisés `learn`. |
| **Plausibilité/culture** (87 tires mangées, stéréotypes). | `ctx.range`, prénoms tirés indépendamment des activités, contextes québécois variés (§ 3.5). |
| **Synthèse vocale absente ou anglaise** sur certains appareils. | Repli : bouton 🔊 désactivé avec info-bulle; le texte reste lisible; ne jamais rendre l'audio obligatoire. |
| **Répétition** (même histoire deux fois dans une série). | `pb.id` mémorisé dans la série; contexte et structure non répétés deux fois de suite. |

---

## 9. Plan de mise en œuvre

| Phase | Contenu | Fini quand |
|---|---|---|
| **P0 — Cadre** | G4 (`M.people`, `M.fr`), G1 (barres), G2 (passage à jetons + `tapwords target`), G3 (`steps` : passage collant, `viz` d'étape, `demarche`), G7; exemples dans `M.FORMAT_SAMPLES`; `framework.md` mis à jour | guide de style : nouvel exemple `steps` « Félix » (exemple A) jouable à 390 et 1100 px |
| **P1 — Générateur** | `js/maths/pb.js` + `data/pb-contextes.js` (≥ 24 contextes), `M.pb.check`, G13 | `check-skills` : 500 tirages × structure × inconnue × lvl sans erreur; relecture de 50 textes tirés au hasard |
| **P2 — Habiletés lot 1** | `pb-histoire`, `pb-question`, `pb-donnees`, `pb-mots`, `pb-schema`, `pb-operation`, `pb-resoudre`, `pb-phrase`; déplacement de `problemes` (même id) | progression existante de `problemes` conservée; aucune erreur de console |
| **P3 — Apprendre** | `pb-demarche`, `pb-types`, `pb-mots`, `pb-sens` | `miniQuiz` fonctionnels; liens `learn` des habiletés |
| **P4 — Habiletés lot 2** | G5, G6, G8; `pb-inconnue`, `pb-deux-etapes`, `pb-sens`, `pb-inventer`, `pb-inutiles` | essai avec l'enfant : 3 séances, noter les étapes qui bloquent (lecture vs math) |
| **P5 — Extras** | domaine `defis` (G10, G14), argent (G11), mode défi (G12) | marqués « enrichissement » dans `curriculum.md` |
| **Docs** | `curriculum.md` (section 🧩 Comprendre et résoudre), `methodologie.md` § 1 (C1/C2 mis à jour, schémas, trois lectures, mots-clés) | — |

Ordre de priorité si le temps manque : P0 (G1–G3) → P1 → `pb-question`, `pb-donnees`, `pb-schema`, `pb-resoudre` →
page `pb-demarche`. C'est le minimum qui comble le manque observé (compréhension avant calcul).

---

## Sources

- MEQ, *PFEQ — Mathématique, primaire* (compétences, attentes de fin de cycle) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-mathematique-primaire.pdf
- MEQ, *Progression des apprentissages — Mathématique* : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf
- MEQ, *Arithmétique — 2e cycle* (décimaux) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/formations/Arithmetic-2e-cycle-math-primaire.pdf
- CS Laval, *Dénominateur commun — CD1 évaluer* : https://sites.google.com/cslaval.qc.ca/denominateurcommun/%C3%A9valuation/cd1-%C3%A9valuer
- CSBE, *Caractéristiques d'un bon problème* : https://se.csbe.qc.ca/mathprimaire/2020/03/13/caracteristiques-dun-bon-probleme/
- i+ Interactif, *Résolution de problèmes écrits* : https://www.iplusinteractif.com/wordpress/site_caractere/2e-cycle-mathematiques/resolution-problemes-ecrits/
- Powell & Fuchs (2018), *Effective Word-Problem Instruction: Using Schemas* : https://pmc.ncbi.nlm.nih.gov/articles/PMC6130842
- Fuchs et al. (2021), *Closing the Word-Problem Achievement Gap in First Grade* : https://pmc.ncbi.nlm.nih.gov/articles/PMC7989819
- *Implementing Schema Instruction to Support Young Children* (J. Numerical Cognition) : https://jnc.psychopen.eu/index.php/jnc/article/download/17649/17649.pdf/
- IES/WWC (2021), *Assisting Students Struggling with Mathematics*, rec. 5 : https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC2021006-Math-PG.pdf
- Karp, Bush & Dougherty (2014), *13 Rules That Expire* : https://www.nctm.org/Publications/Teaching-Children-Mathematics/2014/Vol21/Issue1/tcm2014-08-18a_pdf/
- Kaur (2019), *The why, what and how of the “Model” method* : https://repository.nie.edu.sg/bitstreams/967c9b6e-31d0-4309-9093-06ec80fe69c7/download
- Three Reads : https://www.mathcoachscorner.com/2022/04/the-3-reads-protocol-for-solving-word-problems/ · https://illustrativemathematics.blog/2022/08/09/tackling-wordy-problems-how-the-three-reads-math-language-routine-supports-access-for-all-learners/
- Gouvernement du Canada, *Budget 2012 — élimination de la pièce d'un cent* : https://www.budget.canada.ca/2012/themes/theme2-fra.html
