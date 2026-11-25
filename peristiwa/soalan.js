'use strict';
/* =================== PERISTIWA · SOALAN BAB 9 KEBARANGKALIAN PERISTIWA BERGABUNG (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pr" / "PR" (bukan "pr" sahaja: itu milik teras).

/* =================== pembantu nombor (pecahan tepat) =================== */
const prGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan tepat sebagai [pengangka, penyebut] dalam bentuk termudah
const prQ = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } if (n === 0) return [0, 1]; const g = prGcd(n, d) || 1; return [n / g, d / g]; };
const prMul = (...qs) => qs.reduce((a, b) => prQ(a[0] * b[0], a[1] * b[1]), [1, 1]);
const prAdd = (...qs) => qs.reduce((a, b) => prQ(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), [0, 1]);
const prSub = (a, b) => prQ(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const prOneMinus = a => prSub([1, 1], a);
const prEqQ = (a, b) => a[0] === b[0] && a[1] === b[1];
// teks pecahan termudah ("0", "1", atau pecahan bertingkat fr())
const prF = q => (q[0] === 0 ? '0' : q[1] === 1 ? String(q[0]).replace(/^-/, '−') : (q[0] < 0 ? '−' : '') + fr(Math.abs(q[0]), q[1]));
const prFr = (n, d) => prF(prQ(n, d));
// n per d (bertingkat) diikuti bentuk termudah jika berbeza
const prEq = (n, d) => { const s = prFr(n, d), raw = fr(n, d); return s === raw ? raw : `${raw} = ${s}`; };
// perpuluhan tepat bagi pecahan berpenyebut 2^a 5^b (cth [23, 50] → "0.46")
function prDec(q) {
  for (let k = 0, p = 1; k <= 8; k++, p *= 10) {
    if (p % q[1] === 0) {
      const v = Math.abs(q[0]) * (p / q[1]); let s = String(v).padStart(k + 1, '0');
      if (k) s = s.slice(0, -k) + '.' + s.slice(-k);
      return (q[0] < 0 ? '−' : '') + s;
    }
  }
  return prF(q);
}
const prH = h => prQ(h, 100);                   // perseratus → pecahan
const prHs = h => prDec(prH(h));                // perseratus → teks perpuluhan
const prSum = a => a.reduce((x, y) => x + y, 0);
const prRange = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const prPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const prSet = a => `{${a.join(', ')}}`;
const prPair = (...a) => `(${a.join(', ')})`;
const prDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const prCap = s => s[0].toUpperCase() + s.slice(1);
const prAtau = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' atau ' + a[a.length - 1]);
const prProd = (a, b) => { const o = []; a.forEach(x => b.forEach(y => o.push([x, y]))); return o; };
// rawak: prRG untuk Latihan Kelas / games, prRW (berbenih) untuk Lembaran Kerja
const prRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const prRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const prShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const prAt = (r, a, k) => (k == null ? r.p(a) : a[((k % a.length) + a.length) % a.length]);
const PRNAMA = ['Amir', 'Siti', 'Mei Ling', 'Ravi', 'Aisyah', 'Daniel', 'Farah', 'Kumar', 'Hafiz', 'Kavitha'];
const prNama2 = r => { const a = r.p(PRNAMA); let b; do b = r.p(PRNAMA); while (b === a); return [a, b]; };

/* =================== rajah (warna tema var(--…)) =================== */
const prT0 = (x, y, t, c = 'tx', sz = 15, a = 'middle', w = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
// prT: jika teks ada fr() (pecahan bertingkat), lukis pecahan dengan svgFr
function prT(x, y, t, c = 'tx', sz = 15, a = 'middle', w = 700) {
  const raw = String(t);
  if (!/class="fr"/.test(raw)) return prT0(x, y, t, c, sz, a, w);
  const parts = mathPlain(raw).split(/(\d+\/\d+)/), fs = sz * .92, gap = sz * .12;
  const segs = parts.map((p, i) => {
    if (i % 2) { const [n, d] = p.split('/'); return { f: [n, d], w: Math.max(mathW(n, fs), mathW(d, fs)) + 10 + 2 * gap }; }
    const lead = p.length - p.trimStart().length, trail = p.length - p.trimEnd().length, core = p.trim();
    return { core, lead: lead * sz * .28, trail: trail * sz * .28, w: core ? mathW(core, sz) : 0 };
  });
  const tot = segs.reduce((v, g) => v + g.w + (g.lead || 0) + (g.trail || 0), 0);
  let cx = a === 'start' ? +x : a === 'end' ? x - tot : x - tot / 2, s = '';
  segs.forEach(g => {
    if (g.f) { s += svgFr(+(cx + gap).toFixed(1), +y, g.f[0], g.f[1], `var(--${c})`, fs, 'start'); cx += g.w; return; }
    cx += g.lead; if (g.core) s += prT0(cx, y, g.core, c, sz, 'start', w); cx += g.w + g.trail;
  });
  return s;
}
const prSvg = (W, H, s, label) => `<svg viewBox="0 0 ${Math.round(W)} ${Math.round(H)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
const prL = (x1, y1, x2, y2, c, w = 2.5) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"/>`;
const PRCOL = { merah: 'rd', biru: 'tr', hijau: 'gr', kuning: 'am', ungu: 'pu', oren: 'pa' };
const PRCN = ['merah', 'biru', 'hijau', 'kuning', 'ungu'];   // tiada oren: sukar dibezakan daripada kuning/merah

// gambar rajah pokok dua peringkat: o = { s1:[{t,p,c}], s2:[[{t,p,c}]], outs?:[teks], hi?:[indeks daun], head?:[3 tajuk] }
function prTreeFig(o, label) {
  const L = prSum(o.s2.map(b => b.length)), top = o.head ? 30 : 10, isF = t => /class="fr"/.test(String(t || '')), hasF = o.s1.some(a => isF(a.p)) || o.s2.some(b => b.some(c => isF(c.p))), gap = (L > 6 ? 30 : 36) + (hasF ? 12 : 0), fo = hasF ? 6 : 0;
  const xr = 14, x1 = 122, x2 = 232, xo = 270;
  const ly = prRange(0, L - 1).map(i => top + gap * (i + .5));
  const ow = o.outs ? Math.max(...o.outs.map(t => mathPlain(String(t)).length), o.head ? String(o.head[2] || 'Kesudahan').length : 0) * 8.2 + 16 : 0;
  const W = o.outs ? xo + ow + 6 : x2 + 30, H = top + gap * L + 8;
  const hi = new Set(o.hi || []);
  let s = '', k = 0;
  const n1y = o.s2.map(b => { const ys = ly.slice(k, k + b.length); k += b.length; return prSum(ys) / ys.length; });
  const ry = prSum(n1y) / n1y.length;
  if (o.head) s += prT(x1, 12, o.head[0], 'mu', 13, 'middle', 600) + prT(x2, 12, o.head[1], 'mu', 13, 'middle', 600) + (o.outs ? prT(xo + 4, 12, o.head[2] || 'Kesudahan', 'mu', 13, 'start', 600) : '');
  k = 0;
  o.s1.forEach((a, i) => {
    const on1 = o.s2[i].some((_, j) => hi.has(k + j));
    s += prL(xr, ry, x1 - 14, n1y[i], hi.size && !on1 ? 'dim' : a.c, on1 ? 3.5 : 2.5);
    o.s2[i].forEach((b, j) => { const on = hi.has(k + j); s += prL(x1 + 14, n1y[i], x2 - 14, ly[k + j], hi.size && !on ? 'dim' : b.c, on ? 3.5 : 2.5); });
    k += o.s2[i].length;
  });
  s += `<circle cx="${xr}" cy="${+ry.toFixed(1)}" r="5" style="fill:var(--mu)"/>`;
  k = 0;
  o.s1.forEach((a, i) => {
    s += prT(x1, n1y[i], a.t, a.c, 17);
    if (a.p) s += prT((xr + x1) / 2 - 4, (ry + n1y[i]) / 2 + (n1y[i] < ry ? -11 - fo : 12 + fo), a.p, 'am', 13);
    o.s2[i].forEach((b, j) => {
      const y = ly[k + j];
      s += prT(x2, y, b.t, b.c, 17);
      if (b.p) s += prT((x1 + x2) / 2 + 2, (n1y[i] + y) / 2 + (y < n1y[i] - 1 ? -10 - fo : y > n1y[i] + 1 ? 11 + fo : -10 - fo), b.p, 'am', 13);
      if (o.outs) {
        if (hi.has(k + j)) s += `<rect x="${xo - 4}" y="${+(y - 13).toFixed(1)}" width="${+ow.toFixed(1)}" height="26" rx="7" style="fill:var(--gr);fill-opacity:.16;stroke:var(--gr)" stroke-width="1.5"/>`;
        s += prT(xo + 4, y, o.outs[k + j], hi.has(k + j) ? 'gr' : 'tx', 14, 'start', 600);
      }
    });
    k += o.s2[i].length;
  });
  return prSvg(W, H, s, label || 'Gambar rajah pokok');
}
// jadual ruang sampel: rows/cols = label, cell(i,j) = teks, hi = Set('i,j')
function prGridFig(rows, cols, cell, hi, head, label, cw) {
  const nr = rows.length, nc = cols.length, w = cw || 36, h = 30, W = w * (nc + 1) + 4, H = h * (nr + 1) + 4;
  hi = hi || new Set();
  let s = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="8" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  s += `<rect x="2" y="2" width="${W - 4}" height="${h}" rx="8" style="fill:var(--tr);fill-opacity:.12"/><rect x="2" y="2" width="${w}" height="${H - 4}" rx="8" style="fill:var(--pk);fill-opacity:.12"/>`;
  rows.forEach((rl, i) => cols.forEach((cl, j) => {
    const x = 2 + w * (j + 1), y = 2 + h * (i + 1), on = hi.has(`${i},${j}`);
    if (on) s += `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" rx="5" style="fill:var(--am);fill-opacity:.3;stroke:var(--am)" stroke-width="1.5"/>`;
    s += prT(x + w / 2, y + h / 2 + 1, cell(i, j), on ? 'am' : 'tx', 13, 'middle', on ? 800 : 500);
  }));
  for (let i = 1; i <= nr; i++) s += prL(2, 2 + h * i, W - 2, 2 + h * i, 'bd', 1);
  for (let j = 1; j <= nc; j++) s += prL(2 + w * j, 2, 2 + w * j, H - 2, 'bd', 1);
  rows.forEach((rl, i) => { s += prT(2 + w / 2, 2 + h * (i + 1.5) + 1, rl, 'pk', 14); });
  cols.forEach((cl, j) => { s += prT(2 + w * (j + 1.5), 2 + h / 2 + 1, cl, 'tr', 14); });
  if (head) s += prT(2 + w / 2, 2 + h / 2 + 1, head, 'mu', 13);
  return prSvg(W, H, s, label || 'Jadual ruang sampel');
}
// gambar rajah Venn dua set: v = { a, i, b, o } (senarai unsur atau bilangan), la/lb = label
function prVennFig(v, la = 'A', lb = 'B', label, shade) {
  const W = 330, H = 214, xa = 122, xb = 208, cy = 112, R = 74;
  let s = '';
  if (shade === 'U') s += `<circle cx="${xa}" cy="${cy}" r="${R}" style="fill:var(--pu);fill-opacity:.25"/><circle cx="${xb}" cy="${cy}" r="${R}" style="fill:var(--pu);fill-opacity:.25"/>`;
  if (shade === 'I') s += `<clipPath id="prvc"><circle cx="${xa}" cy="${cy}" r="${R}"/></clipPath><circle cx="${xb}" cy="${cy}" r="${R}" clip-path="url(#prvc)" style="fill:var(--am);fill-opacity:.35"/>`;
  s += `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="10" style="fill:none;stroke:var(--tx)" stroke-width="2"/>`;
  s += `<circle cx="${xa}" cy="${cy}" r="${R}" style="fill:var(--tr);fill-opacity:.08;stroke:var(--tr)" stroke-width="2.5"/><circle cx="${xb}" cy="${cy}" r="${R}" style="fill:var(--pk);fill-opacity:.08;stroke:var(--pk)" stroke-width="2.5"/>`;
  const ly = la.length > 2 || lb.length > 2 ? 22 : 40;
  s += prT(22, 24, 'S', 'tx', 17) + prT(xa - 52, ly, la, 'tr', 17) + prT(xb + 52, ly, lb, 'pk', 17);
  const put = (items, x, wid, maxPer) => {
    if (typeof items === 'number' || typeof items === 'string') return prT(x, cy, items, 'tx', 18);
    const n = items.length; if (!n) return '';
    const per = Math.min(maxPer, Math.max(1, Math.ceil(n / 4))), rows = Math.ceil(n / per), lh = Math.min(22, 120 / rows);
    let o = '';
    items.forEach((t, k) => { const r = Math.floor(k / per), c = k % per, inr = Math.min(per, n - r * per); o += prT(x + (c - (inr - 1) / 2) * wid, cy + (r - (rows - 1) / 2) * lh, t, 'tx', String(t).length > 2 ? 12 : 14, 'middle', 600); });
    return o;
  };
  s += put(v.a, xa - 32, 24, 3) + put(v.i, (xa + xb) / 2, 22, 1) + put(v.b, xb + 32, 24, 3);
  if (typeof v.o === 'number' || typeof v.o === 'string') s += prT(W - 22, H - 22, v.o, 'tx', 18, 'end');
  else if (v.o && v.o.length) s += prT(W - 16, H - 20, v.o.join(', '), 'tx', v.o.length > 6 ? 11 : 13, 'end', 600);
  return prSvg(W, H, s, label || `Gambar rajah Venn bagi ${la} dan ${lb}`);
}
// beg / kotak berisi objek berwarna: parts = [[warna, bilangan] …]
function prBagFig(parts, label) {
  const tot = prSum(parts.map(p => p[1])), cols = Math.min(7, Math.max(4, Math.ceil(Math.sqrt(tot * 1.7)))), rows = Math.ceil(tot / cols), d = 28;
  const jw = cols * d + 26, jh = rows * d + 26, W = Math.max(250, jw + 20), x0 = (W - jw) / 2;
  let s = `<rect x="${x0}" y="8" width="${jw}" height="${jh}" rx="20" style="fill:var(--surf);stroke:var(--mu)" stroke-width="2.5"/>`;
  const list = []; parts.forEach(([c, n]) => { for (let i = 0; i < n; i++) list.push(PRCOL[c]); });
  list.forEach((c, k) => { const row = rows - 1 - Math.floor(k / cols), col = k % cols, x = x0 + 13 + d / 2 + col * d, y = 8 + 13 + d / 2 + row * d; s += `<circle cx="${x}" cy="${y}" r="11" style="fill:var(--${c});stroke:var(--tx)" stroke-width="1" stroke-opacity=".5"/><circle cx="${x - 4}" cy="${y - 4}" r="3" style="fill:#fff" fill-opacity=".55"/>`; });
  let lx = 8, ly = jh + 28; const items = [];
  parts.forEach(([c, n]) => { const w = 26 + (c.length + String(n).length + 3) * 8; if (lx + w > W - 4) { lx = 8; ly += 22; } items.push([lx, ly, c, n]); lx += w; });
  items.forEach(([x, y, c, n]) => { s += `<circle cx="${x + 8}" cy="${y}" r="7" style="fill:var(--${PRCOL[c]})"/>` + prT(x + 20, y + 1, `${c} × ${n}`, 'mu', 13, 'start', 600); });
  return prSvg(W, ly + 14, s, label || 'Objek berwarna dalam bekas');
}

/* =================== data bersama =================== */
const PRD6 = [1, 2, 3, 4, 5, 6];
const PRDICE = prProd(PRD6, PRD6);
// peristiwa dua dadu: [nama, syarat(a,b)]
function prDiceEvs(r) {
  const s = r.i(3, 11), t = r.i(5, 9), p = r.p([4, 6, 12]), d = r.p([1, 2, 3, 4]);
  return [
    [`hasil tambah ${s}`, (a, b) => a + b === s],
    [`hasil tambah lebih besar daripada ${t}`, (a, b) => a + b > t],
    [`hasil tambah kurang daripada ${t}`, (a, b) => a + b < t],
    ['hasil tambah nombor perdana', (a, b) => prPrime(a + b)],
    ['hasil tambah gandaan 3', (a, b) => (a + b) % 3 === 0],
    ['kedua-dua nombor sama', (a, b) => a === b],
    [`hasil darab ${p}`, (a, b) => a * b === p],
    ['hasil darab nombor ganjil', (a, b) => (a * b) % 2 === 1],
    [`beza dua nombor ialah ${d}`, (a, b) => Math.abs(a - b) === d],
    ['sekurang-kurangnya satu nombor 6', (a, b) => a === 6 || b === 6],
    ['kedua-dua nombor genap', (a, b) => a % 2 === 0 && b % 2 === 0]
  ];
}
// peristiwa nombor bulat a..b: [nama, syarat]
function prNumEvs(r, a, b) {
  const k1 = r.i(a + 2, b - 3), k2 = r.i(a + 3, b - 2);
  return [
    ['nombor genap', n => n % 2 === 0], ['nombor ganjil', n => n % 2 === 1], ['nombor perdana', prPrime],
    ['nombor gandaan 3', n => n % 3 === 0], ['nombor gandaan 4', n => n % 4 === 0], ['nombor gandaan 5', n => n % 5 === 0], ['nombor gandaan 6', n => n % 6 === 0], ['nombor gandaan 7', n => n % 7 === 0],
    ['faktor bagi 12', n => 12 % n === 0], ['faktor bagi 18', n => 18 % n === 0], ['faktor bagi 20', n => 20 % n === 0], ['faktor bagi 24', n => 24 % n === 0],
    ['nombor kuasa dua sempurna', n => Math.round(Math.sqrt(n)) ** 2 === n],
    [`nombor lebih besar daripada ${k1}`, n => n > k1], [`nombor kurang daripada ${k2}`, n => n < k2]
  ].map(([nm, f]) => ({ nm, A: prRange(a, b).filter(f) }));
}
// pilih dua peristiwa A, B pada a..b; ex: true (saling eksklusif) | false | null
function prPair2(r, a, b, ex, minA = 2) {
  const E = prNumEvs(r, a, b).filter(e => e.A.length >= minA && e.A.length < b - a + 1);
  const P = [];
  E.forEach((e1, i) => E.forEach((e2, j) => {
    if (i >= j || e1.A.join() === e2.A.join()) return;
    const I = e1.A.filter(x => e2.A.includes(x));
    if (I.length === e1.A.length || I.length === e2.A.length) return;     // elak subset
    if (ex === true && I.length) return; if (ex === false && !I.length) return;
    P.push([e1, e2, I]);
  }));
  const [e1, e2, I] = r.p(P);
  const sw = r.f() < .5;
  const A = sw ? e2 : e1, B = sw ? e1 : e2;
  const U = prRange(a, b).filter(x => A.A.includes(x) || B.A.includes(x));
  return { S: prRange(a, b), A, B, I, U };
}
const PRCTXS = [  // objek dalam bekas
  { o: 'guli', cl: 'biji', bk: 'beg' }, { o: 'bola', cl: 'biji', bk: 'kotak' }, { o: 'kad', cl: 'keping', bk: 'kotak' },
  { o: 'pen', cl: 'batang', bk: 'bekas pensel' }, { o: 'manik', cl: 'biji', bk: 'balang' }
];
function prBag(r, two = true, maxT = 12) {
  const cx = r.p(PRCTXS), cs = prShuf(r, PRCN).slice(0, two ? 2 : 3);
  let n; do n = cs.map(() => r.i(2, 7)); while (prSum(n) > maxT || prSum(n) < 5);
  const parts = cs.map((c, i) => [c, n[i]]), t = prSum(n);
  return { cx, cs, n, parts, t, desc: prDan(parts.map(([c, k]) => `${k} ${cx.cl} ${cx.o} ${c}`)), se: `se${cx.cl}` };
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 9.1 Peristiwa Bergabung ---------- */
  ruang: [
    ({ desc }) => ({ q: `${desc} Senaraikan ruang sampel, S.` }),
    ({ desc }) => ({ q: `${desc} Tulis ruang sampel bagi peristiwa bergabung ini dalam tatatanda set.` }),
    ({ desc, Ss, n }) => ({ q: `${desc} Senaraikan ruang sampel, S dan nyatakan n(S).`, ans: `S = ${Ss}, n(S) = ${n}` }),
    ({ desc }) => ({ q: `${desc} Dengan melukis gambar rajah pokok atau jadual, senaraikan semua kesudahan yang mungkin.` }),
    ({ desc, wrong, miss, ans }) => { const N = vnama(); return Object.assign({ q: `${desc} ${N} menulis ruang sampelnya sebagai S = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Kesudahan ${miss} tertinggal. Setiap kesudahan eksperimen pertama mesti dipasangkan dengan setiap kesudahan eksperimen kedua.`)); }
  ],
  nS: [
    ({ desc }) => ({ q: `${desc} Nyatakan bilangan kesudahan yang mungkin, n(S).` }),
    ({ desc }) => ({ q: `${desc} Berapakah bilangan unsur dalam ruang sampel bagi peristiwa bergabung ini?` }),
    ({ desc }) => ({ q: `${desc} Tanpa menyenaraikan semua kesudahan, hitung n(S).` }),
    ({ desc, wrong, ans, parts }) => { const N = vnama(); return Object.assign({ q: `${desc} ${N} berkata n(S) = ${wrong}. Adakah ${N} betul?` }, salah(N, `n(S) = ${ans}`, `${N} menambah ${parts.join(' + ')}. Bilangan kesudahan peristiwa bergabung ialah hasil darab, ${parts.join(' × ')}.`)); }
  ],
  senarai: [
    ({ desc, ev }) => ({ q: `${desc} Senaraikan semua kesudahan bagi peristiwa mendapat ${ev}.` }),
    ({ desc, ev, As, nA }) => ({ q: `${desc} A ialah peristiwa mendapat ${ev}. Senaraikan unsur A dan nyatakan n(A).`, ans: `A = ${As}, n(A) = ${nA}` }),
    ({ desc, ev }) => ({ q: `${desc} Tulis peristiwa mendapat ${ev} dalam tatatanda set.` }),
    ({ desc, ev, wrong, miss, ans, nA }) => { const N = vnama(); if (nA < 2) return { q: `${desc} Senaraikan kesudahan bagi peristiwa mendapat ${ev}.` }; return Object.assign({ q: `${desc} ${N} menyenaraikan peristiwa mendapat ${ev} sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Kesudahan ${miss} tertinggal.`)); }
  ],
  pokok: [
    ({ desc, ev, Ss, p }) => ({ q: `${desc} Gambar rajah pokok di bawah menunjukkan semua kesudahan yang mungkin. (a) Senaraikan ruang sampel, S. (b) Cari kebarangkalian ${ev}.`, ans: `(a) S = ${Ss} (b) ${p}` }),
    ({ desc, ev }) => ({ q: `${desc} Berdasarkan gambar rajah pokok di bawah, cari kebarangkalian ${ev}.` }),
    ({ desc, ev, As, p }) => ({ q: `${desc} Dengan menggunakan gambar rajah pokok di bawah, senaraikan kesudahan bagi peristiwa ${ev} dan hitung kebarangkaliannya.`, ans: `${As}, kebarangkalian = ${p}` }),
    ({ desc, ev }) => { const N = vnama(); return { q: `${desc} ${N} melukis gambar rajah pokok di bawah. Apakah kebarangkalian ${ev}?` }; }
  ],
  jadual: [
    ({ op, ev }) => ({ q: `Dua biji dadu adil dilambung. Jadual di bawah menunjukkan ${op} dua nombor yang diperoleh. Cari kebarangkalian mendapat ${ev}.` }),
    ({ op, ev }) => ({ q: `Jadual di bawah menunjukkan ruang sampel apabila dua biji dadu dilambung; setiap sel ialah ${op} dua nombor. Hitung P(A), dengan A ialah peristiwa mendapat ${ev}.` }),
    ({ op, ev, nA, ans }) => ({ q: `Berdasarkan jadual ${op} dua biji dadu di bawah, nyatakan n(A) dan P(A) bagi peristiwa A, iaitu mendapat ${ev}.`, ans: `n(A) = ${nA}, P(A) = ${ans}` }),
    ({ op, ev, nA, ans }) => { const N = vnama(); return Object.assign({ q: `Dua biji dadu dilambung. Jadual di bawah menunjukkan ${op} dua nombor. ${N} berkata kebarangkalian mendapat ${ev} ialah ${fr(nA, 36 - nA)}. Adakah ${N} betul?` }, salah(N, ans, `Penyebut mestilah n(S) = 36, bukan bilangan sel yang tidak memenuhi syarat (${36 - nA}).`)); }
  ],
  k91: [
    ({ c3 }) => ({ q: `Tiga keping syiling dilambung serentak. G mewakili gambar dan A mewakili angka. (a) Nyatakan n(S). (b) Senaraikan kesudahan bagi peristiwa mendapat ${c3.ev}. (c) Cari kebarangkalian mendapat ${c3.ev}.`, ans: `(a) 8 (b) ${c3.As} (c) ${c3.p}`, work: ['(a) n(S) = 2 × 2 × 2 = 8', `(b) ${c3.As}, n = ${c3.k}`, `(c) P = ${prEq(c3.k, 8)}`] }),
    ({ dg }) => ({ q: `Empat keping kad bernombor ${prDan(dg.d.map(String))} dimasukkan ke dalam sebuah kotak. Dua keping kad dicabut satu demi satu tanpa pemulangan untuk membentuk nombor dua digit; kad pertama ialah digit puluh. (a) Nyatakan n(S). (b) Senaraikan semua nombor ${dg.ev}. (c) Cari kebarangkalian nombor yang dibentuk ialah nombor ${dg.ev}.`, ans: `(a) 12 (b) ${dg.L} (c) ${dg.p}`, work: ['(a) Digit puluh: 4 pilihan, digit sa: 3 pilihan. n(S) = 4 × 3 = 12', `(b) ${dg.L}, n = ${dg.k}`, `(c) P = ${prEq(dg.k, 12)}`] }),
    ({ cd }) => ({ q: `Sekeping syiling dilambung dan sebiji dadu adil dilambung. G mewakili gambar dan A mewakili angka. (a) Nyatakan n(S). (b) Senaraikan kesudahan bagi peristiwa mendapat ${cd.ev}. (c) Cari kebarangkalian peristiwa itu.`, ans: `(a) 12 (b) ${cd.As} (c) ${cd.p}`, work: ['(a) n(S) = 2 × 6 = 12', `(b) ${cd.As}, n = ${cd.k}`, `(c) P = ${prEq(cd.k, 12)}`] }),
    ({ mn }) => ({ q: `${mn.desc} (a) Senaraikan semua pilihan set yang mungkin. (b) Cari kebarangkalian ${mn.ev}.`, ans: `(a) S = ${mn.Ss} (b) ${mn.p}`, work: [`(a) n(S) = ${mn.a} × ${mn.b} = ${mn.n}`, `(b) ${mn.As}, n = ${mn.k}`, `P = ${prEq(mn.k, mn.n)}`] })
  ],

  /* ---------- 9.2 Bersandar & tak bersandar ---------- */
  jenis: [
    ({ s }) => ({ q: `Nyatakan sama ada dua peristiwa dalam situasi berikut bersandar atau tak bersandar: ${s}` }),
    ({ s, ans, why }) => ({ q: `${s} Adakah peristiwa-peristiwa ini bersandar atau tak bersandar? Beri sebab.`, ans: `${ans}. ${why}` }),
    ({ s }) => ({ q: `Kelaskan situasi berikut sebagai peristiwa bersandar atau peristiwa tak bersandar. ${s}` }),
    ({ s, dep, why }) => { const N = vnama(); const claim = VR() < .5 ? dep : !dep, cl = claim ? 'bersandar' : 'tak bersandar'; return claim === dep ? { q: `${s} ${N} berkata peristiwa-peristiwa ini ${cl}. Adakah ${N} betul?`, ans: `Ya, ${N} betul. ${why}` } : Object.assign({ q: `${s} ${N} berkata peristiwa-peristiwa ini ${cl}. Adakah ${N} betul?` }, salah(N, dep ? 'Bersandar' : 'Tak bersandar', 'Tanya: adakah kesudahan peristiwa pertama mempengaruhi peristiwa kedua?')); }
  ],
  darab: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Dengan menggunakan rumus P(A ∩ B) = P(A) × P(B), hitung kebarangkalian ${ev}.` }),
    ({ x, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah dua kebarangkalian. Untuk peristiwa tak bersandar, P(A ∩ B) = P(A) × P(B).`)); }
  ],
  dengan: [
    ({ B, ev }) => ({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. ${prCap(B.se)} ${B.cx.o} diambil secara rawak, warnanya dicatat dan ${B.cx.o} itu dikembalikan. Kemudian ${B.se} ${B.cx.o} diambil lagi. Cari kebarangkalian ${ev}.` }),
    ({ B, ev }) => ({ q: `${prCap(B.desc)} dimasukkan ke dalam sebuah ${B.cx.bk}. Dua ${B.cx.cl} ${B.cx.o} diambil secara rawak satu demi satu dengan pemulangan. Hitung kebarangkalian ${ev}.` }),
    ({ B, ev }) => { const N = vnama(); return { q: `${N} mengambil ${B.se} ${B.cx.o} secara rawak dari sebuah ${B.cx.bk} yang mengandungi ${B.desc}, mencatat warnanya dan memasukkannya semula. Dia mengulangi langkah itu sekali lagi. Apakah kebarangkalian ${ev}?` }; },
    ({ B, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil satu demi satu dengan pemulangan. ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} mengira seperti tanpa pemulangan. Dengan pemulangan, bilangan ${B.cx.o} tidak berubah, jadi kebarangkalian cabutan kedua sama dengan cabutan pertama.`)); }
  ],
  tanpa: [
    ({ B, ev }) => ({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil secara rawak satu demi satu tanpa pemulangan. Cari kebarangkalian ${ev}.` }),
    ({ B, ev }) => ({ q: `${prCap(B.se)} ${B.cx.o} diambil secara rawak dari sebuah ${B.cx.bk} yang mengandungi ${B.desc}. ${prCap(B.cx.o)} itu tidak dikembalikan, kemudian ${B.se} ${B.cx.o} lagi diambil. Hitung kebarangkalian ${ev}.` }),
    ({ B, ev }) => { const N = vnama(); return { q: `${N} mengambil dua ${B.cx.cl} ${B.cx.o} satu demi satu tanpa pemulangan dari sebuah ${B.cx.bk} yang mengandungi ${B.desc}. Apakah kebarangkalian ${ev}?` }; },
    ({ B, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil satu demi satu tanpa pemulangan. ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak mengurangkan bilangan ${B.cx.o} selepas cabutan pertama. Tanpa pemulangan, peristiwa ini bersandar.`)); }
  ],
  tiga: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Dengan menganggap peristiwa-peristiwa ini tak bersandar, hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Apakah kebarangkalian ${ev}?` })
  ],
  semak: [
    ({ pa, pb, pi }) => ({ q: `Diberi P(A) = ${pa}, P(B) = ${pb} dan P(A ∩ B) = ${pi}. Tentukan sama ada peristiwa A dan B bersandar atau tak bersandar.` }),
    ({ pa, pb, pi }) => ({ q: `Bagi dua peristiwa A dan B, P(A) = ${pa}, P(B) = ${pb} dan P(A ∩ B) = ${pi}. Adakah A dan B peristiwa tak bersandar? Tunjukkan pengiraan anda.` }),
    ({ pa, pb, pi, indep, ans }) => { const N = vnama(); return indep ? Object.assign({ q: `P(A) = ${pa}, P(B) = ${pb} dan P(A ∩ B) = ${pi}. ${N} berkata A dan B bersandar. Adakah ${N} betul?` }, salah(N, ans, 'Semak sama ada P(A) × P(B) = P(A ∩ B).')) : { q: `P(A) = ${pa}, P(B) = ${pb} dan P(A ∩ B) = ${pi}. ${N} berkata A dan B bersandar. Adakah ${N} betul?`, ans: `Ya, ${N} betul. ${ans}` }; }
  ],
  k92: [
    ({ t }) => ({ q: `Sebuah ${t.B.cx.bk} mengandungi ${t.B.desc}. Dua ${t.B.cx.cl} ${t.B.cx.o} diambil secara rawak satu demi satu tanpa pemulangan. (a) Lengkapkan gambar rajah pokok di bawah dengan menulis kebarangkalian pada setiap cabang. (b) Cari kebarangkalian kedua-dua ${t.B.cx.o} sama warna. (c) Cari kebarangkalian sekurang-kurangnya satu ${t.B.cx.o} berwarna ${t.c1}.`, ans: `(a) Lihat rajah jawapan (b) ${t.same} (c) ${t.atl}`, work: t.work }),
    ({ t }) => ({ q: `${prCap(t.B.desc)} dimasukkan ke dalam sebuah ${t.B.cx.bk}. ${prCap(t.B.se)} ${t.B.cx.o} diambil, tidak dikembalikan, kemudian ${t.B.se} lagi diambil. (a) Lengkapkan gambar rajah pokok di bawah. (b) Hitung kebarangkalian kedua-dua ${t.B.cx.o} berlainan warna. (c) Hitung kebarangkalian sekurang-kurangnya satu ${t.B.cx.o} berwarna ${t.c1}.`, ans: `(a) Lihat rajah jawapan (b) ${t.diff} (c) ${t.atl}`, work: t.work2 })
  ],

  /* ---------- 9.3 Saling eksklusif ---------- */
  jenisSE: [
    ({ x, a, b }) => ({ q: `${x} A ialah peristiwa mendapat ${a} dan B ialah peristiwa mendapat ${b}. Tentukan sama ada A dan B saling eksklusif.` }),
    ({ x, a, b }) => ({ q: `${x} Adakah peristiwa mendapat ${a} dan peristiwa mendapat ${b} saling eksklusif? Terangkan.` }),
    ({ x, a, b, Is }) => ({ q: `${x} A = peristiwa mendapat ${a}, B = peristiwa mendapat ${b}. Senaraikan A ∩ B. Seterusnya, nyatakan sama ada A dan B saling eksklusif.` }),
    ({ x, a, b, ex, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata peristiwa mendapat ${a} dan peristiwa mendapat ${b} ${ex ? 'tidak ' : ''}saling eksklusif. Adakah ${N} betul?` }, salah(N, ans, ex ? 'Kedua-dua peristiwa tidak mempunyai unsur sepunya.' : 'Kedua-dua peristiwa mempunyai unsur sepunya, jadi boleh berlaku serentak.')); }
  ],
  atauSE: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Apakah kebarangkalian ${ev}?` }),
    ({ x, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dua kebarangkalian. Untuk "atau" bagi peristiwa saling eksklusif, tambah: P(A ∪ B) = P(A) + P(B).`)); }
  ],
  irisan: [
    ({ x, a, b }) => ({ q: `${x} A ialah peristiwa mendapat ${a} dan B ialah peristiwa mendapat ${b}. Senaraikan unsur A ∩ B dan A ∪ B.` }),
    ({ x, a, b, nI, nU }) => ({ q: `${x} A = peristiwa mendapat ${a}, B = peristiwa mendapat ${b}. Nyatakan n(A ∩ B) dan n(A ∪ B).`, ans: `n(A ∩ B) = ${nI}, n(A ∪ B) = ${nU}` }),
    ({ x, a, b, pI }) => ({ q: `${x} Cari kebarangkalian mendapat ${a} dan ${b}.`, ans: pI }),
    ({ x, a, b, pU }) => ({ q: `${x} Cari kebarangkalian mendapat ${a} atau ${b}, dengan menyenaraikan unsur A ∪ B.`, ans: pU })
  ],
  atauTSE: [
    ({ x, a, b }) => ({ q: `${x} Cari kebarangkalian mendapat ${a} atau ${b}.` }),
    ({ x, a, b }) => ({ q: `${x} A = peristiwa mendapat ${a}, B = peristiwa mendapat ${b}. Dengan menggunakan rumus P(A ∪ B) = P(A) + P(B) − P(A ∩ B), hitung P(A ∪ B).` }),
    ({ x, a, b }) => { const N = vnama(); return { q: `${x} ${N} mahu mendapat ${a} atau ${b}. Apakah kebarangkalian ${N} berjaya?` }; },
    ({ x, a, b, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian mendapat ${a} atau ${b} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menolak P(A ∩ B). Unsur sepunya telah dikira dua kali.`)); }
  ],
  venn: [
    ({ x, ev }) => ({ q: `${x} Seorang murid dipilih secara rawak. Cari kebarangkalian murid itu ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Hitung kebarangkalian seorang murid yang dipilih secara rawak ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Jika seorang murid dipilih secara rawak, apakah kebarangkalian dia ${ev}?` })
  ],
  cariI: [
    ({ pa, pb, pu }) => ({ q: `Diberi P(A) = ${pa}, P(B) = ${pb} dan P(A ∪ B) = ${pu}. Cari P(A ∩ B).` }),
    ({ pa, pb, pu }) => ({ q: `Bagi dua peristiwa A dan B, P(A) = ${pa}, P(B) = ${pb} dan P(A ∪ B) = ${pu}. Hitung P(A ∩ B) dan nyatakan sama ada A dan B saling eksklusif.` }),
    ({ pa, pb, pu }) => ({ q: `P(A ∪ B) = ${pu}, P(A) = ${pa} dan P(B) = ${pb}. Apakah nilai P(A ∩ B)?` })
  ],
  k93: [
    ({ c }) => ({ q: `Sekeping kad dipilih secara rawak daripada kad bernombor ${c.lo} hingga ${c.hi}. A = peristiwa mendapat ${c.a}, B = peristiwa mendapat ${c.b} dan C = peristiwa mendapat ${c.c}. (a) Senaraikan A ∩ B. (b) Cari P(A ∪ B). (c) Adakah A dan C saling eksklusif? Seterusnya, cari P(A ∪ C).`, ans: `(a) ${c.Is} (b) ${c.pU} (c) Ya, A ∩ C = ∅; P(A ∪ C) = ${c.pAC}`, work: c.work }),
    ({ v }) => ({ q: `Dalam sebuah kelas yang mempunyai ${v.t} orang murid, ${v.A} orang menyertai Kelab Sains, ${v.B} orang menyertai Kelab Matematik dan ${v.I} orang menyertai kedua-dua kelab. (a) Lukis gambar rajah Venn untuk mewakili maklumat ini. (b) Seorang murid dipilih secara rawak. Cari kebarangkalian murid itu menyertai Kelab Sains atau Kelab Matematik. (c) Cari kebarangkalian murid itu tidak menyertai mana-mana kelab.`, ans: `(a) Lihat rajah jawapan (b) ${v.pU} (c) ${v.pO}`, work: v.work })
  ],

  /* ---------- 9.4 Aplikasi ---------- */
  keduaDua: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Dengan mendarab kebarangkalian, hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Apakah kebarangkalian ${ev}?` })
  ],
  skl: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Dengan menggunakan peristiwa pelengkap, hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Apakah kebarangkalian ${ev}?` }),
    ({ x, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} mengira 1 − P(kedua-duanya berlaku). Sepatutnya 1 − P(kedua-duanya tidak berlaku).`)); }
  ],
  dadu2: [
    ({ ev }) => ({ q: `Dua biji dadu adil dilambung. Cari kebarangkalian mendapat ${ev}.` }),
    ({ ev }) => { const N = vnama(); return { q: `${N} melambung dua biji dadu adil serentak. Hitung kebarangkalian dia mendapat ${ev}.` }; },
    ({ ev }) => ({ q: `Dalam satu permainan, seorang pemain menang jika mendapat ${ev} apabila dua biji dadu adil dilambung. Apakah kebarangkalian seorang pemain menang?` })
  ],
  tepatSatu: [
    ({ x, ev }) => ({ q: `${x} Lengkapkan gambar rajah pokok di bawah, kemudian cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Berdasarkan gambar rajah pokok di bawah, hitung kebarangkalian ${ev}.` }),
    ({ x, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul? Gunakan gambar rajah pokok di bawah.` }, salah(N, ans, `${N} hanya mengira satu laluan. "Tepat satu" mempunyai dua laluan yang mesti ditambah.`)); }
  ],
  samaWarna: [
    ({ B, ev }) => ({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil secara rawak satu demi satu tanpa pemulangan. Cari kebarangkalian ${ev}.` }),
    ({ B, ev }) => { const N = vnama(); return { q: `${N} mengambil dua ${B.cx.cl} ${B.cx.o} secara rawak, satu demi satu tanpa pemulangan, dari sebuah ${B.cx.bk} yang mengandungi ${B.desc}. Hitung kebarangkalian ${ev}.` }; },
    ({ B, ev, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil tanpa pemulangan. ${N} berkata kebarangkalian ${ev} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya mengira satu laluan. Tambah kebarangkalian semua laluan yang memenuhi syarat.`)); }
  ],
  pemain: [
    ({ x, ev }) => ({ q: `${x} Cari kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Hitung kebarangkalian ${ev}.` }),
    ({ x, ev }) => ({ q: `${x} Apakah kebarangkalian ${ev}? Anggap peristiwa-peristiwa itu tak bersandar.` })
  ],
  k94: [
    ({ w }) => ({ q: `Kebarangkalian hujan pada suatu hari ialah ${w.p}. Jika hujan, kebarangkalian ${w.A} lewat ke sekolah ialah ${w.q1}. Jika tidak hujan, kebarangkalian dia lewat ialah ${w.q2}. (a) Lengkapkan gambar rajah pokok di bawah. (b) Cari kebarangkalian ${w.A} lewat ke sekolah pada hari itu. (c) Cari kebarangkalian ${w.A} tidak lewat ke sekolah.`, ans: `(a) Lihat rajah jawapan (b) ${w.late} (c) ${w.ok}`, work: w.work }),
    ({ d }) => ({ q: `${d.x} (a) Cari kebarangkalian ${d.both}. (b) Cari kebarangkalian ${d.one}. (c) Cari kebarangkalian ${d.atl}.`, ans: `(a) ${d.pBoth} (b) ${d.pOne} (c) ${d.pAtl}`, work: d.work }),
    ({ b }) => ({ q: `Sebuah ${b.B.cx.bk} mengandungi ${b.B.desc}. Dua ${b.B.cx.cl} ${b.B.cx.o} diambil secara rawak satu demi satu tanpa pemulangan. (a) Cari kebarangkalian kedua-dua ${b.B.cx.o} berwarna ${b.c1}. (b) Cari kebarangkalian kedua-dua ${b.B.cx.o} sama warna. (c) Cari kebarangkalian sekurang-kurangnya satu ${b.B.cx.o} berwarna ${b.c1}.`, ans: `(a) ${b.p11} (b) ${b.same} (c) ${b.atl}`, work: b.work })
  ]
};

/* =================== pembina soalan (r = prRG atau prRW) =================== */
const PR = {};

/* ---------- 9.1 ---------- */
const PREXP = [
  () => ({ desc: 'Dua keping syiling dilambung serentak. G mewakili gambar dan A mewakili angka.', A: ['G', 'A'], B: ['G', 'A'] }),
  r => { const L = r.p([['P', 'Q', 'R'], ['K', 'L', 'M'], ['P', 'Q', 'R', 'T'], ['X', 'Y', 'Z']]); return { desc: `Sekeping syiling dilambung dan sebuah pemutar berlabel ${prDan(L)} diputar. G mewakili gambar dan A mewakili angka.`, A: ['G', 'A'], B: L }; },
  r => { const a = r.i(1, 7), n = r.i(3, 4), L = prRange(a, a + n - 1); return { desc: `Sekeping syiling dilambung dan sekeping kad dicabut secara rawak daripada ${n} keping kad bernombor ${a} hingga ${a + n - 1}. G mewakili gambar dan A mewakili angka.`, A: ['G', 'A'], B: L }; },
  r => { const N = prShuf(r, prRange(1, 9)).slice(0, r.i(2, 3)).sort((x, y) => x - y), L = prShuf(r, ['K', 'L', 'M', 'X', 'Y', 'Z']).slice(0, r.i(2, 3)).sort(); return { desc: `Kotak P mengandungi kad bernombor ${prDan(N.map(String))}. Kotak Q mengandungi kad huruf ${prDan(L)}. Sekeping kad dicabut secara rawak dari setiap kotak, bermula dengan kotak P.`, A: N, B: L }; },
  r => { const Bn = prShuf(r, ['Amir', 'Ravi', 'Daniel', 'Hafiz']).slice(0, 2), Gn = prShuf(r, ['Siti', 'Mei Ling', 'Farah', 'Aisyah']).slice(0, r.i(2, 3)); return { desc: `Seorang murid lelaki dipilih daripada ${prDan(Bn)}, dan seorang murid perempuan dipilih daripada ${prDan(Gn)} untuk mewakili kelas dalam pertandingan kuiz.`, A: Bn, B: Gn }; },
  r => { const D = prShuf(r, [['teh', 'T'], ['kopi', 'K'], ['jus', 'J'], ['susu', 'U']]).slice(0, r.i(2, 3)); return { desc: `Sebuah kantin menawarkan nasi lemak (N) atau mi goreng (M), dan minuman ${prAtau(D.map(d => `${d[0]} (${d[1]})`))}. Seorang murid memilih satu makanan dan satu minuman.`, A: ['N', 'M'], B: D.map(d => d[1]) }; },
  r => { const n = r.i(2, 3), L = r.p([['M', 'B'], ['M', 'B', 'H']]); return { desc: `Pemutar pertama berlabel ${prDan(prRange(1, n).map(String))}, manakala pemutar kedua berwarna ${L.length === 2 ? 'merah (M) dan biru (B)' : 'merah (M), biru (B) dan hijau (H)'}. Kedua-dua pemutar diputar sekali.`, A: prRange(1, n), B: L }; }
];
PR.ruang = (r, k) => {
  const e = prAt(r, PREXP, k)(r), S = prProd(e.A, e.B).map(p => prPair(...p)), Ss = prSet(S), n = S.length;
  const mi = r.i(0, n - 1), wrong = prSet(S.filter((_, i) => i !== mi));
  return GEN_LQ('ruang', { desc: e.desc, Ss, n, wrong, miss: S[mi], ans: `S = ${Ss}`, work: ['Pasangkan setiap kesudahan eksperimen pertama dengan setiap kesudahan eksperimen kedua.', `S = ${Ss}`, `n(S) = ${e.A.length} × ${e.B.length} = ${n}`] });
};
const PRNS = [
  () => ({ desc: 'Sekeping syiling dan sebiji dadu dilambung serentak.', parts: [2, 6] }),
  () => ({ desc: 'Dua biji dadu adil dilambung serentak.', parts: [6, 6] }),
  r => { const k = r.i(3, 8); return { desc: `Sebiji dadu dilambung dan sebuah pemutar yang dibahagikan kepada ${k} sektor sama besar diputar.`, parts: [6, k] }; },
  () => ({ desc: 'Tiga keping syiling dilambung serentak.', parts: [2, 2, 2] }),
  r => { const n = r.i(8, 20); return { desc: `Sekeping kad dipilih secara rawak daripada ${n} keping kad bernombor 1 hingga ${n}, dan sekeping syiling dilambung.`, parts: [n, 2] }; },
  r => { const w = r.p(['BUKIT', 'PINTU', 'TIMUR', 'KOMPUTER', 'SEKOLAH']); return { desc: `Setiap huruf daripada perkataan "${w}" ditulis pada sekeping kad. Sekeping kad dipilih secara rawak dan sebiji dadu dilambung.`, parts: [w.length, 6] }; },
  r => { const m = r.i(3, 6), n = r.i(3, 6); return { desc: `Pemutar P mempunyai ${m} sektor sama besar dan pemutar Q mempunyai ${n} sektor sama besar. Kedua-dua pemutar diputar sekali.`, parts: [m, n] }; },
  r => { const a = r.i(3, 5), b = r.i(2, 4); return { desc: `${r.p(PRNAMA)} mempunyai ${a} helai baju dan ${b} helai seluar yang berlainan. Dia memilih sehelai baju dan sehelai seluar secara rawak.`, parts: [a, b] }; }
];
PR.nS = (r, k) => {
  const e = prAt(r, PRNS, k)(r), ans = e.parts.reduce((a, b) => a * b, 1), wrong = prSum(e.parts);
  return GEN_LQ('nS', { desc: e.desc, parts: e.parts, wrong, ans: String(ans), work: ['Bilangan kesudahan peristiwa bergabung = hasil darab bilangan kesudahan setiap eksperimen.', `n(S) = ${e.parts.join(' × ')} = ${ans}`] });
};
// [huraian, set A, set B, fmt, peristiwa{nm, f}]
const PRSEN = [
  r => { const E = prDiceEvs(r).filter(([, f]) => { const n = PRDICE.filter(([a, b]) => f(a, b)).length; return n >= 2 && n <= 8; }); const [nm, f] = r.p(E); return { desc: 'Dua biji dadu adil dilambung.', L: PRDICE.filter(([a, b]) => f(a, b)), nm }; },
  r => { const E = r.p([['gambar dan nombor genap', (c, d) => c === 'G' && d % 2 === 0], ['angka dan nombor perdana', (c, d) => c === 'A' && prPrime(d)], ['gambar dan nombor lebih besar daripada 3', (c, d) => c === 'G' && d > 3], ['angka dan nombor ganjil', (c, d) => c === 'A' && d % 2 === 1], ['gambar atau nombor 6', (c, d) => c === 'G' || d === 6], ['angka dan faktor bagi 6', (c, d) => c === 'A' && 6 % d === 0]]); return { desc: 'Sekeping syiling dan sebiji dadu dilambung. G mewakili gambar dan A mewakili angka.', L: prProd(['G', 'A'], PRD6).filter(([c, d]) => E[1](c, d)), nm: E[0] }; },
  r => { const S3 = prProd(prProd(['G', 'A'], ['G', 'A']).map(p => p.join('')), ['G', 'A']).map(([p, c]) => [...p, c]); const E = r.p([['tepat dua gambar', a => a.filter(x => x === 'G').length === 2], ['sekurang-kurangnya dua angka', a => a.filter(x => x === 'A').length >= 2], ['tepat satu gambar', a => a.filter(x => x === 'G').length === 1], ['syiling pertama dan ketiga sama', a => a[0] === a[2]]]); return { desc: 'Tiga keping syiling dilambung serentak. G mewakili gambar dan A mewakili angka.', L: S3.filter(E[1]), nm: E[0] }; },
  r => { const N = prShuf(r, prRange(1, 9)).slice(0, 4).sort((x, y) => x - y), Lt = ['A', 'B', 'E', 'K']; const E = r.p([['nombor genap dan huruf vokal', (n, l) => n % 2 === 0 && 'AEIOU'.includes(l)], ['nombor ganjil dan huruf konsonan', (n, l) => n % 2 === 1 && !'AEIOU'.includes(l)], [`nombor lebih besar daripada ${N[1]} dan huruf vokal`, (n, l) => n > N[1] && 'AEIOU'.includes(l)]]); const L = prProd(N, Lt).filter(([n, l]) => E[1](n, l)); return L.length >= 1 ? { desc: `Kotak P mengandungi kad bernombor ${prDan(N.map(String))}. Kotak Q mengandungi kad huruf A, B, E dan K. Sekeping kad dicabut dari setiap kotak, bermula dengan kotak P.`, L, nm: E[0] } : PRSEN[0](r); }
];
PR.senarai = (r, k) => {
  const e = prAt(r, PRSEN, k)(r), L = e.L.map(p => prPair(...p)), As = prSet(L), nA = L.length;
  const mi = r.i(0, nA - 1), wrong = prSet(L.filter((_, i) => i !== mi));
  return GEN_LQ('senarai', { desc: e.desc, ev: e.nm, As, nA, wrong, miss: L[mi], ans: As, work: ['Semak setiap kesudahan dalam ruang sampel secara sistematik.', `${As}`, `Bilangan kesudahan = ${nA}`] });
};
const PRPOK = [
  r => { const B = [1, 2, 3, 4], E = r.p([['mendapat angka dan nombor ganjil', (c, d) => c === 'A' && d % 2 === 1], ['mendapat gambar dan nombor 4', (c, d) => c === 'G' && d === 4], ['mendapat gambar atau nombor 1', (c, d) => c === 'G' || d === 1]]);
    return { desc: 'Sekeping syiling dilambung dan sebuah pemutar berlabel 1, 2, 3 dan 4 diputar. G mewakili gambar dan A mewakili angka.', A: ['G', 'A'], B, cA: ['am', 'mu'], cB: ['tr', 'gr', 'pu', 'pk'], f: E[1], ev: E[0], head: ['Syiling', 'Pemutar'] }; },
  r => { const D = ['T', 'K', 'J'], E = r.p([['murid itu memilih nasi lemak dengan minuman panas (teh atau kopi)', (a, b) => a === 'N' && b !== 'J'], ['murid itu memilih mi goreng', a => a === 'M'], ['murid itu tidak memilih kopi', (a, b) => b !== 'K']]);
    return { desc: 'Seorang murid memilih secara rawak satu makanan, nasi lemak (N) atau mi goreng (M), dan satu minuman, teh (T), kopi (K) atau jus (J).', A: ['N', 'M'], B: D, cA: ['am', 'pa'], cB: ['tr', 'pu', 'gr'], f: E[1], ev: E[0], head: ['Makanan', 'Minuman'] }; },
  r => { const C = ['M', 'B', 'H'], E = r.p([['kedua-dua guli sama warna', (a, b) => a === b], ['tiada guli merah', (a, b) => a !== 'M' && b !== 'M'], ['guli pertama hijau', a => a === 'H']]);
    return { desc: 'Sebuah beg mengandungi sebiji guli merah (M), sebiji guli biru (B) dan sebiji guli hijau (H). Sebiji guli diambil, dikembalikan, kemudian sebiji guli diambil lagi.', A: C, B: C, cA: ['rd', 'tr', 'gr'], cB: ['rd', 'tr', 'gr'], f: E[1], ev: E[0], head: ['Cabutan 1', 'Cabutan 2'] }; },
  r => { const E = r.p([['mendapat sekurang-kurangnya satu gambar', (a, b) => a === 'G' || b === 'G'], ['mendapat dua angka', (a, b) => a === 'A' && b === 'A'], ['mendapat dua permukaan yang berlainan', (a, b) => a !== b]]);
    return { desc: 'Sekeping syiling dilambung dua kali. G mewakili gambar dan A mewakili angka.', A: ['G', 'A'], B: ['G', 'A'], cA: ['am', 'mu'], cB: ['am', 'mu'], f: E[1], ev: E[0], head: ['Lambungan 1', 'Lambungan 2'] }; }
];
PR.pokok = (r, k) => {
  const e = prAt(r, PRPOK, k)(r), S = prProd(e.A, e.B), L = S.map(p => prPair(...p)), hiI = S.map((p, i) => (e.f(...p) ? i : -1)).filter(i => i >= 0);
  const As = prSet(hiI.map(i => L[i])), p = prFr(hiI.length, S.length);
  const o = { s1: e.A.map((t, i) => ({ t, c: e.cA[i] })), s2: e.A.map(() => e.B.map((t, j) => ({ t, c: e.cB[j] }))), outs: L, head: [e.head[0], e.head[1], 'Kesudahan'] };
  return GEN_LQ('pokok', { desc: e.desc, ev: e.ev, Ss: prSet(L), As, p, ans: p, work: [`n(S) = ${e.A.length} × ${e.B.length} = ${S.length}`, `Kesudahan yang memenuhi: ${As}, n = ${hiI.length}`, `P = ${prEq(hiI.length, S.length)}`] },
    { fig: prTreeFig(o, 'Gambar rajah pokok'), figAns: prTreeFig(Object.assign({}, o, { hi: hiI }), 'Gambar rajah pokok dengan kesudahan diserlahkan') });
};
PR.jadual = (r, k) => {
  const sum = k == null ? r.f() < .6 : k % 3 !== 2, op = sum ? 'hasil tambah' : 'hasil darab', g = sum ? (a, b) => a + b : (a, b) => a * b;
  const E = sum ? [[`hasil tambah ${r.i(4, 10)}`], [`hasil tambah lebih besar daripada ${r.i(7, 9)}`], ['hasil tambah nombor perdana'], ['hasil tambah gandaan 4'], [`hasil tambah kurang daripada ${r.i(5, 7)}`]]
    : [[`hasil darab ${r.p([6, 12, 4])}`], ['hasil darab nombor ganjil'], [`hasil darab lebih besar daripada ${r.p([15, 18, 20])}`], ['hasil darab gandaan 5'], ['hasil darab nombor kuasa dua sempurna']];
  const nm = prAt(r, E, k == null ? null : Math.floor(k / 3) + k)[0];
  const test = v => { let m;
    if ((m = nm.match(/^hasil (?:tambah|darab) (\d+)$/))) return v === +m[1];
    if ((m = nm.match(/lebih besar daripada (\d+)/))) return v > +m[1];
    if ((m = nm.match(/kurang daripada (\d+)/))) return v < +m[1];
    if (/perdana/.test(nm)) return prPrime(v); if (/gandaan 4/.test(nm)) return v % 4 === 0; if (/gandaan 5/.test(nm)) return v % 5 === 0;
    if (/ganjil/.test(nm)) return v % 2 === 1; if (/kuasa dua/.test(nm)) return Math.round(Math.sqrt(v)) ** 2 === v; return false; };
  const hit = PRDICE.filter(([a, b]) => test(g(a, b))), nA = hit.length, ans = prFr(nA, 36);
  const cell = (i, j) => String(g(i + 1, j + 1)), hiS = new Set(hit.map(([a, b]) => `${a - 1},${b - 1}`)), D = PRD6.map(String);
  return GEN_LQ('jadual', { op, ev: nm, nA, ans, work: ['n(S) = 6 × 6 = 36', `Bilangan sel dengan ${nm} = ${nA}`, `P = ${prEq(nA, 36)}`] },
    { fig: prGridFig(D, D, cell, null, sum ? '+' : '×', `Jadual ${op} dua dadu`), figAns: prGridFig(D, D, cell, hiS, sum ? '+' : '×', `Jadual ${op} dua dadu dengan sel peristiwa diserlahkan`) });
};
PR.k91 = r => {
  const S3 = []; ['G', 'A'].forEach(a => ['G', 'A'].forEach(b => ['G', 'A'].forEach(c => S3.push([a, b, c]))));
  const E3 = r.p([['tepat dua gambar', x => x.filter(y => y === 'G').length === 2], ['sekurang-kurangnya satu angka', x => x.includes('A')], ['ketiga-tiga syiling sama', x => x[0] === x[1] && x[1] === x[2]], ['tepat satu angka', x => x.filter(y => y === 'A').length === 1]]);
  const L3 = S3.filter(E3[1]).map(x => prPair(...x)), c3 = { ev: E3[0], As: prSet(L3), k: L3.length, p: prFr(L3.length, 8) };
  const d = prShuf(r, prRange(1, 9)).slice(0, 4).sort((x, y) => x - y), nums = [];
  d.forEach(a => d.forEach(b => { if (a !== b) nums.push(10 * a + b); }));
  const thr = 10 * d[2];
  let DE = r.p([['genap', n => n % 2 === 0], ['ganjil', n => n % 2 === 1], [`lebih besar daripada ${thr}`, n => n > thr], ['gandaan 3', n => n % 3 === 0]]);
  if (!nums.some(DE[1]) || nums.every(DE[1])) DE = [`lebih besar daripada ${thr}`, n => n > thr];
  const Ld = nums.filter(DE[1]), dg = { d, ev: DE[0], L: prSet(Ld), k: Ld.length, p: prFr(Ld.length, 12) };
  const kk = r.i(2, 4), CE = r.p([[`gambar dan nombor lebih besar daripada ${kk}`, (c, n) => c === 'G' && n > kk], ['angka dan nombor perdana', (c, n) => c === 'A' && prPrime(n)], [`gambar atau nombor ${kk}`, (c, n) => c === 'G' || n === kk]]);
  const Lc = prProd(['G', 'A'], PRD6).filter(([c, n]) => CE[1](c, n)).map(p => prPair(...p)), cd = { ev: CE[0], As: prSet(Lc), k: Lc.length, p: prFr(Lc.length, 12) };
  const F = [['nasi lemak', 'N'], ['roti canai', 'R'], ['mi goreng', 'M']], Dk = [['teh', 'T'], ['kopi', 'K'], ['sirap', 'P']];
  const fa = prShuf(r, F).slice(0, r.i(2, 3)), da = prShuf(r, Dk).slice(0, 3), Sm = prProd(fa.map(x => x[1]), da.map(x => x[1]));
  const ME = r.p([[`murid itu memilih ${fa[0][0]}`, (a) => a === fa[0][1]], [`murid itu tidak memilih ${da[0][0]}`, (a, b) => b !== da[0][1]], [`murid itu memilih ${fa[1][0]} dengan ${da[1][0]}`, (a, b) => a === fa[1][1] && b === da[1][1]]]);
  const Lm = Sm.filter(([a, b]) => ME[1](a, b)).map(p => prPair(...p));
  const mn = { desc: `Sebuah kantin menawarkan set sarapan yang terdiri daripada satu makanan, iaitu ${prAtau(fa.map(x => `${x[0]} (${x[1]})`))}, dan satu minuman, iaitu ${prAtau(da.map(x => `${x[0]} (${x[1]})`))}. Seorang murid memilih satu set secara rawak.`, Ss: prSet(Sm.map(p => prPair(...p))), a: fa.length, b: 3, n: Sm.length, ev: ME[0], As: prSet(Lm), k: Lm.length, p: prFr(Lm.length, Sm.length) };
  const v = vq('k91', { c3, dg, cd, mn });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* ---------- 9.2 ---------- */
const PRJENIS = [
  ['Sekeping syiling dilambung dua kali.', false, 'Kesudahan lambungan pertama tidak mempengaruhi kesudahan lambungan kedua.'],
  ['Sebiji dadu dilambung dan sebuah pemutar diputar.', false, 'Kesudahan dadu tidak mempengaruhi kesudahan pemutar.'],
  ['Dua biji guli diambil satu demi satu dari sebuah beg dengan pemulangan.', false, 'Guli pertama dikembalikan, jadi kebarangkalian cabutan kedua tidak berubah.'],
  ['Dua biji guli diambil satu demi satu dari sebuah beg tanpa pemulangan.', true, 'Bilangan guli dalam beg berubah selepas cabutan pertama.'],
  ['Seorang ketua kelas dipilih, kemudian seorang penolong ketua kelas dipilih daripada murid yang tinggal.', true, 'Murid yang sudah dipilih tidak boleh dipilih lagi, jadi bilangan pilihan berubah.'],
  ['Hujan lebat pada waktu pagi dan jalan raya menjadi sesak.', true, 'Hujan lebat mempengaruhi keadaan lalu lintas.'],
  ['Sekeping kad dicabut, dikembalikan ke dalam kotak, kemudian sekeping kad lagi dicabut.', false, 'Kad dikembalikan, jadi kebarangkalian cabutan kedua tidak berubah.'],
  ['Amir mendapat nombor 6 pada dadunya dan Siti mendapat gambar pada syilingnya.', false, 'Lambungan Amir tidak mempengaruhi lambungan Siti.'],
  ['Seorang murid tidak mengulang kaji dan gagal dalam ujian.', true, 'Tidak mengulang kaji mempengaruhi peluang lulus ujian.'],
  ['Dua biji gula-gula diambil dari sebuah balang dan gula-gula pertama dimakan.', true, 'Gula-gula pertama tidak dikembalikan, jadi isi balang berubah.'],
  ['Dua orang murid dari kelas berlainan memutar pemutar masing-masing.', false, 'Putaran seorang murid tidak mempengaruhi putaran murid yang lain.'],
  ['Dua keping kad dipilih serentak daripada satu set kad.', true, 'Kad pertama tidak dikembalikan sebelum kad kedua dipilih.']
];
PR.jenis = (r, k) => {
  const [s, dep, why] = prAt(r, PRJENIS, k), ans = dep ? 'Bersandar' : 'Tak bersandar';
  return GEN_LQ('jenis', { s, dep, why, ans, work: [why, `Maka peristiwa-peristiwa itu ${ans.toLowerCase()}.`] });
};
const PRDEV = [['nombor 6', 1], ['nombor genap', 3], ['nombor perdana', 3], ['nombor lebih besar daripada 4', 2], ['gandaan 3', 2], ['nombor kurang daripada 5', 4], ['faktor bagi 6', 4]];
const PRDARAB = [
  r => { const [nm, n] = r.p(PRDEV), c = r.p(['gambar', 'angka']); return { x: `Sekeping syiling dan sebiji dadu adil dilambung.`, ev: `mendapat ${c} dan ${nm}`, pa: [1, 2], pb: prQ(n, 6), w0: [`P(${c}) = ${fr(1, 2)}`, `P(${nm}) = ${prEq(n, 6)}`] }; },
  r => { let a, b; do { a = r.i(10, 19) * 5; b = r.i(5, 9) * 10; } while (a === b); const [A, Bn] = prNama2(r); return { x: `Kebarangkalian ${A} lulus ujian memandu ialah ${prHs(a)} dan kebarangkalian ${Bn} lulus ujian memandu ialah ${prHs(b)}. Keputusan mereka tidak bersandar.`, ev: `kedua-dua mereka lulus`, pa: prH(a), pb: prH(b), dec: true, w0: [] }; },
  r => { const n1 = r.p([4, 5, 6, 8]), k1 = r.i(1, n1 - 1), n2 = r.p([3, 4, 5, 6]), k2 = r.i(1, n2 - 1); return { x: `Pemutar P dibahagikan kepada ${n1} sektor sama besar dengan ${k1} sektor berwarna merah. Pemutar Q dibahagikan kepada ${n2} sektor sama besar dengan ${k2} sektor berwarna merah. Kedua-dua pemutar diputar sekali.`, ev: 'kedua-dua jarum berhenti pada sektor merah', pa: prQ(k1, n1), pb: prQ(k2, n2), w0: [`P(P merah) = ${prEq(k1, n1)}`, `P(Q merah) = ${prEq(k2, n2)}`] }; },
  r => { let a, b; do { a = prQ(r.i(1, 6), r.p([3, 4, 5, 7])); b = prQ(r.i(1, 5), r.p([2, 3, 6, 8])); } while (a[0] >= a[1] || b[0] >= b[1]); return { x: `A dan B ialah dua peristiwa tak bersandar dengan P(A) = ${prF(a)} dan P(B) = ${prF(b)}.`, ev: 'kedua-dua peristiwa A dan B berlaku', pa: a, pb: b, w0: [] }; },
  r => { const a = r.p([10, 15, 20, 25, 30]), b = r.p([5, 10, 20, 40]), N = r.p(PRNAMA); return { x: `Kebarangkalian ${N} bangun lewat ialah ${prHs(a)} dan kebarangkalian bas sekolah rosak ialah ${prHs(b)}. Dua peristiwa ini tidak bersandar.`, ev: `${N} bangun lewat dan bas sekolah rosak pada hari yang sama`, pa: prH(a), pb: prH(b), dec: true, w0: [] }; },
  r => { const [n1, k1] = r.p(PRDEV), [n2, k2] = r.p(PRDEV.filter(e => e[0] !== n1)); return { x: 'Sebiji dadu merah dan sebiji dadu biru dilambung serentak.', ev: `mendapat ${n1} pada dadu merah dan ${n2} pada dadu biru`, pa: prQ(k1, 6), pb: prQ(k2, 6), w0: [`P(${n1}) = ${prEq(k1, 6)}`, `P(${n2}) = ${prEq(k2, 6)}`] }; }
];
PR.darab = (r, k) => {
  const e = prAt(r, PRDARAB, k)(r), p = prMul(e.pa, e.pb), sm = prAdd(e.pa, e.pb), fm = e.dec ? prDec : prF;
  const ans = fm(p), wrong = fm(sm);
  return GEN_LQ('darab', { x: e.x, ev: e.ev, ans, wrong, work: e.w0.concat([`P = ${fm(e.pa)} × ${fm(e.pb)}`, `= ${ans}`]) });
};
function prDrawEv(r, B, kind) {
  const [c1, c2] = B.cs, [a, b] = B.n, t = B.t, o = B.cx.o;
  if (kind === 0) return { ev: `kedua-dua ${o} berwarna ${c1}`, f: [[a, t], [a, t]], g: [[a, t], [a - 1, t - 1]] };
  if (kind === 1) return { ev: `${o} pertama berwarna ${c1} dan ${o} kedua berwarna ${c2}`, f: [[a, t], [b, t]], g: [[a, t], [b, t - 1]] };
  return { ev: `kedua-dua ${o} berwarna ${c2}`, f: [[b, t], [b, t]], g: [[b, t], [b - 1, t - 1]] };
}
PR.dengan = (r, k) => {
  const B = prBag(r), D = prDrawEv(r, B, k == null ? r.i(0, 2) : k % 3);
  const p = prMul(prQ(...D.f[0]), prQ(...D.f[1])), w = prMul(prQ(...D.g[0]), prQ(...D.g[1]));
  const ans = prF(p), wrong = prEqQ(p, w) ? prF(prMul(prQ(...D.f[0]), prQ(D.f[1][0], D.f[1][1] + 1))) : prF(w);
  return GEN_LQ('dengan', { B, ev: D.ev, ans, wrong, work: [`Jumlah ${B.cx.o} = ${B.t}. Dengan pemulangan, peristiwa tak bersandar.`, `P = ${fr(D.f[0][0], D.f[0][1])} × ${fr(D.f[1][0], D.f[1][1])}`, `= ${ans}`] }, { fig: prBagFig(B.parts) });
};
PR.tanpa = (r, k) => {
  const B = prBag(r), D = prDrawEv(r, B, k == null ? r.i(0, 2) : k % 3);
  const p = prMul(prQ(...D.g[0]), prQ(...D.g[1])), w = prMul(prQ(...D.f[0]), prQ(...D.f[1]));
  const ans = prF(p), wrong = prF(w), num = D.g[0][0] * D.g[1][0], den = D.g[0][1] * D.g[1][1];
  return GEN_LQ('tanpa', { B, ev: D.ev, ans, wrong, work: [`Cabutan pertama: ${fr(D.g[0][0], D.g[0][1])}. Tanpa pemulangan, tinggal ${B.t - 1} ${B.cx.o}.`, `Cabutan kedua: ${fr(D.g[1][0], D.g[1][1])}`, `P = ${fr(D.g[0][0], D.g[0][1])} × ${fr(D.g[1][0], D.g[1][1])} = ${prEq(num, den)}`] }, { fig: prBagFig(B.parts) });
};
const PRTIGA = [
  r => { const c = r.p(['gambar', 'angka']); return { x: 'Tiga keping syiling dilambung serentak.', ev: `mendapat ${c} pada ketiga-tiga syiling`, ps: [[1, 2], [1, 2], [1, 2]] }; },
  r => { const [nm, n] = r.p(PRDEV); return { x: 'Tiga biji dadu adil dilambung serentak.', ev: `mendapat ${nm} pada ketiga-tiga dadu`, ps: [prQ(n, 6), prQ(n, 6), prQ(n, 6)] }; },
  r => { const N = prShuf(r, PRNAMA).slice(0, 3), v = N.map(() => r.i(5, 9) * 10); return { x: `Kebarangkalian ${prDan(N)} menjawab betul satu soalan kuiz masing-masing ialah ${prDan(v.map(prHs))}.`, ev: 'ketiga-tiga mereka menjawab betul', ps: v.map(prH), dec: true }; },
  r => { const q = [r.p([[1, 2], [2, 3], [3, 4]]), r.p([[1, 3], [3, 5], [1, 2]]), r.p([[2, 5], [3, 4], [5, 6]])]; return { x: `Sebuah kereta melalui tiga lampu isyarat. Kebarangkalian lampu isyarat pertama, kedua dan ketiga berwarna hijau ialah ${prDan(q.map(prF))}, masing-masing.`, ev: 'ketiga-tiga lampu isyarat berwarna hijau', ps: q }; },
  r => { const v = [r.i(6, 9) * 10, r.i(6, 9) * 10, r.i(6, 9) * 10]; return { x: `Sebuah kilang mempunyai tiga mesin, X, Y dan Z, yang beroperasi secara tak bersandar. Kebarangkalian mesin X, Y dan Z tidak rosak dalam sehari ialah ${prDan(v.map(prHs))}, masing-masing.`, ev: 'ketiga-tiga mesin tidak rosak dalam sehari', ps: v.map(prH), dec: true }; }
];
PR.tiga = (r, k) => {
  const e = prAt(r, PRTIGA, k)(r), p = prMul(...e.ps), fm = e.dec ? prDec : prF;
  return GEN_LQ('tiga', { x: e.x, ev: e.ev, ans: fm(p), work: ['P(A ∩ B ∩ C) = P(A) × P(B) × P(C)', `= ${e.ps.map(fm).join(' × ')}`, `= ${fm(p)}`] });
};
PR.semak = (r, k) => {
  const indep = k == null ? r.f() < .5 : k % 2 === 0;
  let a, b, i;
  do { a = r.i(2, 9) * 10; b = r.i(2, 9) * 10; } while (a * b % 100 !== 0 || a === b);
  const prod = a * b / 100;
  if (indep) i = prod; else { let t = 0; do { i = prod + r.p([-10, -5, 5, 10]); t++; } while (t < 50 && (i <= 0 || i >= Math.min(a, b) || a + b - i > 100)); if (i <= 0 || i >= Math.min(a, b) || a + b - i > 100) i = prod + 5; }
  const pa = prHs(a), pb = prHs(b), pi = prHs(i), pp = prHs(prod);
  const ans = indep ? `Tak bersandar, kerana P(A) × P(B) = ${pp} = P(A ∩ B)` : `Bersandar, kerana P(A) × P(B) = ${pp} ≠ P(A ∩ B) = ${pi}`;
  return GEN_LQ('semak', { pa, pb, pi, indep, ans, work: [`P(A) × P(B) = ${pa} × ${pb} = ${pp}`, indep ? `${pp} = P(A ∩ B), maka A dan B tak bersandar.` : `${pp} ≠ ${pi}, maka A dan B bersandar.`] });
};
PR.k92 = r => {
  const B = prBag(r, true, 11), [c1, c2] = B.cs, [a, b] = B.n, t = B.t, o = B.cx.o, L1 = c1[0].toUpperCase(), L2 = c2[0].toUpperCase() === L1 ? c2.slice(0, 2).toUpperCase() : c2[0].toUpperCase();
  const p11 = prQ(a * (a - 1), t * (t - 1)), p22 = prQ(b * (b - 1), t * (t - 1)), p12 = prQ(a * b, t * (t - 1));
  const same = prAdd(p11, p22), diff = prAdd(p12, p12), atl = prOneMinus(p22);
  const lab = (n, d) => `${fr(n, d)}`;
  const s1 = [{ t: L1, p: lab(a, t), c: PRCOL[c1] }, { t: L2, p: lab(b, t), c: PRCOL[c2] }];
  const s2a = [[{ t: L1, p: '?', c: PRCOL[c1] }, { t: L2, p: '?', c: PRCOL[c2] }], [{ t: L1, p: '?', c: PRCOL[c1] }, { t: L2, p: '?', c: PRCOL[c2] }]];
  const s2b = [[{ t: L1, p: lab(a - 1, t - 1), c: PRCOL[c1] }, { t: L2, p: lab(b, t - 1), c: PRCOL[c2] }], [{ t: L1, p: lab(a, t - 1), c: PRCOL[c1] }, { t: L2, p: lab(b - 1, t - 1), c: PRCOL[c2] }]];
  const head = ['Pertama', 'Kedua', 'Kesudahan'], outs = [`(${L1}, ${L1})`, `(${L1}, ${L2})`, `(${L2}, ${L1})`, `(${L2}, ${L2})`];
  const legend = `${L1} = ${c1}, ${L2} = ${c2}`;
  const tt = {
    B, c1, same: prF(same), diff: prF(diff), atl: prF(atl),
    work: [`(a) Cabutan kedua: selepas ${L1}: ${lab(a - 1, t - 1)} dan ${lab(b, t - 1)}; selepas ${L2}: ${lab(a, t - 1)} dan ${lab(b - 1, t - 1)}`,
      `(b) P(sama warna) = ${fr(a, t)} × ${fr(a - 1, t - 1)} + ${fr(b, t)} × ${fr(b - 1, t - 1)} = ${fr(a * (a - 1), t * (t - 1))} + ${fr(b * (b - 1), t * (t - 1))} = ${prF(same)}`,
      `(c) P(sekurang-kurangnya satu ${c1}) = 1 − P(${L2}, ${L2}) = 1 − ${fr(b * (b - 1), t * (t - 1))} = ${prF(atl)}`],
    work2: [`(a) Cabutan kedua: selepas ${L1}: ${lab(a - 1, t - 1)} dan ${lab(b, t - 1)}; selepas ${L2}: ${lab(a, t - 1)} dan ${lab(b - 1, t - 1)}`,
      `(b) P(berlainan warna) = ${fr(a, t)} × ${fr(b, t - 1)} + ${fr(b, t)} × ${fr(a, t - 1)} = ${fr(2 * a * b, t * (t - 1))} = ${prF(diff)}`,
      `(c) P(sekurang-kurangnya satu ${c1}) = 1 − P(${L2}, ${L2}) = 1 − ${fr(b * (b - 1), t * (t - 1))} = ${prF(atl)}`]
  };
  const v = vq('k92', { t: tt });
  return { q: v.q + ` (${legend})`, ans: v.ans, work: v.work, fig: prTreeFig({ s1, s2: s2a, outs, head }, 'Gambar rajah pokok tidak lengkap'), figAns: prTreeFig({ s1, s2: s2b, outs, head }, 'Gambar rajah pokok lengkap') };
};

/* ---------- 9.3 ---------- */
function prSEx(r, k) {
  // konteks: dadu atau kad nombor
  const dice = k == null ? r.f() < .35 : k % 3 === 0;
  const lo = 1, hi = dice ? 6 : r.p([10, 12, 15, 16, 18, 20]);
  const x = dice ? 'Sebiji dadu adil dilambung.' : `Sekeping kad dipilih secara rawak daripada ${hi} keping kad bernombor ${lo} hingga ${hi}.`;
  return { dice, lo, hi, x };
}
PR.jenisSE = (r, k) => {
  const c = prSEx(r, k), ex = k == null ? r.f() < .5 : k % 2 === 0, d = prPair2(r, c.lo, c.hi, ex, c.dice ? 1 : 2);
  const As = prSet(d.A.A), Is = d.I.length ? prSet(d.I) : '∅';
  const ans = ex ? 'Saling eksklusif, kerana A ∩ B = ∅' : `Tidak saling eksklusif, kerana A ∩ B = ${Is}`;
  return GEN_LQ('jenisSE', { x: c.x, a: d.A.nm, b: d.B.nm, ex, Is, ans, work: [`A = ${As}`, `B = ${prSet(d.B.A)}`, `A ∩ B = ${Is}`] });
};
const PRATAU = [
  r => { const c = prSEx(r, 1), d = prPair2(r, c.lo, c.hi, true, 2), n = c.hi; return { x: c.x, ev: `mendapat ${d.A.nm} atau ${d.B.nm}`, pa: prQ(d.A.A.length, n), pb: prQ(d.B.A.length, n), w0: [`A = ${prSet(d.A.A)}, B = ${prSet(d.B.A)}, A ∩ B = ∅`, `P(A) = ${prEq(d.A.A.length, n)}, P(B) = ${prEq(d.B.A.length, n)}`] }; },
  r => { let a, b; do { a = prQ(r.i(1, 5), r.p([6, 8, 9, 10, 12])); b = prQ(r.i(1, 5), r.p([3, 4, 6, 12])); } while (a[0] * b[1] + b[0] * a[1] >= a[1] * b[1] || a[1] === 1 || b[1] === 1); return { x: `A dan B ialah dua peristiwa saling eksklusif dengan P(A) = ${prF(a)} dan P(B) = ${prF(b)}.`, ev: 'A atau B berlaku', pa: a, pb: b, w0: [] }; },
  r => { const B = prBag(r, false, 15), [c1, c2] = B.cs; return { x: `Sebuah ${B.cx.bk} mengandungi ${B.desc}. ${prCap(B.se)} ${B.cx.o} diambil secara rawak.`, ev: `mendapat ${B.cx.o} ${c1} atau ${c2}`, pa: prQ(B.n[0], B.t), pb: prQ(B.n[1], B.t), w0: [`P(${c1}) = ${prEq(B.n[0], B.t)}, P(${c2}) = ${prEq(B.n[1], B.t)}`], fig: prBagFig(B.parts) }; },
  r => { let w, s; do { w = r.i(6, 12) * 5; s = r.i(3, 8) * 5; } while (w + s >= 95); return { x: `Dalam satu perlawanan bola sepak, kebarangkalian pasukan sekolah menang ialah ${prHs(w)} dan kebarangkalian seri ialah ${prHs(s)}.`, ev: 'pasukan sekolah menang atau seri', pa: prH(w), pb: prH(s), dec: true, w0: ['Menang dan seri tidak boleh berlaku serentak: saling eksklusif.'] }; }
];
PR.atauSE = (r, k) => {
  const e = prAt(r, PRATAU, k)(r), fm = e.dec ? prDec : prF, p = prAdd(e.pa, e.pb), ans = fm(p), wrong = fm(prMul(e.pa, e.pb));
  return GEN_LQ('atauSE', { x: e.x, ev: e.ev, ans, wrong, work: e.w0.concat([`P(A ∪ B) = P(A) + P(B) = ${fm(e.pa)} + ${fm(e.pb)}`, `= ${ans}`]) }, e.fig ? { fig: e.fig } : {});
};
PR.irisan = (r, k) => {
  const c = prSEx(r, k == null ? null : k + 1), d = prPair2(r, c.lo, c.hi, false, 2), n = c.hi - c.lo + 1;
  const Is = prSet(d.I), Us = prSet(d.U);
  return GEN_LQ('irisan', { x: c.x, a: d.A.nm, b: d.B.nm, nI: d.I.length, nU: d.U.length, pI: prFr(d.I.length, n), pU: prFr(d.U.length, n), ans: `A ∩ B = ${Is}, A ∪ B = ${Us}`, work: [`A = ${prSet(d.A.A)}`, `B = ${prSet(d.B.A)}`, `A ∩ B = ${Is} (unsur sepunya), A ∪ B = ${Us} (semua unsur A atau B)`, `n(A ∩ B) = ${d.I.length}, n(A ∪ B) = ${d.U.length}, n(S) = ${n}`, `P(A ∩ B) = ${prEq(d.I.length, n)}, P(A ∪ B) = ${prEq(d.U.length, n)}`] });
};
PR.atauTSE = (r, k) => {
  const c = prSEx(r, 1), d = prPair2(r, c.lo, c.hi, false, 2), n = c.hi;
  const nA = d.A.A.length, nB = d.B.A.length, nI = d.I.length, nU = d.U.length;
  if (nA + nB - nI !== nU) throw new Error('kesatuan');
  const ans = prFr(nU, n), wrong = prFr(nA + nB, n);
  return GEN_LQ('atauTSE', { x: c.x, a: d.A.nm, b: d.B.nm, ans, wrong, work: [`A = ${prSet(d.A.A)}, B = ${prSet(d.B.A)}, A ∩ B = ${prSet(d.I)}`, `P(A ∪ B) = ${fr(nA, n)} + ${fr(nB, n)} − ${fr(nI, n)}`, `= ${prEq(nU, n)}`] });
};
const PRVENN = [['meminati bola sepak', 'meminati badminton', 'Bola sepak', 'Badminton'], ['memiliki basikal', 'memiliki telefon pintar', 'Basikal', 'Telefon'], ['menyertai Kelab Sains', 'menyertai Kelab Seni', 'Sains', 'Seni'], ['suka membaca novel', 'suka membaca komik', 'Novel', 'Komik']];
PR.venn = (r, k) => {
  const V = prAt(r, PRVENN, k == null ? null : k * 3 + 1);
  const a = r.i(3, 12), i = r.i(1, 8), b = r.i(3, 12), o = r.i(2, 10), t = a + i + b + o;
  const kind = k == null ? r.i(0, 2) : k % 3;
  const E = [[`${V[0]} atau ${V[1]}`, a + i + b, `n(A ∪ B) = ${a} + ${i} + ${b} = ${a + i + b}`], [`${V[0]} dan ${V[1]}`, i, `n(A ∩ B) = ${i}`], [`${V[0]} tetapi tidak ${V[1]}`, a, `n(A sahaja) = ${a}`]][kind];
  const x = `Gambar rajah Venn di bawah menunjukkan bilangan murid dalam sebuah kelas. A = {murid yang ${V[0]}} dan B = {murid yang ${V[1]}}.`;
  return GEN_LQ('venn', { x, ev: E[0], ans: prFr(E[1], t), work: [`n(S) = ${a} + ${i} + ${b} + ${o} = ${t}`, E[2], `P = ${prEq(E[1], t)}`] },
    { fig: prVennFig({ a, i, b, o }, 'A', 'B', 'Gambar rajah Venn bilangan murid'), figAns: prVennFig({ a, i, b, o }, 'A', 'B', 'Gambar rajah Venn bilangan murid', ['U', 'I', ''][kind] || '') });
};
PR.cariI = (r, k) => {
  const ex = k == null ? r.f() < .3 : k % 2 === 1;
  let a, b, i; do { a = r.i(2, 7) * 10 + r.p([0, 0, 5]); b = r.i(2, 6) * 10 + r.p([0, 5]); i = ex ? 0 : r.i(1, Math.min(a, b) / 5 - 1) * 5; } while (a + b - i >= 100 || i >= Math.min(a, b));
  const u = a + b - i, pi = prHs(i);
  return GEN_LQ('cariI', { pa: prHs(a), pb: prHs(b), pu: prHs(u), ans: ex ? '0; A dan B saling eksklusif' : `${pi}; A dan B tidak saling eksklusif`, work: ['P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', `${prHs(u)} = ${prHs(a)} + ${prHs(b)} − P(A ∩ B)`, `P(A ∩ B) = ${prHs(a + b)} − ${prHs(u)} = ${pi}`] });
};
PR.k93 = r => {
  let c, tries = 0;
  do {
    const hi = r.p([12, 15, 18, 20]), d = prPair2(r, 1, hi, false, 2);
    const E = prNumEvs(r, 1, hi).filter(e => e.A.length >= 2 && e.A.length < hi && !e.A.some(x => d.A.A.includes(x)) && e.nm !== d.A.nm && e.nm !== d.B.nm);
    tries++;
    if (!E.length) continue;
    const C = r.p(E), nA = d.A.A.length, nB = d.B.A.length, nI = d.I.length, nC = C.A.length;
    c = { lo: 1, hi, a: d.A.nm, b: d.B.nm, c: C.nm, Is: prSet(d.I), pU: prFr(d.U.length, hi), pAC: prFr(nA + nC, hi),
      work: [`A = ${prSet(d.A.A)}, B = ${prSet(d.B.A)}, C = ${prSet(C.A)}`, `(a) A ∩ B = ${prSet(d.I)}`, `(b) P(A ∪ B) = ${fr(nA, hi)} + ${fr(nB, hi)} − ${fr(nI, hi)} = ${prEq(d.U.length, hi)}`, `(c) A ∩ C = ∅, maka P(A ∪ C) = ${fr(nA, hi)} + ${fr(nC, hi)} = ${prEq(nA + nC, hi)}`] };
  } while (!c && tries < 60);
  if (!c) c = { lo: 1, hi: 20, a: 'nombor genap', b: 'nombor gandaan 3', c: 'nombor gandaan 5 yang ganjil', Is: '{6, 12, 18}', pU: fr(13, 20), pAC: fr(3, 5), work: ['A = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20}, B = {3, 6, 9, 12, 15, 18}, C = {5, 15}', '(a) A ∩ B = {6, 12, 18}', `(b) P(A ∪ B) = ${fr(10, 20)} + ${fr(6, 20)} − ${fr(3, 20)} = ${fr(13, 20)}`, `(c) A ∩ C = ∅, maka P(A ∪ C) = ${fr(10, 20)} + ${fr(2, 20)} = ${fr(12, 20)} = ${fr(3, 5)}`] };
  const t = r.p([30, 32, 35, 36, 40]), A = r.i(10, 18), B = r.i(8, 15), I = r.i(2, Math.min(A, B) - 3), o = t - (A + B - I);
  const v = { t, A, B, I, pU: prFr(A + B - I, t), pO: prFr(o, t), work: [`(a) Sains sahaja = ${A} − ${I} = ${A - I}, Matematik sahaja = ${B} − ${I} = ${B - I}, kedua-dua = ${I}, tiada kelab = ${t} − ${A + B - I} = ${o}`, `(b) n(Sains atau Matematik) = ${A} + ${B} − ${I} = ${A + B - I}, P = ${prEq(A + B - I, t)}`, `(c) P(tiada kelab) = ${prEq(o, t)}`] };
  const q = vq('k93', { c, v });
  const isV = /Kelab Sains/.test(q.q);
  return isV ? { q: q.q, ans: q.ans, work: q.work, figAns: prVennFig({ a: A - I, i: I, b: B - I, o }, 'Sains', 'Matematik', 'Gambar rajah Venn ahli Kelab Sains dan Kelab Matematik') } : { q: q.q, ans: q.ans, work: q.work };
};

/* ---------- 9.4 ---------- */
// konteks dua peristiwa tak bersandar: p, q dalam perseratus
const PRDUA = [
  (p, q, r) => { const [A, B] = prNama2(r); return { x: `Kebarangkalian ${A} mengena sasaran ialah ${prHs(p)} dan kebarangkalian ${B} mengena sasaran ialah ${prHs(q)}. Mereka memanah sekali setiap seorang.`, both: 'kedua-dua mereka mengena sasaran', none: 'kedua-dua mereka tidak mengena sasaran', one: 'tepat seorang sahaja mengena sasaran', atl: 'sekurang-kurangnya seorang mengena sasaran', onlyA: `hanya ${A} mengena sasaran`, a: A, b: B, ya: 'K', no: 'K′', lab: 'K = mengena, K′ = tidak mengena', h: [A, B] }; },
  (p, q) => ({ x: `Kebarangkalian hujan pada hari Sabtu ialah ${prHs(p)} dan kebarangkalian hujan pada hari Ahad ialah ${prHs(q)}. Cuaca pada kedua-dua hari itu tidak bersandar.`, both: 'hujan pada kedua-dua hari', none: 'tidak hujan pada kedua-dua hari', one: 'hujan pada tepat satu hari sahaja', atl: 'hujan pada sekurang-kurangnya satu hari', onlyA: 'hujan pada hari Sabtu sahaja', ya: 'H', no: 'H′', lab: 'H = hujan, H′ = tidak hujan', h: ['Sabtu', 'Ahad'] }),
  (p, q) => ({ x: `Sebuah kedai mempunyai dua mesin fotostat, P dan Q, yang berfungsi secara tak bersandar. Kebarangkalian mesin P berfungsi ialah ${prHs(p)} dan kebarangkalian mesin Q berfungsi ialah ${prHs(q)}.`, both: 'kedua-dua mesin berfungsi', none: 'kedua-dua mesin tidak berfungsi', one: 'tepat satu mesin berfungsi', atl: 'sekurang-kurangnya satu mesin berfungsi', onlyA: 'hanya mesin P berfungsi', ya: 'F', no: 'F′', lab: 'F = berfungsi, F′ = tidak berfungsi', h: ['Mesin P', 'Mesin Q'] }),
  (p, q, r) => { const [A, B] = prNama2(r); return { x: `Kebarangkalian ${A} lulus ujian Matematik ialah ${prHs(p)} dan kebarangkalian ${B} lulus ujian yang sama ialah ${prHs(q)}.`, both: 'kedua-dua mereka lulus', none: 'kedua-dua mereka gagal', one: 'tepat seorang sahaja lulus', atl: 'sekurang-kurangnya seorang lulus', onlyA: `hanya ${A} lulus`, a: A, b: B, ya: 'L', no: 'L′', lab: 'L = lulus, L′ = gagal', h: [A, B] }; },
  (p, q) => ({ x: `Kebarangkalian bas pertama tiba tepat pada masanya ialah ${prHs(p)} dan kebarangkalian bas kedua tiba tepat pada masanya ialah ${prHs(q)}. Ketibaan kedua-dua bas tidak bersandar.`, both: 'kedua-dua bas tiba tepat pada masanya', none: 'kedua-dua bas tidak tiba tepat pada masanya', one: 'tepat satu bas tiba tepat pada masanya', atl: 'sekurang-kurangnya satu bas tiba tepat pada masanya', onlyA: 'hanya bas pertama tiba tepat pada masanya', ya: 'T', no: 'T′', lab: 'T = tepat pada masa, T′ = lewat', h: ['Bas 1', 'Bas 2'] })
];
function prDuaData(r, k) {
  let p, q; do { p = r.i(2, 9) * 10 + (r.f() < .25 ? 5 : 0); q = r.i(2, 9) * 10; } while (p === q || p > 95);
  const C = prAt(r, PRDUA, k)(p, q, r), P = prH(p), Q = prH(q), Pn = prOneMinus(P), Qn = prOneMinus(Q);
  const both = prMul(P, Q), none = prMul(Pn, Qn), oa = prMul(P, Qn), ob = prMul(Pn, Q), one = prAdd(oa, ob), atl = prOneMinus(none);
  return { C, p, q, P, Q, Pn, Qn, both, none, oa, ob, one, atl, d: prDec };
}
PR.keduaDua = (r, k) => {
  const D = prDuaData(r, k), nb = k == null ? r.f() < .5 : k % 2 === 0, d = prDec;
  const ev = nb ? D.C.both : D.C.none, ans = d(nb ? D.both : D.none);
  return GEN_LQ('keduaDua', { x: D.C.x, ev, ans, work: nb ? [`P = ${d(D.P)} × ${d(D.Q)}`, `= ${ans}`] : [`Kebarangkalian pelengkap: 1 − ${d(D.P)} = ${d(D.Pn)}, 1 − ${d(D.Q)} = ${d(D.Qn)}`, `P = ${d(D.Pn)} × ${d(D.Qn)}`, `= ${ans}`] });
};
PR.skl = (r, k) => {
  const D = prDuaData(r, k), d = prDec, ans = d(D.atl), wrong = d(prOneMinus(D.both));
  return GEN_LQ('skl', { x: D.C.x, ev: D.C.atl, ans, wrong, work: [`P(${D.C.none}) = ${d(D.Pn)} × ${d(D.Qn)} = ${d(D.none)}`, `P(${D.C.atl}) = 1 − ${d(D.none)}`, `= ${ans}`] });
};
const PRDD = [
  r => { let s1, s2; do { s1 = r.i(2, 12); s2 = r.i(2, 12); } while (s1 === s2); return { ev: `hasil tambah ${s1} atau hasil tambah ${s2}`, A: (a, b) => a + b === s1, B: (a, b) => a + b === s2, la: `hasil tambah ${s1}`, lb: `hasil tambah ${s2}` }; },
  r => { const s = r.p([3, 5, 7, 9, 11]); return { ev: `kedua-dua nombor sama atau hasil tambah ${s}`, A: (a, b) => a === b, B: (a, b) => a + b === s, la: 'nombor sama', lb: `hasil tambah ${s}` }; },
  () => ({ ev: 'sekurang-kurangnya satu nombor 6 atau kedua-dua nombor sama', A: (a, b) => a === 6 || b === 6, B: (a, b) => a === b, la: 'sekurang-kurangnya satu 6', lb: 'nombor sama' }),
  r => { const s = r.i(8, 10); return { ev: `hasil tambah lebih besar daripada ${s} atau kedua-dua nombor ganjil`, A: (a, b) => a + b > s, B: (a, b) => a % 2 === 1 && b % 2 === 1, la: `hasil tambah > ${s}`, lb: 'kedua-dua ganjil' }; },
  r => { const t = r.p([1, 2, 3, 4, 5, 6]); return { ev: `nombor ${t} pada dadu pertama atau nombor ${t} pada dadu kedua`, A: a => a === t, B: (a, b) => b === t, la: `dadu pertama ${t}`, lb: `dadu kedua ${t}` }; }
];
PR.dadu2 = (r, k) => {
  const e = prAt(r, PRDD, k)(r), nA = PRDICE.filter(([a, b]) => e.A(a, b)).length, nB = PRDICE.filter(([a, b]) => e.B(a, b)).length;
  const nI = PRDICE.filter(([a, b]) => e.A(a, b) && e.B(a, b)).length, nU = PRDICE.filter(([a, b]) => e.A(a, b) || e.B(a, b)).length;
  if (nA + nB - nI !== nU) throw new Error('dadu2');
  const ans = prFr(nU, 36);
  const work = [`n(S) = 36; n(${e.la}) = ${nA}, n(${e.lb}) = ${nB}`, nI ? `Tidak saling eksklusif: n(kedua-duanya) = ${nI}` : 'Saling eksklusif: tiada kesudahan sepunya', nI ? `P = ${fr(nA, 36)} + ${fr(nB, 36)} − ${fr(nI, 36)} = ${prEq(nU, 36)}` : `P = ${fr(nA, 36)} + ${fr(nB, 36)} = ${prEq(nU, 36)}`];
  return GEN_LQ('dadu2', { ev: e.ev, ans, work });
};
function prDuaTree(D, full, hiIdx) {
  const d = prDec, C = D.C;
  const s1 = [{ t: C.ya, p: d(D.P), c: 'tr' }, { t: C.no, p: d(D.Pn), c: 'pk' }];
  const s2 = [0, 1].map(() => [{ t: C.ya, p: full ? d(D.Q) : '?', c: 'tr' }, { t: C.no, p: full ? d(D.Qn) : '?', c: 'pk' }]);
  return prTreeFig({ s1, s2, outs: [`(${C.ya}, ${C.ya})`, `(${C.ya}, ${C.no})`, `(${C.no}, ${C.ya})`, `(${C.no}, ${C.no})`], hi: hiIdx, head: [C.h[0], C.h[1], 'Kesudahan'] }, `Gambar rajah pokok: ${C.lab}`);
}
PR.tepatSatu = (r, k) => {
  const D = prDuaData(r, k), d = prDec, ans = d(D.one), wrong = d(D.oa);
  return GEN_LQ('tepatSatu', { x: `${D.C.x} (${D.C.lab})`, ev: D.C.one, ans, wrong, work: [`Tepat satu: (${D.C.ya}, ${D.C.no}) atau (${D.C.no}, ${D.C.ya})`, `P = ${d(D.P)} × ${d(D.Qn)} + ${d(D.Pn)} × ${d(D.Q)}`, `= ${d(D.oa)} + ${d(D.ob)} = ${ans}`] },
    { fig: prDuaTree(D, false), figAns: prDuaTree(D, true, [1, 2]) });
};
PR.samaWarna = (r, k) => {
  const B = prBag(r, true, 12), [a, b] = B.n, t = B.t, [c1, c2] = B.cs, diff = k == null ? r.f() < .4 : k % 3 === 2;
  const pS = prQ(a * (a - 1) + b * (b - 1), t * (t - 1)), pD = prQ(2 * a * b, t * (t - 1));
  const ans = prF(diff ? pD : pS), wrong = prF(diff ? prQ(a * b, t * (t - 1)) : prQ(a * (a - 1), t * (t - 1)));
  const ev = diff ? `kedua-dua ${B.cx.o} berlainan warna` : `kedua-dua ${B.cx.o} sama warna`;
  const work = diff ? [`Berlainan warna: (${c1}, ${c2}) atau (${c2}, ${c1})`, `P = ${fr(a, t)} × ${fr(b, t - 1)} + ${fr(b, t)} × ${fr(a, t - 1)}`, `= ${fr(a * b, t * (t - 1))} + ${fr(a * b, t * (t - 1))} = ${prEq(2 * a * b, t * (t - 1))}`]
    : [`Sama warna: (${c1}, ${c1}) atau (${c2}, ${c2})`, `P = ${fr(a, t)} × ${fr(a - 1, t - 1)} + ${fr(b, t)} × ${fr(b - 1, t - 1)}`, `= ${fr(a * (a - 1), t * (t - 1))} + ${fr(b * (b - 1), t * (t - 1))} = ${prEq(a * (a - 1) + b * (b - 1), t * (t - 1))}`];
  return GEN_LQ('samaWarna', { B, ev, ans, wrong: wrong === ans ? prF(prQ(b * (b - 1), t * (t - 1))) : wrong, work }, { fig: prBagFig(B.parts) });
};
PR.pemain = (r, k) => {
  const kind = k == null ? r.i(0, 2) : k % 3;
  if (kind === 2) {
    const [A, B] = prNama2(r), [nm, n] = r.p(PRDEV);
    const p = prMul(prQ(n, 6), prQ(6 - n, 6));
    return GEN_LQ('pemain', { x: `${A} dan ${B} masing-masing melambung sebiji dadu adil.`, ev: `${A} mendapat ${nm} tetapi ${B} tidak mendapat ${nm}`, ans: prF(p), work: [`P(${A} mendapat ${nm}) = ${prEq(n, 6)}`, `P(${B} tidak mendapat ${nm}) = 1 − ${prFr(n, 6)} = ${prFr(6 - n, 6)}`, `P = ${prFr(n, 6)} × ${prFr(6 - n, 6)} = ${prF(p)}`] });
  }
  const D = prDuaData(r, kind === 0 ? 0 : 3), d = prDec;
  return GEN_LQ('pemain', { x: D.C.x, ev: D.C.onlyA, ans: d(D.oa), work: [`${prCap(D.C.onlyA)}: (${D.C.ya}, ${D.C.no})`, `P = ${d(D.P)} × (1 − ${d(D.Q)}) = ${d(D.P)} × ${d(D.Qn)}`, `= ${d(D.oa)}`] });
};
PR.k94 = r => {
  const d = prDec;
  let p, q1, q2; do { p = r.i(2, 7) * 10; q1 = r.i(4, 8) * 10; q2 = r.i(1, 3) * 10; } while (q1 <= q2);
  const P = prH(p), Pn = prOneMinus(P), Q1 = prH(q1), Q2 = prH(q2), late = prAdd(prMul(P, Q1), prMul(Pn, Q2)), A = r.p(PRNAMA);
  const w = { A, p: d(P), q1: d(Q1), q2: d(Q2), late: d(late), ok: d(prOneMinus(late)), work: [`(a) Cabang: H ${d(P)}, H′ ${d(Pn)}; selepas H: L ${d(Q1)}, L′ ${d(prOneMinus(Q1))}; selepas H′: L ${d(Q2)}, L′ ${d(prOneMinus(Q2))}`, `(b) P(lewat) = ${d(P)} × ${d(Q1)} + ${d(Pn)} × ${d(Q2)} = ${d(prMul(P, Q1))} + ${d(prMul(Pn, Q2))} = ${d(late)}`, `(c) P(tidak lewat) = 1 − ${d(late)} = ${d(prOneMinus(late))}`] };
  const D = prDuaData(r, r.i(0, 4));
  const dd = { x: D.C.x, both: D.C.both, one: D.C.one, atl: D.C.atl, pBoth: d(D.both), pOne: d(D.one), pAtl: d(D.atl), work: [`(a) ${d(D.P)} × ${d(D.Q)} = ${d(D.both)}`, `(b) ${d(D.P)} × ${d(D.Qn)} + ${d(D.Pn)} × ${d(D.Q)} = ${d(D.oa)} + ${d(D.ob)} = ${d(D.one)}`, `(c) 1 − ${d(D.Pn)} × ${d(D.Qn)} = 1 − ${d(D.none)} = ${d(D.atl)}`] };
  const B = prBag(r, true, 12), [a, b] = B.n, t = B.t, [c1, c2] = B.cs;
  const p11 = prQ(a * (a - 1), t * (t - 1)), same = prQ(a * (a - 1) + b * (b - 1), t * (t - 1)), atl = prOneMinus(prQ(b * (b - 1), t * (t - 1)));
  const bb = { B, c1, p11: prF(p11), same: prF(same), atl: prF(atl), work: [`(a) ${fr(a, t)} × ${fr(a - 1, t - 1)} = ${prEq(a * (a - 1), t * (t - 1))}`, `(b) ${fr(a * (a - 1), t * (t - 1))} + ${fr(b, t)} × ${fr(b - 1, t - 1)} = ${fr(a * (a - 1), t * (t - 1))} + ${fr(b * (b - 1), t * (t - 1))} = ${prF(same)}`, `(c) 1 − P(kedua-dua ${c2}) = 1 − ${fr(b * (b - 1), t * (t - 1))} = ${prF(atl)}`] };
  const v = vq('k94', { w, d: dd, b: bb });
  if (/lewat ke sekolah/.test(v.q)) {
    const s1 = [{ t: 'H', p: d(P), c: 'tr' }, { t: 'H′', p: d(Pn), c: 'pk' }];
    const mk = full => [[{ t: 'L', p: full ? d(Q1) : '?', c: 'am' }, { t: 'L′', p: full ? d(prOneMinus(Q1)) : '?', c: 'gr' }], [{ t: 'L', p: full ? d(Q2) : '?', c: 'am' }, { t: 'L′', p: full ? d(prOneMinus(Q2)) : '?', c: 'gr' }]];
    const head = ['Cuaca', A, 'Kesudahan'], outs = ['(H, L)', '(H, L′)', '(H′, L)', '(H′, L′)'];
    return { q: v.q + ' (H = hujan, L = lewat)', ans: v.ans, work: v.work, fig: prTreeFig({ s1, s2: mk(false), outs, head }, 'Gambar rajah pokok hujan dan lewat, tidak lengkap'), figAns: prTreeFig({ s1, s2: mk(true), outs, head, hi: [0, 2] }, 'Gambar rajah pokok hujan dan lewat, lengkap') };
  }
  if (/sama warna/.test(v.q)) return { q: v.q, ans: v.ans, work: v.work, fig: prBagFig(B.parts) };
  return { q: v.q, ans: v.ans, work: v.work, figAns: prDuaTree(D, true, []) };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '9.1': {
    m: [() => PR.ruang(prRG), () => PR.nS(prRG), () => PR.senarai(prRG)],
    s: [() => PR.pokok(prRG), () => PR.jadual(prRG)],
    k: [() => PR.k91(prRG)]
  },
  '9.2': {
    m: [() => PR.jenis(prRG), () => PR.darab(prRG), () => PR.dengan(prRG)],
    s: [() => PR.tanpa(prRG), () => PR.tiga(prRG), () => PR.semak(prRG)],
    k: [() => PR.k92(prRG)]
  },
  '9.3': {
    m: [() => PR.jenisSE(prRG), () => PR.atauSE(prRG), () => PR.irisan(prRG)],
    s: [() => PR.atauTSE(prRG), () => PR.venn(prRG), () => PR.cariI(prRG)],
    k: [() => PR.k93(prRG)]
  },
  '9.4': {
    m: [() => PR.keduaDua(prRG), () => PR.skl(prRG), () => PR.dadu2(prRG)],
    s: [() => PR.tepatSatu(prRG), () => PR.samaWarna(prRG), () => PR.pemain(prRG)],
    k: [() => PR.k94(prRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 9.1
WG.ruang = i => PR.ruang(prRW, i);
WG.nS = i => PR.nS(prRW, i + 1);
WG.senarai = i => PR.senarai(prRW, i);
WG.pokok = i => PR.pokok(prRW, i);
WG.jadual = i => PR.jadual(prRW, i);
WG.k91 = () => PR.k91(prRW);
// 9.2
WG.jenis = i => PR.jenis(prRW, i * 5 + wri(0, 1));
WG.darab = i => PR.darab(prRW, i);
WG.dengan = i => PR.dengan(prRW, i);
WG.tanpa = i => PR.tanpa(prRW, i);
WG.tiga = i => PR.tiga(prRW, i * 2);
WG.semak = i => PR.semak(prRW, i);
WG.k92 = () => PR.k92(prRW);
// 9.3
WG.jenisSE = i => PR.jenisSE(prRW, i);
WG.atauSE = i => PR.atauSE(prRW, i);
WG.irisan = i => PR.irisan(prRW, i);
WG.atauTSE = i => PR.atauTSE(prRW, i);
WG.venn = i => PR.venn(prRW, i);
WG.cariI = i => PR.cariI(prRW, i);
WG.k93 = () => PR.k93(prRW);
// 9.4
WG.keduaDua = i => PR.keduaDua(prRW, i);
WG.skl = i => PR.skl(prRW, i);
WG.dadu2 = i => PR.dadu2(prRW, i);
WG.tepatSatu = i => PR.tepatSatu(prRW, i);
WG.samaWarna = i => PR.samaWarna(prRW, i);
WG.pemain = i => PR.pemain(prRW, i);
WG.k94 = () => PR.k94(prRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '9.1': [['m', 'ruang', 7], ['m', 'nS', 5], ['m', 'senarai', 6], ['s', 'pokok', 5], ['s', 'jadual', 4], ['k', 'k91', 3]],
  '9.2': [['m', 'jenis', 5], ['m', 'darab', 7], ['m', 'dengan', 6], ['s', 'tanpa', 4], ['s', 'tiga', 3], ['s', 'semak', 2], ['k', 'k92', 3]],
  '9.3': [['m', 'jenisSE', 6], ['m', 'atauSE', 6], ['m', 'irisan', 6], ['s', 'atauTSE', 4], ['s', 'venn', 3], ['s', 'cariI', 2], ['k', 'k93', 3]],
  '9.4': [['m', 'keduaDua', 6], ['m', 'skl', 6], ['m', 'dadu2', 6], ['s', 'tepatSatu', 4], ['s', 'samaWarna', 3], ['s', 'pemain', 2], ['k', 'k94', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan pecahan: ans = [n, d]; cands = senarai [n, d]
function prOptsQ(ans, cands, fm = prF) {
  const A = fm(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!c || c[1] <= 0 || c[0] < 0 || c[0] > c[1]) continue; const s = fm(prQ(c[0], c[1])); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans[0] + (k % 2 ? 1 : -1) * Math.ceil(k / 2), dn = ans[1] * (k > 12 ? 2 : 1); if (v < 1 || v > dn) continue; const s = fm(prQ(v, dn)); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function prOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const prMcq = (q, fig, o) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const CQGEN = {
  gabung: [
    () => { const e = pick(PRNS)(prRG), n = e.parts.reduce((a, b) => a * b, 1), s = prSum(e.parts); return prMcq(`${e.desc} Berapakah n(S)?`, '', prOptsT(String(n), [String(s), String(n * 2), String(n + 2), String(Math.max(...e.parts)), String(n - 1)])); },
    () => { const E = prDiceEvs(prRG).filter(([, f]) => { const c = PRDICE.filter(([a, b]) => f(a, b)).length; return c >= 1 && c <= 12; }), [nm, f] = pick(E), k = PRDICE.filter(([a, b]) => f(a, b)).length; return prMcq(`Dua biji dadu adil dilambung. Berapakah kebarangkalian mendapat ${nm}?`, '', prOptsQ(prQ(k, 36), [[k, 6], [k, 12], [k + 1, 36], [k - 1, 36], [36 - k, 36], [k, 36 - k]])); },
    () => { const e = pick(PRPOK)(prRG), S = prProd(e.A, e.B), k = S.filter(p => e.f(...p)).length, o = { s1: e.A.map((t, i) => ({ t, c: e.cA[i] })), s2: e.A.map(() => e.B.map((t, j) => ({ t, c: e.cB[j] }))), outs: S.map(p => prPair(...p)), head: [e.head[0], e.head[1], 'Kesudahan'] }; return prMcq(`${e.desc} Berapakah kebarangkalian ${e.ev}?`, prTreeFig(o), prOptsQ(prQ(k, S.length), [[k, S.length + 1], [k + 1, S.length], [S.length - k, S.length], [1, S.length], [k, e.A.length + e.B.length]])); }
  ],
  bersandar: [
    () => { const dep = shuffle(PRJENIS.filter(x => x[1])), ind = shuffle(PRJENIS.filter(x => !x[1])); const want = Math.random() < .5; const ans = (want ? dep : ind)[0][0], c = (want ? ind : dep).slice(0, 3).map(x => x[0]); return prMcq(`Situasi manakah menunjukkan peristiwa <b>${want ? 'bersandar' : 'tak bersandar'}</b>?`, '', prOptsT(ans, c)); },
    () => { const e = pick(PRDARAB)(prRG), fm = e.dec ? prDec : prF, p = prMul(e.pa, e.pb); return prMcq(`${e.x} Berapakah kebarangkalian ${e.ev}?`, '', prOptsQ(p, [prAdd(e.pa, e.pb), e.pa, e.pb, prMul(e.pa, prOneMinus(e.pb)), prOneMinus(p)].filter(q => q[0] <= q[1]), fm)); },
    () => { const B = prBag(prRG), D = prDrawEv(prRG, B, ri(0, 2)), p = prMul(prQ(...D.g[0]), prQ(...D.g[1])); return prMcq(`Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil satu demi satu tanpa pemulangan. Berapakah kebarangkalian ${D.ev}?`, prBagFig(B.parts), prOptsQ(p, [prMul(prQ(...D.f[0]), prQ(...D.f[1])), prQ(D.g[0][0] * D.g[1][0], D.g[0][1] * D.g[0][1]), prQ(...D.g[1]), prQ(...D.g[0])])); }
  ],
  eksklusif: [
    () => { const want = Math.random() < .5; const P = []; for (let t = 0; t < 40 && P.length < 4; t++) { const d = prPair2(prRG, 1, 6, P.length === 0 ? want : !want, 1), s = `${d.A.nm} dan ${d.B.nm}`; if (!P.includes(s)) P.push(s); } return prMcq(`Sebiji dadu dilambung. Pasangan peristiwa manakah <b>${want ? '' : 'tidak '}saling eksklusif</b>?`, '', prOptsT(P[0], P.slice(1))); },
    () => { const e = pick(PRATAU)(prRG), fm = e.dec ? prDec : prF, p = prAdd(e.pa, e.pb); return prMcq(`${e.x} Berapakah kebarangkalian ${e.ev}?`, e.fig || '', prOptsQ(p, [prMul(e.pa, e.pb), e.pa, e.pb, prOneMinus(p), prSub(e.pa, prMul(e.pa, e.pb))].filter(q => q[0] >= 0 && q[0] <= q[1]), fm)); },
    () => { const a = ri(3, 10), i = ri(1, 6), b = ri(3, 10), o = ri(2, 8), t = a + i + b + o; return prMcq('Berdasarkan gambar rajah Venn bilangan murid, seorang murid dipilih secara rawak. Berapakah P(A ∪ B)?', prVennFig({ a, i, b, o }), prOptsQ(prQ(a + i + b, t), [[a + 2 * i + b, t], [a + b, t], [i, t], [o, t], [a + i + b, t - o]])); }
  ],
  aplikasi: [
    () => { const D = prDuaData(prRG); return prMcq(`${D.C.x} Berapakah kebarangkalian ${D.C.atl}?`, '', prOptsQ(D.atl, [prOneMinus(D.both), D.both, D.none, D.one, prAdd(D.P, D.Q)].filter(q => q[0] <= q[1]), prDec)); },
    () => { const D = prDuaData(prRG); return prMcq(`${D.C.x} Berapakah kebarangkalian ${D.C.one}?`, '', prOptsQ(D.one, [D.oa, D.ob, D.both, D.none, D.atl], prDec)); },
    () => { const B = prBag(prRG, true, 12), [a, b] = B.n, t = B.t, p = prQ(a * (a - 1) + b * (b - 1), t * (t - 1)); return prMcq(`Sebuah ${B.cx.bk} mengandungi ${B.desc}. Dua ${B.cx.cl} ${B.cx.o} diambil tanpa pemulangan. Berapakah kebarangkalian kedua-duanya sama warna?`, prBagFig(B.parts), prOptsQ(p, [[a * a + b * b, t * t], [a * (a - 1), t * (t - 1)], [2 * a * b, t * (t - 1)], [a + b - 2, t]])); }
  ]
};
const CQT = { gabung: 'Peristiwa bergabung', bersandar: 'Bersandar & tak bersandar', eksklusif: 'Saling eksklusif', aplikasi: 'Aplikasi' };
function prCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.gabung;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['gabung', 'gabung', 'bersandar', 'eksklusif', 'aplikasi'] : Object.keys(CQT);
  return prCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return prCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
