'use strict';
/* =================== INDEKS · SOALAN BAB 1 INDEKS (Tingkatan 3) · ENGLISH (DLP) ===================
   Dijana daripada soalan.js oleh alat/nota/terjemah_soalan.py; jangan sunting dengan tangan. */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "ix" / "IX" supaya tidak bertembung dengan teras.
// Tatatanda dalaman: '^{..}' = superskrip. ixOut() menukarnya kepada <sup> sebelum soalan dipaparkan.

/* =================== pembantu nombor =================== */
const ixGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan termudah dengan tanda tolak sebenar (−)
const ixFr = (n, d = 1) => {
  if (d < 0) { n = -n; d = -d; }
  const g = ixGcd(n, d) || 1; n /= g; d /= g;
  return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d);
};
const ixPw = (a, n) => { let v = 1; for (let i = 0; i < n; i++) v *= a; return v; };   // n integer ≥ 0
// num ÷ 10^places sebagai perpuluhan kemas
function ixDec(num, places) {
  let s = String(Math.abs(num)).padStart(places + 1, '0');
  if (places) { s = s.slice(0, s.length - places) + '.' + s.slice(s.length - places); s = s.replace(/\.?0+$/, ''); }
  return (num < 0 ? '−' : '') + s;
}
const ixE = e => (typeof e === 'number' ? fmt(e) : e);              // indeks sebagai teks
// a/b → pecahan bertingkat, √x / ^{n}√x → punca dengan garis atas (penanda dalaman \u0001..\u0006)
const ixH = s => ixFxHtml(ixFx(String(s).replace(/\^\{1\}/g, '')).replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>'));
const ixOut = o => { o.q = ixH(o.q); o.ans = ixH(o.ans); if (o.work) o.work = o.work.map(ixH); if (o.opts) o.opts = o.opts.map(ixH); return o; };
// ekasebutan: c × v1^e1 × v2^e2 ...  (indeks 0 diabaikan, indeks 1 tanpa superskrip)
function ixMono(c, vs) {
  const body = vs.filter(([, e]) => e !== 0).map(([v, e]) => (e === 1 ? v : `${v}^{${fmt(e)}}`)).join('');
  if (!body) return fmt(c);
  return (c === 1 ? '' : c === -1 ? '−' : fmt(c)) + body;
}
const ixSum = (a, k) => (k < 0 ? `${a} − ${-k}` : `${a} + ${k}`);
// rawak: ixRG untuk Latihan Kelas / games, ixRW (berbenih) untuk Lembaran Kerja
const ixRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const ixRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const ixShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ixQ = (key, d, extra) => ixOut(GEN_LQ(key, d, extra));

/* =================== asas =================== */
const IXL = ['m', 'n', 'p', 'x', 'y', 'k', 'h', 'a', 'b'];
const IXFRB = [[1, 2], [2, 3], [3, 4], [1, 3], [2, 5], [3, 5], [1, 4], [4, 5], [5, 6], [3, 7]];
// b = { k: jenis, s: paparan dalam kuasa, v: nilai asas (teks) }
function ixBase(r, kind) {
  kind = kind || r.p(['int', 'int', 'neg', 'frac', 'dec', 'var']);
  if (kind === 'int') { const a = r.i(2, 9); return { k: 'int', a, s: String(a), v: String(a) }; }
  if (kind === 'neg') { const a = -r.i(2, 6); return { k: 'neg', a, s: `(${fmt(a)})`, v: fmt(a) }; }
  if (kind === 'frac') { const [p, q] = r.p(IXFRB); return { k: 'frac', p, q, s: `(${p}/${q})`, v: `${p}/${q}` }; }
  if (kind === 'dec') { const a = r.i(1, 9); return { k: 'dec', a, s: `0.${a}`, v: `0.${a}` }; }
  const v = r.p(IXL); return { k: 'var', a: v, s: v, v };
}
const ixPS = (b, e) => `${b.s}^{${ixE(e)}}`;
const ixRep = (b, n) => Array(n).fill(b.s).join(' × ');
function ixVal(b, n) {
  if (b.k === 'int' || b.k === 'neg') return fmt(ixPw(b.a, n));
  if (b.k === 'frac') return ixFr(ixPw(b.p, n), ixPw(b.q, n));
  if (b.k === 'dec') return ixDec(ixPw(b.a, n), n);
  return ixPS(b, n);
}
// punca kuasa: [a, n, punca] dengan punca^n = a
const IXRT = [[4, 2, 2], [9, 2, 3], [16, 2, 4], [25, 2, 5], [36, 2, 6], [49, 2, 7], [64, 2, 8], [81, 2, 9], [100, 2, 10], [8, 3, 2], [27, 3, 3], [64, 3, 4], [125, 3, 5], [1000, 3, 10], [16, 4, 2], [81, 4, 3], [32, 5, 2], [243, 5, 3]];
const ixRootS = n => (n === 2 ? '√' : `^{${n}}√`);

/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// ixFx: teks dalaman → penanda: \u0001A\u0002B\u0003 = pecahan A/B, \u0004n\u0005X\u0006 = punca ke-n bagi X
const IXAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-z]|[?□]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)(?:\^\{[^}]*\})?`;
const IXFRRE = new RegExp(String.raw`(?<!\w|\d\.)((?:${IXAT})+)\/((?:${IXAT})+)(?!\w|\.\d)`);
const ixUnP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function ixFxConv(s) {
  for (let k = 0; k < 12; k++) {
    const m = s.match(IXFRRE); if (!m) break;
    if (/^[A-Za-z]{3,}$/.test(m[1]) || /^[A-Za-z]{3,}$/.test(m[2])) break;
    s = s.slice(0, m.index) + '\u0001' + ixUnP(m[1]) + '\u0002' + ixUnP(m[2]) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return s;
}
function ixFx(s) {
  s = String(s).replace(/∛/g, '^{3}√').replace(/∜/g, '^{4}√');
  s = s.replace(/(?:\^\{(\d+|n)\})?√(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-z](?:\^\{[^}]*\})?)/g, (m, n, x) => '\u0004' + (n || '') + '\u0005' + ixUnP(x) + '\u0006');
  s = s.replace(/\^\{([^}]*)\}/g, (m, e) => '^{' + ixFxConv(e) + '}');
  return ixFxConv(s);
}
function ixFxHtml(s) {
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++) {
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  }
  return s;
}
// pokok susun atur SVG: [{t:'s',v}|{t:'u',k}|{t:'f',a,b}|{t:'r',n,k}]
function ixFxTree(s) {
  let i = 0;
  const run = stop => {
    const out = []; let buf = '';
    const flush = () => { if (buf) out.push({ t: 's', v: buf }); buf = ''; };
    while (i < s.length) {
      const c = s[i];
      if (stop.includes(c)) break;
      if (c === '^' && s[i + 1] === '{') { flush(); i += 2; const k = run('}'); i++; out.push({ t: 'u', k }); }
      else if (c === '\u0001') { flush(); i++; const a = run('\u0002'); i++; const b = run('\u0003'); i++; out.push({ t: 'f', a, b }); }
      else if (c === '\u0004') { flush(); i++; const n = run('\u0005'); i++; const k = run('\u0006'); i++; out.push({ t: 'r', n, k }); }
      else { buf += c; i++; }
    }
    flush(); return out;
  };
  return run('');
}
// ukur: w = lebar, up/dn = tinggi di atas/bawah garis tengah
function ixFxMeas(L, sz) {
  let w = 0, up = sz * .5, dn = sz * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((w, ch) => w + sz * (ch === ' ' ? .26 : /[()[\].,:;'|]/.test(ch) ? .36 : /1/.test(ch) ? .46 : /\d/.test(ch) ? .63 : /[mwMW]/.test(ch) ? .84 : /[−+=×÷<>]/.test(ch) ? .62 : /[ijlrtf]/.test(ch) ? .34 : /[A-Z]/.test(ch) ? .66 : .57), 0);
    else if (n.t === 'u') { const m = ixFxMeas(n.k, sz * .64); n.w = m.w + sz * .04; up = Math.max(up, sz * .42 + m.up); }
    else if (n.t === 'f') { const s2 = sz * .8, A = ixFxMeas(n.a, s2), B = ixFxMeas(n.b, s2); n.w = Math.max(A.w, B.w) + sz * .24; n.A = A; n.B = B; up = Math.max(up, A.dn + A.up + sz * .12); dn = Math.max(dn, B.up + B.dn + sz * .12); }
    else { const K = ixFxMeas(n.k, sz), N = ixFxMeas(n.n, sz * .5); n.K = K; n.N = N; n.w = K.w + sz * .62 + sz * .12 + (n.n.length ? Math.max(0, N.w - sz * .25) : 0); up = Math.max(up, K.up + sz * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function ixFxDraw(L, x, y, sz, c) {
  let o = '';
  const T = (x, y, v, s) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${+s.toFixed(1)}" font-weight="700" font-family="Space Grotesk, sans-serif" dominant-baseline="central">${v.replace(/ /g, '\u00A0')}</text>`;
  L.forEach(n => {
    if (n.t === 's') o += T(x, y, n.v, sz);
    else if (n.t === 'u') o += ixFxDraw(n.k, x + sz * .02, y - sz * .42, sz * .64, c);
    else if (n.t === 'f') {
      const s2 = sz * .8, sw = Math.max(1.2, sz / 14);
      o += ixFxDraw(n.a, x + (n.w - n.A.w) / 2, y - sz * .12 - n.A.dn, s2, c) + ixFxDraw(n.b, x + (n.w - n.B.w) / 2, y + sz * .12 + n.B.up, s2, c);
      o += `<line x1="${+(x + sz * .06).toFixed(1)}" y1="${+y.toFixed(1)}" x2="${+(x + n.w - sz * .06).toFixed(1)}" y2="${+y.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${+sw.toFixed(1)}"/>`;
    } else {
      const ix = n.n.length ? Math.max(0, n.N.w - sz * .25) : 0, x0 = x + ix, rw = sz * .62, top = y - n.K.up - sz * .1, sw = Math.max(1.2, sz / 13);
      if (n.n.length) o += ixFxDraw(n.n, x, y - sz * .38, sz * .5, c);
      o += `<path d="M${+x0.toFixed(1)} ${+(y + sz * .05).toFixed(1)} L${+(x0 + rw * .3).toFixed(1)} ${+(y - sz * .05).toFixed(1)} L${+(x0 + rw * .6).toFixed(1)} ${+(y + sz * .5).toFixed(1)} L${+(x0 + rw).toFixed(1)} ${+top.toFixed(1)} L${+(x0 + n.w - ix).toFixed(1)} ${+top.toFixed(1)}" fill="none" style="stroke:var(--${c})" stroke-width="${+sw.toFixed(1)}" stroke-linejoin="round"/>`;
      o += ixFxDraw(n.k, x0 + rw + sz * .06, y, sz, c);
    }
    x += n.w;
  });
  return o;
}

/* =================== rajah =================== */
// teks SVG dengan superskrip (tspan naik), warna ikut tema var(--…)
// teks SVG dengan superskrip, pecahan bertingkat dan punca; warna ikut tema var(--…)
function ixSvgT(x, y, t, c = 'tx', sz = 30, a = 'middle') {
  const L = ixFxTree(ixFx(t)), m = ixFxMeas(L, sz), x0 = a === 'start' ? x : a === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${ixFxDraw(L, x0, y, sz, c)}</g>`;
}
const ixTW = (t, sz) => ixFxMeas(ixFxTree(ixFx(t)), sz).w;
const ixTH = (t, sz) => { const m = ixFxMeas(ixFxTree(ixFx(t)), sz); return m.up + m.dn; };
const ixSvg = (s, label, w = 320, h = 214) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// kad ungkapan: lines = satu atau dua baris, cap = tajuk kecil
function ixCard(lines, cap) {
  if (!Array.isArray(lines)) lines = [lines];
  let s = `<rect x="8" y="8" width="304" height="198" rx="22" style="fill:var(--pu);fill-opacity:.08;stroke:var(--pu);stroke-opacity:.45" stroke-width="2"/>`;
  if (cap) s += ixSvgT(160, 38, cap, 'pu', 16);
  const top = cap ? 62 : 30, h = 206 - top - 10, n = lines.length;
  lines.forEach((t, i) => {
    const sz = Math.max(14, Math.min(40, 276 / Math.max(1, ixTW(t, 1)), h / n * 0.62 / Math.max(1, ixTH(t, 1))));
    s += ixSvgT(160, top + h * (i + 0.5) / n, t, 'tx', +sz.toFixed(1));
  });
  return ixSvg(s, 'Index expression');
}
// pokok gandaan: aras 0, 1, 2 (1, b, b² nod)
function ixTreeFig(b) {
  const lv = [40, 106, 172], rr = [13, 11, b * b > 16 ? 6 : 8];
  let s = '', prev = [[160, lv[0]]];
  const nodes = [prev];
  for (let L = 1; L <= 2; L++) {
    const n = ixPw(b, L), xs = Array.from({ length: n }, (_, k) => 20 + (k + 0.5) * 280 / n), cur = xs.map(x => [x, lv[L]]);
    cur.forEach((p, k) => { const q = prev[Math.floor(k / b)]; s += `<line x1="${q[0].toFixed(1)}" y1="${q[1]}" x2="${p[0].toFixed(1)}" y2="${p[1]}" style="stroke:var(--mu)" stroke-width="1.6"/>`; });
    nodes.push(cur); prev = cur;
  }
  nodes.forEach((ps, L) => ps.forEach(([x, y]) => { s += `<circle cx="${x.toFixed(1)}" cy="${y}" r="${rr[L]}" style="fill:var(--gr);fill-opacity:.45;stroke:var(--gr)" stroke-width="2"/>`; }));
  s += ixSvgT(300, 22, 'start: 1', 'mu', 13, 'end') + ixSvgT(300, 86, `stage 1: ${b}`, 'mu', 13, 'end') + ixSvgT(300, 152, `stage 2: ${b}^{2}`, 'mu', 13, 'end') + ixSvgT(160, 202, '…', 'mu', 18);
  return ixSvg(s, `Tree diagram: each branch becomes ${b}`);
}
// pembahagian berulang: a | nilai
function ixLadderFig(a, n) {
  const row = 30, H = 30 + (n + 1) * row;
  let s = '', v = ixPw(a, n);
  for (let i = 0; i <= n; i++) {
    const y = 26 + i * row;
    if (i < n) s += ixSvgT(116, y, String(a), 'tr', 20) + `<line x1="132" y1="${y - 14}" x2="132" y2="${y + 15}" style="stroke:var(--mu)" stroke-width="2"/><line x1="132" y1="${y + 15}" x2="226" y2="${y + 15}" style="stroke:var(--mu)" stroke-width="2"/>`;
    s += ixSvgT(180, y, String(v), v === 1 ? 'gr' : 'tx', 20);
    v /= a;
  }
  s += ixSvgT(250, 26 + n * row / 2, `${n} times`, 'pk', 17, 'start');
  return ixSvg(s, `Repeated division by ${a}, ${n} times`, 320, H);
}

/* =================== data bersama =================== */
const IXBS1 = [
  ['In 7^{4}, the number 7 is the base and 4 is the index.', true, 'The base is the number multiplied repeatedly (7); the index is the number of factors (4).'],
  ['2^{5} = 2 × 5 = 10.', false, '2^{5} = 2 × 2 × 2 × 2 × 2 = 32. The index is not a multiplier.'],
  ['(−3)^{2} = 9.', true, '(−3) × (−3) = 9.'],
  ['−3^{2} = 9.', false, '−3^{2} = −(3 × 3) = −9. The base is 3, not −3.'],
  ['m × m × m × m = 4m.', false, 'm × m × m × m = m^{4}, whereas 4m = m + m + m + m.'],
  ['(2/3)^{2} = 4/9.', true, 'Raise both the numerator and the denominator to the power: 2^{2}/3^{2} = 4/9.'],
  ['2^{3} and 3^{2} have the same value.', false, '2^{3} = 8 but 3^{2} = 9.'],
  ['The number 81 can be written as 3^{4} and also as 9^{2}.', true, '3^{4} = 81 and 9^{2} = 81.'],
  ['(−2)^{5} is a positive number.', false, 'A negative base with an odd index gives a negative value: (−2)^{5} = −32.']
];
const IXBS2 = [
  ['a^{m} × a^{n} = a^{m + n}', true, 'Law of multiplication: same base, add the indices.'],
  ['2^{3} × 2^{4} = 4^{7}', false, 'The bases are not multiplied: 2^{3} × 2^{4} = 2^{7}.'],
  ['(x^{3})^{2} = x^{5}', false, 'Law of powers: the indices are multiplied, (x^{3})^{2} = x^{6}.'],
  ['5^{0} = 1', true, 'Any non-zero number to the power of 0 is 1.'],
  ['2^{−3} = −8', false, '2^{−3} = 1/2^{3} = 1/8. A negative index does not make the value negative.'],
  ['8^{1/3} = 2', true, '8^{1/3} = ^{3}√8 = 2.']
];
const IXNAMA3 = [['P', 'Q', 'R'], ['A', 'B', 'C'], ['K', 'L', 'M']];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 1.1 Tatatanda Indeks ---------- */
  tulis: [
    ({ E }) => ({ q: `Write ${E} in index form.` }),
    ({ E }) => ({ q: `Express the repeated multiplication ${E} as a number in index form.` }),
    ({ E }) => ({ q: `Complete: ${E} = ___` }),
    ({ E, ans, wrong, why }) => { const N = vnama(); return Object.assign({ q: `${N} wrote ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, why)); },
    ({ E, ans, cnt }) => ({ q: `How many identical factors are there in ${E}? Hence, write it in index form.`, ans: `${cnt}; ${ans}` })
  ],
  asasIndeks: [
    ({ X }) => ({ q: `State the base and the index of ${X}.` }),
    ({ X }) => ({ q: `In ${X}, what is the base and what is the index?` }),
    () => ({ q: 'Identify the base and the index of the number in index form below.' }),
    ({ X, bv, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} said the base of ${X} is ${n} and the index is ${bv}. Is ${N} correct?` }, salah(N, ans, 'The base is the number multiplied repeatedly; the index is the small number above it.')); }
  ],
  kembang: [
    ({ X }) => ({ q: `Write ${X} as a repeated multiplication.` }),
    ({ X }) => ({ q: `Express ${X} as a repeated multiplication.` }),
    ({ X }) => ({ q: `Complete: ${X} = ___ (repeated multiplication)` }),
    ({ X, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} wrote ${X} = ${wrong}. Is ${N} correct?` }, salah(N, ans, `${N} multiplied the base by the index. The index shows the number of identical factors.`)); }
  ],
  nilai: [
    ({ X }) => ({ q: `Calculate the value of ${X}.` }),
    ({ X }) => ({ q: `Without using a calculator, find the value of ${X}.` }),
    ({ X }) => ({ q: `Evaluate ${X}.` }),
    ({ X, ans, wrong, why }) => { const N = vnama(); return Object.assign({ q: `${N} calculated ${X} = ${wrong}. Is ${N} correct?` }, salah(N, ans, why)); },
    ({ X, rep }) => ({ q: `Complete: ${X} = ${rep} = ___` })
  ],
  bs: [
    ({ s }) => ({ q: `State whether the following statement is true or false: “${s}”`, ans: '' }),
    ({ s }) => ({ q: `True or false? ${s}`, ans: '' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} said, “${s}” Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  keIndeks: [
    ({ V, bv }) => ({ q: `Write ${V} in index form with base ${bv}.` }),
    ({ V, bv }) => ({ q: `Express ${V} as a number in index form using base ${bv}.` }),
    ({ V, bs }) => ({ q: `Complete: ${V} = ${bs}^{□}` }),
    ({ V, bs, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} said ${V} = ${bs}^{${n + 1}}. Is ${N} correct?` }, salah(N, ans, 'Count the number of identical factors using repeated division.')); }
  ],
  cariN: [
    ({ L, V }) => ({ q: `Given ${L} = ${V}. Find the value of n.` }),
    ({ L, V }) => ({ q: `Find the value of n if ${L} = ${V}.` }),
    ({ L, V }) => ({ q: `Solve ${L} = ${V}.` }),
    ({ bv, V, n }) => ({ q: `How many factors of ${bv} must be multiplied together to obtain ${V}?`, ans: `${n} factors`, rev: true })
  ],
  cariAsas: [
    ({ n, V, c }) => ({ q: `Given x^{${n}} = ${V}${c}. Find the value of x.` }),
    ({ n, V, c }) => ({ q: `Find the value of x if x^{${n}} = ${V}${c}.` }),
    ({ n, V, c, xs }) => ({ q: `Complete${c}: ___^{${n}} = ${V}`, ans: `${xs}^{${n}} = ${V}` })
  ],
  banding: [
    ({ A, B }) => ({ q: `Which number is greater, ${A} or ${B}?` }),
    ({ A, B }) => ({ q: `Compare ${A} with ${B}. Which is greater? Show your working.` }),
    ({ big, small, ans }) => { const N = vnama(); return Object.assign({ q: `${N} said ${small} is greater than ${big}. Is ${N} correct?` }, salah(N, ans, 'Compare the actual values of both numbers.')); },
    ({ A, B, sym }) => ({ q: `Fill in □ with the symbol &gt; or &lt;: ${A} □ ${B}`, ans: `${A} ${sym} ${B}` })
  ],
  harian: [
    ({ b, n }) => ({ q: `A cell divides into ${b} cells every hour. Starting with one cell, how many cells are there after ${n} hours? Write the answer in index form and state its value.` }),
    ({ b, n }) => ({ q: `Aina sends a message to ${b} friends. Each recipient sends the message to ${b} new friends, and so on. How many recipients are there in round ${n}? Write it in index form and state its value.` }),
    ({ b, n }) => ({ q: `A tree branches into ${b} branches. Each branch branches again into ${b} smaller branches, and so on. How many branches are there at stage ${n}? Write it in index form and state its value.` }),
    ({ b, n }) => ({ q: `A large box contains ${b} boxes. Each of those boxes contains ${b} smaller boxes, and so on. How many boxes are there in layer ${n}? Write it in index form and state its value.` })
  ],
  k11: [
    ({ fn }) => ({ q: `A sheet of paper 0.1 mm thick is folded in half ${fn} times. (a) Write the number of layers of paper in index form. (b) Calculate the thickness of the folded paper in mm.`, ans: `(a) 2^{${fn}} layers (b) ${ixDec(ixPw(2, fn), 1)} mm`, work: ['Each fold doubles the number of layers.', `(a) Number of layers = ${Array(fn).fill(2).join(' × ')} = 2^{${fn}} = ${ixPw(2, fn)}`, `(b) Thickness = ${ixPw(2, fn)} × 0.1 = ${ixDec(ixPw(2, fn), 1)} mm`] }),
    ({ tb, tL, tn }) => ({ q: `Find the smallest positive integer n such that ${tb}^{n} &gt; ${tL}.`, ans: `n = ${tn}`, work: [`${tb}^{${tn - 1}} = ${ixPw(tb, tn - 1)} (does not exceed ${tL})`, `${tb}^{${tn}} = ${ixPw(tb, tn)} &gt; ${tL}`, `Hence n = ${tn}`] }),
    ({ tv }) => ({ q: `Write ${tv.V} in index form with three different bases.`, ans: tv.f.slice(0, 3).join(', '), work: tv.f.slice(0, 3).map(f => `${f} = ${tv.V}`).concat(tv.f.length > 3 ? [`Other correct answers: ${tv.f.slice(3).join(', ')}`] : []) }),
    ({ mb, mn }) => { const t = Array.from({ length: mn }, (_, i) => ixPw(mb, i + 1)), S = t.reduce((a, b) => a + b, 0); return { q: `In a message chain, the first round has ${mb} recipients. Each recipient sends the message to ${mb} new people. Calculate the total number of recipients after ${mn} rounds.`, ans: `${S} people`, work: [`Round k has ${mb}^{k} recipients.`, `Jumlah = ${t.map((v, i) => `${mb}^{${i + 1}}`).join(' + ')}`, `= ${t.join(' + ')}`, `= ${S}`] }; },
    ({ su }) => ({ q: `Arrange ${su.map(x => x[0]).join(', ')} in ascending order.`, ans: su.slice().sort((a, b) => a[1] - b[1]).map(x => x[0]).join(', '), work: su.map(x => `${x[0]} = ${x[1]}`).concat([`Ascending order: ${su.slice().sort((a, b) => a[1] - b[1]).map(x => x[1]).join(' &lt; ')}`]) })
  ],

  /* ---------- 1.2 Hukum Indeks ---------- */
  darab: [
    ({ E }) => ({ q: `Simplify ${E}.` }),
    ({ E }) => ({ q: `Simplify ${E} and write the answer in index form.` }),
    ({ E }) => ({ q: `Use the laws of indices to simplify ${E}.` }),
    ({ E, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} wrote ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, 'For multiplication with the same base, the indices are added (not multiplied) and the coefficients are multiplied.')); },
    ({ E }) => ({ q: `Complete: ${E} = ___` })
  ],
  bahagi: [
    ({ E }) => ({ q: `Simplify ${E}.` }),
    ({ E }) => ({ q: `Simplify ${E}.` }),
    ({ E }) => ({ q: `Use the law of division of indices to simplify ${E}.` }),
    ({ E, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} wrote ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, 'For division with the same base, the indices are subtracted (not divided) and the coefficients are divided.')); },
    ({ E }) => ({ q: `Complete: ${E} = ___` })
  ],
  kuasa: [
    ({ E }) => ({ q: `Simplify ${E}.` }),
    ({ E }) => ({ q: `Simplify ${E}.` }),
    ({ E }) => ({ q: `Use the law of powers to simplify ${E}.` }),
    ({ E, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} wrote ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, 'Law of powers: the indices are multiplied, and every factor inside the brackets (including the coefficient) must be raised to the power.')); }
  ],
  sifarNeg: [
    ({ E }) => ({ q: `Calculate the value of ${E}.` }),
    ({ E }) => ({ q: `Evaluate ${E}.` }),
    ({ E }) => ({ q: `Without using a calculator, find the value of ${E}.` }),
    ({ E, ans, wrong, why }) => { const N = vnama(); return Object.assign({ q: `${N} said ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, why)); }
  ],
  indeksPos: [
    ({ E }) => ({ q: `Write ${E} with a positive index.` }),
    ({ E }) => ({ q: `Express ${E} using positive indices only.` }),
    ({ E }) => ({ q: `Complete with a positive index: ${E} = ___` })
  ],
  pecahan: [
    ({ E }) => ({ q: `Calculate the value of ${E}.` }),
    ({ E }) => ({ q: `Without using a calculator, find the value of ${E}.` }),
    ({ E }) => ({ q: `Evaluate ${E}.` }),
    ({ E, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} said ${E} = ${wrong}. Is ${N} correct?` }, salah(N, ans, 'A fractional index is not a multiplier: the denominator is the root, the numerator is the power.')); }
  ],
  punca: [
    ({ E, tgt }) => ({ q: `Write ${E} in ${tgt}.` }),
    ({ E, tgt }) => ({ q: `Express ${E} in ${tgt}.` }),
    ({ E, tgt }) => ({ q: `Convert ${E} into ${tgt}.` })
  ],
  gabung: [
    ({ E, tail }) => ({ q: `Simplify ${E}.${tail}` }),
    ({ E, tail }) => ({ q: `Simplify ${E}.${tail}` }),
    ({ E, tail }) => ({ q: `Use the laws of indices to simplify ${E}.${tail}` }),
    ({ E, tail }) => ({ q: `Complete: ${E} = ___${tail ? ' (positive index)' : ''}` })
  ],
  nilaiGabung: [
    ({ E }) => ({ q: `Without using a calculator, calculate the value of ${E}.` }),
    ({ E }) => ({ q: `Evaluate ${E}.` }),
    ({ E }) => ({ q: `Simplify ${E}, hence find its value.` }),
    ({ E }) => ({ q: `Use the laws of indices to find the value of ${E}.` })
  ],
  persamaan: [
    ({ E }) => ({ q: `Solve ${E}.` }),
    ({ E }) => ({ q: `Find the value of x that satisfies the equation ${E}.` }),
    ({ E }) => ({ q: `Given ${E}, find the value of x.` }),
    ({ E, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} found x = ${wrong} for the equation ${E}. Is ${N} correct?` }, salah(N, ans, 'Write both sides with the same base, then equate the indices.')); }
  ],
  k12: [
    ({ t1 }) => ({ q: `Solve the equation 2^{x} × 4^{${ixSum('x', t1.k)}} = ${t1.V}.`, ans: `x = ${t1.x}`, work: [`4 = 2^{2}, hence 4^{${ixSum('x', t1.k)}} = 2^{${ixSum('2x', 2 * t1.k)}}`, `${t1.V} = 2^{${t1.N}}`, `2^{x + ${ixSum('2x', 2 * t1.k)}} = 2^{${t1.N}} → ${ixSum('3x', 2 * t1.k)} = ${t1.N}`, `3x = ${t1.N - 2 * t1.k} → x = ${t1.x}`] }),
    ({ t2 }) => ({ q: `Given ${t2.b}^{x} × ${t2.b}^{y} = ${ixPw(t2.b, t2.S)} and ${t2.b}^{x} ÷ ${t2.b}^{y} = ${ixPw(t2.b, t2.D)}. Find the values of x and y.`, ans: `x = ${t2.x}, y = ${t2.y}`, work: [`${t2.b}^{x + y} = ${t2.b}^{${t2.S}} → x + y = ${t2.S}`, `${t2.b}^{x − y} = ${t2.b}^{${t2.D}} → x − y = ${t2.D}`, `Add: 2x = ${t2.S + t2.D} → x = ${t2.x}`, `y = ${t2.S} − ${t2.x} = ${t2.y}`] }),
    ({ t3 }) => ({ q: `Simplify ${t3.E}.`, ans: t3.ans, work: t3.work }),
    ({ t4 }) => ({ q: `The number of bacteria in an experiment is given by N = ${t4.N0} × 2^{t}, where t is the time in hours. After how many hours does the number of bacteria become ${t4.N}?`, ans: `t = ${t4.t} hours`, work: [`${t4.N0} × 2^{t} = ${t4.N}`, `2^{t} = ${t4.N} ÷ ${t4.N0} = ${ixPw(2, t4.t)}`, `2^{t} = 2^{${t4.t}} → t = ${t4.t}`] }),
    ({ t5 }) => ({ q: `The mass of a radioactive substance halves every year. The initial mass is ${t5.M} g. The mass after t years is ${t5.M} × (1/2)^{t} g. When does its mass become ${t5.R} g?`, ans: `After ${t5.t} years`, work: [`${t5.M} × (1/2)^{t} = ${t5.R}`, `(1/2)^{t} = ${t5.R}/${t5.M} = 1/${ixPw(2, t5.t)}`, `(1/2)^{t} = (1/2)^{${t5.t}} → t = ${t5.t}`] })
  ]
};

/* =================== pembina soalan (r = ixRG atau ixRW) =================== */
const IX = {};
/* ---------- 1.1 ---------- */
IX.tulis = (r, kind) => {
  kind = kind || r.p(['int', 'int', 'neg', 'frac', 'dec', 'var', 'var2']);
  if (kind === 'var2') {
    const [u, v] = ixShuf(r, IXL).slice(0, 2), m = r.i(2, 5), n = r.i(2, 4);
    const E = Array(m).fill(u).concat(Array(n).fill(v)).join(' × '), ans = `${u}^{${m}}${v}^{${n}}`;
    return ixQ('tulis', { E, ans, cnt: `${m} factors of ${u} and ${n} factors of ${v}`, wrong: `(${u}${v})^{${m + n}}`, why: `Different bases must be written separately: ${m} factors of ${u} and ${n} factors of ${v}.`, work: [`There are ${m} factors of ${u} and ${n} factors of ${v}.`, `Hence ${E} = ${ans}`] });
  }
  const b = ixBase(r, kind), n = b.k === 'var' ? r.i(3, 8) : b.k === 'int' ? r.i(3, 7) : r.i(3, 5);
  const E = ixRep(b, n), ans = ixPS(b, n);
  let wrong, why;
  if (b.k === 'var') { wrong = `${n}${b.a}`; why = `${n}${b.a} is ${b.a} + ${b.a} + …; repeated multiplication is written ${ans}.`; }
  else if (b.k === 'int' && n !== b.a) { wrong = `${n}^{${b.a}}`; why = `The base and the index are swapped. The base is ${b.a} and there are ${n} factors.`; }
  else { wrong = ixPS(b, n + 1); why = `Count the factors again: there are ${n} factors of ${b.s}.`; }
  return ixQ('tulis', { E, ans, cnt: `${n} factors`, wrong, why, work: [`Number of identical factors of ${b.s} = ${n}`, `Hence ${E} = ${ans}`] });
};
IX.asasIndeks = (r, kind) => {
  kind = kind || r.p(['int', 'neg', 'frac', 'var', 'dec', 'tanpa']);
  if (kind === 'tanpa') {
    const a = r.i(2, 9); let n; do n = r.i(2, 6); while (n === a);
    const X = `−${a}^{${n}}`;
    return ixQ('asasIndeks', { X, bv: String(a), n, ans: `Base = ${a}, index = ${n}`, work: ['There are no brackets, so the negative sign is not part of the base.', `${X} = −(${Array(n).fill(a).join(' × ')})`, `Base = ${a}, index = ${n}`] }, { fig: ixCard(X, 'BASE & INDEX') });
  }
  const b = ixBase(r, kind); let n; do n = r.i(2, 12); while (String(n) === b.v);
  const X = ixPS(b, n);
  return ixQ('asasIndeks', { X, bv: b.v, n, ans: `Base = ${b.v}, index = ${n}`, work: [`${X} = ${ixRep(b, Math.min(n, 4))}${n > 4 ? ' × …' : ''} (${n} factors)`, `Base = ${b.v}, index = ${n}`] }, { fig: ixCard(X, 'BASE & INDEX') });
};
IX.kembang = (r, kind) => {
  const b = ixBase(r, kind || r.p(['int', 'neg', 'frac', 'var', 'dec'])), n = r.i(3, 6), X = ixPS(b, n), ans = ixRep(b, n);
  return ixQ('kembang', { X, ans, wrong: `${b.s} × ${n}`, work: [`Index ${n} means ${n} factors of ${b.s}.`, `${X} = ${ans}`] });
};
IX.nilai = (r, kind) => {
  kind = kind || r.p(['int', 'int', 'neg', 'tanpa', 'frac', 'dec']);
  let X, ans, rep, wrong, why, work;
  if (kind === 'int') {
    let a, n; do { a = r.i(2, 10); n = r.i(2, 6); } while (ixPw(a, n) > 10000 || (a === 2 && n === 2) || (a === 10 && n < 3));
    X = `${a}^{${n}}`; rep = Array(n).fill(a).join(' × '); ans = fmt(ixPw(a, n)); wrong = fmt(a * n); why = `${a}^{${n}} is not ${a} × ${n}. The index is the number of factors of ${a}.`;
    work = [`${X} = ${rep}`, `= ${ans}`];
  } else if (kind === 'neg') {
    const a = -r.i(2, 5); let n; do n = r.i(2, 5); while (ixPw(-a, n) > 3125);
    X = `(${fmt(a)})^{${n}}`; rep = Array(n).fill(`(${fmt(a)})`).join(' × '); const v = ixPw(a, n); ans = fmt(v); wrong = fmt(-v);
    why = `Index ${n} is an ${n % 2 ? 'odd' : 'even'} number, so the result is ${v < 0 ? 'negative' : 'positive'}.`;
    work = [`${X} = ${rep}`, `= ${ans} (${n % 2 ? 'odd index → negative' : 'even index → positive'})`];
  } else if (kind === 'tanpa') {
    const a = r.i(2, 5), n = r.p([2, 4]);
    X = `−${a}^{${n}}`; rep = `−(${Array(n).fill(a).join(' × ')})`; ans = fmt(-ixPw(a, n)); wrong = fmt(ixPw(a, n));
    why = `No brackets: the base is ${a}, not −${a}. The negative sign stays outside.`;
    work = [`The base is ${a}, not −${a}.`, `${X} = ${rep}`, `= ${ans}`];
  } else if (kind === 'frac') {
    let p, q, n; do { [p, q] = r.p(IXFRB); n = r.i(2, 4); } while (ixPw(q, n) > 1000);
    X = `(${p}/${q})^{${n}}`; rep = Array(n).fill(`(${p}/${q})`).join(' × '); ans = ixFr(ixPw(p, n), ixPw(q, n)); wrong = ixFr(ixPw(p, n), q);
    why = 'The index must be applied to both the numerator and the denominator.';
    work = [`${X} = ${p}^{${n}}/${q}^{${n}}`, `= ${ans}`];
  } else {
    const k = r.i(2, 9), n = r.i(2, 3);
    X = `0.${k}^{${n}}`; rep = Array(n).fill(`0.${k}`).join(' × '); ans = ixDec(ixPw(k, n), n); wrong = ixDec(ixPw(k, n), n - 1);
    why = `The product of ${n} numbers with one decimal place has ${n} decimal places.`;
    work = [`${X} = ${rep}`, `${Array(n).fill(k).join(' × ')} = ${ixPw(k, n)}, with ${n} decimal places`, `= ${ans}`];
  }
  return ixQ('nilai', { X, ans, rep, wrong, why, work });
};
IX.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return ixQ('bs', { s, ok, ans: ok ? 'True' : 'False', work: [why] }); };
IX.keIndeks = (r, kind) => {
  kind = kind || r.p(['int', 'int', 'neg', 'frac', 'dec']);
  let b, n;
  if (kind === 'int') { do { b = ixBase(r, 'int'); n = r.i(3, 8); } while (ixPw(b.a, n) > 20000 || b.a === 9); }
  else if (kind === 'neg') { do { b = ixBase(r, 'neg'); n = r.i(3, 6); } while (Math.abs(ixPw(b.a, n)) > 5000); }
  else if (kind === 'frac') { do { b = ixBase(r, 'frac'); n = r.i(2, 4); } while (ixPw(b.q, n) > 1000); }
  else { b = ixBase(r, 'dec'); n = r.i(2, 3); if (b.a === 1) b = { k: 'dec', a: 2, s: '0.2', v: '0.2' }; }
  const V = ixVal(b, n), ans = ixPS(b, n);
  let work, figAns;
  if (b.k === 'int') {
    const ch = []; let v = ixPw(b.a, n); while (v >= 1) { ch.push(v); v /= b.a; }
    work = [`Divide ${V} by ${b.a} repeatedly: ${ch.join(' → ')}`, `Number of divisions = ${n}`, `${V} = ${ans}`];
    figAns = ixLadderFig(b.a, n);
  } else if (b.k === 'neg') work = [`${V} = ${ixRep(b, n)}`, `There are ${n} factors of ${b.s}`, `${V} = ${ans}`];
  else if (b.k === 'frac') work = [`${V} = ${b.p}^{${n}}/${b.q}^{${n}}`, `= ${ans}`];
  else work = [`${V} = ${ixRep(b, n)}`, `= ${ans}`];
  return ixQ('keIndeks', { V, bv: b.v, bs: b.s, n, ans, work }, figAns ? { figAns } : {});
};
IX.cariN = (r, kind) => {
  kind = kind || r.p(['int', 'int', 'neg', 'frac']);
  let b, n;
  if (kind === 'int') { do { b = ixBase(r, 'int'); n = r.i(3, 9); } while (ixPw(b.a, n) > 50000); }
  else if (kind === 'neg') { do { b = ixBase(r, 'neg'); n = r.i(3, 6); } while (Math.abs(ixPw(b.a, n)) > 5000); }
  else { do { b = ixBase(r, 'frac'); n = r.i(2, 5); } while (ixPw(b.q, n) > 1000); }
  const V = ixVal(b, n), L = ixPS(b, 'n');
  return ixQ('cariN', { L, V, n, bv: b.v, ans: `n = ${n}`, work: [`Write ${V} in index form: ${V} = ${ixPS(b, n)}`, `${L} = ${ixPS(b, n)}`, `n = ${n}`] });
};
IX.cariAsas = r => {
  let a, n; do { a = r.i(2, 9); n = r.i(2, 5); } while (ixPw(a, n) > 10000);
  if (n % 2 && r.f() < .4) a = -a;
  const V = fmt(ixPw(a, n)), c = n % 2 ? '' : ' (x &gt; 0)';
  return ixQ('cariAsas', { n, V, c, xs: a < 0 ? `(${fmt(a)})` : String(a), ans: `x = ${fmt(a)}`, work: [`Find the number which, when multiplied by itself ${n} times, gives ${V}.`, `${V} = ${Array(n).fill(a < 0 ? `(${fmt(a)})` : a).join(' × ')} = ${a < 0 ? `(${fmt(a)})` : a}^{${n}}`, `x = ${fmt(a)}`] });
};
IX.banding = r => {
  let A, B, vA, vB;
  do {
    if (r.f() < .5) { const a = r.i(2, 6), b = r.i(2, 9); A = `${a}^{${b}}`; B = `${b}^{${a}}`; vA = ixPw(a, b); vB = ixPw(b, a); }
    else { const a = r.i(2, 9), b = r.i(2, 9), m = r.i(2, 6), n = r.i(2, 6); A = `${a}^{${m}}`; B = `${b}^{${n}}`; vA = ixPw(a, m); vB = ixPw(b, n); }
  } while (vA === vB || A === B || Math.max(vA, vB) > 100000 || Math.abs(vA - vB) / Math.max(vA, vB) > .7);
  const big = vA > vB ? A : B, small = vA > vB ? B : A, vb = Math.max(vA, vB), vs = Math.min(vA, vB);
  return ixQ('banding', { A, B, big, small, sym: vA > vB ? '&gt;' : '&lt;', ans: `${big} is greater (${vb} &gt; ${vs})`, work: [`${A} = ${vA}`, `${B} = ${vB}`, `${vb} &gt; ${vs}, hence ${big} is greater.`] });
};
IX.harian = r => {
  let b, n; do { b = r.i(2, 5); n = r.i(3, 7); } while (ixPw(b, n) > 4096 || ixPw(b, n) < 27);
  const V = ixPw(b, n);
  return ixQ('harian', { b, n, ans: `${b}^{${n}} = ${V}`, work: [`The number is multiplied by ${b} at every stage.`, `Stage ${n}: ${Array(n).fill(b).join(' × ')}`, `= ${b}^{${n}} = ${V}`] }, { fig: ixTreeFig(b) });
};
const IXTV = [{ V: 64, f: ['2^{6}', '4^{3}', '8^{2}', '(−2)^{6}', '(−8)^{2}'] }, { V: 256, f: ['2^{8}', '4^{4}', '16^{2}', '(−2)^{8}', '(−4)^{4}', '(−16)^{2}'] }, { V: 729, f: ['3^{6}', '9^{3}', '27^{2}', '(−3)^{6}', '(−27)^{2}'] }, { V: 4096, f: ['2^{12}', '4^{6}', '8^{4}', '16^{3}', '64^{2}'] }, { V: 81, f: ['3^{4}', '9^{2}', '(−3)^{4}', '(−9)^{2}'] }];
IX.k11 = r => {
  const fn = r.i(5, 10);
  let tb, tL, tn; do { tb = r.i(2, 5); tL = r.p([100, 200, 300, 500, 1000, 2000, 5000]); tn = 1; while (ixPw(tb, tn) <= tL) tn++; } while (tn < 3);
  const tv = r.p(IXTV), mb = r.i(2, 4), mn = r.i(3, mb === 2 ? 6 : 4);
  let su; do { su = [0, 1, 2].map(() => { const a = r.i(2, 9), m = r.i(2, 5); return [`${a}^{${m}}`, ixPw(a, m)]; }); } while (new Set(su.map(x => x[1])).size < 3 || su.some(x => x[1] > 20000));
  return ixOut(vq('k11', { fn, tb, tL, tn, tv, mb, mn, su }));
};

/* ---------- 1.2 ---------- */
const IXNB = ['2', '3', '5', '7', '10', 'a', 'x', 'm'];
IX.darab = (r, kind) => {
  kind = kind || r.p(['num', 'tiga', 'alg', 'dua']);
  let E, ans, wrong, work;
  if (kind === 'num' || kind === 'tiga') {
    const b = r.p(IXNB); let m, n, p; do { m = r.i(2, 9); n = r.i(2, 9); p = r.i(1, 6); } while (m * n === m + n);
    if (kind === 'num') { E = `${b}^{${m}} × ${b}^{${n}}`; ans = `${b}^{${m + n}}`; wrong = `${b}^{${m * n}}`; work = [`${E} = ${b}^{${m} + ${n}}`, `= ${ans}`]; }
    else { const pS = p === 1 ? b : `${b}^{${p}}`; E = `${b}^{${m}} × ${pS} × ${b}^{${n}}`; ans = `${b}^{${m + n + p}}`; wrong = `${b}^{${m * n * p}}`; work = [`${E} = ${b}^{${m} + ${p} + ${n}}`, `= ${ans}`]; }
  } else if (kind === 'alg') {
    const v = r.p(IXL), c1 = r.i(2, 6), c2 = r.i(2, 6); let m, n; do { m = r.i(1, 6); n = r.i(2, 6); } while (m * n === m + n);
    E = `${ixMono(c1, [[v, m]])} × ${ixMono(c2, [[v, n]])}`; ans = ixMono(c1 * c2, [[v, m + n]]); wrong = ixMono(c1 * c2, [[v, m * n]]);
    work = [`Multiply the coefficients: ${c1} × ${c2} = ${c1 * c2}`, `Add the indices: ${v}^{${m} + ${n}} = ${v}^{${m + n}}`, `= ${ans}`];
  } else {
    const [u, v] = ixShuf(r, IXL).slice(0, 2), c1 = r.i(2, 5), c2 = r.i(2, 5), a = r.i(1, 5), b = r.i(1, 4), c = r.i(1, 4), d = r.i(1, 5);
    E = `${ixMono(c1, [[u, a], [v, b]])} × ${ixMono(c2, [[u, c], [v, d]])}`; ans = ixMono(c1 * c2, [[u, a + c], [v, b + d]]); wrong = ixMono(c1 + c2, [[u, a + c], [v, b + d]]);
    work = [`Multiply the coefficients: ${c1} × ${c2} = ${c1 * c2}`, `${u}: ${u}^{${a} + ${c}} = ${u}^{${a + c}} · ${v}: ${v}^{${b} + ${d}} = ${v}^{${b + d}}`, `= ${ans}`];
  }
  return ixQ('darab', { E, ans, wrong, work });
};
IX.bahagi = (r, kind) => {
  kind = kind || r.p(['num', 'alg', 'dua']);
  let E, ans, wrong, work;
  if (kind === 'num') {
    const b = r.p(IXNB); let m, n; do { m = r.i(5, 14); n = r.i(2, m - 1); } while (m - n === 1 && r.f() < .7);
    E = `${b}^{${m}} ÷ ${b}^{${n}}`; ans = `${b}^{${m - n}}`.replace('^{1}', ''); wrong = m % n === 0 ? `${b}^{${m / n}}` : `${b}^{${m + n}}`;
    work = [`${E} = ${b}^{${m} − ${n}}`, `= ${ans}`];
  } else if (kind === 'alg') {
    const v = r.p(IXL), c2 = r.i(2, 6), k = r.i(2, 6), c1 = c2 * k; let m, n; do { m = r.i(4, 10); n = r.i(1, m - 1); } while (m % n === 0 && m / n === m - n);
    E = `${ixMono(c1, [[v, m]])} ÷ ${ixMono(c2, [[v, n]])}`; ans = ixMono(k, [[v, m - n]]); wrong = m % n === 0 ? ixMono(k, [[v, m / n]]) : ixMono(c1 - c2, [[v, m - n]]);
    work = [`Divide the coefficients: ${c1} ÷ ${c2} = ${k}`, `Subtract the indices: ${v}^{${m} − ${n}} = ${v}^{${m - n}}`, `= ${ans}`];
  } else {
    const [u, v] = ixShuf(r, IXL).slice(0, 2), c2 = r.i(2, 5), k = r.i(1, 5), c1 = c2 * k, a = r.i(3, 8), b = r.i(3, 7), c = r.i(1, a - 1), d = r.i(1, b - 1);
    E = `${ixMono(c1, [[u, a], [v, b]])} ÷ ${ixMono(c2, [[u, c], [v, d]])}`; ans = ixMono(k, [[u, a - c], [v, b - d]]); wrong = ixMono(k, [[u, a + c], [v, b + d]]);
    work = [`Divide the coefficients: ${c1} ÷ ${c2} = ${k}`, `${u}: ${u}^{${a} − ${c}} = ${u}^{${a - c}} · ${v}: ${v}^{${b} − ${d}} = ${v}^{${b - d}}`, `= ${ans}`];
  }
  return ixQ('bahagi', { E, ans, wrong, work });
};
IX.kuasa = (r, kind) => {
  kind = kind || r.p(['num', 'alg', 'dua', 'pec']);
  let E, ans, wrong, work;
  if (kind === 'num') {
    const b = r.p(IXNB); let m, n; do { m = r.i(2, 6); n = r.i(2, 5); } while (m * n === m + n);
    E = `(${b}^{${m}})^{${n}}`; ans = `${b}^{${m * n}}`; wrong = `${b}^{${m + n}}`; work = [`${E} = ${b}^{${m} × ${n}}`, `= ${ans}`];
  } else if (kind === 'alg') {
    const v = r.p(IXL); let c, m, n; do { c = r.i(2, 5); m = r.i(2, 5); n = r.i(2, 3); } while (ixPw(c, n) > 125);
    E = `(${ixMono(c, [[v, m]])})^{${n}}`; ans = ixMono(ixPw(c, n), [[v, m * n]]); wrong = ixMono(c, [[v, m * n]]);
    work = [`${E} = ${c}^{${n}} × ${v}^{${m} × ${n}}`, `= ${ans}`];
  } else if (kind === 'dua') {
    const [u, v] = ixShuf(r, IXL).slice(0, 2), a = r.i(1, 5), b = r.i(2, 5), n = r.i(2, 4);
    E = `(${ixMono(1, [[u, a], [v, b]])})^{${n}}`; ans = ixMono(1, [[u, a * n], [v, b * n]]); wrong = ixMono(1, [[u, a + n], [v, b + n]]);
    work = [`Multiply each index by ${n}.`, `${u}^{${a} × ${n}}${v}^{${b} × ${n}}`, `= ${ans}`];
  } else {
    const [u, v] = ixShuf(r, IXL).slice(0, 2), a = r.i(2, 5), b = r.i(1, 4), n = r.i(2, 4);
    E = `(${ixMono(1, [[u, a]])}/${ixMono(1, [[v, b]])})^{${n}}`; ans = `${ixMono(1, [[u, a * n]])}/${ixMono(1, [[v, b * n]])}`; wrong = `${ixMono(1, [[u, a * n]])}/${ixMono(1, [[v, b]])}`;
    work = ['Raise both the numerator and the denominator to the power.', `${u}^{${a} × ${n}}/${v}^{${b} × ${n}}`, `= ${ans}`];
  }
  return ixQ('kuasa', { E, ans, wrong, work });
};
IX.sifarNeg = (r, kind) => {
  kind = kind || r.p(['nol', 'neg', 'neg', 'fneg', 'koef']);
  let E, ans, wrong, why, work;
  if (kind === 'nol') {
    const a = r.i(2, 99), [p, q] = r.p(IXFRB), f = r.i(0, 3);
    E = [`${a}^{0}`, `(${fmt(-a)})^{0}`, `(${p}/${q})^{0}`, `${a * 37}^{0}`][f]; ans = '1'; wrong = '0'; why = 'Any non-zero number to the power of 0 is 1.';
    work = ['a^{0} = 1 for a ≠ 0', `${E} = 1`];
  } else if (kind === 'neg') {
    let a, n; do { a = r.i(2, 10); n = r.i(1, 4); } while (ixPw(a, n) > 1000 || (n === 1 && r.f() < .6));
    E = `${a}^{${fmt(-n)}}`; ans = `1/${ixPw(a, n)}`; wrong = fmt(-ixPw(a, n)); why = 'A negative index means the reciprocal, not a negative value.';
    work = [`${E} = 1/${a}^{${n}}`, `= ${ans}`];
  } else if (kind === 'fneg') {
    let p, q, n; do { [p, q] = r.p(IXFRB); n = r.i(1, 3); } while (ixPw(Math.max(p, q), n) > 500);
    E = `(${p}/${q})^{${fmt(-n)}}`; ans = ixFr(ixPw(q, n), ixPw(p, n)); wrong = ixFr(ixPw(p, n), ixPw(q, n)); why = 'Negative index: invert the fraction first, then raise it to the power.';
    work = [`${E} = (${q}/${p})^{${n}}`, `= ${ixPw(q, n)}/${ixPw(p, n)}`].concat(ans === `${ixPw(q, n)}/${ixPw(p, n)}` ? [] : [`= ${ans}`]);
  } else {
    const c = r.i(2, 12), v = r.p(IXL);
    E = `${c}${v}^{0}`; ans = String(c); wrong = '1'; why = `Only ${v}^{0} = 1; the coefficient ${c} does not change.`;
    work = [`${v}^{0} = 1 (${v} ≠ 0)`, `${E} = ${c} × 1 = ${c}`];
  }
  return ixQ('sifarNeg', { E, ans, wrong, why, work });
};
IX.indeksPos = (r, kind) => {
  kind = kind || r.p(['satu', 'koef', 'dua', 'balik']);
  const [u, v] = ixShuf(r, IXL).slice(0, 2), n = r.i(2, 7), c = r.i(2, 9), a = r.i(1, 5);
  let E, ans, work;
  if (kind === 'satu') { E = `${v}^{${fmt(-n)}}`; ans = `1/${v}^{${n}}`; work = [`a^{−n} = 1/a^{n}`, `${E} = ${ans}`]; }
  else if (kind === 'koef') { E = `${c}${v}^{${fmt(-n)}}`; ans = `${c}/${v}^{${n}}`; work = [`Only ${v} has a negative index; the coefficient ${c} stays in the numerator.`, `${E} = ${c} × 1/${v}^{${n}} = ${ans}`]; }
  else if (kind === 'dua') { E = `${ixMono(1, [[u, a]])}${v}^{${fmt(-n)}}`; ans = `${ixMono(1, [[u, a]])}/${v}^{${n}}`; work = [`${v}^{${fmt(-n)}} = 1/${v}^{${n}}`, `${E} = ${ans}`]; }
  else { E = `1/${v}^{${fmt(-n)}}`; ans = `${v}^{${n}}`; work = [`1/a^{−n} = a^{n}`, `${E} = ${ans}`]; }
  return ixQ('indeksPos', { E, ans, work });
};
IX.pecahan = (r, kind) => {
  kind = kind || r.p(['satu', 'mn', 'mn', 'neg']);
  let E, ans, wrong, work;
  if (kind === 'satu') {
    const [a, n, rt] = r.p(IXRT);
    E = `${a}^{1/${n}}`; ans = String(rt); wrong = ixFr(a, n);
    work = [`${E} = ${ixRootS(n)}${a}`, `${rt}^{${n}} = ${a}, hence ${E} = ${rt}`];
  } else {
    let a, n, rt, m; do { [a, n, rt] = r.p(IXRT); m = r.i(2, 5); } while (ixGcd(m, n) !== 1 || ixPw(rt, m) > 1000);
    const v = ixPw(rt, m), neg = kind === 'neg';
    E = `${a}^{${neg ? '−' : ''}${m}/${n}}`; ans = neg ? `1/${v}` : String(v); wrong = neg ? fmt(-v) : ixFr(a * m, n);
    work = (neg ? [`${E} = 1/${a}^{${m}/${n}}`] : []).concat([`${a}^{${m}/${n}} = (${ixRootS(n)}${a})^{${m}}`, `= ${rt}^{${m}}`, `= ${v}`]).concat(neg ? [`Hence ${E} = ${ans}`] : []);
  }
  return ixQ('pecahan', { E, ans, wrong, work });
};
IX.punca = (r, kind) => {
  kind = kind || r.p(['kePunca', 'keIndeks']);
  const v = r.p(IXL); let m, n; do { n = r.i(2, 5); m = r.i(1, 5); } while (ixGcd(m, n) !== 1);
  const ind = `${v}^{${m}/${n}}`, rt = m === 1 ? `${ixRootS(n)}${v}` : `${ixRootS(n)}(${v}^{${m}})`, alt = m === 1 ? '' : ` or (${ixRootS(n)}${v})^{${m}}`;
  if (kind === 'kePunca') return ixQ('punca', { E: ind, tgt: 'root form', ans: rt + alt, work: ['a^{m/n} = ^{n}√(a^{m})', `Denominator ${n} → root ${n}, numerator ${m} → power ${m}`, `${ind} = ${rt}${alt}`] });
  return ixQ('punca', { E: rt, tgt: 'index form', ans: ind, work: [`Root ${n} → the denominator of the index is ${n}`, `Power ${m} → the numerator of the index is ${m}`, `${rt} = ${ind}`] });
};
IX.gabung = (r, kind) => {
  kind = kind || r.p(['A', 'A', 'B', 'C']);
  const v = r.p(IXL);
  let E, ans, work, tail = '';
  if (kind === 'A') {
    let c, p, q, b, s0, d, s, numc, e;
    do { c = r.i(1, 3); p = r.i(1, 4); q = r.i(2, 3); b = r.i(1, 6); s0 = r.i(1, 5); numc = ixPw(c, q) * b; const ds = []; for (let k = 2; k <= numc; k++) if (numc % k === 0) ds.push(k); d = ds.length ? r.p(ds) : 1; e = p * q + s0; s = r.i(1, e - 1); } while (numc > 60);
    const ex = p * q + s0 - s, k = numc / d;
    E = `(${ixMono(c, [[v, p]])})^{${q}} × ${ixMono(b, [[v, s0]])} ÷ ${ixMono(d, [[v, s]])}`; ans = ixMono(k, [[v, ex]]);
    work = [`(${ixMono(c, [[v, p]])})^{${q}} = ${ixMono(ixPw(c, q), [[v, p * q]])}`, `${ixMono(ixPw(c, q), [[v, p * q]])} × ${ixMono(b, [[v, s0]])} = ${ixMono(numc, [[v, p * q + s0]])}`, `${ixMono(numc, [[v, p * q + s0]])} ÷ ${ixMono(d, [[v, s]])} = ${ans}`];
  } else if (kind === 'B') {
    const [u, w] = ixShuf(r, IXL).slice(0, 2), a = r.i(2, 5), b = r.i(2, 5), c = r.i(1, 3), k = r.i(2, 3);
    const d = r.i(1, a + k - 1), e = r.i(1, b + c * k - 1);
    E = `${ixMono(1, [[u, a], [w, b]])} × (${ixMono(1, [[u, 1], [w, c]])})^{${k}} ÷ ${ixMono(1, [[u, d], [w, e]])}`; ans = ixMono(1, [[u, a + k - d], [w, b + c * k - e]]);
    work = [`(${ixMono(1, [[u, 1], [w, c]])})^{${k}} = ${ixMono(1, [[u, k], [w, c * k]])}`, `${u}: ${a} + ${k} − ${d} = ${a + k - d} · ${w}: ${b} + ${c * k} − ${e} = ${b + c * k - e}`, `= ${ans}`];
  } else {
    let a, b, c; do { a = r.i(2, 6); b = r.i(3, 9); c = r.i(1, 4); } while (a - b - c >= 0);
    const ex = a - b - c; tail = ' Write the answer with a positive index.';
    E = `${v}^{${a}} × ${v}^{${fmt(-b)}} ÷ ${v}^{${c}}`; ans = `1/${ixMono(1, [[v, -ex]])}`;
    work = [`${v}^{${a} + (${fmt(-b)}) − ${c}} = ${v}^{${fmt(ex)}}`, `= ${ans}`];
  }
  return ixQ('gabung', { E, ans, tail, work });
};
const IXB2 = [['2', 1], ['4', 2], ['8', 3], ['16', 4]], IXB3 = [['3', 1], ['9', 2], ['27', 3]];
IX.nilaiGabung = (r, kind) => {
  kind = kind || r.p(['sama', 'tukar', 'tukar', 'pecah']);
  let E, ans, work;
  if (kind === 'sama') {
    const b = r.p([2, 3, 5, 10]); let m, n, p, e; do { m = r.i(2, 9); n = r.i(1, 7); p = r.i(2, 12); e = m + n - p; } while (e < 0 || ixPw(b, e) > 1000);
    E = `${b}^{${m}} × ${b}^{${n}} ÷ ${b}^{${p}}`; ans = fmt(ixPw(b, e));
    work = [`= ${b}^{${m} + ${n} − ${p}}`, `= ${b}^{${e}}`, `= ${ans}`];
  } else if (kind === 'tukar') {
    const [p, L] = r.f() < .6 ? [2, IXB2] : [3, IXB3];
    let t, e; do { t = [0, 1, 2].map(() => [r.p(L), r.i(1, 4)]); e = t[0][0][1] * t[0][1] + t[1][0][1] * t[1][1] - t[2][0][1] * t[2][1]; } while (e < -3 || e > (p === 2 ? 7 : 4) || new Set(t.map(x => x[0][0])).size < 2);
    const S = ([[B], k]) => (k === 1 ? B : `${B}^{${k}}`), C = ([[, s], k]) => `${p}^{${s * k}}`;
    E = `${S(t[0])} × ${S(t[1])} ÷ ${S(t[2])}`; ans = e >= 0 ? fmt(ixPw(p, e)) : `1/${ixPw(p, -e)}`;
    work = [`Convert to base ${p}: ${C(t[0])} × ${C(t[1])} ÷ ${C(t[2])}`, `= ${p}^{${t[0][0][1] * t[0][1]} + ${t[1][0][1] * t[1][1]} − ${t[2][0][1] * t[2][1]}} = ${p}^{${fmt(e)}}`, `= ${ans}`];
  } else {
    let a, n, rt, m, b, k; do { [a, n, rt] = r.p(IXRT); m = r.i(1, 3); b = r.p([2, 3, 4, 5]); k = r.i(1, 2); } while (ixGcd(m, n) !== 1 || ixPw(rt, m) > 200 || ixPw(b, k) > 25);
    const v1 = ixPw(rt, m), dv = ixPw(b, k);
    E = `${a}^{${m}/${n}} × ${b}^{${fmt(-k)}}`; ans = ixFr(v1, dv);
    work = [`${a}^{${m}/${n}} = (${ixRootS(n)}${a})^{${m}} = ${v1}`, `${b}^{${fmt(-k)}} = 1/${dv}`, `${v1} × 1/${dv} = ${ans}`];
  }
  return ixQ('nilaiGabung', { E, ans, work });
};
const IXF3 = [[4, 2, 1, 8, 3], [4, 2, 1, 32, 5], [9, 3, 2, 27, 3], [9, 3, 2, 243, 5], [8, 2, 3, 16, 4], [8, 2, 3, 4, 2], [25, 5, 2, 125, 3], [27, 3, 3, 9, 2], [27, 3, 3, 81, 4], [16, 2, 4, 8, 3], [4, 2, 1, 2, 1], [9, 3, 2, 3, 1]];
function ixPersData(r, kind) {
  kind = kind || r.p(['F1', 'F2', 'F3', 'F4', 'F5']);
  const b = r.p([2, 3, 5]);
  let E, x, work, wrong;
  if (kind === 'F1') {
    let N, k; do { N = r.i(2, 7); k = r.n(-3, 3); } while (ixPw(b, N) > 3125 || N - k === 0);
    x = String(N - k); E = `${b}^{${ixSum('x', k)}} = ${ixPw(b, N)}`; wrong = String(N + k);
    work = [`${ixPw(b, N)} = ${b}^{${N}}`, `${ixSum('x', k)} = ${N}`, `x = ${x}`];
  } else if (kind === 'F2') {
    let p, xx, q, N; do { p = r.i(2, 3); xx = r.i(1, 4); q = r.i(1, 5); N = p * xx - q; } while (N < 1 || ixPw(b, N) > 3125);
    x = String(xx); E = `${b}^{${p}x − ${q}} = ${ixPw(b, N)}`; wrong = ixFr(N, p);
    work = [`${ixPw(b, N)} = ${b}^{${N}}`, `${p}x − ${q} = ${N}`, `${p}x = ${N + q} → x = ${x}`];
  } else if (kind === 'F3') {
    const [B, p, s, V, t] = r.p(IXF3);
    x = ixFr(t, s); E = `${B}^{x} = ${V}`; wrong = ixFr(V, B);
    work = [`Write with base ${p}: ${B} = ${p}^{${s}}, ${V} = ${p}^{${t}}`, `${s === 1 ? `${p}^{x}` : `${p}^{${s}x}`} = ${p}^{${t}}`, `${s === 1 ? 'x' : `${s}x`} = ${t} → x = ${x}`];
  } else if (kind === 'F4') {
    let N, k; do { N = r.i(3, 8); k = r.i(1, N - 1); } while (ixPw(b, N) > 3125);
    x = String(N - k); E = `${b}^{x} × ${b}^{${k}} = ${ixPw(b, N)}`; wrong = String(N);
    work = [`${b}^{x + ${k}} = ${b}^{${N}}`, `x + ${k} = ${N}`, `x = ${x}`];
  } else {
    let N; do N = r.i(1, 5); while (ixPw(b, N) > 625);
    x = fmt(-N); E = `${b}^{x} = 1/${ixPw(b, N)}`; wrong = String(N);
    work = [`1/${ixPw(b, N)} = 1/${b}^{${N}} = ${b}^{${fmt(-N)}}`, `${b}^{x} = ${b}^{${fmt(-N)}}`, `x = ${x}`];
  }
  if (wrong === x) wrong = x === '1' ? '2' : '1';
  return { E, x, wrong, work };
}
IX.persamaan = (r, kind) => { const d = ixPersData(r, kind); return ixQ('persamaan', { E: d.E, ans: `x = ${d.x}`, wrong: d.wrong, work: d.work }); };
IX.k12 = r => {
  let t1; do { const x = r.i(1, 3), k = r.i(1, 2), N = 3 * x + 2 * k; t1 = { x, k, N, V: ixPw(2, N) }; } while (t1.N > 12);
  let t2; do { const b = r.p([2, 3]), x = r.i(2, 5), y = r.i(1, x - 1); t2 = { b, x, y, S: x + y, D: x - y }; } while (ixPw(t2.b, t2.S) > 6561);
  let t3; do {
    const v = r.p(IXL), n = r.p([2, 3, 4]), c = r.i(2, 3), a = r.i(1, 3), m = r.i(1, 3);
    if (ixGcd(m, n) !== 1 || ixPw(c, n) > 81) { t3 = null; continue; }
    const E = `(${ixMono(ixPw(c, n), [[v, a * n]])})^{${m}/${n}}`, ans = ixMono(ixPw(c, m), [[v, a * m]]);
    t3 = { E, ans, work: [`${ixPw(c, n)} = ${c}^{${n}}`, `(${c}^{${n}})^{${m}/${n}} = ${c}^{${m}} = ${ixPw(c, m)}`, `(${v}^{${a * n}})^{${m}/${n}} = ${v}^{${a * n} × ${m}/${n}} = ${v}^{${a * m}}`, `= ${ans}`] };
  } while (!t3);
  const N0 = r.p([3, 5, 6, 10, 25]), tt = r.i(3, 7), t4 = { N0, t: tt, N: N0 * ixPw(2, tt) };
  let t5; do { const M = r.p([640, 800, 960, 1280, 1600]), t = r.i(2, 6); t5 = { M, t, R: M / ixPw(2, t) }; } while (!Number.isInteger(t5.R));
  return ixOut(vq('k12', { t1, t2, t3, t4, t5 }));
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '1.1': {
    m: [() => IX.tulis(ixRG), () => IX.asasIndeks(ixRG), () => IX.kembang(ixRG), () => IX.nilai(ixRG), () => IX.nilai(ixRG), () => IX.bs(ixRG, IXBS1)],
    s: [() => IX.keIndeks(ixRG), () => IX.cariN(ixRG), () => IX.cariAsas(ixRG), () => IX.banding(ixRG), () => IX.harian(ixRG)],
    k: [() => IX.k11(ixRG)]
  },
  '1.2': {
    m: [() => IX.darab(ixRG), () => IX.bahagi(ixRG), () => IX.kuasa(ixRG), () => IX.sifarNeg(ixRG), () => IX.indeksPos(ixRG), () => IX.pecahan(ixRG), () => IX.bs(ixRG, IXBS2)],
    s: [() => IX.gabung(ixRG), () => IX.nilaiGabung(ixRG), () => IX.persamaan(ixRG), () => IX.punca(ixRG)],
    k: [() => IX.k12(ixRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 1.1
WG.tulis = i => IX.tulis(ixRW, ['int', 'neg', 'frac', 'var', 'dec', 'var2', 'int'][i % 7]);
WG.asasIndeks = i => IX.asasIndeks(ixRW, ['neg', 'frac', 'tanpa', 'int', 'var'][i % 5]);
WG.kembang = i => IX.kembang(ixRW, ['int', 'neg', 'frac', 'var'][i % 4]);
WG.nilai = i => IX.nilai(ixRW, ['int', 'neg', 'tanpa', 'frac', 'dec', 'int'][i % 6]);
WG.bs1 = i => IX.bs(ixRW, IXBS1, [1, 3, 4][i % 3] + wri(0, 1) * [0, 2, 2][i % 3]);
WG.keIndeks = i => IX.keIndeks(ixRW, ['int', 'frac', 'neg', 'int', 'dec'][i % 5]);
WG.cariN = i => IX.cariN(ixRW, ['int', 'frac', 'neg'][i % 3]);
WG.cariAsas = () => IX.cariAsas(ixRW);
WG.banding = () => IX.banding(ixRW);
WG.harian = () => IX.harian(ixRW);
WG.k11 = () => IX.k11(ixRW);
// 1.2
WG.darab = i => IX.darab(ixRW, ['num', 'alg', 'tiga', 'dua'][i % 4]);
WG.bahagi = i => IX.bahagi(ixRW, ['num', 'alg', 'dua'][i % 3]);
WG.kuasa = i => IX.kuasa(ixRW, ['num', 'alg', 'dua', 'pec'][i % 4]);
WG.sifarNeg = i => IX.sifarNeg(ixRW, ['nol', 'neg', 'fneg', 'koef'][i % 4]);
WG.indeksPos = i => IX.indeksPos(ixRW, ['koef', 'dua', 'satu', 'balik'][i % 4]);
WG.pecahan = i => IX.pecahan(ixRW, ['satu', 'mn', 'neg', 'mn'][i % 4]);
WG.gabung = i => IX.gabung(ixRW, ['A', 'B', 'C'][i % 3]);
WG.nilaiGabung = i => IX.nilaiGabung(ixRW, ['tukar', 'pecah', 'sama'][i % 3]);
WG.persamaan = i => IX.persamaan(ixRW, ['F1', 'F3', 'F2', 'F5', 'F4'][i % 5]);
WG.punca = i => IX.punca(ixRW, ['kePunca', 'keIndeks'][i % 2]);
WG.k12 = () => IX.k12(ixRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '1.1': [['m', 'tulis', 5], ['m', 'asasIndeks', 3], ['m', 'kembang', 3], ['m', 'nilai', 5], ['m', 'bs1', 2], ['s', 'keIndeks', 3], ['s', 'cariN', 2], ['s', 'cariAsas', 1], ['s', 'banding', 2], ['s', 'harian', 1], ['k', 'k11', 3]],
  '1.2': [['m', 'darab', 4], ['m', 'bahagi', 3], ['m', 'kuasa', 3], ['m', 'sifarNeg', 3], ['m', 'indeksPos', 2], ['m', 'pecahan', 3], ['s', 'gabung', 3], ['s', 'nilaiGabung', 2], ['s', 'persamaan', 3], ['s', 'punca', 1], ['k', 'k12', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// 4 pilihan unik: jawapan + calon kesilapan biasa, diisi dengan fill(k) jika kurang
function ixOpts(ans, cands, fill) {
  const nm = c => (c == null ? c : String(c).replace(/\^\{1\}/g, ''));
  ans = nm(ans);
  const seen = new Set([ans]), w = [];
  for (let c of shuffle(cands)) { c = nm(c); if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = nm(fill(k)); if (c != null && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const ixNear = (v, k) => fmt(v + (k % 2 ? 1 : -1) * Math.ceil(k / 2));
const ixMcq = (q, fig, o) => ixOut({ type: 'mcq', q, fig, opts: o.opts, c: o.c, ans: '' });
const CQGEN = {
  tatatanda: [
    () => {
      const b = ixBase(ixRG, pick(['int', 'int', 'neg', 'var', 'frac'])), n = ri(3, 6), ans = ixPS(b, n);
      return ixMcq('Write in index form.', ixCard(ixRep(b, n), 'INDEX FORM'), ixOpts(ans, [b.k === 'var' ? `${n}${b.a}` : `${n}^{${b.v}}`, ixPS(b, n + 1), ixPS(b, n - 1), `${b.s} × ${n}`], k => ixPS(b, n + k + 1)));
    },
    () => {
      if (Math.random() < .35) { const a = ri(2, 5), n = pick([2, 4]), X = `−${a}^{${n}}`, v = ixPw(a, n); return ixMcq(`What is the value of ${X}?`, ixCard(X, 'NILAI'), ixOpts(fmt(-v), [fmt(v), fmt(-a * n), fmt(a * n)], k => ixNear(-v, k))); }
      let a, n; do { a = ri(2, 9); n = ri(2, 5); } while (ixPw(a, n) > 3000 || (a === 2 && n === 2));
      const neg = Math.random() < .3 ? -1 : 1, A = neg * a, X = neg < 0 ? `(${fmt(A)})^{${n}}` : `${a}^{${n}}`, v = ixPw(A, n);
      return ixMcq(`What is the value of ${X}?`, ixCard(X, 'NILAI'), ixOpts(fmt(v), [fmt(A * n), fmt(-v), fmt(ixPw(A, n - 1)), fmt(ixPw(n, a))], k => ixNear(v, k)));
    },
    () => {
      if (Math.random() < .5) {
        let b, n; do { b = ri(2, 7); n = ri(3, 7); } while (ixPw(b, n) > 20000);
        const V = ixPw(b, n);
        return ixMcq(`Write ${V} in index form with base ${b}.`, ixCard(`${V} = ${b}^{?}`, 'BASE ' + b), ixOpts(`${b}^{${n}}`, [`${b}^{${n + 1}}`, `${b}^{${n - 1}}`, `${n}^{${b}}`, `${b}^{${Math.round(V / b)}}`], k => `${b}^{${n + k + 1}}`));
      }
      const b = ixBase(ixRG, pick(['int', 'frac', 'neg'])); let n; do n = ri(2, 6); while ((b.k === 'frac' ? ixPw(b.q, n) : Math.abs(ixPw(b.a, n))) > 5000);
      const V = ixVal(b, n), L = ixPS(b, 'n');
      return ixMcq(`If ${L} = ${V}, what is the value of n?`, ixCard(`${L} = ${V}`, 'FIND n'), ixOpts(`n = ${n}`, [`n = ${n + 1}`, `n = ${n - 1}`, `n = ${n + 2}`], k => `n = ${n + k + 2}`));
    }
  ],
  darabBahagi: [
    () => {
      const b = pick(IXNB); let m, n; do { m = ri(2, 8); n = ri(2, 8); } while (m * n === m + n);
      if (Math.random() < .5) { const E = `${b}^{${m}} × ${b}^{${n}}`; return ixMcq(`Simplify ${E}.`, ixCard(E, 'DARAB'), ixOpts(`${b}^{${m + n}}`, [`${b}^{${m * n}}`, isNaN(+b) ? `${b}^{${m + n + 1}}` : `${+b * +b}^{${m + n}}`, `${b}^{${Math.abs(m - n) || 1}}`], k => `${b}^{${m + n + k}}`)); }
      const M = Math.max(m, n) + 2, N = Math.min(m, n), E = `${b}^{${M}} ÷ ${b}^{${N}}`;
      return ixMcq(`Simplify ${E}.`, ixCard(E, 'BAHAGI'), ixOpts(`${b}^{${M - N}}`.replace('^{1}', ''), [`${b}^{${M + N}}`, M % N === 0 ? `${b}^{${M / N}}` : `${b}^{${M * N}}`, `${b}^{${fmt(N - M)}}`], k => `${b}^{${M - N + k}}`));
    },
    () => {
      const v = pick(IXL), c1 = ri(2, 6), c2 = ri(2, 6); let m, n; do { m = ri(1, 6); n = ri(2, 6); } while (m * n === m + n);
      if (Math.random() < .5) { const E = `${ixMono(c1, [[v, m]])} × ${ixMono(c2, [[v, n]])}`; return ixMcq(`Simplify ${E}.`, ixCard(E, 'DARAB'), ixOpts(ixMono(c1 * c2, [[v, m + n]]), [ixMono(c1 + c2, [[v, m + n]]), ixMono(c1 * c2, [[v, m * n]]), ixMono(c1 + c2, [[v, m * n]])], k => ixMono(c1 * c2, [[v, m + n + k]]))); }
      const k0 = ri(2, 5), C1 = c2 * k0, M = m + n, E = `${ixMono(C1, [[v, M]])} ÷ ${ixMono(c2, [[v, n]])}`;
      return ixMcq(`Simplify ${E}.`, ixCard(E, 'BAHAGI'), ixOpts(ixMono(k0, [[v, m]]), [ixMono(C1 - c2, [[v, m]]), ixMono(k0, [[v, M + n]]), M % n === 0 ? ixMono(k0, [[v, M / n]]) : ixMono(C1 - c2, [[v, M + n]])], k => ixMono(k0, [[v, m + k]])));
    },
    () => {
      const b = pick([2, 3, 5, 10]); let m, n, p, e; do { m = ri(2, 9); n = ri(1, 7); p = ri(2, 12); e = m + n - p; } while (e < 0 || ixPw(b, e) > 1000);
      const E = `${b}^{${m}} × ${b}^{${n}} ÷ ${b}^{${p}}`, v = ixPw(b, e);
      return ixMcq(`Calculate the value of ${E}.`, ixCard(E, 'NILAI'), ixOpts(fmt(v), [fmt(ixPw(b, e + 1)), fmt(b * e), e > 0 ? fmt(ixPw(b, e - 1)) : '0', fmt(ixPw(b, m + n + p) > 1e6 ? b * (m + n) : ixPw(b, m + n))], k => ixNear(v, k)));
    }
  ],
  kuasaSifar: [
    () => {
      const b = pick(IXNB); let m, n; do { m = ri(2, 6); n = ri(2, 5); } while (m * n === m + n);
      const E = `(${b}^{${m}})^{${n}}`;
      return ixMcq(`Simplify ${E}.`, ixCard(E, 'KUASA'), ixOpts(`${b}^{${m * n}}`, [`${b}^{${m + n}}`, `${b}^{${ixPw(m, n) <= 999 ? ixPw(m, n) : m * n + 1}}`, `${b}^{${Math.abs(m - n) || m + 1}}`], k => `${b}^{${m * n + k}}`));
    },
    () => {
      if (Math.random() < .35) { const a = ri(2, 99), v = pick(IXL), c = ri(2, 9), f = Math.random() < .5; const E = f ? `${a}^{0}` : `${c}${v}^{0}`; return ixMcq(`What is the value of ${E}?`, ixCard(E, 'ZERO INDEX'), ixOpts(f ? '1' : String(c), f ? ['0', String(a), fmt(-1)] : ['1', '0', `${c}${v}`], k => String(k + 2))); }
      let a, n; do { a = ri(2, 10); n = ri(1, 3); } while (ixPw(a, n) > 1000);
      const E = `${a}^{${fmt(-n)}}`, v = ixPw(a, n);
      return ixMcq(`What is the value of ${E}?`, ixCard(E, 'NEGATIVE INDEX'), ixOpts(`1/${v}`, [fmt(-v), fmt(-a * n), `1/${a * n}`, `−1/${v}`], k => `1/${v + k}`));
    },
    () => {
      const v = pick(IXL); let c, m, n; do { c = ri(2, 5); m = ri(2, 5); n = ri(2, 3); } while (ixPw(c, n) > 125);
      if (Math.random() < .5) { const E = `(${ixMono(c, [[v, m]])})^{${n}}`; return ixMcq(`Simplify ${E}.`, ixCard(E, 'KUASA'), ixOpts(ixMono(ixPw(c, n), [[v, m * n]]), [ixMono(c, [[v, m * n]]), ixMono(c * n, [[v, m * n]]), ixMono(ixPw(c, n), [[v, m + n]])], k => ixMono(ixPw(c, n), [[v, m * n + k]]))); }
      let p, q, k0; do { [p, q] = pick(IXFRB); k0 = ri(1, 3); } while (ixPw(Math.max(p, q), k0) > 500);
      const E = `(${p}/${q})^{${fmt(-k0)}}`, A = ixFr(ixPw(q, k0), ixPw(p, k0));
      return ixMcq(`What is the value of ${E}?`, ixCard(E, 'NEGATIVE INDEX'), ixOpts(A, [ixFr(ixPw(p, k0), ixPw(q, k0)), '−' + ixFr(ixPw(p, k0), ixPw(q, k0)), '−' + A, ixFr(q * k0, p)], k => ixFr(ixPw(q, k0) + k, ixPw(p, k0))));
    }
  ],
  pecahan: [
    () => {
      const [a, n, rt] = pick(IXRT), E = `${a}^{1/${n}}`;
      return ixMcq(`What is the value of ${E}?`, ixCard(E, 'FRACTIONAL INDEX'), ixOpts(String(rt), [ixFr(a, n), String(a * n), String(rt * n), String(rt + 1)], k => ixNear(rt, k)));
    },
    () => {
      let a, n, rt, m; do { [a, n, rt] = pick(IXRT); m = ri(2, 4); } while (ixGcd(m, n) !== 1 || ixPw(rt, m) > 1000);
      const E = `${a}^{${m}/${n}}`, v = ixPw(rt, m);
      return ixMcq(`What is the value of ${E}?`, ixCard(E, 'FRACTIONAL INDEX'), ixOpts(String(v), [ixFr(a * m, n), String(rt * m), String(ixPw(rt, m + 1)), `1/${v}`], k => ixNear(v, k)));
    },
    () => {
      const d = ixPersData(ixRG), x = d.x, num = x.includes('/') ? null : parseInt(x.replace('−', '-'), 10);
      const c = x.includes('/') ? [`x = ${x.split('/').reverse().join('/')}`, `x = ${x.split('/')[0]}`, `x = ${d.wrong}`, `x = −${x}`] : [`x = ${fmt(-num)}`, `x = ${d.wrong}`, `x = ${fmt(num + 1)}`, `x = ${fmt(num - 1)}`];
      return ixMcq(`Solve ${d.E}.`, ixCard(d.E, 'SELESAIKAN'), ixOpts(`x = ${x}`, c, k => `x = ${fmt((num || 0) + k + 2)}`));
    }
  ]
};
const CQT = { tatatanda: 'Index notation', darabBahagi: 'Laws of multiplication & division', kuasaSifar: 'Law of powers, zero & negative indices', pecahan: 'Fractional indices & equations' };
function ixCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.tatatanda;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['tatatanda', 'tatatanda', 'darabBahagi', 'kuasaSifar', 'pecahan'] : Object.keys(CQT);
  return ixCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return ixCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
