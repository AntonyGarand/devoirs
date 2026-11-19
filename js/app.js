/* =====================================================================
   app.js — routeur, tableau de bord, pages Apprendre, révision, parents
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
    if (!page) return dashboard();
    if (page === 'pratique' && M.skillById[arg]) return practice(arg);
    if (page === 'revision') return review();
    if (page === 'apprendre' && arg && M.learnById[arg]) return learn(arg);
    if (page === 'apprendre') return learnIndex();
    if (page === 'parents') return parents();
    dashboard();
  }
  window.addEventListener('hashchange', route);

  /* ---------- Tableau de bord ---------- */
  function dashboard() {
    const P = M.progress;
    const total = M.skills.length;
    const mastered = M.skills.filter((s) => P.mastery(s.id) >= 2).length;
    const started = M.skills.filter((s) => P.data().skills[s.id]).length;
    let h = `
      <section class="hero">
        <div class="mascot">🦫</div>
        <div><h1>Allô ! On fait des maths ?</h1>
          <p>Choisis une habileté à pratiquer ou va <b>apprendre</b> une notion. Chaque bonne réponse du premier coup te donne une ⭐.</p></div>
        <div class="hero-stats">
          <div class="stat"><b>⭐ ${P.data().stars}</b><span>étoiles</span></div>
          <div class="stat"><b>🔥 ${P.streak()}</b><span>jour${P.streak() > 1 ? 's' : ''} de suite</span></div>
          <div class="stat"><b>${mastered}/${total}</b><span>habiletés ★★</span></div>
        </div>
      </section>
      <section class="card review-card">
        <div class="emoji">🔁</div>
        <div><h2>Révision du jour</h2><p>${started < 3 ? 'Un petit mélange pour commencer.' : '10 questions mélangées, choisies parmi ce qui a besoin d\'être revu.'}</p></div>
        <a class="btn primary big" href="#/revision">C'est parti ! 🚀</a>
      </section>`;
    M.DOMAINS.forEach((d) => {
      const sk = M.skills.filter((s) => s.domain === d.id).sort((a, b) => a.order - b.order);
      if (!sk.length) return;
      const pct = Math.round((sk.reduce((a, s) => a + P.mastery(s.id), 0) / (sk.length * 3)) * 100);
      const learns = M.learns.filter((l) => l.domain === d.id).sort((a, b) => a.order - b.order);
      h += `<section class="domain">
        <div class="domain-head">
          <div class="dicon" style="background:${d.soft}">${d.icon}</div>
          <div><h2>${d.title}</h2><div class="pda">${d.pda}</div></div>
          <div class="dbar" title="Maîtrise ${pct} %"><i style="width:${pct}%;background:${d.color}"></i></div>
        </div>
        ${learns.length ? `<div class="learn-strip">${learns.map((l) => `<a class="learn-chip" href="#/apprendre/${l.id}">📘 ${l.icon || ''} ${M.esc(l.title)}</a>`).join('')}</div>` : ''}
        <div class="skills">${sk.map((s) => skillCard(s, d)).join('')}</div>
      </section>`;
    });
    if (!M.skills.length) h += '<p class="card">Aucune habileté chargée.</p>';
    app.innerHTML = h;
  }
  function skillCard(s, d) {
    const m = M.progress.mastery(s.id), acc = M.progress.acc(s.id);
    return `<div class="skill-card m${m}" style="border-top:6px solid ${d.color}">
      <div class="top"><span class="ic">${s.icon || d.icon}</span><h3>${M.esc(s.title)}</h3></div>
      <p>${s.desc || ''}</p>
      <div class="top">${M.starsHtml(m)}<span class="muted" style="font-size:.85rem;font-weight:700;margin-left:auto">${acc == null ? 'Pas encore essayé' : Math.round(acc * 100) + ' % récemment'}</span></div>
      <div class="acts">
        <a class="btn primary" href="#/pratique/${s.id}">▶ Pratiquer</a>
        ${s.learn && M.learnById[s.learn] ? `<a class="btn" href="#/apprendre/${s.learn}">📘</a>` : ''}
      </div>
    </div>`;
  }

  /* ---------- Pratique ---------- */
  function practice(id) {
    const items = Array(SESSION_LEN).fill(id);
    M.runSession(app, { items, back: '#/' });
  }
  function review() {
    M.runSession(app, { items: M.reviewItems(10), back: '#/', regen: () => M.reviewItems(10) });
  }

  /* ---------- Apprendre ---------- */
  function learnIndex() {
    let h = `<div class="learn-top"><h1>📘 Apprendre</h1></div>
      <p class="learn-intro">Des petites leçons à manipuler. Touche, glisse, essaie : c'est en jouant avec les nombres et les formes qu'on comprend !</p>`;
    M.DOMAINS.forEach((d) => {
      const ls = M.learns.filter((l) => l.domain === d.id).sort((a, b) => a.order - b.order);
      if (!ls.length) return;
      h += `<section class="domain"><div class="domain-head"><div class="dicon" style="background:${d.soft}">${d.icon}</div><h2>${d.title}</h2></div>
        <div class="learn-index">${ls.map((l) => `<a class="learn-card" href="#/apprendre/${l.id}"><span class="ic">${l.icon || '📘'}</span><span><b>${M.esc(l.title)}</b><small>${l.short || ''}</small></span></a>`).join('')}</div></section>`;
    });
    app.innerHTML = h;
  }
  function learn(id) {
    const l = M.learnById[id];
    const d = M.DOMAINS.find((x) => x.id === l.domain) || {};
    const related = M.skills.filter((s) => s.learn === id);
    app.innerHTML = `
      <div class="learn-top">
        <a class="btn ghost" href="#/apprendre">← Apprendre</a>
        <h1>${l.icon || ''} ${M.esc(l.title)}</h1>
        <button class="btn icon" id="readIntro" title="Écouter">🔊</button>
      </div>
      <p class="learn-intro">${l.intro || ''}</p>
      <div id="learnBody"></div>
      ${related.length ? `<section class="l-sec" style="border-top:6px solid ${d.color}"><h2>🎯 Je pratique</h2><div class="l-practice">${related.map((s) => `<a class="btn primary" href="#/pratique/${s.id}">${s.icon || ''} ${M.esc(s.title)} ${M.starsHtml(M.progress.mastery(s.id))}</a>`).join('')}</div></section>` : ''}`;
    M.$('#readIntro').onclick = () => M.say(M.text(l.intro || l.title));
    try { l.render(M.$('#learnBody')); } catch (e) { console.error('learn', id, e); M.$('#learnBody').innerHTML = '<p class="card">Oups, cette leçon a un problème.</p>'; }
  }

  /* ---------- Parents ---------- */
  function parents() {
    const rows = M.DOMAINS.map((d) => {
      const sk = M.skills.filter((s) => s.domain === d.id).sort((a, b) => a.order - b.order);
      return sk.map((s, i) => `<tr>${i === 0 ? `<td rowspan="${sk.length}"><b>${d.icon} ${d.title}</b></td>` : ''}<td>${s.icon || ''} ${M.esc(s.title)}</td><td>${s.pda || ''}</td><td>${M.starsHtml(M.progress.mastery(s.id))}</td></tr>`).join('');
    }).join('');
    app.innerHTML = `<div class="card doc">
      <h1>👪 Guide pour les parents</h1>
      <p>Ce site couvre les apprentissages de mathématique de la <b>2<sup>e</sup> année du primaire</b> au Québec, tels que décrits dans la
      <a href="https://cdn-contenu.quebec.ca/cdn-contenu/education/pfeq/primaire/progressions-apprentissages/PFEQ-progression-apprentissages-mathematique-primaire.pdf" target="_blank" rel="noopener">Progression des apprentissages (PDA) en mathématique</a>
      du Programme de formation de l'école québécoise (PFEQ). La 2<sup>e</sup> année termine le 1<sup>er</sup> cycle : à la fin de l'année, l'enfant devrait faire seul ce qui a été construit avec l'enseignant·e en 1<sup>re</sup> et 2<sup>e</sup> année.</p>

      <h2>Les 3 compétences du PFEQ</h2>
      <ul>
        <li><b>C1 — Résoudre une situation-problème</b> : comprendre, choisir une démarche, valider. → sections « Problèmes » et questions à terme manquant.</li>
        <li><b>C2 — Raisonner à l'aide de concepts et de processus</b> : expliquer pourquoi ça marche. → boutons 👀 <i>Montre-moi</i> et explications après chaque réponse.</li>
        <li><b>C3 — Communiquer à l'aide du langage mathématique</b> : utiliser les bons mots (somme, différence, dizaine, face, arête…). → pages 📘 <i>Apprendre</i> et vocabulaire du PDA.</li>
      </ul>

      <h2>Comment on apprend ici (et pourquoi)</h2>
      <ul>
        <li><b>Concret → imagé → abstrait.</b> Le PDA insiste sur le matériel concret et les schémas. Chaque question offre un visuel à manipuler (jetons, cadres de dix, blocs base 10, droite numérique, horloge…) avant d'écrire le nombre.</li>
        <li><b>Des stratégies, pas seulement des tables.</b> Le PDA le dit : le répertoire mémorisé « demande davantage que la seule mémorisation des tables ». On travaille les doubles, les compléments à 10, passer par 10, compter par bonds.</li>
        <li><b>Rétroaction immédiate.</b> L'enfant sait tout de suite s'il a raison. S'il se trompe, il reçoit un indice puis une démonstration, jamais une punition.</li>
        <li><b>Pratique de récupération et révision espacée.</b> La <i>Révision du jour</i> revient sur les habiletés les moins maîtrisées et celles pratiquées il y a longtemps. C'est plus efficace que de faire 50 fois la même chose d'affilée.</li>
        <li><b>Pratique entrelacée.</b> Mélanger les types de questions oblige à <i>choisir</i> la bonne démarche, ce qui est exactement la compétence C1.</li>
        <li><b>Courtes séances.</b> 10 à 15 minutes par jour valent mieux qu'une heure le dimanche. La série 🔥 encourage la régularité.</li>
        <li><b>Parler maths.</b> Demandez « Comment as-tu trouvé ? ». Expliquer sa stratégie à voix haute consolide l'apprentissage (C3).</li>
        <li><b>L'erreur fait partie de l'apprentissage.</b> On félicite l'effort et la stratégie plutôt que la vitesse.</li>
      </ul>

      <h2>Les étoiles de maîtrise</h2>
      <p>Calculées sur les 10 dernières réponses du premier coup : ★ = 50 % et plus (au moins 3 essais), ★★ = 75 % (au moins 6), ★★★ = 90 % (au moins 10). Les questions deviennent un peu plus difficiles à mesure que la maîtrise augmente.</p>

      <h2>Correspondance avec la Progression des apprentissages</h2>
      <table><thead><tr><th>Domaine</th><th>Habileté</th><th>Référence PDA</th><th>Maîtrise</th></tr></thead><tbody>${rows}</tbody></table>

      <h2>Réglages</h2>
      <div class="row">
        <button class="btn" id="toggleSound">${M.sfx.on ? '🔊 Sons activés' : '🔇 Sons désactivés'}</button>
        <button class="btn" id="resetProg">🗑️ Effacer la progression</button>
      </div>
      <p class="muted">La progression est enregistrée seulement dans ce navigateur, sur cet appareil.</p>
    </div>`;
    M.$('#toggleSound').onclick = (e) => { M.sfx.on = !M.sfx.on; e.target.textContent = M.sfx.on ? '🔊 Sons activés' : '🔇 Sons désactivés'; };
    M.$('#resetProg').onclick = () => { if (confirm('Effacer toutes les étoiles et la progression ?')) { M.progress.reset(); parents(); } };
  }

  M.updateStars();
  route();
})();
