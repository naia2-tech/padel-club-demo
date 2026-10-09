/* Demo de plataforma de club · Ondora Studio
   Núcleo compartido entre el móvil, el panel, la pantalla del club y el marco del iPad:
   datos ficticios, normativa de la liga convertida en reglas y sincronización en directo. */
(function () {
  'use strict';
  const PC = (window.PC = {});
  const VER = 7;
  const KEY = 'pcdemo.state.v' + VER;
  PC.NOW = new Date(2026, 10, 17, 18, 45); // martes 17 de noviembre de 2026, 18:45 (mitad de la Fase I)
  PC.TODAY = '2026-11-17';
  PC.PHASE = { n: 1, from: '2026-10-06', to: '2026-12-19', next: '2027-01-12' };
  PC.PLAYTOMIC = 'https://playtomic.io/';

  /* ---------- utilidades ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  PC.iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  PC.parse = (s) => {
    const [a, b = '00:00'] = s.split('T');
    const [y, m, d] = a.split('-').map(Number);
    const [h, mi] = b.split(':').map(Number);
    return new Date(y, m - 1, d, h, mi);
  };
  PC.addDays = (s, n) => { const d = PC.parse(s); d.setDate(d.getDate() + n); return PC.iso(d); };
  PC.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  PC.rng = rng;

  const D_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const D_ES_S = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const D_EU = ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'];
  const D_EU_S = ['ig.', 'al.', 'ar.', 'az.', 'og.', 'or.', 'lr.'];
  const M_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const M_ES_S = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const M_EU = ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'];
  const M_EU_G = ['urtarrilaren', 'otsailaren', 'martxoaren', 'apirilaren', 'maiatzaren', 'ekainaren', 'uztailaren', 'abuztuaren', 'irailaren', 'urriaren', 'azaroaren', 'abenduaren'];
  const M_EU_S = ['urt.', 'ots.', 'mar.', 'api.', 'mai.', 'eka.', 'uzt.', 'abu.', 'ira.', 'urr.', 'aza.', 'abe.'];
  PC.DOW_ES = D_ES; PC.DOW_ES_S = D_ES_S; PC.DOW_EU_S = D_EU_S;

  PC.L = (es, eu) => (S && S.lang === 'eu' && eu != null ? eu : es);
  PC.T = (o) => (o == null ? '' : typeof o === 'string' ? o : PC.L(o.es, o.eu));
  PC.time = (s) => s.slice(11, 16);
  PC.relDay = (s) => {
    const day = s.slice(0, 10);
    if (day === PC.TODAY) return PC.L('hoy', 'gaur');
    if (day === PC.addDays(PC.TODAY + 'T00:00', 1).slice(0, 10)) return PC.L('mañana', 'bihar');
    if (day === PC.addDays(PC.TODAY + 'T00:00', -1).slice(0, 10)) return PC.L('ayer', 'atzo');
    return null;
  };
  PC.fDay = (s, rel = true) => {
    const r = rel && PC.relDay(s);
    if (r) return r;
    const d = PC.parse(s);
    return PC.L(`${D_ES_S[d.getDay()]} ${d.getDate()} ${M_ES_S[d.getMonth()]}`, `${M_EU_S[d.getMonth()]} ${d.getDate()}, ${D_EU_S[d.getDay()]}`);
  };
  PC.fLong = (s) => {
    const d = PC.parse(s);
    return PC.L(`${D_ES[d.getDay()]} ${d.getDate()} de ${M_ES[d.getMonth()]}`, `${M_EU_G[d.getMonth()]} ${d.getDate()}a, ${D_EU[d.getDay()]}`);
  };
  PC.fWhen = (s) => `${PC.fDay(s)} · ${PC.time(s)}`;
  PC.fAgo = (s) => {
    const mins = Math.round((PC.now() - PC.parse(s)) / 60000);
    if (mins < 1) return PC.L('ahora', 'orain');
    if (mins < 60) return PC.L(`hace ${mins} min`, `duela ${mins} min`);
    const h = Math.round(mins / 60);
    if (h < 24) return PC.L(`hace ${h} h`, `duela ${h} h`);
    return PC.fDay(s);
  };
  PC.eur = (n, dec) => {
    const s = (dec || n % 1 ? n.toFixed(2) : String(Math.round(n))).replace('.', ',');
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  };
  PC.lvl = (n) => n.toFixed(1).replace('.', ',');
  PC.ini = (name) => name.split(/[\s/]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  // reloj de la demo: avanza desde las 18:45 a la velocidad real para que los «hace x min» sean creíbles
  const t0 = Date.now();
  PC.now = () => new Date(PC.NOW.getTime() + (Date.now() - t0));
  PC.nowIso = () => PC.iso(PC.now());

  /* ---------- iconos (trazos de 24 px) ---------- */
  const I = {
    home: 'M3.5 10.5 12 3.5l8.5 7V20a1 1 0 0 1-1 1H15v-6.5H9V21H4.5a1 1 0 0 1-1-1z',
    cal: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5a3 3 0 0 0 3 4.2M17 6h2.5a3 3 0 0 1-3 4.2M12 14v3.5M8 21h8M9.5 17.5h5"/>',
    school: '<path d="M2 9.5 12 4.5l10 5-10 5z"/><path d="M6 11.5v4.8c3.5 2.3 8.5 2.3 12 0v-4.8M22 9.5v5.5"/>',
    shield: 'M12 3 4.5 6v6c0 4.4 3.2 8.1 7.5 9 4.3-.9 7.5-4.6 7.5-9V6z',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20.5a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 6.3"/>',
    bell: '<path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.8 1.8H4.2z"/><path d="M10 21h4"/>',
    swap: '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
    check: 'M5 12.5 9.5 17 19 7.5',
    x: 'M6 6l12 12M18 6 6 18',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    chev: 'M9 5.5 15.5 12 9 18.5',
    chevd: 'M5.5 9 12 15.5 18.5 9',
    back: 'M15 5.5 8.5 12l6.5 6.5',
    plus: 'M12 5v14M5 12h14',
    euro: '<path d="M18.5 6.8a7 7 0 1 0 0 10.4"/><path d="M4 10h10M4 14h10"/>',
    msg: 'M4 5h16v11.5H8.5L4 20.5z',
    send: '<path d="M21 3 10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5L3 9.5z"/>',
    doc: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h6.5M9 16.5h6.5"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    tv: '<rect x="2.5" y="4.5" width="19" height="12.5" rx="2"/><path d="M8 21h8M12 17v4"/>',
    chart: 'M4 20.5V11M10 20.5V4.5M16 20.5V13M2.5 20.5h19',
    ball: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.6c3.3 2.7 3.3 10.1 0 12.8M18.3 5.6c-3.3 2.7-3.3 10.1 0 12.8"/>',
    racket: '<ellipse cx="10" cy="9" rx="6" ry="6.5"/><path d="M13.6 14 20 20.5"/><circle cx="8" cy="7.5" r=".6"/><circle cx="11.5" cy="7.5" r=".6"/><circle cx="9.8" cy="10.5" r=".6"/>',
    whistle: '<circle cx="8.5" cy="14.5" r="5"/><path d="M12.5 11.5 21 7v4.5l-6.5 3"/><path d="M8.5 9.5V6"/>',
    star: 'M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9z',
    bolt: 'M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z',
    up: 'M12 19V5M6 11l6-6 6 6',
    down: 'M12 5v14M6 13l6 6 6-6',
    ext: '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v6H4V6h6"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.4v.2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    heart: 'M12 20s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z',
    play: 'M7.5 4.8v14.4L19 12z',
    download: 'M12 4v11M7 10.5l5 5 5-5M5 20h14',
    reset: '<path d="M3.5 4.5v5.5H9"/><path d="M4.2 14.5A8 8 0 1 0 5.6 7.4L3.5 10"/>',
    expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
    desktop: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
    split: '<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M9.5 4v16"/>',
    sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.6 2.6M15.4 15.4 18 18M6 18l2.6-2.6M15.4 8.6 18 6',
    sub: '<circle cx="8" cy="8" r="3.2"/><path d="M2.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15 9h6M18 6l3 3-3 3M21 16h-6M18 13l-3 3 3 3"/>',
    medal: '<circle cx="12" cy="15" r="5"/><path d="M8.5 3 12 10l3.5-7M10.4 15.2l1.6-1.5v4"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.6 1.8M9.5 2.5h5"/>',
    list: 'M8.5 6.5h12M8.5 12h12M8.5 17.5h12M4 6.5h.5M4 12h.5M4 17.5h.5',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
    filter: 'M3.5 5h17l-6.5 8v6l-4 1.5V13z',
    share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.3 10.8l7.4-4M8.3 13.2l7.4 4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/>',
    phonecall: 'M5 4h3.5l1.8 4.5-2.3 1.4a11 11 0 0 0 6.1 6.1l1.4-2.3L20 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    wallet: '<path d="M4 7.5h15.5V20H4a1.5 1.5 0 0 1-1.5-1.5V6A2 2 0 0 1 4.5 4H17v3.5"/><circle cx="16" cy="13.8" r="1.2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
    flag: '<path d="M5 21V4M5 4.5h12l-2.5 4 2.5 4H5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    court: '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M4 12h16M12 6.5v11M4 6.5h16M4 17.5h16"/>',
    qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 18.5v2M18.5 14h2"/>',
  };
  PC.ic = (n, s = 20, cls = '') => {
    const v = I[n] || I.info;
    const inner = v.charAt(0) === '<' ? v : `<path d="${v}"/>`;
    return `<svg class="ic ${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  };

  /* ---------- marcas ---------- */
  PC.BRANDS = {
    doss: { id: 'doss', mark: 'D', w1: 'DOSS PÁDEL', w2: 'CLUB', name: 'DOSS Pádel Club', short: 'DOSS', league: 'Liga DOSS', leagueLong: 'Liga DOSS · Temporada 2026-27', school: 'Escuela DOSS', schoolEu: 'DOSS Eskola', city: 'Donostia', venue: 'DOSS Pádel Club', social: 'zona social', theme: '#1d5ae6' },
    oarso: { id: 'oarso', mark: 'O', w1: 'PADEL INDOOR', w2: 'OARSO', name: 'Padel Indoor Oarso', short: 'Oarso', league: 'V Liga Oarso', leagueLong: 'V Liga Oarso · Temporada 2026-27', school: 'Escuela Padel Oarso', schoolEu: 'Padel Oarso Eskola', city: 'Errenteria', venue: 'Padel Indoor Oarso', social: 'zona social', theme: '#061634' },
  };
  PC.brand = () => PC.BRANDS[(S && S.brand) || 'doss'];
  PC.applyBrand = () => {
    const b = PC.brand();
    document.documentElement.dataset.brand = b.id;
    document.documentElement.lang = S.lang === 'eu' ? 'eu' : 'es';
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', b.theme);
  };
  PC.logo = (cls = '') => {
    const b = PC.brand();
    const mark = b.id === 'oarso'
      ? `<span class="mark mark-o"><svg viewBox="0 0 24 26" width="22" height="24" aria-hidden="true"><path d="M12 1.5 2.5 5v7.5c0 5.4 4 10.1 9.5 12 5.5-1.9 9.5-6.6 9.5-12V5z" fill="currentColor"/><text x="12" y="17.2" text-anchor="middle" font-size="11" font-weight="800" font-family="var(--f-display)" fill="var(--brand-deep)">O</text></svg></span>`
      : `<span class="mark">D</span>`;
    return `<span class="logo ${cls}">${mark}<span class="wm"><span>${b.w1}</span> <b>${b.w2}</b></span></span>`;
  };

  /* ---------- personas de la demo ---------- */
  PC.PERSONAS = {
    mikel: { id: 'mikel', name: 'Mikel Arana', first: 'Mikel', role: 'captain', team: 'g3-e', player: 'p3e1', member: 'Pádel', segs: ['all', 'liga', 'liga-caps', 'liga-g3', 'socios'],
      tag: { es: 'Capitán de Errebote · Grupo 3', eu: 'Errebote taldeko kapitaina · 3. taldea' }, about: 'Capitán de un equipo de la liga. Socio.' },
    iker: { id: 'iker', name: 'Iker Lasa', first: 'Iker', role: 'captain', team: 'g3-k', player: 'p3k1', member: null, segs: ['all', 'liga', 'liga-caps', 'liga-g3'],
      tag: { es: 'Capitán de Kristalak · el rival', eu: 'Kristalak taldeko kapitaina · aurkaria' }, about: 'Capitán del equipo rival. No es socio.' },
    leire: { id: 'leire', name: 'Leire Etxeberria', first: 'Leire', role: 'student', student: 's-leire', member: 'Pádel + Gym', segs: ['all', 'escuela', 'escuela-adultos', 'socios'],
      tag: { es: 'Alumna · Intermedio · martes 19:00', eu: 'Ikaslea · Ertaina · asteartea 19:00' }, about: 'Alumna de la escuela de adultos. Socia.' },
    maite: { id: 'maite', name: 'Maite Olano', first: 'Maite', role: 'family', child: 's-aimar', member: 'Familiar', segs: ['all', 'escuela', 'escuela-familias', 'socios'],
      tag: { es: 'Ama de Aimar · Escuela infantil', eu: 'Aimarren ama · Haurren eskola' }, about: 'Madre de un alumno de la escuela infantil.' },
    unai: { id: 'unai', name: 'Unai Zubizarreta', first: 'Unai', role: 'coach', coach: 'c-unai', member: null, segs: ['all', 'entrenadores'],
      tag: { es: 'Entrenador · adultos', eu: 'Entrenatzailea · helduak' }, about: 'Entrenador de la escuela de adultos.' },
  };
  PC.persona = () => PC.PERSONAS[S.persona] || PC.PERSONAS.mikel;
  PC.SEGMENTS = [
    { id: 'all', es: 'Todo el club', n: 318 },
    { id: 'liga', es: 'Liga · todos los jugadores', n: 92 },
    { id: 'liga-caps', es: 'Liga · capitanes', n: 46 },
    { id: 'liga-g3', es: 'Liga · Grupo 3', n: 14 },
    { id: 'escuela', es: 'Escuela · todo (alumnos y familias)', n: 69 },
    { id: 'escuela-adultos', es: 'Escuela · adultos', n: 39 },
    { id: 'escuela-familias', es: 'Escuela · familias de infantil', n: 30 },
    { id: 'socios', es: 'Socios', n: 214 },
    { id: 'entrenadores', es: 'Entrenadores', n: 3 },
  ];

  /* ---------- normativa (la de la liga, convertida en reglas) ---------- */
  PC.RULES = {
    pts: { W: 3, T: 2, L: 1, NP: -3 }, minutes: 90, goldenPoint: true, lastMinutes: 20,
    leagueDays: [1, 2, 5, 6, 0], changesPerMatch: 1, subLevel: 'igual o menor', npLimit: 2, upDown: 2,
    maxLeagueCourts: 3, resultHours: 24, courts: 5,
    slotsWeek: ['10:30', '12:00', '16:00', '17:30', '19:00', '20:30'], slotsWeekend: ['09:00', '10:30', '12:00', '16:00', '17:30'],
  };
  PC.isLeagueDay = (iso) => PC.RULES.leagueDays.includes(PC.parse(iso).getDay());
  PC.slotsFor = (day) => { const w = PC.parse(day + 'T00:00').getDay(); return (w === 0 || w === 6) ? PC.RULES.slotsWeekend : PC.RULES.slotsWeek; };

  /* ---------- estado ---------- */
  let S = null;
  const listeners = [];
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('pcdemo-' + VER) : null;
  PC.frame = (document.currentScript && document.currentScript.dataset.frame) || 'page';
  PC.on = (fn) => listeners.push(fn);
  const emit = (what, local) => listeners.forEach((fn) => { try { fn(what, local); } catch (e) { console.error(e); } });
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: la demo sigue en memoria */ } }
  PC.load = () => {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    try { S = raw ? JSON.parse(raw) : null; } catch (e) { S = null; }
    if (!S || S.v !== VER) { S = seed(); persist(); }
    PC.S = S;
    return S;
  };
  PC.commit = (what) => {
    persist();
    if (bc) bc.postMessage({ t: 'sync', what, state: S, from: PC.frame });
    emit(what, true);
  };
  PC.reset = () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    S = seed(); PC.S = S; persist();
    if (bc) bc.postMessage({ t: 'reset' });
    emit('reset', true);
  };
  if (bc) bc.onmessage = (e) => {
    const m = e.data || {};
    if (m.t === 'sync' && m.state) { S = m.state; PC.S = S; emit(m.what, false); }
    if (m.t === 'reset') { location.reload(); }
    if (m.t === 'cue' || m.t === 'nav') emit(m, false);
  };
  PC.broadcast = (msg) => { if (bc) bc.postMessage(msg); };
  PC.id = (p) => p + (++S.n);

  /* ---------- consultas de liga ---------- */
  PC.team = (id) => S.teams.find((t) => t.id === id);
  PC.player = (id) => S.players[id];
  PC.match = (id) => S.matches.find((m) => m.id === id);
  PC.teamPlayers = (t) => t.p.map((id) => S.players[id]);
  PC.vs = (m, tid) => (m.a === tid ? m.b : m.a);
  PC.side = (m, tid) => (m.a === tid ? 'a' : 'b');
  PC.matchesOf = (tid) => S.matches.filter((m) => m.a === tid || m.b === tid).sort((x, y) => x.at.localeCompare(y.at));
  PC.nextMatch = (tid) => PC.matchesOf(tid).find((m) => m.st === 'scheduled' && m.at >= PC.TODAY);
  PC.isPast = (m) => PC.parse(m.at).getTime() + 90 * 60000 < PC.NOW.getTime();

  PC.outcome = (m) => {
    // devuelve {a:'W'|'L'|'T'|'NP', b:..., sa, sb, ga, gb}
    if (m.np) {
      const lose = m.np, win = m.np === 'a' ? 'b' : 'a';
      return { [lose]: 'NP', [win]: 'W', sa: m.np === 'a' ? 0 : 2, sb: m.np === 'a' ? 2 : 0, ga: 0, gb: 0 };
    }
    let sa = 0, sb = 0, ga = 0, gb = 0;
    const sets = m.sets || [];
    sets.forEach((s, i) => {
      const last = i === sets.length - 1;
      if (!(last && i === 2 && m.end === 'stb')) { ga += s[0]; gb += s[1]; }
      if (s[0] > s[1]) sa++; else if (s[1] > s[0]) sb++;
    });
    let a, b;
    if (sa > sb) { a = 'W'; b = 'L'; } else if (sb > sa) { a = 'L'; b = 'W'; } else { a = 'T'; b = 'T'; }
    return { a, b, sa, sb, ga, gb };
  };

  PC.standings = (g, matches) => {
    const ms = (matches || S.matches).filter((m) => m.g === g && m.st === 'played');
    const rows = {};
    S.teams.filter((t) => t.g === g).forEach((t) => { rows[t.id] = { t, pj: 0, w: 0, e: 0, l: 0, np: 0, pts: 0, sf: 0, sc: 0, gf: 0, gc: 0 }; });
    const P = PC.RULES.pts;
    ms.forEach((m) => {
      const o = PC.outcome(m);
      [['a', m.a, o.sa, o.sb, o.ga, o.gb], ['b', m.b, o.sb, o.sa, o.gb, o.ga]].forEach(([k, tid, sf, sc, gf, gc]) => {
        const r = rows[tid]; if (!r) return;
        r.pj++; r.sf += sf; r.sc += sc; r.gf += gf; r.gc += gc;
        const res = o[k];
        if (res === 'W') { r.w++; r.pts += P.W; } else if (res === 'T') { r.e++; r.pts += P.T; } else if (res === 'L') { r.l++; r.pts += P.L; } else { r.np++; r.pts += P.NP; }
      });
    });
    const list = Object.values(rows);
    // desempate de la normativa: puntos → enfrentamiento directo (mini liga entre empatados) → sets ganados → diferencia de sets → juegos
    const h2h = (ids) => {
      const pts = {}; ids.forEach((id) => (pts[id] = 0));
      ms.filter((m) => ids.includes(m.a) && ids.includes(m.b)).forEach((m) => {
        const o = PC.outcome(m);
        pts[m.a] += P[o.a] ?? P.NP; pts[m.b] += P[o.b] ?? P.NP;
      });
      return pts;
    };
    const byPts = {};
    list.forEach((r) => (byPts[r.pts] = byPts[r.pts] || []).push(r.t.id));
    list.forEach((r) => { const ids = byPts[r.pts]; r.h2h = ids.length > 1 ? h2h(ids)[r.t.id] : 0; r.tied = ids.length > 1; });
    list.sort((x, y) => y.pts - x.pts || y.h2h - x.h2h || y.sf - x.sf || (y.sf - y.sc) - (x.sf - x.sc) || (y.gf - y.gc) - (x.gf - x.gc) || x.t.name.localeCompare(y.t.name));
    list.forEach((r, i) => (r.pos = i + 1));
    return list;
  };
  PC.zone = (g, pos, n) => {
    if (g > 1 && pos <= PC.RULES.upDown) return 'up';
    if (g < 7 && pos > n - PC.RULES.upDown) return 'down';
    return '';
  };
  PC.posOf = (tid) => { const t = PC.team(tid); return PC.standings(t.g).find((r) => r.t.id === tid); };

  // ocupación de pistas por partidos de liga y por la escuela en una franja
  PC.slotLoad = (iso, ignoreMatch) => {
    const t = PC.parse(iso).getTime();
    const league = S.matches.filter((m) => m.id !== ignoreMatch && m.st !== 'cancelled' && Math.abs(PC.parse(m.at).getTime() - t) < 90 * 60000);
    const dow = PC.parse(iso).getDay();
    const hm = iso.slice(11, 16);
    const school = S.groups.filter((g) => g.dow === dow && overlap(hm, 90, g.time, 60));
    return { league: league.length, school: school.length, courtsBusy: [...league.map((m) => m.court), ...school.map((g) => g.court)] };
  };
  function overlap(t1, d1, t2, d2) {
    const a = toMin(t1), b = toMin(t2);
    return a < b + d2 && b < a + d1;
  }
  function toMin(hm) { const [h, m] = hm.split(':').map(Number); return h * 60 + m; }
  PC.slotState = (iso, mId) => {
    const L = PC.slotLoad(iso, mId);
    if (!PC.isLeagueDay(iso)) return { ok: false, why: 'noliga', L };
    if (iso.slice(0, 10) > PC.PHASE.to) return { ok: false, why: 'fase', L };
    if (L.league >= PC.RULES.maxLeagueCourts) return { ok: false, why: 'lleno', L };
    if (L.league + L.school >= PC.RULES.courts) return { ok: false, why: 'lleno', L };
    return { ok: true, free: PC.RULES.maxLeagueCourts - L.league, L };
  };
  PC.freeCourt = (iso, mId) => {
    const busy = PC.slotLoad(iso, mId).courtsBusy;
    for (let c = 1; c <= PC.RULES.courts; c++) if (!busy.includes(c)) return c;
    return 1;
  };

  /* ---------- acciones de liga ---------- */
  PC.notify = (to, title, body, extra = {}) => {
    const n = { id: PC.id('n'), to, title, body, ts: PC.nowIso(), read: {}, ...extra };
    S.notifs.unshift(n);
    return n;
  };
  PC.log = (text, k = 'liga', icon) => { S.log.unshift({ id: PC.id('l'), ts: PC.nowIso(), k, text, icon }); };
  PC.notifsFor = (pid) => {
    const p = PC.PERSONAS[pid];
    return S.notifs.filter((n) => n.to === pid || (p && p.segs.includes(n.to)));
  };
  PC.unread = (pid) => PC.notifsFor(pid).filter((n) => !n.read[pid]).length;
  PC.markRead = (pid) => { PC.notifsFor(pid).forEach((n) => (n.read[pid] = true)); };

  PC.proposeChange = (mId, byTeam, opts, reason) => {
    const m = PC.match(mId);
    const c = { id: PC.id('c'), m: mId, by: byTeam, opts, pick: null, st: 'proposed', reason, ts: PC.nowIso() };
    S.changes.unshift(c);
    m.chgReq = c.id;
    const by = PC.team(byTeam), rival = PC.team(PC.vs(m, byTeam));
    const rivalCap = Object.values(PC.PERSONAS).find((p) => p.team === rival.id);
    PC.notify(rivalCap ? rivalCap.id : 'none', { es: `${by.name} propone cambiar vuestro partido`, eu: `${by.name} taldeak partida aldatzea proposatu du` },
      { es: `Del ${PC.fWhenL(m.at, 'es')}. Te ofrece ${opts.length} horarios: elige uno.`, eu: `${PC.fWhenL(m.at, 'eu')} egunekoa. ${opts.length} ordutegi eskaintzen dizkizu: aukeratu bat.` },
      { kind: 'change', go: { tab: 'liga', sheet: 'change-answer', id: c.id } });
    PC.log(`${by.name} propone ${opts.length} horarios a ${rival.name} para su partido del ${PC.fWhenL(m.at, 'es')}`, 'liga', 'swap');
    return c;
  };
  PC.fWhenL = (s, lang) => { const keep = S.lang; S.lang = lang; const r = PC.fDay(s, false) + ', ' + PC.time(s); S.lang = keep; return r; };

  PC.acceptChange = (cId, pick) => {
    const c = S.changes.find((x) => x.id === cId); if (!c) return;
    c.pick = pick; c.st = 'accepted'; c.tsAccept = PC.nowIso();
    const m = PC.match(c.m), by = PC.team(c.by), other = PC.team(PC.vs(m, c.by));
    const cap = Object.values(PC.PERSONAS).find((p) => p.team === by.id);
    if (cap) PC.notify(cap.id, { es: `${other.name} ha aceptado: ${PC.fWhenL(pick, 'es')}`, eu: `${other.name} taldeak onartu du: ${PC.fWhenL(pick, 'eu')}` },
      { es: 'Ya está en manos del club. En cuanto lo validen, se actualiza el calendario.', eu: 'Orain klubaren esku dago. Baliozkotzen dutenean, egutegia eguneratuko da.' }, { kind: 'change' });
    PC.notify('club', { es: `Cambio acordado: ${by.name} – ${other.name}` }, { es: `Del ${PC.fWhenL(m.at, 'es')} al ${PC.fWhenL(pick, 'es')}. Falta tu validación.` }, { kind: 'change' });
    PC.log(`${other.name} acepta el ${PC.fWhenL(pick, 'es')} · pendiente de validar`, 'liga', 'check');
  };
  PC.rejectChangeByRival = (cId) => {
    const c = S.changes.find((x) => x.id === cId); if (!c) return;
    c.st = 'declined';
    const m = PC.match(c.m); m.chgReq = null;
    const cap = Object.values(PC.PERSONAS).find((p) => p.team === c.by);
    if (cap) PC.notify(cap.id, { es: 'Ningún horario le encaja al rival', eu: 'Aurkariari ez zaio ordutegirik egokitzen' }, { es: 'El partido se mantiene en su fecha. Podéis proponer otros horarios.', eu: 'Partidak bere data mantentzen du. Beste ordutegi batzuk proposa ditzakezue.' }, { kind: 'change' });
  };
  PC.validateChange = (cId, court) => {
    const c = S.changes.find((x) => x.id === cId); if (!c) return;
    const m = PC.match(c.m);
    c.st = 'validated'; c.tsVal = PC.nowIso(); c.court = court;
    m.orig = m.at; m.at = c.pick; m.court = court; m.chg = (m.chg || 0) + 1; m.chgReq = null;
    const A = PC.team(m.a), B = PC.team(m.b);
    ['mikel', 'iker'].forEach((pid) => {
      const p = PC.PERSONAS[pid];
      if (p.team === m.a || p.team === m.b) PC.notify(pid, { es: 'Partido cambiado y validado por el club', eu: 'Partida aldatuta eta klubak baliozkotuta' },
        { es: `${A.name} – ${B.name}: ${PC.fWhenL(m.at, 'es')}, pista ${court}. Ya está en vuestro calendario.`, eu: `${A.name} – ${B.name}: ${PC.fWhenL(m.at, 'eu')}, ${court}. pista. Zuen egutegian dago jada.` },
        { kind: 'ok', go: { tab: 'liga' } });
    });
    PC.log(`Validado: ${A.name} – ${B.name} pasa al ${PC.fWhenL(m.at, 'es')} (pista ${court}). Aviso enviado a los 4 jugadores`, 'liga', 'check');
  };
  PC.rejectChange = (cId, why) => {
    const c = S.changes.find((x) => x.id === cId); if (!c) return;
    c.st = 'rejected'; c.why = why;
    const m = PC.match(c.m); m.chgReq = null;
    ['mikel', 'iker'].forEach((pid) => {
      const p = PC.PERSONAS[pid];
      if (p.team === m.a || p.team === m.b) PC.notify(pid, { es: 'El club no ha podido validar el cambio', eu: 'Klubak ezin izan du aldaketa baliozkotu' }, { es: `${why}. El partido sigue en su fecha.`, eu: `${why}. Partidak bere data mantentzen du.` }, { kind: 'warn' });
    });
    PC.log(`Rechazado el cambio de ${PC.team(m.a).name} – ${PC.team(m.b).name}: ${why}`, 'liga', 'x');
  };

  PC.setPact = (mId, side, val) => { const m = PC.match(mId); m.pact = m.pact || {}; m.pact[side] = val; };

  PC.submitResult = (mId, byTeam, res) => {
    const m = PC.match(mId);
    m.st = 'awaiting'; m.pending = { ...res, by: byTeam, ts: PC.nowIso() };
    PC.log(`${PC.team(byTeam).name} introduce el resultado contra ${PC.team(PC.vs(m, byTeam)).name} · esperando confirmación del rival`, 'liga', 'ball');
  };
  PC.confirmResult = (mId) => {
    const m = PC.match(mId); if (!m || !m.pending) return;
    const before = PC.standings(m.g).map((r) => r.t.id);
    m.sets = m.pending.sets; m.end = m.pending.end; m.np = m.pending.np || null; m.st = 'played'; m.confirmedAt = PC.nowIso();
    const by = m.pending.by; m.pending = null;
    const after = PC.standings(m.g);
    const A = PC.team(m.a), B = PC.team(m.b);
    const sc = PC.scoreText(m);
    after.forEach((r) => {
      const cap = Object.values(PC.PERSONAS).find((p) => p.team === r.t.id);
      if (!cap) return;
      const oldPos = before.indexOf(r.t.id) + 1;
      const z = PC.zone(m.g, r.pos, after.length);
      let es = `${A.name} ${sc} ${B.name}. Vais ${r.pos}º con ${r.pts} puntos.`, eu = `${A.name} ${sc} ${B.name}. ${r.pos}. postuan zaudete, ${r.pts} punturekin.`;
      if (r.pos < oldPos && z === 'up') { es += ' Entráis en zona de ascenso.'; eu += ' Igoera-eremuan sartu zarete.'; }
      if (r.t.id === m.a || r.t.id === m.b) PC.notify(cap.id, { es: 'Resultado confirmado · clasificación actualizada', eu: 'Emaitza berretsita · sailkapena eguneratuta' }, { es, eu }, { kind: 'result', go: { tab: 'liga', sub: 'clasif' } });
    });
    PC.log(`Resultado confirmado por ambos capitanes: ${A.name} ${sc} ${B.name}. Clasificación del Grupo ${m.g} recalculada`, 'liga', 'trophy');
    S.lastResult = m.id;
    return { by };
  };
  PC.scoreText = (m) => (m.np ? (m.np === 'a' ? 'NP' : 'W.O.') : (m.sets || []).map((s) => `${s[0]}-${s[1]}`).join(' '));

  PC.requestSub = (mId, team, out, inn) => {
    const s = { id: PC.id('s'), m: mId, team, out, inn, st: 'pending', ts: PC.nowIso() };
    S.subs.unshift(s);
    PC.notify('club', { es: `Sustituto solicitado por ${PC.team(team).name}` }, { es: `${S.players[inn].name} por ${S.players[out].name}` }, { kind: 'sub' });
    PC.log(`${PC.team(team).name} pide a ${S.players[inn].name} (${PC.lvl(S.players[inn].lvl)}) como sustituto de ${S.players[out].name} (${PC.lvl(S.players[out].lvl)})`, 'liga', 'sub');
    return s;
  };
  PC.resolveSub = (sId, ok) => {
    const s = S.subs.find((x) => x.id === sId); if (!s) return;
    s.st = ok ? 'approved' : 'rejected';
    const m = PC.match(s.m);
    if (ok) { m.sub = m.sub || {}; m.sub[s.out] = s.inn; }
    const cap = Object.values(PC.PERSONAS).find((p) => p.team === s.team);
    if (cap) PC.notify(cap.id, ok ? { es: 'Sustituto aprobado por el club', eu: 'Ordezkoa klubak onartuta' } : { es: 'Sustituto no aprobado', eu: 'Ordezkoa ez da onartu' },
      ok ? { es: `${S.players[s.inn].name} jugará por ${S.players[s.out].name}. Ya aparece en la ficha del partido.`, eu: `${S.players[s.inn].name}(e)k jokatuko du ${S.players[s.out].name}(r)en ordez.` } : { es: 'Buscad otra persona de igual o menor nivel.', eu: 'Bilatu maila bereko edo txikiagoko beste norbait.' }, { kind: ok ? 'ok' : 'warn' });
    PC.log(`${ok ? 'Aprobado' : 'Rechazado'} el sustituto ${S.players[s.inn].name} para ${PC.team(s.team).name}`, 'liga', ok ? 'check' : 'x');
  };
  PC.resolveDispute = (dId, which) => {
    const d = S.disputes.find((x) => x.id === dId); if (!d) return;
    const m = PC.match(d.m); m.sets = d.v[which].sets; m.end = d.v[which].end; m.st = 'played'; d.st = 'resolved';
    PC.log(`Resultado en disputa resuelto: ${PC.team(m.a).name} ${PC.scoreText(m)} ${PC.team(m.b).name}`, 'liga', 'check');
  };

  /* ---------- escuela ---------- */
  PC.group = (id) => S.groups.find((g) => g.id === id);
  PC.coach = (id) => S.coaches[id];
  PC.student = (id) => S.students[id];
  PC.groupStudents = (gid) => Object.values(S.students).filter((s) => s.group === gid && !s.baja);
  PC.FESTIVOS = ['2026-10-12', '2026-11-01', '2026-12-06', '2026-12-07', '2026-12-08', '2027-01-06'];
  PC.T1 = { from: '2026-09-16', to: '2026-12-20' };
  PC.classDates = (g, from = PC.T1.from, to = PC.T1.to) => {
    const out = []; let d = PC.parse(from + 'T00:00');
    while (d.getDay() !== g.dow) d.setDate(d.getDate() + 1);
    const end = PC.parse(to + 'T23:59');
    while (d <= end) { out.push(PC.iso(d).slice(0, 10) + 'T' + g.time); d.setDate(d.getDate() + 7); }
    return out;
  };
  PC.isFestivo = (iso) => PC.FESTIVOS.includes(iso.slice(0, 10));
  PC.attendees = (gid, dateIso) => {
    const day = dateIso.slice(0, 10);
    const base = PC.groupStudents(gid).map((s) => ({ s, kind: 'regular' }));
    const abs = S.absences.filter((a) => a.group === gid && a.date.slice(0, 10) === day).map((a) => a.student);
    const ups = S.makeups.filter((u) => u.group === gid && u.date.slice(0, 10) === day && u.st === 'booked').map((u) => ({ s: S.students[u.student], kind: 'makeup', from: u.from }));
    return { list: base.map((x) => ({ ...x, absent: abs.includes(x.s.id) })).concat(ups), absent: abs.length, makeups: ups.length };
  };
  PC.occupancy = (gid, dateIso) => { const a = PC.attendees(gid, dateIso); return a.list.filter((x) => !x.absent).length; };
  PC.makeupOptions = (sid) => {
    const st = S.students[sid], g = PC.group(st.group);
    const out = [];
    S.groups.filter((x) => x.id !== g.id && x.kind === g.kind && x.lvl === g.lvl).forEach((x) => {
      PC.classDates(x, PC.TODAY, PC.T1.to).forEach((d) => {
        if (PC.isFestivo(d) || d < PC.nowIso()) return;
        const occ = PC.occupancy(x.id, d);
        if (occ < x.cap && !S.makeups.some((u) => u.student === sid && u.date === d)) out.push({ group: x, date: d, occ });
      });
    });
    return out.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  };
  PC.credits = (sid) => {
    const used = S.makeups.filter((u) => u.student === sid && u.st === 'booked').length;
    const earned = S.absences.filter((a) => a.student === sid && a.notice).length + (S.students[sid].extraCredits || 0);
    return Math.max(0, earned - used);
  };
  PC.notifyAbsence = (sid, dateIso) => {
    const st = S.students[sid], g = PC.group(st.group);
    S.absences.push({ id: PC.id('a'), student: sid, group: g.id, date: dateIso, notice: true, ts: PC.nowIso() });
    const coachP = Object.values(PC.PERSONAS).find((p) => p.coach === g.coach);
    if (coachP) PC.notify(coachP.id, { es: `${st.name} no vendrá el ${PC.fWhenL(dateIso, 'es')}`, eu: `${st.name} ez da etorriko: ${PC.fWhenL(dateIso, 'eu')}` }, { es: 'Su plaza queda libre para una recuperación.', eu: 'Bere plaza libre geratzen da berreskuratze baterako.' }, { kind: 'school' });
    PC.log(`${st.name} avisa de que falta el ${PC.fWhenL(dateIso, 'es')} · hueco ofrecido a 2 alumnos de ${g.lvl} con clases por recuperar`, 'escuela', 'school');
  };
  PC.cancelAbsence = (sid, dateIso) => { S.absences = S.absences.filter((a) => !(a.student === sid && a.date === dateIso)); };
  PC.bookMakeup = (sid, gid, dateIso) => {
    const st = S.students[sid], g = PC.group(gid);
    S.makeups.push({ id: PC.id('u'), student: sid, group: gid, date: dateIso, from: st.group, st: 'booked', ts: PC.nowIso() });
    const coachP = Object.values(PC.PERSONAS).find((p) => p.coach === g.coach);
    if (coachP) PC.notify(coachP.id, { es: `${st.name} recupera en tu grupo`, eu: `${st.name}(e)k zure taldean berreskuratuko du` }, { es: `${PC.fWhenL(dateIso, 'es')} · ${g.lvl}`, eu: `${PC.fWhenL(dateIso, 'eu')} · ${g.lvlEu}` }, { kind: 'school' });
    PC.log(`${st.name} reserva recuperación: ${g.lvl} del ${PC.fWhenL(dateIso, 'es')} (pista ${g.court}) · ${PC.occupancy(gid, dateIso)}/${g.cap}`, 'escuela', 'school');
  };
  PC.setAttendance = (gid, dateIso, sid, val) => {
    const k = gid + '|' + dateIso.slice(0, 10);
    S.att[k] = S.att[k] || {};
    S.att[k][sid] = val;
  };
  PC.closeClass = (gid, dateIso) => {
    const k = gid + '|' + dateIso.slice(0, 10);
    S.closed[k] = PC.nowIso();
    const g = PC.group(gid);
    const rec = S.att[k] || {};
    const yes = Object.values(rec).filter((v) => v === 'yes').length;
    PC.log(`${PC.coach(g.coach).name} cierra la clase de ${g.lvl} (${g.time}): ${yes} presentes`, 'escuela', 'check');
  };
  PC.evaluate = (sid, skills, note, goal, byCoach) => {
    const e = S.evals[sid];
    e.cur = { ...skills };
    if (note) e.notes.unshift({ ts: PC.nowIso(), by: byCoach, text: note });
    if (goal) e.goal = goal;
    e.updated = PC.nowIso();
    const st = S.students[sid];
    const who = Object.values(PC.PERSONAS).find((p) => p.student === sid || p.child === sid);
    if (who) PC.notify(who.id, { es: `${PC.coach(byCoach).name.split(' ')[0]} ha actualizado ${who.child ? 'la evolución de ' + st.name.split(' ')[0] : 'tu evolución'}`, eu: `${PC.coach(byCoach).name.split(' ')[0]}(e)k ${who.child ? st.name.split(' ')[0] + '(r)en bilakaera' : 'zure bilakaera'} eguneratu du` }, { es: note || 'Nueva valoración de golpes.', eu: note || 'Kolpeen balorazio berria.' }, { kind: 'school', go: { tab: 'escuela', sub: 'evol' } });
    PC.log(`${PC.coach(byCoach).name} actualiza la evolución de ${st.name}`, 'escuela', 'chart');
  };
  PC.SKILLS = [
    ['der', 'Derecha', 'Eskuinekoa'], ['rev', 'Revés', 'Ezkerrekoa'], ['vol', 'Volea', 'Bolea'], ['ban', 'Bandeja', 'Bandeja'],
    ['vib', 'Víbora', 'Bibora'], ['rem', 'Remate', 'Errematea'], ['sr', 'Saque y resto', 'Sakea eta itzulera'], ['tac', 'Táctica', 'Taktika'],
  ];

  /* ---------- cobros ---------- */
  PC.TARIFAS = {
    adult4: { socio: 145, no: 175, es: 'Adultos · grupo de 4' }, adult3: { socio: 169, no: 199, es: 'Adultos · grupo de 3' }, kids: { socio: 127, no: 163, es: 'Infantil · 4 a 6' },
  };
  PC.tarifaOf = (st) => { const g = PC.group(st.group); return g.kind === 'kids' ? 'kids' : g.cap === 3 ? 'adult3' : 'adult4'; };
  PC.priceOf = (st) => PC.TARIFAS[PC.tarifaOf(st)][st.socio ? 'socio' : 'no'];
  PC.t2Preview = () => {
    const act = Object.values(S.students).filter((s) => !s.baja && !s.leaving);
    const rows = {};
    act.forEach((s) => {
      const k = PC.tarifaOf(s) + (s.socio ? '-s' : '-n');
      rows[k] = rows[k] || { k, tar: PC.tarifaOf(s), socio: s.socio, n: 0, price: PC.priceOf(s) };
      rows[k].n++;
    });
    const list = Object.values(rows).sort((a, b) => a.k.localeCompare(b.k));
    return { list, n: act.length, total: list.reduce((t, r) => t + r.n * r.price, 0), sepa: act.filter((s) => s.sepa).length, link: act.filter((s) => !s.sepa).length, leaving: Object.values(S.students).filter((s) => s.leaving).length };
  };
  PC.sendT2 = () => {
    const pv = PC.t2Preview();
    Object.values(S.students).filter((s) => !s.baja && !s.leaving).forEach((s) => {
      S.pay.push({ id: PC.id('r'), student: s.id, concept: 'Escuela · 2º trimestre', amount: PC.priceOf(s), st: s.sepa ? 'sepa' : 'pending', due: '2027-01-13', ts: PC.nowIso(), t: 'T2' });
    });
    S.t2 = 'sent';
    PC.notify('maite', { es: 'Cuota del 2º trimestre de Aimar', eu: 'Aimarren 2. hiruhilekoko kuota' }, { es: `127 € (precio socio). Puedes pagarla ya con Bizum o tarjeta. Vence el 13 de enero.`, eu: `127 € (bazkide prezioa). Orain ordain dezakezu Bizum edo txartelarekin. Urtarrilaren 13an iraungitzen da.` }, { kind: 'pay', go: { tab: 'escuela', sub: 'pagos' } });
    PC.notify('leire', { es: 'Cuota del 2º trimestre', eu: '2. hiruhilekoko kuota' }, { es: '145 € · se domiciliará el 13 de enero en tu cuenta ••4471.', eu: '145 € · urtarrilaren 13an helbideratuko da ••4471 kontuan.' }, { kind: 'pay', go: { tab: 'escuela', sub: 'pagos' } });
    PC.log(`Cobros del 2º trimestre generados: ${pv.n} recibos · ${PC.eur(pv.total)} (${pv.sepa} domiciliados, ${pv.link} con enlace de pago)`, 'cobros', 'euro');
  };
  PC.payReceipt = (rId, method) => {
    const r = S.pay.find((x) => x.id === rId); if (!r) return;
    r.st = 'paid'; r.method = method; r.paidAt = PC.nowIso();
    const st = S.students[r.student];
    PC.notify('club', { es: `Pago recibido · ${PC.eur(r.amount)}` }, { es: `${r.concept} · ${st.name} · ${method}` }, { kind: 'pay' });
    PC.log(`Pago recibido: ${st.name} · ${r.concept} · ${PC.eur(r.amount)} por ${method}`, 'cobros', 'euro');
  };
  PC.remind = (rId) => { const r = S.pay.find((x) => x.id === rId); if (r) { r.reminded = (r.reminded || 0) + 1; PC.log(`Recordatorio de pago enviado a ${S.students[r.student].name}`, 'cobros', 'bell'); } };

  /* ---------- comunicación ---------- */
  PC.TEMPLATES = [
    { id: 'pista', seg: 'escuela-familias', title: { es: 'Cambio de pista el miércoles', eu: 'Pista aldaketa asteazkenean' },
      body: { es: 'Hola familias: el miércoles 25 la clase de las 17:30 se hace en la pista 3 por mantenimiento. Mismo horario. ¡Gracias!', eu: 'Kaixo, familiok: asteazkenean, 25ean, 17:30eko klasea 3. pistan izango da, mantentze-lanengatik. Ordutegi berean. Eskerrik asko!' } },
    { id: 'fase2', seg: 'liga', title: { es: 'Fase II: confirmad equipo', eu: 'II. fasea: berretsi taldea' },
      body: { es: 'La Fase II empieza el 12 de enero. Confirmad que seguís desde la app antes del 20 de diciembre: así cerramos grupos y calendario antes de Navidad.', eu: 'II. fasea urtarrilaren 12an hasiko da. Berretsi jarraitzen duzuela aplikaziotik abenduaren 20a baino lehen: horrela taldeak eta egutegia Gabonak baino lehen itxiko ditugu.' } },
    { id: 'americana', seg: 'socios', title: { es: 'Americana de Navidad · 19 de diciembre', eu: 'Gabonetako americana · abenduaren 19a' },
      body: { es: 'Sábado 19 a las 16:00, 24 plazas, merienda incluida. Inscripción desde la app, con prioridad para socios hasta el viernes.', eu: 'Larunbata 19an, 16:00etan, 24 plaza, askaria barne. Izena aplikaziotik, bazkideek lehentasuna ostirala arte.' } },
  ];
  PC.sendMessage = (seg, title, body) => {
    const sg = PC.SEGMENTS.find((s) => s.id === seg);
    S.msgs.unshift({ id: PC.id('m'), seg, title, body, ts: PC.nowIso(), sent: sg ? sg.n : 0, read: 0 });
    PC.notify(seg, title, body, { kind: 'msg', from: 'club' });
    PC.log(`Aviso enviado a «${sg ? sg.es : seg}» (${sg ? sg.n : '?'} personas) en castellano y euskera`, 'com', 'send');
  };

  /* ---------- fin de fase ---------- */
  PC.phaseMoves = () => {
    const moves = [];
    for (let g = 1; g <= 7; g++) {
      const st = PC.standings(g);
      st.forEach((r) => {
        const z = PC.zone(g, r.pos, st.length);
        const out = r.np >= PC.RULES.npLimit;
        moves.push({ t: r.t, from: g, to: out ? null : z === 'up' ? g - 1 : z === 'down' ? g + 1 : g, z, pos: r.pos, pts: r.pts, out, np: r.np });
      });
    }
    return moves;
  };
  PC.publishPhase2 = () => {
    const moves = PC.phaseMoves();
    S.phase2 = { ts: PC.nowIso(), moves: moves.map((m) => ({ t: m.t.id, from: m.from, to: m.to, z: m.z })) };
    ['mikel', 'iker'].forEach((pid) => {
      const mv = moves.find((m) => m.t.id === PC.PERSONAS[pid].team);
      if (!mv) return;
      const es = mv.z === 'up' ? `¡Subís al Grupo ${mv.to}!` : mv.z === 'down' ? `Bajáis al Grupo ${mv.to}.` : `Seguís en el Grupo ${mv.to}.`;
      const eu = mv.z === 'up' ? `${mv.to}. taldera igotzen zarete!` : mv.z === 'down' ? `${mv.to}. taldera jaisten zarete.` : `${mv.to}. taldean jarraitzen duzue.`;
      PC.notify(pid, { es: 'Borrador de la Fase II publicado', eu: 'II. fasearen zirriborroa argitaratuta' }, { es: es + ' Calendario a partir del 12 de enero.', eu: eu + ' Egutegia urtarrilaren 12tik aurrera.' }, { kind: 'trophy', go: { tab: 'liga' } });
    });
    PC.log(`Borrador de la Fase II publicado: ${moves.filter((m) => m.z === 'up').length} equipos suben y ${moves.filter((m) => m.z === 'down').length} bajan`, 'liga', 'trophy');
  };

  /* ---------- semilla de datos (todo ficticio) ---------- */
  const FIRST = ['Aitor', 'Ander', 'Asier', 'Eneko', 'Haritz', 'Ibai', 'Iñaki', 'Julen', 'Koldo', 'Markel', 'Peio', 'Xabier', 'Ainhoa', 'Amaia', 'Arantxa', 'Edurne', 'Garazi', 'Itziar', 'Jone', 'Maialen', 'Olatz', 'June', 'Uxue', 'Carlos', 'David', 'Javier', 'Laura', 'María', 'Pablo', 'Sara', 'Elena', 'Raúl', 'Ekaitz', 'Nahia', 'Ane', 'Mikel', 'Gaizka', 'Lorea', 'Iratxe', 'Oihana'];
  const LAST = ['Agirre', 'Arrieta', 'Azkue', 'Bengoetxea', 'Elizondo', 'Galarraga', 'Gorostiaga', 'Ibarguren', 'Irigoien', 'Iturriaga', 'Mujika', 'Otegi', 'Sarasola', 'Txapartegi', 'Urkiola', 'Zabala', 'Zubeldia', 'García', 'López', 'Martín', 'Pérez', 'Sánchez', 'Fernández', 'Romero', 'Navarro', 'Gil', 'Ortega', 'Alonso', 'Arregi', 'Beristain', 'Etxarri', 'Lizarazu'];
  const G_NAMES = {
    1: ['Txapeldunak', 'Kañoi Taldea', 'Los Muros', 'Ganbara', 'Reja y Bote', 'Itsasoa'],
    2: ['Sarekoak', 'Pala de Oro', 'Zirimiri', 'Martxa', 'Smash Brothers', 'Golpe Plano', 'Kalimotxo Team'],
    4: ['Arrano', 'Los del Bote', 'Fondo de Pista', 'Bizkor', 'Txirrindulariak', 'La Red'],
    5: ['Ekaitza', 'Muro Muro', 'Pikoteo', 'Las Bandejas', 'Indarra', 'Jaizkibel', 'Itzulia'],
    6: ['Bote Pronto', 'Larrun', 'Golpe de Suerte', 'Zero Bat', 'Viejos Rockeros', 'Txingudi'],
    7: ['Novatos FC', 'Aupa Ta', 'Bolea', 'Primer Saque', 'Lasai Lasai', 'Recién Llegados', 'Paleteros'],
  };
  const G_LVL = { 1: 4.4, 2: 3.8, 3: 3.0, 4: 2.7, 5: 2.4, 6: 2.0, 7: 1.4 };

  function seed() {
    const R = rng(20261117);
    const pick = (a) => a[Math.floor(R() * a.length)];
    const st = {
      v: VER, brand: 'doss', lang: 'es', persona: 'mikel', n: 100,
      teams: [], players: {}, matches: [], changes: [], subs: [], disputes: [], inscr: [], notifs: [], log: [], msgs: [],
      coaches: {}, groups: [], students: {}, absences: [], makeups: [], att: {}, closed: {}, evals: {}, pay: [], t2: 'none', wait: [], phase2: null,
      pool: [], members: {}, events: [], docs: [], lastResult: null,
    };
    S = st; // las utilidades de arriba leen S
    const used = new Set();
    const person = (lvl) => {
      let n; do { n = pick(FIRST) + ' ' + pick(LAST); } while (used.has(n)); used.add(n);
      return n;
    };
    /* grupo 3 escrito a mano: es el de las personas de la demo */
    const G3 = [
      ['e', 'Errebote', [['Mikel Arana', 3.2, true], ['Jon Goikoetxea', 3.1, true]]],
      ['k', 'Kristalak', [['Iker Lasa', 3.0, false], ['Asier Mendizabal', 3.0, false]]],
      ['p', 'Punto de Oro', [['Ainhoa Ugarte', 2.9, true], ['Nerea Salaberria', 2.8, true]]],
      ['v', 'Víbora Team', [['Gorka Iturbe', 3.3, true], ['Xabi Muñoa', 3.1, false]]],
      ['g', 'Los Globeros', [['Txema Ruiz', 3.0, true], ['Patxi Elizalde', 2.9, true]]],
      ['b', 'Bandeja Paisa', [['Andrés Gómez', 2.8, false], ['Julián Restrepo', 2.9, false]]],
      ['o', 'Oier / Beñat', [['Oier Larrañaga', 2.7, true], ['Beñat Odriozola', 2.8, false]]],
    ];
    G3.forEach(([k, name, ps]) => {
      const ids = ps.map((p, i) => { const id = `p3${k}${i + 1}`; st.players[id] = { id, name: p[0], lvl: p[1], socio: p[2] }; used.add(p[0]); return id; });
      st.teams.push({ id: 'g3-' + k, g: 3, name, p: ids, cap: ids[0], paid: k !== 'b' });
    });
    Object.entries(G_NAMES).forEach(([g, names]) => {
      g = +g;
      names.forEach((name, i) => {
        const ids = [0, 1].map((j) => { const id = `p${g}${i}${j}`; st.players[id] = { id, name: person(), lvl: Math.round((G_LVL[g] + (R() - 0.5) * 0.6) * 10) / 10, socio: R() < 0.62 }; return id; });
        st.teams.push({ id: `g${g}-${i}`, g, name, p: ids, cap: ids[0], paid: !(g === 6 && i === 2) });
      });
    });
    /* partidos del grupo 3 */
    const G3F = [
      ['e', 'p', '2026-10-09T19:00', 2, [[6, 3], [6, 4]], 'full'], ['k', 'o', '2026-10-10T10:30', 1, [[6, 4], [6, 4]], 'full'],
      ['v', 'b', '2026-10-11T16:00', 3, [[6, 2], [6, 3]], 'full'], ['e', 'g', '2026-10-18T12:00', 1, [[4, 6], [6, 7]], 'full'],
      ['p', 'b', '2026-10-13T19:00', 4, [[7, 5], [6, 4]], 'full'], ['k', 'v', '2026-10-16T20:30', 2, [[6, 4], [4, 6], [6, 3]], 'full'],
      ['k', 'g', '2026-10-19T19:00', 3, [[6, 3], [6, 2]], 'full'], ['o', 'b', '2026-10-23T17:30', 5, [[3, 6], [6, 4], [9, 11]], 'stb'],
      ['p', 'v', '2026-10-24T12:00', 2, [[6, 7], [4, 6]], 'full'], ['e', 'b', '2026-10-27T20:30', 5, [[6, 2], [3, 6], [11, 7]], 'stb'],
      ['o', 'v', '2026-10-30T19:00', 1, 'np-a', ''], ['g', 'p', '2026-10-31T10:30', 3, [[6, 4], [6, 4]], 'full'],
      ['k', 'p', '2026-11-02T20:30', 2, [[6, 3], [6, 4]], 'full'], ['g', 'b', '2026-11-06T19:00', 4, [[6, 4], [3, 6], [4, 4]], 'time'],
      ['e', 'o', '2026-11-07T12:00', 1, [[6, 1], [6, 2]], 'full'], ['e', 'v', '2026-11-16T20:30', 4, 'pending', ''],
      ['g', 'o', '2026-11-17T19:00', 1, null, ''], ['e', 'k', '2026-11-20T19:00', 3, null, ''],
      ['k', 'b', '2026-11-30T20:30', 1, null, ''], ['v', 'g', '2026-12-05T10:30', 2, null, ''], ['p', 'o', '2026-12-11T19:00', 3, null, ''],
    ];
    G3F.forEach(([a, b, at, court, res, end], i) => {
      const m = { id: 'm3-' + i, g: 3, a: 'g3-' + a, b: 'g3-' + b, at, court, st: 'scheduled', sets: null, end: null, np: null, chg: 0, pact: {} };
      if (Array.isArray(res)) { m.st = 'played'; m.sets = res; m.end = end; }
      else if (res === 'np-a') { m.st = 'played'; m.np = 'a'; m.end = 'np'; }
      else if (res === 'pending') { m.st = 'scheduled'; m.resultDue = true; }
      st.matches.push(m);
    });
    const ek = st.matches.find((m) => m.a === 'g3-e' && m.b === 'g3-k');
    ek.pact = { a: 'stb' };
    /* escuela (va antes del calendario de la liga para que las pistas no se pisen) */
    st.coaches = {
      'c-unai': { id: 'c-unai', name: 'Unai Zubizarreta', short: 'Unai', hours: 13, color: 'a' },
      'c-irati': { id: 'c-irati', name: 'Irati Aranburu', short: 'Irati', hours: 12, color: 'b' },
      'c-julen': { id: 'c-julen', name: 'Julen Ostolaza', short: 'Julen', hours: 7, color: 'c' },
    };
    const GR = [
      ['gr-mon1030', 'adult', 'Iniciación', 'Hasiera', 1, '10:30', 5, 'c-irati', 4, 3],
      ['gr-mon18', 'kids', 'Iniciación', 'Hasiera', 1, '18:00', 5, 'c-irati', 6, 5],
      ['gr-mon19', 'adult', 'Intermedio', 'Ertaina', 1, '19:00', 4, 'c-unai', 4, 4],
      ['gr-mon20', 'adult', 'Avanzado', 'Aurreratua', 1, '20:00', 5, 'c-julen', 3, 3],
      ['gr-tue1730', 'kids', 'Perfeccionamiento', 'Hobekuntza', 2, '17:30', 1, 'c-irati', 6, 6],
      ['gr-tue19', 'adult', 'Intermedio', 'Ertaina', 2, '19:00', 4, 'c-unai', 4, 4],
      ['gr-tue20', 'adult', 'Iniciación', 'Hasiera', 2, '20:00', 5, 'c-unai', 4, 4],
      ['gr-wed1730', 'kids', 'Iniciación', 'Hasiera', 3, '17:30', 1, 'c-irati', 6, 5],
      ['gr-wed1830', 'kids', 'Competición', 'Lehiaketa', 3, '18:30', 2, 'c-julen', 6, 4],
      ['gr-wed1930', 'adult', 'Intermedio', 'Ertaina', 3, '19:30', 3, 'c-unai', 4, 4],
      ['gr-wed2030', 'adult', 'Avanzado', 'Aurreratua', 3, '20:30', 3, 'c-julen', 3, 3],
      ['gr-thu10', 'adult', 'Iniciación', 'Hasiera', 4, '10:00', 4, 'c-irati', 4, 4],
      ['gr-thu19', 'adult', 'Intermedio', 'Ertaina', 4, '19:00', 4, 'c-unai', 4, 3],
      ['gr-thu20', 'adult', 'Iniciación', 'Hasiera', 4, '20:00', 5, 'c-irati', 4, 2],
      ['gr-fri1730', 'kids', 'Iniciación', 'Hasiera', 5, '17:30', 1, 'c-irati', 6, 4],
      ['gr-sat10', 'kids', 'Iniciación', 'Hasiera', 6, '10:00', 4, 'c-irati', 6, 6],
      ['gr-sat11', 'kids', 'Perfeccionamiento', 'Hobekuntza', 6, '11:00', 4, 'c-julen', 6, 5],
    ];
    GR.forEach(([id, kind, lvl, lvlEu, dow, time, court, coach, cap]) => st.groups.push({ id, kind, lvl, lvlEu, dow, time, court, coach, cap }));
    const fixed = {
      'gr-tue19': [['s-leire', 'Leire Etxeberria', true], ['s-amaia', 'Amaia Garmendia', true], ['s-josu', 'Josu Irazu', false], ['s-nekane', 'Nekane Sarasola', true]],
      'gr-wed1730': [['s-aimar', 'Aimar Olano', true, 10], ['s-ekhi', 'Ekhi Lasa', true, 9], ['s-nahia', 'Nahia Ruiz', false, 10], ['s-unax', 'Unax Gil', true, 11], ['s-lur', 'Lur Agirre', true, 9]],
      'gr-mon19': [['s-garazi', 'Garazi Lasa', true], ['s-ander', 'Ander Mujika', true], ['s-ion', 'Ion Ibarguren', false], ['s-edurne', 'Edurne Zabala', true]],
    };
    const KIDS = ['Aner', 'Danel', 'Eki', 'Hodei', 'Ibai', 'Jare', 'Laia', 'Malen', 'Naroa', 'Oinatz', 'Paule', 'Telmo', 'Udane', 'Uxue', 'Xuban', 'Izaro', 'Ugaitz', 'Libe', 'Enaitz', 'Haizea', 'Martin', 'Irene', 'Lucía', 'Hugo', 'Leo'];
    GR.forEach(([id, kind, , , , , , , , fill]) => {
      const f = fixed[id] || [];
      f.forEach(([sid, name, socio, age]) => { st.students[sid] = { id: sid, name, socio, group: id, age: age || null, sepa: sid !== 's-aimar' && R() < 0.85, att: 0 }; used.add(name); });
      for (let i = f.length; i < fill; i++) {
        const sid = `s-${id}-${i}`;
        const name = kind === 'kids' ? pick(KIDS) + ' ' + pick(LAST) : person();
        st.students[sid] = { id: sid, name, socio: R() < 0.66, group: id, age: kind === 'kids' ? 7 + Math.floor(R() * 7) : null, sepa: R() < 0.8, att: 0 };
      }
    });
    st.students['s-leire'].sepa = true;
    st.students['s-aimar'].sepa = false;
    st.students['s-aimar'].info = { med: 'Asma leve · inhalador en la mochila', pickup: 'Maite Olano (ama) · Joxe Olano (aitona)', image: true };
    st.students['s-josu'].streak = 3; // tres faltas seguidas: alerta de abandono
    st.students[Object.keys(st.students).find((k) => k.startsWith('s-gr-thu20'))].leaving = true;
    st.students[Object.keys(st.students).find((k) => k.startsWith('s-gr-sat11'))].leaving = true;
    // asistencia acumulada del trimestre
    Object.values(st.students).forEach((s) => { s.att = s.id === 's-josu' ? 0.67 : s.id === 's-leire' ? 0.875 : 0.82 + R() * 0.18; });
    st.students['s-garazi'].extraCredits = 1;
    st.absences.push({ id: 'a1', student: 's-nekane', group: 'gr-tue19', date: '2026-11-17T19:00', notice: true, ts: '2026-11-16T21:10' });
    st.makeups.push({ id: 'u1', student: 's-garazi', group: 'gr-tue19', date: '2026-11-17T19:00', from: 'gr-mon19', st: 'booked', ts: '2026-11-16T22:02' });
    st.evals['s-leire'] = {
      start: { der: 5, rev: 4, vol: 5, ban: 3, vib: 2, rem: 3, sr: 5, tac: 4 }, cur: { der: 6, rev: 5, vol: 6, ban: 4, vib: 3, rem: 4, sr: 6, tac: 5 },
      goal: 'Bandeja cruzada a la reja, que no sea un remate', updated: '2026-11-10T20:05',
      notes: [{ ts: '2026-11-10T20:05', by: 'c-unai', text: 'Muy buena salida de pared de derecha. Toca trabajar la bandeja: que no sea un remate.' }, { ts: '2026-10-13T20:02', by: 'c-unai', text: 'Mejor colocación en la red. Ojo con quedarse en tierra de nadie.' }],
    };
    st.evals['s-aimar'] = {
      start: { der: 3, rev: 2, vol: 3, ban: 1, vib: 1, rem: 1, sr: 3, tac: 2 }, cur: { der: 5, rev: 3, vol: 4, ban: 2, vib: 1, rem: 2, sr: 4, tac: 3 },
      goal: 'Salida de pared', updated: '2026-11-11T18:40',
      notes: [{ ts: '2026-11-11T18:40', by: 'c-irati', text: '¡Esta semana ha conseguido su primer globo! Disfruta muchísimo y ayuda a los peques.' }],
      badges: [['Saque por abajo', 1], ['10 voleas seguidas', 1], ['Primer globo', 1], ['Salida de pared', 0.6], ['Bandeja', 0]],
    };
    // recibos del 1er trimestre (cobrado al inicio)
    Object.values(st.students).forEach((s, i) => {
      const unpaid = ['s-josu', 's-gr-sat10-3', 's-gr-mon18-2'].includes(s.id);
      st.pay.push({ id: 'r' + i, student: s.id, concept: 'Escuela · 1er trimestre', amount: PC.priceOf(s), st: unpaid ? 'pending' : 'paid', method: unpaid ? null : (s.sepa ? 'domiciliación' : 'recepción'), due: '2026-09-16', t: 'T1', reminded: unpaid ? 2 : 0 });
    });
    st.wait = [
      { id: 'w1', name: 'Haizea Ostolaza', kind: 'kids', lvl: 'Iniciación', pref: 'miércoles o viernes tarde', since: '2026-10-02', age: 8 },
      { id: 'w2', name: 'Telmo Urkiola', kind: 'kids', lvl: 'Iniciación', pref: 'cualquier tarde', since: '2026-10-21', age: 9 },
      { id: 'w3', name: 'Begoña Arrieta', kind: 'adult', lvl: 'Iniciación', pref: 'jueves', since: '2026-10-28' },
      { id: 'w4', name: 'Raúl Navarro', kind: 'adult', lvl: 'Intermedio', pref: 'lunes o martes 19:00', since: '2026-11-03' },
      { id: 'w5', name: 'Oihana Beristain', kind: 'adult', lvl: 'Avanzado', pref: 'miércoles', since: '2026-11-12' },
    ];
    /* calendario del resto de grupos (round robin) evitando pistas de la escuela y con máximo 3 pistas de liga por franja */
    const occ = {};
    const occKey = (iso) => iso;
    st.matches.forEach((m) => { (occ[occKey(m.at)] = occ[occKey(m.at)] || []).push(m.court); });
    const schoolBusy = (iso) => { const dow = PC.parse(iso).getDay(), hm = iso.slice(11, 16); return st.groups.filter((g) => g.dow === dow && overlap(hm, 90, g.time, 60)).map((g) => g.court); };
    const week0 = PC.parse('2026-10-05T00:00');
    const dayOffsets = [0, 1, 4, 5, 6];
    let mi = 0;
    Object.keys(G_NAMES).map(Number).forEach((g) => {
      const tids = st.teams.filter((t) => t.g === g).map((t) => t.id);
      const arr = tids.length % 2 ? [...tids, null] : [...tids];
      const n = arr.length, rounds = n - 1;
      for (let r = 0; r < rounds; r++) {
        const w = Math.floor((r * 11) / rounds);
        for (let i = 0; i < n / 2; i++) {
          const a = arr[i], b = arr[n - 1 - i];
          if (!a || !b) continue;
          let placed = null;
          for (let tries = 0; tries < 40 && !placed; tries++) {
            let off = dayOffsets[Math.floor(R() * dayOffsets.length)];
            if (w === 0 && off === 0) off = 1;
            const d = new Date(week0); d.setDate(d.getDate() + w * 7 + off);
            const day = PC.iso(d).slice(0, 10);
            if (day > PC.PHASE.to) continue;
            const slots = PC.slotsFor(day);
            const prefer = R() < 0.7 ? slots.slice(-3) : slots;
            const iso = day + 'T' + prefer[Math.floor(R() * prefer.length)];
            const lg = occ[iso] || [];
            if (lg.length >= PC.RULES.maxLeagueCourts) continue;
            const busy = [...lg, ...schoolBusy(iso)];
            const c = [1, 2, 3, 4, 5].find((x) => !busy.includes(x));
            if (!c) continue;
            placed = { iso, c };
          }
          if (!placed) continue;
          (occ[placed.iso] = occ[placed.iso] || []).push(placed.c);
          const m = { id: `m${g}-${mi++}`, g, a, b, at: placed.iso, court: placed.c, st: 'scheduled', sets: null, end: null, np: null, chg: 0, pact: {} };
          if (PC.parse(placed.iso).getTime() + 90 * 60000 < PC.NOW.getTime()) {
            m.st = 'played';
            const x = R();
            if (x < 0.035) { m.np = R() < 0.5 ? 'a' : 'b'; m.end = 'np'; }
            else {
              const winA = R() < 0.5;
              const set = (w) => { const l = Math.floor(R() * 5); const s = R() < 0.15 ? [7, 5 + Math.floor(R() * 2)] : [6, l]; return w ? s : [s[1], s[0]]; };
              if (x < 0.12) { m.sets = [set(true), set(false), [4, 4]]; m.end = 'time'; }
              else if (x < 0.5) { const stb = R() < 0.6; m.sets = [set(winA), set(!winA), stb ? (winA ? [11, 4 + Math.floor(R() * 6)] : [4 + Math.floor(R() * 6), 11]) : set(winA)]; m.end = stb ? 'stb' : 'full'; }
              else { m.sets = [set(winA), set(winA)]; m.end = 'full'; }
            }
          }
          st.matches.push(m);
        }
      }
    });
    st.matches.sort((x, y) => x.at.localeCompare(y.at));
    // historial de cambios ya validados (para que el panel tenga memoria)
    const others = st.matches.filter((m) => m.g !== 3);
    let hist = 0;
    for (const m of others) {
      if (hist >= 9) break;
      if (m.at > '2026-10-12' && m.at < '2026-11-14' && R() < 0.22) {
        const orig = PC.addDays(m.at, -(1 + Math.floor(R() * 4)));
        m.orig = orig; m.chg = 1;
        const tsP = PC.addDays(orig, -3);
        st.changes.push({ id: 'ch' + hist, m: m.id, by: R() < 0.5 ? m.a : m.b, opts: [m.at], pick: m.at, st: 'validated', ts: tsP, tsAccept: PC.addDays(tsP, 0).slice(0, 11) + '21:10', tsVal: PC.addDays(tsP, 1).slice(0, 11) + '10:05', court: m.court, hist: true });
        hist++;
      }
    }
    // un cambio acordado en otro grupo esperando validación
    const g5m = st.matches.find((m) => m.g === 5 && m.st === 'scheduled' && m.at > '2026-11-18');
    if (g5m) {
      let pickIso = PC.addDays(g5m.at, 1);
      if (!PC.isLeagueDay(pickIso)) pickIso = PC.addDays(g5m.at, 3);
      pickIso = pickIso.slice(0, 11) + (PC.slotsFor(pickIso.slice(0, 10)).includes('12:00') ? '12:00' : '19:00');
      st.changes.unshift({ id: 'ch-g5', m: g5m.id, by: g5m.a, opts: [pickIso, PC.addDays(pickIso, 3)], pick: pickIso, st: 'accepted', ts: '2026-11-17T09:12', tsAccept: '2026-11-17T13:40' });
      g5m.chgReq = 'ch-g5';
    }
    // un resultado en disputa
    const dm = st.matches.filter((m) => m.g === 6 && m.st === 'played').pop();
    if (dm) {
      dm.st = 'disputed';
      st.disputes.push({ id: 'd1', m: dm.id, st: 'open', v: { a: { sets: [[6, 4], [6, 3]], end: 'full', by: dm.a }, b: { sets: [[6, 4], [3, 6], [11, 8]], end: 'stb', by: dm.b } }, ts: '2026-11-16T22:40' });
    }
    st.inscr = [{ id: 'i1', team: 'Smash & Txakoli', players: 'Haritz Otegi · Uxue Azkue', lvl: 2.5, ts: '2026-11-16T21:14', st: 'new', from: 'formulario web' }];
    // bolsa de sustitutos
    st.pool = [
      ['Ander Mujika', 3.0, 'tardes entre semana', true], ['Maialen Ostolaza', 3.1, 'fines de semana', true], ['Iñigo Sarasola', 2.9, 'cualquier día', false],
      ['Peio Garmendia', 2.6, 'lunes y viernes', true], ['Xabier Etxeberria', 3.6, 'tardes', true], ['Beñat Zubeldia', 3.4, 'martes', false],
    ].map(([name, lvl, when, socio], i) => { const id = 'pool' + i; st.players[id] = { id, name, lvl, socio, pool: true, when }; return id; });
    // socios
    st.members = { types: [['Gym', 20, 38], ['Pádel', 30, 96], ['Pádel + Gym', 40, 41], ['Familiar', 50, 27], ['Familiar Premium', 56, 12]], alta: 6, baja: 2, devueltos: 2 };
    st.events = [
      { id: 'ev1', name: 'Pozo Femenino', when: '2026-11-21T12:00', lvl: '1 – 3,5', cap: 22, n: 13, price: 0, where: 'playtomic' },
      { id: 'ev2', name: 'Pozo Queens & Kings', when: '2026-11-21T16:00', lvl: '0,5 – 2,3', cap: 22, n: 9, price: 0, where: 'playtomic' },
      { id: 'ev3', name: 'Pozo Dominguero Queens & Kings', when: '2026-11-22T16:00', lvl: '2 – 4', cap: 22, n: 2, price: 0, where: 'playtomic' },
      { id: 'ev4', name: 'Americana de Navidad', when: '2026-12-19T16:00', lvl: 'todos', cap: 24, n: 18, price: 15, priceNo: 20, where: 'app', wait: 0, joined: [] },
      { id: 'ev5', name: 'Grand Slam final de temporada', when: '2027-06-05T10:00', lvl: 'campeones de fase', cap: 16, n: 0, price: 0, where: 'app', soon: true },
    ];
    st.docs = [
      { id: 'd-norm', name: 'Normativa de la liga 2026-27', who: 'Jugadores de liga', ok: 88, of: 92 },
      { id: 'd-img', name: 'Autorización de imagen (menores)', who: 'Familias de infantil', ok: 27, of: 30 },
      { id: 'd-sal', name: 'Información médica relevante (menores)', who: 'Familias de infantil', ok: 30, of: 30 },
      { id: 'd-rgpd', name: 'Consentimiento de protección de datos', who: 'Todo el club', ok: 318, of: 318 },
      { id: 'd-sepa', name: 'Mandato SEPA (domiciliación)', who: 'Socios y escuela', ok: 241, of: 262 },
    ];
    st.msgs = [
      { id: 'mh1', seg: 'liga', title: { es: 'Arranca la liga', eu: 'Liga hasi da' }, body: { es: 'Calendario, grupos y normativa ya en la app. ¡Suerte a todos!', eu: 'Egutegia, taldeak eta araudia aplikazioan daude. Zorte on guztioi!' }, ts: '2026-10-05T10:00', sent: 92, read: 88 },
      { id: 'mh2', seg: 'escuela', title: { es: 'Festivo el 8 de diciembre', eu: 'Abenduaren 8a jaieguna' }, body: { es: 'No hay clase. Esa semana cuenta igual: el trimestre mantiene sus 12 clases.', eu: 'Ez dago klaserik. Hiruhilekoak bere 12 klaseak mantentzen ditu.' }, ts: '2026-11-03T12:30', sent: 69, read: 65 },
      { id: 'mh3', seg: 'socios', title: { es: 'Pozos de este fin de semana', eu: 'Asteburuko pozoak' }, body: { es: 'Femenino el sábado a las 12:00 y Queens & Kings a las 16:00. Inscripción en Playtomic.', eu: 'Emakumezkoena larunbatean 12:00etan eta Queens & Kings 16:00etan. Izena Playtomic-en.' }, ts: '2026-11-12T18:00', sent: 214, read: 131 },
    ];
    st.msgs.forEach((m) => st.notifs.push({ id: 'n-' + m.id, to: m.seg, title: m.title, body: m.body, ts: m.ts, read: { mikel: true, iker: true, leire: true, maite: true, unai: true }, kind: 'msg', from: 'club' }));
    const n = (to, title, body, ts, extra = {}) => st.notifs.push({ id: 'n' + (++st.n), to, title, body, ts, read: {}, ...extra });
    n('mikel', { es: 'Resultado pendiente: Errebote – Víbora Team', eu: 'Emaitza falta da: Errebote – Víbora Team' }, { es: 'Jugasteis ayer. Introducid el resultado antes de 24 h y el rival lo confirma.', eu: 'Atzo jokatu zenuten. Sartu emaitza 24 orduko epean eta aurkariak berretsiko du.' }, '2026-11-17T09:00', { kind: 'result', go: { tab: 'liga' } });
    n('iker', { es: 'Viernes: Kristalak – Errebote', eu: 'Ostirala: Kristalak – Errebote' }, { es: 'Errebote ha elegido supertiebreak si quedan menos de 20 minutos. Confírmalo en la ficha del partido.', eu: 'Errebotek supertiebreak aukeratu du 20 minutu baino gutxiago geratzen badira. Berretsi partidaren fitxan.' }, '2026-11-16T12:10', { kind: 'info' });
    n('leire', { es: 'Hoy a las 19:00, pista 4', eu: 'Gaur 19:00etan, 4. pista' }, { es: 'Clase con Unai. Si no puedes venir, avisa desde aquí y recuperas otro día.', eu: 'Klasea Unairekin. Ezin bazara etorri, abisatu hemendik eta beste egun batean berreskuratu.' }, '2026-11-17T09:00', { kind: 'school' });
    n('maite', { es: 'Irati ha escrito sobre Aimar', eu: 'Iratik Aimarri buruz idatzi du' }, { es: '¡Esta semana ha conseguido su primer globo!', eu: 'Aste honetan bere lehen globoa lortu du!' }, '2026-11-11T18:40', { kind: 'school', go: { tab: 'escuela', sub: 'evol' } });
    n('unai', { es: 'Hoy 19:00: Nekane no viene, Garazi recupera', eu: 'Gaur 19:00: Nekane ez da etorriko, Garazik berreskuratuko du' }, { es: 'La plaza de Nekane se ha ocupado sola con una recuperación.', eu: 'Nekaneren plaza berreskuratze batekin bete da.' }, '2026-11-16T22:02', { kind: 'school' });
    st.notifs.sort((a, b) => b.ts.localeCompare(a.ts));
    st.log = [
      { id: 'l1', ts: '2026-11-17T13:40', k: 'liga', icon: 'check', text: 'Indarra acepta el cambio propuesto por Muro Muro · pendiente de validar' },
      { id: 'l2', ts: '2026-11-17T11:02', k: 'cobros', icon: 'euro', text: 'Pago recibido: cuota noviembre · socio Pádel · 30 € por domiciliación (204 recibos)' },
      { id: 'l3', ts: '2026-11-16T22:40', k: 'liga', icon: 'alert', text: 'Resultado en disputa en el Grupo 6: los capitanes no coinciden' },
      { id: 'l4', ts: '2026-11-16T22:02', k: 'escuela', icon: 'school', text: 'Garazi Lasa reserva recuperación en Intermedio del martes 19:00 (plaza de Nekane)' },
      { id: 'l5', ts: '2026-11-16T21:14', k: 'liga', icon: 'users', text: 'Nueva inscripción desde la web: Smash & Txakoli (nivel 2,5) para la Fase II' },
      { id: 'l6', ts: '2026-11-16T20:01', k: 'liga', icon: 'trophy', text: '6 resultados confirmados el fin de semana · clasificaciones recalculadas' },
    ];
    S = null;
    return st;
  }

  PC.load();
})();
