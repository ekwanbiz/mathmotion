'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_garislurus_en.py; jangan sunting dengan tangan. */
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
const glS = a => { a = glR(a); if (a[1] === 1) return fmt(a[0]); return (a[0] < 0 ? '−' : '') + fr(Math.abs(a[0]), a[1]); };
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
const glFv = (v, a) => fr(v, typeof a === 'number' ? fmt(a) : a);
// teks langkah: (A) / (B), a/b → pecahan bertingkat (25 Nov). Bukan untuk rajah (fig).
const GLFXOP = String.raw`\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-z]+`;
const GLFXRE = new RegExp(String.raw`(?<![\w.>])(${GLFXOP})( ?)\/\2(${GLFXOP})(?!\w)`);
const glUnP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function glFx(s) {
  if (typeof s !== 'string') return s;
  s = s.replace(/[½⅓⅔¼¾]/g, c => ({ '½': fr(1, 2), '⅓': fr(1, 3), '⅔': fr(2, 3), '¼': fr(1, 4), '¾': fr(3, 4) }[c]));
  if (!s.includes('/')) return s;
  for (let k = 0; k < 20; k++) {
    const m = s.match(GLFXRE); if (!m) break;
    if (/^[A-Za-z]{3,}$/.test(m[1]) || /^[A-Za-z]{3,}$/.test(m[3])) break;
    s = s.slice(0, m.index) + fr(glUnP(m[1]), glUnP(m[3])) + s.slice(m.index + m[0].length);
  }
  return s;
}
function glFxO(o) {
  if (typeof o === 'string') return glFx(o);
  if (Array.isArray(o)) return o.map(glFxO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig/i.test(k) && k !== 'type') o[k] = glFxO(o[k]);
  return o;
}
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
  return plot(Object.assign({}, b, { items, label: o.label || 'Cartesian plane' }));
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
const glGFig = (pts, lines, label) => gSvg(GLR, (lines || []).map(([m, c, col]) => glGLine(m, c, col || 'am')).join('') + (pts || []).map(([x, y, c, l]) => gPt(x, y, c, l)).join(''), label || 'Cartesian plane');

/* =================== jalan kerja bersama =================== */
// tukar ax + by = c kepada y = mx + c
function glWAm(a, b, c) {
  const m = glQ(-a, b), k = glQ(c, b), w = [];
  w.push(`${glCo(b, 'y')} = ${glRhs(-a, c)}`);
  if (b !== 1) w.push(`Divide each term by ${glPr(b)}: ${glEq(m, k)}`);
  return { m, c: k, w };
}
// cari c daripada m dan titik
const glWc = (m, x, y) => { const c = glSub(y, glMul(m, x)); return { c, w: [`Substitute ${glPt(x, y)} into y = ${glCo(m)} + c: ${glS(y)} = ${glS(m)}(${glS(x)}) + c`.replace(/= (−?)1\(/, '= $1('), `c = ${glS(y)} − ${glPr(glMul(m, x))} = ${glS(c)}`] }; };
const glW2 = (x1, y1, x2, y2) => { const m = glQ(y2 - y1, x2 - x1); return { m, w: [`m = (${fmt(y2)} − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ${fmt(y2 - y1)}/${par(x2 - x1)} = ${glS(m)}`] }; };

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 9.1.1 Persamaan y = mx + c ---------- */
  mcBaca: [
    ({ E }) => ({ q: `State the gradient and the y-intercept of the straight line ${E}.` }),
    ({ E, L }) => ({ q: `The straight line ${L} has the equation ${E}. What are the gradient and the y-intercept of the straight line?` }),
    ({ E }) => ({ q: `For the straight line ${E}, write the value of m and the value of c.` }),
    ({ E, ms, cs, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says the straight line ${E} has a gradient of ${cs} and a y-intercept of ${ms}. Is ${N} correct?` }, salah(N, ans, `${N} swapped m and c. The gradient is the coefficient of x, while the y-intercept is the constant.`)); },
    ({ E }) => ({ q: `Complete: For the straight line ${E}, gradient = ___ and y-intercept = ___` })
  ],
  mcTulis: [
    ({ ms, cs }) => ({ q: `Write the equation of the straight line that has a gradient of ${ms} and a y-intercept of ${cs}.` }),
    ({ ms, cs }) => ({ q: `A straight line cuts the y-axis at point (0, ${cs}) and its gradient is ${ms}. Write the equation of the straight line.` }),
    ({ ms, cs, L }) => ({ q: `The straight line ${L} has a y-intercept of ${cs} and a gradient of ${ms}. State the equation of ${L} in the form y = mx + c.` }),
    ({ ms, cs, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} writes the equation of the straight line with a gradient of ${ms} and a y-intercept of ${cs} as ${wrong}. Is ${N} correct?` }, salah(N, ans, `In y = mx + c, the gradient m is the coefficient of x and the y-intercept c is the constant.`)); }
  ],
  mcMendatar: [
    ({ pt, ax }) => ({ q: `Write the equation of the straight line that passes through point ${pt} and is parallel to the ${ax}-axis.` }),
    ({ pt, L, jenis }) => ({ q: `The straight line ${L} is ${jenis} and passes through point ${pt}. State the equation of ${L}.` }),
    ({ pt, pt2, L }) => ({ q: `The straight line ${L} passes through points ${pt} and ${pt2}. Write the equation of ${L}.` }),
    ({ E2, ansM, wM }) => ({ q: `State the gradient of the straight line ${E2}.`, ans: ansM, work: wM })
  ],
  mcSusun: [
    ({ G }) => ({ q: `State the gradient and the y-intercept of the straight line ${G}.` }),
    ({ G, E, ans }) => ({ q: `Write ${G} in the form y = mx + c. Hence, state the value of m and the value of c.`, ans: `${E}; ${ans}` }),
    ({ G, L }) => ({ q: `The straight line ${L} has the equation ${G}. Find the gradient and the y-intercept of ${L}.` }),
    ({ G, claim, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says ${claim} for the straight line ${G}. Is ${N} correct?` }, salah(N, ans, why)); }
  ],
  mcRajah: [
    ({ L }) => ({ q: `The diagram below shows the straight line ${L} on a Cartesian plane. Write the equation of ${L} in the form y = mx + c.` }),
    ({ cs, ms, E }) => ({ q: 'Based on the diagram below, state the y-intercept and calculate the gradient of the straight line. Hence, write its equation.', ans: `c = ${cs}, m = ${ms}; ${E}` }),
    () => ({ q: 'The straight line in the diagram below passes through the two marked points. What is the equation of the straight line?' }),
    () => ({ q: 'A straight bicycle path is drawn on a grid map as shown in the diagram below. Determine the equation of the path.' })
  ],
  k111: [
    ({ a }) => ({ q: `The straight line y = (k + ${a.a})x + ${a.k2 ? '2k' : 'k'} has a gradient of ${fmt(a.m)}. (a) Find the value of k. (b) Write the equation of the straight line. (c) Find the x-intercept of the straight line.`, ans: `(a) k = ${fmt(a.k)} (b) ${a.E} (c) ${glS(a.xi)}`, work: [`(a) The gradient is the coefficient of x: k + ${a.a} = ${fmt(a.m)}, thus k = ${fmt(a.k)}`, `(b) y-intercept = ${a.k2 ? `2k = 2(${fmt(a.k)}) = ${fmt(a.c)}` : `k = ${fmt(a.c)}`}, thus ${a.E}`, `(c) x-intercept: substitute y = 0 → 0 = ${glRhs(a.m, a.c)} → x = ${glS(a.xi)}`] }),
    ({ b }) => ({ q: `The straight line PQ passes through P(0, ${fmt(b.c)}) and Q${P(b.x2, b.y2)}. (a) Write the equation of PQ. (b) Find the x-intercept of PQ. (c) Determine whether point R${P(b.rx, b.ry)} lies on PQ.`, ans: `(a) ${b.E} (b) ${glS(b.xi)} (c) ${b.on ? 'Ya' : 'No'}`, work: [`(a) c = ${fmt(b.c)} (point P is on the y-axis); m = (${fmt(b.y2)} − ${par(b.c)}) / ${par(b.x2)} = ${glS(b.m)}, thus ${b.E}`, `(b) 0 = ${glRhs(b.m, b.c)} → x = ${glS(b.xi)}`, `(c) When x = ${fmt(b.rx)}, y = ${glS(b.yr)} ${b.on ? '=' : '≠'} ${fmt(b.ry)}, thus R ${b.on ? 'lies' : 'does not lie'} on PQ.`] }),
    ({ c }) => ({ q: `A straight line has an x-intercept of ${fmt(c.xi)} and a y-intercept of ${fmt(c.yi)}. (a) Find the gradient of the straight line. (b) Write its equation in the form y = mx + c. (c) Find the value of y when x = ${fmt(c.x3)}.`, ans: `(a) ${glS(c.m)} (b) ${c.E} (c) ${glS(c.y3)}`, work: [`(a) m = −(y-intercept) / (x-intercept) = −(${fmt(c.yi)}) / ${par(c.xi)} = ${glS(c.m)}`, `(b) c = y-intercept = ${fmt(c.yi)}, thus ${c.E}`, `(c) y = ${glS(c.m)}(${fmt(c.x3)})${glK(c.yi)} = ${glS(c.y3)}`] })
  ],

  /* ---------- 9.1.2 Bentuk lain persamaan ---------- */
  amKeMxc: [
    ({ G }) => ({ q: `Convert the equation of the straight line ${G} to the form y = mx + c. Hence, state the gradient and the y-intercept.` }),
    ({ G, mc }) => ({ q: `Find the gradient and the y-intercept of the straight line ${G}.`, ans: mc }),
    ({ G, wm, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says the gradient of the straight line ${G} is ${wm}. Is ${N} correct?` }, salah(N, ans, `${N} forgot the negative sign. For ax + by = c, the gradient m = −a/b.`)); },
    ({ G, L, E }) => ({ q: `The straight line ${L} is represented by the equation ${G}. Write the equation of ${L} in the gradient-intercept form, y = mx + c.`, ans: E })
  ],
  pinBentuk: [
    ({ G, a, b }) => ({ q: `State the x-intercept and the y-intercept of the straight line ${G}.`, ans: `x-intercept = ${fmt(a)}, y-intercept = ${fmt(b)}` }),
    ({ G, a, b }) => ({ q: `The straight line ${G} cuts the x-axis at point A and the y-axis at point B. State the coordinates of A and B.`, ans: `A${P(a, 0)}, B${P(0, b)}` }),
    ({ G, a, b, m }) => ({ q: `Find the gradient of the straight line ${G}.`, ans: `m = ${glS(m)}`, work: [`x-intercept = ${fmt(a)}, y-intercept = ${fmt(b)}`, `m = −(y-intercept) / (x-intercept) = −(${fmt(b)}) / ${par(a)} = ${glS(m)}`] }),
    ({ G, a, b, m, E }) => ({ q: `Write the equation of the straight line ${G} in the form y = mx + c.`, ans: E, work: [`x-intercept = ${fmt(a)}, y-intercept = ${fmt(b)}, thus c = ${fmt(b)}`, `m = −(${fmt(b)}) / ${par(a)} = ${glS(m)}`, E] })
  ],
  amPintasan: [
    ({ G }) => ({ q: `Find the x-intercept and the y-intercept of the straight line ${G}.` }),
    ({ G, xi, yi }) => ({ q: `The straight line ${G} intersects the x-axis and the y-axis. Find the coordinates of the points of intersection.`, ans: `${P(xi, 0)} and ${P(0, yi)}` }),
    ({ G, xi, yi }) => ({ q: `Complete: For the straight line ${G}, when y = 0, x = ___; when x = 0, y = ___`, ans: `x = ${fmt(xi)}; y = ${fmt(yi)}` })
  ],
  keBentukAm: [
    ({ E }) => ({ q: `Write the equation ${E} in the form ax + by = c, where a, b and c are integers and a > 0.` }),
    ({ E }) => ({ q: `Express the straight line ${E} in the general form, ax + by = c, where a > 0 and a, b, c are integers.` }),
    ({ E }) => ({ q: `Complete with integers (positive coefficient of x): ${E} can be written as ___x + ___y = ___` })
  ],
  keBentukPin: [
    ({ G }) => ({ q: `Write the equation of the straight line ${G} in the form ${glFv('x', 'a')} + ${glFv('y', 'b')} = 1.` }),
    ({ G, ans, xi, yi }) => ({ q: `Express the straight line ${G} in the intercept form. Hence, state the x-intercept and the y-intercept.`, ans: `${ans}; x-intercept = ${fmt(xi)}, y-intercept = ${fmt(yi)}` }),
    ({ E }) => ({ q: `Write the equation of the straight line ${E} in the form ${glFv('x', 'a')} + ${glFv('y', 'b')} = 1.` })
  ],
  k112: [
    ({ a }) => ({ q: `The straight line hx + ${a.b === 1 ? '' : a.b}y = ${fmt(a.c)} has a gradient of ${fmt(a.m)}. Find (a) the value of h, (b) the x-intercept of the straight line, (c) the y-intercept of the straight line.`, ans: `(a) h = ${fmt(a.h)} (b) ${glS(a.xi)} (c) ${glS(a.yi)}`, work: [`(a) Gradient = −h/${a.b} = ${fmt(a.m)}, thus h = ${fmt(a.h)}`, `(b) Substitute y = 0: ${fmt(a.h)}x = ${fmt(a.c)} → x = ${glS(a.xi)}`, `(c) Substitute x = 0: ${a.b}y = ${fmt(a.c)} → y = ${glS(a.yi)}`] }),
    ({ b }) => ({ q: `The straight line ${glFv('x', 'a')} + ${glFv('y', b.b)} = 1 passes through point ${P(b.x0, b.y0)}. Find the value of a and the gradient of the straight line.`, ans: `a = ${fmt(b.a)}, m = ${glS(b.m)}`, work: [`Substitute ${P(b.x0, b.y0)}: ${glFv(fmt(b.x0), 'a')} + ${glFv(fmt(b.y0), b.b)} = 1`, `${glFv(fmt(b.x0), 'a')} = 1 − ${glPr(glQ(b.y0, b.b))} = ${glS(b.t)}`, `a = ${fmt(b.a)}`, `m = −(${fmt(b.b)}) / ${par(b.a)} = ${glS(b.m)}`] }),
    ({ c }) => ({ q: `The straight line ${c.a === 1 ? '' : c.a}x + ky = ${c.c} has a y-intercept of ${fmt(c.yi)}. Find (a) the value of k, (b) the gradient of the straight line, (c) the x-intercept.`, ans: `(a) k = ${fmt(c.k)} (b) ${glS(c.m)} (c) ${glS(c.xi)}`, work: [`(a) y-intercept ${fmt(c.yi)}: substitute (0, ${fmt(c.yi)}) → k(${fmt(c.yi)}) = ${c.c}, thus k = ${fmt(c.k)}`, `(b) m = −a/b = −${c.a}/${par(c.k)} = ${glS(c.m)}`, `(c) Substitute y = 0: ${c.a === 1 ? '' : c.a}x = ${c.c} → x = ${glS(c.xi)}`] })
  ],

  /* ---------- 9.1.3 Titik pada garis lurus ---------- */
  semakTitik: [
    ({ pt, G }) => ({ q: `Determine whether point ${pt} lies on the straight line ${G}.` }),
    ({ pt, G, L }) => ({ q: `Does point ${L}${pt} lie on the straight line ${G}? Show your working.` }),
    ({ G, A, B, pA, pB, onN, w2 }) => ({ q: `Between points ${A}${pA} and ${B}${pB}, which point lies on the straight line ${G}?`, ans: `Point ${onN}`, work: w2 }),
    ({ pt, G, on, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says point ${pt} ${on ? 'does not lie' : 'lies'} on the straight line ${G}. Is ${N} correct?` }, salah(N, ans, 'Substitute both coordinates into the equation and compare both sides.')); }
  ],
  cariKoord: [
    ({ pt, G, v }) => ({ q: `Point ${pt} lies on the straight line ${G}. Find the value of ${v}.` }),
    ({ pt, G, v }) => ({ q: `The straight line ${G} passes through point ${pt}. Find the value of ${v}.` }),
    ({ pt, G, v }) => ({ q: `Complete: Point ${pt} lies on the straight line ${G}, thus ${v} = ___` }),
    ({ pt, G, v }) => ({ q: `An ant crawls along the straight line ${G} on a Cartesian plane. The ant reaches point ${pt}. Find the value of ${v}.` })
  ],
  cariKoordAm: [
    ({ pt, G, v }) => ({ q: `Point ${pt} lies on the straight line ${G}. Calculate the value of ${v}.` }),
    ({ pt, G, v }) => ({ q: `Given that the straight line ${G} passes through point ${pt}, find the value of ${v}.` }),
    ({ pt, G, v, L }) => ({ q: `Point ${L}${pt} is on the straight line ${G}. What is the value of ${v}?` })
  ],
  cariPemalar: [
    ({ pt, G, v }) => ({ q: `The straight line ${G} passes through point ${pt}. Find the value of ${v}.` }),
    ({ pt, G, v }) => ({ q: `Given that point ${pt} lies on the straight line ${G}, calculate the value of ${v}.` }),
    ({ pt, G, v, ans, E }) => ({ q: `Point ${pt} lies on the straight line ${G}. Find the value of ${v}, hence write the equation of the straight line.`, ans: `${ans}; ${E}` }),
    ({ pt, G, v, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} finds that ${v} = ${wrong} so that the straight line ${G} passes through point ${pt}. Is ${N} correct?` }, salah(N, ans, 'Substitute the coordinates of the point carefully, including the negative signs.')); }
  ],
  k113: [
    ({ a }) => ({ q: `Point P(h, 2h) lies on the straight line ${a.E}. Find the value of h and state the coordinates of P.`, ans: `h = ${fmt(a.h)}, P${P(a.h, 2 * a.h)}`, work: [`Substitute x = h, y = 2h: 2h = ${glCo(a.m, 'h')}${glK(a.c)}`, `${glCo(2 - a.m, 'h')} = ${fmt(a.c)}`, `h = ${fmt(a.h)}, thus P${P(a.h, 2 * a.h)}`] }),
    ({ b }) => ({ q: `The straight line y = px + q passes through points ${P(b.x1, b.y1)} and ${P(b.x2, b.y2)}. Find the values of p and q.`, ans: `p = ${fmt(b.p)}, q = ${fmt(b.q)}`, work: [`${fmt(b.y1)} = ${glCo(b.x1, 'p')} + q … (1)`, `${fmt(b.y2)} = ${glCo(b.x2, 'p')} + q … (2)`, `(2) − (1): ${fmt(b.y2 - b.y1)} = ${glCo(b.x2 - b.x1, 'p')}, thus p = ${fmt(b.p)}`, `q = ${fmt(b.y1)} − ${par(b.p * b.x1)} = ${fmt(b.q)}`] }),
    ({ c }) => ({ q: `The straight line y = ${glCo(c.m)} + c passes through point A${P(c.x1, c.y1)}. (a) Find the value of c. (b) Point B(${fmt(c.x2)}, k) lies on the straight line. Find the value of k. (c) Determine whether point C${P(c.x3, c.y3)} lies on the straight line.`, ans: `(a) c = ${fmt(c.c)} (b) k = ${fmt(c.k)} (c) ${c.on ? 'Ya' : 'No'}`, work: [`(a) ${fmt(c.y1)} = ${fmt(c.m)}(${fmt(c.x1)}) + c → c = ${fmt(c.c)}`, `(b) k = ${fmt(c.m)}(${fmt(c.x2)})${glK(c.c)} = ${fmt(c.k)}`, `(c) ${fmt(c.m)}(${fmt(c.x3)})${glK(c.c)} = ${fmt(c.m * c.x3 + c.c)} ${c.on ? '=' : '≠'} ${fmt(c.y3)}`] })
  ],

  /* ---------- 9.1.4 Garis selari ---------- */
  selariYT: [
    ({ G1, G2 }) => ({ q: `Determine whether the straight lines ${G1} and ${G2} are parallel.` }),
    ({ G1, G2, L1, L2 }) => ({ q: `Is the straight line ${L1}: ${G1} parallel to the straight line ${L2}: ${G2}? Give a reason.` }),
    ({ G1, G2, par: pr, ms }) => ({ q: `The straight lines ${G1} and ${G2} are drawn on the same Cartesian plane. Will the two lines intersect?`, ans: pr ? `No, because both lines are parallel (m = ${ms[0]})` : `Yes, because their gradients are different (${ms[0]} and ${ms[1]})` }),
    ({ G1, G2, par: pr, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says the straight lines ${G1} and ${G2} are ${pr ? 'not parallel' : 'parallel'}. Is ${N} correct?` }, salah(N, ans, 'Compare the gradients of both lines after converting them to the form y = mx + c.')); }
  ],
  kecSelari: [
    ({ G }) => ({ q: `The straight line PQ is parallel to the straight line ${G}. State the gradient of PQ.` }),
    ({ G }) => ({ q: `A straight road is drawn parallel to the line ${G} on a Cartesian plane. What is the gradient of the road?` }),
    ({ G, L, c2, E2 }) => ({ q: `The straight line ${L} is parallel to the straight line ${G} and has a y-intercept of ${fmt(c2)}. Write the equation of ${L}.`, ans: E2 }),
    ({ G }) => ({ q: `Complete: A straight line that is parallel to ${G} has a gradient of ___` })
  ],
  cariKSelari: [
    ({ G1, G2 }) => ({ q: `The straight line ${G1} is parallel to ${G2}. Find the value of k.` }),
    ({ G1, G2 }) => ({ q: `Given that the straight lines ${G1} and ${G2} are parallel, calculate the value of k.` }),
    ({ G1, G2 }) => ({ q: `The straight line ${G1} does not intersect ${G2} even when extended. Find the value of k.` }),
    ({ G1, G2, ans, yi }) => ({ q: `The straight line ${G1} is parallel to ${G2}. Find the value of k, hence state the y-intercept of the straight line ${G1}.`, ans: `${ans}; y-intercept = ${yi}` })
  ],
  persSelari: [
    ({ G, pt }) => ({ q: `Find the equation of the straight line that is parallel to ${G} and passes through point ${pt}.` }),
    ({ G, pt, L }) => ({ q: `The straight line ${L} passes through point ${pt} and is parallel to the straight line ${G}. Write the equation of ${L}.` }),
    ({ G, pt }) => ({ q: `A straight pipe is installed parallel to the line ${G} and passes through point ${pt} on a grid plan. Determine the equation of the pipe.` }),
    ({ G, pt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} writes the equation of the straight line that is parallel to ${G} and passes through ${pt} as ${wrong}. Is ${N} correct?` }, salah(N, ans, 'Check the signs when moving terms to find c.')); }
  ],
  k114: [
    ({ a }) => ({ q: `PQRS is a parallelogram with P${P(...a.P)}, Q${P(...a.Q)} and R${P(...a.R)}. (a) Find the gradient of PQ. (b) Find the equation of the straight line SR. (c) Find the y-intercept of the straight line SR.`, ans: `(a) ${glS(a.m)} (b) ${a.E} (c) ${glS(a.c)}`, work: [`(a) m<sub>PQ</sub> = (${fmt(a.Q[1])} − ${par(a.P[1])}) / (${fmt(a.Q[0])} − ${par(a.P[0])}) = ${glS(a.m)}`, `(b) SR is parallel to PQ, thus m = ${glS(a.m)}. Substitute R${P(...a.R)}: ${fmt(a.R[1])} = ${glS(a.m)}(${fmt(a.R[0])}) + c → c = ${glS(a.c)}`, `${a.E}`, `(c) y-intercept = ${glS(a.c)}`] }),
    ({ b }) => ({ q: `The straight line 2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} is parallel to the straight line that passes through A${P(b.x1, b.y1)} and B${P(b.x2, b.y2)}. (a) Find the value of h. (b) Find the x-intercept of the straight line 2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)}.`, ans: `(a) h = ${fmt(b.h)} (b) ${glS(b.xi)}`, work: [`m<sub>AB</sub> = (${fmt(b.y2)} − ${par(b.y1)}) / (${fmt(b.x2)} − ${par(b.x1)}) = ${fmt(b.m)}`, `2y = hx ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} → y = ${glFv('h', 2)}x ${glK(glQ(b.c, 2)).trim()}, thus h/2 = ${fmt(b.m)} → h = ${fmt(b.h)}`, `(b) 0 = ${fmt(b.h)}x ${b.c < 0 ? '−' : '+'} ${Math.abs(b.c)} → x = ${glS(b.xi)}`] }),
    ({ c }) => ({ q: `The straight line ${c.L} is parallel to the straight line ${c.G} and passes through point ${P(c.x0, c.y0)}. (a) Write the equation of ${c.L}. (b) Find the x-intercept of ${c.L}.`, ans: `(a) ${c.E} (b) ${glS(c.xi)}`, work: [`Gradient of ${c.G}: m = −(${fmt(c.b)}) / ${par(c.a)} = ${glS(c.m)}`].concat(glWc(c.m, c.x0, c.y0).w, [`(a) ${c.E}`, `(b) 0 = ${glRhs(c.m, c.c)} → x = ${glS(c.xi)}`]) })
  ],

  /* ---------- 9.1.5 Persamaan garis lurus ---------- */
  persMTitik: [
    ({ ms, pt }) => ({ q: `Find the equation of the straight line that has a gradient of ${ms} and passes through point ${pt}.` }),
    ({ ms, pt, L }) => ({ q: `The straight line ${L} passes through point ${pt} and its gradient is ${ms}. Write the equation of ${L}.` }),
    ({ ms, pt }) => ({ q: `The path of a toy aeroplane is a straight line with a gradient of ${ms} that passes through point ${pt} on a Cartesian plane. Determine the equation of the path.` }),
    ({ ms, pt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} finds that the equation of the straight line with a gradient of ${ms} that passes through ${pt} is ${wrong}. Is ${N} correct?` }, salah(N, ans, `${N} made a sign error when finding c. Check by substituting the point into the answer.`)); }
  ],
  persDuaTitik: [
    ({ A, B, p1, p2 }) => ({ q: `Find the equation of the straight line that passes through points ${A}${p1} and ${B}${p2}.` }),
    ({ A, B, p1, p2 }) => ({ q: `The straight line ${A}${B} passes through ${A}${p1} and ${B}${p2}. Write the equation of ${A}${B} in the form y = mx + c.` }),
    ({ p1, p2 }) => ({ q: `Points ${p1} and ${p2} lie on a straight line. Determine the equation of the straight line.` }),
    ({ p1, p2 }) => ({ q: `On a grid map, a school is located at ${p1} and a library at ${p2}. A straight road connects both places. Find the equation of the road.` })
  ],
  persPintasan: [
    ({ xi, yi }) => ({ q: `Find the equation of the straight line that has an x-intercept of ${fmt(xi)} and a y-intercept of ${fmt(yi)}.` }),
    ({ xi, yi, L }) => ({ q: `The straight line ${L} cuts the x-axis at ${P(xi, 0)} and the y-axis at ${P(0, yi)}. Write the equation of ${L} in the form y = mx + c.` }),
    () => ({ q: 'The diagram below shows a straight line that cuts both axes. Determine the equation of the straight line.' })
  ],
  persRajah: [
    ({ L }) => ({ q: `The diagram below shows the straight line ${L}. Find the equation of ${L}.` }),
    () => ({ q: 'Based on the diagram below, determine the equation of the straight line that passes through both points.' }),
    ({ L }) => ({ q: `A drone flies along the straight line ${L} as shown in the diagram below. Write the equation of the path of the drone.` })
  ],
  k115: [
    ({ a }) => ({ q: `The vertices of a triangle are A${P(...a.A)}, B${P(...a.B)} and C${P(...a.C)}. (a) Find the gradient of BC. (b) Find the equation of the straight line that passes through A and is parallel to BC. (c) Find the x-intercept of the straight line.`, ans: `(a) ${glS(a.m)} (b) ${a.E} (c) ${glS(a.xi)}`, work: [`(a) m<sub>BC</sub> = (${fmt(a.C[1])} − ${par(a.B[1])}) / (${fmt(a.C[0])} − ${par(a.B[0])}) = ${glS(a.m)}`].concat(glWc(a.m, a.A[0], a.A[1]).w, [`(b) ${a.E}`, `(c) 0 = ${glRhs(a.m, a.c)} → x = ${glS(a.xi)}`]) }),
    ({ b }) => ({ q: `The straight line that passes through P${P(b.x1, b.y1)} and Q(${fmt(b.x2)}, k) has a y-intercept of ${fmt(b.c)}. (a) Find the equation of the straight line. (b) Find the value of k.`, ans: `(a) ${b.E} (b) k = ${fmt(b.k)}`, work: [`The line passes through (0, ${fmt(b.c)}) and P${P(b.x1, b.y1)}: m = (${fmt(b.y1)} − ${par(b.c)}) / ${par(b.x1)} = ${fmt(b.m)}`, `(a) ${b.E}`, `(b) k = ${fmt(b.m)}(${fmt(b.x2)})${glK(b.c)} = ${fmt(b.k)}`] }),
    ({ c }) => ({ q: `A straight line passes through point ${P(c.x1, c.y1)} and has an x-intercept of ${fmt(c.a)}. (a) Find the gradient of the straight line. (b) Write its equation. (c) State the y-intercept.`, ans: `(a) ${glS(c.m)} (b) ${c.E} (c) ${glS(c.c)}`, work: [`x-intercept ${fmt(c.a)}: the line passes through ${P(c.a, 0)}.`, `(a) m = (${fmt(c.y1)} − 0) / (${fmt(c.x1)} − ${par(c.a)}) = ${glS(c.m)}`].concat(glWc(c.m, c.a, 0).w, [`(b) ${c.E}`, `(c) y-intercept = ${glS(c.c)}`]) })
  ],

  /* ---------- 9.1.6 Titik persilangan ---------- */
  silangMudah: [
    ({ G1, G2 }) => ({ q: `Find the point of intersection of the straight line ${G1} and the straight line ${G2}.` }),
    ({ G1, G2, T }) => ({ q: `The straight line ${G1} intersects the straight line ${G2} at point ${T}. Find the coordinates of ${T}.` }),
    ({ G1, G2 }) => ({ q: `Determine the coordinates of the point where the straight line ${G1} intersects the straight line ${G2}.` })
  ],
  silangGanti: [
    ({ G1, G2 }) => ({ q: `Find the point of intersection of the straight lines ${G1} and ${G2}.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Solve the simultaneous equations ${G1} and ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2, T, L1, L2 }) => ({ q: `The straight line ${L1}: ${G1} and the straight line ${L2}: ${G2} intersect at point ${T}. Find the coordinates of ${T}.` }),
    ({ G1, G2, wp, ans }) => { const N = vnama(); return Object.assign({ q: `${N} finds that the straight lines ${G1} and ${G2} intersect at ${wp}. Is ${N} correct?` }, salah(N, ans, `Point ${wp} does not satisfy both equations.`)); }
  ],
  silangRajah: [
    ({ G1, G2 }) => ({ q: `The diagram below shows the graphs of the straight lines ${G1} and ${G2}. State the coordinates of the point of intersection of both lines.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Based on the graph below, solve the simultaneous equations ${G1} and ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2 }) => ({ q: `Two straight roads are represented by the straight lines ${G1} and ${G2} as shown in the diagram below. At which point do both roads intersect? Check your answer algebraically.` })
  ],
  silangHapus: [
    ({ G1, G2 }) => ({ q: `Find the point of intersection of the straight lines ${G1} and ${G2}.` }),
    ({ G1, G2 }) => ({ q: `Using the elimination method, find the point of intersection of the straight lines ${G1} and ${G2}.` }),
    ({ G1, G2, x0, y0 }) => ({ q: `Solve the following simultaneous equations: ${G1} and ${G2}.`, ans: `x = ${fmt(x0)}, y = ${fmt(y0)}` }),
    ({ G1, G2, T }) => ({ q: `The straight lines ${G1} and ${G2} intersect at point ${T}. Find the coordinates of ${T}.` })
  ],
  silangPaksi: [
    ({ G, ax, ptA }) => ({ q: `Find the coordinates of the point of intersection of the straight line ${G} with the ${ax}-axis.`, ans: ptA }),
    ({ G, ax, ptA, T }) => ({ q: `The straight line ${G} intersects the ${ax}-axis at point ${T}. State the coordinates of ${T}.`, ans: `${T}${ptA}` }),
    ({ S1, S2, sAns, sW }) => ({ q: `Show that the straight lines ${S1} and ${S2} do not intersect.`, ans: sAns, work: sW })
  ],
  k116: [
    ({ a }) => ({ q: `The straight lines ${a.G1} and ${a.G2} intersect at point T. Both lines cut the x-axis at points A and B. (a) Find the coordinates of T. (b) Find the coordinates of A and B. (c) Calculate the area of triangle ATB.`, ans: `(a) T${P(a.x0, a.y0)} (b) A${P(a.a, 0)}, B${P(a.b, 0)} (c) ${glNum(a.luas)} units²`, work: [`(a) ${glRhs(a.m1, a.c1)} = ${glRhs(a.m2, a.c2)} → x = ${fmt(a.x0)}, y = ${fmt(a.y0)}`, `(b) Substitute y = 0 into each equation: x = ${fmt(a.a)} and x = ${fmt(a.b)}`, `(c) Base AB = ${Math.abs(a.b - a.a)}, height = ${Math.abs(a.y0)}`, `Area = ½ × ${Math.abs(a.b - a.a)} × ${Math.abs(a.y0)} = ${glNum(a.luas)} units²`] }),
    ({ b }) => ({ q: `The straight lines ${b.G1}, ${b.G2} and y = kx ${b.c3 < 0 ? '−' : '+'} ${Math.abs(b.c3)} intersect at the same point. Find the value of k.`, ans: `k = ${fmt(b.k)}`, work: [`Point of intersection of ${b.G1} and ${b.G2}: ${glRhs(b.m1, b.c1)} = ${glRhs(b.m2, b.c2)} → x = ${fmt(b.x0)}, y = ${fmt(b.y0)}`, `The third line passes through ${P(b.x0, b.y0)}: ${fmt(b.y0)} = k(${fmt(b.x0)})${glK(b.c3)}`, `k = ${fmt(b.k)}`] }),
    ({ c }) => ({ q: `Find the equation of the straight line that passes through the point of intersection of the lines ${c.G1} and ${c.G2}, and is parallel to the straight line ${c.G3}.`, ans: c.E, work: [`Point of intersection: ${glRhs(c.m1, c.c1)} = ${glRhs(c.m2, c.c2)} → ${P(c.x0, c.y0)}`, `The gradient of ${c.G3} is ${glS(c.m3)}`].concat(glWc(c.m3, c.x0, c.y0).w, [c.E]) })
  ],

  /* ---------- 9.1.7 Penyelesaian masalah ---------- */
  tafsir: [
    ({ desc, X, Y }) => ({ q: `${desc} State the meaning of the gradient and the meaning of the ${Y}-intercept of the graph of ${Y} against ${X} in this situation.` }),
    ({ desc, ms, mm }) => ({ q: `${desc} What does the value ${ms} in the equation represent?`, ans: `Rate of change: ${mm}` }),
    ({ desc, cs, cm }) => ({ q: `${desc} What does the value ${cs} in the equation represent?`, ans: `Initial value: ${cm}` }),
    ({ desc, cs, ms, cm, xu }) => { const N = vnama(); return Object.assign({ q: `${desc} ${N} says the value ${cs} in the equation is the rate of change. Is ${N} correct?` }, salah(N, `${cs} is the initial value, that is ${cm}`, `The rate of change is the gradient, that is ${ms}.`)); }
  ],
  kiraNilai: [
    ({ desc, ask }) => ({ q: `${desc} ${ask}` }),
    ({ eqT, defs, ask }) => ({ q: `Given ${eqT}, where ${defs}. ${ask}` }),
    ({ desc, ask }) => ({ q: `${desc} Based on this equation, ${ask[0].toLowerCase() + ask.slice(1)}` }),
    ({ desc, fill }) => ({ q: `${desc} Complete: ${fill}` })
  ],
  bentukPers: [
    ({ data, Y, X, ask3, w3 }) => ({ q: `${data} The relationship between ${Y} and ${X} is linear. (a) Write the equation of ${Y} in terms of ${X}. (b) ${ask3}`, work: w3 }),
    ({ data, Y, X, E }) => ({ q: `${data} Given that the relationship between ${Y} and ${X} is linear, form an equation that relates ${Y} and ${X}.`, ans: E }),
    ({ data, Y, X, askC, cAns }) => ({ q: `${data} The relationship between ${Y} and ${X} is linear. ${askC}`, ans: cAns })
  ],
  bandingPelan: [
    ({ desc, xu }) => ({ q: `${desc} After how many ${xu} will the total payment of both options be the same?` }),
    ({ desc, xu, xq, ansQ, wQ }) => ({ q: `${desc} Which option is cheaper for ${xq} ${xu}? Show your working.`, ans: ansQ, work: wQ }),
    ({ desc, ansT }) => ({ q: `${desc} Find the point of intersection of the graphs of both options and state its meaning.`, ans: ansT })
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
  return GEN_LQ('mcBaca', { E, L: r.p(GLL1), ms, cs, ans, work: [`Compare with y = mx + c.`, `Gradient = coefficient of x = ${ms}`, `y-intercept = constant = ${cs}`] });
};
GL.mcTulis = r => {
  let m, c; do { m = glM(r, .25); c = r.n(-9, 9); } while (glSama(m, c) || glV(m) === 1);
  const E = glEq(m, c), ms = glS(m), cs = fmt(c);
  return GEN_LQ('mcTulis', { E, L: r.p(GLL1), ms, cs, wrong: glEq(c, m), ans: E, work: [`m = ${ms}, c = ${cs}`, `Substitute into y = mx + c: ${E}`] });
};
GL.mcMendatar = (r, k) => {
  const hor = k == null ? r.f() < .5 : k % 2 === 0, h = r.n(-8, 8), kk = r.n(-8, 8);
  let o; do { o = r.n(-8, 8); } while (o === (hor ? h : kk));
  const pt = P(h, kk), pt2 = hor ? P(o, kk) : P(h, o), E = hor ? `y = ${fmt(kk)}` : `x = ${fmt(h)}`;
  const E2 = hor ? `y = ${fmt(o)}` : `x = ${fmt(o)}`;
  return GEN_LQ('mcMendatar', {
    pt, pt2, E2, L: r.p(GLL1), ax: hor ? 'x' : 'y', jenis: hor ? 'horizontal' : 'vertical', ans: E,
    work: [hor ? `A line parallel to the x-axis is a horizontal line: all the points have y = ${fmt(kk)}.` : `A line parallel to the y-axis is a vertical line: all the points have x = ${fmt(h)}.`, `Equation: ${E}`],
    ansM: hor ? '0' : 'Undefined', wM: [hor ? `${E2} is a horizontal line (parallel to the x-axis), thus its gradient is 0.` : `${E2} is a vertical line (parallel to the y-axis), thus its gradient is undefined.`]
  });
};
GL.mcSusun = (r, k) => {
  const f = k == null ? r.i(0, 3) : k % 4;
  let m, c, G, w, claim, why;
  do { m = f === 1 ? glM(r, .5) : glMi(r, 5); c = r.n(-9, 9); } while (glSama(m, c) || (f === 0 && glV(m) === 1));
  const E = glEq(m, c), ms = glS(m), cs = fmt(c), am = glAbs(m);
  if (f === 0) { G = `y = ${fmt(c)} ${glV(m) < 0 ? '−' : '+'} ${glCo(am)}`; w = [`Rearrange: ${E}`]; claim = `the gradient is ${cs}`; why = 'The gradient is the coefficient of x, not the first number in the equation.'; }
  if (f === 1) { const K = glR(m)[1] === 1 ? r.p([2, 3, 4]) : glR(m)[1] * r.p([1, 2]); G = `${K}y = ${glRhs(glMul(m, K), K * c)}`; w = [`Divide each term by ${K}: ${E}`]; claim = `the gradient is ${glS(glMul(m, K))} and the y-intercept is ${fmt(K * c)}`; why = `Divide each term by ${K} first so that the coefficient of y is 1.`; }
  if (f === 2) { G = `y ${glV(m) > 0 ? '−' : '+'} ${glCo(am)} = ${fmt(c)}`; w = [`Move the x term to the right-hand side: ${E}`]; claim = `the gradient is ${glS(glNeg(m))}`; why = 'When the x term is moved to the right-hand side, its sign changes.'; }
  if (f === 3) { G = `y ${c > 0 ? '−' : '+'} ${Math.abs(c)} = ${glCo(m)}`; w = [`Move the constant to the right-hand side: ${E}`]; claim = `the y-intercept is ${fmt(-c)}`; why = 'When the constant is moved to the right-hand side, its sign changes.'; }
  const ans = `m = ${ms}, c = ${cs}`;
  return GEN_LQ('mcSusun', { G, E, L: r.p(GLL1), claim, why, ans, work: w.concat([ans]) });
};
GL.mcRajah = r => {
  let c, p, q, sg, t, x2, y2;
  do { [p, q] = r.p([[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [2, 3], [3, 2]]); sg = r.f() < .5 ? 1 : -1; t = r.p([1, 2, -1]); c = r.i(-4, 4); x2 = q * t; y2 = c + sg * p * t; }
  while (Math.abs(x2) > 6 || Math.abs(y2) > 6 || !c || Math.abs(x2) < 2);
  const m = glQ(sg * p, q), E = glEq(m, c), ms = glS(m), cs = fmt(c), L = r.p(GLL1);
  const base = { pts: [{ x: 0, y: c, l: P(0, c), c: 'pu' }, { x: x2, y: y2, l: P(x2, y2), c: 'am' }], lines: [{ a: [0, c], b: [x2, y2], c: 'am', w: 4 }], label: `Straight line ${L}` };
  const lg = glLegs(0, c, x2, y2), ans = Object.assign({}, base, { lines: base.lines.concat(lg.lines), texts: lg.texts });
  return GEN_LQ('mcRajah', { L, E, ms, cs, ans: E, work: [`The line cuts the y-axis at ${P(0, c)}, thus c = ${cs}.`, `m = (${fmt(y2)} − ${par(c)}) / (${fmt(x2)} − 0) = ${ms}`, E] }, { fig: glPlane(base), figAns: glPlane(ans) });
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
  return GEN_LQ('pinBentuk', { G: glPin(a, b), a, b, m, E, work: [`The form x/a + y/b = 1: a is the x-intercept and b is the y-intercept.`, `x-intercept = ${fmt(a)}, y-intercept = ${fmt(b)}`] });
};
function glPinData(r) {
  let xi, yi; do { xi = r.n(-6, 6); yi = r.n(-6, 6); } while (Math.abs(xi) < 2 || Math.abs(yi) < 2 || (Math.abs(xi) === Math.abs(yi) && r.f() < .7));
  const Lc = Math.abs(xi * yi) / glGcd(xi, yi);
  let a = Lc / xi, b = Lc / yi, c = Lc; if (a < 0) { a = -a; b = -b; c = -c; }
  return { xi, yi, a, b, c, G: glAm(a, b, c) };
}
GL.amPintasan = r => {
  const d = glPinData(r);
  const fl = { lines: [{ a: [d.xi, 0], b: [0, d.yi], c: 'am', w: 4 }], pts: [{ x: d.xi, y: 0, l: P(d.xi, 0), c: 'pk' }, { x: 0, y: d.yi, l: P(0, d.yi), c: 'tr' }], label: 'A straight line with an x-intercept and a y-intercept' };
  return GEN_LQ('amPintasan', Object.assign({ ans: `x-intercept = ${fmt(d.xi)}, y-intercept = ${fmt(d.yi)}`, work: [`x-intercept: substitute y = 0 → ${glCo(d.a)} = ${fmt(d.c)} → x = ${fmt(d.xi)}`, `y-intercept: substitute x = 0 → ${glCo(d.b, 'y')} = ${fmt(d.c)} → y = ${fmt(d.yi)}`] }, d), { figAns: glPlane(fl) });
};
GL.keBentukAm = r => {
  let m, c; do { m = glM(r, .6); c = r.n(-8, 8); } while (glV(m) === 1);
  const [a, b, k] = glAmOf(m, c), E = glEq(m, c), q = glR(m)[1], ans = glAm(a, b, k);
  const w = q === 1 ? [`Move the x term to the left: ${glAm(-glR(m)[0], 1, c)}`] : [`Multiply each term by ${q}: ${q}y = ${glRhs(glMul(m, q), q * c)}`, `Move the x term to the left: ${glAm(-glR(m)[0], q, q * c)}`];
  if (glR(m)[0] > 0) w.push(`Multiply by −1 so that a > 0: ${ans}`);
  return GEN_LQ('keBentukAm', { E, ans, work: w });
};
GL.keBentukPin = r => {
  const d = glPinData(r), ans = glPin(d.xi, d.yi), E = glEq(glQ(-d.yi, d.xi), d.yi);
  return GEN_LQ('keBentukPin', Object.assign({ E, ans, work: [`Divide each term by ${fmt(d.c)}: ${glFv(glCo(d.a), d.c)} + ${glFv(glCo(d.b, 'y'), d.c)} = 1`, `Simplify: ${ans}`, `x-intercept = ${fmt(d.xi)}, y-intercept = ${fmt(d.yi)}`] }, d));
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
  if (Ln.am) { const v = Ln.val(x, y), ok = v === Ln.c; return { ok, w: [`Substitute x = ${fmt(x)}, y = ${fmt(y)} into the left-hand side: ${Ln.chk(x, y)}`, `${fmt(v)} ${ok ? '=' : '≠'} ${fmt(Ln.c)}`] }; }
  const v = Ln.val(x), ok = v === y; return { ok, w: [`Substitute x = ${fmt(x)} into the right-hand side: y = ${Ln.chk(x)}`, `${fmt(v)} ${ok ? '=' : '≠'} ${fmt(y)}`] };
}
GL.semakTitik = (r, k) => {
  const Ln = glLineData(r), on = k == null ? r.f() < .5 : k % 2 === 0;
  const near = () => { let p; do { p = Ln.on(r.i(-3, 3)); } while (Math.abs(p[0]) > 9 || Math.abs(p[1]) > 12); return p; };
  let [x, y] = near(); if (!on) y += r.n(-2, 2);
  let ox, oy, fx, fy; do { [ox, oy] = near(); [fx, fy] = near(); fy += r.n(-2, 2); } while (ox === fx);
  const sw = r.f() < .5, [A, B] = r.p(GLH2), pOn = P(ox, oy), pOff = P(fx, fy);
  const nOn = sw ? A : B, nOff = sw ? B : A;
  const w2 = glSemak(Ln, ox, oy).w.concat([`Point ${nOn} lies on the line.`], glSemak(Ln, fx, fy).w, [`Point ${nOff} does not lie on the line.`]);
  const sv = glSemak(Ln, x, y), verdict = sv.ok ? 'Yes, the point lies on the straight line' : 'No, the point does not lie on the straight line';
  return GEN_LQ('semakTitik', { pt: P(x, y), G: Ln.G, L: r.p(GLT), A, B, pA: sw ? pOn : pOff, pB: sw ? pOff : pOn, onN: nOn, w2, on: sv.ok, ans: verdict, work: sv.w.concat([sv.ok ? 'Both sides are equal, thus the point lies on the line.' : 'Both sides are not equal, thus the point does not lie on the line.']) });
};
GL.cariKoord = (r, k) => {
  const yUnk = k == null ? r.f() < .5 : k % 2 === 0;
  let m, c, x, y; do { m = r.n(-5, 5); c = r.i(-8, 8); x = r.n(-5, 5); y = m * x + c; } while (Math.abs(y) > 15);
  const v = yUnk ? 'k' : 'h', G = glEq(m, c), pt = yUnk ? `(${fmt(x)}, k)` : `(h, ${fmt(y)})`, ans = `${v} = ${fmt(yUnk ? y : x)}`;
  const work = yUnk ? [`Substitute x = ${fmt(x)}: k = ${glS(m)}(${fmt(x)})${glK(c)}`.replace(/= (−?)1\(/, '= $1('), `k = ${fmt(y)}`]
    : [`Substitute y = ${fmt(y)}, x = h: ${fmt(y)} = ${glCo(m, 'h')}${glK(c)}`, `${glCo(m, 'h')} = ${fmt(y)} − ${par(c)} = ${fmt(y - c)}`, `h = ${fmt(x)}`];
  return GEN_LQ('cariKoord', { pt: `${r.p(GLT)}${pt}`, G, v, ans, work });
};
GL.cariKoordAm = (r, k) => {
  const xUnk = k == null ? r.f() < .5 : k % 2 === 0;
  let a, b, x, y; do { a = r.n(-5, 6); b = r.n(-5, 5); x = r.n(-5, 5); y = r.n(-6, 6); } while (glGcd(a, b) !== 1 || a < 0 || Math.abs(a * x + b * y) > 30);
  const c = a * x + b * y, G = glAm(a, b, c), v = xUnk ? 'h' : 'k', pt = xUnk ? `(h, ${fmt(y)})` : `(${fmt(x)}, k)`;
  const t1 = xUnk ? `${glCo(a, 'h')} ${b * y < 0 ? '−' : '+'} ${Math.abs(b * y)} = ${fmt(c)}` : `${fmt(a * x)} ${b < 0 ? '−' : '+'} ${glCo(Math.abs(b), 'k')} = ${fmt(c)}`;
  const t2 = xUnk ? `${glCo(a, 'h')} = ${fmt(c - b * y)}` : `${glCo(b, 'k')} = ${fmt(c - a * x)}`;
  return GEN_LQ('cariKoordAm', { pt, G, v, L: r.p(GLT), ans: `${v} = ${fmt(xUnk ? x : y)}`, work: [`Substitute ${xUnk ? `x = h, y = ${fmt(y)}` : `x = ${fmt(x)}, y = k`}: ${t1}`, t2, `${v} = ${fmt(xUnk ? x : y)}`] });
};
GL.cariPemalar = (r, k) => {
  const f = k == null ? r.i(0, 2) : k % 3;
  let m, c, x, y; do { m = r.n(-5, 5); c = r.i(-8, 8); x = r.n(-4, 4); y = m * x + c; } while (Math.abs(y) > 15 || m === c);
  const pt = P(x, y);
  if (f === 0) return GEN_LQ('cariPemalar', { pt, G: `y = px${glK(c)}`, v: 'p', ans: `p = ${fmt(m)}`, wrong: fmt(-m), E: glEq(m, c), work: [`Substitute ${pt}: ${fmt(y)} = p(${fmt(x)})${glK(c)}`, `${glCo(x, 'p')} = ${fmt(y)} − ${par(c)} = ${fmt(y - c)}`, `p = ${fmt(m)}`] });
  if (f === 1) return GEN_LQ('cariPemalar', { pt, G: `y = ${glCo(m)} + k`, v: 'k', ans: `k = ${fmt(c)}`, wrong: fmt(y + m * x), E: glEq(m, c), work: [`Substitute ${pt}: ${fmt(y)} = ${fmt(m)}(${fmt(x)}) + k`, `k = ${fmt(y)} − ${par(m * x)} = ${fmt(c)}`] });
  const b = r.p([2, 3, -2, 5]), p = r.n(-5, 5), cc = p * x + b * y;
  return GEN_LQ('cariPemalar', { pt, G: `px ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(cc)}`, v: 'p', ans: `p = ${fmt(p)}`, wrong: fmt(-p), E: glAm(p, b, cc), work: [`Substitute ${pt}: p(${fmt(x)}) ${b < 0 ? '−' : '+'} ${Math.abs(b)}(${fmt(y)}) = ${fmt(cc)}`, `${glCo(x, 'p')} = ${fmt(cc)} − ${par(b * y)} = ${fmt(cc - b * y)}`, `p = ${fmt(p)}`] });
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
  if (kind === 'kali') { const K = glR(m)[1] * glR(c)[1] > 1 ? glR(m)[1] * glR(c)[1] / glGcd(glR(m)[1], glR(c)[1]) : r.p([2, 3]); return { G: `${K}y = ${glRhs(glMul(m, K), glMul(c, K))}`, w: [`Divide by ${K}: ${E}`], kind }; }
  return { G: E, w: [], kind: 'mxc' };
}
GL.selariYT = (r, k) => {
  const pr = k == null ? r.f() < .5 : k % 2 === 0;
  let m1, c1, m2, c2; do { m1 = glM(r, .4); c1 = r.i(-8, 8); c2 = r.i(-8, 8); m2 = pr ? m1 : r.p([glNeg(m1), glDiv(1, m1), glAdd(m1, 1), glMul(m1, 2)]); } while (c1 === c2 || (!pr && glSama(m1, m2)));
  const F1 = glForm(r, m1, c1), F2 = glForm(r, m2, c2, F1.kind === 'mxc' ? r.p(['am', 'kali']) : null);
  const ms = [glS(m1), glS(m2)], L = r.p(GLH2);
  const ans = pr ? `Parallel, because m₁ = m₂ = ${ms[0]}` : `Not parallel, because m₁ = ${ms[0]} and m₂ = ${ms[1]}`;
  const work = [].concat(F1.w.length ? [`${F1.G}: ${F1.w[F1.w.length - 1].replace(/^.*: /, '')}`] : [], F2.w.length ? [`${F2.G}: ${F2.w[F2.w.length - 1].replace(/^.*: /, '')}`] : [], [`m₁ = ${ms[0]}, m₂ = ${ms[1]}`, pr ? 'The gradients are equal, thus both lines are parallel.' : 'The gradients are different, thus the lines are not parallel.']);
  return GEN_LQ('selariYT', { G1: F1.G, G2: F2.G, L1: L[0] + L[1], L2: r.p(['MN', 'RS', 'UV']), par: pr, ms, ans, work });
};
GL.kecSelari = r => {
  let m, c, c2; do { m = glM(r, .45); c = r.i(-8, 8); c2 = r.n(-8, 8); } while (c === c2);
  const F = glForm(r, m, c), ms = glS(m);
  return GEN_LQ('kecSelari', { G: F.G, L: r.p(GLL1), c2, E2: glEq(m, c2), ans: `m = ${ms}`, work: F.w.concat([`The gradient of the line is ${ms}.`, `Parallel lines have the same gradient, that is ${ms}.`]) });
};
GL.cariKSelari = (r, k) => {
  const f = k == null ? r.i(0, 3) : k % 4, m = r.n(-5, 5), c1 = r.n(-9, 9);
  let c2; do { c2 = r.i(-8, 8); } while (c2 === c1);
  let G1, G2 = glEq(m, c2), ans, w;
  if (f === 0) { const a = r.n(-4, 4), kk = m - a; G1 = `y = (k ${a < 0 ? '−' : '+'} ${Math.abs(a)})x${glK(c1)}`; ans = `k = ${fmt(kk)}`; w = [`The gradient of ${G1} is k ${a < 0 ? '−' : '+'} ${Math.abs(a)}.`, `Parallel lines: k ${a < 0 ? '−' : '+'} ${Math.abs(a)} = ${fmt(m)}`, ans]; }
  if (f === 1) { const b = r.p([2, 3, 4, -2]), cc = b * c1; G1 = `kx ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(cc)}`; ans = `k = ${fmt(-m * b)}`; w = [`For ax + by = c, m = −a/b. The gradient of ${G1} = −k / ${par(b)}`, `Parallel lines: −k / ${par(b)} = ${fmt(m)}`, ans]; }
  if (f === 2) { const K = r.p([2, 3]); G1 = `${K}y = kx${glK(K * c1)}`; ans = `k = ${fmt(K * m)}`; w = [`Divide by ${K}: y = ${glFv('k', K)}x${glK(c1)}`, `Parallel lines: k/${K} = ${fmt(m)}`, ans]; }
  if (f === 3) { const x1 = r.i(-4, 2), dx = r.p([1, 2]); let y1; do { y1 = r.i(-5, 5); } while (y1 - m * x1 === c1); G2 = `the straight line that passes through ${P(x1, y1)} and ${P(x1 + dx, y1 + m * dx)}`; G1 = `y = kx${glK(c1)}`; ans = `k = ${fmt(m)}`; w = [`Gradient of the second line = (${fmt(y1 + m * dx)} − ${par(y1)}) / (${fmt(x1 + dx)} − ${par(x1)}) = ${fmt(m)}`, `Parallel lines: k = ${fmt(m)}`]; }
  return GEN_LQ('cariKSelari', { G1, G2, ans, yi: fmt(c1), work: w });
};
GL.persSelari = r => {
  let m, c0, x, y, c; do { m = glM(r, .3); c0 = r.i(-8, 8); x = glR(m)[1] * r.n(-3, 3); y = r.i(-7, 7); c = glSub(y, glMul(m, x)); } while (!glIsInt(c) || glSama(c, c0) || Math.abs(glV(c)) > 15 || Math.abs(x) > 8);
  const F = glForm(r, m, c0), E = glEq(m, c), W = glWc(m, x, y), cw = glAdd(y, glMul(m, x));
  return GEN_LQ('persSelari', { G: F.G, pt: P(x, y), L: r.p(GLL1), wrong: glEq(m, glSama(cw, c) ? glNeg(c) : cw), ans: E, work: F.w.concat([`Parallel lines: m = ${glS(m)}`], W.w, [E]) });
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
  const fig = glPlane({ lines: [{ a: [xi, 0], b: [0, yi], c: 'am', w: 4 }], pts: [{ x: xi, y: 0, l: P(xi, 0), c: 'pk' }, { x: 0, y: yi, l: P(0, yi), c: 'tr' }], label: 'A straight line that cuts the x-axis and the y-axis' });
  return GEN_LQ('persPintasan', { xi, yi, L: r.p(GLL1), ans: E, work: [`m = −(y-intercept) / (x-intercept) = −(${fmt(yi)}) / ${par(xi)} = ${glS(m)}`, `c = y-intercept = ${fmt(yi)}`, E] }, { fig });
};
GL.persRajah = r => {
  let x1, y1, x2, y2, m, c;
  do { x1 = r.n(-5, 5); y1 = r.i(-5, 5); x2 = r.n(-5, 5); y2 = r.i(-5, 5); m = glQ(y2 - y1, x2 - x1); c = x1 === x2 ? null : glSub(y1, glMul(m, x1)); }
  while (x1 === x2 || y1 === y2 || !glIsInt(c) || glR(m)[1] > 3 || Math.abs(x2 - x1) < 2 || Math.abs(glV(c)) > 8);
  const L = r.p(GLL1), E = glEq(m, c), base = { pts: [{ x: x1, y: y1, l: P(x1, y1), c: 'am' }, { x: x2, y: y2, l: P(x2, y2), c: 'pk' }], lines: [{ a: [x1, y1], b: [x2, y2], c: 'am', w: 4 }], label: `Straight line ${L}` };
  const lg = glLegs(x1, y1, x2, y2);
  return GEN_LQ('persRajah', { L, ans: E, work: [`From the diagram: ${P(x1, y1)} and ${P(x2, y2)}.`].concat(glW2(x1, y1, x2, y2).w, glWc(m, x1, y1).w, [E]) }, { fig: glPlane(base), figAns: glPlane(Object.assign({}, base, { lines: base.lines.concat(lg.lines), texts: lg.texts })) });
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
const glWSil = (m1, c1, m2, c2, x0, y0) => [`${glRhs(m1, c1)} = ${glRhs(m2, c2)}`, `${glCo(glSub(m1, m2))} = ${glS(glSub(c2, c1))}`, `x = ${fmt(x0)}`, `y = ${glS(m1)}(${fmt(x0)})${glK(c1)} = ${fmt(y0)}`.replace(/= (−?)1\(/, '= $1('), `The point of intersection is ${P(x0, y0)}`];
GL.silangMudah = (r, k) => {
  const ver = k == null ? r.f() < .5 : k % 2 === 0;
  let m, c, x0, y0; do { m = r.n(-4, 4); c = r.i(-6, 6); x0 = r.n(-5, 5); y0 = m * x0 + c; } while (Math.abs(y0) > 12);
  const G1 = glEq(m, c), G2 = ver ? `x = ${fmt(x0)}` : `y = ${fmt(y0)}`, ans = P(x0, y0);
  const work = ver ? [`Substitute x = ${fmt(x0)} into ${G1}: y = ${glS(m)}(${fmt(x0)})${glK(c)} = ${fmt(y0)}`.replace(/y = (−?)1\(/, 'y = $1('), `The point of intersection is ${ans}`]
    : [`Substitute y = ${fmt(y0)} into ${G1}: ${fmt(y0)} = ${glRhs(m, c)}`, `${glCo(m)} = ${fmt(y0 - c)} → x = ${fmt(x0)}`, `The point of intersection is ${ans}`];
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
  const fig = glPlane({ box, lines, texts, label: `Graphs of ${G1} and ${G2}` });
  const figAns = glPlane({ box, lines, texts, pts: [{ x: d.x0, y: d.y0, l: P(d.x0, d.y0), c: 'am' }], label: 'Point of intersection' });
  return GEN_LQ('silangRajah', { G1, G2, x0: d.x0, y0: d.y0, ans: P(d.x0, d.y0), work: [`Read the coordinates of the point of intersection from the graph: ${P(d.x0, d.y0)}.`, `Check: ${fmt(d.y0)} = ${glS(d.m1)}(${fmt(d.x0)})${glK(d.c1)} ✓ and ${fmt(d.y0)} = ${glS(d.m2)}(${fmt(d.x0)})${glK(d.c2)} ✓`.replace(/= (−?)1\(/g, '= $1(')] }, { fig, figAns });
};
GL.silangHapus = r => {
  let a1, b1, a2, b2, x0, y0; do { a1 = r.n(-4, 5); b1 = r.n(-4, 4); x0 = r.i(-5, 5); y0 = r.i(-5, 5); if (r.f() < .5) { b2 = r.p([b1, -b1]); a2 = r.n(-4, 5); } else { a2 = r.p([a1, -a1]); b2 = r.n(-4, 4); } }
  while (a1 * b2 === a2 * b1 || a1 < 0 || a2 < 0 || glGcd(a1, b1) !== 1 || glGcd(a2, b2) !== 1 || (a1 === a2 && b1 === b2));
  const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, G1 = glAm(a1, b1, c1), G2 = glAm(a2, b2, c2), w = [];
  if (b1 === b2 || b1 === -b2) { const add = b1 === -b2, A = add ? a1 + a2 : a1 - a2, C = add ? c1 + c2 : c1 - c2; w.push(`${add ? 'Add' : 'Subtract'} both equations to eliminate y: ${glCo(A)} = ${fmt(C)}`, `x = ${fmt(x0)}`, `Substitute x = ${fmt(x0)} into ${G1}: ${glCo(b1, 'y')} = ${fmt(c1)} − ${par(a1 * x0)} = ${fmt(c1 - a1 * x0)}`, `y = ${fmt(y0)}`); }
  else { const add = a1 === -a2, B = add ? b1 + b2 : b1 - b2, C = add ? c1 + c2 : c1 - c2; w.push(`${add ? 'Add' : 'Subtract'} both equations to eliminate x: ${glCo(B, 'y')} = ${fmt(C)}`, `y = ${fmt(y0)}`, `Substitute y = ${fmt(y0)} into ${G1}: ${glCo(a1)} = ${fmt(c1)} − ${par(b1 * y0)} = ${fmt(c1 - b1 * y0)}`, `x = ${fmt(x0)}`); }
  w.push(`The point of intersection is ${P(x0, y0)}`);
  return GEN_LQ('silangHapus', { G1, G2, x0, y0, T: r.p(GLT), ans: P(x0, y0), work: w });
};
GL.silangPaksi = (r, k) => {
  const d = glPinData(r), onX = k == null ? r.f() < .5 : k % 2 === 0, ax = onX ? 'x' : 'y', ptA = onX ? P(d.xi, 0) : P(0, d.yi);
  const am = r.f() < .6, G = am ? d.G : glEq(glQ(-d.yi, d.xi), d.yi);
  const work = [onX ? `On the x-axis, y = 0.` : `On the y-axis, x = 0.`, onX ? `Substitute y = 0 into ${G}: x = ${fmt(d.xi)}` : `Substitute x = 0 into ${G}: y = ${fmt(d.yi)}`, `Coordinates: ${ptA}`];
  let m, c1, c2; do { m = glM(r, .4); c1 = r.i(-8, 8); c2 = r.i(-8, 8); } while (c1 === c2);
  const F = glForm(r, m, c2, 'am'), S1 = glEq(m, c1), S2 = F.G;
  const sW = F.w.concat([`The gradients of both lines are ${glS(m)}, but the y-intercepts are different (${fmt(c1)} and ${fmt(c2)}).`, 'Thus both lines are parallel and do not intersect.']);
  return GEN_LQ('silangPaksi', { G, ax, ptA, T: r.p(GLT), S1, S2, sAns: `Both lines are parallel (m = ${glS(m)}) with different y-intercepts, thus there is no point of intersection`, sW, ans: ptA, work });
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
  { nm: 'sewa basikal', Y: 'C', X: 't', yv: v => `RM${v}`, xu: 'hours', sg: 1, mR: [2, 6], cR: [3, 10], d: (m, c) => `The cost of renting a bicycle, RM${'C'}, for t hours is given by C = ${m}t + ${c}.`, mm: m => `the rental cost increases by RM${m} for every hour`, cm: c => `a basic charge of RM${c}`, defs: 'C is the cost of renting the bicycle (RM) and t is the time (hours)', ay: x => `Calculate the cost of renting the bicycle for ${x} hours.`, ax: y => `For how many hours is the bicycle rented if the cost is RM${y}?`, dat: (x1, y1, x2, y2) => `The cost of renting a bicycle for ${x1} hours is RM${y1} and for ${x2} hours is RM${y2}.`, askC: 'What is the basic charge for renting the bicycle?' },
  { nm: 'tambang teksi', Y: 'T', X: 'd', yv: v => `RM${v}`, xu: 'kilometres', sg: 1, mR: [2, 3], cR: [3, 6], d: (m, c) => `The fare of a taxi, RMT, for a journey of d km is given by T = ${m}d + ${c}.`, mm: m => `the fare increases by RM${m} for every kilometre`, cm: c => `a starting charge of RM${c}`, defs: 'T is the fare (RM) and d is the distance (km)', ay: x => `Calculate the fare for a journey of ${x} km.`, ax: y => `How far is the journey if the fare is RM${y}?`, dat: (x1, y1, x2, y2) => `The taxi fare for a journey of ${x1} km is RM${y1} and for a journey of ${x2} km is RM${y2}.`, askC: 'What is the starting charge of the taxi fare?' },
  { nm: 'simpanan', Y: 'S', X: 'n', yv: v => `RM${v}`, xu: 'weeks', sg: 1, mR: [5, 20], cR: [20, 80], d: (m, c) => `Aina's savings, RMS, after n weeks are given by S = ${m}n + ${c}.`, mm: m => `the savings increase by RM${m} every week`, cm: c => `initial savings of RM${c}`, defs: 'S is the savings (RM) and n is the number of weeks', ay: x => `How much are Aina's savings after ${x} weeks?`, ax: y => `After how many weeks will Aina's savings be RM${y}?`, dat: (x1, y1, x2, y2) => `Aina's savings after ${x1} weeks are RM${y1} and after ${x2} weeks are RM${y2}.`, askC: "What are Aina's initial savings?" },
  { nm: 'tinggi pokok', Y: 'h', X: 'w', yv: v => `${v} cm`, xu: 'weeks', sg: 1, mR: [2, 5], cR: [5, 20], d: (m, c) => `The height of a young plant, h cm, after w weeks is given by h = ${m}w + ${c}.`, mm: m => `the plant grows ${m} cm taller every week`, cm: c => `the original height of the plant is ${c} cm`, defs: 'h is the height of the plant (cm) and w is the number of weeks', ay: x => `What is the height of the plant after ${x} weeks?`, ax: y => `After how many weeks will the height of the plant be ${y} cm?`, dat: (x1, y1, x2, y2) => `The height of a young plant after ${x1} weeks is ${y1} cm and after ${x2} weeks is ${y2} cm.`, askC: 'What is the original height of the young plant?' },
  { nm: 'lilin', Y: 'H', X: 't', yv: v => `${v} cm`, xu: 'hours', sg: -1, mR: [2, 4], cR: [20, 30], d: (m, c) => `The length of a burning candle, H cm, after t hours is given by H = ${c} − ${m}t.`, mm: m => `the length of the candle decreases by ${m} cm every hour`, cm: c => `the original length of the candle is ${c} cm`, defs: 'H is the length of the candle (cm) and t is the time (hours)', ay: x => `What is the length of the candle after ${x} hours?`, ax: y => `After how many hours will the length of the candle be ${y} cm?`, dat: (x1, y1, x2, y2) => `A candle is lit. Its length after ${x1} hours is ${y1} cm and after ${x2} hours is ${y2} cm.`, askC: 'What is the original length of the candle?' },
  { nm: 'tangki air', Y: 'V', X: 't', yv: v => `${v} litres`, xu: 'minutes', sg: -1, mR: [3, 10], cR: [60, 150], d: (m, c) => `The volume of water in a tank, V litres, t minutes after the water is drained out is given by V = ${c} − ${m}t.`, mm: m => `the volume of water decreases by ${m} litres every minute`, cm: c => `the initial volume of water is ${c} litres`, defs: 'V is the volume of water (litres) and t is the time (minutes)', ay: x => `What is the volume of water after ${x} minutes?`, ax: y => `After how many minutes will the volume of water be ${y} litres?`, dat: (x1, y1, x2, y2) => `Water is drained out of a tank at a constant rate. The volume of water after ${x1} minutes is ${y1} litres and after ${x2} minutes is ${y2} litres.`, askC: 'What is the initial volume of water in the tank?' }
];
function glCtx(r) {
  const C = r.p(GLCTX); let m, c; do { m = r.i(C.mR[0], C.mR[1]); c = r.i(C.cR[0], C.cR[1]); if (C.cR[1] >= 20) c = Math.round(c / 5) * 5; } while (C.sg < 0 && c % m !== 0 && r.f() < .7);
  const M = C.sg * m, E = `${C.Y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}`;
  return { C, m, c, M, E, f: x => M * x + c };
}
GL.tafsir = r => {
  const { C, m, c, M, E } = glCtx(r);
  return GEN_LQ('tafsir', { desc: C.d(m, c), X: C.X, Y: C.Y, ms: fmt(M), cs: String(c), mm: C.mm(m), cm: C.cm(c), xu: C.xu, ans: `Gradient ${fmt(M)}: ${C.mm(m)}; ${C.Y}-intercept ${c}: ${C.cm(c)}`, work: [`Compare ${E} with y = mx + c.`, `m = ${fmt(M)} is the rate of change of ${C.Y} for each unit of ${C.X}.`, `c = ${c} is the value of ${C.Y} when ${C.X} = 0 (the initial value).`] });
};
GL.kiraNilai = (r, k) => {
  const askY = k == null ? r.f() < .5 : k % 2 === 0;
  let g, x, y; do { g = glCtx(r); x = r.i(2, 12); y = g.f(x); } while (y <= 0);
  const { C, m, c, M, E } = g, rhs = M < 0 ? `${c} − ${m}(${x})` : `${m}(${x}) + ${c}`;
  const ask = askY ? C.ay(x) : C.ax(y);
  const ans = askY ? C.yv(y) : `${x} ${C.xu}`;
  const work = askY ? [`Substitute ${C.X} = ${x}: ${C.Y} = ${rhs}`, `${C.Y} = ${y}`, ans] : [`Substitute ${C.Y} = ${y}: ${y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}`, `${m}${C.X} = ${Math.abs(y - c)}`, `${C.X} = ${x}`];
  const fill = askY ? `When ${C.X} = ${x}, ${C.Y} = ${rhs} = ___` : `When ${C.Y} = ${y}, ${y} = ${M < 0 ? `${c} − ${m}${C.X}` : `${m}${C.X} + ${c}`}, thus ${C.X} = ___`;
  return GEN_LQ('kiraNilai', { desc: C.d(m, c), eqT: E, defs: C.defs, ask, fill, ans, work });
};
GL.bentukPers = r => {
  let g, x1, x2, x3; do { g = glCtx(r); x1 = r.i(1, 4); x2 = x1 + r.i(2, 5); x3 = x2 + r.i(1, 4); } while (g.f(x3) <= 0);
  const { C, m, c, M, E } = g, y1 = g.f(x1), y2 = g.f(x2), y3 = g.f(x3);
  const ask3 = `Find the value of ${C.Y} when ${C.X} = ${x3}.`;
  const w = [`m = (${y2} − ${y1}) / (${x2} − ${x1}) = ${fmt(y2 - y1)}/${x2 - x1} = ${fmt(M)}`, `${y1} = ${fmt(M)}(${x1}) + c → c = ${c}`, E];
  return GEN_LQ('bentukPers', { data: C.dat(x1, y1, x2, y2), X: C.X, Y: C.Y, x3, ask3, E, askC: C.askC, cAns: C.yv(c), ans: `(a) ${E} (b) ${C.Y} = ${y3}`, work: w, w3: w.concat([`${C.Y} = ${fmt(M)}(${x3}) + ${c} = ${y3}`]) });
};
const GLPLAN = [
  { nm: 'gim', xu: 'visits', X: 'n', a: (f, p) => `Gym A charges a membership fee of RM${f} and RM${p} for every visit.`, b: q => `Gym B charges RM${q} for every visit without a membership fee.` },
  { nm: 'kedai cetak', xu: 'shirts', X: 'n', a: (f, p) => `Shop A charges a design fee of RM${f} and RM${p} for every shirt printed.`, b: q => `Shop B charges RM${q} for every shirt without a design fee.` },
  { nm: 'sewa kereta', xu: 'days', X: 'h', a: (f, p) => `Company A charges a non-refundable deposit of RM${f} and RM${p} a day to rent a car.`, b: q => `Company B charges RM${q} a day without a deposit.` }
];
function glPlanData(r) {
  const Pn = r.p(GLPLAN); let p, q, n0; do { p = r.i(3, 12) * (Pn.nm === 'sewa kereta' ? 10 : 1); q = p + r.i(2, 6) * (Pn.nm === 'sewa kereta' ? 10 : 1); n0 = r.i(4, 12); } while (false);
  const f = (q - p) * n0, K0 = q * n0;
  return { Pn, p, q, f, n0, K0, desc: `${Pn.a(f, p)} ${Pn.b(q)}` };
}
GL.bandingPelan = r => {
  const d = glPlanData(r), { Pn, p, q, f, n0, K0 } = d, xq = n0 + r.p([-3, -2, 2, 3, 4]);
  const A = p * xq + f, B = q * xq, murah = A < B ? 'A' : 'B';
  const w = [`A: K = ${p}${Pn.X} + ${f}`, `B: K = ${q}${Pn.X}`, `Same cost: ${q}${Pn.X} = ${p}${Pn.X} + ${f} → ${q - p}${Pn.X} = ${f} → ${Pn.X} = ${n0}`, `K = ${q} × ${n0} = RM${K0}`];
  return GEN_LQ('bandingPelan', { desc: d.desc, xu: Pn.xu, xq, ansQ: `Option ${murah} (A: RM${A}, B: RM${B})`, wQ: [`A: K = ${p}(${xq}) + ${f} = RM${A}`, `B: K = ${q}(${xq}) = RM${B}`, `Option ${murah} is cheaper.`], ansT: `(${n0}, ${K0}): the cost of both options is the same, that is RM${K0} for ${n0} ${Pn.xu}`, ans: `${n0} ${Pn.xu} (cost RM${K0})`, work: w });
};
GL.k117 = r => {
  // (a) lilin / tangki: dua data -> persamaan, bila habis
  const Cs = GLCTX.filter(c => c.sg < 0), C = r.p(Cs); let m, c, x1, x2; do { m = r.i(C.mR[0], C.mR[1]); c = m * r.i(6, 15); x1 = r.i(1, 3); x2 = x1 + r.i(2, 4); } while (c < C.cR[0] - 10 || c > C.cR[1] + 30);
  const y1 = c - m * x1, y2 = c - m * x2, T0 = c / m, E = `${C.Y} = ${c} − ${m}${C.X}`;
  const a = { q: `${C.dat(x1, y1, x2, y2)} The relationship between ${C.Y} and ${C.X} is linear. (a) Write the equation of ${C.Y} in terms of ${C.X}. (b) State the meaning of the gradient. (c) After how many ${C.xu} will ${C.nm === 'lilin' ? 'the candle burn out completely' : 'the tank be empty'}?`, ans: `(a) ${E} (b) ${C.mm(m)} (c) ${T0} ${C.xu}`, work: [`m = (${y2} − ${y1}) / (${x2} − ${x1}) = −${m}`, `${y1} = −${m}(${x1}) + c → c = ${c}`, `(a) ${E}`, `(b) Gradient −${m}: ${C.mm(m)}`, `(c) ${C.Y} = 0: ${m}${C.X} = ${c} → ${C.X} = ${T0}`] };
  // (b) banding pelan + keputusan
  const d = glPlanData(r), lo = Math.max(1, d.n0 - r.i(2, 3)), hi = d.n0 + r.i(2, 4);
  const b = { q: `${d.desc} (a) Write the equation of the total payment, RMK, for each option in terms of ${d.Pn.X}, the number of ${d.Pn.xu}. (b) Find the value of ${d.Pn.X} when the total payments of both options are the same. (c) Which option is cheaper for ${lo} ${d.Pn.xu} and for ${hi} ${d.Pn.xu}?`, ans: `(a) A: K = ${d.p}${d.Pn.X} + ${d.f}, B: K = ${d.q}${d.Pn.X} (b) ${d.n0} (c) ${lo} ${d.Pn.xu}: B; ${hi} ${d.Pn.xu}: A`, work: [`(a) A: K = ${d.p}${d.Pn.X} + ${d.f}; B: K = ${d.q}${d.Pn.X}`, `(b) ${d.q}${d.Pn.X} = ${d.p}${d.Pn.X} + ${d.f} → ${d.Pn.X} = ${d.n0}`, `(c) ${lo}: A = RM${d.p * lo + d.f}, B = RM${d.q * lo} → B is cheaper`, `${hi}: A = RM${d.p * hi + d.f}, B = RM${d.q * hi} → A is cheaper`] };
  // (c) dua lilin: sama panjang
  let L1, r1, L2, r2, t0; do { L1 = r.i(20, 30); r1 = r.i(2, 4); r2 = r1 + r.i(1, 3); t0 = r.i(2, 5); L2 = L1 + (r2 - r1) * t0; } while (L2 - r2 * t0 <= 0 || L1 === L2);
  const H0 = L1 - r1 * t0;
  const c3 = { q: `Candle P of length ${L1} cm burns ${r1} cm every hour. Candle Q of length ${L2} cm burns ${r2} cm every hour. Both candles are lit at the same time. (a) Write the equation of the length, H cm, of each candle after t hours. (b) After how many hours will both candles be of the same length? (c) What is the length?`, ans: `(a) P: H = ${L1} − ${r1}t, Q: H = ${L2} − ${r2}t (b) ${t0} hours (c) ${H0} cm`, work: [`(a) P: H = ${L1} − ${r1}t; Q: H = ${L2} − ${r2}t`, `(b) ${L1} − ${r1}t = ${L2} − ${r2}t → ${r2 - r1}t = ${L2 - L1} → t = ${t0}`, `(c) H = ${L1} − ${r1}(${t0}) = ${H0} cm`] };
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

for (const sub in GEN) for (const lv in GEN[sub]) GEN[sub][lv] = GEN[sub][lv].map(f => (...a) => glFxO(f(...a)));   // pecahan bertingkat (25 Nov)
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
for (const k in WG) { const f = WG[k]; WG[k] = (...a) => glFxO(f(...a)); }   // pecahan bertingkat (25 Nov)
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
    () => { const m = glM(glRG, .3), c = nz(-6, 6), asc = Math.random() < .5; const E = glEq(m, c); return asc ? glMcq(`What is the gradient of the straight line <b>${E}</b>?`, glGFig([[0, c, 'pu']], [[m, c, 'am']]), glOpts(glS(m), [fmt(c), glS(glNeg(m)), fmt(-c), glS(glAdd(m, 1))], k => glS(glAdd(m, glDel(k) + 1)))) : glMcq(`What is the y-intercept of the straight line <b>${E}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(fmt(c), [glS(m), fmt(-c), glS(glNeg(m)), fmt(c + 1)], k => fmt(c + glDel(k) + 1)), gPt(0, c, 'pu')); },
    () => { if (Math.random() < .35) { const hor = Math.random() < .5, h = nz(-5, 5), k = nz(-5, 5); return glMcq(`The equation of the straight line that passes through ${P(h, k)} and is parallel to the ${hor ? 'x' : 'y'}-axis is`, glGFig([[h, k, 'am']], []), glOpts(hor ? `y = ${fmt(k)}` : `x = ${fmt(h)}`, [hor ? `x = ${fmt(h)}` : `y = ${fmt(k)}`, hor ? `y = ${fmt(h)}` : `x = ${fmt(k)}`, `y = ${fmt(k)}x`, `y = ${fmt(h)}x`], kk => `y = ${fmt(k + kk)}`)); }
      const m = glMi(glRG, 4), c = nz(-6, 6); return glMcq(`The straight line with a gradient of ${glS(m)} and a y-intercept of ${fmt(c)} is`, glGFig([[0, c, 'pu']], []), glEqOpts(m, c), glGLine(m, c, 'am')); },
    () => { const m = glMi(glRG, 4), c = nz(-6, 6), K = pick([2, 3]); return glMcq(`What is the gradient of the straight line <b>${K}y = ${glRhs(glMul(m, K), K * c)}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(glS(m), [glS(glMul(m, K)), fmt(c), fmt(K * c), glS(glNeg(m))], k => glS(glAdd(m, glDel(k))))); }
  ],
  bentuk: [
    () => { let a, b, c; do { a = nz(-5, 5); b = pick([1, 2, 3, 4, -2, -3]); c = nz(-12, 12); } while (a === b || glGcd(glGcd(a, b), c) !== 1); const m = glQ(-a, b); return glMcq(`What is the gradient of the straight line <b>${glAm(a, b, c)}</b>?`, glGFig([], [[m, glQ(c, b), 'am']]), glOpts(glS(m), [glS(glQ(a, b)), glS(glQ(b, a)), glS(glQ(-b, a)), glS(glQ(c, b))], k => glS(glAdd(m, glDel(k))))); },
    () => { let a, b; do { a = nz(-6, 6); b = nz(-6, 6); } while (Math.abs(a) < 2 || Math.abs(b) < 2 || a === b); const asx = Math.random() < .5; return glMcq(`What is the ${asx ? 'x' : 'y'}-intercept of the straight line <b>${glPin(a, b)}</b>?`, glGFig([], [[glQ(-b, a), b, 'am']]), glOpts(fmt(asx ? a : b), [fmt(asx ? b : a), fmt(asx ? -a : -b), '1', glS(glQ(1, asx ? a : b))], k => fmt((asx ? a : b) + glDel(k)))); },
    () => { const d = glPinData(glRG), asx = Math.random() < .5; return glMcq(`What is the ${asx ? 'x' : 'y'}-intercept of the straight line <b>${d.G}</b>?`, glGFig([], [[glQ(-d.yi, d.xi), d.yi, 'am']]), glOpts(fmt(asx ? d.xi : d.yi), [fmt(asx ? d.yi : d.xi), fmt(asx ? -d.xi : -d.yi), fmt(d.c), fmt(asx ? d.a : d.b)], k => fmt((asx ? d.xi : d.yi) + glDel(k))), gPt(asx ? d.xi : 0, asx ? 0 : d.yi, 'gr')); }
  ],
  titik: [
    () => { const m = nz(-3, 3), c = ri(-3, 3), xs = shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 4), on = xs[0]; const pts = xs.map((x, i) => [x, m * x + c + (i ? pick([-1, 1]) : 0)]); const ok = P(...pts[0]); const o = glOpts(ok, pts.slice(1).map(p => P(...p)), k => P(on, m * on + c + glDel(k) * 2)); return glMcq(`Which point lies on the straight line <b>${glEq(m, c)}</b>?`, glGFig([], [[m, c, 'am']]), o, gPt(pts[0][0], pts[0][1], 'gr')); },
    () => { let m, c, x, y; do { m = nz(-4, 4); c = ri(-5, 5); x = nz(-4, 4); y = m * x + c; } while (Math.abs(y) > 12); return glMcq(`Point (${fmt(x)}, k) lies on the straight line <b>${glEq(m, c)}</b>. Find the value of k.`, glGFig([], [[m, c, 'am']]), glOpts(`k = ${fmt(y)}`, [`k = ${fmt(m * x - c)}`, `k = ${fmt(-y)}`, `k = ${fmt(m + x + c)}`, `k = ${fmt(y + m)}`], k => `k = ${fmt(y + glDel(k))}`), Math.abs(y) <= 6 ? gPt(x, y, 'gr') : ''); },
    () => { let m, c, x, y; do { m = nz(-4, 4); c = ri(-6, 6); x = nz(-3, 3); y = m * x + c; } while (Math.abs(y) > 12 || m === c); return glMcq(`The straight line <b>y = px${glK(c)}</b> passes through point ${P(x, y)}. Find the value of p.`, glGFig(Math.abs(y) <= 6 ? [[x, y, 'gr']] : [], []), glOpts(`p = ${fmt(m)}`, [`p = ${fmt(-m)}`, `p = ${glS(glQ(y + c, x))}`, `p = ${glS(glQ(y, x))}`, `p = ${fmt(m + 1)}`], k => `p = ${fmt(m + glDel(k))}`)); }
  ],
  selari: [
    () => { const m = glM(glRG, .4), c = ri(-6, 6), F = glForm(glRG, m, c, pick(['mxc', 'am'])); return glMcq(`The straight line PQ is parallel to <b>${F.G}</b>. What is the gradient of PQ?`, glGFig([], [[m, c, 'am']]), glOpts(glS(m), [glS(glNeg(m)), glS(glDiv(1, m)), glS(glNeg(glDiv(1, m))), fmt(c)], k => glS(glAdd(m, glDel(k))))); },
    () => { const m = glMi(glRG, 3), c = nz(-5, 5); let c2; do { c2 = ri(-6, 6); } while (c2 === c); const ok = glForm(glRG, m, c2, 'am').G; const w = [glForm(glRG, glNeg(m), c2, 'am').G, glEq(glDiv(1, m), c), glEq(glAdd(m, 1), c2), glForm(glRG, glDiv(-1, m), c2, 'am').G]; return glMcq(`Which equation represents a straight line that is <b>parallel</b> to <b>${glEq(m, c)}</b>?`, glGFig([], [[m, c, 'am']]), glOpts(ok, w, k => glEq(glAdd(m, glDel(k) + 1), c2)), glGLine(m, c2, 'gr')); },
    () => { const m = nz(-4, 4), b = pick([2, 3, -2]), c = nz(-6, 6); return glMcq(`The straight line <b>kx ${b < 0 ? '−' : '+'} ${Math.abs(b)}y = ${fmt(b * c)}</b> is parallel to <b>${glEq(m, c + 1)}</b>. Find the value of k.`, glGFig([], [[m, c + 1, 'am']]), glOpts(`k = ${fmt(-m * b)}`, [`k = ${fmt(m * b)}`, `k = ${fmt(m)}`, `k = ${fmt(-m)}`, `k = ${glS(glQ(m, b))}`], k => `k = ${fmt(-m * b + glDel(k))}`)); }
  ],
  persamaan: [
    () => { let m, x, y, c; do { m = glMi(glRG, 4); x = nz(-3, 3); y = ri(-5, 5); c = glSub(y, glMul(m, x)); } while (Math.abs(glV(c)) > 8); return glMcq(`The equation of the straight line with a gradient of ${glS(m)} that passes through ${P(x, y)} is`, glGFig([[x, y, 'gr']], []), glOpts(glEq(m, c), [glEq(m, glAdd(y, glMul(m, x))), glEq(m, y), glEq(glNeg(m), c), glEq(m, glNeg(c))], k => glEq(m, glAdd(c, glDel(k))))); },
    () => { let x1, y1, x2, y2, m, c; do { x1 = ri(-4, 4); y1 = ri(-5, 5); x2 = ri(-4, 4); y2 = ri(-5, 5); m = x1 === x2 ? [0, 1] : glQ(y2 - y1, x2 - x1); c = glSub(y1, glMul(m, x1)); } while (x1 === x2 || y1 === y2 || !glIsInt(m) || Math.abs(glV(c)) > 8); return glMcq(`The equation of the straight line that passes through ${P(x1, y1)} and ${P(x2, y2)} is`, glGFig([[x1, y1, 'am'], [x2, y2, 'pk']], []), glEqOpts(m, c), glGLine(m, c, 'am')); },
    () => { let x1, y1, x2, y2, m, c; do { x1 = ri(-5, 5); y1 = ri(-5, 5); x2 = ri(-5, 5); y2 = ri(-5, 5); m = x1 === x2 ? [0, 1] : glQ(y2 - y1, x2 - x1); c = glSub(y1, glMul(m, x1)); } while (x1 === x2 || y1 === y2 || glR(m)[1] > 2 || !glIsInt(c) || Math.abs(glV(c)) > 6); return glMcq('Based on the diagram, what is the equation of this straight line?', glGFig([[x1, y1, 'am'], [x2, y2, 'am']], [[m, c, 'am']]), glEqOpts(m, c)); }
  ],
  silang: [
    () => { let m, c, x0, y0; do { m = nz(-3, 3); c = ri(-4, 4); x0 = nz(-4, 4); y0 = m * x0 + c; } while (Math.abs(y0) > 6); return glMcq(`The point of intersection of the straight lines <b>${glEq(m, c)}</b> and <b>x = ${fmt(x0)}</b> is`, gSvg(GLR, glGLine(m, c, 'am') + gLine([x0, -GLR], [x0, GLR], 'pk', .13), 'Two straight lines'), glOpts(P(x0, y0), [P(y0, x0), P(x0, -y0), P(x0, c), P(0, y0)], k => P(x0, y0 + glDel(k))), gPt(x0, y0, 'gr')); },
    () => { let d; do { d = glDuaGaris(glRG, false); } while (Math.abs(d.x0) > 5 || Math.abs(d.y0) > 5); return glMcq(`The point of intersection of the straight lines <b>${glEq(d.m1, d.c1)}</b> and <b>${glEq(d.m2, d.c2)}</b> is`, glGFig([], [[d.m1, d.c1, 'tr'], [d.m2, d.c2, 'pk']]), glOpts(P(d.x0, d.y0), [P(d.y0, d.x0), P(-d.x0, d.y0), P(d.x0, -d.y0), P(0, glV(d.c1))], k => P(d.x0 + glDel(k), d.y0)), gPt(d.x0, d.y0, 'gr')); },
    () => { let d; do { d = glDuaGaris(glRG, false); } while (Math.abs(d.x0) > 4 || Math.abs(d.y0) > 4 || Math.abs(glV(d.m1)) > 3 || Math.abs(glV(d.m2)) > 3); return glMcq('Based on the diagram, what are the coordinates of the point of intersection of these two straight lines?', glGFig([], [[d.m1, d.c1, 'tr'], [d.m2, d.c2, 'pk']]), glOpts(P(d.x0, d.y0), [P(d.y0, d.x0), P(d.x0 + 1, d.y0), P(d.x0, d.y0 - 1), P(-d.x0, -d.y0)], k => P(d.x0 - glDel(k), d.y0 + 1)), gPt(d.x0, d.y0, 'gr')); }
  ],
  masalah: [
    () => { const g = glCtx(glRG), x = ri(2, 8), y = g.f(x); return glMcq(`${g.C.d(g.m, g.c)} ${g.C.ay(x)}`, '', glOpts(g.C.yv(y), [g.C.yv(g.m * x), g.C.yv(g.c + g.m), g.C.yv(g.M * x - g.c), g.C.yv(y + g.m)].map(s => (/−/.test(s) ? null : s)), k => g.C.yv(y + glDel(k) * 2))); },
    () => { const g = glCtx(glRG); return glMcq(`${g.C.d(g.m, g.c)} What is the meaning of the value <b>${g.c}</b>?`, '', glOpts(g.C.cm(g.c), [g.C.mm(g.m), `the total after ${g.c} ${g.C.xu}`, `a rate of change of ${g.c} for each unit`], k => `the value after ${k} ${g.C.xu}`)); },
    () => { const d = glPlanData(glRG); return glMcq(`${d.desc} After how many ${d.Pn.xu} will the total payments of both options be the same?`, '', glOpts(String(d.n0), [String(d.n0 + 1), String(d.n0 - 1), String(Math.round(d.f / d.p)), String(Math.round(d.f / d.q))].filter(s => +s > 0), k => String(d.n0 + glDel(k) * 2))); }
  ]
};
const CQT = { mxc: 'y = mx + c', bentuk: 'Forms of equations', titik: 'Points on a line', selari: 'Parallel lines', persamaan: 'Find the equation', silang: 'Point of intersection', masalah: 'Problem solving' };
function glCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.mxc;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return glFxO(fns[k]());
}
function gq(level) {
  const pool = level === 0 ? ['mxc', 'mxc', 'bentuk', 'titik', 'parallel', 'persamaan', 'silang'] : Object.keys(CQT);
  return glCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return glCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
