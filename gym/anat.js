// Figura anatómica de Oarso Gym: hombre musculado, de frente y de espaldas, con el grupo muscular iluminado en lima.
// ANAT(vista, principales, secundarios, ancho) → SVG. vista: 'f' (frente) o 'b' (espalda).
// Grupos: pecho, hombros, biceps, triceps, antebrazo, abdomen, espalda, lumbar, gluteos, cuadriceps, isquios, aductores, gemelos, trapecio
(function () {
  const cr = (P) => {
    const n = P.length; let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    const g = (i) => P[(i + n) % n];
    for (let i = 0; i < n; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + 'Z';
  };
  const mir = (P) => P.map(([x, y]) => [200 - x, y]);
  const grow = (P, k) => { const cx = P.reduce((a, p) => a + p[0], 0) / P.length, cy = P.reduce((a, p) => a + p[1], 0) / P.length; return P.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]); };
  const HALF = [[100, 47], [91, 50], [90, 62], [86, 68], [72, 73], [58, 78], [46, 83], [38, 92], [34, 106], [34, 120], [32, 136], [31, 152], [31, 164], [28, 178], [24, 196], [22, 212], [22, 226], [19, 238], [18, 252], [22, 264], [29, 266], [32, 254], [31, 240], [33, 228], [37, 212], [42, 194], [46, 180], [48, 168], [51, 154], [54, 138], [57, 124], [60, 118], [63, 132], [66, 150], [67, 166], [66, 182], [63, 198], [60, 214], [58, 230], [56, 252], [57, 278], [61, 306], [65, 328], [65, 344], [61, 362], [61, 382], [65, 406], [69, 426], [67, 442], [63, 453], [69, 461], [88, 461], [92, 452], [91, 437], [91, 418], [94, 394], [93, 370], [90, 350], [92, 330], [95, 304], [98, 272], [99, 248], [100, 242]];
  const BODY = HALF.concat(mir(HALF).reverse().slice(1, -1));
  const HEAD = [[100, 5], [90, 8], [84, 17], [82, 29], [84, 41], [88, 49], [94, 54], [100, 56], [106, 54], [112, 49], [116, 41], [118, 29], [116, 17], [110, 8]];
  const EAR = [[83, 26], [80, 28], [80, 36], [83, 39], [85, 34]];
  // [puntos, ángulo de las fibras]
  const F = {
    cuello: [[[[92, 51], [95, 62], [99, 73], [97, 77], [91, 68], [89, 58]], 70]],
    trapecio: [[[[89, 61], [86, 68], [75, 72], [62, 77], [67, 80], [80, 78], [91, 75], [95, 72], [92, 66]], -15]],
    hombros: [[[[63, 80], [52, 81], [42, 88], [36, 100], [35, 114], [38, 124], [44, 124], [50, 112], [56, 100], [62, 90], [67, 84]], 80]],
    pecho: [[[[99, 83], [88, 80], [75, 81], [67, 86], [59, 97], [55, 110], [58, 120], [68, 128], [82, 132], [94, 131], [99, 127]], -22]],
    biceps: [[[[50, 125], [44, 129], [40, 140], [39, 154], [41, 165], [46, 168], [50, 160], [53, 146], [55, 133]], 84]],
    triceps: [[[[37, 126], [34, 136], [33, 150], [35, 162], [38, 154], [38, 139]], 86]],
    antebrazo: [[[[46, 172], [40, 176], [34, 189], [29, 204], [27, 218], [29, 226], [33, 226], [36, 212], [41, 196], [46, 184], [48, 177]], 72], [[[34, 169], [30, 177], [26, 190], [24, 204], [27, 206], [31, 191], [36, 179]], 74]],
    abdomen: [[[[99, 133], [90, 134], [88, 141], [89, 149], [99, 150]], 0], [[[99, 152], [89, 152], [88, 160], [89, 168], [99, 169]], 0], [[[99, 171], [89, 171], [88, 179], [89, 187], [99, 188]], 0], [[[99, 190], [90, 190], [90, 201], [93, 213], [99, 222]], 0],
      [[[86, 134], [77, 137], [70, 145], [68, 161], [69, 177], [72, 192], [79, 204], [87, 211], [88, 190], [87, 166], [87, 148]], 60],
      [[[63, 121], [68, 127], [74, 131], [72, 134], [66, 131], [62, 126]], 0], [[[64, 131], [69, 136], [74, 140], [72, 143], [66, 140], [63, 135]], 0]],
    cuadriceps: [[[[65, 226], [58, 242], [56, 268], [58, 296], [63, 318], [70, 330], [75, 324], [74, 300], [71, 272], [70, 246]], 84], [[[79, 226], [73, 236], [71, 260], [73, 288], [77, 312], [82, 322], [86, 304], [87, 276], [86, 248]], 86], [[[89, 282], [85, 300], [83, 318], [86, 332], [93, 331], [96, 316], [95, 295]], 70]],
    aductores: [[[[90, 232], [86, 244], [86, 262], [88, 276], [93, 282], [97, 266], [98, 246], [97, 236]], 68]],
    tibial: [[[[74, 351], [70, 364], [70, 386], [73, 406], [77, 422], [80, 410], [80, 386], [79, 362]], 88]],
    gemelos: [[[[88, 350], [84, 362], [84, 386], [87, 398], [91, 390], [93, 370]], 88], [[[68, 350], [64, 362], [63, 382], [66, 394], [70, 378], [70, 362]], 88]],
  };
  const B = {
    trapecio: [[[[100, 48], [92, 52], [89, 62], [80, 70], [66, 77], [56, 82], [66, 86], [78, 94], [86, 110], [92, 132], [96, 152], [100, 166]], -30]],
    hombros: [[[[56, 83], [46, 86], [39, 96], [36, 108], [37, 121], [43, 123], [50, 112], [57, 100], [64, 90]], 80]],
    espalda: [[[[81, 93], [70, 96], [62, 105], [61, 116], [65, 123], [75, 124], [83, 115], [86, 102]], 20], [[[87, 98], [83, 108], [84, 120], [88, 130], [92, 127], [91, 111], [90, 100]], 35], [[[62, 126], [60, 140], [62, 156], [66, 172], [74, 190], [86, 201], [96, 205], [97, 190], [93, 172], [89, 150], [86, 134], [80, 128], [70, 128]], 58]],
    lumbar: [[[[94, 168], [91, 184], [90, 204], [92, 219], [98, 223], [99, 199], [99, 174]], 90]],
    triceps: [[[[54, 123], [45, 126], [39, 137], [37, 152], [39, 164], [45, 168], [50, 160], [53, 145], [55, 132]], 86]],
    antebrazo: [[[[46, 172], [40, 176], [34, 189], [29, 204], [27, 218], [29, 226], [33, 226], [36, 212], [41, 196], [46, 184], [48, 177]], 72], [[[34, 169], [30, 177], [26, 190], [24, 204], [27, 206], [31, 191], [36, 179]], 74]],
    gluteos: [[[[99, 212], [86, 212], [72, 218], [62, 230], [60, 248], [66, 262], [80, 268], [93, 266], [99, 258]], 32]],
    isquios: [[[[65, 271], [60, 288], [61, 308], [66, 324], [73, 332], [77, 316], [75, 292], [73, 275]], 86], [[[84, 273], [79, 290], [79, 312], [83, 328], [90, 330], [95, 310], [96, 288], [93, 273]], 88]],
    aductores: [[[[94, 274], [92, 292], [95, 300], [98, 284], [98, 272]], 70]],
    gemelos: [[[[69, 346], [63, 360], [62, 380], [66, 396], [75, 400], [77, 382], [77, 362], [75, 348]], 88], [[[82, 348], [79, 364], [80, 386], [85, 404], [92, 400], [95, 380], [93, 358], [88, 348]], 88], [[[68, 401], [71, 416], [78, 428], [87, 428], [91, 412], [89, 403]], 90]],
  };
  // fibras: líneas paralelas recortadas a la forma
  const fibers = (P, ang, cls) => {
    if (ang === 0) return '';
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + 2;
    const a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    let d = '';
    for (let t = -R; t <= R; t += 2.1) d += `M${(cx + nx * t - dx * R).toFixed(1)},${(cy + ny * t - dy * R).toFixed(1)}L${(cx + nx * t + dx * R).toFixed(1)},${(cy + ny * t + dy * R).toFixed(1)}`;
    return d;
  };
  let uid = 0;
  window.ANAT = function (view = 'f', primary = [], secondary = [], w = 150) {
    const id = 'an' + (uid++);
    const M = view === 'b' ? B : F;
    let defs = '', n = '', s = '', p = '', glow = '';
    let k = 0;
    for (const [g, shapes] of Object.entries(M)) {
      const st = primary.includes(g) ? 'p' : secondary.includes(g) ? 's' : 'n';
      for (const [P0, ang] of shapes) for (const [Q, a] of [[P0, ang], [mir(P0), 180 - ang]]) {
        const Qg = grow(Q, 1.06); const d = cr(Qg); const cid = `${id}c${k++}`;
        defs += `<clipPath id="${cid}"><path d="${d}"/></clipPath>`;
        const fb = fibers(Qg, a);
        const fill = st === 'p' ? `url(#${id}h)` : st === 's' ? `url(#${id}s)` : `url(#${id}m)`;
        const fcol = st === 'p' ? '#6d8a00' : st === 's' ? '#3c4b12' : '#0b1426';
        const fop = st === 'p' ? '.35' : '.45';
        const piece = `<path d="${d}" data-g="${g}" fill="${fill}" stroke="#060d1d" stroke-width="1.1"/>` + (fb ? `<path d="${fb}" clip-path="url(#${cid})" stroke="${fcol}" stroke-opacity="${fop}" stroke-width=".45" fill="none"/>` : '');
        if (st === 'p') { p += piece; glow += `<path d="${d}"/>`; } else if (st === 's') s += piece; else n += piece;
      }
    }
    const det = view === 'f'
      ? `<path d="M99 80 Q86 76 66 79 M101 80 Q114 76 134 79" stroke="#060d1d" stroke-width="1.2" fill="none"/><ellipse cx="81" cy="339" rx="5.5" ry="6.5" fill="url(#${id}m)" stroke="#060d1d" stroke-width="1"/><ellipse cx="119" cy="339" rx="5.5" ry="6.5" fill="url(#${id}m)" stroke="#060d1d" stroke-width="1"/>`
      : `<path d="M100 56 L100 228" stroke="#050a17" stroke-width="1.4"/>`;
    return `<svg viewBox="0 0 200 470" width="${w}" height="${Math.round(w * 2.35)}" xmlns="http://www.w3.org/2000/svg" style="display:block">
<defs>${defs}
<radialGradient id="${id}m" cx=".36" cy=".28" r=".95"><stop offset="0" stop-color="#7488b3"/><stop offset=".32" stop-color="#4a5d86"/><stop offset=".72" stop-color="#2b3a5c"/><stop offset="1" stop-color="#18233f"/></radialGradient>
<radialGradient id="${id}h" cx=".36" cy=".28" r=".95"><stop offset="0" stop-color="#fdffdc"/><stop offset=".3" stop-color="#ebff6a"/><stop offset=".72" stop-color="#c6ec22"/><stop offset="1" stop-color="#86a80c"/></radialGradient>
<radialGradient id="${id}s" cx=".36" cy=".28" r=".95"><stop offset="0" stop-color="#b4c86a"/><stop offset=".6" stop-color="#768c2c"/><stop offset="1" stop-color="#46561a"/></radialGradient>
<linearGradient id="${id}bd" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#27375c"/><stop offset="1" stop-color="#111a30"/></linearGradient>
<linearGradient id="${id}lt" x1="0" y1="0" x2="1" y2=".6"><stop offset="0" stop-color="#fff" stop-opacity=".10"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
<radialGradient id="${id}fl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#030713"/><stop offset="1" stop-color="#030713" stop-opacity="0"/></radialGradient>
<filter id="${id}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="4.5"/><feColorMatrix type="matrix" values="0 0 0 0 .85  0 0 0 0 1  0 0 0 0 .24  0 0 0 1 0"/></filter>
<clipPath id="${id}bc"><path d="${cr(BODY)}"/><path d="${cr(HEAD)}"/></clipPath>
</defs>
<ellipse cx="100" cy="463" rx="54" ry="7" fill="url(#${id}fl)"/>
<path d="${cr(BODY)}" fill="url(#${id}bd)" stroke="#34497a" stroke-width=".9"/><path d="${cr(HEAD)}" fill="url(#${id}bd)" stroke="#34497a" stroke-width=".9"/><path d="${cr(EAR)}" fill="#1c2948"/><path d="${cr(mir(EAR))}" fill="#1c2948"/>
${det}${n}${s}<g filter="url(#${id}gl)">${glow}</g>${p}
<rect x="0" y="0" width="200" height="470" fill="url(#${id}lt)" clip-path="url(#${id}bc)"/>
</svg>`;
  };
})();
