'use strict';
/* =================== GARIS LURUS · SOALAN BAB 9 GARIS LURUS (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "gl" / "GL" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor nisbah [pengangka, penyebut] =================== */
const glGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const glQ = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = glGcd(n, d) || 1; n /= g; d /= g; return [n === 0 ? 0 : n, d]; };
const glR = x => (Array.isArray(x) ? glQ(x[0], x[1]) : glQ(x, 1));          // nombor atau [n,d] -> [n,d] termudah
const glAdd = (a, b) => { a = glR(a); b = glR(b); return glQ(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); };
const glSub = (a, b) => { b = glR(b); return glAdd(a, [-b[0], b[1]]); };
const glMul = (a, b) => { a = glR(a); b = glR(b); return glQ(a[0] * b[0], a[1] * b[1]); };
const glDiv = (a, b) => { a = glR(a); b = glR(b); return glQ(a[0] * b[1], a[1] * b[0]); };
const glNeg = a => { a = glR(a); return glQ(-a[0], a[1]); };
const glAbs = a => { a = glR(a); return [Math.abs(a[0]), a[1]]; };
const glIsInt = a => glR(a)[1] === 1;
const glSama = (a, b) => { a = glR(a); b = glR(b); return a[0] === b[0] && a[1] === b[1]; };
const glV = a => { a = glR(a); return a[0] / a[1]; };
// paparan: pecahan bertingkat kecil (sup/sub), tanda tolak sebenar (−)
const glS = a => { a = glR(a); if (a[1] === 1) return fmt(a[0]); return (a[0] < 0 ? '−' : '') + `<sup>${Math.abs(a[0])}</sup>⁄<sub>${a[1]}</sub>`; };
const glT = a => { a = glR(a); return a[1] === 1 ? fmt(a[0]) : (a[0] < 0 ? '−' : '') + Math.abs(a[0]) + '/' + a[1]; };   // teks biasa (rajah SVG)
const glPr = a => (glV(a) < 0 ? `(${glS(a)})` : glS(a));
const glPt = (x, y) => `(${glS(x)}, ${glS(y)})`;
const glNum = x => String(Math.round(x * 1000) / 1000).replace('-', '−');
// sebutan pemboleh ubah: pekali 1 / −1 / integer / pecahan
const glCo = (q, v = 'x') => { q = glR(q); if (q[0] === 1 && q[1] === 1) return v; if (q[0] === -1 && q[1] === 1) return '−' + v; return glS(q) + v; };
const glK = (q, lead) => { q = glR(q); if (q[0] === 0) return lead ? '0' : ''; return lead ? glS(q) : (q[0] < 0 ? ' − ' : ' + ') + glS(glAbs(q)); };
const glRhs = (m, c, v = 'x') => (glV(m) === 0 ? glK(c, true) : glCo(m, v) + glK(c));
const glEq = (m, c, y = 'y', x = 'x') => `${y} = ${glRhs(m, c, x)}`;
// ax + by = c (integer)
function glAm(a, b, c, x = 'x', y = 'y') {
  let s = a ? glCo(a, x) : '';
  if (b) s = s ? s + (b < 0 ? ' − ' : ' + ') + glCo(Math.abs(b), y) : glCo(b, y);
  return `${s} = ${fmt(c)}`;
}
// bentuk pintasan x/a + y/b = 1
const glFv = (v, a) => `<sup>${v}</sup>⁄<sub>${typeof a === 'number' ? fmt(a) : a}</sub>`;
const glPin = (a, b) => `${glFv('x', a)} ${b < 0 ? '−' : '+'} ${glFv('y', Math.abs(b))} = 1`;
// bentuk am integer (a > 0, atau b > 0 jika a = 0) bagi y = mx + c
function glAmOf(m, c) {
  m = glR(m); c = glR(c);
  const L = m[1] * c[1] / glGcd(m[1], c[1]);
  let a = -m[0] * (L / m[1]), b = L, k = c[0] * (L / c[1]);
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; k = -k; }
  const g = glGcd(glGcd(a, b), k) || 1;
  return [a / g, b / g, k / g === 0 ? 0 : k / g];
}
// rawak: glRG untuk Latihan Kelas / games, glRW (berbenih) untuk Lembaran Kerja
const glRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const glRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const glShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* =================== data bersama =================== */
const GLMF = [[1, 2], [-1, 2], [2, 3], [-2, 3], [3, 2], [-3, 2], [1, 3], [-1, 3], [3, 4], [-3, 4], [1, 4], [-1, 4], [5, 2], [-5, 2], [4, 3], [-4, 3]];
const GLH2 = [['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S'], ['C', 'D'], ['E', 'F'], ['K', 'L'], ['G', 'H']];
const GLL1 = ['AB', 'PQ', 'MN', 'RS', 'CD', 'EF', 'KL', 'GH'];
const GLT = ['T', 'P', 'K', 'R', 'M'];
const glM = (r, pf = .3) => (r.f() < pf ? r.p(GLMF) : [r.n(-5, 5), 1]);      // kecerunan rawak
const glMi = (r, a = 4) => [r.n(-a, a), 1];                                  // kecerunan integer

/* =================== rajah =================== */
function glBox(xs, ys) {
  let x0 = Math.min(0, ...xs) - 1, x1 = Math.max(0, ...xs) + 1, y0 = Math.min(0, ...ys) - 1, y1 = Math.max(0, ...ys) + 1;
  while (x1 - x0 < 8) { x0--; if (x1 - x0 < 8) x1++; }
  while (y1 - y0 < 6) { y0--; if (y1 - y0 < 6) y1++; }
  return { x0, x1, y0, y1 };
}
function glClip(p, q, b) {
  const dx = q[0] - p[0], dy = q[1] - p[1]; let t0 = -Infinity, t1 = Infinity;
  const lim = (d, s, lo, hi) => { if (d === 0) return; let a = (lo - s) / d, c = (hi - s) / d; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); };
  lim(dx, p[0], b.x0, b.x1); lim(dy, p[1], b.y0, b.y1);
  return [[+(p[0] + t0 * dx).toFixed(3), +(p[1] + t0 * dy).toFixed(3)], [+(p[0] + t1 * dx).toFixed(3), +(p[1] + t1 * dy).toFixed(3)]];
}
// dua titik pada garis y = mx + c (untuk dilukis)
const glTwo = (m, c) => { m = glR(m); const c0 = glV(c); return [[0, c0], [m[1], c0 + m[0]]]; };
function glPlane(o) {
  const xs = [], ys = [];
  (o.pts || []).forEach(p => { xs.push(p.x); ys.push(p.y); });
  const b = o.box || glBox(xs.length ? xs : [0], ys.length ? ys : [0]), items = [];
  (o.lines || []).forEach(l => { const [p, q] = l.seg ? [l.a, l.b] : glClip(l.a, l.b, b); items.push({ t: 'line', a: p, b: q, c: l.c || 'am', w: l.w || 4, dash: l.dash }); });
  (o.texts || []).forEach(t => items.push(Object.assign({ t: 'text' }, t)));
  (o.pts || []).forEach(p => {
    const right = p.x > (b.x0 + b.x1) / 2, top = p.y >= b.y1 - .6;
    items.push({ t: 'pt', x: p.x, y: p.y, c: p.c || 'tx', l: p.l, dx: right ? -12 : 12, dy: top ? 28 : -12, anchor: right ? 'end' : 'start' });
  });
  return plot(Object.assign({}, b, { items, label: o.label || 'Satah Cartes' }));
}
const glLegs = (x1, y1, x2, y2) => ({
  lines: [{ a: [x1, y1], b: [x2, y1], c: 'pk', w: 3, dash: true, seg: true }, { a: [x2, y1], b: [x2, y2], c: 'tr', w: 3, dash: true, seg: true }],
  texts: [{ x: (x1 + x2) / 2, y: y1 + (y2 > y1 ? -.45 : .3), s: fmt(x2 - x1), c: 'pk', size: 17 }, { x: x2 + (x2 > x1 ? .5 : -.5), y: (y1 + y2) / 2, s: fmt(y2 - y1), c: 'tr', size: 17 }]
});
// label garis di hujung yang dipotong (teks biasa)
function glLineLab(m, c, s, col, b) {
  const [p, q] = glTwo(m, c), [, e] = glClip(p, q, b), [s0] = glClip(p, q, b);
  const end = e[1] > s0[1] ? e : s0, x = Math.max(b.x0 + 1.2, Math.min(b.x1 - 1.2, end[0])), y = Math.max(b.y0 + .6, Math.min(b.y1 - .4, end[1] - .45));
  return { x, y, s, c: col, size: 17 };
}
// rajah games (gSvg teras, R = 6)
const GLR = 6, GLGB = { x0: -GLR, x1: GLR, y0: -GLR, y1: GLR };
const glGLine = (m, c, col, w = .13) => { const [p, q] = glClip(...glTwo(m, c), GLGB); return gLine(p, q, col, w); };
const glGFig = (pts, lines, label) => gSvg(GLR, (lines || []).map(([m, c, col]) => glGLine(m, c, col || 'am')).join('') + (pts || []).map(([x, y, c, l]) => gPt(x, y, c, l)).join(''), label || 'Satah Cartes');

/* =================== jalan kerja bersama =================== */
// tukar ax + by = c kepada y = mx + c
function glWAm(a, b, c) {
  const m = glQ(-a, b), k = glQ(c, b), w = [];
  w.push(`${glCo(b, 'y')} = ${glRhs(-a, c)}`);
  if (b !== 1) w.push(`Bahagi setiap sebutan dengan ${glPr(b)}: ${glEq(m, k)}`);
  return { m, c: k, w };
}
// cari c daripada m dan titik
const glWc = (m, x, y) => { const c = glSub(y, glMul(m, x)); return { c, w: [`Gantikan ${glPt(x, y)} ke dalam y = ${glCo(m)} + c: ${glS(y)} = ${glS(m)}(${glS(x)}) + c`.replace(/= (−?)1\(/, '= $1('), `c = ${glS(y)} − ${glPr(glMul(m, x))} = ${glS(c)}`] }; };
const glW2 = (x1, y1, x2, y2) => { const m = glQ(y2 - y1, x2 - x1); return { m, w: [`m = (${fmt(y2)} − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ${fmt(y2 - y1)}/${par(x2 - x1)} = ${glS(m)}`] }; };

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 9.1.1 Persamaan y = mx + c ---------- */
  mcBaca: [
    ({ E }) => ({ q: `Nyatakan kecerunan dan pintasan-y bagi garis lurus ${E}.` }),
    ({ E, L }) => ({ q: `Garis lurus ${L} mempunyai persamaan ${E}. Apakah kecerunan dan pintasan-y garis lurus itu?` }),
    ({ E }) => ({ q: `Bagi garis lurus ${E}, tulis nilai m dan nilai c.` }),
    ({ E, ms, cs, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata garis lurus ${E} mempunyai kecerunan ${cs} dan pintasan-y ${ms}. Adakah ${N} betul?` }, salah(N, ans, `${N} tertukar m dengan c. Kecerunan ialah pekali x, manakala pintasan-y ialah pemalar.`)); },
    ({ E }) => ({ q: `Lengkapkan: Bagi garis lurus ${E}, kecerunan = ___ dan pintasan-y = ___` })
  ],
  mcTulis: [
    ({ ms, cs }) => ({ q: `Tulis persamaan garis lurus yang mempunyai kecerunan ${ms} dan pintasan-y ${cs}.` }),
    ({ ms, cs }) => ({ q: `Sebuah garis lurus memotong paksi-y pada titik (0, ${cs}) dan kecerunannya ialah ${ms}. Tulis persamaan garis lurus itu.` }),
    ({ ms, cs, L }) => ({ q: `Garis lurus ${L} mempunyai pintasan-y ${cs} dan kecerunan ${ms}. Nyatakan persamaan ${L} dalam bentuk y = mx + c.` }),
    ({ ms, cs, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis persamaan garis lurus yang berkecerunan ${ms} dan mempunyai pintasan-y ${cs} sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Dalam y = mx + c, kecerunan m ialah pekali x dan pintasan-y c ialah pemalar.`)); }
  ],
  mcMendatar: [
    ({ pt, ax }) => ({ q: `Tulis persamaan garis lurus yang melalui titik ${pt} dan selari dengan paksi-${ax}.` }),
    ({ pt, L, jenis }) => ({ q: `Garis lurus ${L} adalah ${jenis} dan melalui titik ${pt}. Nyatakan persamaan ${L}.` }),
    ({ pt, pt2, L }) => ({ q: `Garis lurus ${L} melalui titik ${pt} dan ${pt2}. Tulis persamaan ${L}.` }),
    ({ E2, ansM, wM }) => ({ q: `Nyatakan kecerunan garis lurus ${E2}.`, ans: ansM, work: wM })
  ],
  mcSusun: [
    ({ G }) => ({ q: `Nyatakan kecerunan dan pintasan-y bagi garis lurus ${G}.` }),
    ({ G, E, ans }) => ({ q: `Tulis ${G} dalam bentuk y = mx + c. Seterusnya, nyatakan nilai m dan nilai c.`, ans: `${E}; ${ans}` }),
    ({ G, L }) => ({ q: `Garis lurus ${L} mempunyai persamaan ${G}. Cari kecerunan dan pintasan-y ${L}.` }),
    ({ G, claim, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${claim} bagi garis lurus ${G}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  mcRajah: [
    ({ L }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${L} pada satah Cartes. Tulis persamaan ${L} dalam bentuk y = mx + c.` }),
    ({ cs, ms, E }) => ({ q: 'Berdasarkan rajah di bawah, nyatakan pintasan-y dan hitung kecerunan garis lurus itu. Seterusnya, tulis persamaannya.', ans: `c = ${cs}, m = ${ms}; ${E}` }),
    () => ({ q: 'Garis lurus dalam rajah di bawah melalui dua titik yang ditandakan. Apakah persamaan garis lurus itu?' }),
    () => ({ q: 'Sebatang laluan basikal yang lurus dilukis pada peta bergrid seperti dalam rajah di bawah. Tentukan persamaan laluan itu.' })
  ],
  k111: [
    ({ a }) => ({ q: `Garis lurus y = (k + ${a.a})x + ${a.k2 ? '2k' : 'k'} mempunyai kecerunan ${fmt(a.m)}. (a) Cari nilai k. (b) Tulis persamaan garis lurus itu. (c) Cari pintasan-x garis lurus itu.`, ans: `(a) k = ${fmt(a.k)} (b) ${a.E} (c) ${glS(a.xi)}`, work: [`(a) Kecerunan ialah pekali x: k + ${a.a} = ${fmt(a.m)}, maka k = ${fmt(a.k)}`, `(b) Pintasan-y = ${a.k2 ? `2k = 2(${fmt(a.k)}) = ${fmt(a.c)}` : `k = ${fmt(a.c)}`}, maka ${a.E}`, `(c) Pintasan-x: gantikan y = 0 → 0 = ${glRhs(a.m, a.c)} → x = ${glS(a.xi)}`] }),
    ({ b }) => ({ q: `Garis lurus PQ melalui P(0, ${fmt(b.c)}) dan Q${P(b.x2, b.y2)}. (a) Tulis persamaan PQ. (b) Cari pintasan-x PQ. (c) Tentukan sama ada titik R${P(b.rx, b.ry)} terletak pada PQ.`, ans: `(a) ${b.E} (b) ${glS(b.xi)} (c) ${b.on ? 'Ya' : 'Tidak'}`, work: [`(a) c = ${fmt(b.c)} (titik P pada paksi-y); m = (${fmt(b.y2)} − ${par(b.c)}) / ${par(b.x2)} = ${glS(b.m)}, maka ${b.E}`, `(b) 0 = ${glRhs(b.m, b.c)} → x = ${glS(b.xi)}`, `(c) Apabila x = ${fmt(b.rx)}, y = ${glS(b.yr)} ${b.on ? '=' : '≠'} ${fmt(b.ry)}, maka R ${b.on ? '' : 'tidak '}terletak pada PQ.`] }),
    ({ c }) => ({ q: `Sebuah garis lurus mempunyai pintasan-x ${fmt(c.xi)} dan pintasan-y ${fmt(c.yi)}. (a) Cari kecerunan garis lurus itu. (b) Tulis persamaannya dalam bentuk y = mx + c. (c) Cari nilai y apabila x = ${fmt(c.x3)}.`, ans: `(a) ${glS(c.m)} (b) ${c.E} (c) ${glS(c.y3)}`, work: [`(a) m = −(pintasan-y) / (pintasan-x) = −(${fmt(c.yi)}) / ${par(c.xi)} = ${glS(c.m)}`, `(b) c = pintasan-y = ${fmt(c.yi)}, maka ${c.E}`, `(c) y = ${glS(c.m)}(${fmt(c.x3)})${glK(c.yi)} = ${glS(c.y3)}`] })
  ],

  /* ---------- 9.1.2 Bentuk lain persamaan ---------- */
  amKeMxc: [
    ({ G }) => ({ q: `Tukar persamaan garis lurus ${G} kepada bentuk y = mx + c. Seterusnya, nyatakan kecerunan dan pintasan-y.` }),
    ({ G, mc }) => ({ q: `Cari kecerunan dan pintasan-y bagi garis lurus ${G}.`, ans: mc }),
    ({ G, wm, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata kecerunan garis lurus ${G} ialah ${wm}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa tanda negatif. Bagi ax + by = c, kecerunan m = −a/b.`)); },
    ({ G, L, E }) => ({ q: `Garis lurus ${L} diwakili oleh persamaan ${G}. Tulis persamaan ${L} dalam bentuk kecerunan-pintasan, y = mx + c.`, ans: E })
  ],
  pinBentuk: [
    ({ G, a, b }) => ({ q: `Nyatakan pintasan-x dan pintasan-y bagi garis lurus ${G}.`, ans: `Pintasan-x = ${fmt(a)}, pintasan-y = ${fmt(b)}` }),
    ({ G, a, b }) => ({ q: `Garis lurus ${G} memotong paksi-x di titik A dan paksi-y di titik B. Nyatakan koordinat A dan B.`, ans: `A${P(a, 0)}, B${P(0, b)}` }),
    ({ G, a, b, m }) => ({ q: `Cari kecerunan garis lurus ${G}.`, ans: `m = ${glS(m)}`, work: [`Pintasan-x = ${fmt(a)}, pintasan-y = ${fmt(b)}`, `m = −(pintasan-y) / (pintasan-x) = −(${fmt(b)}) / ${par(a)} = ${glS(m)}`] }),
    ({ G, a, b, m, E }) => ({ q: `Tulis persamaan garis lurus ${G} dalam bentuk y = mx + c.`, ans: E, work: [`Pintasan-x = ${fmt(a)}, pintasan-y = ${fmt(b)}, maka c = ${fmt(b)}`, `m = −(${fmt(b)}) / ${par(a)} = ${glS(m)}`, E] })
  ],
  amPintasan: [
    ({ G }) => ({ q: `Cari pintasan-x dan pintasan-y bagi garis lurus ${G}.` }),
    ({ G, xi, yi }) => ({ q: `Garis lurus ${G} menyilang paksi-x dan paksi-y. Cari koordinat titik-titik persilangan itu.`, ans: `${P(xi, 0)} dan ${P(0, yi)}` }),
    ({ G, xi, yi }) => ({ q: `Lengkapkan: Bagi garis lurus ${G}, apabila y = 0, x = ___; apabila x = 0, y = ___`, ans: `x = ${fmt(xi)}; y = ${fmt(yi)}` })
  ],
  keBentukAm: [
    ({ E }) => ({ q: `Tulis persamaan ${E} dalam bentuk ax + by = c, dengan a, b dan c ialah integer dan a > 0.` }),
    ({ E }) => ({ q: `Ungkapkan garis lurus ${E} dalam bentuk am, ax + by = c, dengan a > 0 dan a, b, c integer.` }),
    ({ E }) => ({ q: `Lengkapkan dengan integer (pekali x positif): ${E} boleh ditulis sebagai ___x + ___y = ___` })
  ],
  keBentukPin: [
    ({ G }) => ({ q: `Tulis persamaan garis lurus ${G} dalam bentuk ${glFv('x', 'a')} + ${glFv('y', 'b')} = 1.` }),
    ({ G, ans, xi, yi }) => ({ q: `Ungkapkan garis lurus ${G} dalam bentuk pintasan. Seterusnya, nyatakan pintasan-x dan pintasan-y.`, ans: `${ans}; pintasan-x = ${fmt(xi)}, pintasan-y = ${fmt(yi)}` }),
    ({ E }) => ({ q: `Tulis persamaan garis lurus ${E} dalam bentuk ${glFv('x', 'a')} + ${glFv('y', 'b')} = 1.` })
  ],
  k112: [
    ({ a }) => ({ q: `Garis lurus hx + ${a.b === 1 ? '' : a.b}y = ${fmt(a.c)} mempunyai kecerunan ${fmt(a.m)}. Cari (a) nilai h, (b) pintasan-x garis lurus itu, (c) pintasan-y garis lurus itu.`, ans: `(a) h = ${fmt(a.h)} (b) ${glS(a.xi)} (c) ${glS(a.yi)}`, work: [`(a) Kecerunan = −h/${a.b} = ${fmt(a.m)}, maka h = ${fmt(a.h)}`, `(b) Gantikan y = 0: ${fmt(a.h)}x = ${fmt(a.c)} → x = ${glS(a.xi)}`, `(c) Gantikan x = 0: ${a.b}y = ${fmt(a.c)} → y = ${glS(a.yi)}`] }),
    ({ b }) => ({ q: `Garis lurus ${glFv('x', 'a')} + ${glFv('y', b.b)} = 1 melalui titik ${P(b.x0, b.y0)}. Cari nilai a dan kecerunan garis lurus itu.`, ans: `a = ${fmt(b.a)}, m = ${glS(b.m)}`, work: [`Gantikan ${P(b.x0, b.y0)}: ${glFv(fmt(b.x0), 'a')} + ${glFv(fmt(b.y0), b.b)} = 1`, `${glFv(fmt(b.x0), 'a')} = 1 − ${glPr(glQ(b.y0, b.b))} = ${glS(b.t)}`, `a = ${fmt(b.a)}`, `m = −(${fmt(b.b)}) / ${par(b.a)} = ${glS(b.m)}`] }),
    ({ c }) => ({ q: `Garis lurus ${c.a === 1 ? '' : c.a}x + ky = ${c.c} mempunyai pintasan-y ${fmt(c.yi)}. Cari (a) nilai k, (b) kecerunan garis lurus itu, (c) pintasan-x.`, ans: `(a) k = ${fmt(c.k)} (b) ${glS(c.m)} (c) ${glS(c.xi)}`, work: [`(a) Pintasan-y ${fmt(c.yi)}: gantikan (0, ${fmt(c.yi)}) → k(${fmt(c.yi)}) = ${c.c}, maka k = ${fmt(c.k)}`, `(b) m = −a/b = −${c.a}/${par(c.k)} = ${glS(c.m)}`, `(c) Gantikan y = 0: ${c.a === 1 ? '' : c.a}x = ${c.c} → x = ${glS(c.xi)}`] })
  ],

  /* ---------- 9.1.3 Titik pada garis lurus ---------- */
  semakTitik: [
    ({ pt, G }) => ({ q: `Tentukan sama ada titik ${pt} terletak pada garis lurus ${G}.` }),
    ({ pt, G, L }) => ({ q: `Adakah titik ${L}${pt} terletak pada garis lurus ${G}? Tunjukkan pengiraan anda.` }),
    ({ G, A, B, pA, pB, onN, w2 }) => ({ q: `Antara titik ${A}${pA} dan ${B}${pB}, titik manakah terletak pada garis lurus ${G}?`, ans: `Titik ${onN}`, work: w2 }),
    ({ pt, G, on, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata titik ${pt} ${on ? 'tidak terletak' : 'terletak'} pada garis lurus ${G}. Adakah ${N} betul?` }, salah(N, ans, 'Gantikan kedua-dua koordinat ke dalam persamaan dan bandingkan kedua-dua belah.')); }
  ],
  cariKoord: [
    ({ pt, G, v }) => ({ q: `Titik ${pt} terletak pada garis lurus ${G}. Cari nilai ${v}.` }),
    ({ pt, G, v }) => ({ q: `Garis lurus ${G} melalui titik ${pt}. Cari nilai ${v}.` }),
    ({ pt, G, v }) => ({ q: `Lengkapkan: Titik ${pt} terletak pada garis lurus ${G}, maka ${v} = ___` }),
    ({ pt, G, v }) => ({ q: `Seekor semut merayap di sepanjang garis lurus ${G} pada satah Cartes. Semut itu sampai di titik ${pt}. Cari nilai ${v}.` })
  ],
  cariKoordAm: [
    ({ pt, G, v }) => ({ q: `Titik ${pt} terletak pada garis lurus ${G}. Hitung nilai ${v}.` }),
    ({ pt, G, v }) => ({ q: `Diberi garis lurus ${G} melalui titik ${pt}, cari nilai ${v}.` }),
    ({ pt, G, v, L }) => ({ q: `Titik ${L}${pt} berada pada garis lurus ${G}. Apakah nilai ${v}?` })
  ],
  cariPemalar: [
    ({ pt, G, v }) => ({ q: `Garis lurus ${G} melalui titik ${pt}. Cari nilai ${v}.` }),
    ({ pt, G, v }) => ({ q: `Diberi titik ${pt} terletak pada garis lurus ${G}, hitung nilai ${v}.` }),
    ({ pt, G, v, ans, E }) => ({ q: `Titik ${pt} terletak pada garis lurus ${G}. Cari nilai ${v}, seterusnya tulis persamaan garis lurus itu.`, ans: `${ans}; ${E}` }),
    ({ pt, G, v, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati ${v} = ${wrong} supaya garis lurus ${G} melalui titik ${pt}. Adakah ${N} betul?` }, salah(N, ans, 'Gantikan koordinat titik itu dengan teliti, termasuk tanda negatif.')); }
  ],
  k113: [
    ({ a }) => ({ q: `Titik P(h, 2h) terletak pada garis lurus ${a.E}. Cari nilai h dan nyatakan koordinat P.`, ans: `h = ${fmt(a.h)}, P${P(a.h, 2 * a.h)}`, work: [`Gantikan x = h, y = 2h: 2h = ${glCo(a.m, 'h')}${glK(a.c)}`, `${glCo(2 - a.m, 'h')} = ${fmt(a.c)}`, `h = ${fmt(a.h)}, maka P${P(a.h, 2 * a.h)}`] }),
    ({ b }) => ({ q: `Garis lurus y = px + q melalui titik ${P(b.x1, b.y1)} dan ${P(b.x2, b.y2)}. Cari nilai p dan nilai q.`, ans: `p = ${fmt(b.p)}, q = ${fmt(b.q)}`, work: [`${fmt(b.y1)} = ${glCo(b.x1, 'p')} + q … (1)`, `${fmt(b.y2)} = ${glCo(b.x2, 'p')} + q … (2)`, `(2) − (1): ${fmt(b.y2 - b.y1)} = ${glCo(b.x2 - b.x1, 'p')}, maka p = ${fmt(b.p)}`, `q = ${fmt(b.y1)} − ${par(b.p * b.x1)} = ${fmt(b.q)}`] }),
    ({ c }) => ({ q: `Garis lurus y = ${glCo(c.m)} + c melalui titik A${P(c.x1, c.y1)}. (a) Cari nilai c. (b) Titik B(${fmt(c.x2)}, k) terletak pada garis lurus itu. Cari nilai k. (c) Tentukan sama ada titik C${P(c.x3, c.y3)} terletak pada garis lurus itu.`, ans: `(a) c = ${fmt(c.c)} (b) k = ${fmt(c.k)} (c) ${c.on ? 'Ya' : 'Tidak'}`, work: [`(a) ${fmt(c.y1)} = ${fmt(c.m)}(${fmt(c.x1)}) + c → c = ${fmt(c.c)}`, `(b) k = ${fmt(c.m)}(${fmt(c.x2)})${glK(c.c)} = ${fmt(c.k)}`, `(c) ${fmt(c.m)}(${fmt(c.x3)})${glK(c.c)} = ${fmt(c.m * c.x3 + c.c)} ${c.on ? '=' : '≠'} ${fmt(c.y3)}`] })
  ],

  /* ---------- 9.1.4 Garis selari ---------- */
  selariYT: [
    ({ G1, G2 }) => ({ q: `Tentukan sama ada garis lurus ${G1} dan garis lurus ${G2} adalah selari.` }),
    ({ G1, G2, L1, L2 }) => ({ q: `Adakah garis lurus ${L1}: ${G1} selari dengan garis lurus ${L2}: ${G2}? Beri sebab.` }),
    ({ G1, G2, par: pr, ms }) => ({ q: `Garis lurus ${G1} dan ${G2} dilukis pada satah Cartes yang sama. Adakah kedua-dua garis itu akan bersilang?`, ans: pr ? `Tidak, kerana kedua-dua garis selari (m = ${ms[0]})` : `Ya, kerana kecerunannya berbeza (${ms[0]} dan ${ms[1]})` }),
    ({ G1, G2, par: pr, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata garis lurus ${G1} dan ${G2} ${pr ? 'tidak selari' : 'selari'}. Adakah ${N} betul?` }, salah(N, ans, 'Bandingkan kecerunan kedua-dua garis selepas menukarnya kepada bentuk y = mx + c.')); }
  ],
  kecSelari: [
    ({ G }) => ({ q: `Garis lurus PQ selari dengan garis lurus ${G}. Nyatakan kecerunan PQ.` }),
    ({ G }) => ({ q: `Sebatang jalan lurus dilukis selari dengan garis ${G} pada satah Cartes. Apakah kecerunan jalan itu?` }),
    ({ G, L, c2, E2 }) => ({ q: `Garis lurus ${L} selari dengan garis lurus ${G} dan mempunyai pintasan-y ${fmt(c2)}. Tulis persamaan ${L}.`, ans: E2 }),
    ({ G }) => ({ q: `Lengkapkan: Garis lurus yang selari dengan ${G} mempunyai kecerunan ___` })
  ],
  cariKSelari: [
    ({ G1, G2 }) => ({ q: `Garis lurus ${G1} selari dengan ${G2}. Cari nilai k.` }),
    ({ G1, G2 }) => ({ q: `Diberi garis lurus ${G1} dan ${G2} adalah selari, hitung nilai k.` }),
    ({ G1, G2 }) => ({ q: `Garis lurus ${G1} tidak bersilang dengan ${G2} walaupun dipanjangkan. Cari nilai k.` }),
    ({ G1, G2, ans, yi }) => ({ q: `Garis lurus ${G1} selari dengan ${G2}. Cari nilai k, seterusnya nyatakan pintasan-y garis lurus ${G1}.`, ans: `${ans}; pintasan-y = ${yi}` })
  ],
  persSelari: [
    ({ G, pt }) => ({ q: `Cari persamaan garis lurus yang selari dengan ${G} dan melalui titik ${pt}.` }),
    ({ G, pt, L }) => ({ q: `Garis lurus ${L} melalui titik ${pt} dan selari dengan garis lurus ${G}. Tulis persamaan ${L}.` }),
    ({ G, pt }) => ({ q: `Sebatang paip lurus dipasang selari dengan garis ${G} dan melalui titik ${pt} pada pelan bergrid. Tentukan persamaan paip itu.` }),
    ({ G, pt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis persamaan garis lurus yang selari dengan ${G} dan melalui ${pt} sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Semak tanda semasa memindahkan sebutan untuk mencari c.')); }
  ],
  k114: [
    ({ a }) => ({ q: `PQRS ialah sebuah segi empat selari dengan P${P(...a.P)}, Q${P(...a.Q)} dan R${P(...a.R)}. (a) Cari kecerunan PQ. (b) Cari persamaan garis lurus SR. (c) Cari pintasan-y garis lurus SR.`, ans: `(a) ${glS(a.m)} (b) ${a.E} (c) ${glS(a.c)}`, work: [`(a) m<sub>PQ</sub> = (${fmt(a.Q[1])} − ${par(a.P[1])}) / (${fmt(a.Q[0])} − ${par(a.P[0])}) = ${glS(a.m)}`, `(b) SR selari dengan PQ, maka m = ${glS(a.m)}. Gantikan R${P(...a.R)}: ${fmt(a.R[1])} = ${glS(a.m)}(${fmt(a.R[0])}) + c → c = ${glS(a.c)}`, `${a.E}`, `(c) Pintasan-y = ${glS(a.c)}`] }),
    ({ b }) => ({ q: `Garis lurus 2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} selari dengan garis lurus yang melalui A${P(b.x1, b.y1)} dan B${P(b.x2, b.y2)}. (a) Cari nilai h. (b) Cari pintasan-x garis lurus 2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)}.`, ans: `(a) h = ${fmt(b.h)} (b) ${glS(b.xi)}`, work: [`m<sub>AB</sub> = (${fmt(b.y2)} − ${par(b.y1)}) / (${fmt(b.x2)} − ${par(b.x1)}) = ${fmt(b.m)}`, `2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} → y = ${glFv('h', 2)}x ${glK(glQ(b.c, 2)).trim()}, maka h/2 = ${fmt(b.m)} → h = ${fmt(b.h)}`, `(b) 0 = ${fmt(b.h)}x ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} → x = ${glS(b.xi)}`] }),
    ({ c }) => ({ q: `Garis lurus ${c.L} selari dengan garis lurus ${c.G} dan melalui titik ${P(c.x0, c.y0)}. (a) Tulis persamaan ${c.L}. (b) Cari pintasan-x ${c.L}.`, ans: `(a) ${c.E} (b) ${glS(c.xi)}`, work: [`Kecerunan ${c.G}: m = −(${fmt(c.b)}) / ${par(c.a)} = ${glS(c.m)}`].concat(glWc(c.m, c.x0, c.y0).w, [`(a) ${c.E}`, `(b) 0 = ${glRhs(c.m, c.c)} → x = ${glS(c.xi)}`]) })
  ],

  /* ---------- 9.1.5 Persamaan garis lurus ---------- */
  persMTitik: [
    ({ ms, pt }) => ({ q: `Cari persamaan garis lurus yang mempunyai kecerunan ${ms} dan melalui titik ${pt}.` }),
    ({ ms, pt, L }) => ({ q: `Garis lurus ${L} melalui titik ${pt} dan kecerunannya ialah ${ms}. Tulis persamaan ${L}.` }),
    ({ ms, pt }) => ({ q: `Laluan sebuah kapal terbang mainan ialah satu garis lurus berkecerunan ${ms} yang melalui titik ${pt} pada satah Cartes. Tentukan persamaan laluan itu.` }),
    ({ ms, pt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati persamaan garis lurus yang berkecerunan ${ms} dan melalui ${pt} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} tersilap tanda semasa mencari c. Semak dengan menggantikan titik itu ke dalam jawapan.`)); }
  ],
  persDuaTitik: [
    ({ A, B, p1, p2 }) => ({ q: `Cari persamaan garis lurus yang melalui titik ${A}${p1} dan ${B}${p2}.` }),
    ({ A, B, p1, p2 }) => ({ q: `Garis lurus ${A}${B} melalui ${A}${p1} dan ${B}${p2}. Tulis persamaan ${A}${B} dalam bentuk y = mx + c.` }),
    ({ p1, p2 }) => ({ q: `Titik ${p1} dan ${p2} terletak pada satu garis lurus. Tentukan persamaan garis lurus itu.` }),
    ({ p1, p2 }) => ({ q: `Pada sebuah peta bergrid, sekolah terletak di ${p1} dan perpustakaan di ${p2}. Sebatang jalan lurus menghubungkan kedua-dua tempat itu. Cari persamaan jalan itu.` })
  ],
  persPintasan: [
    ({ xi, yi }) => ({ q: `Cari persamaan garis lurus yang mempunyai pintasan-x ${fmt(xi)} dan pintasan-y ${fmt(yi)}.` }),
    ({ xi, yi, L }) => ({ q: `Garis lurus ${L} memotong paksi-x pada ${P(xi, 0)} dan paksi-y pada ${P(0, yi)}. Tulis persamaan ${L} dalam bentuk y = mx + c.` }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah garis lurus yang memotong kedua-dua paksi. Tentukan persamaan garis lurus itu.' })
  ],
  persRajah: [
    ({ L }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${L}. Cari persamaan ${L}.` }),
    () => ({ q: 'Berdasarkan rajah di bawah, tentukan persamaan garis lurus yang melalui kedua-dua titik itu.' }),
    ({ L }) => ({ q: `Sebuah dron terbang di sepanjang garis lurus ${L} seperti dalam rajah di bawah. Tulis persamaan laluan dron itu.` })
  ],
  k115: [
    ({ a }) => ({ q: `Bucu-bucu sebuah segi tiga ialah A${P(...a.A)}, B${P(...a.B)} dan C${P(...a.C)}. (a) Cari kecerunan BC. (b) Cari persamaan garis lurus yang melalui A dan selari dengan BC. (c) Cari pintasan-x garis lurus itu.`, ans: `(a) ${glS(a.m)} (b) ${a.E} (c) ${glS(a.xi)}`, work: [`(a) m<sub>BC</sub> = (${fmt(a.C[1])} − ${par(a.B[1])}) / (${fmt(a.C[0])} − ${par(a.B[0])}) = ${glS(a.m)}`].concat(glWc(a.m, a.A[0], a.A[1]).w, [`(b) ${a.E}`, `(c) 0 = ${glRhs(a.m, a.c)} → x = ${glS(a.xi)}`]) }),
    ({ b }) => ({ q: `Garis lurus yang melalui P${P(b.x1, b.y1)} dan Q(${fmt(b.x2)}, k) mempunyai pintasan-y ${fmt(b.c)}. (a) Cari persamaan garis lurus itu. (b) Cari nilai k.`, ans: `(a) ${b.E} (b) k = ${fmt(b.k)}`, work: [`Garis melalui (0, ${fmt(b.c)}) dan P${P(b.x1, b.y1)}: m = (${fmt(b.y1)} − ${par(b.c)}) / ${par(b.x1)} = ${fmt(b.m)}`, `(a) ${b.E}`, `(b) k = ${fmt(b.m)}(${fmt(b.x2)})${glK(b.c)} = ${fmt(b.k)}`] }),
    ({ c }) => ({ q: `Sebuah garis lurus melalui titik ${P(c.x1, c.y1)} dan mempunyai pintasan-x ${fmt(c.a)}. (a) Cari kecerunan garis lurus itu. (b) Tulis persamaannya. (c) Nyatakan pintasan-y.`, ans: `(a) ${glS(c.m)} (b) ${c.E} (c) ${glS(c.c)}`, work: [`Pintasan-x ${fmt(c.a)}: garis melalui ${P(c.a, 0)}.`, `(a) m = (${fmt(c.y1)} − 0) / (${fmt(c.x1)} − ${par(c.a)}) = ${glS(c.m)}`].concat(glWc(c.m, c.a, 0).w, [`(b) ${c.E}`, `(c) Pintasan-y = ${glS(c.c)}`]) })
  ],

  /* ---------- 9.1.6 Titik persilangan ---------- */
  silangMudah: [
    ({ G1, G2 }) => ({ q: `Cari titik persilangan garis lurus ${G1} dan garis lurus ${G2}.` }),
    ({ G1, G2, T }) => ({ q: `Garis lurus ${G1} bersilang dengan garis lurus ${G2} di titik ${T}. Cari koordinat ${T}.` }),
    ({ G1, G2 }) => ({ q: `Tentukan koordinat titik di mana garis lurus ${G1} menyilang garis lurus ${G2}.` })
  ],
  silangGanti: [
    ({ G1, G2 }) => ({ q: `Cari titik persilangan bagi garis lurus ${G1} dan ${G2}.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Selesaikan persamaan serentak ${G1} dan ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2, T, L1, L2 }) => ({ q: `Garis lurus ${L1}: ${G1} dan garis lurus ${L2}: ${G2} bersilang di titik ${T}. Cari koordinat ${T}.` }),
    ({ G1, G2, wp, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati garis lurus ${G1} dan ${G2} bersilang di ${wp}. Adakah ${N} betul?` }, salah(N, ans, `Titik ${wp} tidak memuaskan kedua-dua persamaan.`)); }
  ],
  silangRajah: [
    ({ G1, G2 }) => ({ q: `Rajah di bawah menunjukkan graf garis lurus ${G1} dan ${G2}. Nyatakan koordinat titik persilangan kedua-dua garis itu.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Berdasarkan graf di bawah, selesaikan persamaan serentak ${G1} dan ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2 }) => ({ q: `Dua batang jalan lurus diwakili oleh garis lurus ${G1} dan ${G2} seperti dalam rajah di bawah. Pada titik manakah kedua-dua jalan itu bersilang? Semak jawapan anda secara algebra.` })
  ],
  silangHapus: [
    ({ G1, G2 }) => ({ q: `Cari titik persilangan garis lurus ${G1} dan ${G2}.` }),
    ({ G1, G2 }) => ({ q: `Dengan menggunakan kaedah penghapusan, cari titik persilangan garis lurus ${G1} dan ${G2}.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Selesaikan persamaan serentak berikut: ${G1} dan ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2, T }) => ({ q: `Garis lurus ${G1} dan ${G2} bersilang di titik ${T}. Cari koordinat ${T}.` })
  ],
  silangPaksi: [
    ({ G, ax, ptA }) => ({ q: `Cari koordinat titik persilangan garis lurus ${G} dengan paksi-${ax}.`, ans: ptA }),
    ({ G, ax, ptA, T }) => ({ q: `Garis lurus ${G} menyilang paksi-${ax} di titik ${T}. Nyatakan koordinat ${T}.`, ans: `${T}${ptA}` }),
    ({ S1, S2, sAns, sW }) => ({ q: `Tunjukkan bahawa garis lurus ${S1} dan ${S2} tidak bersilang.`, ans: sAns, work: sW })
  ],
  k116: [
    ({ a }) => ({ q: `Garis lurus ${a.G1} dan ${a.G2} bersilang di titik T. Kedua-dua garis itu memotong paksi-x di titik A dan B. (a) Cari koordinat T. (b) Cari koordinat A dan B. (c) Hitung luas segi tiga ATB.`, ans: `(a) T${P(a.x0, a.y0)} (b) A${P(a.a, 0)}, B${P(a.b, 0)} (c) ${glNum(a.luas)} unit²`, work: [`(a) ${glRhs(a.m1, a.c1)} = ${glRhs(a.m2, a.c2)} → x = ${fmt(a.x0)}, y = ${fmt(a.y0)}`, `(b) Gantikan y = 0 dalam setiap persamaan: x = ${fmt(a.a)} dan x = ${fmt(a.b)}`, `(c) Tapak AB = ${Math.abs(a.b - a.a)}, tinggi = ${Math.abs(a.y0)}`, `Luas = ½ × ${Math.abs(a.b - a.a)} × ${Math.abs(a.y0)} = ${glNum(a.luas)} unit²`] }),
    ({ b }) => ({ q: `Garis lurus ${b.G1}, ${b.G2} dan y = kx ${b.c3 < 0 ? '−' : '+'} ${Math.abs(b.c3)} bersilang pada satu titik yang sama. Cari nilai k.`, ans: `k = ${fmt(b.k)}`, work: [`Titik persilangan ${b.G1} dan ${b.G2}: ${glRhs(b.m1, b.c1)} = ${glRhs(b.m2, b.c2)} → x = ${fmt(b.x0)}, y = ${fmt(b.y0)}`, `Garis ketiga melalui ${P(b.x0, b.y0)}: ${fmt(b.y0)} = k(${fmt(b.x0)})${glK(b.c3)}`, `k = ${fmt(b.k)}`] }),
    ({ c }) => ({ q: `Cari persamaan garis lurus yang melalui titik persilangan garis ${c.G1} dan ${c.G2}, dan selari dengan garis lurus ${c.G3}.`, ans: c.E, work: [`Titik persilangan: ${glRhs(c.m1, c.c1)} = ${glRhs(c.m2, c.c2)} → ${P(c.x0, c.y0)}`, `Kecerunan ${c.G3} ialah ${glS(c.m3)}`].concat(glWc(c.m3, c.x0, c.y0).w, [c.E]) })
  ],

  /* ---------- 9.1.7 Penyelesaian masalah ---------- */
  tafsir: [
    ({ desc, X, Y }) => ({ q: `${desc} Nyatakan maksud kecerunan dan maksud pintasan-${Y} bagi graf ${Y} melawan ${X} dalam situasi ini.` }),
    ({ desc, ms, mm }) => ({ q: `${desc} Apakah yang diwakili oleh nilai ${ms} dalam persamaan itu?`, ans: `Kadar perubahan: ${mm}` }),
    ({ desc, cs, cm }) => ({ q: `${desc} Apakah yang diwakili oleh nilai ${cs} dalam persamaan itu?`, ans: `Nilai awal: ${cm}` }),
    ({ desc, cs, ms, cm, xu }) => { const N = vnama(); return Object.assign({ q: `${desc} ${N} berkata nilai ${cs} dalam persamaan itu ialah kadar perubahan bagi setiap ${xu}. Adakah ${N} betul?` }, salah(N, `${cs} ialah nilai awal, iaitu ${cm}`, `Kadar perubahan ialah kecerunan, iaitu ${ms}.`)); }
  ],
  kiraNilai: [
    ({ desc, ask }) => ({ q: `${desc} ${ask}` }),
    ({ eqT, defs, ask }) => ({ q: `Diberi ${eqT}, dengan ${defs}. ${ask}` }),
    ({ desc, ask }) => ({ q: `${desc} Berdasarkan persamaan ini, ${ask[0].toLowerCase() + ask.slice(1)}` }),
    ({ desc, fill }) => ({ q: `${desc} Lengkapkan: ${fill}` })
  ],
  bentukPers: [
    ({ data, Y, X, ask3, w3 }) => ({ q: `${data} Hubungan antara ${Y} dan ${X} ialah linear. (a) Tulis persamaan ${Y} dalam sebutan ${X}. (b) ${ask3}`, work: w3 }),
    ({ data, Y, X, E }) => ({ q: `${data} Diberi hubungan antara ${Y} dan ${X} ialah linear, bentukkan persamaan yang menghubungkan ${Y} dan ${X}.`, ans: E }),
    ({ data, Y, X, askC, cAns }) => ({ q: `${data} Hubungan antara ${Y} dan ${X} ialah linear. ${askC}`, ans: cAns })
  ],
  bandingPelan: [
    ({ desc, xu }) => ({ q: `${desc} Selepas berapa ${xu} jumlah bayaran kedua-dua pilihan adalah sama?` }),
    ({ desc, xu, xq, ansQ, wQ }) => ({ q: `${desc} Pilihan manakah lebih murah bagi ${xq} ${xu}? Tunjukkan pengiraan anda.`, ans: ansQ, work: wQ }),
    ({ desc, ansT }) => ({ q: `${desc} Cari titik persilangan graf kedua-dua pilihan dan nyatakan maksudnya.`, ans: ansT })
  ],
  k117: [
    ({ a }) => ({ q: a.q, ans: a.ans, work: a.work }),
    ({ b }) => ({ q: b.q, ans: b.ans, work: b.work }),
    ({ c }) => ({ q: c.q, ans: c.ans, work: c.work })
  ]
};

/* =================== pembina soalan (r = glRG atau glRW) =================== */
const GL = {};
/* ---------- 9.1.1 ---------- */
GL.mcBaca = r => {
  let m, c; do { m = glM(r); c = r.n(-9, 9); } while (glSama(m, c));
  const E = glEq(m, c), ms = glS(m), cs = fmt(c), ans = `m = ${ms}, c = ${cs}`;
  return GEN_LQ('mcBaca', { E, L: r.p(GLL1), ms, cs, ans, work: [`Bandingkan dengan y = mx + c.`, `Kecerunan = pekali x = ${ms}`, `Pintasan-y = pemalar = ${cs}`] });
};
GL.mcTulis = r => {
  let m, c; do { m = glM(r, .25); c = r.n(-9, 9); } while (glSama(m, c) || glV(m) === 1);
  const E = glEq(m, c), ms = glS(m), cs = fmt(c);
  return GEN_LQ('mcTulis', { E, L: r.p(GLL1), ms, cs, wrong: glEq(c, m), ans: E, work: [`m = ${ms}, c = ${cs}`, `Gantikan ke dalam y = mx + c: ${E}`] });
};
GL.mcMendatar = (r, k) => {
  const hor = k == null ? r.f() < .5 : k % 2 === 0, h = r.n(-8, 8), kk = r.n(-8, 8);
  let o; do { o = r.n(-8, 8); } while (o === (hor ? h : kk));
  const pt = P(h, kk), pt2 = hor ? P(o, kk) : P(h, o), E = hor ? `y = ${fmt(kk)}` : `x = ${fmt(h)}`;
  const E2 = hor ? `y = ${fmt(o)}` : `x = ${fmt(o)}`;
  return GEN_LQ('mcMendatar', {
    pt, pt2, E2, L: r.p(GLL1), ax: hor ? 'x' : 'y', jenis: hor ? 'mengufuk' : 'mencancang', ans: E,
    work: [hor ? `Garis selari dengan paksi-x ialah garis mengufuk: semua titik mempunyai y = ${fmt(kk)}.` : `Garis selari dengan paksi-y ialah garis mencancang: semua titik mempunyai x = ${fmt(h)}.`, `Persamaan: ${E}`],
    ansM: hor ? '0' : 'Tidak tertakrif', wM: [hor ? `${E2} ialah garis mengufuk (selari dengan paksi-x), maka kecerunannya 0.` : `${E2} ialah garis mencancang (selari dengan paksi-y), maka kecerunannya tidak tertakrif.`]
  });
};
GL.mcSusun = (r, k) => {
  const f = k == null ? r.i(0, 3) : k % 4;
  let m, c, G, w, claim, why;
  do { m = f === 1 ? glM(r, .5) : glMi(r, 5); c = r.n(-9, 9); } while (glSama(m, c) || (f === 0 && glV(m) === 1));
  const E = glEq(m, c), ms = glS(m), cs = fmt(c), am = glAbs(m);
  if (f === 0) { G = `y = ${fmt(c)} ${glV(m) < 0 ? '−' : '+'} ${glCo(am)}`; w = [`Susun semula: ${E}`]; claim = `kecerunan ialah ${cs}`; why = 'Kecerunan ialah pekali x, bukan nombor pertama dalam persamaan.'; }
  if (f === 1) { const K = glR(m)[1] === 1 ? r.p([2, 3, 4]) : glR(m)[1] * r.p([1, 2]); G = `${K}y = ${glRhs(glMul(m, K), K * c)}`; w = [`Bahagi setiap sebutan dengan ${K}: ${E}`]; claim = `kecerunan ialah ${glS(glMul(m, K))} dan pintasan-y ialah ${fmt(K * c)}`; why = `Bahagi setiap sebutan dengan ${K} dahulu supaya pekali y ialah 1.`; }
  if (f === 2) { G = `y ${glV(m) > 0 ? '−' : '+'} ${glCo(am)} = ${fmt(c)}`; w = [`Pindahkan sebutan x ke sebelah kanan: ${E}`]; claim = `kecerunan ialah ${glS(glNeg(m))}`; why = 'Apabila sebutan x dipindahkan ke sebelah kanan, tandanya berubah.'; }
  if (f === 3) { G = `y ${c > 0 ? '−' : '+'} ${Math.abs(c)} = ${glCo(m)}`; w = [`Pindahkan pemalar ke sebelah kanan: ${E}`]; claim = `pintasan-y ialah ${fmt(-c)}`; why = 'Apabila pemalar dipindahkan ke sebelah kanan, tandanya berubah.'; }
  const ans = `m = ${ms}, c = ${cs}`;
  return GEN_LQ('mcSusun', { G, E, L: r.p(GLL1), claim, why, ans, work: w.concat([ans]) });
};
GL.mcRajah = r => {
  let c, p, q, sg, t, x2, y2;
  do { [p, q] = r.p([[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2]]); sg = r.f() < .5 ? 1 : -1; t = r.p([1, 2, -1]); c = r.i(-4, 4); x2 = q * t; y2 = c + sg * p * t; }
  while (Math.abs(x2) > 6 || Math.abs(y2) > 6 || !c || Math.abs(x2) < 2);
  const m = glQ(sg * p, q), E = glEq(m, c), ms = glS(m), cs = fmt(c), L = r.p(GLL1);
  const base = { pts: [{ x: 0, y: c, l: P(0, c), c: 'pu' }, { x: x2, y: y2, l: P(x2, y2), c: 'am' }], lines: [{ a: [0, c], b: [x2, y2], c: 'am', w: 4 }], label: `Garis lurus ${L}` };
  const lg = glLegs(0, c, x2, y2), ans = Object.assign({}, base, { lines: base.lines.concat(lg.lines), texts: lg.texts });
  return GEN_LQ('mcRajah', { L, E, ms, cs, ans: E, work: [`Garis menyilang paksi-y di ${P(0, c)}, maka c = ${cs}.`, `m = (${fmt(y2)} − ${par(c)}) / (${fmt(x2)} − 0) = ${ms}`, E] }, { fig: glPlane(base), figAns: glPlane(ans) });
};
GL.k111 = r => {
  // (a) y = (k + a)x + 2k
  let a; do { const aa = r.i(1, 4), mm = r.n(-5, 5), k2 = r.f() < .5; const kk = mm - aa, cc = k2 ? 2 * kk : kk; a = { a: aa, m: mm, k: kk, k2, c: cc }; } while (!a.k || a.k === a.m);
  a.E = glEq(a.m, a.c); a.xi = glQ(-a.c, a.m);
  // (b) P(0, c), Q(x2, y2)
  let b; do { const mm = glM(r, .4), cc = r.n(-6, 6), mq = glR(mm)[1], x2 = mq * r.n(-3, 3); b = { m: mm, c: cc, x2, y2: glV(glAdd(glMul(mm, x2), cc)) }; } while (Math.abs(b.x2) > 9 || Math.abs(b.y2) > 12 || b.x2 === 0);
  b.E = glEq(b.m, b.c); b.xi = glDiv(-b.c, b.m); b.on = r.f() < .5; b.rx = r.n(-5, 5); b.yr = glAdd(glMul(b.m, b.rx), b.c);
  b.ry = glIsInt(b.yr) ? glV(b.yr) + (b.on ? 0 : r.p([-1, 1])) : Math.round(glV(b.yr)); if (!glIsInt(b.yr)) b.on = false;
  // (c) pintasan
  let c; do { const xi = r.n(-6, 6), yi = r.n(-8, 8); c = { xi, yi, m: glQ(-yi, xi), x3: r.n(-4, 4) }; } while (glR(c.m)[1] > 4);
  c.E = glEq(c.m, c.yi); c.y3 = glAdd(glMul(c.m, c.x3), c.yi);
  return GEN_LQ('k111', { a, b, c });
};

/* ---------- 9.1.2 ---------- */
GL.amKeMxc = r => {
  let a, b, c; do { a = r.n(-6, 6); b = r.p([1, 2, 3, 4, 5, -1, -2, -3]); c = r.f() < .7 ? b * r.n(-5, 5) : r.n(-12, 12); } while (a === b || glGcd(glGcd(a, b), c) !== 1);
  const G = glAm(a, b, c), W = glWAm(a, b, c), E = glEq(W.m, W.c), mc = `m = ${glS(W.m)}, c = ${glS(W.c)}`;
  return GEN_LQ('amKeMxc', { G, E, mc, L: r.p(GLL1), wm: glS(glQ(a, b)), ans: `${E}; ${mc}`, work: W.w.concat([mc]) });
};
GL.pinBentuk = r => {
  let a, b; do { a = r.n(-9, 9); b = r.n(-9, 9); } while (Math.abs(a) < 2 || Math.abs(b) < 2 || a === b);
  const m = glQ(-b, a), E = glEq(m, b);
  return GEN_LQ('pinBentuk', { G: glPin(a, b), a, b, m, E, work: [`Bentuk x/a + y/b = 1: a ialah pintasan-x dan b ialah pintasan-y.`, `Pintasan-x = ${fmt(a)}, pintasan-y = ${fmt(b)}`] });
};
function glPinData(r) {
  let xi, yi; do { xi = r.n(-6, 6); yi = r.n(-6, 6); } while (Math.abs(xi) < 2 || Math.abs(yi) < 2 || (Math.abs(xi) === Math.abs(yi) && r.f() < .7));
  const Lc = Math.abs(xi * yi) / glGcd(xi, yi);
  let a = Lc / xi, b = Lc / yi, c = Lc; if (a < 0) { a = -a; b = -b; c = -c; }
  return { xi, yi, a, b, c, G: glAm(a, b, c) };
}
GL.amPintasan = r => {
  const d = glPinData(r);
  const fl = { lines: [{ a: [d.xi, 0], b: [0, d.yi], c: 'am', w: 4 }], pts: [{ x: d.xi, y: 0, l: P(d.xi, 0), c: 'pk' }, { x: 0, y: d.yi, l: P(0, d.yi), c: 'tr' }], label: 'Garis lurus dengan pintasan-x dan pintasan-y' };
  return GEN_LQ('amPintasan', Object.assign({ ans: `Pintasan-x = ${fmt(d.xi)}, pintasan-y = ${fmt(d.yi)}`, work: [`Pintasan-x: gantikan y = 0 → ${glCo(d.a)} = ${fmt(d.c)} → x = ${fmt(d.xi)}`, `Pintasan-y: gantikan x = 0 → ${glCo(d.b, 'y')} = ${fmt(d.c)} → y = ${fmt(d.yi)}`] }, d), { figAns: glPlane(fl) });
};
GL.keBentukAm = r => {
  let m, c; do { m = glM(r, .6); c = r.n(-8, 8); } while (glV(m) === 1);
  const [a, b, k] = glAmOf(m, c), E = glEq(m, c), q = glR(m)[1], ans = glAm(a, b, k);
  const w = q === 1 ? [`Pindahkan sebutan x ke kiri: ${glAm(-glR(m)[0], 1, c)}`] : [`Darab setiap sebutan dengan ${q}: ${q}y = ${glRhs(glMul(m, q), q * c)}`, `Pindahkan sebutan x ke kiri: ${glAm(-glR(m)[0], q, q * c)}`];
  if (glR(m)[0] > 0) w.push(`Darab dengan −1 supaya a > 0: ${ans}`);
  return GEN_LQ('keBentukAm', { E, ans, work: w });
};
GL.keBentukPin = r => {
  const d = glPinData(r), ans = glPin(d.xi, d.yi), E = glEq(glQ(-d.yi, d.xi), d.yi);
  return GEN_LQ('keBentukPin', Object.assign({ E, ans, work: [`Bahagi setiap sebutan dengan ${fmt(d.c)}: ${glFv(glCo(d.a), d.c)} + ${glFv(glCo(d.b, 'y'), d.c)} = 1`, `Permudahkan: ${ans}`, `Pintasan-x = ${fmt(d.xi)}, pintasan-y = ${fmt(d.yi)}`] }, d));
};
GL.k112 = r => {
  let a; do { const b = r.p([1, 2, 3, 4, 6]), m = r.n(-4, 4), h = -m * b, xi = r.n(-4, 4); a = { b, m, h, c: h * xi, xi: glQ(xi), yi: glQ(h * xi, b) }; } while (!a.c);
  let b; do { const A = r.n(-8, 8), B = r.n(-8, 8), t = r.p([-1, 2, 3, -2]); b = { a: A, b: B, x0: A * t, y0: B * (1 - t), t: glQ(t), m: glQ(-B, A) }; } while (Math.abs(b.a) < 2 || Math.abs(b.b) < 2 || Math.abs(b.x0) > 15 || Math.abs(b.y0) > 15);
  let c; do { const A = r.i(1, 5), xi = r.n(-6, 6), C = A * xi, yi = r.p([1, 2, 3, 4, 6, -1, -2, -3, -4, -6]); c = { a: A, c: C, yi, k: C / yi, xi: glQ(xi) }; } while (!Number.isInteger(c.k) || c.c <= 0 || Math.abs(c.k) > 12 || Math.abs(c.k) < 2);
  c.m = glQ(-c.a, c.k);
  return GEN_LQ('k112', { a, b, c });
};

/* ---------- 9.1.3 ---------- */
function glLineData(r, amP) {
  // garis dalam bentuk y = mx + c (integer) atau ax + by = c; f(x, y) = nilai kiri, cek(x, y) = benar jika pada garis
  if (r.f() < (amP == null ? .35 : amP)) {
    let a, b; do { a = r.n(-5, 5); b = r.n(-4, 4); } while (glGcd(a, b) !== 1 || a < 0);
    const x1 = r.i(-3, 3), y1 = r.i(-3, 3), c = a * x1 + b * y1;
    return { am: true, a, b, c, G: glAm(a, b, c), on: t => [x1 + b * t, y1 - a * t], val: (x, y) => a * x + b * y, chk: (x, y) => `${a === 1 ? '' : a === -1 ? '−' : fmt(a)}(${fmt(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${fmt(y)}) = ${fmt(a * x + b * y)}` };
  }
  const m = r.n(-4, 4), c = r.i(-6, 6);
  return { am: false, m, c, G: glEq(m, c), on: t => [t, m * t + c], val: x => m * x + c, chk: x => `${glS(m) === '1' ? '' : glS(m) === '−1' ? '−' : glS(m)}(${fmt(x)})${glK(c)} = ${fmt(m * x + c)}` };
}
function glSemak(Ln, x, y) {
  if (Ln.am) { const v = Ln.val(x, y), ok = v === Ln.c; return { ok, w: [`Gantikan x = ${fmt(x)}, y = ${fmt(y)} ke dalam sebelah kiri: ${Ln.chk(x, y)}`, `${fmt(v)} ${ok ? '=' : '≠'} ${fmt(Ln.c)}`] }; }
  const v = Ln.val(x), ok = v === y; return { ok, w: [`Gantikan x = ${fmt(x)} ke dalam sebelah kanan: y = ${Ln.chk(x)}`, `${fmt(v)} ${ok ? '=' : '≠'} ${fmt(y)}`] };
}
GL.semakTitik = (r, k) => {
  const Ln = glLineData(r), on = k == null ? r.f() < .5 : k % 2 === 0;
  const near = () => { let p; do { p = Ln.on(r.i(-3, 3)); } while (Math.abs(p[0]) > 9 || Math.abs(p[1]) > 12); return p; };
  let [x, y] = near(); if (!on) y += r.n(-2, 2);
  let ox, oy, fx, fy; do { [ox, oy] = near(); [fx, fy] = near(); fy += r.n(-2, 2); } while (ox === fx);
  const sw = r.f() < .5, [A, B] = r.p(GLH2), pOn = P(ox, oy), pOff = P(fx, fy);
  const nOn = sw ? A : B, nOff = sw ? B : A;
  const w2 = glSemak(Ln, ox, oy).w.concat([`Titik ${nOn} terletak pada garis.`], glSemak(Ln, fx, fy).w, [`Titik ${nOff} tidak terletak pada garis.`]);
  const sv = glSemak(Ln, x, y), verdict = sv.ok ? 'Ya, titik itu terletak pada garis lurus itu' : 'Tidak, titik itu tidak terletak pada garis lurus itu';
  return GEN_LQ('semakTitik', { pt: P(x, y), G: Ln.G, L: r.p(GLT), A, B, pA: sw ? pOn : pOff, pB: sw ? pOff : pOn, onN: nOn, w2, on: sv.ok, ans: verdict, work: sv.w.concat([sv.ok ? 'Kedua-dua belah sama, maka titik itu terletak pada garis.' : 'Kedua-dua belah tidak sama, maka titik itu tidak terletak pada garis.']) });
};
GL.cariKoord = (r, k) => {
  const yUnk = k == null ? r.f() < .5 : k % 2 === 0;
  let m, c, x, y; do { m = r.n(-5, 5); c = r.i(-8, 8); x = r.n(-5, 5); y = m * x + c; } while (Math.abs(y) > 15);
  const v = yUnk ? 'k' : 'h', G = glEq(m, c), pt = yUnk ? `(${fmt(x)}, k)` : `(h, ${fmt(y)})`, ans = `${v} = ${fmt(yUnk ? y : x)}`;
  const work = yUnk ? [`Gantikan x = ${fmt(x)}: k = ${glS(m)}(${fmt(x)})${glK(c)}`.replace(/= (−?)1\(/, '= $1('), `k = ${fmt(y)}`]
    : [`Gantikan y = ${fmt(y)}, x = h: ${fmt(y)} = ${glCo(m, 'h')}${glK(c)}`, `${glCo(m, 'h')} = ${fmt(y)} − ${par(c)} = ${fmt(y - c)}`, `h = ${fmt(x)}`];
  return GEN_LQ('cariKoord', { pt: `${r.p(GLT)}${pt}`, G, v, ans, work });
};
GL.cariKoordAm = (r, k) => {
  const xUnk = k == null ? r.f() < .5 : k % 2 === 0;
  let a, b, x, y; do { a = r.n(-5, 6); b = r.n(-5, 5); x = r.n(-5, 5); y = r.n(-6, 6); } while (glGcd(a, b) !== 1 || a < 0 || Math.abs(a * x + b * y) > 30);
  const c = a * x + b * y, G = glAm(a, b, c), v = xUnk ? 'h' : 'k', pt = xUnk ? `(h, ${fmt(y)})` : `(${fmt(x)}, k)`;
  const t1 = xUnk ? `${glCo(a, 'h')} ${b * y < 0 ? '−' : '+'} ${Math.abs(b * y)} = ${fmt(c)}` : `${fmt(a * x)} ${b < 0 ? '−' : '+'} ${glCo(Math.abs(b), 'k')} = ${fmt(c)}`;
  const t2 = xUnk ? `${glCo(a, 'h')} = ${fmt(c - b * y)}` : `${glCo(b, 'k')} = ${fmt(c - a * x)}`;
  return GEN_LQ('cariKoordAm', { pt, G, v, L: r.p(GLT), ans: `${v} = ${fmt(xUnk ? x : y)}`, work: [`Gantikan ${xUnk ? `x = h, y = ${fmt(y)}` : `x = ${fmt(x)}, y = k`}: ${t1}`, t2, `${v} = ${fmt(xUnk ? x : y)}`] });
};
GL.cariPemalar = (r, k) => {
  const f = k == null ? r.i(0, 2) : k % 3;
  let m, c, x, y; do { m = r.n(-5, 5); c = r.i(-8, 8); x = r.n(-4, 4); y = m * x + c; } while (Math.abs(y) > 15 || m === c);
  const pt = P(x, y);
  if (f === 0) return GEN_LQ('cariPemalar', { pt, G: `y = px${glK(c)}`, v: 'p', ans: `p = ${fmt(m)}`, wrong: fmt(-m), E: glEq(m, c), work: [`Gantikan ${pt}: ${fmt(y)} = p(${fmt(x)})${glK(c)}`, `${glCo(x, 'p')} = ${fmt(y)} − ${par(c)} = ${fmt(y - c)}`, `p = ${fmt(m)}`] });
  if (f === 1) return GEN_LQ('cariPemalar', { pt, G: `y = ${glCo(m)} + k`, v: 'k', ans: `k = ${fmt(c)}`, wrong: fmt(y + m * x), E: glEq(m, c), work: [`Gantikan ${pt}: ${fmt(y)} = ${fmt(m)}(${fmt(x)}) + k`, `k = ${fmt(y)} − ${par(m * x)} = ${fmt(c)}`] });
  const b = r.p([2, 3, -2, 5]), p = r.n(-5, 5), cc = p * x + b * y;
  return GEN_LQ('cariPemalar', { pt, G: `px ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(cc)}`, v: 'p', ans: `p = ${fmt(p)}`, wrong: fmt(-p), E: glAm(p, b, cc), work: [`Gantikan ${pt}: p(${fmt(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)}(${fmt(y)}) = ${fmt(cc)}`, `${glCo(x, 'p')} = ${fmt(cc)} − ${par(b * y)} = ${fmt(cc - b * y)}`, `p = ${fmt(p)}`] });
};
GL.k113 = r => {
  let a; do { const m = r.p([-3, -2, -1, 1, 3, 4]), h = r.n(-4, 4); a = { m, h, c: (2 - m) * h }; } while (Math.abs(a.c) > 15);
  a.E = glEq(a.m, a.c);
  let b; do { const p = r.n(-4, 4), q = r.i(-6, 6), x1 = r.i(-3, 3), x2 = r.i(-3, 4); b = { p, q, x1, x2, y1: p * x1 + q, y2: p * x2 + q }; } while (b.x1 === b.x2 || Math.abs(b.y1) > 15 || Math.abs(b.y2) > 15);
  let c; do { const m = r.n(-4, 4), x1 = r.n(-3, 3), cc = r.i(-6, 6), x2 = r.n(-4, 4), x3 = r.n(-4, 4), on = r.f() < .5; c = { m, x1, y1: m * x1 + cc, c: cc, x2, k: m * x2 + cc, x3, y3: m * x3 + cc + (on ? 0 : r.p([-1, 1, 2])), on }; } while (c.x2 === c.x1 || c.x3 === c.x1 || c.x3 === c.x2 || Math.abs(c.k) > 15 || Math.abs(c.y1) > 15 || Math.abs(c.y3) > 16);
  return GEN_LQ('k113', { a, b, c });
};

/* ---------- 9.1.4 ---------- */
// tulis garis (m, c) dalam pelbagai bentuk; pulangkan { G, w } dengan w = langkah menukar ke y = mx + c
function glForm(r, m, c, kind) {
  kind = kind == null ? r.p(['mxc', 'am', 'am', 'kali']) : kind;
  const E = glEq(m, c);
  if (kind === 'am') { const [a, b, k] = glAmOf(m, c); if (b !== 0) { const W = glWAm(a, b, k); return { G: glAm(a, b, k), w: W.w, kind }; } }
  if (kind === 'kali') { const K = glR(m)[1] * glR(c)[1] > 1 ? glR(m)[1] * glR(c)[1] / glGcd(glR(m)[1], glR(c)[1]) : r.p([2, 3]); return { G: `${K}y = ${glRhs(glMul(m, K), glMul(c, K))}`, w: [`Bahagi dengan ${K}: ${E}`], kind }; }
  return { G: E, w: [], kind: 'mxc' };
}
GL.selariYT = (r, k) => {
  const pr = k == null ? r.f() < .5 : k % 2 === 0;
  let m1, c1, m2, c2; do { m1 = glM(r, .4); c1 = r.i(-8, 8); c2 = r.i(-8, 8); m2 = pr ? m1 : r.p([glNeg(m1), glDiv(1, m1), glAdd(m1, 1), glMul(m1, 2)]); } while (c1 === c2 || (!pr && glSama(m1, m2)));
  const F1 = glForm(r, m1, c1), F2 = glForm(r, m2, c2, F1.kind === 'mxc' ? r.p(['am', 'kali']) : null);
  const ms = [glS(m1), glS(m2)], L = r.p(GLH2);
  const ans = pr ? `Selari, kerana m₁ = m₂ = ${ms[0]}` : `Tidak selari, kerana m₁ = ${ms[0]} dan m₂ = ${ms[1]}`;
  const work = [].concat(F1.w.length ? [`${F1.G}: ${F1.w[F1.w.length - 1].replace(/^.*: /, '')}`] : [], F2.w.length ? [`${F2.G}: ${F2.w[F2.w.length - 1].replace(/^.*: /, '')}`] : [], [`m₁ = ${ms[0]}, m₂ = ${ms[1]}`, pr ? 'Kecerunan sama, maka kedua-dua garis selari.' : 'Kecerunan berbeza, maka garis-garis itu tidak selari.']);
  return GEN_LQ('selariYT', { G1: F1.G, G2: F2.G, L1: L[0] + L[1], L2: r.p(['MN', 'RS', 'UV']), par: pr, ms, ans, work });
};
GL.kecSelari = r => {
  let m, c, c2; do { m = glM(r, .45); c = r.i(-8, 8); c2 = r.n(-8, 8); } while (c === c2);
  const F = glForm(r, m, c), ms = glS(m);
  return GEN_LQ('kecSelari', { G: F.G, L: r.p(GLL1), c2, E2: glEq(m, c2), ans: `m = ${ms}`, work: F.w.concat([`Kecerunan garis itu ialah ${ms}.`, `Garis selari mempunyai kecerunan yang sama, iaitu ${ms}.`]) });
};
GL.cariKSelari = (r, k) => {
  const f = k == null ? r.i(0, 3) : k % 4, m = r.n(-5, 5), c1 = r.n(-9, 9);
  let c2; do { c2 = r.i(-8, 8); } while (c2 === c1);
  let G1, G2 = glEq(m, c2), ans, w;
  if (f === 0) { const a = r.n(-4, 4), kk = m - a; G1 = `y = (k ${a < 0 ? '−' : '+'} ${Math.abs(a)})x${glK(c1)}`; ans = `k = ${fmt(kk)}`; w = [`Kecerunan ${G1} ialah k ${a < 0 ? '−' : '+'} ${Math.abs(a)}.`, `Garis selari: k ${a < 0 ? '−' : '+'} ${Math.abs(a)} = ${fmt(m)}`, ans]; }
  if (f === 1) { const b = r.p([2, 3, 4, -2]), cc = b * c1; G1 = `kx ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(cc)}`; ans = `k = ${fmt(-m * b)}`; w = [`Bagi ax + by = c, m = −a/b. Kecerunan ${G1} = −k / ${par(b)}`, `Garis selari: −k / ${par(b)} = ${fmt(m)}`, ans]; }
  if (f === 2) { const K = r.p([2, 3]); G1 = `${K}y = kx${glK(K * c1)}`; ans = `k = ${fmt(K * m)}`; w = [`Bahagi dengan ${K}: y = ${glFv('k', K)}x${glK(c1)}`, `Garis selari: k/${K} = ${fmt(m)}`, ans]; }
  if (f === 3) { const x1 = r.i(-4, 2), dx = r.p([1, 2]); let y1; do { y1 = r.i(-5, 5); } while (y1 - m * x1 === c1); G2 = `garis lurus yang melalui ${P(x1, y1)} dan ${P(x1 + dx, y1 + m * dx)}`; G1 = `y = kx${glK(c1)}`; ans = `k = ${fmt(m)}`; w = [`Kecerunan garis kedua = (${fmt(y1 + m * dx)} − ${par(y1)}) / (${fmt(x1 + dx)} − ${par(x1)}) = ${fmt(m)}`, `Garis selari: k = ${fmt(m)}`]; }
  return GEN_LQ('cariKSelari', { G1, G2, ans, yi: fmt(c1), work: w });
};
GL.persSelari = r => {
  let m, c0, x, y, c; do { m = glM(r, .3); c0 = r.i(-8, 8); x = glR(m)[1] * r.n(-3, 3); y = r.i(-7, 7); c = glSub(y, glMul(m, x)); } while (!glIsInt(c) || glSama(c, c0) || Math.abs(glV(c)) > 15 || Math.abs(x) > 8);
  const F = glForm(r, m, c0), E = glEq(m, c), W = glWc(m, x, y), cw = glAdd(y, glMul(m, x));
  return GEN_LQ('persSelari', { G: F.G, pt: P(x, y), L: r.p(GLL1), wrong: glEq(m, glSama(cw, c) ? glNeg(c) : cw), ans: E, work: F.w.concat([`Garis selari: m = ${glS(m)}`], W.w, [E]) });
};
GL.k114 = r => {
  let a; do { const P0 = [r.i(-4, 2), r.i(-4, 3)], m = glMi(r, 3), dx = r.p([2, 3, 4]), Q0 = [P0[0] + dx, P0[1] + glV(m) * dx], R0 = [Q0[0] + r.i(-3, 1), Q0[1] + r.i(2, 5)]; a = { P: P0, Q: Q0, R: R0, m: glQ(glV(m)) }; } while (Math.abs(a.Q[1]) > 10 || Math.abs(a.R[1]) > 12 || a.R[0] === a.Q[0] || (a.R[1] - a.Q[1]) === glV(a.m) * (a.R[0] - a.Q[0]));
  a.c = glSub(a.R[1], glMul(a.m, a.R[0])); a.E = glEq(a.m, a.c);
  let b; do { const m = r.n(-4, 4), x1 = r.i(-3, 2), dx = r.p([1, 2, 3]), y1 = r.i(-4, 4), cc = r.n(-8, 8); b = { m, x1, y1, x2: x1 + dx, y2: y1 + m * dx, h: 2 * m, c: cc, xi: glQ(-cc, 2 * m) }; } while (Math.abs(b.y2) > 12);
  let c; do { const d = glPinData(r); const m = glQ(-d.yi, d.xi), x0 = glR(m)[1] * r.n(-2, 2), y0 = r.i(-6, 6), cc = glSub(y0, glMul(m, x0)); c = { a: d.xi, b: d.yi, G: glPin(d.xi, d.yi), m, x0, y0, c: cc, L: r.p(GLL1) }; } while (!glIsInt(c.c) || glV(c.c) === c.b || Math.abs(c.x0) > 8 || glV(c.c) === 0);
  c.E = glEq(c.m, c.c); c.xi = glDiv(glNeg(c.c), c.m);
  return GEN_LQ('k114', { a, b, c });
};

/* ---------- 9.1.5 ---------- */
GL.persMTitik = r => {
  let m, x, y, c; do { m = glM(r, .3); x = glR(m)[1] * r.n(-3, 3); y = r.i(-8, 8); c = glSub(y, glMul(m, x)); } while (!glIsInt(c) || Math.abs(glV(c)) > 12 || Math.abs(x) > 8);
  const E = glEq(m, c), W = glWc(m, x, y), cw = glAdd(y, glMul(m, x));
  return GEN_LQ('persMTitik', { ms: glS(m), pt: P(x, y), L: r.p(GLL1), wrong: glEq(m, glSama(cw, c) ? glNeg(c) : cw), ans: E, work: W.w.concat([E]) });
};
GL.persDuaTitik = (r, fr) => {
  let x1, y1, x2, y2, m, c;
  do { x1 = r.i(-5, 5); y1 = r.i(-6, 6); x2 = r.i(-5, 6); y2 = r.i(-6, 6); m = glQ(y2 - y1, x2 - x1); c = x1 === x2 ? null : glSub(y1, glMul(m, x1)); }
  while (x1 === x2 || y1 === y2 || (fr ? glIsInt(m) || glR(m)[1] > 4 : !glIsInt(m)) || !glIsInt(c) || Math.abs(glV(c)) > 15);
  const [A, B] = r.p(GLH2), E = glEq(m, c), W2 = glW2(x1, y1, x2, y2), W = glWc(m, x1, y1);
  return GEN_LQ('persDuaTitik', { A, B, p1: P(x1, y1), p2: P(x2, y2), ans: E, work: W2.w.concat(W.w, [E]) });
};
GL.persPintasan = r => {
  let xi, yi; do { xi = r.n(-6, 6); yi = r.n(-8, 8); } while (glR(glQ(-yi, xi))[1] > 4 || Math.abs(xi) < 2);
  const m = glQ(-yi, xi), E = glEq(m, yi);
  const fig = glPlane({ lines: [{ a: [xi, 0], b: [0, yi], c: 'am', w: 4 }], pts: [{ x: xi, y: 0, l: P(xi, 0), c: 'pk' }, { x: 0, y: yi, l: P(0, yi), c: 'tr' }], label: 'Garis lurus memotong paksi-x dan paksi-y' });
  return GEN_LQ('persPintasan', { xi, yi, L: r.p(GLL1), ans: E, work: [`m = −(pintasan-y) / (pintasan-x) = −(${fmt(yi)}) / ${par(xi)} = ${glS(m)}`, `c = pintasan-y = ${fmt(yi)}`, E] }, { fig });
};
GL.persRajah = r => {
  let x1, y1, x2, y2, m, c;
  do { x1 = r.n(-5, 5); y1 = r.i(-5, 5); x2 = r.n(-5, 5); y2 = r.i(-5, 5); m = glQ(y2 - y1, x2 - x1); c = x1 === x2 ? null : glSub(y1, glMul(m, x1)); }
  while (x1 === x2 || y1 === y2 || !glIsInt(c) || glR(m)[1] > 3 || Math.abs(x2 - x1) < 2 || Math.abs(glV(c)) > 8);
  const L = r.p(GLL1), E = glEq(m, c), base = { pts: [{ x: x1, y: y1, l: P(x1, y1), c: 'am' }, { x: x2, y: y2, l: P(x2, y2), c: 'pk' }], lines: [{ a: [x1, y1], b: [x2, y2], c: 'am', w: 4 }], label: `Garis lurus ${L}` };
  const lg = glLegs(x1, y1, x2, y2);
  return GEN_LQ('persRajah', { L, ans: E, work: [`Dari rajah: ${P(x1, y1)} dan ${P(x2, y2)}.`].concat(glW2(x1, y1, x2, y2).w, glWc(m, x1, y1).w, [E]) }, { fig: glPlane(base), figAns: glPlane(Object.assign({}, base, { lines: base.lines.concat(lg.lines), texts: lg.texts })) });
};
GL.k115 = r => {
  let a; do { const m = glMi(r, 3), B = [r.i(-4, 2), r.i(-4, 4)], dx = r.p([1, 2, 3]), C = [B[0] + dx, B[1] + glV(m) * dx], A = [r.i(-5, 5), r.i(-5, 6)]; a = { A, B, C, m: glQ(glV(m)) }; a.c = glSub(A[1], glMul(a.m, A[0])); } while (Math.abs(a.C[1]) > 10 || glV(a.c) === glV(glSub(a.B[1], glMul(a.m, a.B[0]))) || glV(a.c) === 0 || (a.A[0] === a.B[0] && a.A[1] === a.B[1]));
  a.E = glEq(a.m, a.c); a.xi = glDiv(glNeg(a.c), a.m);
  let b; do { const m = r.n(-4, 4), c = r.n(-6, 6), x1 = r.n(-3, 3), x2 = r.n(-4, 5); b = { m, c, x1, y1: m * x1 + c, x2, k: m * x2 + c }; } while (b.x1 === b.x2 || Math.abs(b.y1) > 12 || Math.abs(b.k) > 15);
  b.E = glEq(b.m, b.c);
  let c; do { const aa = r.n(-5, 5), x1 = r.n(-5, 5), y1 = r.n(-6, 6), m = glQ(y1, x1 - aa); c = { a: aa, x1, y1, m }; c.c = glMul(glNeg(m), aa); } while (c.x1 === c.a || glR(c.m)[1] > 3 || !glIsInt(c.c));
  c.E = glEq(c.m, c.c);
  return GEN_LQ('k115', { a, b, c });
};

/* ---------- 9.1.6 ---------- */
// x = (c2 − c1)/(m1 − m2) dengan langkah
const glWSil = (m1, c1, m2, c2, x0, y0) => [`${glRhs(m1, c1)} = ${glRhs(m2, c2)}`, `${glCo(glSub(m1, m2))} = ${glS(glSub(c2, c1))}`, `x = ${fmt(x0)}`, `y = ${glS(m1)}(${fmt(x0)})${glK(c1)} = ${fmt(y0)}`.replace(/= (−?)1\(/, '= $1('), `Titik persilangan ialah ${P(x0, y0)}`];
GL.silangMudah = (r, k) => {
  const ver = k == null ? r.f() < .5 : k % 2 === 0;
  let m, c, x0, y0; do { m = r.n(-4, 4); c = r.i(-6, 6); x0 = r.n(-5, 5); y0 = m * x0 + c; } while (Math.abs(y0) > 12);
  const G1 = glEq(m, c), G2 = ver ? `x = ${fmt(x0)}` : `y = ${fmt(y0)}`, ans = P(x0, y0);
  const work = ver ? [`Gantikan x = ${fmt(x0)} ke dalam ${G1}: y = ${glS(m)}(${fmt(x0)})${glK(c)} = ${fmt(y0)}`.replace(/y = (−?)1\(/, 'y = $1('), `Titik persilangan ialah ${ans}`]
    : [`Gantikan y = ${fmt(y0)} ke dalam ${G1}: ${fmt(y0)} = ${glRhs(m, c)}`, `${glCo(m)} = ${fmt(y0 - c)} → x = ${fmt(x0)}`, `Titik persilangan ialah ${ans}`];
  return GEN_LQ('silangMudah', { G1: r.f() < .5 ? G1 : G1, G2, T: r.p(GLT), ans, work });
};
function glDuaGaris(r, fr) {
  let m1, m2, x0, y0, c1, c2;
  do { m1 = fr && r.f() < .5 ? r.p(GLMF.slice(0, 8)) : glMi(r, 4); m2 = glMi(r, 4); x0 = r.i(-5, 5); y0 = r.i(-5, 5); c1 = glSub(y0, glMul(m1, x0)); c2 = glSub(y0, glMul(m2, x0)); }
  while (glSama(m1, m2) || !glIsInt(c1) || Math.abs(glV(c1)) > 12 || Math.abs(glV(c2)) > 12);
  return { m1, m2, x0, y0, c1, c2 };
}
GL.silangGanti = r => {
  const d = glDuaGaris(r, true), G1 = glEq(d.m1, d.c1), F2 = glForm(r, d.m2, d.c2, r.p(['mxc', 'mxc', 'am'])), G2 = F2.G;
  const wp = d.y0 !== d.x0 ? P(d.y0, d.x0) : P(d.x0, d.y0 + 1), ans = P(d.x0, d.y0);
  return GEN_LQ('silangGanti', { G1, G2, x0: d.x0, y0: d.y0, T: r.p(GLT), L1: 'PQ', L2: 'RS', wp, ans, work: F2.w.concat(glWSil(d.m1, d.c1, d.m2, d.c2, d.x0, d.y0)) });
};
GL.silangRajah = r => {
  let d; do { d = glDuaGaris(r, false); } while (Math.abs(d.x0) > 4 || Math.abs(d.y0) > 4 || Math.abs(glV(d.c1)) > 6 || Math.abs(glV(d.c2)) > 6 || Math.abs(glV(d.m1)) > 3 || Math.abs(glV(d.m2)) > 3);
  const G1 = glEq(d.m1, d.c1), G2 = glEq(d.m2, d.c2), box = { x0: -6, x1: 6, y0: -6, y1: 6 };
  const t1 = (m, c) => { const [p, q] = glTwo(m, c); return glClip(p, q, box); };
  const lines = [{ a: t1(d.m1, d.c1)[0], b: t1(d.m1, d.c1)[1], c: 'tr', w: 4, seg: true }, { a: t1(d.m2, d.c2)[0], b: t1(d.m2, d.c2)[1], c: 'pk', w: 4, seg: true }];
  const lab = (m, c, col, s) => { const [a, b] = t1(m, c), e = a[1] > b[1] ? a : b; return { x: Math.max(-4.6, Math.min(4.6, e[0] + (e[0] > 0 ? -.9 : .9))), y: Math.min(5.3, e[1] - .2), s, c: col, size: 16 }; };
  const texts = [lab(d.m1, d.c1, 'tr', G1), lab(d.m2, d.c2, 'pk', G2)];
  if (Math.abs(texts[0].y - texts[1].y) < .8 && Math.abs(texts[0].x - texts[1].x) < 4) texts[1].y -= 1;
  const fig = glPlane({ box, lines, texts, label: `Graf ${G1} dan ${G2}` });
  const figAns = glPlane({ box, lines, texts, pts: [{ x: d.x0, y: d.y0, l: P(d.x0, d.y0), c: 'am' }], label: 'Titik persilangan' });
  return GEN_LQ('silangRajah', { G1, G2, x0: d.x0, y0: d.y0, ans: P(d.x0, d.y0), work: [`Baca koordinat titik persilangan daripada graf: ${P(d.x0, d.y0)}.`, `Semak: ${fmt(d.y0)} = ${glS(d.m1)}(${fmt(d.x0)})${glK(d.c1)} ✓ dan ${fmt(d.y0)} = ${glS(d.m2)}(${fmt(d.x0)})${glK(d.c2)} ✓`.replace(/= (−?)1\(/g, '= $1(')] }, { fig, figAns });
};
GL.silangHapus = r => {
  let a1, b1, a2, b2, x0, y0; do { a1 = r.n(-4, 5); b1 = r.n(-4, 4); x0 = r.i(-5, 5); y0 = r.i(-5, 5); if (r.f() < .5) { b2 = r.p([b1, -b1]); a2 = r.n(-4, 5); } else { a2 = r.p([a1, -a1]); b2 = r.n(-4, 4); } }
  while (a1 * b2 === a2 * b1 || a1 < 0 || a2 < 0 || glGcd(a1, b1) !== 1 || glGcd(a2, b2) !== 1 || (a1 === a2 && b1 === b2));
  const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, G1 = glAm(a1, b1, c1), G2 = glAm(a2, b2, c2), w = [];
  if (b1 === b2 || b1 === -b2) { const add = b1 === -b2, A = add ? a1 + a2 : a1 - a2, C = add ? c1 + c2 : c1 - c2; w.push(`${add ? 'Tambah' : 'Tolak'} kedua-dua persamaan untuk menghapuskan y: ${glCo(A)} = ${fmt(C)}`, `x = ${fmt(x0)}`, `Gantikan x = ${fmt(x0)} ke dalam ${G1}: ${glCo(b1, 'y')} = ${fmt(c1)} − ${par(a1 * x0)} = ${fmt(c1 - a1 * x0)}`, `y = ${fmt(y0)}`); }
  else { const add = a1 === -a2, B = add ? b1 + b2 : b1 - b2, C = add ? c1 + c2 : c1 - c2; w.push(`${add ? 'Tambah' : 'Tolak'} kedua-dua persamaan untuk menghapuskan x: ${glCo(B, 'y')} = ${fmt(C)}`, `y = ${fmt(y0)}`, `Gantikan y = ${fmt(y0)} ke dalam ${G1}: ${glCo(a1)} = ${fmt(c1)} − ${par(b1 * y0)} = ${fmt(c1 - b1 * y0)}`, `x = ${fmt(x0)}`); }
  w.push(`Titik persilangan ialah ${P(x0, y0)}`);
  return GEN_LQ('silangHapus', { G1, G2, x0, y0, T: r.p(GLT), ans: P(x0, y0), work: w });
};
GL.silangPaksi = (r, k) => {
  const d = glPinData(r), onX = k == null ? r.f() < .5 : k % 2 === 0, ax = onX ? 'x' : 'y', ptA = onX ? P(d.xi, 0) : P(0, d.yi);
  const am = r.f() < .6, G = am ? d.G : glEq(glQ(-d.yi, d.xi), d.yi);
  const work = [onX ? `Pada paksi-x, y = 0.` : `Pada paksi-y, x = 0.`, onX ? `Gantikan y = 0 ke dalam ${G}: x = ${fmt(d.xi)}` : `Gantikan x = 0 ke dalam ${G}: y = ${fmt(d.yi)}`, `Koordinat: ${ptA}`];
  let m, c1, c2; do { m = glM(r, .4); c1 = r.i(-8, 8); c2 = r.i(-8, 8); } while (c1 === c2);
  const F = glForm(r, m, c2, 'am'), S1 = glEq(m, c1), S2 = F.G;
  const sW = F.w.concat([`Kecerunan kedua-dua garis ialah ${glS(m)}, tetapi pintasan-y berbeza (${fmt(c1)} dan ${fmt(c2)}).`, 'Maka kedua-dua garis selari dan tidak bersilang.']);
  return GEN_LQ('silangPaksi', { G, ax, ptA, T: r.p(GLT), S1, S2, sAns: `Kedua-dua garis selari (m = ${glS(m)}) dengan pintasan-y berbeza, maka tiada titik persilangan`, sW, ans: ptA, work });
};
GL.k116 = r => {
  let a; do { const y0 = r.p([2, 3, 4, 6, -2, -3, -4, -6]), x0 = r.i(-3, 3), m1 = r.p([1, 2, 3].filter(v => y0 % v === 0)), m2 = -r.p([1, 2, 3, 6].filter(v => y0 % v === 0)); a = { x0, y0, m1, m2, c1: y0 - m1 * x0, c2: y0 - m2 * x0, a: x0 - y0 / m1, b: x0 - y0 / m2 }; } while (Math.abs(a.c1) > 15 || Math.abs(a.c2) > 15 || a.a === a.b);
  a.G1 = glEq(a.m1, a.c1); a.G2 = glEq(a.m2, a.c2); a.luas = Math.abs(a.b - a.a) * Math.abs(a.y0) / 2;
  let b; do { const d = glDuaGaris(r, false), k = r.n(-4, 4); b = Object.assign(d, { m1: glV(d.m1), m2: glV(d.m2), c1: glV(d.c1), c2: glV(d.c2), k, c3: d.y0 - k * d.x0 }); } while (!b.x0 || !b.c3 || Math.abs(b.c3) > 15 || b.k === b.m1 || b.k === b.m2);
  b.G1 = glEq(b.m1, b.c1); b.G2 = glEq(b.m2, b.c2);
  let c; do { const d = glDuaGaris(r, false), m3 = glM(r, .4), cc = glSub(d.y0, glMul(m3, d.x0)); c = Object.assign(d, { m3, c: cc }); } while (!glIsInt(c.c) || glSama(c.m3, c.m1) || glSama(c.m3, c.m2) || Math.abs(glV(c.c)) > 15);
  c.G1 = glEq(c.m1, c.c1); c.G2 = glEq(c.m2, c.c2); let c3; do { c3 = r.i(-6, 6); } while (c3 === glV(c.c)); c.G3 = glForm(r, c.m3, c3, 'am').G; c.E = glEq(c.m3, c.c);
  return GEN_LQ('k116', { a, b, c });
};

/* ---------- 9.1.7 ---------- */
// konteks: Y, X, unit, ayat, maksud m & c, julat
const GLCTX = [
  { nm: 'sewa basikal', Y: 'C', X: 't', yv: v => `RM${v}`, xu: 'jam', sg: 1, mR: [2, 6], cR: [3, 10], d: (m, c) => `Kos menyewa sebuah basikal, RM${'C'}, bagi t jam diberi oleh C = ${m}t + ${c}.`, mm: m => `kos sewa bertambah RM${m} bagi setiap jam`, cm: c => `caj asas sebanyak RM${c}`, defs: 'C ialah kos sewa basikal (RM) dan t ialah masa (jam)', ay: x => `Hitung kos menyewa basikal itu selama ${x} jam.`, ax: y => `Berapa jamkah basikal itu disewa jika kosnya RM${y}?`, dat: (x1, y1, x2, y2) => `Kos menyewa sebuah basikal selama ${x1} jam ialah RM${y1} dan selama ${x2} jam ialah RM${y2}.`, askC: 'Berapakah caj asas sewaan basikal itu?' },
  { nm: 'tambang teksi', Y: 'T', X: 'd', yv: v => `RM${v}`, xu: 'kilometer', sg: 1, mR: [2, 3], cR: [3, 6], d: (m, c) => `Tambang sebuah teksi, RMT, bagi perjalanan sejauh d km diberi oleh T = ${m}d + ${c}.`, mm: m => `tambang bertambah RM${m} bagi setiap kilometer`, cm: c => `caj permulaan sebanyak RM${c}`, defs: 'T ialah tambang (RM) dan d ialah jarak (km)', ay: x => `Hitung tambang bagi perjalanan sejauh ${x} km.`, ax: y => `Berapa jauhkah perjalanan jika tambangnya RM${y}?`, dat: (x1, y1, x2, y2) => `Tambang teksi bagi perjalanan ${x1} km ialah RM${y1} dan bagi perjalanan ${x2} km ialah RM${y2}.`, askC: 'Berapakah caj permulaan tambang teksi itu?' },
  { nm: 'simpanan', Y: 'S', X: 'n', yv: v => `RM${v}`, xu: 'minggu', sg: 1, mR: [5, 20], cR: [20, 80], d: (m, c) => `Simpanan Aina, RMS, selepas n minggu diberi oleh S = ${m}n + ${c}.`, mm: m => `simpanan bertambah RM${m} setiap minggu`, cm: c => `simpanan awal sebanyak RM${c}`, defs: 'S ialah simpanan (RM) dan n ialah bilangan minggu', ay: x => `Berapakah simpanan Aina selepas ${x} minggu?`, ax: y => `Selepas berapa minggukah simpanan Aina menjadi RM${y}?`, dat: (x1, y1, x2, y2) => `Simpanan Aina selepas ${x1} minggu ialah RM${y1} dan selepas ${x2} minggu ialah RM${y2}.`, askC: 'Berapakah simpanan awal Aina?' },
  { nm: 'tinggi pokok', Y: 'h', X: 'w', yv: v => `${v} cm`, xu: 'minggu', sg: 1, mR: [2, 5], cR: [5, 20], d: (m, c) => `Tinggi sepohon anak pokok, h cm, selepas w minggu diberi oleh h = ${m}w + ${c}.`, mm: m => `pokok itu bertambah tinggi ${m} cm setiap minggu`, cm: c => `tinggi asal pokok itu ${c} cm`, defs: 'h ialah tinggi pokok (cm) dan w ialah bilangan minggu', ay: x => `Berapakah tinggi pokok itu selepas ${x} minggu?`, ax: y => `Selepas berapa minggukah tinggi pokok itu ${y} cm?`, dat: (x1, y1, x2, y2) => `Tinggi sepohon anak pokok selepas ${x1} minggu ialah ${y1} cm dan selepas ${x2} minggu ialah ${y2} cm.`, askC: 'Berapakah tinggi asal anak pokok itu?' },
  { nm: 'lilin', Y: 'H', X: 't', yv: v => `${v} cm`, xu: 'jam', sg: -1, mR: [2, 4], cR: [20, 30], d: (m, c) => `Panjang sebatang lilin yang menyala, H cm, selepas t jam diberi oleh H = ${c} − ${m}t.`, mm: m => `panjang lilin berkurang ${m} cm setiap jam`, cm: c => `panjang asal lilin itu ${c} cm`, defs: 'H ialah panjang lilin (cm) dan t ialah masa (jam)', ay: x => `Berapakah panjang lilin itu selepas ${x} jam?`, ax: y => `Selepas berapa jamkah panjang lilin itu tinggal ${y} cm?`, dat: (x1, y1, x2, y2) => `Sebatang lilin dinyalakan. Panjangnya selepas ${x1} jam ialah ${y1} cm dan selepas ${x2} jam ialah ${y2} cm.`, askC: 'Berapakah panjang asal lilin itu?' },
  { nm: 'tangki air', Y: 'V', X: 't', yv: v => `${v} liter`, xu: 'minit', sg: -1, mR: [3, 10], cR: [60, 150], d: (m, c) => `Isi padu air dalam sebuah tangki, V liter, selepas t minit air dialirkan keluar diberi oleh V = ${c} − ${m}t.`, mm: m => `isi padu air berkurang ${m} liter setiap minit`, cm: c => `isi padu awal air ialah ${c} liter`, defs: 'V ialah isi padu air (liter) dan t ialah masa (minit)', ay: x => `Berapakah isi padu air selepas ${x} minit?`, ax: y => `Selepas berapa minitkah isi padu air tinggal ${y} liter?`, dat: (x1, y1, x2, y2) => `Air dialirkan keluar daripada sebuah tangki pada kadar tetap. Isi padu air selepas ${x1} minit ialah ${y1} liter dan selepas ${x2} minit ialah ${y2} liter.`, askC: 'Berapakah isi padu awal air dalam tangki itu?' }
];
function glCtx(r) {
  const C = r.p(GLCTX); let m, c; do { m = r.i(C.mR[0], C.mR[1]); c = r.i(C.cR[0], C.cR[1]); if (C.cR[1] >= 20) c = Math.round(c / 5) * 5; } while (C.sg < 0 && c % m !== 0 && r.f() < .7);
  const M = C.sg * m, E = `${C.Y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}`;
  return { C, m, c, M, E, f: x => M * x + c };
}
GL.tafsir = r => {
  const { C, m, c, M, E } = glCtx(r);
  return GEN_LQ('tafsir', { desc: C.d(m, c), X: C.X, Y: C.Y, ms: fmt(M), cs: String(c), mm: C.mm(m), cm: C.cm(c), xu: C.xu, ans: `Kecerunan ${fmt(M)}: ${C.mm(m)}; pintasan-${C.Y} ${c}: ${C.cm(c)}`, work: [`Bandingkan ${E} dengan y = mx + c.`, `m = ${fmt(M)} ialah kadar perubahan ${C.Y} bagi setiap ${C.xu}.`, `c = ${c} ialah nilai ${C.Y} apabila ${C.X} = 0 (nilai awal).`] });
};
GL.kiraNilai = (r, k) => {
  const askY = k == null ? r.f() < .5 : k % 2 === 0;
  let g, x, y; do { g = glCtx(r); x = r.i(2, 12); y = g.f(x); } while (y <= 0);
  const { C, m, c, M, E } = g, rhs = M < 0 ? `${c} − ${m}(${x})` : `${m}(${x}) + ${c}`;
  const ask = askY ? C.ay(x) : C.ax(y);
  const ans = askY ? C.yv(y) : `${x} ${C.xu}`;
  const work = askY ? [`Gantikan ${C.X} = ${x}: ${C.Y} = ${rhs}`, `${C.Y} = ${y}`, ans] : [`Gantikan ${C.Y} = ${y}: ${y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}`, `${m}${C.X} = ${Math.abs(y - c)}`, `${C.X} = ${x}`];
  const fill = askY ? `Apabila ${C.X} = ${x}, ${C.Y} = ${rhs} = ___` : `Apabila ${C.Y} = ${y}, ${y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}, maka ${C.X} = ___`;
  return GEN_LQ('kiraNilai', { desc: C.d(m, c), eqT: E, defs: C.defs, ask, fill, ans, work });
};
GL.bentukPers = r => {
  let g, x1, x2, x3; do { g = glCtx(r); x1 = r.i(1, 4); x2 = x1 + r.i(2, 5); x3 = x2 + r.i(1, 4); } while (g.f(x3) <= 0);
  const { C, m, c, M, E } = g, y1 = g.f(x1), y2 = g.f(x2), y3 = g.f(x3);
  const ask3 = `Cari nilai ${C.Y} apabila ${C.X} = ${x3}.`;
  const w = [`m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${fmt(y2 - y1)}/${x2 - x1} = ${fmt(M)}`, `${y1} = ${fmt(M)}(${x1}) + c → c = ${c}`, E];
  return GEN_LQ('bentukPers', { data: C.dat(x1, y1, x2, y2), X: C.X, Y: C.Y, x3, ask3, E, askC: C.askC, cAns: C.yv(c), ans: `(a) ${E} (b) ${C.Y} = ${y3}`, work: w, w3: w.concat([`${C.Y} = ${fmt(M)}(${x3}) + ${c} = ${y3}`]) });
};
const GLPLAN = [
  { nm: 'gim', xu: 'kunjungan', X: 'n', a: (f, p) => `Gim A mengenakan yuran keahlian RM${f} dan RM${p} bagi setiap kunjungan.`, b: q => `Gim B mengenakan RM${q} bagi setiap kunjungan tanpa yuran keahlian.` },
  { nm: 'kedai cetak', xu: 'keping', X: 'n', a: (f, p) => `Kedai A mengenakan caj reka bentuk RM${f} dan RM${p} bagi setiap keping baju yang dicetak.`, b: q => `Kedai B mengenakan RM${q} bagi setiap keping baju tanpa caj reka bentuk.` },
  { nm: 'sewa kereta', xu: 'hari', X: 'h', a: (f, p) => `Syarikat A mengenakan deposit tidak dipulangkan RM${f} dan RM${p} sehari untuk sewa kereta.`, b: q => `Syarikat B mengenakan RM${q} sehari tanpa deposit.` }
];
function glPlanData(r) {
  const Pn = r.p(GLPLAN); let p, q, n0; do { p = r.i(3, 12) * (Pn.nm === 'sewa kereta' ? 10 : 1); q = p + r.i(2, 6) * (Pn.nm === 'sewa kereta' ? 10 : 1); n0 = r.i(4, 12); } while (false);
  const f = (q - p) * n0, K0 = q * n0;
  return { Pn, p, q, f, n0, K0, desc: `${Pn.a(f, p)} ${Pn.b(q)}` };
}
GL.bandingPelan = r => {
  const d = glPlanData(r), { Pn, p, q, f, n0, K0 } = d, xq = n0 + r.p([-3, -2, 2, 3, 4]);
  const A = p * xq + f, B = q * xq, murah = A < B ? 'A' : 'B';
  const w = [`A: K = ${p}${Pn.X} + ${f}`, `B: K = ${q}${Pn.X}`, `Sama kos: ${q}${Pn.X} = ${p}${Pn.X} + ${f} → ${q - p}${Pn.X} = ${f} → ${Pn.X} = ${n0}`, `K = ${q} × ${n0} = RM${K0}`];
  return GEN_LQ('bandingPelan', { desc: d.desc, xu: Pn.xu, xq, ansQ: `Pilihan ${murah} (A: RM${A}, B: RM${B})`, wQ: [`A: K = ${p}(${xq}) + ${f} = RM${A}`, `B: K = ${q}(${xq}) = RM${B}`, `Pilihan ${murah} lebih murah.`], ansT: `(${n0}, ${K0}): kos kedua-dua pilihan sama, iaitu RM${K0} bagi ${n0} ${Pn.xu}`, ans: `${n0} ${Pn.xu} (kos RM${K0})`, work: w });
};
GL.k117 = r => {
  // (a) lilin / tangki: dua data -> persamaan, bila habis
  const Cs = GLCTX.filter(c => c.sg < 0), C = r.p(Cs); let m, c, x1, x2; do { m = r.i(C.mR[0], C.mR[1]); c = m * r.i(6, 15); x1 = r.i(1, 3); x2 = x1 + r.i(2, 4); } while (c < C.cR[0] - 10 || c > C.cR[1] + 30);
  const y1 = c - m * x1, y2 = c - m * x2, T0 = c / m, E = `${C.Y} = ${c} − ${m}${C.X}`;
  const a = { q: `${C.dat(x1, y1, x2, y2)} Hubungan antara ${C.Y} dan ${C.X} ialah linear. (a) Tulis persamaan ${C.Y} dalam sebutan ${C.X}. (b) Nyatakan maksud kecerunan. (c) Selepas berapa ${C.xu}kah ${C.nm === 'lilin' ? 'lilin itu habis terbakar' : 'tangki itu kosong'}?`, ans: `(a) ${E} (b) ${C.mm(m)} (c) ${T0} ${C.xu}`, work: [`m = (${y2} − ${y1}) / (${x2} − ${x1}) = −${m}`, `${y1} = −${m}(${x1}) + c → c = ${c}`, `(a) ${E}`, `(b) Kecerunan −${m}: ${C.mm(m)}`, `(c) ${C.Y} = 0: ${m}${C.X} = ${c} → ${C.X} = ${T0}`] };
  // (b) banding pelan + keputusan
  const d = glPlanData(r), lo = Math.max(1, d.n0 - r.i(2, 3)), hi = d.n0 + r.i(2, 4);
  const b = { q: `${d.desc} (a) Tulis persamaan jumlah bayaran, RMK, bagi setiap pilihan dalam sebutan ${d.Pn.X}, bilangan ${d.Pn.xu}. (b) Cari nilai ${d.Pn.X} apabila jumlah bayaran kedua-dua pilihan adalah sama. (c) Pilihan manakah lebih murah bagi ${lo} ${d.Pn.xu} dan bagi ${hi} ${d.Pn.xu}?`, ans: `(a) A: K = ${d.p}${d.Pn.X} + ${d.f}, B: K = ${d.q}${d.Pn.X} (b) ${d.n0} (c) ${lo} ${d.Pn.xu}: B; ${hi} ${d.Pn.xu}: A`, work: [`(a) A: K = ${d.p}${d.Pn.X} + ${d.f}; B: K = ${d.q}${d.Pn.X}`, `(b) ${d.q}${d.Pn.X} = ${d.p}${d.Pn.X} + ${d.f} → ${d.Pn.X} = ${d.n0}`, `(c) ${lo}: A = RM${d.p * lo + d.f}, B = RM${d.q * lo} → B lebih murah`, `${hi}: A = RM${d.p * hi + d.f}, B = RM${d.q * hi} → A lebih murah`] };
  // (c) dua lilin: sama panjang
  let L1, r1, L2, r2, t0; do { L1 = r.i(20, 30); r1 = r.i(2, 4); r2 = r1 + r.i(1, 3); t0 = r.i(2, 5); L2 = L1 + (r2 - r1) * t0; } while (L2 - r2 * t0 <= 0 || L1 === L2);
  const H0 = L1 - r1 * t0;
  const c3 = { q: `Lilin P sepanjang ${L1} cm terbakar ${r1} cm setiap jam. Lilin Q sepanjang ${L2} cm terbakar ${r2} cm setiap jam. Kedua-dua lilin dinyalakan serentak. (a) Tulis persamaan panjang, H cm, bagi setiap lilin selepas t jam. (b) Selepas berapa jamkah kedua-dua lilin sama panjang? (c) Berapakah panjang itu?`, ans: `(a) P: H = ${L1} − ${r1}t, Q: H = ${L2} − ${r2}t (b) ${t0} jam (c) ${H0} cm`, work: [`(a) P: H = ${L1} − ${r1}t; Q: H = ${L2} − ${r2}t`, `(b) ${L1} − ${r1}t = ${L2} − ${r2}t → ${r2 - r1}t = ${L2 - L1} → t = ${t0}`, `(c) H = ${L1} − ${r1}(${t0}) = ${H0} cm`] };
  return GEN_LQ('k117', { a, b, c: c3 });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '9.1.1': { m: [() => GL.mcBaca(glRG), () => GL.mcTulis(glRG), () => GL.mcMendatar(glRG)], s: [() => GL.mcSusun(glRG), () => GL.mcRajah(glRG)], k: [() => GL.k111(glRG)] },
  '9.1.2': { m: [() => GL.amKeMxc(glRG), () => GL.pinBentuk(glRG), () => GL.amPintasan(glRG)], s: [() => GL.keBentukAm(glRG), () => GL.keBentukPin(glRG)], k: [() => GL.k112(glRG)] },
  '9.1.3': { m: [() => GL.semakTitik(glRG), () => GL.cariKoord(glRG)], s: [() => GL.cariKoordAm(glRG), () => GL.cariPemalar(glRG)], k: [() => GL.k113(glRG)] },
  '9.1.4': { m: [() => GL.selariYT(glRG), () => GL.kecSelari(glRG)], s: [() => GL.cariKSelari(glRG), () => GL.persSelari(glRG)], k: [() => GL.k114(glRG)] },
  '9.1.5': { m: [() => GL.persMTitik(glRG), () => GL.persDuaTitik(glRG, false), () => GL.persPintasan(glRG)], s: [() => GL.persDuaTitik(glRG, true), () => GL.persRajah(glRG)], k: [() => GL.k115(glRG)] },
  '9.1.6': { m: [() => GL.silangMudah(glRG), () => GL.silangGanti(glRG), () => GL.silangRajah(glRG)], s: [() => GL.silangHapus(glRG), () => GL.silangPaksi(glRG)], k: [() => GL.k116(glRG)] },
  '9.1.7': { m: [() => GL.tafsir(glRG), () => GL.kiraNilai(glRG)], s: [() => GL.bentukPers(glRG), () => GL.bandingPelan(glRG)], k: [() => GL.k117(glRG)] }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
WG.mcBaca = () => GL.mcBaca(glRW); WG.mcTulis = () => GL.mcTulis(glRW); WG.mcMendatar = i => GL.mcMendatar(glRW, i);
WG.mcSusun = i => GL.mcSusun(glRW, i); WG.mcRajah = () => GL.mcRajah(glRW); WG.k111 = () => GL.k111(glRW);
WG.amKeMxc = () => GL.amKeMxc(glRW); WG.pinBentuk = () => GL.pinBentuk(glRW); WG.amPintasan = () => GL.amPintasan(glRW);
WG.keBentukAm = () => GL.keBentukAm(glRW); WG.keBentukPin = () => GL.keBentukPin(glRW); WG.k112 = () => GL.k112(glRW);
WG.semakTitik = i => GL.semakTitik(glRW, i); WG.cariKoord = i => GL.cariKoord(glRW, i); WG.cariKoordAm = i => GL.cariKoordAm(glRW, i); WG.cariPemalar = i => GL.cariPemalar(glRW, i); WG.k113 = () => GL.k113(glRW);
WG.selariYT = i => GL.selariYT(glRW, i); WG.kecSelari = () => GL.kecSelari(glRW); WG.cariKSelari = i => GL.cariKSelari(glRW, i); WG.persSelari = () => GL.persSelari(glRW); WG.k114 = () => GL.k114(glRW);
WG.persMTitik = () => GL.persMTitik(glRW); WG.persDuaTitik = () => GL.persDuaTitik(glRW, false); WG.persDuaTitikF = () => GL.persDuaTitik(glRW, true); WG.persPintasan = () => GL.persPintasan(glRW); WG.persRajah = () => GL.persRajah(glRW); WG.k115 = () => GL.k115(glRW);
WG.silangMudah = i => GL.silangMudah(glRW, i); WG.silangGanti = () => GL.silangGanti(glRW); WG.silangRajah = () => GL.silangRajah(glRW); WG.silangHapus = () => GL.silangHapus(glRW); WG.silangPaksi = i => GL.silangPaksi(glRW, i); WG.k116 = () => GL.k116(glRW);
WG.tafsir = () => GL.tafsir(glRW); WG.kiraNilai = i => GL.kiraNilai(glRW, i); WG.bentukPers = () => GL.bentukPers(glRW); WG.bandingPelan = () => GL.bandingPelan(glRW); WG.k117 = () => GL.k117(glRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '9.1.1': [['m', 'mcBaca', 7], ['m', 'mcTulis', 6], ['m', 'mcMendatar', 5], ['s', 'mcSusun', 5], ['s', 'mcRajah', 4], ['k', 'k111', 3]],
  '9.1.2': [['m', 'amKeMxc', 7], ['m', 'pinBentuk', 6], ['m', 'amPintasan', 5], ['s', 'keBentukAm', 5], ['s', 'keBentukPin', 4], ['k', 'k112', 3]],
  '9.1.3': [['m', 'semakTitik', 9], ['m', 'cariKoord', 9], ['s', 'cariKoordAm', 4], ['s', 'cariPemalar', 5], ['k', 'k113', 3]],
  '9.1.4': [['m', 'selariYT', 9], ['m', 'kecSelari', 9], ['s', 'cariKSelari', 4], ['s', 'persSelari', 5], ['k', 'k114', 3]],
  '9.1.5': [['m', 'persMTitik', 6], ['m', 'persDuaTitik', 7], ['m', 'persPintasan', 5], ['s', 'persDuaTitikF', 5], ['s', 'persRajah', 4], ['k', 'k115', 3]],
  '9.1.6': [['m', 'silangMudah', 5], ['m', 'silangGanti', 8], ['m', 'silangRajah', 5], ['s', 'silangHapus', 5], ['s', 'silangPaksi', 4], ['k', 'k116', 3]],
  '9.1.7': [['m', 'tafsir', 9], ['m', 'kiraNilai', 9], ['s', 'bentukPers', 5], ['s', 'bandingPelan', 4], ['k', 'k117', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan unik: jawapan + calon (rentetan), tambah calon ganti jika kurang
function glOpts(ans, cands, more) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c) || /NaN|undefined|Infinity/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = more(k); if (c != null && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const glMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const glDel = k => (k % 2 ? 1 : -1) * Math.ceil(k / 2);
// pilihan persamaan y = mx + c dengan kesilapan biasa
const glEqOpts = (m, c) => glOpts(glEq(m, c), [glEq(m, glNeg(c)), glEq(glNeg(m), c), glEq(c, m), glEq(glNeg(m), glNeg(c)), glEq(m, glAdd(c, 1))], k => glEq(m, glAdd(c, glDel(k) + (glDel(k) >= 0 ? 1 : -1))));
const CQGEN = {
  mxc: [
    () => { const m = glM(glRG, .3), c = nz(-6, 6), asc = Math.random() < .5; const E = glEq(m, c); return asc ? glMcq(`Apakah kecerunan garis lurus <b>${E}</b>?`, glGFig([[0, c, 'pu']], [[m, c, 'am']]), glOpts(glS(m), [fmt(c), glS(glNeg(m)), fmt(-c), glS(glAdd(m, 1))], k => glS(glAdd(m, glDel(k) + 1)))) : glMcq(`Apakah pintasan-y garis lurus <b>${E}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(fmt(c), [glS(m), fmt(-c), glS(glNeg(m)), fmt(c + 1)], k => fmt(c + glDel(k) + 1)), gPt(0, c, 'pu')); },
    () => { if (Math.random() < .35) { const hor = Math.random() < .5, h = nz(-5, 5), k = nz(-5, 5); return glMcq(`Persamaan garis lurus yang melalui ${P(h, k)} dan selari dengan paksi-${hor ? 'x' : 'y'} ialah`, glGFig([[h, k, 'am']], []), glOpts(hor ? `y = ${fmt(k)}` : `x = ${fmt(h)}`, [hor ? `x = ${fmt(h)}` : `y = ${fmt(k)}`, hor ? `y = ${fmt(h)}` : `x = ${fmt(k)}`, `y = ${fmt(k)}x`, `y = ${fmt(h)}x`], kk => `y = ${fmt(k + kk)}`)); }
      const m = glMi(glRG, 4), c = nz(-6, 6); return glMcq(`Garis lurus dengan kecerunan ${glS(m)} dan pintasan-y ${fmt(c)} ialah`, glGFig([[0, c, 'pu']], []), glEqOpts(m, c), glGLine(m, c, 'am')); },
    () => { const m = glMi(glRG, 4), c = nz(-6, 6), K = pick([2, 3]); return glMcq(`Apakah kecerunan garis lurus <b>${K}y = ${glRhs(glMul(m, K), K * c)}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(glS(m), [glS(glMul(m, K)), fmt(c), fmt(K * c), glS(glNeg(m))], k => glS(glAdd(m, glDel(k))))); }
  ],
  bentuk: [
    () => { let a, b, c; do { a = nz(-5, 5); b = pick([1, 2, 3, 4, -2, -3]); c = nz(-12, 12); } while (a === b || glGcd(glGcd(a, b), c) !== 1); const m = glQ(-a, b); return glMcq(`Apakah kecerunan garis lurus <b>${glAm(a, b, c)}</b>?`, glGFig([], [[m, glQ(c, b), 'am']]), glOpts(glS(m), [glS(glQ(a, b)), glS(glQ(b, a)), glS(glQ(-b, a)), glS(glQ(c, b))], k => glS(glAdd(m, glDel(k))))); },
    () => { let a, b; do { a = nz(-6, 6); b = nz(-6, 6); } while (Math.abs(a) < 2 || Math.abs(b) < 2 || a === b); const asx = Math.random() < .5; return glMcq(`Apakah pintasan-${asx ? 'x' : 'y'} bagi garis lurus <b>${glPin(a, b)}</b>?`, glGFig([], [[glQ(-b, a), b, 'am']]), glOpts(fmt(asx ? a : b), [fmt(asx ? b : a), fmt(asx ? -a : -b), '1', glS(glQ(1, asx ? a : b))], k => fmt((asx ? a : b) + glDel(k)))); },
    () => { const d = glPinData(glRG), asx = Math.random() < .5; return glMcq(`Apakah pintasan-${asx ? 'x' : 'y'} bagi garis lurus <b>${d.G}</b>?`, glGFig([], [[glQ(-d.yi, d.xi), d.yi, 'am']]), glOpts(fmt(asx ? d.xi : d.yi), [fmt(asx ? d.yi : d.xi), fmt(asx ? -d.xi : -d.yi), fmt(d.c), fmt(asx ? d.a : d.b)], k => fmt((asx ? d.xi : d.yi) + glDel(k))), gPt(asx ? d.xi : 0, asx ? 0 : d.yi, 'gr')); }
  ],
  titik: [
    () => { const m = nz(-3, 3), c = ri(-3, 3), xs = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 4), on = xs[0]; const pts = xs.map((x, i) => [x, m * x + c + (i ? pick([-1, 1]) : 0)]); const ok = P(...pts[0]); const o = glOpts(ok, pts.slice(1).map(p => P(...p)), k => P(on, m * on + c + glDel(k) * 2)); return glMcq(`Titik manakah terletak pada garis lurus <b>${glEq(m, c)}</b>?`, glGFig([], [[m, c, 'am']]), o, gPt(pts[0][0], pts[0][1], 'gr')); },
    () => { let m, c, x, y; do { m = nz(-4, 4); c = ri(-5, 5); x = nz(-4, 4); y = m * x + c; } while (Math.abs(y) > 12); return glMcq(`Titik (${fmt(x)}, k) terletak pada garis lurus <b>${glEq(m, c)}</b>. Cari nilai k.`, glGFig([], [[m, c, 'am']]), glOpts(`k = ${fmt(y)}`, [`k = ${fmt(m * x - c)}`, `k = ${fmt(-y)}`, `k = ${fmt(m + x + c)}`, `k = ${fmt(y + m)}`], k => `k = ${fmt(y + glDel(k))}`), Math.abs(y) <= 6 ? gPt(x, y, 'gr') : ''); },
    () => { let m, c, x, y; do { m = nz(-4, 4); c = ri(-6, 6); x = nz(-3, 3); y = m * x + c; } while (Math.abs(y) > 12 || m === c); return glMcq(`Garis lurus <b>y = px${glK(c)}</b> melalui titik ${P(x, y)}. Cari nilai p.`, glGFig(Math.abs(y) <= 6 ? [[x, y, 'gr']] : [], []), glOpts(`p = ${fmt(m)}`, [`p = ${fmt(-m)}`, `p = ${glS(glQ(y + c, x))}`, `p = ${glS(glQ(y, x))}`, `p = ${fmt(m + 1)}`], k => `p = ${fmt(m + glDel(k))}`)); }
  ],
  selari: [
    () => { const m = glM(glRG, .4), c = ri(-6, 6), F = glForm(glRG, m, c, pick(['mxc', 'am'])); return glMcq(`Garis lurus PQ selari dengan <b>${F.G}</b>. Apakah kecerunan PQ?`, glGFig([], [[m, c, 'am']]), glOpts(glS(m), [glS(glNeg(m)), glS(glDiv(1, m)), glS(glNeg(glDiv(1, m))), fmt(c)], k => glS(glAdd(m, glDel(k))))); },
    () => { const m = glMi(glRG, 3), c = nz(-5, 5); let c2; do { c2 = ri(-6, 6); } while (c2 === c); const ok = glForm(glRG, m, c2, 'am').G; const w = [glForm(glRG, glNeg(m), c2, 'am').G, glEq(glDiv(1, m), c), glEq(glAdd(m, 1), c2), glForm(glRG, glDiv(-1, m), c2, 'am').G]; return glMcq(`Persamaan manakah mewakili garis lurus yang <b>selari</b> dengan <b>${glEq(m, c)}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(ok, w, k => glEq(glAdd(m, glDel(k) + 1), c2)), glGLine(m, c2, 'gr')); },
    () => { const m = nz(-4, 4), b = pick([2, 3, -2]), c = nz(-6, 6); return glMcq(`Garis lurus <b>kx ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(b * c)}</b> selari dengan <b>${glEq(m, c + 1)}</b>. Cari nilai k.`, glGFig([], [[m, c + 1, 'am']]), glOpts(`k = ${fmt(-m * b)}`, [`k = ${fmt(m * b)}`, `k = ${fmt(m)}`, `k = ${fmt(-m)}`, `k = ${glS(glQ(m, b))}`], k => `k = ${fmt(-m * b + glDel(k))}`)); }
  ],
  persamaan: [
    () => { let m, x, y, c; do { m = glMi(glRG, 4); x = nz(-3, 3); y = ri(-5, 5); c = glSub(y, glMul(m, x)); } while (Math.abs(glV(c)) > 8); return glMcq(`Persamaan garis lurus dengan kecerunan ${glS(m)} yang melalui ${P(x, y)} ialah`, glGFig([[x, y, 'gr']], []), glOpts(glEq(m, c), [glEq(m, glAdd(y, glMul(m, x))), glEq(m, y), glEq(glNeg(m), c), glEq(m, glNeg(c))], k => glEq(m, glAdd(c, glDel(k))))); },
    () => { let x1, y1, x2, y2, m, c; do { x1 = ri(-4, 4); y1 = ri(-5, 5); x2 = ri(-4, 4); y2 = ri(-5, 5); m = x1 === x2 ? [0, 1] : glQ(y2 - y1, x2 - x1); c = glSub(y1, glMul(m, x1)); } while (x1 === x2 || y1 === y2 || !glIsInt(m) || Math.abs(glV(c)) > 8); return glMcq(`Persamaan garis lurus yang melalui ${P(x1, y1)} dan ${P(x2, y2)} ialah`, glGFig([[x1, y1, 'am'], [x2, y2, 'pk']], []), glEqOpts(m, c), glGLine(m, c, 'am')); },
    () => { let x1, y1, x2, y2, m, c; do { x1 = ri(-5, 5); y1 = ri(-5, 5); x2 = ri(-5, 5); y2 = ri(-5, 5); m = x1 === x2 ? [0, 1] : glQ(y2 - y1, x2 - x1); c = glSub(y1, glMul(m, x1)); } while (x1 === x2 || y1 === y2 || glR(m)[1] > 2 || !glIsInt(c) || Math.abs(glV(c)) > 6); return glMcq('Berdasarkan rajah, apakah persamaan garis lurus ini?', glGFig([[x1, y1, 'am'], [x2, y2, 'am']], [[m, c, 'am']]), glEqOpts(m, c)); }
  ],
  silang: [
    () => { let m, c, x0, y0; do { m = nz(-3, 3); c = ri(-4, 4); x0 = nz(-4, 4); y0 = m * x0 + c; } while (Math.abs(y0) > 6); return glMcq(`Titik persilangan garis lurus <b>${glEq(m, c)}</b> dan <b>x = ${fmt(x0)}</b> ialah`, gSvg(GLR, glGLine(m, c, 'am') + gLine([x0, -GLR], [x0, GLR], 'pk', .13), 'Dua garis lurus'), glOpts(P(x0, y0), [P(y0, x0), P(x0, -y0), P(x0, c), P(0, y0)], k => P(x0, y0 + glDel(k))), gPt(x0, y0, 'gr')); },
    () => { let d; do { d = glDuaGaris(glRG, false); } while (Math.abs(d.x0) > 5 || Math.abs(d.y0) > 5); return glMcq(`Titik persilangan garis lurus <b>${glEq(d.m1, d.c1)}</b> dan <b>${glEq(d.m2, d.c2)}</b> ialah`, glGFig([], [[d.m1, d.c1, 'tr'], [d.m2, d.c2, 'pk']]), glOpts(P(d.x0, d.y0), [P(d.y0, d.x0), P(-d.x0, d.y0), P(d.x0, -d.y0), P(0, glV(d.c1))], k => P(d.x0 + glDel(k), d.y0)), gPt(d.x0, d.y0, 'gr')); },
    () => { let d; do { d = glDuaGaris(glRG, false); } while (Math.abs(d.x0) > 4 || Math.abs(d.y0) > 4 || Math.abs(glV(d.m1)) > 3 || Math.abs(glV(d.m2)) > 3); return glMcq('Berdasarkan rajah, apakah koordinat titik persilangan dua garis lurus ini?', glGFig([], [[d.m1, d.c1, 'tr'], [d.m2, d.c2, 'pk']]), glOpts(P(d.x0, d.y0), [P(d.y0, d.x0), P(d.x0 + 1, d.y0), P(d.x0, d.y0 - 1), P(-d.x0, -d.y0)], k => P(d.x0 - glDel(k), d.y0 + 1)), gPt(d.x0, d.y0, 'gr')); }
  ],
  masalah: [
    () => { const g = glCtx(glRG), x = ri(2, 8), y = g.f(x); return glMcq(`${g.C.d(g.m, g.c)} ${g.C.ay(x)}`, '', glOpts(g.C.yv(y), [g.C.yv(g.m * x), g.C.yv(g.c + g.m), g.C.yv(g.M * x - g.c), g.C.yv(y + g.m)].map(s => (/−/.test(s) ? null : s)), k => g.C.yv(y + glDel(k) * 2))); },
    () => { const g = glCtx(glRG); return glMcq(`${g.C.d(g.m, g.c)} Apakah maksud nilai <b>${g.c}</b>?`, '', glOpts(g.C.cm(g.c), [g.C.mm(g.m), `jumlah selepas ${g.c} ${g.C.xu}`, `kadar perubahan ${g.c} bagi setiap ${g.C.xu}`], k => `nilai selepas ${k} ${g.C.xu}`)); },
    () => { const d = glPlanData(glRG); return glMcq(`${d.desc} Selepas berapa ${d.Pn.xu} jumlah bayaran kedua-dua pilihan sama?`, '', glOpts(String(d.n0), [String(d.n0 + 1), String(d.n0 - 1), String(Math.round(d.f / d.p)), String(Math.round(d.f / d.q))].filter(s => +s > 0), k => String(d.n0 + glDel(k) * 2))); }
  ]
};
const CQT = { mxc: 'y = mx + c', bentuk: 'Bentuk persamaan', titik: 'Titik pada garis', selari: 'Garis selari', persamaan: 'Cari persamaan', silang: 'Titik persilangan', masalah: 'Penyelesaian masalah' };
function glCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.mxc;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['mxc', 'mxc', 'bentuk', 'titik', 'selari', 'persamaan', 'silang'] : Object.keys(CQT);
  return glCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return glCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
