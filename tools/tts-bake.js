#!/usr/bin/env node
/* Synthétise les phrases de tools/tts/phrases.json en audio/<id>.mp3, puis écrit audio/index.js.
   Usage : node tools/tts-bake.js [--steps 16] [--chunk 40] [--limit N] [--only fr|en] [--prune] [--index-only]
   Reprend là où il s'est arrêté (les fichiers déjà faits sont gardés).

   Voix (audio.cpp, sur ce PC) :
     fr : OmniVoice, clonage de la voix de référence VOICE_FR (texte dans voices/prompt_text)
     en : Kokoro, voix native EN_VOICE (accent anglais correct pour les leçons d'anglais)
   Variables : AUDIOCPP_DIR (défaut ../../audiocpp), VOICE_FR (défaut antony_bws), EN_VOICE (af_heart). */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes(k);
const AC = path.resolve(process.env.AUDIOCPP_DIR || path.join(root, '..', 'audiocpp'));
const VOICE_FR = process.env.VOICE_FR || 'antony_bws';
const EN_VOICE = process.env.EN_VOICE || 'af_heart';
const STEPS = +arg('--steps', 16);
const CHUNK = +arg('--chunk', 40);
const LIMIT = +arg('--limit', Infinity);
const ONLY = arg('--only', null);
const OUT = path.join(root, 'audio');
const WORK = path.join(require('os').tmpdir(), 'devoirs-tts-work');

// même nettoyage / hachage que le site
const ctx = { window: {} }; ctx.window.M = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js', 'clips.js'), 'utf8'), ctx);
const C = ctx.window.M.clips;

const phrases = JSON.parse(fs.readFileSync(arg('--in', path.join(__dirname, 'tts', 'phrases.json')), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(WORK, { recursive: true });
const items = phrases.map((p) => ({ ...p, id: C.id(C.key(p.t, p.lang)) }));
const wanted = new Set(items.map((x) => x.id));

function writeIndex() {
  const have = fs.readdirSync(OUT).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)).filter((id) => wanted.has(id) || !flag('--prune'));
  if (flag('--prune')) fs.readdirSync(OUT).filter((f) => f.endsWith('.mp3') && !wanted.has(f.slice(0, -4))).forEach((f) => fs.unlinkSync(path.join(OUT, f)));
  have.sort();
  fs.writeFileSync(path.join(OUT, 'index.js'), `/* Généré par tools/tts-bake.js — ne pas modifier. ${have.length} enregistrements. */\nwindow.M.CLIP_INDEX = "${have.join(' ')}";\n`);
  return have.length;
}
if (flag('--index-only')) { console.log(writeIndex(), 'enregistrements dans audio/index.js'); process.exit(0); }

const refText = (() => {
  const line = fs.readFileSync(path.join(AC, 'voices', 'prompt_text'), 'utf8').split(/\r?\n/).find((l) => l.startsWith(VOICE_FR + '|'));
  if (!line) throw new Error(`voix ${VOICE_FR} absente de voices/prompt_text`);
  return line.split('|').slice(1).join('|').trim();
})();
const voiceRef = path.join(AC, 'voices', VOICE_FR + '.wav');

/** Ce qu'on envoie à la synthèse : un nombre seul se lit mieux suivi d'un point. */
const ttsText = (x) => (x.kind === 'num' || x.kind === 'piece') && !/[.!?]$/.test(x.t) ? x.t + (x.kind === 'num' ? '.' : '') : x.t;

/** Texte long (lecture) : une requête par groupe de phrases (~180 caractères), recollées ensuite. */
const chunks = (t) => {
  if (t.length <= 220) return [t];
  const sents = t.match(/[^.!?…]+[.!?…]+[»"]?s*|[^.!?…]+$/g) || [t];
  const out = [];
  for (const s0 of sents) { const s1 = s0.trim(); if (out.length && (out[out.length - 1] + ' ' + s1).length <= 180) out[out.length - 1] += ' ' + s1; else out.push(s1); }
  return out;
};
function synth(batch, lang) {
  const one = (id, text) => (lang === 'en'
    ? { id, text, language: 'en-us', voice_id: EN_VOICE }
    : { id, text, language: 'fr', voice_ref: voiceRef, reference_text: refText, seed: 42, options: { num_inference_steps: STEPS } });
  const req = [];
  for (const x of batch) { const cs = chunks(ttsText(x)); x.parts = cs.length; cs.forEach((t, i) => req.push(one(cs.length > 1 ? x.id + '__' + i : x.id, t))); }
  const reqPath = path.join(WORK, 'req.json'), manPath = path.join(WORK, 'batch.json');
  fs.writeFileSync(reqPath, JSON.stringify(req));
  try { fs.unlinkSync(manPath); } catch (e) {}
  const fam = lang === 'en' ? ['kokoro_tts', 'Kokoro-82M-GGUF/kokoro-82m-q8_0.gguf'] : ['omnivoice', 'OmniVoice-GGUF/omnivoice-q8_0.gguf'];
  const r = spawnSync(path.join(AC, 'audiocpp_cli.exe'), ['--task', 'tts', '--family', fam[0], '--model', path.join(AC, 'models', fam[1]), '--backend', 'vulkan', '--threads', '4',
    '--request-sequence', reqPath, '--out-dir', WORK, '--batch-manifest-out', manPath], { cwd: AC, env: { ...process.env, ESPEAK_DATA_PATH: path.join(AC, 'espeak-ng-data') }, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) console.log('  ⚠ audiocpp', r.status, String(r.stderr || '').split('\n').slice(-4).join(' | '));
  let ok = 0;
  for (const x of batch) {
    const wav = path.join(WORK, x.id + '.wav');
    if (x.parts > 1) {
      const ps = [...Array(x.parts)].map((_, i) => path.join(WORK, x.id + '__' + i + '.wav'));
      if (!ps.every((p) => fs.existsSync(p))) continue;
      const inputs = ps.flatMap((p) => ['-i', p]);
      const fc = ps.map((_, i) => `[${i}]apad=pad_dur=0.35[p${i}]`).join(';') + ';' + ps.map((_, i) => `[p${i}]`).join('') + `concat=n=${ps.length}:v=0:a=1`;
      spawnSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', fc, wav]);
      ps.forEach((p) => fs.unlinkSync(p));
    }
    if (!fs.existsSync(wav)) continue;
    const pad = x.kind === 'full' ? 0.06 : 0.02;
    // silence au début et à la fin retiré, volume égalisé, mp3 mono
    const f = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-af',
      `silenceremove=start_periods=1:start_threshold=-42dB:start_silence=${pad},areverse,silenceremove=start_periods=1:start_threshold=-42dB:start_silence=${pad},areverse,loudnorm=I=-17:TP=-1.5:LRA=11`,
      '-ar', '24000', '-ac', '1', '-b:a', '40k', path.join(OUT, x.id + '.mp3')], { encoding: 'utf8' });
    if (f.status === 0) ok++; else console.log('  ⚠ ffmpeg', x.id, f.stderr);
    fs.unlinkSync(wav);
  }
  return ok;
}

const todo = items.filter((x) => !fs.existsSync(path.join(OUT, x.id + '.mp3')) && (!ONLY || x.lang === ONLY));
// d'abord les phrases les plus entendues, l'anglais (rapide) en premier
// les nombres servent à toutes les phrases recollées : en tête (0 à 100 d'abord)
const prio = (x) => (x.kind === 'num' ? (+x.t <= 100 ? 1e6 : 1e4) : x.n);
todo.sort((a, b) => (a.lang === b.lang ? prio(b) - prio(a) : a.lang === 'en' ? -1 : 1));
const run = todo.slice(0, LIMIT);
console.log(`${items.length} enregistrements prévus, ${items.length - todo.length} déjà faits, ${run.length} à faire (fr : ${VOICE_FR}, ${STEPS} étapes; en : ${EN_VOICE}).`);
const t0 = Date.now();
let done = 0;
for (const lang of ['en', 'fr']) {
  const L = run.filter((x) => x.lang === lang);
  for (let i = 0; i < L.length; i += CHUNK) {
    done += synth(L.slice(i, i + CHUNK), lang);
    const n = writeIndex();
    const el = (Date.now() - t0) / 1000, rate = el / Math.max(1, done);
    console.log(`  ${lang} ${Math.min(i + CHUNK, L.length)}/${L.length} · ${n} au total · ${rate.toFixed(1)} s/clip · reste ~${((run.length - done) * rate / 3600).toFixed(1)} h`);
  }
}
console.log(`Terminé : ${done} nouveaux, ${writeIndex()} dans audio/index.js.`);
