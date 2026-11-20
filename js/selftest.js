/* =====================================================================
   selftest.js — test automatique des formats dans le navigateur (#/test)
   Répond correctement à chaque exemple de M.FORMAT_SAMPLES et vérifie que
   la carte se termine « réussie du premier coup ». Ensuite, ouvre chaque
   habileté et chaque page Apprendre pour détecter les erreurs JavaScript.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const W = (ms) => M.sleep(ms);
  const click = (el) => { if (!el) throw new Error('élément introuvable'); if (typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true })); };

  /** Résout une question (ou une étape) affichée dans host. */
  async function solve(host, q, root) {
    const f = q.format || q.input;
    const $ = (s) => M.$(s, host), $$ = (s) => M.$$(s, host);
    const byLabel = (sel, label) => $$(sel).find((b) => b.textContent.trim().startsWith(M.text(label).trim()));
    switch (f) {
      case 'number': for (const d of String(q.answer)) click($(`.key[data-k="${d}"]`)); click($('.key.ok')); break;
      case 'choice': { const i = q.choices.findIndex((c) => String(c.value) === String(q.answer)); click($$('.choice-btn')[i]); if (q.audioOnly) click($$('.choice-btn')[i]); break; }
      case 'tf': click($$('.choice-btn')[q.answer ? 0 : 1]); break;
      case 'multi': q.choices.forEach((c, i) => { if (q.answer.some((a) => String(a) === String(c.value))) click($$('.choice-btn')[i]); }); click($('.fmt-check')); break;
      case 'order': for (const v of q.answer) { const i = q.choices.findIndex((c) => String(c.value) === String(v)); const b = $(`.choice-btn[data-i="${i}"]`); if (!b.disabled) click(b); } break;
      case 'text': $('.text-input').value = Array.isArray(q.answer) ? q.answer[0] : q.answer; click($('.fmt-check')); break;
      case 'build': { const used = new Set(); for (const v of q.answer) { const b = $$('.build-tile').find((t) => !t.disabled && !used.has(t) && q.tiles.map((x) => (typeof x === 'string' ? x : x.value))[+t.dataset.i] === v); used.add(b); click(b); } click($('.fmt-check')); break; }
      case 'match': for (let i = 0; i < q.pairs.length; i++) { click($(`.match-item[data-side="L"][data-i="${i}"]`)); click($(`.match-item[data-side="R"][data-i="${i}"]`)); } break;
      case 'sort': for (let k = 0; k < q.items.length; k++) { const it = $$('.sort-item:not(.in)').find((b) => q.items[+b.dataset.i]); const item = q.items[+it.dataset.i]; click(it); click($(`.sort-bin[data-bin="${item.bin}"]`)); } break;
      case 'cloze': for (let i = 0; i < q.blanks.length; i++) { click($(`.cloze-gap[data-i="${i}"]`)); click($$('.chip-btn').find((c) => c.dataset.c === String(q.blanks[i].answer))); } click($('.fmt-check')); break;
      case 'tapwords': {
        const P = q.target === 'passage';
        const els = P ? M.$$('.ptok', root) : $$('.tw');
        const pick = (i) => { const e = els.find((x) => +x.dataset.i === i); click(e); };
        if (P && q.unit === 'sentence') { const toks = root.__tokens; q.answer.forEach((s) => pick(toks.findIndex((t) => t.s === s && t.w !== '¶'))); }
        else q.answer.forEach(pick);
        if (!(q.select === 'one' || (q.select !== 'many' && q.answer.length === 1))) click($('.fmt-check'));
        break;
      }
      case 'hotspot': (Array.isArray(q.answer) ? q.answer : [q.answer]).forEach((id) => click($(`[data-hot="${id}"]`))); if (Array.isArray(q.answer)) click($('.fmt-check')); break;
      case 'label': for (const l of q.labels) { click($$('.chip-btn').find((c) => c.textContent === l.text)); M.$(`[data-hot="${l.id}"]`, host).dispatchEvent(new MouseEvent('click', { bubbles: true })); } break;
      case 'estimate': { const svg = $('svg'); const r = svg.getBoundingClientRect(); const vx = 40 + ((q.answer - q.lo) / (q.hi - q.lo)) * 920; svg.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + (vx / 1000) * r.width, clientY: r.top + 10 })); click($('.fmt-check')); break; }
      case 'info': click($('.fmt-check')); break;
      case 'reflect': click($('.choice-btn')); break;
      case 'steps':
        for (let k = 0; k < q.steps.length; k++) {
          await W(30);
          const li = $(`.step[data-k="${k}"]`);
          await solve(M.$('.step-body', li), q.steps[k], root);
          await W(520);
        }
        break;
      case 'predict':
        click($('.pr-ask .choice-btn'));
        await W(20); click($('.pr-run')); await W(900);
        if (q.check) await solve(M.$('.pr-check .step-body', host), q.check, root);
        break;
      default: throw new Error('format sans solveur : ' + f);
    }
  }

  M.selfTest = async function (out) {
    const log = [];
    const errs = [];
    const onErr = (e) => errs.push(e.message || String(e.reason || e));
    // On quitte #/test pendant le test : on arrête tout (sinon le test continue en arrière-plan et parle par-dessus la page).
    const h0 = location.hash;
    const gone = () => location.hash !== h0;
    window.addEventListener('error', onErr);
    window.addEventListener('unhandledrejection', onErr);
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:-3000px;top:0;width:1000px';
    document.body.appendChild(box);
    const finish = () => { box.remove(); window.removeEventListener('error', onErr); window.removeEventListener('unhandledrejection', onErr); M.hush(); return { aborted: true, ok: false, formats: log, errors: errs }; };
    for (const [name, mk] of Object.entries(M.FORMAT_SAMPLES)) {
      if (gone()) return finish();
      const q = mk();
      let res = null;
      const card = M.renderQuestion(box, q, { record: false, onResult: (r) => (res = r) });
      if (q.passage && q.passage.tokens) box.__tokens = q.passage.tokens;
      try {
        await W(20);
        await solve(M.$('.q-input', box), q, box);
        await W(q.format === 'steps' ? 600 : 300);
        const ok = res && res.ok && (res.first || res.ungraded);
        log.push([name, ok ? '✅' : '❌', res ? JSON.stringify(res) : 'pas de résultat']);
      } catch (e) { log.push([name, '❌', e.message]); }
      card.destroy();
    }
    box.remove();
    // Chaque habileté (3 niveaux) et chaque page Apprendre
    let skillErr = 0;
    for (const s of M.skills) {
      if (gone()) return finish();
      for (let lvl = 0; lvl <= 2; lvl++) {
        const host = document.createElement('div');
        host.style.cssText = 'position:absolute;left:-3000px;top:0;width:1000px';
        document.body.appendChild(host);
        try { const c = M.renderQuestion(host, s.gen({ lvl }), { skill: s, record: false }); await W(5); c.destroy(); } catch (e) { skillErr++; errs.push(s.id + ' : ' + e.message); }
        host.remove();
      }
    }
    for (const l of M.learns) {
      if (gone()) return finish();
      const host = document.createElement('div');
      host.style.cssText = 'position:absolute;left:-3000px;top:0;width:1000px';
      document.body.appendChild(host);
      try { l.render(host); await W(5); } catch (e) { errs.push('apprendre ' + l.id + ' : ' + e.message); }
      host.remove();
      M.cleanup();
    }
    M.hush();
    window.removeEventListener('error', onErr);
    window.removeEventListener('unhandledrejection', onErr);
    const result = { formats: log, errors: errs, ok: log.every((l) => l[1] === '✅') && !errs.length };
    if (gone()) return { ...result, aborted: true };
    if (out) out.innerHTML = `<div class="card doc"><h1>🧪 Auto-test ${result.ok ? '✅' : '❌'}</h1><table><tr><th>Format</th><th></th><th>Résultat</th></tr>${log.map((l) => `<tr><td>${l[0]}</td><td>${l[1]}</td><td><code>${M.esc(l[2])}</code></td></tr>`).join('')}</table>
      <h2>Habiletés (${M.skills.length} × 3 niveaux) et pages Apprendre (${M.learns.length})</h2><p>${errs.length ? errs.map((e) => `<div class="callout warn">${M.esc(e)}</div>`).join('') : '✅ Aucune erreur.'}</p></div>`;
    return result;
  };
})();
