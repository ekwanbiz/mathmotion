'use strict';
/* =================== POLIGON · SOALAN BAB 4 POLIGON (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pg" / "PG" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
const pgJum = n => (n - 2) * 180;                       // hasil tambah sudut pedalaman
const pgPel = n => 360 / n;                             // sudut peluaran poligon sekata
const pgPed = n => 180 - 360 / n;                       // sudut pedalaman poligon sekata
const pgD = v => `${fmt(v)}°`;
const PGNAMA = { 3: 'segi tiga', 4: 'sisi empat', 5: 'pentagon', 6: 'heksagon', 7: 'heptagon', 8: 'oktagon', 9: 'nonagon', 10: 'dekagon' };
const pgNama = n => PGNAMA[n] || `poligon ${n} sisi`;
const pgSek = n => (n === 3 ? 'segi tiga sama sisi' : n === 4 ? 'segi empat sama' : PGNAMA[n] ? `${PGNAMA[n]} sekata` : `poligon sekata ${n} sisi`);
const PGDIV = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];   // 360 ÷ n ialah nombor bulat
// rawak: pgRG untuk Latihan Kelas / games, pgRW (berbenih) untuk Lembaran Kerja
const pgRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const pgRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const pgShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pgDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const pgSum = a => a.reduce((s, v) => s + v, 0);
const PGHUR = ['ABCDEFGH', 'PQRSTUVW', 'KLMNOPQR', 'DEFGHIJK'];
const pgLab = (r, n) => r.p(PGHUR).slice(0, n);

/* =================== data bersama =================== */
const PGBS1 = [
  ['Poligon sekata mempunyai semua sisi yang sama panjang dan semua sudut pedalaman yang sama besar.', true, 'Itulah takrif poligon sekata: kedua-dua syarat mesti dipenuhi.'],
  ['Rombus ialah poligon sekata kerana semua sisinya sama panjang.', false, 'Sudut-sudut rombus tidak semuanya sama besar, jadi rombus bukan poligon sekata.'],
  ['Segi empat tepat ialah poligon sekata kerana semua sudutnya 90°.', false, 'Sisi segi empat tepat tidak semuanya sama panjang, jadi ia bukan poligon sekata.'],
  ['Heksagon sekata mempunyai 6 paksi simetri.', true, 'Poligon sekata n sisi mempunyai n paksi simetri, maka heksagon sekata ada 6 paksi simetri.'],
  ['Segi empat sama mempunyai 2 paksi simetri sahaja.', false, 'Segi empat sama mempunyai 4 paksi simetri: 2 pepenjuru dan 2 garis melalui titik tengah sisi bertentangan.'],
  ['Segi tiga sama sisi ialah poligon sekata.', true, 'Semua sisinya sama panjang dan semua sudutnya 60°.'],
  ['Untuk membina pentagon sekata dalam bulatan, sudut pusat yang diukur ialah 72°.', true, 'Sudut pusat = 360° ÷ 5 = 72°.'],
  ['Heksagon sekata boleh dibina dengan jangka lukis kerana panjang sisinya sama dengan jejari bulatan.', true, 'Setiap ∆OAB ialah segi tiga sama sisi, jadi sisi heksagon = jejari.'],
  ['Pentagon sekata mempunyai 10 paksi simetri.', false, 'Pentagon sekata mempunyai 5 paksi simetri sahaja (n = 5).']
];
const PGBS2 = [
  ['Hasil tambah sudut pedalaman sebuah pentagon ialah 540°.', true, '(5 − 2) × 180° = 540°.'],
  ['Hasil tambah sudut peluaran sebuah heksagon ialah 720°.', false, 'Hasil tambah sudut peluaran bagi semua poligon ialah 360°.'],
  ['Hasil tambah sudut peluaran bagi semua poligon ialah 360°.', true, 'Berjalan mengelilingi poligon, kita berpusing satu pusingan lengkap, iaitu 360°.'],
  ['Pada setiap bucu, sudut pedalaman + sudut peluaran = 180°.', true, 'Kedua-dua sudut terletak pada satu garis lurus.'],
  ['Semakin banyak sisi poligon sekata, semakin besar sudut peluarannya.', false, 'Sudut peluaran = 360° ÷ n, jadi semakin banyak sisi, semakin kecil sudut peluarannya.'],
  ['Sudut pedalaman sebuah oktagon sekata ialah 135°.', true, 'Sudut peluaran = 360° ÷ 8 = 45°, maka sudut pedalaman = 180° − 45° = 135°.'],
  ['Hasil tambah sudut pedalaman sebuah heksagon ialah 6 × 180° = 1080°.', false, 'Rumus yang betul ialah (n − 2) × 180° = 4 × 180° = 720°.'],
  ['Sudut pedalaman sebuah poligon sekata boleh bernilai 180°.', false, 'Sudut peluaran tidak boleh sifar, jadi sudut pedalaman sentiasa kurang daripada 180°.'],
  ['Poligon sekata dengan sudut peluaran 30° mempunyai 12 sisi.', true, 'n = 360° ÷ 30° = 12.']
];

/* =================== rajah =================== */
const pgR1 = v => +v.toFixed(1);
const pgT = (x, y, t, c = 'tx', sz = 16, a = 'middle') => `<text x="${pgR1(x)}" y="${pgR1(y)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pgL = (p, q, c, w = 3, dash) => `<line x1="${pgR1(p[0])}" y1="${pgR1(p[1])}" x2="${pgR1(q[0])}" y2="${pgR1(q[1])}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
const pgPoly = (pts, c, w = 3.5, fo = .16) => `<polygon points="${pts.map(p => pgR1(p[0]) + ',' + pgR1(p[1])).join(' ')}" style="fill:var(--${c});fill-opacity:${fo};stroke:var(--${c})" stroke-width="${w}" stroke-linejoin="round"/>`;
const pgDot = (p, c = 'tx', r = 4.5) => `<circle cx="${pgR1(p[0])}" cy="${pgR1(p[1])}" r="${r}" style="fill:var(--${c})"/>`;
const pgSvg = (s, label, w = 320, h = 260) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
const pgUnit = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
const pgAdd = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
const pgBis = (V, A, B) => { const u = pgUnit(V, A), w = pgUnit(V, B), b = [u[0] + w[0], u[1] + w[1]], L = Math.hypot(b[0], b[1]) || 1; return [b[0] / L, b[1] / L]; };
// lengkok sudut di V antara arah VA dan VB (sudut < 180°)
function pgArc(V, A, B, r, c, w = 2.5, right) {
  const u1 = pgUnit(V, A), u2 = pgUnit(V, B), p1 = pgAdd(V, u1, r), p2 = pgAdd(V, u2, r);
  if (right) { const q = pgAdd(p1, u2, r); return `<path d="M${pgR1(p1[0])} ${pgR1(p1[1])} L${pgR1(q[0])} ${pgR1(q[1])} L${pgR1(p2[0])} ${pgR1(p2[1])}" style="fill:none;stroke:var(--${c})" stroke-width="${w}"/>`; }
  const a1 = Math.atan2(u1[1], u1[0]), a2 = Math.atan2(u2[1], u2[0]);
  let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
  return `<path d="M${pgR1(V[0])} ${pgR1(V[1])} L${pgR1(p1[0])} ${pgR1(p1[1])} A${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${pgR1(p2[0])} ${pgR1(p2[1])} Z" style="fill:var(--${c});fill-opacity:.22;stroke:var(--${c})" stroke-width="${w}"/>`;
}
const pgALab = (V, A, B, t, c, k = 30, sz = 15) => { const b = pgBis(V, A, B); return pgT(V[0] + b[0] * k, V[1] + b[1] * k, t, c, sz); };
const pgTick = (p, q, c = 'tx', n = 1) => {
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = pgUnit(p, q), nv = [-u[1], u[0]]; let s = '';
  for (let i = 0; i < n; i++) { const c0 = pgAdd(m, u, (i - (n - 1) / 2) * 5); s += pgL(pgAdd(c0, nv, -6), pgAdd(c0, nv, 6), c, 2); }
  return s;
};
const pgSideLab = (p, q, t, cen, c = 'mu', k = 15, sz = 14) => {   // label sisi di luar poligon
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], u = pgUnit(p, q); let nv = [-u[1], u[0]];
  if ((m[0] - cen[0]) * nv[0] + (m[1] - cen[1]) * nv[1] < 0) nv = [-nv[0], -nv[1]];
  return pgT(m[0] + nv[0] * k, m[1] + nv[1] * k, t, c, sz);
};
const pgCen = pts => [pgSum(pts.map(p => p[0])) / pts.length, pgSum(pts.map(p => p[1])) / pts.length];
// bucu poligon sekata (skrin, y ke bawah)
const pgReg = (cx, cy, R, n, rot) => { rot = rot == null ? (n % 2 ? -90 : -90 + 180 / n) : rot; return Array.from({ length: n }, (_, i) => { const a = (rot + 360 * i / n) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; }); };
// muatkan titik dalam kotak [L, T, R, B]
function pgFit(pts, box) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), [l, t, r, b] = box;
  const s = Math.min((r - l) / (Math.max(...xs) - Math.min(...xs)), (b - t) / (Math.max(...ys) - Math.min(...ys)));
  const ox = (l + r) / 2 - s * (Math.max(...xs) + Math.min(...xs)) / 2, oy = (t + b) / 2 - s * (Math.max(...ys) + Math.min(...ys)) / 2;
  return pts.map(([x, y]) => [ox + s * x, oy + s * y]);
}
// poligon cembung dengan sudut pedalaman yang diberi (dilukis mengikut skala)
function pgAngPoly(r, angles, box) {
  const n = angles.length, ext = angles.map(a => 180 - a), th = [];
  for (let k = 0; k < n; k++) th.push(pgSum(ext.slice(1, k + 1)) * Math.PI / 180);
  const u = th.map(t => [Math.cos(t), Math.sin(t)]);
  let L = null;
  for (let tr = 0; tr < 600 && !L; tr++) {
    const sp = .25 + Math.min(.45, tr / 600), lo = 1 - sp, hi = 1 + sp;
    const l = Array.from({ length: n - 2 }, () => lo + (hi - lo) * r.f());
    let sx = 0, sy = 0; for (let k = 0; k < n - 2; k++) { sx += l[k] * u[k][0]; sy += l[k] * u[k][1]; }
    const a = u[n - 2][0], b = u[n - 1][0], c = u[n - 2][1], d = u[n - 1][1], det = a * d - b * c;
    if (Math.abs(det) < 1e-9) continue;
    const x = (-sx * d + sy * b) / det, y = (-a * sy + c * sx) / det;
    if (x > .55 && x < 1.7 && y > .55 && y < 1.7) L = l.concat([x, y]);
  }
  if (!L) L = null;
  let pts;
  if (L) { pts = [[0, 0]]; for (let k = 0; k < n - 1; k++) pts.push([pts[k][0] + L[k] * u[k][0], pts[k][1] - L[k] * u[k][1]]); }
  else pts = pgReg(0, 0, 1, n);   // sandaran (tidak sepatutnya berlaku)
  return pgFit(pts, box);
}
// rajah poligon sekata: o = { axes, ticks, center, ang, ext, lab, labs, side }
function pgRegFig(n, o = {}) {
  const C = [160, o.lab ? 120 : 130], R = o.R || (o.lab ? 92 : 100), pts = pgReg(C[0], C[1], R, n); let s = '';
  if (o.axes) {
    for (let i = 0; i < n; i++) {
      let a, b;
      if (n % 2) { const j = (i + (n - 1) / 2) % n, k = (j + 1) % n; a = pts[i]; b = [(pts[j][0] + pts[k][0]) / 2, (pts[j][1] + pts[k][1]) / 2]; }
      else if (i < n / 2) { a = pts[i]; b = pts[i + n / 2]; }
      else { const j = i - n / 2, k = (j + 1) % n, j2 = j + n / 2, k2 = (j2 + 1) % n; a = [(pts[j][0] + pts[k][0]) / 2, (pts[j][1] + pts[k][1]) / 2]; b = [(pts[j2][0] + pts[k2][0]) / 2, (pts[j2][1] + pts[k2][1]) / 2]; }
      const u = pgUnit(a, b); s += pgL(pgAdd(a, u, -12), pgAdd(b, u, 12), 'pu', 2, true);
    }
  }
  if (o.circle) s += `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" style="fill:none;stroke:var(--mu)" stroke-width="2" stroke-dasharray="6 5"/>`;
  if (o.center) { pts.forEach(p => { s += pgL(C, p, 'mu', 1.8); }); s += pgArc(C, pts[0], pts[1], 26, 'am', 2.5) + pgALab(C, pts[0], pts[1], o.center, 'am', 44, 15) + pgDot(C, 'tx', 3.5) + pgT(C[0], C[1] + 15, 'O', 'mu', 13); }
  s += pgPoly(pts, 'tr', 3.5, .14);
  if (o.ticks) for (let i = 0; i < n; i++) s += pgTick(pts[i], pts[(i + 1) % n]);
  if (o.angAll) for (let i = 0; i < n; i++) { const A = pts[(i + n - 1) % n], B = pts[(i + 1) % n]; s += pgArc(pts[i], A, B, n > 6 ? 11 : 14, 'am', 2) + pgALab(pts[i], A, B, o.angAll, 'am', n > 6 ? 27 : 32, n > 6 ? 12 : 14); }
  if (o.ang || o.ext) {
    const i = n % 2 ? Math.floor(n / 2) + 1 : n / 2 + 1, V = pts[i % n], A = pts[(i + n - 1) % n], B = pts[(i + 1) % n];
    if (o.ang) s += pgArc(V, A, B, 18, 'am', 2.5) + pgALab(V, A, B, o.ang, 'am', 36, 15);
    if (o.ext) { const e = pgAdd(V, pgUnit(A, V), 52); s += pgL(V, e, 'mu', 2, true) + pgArc(V, e, B, 21, 'pk', 2.5) + pgALab(V, e, B, o.ext, 'pk', 40, 16); }
  }
  if (o.side) { let bi = 0; pts.forEach((p, i) => { if (p[1] + pts[(i + 1) % n][1] > pts[bi][1] + pts[(bi + 1) % n][1] + .01) bi = i; }); s += pgSideLab(pts[bi], pts[(bi + 1) % n], o.side, C, 'mu', 14, 14); }
  if (o.labs) pts.forEach((p, i) => { const u = pgUnit(C, p); s += pgT(p[0] + u[0] * 15, p[1] + u[1] * 15, o.labs[i], 'tx', 15); });
  if (o.lab) s += pgT(160, 245, o.lab, 'mu', 15);
  return pgSvg(s, o.label || `Poligon sekata ${n} sisi`);
}
// poligon tak sekata dengan label sudut pedalaman (labs[i] = teks atau null)
function pgAngFig(r, angles, labs, o = {}) {
  const n = angles.length, pts = pgAngPoly(r, angles, o.box || [52, 28, 268, 232]); let s = pgPoly(pts, 'tr', 3.5, .12);
  const K = o.k || (n > 5 ? 31 : 33), FS = o.fs || 14;
  pts.forEach((V, i) => {
    const A = pts[(i + n - 1) % n], B = pts[(i + 1) % n], t = labs[i];
    if (o.ticks) s += pgTick(V, B, 'tx', 1);
    if (t == null) return;
    const unk = /[a-z]/.test(t), c = unk ? 'pk' : 'am';
    s += pgArc(V, A, B, 14, c, 2.2, o.right && angles[i] === 90) + pgALab(V, A, B, t, c, K, FS);
  });
  if (o.verts) pts.forEach((p, i) => { const u = pgUnit(pgCen(pts), p); s += pgT(p[0] + u[0] * 14, p[1] + u[1] * 14, o.verts[i], 'tx', 14); });
  if (o.sides) { const cen = pgCen(pts); pts.forEach((p, i) => { if (o.sides[i]) s += pgSideLab(p, pts[(i + 1) % n], o.sides[i], cen, 'mu', 14, 13); }); }
  return pgSvg(s, o.label || `Poligon ${n} sisi`, o.w || 320, o.h || 260);
}
// poligon dengan sudut peluaran (labs[i] untuk sudut peluaran di bucu i)
function pgExtFig(r, exts, labs) {
  const n = exts.length, pts = pgAngPoly(r, exts.map(e => 180 - e), [84, 62, 256, 218]); let s = pgPoly(pts, 'tr', 3.5, .12);
  pts.forEach((V, i) => {
    const A = pts[(i + n - 1) % n], B = pts[(i + 1) % n], e = pgAdd(V, pgUnit(A, V), 46), t = labs[i];
    s += pgL(V, e, 'mu', 2, true);
    if (t == null) return;
    const c = /[a-z]/.test(t) ? 'am' : 'pk';
    s += pgArc(V, e, B, 14, c, 2.2) + pgALab(V, e, B, t, c, 31, 14);
  });
  return pgSvg(s, `Poligon ${n} sisi dengan sudut peluaran`, 340, 280);
}
// satu bucu dengan sudut pedalaman dan peluaran
function pgBucuFig(a, labA, labE) {
  const V = [150, 170], A = [40, 170], t = (180 - a) * Math.PI / 180, B = [V[0] + 120 * Math.cos(t), V[1] - 120 * Math.sin(t)], E = [290, 170];
  let s = `<polygon points="${A.join(',')} ${V.join(',')} ${pgR1(B[0])},${pgR1(B[1])}" style="fill:var(--tr);fill-opacity:.1"/>`;
  s += pgL(A, V, 'tr', 3.5) + pgL(V, B, 'tr', 3.5) + pgL(V, E, 'mu', 2, true);
  s += pgArc(V, A, B, 22, 'am', 2.5) + pgALab(V, A, B, labA, /[a-z]/.test(labA) ? 'pk' : 'am', 46, 16);
  s += pgArc(V, E, B, 20, 'pk', 2.5) + pgALab(V, E, B, labE, /[a-z]/.test(labE) ? 'pk' : 'am', 44, 16);
  s += pgT(80, 205, 'sisi poligon', 'mu', 13) + pgT(240, 192, 'dipanjangkan', 'mu', 13) + pgDot(V);
  return pgSvg(s, 'Sudut pedalaman dan sudut peluaran pada satu bucu', 320, 230);
}
// dua poligon sekata berkongsi sisi AB (n1 di kiri, n2 di kanan)
function pgDuaFig(n1, n2, showX = true) {
  const side = 64, A = [160, 72], Bv = [160, 72 + side];
  const build = (n, sg) => { const pts = [A, Bv]; let d = [0, 1]; for (let k = 0; k < n - 2; k++) { const a = Math.atan2(d[1], d[0]) + sg * 2 * Math.PI / n; d = [Math.cos(a), Math.sin(a)]; pts.push(pgAdd(pts[pts.length - 1], d, side)); } return pts; };
  const p1 = build(n1, -1), p2 = build(n2, 1);
  const all = pgFit(p1.concat(p2), [24, 20, 296, 232]), q1 = all.slice(0, n1), q2 = all.slice(n1);
  let s = pgPoly(q1, 'pu', 3.5, .16) + pgPoly(q2, 'gr', 3.5, .16);
  const B = q1[1];
  s += pgArc(B, q1[0], q1[2], 14, 'am', 2) + pgArc(B, q2[0], q2[2], 14, 'am', 2);
  if (showX) s += pgArc(B, q1[2], q2[2], 18, 'pk', 2.5) + pgALab(B, q1[2], q2[2], '<tspan font-style="italic">x</tspan>', 'pk', 34, 17);
  s += pgDot(q1[0]) + pgDot(B) + pgT(q1[0][0], q1[0][1] - 13, 'A', 'tx', 15) + pgT(B[0] + 12, B[1] - 12, 'B', 'tx', 15, 'start');
  return pgSvg(s, `Poligon sekata ${n1} sisi dan ${n2} sisi berkongsi sisi AB`);
}
// bulatan dengan sudut pusat (pembinaan)
function pgPusatFig(n, lab, full) {
  const C = [160, 128], R = 98, pts = pgReg(C[0], C[1], R, n, -90); let s = `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" style="fill:none;stroke:var(--mu)" stroke-width="2" stroke-dasharray="6 5"/>`;
  (full ? pts : pts.slice(0, 2)).forEach(p => { s += pgL(C, p, 'mu', 1.8); });
  s += pgArc(C, pts[0], pts[1], 26, 'am', 2.5) + pgALab(C, pts[0], pts[1], lab, 'am', 44, 15);
  if (full) s += pgPoly(pts, 'tr', 3.5, .14);
  (full ? pts : pts.slice(0, 2)).forEach(p => { s += pgDot(p, 'tr'); });
  s += pgDot(C, 'tx', 3.5) + pgT(C[0], C[1] + 15, 'O', 'mu', 13);
  return pgSvg(s, 'Sudut pusat dalam bulatan');
}
// pembinaan heksagon / segi tiga dengan jangka lukis (jawapan)
function pgJangkaFig(tri, j) {
  const C = [160, 125], R = 96, pts = pgReg(C[0], C[1], R, 6, 180); let s = `<circle cx="${C[0]}" cy="${C[1]}" r="${R}" style="fill:none;stroke:var(--mu)" stroke-width="2" stroke-dasharray="6 5"/>`;
  pts.forEach((p, i) => { const nx = pts[(i + 1) % 6], a = Math.atan2(nx[1] - p[1], nx[0] - p[0]); const p1 = [p[0] + R * Math.cos(a - .17), p[1] + R * Math.sin(a - .17)], p2 = [p[0] + R * Math.cos(a + .17), p[1] + R * Math.sin(a + .17)]; s += `<path d="M${pgR1(p1[0])} ${pgR1(p1[1])} A${R} ${R} 0 0 1 ${pgR1(p2[0])} ${pgR1(p2[1])}" style="fill:none;stroke:var(--pk)" stroke-width="2"/>`; });
  s += tri ? pgPoly([pts[0], pts[2], pts[4]], 'tr', 3.5, .14) + pgPoly(pts, 'mu', 1.5, 0) : pgPoly(pts, 'tr', 3.5, .14);
  pts.forEach((p, i) => { const u = pgUnit(C, p); s += pgDot(p, 'tr') + pgT(p[0] + u[0] * 15, p[1] + u[1] * 15, 'ABCDEF'[i], 'tx', 14); });
  s += pgL(C, pts[0], 'am', 2.2) + pgT((C[0] + pts[0][0]) / 2, C[1] - 11, `${j} cm`, 'am', 13) + pgDot(C, 'tx', 3.5);
  return pgSvg(s, tri ? 'Pembinaan segi tiga sama sisi dengan jangka lukis' : 'Pembinaan heksagon sekata dengan jangka lukis');
}

// kad formula ringkas (games) – tidak mendedahkan jawapan
function pgTxtFig(lines, label) {
  let s = '<rect x="20" y="40" width="280" height="180" rx="22" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>';
  lines.forEach((t, i) => { s += pgT(160, 130 + (i - (lines.length - 1) / 2) * 40, t, i ? 'mu' : 'am', i ? 17 : 22); });
  return pgSvg(s, label || 'Rumus');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 4.1 Poligon Sekata ---------- */
  nama: [
    ({ n }) => ({ q: `Namakan poligon yang mempunyai ${n} sisi.` }),
    ({ n }) => ({ q: `Sebuah poligon mempunyai ${n} bucu. Apakah nama poligon itu?` }),
    ({ n }) => ({ q: `Lengkapkan: Poligon dengan ${n} sisi dinamakan ___.` }),
    ({ n, ans, wrongN }) => { const N = vnama(); return Object.assign({ q: `${N} berkata poligon dengan ${n} sisi ialah ${PGNAMA[wrongN]}. Adakah ${N} betul?` }, salah(N, ans, `${vcap(PGNAMA[wrongN])} mempunyai ${wrongN} sisi.`)); }
  ],
  namaSisi: [
    ({ nm }) => ({ q: `Berapakah bilangan sisi sebuah ${nm}?` }),
    ({ nm }) => ({ q: `Nyatakan bilangan bucu bagi sebuah ${nm}.` }),
    ({ nm }) => ({ q: `Sebuah papan tanda berbentuk ${nm}. Berapakah bilangan sisi papan tanda itu?` })
  ],
  namaRajah: [
    () => ({ q: 'Namakan poligon dalam rajah di bawah.' }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah poligon. Kira bilangan sisinya, kemudian namakan poligon itu.' }),
    () => ({ q: 'Sekeping jubin berbentuk seperti rajah di bawah. Apakah nama poligon itu?' })
  ],
  paksi: [
    ({ sek }) => ({ q: `Berapakah bilangan paksi simetri bagi sebuah ${sek}?` }),
    ({ sek }) => ({ q: `Rajah di bawah menunjukkan sebuah ${sek}. Nyatakan bilangan paksi simetrinya.` }),
    ({ sek }) => ({ q: `Sebuah jam dinding berbentuk ${sek}. Berapakah bilangan paksi simetri jam itu?` }),
    ({ sek, ans, n }) => { const N = vnama(), w = n % 2 ? n + 1 : n / 2; return Object.assign({ q: `${N} berkata sebuah ${sek} mempunyai ${w} paksi simetri. Adakah ${N} betul?` }, salah(N, ans, `Poligon sekata dengan n sisi mempunyai n paksi simetri.`)); }
  ],
  paksiNama: [
    ({ n }) => ({ q: `Sebuah poligon sekata mempunyai ${n} paksi simetri. Namakan poligon itu.` }),
    ({ n }) => ({ q: `Sebuah poligon sekata mempunyai ${n} paksi simetri. Berapakah bilangan sisinya? Namakan poligon itu.` }),
    ({ n }) => ({ q: `Lengkapkan: Poligon sekata yang mempunyai ${n} paksi simetri ialah ___.` })
  ],
  kenal: [
    () => ({ q: 'Adakah poligon dalam rajah di bawah sebuah poligon sekata? Beri sebab.' }),
    () => ({ q: 'Nyatakan sama ada poligon dalam rajah di bawah ialah poligon sekata atau bukan. Terangkan jawapan anda.' }),
    () => ({ q: 'Berdasarkan ukuran sisi dan sudut dalam rajah di bawah, tentukan sama ada poligon itu sekata.' }),
    ({ ok, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata poligon dalam rajah di bawah ${ok ? 'bukan' : 'ialah'} poligon sekata. Adakah ${N} betul?` }, salah(N, ans, 'Poligon sekata mesti mempunyai semua sisi sama panjang dan semua sudut sama besar.')); }
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  pusat: [
    ({ sek }) => ({ q: `Sebuah ${sek} hendak dibina dalam sebuah bulatan menggunakan protraktor. Berapakah sudut pusat yang perlu diukur?` }),
    ({ sek }) => ({ q: `Hitung sudut pusat yang digunakan untuk membina sebuah ${sek} dalam bulatan.` }),
    ({ sek, n }) => ({ q: `Lengkapkan: Sudut pusat untuk membina ${sek} = 360° ÷ ${n} = ___` }),
    ({ sek, n, ans }) => { const N = vnama(); return Object.assign({ q: `Untuk membina sebuah ${sek} dalam bulatan, ${N} mengukur sudut pusat ${pgD(pgPed(n))}. Adakah ${N} betul?` }, salah(N, ans, `${N} menggunakan sudut pedalaman. Sudut pusat = 360° ÷ ${n}.`)); }
  ],
  pusatN: [
    ({ a }) => ({ q: `Sebuah poligon sekata dibina dalam bulatan dengan sudut pusat ${pgD(a)}. Berapakah bilangan sisi poligon itu?` }),
    ({ a }) => ({ q: `Rajah di bawah menunjukkan satu sudut pusat, ${pgD(a)}, yang digunakan untuk membina sebuah poligon sekata. Berapakah bilangan sisi poligon itu?` }),
    ({ a }) => ({ q: `Sudut pusat sebuah poligon sekata ialah ${pgD(a)}. Tentukan bilangan sisi poligon sekata itu.` })
  ],
  binaPro: [
    ({ sek, j }) => ({ q: `Dengan menggunakan protraktor dan pembaris, bina sebuah ${sek} dalam bulatan berjejari ${j} cm.` }),
    ({ sek, j }) => ({ q: `Bina sebuah ${sek} di dalam bulatan berjejari ${j} cm. Tunjukkan sudut pusat yang digunakan.` }),
    ({ sek, j, a }) => ({ q: `Lukis bulatan berjejari ${j} cm. Dengan mengukur sudut pusat ${pgD(a)} berturut-turut, bina sebuah ${sek}.` })
  ],
  binaJangka: [
    ({ j }) => ({ q: `Dengan menggunakan jangka lukis dan pembaris sahaja, bina sebuah heksagon sekata bersisi ${j} cm.` }),
    ({ j }) => ({ q: `Bina sebuah heksagon sekata dalam bulatan berjejari ${j} cm menggunakan jangka lukis. Terangkan mengapa kaedah ini berfungsi.` }),
    ({ j }) => ({ q: `Dengan menggunakan jangka lukis, bina sebuah segi tiga sama sisi dalam bulatan berjejari ${j} cm.`, ans: `Segi tiga sama sisi ACE`, work: [`Lukis bulatan berjejari ${j} cm.`, `Dengan bukaan jangka lukis ${j} cm, tandakan 6 titik A hingga F di sekeliling bulatan.`, 'Sambungkan titik berselang A, C dan E.', 'Sudut pusat ∠AOC = 2 × 60° = 120° = 360° ÷ 3.'], rev: true })
  ],
  perimeter: [
    ({ sek, a }) => ({ q: `Panjang sisi sebuah ${sek} ialah ${a} cm. Hitung perimeternya.` }),
    ({ sek, p }) => ({ q: `Perimeter sebuah ${sek} ialah ${p} cm. Cari panjang setiap sisinya.` }),
    ({ a, p }) => ({ q: `Sebuah poligon sekata mempunyai perimeter ${p} cm dan panjang sisi ${a} cm. Namakan poligon itu.` }),
    ({ sek, p }) => ({ q: `Seutas dawai sepanjang ${p} cm dibengkokkan untuk membentuk sebuah ${sek}. Berapakah panjang setiap sisi?` })
  ],
  k41: [
    ({ h }) => ({ q: `Sebuah heksagon sekata ABCDEF dibina dalam bulatan berpusat O dan berjejari ${h.j} cm. (a) Hitung ∠AOB. (b) Apakah jenis segi tiga OAB? Beri sebab. (c) Hitung perimeter heksagon itu.`, ans: `(a) 60° (b) Segi tiga sama sisi (c) ${6 * h.j} cm`, work: ['(a) ∠AOB = 360° ÷ 6 = 60°', '(b) OA = OB (jejari), maka ∠OAB = ∠OBA = (180° − 60°) ÷ 2 = 60°. Semua sudut 60°, jadi ∆OAB sama sisi.', `(c) AB = OA = ${h.j} cm, perimeter = 6 × ${h.j} = ${6 * h.j} cm`] }),
    ({ s }) => ({ q: `Sebuah poligon sekata mempunyai ${s.n} paksi simetri dan perimeter ${s.p} cm. (a) Namakan poligon itu. (b) Cari panjang sisinya. (c) Berapakah sudut pusat yang perlu diukur untuk membinanya dalam bulatan?`, ans: `(a) ${vcap(pgSek(s.n))} (b) ${s.a} cm (c) ${pgD(360 / s.n)}`, work: [`(a) ${s.n} paksi simetri → ${s.n} sisi → ${pgSek(s.n)}`, `(b) Panjang sisi = ${s.p} ÷ ${s.n} = ${s.a} cm`, `(c) Sudut pusat = 360° ÷ ${s.n} = ${pgD(360 / s.n)}`] }),
    ({ t }) => ({ q: `Sebuah ${pgSek(t.n)} dibina dalam bulatan berpusat O. A dan B ialah dua bucu bersebelahan. (a) Hitung ∠AOB. (b) Hitung ∠OAB. (c) Seterusnya, tentukan sudut pedalaman poligon itu.`, ans: `(a) ${pgD(t.c)} (b) ${pgD(t.b)} (c) ${pgD(2 * t.b)}`, work: [`(a) ∠AOB = 360° ÷ ${t.n} = ${pgD(t.c)}`, `(b) OA = OB (jejari), jadi ∆OAB sama kaki: ∠OAB = (180° − ${pgD(t.c)}) ÷ 2 = ${pgD(t.b)}`, `(c) OA membahagi dua sama sudut pedalaman di A, maka sudut pedalaman = 2 × ${pgD(t.b)} = ${pgD(2 * t.b)}`] })
  ],

  /* ---------- 4.2 Sudut Pedalaman & Peluaran ---------- */
  jumlah: [
    ({ nm }) => ({ q: `Hitung hasil tambah sudut pedalaman sebuah ${nm}.` }),
    ({ n }) => ({ q: `Sebuah poligon mempunyai ${n} sisi. Cari hasil tambah sudut pedalamannya.` }),
    ({ n }) => ({ q: `Lengkapkan: Hasil tambah sudut pedalaman poligon ${n} sisi = (${n} − 2) × 180° = ___` }),
    ({ nm, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hasil tambah sudut pedalaman sebuah ${nm} ialah ${n} × 180° = ${pgD(n * 180)}. Adakah ${N} betul?` }, salah(N, ans, `Rumus yang betul ialah (n − 2) × 180°.`)); }
  ],
  segiTiga: [
    ({ nm }) => ({ q: `Pepenjuru dilukis dari satu bucu sebuah ${nm}. (a) Berapakah bilangan segi tiga yang terbentuk? (b) Seterusnya, cari hasil tambah sudut pedalaman ${nm} itu.` }),
    ({ nm }) => ({ q: `Rajah di bawah menunjukkan sebuah ${nm} yang dibahagikan kepada beberapa segi tiga dari satu bucu. Nyatakan bilangan segi tiga dan hasil tambah sudut pedalamannya.` }),
    ({ n }) => ({ q: `Sebuah poligon ${n} sisi dibahagikan kepada segi tiga dengan melukis pepenjuru dari satu bucu. Berapakah bilangan segi tiga yang terbentuk dan hasil tambah sudut pedalamannya?` })
  ],
  ped: [
    ({ sek }) => ({ q: `Hitung saiz setiap sudut pedalaman sebuah ${sek}.` }),
    ({ n }) => ({ q: `Sebuah poligon sekata mempunyai ${n} sisi. Cari sudut pedalamannya.` }),
    ({ sek }) => ({ q: `Sekeping jubin berbentuk ${sek}. Berapakah saiz setiap sudut pedalaman jubin itu?` }),
    ({ sek, n }) => ({ q: `Lengkapkan: Sudut pedalaman ${sek} = (${n} − 2) × 180° ÷ ${n} = ___` })
  ],
  pel: [
    ({ sek }) => ({ q: `Hitung saiz setiap sudut peluaran sebuah ${sek}.` }),
    ({ n }) => ({ q: `Sebuah poligon sekata mempunyai ${n} sisi. Cari sudut peluarannya.` }),
    ({ sek, n }) => ({ q: `Lengkapkan: Sudut peluaran ${sek} = 360° ÷ ${n} = ___` }),
    ({ sek, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sudut peluaran sebuah ${sek} ialah ${pgD(pgPed(n))}. Adakah ${N} betul?` }, salah(N, ans, `${pgD(pgPed(n))} ialah sudut pedalaman. Sudut peluaran = 360° ÷ ${n}.`)); }
  ],
  pedPel: [
    ({ giv, v }) => ({ q: `Sudut ${giv} pada satu bucu sebuah poligon ialah ${pgD(v)}. Cari sudut ${giv === 'pedalaman' ? 'peluaran' : 'pedalaman'} pada bucu yang sama.` }),
    ({ giv }) => ({ q: `Rajah di bawah menunjukkan satu bucu sebuah poligon dengan sisinya dipanjangkan. Cari nilai ${giv === 'pedalaman' ? 'y' : 'x'}.` }),
    ({ giv, v }) => ({ q: `Lengkapkan: Sudut pedalaman + sudut peluaran = 180°, maka jika sudut ${giv} = ${pgD(v)}, sudut ${giv === 'pedalaman' ? 'peluaran' : 'pedalaman'} = ___` })
  ],
  cariPed: [
    ({ nm }) => ({ q: `Rajah di bawah menunjukkan sebuah ${nm}. Cari nilai x.` }),
    ({ nm, giv }) => ({ q: `Sudut-sudut pedalaman sebuah ${nm} ialah ${pgDan(giv.map(pgD).concat(['x']))}. Hitung nilai x.` }),
    ({ L, nm }) => ({ q: `Dalam rajah di bawah, ${L} ialah sebuah ${nm}. Hitung nilai x.` }),
    ({ nm, n, s, ans }) => { const N = vnama(); return Object.assign({ q: `Bagi ${nm} dalam rajah di bawah, ${N} mendapati x = ${pgD(n * 180 - s)}. Adakah ${N} betul?` }, salah(N, ans, `${N} menggunakan ${n} × 180°. Hasil tambah sudut pedalaman ${nm} = (${n} − 2) × 180° = ${pgD(pgJum(n))}.`)); }
  ],
  cariPel: [
    ({ nm }) => ({ q: `Rajah di bawah menunjukkan sudut-sudut peluaran sebuah ${nm}. Cari nilai y.` }),
    ({ nm, giv }) => ({ q: `Sudut-sudut peluaran sebuah ${nm} ialah ${pgDan(giv.map(pgD).concat(['y']))}. Hitung nilai y.` }),
    ({ nm }) => ({ q: `Semua sisi sebuah ${nm} dipanjangkan seperti dalam rajah di bawah. Hitung nilai y.` }),
    ({ nm, n, s, ans }) => { const N = vnama(); return Object.assign({ q: `Bagi ${nm} dalam rajah di bawah, ${N} mendapati y = ${pgD(pgJum(n) - s)}. Adakah ${N} betul?` }, salah(N, ans, `${N} menggunakan hasil tambah sudut pedalaman. Hasil tambah sudut peluaran mana-mana poligon = 360°.`)); }
  ],
  nPel: [
    ({ e }) => ({ q: `Sudut peluaran sebuah poligon sekata ialah ${pgD(e)}. Berapakah bilangan sisi poligon itu?` }),
    ({ e }) => ({ q: `Setiap sudut peluaran sebuah poligon sekata ialah ${pgD(e)}. Cari bilangan sisinya.` }),
    ({ e }) => ({ q: `Lengkapkan: n = 360° ÷ ${pgD(e)} = ___` })
  ],
  nPed: [
    ({ a }) => ({ q: `Sudut pedalaman sebuah poligon sekata ialah ${pgD(a)}. Berapakah bilangan sisi poligon itu?` }),
    ({ a }) => ({ q: `Setiap sudut pedalaman sebuah poligon sekata ialah ${pgD(a)}. Cari bilangan sisinya.` }),
    ({ a, ans }) => { const N = vnama(); return Object.assign({ q: `Sudut pedalaman sebuah poligon sekata ialah ${pgD(a)}. ${N} mengira bilangan sisinya sebagai 360° ÷ ${pgD(a)}. Adakah kaedah ${N} betul? Cari bilangan sisi yang betul.` }, salah(N, ans, `${N} membahagi 360° dengan sudut pedalaman. Cari sudut peluaran dahulu: 180° − ${pgD(a)} = ${pgD(180 - a)}.`)); }
  ],
  nJum: [
    ({ S }) => ({ q: `Hasil tambah sudut pedalaman sebuah poligon ialah ${pgD(S)}. Berapakah bilangan sisi poligon itu?` }),
    ({ S }) => ({ q: `Sebuah poligon mempunyai hasil tambah sudut pedalaman ${pgD(S)}. Cari bilangan sisinya.` }),
    ({ S }) => ({ q: `Lengkapkan: (n − 2) × 180° = ${pgD(S)}, maka n = ___` })
  ],
  k42: [
    ({ rt }) => ({ q: `Nisbah sudut pedalaman kepada sudut peluaran sebuah poligon sekata ialah ${rt.p} : ${rt.q}. (a) Hitung sudut peluaran poligon itu. (b) Berapakah bilangan sisinya?`, ans: `(a) ${pgD(rt.e)} (b) ${rt.n}`, work: [`Sudut pedalaman + sudut peluaran = 180°, dibahagi dalam nisbah ${rt.p} : ${rt.q}.`, `(a) Sudut peluaran = ${fr(rt.q, rt.p + rt.q)} × 180° = ${pgD(rt.e)}`, `(b) n = 360° ÷ ${pgD(rt.e)} = ${rt.n}`] }),
    ({ ex }) => ({ q: `Sudut-sudut pedalaman sebuah ${ex.nm} ialah ${pgDan(ex.labs)}. (a) Cari nilai x. (b) Hitung sudut pedalaman yang paling besar.`, ans: `(a) x = ${ex.x} (b) ${pgD(ex.big)}`, work: [`Hasil tambah sudut pedalaman ${ex.nm} = (${ex.n} − 2) × 180° = ${pgD(ex.S)}`, `${ex.lhs} = ${ex.S}`, `${ex.cx}x + ${ex.K} = ${ex.S} → ${ex.cx}x = ${ex.S - ex.K}`, `x = ${ex.S - ex.K} ÷ ${ex.cx} = ${ex.x}`, `Sudut paling besar = ${ex.bigW}`] }),
    ({ du }) => ({ q: `Rajah di bawah menunjukkan sebuah ${pgSek(du.n1)} dan sebuah ${pgSek(du.n2)} yang berkongsi sisi AB. Hitung nilai x.`, ans: `x = ${pgD(du.x)}`, work: [`Sudut pedalaman ${pgSek(du.n1)} = ${pgD(pgPed(du.n1))}`, `Sudut pedalaman ${pgSek(du.n2)} = ${pgD(pgPed(du.n2))}`, `Sudut pada titik B: x = 360° − ${pgD(pgPed(du.n1))} − ${pgD(pgPed(du.n2))} = ${pgD(du.x)}`] }),
    ({ al }) => ({ q: `Sudut peluaran sebuah poligon sekata ialah (x + ${al.a})° dan sudut pedalamannya ialah (${al.b}x ${al.c < 0 ? '−' : '+'} ${Math.abs(al.c)})°. (a) Cari nilai x. (b) Berapakah bilangan sisi poligon itu?`, ans: `(a) x = ${al.x} (b) ${al.n}`, work: [`Sudut pedalaman + sudut peluaran = 180°`, `(x + ${al.a}) + (${al.b}x ${al.c < 0 ? '−' : '+'} ${Math.abs(al.c)}) = 180`, `${al.b + 1}x + ${al.a + al.c} = 180 → x = ${al.x}`, `Sudut peluaran = ${al.x} + ${al.a} = ${pgD(al.e)}`, `(b) n = 360° ÷ ${pgD(al.e)} = ${al.n}`] })
  ]
};

/* =================== pembina soalan (r = pgRG atau pgRW) =================== */
const PG = {};
/* ---------- 4.1 ---------- */
PG.nama = (r, k) => {
  const n = r.i(3, 10), mode = k == null ? r.i(0, 2) : k % 3;
  if (mode === 0) { let wrongN; do wrongN = n + r.p([-1, 1, 2, -2]); while (!PGNAMA[wrongN] || wrongN === n); return GEN_LQ('nama', { n, wrongN, ans: vcap(PGNAMA[n]), work: [`Poligon dengan ${n} sisi dinamakan ${PGNAMA[n]}.`] }); }
  if (mode === 1) return GEN_LQ('namaSisi', { nm: PGNAMA[n], ans: `${n}`, work: [`${vcap(PGNAMA[n])} mempunyai ${n} sisi dan ${n} bucu.`] }, { fig: '' });
  const ang = pgRandAng(r, n);
  return GEN_LQ('namaRajah', { ans: vcap(PGNAMA[n]), work: [`Poligon itu mempunyai ${n} sisi, maka ia ialah ${PGNAMA[n]}.`] }, { fig: pgAngFig(r, ang, ang.map(() => null), { label: `Poligon ${n} sisi` }) });
};
PG.paksi = r => {
  const n = r.p([3, 4, 5, 6, 7, 8, 9, 10, 12]), sek = pgSek(n);
  return GEN_LQ('paksi', { n, sek, ans: `${n} paksi simetri`, work: [`${vcap(sek)} mempunyai ${n} sisi.`, `Poligon sekata dengan n sisi mempunyai n paksi simetri, maka ${n} paksi simetri.`] }, { fig: pgRegFig(n, { ticks: true }), figAns: pgRegFig(n, { ticks: true, axes: true }) });
};
PG.paksiNama = r => {
  const n = r.i(3, 10);
  return GEN_LQ('paksiNama', { n, ans: vcap(pgSek(n)), work: [`Poligon sekata n sisi mempunyai n paksi simetri.`, `${n} paksi simetri → ${n} sisi → ${pgSek(n)}.`] }, { figAns: pgRegFig(n, { axes: true }) });
};
// sudut rawak (gandaan 5) bagi poligon cembung n sisi
function pgRandAng(r, n, lo = 70, hi = 165) {
  const S = pgJum(n), avg = S / n; let a;
  lo = Math.min(lo, avg - 25); hi = Math.max(hi, avg + 25);
  do {
    a = Array.from({ length: n - 1 }, () => 5 * r.i(Math.ceil(Math.max(lo, avg - 35) / 5), Math.floor(Math.min(hi, avg + 35) / 5)));
    a.push(S - pgSum(a));
  } while (a[n - 1] < lo || a[n - 1] > hi || a[n - 1] % 5 || new Set(a).size < Math.min(n, 3));
  return a;
}
PG.kenal = (r, k) => {
  const K = ['reg', 'rombus', 'reg', 'tepat', 'reg', 'tak', 'kaki', 'reg'], kind = k == null ? r.p(K) : K[k % K.length];
  let fig, ok = false, ans, work;
  if (kind === 'reg') {
    const n = r.p([3, 4, 5, 6, 8]), a = r.i(3, 9); ok = true;
    fig = pgRegFig(n, { ticks: true, angAll: pgD(pgPed(n)), side: `${a} cm`, label: `${vcap(pgNama(n))} dengan sisi dan sudut ditanda` });
    ans = `Ya, ia poligon sekata (${pgSek(n)})`; work = [`Semua ${n} sisi sama panjang (${a} cm).`, `Semua sudut pedalaman sama besar (${pgD(pgPed(n))}).`, 'Kedua-dua syarat dipenuhi, maka ia poligon sekata.'];
  } else if (kind === 'rombus') {
    const t = r.p([50, 60, 70, 75]), a = r.i(3, 8), angs = [t, 180 - t, t, 180 - t];
    fig = pgAngFig(r, angs, angs.map(pgD), { ticks: true, sides: [`${a} cm`, null, null, null], label: 'Rombus' });
    ans = 'Bukan poligon sekata'; work = [`Semua sisi sama panjang (${a} cm), tetapi sudutnya ${pgD(t)} dan ${pgD(180 - t)}, tidak sama besar.`, 'Poligon sekata mesti mempunyai semua sudut sama besar.'];
  } else if (kind === 'tepat') {
    let p, q; do { p = r.i(4, 9); q = r.i(2, 6); } while (p <= q);
    const pts = [[60, 70], [260, 70], [260, 70 + 200 * q / p], [60, 70 + 200 * q / p]], cen = pgCen(pts); let s = pgPoly(pts, 'tr', 3.5, .12);
    pts.forEach((V, i) => { s += pgArc(V, pts[(i + 3) % 4], pts[(i + 1) % 4], 13, 'am', 2.2, true); });
    s += pgSideLab(pts[0], pts[1], `${p} cm`, cen) + pgSideLab(pts[1], pts[2], `${q} cm`, cen, 'mu', 22);
    fig = pgSvg(s, 'Segi empat tepat');
    ans = 'Bukan poligon sekata'; work = ['Semua sudut sama besar (90°), tetapi sisinya tidak sama panjang.', `${p} cm ≠ ${q} cm, jadi ia bukan poligon sekata.`];
  } else if (kind === 'kaki') {
    const b = r.p([40, 50, 80, 30]), t = (180 - b) / 2, angs = [b, t, t];
    fig = pgAngFig(r, angs, angs.map(pgD), { label: 'Segi tiga sama kaki' });
    ans = 'Bukan poligon sekata'; work = [`Sudutnya ${pgD(b)}, ${pgD(t)} dan ${pgD(t)}: tidak semua sama besar.`, 'Poligon sekata mesti mempunyai semua sisi sama panjang dan semua sudut sama besar.'];
  } else {
    const n = r.p([5, 6]), angs = pgRandAng(r, n, 85, 160);
    fig = pgAngFig(r, angs, angs.map(pgD), { label: `${vcap(pgNama(n))} tak sekata` });
    ans = 'Bukan poligon sekata'; work = [`Sudut-sudutnya (${angs.map(pgD).join(', ')}) tidak sama besar.`, `Sudut pedalaman ${pgSek(n)} sepatutnya ${pgD(pgPed(n))} setiap satu.`];
  }
  return GEN_LQ('kenal', { ok, ans, work }, { fig });
};
PG.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
PG.pusat = r => {
  const n = r.p([3, 4, 5, 6, 8, 9, 10, 12, 15, 18]), sek = pgSek(n), a = 360 / n;
  return GEN_LQ('pusat', { n, sek, ans: pgD(a), work: [`Sudut pusat = 360° ÷ bilangan sisi`, `= 360° ÷ ${n} = ${pgD(a)}`] }, { figAns: pgPusatFig(n, pgD(a), n <= 12) });
};
PG.pusatN = r => {
  const n = r.p([5, 6, 8, 9, 10, 12, 15, 18, 20]), a = 360 / n;
  return GEN_LQ('pusatN', { a, ans: PGNAMA[n] ? `${n} sisi (${pgSek(n)})` : `${n} sisi`, work: [`Bilangan sisi = 360° ÷ sudut pusat`, `= 360° ÷ ${pgD(a)} = ${n}`] }, { fig: pgPusatFig(n, pgD(a), false) });
};
PG.bina = (r, k) => {
  const jang = k == null ? r.f() < .3 : k % 3 === 2, j = r.i(3, 6);
  if (jang) {
    const qj = GEN_LQ('binaJangka', { j, ans: `Heksagon sekata bersisi ${j} cm`, work: [`Lukis bulatan berjejari ${j} cm dan tandakan titik A.`, `Tanpa mengubah bukaan jangka lukis (${j} cm), buat lengkok dari A untuk mendapat B, kemudian dari B untuk C, dan seterusnya hingga F.`, 'Sambungkan A, B, C, D, E dan F.', `Sebab: OA = OB = AB = ${j} cm, jadi ∆OAB sama sisi dan ∠AOB = 60°; 6 × 60° = 360°.`] });
    return Object.assign(qj, { kind: 'lukis', figAns: pgJangkaFig(/segi tiga sama sisi/.test(qj.q), j) });
  }
  const n = r.p([5, 6, 8, 9, 10, 12]), a = 360 / n, sek = pgSek(n);
  const q = GEN_LQ('binaPro', { j, a, sek, ans: `${vcap(sek)} dalam bulatan berjejari ${j} cm`, work: [`Lukis bulatan berpusat O dengan jejari ${j} cm dan lukis jejari OA.`, `Sudut pusat = 360° ÷ ${n} = ${pgD(a)}.`, `Dengan protraktor, ukur ${pgD(a)} berturut-turut dari OA dan tandakan ${n} titik pada bulatan.`, 'Sambungkan titik-titik itu dengan pembaris.'] });
  return Object.assign(q, { kind: 'lukis', figAns: pgPusatFig(n, pgD(a), true) });
};
PG.perimeter = r => {
  const n = r.p([3, 4, 5, 6, 8, 9, 10]), a = r.i(2, 15), p = n * a, sek = pgSek(n);
  const v = vq('perimeter', { n, a, p, sek });
  let ans, work;
  if (/Hitung perimeternya/.test(v.q)) { ans = `${p} cm`; work = ['Semua sisi poligon sekata sama panjang.', `Perimeter = ${n} × ${a} = ${p} cm`]; }
  else if (/Namakan/.test(v.q)) { ans = vcap(sek); work = [`Bilangan sisi = ${p} ÷ ${a} = ${n}`, `Poligon sekata ${n} sisi ialah ${sek}.`]; }
  else { ans = `${a} cm`; work = [`${vcap(sek)} mempunyai ${n} sisi yang sama panjang.`, `Panjang sisi = ${p} ÷ ${n} = ${a} cm`]; }
  return { q: v.q, ans, work };
};
PG.k41 = r => {
  const h = { j: r.i(3, 12) };
  const sn = r.p([3, 4, 5, 6, 8, 9, 10]), sa = r.i(3, 12), s = { n: sn, a: sa, p: sn * sa };
  const tn = r.p([5, 6, 9, 10, 12, 18, 20]), t = { n: tn, c: 360 / tn, b: (180 - 360 / tn) / 2 };
  const v = vq('k41', { h, s, t });
  const fig = /heksagon sekata ABCDEF/.test(v.q) ? pgRegFig(6, { circle: true, center: '?', labs: 'ABCDEF'.split('') }) : '';
  return Object.assign({ q: v.q, ans: v.ans, work: v.work }, fig ? { fig } : {});
};

/* ---------- 4.2 ---------- */
PG.jumlah = r => {
  const n = r.i(3, 20), nm = pgNama(n), S = pgJum(n);
  return GEN_LQ('jumlah', { n, nm, ans: pgD(S), work: ['Hasil tambah sudut pedalaman = (n − 2) × 180°', `= (${n} − 2) × 180°`, `= ${n - 2} × 180° = ${pgD(S)}`] });
};
PG.segiTiga = r => {
  const n = r.i(4, 10), nm = PGNAMA[n], S = pgJum(n), ang = pgRandAng(r, n);
  // pepenjuru dari bucu pertama
  const pts = pgAngPoly(r, ang, [52, 28, 268, 232]);
  let dg = ''; for (let i = 2; i < n - 1; i++) dg += pgL(pts[0], pts[i], 'pa', 2.2, true);
  const fig = pgSvg(pgPoly(pts, 'tr', 3.5, .12) + dg + pgDot(pts[0], 'am', 5.5), `${vcap(nm)} dibahagi kepada segi tiga dari satu bucu`);
  return GEN_LQ('segiTiga', { n, nm, ans: `${n - 2} segi tiga; ${pgD(S)}`, work: [`Pepenjuru dari satu bucu membahagi poligon ${n} sisi kepada ${n} − 2 = ${n - 2} segi tiga.`, `Hasil tambah sudut pedalaman = ${n - 2} × 180° = ${pgD(S)}`] }, { fig });
};
PG.ped = r => {
  const n = r.p([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20]), sek = pgSek(n), a = pgPed(n);
  return GEN_LQ('ped', { n, sek, ans: pgD(a), work: [`Hasil tambah sudut pedalaman = (${n} − 2) × 180° = ${pgD(pgJum(n))}`, `Sudut pedalaman = ${pgD(pgJum(n))} ÷ ${n} = ${pgD(a)}`] }, n <= 12 ? { figAns: pgRegFig(n, { ang: pgD(a) }) } : {});
};
PG.pel = r => {
  const n = r.p([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), sek = pgSek(n), e = pgPel(n);
  return GEN_LQ('pel', { n, sek, ans: pgD(e), work: ['Hasil tambah sudut peluaran = 360°', `Sudut peluaran = 360° ÷ ${n} = ${pgD(e)}`] }, n <= 12 ? { figAns: pgRegFig(n, { ext: pgD(e) }) } : {});
};
PG.pedPel = (r, k) => {
  const giv = (k == null ? r.f() < .5 : k % 2 === 0) ? 'pedalaman' : 'peluaran', v = giv === 'pedalaman' ? 5 * r.i(13, 33) : 5 * r.i(4, 22), w = 180 - v;
  const a = giv === 'pedalaman' ? v : w;
  const fig = giv === 'pedalaman' ? pgBucuFig(a, pgD(a), '<tspan font-style="italic">y</tspan>') : pgBucuFig(a, '<tspan font-style="italic">x</tspan>', pgD(180 - a));
  const un = giv === 'pedalaman' ? 'y' : 'x';
  const v1 = vq('pedPel', { giv, v });
  const ans = /Cari nilai/.test(v1.q) ? `${un} = ${pgD(w)}` : pgD(w);
  return { q: v1.q, ans, work: ['Sudut pedalaman + sudut peluaran = 180° (sudut pada garis lurus)', `= 180° − ${pgD(v)} = ${pgD(w)}`], fig };
};
PG.cariPed = r => {
  const n = r.p([4, 5, 5, 6, 6]), ang = pgRandAng(r, n), nm = PGNAMA[n], L = pgLab(r, n), giv = ang.slice(0, n - 1), x = ang[n - 1], s = pgSum(giv);
  const labs = giv.map(pgD).concat(['<tspan font-style="italic">x</tspan>']);
  return GEN_LQ('cariPed', { n, nm, L, giv, s, ans: `x = ${pgD(x)}`, work: [`Hasil tambah sudut pedalaman ${nm} = (${n} − 2) × 180° = ${pgD(pgJum(n))}`, `${giv.map(pgD).join(' + ')} = ${pgD(s)}`, `x = ${pgD(pgJum(n))} − ${pgD(s)} = ${pgD(x)}`] }, { fig: pgAngFig(r, ang, labs, { verts: L.split('') }) });
};
PG.cariPel = r => {
  const n = r.p([4, 5, 5, 6]), avg = 360 / n; let e;
  do { e = Array.from({ length: n - 1 }, () => 5 * r.i(Math.ceil((avg - 25) / 5), Math.floor((avg + 25) / 5))); e.push(360 - pgSum(e)); } while (e[n - 1] < avg - 28 || e[n - 1] > avg + 28 || e[n - 1] < 30);
  const nm = PGNAMA[n], giv = e.slice(0, n - 1), y = e[n - 1], s = pgSum(giv);
  return GEN_LQ('cariPel', { n, nm, giv, s, ans: `y = ${pgD(y)}`, work: ['Hasil tambah sudut peluaran = 360°', `${giv.map(pgD).join(' + ')} + y = 360°`, `y = 360° − ${pgD(s)} = ${pgD(y)}`] }, { fig: pgExtFig(r, e, giv.map(pgD).concat(['<tspan font-style="italic">y</tspan>'])) });
};
PG.cariN = (r, k) => {
  const mode = k == null ? r.i(0, 2) : k % 3;
  if (mode === 0) { const n = r.p([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), e = 360 / n; return GEN_LQ('nPel', { e, ans: `${n}`, work: ['n = 360° ÷ sudut peluaran', `= 360° ÷ ${pgD(e)} = ${n}`] }); }
  if (mode === 1) { const n = r.p([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30]), a = pgPed(n); return GEN_LQ('nPed', { a, ans: `${n} sisi`, work: [`Sudut peluaran = 180° − ${pgD(a)} = ${pgD(180 - a)}`, `n = 360° ÷ ${pgD(180 - a)} = ${n}`] }); }
  const n = r.i(5, 16), S = pgJum(n);
  return GEN_LQ('nJum', { S, ans: `${n}`, work: [`(n − 2) × 180° = ${pgD(S)}`, `n − 2 = ${S} ÷ 180 = ${n - 2}`, `n = ${n}`] });
};
const PGRT = [[2, 1], [3, 1], [4, 1], [5, 1], [3, 2], [7, 2], [13, 2], [8, 1], [7, 3]].filter(([p, q]) => { const e = 180 * q / (p + q); return Number.isInteger(e) && Number.isInteger(360 / e); });
const PGDUA = [[4, 6], [5, 6], [4, 8], [5, 5], [6, 6], [5, 10], [4, 5], [6, 8], [5, 8], [3, 4], [3, 5]];
PG.k42 = r => {
  const [p, q] = r.p(PGRT), e = 180 * q / (p + q), rt = { p, q, e, n: 360 / e };
  // sudut dalam sebutan x: sudut ke-i = cs[i]·x + ds[i] (i < n − 1); sudut terakhir nombor tetap
  let ex = null;
  while (!ex) {
    const n = r.p([5, 6]), x = 5 * r.i(6, 16), cs = [], ds = [], vals = [];
    for (let i = 0; i < n - 1; i++) { const c = r.p([1, 1, 2]), v = 5 * r.i(16, 32); cs.push(c); ds.push(v - c * x); vals.push(v); }
    vals.push(pgJum(n) - pgSum(vals));
    const last = vals[n - 1];
    if (last < 70 || last > 165 || last % 5 || !cs.includes(2) || new Set(vals).size < n || ds.some(d => Math.abs(d) > 60)) continue;
    const ex1 = (c, d) => `${c === 1 ? '' : c}x${d === 0 ? '' : d > 0 ? ' + ' + d : ' − ' + (-d)}`;
    const labs = cs.map((c, i) => (ds[i] === 0 ? `${ex1(c, 0)}°` : `(${ex1(c, ds[i])})°`)).concat([pgD(last)]);
    const cx = pgSum(cs), K = pgSum(ds) + last, S = pgJum(n);
    const bi = vals.indexOf(Math.max(...vals));
    const bigW = bi === n - 1 ? pgD(last) : `${cs[bi] === 1 ? '' : cs[bi]}(${x})${ds[bi] === 0 ? '' : ds[bi] > 0 ? ' + ' + ds[bi] : ' − ' + (-ds[bi])} = ${pgD(vals[bi])}`;
    const lhs = cs.map((c, i) => (ds[i] === 0 ? ex1(c, 0) : `(${ex1(c, ds[i])})`)).concat([`${last}`]).join(' + ');
    if (K <= 0 || cx * x + K !== S) continue;
    ex = { n, nm: PGNAMA[n], x, labs, vals, cx, K, S, big: vals[bi], bigW, lhs };
  }
  const [n1, n2] = r.p(PGDUA), du = { n1, n2, x: 360 - pgPed(n1) - pgPed(n2) };
  let al; do { const n = r.p([5, 6, 8, 9, 10, 12, 15, 18]), e2 = 360 / n, x = r.i(5, Math.min(40, e2 + 20)), a = e2 - x, b = r.p([2, 3, 4, 5]), c = 180 - e2 - b * x; al = { n, e: e2, x, a, b, c }; } while (al.a <= 0 || Math.abs(al.c) > 90 || al.c === 0);
  const v = vq('k42', { rt, ex, du, al });
  let fig = '';
  if (/berkongsi sisi AB/.test(v.q)) fig = pgDuaFig(n1, n2);
  else if (/Sudut-sudut pedalaman sebuah/.test(v.q)) fig = pgAngFig(r, ex.vals, ex.labs.map(t => t.replace(/x/g, '<tspan font-style="italic">x</tspan>')), { w: 420, h: 300, box: [70, 30, 350, 270], k: 52, fs: 14 });
  return Object.assign({ q: v.q, ans: v.ans, work: v.work }, fig ? { fig } : {});
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '4.1': {
    m: [() => PG.nama(pgRG), () => PG.paksi(pgRG), () => PG.kenal(pgRG), () => PG.bs(pgRG, PGBS1), () => PG.paksiNama(pgRG)],
    s: [() => PG.pusat(pgRG), () => PG.pusatN(pgRG), () => PG.perimeter(pgRG), () => PG.bina(pgRG)],
    k: [() => PG.k41(pgRG)]
  },
  '4.2': {
    m: [() => PG.jumlah(pgRG), () => PG.segiTiga(pgRG), () => PG.ped(pgRG), () => PG.pel(pgRG), () => PG.pedPel(pgRG), () => PG.bs(pgRG, PGBS2)],
    s: [() => PG.cariPed(pgRG), () => PG.cariPel(pgRG), () => PG.cariN(pgRG)],
    k: [() => PG.k42(pgRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 4.1
WG.nama = i => PG.nama(pgRW, i);
WG.paksi = () => PG.paksi(pgRW);
WG.paksiNama = () => PG.paksiNama(pgRW);
WG.kenal = i => PG.kenal(pgRW, i);
WG.bs1 = i => PG.bs(pgRW, PGBS1, [1, 4, 3][i % 3] + wri(0, 1) * [5, 4, 3][i % 3]);
WG.pusat = () => PG.pusat(pgRW);
WG.pusatN = () => PG.pusatN(pgRW);
WG.bina = i => PG.bina(pgRW, i);
WG.perimeter = () => PG.perimeter(pgRW);
WG.k41 = () => PG.k41(pgRW);
// 4.2
WG.jumlah = () => PG.jumlah(pgRW);
WG.segiTiga = () => PG.segiTiga(pgRW);
WG.ped = () => PG.ped(pgRW);
WG.pel = () => PG.pel(pgRW);
WG.pedPel = i => PG.pedPel(pgRW, i);
WG.bs2 = i => PG.bs(pgRW, PGBS2, [1, 4, 6][i % 3] + wri(0, 1) * [1, 3, 1][i % 3]);
WG.cariPed = () => PG.cariPed(pgRW);
WG.cariPel = () => PG.cariPel(pgRW);
WG.cariN = i => PG.cariN(pgRW, i);
WG.k42 = () => PG.k42(pgRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '4.1': [['m', 'nama', 6], ['m', 'paksi', 4], ['m', 'kenal', 5], ['m', 'bs1', 3], ['s', 'pusat', 2], ['s', 'pusatN', 2], ['s', 'paksiNama', 1], ['s', 'bina', 3], ['s', 'perimeter', 1], ['k', 'k41', 3]],
  '4.2': [['m', 'jumlah', 4], ['m', 'segiTiga', 3], ['m', 'ped', 3], ['m', 'pel', 3], ['m', 'pedPel', 3], ['m', 'bs2', 2], ['s', 'cariPed', 3], ['s', 'cariPel', 3], ['s', 'cariN', 3], ['k', 'k42', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function pgOptsN(ans, cands, f, pos = true) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isFinite(c) || !Number.isInteger(c) || (pos && c <= 0)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 200; k++) { const vv = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (ans >= 30 ? 5 : 1); if (pos && vv <= 0) continue; const s = f(vv); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function pgOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pgMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const pgDeg = v => pgD(v);
const CQGEN = {
  nama: [
    () => { const n = ri(3, 10), ang = pgRandAng(pgRG, n); return pgMcq('Apakah nama poligon ini?', pgAngFig(pgRG, ang, ang.map(() => null)), pgOptsT(vcap(PGNAMA[n]), Object.keys(PGNAMA).filter(k => Math.abs(k - n) <= 3).map(k => vcap(PGNAMA[k])))); },
    () => { const n = pick([3, 4, 5, 6, 8, 9, 10]); return pgMcq(`Berapakah bilangan paksi simetri ${pgSek(n)}?`, pgRegFig(n, { ticks: true }), pgOptsN(n, [n / 2, n - 1, n + 1, 2 * n, n - 2].filter(Number.isInteger), v => `${v}`)); },
    () => { const n = ri(5, 10); return pgMcq(`Sebuah poligon sekata mempunyai ${n} paksi simetri. Apakah poligon itu?`, pgRegFig(n, { axes: true }), pgOptsT(vcap(pgSek(n)), [3, 4, 5, 6, 7, 8, 9, 10].filter(k => Math.abs(k - n) <= 3).map(k => vcap(pgSek(k))))); }
  ],
  sekata: [
    () => { const s = shuffle([['Segi empat sama', true], ['Rombus', false], ['Segi empat tepat', false], ['Segi tiga sama kaki', false], ['Segi tiga bersudut tegak', false], ['Segi tiga sama sisi', true], ['Heksagon sekata', true], ['Trapezium', false], ['Segi empat selari', false], ['Lelayang', false]]); const yes = s.find(x => x[1]), no = s.filter(x => !x[1]).slice(0, 3); return pgMcq('Antara berikut, yang manakah <b>poligon sekata</b>?', pgTxtFig(['Poligon sekata', 'semua sisi sama panjang', 'semua sudut sama besar']), pgOptsT(yes[0], no.map(x => x[0]).concat([yes[0]]))); },
    () => { const n = pick([4, 5, 6, 8, 9, 10, 12]), a = 360 / n; return pgMcq(`Sudut pusat untuk membina ${pgSek(n)} dalam bulatan ialah`, pgPusatFig(n, '?', false), pgOptsN(a, [pgPed(n), 180 / n, a + 10, a * 2, 360 / (n + 1)], pgDeg)); },
    () => { const n = pick([5, 6, 8, 9, 10, 12, 15, 18]), a = 360 / n; return pgMcq(`Sudut pusat sebuah poligon sekata ialah ${pgD(a)}. Berapakah bilangan sisinya?`, pgPusatFig(n, pgD(a), false), pgOptsN(n, [n + 1, n - 1, n * 2, n + 2, Math.round(180 / a)], v => `${v}`)); }
  ],
  jumlah: [
    () => { const n = ri(4, 10); return pgMcq(`Hasil tambah sudut pedalaman ${PGNAMA[n]} ialah`, pgRegFig(n), pgOptsN(pgJum(n), [n * 180, (n - 1) * 180, (n - 3) * 180, 360], pgDeg)); },
    () => { const n = ri(5, 14), S = pgJum(n); return pgMcq(`Hasil tambah sudut pedalaman sebuah poligon ialah ${pgD(S)}. Berapakah bilangan sisinya?`, pgTxtFig([`(n − 2) × 180° = ${pgD(S)}`, 'n = ?']), pgOptsN(n, [n - 2, n + 2, n - 1, n + 1], v => `${v}`)); },
    () => { const n = ri(3, 12); return pgMcq(`Hasil tambah sudut <b>peluaran</b> poligon ${n} sisi ialah`, pgRegFig(n), pgOptsT('360°', ['180°', '720°', pgD(pgJum(n)), pgD(n * 180), '540°'].filter(s => s !== '360°'))); }
  ],
  sudutSekata: [
    () => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12]); return pgMcq(`Sudut peluaran ${pgSek(n)} ialah`, pgRegFig(n, { ext: '?' }), pgOptsN(pgPel(n), [pgPed(n), 180 / n, pgPel(n) + 10, 360 / (n + 1)], pgDeg)); },
    () => { const n = pick([3, 4, 5, 6, 8, 9, 10, 12]); return pgMcq(`Sudut pedalaman ${pgSek(n)} ialah`, pgRegFig(n, { ang: '?' }), pgOptsN(pgPed(n), [pgPel(n), pgJum(n) / 2, pgPed(n) + 10, pgPed(n) - 10], pgDeg)); },
    () => { const v = 5 * ri(13, 33); return pgMcq(`Sudut pedalaman pada satu bucu ialah ${pgD(v)}. Sudut peluarannya ialah`, pgBucuFig(v, pgD(v), '?'), pgOptsN(180 - v, [360 - v, 90 - v, v - 90, v].filter(x => x > 0 && x !== 180 - v), pgDeg)); }
  ],
  bilSisi: [
    () => { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]), e = 360 / n; return pgMcq(`Sudut peluaran sebuah poligon sekata ialah ${pgD(e)}. Berapakah bilangan sisinya?`, pgBucuFig(180 - e, '', pgD(e)), pgOptsN(n, [180 / e, n + 2, n - 2, n * 2].filter(Number.isInteger), v => `${v}`)); },
    () => { const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), a = pgPed(n); return pgMcq(`Sudut pedalaman sebuah poligon sekata ialah ${pgD(a)}. Berapakah bilangan sisinya?`, pgBucuFig(a, pgD(a), ''), pgOptsN(n, [n + 1, n - 1, n + 2, Math.round(360 / a) || 3], v => `${v}`)); },
    () => { const [p, q] = pick(PGRT), e = 180 * q / (p + q), n = 360 / e; return pgMcq(`Sudut pedalaman : sudut peluaran poligon sekata = ${p} : ${q}. Berapakah bilangan sisinya?`, pgBucuFig(180 - e, `${p}k`, `${q}k`), pgOptsN(n, [p + q, 2 * p, n + 2, n - 2, p * q * 2], v => `${v}`)); }
  ],
  cariSudut: [
    () => { const n = pick([4, 5, 6]), ang = pgRandAng(pgRG, n), x = ang[n - 1], giv = ang.slice(0, n - 1); return pgMcq(`Cari nilai <i>x</i> dalam ${PGNAMA[n]} ini.`, pgAngFig(pgRG, ang, giv.map(pgD).concat(['<tspan font-style="italic">x</tspan>'])), pgOptsN(x, [n * 180 - pgSum(giv), x + 180, 360 - pgSum(giv) + (n === 4 ? 180 : 0), x + 10, x - 10].filter(v => v > 0 && v < 400), pgDeg)); },
    () => { const n = pick([4, 5]), avg = 360 / n; let e; do { e = Array.from({ length: n - 1 }, () => 5 * ri(Math.ceil((avg - 20) / 5), Math.floor((avg + 20) / 5))); e.push(360 - pgSum(e)); } while (Math.abs(e[n - 1] - avg) > 25); const giv = e.slice(0, n - 1); return pgMcq('Cari nilai <i>y</i> (sudut peluaran).', pgExtFig(pgRG, e, giv.map(pgD).concat(['<tspan font-style="italic">y</tspan>'])), pgOptsN(e[n - 1], [pgJum(n) - pgSum(giv), 180 - e[n - 1], e[n - 1] + 10, e[n - 1] - 10].filter(v => v > 0), pgDeg)); },
    () => { const [n1, n2] = pick(PGDUA), x = 360 - pgPed(n1) - pgPed(n2); return pgMcq(`${vcap(pgSek(n1))} dan ${pgSek(n2)} berkongsi sisi AB. Cari nilai <i>x</i>.`, pgDuaFig(n1, n2), pgOptsN(x, [pgPed(n1) + pgPed(n2), 180 - x, x + 12, x - 12, 360 - pgPel(n1) - pgPel(n2)].filter(v => v > 0 && v !== x), pgDeg)); }
  ]
};
const CQT = { nama: 'Nama & paksi simetri', sekata: 'Poligon sekata', jumlah: 'Hasil tambah sudut', sudutSekata: 'Sudut poligon sekata', bilSisi: 'Bilangan sisi', cariSudut: 'Cari sudut' };
function pgCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.nama;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;   // aras tinggi kadang-kadang ulang aras lebih rendah
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['nama', 'sekata', 'jumlah', 'sudutSekata'] : Object.keys(CQT);
  return pgCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pgCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
