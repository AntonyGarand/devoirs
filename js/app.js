/* =====================================================================
   app.js — routeur et pages : accueil (matières), tableau de bord d'une
   matière, pratique, révision, Apprendre, parents, guide de style
   Routes : #/  #/matiere/<id>  #/pratique/<skill>  #/revision[/<matière>]
            #/apprendre[/<id>]  #/parents  #/style
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const app = M.$('#app');
  const SESSION_LEN = 8;

  function route() {
    M.cleanup();
    const hash = location.hash.replace(/^#\/?/, '');
    const [page, arg] = hash.split('/');
    M.$$('.topbar nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === (page || '')));
    window.scrollTo(0, 0);
    if (!page) return home();
    if (page === 'matiere' && M.subjectById[arg]) return subject(arg);
    if (page === 'pratique' && M.skillById[arg]) return practice(arg);
    if (page === 'revision') return review(M.subjectById[arg] ? arg : null);
    if (page === 'apprendre' && arg && M.learnById[arg]) return learn(arg);
    if (page === 'apprendre') return learnIndex();
    if (page === 'parents') return parents();
    if (page === 'style' && M.styleguide) return M.styleguide(app);
    if (page === 'test' && M.selfTest) { app.innerHTML = '<p class="card">🧪 Test en cours…</p>'; return M.selfTest(app); }
    home();
  }
  window.addEventListener('hashchange', route);

  const skillsOf = (subjectId) => M.skills.filter((s) => M.subjectOf(s) === subjectId);
  const pctOf = (skills) => (skills.length ? Math.round((skills.reduce((a, s) => a + M.progress.mastery(s.id), 0) / (skills.length * 3)) * 100) : 0);

  /* ---------- Accueil : les matières ---------- */
  function home() {
    const P = M.progress;
    const mastered = M.skills.filter((s) => P.mastery(s.id) >= 2).length;
    const subjects = M.SUBJECTS.slice().sort((a, b) => a.order - b.order);
    app.innerHTML = `
      <section class="hero">
        <div class="mascot">🦫</div>
        <div><h1>Allô ! Qu'est-ce qu'on fait aujourd'hui ?</h1>
          <p>Choisis une matière. Chaque bonne réponse du premier coup te donne une ⭐.</p></div>
        <div class="hero-stats">
          <div class="stat"><b>⭐ ${P.data().stars}</b><span>étoiles</span></div>
          <div class="stat"><b>🔥 ${P.streak()}</b><span>jour${P.streak() > 1 ? 's' : ''} de suite</span></div>
          <div class="stat"><b>${mastered}/${M.skills.length}</b><span>habiletés ★★</span></div>
        </div>
      </section>
      <div class="subjects">${subjects.map((s) => {
        const sk = skillsOf(s.id);
        const pct = pctOf(sk);
        return `<a class="subject-card ${sk.length ? '' : 'soon'}" style="--sc:${s.color}" href="#/matiere/${s.id}">
          <span class="ic">${s.icon}</span><h2>${s.title}</h2><p>${s.desc || ''}</p>
          <div class="top"><span class="muted" style="font-weight:800">${sk.length ? sk.length + ' habiletés' : 'Bientôt !'}</span>
          <div class="dbar" title="Maîtrise ${pct} %"><i style="width:${pct}%;background:${s.color}"></i></div></div></a>`;
      }).join('')}</div>
      <section class="card review-card">
        <div class="emoji">🔁</div>
        <div><h2>Révision du jour</h2><p>10 questions mélangées de toutes les matières, choisies parmi ce qui a besoin d'être revu.</p></div>
        <a class="btn primary big" href="#/revision">C'est parti ! 🚀</a>
      </section>`;
  }

  /* ---------- Tableau de bord d'une matière ---------- */
  function subject(id) {
    const subj = M.subjectById[id];
    const sk = skillsOf(id);
    let h = `<div class="learn-top"><a class="btn ghost" href="#/">← Accueil</a><h1>${subj.icon} ${subj.title}</h1></div>`;
    if (sk.length) {
      h += `<section class="card review-card">
        <div class="emoji">🔁</div>
        <div><h2>Révision — ${subj.title}</h2><p>10 questions mélangées, choisies parmi ce qui a besoin d'être revu.</p></div>
        <a class="btn primary big" href="#/revision/${id}">C'est parti ! 🚀</a></section>`;
    } else h += M.ui.callout('Cette matière arrive bientôt !', { tone: 'info' });
    M.DOMAINS.filter((d) => d.subject === id).forEach((d) => {
      const dsk = sk.filter((s) => s.domain === d.id).sort((a, b) => a.order - b.order);
      const learns = M.learns.filter((l) => l.domain === d.id).sort((a, b) => a.order - b.order);
      if (!dsk.length && !learns.length) return;
      const pct = pctOf(dsk);
      h += `<section class="domain">
        <div class="domain-head">
          <div class="dicon" style="background:${d.soft}">${d.icon}</div>
          <div><h2>${d.title}</h2><div class="pda">${d.pda || ''}</div></div>
          <div class="dbar" title="Maîtrise ${pct} %"><i style="width:${pct}%;background:${d.color}"></i></div>
        </div>
        ${learns.length ? `<div class="learn-strip">${learns.map((l) => `<a class="learn-chip" href="#/apprendre/${l.id}">📘 ${l.icon || ''} ${M.esc(l.title)}</a>`).join('')}</div>` : ''}
        <div class="skills">${dsk.map((s) => skillCard(s, d)).join('')}</div>
      </section>`;
    });
    app.innerHTML = h;
  }
  function skillCard(s, d) {
    const m = M.progress.mastery(s.id), acc = M.progress.acc(s.id);
    const st = M.skillStatus(s);
    return `<div class="skill-card m${m} ${st === true ? '' : 'off'}" style="border-top:6px solid ${d.color}">
      <div class="top"><span class="ic">${s.icon || d.icon}</span><h3>${M.esc(s.title)}</h3>${s.enrichment ? '<span class="tag enrich" title="Enrichissement : au-delà du programme de 2e année">🌟</span>' : ''}</div>
      <p>${s.desc || ''}</p>${st === true ? '' : `<div class="why-off">🔒 ${M.esc(st)}</div>`}
      <div class="top">${M.starsHtml(m)}<span class="muted" style="font-size:.85rem;font-weight:700;margin-left:auto">${acc == null ? 'Pas encore essayé' : Math.round(acc * 100) + ' % récemment'}</span></div>
      <div class="acts">
        ${st === true ? `<a class="btn primary" href="#/pratique/${s.id}">${s.ungraded ? '💬 Discuter' : '▶ Pratiquer'}</a>` : ''}
        ${s.learn && M.learnById[s.learn] ? `<a class="btn" href="#/apprendre/${s.learn}" title="Apprendre">📘</a>` : ''}
      </div>
    </div>`;
  }

  /* ---------- Pratique et révision ---------- */
  function practice(id) {
    const subj = M.subjectOf(M.skillById[id]);
    const st = M.skillStatus(M.skillById[id]);
    if (st !== true) { app.innerHTML = `<div class="learn-top"><a class="btn ghost" href="#/matiere/${subj}">← Retour</a></div>` + M.ui.callout('🔒 ' + M.esc(st), { tone: 'warn' }); return; }
    M.runSession(app, { items: Array(SESSION_LEN).fill(id), back: subj ? '#/matiere/' + subj : '#/' });
  }
  function review(subjectId) {
    const items = M.reviewItems(10, subjectId);
    if (!items.length) { app.innerHTML = M.ui.callout('Rien à réviser pour l\'instant !', { tone: 'info' }); return; }
    M.runSession(app, { items, back: subjectId ? '#/matiere/' + subjectId : '#/', regen: () => M.reviewItems(10, subjectId) });
  }

  /* ---------- Apprendre ---------- */
  function learnIndex() {
    let h = `<div class="learn-top"><h1>📘 Apprendre</h1></div>
      <p class="learn-intro">Des petites leçons à manipuler. Touche, écoute, essaie : c'est en jouant qu'on comprend !</p>`;
    M.SUBJECTS.slice().sort((a, b) => a.order - b.order).forEach((subj) => {
      const doms = M.DOMAINS.filter((d) => d.subject === subj.id);
      const ls = M.learns.filter((l) => doms.some((d) => d.id === l.domain));
      if (!ls.length) return;
      h += `<h2 style="margin-top:26px">${subj.icon} ${subj.title}</h2>`;
      doms.forEach((d) => {
        const dl = ls.filter((l) => l.domain === d.id).sort((a, b) => a.order - b.order);
        if (!dl.length) return;
        h += `<section class="domain"><div class="domain-head"><div class="dicon" style="background:${d.soft}">${d.icon}</div><h2>${d.title}</h2></div>
          <div class="learn-index">${dl.map((l) => `<a class="learn-card" href="#/apprendre/${l.id}"><span class="ic">${l.icon || '📘'}</span><span><b>${M.esc(l.title)}</b><small>${l.short || ''}</small></span></a>`).join('')}</div></section>`;
      });
    });
    app.innerHTML = h;
  }
  function learn(id) {
    const l = M.learnById[id];
    const d = M.domainById[l.domain] || {};
    const related = M.skills.filter((s) => s.learn === id);
    app.innerHTML = `
      <div class="learn-top">
        <a class="btn ghost" href="${d.subject ? '#/matiere/' + d.subject : '#/apprendre'}">← Retour</a>
        <h1>${l.icon || ''} ${M.esc(l.title)}</h1>
        <button class="btn icon" id="readIntro" title="Écouter">🔊</button>
      </div>
      <p class="learn-intro">${l.intro || ''}</p>
      <div id="learnBody"></div>
      ${related.length ? `<section class="l-sec" style="border-top:6px solid ${d.color}"><h2>🎯 Je pratique</h2><div class="l-practice">${related.map((s) => `<a class="btn primary" href="#/pratique/${s.id}">${s.icon || ''} ${M.esc(s.title)} ${M.starsHtml(M.progress.mastery(s.id))}</a>`).join('')}</div></section>` : ''}`;
    M.$('#readIntro').onclick = () => M.say(M.text(l.intro || l.title));
    try { l.render(M.$('#learnBody')); } catch (e) { console.error('learn', id, e); M.$('#learnBody').innerHTML = M.ui.callout('Oups, cette leçon a un problème.', { tone: 'warn' }); }
  }

  /* ---------- Parents ---------- */
  function parents() {
    const rows = M.SUBJECTS.map((subj) => M.DOMAINS.filter((d) => d.subject === subj.id).map((d) => {
      const sk = M.skills.filter((s) => s.domain === d.id).sort((a, b) => a.order - b.order);
      return sk.map((s, i) => `<tr>${i === 0 ? `<td rowspan="${sk.length}"><b>${subj.icon} ${d.icon} ${d.title}</b></td>` : ''}<td>${s.icon || ''} ${M.esc(s.title)}${s.enrichment ? ' 🌟' : ''}</td><td>${s.pda || ''}</td><td>${M.starsHtml(M.progress.mastery(s.id))}</td></tr>`).join('');
    }).join('')).join('');
    const notes = [...M.DOMAINS, ...M.skills, ...M.learns].filter((x) => x.parentNote).map((x) => `<li><b>${x.icon || ''} ${M.esc(x.title)}</b> — ${x.parentNote}</li>`).join('');
    const part = M.progress.data().participation || {};
    const participation = Object.entries(part).filter(([id]) => M.skillById[id]).map(([id, n]) => `<li>${M.esc(M.skillById[id].title)} : ${n}</li>`).join('');
    app.innerHTML = `<div class="card doc">
      <h1>👪 Guide pour les parents</h1>
      <p>Ce site couvre les apprentissages de la <b>2<sup>e</sup> année du primaire</b> au Québec, selon le Programme de formation de l'école québécoise (PFEQ) et ses
      <a href="https://www.quebec.ca/education/prescolaire-primaire-et-secondaire/progression-apprentissages" target="_blank" rel="noopener">Progressions des apprentissages</a>.
      La 2<sup>e</sup> année termine le 1<sup>er</sup> cycle : à la fin de l'année, l'enfant devrait faire seul ce qui a été construit avec l'enseignant·e en 1<sup>re</sup> et 2<sup>e</sup> année.</p>

      <h2>Les compétences visées</h2>
      <ul>
        <li><b>Résoudre et raisonner</b> : comprendre un problème, choisir une démarche, valider. → domaine 🧩 <i>Comprendre et résoudre</i>, boutons 👀 <i>Montre-moi</i>.</li>
        <li><b>Lire et comprendre</b> : textes courts avec questions, en français et en mathématique.</li>
        <li><b>Communiquer</b> : employer les bons mots (somme, dizaine, verbe, déterminant…). → pages 📘 <i>Apprendre</i>.</li>
      </ul>

      <h2>Comment on apprend ici (et pourquoi)</h2>
      <ul>
        <li><b>Concret → imagé → abstrait.</b> Chaque question offre un visuel à manipuler avant d'écrire la réponse.</li>
        <li><b>Des stratégies, pas seulement du par cœur</b> : doubles, faire 10, familles de mots, sons…</li>
        <li><b>Rétroaction immédiate</b> : un indice après une erreur, puis une démonstration. Jamais de punition, pas de minuterie.</li>
        <li><b>Pratique de récupération, révision espacée et entrelacée</b> : la <i>Révision du jour</i> mélange les habiletés à revoir.</li>
        <li><b>Courtes séances</b> : 10 à 15 minutes par jour. La série 🔥 encourage la régularité.</li>
        <li><b>Parler de ce qu'on apprend</b> : demandez « Comment as-tu trouvé ? ».</li>
      </ul>

      <h2>Les étoiles de maîtrise</h2>
      <p>Calculées sur les 10 dernières réponses du premier coup : ★ = 50 % et plus (au moins 3 essais), ★★ = 75 % (au moins 6), ★★★ = 90 % (au moins 10). Les questions deviennent un peu plus difficiles à mesure que la maîtrise augmente.</p>

      <h2>Correspondance avec le programme</h2>
      <table><thead><tr><th>Domaine</th><th>Habileté</th><th>Référence au programme</th><th>Maîtrise</th></tr></thead><tbody>${rows}</tbody></table>

      ${notes ? `<h2>Notes aux parents</h2><ul>${notes}</ul>` : ''}
      ${participation ? `<h2>Cartes de discussion</h2><p>Nombre de fois où une carte de réflexion a été faite (aucune réponse n'est enregistrée) :</p><ul>${participation}</ul>` : ''}

      <h2>Voix de lecture</h2>
      <div id="voiceDiag" class="row"></div>
      <p class="muted">Sans voix française, la lecture à voix haute et les dictées ne fonctionnent pas; sans voix anglaise, les activités d'écoute en anglais sont verrouillées.
      Windows : Paramètres → Heure et langue → Voix. Android : Paramètres → Synthèse vocale (Google). iPad/iPhone : Réglages → Accessibilité → Contenu énoncé → Voix.</p>

      <h2>Réglages</h2>
      <div class="row">
        <button class="btn" id="toggleSound">${M.sfx.on ? '🔊 Sons activés' : '🔇 Sons désactivés'}</button>
        <button class="btn" id="toggleRead">${M.settings.get('autoRead') ? '🗣️ Lecture automatique : oui' : '🗣️ Lecture automatique : non'}</button>
        <button class="btn" id="resetProg">🗑️ Effacer la progression</button>
        <a class="btn" href="#/style">🎨 Guide de style</a>
      </div>
      <p class="muted">La lecture automatique lit chaque consigne à voix haute (utile pour un lecteur débutant). La progression est enregistrée seulement dans ce navigateur, sur cet appareil.</p>
      <div id="parentTools"></div>
    </div>`;
    M.$('#toggleSound').onclick = (e) => { M.settings.set('sound', !M.sfx.on); e.target.textContent = M.sfx.on ? '🔊 Sons activés' : '🔇 Sons désactivés'; };
    M.$('#toggleRead').onclick = (e) => { M.settings.set('autoRead', !M.settings.get('autoRead')); e.target.textContent = M.settings.get('autoRead') ? '🗣️ Lecture automatique : oui' : '🗣️ Lecture automatique : non'; };
    M.voices.ready().then(() => {
      const box = M.$('#voiceDiag');
      if (!box) return;
      box.innerHTML = [['fr-CA', 'Français', 'Bonjour ! Je suis la voix française.'], ['en-CA', 'Anglais', 'Hello! I am the English voice.']].map(([l, name, test]) => {
        const st = M.voices.status(l);
        const icon = st.state === 'exact' ? '✅' : st.state === 'fallback' ? '🟡' : '❌';
        return `<span class="chip">${icon} ${name} : ${st.name ? M.esc(st.name) : 'aucune voix'}</span><button class="btn" data-say="${test}" data-lang="${l}">▶ Tester</button>`;
      }).join('');
    });
    const toolsEl = M.$('#parentTools');
    M.parentTools.forEach((t) => {
      const sec = document.createElement('section');
      sec.innerHTML = `<h2>${t.icon || '🧰'} ${M.esc(t.title)}</h2><div></div>`;
      toolsEl.appendChild(sec);
      try { t.render(sec.lastElementChild); } catch (e) { console.error('outil parent', t.id, e); }
    });
    M.$('#resetProg').onclick = () => { if (confirm('Effacer toutes les étoiles et la progression ?')) { M.progress.reset(); parents(); } };
  }

  M.updateStars();
  route();
})();
