/* =====================================================================
   skills/orthographe.js — J'écris les mots (fr-orthographe)
     fr-dictee, fr-bonne-orthographe, fr-lettres-muettes, fr-majuscule-apostrophe
   Les mots viennent de la Liste orthographique (data/mots.js, lo 1–2).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const D = 'fr-orthographe';
  const LO = (pred = () => true) => FR.mots((m) => m.lo >= 1 && pred(m));
  const simple = (w) => /^[a-zàâçéèêëîïôûùœ]+$/.test(w);
  /** Phrase-repère pour une forme fléchie. */
  const formeCtx = (m, kind) => {
    if (kind === 'fem') return m.cls === 'adj' ? { w: m.fem, phrase: `Il est ${m.w}. Elle est ${m.fem}.` } : { w: m.fem, phrase: `Un ${m.w}, une ${m.fem}.` };
    const pl = FR.plur(m);
    return m.cls === 'adj' ? { w: pl, phrase: `Un chat ${m.w}, des chats ${pl}.` } : { w: pl, phrase: `Un ${m.w}, des ${pl}.` };
  };

  /* ---------------- 🎧 Ma dictée de mots ---------------- */
  M.registerSkill({
    id: 'fr-dictee', domain: D, title: 'Ma dictée de mots', icon: '🎧', starter: true, learn: 'fr-bien-ecrire',
    desc: 'Écoute le mot et écris-le.',
    pda: 'Orthographe d\'usage A.1 — mots de la Liste orthographique du 1er cycle (→ 1re, ★ 2e)',
    needs: ['speech:fr'],
    parentNote: 'Dictée à la québécoise : le mot, une phrase, puis le mot encore. Les mots viennent de la <i>Liste orthographique</i> du ministère (1re et 2e année). Les mots les plus souvent ratés reviennent plus souvent.',
    gen({ lvl }) {
      if (lvl === 0) {
        const m = FR.pickMot('fr-dictee', LO((x) => x.lo === 1 && simple(x.w) && x.w.length >= 3 && x.w.length <= 5));
        const { tiles, answer } = FR.letterTiles(m.w, 2);
        return {
          prompt: 'Écoute, puis construis le mot avec les lettres.', audio: { seq: [m.w, m.phrase, m.w], pause: 900, autoplay: 'once' },
          format: 'build', join: '', tiles, answer,
          hint: 'Dis le mot lentement. Quel son entends-tu en premier ?',
          explain: `On écrit <b>${FR.motHtml(m)}</b>. ${FR.motTip(m)}`,
        };
      }
      if (lvl === 2 && Math.random() < 0.5) {
        const cand = LO((x) => (x.fem && x.cls === 'adj') || (x.cls === 'nom' && x.pl && simple(x.pl) && !['ciel', 'mal'].includes(x.w)) || (x.cls === 'nom' && x.fem));
        const m = FR.pickMot('fr-dictee', cand, (x) => x.w + '+');
        const kind = m.cls === 'adj' || (m.fem && (!m.pl || Math.random() < 0.5)) ? 'fem' : 'pl';
        const f = formeCtx(m, kind);
        return FR.dictee(f.w, {
          phrase: f.phrase,
          hint: kind === 'fem' ? `Pense à <b>${m.w}</b> : pour le féminin, on ajoute souvent un <b>e</b>.` : `Pense à <b>${m.w}</b>. ${/eau$|eu$/.test(m.w) ? 'Après <b>eau</b> ou <b>eu</b>, le pluriel prend un <b>x</b>.' : /al$/.test(m.w) ? '<b>al</b> devient <b>aux</b> au pluriel.' : 'Au pluriel, on ajoute souvent un <b>s</b>.'}`,
          explain: kind === 'fem' ? `<b>${m.w}</b> → <b>${f.w}</b> (féminin).` : `<b>${m.w}</b> → <b>${f.w}</b> (pluriel).`,
        });
      }
      const pool = LO((x) => (lvl === 2 ? x.lo === 2 || x.mu : true) && x.w.length >= 2);
      const m = FR.pickMot('fr-dictee', pool);
      return FR.dictee(m.w, { phrase: m.phrase, hint: FR.motTip(m) || 'Dis le mot lentement, une syllabe à la fois.', explain: `On écrit <b>${FR.motHtml(m)}</b>. ${FR.motTip(m)}` });
    },
    check(q) {
      const seq = q.audio && q.audio.seq;
      if (!seq || seq.length < 2) return 'dictée sans séquence audio';
      const w = q.format === 'text' ? q.answer : q.answer.join('');
      if (seq[0] !== w) return 'l\'audio ne dit pas le mot';
      if (FR.isHomophone(w) && seq.length < 3) return 'homophone sans phrase';
      if (seq.length === 3 && !FR.norm(seq[1]).includes(FR.norm(w).split(' ')[0])) return 'la phrase ne contient pas le mot : ' + seq[1];
    },
  });

  /* ---------------- 🔎 Le mot bien écrit ---------------- */
  M.registerSkill({
    id: 'fr-bonne-orthographe', domain: D, title: 'Le mot bien écrit', icon: '🔎', learn: 'fr-bien-ecrire',
    desc: 'Un seul mot est bien écrit. Trouve-le !',
    pda: 'Orthographe d\'usage A.1, C.1 a (graphies d\'un même son)',
    parentNote: 'Les fautes proposées sont fabriquées (même son écrit autrement, double consonne, lettre muette oubliée, accent) et ne sont <b>jamais</b> de vrais mots.',
    gen({ lvl }) {
      for (let t = 0; t < 40; t++) {
        const m = FR.pickMot('fr-bonne-orthographe', LO((x) => simple(x.w) && x.w.length >= 3));
        if (lvl === 2) {
          const words = m.phrase.split(' ');
          const k = words.findIndex((x) => FR.norm(x.replace(/[.,!?;:]/g, '').replace(/^[a-z]+'/i, '')) === FR.norm(m.w));
          if (k < 0) continue;
          const f = FR.fautes(m.w, 1)[0];
          if (!f) continue;
          const raw = words[k];
          const pre = (raw.match(/^[a-z]+'/i) || [''])[0], post = (raw.match(/[.,!?;:]+$/) || [''])[0];
          const body = raw.slice(pre.length, raw.length - post.length);
          const fixedCase = /^[A-ZÀ-Ý]/.test(body) ? M.fr.cap(f) : f;
          const shown = words.slice();
          shown[k] = pre + fixedCase + post;
          return {
            prompt: 'Un mot est <b>mal écrit</b> dans la phrase. Touche-le.', audio: { text: m.phrase, autoplay: 'once' },
            format: 'tapwords', words: shown, answer: [k],
            hint: 'Lis chaque mot lentement. Lequel a l\'air bizarre ?',
            explain: `Il fallait écrire <b>${M.esc(m.w)}</b> et non <s>${M.esc(f)}</s>. ${FR.motTip(m)}`,
          };
        }
        const n = lvl === 0 ? 1 : 2;
        const bad = FR.fautes(m.w, n, { noEr: true });
        if (bad.length < n) continue;
        return {
          prompt: 'Écoute. Touche le mot <b>bien écrit</b>.', audio: { seq: [m.w, m.phrase], pause: 700, autoplay: 'once' },
          format: 'choice', answer: m.w, cols: n + 1,
          choices: M.shuffle([m.w, ...bad]).map((x) => ({ label: `<span style="font-size:1.5rem">${M.esc(x)}</span>`, value: x })),
          hint: 'Ferme les yeux et imagine le mot. Quelle forme as-tu déjà vue ?',
          explain: `On écrit <b>${FR.motHtml(m)}</b>. ${FR.motTip(m)}`,
        };
      }
      const m = M.pick(LO());
      return FR.dictee(m.w, { phrase: m.phrase });
    },
    check(q) {
      if (q.format === 'choice') {
        if (!FR.uniqueNorm(q.choices.map((c) => c.value))) return 'choix en double';
        const real = q.choices.filter((c) => c.value !== q.answer && FR.isReal(c.value));
        if (real.length) return 'distracteur = vrai mot : ' + real[0].value;
      }
      if (q.format === 'tapwords') { const w = q.words[q.answer[0]].replace(/[.,!?;:]/g, '').replace(/^[a-z]+'/i, ''); if (FR.isReal(w)) return 'faute = vrai mot : ' + w; }
    },
  });

  /* ---------------- 🤫 Les lettres muettes ---------------- */
  const FINALES = ['t', 'd', 's', 'p', 'x', 'c'];
  M.registerSkill({
    id: 'fr-lettres-muettes', domain: D, title: 'Les lettres muettes', icon: '🤫', learn: 'fr-bien-ecrire',
    desc: 'Certaines lettres ne s\'entendent pas. Trouve-les !',
    pda: 'Orthographe d\'usage C.2 a, b.i–ii — lettres muettes justifiées par le féminin ou la famille (→ 1re, → 2e)',
    gen({ lvl }) {
      if (lvl === 0) {
        const m = M.pick(FR.mots((x) => x.gr && x.em && x.gr.some((p) => p.s === '' && p.g !== 'h')));
        const idx = []; let i = 0;
        m.gr.forEach((p) => { [...p.g].forEach(() => { if (p.s === '') idx.push(i); i++; }); });
        return {
          prompt: `Touche la lettre <b>muette</b> dans <b>${m.w}</b> ${m.em}.`, audio: { text: m.w, autoplay: 'once' },
          format: 'tapwords', mode: 'letters', words: [...m.w], answer: idx, select: idx.length > 1 ? 'many' : 'one',
          hint: 'Dis le mot lentement. Quelle lettre ne fait aucun son ?',
          explain: `<b>${FR.motHtml(m)}</b> : on n'entend pas ${idx.map((k) => `le <b>${m.w[k]}</b>`).join(' ni ')}.${m.why ? ` On l'entend dans ${FR.q(m.why)} !` : ''}`,
        };
      }
      const cand = FR.mots((x) => x.mu && x.why && x.w.endsWith(x.mu) && FINALES.includes(x.mu));
      const m = M.pick(cand);
      const stem = m.w.slice(0, -1);
      if (lvl === 2 && Math.random() < 0.4 && m.cls === 'nom') {
        // pluriel : deux lettres muettes (la lettre du mot + le s du pluriel)
        const pl = FR.plur(m);
        if (pl === m.w + 's') {
          return {
            prompt: `Touche les lettres <b>muettes</b> dans <b>des ${pl}</b>.`, audio: { text: 'des ' + pl, autoplay: 'once' },
            format: 'tapwords', mode: 'letters', words: [...pl], answer: [pl.length - 2, pl.length - 1], select: 'many',
            hint: 'Il y en a deux : une dans le mot, une pour le pluriel.',
            explain: `Dans <b>${pl}</b>, le <b>${m.mu}</b> est muet (on l'entend dans ${FR.q(m.why)}) et le <b>s</b> du pluriel aussi.`,
          };
        }
      }
      if (lvl === 2) {
        return FR.dictee(m.w, { phrase: m.phrase, hint: `Une lettre muette se cache à la fin. Pense à ${FR.q(m.why)}.`, explain: `<b>${m.w}</b> : on n'entend pas le <b>${m.mu}</b>, mais on l'entend dans ${FR.q(m.why)}.` });
      }
      const others = M.shuffle(FINALES.filter((l) => l !== m.mu && !FR.isReal(stem + l)));
      const opts = [m.mu, ...others.slice(0, 2)];
      return {
        prompt: `Quelle lettre muette termine le mot ? <div class="fr-big">${M.esc(stem)}<span class="fr-hl">&nbsp;?&nbsp;</span></div> Pense à ${FR.q(m.why)}.`,
        say: `Quelle lettre muette termine le mot ${m.w} ? Pense à ${m.why}.`,
        audio: { seq: [m.w, m.why], pause: 700, autoplay: 'once' },
        stem, format: 'choice', answer: m.mu, cols: 3, choices: M.shuffle(opts).map((l) => ({ label: `<span class="fr-big" style="font-size:1.8rem">${l}</span>`, value: l })),
        hint: `Dis ${FR.q(m.why)} : quelle lettre entends-tu à la fin ?`,
        explain: `On n'entend pas le <b>${m.mu}</b> de <b>${m.w}</b>, mais on l'entend dans <b>${m.why}</b>.`,
      };
    },
    check(q) {
      if (q.format === 'choice' && q.choices.some((c) => c.value !== q.answer && FR.isReal(q.stem + c.value))) return 'un autre choix forme un vrai mot';
    },
  });

  /* ---------------- 🅰️ Majuscule et apostrophe ---------------- */
  const PETS = ['Minou', 'Filou', 'Moka', 'Pistache', 'Biscuit', 'Galette'];
  const LIEUX = ['Québec', 'Montréal', 'Gaspé', 'Rimouski', 'Sherbrooke', 'Laval', 'Gatineau', 'Saguenay'];
  const VOY = FR.mots((m) => m.cls === 'nom' && FR.elide(m.w) && (m.g === 'm' || m.g === 'f') && simple(m.w));
  const JE = [['aime', 'le chocolat'], ['arrive', 'à l\'école'], ['habite', 'à Laval'], ['écoute', 'la chanson'], ['ouvre', 'la porte'], ['attends', 'l\'autobus'], ['entends', 'le bruit']];
  M.registerSkill({
    id: 'fr-majuscule-apostrophe', domain: D, title: 'Majuscule et apostrophe', icon: '🅰️', learn: 'fr-bien-ecrire',
    desc: 'Un nom propre a une majuscule. <i>le</i> + <i>arbre</i> → <i>l\'arbre</i>.',
    pda: 'Orthographe d\'usage C.4 a.i (majuscule des noms propres), C.5 a.i (élision le, la, je, ne) — → 1re, ★ 2e',
    gen({ lvl }) {
      const r = Math.random();
      if (lvl === 1 && r < 0.6) {
        if (Math.random() < 0.6) {
          const m = M.pick(VOY);
          const bad = m.g === 'f' ? 'la' : 'le';
          const other = bad === 'la' ? 'le' : 'la';
          return {
            prompt: `Comment écrit-on ? <div style="text-align:center">${m.em ? `<span style="font-size:2.4rem">${m.em}</span>` : ''}</div>`,
            say: `Comment écrit-on ${'l\'' + m.w} ?`,
            format: 'choice', answer: 'l\'' + m.w, cols: 3,
            choices: M.shuffle([`l'${m.w}`, `${bad} ${m.w}`, `${other} ${m.w}`]).map((x) => ({ label: `<span style="font-size:1.4rem">${x}</span>`, value: x })),
            hint: `<b>${m.w}</b> commence par ${/^h/.test(m.w) ? 'un <b>h</b> muet' : 'une voyelle'}. Le <b>e</b> ou le <b>a</b> disparaît : on met une apostrophe.`,
            explain: `Devant une voyelle, <b>${bad}</b> devient <b>l'</b> : <b>l'${m.w}</b>.`,
          };
        }
        const [v, suite] = M.pick(JE);
        const ne = Math.random() < 0.5;
        const good = ne ? `Il n'${v.replace(/s$/, '')} pas ${suite}.` : `J'${v} ${suite}.`;
        const vv = ne ? v.replace(/s$/, '') : v;
        const badS = ne ? `Il ne ${vv} pas ${suite}.` : `Je ${v} ${suite}.`;
        return {
          prompt: 'Quelle phrase est bien écrite ?', format: 'choice', answer: good, cols: 1,
          choices: M.shuffle([good, badS]).map((x) => ({ label: `<span style="font-size:1.3rem">${M.esc(x)}</span>`, value: x })),
          hint: `Devant une voyelle, <b>${ne ? 'ne' : 'je'}</b> perd son <b>e</b>.`,
          explain: `Devant <b>${vv}</b> (qui commence par une voyelle), <b>${ne ? 'ne' : 'je'}</b> devient <b>${ne ? 'n\'' : 'j\''}</b>.`,
        };
      }
      if (lvl >= 1 && r < 0.8) {
        const pool = lvl === 2 ? LIEUX : M.people.NAMES.map((x) => x[0]);
        const w = M.pick(pool);
        // le nom est MONTRÉ (en minuscules) : l'enfant ne peut pas deviner Maëlle, Inès ou Sherbrooke à l'oreille.
        // Ce qu'on vérifie ici, c'est la majuscule.
        return {
          prompt: `${lvl === 2 ? 'Écris le nom de cette ville' : 'Écris ce prénom'} avec la bonne majuscule.<div class="fr-big" style="font-size:1.6rem">${M.esc(w.toLocaleLowerCase('fr-CA'))}</div>`,
          say: lvl === 2 ? 'Écris le nom de cette ville avec la bonne majuscule.' : 'Écris ce prénom avec la bonne majuscule.',
          audio: { seq: [w, w], pause: 700, autoplay: 'once' },
          format: 'text', answer: w, caseSensitive: 'first', keyboard: 'full',
          hint: lvl === 2 ? 'Le nom d\'une ville est un nom propre : il commence par une majuscule.' : 'Un prénom commence toujours par une <b>majuscule</b>.',
          explain: `<b>${w}</b> est un nom propre : on l'écrit avec une majuscule.`,
        };
      }
      const p1 = M.people.pick(), p2 = M.people.pick({ not: [p1.n] });
      const T = lvl < 2
        ? M.pick([
          [`${p1.n} joue avec ${p2.n} .`, [0, 3]], [`hier , ${p1.n} a vu ${p2.n} .`, [0, 2, 5]], [`mon chat s'appelle ${M.pick(PETS)} .`, [0, 3]],
          [`${p1.n} et ${p2.n} glissent .`, [0, 2]], [`le chien de ${p1.n} s'appelle ${M.pick(PETS)} .`, [0, 3, 5]],
        ])
        : M.pick([
          [`${p1.n} habite à ${M.pick(LIEUX)} .`, [0, 3]], [`samedi , ${p1.n} va à ${M.pick(LIEUX)} .`, [0, 2, 5]],
          [`${p1.n} et ${p2.n} visitent ${M.pick(LIEUX)} .`, [0, 2, 4]], [`mon ami ${p1.n} vient de ${M.pick(LIEUX)} .`, [0, 2, 5]],
        ]);
      // la ponctuation reste collée au mot précédent; indices recalculés
      const raw = [], map = [];
      T[0].split(' ').forEach((x, i) => { if (x === '.' || x === ',') raw[raw.length - 1] += x; else { map[i] = raw.length; raw.push(x); } });
      const words = raw.map((x) => x.toLocaleLowerCase('fr-CA'));
      const answer = T[1].map((i) => map[i]);
      return {
        prompt: 'Touche les mots qui ont besoin d\'une <b>majuscule</b>.',
        format: 'tapwords', words, answer, select: 'many',
        hint: 'Le premier mot de la phrase, et les noms propres (prénoms, noms d\'animaux, villes).',
        explain: `On écrit : <b>${raw.map((x, i) => (answer.includes(i) ? M.fr.cap(x) : x)).join(' ')}</b> Majuscule au début de la phrase et aux noms propres.`,
      };
    },
  });
})();
