// knip : le site n'utilise pas d'import (scripts classiques chargés par index.html), donc les points d'entrée
// sont lus dans index.html (+ scripts chargés à la demande). Un .ts que rien ne charge = fichier inutilisé.
import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const pages = [...html.matchAll(/<script src="(js\/[^"]+)\.js"><\/script>/g)].map((m) => `${m[1]}.ts`);
const lazy = ['js/styleguide.ts', 'js/selftest.ts']; // chargés par app.ts (#/style, #/test)

export default {
  entry: [...pages, ...lazy, 'sw/sw.ts', 'scripts/*.ts', 'tools/*.ts'],
  project: ['js/**/*.ts', 'sw/**/*.ts', 'scripts/**/*.ts', 'tools/**/*.ts'],
  ignoreBinaries: ['ffmpeg'], // outil externe (voix enregistrée, sons d'instruments)
};
