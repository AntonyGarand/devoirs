# Cadre commun des devoirs : formats, composants, style

Ce document définit **comment toutes les matières se présentent et se comportent**. Une nouvelle matière ne crée pas sa propre
interface : elle choisit des *formats de questions* et des *composants* existants. Si un besoin n'est pas couvert, on ajoute un
format ou un composant **au cadre** (avec un exemple dans le guide de style), jamais une variante locale.

Guide de style vivant : ouvrir le site → Parents → 🎨 Guide de style (`#/style`).

## 1. Architecture

```
index.html                    coquille + liste des scripts (une section par matière)
css/ds/tokens.css             jetons : couleurs, espacements, tailles de texte, cible tactile, couleurs des matières
css/ds/components.css         boutons, cartes, encadrés (callout), étiquettes, pastilles, étoiles
css/ds/ui.css                 onglets, stepper, mots illustrés, cartes-éclair, lecture, démarche, cartes de matière
css/ds/question.css           carte-question et session
css/ds/formats.css            styles de chaque format de question
css/ds/viz.css                visuels mathématiques partagés (cadres de dix, base 10, droite numérique)
css/ds/extra.css              formats et composants ajoutés, jetons de classes de mots (--cls-*) et de marques (--mk-*)
css/ds/layout.css             en-tête, accueil, tableaux de bord, pages Apprendre, parents, petits écrans
js/core.js                    utilitaires, progression, registre matières → domaines → habiletés, révision
js/services.js                voix (M.voices, M.say séquences/langues, M.sayHtml), réglages, données parent (M.userData),
                              outils parents, données partagées (M.registerData), dessins (M.art), texte (M.people, M.fr, M.typo),
                              progression par élément (M.progress.item, M.pickWeighted), disponibilité (M.skillStatus), M.lint
js/formats.js                 bibliothèque des formats de questions (M.registerFormat)
js/session.js                 carte-question (M.renderQuestion) et série de questions (M.runSession)
js/ui.js, js/ui-extra.js       composants d'interface (M.ui.*)
js/viz.js, js/viz-extra.js     visuels (M.viz.* : cadres de dix, base 10, droite, modèle en barres, ligne du temps, plan)
js/styleguide.js              guide de style vivant + un exemple par format (M.FORMAT_SAMPLES)
js/selftest.js                auto-test navigateur (#/test) : résout chaque exemple, ouvre chaque habileté et page
js/<matière>/subject.js       M.registerSubject + M.registerDomain
js/<matière>/skills/*.js      habiletés (générateurs de questions)
js/<matière>/learn/*.js       pages Apprendre
js/<matière>/data/*.js        données (listes de mots, textes) — optionnel
tools/check-skills.js         vérification automatique (node)
```

Pas de modules ES ni de compilation : chaque fichier est un IIFE qui utilise `window.M`, et le site fonctionne en `file://`
comme sur GitHub Pages. Ordre de chargement : cadre → `subject.js` → `skills/` → `learn/` → `styleguide.js` → `app.js`.

## 2. Modèle de contenu

| Niveau | Enregistrement | Exemple |
|---|---|---|
| Matière | `M.registerSubject({ id, title, icon, color, soft, desc })` | `francais`, Français, 📚 |
| Domaine | `M.registerDomain({ id, subject, title, icon, color, soft, pda })` | `fr-grammaire`, La grammaire |
| Habileté | `M.registerSkill({ id, domain, title, icon, desc, pda, learn?, starter?, enrichment?, ungraded?, needs?, available?, parentNote?, check?, lint?, gen })` | `fr-nom-verbe` |
| Page Apprendre | `M.registerLearn({ id, domain, title, icon, short, intro, render(el) })` | `fr-classes-mots` |

**Identifiants** : préfixe de matière obligatoire pour les nouvelles matières (`fr-`, `en-`, `us-` univers social, `sc-` sciences).
Les habiletés de mathématique existantes ne sont pas préfixées (rétrocompatibilité de la progression enregistrée). Les ids sont
stables : les changer efface la progression de l'enfant.

**`pda`** : référence précise au programme (Progression des apprentissages, PFEQ) — affichée aux parents.

Champs facultatifs d'une habileté :
- `enrichment: true` — au-delà du programme de 2e année : 🌟 affiché, exclue de la révision automatique.
- `ungraded: true` — habileté de discussion (format `reflect`) : jamais notée, exclue de la révision.
- `needs: ['speech:en' | 'speech:fr']` — exige une voix; sinon l'habileté est verrouillée avec la raison.
- `available: () => true | 'raison'` — ex. « Demande à un adulte d'ajouter ta liste de mots ».
- `parentNote: 'html'` — note affichée sur la page Parents (aussi sur domaines et pages Apprendre).
- `check(q)` / `lint(q)` — contrôles de sens propres à l'habileté, exécutés par `tools/check-skills.js` (retourner un message = erreur).
Une matière peut définir `lint(q, skill)` (ex. anglais : pas de format `text`) et `cheers: [{ text, lang }]` (encouragements dans sa langue).

**`gen({ lvl })`** : retourne une question; `lvl` = 0, 1 ou 2 selon la maîtrise (★). `gen` **ne touche jamais au DOM**
(seuls `viz`/`showMe`/les formats le font) et doit produire des questions sans ambiguïté et variées.

## 3. Anatomie d'une question

```js
{
  // Contenu commun
  prompt: 'Consigne (html). {?} = case-réponse en ligne (format number).',
  say?: 'Texte lu par 🔊 (par défaut : la consigne)',
  passage?: { title?, html | tokens, say?, lang?, listenOnly? },  // texte à lire (compréhension), au-dessus de la consigne
      // tokens = M.tokenize(texte) → [{w, s}] : mots touchables (lus au toucher), marquables par tapwords target:'passage'
      // listenOnly : texte caché (compréhension orale), « 👀 Voir le texte » après la réponse
  audio?: 'texte' | { text | seq:[…], lang?, pause?, autoplay?: true|false|'once', key? },
      // écoute (dictée mot–phrase–mot avec seq, anglais) — boutons 🔊 Écoute et 🐢 Lentement
  scene?: [{ emoji | art, label }],           // bandeau d'images au-dessus de la consigne
  say?: 'texte' | [{ text, lang }],           // lecture de la consigne; <span lang="en"> dans prompt = voix anglaise
  sayLang?: 'en-CA',                          // consigne entièrement dans une autre langue
  viz?: (el) => {},                           // visuel interactif (concret → imagé)
  showMe?: (el) => Promise|void,              // démonstration animée (aussi jouée après un échec)
  hint?: 'Indice après la 1re erreur (html)',
  explain?: 'Explication après la réponse : COMMENT penser (html)',
  layout?: 'wide',                            // forcer la réponse pleine largeur
  tries?: 2,                                  // remplacer le nombre d'essais du format
  // Format
  format: 'number' | 'choice' | 'tf' | 'multi' | 'order' | 'text' | 'build' | 'match' | 'sort' | 'cloze' | 'tapwords' | 'hotspot'
        | 'label' | 'estimate' | 'steps' | 'predict' | 'info' | 'reflect',
  ...champs du format
}
```

`input` est un alias historique de `format`.

## 4. Formats de questions

| Format | Geste de l'enfant | Champs | Essais |
|---|---|---|---|
| `number` | Pavé numérique | `answer` (entier ≥ 0), `unit?`, `{?}` dans `prompt` | 2, « trop grand / trop petit » |
| `choice` | Touche une réponse (texte, emoji, SVG) | `choices:[{label,value,say?,lang?,why?}]`, `answer`, `cols?`, `audioOnly?` | 1 si 2 choix, sinon 2; `why` = message du distracteur |
| `tf` | Vrai / Faux | `answer: true/false`, `labels?:[{label},{label}]` (ex. 👍 Yes / 👎 No) | 1 |
| `multi` | Coche toutes les bonnes réponses + Vérifier | `choices`, `answer:[values]` | 2 |
| `order` | Touche dans l'ordre | `choices`, `answer:[values]`, `fixed?:[positions déjà placées]` (cycles) | 2 |
| `text` | Écrit un mot (clavier d'accents intégré) | `answer: str | [str]`, `caseSensitive?: true|'first'`, `accents?` (défaut exigés), `keyboard?: 'accents'|'full'|'none'`, `prefix?`, `suffix?`, `diagnose?`, `lang?` | 2; diagnostic : accents, majuscule, apostrophe, une lettre; lettres alignées |
| `build` | Construit un mot/une phrase avec des tuiles | `tiles:[str|{label,value,say?}]`, `answer:[values]`, `accept?:[[values]]`, `join?: ''|' '`, `fixedEnd?`, `capitalizeFirst?` | 2; cases justes gardées |
| `match` | Associe gauche ↔ droite | `pairs:[{left,right,sayLeft?,sayRight?}]`, `shuffleLeft?`, `lang?` | correction immédiate; ⭐ si aucune erreur |
| `sort` | Classe des éléments dans des boîtes | `bins:[{id,label}]`, `items:[{label,bin,say?}]` | correction immédiate; ⭐ si aucune erreur |
| `cloze` | Phrase à trous, banque de mots par trou | `text` avec `{0}`, `{1}`…, `blanks:[{choices,answer}]` | 2, trous fautifs en rouge |
| `tapwords` | Touche le(s) mot(s) dans une phrase **ou dans le texte** | `words:[str]` ('¶' = paragraphe) ou `target:'passage'` (+ `unit?:'word'|'sentence'`, `mark?:'q'|'d'|'x'`), `answer:[indices]`, `select?: 'one'|'many'`, `mode?:'letters'`, `hintSpan?` | 2; marques persistantes sur le texte |
| `hotspot` | Touche une zone d'une image | `html` (SVG avec `data-hot="id"`), `answer: id | [ids]`, `answerText?`, `answerSay?` | 2 |
| `label` | Place des étiquettes sur un dessin | `html` (zones `data-hot`, `data-anchor="x,y"`), `labels:[{id,text,say?}]`, `distractors?`, `explore?` | correction immédiate; ⭐ si aucune erreur |
| `estimate` | Place une valeur sur une droite | `lo`, `hi`, `answer`, `tolerance`, `labelEvery?`, `unit?` | 2 |
| `steps` | Plusieurs étapes guidées | `steps:[{label?, demarche?:0..5, prompt ({s1} = réponse de l'étape 1), format, …, viz?, after?}]`, `scoreSteps?` | par étape; ⭐ si les étapes comptées sont du 1er coup; texte collant |
| `predict` | Prédire → voir l'expérience → expliquer | `predict:{prompt?,choices}`, `outcome`, `simulate(el,pred)`, `result?`, `check?:{prompt,format,…}` | prédiction jamais notée; `check` noté |
| `info` | Lire puis « J'ai lu ✔ » (étape) | `html?`, `button?` | non noté |
| `reflect` | Carte de discussion avec un adulte | `prompt`, `scene?`, `actions?` (jamais d'`answer`) | jamais noté; participation comptée pour les parents |

Règles communes :
- **Une seule bonne réponse** dans `choice` ; pas de choix en double ; libellés courts.
- **Distracteurs plausibles** (erreurs typiques), jamais farfelus.
- `text` : exiger l'orthographe exacte (accents compris) sauf si l'habileté ne porte pas sur l'orthographe (`accents:false`).
- `steps` : pour la résolution de problèmes, suivre la démarche (§ 7) et terminer par une **phrase-réponse**.
- Ajouter un format = l'enregistrer dans `formats.js` avec `validate`, l'ajouter à `M.FORMAT_SAMPLES`, le documenter ici.

## 5. Composants d'interface (`M.ui`)

| Composant | Usage |
|---|---|
| `section({icon,title,intro,body})` | Bloc d'une page Apprendre |
| `callout(html,{tone:'tip'|'info'|'success'|'warn'})` | Astuce de Castor 🦫, info, bravo, attention |
| `speak(text,{lang})` | Bouton 🔊 déclaratif |
| `tag(text,color,soft)` | Étiquette colorée |
| `vocab([{emoji,word,say?,lang?,note?}])` | Grille de mots illustrés qui se lisent au toucher |
| `flashcards(el,[{front,back,say?,lang?}])` | Cartes-éclair à retourner |
| `reading(el,{title,text,lang})` | Texte où chaque mot se lit au toucher |
| `tabs(el,[{id,label,render}])` | Onglets (ex. : changer de modèle visuel) |
| `stepper(el,{label,value,min,max,onChange})` | Contrôle − valeur + |
| `demarche(steps?,active?)` | Pictogrammes de la démarche de résolution |
| `miniQuiz(el,[questions])` | Questions « Vérifie ta compréhension » dans une page Apprendre (non comptées) |
| `slider(el,{label,stops|min/max,value,onChange})` | Curseur à paliers illustrés (simulations) |
| `cycle({stages,hide})` | Cycle en cercle (zones `data-hot="c<i>"` pour hotspot) |
| `wordParts(word,parts,{mode,say})` | Mot découpé en syllabes/sons, chaque partie lue au toucher |
| `tagged([{w,tag}],{arrows})` | Phrase annotée avec classes de mots (couleurs `--cls-*`) |
| `gloss(word,fr,{lang})` | Mot étranger avec 🔊 et sens au 2e toucher |
| `feelings(el)` | Sélecteur d'émotions (rien n'est enregistré) |
| `compare({left,right})` | Deux colonnes : avant/maintenant, ici/ailleurs |
| `M.renderQuestion(el,q,opts)` | Une carte-question n'importe où |
| `M.viz.counters / blocks / base10Html / numberLine` | Cadres de dix, blocs base 10, droite numérique |
| `M.viz.barModel(el,spec) / barModelHtml(spec)` | Modèle en barres (tout, comparaison, groupes; inconnue en jaune) |
| `M.viz.timeline(spec)` | Ligne du temps SVG (événements et graduations `data-hot`) |
| `M.viz.plan(spec)` | Plan/carte : lieux `data-hot`, légende, quadrillage lettre-chiffre, rose des vents |
| `M.art.register(name, fn, emoji) / M.art.html(name)` | Dessins SVG partagés (avec repli emoji) |

Services (`services.js`) : `M.voices.status(lang)`, `M.say(text|segments, opts) → Promise`, `M.sayHtml(html)`, `M.settings`,
`M.userData.get/set(ns, key)` (+ `fixture` pour les tests), `M.registerParentTool({id,subject,title,icon,render})`,
`M.registerData(id, value)` / `M.data[id]`, `M.people.pick()` → `{n, f, il, Il, e, ami, un}`, `M.fr.de/que/nb/fill/cap`,
`M.typo`, `M.tokenize(text)`, `M.progress.item(skill, key).record(ok)`, `M.pickWeighted(items, keyFn, skill)`, `M.lint.noPrivate`.

Le CSS propre à une matière passe par `M.css()` avec un préfixe de classe (`fr-`, `en-`…), et seulement pour des visuels
spécifiques. Les boutons, cartes, couleurs et espacements viennent toujours des jetons et composants communs.

## 6. Style

- **Couleurs** : jetons de `tokens.css` uniquement. Vert = réussite, rouge = erreur, jaune = aide (indice, Montre-moi).
  Chaque matière a sa couleur (`--subj-*`).
- **Typographie** : consignes 1,45 rem gras; nombres et réponses en très gros; texte à lire 1,3 rem, interligne 1,8.
- **Cibles tactiles** ≥ 48 px; tout est utilisable au clavier (chiffres, Entrée, 1-9 pour les choix) et au toucher.
- **Mouvement** : animations courtes, désactivées si l'appareil demande moins de mouvement.
- **Largeur** : tout fonctionne de 360 px (téléphone) à 1100 px.
- **Images** : emoji et SVG en ligne seulement (aucun fichier externe, aucun droit d'auteur).

## 7. Contenu et pédagogie

- **Langue** : français québécois, au « tu » dans les consignes, au « on » dans les explications. Typographie française
  (espace avant `? ! :`, « guillemets »). Vocabulaire du programme.
- **Concret → imagé → abstrait** : proposer un visuel (`viz`) dès que c'est utile; `showMe` montre la démarche.
- **Rétroaction** : indice ciblé après la 1re erreur; après l'échec, bonne réponse + démonstration + explication.
  Jamais de minuterie ni de pénalité.
- **Explications** : dire *comment penser*, avec les nombres ou mots de la question.
- **Niveaux** : `lvl 0` = découverte (petits nombres, mots fréquents, 2–3 choix); `lvl 1` = attendu de fin d'année;
  `lvl 2` = défi (sans aller au-delà du programme).
- **Compréhension** : un texte (`passage`) court, adapté à 7 ans, avec des questions de repérage (qui, quoi, où), d'inférence
  simple et de vocabulaire.
- **Démarche de résolution** (toutes matières) : 📖 Je lis → 🔍 Je comprends → ✏️ Je planifie → 🧮 Je calcule →
  ✅ Je vérifie → 💬 Je réponds.
- **Contextes québécois** variés, prénoms variés, accords il/elle corrects; aucun stéréotype.

## 8. Ajouter une matière : liste de contrôle

1. `js/<matière>/subject.js` : `M.registerSubject` + domaines (`M.registerDomain`).
2. Habiletés dans `js/<matière>/skills/`, pages dans `js/<matière>/learn/`, données dans `js/<matière>/data/`.
3. Ajouter les `<script>` dans `index.html` (section de la matière, avant `styleguide.js`).
4. `node tools/check-skills.js` → OK (`--only fr-` pour une matière).
5. Navigateur : ouvrir `#/test` (auto-test) → ✅; vérifier les pages à 390 px et 1100 px; aucune erreur de console.
   Sans aperçu intégré : `python -m http.server` puis Chrome sans tête, p. ex.
   `chrome --headless=new --screenshot=out.png --window-size=1100,1400 "http://localhost:8000/#/matiere/francais"`.
6. Mettre à jour `docs/curriculum.md`.
