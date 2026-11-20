/* =====================================================================
   sciences/subject.js — Science et technologie / Découverte du monde (1er cycle)
   Matière + 4 domaines (docs/hld/sciences.md § 2) et petites aides partagées M.SC :
     M.SC.reduced()            mouvement réduit demandé ?
     M.SC.tween(ms, fn(t))     animation (t de 0 à 1) → Promise; état final direct si mouvement réduit
     M.SC.wait(ms)             pause (0 si mouvement réduit)
     M.SC.emojiOk(ch)          l'emoji s'affiche-t-il sur cet appareil ? (canvas; vrai hors navigateur)
     M.SC.pic(x, size)         image d'un animal / objet : emoji, ou dessin M.art (repli)
     M.SC.lbl(x)               « image + nom » (le nom est TOUJOURS écrit : emoji parfois approximatif)
     M.SC.cap(s), M.SC.plain(html)
   Les générateurs gen() ne touchent jamais au DOM.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = (M.SC = M.SC || {});
  const NOTE_CYCLE =
    "Au 1<sup>er</sup> cycle, Science et technologie n'est <b>pas une matière distincte au bulletin</b> : ses apprentissages sont intégrés aux autres matières (français, mathématique…). Ici, c'est du contenu d'<b>intégration et d'enrichissement</b>, aligné sur la Progression des apprentissages.";

  M.registerSubject({
    id: 'sciences',
    title: 'Sciences',
    icon: '🔬',
    color: '#9b5de5',
    soft: '#f1e8fd',
    desc: 'Le vivant, la matière, la Terre et le ciel : observer, prédire, expliquer.',
    parentNote: NOTE_CYCLE,
    /** Règles propres à la matière (tools/check-skills.js). */
    lint(q) {
      const t = JSON.stringify([q.prompt, q.explain, q.hint, q.choices, q.check, q.items, q.pairs]);
      if (/hiberne/.test(t) && /ours/.test(t) && /l'ours[^"]{0,40}hiberne/.test(t))
        return "l'ours « dort », il n'« hiberne » pas (HLD § 7)";
      if (/cocon/i.test(t) && /monarque/.test(t) && !/chrysalide/.test(t)) return 'le monarque fait une chrysalide, pas un cocon';
      if (/plus proche du Soleil/i.test(t)) return 'jamais de cause des saisons (HLD § 7)';
    },
  });
  [
    {
      id: 'sc-vivant',
      title: 'Le vivant',
      icon: '🌱',
      color: '#06a77d',
      soft: '#dcf7ee',
      pda: 'Univers vivant (UV A, B, C, D) + Éducation physique et à la santé (saines habitudes)',
      parentNote: NOTE_CYCLE,
    },
    {
      id: 'sc-matiere',
      title: 'La matière et les objets',
      icon: '🧲',
      color: '#9b5de5',
      soft: '#f1e8fd',
      pda: 'Univers matériel (UM A, C, D)',
    },
    { id: 'sc-terre', title: 'La Terre et le ciel', icon: '🌍', color: '#118ab2', soft: '#dff3fb', pda: 'Terre et espace (TE A, C, D)' },
    {
      id: 'sc-demarche',
      title: 'Démarche scientifique',
      icon: '🔎',
      color: '#f78c40',
      soft: '#ffe9d6',
      pda: "Stratégies d'exploration (PDA p. 14); compétence du 1er cycle « Explorer le monde de la science et de la technologie »",
    },
  ].forEach((d) => M.registerDomain({ subject: 'sciences', ...d }));

  /* ------------------------------------------------------------ aides */
  SC.reduced = () => {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  };
  SC.wait = (ms) => M.sleep(SC.reduced() ? 0 : ms);
  SC.tween = (ms, fn) =>
    new Promise((res) => {
      if (SC.reduced()) {
        try {
          fn(1);
        } catch (e) {}
        return res();
      }
      // setTimeout (et non requestAnimationFrame) : l'animation se termine même dans un onglet caché.
      const t0 = Date.now();
      const step = () => {
        const t = Math.min(1, (Date.now() - t0) / ms);
        try {
          fn(t);
        } catch (e) {
          return res();
        }
        if (t < 1) setTimeout(step, 16);
        else res();
      };
      step();
    });
  SC.ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  SC.cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  /** Contractions devant un nom avec article : de + le clou → « du clou », à + le chat → « au chat »,
      de + les lunettes → « des lunettes »; la / l' inchangés; prénom à voyelle → « d'Amira ». */
  SC.de = (nom) =>
    String(nom)
      .replace(/^le /, 'du ')
      .replace(/^les /, 'des ')
      .replace(/^(la |l')/, 'de $1')
      .replace(/^(?!du |des |de )([aeiouyhàâéèêîïôûœ])/i, "d'$1")
      .replace(/^(?!du |des |de |d')/, 'de ');
  SC.a = (nom) =>
    String(nom)
      .replace(/^le /, 'au ')
      .replace(/^les /, 'aux ')
      .replace(/^(?!au |aux )/, 'à ');
  SC.plain = (html) =>
    String(html)
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  /** Détection (une fois par emoji) : un emoji non pris en charge s'affiche en carré noir/blanc, sans couleur. */
  const EOK = {};
  SC.emojiOk = function (ch) {
    if (EOK[ch] !== undefined) return EOK[ch];
    let ok = true;
    try {
      const c = document.createElement('canvas');
      if (c && c.getContext) {
        c.width = c.height = 24;
        const g = c.getContext('2d');
        g.textBaseline = 'top';
        g.font = '20px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
        g.fillText(ch, 0, 0);
        const d = g.getImageData(0, 0, 24, 24).data;
        ok = false;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] > 0 && (Math.abs(d[i] - d[i + 1]) > 20 || Math.abs(d[i + 1] - d[i + 2]) > 20)) {
            ok = true;
            break;
          }
        }
      }
    } catch (e) {
      ok = true;
    }
    EOK[ch] = ok;
    return ok;
  };
  /** Image d'une fiche ({emoji?, art?, recent?}) : dessin si pas d'emoji, emoji récent non affiché → dessin ou rien. */
  SC.pic = function (x, size = 40) {
    if (!x) return '';
    if (x.art && (!x.emoji || (x.recent && !SC.emojiOk(x.emoji))))
      return M.art && M.art.has(x.art) ? M.art.html(x.art, { size, alt: x.nom }) : '';
    if (x.emoji && x.recent && !SC.emojiOk(x.emoji)) return '';
    return x.emoji || '';
  };
  /** Libellé « image + nom » (le nom n'est jamais omis). */
  SC.lbl = (x, size = 40) => `<span class="sc-lbl">${SC.pic(x, size)}<span>${x.nom}</span></span>`;
  SC.castor = (html, tone = 'tip') => M.ui.callout('<b>Castor :</b> ' + html, { tone });

  /* ------------------------------------------------------------ styles (préfixe sc-) */
  try {
    M.css(`
    .sc-lbl { display: inline-flex; align-items: center; gap: 6px; line-height: 1.15 }
    .sc-lbl > :first-child { font-size: 1.6em; line-height: 1 }
    .sc-lbl .art { flex: 0 0 auto }
    .sc-lblv { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; font-size: .9rem; line-height: 1.1; text-align: center }
    .sc-fig { width: 100%; max-width: 520px; height: auto; display: block; margin: 0 auto }
    .sc-stage { background: #f6f1ff; border: 3px solid var(--line); border-radius: 18px; padding: 8px; display: flex; justify-content: center }
    .sc-stage svg { width: 100%; max-width: 460px; height: auto }
    .sc-choice-fig { width: 100%; max-width: 170px; height: auto; display: block; margin: 0 auto }
    .sc-cap { display: block; font-size: .95rem; font-weight: 800; margin-top: 2px }
    .sc-sim { display: grid; grid-template-columns: minmax(260px, 1.2fr) minmax(240px, 1fr); gap: 16px; align-items: start }
    @media (max-width: 760px) { .sc-sim { grid-template-columns: 1fr } }
    .sc-ctrls { display: flex; flex-direction: column; gap: 12px }
    .sc-log { border-collapse: collapse; width: 100%; background: #fff; font-size: .98rem }
    .sc-log th, .sc-log td { border: 2px solid var(--line); padding: 4px 8px; text-align: center }
    .sc-log th { background: #f1e8fd }
    .sc-msg { font-weight: 800; text-align: center; min-height: 1.5em; margin: 6px 0 }
    .sc-chips { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 }
    .sc-chips .btn { padding: 6px 12px; min-height: 44px; font-size: 1rem }
    .sc-gal { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; margin-top: 10px }
    .sc-card { background: #fff; border: 3px solid var(--line); border-radius: 18px; padding: 8px; display: flex; flex-direction: column; align-items: center; gap: 4px; box-shadow: 0 4px 0 var(--line); font-weight: 800; position: relative; min-height: 112px }
    .sc-card .sc-big { font-size: 2.6rem; line-height: 1.1; min-height: 56px; display: flex; align-items: center }
    .sc-card.dim { opacity: .28 }
    .sc-card .sc-badge { position: absolute; top: 4px; right: 6px; font-size: 1.3rem }
    .sc-card.on { border-color: var(--pur); background: #f6effe }
    .sc-detail { background: #fff; border: 3px solid var(--pur); border-radius: 18px; padding: 12px 14px; margin-top: 10px; display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap }
    .sc-detail .sc-big { font-size: 4rem; line-height: 1 }
    .sc-detail ul { margin: 6px 0 0; padding-left: 20px }
    .sc-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px }
    .sc-tile { font-size: 1.05rem; background: #fff; border: 3px solid var(--line); border-radius: 18px; padding: 10px; text-align: center; box-shadow: 0 4px 0 var(--line); font-weight: 800 }
    .sc-tile .sc-big { font-size: 2.6rem; display: block }
    .sc-tile.on { border-color: var(--pur); background: #f6effe }
    .sc-tile small { display: block; font-weight: 700; color: var(--muted) }
    .sc-explore [data-hot] { cursor: pointer }
    .sc-explore .sc-hl { filter: drop-shadow(0 0 6px #9b5de5) }
    .sc-hot-label { font: 800 15px sans-serif; fill: #2b2d42; paint-order: stroke; stroke: #fff; stroke-width: 4px }
    .sc-cycle-box { display: grid; grid-template-columns: minmax(240px, 340px) 1fr; gap: 14px; align-items: center }
    @media (max-width: 700px) { .sc-cycle-box { grid-template-columns: 1fr } }
    .sc-cycle-box .cycle { width: 100%; max-width: 340px; height: auto; display: block; margin: 0 auto }
    .sc-cycle-box .cyc-st { cursor: pointer }
    .sc-cycbox { padding: 4px 34px 30px } .sc-cycbox .cycle { overflow: visible; width: 100%; max-width: 340px; height: auto; display: block; margin: 0 auto }
    .sc-cycle-box .cyc-st.sc-on circle { stroke: #9b5de5; fill: #f6effe }
    .sc-lab-items { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px }
    .sc-lab-item { background: #fff; border: 3px solid var(--line); border-radius: 16px; padding: 8px; text-align: center; font-weight: 800 }
    .sc-lab-item .sc-big { font-size: 2rem; display: block; min-height: 44px }
    .sc-lab-item .row { justify-content: center; margin-top: 4px; gap: 6px }
    .sc-lab-item .btn { min-height: 44px; padding: 4px 10px }
    .sc-lab-item.yes { border-color: var(--C); background: var(--Cc) }
    .sc-lab-item.no { border-color: #c9c3b4; background: #f4f1ea }
    .sc-daybar { display: flex; height: 26px; border-radius: 999px; overflow: hidden; border: 3px solid var(--line); max-width: 420px }
    .sc-daybar span { display: flex; align-items: center; justify-content: center; font-size: .85rem; font-weight: 800 }
    `);
  } catch (e) {
    /* hors navigateur */
  }
})();
