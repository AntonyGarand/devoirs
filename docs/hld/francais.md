# HLD — Français, langue d'enseignement (2e année, fin du 1er cycle)

> Document de conception (haut niveau, aucun code). Il s'appuie sur [`docs/framework.md`](../framework.md) : modèle
> matière → domaine → habileté → page Apprendre, les 12 formats, les composants `M.ui`, les règles de style et de pédagogie.
> Tout besoin non couvert est décrit comme **manque du cadre** (§ 7), générique et réutilisable, jamais comme une variante locale.
> Voir aussi [`anglais.md`](anglais.md) et [`univers-social.md`](univers-social.md) : plusieurs manques sont communs, on les renvoie
> à la même spécification.

Matière : `francais`, 📚, couleur `--subj-francais` (#ef476f), fond doux #ffe1e8. Identifiants préfixés `fr-`.
Un même identifiant n'est jamais réutilisé entre domaine, habileté et page Apprendre (les registres sont séparés, mais on évite la confusion).

---

## 1. Portée et alignement sur le programme

### 1.1 Ce que disent les documents officiels (vérifié)

- **Programme en vigueur en 2026-2027** : PFEQ 2001 + _Progression des apprentissages (PDA) — Français, langue d'enseignement_
  (24 août 2009; volet « Communication orale » ajouté le 22 août 2011). Chaque énoncé porte une flèche (→ l'élève apprend avec
  l'enseignant·e), une étoile (★ l'élève le fait seul à la fin de l'année) ou une case bleue (réinvestissement), par année.
  Les attributions par année ci-dessous ont été **lues sur les pages rendues du PDF** (les flèches sont des images que l'extraction
  texte perd).
- **Programme actualisé** : disponible à titre informatif en 2026-2027, **obligatoire dès la rentrée 2027-2028**; la **Liste
  orthographique** devient alors _prescrite_ (maintenant consultable sur Usito). Nouveautés pertinentes : constituants de la phrase
  (sujet, prédicat, complément de phrase) **dès le 1er cycle**; « l'importance du décodage est mise en valeur »; au 1er cycle,
  « décodage, correspondances graphèmes-phonèmes et sons à enseigner » sont précisés; l'infinitif des verbes modèles est vu dès la 3e année.
  → La V1 vise la PDA 2009 (l'enfant est en 2e année en 2026-2027); les ids restent stables pour une mise à jour `pda` en 2027 (§ 9, J6).
- **Liste orthographique** (document de référence MEQ, révisé 2019) : 500 mots visés au 1er cycle (répartition suggérée 200 en 1re,
  300 en 2e); la liste en fournit **194 (1re) + 201 (2e) = 395**, l'enseignant·e ajoute les autres (thèmes de classe). Les verbes
  _aimer, aller, avoir, dire, être, faire_ y figurent **avec leurs formes de l'indicatif présent**. Les formes entre parenthèses
  (ex. : _ils, elles, cet, ces_) ne sont pas exigées en écriture autonome à la fin de l'année.

### 1.2 Couvert / partiellement / exclu en 2e année

Notation PDA : _Section, Connaissances, lettre.numéro.lettre_ (page du PDF). « → ★ » = flèche en 1re, étoile en 2e.

| Thème                                                                                               | 1re   | 2e        | Dans le site                                                                                                                                                                               | Référence PDA                                                        |
| --------------------------------------------------------------------------------------------------- | ----- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Lettres, voyelles/consonnes, ordre alphabétique des lettres                                         | ★     | réinvesti | ✅ révision (`fr-alphabet`)                                                                                                                                                                | Orthographe d'usage B.1–B.3 (p. 15)                                  |
| Accents, cédille, trait d'union, apostrophe (identifier)                                            | →     | ★         | ✅                                                                                                                                                                                         | Orthographe d'usage B.4 (p. 15)                                      |
| Correspondances graphème-phonème (_o/au/eau_, _an/en_…)                                             | →     | ★         | ✅ cœur                                                                                                                                                                                    | Orthographe d'usage C.1 a–b (p. 15)                                  |
| Lettres muettes (repérer, justifier par la famille, le genre, le nombre)                            | →     | →         | ✅ guidé (lvl 1–2)                                                                                                                                                                         | Orthographe d'usage C.2 a, b.i–ii (p. 15)                            |
| Règles de position _c/ç, g/gu/ge, m devant b, p, m_                                                 | →     | →         | ✅ défi (lvl 2)                                                                                                                                                                            | Orthographe d'usage C.3 a (p. 15)                                    |
| Majuscule des noms propres de personnes/animaux                                                     | →     | ★         | ✅                                                                                                                                                                                         | Orthographe d'usage C.4 a.i (p. 16)                                  |
| Élision _le, la, je, ne_ → _l', j', n'_                                                             | →     | ★         | ✅                                                                                                                                                                                         | Orthographe d'usage C.5 a.i (p. 16)                                  |
| ≈ 500 mots du 1er cycle (orthographe lexicale)                                                      | →     | ★         | ✅ cœur (dictée)                                                                                                                                                                           | Orthographe d'usage A.1 (p. 15)                                      |
| Nom (déterminant devant, genre, nombre, commun/propre)                                              | →     | ★         | ✅                                                                                                                                                                                         | Accords A.1 a.i–vi (p. 29)                                           |
| Déterminant (identifier, receveur d'accord)                                                         | →     | ★         | ✅                                                                                                                                                                                         | Accords A.2 a–b, e (p. 29–30)                                        |
| Adjectif (position, receveur d'accord du nom)                                                       | —     | →         | ✅ guidé (lvl 1–2)                                                                                                                                                                         | Accords A.3 a.i–iii (p. 30)                                          |
| Verbe (se conjugue, encadrement _ne… pas_, pronom devant)                                           | — / → | →         | ✅ guidé                                                                                                                                                                                   | Accords A.4 a.i–iv, b.i (p. 30)                                      |
| Pronoms de conjugaison _je, tu, il, elle, on, nous, vous, ils, elles_                               | →     | ★         | ✅                                                                                                                                                                                         | Accords A.5 a–b (p. 31)                                              |
| Pluriel : + _s_ au nom                                                                              | →     | ★         | ✅                                                                                                                                                                                         | Accords D.1 a.i (p. 32)                                              |
| Pluriel : + _s_ à l'adjectif; + _x_ (_-eau, -eu_); _-al/-aux_                                       | —     | →         | ✅ défi (lvl 2)                                                                                                                                                                            | Accords D.1 a.ii, b (p. 32–33)                                       |
| Féminin : + _e_; cas particuliers fréquents                                                         | —     | →         | ✅ défi (lvl 2)                                                                                                                                                                            | Accords D.5 a, D.6 (p. 33)                                           |
| Accord du déterminant avec le nom                                                                   | →     | ★         | ✅ cœur                                                                                                                                                                                    | Accords E.1 (p. 33)                                                  |
| Accord de l'adjectif avec le nom                                                                    | —     | →         | ✅ guidé (lvl 2)                                                                                                                                                                           | Accords E.2 (p. 33)                                                  |
| Accord du verbe avec le sujet                                                                       | —     | —         | ❌ (3e année)                                                                                                                                                                              | Accords F.1 (p. 33)                                                  |
| Phrase : sens, tous les mots, **ordre des mots**, un verbe conjugué                                 | →     | ★         | ✅                                                                                                                                                                                         | Syntaxe A.1 a–d (p. 42)                                              |
| Majuscule au début, point à la fin                                                                  | →     | ★         | ✅ cœur                                                                                                                                                                                    | Syntaxe B.1 a.i, b (p. 43)                                           |
| Point d'interrogation, point d'exclamation                                                          | →     | →         | ✅ guidé                                                                                                                                                                                   | Syntaxe B.1 a.ii–iii (p. 43)                                         |
| Négation _ne/n'… pas_                                                                               | →     | →         | ✅ guidé (lvl 2)                                                                                                                                                                           | Syntaxe D.1 a (p. 43); Lire B.1 a.i ★ 2e (p. 71)                     |
| Formes mémorisées de _aimer, aller, avoir, dire, être, faire_ à l'indicatif présent, avec le pronom | →     | ★         | ✅ cœur                                                                                                                                                                                    | Conjugaison C.1 (p. 22)                                              |
| Système des verbes en _-er_ (radical/terminaison, verbe modèle _aimer_)                             | —     | —         | ❌ (3e–4e)                                                                                                                                                                                 | Conjugaison B, C.2 a.i (p. 22)                                       |
| Infinitif (nommer, distinguer des formes conjuguées)                                                | —     | —         | ❌ (3e)                                                                                                                                                                                    | Conjugaison A.1–2 (p. 22)                                            |
| Familles de mots (lien de sens)                                                                     | —     | →         | ✅ guidé                                                                                                                                                                                   | Lexique B.1 (p. 8)                                                   |
| Synonymes / antonymes                                                                               | —     | —         | ❌ en cœur (→ 3e / 4e); enrichissement plus tard                                                                                                                                           | Lexique B.3 a–b (p. 8)                                               |
| Trouver un mot dans le dictionnaire (ordre alphabétique des mots)                                   | —     | —         | ⚠️ seulement par la 1re lettre (lvl 1–2)                                                                                                                                                   | Lexique C.2 (→ 3e, p. 9)                                             |
| Lecture : décodage, mots fréquents, indices (illustration, contexte, 1re syllabe)                   | →     | ★         | ✅ cœur                                                                                                                                                                                    | Lire C.1 a–c (p. 71)                                                 |
| Lecture : majuscule et point délimitent la phrase; ce dont on parle                                 | →     | ★ / →     | ✅                                                                                                                                                                                         | Lire C.2.2 a, d.i (p. 72)                                            |
| Récit : personnages (aspect physique), temps et lieux explicites, début/milieu/fin                  | →     | → / ★     | ✅ cœur                                                                                                                                                                                    | Lire A.3 c.i, d.i; A.2 a (p. 69–70)                                  |
| Mots de substitution (pronoms qui reprennent)                                                       | →     | →         | ✅ guidé (lvl 1–2)                                                                                                                                                                         | Lire C.2.3 c; A.4 d.i (p. 70, 73)                                    |
| Inférence logique / pragmatique simple (sentiment, cause)                                           | —     | →         | ✅ guidé (1 question par texte)                                                                                                                                                            | Lire C.2.3 g.i–ii (p. 73)                                            |
| Marqueurs _et, ou, puis_; _d'abord, ensuite, enfin_                                                 | →     | ★ / →     | ✅ (dans les textes)                                                                                                                                                                       | Lire A.4 c.i–ii (p. 70)                                              |
| Jeux de sonorités (rime, répétition)                                                                | →     | →         | ✅                                                                                                                                                                                         | Lire A.3 j (p. 70)                                                   |
| Communication orale (prise de parole, discussion)                                                   |       |           | ❌ non notable automatiquement; ✅ **écoute** d'un court texte lu                                                                                                                          | PDA volet oral (2011)                                                |
| Écrire des textes variés : phrase à partir d'une image, se relire (majuscule, point, espaces)       | →     | ★         | ✅ `fr-ecrire-phrases` (domaine `fr-ecriture`) : construire et repérer la phrase bien écrite (noté); écrire sa propre phrase sur une feuille + liste de vérification (`reflect`, non noté) | Compétence 2 « Écrire des textes variés »; Syntaxe A.1, B.1          |
| Apprécier des œuvres littéraires : écouter / lire une histoire, réagir, justifier son avis          | →     | →         | ✅ `fr-apprecier` : 8 histoires originales lues à voix haute, compréhension (notée) + « As-tu aimé ? Pourquoi ? » (`reflect`, non noté)                                                    | Compétence 3 « Apprécier des œuvres littéraires »; Lire A.3, C.2.3 g |

Exclus aussi : temps autres que le présent, accord sujet-verbe, homophones grammaticaux systématiques (_a/à, et/est, son/sont_) —
ils n'apparaissent que comme **contexte de dictée** (phrase-repère), jamais comme règle à appliquer.

### 1.3 Sources

- PDA Français, langue d'enseignement (primaire) : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-francais-langue-enseignement-primaire.pdf>
- Page du programme (documents en vigueur, programme actualisé, dates) : <https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/programmes-formations-evaluation/programme-formation-ecole-quebecoise/primaire/francais-langue-enseignement>
- Programme d'études (2001) : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-francais-langue-enseignement-primaire.pdf>
- Programme actualisé : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-Programme-francais-langue-enseignement-primaire.pdf>
- Feuillet « éléments de changement et de continuité » : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/Feuillet-programme-francais-langue-enseignement.pdf>
- Liste orthographique — document de référence : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/Liste-orthographique-document-reference.pdf>
- Liste orthographique — matériel reproductible, 1er cycle : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/Liste-orthographique-documents-reproductibles-1er-cycle.pdf>
- Outil de recherche de la liste (Usito) : <https://usito.usherbrooke.ca/mots>

---

## 2. Domaines

| id               | Titre (enfant)                     | Icône | Couleur / doux    | `pda` (résumé affiché aux parents)                                                            |
| ---------------- | ---------------------------------- | ----- | ----------------- | --------------------------------------------------------------------------------------------- |
| `fr-sons`        | Les sons et les syllabes           | 👂    | #9b5de5 / #efe4fb | Lire C.1 b.iv, c.ii (décodage); Orthographe d'usage C.1 (graphème-phonème); jeux de sonorités |
| `fr-lecture`     | Je lis et je comprends             | 📖    | #118ab2 / #dff3fb | Lire A (textes), C.1 (identification des mots), C.2 (gestion de la compréhension)             |
| `fr-orthographe` | J'écris les mots                   | ✏️    | #ef476f / #ffe1e8 | Orthographe d'usage A–C (≈ 500 mots du 1er cycle, lettres muettes, majuscule, apostrophe)     |
| `fr-grammaire`   | Les classes de mots et les accords | 🧩    | #06a77d / #dcf7ee | Accords A (classes), D (pluriel, féminin), E (accords dans le groupe du nom)                  |
| `fr-phrase`      | La phrase                          | 💬    | #f78c40 / #ffe9d6 | Syntaxe et ponctuation A.1, B.1, D.1                                                          |
| `fr-verbes`      | Les verbes au présent              | 🏃    | #e76f51 / #fde4dc | Conjugaison C.1 (formes mémorisées); Accords A.5 (pronoms de conjugaison)                     |
| `fr-vocabulaire` | L'alphabet et les familles de mots | 🔤    | #c9a227 / #fff4cc | Orthographe d'usage B.3; Lexique B.1                                                          |

Codes couleur fixes des **classes de mots** dans tout le site (pages, explications, `tapwords` révélé) : nom = bleu `--B`,
déterminant = vert `--C`, adjectif = violet `--pur`, verbe = rouge `--A`, pronom = orange `--org`. (Proposés comme jetons
`--cls-nom`, etc., voir G9.)

---

## 3. Catalogue des habiletés (22)

Règles transversales (en plus du framework § 4 et § 7) :

- **Toute consigne se lit 🔊** et tient en ≤ 10 mots; l'enfant de 7 ans lit encore lentement.
- **Pas de son isolé prononcé par la synthèse vocale** (« [ch] » est mal lu) : on dit toujours un _mot-repère_
  (« le son [o] comme dans _auto_ »). Voir § 8.
- Mots tirés de `mots.js` filtrés par `annee` (1 → lvl 0, 1–2 → lvl 1, 2 + formes fléchies → lvl 2).
- Distracteurs : erreurs typiques **réelles** (mauvaise graphie du même son, lettre muette oubliée, accent), jamais farfelus;
  une distractrice ne peut jamais être un autre mot correct (vérifié contre `mots.js` et la table d'homophones).
- `explain` dit _comment penser_ avec le mot de la question (« On entend [o] à la fin de _chapeau_ : à la fin des mots,
  [o] s'écrit souvent _eau_. »).

### Domaine `fr-sons` 👂

**`fr-syllabes` — 👏 Je compte les syllabes** · _starter_

- Desc. enfant : « Tape dans tes mains pour chaque syllabe. »
- PDA : Lire C.1 b.iv (décodage par syllabes, → ★).
- Formats : `choice` (1, 2, 3, 4 sous forme 👏, 👏👏…), lvl 2 `build` (G1) pour reconstituer le mot à partir de ses syllabes écrites.
- lvl 0 : mots de 1–2 syllabes orales avec emoji (_chat, lapin_); 2 choix. lvl 1 : 3 syllabes (_éléphant, chocolat_); 3 choix.
  lvl 2 : `build` — tuiles syllabes + 1 tuile intruse (_ca·ro·tte_ → « ca », « rotte »; on construit à l'écrit).
- Visuel : emoji + mot écrit + `audio` (le mot). `viz` : composant `M.ui.wordParts` (G7) en mode syllabes, arcs sous le mot;
  `showMe` anime un 👏 par arc.
- Indice : « Dis le mot lentement en tapant dans tes mains. » Explication : « _Lapin_ : la-pin → 2 syllabes. »
- Données : `syl` (syllabes orales) et drapeau `sylSure` (exclut les mots à _e_ muet ambigu, § 8).

**`fr-rimes` — 🎵 Les mots qui riment**

- Desc. : « Trouve les mots qui finissent par le même son. »
- PDA : Lire A.3 j (jeux de sonorités : rime, → →).
- Formats : `choice` à images audibles (G2), `match` (paires qui riment), lvl 2 `multi` (toutes les rimes de _-on_).
- lvl 0 : « Quel mot rime avec _bateau_ ? » 3 images dites au toucher. lvl 1 : `match` 3 paires. lvl 2 : `multi`, 6 choix, 3 bons.
- Indice : « Écoute la fin du mot : _ba-TEAU_. » Données : clé `rime` (phonétique simplifiée, ex. `o`, `on`, `in`) + table
  d'exclusions (§ 8 : _a/â_, _o_ ouvert/fermé, _é/è_ final).

**`fr-entendre-son` — 👂 J'entends le son**

- Desc. : « Est-ce que tu entends le son dans le mot ? »
- PDA : Lire C.1 c.ii (correspondances lettres/sons, → ★).
- Formats : `tf` (lvl 0), `multi` à images audibles (G2) (lvl 1), `choice` début/milieu/fin (lvl 2 : « Où entends-tu [an] dans _éléphant_ ? »).
- Sons du 1er cycle : voyelles simples; [ou], [on], [an], [in], [oi], [eu], [é], [è], [ch], [j], [gn], [ill], [k], [s], [z], [f].
- Visuel : carte du son (graphème le plus fréquent + mot-repère + emoji, ex. « [on] 🐟 _poisson_ »). Aucun son isolé lu.
- Explication : « Dans _mouton_, on entend [on] à la fin : mou-**ton**. »

**`fr-sons-ecrits` — 🔡 Les sons qui s'écrivent de plusieurs façons**

- Desc. : « _o_, _au_ ou _eau_ ? Choisis la bonne façon d'écrire le son. »
- PDA : Orthographe d'usage C.1 a–b (→ ★).
- Formats : `choice` (compléter : « un chap__ » → _eau / o / au_), `sort` (classer des mots selon la graphie), `tapwords` (G6, mode lettres :
  « Touche les lettres qui font le son [an] dans _enfant_ »).
- lvl 0 : sons à une graphie (_ou, on, oi, ch_). lvl 1 : familles à 2–3 graphies (_o/au/eau_, _an/en_, _in/ain/ein_, _è/ai/ê_, _é/er/ez_).
  lvl 2 : règles de position (_c/ç_, _g/ge/gu_, _m_ devant _b, p_) — PDA C.3 a (→ →).
- Indice par famille (« À la fin d'un mot, [o] s'écrit souvent _eau_ : _chapeau, gâteau_ »). Données : `gr` (graphèmes du mot) et
  `sons.js` (inventaire, régularités, mots-repères).

### Domaine `fr-lecture` 📖

**`fr-lire-mots` — 👀 Je lis des mots** · _starter_

- Desc. : « Lis le mot et touche la bonne image. »
- PDA : Lire C.1 a.ii (mots fréquents), b.iv (décodage).
- Formats : `choice` à emoji (mot écrit, **pas d'audio** — on évalue la lecture), lvl 0 aussi « mots-outils » : `choice` audio → mot écrit
  (« Touche le mot _dans_ » : _dans / sans / donc_).
- lvl 0 : syllabes simples (_lune, moto_). lvl 1 : sons complexes (_poisson, mouton_). lvl 2 : distracteurs visuellement proches
  (_bateau / gâteau / râteau_, _poule / boule_).
- Indice : « Découpe le mot en syllabes. » Données : emoji non ambigus seulement (drapeau `emOk`).

**`fr-lire-phrases` — 🖼️ Je lis une phrase**

- Desc. : « Lis la phrase. Quelle image va avec ? »
- PDA : Lire C.2.2 a, d.i (délimiter la phrase, ce dont on parle).
- Formats : `choice` à scènes emoji (« Le chat dort sous la table. » → 3 scènes qui diffèrent par **un** élément), `tf`
  (« Cette phrase a du sens ? _La pomme mange le garçon._ »).
- lvl 0 : 4–5 mots. lvl 1 : 6–8 mots, préposition (sur/sous/dans). lvl 2 : négation (« Le chien **ne** dort **pas**. »).
- Données : `phrases.js` (scènes : liste d'emoji + relation spatiale), généré par gabarits.

**`fr-comprendre-texte` — 🔍 Je comprends un texte** · _starter_

- Desc. : « Lis le petit texte, puis réponds aux questions. »
- PDA : Lire A.3 c.i (personnages), d.i (temps et lieux explicites), C.2.3 c (mots de substitution), C.2.3 g (inférence, → en 2e),
  C.1 c.iii–iv (sens d'un mot nouveau en contexte).
- Format : `steps` avec `passage` (le texte reste affiché) — 3 étapes : 1 **repérage** (qui/quoi/où/quand), 1 **inférence** ou
  **substitution** (« _Elle_, c'est qui ? »), 1 **vocabulaire en contexte**. Formats d'étape : `choice`, `tapwords` sur une phrase du texte,
  `order` (séquence). ⭐ si les 3 du premier coup (règle `steps`).
- lvl 0 : 30–50 mots, 2 étapes, repérage seulement; option **écoute** (G5 : texte lu, masqué jusqu'à la réponse) — volet oral « écouter ».
  lvl 1 : 60–100 mots. lvl 2 : 100–150 mots, inférence pragmatique (sentiment, cause), texte informatif ou consigne.
- Indice : « Relis la phrase qui parle de… » + surligner la phrase-source (G6 `hintSpan`). Explication : cite la phrase-preuve.
- Données : `textes.js` (§ 5.3). Chaque question porte `type` et `preuve` (index de la phrase).

**`fr-ordre-histoire` — 🔢 Début, milieu, fin**

- Desc. : « Remets l'histoire dans l'ordre. »
- PDA : Lire A.2 a (trois temps d'un récit, → → ★), A.4 a.i, c.ii (_d'abord, ensuite, enfin_).
- Formats : `order` (3 phrases à lvl 0–1, 4 à lvl 2), chaque phrase avec un emoji.
- lvl 0 : 3 images + phrases courtes, ordre évident (🥚 → 🐣 → 🐔). lvl 1 : tirées des textes de `textes.js`. lvl 2 : 4 phrases avec
  marqueurs _d'abord / ensuite / puis / enfin_ comme indice.
- Indice : « Qu'est-ce qui arrive en premier ? » Données : champ `sequence` de chaque texte.

### Domaine `fr-orthographe` ✏️

**`fr-dictee` — 🎧 Ma dictée de mots** · _starter_

- Desc. : « Écoute le mot et écris-le. »
- PDA : Orthographe d'usage A.1 (≈ 500 mots, → ★).
- Formats : `text` + `audio` en **séquence** _mot – phrase – mot_ (G5), `accents` exigés, `keyboard: 'accents'`; lvl 0 aussi `build` (G1)
  avec tuiles-lettres.
- lvl 0 : mots de 1re année, 3–5 lettres, `build` avec les lettres + 2 intruses. lvl 1 : mots de 2e année, `text`.
  lvl 2 : formes fléchies (_chevaux, grande, belles_) et mots à lettre muette.
- Rétroaction : diagnostic fin (G4) : « Il manque un accent », « Une lettre muette se cache à la fin », lettres alignées (pas seulement
  par position). Indice : régularité du son difficile du mot (tirée de `gr`).
- Données : `mots.js` (`annee`, `phrase` de contexte, `gr`). Pondération par mot raté (G8).

**`fr-bonne-orthographe` — 🔎 Le mot bien écrit**

- Desc. : « Un seul mot est bien écrit. Trouve-le ! »
- PDA : Orthographe d'usage A.1, C.1 a.
- Formats : `choice` (3 choix, audio du mot), lvl 2 `tapwords` « Touche le mot mal écrit dans la phrase ».
- Distracteurs produits par le générateur de fautes plausibles (§ 6.4), jamais un vrai mot.
- lvl 0 : 2 choix, une seule différence. lvl 1 : 3 choix. lvl 2 : phrase de 5–7 mots avec 1 faute.

**`fr-lettres-muettes` — 🤫 Les lettres muettes**

- Desc. : « Certaines lettres ne s'entendent pas. Trouve-les ! »
- PDA : Orthographe d'usage C.2 a, b.i–ii (→ → ★ en 3e); Lexique B.1 (famille).
- Formats : `tapwords` mode lettres (G6) « Touche la lettre muette dans _chat_ »; `choice` « _gran\__ : pense à _grande_ » (_d / t / s_);
  `text` lvl 2 (« Écris le mot qui finit par une lettre muette : _froi\__ »).
- lvl 0 : _e_ muet final et _t/d_ très fréquents (_chat, lit, nid_). lvl 1 : justifier par le féminin ou la famille (_grand → grande,
  dent → dentiste_). lvl 2 : marques du pluriel (_les chats_ : le _s_ est muet).
- Explication : « On n'entend pas le _d_ de _froid_, mais on l'entend dans _froide_. »

**`fr-majuscule-apostrophe` — 🅰️ Majuscule et apostrophe**

- Desc. : « Un nom propre a une majuscule. _le_ + _arbre_ → _l'arbre_. »
- PDA : Orthographe d'usage C.4 a.i, C.5 a.i (→ ★).
- Formats : `tapwords` (« Touche les mots qui ont besoin d'une majuscule : _hier, léa a vu félix à québec._ » → `select:'many'`),
  `choice` (« ___ ami » : _l'ami / le ami / la ami_), `text` avec `caseSensitive` (G4 mode `'first'`) pour écrire un prénom.
- lvl 0 : prénoms. lvl 1 : élision _le/la/je/ne_. lvl 2 : noms de lieux (→ en 2e, défi) + mélange.

**`fr-ma-liste` — 📝 Ma liste de la semaine** (données du parent, § 6)

- Desc. : « Pratique les mots que ton enseignante t'a donnés cette semaine. »
- PDA : Orthographe d'usage A.1 (mots à l'étude), pistes « mémoriser des mots » (p. 18).
- Visible seulement si une liste active existe (G3 `available`). Formats : `choice` (bonne orthographe), `build` (lettres), `text` + audio.

### Domaine `fr-grammaire` 🧩

**`fr-classes-mots` — 🏷️ Nom, déterminant, adjectif, verbe**

- Desc. : « Quelle sorte de mot est-ce ? Utilise tes trucs ! »
- PDA : Accords A.1 a.i, b.i; A.2 a, e; A.3 b.ii (→ 2e); A.4 b.i (→ 2e).
- Formats : `tapwords` (« Touche le **nom** » — n'importe lequel des noms est accepté : G6 `select:'one'` avec plusieurs bonnes réponses),
  `sort` (classer 4–6 mots dans 2–3 boîtes), `tf` avec manipulation (« On peut dire _un lapin_ → _lapin_ est un nom ? »).
- lvl 0 : nom vs déterminant. lvl 1 : + verbe (truc _ne… pas_ : « _Il **ne** court **pas**_ »). lvl 2 : + adjectif (truc _très_).
- `viz` : la phrase annotée (G9) apparaît après réponse avec les couleurs des classes; `showMe` applique la manipulation (insère
  « un » ou « ne… pas » en surbrillance).
- Données : `phrases.js` (phrases étiquetées, mots ambigus marqués non-cibles : _la, porte, avant_).

**`fr-genre-nombre` — 👦👧 Masculin, féminin, singulier, pluriel**

- Desc. : « _Un_ ou _une_ ? _Un_ ou _des_ ? »
- PDA : Accords A.1 a.iii–iv (→ ★), D.1 a.i (★), D.1 a.ii–b, D.5 a (→ en 2e, lvl 2).
- Formats : `sort` (un 👦 / une 👧), `choice` (« une ___ » : _chat / maison_), `cloze` (« des {0} » : _cheval / chevaux_), `text` lvl 2
  (« Un chapeau, deux… » → _chapeaux_).
- lvl 0 : genre de noms très fréquents avec emoji. lvl 1 : pluriel en _s_. lvl 2 : _-eau → -eaux_, _-al → -aux_, féminin + _e_.
- Explication : « On dit _une_ maison : _maison_ est féminin. » / « _Chapeau_ finit par _eau_ : au pluriel, on ajoute un _x_. »

**`fr-accords-gn` — 🔗 Les accords dans le groupe du nom**

- Desc. : « Le nom donne son genre et son nombre au déterminant. »
- PDA : Accords E.1 (★ 2e), E.2 (→ 2e), B.1 a–b.
- Formats : `cloze` (« {0} {1} » avec banque _le/la/les_ + _chat/chats_), `tf` (« _Les petit chats_ est bien accordé ? »), lvl 2 `steps`
  (1. Touche le nom → 2. Il est singulier ou pluriel ? → 3. Choisis le bon adjectif).
- lvl 0 : dét + nom au singulier (le/la/un/une). lvl 1 : dét + nom au pluriel (les/des + s). lvl 2 : dét + adj + nom (_les petites souris_).
- `viz` : flèches donneur → receveurs (G9). Données : générateur GN à partir de `mots.js` + adjectifs à formes (_petit/petite/petits/petites_).

### Domaine `fr-phrase` 💬

**`fr-phrase-ponctuation` — ✅ Majuscule et point** · _starter_

- Desc. : « Une phrase commence par une majuscule et finit par un point. »
- PDA : Syntaxe B.1 a.i, b (→ ★); a.ii–iii (→ → en 2e); Lire C.2.2 a.
- Formats : `tf` (« Cette phrase est bien écrite ? »), `tapwords` (« Touche le mot qui doit avoir une majuscule »), `choice`
  ponctuation finale (`.`, `?`, `!` en gros), lvl 2 `tapwords` « Combien de phrases ? Touche le premier mot de chaque phrase ».
- lvl 0 : point/majuscule. lvl 1 : `?` pour une question (mots _est-ce que, qui, où_). lvl 2 : `!` + texte sans ponctuation (2 phrases).

**`fr-ordre-mots` — 🧱 Je construis une phrase**

- Desc. : « Mets les mots dans l'ordre pour faire une phrase. »
- PDA : Syntaxe A.1 b–d (→ ★); D.1 a (négation, → en 2e).
- Format : `build` (G1, `join:' '`, première tuile avec majuscule, point en tuile finale fixe). Ordres admis multiples (`accept`) quand
  la phrase en a (rare; les gabarits évitent les compléments de phrase mobiles).
- lvl 0 : 3–4 tuiles (_Le chat dort._). lvl 1 : 5–6 tuiles. lvl 2 : phrase négative (_ne… pas_) + 1 tuile intruse.
- Indice : « Qui fait l'action ? Commence par lui. » Données : `phrases.js` (ordre canonique + variantes acceptées).

### Domaine `fr-verbes` 🏃

**`fr-etre-avoir` — ⭐ Être et avoir au présent**

- Desc. : « _Je suis, tu es…_ _J'ai, tu as…_ »
- PDA : Conjugaison C.1 (→ ★); Accords A.5 a–b (pronoms, → ★).
- Formats : `match` (pronom ↔ forme), `cloze` (« Nous {0} contents. » banque _sommes / avons / sont_), lvl 2 `text` + audio (« Écris :
  _vous êtes_ »).
- lvl 0 : _je/tu/il/elle_ avec _être_ seul. lvl 1 : 6 personnes, _être_ et _avoir_ séparés. lvl 2 : mélange, dictée de formes.
- Visuel : tableau de conjugaison colorié (pronom orange, verbe rouge). Explication : « Avec _nous_, _être_ devient _sommes_. »

**`fr-verbes-frequents` — 🚶 Aimer, aller, dire, faire**

- Desc. : « Les verbes qu'on écrit tout le temps. »
- PDA : Conjugaison C.1 — formes **mémorisées, sans découverte du système** (le système _-er_ est en 3e : on ne parle ni de radical
  ni de terminaison).
- Formats : identiques à `fr-etre-avoir` (`match`, `cloze`, `text` + audio).
- lvl 0 : _aimer, aller_ au singulier. lvl 1 : 4 verbes, 6 personnes. lvl 2 : formes irrégulières difficiles (_vous faites, vous dites,
  ils vont, ils font_).

### Domaine `fr-vocabulaire` 🔤

**`fr-alphabet` — 🔤 L'ordre alphabétique**

- Desc. : « Quelle lettre vient avant ? Après ? Place les mots dans l'ordre. »
- PDA : Orthographe d'usage B.1–B.3 (★ 1re, réinvesti); Lexique C.2 (→ 3e : on se limite à la 1re lettre).
- Formats : `choice` (« Quelle lettre vient après _m_ ? »), `order` (3 → 5 mots, **premières lettres toutes différentes**).
- lvl 0 : lettres voisines. lvl 1 : 3 mots. lvl 2 : 5 mots + voyelles/consonnes (`sort`).

**`fr-familles-mots` — 👨‍👩‍👧 Les familles de mots**

- Desc. : « _Fleur, fleuriste, fleurir_ : c'est la même famille ! »
- PDA : Lexique B.1 (→ en 2e), Orthographe d'usage C.2 b.i.
- Formats : `choice` (« Quel mot est de la même famille que _dent_ ? » _dentiste / danse / dans_ — piège sonore volontaire),
  `multi` (lvl 2), `sort` (2 familles).
- Données : `familles.js` (≈ 40 familles de mots connus de l'enfant; faux-amis sonores pour distracteurs).

---

## 4. Pages « Apprendre » (8)

| id                  | Titre / icône                            | But                                                | Sections (`M.ui.section`) et composants                                                                                                                                                                                                                                           | Habiletés liées                                                                                     |
| ------------------- | ---------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `fr-carte-sons`     | 🗺️ Ma carte des sons                     | Mur des sons de la classe, version tactile         | 1) Les voyelles (`vocab`, mot-repère + emoji) 2) Les sons qui s'écrivent de plusieurs façons (`tabs` : [o], [an], [in], [è], [é]…, chaque onglet = `vocab` + `wordParts` G7 coloré) 3) Les syllabes (`wordParts` mode syllabes, 👏) 4) `miniQuiz` (3 questions `fr-sons-ecrits`)  | `fr-syllabes`, `fr-entendre-son`, `fr-sons-ecrits`, `fr-rimes`                                      |
| `fr-lire-detective` | 🕵️ Lire comme un détective               | Stratégies de lecture de la PDA (Lire C.1 b, C.3)  | 1) Quand je bloque sur un mot (`demarche` avec étapes personnalisées : 👀 Je regarde l'image → ✂️ Je découpe en syllabes → 🔁 Je relis la phrase → 🤔 Est-ce que ça a du sens ?) 2) Qui ? Quoi ? Où ? Quand ? (`callout` + exemples) 3) Texte à toucher (`reading`) 4) `miniQuiz` | `fr-lire-mots`, `fr-lire-phrases`, `fr-comprendre-texte`, `fr-ordre-histoire`                       |
| `fr-bien-ecrire`    | ✍️ Bien écrire un mot                    | Stratégie d'étude des mots                         | 1) Regarde, dis, cache, écris, vérifie (`demarche` 5 étapes) 2) Les lettres muettes (`callout` tip : « pense au féminin ou à la famille ») 3) Majuscule et apostrophe (exemples) 4) `flashcards` des mots difficiles 5) `miniQuiz`                                                | `fr-dictee`, `fr-bonne-orthographe`, `fr-lettres-muettes`, `fr-majuscule-apostrophe`, `fr-ma-liste` |
| `fr-classes-mots`   | 🏷️ Les sortes de mots                    | Les trucs (manipulations) de la grammaire actuelle | `tabs` : Nom (« je peux mettre _un/une_ devant »), Déterminant, Adjectif (« je peux mettre _très_ devant »), Verbe (« je peux l'encadrer par _ne… pas_ »); chaque onglet : phrase annotée (G9) + `callout`; puis `miniQuiz` (`sort`)                                              | `fr-classes-mots`                                                                                   |
| `fr-accords`        | 🔗 Masculin, féminin, singulier, pluriel | Donneur et receveurs d'accord                      | 1) Genre (`sort` un/une) 2) Nombre (bouton « 1 ↔ plusieurs » : visuel `fr-` qui fait passer _le petit chat_ à _les petits chats_, lettres ajoutées en couleur) 3) Le nom donne ses marques (G9 flèches) 4) `miniQuiz`                                                             | `fr-genre-nombre`, `fr-accords-gn`                                                                  |
| `fr-la-phrase`      | 💬 La phrase                             | Ce qui fait une phrase                             | 1) Majuscule + point (`callout`) 2) Les mots dans l'ordre (`build` démonstration) 3) `?` et `!` 4) _ne… pas_ 5) `miniQuiz`                                                                                                                                                        | `fr-phrase-ponctuation`, `fr-ordre-mots`                                                            |
| `fr-verbes-present` | 🏃 Être, avoir et les verbes fréquents   | Mémoriser les formes du présent                    | `tabs` par verbe : tableau pronom + forme (chaque ligne lisible 🔊), `flashcards` (pronom → forme), petite comptine originale à répéter (« Je suis, tu es, il est… ») ; `miniQuiz` (`match`)                                                                                      | `fr-etre-avoir`, `fr-verbes-frequents`                                                              |
| `fr-alphabet-dico`  | 🔤 L'alphabet                            | Lettres, voyelles, ordre                           | 1) Bande alphabet (`vocab` de 26 lettres, nom lu au toucher) 2) Voyelles / consonnes 3) Ranger des mots (`order`) 4) Familles de mots (`vocab`)                                                                                                                                   | `fr-alphabet`, `fr-familles-mots`                                                                   |

---

## 5. Plan des données

### 5.1 Fichiers (`js/francais/`)

```
subject.js            M.registerSubject + 7 domaines
data/mots.js          M.FR.MOTS        banque de mots (≈ 550)
data/sons.js          M.FR.SONS        inventaire des sons, graphies, mots-repères, prononciations de secours
data/phrases.js       M.FR.PHRASES     phrases étiquetées (≈ 150) + gabarits de scènes
data/textes.js        M.FR.TEXTES      textes courts originaux (24) + questions
data/verbes.js        M.FR.VERBES      aimer, aller, avoir, dire, être, faire × 9 pronoms
data/familles.js      M.FR.FAMILLES    familles de mots (≈ 40), homophones (≈ 30), exclusions de rimes
skills/_commun.js     M.FR.*           outils partagés : générateur de fautes plausibles, accord du GN, choix de mots
skills/sons.js  lecture.js  orthographe.js  grammaire.js  phrase.js  verbes.js  vocabulaire.js  ma-liste.js
learn/*.js            8 pages
```

Les données passent par le registre partagé `M.registerData` proposé dans `univers-social.md` (G6) ; `check-skills.js` doit charger
`data/` avant `skills/` (G10).

### 5.2 Banque de mots `M.FR.MOTS` (≈ 550 entrées)

- **≈ 395** mots de la Liste orthographique 1re + 2e (tous, y compris mots-outils, avec `lo: 1|2`).
- **≈ 150** mots d'appui pour la phonologie (imageables, sons ciblés, rimes) marqués `lo: 0`; jamais exigés en dictée à lvl 1.
- Les formes fléchies (féminin, pluriel) sont des champs du mot, pas des entrées séparées (comme la liste du MEQ).

| Champ         | Exemple                                                                                                           | Rôle                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `w`           | `chapeau`                                                                                                         | graphie (NFC)                                                                                         |
| `cls`         | `nom` · `adj` · `verbe` · `det` · `pron` · `outil`                                                                | classe (grammaire, filtres)                                                                           |
| `g`           | `m` · `f` · `mf` (épicène)                                                                                        | genre (noms, adjectifs)                                                                               |
| `pl`          | `chapeaux`                                                                                                        | pluriel si ≠ `w + s` (sinon absent)                                                                   |
| `fem`         | `grande`                                                                                                          | féminin (adjectifs, noms animés)                                                                      |
| `syl`         | `["cha","peau"]`                                                                                                  | syllabes **orales** (ordre écrit)                                                                     |
| `sylSure`     | `false`                                                                                                           | `false` si le compte varie à l'oral (_e_ muet, réductions québécoises) → exclu de `fr-syllabes`       |
| `gr`          | `ch                                                                                                               | a                                                                                                     | p   | eau` | découpage en graphèmes (sert à la carte des sons et aux fautes plausibles) |
| `ph`          | `ch a p o`                                                                                                        | sons correspondants (notation de classe : `ch`, `an`, `on`, `in`, `è`, `é`, `eu`, `oi`, `gn`, `ill`…) |
| `muette`      | `t` + `why: "chatte"`                                                                                             | lettre(s) muette(s) et, si possible, mot qui la justifie (féminin, famille)                           |
| `rime`        | `o`                                                                                                               | clé de rime (voir exclusions)                                                                         |
| `fam`         | `fleur`                                                                                                           | id de famille                                                                                         |
| `theme`       | `animaux` · `maison` · `école` · `nature` · `nourriture` · `corps` · `famille` · `saisons` · `vêtements` · `jeux` | thème                                                                                                 |
| `em` / `emOk` | `👒` / `true`                                                                                                     | emoji; `emOk` = image sans ambiguïté (sinon pas de question à image)                                  |
| `lo`          | `1`                                                                                                               | année dans la Liste orthographique (0 = hors liste)                                                   |
| `phrase`      | `Il porte un chapeau rouge.`                                                                                      | phrase de contexte pour la dictée (obligatoire pour tout homophone)                                   |

**Dix mots-modèles** (barre de qualité) :

| `w`     | `cls`/`g` | `pl` / `fem` | `syl` (`sylSure`)                      | `gr` → `ph`              | `muette` (why) | `rime` | `fam`                        | `em` | `lo` | `phrase`                         |
| ------- | --------- | ------------ | -------------------------------------- | ------------------------ | -------------- | ------ | ---------------------------- | ---- | ---- | -------------------------------- |
| chat    | nom m     | — / chatte   | chat (oui)                             | ch·a·t → ch a            | t (_chatte_)   | a      | chat (_chaton_)              | 🐱   | 1    | Le chat dort sur mon lit.        |
| maison  | nom f     | —            | mai·son (oui)                          | m·ai·s·on → m è z on     | —              | on     | maison (_maisonnette_)       | 🏠   | 1    | Ma maison est bleue.             |
| école   | nom f     | —            | é·cole (**non** : 2 orales, 3 écrites) | é·c·o·l·e → é k o l      | e              | ol     | école (_écolier_)            | 🏫   | 1    | Je vais à l'école à pied.        |
| fleur   | nom f     | —            | fleur (oui)                            | f·l·eu·r → f l eu r      | —              | eur    | fleur (_fleuriste, fleurir_) | 🌸   | 1    | Cette fleur sent bon.            |
| cheval  | nom m     | chevaux      | che·val (**non** : « ch'val »)         | ch·e·v·a·l → ch e v a l  | —              | al     | cheval (_chevalier_)         | 🐴   | 1    | Le cheval court dans le champ.   |
| chapeau | nom m     | chapeaux     | cha·peau (oui)                         | ch·a·p·eau → ch a p o    | —              | o      | chapeau                      | 👒   | 1    | Il porte un chapeau rouge.       |
| enfant  | nom mf    | —            | en·fant (oui)                          | en·f·an·t → an f an      | t (_enfance_)  | an     | enfant (_enfance, enfantin_) | 🧒   | 1    | Cet enfant joue au parc.         |
| carotte | nom f     | —            | ca·rotte (oui)                         | c·a·r·o·tt·e → k a r o t | e              | ot     | carotte                      | 🥕   | 2    | Le lapin croque une carotte.     |
| hiver   | nom m     | —            | hi·ver (oui)                           | h·i·v·e·r → i v è r      | h (initial)    | èr     | hiver (_hivernal_)           | ☃️   | 2    | En hiver, je glisse en traîneau. |
| froid   | adj m     | — / froide   | froid (oui)                            | f·r·oi·d → f r oi        | d (_froide_)   | oi     | froid (_refroidir_)          | 🥶   | 2    | Il fait froid ce matin.          |

### 5.3 Textes courts `M.FR.TEXTES` (24, tous écrits pour ce projet)

| Niveau | Nombre | Longueur                     | Genres                                                                               |
| ------ | ------ | ---------------------------- | ------------------------------------------------------------------------------------ |
| lvl 0  | 8      | 30–50 mots, phrases ≤ 8 mots | 5 récits, 2 descriptions (animal, objet), 1 liste/consigne                           |
| lvl 1  | 8      | 60–100 mots                  | 5 récits, 2 textes informatifs (animal du Québec, saison), 1 recette ou règle de jeu |
| lvl 2  | 8      | 100–150 mots                 | 4 récits (avec dialogue simple), 2 informatifs, 1 invitation, 1 comptine originale   |

Règles d'écriture : vocabulaire à ≥ 85 % dans `mots.js`; prénoms variés (Zoé, Malik, Léa, Thomas, Aya, Samuel, Rosalie, Nicolas…);
contextes québécois (cabane à sucre, glissade, tuque, érable, castor, premier jour d'école, dépanneur); repas au sens québécois
(_déjeuner, dîner, souper_); aucun texte, personnage ou extrait d'œuvre existante. Chaque texte : `id`, `titre`, `niveau`, `genre`,
`phrases` (tableau — sert aux preuves et à `tapwords`), `sequence` (3–4 événements pour `fr-ordre-histoire`), `questions` (5–7, chacune
`type` ∈ `qui|quoi|ou|quand|sequence|substitution|inference|vocabulaire`, format, choix, réponse, `preuve` = index de phrase,
`explain`). Le générateur pioche 2–3 questions de types différents par série d'étapes.

**Texte-modèle (lvl 1, ≈ 80 mots)** — « La cabane de Zoé »

> Samedi matin, Zoé et son grand-papa vont dans la forêt derrière la maison. Ils apportent des planches, des clous et un marteau.
> Grand-papa scie les planches. Zoé tient le bout de chaque planche pour l'aider.
>
> À midi, la cabane a un toit et une petite fenêtre. Zoé mange une pomme, assise sur le plancher. Soudain, des gouttes tombent sur
> le toit : toc, toc, toc ! Zoé sourit. Sa cabane est solide : Zoé reste bien au sec.

| #   | Type         | Question (format)                                                  | Choix (✔ = réponse)                                                                              | Preuve      | Explication                                                                                |
| --- | ------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------ |
| 1   | qui          | Avec qui Zoé construit-elle la cabane ? (`choice`)                 | son grand-papa ✔ · sa maman · son ami Malik                                                      | ph. 1       | « Le texte dit : _Zoé et son grand-papa vont dans la forêt._ »                             |
| 2   | où           | Où est la cabane ? (`choice`)                                      | dans la forêt ✔ · au bord du lac · dans le salon                                                 | ph. 1       | « _Dans la forêt derrière la maison._ »                                                    |
| 3   | substitution | Dans « Ils apportent des planches », _Ils_, c'est qui ? (`choice`) | Zoé et son grand-papa ✔ · grand-papa seulement · les voisins                                     | ph. 1–2     | « _Ils_ remplace _Zoé et son grand-papa_ : ils sont deux, c'est pour ça qu'on dit _ils_. » |
| 4   | séquence     | Remets dans l'ordre. (`order`)                                     | Grand-papa scie les planches. → La cabane a un toit. → Des gouttes tombent sur le toit.          | ph. 3, 5, 7 | « D'abord on scie, ensuite la cabane a un toit, enfin il pleut. »                          |
| 5   | inférence    | Quel temps fait-il à la fin de l'histoire ? (`choice` emoji)       | 🌧️ Il pleut ✔ · ☀️ Il fait soleil · ❄️ Il neige                                                  | ph. 7       | « Des gouttes qui tombent sur le toit, c'est de la pluie. »                                |
| 6   | inférence    | Pourquoi Zoé sourit-elle ? (`choice`)                              | Sa cabane la protège de la pluie. ✔ · Elle aime être mouillée. · Grand-papa lui donne un cadeau. | ph. 8–10    | « La cabane est solide : Zoé ne se mouille pas, elle est contente. »                       |
| 7   | vocabulaire  | « Rester au sec » veut dire… (`choice`)                            | ne pas être mouillée ✔ · avoir très soif · être fâchée                                           | ph. 10      | « _Sec_ est le contraire de _mouillé_. »                                                   |

Contrôle d'ambiguïté (fait pour ce texte) : la 1re version finissait par « Sa cabane est solide. _Elle_ reste bien au sec. » —
_Elle_ pouvait renvoyer à _Zoé_ **ou** à _la cabane_. Le texte répète donc _Zoé_, et la question de substitution porte sur _Ils_
(un seul référent possible). **Règle** : chaque question de substitution ou d'inférence n'a qu'une réponse défendable avec sa
phrase-preuve; chaque texte est relu par un adulte (§ 8).

### 5.4 Banques de phrases `M.FR.PHRASES` (≈ 150) et gabarits

- Phrases étiquetées mot par mot (`Le/det petit/adj chat/nom dort/verbe sur/prep le/det lit/nom ./pt`), drapeaux `cibleOK` par mot
  (les mots à double classe — _la, porte, ferme, avant_ — ne sont jamais cibles). 3 niveaux de longueur (4–5, 6–8, 9–12 mots).
- Variantes d'ordre acceptées (`accept`) quand plusieurs ordres sont grammaticaux; sinon la phrase est marquée « ordre unique ».
- Gabarits de scènes pour `fr-lire-phrases` : sujet (emoji) × action × lieu (sur / sous / dans / à côté de) → 3 scènes qui ne
  diffèrent que d'un élément.
- Générateur GN : déterminant × adjectif (≈ 25 adjectifs à formes connues : _petit, grand, joli, gros, noir, blanc, rouge_…) × nom.

### 5.5 Verbes, familles, homophones

- `verbes.js` : 6 verbes × 9 pronoms (_il/elle/on_ et _ils/elles_ partagent la forme), formes avec élision (_j'ai, j'aime_).
- `familles.js` : ≈ 40 familles (`fleur`: _fleuriste, fleurir_; `dent`: _dentiste_; `lait`: _laitier_…) + distracteurs sonores
  (_dent / danse_); ≈ 30 ensembles d'homophones (_vert/verre/ver/vers, mer/mère/maire, cent/sans/sang, pain/pin/peint_) — utilisés
  pour **interdire** un distracteur et **exiger** une phrase de contexte.

---

## 6. Fonction parents : « Ma liste de la semaine »

### 6.1 Objectif

Au 1er cycle, l'enfant rapporte chaque semaine une liste de mots à étudier. Le parent la tape une fois; le site en tire une pratique
quotidienne (habileté `fr-ma-liste`), une page d'étude et un petit bilan par mot.

### 6.2 Parcours parent (page Parents → section « ✏️ Ma liste de mots de la semaine », via G3)

1. **Saisie** : titre (défaut « Semaine du 17 novembre »); zone de texte, **un mot par ligne**; facultatif : ` | phrase` après le mot
   (« vert | Mon chandail est vert. »). Le déterminant peut précéder le nom (« une fleur »).
2. **Vérifier la liste** → tableau d'aperçu, une ligne par mot : mot normalisé, 🔊 _Tester_ (le parent entend la synthèse),
   emoji trouvé (si le mot est dans `mots.js`), drapeaux :
   - ⚠️ _homophone_ (dans `familles.js`) sans phrase → « Ajoutez une phrase pour que votre enfant sache quel mot écrire. »
   - ⚠️ _prononciation_ : le parent est invité à écouter (sigles, noms propres, mots étrangers).
   - ℹ️ _forme conjuguée_ (« je suis ») → dictée en groupe de mots, clavier complet.
3. **Enregistrer et activer** (la liste active précédente est archivée). Boutons : _Modifier_, _Archiver_, _Supprimer_,
   _Copier/Coller la liste_ (texte brut, pour un autre appareil).
4. **Bilan** (sous la liste) : par mot, réussites du premier coup / essais, pastille « à revoir » (≥ 2 erreurs sur les 5 dernières).

Validation : 1 à 30 mots; 1–40 caractères; lettres (accents compris), espace, apostrophe, trait d'union seulement; normalisation NFC,
apostrophe typographique → `'`, espaces multiples réduits; doublons retirés; casse conservée (majuscule initiale = nom propre →
`caseSensitive`); le déterminant de tête (_un, une, le, la, l', les, des_) est détaché et mémorisé (`det`).

### 6.3 Données (stockage local, G3)

Espace `francais`, clé `listes` : `{ v: 1, active: id, listes: [{ id, titre, creee: 'AAAA-MM-JJ', archivee: bool, mots: [{ t, det?, phrase?, nomPropre? }] }] }`.
On garde 10 listes (les plus anciennes archivées sont supprimées). Les résultats par mot passent par la progression par élément (G8),
clé `fr-ma-liste:<id liste>:<mot>`. **Effacer la progression** ne supprime pas les listes (bouton distinct « Effacer mes listes »).

### 6.4 Côté enfant

- Tableau de bord Français : carte en tête « 📝 Ma liste de la semaine — 12 mots ★★ » → _Pratiquer_ (série de 8) et _Étudier_.
- **Étudier** (page générée, pas d'enregistrement) : `flashcards` (recto : emoji ou 🔊; verso : mot + phrase), puis un tour
  « Regarde, dis, cache, écris, vérifie » (`miniQuiz` de `text`).
- **Pratiquer** (`fr-ma-liste`, mots les plus ratés d'abord, G8) :
  - lvl 0 : `choice` « Le mot bien écrit » (audio + 3 graphies) ou `build` lettres (+ 2 intruses);
  - lvl 1 : `text` + audio _mot – phrase – mot_ (phrase du parent, sinon `mots.js`, sinon le mot seul);
  - lvl 2 : `text` d'une forme fléchie si connue de `mots.js` (_chapeaux_), sinon phrase à trou tapée (« Il porte un ___ rouge. »).
- **Fautes plausibles** (générateur partagé avec `fr-bonne-orthographe`) — transformations permises, dans cet ordre de préférence :
  graphie concurrente du même son (`o/au/eau`, `an/en`, `in/ain/ein`, `è/ai/ei/ê`, `é/er/ez`, `s/ss/c/ç`, `k/c/qu`, `f/ph`, `g/gu`,
  `ill/y`), consonne doublée/simplifiée, lettre muette finale retirée, accent retiré ou changé (`é ↔ è`). Rejet si le résultat est un vrai
  mot (`mots.js`, homophones) ou identique à un autre choix; si moins de 2 fautes valides → on bascule sur `text`.

---

## 7. MANQUES DU CADRE (génériques)

MUST = bloquant pour la V1 du français; SHOULD = nettement meilleur, utile ailleurs; COULD = plus tard.

| #   | Nom                                                           | Priorité | Spécification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Profite à                                                                                                                                                                                                                                           |
| --- | ------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | **Format `build`** (tuiles → mot ou phrase)                   | MUST     | Champs : `tiles: [str                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | {label, value, say?}]`, `answer: [values]`(séquence attendue),`accept?: [[values]]`(autres ordres valides),`join: ''                                                                                                                                | ' '`, `slots?: 'count'                                                                              | 'free'`(afficher autant de cases que la réponse ou une ligne libre),`fixedEnd?`(ex. tuile « . » fixe),`capitalizeFirst?`. Geste : toucher une tuile la place dans la prochaine case; toucher une case la renvoie; ↺ Recommencer; clavier : chiffres. Les tuiles peuvent **dépasser** la réponse (intruses), contrairement à `order`. Vérifier → 2 essais; au réessai, cases bien placées en vert, autres renvoyées. `validate`: chaque valeur de`answer`/`accept`existe dans les tuiles (avec multiplicité), séquences distinctes, ≥ 2 tuiles.`answerLabel`: séquence jointe. Ajouter à`M.FORMAT_SAMPLES`. | français (syllabes, lettres, phrases), anglais (épeler), maths (construire 345 avec des chiffres, écrire une égalité), sciences (étapes) |
| G2  | **Choix audibles** (`choices[].say`, `audioOnly`)             | MUST     | Même spécification que `anglais.md` G2/G3 : petit 🔊 dans le coin du choix (joue sans sélectionner), `audioOnly` masque les libellés, appliqué à `choice`, `multi`, `order`, `match`, `sort`, `build`.                                                                                                                                                                                                                                                                                                               | français (rimes, sons, mots-outils), anglais, maths (lecture des nombres)                                                                                                                                                                           |
| G3  | **Données de l'utilisateur + outils parents + disponibilité** | MUST     | (a) `M.userData.get(ns, key, défaut)`, `set`, `remove`, `exportAll()`, `importAll(json)`; clé `devoirs2e:user:v1` distincte de la progression; schéma versionné par espace; `check-skills.js` fournit des **jeux d'essai** déclarés par la matière (`M.userData.fixture(ns, key, valeur)`). (b) `M.registerParentTool({ id, subject, title, icon, render(el) })` : la page Parents affiche chaque outil dans sa section. (c) `registerSkill({ available?: () => true                                                 | 'raison' })`: habileté masquée de la révision et grisée avec la raison au tableau de bord (« Demande à un adulte d'ajouter ta liste »). Fusionnable avec`needs` (`anglais.md` G5).                                                                  | français (liste), anglais (mots de la semaine), maths (tables ciblées par le parent), toute matière |
| G4  | **Rétroaction fine du format `text`**                         | MUST     | `diagnose` (défaut vrai) : message précis si la réponse est juste **sauf** les accents (« Vérifie les accents »), la casse (« Il faut une majuscule »), l'apostrophe/trait d'union, ou une seule lettre (ajout/oubli/inversion). `M.letterDiff` aligné (distance d'édition) au lieu de positionnel : _chapau_ → _chap_au_ avec la lettre manquante signalée. `caseSensitive: 'first'` (majuscule exigée sur la 1re lettre seulement). `prefix?` affiché devant la case (« un ___ ») sans faire partie de la réponse. | français, anglais (épellation), sciences/univers social (noms propres)                                                                                                                                                                              |
| G5  | **Audio en séquence et écoute seule**                         | SHOULD   | `audio: { seq: ['chapeau', 'Il porte un chapeau rouge.', 'chapeau'], pause: 900 }` (convention de la dictée québécoise mot–phrase–mot; 🐢 rejoue la séquence lentement); `passage.listenOnly: true` : texte masqué, bouton « 👀 Voir le texte » après la réponse (compréhension orale). S'appuie sur `M.say` en séquence (`anglais.md` G8).                                                                                                                                                                          | français (dictée, écoute), anglais (histoires), maths (problèmes lus)                                                                                                                                                                               |
| G6  | **`tapwords` étendu**                                         | SHOULD   | (a) respecter `select: 'one'` même si `answer` contient plusieurs indices (« touche **un** nom » : n'importe lequel est juste) — aujourd'hui plusieurs réponses forcent le mode multiple; (b) `mode: 'letters'` : tuiles-lettres compactes collées (toucher la lettre muette, le graphème); (c) jeton `'¶'` = saut de paragraphe pour taper dans un texte entier; (d) `hintSpan: [i, j]` surligne une zone au 1er échec.                                                                                             | français, anglais (phonics), univers social (repérer dans un document)                                                                                                                                                                              |
| G7  | **Composant `M.ui.wordParts`**                                | SHOULD   | `M.ui.wordParts(word, parts, { mode: 'syllabes'                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 'sons', colors?, say?: [str] })` : mot découpé (arcs sous les syllabes ou graphèmes colorés selon le son); toucher une partie la lit (`say[i]`remplace la lecture brute, ex. « eau » → « o »); aussi utilisable comme`viz`et`showMe` (arcs animés). | français, anglais (phonics), maths (décomposition 345 = 300 + 40 + 5 en couleurs)                   |
| G8  | **Progression par élément**                                   | SHOULD   | `M.progress.item(skillId, key).record(ok)` / `.stats()` (10 derniers résultats) et `M.pickWeighted(items, keyFn)` qui favorise les éléments ratés et anciens. Stockage dans la progression (effacé avec elle).                                                                                                                                                                                                                                                                                                       | français (dictée, liste), anglais (vocabulaire), maths (faits numériques)                                                                                                                                                                           |
| G9  | **Phrase annotée `M.ui.tagged`** + jetons de classes          | SHOULD   | `M.ui.tagged(tokens, { arrows?: [[from, to]] })` : chaque mot avec son étiquette de classe sous lui (couleurs `--cls-nom`, `--cls-det`, `--cls-adj`, `--cls-verbe`, `--cls-pron` dans `tokens.css`), flèches facultatives donneur → receveur; utilisable dans `explain` et les pages.                                                                                                                                                                                                                                | français, anglais (nouns/verbs)                                                                                                                                                                                                                     |
| G10 | **Chargement des données dans `check-skills.js`**             | MUST     | Charger `js/<matière>/data/*.js` avant `skills/`, et l'ordre réel des scripts d'`index.html` (aujourd'hui seuls `subject.js` et `skills/*.js` triés sont chargés). Règles de contenu par matière (`anglais.md` G15) : pour le français, unicité des choix après normalisation, aucun distracteur = mot réel, toute question à homophone a une phrase, tout `audio` dit un mot (pas un son isolé).                                                                                                                    | toutes les matières à données                                                                                                                                                                                                                       |
| G11 | **État de la voix**                                           | SHOULD   | Repris de `anglais.md` G1 (`M.voices.status('fr-CA')`) + champ d'habileté `needs: ['speech:fr']` : la dictée est grisée avec explication si aucune voix française; la page Parents affiche la voix trouvée et un bouton _Tester_.                                                                                                                                                                                                                                                                                    | français, anglais                                                                                                                                                                                                                                   |
| G12 | **Typographie française automatique**                         | COULD    | `M.typo(html)` insère l'espace insécable fine avant `? ! ; :` et dans « », appliqué par `renderQuestion` aux consignes, choix et passages; `check-skills.js` signale les espaces manquantes.                                                                                                                                                                                                                                                                                                                         | toutes                                                                                                                                                                                                                                              |
| G13 | **Lecture automatique des consignes**                         | COULD    | Réglage parent « Lire les consignes à voix haute » : `renderQuestion` lit la consigne à l'affichage (sauf si `audio.autoplay` joue déjà) ; respecte la politique d'autoplay (`anglais.md` G7).                                                                                                                                                                                                                                                                                                                       | lecteurs débutants, toutes matières                                                                                                                                                                                                                 |

---

## 8. Risques, ambiguïtés et parades

| Risque                                                                                                             | Parade                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Synthèse vocale des sons isolés** (« ch », « gn », « eu » lus comme des lettres ou mal)                          | Jamais de son isolé en audio : mot-repère obligatoire; `sons.js` porte des prononciations de secours testées (`say`) pour les syllabes; vérification manuelle sur Windows (voix _Sylvie/Caroline fr-CA_), iPad (_Amélie_), Android (Google fr-CA); bouton 🔊 masqué sur une partie sans prononciation fiable. |
| Pas de voix fr-CA (seulement fr-FR) ou aucune voix                                                                 | G11 : diagnostic parents; la voix fr-FR reste acceptable pour les mots de la liste; habiletés audio grisées si aucune voix.                                                                                                                                                                                   |
| **Syllabes orales** : _e_ muet et réductions québécoises (« ch'val », « ch'peau », _école_ = 2 orales / 3 écrites) | `fr-syllabes` compte les syllabes **orales** et n'utilise que `sylSure: true`; les syllabes écrites n'apparaissent qu'avec `build` (lvl 2), clairement nommé « à l'écrit ».                                                                                                                                   |
| **Rimes** et voyelles québécoises (_patte/pâte_, _pomme/paume_, _lait/les_, _brin/brun_)                           | Table d'exclusions; une rime n'est proposée que si la clé `rime` est identique **et** hors exclusions; pas de rime en _é/è_ final.                                                                                                                                                                            |
| **Accents** : sévérité vs découragement                                                                            | Accents exigés quand l'habileté porte sur l'orthographe (règle du cadre), mais message ciblé (G4) et l'essai suivant reste possible; pas exigés pour les réponses de compréhension (qui sont en `choice`).                                                                                                    |
| Majuscules au clavier mobile                                                                                       | `text` insensible à la casse sauf noms propres et phrases (`caseSensitive: 'first'`); `autocapitalize` déjà désactivé.                                                                                                                                                                                        |
| **Homophones** en dictée (_vert/verre_, _mer/mère_)                                                                | Phrase de contexte obligatoire (données et liste du parent); `check-skills.js` bloque sinon.                                                                                                                                                                                                                  |
| **Vocabulaire régional** (_bas/chaussettes_, _souper_, _liqueur_, _tuque_, _dépanneur_)                            | Québécois par défaut; jamais un mot régional comme **distracteur** d'un mot standard; emoji évités si le nom varie (🧦).                                                                                                                                                                                      |
| Emoji ambigus ou rendus différemment (🐀 rat/souris, 🥤)                                                           | Drapeau `emOk` revu à la main; pas de question à image sans `emOk`.                                                                                                                                                                                                                                           |
| Classes de mots ambiguës (_la_ dét./pron., _porte_ nom/verbe)                                                      | Phrases étiquetées à la main; mots ambigus jamais cibles; « touche **un** nom » accepte tous les noms (G6).                                                                                                                                                                                                   |
| **Ordre des mots** : plusieurs ordres valides                                                                      | Gabarits sans complément de phrase mobile; sinon `accept` (G1).                                                                                                                                                                                                                                               |
| **Références des pronoms** dans les textes (cf. § 5.3)                                                             | Revue obligatoire : une question de substitution ou d'inférence n'a qu'une réponse défendable avec la phrase-preuve; relecture par un adulte de chaque texte.                                                                                                                                                 |
| Aller au-delà du programme (synonymes, accord du verbe, système _-er_)                                             | Exclus en cœur (§ 1.2); les énoncés « → » de 2e (adjectif, verbe, négation, _?/!_) seulement à lvl 1–2 avec indice.                                                                                                                                                                                           |
| **Programme actualisé 2027** (liste prescrite révisée, constituants de la phrase dès le 1er cycle)                 | Ids stables; champ `lo` versionnable (`lo2019`, `lo2027`); jalon J6 de mise à jour des `pda` et de la liste.                                                                                                                                                                                                  |
| Droits d'auteur                                                                                                    | Textes, comptines et phrases originaux; la Liste orthographique sert de **liste de mots** (faits), sans reproduire les activités ni la mise en page du MEQ; source citée aux parents.                                                                                                                         |
| Vie privée (liste du parent)                                                                                       | Stockage local seulement; aucun envoi réseau; export manuel.                                                                                                                                                                                                                                                  |

---

## 9. Plan d'implantation (jalons ordonnés)

| Jalon                              | Contenu                                                                                                                                                                                                                                                | Critère de fin                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| **J0 — Cadre**                     | G1 `build`, G2 choix audibles, G3 données/outils parents/disponibilité, G4 `text` fin, G10 `check-skills` + données; exemples dans `M.FORMAT_SAMPLES`; `framework.md` à jour (formats, champs)                                                         | Guide de style : chaque ajout démontré; `node tools/check-skills.js` OK; maths inchangées                     |
| **J1 — Squelette et sons**         | `subject.js` (7 domaines), `sons.js`, `mots.js` (200 premiers mots : liste 1re + appui), `_commun.js`; habiletés `fr-syllabes`, `fr-rimes`, `fr-entendre-son`, `fr-sons-ecrits`; page `fr-carte-sons`; G7 `wordParts`                                  | Revue audio sur 3 appareils; chaque son a un mot-repère validé                                                |
| **J2 — Orthographe**               | `mots.js` complet (≈ 550), `familles.js`; `fr-dictee`, `fr-bonne-orthographe`, `fr-lettres-muettes`, `fr-majuscule-apostrophe`; page `fr-bien-ecrire`; G5 audio en séquence, G8 progression par élément                                                | Aucun distracteur = mot réel (lint); dictée de 20 mots testée par l'enfant                                    |
| **J3 — Ma liste de la semaine**    | Outil parents, `fr-ma-liste`, page Étudier, bilan par mot; G11 état de la voix                                                                                                                                                                         | Saisie d'une vraie liste de classe → pratique en < 1 minute; liste conservée après « Effacer la progression » |
| **J4 — Grammaire, phrase, verbes** | `phrases.js`, `verbes.js`; `fr-classes-mots`, `fr-genre-nombre`, `fr-accords-gn`, `fr-phrase-ponctuation`, `fr-ordre-mots`, `fr-etre-avoir`, `fr-verbes-frequents`; pages `fr-classes-mots`, `fr-accords`, `fr-la-phrase`, `fr-verbes-present`; G6, G9 | Mots ambigus jamais cibles (lint); 3 niveaux par habileté vérifiés                                            |
| **J5 — Lecture**                   | `textes.js` (24 textes, relus par un adulte); `fr-lire-mots`, `fr-lire-phrases`, `fr-comprendre-texte`, `fr-ordre-histoire`; page `fr-lire-detective`; écoute seule (G5)                                                                               | Chaque question a une preuve et une seule réponse défendable                                                  |
| **J6 — Vocabulaire et finition**   | `fr-alphabet`, `fr-familles-mots`, page `fr-alphabet-dico`; COULD G12–G13; section Français dans `docs/curriculum.md`; essais à 390 px et 1100 px                                                                                                      | Aucune erreur console; parcours complet sur téléphone et tablette                                             |
| **J7 — Après 2027**                | Mise à jour `pda` selon le programme actualisé et la liste prescrite; enrichissement facultatif (synonymes/contraires, ordre alphabétique à la 2e lettre) marqué « 3e année »                                                                          | Ids inchangés; progression conservée                                                                          |
