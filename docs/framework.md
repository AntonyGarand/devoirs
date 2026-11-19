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
css/ds/layout.css             en-tête, accueil, tableaux de bord, pages Apprendre, parents, petits écrans
js/core.js                    utilitaires, voix (fr-CA / en-CA), progression, registre matières → domaines → habiletés
js/formats.js                 bibliothèque des formats de questions (M.registerFormat)
js/session.js                 carte-question (M.renderQuestion) et série de questions (M.runSession)
js/ui.js                      composants d'interface (M.ui.*)
js/viz.js                     visuels mathématiques (M.viz.*)
js/styleguide.js              guide de style vivant + un exemple par format (M.FORMAT_SAMPLES)
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
| Habileté | `M.registerSkill({ id, domain, title, icon, desc, pda, learn?, starter?, gen })` | `fr-nom-verbe` |
| Page Apprendre | `M.registerLearn({ id, domain, title, icon, short, intro, render(el) })` | `fr-classes-mots` |

**Identifiants** : préfixe de matière obligatoire pour les nouvelles matières (`fr-`, `en-`, `us-` univers social, `sc-` sciences).
Les habiletés de mathématique existantes ne sont pas préfixées (rétrocompatibilité de la progression enregistrée). Les ids sont
stables : les changer efface la progression de l'enfant.

**`pda`** : référence précise au programme (Progression des apprentissages, PFEQ) — affichée aux parents.

**`gen({ lvl })`** : retourne une question; `lvl` = 0, 1 ou 2 selon la maîtrise (★). `gen` **ne touche jamais au DOM**
(seuls `viz`/`showMe`/les formats le font) et doit produire des questions sans ambiguïté et variées.

## 3. Anatomie d'une question

```js
{
  // Contenu commun
  prompt: 'Consigne (html). {?} = case-réponse en ligne (format number).',
  say?: 'Texte lu par 🔊 (par défaut : la consigne)',
  passage?: { title?, html, say?, lang? },   // texte à lire (compréhension) — affiché au-dessus de la consigne
  audio?: 'texte' | { text, lang?, autoplay? }, // écoute (dictée, anglais) — boutons 🔊 Écoute et 🐢 Lentement
  viz?: (el) => {},                           // visuel interactif (concret → imagé)
  showMe?: (el) => Promise|void,              // démonstration animée (aussi jouée après un échec)
  hint?: 'Indice après la 1re erreur (html)',
  explain?: 'Explication après la réponse : COMMENT penser (html)',
  layout?: 'wide',                            // forcer la réponse pleine largeur
  tries?: 2,                                  // remplacer le nombre d'essais du format
  // Format
  format: 'number' | 'choice' | 'tf' | 'multi' | 'order' | 'text' | 'match' | 'sort' | 'cloze' | 'tapwords' | 'hotspot' | 'steps',
  ...champs du format
}
```

`input` est un alias historique de `format`.

## 4. Formats de questions

| Format | Geste de l'enfant | Champs | Essais |
|---|---|---|---|
| `number` | Pavé numérique | `answer` (entier ≥ 0), `unit?`, `{?}` dans `prompt` | 2, « trop grand / trop petit » |
| `choice` | Touche une réponse (texte, emoji, SVG) | `choices:[{label,value}]`, `answer`, `cols?` | 1 si 2 choix, sinon 2 |
| `tf` | Vrai / Faux | `answer: true/false` | 1 |
| `multi` | Coche toutes les bonnes réponses + Vérifier | `choices`, `answer:[values]` | 2 |
| `order` | Touche dans l'ordre | `choices`, `answer:[values]` | 2 |
| `text` | Écrit un mot (clavier d'accents intégré) | `answer: str | [str]`, `caseSensitive?`, `accents?` (défaut exigés), `keyboard?: 'accents'|'full'|'none'`, `lang?` | 2, lettres bien placées en vert |
| `match` | Associe gauche ↔ droite | `pairs:[{left,right}]`, `shuffleLeft?` | correction immédiate; ⭐ si aucune erreur |
| `sort` | Classe des éléments dans des boîtes | `bins:[{id,label}]`, `items:[{label,bin}]` | correction immédiate; ⭐ si aucune erreur |
| `cloze` | Phrase à trous, banque de mots par trou | `text` avec `{0}`, `{1}`…, `blanks:[{choices,answer}]` | 2, trous fautifs en rouge |
| `tapwords` | Touche le(s) mot(s) dans une phrase | `words:[str]`, `answer:[indices]`, `select?: 'one'|'many'` | 2 |
| `hotspot` | Touche une zone d'une image | `html` (SVG avec `data-hot="id"`), `answer`, `answerText?` | 2 |
| `steps` | Plusieurs étapes guidées | `steps:[{label, prompt, format, …, after?}]` | par étape; ⭐ si toutes du 1er coup |

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
| `M.renderQuestion(el,q,opts)` | Une carte-question n'importe où |
| `M.viz.*` | Cadres de dix, blocs base 10, droite numérique (mathématique) |

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
4. `node tools/check-skills.js` → OK.
5. Vérifier en navigateur à 390 px et 1100 px; aucune erreur de console.
6. Mettre à jour `docs/curriculum.md`.
