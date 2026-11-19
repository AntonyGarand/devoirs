/* =====================================================================
   session.js — carte-question unique (M.renderQuestion) et série (M.runSession)

   Toutes les matières utilisent la même carte : en-tête, texte à lire
   (passage), écoute (audio), consigne, visuel + outils, zone de réponse
   (fournie par un FORMAT, voir formats.js), rétroaction, explication.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  /** Contenus audio déjà joués automatiquement dans la série (autoplay: 'once'). */
  M.heard = new Set();

  /** Message de réessai standard. */
  function retryMsg(q, val) {
    let msg = 'Pas tout à fait… Essaie encore 💪';
    if (val != null && typeof q.answer === 'number' && typeof val === 'number') msg = (val > q.answer ? 'C\'est un peu trop grand.' : 'C\'est un peu trop petit.') + ' Essaie encore 💪';
    if (q.hint) msg += `<div class="hint-text">💡 ${q.hint}</div>`;
    return msg;
  }

  /**
   * Monte UNE question dans host.
   * opts: { skill?, onResult({first, ok}), onNext?, nextLabel?, record?: true, compact?: false }
   * Retourne { destroy() }
   */
  M.renderQuestion = function (host, q, opts = {}) {
    const fmtName = q.format || q.input;
    const fmt = M.formats[fmtName];
    if (!fmt) { host.innerHTML = `<div class="callout warn">Format inconnu : ${M.esc(fmtName)}</div>`; return { destroy() {} }; }
    const sk = opts.skill;
    const dom = sk ? M.domainById[sk.domain] || {} : {};
    const wide = q.layout === 'wide' || fmt.layout === 'wide';
    const passage = q.passage ? (typeof q.passage === 'string' ? { html: q.passage } : q.passage) : null;
    const audio = q.audio ? (typeof q.audio === 'string' ? { text: q.audio } : q.audio) : null;
    const ungraded = M.isUngraded(q);
    const subj = sk ? M.subjectById[M.subjectOf(sk)] : null;
    const isSteps = fmtName === 'steps';
    // Texte : HTML ou jetons touchables ({w, s}; '¶' = paragraphe)
    const passageBody = passage ? (passage.tokens
      ? passage.tokens.map((t, i) => (t.w === '¶' ? '<span class="p-br"></span>' : `<span class="ptok" data-i="${i}">${M.esc(t.w)}</span>`)).join(' ')
      : passage.html) : '';
    const sceneHtml = q.scene ? `<div class="q-scene" role="img" aria-label="${M.esc(q.scene.map((x) => x.label || '').join(', '))}">${q.scene.map((x) => `<span title="${M.esc(x.label || '')}">${x.emoji || (x.art ? M.art.html(x.art, { size: 72 }) : '')}</span>`).join('')}</div>` : '';
    const passageHtml = passage ? `<div class="q-passage ${isSteps ? 'sticky' : ''} ${passage.listenOnly ? 'listen-only' : ''}">
        <div class="q-passage-head"><b>${passage.listenOnly ? '👂' : '📖'} ${passage.title ? M.esc(passage.title) : passage.listenOnly ? 'Écoute l\'histoire' : 'Lis le texte'}</b>
        <span><button class="btn icon q-read" title="Écouter le texte">🔊</button>${isSteps && !passage.listenOnly ? '<button class="btn q-fold">🔼 Replier</button>' : ''}</span></div>
        <div class="q-passage-text" ${passage.listenOnly ? 'hidden' : ''}>${passageBody}</div>
        ${passage.listenOnly ? '<button class="btn q-see" hidden>👀 Voir le texte</button>' : ''}</div>` : '';

    host.innerHTML = `
      <div class="card q-card">
        ${sk ? `<div class="q-head"><span class="tag" style="background:${dom.soft || '#eee'};color:${dom.color || '#333'}">${sk.icon || dom.icon || ''} ${M.esc(sk.title)}</span>${sk.learn && M.learnById[sk.learn] ? ` <a class="learn-link" href="#/apprendre/${sk.learn}">📘 Apprendre</a>` : ''}</div>` : ''}
        ${sceneHtml}
        ${passageHtml}
        ${audio ? `<div class="q-audio"><button class="btn blue big q-listen">🔊 Écoute</button><button class="btn q-slow" title="Plus lentement">🐢 Lentement</button></div>` : ''}
        <div class="q-prompt-row"><div class="q-prompt"></div><button class="btn icon q-speak" title="Écouter la consigne">🔊</button></div>
        <div class="q-body ${q.viz ? '' : 'noviz'} ${wide ? 'wide' : ''}">
          <div class="q-left"><div class="q-viz"></div><div class="q-tools"></div></div>
          <div class="q-right">
            <div class="q-input"></div>
            <div class="q-feedback"></div>
            <div class="q-explain"></div>
            <button class="btn primary big q-next" hidden>${opts.nextLabel || 'Suivant ➜'}</button>
          </div>
        </div>
      </div>`;
    const el = (s) => M.$(s, host);
    const vizEl = el('.q-viz'), inputEl = el('.q-input');
    const S = { tries: 0, done: false, keyFn: null, vizInner: null, inst: null };
    const maxTries = q.tries || (fmt.maxTries ? fmt.maxTries(q) : 2);

    // Consigne (avec case en ligne {?} si le format la gère)
    const promptHtml = q.prompt || '';
    const hasInline = promptHtml.includes('{?}');
    function setInline(html) {
      el('.q-prompt').innerHTML = hasInline ? promptHtml.replace('{?}', html) : promptHtml;
    }
    setInline('<span class="ans-box">?</span>');

    // Lecture
    const sayPrompt = () => (Array.isArray(q.say) ? M.say(q.say) : M.sayHtml(q.say || promptHtml, { lang: q.sayLang }));
    el('.q-speak').onclick = sayPrompt;
    const passageText = () => passage.say || (passage.tokens ? passage.tokens.filter((t) => t.w !== '¶').map((t) => t.w).join(' ') : M.text(passage.html));
    if (passage) el('.q-read').onclick = () => M.say(passageText(), { lang: passage.lang, raw: (passage.lang || '').startsWith('en') });
    const audioSegs = (rate) => (audio.seq || [audio.text]).map((t) => ({ text: t, lang: audio.lang, raw: true, rate: rate || audio.rate }));
    let autoplayed = false;
    if (audio) {
      el('.q-listen').onclick = () => M.say(audioSegs(), { pause: audio.pause || 900 });
      el('.q-slow').onclick = () => M.say(audioSegs(0.6), { pause: audio.pause || 900 });
      const key = audio.key || (audio.seq || [audio.text]).join('|');
      const once = audio.autoplay === 'once';
      if (audio.autoplay !== false && !(once && M.heard.has(key))) {
        autoplayed = true;
        M.heard.add(key);
        setTimeout(() => { if (host.isConnected) M.say(audioSegs(), { pause: audio.pause || 900 }); }, 350);
      }
    }
    if (!autoplayed && M.settings.get('autoRead')) setTimeout(() => { if (host.isConnected) sayPrompt(); }, 300);

    // Texte à jetons : toucher un mot le lit, sauf pendant une étape de marquage
    let passageCtl = null;
    if (passage && passage.tokens) {
      const pEl = el('.q-passage-text');
      const toks = [];
      M.$$('.ptok', pEl).forEach((t) => (toks[+t.dataset.i] = t));
      let tapFn = null;
      passageCtl = {
        el: pEl, tokens: toks, tokenData: passage.tokens,
        setMarking(on) { pEl.classList.toggle('marking', !!on); },
        onTap(fn) { tapFn = fn; },
      };
      pEl.onclick = (e) => {
        const t = e.target.closest('.ptok');
        if (!t) return;
        if (tapFn) return tapFn(+t.dataset.i);
        M.say(t.textContent.replace(/[.,!?;:«»"()]/g, ''), { lang: passage.lang, raw: true });
      };
    }
    if (passage && passage.listenOnly) el('.q-see').onclick = (e) => { el('.q-passage-text').hidden = false; e.target.remove(); };
    if (passage && el('.q-fold')) {
      const fold = el('.q-fold');
      fold.onclick = () => { const t = el('.q-passage-text'); t.hidden = !t.hidden; fold.textContent = t.hidden ? '📖 Relire' : '🔼 Replier'; };
    }

    // Visuel
    function mountViz() {
      vizEl.innerHTML = '';
      vizEl.onclick = null;
      S.vizInner = null;
      if (!q.viz) return;
      const inner = document.createElement('div');
      vizEl.appendChild(inner);
      S.vizInner = inner;
      try { q.viz(inner); } catch (e) { console.error('viz', sk && sk.id, e); }
    }
    function runShowMe() {
      if (!q.showMe) return;
      try { return q.showMe(S.vizInner || vizEl); } catch (e) { console.error('showMe', sk && sk.id, e); }
    }
    mountViz();
    const tools = el('.q-tools');
    tools.innerHTML = (q.showMe ? '<button class="btn yellow q-show">👀 Montre-moi</button>' : '') + (q.viz ? '<button class="btn q-reset">↺ Effacer</button>' : '') + (q.hint ? '<button class="btn q-hint">💡 Indice</button>' : '');
    if (q.showMe) M.$('.q-show', tools).onclick = runShowMe;
    if (q.viz) M.$('.q-reset', tools).onclick = mountViz;
    if (q.hint) M.$('.q-hint', tools).onclick = () => feedback('hint', '💡 ' + q.hint);
    if (!tools.innerHTML) tools.remove();
    else if (!q.viz) el('.q-right').insertBefore(tools, el('.q-feedback')); // indice / montre-moi visibles même sans visuel

    function feedback(cls, html) {
      const f = el('.q-feedback');
      if (!f) return;
      f.className = 'q-feedback ' + cls;
      f.innerHTML = html ? `<div class="fb-in">${html}</div>` : '';
    }
    feedback('', fmt.instruction ? fmt.instruction(q) : 'Réponds 👇');

    function answerLabel() { return fmt.answerLabel ? fmt.answerLabel(q) : String(q.answer); }

    function complete(first, ok = true) {
      if (S.done) return;
      S.done = true;
      if (S.inst && S.inst.lock) S.inst.lock(); else M.$$('button, input, select', inputEl).forEach((b) => (b.disabled = true));
      if (passage && passage.listenOnly && el('.q-see')) el('.q-see').hidden = false;
      if (ungraded) {
        feedback('good', fmtName === 'reflect' ? 'Merci d\'en avoir parlé 💬' : 'Bien observé ! 👀');
        M.sfx.pop();
      } else if (ok) {
        const cheer = subj && subj.cheers ? M.pick(subj.cheers) : null;
        const msg = cheer ? cheer.text : M.pick(M.BRAVO);
        feedback('good', msg + (first ? ' ⭐' : ' 🎉'));
        M.sfx.good();
        M.confetti(first ? 50 : 20);
        M.say(msg, cheer ? { lang: cheer.lang, raw: true } : {});
        if (first && opts.record !== false) M.flyStar(el('.q-prompt'));
      } else {
        feedback('bad', `La bonne réponse : <b>${answerLabel()}</b>`);
        if (S.inst && S.inst.reveal) S.inst.reveal();
        runShowMe();
      }
      if (q.explain) el('.q-explain').innerHTML = `<div class="callout">🦫 ${q.explain}</div>`;
      if (opts.onNext) { const n = el('.q-next'); n.hidden = false; n.onclick = opts.onNext; }
      if (typeof q.onResult === 'function') { try { q.onResult({ first, ok, ungraded }); } catch (e) { console.error(e); } }
      if (opts.onResult) opts.onResult({ first, ok, ungraded });
    }

    const ctx = {
      q, host: inputEl, hasInline, setInline, passage: passageCtl,
      get done() { return S.done; },
      get tries() { return S.tries; },
      feedback,
      complete,
      /** Essai standard : 'correct' | 'retry' | 'failed' */
      attempt(ok, val) {
        if (S.done) return 'failed';
        if (ok) { complete(S.tries === 0, true); return 'correct'; }
        S.tries++;
        M.sfx.bad();
        const p = el('.q-prompt');
        p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
        if (S.tries >= maxTries) { complete(false, false); return 'failed'; }
        feedback('bad', (fmt.retryMessage && fmt.retryMessage(q, val)) || retryMsg(q, val));
        return 'retry';
      },
      onKey(fn) { S.keyFn = fn; },
    };
    try { S.inst = fmt.render(inputEl, q, ctx) || {}; } catch (e) { console.error('format', fmtName, e); inputEl.innerHTML = '<div class="callout warn">Oups, cette question a un problème.</div>'; }

    function keyHandler(e) {
      if (!host.isConnected) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName) && !(S.keyFn && S.keyFn.inputs)) {
        if (e.key === 'Enter' && S.done && opts.onNext) { e.preventDefault(); opts.onNext(); }
        return;
      }
      if (S.done) { if (e.key === 'Enter' && opts.onNext) { e.preventDefault(); opts.onNext(); } return; }
      if (S.keyFn) S.keyFn(e);
    }
    document.addEventListener('keydown', keyHandler);
    return { destroy() { document.removeEventListener('keydown', keyHandler); }, ctx };
  };

  /* =====================================================================
     Série de questions
     opts: { items:[skillId], back:'#/', regen?:() => items, title? }
     ===================================================================== */
  M.runSession = function (root, opts) {
    const items = opts.items.slice();
    const S = { i: 0, results: [], current: null };
    M.heard.clear();
    root.innerHTML = `
      <div class="session">
        <div class="s-top">
          <a class="btn ghost" href="${opts.back || '#/'}">← Retour</a>
          <div class="progress"><i></i></div>
          <b class="s-count"></b>
        </div>
        <div class="s-card"></div>
      </div>`;
    const el = (s) => M.$(s, root);
    M.onCleanup(() => S.current && S.current.destroy());

    function show() {
      if (S.current) S.current.destroy();
      const id = items[S.i], sk = M.skillById[id];
      const lvl = Math.min(2, M.progress.mastery(id));
      let q;
      try { q = sk.gen({ lvl }); } catch (e) { console.error('gen', id, e); q = { prompt: 'Oups, une erreur. Passe à la suivante.', format: 'choice', answer: 1, choices: [{ label: 'OK', value: 1 }] }; }
      el('.progress i').style.width = (S.i / items.length) * 100 + '%';
      el('.s-count').textContent = `${S.i + 1} / ${items.length}`;
      S.current = M.renderQuestion(el('.s-card'), q, {
        skill: sk,
        nextLabel: S.i === items.length - 1 ? 'Voir mes résultats 🏆' : 'Suivant ➜',
        onResult: ({ first, ungraded }) => {
          if (ungraded) { M.progress.participate(sk.id); return; }
          M.progress.record(sk.id, first);
          S.results.push({ id: sk.id, first });
        },
        onNext: next,
      });
    }
    function next() {
      if (S.i < items.length - 1) { S.i++; show(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else end();
    }
    function end() {
      if (S.current) S.current.destroy();
      const first = S.results.filter((r) => r.first).length, n = S.results.length;
      if (!n) { root.innerHTML = `<div class="card end"><div class="trophy">💬</div><h2>Merci !</h2><div class="row-center"><a class="btn big" href="${opts.back || '#/'}">Retour</a></div></div>`; return; }
      const bySkill = {};
      S.results.forEach((r) => { (bySkill[r.id] = bySkill[r.id] || { ok: 0, n: 0 }).n++; if (r.first) bySkill[r.id].ok++; });
      root.innerHTML = `<div class="card end">
        <div class="trophy">${first === n ? '🏆' : first >= n * 0.7 ? '🥇' : '🌱'}</div>
        <h2>${first === n ? 'PARFAIT ! 🎉' : first >= n * 0.7 ? 'Bravo, super travail !' : 'Beau travail, continue !'}</h2>
        <p class="lead">Tu as réussi <b>${first}</b> question${first > 1 ? 's' : ''} sur ${n} du premier coup.</p>
        <div class="end-stars">${'⭐'.repeat(first)}${'☆'.repeat(n - first)}</div>
        <div class="end-skills">${Object.entries(bySkill).map(([id, r]) => `<div class="end-skill"><span>${M.skillById[id].icon || ''} ${M.esc(M.skillById[id].title)}</span><span>${r.ok}/${r.n}</span>${M.starsHtml(M.progress.mastery(id))}</div>`).join('')}</div>
        <div class="row-center">
          <button class="btn primary big again">Encore ! 🔁</button>
          <a class="btn big" href="${opts.back || '#/'}">Retour</a>
        </div>
      </div>`;
      M.confetti();
      M.say(M.$('h2', root).textContent + ' ' + M.$('.lead', root).textContent);
      M.$('.again', root).onclick = () => M.runSession(root, { ...opts, items: opts.regen ? opts.regen() : M.shuffle(items) });
    }
    show();
  };
})();
