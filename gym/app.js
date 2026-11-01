// Oarso Gym · demo interactiva. Una sola página, rutas por #/, estado en el navegador.
(function () {
  const G = window.GYM;
  const $ = (s, r = document) => r.querySelector(s);
  const KEY = 'oarsogym.demo.v1';
  const VERSION = '0.1 · 31/10/2026';

  // ---------- estado ----------
  const defaults = () => ({ lang: 'es', size: 0, onboarded: false, name: 'Naia', auth: null, reg: {}, plan: null, done: {}, mine: [], inc: [], short: false, sound: true, vib: true, motion: true, chk: { d: '', on: {} }, ans: {} });
  let S = (() => { try { const j = JSON.parse(localStorage.getItem(KEY)); if (j) return Object.assign(defaults(), j); } catch (e) {} return defaults(); })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // ---------- idioma ----------
  const t = (k) => { const v = G.T[S.lang][k]; return v === undefined ? (G.T.es[k] === undefined ? k : G.T.es[k]) : v; };
  const L = (o) => (S.lang === 'eu' ? o.eu : o.es);
  const L2 = (p) => (p ? (S.lang === 'eu' ? p[1] : p[0]) : '');
  const N = (x) => (S.lang === 'eu' ? x.eu : x.es);
  const lvlName = (l) => ({ I: t('paraEmpezar'), M: t('siguientePaso'), A: t('avanzado') })[l];
  const matName = (m) => t('mat')[m] || m;
  const whereLabel = (ex) => ex.where === '—' ? t('mat').sin : ex.where.split(/ \+ | o /).map((c) => { const m = G.machine(c); return m ? N(m) : c; }).join(' + ');
  const img = (n) => (typeof n === 'string' ? `img/${n}.jpg` : `img/g${n}.jpg`);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const gname = (g) => L2(G.groupNames[g]);

  // ---------- fechas ----------
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const longDate = (d) => S.lang === 'eu' ? `${t('diasLargo')[d.getDay()]}, ${t('meses')[d.getMonth()]}k ${d.getDate()}` : `${t('diasLargo')[d.getDay()]}, ${d.getDate()} de ${t('meses')[d.getMonth()]}`;
  const dmy = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const hm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ---------- iconos ----------
  const P = {
    home: '<path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>', body: '<circle cx="12" cy="4" r="2"/><path d="M12 6v7m0 0l-4 8m4-8l4 8M5 10l7-2 7 2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    back: '<path d="M15 18l-6-6 6-6"/>', chev: '<path d="M9 6l6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3zM14 20h1M20 14h1"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>',
    alert: '<path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tool: '<path d="M14 7l3 3M5 19l9-9M16 4a3 3 0 0 1 4 4l-2 2-4-4z"/>', star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    up: '<path d="M6 15l6-6 6 6"/>', down: '<path d="M6 9l6 6 6-6"/>', copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', dl: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>', lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    pause: '<path d="M8 5v14M16 5v14"/>', next: '<path d="M5 5l10 7-10 7zM19 5v14"/>', reset: '<path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5"/>', id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h4M14 14h4M6 17a3 3 0 0 1 6 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', play: '<path d="M8 5l11 7-11 7z"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', text: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    sound: '<path d="M4 10v4h4l5 4V6L8 10zM16 9a4 4 0 0 1 0 6"/>', vib: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 9v6M20 9v6"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>', doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6"/>',
  };
  const ic = (n, s) => `<svg class="ic" viewBox="0 0 24 24"${s ? ` style="width:${s}px;height:${s}px"` : ''}>${P[n] || ''}</svg>`;

  // ---------- plan en curso ----------
  const doneList = (d) => S.done[iso(d)] || [];
  function planState() {
    if (!S.plan) return null;
    const p = G.plan(S.plan.id); if (!p) return null;
    const start = new Date(S.plan.start + 'T00:00:00');
    const days = Math.max(0, Math.floor((today() - start) / 864e5));
    const week = Math.min(p.weeks, Math.floor(days / 7) + 1);
    const wStart = addDays(start, (week - 1) * 7);
    let doneWeek = [];
    for (let i = 0; i < 7; i++) doneList(addDays(wStart, i)).forEach((e) => { if (e.type === 'plan' && e.plan === p.id) doneWeek.push(e.k); });
    const keys = p.sched.map((d) => d.k);
    const seq = p.alt ? (week % 2 ? ['A', 'B', 'A'] : ['B', 'A', 'B']) : keys;
    const idx = doneWeek.length;
    return { p, week, seq, idx, k: seq[Math.min(idx, seq.length - 1)], complete: idx >= seq.length, finished: days >= p.weeks * 7, doneWeek };
  }
  const progFor = (p, week) => { let k = 1; Object.keys(p.prog).map(Number).sort((a, b) => a - b).forEach((w) => { if (week >= w) k = w; }); return L2(p.prog[k]); };
  const isDoneToday = (type, extra) => doneList(today()).some((e) => e.type === type && (!extra || (e.plan === extra.plan && e.k === extra.k)));
  function markDone(entry) { const k = iso(today()); S.done[k] = S.done[k] || []; S.done[k].push(entry); if (!S.done[k].some((e) => e.type === 'entrada')) S.done[k].unshift({ type: 'entrada', at: hm(new Date()) }); save(); }

  // ---------- datos de ejemplo al entrar ----------
  function seed(planId) {
    const st = addDays(today(), -9);
    S.plan = { id: planId, start: iso(st) };
    const p = G.plan(planId); const keys = p.sched.map((d) => d.k);
    S.done = {};
    [[0, keys[0]], [2, keys[1] || keys[0]], [7, keys[0]]].forEach(([off, k]) => { const d = iso(addDays(st, off)); S.done[d] = [{ type: 'entrada', at: '18:3' + off }, { type: 'plan', plan: planId, k }]; });
    S.done[iso(addDays(st, 4))] = [{ type: 'entrada', at: '19:10' }, { type: 'mine' }];
    S.mine = [{ id: 1, ex: 1, note: 'Respaldo en el 3' }, { id: 2, ex: 25, note: '' }, { id: 3, ex: 65, note: '' }, { id: 4, ex: 93, note: '' }];
    save();
  }

  // ---------- componentes ----------
  const top = (title, right = '') => `<div class="top"><button class="iconbtn" data-act="back" aria-label="${t('volver')}">${ic('back')}</button><div class="ttl grow ellipsis">${title || ''}</div>${right}</div>`;
  const lvlPill = (l) => `<span class="pill ${l === 'I' ? 'ok' : l === 'M' ? '' : 'warn'}">${lvlName(l)}</span>`;
  function exRow(ex, opts = {}) {
    const meta = opts.meta !== undefined ? opts.meta : `${whereLabel(ex)} · ${lvlName(ex.lvl)}`;
    return `<button class="exrow ${opts.cls || ''}" data-act="nav" data-to="#/e/${ex.id}">${opts.num ? `<span class="num">${opts.num}</span>` : ''}<img class="th ${opts.sm ? 'sm' : ''}" src="${img(ex.img)}" alt="" loading="lazy" decoding="async"><div class="grow"><b>${N(ex)}</b><small>${meta}</small></div>${opts.tail || `<span class="chev">${ic('chev')}</span>`}</button>`;
  }
  function machineCard(m) {
    const ph = m.img ? `<img src="${img(m.img)}" alt="" loading="lazy" decoding="async">` : `<div class="mcode"><b>${m.code}</b></div>`;
    return `<button class="mcard" data-act="nav" data-to="#/m/${m.code.toLowerCase()}"><div class="ph ${m.prod ? "prod" : ""}">${ph}<span class="pill lime">${m.code}</span></div><div class="tx"><b>${N(m)}</b><small>${m.zone === 'libre' ? m.model || '' : m.model.split(' · ')[0]}</small></div></button>`;
  }
  const planCard = (p) => `<button class="pcard" data-act="nav" data-to="#/plan/${p.id}"><img src="${img(p.img)}" alt=""><div class="sh"></div><div class="in"><div class="row between"><span class="eyebrow lime">${p.days} ${t('diasSemana')} · ${p.min} ${t('min')}</span>${S.plan && S.plan.id === p.id ? `<span class="pill lime">${ic('check', 12)} ${t('siguiendo')}</span>` : ''}</div><div class="display">${N(p)}</div><div class="small muted">${L2(p.who).split('.')[0]}.</div></div></button>`;
  const videoHero = (ex, cls = '') => `<div class="hero kb ${cls}"><img src="${img(ex.img)}" alt=""><div class="sh"></div><div class="tl"><span class="pill lime">${ic('play', 11)} ${t('videoPend')}</span></div><button class="play" data-act="video" aria-label="${t('videoT')}">${ic('play')}</button><div class="in"><div class="eyebrow lime">${ex.regions.map((r) => N(G.regions.find((x) => x.id === r))).join(' · ')} · ${lvlName(ex.lvl)}</div><h1 class="display h1">${N(ex)}</h1></div></div>`;
  const musclePair = (p, s, w = 72) => `<div class="musc"><div class="bodybox">${ANAT('f', p, s, w)}</div><div class="bodybox">${ANAT('b', p, s, w)}</div></div>`;
  const tabbar = (active) => `<nav class="tabbar" aria-label="Oarso Gym">${[['hoy', 'home'], ['explorar', 'body'], ['planes', 'list'], ['sesiones', 'timer'], ['yo', 'user']].map(([k, i]) => `<button class="${active === k ? 'on' : ''}" data-act="nav" data-to="#/${k}" aria-current="${active === k ? 'page' : 'false'}">${ic(i)}<span>${t(k)}</span></button>`).join('')}</nav>`;
  function qrSvg(text, level) { try { if (window.qrcode) { const q = qrcode(0, level || 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } } catch (e) {} return `<div class="xs" style="color:#061634;word-break:break-all">${text}</div>`; }
  const euNote = () => S.lang === 'eu' ? `<div class="tip mt12 small">${t('euTrad')}</div>` : '';

  // ---------- pantallas ----------
  function scrHoy() {
    const now = new Date(); const h = now.getHours();
    const greet = h < 13 ? t('buenosDias') : h < 21 ? t('buenasTardes') : t('buenasNoches');
    const ps = planState();
    let planHtml;
    if (ps && ps.finished) {
      planHtml = `<section class="card pad"><div class="eyebrow lime">${t('planFin')} · ${ps.p.weeks} ${t('semanas')}</div><div class="display h2">${N(ps.p)}</div><div class="row mt12"><button class="btn btn-lime grow" data-act="repeatplan">${ic('reset')} ${t('repetir')}</button><button class="btn btn-ghost" data-act="nav" data-to="#/planes">${t('otroPlan')}</button></div></section>`;
    } else if (ps) {
      const day = ps.p.sched.find((d) => d.k === ps.k);
      const thumbs = day.main.slice(0, 5).map(([id]) => `<img src="${img(G.ex(id).img)}" style="width:44px;height:44px;border-radius:12px;object-fit:cover;border:2px solid var(--card)" alt="">`).join('');
      const prog = ps.seq.map((k, i) => `<span class="pill ${i < ps.idx ? 'ok' : i === ps.idx && !ps.complete ? 'lime' : 'line'}">${i < ps.idx ? ic('check', 11) + ' ' : ''}${t('dia')} ${k}</span>`).join('');
      planHtml = `<section class="card pad">
        <div class="eyebrow lime">${t('semana')} ${ps.week} ${t('de')} ${ps.p.weeks}${ps.complete ? '' : ` · ${t('hoyDia')} ${ps.k}`}</div>
        <div class="display h2">${N(ps.p)}</div>
        <div class="row mt8 wrap" style="gap:6px">${prog}</div>
        <div class="small muted mt8">${ps.complete ? t('semanaHecha') : progFor(ps.p, ps.week)}</div>
        ${ps.complete ? '' : `<div class="row mt12" style="gap:0">${thumbs}<span class="small muted" style="margin-left:10px">${day.main.length} ${t('ejercicios')} · ${ps.p.min} ${t('min')}</span></div>`}
        <div class="row mt16">${ps.complete ? `<button class="btn btn-ghost grow" data-act="nav" data-to="#/sesiones">${ic('timer')} ${t('sesiones')}</button>` : `<button class="btn btn-lime grow" data-act="nav" data-to="#/dia/${ps.p.id}/${ps.k}">${ic('play')} ${t('empezar')}</button>`}<button class="btn btn-ghost" data-act="nav" data-to="#/plan/${ps.p.id}">${t('verPlan')}</button></div>
        <div class="row between mt8"><span class="xs muted">${ps.p.alt ? t('alternancia') : ''}</span><button class="link-s" data-act="planadj">${ic('tool', 13)} ${t('ajustarPlan')}</button></div>
      </section>`;
    } else {
      planHtml = `<section class="card pad"><div class="eyebrow">${t('planes')}</div><div class="display h2">${t('sinPlan')}</div><div class="row mt12"><button class="btn btn-lime" data-act="nav" data-to="#/planes">${t('elegirPlan')}</button><button class="btn btn-ghost" data-act="nav" data-to="#/explorar">${t('oExplorar')}</button></div></section>`;
    }
    return `<div class="screen">
      <div class="top"><div class="grow"><div class="eyebrow">${longDate(now)}</div><h1 class="display h1">${greet},<br><span class="lime">${S.name}</span></h1></div><button class="iconbtn lime" data-act="nav" data-to="#/carnet" aria-label="${t('carnet')}">${ic('qr')}</button></div>
      ${planHtml}
      <section class="sec"><div class="sec-h"><h2>${t('avisos')}</h2></div><div class="card">${G.notices.map((n, i) => `<button class="notice" data-act="notice" data-i="${i}"><span class="ni">${ic(n.icon)}</span><div class="small grow">${L(n)}</div><span class="chev">${ic('chev')}</span></button>`).join('')}</div></section>
      <section class="sec"><div class="sec-h"><h2>${t('enLaSala')}</h2></div><div class="grid2">
        <button class="card pad" data-act="nav" data-to="#/explorar/maquina" style="text-align:left;color:#fff"><span class="iconbtn lime" style="margin-bottom:10px">${ic('qr')}</span><b>${t('maquinas')}</b><div class="xs muted mt8">${t('qrHint')}</div></button>
        <button class="card pad" data-act="nav" data-to="#/sesiones" style="text-align:left;color:#fff"><span class="iconbtn" style="margin-bottom:10px">${ic('timer')}</span><b>${t('sesiones')}</b><div class="xs muted mt8">${t('circuitos')} · ${t('cardioMaquina')}</div></button>
      </div></section>
      <button class="btn btn-ghost btn-block mt24" data-act="help">${ic('help')} ${t('pedirAyuda')}</button>
    </div>`;
  }

  function scrExplorar(tab = 'musculo') {
    const seg = `<div class="seg mb12">${[['musculo', 'porMusculo'], ['maquina', 'porMaquina'], ['buscar', 'buscar']].map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-act="nav" data-to="#/explorar/${k}">${t(l)}</button>`).join('')}</div>`;
    let body = '';
    if (tab === 'musculo') {
      const count = (r) => G.exercises.filter((e) => e.regions.includes(r.id) && !e.mov).length;
      body = `<div class="muted small mb12">${t('tocaFigura')}</div>
        <div class="card pad"><div class="anatwrap click">${ANAT('f', [], [], 150)}${ANAT('b', [], [], 150)}</div></div>
        <div class="legend mt12">${G.regions.map((r) => `<button data-act="nav" data-to="#/region/${r.id}"><i></i><div><b>${N(r)}</b><small>${count(r)} ${t('ejercicios')}</small></div></button>`).join('')}</div>`;
    } else if (tab === 'maquina') {
      const zone = (z, l) => `<section class="sec" style="margin-top:14px"><div class="sec-h"><h2>${t(l)}</h2></div><div class="grid2">${G.machines.filter((m) => m.zone === z).map(machineCard).join('')}</div></section>`;
      body = `<button class="btn btn-lime btn-lg btn-block" data-act="scan">${ic('qr')} ${t('escanear')}</button><div class="xs muted mt8 center">${t('qrHint')}</div>` + zone('fuerza', 'zonaFuerza') + zone('cardio', 'zonaCardio') + zone('libre', 'zonaLibre');
    } else {
      body = `<div class="inputwrap">${ic('search')}<input class="input" id="q" placeholder="${t('buscarPh')}" autocomplete="off"></div><div id="results" class="mt12">${searchResults('')}</div>`;
    }
    return `<div class="screen"><div class="top"><h1 class="display h1 grow" style="margin:0">${t('explorar')}</h1></div>${seg}${body}</div>`;
  }
  function searchResults(q) {
    q = q.trim().toLowerCase();
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const list = q.length < 2 ? G.exercises.filter((e) => e.lvl === 'I' && !e.mov).slice(0, 8) : G.exercises.filter((e) => norm(e.es + ' ' + e.eu + ' ' + e.where + ' ' + whereLabel(e) + ' ' + e.p.map(gname).join(' ')).includes(norm(q)));
    if (!list.length) return `<div class="tip">${t('sinResultados')}</div>`;
    return (q.length < 2 ? `<div class="eyebrow mb8">${t('paraEmpezar')}</div>` : `<div class="eyebrow mb8">${list.length} ${t('ejercicios')}</div>`) + list.map((e) => exRow(e)).join('');
  }

  const F = { lvl: 'all', mat: null };
  const CTX = { region: null, machine: null }; // de dónde se llegó a la ficha, para volver al catálogo y pasar al siguiente
  const ORDER = { I: 0, M: 1, A: 2 };
  function regionList(id, filtered = true) {
    let list = G.exercises.filter((e) => e.regions.includes(id));
    if (filtered && F.lvl !== 'all') list = list.filter((e) => e.lvl === F.lvl);
    if (filtered && F.mat) list = list.filter((e) => e.mat.includes(F.mat));
    return list.sort((a, b) => ORDER[a.lvl] - ORDER[b.lvl] || (a.mov - b.mov));
  }
  function scrRegion(id) {
    const r = G.regions.find((x) => x.id === id); if (!r) return scrExplorar();
    CTX.region = id; CTX.machine = null;
    const mats = [...new Set(G.exercises.filter((e) => e.regions.includes(id)).flatMap((e) => e.mat))];
    const list = regionList(id);
    return `<div class="screen">${top(t('porMusculo'))}
      <div class="row" style="align-items:flex-start;gap:14px"><div class="bodybox">${ANAT(r.view, r.groups, [], 96)}</div><div class="grow"><div class="eyebrow lime">${r.groups.map(gname).join(' · ')}</div><h1 class="display h1">${N(r)}</h1><div class="muted small">${G.exercises.filter((e) => e.regions.includes(id)).length} ${t('ejercicios')}</div></div></div>
      <div class="seg s4 mt12">${[['all', 'todos'], ['I', 'paraEmpezar'], ['M', 'siguientePaso'], ['A', 'avanzado']].map(([k, l]) => `<button class="${F.lvl === k ? 'on' : ''}" data-act="flvl" data-v="${k}">${t(l)}</button>`).join('')}</div>
      <div class="chips mt12">${mats.map((m) => `<button class="chip ${F.mat === m ? 'on' : ''}" data-act="fmat" data-v="${m}">${matName(m)}</button>`).join('')}</div>
      <div class="mt8">${list.length ? list.map((e) => exRow(e)).join('') : `<div class="tip">${t('sinResultados')}</div>`}</div>
    </div>`;
  }

  function scrFicha(id) {
    const ex = G.ex(id); if (!ex) return scrExplorar();
    const f = G.fichas[ex.id];
    const inMine = S.mine.some((m) => m.ex === ex.id);
    const m = G.machine(ex.m);
    const dosis = f ? f.dosis : ex.mov ? t('dosisMov') : t('dosis' + ex.lvl);
    const alt = (aid, label) => { const a = aid ? G.ex(aid) : null; return a ? `<button class="vcard" data-act="nav" data-to="#/e/${a.id}"><img src="${img(a.img)}" alt=""><div><small>${label}</small><b>${N(a)}</b></div></button>` : ''; };
    const alts = f ? [alt(f.facil, t('masFacil')), alt(f.dificil, t('masDificil'))].filter(Boolean) : [];
    // contexto: la lista de la que se viene (región o máquina), para volver y para anterior / siguiente
    let ctxList = null, ctxTo = null, ctxName = '';
    if (CTX.region && ex.regions.includes(CTX.region)) { ctxList = regionList(CTX.region); ctxTo = '#/region/' + CTX.region; ctxName = N(G.regions.find((x) => x.id === CTX.region)); }
    else if (CTX.machine && ex.where.includes(CTX.machine)) { ctxList = G.exercises.filter((e) => e.where.includes(CTX.machine)).sort((a, b) => ORDER[a.lvl] - ORDER[b.lvl]); ctxTo = '#/m/' + CTX.machine.toLowerCase(); ctxName = `${CTX.machine} · ${N(G.machine(CTX.machine))}`; }
    else { const r0 = G.regions.find((x) => x.id === ex.regions[0]); if (r0) { ctxList = regionList(r0.id, false); ctxTo = '#/region/' + r0.id; ctxName = N(r0); } }
    const pos = ctxList ? ctxList.findIndex((e) => e.id === ex.id) : -1;
    const prev = pos > 0 ? ctxList[pos - 1] : null, next = pos >= 0 && pos < ctxList.length - 1 ? ctxList[pos + 1] : null;
    const crumb = ctxTo ? `<button class="crumb grow ellipsis" data-act="nav" data-to="${ctxTo}">${ctxName}${pos >= 0 ? ` <span class="faint">· ${pos + 1} ${t('deLista')} ${ctxList.length}</span>` : ''}</button>` : `<div class="ttl grow"></div>`;
    const pn = (prev || next) ? `<div class="pn-nav mt12">${prev ? `<button class="pn" data-act="nav" data-to="#/e/${prev.id}">${ic('back')}<span><small>${t('anterior')}</small><b>${N(prev)}</b></span></button>` : '<span></span>'}${next ? `<button class="pn r" data-act="nav" data-to="#/e/${next.id}"><span><small>${t('siguienteEj')}</small><b>${N(next)}</b></span>${ic('chev')}</button>` : ''}</div>` : '';
    return `<div class="screen"><div class="top"><button class="iconbtn" data-act="back" aria-label="${t('volver')}">${ic('back')}</button>${crumb}<button class="iconbtn" data-act="help" data-m="${ex.m}" data-ex="${ex.id}" aria-label="${t('pedirAyuda')}">${ic('help')}</button></div>
      ${videoHero(ex)}
      <div class="row mt12 wrap">${lvlPill(ex.lvl)}${ex.mat.map((x) => `<span class="pill line">${matName(x)}</span>`).join('')}${m ? `<button class="pill lime" data-act="nav" data-to="#/m/${m.code.toLowerCase()}">${m.code} · ${N(m)}</button>` : ''}</div>
      <section class="sec"><div class="sec-h"><h2>${t('queTrabaja')}</h2></div><div class="card pad"><div class="row" style="align-items:flex-start;gap:14px">${musclePair(ex.p, ex.s)}<div class="grow"><div class="eyebrow lime">${t('principal')}</div><b>${ex.p.map(gname).join(', ')}</b>${ex.s.length ? `<div class="eyebrow mt8">${t('tambien')}</div><div class="small">${ex.s.map(gname).join(', ')}</div>` : ''}</div></div>${ex.pad ? `<div class="tip lime mt12 small"><b>${t('enElPadel')}:</b> ${ex.pad}</div>` : ''}</div></section>
      ${f ? `
      ${euNote()}
      ${f.aj && f.aj.length ? `<section class="sec"><div class="sec-h"><h2>${t('ajusta')}</h2></div><div class="card pad"><ul class="adj">${f.aj.map((s) => `<li>${s}</li>`).join('')}</ul></div></section>` : ''}
      <section class="sec"><div class="sec-h"><h2>${t('hazlo')}</h2></div><div class="card pad"><ol class="steps">${f.haz.map((s) => `<li>${s}</li>`).join('')}</ol></div></section>
      <section class="sec"><div class="sec-h"><h2>${t('evita')}</h2></div><div class="card pad"><ul class="warn">${f.ev.map((s) => `<li>${s}</li>`).join('')}</ul></div></section>` : `<div class="tip warn mt16 small">${ic('info')} ${t('fichaBorrador')}</div>`}
      <section class="sec"><div class="sec-h"><h2>${t('cuanto')}</h2></div><div class="card pad"><b>${dosis}</b>${(() => { const lt = G.loadType(ex); const title = { ext: 'pesoOk', bw: 'pesoOkBw', band: 'pesoOkBand', iso: 'pesoOkIso' }[lt]; const body = f && f.reg && S.lang === 'es' ? f.reg : { ext: t('pesoTxt'), bw: t('pesoBw'), band: t('pesoBand'), iso: t('pesoIso') }[lt]; return title ? `<div class="eyebrow mt12">${t(title)}</div><div class="small mt8">${body}</div>` : `<div class="small muted mt8">${t('pesoMov')}</div>`; })()}</div></section>
      ${alts.length ? `<section class="sec"><div class="grid2">${alts.join('')}</div></section>` : ''}
      <section class="sec"><div class="card pad" style="border-color:#5a2222"><div class="eyebrow" style="color:var(--bad)">${t('paraY')}</div><div class="small mt8">${t('paraTxt')}</div><button class="btn btn-ghost btn-sm mt12" data-act="help" data-m="${ex.m}" data-ex="${ex.id}">${ic('help')} ${t('pedirAyuda')}</button></div></section>
      <div class="xs faint mt16">${t('revisado')}: ${t('pendienteRev')}.</div>
      <button class="btn btn-lime btn-lg btn-block mt16" data-act="addmine" data-ex="${ex.id}" ${inMine ? 'disabled' : ''}>${ic(inMine ? 'check' : 'plus')} ${inMine ? t('yaEsta') : t('anadir')}</button>
      ${pn}
      ${ctxTo ? `<button class="btn btn-ghost btn-sm mt12" data-act="nav" data-to="${ctxTo}">${ic('back', 14)} ${t('volverA')} ${ctxName}</button>` : ''}
    </div>`;
  }

  function scrMachine(code) {
    const m = G.machine(code.toUpperCase()); if (!m) return scrExplorar('maquina');
    CTX.machine = m.code; CTX.region = null;
    const list = G.exercises.filter((e) => e.where.includes(m.code)).sort((a, b) => ORDER[a.lvl] - ORDER[b.lvl]);
    const main = list[0];
    const altEx = main ? G.exercises.find((e) => e.p[0] === main.p[0] && e.m !== m.code && !e.mov && e.lvl !== 'A') : null;
    const cardio = G.cardio.find((c) => c.m === m.code);
    const ph = m.img ? `<img src="${img(m.img)}" alt="">` : `<div class="mcode"><b>${m.code}</b></div>`;
    return `<div class="screen">${top('', `<button class="iconbtn" data-act="help" data-m="${m.code}" aria-label="${t('pedirAyuda')}">${ic('help')}</button>`)}
      ${!S.auth ? `<div class="tip lime small mb12">${ic('qr')} ${t('desdeQr')}</div>` : ''}
      <div class="hero ${m.prod ? "prod" : m.img ? "kb" : ""}">${ph}<div class="sh"></div><div class="tl"><span class="pill lime">${m.code}</span>${m.img ? `<span class="pill">${ic('play', 11)} ${t('video')}</span>` : ''}</div><div class="in"><div class="eyebrow lime">${t(m.zone === 'fuerza' ? 'zonaFuerza' : m.zone === 'cardio' ? 'zonaCardio' : 'zonaLibre')}</div><h1 class="display h1">${N(m)}</h1></div></div>
      ${m.model ? `<div class="xs muted mt8">${t('modelo')}: ${m.model}</div>` : ''}
      <p class="mt12">${L2(m.desc)}</p>
      ${m.adjust.length ? `<section class="sec"><div class="sec-h"><h2>${t('comoSeAjusta')}</h2></div><div class="card pad"><dl class="kv">${m.adjust.map((a) => `<dt>${S.lang === 'eu' ? a[2] : a[0]}</dt><dd>${S.lang === 'eu' ? a[3] : a[1]}</dd>`).join('')}</dl></div></section>` : ''}
      ${m.stations ? `<section class="sec"><div class="sec-h"><h2>${t('puestos')}</h2><span class="small muted">${m.stations.length}</span></div>${m.stations.map((s, i) => `<div class="card pad mb8"><div class="row"><span class="num">${i + 1}</span><b>${L2(s)}</b></div>${(m.stEx && m.stEx[i] ? m.stEx[i] : []).map((eid) => exRow(G.ex(eid), { sm: true, meta: lvlName(G.ex(eid).lvl) })).join('')}</div>`).join('')}</section>` : ''}
      ${cardio ? `<section class="sec"><div class="sec-h"><h2>${t('protocolos')}</h2></div>${cardio.prot.map((p) => `<button class="exrow" data-act="nav" data-to="#/cardio/${m.code.toLowerCase()}/${p.id}"><span class="num">${p.total}'</span><div class="grow"><b>${N(p)}</b><small>${t(p.kind === 'int' ? 'intervalos' : 'continuo')}</small></div><span class="chev">${ic('chev')}</span></button>`).join('')}</section>` : ''}
      ${list.length && !m.stations ? `<section class="sec"><div class="sec-h"><h2>${t('enEstaMaquina')}</h2><span class="small muted">${list.length} ${t('ejercicios')}</span></div>${list.map((e) => exRow(e, { meta: lvlName(e.lvl) + (e.where !== m.code ? ' · ' + whereLabel(e) : '') })).join('')}</section>` : ''}
      ${altEx ? `<section class="sec"><div class="sec-h"><h2>${t('siOcupada')}</h2></div>${exRow(altEx, { meta: t('alternativa') + ' · ' + whereLabel(altEx) })}</section>` : ''}
      <div class="row mt16"><button class="btn btn-ghost grow" data-act="help" data-m="${m.code}">${ic('help')} ${t('pedirAyuda')}</button><button class="btn btn-ghost" data-act="mqr" data-m="${m.code}">${ic('qr')} ${t('qrMaquina')}</button></div>
      ${!S.auth ? `<button class="btn btn-lime btn-block mt8" data-act="nav" data-to="#/login">${t('abrirApp')}</button>` : ''}
    </div>`;
  }

  const PF = { obj: 'all', days: 0 };
  function scrPlanes() {
    let list = G.plans.filter((p) => (PF.obj === 'all' || p.obj === PF.obj) && (!PF.days || p.days === PF.days));
    return `<div class="screen"><div class="top"><h1 class="display h1 grow" style="margin:0">${t('planes')}</h1></div>
      <div class="chips">${[['all', t('todos')], ...G.objectives.map((o) => [o.id, N(o)])].map(([k, l]) => `<button class="chip ${PF.obj === k ? 'on' : ''}" data-act="pobj" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="chips">${[[0, t('todos')], [2, '2 ' + t('diasSemana')], [3, '3 ' + t('diasSemana')]].map(([k, l]) => `<button class="chip ${PF.days === k ? 'on' : ''}" data-act="pdays" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="mt8">${list.map(planCard).join('')}</div>
    </div>`;
  }

  function scrPlan(id) {
    const p = G.plan(id); if (!p) return scrPlanes();
    const following = S.plan && S.plan.id === p.id;
    const ps = following ? planState() : null;
    const weeks = Object.keys(p.prog).map(Number).sort((a, b) => a - b);
    return `<div class="screen">${top(N(p))}
      <div class="hero wide"><img src="${img(p.img)}" alt=""><div class="sh"></div><div class="in"><div class="eyebrow lime">${N(G.objectives.find((o) => o.id === p.obj))}</div><h1 class="display h1">${N(p)}</h1></div></div>
      <div class="row mt12 wrap"><span class="pill">${p.days} ${t('diasSemana')}</span><span class="pill">${p.min} ${t('min')}</span><span class="pill">${p.weeks} ${t('semanas')}</span>${following ? `<span class="pill lime">${ic('check', 12)} ${t('siguiendo')} · ${t('semana')} ${ps.week}</span>` : ''}</div>
      ${following ? `<div class="row between mt12 mb8"><span class="eyebrow">${t('semanasPlan')} · ${t('estasEn')} ${ps.week}</span><button class="link-s" data-act="planadj">${ic('tool', 13)} ${t('ajustarPlan')}</button></div><div class="wk" aria-label="${t('semanasPlan')}">${Array.from({ length: p.weeks }, (_, i) => `<span class="${i + 1 < ps.week ? 'done' : i + 1 === ps.week ? 'now' : ''}">${i + 1}</span>`).join('')}</div>` : ''}
      <section class="sec"><div class="sec-h"><h2>${t('paraQuien')}</h2></div><p class="small">${L2(p.who)}</p></section>
      <section class="sec"><div class="sec-h"><h2>${t('progresion')}</h2></div><div class="card pad"><ol class="steps">${weeks.map((w) => `<li>${L2(p.prog[w])}</li>`).join('')}</ol>${p.alt ? `<div class="xs muted mt8">${t('alternancia')}</div>` : ''}</div></section>
      <section class="sec"><div class="sec-h"><h2>${t('losDias')}</h2></div>${p.sched.map((d) => `<button class="exrow" data-act="nav" data-to="#/dia/${p.id}/${d.k}"><span class="num">${d.k}</span><div class="grow"><b>${t('dia')} ${d.k}</b><small>${d.main.map(([i]) => N(G.ex(i))).slice(0, 3).join(', ')}${d.main.length > 3 ? ` +${d.main.length - 3}` : ''}</small></div><span class="chev">${ic('chev')}</span></button>`).join('')}</section>
      ${following ? `<button class="btn btn-ghost btn-block mt24" data-act="leaveplan">${t('dejarPlan')}</button>` : `<button class="btn btn-lime btn-lg btn-block mt24" data-act="follow" data-v="${p.id}">${S.plan ? t('cambiarPlan') : t('seguirPlan')}</button>`}
    </div>`;
  }

  function scrDia(pid, k) {
    const p = G.plan(pid); const d = p && p.sched.find((x) => x.k === k); if (!d) return scrPlanes();
    const done = isDoneToday('plan', { plan: pid, k });
    const items = d.main.filter(([, , opt]) => !(S.short && opt));
    const hidden = d.main.length - items.length;
    const block = (title, inner, right = '') => inner ? `<section class="sec"><div class="sec-h"><h2>${title}</h2>${right}</div>${inner}</section>` : '';
    if (S.chk.d !== iso(today())) S.chk = { d: iso(today()), on: {} };
    const ckKey = (id) => `${pid}:${k}:${id}`;
    const nDone = items.filter(([id]) => S.chk.on[ckKey(id)]).length;
    const ck = (id) => { const on = !!S.chk.on[ckKey(id)]; return `<span class="ck ${on ? 'on' : ''}" role="checkbox" aria-checked="${on}" aria-label="${t('hechoCk')}" data-act="chk" data-key="${ckKey(id)}">${ic('check')}</span>`; };
    return `<div class="screen">${top(N(p))}
      <div class="eyebrow lime">${N(p)} · ${p.min} ${t('min')}</div><h1 class="display h1">${t('dia')} ${k}</h1>
      <button class="chip ${S.short ? 'on' : ''}" data-act="short">${ic('clock', 14)} ${t('menosTiempo')}</button>${S.short ? `<div class="xs muted mt8">${t('menosTiempoOn')}${hidden ? ` (${hidden})` : ''}</div>` : ''}
      ${block(t('calentamiento'), d.warm ? `<div class="tip small">${L(d.warm)}</div>` : '')}
      ${block(t('principalBloque'), items.map(([id, dose, opt], i) => exRow(G.ex(id), { num: i + 1, cls: S.chk.on[ckKey(id)] ? 'ckd' : '', meta: dose + (opt ? ` · <span class="lime">${t('opcional')}</span>` : ''), tail: ck(id) })).join(''), `<span class="small muted">${nDone}/${items.length} ${t('hechoCk')}</span>`)}
      ${block(t('cardioBloque'), d.cardio ? `<div class="tip small">${L2(d.cardio)}</div>` : '')}
      ${block(t('vuelta'), d.cool.length ? d.cool.map((id) => exRow(G.ex(id), { sm: true, meta: t('dosisMov') })).join('') : '')}
      <div class="mt24">${done ? `<div class="tip lime center"><b>${ic('check', 16)} ${t('hechoHoy')}</b><div class="xs mt8">${t('leyenda')}</div></div>` : `<button class="btn btn-lime btn-lg btn-block" data-act="doneplan" data-p="${pid}" data-k="${k}">${ic('check')} ${t('marcarHecho')}</button><div class="xs faint mt8 center">${t('leyenda')}</div>`}</div>
    </div>`;
  }

  function scrSesiones() {
    return `<div class="screen"><div class="top"><h1 class="display h1 grow" style="margin:0">${t('sesiones')}</h1></div>
      <section><div class="sec-h"><h2>${t('circuitos')}</h2></div>${G.circuits.map((c) => `<button class="pcard" data-act="nav" data-to="#/circuito/${c.id}"><img src="${img(c.img)}" alt=""><div class="sh"></div><div class="in"><div class="eyebrow lime">${c.min} ${t('min')} · ${c.rounds} ${t('rondas')} · ${c.st.length} ${t('estaciones').toLowerCase()}</div><div class="display">${N(c)}</div></div></button>`).join('')}</section>
      <section class="sec"><div class="sec-h"><h2>${t('cardioMaquina')}</h2></div>${G.cardio.map((c) => { const m = G.machine(c.m); return `<button class="exrow" data-act="nav" data-to="#/cardio/${c.m.toLowerCase()}">${m.img ? `<img class="th sm" src="${img(m.img)}" alt="" style="${m.prod ? "object-fit:contain;background:#eef2f8" : ""}">` : `<span class="num" style="width:46px;height:46px;font-size:1em">${c.m}</span>`}<div class="grow"><b>${N(c)}</b><small>${c.prot.length} ${t('protocolos').toLowerCase()} · ${c.prot.map((p) => p.total).join(' · ')} ${t('min')}</small></div><span class="chev">${ic('chev')}</span></button>`; }).join('')}<div class="tip mt12 small">${t('hablar')}</div></section>
    </div>`;
  }

  function timerHtml() {
    return `<section class="sec"><div class="card timer" id="tm"><div class="eyebrow" id="tm-round"></div><img id="tm-img" class="tm-img" alt="" hidden><div class="time" id="tm-time">0:00</div><div class="lab" id="tm-label"></div><div class="nxt" id="tm-next"></div><div class="bar"><i id="tm-bar"></i></div>
      <div class="tbtns"><button class="btn btn-lime" id="tm-go" data-act="tmgo">${ic('play')} ${t('empezarTimer')}</button><button class="btn btn-ghost" data-act="tmnext">${ic('next')} ${t('siguiente')}</button><button class="btn btn-ghost" data-act="tmreset">${ic('reset')} ${t('reiniciar')}</button></div>
      <div class="xs faint mt12">${t('noArranca')} ${t('pantallaOn')}</div></div></section>`;
  }
  function scrCircuito(id) {
    const c = G.circuits.find((x) => x.id === id); if (!c) return scrSesiones();
    ensureTimer('c:' + id, () => { const segs = []; for (let r = 1; r <= c.rounds; r++) { c.st.forEach((eid, i) => { segs.push({ t: c.work, label: N(G.ex(eid)), work: true, img: G.ex(eid).img, sub: `${t('ronda')} ${r}/${c.rounds} · ${i + 1}/${c.st.length}` }); if (i < c.st.length - 1) segs.push({ t: c.rest, label: t('descanso'), work: false, img: G.ex(c.st[i + 1]).img, sub: `${t('ronda')} ${r}/${c.rounds}` }); }); if (r < c.rounds) segs.push({ t: 60, label: `${t('descanso')} · ${t('ronda')} ${r + 1}`, work: false, img: G.ex(c.st[0]).img, sub: '' }); } return segs; });
    return `<div class="screen">${top(N(c))}
      <div class="hero wide"><img src="${img(c.img)}" alt=""><div class="sh"></div><div class="in"><div class="eyebrow lime">${c.min} ${t('min')} · ${c.rounds} ${t('rondas')} · ${c.work}" ${t('trabajo')} / ${c.rest}" ${t('descanso')}</div><h1 class="display h1">${N(c)}</h1></div></div>
      <p class="small mt12">${L2(c.goal)}</p>
      ${timerHtml()}
      <section class="sec"><div class="sec-h"><h2>${t('estaciones')}</h2></div>${c.st.map((eid, i) => exRow(G.ex(eid), { num: i + 1, sm: true, meta: `${c.work}" · ${whereLabel(G.ex(eid))}` })).join('')}</section>
    </div>`;
  }
  function scrCardio(code, pid) {
    const c = G.cardio.find((x) => x.m === code.toUpperCase()); if (!c) return scrSesiones();
    const m = G.machine(c.m);
    if (!pid) return `<div class="screen">${top(N(c))}
      <div class="hero wide ${m.prod ? "prod" : m.img ? "kb" : ""}">${m.img ? `<img src="${img(m.img)}" alt="">` : `<div class="mcode"><b>${m.code}</b></div>`}<div class="sh"></div><div class="in"><div class="eyebrow lime">${m.code} · ${t('cardioMaquina')}</div><h1 class="display h1">${N(c)}</h1></div></div>
      <section class="sec"><div class="sec-h"><h2>${t('tecnica')}</h2></div><div class="tip small">${L2(c.tech)}</div></section>
      <section class="sec"><div class="sec-h"><h2>${t('protocolos')}</h2></div>${c.prot.map((p) => `<button class="exrow" data-act="nav" data-to="#/cardio/${code}/${p.id}"><span class="num">${p.total}'</span><div class="grow"><b>${N(p)}</b><small>${t(p.kind === 'int' ? 'intervalos' : 'continuo')} · ${p.steps.length} ${p.steps.length > 1 ? 'bloques' : 'bloque'}</small></div><span class="chev">${ic('chev')}</span></button>`).join('')}</section>
      <div class="tip mt16 small">${t('hablar')}</div><button class="btn btn-ghost btn-block mt12" data-act="nav" data-to="#/m/${code}">${t('verMaquina')}</button></div>`;
    const p = c.prot.find((x) => x.id === pid); if (!p) return scrCardio(code);
    const restRe = /pausa|suave|leun|etena|para|gelditu|normal|camina|ibili|calma|lasai/i;
    ensureTimer('p:' + pid, () => p.steps.map(([sec, es, eu]) => { const label = S.lang === 'eu' ? eu : es; return { t: sec, label, work: !restRe.test(label), sub: '' }; }));
    return `<div class="screen">${top(N(c))}
      <div class="eyebrow lime">${N(c)} · ${t(p.kind === 'int' ? 'intervalos' : 'continuo')} · ${p.total} ${t('min')}</div><h1 class="display h1">${N(p)}</h1>
      <div class="tip small">${L2(c.tech)}</div>
      ${timerHtml()}
      <section class="sec"><div class="card">${p.steps.map(([sec, es, eu], i) => `<div class="notice"><span class="num" style="width:52px;height:30px;border-radius:9px;background:var(--card-2);color:var(--lime);font-family:var(--f-mono);font-size:.8em;display:grid;place-items:center;flex:none">${mmss(sec)}</span><div class="small grow">${S.lang === 'eu' ? eu : es}</div></div>`).join('')}</div></section>
    </div>`;
  }

  function scrYo() {
    const month = iso(today()).slice(0, 7);
    const days = Object.keys(S.done).filter((d) => d.startsWith(month) && S.done[d].length).length;
    const item = (to, icon, title, sub) => `<button class="set" data-act="nav" data-to="${to}"><span class="row"><span class="iconbtn">${ic(icon)}</span><span><b>${title}</b><br><small class="muted">${sub}</small></span></span>${ic('chev')}</button>`;
    return `<div class="screen"><div class="top"><h1 class="display h1 grow" style="margin:0">${t('yo')}</h1></div>
      ${isClub() ? `<section class="card carnet pad"><div class="eyebrow lime">${t('cuentaClub')}</div><div class="display h2">Padel Indoor Oarso</div><div class="small muted">${t('cuentaClubTxt')}</div><a class="btn btn-lime btn-block mt12" href="panel/">${ic('tool')} ${t('abrirPanel')}</a></section>` : `<section class="card carnet pad"><div class="row between"><div><div class="eyebrow lime">${t('socio')} · nº ${socioNum()}</div><div class="display h2">${socioName()}</div><div class="small muted">${t('cuota')} · ${t('hasta')} ${endOfMonth()}</div></div><button class="iconbtn lime" data-act="nav" data-to="#/carnet">${ic('qr')}</button></div></section>`}
      <div class="card mt16">
        ${item('#/mi', 'list', t('miEntreno'), `${S.mine.length} ${t('ejercicios')}`)}
        ${item('#/dias', 'cal', t('misDias'), `${days} ${t('diasVenidos')}`)}
        ${item('#/carnet', 'id', t('carnet'), t('enseñar').split('.')[0])}
        ${item('#/ajustes', 'tool', t('ajustes'), `${t('idioma')} · ${t('tamano')} · ${t('privacidad')}`)}
      </div>
      <div class="xs faint mt16 center">${t('demoTag')} · ${VERSION}</div>
    </div>`;
  }

  function scrMi() {
    const done = isDoneToday('mine');
    const rows = S.mine.map((it, i) => { const ex = G.ex(it.ex); return `<div class="mine"><div class="row"><span class="num">${i + 1}</span><img src="${img(ex.img)}" style="width:46px;height:46px;border-radius:10px;object-fit:cover;flex:none" alt=""><button class="grow" data-act="nav" data-to="#/e/${ex.id}" style="color:#fff"><b style="display:block;line-height:1.2">${N(ex)}</b><small class="muted">${whereLabel(ex)} · ${G.fichas[ex.id] ? G.fichas[ex.id].dosis.split('·')[0] : t('dosis' + ex.lvl).split('·')[0]}</small></button></div>
      ${it.note ? `<button class="notebox" data-act="editnote" data-i="${i}"><span class="eyebrow lime">${t('nota')}</span><div>${esc(it.note)}</div></button>` : `<button class="chip noprint" data-act="editnote" data-i="${i}" style="margin-top:8px">${ic('plus', 14)} ${t('anadirNota')}</button>`}
      <div class="acts noprint"><button data-act="mup" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="${t('subir')}">${ic('up')}</button><button data-act="mdown" data-i="${i}" ${i === S.mine.length - 1 ? 'disabled' : ''} aria-label="${t('bajar')}">${ic('down')}</button><button data-act="mdup" data-i="${i}" aria-label="${t('duplicar')}">${ic('copy')}</button><button data-act="mdel" data-i="${i}" aria-label="${t('quitar')}">${ic('trash')}</button></div></div>`; }).join('');
    return `<div class="screen">${top(t('miEntreno'), `<button class="iconbtn noprint" data-act="print" aria-label="${t('pdf')}">${ic('dl')}</button>`)}
      <h1 class="display h1">${t('miEntreno')}</h1>
      ${S.mine.length ? rows : `<div class="card pad center"><div class="display h2">${t('vacio')}</div><div class="small muted">${t('vacioTxt')}</div></div>`}
      <div class="row mt16 noprint"><button class="btn btn-ghost grow" data-act="copyday">${ic('copy')} ${t('copiarDia')}</button><button class="btn btn-ghost" data-act="nav" data-to="#/explorar">${ic('plus')}</button></div>
      ${S.mine.length ? (done ? `<div class="tip lime center mt12 noprint"><b>${ic('check', 16)} ${t('hechoHoy')}</b></div>` : `<button class="btn btn-lime btn-lg btn-block mt12 noprint" data-act="donemine">${ic('check')} ${t('hechoHoy')}</button>`) : ''}
      <div class="xs faint mt12 center noprint">${t('leyenda')}</div>
    </div>`;
  }

  function calendar(y, m) {
    const first = new Date(y, m, 1); const start = (first.getDay() + 6) % 7; const n = new Date(y, m + 1, 0).getDate(); const tod = iso(today());
    let cells = t('lunes').map((d) => `<div class="dh">${d}</div>`).join('');
    for (let i = 0; i < start; i++) cells += '<div></div>';
    for (let d = 1; d <= n; d++) { const k = iso(new Date(y, m, d)); const has = (S.done[k] || []).length; cells += has ? `<button class="d has ${k === tod ? 'today' : ''}" data-act="day" data-d="${k}" aria-label="${d}">${d}</button>` : `<div class="d ${k === tod ? 'today' : ''} ${k > tod ? 'off' : ''}">${d}</div>`; }
    return `<div class="card pad"><div class="row between mb8"><b style="text-transform:capitalize">${t('meses')[m]} ${y}</b></div><div class="cal">${cells}</div></div>`;
  }
  function scrDias() {
    const d = today(); const month = iso(d).slice(0, 7);
    const days = Object.keys(S.done).filter((k) => k.startsWith(month) && S.done[k].length).length;
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return `<div class="screen">${top(t('misDias'))}
      <div class="row" style="align-items:flex-end;gap:12px"><div class="bignum">${days}</div><div class="muted" style="padding-bottom:6px">${t('diasVenidos')}</div></div>
      <div class="mt16">${calendar(d.getFullYear(), d.getMonth())}</div>
      <div class="mt12">${calendar(prev.getFullYear(), prev.getMonth())}</div>
      <div class="tip mt12 small">${ic('shield')} ${t('leyenda')}</div>
    </div>`;
  }

  function scrCarnet() {
    if (isClub()) return `<div class="screen">${top(t('carnet'))}
      <section class="card carnet pad"><div class="eyebrow lime">${t('cuentaClub')}</div><div class="display h1">Padel Indoor Oarso</div><div class="small muted mt8">${t('cuentaClubTxt')}</div></section>
      <div class="card pad mt12 small muted">${t('sinDocsClub')}</div>
      <a class="btn btn-lime btn-lg btn-block mt12" href="panel/">${ic('tool')} ${t('abrirPanel')}</a></div>`;
    const a = S.auth || {}; const d0 = a.docs || {}; const tf = tarifaDe(a.tarifa);
    const rows = [['cuota', 'check', t('cuota'), `${tf ? N(tf) + ' · ' : ''}${t('hasta')} ${endOfMonth()}`], d0.aptitud ? ['aptitud', 'doc', t('declaracion'), `${dmyIso(d0.aptitud)} · ${t('caduca')} ${dmyIso(d0.aptitud, 12)}`] : null, d0.normas ? ['normas', 'shield', t('normas'), dmyIso(d0.normas)] : null, d0.sepa ? ['sepa', 'doc', t('docSepa'), `${dmyIso(d0.sepa)} · IBAN ····${a.iban4 || ''}`] : null, d0.imagen ? ['imagen', 'doc', t('docImagen'), dmyIso(d0.imagen)] : null].filter(Boolean);
    return `<div class="screen">${top(t('carnet'))}
      <section class="card carnet pad"><div class="eyebrow lime">${t('socio')} · nº ${socioNum()}</div><div class="display h1">${socioName()}</div>
        <button class="qrbox mt12" id="qr" data-act="bigqr" aria-label="${t('verGrande')}"></button>
        <div class="small muted mt12 center">${t('enseñar')} <span class="lime">${t('verGrande')}</span></div></section>
      <div class="sec-h mt16"><h2>${t('misDocs')}</h2><span class="small muted">PDF</span></div>
      <div class="card">${rows.map(([k, i, title, sub]) => `<button class="set" data-act="nav" data-to="#/doc/${k}"><span class="row"><span class="iconbtn" style="color:var(--ok)">${ic(i)}</span><span><b>${title}</b><br><small class="muted">${sub}</small></span></span><span class="pill">${ic('doc', 12)} PDF</span></button>`).join('')}</div>
      <div class="xs faint mt8">${t('custodia')}</div>
    </div>`;
  }
  function drawQr() { const el = $('#qr'); if (el) el.innerHTML = qrSvg('OARSO-GYM-' + socioNum(), 'M'); }

  // ---------- pegatinas QR para las máquinas (hoja imprimible para el club) ----------
  function scrPegatinas() {
    const list = G.machines.filter((m) => m.zone !== 'libre' || ['P1', 'P2', 'F4'].includes(m.code));
    const base = location.origin + location.pathname;
    return `<div class="screen">${top(t('pegatinas'), `<button class="iconbtn noprint" data-act="print" aria-label="${t('imprimir')}">${ic('dl')}</button>`)}
      <h1 class="display h1 noprint">${t('pegatinas')}</h1><p class="small muted noprint">${t('pegatinasTxt')}</p>
      <div class="stks mt12">${list.map((m) => `<div class="stk"><div class="stk-top"><span class="stk-code">${m.code}</span><span class="stk-logo"><span class="mark">O</span>Oarso <b>Gym</b></span></div><div class="stk-qr" data-url="${base}#/m/${m.code.toLowerCase()}"></div><div class="stk-name">${m.es}<br><span class="stk-eu">${m.eu}</span></div><div class="stk-txt">Escanea y mira cómo se usa · Eskaneatu eta ikusi nola erabiltzen den</div><div class="stk-url">${base.replace(/^https?:\/\//, '')}#/m/${m.code.toLowerCase()}</div></div>`).join('')}</div>
      <button class="btn btn-lime btn-lg btn-block mt16 noprint" data-act="print">${ic('dl')} ${t('imprimir')}</button>
    </div>`;
  }
  function drawStickers() { document.querySelectorAll('.stk-qr[data-url]').forEach((el) => { el.innerHTML = qrSvg(el.dataset.url, 'H'); }); }

  // ---------- cuentas: acceso, registro con firmas y domiciliación, cuenta de gestión del club ----------
  // En la demo las cuentas viven en el navegador. En la app real: Supabase Auth, contraseñas nunca en claro (07 § 11).
  const ACCK = 'oarsogym.accounts';
  const DEMO_ACC = {
    'naia@demo.oarso': { pass: 'demo1234', role: 'socio', nombre: 'Naia', apellidos: 'Alberdi', num: '0421', tarifa: 'club', iban4: '1332', titular: 'Naia Alberdi', docs: { normas: '2026-11-03T18:43:00', aptitud: '2026-11-03T18:41:00', imagen: '2026-11-03T18:44:00', sepa: '2026-11-03T18:45:00' }, sig: null, parq: 'apto', demo: true },
    'club@oarso': { pass: 'club1234', role: 'club', nombre: 'Oarso', apellidos: '', num: 'CLUB', tarifa: null, docs: {}, sig: null, demo: true },
  };
  const accStore = () => { try { return JSON.parse(localStorage.getItem(ACCK)) || {}; } catch (e) { return {}; } };
  const accAll = () => Object.assign({}, DEMO_ACC, accStore());
  function accPut(email, acc) { const a = accStore(); a[email] = acc; try { localStorage.setItem(ACCK, JSON.stringify(a)); } catch (e) {} }
  function tarifas() { try { const x = JSON.parse(localStorage.getItem('oarsogym.tarifas')); if (Array.isArray(x) && x.length) return x; } catch (e) {} return [{ id: 'club', es: 'Socio del club · gimnasio', eu: 'Klubeko bazkidea · gimnasioa', precio: 25, nota_es: 'Para quien ya es socio del club de pádel', nota_eu: 'Dagoeneko padel-klubeko bazkidea denarentzat' }, { id: 'gym', es: 'Solo gimnasio', eu: 'Gimnasioa bakarrik', precio: 35, nota_es: 'Sin cuota de pádel', nota_eu: 'Padel-kuotarik gabe' }]; }
  const tarifaDe = (id) => tarifas().find((x) => x.id === id) || null;
  const isClub = () => !!(S.auth && S.auth.role === 'club');
  const socioNum = () => (S.auth && S.auth.num) || '0421';
  const dmyIso = (s, addMonths = 0) => { if (!s) return ''; const d = new Date(s); if (addMonths) d.setMonth(d.getMonth() + addMonths); return dmy(d); };
  const hmIso = (s) => (s ? hm(new Date(s)) : '');
  const endOfMonth = () => { const d = today(); return dmy(new Date(d.getFullYear(), d.getMonth() + 1, 0)); };
  const SEPA_TXT = 'Mediante la firma de este mandato, el deudor autoriza a Padel Indoor Oarso a enviar instrucciones a su entidad para adeudar en su cuenta y a la entidad para efectuar los adeudos siguiendo las instrucciones del acreedor. Como parte de sus derechos, el deudor está legitimado al reembolso por su entidad en los términos y condiciones del contrato suscrito con la misma. La solicitud de reembolso deberá efectuarse dentro de las ocho semanas que siguen a la fecha de adeudo en cuenta. Tipo de pago: recurrente. La cuota mensual de la tarifa elegida se carga el día 1 de cada mes.';
  const IMAGEN_TXT = 'Autorizo a Padel Indoor Oarso a captar y utilizar mi imagen en fotografías y vídeos realizados en el gimnasio, exclusivamente para las fichas de ejercicios de la aplicación Oarso Gym y las redes sociales del club, sin límite temporal y sin contraprestación. Puedo retirar esta autorización en cualquier momento en recepción; la retirada no afecta a los usos anteriores.';
  function doLogin(email, pass) { email = (email || '').trim().toLowerCase(); const acc = accAll()[email]; if (!acc || acc.pass !== pass) return false; S.auth = Object.assign({ email }, acc); delete S.auth.pass; S.name = acc.nombre; save(); return true; }
  function doLogout() { const keep = { lang: S.lang, size: S.size, motion: S.motion }; S = Object.assign(defaults(), keep); save(); stopTimer(); closeSheet(); nav('#/login'); }
  const ibanOk = (s) => { s = (s || '').replace(/\s+/g, '').toUpperCase(); if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false; const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55)); let m = 0; for (const ch of r) m = (m * 10 + +ch) % 97; return m === 1; };
  function regCreate() {
    const R = S.reg; const now = new Date().toISOString(); const store = accStore(); const num = String(422 + Object.keys(store).length).padStart(4, '0'); const email = R.email.trim().toLowerCase();
    const acc = { pass: R.pass, role: 'socio', nombre: R.nombre.trim(), apellidos: R.apellidos.trim(), num, tarifa: R.tarifa || (R.club ? 'club' : 'gym'), iban4: R.iban.replace(/\s+/g, '').slice(-4), titular: (R.titular || '').trim(), movil: R.movil || '', nac: R.nac || '', docs: { normas: now, aptitud: now, sepa: now, imagen: R.ok && R.ok.imagen ? now : null }, sig: R.sig || null, parq: (R.parq || []).some((v) => v === true) ? 'valoracion' : 'apto', alta: now, demo: false };
    accPut(email, acc); S.auth = Object.assign({ email }, acc); delete S.auth.pass; S.name = acc.nombre; S.reg = {}; S.onboarded = false; S.plan = null; S.done = {}; S.mine = []; S.inc = []; save();
  }
  const loginBar = () => `<div class="loginbar"><button class="btn btn-lime grow" data-act="nav" data-to="#/login">${t('login')}</button><button class="btn btn-ghost" data-act="nav" data-to="#/registro/1">${t('crearCuenta')}</button></div>`;
  function scrLogin() {
    return `<div class="onb"><div class="art" style="aspect-ratio:4/2.4"><img src="${img(12)}" alt=""><div class="sh"></div><div class="logo"><span class="mark">O</span><span class="wm">Oarso <b>Gym</b></span></div></div>
      <h1 class="display h1 mt16">${t('loginT')}</h1>
      <label class="fld"><span>${t('correo')}</span><input class="input" id="lg-email" type="email" autocomplete="username" inputmode="email" autocapitalize="off"></label>
      <label class="fld"><span>${t('contrasena')}</span><input class="input" id="lg-pass" type="password" autocomplete="current-password"></label>
      <div class="xs mt8" style="color:var(--bad);min-height:16px" id="lg-err"></div>
      <button class="btn btn-lime btn-lg btn-block" data-act="login">${t('login')}</button>
      <button class="btn btn-ghost btn-block mt8" data-act="olvide">${t('olvide')}</button>
      <div class="sep"><span>${t('sinCuenta')}</span></div>
      <button class="btn btn-dark btn-block" data-act="nav" data-to="#/registro/1">${ic('plus')} ${t('crearCuenta')}</button>
      <div class="xs muted mt8 center">${t('recepcionAlta')}</div>
      <div class="grow"></div>
      <div class="row mt16 wrap" style="justify-content:center;gap:6px"><span class="xs faint">${t('probarComo')}:</span><button class="chip" data-act="demofill" data-v="naia@demo.oarso|demo1234">${t('demoSocia')}</button><button class="chip" data-act="demofill" data-v="club@oarso|club1234">${t('demoClub')}</button></div>
      <div class="row mt8" style="justify-content:center;gap:6px">${[['es', 'Castellano'], ['eu', 'Euskara']].map(([k, l]) => `<button class="chip ${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}">${l}</button>`).join('')}</div>
    </div>`;
  }
  function scrRegistro(step) {
    const R = S.reg || (S.reg = {}); R.ok = R.ok || {};
    const head = (n, title) => `<div class="top"><button class="iconbtn" data-act="back" aria-label="${t('volver')}">${ic('back')}</button><div class="grow"><div class="eyebrow lime">${t('paso')} ${n}/4</div><div class="ttl">${title}</div></div></div><div class="dots mb12">${[1, 2, 3, 4].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
    const fld = (k, label, type = 'text', extra = '') => `<label class="fld"><span>${label}</span><input class="input" data-reg="${k}" type="${type}" value="${esc(R[k] || '')}" ${extra}></label>`;
    if (step === '1') return `<div class="screen">${head(1, t('reg1'))}
      ${fld('nombre', t('nombre'), 'text', 'autocomplete="given-name"')}${fld('apellidos', t('apellidos'), 'text', 'autocomplete="family-name"')}${fld('email', t('correo'), 'email', 'autocomplete="email" inputmode="email" autocapitalize="off"')}${fld('movil', t('movil'), 'tel', 'autocomplete="tel" inputmode="tel"')}${fld('nac', t('nacimiento'), 'date', '')}${fld('pass', t('contrasena'), 'password', 'autocomplete="new-password"')}${fld('pass2', t('repetirPass'), 'password', 'autocomplete="new-password"')}
      <button class="set card mt12" data-act="regtoggle" data-k="club" role="switch" aria-checked="${!!R.club}"><span class="row"><span class="iconbtn">${ic('star')}</span><b>${t('soyClub')}</b></span><span class="switch ${R.club ? 'on' : ''}"></span></button>
      <div class="xs mt8" style="color:var(--bad);min-height:16px" id="reg-err"></div>
      <button class="btn btn-lime btn-lg btn-block mt8" data-act="reg1">${t('siguiente')} ${ic('chev')}</button></div>`;
    if (step === '2') { const T = tarifas(); const sel = R.tarifa || (R.club ? 'club' : 'gym'); return `<div class="screen">${head(2, t('reg2'))}<p class="small muted">${t('tarifaTxt')}</p>
      <div class="col mt12" style="gap:8px">${T.map((x) => `<button class="opt ${sel === x.id ? 'on' : ''}" data-act="regtarifa" data-v="${x.id}"><span class="radio"></span><span class="grow"><b>${N(x)}</b><br><small class="muted">${S.lang === 'eu' ? x.nota_eu : x.nota_es}</small></span><span class="display" style="font-size:1.5em;color:var(--lime)">${x.precio}<small style="font-size:.5em;color:var(--muted)"> ${t('alMes')}</small></span></button>`).join('')}</div>
      <div class="xs faint mt8">${t('ejemploPrecio')}</div>
      <button class="btn btn-lime btn-lg btn-block mt16" data-act="reg2" data-v="${sel}">${t('siguiente')} ${ic('chev')}</button></div>`; }
    if (step === '3') { const P = R.parq || []; const ok = R.ok; const tf = tarifaDe(R.tarifa || (R.club ? 'club' : 'gym'));
      return `<div class="screen">${head(3, t('reg3'))}<p class="small muted">${t('docsTxt')}</p>
      <section class="card pad mt12"><div class="row between"><b>${t('docNormas')}</b><button class="btn btn-ghost btn-sm" data-act="leer" data-v="normas">${t('leer')}</button></div><label class="ckl mt8"><input type="checkbox" data-ok="normas" ${ok.normas ? 'checked' : ''}> ${t('aceptoDoc')}</label></section>
      <section class="card pad mt12"><b>${t('docAptitud')}</b><div class="small muted mt8 mb8">${t('aptitudTxt')}</div>${PARQ.map((q, i) => `<div class="yn"><span class="grow small">${i + 1}. ${q}</span><div class="seg"><button class="${P[i] === true ? 'on' : ''}" data-act="parq" data-i="${i}" data-v="1">${t('si')}</button><button class="${P[i] === false ? 'on' : ''}" data-act="parq" data-i="${i}" data-v="0">${t('no')}</button></div></div>`).join('')}${P.some((v) => v === true) ? `<div class="tip warn small mt8">${t('necesitaVal')}</div>` : ''}<label class="ckl mt12"><input type="checkbox" data-ok="aptitud" ${ok.aptitud ? 'checked' : ''}> ${t('aceptoDoc')}</label></section>
      <section class="card pad mt12"><div class="row between"><b>${t('docImagen')}</b><span class="pill">${t('opcional')}</span></div><div class="small muted mt8">${t('imagenTxt')}</div><label class="ckl mt8"><input type="checkbox" data-ok="imagen" ${ok.imagen ? 'checked' : ''}> ${t('aceptoDoc')}</label></section>
      <section class="card pad mt12"><b>${t('sepaT')}</b><div class="small muted mt8">${t('sepaTxt')} <b class="lime">${tf ? tf.precio + ' ' + t('alMes') : ''}</b></div>${fld('titular', t('titular'), 'text', 'autocomplete="name"')}${fld('iban', t('iban'), 'text', 'inputmode="text" autocapitalize="characters" spellcheck="false" placeholder="ES00 0000 0000 0000 0000 0000"')}<div class="xs faint mt8">${t('ibanDemo')}</div><label class="ckl mt8"><input type="checkbox" data-ok="sepa" ${ok.sepa ? 'checked' : ''}> ${t('aceptoDoc')}</label></section>
      <section class="card pad mt12"><b>${t('firma')}</b><div class="small muted mt8">${t('firmaTxt')}</div><div class="sigpad mt8"><canvas id="sigc" width="700" height="240"></canvas></div><button class="btn btn-ghost btn-sm mt8" data-act="sigclear">${t('borrarFirma')}</button></section>
      <div class="xs mt12" style="color:var(--bad);min-height:16px" id="reg-err"></div>
      <button class="btn btn-lime btn-lg btn-block mt8" data-act="reg3">${ic('check')} ${t('firmarTodo')}</button></div>`; }
    const a = S.auth; if (!a) return scrLogin();
    const dn = { normas: 'docNormas', aptitud: 'docAptitud', imagen: 'docImagen', sepa: 'docSepa' };
    return `<div class="screen">${head(4, t('reg4'))}<div class="help-ok"><div class="big">${ic('check', 30)}</div><div class="display h1">${t('creada')}</div><p class="small muted">${t('creadaTxt')}</p></div>
      <div class="card mt12"><div class="set"><span class="row"><span class="iconbtn lime">${ic('id')}</span><span><b>${t('numSocio')} ${a.num}</b><br><small class="muted">${a.nombre} ${a.apellidos} · ${a.email}</small></span></span></div>${['normas', 'aptitud', 'imagen', 'sepa'].filter((k) => a.docs[k]).map((k) => `<div class="set"><span class="row"><span class="iconbtn" style="color:var(--ok)">${ic('doc')}</span><span><b>${t(dn[k])}</b><br><small class="muted">${t('firmado')} ${dmyIso(a.docs[k])} · ${hmIso(a.docs[k])}</small></span></span><span class="pill">PDF</span></div>`).join('')}</div>
      <button class="btn btn-lime btn-lg btn-block mt16" data-act="nav" data-to="#/onb/1">${t('entrarApp')} ${ic('chev')}</button></div>`;
  }
  let SIGH = null;
  function initSig() {
    const c = $('#sigc'); if (!c) return; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#1b2a6b';
    if (S.reg.sig) { const im = new Image(); im.onload = () => g.drawImage(im, 0, 0); im.src = S.reg.sig; }
    if (SIGH) { SIGH.forEach(([ev, fn]) => window.removeEventListener(ev, fn)); SIGH = null; }
    let drawing = false;
    const pt = (ev) => { const r = c.getBoundingClientRect(); const s = ev.touches ? ev.touches[0] : ev; return [(s.clientX - r.left) * c.width / r.width, (s.clientY - r.top) * c.height / r.height]; };
    const down = (ev) => { drawing = true; const [x, y] = pt(ev); g.beginPath(); g.moveTo(x, y); g.lineTo(x + .1, y + .1); g.stroke(); if (ev.cancelable) ev.preventDefault(); };
    const move = (ev) => { if (!drawing) return; const [x, y] = pt(ev); g.lineTo(x, y); g.stroke(); if (ev.cancelable) ev.preventDefault(); };
    const up = () => { if (!drawing) return; drawing = false; S.reg.sig = c.toDataURL('image/png'); save(); };
    if (window.PointerEvent) { c.onpointerdown = down; SIGH = [['pointermove', move], ['pointerup', up], ['pointercancel', up]]; }
    else { c.onmousedown = down; c.ontouchstart = down; c.ontouchmove = move; c.ontouchend = up; SIGH = [['mousemove', move], ['mouseup', up]]; }
    SIGH.forEach(([ev, fn]) => window.addEventListener(ev, fn, { passive: false }));
  }

  // ---------- ajustar el plan en curso: objetivo y días a la semana, cuando se quiera ----------
  const PA = { obj: null, days: null };
  function planAdjust() {
    const cur = S.plan ? G.plan(S.plan.id) : null;
    if (PA.obj === null) { PA.obj = cur ? cur.obj : 'empezar'; PA.days = cur ? cur.days : 2; }
    const target = G.plans.find((p) => p.obj === PA.obj && p.days === PA.days) || G.plans[0];
    sheet(`<div class="eyebrow lime">${t('ajustarPlan')}</div><div class="display h2">${N(target)}</div>
      <div class="eyebrow mt12 mb8">${t('objetivo')}</div><div class="chips">${G.objectives.map((o) => `<button class="chip ${PA.obj === o.id ? 'on' : ''}" data-act="paobj" data-v="${o.id}">${N(o)}</button>`).join('')}</div>
      <div class="eyebrow mt12 mb8">${t('diasSemana')}</div><div class="seg">${[2, 3].map((d) => `<button class="${PA.days === d ? 'on' : ''}" data-act="padays" data-v="${d}">${d} ${t('diasSemana')}</button>`).join('')}</div>
      <div class="card soft pad mt12"><div class="row between"><b>${N(target)}</b><span class="pill">${target.min} ${t('min')} · ${target.weeks} ${t('semanas')}</span></div><div class="small muted mt8">${L2(target.who).split('.')[0]}.</div></div>
      <div class="xs muted mt8">${t('cambioObjetivo')}</div>
      <button class="btn btn-lime btn-lg btn-block mt12" data-act="pasave" data-v="${target.id}">${ic('check')} ${t('guardarCambios')}</button>
      <button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cancelar')}</button>`);
  }

  // ---------- instalación como app ----------
  let IP = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); IP = e; });
  function installSheet() {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent); const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    sheet(`<div class="eyebrow lime">${t('instalar')}</div><div class="display h2">Oarso Gym</div><p class="small mt8">${t('instalarTxt')}</p>${standalone ? `<div class="tip lime mt12">${ic('check')} ${t('instalada')}</div>` : IP ? `<button class="btn btn-lime btn-lg btn-block mt12" data-act="installgo">${ic('dl')} ${t('instalarBtn')}</button>` : `<div class="tip mt12 small">${ios ? t('instalarIos') : t('instalarAnd')}</div>`}<button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cerrar')}</button>`);
  }

  function scrAjustes() {
    const sw = (k, on) => { const icon = { sound: 'sound', vib: 'vib', motion: 'reset' }[k]; const label = { sound: 'sonidos', vib: 'vibracion', motion: 'motion' }[k]; return `<button class="set" data-act="toggle" data-k="${k}" role="switch" aria-checked="${on}"><span class="row"><span class="iconbtn">${ic(icon)}</span><b>${t(label)}</b></span><span class="switch ${on ? 'on' : ''}"></span></button>`; };
    const link = (to, icon, l) => `<button class="set" data-act="nav" data-to="${to}"><span class="row"><span class="iconbtn">${ic(icon)}</span><b>${l}</b></span>${ic('chev')}</button>`;
    return `<div class="screen">${top(t('ajustes'))}<h1 class="display h1">${t('ajustes')}</h1>
      <div class="card pad"><div class="row between mb8"><b class="row">${ic('lang')} ${t('idioma')}</b></div><div class="seg">${[['es', 'Castellano'], ['eu', 'Euskara']].map(([k, l]) => `<button class="${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}">${l}</button>`).join('')}</div>
        <div class="row between mb8 mt16"><b class="row">${ic('text')} ${t('tamano')}</b></div><div class="seg">${[[0, 'normal'], [1, 'grande'], [2, 'muyGrande']].map(([k, l]) => `<button class="${S.size === k ? 'on' : ''}" data-act="size" data-v="${k}">${t(l)}</button>`).join('')}</div></div>
      <div class="card mt12">${sw('sound', S.sound)}${sw('vib', S.vib)}${sw('motion', !S.motion)}</div>
      <div class="card mt12"><button class="set" data-act="install"><span class="row"><span class="iconbtn lime">${ic('dl')}</span><span><b>${t('instalar')}</b><br><small class="muted">${t('sinCobertura')}</small></span></span>${ic('chev')}</button>${link('#/pegatinas', 'qr', t('pegatinas'))}</div>
      <div class="card mt12">${link('#/legal', 'doc', t('legal'))}${link('#/privacidad', 'shield', t('privacidad'))}<button class="set" data-act="export"><span class="row"><span class="iconbtn">${ic('dl')}</span><b>${t('exportar')}</b></span>${ic('chev')}</button></div>
      <div class="card mt12"><button class="set" data-act="logout"><span class="row"><span class="iconbtn">${ic('user')}</span><span><b>${t('cerrarSesion')}</b><br><small class="muted">${S.auth ? S.auth.email : ''}</small></span></span>${ic('chev')}</button><button class="set" data-act="confirmreset" data-v="cuenta"><span class="row"><span class="iconbtn" style="color:var(--bad)">${ic('trash')}</span><b style="color:var(--bad)">${t('borrar')}</b></span></button><button class="set" data-act="confirmreset" data-v="demo"><span class="row"><span class="iconbtn">${ic('reset')}</span><b>${t('borrarDemo')}</b></span></button></div>
      <div class="xs faint mt16 center">Oarso Gym · ${t('version')} ${VERSION} · ${t('demoTag')}</div>
    </div>`;
  }
  const scrText = (title, body) => `<div class="screen">${top(title)}<h1 class="display h1">${title}</h1><div class="card pad"><p class="small" style="line-height:1.6">${body}</p></div></div>`;

  // ---------- primer uso ----------
  function scrOnb(step) {
    if (step === '2') {
      const a = S.ans; const sug = suggest();
      const chips = (k, arr, labels) => `<div class="chips">${arr.map((v, i) => `<button class="chip ${a[k] === v ? 'on' : ''}" data-act="ans" data-k="${k}" data-v="${v}">${labels[i]}</button>`).join('')}</div>`;
      return `<div class="onb"><div class="dots"><i class="on"></i><i class="on"></i></div>
        <div class="eyebrow lime mt16">${t('obOpc')}</div>
        <div class="mt16"><b>${t('obQ1')}</b>${chips('exp', [0, 1, 2], t('obQ1a'))}</div>
        <div class="mt12"><b>${t('obQ2')}</b>${chips('obj', G.objectives.map((o) => o.id), G.objectives.map((o) => N(o)))}</div>
        <div class="mt12"><b>${t('obQ3')}</b>${chips('days', [2, 3], ['2', '3'])}</div>
        <div class="card pad mt16"><div class="eyebrow lime">${t('obSug')}</div><div class="display h2">${N(sug)}</div><div class="small muted">${sug.days} ${t('diasSemana')} · ${sug.min} ${t('min')} · ${sug.weeks} ${t('semanas')}</div></div>
        <div class="grow"></div>
        <button class="btn btn-lime btn-lg btn-block mt16" data-act="finish">${t('obEntrar')}</button>
        <button class="btn btn-ghost btn-block mt8" data-act="finish" data-skip="1">${t('obSaltar')}</button>
        <div class="xs faint mt12 center">${t('obPriv')}</div></div>`;
    }
    return `<div class="onb"><div class="art"><img src="${img(16)}" alt=""><div class="sh"></div><div class="logo"><span class="mark">O</span><span class="wm">Oarso <b>Gym</b></span></div></div>
      <h1 class="display h1 mt16">${t('ob1')}</h1><p class="small muted">${t('ob1t')}</p>
      <div class="eyebrow mt16 mb8">${t('obIdioma')}</div>
      <div class="col" style="gap:8px">${[['es', 'Castellano'], ['eu', 'Euskara']].map(([k, l]) => `<button class="opt ${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}"><span class="radio"></span><b>${l}</b></button>`).join('')}</div>
      <div class="grow"></div>
      <div class="xs faint mt12">${ic('shield', 12)} ${t('obPriv')}</div>
      <button class="btn btn-lime btn-lg btn-block mt12" data-act="nav" data-to="#/onb/2">${t('obSeguir')} ${ic('chev')}</button></div>`;
  }
  function suggest() { const o = S.ans.obj || 'empezar'; const d = S.ans.days || 2; return G.plans.find((p) => p.obj === o && p.days === d) || G.plans[0]; }

  // ---------- temporizador ----------
  let TM = null;
  function ensureTimer(key, build) { if (TM && TM.key === key) return; stopTimer(); TM = { key, segs: build(), i: 0, left: 0, running: false, iv: null, finished: false }; TM.left = TM.segs[0].t; }
  function stopTimer() { if (TM && TM.iv) clearInterval(TM.iv); TM = null; wakeOff(); }
  let WL = null;
  async function wakeOn() { try { if ('wakeLock' in navigator && !WL) { WL = await navigator.wakeLock.request('screen'); WL.addEventListener('release', () => { WL = null; }); } } catch (e) {} }
  function wakeOff() { try { if (WL) { WL.release(); WL = null; } } catch (e) {} }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && TM && TM.running) wakeOn(); });
  function tmDom() {
    if (!TM || !$('#tm')) return;
    const s = TM.segs[TM.i]; const nx = TM.segs[TM.i + 1];
    const im = $('#tm-img'); if (im) { if (s.img && !TM.finished) { im.src = img(s.img); im.hidden = false; } else im.hidden = true; }
    $('#tm-time').textContent = mmss(TM.left);
    $('#tm-label').textContent = TM.finished ? t('listo') : s.label;
    $('#tm-next').textContent = TM.finished ? '' : nx ? `${t('siguiente')}: ${nx.label} · ${mmss(nx.t)}` : '';
    $('#tm-round').textContent = s.sub || `${TM.i + 1}/${TM.segs.length}`;
    $('#tm-bar').style.width = `${(1 - TM.left / s.t) * 100}%`;
    $('#tm').classList.toggle('work', !!s.work && !TM.finished);
    $('#tm-go').innerHTML = TM.running ? `${ic('pause')} ${t('pausa')}` : `${ic('play')} ${TM.i === 0 && TM.left === TM.segs[0].t ? t('empezarTimer') : t('seguir')}`;
  }
  function beep(n = 1) {
    if (S.vib && navigator.vibrate) navigator.vibrate(n > 1 ? [150, 80, 150] : 180);
    if (!S.sound) return;
    try { const C = window.AudioContext || window.webkitAudioContext; const ctx = beep.ctx || (beep.ctx = new C()); for (let i = 0; i < n; i++) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ctx.destination); const t0 = ctx.currentTime + i * .22; g.gain.setValueAtTime(.25, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + .18); o.start(t0); o.stop(t0 + .2); } } catch (e) {}
  }
  function tmTick() {
    if (!TM) return;
    TM.left--;
    if (TM.left <= 0) { TM.i++; if (TM.i >= TM.segs.length) { TM.i = TM.segs.length - 1; TM.left = 0; TM.finished = true; TM.running = false; clearInterval(TM.iv); TM.iv = null; beep(3); wakeOff(); } else { TM.left = TM.segs[TM.i].t; beep(1); } }
    tmDom();
  }
  function tmGo() { if (!TM) return; if (TM.finished) { tmReset(); } if (TM.running) { clearInterval(TM.iv); TM.iv = null; TM.running = false; wakeOff(); } else { TM.running = true; TM.iv = setInterval(tmTick, 1000); beep(1); wakeOn(); } tmDom(); }
  function tmNext() { if (!TM) return; if (TM.i < TM.segs.length - 1) { TM.i++; TM.left = TM.segs[TM.i].t; TM.finished = false; } tmDom(); }
  function tmReset() { if (!TM) return; clearInterval(TM.iv); TM.iv = null; TM.running = false; TM.finished = false; TM.i = 0; TM.left = TM.segs[0].t; tmDom(); }

  // ---------- hoja inferior, avisos ----------
  const over = () => $('#over');
  function sheet(html) { over().innerHTML = `<div class="sheet-bg" data-act="closesheet"><div class="sheet" data-stop="1"><div class="grab"></div>${html}</div></div>`; }
  function closeSheet() { stopScan(); over().innerHTML = ''; }
  let toastT = null;
  function toast(msg) { let el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; $('#frame').appendChild(el); } el.textContent = msg; clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 2200); }
  // ---------- incidencias: el socio avisa al club de lo que ha visto en una máquina ----------
  const INC_TIPOS = ['nofunciona', 'falta', 'rota', 'limpieza', 'otro'];
  function openHelp(mcode, exid) {
    const m = mcode ? G.machine(mcode) : null; const ex = exid ? G.ex(exid) : null;
    const where = [m ? `${m.code} · ${N(m)}` : '', ex ? N(ex) : ''].filter(Boolean).join(' · ');
    sheet(`<div class="eyebrow lime">${t('incidencia')}</div><div class="display h2">${t('incT')}</div>${where ? `<div class="small mb8"><b>${where}</b></div>` : ''}
      <div class="small muted mb12">${t('incTxt')}</div>
      <div class="chips" id="inc-tipos">${INC_TIPOS.map((k) => `<button class="chip" data-act="inctipo" data-v="${k}">${t('inc_' + k)}</button>`).join('')}</div>
      <textarea id="inc-txt" rows="3" placeholder="${t('incPh')}"></textarea>
      <label class="btn btn-ghost btn-block mt8" style="cursor:pointer">${ic('cam')} <span id="inc-foto-l">${t('incFoto')}</span><input type="file" accept="image/*" capture="environment" id="inc-foto" hidden></label>
      <div id="inc-prev" class="mt8"></div>
      <button class="btn btn-lime btn-lg btn-block mt12" id="inc-send" data-act="incsend" data-m="${mcode || ''}" data-ex="${exid || ''}" disabled>${ic('check')} ${t('incEnviar')}</button>
      <button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cancelar')}</button>`);
    const f = $('#inc-foto'); if (f) f.addEventListener('change', () => { const file = f.files && f.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => { $('#inc-prev').innerHTML = `<img src="${r.result}" alt="" style="width:100%;max-height:180px;object-fit:cover;border-radius:14px">`; $('#inc-foto-l').textContent = file.name.length > 28 ? file.name.slice(0, 26) + '…' : file.name; }; r.readAsDataURL(file); });
  }
  function incSend(mcode, exid) {
    const tipo = ($('#inc-tipos .chip.on') || {}).dataset; if (!tipo) return;
    const txt = ($('#inc-txt') || {}).value || ''; const foto = !!($('#inc-prev img'));
    S.inc = S.inc || []; const n = 41 + S.inc.length; const ref = `INC-2026-${String(n).padStart(4, '0')}`;
    const rec = { ref, m: mcode || null, ex: exid ? +exid : null, tipo: tipo.v, txt: txt.trim(), foto, at: new Date().toISOString(), estado: 'abierta' };
    S.inc.push(rec); save();
    const m = mcode ? G.machine(mcode) : null;
    sheet(`<div class="help-ok"><div class="big">${ic('check', 30)}</div><div class="display h2">${t('incGracias')}</div><div class="small muted">${ref} · ${hm(new Date())}${m ? ` · ${m.code} ${N(m)}` : ''}</div><div class="small mt8"><b>${t('inc_' + tipo.v)}</b>${rec.txt ? `<div class="muted mt8">«${esc(rec.txt)}»</div>` : ''}</div>
      <div class="tip lime mt16 small">${t('incOk')}</div>
      <button class="btn btn-lime btn-block mt16" data-act="closesheet">${t('cerrar')}</button></div>`);
  }

  // ---------- documentos firmados: una sola fuente de datos para la vista y para el PDF ----------
  const SIG = '<svg class="sig" viewBox="0 0 300 80"><path d="M14 56c22-38 36-38 30-6-4 22 16-30 36-24s-8 30 12 24 22-32 40-26 4 26 24 22 30-36 46-28-10 28 10 26 36-16 60-24" fill="none" stroke="#1b2a6b" stroke-width="2.2" stroke-linecap="round"/></svg>';
  const PARQ = ['¿Le ha dicho alguna vez su médico que tiene una enfermedad del corazón o hipertensión?', '¿Siente dolor en el pecho en reposo, en sus actividades diarias o al hacer actividad física?', '¿Pierde el equilibrio por mareos o ha perdido el conocimiento en los últimos 12 meses?', '¿Le han diagnosticado otra enfermedad crónica, distinta de las del corazón o la hipertensión?', '¿Toma actualmente medicación prescrita para una enfermedad crónica?', '¿Tiene, o ha tenido en los últimos 12 meses, un problema de huesos, articulaciones o tejidos blandos que pueda empeorar al ser más activo?', '¿Le ha dicho su médico que solo debe hacer actividad física supervisada?'];
  const NORMAS = ['El acceso a la sala es personal, con el carné de la app o el nombre en recepción.', 'Toalla obligatoria en bancos y máquinas, y limpieza del puesto al terminar.', 'El material vuelve a su sitio: discos en los soportes, mancuernas en el mancuernero.', 'Calzado deportivo limpio y ropa adecuada.', 'Los menores de 18 años necesitan autorización firmada de madre, padre o tutor.', 'No se graba ni se fotografía a otras personas sin su permiso.', 'Cualquier incidencia con una máquina, molestia o malestar se comunica en recepción.', 'Se respetan el horario, el aforo y las indicaciones del personal.'];
  const socioName = () => (S.auth ? `${S.auth.nombre} ${S.auth.apellidos || ''}`.trim() : `${S.name} Alberdi`);
  function docData(id) {
    const a = S.auth || {}; const num = socioNum(); const d0 = a.docs || {}; const tf = tarifaDe(a.tarifa) || tarifas()[0];
    const when = (k, fb) => (d0[k] ? `${dmyIso(d0[k])} · ${hmIso(d0[k])}` : fb);
    const fecha = (k, fb) => (d0[k] ? dmyIso(d0[k]) : fb);
    const socio = [['Socio', `${socioName()} · nº ${num}`]];
    const d = today(); const mes = `${t('meses')[d.getMonth()]} de ${d.getFullYear()} · del 1 al ${new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()}`;
    const parqSi = a.parq === 'valoracion';
    const D = {
      aptitud: { title: t('docAptitud'), sub: 'Cuestionario PAR-Q+ (versión 2025), sin modificaciones · Documento v1 · castellano', ref: `OG-APT-${num}`, fecha: fecha('aptitud', '03/11/2026'),
        kv: [...socio, ['Fecha', fecha('aptitud', '03/11/2026')], ['Validez', `12 meses · hasta el ${d0.aptitud ? dmyIso(d0.aptitud, 12) : '03/11/2027'}`], ['Idioma', 'Castellano']],
        blocks: [{ h: 'Siete preguntas sobre su salud', type: 'qa', items: PARQ.map((q) => [q, parqSi ? '—' : 'NO']) }, { type: 'box', text: parqSi ? 'Resultado: alguna respuesta es SÍ. Antes de entrenar con intensidad, la persona consultará con recepción o con su médico. Las respuestas concretas no se guardan en la aplicación; constan solo en este documento custodiado por el club.' : 'Resultado: todas las respuestas son NO. Puede empezar a hacer actividad física, despacio y progresando poco a poco. Esta declaración deja de ser válida si cambia su estado de salud.' }, { type: 'p', text: 'Declaro que he leído y comprendido las preguntas y que las he respondido con sinceridad. Sé que debo avisar al personal del gimnasio si mi estado de salud cambia.' }],
        sign: { when: when('aptitud', '03/11/2026 · 18:41'), extra: 'Acceso restringido al responsable del gimnasio' } },
      normas: { title: t('docNormas'), sub: 'Normas de uso de la sala · Documento v1 · castellano', ref: `OG-NOR-${num}`, fecha: fecha('normas', '03/11/2026'),
        kv: [...socio, ['Fecha', fecha('normas', '03/11/2026')], ['Vigencia', 'Desde el 01/01/2027']],
        blocks: [{ h: 'Normas de uso', type: 'ol', items: NORMAS }, { type: 'p', text: 'He leído y acepto las normas de uso del gimnasio de Padel Indoor Oarso.' }],
        sign: { when: when('normas', '03/11/2026 · 18:43'), extra: '' } },
      sepa: { title: t('docSepa'), sub: 'Adeudo directo SEPA · pago recurrente · Documento v1 · castellano', ref: `OG-SEPA-${num}`, fecha: fecha('sepa', '03/11/2026'),
        kv: [['Acreedor', 'Padel Indoor Oarso · Errenteria (Gipuzkoa)'], ['Identificador del acreedor', 'Lo asigna la entidad bancaria del club'], ['Referencia del mandato', `OG-SEPA-${num}`], ['Deudor', socioName()], ['Titular de la cuenta', a.titular || socioName()], ['IBAN', `ES·· **** **** **** **** ${a.iban4 || '1332'}`], ['Tipo de pago', 'Recurrente · cuota mensual'], ['Importe', `${tf.precio} ${t('alMes')} · ${N(tf)}`]],
        blocks: [{ type: 'p', text: SEPA_TXT }],
        sign: { when: when('sepa', '03/11/2026 · 18:45'), extra: '' } },
      imagen: { title: t('docImagen'), sub: 'Autorización voluntaria · revocable en recepción · Documento v1 · castellano', ref: `OG-IMG-${num}`, fecha: fecha('imagen', '03/11/2026'),
        kv: [...socio, ['Fecha', fecha('imagen', '03/11/2026')]],
        blocks: [{ type: 'p', text: IMAGEN_TXT }],
        sign: { when: when('imagen', '03/11/2026 · 18:44'), extra: '' } },
      cuota: { title: t('docCuota'), sub: 'Justificante de cuota al día · no es una factura', ref: `OG-CUO-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${num}`, fecha: `01/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
        kv: [...socio, ['Modalidad', N(tf)], ['Periodo', mes.charAt(0).toUpperCase() + mes.slice(1)], ['Cuota', `${tf.precio} ${t('alMes')}`], ['Forma de pago', 'Domiciliación bancaria'], ['Estado', 'Al día']],
        blocks: [{ type: 'p', text: 'Padel Indoor Oarso certifica que la persona indicada tiene la cuota del gimnasio al día para el periodo señalado.' }, { type: 'p', text: 'La factura correspondiente se emite con TicketBAI desde el programa de facturación del club.' }],
        sign: null, emitted: `01/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} · 09:00 · recepción` },
    };
    return D[id];
  }
  const sigHtml = () => (S.auth && S.auth.sig ? `<img class="sig" src="${S.auth.sig}" alt="">` : SIG);
  function scrDoc(id) {
    const d = docData(id); if (!d) return scrCarnet();
    const kv = `<dl class="pkv">${d.kv.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
    const blocks = d.blocks.map((b) => (b.h ? `<h3>${b.h}</h3>` : '') + (b.type === 'qa' ? `<ol class="pq">${b.items.map(([q, a]) => `<li><span>${q}</span><b>${a}</b></li>`).join('')}</ol>` : b.type === 'ol' ? `<ol class="pn">${b.items.map((r) => `<li>${r}</li>`).join('')}</ol>` : b.type === 'box' ? `<div class="pres">${b.text}</div>` : `<p>${b.text}</p>`)).join('');
    const stamp = '<div class="pstamp">PADEL INDOOR<br>OARSO<br><small>Gimnasio · Errenteria</small></div>';
    const foot = d.sign
      ? `<div class="psig"><div class="row between" style="align-items:flex-end"><div><div class="plab">Firma del socio</div>${sigHtml()}<div class="pname">${socioName()} · socio nº ${socioNum()}</div></div>${stamp}</div><div class="pmeta">${t('firmado')} ${d.sign.when} · ${S.auth && !S.auth.demo ? 'desde la app' : 'tableta de recepción'} · IP 88.···.···.12<br>Documento ${d.ref} · huella SHA-256 9f3a1c77…d2e4${d.sign.extra ? ' · ' + d.sign.extra : ''}</div></div>`
      : `<div class="psig"><div class="row between" style="align-items:flex-end"><div><div class="plab">Emitido</div><div class="pname">${d.emitted}</div></div>${stamp}</div><div class="pmeta">Documento ${d.ref}</div></div>`;
    return `<div class="screen">${top(d.title, `<button class="iconbtn noprint" data-act="pdf" data-v="${id}" aria-label="${t('descargarPdf')}">${ic('dl')}</button>`)}
      <div class="paper"><div class="pband"><div><div class="pclub">Padel Indoor Oarso · Gimnasio</div><div class="pclub2">Errenteria · Gipuzkoa</div></div><div class="pref">${d.ref}<br>${d.fecha}</div></div><h1>${d.title}</h1><div class="psub">${d.sub}</div>${kv}${blocks}${foot}<div class="pfoot">${t('ejemploDoc')}</div></div>
      <button class="btn btn-lime btn-lg btn-block mt16 noprint" data-act="pdf" data-v="${id}">${ic('dl')} ${t('descargarPdf')}</button>
      <div class="xs faint mt8 center noprint">${t('custodia')}</div>
    </div>`;
  }
  function sigPng() {
    return new Promise((res) => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 600; c.height = 160; c.getContext('2d').drawImage(im, 0, 0, 600, 160); res(c.toDataURL('image/png')); }; im.onerror = () => res(null); im.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(SIG.replace('class="sig" ', 'xmlns="http://www.w3.org/2000/svg" ')))); });
  }
  async function downloadPdf(id) {
    const d = docData(id); if (!d || !window.jspdf) { toast('PDF…'); return; }
    const { jsPDF } = window.jspdf; const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, L = 18, R = 192, TW = R - L; let y = 0;
    const page = () => { pdf.setFillColor(6, 22, 52); pdf.rect(0, 0, W, 24, 'F'); pdf.setTextColor(217, 255, 61); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10.5); pdf.text('PADEL INDOOR OARSO · GIMNASIO', L, 10.5); pdf.setTextColor(200, 210, 230); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8.5); pdf.text('Errenteria · Gipuzkoa', L, 16.5); pdf.setTextColor(255, 255, 255); pdf.text(d.ref, R, 10.5, { align: 'right' }); pdf.text(d.fecha, R, 16.5, { align: 'right' }); y = 36; };
    const need = (h) => { if (y + h > 272) { pdf.addPage(); page(); } };
    const para = (text, size = 10, color = [20, 20, 20], style = 'normal', gap = 4.6) => { pdf.setFont('helvetica', style); pdf.setFontSize(size); pdf.setTextColor(...color); const lines = pdf.splitTextToSize(text, TW); need(lines.length * gap + 2); pdf.text(lines, L, y); y += lines.length * gap + 2; };
    page();
    pdf.setTextColor(6, 22, 52); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(18); pdf.text(d.title, L, y); y += 7;
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(90, 100, 120); pdf.text(pdf.splitTextToSize(d.sub, TW), L, y); y += 9;
    // datos
    const rowH = 6.4; need(d.kv.length * rowH + 6); pdf.setFillColor(243, 245, 250); pdf.roundedRect(L, y - 1, TW, d.kv.length * rowH + 4, 2, 2, 'F'); y += 4;
    d.kv.forEach(([k, v]) => { pdf.setFontSize(9.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(90, 100, 120); pdf.text(k, L + 4, y); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(20, 20, 20); pdf.text(String(v), L + 46, y); y += rowH; });
    y += 6;
    d.blocks.forEach((b) => {
      if (b.h) { need(10); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(6, 22, 52); pdf.text(b.h, L, y); y += 6; }
      if (b.type === 'qa') b.items.forEach(([q, a], i) => { pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5); pdf.setTextColor(20, 20, 20); const lines = pdf.splitTextToSize(`${i + 1}. ${q}`, TW - 16); need(lines.length * 4.4 + 3); pdf.text(lines, L, y); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(10, 71, 184); pdf.text(a, R, y, { align: 'right' }); y += lines.length * 4.4 + 1.5; pdf.setDrawColor(229, 233, 242); pdf.line(L, y, R, y); y += 2.5; });
      else if (b.type === 'ol') b.items.forEach((r, i) => { pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5); pdf.setTextColor(20, 20, 20); const lines = pdf.splitTextToSize(`${i + 1}. ${r}`, TW); need(lines.length * 4.4 + 3); pdf.text(lines, L, y); y += lines.length * 4.4 + 1.5; pdf.setDrawColor(229, 233, 242); pdf.line(L, y, R, y); y += 2.5; });
      else if (b.type === 'box') { pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9.5); const lines = pdf.splitTextToSize(b.text, TW - 8); need(lines.length * 4.4 + 8); pdf.setFillColor(247, 255, 214); pdf.rect(L, y - 1, TW, lines.length * 4.4 + 5, 'F'); pdf.setFillColor(184, 224, 0); pdf.rect(L, y - 1, 1.2, lines.length * 4.4 + 5, 'F'); pdf.setTextColor(20, 20, 20); pdf.text(lines, L + 4, y + 3.5); y += lines.length * 4.4 + 8; }
      else para(b.text);
    });
    // firma y sello
    need(50); y += 4; pdf.setDrawColor(203, 213, 225); pdf.setLineDashPattern([1, 1], 0); pdf.line(L, y, R, y); pdf.setLineDashPattern([], 0); y += 7;
    if (d.sign) { const png = S.auth && S.auth.sig ? S.auth.sig : await sigPng(); pdf.setFontSize(7.5); pdf.setTextColor(90, 100, 120); pdf.setFont('helvetica', 'normal'); pdf.text('FIRMA DEL SOCIO', L, y); if (png) pdf.addImage(png, 'PNG', L, y + 2, 60, S.auth && S.auth.sig ? 20.6 : 16); pdf.setFontSize(9.5); pdf.setTextColor(20, 20, 20); pdf.setFont('helvetica', 'bold'); pdf.text(`${socioName()} · socio nº ${socioNum()}`, L, y + 27); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(90, 100, 120); pdf.text(`Firmado el ${d.sign.when} · ${S.auth && !S.auth.demo ? 'desde la app' : 'tableta de recepción'} · IP 88.···.···.12`, L, y + 32); }
    else { pdf.setFontSize(7.5); pdf.setTextColor(90, 100, 120); pdf.text('EMITIDO', L, y); pdf.setFontSize(9.5); pdf.setTextColor(20, 20, 20); pdf.setFont('helvetica', 'bold'); pdf.text(d.emitted, L, y + 6); pdf.setFont('helvetica', 'normal'); }
    // sello
    const cx = R - 18, cy = y + 12; pdf.setDrawColor(10, 71, 184); pdf.setLineWidth(.6); pdf.circle(cx, cy, 15, 'S'); pdf.setLineWidth(.2); pdf.setTextColor(10, 71, 184); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7); pdf.text('PADEL INDOOR', cx, cy - 3, { align: 'center' }); pdf.text('OARSO', cx, cy + 1, { align: 'center' }); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(5.5); pdf.text('Gimnasio · Errenteria', cx, cy + 6, { align: 'center' });
    y += 36;
    // verificación
    need(20); pdf.setDrawColor(229, 233, 242); pdf.line(L, y, R, y); y += 5; pdf.setFont('courier', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(100, 110, 130);
    pdf.text(`Documento ${d.ref} · huella SHA-256 9f3a1c77 4b2e 90aa 11c0 … d2e4${d.sign && d.sign.extra ? ' · ' + d.sign.extra : ''}`, L, y); y += 4;
    pdf.text('Generado por Oarso Gym para Padel Indoor Oarso. El original lo custodia el club.', L, y); y += 4;
    pdf.setFont('helvetica', 'italic'); pdf.text(t('ejemploDoc'), L, y);
    const n = pdf.getNumberOfPages(); for (let i = 1; i <= n; i++) { pdf.setPage(i); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(140, 150, 170); pdf.text(`${d.title} · ${i}/${n}`, W / 2, 290, { align: 'center' }); }
    pdf.save(`Oarso-Gym-${id}-${socioNum()}.pdf`);
  }

  // ---------- escáner de QR dentro de la app ----------
  let SC = null;
  function openScanner() {
    sheet(`<div class="eyebrow lime">${t('escanear')}</div><div class="display h2">${t('maquinas')}</div><div class="small muted">${t('escanearTxt')}</div>
      <div class="scanbox mt12"><video id="scanv" playsinline muted autoplay></video><div class="scanframe"></div></div>
      <div class="small muted mt8 center" id="scanst">${t('buscando')}</div>
      <button class="btn btn-ghost btn-block mt12" data-act="scanto" data-to="#/m/m3">${ic('qr')} ${t('probarSin')}</button>
      <button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cancelar')}</button>`);
    startScan();
  }
  async function startScan() {
    const v = $('#scanv'), st = $('#scanst'); if (!v) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      SC = { stream, det: 'BarcodeDetector' in window ? new BarcodeDetector({ formats: ['qr_code'] }) : null, cv: document.createElement('canvas'), t: 0 };
      v.srcObject = stream; await v.play(); scanLoop();
    } catch (e) { if (st) st.textContent = t('camaraNo'); const box = $('.scanbox'); if (box) box.classList.add('off'); }
  }
  async function scanLoop() {
    if (!SC) return; const v = $('#scanv'); if (!v) return stopScan();
    let text = null;
    try {
      if (SC.det) { const codes = await SC.det.detect(v); if (codes.length) text = codes[0].rawValue; }
      else if (window.jsQR && v.videoWidth) { const c = SC.cv; c.width = v.videoWidth; c.height = v.videoHeight; const g = c.getContext('2d'); g.drawImage(v, 0, 0); const d = g.getImageData(0, 0, c.width, c.height); const r = jsQR(d.data, c.width, c.height); if (r) text = r.data; }
    } catch (e) {}
    if (text) {
      const m = text.match(/\/m\/([a-z]\d)\b/i);
      if (m) { const code = m[1].toLowerCase(); closeSheet(); beep(1); nav('#/m/' + code); return; }
      const st = $('#scanst'); if (st) st.textContent = t('noQr');
    }
    if (SC) SC.t = setTimeout(scanLoop, 250);
  }
  function stopScan() { if (!SC) return; clearTimeout(SC.t); try { SC.stream.getTracks().forEach((tr) => tr.stop()); } catch (e) {} SC = null; }
  function machineQr(code) {
    const m = G.machine(code.toUpperCase()); if (!m) return;
    const url = location.origin + location.pathname + '#/m/' + code.toLowerCase();
    sheet(`<div class="eyebrow lime">${m.code} · ${N(m)}</div><div class="display h2">${t('qrMaquina')}</div><div class="qrbox mt12" id="mqr"></div><div class="small muted mt12">${t('qrMaquinaTxt')}</div><div class="xs faint mt8" style="word-break:break-all">${url}</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`);
    const el = $('#mqr'); try { const q = qrcode(0, 'H'); q.addData(url); q.make(); el.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) { el.textContent = url; }
  }

  // ---------- enrutado ----------
  function parts() { return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent); }
  const groupOf = (r) => ({ hoy: 'hoy', explorar: 'explorar', region: 'explorar', e: 'explorar', m: 'explorar', planes: 'planes', plan: 'planes', dia: 'planes', sesiones: 'sesiones', circuito: 'sesiones', cardio: 'sesiones', yo: 'yo', mi: 'yo', dias: 'yo', carnet: 'yo', ajustes: 'yo', legal: 'yo', privacidad: 'yo', doc: 'yo', pegatinas: 'yo' })[r] || 'hoy';
  // Volver: si hay historial propio, atrás; si no (por ejemplo, se llegó por un QR), a la pantalla madre
  const PARENT = { login: () => '#/login', registro: (p) => (+p[1] > 1 ? '#/registro/' + (+p[1] - 1) : '#/login'), region: () => '#/explorar', e: () => '#/explorar', m: () => '#/explorar/maquina', plan: () => '#/planes', dia: (p) => '#/plan/' + p[1], circuito: () => '#/sesiones', cardio: (p) => (p[2] ? '#/cardio/' + p[1] : '#/sesiones'), doc: () => '#/carnet', carnet: () => '#/yo', mi: () => '#/yo', dias: () => '#/yo', ajustes: () => '#/yo', legal: () => '#/ajustes', privacidad: () => '#/ajustes', pegatinas: () => '#/ajustes', onb: () => '#/onb/1' };
  const STACK = [];
  function goBack() { if (STACK.length > 1) { history.back(); return; } const p = parts(); const f = PARENT[p[0]]; nav(f ? f(p) : '#/hoy'); }
  function onHash() { const h = location.hash; if (STACK.length > 1 && STACK[STACK.length - 2] === h) STACK.pop(); else if (STACK[STACK.length - 1] !== h) STACK.push(h); render(); }
  let lastKey = '';
  function render(keep) {
    const p = parts(); let r = p[0] || 'hoy';
    const app = $('#app'); const y = app.scrollTop;
    document.documentElement.setAttribute('data-size', S.size); document.documentElement.setAttribute('data-motion', S.motion ? '1' : '0'); document.documentElement.lang = S.lang;
    // Sin cuenta solo se ve lo público (QR, fichas, explorar); con cuenta nueva, primero las tres preguntas
    const PUBLIC = ['m', 'e', 'region', 'explorar', 'login', 'registro', 'legal', 'privacidad'];
    if (!S.auth && !PUBLIC.includes(r)) r = 'login';
    else if (S.auth && r === 'login') r = S.onboarded ? 'hoy' : 'onb';
    else if (S.auth && !S.onboarded && !['onb', 'm', 'e', 'region', 'explorar', 'registro', 'legal', 'privacidad'].includes(r)) r = 'onb';
    let html = '', showTab = true;
    switch (r) {
      case 'login': html = scrLogin(); showTab = false; break;
      case 'registro': html = scrRegistro(p[1] || '1'); showTab = false; break;
      case 'onb': html = scrOnb(p[1] || '1'); showTab = false; break;
      case 'hoy': html = scrHoy(); break;
      case 'explorar': html = scrExplorar(p[1]); break;
      case 'region': if (lastKey !== location.hash) { F.lvl = 'all'; F.mat = null; } html = scrRegion(p[1]); break;
      case 'e': html = scrFicha(p[1]); break;
      case 'm': html = scrMachine(p[1]); break;
      case 'planes': html = scrPlanes(); break;
      case 'plan': html = scrPlan(p[1]); break;
      case 'dia': html = scrDia(p[1], p[2]); break;
      case 'sesiones': html = scrSesiones(); break;
      case 'circuito': html = scrCircuito(p[1]); break;
      case 'cardio': html = scrCardio(p[1], p[2]); break;
      case 'yo': html = scrYo(); break;
      case 'mi': html = scrMi(); break;
      case 'dias': html = scrDias(); break;
      case 'carnet': html = scrCarnet(); break;
      case 'ajustes': html = scrAjustes(); break;
      case 'legal': html = scrText(t('legal'), t('legalTxt')); break;
      case 'privacidad': html = scrText(t('privacidad'), t('privTxt')); break;
      case 'doc': html = scrDoc(p[1]); break;
      case 'pegatinas': html = scrPegatinas(); break;
      default: html = scrHoy();
    }
    if (!['circuito', 'cardio'].includes(r)) stopTimer();
    app.innerHTML = html;
    $('#nav').innerHTML = showTab ? (S.auth ? tabbar(groupOf(r)) : loginBar()) : '';
    app.scrollTop = keep ? y : 0;
    if (!keep) { app.setAttribute('tabindex', '-1'); try { app.focus({ preventScroll: true }); } catch (e) {} }
    lastKey = location.hash;
    if (r === 'carnet') drawQr();
    if (r === 'pegatinas') drawStickers();
    if (r === 'registro' && (p[1] || '1') === '3') initSig();
    if (r === 'explorar' && p[1] === 'buscar') { const q = $('#q'); if (q) { q.focus(); q.addEventListener('input', () => { $('#results').innerHTML = searchResults(q.value); }); } }
    if (TM) tmDom();
    const tag = $('.demo-tag'); if (tag) tag.textContent = t('demoTag');
  }

  // ---------- acciones ----------
  const nav = (to) => { if (location.hash === to) render(); else location.hash = to; };
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]'); if (!el) return;
    if (ev.target.closest('[data-stop]') && el.dataset.act === 'closesheet' && !ev.target.closest('button')) return;
    const a = el.dataset.act, v = el.dataset.v;
    switch (a) {
      case 'nav': nav(el.dataset.to); break;
      case 'back': goBack(); break;
      case 'video': sheet(`<div class="eyebrow lime">${t('video')}</div><div class="display h2">${t('videoT')}</div><p class="small mt8">${t('videoTxt')}</p><button class="btn btn-lime btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break;
      case 'notice': { const n = G.notices[+el.dataset.i]; sheet(`<div class="row"><span class="ni" style="width:34px;height:34px;border-radius:10px;background:#15254a;color:var(--lime);display:grid;place-items:center">${ic(n.icon)}</span><div class="eyebrow lime">${t('avisos')}</div></div><p class="mt12">${L(n)}</p><div class="xs muted mt8">${t('publicado')} · 31/10/2026</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break; }
      case 'chk': { const d = iso(today()); if (S.chk.d !== d) S.chk = { d, on: {} }; S.chk.on[el.dataset.key] = !S.chk.on[el.dataset.key]; save(); render(true); break; }
      case 'day': { const k = el.dataset.d; const dd = new Date(k + 'T00:00:00'); const rows = (S.done[k] || []).map((e) => e.type === 'entrada' ? `${t('entrada')} · ${e.at}` : e.type === 'plan' ? `${t('sesion')} · ${N(G.plan(e.plan) || { es: '', eu: '' })} · ${t('dia')} ${e.k}` : t('miEntreno')); sheet(`<div class="eyebrow lime">${t('esteDia')}</div><div class="display h2" style="text-transform:capitalize">${longDate(dd)}</div><div class="card mt12">${rows.map((r) => `<div class="notice"><span class="ni">${ic('check')}</span><div class="small">${r}</div></div>`).join('')}</div><div class="xs faint mt8">${t('leyenda')}</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break; }
      case 'bigqr': sheet(`<div class="eyebrow lime center">${t('socio')} · nº ${socioNum()}</div><div class="display h2 center">${socioName()}</div><div class="qrbox big mt12">${qrSvg('OARSO-GYM-' + socioNum(), 'M')}</div><div class="small muted mt12 center">${t('enseñar')}</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break;
      case 'install': installSheet(); break;
      case 'installgo': if (IP) { IP.prompt(); IP = null; } closeSheet(); break;
      case 'repeatplan': if (S.plan) { S.plan.start = iso(today()); save(); toast(t('siguiendo')); render(true); } break;
      case 'planadj': PA.obj = null; planAdjust(); break;
      case 'paobj': PA.obj = v; planAdjust(); break;
      case 'padays': PA.days = +v; planAdjust(); break;
      case 'pasave': { const cur = S.plan ? G.plan(S.plan.id) : null; const nw = G.plan(v); if (!cur || cur.obj !== nw.obj) S.plan = { id: v, start: iso(today()) }; else S.plan.id = v; save(); closeSheet(); toast(t('siguiendo')); render(true); break; }
      case 'lang': S.lang = v; save(); render(true); break;
      case 'size': S.size = +v; save(); render(true); break;
      case 'toggle': S[el.dataset.k] = !S[el.dataset.k]; save(); render(true); if (el.dataset.k === 'sound' && S.sound) beep(1); if (el.dataset.k === 'vib' && S.vib && navigator.vibrate) navigator.vibrate(120); break;
      case 'ans': S.ans[el.dataset.k] = isNaN(+v) ? v : +v; save(); render(true); break;
      case 'finish': { const plan = el.dataset.skip ? G.plans[0] : suggest(); S.onboarded = true; if (S.auth && S.auth.demo) seed(plan.id); else { S.plan = { id: plan.id, start: iso(today()) }; save(); } nav('#/hoy'); break; }
      case 'login': { const e = ($('#lg-email') || {}).value || '', pw = ($('#lg-pass') || {}).value || ''; if (doLogin(e, pw)) nav(S.onboarded ? '#/hoy' : '#/onb/1'); else { const er = $('#lg-err'); if (er) er.textContent = t('credMal'); } break; }
      case 'demofill': { const [e, pw] = v.split('|'); if ($('#lg-email')) $('#lg-email').value = e; if ($('#lg-pass')) $('#lg-pass').value = pw; break; }
      case 'olvide': sheet(`<div class="eyebrow lime">${t('contrasena')}</div><div class="display h2">${t('olvide')}</div><p class="small mt8">${t('olvideTxt')}</p><label class="fld"><span>${t('correo')}</span><input class="input" type="email" inputmode="email"></label><button class="btn btn-lime btn-block mt12" data-act="closesheet">${t('login')}</button>`); break;
      case 'logout': doLogout(); break;
      case 'regtoggle': S.reg[el.dataset.k] = !S.reg[el.dataset.k]; save(); render(true); break;
      case 'reg1': { const R = S.reg; const er = $('#reg-err'); const say = (m) => { if (er) er.textContent = m; }; const lbl = { nombre: 'nombre', apellidos: 'apellidos', email: 'correo', nac: 'nacimiento', pass: 'contrasena', pass2: 'repetirPass' }; const miss = Object.keys(lbl).filter((k) => !(R[k] || '').trim()); if (miss.length) { say(`${t('obligatorio')} ${miss.map((k) => t(lbl[k]).toLowerCase()).join(', ')}.`); break; } if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(R.email.trim())) { say(t('correoMal')); break; } if (accAll()[R.email.trim().toLowerCase()]) { say(t('correoUsado')); break; } const age = (today() - new Date(R.nac)) / 31557600000; if (!(age >= 16)) { say(t('menor16')); break; } if (R.pass.length < 8) { say(t('passCorta')); break; } if (R.pass !== R.pass2) { say(t('passDistinta')); break; } if (age < 18) toast(t('menor18')); save(); nav('#/registro/2'); break; }
      case 'regtarifa': S.reg.tarifa = v; save(); render(true); break;
      case 'reg2': S.reg.tarifa = v; save(); nav('#/registro/3'); break;
      case 'parq': { S.reg.parq = S.reg.parq || []; S.reg.parq[+el.dataset.i] = v === '1'; save(); render(true); break; }
      case 'leer': { const body = v === 'normas' ? `<ol class="pn" style="color:var(--ink-2)">${NORMAS.map((r) => `<li>${r}</li>`).join('')}</ol>` : `<p class="small">${v === 'sepa' ? SEPA_TXT : IMAGEN_TXT}</p>`; sheet(`<div class="eyebrow lime">${t('leer')}</div><div class="display h2">${t(v === 'normas' ? 'docNormas' : v === 'sepa' ? 'docSepa' : 'docImagen')}</div><div class="mt8">${body}</div><button class="btn btn-lime btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break; }
      case 'sigclear': S.reg.sig = null; save(); initSig(); break;
      case 'reg3': { const R = S.reg; const ok = R.ok || {}; const miss = []; if (!ok.normas) miss.push(t('faltaNormas')); if (!ok.aptitud || !R.parq || PARQ.some((_, i) => typeof R.parq[i] !== 'boolean')) miss.push(t('faltaParq')); if (!ok.sepa || !ibanOk(R.iban) || !(R.titular || '').trim()) miss.push(t('faltaSepa')); if (!R.sig) miss.push(t('faltaFirma')); const er = $('#reg-err'); if (miss.length) { if (er) { er.textContent = `${t('faltan')} ${miss.join(' · ')}.`; er.scrollIntoView({ block: 'center' }); } break; } regCreate(); nav('#/registro/4'); break; }
      case 'flvl': F.lvl = v; render(true); break;
      case 'fmat': F.mat = F.mat === v ? null : v; render(true); break;
      case 'pobj': PF.obj = v; render(true); break;
      case 'pdays': PF.days = +v; render(true); break;
      case 'follow': S.plan = { id: v, start: iso(today()) }; save(); toast(t('siguiendo')); render(true); break;
      case 'leaveplan': S.plan = null; save(); render(true); break;
      case 'short': S.short = !S.short; save(); render(true); break;
      case 'doneplan': markDone({ type: 'plan', plan: el.dataset.p, k: el.dataset.k }); toast(t('sesionHecha')); render(true); break;
      case 'donemine': markDone({ type: 'mine' }); toast(t('sesionHecha')); render(true); break;
      case 'addmine': if (!S.mine.some((m) => m.ex === +el.dataset.ex)) { S.mine.push({ id: Date.now(), ex: +el.dataset.ex, note: '' }); save(); toast(t('anadido')); render(true); } break;
      case 'mup': { const i = +el.dataset.i; if (i > 0) { [S.mine[i - 1], S.mine[i]] = [S.mine[i], S.mine[i - 1]]; save(); render(true); } break; }
      case 'mdown': { const i = +el.dataset.i; if (i < S.mine.length - 1) { [S.mine[i + 1], S.mine[i]] = [S.mine[i], S.mine[i + 1]]; save(); render(true); } break; }
      case 'mdup': { const i = +el.dataset.i; S.mine.splice(i + 1, 0, Object.assign({}, S.mine[i], { id: Date.now() })); save(); render(true); break; }
      case 'mdel': S.mine.splice(+el.dataset.i, 1); save(); render(true); break;
      case 'editnote': { const i = +el.dataset.i; const it = S.mine[i]; const ex = G.ex(it.ex); sheet(`<div class="eyebrow lime">${t('nota')}</div><div class="display h2">${N(ex)}</div><textarea id="notetx" rows="4" placeholder="${t('notaPh')}">${esc(it.note || '')}</textarea><button class="btn btn-lime btn-lg btn-block mt12" data-act="savenote" data-i="${i}">${ic('check')} ${t('guardar')}</button><div class="row mt8"><button class="btn btn-ghost grow" data-act="closesheet">${t('cancelar')}</button>${it.note ? `<button class="btn btn-ghost" data-act="delnote" data-i="${i}">${ic('trash')} ${t('borrarNota')}</button>` : ''}</div>`); const tx = $('#notetx'); if (tx) { tx.focus(); tx.setSelectionRange(tx.value.length, tx.value.length); } break; }
      case 'savenote': { const tx = $('#notetx'); S.mine[+el.dataset.i].note = tx ? tx.value.trim() : ''; save(); closeSheet(); render(true); break; }
      case 'delnote': S.mine[+el.dataset.i].note = ''; save(); closeSheet(); render(true); break;
      case 'copyday': sheet(`<div class="eyebrow lime">${t('copiarDia')}</div><div class="display h2">${t('eligeDia')}</div><div class="col" style="gap:8px;margin-top:10px">${G.plans.filter((p, i, arr) => arr.findIndex((q) => q.obj === p.obj) === i || p.days === 3).map((p) => p.sched.filter((d) => d.k !== 'C').map((d) => `<button class="opt" data-act="copydo" data-p="${p.id}" data-k="${d.k}"><span class="num" style="width:30px;height:30px;border-radius:9px;background:var(--card-2);color:var(--lime);font-family:var(--f-mono);display:grid;place-items:center">${d.k}</span><span><b>${N(p)}</b><br><small class="muted">${p.days} ${t('dias')} · ${t('dia')} ${d.k} · ${d.main.length} ${t('ejercicios')}</small></span></button>`).join('')).join('')}</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cancelar')}</button>`); break;
      case 'copydo': { const d = G.plan(el.dataset.p).sched.find((x) => x.k === el.dataset.k); d.main.forEach(([id, dose]) => { if (!S.mine.some((m) => m.ex === id)) S.mine.push({ id: Date.now() + id, ex: id, note: dose }); }); save(); closeSheet(); toast(t('copiado')); render(true); break; }
      case 'print': window.print(); break;
      case 'export': { const b = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'oarso-gym-mis-datos.json'; a.click(); break; }
      case 'confirmreset': sheet(`<div class="display h2">${v === 'cuenta' ? t('borrar') : t('borrarDemo')}</div><div class="small muted">${t('privTxt').split('.').slice(-2).join('.')}</div><button class="btn btn-danger btn-block mt16" data-act="reset" data-v="${v}">${v === 'cuenta' ? t('borrar') : t('borrarDemo')}</button><button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cancelar')}</button>`); break;
      case 'reset': { if (v === 'demo') { try { localStorage.removeItem(ACCK); localStorage.removeItem('oarsogym.tarifas'); localStorage.removeItem('oarsogym.avisos'); } catch (e) {} } doLogout(); break; }
      case 'help': openHelp(el.dataset.m, el.dataset.ex); break;
      case 'scan': openScanner(); break;
      case 'scanto': closeSheet(); nav(el.dataset.to); break;
      case 'mqr': machineQr(el.dataset.m); break;
      case 'inctipo': { document.querySelectorAll('#inc-tipos .chip').forEach((c) => c.classList.toggle('on', c === el)); const b = $('#inc-send'); if (b) b.disabled = false; break; }
      case 'incsend': incSend(el.dataset.m, el.dataset.ex); break;
      case 'pdf': downloadPdf(v); break;
      case 'closesheet': closeSheet(); break;
      case 'tmgo': tmGo(); break;
      case 'tmnext': tmNext(); break;
      case 'tmreset': tmReset(); break;
    }
  });
  // Figura: tocar un músculo lo ilumina en lima y abre su región
  document.addEventListener('click', (ev) => {
    const g = ev.target.closest('.anatwrap.click [data-g]'); if (!g) return;
    const r = G.regionOf(g.dataset.g); const reg = G.regions.find((x) => x.id === r); if (!reg) return;
    const wrap = g.closest('.anatwrap');
    wrap.innerHTML = ANAT('f', reg.groups, [], 150) + ANAT('b', reg.groups, [], 150);
    if (navigator.vibrate) navigator.vibrate(15);
    setTimeout(() => nav('#/region/' + r), 280);
  });
  document.addEventListener('mouseover', (ev) => {
    const wrap = $('.anatwrap.click'); if (!wrap) return;
    wrap.querySelectorAll('.hov').forEach((p) => p.classList.remove('hov'));
    const g = ev.target.closest('.anatwrap.click [data-g]'); if (!g) return;
    const reg = G.regions.find((x) => x.id === G.regionOf(g.dataset.g)); if (!reg) return;
    wrap.querySelectorAll('[data-g]').forEach((p) => { if (reg.groups.includes(p.dataset.g)) p.classList.add('hov'); });
  });
  document.addEventListener('input', (ev) => { const d = ev.target.dataset || {}; if (d.note !== undefined) { S.mine[+d.note].note = ev.target.value; save(); } if (d.reg !== undefined) { S.reg = S.reg || {}; S.reg[d.reg] = ev.target.value; save(); } });
  document.addEventListener('change', (ev) => { const d = ev.target.dataset || {}; if (d.ok !== undefined) { S.reg = S.reg || {}; S.reg.ok = S.reg.ok || {}; S.reg.ok[d.ok] = ev.target.checked; save(); } });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target && ev.target.id === 'lg-pass') { const b = $('[data-act="login"]'); if (b) b.click(); } });

  window.addEventListener('hashchange', onHash);
  if (!location.hash) location.hash = S.auth ? (S.onboarded ? '#/hoy' : '#/onb/1') : '#/login';
  STACK.push(location.hash);
  render();
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
