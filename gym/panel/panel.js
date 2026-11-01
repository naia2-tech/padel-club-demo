// Oarso Gym · panel del club (demo). Comparte los datos del navegador con la app del socio:
// lo que se publica aquí (avisos, ejercicios, tarifas, estado de máquinas, normas, planes) lo lee la app al momento.
(function () {
  const G = window.GYM;
  const $ = (s, r = document) => r.querySelector(s);
  const LS = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const K = { app: 'oarsogym.demo.v1', acc: 'oarsogym.accounts', avisos: 'oarsogym.avisos', tarifas: 'oarsogym.tarifas', over: 'oarsogym.overrides', maq: 'oarsogym.maquinas', inc: 'oarsogym.incidencias', docsv: 'oarsogym.docsv', planes: 'oarsogym.planes', bajas: 'oarsogym.bajas' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const P = {
    home: '<path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M22 20a6 6 0 0 0-5-5.9"/>', plus: '<path d="M12 5v14M5 12h14"/>', alert: '<path d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>', tool: '<path d="M14 7l3 3M5 19l9-9M16 4a3 3 0 0 1 4 4l-2 2-4-4z"/>', body: '<circle cx="12" cy="4" r="2"/><path d="M12 6v7m0 0l-4 8m4-8l4 8M5 10l7-2 7 2"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>', doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', check: '<path d="M5 12l5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', chev: '<path d="M9 6l6 6-6 6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', qr: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3v3h-3z"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>', eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>', dl: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', back: '<path d="M15 18l-6-6 6-6"/>',
  };
  const ic = (n, s) => `<svg class="ic" viewBox="0 0 24 24"${s ? ` style="width:${s}px;height:${s}px"` : ''}>${P[n] || ''}</svg>`;
  const pad2 = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const dmy = (s) => { if (!s) return '—'; const d = new Date(s); return isNaN(d) ? s : `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`; };
  const hm = (s) => { const d = new Date(s); return isNaN(d) ? '' : `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const LVL = { I: 'Para empezar', M: 'Siguiente paso', A: 'Avanzado' };
  const GRUPO = { pecho: 'Pecho', hombros: 'Hombros', brazos: 'Brazos', espalda: 'Espalda', core: 'Core', gluteo: 'Glúteo', muslo_del: 'Muslo delante', muslo_tras: 'Muslo detrás', gemelo: 'Gemelo' };

  // ---------- datos: socios, incidencias, entradas ----------
  const app = () => LS.get(K.app, {});
  const SOCIOS_DEMO = [['0401', 'Mikel', 'Arrieta', 'mikel.arrieta@ejemplo.test', 'club', -29, -1, '18:40'], ['0402', 'Maite', 'Urkiola', 'maite.u@ejemplo.test', 'gym', -29, 0, '07:55'], ['0403', 'Unai', 'Goikoetxea', 'unai.g@ejemplo.test', 'club', -28, -2, '20:10'], ['0404', 'Leire', 'Zabaleta', 'leire.z@ejemplo.test', 'gym', -27, 0, '19:05'], ['0405', 'Jon', 'Mendizabal', 'jon.m@ejemplo.test', 'club', -26, null, null], ['0406', 'Nerea', 'Lasa', 'nerea.l@ejemplo.test', 'gym', -25, -1, '09:20'], ['0407', 'Iker', 'Otegi', 'iker.o@ejemplo.test', 'club', -24, 0, '18:15'], ['0408', 'Amaia', 'Berasategi', 'amaia.b@ejemplo.test', 'gym', -22, 0, '20:30']];
  function socios() {
    const bajas = LS.get(K.bajas, {});
    const t0 = today();
    const demo = SOCIOS_DEMO.map(([num, nombre, apellidos, email, tarifa, altaOff, lastOff, lastH]) => { const alta = iso(addDays(t0, altaOff)); const pend = num === '0405'; return { num, nombre, apellidos, email, tarifa, alta, docs: pend ? {} : { normas: alta, aptitud: alta, sepa: alta, imagen: num !== '0402' ? alta : null }, pendienteFirma: pend, ultimo: lastOff == null ? null : `${iso(addDays(t0, lastOff))}T${lastH}:00`, demo: true, origen: pend ? 'recepción' : 'app' }; });
    const naia = { num: '0421', nombre: 'Naia', apellidos: 'Alberdi', email: 'naia@demo.oarso', tarifa: 'club', alta: '2026-11-03', docs: { normas: '2026-11-03T18:43', aptitud: '2026-11-03T18:41', sepa: '2026-11-03T18:45', imagen: '2026-11-03T18:44' }, pendienteFirma: false, ultimo: `${iso(t0)}T18:07:00`, demo: true, origen: 'app' };
    const acc = LS.get(K.acc, {});
    const reg = Object.keys(acc).map((email) => Object.assign({ email, origen: acc[email].origen || 'app', alta: acc[email].alta || iso(t0), ultimo: acc[email].ultimo || null }, acc[email])).filter((a) => a.role !== 'club');
    return [...demo, naia, ...reg].map((s) => Object.assign(s, { baja: !!bajas[s.email] })).sort((a, b) => a.num.localeCompare(b.num));
  }
  const socio = (key) => socios().find((s) => s.email === key || s.num === key);
  const INC_DEMO = [{ ref: 'INC-2026-0039', m: 'C4', tipo: 'nofunciona', txt: 'La pinza de seguridad no para la cinta.', at: `${iso(addDays(today(), -6))}T19:12:00`, estado: 'resuelta', por: 'Mikel', en: `${iso(addDays(today(), -5))}T10:30:00`, nota: 'Sustituida la pinza. Probada.' }, { ref: 'INC-2026-0040', m: 'P1', tipo: 'falta', txt: 'Falta una mancuerna de 12,5.', at: `${iso(addDays(today(), -2))}T20:05:00`, estado: 'en_curso', por: 'Sergio', en: `${iso(addDays(today(), -1))}T09:00:00`, nota: 'Pedida al proveedor.' }];
  const TIPO = { nofunciona: 'No funciona', falta: 'Falta una pieza o material', rota: 'Está rota o insegura', limpieza: 'Limpieza', otro: 'Otra cosa' };
  const ESTADO = { abierta: ['Abierta', 'bad'], en_curso: ['En curso', 'warn'], resuelta: ['Resuelta', 'ok'] };
  function incidencias() { const st = LS.get(K.inc, {}); const fromApp = (app().inc || []).map((i) => Object.assign({}, i)); const all = [...INC_DEMO, ...fromApp].map((i) => Object.assign({}, i, st[i.ref] || {})); return all.sort((a, b) => (a.at < b.at ? 1 : -1)); }
  function entradas() {
    const out = []; const t0 = today();
    const done = app().done || {};
    Object.keys(done).forEach((d) => done[d].forEach((e) => { if (e.type === 'entrada') out.push({ fecha: d, hora: e.at, socio: (app().auth && app().auth.nombre) || 'Socio' }); }));
    const names = SOCIOS_DEMO.filter((s) => s[6] != null).map((s) => s[1] + ' ' + s[2]);
    for (let i = 13; i >= 0; i--) { const d = iso(addDays(t0, -i)); const n = [6, 9, 11, 8, 10, 14, 5][(i + 2) % 7] + (i === 0 ? -3 : 0); for (let j = 0; j < Math.max(n, 0); j++) out.push({ fecha: d, hora: `${pad2(7 + ((j * 5 + i) % 14))}:${pad2((j * 17) % 60)}`, socio: names[(j + i) % names.length] }); }
    return out.sort((a, b) => (a.fecha + a.hora < b.fecha + b.hora ? 1 : -1));
  }
  const over = () => LS.get(K.over, {});
  const maqSt = () => LS.get(K.maq, {});
  const avisos = () => LS.get(K.avisos, null) || G.notices.map((n, i) => ({ id: 'a' + i, es: n.es, eu: n.eu, icon: n.icon, desde: iso(today()), hasta: '', donde: 'hoy', on: true }));
  const tarifas = () => LS.get(K.tarifas, null) || [{ id: 'club', es: 'Socio del club · gimnasio', eu: 'Klubeko bazkidea · gimnasioa', precio: 25, nota_es: 'Para quien ya es socio del club de pádel', nota_eu: 'Dagoeneko padel-klubeko bazkidea denarentzat' }, { id: 'gym', es: 'Solo gimnasio', eu: 'Gimnasioa bakarrik', precio: 35, nota_es: 'Sin cuota de pádel', nota_eu: 'Padel-kuotarik gabe' }];
  const tarifaN = (id) => { const x = tarifas().find((y) => y.id === id); return x ? x.es : '—'; };
  const NORMAS0 = ['El acceso a la sala es personal, con el carné de la app o el nombre en recepción.', 'Toalla obligatoria en bancos y máquinas, y limpieza del puesto al terminar.', 'El material vuelve a su sitio: discos en los soportes, mancuernas en el mancuernero.', 'Calzado deportivo limpio y ropa adecuada.', 'Los menores de 18 años necesitan autorización firmada de madre, padre o tutor.', 'No se graba ni se fotografía a otras personas sin su permiso.', 'Cualquier incidencia con una máquina, molestia o malestar se comunica en recepción.', 'Se respetan el horario, el aforo y las indicaciones del personal.'];
  const docsv = () => LS.get(K.docsv, { normas: { v: 1, fecha: '2026-10-20', items: NORMAS0 }, aptitud: { v: 1, fecha: '2026-10-20' }, sepa: { v: 1, fecha: '2026-10-20' }, imagen: { v: 1, fecha: '2026-10-20' } });
  const planOv = () => LS.get(K.planes, {});
  const planSched = (p) => (planOv()[p.id] && planOv()[p.id].sched) || p.sched;
  const exState = (id) => { const o = over()[id]; const f = G.fichas[id]; if (o && o.estado) return o.estado; return f ? 'publicado' : 'borrador'; };
  const exVideo = (id) => { const o = over()[id]; return (o && o.video) || 'pendiente'; };

  // ---------- componentes ----------
  const NAV = [['resumen', 'Resumen', 'home'], ['g', 'Socios'], ['altas', 'Altas', 'plus'], ['socios', 'Socios', 'users'], ['asistencia', 'Asistencia', 'cal'], ['g', 'Sala'], ['incidencias', 'Incidencias', 'alert'], ['avisos', 'Avisos', 'bell'], ['maquinas', 'Máquinas y pegatinas', 'tool'], ['g', 'Contenido'], ['ejercicios', 'Ejercicios', 'body'], ['planes', 'Planes', 'list'], ['sesiones', 'Sesiones', 'timer'], ['documentos', 'Documentos', 'doc'], ['g', 'Club'], ['ajustes', 'Tarifas y ajustes', 'cog']];
  function navHtml(active) {
    const incN = incidencias().filter((i) => i.estado === 'abierta').length; const pendN = socios().filter((s) => s.pendienteFirma && !s.baja).length;
    return NAV.map(([k, l, i]) => k === 'g' ? `<div class="grp">${l}</div>` : `<a href="#/${k}" class="${active === k ? 'on' : ''}">${ic(i)} ${l}${k === 'incidencias' && incN ? `<span class="n">${incN}</span>` : ''}${k === 'socios' && pendN ? `<span class="n">${pendN}</span>` : ''}</a>`).join('');
  }
  const topbar = (title, right = '') => `<div class="topbar"><h1 class="display">${title}</h1><div class="row">${right}<div class="who"><span class="av">M</span><div><b>Mikel</b><div class="xs muted">Recepción · Padel Indoor Oarso</div></div></div></div></div>`;
  const pill = (txt, cls = '') => `<span class="pill ${cls}">${txt}</span>`;
  const docsPill = (s) => { if (s.pendienteFirma) return pill('Pendiente de firma', 'warn'); const d = s.docs || {}; const n = ['normas', 'aptitud', 'sepa'].filter((k) => d[k]).length; return n === 3 ? pill(`Firmados${d.imagen ? ' · imagen' : ''}`, 'ok') : pill(`${n}/3 firmados`, 'warn'); };
  const img = (n) => (typeof n === 'string' ? `../img/${n}.jpg` : `../img/g${n}.jpg`);
  function qrSvg(text) { try { if (window.qrcode) { const q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); } } catch (e) {} return `<div class="xs mono">${esc(text)}</div>`; }
  const appBase = () => location.href.replace(/panel\/.*$/, '');
  let toastT; function toast(m) { let el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); } el.textContent = m; clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 2200); }
  function drawer(title, body, foot) { $('#over').innerHTML = `<div class="bg" data-act="close"></div><div class="drawer" role="dialog" aria-label="${esc(title)}"><div class="dh"><h2 class="display" style="font-size:24px">${title}</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('x')} Cerrar</button></div><div class="db">${body}</div>${foot ? `<div class="df">${foot}</div>` : ''}</div>`; }
  const closeDrawer = () => { $('#over').innerHTML = ''; };

  // ---------- páginas ----------
  function pgResumen() {
    const S = socios().filter((s) => !s.baja); const I = incidencias(); const E = entradas(); const hoy = iso(today());
    const mes = hoy.slice(0, 7); const altasMes = S.filter((s) => (s.alta || '').startsWith(mes)).length;
    const pub = G.exercises.filter((e) => exState(e.id) === 'publicado').length; const sinVideo = G.exercises.filter((e) => exState(e.id) === 'publicado' && exVideo(e.id) !== 'listo').length;
    const cad = S.filter((s) => s.docs && s.docs.aptitud && (new Date(s.docs.aptitud).getTime() + 365 * 864e5 - Date.now()) < 30 * 864e5).length;
    const kpi = (v, l, cls = '') => `<div class="card kpi"><div class="v ${cls}">${v}</div><div class="l">${l}</div></div>`;
    return `${topbar('Resumen', `<a class="btn btn-lime" href="#/altas">${ic('plus')} Nueva alta</a>`)}
      <div class="kpis">${kpi(S.length, 'Socios activos del gimnasio')}${kpi(altasMes, 'Altas este mes', 'lime')}${kpi(E.filter((e) => e.fecha === hoy).length, 'Entradas hoy')}${kpi(I.filter((i) => i.estado !== 'resuelta').length, 'Incidencias sin resolver', I.some((i) => i.estado === 'abierta') ? '' : 'lime')}${kpi(`${pub}/100`, 'Fichas publicadas')}${kpi(sinVideo, 'Publicadas sin vídeo')}${kpi(S.filter((s) => s.pendienteFirma).length, 'Altas pendientes de firma')}${kpi(cad, 'Declaraciones que caducan en 30 días')}</div>
      <div class="grid2 mt16">
        <div class="card"><div class="row between" style="padding:14px 16px 6px"><b>Últimas incidencias</b><a class="small" href="#/incidencias" style="color:var(--blue);font-weight:600">Ver todas</a></div><div class="list">${I.slice(0, 5).map((i) => `<div class="it"><span class="ni ${ESTADO[i.estado][1]}">${ic('alert')}</span><div class="grow"><b>${i.m ? i.m + ' · ' + (G.machine(i.m) || {}).es : '—'}</b> · ${TIPO[i.tipo]}<div class="xs muted">${i.ref} · ${dmy(i.at)} ${hm(i.at)}${i.txt ? ' · «' + esc(i.txt) + '»' : ''}</div></div>${pill(ESTADO[i.estado][0], ESTADO[i.estado][1])}</div>`).join('') || '<div class="empty">Sin incidencias</div>'}</div></div>
        <div class="card"><div class="row between" style="padding:14px 16px 6px"><b>Últimas altas</b><a class="small" href="#/socios" style="color:var(--blue);font-weight:600">Ver socios</a></div><div class="list">${S.slice().sort((a, b) => (a.alta < b.alta ? 1 : -1)).slice(0, 5).map((s) => `<div class="it"><span class="ni">${ic('users')}</span><div class="grow"><b>${s.nombre} ${s.apellidos}</b> · nº ${s.num}<div class="xs muted">${dmy(s.alta)} · ${tarifaN(s.tarifa)} · alta por ${s.origen}</div></div>${docsPill(s)}</div>`).join('')}</div></div>
      </div>
      <div class="grid2 mt16">
        <div class="card"><div class="row between" style="padding:14px 16px 6px"><b>Avisos activos en la app</b><a class="small" href="#/avisos" style="color:var(--blue);font-weight:600">Gestionar</a></div><div class="list">${avisos().filter((a) => a.on !== false).map((a) => `<div class="it"><span class="ni">${ic(a.icon || 'bell')}</span><div class="grow small">${esc(a.es)}</div><span class="xs muted">${a.donde === 'hoy' ? 'Hoy' : a.donde}</span></div>`).join('') || '<div class="empty">Sin avisos</div>'}</div></div>
        <div class="card pad"><b>Entradas · últimos 14 días</b>${bars(E)}</div>
      </div>`;
  }
  function bars(E) { const t0 = today(); const days = []; for (let i = 13; i >= 0; i--) { const d = iso(addDays(t0, -i)); days.push([d, E.filter((e) => e.fecha === d).length]); } const max = Math.max(1, ...days.map((x) => x[1])); return `<div class="bars mt12" style="margin-bottom:22px">${days.map(([d, n], i) => `<div class="${i === 13 ? 'now' : ''}" style="height:${Math.max(4, n / max * 100)}%"><b>${n}</b><span>${d.slice(8)}</span></div>`).join('')}</div>`; }

  function pgAltas(done) {
    const T = tarifas(); const url = appBase() + '#/registro/1';
    return `${topbar('Altas de socios')}
      <div class="grid2">
        <div class="card pad"><div class="eyebrow">Opción 1</div><h2 class="display" style="font-size:26px;margin:4px 0 8px">La recepción hace el alta</h2><p class="small muted">Para quien prefiere que se lo hagan. Se crea la cuenta, se entregan usuario y contraseña temporal, y la persona firma los documentos y la domiciliación en la tableta de recepción.</p>
          ${done ? `<div class="card pad mt12" style="border-color:var(--ok)"><div class="row between"><b>${ic('check')} Alta creada · nº ${done.num}</b>${pill('Pendiente de firma', 'warn')}</div><div class="cred mt8">Usuario: ${esc(done.email)}<br>Contraseña temporal: <b>${done.pass}</b></div><div class="small muted mt8">Entrega estos datos al socio. En la tableta, abre el enlace de firma: entra con su usuario y pasa directamente a los documentos.</div><div class="row mt12 wrap"><a class="btn btn-lime" href="${appBase()}?e=${encodeURIComponent(done.email)}#/login" target="_blank" rel="noopener">${ic('doc')} Firmar ahora en la tableta ↗</a><button class="btn btn-ghost" data-act="mail" data-v="${esc(done.email)}">${ic('mail')} Enviar credenciales por correo</button><button class="btn btn-ghost" data-act="nav" data-to="#/altas">Otra alta</button></div></div>` : `<form id="alta-f" class="mt8" onsubmit="return false">
          <div class="two"><label class="fld"><span>Nombre</span><input class="input" name="nombre" required></label><label class="fld"><span>Apellidos</span><input class="input" name="apellidos" required></label></div>
          <div class="two"><label class="fld"><span>Correo electrónico</span><input class="input" name="email" type="email" required></label><label class="fld"><span>Móvil</span><input class="input" name="movil" type="tel"></label></div>
          <div class="two"><label class="fld"><span>Fecha de nacimiento</span><input class="input" name="nac" type="date" required><div class="help">Mayores de 16. Menores de 18: autorización firmada por madre, padre o tutor.</div></label><label class="fld"><span>Tarifa</span><select class="input" name="tarifa">${T.map((x) => `<option value="${x.id}">${esc(x.es)} · ${x.precio} €/mes</option>`).join('')}</select></label></div>
          <label class="fld"><span>Idioma de los documentos</span><select class="input" name="idioma"><option value="es">Castellano</option><option value="eu">Euskera</option></select></label>
          <div class="xs mt8" id="alta-err" style="color:var(--bad);min-height:14px"></div>
          <button class="btn btn-primary mt8" data-act="alta">${ic('plus')} Crear la cuenta y pasar a la firma</button></form>`}
        </div>
        <div class="card pad"><div class="eyebrow">Opción 2</div><h2 class="display" style="font-size:26px;margin:4px 0 8px">La persona se registra sola</h2><p class="small muted">Desde su móvil, con este enlace o el QR del mostrador: datos, tarifa, documentos, domiciliación y firma. Al terminar ya es socia y aparece aquí.</p>
          <div class="row mt12" style="align-items:flex-start;gap:16px"><div class="qrbox">${qrSvg(url)}</div><div class="grow"><div class="xs muted">Enlace de registro</div><div class="mono small" style="word-break:break-all">${esc(url)}</div><button class="btn btn-ghost btn-sm mt8" data-act="copy" data-v="${esc(url)}">Copiar enlace</button><div class="hint mt12">Nadie entra en la app sin haber firmado las normas, la declaración de aptitud y la domiciliación. La cuenta de gestión del club (<span class="mono">club@oarso</span>) es la única exenta.</div></div></div>
        </div>
      </div>
      <div class="card pad mt16"><b>Qué firma cada socio</b><div class="grid3 mt12">${[['Normas del gimnasio', 'Versión ' + docsv().normas.v], ['Declaración de aptitud (PAR-Q+)', 'Las respuestas no se guardan en la app; solo el PDF firmado, custodiado por el club'], ['Mandato de domiciliación SEPA', 'IBAN y titular · cuota mensual el día 1'], ['Autorización de imagen', 'Opcional y revocable']].map(([a, b]) => `<div class="card pad" style="box-shadow:none"><b class="small">${a}</b><div class="xs muted mt8">${b}</div></div>`).join('')}</div></div>`;
  }

  let Q = { socios: '', ej: '', ejGrupo: 'all', ejEstado: 'all', incEstado: 'all' };
  function pgSocios() {
    const q = Q.socios.trim().toLowerCase(); const S = socios().filter((s) => !q || `${s.nombre} ${s.apellidos} ${s.email} ${s.num}`.toLowerCase().includes(q));
    return `${topbar('Socios del gimnasio', `<a class="btn btn-lime" href="#/altas">${ic('plus')} Nueva alta</a>`)}
      <div class="card"><div class="row between" style="padding:12px 16px"><div class="search grow" style="max-width:360px">${ic('search')}<input class="input" id="q-socios" placeholder="Buscar por nombre, correo o número" value="${esc(Q.socios)}"></div><span class="small muted">${S.length} socios · ${S.filter((s) => s.pendienteFirma).length} pendientes de firma · ${S.filter((s) => s.baja).length} bajas</span></div>
      <table class="tb"><thead><tr><th>Nº</th><th>Socio</th><th>Tarifa</th><th>Alta</th><th>Documentos</th><th>Cuota</th><th>Último acceso</th><th></th></tr></thead><tbody>${S.map((s) => `<tr class="click" data-act="nav" data-to="#/socios/${encodeURIComponent(s.email)}"><td class="num">${s.num}</td><td><b>${s.nombre} ${s.apellidos}</b><div class="xs muted">${esc(s.email)}</div></td><td>${tarifaN(s.tarifa)}</td><td>${dmy(s.alta)}<div class="xs muted">por ${s.origen}</div></td><td>${docsPill(s)}</td><td>${s.baja ? pill('Baja', 'bad') : s.pendienteFirma ? pill('Sin domiciliar', 'warn') : pill('Al día', 'ok')}</td><td class="small">${s.ultimo ? dmy(s.ultimo) + ' ' + hm(s.ultimo) : '—'}</td><td>${ic('chev')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function pgSocio(key) {
    const s = socio(decodeURIComponent(key)); if (!s) return pgSocios();
    const d = s.docs || {}; const DN = { normas: 'Normas del gimnasio', aptitud: 'Declaración de aptitud (PAR-Q+)', sepa: 'Mandato de domiciliación SEPA', imagen: 'Autorización de uso de imagen' };
    const E = entradas().filter((e) => e.socio === `${s.nombre} ${s.apellidos}`).slice(0, 8);
    return `${topbar(`${s.nombre} ${s.apellidos}`, `<a class="btn btn-ghost" href="#/socios">${ic('back')} Socios</a>`)}
      <div class="grid2">
        <div class="card pad"><div class="row between"><div><div class="eyebrow">Socio nº ${s.num}</div><div class="small mt8">${esc(s.email)}${s.movil ? ' · ' + esc(s.movil) : ''}</div></div>${s.baja ? pill('Baja', 'bad') : pill('Activo', 'ok')}</div>
          <table class="tb mt12"><tbody><tr><td class="muted">Tarifa</td><td><b>${tarifaN(s.tarifa)}</b></td></tr><tr><td class="muted">Alta</td><td>${dmy(s.alta)} · por ${s.origen}</td></tr><tr><td class="muted">Domiciliación</td><td>${d.sepa ? `IBAN ····${s.iban4 || '····'} · titular ${esc(s.titular || s.nombre + ' ' + s.apellidos)}` : pill('Pendiente', 'warn')}</td></tr><tr><td class="muted">Declaración de aptitud</td><td>${d.aptitud ? `${dmy(d.aptitud)} · caduca el ${dmy(new Date(new Date(d.aptitud).getTime() + 365 * 864e5))}${s.parq === 'valoracion' ? ' · ' + pill('Necesita valoración', 'warn') : ''}` : pill('Pendiente', 'warn')}</td></tr><tr><td class="muted">Último acceso</td><td>${s.ultimo ? dmy(s.ultimo) + ' ' + hm(s.ultimo) : '—'}</td></tr></tbody></table>
          <div class="row mt12 wrap">${s.pendienteFirma ? `<a class="btn btn-lime" href="${appBase()}?e=${encodeURIComponent(s.email)}#/login" target="_blank" rel="noopener">${ic('doc')} Firmar en la tableta ↗</a>` : ''}<button class="btn btn-ghost" data-act="mail" data-v="${esc(s.email)}">${ic('mail')} Reenviar acceso</button>${s.baja ? `<button class="btn btn-ghost" data-act="alta2" data-v="${esc(s.email)}">Reactivar</button>` : `<button class="btn btn-danger" data-act="baja" data-v="${esc(s.email)}">Dar de baja</button>`}</div></div>
        <div class="card"><div style="padding:14px 16px 6px"><b>Documentos firmados</b></div><div class="list">${Object.keys(DN).map((k) => `<div class="it"><span class="ni ${d[k] ? 'ok' : 'warn'}">${ic('doc')}</span><div class="grow"><b class="small">${DN[k]}</b><div class="xs muted">${d[k] ? `Firmado el ${dmy(d[k])} ${hm(d[k])} · versión ${docsv()[k] ? docsv()[k].v : 1}` : k === 'imagen' ? 'No autorizada (opcional)' : 'Pendiente de firma'}</div></div>${d[k] ? `<button class="btn btn-ghost btn-sm" data-act="pdfinfo">${ic('dl')} PDF</button>` : ''}</div>`).join('')}</div><div class="xs muted" style="padding:10px 16px">Los PDF originales con firma, hora, IP y huella se custodian en el almacén privado del club. El socio ve los suyos en su carné.</div></div>
      </div>
      <div class="card mt16"><div style="padding:14px 16px 6px"><b>Últimas entradas</b></div><table class="tb"><tbody>${E.map((e) => `<tr><td>${dmy(e.fecha)}</td><td>${e.hora}</td><td class="muted">recepción</td></tr>`).join('') || '<tr><td class="empty">Sin entradas registradas</td></tr>'}</tbody></table></div>`;
  }

  function pgIncidencias() {
    const I = incidencias().filter((i) => Q.incEstado === 'all' || i.estado === Q.incEstado);
    return `${topbar('Incidencias de la sala')}
      <div class="chips mb12">${[['all', 'Todas'], ['abierta', 'Abiertas'], ['en_curso', 'En curso'], ['resuelta', 'Resueltas']].map(([k, l]) => `<button class="chip ${Q.incEstado === k ? 'on' : ''}" data-act="finc" data-v="${k}">${l}</button>`).join('')}</div>
      <div class="card"><table class="tb"><thead><tr><th>Ref.</th><th>Máquina</th><th>Qué pasa</th><th>Cuándo</th><th>Estado</th><th></th></tr></thead><tbody>${I.map((i) => `<tr class="click" data-act="inc" data-v="${i.ref}"><td class="num">${i.ref}</td><td><b>${i.m || '—'}</b> ${i.m ? (G.machine(i.m) || {}).es || '' : ''}</td><td>${TIPO[i.tipo]}${i.txt ? `<div class="xs muted">«${esc(i.txt)}»</div>` : ''}${i.foto ? pill('con foto', 'blue') : ''}</td><td class="small">${dmy(i.at)} ${hm(i.at)}</td><td>${pill(ESTADO[i.estado][0], ESTADO[i.estado][1])}${i.por ? `<div class="xs muted">${i.por}</div>` : ''}</td><td>${ic('chev')}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">No hay incidencias en este estado</td></tr>'}</tbody></table></div>
      <div class="hint mt12">Las incidencias llegan desde la app del socio («Avisar de una incidencia» en cada máquina y ejercicio). No son avisos de auxilio: sirven para que el club arregle lo que falla. Si una afecta al uso de la máquina, publícala como aviso y marca la máquina «en revisión».</div>`;
  }
  function incDrawer(ref) {
    const i = incidencias().find((x) => x.ref === ref); if (!i) return;
    const m = i.m ? G.machine(i.m) : null; const ms = maqSt()[i.m] || {};
    drawer(`Incidencia ${ref}`, `<div class="row between"><div><b>${m ? m.code + ' · ' + m.es : 'Sin máquina'}</b><div class="small muted">${TIPO[i.tipo]} · ${dmy(i.at)} ${hm(i.at)}</div></div>${pill(ESTADO[i.estado][0], ESTADO[i.estado][1])}</div>
      ${i.txt ? `<div class="card pad mt12" style="box-shadow:none"><div class="eyebrow">Comentario del socio</div><div class="mt8">«${esc(i.txt)}»</div></div>` : ''}${i.foto ? `<div class="xs muted mt8">El socio adjuntó una foto (en la demo no se guarda).</div>` : ''}
      <label class="fld"><span>Estado</span><select class="input" id="inc-estado">${Object.keys(ESTADO).map((k) => `<option value="${k}" ${i.estado === k ? 'selected' : ''}>${ESTADO[k][0]}</option>`).join('')}</select></label>
      <label class="fld"><span>Nota interna</span><textarea class="input" id="inc-nota" placeholder="Qué se ha hecho, a quién se ha pedido…">${esc(i.nota || '')}</textarea></label>
      ${m ? `<label class="fld"><span>Estado de la máquina en la app</span><select class="input" id="inc-maq"><option value="activa" ${!ms.estado || ms.estado === 'activa' ? 'selected' : ''}>Activa</option><option value="revision" ${ms.estado === 'revision' ? 'selected' : ''}>En revisión (la app lo avisa)</option><option value="retirada" ${ms.estado === 'retirada' ? 'selected' : ''}>Retirada</option></select></label>` : ''}
      <label class="fld" style="display:flex;align-items:center;gap:10px;margin-top:14px"><input type="checkbox" id="inc-aviso" style="width:18px;height:18px"> <span style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--ink)">Publicar también un aviso en la app para los socios</span></label>`,
      `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="incsave" data-v="${ref}">${ic('check')} Guardar</button>`);
  }

  function pgAvisos() {
    const A = avisos();
    return `${topbar('Avisos en la app', `<button class="btn btn-lime" data-act="avisoed" data-v="new">${ic('plus')} Nuevo aviso</button>`)}
      <div class="card"><div class="list">${A.map((a) => `<div class="it"><span class="ni">${ic(a.icon || 'bell')}</span><div class="grow"><div class="small"><b>${esc(a.es)}</b></div><div class="xs muted">${esc(a.eu || 'Sin euskera')}</div><div class="xs muted mt8">${a.donde === 'hoy' ? 'En Hoy' : 'En la máquina ' + a.donde}${a.desde ? ' · desde ' + dmy(a.desde) : ''}${a.hasta ? ' · hasta ' + dmy(a.hasta) : ''}</div></div><button class="switch ${a.on !== false ? 'on' : ''}" data-act="avisoon" data-v="${a.id}" aria-label="Activo"></button><button class="btn btn-ghost btn-sm" data-act="avisoed" data-v="${a.id}">Editar</button></div>`).join('') || '<div class="empty">Sin avisos</div>'}</div></div>
      <div class="hint mt12">Lo que esté activo se ve en la pantalla Hoy de todos los socios (o en la máquina elegida). Recepción puede crear y quitar avisos; no hace falta nadie técnico.</div>`;
  }
  function avisoDrawer(id) {
    const a = avisos().find((x) => x.id === id) || { id: 'a' + Date.now(), es: '', eu: '', icon: 'bell', desde: iso(today()), hasta: '', donde: 'hoy', on: true };
    drawer(id === 'new' ? 'Nuevo aviso' : 'Editar aviso', `<div class="edit2"><div class="colh">Castellano</div><div class="colh">Euskera</div><label class="fld"><span>Texto</span><textarea class="input" id="av-es">${esc(a.es)}</textarea></label><label class="fld"><span>Testua</span><textarea class="input" id="av-eu">${esc(a.eu)}</textarea></label></div>
      <div class="two"><label class="fld"><span>Icono</span><select class="input" id="av-icon">${[['bell', 'Aviso'], ['clock', 'Horario'], ['tool', 'Máquina'], ['star', 'Novedad']].map(([k, l]) => `<option value="${k}" ${a.icon === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label><label class="fld"><span>Dónde se muestra</span><select class="input" id="av-donde"><option value="hoy" ${a.donde === 'hoy' ? 'selected' : ''}>Pantalla Hoy</option>${G.machines.map((m) => `<option value="${m.code}" ${a.donde === m.code ? 'selected' : ''}>Máquina ${m.code} · ${m.es}</option>`).join('')}</select></label></div>
      <div class="two"><label class="fld"><span>Desde</span><input class="input" type="date" id="av-desde" value="${a.desde || ''}"></label><label class="fld"><span>Hasta (opcional)</span><input class="input" type="date" id="av-hasta" value="${a.hasta || ''}"></label></div>`,
      `${id !== 'new' ? `<button class="btn btn-danger" data-act="avisodel" data-v="${a.id}">Borrar</button>` : ''}<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="avisosave" data-v="${a.id}">${ic('check')} Publicar</button>`);
  }

  function pgMaquinas() {
    const st = maqSt();
    return `${topbar('Máquinas y pegatinas', `<a class="btn btn-lime" href="${appBase()}#/pegatinas" target="_blank" rel="noopener">${ic('qr')} Hoja de pegatinas ↗</a>`)}
      <div class="grid3">${G.machines.map((m) => { const s = st[m.code] || {}; const n = G.exercises.filter((e) => e.where.includes(m.code)).length; return `<div class="card mcard"><div class="ph">${m.img ? `<img src="${img(m.img)}" alt="" loading="lazy">` : ''}${pill(m.code, 'lime')}</div><div style="padding:12px 14px"><div class="row between"><b>${m.es}</b>${pill(s.estado === 'revision' ? 'En revisión' : s.estado === 'retirada' ? 'Retirada' : 'Activa', s.estado === 'revision' ? 'warn' : s.estado === 'retirada' ? 'bad' : 'ok')}</div><div class="xs muted">${m.model || ''}</div><div class="xs muted mt8">${n} ejercicios · QR → <span class="mono">/m/${m.code.toLowerCase()}</span></div><div class="row mt12"><select class="input" data-act="maqst" data-v="${m.code}" style="min-height:32px;padding:4px 8px;font-size:12.5px"><option value="activa" ${!s.estado || s.estado === 'activa' ? 'selected' : ''}>Activa</option><option value="revision" ${s.estado === 'revision' ? 'selected' : ''}>En revisión</option><option value="retirada" ${s.estado === 'retirada' ? 'selected' : ''}>Retirada</option></select><a class="btn btn-ghost btn-sm" href="${appBase()}#/m/${m.code.toLowerCase()}" target="_blank" rel="noopener">${ic('eye')} Ver</a></div></div></div>`; }).join('')}</div>
      <div class="hint mt12">«En revisión» muestra un aviso en la ficha de la máquina y propone la alternativa; «Retirada» la oculta del catálogo y el QR redirige a la alternativa. Las pegatinas no cambian: el destino lo resuelve el servidor.</div>`;
  }

  function pgEjercicios() {
    const q = Q.ej.trim().toLowerCase();
    let L = G.exercises.filter((e) => (Q.ejGrupo === 'all' || e.regions.includes(Q.ejGrupo)) && (Q.ejEstado === 'all' || exState(e.id) === Q.ejEstado) && (!q || `${e.es} ${e.eu} ${e.where}`.toLowerCase().includes(q)));
    const o = over();
    return `${topbar('Ejercicios', `<span class="small muted">${G.exercises.filter((e) => exState(e.id) === 'publicado').length} publicados · ${G.exercises.filter((e) => exState(e.id) === 'borrador').length} en borrador</span>`)}
      <div class="card"><div class="row between wrap" style="padding:12px 16px;gap:10px"><div class="search" style="width:300px">${ic('search')}<input class="input" id="q-ej" placeholder="Buscar ejercicio" value="${esc(Q.ej)}"></div><div class="chips">${[['all', 'Todos'], ...Object.keys(GRUPO).map((k) => [k, GRUPO[k]])].map(([k, l]) => `<button class="chip ${Q.ejGrupo === k ? 'on' : ''}" data-act="fgrupo" data-v="${k}">${l}</button>`).join('')}</div><div class="chips">${[['all', 'Todos'], ['publicado', 'Publicados'], ['borrador', 'Borrador']].map(([k, l]) => `<button class="chip ${Q.ejEstado === k ? 'on' : ''}" data-act="festado" data-v="${k}">${l}</button>`).join('')}</div></div>
      <table class="tb"><thead><tr><th></th><th>Ejercicio</th><th>Dónde</th><th>Nivel</th><th>Vídeo</th><th>Estado</th><th>Revisado por</th><th></th></tr></thead><tbody>${L.map((e) => { const ov = o[e.id] || {}; const st = exState(e.id); return `<tr class="click" data-act="exed" data-v="${e.id}"><td><img class="th" src="${img(e.img)}" alt="" loading="lazy"></td><td><b>${esc(ov.es || e.es)}</b><div class="xs muted">${esc(ov.eu || e.eu)}</div></td><td class="small">${e.where}</td><td>${LVL[ov.lvl || e.lvl]}</td><td>${exVideo(e.id) === 'listo' ? pill('Listo', 'ok') : pill('Pendiente', 'warn')}</td><td>${st === 'publicado' ? pill('Publicado', 'ok') : pill('Borrador', '')}</td><td class="small">${ov.revisado ? esc(ov.revisado) : '<span class="muted">—</span>'}</td><td>${ic('chev')}</td></tr>`; }).join('')}</tbody></table></div>`;
  }
  let ED = null;
  function exDrawer(id) {
    const e = G.ex(id); const f = G.fichas[id] || {}; const o = over()[id] || {};
    ED = { id, es: o.es || e.es, eu: o.eu || e.eu, lvl: o.lvl || e.lvl, aj: o.aj || f.aj || [], haz: o.haz || f.haz || [], ev: o.ev || f.ev || [], dosis: o.dosis || f.dosis || '', reg: o.reg || f.reg || '', facil: o.facil !== undefined ? o.facil : f.facil || '', dificil: o.dificil !== undefined ? o.dificil : f.dificil || '', video: o.video || 'pendiente', revisado: o.revisado || '', titulo: o.titulo || '', estado: exState(id) };
    renderEx();
  }
  function renderEx() {
    const e = G.ex(ED.id); const lines = (k, label, help) => `<div class="fld"><span>${label}</span><div class="steps-ed">${ED[k].map((s, i) => `<div class="li"><span class="n">${i + 1}</span><textarea class="input" rows="2" data-f="${k}" data-i="${i}">${esc(s)}</textarea><button data-act="rmline" data-k="${k}" data-i="${i}" aria-label="Quitar">${ic('x')}</button></div>`).join('')}</div><button class="btn btn-ghost btn-sm mt8" data-act="addline" data-k="${k}">${ic('plus')} Añadir</button>${help ? `<div class="help">${help}</div>` : ''}</div>`;
    const exOpt = (sel) => `<option value="">—</option>` + G.exercises.map((x) => `<option value="${x.id}" ${String(sel) === String(x.id) ? 'selected' : ''}>${x.es}</option>`).join('');
    drawer(`Ficha · ${esc(e.es)}`, `<div class="preview"><div>
        <div class="row between"><div>${pill(ED.estado === 'publicado' ? 'Publicado' : 'Borrador', ED.estado === 'publicado' ? 'ok' : '')} ${pill(e.where, 'blue')} ${pill(e.regions.map((r) => GRUPO[r]).join(' · '))}</div></div>
        <div class="edit2 mt12"><div class="colh">Castellano</div><div class="colh">Euskera</div><label class="fld"><span>Nombre</span><input class="input" data-f="es" value="${esc(ED.es)}"></label><label class="fld"><span>Izena</span><input class="input" data-f="eu" value="${esc(ED.eu)}"></label></div>
        <div class="two"><label class="fld"><span>Nivel</span><select class="input" data-f="lvl">${Object.keys(LVL).map((k) => `<option value="${k}" ${ED.lvl === k ? 'selected' : ''}>${LVL[k]}</option>`).join('')}</select></label><label class="fld"><span>Vídeo</span><select class="input" data-f="video"><option value="pendiente" ${ED.video === 'pendiente' ? 'selected' : ''}>Pendiente de grabar</option><option value="procesando" ${ED.video === 'procesando' ? 'selected' : ''}>Subido, procesando</option><option value="listo" ${ED.video === 'listo' ? 'selected' : ''}>Listo</option></select><div class="help">20 a 45 s, en bucle, sin sonido: primero el ajuste, luego una o dos repeticiones. Se sube desde el móvil.</div></label></div>
        ${lines('aj', 'Ajusta', 'Asiento, respaldo, agarre, topes. Una línea por ajuste.')}${lines('haz', 'Hazlo así', 'De 3 a 5 pasos, en imperativo, frases de 15 palabras o menos.')}${lines('ev', 'Evita', 'De 2 a 4 errores frecuentes.')}
        <label class="fld"><span>Cuánto, orientativo</span><input class="input" data-f="dosis" value="${esc(ED.dosis)}" placeholder="2 o 3 series de 8 a 12 · 1 a 2 minutos de descanso"></label>
        <label class="fld"><span>Cómo regular la intensidad en este ejercicio</span><textarea class="input" data-f="reg">${esc(ED.reg)}</textarea><div class="help">Tipo de carga: <b>${{ ext: 'externa (peso en placas, mancuerna, kettlebell o barra)', bw: 'el propio cuerpo (versión más fácil / más difícil)', band: 'goma (color o grosor)', iso: 'isométrico (tiempo)', mov: 'movilidad (sin peso)' }[G.loadType(e)]}</b>. Si se deja vacío, la app usa el texto estándar de ese tipo.</div></label>
        <div class="two"><label class="fld"><span>Más fácil</span><select class="input" data-f="facil">${exOpt(ED.facil)}</select></label><label class="fld"><span>Más difícil</span><select class="input" data-f="dificil">${exOpt(ED.dificil)}</select></label></div>
        <div class="two"><label class="fld"><span>Revisado por</span><input class="input" data-f="revisado" value="${esc(ED.revisado)}" placeholder="Nombre y apellidos"></label><label class="fld"><span>Titulación</span><input class="input" data-f="titulo" value="${esc(ED.titulo)}" placeholder="Grado CAFyD · TSEAS"></label></div>
        <div class="hint mt12">Para publicar hacen falta: 3 pasos o más, al menos un error que evitar, la dosis y quién lo revisa con su titulación (Ley 8/2022). Sin vídeo listo se puede publicar solo marcando «vídeo pendiente».</div>
      </div><div><div class="eyebrow mb8">Así lo ve el socio</div><div class="phone"><iframe id="prev" src="${appBase()}?p=${Date.now()}#/e/${ED.id}" title="Vista previa"></iframe></div><div class="xs muted mt8" style="text-align:center">La vista previa enseña lo publicado. Guarda y publica para verlo aquí.</div></div></div>`,
      `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-ghost" data-act="exsave" data-v="borrador">Guardar borrador</button><button class="btn btn-primary" data-act="exsave" data-v="publicado">${ic('check')} Publicar</button>`);
  }
  function exSave(estado) {
    const miss = []; if (estado === 'publicado') { if (ED.haz.filter(Boolean).length < 3) miss.push('3 pasos'); if (!ED.ev.filter(Boolean).length) miss.push('un error que evitar'); if (!ED.dosis.trim()) miss.push('la dosis'); if (!ED.revisado.trim() || !ED.titulo.trim()) miss.push('revisor y titulación'); }
    if (miss.length) { toast('Para publicar falta: ' + miss.join(', ')); return; }
    const o = over(); o[ED.id] = Object.assign({}, ED, { aj: ED.aj.filter(Boolean), haz: ED.haz.filter(Boolean), ev: ED.ev.filter(Boolean), facil: ED.facil ? +ED.facil : null, dificil: ED.dificil ? +ED.dificil : null, estado, actualizado: new Date().toISOString() }); delete o[ED.id].id; LS.set(K.over, o);
    toast(estado === 'publicado' ? 'Publicado: ya se ve en la app' : 'Borrador guardado'); ED.estado = estado; const fr = $('#prev'); if (fr) fr.src = `${appBase()}?p=${Date.now()}#/e/${ED.id}`; render(true);
  }

  function pgPlanes() {
    return `${topbar('Planes del club')}
      <div class="grid2">${G.plans.map((p) => { const sch = planSched(p); const ov = planOv()[p.id]; return `<div class="card pad"><div class="row between"><div><div class="eyebrow">${{ empezar: 'Ponerme en forma', fuerza: 'Ganar fuerza', padel: 'Complemento al pádel' }[p.obj]}</div><b style="font-size:16px">${p.es}</b><div class="xs muted">${p.eu}</div></div>${ov ? pill('Editado', 'blue') : pill('Original', '')}</div><div class="small muted mt8">${p.days} días a la semana · ${p.min} min · ${p.weeks} semanas · ${sch.reduce((a, d) => a + d.main.length, 0)} ejercicios</div><div class="row mt12">${sch.map((d) => pill(`Día ${d.k} · ${d.main.length}`)).join('')}</div><div class="row mt12"><button class="btn btn-primary btn-sm" data-act="planed" data-v="${p.id}">Editar días</button><a class="btn btn-ghost btn-sm" href="${appBase()}#/plan/${p.id}" target="_blank" rel="noopener">${ic('eye')} Ver en la app</a></div></div>`; }).join('')}</div>
      <div class="hint mt12">Los cambios se publican como versión nueva: quien ya sigue el plan ve la nueva distribución desde su próxima sesión y recibe un aviso. La base científica de cada plan está en los documentos 04 y 08.</div>`;
  }
  let PE = null;
  function planDrawer(id) { const p = G.plan(id); PE = { id, sched: JSON.parse(JSON.stringify(planSched(p))) }; renderPlan(); }
  function renderPlan() {
    const p = G.plan(PE.id);
    const exOpt = G.exercises.map((x) => `<option value="${x.id}">${x.es}</option>`).join('');
    drawer(`Plan · ${p.es}`, PE.sched.map((d, di) => `<div class="card pad mt12" style="box-shadow:none"><div class="row between"><b>Día ${d.k}</b><span class="small muted">${d.main.length} ejercicios</span></div>
        <table class="tb mt8"><tbody>${d.main.map(([eid, dose, opt], i) => `<tr><td style="width:36px" class="num">${i + 1}</td><td><b>${(G.ex(eid) || {}).es || eid}</b><div class="xs muted">${(G.ex(eid) || {}).where || ''}</div></td><td style="width:170px"><input class="input" style="min-height:32px" value="${esc(dose)}" data-pd="${di}" data-pi="${i}"></td><td style="width:110px"><label class="row small"><input type="checkbox" data-po="${di}" data-pi="${i}" ${opt ? 'checked' : ''}> opcional</label></td><td style="width:70px"><div class="row" style="gap:2px"><button class="btn btn-ghost btn-sm" data-act="pmove" data-d="${di}" data-i="${i}" data-v="-1" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn btn-ghost btn-sm" data-act="pmove" data-d="${di}" data-i="${i}" data-v="1" ${i === d.main.length - 1 ? 'disabled' : ''}>↓</button><button class="btn btn-ghost btn-sm" data-act="prm" data-d="${di}" data-i="${i}">${ic('x')}</button></div></td></tr>`).join('')}</tbody></table>
        <div class="row mt8"><select class="input" style="max-width:320px" id="padd-${di}">${exOpt}</select><button class="btn btn-ghost btn-sm" data-act="padd" data-d="${di}">${ic('plus')} Añadir ejercicio</button></div></div>`).join(''),
      `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-ghost" data-act="planreset" data-v="${PE.id}">Volver al original</button><button class="btn btn-primary" data-act="plansave">${ic('check')} Publicar versión nueva</button>`);
  }

  function pgSesiones() {
    return `${topbar('Sesiones: circuitos y cardio')}
      <div class="grid2"><div class="card"><div style="padding:14px 16px 6px"><b>Circuitos</b></div><div class="list">${G.circuits.map((c) => `<div class="it"><img class="th" src="${img(c.img)}" alt=""><div class="grow"><b>${c.es}</b><div class="xs muted">${c.min} min · ${c.rounds} rondas · ${c.work}" trabajo / ${c.rest}" descanso · ${c.st.length} estaciones</div></div><a class="btn btn-ghost btn-sm" href="${appBase()}#/circuito/${c.id}" target="_blank" rel="noopener">${ic('eye')} Ver</a></div>`).join('')}</div></div>
      <div class="card"><div style="padding:14px 16px 6px"><b>Cardio por máquina</b></div><div class="list">${G.cardio.map((c) => `<div class="it"><span class="ni">${ic('timer')}</span><div class="grow"><b>${c.m} · ${c.es}</b><div class="xs muted">${c.prot.map((p) => p.es + ' (' + p.total + "')").join(' · ')}</div></div><a class="btn btn-ghost btn-sm" href="${appBase()}#/cardio/${c.m.toLowerCase()}" target="_blank" rel="noopener">${ic('eye')} Ver</a></div>`).join('')}</div></div></div>
      <div class="hint mt12">El editor de sesiones (estaciones, tiempos, protocolos) sigue el mismo patrón que el de planes y llega en la siguiente entrega de la demo.</div>`;
  }

  function pgDocumentos() {
    const D = docsv(); const DN = { normas: 'Normas del gimnasio', aptitud: 'Declaración de aptitud (PAR-Q+)', sepa: 'Mandato de domiciliación SEPA', imagen: 'Autorización de uso de imagen' };
    return `${topbar('Documentos que firma el socio')}
      <div class="grid2">${Object.keys(DN).map((k) => `<div class="card pad"><div class="row between"><b>${DN[k]}</b>${pill('Versión ' + D[k].v, 'blue')}</div><div class="xs muted mt8">Vigente desde ${dmy(D[k].fecha)} · castellano y euskera</div>${k === 'normas' ? `<ol class="small mt12" style="padding-left:18px;color:var(--ink-2)">${D.normas.items.map((r) => `<li style="margin:4px 0">${esc(r)}</li>`).join('')}</ol><button class="btn btn-primary btn-sm mt8" data-act="normased">Nueva versión de las normas</button>` : k === 'aptitud' ? `<p class="small mt12">Cuestionario oficial PAR-Q+ 2025, sin modificaciones. Las respuestas no se guardan en la app: solo el PDF firmado, en el almacén restringido.</p>` : k === 'sepa' ? `<p class="small mt12">Texto del mandato de adeudo directo SEPA (pago recurrente). El identificador del acreedor lo facilita el banco del club antes de la apertura.</p>` : `<p class="small mt12">Opcional. Se puede retirar en recepción; la retirada no afecta a los usos anteriores.</p>`}</div>`).join('')}</div>
      <div class="hint mt12">Una versión nunca se modifica: se crea otra con fecha. Cada firma queda ligada a la versión exacta que la persona leyó.</div>`;
  }

  function pgAsistencia() {
    const E = entradas(); const hoy = iso(today());
    return `${topbar('Asistencia', `<button class="btn btn-ghost" data-act="csv">${ic('dl')} Exportar CSV</button>`)}
      <div class="grid2"><div class="card pad"><b>Entradas por día · últimos 14 días</b>${bars(E)}</div><div class="card pad"><b>Hoy</b><div class="kpis mt12"><div class="card kpi" style="box-shadow:none"><div class="v">${E.filter((e) => e.fecha === hoy).length}</div><div class="l">Entradas</div></div><div class="card kpi" style="box-shadow:none"><div class="v">${new Set(E.filter((e) => e.fecha === hoy).map((e) => e.socio)).size}</div><div class="l">Socios distintos</div></div><div class="card kpi" style="box-shadow:none"><div class="v">${(() => { const h = {}; E.filter((e) => e.fecha === hoy).forEach((e) => { const k = e.hora.slice(0, 2); h[k] = (h[k] || 0) + 1; }); const top = Object.entries(h).sort((a, b) => b[1] - a[1])[0]; return top ? top[0] + 'h' : '—'; })()}</div><div class="l">Hora punta</div></div></div><div class="xs muted mt12">Solo se registra la fecha y la hora de entrada con el carné. Nada más.</div></div></div>
      <div class="card mt16"><table class="tb"><thead><tr><th>Fecha</th><th>Hora</th><th>Socio</th><th>Vía</th></tr></thead><tbody>${E.slice(0, 40).map((e) => `<tr><td>${dmy(e.fecha)}</td><td>${e.hora}</td><td>${esc(e.socio)}</td><td class="muted">recepción</td></tr>`).join('')}</tbody></table></div>`;
  }

  function pgAjustes() {
    const T = tarifas();
    return `${topbar('Tarifas y ajustes')}
      <div class="grid2">
        <div class="card pad"><b>Tarifas del gimnasio</b><div class="xs muted mt8">Las ve el socio al registrarse y en su carné. Precios de ejemplo en la demo: los fija el club.</div>
          ${T.map((x, i) => `<div class="card pad mt12" style="box-shadow:none"><div class="two"><label class="fld"><span>Nombre (castellano)</span><input class="input" data-tf="es" data-i="${i}" value="${esc(x.es)}"></label><label class="fld"><span>Izena (euskera)</span><input class="input" data-tf="eu" data-i="${i}" value="${esc(x.eu)}"></label></div><div class="two"><label class="fld"><span>Precio €/mes</span><input class="input" type="number" min="0" step="0.5" data-tf="precio" data-i="${i}" value="${x.precio}"></label><label class="fld"><span>Nota</span><input class="input" data-tf="nota_es" data-i="${i}" value="${esc(x.nota_es)}"></label></div></div>`).join('')}
          <button class="btn btn-primary mt12" data-act="tfsave">${ic('check')} Guardar tarifas</button></div>
        <div>
          <div class="card pad"><b>Personas con acceso al panel</b><table class="tb mt8"><tbody>${[['Sergio Álvarez', 'Administración', 'Todo'], ['Mikel', 'Recepción', 'Altas, socios, incidencias, avisos, asistencia'], ['Entrenador/a titulado/a', 'Gimnasio', 'Ejercicios, planes, sesiones, máquinas; revisa y firma el contenido'], ['Ondora Studio', 'Soporte técnico', 'Acotado durante piloto y garantía; sin documentos firmados']].map(([n, r, p]) => `<tr><td><b>${n}</b></td><td>${pill(r, 'blue')}</td><td class="small muted">${p}</td></tr>`).join('')}</tbody></table></div>
          <div class="card pad mt16"><b>Cuenta de gestión del club en la app</b><div class="small muted mt8">Usuario <span class="mono">club@oarso</span>. Ve la app como un socio, sin cuota ni documentos. Sirve para comprobar cómo funciona todo.</div><a class="btn btn-ghost btn-sm mt8" href="${appBase()}?e=club%40oarso#/login" target="_blank" rel="noopener">${ic('eye')} Abrir la app como club ↗</a></div>
          <div class="card pad mt16"><b>Demo</b><div class="small muted mt8">Borra las altas, avisos, incidencias y cambios de contenido hechos en este navegador.</div><button class="btn btn-danger btn-sm mt8" data-act="resetdemo">Restablecer la demo</button></div>
        </div></div>`;
  }

  // ---------- enrutado ----------
  let ALTA_DONE = null;
  function parts() { return location.hash.replace(/^#\/?/, '').split('/').filter(Boolean); }
  function render(keep) {
    const p = parts(); const r = p[0] || 'resumen'; const y = window.scrollY;
    let html = '';
    switch (r) { case 'altas': html = pgAltas(ALTA_DONE); break; case 'socios': html = p[1] ? pgSocio(p[1]) : pgSocios(); break; case 'incidencias': html = pgIncidencias(); break; case 'avisos': html = pgAvisos(); break; case 'maquinas': html = pgMaquinas(); break; case 'ejercicios': html = pgEjercicios(); break; case 'planes': html = pgPlanes(); break; case 'sesiones': html = pgSesiones(); break; case 'documentos': html = pgDocumentos(); break; case 'asistencia': html = pgAsistencia(); break; case 'ajustes': html = pgAjustes(); break; default: html = pgResumen(); }
    $('#main').innerHTML = html; $('#nav').innerHTML = navHtml(r);
    if (keep) window.scrollTo(0, y); else window.scrollTo(0, 0);
    const qs = $('#q-socios'); if (qs) qs.addEventListener('input', () => { Q.socios = qs.value; const pos = qs.selectionStart; render(true); const n = $('#q-socios'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } });
    const qe = $('#q-ej'); if (qe) qe.addEventListener('input', () => { Q.ej = qe.value; const pos = qe.selectionStart; render(true); const n = $('#q-ej'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } });
  }
  const rnd = (n) => { const a = 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
  document.addEventListener('click', (ev) => {
    const el = ev.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act, v = el.dataset.v;
    switch (a) {
      case 'nav': location.hash = el.dataset.to; break;
      case 'close': closeDrawer(); break;
      case 'copy': try { navigator.clipboard.writeText(v); toast('Enlace copiado'); } catch (e) { toast(v); } break;
      case 'mail': toast(`Correo enviado a ${v} (en la demo no se envía)`); break;
      case 'pdfinfo': toast('El PDF se abre desde el almacén privado del club (en la app real)'); break;
      case 'alta': { const f = $('#alta-f'); const d = Object.fromEntries(new FormData(f).entries()); const er = $('#alta-err'); const email = (d.email || '').trim().toLowerCase(); if (!d.nombre || !d.apellidos || !email || !d.nac) { er.textContent = 'Faltan datos obligatorios.'; break; } if (socios().some((s) => s.email === email) || email === 'club@oarso') { er.textContent = 'Ya existe un socio con ese correo.'; break; } const age = (today() - new Date(d.nac)) / 31557600000; if (!(age >= 16)) { er.textContent = 'El gimnasio es para mayores de 16 años.'; break; } const acc = LS.get(K.acc, {}); const num = String(422 + Object.keys(acc).length).padStart(4, '0'); const pass = rnd(8); acc[email] = { pass, role: 'socio', nombre: d.nombre.trim(), apellidos: d.apellidos.trim(), num, tarifa: d.tarifa, movil: d.movil || '', nac: d.nac, docs: {}, sig: null, pendienteFirma: true, alta: new Date().toISOString(), origen: 'recepción', idioma: d.idioma }; LS.set(K.acc, acc); ALTA_DONE = { email, pass, num }; render(); toast(`Cuenta creada · nº ${num}`); break; }
      case 'baja': { const b = LS.get(K.bajas, {}); b[v] = new Date().toISOString(); LS.set(K.bajas, b); toast('Socio dado de baja'); render(true); break; }
      case 'alta2': { const b = LS.get(K.bajas, {}); delete b[v]; LS.set(K.bajas, b); toast('Socio reactivado'); render(true); break; }
      case 'finc': Q.incEstado = v; render(true); break;
      case 'inc': incDrawer(v); break;
      case 'incsave': { const st = LS.get(K.inc, {}); const i = incidencias().find((x) => x.ref === v); st[v] = { estado: $('#inc-estado').value, nota: $('#inc-nota').value.trim(), por: 'Mikel', en: new Date().toISOString() }; LS.set(K.inc, st); const ms = $('#inc-maq'); if (ms && i && i.m) { const m = maqSt(); m[i.m] = { estado: ms.value, nota: st[v].nota }; LS.set(K.maq, m); } if ($('#inc-aviso').checked && i) { const A = avisos(); const m = i.m ? G.machine(i.m) : null; A.unshift({ id: 'a' + Date.now(), es: `${m ? m.es + ' (' + m.code + ')' : 'Sala'}: ${TIPO[i.tipo].toLowerCase()}. ${st[v].nota || 'Lo estamos revisando.'}`, eu: `${m ? m.eu + ' (' + m.code + ')' : 'Aretoa'}: berrikusten ari gara.`, icon: 'tool', desde: iso(today()), hasta: '', donde: 'hoy', on: true }); LS.set(K.avisos, A); } closeDrawer(); toast('Incidencia actualizada'); render(true); break; }
      case 'avisoed': avisoDrawer(v); break;
      case 'avisoon': { const A = avisos(); const x = A.find((y) => y.id === v); if (x) { x.on = x.on === false; LS.set(K.avisos, A); render(true); } break; }
      case 'avisosave': { const A = avisos(); let x = A.find((y) => y.id === v); const es = $('#av-es').value.trim(); if (!es) { toast('Escribe el texto en castellano'); break; } const data = { id: v, es, eu: $('#av-eu').value.trim(), icon: $('#av-icon').value, donde: $('#av-donde').value, desde: $('#av-desde').value, hasta: $('#av-hasta').value, on: true }; if (x) Object.assign(x, data); else A.unshift(data); LS.set(K.avisos, A); closeDrawer(); toast('Aviso publicado en la app'); render(true); break; }
      case 'avisodel': { LS.set(K.avisos, avisos().filter((y) => y.id !== v)); closeDrawer(); toast('Aviso borrado'); render(true); break; }
      case 'fgrupo': Q.ejGrupo = v; render(true); break;
      case 'festado': Q.ejEstado = v; render(true); break;
      case 'exed': exDrawer(+v); break;
      case 'addline': ED[el.dataset.k].push(''); renderEx(); break;
      case 'rmline': ED[el.dataset.k].splice(+el.dataset.i, 1); renderEx(); break;
      case 'exsave': exSave(v); break;
      case 'planed': planDrawer(v); break;
      case 'pmove': { const d = PE.sched[+el.dataset.d].main; const i = +el.dataset.i, j = i + +v; [d[i], d[j]] = [d[j], d[i]]; renderPlan(); break; }
      case 'prm': PE.sched[+el.dataset.d].main.splice(+el.dataset.i, 1); renderPlan(); break;
      case 'padd': { const sel = $('#padd-' + el.dataset.d); PE.sched[+el.dataset.d].main.push([+sel.value, '2 o 3 × 8–12', 0]); renderPlan(); break; }
      case 'planreset': { const o = planOv(); delete o[v]; LS.set(K.planes, o); closeDrawer(); toast('Plan restablecido'); render(true); break; }
      case 'plansave': { const o = planOv(); o[PE.id] = { sched: PE.sched, actualizado: new Date().toISOString() }; LS.set(K.planes, o); closeDrawer(); toast('Versión nueva publicada: ya se ve en la app'); render(true); break; }
      case 'normased': { const D = docsv(); drawer('Nueva versión de las normas', `<div class="xs muted">Una línea por norma. Al publicar se crea la versión ${D.normas.v + 1} con fecha de hoy; los socios nuevos firman esta.</div><textarea class="input mt8" id="normas-tx" style="min-height:260px">${esc(D.normas.items.join('\n'))}</textarea>`, `<button class="btn btn-ghost" data-act="close">Cancelar</button><button class="btn btn-primary" data-act="normassave">${ic('check')} Publicar versión ${D.normas.v + 1}</button>`); break; }
      case 'normassave': { const D = docsv(); const items = $('#normas-tx').value.split('\n').map((s) => s.trim()).filter(Boolean); if (items.length < 3) { toast('Escribe al menos tres normas'); break; } D.normas = { v: D.normas.v + 1, fecha: iso(today()), items }; LS.set(K.docsv, D); closeDrawer(); toast('Normas publicadas'); render(true); break; }
      case 'tfsave': { const T = tarifas(); document.querySelectorAll('[data-tf]').forEach((inp) => { const i = +inp.dataset.i; T[i][inp.dataset.tf] = inp.dataset.tf === 'precio' ? +inp.value : inp.value; }); LS.set(K.tarifas, T); toast('Tarifas guardadas'); render(true); break; }
      case 'csv': { const rows = [['fecha', 'hora', 'socio', 'via'], ...entradas().map((e) => [e.fecha, e.hora, e.socio, 'recepcion'])]; const b = new Blob([rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' }); const a2 = document.createElement('a'); a2.href = URL.createObjectURL(b); a2.download = 'oarso-gym-asistencia.csv'; a2.click(); break; }
      case 'resetdemo': { Object.values(K).filter((k) => k !== K.app).forEach((k) => localStorage.removeItem(k)); toast('Demo restablecida'); render(); break; }
    }
  });
  document.addEventListener('change', (ev) => { const el = ev.target; if (el.dataset.act === 'maqst') { const m = maqSt(); m[el.dataset.v] = Object.assign(m[el.dataset.v] || {}, { estado: el.value }); LS.set(K.maq, m); toast(`${el.dataset.v}: ${el.options[el.selectedIndex].text}`); render(true); } if (el.dataset.f && ED) { if (el.dataset.i !== undefined) ED[el.dataset.f][+el.dataset.i] = el.value; else ED[el.dataset.f] = el.value; } if (el.dataset.pd !== undefined) PE.sched[+el.dataset.pd].main[+el.dataset.pi][1] = el.value; if (el.dataset.po !== undefined) PE.sched[+el.dataset.po].main[+el.dataset.pi][2] = el.checked ? 1 : 0; });
  document.addEventListener('input', (ev) => { const el = ev.target; if (el.dataset.f && ED) { if (el.dataset.i !== undefined) ED[el.dataset.f][+el.dataset.i] = el.value; else ED[el.dataset.f] = el.value; } if (el.dataset.pd !== undefined && PE) PE.sched[+el.dataset.pd].main[+el.dataset.pi][1] = el.value; });
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/altas')) ALTA_DONE = null; render(); });
  window.addEventListener('storage', () => render(true));
  render();
})();
