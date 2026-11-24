'use strict';
/* =================== OPERASI SET · SOALAN BAB 4 (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "os" / "OS" supaya tidak bertembung dengan teras.

/* =================== rawak =================== */
// osRG untuk Latihan Kelas / games, osRW (berbenih) untuk Lembaran Kerja
const osRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const osRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const osShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// pilih cara tanya (sama seperti vq teras) tetapi kekalkan semua medan (fig dsb.)
function osVQ(key, d) {
  const list = QV[key], u = VUSE[key] || (VUSE[key] = list.map(() => 0));
  const min = Math.min(...u), idx = [];
  u.forEach((c, i) => { if (c === min) idx.push(i); });
  const k = idx[Math.floor(VR() * idx.length)];
  u[k]++;
  return list[k](d);
}

/* =================== ungkapan set =================== */
// pokok: {k:'s', v} | {k:'n', a} | {k:'i'|'u', a, b}
function osParse(s) {
  const t = [...s].filter(c => c !== ' '); let i = 0;
  const un = () => {
    const c = t[i++]; let x;
    if (c === '(') { x = ex(); if (t[i++] !== ')') throw new Error('kurungan'); }
    else if (c && /[A-Z]/.test(c)) x = { k: 's', v: c };
    else throw new Error('ungkapan');
    while (t[i] === '′') { i++; x = { k: 'n', a: x }; }
    return x;
  };
  const ex = () => {
    let x = un(), op = null;
    while (t[i] === '∩' || t[i] === '∪') { const o = t[i++]; if (op && op !== o) throw new Error('campur'); op = o; x = { k: o === '∩' ? 'i' : 'u', a: x, b: un() }; }
    return x;
  };
  const x = ex(); if (i !== t.length) throw new Error('lebih'); return x;
}
function osEval(t, o) {
  if (t.k === 's') return o.s(t.v);
  if (t.k === 'n') return o.n(osEval(t.a, o));
  return (t.k === 'i' ? o.i : o.u)(osEval(t.a, o), osEval(t.b, o));
}
function osStr(t) {
  if (t.k === 's') return t.v;
  if (t.k === 'n') return (t.a.k === 'i' || t.a.k === 'u' ? `(${osStr(t.a)})` : osStr(t.a)) + '′';
  const side = (c, right) => ((c.k === 'i' || c.k === 'u') && (c.k !== t.k || right) ? `(${osStr(c)})` : osStr(c));
  return `${side(t.a, false)} ${t.k === 'i' ? '∩' : '∪'} ${side(t.b, true)}`;
}
// topeng atom: atom a (bit k = dalam set ke-k); hasil = integer 2^n bit
function osMask(expr, names) {
  const n = names.length, full = (1 << (1 << n)) - 1;
  const set = k => { let m = 0; for (let a = 0; a < 1 << n; a++) if (a >> k & 1) m |= 1 << a; return m; };
  return osEval(osParse(expr), { s: v => set(names.indexOf(v)), n: x => full & ~x, i: (x, y) => x & y, u: (x, y) => x | y });
}
// nilai dengan set unsur (U tersusun)
function osSetEval(t, U, S) {
  if (typeof t === 'string') t = osParse(t);
  return osEval(t, { s: v => S[v], n: x => U.filter(e => !x.includes(e)), i: (x, y) => x.filter(e => y.includes(e)), u: (x, y) => U.filter(e => x.includes(e) || y.includes(e)) });
}
const osRen = (e, nm) => e.replace(/[ABC]/g, c => nm['ABC'.indexOf(c)]);
const osFS = a => (a.length ? `{${a.join(', ')}}` : '∅');
const osSame = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
// langkah: nilai setiap nod dalaman (pasca-tertib)
function osSteps(t, U, S, out = []) {
  if (t.k === 's') return out;
  osSteps(t.a, U, S, out); if (t.b) osSteps(t.b, U, S, out);
  out.push(`${osStr(t)} = ${osFS(osSetEval(t, U, S))}`);
  return out;
}
// langkah melorek
function osLorekSteps(t, out = []) {
  if (t.k === 's') return out;
  osLorekSteps(t.a, out); if (t.b) osLorekSteps(t.b, out);
  const s = osStr(t);
  if (t.k === 'n') out.push(`${s}: semua rantau dalam ξ di luar ${osStr(t.a)}.`);
  else if (t.k === 'i') out.push(`${s}: rantau yang sepunya bagi ${osStr(t.a)} dan ${osStr(t.b)}.`);
  else out.push(`${s}: semua rantau dalam ${osStr(t.a)} atau ${osStr(t.b)}.`);
  return out;
}

/* =================== rajah Venn =================== */
const OSLAY = {
  L2: { w: 340, h: 230, c: [[128, 118, 80], [212, 118, 80]], lab: [[58, 40], [282, 40]] },
  L2s: { w: 340, h: 230, c: [[160, 118, 95], [188, 128, 46]], lab: [[70, 40], [188, 70]] },
  L2d: { w: 340, h: 230, c: [[96, 118, 64], [244, 118, 64]], lab: [[40, 50], [300, 50]] },
  L3: { w: 340, h: 286, c: [[128, 110, 82], [212, 110, 82], [170, 183, 82]], lab: [[60, 32], [280, 32], [272, 262]] },
  L3r: { w: 340, h: 230, c: [[88, 118, 62], [170, 118, 62], [252, 118, 62]], lab: [[40, 56], [170, 40], [300, 56]] },
  L3s: { w: 340, h: 230, c: [[150, 118, 92], [254, 118, 60], [120, 130, 40]], lab: [[56, 40], [300, 52], [120, 78]] }
};
const OSCOL = ['tr', 'pk', 'am'];
const osR1 = v => Math.round(v * 10) / 10;
const osAtomAt = (C, x, y) => C.reduce((m, [cx, cy, r], k) => m | ((x - cx) ** 2 + (y - cy) ** 2 < r * r ? 1 << k : 0), 0);
function osPath(kind, mask) {
  const L = OSLAY[kind], C = L.c, V = [], cuts = C.map(() => []);
  for (let i = 0; i < C.length; i++) for (let j = i + 1; j < C.length; j++) {
    const [x1, y1, r1] = C[i], [x2, y2, r2] = C[j], d = Math.hypot(x2 - x1, y2 - y1);
    if (d >= r1 + r2 || d <= Math.abs(r1 - r2)) continue;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a), mx = x1 + a * (x2 - x1) / d, my = y1 + a * (y2 - y1) / d;
    for (const sg of [1, -1]) {
      const p = [mx + sg * h * (y2 - y1) / d, my - sg * h * (x2 - x1) / d]; V.push(p); const k = V.length - 1;
      cuts[i].push([Math.atan2(p[1] - y1, p[0] - x1), k]); cuts[j].push([Math.atan2(p[1] - y2, p[0] - x2), k]);
    }
  }
  const inR = a => mask >> a & 1;
  const others = (i, x, y) => C.reduce((m, [cx, cy, r], k) => m | (k !== i && (x - cx) ** 2 + (y - cy) ** 2 < r * r ? 1 << k : 0), 0);
  const edges = []; let d = '';
  C.forEach(([cx, cy, r], i) => {
    const cu = cuts[i].sort((p, q) => p[0] - q[0]);
    if (!cu.length) {
      const m = others(i, cx + r, cy);
      if (inR(m | 1 << i) !== inR(m)) d += `M${osR1(cx + r)} ${cy}A${r} ${r} 0 1 1 ${osR1(cx - r)} ${cy}A${r} ${r} 0 1 1 ${osR1(cx + r)} ${cy}Z`;
      return;
    }
    cu.forEach(([t0, a], k) => {
      let [t1, b] = cu[(k + 1) % cu.length]; if (k + 1 === cu.length) t1 += 2 * Math.PI;
      const tm = (t0 + t1) / 2, m = others(i, cx + r * Math.cos(tm), cy + r * Math.sin(tm));
      if (inR(m | 1 << i) !== inR(m)) edges.push({ i, a, b, big: t1 - t0 > Math.PI ? 1 : 0 });
    });
  });
  const used = edges.map(() => false);
  edges.forEach((e0, s0) => {
    if (used[s0]) return;
    const start = e0.a; let cur = start, e = s0;
    d += `M${osR1(V[start][0])} ${osR1(V[start][1])}`;
    for (let guard = 0; guard < 40; guard++) {
      used[e] = true; const E = edges[e], fwd = E.a === cur, nx = fwd ? E.b : E.a, r = C[E.i][2];
      d += `A${r} ${r} 0 ${E.big} ${fwd ? 1 : 0} ${osR1(V[nx][0])} ${osR1(V[nx][1])}`;
      cur = nx; if (cur === start) break;
      e = edges.findIndex((q, k) => !used[k] && (q.a === cur || q.b === cur)); if (e < 0) break;
    }
    d += 'Z';
  });
  if (inR(0)) d += `M12 12H${L.w - 12}V${L.h - 12}H12Z`;
  return d;
}
// kedudukan unsur dalam setiap atom (terdalam dahulu), dicache
const OSSLOT = {};
function osSlots(kind, a) {
  const key = kind + a; if (OSSLOT[key]) return OSSLOT[key];
  const L = OSLAY[kind], x0 = 12, y0 = 12, x1 = L.w - 12, y1 = L.h - 12, avoid = L.lab.concat([[26, 30]]), pts = [];
  for (let y = y0 + 3; y < y1; y += 3) for (let x = x0 + 3; x < x1; x += 3) {
    if (osAtomAt(L.c, x, y) !== a) continue;
    const cl = Math.min(...L.c.map(([cx, cy, r]) => Math.abs(Math.hypot(x - cx, y - cy) - r)), x - x0, x1 - x, y - y0, y1 - y);
    if (cl >= 9 && avoid.every(p => Math.hypot(x - p[0], y - p[1]) > 28)) pts.push([cl, x, y]);
  }
  pts.sort((p, q) => q[0] - p[0]);
  const out = [];
  for (const [, x, y] of pts) if (out.every(([u, v]) => Math.abs(x - u) >= 24 || Math.abs(y - v) >= 19)) out.push([x, y]);
  return (OSSLOT[key] = out);
}
const osCap = (kind, a) => osSlots(kind, a).length;
const osTxt = (x, y, t, c = 'tx', sz = 17, w = 700) => `<text x="${osR1(x)}" y="${osR1(y)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" text-anchor="middle" dominant-baseline="central">${t}</text>`;
// o = { L, names, mask, els:{atom:[..]}, cnt:{atom:teks}, label }
function osVenn(o) {
  const L = OSLAY[o.L || 'L2'], nm = o.names || 'ABC';
  let s = `<rect x="12" y="12" width="${L.w - 24}" height="${L.h - 24}" rx="8" style="fill:var(--surf);stroke:var(--mu)" stroke-width="2.5"/>`;
  if (o.mask) s += `<path d="${osPath(o.L || 'L2', o.mask)}" fill-rule="evenodd" style="fill:var(--${o.shade || 'gr'});fill-opacity:.4"/>`;
  L.c.forEach(([cx, cy, r], k) => { s += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--${OSCOL[k]})" stroke-width="3"/>`; });
  L.lab.forEach(([x, y], k) => { s += osTxt(x, y, nm[k], OSCOL[k], 21, 800); });
  s += osTxt(26, 30, 'ξ', 'mu', 20, 800);
  if (o.els) Object.keys(o.els).forEach(a => {
    const it = o.els[a]; if (!it.length) return;
    const sl = osSlots(o.L || 'L2', +a).slice(0, it.length).sort((p, q) => Math.round(p[1] / 19) - Math.round(q[1] / 19) || p[0] - q[0]);
    it.forEach((v, i) => { if (sl[i]) s += osTxt(sl[i][0], sl[i][1], v, 'tx', 16, 600); });
  });
  if (o.cnt) Object.keys(o.cnt).forEach(a => { const p = osSlots(o.L || 'L2', +a)[0]; if (p) s += osTxt(p[0], p[1], o.cnt[a], 'tx', 18, 800); });
  return `<svg viewBox="0 0 ${L.w} ${L.h}" role="img" aria-label="${esc(o.label || 'Gambar rajah Venn')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// bahagikan unsur kepada atom
function osAtoms(U, S, nm) {
  const out = {};
  U.forEach(v => { const a = [...nm].reduce((m, x, k) => m | (S[x].includes(v) ? 1 << k : 0), 0); (out[a] = out[a] || []).push(String(v)); });
  return out;
}
const osFits = (kind, els) => Object.keys(els).every(a => els[a].length <= osCap(kind, +a));
const osAtomList = (mask, n) => { const o = []; for (let a = 0; a < 1 << n; a++) if (mask >> a & 1) o.push(a); return o; };

/* =================== data set nombor =================== */
const osPrime = x => { if (x < 2) return false; for (let d = 2; d * d <= x; d++) if (x % d === 0) return false; return true; };
const OSPRED = [
  ['nombor genap', x => x % 2 === 0], ['nombor ganjil', x => x % 2 === 1], ['gandaan 3', x => x % 3 === 0],
  ['gandaan 4', x => x % 4 === 0], ['gandaan 5', x => x % 5 === 0], ['nombor perdana', osPrime],
  ['faktor bagi 12', x => 12 % x === 0], ['faktor bagi 18', x => 18 % x === 0], ['faktor bagi 20', x => 20 % x === 0],
  ['faktor bagi 24', x => 24 % x === 0], ['faktor bagi 30', x => 30 % x === 0], ['nombor kuasa dua sempurna', x => Number.isInteger(Math.sqrt(x))]
];
const OSNM = ['ABC', 'PQR', 'JKL', 'XYZ', 'EFG', 'KLM'];
// n set nombor dalam semesta integer; ok(data) = syarat tambahan
function osData(r, n, ok) {
  for (let t = 0; t < 400; t++) {
    const lo = r.i(1, 5), hi = lo + r.i(9, 13), U = []; for (let x = lo; x <= hi; x++) U.push(x);
    const pr = osShuf(r, OSPRED).slice(0, n);
    if (pr.some(p => p[0] === 'nombor genap') && pr.some(p => p[0] === 'nombor ganjil')) continue;
    const nm = r.p(OSNM).slice(0, n), S = {}, desc = {};
    pr.forEach(([d, f], k) => { S[nm[k]] = U.filter(f); desc[nm[k]] = d; });
    const vals = nm.split('').map(x => S[x]);
    if (vals.some(v => v.length < 2 || v.length > U.length - 2)) continue;
    if (vals.some((v, i) => vals.some((w, j) => j > i && osSame(v, w)))) continue;
    const d = { U, S, desc, nm, lo, hi, lst: r.f() < .5 };
    if (!ok || ok(d)) return d;
  }
  throw new Error('osData');
}
const osXiTxt = d => `ξ = {<i>x</i> : <i>x</i> ialah integer, ${d.lo} ≤ <i>x</i> ≤ ${d.hi}}`;
const osSetTxt = (d, x) => (d.lst ? `${x} = ${osFS(d.S[x])}` : `${x} = {<i>x</i> : <i>x</i> ialah ${d.desc[x]}}`);
const osSetsTxt = d => { const a = d.nm.split('').map(x => osSetTxt(d, x)); return a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]; };
const osListWork = d => (d.lst ? [] : d.nm.split('').map(x => `${x} = ${osFS(d.S[x])}`));

/* =================== kolam ungkapan (huruf A, B, C) =================== */
const OSP = {
  i2: ['A ∩ B', '(A ∩ B)′', 'A′ ∩ B', 'A ∩ B′', 'A′ ∩ B′'],
  i2s: ['A ∩ B', '(A ∩ B)′', 'A′ ∩ B', 'A ∩ B′'],
  i3: ['A ∩ B ∩ C', '(A ∩ B ∩ C)′', 'A ∩ C', 'B ∩ C', 'A ∩ B ∩ C′', 'A′ ∩ B ∩ C', 'A ∩ B′ ∩ C'],
  u2: ['A ∪ B', '(A ∪ B)′', 'A′ ∪ B', 'A ∪ B′', 'A′ ∪ B′'],
  u2s: ['A ∪ B', '(A ∪ B)′', 'A′ ∪ B', 'A ∪ B′'],
  u3: ['A ∪ B ∪ C', '(A ∪ B ∪ C)′', 'A ∪ C', 'B ∪ C', 'A ∪ B ∪ C′', 'A′ ∪ B ∪ C'],
  g2: ['(A ∪ B) ∩ A′', '(A ∩ B)′ ∩ B', '(A ∩ B′) ∪ (A′ ∩ B)', '(A ∪ B)′ ∪ (A ∩ B)', 'A′ ∪ (A ∩ B)'],
  g3: ['(A ∩ B) ∪ C', 'A ∩ (B ∪ C)', '(A ∪ B) ∩ C', 'A ∪ (B ∩ C)', '(A ∩ C) ∪ B', '(A ∪ C) ∩ B', '(B ∪ C) ∩ A′', '(A ∩ B) ∪ (B ∩ C)'],
  g3c: ['(A ∪ B)′ ∩ C', 'A′ ∩ (B ∪ C)', '(A ∩ B)′ ∩ C', 'A ∩ (B ∪ C)′', '(A ∪ B) ∩ C′', '(A ∪ C)′ ∪ B', '(A ∩ B) ∪ C′', 'A′ ∩ B′ ∩ C']
};
const osNSet = e => (/C/.test(e) ? 3 : 2);
// ungkapan salah biasa: tukar ∩ ↔ ∪, atau buang pelengkap
const osSwap = e => e.replace(/[∩∪]/g, c => (c === '∩' ? '∪' : '∩'));

/* =================== bank pernyataan betul / salah =================== */
const OSBS = {
  '4.1': [
    ['A ∩ B ialah set unsur yang terdapat dalam set A dan juga dalam set B.', true, 'Persilangan = unsur sepunya bagi kedua-dua set.'],
    ['Jika A ∩ B = ∅, maka set A dan set B tiada unsur sepunya.', true, '∅ ialah set kosong, jadi tiada unsur sepunya.'],
    ['(A ∩ B)′ = A′ ∩ B′', false, '(A ∩ B)′ meliputi semua rantau kecuali rantau bertindih, iaitu A′ ∪ B′.'],
    ['Jika B ⊂ A, maka A ∩ B = B.', true, 'Semua unsur B ada dalam A, jadi unsur sepunya ialah semua unsur B.'],
    ['n(A ∩ B) sentiasa lebih besar daripada n(A).', false, 'A ∩ B ialah subset bagi A, maka n(A ∩ B) ≤ n(A).'],
    ['A ∩ B = B ∩ A', true, 'Tertib set tidak mengubah unsur sepunya.'],
    ['Jika A = {1, 2, 3} dan B = {4, 5}, maka A ∩ B = {0}.', false, 'Tiada unsur sepunya, maka A ∩ B = ∅, bukan {0}.'],
    ['n((A ∩ B)′) = n(ξ) − n(A ∩ B)', true, 'Pelengkap mengandungi semua unsur ξ yang bukan dalam A ∩ B.']
  ],
  '4.2': [
    ['A ∪ B ialah set semua unsur yang terdapat dalam set A atau set B atau kedua-duanya.', true, 'Itulah takrif kesatuan set.'],
    ['n(A ∪ B) = n(A) + n(B) bagi sebarang set A dan B.', false, 'Unsur sepunya terkira dua kali; rumus yang betul: n(A ∪ B) = n(A) + n(B) − n(A ∩ B).'],
    ['(A ∪ B)′ = A′ ∩ B′', true, 'Kedua-duanya ialah rantau di luar bulatan A dan di luar bulatan B.'],
    ['Jika B ⊂ A, maka A ∪ B = A.', true, 'Semua unsur B sudah ada dalam A.'],
    ['{1, 2} ∪ {2, 3} = {1, 2, 2, 3}', false, 'Unsur sepunya ditulis sekali sahaja: {1, 2, 3}.'],
    ['A ∪ A′ = ξ', true, 'Setiap unsur ξ berada sama ada dalam A atau dalam A′.'],
    ['n(A ∪ B) sentiasa kurang daripada n(A).', false, 'A ialah subset bagi A ∪ B, maka n(A ∪ B) ≥ n(A).'],
    ['Jika A ∩ B = ∅, maka n(A ∪ B) = n(A) + n(B).', true, 'Tiada unsur sepunya yang terkira dua kali.']
  ]
};

/* =================== QV: bank cara tanya =================== */
const QV = {
  senarai: [
    ({ xi, sets, E }) => ({ q: `Diberi ${xi}, ${sets}. Senaraikan semua unsur bagi set ${E}.` }),
    ({ xi, sets, E }) => ({ q: `${xi}, ${sets}. Cari ${E}.` }),
    ({ xi, sets, E, res }) => ({ q: `Diberi ${sets}, dengan ${xi}. Nyatakan set ${E} dan <i>n</i>(${E}).`, ans: `${E} = ${osFS(res)}, <i>n</i>(${E}) = ${res.length}` }),
    ({ xi, sets, E, claim, why, ans }) => { if (!claim) return { q: `Dengan ${xi} dan ${sets}, tulis set ${E} dalam tatatanda senarai.` }; const N = vnama(); return Object.assign({ q: `Diberi ${xi}, ${sets}. ${N} berkata ${E} = ${claim}. Adakah ${N} betul?` }, salah(N, ans, why)); },
    ({ xi, sets, E }) => ({ q: `Diberi set semesta ${xi}. Jika ${sets}, senaraikan unsur set ${E}.` })
  ],
  vennUnsur: [
    ({ E }) => ({ q: `Gambar rajah Venn di bawah menunjukkan unsur-unsur set semesta ξ. Senaraikan unsur set ${E}.` }),
    ({ E, res }) => ({ q: `Berdasarkan gambar rajah Venn di bawah, cari <i>n</i>(${E}).`, ans: `<i>n</i>(${E}) = ${res.length}` }),
    ({ E, res }) => ({ q: `Rajah Venn di bawah menunjukkan set ξ dan subsetnya. Nyatakan set ${E} dan bilangan unsurnya.`, ans: `${E} = ${osFS(res)}, <i>n</i>(${E}) = ${res.length}` }),
    ({ E, claim, why, ans }) => { if (!claim) return { q: `Dengan menggunakan gambar rajah Venn di bawah, senaraikan unsur bagi ${E}.` }; const N = vnama(); return Object.assign({ q: `Berdasarkan gambar rajah Venn di bawah, ${N} menulis ${E} = ${claim}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  lorek: [
    ({ E }) => ({ q: `Pada gambar rajah Venn di bawah, lorek rantau yang mewakili set ${E}.` }),
    ({ E }) => ({ q: `Lorek set ${E} pada gambar rajah Venn di bawah.` }),
    ({ E }) => ({ q: `Gambar rajah Venn di bawah menunjukkan set ξ dan subsetnya. Lorek rantau ${E}.` }),
    ({ E }) => ({ q: `Salin gambar rajah Venn di bawah, kemudian lorek rantau yang mewakili ${E}.` })
  ],
  namakan: [
    () => ({ q: 'Nyatakan set yang diwakili oleh rantau berlorek dalam gambar rajah Venn di bawah.' }),
    () => ({ q: 'Tulis ungkapan operasi set bagi rantau berlorek dalam gambar rajah Venn di bawah.' }),
    () => ({ q: 'Rantau berlorek dalam gambar rajah Venn di bawah mewakili satu set. Nyatakan set itu menggunakan simbol ∩, ∪ atau ′.' }),
    ({ claim, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata rantau berlorek dalam gambar rajah Venn di bawah mewakili ${claim}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  vennBil: [
    ({ E }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan unsur dalam setiap rantau. Cari <i>n</i>(${E}).` }),
    ({ E }) => ({ q: `Berdasarkan bilangan unsur dalam gambar rajah Venn di bawah, hitung <i>n</i>(${E}).` }),
    ({ E, tot }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan murid dalam setiap rantau. Jumlah murid ialah ${tot}. Berapakah <i>n</i>(${E})?` }),
    ({ E, claim, ans }) => { const N = vnama(); return Object.assign({ q: `Berdasarkan gambar rajah Venn di bawah, ${N} berkata <i>n</i>(${E}) = ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak mengambil kira semua rantau bagi ${E}.`)); }
  ],
  pelN: [
    ({ E, nU, nE, ns }) => ({ q: `Diberi <i>n</i>(ξ) = ${nU} dan <i>n</i>(${E}) = ${nE}. Cari <i>n</i>((${E})′).` }),
    ({ E, nU, nE }) => ({ q: `Sebuah kelas mempunyai ${nU} orang murid. Bilangan murid dalam set ${E} ialah ${nE}. Berapakah <i>n</i>((${E})′)?` }),
    ({ E, nU, nE }) => ({ q: `Lengkapkan: <i>n</i>((${E})′) = <i>n</i>(ξ) − <i>n</i>(${E}) = ${nU} − ${nE} = ___` }),
    ({ E, nU, ns }) => ({ q: `Diberi <i>n</i>(ξ) = ${nU} dan <i>n</i>((${E})′) = ${nU - ns}. Cari <i>n</i>(${E}).`, ans: `<i>n</i>(${E}) = ${ns}`, work: ['<i>n</i>(ξ) = <i>n</i>(' + E + ') + <i>n</i>((' + E + ')′)', `<i>n</i>(${E}) = ${nU} − ${nU - ns} = ${ns}`] })
  ],
  cariX: [
    ({ tot, E }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan unsur dalam set ξ, dengan <i>n</i>(ξ) = ${tot}. Cari (a) nilai <i>x</i>, (b) <i>n</i>(${E}).` }),
    ({ tot, E }) => ({ q: `Diberi <i>n</i>(ξ) = ${tot}. Berdasarkan gambar rajah Venn di bawah, hitung nilai <i>x</i>. Seterusnya, cari <i>n</i>(${E}).` }),
    ({ tot, E }) => ({ q: `Seramai ${tot} orang murid ditinjau dan keputusannya ditunjukkan dalam gambar rajah Venn di bawah. Hitung (a) nilai <i>x</i>, (b) <i>n</i>(${E}).` }),
    ({ tot, E }) => ({ q: `Gambar rajah Venn di bawah mewakili ${tot} orang peserta suatu pertandingan. Cari nilai <i>x</i>, seterusnya <i>n</i>(${E}).` })
  ],
  rumus: [
    ({ a, b, c, A, B }) => ({ q: `Diberi <i>n</i>(${A}) = ${a}, <i>n</i>(${B}) = ${b} dan <i>n</i>(${A} ∩ ${B}) = ${c}. Cari <i>n</i>(${A} ∪ ${B}).` }),
    ({ a, b, c, A, B }) => ({ q: `Dalam sebuah kelas, ${a} murid suka sejarah (${A}), ${b} murid suka geografi (${B}) dan ${c} murid suka kedua-duanya. Berapakah bilangan murid yang suka sekurang-kurangnya satu subjek itu?` }),
    ({ a, b, c, A, B }) => ({ q: `Lengkapkan: <i>n</i>(${A} ∪ ${B}) = <i>n</i>(${A}) + <i>n</i>(${B}) − <i>n</i>(${A} ∩ ${B}) = ${a} + ${b} − ${c} = ___` }),
    ({ a, b, c, A, B, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi <i>n</i>(${A}) = ${a}, <i>n</i>(${B}) = ${b} dan <i>n</i>(${A} ∩ ${B}) = ${c}. ${N} berkata <i>n</i>(${A} ∪ ${B}) = ${a + b}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa menolak <i>n</i>(${A} ∩ ${B}); unsur sepunya terkira dua kali.`)); }
  ],
  rumusT: [
    ({ a, b, u, A, B }) => ({ q: `Diberi <i>n</i>(${A}) = ${a}, <i>n</i>(${B}) = ${b} dan <i>n</i>(${A} ∪ ${B}) = ${u}. Cari <i>n</i>(${A} ∩ ${B}).` }),
    ({ a, b, u, A, B }) => ({ q: `Seramai ${u} orang pengunjung membeli sekurang-kurangnya satu jenis kuih. ${a} orang membeli kuih ${A === 'K' ? 'karipap' : 'apam'} dan ${b} orang membeli kuih ${A === 'K' ? 'lapis' : 'seri muka'}. Berapakah bilangan pengunjung yang membeli kedua-dua jenis kuih?` }),
    ({ a, c, u, A, B }) => ({ q: `Diberi <i>n</i>(${A} ∪ ${B}) = ${u}, <i>n</i>(${A}) = ${a} dan <i>n</i>(${A} ∩ ${B}) = ${c}. Cari <i>n</i>(${B}).`, ans: `<i>n</i>(${B}) = ${u - a + c}`, work: [`<i>n</i>(${A} ∪ ${B}) = <i>n</i>(${A}) + <i>n</i>(${B}) − <i>n</i>(${A} ∩ ${B})`, `${u} = ${a} + <i>n</i>(${B}) − ${c}`, `<i>n</i>(${B}) = ${u} − ${a} + ${c} = ${u - a + c}`] }),
    ({ a, b, u, A, B }) => ({ q: `Lengkapkan: ${u} = ${a} + ${b} − <i>n</i>(${A} ∩ ${B}), maka <i>n</i>(${A} ∩ ${B}) = ___` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  /* ---------- soalan sukar (setiap cara mempunyai data, jawapan & rajah sendiri) ---------- */
  k41: [
    ({ kel }) => ({ q: `Dalam sebuah kelas ${kel.U} orang murid, ${kel.a} orang menyertai Kelab Sains (S), ${kel.b} orang menyertai Kelab Matematik (M) dan ${kel.none} orang tidak menyertai mana-mana kelab itu. (a) Cari <i>n</i>(S ∩ M). (b) Berapakah murid yang menyertai Kelab Sains sahaja?`, ans: `(a) ${kel.x} (b) ${kel.a - kel.x}`, work: ['Katakan <i>n</i>(S ∩ M) = <i>x</i>.', `(${kel.a} − <i>x</i>) + <i>x</i> + (${kel.b} − <i>x</i>) + ${kel.none} = ${kel.U}`, `${kel.a + kel.b + kel.none} − <i>x</i> = ${kel.U} → <i>x</i> = ${kel.x}`, `(b) <i>n</i>(S ∩ M′) = ${kel.a} − ${kel.x} = ${kel.a - kel.x}`], figAns: kel.fig }),
    ({ t3 }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan unsur set ξ, A, B dan C. Diberi <i>n</i>(A ∩ B) = ${t3.nAB}. (a) Cari nilai <i>x</i>. (b) Cari <i>n</i>(A ∩ C).`, ans: `(a) <i>x</i> = ${t3.x} (b) ${t3.nAC}`, work: [`<i>n</i>(A ∩ B) = ${t3.lab3} + ${t3.lab7} = ${t3.nAB}`, `<i>x</i> = ${t3.nAB} − ${t3.lab7} = ${t3.x}`, `(b) <i>n</i>(A ∩ C) = ${t3.v5} + ${t3.v7} = ${t3.nAC}`], fig: t3.fig }),
    ({ ab }) => ({ q: `Diberi <i>n</i>(ξ) = ${ab.U}, <i>n</i>(A) = ${ab.a}, <i>n</i>(B) = ${ab.b} dan <i>n</i>(A′ ∩ B′) = ${ab.none}. Cari (a) <i>n</i>(A ∩ B), (b) <i>n</i>((A ∩ B)′).`, ans: `(a) ${ab.x} (b) ${ab.U - ab.x}`, work: [`<i>n</i>(A ∪ B) = ${ab.U} − ${ab.none} = ${ab.U - ab.none}`, `<i>n</i>(A ∩ B) = ${ab.a} + ${ab.b} − ${ab.U - ab.none} = ${ab.x}`, `<i>n</i>((A ∩ B)′) = ${ab.U} − ${ab.x} = ${ab.U - ab.x}`] }),
    ({ ls }) => ({ q: `Diberi ${ls.xi}, ${ls.sets}. (a) Senaraikan unsur A ∩ B ∩ C. (b) Cari <i>n</i>((A ∩ B ∩ C)′).`, ans: `(a) ${osFS(ls.r)} (b) ${ls.n - ls.r.length}`, work: ls.work.concat([`<i>n</i>((A ∩ B ∩ C)′) = ${ls.n} − ${ls.r.length} = ${ls.n - ls.r.length}`]), figAns: ls.fig })
  ],
  k42: [
    ({ tj }) => ({ q: `Seramai ${tj.U} orang pelancong ditinjau. ${tj.a} orang pernah melawat Langkawi (L), ${tj.b} orang pernah melawat Pulau Pinang (P) dan ${tj.c} orang pernah melawat kedua-duanya. Cari bilangan pelancong yang (a) pernah melawat sekurang-kurangnya satu tempat, (b) tidak pernah melawat mana-mana tempat itu, (c) melawat satu tempat sahaja.`, ans: `(a) ${tj.u} (b) ${tj.U - tj.u} (c) ${tj.u - tj.c}`, work: [`(a) <i>n</i>(L ∪ P) = ${tj.a} + ${tj.b} − ${tj.c} = ${tj.u}`, `(b) <i>n</i>((L ∪ P)′) = ${tj.U} − ${tj.u} = ${tj.U - tj.u}`, `(c) Satu tempat sahaja = ${tj.u} − ${tj.c} = ${tj.u - tj.c}`], figAns: tj.fig }),
    ({ rt }) => ({ q: `Diberi <i>n</i>(A ∪ B) = ${rt.u}, <i>n</i>(A) = ${rt.a} dan <i>n</i>(B) = ${rt.b}. Cari (a) <i>n</i>(A ∩ B), (b) <i>n</i>(A′ ∩ B).`, ans: `(a) ${rt.c} (b) ${rt.b - rt.c}`, work: [`${rt.u} = ${rt.a} + ${rt.b} − <i>n</i>(A ∩ B)`, `<i>n</i>(A ∩ B) = ${rt.a + rt.b} − ${rt.u} = ${rt.c}`, `(b) <i>n</i>(A′ ∩ B) = <i>n</i>(B) − <i>n</i>(A ∩ B) = ${rt.b} − ${rt.c} = ${rt.b - rt.c}`] }),
    ({ u3 }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan unsur set ξ, P, Q dan R. Diberi <i>n</i>(P ∪ Q ∪ R) = ${u3.nUni}. (a) Cari nilai <i>x</i>. (b) Cari <i>n</i>((P ∪ Q)′).`, ans: `(a) <i>x</i> = ${u3.x} (b) ${u3.nPQc}`, work: u3.work, fig: u3.fig }),
    ({ sb }) => ({ q: `Set B ialah subset bagi set A. Diberi <i>n</i>(ξ) = ${sb.U}, <i>n</i>(A) = ${sb.a} dan <i>n</i>(B) = ${sb.b}. Cari (a) <i>n</i>(A ∪ B), (b) <i>n</i>((A ∪ B)′), (c) <i>n</i>(A ∩ B′).`, ans: `(a) ${sb.a} (b) ${sb.U - sb.a} (c) ${sb.a - sb.b}`, work: ['B ⊂ A, maka A ∪ B = A dan A ∩ B = B.', `(a) <i>n</i>(A ∪ B) = <i>n</i>(A) = ${sb.a}`, `(b) <i>n</i>((A ∪ B)′) = ${sb.U} − ${sb.a} = ${sb.U - sb.a}`, `(c) <i>n</i>(A ∩ B′) = ${sb.a} − ${sb.b} = ${sb.a - sb.b}`], fig: sb.fig })
  ],
  k43: [
    ({ g }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan murid yang mengambil subjek Fizik (F), Kimia (K) dan Biologi (B). Diberi <i>n</i>(ξ) = ${g.tot}. (a) Cari nilai <i>x</i>. (b) Cari <i>n</i>(${g.E}).`, ans: `(a) <i>x</i> = ${g.x} (b) ${g.vE}`, work: g.work, fig: g.fig, figAns: g.figAns }),
    ({ sk }) => ({ q: `Dalam satu tinjauan terhadap ${sk.U} orang murid: ${sk.ab} orang bermain bola sepak (S) dan badminton (B), ${sk.bk} orang bermain badminton dan bola keranjang (K), ${sk.ak} orang bermain bola sepak dan bola keranjang, ${sk.all} orang bermain ketiga-tiganya, ${sk.s} orang bermain bola sepak sahaja, ${sk.b} orang bermain badminton sahaja, ${sk.k} orang bermain bola keranjang sahaja. Cari (a) bilangan murid yang tidak bermain mana-mana sukan itu, (b) <i>n</i>((S ∪ B) ∩ K′).`, ans: `(a) ${sk.none} (b) ${sk.sbOnly}`, work: sk.work, figAns: sk.fig }),
    ({ ls }) => ({ q: `Diberi ${ls.xi}, ${ls.sets}. (a) Senaraikan unsur ${ls.E}. (b) Cari <i>n</i>(${ls.E2}).`, ans: `(a) ${osFS(ls.r)} (b) ${ls.r2.length}`, work: ls.work, figAns: ls.fig }),
    ({ cx }) => ({ q: `Gambar rajah Venn di bawah menunjukkan bilangan pelanggan yang membeli roti (R), susu (S) dan telur (T). Bilangan pelanggan yang membeli roti ialah ${cx.nR}. (a) Cari nilai <i>x</i>. (b) Berapakah pelanggan yang membeli susu atau telur tetapi tidak membeli roti?`, ans: `(a) <i>x</i> = ${cx.x} (b) ${cx.nQ}`, work: cx.work, fig: cx.fig })
  ]
};

/* =================== pembina soalan (r = osRG atau osRW) =================== */
const OS = {};
// ungkapan → teks dengan nama set data
const osPickE = (r, pool, nm) => osRen(r.p(pool), nm);
// salah biasa untuk soalan senarai
function osClaim(E, U, S, res) {
  const alt = osSwap(E);
  if (alt !== E) { const v = osSetEval(alt, U, S); if (!osSame(v, res)) return { claim: osFS(v), why: `Itu ialah set ${alt}. Ingat: ∩ bermaksud unsur sepunya, ∪ bermaksud semua unsur.` }; }
  if (/′/.test(E)) { const nc = E.replace(/′/g, ''); try { const v = osSetEval(nc, U, S); if (!osSame(v, res)) return { claim: osFS(v), why: 'Simbol ′ (pelengkap) tidak diambil kira.' }; } catch (e) { /* ungkapan tidak sah */ } }
  const extra = U.find(v => !res.includes(v));
  if (extra != null) return { claim: osFS(U.filter(v => res.includes(v) || v === extra)), why: `${extra} bukan unsur ${E}.` };
  return { claim: null };
}
OS.senarai = (r, pool, n, need) => {
  const d = osData(r, n);
  const E = osPickE(r, pool, d.nm), t = osParse(E), res = osSetEval(t, d.U, d.S);
  if (need && !res.length && r.f() < .85) return OS.senarai(r, pool, n, need);
  const ans = `${E} = ${osFS(res)}`, cl = osClaim(E, d.U, d.S, res);
  const work = (/′/.test(E) ? [`ξ = ${osFS(d.U)}`] : []).concat(osListWork(d), osSteps(t, d.U, d.S));
  const figAns = osFits(n === 2 ? 'L2' : 'L3', osAtoms(d.U, d.S, d.nm)) ? osVenn({ L: n === 2 ? 'L2' : 'L3', names: d.nm, mask: osMask(E, d.nm), els: osAtoms(d.U, d.S, d.nm), label: `Gambar rajah Venn bagi ${E}` }) : '';
  return GEN_LQ('senarai', { xi: osXiTxt(d), sets: osSetsTxt(d), E, res, ans, claim: cl.claim, why: cl.why, work }, { figAns });
};
OS.vennUnsur = (r, pool, n) => {
  const L = n === 2 ? 'L2' : 'L3';
  const d = osData(r, n, dd => osFits(L, osAtoms(dd.U, dd.S, dd.nm)));
  const E = osPickE(r, pool, d.nm), t = osParse(E), res = osSetEval(t, d.U, d.S), els = osAtoms(d.U, d.S, d.nm);
  const cl = osClaim(E, d.U, d.S, res);
  const work = [`Kenal pasti rantau bagi ${E} dalam gambar rajah Venn.`].concat(osSteps(t, d.U, d.S));
  if (res.length) work.push(`<i>n</i>(${E}) = ${res.length}`);
  return GEN_LQ('vennUnsur', { E, res, ans: `${E} = ${osFS(res)}`, claim: cl.claim, why: cl.why, work },
    { fig: osVenn({ L, names: d.nm, els, label: 'Gambar rajah Venn dengan unsur' }), figAns: osVenn({ L, names: d.nm, els, mask: osMask(E, d.nm), label: `Rantau ${E} berlorek` }) });
};
OS.lorek = (r, pool, layouts) => {
  const e0 = r.p(pool), n = osNSet(e0), L = r.p(layouts.filter(l => +l[1] === n)), nm = r.p(OSNM).slice(0, n), E = osRen(e0, nm);
  const t = osParse(E), lay = { L2s: 'Set ' + nm[1] + ' ialah subset bagi set ' + nm[0] + '.', L2d: `${nm[0]} ∩ ${nm[1]} = ∅.`, L3r: `${nm[0]} ∩ ${nm[2]} = ∅.`, L3s: `${nm[2]} ⊂ ${nm[0]} dan ${nm[1]} ∩ ${nm[2]} = ∅.` }[L];
  const work = (lay ? [lay] : []).concat(osLorekSteps(t));
  const v = GEN_LQ('lorek', { E, ans: 'Rujuk rajah jawapan.', work }, { fig: osVenn({ L, names: nm, label: 'Gambar rajah Venn kosong' }) });
  return Object.assign(v, { figAns: osVenn({ L, names: nm, mask: osMask(E, nm), label: `Rantau ${E} berlorek` }), kind: 'lukis' });
};
OS.namakan = (r, pool) => {
  const e0 = r.p(pool), n = osNSet(e0), L = n === 2 ? 'L2' : 'L3', nm = r.p(OSNM).slice(0, n), E = osRen(e0, nm), m = osMask(E, nm);
  // dakwaan salah: ungkapan lain dalam kolam dengan rantau berbeza
  const oth = osShuf(r, pool.map(x => osRen(x, nm)).concat([osSwap(E)])).find(x => x !== E && osMask(x, nm) !== m) || osSwap(E);
  const work = ['Kenal pasti rantau berlorek, kemudian bina ungkapan langkah demi langkah:'].concat(osLorekSteps(osParse(E)));
  return GEN_LQ('namakan', { ans: E, claim: oth, why: `${oth} mewakili rantau yang berbeza.`, work }, { fig: osVenn({ L, names: nm, mask: m, label: 'Gambar rajah Venn dengan rantau berlorek' }) });
};
// nombor dalam setiap atom
function osCounts(r, n, L, lo = 1, hi = 15) {
  const c = {}; for (let a = 0; a < 1 << n; a++) if (osCap(L, a)) c[a] = r.i(lo, hi);
  return c;
}
OS.vennBil = (r, pool, n) => {
  const L = n === 2 ? 'L2' : 'L3', nm = r.p(OSNM).slice(0, n), c = osCounts(r, n, L, 1, 14), E = osPickE(r, pool, nm), m = osMask(E, nm);
  const at = osAtomList(m, n).filter(a => c[a] != null), val = at.reduce((s, a) => s + c[a], 0), tot = Object.values(c).reduce((s, v) => s + v, 0);
  const miss = at.length > 1 ? val - c[at[at.length - 1]] : val + c[osAtomList(((1 << (1 << n)) - 1) & ~m, n)[0]];
  const cnt = {}; Object.keys(c).forEach(a => { cnt[a] = String(c[a]); });
  const work = [`Rantau bagi ${E}: tambah nombor dalam rantau yang berkaitan.`, `<i>n</i>(${E}) = ${at.map(a => c[a]).join(' + ')}${at.length > 1 ? ` = ${val}` : ''}`];
  return GEN_LQ('vennBil', { E, tot, ans: `<i>n</i>(${E}) = ${val}`, claim: miss, work },
    { fig: osVenn({ L, names: nm, cnt, label: 'Gambar rajah Venn dengan bilangan unsur' }), figAns: osVenn({ L, names: nm, cnt, mask: m, label: `Rantau ${E} berlorek` }) });
};
OS.pelN = (r, pool) => {
  const nm = r.p(OSNM).slice(0, 2), E = osPickE(r, pool, nm), nU = r.i(20, 45), nE = r.i(3, Math.floor(nU / 2));
  return GEN_LQ('pelN', { E, nU, nE, ns: nE, ans: `<i>n</i>((${E})′) = ${nU - nE}`, work: [`<i>n</i>((${E})′) = <i>n</i>(ξ) − <i>n</i>(${E})`, `= ${nU} − ${nE} = ${nU - nE}`] });
};
// x dalam bilangan: lab = teks bagi setiap atom, val = nilai sebenar
function osXData(r, n, L) {
  const forms = [[2, 0, '2x'], [1, 3, 'x + 3'], [3, 0, '3x'], [1, 1, 'x + 1'], [1, -2, 'x − 2'], [2, 1, '2x + 1']];
  for (let t = 0; t < 300; t++) {
    const x = r.i(2, 8), c = osCounts(r, n, L, 2, 12), ks = osShuf(r, Object.keys(c)).slice(0, n === 2 ? 2 : 3), lab = {}, val = {};
    let coef = 0, con = 0;
    Object.keys(c).forEach(a => {
      const i = ks.indexOf(a), f = i < 0 ? [0, c[a], String(c[a])] : i === 0 ? [1, 0, 'x'] : forms[(c[a] + i) % forms.length];
      lab[a] = f[2]; val[a] = f[0] * x + f[1]; coef += f[0]; con += f[1];
    });
    const tot = coef * x + con;
    if (Object.values(val).some(v => v <= 0) || tot > 90 || con <= 0) continue;
    return { x, lab, val, tot, coef, con };
  }
  throw new Error('osXData');
}
const osCoefTxt = k => (k === 1 ? '<i>x</i>' : `${k}<i>x</i>`);
OS.cariX = (r, pool, n) => {
  const L = n === 2 ? 'L2' : 'L3', nm = r.p(OSNM).slice(0, n), X = osXData(r, n, L), E = osPickE(r, pool, nm), m = osMask(E, nm);
  const at = osAtomList(m, n).filter(a => X.val[a] != null), vE = at.reduce((s, a) => s + X.val[a], 0);
  const it = x => x.replace(/x/g, '<i>x</i>');
  const work = [`Jumlah semua rantau = <i>n</i>(ξ)`, `${Object.keys(X.lab).map(a => (X.lab[a].includes(' ') ? `(${it(X.lab[a])})` : it(X.lab[a]))).join(' + ')} = ${X.tot}`,
    `${osCoefTxt(X.coef)} + ${X.con} = ${X.tot}`, `${osCoefTxt(X.coef)} = ${X.tot} − ${X.con} = ${X.tot - X.con}`, `<i>x</i> = ${X.tot - X.con} ÷ ${X.coef} = ${X.x}`, `<i>n</i>(${E}) = ${at.map(a => X.val[a]).join(' + ')}${at.length > 1 ? ` = ${vE}` : ''}`];
  const cnt = {}; Object.keys(X.lab).forEach(a => { cnt[a] = X.lab[a]; });
  return GEN_LQ('cariX', { tot: X.tot, E, vE, x: X.x, ans: `(a) <i>x</i> = ${X.x} (b) <i>n</i>(${E}) = ${vE}`, work }, { fig: osVenn({ L, names: nm, cnt, label: 'Gambar rajah Venn dengan bilangan unsur dalam sebutan x' }), figAns: osVenn({ L, names: nm, cnt, mask: m, label: `Rantau ${E} berlorek` }) });
};
OS.rumus = r => {
  const [A, B] = r.p([['A', 'B'], ['P', 'Q'], ['S', 'G'], ['M', 'N']]), c = r.i(2, 12), a = c + r.i(3, 20), b = c + r.i(3, 20);
  return GEN_LQ('rumus', { a, b, c, A, B, ans: `<i>n</i>(${A} ∪ ${B}) = ${a + b - c}`, work: [`<i>n</i>(${A} ∪ ${B}) = <i>n</i>(${A}) + <i>n</i>(${B}) − <i>n</i>(${A} ∩ ${B})`, `= ${a} + ${b} − ${c}`, `= ${a + b - c}`] });
};
OS.rumusT = r => {
  const [A, B] = r.p([['A', 'B'], ['K', 'L'], ['P', 'Q'], ['M', 'N']]), c = r.i(2, 15), a = c + r.i(3, 22), b = c + r.i(3, 22), u = a + b - c;
  return GEN_LQ('rumusT', { a, b, c, u, A, B, ans: `<i>n</i>(${A} ∩ ${B}) = ${c}`, work: [`<i>n</i>(${A} ∪ ${B}) = <i>n</i>(${A}) + <i>n</i>(${B}) − <i>n</i>(${A} ∩ ${B})`, `${u} = ${a} + ${b} − <i>n</i>(${A} ∩ ${B})`, `<i>n</i>(${A} ∩ ${B}) = ${a + b} − ${u} = ${c}`] });
};
OS.bs = (r, sub, k) => { const L = OSBS[sub], [s, ok, why] = k == null ? r.p(L) : L[k % L.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };

/* ---------- soalan sukar ---------- */
function osCntFig(L, nm, cnt, mask, label) { return osVenn({ L, names: nm, cnt, mask, label: label || 'Gambar rajah Venn dengan bilangan' }); }
OS.k41 = r => {
  // (1) dua kelab
  let kel; do { const U = r.i(30, 45), x = r.i(3, 9), sa = r.i(4, 14), sb = r.i(4, 14), none = U - sa - sb - x; kel = { U, x, a: sa + x, b: sb + x, none }; } while (kel.none < 2);
  kel.fig = osCntFig('L2', 'SM', { 1: String(kel.a - kel.x), 3: String(kel.x), 2: String(kel.b - kel.x), 0: String(kel.none) }, osMask('S ∩ M', 'SM'));
  // (2) tiga set, x dalam A ∩ B
  const x = r.i(2, 9), k3 = r.i(1, 6), nAB = x + k3, v5 = r.i(2, 9), cc = osCounts(r, 3, 'L3', 2, 12);
  const lab = {}; Object.keys(cc).forEach(a => { lab[a] = String(cc[a]); }); lab[3] = 'x'; lab[7] = String(k3); lab[5] = String(v5);
  const t3 = { x, nAB, lab3: '<i>x</i>', lab7: k3, v5, v7: k3, nAC: v5 + k3, fig: osCntFig('L3', 'ABC', lab) };
  // (3) abstrak
  let ab; do { const U = r.i(30, 60), xx = r.i(3, 12), a = xx + r.i(5, 18), b = xx + r.i(5, 18), none = U - (a + b - xx); ab = { U, x: xx, a, b, none }; } while (ab.none < 1);
  // (4) senarai tiga set
  const d = osData(r, 3, dd => osSetEval('A ∩ B ∩ C'.replace(/[ABC]/g, c => dd.nm['ABC'.indexOf(c)]), dd.U, dd.S).length > 0);
  const d2 = Object.assign({}, d, { S: { A: d.S[d.nm[0]], B: d.S[d.nm[1]], C: d.S[d.nm[2]] }, desc: { A: d.desc[d.nm[0]], B: d.desc[d.nm[1]], C: d.desc[d.nm[2]] }, nm: 'ABC' });
  const rr = osSetEval('A ∩ B ∩ C', d2.U, d2.S);
  const ls = { xi: osXiTxt(d2), sets: osSetsTxt(d2), r: rr, n: d2.U.length, work: osListWork(d2).concat(osSteps(osParse('A ∩ B ∩ C'), d2.U, d2.S)), fig: osFits('L3', osAtoms(d2.U, d2.S, 'ABC')) ? osVenn({ L: 'L3', names: 'ABC', els: osAtoms(d2.U, d2.S, 'ABC'), mask: osMask('A ∩ B ∩ C', 'ABC') }) : '' };
  const v = osVQ('k41', { kel, t3, ab, ls });
  return Object.assign({ fig: '', figAns: '' }, v);
};
OS.k42 = r => {
  let tj; do { const U = r.i(40, 90), c = r.i(4, 15), a = c + r.i(6, 25), b = c + r.i(6, 25); tj = { U, a, b, c, u: a + b - c }; } while (tj.U - tj.u < 2);
  tj.fig = osCntFig('L2', 'LP', { 1: String(tj.a - tj.c), 3: String(tj.c), 2: String(tj.b - tj.c), 0: String(tj.U - tj.u) }, osMask('L ∪ P', 'LP'));
  const c2 = r.i(3, 12), rt = { c: c2, a: c2 + r.i(4, 20), b: c2 + r.i(4, 20) }; rt.u = rt.a + rt.b - c2;
  // tiga set: n(P ∪ Q ∪ R) diberi
  const X = r.i(2, 7), cc = osCounts(r, 3, 'L3', 2, 11), lab = {}; Object.keys(cc).forEach(a => { lab[a] = String(cc[a]); });
  lab[5] = 'x'; lab[6] = '2x'; const val = Object.assign({}, cc, { 5: X, 6: 2 * X });
  const inner = [1, 2, 3, 4, 5, 6, 7], nUni = inner.reduce((s, a) => s + val[a], 0), con = nUni - 3 * X;
  const pqc = [0, 4].reduce((s, a) => s + val[a], 0);
  const u3 = { x: X, nUni, nPQc: pqc, fig: osCntFig('L3', 'PQR', lab), work: [`Jumlah rantau dalam P, Q atau R: ${inner.map(a => lab[a].replace('x', '<i>x</i>')).join(' + ')} = ${nUni}`, `3<i>x</i> + ${con} = ${nUni} → <i>x</i> = ${X}`, `(b) (P ∪ Q)′ = rantau R sahaja dan di luar semua set: ${val[4]} + ${val[0]} = ${pqc}`] };
  // subset
  const sb = { U: r.i(30, 60), b: r.i(4, 12) }; sb.a = sb.b + r.i(5, 15); if (sb.a >= sb.U) sb.U = sb.a + 5;
  sb.fig = osVenn({ L: 'L2s', names: 'AB', label: 'Gambar rajah Venn: B subset bagi A' });
  const v = osVQ('k42', { tj, rt, u3, sb });
  return Object.assign({ fig: '', figAns: '' }, v);
};
OS.k43 = r => {
  // (1) tiga subjek dengan x
  const X = osXData(r, 3, 'L3'), e = r.p(['(F ∪ K) ∩ B′', 'F ∩ (K ∪ B)', '(F ∩ K)′ ∩ B', '(F ∪ B)′']), m = osMask(e, 'FKB');
  const at = osAtomList(m, 3).filter(a => X.val[a] != null), vE = at.reduce((s, a) => s + X.val[a], 0), it = x => x.replace(/x/g, '<i>x</i>');
  const cnt = {}; Object.keys(X.lab).forEach(a => { cnt[a] = X.lab[a]; });
  const g = { tot: X.tot, x: X.x, E: e, vE, fig: osCntFig('L3', 'FKB', cnt), figAns: osCntFig('L3', 'FKB', cnt, m),
    work: [`${Object.keys(X.lab).map(a => (X.lab[a].includes(' ') ? `(${it(X.lab[a])})` : it(X.lab[a]))).join(' + ')} = ${X.tot}`, `${osCoefTxt(X.coef)} + ${X.con} = ${X.tot}`, `<i>x</i> = ${X.tot - X.con} ÷ ${X.coef} = ${X.x}`, `(b) <i>n</i>(${e}) = ${at.map(a => X.val[a]).join(' + ')}${at.length > 1 ? ` = ${vE}` : ''}`] };
  // (2) tinjauan sukan (isi dari tengah)
  const all = r.i(1, 5), pab = r.i(1, 6), pbk = r.i(1, 6), pak = r.i(1, 6), s = r.i(3, 12), b = r.i(3, 12), k = r.i(3, 12), none = r.i(2, 9);
  const U = all + pab + pbk + pak + s + b + k + none;
  const sk = { U, all, ab: pab + all, bk: pbk + all, ak: pak + all, s, b, k, none, sbOnly: s + b + pab,
    work: [`Isi dari tengah: S ∩ B ∩ K = ${all}`, `S ∩ B sahaja = ${pab + all} − ${all} = ${pab}; B ∩ K sahaja = ${pbk + all} − ${all} = ${pbk}; S ∩ K sahaja = ${pak + all} − ${all} = ${pak}`,
      `(a) Tiada sukan = ${U} − (${all} + ${pab} + ${pbk} + ${pak} + ${s} + ${b} + ${k}) = ${none}`, `(b) (S ∪ B) ∩ K′ = ${s} + ${b} + ${pab} = ${s + b + pab}`],
    fig: osCntFig('L3', 'SBK', { 1: String(s), 2: String(b), 4: String(k), 3: String(pab), 6: String(pbk), 5: String(pak), 7: String(all), 0: String(none) }, osMask('(S ∪ B) ∩ K′', 'SBK')) };
  // (3) senarai gabungan
  const d = osData(r, 3, dd => osFits('L3', osAtoms(dd.U, dd.S, dd.nm)));
  const d2 = Object.assign({}, d, { S: { A: d.S[d.nm[0]], B: d.S[d.nm[1]], C: d.S[d.nm[2]] }, desc: { A: d.desc[d.nm[0]], B: d.desc[d.nm[1]], C: d.desc[d.nm[2]] }, nm: 'ABC' });
  const E = r.p(OSP.g3), E2 = r.p(OSP.g3c.filter(x => x !== E)), r1 = osSetEval(E, d2.U, d2.S), r2 = osSetEval(E2, d2.U, d2.S);
  const ls = { xi: osXiTxt(d2), sets: osSetsTxt(d2), E, E2, r: r1, r2, work: [...new Set(osListWork(d2).concat(osSteps(osParse(E), d2.U, d2.S), osSteps(osParse(E2), d2.U, d2.S), [`<i>n</i>(${E2}) = ${r2.length}`]))],
    fig: osVenn({ L: 'L3', names: 'ABC', els: osAtoms(d2.U, d2.S, 'ABC'), mask: osMask(E, 'ABC') }) };
  // (4) roti, susu, telur
  const cc = osCounts(r, 3, 'L3', 2, 12), xx = r.i(2, 9), lab = {}; Object.keys(cc).forEach(a => { lab[a] = String(cc[a]); }); lab[3] = 'x';
  const val = Object.assign({}, cc, { 3: xx }), nR = [1, 3, 5, 7].reduce((s2, a) => s2 + val[a], 0), conR = nR - xx, nQ = [2, 4, 6].reduce((s2, a) => s2 + val[a], 0);
  const cx = { x: xx, nR, nQ, fig: osCntFig('L3', 'RST', lab), work: [`<i>n</i>(R) = ${lab[1]} + <i>x</i> + ${lab[5]} + ${lab[7]} = ${nR}`, `<i>x</i> + ${conR} = ${nR} → <i>x</i> = ${xx}`, `(b) (S ∪ T) ∩ R′ = ${val[2]} + ${val[6]} + ${val[4]} = ${nQ}`] };
  const v = osVQ('k43', { g, sk, ls, cx });
  return Object.assign({ fig: '', figAns: '' }, v);
};

/* =================== GEN: Latihan Kelas =================== */
const OSLAY2 = ['L2', 'L2', 'L2s', 'L2d'], OSLAY3 = ['L3', 'L3', 'L3r', 'L3s'];
const GEN = {
  '4.1': {
    m: [() => OS.senarai(osRG, OSP.i2, 2, true), () => OS.vennUnsur(osRG, OSP.i2, 2), () => OS.lorek(osRG, OSP.i2, ['L2']), () => OS.pelN(osRG, ['A ∩ B']), () => OS.bs(osRG, '4.1'), () => OS.vennBil(osRG, OSP.i2, 2)],
    s: [() => OS.senarai(osRG, OSP.i3, 3, true), () => OS.cariX(osRG, OSP.i2, 2), () => OS.vennBil(osRG, OSP.i3, 3), () => OS.lorek(osRG, OSP.i3, OSLAY3)],
    k: [() => OS.k41(osRG)]
  },
  '4.2': {
    m: [() => OS.senarai(osRG, OSP.u2, 2), () => OS.vennUnsur(osRG, OSP.u2, 2), () => OS.lorek(osRG, OSP.u2, OSLAY2), () => OS.pelN(osRG, ['A ∪ B']), () => OS.bs(osRG, '4.2'), () => OS.rumus(osRG)],
    s: [() => OS.senarai(osRG, OSP.u3, 3), () => OS.rumusT(osRG), () => OS.cariX(osRG, OSP.u2, 2), () => OS.vennBil(osRG, OSP.u3, 3)],
    k: [() => OS.k42(osRG)]
  },
  '4.3': {
    m: [() => OS.senarai(osRG, OSP.g3, 3), () => OS.lorek(osRG, OSP.g3, OSLAY3), () => OS.namakan(osRG, OSP.g2), () => OS.vennUnsur(osRG, OSP.g3, 3), () => OS.vennBil(osRG, OSP.g3, 3)],
    s: [() => OS.namakan(osRG, OSP.g3.concat(OSP.g3c)), () => OS.senarai(osRG, OSP.g3c, 3), () => OS.cariX(osRG, OSP.g3c, 3), () => OS.lorek(osRG, OSP.g3c, OSLAY3)],
    k: [() => OS.k43(osRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 4.1
WG.senarai41 = () => OS.senarai(osRW, OSP.i2, 2, true);
WG.vennUnsur41 = () => OS.vennUnsur(osRW, OSP.i2, 2);
WG.lorek41 = i => OS.lorek(osRW, [OSP.i2[i % 5]], ['L2']);
WG.pelN41 = () => OS.pelN(osRW, ['A ∩ B']);
WG.bs41 = i => OS.bs(osRW, '4.1', [2, 6][i % 2] + wri(0, 1) * 1);
WG.vennBil41 = () => OS.vennBil(osRW, OSP.i2, 2);
WG.senarai3_41 = () => OS.senarai(osRW, OSP.i3, 3, true);
WG.cariX41 = () => OS.cariX(osRW, OSP.i2, 2);
WG.lorek3_41 = i => OS.lorek(osRW, [OSP.i3[(i * 2 + 1) % OSP.i3.length]], [['L3', 'L3r', 'L3s'][i % 3]]);
WG.k41 = () => OS.k41(osRW);
// 4.2
WG.senarai42 = () => OS.senarai(osRW, OSP.u2, 2);
WG.vennUnsur42 = () => OS.vennUnsur(osRW, OSP.u2, 2);
WG.lorek42 = i => OS.lorek(osRW, [OSP.u2[i % 5]], [['L2', 'L2s', 'L2d'][i % 3]]);
WG.pelN42 = () => OS.pelN(osRW, ['A ∪ B']);
WG.bs42 = i => OS.bs(osRW, '4.2', [1, 4][i % 2] + wri(0, 1) * 2);
WG.rumus = () => OS.rumus(osRW);
WG.senarai3_42 = () => OS.senarai(osRW, OSP.u3, 3);
WG.rumusT = () => OS.rumusT(osRW);
WG.vennBil42 = () => OS.vennBil(osRW, OSP.u3, 3);
WG.k42 = () => OS.k42(osRW);
// 4.3
WG.senarai43 = () => OS.senarai(osRW, OSP.g3, 3);
WG.lorek43 = i => OS.lorek(osRW, [OSP.g3[i % OSP.g3.length]], [['L3', 'L3', 'L3r', 'L3s'][i % 4]]);
WG.namakan2 = i => OS.namakan(osRW, [OSP.g2[i % OSP.g2.length]]);
WG.vennUnsur43 = () => OS.vennUnsur(osRW, OSP.g3, 3);
WG.vennBil43 = () => OS.vennBil(osRW, OSP.g3, 3);
WG.namakan3 = i => OS.namakan(osRW, [OSP.g3c[i * 2 % OSP.g3c.length]]);
WG.senaraiC43 = () => OS.senarai(osRW, OSP.g3c, 3);
WG.cariX43 = () => OS.cariX(osRW, OSP.g3c, 3);
WG.k43 = () => OS.k43(osRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '4.1': [['m', 'senarai41', 5], ['m', 'vennUnsur41', 4], ['m', 'lorek41', 3], ['m', 'pelN41', 2], ['m', 'bs41', 2], ['m', 'vennBil41', 2], ['s', 'senarai3_41', 3], ['s', 'cariX41', 3], ['s', 'lorek3_41', 3], ['k', 'k41', 3]],
  '4.2': [['m', 'senarai42', 5], ['m', 'vennUnsur42', 4], ['m', 'lorek42', 3], ['m', 'pelN42', 2], ['m', 'bs42', 2], ['m', 'rumus', 2], ['s', 'senarai3_42', 3], ['s', 'rumusT', 3], ['s', 'vennBil42', 3], ['k', 'k42', 3]],
  '4.3': [['m', 'senarai43', 4], ['m', 'lorek43', 4], ['m', 'namakan2', 3], ['m', 'vennUnsur43', 4], ['m', 'vennBil43', 3], ['s', 'namakan3', 3], ['s', 'senaraiC43', 3], ['s', 'cariX43', 3], ['k', 'k43', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// 4 pilihan unik: jawapan + calon + isian
function osOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 0; w.length < 3 && k < 80; k++) { const c = fill(k); if (c != null && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const osMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
// pilihan set: calon daripada ungkapan lain + ubah suai
function osSetOpts(E, d) {
  const res = osSetEval(E, d.U, d.S), cands = [];
  [osSwap(E), E.replace(/′/g, '')].concat(['A ∩ B', 'A ∪ B', 'A ∩ B′', 'A′ ∩ B', '(A ∪ B)′', '(A ∩ B)′'].map(x => osRen(x, d.nm))).forEach(x => { try { cands.push(osFS(osSetEval(x, d.U, d.S))); } catch (e) { /* abaikan */ } });
  return osOpts(osFS(res), cands, k => { const v = d.U[k % d.U.length]; const s = res.includes(v) ? res.filter(y => y !== v) : d.U.filter(y => res.includes(y) || y === v); return osFS(s); });
}
// set kecil tersenarai (untuk games)
function osSmall(n) {
  for (let t = 0; t < 300; t++) {
    const lo = ri(1, 4), U = []; for (let x = lo; x < lo + ri(8, 10); x++) U.push(x);
    const nm = pick(OSNM).slice(0, n), S = {};
    nm.split('').forEach(x => { S[x] = U.filter(() => Math.random() < .45); });
    const v = nm.split('').map(x => S[x]);
    if (v.some(s => s.length < 2 || s.length > 6)) continue;
    if (n === 2 && osSetEval(osRen('A ∩ B', nm), U, S).length === 0) continue;
    if (!osFits(n === 2 ? 'L2' : 'L3', osAtoms(U, S, nm))) continue;
    return { U, S, nm, lst: true };
  }
  return { U: [1, 2, 3, 4, 5, 6, 7, 8], S: { A: [1, 2, 3, 4], B: [3, 4, 5] }, nm: 'AB', lst: true };
}
const osSetsLine = d => d.nm.split('').map(x => `${x} = ${osFS(d.S[x])}`).join(', ');
const CQGEN = {
  irisan: [
    () => { const d = osSmall(2), E = osRen('A ∩ B', d.nm); return osMcq(`${osSetsLine(d)}. Cari ${E}.`, osVenn({ L: 'L2', names: d.nm }), osSetOpts(E, d)); },
    () => { const d = osSmall(2), E = osRen(pick(OSP.i2), d.nm); return osMcq(`Berdasarkan gambar rajah Venn, cari ${E}.`, osVenn({ L: 'L2', names: d.nm, els: osAtoms(d.U, d.S, d.nm) }), osSetOpts(E, d)); },
    () => { const d = osSmall(3), E = osRen(pick(['A ∩ B ∩ C', 'A ∩ C', 'B ∩ C', 'A ∩ B ∩ C′']), d.nm); return osMcq(`Berdasarkan gambar rajah Venn, cari ${E}.`, osVenn({ L: 'L3', names: d.nm, els: osAtoms(d.U, d.S, d.nm) }), osSetOpts(E, d)); }
  ],
  kesatuan: [
    () => { const d = osSmall(2), E = osRen('A ∪ B', d.nm); return osMcq(`${osSetsLine(d)}. Cari ${E}.`, osVenn({ L: 'L2', names: d.nm }), osSetOpts(E, d)); },
    () => { const d = osSmall(2), E = osRen(pick(OSP.u2), d.nm); return osMcq(`Berdasarkan gambar rajah Venn, cari ${E}.`, osVenn({ L: 'L2', names: d.nm, els: osAtoms(d.U, d.S, d.nm) }), osSetOpts(E, d)); },
    () => { const c = ri(2, 9), a = c + ri(3, 12), b = c + ri(3, 12), u = a + b - c; return osMcq(`<i>n</i>(A) = ${a}, <i>n</i>(B) = ${b}, <i>n</i>(A ∩ B) = ${c}. Cari <i>n</i>(A ∪ B).`, osVenn({ L: 'L2', mask: osMask('A ∪ B', 'AB') }), osOpts(String(u), [String(a + b), String(a + b + c), String(a + b - 2 * c), String(u + 1)], k => String(u + k + 2))); }
  ],
  pelengkap: [
    () => { const d = osSmall(2), x = d.nm[0], E = `${x}′`; return osMcq(`ξ = ${osFS(d.U)}, ${x} = ${osFS(d.S[x])}. Cari ${E}.`, osVenn({ L: 'L2', names: d.nm }), osSetOpts(E, d)); },
    () => { const d = osSmall(2), E = osRen(pick(['(A ∩ B)′', '(A ∪ B)′']), d.nm); return osMcq(`Berdasarkan gambar rajah Venn, cari ${E}.`, osVenn({ L: 'L2', names: d.nm, els: osAtoms(d.U, d.S, d.nm) }), osSetOpts(E, d)); },
    () => { const c = osCounts(osRG, 2, 'L2', 1, 12), E = pick(['(A ∪ B)′', '(A ∩ B)′', 'A′', 'B′']), m = osMask(E, 'AB'), v = osAtomList(m, 2).reduce((s, a) => s + c[a], 0), cnt = {}; Object.keys(c).forEach(a => { cnt[a] = String(c[a]); }); return osMcq(`Cari <i>n</i>(${E}).`, osVenn({ L: 'L2', cnt }), osOpts(String(v), [0, 1, 2, 3].map(a => String(c[a])).concat([String(v + c[3]), String(Math.abs(v - c[0]))]), k => String(v + k + 1))); }
  ],
  lorek: [
    () => osLorekMcq(['A ∩ B', 'A ∪ B', 'A′', 'B′', '(A ∩ B)′', '(A ∪ B)′'], 'L2', 'AB'),
    () => osLorekMcq(OSP.i2.concat(OSP.u2), 'L2', 'AB'),
    () => osLorekMcq(OSP.g3.concat(OSP.g3c, ['A ∩ B ∩ C', 'A ∪ B ∪ C']), 'L3', 'ABC')
  ],
  bilangan: [
    () => { const c = osCounts(osRG, 2, 'L2', 1, 12), E = pick(['A', 'B', 'A ∩ B', 'A ∪ B']), v = osAtomList(osMask(E, 'AB'), 2).reduce((s, a) => s + c[a], 0), cnt = {}; Object.keys(c).forEach(a => { cnt[a] = String(c[a]); }); return osMcq(`Cari <i>n</i>(${E}).`, osVenn({ L: 'L2', cnt }), osOpts(String(v), [String(c[1]), String(c[2]), String(c[3]), String(c[1] + c[2]), String(v + c[0])], k => String(v + k + 1))); },
    () => { const c = osCounts(osRG, 3, 'L3', 1, 9), E = pick(OSP.g3.concat(['A ∩ B', 'B ∪ C', 'A ∩ B ∩ C′'])), at = osAtomList(osMask(E, 'ABC'), 3), v = at.reduce((s, a) => s + c[a], 0), cnt = {}; Object.keys(c).forEach(a => { cnt[a] = String(c[a]); }); return osMcq(`Cari <i>n</i>(${E}).`, osVenn({ L: 'L3', cnt }), osOpts(String(v), [String(v - c[at[0]]), String(v + c[0]), String(v + c[7]), String(v - 1)], k => String(v + k + 2))); },
    () => { const X = osXData(osRG, 2, 'L2'), cnt = {}; Object.keys(X.lab).forEach(a => { cnt[a] = X.lab[a]; }); return osMcq(`Diberi <i>n</i>(ξ) = ${X.tot}. Cari nilai <i>x</i>.`, osVenn({ L: 'L2', cnt }), osOpts(String(X.x), [String(X.x + 1), String(X.x - 1), String(X.x * 2), String(X.tot - X.con)], k => String(X.x + k + 2))); }
  ]
};
// pilih ungkapan yang mewakili rantau berlorek (4 pilihan dengan rantau berbeza)
function osLorekMcq(pool, L, nm) {
  const n = nm.length, all = shuffle(pool), E = all[0], m = osMask(E, nm), seen = new Set([m]), w = [];
  for (const x of all.concat(pool.map(osSwap))) { const mx = osMask(x, nm); if (!seen.has(mx)) { seen.add(mx); w.push(x); } if (w.length === 3) break; }
  const opts = shuffle([E, ...w]);
  return { type: 'mcq', q: 'Rantau berlorek mewakili set…', fig: osVenn({ L, names: nm, mask: m, label: 'Gambar rajah Venn dengan rantau berlorek' }), opts, c: opts.indexOf(E) };
}
const CQT = { irisan: 'Persilangan set', kesatuan: 'Kesatuan set', pelengkap: 'Pelengkap set', lorek: 'Rantau berlorek', bilangan: 'Bilangan unsur' };
function osCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.irisan;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['irisan', 'kesatuan', 'pelengkap', 'lorek', 'bilangan'] : Object.keys(CQT);
  return osCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return osCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
