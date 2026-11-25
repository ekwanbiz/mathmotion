'use strict';
/* =================== BENTUK3D · SOALAN BAB 6 BENTUK GEOMETRI TIGA DIMENSI (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "b3" / "B3" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & rawak =================== */
// nombor kemas: maksimum 2 t.p., tiada sifar mengekor, tiada −0, ruang ribuan bagi ≥ 10 000
const b3n = x => {
  let v = Math.round(x * 100) / 100; if (Math.abs(v) < 1e-9) v = 0;
  let s = v.toFixed(2); s = s.replace(/0+$/, '').replace(/\.$/, '');
  const [a, b] = s.split('.');
  const g = a.length > 4 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : a;
  return b ? g + '.' + b : g;
};
// nilai pertengahan (hingga 4 t.p.)
const b3x = x => { const v = Math.round(x * 1e4) / 1e4; return Math.abs(v - Math.round(v * 100) / 100) < 1e-9 ? b3n(v) : String(v); };
// jumlah pertengahan hanya jika setiap sebutan tepat (≤ 3 t.p.)
const b3xs = a => (a.every(x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6) ? `= ${a.map(b3x).join(' + ')}` : null);
const b3ex = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
const b3eq = (x, u) => `${b3ex(x) ? '=' : '≈'} ${b3n(x)}${u ? ' ' + u : ''}`;
const b3u = (x, u) => `${b3n(x)} ${u}`;
const b3RG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const b3RW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const b3Sh = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const b3Dan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
// π: 22/7 bagi jejari gandaan 3.5, selainnya 3.142
const B3P22 = { t: '22/7', m: x => x * 22 / 7 }, B3P3 = { t: '3.142', m: x => x * 3.142 };
const b3PiFor = j => (Math.abs(j / 3.5 - Math.round(j / 3.5)) < 1e-9 ? B3P22 : B3P3);
const b3PiTx = pi => ` (Guna π = ${pi.t}.)`;
const B3J22 = [3.5, 7, 7, 10.5, 14, 14, 21];
const B3J3 = [2, 3, 4, 5, 6, 8, 9, 10, 12];
const b3Jej = (r, use22) => (use22 == null ? r.f() < .55 : use22) ? r.p(B3J22) : r.p(B3J3);
const b3vis = a => { const m = Math.max(...a); return a.map(x => Math.max(.38, x / m)); };

/* =================== data bentuk =================== */
const B3POLY = { 3: 'segi tiga', 4: 'segi empat', 5: 'pentagon', 6: 'heksagon', 7: 'heptagon', 8: 'oktagon', 9: 'nonagon', 10: 'dekagon', 12: 'dodekagon' };
const B3S = {
  kubus: { nm: 'kubus', n: 4, pr: 1, F: 6, E: 12, V: 8, d: '6 muka segi empat sama yang sama saiz, 12 tepi dan 8 bucu' },
  kuboid: { nm: 'kuboid', n: 4, pr: 1, F: 6, E: 12, V: 8, d: '6 muka segi empat tepat (tidak semuanya segi empat sama), 12 tepi dan 8 bucu' },
  prisma3: { nm: 'prisma segi tiga', n: 3, pr: 1, F: 5, E: 9, V: 6, d: '2 tapak segi tiga yang selari dan sama saiz serta 3 muka sisi segi empat tepat' },
  prisma5: { nm: 'prisma pentagon', n: 5, pr: 1, F: 7, E: 15, V: 10, d: '2 tapak pentagon yang selari dan sama saiz serta 5 muka sisi segi empat tepat' },
  prisma6: { nm: 'prisma heksagon', n: 6, pr: 1, F: 8, E: 18, V: 12, d: '2 tapak heksagon yang selari dan sama saiz serta 6 muka sisi segi empat tepat' },
  piramid4: { nm: 'piramid tapak segi empat sama', n: 4, py: 1, F: 5, E: 8, V: 5, d: '1 tapak segi empat sama dan 4 muka sisi segi tiga yang bertemu pada satu puncak' },
  piramid3: { nm: 'piramid tapak segi tiga', n: 3, py: 1, F: 4, E: 6, V: 4, d: '4 muka segi tiga, 6 tepi dan 4 bucu' },
  piramid5: { nm: 'piramid tapak pentagon', n: 5, py: 1, F: 6, E: 10, V: 6, d: '1 tapak pentagon dan 5 muka sisi segi tiga yang bertemu pada satu puncak' },
  silinder: { nm: 'silinder', cv: 1, rata: 2, lengkung: 1, bucu: 0, d: '2 tapak bulatan yang selari dan sama saiz serta 1 permukaan melengkung' },
  kon: { nm: 'kon', cv: 1, rata: 1, lengkung: 1, bucu: 1, d: '1 tapak bulatan, 1 permukaan melengkung dan 1 bucu' },
  sfera: { nm: 'sfera', cv: 1, rata: 0, lengkung: 1, bucu: 0, d: '1 permukaan melengkung sahaja dan setiap titik pada permukaannya sama jarak dari pusat' }
};
const B3POLYK = ['kubus', 'kuboid', 'prisma3', 'prisma5', 'prisma6', 'piramid4', 'piramid3', 'piramid5'];
const B3ALLK = Object.keys(B3S);
const B3CONF = { kubus: 'kuboid', kuboid: 'kubus', prisma3: 'piramid tapak segi tiga', prisma5: 'piramid tapak pentagon', prisma6: 'prisma pentagon', piramid4: 'prisma segi empat', piramid3: 'prisma segi tiga', piramid5: 'prisma pentagon', silinder: 'prisma bulatan', kon: 'piramid', sfera: 'bulatan' };
const B3WHY = { kubus: 'Semua muka kubus ialah segi empat sama yang sama saiz.', kuboid: 'Muka kuboid ialah segi empat tepat dan tidak semuanya segi empat sama.', prisma3: 'Bentuk ini mempunyai keratan rentas segi tiga yang seragam, bukan puncak.', prisma5: 'Bentuk ini mempunyai keratan rentas pentagon yang seragam, bukan puncak.', prisma6: 'Tapak bentuk ini mempunyai 6 sisi, iaitu heksagon.', piramid4: 'Muka sisinya ialah segi tiga yang bertemu pada satu puncak.', piramid3: 'Muka sisinya bertemu pada satu puncak; tiada keratan rentas seragam.', piramid5: 'Muka sisinya bertemu pada satu puncak; tiada keratan rentas seragam.', silinder: 'Silinder mempunyai permukaan melengkung; prisma hanya mempunyai muka rata.', kon: 'Tapak kon ialah bulatan dan ia mempunyai permukaan melengkung.', sfera: 'Bulatan ialah bentuk 2D, manakala objek ini ialah bentuk 3D.' };
const b3FEVwork = (k, what) => {
  const s = B3S[k], n = s.n, P = k === 'kubus' ? 'segi empat sama' : k === 'kuboid' ? 'segi empat tepat' : B3POLY[n];
  if (s.pr) return {
    muka: [`2 tapak ${P} + ${n} muka sisi = ${s.F} muka`],
    tepi: [`${n} tepi pada setiap tapak: ${n} × 2 = ${2 * n}`, `${n} tepi sisi yang menyambungkan dua tapak`, `Jumlah = ${2 * n} + ${n} = ${s.E} tepi`],
    bucu: [`${n} bucu pada setiap tapak`, `Jumlah = ${n} × 2 = ${s.V} bucu`]
  }[what];
  return {
    muka: [`1 tapak ${P} + ${n} muka sisi segi tiga = ${s.F} muka`],
    tepi: [`${n} tepi tapak + ${n} tepi sisi yang bertemu di puncak = ${s.E} tepi`],
    bucu: [`${n} bucu tapak + 1 puncak = ${s.V} bucu`]
  }[what];
};
const B3BS1 = [
  ['Prisma mempunyai keratan rentas yang seragam.', true, 'Keratan rentas prisma sama bentuk dan saiz di sepanjang panjangnya.'],
  ['Piramid mempunyai keratan rentas yang seragam.', false, 'Keratan rentas piramid semakin kecil ke arah puncak, maka tidak seragam.'],
  ['Kubus ialah sejenis prisma.', true, 'Kubus mempunyai keratan rentas segi empat sama yang seragam.'],
  ['Silinder mempunyai 2 bucu.', false, 'Silinder tidak mempunyai bucu.'],
  ['Kon mempunyai 1 bucu.', true, 'Puncak kon ialah satu-satunya bucu kon.'],
  ['Sfera mempunyai 1 permukaan rata.', false, 'Sfera hanya mempunyai 1 permukaan melengkung dan tiada permukaan rata.'],
  ['Semua muka sisi sebuah piramid berbentuk segi tiga.', true, 'Muka sisi piramid bertemu pada puncak, maka setiap muka sisi ialah segi tiga.'],
  ['Prisma segi tiga mempunyai 6 muka.', false, 'Prisma segi tiga mempunyai 5 muka: 2 segi tiga dan 3 segi empat tepat.'],
  ['Nama sesebuah prisma atau piramid ditentukan oleh bentuk tapaknya.', true, 'Contohnya, prisma bertapak heksagon dinamakan prisma heksagon.'],
  ['Kuboid mempunyai 12 tepi dan 8 bucu.', true, 'Kuboid: 6 muka, 12 tepi dan 8 bucu.']
];

/* =================== rajah: pepejal polihedron (unjuran ortografik condong) =================== */
const b3Cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const b3Dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const b3Sb = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const B3VW = (() => { const v = [.62, -1, .5], L = Math.hypot(...v); return v.map(x => x / L); })();
const B3RT = (() => { const a = [-B3VW[1], B3VW[0], 0], L = Math.hypot(...a); return a.map(x => x / L); })();
const B3UP = b3Cr(B3VW, B3RT);
const b3Pj = p => [b3Dt(p, B3RT), -b3Dt(p, B3UP)];
const b3T = (x, y, t, c = 'tx', sz = 16, a = 'middle') => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const b3Svg = (s, label, W = 320, H = 240) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || 'Rajah bentuk 3D')}" font-family="Inter, sans-serif">${s}</svg>`;
// o = { V, F, c, hl:[muka], lab:[[i,j,teks,warna]], ex:[{a,b,c,dash,t,at,dx,dy,an}], flab:[[muka, teks]], label }
function b3Solid(o) {
  const { V, F } = o, c = o.c || 'tr', W = 320, H = 240;
  const C3 = V.reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]).map(x => x / V.length);
  const fc = f => f.reduce((s, i) => [s[0] + V[i][0], s[1] + V[i][1], s[2] + V[i][2]], [0, 0, 0]).map(x => x / f.length);
  const vis = F.map(f => { let n = b3Cr(b3Sb(V[f[1]], V[f[0]]), b3Sb(V[f[2]], V[f[0]])); if (b3Dt(n, b3Sb(fc(f), C3)) < 0) n = n.map(x => -x); return b3Dt(n, B3VW) > 1e-6; });
  const P0 = V.map(b3Pj), allP = P0.concat((o.ex || []).flatMap(e => [b3Pj(e.a), b3Pj(e.b)]));
  const xs = allP.map(p => p[0]), ys = allP.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), bw = Math.max(...xs) - x0 || 1, bh = Math.max(...ys) - y0 || 1;
  const sc = Math.min((W - 2 * (o.padX || 58)) / bw, (H - 2 * (o.padY || 34)) / bh), ox = (W - bw * sc) / 2, oy = (H - bh * sc) / 2;
  const M = p => [ox + (p[0] - x0) * sc, oy + (p[1] - y0) * sc], P = P0.map(M), Pp = p3 => M(b3Pj(p3));
  const G = P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length], [0, 0]);
  const ed = new Map();
  F.forEach((f, fi) => f.forEach((a, k) => { const b = f[(k + 1) % f.length], key = Math.min(a, b) + '-' + Math.max(a, b); if (!ed.has(key)) ed.set(key, [a, b, false]); if (vis[fi]) ed.get(key)[2] = true; }));
  const L = (p, q, st) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" ${st}/>`;
  let s = '';
  ed.forEach(([a, b, v]) => { if (!v) s += L(P[a], P[b], 'style="stroke:var(--mu)" stroke-width="2" stroke-dasharray="6 5"'); });
  F.forEach((f, fi) => { if (vis[fi]) s += `<polygon points="${f.map(i => P[i].map(x => x.toFixed(1)).join(',')).join(' ')}" style="fill:var(--${(o.hl || []).includes(fi) ? (o.hc || 'am') : c});fill-opacity:${(o.hl || []).includes(fi) ? .34 : .13};stroke:none"/>`; });
  ed.forEach(([a, b, v]) => { if (v) s += L(P[a], P[b], `style="stroke:var(--${c})" stroke-width="3" stroke-linecap="round"`); });
  (o.ex || []).forEach(e => { const p = Pp(e.a), q = Pp(e.b); s += L(p, q, `style="stroke:var(--${e.c || 'pk'})" stroke-width="2.5"${e.dash !== false ? ' stroke-dasharray="6 4"' : ''}`); if (e.t) { const at = e.at ?? .5, m = [p[0] + (q[0] - p[0]) * at, p[1] + (q[1] - p[1]) * at]; s += b3T(m[0] + (e.dx ?? 8), m[1] + (e.dy ?? 0), e.t, e.c || 'pk', 16, e.an || 'start'); } });
  (o.flab || []).forEach(([fi, t]) => { const p = Pp(fc(F[fi])); s += b3T(p[0], p[1], t, 'am', 15); });
  (o.lab || []).forEach(([a, b, t, lc, dir]) => {
    const m = [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2]; let dx = dir ? dir[0] : m[0] - G[0], dy = dir ? dir[1] : m[1] - G[1]; const ln = Math.hypot(dx, dy) || 1; dx /= ln; dy /= ln;
    s += b3T(m[0] + dx * 15, m[1] + dy * 13, t, lc || 'tx', 16, dx > .35 ? 'start' : dx < -.35 ? 'end' : 'middle');
  });
  return b3Svg(s, o.label);
}
const b3Box = (p, l, t) => ({ V: [[0, 0, 0], [p, 0, 0], [p, l, 0], [0, l, 0], [0, 0, t], [p, 0, t], [p, l, t], [0, l, t]], F: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]] });
// prisma berbaring: keratan rentas [[x,z]] di depan (y = 0), panjang L ke belakang. F[0] = muka depan
const b3PrLie = (pts, L) => { const n = pts.length, V = pts.map(([x, z]) => [x, 0, z]).concat(pts.map(([x, z]) => [x, L, z])), F = [pts.map((_, i) => i), pts.map((_, i) => n + i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]); return { V, F }; };
// prisma tegak: tapak [[x,y]] pada z = 0, tinggi h
const b3PrUp = (pts, h) => { const n = pts.length, V = pts.map(([x, y]) => [x, y, 0]).concat(pts.map(([x, y]) => [x, y, h])), F = [pts.map((_, i) => i), pts.map((_, i) => n + i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]); return { V, F }; };
const b3Pyr = (pts, ap) => { const n = pts.length, V = pts.map(([x, y]) => [x, y, 0]).concat([ap]), F = [pts.map((_, i) => i)]; for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]); return { V, F }; };
const b3Reg = (n, R) => Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + Math.PI / n + 2 * Math.PI * i / n; return [R * Math.cos(a), R * Math.sin(a)]; });

/* ---------- pepejal bulat (silinder, kon, hemisfera, sfera) ---------- */
// parts dari bawah ke atas: {k:'cyl'|'cone'|'vcone'|'hemi'|'hemiD'|'sph', r, h, lr, lh, ls}
function b3Round(parts, o = {}) {
  const W = 320, H = 240, E = .3, c = o.c || 'pu';
  const mr = Math.max(...parts.map(p => p.r)), hOf = p => (p.k === 'hemi' || p.k === 'hemiD' ? p.r : p.k === 'sph' ? 2 * p.r : p.h);
  const tot = parts.reduce((s, p) => s + hOf(p), 0) + 2 * mr * E;
  const sc = Math.min(176 / (2 * mr), 200 / tot), cx = 150;
  let y = (H + tot * sc) / 2 - mr * E * sc, fill = '', ln = '', dsh = '', lab = '';
  const f1 = v => v.toFixed(1);
  const front = (R, ry, yy) => `M${f1(cx - R)} ${f1(yy)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx + R)} ${f1(yy)}`;
  const back = (R, ry, yy) => `M${f1(cx + R)} ${f1(yy)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx - R)} ${f1(yy)}`;
  const seam = (R, ry, yy) => { ln += front(R, ry, yy) + ' '; dsh += back(R, ry, yy) + ' '; };
  const L = (a, b) => { ln += `M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} `; };
  const rlab = (R, yy, t) => { lab += `<line x1="${cx}" y1="${f1(yy)}" x2="${f1(cx + R)}" y2="${f1(yy)}" style="stroke:var(--pk)" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${cx}" cy="${f1(yy)}" r="3" style="fill:var(--pk)"/>` + b3T(cx + R + 7, yy, t, 'pk', 15, 'start'); };
  const axis = (ya, yb2, t) => { lab += `<line x1="${cx}" y1="${f1(ya)}" x2="${cx}" y2="${f1(yb2)}" style="stroke:var(--gr)" stroke-width="2.5" stroke-dasharray="5 4"/>` + b3T(cx + 7, (ya + yb2) / 2, t, 'gr', 15, 'start'); };
  parts.forEach((p, i) => {
    const R = p.r * sc, ry = R * E, h = hOf(p) * sc, yb = y, yt = y - h, last = i === parts.length - 1;
    if (i === 0 && (p.k === 'cyl' || p.k === 'cone' || p.k === 'hemi')) seam(R, ry, yb);
    if (p.k === 'cyl') {
      fill += `<path d="${front(R, ry, yb)} L${f1(cx + R)} ${f1(yt)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx - R)} ${f1(yt)} Z" style="fill:var(--${c});fill-opacity:.14"/>`;
      L([cx - R, yb], [cx - R, yt]); L([cx + R, yb], [cx + R, yt]);
      if (last) { fill += `<ellipse cx="${cx}" cy="${f1(yt)}" rx="${f1(R)}" ry="${f1(ry)}" style="fill:var(--${c});fill-opacity:.22"/>`; ln += `${front(R, ry, yt)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx - R)} ${f1(yt)} `; } else seam(R, ry, yt);
      if (p.lr) rlab(R, last ? yt : yb, p.lr);
      if (p.lh) lab += b3T(cx + R + 8, (yb + yt) / 2, p.lh, 'gr', 15, 'start');
    } else if (p.k === 'cone') {
      fill += `<path d="${front(R, ry, yb)} L${cx} ${f1(yt)} Z" style="fill:var(--${c});fill-opacity:.14"/>`;
      L([cx - R, yb], [cx, yt]); L([cx + R, yb], [cx, yt]);
      if (p.lr) rlab(R, yb, p.lr);
      if (p.lh) axis(yb, yt, p.lh);
      if (p.ls) lab += b3T(cx - R / 2 - 9, (yb + yt) / 2, p.ls, 'am', 15, 'end');
    } else if (p.k === 'vcone') {
      fill += `<path d="M${f1(cx - R)} ${f1(yt)} L${cx} ${f1(yb)} L${f1(cx + R)} ${f1(yt)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx - R)} ${f1(yt)} Z" style="fill:var(--${c});fill-opacity:.14"/>`;
      L([cx - R, yt], [cx, yb]); L([cx + R, yt], [cx, yb]);
      if (last) ln += `${front(R, ry, yt)} A${f1(R)} ${f1(ry)} 0 0 0 ${f1(cx - R)} ${f1(yt)} `; else seam(R, ry, yt);
      if (p.lh) axis(yb, yt, p.lh);
      if (p.ls) lab += b3T(cx - R / 2 - 9, (yb + yt) / 2, p.ls, 'am', 15, 'end');
      if (p.lr) rlab(R, yt, p.lr);
    } else if (p.k === 'hemi') {
      fill += `<path d="M${f1(cx - R)} ${f1(yb)} A${f1(R)} ${f1(R)} 0 0 1 ${f1(cx + R)} ${f1(yb)} A${f1(R)} ${f1(ry)} 0 0 1 ${f1(cx - R)} ${f1(yb)} Z" style="fill:var(--${c});fill-opacity:.14"/>`;
      ln += `M${f1(cx - R)} ${f1(yb)} A${f1(R)} ${f1(R)} 0 0 1 ${f1(cx + R)} ${f1(yb)} `;
      if (p.lr) rlab(R, yb, p.lr);
    } else if (p.k === 'hemiD') {
      fill += `<path d="M${f1(cx - R)} ${f1(yt)} A${f1(R)} ${f1(R)} 0 0 0 ${f1(cx + R)} ${f1(yt)} Z" style="fill:var(--${c});fill-opacity:.14"/>`;
      ln += `M${f1(cx - R)} ${f1(yt)} A${f1(R)} ${f1(R)} 0 0 0 ${f1(cx + R)} ${f1(yt)} `;
      seam(R, ry, yt);
      if (p.lr) rlab(R, yt, p.lr);
    } else if (p.k === 'sph') {
      const cy = y - R;
      fill += `<circle cx="${cx}" cy="${f1(cy)}" r="${f1(R)}" style="fill:var(--${c});fill-opacity:.14"/>`;
      ln += `M${f1(cx - R)} ${f1(cy)} A${f1(R)} ${f1(R)} 0 1 1 ${f1(cx + R)} ${f1(cy)} A${f1(R)} ${f1(R)} 0 1 1 ${f1(cx - R)} ${f1(cy)} `;
      seam(R, ry, cy);
      if (p.lr) rlab(R, cy, p.lr);
    }
    y = yt;
  });
  const s = fill + `<path d="${dsh}" style="fill:none;stroke:var(--mu)" stroke-width="2" stroke-dasharray="6 5"/>` + `<path d="${ln}" style="fill:none;stroke:var(--${c})" stroke-width="3" stroke-linecap="round"/>` + lab;
  return b3Svg(s, o.label || 'Pepejal');
}

/* ---------- rajah rata (bentangan) ---------- */
// items: {p:[[x,y]...], c, t, hi} · {o:[x,y,r], c, t} · {sec:[x,y,r,a0,a1], c, t} · {l:[[x,y],[x,y]], c, dash} · {tx:[x,y,teks,warna,anchor]}
function b3Flat(items, o = {}) {
  const W = o.W || 320, H = o.H || 240, pts = [];
  items.forEach(it => {
    if (it.p) pts.push(...it.p);
    if (it.o) { const [x, y, r] = it.o; pts.push([x - r, y - r], [x + r, y + r]); }
    if (it.sec) { const [x, y, r, a0, a1] = it.sec; pts.push([x, y]); for (let k = 0; k <= 16; k++) { const a = (a0 + (a1 - a0) * k / 16) * Math.PI / 180; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]); } }
    if (it.l) pts.push(...it.l);
    if (it.tx) pts.push([it.tx[0], it.tx[1]]);
  });
  let x0, y0, bw, bh;
  if (o.grid) { x0 = 0; y0 = 0; bw = o.grid[0]; bh = o.grid[1]; }
  else { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); x0 = Math.min(...xs); y0 = Math.min(...ys); bw = Math.max(...xs) - x0 || 1; bh = Math.max(...ys) - y0 || 1; }
  const pad = o.grid ? 12 : (o.pad ?? 30), sc = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh), ox = (W - bw * sc) / 2, oy = (H - bh * sc) / 2;
  const X = x => +(ox + (x - x0) * sc).toFixed(1), Y = y => +(oy + (y - y0) * sc).toFixed(1);
  let s = '';
  if (o.grid) { for (let i = 0; i <= bw; i++) s += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(bh)}" style="stroke:var(--grid)" stroke-width="1.5"/>`; for (let j = 0; j <= bh; j++) s += `<line x1="${X(0)}" y1="${Y(j)}" x2="${X(bw)}" y2="${Y(j)}" style="stroke:var(--grid)" stroke-width="1.5"/>`; }
  const st = (c, hi) => `style="fill:var(--${c || 'tr'});fill-opacity:${hi ? .38 : .16};stroke:var(--${c || 'tr'})" stroke-width="2.5" stroke-linejoin="round"`;
  items.forEach(it => {
    if (it.p) { s += `<polygon points="${it.p.map(([x, y]) => X(x) + ',' + Y(y)).join(' ')}" ${st(it.c, it.hi)}/>`; if (it.t != null) { const cx = it.p.reduce((a, p) => a + p[0], 0) / it.p.length, cy = it.p.reduce((a, p) => a + p[1], 0) / it.p.length; s += b3T(X(cx), Y(cy), it.t, it.tc || 'tx', it.ts || 18); } }
    if (it.o) { const [x, y, r] = it.o; s += `<circle cx="${X(x)}" cy="${Y(y)}" r="${+(r * sc).toFixed(1)}" ${st(it.c, it.hi)}/>`; if (it.t != null) s += b3T(X(x), Y(y), it.t, 'tx', it.ts || 15); }
    if (it.sec) { const [x, y, r, a0, a1] = it.sec, A = a => [X(x + r * Math.cos(a * Math.PI / 180)), Y(y + r * Math.sin(a * Math.PI / 180))], p0 = A(a0), p1 = A(a1); s += `<path d="M${X(x)} ${Y(y)} L${p0[0]} ${p0[1]} A${+(r * sc).toFixed(1)} ${+(r * sc).toFixed(1)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1[0]} ${p1[1]} Z" ${st(it.c, it.hi)}/>`; if (it.t != null) { const am = (a0 + a1) / 2 * Math.PI / 180; s += b3T(X(x + r * .55 * Math.cos(am)), Y(y + r * .55 * Math.sin(am)), it.t, 'tx', 15); } }
    if (it.l) s += `<line x1="${X(it.l[0][0])}" y1="${Y(it.l[0][1])}" x2="${X(it.l[1][0])}" y2="${Y(it.l[1][1])}" style="stroke:var(--${it.c || 'pk'})" stroke-width="2.5"${it.dash ? ' stroke-dasharray="6 4"' : ''}/>`;
    if (it.tx) { const [x, y, t, c, a] = it.tx; s += b3T(X(x), Y(y), t, c || 'tx', it.ts || 15, a || 'middle'); }
  });
  return b3Svg(s, o.label || 'Bentangan', W, H);
}

/* ---------- bentangan kubus: lipatan (gulingkan kubus) ---------- */
const b3Roll = (o, d) => d === 'e' ? { b: o.e, e: o.t, t: o.w, w: o.b, n: o.n, s: o.s } : d === 'w' ? { b: o.w, w: o.t, t: o.e, e: o.b, n: o.n, s: o.s } : d === 'n' ? { b: o.n, n: o.t, t: o.s, s: o.b, e: o.e, w: o.w } : { b: o.s, s: o.t, t: o.n, n: o.b, e: o.e, w: o.w };
// muka kubus bagi setiap petak (0/1, 2/3, 4/5 bertentangan)
function b3Fold(cells) {
  const key = (x, y) => x + ',' + y, idx = new Map(cells.map((c, i) => [key(c[0], c[1]), i])), face = cells.map(() => -1);
  face[0] = 0; const st = [[0, { b: 0, t: 1, n: 2, s: 3, e: 4, w: 5 }]];
  while (st.length) {
    const [i, o] = st.pop(), [x, y] = cells[i];
    for (const [dx, dy, d] of [[1, 0, 'e'], [-1, 0, 'w'], [0, -1, 'n'], [0, 1, 's']]) { const j = idx.get(key(x + dx, y + dy)); if (j == null || face[j] >= 0) continue; const no = b3Roll(o, d); face[j] = no.b; st.push([j, no]); }
  }
  return face;
}
const b3NetOK = cells => new Set(b3Fold(cells)).size === 6;
const b3Norm = cells => { const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1])); return cells.map(([x, y]) => [x - mx, y - my]); };
function b3Hexo(r) {
  const cells = [[0, 0]], has = new Set(['0,0']);
  while (cells.length < 6) { const [x, y] = r.p(cells), [dx, dy] = r.p([[1, 0], [-1, 0], [0, 1], [0, -1]]), k = (x + dx) + ',' + (y + dy); if (!has.has(k)) { has.add(k); cells.push([x + dx, y + dy]); } }
  return b3Norm(cells);
}
const b3Sz = c => [Math.max(...c.map(p => p[0])) + 1, Math.max(...c.map(p => p[1])) + 1];
const b3Has22 = c => { const s = new Set(c.map(p => p.join(','))); return c.some(([x, y]) => s.has((x + 1) + ',' + y) && s.has(x + ',' + (y + 1)) && s.has((x + 1) + ',' + (y + 1))); };
function b3CubeNet(r, valid) {
  for (let t = 0; t < 600; t++) {
    const c = b3Hexo(r), [w, h] = b3Sz(c);
    if (w > 5 || h > 4 || b3NetOK(c) !== valid) continue;
    if (!valid && b3Has22(c) && r.f() < .75) continue;
    return c;
  }
  return valid ? [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] : [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]];
}
const b3CellFig = (cells, labs, o = {}) => b3Flat(cells.map(([x, y], i) => ({ p: [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]], c: o.c || 'tr', t: labs ? labs[i] : null, hi: o.hi === i })), { label: o.label || 'Bentangan kubus', pad: 24 });

/* ---------- bentangan lain ---------- */
// kuboid: p (panjang), l (lebar), t (tinggi) dalam unit; susunan salib
function b3CuboidNet(p, l, t, o = {}) {
  const R = (x, y, w, h, tt) => ({ p: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], c: o.c || 'tr', t: tt });
  const it = [R(0, l, l, t), R(l, l, p, t), R(l + p, l, l, t), R(2 * l + p, l, p, t), R(l, 0, p, l), R(l, l + t, p, l)];
  (o.extra || []).forEach(e => it.push(e));
  if (o.grid) it.forEach(i => { if (i.p) i.p = i.p.map(([x, y]) => [x + o.off[0], y + o.off[1]]); });
  return it;
}
// prisma segi tiga sama sisi: 3 segi empat tepat (lebar a, tinggi L) + 2 segi tiga pada [rect, atas?]
function b3TriPrismNet(tris, c = 'tr') {
  const a = 1, L = 1.7, h = Math.sqrt(3) / 2, it = [0, 1, 2].map(i => ({ p: [[i * a, 0], [(i + 1) * a, 0], [(i + 1) * a, L], [i * a, L]], c }));
  tris.forEach(([i, top]) => it.push({ p: top ? [[i * a, 0], [(i + 1) * a, 0], [(i + .5) * a, -h]] : [[i * a, L], [(i + 1) * a, L], [(i + .5) * a, L + h]], c: 'pa' }));
  return b3Flat(it, { label: 'Bentangan', pad: 26 });
}
function b3PyrNet(sides, c = 'tr') {
  const s = 1, h = 1.05, it = [{ p: [[0, 0], [s, 0], [s, s], [0, s]], c }];
  const T = { u: [[0, 0], [s, 0], [s / 2, -h]], d: [[0, s], [s, s], [s / 2, s + h]], l: [[0, 0], [0, s], [-h, s / 2]], r: [[s, 0], [s, s], [s + h, s / 2]] };
  sides.forEach(k => it.push({ p: T[k], c: 'pa' }));
  return b3Flat(it, { label: 'Bentangan', pad: 26 });
}
function b3TetraNet() {
  const h = Math.sqrt(3) / 2, A = [0, 2 * h], B = [2, 2 * h], C = [1, 0], ab = [1, 2 * h], bc = [1.5, h], ca = [.5, h];
  return b3Flat([{ p: [A, ab, ca], c: 'pa' }, { p: [ab, B, bc], c: 'pa' }, { p: [ca, bc, C], c: 'pa' }, { p: [ab, bc, ca], c: 'tr' }], { label: 'Bentangan', pad: 30 });
}
// silinder: segi empat tepat + 2 bulatan; pos: [[x (0–1), atas?]...]
function b3CylNet(pos, o = {}) {
  const w = 3.2, h = 1.5, r = .5, it = [{ p: [[0, 0], [w, 0], [w, h], [0, h]], c: 'tr' }];
  pos.forEach(([fx, top]) => it.push({ o: [fx * w, top ? -r : h + r, r], c: 'pa' }));
  if (o.tw) it.push({ l: [[0, h * .72], [w, h * .72]], c: 'pk', dash: true }, { tx: [w / 2, h * .45, `panjang = ${o.tw}`, 'pk'] });
  if (o.th) it.push({ tx: [-.12, h / 2, o.th, 'gr', 'end'] });
  if (o.tr) it.push({ tx: [pos[0][0] * w + r + .12, pos[0][1] ? -r : h + r, o.tr, 'pk', 'start'] });
  return b3Flat(it, { label: 'Bentangan silinder', pad: 44 });
}
function b3ConeNet(theta, o = {}) {
  const R = 1.6, a0 = 90 - theta / 2, a1 = 90 + theta / 2, rr = R * theta / 360, it = [{ sec: [0, 0, R, a0, a1], c: 'tr', t: o.ts }, { o: [0, R + rr, rr], c: 'pa', t: o.tc }];
  if (o.tl) it.push({ tx: [R * Math.cos(a0 * Math.PI / 180) / 2 + .15, R * Math.sin(a0 * Math.PI / 180) / 2 - .3, o.tl, 'am', 'start'] });
  return b3Flat(it, { label: 'Bentangan kon', pad: 26 });
}

/* ---------- rajah mengikut jenis pepejal ---------- */
function b3Fig(k, o = {}) {
  const c = o.c || 'tr';
  if (k === 'kubus') return b3Solid(Object.assign({ c, label: 'Kubus' }, b3Box(2, 2, 2), o.s ? { lab: [[0, 1, o.s]] } : {}));
  if (k === 'kuboid') { const [p, l, t] = o.dims ? b3vis(o.dims) : [1, .62, .5]; return b3Solid(Object.assign({ c, label: 'Kuboid' }, b3Box(p * 2.4, l * 2.4, t * 2.4), o.dims && o.lab !== false ? { lab: [[0, 1, `${o.dims[0]} cm`], [1, 2, `${o.dims[1]} cm`], [2, 6, `${o.dims[2]} cm`]] } : {})); }
  if (k === 'prisma3') return b3Solid(Object.assign({ c, label: 'Prisma segi tiga', hl: o.hl ? [0] : [] }, b3PrLie([[0, 0], [1.6, 0], [.8, 1.3]], 2.4)));
  if (k === 'prisma5' || k === 'prisma6') { const n = k === 'prisma5' ? 5 : 6, pr = b3PrUp(b3Reg(n, 1.1).map(([x, y]) => [x * Math.cos(.35) - y * Math.sin(.35), x * Math.sin(.35) + y * Math.cos(.35)]), 2); return b3Solid(Object.assign({ c, label: B3S[k].nm, hl: o.hl ? [1] : [] }, pr)); }
  if (k === 'piramid4') return b3Solid(Object.assign({ c, label: 'Piramid' }, b3Pyr([[0, 0], [2, 0], [2, 2], [0, 2]], [1, 1, 2.2])));
  if (k === 'piramid3') return b3Solid(Object.assign({ c, label: 'Piramid' }, b3Pyr([[0, 0], [2.2, .3], [.8, 1.9]], [1, .75, 2])));
  if (k === 'piramid5') return b3Solid(Object.assign({ c, label: 'Piramid' }, b3Pyr(b3Reg(5, 1.2), [0, 0, 2.2])));
  if (k === 'silinder') return b3Round([{ k: 'cyl', r: 1, h: 1.9 }], { c: 'pu', label: 'Silinder' });
  if (k === 'kon') return b3Round([{ k: 'cone', r: 1, h: 2 }], { c: 'pu', label: 'Kon' });
  return b3Round([{ k: 'sph', r: 1 }], { c: 'pu', label: 'Sfera' });
}
// rajah berlabel bagi luas permukaan / isi padu
const B3F = {
  kubus: s => { const t = typeof s === 'number' ? `${s} cm` : s; return b3Solid(Object.assign({ c: 'pa', label: 'Kubus', lab: [[0, 1, t], [1, 2, t], [2, 6, t]] }, b3Box(2, 2, 2))); },
  kuboid: (p, l, t) => b3Fig('kuboid', { dims: [p, l, t], c: 'pa' }),
  // prisma keratan rentas segi tiga bersudut tegak: kaki a (mengufuk), b (tegak), hipotenus c, panjang L
  prismaT: (a, b, c, L) => { const [va, vb, vL] = b3vis([a, b, L]).map(x => x * 2.6); return b3Solid(Object.assign({ c: 'pa', label: 'Prisma segi tiga', hl: [0], lab: [[0, 1, `${a} cm`], [0, 2, `${b} cm`]].concat(c ? [[1, 2, `${c} cm`, 'tx', [1, -1.2]]] : []).concat([[1, 4, `${L} cm`]]) }, b3PrLie([[0, 0], [va, 0], [0, vb]], vL))); },
  // prisma trapezium sama kaki: sisi selari a (bawah), b (atas), tinggi h, panjang L
  prismaTrap: (a, b, h, L) => { const [va, vb, vh, vL] = b3vis([a, b, h, L]).map(x => x * 2.6), d = (va - vb) / 2; return b3Solid(Object.assign({ c: 'pa', label: 'Prisma trapezium', hl: [0], lab: [[0, 1, `${a} cm`], [2, 3, `${b} cm`, 'tx', [-.3, -1]], [2, 6, `${L} cm`]], ex: [{ a: [d, 0, 0], b: [d, 0, vh], t: `${h} cm`, dx: 6, c: 'gr' }] }, b3PrLie([[0, 0], [va, 0], [va - d, vh], [d, vh]], vL))); },
  prismaA: (A, L, n) => { const pr = b3PrLie(n === 5 ? [[0, 0], [1.8, 0], [2.2, 1.1], [.9, 1.9], [-.4, 1.1]] : [[0, 0], [2, 0], [2, 1.2], [1, 1.9], [0, 1.2]], 2.6); return b3Solid(Object.assign({ c: 'pa', label: 'Prisma', hl: [0], flab: [[0, `${A} cm²`]], lab: [[1, pr.V.length / 2 + 1, `${L} cm`]] }, pr)); },
  piramid: (s, hs, H, Hl) => {
    const l2 = 0, sl = s, [vs, vl, vH] = b3vis([s, sl, H || hs]).map(x => x * 2.4), ap = [vs / 2, vl / 2, vH], ex = [];
    if (hs) ex.push({ a: ap, b: [vs / 2, 0, 0], t: `${hs} cm`, c: 'am', dx: 7, at: .45 });
    if (H) ex.push({ a: ap, b: [vs / 2, vl / 2, 0], t: Hl || `${H} cm`, c: 'gr', dx: 7, at: .5 });
    return b3Solid(Object.assign({ c: 'pa', label: 'Piramid', lab: [[0, 1, `${s} cm`]].concat(l2 ? [[1, 2, `${l2} cm`]] : []), ex }, b3Pyr([[0, 0], [vs, 0], [vs, vl], [0, vl]], ap)));
  },
  silinder: (j, t) => { const [vr, vh] = b3vis([j, t]); return b3Round([{ k: 'cyl', r: vr, h: Math.max(.7, vh * 2), lr: `${b3n(j)} cm`, lh: `${b3n(t)} cm` }], { c: 'pu', label: 'Silinder' }); },
  kon: (j, s, t) => { const [vr, vh] = b3vis([j, t || s]); return b3Round([{ k: 'cone', r: vr, h: Math.max(.9, vh * 2), lr: `${b3n(j)} cm`, ls: s ? `${b3n(s)} cm` : '', lh: t ? `${b3n(t)} cm` : '' }], { c: 'pu', label: 'Kon' }); },
  sfera: j => b3Round([{ k: 'sph', r: 1, lr: typeof j === 'number' ? `${b3n(j)} cm` : j }], { c: 'pu', label: 'Sfera' })
};

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 6.1 Sifat Geometri ---------- */
  namaBentuk: [
    () => ({ q: 'Namakan bentuk 3D dalam rajah di bawah.' }),
    () => ({ q: 'Apakah nama pepejal geometri yang ditunjukkan dalam rajah di bawah?' }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah model pepejal. Kenal pasti bentuk 3D itu.' }),
    ({ k, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata bentuk 3D dalam rajah di bawah ialah ${B3CONF[k]}. Adakah ${N} betul?` }, salah(N, ans, B3WHY[k])); }
  ],
  kiraFEV: [
    ({ what, nm }) => ({ q: `Berapakah bilangan ${what} bagi ${nm} dalam rajah di bawah?` }),
    ({ what, nm }) => ({ q: `Nyatakan bilangan ${what} sebuah ${nm}.` }),
    ({ what }) => ({ q: `Kira bilangan ${what} pepejal dalam rajah di bawah. (Garis putus-putus mewakili tepi yang tersembunyi.)` }),
    ({ what, nm, ans, claim }) => { const N = vnama(); return Object.assign({ q: `${N} mengira bilangan ${what} ${nm} dalam rajah di bawah dan mendapat ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa ${what} yang tersembunyi di belakang (garis putus-putus).`)); }
  ],
  ciri: [
    ({ attr, nm }) => ({ q: `Berapakah bilangan ${attr} bagi sebuah ${nm}?` }),
    ({ attr, nm }) => ({ q: `Nyatakan bilangan ${attr} yang terdapat pada ${nm} dalam rajah di bawah.` }),
    ({ attr, nm, obj }) => ({ q: `${vcap(obj)} berbentuk ${nm}. Berapakah bilangan ${attr} objek itu?` }),
    ({ attr, nm, ans, claim }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sebuah ${nm} mempunyai ${claim} ${attr}. Adakah ${N} betul?` }, salah(N, ans, `Bilangan ${attr} bagi ${nm} ialah ${ans}.`)); }
  ],
  ciriNama: [
    ({ d }) => ({ q: `Namakan bentuk 3D yang mempunyai ${d}.` }),
    ({ d }) => ({ q: `Saya ialah sebuah pepejal. Saya mempunyai ${d}. Siapakah saya?` }),
    ({ d }) => ({ q: `Sebuah pepejal mempunyai ${d}. Apakah nama pepejal itu?` })
  ],
  keratan: [
    ({ P }) => ({ q: `Keratan rentas seragam sebuah prisma berbentuk ${P}. Namakan prisma itu.` }),
    ({ nm }) => ({ q: `Apakah bentuk keratan rentas seragam bagi sebuah ${nm}?` }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah prisma. Muka berlorek ialah keratan rentas seragamnya. Namakan prisma itu.' }),
    ({ P, nm }) => ({ q: `Sebatang coklat berbentuk prisma dipotong selari dengan tapaknya. Setiap keratan berbentuk ${P}. Namakan bentuk coklat itu.`, ans: vcap(nm) })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  nGon: [
    ({ nm }) => ({ q: `Sebuah ${nm} mempunyai berapa muka, tepi dan bucu?` }),
    ({ type, P }) => ({ q: `Tapak sebuah ${type} berbentuk ${P}. Nyatakan bilangan muka, tepi dan bucunya.` }),
    ({ nm }) => ({ q: `Lengkapkan: Sebuah ${nm} mempunyai ___ muka, ___ tepi dan ___ bucu.` }),
    ({ nm, n, type }) => ({ q: `Tanpa melukis, tentukan bilangan muka, tepi dan bucu bagi sebuah ${nm}. (Petunjuk: tapaknya mempunyai ${n} sisi; ${type === 'prisma' ? 'prisma mempunyai 2 tapak' : 'piramid mempunyai 1 tapak dan 1 puncak'}.)` })
  ],
  dariFEV: [
    ({ F, E, V }) => ({ q: `Sebuah pepejal mempunyai ${F} muka, ${E} tepi dan ${V} bucu. Namakan pepejal itu.` }),
    ({ F, E, V }) => ({ q: `Saya mempunyai ${V} bucu, ${E} tepi dan ${F} muka. Semua muka saya rata. Siapakah saya?` }),
    ({ F, E, V, type }) => ({ q: `Sebuah ${type} mempunyai ${F} muka, ${E} tepi dan ${V} bucu. Apakah bentuk tapaknya?` })
  ],
  euler: [
    ({ nm }) => ({ q: `Bagi sebuah ${nm}, sahkan rumus Euler F + V − E = 2, dengan F = bilangan muka, V = bilangan bucu dan E = bilangan tepi.` }),
    ({ V, E }) => ({ q: `Sebuah polihedron mempunyai ${V} bucu dan ${E} tepi. Guna rumus Euler F + V − E = 2 untuk mencari bilangan mukanya.` }),
    ({ F, E }) => ({ q: `Sebuah polihedron mempunyai ${F} muka dan ${E} tepi. Dengan rumus Euler F + V − E = 2, hitung bilangan bucunya.` })
  ],
  k61: [
    ({ g }) => ({ q: `Sebuah piramid tapak ${g.P} dicantumkan di atas sebuah prisma ${g.P} supaya tapaknya bertindih tepat dengan tapak atas prisma itu. Hitung bilangan muka, tepi dan bucu pepejal gabungan itu.`, ans: `${g.F} muka, ${g.E} tepi, ${g.V} bucu`, work: [`Prisma ${g.P}: ${g.n + 2} muka, ${3 * g.n} tepi, ${2 * g.n} bucu. Piramid: ${g.n + 1} muka, ${2 * g.n} tepi, ${g.n + 1} bucu.`, `Dua tapak yang bercantum hilang (bukan lagi muka luar): muka = ${g.n + 2} + ${g.n + 1} − 2 = ${g.F}`, `Tepi tapak dikongsi: tepi = ${3 * g.n} + ${2 * g.n} − ${g.n} = ${g.E}`, `Bucu tapak dikongsi: bucu = ${2 * g.n} + ${g.n + 1} − ${g.n} = ${g.V}`] }),
    ({ e }) => ({ q: `Sebuah prisma mempunyai ${e.E} tepi. (a) Namakan prisma itu. (b) Berapakah bilangan muka dan bucunya?`, ans: `(a) Prisma ${e.P} (b) ${e.n + 2} muka, ${2 * e.n} bucu`, work: ['Prisma bertapak n sisi mempunyai 3n tepi.', `3n = ${e.E}, maka n = ${e.n}: tapaknya ${e.P}.`, `Muka = n + 2 = ${e.n + 2}; bucu = 2n = ${2 * e.n}`] }),
    ({ d }) => ({ q: `Dua piramid tapak ${d.P} yang serupa dicantumkan tapak dengan tapak. Hitung bilangan muka, tepi dan bucu pepejal yang terbentuk.`, ans: `${2 * d.n} muka, ${3 * d.n} tepi, ${d.n + 2} bucu`, work: [`Setiap piramid: ${d.n} muka sisi, ${d.n} tepi tapak, ${d.n} tepi sisi, ${d.n} bucu tapak + 1 puncak.`, `Muka: tapak tersembunyi, tinggal ${d.n} + ${d.n} = ${2 * d.n} muka segi tiga`, `Tepi: ${d.n} tepi tapak (dikongsi) + ${d.n} + ${d.n} tepi sisi = ${3 * d.n}`, `Bucu: ${d.n} bucu tapak (dikongsi) + 2 puncak = ${d.n + 2}`] }),
    ({ s }) => ({ q: `Jumlah bilangan muka, tepi dan bucu sebuah prisma ialah ${s.S}. Namakan prisma itu.`, ans: `Prisma ${s.P}`, work: ['Prisma bertapak n sisi: muka = n + 2, tepi = 3n, bucu = 2n.', `Jumlah = (n + 2) + 3n + 2n = 6n + 2`, `6n + 2 = ${s.S} → 6n = ${s.S - 2} → n = ${s.n}`, `Tapak mempunyai ${s.n} sisi, maka prisma ${s.P}.`] })
  ],

  /* ---------- 6.2 Bentangan ---------- */
  netNama: [
    () => ({ q: 'Rajah di bawah menunjukkan sebuah bentangan. Namakan pepejal yang terbentuk apabila bentangan itu dilipat.' }),
    () => ({ q: 'Bentangan dalam rajah di bawah akan membentuk pepejal apa?' }),
    () => ({ q: 'Sekeping kadbod dipotong mengikut bentangan di bawah lalu dilipat. Apakah bentuk 3D yang terhasil?' }),
    ({ ans, claim, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata bentangan di bawah membentuk ${claim}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  netKubus: [
    () => ({ q: 'Adakah bentangan di bawah boleh membentuk sebuah kubus? Berikan sebab.' }),
    () => ({ q: 'Enam segi empat sama disusun seperti rajah di bawah. Bolehkah susunan ini dilipat menjadi kubus?' }),
    () => { const N = vnama(); return { q: `${N} memotong bentangan di bawah daripada sekeping kadbod. Bolehkah ${N} melipatnya menjadi sebuah kotak berbentuk kubus yang tertutup?` }; }
  ],
  netLain: [
    ({ nm }) => ({ q: `Adakah rajah di bawah ialah bentangan sebuah ${nm}? Berikan sebab.` }),
    ({ nm }) => ({ q: `Bolehkah bentangan di bawah dilipat menjadi sebuah ${nm} yang tertutup?` }),
    ({ nm }) => { const N = vnama(); return { q: `${N} melukis rajah di bawah sebagai bentangan sebuah ${nm}. Adakah bentangan itu boleh membentuk ${nm}?` }; }
  ],
  lukis: [
    ({ desc }) => ({ q: `Lukis bentangan bagi ${desc} pada grid segi empat sama bersisi 1 unit di bawah.` }),
    ({ desc }) => ({ q: `Pada grid di bawah, lukis satu bentangan yang boleh dilipat menjadi ${desc}.` }),
    ({ desc }) => ({ q: `Sebuah kotak berbentuk ${desc.replace('sebuah ', '')} hendak dibuat daripada kadbod. Lukis bentangan kotak itu pada grid di bawah.` })
  ],
  netBertentang: [
    ({ X }) => ({ q: `Bentangan di bawah dilipat menjadi sebuah kubus. Muka manakah yang bertentangan dengan muka ${X}?` }),
    ({ X }) => ({ q: `Apabila bentangan kubus di bawah dilipat, muka ${X} menjadi tapak. Muka manakah yang menjadi penutup atas?` }),
    ({ X, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata muka ${claim} bertentangan dengan muka ${X} apabila bentangan di bawah dilipat menjadi kubus. Adakah ${N} betul?` }, salah(N, ans, `Muka ${claim} bersebelahan dengan muka ${X} (berkongsi satu tepi), jadi tidak bertentangan.`)); }
  ],
  netSilP: [
    ({ j, t, pi }) => ({ q: `Rajah di bawah menunjukkan bentangan sebuah silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm. Hitung panjang segi empat tepat dalam bentangan itu.${b3PiTx(pi)}` }),
    ({ j, pi }) => ({ q: `Sebuah tin silinder berjejari ${b3n(j)} cm. Label kertas segi empat tepat dibalut tepat sekali di sekeliling tin itu. Berapakah panjang label itu?${b3PiTx(pi)}` }),
    ({ j, pi }) => ({ q: `Lengkapkan: Panjang segi empat tepat dalam bentangan silinder berjejari ${b3n(j)} cm = 2πj = 2 × 22/7 × ${b3n(j)} = ___ cm` }),
    ({ j, t, pi }) => ({ q: `Bentangan sebuah silinder berjejari ${b3n(j)} cm terdiri daripada 2 bulatan dan sebuah segi empat tepat selebar ${t} cm. Cari panjang segi empat tepat itu.${b3PiTx(pi)}` })
  ],
  netSilJ: [
    ({ L, pi }) => ({ q: `Panjang segi empat tepat dalam bentangan sebuah silinder ialah ${b3n(L)} cm. Cari jejari tapak silinder itu.${b3PiTx(pi)}` }),
    ({ L, pi }) => ({ q: `Sekeping kertas segi empat tepat sepanjang ${b3n(L)} cm digulung tepat menjadi permukaan melengkung sebuah silinder. Hitung jejari silinder itu.${b3PiTx(pi)}` }),
    ({ L, pi }) => ({ q: `Label sebuah tin silinder sepanjang ${b3n(L)} cm membalut tepat sekali di sekeliling tin itu. Berapakah jejari tin itu?${b3PiTx(pi)}` })
  ],
  netKuboid: [
    ({ p, t, tot }) => ({ q: `Rajah di bawah menunjukkan bentangan sebuah kuboid. Panjang jalur mengufuk ialah ${tot} cm. Cari nilai x.` }),
    () => ({ q: 'Berdasarkan ukuran dalam bentangan di bawah, cari nilai x.' }),
    ({ tot }) => { const N = vnama(); return { q: `${N} memotong bentangan kuboid di bawah. Jalur empat segi empat tepat yang bersambung panjangnya ${tot} cm. Hitung x.` }; }
  ],
  k62: [
    ({ dc }) => ({ q: 'Rajah di bawah menunjukkan bentangan sebuah dadu. Jumlah nombor pada setiap pasang muka yang bertentangan ialah 7. Cari nilai x dan y.', ans: `x = ${dc.x}, y = ${dc.y}`, work: [`Muka x bertentangan dengan muka ${dc.ox}, maka x = 7 − ${dc.ox} = ${dc.x}.`, `Muka y bertentangan dengan muka ${dc.oy}, maka y = 7 − ${dc.oy} = ${dc.y}.`] }),
    ({ kn }) => ({ q: `Bentangan sebuah kon terdiri daripada sebuah sektor dan sebuah bulatan. Jejari tapak kon ialah ${kn.j} cm dan tinggi sendengnya ${kn.s} cm. Hitung sudut sektor itu.`, ans: `${kn.th}°`, work: ['Panjang lengkok sektor = lilitan tapak kon', `(θ/360°) × 2π(${kn.s}) = 2π(${kn.j})`, `θ = 360° × ${kn.j}/${kn.s} = ${kn.th}°`] }),
    ({ kn }) => ({ q: `Sebuah sektor bulatan berjejari ${kn.s} cm dengan sudut ${kn.th}° digulung menjadi permukaan melengkung sebuah kon. Hitung jejari tapak kon itu.`, ans: `${kn.j} cm`, work: ['Panjang lengkok sektor = lilitan tapak kon', `(${kn.th}/360) × 2π(${kn.s}) = 2πj`, `j = ${kn.th} × ${kn.s} ÷ 360 = ${kn.j} cm`] }),
    ({ kb }) => ({ q: `Bentangan kuboid berukuran ${kb.p} cm × ${kb.l} cm × ${kb.t} cm seperti dalam rajah dipotong daripada sekeping kadbod segi empat tepat yang paling kecil. (a) Nyatakan ukuran kadbod itu. (b) Hitung luas kadbod yang terbuang.`, ans: `(a) ${kb.W} cm × ${kb.H} cm (b) ${kb.waste} cm²`, work: [`Lebar kadbod = ${kb.l} + ${kb.p} + ${kb.l} + ${kb.p} = ${kb.W} cm; tinggi = ${kb.l} + ${kb.t} + ${kb.l} = ${kb.H} cm`, `Luas kadbod = ${kb.W} × ${kb.H} = ${kb.W * kb.H} cm²`, `Luas bentangan = 2(${kb.p}×${kb.l} + ${kb.p}×${kb.t} + ${kb.l}×${kb.t}) = ${kb.A} cm²`, `Terbuang = ${kb.W * kb.H} − ${kb.A} = ${kb.waste} cm²`] })
  ],

  /* ---------- 6.3 Luas Permukaan & 6.4 Isi Padu ---------- */
  lp: [
    ({ desc, pt }) => ({ q: `Hitung luas permukaan ${desc}.${pt}` }),
    ({ desc, pt }) => ({ q: `${vcap(desc)}. Berapakah jumlah luas permukaannya?${pt}` }),
    ({ desc, nm, pt }) => ({ q: `Rajah di bawah menunjukkan ${desc}. Cari luas permukaan ${nm} itu.${pt}` }),
    ({ desc, pt, wrong, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira luas permukaan ${desc} dan mendapat ${wrong}. Adakah ${N} betul?${pt}` }, salah(N, ans, why.replace('N', N))); },
    ({ ctx, desc, pt }) => ({ q: (ctx || `Cari jumlah luas permukaan ${desc}.`) + pt })
  ],
  lpR: [
    ({ nm, pt }) => ({ q: `Hitung luas permukaan ${nm} dalam rajah di bawah.${pt}` }),
    ({ nm, pt }) => ({ q: `Berdasarkan ukuran pada rajah di bawah, cari jumlah luas permukaan ${nm} itu.${pt}` }),
    ({ nm, pt }) => ({ q: `Rajah di bawah menunjukkan sebuah ${nm} pepejal. Berapakah luas permukaannya?${pt}` })
  ],
  lpCari: [
    ({ A, nm, what, given, pt }) => ({ q: `Luas permukaan sebuah ${nm}${given} ialah ${A} cm². Cari ${what}.${pt}` }),
    ({ A, nm, what, given, pt }) => ({ q: `Diberi jumlah luas permukaan sebuah ${nm}${given} ialah ${A} cm². Hitung ${what}.${pt}` }),
    ({ A, nm, what, given, pt }) => { const N = vnama(); return { q: `${N} membina sebuah ${nm}${given} daripada ${A} cm² kadbod tanpa lebihan. Berapakah ${what}?${pt}` }; },
    ({ A, nm, what, given, pt }) => ({ q: `Sebuah ${nm}${given} mempunyai luas permukaan ${A} cm². Tentukan ${what}.${pt}` })
  ],
  lpPyth: [
    ({ desc, pt }) => ({ q: `Hitung luas permukaan ${desc}.${pt}` }),
    ({ desc, pt, hint }) => ({ q: `${vcap(desc)}. Cari jumlah luas permukaannya. (${hint})${pt}` }),
    ({ desc, pt }) => ({ q: `Rajah di bawah menunjukkan ${desc}. Berapakah luas permukaan pepejal itu?${pt}` })
  ],
  lpBuka: [
    ({ desc, pt }) => ({ q: `Hitung luas permukaan luar ${desc}.${pt}` }),
    ({ desc, pt, use }) => ({ q: `${vcap(desc)} digunakan sebagai ${use}. Berapakah luas bahan yang diperlukan untuk membuatnya?${pt}` }),
    ({ desc, pt }) => ({ q: `Cari jumlah luas permukaan ${desc}. Ingat: bahagian atasnya terbuka.${pt}` })
  ],
  k63: [
    ({ cp }) => ({ q: `Sebuah kapsul terdiri daripada sebuah silinder berjejari ${b3n(cp.j)} cm dan panjang ${cp.t} cm dengan sebuah hemisfera pada setiap hujungnya. Hitung luas permukaan kapsul itu.${b3PiTx(cp.pi)}`, ans: b3u(cp.A, 'cm²'), work: ['Luas = luas permukaan melengkung silinder + 2 × luas permukaan melengkung hemisfera', `= 2πjt + 2 × 2πj² = 2πjt + 4πj²`, `= 2 × ${cp.pi.t} × ${b3n(cp.j)} × ${cp.t} + 4 × ${cp.pi.t} × ${b3n(cp.j)}²`, b3xs([cp.a1, cp.a2]), `${b3eq(cp.A, 'cm²')}`] }),
    ({ rk }) => ({ q: `Sebuah model roket terdiri daripada sebuah kon di atas sebuah silinder. Kedua-duanya berjejari ${b3n(rk.j)} cm. Tinggi silinder ialah ${rk.t} cm dan tinggi sendeng kon ialah ${rk.s} cm. Tapak silinder tertutup. Hitung luas permukaan model itu.${b3PiTx(rk.pi)}`, ans: b3u(rk.A, 'cm²'), work: ['Luas = tapak bulatan + permukaan melengkung silinder + permukaan melengkung kon', '= πj² + 2πjt + πjs', `= ${rk.pi.t} × ${b3n(rk.j)}² + 2 × ${rk.pi.t} × ${b3n(rk.j)} × ${rk.t} + ${rk.pi.t} × ${b3n(rk.j)} × ${rk.s}`, b3xs([rk.a1, rk.a2, rk.a3]), `${b3eq(rk.A, 'cm²')}`] }),
    ({ hm }) => ({ q: `Sebuah hemisfera pepejal mempunyai jejari ${b3n(hm.j)} cm. Hitung jumlah luas permukaannya.${b3PiTx(hm.pi)}`, ans: b3u(hm.A, 'cm²'), work: ['Luas = permukaan melengkung (separuh sfera) + tapak bulatan', '= ½ × 4πj² + πj² = 3πj²', `= 3 × ${hm.pi.t} × ${b3n(hm.j)}²`, `${b3eq(hm.A, 'cm²')}`] }),
    ({ ct }) => ({ q: `Sebuah tangki air berbentuk kuboid tanpa penutup berukuran ${ct.p} m × ${ct.l} m × ${ct.t} m. Bahagian luar tangki itu (termasuk tapak) akan dicat dengan kos RM${ct.rate} bagi setiap meter persegi. Hitung kos mengecat tangki itu.`, ans: `RM${ct.cost.toFixed(2)}`, work: ['Luas = tapak + 4 muka sisi (tiada penutup)', `= ${ct.p} × ${ct.l} + 2(${ct.p} × ${ct.t}) + 2(${ct.l} × ${ct.t})`, `= ${b3n(ct.p * ct.l)} + ${b3n(2 * ct.p * ct.t)} + ${b3n(2 * ct.l * ct.t)} = ${b3n(ct.A)} m²`, `Kos = ${b3n(ct.A)} × RM${ct.rate} = RM${ct.cost.toFixed(2)}`] }),
    ({ kv }) => ({ q: `Isi padu sebuah kubus ialah ${kv.V} cm³. Hitung luas permukaan kubus itu.`, ans: `${kv.A} cm²`, work: [`s³ = ${kv.V}, maka s = ∛${kv.V} = ${kv.s} cm`, 'Luas permukaan = 6s²', `= 6 × ${kv.s}² = ${kv.A} cm²`] })
  ],
  iv: [
    ({ desc, pt }) => ({ q: `Hitung isi padu ${desc}.${pt}` }),
    ({ desc, pt }) => ({ q: `${vcap(desc)}. Berapakah isi padunya?${pt}` }),
    ({ desc, nm, pt }) => ({ q: `Rajah di bawah menunjukkan ${desc}. Cari isi padu ${nm} itu.${pt}` }),
    ({ desc, pt, wrong, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira isi padu ${desc} dan mendapat ${wrong}. Adakah ${N} betul?${pt}` }, salah(N, ans, why.replace('N', N))); },
    ({ ctx, desc, pt }) => ({ q: (ctx || `Tentukan isi padu ${desc}.`) + pt })
  ],
  ivR: [
    ({ nm, pt }) => ({ q: `Hitung isi padu ${nm} dalam rajah di bawah.${pt}` }),
    ({ nm, pt }) => ({ q: `Berdasarkan ukuran pada rajah di bawah, cari isi padu ${nm} itu.${pt}` }),
    ({ nm, pt }) => ({ q: `Rajah di bawah menunjukkan sebuah ${nm}. Berapakah isi padunya?${pt}` })
  ],
  unit: [
    ({ v, from, to }) => ({ q: `Tukarkan ${v} ${from} kepada ${to}.` }),
    ({ v, from, to }) => ({ q: `Lengkapkan: ${v} ${from} = ___ ${to}` }),
    ({ v, from, to, obj }) => ({ q: `${vcap(obj)} mengandungi ${v} ${from} air. Nyatakan isi padu air itu dalam ${to}.` }),
    ({ v, from, to }) => ({ q: `Berapakah ${to} dalam ${v} ${from}?` })
  ],
  ivCari: [
    ({ V, nm, what, given, pt }) => ({ q: `Isi padu sebuah ${nm}${given} ialah ${V} cm³. Cari ${what}.${pt}` }),
    ({ V, nm, what, given, pt }) => ({ q: `Diberi isi padu sebuah ${nm}${given} ialah ${V} cm³. Hitung ${what}.${pt}` }),
    ({ V, nm, what, given, pt }) => ({ q: `Sebuah bekas berbentuk ${nm}${given} boleh diisi penuh dengan ${V} cm³ air. Berapakah ${what}?${pt}` }),
    ({ V, nm, what, given, pt }) => ({ q: `Sebuah ${nm}${given} mempunyai isi padu ${V} cm³. Tentukan ${what}.${pt}` })
  ],
  pindahA: [
    ({ p, l, t }) => ({ q: `Air yang memenuhi sebuah bekas kuboid berukuran ${p} cm × ${l} cm × ${t} cm dituang semuanya ke dalam sebuah bekas silinder kosong berjejari 7 cm. Hitung tinggi air dalam bekas silinder itu. (Guna π = 22/7.)` }),
    ({ p, l, t }) => ({ q: `Sebuah akuarium kuboid berukuran ${p} cm × ${l} cm × ${t} cm penuh dengan air. Semua air itu dipindahkan ke dalam sebuah balang silinder berjejari 7 cm. Berapakah tinggi air dalam balang itu? (Guna π = 22/7.)` }),
    ({ p, l, t }) => { const N = vnama(); return { q: `${N} menuang air dari sebuah kotak kuboid penuh berukuran ${p} cm × ${l} cm × ${t} cm ke dalam sebuah bekas silinder kosong berjejari 7 cm. Tiada air yang tumpah. Cari tinggi air dalam bekas silinder. (Guna π = 22/7.)` }; }
  ],
  pindahB: [
    ({ t, p, l }) => ({ q: `Sebuah bekas silinder berjejari 7 cm dan tinggi ${t} cm penuh dengan air. Semua air itu dituang ke dalam sebuah bekas kuboid kosong bertapak ${p} cm × ${l} cm. Berapakah kedalaman air dalam bekas kuboid itu? (Guna π = 22/7.)` }),
    ({ t, p, l }) => ({ q: `Air dalam sebuah tin silinder penuh berjejari 7 cm dan tinggi ${t} cm dipindahkan ke dalam sebuah bekas kuboid bertapak ${p} cm × ${l} cm. Hitung tinggi air dalam bekas kuboid itu. (Guna π = 22/7.)` }),
    ({ t, p, l }) => ({ q: `Sebuah balang silinder (jejari 7 cm, tinggi ${t} cm) diisi penuh dengan jus. Semua jus itu dituang ke dalam sebuah bekas kuboid bertapak ${p} cm × ${l} cm. Cari kedalaman jus dalam bekas kuboid. (Guna π = 22/7.)` })
  ],
  pindahC: [
    ({ j, t }) => ({ q: `Sebuah tong air berbentuk silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm. Berapakah kapasiti tong itu dalam liter? (Guna π = 22/7.)` }),
    ({ j, t }) => ({ q: `Hitung isi padu, dalam liter, sebuah tangki silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm. (Guna π = 22/7.)` }),
    ({ j, t }) => ({ q: `Berapa liter air diperlukan untuk memenuhkan sebuah bekas silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm? (Guna π = 22/7.)` })
  ],
  pindahD: [
    ({ p, l, t }) => ({ q: `Sebuah kolam ikan berbentuk kuboid berukuran ${p} m × ${l} m × ${t} m. Berapa liter air diperlukan untuk memenuhkan kolam itu?` }),
    ({ p, l, t }) => ({ q: `Hitung kapasiti, dalam liter, sebuah tangki kuboid berukuran ${p} m × ${l} m × ${t} m.` }),
    ({ p, l, t }) => ({ q: `Sebuah kolam renang kecil berbentuk kuboid berukuran ${p} m × ${l} m × ${t} m. Nyatakan isi padu kolam itu dalam liter.` })
  ],
  ivTrap: [
    ({ a, b, h, L }) => ({ q: `Rajah di bawah menunjukkan sebuah prisma dengan keratan rentas trapezium. Sisi selarinya ${a} cm dan ${b} cm, tinggi trapezium ${h} cm dan panjang prisma ${L} cm. Hitung isi padu prisma itu.` }),
    ({ a, b, h, L }) => ({ q: `Sebatang kayu berbentuk prisma mempunyai keratan rentas trapezium dengan sisi selari ${a} cm dan ${b} cm serta tinggi ${h} cm. Panjang kayu itu ${L} cm. Cari isi padunya.` }),
    () => ({ q: 'Hitung isi padu prisma dalam rajah di bawah.' }),
    ({ a, b, h, L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira isi padu prisma dalam rajah di bawah sebagai (${a} + ${b}) × ${h} × ${L} = ${wrong} cm³. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa ½ dalam rumus luas trapezium, ½ × (a + b) × t.`)); }
  ],
  k64: [
    ({ cp }) => ({ q: `Sebuah kapsul terdiri daripada sebuah silinder berjejari ${b3n(cp.j)} cm dan panjang ${cp.t} cm dengan sebuah hemisfera pada setiap hujungnya. Hitung isi padu kapsul itu.${b3PiTx(cp.pi)}`, ans: b3u(cp.V, 'cm³'), work: ['Isi padu = isi padu silinder + 2 hemisfera (= 1 sfera)', '= πj²t + 4/3 πj³', `= ${cp.pi.t} × ${b3n(cp.j)}² × ${cp.t} + 4/3 × ${cp.pi.t} × ${b3n(cp.j)}³`, b3xs([cp.v1, cp.v2]), b3eq(cp.V, 'cm³')] }),
    ({ ai }) => ({ q: `Sebuah aiskrim terdiri daripada sebuah kon berjejari ${b3n(ai.j)} cm dan tinggi ${ai.t} cm dengan sebuah hemisfera aiskrim berjejari sama di atasnya. Hitung isi padu aiskrim itu jika kon diisi penuh.${b3PiTx(ai.pi)}`, ans: b3u(ai.V, 'cm³'), work: ['Isi padu = isi padu kon + isi padu hemisfera', '= ⅓πj²t + ⅔πj³', `= ⅓ × ${ai.pi.t} × ${b3n(ai.j)}² × ${ai.t} + ⅔ × ${ai.pi.t} × ${b3n(ai.j)}³`, b3xs([ai.v1, ai.v2]), b3eq(ai.V, 'cm³')] }),
    ({ hb }) => ({ q: `Sebuah bongkah kayu berbentuk kuboid berukuran ${hb.p} cm × ${hb.l} cm × ${hb.t} cm. Sebuah lubang berbentuk silinder berjejari ${b3n(hb.j)} cm ditebuk tembus dari permukaan atas hingga ke tapak. Hitung isi padu kayu yang tinggal.${b3PiTx(hb.pi)}`, ans: b3u(hb.V, 'cm³'), work: [`Isi padu kuboid = ${hb.p} × ${hb.l} × ${hb.t} = ${hb.v1} cm³`, `Isi padu lubang = πj²t = ${hb.pi.t} × ${b3n(hb.j)}² × ${hb.t} = ${b3x(hb.v2)} cm³`, `Isi padu tinggal = ${hb.v1} − ${b3x(hb.v2)}`, b3eq(hb.V, 'cm³')] }),
    ({ lb }) => ({ q: `Sebuah sfera logam berjejari ${lb.R} cm dileburkan dan dibentuk semula menjadi beberapa biji sfera kecil yang sama saiz berjejari ${lb.r} cm. Berapakah bilangan sfera kecil yang dapat dibentuk?`, ans: `${lb.n} biji`, work: [`Isi padu sfera besar = 4/3 π(${lb.R})³`, `Isi padu sfera kecil = 4/3 π(${lb.r})³`, `Bilangan = (4/3 π × ${lb.R}³) ÷ (4/3 π × ${lb.r}³) = ${lb.R ** 3} ÷ ${lb.r ** 3}`, `= ${lb.n} biji`] }),
    ({ tk }) => ({ q: `Sebuah tangki berbentuk kuboid berukuran ${tk.p} cm × ${tk.l} cm × ${tk.t} cm kosong. Air dialirkan masuk pada kadar ${tk.rate} liter seminit. Berapa minitkah masa yang diambil untuk mengisi penuh tangki itu?`, ans: `${tk.min} minit`, work: [`Isi padu = ${tk.p} × ${tk.l} × ${tk.t} = ${b3n(tk.V)} cm³`, `= ${b3n(tk.V)} ÷ 1000 = ${b3n(tk.L)} liter`, `Masa = ${b3n(tk.L)} ÷ ${tk.rate} = ${tk.min} minit`] })
  ]
};

/* =================== pembina soalan (r = b3RG atau b3RW) =================== */
const B3 = {};
/* ---------- 6.1 ---------- */
B3.namaBentuk = (r, k) => {
  k = k || r.p(B3ALLK);
  return GEN_LQ('namaBentuk', { k, ans: vcap(B3S[k].nm), work: [`Bentuk ini mempunyai ${B3S[k].d}.`, `Maka bentuk ini ialah ${B3S[k].nm}.`] }, { fig: b3Fig(k) });
};
B3.kiraFEV = (r, i) => {
  const k = r.p(B3POLYK), what = ['muka', 'tepi', 'bucu'][i == null ? r.i(0, 2) : i % 3], s = B3S[k], ans = { muka: s.F, tepi: s.E, bucu: s.V }[what];
  const claim = ans - (what === 'muka' ? 1 : what === 'tepi' ? (s.py ? 1 : 3) : 1);
  return GEN_LQ('kiraFEV', { what, nm: s.nm, ans: String(ans), claim, work: b3FEVwork(k, what) }, { fig: b3Fig(k) });
};
B3.ciri = (r, i) => {
  const k = r.p(['silinder', 'kon', 'sfera']), s = B3S[k], attrs = [['permukaan rata', s.rata], ['permukaan melengkung', s.lengkung], ['bucu', s.bucu]], [attr, ans] = attrs[i == null ? r.i(0, 2) : i % 3];
  const obj = { silinder: 'sebuah tin susu tertutup', kon: 'sebuah bongkah kayu', sfera: 'sebiji guli kaca' }[k];
  return GEN_LQ('ciri', { k, attr, nm: s.nm, obj, ans: String(ans), claim: ans === 0 ? 1 : ans + 1, work: [`${vcap(s.nm)} mempunyai ${s.d}.`, `Maka bilangan ${attr} = ${ans}.`] }, { fig: b3Fig(k) });
};
B3.ciriNama = (r, k) => {
  k = k || r.p(B3ALLK);
  return GEN_LQ('ciriNama', { d: B3S[k].d, ans: vcap(B3S[k].nm), work: [`Pepejal yang mempunyai ${B3S[k].d} ialah ${B3S[k].nm}.`] });
};
B3.keratan = (r) => {
  const k = r.p(['prisma3', 'prisma5', 'prisma6']), n = B3S[k].n, P = B3POLY[n];
  return GEN_LQ('keratan', { P, nm: B3S[k].nm, ans: vcap(B3S[k].nm), work: ['Nama prisma ditentukan oleh bentuk keratan rentas seragamnya (tapak).', `Keratan rentas berbentuk ${P} (${n} sisi), maka ia ialah ${B3S[k].nm}.`] }, { fig: b3Fig(k, { hl: true }) });
};
B3.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
B3.nGon = (r, i) => {
  const type = i == null ? r.p(['prisma', 'piramid']) : (i % 2 ? 'piramid' : 'prisma'), n = r.p([5, 6, 7, 8, 9, 10, 12]), P = B3POLY[n];
  const nm = type === 'prisma' ? `prisma ${P}` : `piramid tapak ${P}`;
  const [F, E, V] = type === 'prisma' ? [n + 2, 3 * n, 2 * n] : [n + 1, 2 * n, n + 1];
  const work = type === 'prisma' ? [`Tapak ${P} mempunyai ${n} sisi dan prisma mempunyai 2 tapak.`, `Muka = 2 + ${n} = ${F}`, `Tepi = ${n} × 3 = ${E}`, `Bucu = ${n} × 2 = ${V}`] : [`Tapak ${P} mempunyai ${n} sisi dan piramid mempunyai 1 puncak.`, `Muka = 1 + ${n} = ${F}`, `Tepi = ${n} × 2 = ${E}`, `Bucu = ${n} + 1 = ${V}`];
  return GEN_LQ('nGon', { type, n, P, nm, ans: `${F} muka, ${E} tepi, ${V} bucu`, work });
};
B3.dariFEV = (r, i) => {
  const type = i == null ? r.p(['prisma', 'piramid']) : (i % 2 ? 'prisma' : 'piramid'), n = r.p(type === 'prisma' ? [3, 5, 6, 7, 8, 10] : [3, 4, 5, 6, 7, 8, 9]), P = B3POLY[n];
  const [F, E, V] = type === 'prisma' ? [n + 2, 3 * n, 2 * n] : [n + 1, 2 * n, n + 1];
  const nm = type === 'prisma' ? `prisma ${P}` : `piramid tapak ${n === 4 ? 'segi empat' : P}`;
  const work = type === 'prisma' ? [`Bilangan bucu genap (${V}) dan tepi = 3 × ${n}: ciri prisma bertapak ${n} sisi.`, `Semak: muka = ${n} + 2 = ${F}, tepi = 3 × ${n} = ${E}, bucu = 2 × ${n} = ${V}.`] : [`Bilangan muka = bilangan bucu (${F}): ciri piramid.`, `Tapak mempunyai ${n} sisi kerana tepi = 2 × ${n} = ${E}, bucu = ${n} + 1 = ${V}.`];
  const v = vq('dariFEV', { F, E, V, type, ans: vcap(nm), work });
  if (v.q.includes('bentuk tapaknya')) v.ans = vcap(n === 4 ? 'segi empat' : P);
  delete v.rev; return v;
};
B3.euler = r => {
  const pr = r.f() < .5, n = r.p([3, 5, 6, 7, 8, 9, 10]), P = B3POLY[n], nm = pr ? `prisma ${P}` : `piramid tapak ${P}`;
  const F = pr ? n + 2 : n + 1, E = pr ? 3 * n : 2 * n, V = pr ? 2 * n : n + 1;
  const v = vq('euler', { nm, F, E, V, ans: '', work: [] });
  if (v.q.includes('sahkan')) return { q: v.q, ans: `${F} + ${V} − ${E} = 2 (disahkan)`, work: [`${vcap(nm)}: F = ${F}, V = ${V}, E = ${E}`, `F + V − E = ${F} + ${V} − ${E} = ${F + V - E}`, 'Hasilnya 2, maka rumus Euler disahkan.'] };
  if (v.q.includes('bilangan mukanya')) return { q: v.q, ans: `${F} muka`, work: ['F + V − E = 2', `F + ${V} − ${E} = 2`, `F = 2 − ${V} + ${E} = ${F}`] };
  return { q: v.q, ans: `${V} bucu`, work: ['F + V − E = 2', `${F} + V − ${E} = 2`, `V = 2 − ${F} + ${E} = ${V}`] };
};
B3.k61 = r => {
  const n = r.p([3, 4, 5, 6]), g = { n, P: B3POLY[n] === 'segi empat' ? 'segi empat sama' : B3POLY[n], F: 2 * n + 1, E: 4 * n, V: 2 * n + 1 };
  const en = r.p([5, 6, 7, 8, 10, 12]), e = { E: 3 * en, n: en, P: B3POLY[en] };
  const dn = r.p([3, 4, 5, 6]), d = { n: dn, P: B3POLY[dn] === 'segi empat' ? 'segi empat sama' : B3POLY[dn] };
  const sn = r.p([5, 6, 7, 8, 9, 10]), s = { n: sn, S: 6 * sn + 2, P: B3POLY[sn] };
  const v = vq('k61', { g, e, d, s });
  let fig;
  if (v.q.includes('dicantumkan di atas') && n === 4) fig = b3Solid({ c: 'tr', label: 'Kubus dengan piramid di atasnya', V: [[0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], [0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2], [1, 1, 3.4]], F: [[0, 1, 2, 3], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [4, 5, 8], [5, 6, 8], [6, 7, 8], [7, 4, 8]] });
  else if (v.q.includes('tapak dengan tapak') && dn === 4) fig = b3Solid({ c: 'tr', label: 'Dua piramid bercantum', V: [[0, 0, 0], [2, 0, 0], [2, 2, 0], [0, 2, 0], [1, 1, 1.8], [1, 1, -1.8]], F: [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 0, 5]] });
  return Object.assign({ q: v.q, ans: v.ans, work: v.work }, fig ? { fig } : {});
};

/* ---------- 6.2 ---------- */
const B3NETK = ['kubus', 'kuboid', 'prisma3', 'piramid4', 'piramid3', 'silinder', 'kon'];
const B3NETWHY = {
  kubus: 'Bentangan itu terdiri daripada 6 segi empat sama yang sama saiz, maka ia membentuk kubus.',
  kuboid: 'Bentangan itu terdiri daripada 6 segi empat tepat (3 pasang yang sama), maka ia membentuk kuboid.',
  prisma3: 'Bentangan itu terdiri daripada 2 segi tiga dan 3 segi empat tepat, maka ia membentuk prisma segi tiga.',
  piramid4: 'Bentangan itu terdiri daripada 1 segi empat sama dan 4 segi tiga, maka ia membentuk piramid tapak segi empat sama.',
  piramid3: 'Bentangan itu terdiri daripada 4 segi tiga, maka ia membentuk piramid tapak segi tiga.',
  silinder: 'Bentangan itu terdiri daripada 1 segi empat tepat dan 2 bulatan, maka ia membentuk silinder.',
  kon: 'Bentangan itu terdiri daripada 1 sektor bulatan dan 1 bulatan, maka ia membentuk kon.'
};
const B3NETCL = { kubus: 'kuboid', kuboid: 'kubus', prisma3: 'piramid tapak segi tiga', piramid4: 'prisma segi empat', piramid3: 'prisma segi tiga', silinder: 'kon', kon: 'silinder' };
function b3NetFig(r, k) {
  if (k === 'kubus') return b3CellFig(b3CubeNet(r, true));
  if (k === 'kuboid') { const [p, l, t] = r.p([[3, 2, 1], [3, 1, 2], [2, 1, 3], [4, 2, 1], [3, 2, 2]]); return b3Flat(b3CuboidNet(p, l, t), { label: 'Bentangan kuboid', pad: 22 }); }
  if (k === 'prisma3') return b3TriPrismNet(r.p([[[1, true], [1, false]], [[0, true], [2, false]], [[2, true], [0, false]], [[0, true], [1, false]]]));
  if (k === 'piramid4') return b3PyrNet(['u', 'd', 'l', 'r']);
  if (k === 'piramid3') return b3TetraNet();
  if (k === 'silinder') return b3CylNet([[r.p([.2, .5, .8]), true], [r.p([.2, .5, .8]), false]]);
  return b3ConeNet(r.p([150, 180, 216, 240]));
}
B3.netNama = (r, i) => {
  const k = i == null ? r.p(B3NETK) : B3NETK[i % B3NETK.length], nm = B3S[k].nm;
  return GEN_LQ('netNama', { ans: vcap(nm), claim: B3NETCL[k], why: B3NETWHY[k], work: [B3NETWHY[k]] }, { fig: b3NetFig(r, k) });
};
B3.netKubus = (r, i) => {
  const ok = i == null ? r.f() < .5 : i % 2 === 0, cells = b3CubeNet(r, ok);
  return GEN_LQ('netKubus', { ans: ok ? 'Ya' : 'Tidak', work: ok ? ['Lipat bentangan dengan satu segi empat sama sebagai tapak.', 'Setiap segi empat sama menjadi satu muka yang berlainan.', 'Keenam-enam muka kubus lengkap tanpa pertindihan, maka bentangan ini boleh membentuk kubus.'] : ['Lipat bentangan dengan satu segi empat sama sebagai tapak.', 'Sekurang-kurangnya dua segi empat sama bertindih pada kedudukan muka yang sama.', 'Maka satu muka kubus akan terbuka; bentangan ini tidak boleh membentuk kubus.'] }, { fig: b3CellFig(cells, null, { c: ok ? 'tr' : 'tr' }) });
};
B3.netLain = (r, i) => {
  const k = r.p(['prisma3', 'silinder', 'piramid4']), ok = i == null ? r.f() < .5 : i % 2 === 1;
  let fig, work;
  if (k === 'prisma3') {
    const a = r.i(0, 2), b = r.i(0, 2);
    const top = r.f() < .5, bb = (a + r.i(1, 2)) % 3;
    fig = b3TriPrismNet(ok ? [[a, true], [b, false]] : [[a, top], [bb, top]]);
    work = ok ? ['Prisma segi tiga memerlukan 3 segi empat tepat dan 2 segi tiga.', 'Satu segi tiga berada pada hujung atas dan satu lagi pada hujung bawah, jadi kedua-dua tapak tertutup.', 'Maka bentangan ini boleh membentuk prisma segi tiga.'] : ['Prisma segi tiga memerlukan 2 segi tiga pada dua hujung yang bertentangan.', 'Dalam rajah, kedua-dua segi tiga berada pada hujung yang sama, jadi akan bertindih.', 'Hujung yang satu lagi terbuka, maka bentangan ini tidak boleh membentuk prisma segi tiga.'];
  } else if (k === 'silinder') {
    const x1 = r.p([.2, .5, .8]), x2 = r.p([.2, .5, .8]);
    fig = b3CylNet(ok ? [[x1, true], [x2, false]] : [[.25, true], [.75, true]]);
    work = ok ? ['Silinder memerlukan 1 segi empat tepat dan 2 bulatan.', 'Satu bulatan pada sisi atas dan satu pada sisi bawah segi empat tepat.', 'Maka bentangan ini boleh membentuk silinder.'] : ['Kedua-dua bulatan berada pada sisi yang sama (atas).', 'Apabila digulung, kedua-dua bulatan menutup hujung yang sama, manakala hujung bawah terbuka.', 'Maka bentangan ini tidak boleh membentuk silinder.'];
  } else {
    const all = ['u', 'd', 'l', 'r'], drop = r.p(all);
    fig = b3PyrNet(ok ? all : all.filter(x => x !== drop));
    work = ok ? ['Piramid tapak segi empat sama memerlukan 1 segi empat sama dan 4 segi tiga.', 'Setiap sisi segi empat sama mempunyai satu segi tiga, dan semua segi tiga bertemu di puncak.', 'Maka bentangan ini boleh membentuk piramid.'] : ['Piramid tapak segi empat sama memerlukan 4 muka segi tiga.', 'Bentangan ini hanya mempunyai 3 segi tiga, jadi satu muka sisi terbuka.', 'Maka bentangan ini tidak boleh membentuk piramid tertutup.'];
  }
  return GEN_LQ('netLain', { nm: B3S[k].nm, ans: ok ? 'Ya' : 'Tidak', work }, { fig });
};
B3.lukis = (r, i) => {
  const cube = i == null ? r.f() < .35 : i % 3 === 0;
  let p, l, t;
  if (cube) { p = l = t = r.p([2, 3]); } else { do { p = r.i(2, 4); l = r.i(1, 3); t = r.i(1, 3); } while ((p === l && l === t) || 2 * (l + p) > 13 || t + 2 * l > 9); }
  const GW = 15, GH = 10, off = [Math.floor((GW - 2 * (l + p)) / 2), Math.floor((GH - t - 2 * l) / 2)];
  const desc = cube ? `sebuah kubus bersisi ${p} unit` : `sebuah kuboid berukuran ${p} unit × ${l} unit × ${t} unit`;
  const fig = b3Flat([], { grid: [GW, GH], label: 'Grid segi empat sama' });
  const figAns = b3Flat(b3CuboidNet(p, l, t, { grid: true, off }), { grid: [GW, GH], label: 'Bentangan' });
  const work = cube ? ['Kubus mempunyai 6 muka segi empat sama yang sama saiz.', `Lukis 4 segi empat sama ${p} × ${p} bersambung dalam satu baris.`, 'Lukis satu segi empat sama di atas dan satu di bawah segi empat sama kedua.'] : [`Kuboid mempunyai 2 muka ${p} × ${l}, 2 muka ${p} × ${t} dan 2 muka ${l} × ${t}.`, `Lukis 4 segi empat tepat bersambung dalam satu baris (lebar ${l}, ${p}, ${l}, ${p}) dengan tinggi ${t}.`, `Lukis segi empat tepat ${p} × ${l} di atas dan di bawah segi empat tepat ${p} × ${t} yang pertama.`, 'Bentangan lain yang betul juga diterima.'];
  const v = GEN_LQ('lukis', { desc, ans: 'Rujuk rajah jawapan (salah satu bentangan yang boleh).', work }, { fig });
  return Object.assign(v, { fig, figAns, kind: 'lukis' });
};
B3.netBertentang = (r) => {
  const cells = b3CubeNet(r, true), face = b3Fold(cells), labs = b3Sh(r, ['P', 'Q', 'R', 'S', 'T', 'U']);
  const xi = r.i(0, 5), oi = face.findIndex(f => f === (face[xi] ^ 1)), adj = [0, 1, 2, 3, 4, 5].filter(j => j !== xi && j !== oi);
  const X = labs[xi], Y = labs[oi], ci = r.p(adj);
  return GEN_LQ('netBertentang', { X, ans: Y, claim: labs[ci], work: [`Jadikan muka ${X} sebagai tapak dan lipat bentangan itu.`, `Muka yang bersebelahan dengan ${X} menjadi muka sisi: ${b3Dan(adj.map(j => labs[j]).sort())}.`, `Muka yang tinggal, ${Y}, menjadi penutup atas, maka ${Y} bertentangan dengan ${X}.`] }, { fig: b3CellFig(cells, labs, { hi: xi }) });
};
B3.netSil = (r, i) => {
  const j = r.p([3.5, 7, 7, 10.5, 14]), t = r.i(5, 20), pi = B3P22, L = pi.m(2 * j);
  const findJ = i == null ? r.f() < .4 : i % 3 === 2;
  if (findJ) return GEN_LQ('netSilJ', { L, pi, ans: `${b3n(j)} cm`, work: ['Panjang segi empat tepat = lilitan tapak = 2πj', `2 × 22/7 × j = ${b3n(L)}`, `j = ${b3n(L)} × 7 ÷ 44 = ${b3n(j)} cm`] }, { fig: b3CylNet([[.5, true], [.5, false]], { tw: `${b3n(L)} cm` }) });
  return GEN_LQ('netSilP', { j, t, pi, ans: `${b3n(L)} cm`, work: ['Panjang segi empat tepat = lilitan bulatan tapak', '= 2πj', `= 2 × 22/7 × ${b3n(j)}`, `= ${b3n(L)} cm`] }, { fig: b3CylNet([[.5, true], [.5, false]], { tw: '?', th: `${t} cm`, tr: `j = ${b3n(j)}` }) });
};
B3.netKuboid = r => {
  let p, l, t; do { p = r.i(4, 12); l = r.i(2, 8); t = r.i(2, 9); } while (p === l || p === t);
  const tot = 2 * (l + p), [vp, vl, vt] = b3vis([p, l, t]).map(x => x * 2);
  const it = b3CuboidNet(vp, vl, vt);
  it[1].t = null; it[0].t = 'x';
  it.push({ tx: [vl + vp / 2, -.22, `${p} cm`, 'pk'] }, { tx: [-.12, vl + vt / 2, `${t} cm`, 'gr', 'end'] });
  it.push({ l: [[0, vl + vt + vl + .25], [2 * (vl + vp), vl + vt + vl + .25]], c: 'am' }, { tx: [vl + vp, vl + vt + vl + .5, `${tot} cm`, 'am'] });
  return GEN_LQ('netKuboid', { p, t, tot, ans: `x = ${l} cm`, work: ['Jalur mengufuk = x + p + x + p', `2x + 2(${p}) = ${tot}`, `2x = ${tot} − ${2 * p} = ${tot - 2 * p}`, `x = ${l} cm`] }, { fig: b3Flat(it, { label: 'Bentangan kuboid', pad: 46 }) });
};
B3.k62 = r => {
  // dadu
  const cells = b3CubeNet(r, true), face = b3Fold(cells), pairs = b3Sh(r, [[1, 6], [2, 5], [3, 4]]).map(pq => (r.f() < .5 ? pq : [pq[1], pq[0]]));
  const num = []; pairs.forEach(([a, b], k) => { num[2 * k] = a; num[2 * k + 1] = b; });
  const vals = face.map(f => num[f]);
  let xi, yi; do { xi = r.i(0, 5); yi = r.i(0, 5); } while (xi === yi || face[xi] === (face[yi] ^ 1));
  const opp = i => face.findIndex(f => f === (face[i] ^ 1));
  const labs = vals.map((v, i) => (i === xi ? 'x' : i === yi ? 'y' : String(v)));
  const dc = { x: vals[xi], y: vals[yi], ox: vals[opp(xi)], oy: vals[opp(yi)] };
  // kon
  const [kj, ks] = r.p([[3, 5], [4, 5], [3, 6], [2, 6], [3, 9], [4, 6], [5, 9], [2, 8], [5, 6], [4, 9], [5, 12], [3, 8]]), kn = { j: kj, s: ks, th: 360 * kj / ks };
  // kadbod
  const [p, l, t] = r.p([[10, 6, 4], [12, 5, 8], [8, 4, 6], [15, 10, 5], [9, 6, 3], [14, 8, 6], [10, 4, 7]]), A = 2 * (p * l + p * t + l * t), W = 2 * (l + p), H = 2 * l + t;
  const kb = { p, l, t, A, W, H, waste: W * H - A };
  const v = vq('k62', { dc, kn, kb });
  let fig;
  if (v.q.includes('dadu')) fig = b3CellFig(cells, labs, { label: 'Bentangan dadu' });
  else if (v.q.includes('Bentangan sebuah kon')) fig = b3ConeNet(kn.th, { ts: 'θ', tl: `${ks} cm` });
  else if (v.q.includes('digulung')) fig = b3ConeNet(kn.th, { ts: `${kn.th}°`, tl: `${ks} cm` });
  else { const [vp, vl, vt] = b3vis([p, l, t]).map(x => x * 2), it = b3CuboidNet(vp, vl, vt); it.push({ tx: [vl + vp / 2, -.22, `${p} cm`, 'pk'] }, { tx: [-.12, vl + vt / 2, `${t} cm`, 'gr', 'end'] }, { tx: [vl / 2, vl - .22, `${l} cm`, 'am'] }); fig = b3Flat(it, { label: 'Bentangan kuboid', pad: 46 }); }
  return { q: v.q, ans: v.ans, work: v.work, fig };
};

/* ---------- 6.3 Luas permukaan ---------- */
const b3TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15], [12, 5, 13], [8, 15, 17]];
function b3LpData(r, k) {
  if (k === 'kubus') { const s = r.i(2, 15), A = 6 * s * s; return { nm: 'kubus', desc: `sebuah kubus bersisi ${s} cm`, ctx: `Sebuah kotak hadiah berbentuk kubus bersisi ${s} cm. Berapakah luas minimum kertas pembalut yang diperlukan untuk membalut seluruh kotak itu?`, A, wrong: `${4 * s * s} cm²`, why: 'N hanya mengira 4 muka. Kubus mempunyai 6 muka.', work: ['Luas permukaan kubus = 6s²', `= 6 × ${s}²`, `= 6 × ${s * s}`, `= ${A} cm²`], fig: B3F.kubus(s) }; }
  if (k === 'kuboid') { let p, l, t; do { p = r.i(3, 15); l = r.i(2, 12); t = r.i(2, 10); } while (p === l || l === t || p === t); const A = 2 * (p * l + p * t + l * t); return { nm: 'kuboid', desc: `sebuah kuboid berukuran ${p} cm × ${l} cm × ${t} cm`, ctx: `Sebuah kotak kasut berbentuk kuboid berukuran ${p} cm × ${l} cm × ${t} cm. Hitung luas kadbod yang diperlukan untuk membuat kotak itu (termasuk penutup).`, A, wrong: `${A / 2} cm²`, why: 'Setiap muka kuboid mempunyai pasangan yang sama saiz; jumlah luas tiga muka mesti didarab dengan 2.', work: ['Luas permukaan = 2(pl + pt + lt)', `= 2(${p} × ${l} + ${p} × ${t} + ${l} × ${t})`, `= 2(${p * l} + ${p * t} + ${l * t})`, `= ${A} cm²`], fig: B3F.kuboid(p, l, t) }; }
  if (k === 'prisma') { const [a, b, c] = r.p(b3TRI), L = r.i(5, 20), A = a * b + (a + b + c) * L; return { nm: 'prisma', desc: `sebuah prisma tegak dengan keratan rentas segi tiga bersudut tegak bersisi ${a} cm, ${b} cm dan ${c} cm, serta panjang ${L} cm`, ctx: `Sebuah penahan pintu berbentuk prisma tegak dengan keratan rentas segi tiga bersudut tegak bersisi ${a} cm, ${b} cm dan ${c} cm. Panjangnya ${L} cm. Seluruh permukaannya dicat. Hitung luas yang dicat.`, A, wrong: `${a * b / 2 + (a + b + c) * L} cm²`, why: 'N hanya mengira satu muka segi tiga. Prisma mempunyai 2 muka segi tiga.', work: [`Luas 2 muka segi tiga = 2 × ½ × ${a} × ${b} = ${a * b} cm²`, `Luas 3 muka segi empat tepat = (${a} + ${b} + ${c}) × ${L} = ${(a + b + c) * L} cm²`, `Jumlah = ${a * b} + ${(a + b + c) * L} = ${A} cm²`], fig: B3F.prismaT(a, b, c, L) }; }
  if (k === 'piramid') { const s = r.i(3, 14), h = r.i(s / 2 + 2 | 0, 18), A = s * s + 2 * s * h; return { nm: 'piramid', desc: `sebuah piramid tegak bertapak segi empat sama bersisi ${s} cm dengan tinggi sendeng setiap muka segi tiga ${h} cm`, ctx: `Sebuah model piramid bertapak segi empat sama bersisi ${s} cm. Tinggi sendeng setiap muka segi tiganya ${h} cm. Seluruh permukaan model itu dicat. Hitung luas yang dicat.`, A, wrong: `${s * s + 4 * s * h} cm²`, why: 'N terlupa ½ dalam luas segi tiga (½ × tapak × tinggi).', work: [`Luas tapak = ${s} × ${s} = ${s * s} cm²`, `Luas 4 muka segi tiga = 4 × ½ × ${s} × ${h} = ${2 * s * h} cm²`, `Jumlah = ${s * s} + ${2 * s * h} = ${A} cm²`], fig: B3F.piramid(s, h) }; }
  if (k === 'silinder') { const j = b3Jej(r), pi = b3PiFor(j), t = r.i(3, 20), a1 = pi.m(2 * j * j), a2 = pi.m(2 * j * t), A = a1 + a2; return { nm: 'silinder', desc: `sebuah silinder tertutup berjejari ${b3n(j)} cm dan tinggi ${t} cm`, ctx: `Sebuah tin susu tertutup berbentuk silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm. Hitung luas kepingan logam yang digunakan untuk membuat tin itu.`, pi, A, wrong: `${b3n(pi.m(j * j) + a2)} cm²`, why: 'N hanya mengira satu tapak bulatan. Silinder tertutup mempunyai 2 tapak.', work: ['Luas permukaan = 2πj² + 2πjt', `= 2 × ${pi.t} × ${b3n(j)}² + 2 × ${pi.t} × ${b3n(j)} × ${t}`, b3xs([a1, a2]), b3eq(A, 'cm²')], fig: B3F.silinder(j, t) }; }
  if (k === 'kon') { const j = b3Jej(r), pi = b3PiFor(j), s = Math.ceil(j) + r.i(2, 12), a1 = pi.m(j * j), a2 = pi.m(j * s), A = a1 + a2; return { nm: 'kon', desc: `sebuah kon pepejal berjejari ${b3n(j)} cm dan tinggi sendeng ${s} cm`, ctx: `Sebuah bongkah kayu berbentuk kon berjejari ${b3n(j)} cm dan tinggi sendeng ${s} cm. Seluruh permukaannya divarnis. Hitung luas yang divarnis.`, pi, A, wrong: `${b3n(a2)} cm²`, why: 'N hanya mengira permukaan melengkung πjs. Luas tapak πj² juga perlu ditambah.', work: ['Luas permukaan = πj² + πjs', `= ${pi.t} × ${b3n(j)}² + ${pi.t} × ${b3n(j)} × ${s}`, b3xs([a1, a2]), b3eq(A, 'cm²')], fig: B3F.kon(j, s) }; }
  const j = b3Jej(r), pi = b3PiFor(j), A = pi.m(4 * j * j);
  return { nm: 'sfera', desc: `sebuah sfera berjejari ${b3n(j)} cm`, ctx: `Sebiji bola berbentuk sfera berjejari ${b3n(j)} cm. Hitung luas permukaan bola itu.`, pi, A, wrong: `${b3n(pi.m(j * j))} cm²`, why: 'N menggunakan rumus luas bulatan πj². Luas permukaan sfera = 4πj².', work: ['Luas permukaan sfera = 4πj²', `= 4 × ${pi.t} × ${b3n(j)}²`, b3eq(A, 'cm²')], fig: B3F.sfera(j) };
}
B3.lp = (r, k, i) => {
  const d = b3LpData(r, k), pt = d.pi ? b3PiTx(d.pi) : '', ans = b3u(d.A, 'cm²');
  const useR = i == null ? r.f() < .3 : i % 3 === 2;
  return GEN_LQ(useR ? 'lpR' : 'lp', Object.assign({}, d, { pt, ans }), { fig: d.fig });
};
B3.lpCari = (r, i) => {
  const k = ['kubus', 'kuboid', 'silinder', 'sfera', 'kon'][i == null ? r.i(0, 4) : i % 5];
  let d;
  if (k === 'kubus') { const s = r.i(2, 15), A = 6 * s * s; d = { nm: 'kubus', given: '', what: 'panjang sisi kubus itu', A, ans: `${s} cm`, work: ['6s² = ' + A, `s² = ${A} ÷ 6 = ${s * s}`, `s = √${s * s} = ${s} cm`], fig: B3F.kubus('s') }; }
  else if (k === 'kuboid') { let p, l, t; do { p = r.i(3, 15); l = r.i(2, 12); t = r.i(2, 12); } while (p === l); const A = 2 * (p * l + p * t + l * t); d = { nm: 'kuboid', given: ` berukuran ${p} cm × ${l} cm × t cm`, what: 'nilai t', A, ans: `t = ${t} cm`, work: [`2(${p} × ${l} + ${p}t + ${l}t) = ${A}`, `${p * l} + ${p + l}t = ${A / 2}`, `${p + l}t = ${A / 2 - p * l}`, `t = ${t} cm`] }; }
  else if (k === 'silinder') { const j = r.p([3.5, 7, 7, 14]), t = r.i(3, 20), pi = B3P22, a1 = pi.m(2 * j * j), A = a1 + pi.m(2 * j * t); d = { nm: 'silinder tertutup', given: ` berjejari ${b3n(j)} cm`, what: 'tinggi silinder itu', pi, A: b3n(A), ans: `${t} cm`, work: ['2πj² + 2πjt = ' + b3n(A), `2 × 22/7 × ${b3n(j)}² + 2 × 22/7 × ${b3n(j)} × t = ${b3n(A)}`, `${b3n(a1)} + ${b3n(pi.m(2 * j))}t = ${b3n(A)}`, `${b3n(pi.m(2 * j))}t = ${b3n(A - a1)}`, `t = ${t} cm`] }; }
  else if (k === 'sfera') { const j = r.p([3.5, 7, 10.5, 14, 21]), pi = B3P22, A = pi.m(4 * j * j); d = { nm: 'sfera', given: '', what: 'jejari sfera itu', pi, A: b3n(A), ans: `${b3n(j)} cm`, work: ['4πj² = ' + b3n(A), `j² = ${b3n(A)} ÷ (4 × 22/7) = ${b3n(j * j)}`, `j = √${b3n(j * j)} = ${b3n(j)} cm`] }; }
  else { const j = r.p([3.5, 7, 7, 14]), s = Math.ceil(j) + r.i(2, 12), pi = B3P22, a1 = pi.m(j * j), A = a1 + pi.m(j * s); d = { nm: 'kon pepejal', given: ` berjejari ${b3n(j)} cm`, what: 'tinggi sendeng kon itu', pi, A: b3n(A), ans: `${s} cm`, work: ['πj² + πjs = ' + b3n(A), `22/7 × ${b3n(j)}² + 22/7 × ${b3n(j)} × s = ${b3n(A)}`, `${b3n(a1)} + ${b3n(pi.m(j))}s = ${b3n(A)}`, `${b3n(pi.m(j))}s = ${b3n(A - a1)}`, `s = ${s} cm`] }; }
  const v = GEN_LQ('lpCari', Object.assign(d, { pt: d.pi ? b3PiTx(d.pi) : '' }));
  return Object.assign(v, d.fig ? { fig: d.fig } : {});
};
B3.lpPyth = (r, i) => {
  const kind = i == null ? r.p(['pir', 'kon']) : (i % 2 ? 'kon' : 'pir');
  if (kind === 'pir') {
    const [hb, H, hs] = r.p([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 3, 5], [8, 6, 10], [12, 5, 13], [8, 15, 17], [9, 12, 15]]), s = 2 * hb, A = s * s + 2 * s * hs;
    return GEN_LQ('lpPyth', { desc: `sebuah piramid tegak bertapak segi empat sama bersisi ${s} cm dan tinggi tegak ${H} cm`, pt: '', hint: 'Cari tinggi sendeng muka segi tiga dahulu.', ans: `${A} cm²`, work: [`Tinggi sendeng muka segi tiga = √(${H}² + ${hb}²) = √${H * H + hb * hb} = ${hs} cm (teorem Pythagoras)`, `Luas tapak = ${s} × ${s} = ${s * s} cm²`, `Luas 4 segi tiga = 4 × ½ × ${s} × ${hs} = ${2 * s * hs} cm²`, `Jumlah = ${s * s} + ${2 * s * hs} = ${A} cm²`] }, { fig: B3F.piramid(s, null, H) });
  }
  const [j, t, s] = r.p([[3, 4, 5], [6, 8, 10], [5, 12, 13], [7, 24, 25], [9, 12, 15], [8, 15, 17], [21, 20, 29], [12, 5, 13], [14, 48, 50]]), pi = b3PiFor(j), a1 = pi.m(j * j), a2 = pi.m(j * s), A = a1 + a2;
  return GEN_LQ('lpPyth', { desc: `sebuah kon pepejal berjejari ${j} cm dan tinggi tegak ${t} cm`, pt: b3PiTx(pi), hint: 'Cari tinggi sendeng kon dahulu.', ans: b3u(A, 'cm²'), work: [`Tinggi sendeng s = √(${j}² + ${t}²) = √${j * j + t * t} = ${s} cm`, 'Luas permukaan = πj² + πjs', `= ${pi.t} × ${j}² + ${pi.t} × ${j} × ${s}`, b3xs([a1, a2]), b3eq(A, 'cm²')] }, { fig: B3F.kon(j, null, t) });
};
B3.lpBuka = (r, i) => {
  const cyl = i == null ? r.f() < .5 : i % 2 === 0;
  if (cyl) {
    const j = b3Jej(r), pi = b3PiFor(j), t = r.i(5, 25), a1 = pi.m(j * j), a2 = pi.m(2 * j * t), A = a1 + a2;
    return GEN_LQ('lpBuka', { desc: `sebuah bekas silinder tanpa penutup berjejari ${b3n(j)} cm dan tinggi ${t} cm`, use: 'bekas pensel', pt: b3PiTx(pi), ans: b3u(A, 'cm²'), work: ['Bekas tanpa penutup: 1 tapak bulatan + permukaan melengkung', 'Luas = πj² + 2πjt', `= ${pi.t} × ${b3n(j)}² + 2 × ${pi.t} × ${b3n(j)} × ${t}`, b3xs([a1, a2]), b3eq(A, 'cm²')] }, { fig: B3F.silinder(j, t) });
  }
  let p, l, t; do { p = r.i(5, 30); l = r.i(4, 20); t = r.i(3, 15); } while (p === l);
  const A = p * l + 2 * p * t + 2 * l * t;
  return GEN_LQ('lpBuka', { desc: `sebuah kotak berbentuk kuboid tanpa penutup berukuran ${p} cm × ${l} cm × ${t} cm`, use: 'bekas simpanan', pt: '', ans: `${A} cm²`, work: ['Kotak tanpa penutup: tapak + 4 muka sisi', `Luas = ${p} × ${l} + 2(${p} × ${t}) + 2(${l} × ${t})`, `= ${p * l} + ${2 * p * t} + ${2 * l * t}`, `= ${A} cm²`] }, { fig: B3F.kuboid(p, l, t) });
};
B3.k63 = r => {
  const j1 = b3Jej(r), p1 = b3PiFor(j1), t1 = r.i(4, 20), cp = { j: j1, t: t1, pi: p1, a1: p1.m(2 * j1 * t1), a2: p1.m(4 * j1 * j1) }; cp.A = cp.a1 + cp.a2;
  const j2 = r.p([3, 4, 5, 6, 7, 7, 14]), p2 = b3PiFor(j2), rk = { j: j2, t: r.i(6, 25), s: j2 + r.i(3, 10), pi: p2 }; rk.a1 = p2.m(j2 * j2); rk.a2 = p2.m(2 * j2 * rk.t); rk.a3 = p2.m(j2 * rk.s); rk.A = rk.a1 + rk.a2 + rk.a3;
  const j3 = b3Jej(r), p3 = b3PiFor(j3), hm = { j: j3, pi: p3, A: p3.m(3 * j3 * j3) };
  const [cpL, clL, ctL] = r.p([[2, 1.5, 1], [3, 2, 1.5], [2.5, 2, 1], [4, 2, 1.5], [1.5, 1, 1], [3, 1.5, 2]]), rate = r.p([8, 12, 15, 18, 20, 25]), cA = cpL * clL + 2 * cpL * ctL + 2 * clL * ctL, ct = { p: cpL, l: clL, t: ctL, rate, A: cA, cost: Math.round(cA * rate * 100) / 100 };
  const ks = r.i(3, 12), kv = { s: ks, V: ks ** 3, A: 6 * ks * ks };
  const v = vq('k63', { cp, rk, hm, ct, kv });
  let fig;
  if (v.q.includes('kapsul')) { const [vr, vh] = b3vis([j1, t1]); fig = b3Round([{ k: 'hemiD', r: vr }, { k: 'cyl', r: vr, h: Math.max(.6, vh * 2), lh: `${t1} cm` }, { k: 'hemi', r: vr, lr: `${b3n(j1)} cm` }], { label: 'Kapsul' }); }
  else if (v.q.includes('roket')) { const [vr, vh, vs] = b3vis([j2, rk.t, rk.s]); fig = b3Round([{ k: 'cyl', r: vr, h: vh * 1.8, lr: `${j2} cm`, lh: `${rk.t} cm` }, { k: 'cone', r: vr, h: vs * 1.2, ls: `${rk.s} cm` }], { label: 'Model roket' }); }
  else if (v.q.includes('hemisfera pepejal')) fig = b3Round([{ k: 'hemi', r: 1, lr: `${b3n(j3)} cm` }], { label: 'Hemisfera' });
  else if (v.q.includes('tangki air')) fig = b3Solid(Object.assign({ c: 'pa', label: 'Tangki tanpa penutup', lab: [[0, 1, `${cpL} m`], [1, 2, `${clL} m`], [2, 6, `${ctL} m`]] }, (() => { const [a, b, c] = b3vis([cpL, clL, ctL]).map(x => x * 2.4); const bx = b3Box(a, b, c); bx.F = bx.F.filter((_, fi) => fi !== 1); return bx; })()));
  else fig = B3F.kubus('s');
  return { q: v.q, ans: v.ans, work: v.work, fig };
};

/* ---------- 6.4 Isi padu ---------- */
function b3IvData(r, k) {
  if (k === 'kubus') { const s = r.i(2, 15), V = s ** 3; return { nm: 'kubus', desc: `sebuah kubus bersisi ${s} cm`, ctx: `Sebuah bekas berbentuk kubus bersisi ${s} cm diisi penuh dengan pasir. Berapakah isi padu pasir itu?`, V, wrong: `${s * s} cm³`, why: 'N hanya mengira luas satu muka. Isi padu kubus = s × s × s.', work: ['Isi padu kubus = s³', `= ${s} × ${s} × ${s}`, `= ${V} cm³`], fig: B3F.kubus(s) }; }
  if (k === 'kuboid') { let p, l, t; do { p = r.i(3, 20); l = r.i(2, 12); t = r.i(2, 15); } while (p === l || l === t); const V = p * l * t; return { nm: 'kuboid', desc: `sebuah kuboid berukuran ${p} cm × ${l} cm × ${t} cm`, ctx: `Sebuah bongkah kayu berbentuk kuboid berukuran ${p} cm × ${l} cm × ${t} cm. Hitung isi padu bongkah kayu itu.`, V, wrong: `${p * l} cm³`, why: 'N hanya mengira luas tapak. Isi padu = luas tapak × tinggi.', work: ['Isi padu = p × l × t', `= ${p} × ${l} × ${t}`, `= ${V} cm³`], fig: B3F.kuboid(p, l, t) }; }
  if (k === 'prisma') { let b, h; do { b = r.i(3, 14); h = r.i(3, 12); } while ((b * h) % 2); const L = r.i(4, 20), A = b * h / 2, V = A * L; return { nm: 'prisma', desc: `sebuah prisma tegak dengan keratan rentas segi tiga bersudut tegak bertapak ${b} cm dan bertinggi ${h} cm, serta panjang ${L} cm`, ctx: `Sebatang coklat berbentuk prisma tegak dengan keratan rentas segi tiga bersudut tegak bertapak ${b} cm dan bertinggi ${h} cm. Panjangnya ${L} cm. Hitung isi padu coklat itu.`, V, wrong: `${b * h * L} cm³`, why: 'N terlupa ½ dalam luas segi tiga. Luas keratan rentas = ½ × tapak × tinggi.', work: ['Isi padu prisma = luas keratan rentas × panjang', `Luas keratan rentas = ½ × ${b} × ${h} = ${A} cm²`, `Isi padu = ${A} × ${L} = ${V} cm³`], fig: B3F.prismaT(b, h, null, L) }; }
  if (k === 'prismaA') { const A = r.i(12, 60), L = r.i(5, 25), V = A * L; return { nm: 'prisma', desc: `sebuah prisma dengan luas keratan rentas ${A} cm² dan panjang ${L} cm`, ctx: `Sebatang kayu berbentuk prisma mempunyai luas keratan rentas ${A} cm² dan panjang ${L} cm. Hitung isi padu kayu itu.`, V, wrong: `${A + L} cm³`, why: 'N menambah luas dengan panjang. Isi padu = luas keratan rentas × panjang.', work: ['Isi padu prisma = luas keratan rentas × panjang', `= ${A} × ${L}`, `= ${V} cm³`], fig: B3F.prismaA(A, L, r.p([5, 6])) }; }
  if (k === 'silinder') { const j = b3Jej(r), pi = b3PiFor(j), t = r.i(3, 20), V = pi.m(j * j * t); return { nm: 'silinder', desc: `sebuah silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm`, ctx: `Sebuah tin minuman berbentuk silinder berjejari ${b3n(j)} cm dan tinggi ${t} cm. Hitung isi padu tin itu.`, pi, V, wrong: `${b3n(pi.m(4 * j * j * t))} cm³`, why: 'N menggunakan diameter, bukan jejari, dalam rumus πj²t.', work: ['Isi padu silinder = πj²t', `= ${pi.t} × ${b3n(j)}² × ${t}`, b3eq(V, 'cm³')], fig: B3F.silinder(j, t) }; }
  if (k === 'piramid') { let s, H; do { s = r.i(3, 15); H = r.i(3, 18); } while ((s * s * H) % 3); const V = s * s * H / 3; return { nm: 'piramid', desc: `sebuah piramid tegak bertapak segi empat sama bersisi ${s} cm dan tinggi ${H} cm`, ctx: `Sebuah model piramid kaca bertapak segi empat sama bersisi ${s} cm dan tinggi ${H} cm. Hitung isi padu model itu.`, V, wrong: `${s * s * H} cm³`, why: 'N terlupa mendarab dengan ⅓. Isi padu piramid = ⅓ × luas tapak × tinggi.', work: ['Isi padu piramid = ⅓ × luas tapak × tinggi', `Luas tapak = ${s} × ${s} = ${s * s} cm²`, `Isi padu = ⅓ × ${s * s} × ${H}`, `= ${V} cm³`], fig: B3F.piramid(s, null, H) }; }
  if (k === 'kon') { const j = b3Jej(r), pi = b3PiFor(j), t = r.i(3, 24), V = pi.m(j * j * t) / 3; return { nm: 'kon', desc: `sebuah kon berjejari ${b3n(j)} cm dan tinggi ${t} cm`, ctx: `Sebuah bekas berbentuk kon berjejari ${b3n(j)} cm dan tinggi ${t} cm diisi penuh dengan air. Hitung isi padu air itu.`, pi, V, wrong: `${b3n(pi.m(j * j * t))} cm³`, why: 'N terlupa mendarab dengan ⅓. Isi padu kon = ⅓πj²t.', work: ['Isi padu kon = ⅓πj²t', `= ⅓ × ${pi.t} × ${b3n(j)}² × ${t}`, b3eq(V, 'cm³')], fig: B3F.kon(j, null, t) }; }
  const j = b3Jej(r), pi = b3PiFor(j), V = pi.m(4 * j ** 3) / 3;
  return { nm: 'sfera', desc: `sebuah sfera berjejari ${b3n(j)} cm`, ctx: `Sebiji bebola coklat berbentuk sfera berjejari ${b3n(j)} cm. Hitung isi padu bebola coklat itu.`, pi, V, wrong: `${b3n(pi.m(4 * j * j) / 3)} cm³`, why: 'N menggunakan j², bukan j³. Isi padu sfera = 4/3 πj³.', work: ['Isi padu sfera = 4/3 πj³', `= 4/3 × ${pi.t} × ${b3n(j)}³`, b3eq(V, 'cm³')], fig: B3F.sfera(j) };
}
B3.iv = (r, k, i) => {
  const d = b3IvData(r, k), pt = d.pi ? b3PiTx(d.pi) : '', ans = b3u(d.V, 'cm³');
  const useR = k !== 'prismaA' && (i == null ? r.f() < .3 : i % 3 === 2);
  return GEN_LQ(useR ? 'ivR' : 'iv', Object.assign({}, d, { pt, ans }), { fig: d.fig });
};
const B3UNIT = [
  r => { const v = r.p([250, 500, 750, 1500, 2500, 3200, 4750, 600, 1250]); return { v, from: 'cm³', to: 'liter', a: v / 1000, work: ['1 liter = 1000 cm³', `${v} cm³ = ${v} ÷ 1000`, `= ${b3n(v / 1000)} liter`] }; },
  r => { const v = r.p([1.5, 2, 2.5, 3.2, 0.75, 4, 1.25, 0.6]); return { v: b3n(v), from: 'liter', to: 'ml', a: v * 1000, work: ['1 liter = 1000 ml', `${b3n(v)} liter = ${b3n(v)} × 1000`, `= ${b3n(v * 1000)} ml`] }; },
  r => { const v = r.p([2, 3, 0.5, 1.5, 0.25, 4, 1.2]); return { v: b3n(v), from: 'm³', to: 'cm³', a: v * 1e6, work: ['1 m = 100 cm, maka 1 m³ = 100 × 100 × 100 = 1 000 000 cm³', `${b3n(v)} m³ = ${b3n(v)} × 1 000 000`, `= ${b3n(v * 1e6)} cm³`] }; },
  r => { const v = r.p([2, 3, 0.5, 1.5, 4, 2.4, 0.8]); return { v: b3n(v), from: 'm³', to: 'liter', a: v * 1000, work: ['1 m³ = 1 000 000 cm³ = 1000 liter', `${b3n(v)} m³ = ${b3n(v)} × 1000`, `= ${b3n(v * 1000)} liter`] }; },
  r => { const v = r.p([350, 1200, 2750, 500, 900, 1800]); return { v, from: 'ml', to: 'liter', a: v / 1000, work: ['1 liter = 1000 ml', `${v} ml = ${v} ÷ 1000`, `= ${b3n(v / 1000)} liter`] }; }
];
B3.unit = (r, i) => {
  const d = B3UNIT[i == null ? r.i(0, B3UNIT.length - 1) : i % B3UNIT.length](r), obj = r.p(['sebuah botol', 'sebuah tangki', 'sebuah baldi', 'sebuah bekas']);
  return GEN_LQ('unit', Object.assign(d, { obj, ans: `${b3n(d.a)} ${d.to}` }), { fig: b3Solid(Object.assign({ c: 'tr', label: 'Bekas' }, b3Box(2, 1.4, 1.8))) });
};
B3.ivCari = (r, i) => {
  const k = ['kuboid', 'kubus', 'silinder', 'kon', 'piramid'][i == null ? r.i(0, 4) : i % 5];
  let d;
  if (k === 'kuboid') { let p, l, t; do { p = r.i(4, 20); l = r.i(3, 12); t = r.i(2, 15); } while (p === l); const V = p * l * t; d = { nm: 'kuboid', given: ` dengan panjang ${p} cm dan lebar ${l} cm`, what: 'tinggi kuboid itu', V, ans: `${t} cm`, work: [`${p} × ${l} × t = ${V}`, `${p * l}t = ${V}`, `t = ${V} ÷ ${p * l} = ${t} cm`], fig: b3Solid(Object.assign({ c: 'pa', label: 'Kuboid', lab: [[0, 1, `${p} cm`], [1, 2, `${l} cm`], [2, 6, 't']] }, (() => { const [a, b, c] = b3vis([p, l, t]).map(x => x * 2.4); return b3Box(a, b, c); })())) }; }
  else if (k === 'kubus') { const s = r.i(2, 15), V = s ** 3; d = { nm: 'kubus', given: '', what: 'panjang sisi kubus itu', V, ans: `${s} cm`, work: [`s³ = ${V}`, `s = ∛${V}`, `= ${s} cm`], fig: B3F.kubus('s') }; }
  else if (k === 'silinder') { const j = r.p([3.5, 7, 7, 14]), t = r.i(2, 20), pi = B3P22, base = pi.m(j * j), V = base * t; d = { nm: 'silinder', given: ` berjejari ${b3n(j)} cm`, what: 'tinggi silinder itu', pi, V: b3n(V), ans: `${t} cm`, work: ['πj²t = ' + b3n(V), `22/7 × ${b3n(j)}² × t = ${b3n(V)}`, `${b3n(base)}t = ${b3n(V)}`, `t = ${b3n(V)} ÷ ${b3n(base)} = ${t} cm`], fig: b3Round([{ k: 'cyl', r: 1, h: 1.8, lr: `${b3n(j)} cm`, lh: 't' }], { label: 'Silinder' }) }; }
  else if (k === 'kon') { const j = r.p([3.5, 7, 7, 14]), t = 3 * r.i(1, 8), pi = B3P22, base = pi.m(j * j), V = base * t / 3; d = { nm: 'kon', given: ` berjejari ${b3n(j)} cm`, what: 'tinggi kon itu', pi, V: b3n(V), ans: `${t} cm`, work: ['⅓πj²t = ' + b3n(V), `⅓ × 22/7 × ${b3n(j)}² × t = ${b3n(V)}`, `${b3n(base)}t = ${b3n(V)} × 3 = ${b3n(3 * V)}`, `t = ${b3n(3 * V)} ÷ ${b3n(base)} = ${t} cm`], fig: b3Round([{ k: 'cone', r: 1, h: 2, lr: `${b3n(j)} cm`, lh: 't' }], { label: 'Kon' }) }; }
  else { let s, H; do { s = r.i(3, 15); H = r.i(3, 20); } while ((s * s * H) % 3); const V = s * s * H / 3; d = { nm: 'piramid tegak', given: ` bertapak segi empat sama bersisi ${s} cm`, what: 'tinggi piramid itu', V, ans: `${H} cm`, work: [`⅓ × ${s} × ${s} × H = ${V}`, `${s * s}H = ${V} × 3 = ${3 * V}`, `H = ${3 * V} ÷ ${s * s} = ${H} cm`], fig: B3F.piramid(s, null, H, 'H') }; }
  const v = GEN_LQ('ivCari', Object.assign(d, { pt: d.pi ? b3PiTx(d.pi) : '' }));
  return Object.assign(v, { fig: d.fig });
};
B3.pindah = (r, i) => {
  const m = i == null ? r.i(0, 3) : i % 4;
  if (m === 0) { // kuboid → silinder (j = 7, πj² = 154)
    const h = r.i(2, 9), [p, l, k] = r.p([[11, 14, 1], [22, 7, 1], [11, 7, 2], [14, 11, 1], [22, 14, .5], [28, 11, .5]]), t = h * k, V = p * l * t;
    return GEN_LQ('pindahA', { p, l, t: b3n(t), ans: `${h} cm`, work: [`Isi padu air = ${p} × ${l} × ${b3n(t)} = ${V} cm³`, 'Luas tapak silinder = 22/7 × 7² = 154 cm²', `Tinggi air = ${V} ÷ 154 = ${h} cm`] }, { fig: b3Round([{ k: 'cyl', r: 1, h: 1.8, lr: '7 cm', lh: '?' }], { label: 'Bekas silinder' }) });
  }
  if (m === 1) { // silinder → kuboid
    const t = r.i(3, 12), V = 154 * t, [p, l] = r.p([[11, 7], [14, 11], [22, 7], [14, 22], [11, 28]]), h = V / (p * l);
    return GEN_LQ('pindahB', { t, p, l, ans: b3u(h, 'cm'), work: [`Isi padu air = 22/7 × 7² × ${t} = ${V} cm³`, `Luas tapak kuboid = ${p} × ${l} = ${p * l} cm²`, `Kedalaman = ${V} ÷ ${p * l} ${b3eq(h, 'cm')}`] }, { fig: b3Round([{ k: 'cyl', r: 1, h: 1.6, lr: '7 cm', lh: `${t} cm` }], { label: 'Bekas silinder' }) });
  }
  if (m === 2) { // kapasiti silinder dalam liter
    const j = r.p([7, 14, 21, 10.5]), t = r.p([20, 30, 40, 50, 60]), V = B3P22.m(j * j * t);
    return GEN_LQ('pindahC', { j, t, ans: b3u(V / 1000, 'liter'), work: [`Isi padu = 22/7 × ${b3n(j)}² × ${t} = ${b3n(V)} cm³`, '1 liter = 1000 cm³', `Kapasiti = ${b3n(V)} ÷ 1000 ${b3eq(V / 1000, 'liter')}`] }, { fig: B3F.silinder(j, t) });
  }
  const [p, l, t] = r.p([[2, 1.5, 1], [3, 2, 1.5], [2.5, 2, 1.2], [1.5, 1.2, 1], [4, 2.5, 1.5], [2, 2, 0.8]]), V = p * l * t;
  return GEN_LQ('pindahD', { p, l, t, ans: b3u(V * 1000, 'liter'), work: [`Isi padu = ${p} × ${l} × ${t} = ${b3n(V)} m³`, '1 m³ = 1000 liter', `Isi padu = ${b3n(V)} × 1000 = ${b3n(V * 1000)} liter`] }, { fig: b3Solid(Object.assign({ c: 'tr', label: 'Kolam', lab: [[0, 1, `${p} m`], [1, 2, `${l} m`], [2, 6, `${t} m`]] }, (() => { const [a, b, c] = b3vis([p, l, t]).map(x => x * 2.4); return b3Box(a, b, c); })())) });
};
B3.ivTrap = r => {
  let a, b, h; do { a = r.i(6, 16); b = r.i(3, a - 2); h = r.i(3, 10); } while (((a + b) * h) % 2);
  const L = r.i(5, 20), A = (a + b) * h / 2, V = A * L;
  return GEN_LQ('ivTrap', { a, b, h, L, wrong: (a + b) * h * L, ans: `${V} cm³`, work: ['Isi padu = luas keratan rentas × panjang', `Luas trapezium = ½ × (${a} + ${b}) × ${h} = ${A} cm²`, `Isi padu = ${A} × ${L} = ${V} cm³`] }, { fig: B3F.prismaTrap(a, b, h, L) });
};
B3.k64 = r => {
  const j1 = b3Jej(r), p1 = b3PiFor(j1), t1 = r.i(4, 20), cp = { j: j1, t: t1, pi: p1, v1: p1.m(j1 * j1 * t1), v2: p1.m(4 * j1 ** 3) / 3 }; cp.V = cp.v1 + cp.v2;
  const j2 = r.p([2, 3, 3.5, 4, 7]), p2 = b3PiFor(j2), t2 = r.i(6, 15), ai = { j: j2, t: t2, pi: p2, v1: p2.m(j2 * j2 * t2) / 3, v2: p2.m(2 * j2 ** 3) / 3 }; ai.V = ai.v1 + ai.v2;
  const [hp, hl, ht, hj] = r.p([[10, 10, 12, 3.5], [14, 14, 10, 3.5], [20, 15, 10, 7], [12, 10, 8, 3], [15, 15, 20, 5], [10, 8, 15, 2]]), p3 = b3PiFor(hj), hb = { p: hp, l: hl, t: ht, j: hj, pi: p3, v1: hp * hl * ht, v2: p3.m(hj * hj * ht) }; hb.V = hb.v1 - hb.v2;
  const [R, rr] = r.p([[6, 2], [9, 3], [10, 2], [8, 2], [12, 3], [6, 3], [12, 4], [10, 5]]), lb = { R, r: rr, n: (R / rr) ** 3 };
  let tk; do { const p = r.p([60, 80, 100, 120, 150]), l = r.p([40, 50, 60]), t = r.p([30, 40, 50, 60]), rate = r.p([4, 5, 6, 8, 10, 12]), V = p * l * t; tk = { p, l, t, rate, V, L: V / 1000, min: V / 1000 / rate }; } while (!Number.isInteger(tk.min));
  const v = vq('k64', { cp, ai, hb, lb, tk });
  let fig;
  if (v.q.includes('kapsul')) { const [vr, vh] = b3vis([j1, t1]); fig = b3Round([{ k: 'hemiD', r: vr }, { k: 'cyl', r: vr, h: Math.max(.6, vh * 2), lh: `${t1} cm` }, { k: 'hemi', r: vr, lr: `${b3n(j1)} cm` }], { label: 'Kapsul' }); }
  else if (v.q.includes('aiskrim')) fig = b3Round([{ k: 'vcone', r: 1, h: 2.4, lh: `${t2} cm` }, { k: 'hemi', r: 1, lr: `${b3n(j2)} cm` }], { label: 'Aiskrim' });
  else if (v.q.includes('lubang')) fig = b3Fig('kuboid', { dims: [hp, hl, ht], c: 'pa' });
  else if (v.q.includes('dileburkan')) fig = b3Round([{ k: 'sph', r: 1, lr: `${R} cm` }], { label: 'Sfera logam' });
  else fig = b3Fig('kuboid', { dims: [tk.p, tk.l, tk.t], c: 'tr' });
  return { q: v.q, ans: v.ans, work: v.work, fig };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '6.1': {
    m: [() => B3.namaBentuk(b3RG), () => B3.kiraFEV(b3RG), () => B3.kiraFEV(b3RG), () => B3.ciri(b3RG), () => B3.ciriNama(b3RG), () => B3.keratan(b3RG), () => B3.bs(b3RG, B3BS1)],
    s: [() => B3.nGon(b3RG), () => B3.dariFEV(b3RG)], // rumus Euler dibuang: tiada dalam DSKP T2
    k: [() => B3.k61(b3RG)]
  },
  '6.2': {
    m: [() => B3.netNama(b3RG), () => B3.netNama(b3RG), () => B3.netKubus(b3RG), () => B3.netLain(b3RG), () => B3.lukis(b3RG)],
    s: [() => B3.netBertentang(b3RG), () => B3.netSil(b3RG), () => B3.netKuboid(b3RG)],
    k: [() => B3.k62(b3RG)]
  },
  '6.3': {
    m: ['kubus', 'kuboid', 'prisma', 'piramid', 'silinder', 'kon', 'sfera'].map(k => () => B3.lp(b3RG, k)),
    s: [() => B3.lpCari(b3RG), () => B3.lpCari(b3RG), () => B3.lpPyth(b3RG), () => B3.lpBuka(b3RG)],
    k: [() => B3.k63(b3RG)]
  },
  '6.4': {
    m: ['kubus', 'kuboid', 'prisma', 'prismaA', 'silinder', 'piramid', 'kon', 'sfera'].map(k => () => B3.iv(b3RG, k)).concat([() => B3.unit(b3RG)]),
    s: [() => B3.ivCari(b3RG), () => B3.ivCari(b3RG), () => B3.pindah(b3RG), () => B3.ivTrap(b3RG)],
    k: [() => B3.k64(b3RG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 6.1
WG.namaBentuk = i => B3.namaBentuk(b3RW, ['prisma3', 'piramid4', 'silinder', 'kon', 'prisma6', 'sfera', 'piramid3', 'kuboid'][i % 8]);
WG.kiraFEV = i => B3.kiraFEV(b3RW, i);
WG.ciri = i => B3.ciri(b3RW, i);
WG.ciriNama = i => B3.ciriNama(b3RW, ['kon', 'prisma3', 'piramid4', 'silinder'][i % 4]);
WG.keratan = () => B3.keratan(b3RW);
WG.bs1 = i => B3.bs(b3RW, B3BS1, [1, 4][i % 2] + wri(0, 1) * 2);
WG.nGon = i => B3.nGon(b3RW, i);
WG.dariFEV = i => B3.dariFEV(b3RW, i);
WG.euler = i => B3.euler(b3RW, i);
WG.k61 = () => B3.k61(b3RW);
// 6.2
WG.netNama = i => B3.netNama(b3RW, i);
WG.netKubus = i => B3.netKubus(b3RW, i);
WG.netLain = i => B3.netLain(b3RW, i);
WG.lukis = i => B3.lukis(b3RW, i);
WG.netBertentang = () => B3.netBertentang(b3RW);
WG.netSil = i => B3.netSil(b3RW, i);
WG.netKuboid = () => B3.netKuboid(b3RW);
WG.k62 = () => B3.k62(b3RW);
// 6.3
['kubus', 'kuboid', 'prisma', 'piramid', 'silinder', 'kon', 'sfera'].forEach(k => { WG['lp_' + k] = i => B3.lp(b3RW, k, i); });
WG.lpCari = i => B3.lpCari(b3RW, i);
WG.lpPyth = i => B3.lpPyth(b3RW, i);
WG.lpBuka = i => B3.lpBuka(b3RW, i);
WG.k63 = () => B3.k63(b3RW);
// 6.4
['kubus', 'kuboid', 'prisma', 'prismaA', 'silinder', 'piramid', 'kon', 'sfera'].forEach(k => { WG['iv_' + k] = i => B3.iv(b3RW, k, i); });
WG.unit = i => B3.unit(b3RW, i);
WG.ivCari = i => B3.ivCari(b3RW, i);
WG.pindah = i => B3.pindah(b3RW, i);
WG.ivTrap = () => B3.ivTrap(b3RW);
WG.k64 = () => B3.k64(b3RW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '6.1': [['m', 'namaBentuk', 4], ['m', 'kiraFEV', 5], ['m', 'ciri', 3], ['m', 'ciriNama', 2], ['m', 'keratan', 2], ['m', 'bs1', 2], ['s', 'nGon', 4], ['s', 'dariFEV', 5], ['k', 'k61', 3]],
  '6.2': [['m', 'netNama', 7], ['m', 'netKubus', 4], ['m', 'netLain', 3], ['m', 'lukis', 4], ['s', 'netBertentang', 3], ['s', 'netSil', 3], ['s', 'netKuboid', 3], ['k', 'k62', 3]],
  '6.3': [['m', 'lp_kubus', 2], ['m', 'lp_kuboid', 3], ['m', 'lp_prisma', 2], ['m', 'lp_piramid', 2], ['m', 'lp_silinder', 3], ['m', 'lp_kon', 3], ['m', 'lp_sfera', 3], ['s', 'lpCari', 5], ['s', 'lpPyth', 2], ['s', 'lpBuka', 2], ['k', 'k63', 3]],
  '6.4': [['m', 'iv_kuboid', 2], ['m', 'iv_kubus', 1], ['m', 'iv_prisma', 2], ['m', 'iv_prismaA', 1], ['m', 'iv_silinder', 3], ['m', 'iv_piramid', 2], ['m', 'iv_kon', 2], ['m', 'iv_sfera', 2], ['m', 'unit', 3], ['s', 'ivCari', 4], ['s', 'pindah', 3], ['s', 'ivTrap', 2], ['k', 'k64', 3]]
};

// bersihkan baris jalan kerja kosong (cth. jumlah pertengahan yang tidak tepat)
const b3Clean = f => (...a) => { const q = f(...a); q.work = (q.work || []).filter(Boolean); return q; };
Object.keys(GEN).forEach(sub => ['m', 's', 'k'].forEach(l => { GEN[sub][l] = GEN[sub][l].map(b3Clean); }));
Object.keys(WG).forEach(k => { WG[k] = b3Clean(WG[k]); });

/* =================== GAMES: soalan pilih jawapan =================== */
function b3OptsN(ans, cands, unit) {
  const f = v => b3n(v) + (unit ? ' ' + unit : ''), A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !isFinite(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const st = Number.isInteger(ans) ? Math.max(1, Math.round(ans * .1)) : Math.max(.5, Math.round(ans * 10) / 100);
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * st; if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function b3OptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const b3Mcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const B3NAMES = B3ALLK.map(k => vcap(B3S[k].nm));
const CQGEN = {
  sifat: [
    () => { const k = pick(B3ALLK); return b3Mcq('Namakan bentuk 3D ini.', b3Fig(k), b3OptsT(vcap(B3S[k].nm), [vcap(B3CONF[k])].concat(shuffle(B3NAMES)))); },
    () => {
      if (Math.random() < .3) { const k = pick(['silinder', 'kon', 'sfera']), s = B3S[k], [a, v] = pick([['permukaan rata', s.rata], ['permukaan melengkung', s.lengkung], ['bucu', s.bucu]]); return b3Mcq(`Berapakah bilangan <b>${a}</b> bagi ${s.nm}?`, b3Fig(k), b3OptsT(String(v), ['0', '1', '2', '3'])); }
      const k = pick(B3POLYK), s = B3S[k], what = pick(['muka', 'tepi', 'bucu']), ans = { muka: s.F, tepi: s.E, bucu: s.V }[what];
      return b3Mcq(`Berapakah bilangan <b>${what}</b> bagi ${s.nm} ini?`, b3Fig(k), b3OptsN(ans, [s.F, s.E, s.V, ans - 1, ans + 1, ans + 2], ''));
    },
    () => {
      const pr = Math.random() < .5, n = pick([5, 6, 7, 8, 9, 10]), [F, E, V] = pr ? [n + 2, 3 * n, 2 * n] : [n + 1, 2 * n, n + 1], what = pick(['muka', 'tepi', 'bucu']), ans = { muka: F, tepi: E, bucu: V }[what];
      if (Math.random() < .35) { const nm = vcap(pr ? `prisma ${B3POLY[n]}` : `piramid tapak ${B3POLY[n]}`), alt = [pr ? `Piramid tapak ${B3POLY[n]}` : `Prisma ${B3POLY[n]}`, vcap(pr ? `prisma ${B3POLY[n + 1] || B3POLY[n - 1]}` : `piramid tapak ${B3POLY[n + 1] || B3POLY[n - 1]}`), vcap(pr ? `piramid tapak ${B3POLY[n - 1]}` : `prisma ${B3POLY[n - 1]}`)]; return b3Mcq(`Sebuah pepejal mempunyai ${F} muka, ${E} tepi dan ${V} bucu. Namakan pepejal itu.`, b3Fig(pr ? 'prisma6' : 'piramid5'), b3OptsT(nm, alt)); }
      return b3Mcq(`Berapakah bilangan <b>${what}</b> sebuah ${pr ? `prisma ${B3POLY[n]}` : `piramid tapak ${B3POLY[n]}`}?`, b3Fig(pr ? (n === 5 ? 'prisma5' : 'prisma6') : 'piramid5'), b3OptsN(ans, [F, E, V, ans + 1, ans - 1, pr ? 2 * n + 2 : 2 * n + 1], ''));
    }
  ],
  bentangan: [
    () => { const k = pick(B3NETK); return b3Mcq('Bentangan ini membentuk pepejal apa?', b3NetFig(b3RG, k), b3OptsT(vcap(B3S[k].nm), [vcap(B3NETCL[k])].concat(shuffle(B3NETK.map(x => vcap(B3S[x].nm)))))); },
    () => {
      if (Math.random() < .3) { const ok = Math.random() < .5, c = b3CubeNet(b3RG, ok), o = ['Ya, boleh membentuk kubus', 'Tidak, ada muka yang bertindih', 'Ya, boleh membentuk kuboid', 'Tidak, kurang satu muka']; return { type: 'mcq', q: 'Bolehkah bentangan ini dilipat menjadi kubus?', fig: b3CellFig(c), opts: o, c: ok ? 0 : 1 }; }
      const cells = b3CubeNet(b3RG, true), face = b3Fold(cells), labs = shuffle(['A', 'B', 'C', 'D', 'E', 'F']), xi = ri(0, 5), oi = face.findIndex(f => f === (face[xi] ^ 1));
      return b3Mcq(`Muka manakah bertentangan dengan muka <b>${labs[xi]}</b>?`, b3CellFig(cells, labs, { hi: xi }), b3OptsT(labs[oi], labs.filter((_, j) => j !== xi)));
    },
    () => {
      if (Math.random() < .5) { const j = pick([3.5, 7, 14, 10.5]), L = 44 * j / 7; return b3Mcq(`Silinder berjejari ${b3n(j)} cm. Berapakah panjang segi empat tepat dalam bentangannya? (π = 22/7)`, b3CylNet([[.5, true], [.5, false]], { tw: '?' }), b3OptsN(L, [22 * j / 7, 22 * j * j / 7, 2 * j, L * 2, j * 3.14], 'cm')); }
      const [j, s] = pick([[3, 5], [4, 5], [3, 6], [2, 6], [3, 9], [4, 6], [5, 9], [2, 8], [5, 12]]), th = 360 * j / s;
      return b3Mcq(`Kon berjejari ${j} cm dan tinggi sendeng ${s} cm. Berapakah sudut sektor dalam bentangannya?`, b3ConeNet(th, { ts: 'θ', tl: `${s} cm` }), b3OptsN(th, [180 * j / s, 360 - th, th + 30, 360 * s / j], '°'));
    }
  ],
  luas: [
    () => {
      if (Math.random() < .5) { const s = ri(2, 12), A = 6 * s * s; return b3Mcq(`Kubus bersisi ${s} cm. Berapakah luas permukaannya?`, B3F.kubus(s), b3OptsN(A, [4 * s * s, s ** 3, s * s, 12 * s], 'cm²')); }
      let p, l, t; do { p = ri(3, 12); l = ri(2, 9); t = ri(2, 8); } while (p === l || l === t || p === t);
      const A = 2 * (p * l + p * t + l * t); return b3Mcq('Berapakah luas permukaan kuboid ini?', B3F.kuboid(p, l, t), b3OptsN(A, [A / 2, p * l * t, A - 2 * p * l, 2 * (p + l + t)], 'cm²'));
    },
    () => {
      const k = pick(['silinder', 'sfera', 'kon']), j = pick([3.5, 7, 14]), pi = B3P22;
      if (k === 'silinder') { const t = ri(3, 15), A = pi.m(2 * j * j + 2 * j * t); return b3Mcq(`Silinder tertutup: j = ${b3n(j)} cm, t = ${t} cm. Luas permukaan? (π = 22/7)`, B3F.silinder(j, t), b3OptsN(A, [pi.m(j * j + 2 * j * t), pi.m(2 * j * t), pi.m(j * j * t), pi.m(2 * j * j + j * t)], 'cm²')); }
      if (k === 'sfera') { const A = pi.m(4 * j * j); return b3Mcq(`Sfera berjejari ${b3n(j)} cm. Luas permukaan? (π = 22/7)`, B3F.sfera(j), b3OptsN(A, [pi.m(j * j), pi.m(2 * j * j), pi.m(4 * j ** 3) / 3, pi.m(3 * j * j)], 'cm²')); }
      const s = Math.ceil(j) + ri(3, 10), A = pi.m(j * j + j * s); return b3Mcq(`Kon: j = ${b3n(j)} cm, tinggi sendeng ${s} cm. Luas permukaan? (π = 22/7)`, B3F.kon(j, s), b3OptsN(A, [pi.m(j * s), pi.m(j * j), pi.m(2 * j * s + j * j), pi.m(j * j + 2 * j * s)], 'cm²'));
    },
    () => {
      const m = ri(0, 2);
      if (m === 0) { const [hb, H, hs] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 3, 5], [8, 6, 10]]), s = 2 * hb, A = s * s + 2 * s * hs; return b3Mcq(`Piramid tapak segi empat sama bersisi ${s} cm, tinggi tegak ${H} cm. Luas permukaan?`, B3F.piramid(s, null, H), b3OptsN(A, [s * s + 2 * s * H, s * s + 4 * s * hs, 2 * s * hs, s * s * H / 3], 'cm²')); }
      if (m === 1) { const s = ri(2, 12), A = 6 * s * s; return b3Mcq(`Luas permukaan sebuah kubus ialah ${A} cm². Berapakah panjang sisinya?`, B3F.kubus('s'), b3OptsN(s, [A / 6, A / 4, Math.sqrt(A / 4), s + 1, s * 2], 'cm')); }
      const j = pick([3.5, 7, 14]), A = 88 * j * j / 7; return b3Mcq(`Luas permukaan sebuah sfera ialah ${b3n(A)} cm². Berapakah jejarinya? (π = 22/7)`, B3F.sfera('j'), b3OptsN(j, [2 * j, j * j, j / 2, j + 7], 'cm'));
    }
  ],
  isipadu: [
    () => {
      const m = ri(0, 2);
      if (m === 0) { let p, l, t; do { p = ri(3, 12); l = ri(2, 9); t = ri(2, 10); } while (p === l || l === t); const V = p * l * t; return b3Mcq('Berapakah isi padu kuboid ini?', B3F.kuboid(p, l, t), b3OptsN(V, [2 * (p * l + p * t + l * t), p * l, p + l + t, V / 2], 'cm³')); }
      if (m === 1) { const s = ri(2, 10), V = s ** 3; return b3Mcq(`Isi padu kubus bersisi ${s} cm?`, B3F.kubus(s), b3OptsN(V, [6 * s * s, s * s, 3 * s, 4 * s * s], 'cm³')); }
      const d = pick(B3UNIT)(b3RG); return b3Mcq(`${d.v} ${d.from} = ? ${d.to}`, b3Solid(Object.assign({ c: 'tr', label: 'Bekas' }, b3Box(2, 1.4, 1.8))), b3OptsN(d.a, [d.a * 10, d.a / 10, d.a * 100, d.a / 100], d.to));
    },
    () => {
      const k = pick(['silinder', 'kon', 'piramid']);
      if (k === 'silinder') { const j = pick([3.5, 7, 14]), t = ri(2, 12), V = B3P22.m(j * j * t); return b3Mcq(`Silinder: j = ${b3n(j)} cm, t = ${t} cm. Isi padu? (π = 22/7)`, B3F.silinder(j, t), b3OptsN(V, [B3P22.m(2 * j * t), B3P22.m(4 * j * j * t), V / 3, B3P22.m(j * t)], 'cm³')); }
      if (k === 'kon') { const j = pick([3.5, 7, 14]), t = 3 * ri(1, 6), V = B3P22.m(j * j * t) / 3; return b3Mcq(`Kon: j = ${b3n(j)} cm, t = ${t} cm. Isi padu? (π = 22/7)`, B3F.kon(j, null, t), b3OptsN(V, [V * 3, V / 2 * 3 / 2, B3P22.m(j * t), V * 2], 'cm³')); }
      let s, H; do { s = ri(3, 12); H = ri(3, 15); } while ((s * s * H) % 3); const V = s * s * H / 3;
      return b3Mcq(`Piramid tapak segi empat sama bersisi ${s} cm, tinggi ${H} cm. Isi padu?`, B3F.piramid(s, null, H), b3OptsN(V, [3 * V, s * s * H / 2, s * H, 2 * V], 'cm³'));
    },
    () => {
      const m = ri(0, 2);
      if (m === 0) { const j = pick([3, 6, 9, 21, 7]), pi = b3PiFor(j), V = pi.m(4 * j ** 3) / 3; return b3Mcq(`Sfera berjejari ${j} cm. Isi padu?${b3PiTx(pi).replace('Guna ', '')}`, B3F.sfera(j), b3OptsN(V, [pi.m(4 * j * j), pi.m(j ** 3), V * 3 / 4 * 2, pi.m(4 * j * j) / 3], 'cm³')); }
      if (m === 1) { const j = pick([3.5, 7, 14]), t = ri(2, 15), V = B3P22.m(j * j * t); return b3Mcq(`Isi padu silinder berjejari ${b3n(j)} cm ialah ${b3n(V)} cm³. Tinggi silinder? (π = 22/7)`, b3Round([{ k: 'cyl', r: 1, h: 1.8, lr: `${b3n(j)} cm`, lh: 't' }], { label: 'Silinder' }), b3OptsN(t, [t * 2, t + 3, V / (B3P22.m(2 * j)), t * 3], 'cm')); }
      const [R, rr] = pick([[6, 2], [9, 3], [8, 2], [6, 3], [10, 5]]), n = (R / rr) ** 3;
      return b3Mcq(`Sfera berjejari ${R} cm dileburkan menjadi sfera kecil berjejari ${rr} cm. Berapa biji sfera kecil?`, b3Round([{ k: 'sph', r: 1, lr: `${R} cm` }], { label: 'Sfera' }), b3OptsN(n, [R / rr, (R / rr) ** 2, 3 * R / rr, n / 2], 'biji'));
    }
  ]
};
const CQT = { sifat: 'Muka, tepi & bucu', bentangan: 'Bentangan', luas: 'Luas permukaan', isipadu: 'Isi padu' };
function b3CqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.sifat;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['sifat', 'sifat', 'bentangan', 'luas', 'isipadu'] : Object.keys(CQT);
  return b3CqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return b3CqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
