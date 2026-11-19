# HLD — Anglais, langue seconde (programme de base, 1er cycle)

> Document de conception de haut niveau (aucun code). Matière `anglais`, préfixe d'identifiants `en-`.
> S'appuie entièrement sur le cadre commun ([`docs/framework.md`](../framework.md)) : formats de questions, `M.ui`, voix `M.say`.
> Tout besoin non couvert est décrit au § 7 comme **manque du cadre** (générique, réutilisable par les autres matières).

Public : enfant de 7 ans, francophone, 2e année (fin du 1er cycle). **Les consignes sont en français** (l'enfant lit le
français); **l'anglais est entendu** (voix en-CA) et **montré** (mot écrit à côté d'une image), jamais exigé à l'écrit.

---

## 1. Portée et alignement sur le programme

### 1.1 Ce que dit le programme (sources officielles)

| Élément | Contenu pour le 1er cycle | Source |
|---|---|---|
| Compétences | **C1 — To act on understanding of texts** (pierre angulaire, 60 %) et **C2 — To communicate orally in English** (40 %) | Programme 1er cycle ; Cadre d'évaluation |
| Approche | Programme **oral** : « students are spoken to in English only right from the start »; on apprend en écoutant, imitant, chantant, jouant, interagissant, racontant | Programme 1er cycle, Introduction |
| Lecture / écriture | « ne formule **aucune attente** à l'égard de la lecture et de l'écriture » (lettre de présentation); « Students' reading and writing skills **will not be evaluated** » | Programme 1er cycle, p. 3 |
| Lecture autonome | « There are **no expectations** in Cycle One for students to read texts on their own » | Progression des apprentissages, cat. 4 |
| Conventions linguistiques | **Aucune** catégorie Language Conventions au 1er cycle (pas de grammaire ni d'orthographe); on développe « an ear for English » (rythme, intonation) | Progression des apprentissages, cat. 3 |
| Catégories de savoirs | **Contextual Language**, **Strategies**, **Cultural Elements** | Progression des apprentissages, Introduction |
| Contextual Language | *Routines* (questions et énoncés courants, consignes, réponses aux consignes, réponses chorales ludiques, encouragements « Hooray! Good job! »); *Language related to songs, rhymes and stories* (personnages, actions, objets, lieux, événements, passages récurrents); *Repertoire* : action words (Stand up. Come here.), objects, people, needs (Washroom, please?), ideas (I like blue), courtesy (Hi! Please. Thank you. Sorry! Bye!), pair work (My turn/your turn), description (Big blue pants) | Programme 1er cycle, Essential Knowledge |
| Répertoire | Le répertoire est **personnel** : « not targeted by the teacher ahead of time » — il n'y a **pas de liste de vocabulaire prescrite** | Programme 1er cycle, Essential Knowledge |
| Stratégies | Compensatoires : demander de l'aide/répétition, geste. D'apprentissage : coopération, attention dirigée, **inférence** (images, mots connus, mots apparentés), **réponse physique (TPR)**, pratique, **prédiction**, prise de risque, autorégulation, autoévaluation, connaissances antérieures, ressources | Programme 1er cycle, Strategies |
| Éléments culturels | Comptines, chansons à gestes, histoires « written for native speakers of English » (ex. comptines traditionnelles, albums jeunesse) | Programme 1er cycle, Cultural Elements |
| Fin de cycle (C1) | Identifie **oralement** les éléments clés et événements principaux, avec appui visuel; montre sa compréhension d'abord **non verbalement** (gestes, images), puis verbalement | Programme 1er cycle, End-of-Cycle Outcomes |

Références :
- Programme ALS, 1er cycle (MEQ, 2006) : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-anglais-langue-seconde-1er-cycle-primaire-AN.pdf>
- Progression des apprentissages ALS, primaire (2009) : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-anglais-langue-seconde-primaire-AN.pdf>
- Cadre d'évaluation des apprentissages ALS, primaire (2011) : <https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/cadres-evaluation/primaire/anglais/PFEQ-cadre-evaluation-anglais-langue-seconde-primaire-AN.pdf>
- Page officielle : <https://www.quebec.ca/en/education/preschool-elementary-and-secondary-schools/programs-training-evaluation/quebec-education-program/elementary/english-second-language>

### 1.2 Attendu vs hors portée

| ✅ Dans la portée (ce que l'appli entraîne) | ❌ Hors portée au 1er cycle (ne pas faire) |
|---|---|
| **Comprendre à l'oral** des mots, des groupes de mots et de courtes phrases entendus (C1, C2 « decodes messages ») | **Épeler / écrire** des mots anglais → **format `text` interdit** pour l'anglais |
| Montrer sa compréhension **non verbalement** : toucher une image, une partie du corps (TPR), classer, ordonner | **Lire seul** un texte anglais : la réponse ne doit jamais dépendre de la seule lecture d'un mot anglais |
| Éléments clés et événements d'une **courte histoire entendue** (qui, quoi, où, ordre) | Grammaire, conjugaison, pluriels, articles (aucune catégorie Language Conventions) |
| **Langage fonctionnel** : politesse, salutations, besoins, consignes de classe, sentiments, encouragements | Production orale **notée** (la reconnaissance vocale n'est ni fiable à 7 ans ni prévue au cadre) |
| **Rythme et sons** : comptines et chants originaux, rimes entendues | Phonétique explicite, paires minimales difficiles (*ship/sheep*), alphabet anglais épelé |
| **Stratégies** : utiliser l'image pour deviner, mots apparentés (*lion, piano, banana*), demander « Can you repeat, please? » | Liste de vocabulaire à « maîtriser » : le répertoire est personnel; nos thèmes sont de l'**exposition** |
| Mot anglais **affiché** à côté de l'image, toujours **avec son 🔊** (exposition à l'écrit, comme les affiches de classe) | Traduction mot à mot exigée (fr → en écrite); questions dont la réponse est un mot anglais écrit sans audio |

**Écart assumé avec le programme.** Le programme exige des textes *authentiques* (écrits pour des anglophones) et une classe
entièrement en anglais. L'appli est un **complément maison** : textes et comptines **originaux** (droits d'auteur), consignes en
français (l'enfant travaille seul ou avec un parent qui ne parle pas forcément anglais). On compense par beaucoup d'écoute,
des consignes très courtes et des contenus calqués sur les *genres* du programme (comptines à gestes, histoires répétitives).

---

## 2. Matière et domaines

Matière : id `anglais`, titre « Anglais », icône **🗣️** (pas de drapeau britannique pour de l'anglais canadien), couleur
`#118ab2` (le jeton `--subj-anglais` existe déjà dans `tokens.css`), desc « Écouter, comprendre et parler en anglais ».

| id | Titre (UI) | Icône | Contenu | Référence (`pda`) |
|---|---|---|---|---|
| `en-mots` | Mes mots en anglais | 🍎 | Vocabulaire thématique entendu : couleurs, nombres, animaux, nourriture, vêtements, famille, école, météo et saisons, corps | Contextual Language — Repertoire : objects, people, description; C2 « decodes messages » |
| `en-bouger` | J'écoute et je bouge | 🙋 | Consignes et mots d'action (TPR) : « Touch your nose », « Stand up », trouver dans une scène | Contextual Language — Routines : instructions, action words; Stratégie : physical response |
| `en-parler` | Parler en anglais | 💬 | Langage fonctionnel : salutations, politesse, besoins, sentiments, questions courantes | Contextual Language — Courtesy, needs, ideas, pair work; C2 |
| `en-histoires` | Histoires et comptines | 📖 | Courtes histoires originales lues à voix haute, comptines et rimes | C1 — Language related to songs, rhymes and stories (key elements, events, recurrent passages) |

Thèmes de vocabulaire (données, pas des domaines) : `colours`, `numbers`, `animals`, `food`, `clothes`, `family`, `school`,
`body`, `weather`, `seasons`, `feelings`, `toys`, `actions`.

---

## 3. Catalogue des habiletés (16)

Conventions communes à toutes les habiletés `en-` :
- **Consigne en français**, courte, au « tu » ; l'anglais est dans `audio` (🔊 Écoute / 🐢 Lentement, déjà dans le cadre).
- **Pas de mot anglais dans la consigne lue par la voix française** (sinon accent français) ; si nécessaire → manque G4.
- `hint` : en français, renvoie à une **stratégie** (« Regarde bien l'image », « Écoute encore avec 🐢 », « Ça ressemble à un mot français ! »).
- `explain` : en français + le mot anglais avec bouton 🔊 (`M.ui.speak(word,{lang:'en-CA'})` fonctionne déjà dans du html) :
  « 🔊 *cat*, c'est le **chat** 🐱. » Jamais de règle de grammaire.
- Distracteurs : **même thème** (pour que l'image seule ne trahisse pas la réponse), jamais `sameAs`/homophones (§ 5.2).
- `lvl 0` = mots très fréquents, 2–3 choix ; `lvl 1` = attendu de fin de 2e année, 4 choix ; `lvl 2` = défi (6 choix, phrase plus
  longue, deux attributs, thèmes mélangés), sans dépasser le 1er cycle.

| # | id | Titre | Domaine | Description (`desc`) | Programme | Format(s) | Audio | Visuels | lvl 0 / 1 / 2 | Données |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `en-ecoute-image` ⭐ starter | Écoute et touche l'image | en-mots | Écoute un mot anglais et touche la bonne image. | Repertoire : objects, people; C2 decodes messages | `choice` (labels emoji/SVG) | `audio` = mot (avec article : « a cat ») autoplay | Emoji ou SVG du lexique | 3 choix thèmes lvl0 / 4 choix lvl0–1 / 6 choix, thèmes mélangés | vocab |
| 2 | `en-couleurs` | Les couleurs | en-mots | Écoute la couleur, puis une petite description. | Repertoire : description (« Blue pants. Big blue pants. ») | `choice` | « red » → « a red ball » → « a big blue ball » | Pastilles SVG (pas d'emoji : 🍎 n'est pas toujours rouge) ; objets SVG recolorables | couleur seule, 4 / couleur + objet, 4 / taille + couleur + objet, 6 | vocab colours + objets SVG colorables |
| 3 | `en-nombres` | Les nombres en anglais | en-mots | Écoute un nombre et écris-le en chiffres. | Repertoire; routines (counting) | `number` (pavé numérique — chiffres, pas d'anglais écrit) ; `choice` (collection) | « seven » | Collections d'emoji (lvl 2 : « How many ducks? » + image) | 0–10 / 0–20 / « How many…? » compter une collection 1–12 | vocab numbers |
| 4 | `en-ecoute-liste` | Écoute plusieurs mots | en-mots | Touche toutes les images que tu entends. | Directed attention; decodes messages | `multi` → `order` (lvl 2) | Suite « cat… apple… dog » (pauses, cf. G8) | Grille d'emoji 6–8 | 2 mots parmi 6 / 3 parmi 8 / 3 dans l'ordre entendu (`order`) | vocab |
| 5 | `en-associer` | Le mot et l'image | en-mots | Associe chaque mot anglais à son image. | Repertoire; using resources | `match` | Chaque mot de gauche se fait entendre au toucher (G3) | Gauche : « 🔊 cat » ; droite : emoji | 3 paires / 4 / 5 paires d'un même thème | vocab |
| 6 | `en-trier` | Range les mots | en-mots | Écoute chaque mot et range-le dans la bonne boîte. | Repertoire (categories); inferencing | `sort` | Chaque élément se fait entendre (G3) ; boîtes : « Food », « Clothes » + 🔊 | Élément = emoji + mot | 2 boîtes, 4 éléments / 2 boîtes, 6 / 3 boîtes, 6 | vocab (theme) |
| 7 | `en-corps` | Touche ton nez ! | en-bouger | Écoute « Touch your… » et touche la bonne partie du corps. | Action words; physical response (TPR) | `hotspot` | « Touch your nose. » autoplay | SVG enfant (zones `data-hot` : head, eyes, nose, mouth, ears, hair, arms, hands, legs, knees, feet, toes, shoulders, tummy) | 6 parties grosses / 10 / 14 + « Touch your left… » exclu (gauche/droite trop ambigu en miroir) | SVG corps (art) |
| 8 | `en-trouve` | Trouve dans l'image | en-bouger | Écoute et touche l'objet dans la scène. | Instructions; key elements; description | `hotspot` | « Touch the red ball. » / « Where is grandma? Touch grandma. » | Scènes SVG : chambre, classe, ferme, famille, hiver | objet seul / objet + couleur / qui dans la famille | scènes (art) |
| 9 | `en-actions` | Jacques a dit… en anglais | en-bouger | Écoute la consigne et touche l'enfant qui la fait. | Routines : instructions, action words (Stand up. Come here.) | `choice` (images de poses) | « Stand up! », « Clap your hands! », « Raise your hand! » | SVG de poses (bonhomme) — pas d'emoji pour les actions | 3 poses très différentes / 4 / 6 dont « Sit down » vs « Stand up » | actions + poses SVG |
| 10 | `en-reagir` | Quand dit-on ça ? | en-parler | Écoute l'expression et choisis la situation. | Courtesy, needs; C2 reacts to messages | `choice` (situations en français + emoji) | « Thank you! » | Emoji de situation (🎁 « On te donne un cadeau ») | 2–3 choix politesse / 4, besoins / 4, sentiments + classe | expressions |
| 11 | `en-que-dire` | Qu'est-ce que tu dis ? | en-parler | Lis la situation et choisis ce qu'on dit en anglais. | Courtesy, needs, pair work; C2 initiates messages | `choice` avec **audio par choix** (G2) | Chaque choix se fait entendre ; lvl 2 : choix audio seuls (étiquettes masquées) | Situation : emoji + phrase française ; choix : expression anglaise + 🔊 | 2 choix / 3 / 3 audio seuls | expressions |
| 12 | `en-questions` | Réponds à la question | en-parler | Écoute la question et choisis la bonne réponse. | Routines : common inquiries (What's your name? How are you? What colour is it?) | `choice` (réponses = images ou phrases avec 🔊, G2) | Question « What colour is it? » + image d'un objet ; réponses entendues | Image de l'objet ou du personnage | réponse = image / réponse courte entendue « It's blue. » / 3 réponses audio | qa (question → réponses) |
| 13 | `en-sentiments` | Comment ça va ? | en-parler | Écoute comment se sent l'enfant et touche le bon visage. | Ideas (« Happy, today. »); feelings | `choice` | « I'm tired. » / « Max is scared. » | Emoji visages (😀😢😠😴😨) | 3 sentiments / 5 / phrase avec raison « I'm sad. I lost my ball. » → visage | expressions (feelings) |
| 14 | `en-histoire` | Écoute une histoire | en-histoires | Écoute la petite histoire et réponds aux questions. | C1 — key elements (characters, objects, places), events | `choice` (images), `tf` (Yes/No entendu) | `passage` en-CA (lu par 🔊, pas d'autoplay) + `audio` pour la question anglaise lvl 1–2 | Une image par phrase (G10) | qui/quoi en images / question anglaise oui-non / « why/where » simple + vocabulaire du texte | stories |
| 15 | `en-histoire-ordre` | Remets l'histoire en ordre | en-histoires | Écoute l'histoire et place les images dans l'ordre. | C1 — events, sequencing; retelling | `order` (images) | `passage` en-CA ; chaque image se fait entendre (G3) | Emoji/SVG d'événements | 3 images / 4 / 5 | stories (events) |
| 16 | `en-rimes` | Ça rime ! | en-histoires | Écoute la comptine et trouve le mot qui rime. | C1 — rhythmicality, song lyrics and rhymes | `choice` (images avec audio, G2) | Vers de la comptine, puis « Which one rhymes with cat? » | Emoji des mots | 3 choix, rime franche (cat/hat) / 4 / compléter un vers de comptine connue (mot manquant entendu en images) | chants + rhyme sets |

Détails de rétroaction par famille :

| Famille | Indice (1re erreur) | Explication (après) |
|---|---|---|
| Écoute → image (1–4, 13) | « Écoute encore avec 🐢. » + rappel du thème (« C'est un animal. ») | « 🔊 *dog*, c'est le **chien** 🐶. » |
| TPR (7–9) | « Montre-le sur toi d'abord ! » (stratégie : réponse physique) | « 🔊 *Touch your knees* : on touche ses **genoux**. » |
| Fonctionnel (10–13) | « Pense à ce que tu dirais en français. » | « 🔊 *Thank you!* veut dire **merci**. On le dit quand… » |
| Histoires (14–16) | « Réécoute la phrase avec l'image 🎿. » | Phrase de l'histoire en anglais + 🔊 + sens en français. |

`pda` (affiché aux parents) — gabarit : `ALS 1er cycle — C1 Agir sur sa compréhension de textes : éléments clés (personnages, objets)`
ou `ALS 1er cycle — C2 Communiquer oralement : Contextual Language, courtesy`.

---

## 4. Pages « Apprendre » (7)

Toutes en français (explications au « on »), mots anglais en tuiles `M.ui.vocab` (lang `en-CA`, `note` = sens français).

| id | Titre | Domaine | Contenu (composants) | Habiletés liées |
|---|---|---|---|---|
| `en-hello` | Hello ! Dire bonjour | en-parler | `section` Bonjour/Au revoir (`vocab` : Hi!, Hello!, Good morning!, Bye!, See you!) ; Politesse (Please, Thank you, Sorry, Excuse me) ; mini-dialogue « Max et Lily » en `reading` lang en-CA (tap-to-hear) ; `flashcards` situation → expression ; `miniQuiz` 3 questions | 10, 11, 12 |
| `en-mots-themes` | Mes premiers mots | en-mots | `tabs` par thème (🎨 couleurs, 🔢 nombres, 🐾 animaux, 🍎 nourriture, 🧤 vêtements, 👪 famille, ☀️ météo) ; chaque onglet = `vocab` + `flashcards` image → mot ; callout stratégie « mots amis » (*lion, banana, piano, zebra*) | 1, 2, 3, 4, 5, 6 |
| `en-corps` | Head, nose, toes ! | en-bouger | SVG du corps où chaque partie se fait entendre (hotspot non noté / `reading` des étiquettes) ; **chant original** « Touch your head » (§ 4.1) avec `reading` vers par vers et 🐢 ; callout « Fais les gestes en même temps ! » | 7 |
| `en-classe` | En classe d'anglais | en-bouger | Consignes de classe (Stand up, Sit down, Listen, Look, Raise your hand, Come here, Line up) : `vocab` avec SVG de poses ; encouragements (Good job! Super! Hooray!) ; besoins (Washroom, please? Can you repeat, please?) ; jeu « Castor a dit… » en `miniQuiz` | 9, 11 |
| `en-emotions-meteo` | Comment ça va ? Quel temps fait-il ? | en-parler | `vocab` sentiments (happy, sad, angry, tired, scared) ; météo (sunny, rainy, snowy, windy, cloudy, cold, hot) ; dialogue « How are you? — I'm happy! » ; routine « What's the weather today? — It's snowy! » | 13, 1 |
| `en-histoires` | L'heure du conte | en-histoires | Liste des histoires (`tabs` ou cartes) ; pour chacune : images par phrase + `reading` lang en-CA (chaque mot se lit au toucher) + 🔊 histoire entière + `miniQuiz` 3 questions | 14, 15 |
| `en-comptines` | Comptines et rimes | en-histoires | 4–6 **comptines originales** : `reading` lang en-CA ligne par ligne, 🔊 normal et 🐢 ; « mots qui riment » en `vocab` par paires (cat/hat, sun/one, bee/tree) ; callout stratégie « Répète avec la voix » | 16 |

Une 8e page **COULD** : `en-strategies` « Comment j'apprends l'anglais » (écouter, regarder l'image, deviner, mots amis, demander de
répéter, faire le geste) — pictogrammes à la manière de `M.ui.demarche` (paramétrable avec d'autres étapes, c'est déjà prévu par
`demarche(steps)`).

### 4.1 Comptines originales (exemples, écrites pour ce projet)

**Touch your head** (chant à gestes, rythme 4 temps)
> Touch your head, touch your nose, / Touch your knees and touch your toes. /
> Clap, clap, clap! Stamp, stamp, stamp! / Turn around and… sit down! 

**Colours in the snow** (chant de couleurs)
> Red, red, my hat is red. / Blue, blue, my mittens are blue. /
> Green, green, the tree is green. / White, white, the snow is white!

**Five little beavers** (comptine à rebours)
> Five little beavers swim in the lake. / One goes home to eat some cake. /
> Four little beavers… *(jusqu'à « No little beavers! »)*

Règle : aucune reprise de paroles protégées ni de mélodie identifiable. Les comptines traditionnelles du domaine public citées par
le programme (*Itsy Bitsy Spider*, *London Bridge*, *Head, Shoulders, Knees and Toes*) pourraient être ajoutées plus tard après
vérification, mais la V1 ne contient que des textes originaux.

---

## 5. Plan des données

### 5.1 Arborescence

```
js/anglais/subject.js            matière + 4 domaines
js/anglais/data/vocab.js         banque de mots (M.EN.VOCAB)
js/anglais/data/expressions.js   langage fonctionnel (M.EN.EXPR) + questions/réponses (M.EN.QA)
js/anglais/data/stories.js       histoires originales + questions (M.EN.STORIES)
js/anglais/data/chants.js        comptines originales + ensembles de rimes (M.EN.CHANTS, M.EN.RHYMES)
js/anglais/art.js                dessins SVG partagés : corps, poses, scènes, vêtements d'hiver, objets recolorables
js/anglais/skills/mots.js        habiletés 1–6
js/anglais/skills/bouger.js      habiletés 7–9
js/anglais/skills/parler.js      habiletés 10–13
js/anglais/skills/histoires.js   habiletés 14–16
js/anglais/learn/*.js            pages Apprendre (§ 4)
```

Ordre de chargement (framework § 1) : cadre → `subject.js` → `data/` → `art.js` → `skills/` → `learn/`.

### 5.2 Banque de vocabulaire (`M.EN.VOCAB`)

Taille cible : **≈ 160 mots** (V1 : 90 mots `lvl 0–1`). Répartition : couleurs 11, nombres 0–20 (21), animaux 22 (dont
québécois : beaver, moose, bear, raccoon, deer), nourriture 16, vêtements 14 (dont hiver : hat/tuque, mittens, boots, scarf,
snowsuit, coat), famille 8, école 12, corps 14, météo 7, saisons 4, sentiments 6, jouets 8, actions 12.

| Champ | Rôle |
|---|---|
| `id` | Identifiant stable (`cat`, `mittens`) |
| `word` | Mot affiché, orthographe **canadienne** (*colour*, *grey*) |
| `say` | Texte lu (défaut : `word`) — sert à forcer la bonne prononciation (« a cat », « the wind ») |
| `emoji` / `art` | Image : emoji **ou** nom d'un dessin de `art.js` (obligatoire si l'emoji est ambigu) |
| `fr` | Sens français (note de tuile, explication) |
| `theme` | Thème (`animals`…) |
| `lvl` | 0 = très fréquent, 1 = attendu, 2 = défi |
| `sameAs` | Mots qui ne doivent **jamais** être distracteurs l'un de l'autre (image proche : *cold*/*snowy*, *mom*/*woman*) |
| `homophones` | Mots qui sonnent pareil (*two/too*, *pear/pair*, *eight/ate*, *sun/son*) → exclus du même jeu de choix |
| `cognate` | `true` si mot ami (*lion*, *banana*, *piano*) → page stratégies |
| `picture` | `'ok'` (image non ambiguë) / `'context'` (seulement avec le mot ou en scène, ex. *brother*) |

**15 exemples**

| id | word | say | image | fr | theme | lvl | remarques |
|---|---|---|---|---|---|---|---|
| `cat` | cat | a cat | 🐱 | chat | animals | 0 | rime : hat |
| `dog` | dog | a dog | 🐶 | chien | animals | 0 | |
| `beaver` | beaver | a beaver | 🦫 | castor | animals | 1 | mascotte Castor |
| `moose` | moose | a moose | art `moose` | orignal | animals | 2 | 🫎 trop récent (risque de carré vide) → SVG |
| `apple` | apple | an apple | 🍎 | pomme | food | 0 | pas dans un jeu « couleurs » |
| `milk` | milk | milk | 🥛 | lait | food | 0 | |
| `red` | red | red | art `swatch:red` | rouge | colours | 0 | pastille SVG |
| `blue` | blue | blue | art `swatch:blue` | bleu | colours | 0 | homophone *blew* (sans risque : non imageable) |
| `seven` | seven | seven | 7 + 7 points | sept | numbers | 0 | réponse via pavé `number` |
| `mittens` | mittens | mittens | art `mittens` | mitaines | clothes | 1 | 🧤 = gants → SVG obligatoire |
| `hat` | hat | a hat | art `tuque` | tuque, chapeau | clothes | 0 | 🎩 = haut-de-forme → SVG |
| `mom` | mom | mom | 👩 + art `family` | maman | family | 0 | `picture:'context'`, `sameAs: ['woman']` |
| `nose` | nose | your nose | zone `nose` du SVG corps | nez | body | 0 | homophone *knows* (sans risque) |
| `snowy` | snowy | It's snowy. | 🌨️ | il neige | weather | 1 | `sameAs: ['cold']` |
| `happy` | happy | I'm happy. | 😀 | content | feelings | 0 | |

### 5.3 Expressions fonctionnelles (`M.EN.EXPR`, ≈ 40) et questions (`M.EN.QA`, ≈ 15)

| Champ | Exemple |
|---|---|
| `id`, `en`, `say?` | `thanks`, « Thank you! » |
| `kind` | `greeting` · `courtesy` · `needs` · `classroom` · `cheer` · `feelings` · `pairwork` |
| `situation` (fr) + `emoji` | « Ton ami te donne un cadeau. » 🎁 |
| `fr` | « Merci ! » |
| `exclusive` | expressions mutuellement exclusives pour la situation (évite *Hi!* et *Hello!* dans le même choix) |

`M.EN.QA` : `{ q: 'What colour is it?', answers: [{ en: "It's blue.", pic }], distractors: [...] }`
(questions : *What's your name? How old are you? How are you? What colour is it? What's this? How many…? What's the weather today?*).

### 5.4 Histoires (`M.EN.STORIES`, 8 à 10)

Format : `{ id, title, lvl, sentences: [{ en, pic }], vocab: [ids], questions: [...] }` — 3 phrases (lvl 0), 4–5 (lvl 1), 6 (lvl 2);
phrases courtes, présent simple, **répétitions** (comme les albums du programme), contextes québécois (hiver, cabane à sucre,
patinoire, école), prénoms variés. Chaque question indique son format, sa réponse et son niveau.

**Histoire exemple complète — « Max and the Snow » (lvl 1)**

| # | Phrase (en-CA) | Image | Sens (pour le parent) |
|---|---|---|---|
| 1 | Max is a little beaver. | 🦫 | Max est un petit castor. |
| 2 | It is winter. It is cold and snowy. | ❄️🌨️ | C'est l'hiver. Il fait froid et il neige. |
| 3 | Max puts on his red hat and his blue mittens. | art `tuque` rouge + `mittens` bleues | Max met sa tuque rouge et ses mitaines bleues. |
| 4 | Max sees his friend Lily. Lily is a rabbit. | 🐰 | Max voit son amie Lily. Lily est un lapin. |
| 5 | "Hello, Lily! Let's play!" | 👋 | « Bonjour Lily ! Viens jouer ! » |
| 6 | They make a big snowman. Max is happy! | ⛄😀 | Ils font un gros bonhomme de neige. Max est content ! |

Questions (une par carte ; le `passage` est le même, lu par 🔊 sur demande ; images de la colonne « Image » au-dessus) :

| # | lvl | Format | Consigne (fr) | Audio en-CA | Choix | Réponse | Indice / explication |
|---|---|---|---|---|---|---|---|
| Q1 | 0 | `choice` | Qui est Max ? | — | 🦫 / 🐰 / 🐻 | 🦫 | « Écoute la 1re phrase. » / « *Max is a little beaver* : Max est un castor. » |
| Q2 | 0 | `choice` | Quelle saison est-ce ? | — | ❄️ / ☀️ / 🍁 / 🌷 | ❄️ | « *It is winter.* *Winter* = hiver. » |
| Q3 | 1 | `tf` (Oui/Non, G9) | Écoute la question et réponds. | « Is Max sad? » | 👍 Yes / 👎 No | No | « Regarde la dernière image 😀. » / « *Max is happy!* Max est content, pas triste. » |
| Q4 | 1 | `choice` | De quelle couleur est la tuque de Max ? | « What colour is Max's hat? » | pastilles rouge / bleu / vert | rouge | « *his red hat* » |
| Q5 | 1 | `choice` (G2 audio par choix) | Que dit Max à Lily ? | — | 🔊 « Hello, Lily! » / 🔊 « Goodbye, Lily! » / 🔊 « Sorry, Lily! » | Hello | « Max veut jouer : il dit bonjour. » |
| Q6 | 2 | `order` (`en-histoire-ordre`) | Place les images dans l'ordre de l'histoire. | — | ❄️ / 🧤(art) / 🐰 / ⛄ | ❄️ → mitaines → 🐰 → ⛄ | « Qu'est-ce que Max fait en premier ? » |
| Q7 | 2 | `choice` | Écoute le mot et touche l'image. | « snowman » | ⛄ / 🐰 / 🌲 / 🏠 | ⛄ | « *snow* = neige, *man* = homme. » |

### 5.5 Comptines et rimes (`M.EN.CHANTS`, `M.EN.RHYMES`)

`M.EN.CHANTS` : `{ id, title, lines: [str], gestures?: [emoji] }` — 5–6 comptines originales (§ 4.1).
`M.EN.RHYMES` : ensembles `{ target: 'cat', rhymes: ['hat','bat'], nonRhymes: ['dog','sun','pig'] }`, tous imageables, aucun
homophone, rimes **franches** (même voyelle et même finale à l'oreille).

### 5.6 Dessins (`art.js`)

Emoji en premier ; **SVG en ligne** quand l'emoji est absent, ambigu ou récent : corps d'enfant (zones `data-hot`), 12 poses
(stand up, sit down, jump, clap, raise your hand, wave, point, run, sleep, eat, drink, read), tuque, mitaines, habit de neige,
bottes, foulard, pupitre, gomme à effacer, objets recolorables (ballon, chandail, auto, maison — taille S/L), scènes (chambre,
classe, ferme, famille, hiver). Ces dessins sont candidats au registre partagé `M.art` (G14).

---

## 6. Stratégie audio

### 6.1 État actuel du cadre

`core.js` choisit une voix anglaise `en-CA` → `en-US` → toute `en*`, met `u.lang`, `rate` 0,9 ; `audio` de question offre
🔊 Écoute / 🐢 Lentement (rate 0,6) et un **autoplay** systématique ; `passage.lang` est respecté ; la consigne est toujours lue
en `fr-CA` ; `M.ui.vocab`/`flashcards`/`reading` acceptent `lang`.

### 6.2 Disponibilité des voix

| Plateforme | Voix anglaise attendue | Remarques |
|---|---|---|
| Windows + Chrome | Voix système (souvent en-US : David, Zira, Mark) + voix réseau Google | Un Windows **en français** peut n'avoir **aucune** voix anglaise locale ; en-CA rare (pack de langue à ajouter) |
| Windows + Edge | Voix « Online (Natural) », dont en-CA | Meilleure qualité ; nécessite Internet |
| iPad / iPhone (tous navigateurs = WebKit) | Voix de Réglages → Accessibilité → Contenu énoncé | Liste parfois incomplète ; voix « améliorées » à télécharger |
| Android (Chrome) | Moteur TTS de l'appareil (Google, Samsung) | Codes de langue avec `_` (`en_CA`) ; Chrome Android peut **ignorer la voix choisie** et parler dans la langue par défaut |
| Chromebook | Voix Google en-US/en-GB | Correct |

Sources : MDN `getVoices()` <https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices>, MDN `voiceschanged`
<https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event>, bogue Chromium 331977824
<https://issues.chromium.org/issues/331977824>.

**Conséquence** : en-CA est souhaité mais **en-US est acceptable** (prononciation très proche). Ce qui est **inacceptable** :
de l'anglais lu par une voix française (modèle sonore faux, contraire au but du programme « develop an ear for English »).

### 6.3 Règles

| Sujet | Règle |
|---|---|
| Détection | Au chargement de la matière : interroger la disponibilité (G1). États : `exact` (en-CA), `fallback` (autre en-*), `none` |
| Aucune voix anglaise | Bandeau dans la matière (callout `warn`) : « Ton appareil n'a pas de voix anglaise. Demande à un adulte. » + page Parents avec la marche à suivre par système et un bouton « Tester la voix ». Les habiletés `needs: 'speech:en'` sont **verrouillées** (G5) ; restent accessibles les pages Apprendre (en mode « parent lecteur » COULD) |
| Voix douteuse | Bouton « Tester la voix » (phrase « Hello! I am a beaver. ») chez les parents, et préférence « voix anglaise » si plusieurs |
| Débit | Normal 0,85 pour l'anglais ; 🐢 0,6 ; jamais plus lent (déforme la voix) |
| Mots isolés | Lire avec un article ou une mini-phrase (« a cat », « your nose ») pour éviter l'épellation ou la mauvaise prononciation (*read*, *live*, *wind*, *bow* bannis) |
| Autoplay | Une seule lecture automatique des sons courts (≤ 3 s) à l'apparition de la question ; **jamais** pour les histoires (bouton 🔊) ; ne pas enchaîner consigne française + anglais automatiquement ; une seule fois par contenu dans une série (G7) ; respect du réglage parent « lecture automatique » |
| Listes | Pauses nettes entre les mots (G8) plutôt que des virgules dont l'effet dépend du moteur |
| Arrêt | `M.hush()` à chaque changement de question ou de page (existant) |
| Hors ligne | `file://` fonctionne si la voix est locale ; prévenir que les voix « Online/Natural » demandent Internet |
| Production orale | Non notée. COULD : « Répète après moi » (G12) — enregistrement local réécouté par l'enfant, rien n'est envoyé |

---

## 7. MANQUES DU CADRE (génériques)

Priorité : **MUST** = bloquant pour l'anglais V1 ; **SHOULD** = nettement meilleur, utile à d'autres matières ; **COULD** = plus tard.
Chaque ajout suit la règle du cadre : enregistré dans `core.js`/`formats.js`/`ui.js`, un exemple dans `M.FORMAT_SAMPLES`/guide
de style, documenté dans `framework.md`, validé par `tools/check-skills.js`.

| # | Nom | Prio | Spécification |
|---|---|---|---|
| G1 | **Disponibilité des voix** (`M.voices`) | MUST | API core : `M.voices.status(lang)` → `{ state: 'exact'|'fallback'|'none', name, local }` ; `M.voices.ready()` → promesse résolue après `voiceschanged` ou délai (~2 s) ; normaliser `_`→`-` et la casse ; mémoriser un choix de voix par langue (réglage parent). `M.say` retourne `false` et **ne parle pas** si la langue demandée n'a aucune voix de cette langue (au lieu de lire avec la voix par défaut). Page Parents : diagnostic + bouton « Tester » + aide par système |
| G2 | **Audio par choix** (« audio choices ») | MUST | Dans `choice`, `multi`, `order` : `choices[].say` + `choices[].lang` ajoutent un petit bouton 🔊 dans le coin du choix ; toucher 🔊 **joue sans sélectionner** ; `audioOnly: true` masque les étiquettes (affiche « 🔊 1 », « 🔊 2 »…) et exige d'avoir écouté au moins une fois ; clavier : chiffres = choisir, Maj+chiffre = écouter ; `validate` : `say` requis si `audioOnly` |
| G3 | **Audio des éléments** (match, sort, hotspot, order) | MUST | `pairs[].sayLeft/sayRight`, `items[].say`, `bins[].say`, `lang` commun ; jouer au toucher **en plus** de l'action normale (sélection/dépôt) ; `hotspot` : `answerSay` lu à la révélation |
| G4 | **Langue de la lecture de consigne** | MUST | `q.say` accepte une liste de segments `[{ text, lang }]` lus à la suite ; ou détection des `<span lang="en">` dans `prompt` pour lire ces passages avec la voix anglaise ; `sayLang` pour une consigne entièrement anglaise (niveau défi « consignes en anglais ») |
| G5 | **Prérequis d'appareil par habileté** | MUST | `registerSkill({ needs: ['speech:en'] })` ; tableau de bord : habileté grisée + raison ; `runSession`/révision entrelacée ignorent les habiletés non satisfaites ; `check-skills.js` vérifie que toute question avec `audio`/`say` anglais vient d'une habileté qui déclare le besoin |
| G6 | **Fabrique « écoute et choisis »** (`listen-choose`) | SHOULD | Assistant (pas un nouveau format) : à partir d'une banque `{id, say, label}`, d'une cible, d'un nombre de choix et de règles d'exclusion (`sameAs`, `homophones`, même thème) → produit une question `choice` avec `audio`, choix mélangés sans doublon, `explain` par défaut. Réutilisable en français (sons, dictée de mots) |
| G7 | **Politique d'autoplay** | SHOULD | `audio.autoplay: 'once' | true | false` + `audio.key` : ne rejoue pas automatiquement un contenu déjà entendu dans la série ; réglage parent global « lecture automatique » ; aucun autoplay avant le premier geste |
| G8 | **Lecture en séquence** | SHOULD | `M.say` accepte `[{ text, lang, pauseAfter }]` et renvoie une promesse de fin ; événement de mot/segment pour surligner (karaoké) ; option de deuxième voix (hauteur différente) pour les dialogues |
| G9 | **Étiquettes du format `tf`** | SHOULD | `labels: [{ label, say? }, …]` pour remplacer ✔️ Vrai / ✖️ Faux (👍 Yes / 👎 No) ; `answer` reste booléen |
| G10 | **Passage illustré et touchable** | SHOULD | `passage.lines: [{ text, pic }]` : une image par phrase ; `passage.tapToHear: true` réutilise le comportement de `M.ui.reading` (mot et phrase entendus au toucher) ; surlignage de la phrase en cours (avec G8) |
| G11 | **Glose bilingue** (`M.ui.gloss`) | SHOULD | `M.ui.gloss(word, fr, { lang })` : mot cible avec 🔊 ; toucher long ou second toucher affiche le sens français (infobulle accessible, pas de survol seul) ; utilisable dans `explain`, `hint`, pages Apprendre ; même composant pour les mots difficiles en français ou sciences |
| G12 | **Répète après moi** (`M.ui.echo`) | COULD | Composant non noté : 🔊 modèle → 🎙️ enregistrer (MediaRecorder, max 5 s) → ▶️ réécouter les deux ; tout reste sur l'appareil ; masqué si micro indisponible |
| G13 | **Encouragements dans la langue de la matière** | COULD | `registerSubject({ cheers: [{ text, lang }] })` : « Good job! », « Super! », « Hooray! » (listés au programme) lus à la réussite, à la place de la phrase française |
| G14 | **Registre de dessins partagé** (`M.art`) | COULD | `M.art.register(name, svgFn)` / `M.art.html(name, { color, size })` pour vêtements, météo, poses, corps, animaux absents des emoji ; réutilisé par sciences et univers social |
| G15 | **Règles de vérification par matière** | SHOULD | `check-skills.js` : règles déclarées par matière — pour `anglais` : format `text` interdit ; tout mot anglais affiché comme réponse a un audio ; pas deux choix avec le même emoji/`art` ; pas d'homophones ni de `sameAs` dans un même jeu de choix |

---

## 8. Risques, ambiguïtés et parades

| Risque | Exemple | Parade |
|---|---|---|
| Emoji ambigu ou faux ami | 🧤 = gants (pas mitaines), 🎩 = haut-de-forme, 🧢 = casquette, 👖 jeans/pants, 🐰 rabbit/bunny, 🦌 deer vs moose | Champ `picture` + SVG obligatoire (`art`) ; un seul mot canonique par image (*rabbit*) ; revue humaine de chaque image |
| Emoji absent ou différent selon l'appareil | 🫎 (orignal), 🪿 : carré vide sur vieux appareils | Liste blanche d'emoji ≤ Emoji 13 ; sinon SVG |
| Couleur portée par l'objet | 🍎 vert sur certains systèmes | Couleurs toujours en pastilles ou objets SVG coloriés |
| Image qui donne la réponse sans écouter | Choix « 🐱 / 🍎 / 🚗 » trop différents | Distracteurs du même thème dès lvl 1 ; consigne sans le mot écrit |
| Homophones / quasi-homophones | *two/too/to*, *pear/pair*, *eight/ate*, *sun/son*, *flower/flour* | Champ `homophones` ; G15 bloque ; éviter ces mots seuls hors contexte |
| Prononciation TTS des mots isolés | *read*, *live*, *wind*, *bow*, *tear* (deux lectures) ; lettres seules lues comme des sigles | Mots bannis ; `say` avec article/phrase ; test d'écoute de toute la banque sur 3 appareils |
| Accent de la voix | en-US au lieu de en-CA ; voix française lisant de l'anglais | G1 : jamais de voix française pour l'anglais ; en-US accepté et signalé « voix américaine » aux parents |
| Synonymes / variantes nord-américaines | *mom/mommy/mother*, *eraser*, *sweater*, *pants* (≠ UK) | Variante canadienne unique ; orthographe *colour* ; les variantes ne cohabitent jamais dans un choix |
| Rimes fragiles | *sun/one* (rime pour un Canadien, pas évident pour un enfant), *bear/hair* | Rimes franches seulement (même graphie de finale : cat/hat/bat, bee/tree) |
| Situations fonctionnelles à plusieurs bonnes réponses | « Hi! » et « Hello! » ; « Thanks » et « Thank you » | Champ `exclusive` ; un seul membre d'une famille d'équivalents par question |
| Consignes en français vs « English only » du programme | Moins d'immersion | Consignes très courtes ; maximum d'anglais entendu ; lvl 2 COULD « consigne en anglais » (G4 `sayLang`) |
| Lecture involontairement exigée | Choix en mots anglais sans image | Règle : tout mot anglais affiché = image ou 🔊 (G2/G15) |
| Fatigue sonore | Autoplay à chaque carte + histoire longue | G7, histoires sans autoplay, ≤ 6 phrases |
| Gauche/droite, miroir | « Touch your left hand » sur un dessin de face | Exclu au 1er cycle |
| Droits d'auteur | Paroles de chansons connues, personnages (Clifford, Caterpillar) | Textes 100 % originaux ; personnages maison (Max le castor, Lily) |
| Micro (G12) | Vie privée | Rien n'est enregistré au-delà de la séance, rien n'est envoyé ; COULD seulement |
| Attentes des parents | Croire que l'appli « couvre le programme » | Page Parents : l'appli entraîne surtout la compréhension orale (C1 et volet écoute de C2) ; la production orale se vit en classe |

---

## 9. Plan d'implantation (jalons ordonnés)

| Jalon | Contenu | Critère de fin |
|---|---|---|
| **J0 — Cadre (MUST)** | G1 voix, G2 audio par choix, G3 audio des éléments, G4 langue de la consigne, G5 prérequis ; exemples dans le guide de style ; `framework.md` à jour | Guide de style : chaque ajout démontré ; `check-skills.js` OK ; test sur Windows FR sans voix anglaise → message correct |
| **J1 — Squelette** | `subject.js` + 4 domaines ; `data/vocab.js` (90 mots lvl 0–1) ; `art.js` minimal (pastilles, tuque, mitaines, corps) ; scripts dans `index.html` | La matière apparaît ; banque vérifiée à l'oreille sur 3 appareils |
| **J2 — Écoute de mots** | Habiletés 1, 2, 3, 4 + page `en-mots-themes` | 4 habiletés × 3 niveaux sans ambiguïté (revue de 30 questions générées par habileté) |
| **J3 — Bouger (TPR)** | Habiletés 7, 8, 9 ; scènes et poses SVG ; pages `en-corps`, `en-classe` ; comptine « Touch your head » | Zones tactiles ≥ 48 px à 360 px de large |
| **J4 — Parler** | `data/expressions.js`, `M.EN.QA` ; habiletés 10, 11, 12, 13 ; pages `en-hello`, `en-emotions-meteo` | Aucun choix équivalent dans une même question (G15) |
| **J5 — Histoires et comptines** | 8 histoires, 5 comptines, ensembles de rimes ; habiletés 14, 15, 16 ; pages `en-histoires`, `en-comptines` ; SHOULD G9, G10 | Chaque histoire relue par un adulte (sens, longueur, pas d'ambiguïté) |
| **J6 — Consolidation** | Habiletés 5, 6 ; SHOULD G6, G7, G8, G11, G15 ; banque à 160 mots ; section Anglais dans `docs/curriculum.md` | `check-skills.js` OK ; essais à 390 px et 1100 px ; aucune erreur console |
| **J7 — Plus tard (COULD)** | G12 Répète après moi, G13 encouragements anglais, G14 `M.art` partagé, page `en-strategies`, mode « parent lecteur » | Selon l'usage observé |

Ordre recommandé pour un premier essai avec l'enfant : J0 → J1 → J2 (habileté 1 seule) — valider la voix et l'intérêt avant
de produire le reste du contenu.
