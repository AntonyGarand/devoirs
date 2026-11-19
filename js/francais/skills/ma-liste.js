/* =====================================================================
   skills/ma-liste.js — « Ma liste de la semaine » (fr-ma-liste)
   Le parent tape la liste de mots rapportée de l'école (page Parents);
   l'enfant la pratique (habileté verrouillée tant qu'aucune liste n'existe).
   Stockage : M.userData('francais', 'listes') =
     { v: 1, active: id, listes: [{ id, titre, creee, archivee, mots: [{ t, det?, phrase?, nomPropre? }] }] }
   Progression par mot : M.progress.item('fr-ma-liste', '<id liste>:<mot>').
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const FR = M.FR;
  const NS = 'francais', KEY = 'listes', SK = 'fr-ma-liste';
  const DETS = ['un', 'une', 'le', 'la', 'l\'', 'les', 'des'];
  const PRONS = ['je', 'j\'', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'];

  /* ---------------- Données ---------------- */
  const DEMO = {
    v: 1, active: 'demo',
    listes: [{
      id: 'demo', titre: 'Semaine d\'essai', creee: '2026-11-16', archivee: false,
      mots: [
        { t: 'tuque', det: 'une', phrase: 'Je mets ma tuque pour aller dehors.' },
        { t: 'mitaine', det: 'une' }, { t: 'flocon', det: 'un', phrase: 'Un flocon tombe sur mon nez.' },
        { t: 'vert', phrase: 'Mon chandail est vert.' }, { t: 'froid' }, { t: 'chapeau', det: 'un' },
        { t: 'Gaspé', nomPropre: true, phrase: 'Ma grand-mère habite à Gaspé.' }, { t: 'je suis', phrase: 'Je suis en deuxième année.' },
        { t: 'hiver', det: 'l\'' }, { t: 'glisser' },
      ],
    }],
  };
  M.userData.fixture(NS, KEY, DEMO);
  const store = () => { const d = M.userData.get(NS, KEY, null); return d && d.v === 1 ? d : { v: 1, active: null, listes: [] }; };
  const save = (d) => M.userData.set(NS, KEY, d);
  FR.listeActive = () => { const d = store(); return d.listes.find((l) => l.id === d.active && !l.archivee && l.mots.length) || null; };

  /** Analyse une ligne saisie par le parent → { t, det?, phrase?, nomPropre? } ou { err }. */
  FR.parseLigne = (line) => {
    let [w, phrase] = String(line).split('|');
    w = (w || '').normalize('NFC').replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
    phrase = (phrase || '').normalize('NFC').replace(/[’`]/g, '\'').replace(/\s+/g, ' ').trim();
    if (!w) return null;
    if (w.length > 40) return { err: 'trop long (40 caractères au plus)', t: w };
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿŒœÆæ' -]+$/.test(w)) return { err: 'seulement des lettres, espace, apostrophe ou trait d\'union', t: w };
    const o = {};
    const m = /^(un|une|le|la|les|des) (.+)$/i.exec(w) || /^(l') ?(.+)$/i.exec(w);
    if (m && !PRONS.includes(m[1].toLowerCase())) { o.det = m[1].toLowerCase(); w = m[2]; }
    o.t = w;
    if (/^[A-ZÀ-Ö]/.test(w) && !/\s/.test(w)) o.nomPropre = true;
    if (phrase) o.phrase = /[.!?]$/.test(phrase) ? phrase : phrase + '.';
    return o;
  };
  FR.parseListe = (text) => {
    const out = [], errs = [], seen = new Set();
    String(text).split(/\n/).forEach((line, i) => {
      const o = FR.parseLigne(line);
      if (!o) return;
      if (o.err) { errs.push(`Ligne ${i + 1} (${M.esc(o.t)}) : ${o.err}`); return; }
      const k = FR.norm(o.t);
      if (seen.has(k)) return;
      seen.add(k); out.push(o);
    });
    if (out.length > 30) errs.push('30 mots au plus par liste.');
    return { mots: out.slice(0, 30), errs };
  };
  const flags = (o) => {
    const f = [];
    const known = FR.mot(o.t);
    if (FR.isHomophone(o.t) && !phraseOf(o)) f.push('⚠️ <b>homophone</b> (' + FR.homophonesOf(o.t).slice(0, 3).map(M.esc).join(', ') + ') : ajoutez une phrase pour que votre enfant sache quel mot écrire.');
    if (!known && !o.nomPropre && !/\s/.test(o.t)) f.push('ℹ️ mot hors de notre banque : écoutez la prononciation avec 🔊.');
    if (o.nomPropre) f.push('ℹ️ nom propre : la majuscule sera exigée. Écoutez la prononciation.');
    if (/\s/.test(o.t) && PRONS.includes(o.t.split(' ')[0].toLowerCase())) f.push('ℹ️ forme conjuguée : dictée du groupe de mots, clavier complet.');
    return f;
  };
  const motLabel = (o) => (o.det ? (o.det === 'l\'' ? 'l\'' : o.det + ' ') : '') + o.t;
  const keyOf = (l, o) => l.id + ':' + o.t;
  /** Phrase de dictée : celle du parent, sinon celle de la banque, sinon aucune. */
  const phraseOf = (o) => o.phrase || (FR.mot(o.t) && FR.mot(o.t).phrase) || null;

  /* ---------------- Habileté ---------------- */
  M.registerSkill({
    id: SK, domain: 'fr-orthographe', title: 'Ma liste de la semaine', icon: '📝', learn: 'fr-ma-liste-etude',
    desc: 'Pratique les mots que ton enseignante t\'a donnés cette semaine.',
    pda: 'Orthographe d\'usage A.1 — mots à l\'étude (pistes : mémoriser des mots)',
    needs: ['speech:fr'],
    available: () => (FR.listeActive() ? true : 'Demande à un adulte d\'ajouter ta liste de mots (page Parents).'),
    parentNote: 'Tapez la liste de mots de la semaine dans la section « 📝 Ma liste de mots de la semaine » ci-dessous. Les mots les plus souvent ratés reviennent plus souvent.',
    gen({ lvl }) {
      const l = FR.listeActive() || DEMO.listes[0];
      const o = FR.pickMot(SK, l.mots, (x) => keyOf(l, x));
      const ph = phraseOf(o);
      const cs = o.nomPropre ? 'first' : undefined;
      const known = FR.mot(o.t);
      const tip = known ? FR.motTip(known) : '';
      if (lvl === 0 && !/[\s'-]/.test(o.t)) {
        const bad = FR.fautes(o.t, 2);
        if (bad.length === 2 && Math.random() < 0.6) {
          return {
            prompt: 'Écoute. Touche le mot <b>bien écrit</b>.', audio: { seq: ph ? [o.t, ph] : [o.t, o.t], pause: 700, autoplay: 'once' },
            format: 'choice', answer: o.t, cols: 3,
            choices: M.shuffle([o.t, ...bad]).map((x) => ({ label: `<span style="font-size:1.5rem">${M.esc(x)}</span>`, value: x })),
            hint: 'C\'est un mot de ta liste. Comment l\'as-tu étudié ?',
            explain: `On écrit <b>${M.esc(o.t)}</b>. ${tip}`,
          };
        }
        if (o.t.length <= 9) {
          const { tiles, answer } = FR.letterTiles(o.t, 2);
          return {
            prompt: 'Écoute, puis construis le mot avec les lettres.', audio: { seq: ph ? [o.t, ph, o.t] : [o.t, o.t], pause: 900, autoplay: 'once' },
            format: 'build', join: '', tiles, answer,
            hint: 'Dis le mot lentement, un son à la fois.',
            explain: `On écrit <b>${M.esc(o.t)}</b>. ${tip}`,
          };
        }
      }
      if (lvl === 2) {
        // forme fléchie connue, sinon phrase à trou à taper
        if (known && known.pl && Math.random() < 0.5) {
          return FR.dictee(known.pl, { phrase: `Un ${o.t}, des ${known.pl}.`, prompt: 'Écoute et écris le mot <b>au pluriel</b>.', explain: `<b>${o.t}</b> → <b>${known.pl}</b>.` });
        }
        if (ph && new RegExp('(^|[\\s\'])' + o.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[\\s.,!?])', 'i').test(ph)) {
          const holed = ph.replace(new RegExp('(^|[\\s\'])' + o.t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[\\s.,!?])', 'i'), '$1____');
          const q = FR.dictee(o.t, { phrase: ph, caseSensitive: cs, prompt: `Écoute. Écris le mot qui manque :<div class="fr-big" style="font-size:1.4rem">${M.esc(holed)}</div>`, explain: `<b>${M.esc(ph)}</b>` });
          return q;
        }
      }
      return FR.dictee(o.t, { phrase: ph, caseSensitive: cs, prefix: o.det && !o.nomPropre ? (o.det === 'l\'' ? 'l\'' : o.det) : undefined, hint: tip || 'Pense à ce que tu as étudié : regarde, dis, cache, écris, vérifie.', explain: `On écrit <b>${M.esc(motLabel(o))}</b>. ${tip}` });
    },
    check(q) {
      const l = FR.listeActive() || DEMO.listes[0];
      const w = q.format === 'text' ? q.answer : q.format === 'build' ? q.answer.join('') : q.answer;
      if (!l.mots.some((o) => o.t === w || (FR.mot(o.t) && FR.mot(o.t).pl === w))) return 'mot absent de la liste : ' + w;
      if (q.format === 'choice' && q.choices.some((c) => c.value !== q.answer && FR.isReal(c.value))) return 'distracteur = vrai mot';
      if (q.audio && q.audio.seq && q.audio.seq[0] !== w) return 'audio ≠ mot';
    },
  });

  /* ---------------- Outil parent ---------------- */
  try { M.css(`
  .fr-lt textarea { width: 100%; min-height: 180px; font: inherit; font-size: 1.05rem; padding: 10px; border: 3px solid var(--line, #e7e1d3); border-radius: 14px; box-sizing: border-box }
  .fr-lt input[type=text] { font: inherit; font-size: 1.05rem; padding: 8px 10px; border: 3px solid var(--line, #e7e1d3); border-radius: 12px; width: 100%; max-width: 360px; box-sizing: border-box }
  .fr-lt table { width: 100%; border-collapse: collapse; margin: 8px 0 }
  .fr-lt td, .fr-lt th { padding: 6px 8px; border-bottom: 2px solid #eee8da; text-align: left; vertical-align: top }
  .fr-lt .fl { font-size: .9rem }
  .fr-lt .rv { background: #ffe1e8; color: #b0123d; border-radius: 999px; padding: 1px 8px; font-weight: 800; font-size: .85rem; white-space: nowrap }
  .fr-lt .row { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 }
  `); } catch (e) {}
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const defaultTitle = () => { const d = new Date(); const day = d.getDay() || 7; d.setDate(d.getDate() - day + 1); return `Semaine du ${d.getDate()} ${['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][d.getMonth()]}`; };
  const toText = (l) => l.mots.map((o) => motLabel(o) + (o.phrase ? ' | ' + o.phrase : '')).join('\n');
  const bilan = (l) => `<table><tr><th>Mot</th><th>Du premier coup</th><th></th></tr>${l.mots.map((o) => {
    const st = M.progress.item(SK, keyOf(l, o)).stats();
    const d = M.progress.data().items || {};
    const h = ((d[SK + '|' + keyOf(l, o)] || {}).h || []).slice(-5);
    const revoir = h.length && h.filter((x) => !x).length >= 2;
    return `<tr><td><b>${M.esc(motLabel(o))}</b> ${M.ui.speak(o.t)}</td><td>${st.n ? `${Math.round(st.acc * 100)} % (${st.n} essai${st.n > 1 ? 's' : ''})` : '<span class="muted">pas encore pratiqué</span>'}</td><td>${revoir ? '<span class="rv">à revoir</span>' : ''}</td></tr>`;
  }).join('')}</table>`;

  M.registerParentTool({
    id: 'fr-ma-liste', subject: 'francais', title: 'Ma liste de mots de la semaine (Français)', icon: '📝',
    render(el) {
      el.classList.add('fr-lt');
      let draft = null; // { titre, text, editing }
      const draw = () => {
        const d = store();
        const act = d.listes.find((l) => l.id === d.active && !l.archivee);
        const old = d.listes.filter((l) => l !== act);
        if (draft) {
          el.innerHTML = `<p>Un mot par ligne. Facultatif : une phrase après une barre verticale, p. ex. <code>vert | Mon chandail est vert.</code> Le déterminant peut précéder le nom (<code>une fleur</code>).</p>
            <p><label>Titre : <input type="text" class="t" value="${M.esc(draft.titre)}"></label></p>
            <textarea class="x" spellcheck="false" placeholder="une tuque&#10;vert | Mon chandail est vert.&#10;je suis">${M.esc(draft.text)}</textarea>
            <div class="row"><button class="btn blue chk">🔎 Vérifier la liste</button><button class="btn ghost cancel">Annuler</button></div><div class="prev"></div>`;
          const T = M.$('.t', el), X = M.$('.x', el);
          M.$('.cancel', el).onclick = () => { draft = null; draw(); };
          M.$('.chk', el).onclick = () => {
            draft.titre = T.value.trim() || defaultTitle(); draft.text = X.value;
            const { mots, errs } = FR.parseListe(X.value);
            const prev = M.$('.prev', el);
            if (!mots.length) { prev.innerHTML = M.ui.callout('Ajoutez au moins un mot.', { tone: 'warn', who: '' }); return; }
            prev.innerHTML = (errs.length ? M.ui.callout(errs.join('<br>'), { tone: 'warn', who: '' }) : '')
              + `<table><tr><th>Mot</th><th>Phrase de dictée</th><th>Remarques</th></tr>${mots.map((o) => `<tr><td><b>${M.esc(motLabel(o))}</b> ${M.ui.speak(o.t)} ${FR.mot(o.t) && FR.mot(o.t).em ? FR.mot(o.t).em : ''}</td><td>${phraseOf(o) ? M.esc(phraseOf(o)) + ' ' + M.ui.speak(phraseOf(o)) : '<span class="muted">—</span>'}</td><td class="fl">${flags(o).join('<br>')}</td></tr>`).join('')}</table>
              <div class="row"><button class="btn primary save">✔ Enregistrer et activer (${mots.length} mot${mots.length > 1 ? 's' : ''})</button></div>`;
            M.$('.save', prev).onclick = () => {
              const dd = store();
              if (draft.editing) {
                const l = dd.listes.find((x) => x.id === draft.editing);
                if (l) { l.titre = draft.titre; l.mots = mots; }
              } else {
                dd.listes.forEach((l) => { if (l.id === dd.active) l.archivee = true; });
                const id = 'l' + Date.now().toString(36);
                dd.listes.unshift({ id, titre: draft.titre, creee: today(), archivee: false, mots });
                dd.active = id;
                // garder 10 listes (les plus anciennes archivées sont retirées)
                while (dd.listes.length > 10) { const k = dd.listes.map((l) => l.archivee).lastIndexOf(true); if (k < 0) break; dd.listes.splice(k, 1); }
              }
              save(dd); draft = null; draw();
            };
          };
          return;
        }
        el.innerHTML = `<p>Au 1<sup>er</sup> cycle, votre enfant rapporte souvent une liste de mots à étudier. Tapez-la ici une fois : elle devient l'activité <b>📝 Ma liste de la semaine</b> (domaine ✏️ <i>J'écris les mots</i>) et la page <a href="#/apprendre/fr-ma-liste-etude">📘 Étudier ma liste</a>. Les listes restent sur cet appareil seulement; « Effacer la progression » ne les efface pas.</p>
          ${act ? `<h3>✅ Liste active : ${M.esc(act.titre)} <small class="muted">(${act.mots.length} mots, créée le ${act.creee})</small></h3>${bilan(act)}
            <div class="row"><button class="btn edit">✏️ Modifier</button><button class="btn arch">📦 Archiver</button><button class="btn del">🗑️ Supprimer</button><button class="btn copy">📋 Copier la liste</button></div>` : M.ui.callout('Aucune liste active pour l\'instant.', { tone: 'info', who: '' })}
          <div class="row"><button class="btn primary new">➕ Nouvelle liste</button><button class="btn paste">📥 Coller une liste</button></div>
          ${old.length ? `<h3>Listes archivées</h3><ul>${old.map((l) => `<li>${M.esc(l.titre)} <small class="muted">(${l.mots.length} mots, ${l.creee})</small> <button class="btn react" data-id="${l.id}">↩️ Réactiver</button> <button class="btn rm" data-id="${l.id}">🗑️</button></li>`).join('')}</ul>` : ''}
          ${d.listes.length ? '<div class="row"><button class="btn wipe">🧹 Effacer mes listes</button></div>' : ''}
          <div class="out"></div>`;
        const on = (sel, fn) => { const b = M.$(sel, el); if (b) b.onclick = fn; };
        on('.new', () => { draft = { titre: defaultTitle(), text: '' }; draw(); });
        on('.paste', () => { draft = { titre: defaultTitle(), text: '' }; draw(); M.$('.x', el).focus(); });
        on('.edit', () => { draft = { titre: act.titre, text: toText(act), editing: act.id }; draw(); });
        on('.arch', () => { const dd = store(); dd.listes.forEach((l) => { if (l.id === dd.active) l.archivee = true; }); dd.active = null; save(dd); draw(); });
        on('.del', () => { if (!confirm('Supprimer cette liste ?')) return; const dd = store(); dd.listes = dd.listes.filter((l) => l.id !== dd.active); dd.active = null; save(dd); draw(); });
        on('.copy', () => {
          const txt = toText(act);
          M.$('.out', el).innerHTML = `<p>Texte de la liste (à copier pour un autre appareil) :</p><textarea readonly>${M.esc(txt)}</textarea>`;
          try { navigator.clipboard.writeText(txt); } catch (e) {}
        });
        on('.wipe', () => { if (confirm('Effacer toutes les listes de mots ?')) { M.userData.remove(NS, KEY); draw(); } });
        M.$$('.react', el).forEach((b) => (b.onclick = () => { const dd = store(); dd.listes.forEach((l) => { if (l.id === dd.active) l.archivee = true; }); const l = dd.listes.find((x) => x.id === b.dataset.id); l.archivee = false; dd.active = l.id; save(dd); draw(); }));
        M.$$('.rm', el).forEach((b) => (b.onclick = () => { const dd = store(); dd.listes = dd.listes.filter((x) => x.id !== b.dataset.id); save(dd); draw(); }));
      };
      draw();
    },
  });
})();
