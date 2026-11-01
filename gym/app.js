// Oarso Gym · demo interactiva. Una sola página, rutas por #/, estado en el navegador.
(function () {
  const G = window.GYM;
  const $ = (s, r = document) => r.querySelector(s);
  const KEY = 'oarsogym.demo.v1';
  const VERSION = '0.1 · 31/10/2026';

  // ---------- estado ----------
  const defaults = () => ({ lang: 'es', size: 0, onboarded: false, name: 'Naia', plan: null, done: {}, mine: [], short: false, sound: true, vib: true, motion: true, chk: { d: '', on: {} }, ans: {} });
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
        ${ps.p.alt ? `<div class="xs muted mt8">${t('alternancia')}</div>` : ''}
      </section>`;
    } else {
      planHtml = `<section class="card pad"><div class="eyebrow">${t('planes')}</div><div class="display h2">${t('sinPlan')}</div><div class="row mt12"><button class="btn btn-lime" data-act="nav" data-to="#/planes">${t('elegirPlan')}</button><button class="btn btn-ghost" data-act="nav" data-to="#/explorar">${t('oExplorar')}</button></div></section>`;
    }
    return `<div class="screen">
      <div class="top"><div class="grow"><div class="eyebrow">${longDate(now)}</div><h1 class="display h1">${greet},<br><span class="lime">${S.name}</span></h1></div><button class="iconbtn lime" data-act="nav" data-to="#/carnet" aria-label="${t('carnet')}">${ic('qr')}</button></div>
      ${planHtml}
      <section class="sec"><div class="sec-h"><h2>${t('avisos')}</h2></div><div class="card">${G.notices.map((n, i) => `<button class="notice" data-act="notice" data-i="${i}"><span class="ni">${ic(n.icon)}</span><div class="small grow">${L(n)}</div><span class="chev">${ic('chev')}</span></button>`).join('')}</div></section>
      <button class="card lime pad mt16" data-act="scan" style="width:100%;text-align:left"><div class="row"><span class="iconbtn" style="background:var(--lime-ink);color:var(--lime)">${ic('qr')}</span><div class="grow"><b>${t('escanear')}</b><div class="small muted">${t('escanearTxt')}</div></div>${ic('chev')}</div></button>
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
  function scrRegion(id) {
    const r = G.regions.find((x) => x.id === id); if (!r) return scrExplorar();
    let list = G.exercises.filter((e) => e.regions.includes(id));
    const mats = [...new Set(list.flatMap((e) => e.mat))];
    if (F.lvl !== 'all') list = list.filter((e) => e.lvl === F.lvl);
    if (F.mat) list = list.filter((e) => e.mat.includes(F.mat));
    const order = { I: 0, M: 1, A: 2 };
    list.sort((a, b) => order[a.lvl] - order[b.lvl] || (a.mov - b.mov));
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
    return `<div class="screen">${top('', `<button class="iconbtn" data-act="help" data-m="${ex.m}" data-ex="${ex.id}" aria-label="${t('pedirAyuda')}">${ic('help')}</button>`)}
      ${videoHero(ex)}
      <div class="row mt12 wrap">${lvlPill(ex.lvl)}${ex.mat.map((x) => `<span class="pill line">${matName(x)}</span>`).join('')}${m ? `<button class="pill lime" data-act="nav" data-to="#/m/${m.code.toLowerCase()}">${m.code} · ${N(m)}</button>` : ''}</div>
      <section class="sec"><div class="sec-h"><h2>${t('queTrabaja')}</h2></div><div class="card pad"><div class="row" style="align-items:flex-start;gap:14px">${musclePair(ex.p, ex.s)}<div class="grow"><div class="eyebrow lime">${t('principal')}</div><b>${ex.p.map(gname).join(', ')}</b>${ex.s.length ? `<div class="eyebrow mt8">${t('tambien')}</div><div class="small">${ex.s.map(gname).join(', ')}</div>` : ''}</div></div>${ex.pad ? `<div class="tip lime mt12 small"><b>${t('enElPadel')}:</b> ${ex.pad}</div>` : ''}</div></section>
      ${f ? `
      ${euNote()}
      ${f.aj && f.aj.length ? `<section class="sec"><div class="sec-h"><h2>${t('ajusta')}</h2></div><div class="card pad"><ul class="adj">${f.aj.map((s) => `<li>${s}</li>`).join('')}</ul></div></section>` : ''}
      <section class="sec"><div class="sec-h"><h2>${t('hazlo')}</h2></div><div class="card pad"><ol class="steps">${f.haz.map((s) => `<li>${s}</li>`).join('')}</ol></div></section>
      <section class="sec"><div class="sec-h"><h2>${t('evita')}</h2></div><div class="card pad"><ul class="warn">${f.ev.map((s) => `<li>${s}</li>`).join('')}</ul></div></section>` : `<div class="tip warn mt16 small">${ic('info')} ${t('fichaBorrador')}</div>`}
      <section class="sec"><div class="sec-h"><h2>${t('cuanto')}</h2></div><div class="card pad"><b>${dosis}</b>${!ex.mov ? `<div class="eyebrow mt12">${t('pesoOk')}</div><div class="small mt8">${t('pesoTxt')}</div>` : ''}</div></section>
      ${alts.length ? `<section class="sec"><div class="grid2">${alts.join('')}</div></section>` : ''}
      <section class="sec"><div class="card pad" style="border-color:#5a2222"><div class="eyebrow" style="color:var(--bad)">${t('paraY')}</div><div class="small mt8">${t('paraTxt')}</div><button class="btn btn-ghost btn-sm mt12" data-act="help" data-m="${ex.m}" data-ex="${ex.id}">${ic('help')} ${t('pedirAyuda')}</button></div></section>
      <div class="xs faint mt16">${t('revisado')}: ${t('pendienteRev')}.</div>
      <button class="btn btn-lime btn-lg btn-block mt16" data-act="addmine" data-ex="${ex.id}" ${inMine ? 'disabled' : ''}>${ic(inMine ? 'check' : 'plus')} ${inMine ? t('yaEsta') : t('anadir')}</button>
    </div>`;
  }

  function scrMachine(code) {
    const m = G.machine(code.toUpperCase()); if (!m) return scrExplorar('maquina');
    const list = G.exercises.filter((e) => e.where.includes(m.code)).sort((a, b) => ({ I: 0, M: 1, A: 2 })[a.lvl] - ({ I: 0, M: 1, A: 2 })[b.lvl]);
    const main = list[0];
    const altEx = main ? G.exercises.find((e) => e.p[0] === main.p[0] && e.m !== m.code && !e.mov && e.lvl !== 'A') : null;
    const cardio = G.cardio.find((c) => c.m === m.code);
    const ph = m.img ? `<img src="${img(m.img)}" alt="">` : `<div class="mcode"><b>${m.code}</b></div>`;
    return `<div class="screen">${top('', `<button class="iconbtn" data-act="help" data-m="${m.code}" aria-label="${t('pedirAyuda')}">${ic('help')}</button>`)}
      ${!S.onboarded ? `<div class="tip lime small mb12">${ic('qr')} ${t('desdeQr')}</div>` : ''}
      <div class="hero ${m.prod ? "prod" : m.img ? "kb" : ""}">${ph}<div class="sh"></div><div class="tl"><span class="pill lime">${m.code}</span>${m.img ? `<span class="pill">${ic('play', 11)} ${t('video')}</span>` : ''}</div><div class="in"><div class="eyebrow lime">${t(m.zone === 'fuerza' ? 'zonaFuerza' : m.zone === 'cardio' ? 'zonaCardio' : 'zonaLibre')}</div><h1 class="display h1">${N(m)}</h1></div></div>
      ${m.model ? `<div class="xs muted mt8">${t('modelo')}: ${m.model}</div>` : ''}
      <p class="mt12">${L2(m.desc)}</p>
      ${m.adjust.length ? `<section class="sec"><div class="sec-h"><h2>${t('comoSeAjusta')}</h2></div><div class="card pad"><dl class="kv">${m.adjust.map((a) => `<dt>${S.lang === 'eu' ? a[2] : a[0]}</dt><dd>${S.lang === 'eu' ? a[3] : a[1]}</dd>`).join('')}</dl></div></section>` : ''}
      ${m.stations ? `<section class="sec"><div class="sec-h"><h2>${t('puestos')}</h2><span class="small muted">${m.stations.length}</span></div>${m.stations.map((s, i) => `<div class="card pad mb8"><div class="row"><span class="num">${i + 1}</span><b>${L2(s)}</b></div>${(m.stEx && m.stEx[i] ? m.stEx[i] : []).map((eid) => exRow(G.ex(eid), { sm: true, meta: lvlName(G.ex(eid).lvl) })).join('')}</div>`).join('')}</section>` : ''}
      ${cardio ? `<section class="sec"><div class="sec-h"><h2>${t('protocolos')}</h2></div>${cardio.prot.map((p) => `<button class="exrow" data-act="nav" data-to="#/cardio/${m.code.toLowerCase()}/${p.id}"><span class="num">${p.total}'</span><div class="grow"><b>${N(p)}</b><small>${t(p.kind === 'int' ? 'intervalos' : 'continuo')}</small></div><span class="chev">${ic('chev')}</span></button>`).join('')}</section>` : ''}
      ${list.length && !m.stations ? `<section class="sec"><div class="sec-h"><h2>${t('enEstaMaquina')}</h2><span class="small muted">${list.length} ${t('ejercicios')}</span></div>${list.map((e) => exRow(e, { meta: lvlName(e.lvl) + (e.where !== m.code ? ' · ' + whereLabel(e) : '') })).join('')}</section>` : ''}
      ${altEx ? `<section class="sec"><div class="sec-h"><h2>${t('siOcupada')}</h2></div>${exRow(altEx, { meta: t('alternativa') + ' · ' + whereLabel(altEx) })}</section>` : ''}
      <div class="row mt16"><button class="btn btn-ghost grow" data-act="help" data-m="${m.code}">${ic('help')} ${t('pedirAyuda')}</button><button class="btn btn-ghost" data-act="mqr" data-m="${m.code}">${ic('qr')} ${t('qrMaquina')}</button></div>
      ${!S.onboarded ? `<button class="btn btn-lime btn-block mt8" data-act="nav" data-to="#/onb/1">${t('abrirApp')}</button>` : ''}
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
      ${following ? `<div class="wk mt12" aria-label="${t('semanas')}">${Array.from({ length: p.weeks }, (_, i) => `<span class="${i + 1 < ps.week ? 'done' : i + 1 === ps.week ? 'now' : ''}">${i + 1}</span>`).join('')}</div>` : ''}
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
      <section class="card carnet pad"><div class="row between"><div><div class="eyebrow lime">${t('socio')}</div><div class="display h2">${S.name} A.</div><div class="small muted">${t('cuota')} · ${t('hasta')} 30/11/2026</div></div><button class="iconbtn lime" data-act="nav" data-to="#/carnet">${ic('qr')}</button></div></section>
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
    return `<div class="screen">${top(t('carnet'))}
      <section class="card carnet pad"><div class="eyebrow lime">${t('socio')} · nº 0421</div><div class="display h1">${S.name} Alberdi</div>
        <button class="qrbox mt12" id="qr" data-act="bigqr" aria-label="${t('verGrande')}"></button>
        <div class="small muted mt12 center">${t('enseñar')} <span class="lime">${t('verGrande')}</span></div></section>
      <div class="sec-h mt16"><h2>${t('misDocs')}</h2><span class="small muted">PDF</span></div>
      <div class="card">
        <button class="set" data-act="nav" data-to="#/doc/cuota"><span class="row"><span class="iconbtn" style="color:var(--ok)">${ic('check')}</span><span><b>${t('cuota')}</b><br><small class="muted">${t('hasta')} 30/11/2026</small></span></span><span class="pill">${ic('doc', 12)} PDF</span></button>
        <button class="set" data-act="nav" data-to="#/doc/aptitud"><span class="row"><span class="iconbtn" style="color:var(--ok)">${ic('doc')}</span><span><b>${t('declaracion')}</b><br><small class="muted">03/11/2026 · ${t('caduca')} 03/11/2027</small></span></span><span class="pill">${ic('doc', 12)} PDF</span></button>
        <button class="set" data-act="nav" data-to="#/doc/normas"><span class="row"><span class="iconbtn" style="color:var(--ok)">${ic('shield')}</span><span><b>${t('normas')}</b><br><small class="muted">03/11/2026</small></span></span><span class="pill">${ic('doc', 12)} PDF</span></button>
      </div>
      <div class="xs faint mt8">${t('custodia')}</div>
    </div>`;
  }
  function drawQr() { const el = $('#qr'); if (el) el.innerHTML = qrSvg('OARSO-GYM-0421', 'M'); }

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
      <div class="card mt12"><button class="set" data-act="confirmreset" data-v="cuenta"><span class="row"><span class="iconbtn" style="color:var(--bad)">${ic('trash')}</span><b style="color:var(--bad)">${t('borrar')}</b></span></button><button class="set" data-act="confirmreset" data-v="demo"><span class="row"><span class="iconbtn">${ic('reset')}</span><b>${t('borrarDemo')}</b></span></button></div>
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
  let helpSeq = 0;
  function openHelp(mcode, exid) {
    const m = mcode ? G.machine(mcode) : null; const ex = exid ? G.ex(exid) : null;
    const where = [ex ? N(ex) : '', m ? `${m.code} · ${N(m)}` : ''].filter(Boolean).join(' · ');
    sheet(`<div class="eyebrow lime">${t('pedirAyuda')}</div><div class="display h2">${t('ayudaT')}</div>${where ? `<div class="small muted mb12">${where}</div>` : ''}
      <div class="col" style="gap:8px">${[['maq', 'ayudaMaq', 'tool'], ['ej', 'ayudaEj', 'help'], ['otro', 'ayudaOtro', 'bell']].map(([k, l, i]) => `<button class="opt" data-act="helpsend" data-v="${t(l)}" data-w="${where}"><span class="iconbtn">${ic(i)}</span><b>${t(l)}</b></button>`).join('')}</div>
      <button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cancelar')}</button>`);
  }
  function helpSend(motivo, where) {
    const id = ++helpSeq; const at = hm(new Date());
    sheet(`<div class="help-ok"><div class="big">${ic('check', 30)}</div><div class="display h2">${t('avisoEnviado')}</div><div class="small muted">${at}${where ? ` · ${where}` : ''}</div><div class="small mt8"><b>${motivo}</b></div>
      <div class="tip mt16 small" id="help-status">${t('recepcionTarda')}</div>
      <button class="btn btn-lime btn-block mt16" data-act="closesheet">${t('cerrar')}</button></div>`);
    setTimeout(() => { const el = $('#help-status'); if (el && helpSeq === id) { el.className = 'tip lime mt16 small'; el.innerHTML = `<b>${t('vanParaAlla')}</b> · Mikel, ${S.lang === 'eu' ? 'harrera' : 'recepción'} · ${hm(new Date())}`; } }, 6000);
  }

  // ---------- documentos firmados (vista tipo PDF) ----------
  const SIG = '<svg class="sig" viewBox="0 0 300 80"><path d="M14 56c22-38 36-38 30-6-4 22 16-30 36-24s-8 30 12 24 22-32 40-26 4 26 24 22 30-36 46-28-10 28 10 26 36-16 60-24" fill="none" stroke="#1b2a6b" stroke-width="2.2" stroke-linecap="round"/></svg>';
  function scrDoc(id) {
    const kv = (rows) => `<dl class="pkv">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
    const stamp = '<div class="pstamp">PADEL INDOOR<br>OARSO<br><small>Gimnasio · Errenteria</small></div>';
    const sigBlock = (when, ref, extra) => `<div class="psig"><div class="row between" style="align-items:flex-end"><div><div class="plab">Firma del socio</div>${SIG}<div class="pname">Naia Alberdi · socio nº 0421</div></div>${stamp}</div><div class="pmeta">${t('firmado')} ${when} · tableta de recepción · IP 88.···.···.12<br>Documento ${ref} · huella SHA-256 9f3a1c77…d2e4${extra ? ' · ' + extra : ''}</div></div>`;
    const Q = ['¿Le ha dicho alguna vez su médico que tiene una enfermedad del corazón o hipertensión?', '¿Siente dolor en el pecho en reposo, en sus actividades diarias o al hacer actividad física?', '¿Pierde el equilibrio por mareos o ha perdido el conocimiento en los últimos 12 meses?', '¿Le han diagnosticado otra enfermedad crónica, distinta de las del corazón o la hipertensión?', '¿Toma actualmente medicación prescrita para una enfermedad crónica?', '¿Tiene, o ha tenido en los últimos 12 meses, un problema de huesos, articulaciones o tejidos blandos que pueda empeorar al ser más activo?', '¿Le ha dicho su médico que solo debe hacer actividad física supervisada?'];
    const R = ['El acceso a la sala es personal, con el carné de la app o el nombre en recepción.', 'Toalla obligatoria en bancos y máquinas, y limpieza del puesto al terminar.', 'El material vuelve a su sitio: discos en los soportes, mancuernas en el mancuernero.', 'Calzado deportivo limpio y ropa adecuada.', 'Los menores de 18 años necesitan autorización firmada de madre, padre o tutor.', 'No se graba ni se fotografía a otras personas sin su permiso.', 'Cualquier incidencia con una máquina, molestia o malestar se comunica en recepción.', 'Se respetan el horario, el aforo y las indicaciones del personal.'];
    const D = {
      aptitud: { title: t('docAptitud'), sub: 'Cuestionario PAR-Q+ (versión 2025), sin modificaciones · Documento v1 · castellano',
        body: kv([['Socio', 'Naia Alberdi · nº 0421'], ['Fecha', '03/11/2026'], ['Validez', '12 meses · hasta el 03/11/2027'], ['Idioma', 'Castellano']]) + `<h3>Siete preguntas sobre su salud</h3><ol class="pq">${Q.map((q) => `<li><span>${q}</span><b>NO</b></li>`).join('')}</ol><div class="pres"><b>Resultado:</b> todas las respuestas son NO. Puede empezar a hacer actividad física, despacio y progresando poco a poco. Esta declaración deja de ser válida si cambia su estado de salud.</div><p>Declaro que he leído y comprendido las preguntas y que las he respondido con sinceridad. Sé que debo avisar al personal del gimnasio si mi estado de salud cambia.</p>` + sigBlock('el 03/11/2026 a las 18:41', 'OG-APT-2026-0421', 'acceso restringido al responsable del gimnasio') },
      normas: { title: t('docNormas'), sub: 'Normas de uso de la sala · Documento v1 · castellano',
        body: kv([['Socio', 'Naia Alberdi · nº 0421'], ['Fecha', '03/11/2026'], ['Vigencia', 'Desde el 01/01/2027']]) + `<h3>Normas de uso</h3><ol class="pn">${R.map((r) => `<li>${r}</li>`).join('')}</ol><p>He leído y acepto las normas de uso del gimnasio de Padel Indoor Oarso.</p>` + sigBlock('el 03/11/2026 a las 18:43', 'OG-NOR-2026-0421', '') },
      cuota: { title: t('docCuota'), sub: 'Justificante de cuota al día · no es una factura',
        body: kv([['Socio', 'Naia Alberdi · nº 0421'], ['Modalidad', 'Gimnasio'], ['Periodo', 'Noviembre de 2026 · del 1 al 30'], ['Forma de pago', 'Domiciliación bancaria'], ['Estado', 'Al día']]) + `<p>Padel Indoor Oarso certifica que la persona indicada tiene la cuota del gimnasio al día para el periodo señalado.</p><div class="psig"><div class="row between" style="align-items:flex-end"><div><div class="plab">Emitido</div><div class="pname">01/11/2026 · 09:00 · recepción</div></div>${stamp}</div><div class="pmeta">Documento OG-CUO-2026-11-0421 · La factura se emite con TicketBAI desde el programa de facturación del club.</div></div>` },
    };
    const d = D[id]; if (!d) return scrCarnet();
    return `<div class="screen">${top(d.title, `<button class="iconbtn noprint" data-act="print" aria-label="${t('descargarPdf')}">${ic('dl')}</button>`)}
      <div class="paper"><div class="phead"><div class="pclub">Padel Indoor Oarso · Gimnasio</div><h1>${d.title}</h1><div class="psub">${d.sub}</div></div>${d.body}<div class="pfoot">${t('ejemploDoc')}</div></div>
      <button class="btn btn-lime btn-lg btn-block mt16 noprint" data-act="print">${ic('dl')} ${t('descargarPdf')}</button>
      <div class="xs faint mt8 center noprint">${t('custodia')}</div>
    </div>`;
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
  const PARENT = { region: () => '#/explorar', e: () => '#/explorar', m: () => '#/explorar/maquina', plan: () => '#/planes', dia: (p) => '#/plan/' + p[1], circuito: () => '#/sesiones', cardio: (p) => (p[2] ? '#/cardio/' + p[1] : '#/sesiones'), doc: () => '#/carnet', carnet: () => '#/yo', mi: () => '#/yo', dias: () => '#/yo', ajustes: () => '#/yo', legal: () => '#/ajustes', privacidad: () => '#/ajustes', pegatinas: () => '#/ajustes', onb: () => '#/onb/1' };
  const STACK = [];
  function goBack() { if (STACK.length > 1) { history.back(); return; } const p = parts(); const f = PARENT[p[0]]; nav(f ? f(p) : '#/hoy'); }
  function onHash() { const h = location.hash; if (STACK.length > 1 && STACK[STACK.length - 2] === h) STACK.pop(); else if (STACK[STACK.length - 1] !== h) STACK.push(h); render(); }
  let lastKey = '';
  function render(keep) {
    const p = parts(); let r = p[0] || 'hoy';
    const app = $('#app'); const y = app.scrollTop;
    document.documentElement.setAttribute('data-size', S.size); document.documentElement.setAttribute('data-motion', S.motion ? '1' : '0'); document.documentElement.lang = S.lang;
    if (!S.onboarded && !['m', 'onb', 'e'].includes(r)) r = 'onb';
    let html = '', showTab = true;
    switch (r) {
      case 'onb': html = scrOnb(p[1] || '1'); showTab = false; break;
      case 'hoy': html = scrHoy(); break;
      case 'explorar': html = scrExplorar(p[1]); break;
      case 'region': if (lastKey !== location.hash) { F.lvl = 'all'; F.mat = null; } html = scrRegion(p[1]); break;
      case 'e': html = scrFicha(p[1]); break;
      case 'm': html = scrMachine(p[1]); showTab = S.onboarded; break;
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
    $('#nav').innerHTML = showTab ? tabbar(groupOf(r)) : '';
    app.scrollTop = keep ? y : 0;
    if (!keep) { app.setAttribute('tabindex', '-1'); try { app.focus({ preventScroll: true }); } catch (e) {} }
    lastKey = location.hash;
    if (r === 'carnet') drawQr();
    if (r === 'pegatinas') drawStickers();
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
      case 'bigqr': sheet(`<div class="eyebrow lime center">${t('socio')} · nº 0421</div><div class="display h2 center">${S.name} Alberdi</div><div class="qrbox big mt12">${qrSvg('OARSO-GYM-0421', 'M')}</div><div class="small muted mt12 center">${t('enseñar')}</div><button class="btn btn-ghost btn-block mt12" data-act="closesheet">${t('cerrar')}</button>`); break;
      case 'install': installSheet(); break;
      case 'installgo': if (IP) { IP.prompt(); IP = null; } closeSheet(); break;
      case 'repeatplan': if (S.plan) { S.plan.start = iso(today()); save(); toast(t('siguiendo')); render(true); } break;
      case 'lang': S.lang = v; save(); render(true); break;
      case 'size': S.size = +v; save(); render(true); break;
      case 'toggle': S[el.dataset.k] = !S[el.dataset.k]; save(); render(true); if (el.dataset.k === 'sound' && S.sound) beep(1); if (el.dataset.k === 'vib' && S.vib && navigator.vibrate) navigator.vibrate(120); break;
      case 'ans': S.ans[el.dataset.k] = isNaN(+v) ? v : +v; save(); render(true); break;
      case 'finish': { const plan = el.dataset.skip ? G.plans[0] : suggest(); S.onboarded = true; seed(plan.id); nav('#/hoy'); break; }
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
      case 'confirmreset': sheet(`<div class="display h2">${v === 'cuenta' ? t('borrar') : t('borrarDemo')}</div><div class="small muted">${t('privTxt').split('.').slice(-2).join('.')}</div><button class="btn btn-danger btn-block mt16" data-act="reset">${v === 'cuenta' ? t('borrar') : t('borrarDemo')}</button><button class="btn btn-ghost btn-block mt8" data-act="closesheet">${t('cancelar')}</button>`); break;
      case 'reset': { const lang = S.lang; S = defaults(); S.lang = lang; save(); closeSheet(); stopTimer(); nav('#/onb/1'); render(); break; }
      case 'help': openHelp(el.dataset.m, el.dataset.ex); break;
      case 'scan': openScanner(); break;
      case 'scanto': closeSheet(); nav(el.dataset.to); break;
      case 'mqr': machineQr(el.dataset.m); break;
      case 'helpsend': helpSend(v, el.dataset.w); break;
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
  document.addEventListener('input', (ev) => { const n = ev.target.dataset && ev.target.dataset.note; if (n !== undefined) { S.mine[+n].note = ev.target.value; save(); } });

  window.addEventListener('hashchange', onHash);
  if (!location.hash) location.hash = S.onboarded ? '#/hoy' : '#/onb/1';
  STACK.push(location.hash);
  render();
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
