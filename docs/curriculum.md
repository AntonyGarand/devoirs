# Correspondance avec le programme (PFEQ — 2e année)

Toutes les matières : mathématique, français, anglais, univers social et culture et citoyenneté québécoise, sciences.
Les conceptions détaillées de chaque matière (portée, sources officielles, choix pédagogiques) sont dans [`docs/hld/`](hld/).
Les tableaux ci-dessous sont générés par `node tools/gen-curriculum.js`.


## Mathématique : repères du 1er cycle

Source principale : Ministère de l'Éducation du Québec, *Progression des apprentissages au primaire — Mathématique* (2009),
[PDF officiel](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf).
Document complémentaire : [Arithmétique — 1er cycle (MEQ, formation 2017-2018)](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/formations/Arithmetic-1er-cycle-math-primaire.pdf).

La 2e année termine le **1er cycle**. La PDA indique, pour chaque énoncé, si l'élève l'apprend avec l'enseignant·e, le fait seul
à la fin de l'année, ou le réutilise. Les repères visés ici sont ceux du 1er cycle :

- **Nombres naturels inférieurs à 1000** (lire, écrire, dénombrer, représenter, composer/décomposer, comparer, ordonner, pair/impair, droite numérique, approximation).
- **Fractions** à l'aide de matériel ou de schémas : parts égales, *demi, tiers, quart*.
- **Addition et soustraction** : sens (transformation — ajout, retrait —, réunion, comparaison), égalité, commutativité,
  répertoire mémorisé de 0 + 0 à 10 + 10 et soustractions correspondantes, calcul mental et calcul écrit par processus personnels (< 1000), terme manquant.
- **Multiplication et division** : *sens seulement* (disposition rectangulaire, addition répétée, partage, contenance) avec du matériel et des schémas.
- **Régularités** non numériques et numériques; ajouter des termes à une suite.
- **Géométrie** : relations spatiales, repérage dans un plan et sur un axe, solides (boule, cône, cube, cylindre, prisme, pyramide),
  figures planes (carré, rectangle, triangle, losange, cercle), lignes courbes/brisées, figures isométriques, frises par réflexion.
- **Mesure** : comparer des longueurs, unités non conventionnelles, puis m, dm, cm; temps (jour, heure, cycles quotidien, hebdomadaire, annuel).
- **Statistique** : questions d'enquête, collecte et organisation dans un tableau, diagramme à bandes et à pictogrammes.
- **Probabilité** : hasard, expériences, résultat *certain, possible, impossible*, prédiction vs résultat.

Volontairement exclus (2e et 3e cycles) : nombres décimaux, nombres entiers négatifs, tables de multiplication à mémoriser,
périmètre, aire, volume, masse, capacité, température, angles, plan cartésien à coordonnées, moyenne.

> Note : le PDF officiel utilise des flèches graphiques pour situer chaque énoncé par année. L'extraction texte ne les conserve pas;
> l'attribution au 1er cycle ci-dessus combine le texte des balises (« inférieurs à 1000 », vocabulaire par cycle) et les documents
> de formation du MEQ. En cas de doute, le cahier utilisé en classe fait foi.

<!-- tableaux -->

# 🔢 Mathématique (60 habiletés)

## 🔢 Les nombres

*Arithmétique — Sens et écriture des nombres naturels (< 1000) et fractions*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🐸 Compter par bonds (`compter-bonds`) | Nombres naturels A.1 a–c — compter, par bonds, à rebours | La grille de 100 |
| 📦 Compter une collection (`denombrer`) | Nombres naturels A.2 c–d, A.4 a–b — dénombrer des collections groupées | Les nombres jusqu'à 1000 |
| ✏️ Lire et écrire les nombres (`lire-ecrire`) | Nombres naturels A.3 — lire et écrire les nombres naturels | Les nombres jusqu'à 1000 |
| 🏠 Unités, dizaines, centaines (`valeur-position`) | Nombres naturels A.4 b–c — valeur de position (unités, dizaines, centaines) | Les nombres jusqu'à 1000 |
| 🧩 Composer et décomposer (`decomposer`) | Nombres naturels A.5, A.6 — composer, décomposer, expressions équivalentes | Les nombres jusqu'à 1000 |
| 🐊 Comparer des nombres (`comparer`) | Nombres naturels A.7 — comparer des nombres (, =) | Les nombres jusqu'à 1000 |
| 📶 Mettre en ordre (`ordonner`) | Nombres naturels A.8 — ordre croissant et décroissant | Les nombres jusqu'à 1000 |
| 👫 Pair ou impair ? (`pair-impair`) | Nombres naturels A.9, A.11 a — nombres pairs et impairs | La grille de 100 |
| 📍 Droite et grille de nombres (`situer-droite`) | Nombres naturels A.10 — droite numérique, grille de nombres | La grille de 100 |
| 👀 Estimer une quantité (`estimer`) | Nombres naturels A.13 — approximer la taille d'une collection | Les nombres jusqu'à 1000 |
| 🍕 Les fractions (`fractions`) | Fractions B.1–3 — partager un tout ou une collection en parts égales; demi, tiers, quart | Les fractions |

Pages Apprendre : **Les nombres jusqu'à 1000** (Centaines, dizaines, unités, échanges, comparer) · **La grille de 100** (Bonds de 2, 5, 10, pairs et impairs, régularités) · **Les fractions** (Demi, tiers, quart, parts égales)

## ➕ Les opérations

*Arithmétique — Sens des opérations et opérations sur les nombres*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| ➕ Additions jusqu'à 10 (`add-10`) | Opérations A.2 a–c — répertoire mémorisé de l'addition (0 + 0 à 10) | Les stratégies de calcul |
| 🧮 Additions jusqu'à 20 (`add-20`) | Opérations A.2 b–c — répertoire mémorisé de l'addition (jusqu'à 10 + 10), stratégies | Les stratégies de calcul |
| ➖ Soustractions jusqu'à 20 (`sub-20`) | Opérations A.2 a–c — répertoire mémorisé de la soustraction (soustractions correspondantes) | Les stratégies de calcul |
| 🔍 Le nombre caché (`terme-manquant`) | Opérations A.5 — déterminer un terme manquant (addition et soustraction) | Les stratégies de calcul |
| ⚖️ La balance (égalité) (`egalite`) | Sens des opérations A.4, A.5a — relation d'égalité, commutativité | Le sens des opérations |
| 💯 Calculer jusqu'à 100 (`calcul-100`) | Opérations A.3a, A.4a — processus personnels d'addition et de soustraction (< 100) | La droite numérique |
| 🏗️ Calculer avec des centaines (`calcul-1000`) | Opérations A.4a — processus personnels avec des nombres < 1000 (centaines, dizaines) | La droite numérique |
| 🧺 Groupes égaux (`groupes-egaux`) | Sens des opérations A.3a — sens de la multiplication (addition répétée, disposition rectangulaire) | Groupes égaux et partage |
| 🍪 Partager également (`partage`) | Sens des opérations A.3a — sens de la division (partage, groupement / contenance) | Groupes égaux et partage |
| 🔁 Suites et motifs (`suites`) | Opérations A.13, A.14 — régularités non numériques et numériques | Les régularités |

Pages Apprendre : **Les stratégies de calcul** (Doubles, faire 10, passer par 10, addition à trou…) · **Le sens des opérations** (Ajouter, enlever, réunir, comparer, et le signe =) · **La droite numérique** (Faire des bonds de 1, de 10, de 100) · **Groupes égaux et partage** (Rangées, addition répétée, partager également) · **Les régularités** (Motifs qui se répètent, suites de nombres)

## 🧩 Comprendre et résoudre

*Compétence 1 — Résoudre une situation-problème; Compétence 2 — Raisonner (compréhension de problèmes écrits)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📖 Petits problèmes (`problemes`) | Sens des opérations A.1, A.2 a–b — situations d'ajout, de retrait, de réunion, de comparaison, composition de transformations | Les types de problèmes |
| 🎬 Je comprends l'histoire (`pb-histoire`) | C1 — Décoder les éléments de la situation; Sens des opérations A.1 (ajout, retrait) | Ma démarche |
| 🖍️ Trouve la question (`pb-question`) | C1 — Décoder : déterminer la tâche (la question) | Ma démarche |
| ⭕ Les données (`pb-donnees`) | C1 — Décoder : dégager les données utiles | Ma démarche |
| 🗝️ Les mots des maths (`pb-mots`) | Vocabulaire du 1er cycle (plus, moins, de plus, de moins, somme, différence); C3 — communiquer | Les mots-clés… et leurs pièges |
| 🧱 Quel schéma ? (`pb-schema`) | C1 — Modéliser la situation; Sens des opérations A.2a, A.3a (représenter par un schéma) | Les types de problèmes |
| 🔀 Quelle opération ? (`pb-operation`) | Sens des opérations A.1 (choisir l'opération); C2 — choix des concepts et processus | Les mots-clés… et leurs pièges |
| 🕵️ Le début caché (`pb-inconnue`) | Sens des opérations A.2a (transformations, terme manquant); Opérations A.5 (équation à trou) | Les types de problèmes |
| 🧭 Ma démarche complète (`pb-resoudre`) | C1 — toutes les composantes (décoder, modéliser, appliquer, valider, communiquer) | Ma démarche |
| 🪜 Problèmes à deux étapes (`pb-deux-etapes`) | Sens des opérations A.2 b (composition de transformations positive ou négative), c (mixte) | Ma démarche |
| ✅ Ma réponse a-t-elle du sens ? (`pb-sens`) | Opérations A.1a (approximation du résultat); C1 — valider la solution (formatif) | Est-ce que ma réponse a du sens ? |
| 💬 La phrase-réponse (`pb-phrase`) | C1 — Partager l'information relative à la solution; C3 — communiquer | Ma démarche |
| ❓ Invente la question (`pb-inventer`) | Sens des opérations A.2 (traduire une équation par une situation, et vice versa); C1 — décoder | Ma démarche |
| ✖️ Les données inutiles (`pb-inutiles`) 🌟 | C1 — données superflues (2e cycle) : enrichissement | Ma démarche |

Pages Apprendre : **Ma démarche** (Lire, comprendre, planifier, calculer, vérifier, répondre) · **Les types de problèmes** (Ajouter, enlever, réunir, comparer, groupes égaux) · **Les mots-clés… et leurs pièges** (En tout, il reste, de plus, de moins, autant que, chacun) · **Est-ce que ma réponse a du sens ?** (Plus ou moins qu'au début ? Possible ? À l'envers !)

## 🔷 La géométrie

*Géométrie — Espace, solides, figures planes, frises*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🧭 Se repérer dans l'espace (`reperage`) | Géométrie — Espace A.1 : se repérer et repérer des objets dans l'espace (relations spatiales) | Se repérer |
| 🗺️ Le plan quadrillé (`plan-grille`) | Géométrie — Espace A.2 : repérer des objets et se repérer dans un plan (quadrillage, lettre et chiffre) | Se repérer |
| 🧊 Les solides (`solides`) | Géométrie — Solides B.1–B.3 : comparer et construire des solides; reconnaître et nommer boule, cône, cube, cylindre, prisme, pyramide | Les solides |
| 🎲 Faces et surfaces des solides (`solides-proprietes`) | Géométrie — Solides B.2, B.4 : surfaces planes et courbes; faces, base (initiation); solides qui roulent ou glissent | Les solides |
| 🔺 Les figures planes (`figures`) | Géométrie — Figures planes C.2–C.3 : identifier carré, rectangle, triangle, losange, cercle; décrire (côtés, sommets) | Les figures planes et les lignes |
| 〰️ Les lignes (`lignes`) | Géométrie — Figures planes C.1 : lignes courbes, lignes brisées, lignes ouvertes et fermées | Les figures planes et les lignes |
| 🦋 La symétrie (`symetrie`) | Géométrie — Frises et dallages D.1, D.3a : observer et produire des figures symétriques (axe de réflexion); figures isométriques | La symétrie et les frises |
| 🎏 Les frises (`frises`) | Géométrie — Frises et dallages D.2, D.3a : observer et produire des régularités avec des figures; frises par réflexion | La symétrie et les frises |

Pages Apprendre : **Les solides** (Boule, cône, cube, cylindre, prisme, pyramide) · **Les figures planes et les lignes** (Carré, rectangle, triangle, losange, cercle; lignes) · **La symétrie et les frises** (Axe de réflexion, miroir, frises) · **Se repérer** (Gauche, droite, dessus, dessous… et le plan)

## 📏 La mesure

*Mesure — Longueurs et temps*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📐 Comparer des longueurs (`comparer-longueurs`) | Mesure — Longueurs A.1 : comparer des longueurs | Mesurer des longueurs |
| 📎 Mesurer avec des trombones (`mesurer-non-conv`) | Mesure — Longueurs A.3 : mesurer à l'aide d'unités non conventionnelles | Mesurer des longueurs |
| 📏 Mesurer avec une règle (`mesurer-cm`) | Mesure — Longueurs A.4a : mesurer en centimètres avec une règle | Mesurer des longueurs |
| 📐 Les unités : cm, dm et m (`unites-longueur`) | Mesure — Longueurs A.4a et A.5 : unités conventionnelles (m, dm, cm), relations et estimation | Mesurer des longueurs |
| 🕒 Lire l'heure (`heure`) | Mesure — Temps G.1 : lire l'heure (heures, demies, quarts) sur une horloge à aiguilles | Lire l'heure |
| 📅 Le calendrier (`calendrier`) | Mesure — Temps : jour, semaine, mois, année, saisons; cycles quotidien, hebdomadaire et annuel | Le calendrier |
| ⏳ Les durées (`duree`) | Mesure — Temps G.1–G.2 : estimer et mesurer des durées; unités de temps | Lire l'heure |

Pages Apprendre : **Mesurer des longueurs** (Même unité, la règle, cm, dm et m) · **Lire l'heure** (Les aiguilles, et quart, et demie, ma journée) · **Le calendrier** (Jours, mois, saisons et fêtes du Québec)

## 📊 Statistique et probabilité

*Statistique et Probabilité*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📊 Lire un diagramme à bandes (`lire-diagramme`) | Statistique 3a — interpréter des données à l'aide d'un diagramme à bandes | Le vote de la classe |
| 🙂 Le diagramme à pictogrammes (`pictogramme`) | Statistique 3a — interpréter des données à l'aide d'un diagramme à pictogrammes | Le vote de la classe |
| 🧮 Traits et tableaux (`tableau-donnees`) | Statistique 2, 3a, 4a — collecter, organiser et représenter des données à l'aide de tableaux | Le vote de la classe |
| 📋 Mon enquête (`enquete`) | Statistique 1, 2 — formuler des questions d'enquête ; classifier des données | Le vote de la classe |
| 🎲 Certain, possible ou impossible ? (`certain-possible`) | Probabilité 1, 5a — variabilité des résultats ; prédire qualitativement (certain, possible, impossible) | Le hasard |
| 🎡 Expériences de hasard (`hasard-experience`) | Probabilité 4, 6, 7 — expérimenter le hasard ; distinguer prédiction et résultat ; colliger les résultats | Le hasard |

Pages Apprendre : **Le vote de la classe** (Enquête, tableau, diagramme à bandes et à pictogrammes) · **Le hasard** (Roulette, dé, billes : certain, possible ou impossible ?)

## 🧠 Défis et énigmes

*Enrichissement — Compétence 2 (raisonner); régularités, égalité, argent (2e cycle)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🧩 Mini-sudoku (`defi-sudoku`) 🌟 | Enrichissement — C2 : raisonner (déduction logique) |  |
| ⚖️ Les balances mystères (`defi-balances`) 🌟 | Enrichissement — égalité (Opérations A.4) et C2 : raisonner |  |
| 🕵️ Qui suis-je ? (`defi-qui-suis-je`) 🌟 | Nombres naturels < 100 (pair/impair, dizaines, unités) et C2 : raisonner |  |
| 💰 Compter l'argent (`argent-compter`) 🌟 | Enrichissement — argent (matériel de numération, Nombres naturels A.4c); notation décimale au 2e cycle |  |

# 📚 Français (22 habiletés)

## 👂 Les sons et les syllabes

*Lire C.1 b.iv, c.ii (décodage); Orthographe d'usage C.1 (correspondances graphème-phonème); jeux de sonorités (Lire A.3 j)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 👏 Je compte les syllabes (`fr-syllabes`) | Lire C.1 b.iv — décodage par syllabes (→ 1re, ★ 2e) | Ma carte des sons |
| 🎵 Les mots qui riment (`fr-rimes`) | Lire A.3 j — jeux de sonorités : la rime (→ 1re, → 2e) | Ma carte des sons |
| 👂 J'entends le son (`fr-entendre-son`) | Lire C.1 c.ii — correspondances lettres-sons (→ 1re, ★ 2e) | Ma carte des sons |
| 🔡 Les sons qui s'écrivent de plusieurs façons (`fr-sons-ecrits`) | Orthographe d'usage C.1 a–b (→ 1re, ★ 2e); C.3 a — c/ç, g/ge, m devant b et p (→ 2e, défi) | Ma carte des sons |

Pages Apprendre : **Ma carte des sons** (Les voyelles, les sons qui s'écrivent de plusieurs façons, les syllabes.)

## 📖 Je lis et je comprends

*Lire A (textes), C.1 (identification des mots), C.2 (gestion de la compréhension)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 👀 Je lis des mots (`fr-lire-mots`) | Lire C.1 a.ii (mots fréquents), b.iv (décodage) — → 1re, ★ 2e | Lire comme un détective |
| 🖼️ Je lis une phrase (`fr-lire-phrases`) | Lire C.2.2 a (la phrase), d.i (ce dont on parle) — → 1re, ★ 2e; négation : Lire B.1 a.i | Lire comme un détective |
| 🔍 Je comprends un texte (`fr-comprendre-texte`) | Lire A.3 c.i, d.i (personnages, temps, lieux); C.2.3 c (mots de substitution), g (inférence, → 2e); C.1 c.iii–iv (mot nouveau) | Lire comme un détective |
| 🔢 Début, milieu, fin (`fr-ordre-histoire`) | Lire A.2 a (début, milieu, fin d'un récit, ★ 2e); A.4 c.ii (marqueurs d'abord, ensuite, enfin) | Lire comme un détective |

Pages Apprendre : **Lire comme un détective** (Mes trucs quand je bloque sur un mot, et les questions qui, quoi, où, quand.)

## ✏️ J'écris les mots

*Orthographe d'usage A–C (mots de la Liste orthographique du 1er cycle, lettres muettes, majuscule, apostrophe)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🎧 Ma dictée de mots (`fr-dictee`) | Orthographe d'usage A.1 — mots de la Liste orthographique du 1er cycle (→ 1re, ★ 2e) | Bien écrire un mot |
| 🔎 Le mot bien écrit (`fr-bonne-orthographe`) | Orthographe d'usage A.1, C.1 a (graphies d'un même son) | Bien écrire un mot |
| 🤫 Les lettres muettes (`fr-lettres-muettes`) | Orthographe d'usage C.2 a, b.i–ii — lettres muettes justifiées par le féminin ou la famille (→ 1re, → 2e) | Bien écrire un mot |
| 🅰️ Majuscule et apostrophe (`fr-majuscule-apostrophe`) | Orthographe d'usage C.4 a.i (majuscule des noms propres), C.5 a.i (élision le, la, je, ne) — → 1re, ★ 2e | Bien écrire un mot |
| 📝 Ma liste de la semaine (`fr-ma-liste`) | Orthographe d'usage A.1 — mots à l'étude (pistes : mémoriser des mots) | Étudier ma liste |

Pages Apprendre : **Bien écrire un mot** (Regarde, dis, cache, écris, vérifie. Les lettres muettes, la majuscule et l'apostrophe.) · **Étudier ma liste** (Les mots de ta liste de la semaine : cartes-éclair et petite dictée.)

## 🧩 Les classes de mots et les accords

*Accords A (classes de mots), D (pluriel, féminin), E (accords dans le groupe du nom)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🏷️ Nom, déterminant, adjectif, verbe (`fr-classes-mots`) | Accords A.1 a.i, b.i (nom); A.2 a, e (déterminant); A.3 b.ii (adjectif, → 2e); A.4 b.i (verbe, → 2e) | Les sortes de mots |
| 👦 Masculin, féminin, singulier, pluriel (`fr-genre-nombre`) | Accords A.1 a.iii–iv (genre et nombre du nom); D.1 a.i (+ s, ★ 2e); D.1 a.ii–b, D.5 a (x, aux, féminin + e, → 2e) | Masculin, féminin, singulier, pluriel |
| 🔗 Les accords dans le groupe du nom (`fr-accords-gn`) | Accords E.1 — accord du déterminant (★ 2e); E.2 — accord de l'adjectif (→ 2e) | Masculin, féminin, singulier, pluriel |

Pages Apprendre : **Les sortes de mots** (Nom, déterminant, adjectif, verbe : les trucs pour les reconnaître.) · **Masculin, féminin, singulier, pluriel** (Un ou une ? Un ou plusieurs ? Le nom donne ses marques.)

## 💬 La phrase

*Syntaxe et ponctuation A.1, B.1, D.1*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| ✅ Majuscule et point (`fr-phrase-ponctuation`) | Syntaxe B.1 a.i, b (majuscule et point, → 1re, ★ 2e); a.ii–iii (? et !, → 2e); Lire C.2.2 a | La phrase |
| 🧱 Je construis une phrase (`fr-ordre-mots`) | Syntaxe A.1 b–d — mots dans le bon ordre, phrase qui a du sens (→ 1re, ★ 2e); D.1 a — négation (→ 2e) | La phrase |

Pages Apprendre : **La phrase** (Majuscule, point, mots dans l'ordre, ? et !, ne… pas.)

## 🏃 Les verbes au présent

*Conjugaison C.1 (formes mémorisées de aimer, aller, avoir, dire, être, faire); Accords A.5 (pronoms de conjugaison)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| ⭐ Être et avoir au présent (`fr-etre-avoir`) | Conjugaison C.1 — formes mémorisées de être et avoir à l'indicatif présent (→ 1re, ★ 2e); Accords A.5 a–b (pronoms) | Être, avoir et les verbes fréquents |
| 🚶 Aimer, aller, dire, faire (`fr-verbes-frequents`) | Conjugaison C.1 — formes mémorisées de aimer, aller, dire, faire à l'indicatif présent (→ 1re, ★ 2e) | Être, avoir et les verbes fréquents |

Pages Apprendre : **Être, avoir et les verbes fréquents** (Je suis, j'ai, je vais, je fais… avec une comptine pour chaque verbe.)

## 🔤 L'alphabet et les familles de mots

*Orthographe d'usage B.1–B.3 (alphabet); Lexique B.1 (familles de mots)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🔤 L'ordre alphabétique (`fr-alphabet`) | Orthographe d'usage B.1–B.3 (lettres, voyelles et consonnes, ordre alphabétique — ★ 1re, réinvesti); Lexique C.2 (1re lettre seulement) | L'alphabet et les familles |
| 👪 Les familles de mots (`fr-familles-mots`) | Lexique B.1 — familles de mots (→ 2e); Orthographe d'usage C.2 b.i (lettre muette justifiée par la famille) | L'alphabet et les familles |

Pages Apprendre : **L'alphabet et les familles** (Les 26 lettres, voyelles et consonnes, ranger des mots, familles de mots.)

# 🗣️ Anglais (16 habiletés)

## 🍎 Mes mots en anglais

*ALS 1er cycle — C2 Communiquer oralement : Contextual Language, repertoire (objects, people, description); décoder des messages*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 👂 Écoute et touche l'image (`en-ecoute-image`) | ALS 1er cycle — C2 : décoder des messages (repertoire : objects, people) | Mes premiers mots |
| 🎨 Les couleurs (`en-couleurs`) | ALS 1er cycle — Repertoire : description (« Big blue pants ») | Mes premiers mots |
| 🔢 Les nombres en anglais (`en-nombres`) | ALS 1er cycle — Repertoire; routines (counting) | Mes premiers mots |
| 🎧 Écoute plusieurs mots (`en-ecoute-liste`) | ALS 1er cycle — Stratégie : attention dirigée; C2 décoder des messages | Mes premiers mots |
| 🔗 Le mot et l'image (`en-associer`) | ALS 1er cycle — Repertoire; stratégie : utiliser les ressources (images) | Mes premiers mots |
| 🗂️ Range les mots (`en-trier`) | ALS 1er cycle — Repertoire (catégories); stratégie : inférence | Mes premiers mots |

Pages Apprendre : **Mes premiers mots** (Couleurs, nombres, animaux, nourriture, vêtements…)

## 🙋 J'écoute et je bouge

*ALS 1er cycle — Contextual Language : routines (instructions, action words); stratégie : réponse physique (TPR)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 👃 Touche ton nez ! (`en-corps`) | ALS 1er cycle — Contextual Language : action words; stratégie : réponse physique (TPR) | Head, nose, toes ! |
| 🔎 Trouve dans l'image (`en-trouve`) | ALS 1er cycle — Contextual Language : instructions; C1 éléments clés; description | En classe d'anglais |
| 🙋 Jacques a dit… en anglais (`en-actions`) | ALS 1er cycle — Contextual Language : routines (instructions, action words : Stand up. Come here.) | En classe d'anglais |

Pages Apprendre : **Head, nose, toes !** (Les parties du corps et le chant « Touch your head ») · **En classe d'anglais** (Les consignes, les encouragements et mes besoins)

## 💬 Parler en anglais

*ALS 1er cycle — C2 Communiquer oralement : courtesy, needs, ideas, pair work, common inquiries*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🤔 Quand dit-on ça ? (`en-reagir`) | ALS 1er cycle — C2 : réagir à des messages (courtesy, needs) | Hello ! Dire bonjour |
| 💬 Qu'est-ce que tu dis ? (`en-que-dire`) | ALS 1er cycle — C2 : amorcer des messages (courtesy, needs, pair work) | Hello ! Dire bonjour |
| ❓ Réponds à la question (`en-questions`) | ALS 1er cycle — Contextual Language : routines (common inquiries : What's your name? How are you? What colour is it?) | Comment ça va ? Quel temps fait-il ? |
| 😀 Comment ça va ? (`en-sentiments`) | ALS 1er cycle — Contextual Language : ideas, feelings (« Happy, today. ») | Comment ça va ? Quel temps fait-il ? |

Pages Apprendre : **Hello ! Dire bonjour** (Saluer, être poli, un petit dialogue) · **Comment ça va ? Quel temps fait-il ?** (Les sentiments, la météo et les saisons)

## 📖 Histoires et comptines

*ALS 1er cycle — C1 Agir sur sa compréhension de textes : éléments clés, événements, chansons et comptines*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📖 Écoute une histoire (`en-histoire`) | ALS 1er cycle — C1 : éléments clés (personnages, objets, lieux) et événements d'une histoire entendue | L'heure du conte |
| 🔢 Remets l'histoire en ordre (`en-histoire-ordre`) | ALS 1er cycle — C1 : événements et séquence d'une histoire (redire l'histoire) | L'heure du conte |
| 🎵 Ça rime ! (`en-rimes`) | ALS 1er cycle — C1 : rythme, chansons et comptines (rimes) | Comptines et rimes |

Pages Apprendre : **L'heure du conte** (De petites histoires à écouter, avec des images) · **Comptines et rimes** (Des comptines originales et des mots qui riment)

# 🗺️ Univers social (14 habiletés)

## 💛 Moi et les autres

*CCQ — Connaissance de soi (émotions, besoins); Relations entre les individus : rôles et responsabilités, civilité*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 😊 Les émotions (`us-emotions`) | CCQ — Compétence, Considérer des émotions : reconnaître des émotions, associer des réactions, identifier des déclencheurs | Vivre ensemble |
| 🍎 Mes besoins (`us-besoins`) | CCQ 1re (révisé) — Besoins individuels : types de besoins, réponses aux besoins · GHEC — besoins des groupes | Vivre ensemble |
| 🙏 Les gestes de civilité (`us-civilite`) | CCQ 2e — Civilité : gestes envers les personnes et l'environnement; effets sur les relations | Vivre ensemble |
| 📋 Règles et responsabilités (`us-regles`) | CCQ 2e — Rôles et responsabilités; règles de la classe et de la cour · GHEC 2.4 b, A.4 b | Vivre ensemble |
| 🤝 Régler un conflit (`us-conflits`) | CCQ — Appliquer les conditions favorables à l'interaction; Civilité (pacification) | Vivre ensemble |

Pages Apprendre : **Vivre ensemble** (Émotions, besoins, gestes de civilité, régler un conflit)

## 🏘️ Ma famille et ma communauté

*CCQ — Relations (diversité des familles, relations intergénérationnelles); Rapports aux autres êtres vivants · GHEC — Groupes et éléments humains (2.3, 2.4, A.2, A.4)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 👨‍👩‍👧 Les familles (`us-familles`) | CCQ 1re–2e — Diversité des familles québécoises; relations intergénérationnelles · GHEC A.2.1 a–c | Ma famille et ma communauté |
| 🏪 Les lieux et les métiers du quartier (`us-lieux-metiers`) | GHEC 2.3 a–c (éléments économiques, besoins satisfaits, transports), 2.4 a (hôtel de ville), A.4 a–b | Ma famille et ma communauté |
| 🐕 Les animaux dans nos vies (`us-animaux`) | CCQ 2e — Rôles des autres êtres vivants; responsabilités, soin des animaux, bien-être animal | Ma famille et ma communauté |

Pages Apprendre : **Ma famille et ma communauté** (Toutes sortes de familles, les mots de la parenté, le quartier, les animaux)

## 🧭 Se repérer

*GHEC — Localisation (A.1 a–b), éléments naturels (A.3), techniques : lire un plan, une légende, les points cardinaux*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🗺️ Lire un plan (`us-plan`) | GHEC A.1 a–b; Techniques 1 a, b, d, e (lire le titre, décoder la légende, points cardinaux, repères) | Lire un plan |
| 🏞️ Les paysages (`us-paysages`) | GHEC A.3 (relief, climat, hydrographie, ressources); Explorer des paysages | Lire un plan |

Pages Apprendre : **Lire un plan** (Vue d'oiseau, titre, légende, rose des vents, paysages)

## ⚜️ Le Québec et ses fêtes

*CCQ — Célébrations (traditions, repas, cérémonies religieuses et séculières) · Enrichissement : emblèmes du Québec*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🎉 Fêtes et traditions (`us-fetes`) | CCQ 2e — Célébrations : traditions (fêtes, repas traditionnels), cérémonies religieuses et séculières | Le Québec et ses fêtes |
| ⚜️ Les symboles du Québec (`us-emblemes`) 🌟 | Enrichissement — Loi sur le drapeau et les emblèmes du Québec (quebec.ca) | Le Québec et ses fêtes |

Pages Apprendre : **Le Québec et ses fêtes** (Fêtes et traditions, fêtes de partout, emblèmes du Québec, saisons)

## ⏳ Avant et maintenant

*GHEC — Hier et aujourd'hui (changements, ~100 ans); A.1 d–f : ligne du temps, âges de la vie · CCQ — Étapes de la vie depuis la naissance*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📻 Avant et maintenant (`us-avant-maintenant`) | GHEC — Changement A a–c (objets d'usage courant, activités, transports); Diversité A.1 a–b | Avant et maintenant |
| 📏 La ligne du temps de la vie (`us-ligne-temps`) | GHEC A.1 d–f, Techniques 3 (interpréter une ligne du temps) · CCQ 2e — Étapes de la vie depuis la naissance | Avant et maintenant |

Pages Apprendre : **Avant et maintenant** (Ligne du temps, âges de la vie, la vie d'il y a 100 ans)

# 🔬 Sciences (16 habiletés)

## 🌱 Le vivant

*Univers vivant (UV A, B, C, D) + Éducation physique et à la santé (saines habitudes)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🏭 Naturel ou fabriqué ? (`sc-naturel-fabrique`) | Univers vivant D.2.a — utilisation du vivant (aliments, vêtements, bois); D.4.a — techniques de production d'aliments (beurre, pain); Univers matériel D.1.b — besoin à l'origine d'un objet; attente de fin de cycle : distinguer le monde naturel des objets fabriqués |  |
| 💧 Ce dont les vivants ont besoin (`sc-besoins`) | Univers vivant A.3.a — décrire les besoins essentiels d'une plante (eau, air, lumière, sels minéraux) (1er cycle); enrichissement : A.1.a — besoins essentiels des animaux (2e cycle) | Le jardin de Castor |
| 🌻 Les parties d'une plante (`sc-plante-parties`) 🌟 | Enrichissement — PDA Univers vivant A.2.e–f : parties d'une plante et leurs fonctions (2e cycle) | Le jardin de Castor |
| 🔄 Les cycles de vie (`sc-cycles-vie`) 🌟 | Enrichissement — PDA Univers vivant A.3.b–c : stades de croissance d'une plante à fleurs et d'animaux (2e cycle); A.3.d métamorphose (3e cycle) — séquence seulement | Ça grandit ! |
| 🍽️ Que mange cet animal ? (`sc-animaux-alimentation`) | Univers vivant B.1.a — comparer l'alimentation d'animaux domestiques et d'animaux sauvages (1er cycle); enrichissement en lvl 2 : B.1.c — régime alimentaire herbivore, carnivore, omnivore (2e cycle) | Les animaux du Québec |
| 🧥 Comment l'animal s'adapte (`sc-animaux-adaptation`) | Univers vivant D.1.a–b — décrire des caractéristiques physiques et des comportements qui montrent l'adaptation d'un animal à son milieu (1er cycle) | Les animaux du Québec |
| 🏞️ Où vit-il ? Comment bouge-t-il ? (`sc-animaux-habitats`) 🌟 | Enrichissement — PDA Univers vivant D.1.c : habitats; C.1.a : modes de déplacement (2e cycle) | Les animaux du Québec |
| 🧍 Mon corps et mes habitudes (`sc-corps`) | Univers vivant A.2.a — décrire les fonctions de parties de son anatomie (membres, tête, cœur, estomac) (1er cycle); Éducation physique et à la santé — adopter un mode de vie sain et actif (intégration) | Mon corps, mes sens |
| 👀 Mes cinq sens (`sc-sens`) 🌟 | Enrichissement — PDA Univers vivant A.2.h : fonction sensorielle (2e cycle); « explorer à l'aide des sens » : stratégie dès le 1er cycle | Mon corps, mes sens |

Pages Apprendre : **Le jardin de Castor** (Fais pousser une plante : eau, lumière… et observe !) · **Ça grandit !** (Le cycle de vie du haricot, de la grenouille, du monarque et de la poule) · **Les animaux du Québec** (Où ils vivent, ce qu'ils mangent, comment ils passent l'hiver) · **Mon corps, mes sens** (Les parties du corps, les 5 sens et les saines habitudes)

## 🧲 La matière et les objets

*Univers matériel (UM A, C, D)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🧽 Les propriétés des objets (`sc-proprietes`) | Univers matériel A.1.a–d — classer des objets selon leurs propriétés (texture…), absorption, perméabilité, transparence (1er cycle); enrichissement en lvl 2 : A.1.k — matériaux qui composent un objet (3e cycle) |  |
| 🧊 L'eau : solide, liquide, gaz (`sc-etats-eau`) | Univers matériel A.3.a–d — états de la matière, changements d'état de l'eau; A.4.a — conservation de la matière; Terre et espace A.3.b — eau douce et eau salée (1er cycle); enrichissement : A.3.c — cycle de l'eau (2e cycle) | L'eau qui change |
| 🛟 Flotte ou coule ? (`sc-flotte-coule`) 🌟 | Enrichissement — PDA Univers matériel A.1.h–i : flottabilité (2e–3e cycle), qualitatif seulement | L'eau qui change |
| 🧲 Les aimants (`sc-aimants`) | Univers matériel C.2.a–b — décrire l'effet d'un aimant sur différents objets; attraction et répulsion; situations d'utilisation (1er cycle) | Comme une scientifique |

Pages Apprendre : **L'eau qui change** (Glace, eau, vapeur… et flotte ou coule ?)

## 🌍 La Terre et le ciel

*Terre et espace (TE A, C, D)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| ☀️ Soleil, Terre, Lune et ombres (`sc-soleil-terre-lune`) | Terre et espace D.1.a — position apparente du Soleil et longueur de l'ombre; D.2.a — Soleil (étoile), Terre (planète), Lune (satellite naturel) (1er cycle); enrichissement en lvl 2 : C.1.a — jour et nuit, rotation de la Terre (2e cycle) | Le jour, la nuit et les ombres |
| 🍂 Saisons et météo (`sc-saisons-meteo`) | Terre et espace D.4.a–b — changements au fil des saisons (température, luminosité, précipitations), sensations de chaud et de froid; A.3.a — précipitations (pluie, neige, grêle, pluie verglaçante) (1er cycle) | Le jour, la nuit et les ombres |

Pages Apprendre : **Le jour, la nuit et les ombres** (La Terre tourne, l'ombre change, les saisons passent)

## 🔎 Démarche scientifique

*Stratégies d'exploration (PDA p. 14); compétence du 1er cycle « Explorer le monde de la science et de la technologie »*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🔎 Comme une scientifique (`sc-demarche`) | Stratégies d'exploration (PDA p. 14) : anticiper ses résultats, explorer, comparer, consigner; compétence du 1er cycle « Explorer le monde de la science et de la technologie » | Comme une scientifique |

Pages Apprendre : **Comme une scientifique** (Se questionner, prédire, observer… avec des aimants !)

# 🎵 Musique (12 habiletés)

## 🔊 Les sons

*Langage musical (A.1 intensité, A.2 durée, A.3 hauteur, A.5 qualité du son); représentation graphique (B.2 code non traditionnel)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 📢 Fort ou doux (`mu-fort-doux`) | Langage musical A.1.a — sons forts et doux (1er cycle); B.2.a — symboles fort / doux (code non traditionnel); lvl 2 : A.1.b crescendo / decrescendo (2e cycle, enrichissement) | Les secrets des sons |
| 🐦 Aigu ou grave (`mu-aigu-grave`) | Langage musical A.3.b — registres aigu et grave; organisation mélodique G.4.a — série de sons ascendants, descendants, répétés (1er cycle); B.2.a — symboles aigu / grave, ascendant / descendant | Les secrets des sons |
| 〰️ Long ou court (`mu-long-court`) | Langage musical A.2.a — durée : long, très long, court, très court, silence (code non traditionnel); B.2.a — symboles de durée (1er cycle) | Les secrets des sons |
| 🔔 Sec ou résonnant (`mu-sec-resonnant`) | Langage musical A.5.a — qualités du son : sec, résonnant (1er cycle); B.2.a — symboles sec / résonnant | Les instruments de la classe |

Pages Apprendre : **Les secrets des sons** (Fort ou doux, aigu ou grave, long ou court)

## 🥁 Rythme et tempo

*Durée (A.2 noire, croches, silence); organisation rythmique (G.3 pulsation); tempo (G.2 lent, rapide); code traditionnel (B.1)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🐇 Rapide ou lent (`mu-vite-lent`) | Structures G.2.a — tempos lent et rapide (1er cycle); lvl 2 : accelerando / rallentando (G.2.c, 3e cycle, enrichissement : « accélère / ralentit ») | Ta, ti-ti, chut ! |
| 💓 La pulsation (`mu-pulsation`) | Structures G.3.a — organisation rythmique : la pulsation (1er cycle); Règles de groupe E.b — directives indiquant la pulsation | Ta, ti-ti, chut ! |
| 🎶 Ta, ti-ti, chut ! (`mu-ta-titi`) | Durée A.2.a — noire, deux croches, silence; organisation rythmique G.3.a; code traditionnel B.1.a — symboles de durée (1er cycle); lvl 2 : la blanche (A.2.b, 2e cycle, enrichissement) | Ta, ti-ti, chut ! |

Pages Apprendre : **Ta, ti-ti, chut !** (La pulsation, le tempo et les rythmes)

## 🪇 Instruments et sources sonores

*Sources sonores (C.1 voix et corps, C.2 instruments de percussion, C.3 objets de bois et de métal); timbre (A.4.a)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🪇 Les instruments de la classe (`mu-instruments`) | Sources sonores C.2.a — nommer des instruments de percussion; C.3.a — objets de bois et de métal; Timbre A.4.a — instruments de percussion de la classe (1er cycle) | Les instruments de la classe |
| 👏 La voix et le corps (`mu-voix-corps`) | Sources sonores C.1.a — voix chantée, effets vocaux, percussions corporelles (1er cycle) | Les instruments de la classe |

Pages Apprendre : **Les instruments de la classe** (Bois, métal, peau; sec ou résonnant; le corps et la voix)

## 🎹 Do, ré, mi

*Hauteur (A.3 noms des sons de la gamme : do, ré, mi…); organisation mélodique (G.4 sons ascendants, descendants)*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🎹 Do, ré, mi (`mu-do-re-mi`) | Langage musical A.3 — hauteur : nommer les sons de la gamme (do, ré, mi…) à l'aide du piano; G.4.a — sons ascendants (vers la droite, plus aigu) | Le piano do-ré-mi |

Pages Apprendre : **Le piano do-ré-mi** (La gamme, les touches et de petites chansons)

## 🎧 Écouter et inventer

*Structures (G.1 forme A-B, G.4 organisation mélodique); procédés de composition (F.a); compétence 3 « Apprécier »*

| Habileté | Référence au programme | Page Apprendre |
|---|---|---|
| 🧩 Pareil ou différent ? (forme A-B) (`mu-forme`) | Structures G.1.a — forme personnelle et forme A-B; procédés de composition F.a — contraste, reproduction sonore (1er cycle); lvl 2 : forme A-B-A (G.1.b, 2e cycle, enrichissement) | Écouter une musique |
| 😊 Ce que la musique exprime (`mu-caractere`) | Compétence 3 — Apprécier des œuvres musicales : exprimer ce qu'on ressent et le justifier avec le vocabulaire (tempo, nuances, registre) (1er cycle) | Écouter une musique |

Pages Apprendre : **Écouter une musique** (Les parties A et B, question-réponse, ce que la musique exprime)

🌟 = enrichissement (au-delà du programme de 2e année, exclu de la révision automatique) · 💬 = carte de discussion non notée.
