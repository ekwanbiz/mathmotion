'use strict';
/* =================== LOKUS · SOALAN BAB 8 LOKUS DALAM DUA DIMENSI (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "lk" / "LK" supaya tidak bertembung dengan teras.

/* =================== pembantu =================== */
// rawak: lkRG untuk Latihan Kelas / games, lkRW (berbenih) untuk Lembaran Kerja
const lkRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const lkRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const lkShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const lkDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const lkN = x => { const v = Math.round(x * 1000) / 1000; return fmt(Object.is(v, -0) ? 0 : v); };
const lkIsInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const lkSq = (dx, dy) => dx * dx + dy * dy;
// jarak dalam bentuk punca: "5" jika kuasa dua sempurna, jika tidak rt(20) (garis atas penuh)
const lkRt = d2 => (lkIsInt(Math.sqrt(d2)) ? String(Math.round(Math.sqrt(d2))) : rt(d2));
const lkPyth = (dx, dy) => { dx = Math.abs(dx); dy = Math.abs(dy); if (!dx || !dy) return `${dx + dy}`; return `${rt(`${dx}² + ${dy}²`)} = ${rt(lkSq(dx, dy))}${lkIsInt(Math.sqrt(lkSq(dx, dy))) ? ' = ' + Math.sqrt(lkSq(dx, dy)) : ''}`; };
const LKHUR = ['P', 'Q', 'R', 'S', 'T', 'K', 'L', 'M', 'N', 'G', 'H', 'U', 'V', 'W'];
const LKCAND = ['A', 'B', 'C', 'D', 'E', 'F'];

/* =================== rajah grid (var(--…)) =================== */
let LKID = 0;
// o = { nx, ny, axes, u, polys:[{pts,c}], segs:[{a,b,c,w,dash}], inf:[{L:[A,B,C],c,w,dash}], circ:[{x,y,r,c,w,dash,fill}], pts:[{x,y,l,c,dx,dy,anchor,r}], texts:[{x,y,s,c,size,anchor}], label }
function lkFig(o) {
  const nx = o.nx || 10, ny = o.ny || 10, u = o.u || 34, pad = o.axes ? 34 : 18;
  const W = nx * u + pad * 2, H = ny * u + pad * 2;
  const X = x => +(pad + x * u).toFixed(1), Y = y => +(pad + (ny - y) * u).toFixed(1);
  const id = 'lkc' + (++LKID);
  let s = `<defs><clipPath id="${id}"><rect x="${X(0)}" y="${Y(ny)}" width="${nx * u}" height="${ny * u}"/></clipPath></defs>`;
  for (let x = 0; x <= nx; x++) s += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(ny)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  for (let y = 0; y <= ny; y++) s += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(nx)}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  if (o.axes) {
    s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(nx) + 12}" y2="${Y(0)}" style="stroke:var(--mu)" stroke-width="2.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(ny) - 12}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
    for (let x = 0; x <= nx; x += 2) s += `<text x="${X(x)}" y="${Y(0) + 20}" style="fill:var(--mu)" font-size="14" font-weight="600" text-anchor="middle">${x}</text>`;
    for (let y = 2; y <= ny; y += 2) s += `<text x="${X(0) - 8}" y="${Y(y) + 5}" style="fill:var(--mu)" font-size="14" font-weight="600" text-anchor="end">${y}</text>`;
    s += `<text x="${X(nx) + 14}" y="${Y(0) - 8}" style="fill:var(--mu)" font-size="15" font-style="italic" font-weight="700">x</text><text x="${X(0) + 8}" y="${Y(ny) - 10}" style="fill:var(--mu)" font-size="15" font-style="italic" font-weight="700">y</text>`;
  }
  let clip = '';
  (o.polys || []).forEach(p => { clip += `<polygon points="${p.pts.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" style="fill:var(--${p.c});fill-opacity:.12;stroke:var(--${p.c})" stroke-width="3" stroke-linejoin="round"/>`; });
  (o.circ || []).forEach(c => { clip += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${+(c.r * u).toFixed(1)}" style="fill:${c.fill ? `var(--${c.c})` : 'none'};fill-opacity:.1;stroke:var(--${c.c})" stroke-width="${c.w || 3.5}"${c.dash ? ' stroke-dasharray="9 6"' : ''}/>`; });
  (o.inf || []).forEach(l => {
    const [A, B, C] = l.L, M = 2 * Math.max(nx, ny); let p, q;
    if (Math.abs(B) > 1e-9) { p = [-M, (C + A * M) / B]; q = [nx + M, (C - A * (nx + M)) / B]; } else { p = [C / A, -M]; q = [C / A, ny + M]; }
    clip += `<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" style="stroke:var(--${l.c})" stroke-width="${l.w || 3.5}"${l.dash ? ' stroke-dasharray="9 6"' : ''}/>`;
  });
  s += `<g clip-path="url(#${id})">${clip}</g>`;
  (o.segs || []).forEach(l => { s += `<line x1="${X(l.a[0])}" y1="${Y(l.a[1])}" x2="${X(l.b[0])}" y2="${Y(l.b[1])}" style="stroke:var(--${l.c})" stroke-width="${l.w || 4}" stroke-linecap="round"${l.dash ? ' stroke-dasharray="9 6"' : ''}/>`; });
  (o.texts || []).forEach(t => { s += `<text x="${X(t.x)}" y="${Y(t.y)}" style="fill:var(--${t.c || 'tx'})" font-size="${t.size || 16}" font-weight="700" text-anchor="${t.anchor || 'middle'}" dominant-baseline="central" font-family="Space Grotesk, sans-serif">${t.s}</text>`; });
  (o.pts || []).forEach(p => {
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r || 6}" style="fill:var(--${p.c || 'tx'})"/>`;
    if (p.ring) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="12" style="fill:none;stroke:var(--${p.c || 'tx'})" stroke-width="2.5"/>`;
    if (p.l) {
      const right = p.x > nx - 1.2, top = p.y > ny - .8;
      const dx = p.dx ?? (right ? -11 : 11), dy = p.dy ?? (top ? 20 : -11), an = p.anchor || (dx < 0 ? 'end' : 'start');
      s += `<text x="${X(p.x) + dx}" y="${Y(p.y) + dy}" style="fill:var(--${p.c || 'tx'})" font-family="Space Grotesk, sans-serif" font-size="18" font-weight="700" text-anchor="${an}">${p.l}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Rajah lokus')}" font-family="Inter, sans-serif">${s}</svg>`;
}
const lkMerge = (...os) => { const r = {}; os.forEach(o => Object.keys(o || {}).forEach(k => { if (Array.isArray(o[k])) r[k] = (r[k] || []).concat(o[k]); else r[k] = o[k]; })); return r; };

/* =================== 8.1 data: situasi harian =================== */
// [situasi, titik, kategori, huraian lokus, sebab]
const LKCAT = { bul: 'Bulatan', lengkok: 'Lengkok bulatan', suku: 'Sukuan bulatan', lurus: 'Garis lurus' };
const LKHARI = [
  ['jarum minit sebuah jam dinding berputar satu pusingan', 'hujung jarum minit', 'bul', 'Bulatan berpusat di pusat jam', 'Hujung jarum sentiasa berjarak sama (panjang jarum) dari pusat jam dan berputar satu pusingan penuh.'],
  ['sebuah buaian berayun ke depan dan ke belakang', 'tempat duduk buaian', 'lengkok', 'Lengkok bulatan berpusat di palang buaian', 'Tempat duduk sentiasa berjarak sama (panjang rantai) dari palang tetapi tidak berputar satu pusingan penuh.'],
  ['sebuah pintu dibuka dari keadaan tertutup hingga 90° (dilihat dari atas)', 'hujung pintu', 'suku', 'Sukuan bulatan berpusat di engsel pintu', 'Hujung pintu sentiasa berjarak sama (lebar pintu) dari engsel dan berputar sebanyak 90°.'],
  ['sebuah lif bergerak dari tingkat bawah ke tingkat atas', 'lantai lif', 'lurus', 'Garis lurus mencancang', 'Lif bergerak tegak ke atas tanpa berpusing.'],
  ['sebuah kipas siling berputar', 'hujung bilah kipas', 'bul', 'Bulatan berpusat di paksi kipas', 'Hujung bilah sentiasa berjarak sama (panjang bilah) dari paksi kipas dan berputar penuh.'],
  ['seorang pelari berlari di lorong lurus 100 m', 'pelari', 'lurus', 'Garis lurus di sepanjang lorong', 'Pelari bergerak di sepanjang lorong yang lurus.'],
  ['sebuah roda Ferris berputar satu pusingan', 'sebuah kabin roda Ferris', 'bul', 'Bulatan berpusat di paksi roda Ferris', 'Kabin sentiasa berjarak sama dari paksi roda dan berputar satu pusingan penuh.'],
  ['sebiji bola dijatuhkan tegak dari bumbung sebuah bangunan', 'bola', 'lurus', 'Garis lurus mencancang', 'Bola jatuh tegak ke bawah.'],
  ['sebuah basikal bergerak di atas jalan rata yang lurus', 'pusat roda basikal', 'lurus', 'Garis lurus yang selari dengan jalan', 'Pusat roda sentiasa berada pada ketinggian yang sama (jejari roda) dari jalan.'],
  ['seekor kambing yang ditambat pada sebatang tiang berjalan dengan talinya sentiasa tegang', 'kambing', 'bul', 'Bulatan berpusat di tiang', 'Kambing sentiasa berjarak sama (panjang tali) dari tiang.'],
  ['bandul sebuah jam datuk berayun', 'hujung bandul', 'lengkok', 'Lengkok bulatan berpusat di titik gantungan bandul', 'Hujung bandul sentiasa berjarak sama dari titik gantungan tetapi hanya berayun sebahagian bulatan.'],
  ['palang di pintu masuk tempat letak kereta diangkat dari kedudukan mengufuk hingga tegak', 'hujung palang', 'suku', 'Sukuan bulatan berpusat di pangkal palang', 'Hujung palang berputar 90° pada pangkalnya dengan jarak yang tetap.'],
  ['pengelap cermin hadapan kereta bergerak ke kiri dan ke kanan', 'hujung pengelap', 'lengkok', 'Lengkok bulatan berpusat di pangkal pengelap', 'Hujung pengelap sentiasa berjarak sama dari pangkalnya tetapi tidak berputar penuh.'],
  ['sebuah kereta api bergerak di atas landasan yang lurus', 'kepala kereta api', 'lurus', 'Garis lurus di sepanjang landasan', 'Kereta api bergerak di sepanjang landasan yang lurus.']
];
const LKBS1 = [
  ['Lokus ialah surihan atau laluan bagi satu set titik yang memenuhi syarat tertentu.', true, 'Ini ialah maksud lokus.'],
  ['Lokus hanya terdiri daripada satu titik sahaja.', false, 'Lokus ialah set semua titik yang memenuhi syarat, biasanya banyak titik.'],
  ['Lokus hujung jarum jam yang berputar satu pusingan ialah sebuah bulatan.', true, 'Hujung jarum sentiasa berjarak sama dari pusat jam.'],
  ['Lokus hujung pintu yang dibuka 90° ialah sebuah bulatan penuh.', false, 'Pintu hanya berputar 90°, jadi lokusnya ialah sukuan bulatan.'],
  ['Lokus sebuah lif yang bergerak naik ialah garis lurus mencancang.', true, 'Lif bergerak tegak ke atas.'],
  ['Lokus engsel pintu ketika pintu dibuka ialah lengkok bulatan.', false, 'Engsel tidak bergerak; ia ialah pusat putaran pintu.'],
  ['Lokus pusat roda yang bergolek di atas jalan rata ialah garis lurus yang selari dengan jalan.', true, 'Pusat roda sentiasa berada sejauh jejari roda dari jalan.'],
  ['Lokus tempat duduk buaian yang berayun ialah garis lurus.', false, 'Tempat duduk berjarak tetap dari palang, jadi lokusnya ialah lengkok bulatan.'],
  ['Lokus dalam dua dimensi terletak pada satu satah.', true, 'Lokus 2D dilukis pada satah, contohnya pada kertas.']
];

/* =================== 8.2 data: lima lokus =================== */
const LKJN = { C: 'Bulatan', B: 'Pembahagi dua sama serenjang', D: 'Sepasang garis selari', M: 'Garis selari di tengah', A: 'Pembahagi dua sama sudut' };
const LKJK = ['C', 'B', 'D', 'M', 'A'];
const LKBS2 = [
  ['Lokus titik yang berjarak tetap dari satu titik tetap ialah sebuah bulatan.', true, 'Semua titik itu berjarak sama (jejari) dari pusat.'],
  ['Lokus titik yang sama jarak dari dua titik tetap P dan Q ialah garis lurus PQ.', false, 'Lokusnya ialah pembahagi dua sama serenjang bagi PQ, bukan garis PQ.'],
  ['Pembahagi dua sama serenjang bagi PQ melalui titik tengah PQ dan berserenjang dengan PQ.', true, 'Itulah maksud pembahagi dua sama serenjang.'],
  ['Lokus titik yang berjarak 3 cm dari garis lurus AB ialah satu garis lurus sahaja.', false, 'Lokusnya ialah sepasang garis selari, satu di setiap belah AB.'],
  ['Lokus titik yang sama jarak dari dua garis selari ialah garis lurus selari di tengah-tengah kedua-dua garis itu.', true, 'Garis tengah itu sama jarak dari kedua-dua garis.'],
  ['Lokus titik yang sama jarak dari dua garis bersilang ialah pembahagi dua sama sudut antara garis-garis itu.', true, 'Setiap titik pada pembahagi dua sama sudut sama jarak dari kedua-dua garis.'],
  ['Titik yang memenuhi dua syarat ialah titik persilangan dua lokus.', true, 'Titik itu mesti berada pada kedua-dua lokus.'],
  ['Dua lokus sentiasa bersilang pada tepat satu titik.', false, 'Dua lokus boleh bersilang pada 0, 1, 2 atau lebih titik.'],
  ['Semasa membina pembahagi dua sama serenjang, bukaan jangka lukis mesti kurang daripada separuh panjang PQ.', false, 'Bukaan jangka lukis mesti lebih daripada separuh panjang PQ supaya lengkok bersilang.'],
  ['Pembahagi dua sama sudut membahagikan sudut kepada dua sudut yang sama besar.', true, 'Sudut asal dibahagi dua sama.']
];

/* =================== enjin lokus: primitif & persilangan =================== */
// primitif: { t:'L', L:[A,B,C] } untuk Ax + By = C ; { t:'C', x, y, r }
function lkMeet(p, q) {
  const E = 1e-9;
  if (p.t === 'C' && q.t === 'L') return lkMeet(q, p);
  if (p.t === 'L' && q.t === 'L') {
    const [a1, b1, c1] = p.L, [a2, b2, c2] = q.L, det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < E) { const k = Math.abs(a1) > E ? a2 / a1 : b2 / b1; return Math.abs(c2 - k * c1) < E ? null : []; }
    return [[(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det]];
  }
  if (p.t === 'L') {
    const [a, b, c] = p.L, n = Math.hypot(a, b), d = (a * q.x + b * q.y - c) / n;
    if (Math.abs(d) > q.r + E) return [];
    const fx = q.x - a * d / n, fy = q.y - b * d / n, h2 = q.r * q.r - d * d;
    if (h2 < E) return [[fx, fy]];
    const h = Math.sqrt(h2), ux = -b / n, uy = a / n;
    return [[fx + ux * h, fy + uy * h], [fx - ux * h, fy - uy * h]];
  }
  const dx = q.x - p.x, dy = q.y - p.y, D = Math.hypot(dx, dy);
  if (D < E) return Math.abs(p.r - q.r) < E ? null : [];
  if (D > p.r + q.r + E || D < Math.abs(p.r - q.r) - E) return [];
  const a = (p.r * p.r - q.r * q.r + D * D) / (2 * D), h2 = p.r * p.r - a * a, mx = p.x + a * dx / D, my = p.y + a * dy / D;
  if (h2 < E) return [[mx, my]];
  const h = Math.sqrt(h2);
  return [[mx - h * dy / D, my + h * dx / D], [mx + h * dy / D, my - h * dx / D]];
}
// persilangan dua set primitif dalam rantau [0,n]x[0,m]; null = tak terhingga
function lkMeetAll(A, B, n, m) {
  let out = [];
  for (const p of A) for (const q of B) { const r = lkMeet(p, q); if (r === null) return null; out = out.concat(r); }
  const E = 1e-7, uniq = [];
  out.forEach(([x, y]) => {
    if (x < -E || y < -E || x > n + E || y > m + E) return;
    if (!uniq.some(u => Math.abs(u[0] - x) < 1e-6 && Math.abs(u[1] - y) < 1e-6)) uniq.push([x, y]);
  });
  return uniq.map(([x, y]) => [lkIsInt(x) ? Math.round(x) : x, lkIsInt(y) ? Math.round(y) : y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
const lkPtsTxt = a => lkDan(a.map(([x, y]) => P(x, y)));

/* ---------- syarat pada satah Cartes 0..10 (untuk persilangan) ---------- */
// nm() memberi huruf seterusnya. Pulangkan { ty, s (klausa), lok, prims, given, loc, chk(x,y) }
function lkCond(r, ty, nm) {
  const N = 10, line = (a, b, c, w) => ({ a, b, c, w: w || 4 });
  if (ty === 'C') {
    const x = r.i(2, 8), y = r.i(2, 8), rad = r.p([2, 3, 4, 5]), T = nm();
    return { ty, s: `sentiasa berjarak ${rad} unit dari titik ${T}${P(x, y)}`, lok: `bulatan berpusat ${T} dengan jejari ${rad} unit`,
      prims: [{ t: 'C', x, y, r: rad }], given: { pts: [{ x, y, l: T, c: 'tr' }] }, loc: { circ: [{ x, y, r: rad, c: 'pk', dash: true }] },
      chk: (a, b) => `jarak dari ${T} = ${lkPyth(a - x, b - y)}`, pts: [[x, y]] };
  }
  if (ty === 'B') {
    const o = r.p(['h', 'v', 's']), Q = nm(), R = nm(); let q, w, L;
    if (o === 's') { let a, b; do { a = r.i(0, 10); b = r.i(0, 10); } while (Math.abs(a - b) < 2); q = [a, b]; w = [b, a]; L = [1, -1, 0]; }
    else { const c = r.i(1, 9), x1 = r.i(0, 6), k = r.i(1, Math.floor((N - x1) / 2)), x2 = x1 + 2 * k; q = o === 'h' ? [x1, c] : [c, x1]; w = o === 'h' ? [x2, c] : [c, x2]; L = o === 'h' ? [1, 0, x1 + k] : [0, 1, x1 + k]; }
    return { ty, s: `sentiasa sama jarak dari titik ${Q}${P(...q)} dan titik ${R}${P(...w)}`, lok: `pembahagi dua sama serenjang bagi garis ${Q}${R}`,
      prims: [{ t: 'L', L }], given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }] }, loc: { inf: [{ L, c: 'pk', dash: true }] },
      chk: (a, b) => `jarak ke ${Q} = jarak ke ${R} = ${lkRt(lkSq(a - q[0], b - q[1]))}`, pts: [q, w] };
  }
  if (ty === 'D') {
    const o = r.p(['h', 'v']), K = nm(), L2 = nm(); let c, d;
    do { c = r.i(1, 9); d = r.i(1, 4); } while (c - d < 0 && c + d > N);
    const ks = [c - d, c + d].filter(v => v >= 0 && v <= N), h = o === 'h';
    const prims = ks.map(v => ({ t: 'L', L: h ? [0, 1, v] : [1, 0, v] }));
    const ep = h ? [[0, c], [N, c]] : [[c, 0], [c, N]];
    return { ty, s: `sentiasa berjarak ${d} unit dari garis lurus ${K}${L2}`, lok: `sepasang garis lurus yang selari dengan ${K}${L2} dan berjarak ${d} unit dari ${K}${L2}`,
      prims, given: { segs: [line(ep[0], ep[1], 'tr')], pts: [{ x: ep[0][0], y: ep[0][1], l: K, c: 'tr', r: 5 }, { x: ep[1][0], y: ep[1][1], l: L2, c: 'tr', r: 5 }] },
      loc: { inf: prims.map(p => ({ L: p.L, c: 'pk', dash: true })) }, chk: (a, b) => `jarak dari ${K}${L2} = ${Math.abs((h ? b : a) - c)}`, pts: ep, lines: [h ? [0, 1, c] : [1, 0, c]] };
  }
  if (ty === 'M') {
    const o = r.p(['h', 'v']), E1 = nm(), F1 = nm(), G1 = nm(), H1 = nm(), c1 = r.i(1, 6), g = 2 * r.i(1, Math.floor((9 - c1) / 2)), c2 = c1 + g, md = c1 + g / 2, h = o === 'h';
    const ep = v => (h ? [[0, v], [N, v]] : [[v, 0], [v, N]]), e1 = ep(c1), e2 = ep(c2), L = h ? [0, 1, md] : [1, 0, md];
    return { ty, s: `sentiasa sama jarak dari garis lurus ${E1}${F1} dan ${G1}${H1}`, lok: `garis lurus yang selari dengan ${E1}${F1} dan ${G1}${H1} di tengah-tengah kedua-dua garis itu`,
      prims: [{ t: 'L', L }], given: { segs: [line(e1[0], e1[1], 'tr'), line(e2[0], e2[1], 'tr')], pts: [{ x: e1[0][0], y: e1[0][1], l: E1, c: 'tr', r: 5 }, { x: e1[1][0], y: e1[1][1], l: F1, c: 'tr', r: 5 }, { x: e2[0][0], y: e2[0][1], l: G1, c: 'tr', r: 5 }, { x: e2[1][0], y: e2[1][1], l: H1, c: 'tr', r: 5 }] },
      loc: { inf: [{ L, c: 'pk', dash: true }] }, chk: () => `jarak dari ${E1}${F1} = jarak dari ${G1}${H1} = ${g / 2}`, pts: e1.concat(e2), lines: [h ? [0, 1, c1] : [1, 0, c1], h ? [0, 1, c2] : [1, 0, c2]] };
  }
  // A: sama jarak dari dua garis bersilang
  if (r.f() < .45) return { ty, s: 'sentiasa sama jarak dari paksi-x dan paksi-y', lok: 'pembahagi dua sama sudut antara paksi-x dan paksi-y',
    prims: [{ t: 'L', L: [1, -1, 0] }], given: {}, loc: { inf: [{ L: [1, -1, 0], c: 'pk', dash: true }] }, chk: (a, b) => `jarak dari paksi-x = jarak dari paksi-y = ${b}`, pts: [], lines: [[0, 1, 0], [1, 0, 0]] };
  const a = r.i(2, 8), b = r.i(2, 8), S1 = nm(), T1 = nm(), U1 = nm(), V1 = nm(), Ls = [[1, -1, a - b], [1, 1, a + b]];
  return { ty, s: `sentiasa sama jarak dari garis lurus ${S1}${T1} dan ${U1}${V1}`, lok: `sepasang pembahagi dua sama sudut antara ${S1}${T1} dan ${U1}${V1}`,
    prims: Ls.map(L => ({ t: 'L', L })), given: { segs: [line([0, b], [N, b], 'tr'), line([a, 0], [a, N], 'tr')], pts: [{ x: 0, y: b, l: S1, c: 'tr', r: 5 }, { x: N, y: b, l: T1, c: 'tr', r: 5 }, { x: a, y: 0, l: U1, c: 'tr', r: 5, dy: -10 }, { x: a, y: N, l: V1, c: 'tr', r: 5 }] },
    loc: { inf: Ls.map(L => ({ L, c: 'pk', dash: true })) }, chk: (x, y) => `jarak dari ${S1}${T1} = jarak dari ${U1}${V1} = ${Math.abs(y - b)}`, pts: [[0, b], [N, b], [a, 0], [a, N]], lines: [[0, 1, b], [1, 0, a]] };
}
// dua syarat berbeza yang bersilang pada 1–4 titik integer dalam grid
function lkPair(r, opt) {
  opt = opt || {};
  for (let t = 0; t < 600; t++) {
    const pool = lkShuf(r, LKHUR), nm = () => pool.shift();
    const [t1, t2] = opt.types || lkShuf(r, LKJK).slice(0, 2);
    if (t1 === t2) continue;
    const a = lkCond(r, t1, nm), b = lkCond(r, t2, nm);
    // objek diberi tidak bertindih
    const gp = a.pts.concat(b.pts), key = gp.map(p => p.join(','));
    if (new Set(key).size !== key.length) continue;
    const X = lkMeetAll(a.prims, b.prims, 10, 10);
    if (!X || !X.length || X.length > (opt.max || 4) || X.length < (opt.min || 1)) continue;
    if (!opt.any && !X.every(p => Number.isInteger(p[0]) && Number.isInteger(p[1]))) continue;
    // titik persilangan bukan objek diberi
    if (X.some(p => key.includes(p.join(',')) || (Math.abs(p[0]) < 1e-9 && Math.abs(p[1]) < 1e-9))) continue;
    return { a, b, X };
  }
  // sandaran: X sama jarak dari Q(1, 5) dan R(7, 5); X berjarak 5 unit dari P(1, 1)
  const a = { ty: 'B', s: 'sentiasa sama jarak dari titik Q(1, 5) dan titik R(7, 5)', lok: 'pembahagi dua sama serenjang bagi garis QR', prims: [{ t: 'L', L: [1, 0, 4] }], given: { pts: [{ x: 1, y: 5, l: 'Q', c: 'tr' }, { x: 7, y: 5, l: 'R', c: 'tr' }] }, loc: { inf: [{ L: [1, 0, 4], c: 'pk', dash: true }] }, chk: (x, y) => `jarak ke Q = jarak ke R = ${lkRt(lkSq(x - 1, y - 5))}`, pts: [[1, 5], [7, 5]] };
  const b = { ty: 'C', s: 'sentiasa berjarak 5 unit dari titik P(1, 1)', lok: 'bulatan berpusat P dengan jejari 5 unit', prims: [{ t: 'C', x: 1, y: 1, r: 5 }], given: { pts: [{ x: 1, y: 1, l: 'P', c: 'tr' }] }, loc: { circ: [{ x: 1, y: 1, r: 5, c: 'pk', dash: true }] }, chk: (x, y) => `jarak dari P = ${lkPyth(x - 1, y - 1)}`, pts: [[1, 1]] };
  return { a, b, X: [[4, 5]] };
}
function lkPairFig(pr, ans) {
  const lc = o => Object.assign({}, o, { circ: (o.circ || []).map(c => Object.assign({}, c, { c: 'pu' })), inf: (o.inf || []).map(l => Object.assign({}, l, { c: 'pu' })) });
  const base = lkMerge({ nx: 10, ny: 10, axes: true, u: 30, label: 'Satah Cartes dengan objek tetap bagi dua syarat lokus' }, pr.a.given, pr.b.given);
  if (!ans) return lkFig(base);
  return lkFig(lkMerge(pr.a.loc, lc(pr.b.loc), base, { pts: pr.X.map(([x, y]) => ({ x, y, c: 'gr', ring: true, l: Number.isInteger(x) && Number.isInteger(y) ? P(x, y) : '' })) }));
}

/* ---------- bentuk lokus pada grid 10 × 8 tanpa paksi (8.2 Mudah) ---------- */
function lkShape(r, ty, u) {
  u = u || 'unit';
  const nm = lkShuf(r, LKHUR), seg = (a, b) => ({ a, b, c: 'tr', w: 4 });
  if (ty === 'C') {
    const x = r.i(3, 7), y = r.i(3, 5), rad = r.p([2, 3]), T = nm[0];
    return { ty, s: `sentiasa berjarak ${rad} ${u} dari titik ${T}`, lok: `Bulatan berpusat ${T} dengan jejari ${rad} ${u}`,
      given: { pts: [{ x, y, l: T, c: 'tr' }] }, loc: { circ: [{ x, y, r: rad, c: 'pk', dash: true }] }, key: `C${x}${y}${rad}` };
  }
  if (ty === 'B') {
    const o = r.p(['h', 'v', 's']), Q = nm[0], R = nm[1]; let q, w, L;
    if (o === 'h') { const y = r.i(2, 6), x1 = r.i(1, 3), k = r.i(2, 3); q = [x1, y]; w = [x1 + 2 * k, y]; L = [1, 0, x1 + k]; }
    else if (o === 'v') { const x = r.i(2, 8), y1 = r.i(1, 2), k = r.i(2, 3); q = [x, y1]; w = [x, y1 + 2 * k]; L = [0, 1, y1 + k]; }
    else { const a = r.i(1, 3), b = a + 2 * r.i(2, 3); q = [a, b]; w = [b, a]; L = [1, -1, 0]; }
    return { ty, s: `sentiasa sama jarak dari titik ${Q} dan titik ${R}`, lok: `Pembahagi dua sama serenjang bagi garis ${Q}${R}`,
      given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }], segs: [{ a: q, b: w, c: 'mu', w: 2, dash: true }] }, loc: { inf: [{ L, c: 'pk', dash: true }] }, key: `B${q}${w}` };
  }
  if (ty === 'D') {
    const h = r.f() < .6, K = nm[0], L2 = nm[1], d = r.p([2, 3]);
    const c = h ? r.i(3, 5) : r.i(3, 7), ep = h ? [[1, c], [9, c]] : [[c, 1], [c, 7]];
    const ls = [c - d, c + d].filter(v => v >= 0 && v <= (h ? 8 : 10));
    return { ty, s: `sentiasa berjarak ${d} ${u} dari garis lurus ${K}${L2}`, lok: `Sepasang garis lurus yang selari dengan ${K}${L2} dan berjarak ${d} ${u} dari ${K}${L2}`,
      given: { segs: [seg(ep[0], ep[1])], pts: [{ x: ep[0][0], y: ep[0][1], l: K, c: 'tr', r: 5 }, { x: ep[1][0], y: ep[1][1], l: L2, c: 'tr', r: 5 }] },
      loc: { inf: ls.map(v => ({ L: h ? [0, 1, v] : [1, 0, v], c: 'pk', dash: true })) }, key: `D${h}${c}${d}` };
  }
  if (ty === 'M') {
    const h = r.f() < .6, [E1, F1, G1, H1] = nm, g = r.p([4, 6]), c1 = h ? r.i(1, 7 - g) : r.i(1, 9 - g), md = c1 + g / 2;
    const ep = v => (h ? [[0, v], [10, v]] : [[v, 0], [v, 8]]), e1 = ep(c1), e2 = ep(c1 + g);
    return { ty, s: `sentiasa sama jarak dari dua garis selari ${E1}${F1} dan ${G1}${H1}`, lok: `Garis lurus yang selari dengan ${E1}${F1} dan ${G1}${H1}, di tengah-tengah kedua-dua garis itu (${g / 2} ${u} dari setiap garis)`,
      given: { segs: [seg(e1[0], e1[1]), seg(e2[0], e2[1])], texts: [{ x: e1[0][0] + (h ? .6 : .5), y: e1[0][1] + (h ? .45 : .5), s: E1 + F1, c: 'tr', size: 16, anchor: 'start' }, { x: e2[0][0] + (h ? .6 : .5), y: e2[0][1] + (h ? .45 : .5), s: G1 + H1, c: 'tr', size: 16, anchor: 'start' }] },
      loc: { inf: [{ L: h ? [0, 1, md] : [1, 0, md], c: 'pk', dash: true }] }, key: `M${h}${c1}${g}`, names: [E1 + F1, G1 + H1] };
  }
  const O = nm[0], A1 = nm[1], B1 = nm[2];
  if (r.f() < .5) {
    const ox = r.i(1, 2), oy = 1, a = [9, oy], b = [ox, 7];
    return { ty, s: `sentiasa sama jarak dari garis lurus ${O}${A1} dan ${O}${B1}`, lok: `Pembahagi dua sama sudut ${A1}${O}${B1}`,
      given: { segs: [seg([ox, oy], a), seg([ox, oy], b)], pts: [{ x: ox, y: oy, l: O, c: 'tr', dx: -8, dy: 20, anchor: 'end' }, { x: a[0], y: a[1], l: A1, c: 'tr', r: 5 }, { x: b[0], y: b[1], l: B1, c: 'tr', r: 5 }] },
      loc: { segs: [{ a: [ox, oy], b: [ox + 6, oy + 6], c: 'pk', w: 3.5, dash: true }] }, key: `A${ox}` };
  }
  const x = r.i(4, 6), y = 4;
  return { ty, s: `sentiasa sama jarak dari dua garis lurus ${A1}${O} dan ${B1}${O} yang bersilang di ${O}`, lok: `Sepasang pembahagi dua sama sudut yang dibentuk oleh garis ${A1}${O} dan ${B1}${O}`,
    given: { segs: [seg([0, y], [10, y]), seg([x, 0], [x, 8])], pts: [{ x, y, l: O, c: 'tr', dx: 10, dy: 22 }, { x: 0, y, l: A1, c: 'tr', r: 5, dx: 6, dy: -10, anchor: 'start' }, { x, y: 8, l: B1, c: 'tr', r: 5, dx: 10, dy: 18 }] },
    loc: { inf: [{ L: [1, -1, x - y], c: 'pk', dash: true }, { L: [1, 1, x + y], c: 'pk', dash: true }] }, key: `X${x}` };
}
const lkShapeFig = (sh, ans, label) => lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: label || 'Rajah pada grid segi empat sama' }, ans ? sh.loc : {}, sh.given));

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 8.1 Lokus ---------- */
  harian: [
    ({ sit, tt }) => ({ q: `Huraikan lokus bagi ${tt} apabila ${sit}.` }),
    ({ sit, tt }) => ({ q: `Apakah bentuk lokus ${tt} apabila ${sit}?` }),
    ({ sit, tt }) => { const N = vnama(); return { q: `${N} memerhatikan ${sit}. Nyatakan lokus bagi ${tt}.` }; },
    ({ sit, tt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata lokus ${tt} apabila ${sit} ialah ${wrong.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, `Lokus ${tt} bukan ${wrong.toLowerCase()}.`)); },
    ({ sit, tt }) => ({ q: `Lengkapkan: Apabila ${sit}, lokus bagi ${tt} ialah ___.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  titik: [
    ({ s }) => ({ q: `Rajah di bawah dilukis pada grid segi empat sama bersisi 1 unit. Titik X bergerak dengan keadaan X ${s}. Antara titik A hingga F, yang manakah terletak pada lokus X?` }),
    ({ s }) => ({ q: `Titik X ${s}. Berdasarkan rajah di bawah (grid 1 unit), senaraikan semua titik berlabel A hingga F yang memenuhi syarat itu.` }),
    ({ s }) => ({ q: `Seekor semut X merayap di atas grid dengan keadaan ia ${s}. Titik berlabel manakah dalam rajah di bawah boleh dilalui oleh semut itu?` }),
    ({ s, n }) => ({ q: `Dalam rajah di bawah, ada ${n} titik berlabel yang terletak pada lokus titik X yang ${s}. Namakan titik-titik itu. (Grid bersisi 1 unit.)` })
  ],
  ferris: [
    ({ D, h0 }) => ({ q: `Sebuah roda Ferris berdiameter ${D} m. Titik terendah kabinnya berada ${h0} m dari tanah. Huraikan lokus sebuah kabin apabila roda itu berputar satu pusingan, dan nyatakan ketinggian maksimum kabin dari tanah.` }),
    ({ D, h0 }) => ({ q: `Kabin sebuah roda Ferris bergerak pada lokus berbentuk bulatan berdiameter ${D} m. Jika kedudukan terendah kabin ialah ${h0} m dari tanah, berapakah ketinggian pusat roda dan ketinggian maksimum kabin?`, ans: `Pusat: ${h0 + D / 2} m, maksimum: ${h0 + D} m` }),
    ({ D, h0 }) => ({ q: `Pusat sebuah roda Ferris berada ${h0 + D / 2} m dari tanah dan jejarinya ${D / 2} m. Nyatakan ketinggian terendah dan tertinggi bagi lokus sebuah kabin.`, ans: `Terendah: ${h0} m, tertinggi: ${h0 + D} m` })
  ],
  tambat: [
    ({ L }) => ({ q: `Seekor kambing ditambat pada tiang T dengan tali sepanjang ${L} m di padang rata. Huraikan lokus kambing apabila talinya sentiasa tegang, dan cari jarak terjauh antara dua kedudukan kambing itu.` }),
    ({ L }) => ({ q: `Seekor lembu ditambat pada sebatang pokok dengan tali ${L} m. Lembu itu berjalan mengelilingi pokok dengan tali sentiasa tegang. Apakah lokusnya dan berapakah diameter lokus itu?` }),
    ({ L }) => { const N = vnama(); return Object.assign({ q: `Seekor kambing ditambat pada tiang dengan tali ${L} m dan berjalan dengan tali sentiasa tegang. ${N} berkata lokusnya ialah bulatan berjejari ${2 * L} m. Adakah ${N} betul?` }, salah(N, `bulatan berjejari ${L} m`, `Jejari lokus ialah panjang tali, iaitu ${L} m. ${2 * L} m ialah diameter.`)); }
  ],
  roda: [
    ({ D }) => ({ q: `Sebuah roda berdiameter ${D} cm bergolek di atas jalan rata yang lurus. Huraikan lokus pusat roda itu.` }),
    ({ D }) => ({ q: `Sebuah tayar basikal berdiameter ${D} cm bergolek di atas jalan rata yang lurus. Pada ketinggian berapakah lokus pusat tayar itu dari jalan? Huraikan lokus itu.` }),
    ({ D }) => ({ q: `Lengkapkan: Lokus pusat roda berdiameter ${D} cm yang bergolek di atas jalan rata ialah garis lurus yang selari dengan jalan dan berjarak ___ cm dari jalan.`, ans: `${D / 2} cm` })
  ],
  k81: [
    ({ w }) => ({ q: `Sebuah pintu selebar ${w} cm dibuka dari keadaan tertutup hingga 90°. (a) Huraikan lokus hujung pintu itu (dilihat dari atas). (b) Hitung panjang lokus itu. (Guna π = ${fr(22, 7)})`, ans: `(a) Sukuan bulatan berpusat di engsel, jejari ${w} cm (b) ${w * 11 / 7} cm`, work: ['(a) Hujung pintu sentiasa berjarak sama (lebar pintu) dari engsel dan berputar 90°.', `(b) Panjang = ${fr(1, 4)} × 2 × ${fr(22, 7)} × ${w}`, `= ${w * 11 / 7} cm`] }),
    ({ L }) => ({ q: `Seekor kambing ditambat dengan tali ${L} m pada bucu sebuah padang segi empat tepat yang berpagar. Kambing itu berada di dalam padang. (a) Huraikan lokus kambing apabila tali sentiasa tegang. (b) Hitung panjang lokus itu. (Guna π = ${fr(22, 7)})`, ans: `(a) Sukuan bulatan berpusat di bucu, jejari ${L} m (b) ${L * 11 / 7} m`, work: ['(a) Pagar membentuk sudut tegak (90°) di bucu, jadi kambing hanya boleh bergerak dalam sukuan bulatan.', `(b) Panjang lengkok = ${fr(1, 4)} × 2 × ${fr(22, 7)} × ${L}`, `= ${L * 11 / 7} m`] }),
    ({ rr, n }) => ({ q: `Sebuah roda berjejari ${rr} cm bergolek di atas jalan lurus sebanyak ${n} pusingan lengkap. (a) Huraikan lokus pusat roda. (b) Hitung panjang lokus pusat roda itu dalam meter. (Guna π = ${fr(22, 7)})`, ans: `(a) Garis lurus selari dengan jalan, ${rr} cm dari jalan (b) ${lkN(n * 44 * rr / 7 / 100)} m`, work: ['(a) Pusat roda sentiasa berada sejauh jejari dari jalan.', `(b) Lilitan = 2 × ${fr(22, 7)} × ${rr} = ${44 * rr / 7} cm`, `Panjang lokus = ${n} × ${44 * rr / 7} = ${n * 44 * rr / 7} cm = ${lkN(n * 44 * rr / 7 / 100)} m`] }),
    ({ D, h0 }) => ({ q: `Sebuah roda Ferris berdiameter ${D} m. Kabin paling rendah berada ${h0} m dari tanah. (a) Huraikan lokus sebuah kabin dalam satu pusingan. (b) Pada ketinggian berapakah kabin itu apabila ia berada sama aras dengan pusat roda? (c) Berapakah jarak yang dilalui oleh kabin dalam satu pusingan? (Guna π = ${fr(22, 7)})`, ans: `(a) Bulatan berpusat di paksi roda, jejari ${D / 2} m (b) ${h0 + D / 2} m (c) ${D * 22 / 7} m`, work: [`(a) Jejari = ${D} ÷ 2 = ${D / 2} m`, `(b) Tinggi pusat = ${h0} + ${D / 2} = ${h0 + D / 2} m`, `(c) Lilitan = ${fr(22, 7)} × ${D} = ${D * 22 / 7} m`] })
  ],

  /* ---------- 8.2 Lokus dalam Dua Dimensi ---------- */
  jenis: [
    ({ s }) => ({ q: `Titik X bergerak supaya X ${s}. Huraikan lokus X.` }),
    ({ s }) => ({ q: `Huraikan lokus bagi titik X yang ${s}.` }),
    ({ s }) => ({ q: `Apakah lokus suatu titik yang ${s}?` }),
    ({ s, wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata lokus titik X yang ${s} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); },
    ({ s }) => ({ q: `Lengkapkan: Lokus titik X yang ${s} ialah ___.` })
  ],
  rajah: [
    () => ({ q: 'Rajah di bawah dilukis pada grid segi empat sama bersisi 1 unit. Garis atau lengkung putus-putus ialah lokus titik X. Nyatakan syarat pergerakan X.' }),
    () => ({ q: 'Lokus titik X ditunjukkan oleh garisan putus-putus dalam rajah di bawah (grid 1 unit). Huraikan syarat yang dipenuhi oleh X.' }),
    ({ jn, sy }) => ({ q: `Rajah di bawah menunjukkan lokus titik X (garisan putus-putus) pada grid bersisi 1 unit. (a) Namakan jenis lokus itu. (b) Nyatakan syarat bagi X.`, ans: `(a) ${jn} (b) X ${sy}` })
  ],
  lukis: [
    ({ s }) => ({ q: `Pada rajah di ruang jawapan, lukis lokus titik X yang ${s}. (Grid bersisi 1 unit.)` }),
    ({ s }) => ({ q: `Rajah di bawah dilukis pada grid segi empat sama bersisi 1 unit. Bina lokus bagi titik X yang ${s}.` }),
    ({ s }) => ({ q: `Dengan menggunakan grid di bawah (sisi 1 unit), lukis dan labelkan lokus X yang ${s}.` })
  ],
  silang: [
    ({ s1, s2 }) => ({ q: `Pada satah Cartes di bawah, X ialah titik yang bergerak di dalam grid dengan keadaan X ${s1} dan X ${s2}. Nyatakan koordinat semua kedudukan X.` }),
    ({ s1, s2 }) => ({ q: `Titik X bergerak di dalam grid di bawah. Diberi X ${s1}, dan X juga ${s2}. Cari koordinat titik X yang memenuhi kedua-dua syarat.` }),
    ({ s1, s2 }) => ({ q: `Pada rajah di bawah, lukis lokus titik yang ${s1} dan lokus titik yang ${s2}. Seterusnya, nyatakan koordinat titik persilangan kedua-dua lokus di dalam grid.` }),
    ({ s1, s2 }) => ({ q: `Sebuah dron mainan X terbang di atas padang bergrid di bawah. Dron itu ${s1} dan ${s2}. Nyatakan koordinat semua kedudukan dron itu.` })
  ],
  bilSilang: [
    ({ s1, s2 }) => ({ q: `Berdasarkan rajah di bawah, berapakah bilangan titik di dalam grid yang ${s1} dan ${s2}?` }),
    ({ s1, s2 }) => ({ q: `Titik X ${s1} dan ${s2}. Dengan melukis kedua-dua lokus pada rajah di bawah, tentukan berapa banyak kedudukan X di dalam grid.` }),
    ({ s1, s2, ans, wn }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hanya ada ${wn} kedudukan bagi titik X yang ${s1} dan ${s2} di dalam grid di bawah. Adakah ${N} betul?` }, salah(N, ans, 'Lukis kedua-dua lokus dengan lengkap dan kira semua titik persilangan di dalam grid.')); }
  ],
  bina: [
    ({ what }) => ({ q: `Huraikan langkah-langkah untuk membina ${what} dengan menggunakan jangka lukis dan pembaris sahaja.` }),
    ({ what, lok }) => ({ q: `Lokus titik X ialah ${lok}. Terangkan cara membina ${what} dengan jangka lukis dan pembaris.` }),
    ({ what }) => { const N = vnama(); return { q: `${N} perlu membina ${what}. Senaraikan langkah yang betul untuk ${N}.` }; }
  ],
  k82: [
    ({ L }) => ({ q: `Dua buah rumah, R${P(L.x1, L.y)} dan S${P(L.x2, L.y)}, terletak di tepi sebatang jalan lurus di sepanjang paksi-x. Sebatang tiang lampu L perlu dipasang supaya sama jarak dari R dan S, dan berjarak ${L.d} unit dari jalan itu (di sebelah rumah). (a) Huraikan lokus titik yang sama jarak dari R dan S. (b) Cari koordinat L.`, ans: `(a) Pembahagi dua sama serenjang bagi RS (garis mencancang melalui ${P(L.m, 0)}) (b) L${P(L.m, L.d)}`, work: [`(a) Titik tengah RS = ${P(L.m, L.y)}; pembahagi dua sama serenjang ialah garis mencancang melalui titik itu.`, `(b) Lokus ${L.d} unit dari jalan (paksi-x): garis mengufuk melalui ${P(0, L.d)}.`, `Persilangan: L${P(L.m, L.d)}. Semak: LR = LS = ${lkRt(lkSq(L.m - L.x1, L.d - L.y))} unit.`] }),
    ({ H }) => ({ q: `ABCD ialah sebuah segi empat sama dengan A(0, 0), B(${H.s}, 0), C(${H.s}, ${H.s}) dan D(0, ${H.s}). Harta karun T terletak di dalam ABCD dengan keadaan T sama jarak dari AB dan DC, dan T berjarak ${H.r} unit dari ${H.cn}. (a) Huraikan lokus bagi setiap syarat. (b) Cari koordinat T.`, ans: `(a) Garis selari di tengah AB dan DC; bulatan berpusat ${H.cn} jejari ${H.r} unit (b) T${P(H.tx, H.h)}`, work: [`Lokus 1: garis mengufuk di tengah AB dan DC, iaitu ${H.h} unit dari AB.`, `Lokus 2: bulatan berpusat ${H.cn} dengan jejari ${H.r} unit.`, `Jarak mengufuk dari ${H.cn} = ${rt(`${H.r}² − ${H.h}²`)} = ${rt(H.r * H.r - H.h * H.h)} = ${H.k}`, `T${P(H.tx, H.h)}`] }),
    ({ G }) => ({ q: `Seekor kambing ditambat pada tiang T${P(G.tx, G.ty)} dengan tali ${G.r} m (1 unit = 1 m). Sebuah baldi air hendak diletakkan pada kedudukan yang boleh dicapai oleh kambing apabila tali tegang dan sama jarak dari dua pokok, M${P(G.m1[0], G.m1[1])} dan N${P(G.m2[0], G.m2[1])}. Cari koordinat semua kedudukan yang mungkin bagi baldi itu.`, ans: lkPtsTxt(G.X), work: [`Lokus 1: bulatan berpusat T dengan jejari ${G.r} unit.`, `Lokus 2: pembahagi dua sama serenjang bagi MN, iaitu ${G.desc}.`, `Persilangan: ${lkPtsTxt(G.X)}.`, `Semak: ${G.X.map(([x, y]) => `${P(x, y)} → jarak dari T = ${lkPyth(x - G.tx, y - G.ty)}`).join('; ')}`] }),
    ({ Q }) => ({ q: `Pada satah Cartes, titik X bergerak dengan keadaan X sama jarak dari paksi-x dan paksi-y, dan X berjarak ${Q.d} unit dari garis lurus yang melalui ${P(0, Q.c)} dan selari dengan paksi-x. (a) Huraikan kedua-dua lokus. (b) Cari koordinat semua kedudukan X dalam sukuan pertama.`, ans: `(a) Pembahagi dua sama sudut antara paksi-x dan paksi-y; sepasang garis selari ${Q.d} unit dari garis itu (b) ${lkPtsTxt(Q.X)}`, work: ['Lokus 1: garis yang membahagi dua sama sudut di antara paksi-x dan paksi-y (titik-titik dengan koordinat x = y).', `Lokus 2: dua garis mengufuk melalui ${lkDan(Q.ys.map(v => P(0, v)))}.`, `Persilangan dalam sukuan pertama: ${lkPtsTxt(Q.X)}`] })
  ]
};

/* =================== pembina soalan (r = lkRG atau lkRW) =================== */
const LK = {};
/* ---------- 8.1 ---------- */
LK.harian = (r, k) => {
  const [sit, tt, cat, desc, why] = k == null ? r.p(LKHARI) : LKHARI[k % LKHARI.length];
  const wrong = LKCAT[r.p(Object.keys(LKCAT).filter(c => c !== cat))];
  return GEN_LQ('harian', { sit, tt, wrong, ans: desc, why, work: [why, `Maka lokus ${tt} ialah ${desc[0].toLowerCase() + desc.slice(1)}.`] });
};
LK.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
// syarat untuk soalan "titik manakah pada lokus" (grid 10 × 8)
function lkTitikCond(r, ty) {
  const nm = lkShuf(r, LKHUR), seg = (a, b) => ({ a, b, c: 'tr', w: 4 });
  if (ty === 'D') {
    const c = r.i(3, 5), d = r.p([1, 2, 3]), K = nm[0], L = nm[1];
    return { s: `sentiasa berjarak ${d} unit dari garis lurus ${K}${L}`, g: (x, y) => Math.abs(Math.abs(y - c) - d), chk: (x, y) => `jarak dari ${K}${L} = ${Math.abs(y - c)}`,
      given: { segs: [seg([0, c], [10, c])], texts: [{ x: .3, y: c + .4, s: K, c: 'tr', anchor: 'start' }, { x: 9.7, y: c + .4, s: L, c: 'tr', anchor: 'end' }] },
      loc: { inf: [c - d, c + d].filter(v => v >= 0 && v <= 8).map(v => ({ L: [0, 1, v], c: 'pk', dash: true })) }, bad: (x, y) => y === c };
  }
  if (ty === 'M') {
    const c1 = r.i(1, 3), g = r.p([2, 4]), c2 = c1 + g, md = c1 + g / 2, nmz = [nm[0] + nm[1], nm[2] + nm[3]];
    return { s: `sentiasa sama jarak dari dua garis selari ${nmz[0]} dan ${nmz[1]}`, g: (x, y) => Math.abs(y - md), chk: (x, y) => `jarak dari ${nmz[0]} = ${Math.abs(y - c1)}, dari ${nmz[1]} = ${Math.abs(y - c2)}`,
      given: { segs: [seg([0, c1], [10, c1]), seg([0, c2], [10, c2])], texts: [{ x: .3, y: c1 + .4, s: nmz[0], c: 'tr', anchor: 'start' }, { x: .3, y: c2 + .4, s: nmz[1], c: 'tr', anchor: 'start' }] },
      loc: { inf: [{ L: [0, 1, md], c: 'pk', dash: true }] }, bad: (x, y) => y === c1 || y === c2 };
  }
  if (ty === 'Bh') {
    const y0 = r.i(2, 6), x1 = r.i(1, 3), k = r.i(2, 3), x2 = x1 + 2 * k, md = x1 + k, Q = nm[0], R = nm[1];
    return { s: `sentiasa sama jarak dari titik ${Q} dan titik ${R}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x1, y - y0)) - Math.sqrt(lkSq(x - x2, y - y0))), chk: (x, y) => `${Q} → ${lkRt(lkSq(x - x1, y - y0))}, ${R} → ${lkRt(lkSq(x - x2, y - y0))}`,
      given: { pts: [{ x: x1, y: y0, l: Q, c: 'tr' }, { x: x2, y: y0, l: R, c: 'tr' }] }, loc: { inf: [{ L: [1, 0, md], c: 'pk', dash: true }] }, bad: (x, y) => (x === x1 || x === x2) && y === y0 };
  }
  if (ty === 'Cs') {
    const x0 = r.i(3, 7), y0 = r.i(3, 5), rad = r.p([2, 3]), T = nm[0];
    return { s: `sentiasa berjarak ${rad} unit dari titik ${T}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x0, y - y0)) - rad), chk: (x, y) => `jarak dari ${T} = ${lkPyth(x - x0, y - y0)}`,
      given: { pts: [{ x: x0, y: y0, l: T, c: 'tr' }] }, loc: { circ: [{ x: x0, y: y0, r: rad, c: 'pk', dash: true }] }, bad: (x, y) => x === x0 && y === y0 };
  }
  if (ty === 'C5') {
    const x0 = r.i(4, 6), y0 = 4, T = nm[0];
    return { s: `sentiasa berjarak 5 unit dari titik ${T}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x0, y - y0)) - 5), chk: (x, y) => `jarak dari ${T} = ${lkPyth(x - x0, y - y0)}`,
      given: { pts: [{ x: x0, y: y0, l: T, c: 'tr' }] }, loc: { circ: [{ x: x0, y: y0, r: 5, c: 'pk', dash: true }] }, bad: (x, y) => x === x0 && y === y0 };
  }
  if (ty === 'Bg') {
    let q, w; do { q = [r.i(1, 5), r.i(1, 4)]; w = [q[0] + r.p([2, 4]), q[1] + r.p([2, -2, 4])]; } while (w[1] < 0 || w[1] > 8 || w[0] > 9);
    const Q = nm[0], R = nm[1], A = 2 * (w[0] - q[0]), B = 2 * (w[1] - q[1]), Cc = lkSq(w[0], w[1]) - lkSq(q[0], q[1]);
    return { s: `sentiasa sama jarak dari titik ${Q} dan titik ${R}`, g: (x, y) => Math.abs(lkSq(x - q[0], y - q[1]) - lkSq(x - w[0], y - w[1])) / 4, chk: (x, y) => `${Q} → ${lkRt(lkSq(x - q[0], y - q[1]))}, ${R} → ${lkRt(lkSq(x - w[0], y - w[1]))}`,
      given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }], segs: [{ a: q, b: w, c: 'mu', w: 2, dash: true }] }, loc: { inf: [{ L: [A, B, Cc], c: 'pk', dash: true }] }, bad: (x, y) => (x === q[0] && y === q[1]) || (x === w[0] && y === w[1]) };
  }
  // A: sudut tegak di O
  const ox = r.i(0, 2), oy = r.i(0, 1), O = nm[0], A1 = nm[1], B1 = nm[2];
  return { s: `sentiasa sama jarak dari garis lurus ${O}${A1} dan ${O}${B1}`, g: (x, y) => (x < ox || y < oy ? 9 : Math.abs((x - ox) - (y - oy))), chk: (x, y) => `jarak dari ${O}${A1} = ${y - oy}, dari ${O}${B1} = ${x - ox}`,
    given: { segs: [seg([ox, oy], [10, oy]), seg([ox, oy], [ox, 8])], pts: [{ x: ox, y: oy, l: O, c: 'tr', dx: 8, dy: -8 }, { x: 10, y: oy, l: A1, c: 'tr', r: 5 }, { x: ox, y: 8, l: B1, c: 'tr', r: 5 }] },
    loc: { segs: [{ a: [ox, oy], b: [ox + 8 - oy, 8], c: 'pk', w: 3.5, dash: true }] }, bad: (x, y) => x === ox || y === oy };
}
LK.titik = (r, tys) => {
  const ty = r.p(tys), cd = lkTitikCond(r, ty);
  for (let t = 0; t < 200; t++) {
    const on = [], off = [];
    for (let x = 0; x <= 10; x++) for (let y = 0; y <= 8; y++) {
      if (cd.bad(x, y)) continue; const g = cd.g(x, y);
      if (g < 1e-9) on.push([x, y]); else if (g < 1.6) off.push([x, y]);
    }
    const nOn = r.i(2, 3), pickSet = [], far = p => pickSet.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) >= 1.9);
    lkShuf(r, on).forEach(p => { if (pickSet.length < nOn && far(p)) pickSet.push(p); });
    const nOnGot = pickSet.length;
    lkShuf(r, off).forEach(p => { if (pickSet.length < 6 && far(p)) pickSet.push(p); });
    if (nOnGot < 2 || pickSet.length < 6) continue;
    const cand = pickSet.sort((a, b) => a[0] - b[0] || b[1] - a[1]).map((p, i) => ({ x: p[0], y: p[1], l: LKCAND[i], on: cd.g(p[0], p[1]) < 1e-9 }));
    const yes = cand.filter(c => c.on).map(c => c.l);
    const fig = lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: 'Titik A hingga F pada grid' }, cd.given, { pts: cand.map(c => ({ x: c.x, y: c.y, l: c.l, c: 'am', r: 5.5 })) }));
    const figAns = lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: 'Lokus dan titik yang terletak padanya' }, cd.loc, cd.given, { pts: cand.map(c => ({ x: c.x, y: c.y, l: c.l, c: c.on ? 'gr' : 'mu', r: 5.5, ring: c.on })) }));
    return GEN_LQ('titik', { s: cd.s, n: yes.length, ans: lkDan(yes), work: cand.map(c => `${c.l}: ${cd.chk(c.x, c.y)} ${c.on ? '✓' : '✗'}`) }, { fig, figAns });
  }
  return LK.titik(r, ['D']);
};
LK.ferris = r => {
  const D = r.p([14, 20, 28, 30, 40, 42, 50, 56, 60]), h0 = r.i(1, 5);
  return GEN_LQ('ferris', { D, h0, ans: `Bulatan berjejari ${D / 2} m; ketinggian maksimum = ${h0 + D} m`, work: [`Jejari = ${D} ÷ 2 = ${D / 2} m`, `Tinggi pusat roda = ${h0} + ${D / 2} = ${h0 + D / 2} m`, `Tinggi maksimum = ${h0} + ${D} = ${h0 + D} m`] });
};
LK.tambat = r => {
  const L = r.i(2, 12);
  return GEN_LQ('tambat', { L, ans: `Bulatan berpusat di tempat tambatan, jejari ${L} m; jarak terjauh = diameter = ${2 * L} m`, work: ['Haiwan itu sentiasa berjarak sama (panjang tali) dari tempat tambatan, jadi lokusnya bulatan.', `Jejari = ${L} m`, `Diameter = 2 × ${L} = ${2 * L} m`] });
};
LK.roda = r => {
  const D = r.p([24, 30, 40, 50, 56, 60, 64, 70]);
  return GEN_LQ('roda', { D, ans: `Garis lurus selari dengan jalan, ${D / 2} cm dari jalan`, work: [`Jejari roda = ${D} ÷ 2 = ${D / 2} cm`, 'Pusat roda sentiasa berada sejauh jejari dari jalan.', `Lokus: garis lurus selari dengan jalan pada ketinggian ${D / 2} cm.`] });
};
LK.k81 = r => {
  const [rr, n] = r.p([[35, 5], [14, 25], [21, 50], [35, 10], [7, 50], [28, 25]]);
  return GEN_LQ('k81', { w: r.p([70, 77, 84, 91, 105]), L: r.p([7, 14, 21, 28]), rr, n, D: r.p([14, 28, 42, 56, 70]), h0: r.i(1, 4) });
};

/* ---------- 8.2 ---------- */
function lkJenisData(r, ty) {
  const nm = lkShuf(r, LKHUR);
  if (ty === 'C') { const a = r.i(2, 9), T = nm[0]; return { s: `sentiasa berjarak ${a} cm dari titik ${T}`, ans: `Bulatan berpusat ${T} dengan jejari ${a} cm`, wrong: `bulatan berpusat ${T} dengan diameter ${a} cm`, why: 'Jarak tetap dari pusat ialah jejari, bukan diameter.', work: [`Semua titik yang berjarak ${a} cm dari ${T} membentuk bulatan.`, `Pusat = ${T}, jejari = ${a} cm`] }; }
  if (ty === 'B') { const [p, q] = nm; return { s: `sentiasa sama jarak dari titik ${p} dan titik ${q}`, ans: `Pembahagi dua sama serenjang bagi garis ${p}${q}`, wrong: `garis lurus ${p}${q}`, why: `Titik pada garis ${p}${q} (kecuali titik tengahnya) tidak sama jarak dari ${p} dan ${q}.`, work: [`Titik yang sama jarak dari ${p} dan ${q} terletak pada garis yang melalui titik tengah ${p}${q} dan berserenjang dengan ${p}${q}.`] }; }
  if (ty === 'D') { const d = r.i(2, 8), [k, l] = nm; return { s: `sentiasa berjarak ${d} cm dari garis lurus ${k}${l}`, ans: `Sepasang garis lurus yang selari dengan ${k}${l} dan berjarak ${d} cm dari ${k}${l}`, wrong: `satu garis lurus yang selari dengan ${k}${l}`, why: `Titik yang memenuhi syarat ada di kedua-dua belah ${k}${l}.`, work: [`Jarak ${d} cm boleh diukur di atas dan di bawah ${k}${l}.`, `Maka lokus ialah dua garis selari, ${d} cm dari ${k}${l}.`] }; }
  if (ty === 'M') { const g = 2 * r.i(2, 6), [e, f, gg, h] = nm; return { s: `sentiasa sama jarak dari dua garis selari ${e}${f} dan ${gg}${h} yang berjarak ${g} cm antara satu sama lain`, ans: `Garis lurus yang selari dengan ${e}${f} dan ${gg}${h}, berjarak ${g / 2} cm dari setiap garis`, wrong: `garis lurus yang selari dengan ${e}${f} dan berjarak ${g} cm daripadanya`, why: `Lokus terletak di tengah-tengah, iaitu ${g} ÷ 2 = ${g / 2} cm dari setiap garis.`, work: [`Lokus terletak di tengah-tengah kedua-dua garis selari.`, `Jarak dari setiap garis = ${g} ÷ 2 = ${g / 2} cm`] }; }
  const [o, a, b] = nm;
  return { s: `sentiasa sama jarak dari garis lurus ${o}${a} dan ${o}${b} yang bersilang di ${o}`, ans: `Pembahagi dua sama sudut ${a}${o}${b}`, wrong: `pembahagi dua sama serenjang bagi garis ${a}${b}`, why: 'Sama jarak dari dua garis yang bersilang menghasilkan pembahagi dua sama sudut.', work: [`Titik yang sama jarak dari ${o}${a} dan ${o}${b} terletak pada garis yang membahagi dua sama sudut ${a}${o}${b}.`] };
}
LK.jenis = (r, k) => { const ty = k == null ? r.p(LKJK) : LKJK[k % 5]; return GEN_LQ('jenis', lkJenisData(r, ty)); };
LK.rajah = (r, k) => {
  const ty = k == null ? r.p(LKJK) : LKJK[k % 5], sh = lkShape(r, ty);
  return GEN_LQ('rajah', { jn: LKJN[ty], sy: sh.s, ans: `X ${sh.s}`, work: [`Lokus dalam rajah: ${sh.lok[0].toLowerCase() + sh.lok.slice(1)}.`, `Maka X ${sh.s}.`] }, { fig: lkShapeFig(sh, true, 'Lokus titik X pada grid') });
};
LK.lukis = (r, k) => {
  const ty = k == null ? r.p(LKJK) : LKJK[k % 5], sh = lkShape(r, ty);
  const tip = { C: 'Gunakan jangka lukis: letak mata di pusat dan lukis bulatan.', B: 'Lukis garis yang melalui titik tengah dan berserenjang dengan garis yang menyambung dua titik itu.', D: 'Lukis garis selari di kedua-dua belah garis, sama jauh.', M: 'Lukis garis selari di tengah-tengah dua garis itu.', A: 'Lukis garis yang membahagi dua sama sudut di antara dua garis itu.' }[ty];
  return GEN_LQ('lukis', { s: sh.s, ans: `${sh.lok} (rujuk rajah jawapan)`, work: [tip] }, { fig: lkShapeFig(sh, false), figAns: lkShapeFig(sh, true, 'Lokus X dilukis'), kind: 'lukis' });
};
LK.silang = r => {
  const pr = lkPair(r);
  return GEN_LQ('silang', { s1: pr.a.s, s2: pr.b.s, ans: lkPtsTxt(pr.X), work: [`Lokus pertama: ${pr.a.lok}.`, `Lokus kedua: ${pr.b.lok}.`].concat(pr.X.map(([x, y]) => `${P(x, y)}: ${pr.a.chk(x, y)}; ${pr.b.chk(x, y)}`)) }, { fig: lkPairFig(pr), figAns: lkPairFig(pr, true) });
};
LK.bilSilang = r => {
  const pr = lkPair(r, { any: true }), n = pr.X.length;
  return GEN_LQ('bilSilang', { s1: pr.a.s, s2: pr.b.s, wn: n === 1 ? 2 : n - 1, ans: `${n} titik`, work: [`Lokus pertama: ${pr.a.lok}.`, `Lokus kedua: ${pr.b.lok}.`, `Kedua-dua lokus bersilang pada ${n} titik di dalam grid.`] }, { fig: lkPairFig(pr), figAns: lkPairFig(pr, true) });
};
LK.bina = (r, k) => {
  const nm = lkShuf(r, LKHUR), [a, b, c] = nm, d = r.i(2, 6);
  const L = [
    { what: `pembahagi dua sama serenjang bagi garis ${a}${b}`, lok: `titik yang sama jarak dari ${a} dan ${b}`, ans: `Lukis lengkok berjejari sama (lebih separuh ${a}${b}) dari ${a} dan dari ${b}; sambungkan dua titik silang lengkok`, work: [`Buka jangka lukis lebih daripada separuh panjang ${a}${b}.`, `Dengan mata di ${a}, lukis lengkok di atas dan di bawah ${a}${b}.`, `Ulang dari ${b} dengan bukaan yang sama.`, 'Sambungkan dua titik persilangan lengkok dengan pembaris.'] },
    { what: `pembahagi dua sama sudut ${a}${b}${c}`, lok: `titik yang sama jarak dari garis ${b}${a} dan ${b}${c}`, ans: `Lukis lengkok dari ${b} memotong ${b}${a} dan ${b}${c}; dari kedua-dua titik potong lukis lengkok sama jejari; sambungkan ${b} dengan titik silang`, work: [`Dengan mata di ${b}, lukis lengkok yang memotong ${b}${a} dan ${b}${c}.`, 'Dari setiap titik potong, lukis lengkok dengan bukaan yang sama sehingga bersilang.', `Sambungkan ${b} dengan titik silang itu.`] },
    { what: `lokus titik yang berjarak ${d} cm dari titik ${a}`, lok: `bulatan berpusat ${a} dengan jejari ${d} cm`, ans: `Buka jangka lukis ${d} cm, letak mata di ${a} dan lukis bulatan penuh`, work: [`Ukur bukaan jangka lukis ${d} cm dengan pembaris.`, `Letak mata jangka lukis di ${a}.`, 'Lukis bulatan penuh.'] },
    { what: `lokus titik yang berjarak ${d} cm dari garis lurus ${a}${b}`, lok: `sepasang garis selari ${d} cm dari ${a}${b}`, ans: `Tandakan dua titik ${d} cm dari ${a}${b} (diukur serenjang) di setiap belah, kemudian lukis dua garis selari dengan ${a}${b}`, work: [`Pada dua kedudukan di sepanjang ${a}${b}, ukur ${d} cm secara serenjang di atas dan di bawah ${a}${b}.`, 'Sambungkan tanda-tanda di sebelah yang sama dengan pembaris.', `Dua garis selari itu ialah lokus.`] }
  ][k == null ? r.i(0, 3) : k % 4];
  return GEN_LQ('bina', L);
};
LK.k82 = r => {
  let x1, x2, y, d; do { x1 = r.i(0, 4); x2 = x1 + 2 * r.i(2, 4); y = r.i(1, 3); d = r.i(2, 6); } while (d === y);
  const L = { x1, x2, y, d, m: (x1 + x2) / 2 };
  const [s, h, rr, kk] = r.p([[8, 4, 5, 3], [6, 3, 5, 4], [12, 6, 10, 8], [16, 8, 10, 6], [10, 5, 13, 12]].filter(v => v[3] < v[0])), cn = r.p(['A', 'B', 'C', 'D']);
  const H = { s, h, r: rr, k: kk, cn, tx: cn === 'A' || cn === 'D' ? kk : s - kk };
  let tx, dx; do { tx = r.i(4, 8); dx = r.p([0, 3, 4, -3, -4]); } while (tx + dx < 3);
  const ty = r.i(5, 8), dy = Math.round(Math.sqrt(25 - dx * dx)), kx = r.i(1, 3), yy = r.i(0, 3);
  const G = { tx, ty, r: 5, m1: [tx + dx - kx, yy], m2: [tx + dx + kx, yy], X: [[tx + dx, ty - dy], [tx + dx, ty + dy]], desc: `garis mencancang melalui ${P(tx + dx, yy)}` };
  const c = r.i(3, 7), dd = r.i(1, c - 1), Q = { c, d: dd, ys: [c - dd, c + dd], X: [[c - dd, c - dd], [c + dd, c + dd]] };
  return GEN_LQ('k82', { L, H, G, Q });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '8.1': {
    m: [() => LK.harian(lkRG), () => LK.harian(lkRG), () => LK.bs(lkRG, LKBS1), () => LK.titik(lkRG, ['D', 'M', 'Bh', 'Cs'])],
    s: [() => LK.titik(lkRG, ['C5', 'Bg', 'A']), () => LK.ferris(lkRG), () => LK.tambat(lkRG), () => LK.roda(lkRG)],
    k: [() => LK.k81(lkRG)]
  },
  '8.2': {
    m: [() => LK.jenis(lkRG), () => LK.rajah(lkRG), () => LK.lukis(lkRG), () => LK.bs(lkRG, LKBS2)],
    s: [() => LK.silang(lkRG), () => LK.silang(lkRG), () => LK.bilSilang(lkRG), () => LK.bina(lkRG)],
    k: [() => LK.k82(lkRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 8.1
WG.harian = i => LK.harian(lkRW, i * 3 + wri(0, 2));
WG.bs1 = i => LK.bs(lkRW, LKBS1, i * 3 + wri(0, 2));
WG.titikM = i => LK.titik(lkRW, [['D', 'M', 'Bh', 'Cs'][i % 4]]);
WG.titikS = i => LK.titik(lkRW, [['C5', 'Bg', 'A'][i % 3]]);
WG.ferris = () => LK.ferris(lkRW);
WG.tambat = () => LK.tambat(lkRW);
WG.roda = () => LK.roda(lkRW);
WG.k81 = () => LK.k81(lkRW);
// 8.2
WG.jenis = i => LK.jenis(lkRW, i);
WG.rajah = i => LK.rajah(lkRW, i + 2);
WG.lukis = i => LK.lukis(lkRW, i * 2);
WG.bs2 = i => LK.bs(lkRW, LKBS2, i * 3 + wri(0, 2));
WG.silang = () => LK.silang(lkRW);
WG.bilSilang = () => LK.bilSilang(lkRW);
WG.bina = i => LK.bina(lkRW, i);
WG.k82 = () => LK.k82(lkRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '8.1': [['m', 'harian', 9], ['m', 'bs1', 3], ['m', 'titikM', 6], ['s', 'titikS', 3], ['s', 'ferris', 2], ['s', 'tambat', 2], ['s', 'roda', 2], ['k', 'k81', 3]],
  '8.2': [['m', 'jenis', 7], ['m', 'rajah', 5], ['m', 'lukis', 3], ['m', 'bs2', 3], ['s', 'silang', 5], ['s', 'bilSilang', 2], ['s', 'bina', 2], ['k', 'k82', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function lkOptsT(ans, cands, pad) {
  const w = []; shuffle(cands).forEach(c => { if (c !== ans && !w.includes(c) && w.length < 3) w.push(c); });
  (pad || []).forEach(c => { if (c !== ans && !w.includes(c) && w.length < 3) w.push(c); });
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
function lkOptsN(ans, cands, f) {
  const A = f(ans), w = [];
  shuffle(cands).forEach(c => { if (c > 0 && Number.isFinite(c)) { const s = f(c); if (s !== A && !w.includes(s) && w.length < 3) w.push(s); } });
  for (let k = 1; w.length < 3 && k < 40; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (v > 0) { const s = f(v); if (s !== A && !w.includes(s)) w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const lkMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const LK3D = [['Titik dalam ruang yang berjarak tetap dari satu titik', 'Permukaan sfera'], ['Titik dalam ruang yang berjarak tetap dari satu garis lurus', 'Permukaan silinder'],
  ['Titik pada satah yang berjarak tetap dari satu titik', 'Bulatan'], ['Titik pada satah yang berjarak tetap dari satu garis lurus', 'Sepasang garis selari']];
// rajah pasangan: hanya objek + lokus (tanpa titik persilangan)
const lkPairLoc = pr => lkFig(lkMerge(pr.a.loc, { circ: (pr.b.loc.circ || []).map(c => Object.assign({}, c, { c: 'pu' })), inf: (pr.b.loc.inf || []).map(l => Object.assign({}, l, { c: 'pu' })) }, { nx: 10, ny: 10, axes: true, u: 30, label: 'Dua lokus pada satah Cartes' }, pr.a.given, pr.b.given));
function lkCoordOpts(pr) {
  const [x, y] = r0(pr.X), key = p => p.join(','), inX = p => pr.X.some(q => key(q) === key(p));
  const near = [[y, x], [x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1], [x + 2, y], [x, y + 2], [x + 1, y + 1], [x - 1, y - 1]].filter(p => p[0] >= 0 && p[1] >= 0 && p[0] <= 10 && p[1] <= 10 && !inX(p));
  return lkOptsT(P(x, y), near.map(p => P(...p)));
  function r0(a) { return a[Math.floor(Math.random() * a.length)]; }
}
const CQGEN = {
  harian: [
    () => { const [sit, tt, cat] = pick(LKHARI); return lkMcq(`Apakah lokus ${tt} apabila ${sit}?`, '', lkOptsT(LKCAT[cat], Object.values(LKCAT))); },
    () => {
      const [sit, tt, cat] = pick(LKHARI); return lkMcq(`Apabila ${sit}, apakah lokus ${tt}?`, '', lkOptsT(LKCAT[cat], Object.values(LKCAT)));
    },
    () => {
      const k = ri(0, 2);
      if (k === 0) { const D = pick([20, 28, 30, 40, 50, 60]), h0 = ri(1, 5); return lkMcq(`Roda Ferris berdiameter ${D} m. Kabin terendah berada ${h0} m dari tanah. Berapakah ketinggian maksimum kabin?`, '', lkOptsN(h0 + D, [h0 + D / 2, D, h0 + 2 * D, D / 2], v => `${v} m`)); }
      if (k === 1) { const D = pick([30, 40, 50, 56, 60, 70]); return lkMcq(`Roda berdiameter ${D} cm bergolek di atas jalan rata. Lokus pusatnya ialah garis selari dengan jalan pada ketinggian…`, '', lkOptsN(D / 2, [D, 2 * D, D / 4], v => `${v} cm`)); }
      const L = ri(3, 12); return lkMcq(`Kambing ditambat pada tiang dengan tali ${L} m (tali tegang). Berapakah diameter lokus kambing itu?`, '', lkOptsN(2 * L, [L, L / 2, 4 * L, L + 2], v => `${v} m`));
    }
  ],
  jenis: [
    () => { const ty = pick(LKJK), d = lkJenisData(lkRG, ty); return lkMcq(`Lokus titik yang ${d.s} ialah…`, '', lkOptsT(LKJN[ty], Object.values(LKJN))); },
    () => { const ty = pick(LKJK), sh = lkShape(lkRG, ty); return lkMcq('Garisan putus-putus ialah lokus titik X. Apakah jenis lokus itu?', lkShapeFig(sh, true, 'Lokus titik X'), lkOptsT(LKJN[ty], Object.values(LKJN))); },
    () => {
      const k = ri(0, 2);
      if (k === 0) { const g = 2 * ri(2, 7); return lkMcq(`Dua garis selari berjarak ${g} cm. Lokus titik yang sama jarak dari kedua-dua garis itu berjarak berapa dari setiap garis?`, '', lkOptsN(g / 2, [g, 2 * g, g / 2 + 1], v => `${v} cm`)); }
      if (k === 1) { const sh = lkShape(lkRG, 'C'), m = sh.s.match(/(\d+) unit/); const rad = +m[1]; return lkMcq('Lokus titik X dalam rajah ialah bulatan. Berapakah jarak tetap X dari pusatnya? (Grid 1 unit)', lkShapeFig(sh, true, 'Bulatan lokus'), lkOptsN(rad, [2 * rad, rad + 1, rad - 1], v => `${v} unit`)); }
      const d = ri(2, 6); return lkMcq(`Berapakah bilangan garis lurus dalam lokus titik yang berjarak ${d} cm dari sebatang garis lurus AB?`, '', lkOptsT('2', ['1', '3', '4']));
    }
  ],
  silang: [
    () => { const pr = lkPair(lkRG, { any: true }); const n = pr.X.length; return lkMcq('Berapakah bilangan titik persilangan dua lokus di dalam grid?', lkPairLoc(pr), lkOptsT(String(n), ['1', '2', '3', '4', '0'])); },
    () => { const pr = lkPair(lkRG); return lkMcq(`X ${pr.a.s} dan X ${pr.b.s}. Yang manakah satu kedudukan X?`, lkPairFig(pr), lkCoordOpts(pr)); },
    () => { const pr = lkPair(lkRG, { types: shuffle(['C', pick(['B', 'D', 'M', 'A'])]) }); return lkMcq(`X ${pr.a.s} dan X ${pr.b.s}. Yang manakah satu kedudukan X?`, lkPairFig(pr), lkCoordOpts(pr)); }
  ]
};
const CQT = { harian: 'Lokus harian', jenis: 'Lima lokus asas', silang: 'Persilangan lokus' };
function lkCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.harian;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['harian', 'harian', 'jenis', 'jenis', 'silang'] : Object.keys(CQT);
  return lkCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return lkCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
