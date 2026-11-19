# HLD — Univers social et Culture et citoyenneté québécoise (CCQ), 2e année

> Document de conception de haut niveau (aucun code). S'appuie sur le cadre commun `docs/framework.md` : modèle
> matière → domaine → habileté → page Apprendre, les 12 formats de questions, `M.ui.*`. Tout besoin non couvert est
> décrit comme **lacune du cadre** générique (§ 6), jamais comme une variante locale.

- Matière : id `univers` (jeton existant `--subj-univers: #06a77d`), titre affiché **Univers social**, sous-titre
  « Mon monde, ma communauté, mon Québec », icône 🌎. Préfixe des ids : `us-`.
- Public : enfant de 7 ans, 2e année (fin du 1er cycle). Lecture accompagnée : toute consigne a un 🔊.
- Dossiers : `js/univers/subject.js`, `js/univers/skills/*.js`, `js/univers/learn/*.js`, `js/univers/data/*.js`.

---

## 1. Portée et alignement sur le programme

### 1.1 Ce que dit le programme (vérifié dans les documents officiels)

**Géographie, histoire et éducation à la citoyenneté (GHEC).** Au 1er cycle, les disciplines de l'univers social *ne sont
pas inscrites à la grille-matières* : « Les apprentissages associés au développement de la compétence du premier cycle
doivent donc être pris en charge par les programmes disciplinaires obligatoires à ce cycle » (PFEQ, ch. 7, p. 165). La
compétence du 1er cycle existe quand même : **Construire sa représentation de l'espace, du temps et de la société**, avec
un cadre spatial « la classe, l'école, la rue, le quartier ou la localité » et un cadre temporel « la vie de l'élève, celle
de ses parents, de ses grands-parents et de ses arrière-grands-parents ». Outils : **ligne du temps**, **plan simple**,
illustration, maquette. La Progression des apprentissages (PDA) GHEC donne une section « Première représentation (1er
cycle) » pour la société, le temps (hier/aujourd'hui) et l'espace (ici/ailleurs).

**Culture et citoyenneté québécoise (CCQ).** Remplace Éthique et culture religieuse; obligatoire dans toutes les écoles
depuis 2024-2025 (facultatif en 2023-2024). Une compétence au 1er cycle : **Explorer des réalités culturelles**
(observer, *considérer des émotions*, comparer, exprimer sa compréhension par des **constats**). Contenus **obligatoires
de 2e année** (PDA CCQ, p. 11) : *Caractéristiques de chaque personne* · *Étapes de la vie depuis la naissance* ·
*Rôles et responsabilités dans la famille et à l'école* · *Civilité* · *Célébrations* · *Rôles des autres êtres vivants
dans la vie des humains*, plus des éléments d'éducation à la sexualité (ES). Les contenus de 1re année (besoins, champs
d'intérêt, diversité des familles, rituels du quotidien, êtres vivants et leurs besoins) sont révisés.

**Règle d'évaluation CCQ (programme, p. 15)** : les tâches doivent permettre à l'élève de réussir « sans qu'elle ou il soit
tenu de faire part de ses émotions ou d'aspects de sa vie privée ». Le site applique cette règle à toutes ses questions
notées (§ 3.1).

**Points cardinaux** : la PDA GHEC les place dans la section 1er cycle (A.1 b : « ma maison est au sud du lac »), et les
savoirs essentiels du 1er cycle citent « utilisation des points cardinaux ». Les flèches par année ne sont pas lisibles dans
l'extraction texte du PDF; on suppose donc « avec l'enseignant·e » → **niveau 2 seulement**, avec le nord toujours en haut.

### 1.2 Tableau d'alignement

| Contenu | Statut | Référence |
|---|---|---|
| Émotions : reconnaître, associer des réactions, déclencheurs possibles | **Officiel** (CCQ, compétence) | CCQ PDA p. 4 « Compréhension des émotions » |
| Besoins individuels (physiques, affectifs, apprendre…) | **Officiel** (CCQ 1re, révisé) · GHEC « besoins » des groupes | CCQ PDA p. 9; GHEC savoirs essentiels |
| Caractéristiques de chaque personne (corps, émotion, comportement, pensée; diversité) | **Officiel** (CCQ 2e) | CCQ PDA p. 11 |
| Civilité : gestes envers les personnes et l'environnement; leurs effets | **Officiel** (CCQ 2e) | CCQ PDA p. 11 |
| Règles en classe, dans la cour, à la maison; rôles et responsabilités; droits des enfants | **Officiel** (CCQ 2e; GHEC 2.4 b) | CCQ PDA p. 11; GHEC PDA p. 5 |
| Résolution de conflits (message clair, tour de rôle, demander l'aide d'un adulte) | **Aligné** (CCQ « conditions favorables à l'interaction », civilité → pacification) — pratique scolaire courante | CCQ PDA p. 4, p. 11 |
| Diversité des familles; relations intergénérationnelles | **Officiel** (CCQ 1re, révisé) | CCQ PDA p. 9 |
| Groupes d'appartenance (famille, classe, équipe), membres, nombre, rôles | **Officiel** (GHEC A.2.1, A.4) | GHEC PDA p. 4–5 |
| Lieux du quartier, activités économiques, besoins satisfaits, transports, hôtel de ville | **Officiel** (GHEC 2.3, 2.4 a) | GHEC PDA p. 4–5 |
| Langues parlées dans son milieu; religions *nommées*; expressions de l'art | **Officiel** (GHEC 2.2) — traité avec prudence (§ 7) | GHEC PDA p. 4 |
| Se repérer sur un plan simple (titre, légende, repères) | **Officiel** (GHEC A.1 a; techniques 1 a, b, e) | GHEC PDA p. 4, p. 18 |
| Points cardinaux | **Officiel, avec soutien** → lvl 2 | GHEC PDA A.1 b |
| Paysage : éléments naturels/humains, fleuve/lac/rivière, relief, forêt | **Officiel** (GHEC A.3) | GHEC PDA p. 5 |
| Calendrier, jour, mois, saisons | **Officiel** — **déjà couvert en maths** (`calendrier`), on renvoie | GHEC A.1 c; `js/maths/skills/mesure.js` |
| Ligne du temps de sa vie / d'un personnage; durées simples | **Officiel** (GHEC A.1 d, techniques 3) | GHEC PDA p. 4, p. 18 |
| Âges de la vie : traits physiques, activités; étapes depuis la naissance | **Officiel** (GHEC A.1 e–f; CCQ 2e) | GHEC PDA p. 4; CCQ PDA p. 11 |
| Hier/aujourd'hui : objets, transports, activités (~1 siècle) | **Officiel** (GHEC Changement A a–c) | GHEC PDA p. 12 |
| Ici/ailleurs : objets, transports, climat d'un milieu non familier | **Officiel** (GHEC Diversité A.1) — lvl 2 | GHEC PDA p. 14 |
| Célébrations : fêtes, repas traditionnels, cérémonies religieuses et séculières | **Officiel** (CCQ 2e) | CCQ PDA p. 11 |
| Rôles des animaux (compagnie, aide, travail), soin, bien-être animal | **Officiel** (CCQ 2e) | CCQ PDA p. 11 |
| Emblèmes du Québec (fleurdelisé, harfang, iris versicolore, bouleau jaune, « Je me souviens ») | **Enrichissement** (non nommé au 1er cycle; la société québécoise est au 3e cycle CCQ) | quebec.ca, Emblèmes |
| Saisons et modes de vie au Québec (vêtements, activités, sucres) | **Enrichissement léger** reliant GHEC « climat » et le calendrier des maths | — |
| Éducation à la sexualité (parties sexuelles, grossesse, rôles sexuels et de genre, prévention des agressions) | **Hors portée** : réservé à l'école et à la famille; une note aux parents seulement | CCQ PDA p. 9, 11 |
| Premiers Peuples (modes de vie, territoire) | **Hors portée** (CCQ 3e année, GHEC 2e cycle) — à faire correctement plus tard, pas en survol | CCQ PDA p. 12; GHEC PDA |
| Sociétés 1500–1980, Nouvelle-France, débat, erreurs de raisonnement, littératie informationnelle | **Hors portée** (2e–3e cycles) | GHEC PDA; CCQ PDA p. 4 |

### 1.3 Références

- PFEQ, Domaine de l'univers social (primaire) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-univers-social-primaire.pdf
- PDA GHEC (primaire) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-univers-social-primaire.pdf
- Programme CCQ (primaire) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-culture-citoyennete-quebecoise-Primaire.pdf
- PDA CCQ (primaire, 2e éd. 2024) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-culture-citoyennete-quebecoise-primaire.pdf
- Feuillet CCQ (implantation 2024-2025) : https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/programmes/PFEQ-culture-citoyennete-quebecoise-feuillet.pdf
- Emblèmes du Québec : https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux/emblemes
- Drapeau et symboles nationaux / reproduction du drapeau : https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux · https://www.quebec.ca/gouvernement/portrait-quebec/drapeau-symboles-nationaux/drapeau/utilisation-reproduction

---

## 2. Domaines

| id | Titre | Icône | Contenu | `pda` (résumé) |
|---|---|---|---|---|
| `us-moi-autres` | Moi et les autres | 💛 | émotions, besoins, civilité, règles et responsabilités, conflits | CCQ — Connaissance de soi; Relations entre les individus (Rôles et responsabilités, Civilité) |
| `us-communaute` | Ma famille et ma communauté | 🏘️ | familles, groupes d'appartenance, lieux et métiers du quartier, animaux dans nos vies | CCQ — Relations; Rapports aux autres êtres vivants · GHEC — éléments humains |
| `us-reperer` | Se repérer | 🧭 | plan de la classe/maison/quartier, légende, repères, points cardinaux (lvl 2), paysages | GHEC — Localisation (A.1 a–b), éléments naturels (A.3), techniques (plan) |
| `us-quebec` | Le Québec et ses fêtes | ⚜️ | célébrations et traditions, emblèmes (enrichissement), saisons et modes de vie | CCQ — Rituels et célébrations · enrichissement |
| `us-temps` | Avant et maintenant | ⏳ | objets et transports d'autrefois, âges de la vie, ligne du temps | GHEC — Hier et aujourd'hui; A.1 d–f · CCQ — Étapes de la vie |

Couleurs des domaines : variantes douces de `--subj-univers` choisies dans `tokens.css` (pas de couleur locale).

**Coordination avec les maths (pas de doublon).**
- `calendrier` (maths) garde *quand* : jours, mois, saisons, « En quel mois fête-t-on… ». L'univers social demande
  *quoi et pourquoi* : traditions, gestes, sens d'une fête. Les deux pages Apprendre se renvoient l'une à l'autre.
- `reperage` et `plan-grille` (maths) gardent la position (gauche/droite) et le quadrillage lettre-chiffre. L'univers
  social travaille **légende, symboles, repères, points cardinaux** sur des plans de lieux réels.
- Les données des fêtes et des saisons (`EVENTS`, `SEASONS` dans `mesure.js`) deviennent des données partagées (lacune
  **G6**), réutilisées sans copie. Correction à faire au passage : afficher « la Fête nationale du Québec (Saint-Jean-Baptiste) ».

---

## 3. Catalogue des habiletés (14)

### 3.1 Garder la correction automatique juste (règles obligatoires)

| Règle | Application |
|---|---|
| **R1. On note des faits, pas des opinions.** | Vocabulaire, rôles, lieux, symboles, ordre chronologique, règles et *leur raison*. |
| **R2. Indices observables.** | Toute question d'émotion s'appuie sur un indice dans le texte ou l'image (« il pleure », « poings serrés »). La consigne dit « **probablement** ». L'explication nomme l'indice et rappelle que chacun peut ressentir autre chose. |
| **R3. Distracteurs à valence opposée.** | Jamais deux émotions voisines (triste/déçu) parmi les choix. Distracteurs : émotion opposée, ou geste nuisible, ou hors sujet. |
| **R4. Une seule réponse prosociale nette.** | Scénarios de conflit et de civilité : la bonne réponse ne blesse personne; chaque distracteur porte une étiquette de données `harm` (blesse), `off` (hors sujet) ou `opp` (émotion opposée). Pas de distracteur « raisonnable » (ex. « aller jouer ailleurs »). |
| **R5. Rien sur la vie privée dans le noté.** | Aucune question notée sur la famille, les émotions, les croyances ou les pratiques **de l'enfant**. Les personnages sont fictifs. |
| **R6. Réflexion = non notée.** | Les questions ouvertes (« As-tu déjà… ? ») passent par la carte de réflexion **G1** : participation seulement, aucun texte enregistré, bouton « Je préfère passer ». |
| **R7. Diversité sans piège.** | Jamais « Laquelle est une vraie famille ? ». On compte, on nomme les liens, on observe; toutes les familles montrées sont valides. |
| **R8. Religions = faits culturels.** | « Certaines familles fêtent… » ; on associe une fête à un symbole ou un geste; jamais de croyance à juger ni de « bonne » fête. |

### 3.2 Habiletés

Notation : formats du cadre; `L0/L1/L2` = `lvl` 0/1/2. Visuels : emoji + SVG en ligne seulement.

**Domaine `us-moi-autres`**

1. **`us-emotions` — Les émotions 😊** · *Reconnaître une émotion et ce qui l'a déclenchée.*
   - pda : CCQ — Compétence, Considérer des émotions : reconnaître des émotions, associer des réactions, identifier des déclencheurs
   - L0 `match` visage ↔ nom (joie, tristesse, colère, peur, surprise); `choice` 3 choix opposés sur un mini-scénario.
   - L1 `choice` « Comment X se sent-il probablement ? » (indice dans le texte); `choice` déclencheur probable.
   - L2 `sort` réactions → émotion (« pleure », « saute de joie », « se cache »); fierté, gêne, inquiétude ajoutées.
   - Visuel : `scene` emoji (G5); sélecteur d'émotions G4 comme étiquettes. hint : « Cherche les indices : le visage, les gestes, les paroles. » explain : « X sourit et veut montrer son dessin : ce sont des indices de **fierté**. »
   - Données : `emotions.js`, `scenarios.js` (type `emotion`).

2. **`us-besoins` — Mes besoins 🍎** · *Ce dont une personne a besoin pour bien grandir.*
   - pda : CCQ 1re — Besoins individuels (types de besoins, réponses aux besoins); GHEC — Groupes : besoins
   - L0 `tf` « Dormir est un besoin. »; `choice` qui répond au besoin (« J'ai faim : qui m'aide ? »).
   - L1 `sort` *besoin* / *envie* (items sans ambiguïté : manger, dormir, être aimé, aller à l'école / bonbons, console, 3e paire d'espadrilles). **Jouer reste un besoin** (droit au jeu) et n'apparaît jamais dans « envie ».
   - L2 `sort` type de besoin : corps 🍎 · cœur 💛 · apprendre 📚.
   - Données : `besoins.js`.

3. **`us-civilite` — Les gestes de civilité 🙏** · *Bonjour, merci, attendre son tour, prendre soin des lieux.*
   - pda : CCQ 2e — Civilité : gestes envers les personnes et l'environnement, effets sur les relations
   - L0 `choice` « Quel geste de civilité ? » (dire bonjour / passer sans rien dire / crier).
   - L1 `sort` *geste qui aide* / *geste qui blesse*; `cloze` formules (« Peux-tu me prêter ta gomme, {0} ? »).
   - L2 `match` geste ↔ effet (« dire merci » → « l'autre se sent apprécié »; « ramasser ses déchets » → « le parc reste propre »).

4. **`us-regles` — Règles et responsabilités 📋** · *À quoi servent les règles; qui fait quoi à l'école et à la maison.*
   - pda : CCQ 2e — Rôles et responsabilités, règles dans la famille, élaboration des règles de la classe et de la cour · GHEC 2.4 b, A.4 b
   - L0 `sort` règle → lieu (classe 🏫, cour 🛝, autobus 🚌).
   - L1 `match` règle ↔ raison (échantillon S5, § 5.3); `match` rôle ↔ personne (enseignant·e, éducatrice du service de garde, concierge, brigadier·ère).
   - L2 `choice` « Quelle règle faudrait-il pour régler ce problème ? » (problème concret, une seule règle pertinente).

5. **`us-conflits` — Régler un conflit 🤝** · *Les étapes : je m'arrête, je dis comment je me sens, j'écoute, on cherche une solution, je demande de l'aide.*
   - pda : CCQ — Appliquer les conditions favorables à l'interaction; Civilité (pacification)
   - L0 `choice` geste qui calme vs geste qui blesse. L1 `steps` scénario complet (S4). L2 `order` étapes du message clair; `steps` avec « que pourrait dire X ? » (`choice` au « je »).
   - Fin de série : carte de réflexion **G1** (non notée).

**Domaine `us-communaute`**

6. **`us-familles` — Les familles 👨‍👩‍👧** · *Il y a beaucoup de sortes de familles; les mots de la parenté.*
   - pda : CCQ 1re–2e — Diversité des familles québécoises; relations intergénérationnelles · GHEC A.2.1 a–c
   - L0 `number` « Combien de personnes dans la famille de Noah ? » (scène emoji); `match` emoji ↔ mot (bébé, grand-mère…).
   - L1 `choice` « La mère de ma mère, c'est ma… »; `number` adultes/enfants.
   - L2 `choice` liens composés (demi-sœur, cousin, belle-mère) sur un **arbre de famille fictif** SVG.
   - Familles montrées en rotation : deux parents, un parent, deux mamans, deux papas, grands-parents, recomposée, famille d'accueil, adoptive. Aucune question « laquelle est normale ».

7. **`us-lieux-metiers` — Les lieux et les métiers du quartier 🏪** · *Quel lieu répond à quel besoin; qui y travaille.*
   - pda : GHEC 2.3 a–c (éléments économiques, besoins satisfaits, transports), 2.4 a (hôtel de ville), A.4 a–b
   - L0 `match` lieu ↔ besoin (épicerie → se nourrir; clinique → se soigner; bibliothèque → emprunter des livres; parc → jouer).
   - L1 `match` métier ↔ outil/lieu; `choice` « Où vas-tu pour… ? ».
   - L2 `sort` biens / services; `choice` hôtel de ville et conseil municipal (« Qui décide de construire un nouveau parc ? »).
   - Métiers sans stéréotype : prénoms et pronoms variés (pompière, infirmier, mécanicienne…).

8. **`us-animaux` — Les animaux dans nos vies 🐕** · *Compagnie, aide, travail; prendre soin d'un animal.*
   - pda : CCQ 2e — Rôles des autres êtres vivants; responsabilités; soin des animaux, bien-être animal
   - L0 `multi` besoins d'un chat (eau, nourriture, abri, jeu). L1 `match` animal ↔ rôle (chien-guide → aider une personne aveugle; chat → compagnie; abeille → fait le miel et pollinise). L2 `choice` geste de bien-être animal.
   - Lien futur avec la matière sciences (`sc-`) : ne pas traiter le cycle de vie ici.

**Domaine `us-reperer`**

9. **`us-plan` — Lire un plan 🗺️** · *Titre, légende, symboles, repères; points cardinaux au niveau 2.*
   - pda : GHEC A.1 a–b; Techniques 1 a, b, d, e (lire le titre, décoder la légende, points cardinaux, repères)
   - L0 `hotspot` « Touche l'école » sur un plan de classe/quartier avec légende emoji.
   - L1 `hotspot` via fonction (« Touche l'endroit où on emprunte des livres » : il faut lire la légende); `choice` « Qu'y a-t-il à côté de… ? ».
   - L2 `choice` nord/sud/est/ouest avec rose des vents (nord en haut). Échantillon complet § 5.4.
   - Visuel : composant plan **G3**. Plans : classe, maison (vue de dessus), cour d'école, quartier.

10. **`us-paysages` — Les paysages 🏞️** · *Éléments naturels et éléments humains; fleuve, lac, rivière.*
   - pda : GHEC A.3 (relief, climat, hydrographie, ressources); Explorer des paysages (critères 1er cycle)
   - L0 `sort` naturel 🌲 / construit par les humains 🏠. L1 `match` mot ↔ image SVG (fleuve, lac, rivière, montagne, forêt, champ). L2 `tf` faits simples (« Le fleuve Saint-Laurent coule vers la mer. »); `choice` ici/ailleurs (vêtements et habitations selon le climat).

**Domaine `us-quebec`**

11. **`us-fetes` — Fêtes et traditions 🎉** · *Ce qu'on fait pendant une fête et pourquoi.*
   - pda : CCQ 2e — Célébrations : traditions (fêtes, repas traditionnels), cérémonies religieuses et séculières
   - L0 `match` fête ↔ symbole (🎂 anniversaire, 🎃 Halloween, ⚜️ Fête nationale, 🍯 temps des sucres).
   - L1 `choice` « Que fait-on souvent à la cabane à sucre ? » (tire sur la neige); célébrations de la vie (naissance, mariage).
   - L2 `match` fêtes de plusieurs traditions présentes au Québec ↔ geste ou symbole (Noël → sapin; Hanoucca → chandelier à neuf branches; Aïd el-Fitr → repas de fin du ramadan; Diwali → petites lampes; Nouvel An lunaire → lanternes rouges). Formulation « Certaines familles… » (R8).
   - Ne jamais redemander le mois (c'est `calendrier`); `viz` peut afficher la bande des mois partagée.

12. **`us-emblemes` — Les symboles du Québec ⚜️** *(enrichissement, marqué « Défi bonus » aux parents)*
   - pda : Enrichissement — Loi sur le drapeau et les emblèmes du Québec (quebec.ca)
   - L0 `choice` « Lequel est le drapeau du Québec ? » (3 SVG : fleurdelisé, drapeau du Canada, drapeau inventé neutre).
   - L1 `match` emblème ↔ image : harfang des neiges (oiseau), iris versicolore (fleur), bouleau jaune (arbre).
   - L2 `cloze` devise « Je me {0} »; `tf` « Le fleurdelisé a 4 fleurs de lys. ».
   - SVG du drapeau conforme aux proportions et couleurs officielles (voir page Reproduction du drapeau).

**Domaine `us-temps`**

13. **`us-avant-maintenant` — Avant et maintenant 📻** · *Objets, transports et activités d'il y a environ 100 ans.*
   - pda : GHEC Changement A a–c (objets d'usage courant, activités économiques, transports); Diversité A.1 a–b
   - L0 `sort` autrefois / aujourd'hui (lampe à l'huile, cellulaire…). L1 `match` objet d'autrefois ↔ objet d'aujourd'hui. L2 `choice` « Comment allait-on à l'école il y a 100 ans ? »; `order` 3 moyens de transport du plus ancien au plus récent.
   - Visuel : paire avant/après (G9) en SVG simple quand l'emoji n'existe pas (planche à laver, glacière à bloc de glace).

14. **`us-ligne-temps` — La ligne du temps de la vie 📏** · *Ordonner des événements; âges de la vie.*
   - pda : GHEC A.1 d–f, Techniques 3 (interpréter une ligne du temps) · CCQ 2e — Étapes de la vie depuis la naissance
   - L0 `order` bébé → enfant → adolescent·e → adulte → aîné·e (emoji 👶🧒🧑🧓); `match` âge ↔ activité.
   - L1 `hotspot` sur la ligne du temps de Félix (personnage fictif) : « Touche l'année où Félix est entré à la maternelle ».
   - L2 `number` durée : « Félix est né en 2018. Il entre en 2e année en 2025. Combien d'années plus tard ? » (petits nombres, lien maths).
   - Visuel : composant ligne du temps **G2**. Jamais la ligne du temps de l'enfant dans le noté (R5).

---

## 4. Pages « Apprendre » (5)

| id | Domaine | But | Sections et composants |
|---|---|---|---|
| `us-vivre-ensemble` | `us-moi-autres` | Nommer ses émotions, ses besoins, les gestes qui aident | 1. **Les émotions** : sélecteur G4 (non noté, rien enregistré), `vocab` des 8 émotions. 2. **Mes besoins** : `vocab` corps/cœur/apprendre. 3. **Les gestes de civilité** : `flashcards` (situation → geste). 4. **Le message clair** : `M.ui.demarche` réutilisé avec des étapes propres (🛑 Je m'arrête · 💬 Je dis comment je me sens · 👂 J'écoute · 🤝 On trouve une solution · 🙋 Je demande de l'aide). 5. `miniQuiz`. |
| `us-communaute` | `us-communaute` | Voir la diversité des familles; découvrir le quartier | 1. **Toutes sortes de familles** : `vocab` de 8 familles emoji (zwj : 👩‍👩‍👦, 👨‍👨‍👧, 👨‍👦…) + `reading` court. 2. **Les mots de la famille** : arbre fictif SVG à toucher. 3. **Mon quartier** : plan G3 interactif (toucher un lieu → nom 🔊, besoin, métier). 4. **Les animaux et nous** : `vocab`. 5. `miniQuiz`. |
| `us-plans` | `us-reperer` | Lire un plan comme un explorateur | 1. **Qu'est-ce qu'un plan ?** (vue d'oiseau : objet → symbole, animation `showMe`). 2. **Titre et légende** (plan G3 avec légende surlignée). 3. **La rose des vents** (N, S, E, O; comptine « Nord en haut »). 4. **Les paysages** : `vocab` fleuve/lac/rivière/montagne. Renvoi à la page maths **Se repérer**. 5. `miniQuiz`. |
| `us-quebec` | `us-quebec` | Fêtes, traditions et symboles d'ici | 1. **Les fêtes de l'année** : `tabs` par saison, chaque fête = tuile (quoi, comment) + lien vers maths **Le calendrier** pour la date. 2. **Des fêtes de partout, ici** (R8). 3. **Les emblèmes** : `flashcards` (drapeau, harfang, iris, bouleau, devise). 4. **Vivre les saisons** : `vocab` vêtements et activités (tuque, mitaines, cabane à sucre, baignade). |
| `us-temps` | `us-temps` | Comprendre que les choses changent avec le temps | 1. **La vie de Félix** : ligne du temps G2 interactive. 2. **Les âges de la vie** : `vocab`. 3. **Chez grand-papa, il y a longtemps** : `reading` (texte original, 6–8 phrases). 4. **Avant / maintenant** : paires G9 en `tabs` (maison, école, transport, musique). 5. Activité **« Ma ligne du temps »** facultative, faite avec un adulte, rien n'est enregistré. 6. `miniQuiz`. |

Toutes les pages : `intro` d'une phrase; `callout` astuce de Castor 🦫; une note aux parents (G8) sur les thèmes sensibles.

---

## 5. Plan des données

### 5.1 Fichiers

```
js/univers/data/
  emotions.js      8 émotions {id, emoji, nom, say, valence(+/−/0), reactions[]}
  scenarios.js     ~60 situations {id, type: emotion|civilite|conflit|regle, lvl, personnages, texte, scene[], cue, choices[{label, value, tag: ok|harm|off|opp}], hint, explain}
  besoins.js       items {label, emoji, kind: besoin|envie, type: corps|coeur|apprendre}
  familles.js      familles fictives {id, membres[{emoji, role}], prénoms}, liens de parenté, arbre fictif
  lieux.js         lieux du quartier {id, nom, emoji, symbole SVG, besoin, metiers[], bien|service}
  plans.js         plans déclaratifs pour G3 {id, titre, taille, routes[], lieux[{id, x, y, w, h}], légende, nord?}
  paysages.js      éléments {id, nom, kind: naturel|humain, svg}
  fetes.js         complète les données partagées G6 : {eventId, gestes[], symbole, tradition, source}
  emblemes.js      {id, nom, type, depuis, svg, fait} — dates vérifiées sur quebec.ca
  autrefois.js     paires {avant:{nom, emoji|svg}, maintenant:{nom, emoji}, domaine: maison|transport|école|loisir}
  lignes-temps.js  personnages fictifs {nom, naissance, evenements[{annee, label, emoji}]}
```

Règles de données : textes originaux (aucun extrait de manuel), emoji ou SVG maison, prénoms variés (Zoé, Amir, Léa,
Kevin, Noah, Maya, Samuel, Mei, Félix, Awa, Gabriel, Inès), chaque scénario a un `cue` (indice observable, R2) et des
distracteurs étiquetés (R4), validés par G7.

### 5.2 Volumes visés

Scénarios ≥ 60 (15 par type), lieux 14, plans 4, fêtes 16, paires avant/maintenant 16, familles 10, personnages de
ligne du temps 4. Assez pour 3 séances sans répétition visible.

### 5.3 Cinq exemples de scénarios (complets)

**S1 — `us-emotions`, L0, `choice`**
- Scène : 🧒🏽 🏰 🙌 · Texte : « Zoé a construit un grand château de blocs. Elle sourit et appelle son papa pour lui montrer. »
- Consigne : « Comment Zoé se sent-elle **probablement** ? »
- Choix : 😄 fière (`ok`) · 😢 triste (`opp`) · 😠 fâchée (`opp`). Réponse : fière.
- hint : « Cherche les indices : son visage et ce qu'elle veut faire. »
- explain : « Zoé **sourit** et veut **montrer** son château : ce sont des indices de **fierté**. On devine une émotion avec des indices : le visage, les gestes, les paroles. Chaque personne peut ressentir les choses à sa façon. »

**S2 — `us-emotions`, L1, `choice` (déclencheur)**
- Scène : 🧒🏻 ✊ 😠 · Texte : « Samuel a les poings serrés et les joues rouges. Il dit : « Ce n'est pas juste ! » »
- Consigne : « Qu'est-ce qui s'est **probablement** passé ? »
- Choix : « Quelqu'un a déchiré son dessin. » (`ok`) · « Il a reçu un cadeau. » (`opp`) · « Il a fini son casse-tête. » (`opp`).
- hint : « Samuel est fâché. Quelle situation peut rendre fâché ? »
- explain : « Poings serrés, joues rouges, « ce n'est pas juste ! » : Samuel est **fâché**. Un dessin déchiré peut **déclencher** de la colère. Recevoir un cadeau ou réussir un casse-tête rend plutôt content. »

**S3 — `us-civilite`, L0, `choice`**
- Scène : 🏫 👩🏾‍🏫 👋 🧒🏽 · Texte : « Amir arrive en classe le matin. Son enseignante lui dit : « Bonjour, Amir ! » »
- Consigne : « Quel **geste de civilité** Amir peut-il faire ? »
- Choix : « Il répond « Bonjour ! » en la regardant. » (`ok`) · « Il passe sans rien dire. » (`off`) · « Il crie très fort. » (`harm`).
- hint : « Un geste de civilité, c'est un geste poli qui aide à bien vivre ensemble. »
- explain : « Répondre « bonjour » en regardant la personne, c'est un **geste de civilité**. Il montre qu'on est content de la voir et la journée commence bien pour les deux. »

**S4 — `us-conflits`, L1, `steps`**
- Passage : « À la récré, Léa et Kevin veulent tous les deux le même ballon rouge. Ils tirent dessus en même temps. Kevin crie : « C'est à moi ! » Léa ne lâche pas. »
- Étape 🔍 « Quel est le problème ? » `choice` : « Ils veulent le même ballon. » (`ok`) · « Ils jouent à la cachette. » (`off`).
- Étape 💛 « Comment se sentent-ils **probablement** ? » `choice` : 😠 fâchés (`ok`) · 😄 très contents (`opp`) · 😴 endormis (`off`).
- Étape 🤝 « Quelle solution aide **sans blesser personne** ? » `choice` : « Jouer chacun 5 minutes, à tour de rôle. » (`ok`) · « Pousser l'autre pour prendre le ballon. » (`harm`) · « Lancer le ballon sur le toit pour que personne ne l'ait. » (`harm`). after : « À tour de rôle, chacun a sa chance. »
- Étape 🙋 « Si ça ne marche pas, que peuvent-ils faire ? » `choice` : « Demander l'aide d'un adulte de la cour. » (`ok`) · « Cacher le ballon dans son sac. » (`harm`).
- explain : « Pour régler un conflit : on s'arrête, on dit comment on se sent, on écoute l'autre et on cherche une solution juste pour les deux. Si on n'y arrive pas, on demande l'aide d'un adulte. »
- Suivie d'une carte G1 (non notée) : « As-tu déjà vécu une chicane comme celle-là ? Qu'est-ce qui t'a aidé ? Tu peux en parler avec un adulte. » Boutons : « On en a parlé ✔ » · « Je préfère passer ».

**S5 — `us-regles`, L1, `match` (règle ↔ raison)**
- Consigne : « Associe chaque règle de l'école à sa **raison**. »
- Paires : « Lever la main pour parler ✋ » ↔ « Pour que chacun parle à son tour. » · « Marcher dans le corridor 🚶 » ↔ « Pour ne pas se blesser. » · « Ranger son matériel 🎒 » ↔ « Pour retrouver ses choses. » · (L2 : « Porter son casque à vélo 🚲 » ↔ « Pour protéger sa tête. »)
- explain : « Une règle a toujours une **raison** : la sécurité, le respect ou l'organisation. Quand on comprend la raison, c'est plus facile de suivre la règle. »

### 5.4 Exemple de question de plan (`us-plan`, L1 puis L2)

- **Composant** : G3, plan `quartier-maya` (`plans.js`), SVG 360 × 300, vue de dessus, fond vert pâle (jeton), routes
  grises de 24 px : une rue horizontale (y = 140–164) « rue des Érables » et une rue verticale (x = 168–192) « rue du Parc ».
- **Titre** au-dessus : « Le quartier de Maya ». **Rose des vents** en haut à droite (N en haut; visible seulement à L2).
- **Lieux** (rectangles arrondis 70 × 56 avec un symbole emoji au centre, `data-hot`) :
  `maison` 🏠 (20, 40) nord-ouest · `ecole` 🏫 (220, 40) nord-est · `biblio` 📖 (20, 190) sud-ouest ·
  `epicerie` 🛒 (220, 190) sud-est · `parc` 🌳 (110, 220) entre la bibliothèque et l'épicerie, sous la rue ·
  `caserne` 🚒 (110, 40) entre la maison et l'école.
- **Légende** (sous le plan, toujours visible, éléments lisibles au toucher 🔊 en mode Apprendre) : 🏠 maison de Maya ·
  🏫 école · 📖 bibliothèque · 🛒 épicerie · 🌳 parc · 🚒 caserne de pompiers.
- **Question L1** (`hotspot`) : « Regarde la légende. Touche l'endroit où Maya peut **emprunter des livres**. »
  answer `biblio`; answerText « la bibliothèque 📖 ». hint : « Cherche dans la légende le symbole des livres. »
  explain : « Dans la légende, 📖 veut dire **bibliothèque**. Sur le plan, elle est en bas à gauche, de l'autre côté de
  la rue des Érables. » showMe : surligne 📖 dans la légende, puis le lieu sur le plan.
- **Question L2** (`choice`) : « Regarde la rose des vents. L'école est au ___ de la bibliothèque. » Choix : nord
  (`ok`) · sud · est · ouest. hint : « Le nord est en haut. Pars de la bibliothèque : l'école est plus haut. »
  explain : « L'école 🏫 est en haut, et la bibliothèque 📖 en bas : l'école est **au nord** de la bibliothèque. »
  (Paires choisies seulement si l'écart est purement vertical ou purement horizontal; jamais de diagonale « nord-est ».)

---

## 6. Lacunes du cadre (FRAMEWORK GAPS)

Specs génériques; chacune a un exemple dans le guide de style et une entrée dans `framework.md`.

**G1 — Format `reflect` (carte de réflexion non notée)** — *MUST*
- MUST : `format: 'reflect'`, champs `prompt`, `say?`, `scene?`, `actions?` (défaut : « On en a parlé ✔ », « Je préfère passer »).
- MUST : n'appelle jamais `M.progress.record`; aucune ⭐, pas de « bonne/mauvaise » réponse; exclue du dénominateur de fin de série (« 6 sur 6 » ne compte pas la réflexion).
- MUST : aucun texte libre saisi ni enregistré (vie privée, règle CCQ). Peut enregistrer un compteur de participation par habileté (`progress.participation[id]++`), visible aux parents seulement.
- SHOULD : `validate` refuse les champs `answer`; `M.runSession` limite à 1 carte `reflect` par série, en fin de série.

**G2 — Composant ligne du temps `M.viz.timeline`** — *MUST*
- MUST : `M.viz.timeline({ from, to, step, unit: 'jour'|'mois'|'année', title, events:[{at, label, emoji, id}] })` → SVG horizontal (vertical sous 400 px), graduations, chaque événement et chaque graduation porte `data-hot` → compatible avec `hotspot`.
- SHOULD : mode `hide:[ids]` pour poser « Quel événement va ici ? »; animation `showMe` qui parcourt l'axe.
- COULD : réutilisé en maths (`duree`, calendrier).

**G3 — Composant plan/carte `M.viz.plan`** — *MUST*
- MUST : rendu SVG à partir d'une description déclarative (`plans.js`) : titre, routes/murs, lieux (`data-hot`), légende synchronisée (toucher l'élément de légende surligne le lieu), rose des vents facultative (`north: true`).
- MUST : promouvoir le `planViz` local de `js/maths/skills/geometrie.js` (quadrillage lettre-chiffre `M.geo.cell`) comme option `grid: {cols, rows}` du même composant : une seule implémentation.
- SHOULD : mode Apprendre « toucher pour entendre » (nom 🔊); étiquettes de texte ≥ 14 px; lisible à 360 px.

**G4 — Sélecteur d'émotions `M.ui.feelings`** — *SHOULD*
- SHOULD : grille de visages emoji + nom, lue au toucher; `M.ui.feelings(el, { set: 'base'|'etendu', onPick })`.
- MUST (si implanté) : rien n'est enregistré; usage en page Apprendre seulement. Données partagées `M.data.emotions` aussi utilisées comme libellés de `choice`.

**G5 — Scène illustrée `scene` (champ de question)** — *SHOULD*
- SHOULD : `scene: [{ emoji, label }]` → bandeau d'emoji grand format au-dessus de la consigne, avec texte alternatif lu par 🔊 (« une fille, un château, des mains levées »). Évite que chaque matière fabrique sa mise en page dans `passage.html`.

**G6 — Registre de données partagées `M.data`** — *MUST*
- MUST : `M.registerData(id, value)` / `M.data[id]`; déplacer `MONTHS`, `SEASONS`, `EVENTS`, `SIGNS` de `mesure.js` vers `js/data/quebec-calendrier.js` (chargé avec le cadre). Les ids d'événements deviennent stables (`fete-nationale`, `temps-des-sucres`…), et `us-fetes` ajoute ses champs (gestes, symboles) par `id` sans copier.
- SHOULD : `check-skills.js` vérifie qu'aucun id n'est enregistré deux fois.

**G7 — Validation de contenu par habileté (`lint`)** — *SHOULD*
- SHOULD : champ facultatif `lint(q)` sur `M.registerSkill`, appelé par `check-skills.js` sur chaque question générée.
- SHOULD : règles communes réutilisables : `M.lint.oneOk(choices)` (une seule réponse `ok`, distracteurs étiquetés), `M.lint.noPrivate(prompt)` (refuse « ta famille », « tu ressens », « ta religion », « chez toi, est-ce que… » dans une question notée).

**G8 — Note aux parents (`parentNote`)** — *SHOULD*
- SHOULD : champ `parentNote` (html court) sur domaine, habileté et page Apprendre, affiché dans l'espace Parents (ex. : « Cette page parle des familles; toutes les configurations sont montrées. L'éducation à la sexualité n'est pas couverte ici. »).
- COULD : étiquette « Enrichissement » (`enrichment: true`) affichée aux parents et exclue des recommandations automatiques par défaut.

**G9 — Paire comparative `M.ui.compare`** — *COULD*
- COULD : carte deux colonnes « avant | maintenant » ou « ici | ailleurs » (`{left:{title, emoji|svg, label}, right:{…}}`), utilisable en page Apprendre et comme `choice.label`.

**G10 — Étapes personnalisables de `M.ui.demarche`** — *COULD (déjà presque supporté)*
- `demarche(steps)` accepte déjà des étapes; documenter cet usage dans `framework.md` (message clair) au lieu de créer un composant.

---

## 7. Risques, ambiguïtés et parades

| Risque | Parade |
|---|---|
| Question d'émotion à plusieurs réponses défendables → l'enfant est « puni » d'une nuance | R2–R4; `lint` G7; relecture humaine de chaque scénario; explication qui reconnaît la diversité des ressentis. |
| Intrusion dans la vie privée (famille, émotions, croyances) | R5–R6 et règle d'évaluation CCQ; G1 sans texte libre; G7 `noPrivate`. |
| Diversité des familles mal représentée ou stéréotypée | Rotation des 10 familles fictives; pas de « vraie » famille; prénoms et rôles variés; note parents G8. |
| Neutralité religieuse et culturelle | R8 : faits culturels seulement, plusieurs traditions, « certaines familles »; pas de contenu doctrinal; Noël et Hanoucca au même niveau de détail. |
| Contenu ES (sexualité) attendu en 2e année | Hors portée explicite + note parents; aucune question sur le corps intime. |
| Premiers Peuples traités superficiellement ou de façon stéréotypée | Hors portée en 2e; aucun tipi/plume décoratif; prévu avec la matière en 3e année et des sources des nations. |
| Exactitude des faits québécois (dates d'emblèmes, nom des fêtes, drapeau) | Chaque fait dans `emblemes.js`/`fetes.js` porte un champ `source` (URL quebec.ca); SVG du drapeau conforme aux normes de reproduction; « Fête nationale du Québec » comme nom officiel. |
| Doublon avec les maths (calendrier, repérage) | Frontière § 2; données partagées G6; renvois entre pages. |
| Points cardinaux trop tôt | Niveau 2 seulement, nord toujours en haut, déplacements purement verticaux ou horizontaux. |
| « Autrefois » idéalisé ou daté approximativement | Repère unique « il y a environ 100 ans (quand les arrière-grands-parents étaient enfants) », objets bien attestés; pas de dates précises. |
| Lecture trop difficile | Textes ≤ 3 phrases dans le noté; 🔊 partout; vocabulaire de la PDA expliqué dans les `vocab`. |
| Emoji qui varient selon l'appareil (familles zwj) | Repli SVG pour les familles composées si l'emoji n'est pas rendu (test de largeur); jamais d'information portée par la seule couleur de peau. |

---

## 8. Plan d'implémentation

| Phase | Contenu | Fin de phase |
|---|---|---|
| **0. Cadre** | G6 (`M.data` + déplacement des données du calendrier, maths inchangées côté enfant), G1 `reflect`, G8 `parentNote`; exemples dans le guide de style; `framework.md` à jour. | `node tools/check-skills.js` OK; maths identiques (ids stables). |
| **1. Squelette** | `js/univers/subject.js` (matière + 5 domaines), section dans `index.html`, `docs/curriculum.md` (section Univers social avec le tableau § 1.2). | Tuile de matière visible, domaines vides. |
| **2. Moi et les autres** | `emotions.js`, `scenarios.js`, `besoins.js`; habiletés 1–5; G5 `scene`, G7 `lint`; page `us-vivre-ensemble` (+ G4 si prêt). | 60 scénarios relus; check-skills OK. |
| **3. Communauté** | `familles.js`, `lieux.js`; habiletés 6–8; page `us-communaute` (plan simple sans rose des vents). | Relecture diversité. |
| **4. Se repérer** | G3 `M.viz.plan` (puis migration de `plan-grille` des maths vers le composant), `plans.js`, `paysages.js`; habiletés 9–10; page `us-plans`. | Maths `plan-grille` inchangé visuellement. |
| **5. Temps et Québec** | G2 `M.viz.timeline`, G9 (facultatif); `autrefois.js`, `lignes-temps.js`, `fetes.js`, `emblemes.js`; habiletés 11–14; pages `us-quebec`, `us-temps`. | Faits vérifiés avec `source`. |
| **6. Validation** | Navigateur à 390 px et 1100 px, sans erreur de console; relecture par un parent; essai avec l'enfant (2 séances), ajustement des niveaux. | Liste de contrôle `framework.md` § 8 complète. |

Ordre conseillé : phases 0–2 d'abord (cœur officiel CCQ 2e année), puis 4 et 5 (GHEC), l'enrichissement `us-emblemes` en dernier.
