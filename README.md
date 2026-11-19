# Mes devoirs — 2e année (Québec)

Site de pratique et d'apprentissage pour un enfant de **2e année du primaire** au Québec, aligné sur le
Programme de formation de l'école québécoise (PFEQ) et ses Progressions des apprentissages.

| Matière | Habiletés | Contenu |
|---|---|---|
| 🔢 Mathématique | 60 | nombres, opérations, **comprendre et résoudre des problèmes** (démarche, schémas en barres, marquer la question et les données), géométrie, mesure, statistique et probabilité, défis 🌟 |
| 📚 Français | 22 | sons et syllabes, lecture et compréhension de textes, dictées (liste orthographique du MEQ), grammaire, phrase, verbes, vocabulaire; **Ma liste de la semaine** (saisie par le parent) |
| 🗣️ Anglais | 16 | écoute (voix anglaise), vocabulaire illustré, consignes, situations, histoires et comptines originales |
| 🗺️ Univers social | 14 | émotions, besoins, civilité, règles, familles, communauté, plans, fêtes, symboles du Québec, avant et maintenant |
| 🔬 Sciences | 16 | le vivant, la matière (prédire → observer → expliquer), la Terre et le ciel, la démarche scientifique |

- **Pratiquer** : séries de 8 questions avec visuel à manipuler, indice, 👀 démonstration et explication.
- **Apprendre** : 49 petites leçons interactives.
- **Révision du jour** : questions entrelacées qui priorisent ce qui est le moins maîtrisé ou vu il y a longtemps.
- **Parents** : méthodologie, correspondance avec le programme, diagnostic des voix, réglages, outils (liste de mots).

Aucun serveur, aucune dépendance : ouvrir `index.html` (ou la version GitHub Pages). La progression est stockée dans le
`localStorage` du navigateur.

## Documentation

- [docs/framework.md](docs/framework.md) — **le cadre commun** : architecture, formats de questions, composants, style, règles de contenu, liste de contrôle pour ajouter une matière.
- [docs/curriculum.md](docs/curriculum.md) — correspondance de chaque habileté avec le programme (générée par `node tools/gen-curriculum.js`).
- [docs/methodologie.md](docs/methodologie.md) — choix pédagogiques.
- [docs/hld/](docs/hld/) — conception détaillée de chaque matière (portée, sources officielles, données, risques).
- Guide de style vivant : site → Parents → 🎨 Guide de style (`#/style`).

## Vérifier

```
node tools/check-skills.js          # génère 900 questions par habileté et valide chacune (formats, sens, règles de matière)
node tools/check-skills.js --only fr-
```

Dans le navigateur : `#/test` résout un exemple de chaque format et ouvre chaque habileté et chaque leçon.
