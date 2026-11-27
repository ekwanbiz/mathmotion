'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_pelan_en.py; jangan sunting dengan tangan. */
/* =================== PELAN · SOALAN BAB 7 PELAN DAN DONGAKAN (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pd" / "PD" supaya tidak bertembung dengan teras.

/* =================== pembantu rawak & nombor =================== */
// pdRG untuk Latihan Kelas / games, pdRW (berbenih) untuk Lembaran Kerja
const pdRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const pdRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const pdShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pdN = x => { let v = Math.round(x * 100) / 100; if (Math.abs(v) < 1e-9) v = 0; return String(v); };   // nombor kemas
const pdDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const pdSum = a => a.reduce((s, x) => s + x, 0);

/* =================== data pandangan =================== */
const PDV = ['pelan', 'depan', 'sisi'];
const PDVN = { pelan: 'plan', depan: 'front elevation', sisi: 'side elevation' };
const PDVC = { pelan: 'gr', depan: 'tr', sisi: 'pk' };
const PDARAH = { pelan: 'above', depan: 'the front', sisi: 'the side (right)' };
const PDSATAH = { pelan: 'horizontal plane', depan: 'vertical plane', sisi: 'vertical plane' };
const PDHUR = [['X', 'Y', 'Z'], ['P', 'Q', 'R'], ['J', 'K', 'L'], ['A', 'B', 'C'], ['M', 'N', 'T'], ['U', 'V', 'W']];
const PDTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]];

/* =================== enjin pepejal kiub (voxel) =================== */
// x ke kanan (panjang), y ke belakang (lebar), z ke atas (tinggi). Peta tinggi Hm: baris BELAKANG dahulu, baris DEPAN terakhir.
function pdVox(Hm) {
  const S = new Set(), n = Hm.length;
  Hm.forEach((row, r) => row.forEach((h, x) => { for (let z = 0; z < h; z++) S.add(`${x},${n - 1 - r},${z}`); }));
  return S;
}
const pdHas = (S, x, y, z) => S.has(`${x},${y},${z}`);
const pdCubes = S => [...S].map(k => k.split(',').map(Number));
// grid pandangan: Map 'u,v' -> Set kedalaman (kecil = dekat pemerhati). Dongakan sisi dilihat dari KANAN: depan objek di sebelah kiri.
function pdVGrid(S, kind) {
  const g = new Map();
  for (const [x, y, z] of pdCubes(S)) {
    const [u, v, d] = kind === 'pelan' ? [x, y, -z] : kind === 'depan' ? [x, z, y] : [y, z, -x];
    const k = `${u},${v}`; if (!g.has(k)) g.set(k, new Set()); g.get(k).add(d);
  }
  return g;
}
function pdMerge(segs) {
  const hs = {}, vs = {}, out = [];
  for (const [a, b] of segs) {
    if (a[1] === b[1]) (hs[a[1]] = hs[a[1]] || []).push([Math.min(a[0], b[0]), Math.max(a[0], b[0])]);
    else (vs[a[0]] = vs[a[0]] || []).push([Math.min(a[1], b[1]), Math.max(a[1], b[1])]);
  }
  const run = (L, mk) => { L.sort((p, q) => p[0] - q[0]); let [s, e] = L[0]; for (const [a, b] of L.slice(1)) { if (a === e) e = b; else { out.push(mk(s, e)); [s, e] = [a, b]; } } out.push(mk(s, e)); };
  Object.keys(hs).forEach(y => run(hs[y], (s, e) => [[s, +y], [e, +y]]));
  Object.keys(vs).forEach(x => run(vs[x], (s, e) => [[+x, s], [+x, e]]));
  return out.sort((p, q) => p[0][0] - q[0][0] || p[0][1] - q[0][1] || p[1][0] - q[1][0] || p[1][1] - q[1][1]);
}
// garis pandangan: penuh jika kedalaman muka hadapan berbeza; putus-putus jika sama tetapi ada tepi di belakang
function pdLines(S, kind) {
  const g = pdVGrid(S, kind); let w = 0, h = 0;
  for (const k of g.keys()) { const [u, v] = k.split(',').map(Number); w = Math.max(w, u + 1); h = Math.max(h, v + 1); }
  const vis = [], hid = [];
  const get = (u, v) => g.get(`${u},${v}`) || new Set();
  const edge = (A, B, seg) => {
    if (!A.size && !B.size) return;
    const fa = A.size ? Math.min(...A) : null, fb = B.size ? Math.min(...B) : null;
    if (fa !== fb) { vis.push(seg); return; }
    for (const d of A) if (!B.has(d)) { hid.push(seg); return; }
    for (const d of B) if (!A.has(d)) { hid.push(seg); return; }
  };
  for (let u = 0; u <= w; u++) for (let v = 0; v < h; v++) edge(get(u - 1, v), get(u, v), [[u, v], [u, v + 1]]);
  for (let v = 0; v <= h; v++) for (let u = 0; u < w; u++) edge(get(u, v - 1), get(u, v), [[u, v], [u + 1, v]]);
  const cells = [...g.keys()].map(k => k.split(',').map(Number));
  return { w, h, vis: pdMerge(vis), hid: pdMerge(hid), cells };
}
const pdSig = L => `${L.w}x${L.h}|${L.vis.map(s => s.flat().join(',')).join(';')}|${L.hid.map(s => s.flat().join(',')).join(';')}`;
const pdMirror = L => {
  const f = s => { const a = [L.w - s[1][0], s[1][1]], b = [L.w - s[0][0], s[0][1]]; return a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? [a, b] : [b, a]; };
  return { w: L.w, h: L.h, vis: pdMerge(L.vis.map(f)), hid: pdMerge(L.hid.map(f)), cells: L.cells.map(([u, v]) => [L.w - 1 - u, v]) };
};
const pdNoHid = L => ({ w: L.w, h: L.h, vis: L.vis, hid: [], cells: L.cells });
const pdHidSolid = L => ({ w: L.w, h: L.h, vis: pdMerge(L.vis.concat(L.hid).flatMap(([a, b]) => { const r = []; if (a[0] === b[0]) for (let t = a[1]; t < b[1]; t++) r.push([[a[0], t], [a[0], t + 1]]); else for (let t = a[0]; t < b[0]; t++) r.push([[t, a[1]], [t + 1, a[1]]]); return r; })), hid: [], cells: L.cells });
// perimeter kawasan sel (unit tepi sempadan)
const pdPerim = cells => { const s = new Set(cells.map(c => c.join(','))); let p = 0; for (const [u, v] of cells) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { if (!s.has(`${u + a},${v + b}`)) p++; }); return p; };
// tinggi lajur dongakan depan (kiri → kanan) dan dongakan sisi (depan → belakang)
const pdColH = Hm => Hm[0].map((_, x) => Math.max(...Hm.map(r => r[x])));
const pdRowH = Hm => Hm.map(r => Math.max(...r)).reverse();

/* ---------- penjana peta tinggi rawak (bersambung, tiada baris/lajur kosong) ---------- */
function pdConnected(Hm) {
  const D = Hm.length, W = Hm[0].length, cells = [];
  for (let r = 0; r < D; r++) for (let c = 0; c < W; c++) if (Hm[r][c]) cells.push([r, c]);
  if (!cells.length) return false;
  const seen = new Set([cells[0].join(',')]), st = [cells[0]];
  while (st.length) { const [r, c] = st.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const R = r + a, Cc = c + b; if (R >= 0 && R < D && Cc >= 0 && Cc < W && Hm[R][Cc] && !seen.has(`${R},${Cc}`)) { seen.add(`${R},${Cc}`); st.push([R, Cc]); } }); }
  return seen.size === cells.length && Hm.every(row => row.some(h => h)) && Hm[0].map((_, c) => Hm.some(row => row[c])).every(Boolean);
}
// o = { W:[a,b], D:[a,b], H:[a,b], zero: peluang sel kosong, full: tiada sel kosong }
function pdRandH(r, o) {
  o = Object.assign({ W: [2, 3], D: [2, 2], H: [1, 3], zero: .2 }, o || {});
  for (let t = 0; t < 400; t++) {
    const W = r.i(o.W[0], o.W[1]), D = r.i(o.D[0], o.D[1]);
    const Hm = Array.from({ length: D }, () => Array.from({ length: W }, () => (!o.full && r.f() < o.zero ? 0 : r.i(o.H[0], o.H[1]))));
    if (!pdConnected(Hm)) continue;
    if (o.cond && !o.cond(Hm)) continue;
    return Hm;
  }
  return [[2, 1], [1, 1]];
}
// tiga pandangan berbeza antara satu sama lain (supaya soalan tidak samar)
const pdDistinct = Hm => { const S = pdVox(Hm), s = PDV.map(k => pdSig(pdLines(S, k))); return s[0] !== s[1] && s[0] !== s[2] && s[1] !== s[2]; };
const pdHasHid = (Hm, kind) => pdLines(pdVox(Hm), kind).hid.length > 0;
const pdNotSym = (Hm, kind) => { const L = pdLines(pdVox(Hm), kind); return pdSig(L) !== pdSig(pdMirror(L)); };

/* =================== rajah =================== */
const PDF = 'font-family="Inter, sans-serif"';
const pdT = (x, y, t, c = 'tx', sz = 17, a = 'middle') => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pdL = (p, q, c, w = 3, dash) => `<line x1="${+p[0].toFixed(1)}" y1="${+p[1].toFixed(1)}" x2="${+q[0].toFixed(1)}" y2="${+q[1].toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="${dash ? 'butt' : 'round'}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const pdPoly = (pts, c, op, stroke, sw = 2.5) => `<polygon points="${pts.map(p => `${+p[0].toFixed(1)},${+p[1].toFixed(1)}`).join(' ')}" style="fill:var(--${c});fill-opacity:${op};stroke:${stroke ? `var(--${stroke})` : 'none'}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const pdArrow = (p, q, c, w = 3.5, hd = 11) => {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const a = [q[0] - ux * hd - uy * hd * .6, q[1] - uy * hd + ux * hd * .6], b = [q[0] - ux * hd + uy * hd * .6, q[1] - uy * hd - ux * hd * .6];
  return pdL(p, q, c, w) + `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${q[0].toFixed(1)} ${q[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}" style="fill:none;stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
// unjuran isometri: pemerhati di depan-kanan-atas (sama seperti slaid)
const PDC30 = Math.cos(Math.PI / 6);
const pdIso = ([x, y, z]) => [(x + y) * PDC30, (x - y) * .5 - z];
// lukis pepejal kiub; o = { k, col, cubes, arrows:{depan, sisi, atas} (label huruf), pad }
function pdIsoParts(S, o) {
  o = Object.assign({ k: 30, col: 'pa', cubes: true }, o || {});
  const cs = pdCubes(S), k = o.k;
  const X = Math.max(...cs.map(c => c[0])) + 1, Y = Math.max(...cs.map(c => c[1])) + 1, Z = Math.max(...cs.map(c => c[2])) + 1;
  const P = p => { const [a, b] = pdIso(p); return [a * k, b * k]; };
  const pts = [];
  cs.forEach(([x, y, z]) => [0, 1].forEach(a => [0, 1].forEach(b => [0, 1].forEach(c => pts.push(P([x + a, y + b, z + c]))))));
  const ar = o.arrows || {}, A = [];
  if (ar.depan) { const e = [X / 2, -.15, Math.min(Z, 2) / 2], s = [X / 2, -1.7, Math.min(Z, 2) / 2]; A.push([P(s), P(e), 'tr', ar.depan, P([X / 2, -2.15, Math.min(Z, 2) / 2])]); }
  if (ar.sisi) { const e = [X + .15, Y / 2, Math.min(Z, 2) / 2], s = [X + 1.7, Y / 2, Math.min(Z, 2) / 2]; A.push([P(s), P(e), 'pk', ar.sisi, P([X + 2.15, Y / 2, Math.min(Z, 2) / 2])]); }
  if (ar.atas) {
    const top = cs.reduce((b, c) => (c[2] > b[2] || (c[2] === b[2] && (c[0] - c[1]) > (b[0] - b[1])) ? c : b));
    const e = [top[0] + .5, top[1] + .5, top[2] + 1.15], s = [top[0] + .5, top[1] + .5, Z + 1.6];
    A.push([P(s), P(e), 'gr', ar.atas, P([top[0] + .5, top[1] + .5, Z + 2.0])]);
  }
  A.forEach(a => { const hw = String(a[3]).length * 5.5 + 4; pts.push(a[0], [a[4][0] - hw, a[4][1] - 10], [a[4][0] + hw, a[4][1] + 10]); });
  let s = '';
  const order = cs.slice().sort((a, b) => (a[0] - a[1] + a[2]) - (b[0] - b[1] + b[2]) || a[2] - b[2]);
  for (const [x, y, z] of order) {
    const F = [];
    if (!pdHas(S, x, y, z + 1)) F.push(['t', [[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], .55]);
    if (!pdHas(S, x, y - 1, z)) F.push(['f', [[x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]], .34]);
    if (!pdHas(S, x + 1, y, z)) F.push(['r', [[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], .18]);
    for (const [kd, q, op] of F) {
      const pp = q.map(P);
      s += pdPoly(pp, 'surf', 1) + pdPoly(pp, o.col, op);
      for (let i = 0; i < 4; i++) {
        const a = q[i], b = q[(i + 1) % 4];
        if (!o.cubes && pdCont(S, kd, [x, y, z], a, b)) continue;
        s += pdL(P(a), P(b), 'tx', 2.2);
      }
    }
  }
  A.forEach(([p, q, c, lab, lp]) => { s += pdArrow(p, q, c) + pdT(lp[0], lp[1], lab, c, 18); });
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { s, x0: Math.min(...xs) - 14, y0: Math.min(...ys) - 14, x1: Math.max(...xs) + 14, y1: Math.max(...ys) + 14 };
}
function pdCont(S, kd, [x, y, z], a, b) {
  const mid = [0, 1, 2].map(i => (a[i] + b[i]) / 2), ctr = { t: [x + .5, y + .5, z + 1], f: [x + .5, y, z + .5], r: [x + 1, y + .5, z + .5] }[kd];
  const off = [0, 1, 2].map(i => (Math.abs(mid[i] - ctr[i]) > .25 ? Math.sign(mid[i] - ctr[i]) : 0));
  const n = [x + off[0], y + off[1], z + off[2]];
  if (!pdHas(S, ...n)) return false;
  const cov = { t: [n[0], n[1], n[2] + 1], f: [n[0], n[1] - 1, n[2]], r: [n[0] + 1, n[1], n[2]] }[kd];
  return !pdHas(S, ...cov);
}
const pdWrap = (inner, x0, y0, w, h, label) => `<svg viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}" role="img" aria-label="${esc(label)}" ${PDF}>${inner}</svg>`;
function pdIsoSvg(S, o) { const r = pdIsoParts(S, o); return pdWrap(r.s, r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0, (o && o.label) || 'A solid built from cubes'); }
// lukis satu pandangan (L dari pdLines) dengan sudut kiri-bawah (x0, y0) dan unit k piksel
function pdViewParts(L, x0, y0, k, o) {
  o = Object.assign({ col: 'tr', grid: true, fill: true }, o || {});
  const X = u => x0 + u * k, Y = v => y0 - v * k;
  let s = '';
  if (o.grid) { const gw = o.gw || L.w, gh = o.gh || L.h; for (let i = 0; i <= gw; i++) s += pdL([X(i), Y(0)], [X(i), Y(gh)], 'grid', 1.5, '1 0'); for (let j = 0; j <= gh; j++) s += pdL([X(0), Y(j)], [X(gw), Y(j)], 'grid', 1.5, '1 0'); }
  if (o.fill) L.cells.forEach(([u, v]) => { s += pdPoly([[X(u), Y(v)], [X(u + 1), Y(v)], [X(u + 1), Y(v + 1)], [X(u), Y(v + 1)]], o.col, .14); });
  L.hid.forEach(([p, q]) => { s += pdL([X(p[0]), Y(p[1])], [X(q[0]), Y(q[1])], o.col, Math.max(2, k / 14), `${(k / 6).toFixed(1)} ${(k / 9).toFixed(1)}`); });
  L.vis.forEach(([p, q]) => { s += pdL([X(p[0]), Y(p[1])], [X(q[0]), Y(q[1])], o.col, Math.max(2.5, k / 11)); });
  return s;
}
function pdViewSvg(L, o) {
  o = Object.assign({ k: 34, col: 'tr', pad: 12 }, o || {});
  const k = o.k, pad = o.pad, W = Math.max(L.w * k + 2 * pad, o.title ? o.title.length * 9.5 + 16 : 0), H = L.h * k + 2 * pad + (o.title ? 26 : 0);
  let s = pdViewParts(L, (W - L.w * k) / 2, H - pad, k, o);
  if (o.title) s += pdT(W / 2, 14, o.title, o.col, 16);
  const st = o.h ? ` style="height:${o.h}px;width:${Math.round(W * o.h / H)}px;max-width:100%;display:block;flex:none"` : '';
  return `<svg viewBox="0 0 ${W} ${H}"${st} role="img" aria-label="${esc(o.label || 'Drawing of a view')}" ${PDF}>${s}</svg>`;
}
// pepejal + beberapa lukisan berlabel (A, B, C ...)
function pdIsoOpts(S, arrows, Ls, labs, col) {
  const iso = pdIsoParts(S, { k: 28, arrows });
  const k = 24, gap = 22;
  const maxH = Math.max(...Ls.map(L => L.h)), maxW = Math.max(...Ls.map(L => L.w));
  const cw = maxW * k + 16, ch = maxH * k + 40;
  const isoW = iso.x1 - iso.x0, isoH = iso.y1 - iso.y0;
  const H = Math.max(isoH, ch) + 8, ox = isoW + gap;
  let s = `<g transform="translate(${(-iso.x0).toFixed(1)} ${((H - isoH) / 2 - iso.y0).toFixed(1)})">${iso.s}</g>`;
  Ls.forEach((L, i) => {
    const x = ox + i * (cw + 10), base = (H + ch) / 2 - 8;
    s += `<rect x="${x}" y="${((H - ch) / 2).toFixed(1)}" width="${cw}" height="${ch}" rx="10" style="fill:none;stroke:var(--bd)" stroke-width="1.5"/>`;
    s += pdT(x + cw / 2, (H - ch) / 2 + 15, labs[i], 'tx', 17);
    s += pdViewParts(L, x + (cw - L.w * k) / 2, base, k, { col, grid: false });
  });
  const W = ox + Ls.length * (cw + 10) - 10;
  return pdWrap(s, 0, 0, W, H, 'A solid and several drawings of its views');
}
// pepejal + grid kosong untuk melukis
function pdIsoGrid(S, arrows, gw, gh, L, col) {
  const iso = pdIsoParts(S, { k: 28, arrows }), k = 26, gap = 24;
  const isoW = iso.x1 - iso.x0, isoH = iso.y1 - iso.y0, GW = gw * k, GH = gh * k;
  const H = Math.max(isoH, GH + 16) + 4, ox = isoW + gap, base = (H + GH) / 2;
  let s = `<g transform="translate(${(-iso.x0).toFixed(1)} ${((H - isoH) / 2 - iso.y0).toFixed(1)})">${iso.s}</g>`;
  const blank = { w: gw, h: gh, vis: [], hid: [], cells: [] };
  s += pdViewParts(blank, ox, base, k, { grid: true, fill: false });
  if (L) s += pdViewParts(L, ox + k, base - k, k, { col, grid: false });
  return pdWrap(s, 0, 0, ox + GW + 4, H, L ? 'A solid and the answer drawing on a grid' : 'A solid and a grid for drawing');
}
// pelan bernombor (nombor = tinggi lajur)
function pdPlanNum(Hm, o) {
  o = o || {};
  const k = 52, D = Hm.length, W = Hm[0].length, pad = 14, top = o.title === false ? pad : 34;
  let s = o.title === false ? '' : pdT(pad + W * k / 2, 15, 'Plan', 'gr', 16);
  Hm.forEach((row, r) => row.forEach((h, c) => {
    const x = pad + c * k, y = top + r * k;
    if (h) s += pdPoly([[x, y], [x + k, y], [x + k, y + k], [x, y + k]], 'gr', .14, 'gr', 3) + pdT(x + k / 2, y + k / 2, String(h), 'tx', 24);
    else s += `<rect x="${x}" y="${y}" width="${k}" height="${k}" style="fill:none;stroke:var(--grid)" stroke-width="1.5"/>`;
  }));
  s += pdT(pad + W * k / 2, top + D * k + 16, 'front ↓', 'tr', 14);
  return `<svg viewBox="0 0 ${W * k + 2 * pad} ${top + D * k + 30}" role="img" aria-label="Numbered plan: the numbers are the number of cubes in each column" ${PDF}>${s}</svg>`;
}
// baji (prisma segi tiga terbaring): tinggi a, tapak b, condong c, panjang l; lab = huruf [atas, bawah]
function pdWedge(a, b, l, o) {
  o = o || {};
  const sc = 150 / Math.max(a + l * .55, b + l * .55, 1), K = sc;
  const P = ([x, y, z]) => { const [u, v] = pdIso([x, y, z]); return [u * K, v * K]; };
  const A = [0, 0, a], Bp = [b, 0, 0], O = [0, 0, 0], A2 = [0, l, a], B2 = [b, l, 0];
  let s = '';
  const zp = o.plane ? -Math.max(a, 2) * .9 : null;
  if (o.plane) {
    const pl = [[-.5, -.5, zp], [b + .5, -.5, zp], [b + .5, l + .5, zp], [-.5, l + .5, zp]].map(P);
    s += pdPoly(pl, 'dim', .5, 'mu2', 1.5) + pdPoly([[0, 0, zp], [b, 0, zp], [b, l, zp], [0, l, zp]].map(P), 'gr', .25, 'gr', 2.5);
    [A, Bp, A2].forEach(p => { s += pdL(P(p), P([p[0], p[1], zp]), 'am', 2, '6 5'); });
    s += pdL(P([0, 0, zp]), P([b, 0, zp]), 'pk', 4.5);
  }
  s += pdPoly([A, Bp, B2, A2].map(P), 'surf', 1) + pdPoly([A, Bp, B2, A2].map(P), 'tr', .45, 'tx', 2.2);
  s += pdPoly([O, Bp, A].map(P), 'surf', 1) + pdPoly([O, Bp, A].map(P), 'tr', .25, 'tx', 2.2);
  s += pdL(P(A), P(Bp), 'pk', 4.5);
  const [L1, L2] = o.lab || ['P', 'Q'];
  const pa = P(A), pb = P(Bp), po = P(O);
  s += pdT(pa[0] - 6, pa[1] - 14, L1, 'tx', 18) + pdT(pb[0] + 6, pb[1] + 16, L2, 'tx', 18);
  if (o.ta) s += pdT(po[0] - 8, (pa[1] + po[1]) / 2, o.ta, 'mu', 16, 'end');
  if (o.tb) s += pdT((po[0] + pb[0]) / 2 - 10, (po[1] + pb[1]) / 2 + 18, o.tb, 'mu', 16, 'end');
  if (o.tc) { const mx = (pa[0] + pb[0]) / 2, my = (pa[1] + pb[1]) / 2, dx = pb[0] - pa[0], dy = pb[1] - pa[1], ln = Math.hypot(dx, dy) || 1; s += `<g style="paint-order:stroke;stroke:var(--surf);stroke-width:5px;stroke-linejoin:round">${pdT(mx + dy / ln * 14, my - dx / ln * 14, o.tc, 'pk', 17, 'start')}</g>`; }
  if (o.tl) { const m = P([b, l / 2, 0]); s += pdT(m[0] + 10, m[1] + 14, o.tl, 'mu', 16, 'start'); }
  if (o.plane && o.tp) { const m = P([b / 2, 0, zp]); s += pdT(m[0] - 14, m[1] + 18, o.tp, 'pk', 17, 'end'); }
  const pts = [A, Bp, O, A2, B2].map(P); if (o.plane) [[-.5, -.5, zp], [b + .5, l + .5, zp], [b + .5, -.5, zp], [-.5, l + .5, zp]].forEach(p => pts.push(P(p)));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs) - 70, y0 = Math.min(...ys) - 30;
  return pdWrap(s, x0, y0, Math.max(...xs) - x0 + 70, Math.max(...ys) - y0 + 34, o.label || 'A wedge with an inclined face');
}

/* =================== data bersama (7.1) =================== */
const PDISTILAH = [
  ['the orthogonal projection of an object on a horizontal plane', 'Plan', 'A plan is the orthogonal projection on a horizontal plane (viewed from above).'],
  ['the orthogonal projection of an object on a vertical plane when viewed from the front', 'Front elevation', 'A front elevation is the projection on a vertical plane viewed from the front.'],
  ['the orthogonal projection of an object on a vertical plane when viewed from the side', 'Side elevation', 'A side elevation is the projection on a vertical plane viewed from the side.'],
  ['a line that connects a point on an object to its image and is perpendicular to the plane', 'Projection line', 'A projection line is perpendicular to the plane of projection.'],
  ['the flat surface on which the image of an object is formed', 'Plane of projection', 'The image is formed on the plane of projection.'],
  ['the type of line used to draw hidden edges', 'Dashed line', 'Edges that cannot be seen are drawn with dashed lines.']
];
const PDBS1 = [
  ['A projection line is perpendicular to the plane of projection.', true, 'Orthogonal projection: the projection lines form 90° with the plane.'],
  ['All projection lines are parallel to one another.', true, 'The projection lines are perpendicular to the same plane, thus they are parallel.'],
  ['A plan is the orthogonal projection on a vertical plane.', false, 'A plan is the projection on a horizontal plane. Elevations are drawn on a vertical plane.'],
  ['Hidden edges are drawn with dashed lines.', true, 'Dashed lines show the hidden edges.'],
  ['The length of the image of an inclined edge is equal to the actual length of the edge.', false, 'An edge that is inclined to the plane produces a shorter image.'],
  ['A face of an object that is parallel to the plane of projection has an image of the same shape and the same size.', true, 'A face parallel to the plane is projected in its actual size.'],
  ['The orthogonal projection of a cube on a horizontal plane is a triangle.', false, 'The plan of a cube is a square.'],
  ['A side elevation is the view of an object from above.', false, 'The view from above is the plan. A side elevation is viewed from the side.'],
  ['An edge that is perpendicular to the plane of projection appears as a point in its image.', true, 'The projection lines of all the points on the edge meet at one point on the plane.'],
  ['The angle between the projection lines and the plane of projection is 45°.', false, 'The angle is 90° because the projection lines are perpendicular to the plane.'],
  ['The length of the image of an edge does not exceed the actual length of the edge.', true, 'The image is of the same length (edge parallel to the plane) or shorter (inclined edge).']
];
// [nama pepejal, {pandangan: bentuk}, bentuk yang juga betul (dikecualikan daripada pilihan salah)]
const PDBENTUK = [
  ['cube', { pelan: 'Square', depan: 'Square', sisi: 'Square' }],
  ['cuboid measuring 8 cm × 5 cm × 3 cm (height 3 cm)', { pelan: 'Rectangle', depan: 'Rectangle', sisi: 'Rectangle' }],
  ['right cylinder whose height is greater than its diameter', { pelan: 'Circle', depan: 'Rectangle', sisi: 'Rectangle' }],
  ['right cone', { pelan: 'Circle with a dot at the centre', depan: 'Isosceles triangle', sisi: 'Isosceles triangle' }],
  ['right pyramid with a square base', { pelan: 'Square with two diagonals', depan: 'Isosceles triangle', sisi: 'Isosceles triangle' }],
  ['sphere', { pelan: 'Circle', depan: 'Circle', sisi: 'Circle' }],
  ['hemisphere with its flat face at the bottom', { pelan: 'Circle', depan: 'Semicircle', sisi: 'Semicircle' }]
];
const PDBENTUKALL = ['Square', 'Rectangle', 'Circle', 'Circle with a dot at the centre', 'Isosceles triangle', 'Semicircle', 'Square with two diagonals', 'Trapezium'];
const PDBENTUKX = { 'Square': ['Rectangle'], 'Rectangle': ['Square'], 'Circle with a dot at the centre': ['Circle'], 'Circle': ['Circle with a dot at the centre'], 'Square with two diagonals': ['Square', 'Rectangle'] };

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 7.1 Unjuran Ortogon ---------- */
  istilah: [
    ({ d }) => ({ q: `What is the name of ${d}?` }),
    ({ d }) => ({ q: `Complete: ___ is ${d}.` }),
    ({ d }) => ({ q: `State the correct term for ${d}.` }),
    ({ d }) => { const N = vnama(); return { q: `${N} is writing notes. Help ${N} name ${d}.` }; }
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  arahPandang: [
    ({ v }) => ({ q: `The diagram below shows a solid with three viewing directions. Which direction gives the ${PDVN[v]} of the solid?` }),
    ({ v }) => ({ q: `The orthogonal projection of the solid below on a ${PDSATAH[v]} viewed from ${PDARAH[v]} is the ${PDVN[v]}. State the letter of the viewing direction.` }),
    ({ lab, v }) => ({ q: `Based on the diagram below, name the orthogonal projection of the solid when viewed from direction ${lab}.`, ans: vcap(PDVN[v]) }),
    ({ lab, v }) => ({ q: `The solid below is viewed from direction ${lab}. What is the name of the drawing produced and on which plane is it projected?`, ans: `${vcap(PDVN[v])}, on a ${PDSATAH[v]}` })
  ],
  bentukAsas: [
    ({ nm, v }) => ({ q: `What is the shape of the ${PDVN[v]} of a ${nm}?` }),
    ({ nm, v }) => ({ q: `A ${nm} is projected orthogonally on a ${PDSATAH[v]} (viewed from ${PDARAH[v]}). State the shape of its image.` }),
    ({ nm, v }) => ({ q: `What is the shape of the ${PDVN[v]} drawing of a ${nm}?` }),
    ({ nm, v, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} says the ${PDVN[v]} of a ${nm} is a ${wrong.toLowerCase()}. Is ${N} correct?` }, salah(N, ans, `The ${PDVN[v]} is the projection viewed from ${PDARAH[v]}.`)); }
  ],
  pilihUnjuran: [
    ({ v, lab }) => ({ q: `Among drawings A, B and C, which is the orthogonal projection of the solid on a ${PDSATAH[v]} when viewed from direction ${lab}?` }),
    ({ v }) => ({ q: `Choose the drawing (A, B or C) that shows the ${PDVN[v]} of the solid on the left.` }),
    ({ v, lab }) => ({ q: `The solid below is viewed from direction ${lab}. Which drawing, A, B or C, is its image?` }),
    ({ v, lab, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} chooses drawing ${wrong} as the orthogonal projection of the solid viewed from direction ${lab}. Is ${N} correct?` }, salah(N, ans, `Imagine the solid viewed exactly from direction ${lab}, with the projection lines perpendicular to the plane.`)); }
  ],
  panjangImej: [
    ({ L1, L2, a, c, plane }) => ({ q: `The diagram below shows a wedge with a height of ${a} cm and an inclined side ${L1}${L2} = ${c} cm. Calculate the length of the image of ${L1}${L2} on the ${plane}.` }),
    ({ L1, L2, a, c, plane }) => ({ q: `The inclined edge ${L1}${L2} of a wedge measures ${c} cm. End ${L1} is ${a} cm above end ${L2}. Find the length of the orthogonal projection of ${L1}${L2} on the ${plane}.` }),
    ({ L1, L2, a, c, plane }) => ({ q: `A plank ${L1}${L2} of length ${c} cm is leaned so that end ${L1} is ${a} cm higher than end ${L2}. What is the length of the image of the plank on the ${plane}?` })
  ],
  panjangSebenar: [
    ({ L1, L2, a, b }) => ({ q: `The image of the inclined edge ${L1}${L2} on a horizontal plane is ${b} cm. If ${L1} is ${a} cm above ${L2}, calculate the actual length of ${L1}${L2}.` }),
    ({ L1, L2, a, b }) => ({ q: `The diagram below shows a wedge. In its plan, ${L1}${L2} appears ${b} cm long. The height of the wedge is ${a} cm. Find the actual length of ${L1}${L2}.` }),
    ({ L1, L2, a, b, ans }) => { const N = vnama(); return Object.assign({ q: `The plan of a wedge shows ${L1}${L2} = ${b} cm, and the height of the wedge is ${a} cm. ${N} says the actual length of ${L1}${L2} is also ${b} cm. Is ${N} correct?` }, salah(N, ans, `${L1}${L2} is inclined to the horizontal plane, so its actual length is longer than its image.`)); }
  ],
  luasImej: [
    ({ v, s }) => ({ q: `The solid below is built from cubes with sides of ${s} cm. Calculate the area of its orthogonal projection on a ${PDSATAH[v]} viewed from ${PDARAH[v]}.` }),
    ({ v, s }) => ({ q: `Each cube in the solid below has sides of ${s} cm. Find the area of the ${PDVN[v]} of the solid.` }),
    ({ v, s }) => ({ q: `The solid of cubes below (sides of ${s} cm) is viewed from ${PDARAH[v]}. What is the area of the image formed?` })
  ],
  k71: [
    ({ w }) => ({ q: `The diagram below shows a wedge with a rectangular inclined face ${w.L1}${w.L2}${w.L3}${w.L4}. The height of the wedge is ${w.a} cm, ${w.L1}${w.L2} = ${w.c} cm and ${w.L2}${w.L3} = ${w.l} cm. The wedge is projected on a horizontal plane. Calculate (a) the length of the image of ${w.L1}${w.L2}, (b) the actual area of the inclined face, (c) the area of the image of the inclined face on the horizontal plane.` }),
    ({ w }) => ({ q: `A wedge-shaped ramp has an inclined surface ${w.L1}${w.L2}${w.L3}${w.L4} with ${w.L1}${w.L2} = ${w.c} cm and ${w.L2}${w.L3} = ${w.l} cm. End ${w.L1} is ${w.a} cm higher than ${w.L2}. Find (a) the length of the image of ${w.L1}${w.L2} on the plan, (b) the actual area of the inclined surface, (c) the difference between the area of the inclined surface and the area of its image on the plan.`, ans: `(a) ${w.b} cm (b) ${w.c * w.l} cm² (c) ${w.c * w.l - w.b * w.l} cm²`, work: [`(a) Image of ${w.L1}${w.L2} = ${rt(`${w.c}² − ${w.a}²`)} = ${rt(w.c * w.c - w.a * w.a)} = ${w.b} cm`, `(b) Actual area = ${w.c} × ${w.l} = ${w.c * w.l} cm²`, `Area of image = ${w.b} × ${w.l} = ${w.b * w.l} cm²`, `(c) Difference = ${w.c * w.l} − ${w.b * w.l} = ${w.c * w.l - w.b * w.l} cm²`] }),
    ({ w }) => ({ q: `The inclined roof of a hut is a rectangle ${w.L1}${w.L2}${w.L3}${w.L4}, with ${w.L1}${w.L2} = ${w.c} m and ${w.L2}${w.L3} = ${w.l} m. The top of the roof is ${w.a} m higher than its bottom. Calculate (a) the width of the image of the roof on the plan, (b) the actual area of the roof, (c) the area of the plan of the roof.`, ans: `(a) ${w.b} m (b) ${w.c * w.l} m² (c) ${w.b * w.l} m²`, work: [`(a) Width of image = ${rt(`${w.c}² − ${w.a}²`)} = ${rt(w.c * w.c - w.a * w.a)} = ${w.b} m`, `(b) Actual area = ${w.c} × ${w.l} = ${w.c * w.l} m²`, `(c) Area of plan = ${w.b} × ${w.l} = ${w.b * w.l} m²`] })
  ],

  /* ---------- 7.2 Pelan dan Dongakan ---------- */
  pilihPandangan: [
    ({ v, lab }) => ({ q: `The diagram below shows a solid built from cubes. Among A, B and C, which is the ${PDVN[v]} of the solid${v === 'pelan' ? '' : ` viewed from direction ${lab}`}?` }),
    ({ v }) => ({ q: `Choose the correct drawing of the ${PDVN[v]} of the solid below.` }),
    ({ v, lab }) => ({ q: `Which drawing, A, B or C, shows the solid below when viewed from ${v === 'pelan' ? 'above' : `direction ${lab}`}?` }),
    ({ v, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says drawing ${wrong} is the ${PDVN[v]} of the solid below. Is ${N} correct?` }, salah(N, ans, `Compare each column and level of the solid with the drawing, including the dashed lines.`)); }
  ],
  namaPandangan: [
    () => ({ q: 'The drawing on the right is a view of the solid on the left. Is the drawing a plan, a front elevation or a side elevation?' }),
    () => ({ q: 'Name the view of the solid shown by the drawing on the right.' }),
    ({ ans }) => ({ q: 'From which direction is the solid below viewed to produce the drawing on the right? Name the drawing.', ans }),
    () => { const N = vnama(); return { q: `${N} draws a view of the solid as shown on the right. Which view did ${N} draw?` }; }
  ],
  kiraKiub: [
    () => ({ q: 'The diagram below is the plan of a solid. The number in each square is the number of cubes stacked in that column. How many cubes are there in the solid?' }),
    () => ({ q: 'A solid is built from cubes of the same size according to the numbered plan below. Calculate the total number of cubes used.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} builds a model with cubes according to the plan below. How many cubes does ${N} need?`, ans }; },
    () => ({ q: 'The numbered plan below shows the height of each column of cubes. State the number of cubes in the solid and the height of the tallest column.' })
  ],
  lukis: [
    ({ v, lab }) => ({ q: `On a square grid with sides of 1 cm, draw the ${PDVN[v]} of the solid below ${v === 'pelan' ? '' : `(viewed from direction ${lab}) `}to full scale. The side of each cube is 1 cm.` }),
    ({ v, lab }) => ({ q: `The solid below is built from cubes with sides of 1 cm. Draw to full scale its ${PDVN[v]}${v === 'pelan' ? '' : ` when viewed from ${lab}`}.` }),
    ({ v, lab }) => ({ q: `Draw the orthogonal projection of the solid below on a ${PDSATAH[v]} ${v === 'pelan' ? 'viewed from above' : `viewed from direction ${lab}`}. Use the grid given (1 square = 1 cm).` }),
    ({ v, lab }) => ({ q: `Draw to full scale the ${PDVN[v]} of the solid of cubes (sides of 1 cm) below${v === 'pelan' ? '' : `, viewed from direction ${lab}`}. Show the hidden edges, if any.` })
  ],
  ukuran: [
    ({ v, s }) => ({ q: `The solid below is built from cubes with sides of ${s} cm. Calculate the area of the ${PDVN[v]} of the solid.` }),
    ({ v, s }) => ({ q: `Each cube in the solid below has sides of ${s} cm. Find the perimeter of the ${PDVN[v]} of the solid.` }),
    ({ v, s }) => ({ q: `The side of each cube is ${s} cm. State the measurements of the smallest rectangle that can contain the ${PDVN[v]} of the solid below (width × height of the drawing).` })
  ],
  tinggiLajur: [
    () => ({ q: 'Based on the numbered plan below, state the height (in cubes) of each column of the front elevation from left to right.' }),
    () => ({ q: 'The plan below shows the number of cubes in each column. What is the height of each part of the front elevation, from left to right?' }),
    () => ({ q: 'A solid of cubes has a numbered plan as shown below. Its front elevation consists of several columns. State the heights of the columns from left to right.' })
  ],
  tinggiSisi: [
    () => ({ q: 'Based on the numbered plan below, state the height (in cubes) of each column of the side elevation viewed from the right, from front to back.' }),
    () => ({ q: 'The solid of cubes with the numbered plan below is viewed from the right. State the height of each column of its side elevation, starting from the front.' }),
    () => ({ q: 'The side elevation (viewed from the right) of the solid below consists of several columns. State the heights of the columns from front to back.' })
  ],
  k72: [
    ({ s }) => ({ q: `The diagram below is the numbered plan of a solid built from cubes with sides of ${s} cm. Find (a) the number of cubes, (b) the area of the front elevation, (c) the number of additional cubes needed to make the solid a cuboid.` }),
    ({ s }) => ({ q: `A model is built from cubes with sides of ${s} cm according to the numbered plan below. Calculate (a) the total number of cubes, (b) the area of the front elevation of the model, (c) the number of additional cubes so that the model becomes a cuboid as high as the tallest column.` }),
    ({ s }) => { const N = vnama(); return { q: `${N} arranges cubes with sides of ${s} cm according to the numbered plan below. (a) How many cubes are used? (b) Calculate the area of the front elevation of the arrangement. (c) How many more cubes must be added so that the arrangement becomes a cuboid?` }; }
  ]
};

/* =================== pembina soalan (r = pdRG atau pdRW) =================== */
const PD = {};
// pepejal rawak dengan tiga pandangan berbeza
const pdSolid = (r, o) => pdRandH(r, Object.assign({ W: [2, 3], D: [2, 2], H: [1, 3], zero: .22, cond: pdDistinct }, o || {}));
// tiga pilihan lukisan (betul + 2 salah) bagi pandangan v; pulangkan { Ls, ci }
function pdChoices(r, Hm, v, n = 3) {
  const S = pdVox(Hm), Lc = pdLines(S, v), sig0 = pdSig(Lc), pool = [];
  if (v !== 'pelan' && Lc.hid.length) pool.push(pdHidSolid(Lc), pdNoHid(Lc));
  pool.push(pdMirror(Lc));
  PDV.filter(k => k !== v).forEach(k => pool.push(pdLines(S, k)));
  for (let t = 0; t < 30; t++) { // pepejal hampir sama (ubah satu lajur)
    const H2 = Hm.map(row => row.slice()), rr = r.i(0, H2.length - 1), cc = r.i(0, H2[0].length - 1);
    H2[rr][cc] = Math.max(0, Math.min(3, H2[rr][cc] + (r.f() < .5 ? 1 : -1)));
    if (pdConnected(H2)) pool.push(pdLines(pdVox(H2), v));
  }
  const seen = new Set([sig0]), wrong = [];
  for (const L of pool.slice(0, 3).concat(pdShuf(r, pool.slice(3)))) { const s = pdSig(L); if (!seen.has(s)) { seen.add(s); wrong.push(L); } if (wrong.length === n - 1) break; }
  const ci = r.i(0, n - 1), Ls = wrong.slice(0, n - 1);
  Ls.splice(ci, 0, Lc);
  return { Ls, ci, Lc };
}
/* ---------- 7.1 ---------- */
PD.istilah = (r, k) => {
  const [d, ans, why] = k == null ? r.p(PDISTILAH) : PDISTILAH[k % PDISTILAH.length];
  return GEN_LQ('istilah', { d, ans, work: [why] });
};
PD.bs = (r, k) => { const [s, ok, why] = k == null ? r.p(PDBS1) : PDBS1[k % PDBS1.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
PD.arahPandang = (r, k) => {
  const H = r.p(PDHUR), v = k == null ? r.p(PDV) : PDV[k % 3], Hm = pdSolid(r, { zero: .15 });
  const lab = { depan: H[0], sisi: H[1], pelan: H[2] }[v];
  const fig = pdIsoSvg(pdVox(Hm), { arrows: { depan: H[0], sisi: H[1], atas: H[2] }, label: 'A solid with three viewing direction arrows' });
  return GEN_LQ('arahPandang', { v, lab, ans: `Direction ${lab}`, work: [`The ${PDVN[v]} is viewed from ${PDARAH[v]}, that is the orthogonal projection on a ${PDSATAH[v]}.`, `Arrow ${lab} points from ${PDARAH[v]}.`] }, { fig });
};
PD.bentukAsas = (r, k) => {
  const [nm, map] = k == null ? r.p(PDBENTUK) : PDBENTUK[k % PDBENTUK.length], v = r.p(PDV), ans = map[v];
  const ex = new Set([ans].concat(PDBENTUKX[ans] || [])), wrong = r.p(PDBENTUKALL.filter(x => !ex.has(x)));
  return GEN_LQ('bentukAsas', { nm, v, ans, wrong, work: [`The ${PDVN[v]} is the projection viewed from ${PDARAH[v]}.`, `For a ${nm}, the shape seen is a ${ans.toLowerCase()}.`] });
};
PD.pilihUnjuran = (r, vk) => {
  const H = r.p(PDHUR), v = vk || r.p(['depan', 'sisi', 'pelan']), Hm = pdSolid(r, { cond: h => pdDistinct(h) && (v === 'pelan' || pdNotSym(h, v)) });
  const lab = { depan: H[0], sisi: H[1], pelan: H[2] }[v], { Ls, ci } = pdChoices(r, Hm, v);
  const ans = 'ABC'[ci], wrong = 'ABC'[(ci + 1 + r.i(0, 1)) % 3];
  const fig = pdIsoOpts(pdVox(Hm), { depan: H[0], sisi: H[1], atas: H[2] }, Ls, ['A', 'B', 'C'], PDVC[v]);
  return GEN_LQ('pilihUnjuran', { v, lab, ans, wrong, work: [`View the solid from direction ${lab} (${PDARAH[v]}).`, `Drawing ${ans} shows the correct shape and lines.`] }, { fig });
};
function pdWedgeData(r) {
  const [p, q, c] = r.p(PDTRI), sw = r.f() < .5, a = sw ? p : q, b = sw ? q : p;
  const L = r.p([['P', 'Q', 'R', 'S'], ['A', 'B', 'C', 'D'], ['K', 'L', 'M', 'N'], ['E', 'F', 'G', 'H']]);
  return { a, b, c, l: r.p([6, 8, 10, 12, 15]), L1: L[0], L2: L[1], L3: L[2], L4: L[3] };
}
PD.panjangImej = (r, kind) => {
  const w = pdWedgeData(r), { a, b, c, L1, L2 } = w;
  kind = kind || (r.f() < .75 ? 'h' : 'v');
  if (kind === 'h') {
    const fig = pdWedge(a, b, Math.min(w.l, 8) * .6, { lab: [L1, L2], ta: `${a} cm`, tc: `${c} cm`, plane: true, tp: '?' });
    return GEN_LQ('panjangImej', { L1, L2, a, c, plane: 'horizontal plane', ans: `${b} cm`, work: [`${L1}${L2} is inclined; its image on the horizontal plane is its horizontal distance.`, `Image of ${L1}${L2} = ${rt(`${c}² − ${a}²`)} = ${rt(`${c * c} − ${a * a}`)} = ${rt(b * b)}`, `= ${b} cm`] }, { fig });
  }
  const fig = pdWedge(a, b, Math.min(w.l, 8) * .6, { lab: [L1, L2], ta: `${a} cm`, tc: `${c} cm` });
  return GEN_LQ('panjangImej', { L1, L2, a, c, plane: 'vertical plane that is parallel to the triangular face of the wedge', ans: `${c} cm`, work: [`${L1}${L2} lies on the triangular face that is parallel to the vertical plane.`, `An edge that is parallel to the plane of projection has an image of the same length.`, `Image of ${L1}${L2} = ${c} cm`] }, { fig });
};
PD.panjangSebenar = r => {
  const w = pdWedgeData(r), { a, b, c, L1, L2 } = w;
  const fig = pdWedge(a, b, Math.min(w.l, 8) * .6, { lab: [L1, L2], ta: `${a} cm`, tb: `${b} cm`, tc: '?' });
  return GEN_LQ('panjangSebenar', { L1, L2, a, b, ans: `${c} cm`, work: [`The actual length of ${L1}${L2} is the hypotenuse of a right-angled triangle.`, `${L1}${L2} = ${rt(`${a}² + ${b}²`)} = ${rt(`${a * a} + ${b * b}`)} = ${rt(c * c)}`, `= ${c} cm`] }, { fig });
};
PD.luasImej = (r, vk) => {
  const Hm = pdSolid(r, { W: [2, 3], D: [2, 3], zero: .25 }), S = pdVox(Hm), v = vk || r.p(PDV), s = r.p([1, 2, 3, 4, 5]);
  const L = pdLines(S, v), n = L.cells.length, A = n * s * s;
  const fig = pdIsoSvg(S, { arrows: { depan: 'front', sisi: 'side', atas: v === 'pelan' ? 'top' : null } });
  return GEN_LQ('luasImej', { v, s, ans: `${A} cm²`, work: [`The ${PDVN[v]} consists of ${n} squares.`, `Area of each square = ${s} × ${s} = ${s * s} cm²`, `Area = ${n} × ${s * s} = ${A} cm²`] }, { fig, figAns: pdViewSvg(L, { col: PDVC[v], title: vcap(PDVN[v]) }) });
};
PD.k71 = r => {
  const w = pdWedgeData(r);
  const v = vq('k71', { w });
  const L4 = `${w.L1}${w.L2}${w.L3}${w.L4}`;
  const ans = v.ans || `(a) ${w.b} cm (b) ${w.c * w.l} cm² (c) ${w.b * w.l} cm²`;
  const work = v.work.length ? v.work : [`(a) Image of ${w.L1}${w.L2} = ${rt(`${w.c}² − ${w.a}²`)} = ${rt(w.c * w.c - w.a * w.a)} = ${w.b} cm`, `(b) Actual area of ${L4} = ${w.c} × ${w.l} = ${w.c * w.l} cm²`, `(c) ${w.L2}${w.L3} is parallel to the plane, so its image remains ${w.l} cm.`, `Area of image = ${w.b} × ${w.l} = ${w.b * w.l} cm²`];
  const fig = pdWedge(w.a, w.b, 4.2, { lab: [w.L1, w.L2], ta: `${w.a}`, tc: `${w.c}`, tl: `${w.l}` });
  return { q: v.q, ans, work, fig };
};

/* ---------- 7.2 ---------- */
PD.pilihPandangan = (r, vk, big) => {
  const H = r.p(PDHUR), v = vk || r.p(PDV);
  const Hm = pdSolid(r, big ? { W: [3, 3], D: [2, 3], cond: h => pdDistinct(h) && (v === 'pelan' || pdNotSym(h, v)) } : { cond: h => pdDistinct(h) && (v === 'pelan' || pdNotSym(h, v)) });
  const lab = { depan: H[0], sisi: H[1], pelan: H[2] }[v], { Ls, ci } = pdChoices(r, Hm, v);
  const ans = 'ABC'[ci], wrong = 'ABC'[(ci + 1 + r.i(0, 1)) % 3];
  const fig = pdIsoOpts(pdVox(Hm), { depan: H[0], sisi: H[1] }, Ls, ['A', 'B', 'C'], PDVC[v]);
  return GEN_LQ('pilihPandangan', { v, lab, ans, wrong, work: [`${vcap(PDVN[v])}: the solid is viewed from ${PDARAH[v]}.`, 'Check the number of squares, the level of each column and the dashed lines.', `Answer: drawing ${ans}.`] }, { fig });
};
PD.namaPandangan = (r, vk) => {
  const H = r.p(PDHUR), Hm = pdSolid(r), S = pdVox(Hm), v = vk || r.p(PDV), L = pdLines(S, v);
  const lab = { depan: H[0], sisi: H[1], pelan: 'atas' }[v];
  const iso = pdIsoParts(S, { k: 28, arrows: { depan: H[0], sisi: H[1] } });
  const k = 28, isoW = iso.x1 - iso.x0, isoH = iso.y1 - iso.y0, GH = L.h * k, Hh = Math.max(isoH, GH + 20) + 4, ox = isoW + 30;
  let s = `<g transform="translate(${(-iso.x0).toFixed(1)} ${((Hh - isoH) / 2 - iso.y0).toFixed(1)})">${iso.s}</g>`;
  s += pdViewParts(L, ox, (Hh + GH) / 2, k, { col: 'pu', grid: false });
  const fig = pdWrap(s, 0, 0, ox + L.w * k + 6, Hh, 'A solid and a drawing of one of its views');
  const arah = v === 'pelan' ? 'from above' : `from direction ${lab}`;
  return GEN_LQ('namaPandangan', { ans: `${vcap(PDVN[v])} (viewed ${arah})`, work: [`Compare the drawing with the solid: the drawing matches the view ${arah}.`, `Thus the drawing is the ${PDVN[v]}.`] }, { fig });
};
PD.kiraKiub = r => {
  const Hm = pdRandH(r, { W: [2, 3], D: [2, 3], H: [1, 4], zero: .2 }), n = pdSum(Hm.flat()), mx = Math.max(...Hm.flat());
  const v = vq('kiraKiub', { ans: `${n} cubes` });
  const ans = v.q.includes('tallest column') ? `${n} cubes; tallest column = ${mx} cubes` : (v.ans || `${n} cubes`);
  return { q: v.q, ans, work: [`Add all the numbers in the plan: ${Hm.flat().filter(Boolean).join(' + ')} = ${n}`], fig: pdPlanNum(Hm) };
};
PD.lukis = (r, vk, needHid) => {
  const H = r.p(PDHUR), v = vk || r.p(PDV);
  const Hm = pdSolid(r, { cond: h => pdDistinct(h) && (!needHid || pdHasHid(h, v)) && (needHid || !pdHasHid(h, v)), zero: needHid ? .1 : .22 });
  const S = pdVox(Hm), L = pdLines(S, v), lab = { depan: H[0], sisi: H[1], pelan: 'atas' }[v];
  const gw = L.w + 2, gh = L.h + 2, arrows = { depan: H[0], sisi: H[1] };
  const fig = pdIsoGrid(S, arrows, gw, gh, null), figAns = pdIsoGrid(S, arrows, gw, gh, L, PDVC[v]);
  const work = [`${vcap(PDVN[v])}: ${L.w} cm wide and ${L.h} cm ${v === 'pelan' ? 'deep' : 'high'}.`, 'Draw solid lines for the visible edges and every change of level.'];
  if (L.hid.length) work.push(`There are ${L.hid.length} hidden edges: draw them with dashed lines.`);
  const vv = vq('lukis', { v, lab });
  return { q: vv.q, ans: 'Refer to the answer diagram.', work, fig, figAns, kind: 'lukis' };
};
PD.ukuran = (r, kind) => {
  const Hm = pdSolid(r, { W: [2, 4], D: [2, 3], zero: .25 }), S = pdVox(Hm), v = r.p(PDV), s = r.p([2, 3, 4, 5]), L = pdLines(S, v);
  const fig = pdIsoSvg(S, { arrows: { depan: 'front', sisi: 'side' } }), figAns = pdViewSvg(L, { col: PDVC[v], title: vcap(PDVN[v]) });
  const n = L.cells.length, pr = pdPerim(L.cells);
  kind = kind == null ? r.i(0, 2) : kind % 3;
  const d = { v, s };
  if (kind === 0) return Object.assign({ q: QV.ukuran[0](d).q, ans: `${n * s * s} cm²`, work: [`The ${PDVN[v]} consists of ${n} squares.`, `Area = ${n} × ${s}² = ${n} × ${s * s} = ${n * s * s} cm²`] }, { fig, figAns });
  if (kind === 1) return Object.assign({ q: QV.ukuran[1](d).q, ans: `${pr * s} cm`, work: [`The boundary of the ${PDVN[v]} consists of ${pr} sides of cubes.`, `Perimeter = ${pr} × ${s} = ${pr * s} cm`] }, { fig, figAns });
  return Object.assign({ q: QV.ukuran[2](d).q, ans: `${L.w * s} cm × ${L.h * s} cm`, work: [`${vcap(PDVN[v])}: ${L.w} cubes wide and ${L.h} cubes ${v === 'pelan' ? 'deep' : 'high'}.`, `${L.w} × ${s} = ${L.w * s} cm, ${L.h} × ${s} = ${L.h * s} cm`] }, { fig, figAns });
};
PD.tinggiLajur = (r, side) => {
  const Hm = pdRandH(r, { W: [3, 4], D: [2, 3], H: [1, 4], full: true, cond: h => new Set(pdColH(h)).size > 1 && new Set(pdRowH(h)).size > 1 });
  if (side) {
    const rh = pdRowH(Hm), Ls = pdLines(pdVox(Hm), 'sisi');
    return GEN_LQ('tinggiSisi', { ans: rh.join(', '), work: ['Viewed from the right, each row (front → back) becomes a column.', ...Hm.slice().reverse().map((row, i) => `${i === 0 ? 'Front' : i === Hm.length - 1 ? 'Back' : 'Middle'} row: tallest = max(${row.join(', ')}) = ${rh[i]}`)] }, { fig: pdPlanNum(Hm), figAns: pdViewSvg(Ls, { col: 'pk', title: 'Side elevation' }) });
  }
  const ch = pdColH(Hm), Ld = pdLines(pdVox(Hm), 'depan');
  return GEN_LQ('tinggiLajur', { ans: ch.join(', '), work: ['The front elevation shows the tallest column in each column (left → right).', ...ch.map((h, x) => `Column ${x + 1}: max(${Hm.map(row => row[x]).join(', ')}) = ${h}`)] }, { fig: pdPlanNum(Hm), figAns: pdViewSvg(Ld, { col: 'tr', title: 'Front elevation' }) });
};
PD.k72 = r => {
  const Hm = pdRandH(r, { W: [3, 4], D: [2, 3], H: [1, 4], full: true, cond: h => Math.max(...h.flat()) >= 3 && new Set(pdColH(h)).size > 1 }), s = r.p([2, 3, 4, 5]);
  const n = pdSum(Hm.flat()), ch = pdColH(Hm), fc = pdSum(ch), mx = Math.max(...Hm.flat()), W = Hm[0].length, D = Hm.length, tot = W * D * mx;
  const v = vq('k72', { s });
  return {
    q: v.q, ans: `(a) ${n} cubes (b) ${fc * s * s} cm² (c) ${tot - n} cubes`,
    work: [`(a) ${Hm.flat().join(' + ')} = ${n} cubes`, `(b) Heights of the columns of the front elevation: ${ch.join(', ')} → ${fc} squares`, `Area = ${fc} × ${s}² = ${fc * s * s} cm²`, `(c) Cuboid ${W} × ${D} × ${mx} = ${tot} cubes; additional = ${tot} − ${n} = ${tot - n} cubes`],
    fig: pdPlanNum(Hm), figAns: pdViewSvg(pdLines(pdVox(Hm), 'depan'), { col: 'tr', title: 'Front elevation' })
  };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '7.1': {
    m: [() => PD.istilah(pdRG), () => PD.bs(pdRG), () => PD.arahPandang(pdRG), () => PD.bentukAsas(pdRG), () => PD.pilihUnjuran(pdRG)],
    s: [() => PD.panjangImej(pdRG), () => PD.panjangSebenar(pdRG), () => PD.luasImej(pdRG)],
    k: [() => PD.k71(pdRG)]
  },
  '7.2': {
    m: [() => PD.pilihPandangan(pdRG), () => PD.namaPandangan(pdRG), () => PD.kiraKiub(pdRG), () => PD.lukis(pdRG)],
    s: [() => PD.ukuran(pdRG), () => PD.tinggiLajur(pdRG, false), () => PD.tinggiLajur(pdRG, true), () => PD.lukis(pdRG, pdRG.p(['depan', 'sisi']), true)],
    k: [() => PD.k72(pdRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 7.1
WG.istilah = i => PD.istilah(pdRW, i);
WG.bs1 = i => PD.bs(pdRW, [0, 2, 5, 9][i % 4]);
WG.arahPandang = i => PD.arahPandang(pdRW, i);
WG.bentukAsas = i => PD.bentukAsas(pdRW, [2, 3, 4, 6][i % 4]);
WG.pilihUnjuran = i => PD.pilihUnjuran(pdRW, ['depan', 'sisi', 'pelan'][i % 3]);
WG.panjangImej = i => PD.panjangImej(pdRW, i % 3 === 2 ? 'v' : 'h');
WG.panjangSebenar = () => PD.panjangSebenar(pdRW);
WG.luasImej = i => PD.luasImej(pdRW, PDV[i % 3]);
WG.k71 = () => PD.k71(pdRW);
// 7.2
WG.pilihPandangan = i => PD.pilihPandangan(pdRW, PDV[i % 3]);
WG.namaPandangan = i => PD.namaPandangan(pdRW, PDV[(i + 1) % 3]);
WG.kiraKiub = () => PD.kiraKiub(pdRW);
WG.lukis = i => PD.lukis(pdRW, PDV[i % 3], false);
WG.ukuran = i => PD.ukuran(pdRW, i);
WG.tinggiLajur = () => PD.tinggiLajur(pdRW, false);
WG.tinggiSisi = () => PD.tinggiLajur(pdRW, true);
WG.lukisT = i => PD.lukis(pdRW, ['depan', 'sisi'][i % 2], true);
WG.k72 = () => PD.k72(pdRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '7.1': [['m', 'istilah', 5], ['m', 'bs1', 4], ['m', 'arahPandang', 3], ['m', 'bentukAsas', 3], ['m', 'pilihUnjuran', 3], ['s', 'panjangImej', 3], ['s', 'panjangSebenar', 3], ['s', 'luasImej', 3], ['k', 'k71', 3]],
  '7.2': [['m', 'pilihPandangan', 5], ['m', 'namaPandangan', 4], ['m', 'kiraKiub', 4], ['m', 'lukis', 5], ['s', 'ukuran', 3], ['s', 'tinggiLajur', 2], ['s', 'tinggiSisi', 2], ['s', 'lukisT', 2], ['k', 'k72', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function pdOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
function pdOptsN(ans, cands, f) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !Number.isInteger(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const vv = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (vv <= 0) continue; const s = f(vv); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const PDKONSEP = [
  ['The image of an <b>inclined</b> edge on a plane of projection is …', 'Shorter than the actual length', ['The same length as the actual length', 'Longer than the actual length', 'Twice the actual length']],
  ['A face of an object that is <b>parallel</b> to the plane of projection produces an image that is …', 'Of the same shape and the same size', ['Smaller', 'Larger', 'A straight line']],
  ['An edge that is <b>perpendicular</b> to the plane of projection appears as …', 'A point', ['Dashed line', 'A longer line', 'A circle']],
  ['A <b>hidden</b> edge is drawn with …', 'Dashed line', ['A thick solid line', 'A red line', 'It does not need to be drawn']],
  ['The angle between a projection line and the plane of projection is …', '90°', ['45°', '60°', '180°']]
];
const pdMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const pdHlist = a => a.join(', ');
const CQGEN = {
  pandangan: [
    () => { const H = pick(PDHUR), Hm = pdSolid(pdRG, { zero: .15 }), v = pick(PDV), lab = { depan: H[0], sisi: H[1], pelan: H[2] }[v]; return pdMcq(`The view of the solid from direction <b>${lab}</b> is called …`, pdIsoSvg(pdVox(Hm), { arrows: { depan: H[0], sisi: H[1], atas: H[2] } }), pdOptsT(vcap(PDVN[v]), ['Plan', 'Front elevation', 'Side elevation', 'Net'])); },
    () => { const H = pick(PDHUR), Hm = pdSolid(pdRG, { zero: .15 }), v = pick(PDV), lab = { depan: H[0], sisi: H[1], pelan: H[2] }[v]; return pdMcq(`Which direction gives the <b>${PDVN[v]}</b>?`, pdIsoSvg(pdVox(Hm), { arrows: { depan: H[0], sisi: H[1], atas: H[2] } }), pdOptsT(`Direction ${lab}`, H.map(h => `Direction ${h}`).concat(['Back direction']))); },
    () => { const H = pick(PDHUR), Hm = pdSolid(pdRG), S = pdVox(Hm), v = pick(PDV), L = pdLines(S, v); const fig = pdIsoOpts(S, { depan: H[0], sisi: H[1] }, [L], ['?'], 'pu'); return pdMcq('The drawing on the right is …', fig, pdOptsT(vcap(PDVN[v]), ['Plan', 'Front elevation', 'Side elevation', 'Net'])); }
  ],
  pilih: [
    () => { const v = pick(PDV), H = pick(PDHUR), Hm = pdSolid(pdRG, { W: [2, 2], D: [2, 2], cond: h => pdDistinct(h) && (v === 'pelan' || pdNotSym(h, v)) }); return pdPilihMcq(Hm, v, H); },
    () => { const v = pick(PDV), H = pick(PDHUR), Hm = pdSolid(pdRG, { cond: h => pdDistinct(h) && (v === 'pelan' || pdNotSym(h, v)) }); return pdPilihMcq(Hm, v, H); },
    () => { const v = pick(['depan', 'sisi']), H = pick(PDHUR), Hm = pdSolid(pdRG, { W: [3, 3], D: [2, 3], zero: .1, cond: h => pdDistinct(h) && pdNotSym(h, v) && pdHasHid(h, v) }); return pdPilihMcq(Hm, v, H); }
  ],
  unjuran: [
    () => { const [d, ans] = pick(PDISTILAH); return pdMcq(`What is the name of ${d}?`, pdWedge(3, 4, 3, { lab: ['P', 'Q'], plane: true }), pdOptsT(ans, PDISTILAH.map(x => x[1]).concat(['Net']))); },
    () => { const [nm, map] = pick(PDBENTUK), v = pick(PDV), ans = map[v], ex = new Set(PDBENTUKX[ans] || []); return pdMcq(`What is the shape of the <b>${PDVN[v]}</b> of a ${nm}?`, pdIsoSvg(pdVox([[1, 1], [1, 1]]), { arrows: { depan: 'depan', sisi: 'sisi', atas: 'atas' }, col: 'pu' }), pdOptsT(ans, PDBENTUKALL.filter(x => !ex.has(x)))); },
    () => { const [q, ans, wr] = pick(PDKONSEP); return pdMcq(q, pdWedge(3, 4, 3, { lab: ['P', 'Q'], plane: true }), pdOptsT(ans, wr)); }
  ],
  kiub: [
    () => { const Hm = pdRandH(pdRG, { W: [2, 3], D: [2, 2], H: [1, 3], zero: .2 }), n = pdSum(Hm.flat()); return pdMcq('How many cubes are there in this solid?', pdPlanNum(Hm), pdOptsN(n, [n + 1, n - 1, Hm.flat().filter(Boolean).length, n + 2, Math.max(...Hm.flat()) * Hm[0].length], v => `${v} cubes`)); },
    () => {
      const Hm = pdRandH(pdRG, { W: [3, 3], D: [2, 3], H: [1, 4], full: true, cond: h => new Set(pdColH(h)).size > 1 }), ch = pdColH(Hm);
      const fr = Hm[Hm.length - 1], bk = Hm[0], mn = Hm[0].map((_, x) => Math.min(...Hm.map(r => r[x])));
      return pdMcq('The heights of the columns of the <b>front elevation</b> from left to right are …', pdPlanNum(Hm), pdOptsT(pdHlist(ch), [pdHlist(fr), pdHlist(bk), pdHlist(mn), pdHlist(ch.slice().reverse()), pdHlist(ch.map(h => h + 1)), pdHlist(ch.map((h, i) => (i ? h : h + 1))), pdHlist(ch.map((h, i) => (i === ch.length - 1 ? h + 1 : h)))]));
    },
    () => {
      const Hm = pdRandH(pdRG, { W: [3, 3], D: [2, 3], H: [1, 4], full: true, cond: h => Math.max(...h.flat()) >= 2 }), n = pdSum(Hm.flat()), mx = Math.max(...Hm.flat()), tot = Hm.length * Hm[0].length * mx;
      return pdMcq('How many more cubes are needed to make this solid a <b>cuboid</b>?', pdPlanNum(Hm), pdOptsN(tot - n, [tot, n, tot - n + 1, tot - n - 1, Hm[0].length * Hm.length], v => `${v} cubes`));
    }
  ],
  panjang: [
    () => { const w = pdWedgeData(pdRG); return pdMcq(`${w.L1}${w.L2} = ${w.c} cm and the height of the wedge = ${w.a} cm. What is the length of the image of ${w.L1}${w.L2} on the <b>plan</b>?`, pdWedge(w.a, w.b, 4, { lab: [w.L1, w.L2], ta: `${w.a} cm`, tc: `${w.c} cm`, plane: true, tp: '?' }), pdOptsN(w.b, [w.c, w.a, w.c - w.a, w.c + w.a, w.b + 1], v => `${v} cm`)); },
    () => { const w = pdWedgeData(pdRG); return pdMcq(`The image of ${w.L1}${w.L2} on the plan = ${w.b} cm, height = ${w.a} cm. What is the <b>actual</b> length of ${w.L1}${w.L2}?`, pdWedge(w.a, w.b, 4, { lab: [w.L1, w.L2], ta: `${w.a} cm`, tb: `${w.b} cm`, tc: '?' }), pdOptsN(w.c, [w.a + w.b, w.b, w.b - w.a, w.c + 1, w.c - 1], v => `${v} cm`)); },
    () => {
      const Hm = pdSolid(pdRG, { W: [2, 3], D: [2, 3] }), S = pdVox(Hm), v = pick(PDV), s = pick([1, 2, 3]), n = pdLines(S, v).cells.length;
      return pdMcq(`Side of a cube = ${s} cm. What is the area of the <b>${PDVN[v]}</b>?`, pdIsoSvg(S, { arrows: { depan: 'front', sisi: 'side', atas: v === 'pelan' ? 'top' : null } }), pdOptsN(n * s * s, [S.size * s * s, (n + 1) * s * s, (n - 1) * s * s, n * s, n * s * s * 2], x => `${x} cm²`));
    }
  ]
};
function pdPilihMcq(Hm, v, H) {
  const lab = { depan: H[0], sisi: H[1], pelan: 'atas' }[v], { Ls, ci } = pdChoices(pdRG, Hm, v, 4);
  const opts = Ls.map(L => pdViewSvg(L, { k: 26, col: PDVC[v], h: 64, pad: 6 }));
  const q = v === 'pelan' ? 'Which is the <b>plan</b> of this solid?' : `Which is the <b>${PDVN[v]}</b> viewed from direction ${lab}?`;
  return { type: 'mcq', q, fig: pdIsoSvg(pdVox(Hm), { arrows: { depan: H[0], sisi: H[1] } }), opts, c: ci };
}
const CQT = { pandangan: 'Name of view', pilih: 'Choose a drawing', unjuran: 'Orthogonal projection', kiub: 'Numbered plan', panjang: 'Length & area of image' };
function pdCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.pandangan;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['pandangan', 'pandangan', 'pilih', 'unjuran', 'kiub'] : Object.keys(CQT);
  return pdCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pdCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
