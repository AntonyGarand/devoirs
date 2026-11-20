/* =====================================================================
   learn/stats.js — pages « Apprendre » : diagrammes et hasard
   Réutilise les dessins de M.stats (js/skills/stats.js).
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const S = M.stats;
  if (!S) return;

  try {
    M.css(`
    .st-topics { margin-top: 4px }
    .st-vote { display: grid; gap: 8px; max-width: 640px }
    .st-vrow { display: grid; grid-template-columns: 140px 48px 1fr 48px 44px; gap: 8px; align-items: center; background: #fbfaf6; border: 3px solid var(--line); border-radius: 16px; padding: 6px 10px }
    .st-vrow .lab { font-weight: 800; display: flex; align-items: center; gap: 6px }
    .st-vrow .lab span { font-size: 1.6rem }
    .st-vrow .btn { padding: 4px 0; font-size: 1.4rem; width: 48px }
    .st-vrow .tal { min-height: 34px; display: flex; align-items: center; overflow: hidden }
    .st-vrow .num { font-size: 1.5rem; font-weight: 900; text-align: center }
    @media (max-width: 520px) { .st-vrow { grid-template-columns: 1fr 44px 44px 40px } .st-vrow .tal { grid-column: 1 / -1; grid-row: 2 } .st-vrow .btn { width: 44px } }
    .st-three .l-tile { display: flex; flex-direction: column; align-items: center; gap: 6px; overflow-x: auto }
    .st-three .st-ppics { flex-wrap: wrap }
    .st-three .st-pp { font-size: 1.15rem }
    .st-three .st-pcat { flex-basis: 96px; font-size: .9rem }
    .st-parts-box { display: grid; grid-template-columns: minmax(260px, 1.4fr) 1fr; gap: 14px; align-items: start }
    @media (max-width: 760px) { .st-parts-box { grid-template-columns: 1fr } }
    .st-partbtns { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px }
    .st-hl-title [data-part="title"], .st-hl-axis [data-part="axis"] text, .st-hl-cats [data-part="cats"] text { fill: #d62828 !important }
    .st-hl-axis [data-part="axis"] line { stroke: #d62828 }
    .st-hl-bars [data-part="bars"] rect:not([fill="transparent"]) { stroke: #2b2d42; stroke-width: 6 }
    .st-hl-leg .st-pleg { outline: 4px solid #d62828; outline-offset: 3px; animation: pop .5s }
    .st-hl-title .st-ptitle, .st-hl-cats .st-pcat { color: #d62828 }
    .st-qa { display: grid; gap: 8px }
    .st-qa .st-q { text-align: left; justify-content: flex-start }
    .st-ans { font-weight: 800; margin: 2px 0 6px 12px; color: var(--C); min-height: 0 }
    .st-ans:empty { display: none }
    .st-lab { display: grid; grid-template-columns: minmax(250px, 1fr) minmax(260px, 1.2fr); gap: 16px; align-items: start }
    @media (max-width: 760px) { .st-lab { grid-template-columns: 1fr } }
    .st-lab-left { display: flex; flex-direction: column; align-items: center; gap: 10px }
    .st-cfg { display: flex; flex-direction: column; gap: 8px; width: 100%; align-items: center }
    .st-secs { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center }
    .st-sec { width: 44px; height: 44px; border-radius: 50%; border: 3px solid rgba(0,0,0,.25); font-weight: 900; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.5) }
    .st-brow { display: flex; align-items: center; gap: 8px; font-weight: 800 }
    .st-brow .btn { width: 40px; padding: 2px 0; font-size: 1.2rem }
    .st-brow b { min-width: 1.5em; text-align: center; font-size: 1.2rem }
    .st-pred .chip { cursor: pointer }
    .st-pred .chip.on { background: var(--ink); color: #fff; border-color: var(--ink) }
    .st-msg { font-weight: 800; text-align: center }
    .st-cards { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 12px; min-height: 20px }
    .st-card { background: #fff; border: 3px solid var(--line); border-radius: 14px; padding: 8px 10px; font-weight: 700; font-size: .98rem; max-width: 240px; text-align: left; display: flex; gap: 8px; align-items: center }
    .st-card .e { font-size: 1.6rem }
    .st-card.sel { border-color: var(--B); background: var(--Bb); transform: translateY(-3px) }
    .st-zones { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px }
    @media (max-width: 640px) { .st-zones { grid-template-columns: 1fr } }
    .st-zone { border: 3px solid; border-radius: 16px; padding: 8px; min-height: 120px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; align-items: stretch }
    .st-zone > h3 { margin: 0; text-align: center; font-size: 1.1rem }
    .st-zone.imp { background: #ffe5e5; border-color: #f3a3a3 }
    .st-zone.pos { background: #fff6d6; border-color: #f2d27a }
    .st-zone.cer { background: var(--Cc); border-color: #8fdcc3 }
    .st-zone .st-card { max-width: none; font-size: .9rem; cursor: default }
    .st-arrowline { height: 14px; margin: 6px 0 10px; border-radius: 999px; background: linear-gradient(90deg, #f3a3a3, #f2d27a, #8fdcc3) }
    .st-coin { width: 110px; height: 110px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.3rem; background: radial-gradient(circle at 35% 30%, #ffe9a8, #e0a800); border: 5px solid #b88a00; color: #5a4300 }
    .st-coin.flip { animation: st-flip .6s }
    @keyframes st-flip { 50% { transform: rotateY(90deg) scale(1.1) } }
    .st-hist { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center }
    .st-hist span { border: 2px solid var(--line); border-radius: 8px; padding: 2px 6px; font-weight: 800; background: #fff; font-size: .9rem }
    `);
  } catch {
    /* hors navigateur */
  }

  const castor = (html: string, cls = '') => `<div class="callout ${cls}">🦫 <b>Castor :</b> ${html}</div>`;

  /* ==================================================================
     Page 1 : Les diagrammes — « Le vote de la classe »
     ================================================================== */
  M.registerLearn({
    id: 'diagrammes',
    domain: 'stats',
    title: 'Le vote de la classe',
    icon: '📊',
    short: 'Enquête, tableau, diagramme à bandes et à pictogrammes',
    intro:
      'On fait une enquête dans la classe ! On pose une question, on compte les votes, puis on montre les résultats dans un tableau et dans des diagrammes.',
    render(el) {
      const topics = S.VOTES;
      const st: { t: number; counts: number[] } = { t: 0, counts: [] };
      const cats = () => topics[st.t].cats.slice(0, 4).map((c, i) => ({ ...c, color: S.PAL[i], value: st.counts[i] || 0 }));
      const resetCounts = () => {
        st.counts = S.distinct(4, 1, 7);
      };
      resetCounts();

      el.innerHTML = `
        <section class="l-sec"><h2>🗳️ 1. On choisit une question d'enquête</h2>
          <p>Pour faire une <b>enquête</b>, on pose <b>la même question</b> à chaque ami de la classe. Choisis ta question :</p>
          <div class="row st-topics"></div>
          ${castor("Une bonne question d'enquête, c'est une question à laquelle <b>tout le monde peut répondre</b>. « Aimes-tu le hockey ? » se répond juste par oui ou non. « Quel est ton sport préféré ? » nous apprend beaucoup plus de choses !")}
        </section>

        <section class="l-sec"><h2>✋ 2. On compte les votes</h2>
          <p>Touche <b>+</b> quand un ami vote, et <b>−</b> si tu t'es trompé. Chaque vote fait un <b>trait</b>. Au 5<sup>e</sup> vote, on <b>barre</b> le paquet : c'est plus facile à compter par 5 !</p>
          <div class="st-vote"></div>
          <div class="row"><button class="btn st-rand">🎲 Votes au hasard</button><button class="btn st-zero">↺ Tout à zéro</button></div>
        </section>

        <section class="l-sec"><h2>👀 3. Les mêmes données, trois façons</h2>
          <p>Les votes changent ? Regarde : le <b>tableau</b>, le <b>diagramme à bandes</b> et le <b>diagramme à pictogrammes</b> changent tous en même temps. Ils montrent les <b>mêmes données</b> !</p>
          <div class="l-grid st-three">
            <div class="l-tile"><h3>📋 Tableau</h3><div class="st-v-table"></div></div>
            <div class="l-tile"><h3>📊 Diagramme à bandes</h3><div class="st-v-bars" style="width:100%"></div></div>
            <div class="l-tile"><h3>🙂 Diagramme à pictogrammes</h3><div class="st-v-picto" style="width:100%"></div></div>
          </div>
          ${castor('Dans le diagramme à bandes, plus la bande est <b>haute</b>, plus il y a de votes. Dans le pictogramme, plus la rangée est <b>longue</b>, plus il y a de votes.')}
        </section>

        <section class="l-sec"><h2>🔍 4. Les parties d'un diagramme</h2>
          <p>Touche un bouton pour voir où se trouve chaque partie.</p>
          <div class="st-partbtns"></div>
          <div class="st-parts-box"><div class="st-parts-chart"></div><div><div class="st-parts-picto"></div><div class="callout blue st-part-txt">Touche un bouton ☝️</div></div></div>
        </section>

        <section class="l-sec"><h2>🖼️ 5. La légende du pictogramme</h2>
          <p>La <b>légende</b> dit combien vaut chaque image. Change la légende et regarde ce qui arrive :</p>
          <div class="row st-legbtns"><button class="btn on" data-per="1">🙂 = 1 élève</button><button class="btn" data-per="2">🙂 = 2 élèves</button><button class="btn yellow st-legcount">🔢 Compter</button></div>
          <div class="st-legpicto" style="margin-top:10px"></div>
          ${castor("Si 🙂 = 2 élèves, on dessine <b>2 fois moins</b> d'images. Pour lire, on compte par bonds de 2 : 2, 4, 6, 8… Regarde toujours la légende avant de compter !")}
        </section>

        <section class="l-sec"><h2>❓ 6. Des questions à poser à ton diagramme</h2>
          <p>Un diagramme sert à répondre à des questions. Touche une question pour voir la réponse avec <b>tes</b> votes :</p>
          <div class="st-qa"></div>
          ${castor('Pour « combien de plus », on cherche les deux nombres, puis on fait une soustraction : le plus grand moins le plus petit.')}
        </section>`;

      /** Élément de la page (rendu juste au-dessus). */
      const $ = (s: string) => M.$(s, el)!;

      /* --- 1. sujets --- */
      function drawTopics() {
        $('.st-topics').innerHTML = topics
          .map((t, i) => `<button class="btn${i === st.t ? ' on' : ''}" data-t="${i}">${t.cats[0].icon} « ${t.q} »</button>`)
          .join('');
      }
      $('.st-topics').onclick = (e) => {
        const b = M.closest(e, '[data-t]');
        if (!b) return;
        st.t = Number(b.dataset.t);
        resetCounts();
        M.sfx.tap();
        drawTopics();
        drawAll();
      };

      /* --- 2. votes --- */
      function drawVote() {
        $('.st-vote').innerHTML = cats()
          .map(
            (c, i) => `<div class="st-vrow">
          <div class="lab"><span>${c.icon}</span>${c.label}</div>
          <button class="btn st-minus" data-i="${i}" ${c.value <= 0 ? 'disabled' : ''} aria-label="Enlever un vote">−</button>
          <div class="tal">${S.tally(c.value, { h: 32 })}</div>
          <button class="btn primary st-plus" data-i="${i}" ${c.value >= 20 ? 'disabled' : ''} aria-label="Ajouter un vote">+</button>
          <div class="num">${c.value}</div></div>`,
          )
          .join('');
      }
      $('.st-vote').onclick = (e) => {
        const b = M.closest<HTMLButtonElement>(e, 'button[data-i]');
        if (!b || b.disabled) return;
        const i = Number(b.dataset.i),
          d = b.classList.contains('st-plus') ? 1 : -1;
        st.counts[i] = Math.max(0, Math.min(20, (st.counts[i] || 0) + d));
        if (d > 0) M.sfx.pop();
        else M.sfx.tap();
        drawAll();
      };
      $('.st-rand').onclick = () => {
        st.counts = [0, 0, 0, 0].map(() => M.rnd(0, 9));
        M.sfx.hop();
        drawAll();
      };
      $('.st-zero').onclick = () => {
        st.counts = [0, 0, 0, 0];
        M.sfx.tap();
        drawAll();
      };

      /* --- 3. trois vues --- */
      function drawViews() {
        const t = topics[st.t],
          cs = cats();
        $('.st-v-table').innerHTML = S.table({
          caption: t.title,
          head: ['Réponse', 'Traits', 'Nombre'],
          rows: cs.map((c) => [`${c.icon} ${c.label}`, S.tally(c.value, { h: 24 }), String(c.value)]),
        });
        $('.st-v-bars').innerHTML = S.barChart({ cats: cs, title: t.title, axis: t.axis });
        $('.st-v-picto').innerHTML = S.picto({ title: t.title, cats: cs, sym: '🙂', per: 1, unit: t.unit });
      }

      /* --- 4. parties --- */
      const PARTS: [string, string, string][] = [
        ['title', '🏷️ Titre', 'Le <b>titre</b> dit de quoi parle le diagramme. On le lit en premier !'],
        [
          'cats',
          '🍎 Catégories',
          "Les <b>catégories</b>, ce sont les réponses possibles. Chaque catégorie a sa bande (ou sa rangée d'images).",
        ],
        [
          'axis',
          '🔢 Nombres',
          "Les <b>nombres</b> sont sur le côté, avec des lignes. On suit la ligne du haut de la bande jusqu'au nombre.",
        ],
        [
          'bars',
          '📊 Bandes',
          'Chaque <b>bande</b> montre combien de votes a reçu une catégorie. Plus elle est haute, plus il y a de votes.',
        ],
        ['leg', '🖼️ Légende', 'Dans un pictogramme, la <b>légende</b> dit combien vaut une image. Ici, 🙂 = 2 élèves.'],
      ];
      let part: string | null | undefined = null;
      const partData = [
        { label: 'Hockey', icon: '🏒', value: 6, color: S.PAL[0] },
        { label: 'Soccer', icon: '⚽', value: 4, color: S.PAL[1] },
        { label: 'Natation', icon: '🏊', value: 8, color: S.PAL[2] },
      ];
      function drawParts() {
        $('.st-partbtns').innerHTML = PARTS.map(
          ([k, l]) => `<button class="btn${part === k ? ' on' : ''}" data-p="${k}">${l}</button>`,
        ).join('');
        const box = $('.st-parts-box');
        box.className = 'st-parts-box' + (part ? ' st-hl-' + part : '');
        $('.st-parts-chart').innerHTML = S.barChart({ cats: partData, title: 'Notre sport préféré', axis: "Nombre d'élèves", max: 10 });
        $('.st-parts-picto').innerHTML = S.picto({
          title: 'Notre sport préféré',
          cats: partData,
          sym: '🙂',
          per: 2,
          unit: ['élève', 'élèves'],
        });
        const p = PARTS.find((x) => x[0] === part);
        $('.st-part-txt').innerHTML = p ? p[2] : 'Touche un bouton ☝️';
      }
      $('.st-partbtns').onclick = (e) => {
        const b = M.closest(e, '[data-p]');
        if (!b) return;
        part = part === b.dataset.p ? null : b.dataset.p;
        M.sfx.tap();
        drawParts();
      };

      /* --- 5. légende --- */
      let per = 1,
        counting = false;
      const legData = [
        { label: 'Chien', icon: '🐶', value: 8 },
        { label: 'Chat', icon: '🐱', value: 6 },
        { label: 'Lapin', icon: '🐰', value: 2 },
        { label: 'Poisson', icon: '🐠', value: 4 },
      ];
      function drawLeg() {
        M.$$('[data-per]', el).forEach((b) => b.classList.toggle('on', Number(b.dataset.per) === per));
        $('.st-legpicto').innerHTML =
          S.picto({
            title: 'Notre animal préféré',
            cats: legData,
            sym: '🙂',
            per,
            unit: ['élève', 'élèves'],
            reveal: counting ? [0, 1, 2, 3] : [],
          }) +
          `<p class="muted" style="font-weight:700">Les nombres ne changent pas : il y a toujours 8 votes pour le chien, 6 pour le chat, 2 pour le lapin et 4 pour le poisson.</p>`;
      }
      $('.st-legbtns').onclick = (e) => {
        const b = M.closest(e, 'button');
        if (!b) return;
        if (b.dataset.per) {
          per = Number(b.dataset.per);
          counting = false;
        } else counting = !counting;
        M.sfx.tap();
        drawLeg();
      };

      /* --- 6. questions --- */
      function answers(): [string, string][] | null {
        const cs = cats(),
          vals = cs.map((c) => c.value),
          tot = vals.reduce((a, b) => a + b, 0);
        if (!tot) return null;
        const max = Math.max(...vals),
          min = Math.min(...vals);
        const named = (v: number) => cs.filter((c) => c.value === v).map((c) => `${c.icon} ${c.label}`);
        const one = (v: number, word: string) => {
          const n = named(v);
          return n.length === 1
            ? `${n[0]}, avec ${v} ${M.plural(v, 'vote')}.`
            : `Égalité ! ${n.join(' et ')} ont ${word} ${v} ${M.plural(v, 'vote')} chacun.`;
        };
        const big = cs[vals.indexOf(max)],
          small = cs[vals.indexOf(min)];
        return [
          ['Quelle réponse a reçu le plus de votes ?', one(max, 'le plus :')],
          ['Quelle réponse a reçu le moins de votes ?', one(min, 'le moins :')],
          ["Combien d'élèves ont voté en tout ?", `${vals.join(' + ')} = <b>${tot}</b> ${M.plural(tot, 'élève')}.`],
          [
            `Combien de votes de plus pour ${big.icon} ${big.the} que pour ${small.icon} ${small.the} ?`,
            max === min
              ? "Aucun : c'est le même nombre !"
              : `${max} − ${min} = <b>${max - min}</b> ${M.plural(max - min, 'vote')} de plus.`,
          ],
        ];
      }
      function drawQA() {
        const a = answers();
        $('.st-qa').innerHTML = !a
          ? '<p class="muted">Personne n\'a encore voté ! Ajoute des votes plus haut. ✋</p>'
          : a
              .map(([q], i) => `<div><button class="btn st-q" data-q="${i}">❓ ${q}</button><div class="st-ans" data-a="${i}"></div></div>`)
              .join('');
      }
      $('.st-qa').onclick = (e) => {
        const b = M.closest(e, '[data-q]');
        if (!b) return;
        const a = answers(),
          box = M.$(`[data-a="${b.dataset.q}"]`, el);
        if (!a || !box) return;
        box.innerHTML = box.innerHTML ? '' : '👉 ' + a[Number(b.dataset.q)][1];
        M.sfx.tap();
      };

      function drawAll() {
        drawVote();
        drawViews();
        drawQA();
      }
      drawTopics();
      drawAll();
      drawParts();
      drawLeg();
    },
  });

  /* ==================================================================
     Page 2 : Le hasard
     ================================================================== */
  M.registerLearn({
    id: 'hasard',
    domain: 'stats',
    title: 'Le hasard',
    icon: '🎲',
    short: 'Roulette, dé, billes : certain, possible ou impossible ?',
    intro:
      "Quand on fait tourner une roulette, qu'on lance un dé ou qu'on pige une bille, on ne sait pas d'avance ce qui va sortir. C'est le hasard ! Viens faire des expériences.",
    render(el) {
      el.innerHTML = `
        <section class="l-sec"><h2>🎲 1. C'est quoi, le hasard ?</h2>
          <p>Avec le <b>hasard</b>, on ne peut pas savoir <b>à coup sûr</b> ce qui va arriver. On peut seulement dire ce qui a <b>des chances</b> d'arriver.</p>
          <div class="l-grid">
            <div class="l-tile">${S.spinner(['rouge', 'bleu', 'jaune', 'vert'], { angle: 30 })}<h3>La roulette</h3><p>Sur quelle couleur la flèche va-t-elle s'arrêter ?</p></div>
            <div class="l-tile"><div style="padding:20px 0">${S.dieFace(5, { size: 110 })}</div><h3>Le dé</h3><p>Quel nombre va sortir : 1, 2, 3, 4, 5 ou 6 ?</p></div>
            <div class="l-tile">${S.bag(['rouge', 'rouge', 'rouge', 'bleu', 'bleu', 'vert'])}<h3>Le sac de billes</h3><p>Sans regarder, quelle bille vais-je piger ?</p></div>
          </div>
          ${castor("Le <b>résultat</b>, c'est ce qui sort vraiment. Une <b>prédiction</b>, c'est ce qu'on pense <b>avant</b>. Avec le hasard, une prédiction peut être bonne… ou pas !")}
        </section>

        <section class="l-sec"><h2>🧪 2. Le laboratoire du hasard</h2>
          <p><b>1)</b> Choisis ton jeu et prépare-le. <b>2)</b> Fais une prédiction. <b>3)</b> Fais l'expérience et regarde les résultats dans le tableau et le diagramme.</p>
          <div class="row st-devtabs">
            <button class="btn on" data-d="spinner">🎡 Roulette</button><button class="btn" data-d="die">🎲 Dé</button><button class="btn" data-d="bag">🎒 Sac de billes</button>
          </div>
          <div class="st-lab" style="margin-top:12px">
            <div class="st-lab-left"><div class="st-cfg"></div><div class="st-labdev"></div></div>
            <div>
              <div class="st-pred"></div>
              <div class="row"><button class="btn primary st-r1">▶ 1 fois</button><button class="btn blue st-r10">⏩ 10 fois</button><button class="btn st-rz">↺ Recommencer</button></div>
              <div class="viz-status st-msg" style="margin:10px 0"></div>
              <div class="st-res"><div class="st-labtable"></div><div class="st-labchart" style="width:100%"></div></div>
            </div>
          </div>
          ${castor("Plus une couleur prend de <b>place</b> sur la roulette (ou plus il y a de billes de cette couleur), plus elle a de <b>chances</b> de sortir. Mais ce n'est <b>jamais certain</b>… sauf si toute la roulette est de la même couleur !")}
        </section>

        <section class="l-sec"><h2>📏 3. Certain, possible ou impossible ?</h2>
          <p>Touche une carte, puis touche l'endroit où elle va sur la <b>ligne des probabilités</b>.</p>
          <ul style="margin:4px 0 10px">
            <li>❌ <b>Impossible</b> : ça ne peut <b>pas</b> arriver.</li>
            <li>🤔 <b>Possible</b> : ça <b>peut</b> arriver, mais on n'en est pas sûr.</li>
            <li>✅ <b>Certain</b> : ça va arriver <b>à coup sûr</b>.</li>
          </ul>
          <div class="st-cards"></div>
          <div class="st-arrowline"></div>
          <div class="st-zones">
            <div class="st-zone imp" data-z="impossible"><h3>❌ Impossible</h3></div>
            <div class="st-zone pos" data-z="possible"><h3>🤔 Possible</h3></div>
            <div class="st-zone cer" data-z="certain"><h3>✅ Certain</h3></div>
          </div>
          <div class="viz-status st-linemsg"></div>
          <div class="row"><button class="btn st-newcards">🔀 Nouvelles cartes</button></div>
        </section>

        <section class="l-sec"><h2>🪙 4. La pièce n'a pas de mémoire</h2>
          <p>Lance la pièce plusieurs fois : <b>pile</b> ou <b>face</b> ? Essaie d'avoir la même chose plusieurs fois de suite.</p>
          <div class="row" style="justify-content:center;gap:20px"><div class="st-coin">?</div><button class="btn primary big st-flipbtn">Lancer la pièce</button></div>
          <div class="viz-status st-coinmsg" style="text-align:center"></div>
          <div class="st-hist"></div>
          ${castor("Même si « face » est sorti 3 fois de suite, au prochain lancer, pile et face ont <b>autant de chances</b> l'un que l'autre. La pièce ne se souvient pas de ce qui est sorti avant !")}
        </section>`;

      /** Élément de la page (rendu juste au-dessus). */
      const $ = (s: string) => M.$(s, el)!;

      /* --- 2. laboratoire --- */
      const L: {
        type: string;
        sectors: StColorKey[];
        bag: Record<StColorKey, number>;
        counts: Record<string, number>;
        n: number;
        pred: string | null;
        tok: number;
        busy: boolean;
        dev: StDevice | null;
      } = {
        type: 'spinner',
        sectors: ['rouge', 'bleu', 'jaune', 'vert'],
        bag: { rouge: 3, bleu: 2, vert: 1, jaune: 0 },
        counts: {},
        n: 0,
        pred: null,
        tok: 0,
        busy: false,
        dev: null,
      };
      const BAGCOLS = ['rouge', 'bleu', 'vert', 'jaune'];
      const spec = (): StDeviceSpec =>
        L.type === 'spinner'
          ? { type: 'spinner', sectors: L.sectors }
          : L.type === 'bag'
            ? { type: 'bag', marbles: BAGCOLS.flatMap((k) => Array<string>(L.bag[k]).fill(k)) }
            : { type: 'die' };

      function drawCfg() {
        let h = '';
        if (L.type === 'spinner') {
          h = `<div class="st-brow">Nombre de parties :
              <button class="btn" data-sn="-1" ${L.sectors.length <= 2 ? 'disabled' : ''}>−</button><b>${L.sectors.length}</b>
              <button class="btn" data-sn="1" ${L.sectors.length >= 8 ? 'disabled' : ''}>+</button></div>
            <div class="muted" style="font-weight:700;font-size:.95rem">Touche une partie pour changer sa couleur :</div>
            <div class="st-secs">${L.sectors.map((k, i) => `<button class="st-sec" data-s="${i}" style="background:${S.COL[k].hex}">${i + 1}</button>`).join('')}</div>`;
        } else if (L.type === 'bag') {
          h = BAGCOLS.map(
            (
              k,
            ) => `<div class="st-brow">${S.dot(k)} <span style="min-width:4.5em">${S.COL[k].fp.replace(/^./, (c) => c.toUpperCase())}</span>
            <button class="btn" data-b="${k}" data-bd="-1" ${L.bag[k] <= 0 ? 'disabled' : ''}>−</button><b>${L.bag[k]}</b>
            <button class="btn" data-b="${k}" data-bd="1">+</button></div>`,
          ).join('');
        } else {
          h = '<div class="muted" style="font-weight:700">Un dé ordinaire, avec 6 faces.</div>';
        }
        $('.st-cfg').innerHTML = h;
      }
      $('.st-cfg').onclick = (e) => {
        const b = M.closest<HTMLButtonElement>(e, 'button');
        if (!b || b.disabled) return;
        if (b.dataset.sn) {
          const d = Number(b.dataset.sn);
          if (d > 0 && L.sectors.length < 8) L.sectors.push(S.COLOR_KEYS[L.sectors.length % S.COLOR_KEYS.length]);
          if (d < 0 && L.sectors.length > 2) L.sectors.pop();
        } else if (b.dataset.s) {
          const i = Number(b.dataset.s),
            keys = S.COLOR_KEYS;
          L.sectors[i] = keys[(keys.indexOf(L.sectors[i]) + 1) % keys.length];
        } else if (b.dataset.b) {
          const k = b.dataset.b,
            d = Number(b.dataset.bd);
          const tot = BAGCOLS.reduce((a, c) => a + L.bag[c], 0);
          if (d > 0 && tot >= S.BAG_MAX) {
            setMsg(`Le sac est plein ! (${S.BAG_MAX} billes au maximum)`);
            return;
          }
          if (d < 0 && tot <= 1) {
            setMsg('Il faut au moins une bille dans le sac.');
            return;
          }
          L.bag[k] = Math.max(0, L.bag[k] + d);
        }
        M.sfx.tap();
        rebuild();
      };
      $('.st-devtabs').onclick = (e) => {
        const b = M.closest(e, '[data-d]');
        if (!b) return;
        L.type = b.dataset.d ?? '';
        M.$$('[data-d]', el).forEach((x) => x.classList.toggle('on', x === b));
        M.sfx.tap();
        rebuild();
      };

      const setMsg = (h: string) => {
        const m = $('.st-msg');
        if (m) m.innerHTML = h;
      };
      function rebuild() {
        L.tok++;
        L.busy = false;
        L.counts = {};
        L.n = 0;
        L.pred = null;
        drawCfg();
        const host = $('.st-labdev');
        host.innerHTML = '';
        L.dev = S.device(host, spec());
        drawPred();
        drawRes();
        setMsg("🤔 Fais d'abord ta prédiction !");
      }
      function drawPred() {
        if (!L.dev) return;
        const cats = L.dev.cats;
        $('.st-pred').innerHTML = `<b>Ma prédiction :</b> ce qui va sortir le plus souvent, c'est…
          <div class="row">${cats.map((c) => `<span class="chip${String(L.pred) === String(c.key) ? ' on' : ''}" data-k="${c.key}">${c.icon} ${c.label}</span>`).join('')}</div>`;
      }
      $('.st-pred').onclick = (e) => {
        const c = M.closest(e, '[data-k]');
        if (!c) return;
        if (L.n > 0) {
          setMsg('On a déjà commencé ! Touche ↺ Recommencer pour faire une nouvelle prédiction.');
          return;
        }
        L.pred = c.dataset.k ?? null;
        M.sfx.tap();
        drawPred();
        setMsg("Parfait ! Maintenant, fais l'expérience. ▶");
      };
      function chartCats(dev: StDevice): StChartCat[] {
        return dev.cats.map((c, i) =>
          L.type === 'die'
            ? { label: c.label, icon: '🎲', value: L.counts[c.key] || 0, color: S.PAL[i % S.PAL.length] }
            : { label: c.label, icon: S.COL[c.key].emo, value: L.counts[c.key] || 0, color: S.COL[c.key].hex },
        );
      }
      function drawRes() {
        if (!L.dev) return;
        $('.st-labtable').innerHTML = S.resultsTable(L.dev.cats, L.counts, { caption: `Résultats : ${L.n} ${M.plural(L.n, 'essai')}` });
        const cc = chartCats(L.dev),
          mx = Math.max(1, ...cc.map((c) => c.value));
        const max = mx <= 10 ? 10 : mx <= 20 ? 20 : Math.ceil(mx / 10) * 10;
        $('.st-labchart').innerHTML = S.barChart({
          cats: cc,
          axis: 'Nombre de fois',
          max,
          step: max <= 10 ? 1 : max <= 20 ? 2 : max / 10,
          title: 'Nos résultats',
        });
      }
      function verdict() {
        if (!L.dev) return;
        const cats = L.dev.cats,
          vals = cats.map((c) => L.counts[c.key] || 0),
          mx = Math.max(...vals);
        const top = cats.filter((c, i) => vals[i] === mx);
        const topTxt = top.map((c) => `${c.icon} ${c.label}`).join(' et ');
        let h = `${L.n} ${M.plural(L.n, 'essai')}. Le plus souvent : ${topTxt}${top.length > 1 ? ' (égalité)' : ''}.`;
        const p = L.pred != null ? cats.find((c) => String(c.key) === String(L.pred)) : undefined;
        if (p) {
          const hit = top.length === 1 && String(top[0].key) === String(L.pred);
          h += `<br>Ta prédiction : ${p.icon} ${p.label}. ${hit ? '🎉 Ta prédiction est pareille au résultat !' : "🎲 Le résultat est différent de ta prédiction… c'est ça, le hasard !"}`;
        }
        setMsg(h);
      }
      async function run(times: number) {
        const dev = L.dev;
        if (!dev || L.busy) return;
        if (L.n >= 100) {
          setMsg('Wow, 100 essais ! Touche ↺ Recommencer pour une nouvelle expérience.');
          return;
        }
        L.busy = true;
        const my = L.tok,
          sp = spec();
        for (let i = 0; i < times; i++) {
          const k = S.drawOutcome(sp);
          await dev.play(k, times === 1 ? 900 : 300); // L.dev change seulement avec L.tok
          if (my !== L.tok || !el.isConnected) return;
          L.counts[k] = (L.counts[k] || 0) + 1;
          L.n++;
          drawRes();
        }
        L.busy = false;
        verdict();
      }
      $('.st-r1').onclick = () => run(1);
      $('.st-r10').onclick = () => run(10);
      $('.st-rz').onclick = () => {
        M.sfx.tap();
        rebuild();
      };
      rebuild();

      /* --- 3. ligne des probabilités --- */
      const DEV_EVENTS: [StLikelihood, string, string][] = [
        ['certain', '🔴', 'Piger une bille rouge dans un sac où toutes les billes sont rouges.'],
        ['impossible', '🎲', 'Obtenir 7 avec un dé ordinaire.'],
        ['possible', '🎲', 'Obtenir 3 avec un dé ordinaire.'],
        ['impossible', '🎡', "La flèche s'arrête sur le vert, sur une roulette rouge et bleue."],
        ['possible', '🎒', 'Piger une bille bleue dans un sac de billes bleues et jaunes.'],
        ['certain', '🎡', "La flèche s'arrête sur le jaune, sur une roulette toute jaune."],
      ];
      const LB: { st: { z: StLikelihood; e: string; t: string; placed: boolean }[]; sel: number } = { st: [], sel: -1 };
      function newCards() {
        const pick = (z: StLikelihood, n: number) =>
          M.shuffle(S.EVENTS[z])
            .slice(0, n)
            .map(([e, t]) => ({ z, e, t }));
        const dev = M.shuffle(DEV_EVENTS)
          .slice(0, 3)
          .map(([z, e, t]) => ({ z, e, t }));
        LB.st = M.shuffle([...pick('certain', 2), ...pick('possible', 2), ...pick('impossible', 2), ...dev]).map((c) => ({
          ...c,
          placed: false,
        }));
        LB.sel = -1;
        drawLine();
        $('.st-linemsg').innerHTML = '';
      }
      function drawLine() {
        const card = (c: (typeof LB.st)[number], i: number) =>
          `<button class="st-card${LB.sel === i ? ' sel' : ''}" data-c="${i}"><span class="e">${c.e}</span><span>${c.t}</span></button>`;
        const left = LB.st.map((c, i) => (c.placed ? '' : card(c, i))).join('');
        $('.st-cards').innerHTML = left || '<b>🎉 Bravo, toutes les cartes sont placées !</b>';
        M.$$('.st-zone', el).forEach((z) => {
          M.$$('.st-card', z).forEach((x) => x.remove());
          z.insertAdjacentHTML(
            'beforeend',
            LB.st
              .filter((c) => c.placed && c.z === z.dataset.z)
              .map((c) => `<div class="st-card"><span class="e">${c.e}</span><span>${c.t}</span></div>`)
              .join(''),
          );
        });
      }
      $('.st-cards').onclick = (e) => {
        const b = M.closest(e, '[data-c]');
        if (!b) return;
        LB.sel = Number(b.dataset.c);
        M.sfx.tap();
        drawLine();
        $('.st-linemsg').innerHTML = 'Maintenant, touche : impossible, possible ou certain ? 👇';
      };
      $('.st-zones').onclick = (e) => {
        const z = M.closest(e, '.st-zone');
        if (!z) return;
        if (LB.sel < 0) {
          $('.st-linemsg').innerHTML = "☝️ Touche d'abord une carte.";
          return;
        }
        const c = LB.st[LB.sel];
        if (c.z === z.dataset.z) {
          c.placed = true;
          LB.sel = -1;
          M.sfx.good();
          $('.st-linemsg').innerHTML = `✅ Oui ! C'est <b>${c.z}</b>.`;
          drawLine();
          if (LB.st.every((x) => x.placed)) M.confetti(40);
        } else {
          M.sfx.bad();
          const tip: Record<StLikelihood, string> = {
            certain: 'Est-ce que ça va arriver à coup sûr ?',
            possible: 'Est-ce que ça peut arriver… ou pas ?',
            impossible: 'Est-ce que ça peut vraiment arriver ?',
          };
          $('.st-linemsg').innerHTML = `Pas tout à fait… ${tip[c.z]} 🤔`;
          const sel = M.$('.st-card.sel', el);
          if (sel) {
            sel.classList.remove('shake');
            void sel.offsetWidth;
            sel.classList.add('shake');
          }
        }
      };
      $('.st-newcards').onclick = () => {
        M.sfx.tap();
        newCards();
      };
      newCards();

      /* --- 4. pièce --- */
      const coin: { hist: string[]; busy: boolean } = { hist: [], busy: false };
      $('.st-flipbtn').onclick = async () => {
        if (coin.busy) return;
        coin.busy = true;
        const c = $('.st-coin');
        c.classList.remove('flip');
        void c.offsetWidth;
        c.classList.add('flip');
        M.sfx.hop();
        await M.sleep(320);
        if (!el.isConnected) return;
        const r = Math.random() < 0.5 ? 'Pile' : 'Face';
        c.textContent = r;
        coin.hist.push(r);
        if (coin.hist.length > 16) coin.hist.shift();
        let streak = 1;
        for (let i = coin.hist.length - 2; i >= 0 && coin.hist[i] === r; i--) streak++;
        $('.st-coinmsg').innerHTML =
          streak >= 2
            ? `« ${r} » ${streak} fois de suite ! Au prochain lancer, pile et face ont encore <b>autant de chances</b>.`
            : `C'est « ${r} ».`;
        $('.st-hist').innerHTML = coin.hist.map((x) => `<span>${x}</span>`).join('');
        await M.sleep(300);
        coin.busy = false;
      };
    },
  });
})();
