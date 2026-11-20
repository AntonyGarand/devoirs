/* =====================================================================
   sciences/skills/matiere.js — domaine sc-matiere (habiletés 10 à 13)
   Simulations (M.SC.sim.*) : bac d'eau, goutte sur un matériau, aimant et objet, deux aimants,
   eau qui change d'état. Déterministes; état final direct si mouvement réduit.
   Réutilisées par les pages Apprendre (eau, démarche).
   La prédiction (format predict) n'est jamais notée : seule la question check compte.
   ===================================================================== */
(function () {
  'use strict';
  const M = window.M;
  const SC = M.SC;
  const Q = SC.Q;
  const cap = SC.cap;
  const SIM = (SC.sim = SC.sim || {});
  const lbl = (o) => SC.lbl(o);
  const $ = (s, el) => el.querySelector(s);
  const setT = (g, x, y, extra = '') => g && g.setAttribute('transform', `translate(${x} ${y})${extra}`);

  /* ================================================================ simulations */
  /** Bac d'eau : l'objet tombe et flotte (reste en surface) ou coule (va au fond). */
  SIM.bac = async function (el, o, { msg = true } = {}) {
    el.innerHTML = `<div class="sc-stage">${SC.svg.bac(SC.svg.objInSvg(o))}</div>${msg ? '<div class="sc-msg"></div>' : ''}`;
    const g = $('.sc-obj', el);
    const surf = 84,
      bottom = 172;
    if (o.float) {
      const dip = o.id === 'orange' || o.id === 'buche' ? 118 : 100;
      await SC.tween(700, (t) => setT(g, 150, 26 + (dip - 26) * SC.ease(t)));
      await SC.tween(600, (t) => setT(g, 150, dip + (surf - dip) * SC.ease(t)));
    } else {
      await SC.tween(700, (t) => setT(g, 150, 26 + (100 - 26) * t * t));
      await SC.tween(900, (t) => setT(g, 150, 100 + (bottom - 100) * SC.ease(t)));
    }
    setT(g, 150, o.float ? surf : bottom);
    if (msg) $('.sc-msg', el).innerHTML = o.float ? `🛟 ${cap(o.nom)} <b>flotte</b>.` : `⚓ ${cap(o.nom)} <b>coule</b>.`;
  };

  /** Goutte d'eau sur un objet : absorbée (tache mouillée) ou en perle sur le dessus. */
  SIM.goutte = async function (el, o) {
    el.innerHTML = `<div class="sc-stage"><svg viewBox="0 0 300 200" class="sc-fig" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="200" rx="16" fill="#f6f1ff"/><rect x="40" y="120" width="220" height="44" rx="10" fill="#e9dcc9" stroke="#b9a68a" stroke-width="2"/>
      <text x="150" y="190" text-anchor="middle" font-size="14" font-weight="800" fill="#2b2d42">${M.esc(SC.plain(o.nom))}</text>
      <g transform="translate(150 118)">${SC.svg.objInSvg(o).replace('font-size="44"', 'font-size="60"')}</g>
      <ellipse class="sc-wet" cx="150" cy="120" rx="0" ry="0" fill="#2c6e9e" opacity=".35"/>
      <path class="sc-drop" d="M0 -16 Q10 -2 10 6 A10 10 0 0 1 -10 6 Q-10 -2 0 -16 Z" fill="#4cb4e6" stroke="#2c86b8" stroke-width="2" transform="translate(150 10)"/></svg></div><div class="sc-msg"></div>`;
    const d = $('.sc-drop', el),
      wet = $('.sc-wet', el);
    const top = 84;
    await SC.tween(700, (t) => d.setAttribute('transform', `translate(150 ${10 + (top - 10) * t * t})`));
    if (o.absorbe) {
      await SC.tween(900, (t) => {
        d.setAttribute('transform', `translate(150 ${top}) scale(${1 - t})`);
        wet.setAttribute('rx', 34 * t);
        wet.setAttribute('ry', 16 * t);
      });
      $('.sc-msg', el).innerHTML = `🧽 L'eau entre dans ${o.nom} : ${SC.pron(o)} l'absorbe${o.nom.startsWith('les ') ? 'nt' : ''} !`;
    } else {
      await SC.tween(500, (t) => d.setAttribute('transform', `translate(${150 + 18 * t} ${top}) scale(${1 + 0.15 * t} ${1 - 0.25 * t})`));
      $('.sc-msg', el).innerHTML = `💧 La goutte reste sur ${o.nom}, comme une petite perle : l'eau n'entre pas.`;
    }
  };

  /** Aimant en U qui descend vers l'objet : l'objet saute et colle, ou rien ne bouge. */
  SIM.aimant = async function (el, o) {
    el.innerHTML = `<div class="sc-stage"><svg viewBox="0 0 300 220" class="sc-fig" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="220" rx="16" fill="#f6f1ff"/>
      <rect x="40" y="196" width="220" height="10" rx="4" fill="#d9c7a5"/><g class="sc-mag">${SC.svg.aimantU(0, 0)}</g><g class="sc-obj">${SC.svg.objInSvg(o)}</g></svg></div><div class="sc-msg"></div>`;
    const mag = $('.sc-mag', el),
      g = $('.sc-obj', el);
    const objY = 172;
    setT(g, 150, objY);
    setT(mag, 150, 72);
    if (o.magnet) {
      await SC.tween(800, (t) => setT(mag, 150, 72 + 24 * SC.ease(t)));
      await SC.tween(250, (t) => setT(g, 150, objY - (objY - 134) * t));
      $('.sc-msg', el).innerHTML = `🧲 Clac ! L'aimant <b>attire</b> ${o.nom}.`;
    } else {
      await SC.tween(900, (t) => setT(mag, 150, 72 + 60 * SC.ease(t)));
      await SC.wait(300);
      await SC.tween(700, (t) => setT(mag, 150, 132 - 60 * SC.ease(t)));
      $('.sc-msg', el).innerHTML = `😶 Rien ne bouge : l'aimant <b>n'attire pas</b> ${o.nom}.`;
    }
  };

  /** Deux aimants droits. aA = pôle de droite de l'aimant de gauche; bB = pôle de gauche de l'aimant de droite. */
  SIM.poles = async function (el, { a, b }, { msg = true } = {}) {
    el.innerHTML = `<div class="sc-stage"><svg viewBox="0 0 400 120" class="sc-fig" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="120" rx="16" fill="#f6f1ff"/>
      <g class="sc-ma">${SC.svg.barre(0, 0, a === 'N')}</g><g class="sc-mb">${SC.svg.barre(0, 0, b === 'S')}</g></svg></div>${msg ? '<div class="sc-msg"></div>' : ''}`;
    const ga = $('.sc-ma', el),
      gb = $('.sc-mb', el);
    setT(ga, 90, 60);
    setT(gb, 290, 60);
    if (a !== b) {
      await SC.tween(800, (t) => setT(gb, 290 - 70 * t * t, 60));
      setT(gb, 220, 60);
      if (msg) $('.sc-msg', el).innerHTML = `🤝 ${a} et ${b} : les aimants <b>s'attirent</b> et se collent.`;
    } else {
      await SC.tween(400, (t) => setT(gb, 290 - 30 * t, 60));
      await SC.tween(600, (t) => setT(gb, 260 + 80 * SC.ease(t), 60));
      setT(gb, 340, 60);
      if (msg) $('.sc-msg', el).innerHTML = `🙅 ${a} et ${b} : les aimants <b>se repoussent</b>.`;
    }
  };

  /** Eau qui change : bonhomme, congélateur, glaçon, assiette, casserole. */
  SIM.eau = async function (el, kind) {
    const svg = (inner) =>
      `<div class="sc-stage"><svg viewBox="0 0 300 200" class="sc-fig" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="200" rx="16" fill="#f6f1ff"/>${inner}</svg></div><div class="sc-msg"></div>`;
    const msg = (h) => {
      const m = $('.sc-msg', el);
      if (m) m.innerHTML = h;
    };
    if (kind === 'bonhomme') {
      el.innerHTML = svg(`<circle cx="250" cy="40" r="22" fill="#ffd166"/><rect y="170" width="300" height="30" fill="#9ed36a"/>
        <ellipse class="sc-flaque" cx="150" cy="172" rx="10" ry="3" fill="#8fd0f0"/>
        <g class="sc-snow"><circle cx="150" cy="140" r="32" fill="#fff" stroke="#c9d6e3" stroke-width="2"/><circle cx="150" cy="86" r="24" fill="#fff" stroke="#c9d6e3" stroke-width="2"/>
        <circle cx="142" cy="82" r="2.5"/><circle cx="158" cy="82" r="2.5"/><polygon points="150,88 166,92 150,94" fill="#f78c40"/></g>`);
      const s = $('.sc-snow', el),
        f = $('.sc-flaque', el);
      await SC.tween(1600, (t) => {
        s.setAttribute('transform', `translate(150 172) scale(${1 - 0.85 * t}) translate(-150 -172)`);
        f.setAttribute('rx', 10 + 60 * t);
        f.setAttribute('ry', 3 + 7 * t);
      });
      return msg("☀️ Le bonhomme <b>fond</b> : la neige devient de l'eau liquide.");
    }
    if (kind === 'congelateur') {
      el.innerHTML =
        svg(`<rect x="70" y="20" width="160" height="170" rx="12" fill="#dff3fb" stroke="#7fb8d6" stroke-width="4"/><text x="210" y="46" font-size="22">❄️</text>
        <path d="M120 80 h60 l-6 80 h-48 z" fill="none" stroke="#7d8597" stroke-width="3"/><path class="sc-liq" d="M123 100 h54 l-4.5 58 h-45 z" fill="#4cb4e6"/>`);
      const l = $('.sc-liq', el);
      await SC.tween(1500, (t) => {
        const c = [76 + (230 - 76) * t, 180 + (240 - 180) * t, 230 + (250 - 230) * t].map(Math.round);
        l.setAttribute('fill', `rgb(${c})`);
      });
      l.setAttribute('stroke', '#9cc4dc');
      l.setAttribute('stroke-width', '2');
      return msg("🧊 Le lendemain, l'eau a <b>gelé</b> : elle est devenue de la glace (solide).");
    }
    if (kind === 'glacon') {
      el.innerHTML =
        svg(`<path d="M80 150 q70 30 140 0 v20 q-70 24 -140 0 z" fill="#f2c9a0" stroke="#c99a6c" stroke-width="2"/><ellipse class="sc-eau" cx="150" cy="150" rx="6" ry="2" fill="#8fd0f0"/>
        <rect class="sc-ice" x="128" y="104" width="44" height="44" rx="6" fill="#dff3fb" stroke="#7fb8d6" stroke-width="3"/>`);
      const i = $('.sc-ice', el),
        w = $('.sc-eau', el);
      await SC.tween(1500, (t) => {
        const s = 44 * (1 - 0.9 * t);
        i.setAttribute('width', s);
        i.setAttribute('height', s);
        i.setAttribute('x', 150 - s / 2);
        i.setAttribute('y', 148 - s);
        w.setAttribute('rx', 6 + 30 * t);
        w.setAttribute('ry', 2 + 5 * t);
      });
      return msg("✋ Le glaçon <b>fond</b> dans ta main : il devient de l'eau liquide.");
    }
    if (kind === 'assiette') {
      el.innerHTML =
        svg(`<circle cx="250" cy="40" r="22" fill="#ffd166"/><ellipse cx="150" cy="150" rx="90" ry="22" fill="#fff" stroke="#b0b5c2" stroke-width="3"/>
        <ellipse class="sc-eau" cx="150" cy="150" rx="60" ry="13" fill="#8fd0f0"/><g class="sc-up" opacity="0">${[120, 150, 180].map((x) => `<path d="M${x} 120 q-6 -10 0 -20 q6 -10 0 -20" stroke="#b0b5c2" stroke-width="2" fill="none" stroke-dasharray="3 5"/>`).join('')}</g>`);
      const w = $('.sc-eau', el),
        u = $('.sc-up', el);
      await SC.tween(1700, (t) => {
        w.setAttribute('rx', 60 * (1 - t));
        w.setAttribute('ry', 13 * (1 - t));
        u.setAttribute('opacity', String(Math.sin(t * Math.PI) * 0.8));
      });
      return msg("🌬️ L'eau a <b>disparu peu à peu</b> : elle s'est évaporée dans l'air, en vapeur invisible.");
    }
    // casserole sur la cuisinière (avec un adulte)
    el.innerHTML =
      svg(`<rect x="60" y="160" width="180" height="16" rx="4" fill="#555"/><path d="M90 160 q60 -14 120 0" stroke="#ef476f" stroke-width="4" fill="none"/>
      <path d="M80 90 h140 v60 q0 10 -10 10 h-120 q-10 0 -10 -10 z" fill="#c9ced6" stroke="#7d8597" stroke-width="3"/><rect x="84" y="100" width="132" height="48" fill="#8fd0f0"/>
      <g class="sc-bulles"></g><g class="sc-nuage" opacity="0"><circle cx="130" cy="50" r="16" fill="#fff"/><circle cx="152" cy="42" r="20" fill="#fff"/><circle cx="174" cy="52" r="15" fill="#fff"/></g>`);
    const b = $('.sc-bulles', el),
      n = $('.sc-nuage', el);
    await SC.tween(1600, (t) => {
      b.innerHTML = M.range(0, 7)
        .map((k) => {
          const y = 146 - ((t * 140 + k * 17) % 46);
          return `<circle cx="${96 + k * 16}" cy="${y.toFixed(1)}" r="${3 + (k % 3)}" fill="#fff" opacity=".9"/>`;
        })
        .join('');
      n.setAttribute('opacity', String(Math.min(1, t * 1.6)));
    });
    return msg(
      "♨️ L'eau <b>bout</b> : de grosses bulles de vapeur montent. Au-dessus, le petit nuage blanc, ce sont de minuscules gouttes d'eau.",
    );
  };

  /* ================================================================ 10 */
  /** « De quel matériau… » : nom sans le matériau; exclus : cuillère, sac, règle, bocal (matériau variable). */
  const MAT_NOM = {
    canette: 'la canette',
    bille: 'la bille',
    crayon: 'le crayon à mine',
    chaussette: 'la chaussette',
    tshirt: 'le t-shirt',
  };
  const MAT_EXCLU = ['cuillere', 'sac', 'regle', 'bocal'];
  M.registerSkill({
    id: 'sc-proprietes',
    domain: 'sc-matiere',
    title: 'Les propriétés des objets',
    icon: '🧽',
    desc: "Doux ou rugueux; absorbe l'eau ou non; transparent, translucide ou opaque; de quoi c'est fait.",
    pda: 'Univers matériel A.1.a–d — classer des objets selon leurs propriétés (texture…), absorption, perméabilité, transparence (1er cycle); enrichissement en lvl 2 : A.1.k — matériaux qui composent un objet (3e cycle)',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? M.pick(['texture', 'texture', 'doux'])
          : lvl === 1
            ? M.pick(['absorbe', 'absorbe', 'texture'])
            : M.pick(['transp', 'transp', 'materiau', 'absorbe']);
      if (t === 'doux') {
        const k = M.pick(['doux', 'rugueux']),
          autre = k === 'doux' ? 'rugueux' : 'doux';
        const good = M.pick(SC.objetsSurs('texture', k)),
          bad = Q.pickN(SC.objetsSurs('texture', autre), 2);
        return {
          prompt: `Lequel est <b>${k}</b> quand on le touche ?`,
          format: 'choice',
          answer: good.id,
          cols: 3,
          choices: Q.choicesFrom(good, bad, lbl, (x) => x.id),
          hint: 'Rugueux : ça gratte un peu sous les doigts, comme une brique. Doux : comme une peluche.',
          explain: `${cap(good.nom)} est <b>${SC.fem(good) ? { doux: 'douce', rugueux: 'rugueuse' }[k] : k}</b>. La <b>texture</b>, c'est ce que nos doigts sentent : doux, rugueux (qui gratte) ou lisse.`,
          _sc: { kind: 'doux', k },
        };
      }
      if (t === 'texture') {
        const items = [];
        ['doux', 'rugueux'].forEach((k) =>
          Q.pickN(SC.objetsSurs('texture', k), 2).forEach((o) => items.push({ label: lbl(o), bin: k, key: o.id })),
        );
        return {
          prompt: 'Imagine que tu les touches. Sont-ils <b>doux</b> ou <b>rugueux</b> ?',
          format: 'sort',
          items,
          bins: [
            { id: 'doux', label: '🧸 Doux' },
            { id: 'rugueux', label: '🧱 Rugueux' },
          ],
          hint: 'Rugueux : ça gratte un peu sous les doigts, comme une brique. Doux : comme une peluche.',
          explain: "La <b>texture</b>, c'est ce que nos doigts sentent : doux, rugueux (qui gratte) ou lisse.",
          _sc: 'texture',
        };
      }
      if (t === 'absorbe') {
        const o = M.pick(SC.objetsSurs('absorbe'));
        const good = M.pick(SC.objetsSurs('absorbe', true).filter((x) => x.id !== o.id));
        const bad = Q.pickN(
          SC.objetsSurs('absorbe', false).filter((x) => x.id !== o.id),
          2,
        );
        return {
          prompt: `Castor renverse un peu d'eau. Il met une goutte sur <b>${o.nom}</b>. Que va-t-il arriver ?`,
          format: 'predict',
          predict: {
            prompt: 'Je prédis que…',
            choices: [
              { label: "🧽 L'eau va entrer dedans (absorbée)", value: 'oui' },
              { label: "💧 L'eau va rester dessus", value: 'non' },
            ],
          },
          outcome: o.absorbe ? 'oui' : 'non',
          simulate: (el) => SIM.goutte(el, o),
          result: o.absorbe ? `${cap(o.nom)} <b>absorbe</b> l'eau.` : `${cap(o.nom)} <b>n'absorbe pas</b> l'eau.`,
          check: {
            prompt: "Lequel de ces objets <b>absorbe</b> l'eau ?",
            format: 'choice',
            answer: good.id,
            choices: Q.choicesFrom(
              good,
              bad,
              lbl,
              (x) => x.id,
              (x) => `${cap(x.nom)} n'absorbe pas l'eau : elle reste dessus.`,
            ),
            hint: "Ce qui absorbe l'eau est plein de petits trous, comme une éponge ou du tissu.",
          },
          explain:
            "Une éponge, du tissu ou du papier sont pleins de petits trous où l'eau entre : ils <b>absorbent</b>. Le plastique, le verre et le métal n'absorbent pas : l'eau reste dessus.",
          _sc: { kind: 'absorbe', o: o.id },
        };
      }
      if (t === 'transp') {
        const items = [];
        ['transparent', 'translucide', 'opaque'].forEach((k) =>
          Q.pickN(SC.objetsSurs('transp', k), 2).forEach((o) => items.push({ label: lbl(o), bin: k, key: o.id })),
        );
        return {
          prompt: 'Est-ce que la lumière passe à travers ? Classe les objets.',
          format: 'sort',
          items,
          bins: Object.entries(SC.TRANSP).map(([id, x]) => ({
            id,
            label: `${x.icon} ${x.label}<small style="display:block;font-weight:700">${x.def}</small>`,
          })),
          hint: 'Imagine que tu regardes une lampe à travers. La vois-tu clairement, flou, ou pas du tout ?',
          explain:
            'La lumière traverse une vitre : elle est <b>transparente</b>. Le papier ciré laisse passer la lumière, mais on voit flou : il est <b>translucide</b>. Une brique ne laisse pas passer la lumière : elle est <b>opaque</b>.',
          _sc: 'transp',
        };
      }
      // Nom qui ne dit pas le matériau (sinon la consigne donne la réponse); objets au matériau variable exclus.
      const o = M.pick(SC.objetsSurs('mat').filter((x) => !MAT_EXCLU.includes(x.id)));
      const nom = MAT_NOM[o.id] || o.nom;
      const others = Q.pickN(
        Object.keys(SC.MATERIAUX).filter((m) => m !== o.mat),
        2,
      );
      const matMot = (m) => SC.plain(SC.MATERIAUX[m]).replace(/^(le |la |l')/i, '');
      return {
        prompt: `De quel <b>matériau</b> est fait${SC.fem(o) ? 'e' : ''} ${nom} ?`,
        format: 'choice',
        answer: o.mat,
        scene: [{ emoji: o.emoji && !o.recent ? o.emoji : '', art: o.emoji && !o.recent ? null : o.art, label: nom }],
        choices: M.shuffle([o.mat, ...others]).map((m) => ({ label: SC.MATERIAUX[m], value: m })),
        hint: "Est-ce que ça vient d'un arbre ? Est-ce dur et froid comme une clé ? Est-ce que ça se plie comme un vêtement ?",
        explain: `${cap(nom)} est fait${SC.fem(o) ? 'e' : ''} de <b>${matMot(o.mat)}</b>.`,
        _sc: { kind: 'mat', o: o.id },
      };
    },
    check(q) {
      const d = Q.dataOnce();
      if (d) return d;
      if (q._sc === 'texture') return Q.checkSort(q, (k) => SC.objet(k).texture);
      if (q._sc === 'transp') return Q.checkSort(q, (k) => SC.objet(k).transp);
      if (q._sc && q._sc.kind === 'absorbe') {
        const o = SC.objet(q._sc.o);
        if (o.absorbe === null) return 'objet ambigu';
        return Q.checkOne(q.check, (v) => SC.objet(v).absorbe === true);
      }
      if (q._sc && q._sc.kind === 'mat') {
        const nom = SC.plain(q.prompt);
        if (/métal|verre|bois|plastique|coton|aluminium|tissu/i.test(nom.replace(/matériau/, ''))) return 'la consigne nomme le matériau';
        return Q.checkOne(q, (v) => SC.objet(q._sc.o).mat === v);
      }
      if (q._sc && q._sc.kind === 'doux') return Q.checkOne(q, (v) => SC.objet(v).texture === q._sc.k);
    },
  });

  /* ================================================================ 11 */
  const EAU_PRED = {
    bonhomme: {
      p: "Un bonhomme de neige reste au <b>soleil d'avril</b> tout l'après-midi. Que va-t-il arriver ?",
      c: [
        ['fond', '💧 Il va fondre'],
        ['pareil', '⛄ Il va rester pareil'],
        ['grossit', '⬆️ Il va grossir'],
      ],
      out: 'fond',
      check: {
        prompt: "Qu'est-ce qui a fait fondre le bonhomme de neige ?",
        a: 'La chaleur du soleil',
        d: [
          ['Le froid de la nuit', "Le froid fait geler l'eau, pas fondre la neige."],
          ['Le vent qui souffle fort', "Le vent peut le faire tomber, mais c'est la chaleur qui le fait fondre."],
        ],
      },
      e: 'Quand on <b>chauffe</b> la neige ou la glace, elle <b>fond</b> : le solide devient liquide.',
    },
    congelateur: {
      p: "On met un verre d'eau dans le <b>congélateur</b> toute la nuit. Que va-t-il arriver ?",
      c: [
        ['gele', "🧊 L'eau va geler"],
        ['pareil', "🥛 L'eau va rester liquide"],
        ['vide', '💨 Le verre va être vide'],
      ],
      out: 'gele',
      check: {
        prompt: "Pourquoi l'eau est-elle devenue de la glace ?",
        a: 'Il fait très froid dans le congélateur',
        d: [
          ['Il fait noir dans le congélateur', "Le noir ne change rien : c'est le froid qui fait geler l'eau."],
          ['Le verre était petit', "Un grand verre d'eau gèle aussi, s'il fait assez froid."],
        ],
      },
      e: "Quand on <b>refroidit</b> beaucoup l'eau (sous 0 °C), elle <b>gèle</b> : le liquide devient solide.",
    },
    glacon: {
      p: 'Tu tiens un <b>glaçon</b> dans ta main fermée. Que va-t-il arriver ?',
      c: [
        ['fond', '💧 Il va fondre'],
        ['pareil', '🧊 Il va rester pareil'],
        ['grossit', '⬆️ Il va grossir'],
      ],
      out: 'fond',
      check: {
        prompt: 'Pourquoi le glaçon a-t-il fondu ?',
        a: 'Ma main est chaude',
        d: [
          ['Ma main est froide', "Ta main est plus chaude que le glaçon : c'est cette chaleur qui le fait fondre."],
          ["Je l'ai regardé", "Regarder ne change rien : c'est la chaleur de ta main."],
        ],
      },
      e: "Ta main est <b>chaude</b> : elle réchauffe le glaçon, qui <b>fond</b> et devient de l'eau liquide.",
    },
    assiette: {
      p: "On laisse une assiette avec un peu d'eau <b>au soleil</b> tout l'après-midi. Que va-t-il arriver ?",
      c: [
        ['disparait', "🌬️ L'eau va disparaître peu à peu"],
        ['plus', "⬆️ Il va y avoir plus d'eau"],
        ['glace', "🧊 L'eau va geler"],
      ],
      out: 'disparait',
      check: {
        prompt: "Où est partie l'eau de l'assiette ?",
        a: "Dans l'air, en vapeur invisible",
        d: [
          ['Elle est devenue de la glace', "Il faisait chaud : l'eau n'a pas pu geler."],
          ["Elle est entrée dans l'assiette", "L'assiette n'absorbe pas l'eau."],
        ],
      },
      e: "Au soleil, l'eau <b>s'évapore</b> : elle devient de la <b>vapeur d'eau</b>, un gaz invisible qui part dans l'air. C'est comme une flaque qui sèche.",
    },
    casserole: {
      p: "Un adulte fait chauffer une casserole d'eau sur la cuisinière, très longtemps. Que va-t-il arriver ?",
      c: [
        ['bout', "♨️ L'eau va bouillir"],
        ['gele', "🧊 L'eau va geler"],
        ['pareil', '😶 Rien du tout'],
      ],
      out: 'bout',
      check: {
        prompt: "Le petit nuage blanc au-dessus de la casserole, c'est…",
        a: "De minuscules gouttes d'eau",
        d: [
          ['De la fumée', "Rien ne brûle dans la casserole : ce n'est pas de la fumée."],
          ['De la neige', "Il fait chaud au-dessus de la casserole : ce n'est pas de la neige."],
        ],
      },
      e: "L'eau qui bout devient de la <b>vapeur</b>, un gaz <b>invisible</b>. En se refroidissant dans l'air, la vapeur redevient de minuscules gouttes : c'est le petit nuage blanc. ⚠️ La chaleur, toujours avec un adulte !",
    },
  };
  const eauPredict = (k) => {
    const x = EAU_PRED[k];
    return {
      prompt: x.p,
      format: 'predict',
      predict: { prompt: 'Je prédis que…', choices: x.c.map(([value, label]) => ({ label, value })) },
      outcome: x.out,
      simulate: (el) => SIM.eau(el, k),
      check: {
        prompt: x.check.prompt,
        format: 'choice',
        answer: x.check.a,
        choices: M.shuffle([{ label: x.check.a, value: x.check.a }, ...x.check.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
        hint: 'Pense à la chaleur et au froid.',
      },
      explain: x.e,
    };
  };
  M.registerSkill({
    id: 'sc-etats-eau',
    domain: 'sc-matiere',
    title: "L'eau : solide, liquide, gaz",
    icon: '🧊',
    starter: true,
    learn: 'sc-l-eau',
    desc: 'Glace, eau, vapeur; chauffer fait fondre ou bouillir, refroidir fait geler; eau douce ou salée.',
    pda: "Univers matériel A.3.a–d — états de la matière, changements d'état de l'eau; A.4.a — conservation de la matière; Terre et espace A.3.b — eau douce et eau salée (1er cycle); enrichissement : A.3.c — cycle de l'eau (2e cycle)",
    gen({ lvl }) {
      const t =
        lvl === 0
          ? M.pick(['sort', 'sort', 'pred0'])
          : lvl === 1
            ? M.pick(['pred', 'pred', 'sort', 'salee'])
            : M.pick(['cloze', 'conservation', 'casserole', 'salee', 'etat', 'etat', 'pred']);
      if (t === 'etat') {
        const x = M.pick(SC.ETAT_Q);
        return {
          prompt: x.t,
          format: 'choice',
          answer: x.a,
          cols: 1,
          choices: M.shuffle([{ label: x.a, value: x.a }, ...x.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
          hint: "Solide : garde sa forme. Liquide : coule. Gaz : invisible, dans l'air. La chaleur fait fondre; le froid fait geler.",
          explain: x.e,
        };
      }
      if (t === 'sort') {
        const n = lvl === 0 ? 2 : 3;
        const items = [
          ...Q.pickN(SC.SOLIDE, n).map((l) => ({ label: l, bin: 's', key: l })),
          ...Q.pickN(SC.LIQUIDE, n).map((l) => ({ label: l, bin: 'l', key: l })),
        ];
        return {
          prompt: 'Est-ce <b>solide</b> ou <b>liquide</b> ? Classe-les.',
          format: 'sort',
          items,
          bins: [
            { id: 's', label: '🧊 Solide : il garde sa forme' },
            { id: 'l', label: '💧 Liquide : il coule' },
          ],
          hint: "Si tu le mets dans un verre, est-ce qu'il prend la forme du verre ?",
          explain:
            'Un <b>solide</b> garde sa forme (glaçon, roche). Un <b>liquide</b> coule et prend la forme de son contenant (eau, lait).',
          _sc: 'sl',
        };
      }
      if (t === 'pred0') return eauPredict(M.pick(['glacon', 'bonhomme']));
      if (t === 'pred') return eauPredict(M.pick(['bonhomme', 'congelateur', 'glacon', 'assiette']));
      if (t === 'casserole') return eauPredict('casserole');
      if (t === 'salee') {
        const sal = M.pick(SC.EAU_SALEE.salee),
          douces = Q.pickN(SC.EAU_SALEE.douce, 2);
        return {
          prompt: "Où trouve-t-on de l'eau <b>salée</b> ?",
          format: 'choice',
          answer: sal,
          choices: Q.choicesFrom(
            sal,
            douces,
            (x) => x,
            (x) => x,
            (x) => `${cap(x.replace(/^\S+ /, ''))} : c'est de l'eau douce, pas salée.`,
          ),
          hint: "Si tu as déjà goûté l'eau en te baignant à la mer… elle goûte le sel !",
          explain: "L'eau de la <b>mer</b> et de l'océan est salée. L'eau des lacs, des rivières et de la pluie est de l'eau <b>douce</b>.",
          _sc: { kind: 'salee' },
        };
      }
      if (t === 'conservation') {
        return {
          prompt: 'On met un glaçon dans un sac <b>bien fermé</b>. Il fond complètement. Dans le sac, il y a maintenant…',
          format: 'choice',
          answer: 'meme',
          choices: M.shuffle([
            { label: "⚖️ La même quantité d'eau", value: 'meme' },
            { label: "⬇️ Moins d'eau", value: 'moins', why: "Le sac est fermé : rien n'est sorti !" },
            { label: "⬆️ Plus d'eau", value: 'plus', why: "Rien n'est entré dans le sac fermé." },
          ]),
          hint: "Est-ce que de l'eau a pu sortir du sac fermé ?",
          explain: "Le glaçon a changé d'<b>état</b> (solide → liquide), mais c'est <b>la même eau</b> : il y en a autant qu'avant !",
        };
      }
      return {
        prompt: "Complète le <b>cycle de l'eau</b> 🌟",
        format: 'cloze',
        text: "Le soleil {0} l'eau du lac. L'eau devient de la {1} invisible qui monte dans le ciel. Là-haut, il fait froid : la vapeur forme des {2}. Les gouttes tombent : c'est la {3}.",
        blanks: [
          { choices: ['chauffe', 'refroidit', 'gèle'], answer: 'chauffe' },
          { choices: ['vapeur', 'glace', 'roche'], answer: 'vapeur' },
          { choices: ['nuages', 'arbres', 'flaques'], answer: 'nuages' },
          { choices: ['pluie', 'vapeur', 'fumée'], answer: 'pluie' },
        ],
        hint: "Le soleil donne de la chaleur. Que fait la chaleur à l'eau ?",
        explain:
          "Le soleil <b>chauffe</b> l'eau, qui s'évapore en <b>vapeur</b>. En haut, la vapeur refroidit et forme des <b>nuages</b> de gouttelettes. Les gouttes tombent : c'est la <b>pluie</b> (ou la neige). Et ça recommence !",
      };
    },
    check(q) {
      if (q._sc === 'sl') return Q.checkSort(q, (k) => (SC.SOLIDE.includes(k) ? 's' : SC.LIQUIDE.includes(k) ? 'l' : '?'));
      if (q._sc && q._sc.kind === 'salee') return Q.checkOne(q, (v) => SC.EAU_SALEE.salee.includes(v));
    },
  });

  /* ================================================================ 12 (enrichissement) */
  const OBVIOUS = ['bouchon', 'caillou', 'pomme', 'bille', 'plume', 'brique', 'pingpong', 'cle', 'clou'];
  const WHY = {
    orange: {
      prompt: "Pourquoi l'orange avec sa pelure flotte-t-elle ?",
      a: "Sa pelure est pleine de petites bulles d'air",
      d: [
        ["Parce qu'elle est orange", 'La couleur ne change rien : une orange sans pelure coule !'],
        ["Parce qu'elle est légère comme une plume", "Elle n'est pas si légère : c'est l'air dans la pelure qui l'aide."],
      ],
      hint: "Regarde la pelure de près : elle est pleine de petits trous remplis d'air.",
      e: "La pelure d'orange contient plein de minuscules poches d'air, comme une veste de sauvetage. Sans la pelure, l'orange coule !",
    },
    'orange-pelee': {
      prompt: "Pourquoi l'orange sans pelure coule-t-elle ?",
      a: "Elle n'a plus sa pelure pleine d'air",
      d: [
        ["Parce qu'elle est devenue plus lourde", 'En enlevant la pelure, elle est devenue plus légère… et pourtant elle coule !'],
        ["Parce qu'elle est froide", 'La température ne change rien ici.'],
      ],
      hint: "Qu'est-ce qu'on a enlevé à l'orange ?",
      e: "La pelure est pleine de petites bulles d'air : c'est elle qui aidait l'orange à flotter. Sans pelure, elle coule.",
    },
    buche: {
      prompt: 'La bûche est grosse et lourde. Pourquoi flotte-t-elle ?',
      a: 'Le bois flotte, même en gros morceau',
      d: [
        ["Parce qu'elle est lourde", "Être lourd n'explique pas tout : un petit clou léger coule !"],
        ["Parce qu'elle est brune", 'La couleur ne change rien.'],
      ],
      hint: 'Un petit bout de bois flotte-t-il ? Et un gros ?',
      e: "Le <b>bois</b> flotte, que le morceau soit petit ou gros. Ce n'est pas le poids seul qui compte : c'est aussi la matière.",
    },
    glacon: {
      prompt: 'Pourquoi le glaçon flotte-t-il ?',
      a: "La glace flotte sur l'eau",
      d: [
        ["Parce qu'il est froid", "Un caillou froid coule quand même : ce n'est pas le froid."],
        ["Parce qu'il est carré", 'Un glaçon rond flotte aussi.'],
      ],
      hint: 'Pense à un lac en hiver : où est la glace ?',
      e: "La <b>glace</b> flotte sur l'eau : c'est pour ça que les lacs gèlent sur le dessus, et que les poissons nagent dessous !",
    },
    clou: {
      prompt: 'Le clou est petit et léger. Pourquoi coule-t-il ?',
      a: 'Il est tout en métal, sans air dedans',
      d: [
        ["Parce qu'il est pointu", 'Sa pointe ne change rien.'],
        ["Parce qu'il est petit", 'Une petite plume flotte : petit, ça ne veut pas dire couler.'],
      ],
      hint: 'De quoi est fait le clou ?',
      e: "Le clou est fait de <b>métal</b> plein : il coule, même s'il est petit et léger. « Léger » n'explique pas tout !",
    },
  };
  M.registerSkill({
    id: 'sc-flotte-coule',
    domain: 'sc-matiere',
    title: 'Flotte ou coule ?',
    icon: '🛟',
    enrichment: true,
    learn: 'sc-l-eau',
    desc: "Prédire si un objet flotte ou coule, observer, puis expliquer : l'air et la forme comptent.",
    pda: 'Enrichissement — PDA Univers matériel A.1.h–i : flottabilité (2e–3e cycle), qualitatif seulement',
    gen({ lvl }) {
      const t =
        lvl === 0
          ? M.pick(['obvious', 'obvious', 'sort', 'quel'])
          : lvl === 1
            ? M.pick(['why', 'why', 'obvious', 'sort'])
            : M.pick(['sort', 'pate', 'why']);
      if (t === 'quel') {
        const f = M.pick([true, false]);
        const good = SC.objet(M.pick(OBVIOUS.filter((id) => SC.objet(id).float === f)));
        const bad = Q.pickN(
          OBVIOUS.filter((id) => SC.objet(id).float !== f),
          2,
        ).map(SC.objet);
        return {
          prompt: `Dans un bac d'eau, lequel va <b>${f ? 'flotter' : 'couler'}</b> ?`,
          format: 'choice',
          answer: good.id,
          cols: 3,
          choices: Q.choicesFrom(
            good,
            bad,
            lbl,
            (x) => x.id,
            (x) => `${cap(x.nom)} ${x.float ? 'flotte' : 'coule'}.`,
          ),
          hint: "Le liège, le bois et l'air aident à flotter. Le métal plein, la pierre et le verre coulent.",
          explain: `${cap(good.nom)} ${f ? 'flotte' : 'coule'}. Pour en être sûr, un scientifique fait l'expérience !`,
          _sc: { kind: 'quel', f },
        };
      }
      if (t === 'sort') {
        const items = [];
        const pool = (f) =>
          lvl === 0
            ? OBVIOUS.map(SC.objet).filter((o) => o.float === f)
            : SC.objetsSurs('float', f).filter((o) => o.id !== 'bateau-pate' && o.id !== 'pate');
        [true, false].forEach((f) =>
          Q.pickN(pool(f), lvl === 0 ? 2 : 3).forEach((o) => items.push({ label: lbl(o), bin: f ? 'f' : 'c', key: o.id })),
        );
        return {
          prompt: "Dans un bac d'eau, ces objets flottent-ils ou coulent-ils ? Classe-les.",
          format: 'sort',
          items,
          bins: [
            { id: 'f', label: '🛟 Flotte' },
            { id: 'c', label: '⚓ Coule' },
          ],
          hint: "Le bois, l'air et la glace aident à flotter. Le métal plein, la pierre et le verre coulent.",
          explain:
            "Ce n'est pas seulement une question de poids : une grosse bûche flotte, un petit clou coule. La <b>matière</b>, l'<b>air</b> et la <b>forme</b> comptent.",
          _sc: 'float',
        };
      }
      if (t === 'pate') {
        return {
          prompt: 'Une <b>boule</b> de pâte à modeler coule. Avec la même pâte, Léa fait un <b>bateau</b> creux : il flotte ! Pourquoi ?',
          format: 'choice',
          answer: 'forme',
          scene: [
            { art: 'sc-pate', label: 'boule de pâte' },
            { art: 'sc-bateau-pate', label: 'bateau de pâte' },
          ],
          choices: M.shuffle([
            { label: "Sa forme creuse est pleine d'air et pousse beaucoup d'eau", value: 'forme' },
            {
              label: 'La pâte est devenue plus légère',
              value: 'leger',
              why: "C'est la même quantité de pâte : elle n'est pas plus légère.",
            },
            { label: 'La pâte a changé de couleur', value: 'couleur', why: 'La couleur ne change rien à la flottaison.' },
          ]),
          hint: "C'est la même pâte. Qu'est-ce qui a changé ?",
          explain:
            "La même pâte peut couler ou flotter : c'est la <b>forme</b> qui change tout. Le bateau creux contient de l'air et repousse beaucoup d'eau, comme les gros bateaux de métal !",
        };
      }
      const id = t === 'obvious' ? M.pick(OBVIOUS) : M.pick(Object.keys(WHY));
      const o = SC.objet(id);
      const w = WHY[id];
      const check = w
        ? {
            prompt: w.prompt,
            format: 'choice',
            answer: w.a,
            hint: w.hint,
            choices: M.shuffle([{ label: w.a, value: w.a }, ...w.d.map(([l, why]) => ({ label: l, value: l, why }))]),
          }
        : {
            prompt: `Qu'est-ce que ${o.nom} a fait dans l'eau ?`,
            format: 'choice',
            answer: o.float ? 'f' : 'c',
            choices: [
              { label: `🛟 ${SC.cap(SC.pron(o))} a flotté`, value: 'f' },
              { label: `⚓ ${SC.cap(SC.pron(o))} a coulé`, value: 'c' },
            ],
            hint: "Regarde où l'objet est à la fin : à la surface ou au fond ?",
          };
      return {
        prompt: `Castor dépose <b>${o.nom}</b> dans le bac d'eau. Que va-t-il se passer ?`,
        format: 'predict',
        predict: {
          prompt: 'Je prédis que…',
          choices: [
            { label: '🛟 Ça va flotter', value: 'flotte' },
            { label: '⚓ Ça va couler', value: 'coule' },
          ],
        },
        outcome: o.float ? 'flotte' : 'coule',
        simulate: (el) => SIM.bac(el, o),
        check,
        explain: w
          ? w.e
          : (o.float ? `${cap(o.nom)} flotte.` : `${cap(o.nom)} coule.`) +
            " Les scientifiques vérifient toujours leurs prédictions en faisant l'expérience !",
        _sc: { kind: 'pred', o: id },
      };
    },
    check(q) {
      const d = Q.dataOnce();
      if (d) return d;
      if (q._sc && q._sc.kind === 'quel') return Q.checkOne(q, (v) => SC.objet(v).float === q._sc.f);
      if (q._sc === 'float')
        return Q.checkSort(q, (k) => {
          const o = SC.objet(k);
          return o.float === true ? 'f' : o.float === false ? 'c' : 'ambigu';
        });
      if (q._sc && q._sc.kind === 'pred') {
        const o = SC.objet(q._sc.o);
        if (o.float === null) return 'objet ambigu tiré';
        if ((o.float ? 'flotte' : 'coule') !== q.outcome) return 'outcome incohérent';
      }
    },
  });

  /* ================================================================ 13 */
  const elle = (o) => SC.fem(o);
  const AIMANT_USAGE = [
    {
      t: "Des clous sont tombés dans le gazon. Qu'est-ce qui t'aide à les ramasser ?",
      a: '🧲 Un aimant',
      d: [
        ['🔍 Une loupe', 'La loupe aide à voir les clous, mais elle ne les ramasse pas.'],
        ['🧽 Une éponge', "L'éponge n'attire pas les clous."],
      ],
      e: "Les clous sont en <b>fer</b> ou en <b>acier</b> : l'aimant les attire et les ramasse.",
    },
    {
      t: 'Quel objet a une aiguille aimantée qui montre le nord ?',
      a: '🧭 La boussole',
      d: [
        ['📏 La règle', 'La règle sert à mesurer.'],
        ['🌡️ Le thermomètre', 'Le thermomètre mesure la température.'],
      ],
      e: 'La <b>boussole</b> a une petite aiguille aimantée qui pointe toujours vers le nord.',
    },
    {
      t: 'Tu veux savoir si un objet est attiré par un aimant. Que fais-tu ?',
      a: "J'approche un aimant pour essayer",
      d: [
        ["Je le mets dans l'eau", "L'eau ne dit rien sur l'aimant : il faut essayer avec un aimant."],
        ['Je regarde sa couleur', "La couleur ne suffit pas : il faut faire l'expérience."],
      ],
      e: "Pour savoir, on fait l'<b>expérience</b> : si l'aimant attire l'objet, c'est qu'il contient du fer ou de l'acier.",
    },
  ];
  M.registerSkill({
    id: 'sc-aimants',
    domain: 'sc-matiere',
    title: 'Les aimants',
    icon: '🧲',
    learn: 'sc-l-demarche',
    desc: "L'aimant attire le fer et l'acier (pas tous les métaux); deux aimants s'attirent ou se repoussent.",
    pda: "Univers matériel C.2.a–b — décrire l'effet d'un aimant sur différents objets; attraction et répulsion; situations d'utilisation (1er cycle)",
    parentNote: 'Sécurité : les petits aimants ne vont jamais dans la bouche.',
    gen({ lvl }) {
      const t = lvl === 0 ? 'sort' : lvl === 1 ? M.pick(['pred', 'pred', 'sort']) : M.pick(['poles', 'poles', 'usage', 'pred']);
      if (t === 'sort') {
        const items = [];
        Q.pickN(SC.objetsSurs('magnet', true), 2).forEach((o) => items.push({ label: lbl(o), bin: 'oui', key: o.id }));
        const non = SC.objetsSurs('magnet', false);
        const pickNon =
          lvl > 0 || Math.random() < 0.6
            ? [
                SC.objet('canette'),
                ...Q.pickN(
                  non.filter((o) => o.id !== 'canette'),
                  2,
                ),
              ]
            : Q.pickN(non, 2);
        pickNon.forEach((o) => items.push({ label: lbl(o), bin: 'non', key: o.id }));
        return {
          prompt: "L'aimant va-t-il <b>attirer</b> ces objets ? Classe-les.",
          format: 'sort',
          items,
          bins: [
            { id: 'oui', label: "🧲 Attiré par l'aimant" },
            { id: 'non', label: '😶 Pas attiré' },
          ],
          hint: "L'aimant attire le fer et l'acier. Attention : pas tous les métaux !",
          explain:
            "L'aimant attire les objets en <b>fer</b> ou en <b>acier</b> (trombone, clou, boîte de conserve). La canette est en <b>aluminium</b> : c'est un métal, mais l'aimant ne l'attire pas.",
          _sc: 'mag',
        };
      }
      if (t === 'pred') {
        const o = M.pick(SC.objetsSurs('magnet'));
        const check = o.magnet
          ? {
              prompt: `Pourquoi l'aimant attire-t-il ${o.nom} ?`,
              a: `${elle(o) ? 'Elle est' : 'Il est'} en fer ou en acier`,
              d: [
                [
                  `${elle(o) ? 'Elle est' : 'Il est'} petit${elle(o) ? 'e' : ''}`,
                  "Une petite plume n'est pas attirée : c'est la matière qui compte, pas la taille.",
                ],
                [
                  `${elle(o) ? 'Elle est' : 'Il est'} brillant${elle(o) ? 'e' : ''}`,
                  "La canette d'aluminium brille, mais l'aimant ne l'attire pas.",
                ],
              ],
            }
          : o.id === 'canette'
            ? {
                prompt: "La canette est en métal. Pourquoi l'aimant ne l'attire-t-il pas ?",
                a: "Elle est en aluminium, un métal que l'aimant n'attire pas",
                d: [
                  ["L'aimant attire tous les métaux", "Non : l'aimant attire le fer et l'acier, pas l'aluminium."],
                  ['Elle est trop grosse', "La taille ne compte pas : c'est la matière."],
                ],
              }
            : {
                prompt: `Pourquoi l'aimant n'attire-t-il pas ${o.nom} ?`,
                a: `${elle(o) ? "Elle n'est" : "Il n'est"} pas en fer ni en acier`,
                d: [
                  [
                    `${elle(o) ? 'Elle est' : 'Il est'} trop gros${elle(o) ? 'se' : ''}`,
                    'La taille ne compte pas : un gros clou est attiré !',
                  ],
                  [`${elle(o) ? "Elle n'a" : "Il n'a"} pas la bonne couleur`, "La couleur ne change rien : c'est la matière qui compte."],
                ],
              };
        return {
          prompt: `Castor approche son aimant <b>${SC.de(o.nom)}</b>. Que va-t-il se passer ?`,
          format: 'predict',
          predict: {
            prompt: 'Je prédis que…',
            choices: [
              { label: "🧲 L'aimant va l'attirer", value: 'oui' },
              { label: '😶 Rien ne va bouger', value: 'non' },
            ],
          },
          outcome: o.magnet ? 'oui' : 'non',
          simulate: (el) => SIM.aimant(el, o),
          check: {
            prompt: check.prompt,
            format: 'choice',
            answer: check.a,
            hint: "De quoi l'objet est-il fait ?",
            choices: M.shuffle([{ label: check.a, value: check.a }, ...check.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
          },
          explain:
            "L'aimant attire seulement les objets en <b>fer</b> ou en <b>acier</b>. Ce n'est ni la taille, ni la couleur qui compte : c'est la <b>matière</b>.",
          _sc: { kind: 'pred', o: o.id },
        };
      }
      if (t === 'poles') {
        const a = M.pick(['N', 'S']),
          b = M.pick(['N', 'S']);
        const same = a === b;
        return {
          prompt: `On approche deux aimants : le côté <b>${a}</b> de l'un vers le côté <b>${b}</b> de l'autre. Que va-t-il se passer ?`,
          format: 'predict',
          predict: {
            prompt: 'Je prédis que les aimants vont…',
            choices: [
              { label: "🤝 S'attirer", value: 'attire' },
              { label: '🙅 Se repousser', value: 'repousse' },
            ],
          },
          outcome: same ? 'repousse' : 'attire',
          simulate: (el) => SIM.poles(el, { a, b }),
          check: {
            prompt: same
              ? `Les côtés ${a} et ${b} se repoussent. Que faut-il faire pour que les aimants se collent ?`
              : 'Quels côtés des aimants se <b>repoussent</b> ?',
            format: 'choice',
            answer: same ? 'tourner' : 'pareil',
            choices: same
              ? M.shuffle([
                  { label: '🔄 Retourner un des aimants', value: 'tourner' },
                  { label: '💪 Pousser plus fort', value: 'fort', why: 'Même en poussant fort, deux côtés pareils se repoussent.' },
                  { label: '⏳ Attendre un peu', value: 'attendre', why: 'Attendre ne change rien : il faut changer de côté.' },
                ])
              : M.shuffle([
                  { label: 'Deux côtés pareils (N et N, ou S et S)', value: 'pareil' },
                  { label: 'Deux côtés différents (N et S)', value: 'diff', why: "Tu viens de le voir : N et S s'attirent !" },
                ]),
            hint: "Pareils : ils se repoussent. Différents : ils s'attirent.",
          },
          explain:
            "Chaque aimant a deux côtés (deux pôles) : <b>N</b> et <b>S</b>. Deux côtés <b>différents</b> s'attirent; deux côtés <b>pareils</b> se repoussent.",
          _sc: { kind: 'poles', same },
        };
      }
      if (Math.random() < 0.6) {
        const x = M.pick(AIMANT_USAGE);
        return {
          prompt: x.t,
          format: 'choice',
          answer: x.a,
          cols: 1,
          choices: M.shuffle([{ label: x.a, value: x.a }, ...x.d.map(([l, w]) => ({ label: l, value: l, why: w }))]),
          hint: "L'aimant attire les objets en fer ou en acier.",
          explain: x.e,
        };
      }
      return {
        prompt: 'À quoi peut servir un <b>aimant</b> à la maison ?',
        format: 'choice',
        answer: 'frigo',
        choices: M.shuffle([
          { label: '📌 Tenir un dessin sur la porte du frigo', value: 'frigo' },
          { label: '💡 Allumer la lumière', value: 'lumiere', why: 'Pour la lumière, on utilise un interrupteur.' },
          { label: '✂️ Couper du papier', value: 'couper', why: 'Pour couper, il faut des ciseaux.' },
        ]),
        hint: 'La porte du frigo est en acier…',
        explain:
          "La porte du frigo est en <b>acier</b> : l'aimant colle dessus et tient le dessin. On trouve aussi des aimants dans les fermoirs de sacs et dans les boussoles.",
      };
    },
    check(q) {
      const d = Q.dataOnce();
      if (d) return d;
      if (q._sc === 'mag')
        return Q.checkSort(q, (k) => {
          const o = SC.objet(k);
          return o.magnet === true ? 'oui' : o.magnet === false ? 'non' : 'ambigu';
        });
      if (q._sc && q._sc.kind === 'pred') {
        const o = SC.objet(q._sc.o);
        if (o.magnet === null) return 'objet ambigu tiré';
        if ((o.magnet ? 'oui' : 'non') !== q.outcome) return 'outcome incohérent';
      }
      if (q._sc && q._sc.kind === 'poles' && (q._sc.same ? 'repousse' : 'attire') !== q.outcome) return 'pôles incohérents';
    },
  });
})();
