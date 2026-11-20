# Mes devoirs — 2e année (Québec)

Site de pratique et d'apprentissage pour un enfant de **2e année du primaire** au Québec, aligné sur le
Programme de formation de l'école québécoise (PFEQ) et ses Progressions des apprentissages.

| Matière           | Habiletés | Contenu                                                                                                                                                                                                                                                                                               |
| ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔢 Mathématique   | 60        | nombres, opérations, **comprendre et résoudre des problèmes** (démarche, schémas en barres, marquer la question et les données), géométrie, mesure, statistique et probabilité, défis 🌟                                                                                                              |
| 📚 Français       | 24        | sons et syllabes, lecture et compréhension de textes, apprécier une histoire, écrire des phrases, dictées (liste orthographique du MEQ), grammaire, phrase, verbes, vocabulaire; **Ma liste de la semaine** (saisie par le parent)                                                                    |
| 🗣️ Anglais        | 16        | écoute (voix anglaise), vocabulaire illustré, consignes, situations, histoires et comptines originales                                                                                                                                                                                                |
| 🗺️ Univers social | 15        | émotions, besoins, civilité, dialogue, règles, familles, communauté, plans, fêtes, symboles du Québec, avant et maintenant                                                                                                                                                                            |
| 🔬 Sciences       | 16        | le vivant, la matière (prédire → observer → expliquer), la Terre et le ciel, la démarche scientifique                                                                                                                                                                                                 |
| 🎵 Musique        | 12        | fort / doux, aigu / grave, long / court, sec / résonnant; tempo, pulsation, rythmes (ta, ti-ti, chut); instruments de percussion, voix et corps; do, ré, mi et petit piano jouable; forme A-B, ce que la musique exprime — vrais instruments enregistrés (CC0), compositeur de rythmes, jeu de l'écho |

- **Pratiquer** : séries de 8 questions avec visuel à manipuler, indice, 👀 démonstration et explication.
- **Apprendre** : 54 petites leçons interactives.
- **Voix et musique** : voix préenregistrée (repli sur la voix de l'appareil), musique d'ambiance générée en direct (bouton 🎵).
- **Révision du jour** : questions entrelacées qui priorisent ce qui est le moins maîtrisé ou vu il y a longtemps.
- **Parents** : méthodologie, correspondance avec le programme, diagnostic des voix, réglages, outils (liste de mots).

En ligne : https://devoir.garand.dev/. Le site publié n'a aucune dépendance; le code est en **TypeScript**, compilé par
[tsrs](https://github.com/oxc-project/tsrs) dans `dist/` (voir « Développer »). `dist/index.html` s'ouvre aussi en `file://`.
La progression est stockée dans le
`localStorage` du navigateur (Parents → « Exporter / Importer la progression » pour la sauvegarder ou la transférer).

## Hors ligne et mises à jour (GitHub Pages)

En http(s), le service worker (`sw/sw.ts` → `dist/sw.js`) garde l'application en cache : elle s'ouvre sans réseau, la voix enregistrée
(`audio/*.mp3`) et les sons d'instruments sont téléchargés une seule fois. `manifest.webmanifest` + `icons/` permettent
« Ajouter à l'écran d'accueil ». En `file://`, rien de tout cela n'est activé.

La compilation (`npm run build`) remplit la liste des fichiers et l'empreinte de version du service worker : une nouvelle
version est installée au prochain chargement; la page se recharge d'elle-même, sauf pendant une série de questions
(rechargement à la page suivante).

## Développer

Node 24 ou plus récent (les outils `.ts` sont exécutés directement par Node).

```
npm install
npm run dev            # compile, sert dist/ sur http://localhost:8080 et recompile à chaque modification
                       # (npm run dev -- --host 0.0.0.0 --port 8932 : essayer sur une tablette du réseau)
npm run build          # compile dans dist/ (tsrs : js/**/*.ts → dist/js/**/*.js, sw/sw.ts → dist/sw.js) + fichiers statiques
npm run check          # tout : types, lint, format, knip, contenu (ce que la CI exécute)
npm run typecheck      # tsrs (port Rust de tsc 7) : site + outils, mode strict
npm run lint           # oxlint            ·  npm run lint:fix
npm run format         # oxfmt (écrit)     ·  npm run format:check
npm run knip           # fichiers et dépendances inutilisés (points d'entrée lus dans index.html)
```

Pas de cadriciel d'interface ni de modules ES : le site garde son petit cadre maison (`window.M`, scripts classiques
chargés dans l'ordre par `index.html`), maintenant typé (`types/*.d.ts`, voir docs/framework.md § Types). C'est ce qui
permet de garder `file://` et un site sans dépendance. **Publication** : chaque poussée sur `main` passe par GitHub
Actions (`.github/workflows/deploy.yml` : vérifications, compilation stricte, puis publication de `dist/` sur Pages).

## Documentation

- [docs/framework.md](docs/framework.md) — **le cadre commun** : architecture, formats de questions, composants, style, règles de contenu, liste de contrôle pour ajouter une matière.
- [docs/curriculum.md](docs/curriculum.md) — correspondance de chaque habileté avec le programme (générée par `npm run curriculum`).
- [docs/methodologie.md](docs/methodologie.md) — choix pédagogiques.
- [docs/hld/](docs/hld/) — conception détaillée de chaque matière (portée, sources officielles, données, risques).
- Guide de style vivant : site → Parents → 🎨 Guide de style (`#/style`).

## Vérifier

```
npm run check:skills                # compile, puis génère 900 questions par habileté et valide chacune (formats, sens, règles)
npm run check:dupes                 # niveaux qui ont peu de questions différentes (à enrichir)
node tools/check-skills.ts --only fr-   # une matière (après npm run build)
```

Dans le navigateur : `#/test` résout un exemple de chaque format et ouvre chaque habileté et chaque leçon.

## Crédits et licences

- **Sons d'instruments** (matière Musique, `js/musique/samples.js`) : [VCSL — Versilian Community Sample Library](https://github.com/sgossner/VCSL),
  CC0 1.0 (domaine public); claquements de doigts : Wikimedia Commons « Finger clicks.ogg », domaine public.
- **Voix française enregistrée** (`audio/`) : la voix de l'auteur, synthétisée avec OmniVoice à partir d'un enregistrement de
  référence. Tous droits réservés : ne pas réutiliser ces fichiers ni s'en servir pour cloner la voix.
- **Voix anglaise** : Kokoro-82M (voix `af_heart`), modèle publié sous licence Apache 2.0.
- **Chansons et comptines traditionnelles** : domaine public. Les autres textes, histoires et comptines sont originaux.
- Dessins : SVG faits à la main dans le code et emoji du système; aucune image externe.
- Musique d'ambiance : générée en direct (Web Audio), aucun fichier.
