#!/usr/bin/env node
/* Rend la musique d'ambiance en fichier, pour l'écouter sans navigateur.
   Usage : node tools/music-preview.js [jeu|calme] [maths|francais|anglais|univers|sciences] [secondes] [sortie.wav] */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { OfflineAudioContext, type AudioBuffer } from 'node-web-audio-api';

/** M.music de js/music.js (seul script chargé) : render() rend la musique d'ambiance hors ligne. */
interface PreviewM {
  music?: { render(offline: OfflineAudioContext, secs: number, mood?: string, subject?: string): Promise<AudioBuffer> };
}

const [mood = 'jeu', subject = 'maths', secs = '40', out = `music-${mood}-${subject}.wav`] = process.argv.slice(2);
const ctx: { window: { M?: PreviewM }; [name: string]: unknown } = { window: {}, document: {}, Math, setTimeout, clearTimeout };
ctx.window.M = {};
const M: PreviewM = ctx.window.M;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(import.meta.dirname, '..', 'dist', 'js', 'music.js'), 'utf8'), ctx);

const SR = 44100;
const off = new OfflineAudioContext(2, Math.ceil(+secs * SR), SR);
if (!M.music) throw new Error('M.music absent : dist/js/music.js est-il compilé ?');
M.music.render(off, +secs, mood, subject).then((buf) => {
  const ch = [buf.getChannelData(0), buf.getChannelData(1)],
    n = ch[0].length;
  const data = Buffer.alloc(44 + n * 4);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + n * 4, 4);
  data.write('WAVEfmt ', 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write('data', 36);
  data.writeUInt32LE(n * 4, 40);
  let peak = 0;
  for (let i = 0; i < n; i++)
    for (let c = 0; c < 2; c++) {
      const v = Math.max(-1, Math.min(1, ch[c][i]));
      peak = Math.max(peak, Math.abs(v));
      data.writeInt16LE(Math.round(v * 32767), 44 + i * 4 + c * 2);
    }
  fs.writeFileSync(out, data);
  console.log(`${out} : ${secs} s, crête ${(20 * Math.log10(peak || 1e-9)).toFixed(1)} dBFS`);
});
