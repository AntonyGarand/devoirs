# Mes devoirs de maths — 2e année (Québec)

Site de pratique et d'apprentissage des mathématiques pour un enfant de **2e année du primaire** au Québec, aligné sur la
[Progression des apprentissages (PDA) — Mathématique — Primaire](https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf) du PFEQ.

- **Tableau de bord** : toutes les habiletés de 2e année, regroupées par domaine (nombres, opérations, géométrie, mesure, statistique et probabilité), avec la maîtrise de chacune (★ à ★★★).
- **Pratiquer** : séries de 8 questions, avec un visuel à manipuler, des indices, une démonstration (👀 Montre-moi) et une explication.
- **Apprendre** : petites leçons interactives sur les notions clés.
- **Révision du jour** : 10 questions entrelacées, qui priorisent ce qui est le moins maîtrisé ou pratiqué il y a longtemps.
- **Parents** : méthodologie, correspondance avec la PDA, réglages.

Aucun serveur, aucune dépendance : ouvrir `index.html` dans un navigateur. La progression est stockée dans le `localStorage` du navigateur.

Voir [docs/curriculum.md](docs/curriculum.md) pour la correspondance avec le programme et [docs/methodologie.md](docs/methodologie.md) pour les choix pédagogiques.

## Structure

```
index.html            coquille de l'application (routes par #hash)
css/app.css           styles partagés
js/core.js            utilitaires, progression, registre, moteur de session (window.M)
js/viz.js             visuels partagés : cadres de dix, blocs base 10, droite numérique
js/skills/<domaine>.js  habiletés (générateurs de questions)
js/learn/<domaine>.js   pages « Apprendre »
js/app.js             routeur, tableau de bord, pages
tools/check-skills.js vérification automatique des générateurs (node)
```

Pas de modules ES (pour fonctionner en `file://`) : chaque fichier est un IIFE qui utilise `window.M`.

## Ajouter une habileté

```js
M.registerSkill({
  id: 'add-20',              // unique
  domain: 'operations',      // nombres | operations | geometrie | mesure | stats
  title: 'Additions jusqu'à 20',
  icon: '➕',
  desc: 'Une phrase pour l'enfant.',
  pda: 'Opérations A.2 — répertoire mémorisé (0 + 0 à 10 + 10)',
  learn: 'strategies',       // id d'une page Apprendre (optionnel)
  starter: true,             // proposée dans la première révision (optionnel)
  gen({ lvl }) {             // lvl 0, 1 ou 2 (selon la maîtrise)
    return {
      prompt: '<div class="eq">7 + 5 = {?}</div>', // {?} = case-réponse en ligne
      say: '7 plus 5 égale combien ?',            // texte lu (optionnel)
      input: 'number',       // 'number' | 'choice' | 'order'
      answer: 12,
      choices: [{ label: 'html', value: 'x' }],   // pour choice / order
      unit: 'cm',            // suffixe (number)
      viz(el) { /* monter un visuel interactif dans el */ },
      showMe(el) { /* démonstration animée (peut retourner une Promise) */ },
      hint: 'Indice après la 1re erreur',
      explain: 'Explication affichée après la réponse',
    };
  },
});
```

- `choice` : 1 essai si 2 choix, sinon 2 essais. `order` : `answer` est le tableau des `value` dans le bon ordre.
- `number` : 2 essais ; l'enfant reçoit « trop grand / trop petit » après le 1er.

## Ajouter une page Apprendre

```js
M.registerLearn({
  id: 'strategies', domain: 'operations', title: 'Les stratégies de calcul', icon: '🧠',
  short: 'Doubles, compléments à 10…',
  intro: 'Texte d'introduction (lu à voix haute).',
  render(el) { el.innerHTML = '<section class="l-sec"><h2>…</h2>…</section>'; },
});
```

## Vérifier

```
node tools/check-skills.js
```
