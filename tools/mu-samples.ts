#!/usr/bin/env node
/* =====================================================================
   tools/mu-samples.js — construit js/musique/samples.js (sons réels de la matière Musique)

   Sources (domaine public / CC0, aucune attribution requise) :
     - VCSL, Versilian Community Sample Library, CC0 1.0 — https://github.com/sgossner/VCSL
     - Wikimedia Commons, « Finger clicks.ogg » (domaine public)
   Chaque son est coupé, filtré, normalisé, encodé en MP3 mono puis mis en base64 dans un fichier
   JS (fonctionne en file://, où fetch() est interdit). Le fichier est chargé à la demande
   (M.MU.load) seulement sur les pages de musique.

   Usage : node tools/mu-samples.js [--cache <dossier>]   (ffmpeg doit être dans le PATH)
   Notes : les noms VCSL suivent la convention C3 = do central (MIDI 60); midi = 12 × (octave + 2) + classe.
   ===================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (k, d) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : d;
};
const CACHE = opt('--cache', path.join(os.tmpdir(), 'mu-samples', 'raw'));
const OUT = path.join(import.meta.dirname, '..', 'js', 'musique', 'samples.js');
const VCSL = 'https://raw.githubusercontent.com/sgossner/VCSL/master/';
const UA = 'devoirs-2e-annee/1.0 (https://github.com/AntonyGarand/devoirs)';

const PC = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const midiOf = (n) => {
  const m = n.match(/^([A-G]#?)(-?\d)$/);
  return 12 * (+m[2] + 2) + PC[m[1]];
};

/** sons : nom → { src, ss?, t (durée gardée), af? (filtres ffmpeg), fade? } ; notes : inst → [nom de note] */
const ONE = {
  tambour: { src: 'Membranophones/Struck Membranophones/Frame Drum/HDrumL_Hit_v2_rr1_Sum.wav', t: 1.6 },
  'tambour-sourd': { src: 'Membranophones/Struck Membranophones/Frame Drum/HDrumL_HitMuted_v2_rr1_Sum.wav', t: 0.6 },
  tambourin: { src: 'Idiophones/Struck Idiophones/Tambourine 1/Tamb1_Hit_v2_rr1_Mid.wav', t: 1.2 },
  triangle: { src: 'Idiophones/Struck Idiophones/Triangles/Triangle1_Hit_v1_rr1_Mid.wav', t: 3.2, fade: 1.2 },
  cymbale: { src: 'Idiophones/Struck Idiophones/Clash Cymbals 1/cymbal_crash1_mf1.wav', t: 3.2, fade: 1.4 },
  claves: { src: 'Idiophones/Struck Idiophones/Claves/Claves1_Hit_v2_rr1_Mid.wav', t: 0.45 },
  woodblock: { src: 'Idiophones/Struck Idiophones/Woodblock/wood_click_mp.wav', t: 0.4 },
  maracas: { src: 'Idiophones/Struck Idiophones/Shaker, Small/Mid_ShakerDouble_Down_rr1.wav', t: 0.27, fade: 0.05 },
  grelots: { src: 'Idiophones/Struck Idiophones/Sleigh Bells/Sleighbells_Hit_rr1_Mid.wav', t: 1.3 },
  gong: { src: 'Idiophones/Struck Idiophones/Gong 1/gong_mf.wav', t: 4.5, fade: 2 },
  mains: { src: 'Idiophones/Struck Idiophones/Claps/SoloClap_vl3.wav', t: 0.5 },
  pieds: { src: 'Idiophones/Struck Idiophones/Cajon/Cajon_hit1_f_rr1.wav', t: 0.5 }, // grave + bois : comme un pied sur un plancher
  cuisses: {
    src: 'Membranophones/Struck Membranophones/Frame Drum/HDrumL_Hand_rr1_Sum.wav',
    t: 0.3,
    fade: 0.2,
    af: 'afftdn=nf=-70,lowpass=f=2500',
  }, // main à plat sur une peau : mat, comme sur la cuisse
  doigts: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Finger_clicks.ogg',
    file: 'Finger_clicks.ogg',
    ss: 2.45,
    t: 0.22,
    af: 'highpass=f=500',
  },
};
const NOTES = {
  piano: {
    dir: 'Chordophones/Zithers/Grand Piano, Kawai/Sustains/GPiano_sus_%_v3_rr1_Player.wav',
    notes: ['C2', 'E2', 'C3', 'E3', 'G#3', 'C4', 'E4', 'G#4', 'C5', 'D#5', 'F#5'],
    t: 2.2,
    fade: 0.8,
  },
  flute: {
    dir: 'Aerophones/Edge-blown Aerophones/Baroque Tenor Recorder/Sustain/TenRecorder_Sus_%_rr1_Main.wav',
    notes: ['C3', 'E3', 'G#3', 'C4', 'E4', 'G#4', 'C5'],
    t: 2.6,
    fade: 0.15,
  },
  xylo: {
    dir: 'Idiophones/Struck Idiophones/Xylophone/Medium Mallets/Xylo_Medium_%_ff_01_far.wav',
    notes: ['G3', 'C4', 'G4', 'C5', 'G5'],
    t: 0.9,
    fade: 0.3,
  },
};

function fetchTo(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return;
  execFileSync('curl', ['-sfL', '-A', UA, '-o', file, url]);
}
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

/** Coupe, filtre, retire le silence du début (relatif au pic), normalise, MP3 mono 48 kb/s. Retourne { b64, rms }. */
function render(input, { ss = 0, t, af, fade = Math.min(0.25, t / 3) }) {
  const SR = 32000;
  const filt = ['aresample=' + SR, af].filter(Boolean).join(',');
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(ss), '-i', input, '-ac', '1', '-af', filt, '-f', 'f32le', '-'], {
    maxBuffer: 1e9,
  });
  const all = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
  let pk0 = 0;
  for (const v of all) pk0 = Math.max(pk0, Math.abs(v));
  let on = 0;
  while (on < all.length && Math.abs(all[on]) < pk0 * 0.03) on++;
  on = Math.max(0, on - Math.round(SR * 0.002));
  const a = all.slice(on, on + Math.round(SR * t));
  const nf = Math.round(SR * fade);
  for (let i = 0; i < nf && i < a.length; i++) a[a.length - 1 - i] *= (i / nf) ** 2;
  let pk = 0;
  for (const v of a) pk = Math.max(pk, Math.abs(v));
  const g = 0.89 / pk; // −1 dBFS
  let s = 0;
  const n = Math.min(a.length, 32000 * 0.25);
  for (let i = 0; i < n; i++) s += (a[i] * g) ** 2;
  const tmp = path.join(os.tmpdir(), `mu-${process.pid}.f32`);
  const out = path.join(os.tmpdir(), `mu-${process.pid}.mp3`);
  fs.writeFileSync(tmp, Buffer.from(Float32Array.from(a, (v) => v * g).buffer));
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-f',
    'f32le',
    '-ar',
    '32000',
    '-ac',
    '1',
    '-i',
    tmp,
    '-c:a',
    'libmp3lame',
    '-b:a',
    '48k',
    out,
  ]);
  const b64 = fs.readFileSync(out).toString('base64');
  fs.unlinkSync(tmp);
  fs.unlinkSync(out);
  return { b64, rms: Math.sqrt(s / n) };
}

fs.mkdirSync(CACHE, { recursive: true });
const S = {};
const TARGET = 0.16; // RMS visé sur le premier quart de seconde : volumes comparables d'un instrument à l'autre
const gainOf = (rms) => +Math.min(1.4, Math.max(0.4, TARGET / rms)).toFixed(2);
for (const [name, d] of Object.entries(ONE)) {
  const file = path.join(CACHE, d.file || `${name}.${path.extname(d.src).slice(1)}`);
  fetchTo(d.url || VCSL + enc(d.src), file);
  const r = render(file, d);
  S[name] = { gain: gainOf(r.rms), data: r.b64 };
  console.log(name.padEnd(14), `${(r.b64.length / 1024).toFixed(0)} Ko`, 'gain', S[name].gain);
}
for (const [inst, d] of Object.entries(NOTES)) {
  const zones = [];
  let rmsSum = 0;
  for (const n of d.notes) {
    const file = path.join(CACHE, `${inst}_${n}.wav`);
    fetchTo(VCSL + enc(d.dir.replace('%', n)), file);
    const r = render(file, d);
    rmsSum += r.rms;
    zones.push({ midi: midiOf(n), data: r.b64 });
  }
  S[inst] = { gain: gainOf(rmsSum / zones.length), zones };
  console.log(
    inst.padEnd(14),
    `${(zones.reduce((s, z) => s + z.data.length, 0) / 1024).toFixed(0)} Ko`,
    'gain',
    S[inst].gain,
    zones.map((z) => z.midi).join(','),
  );
}
const js = `/* Généré par tools/mu-samples.js — ne pas modifier à la main.\n   Sons : VCSL (CC0 1.0, https://github.com/sgossner/VCSL) et Wikimedia Commons « Finger clicks.ogg » (domaine public). */\n(window.M = window.M || {}).MU_SAMPLES = ${JSON.stringify(S)};\n`;
fs.writeFileSync(OUT, js);
console.log(`→ ${path.relative(process.cwd(), OUT)} ${(js.length / 1024).toFixed(0)} Ko`);
