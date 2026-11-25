'use strict';
/* =================== RUMUS · SOALAN BAB 3 RUMUS ALGEBRA (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "ru" / "RU" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & teks =================== */
// nombor kemas: bundar 4 t.p., tiada −0, tanda tolak sebenar
const ruN = x => { let v = Math.round(x * 10000) / 10000; if (Object.is(v, -0) || Math.abs(v) < 1e-12) v = 0; return fmt(v); };
const ruPar = x => (x < 0 ? `(${ruN(x)})` : ruN(x));
const ruRM = v => 'RM' + (Number.isInteger(Math.round(v * 100) / 100) ? ruN(v) : (Math.round(v * 100) / 100).toFixed(2));
const ruInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const ruNice = x => ruInt(x * 10) && Math.abs(x) < 10000;           // integer atau 1 t.p.
const ruTerm = (c, v) => (c === 1 ? v : c === -1 ? '−' + v : ruN(c) + v);
// ungkapan linear: [[pekali, huruf] …] + pemalar → "3t − 5u + 2"
function ruLin(terms, k) {
  let s = '';
  terms.forEach(([c, v]) => { if (!c) return; if (!s) s = ruTerm(c, v); else s += (c < 0 ? ' − ' : ' + ') + ruTerm(Math.abs(c), v); });
  if (k) s = s ? s + (k < 0 ? ' − ' : ' + ') + ruN(Math.abs(k)) : ruN(k);
  return s || '0';
}
// rawak: ruRG untuk Latihan Kelas / games, ruRW (berbenih) untuk Lembaran Kerja
const ruRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const ruRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const ruShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ruDist = (r, a, n) => ruShuf(r, a).slice(0, n);
const ruDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const RUPOS = 'Diberi semua pemboleh ubah bernilai positif.';

/* =================== data bersama =================== */
const RUITEM = [['pensel', 'batang'], ['pemadam', 'biji'], ['buku latihan', 'buah'], ['pembaris', 'batang'], ['kotak pensel', 'buah'], ['roti', 'buku'], ['air kotak', 'kotak'], ['kuih', 'biji'], ['epal', 'biji'], ['pen', 'batang'], ['fail', 'buah'], ['donut', 'biji']];
const RUCNT = [['x', 'y'], ['m', 'n'], ['p', 'q'], ['a', 'b'], ['h', 'k'], ['u', 'v'], ['r', 's']];
const RUSUBJ = ['T', 'J', 'H', 'K'];
const RUKENAL = [
  ['P = 4s', 'P', ['P', 's'], '4'],
  ['K = 2(p + l)', 'K', ['K', 'p', 'l'], '2'],
  ['A = πj²', 'A', ['A', 'j'], 'π'],
  ['F = 9C/5 + 32', 'F', ['F', 'C'], '9, 5 dan 32'],
  ['T = 4 + 1.5j', 'T', ['T', 'j'], '4 dan 1.5'],
  ['E = ½mv²', 'E', ['E', 'm', 'v'], '½'],
  ['y = 3x − 7', 'y', ['y', 'x'], '3 dan 7'],
  ['J = 2x + 5y', 'J', ['J', 'x', 'y'], '2 dan 5'],
  ['B = 50 − 4n', 'B', ['B', 'n'], '50 dan 4'],
  ['H = 12k + 3m', 'H', ['H', 'k', 'm'], '12 dan 3'],
  ['S = 100 + 20w', 'S', ['S', 'w'], '100 dan 20'],
  ['K = 2πj', 'K', ['K', 'j'], '2 dan π']
];
const RUBS1 = [
  ['Dalam rumus P = 4s, perkara rumus ialah P.', true, 'P ditulis bersendirian di sebelah kiri tanda =, maka P ialah perkara rumus.'],
  ['4s ialah sebuah rumus.', false, '4s ialah ungkapan. Rumus mesti mempunyai tanda = dan perkara rumus, contohnya P = 4s.'],
  ['Pemalar ialah kuantiti yang nilainya tetap.', true, 'Pemalar tidak berubah, contohnya 4 dalam P = 4s.'],
  ['Dalam rumus A = πj², π ialah pemboleh ubah.', false, 'π ialah pemalar (lebih kurang 3.142); nilainya tetap.'],
  ['Jika sebiji gula-gula berharga 20 sen, jumlah harga, RMJ, bagi g biji ialah J = 20g.', false, '20 sen = RM0.20, maka J = 0.2g.'],
  ['Umur Ali sekarang ialah x tahun. Umurnya 5 tahun lagi, U tahun, diberi oleh U = x + 5.', true, 'Selepas 5 tahun, umur bertambah 5, maka U = x + 5.'],
  ['Rumus luas, L, bagi segi empat sama bersisi s ialah L = 2s.', false, 'Luas = s × s, maka L = s².'],
  ['Sesuatu rumus boleh mempunyai lebih daripada satu pemboleh ubah di sebelah kanan tanda =.', true, 'Contohnya T = 2x + 5y mempunyai dua pemboleh ubah, x dan y.']
];

/* =================== rajah =================== */
const ruT = (x, y, t, c = 'tx', sz = 17, a = 'middle', it) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700"${it ? ' font-style="italic"' : ''} font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
// kad rumus: tajuk kecil + baris rumus besar
function ruCard(lines, title, hl) {
  // baris rumus dilukis dengan pecahan bertingkat / punca kuasa (ruFx → pokok → SVG), 25 Nov
  let s = '', y = title ? 54 : 22;
  const rows = lines.map(t => { const tree = ruTree(ruFx(t)), w1 = ruMW(tree, 20), sz = +Math.max(15, Math.min(32, 20 * 280 / Math.max(w1, 1))).toFixed(1); return { tree, sz, w: ruMW(tree, sz), h: ruMH(tree, sz) }; });
  rows.forEach((r, i) => { y += r.h[0]; s += ruMD(160 - r.w / 2, y, r.tree, i === 0 ? 'tx' : hl || 'pu', r.sz); y += r.h[1] + 18; });
  const H = Math.round(Math.max(y + 6, 70 + lines.length * 52 - 20));
  s = `<rect x="6" y="6" width="308" height="${H - 12}" rx="20" style="fill:var(--surf);stroke:var(--${hl || 'pu'})" stroke-width="2.5"/>` + (title ? ruT(160, 34, title, 'mu', 15) : '') + s;
  return `<svg viewBox="0 0 320 ${H}" role="img" aria-label="Kad rumus" font-family="Inter, sans-serif">${s}</svg>`;
}
// pokok matematik daripada markup fr()/rt(): teks | {fr:[atas, bawah]} | {rt:isi, n}
function ruTree(html) {
  const el = document.createElement('div'); el.innerHTML = html;
  const walk = p => [...p.childNodes].map(c => c.nodeType === 3 ? c.textContent : c.classList.contains('fr') ? { fr: [walk(c.children[0]), walk(c.children[1])] } : c.classList.contains('rt') ? { rt: walk(c.querySelector('.rtx')), n: c.querySelector('.rti') ? c.querySelector('.rti').textContent : '' } : c.textContent);
  return walk(el);
}
const ruMW = (ns, sz) => ns.reduce((w, n) => w + (typeof n === 'string' ? mathW(n, sz) : n.fr ? Math.max(ruMW(n.fr[0], sz * .85), ruMW(n.fr[1], sz * .85)) + 8 : sz * .62 + ruMW(n.rt, sz) + 6), 0);
// [atas, bawah] dari garis tengah
const ruMH = (ns, sz) => ns.reduce(([u, d], n) => {
  if (typeof n === 'string') return [Math.max(u, sz * .55), Math.max(d, sz * .45)];
  if (n.fr) { const a = ruMH(n.fr[0], sz * .85), b = ruMH(n.fr[1], sz * .85); return [Math.max(u, a[0] + a[1] + 3), Math.max(d, b[0] + b[1] + 3)]; }
  const r = ruMH(n.rt, sz); return [Math.max(u, r[0] + 5), Math.max(d, r[1] + 2)];
}, [0, 0]);
function ruMD(x, y, ns, c, sz) {
  let s = '';
  ns.forEach(n => {
    if (typeof n === 'string') { const lead = n.length - n.trimStart().length; if (n.trim()) s += ruT(x + mathW(n.slice(0, lead), sz), y, n.trim(), c, +sz.toFixed(1), 'start'); x += mathW(n, sz); return; }
    if (n.fr) {
      const z = sz * .85, wa = ruMW(n.fr[0], z), wb = ruMW(n.fr[1], z), w = Math.max(wa, wb) + 8, ha = ruMH(n.fr[0], z), hb = ruMH(n.fr[1], z);
      s += ruMD(x + (w - wa) / 2, y - 3 - ha[1], n.fr[0], c, z) + ruMD(x + (w - wb) / 2, y + 3 + hb[0], n.fr[1], c, z);
      s += `<line x1="${+x.toFixed(1)}" y1="${+y.toFixed(1)}" x2="${+(x + w).toFixed(1)}" y2="${+y.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${+Math.max(1.5, sz / 11).toFixed(1)}"/>`;
      x += w; return;
    }
    const r = ruMH(n.rt, sz), rw = sz * .62, w = rw + ruMW(n.rt, sz) + 6, top = y - r[0] - 5, bot = y + r[1] + 2;
    if (n.n) s += ruT(x + rw * .2, top + sz * .3, n.n, c, +(sz * .5).toFixed(1));
    s += `<path d="M${+x.toFixed(1)} ${+(y + sz * .05).toFixed(1)} L${+(x + rw * .3).toFixed(1)} ${+(y - sz * .05).toFixed(1)} L${+(x + rw * .6).toFixed(1)} ${+bot.toFixed(1)} L${+(x + rw).toFixed(1)} ${+top.toFixed(1)} L${+(x + w).toFixed(1)} ${+top.toFixed(1)}" fill="none" style="stroke:var(--${c})" stroke-width="${+Math.max(1.5, sz / 12).toFixed(1)}" stroke-linejoin="round"/>`;
    s += ruMD(x + rw + 3, y, n.rt, c, sz); x += w;
  });
  return s;
}
// bentuk geometri berlabel
function ruShape(kind, a, b) {
  let s = '';
  if (kind === 'rect') {
    s += `<rect x="50" y="40" width="200" height="120" rx="3" style="fill:var(--tr);fill-opacity:.15;stroke:var(--tr)" stroke-width="3.5"/>`;
    s += ruT(150, 22, a, 'tr', 19) + ruT(268, 100, b, 'pa', 19, 'start');
    s += `<line x1="250" y1="40" x2="250" y2="160" style="stroke:var(--pa)" stroke-width="4"/>`;
  } else if (kind === 'sq') {
    s += `<rect x="90" y="30" width="140" height="140" rx="3" style="fill:var(--gr);fill-opacity:.15;stroke:var(--gr)" stroke-width="3.5"/>`;
    s += ruT(160, 188, a, 'gr', 19) + ruT(72, 100, a, 'gr', 19, 'end');
  } else if (kind === 'tri') {
    s += `<polygon points="40,170 280,170 190,40" style="fill:var(--pu);fill-opacity:.15;stroke:var(--pu)" stroke-width="3.5" stroke-linejoin="round"/>`;
    s += `<line x1="190" y1="40" x2="190" y2="170" style="stroke:var(--am)" stroke-width="2.5" stroke-dasharray="7 6"/><polyline points="190,156 204,156 204,170" style="fill:none;stroke:var(--tx)" stroke-width="2"/>`;
    s += ruT(160, 192, a, 'pu', 19) + ruT(200, 104, b, 'am', 19, 'start');
  } else if (kind === 'eq') {
    s += `<polygon points="60,170 260,170 160,30" style="fill:var(--pk);fill-opacity:.15;stroke:var(--pk)" stroke-width="3.5" stroke-linejoin="round"/>`;
    s += ruT(160, 190, a, 'pk', 19) + ruT(96, 92, a, 'pk', 19, 'end') + ruT(224, 92, a, 'pk', 19, 'start');
  }
  return `<svg viewBox="0 0 320 206" role="img" aria-label="Rajah bentuk" font-family="Inter, sans-serif">${s}</svg>`;
}
// taman dengan laluan (k311)
function ruTaman(p, l) {
  const s = `<rect x="30" y="20" width="260" height="160" rx="4" style="fill:var(--am);fill-opacity:.18;stroke:var(--am)" stroke-width="3"/>
    <rect x="58" y="48" width="204" height="104" rx="2" style="fill:var(--gr);fill-opacity:.25;stroke:var(--gr)" stroke-width="3"/>
    ${ruT(160, 100, 'taman', 'gr', 17)}${ruT(160, 166, `${p} m`, 'tx', 16)}${ruT(250, 100, `${l} m`, 'tx', 16, 'end')}${ruT(160, 34, 'laluan 1 m', 'am', 15)}`;
  return `<svg viewBox="0 0 320 200" role="img" aria-label="Taman dengan laluan" font-family="Inter, sans-serif">${s}</svg>`;
}

/* =================== templat menukar perkara rumus =================== */
// d = { s: perkara rumus asal, t: sasaran, o: huruf lain, a, b, c: pemalar }
// fwd(x, w, d) = nilai s apabila t = x, o = w · inv(y, w, d) = nilai t apabila s = y
const RUTPL = {
  L1: { f: d => `${d.s} = ${d.t} + ${d.o}`, ans: d => `${d.t} = ${d.s} − ${d.o}`,
    work: d => [`Tolak ${d.o} pada kedua-dua belah: ${d.s} − ${d.o} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.o} − ${d.s}`, `${d.t} = ${d.s} + ${d.o}`, `${d.t} = ${d.s}/${d.o}`],
    fwd: (x, w) => x + w, inv: (y, w) => y - w, two: true },
  L2: { f: d => `${d.s} = ${d.t} − ${d.a}`, ans: d => `${d.t} = ${d.s} + ${d.a}`,
    work: d => [`Tambah ${d.a} pada kedua-dua belah: ${d.s} + ${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s} − ${d.a}`, `${d.t} = ${d.a} − ${d.s}`, `${d.t} = ${d.a}${d.s}`],
    fwd: (x, w, d) => x - d.a, inv: (y, w, d) => y + d.a },
  L3: { f: d => `${d.s} = ${d.a}${d.t}`, ans: d => `${d.t} = ${d.s}/${d.a}`,
    work: d => [`Bahagi ${d.a} pada kedua-dua belah: ${d.s}/${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.a}${d.s}`, `${d.t} = ${d.s} − ${d.a}`, `${d.t} = ${d.a}/${d.s}`],
    fwd: (x, w, d) => d.a * x, inv: (y, w, d) => y / d.a },
  L4: { f: d => `${d.s} = ${d.t}/${d.a}`, ans: d => `${d.t} = ${d.a}${d.s}`,
    work: d => [`Darab ${d.a} pada kedua-dua belah: ${d.a}${d.s} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}/${d.a}`, `${d.t} = ${d.s} + ${d.a}`, `${d.t} = ${d.a}/${d.s}`],
    fwd: (x, w, d) => x / d.a, inv: (y, w, d) => d.a * y },
  L5: { f: d => `${d.s} = ${d.a}${d.t} + ${d.b}`, ans: d => `${d.t} = (${d.s} − ${d.b})/${d.a}`,
    work: d => [`Tolak ${d.b} pada kedua-dua belah: ${d.s} − ${d.b} = ${d.a}${d.t}`, `Bahagi ${d.a} pada kedua-dua belah: (${d.s} − ${d.b})/${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}/${d.a} − ${d.b}`, `${d.t} = (${d.s} + ${d.b})/${d.a}`, `${d.t} = ${d.a}(${d.s} − ${d.b})`, `${d.t} = (${d.s} − ${d.a})/${d.b}`],
    fwd: (x, w, d) => d.a * x + d.b, inv: (y, w, d) => (y - d.b) / d.a },
  L6: { f: d => `${d.s} = ${d.a}${d.t} − ${d.b}`, ans: d => `${d.t} = (${d.s} + ${d.b})/${d.a}`,
    work: d => [`Tambah ${d.b} pada kedua-dua belah: ${d.s} + ${d.b} = ${d.a}${d.t}`, `Bahagi ${d.a} pada kedua-dua belah: (${d.s} + ${d.b})/${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = (${d.s} − ${d.b})/${d.a}`, `${d.t} = ${d.s}/${d.a} + ${d.b}`, `${d.t} = ${d.a}(${d.s} + ${d.b})`],
    fwd: (x, w, d) => d.a * x - d.b, inv: (y, w, d) => (y + d.b) / d.a },
  L7: { f: d => `${d.s} = ${d.b} − ${d.a}${d.t}`, ans: d => `${d.t} = (${d.b} − ${d.s})/${d.a}`,
    work: d => [`Tambah ${d.a}${d.t} pada kedua-dua belah: ${d.s} + ${d.a}${d.t} = ${d.b}`, `Tolak ${d.s} pada kedua-dua belah: ${d.a}${d.t} = ${d.b} − ${d.s}`, `Bahagi ${d.a}: ${d.t} = (${d.b} − ${d.s})/${d.a}`],
    wrong: d => [`${d.t} = (${d.s} − ${d.b})/${d.a}`, `${d.t} = (${d.b} + ${d.s})/${d.a}`, `${d.t} = ${d.a}(${d.b} − ${d.s})`],
    fwd: (x, w, d) => d.b - d.a * x, inv: (y, w, d) => (d.b - y) / d.a },
  L8: { f: d => `${d.s} = ${d.a}(${d.t} + ${d.b})`, ans: d => `${d.t} = ${d.s}/${d.a} − ${d.b}`,
    work: d => [`Bahagi ${d.a} pada kedua-dua belah: ${d.s}/${d.a} = ${d.t} + ${d.b}`, `Tolak ${d.b} pada kedua-dua belah: ${d.s}/${d.a} − ${d.b} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}/${d.a} + ${d.b}`, `${d.t} = ${d.a}${d.s} − ${d.b}`, `${d.t} = (${d.s} − ${d.b})/${d.a}`],
    fwd: (x, w, d) => d.a * (x + d.b), inv: (y, w, d) => y / d.a - d.b },
  L9: { f: d => `${d.s} = ${d.t}/${d.a} + ${d.b}`, ans: d => `${d.t} = ${d.a}(${d.s} − ${d.b})`,
    work: d => [`Tolak ${d.b} pada kedua-dua belah: ${d.s} − ${d.b} = ${d.t}/${d.a}`, `Darab ${d.a} pada kedua-dua belah: ${d.a}(${d.s} − ${d.b}) = ${d.t}`],
    wrong: d => [`${d.t} = ${d.a}${d.s} − ${d.b}`, `${d.t} = (${d.s} − ${d.b})/${d.a}`, `${d.t} = ${d.a}(${d.s} + ${d.b})`],
    fwd: (x, w, d) => x / d.a + d.b, inv: (y, w, d) => d.a * (y - d.b) },
  L10: { f: d => `${d.s} = ${d.o} + ${d.qt || d.q + d.t}`, ans: d => `${d.t} = (${d.s} − ${d.o})/${d.q}`,
    work: d => [`Tolak ${d.o} pada kedua-dua belah: ${d.s} − ${d.o} = ${d.qt}`, `Bahagi ${d.q} pada kedua-dua belah: (${d.s} − ${d.o})/${d.q} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}/${d.q} − ${d.o}`, `${d.t} = (${d.s} + ${d.o})/${d.q}`, `${d.t} = ${d.q}(${d.s} − ${d.o})`, `${d.t} = ${d.s} − ${d.o} − ${d.q}`],
    fwd: (x, w, d) => w + d.qv * x, inv: (y, w, d) => (y - w) / d.qv, two: true },
  L11: { f: d => `${d.s} = ${d.a} − ${d.t}`, ans: d => `${d.t} = ${d.a} − ${d.s}`,
    work: d => [`Tambah ${d.t} pada kedua-dua belah: ${d.s} + ${d.t} = ${d.a}`, `Tolak ${d.s} pada kedua-dua belah: ${d.t} = ${d.a} − ${d.s}`],
    wrong: d => [`${d.t} = ${d.s} − ${d.a}`, `${d.t} = ${d.a} + ${d.s}`, `${d.t} = ${d.s}/${d.a}`],
    fwd: (x, w, d) => d.a - x, inv: (y, w, d) => d.a - y },
  L12: { f: d => `${d.s} = ${d.a}${d.t} + ${d.b}${d.o}`, ans: d => `${d.t} = (${d.s} − ${d.b}${d.o})/${d.a}`,
    work: d => [`Tolak ${d.b}${d.o} pada kedua-dua belah: ${d.s} − ${d.b}${d.o} = ${d.a}${d.t}`, `Bahagi ${d.a} pada kedua-dua belah: (${d.s} − ${d.b}${d.o})/${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}/${d.a} − ${d.b}${d.o}`, `${d.t} = (${d.s} + ${d.b}${d.o})/${d.a}`, `${d.t} = (${d.s} − ${d.a}${d.o})/${d.b}`],
    fwd: (x, w, d) => d.a * x + d.b * w, inv: (y, w, d) => (y - d.b * w) / d.a, two: true },
  /* ---------- kuasa dua, punca kuasa dua, pecahan ---------- */
  K1: { f: d => `${d.s} = ${d.a}${d.t}²`, ans: d => `${d.t} = √(${d.s}/${d.a})`, pos: true,
    work: d => [`Bahagi ${d.a} pada kedua-dua belah: ${d.s}/${d.a} = ${d.t}²`, `Punca kuasa dua kedua-dua belah: √(${d.s}/${d.a}) = ${d.t}`],
    wrong: d => [`${d.t} = √(${d.a}${d.s})`, `${d.t} = ${d.s}/${d.a * 2}`, `${d.t} = (${d.s}/${d.a})²`],
    fwd: (x, w, d) => d.a * x * x, inv: (y, w, d) => Math.sqrt(y / d.a) },
  K2: { f: d => `${d.s} = ${d.t}² + ${d.a}`, ans: d => `${d.t} = √(${d.s} − ${d.a})`, pos: true,
    work: d => [`Tolak ${d.a} pada kedua-dua belah: ${d.s} − ${d.a} = ${d.t}²`, `Punca kuasa dua kedua-dua belah: √(${d.s} − ${d.a}) = ${d.t}`],
    wrong: d => [`${d.t} = √${d.s} − ${d.a}`, `${d.t} = (${d.s} − ${d.a})²`, `${d.t} = √(${d.s} + ${d.a})`],
    fwd: (x, w, d) => x * x + d.a, inv: (y, w, d) => Math.sqrt(y - d.a) },
  K3: { f: d => `${d.s} = √${d.t}`, ans: d => `${d.t} = ${d.s}²`, pos: true,
    work: d => [`Kuasa duakan kedua-dua belah: ${d.s}² = ${d.t}`],
    wrong: d => [`${d.t} = √${d.s}`, `${d.t} = 2${d.s}`, `${d.t} = ${d.s}/2`],
    fwd: x => Math.sqrt(x), inv: y => y * y },
  K4: { f: d => `${d.s} = √(${d.t}/${d.a})`, ans: d => `${d.t} = ${d.a}${d.s}²`, pos: true,
    work: d => [`Kuasa duakan kedua-dua belah: ${d.s}² = ${d.t}/${d.a}`, `Darab ${d.a} pada kedua-dua belah: ${d.a}${d.s}² = ${d.t}`],
    wrong: d => [`${d.t} = (${d.a}${d.s})²`, `${d.t} = ${d.s}²/${d.a}`, `${d.t} = √(${d.a}${d.s})`],
    fwd: (x, w, d) => Math.sqrt(x / d.a), inv: (y, w, d) => d.a * y * y },
  K5: { f: d => `${d.s} = ${d.a}√${d.t}`, ans: d => `${d.t} = (${d.s}/${d.a})²`, pos: true,
    work: d => [`Bahagi ${d.a} pada kedua-dua belah: ${d.s}/${d.a} = √${d.t}`, `Kuasa duakan kedua-dua belah: (${d.s}/${d.a})² = ${d.t}, iaitu ${d.t} = ${d.s}²/${d.a * d.a}`],
    wrong: d => [`${d.t} = ${d.s}²/${d.a}`, `${d.t} = √(${d.s}/${d.a})`, `${d.t} = (${d.a}${d.s})²`],
    fwd: (x, w, d) => d.a * Math.sqrt(x), inv: (y, w, d) => (y / d.a) ** 2 },
  K6: { f: d => `${d.s} = √(${d.t} + ${d.a})`, ans: d => `${d.t} = ${d.s}² − ${d.a}`, pos: true,
    work: d => [`Kuasa duakan kedua-dua belah: ${d.s}² = ${d.t} + ${d.a}`, `Tolak ${d.a} pada kedua-dua belah: ${d.s}² − ${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.s}² + ${d.a}`, `${d.t} = (${d.s} − ${d.a})²`, `${d.t} = √${d.s} − ${d.a}`],
    fwd: (x, w, d) => Math.sqrt(x + d.a), inv: (y, w, d) => y * y - d.a },
  K7: { f: d => `${d.s} = ${d.a}/${d.t}`, ans: d => `${d.t} = ${d.a}/${d.s}`,
    work: d => [`Darab ${d.t} pada kedua-dua belah: ${d.s}${d.t} = ${d.a}`, `Bahagi ${d.s} pada kedua-dua belah: ${d.t} = ${d.a}/${d.s}`],
    wrong: d => [`${d.t} = ${d.a}${d.s}`, `${d.t} = ${d.s}/${d.a}`, `${d.t} = ${d.a} − ${d.s}`],
    fwd: (x, w, d) => d.a / x, inv: (y, w, d) => d.a / y, nz: true },
  K8: { f: d => `${d.s} = ${d.a}/(${d.b}${d.t})`, ans: d => `${d.t} = ${d.a}/(${d.b}${d.s})`,
    work: d => [`Darab ${d.b}${d.t} pada kedua-dua belah: ${d.b}${d.s}${d.t} = ${d.a}`, `Bahagi ${d.b}${d.s} pada kedua-dua belah: ${d.t} = ${d.a}/(${d.b}${d.s})`],
    wrong: d => [`${d.t} = ${d.b}${d.s}/${d.a}`, `${d.t} = ${d.a}${d.s}/${d.b}`, `${d.t} = ${d.a * d.b}${d.s}`],
    fwd: (x, w, d) => d.a / (d.b * x), inv: (y, w, d) => d.a / (d.b * y), nz: true },
  K9: { f: d => `${d.s} = (${d.t} + ${d.a})/${d.b}`, ans: d => `${d.t} = ${d.b}${d.s} − ${d.a}`,
    work: d => [`Darab ${d.b} pada kedua-dua belah: ${d.b}${d.s} = ${d.t} + ${d.a}`, `Tolak ${d.a} pada kedua-dua belah: ${d.b}${d.s} − ${d.a} = ${d.t}`],
    wrong: d => [`${d.t} = ${d.b}${d.s} + ${d.a}`, `${d.t} = (${d.s} − ${d.a})/${d.b}`, `${d.t} = ${d.b}(${d.s} + ${d.a})`],
    fwd: (x, w, d) => (x + d.a) / d.b, inv: (y, w, d) => d.b * y - d.a },
  K10: { f: d => `${d.s} = (${d.a}${d.t} − ${d.b})/${d.c}`, ans: d => `${d.t} = (${d.c}${d.s} + ${d.b})/${d.a}`,
    work: d => [`Darab ${d.c} pada kedua-dua belah: ${d.c}${d.s} = ${d.a}${d.t} − ${d.b}`, `Tambah ${d.b} pada kedua-dua belah: ${d.c}${d.s} + ${d.b} = ${d.a}${d.t}`, `Bahagi ${d.a}: ${d.t} = (${d.c}${d.s} + ${d.b})/${d.a}`],
    wrong: d => [`${d.t} = (${d.c}${d.s} − ${d.b})/${d.a}`, `${d.t} = (${d.a}${d.s} + ${d.b})/${d.c}`, `${d.t} = ${d.c}${d.s}/${d.a} − ${d.b}`],
    fwd: (x, w, d) => (d.a * x - d.b) / d.c, inv: (y, w, d) => (d.c * y + d.b) / d.a },
  K11: { f: d => `${d.s} = ½${d.o}${d.t}²`, ans: d => `${d.t} = √(2${d.s}/${d.o})`, pos: true,
    work: d => [`Darab 2 pada kedua-dua belah: 2${d.s} = ${d.o}${d.t}²`, `Bahagi ${d.o} pada kedua-dua belah: 2${d.s}/${d.o} = ${d.t}²`, `Punca kuasa dua: ${d.t} = √(2${d.s}/${d.o})`],
    wrong: d => [`${d.t} = √(${d.s}/(2${d.o}))`, `${d.t} = 2${d.s}/${d.o}`, `${d.t} = √(2${d.s}${d.o})`],
    fwd: (x, w) => 0.5 * w * x * x, inv: (y, w) => Math.sqrt(2 * y / w), two: true },
  K12: { f: d => `${d.s} = π${d.t}²`, ans: d => `${d.t} = √(${d.s}/π)`, pos: true,
    work: d => [`Bahagi π pada kedua-dua belah: ${d.s}/π = ${d.t}²`, `Punca kuasa dua kedua-dua belah: ${d.t} = √(${d.s}/π)`],
    wrong: d => [`${d.t} = √${d.s}/π`, `${d.t} = ${d.s}/(2π)`, `${d.t} = √(π${d.s})`],
    fwd: x => Math.PI * x * x, inv: y => Math.sqrt(y / Math.PI) },
  /* ---------- sukar ---------- */
  H1: { f: d => `(${d.a}${d.t})² = ${d.b}${d.s} − ${d.c}`, ans: d => `${d.t} = √(${d.b}${d.s} − ${d.c})/${d.a}`, pos: true,
    work: d => [`(${d.a}${d.t})² = ${d.a * d.a}${d.t}², maka ${d.a * d.a}${d.t}² = ${d.b}${d.s} − ${d.c}`, `Bahagi ${d.a * d.a}: ${d.t}² = (${d.b}${d.s} − ${d.c})/${d.a * d.a}`, `Punca kuasa dua: ${d.t} = √(${d.b}${d.s} − ${d.c})/${d.a}`],
    wrong: d => [`${d.t} = √(${d.b}${d.s} − ${d.c})/${d.a * d.a}`, `${d.t} = (${d.b}${d.s} − ${d.c})/${d.a}`, `${d.t} = √(${d.b}${d.s} + ${d.c})/${d.a}`],
    fwd: (x, w, d) => ((d.a * x) ** 2 + d.c) / d.b, inv: (y, w, d) => Math.sqrt(d.b * y - d.c) / d.a },
  H2: { f: d => `√(${d.a * d.a}${d.t}²) = ${d.b}${d.s} − ${d.c}`, ans: d => `${d.t} = (${d.b}${d.s} − ${d.c})/${d.a}`, pos: true,
    work: d => [`√(${d.a * d.a}${d.t}²) = ${d.a}${d.t}, maka ${d.a}${d.t} = ${d.b}${d.s} − ${d.c}`, `Bahagi ${d.a}: ${d.t} = (${d.b}${d.s} − ${d.c})/${d.a}`],
    wrong: d => [`${d.t} = (${d.b}${d.s} − ${d.c})/${d.a * d.a}`, `${d.t} = √(${d.b}${d.s} − ${d.c})/${d.a}`, `${d.t} = (${d.b}${d.s} + ${d.c})/${d.a}`],
    fwd: (x, w, d) => (d.a * x + d.c) / d.b, inv: (y, w, d) => (d.b * y - d.c) / d.a },
  H3: { f: d => `${d.s} = ${d.a}${d.t}/${d.b} + ${d.c}`, ans: d => `${d.t} = ${d.b}(${d.s} − ${d.c})/${d.a}`,
    work: d => [`Tolak ${d.c} pada kedua-dua belah: ${d.s} − ${d.c} = ${d.a}${d.t}/${d.b}`, `Darab ${d.b}: ${d.b}(${d.s} − ${d.c}) = ${d.a}${d.t}`, `Bahagi ${d.a}: ${d.t} = ${d.b}(${d.s} − ${d.c})/${d.a}`],
    wrong: d => [`${d.t} = ${d.a}(${d.s} − ${d.c})/${d.b}`, `${d.t} = ${d.b}${d.s}/${d.a} − ${d.c}`, `${d.t} = (${d.b}${d.s} − ${d.c})/${d.a}`],
    fwd: (x, w, d) => d.a * x / d.b + d.c, inv: (y, w, d) => d.b * (y - d.c) / d.a },
  H4: { f: d => `${d.s} = ${d.a}(${d.t} − ${d.b})²`, ans: d => `${d.t} = √(${d.s}/${d.a}) + ${d.b}`, pos: true, note: d => `Diberi ${d.t} > ${d.b}.`,
    work: d => [`Bahagi ${d.a}: ${d.s}/${d.a} = (${d.t} − ${d.b})²`, `Punca kuasa dua: √(${d.s}/${d.a}) = ${d.t} − ${d.b}`, `Tambah ${d.b}: ${d.t} = √(${d.s}/${d.a}) + ${d.b}`],
    wrong: d => [`${d.t} = √(${d.s}/${d.a}) − ${d.b}`, `${d.t} = √(${d.s}/${d.a} − ${d.b})`, `${d.t} = (${d.s}/${d.a})² + ${d.b}`],
    fwd: (x, w, d) => d.a * (x - d.b) ** 2, inv: (y, w, d) => Math.sqrt(y / d.a) + d.b, gt: true }
};
const RUTL = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12'];
const RUTK = ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12'];
const RUTH = ['H1', 'H2', 'H3', 'H4'];
// set huruf [perkara rumus, sasaran, huruf lain, huruf pekali (L10)]
const RULETS = [['y', 'x', 'k', 'm'], ['v', 'u', 'a', 't'], ['p', 'q', 'r', 'n'], ['A', 'h', 'b', 'k'], ['m', 'n', 'p', 'q'], ['w', 't', 'u', 'k'], ['s', 'r', 'h', 'c'], ['P', 'k', 'm', 'n'], ['V', 'h', 'j', 'b'], ['E', 'm', 'g', 'h'], ['T', 'j', 'c', 'd'], ['z', 'y', 'w', 'p']];
const RUL10 = [['v', 'u', 'a', 't'], ['y', 'c', 'm', 'x'], ['P', 'k', 'n', 'h'], ['s', 'p', 'r', 'q'], ['A', 'b', 'w', 'h'], ['T', 'd', 'k', 'j']];
// bina data templat (huruf + pemalar rawak)
function ruTplData(r, key) {
  const L = r.p(RULETS), d = { key, s: L[0], t: L[1], o: L[2], q: L[3] };
  do { d.a = r.i(2, 9); d.b = r.i(2, 12); d.c = r.i(2, 7); } while (d.a === d.b || d.a === d.c || d.b === d.c);
  if (key === 'L10') { const M = r.p(RUL10); d.s = M[0]; d.o = M[1]; d.q = M[2]; d.t = M[3]; d.qt = M[2] + M[3]; }
  if (key === 'L11') d.a = r.i(5, 20);
  if (key === 'K2' || key === 'K6') d.a = r.i(2, 15);
  if (key === 'K11') { d.s = r.p(['E', 'K', 'T']); d.o = r.p(['m', 'k', 'p']); d.t = r.p(['v', 'u', 'x']); }
  if (key === 'K12') { d.s = r.p(['A', 'L', 'S']); d.t = r.p(['j', 'r', 'x']); }
  if (key === 'H1' || key === 'H2') { d.a = r.i(2, 4); }
  if (key === 'H4') { d.a = r.i(2, 5); d.b = r.i(1, 6); }
  return d;
}
// cari nilai bersih: t = x, o = w → s = y (integer) dan inv(y) = x
function ruTplVals(r, key, d) {
  const T = RUTPL[key];
  for (let k = 0; k < 400; k++) {
    let x = T.pos ? r.i(1, 12) : r.n(-9, 12), w = T.two ? (T.pos || key === 'L10' ? r.i(1, 9) : r.n(-6, 9)) : 0;
    if (key === 'L10') d.qv = r.i(2, 6);
    if (T.gt) x = d.b + r.i(1, 6);
    if (key === 'K3' || key === 'K5') x = r.i(1, 12) ** 2;
    if (key === 'K4') x = d.a * r.i(1, 8) ** 2;
    if (key === 'K6') x = r.i(2, 12) ** 2 - d.a;
    if (key === 'K12') continue;              // π: tiada nilai bulat
    if (T.nz && x === 0) continue;
    if (T.pos && x <= 0) continue;
    const y = T.fwd(x, w, d);
    if (!isFinite(y) || !ruInt(y) || (T.pos && y <= 0) || Math.abs(y) > 400) continue;
    const back = T.inv(y, w, d);
    if (Math.abs(back - x) > 1e-9) continue;
    return { x, w, y: Math.round(y) };
  }
  return null;
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 3.1.1 Menulis Rumus ---------- */
  ruBeli: [
    ({ i1, i2, a, b, x, y, S }) => ({ q: `Harga se${i1[1]} ${i1[0]} ialah RM${a} dan harga se${i2[1]} ${i2[0]} ialah RM${b}. Tulis rumus bagi jumlah harga, RM${S}, bagi ${x} ${i1[1]} ${i1[0]} dan ${y} ${i2[1]} ${i2[0]}.` }),
    ({ i1, i2, a, b, x, y, S }) => { const N = vnama(); return { q: `${N} membeli ${x} ${i1[1]} ${i1[0]} berharga RM${a} se${i1[1]} dan ${y} ${i2[1]} ${i2[0]} berharga RM${b} se${i2[1]}. Ungkapkan jumlah bayaran, RM${S}, dalam sebutan ${x} dan ${y}.` }; },
    ({ i1, i2, a, b, x, y, S }) => ({ q: `Sebuah kedai menjual ${i1[0]} pada harga RM${a} se${i1[1]} dan ${i2[0]} pada harga RM${b} se${i2[1]}. Bentukkan rumus bagi jumlah jualan, RM${S}, apabila ${x} ${i1[1]} ${i1[0]} dan ${y} ${i2[1]} ${i2[0]} dijual.` }),
    ({ i1, i2, a, b, x, y, S, ans }) => { const N = vnama(); return Object.assign({ q: `Harga se${i1[1]} ${i1[0]} ialah RM${a} dan se${i2[1]} ${i2[0]} ialah RM${b}. ${N} menulis rumus jumlah harga, RM${S}, bagi ${x} ${i1[1]} ${i1[0]} dan ${y} ${i2[1]} ${i2[0]} sebagai ${S} = ${ruTerm(a, y)} + ${ruTerm(b, x)}. Adakah ${N} betul?` }, salah(N, ans, `${N} tersilap padankan harga. Harga ${i1[0]} (RM${a}) mesti didarab dengan bilangan ${i1[0]}, ${x}.`)); }
  ],
  ruBaki: [
    ({ M, a, n, it, S }) => { const N = vnama(); return { q: `${N} mempunyai RM${M}. Dia membeli ${n} ${it[1]} ${it[0]} yang berharga RM${a} se${it[1]}. Tulis rumus bagi baki wangnya, RM${S}.` }; },
    ({ M, a, n, it, S }) => ({ q: `Seorang murid membawa RM${M} ke kedai buku. Dia membeli ${n} ${it[1]} ${it[0]} pada harga RM${a} se${it[1]}. Bentukkan rumus bagi baki wang murid itu, RM${S}.` }),
    ({ M, a, n, it, S }) => ({ q: `Ungkapkan baki wang, RM${S}, selepas membeli ${n} ${it[1]} ${it[0]} berharga RM${a} se${it[1]} daripada RM${M}.` }),
    ({ M, a, n, it, S, ans }) => { const N = vnama(); return Object.assign({ q: `${N} ada RM${M} dan membeli ${n} ${it[1]} ${it[0]} berharga RM${a} se${it[1]}. Dia menulis rumus baki wangnya sebagai ${S} = ${a}${n} − ${M}. Adakah ${N} betul?` }, salah(N, ans, `Baki = wang asal − jumlah harga, maka ${M} ditulis dahulu.`)); }
  ],
  ruSimpan: [
    ({ M, a, n, S }) => { const N = vnama(); return { q: `${N} mempunyai simpanan RM${M}. Dia menyimpan RM${a} lagi setiap minggu. Tulis rumus bagi jumlah simpanannya, RM${S}, selepas ${n} minggu.` }; },
    ({ M, a, n, S }) => ({ q: `Sebuah tabung mengandungi RM${M}. Setiap hari RM${a} dimasukkan ke dalam tabung itu. Bentukkan rumus bagi jumlah wang dalam tabung, RM${S}, selepas ${n} hari.` }),
    ({ M, a, n, S }) => ({ q: `Tinggi sepohon anak pokok ialah ${M} cm. Pokok itu tumbuh ${a} cm setiap bulan. Tulis rumus bagi tingginya, ${S} cm, selepas ${n} bulan.` })
  ],
  ruGeo: [
    ({ shape, what, S, unit, vars }) => ({ q: `Rajah di bawah menunjukkan sebuah ${shape}. Tulis rumus bagi ${what}, ${S} ${unit}, ${shape} itu dalam sebutan ${vars}.` }),
    ({ what, S, unit }) => ({ q: `Berdasarkan rajah di bawah, bentukkan rumus bagi ${what}, ${S} ${unit}.` }),
    ({ shape, what, S, unit, vars }) => ({ q: `Ungkapkan ${what}, ${S} ${unit}, bagi ${shape} di bawah dalam sebutan ${vars}.` }),
    ({ shape, what, S, wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} menulis rumus bagi ${what}, ${S}, ${shape} di bawah sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  ruKenal: [
    ({ F, subj }) => ({ q: `Nyatakan perkara rumus bagi rumus ${F}.`, ans: subj }),
    ({ F, vars }) => ({ q: `Senaraikan semua pemboleh ubah dalam rumus ${F}.`, ans: ruDan(vars) }),
    ({ F, kon }) => ({ q: `Nyatakan pemalar dalam rumus ${F}.`, ans: kon })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  ruUnit: [
    ({ i1, i2, sen, b, x, y, S }) => ({ q: `Harga se${i1[1]} ${i1[0]} ialah ${sen} sen dan harga se${i2[1]} ${i2[0]} ialah RM${b}. Tulis rumus bagi jumlah harga, RM${S}, bagi ${x} ${i1[1]} ${i1[0]} dan ${y} ${i2[1]} ${i2[0]}.` }),
    ({ i1, i2, sen, b, x, y, S }) => { const N = vnama(); return { q: `${N} membeli ${x} ${i1[1]} ${i1[0]} pada harga ${sen} sen se${i1[1]} dan ${y} ${i2[1]} ${i2[0]} pada harga RM${b} se${i2[1]}. Bentukkan rumus bagi jumlah bayaran, RM${S}.` }; },
    ({ i1, i2, sen, b, x, y, S, ans }) => { const N = vnama(); return Object.assign({ q: `Se${i1[1]} ${i1[0]} berharga ${sen} sen dan se${i2[1]} ${i2[0]} berharga RM${b}. ${N} menulis jumlah harga, RM${S}, bagi ${x} ${i1[1]} ${i1[0]} dan ${y} ${i2[1]} ${i2[0]} sebagai ${S} = ${sen}${x} + ${b}${y}. Adakah ${N} betul?` }, salah(N, ans, `${N} mencampurkan sen dengan RM. ${sen} sen = RM${(sen / 100).toFixed(2)}.`)); }
  ],
  ruTali: [
    ({ p, q, S }) => ({ q: `Panjang seutas tali ialah ${p} m. Sepotong tali sepanjang ${q} cm dipotong daripadanya. Tulis rumus bagi panjang tali yang tinggal, ${S} cm.` }),
    ({ p, q, S }) => ({ q: `Sebatang paip sepanjang ${p} m dipotong sepanjang ${q} cm. Bentukkan rumus bagi panjang paip yang tinggal, ${S} cm.` }),
    ({ p, q, S }) => ({ q: `Ungkapkan panjang baki, ${S} cm, bagi sehelai reben sepanjang ${p} m selepas ${q} cm reben itu digunakan.` })
  ],
  ruSitu: [
    ({ kind, h, d, n, S, a, b, j, p, q, r }) => {
      if (kind === 'diskaun') return { q: `Harga sehelai baju ialah RM${h}. Semasa jualan murah, harga setiap helai diturunkan sebanyak RM${d}. Tulis rumus bagi jumlah bayaran, RM${S}, untuk ${n} helai baju.` };
      if (kind === 'kongsi') return { q: `Sebuah van disewa dengan bayaran asas RM${a} dan RM${b} bagi setiap km. Kos sewa dikongsi sama rata oleh ${n} orang. Tulis rumus bagi kos seorang, RM${S}, bagi perjalanan sejauh ${j} km.` };
      return { q: `Markah tiga ujian seorang murid ialah ${p}, ${q} dan ${r}. Tulis rumus bagi purata markahnya, ${S}.` };
    },
    ({ kind, h, d, n, S, a, b, j, p, q, r }) => {
      if (kind === 'diskaun') return { q: `Sebuah kedai memberi potongan RM${d} bagi setiap helai baju yang berharga RM${h}. Bentukkan rumus bagi jumlah harga, RM${S}, bagi ${n} helai baju selepas potongan.` };
      if (kind === 'kongsi') return { q: `Bayaran sewa sebuah bot ialah RM${a} ditambah RM${b} bagi setiap km. Sebanyak ${n} orang berkongsi bayaran itu sama rata. Ungkapkan bayaran seorang, RM${S}, bagi perjalanan ${j} km.` };
      return { q: `Seorang pemain bola keranjang menjaringkan ${p}, ${q} dan ${r} mata dalam tiga perlawanan. Bentukkan rumus bagi purata jaringannya, ${S} mata, setiap perlawanan.` };
    },
    ({ kind, h, d, n, S, a, b, j, p, q, r, ans }) => {
      const N = vnama();
      if (kind === 'diskaun') return Object.assign({ q: `Harga sehelai baju RM${h} diturunkan sebanyak RM${d}. ${N} menulis jumlah bayaran, RM${S}, bagi ${n} helai sebagai ${S} = ${n}${h} − ${d}. Adakah ${N} betul?` }, salah(N, ans, `Potongan RM${d} diberi bagi setiap helai, jadi seluruh harga (${h} − ${d}) mesti didarab dengan ${n}.`));
      if (kind === 'kongsi') return Object.assign({ q: `Bayaran sewa van ialah RM${a} ditambah RM${b} sekilometer, dikongsi sama rata oleh ${n} orang. ${N} menulis kos seorang, RM${S}, bagi ${j} km sebagai ${S} = ${a} + ${b}${j}/${n}. Adakah ${N} betul?` }, salah(N, ans, `Seluruh jumlah bayaran (${a} + ${b}${j}) mesti dibahagi dengan ${n}, jadi perlu kurungan.`));
      return Object.assign({ q: `Markah tiga ujian ialah ${p}, ${q} dan ${r}. ${N} menulis purata markah, ${S}, sebagai ${S} = ${p} + ${q} + ${r}/3. Adakah ${N} betul?` }, salah(N, ans, 'Jumlah ketiga-tiga markah mesti dibahagi dengan 3, jadi perlu kurungan.'));
    }
  ],
  ruUmur: [
    ({ x, a, b, S, nm }) => ({ q: `Umur ${nm} ialah ${x} tahun. Abangnya ${a} tahun lebih tua dan adiknya ${b} tahun lebih muda daripada ${nm}. Tulis rumus bagi jumlah umur tiga beradik itu, ${S} tahun.` }),
    ({ x, a, b, S, nm }) => ({ q: `${nm} berumur ${x} tahun. Kakaknya ${a} tahun lebih tua daripadanya, manakala adiknya ${b} tahun lebih muda daripadanya. Bentukkan rumus bagi jumlah umur mereka bertiga, ${S} tahun.` }),
    ({ x, a, b, S, nm }) => ({ q: `Ungkapkan jumlah umur, ${S} tahun, bagi ${nm} (${x} tahun), abangnya yang ${a} tahun lebih tua dan adiknya yang ${b} tahun lebih muda.` })
  ],
  k311: [
    ({ kind, a, c, x, y, xv, yv, J }) => ({ q: `Harga tiket dewasa ialah RM${a} dan harga tiket kanak-kanak ialah separuh harga tiket dewasa. Caj tempahan RM${c} dikenakan bagi setiap tempahan. (a) Tulis rumus bagi jumlah bayaran, RMJ, bagi ${x} tiket dewasa dan ${y} tiket kanak-kanak dalam satu tempahan. (b) Hitung J apabila ${x} = ${xv} dan ${y} = ${yv}.`, ans: `(a) J = ${a}${x} + ${a / 2}${y} + ${c} (b) ${ruRM(J)}`, work: [`Harga tiket kanak-kanak = RM${a} ÷ 2 = RM${a / 2}`, `(a) J = ${a}${x} + ${a / 2}${y} + ${c}`, `(b) J = ${a}(${xv}) + ${a / 2}(${yv}) + ${c} = ${a * xv} + ${a / 2 * yv} + ${c} = ${J}`] }),
    ({ p, l, Lv }) => ({ q: `Sebuah taman berbentuk segi empat tepat berukuran p m × l m dikelilingi oleh laluan selebar 1 m seperti dalam rajah. (a) Tunjukkan bahawa luas laluan itu, L m², diberi oleh L = 2p + 2l + 4. (b) Hitung L apabila p = ${p} dan l = ${l}.`, ans: `(a) L = 2p + 2l + 4 (b) ${Lv} m²`, work: ['Ukuran luar = (p + 2) m × (l + 2) m', '(a) L = (p + 2)(l + 2) − pl = pl + 2p + 2l + 4 − pl = 2p + 2l + 4', `(b) L = 2(${p}) + 2(${l}) + 4 = ${Lv}`], fig: ruTaman('p', 'l') }),
    ({ a, b, c, g, Bv }) => ({ q: `Sebuah pelan telefon mengenakan yuran bulanan RM${a} yang termasuk ${b} GB data. Setiap GB tambahan dikenakan RM${c}. (a) Tulis rumus bagi bayaran bulanan, RMB, bagi penggunaan g GB data dengan g > ${b}. (b) Hitung bayaran bulanan jika ${g} GB data digunakan.`, ans: `(a) B = ${a} + ${c}(g − ${b}) (b) ${ruRM(Bv)}`, work: [`Data tambahan = (g − ${b}) GB`, `(a) B = ${a} + ${c}(g − ${b})`, `(b) B = ${a} + ${c}(${g} − ${b}) = ${a} + ${c * (g - b)} = ${Bv}`] })
  ],

  /* ---------- 3.1.2 Perkara Rumus ---------- */
  ruKenalPR: [
    ({ F }) => ({ q: `Nyatakan perkara rumus bagi ${F}.` }),
    ({ F }) => ({ q: `Dalam rumus ${F}, pemboleh ubah manakah ialah perkara rumus?` }),
    ({ F, ans }) => { const N = vnama(); const other = F.split(' = ')[1].replace(/[^A-Za-z]/g, '')[0] || 'x'; return Object.assign({ q: `${N} berkata perkara rumus bagi ${F} ialah ${other}. Adakah ${N} betul?` }, salah(N, ans, 'Perkara rumus ialah pemboleh ubah yang bersendirian di sebelah kiri tanda =.')); }
  ],
  ruPR: [
    ({ f, t }) => ({ q: `Jadikan ${t} perkara rumus bagi ${f}.` }),
    ({ f, t }) => ({ q: `Ungkapkan ${t} dalam sebutan pemboleh ubah yang lain bagi rumus ${f}.` }),
    ({ f, t }) => ({ q: `Diberi ${f}. Tukarkan perkara rumus kepada ${t}.` }),
    ({ f, t, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menjadikan ${t} perkara rumus bagi ${f} dan mendapat ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Lakukan operasi songsang pada kedua-dua belah mengikut tertib terbalik.`)); },
    ({ f, t }) => ({ q: `Diberi rumus ${f}. Susun semula rumus itu supaya ${t} menjadi perkara rumus.` })
  ],
  k312: [
    ({ f, t, s, y, w, o, two, note }) => ({ q: `Diberi ${f}. ${note}(a) Jadikan ${t} perkara rumus. (b) Seterusnya, hitung nilai ${t} apabila ${s} = ${ruN(y)}${two ? ` dan ${o} = ${ruN(w)}` : ''}.` }),
    ({ f, t, s, y, w, o, two, note }) => ({ q: `${note}(a) Ungkapkan ${t} dalam sebutan pemboleh ubah lain bagi ${f}. (b) Cari nilai ${t} jika ${s} = ${ruN(y)}${two ? ` dan ${o} = ${ruN(w)}` : ''}.` }),
    ({ f, t, s, y, w, o, two, note }) => ({ q: `Rumus ${f} diberi. ${note}(a) Tukarkan perkara rumus kepada ${t}. (b) Gunakan rumus baharu itu untuk mencari ${t} apabila ${s} = ${ruN(y)}${two ? ` dan ${o} = ${ruN(w)}` : ''}.` })
  ],

  /* ---------- 3.1.3 Menyelesaikan Masalah ---------- */
  ruGanti: [
    ({ f, given, s }) => ({ q: `Diberi ${f}. Hitung nilai ${s} apabila ${given}.` }),
    ({ f, given, s }) => ({ q: `Cari nilai ${s} bagi rumus ${f} jika ${given}.` }),
    ({ f, given, s }) => ({ q: `Gantikan ${given} ke dalam rumus ${f}. Apakah nilai ${s}?` }),
    ({ f, given, s, wrongV, ans, why }) => { const N = vnama(); return Object.assign({ q: `Diberi ${f}. Apabila ${given}, ${N} mendapat ${s} = ${wrongV}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  ruCari: [
    ({ f, given, t }) => ({ q: `Diberi ${f}. Cari nilai ${t} apabila ${given}.` }),
    ({ f, given, t }) => ({ q: `Bagi rumus ${f}, hitung nilai ${t} jika ${given}.` }),
    ({ f, given, t }) => ({ q: `Rumus ${f} diberi. Tentukan nilai ${t} apabila ${given}.` }),
    ({ f, given, t, ans }) => { const N = vnama(); const v = +ans.split(' = ')[1].replace('−', '-'); const wv = ruN(v + (v > 2 ? -2 : 3)); return Object.assign({ q: `Diberi ${f}. ${N} berkata ${t} = ${wv} apabila ${given}. Adakah ${N} betul?` }, salah(N, ans, `Semak: gantikan ${t} = ${wv} ke dalam rumus; kedua-dua belah tidak sama.`)); }
  ],
  ruHarian: [
    ({ q }) => ({ q }),
    ({ q2 }) => ({ q: q2 }),
    ({ q3 }) => ({ q: q3 })
  ],
  k313: [
    ({ a, b, Tv, jv }) => ({ q: `Tambang sebuah teksi ialah RM${ruN(a)} bagi kilometer pertama dan RM${ruN(b)} bagi setiap kilometer berikutnya. (a) Tulis rumus bagi tambang, RMT, untuk perjalanan sejauh j km. (b) Jika tambang yang dibayar ialah RM${ruN(Tv)}, berapakah jarak perjalanan itu?`, ans: `(a) T = ${ruN(a)} + ${ruN(b)}(j − 1) (b) ${jv} km`, work: [`Jarak selepas kilometer pertama = (j − 1) km`, `(a) T = ${ruN(a)} + ${ruN(b)}(j − 1)`, `(b) ${ruN(Tv)} = ${ruN(a)} + ${ruN(b)}(j − 1) → ${ruN(Tv - a)} = ${ruN(b)}(j − 1)`, `j − 1 = ${ruN(Tv - a)} ÷ ${ruN(b)} = ${jv - 1}, maka j = ${jv}`] }),
    ({ Lv, s }) => ({ q: `Luas sebuah segi empat sama ialah L cm² dan perimeternya ialah P cm. (a) Ungkapkan P dalam sebutan L. (b) Hitung perimeter segi empat sama itu jika luasnya ${Lv} cm².`, ans: `(a) P = 4√L (b) ${4 * s} cm`, work: ['Katakan sisi = s cm. L = s², maka s = √L.', '(a) P = 4s = 4√L', `(b) P = 4√${Lv} = 4 × ${s} = ${4 * s}`] }),
    ({ V, j, t }) => ({ q: `Isi padu sebuah silinder diberi oleh V = πj²t, dengan j ialah jejari dan t ialah tinggi. (a) Jadikan t perkara rumus. (b) Hitung tinggi silinder itu jika V = ${V} cm³ dan j = ${j} cm. (Guna π = 22/7)`, ans: `(a) t = V/(πj²) (b) ${t} cm`, work: ['(a) Bahagi πj² pada kedua-dua belah: t = V/(πj²)', `(b) πj² = 22/7 × ${j}² = ${22 * j * j / 7}`, `t = ${V} ÷ ${22 * j * j / 7} = ${t}`] })
  ]
};

/* =================== pembina soalan (r = ruRG atau ruRW) =================== */
const RU = {};
/* ---------- 3.1.1 ---------- */
RU.beli = r => {
  const [i1, i2] = ruDist(r, RUITEM, 2), [x, y] = r.p(RUCNT), S = r.p(RUSUBJ);
  let a, b; do { a = r.i(1, 9); b = r.i(2, 9); } while (a === b);
  const ans = `${S} = ${ruTerm(a, x)} + ${ruTerm(b, y)}`;
  return GEN_LQ('ruBeli', { i1, i2, a, b, x, y, S, ans, work: [`Harga ${x} ${i1[1]} ${i1[0]} = ${a} × ${x} = ${ruTerm(a, x)}`, `Harga ${y} ${i2[1]} ${i2[0]} = ${b} × ${y} = ${ruTerm(b, y)}`, `Jumlah harga: ${ans}`] });
};
RU.baki = (r, k) => {
  const it = r.p(RUITEM), n = r.p(['n', 'k', 'm', 'x', 'p']);
  if ((k == null ? r.f() < .6 : k % 3 !== 2)) {
    const M = r.p([20, 30, 40, 50, 60, 80, 100]), a = r.i(2, 9), S = r.p(['B', 'W', 'R']);
    const ans = `${S} = ${M} − ${ruTerm(a, n)}`;
    return GEN_LQ('ruBaki', { M, a, n, it, S, ans, work: [`Jumlah harga = ${a} × ${n} = ${ruTerm(a, n)}`, 'Baki = wang asal − jumlah harga', ans] });
  }
  const M = r.p([5, 10, 15, 20, 25, 40, 60]), a = r.i(2, 12), S = r.p(['S', 'J', 'T']), nn = r.p(['w', 'h', 'n', 'b']);
  const ans = `${S} = ${M} + ${ruTerm(a, nn)}`;
  return GEN_LQ('ruSimpan', { M, a, n: nn, S, ans, work: [`Pertambahan dalam ${nn} tempoh = ${a} × ${nn} = ${ruTerm(a, nn)}`, 'Jumlah = nilai awal + pertambahan', ans] });
};
RU.geo = (r, k) => {
  const kinds = ['rectP', 'rectL', 'sqP', 'sqL', 'triL', 'eqP', 'rectX'];
  const kind = k == null ? r.p(kinds) : kinds[k % kinds.length];
  const [p, l] = r.p([['p', 'l'], ['a', 'b'], ['x', 'y'], ['m', 'n'], ['h', 'k']]);
  const s = r.p(['s', 'x', 'a', 'k']);
  let o;
  if (kind === 'rectP') o = { shape: 'segi empat tepat', what: 'perimeter', S: 'P', unit: 'cm', vars: `${p} dan ${l}`, ans: `P = 2${p} + 2${l}`, wrong: `P = ${p}${l}`, why: `${p}${l} ialah luas. Perimeter ialah jumlah panjang keempat-empat sisi.`, work: [`Perimeter = ${p} + ${l} + ${p} + ${l}`, `P = 2${p} + 2${l} atau P = 2(${p} + ${l})`], fig: ruShape('rect', `${p} cm`, `${l} cm`) };
  if (kind === 'rectL') o = { shape: 'segi empat tepat', what: 'luas', S: 'L', unit: 'cm²', vars: `${p} dan ${l}`, ans: `L = ${p}${l}`, wrong: `L = 2${p} + 2${l}`, why: `2${p} + 2${l} ialah perimeter. Luas = panjang × lebar.`, work: ['Luas = panjang × lebar', `L = ${p} × ${l} = ${p}${l}`], fig: ruShape('rect', `${p} cm`, `${l} cm`) };
  if (kind === 'sqP') o = { shape: 'segi empat sama', what: 'perimeter', S: 'P', unit: 'cm', vars: s, ans: `P = 4${s}`, wrong: `P = ${s}²`, why: `${s}² ialah luas. Perimeter = ${s} + ${s} + ${s} + ${s}.`, work: [`Perimeter = ${s} + ${s} + ${s} + ${s}`, `P = 4${s}`], fig: ruShape('sq', `${s} cm`) };
  if (kind === 'sqL') o = { shape: 'segi empat sama', what: 'luas', S: 'L', unit: 'cm²', vars: s, ans: `L = ${s}²`, wrong: `L = 2${s}`, why: `Luas = ${s} × ${s} = ${s}², bukan ${s} + ${s}.`, work: [`Luas = sisi × sisi = ${s} × ${s}`, `L = ${s}²`], fig: ruShape('sq', `${s} cm`) };
  if (kind === 'triL') o = { shape: 'segi tiga', what: 'luas', S: 'L', unit: 'cm²', vars: `${p} dan ${l}`, ans: `L = ½${p}${l}`, wrong: `L = ${p}${l}`, why: 'Luas segi tiga ialah separuh daripada tapak × tinggi.', work: ['Luas segi tiga = ½ × tapak × tinggi', `L = ½ × ${p} × ${l} = ½${p}${l}`], fig: ruShape('tri', `${p} cm`, `${l} cm`) };
  if (kind === 'eqP') o = { shape: 'segi tiga sama sisi', what: 'perimeter', S: 'P', unit: 'cm', vars: s, ans: `P = 3${s}`, wrong: `P = ${s}³`, why: `Perimeter = ${s} + ${s} + ${s} = 3${s}, bukan ${s} × ${s} × ${s}.`, work: [`Perimeter = ${s} + ${s} + ${s}`, `P = 3${s}`], fig: ruShape('eq', `${s} cm`) };
  if (kind === 'rectX') {
    const c = r.i(2, 9), c2 = r.i(1, 9);
    o = { shape: 'segi empat tepat', what: 'perimeter', S: 'P', unit: 'cm', vars: s, ans: `P = ${4}${s} + ${2 * (c + c2)}`, wrong: `P = 2${s} + ${c + c2}`, why: 'Setiap sisi muncul dua kali dalam perimeter segi empat tepat.', work: [`P = 2(${s} + ${c}) + 2(${s} + ${c2})`, `= 2${s} + ${2 * c} + 2${s} + ${2 * c2}`, `P = 4${s} + ${2 * (c + c2)}`], fig: ruShape('rect', `(${s} + ${c}) cm`, `(${s} + ${c2}) cm`) };
  }
  return GEN_LQ('ruGeo', o, { fig: o.fig });
};
RU.kenal = (r, k) => {
  const [F, subj, vars, kon] = k == null ? r.p(RUKENAL) : RUKENAL[k % RUKENAL.length];
  return GEN_LQ('ruKenal', { F, subj, vars, kon, ans: subj, work: ['Perkara rumus: pemboleh ubah yang bersendirian di sebelah kiri tanda =.', `Pemboleh ubah dalam ${F}: ${ruDan(vars)}.`, `Pemalar (nilai tetap): ${kon}.`] });
};
RU.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
RU.unit = (r, k) => {
  if (k == null ? r.f() < .65 : k % 3 !== 2) {
    const [i1, i2] = ruDist(r, RUITEM, 2), [x, y] = r.p(RUCNT), S = r.p(RUSUBJ), sen = r.p([20, 30, 40, 50, 60, 70, 80, 90]), b = r.i(2, 9);
    const ans = `${S} = ${ruN(sen / 100)}${x} + ${ruTerm(b, y)}`;
    return GEN_LQ('ruUnit', { i1, i2, sen, b, x, y, S, ans, work: [`Tukar sen kepada RM: ${sen} sen = RM${(sen / 100).toFixed(2)}`, `Harga ${x} ${i1[1]} ${i1[0]} = ${ruN(sen / 100)}${x}`, `${ans} (atau ${S} = (${sen}${x} + ${b * 100}${y})/100)`] });
  }
  const S = r.p(['B', 'L', 'T']), P_ = r.p(['p', 'k', 'x']), q_ = r.p(['q', 'n', 'y']);
  const ans = `${S} = 100${P_} − ${q_}`;
  return GEN_LQ('ruTali', { p: P_, q: q_, S, ans, work: [`${P_} m = 100${P_} cm (1 m = 100 cm)`, 'Baki = panjang asal − panjang dipotong', ans] });
};
RU.situ = (r, k) => {
  const kinds = ['diskaun', 'kongsi', 'purata'], kind = k == null ? r.p(kinds) : kinds[k % 3];
  const S = r.p(['J', 'K', 'M', 'T']);
  if (kind === 'diskaun') { const h = r.p(['h', 'p', 'x']), d = r.p(['d', 'k', 'y']), n = r.p(['n', 'm']); const ans = `${S} = ${n}(${h} − ${d})`; return GEN_LQ('ruSitu', { kind, h, d, n, S, ans, work: [`Harga sehelai selepas potongan = RM(${h} − ${d})`, `Jumlah bagi ${n} helai = ${n} × (${h} − ${d})`, ans] }); }
  if (kind === 'kongsi') { const a = r.p([20, 30, 40, 50, 60]), b = r.i(2, 5), j = r.p(['j', 'x', 'd']), n = r.p(['n', 'm', 'k']); const ans = `${S} = (${a} + ${ruTerm(b, j)})/${n}`; return GEN_LQ('ruSitu', { kind, a, b, j, n, S, ans, work: [`Jumlah bayaran = ${a} + ${ruTerm(b, j)}`, `Kos seorang = jumlah bayaran ÷ ${n}`, ans] }); }
  const [p, q, rr] = r.p([['p', 'q', 'r'], ['a', 'b', 'c'], ['x', 'y', 'z'], ['k', 'm', 'n']]); const ans = `${S} = (${p} + ${q} + ${rr})/3`;
  return GEN_LQ('ruSitu', { kind, p, q, r: rr, S, ans, work: ['Purata = jumlah ÷ bilangan', `Jumlah = ${p} + ${q} + ${rr}`, ans] });
};
RU.umur = r => {
  const x = r.p(['x', 'n', 'u', 'k']), S = r.p(['J', 'T', 'U']), nm = r.p(['Ali', 'Siti', 'Ravi', 'Mei Ling', 'Aisyah', 'Daniel', 'Hafiz']);
  let a, b; do { a = r.i(2, 9); b = r.i(1, 8); } while (a === b);
  const k = a - b, ans = `${S} = 3${x}${k > 0 ? ' + ' + k : ' − ' + (-k)}`;
  return GEN_LQ('ruUmur', { x, a, b, S, nm, ans, work: [`Umur abang atau kakak = ${x} + ${a}, umur adik = ${x} − ${b}`, `${S} = ${x} + (${x} + ${a}) + (${x} − ${b})`, ans] });
};
RU.k311 = (r, k) => {
  const kind = k == null ? r.i(0, 2) : k % 3;
  if (kind === 0) {
    const a = r.p([12, 16, 18, 20, 24, 30]), c = r.p([2, 3, 4, 5]), xv = r.i(1, 4), yv = r.i(1, 5), [x, y] = r.p([['x', 'y'], ['d', 'k'], ['m', 'n']]);
    return vq2('k311', 0, { a, c, x, y, xv, yv, J: a * xv + a / 2 * yv + c });
  }
  if (kind === 1) { const p = r.i(5, 20), l = r.i(3, 12); return vq2('k311', 1, { p, l, Lv: 2 * p + 2 * l + 4 }); }
  const a = r.p([30, 38, 45, 50, 58]), b = r.p([5, 10, 15, 20]), c = r.p([3, 5, 8, 10]), g = b + r.i(2, 9);
  return vq2('k311', 2, { a, b, c, g, Bv: a + c * (g - b) });
};
// QV khusus: pilih varian tertentu (soalan sukar berstruktur)
function vq2(key, k, d) { const v = QV[key][k](d); return Object.assign({ q: v.q, ans: v.ans, work: v.work }, v.fig ? { fig: v.fig } : {}); }

/* ---------- 3.1.2 ---------- */
RU.kenalPR = (r, k) => {
  const L = [['v = u + at', 'v'], ['A = πj²', 'A'], ['y = 3x − 7', 'y'], ['F = 9C/5 + 32', 'F'], ['s = ½(u + v)t', 's'], ['P = 2(p + l)', 'P'], ['m = (a + b)/2', 'm'], ['E = ½mv²', 'E'], ['K = 4 + 1.5j', 'K']];
  const [F, s] = k == null ? r.p(L) : L[k % L.length];
  return GEN_LQ('ruKenalPR', { F, ans: s, work: [`${s} ditulis bersendirian di sebelah kiri tanda = dengan pekali 1.`, `Maka ${s} ialah perkara rumus.`] });
};
RU.pr = (r, key, extra) => {
  const T = RUTPL[key], d = ruTplData(r, key);
  if (key === 'L10') { const ch = r.i(0, 2); if (ch === 1) { const t = d.t; d.t = d.q; d.q = t; } if (ch === 2) { /* sasaran = o */ return RU.prL10o(r, d); } }
  const f = T.f(d), ans = T.ans(d), wr = T.wrong(d), wrong = r.p(wr);
  const note = (T.pos ? RUPOS + ' ' : '') + (T.note ? T.note(d) + ' ' : '');
  const o = GEN_LQ('ruPR', { f, t: d.t, s: d.s, wrong, ans, work: T.work(d).concat([`Maka ${ans}`]) }, { fig: ruCard([f, `${d.t} = ?`], 'Jadikan ' + d.t + ' perkara rumus') });
  if (note) o.q = o.q.includes(' Adakah ') ? o.q.replace(' Adakah ', ` ${note.trim()} Adakah `) : o.q + ' ' + note.trim();
  return Object.assign(o, extra || {});
};
RU.prL10o = (r, d) => {
  const f = `${d.s} = ${d.o} + ${d.qt}`, ans = `${d.o} = ${d.s} − ${d.qt}`;
  return GEN_LQ('ruPR', { f, t: d.o, s: d.s, wrong: `${d.o} = ${d.s} + ${d.qt}`, ans, work: [`Tolak ${d.qt} pada kedua-dua belah: ${d.s} − ${d.qt} = ${d.o}`, `Maka ${ans}`] }, { fig: ruCard([f, `${d.o} = ?`], 'Jadikan ' + d.o + ' perkara rumus') });
};
RU.k312 = r => {
  for (let k = 0; k < 50; k++) {
    const key = r.p(RUTH.concat(['K1', 'K4', 'K10', 'L12'])), T = RUTPL[key], d = ruTplData(r, key), v = ruTplVals(r, key, d);
    if (!v) continue;
    const f = T.f(d), ans = T.ans(d), note = (T.pos ? RUPOS + ' ' : '') + (T.note ? T.note(d) + ' ' : '');
    const sub = `${d.s} = ${ruN(v.y)}${T.two ? `, ${d.o} = ${ruN(v.w)}` : ''}`;
    const o = vq('k312', { f, t: d.t, s: d.s, o: d.o, y: v.y, w: v.w, two: !!T.two, note });
    return { q: o.q, ans: `(a) ${ans} (b) ${d.t} = ${ruN(v.x)}`, work: T.work(d).map(w => '(a) ' + w).concat([`(b) Gantikan ${sub} ke dalam ${ans}: ${d.t} = ${ruN(v.x)}`]) };
  }
  return RU.pr(r, 'K10');
};

/* ---------- 3.1.3 ---------- */
// rumus gantian: w = at + bu (+ c) dengan nilai negatif
RU.gantiD = (r, k) => {
  const kinds = ['lin2', 'lin2', 'kurung', 'pecahan', 'kuasa', 'kuasa2'], kind = k == null ? r.p(kinds) : kinds[k % kinds.length];
  const L = r.p([['w', 't', 'u'], ['y', 'p', 'q'], ['P', 'm', 'n'], ['k', 'x', 'y'], ['T', 'a', 'b'], ['V', 'h', 'j']]);
  const [s, t, u] = L;
  let f, given, val, work, wrongV;
  if (kind === 'lin2') {
    let a, b; do { a = r.n(-9, 9); b = r.n(-9, 9); } while (a === b || a === -b);
    const tv = r.n(-6, 8), uv = r.n(-6, 8);
    f = `${s} = ${ruLin([[a, t], [b, u]])}`; given = `${t} = ${ruN(tv)} dan ${u} = ${ruN(uv)}`; val = a * tv + b * uv;
    const sub = `${a === 1 ? '' : a === -1 ? '−' : ruN(a)}(${ruN(tv)}) ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}(${ruN(uv)})`;
    work = [`${s} = ${sub}`, `= ${ruN(a * tv)} ${b * uv < 0 ? '−' : '+'} ${ruN(Math.abs(b * uv))}`, `= ${ruN(val)}`];
    wrongV = a * tv - b * uv === val ? val + 2 : a * tv - b * uv;
  } else if (kind === 'kurung') {
    const a = r.i(2, 6), c = r.n(-6, 6), tv = r.n(-5, 8);
    f = `${s} = ${a}(${t} ${c < 0 ? '−' : '+'} ${Math.abs(c)})`; given = `${t} = ${ruN(tv)}`; val = a * (tv + c);
    work = [`${s} = ${a}(${ruN(tv)} ${c < 0 ? '−' : '+'} ${Math.abs(c)})`, `= ${a}(${ruN(tv + c)})`, `= ${ruN(val)}`];
    wrongV = a * tv + c === val ? val + 1 : a * tv + c;
  } else if (kind === 'pecahan') {
    const a = r.i(2, 5); let tv, uv; do { tv = r.i(-6, 12); uv = r.i(-6, 12); } while ((tv + uv) % a !== 0 || tv === 0 || uv === 0);
    f = `${s} = (${t} + ${u})/${a}`; given = `${t} = ${ruN(tv)} dan ${u} = ${ruN(uv)}`; val = (tv + uv) / a;
    work = [`${s} = (${ruN(tv)} + ${ruPar(uv)})/${a}`, `= ${ruN(tv + uv)}/${a}`, `= ${ruN(val)}`];
    wrongV = Math.abs(tv + uv / a - val) < 1e-9 || !ruNice(tv + uv / a) ? val + a : tv + uv / a;
  } else if (kind === 'kuasa') {
    const a = r.i(2, 5), c = r.n(-9, 9), tv = r.p([-5, -4, -3, -2, 2, 3, 4, 5]);
    f = `${s} = ${a}${t}² ${c < 0 ? '−' : '+'} ${Math.abs(c)}`; given = `${t} = ${ruN(tv)}`; val = a * tv * tv + c;
    work = [`${s} = ${a}(${ruN(tv)})² ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, `= ${a}(${tv * tv}) ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, `= ${ruN(val)}`];
    wrongV = tv < 0 ? -a * tv * tv + c : a * 2 * tv + c;
  } else {
    const [p, q, h] = r.p([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15], [12, 5, 13]]);
    f = `${s} = √(${t}² + ${u}²)`; given = `${t} = ${p} dan ${u} = ${q}`; val = h;
    work = [`${s} = √(${p}² + ${q}²)`, `= √(${p * p} + ${q * q}) = √${h * h}`, `= ${h}`];
    wrongV = p + q;
  }
  if (wrongV === val) wrongV = val + 3;
  const why = kind === 'kuasa2' ? `√(${t}² + ${u}²) tidak sama dengan ${t} + ${u}. Kira ${t}² + ${u}² dahulu, kemudian cari punca kuasa dua.` : kind === 'kuasa' ? 'Kira kuasa dua dahulu (dengan kurungan), kemudian darab dan tambah.' : 'Letakkan setiap nilai dalam kurungan semasa menggantikan, dan berhati-hati dengan tanda negatif.';
  return { f, given, s, val, wrongV, work, why };
};
RU.ganti = (r, k) => { const d = RU.gantiD(r, k); return GEN_LQ('ruGanti', Object.assign({}, d, { wrongV: ruN(d.wrongV), ans: `${d.s} = ${ruN(d.val)}` })); };
RU.cari = (r, pool) => {
  for (let k = 0; k < 60; k++) {
    const key = r.p(pool), T = RUTPL[key], d = ruTplData(r, key), v = ruTplVals(r, key, d);
    if (!v) continue;
    const f = T.f(d), given = `${d.s} = ${ruN(v.y)}${T.two ? ` dan ${d.o} = ${ruN(v.w)}` : ''}`;
    const ans = `${d.t} = ${ruN(v.x)}`;
    const o = GEN_LQ('ruCari', { f, given, t: d.t, ans, work: T.work(d).concat(T.work(d).slice(-1)[0].endsWith(T.ans(d).split(' = ')[1]) ? [] : [T.ans(d)]).concat([`Gantikan ${given}: ${d.t} = ${ruN(v.x)}`]) });
    const nt = [T.pos ? RUPOS : '', T.note ? T.note(d) : ''].filter(Boolean).join(' ');
    if (nt) o.q = o.q.includes(' Adakah ') ? o.q.replace(' Adakah ', ` ${nt} Adakah `) : o.q + ' ' + nt;
    return o;
  }
  return RU.ganti(r);
};
RU.harian = (r, k) => {
  const kinds = ['teksi', 'suhu', 'upah', 'laju'], kind = k == null ? r.p(kinds) : kinds[k % kinds.length], back = r.f() < .5;
  let d;
  if (kind === 'teksi') {
    const a = r.p([3, 4, 5]), b = r.p([1.5, 2, 2.5]), j = r.i(4, 24) * (b === 2.5 ? 2 : 1), T = a + b * j;
    const f = `T = ${a} + ${ruN(b)}j`;
    if (!back) d = { q: `Tambang teksi, RMT, bagi perjalanan sejauh j km diberi oleh ${f}. Hitung tambang bagi perjalanan sejauh ${j} km.`, q2: `Sebuah syarikat teksi menggunakan rumus ${f} untuk mengira tambang, RMT, bagi j km. Berapakah tambang untuk ${j} km?`, q3: `Diberi tambang teksi ${f} (RMT, j km). Seorang penumpang menaiki teksi sejauh ${j} km. Berapakah tambang yang perlu dibayarnya?`, ans: ruRM(T), work: [`T = ${a} + ${ruN(b)}(${j})`, `= ${a} + ${ruN(b * j)}`, `= ${ruN(T)}`] };
    else d = { q: `Tambang teksi, RMT, bagi perjalanan sejauh j km diberi oleh ${f}. Jika tambang ialah RM${ruN(T)}, cari jarak perjalanan.`, q2: `Rumus tambang teksi ialah ${f} (RMT, j km). Seorang penumpang membayar RM${ruN(T)}. Berapakah jarak perjalanannya?`, q3: `Diberi ${f}, dengan T ialah tambang (RM) dan j ialah jarak (km). Hitung j apabila T = ${ruN(T)}.`, ans: `${j} km`, work: [`${ruN(T)} = ${a} + ${ruN(b)}j`, `${ruN(T - a)} = ${ruN(b)}j`, `j = ${ruN(T - a)} ÷ ${ruN(b)} = ${j}`] };
  } else if (kind === 'suhu') {
    const C = r.i(-4, 20) * 5, F = 9 * C / 5 + 32, f = 'F = 9C/5 + 32';
    if (!back) d = { q: `Suhu dalam darjah Fahrenheit, F, diberi oleh ${f}, dengan C ialah suhu dalam darjah Celsius. Tukarkan ${ruN(C)} °C kepada darjah Fahrenheit.`, q2: `Diberi ${f}. Suhu sebuah bilik ialah ${ruN(C)} °C. Berapakah suhu itu dalam °F?`, q3: `Gunakan rumus ${f} untuk mencari nilai F apabila C = ${ruN(C)}.`, ans: `${ruN(F)} °F`, work: [`F = 9(${ruN(C)})/5 + 32`, `= ${ruN(9 * C / 5)} + 32`, `= ${ruN(F)}`] };
    else d = { q: `Diberi ${f}, dengan F ialah suhu dalam °F dan C dalam °C. Tukarkan ${ruN(F)} °F kepada darjah Celsius.`, q2: `Suhu sebuah ketuhar ialah ${ruN(F)} °F. Dengan menggunakan ${f}, cari suhu itu dalam °C.`, q3: `Hitung nilai C bagi rumus ${f} apabila F = ${ruN(F)}.`, ans: `${ruN(C)} °C`, work: [`${ruN(F)} = 9C/5 + 32`, `${ruN(F - 32)} = 9C/5 → ${ruN((F - 32) * 5)} = 9C`, `C = ${ruN((F - 32) * 5)} ÷ 9 = ${ruN(C)}`] };
  } else if (kind === 'upah') {
    const a = r.p([8, 10, 12, 15]), b = r.p([20, 30, 50]), h = r.i(4, 40), G = a * h + b, f = `G = ${a}h + ${b}`;
    if (!back) d = { q: `Upah mingguan seorang pekerja sambilan, RMG, bagi h jam kerja diberi oleh ${f}. Hitung upahnya jika dia bekerja ${h} jam.`, q2: `Diberi ${f}, dengan G ialah upah (RM) dan h ialah bilangan jam. Berapakah upah bagi ${h} jam kerja?`, q3: `Seorang pekerja dibayar mengikut rumus ${f} (RMG, h jam). Berapakah upahnya bagi ${h} jam?`, ans: ruRM(G), work: [`G = ${a}(${h}) + ${b}`, `= ${a * h} + ${b}`, `= ${G}`] };
    else d = { q: `Upah, RMG, bagi h jam kerja diberi oleh ${f}. Jika seorang pekerja menerima RM${G}, berapa jamkah dia bekerja?`, q2: `Diberi ${f} (RMG, h jam). Hitung h apabila G = ${G}.`, q3: `Seorang pekerja menerima upah RM${G} minggu ini. Upahnya dikira dengan ${f}. Berapa jamkah dia bekerja?`, ans: `${h} jam`, work: [`${G} = ${a}h + ${b}`, `${G - b} = ${a}h`, `h = ${G - b} ÷ ${a} = ${h}`] };
  } else {
    const v = r.p([40, 50, 60, 80, 90, 100]), t = r.p([0.5, 1.5, 2, 2.5, 3, 4]), dd = v * t, f = 'd = vt';
    if (!back) d = { q: `Jarak, d km, yang dilalui oleh sebuah kereta diberi oleh ${f}, dengan v ialah laju (km/j) dan t ialah masa (jam). Hitung jarak jika v = ${v} dan t = ${ruN(t)}.`, q2: `Sebuah bas bergerak dengan laju ${v} km/j selama ${ruN(t)} jam. Dengan rumus ${f}, cari jarak yang dilalui.`, q3: `Gunakan ${f} untuk mencari d apabila v = ${v} km/j dan t = ${ruN(t)} jam.`, ans: `${ruN(dd)} km`, work: [`d = ${v} × ${ruN(t)}`, `= ${ruN(dd)}`] };
    else d = { q: `Diberi ${f}, dengan d ialah jarak (km), v ialah laju (km/j) dan t ialah masa (jam). Cari masa yang diambil untuk bergerak ${ruN(dd)} km pada laju ${v} km/j.`, q2: `Sebuah kereta bergerak sejauh ${ruN(dd)} km dengan laju ${v} km/j. Dengan menjadikan t perkara rumus bagi ${f}, cari masa perjalanan.`, q3: `Bagi rumus ${f}, hitung t apabila d = ${ruN(dd)} dan v = ${v}.`, ans: `${ruN(t)} jam`, work: [`t = d/v`, `= ${ruN(dd)} ÷ ${v}`, `= ${ruN(t)}`] };
  }
  return GEN_LQ('ruHarian', d);
};
RU.k313 = (r, k) => {
  const kind = k == null ? r.i(0, 2) : k % 3;
  if (kind === 0) { const a = r.p([3, 4, 5]), b = r.p([1.5, 2, 2.5]), jv = r.i(4, 15) * (b === 2.5 ? 2 : 1) + 1; return vq2('k313', 0, { a, b, jv, Tv: a + b * (jv - 1) }); }
  if (kind === 1) { const s = r.i(3, 15); return vq2('k313', 1, { s, Lv: s * s }); }
  const j = r.p([7, 14]), t = r.i(2, 10); return vq2('k313', 2, { j, t, V: 22 * j * j * t / 7 });
};

/* =================== GEN: Latihan Kelas =================== */
/* ---------- pecahan bertingkat & punca kuasa (25 Nov) ----------
   Penjana di atas menulis teks biasa: √(…), √n, (…)/d, a/b, ½. ruFx menukarnya kepada fr()/rt()
   pada output akhir sahaja (logik dalaman yang membanding teks kekal teks biasa). Rajah SVG tidak disentuh. */
const ruFx = s => {
  if (typeof s !== 'string' || s.includes('<svg')) return s;
  const close = (t, i) => { let d = 0; for (let j = i; j < t.length; j++) { if (t[j] === '(') d++; else if (t[j] === ')' && --d === 0) return j; } return -1; };
  const open = (t, i) => { let d = 0; for (let j = i; j >= 0; j--) { if (t[j] === ')') d++; else if (t[j] === '(' && --d === 0) return j; } return -1; };
  s = s.replace(/½/g, () => fr(1, 2));
  // pecahan dahulu: kiri = (…) atau token, kanan = (…) atau token
  const TOK = /[\w.₀-₉²³π]/;
  for (let k = 0, i = 0; k < 80; k++) {
    i = s.indexOf('/', i); if (i < 0) break;
    if (s[i - 1] === '<' || s[i + 1] === '>' || s[i - 1] === ' ' || s[i + 1] === ' ') { i++; continue; }
    let a0, num, b1, den;
    if (s[i - 1] === ')') { a0 = open(s, i - 1); if (a0 < 0) { i++; continue; } num = s.slice(a0 + 1, i - 1); if (s[a0 - 1] === '√') num = s.slice(--a0, i); else if (TOK.test(s[a0 - 1] || '')) { while (a0 > 0 && TOK.test(s[a0 - 1])) a0--; num = s.slice(a0, i); } } // 8(z − 2)/7: pekali ikut pengangka
    else { a0 = i; while (a0 > 0 && TOK.test(s[a0 - 1])) a0--; if (s[a0 - 1] === '√') a0--; num = s.slice(a0, i); }
    if (s[i + 1] === '(') { b1 = close(s, i + 1); if (b1 < 0) { i++; continue; } den = s.slice(i + 2, b1); b1++; }
    else { b1 = i + 1; while (b1 < s.length && TOK.test(s[b1])) b1++; den = s.slice(i + 1, b1); }
    if (!num || !den || /[<>]/.test(num + den) || /^[a-zA-Z]{3,}$/.test(num) && /^[a-zA-Z]{3,}$/.test(den) || /^(km|cm|mm|RM)$/.test(num) || num === 'm' && den === 's') { i++; continue; } // perkataan (dan/atau) & unit (km/j) kekal
    const f = fr(num, den); s = s.slice(0, a0) + f + s.slice(b1); i = a0 + f.length;
  }
  // kemudian punca kuasa (termasuk di dalam pecahan): √(…) → rt(…), √n → rt(n)
  for (let k = 0, i; k < 60 && (i = s.search(/√(?!<)/)) >= 0; k++) {
    if (s[i + 1] === '(') { const j = close(s, i + 1); if (j < 0) break; s = s.slice(0, i) + rt(s.slice(i + 2, j)) + s.slice(j + 1); }
    else { const m = /^[\d.]*[a-zA-Zπ]*/.exec(s.slice(i + 1)); if (!m[0]) break; s = s.slice(0, i) + rt(m[0]) + s.slice(i + 1 + m[0].length); }
  }
  return s;
};
const ruFixQ = q => {
  if (typeof q === 'string') return ruFx(q);
  if (Array.isArray(q)) return q.map(ruFixQ);
  if (q && typeof q === 'object') Object.keys(q).forEach(k => { if (k === 'fig' || k === 'figAns') return; q[k] = ruFixQ(q[k]); });
  return q;
};
Object.keys(RU).forEach(k => { const f = RU[k]; RU[k] = (...a) => ruFixQ(f(...a)); });

const GEN = {
  '3.1.1': {
    m: [() => RU.beli(ruRG), () => RU.baki(ruRG), () => RU.geo(ruRG), () => RU.kenal(ruRG), () => RU.bs(ruRG, RUBS1)],
    s: [() => RU.unit(ruRG), () => RU.situ(ruRG), () => RU.umur(ruRG)],
    k: [() => RU.k311(ruRG)]
  },
  '3.1.2': {
    m: [() => RU.kenalPR(ruRG), () => RU.pr(ruRG, ruRG.p(RUTL)), () => RU.pr(ruRG, ruRG.p(RUTL)), () => RU.pr(ruRG, ruRG.p(RUTL))],
    s: [() => RU.pr(ruRG, ruRG.p(RUTK)), () => RU.pr(ruRG, ruRG.p(RUTK))],
    k: [() => RU.pr(ruRG, ruRG.p(RUTH)), () => RU.k312(ruRG)]
  },
  '3.1.3': {
    m: [() => RU.ganti(ruRG), () => RU.ganti(ruRG), () => RU.cari(ruRG, ['L3', 'L5', 'L6', 'L1'])],
    s: [() => RU.cari(ruRG, RUTL.filter(k => k !== 'L10')), () => RU.cari(ruRG, ['K1', 'K2', 'K3', 'K4', 'K6', 'K11']), () => RU.harian(ruRG)],
    k: [() => RU.k313(ruRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 3.1.1
WG.beli = () => RU.beli(ruRW);
WG.baki = i => RU.baki(ruRW, i);
WG.geo = i => RU.geo(ruRW, i);
WG.kenal = i => RU.kenal(ruRW, i * 5 + 1);
WG.bs1 = i => RU.bs(ruRW, RUBS1, i * 3 + 1);
WG.unit = i => RU.unit(ruRW, i);
WG.situ = i => RU.situ(ruRW, i);
WG.umur = () => RU.umur(ruRW);
WG.k311 = i => RU.k311(ruRW, i);
// 3.1.2
WG.kenalPR = i => RU.kenalPR(ruRW, i * 4 + 2);
WG.prL = i => RU.pr(ruRW, RUTL[i % RUTL.length]);
WG.prK = i => RU.pr(ruRW, ['K1', 'K2', 'K3', 'K4', 'K12', 'K7', 'K9', 'K11', 'K10', 'K5', 'K6', 'K8'][i % 12]);
WG.prH = i => RU.pr(ruRW, RUTH[i % 4]);
WG.k312 = () => RU.k312(ruRW);
// 3.1.3
WG.ganti = i => RU.ganti(ruRW, i);
WG.cariM = i => RU.cari(ruRW, [['L3', 'L5'], ['L6', 'L1'], ['L2', 'L4', 'L9']][i % 3]);
WG.cariS = i => RU.cari(ruRW, [['L7', 'L8', 'L11', 'L12'], ['K1', 'K2', 'K4'], ['K3', 'K6', 'K11']][i % 3]);
WG.harian = i => RU.harian(ruRW, i);
WG.k313 = i => RU.k313(ruRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '3.1.1': [['m', 'beli', 5], ['m', 'baki', 5], ['m', 'geo', 5], ['m', 'kenal', 2], ['m', 'bs1', 1], ['s', 'unit', 3], ['s', 'situ', 3], ['s', 'umur', 3], ['k', 'k311', 3]],
  '3.1.2': [['m', 'kenalPR', 2], ['m', 'prL', 16], ['s', 'prK', 7], ['s', 'prH', 2], ['k', 'k312', 3]],
  '3.1.3': [['m', 'ganti', 12], ['m', 'cariM', 6], ['s', 'cariS', 3], ['s', 'harian', 6], ['k', 'k313', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function ruOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3);
  for (const c of [ans.replace(' + ', ' − '), ans.replace(' − ', ' + '), ans.replace('/', ' × '), ans + ' + 1', ans + ' − 1']) { if (w.length < 3 && c !== ans && !w.includes(c)) w.push(c); }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
function ruOptsN(ans, cands, f) {
  f = f || ruN;
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!isFinite(c)) continue; const s = f(Math.round(c * 100) / 100); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const s = f(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2)); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const ruMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const CQGEN = {
  tulis: [
    () => { const [i1, i2] = ruDist(ruRG, RUITEM, 2); let a, b; do { a = ri(2, 9); b = ri(2, 9); } while (a === b);
      const A = `T = ${a}x + ${b}y`; return ruMcq(`${vcap(i1[0])} RM${a} se${i1[1]}, ${i2[0]} RM${b} se${i2[1]}. Jumlah harga RMT bagi x ${i1[0]} dan y ${i2[0]}?`, ruCard([`x ${i1[0]} + y ${i2[0]}`, 'T = ?'], 'Jumlah harga, RMT', 'tr'), ruOptsT(A, [`T = ${a}y + ${b}x`, `T = ${a + b}xy`, `T = ${a}x − ${b}y`, `T = (${a} + ${b})(x + y)`])); },
    () => { const kinds = [['rect', 'Perimeter, P', 'P = 2p + 2l', ['P = pl', 'P = p + l', 'P = 4pl', 'P = 2pl']], ['rect', 'Luas, L', 'L = pl', ['L = 2p + 2l', 'L = p + l', 'L = p²l', 'L = ½pl']], ['sq', 'Luas, L', 'L = s²', ['L = 2s', 'L = 4s', 'L = s + s']], ['sq', 'Perimeter, P', 'P = 4s', ['P = s²', 'P = s⁴', 'P = 2s']], ['tri', 'Luas, L', 'L = ½pl', ['L = pl', 'L = 2pl', 'L = p + l']]];
      const [sh, w, A, wr] = pick(kinds); return ruMcq(`Pilih rumus yang betul bagi <b>${w}</b> bentuk ini.`, sh === 'sq' ? ruShape('sq', 's cm') : ruShape(sh, 'p cm', 'l cm'), ruOptsT(A, wr)); },
    () => { const M = pick([20, 30, 50, 100]), a = ri(2, 9); const A = `B = ${M} − ${a}n`; return ruMcq(`Ada RM${M}. Beli n buku berharga RM${a} sebuah. Rumus baki wang, RMB?`, ruCard([`RM${M} − n × RM${a}`, 'B = ?'], 'Baki wang', 'tr'), ruOptsT(A, [`B = ${a}n − ${M}`, `B = ${M}n − ${a}`, `B = ${M} + ${a}n`, `B = (${M} − ${a})n`])); },
    () => { const sen = pick([20, 30, 40, 50, 60, 80]), b = ri(2, 6); const A = `T = ${ruN(sen / 100)}x + ${b}y`; return ruMcq(`Pensel ${sen} sen sebatang, buku RM${b} sebuah. Jumlah harga <b>RMT</b> bagi x pensel dan y buku?`, ruCard([`${sen} sen = RM${ruN(sen / 100)}`, 'T = ?'], 'Tukar unit dahulu', 'tr'), ruOptsT(A, [`T = ${sen}x + ${b}y`, `T = ${sen}x + ${b * 100}y`, `T = ${ruN(sen / 10)}x + ${b}y`, `T = ${ruN(sen / 100)}y + ${b}x`])); },
    () => { let a, b; do { a = ri(2, 9); b = ri(1, 8); } while (a === b); const k = a - b, A = `J = 3x ${k > 0 ? '+ ' + k : '− ' + (-k)}`; return ruMcq(`Umur Ali x tahun. Abangnya ${a} tahun lebih tua, adiknya ${b} tahun lebih muda. Jumlah umur mereka, J?`, ruCard(['x + (x + ' + a + ') + (x − ' + b + ')', 'J = ?'], 'Jumlah umur', 'tr'), ruOptsT(A, [`J = 3x + ${a + b}`, `J = 3x − ${a + b}`, `J = x + ${a - b}`, `J = 3x ${k > 0 ? '− ' + k : '+ ' + (-k)}`])); },
    () => { const S = pick(['M', 'K']); const A = `${S} = (p + q + r)/3`; return ruMcq('Purata tiga nombor p, q dan r?', ruCard(['p, q, r', `${S} = ?`], 'Purata', 'tr'), ruOptsT(A, [`${S} = p + q + r/3`, `${S} = 3(p + q + r)`, `${S} = (p + q + r)/2`, `${S} = pqr/3`])); }
  ],
  perkara: [
    () => ruCqPR(pick(['L1', 'L2', 'L3', 'L4', 'L11'])),
    () => ruCqPR(pick(['L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L12', 'K3', 'K7'])),
    () => ruCqPR(pick(['K1', 'K2', 'K4', 'K5', 'K6', 'K9', 'K10', 'K11', 'K12', 'H2', 'H3']))
  ],
  ganti: [
    () => ruCqGanti(pick([0, 2])),
    () => ruCqGanti(pick([0, 3, 4])),
    () => ruCqGanti(pick([4, 5, 0]))
  ],
  cari: [
    () => ruCqCari(['L1', 'L2', 'L3', 'L5']),
    () => ruCqCari(['L6', 'L7', 'L8', 'L9', 'L11', 'K3']),
    () => { if (Math.random() < .4) { const q = RU.harian(ruRG); return ruMcqAns(q.q, q.ans, ruCard(['Rumus harian', '?'], 'Masalah harian', 'gr')); } return ruCqCari(['K1', 'K2', 'K4', 'K6', 'K11', 'H2']); }
  ]
};
// mcq perkara rumus daripada templat (pilihan salah = kesilapan biasa)
function ruCqPR(key) {
  const T = RUTPL[key], d = ruTplData(ruRG, key), f = T.f(d), A = T.ans(d);
  return ruMcq(`Jadikan <b>${d.t}</b> perkara rumus bagi ${f}.${T.pos ? ' (Semua nilai positif)' : ''}`, ruCard([f, `${d.t} = ?`], 'Perkara rumus', 'pu'), ruOptsT(A, T.wrong(d)));
}
// mcq gantian: pilihan salah = kesilapan tanda / kurungan
function ruCqGanti(k) {
  const d = RU.gantiD(ruRG, k);
  return ruMcq(`Diberi ${d.f}. Cari nilai <b>${d.s}</b> apabila ${d.given}.`, ruCard([d.f, d.given], 'Gantian nilai', 'gr'), ruOptsN(d.val, [d.wrongV, -d.val, d.val + 2, d.val - 2, d.val * 2], x => `${d.s} = ${ruN(x)}`));
}
function ruMcqAns(q, ans, fig) {
  const m = ans.match(/^(RM)?(−?[\d.]+)(.*)$/);
  if (!m) return ruMcq(q, fig, ruOptsT(ans, [ans + '0']));
  const v = +m[2].replace('−', '-'), f = x => (m[1] || '') + ruN(x) + m[3];
  return ruMcq(q, fig, ruOptsN(v, [v + 1, v - 1, v * 2, v / 2, v + 10].filter(x => x > 0), f));
}
function ruCqCari(pool) {
  for (let k = 0; k < 60; k++) {
    const key = pick(pool), T = RUTPL[key], d = ruTplData(ruRG, key), v = ruTplVals(ruRG, key, d);
    if (!v) continue;
    const f = T.f(d), given = `${d.s} = ${ruN(v.y)}${T.two ? `, ${d.o} = ${ruN(v.w)}` : ''}`;
    return ruMcq(`Diberi ${f}. Cari nilai <b>${d.t}</b> apabila ${given}.${T.pos ? ' (Semua nilai positif)' : ''}`, ruCard([f, given], 'Cari ' + d.t, 'gr'), ruOptsN(v.x, [-v.x, v.x + 1, v.x - 1, v.y, v.x * 2], x => `${d.t} = ${ruN(x)}`));
  }
  return ruCqGanti(0);
}
Object.keys(CQGEN).forEach(t => { CQGEN[t] = CQGEN[t].map(f => (...a) => ruFixQ(f(...a))); });
const CQT = { tulis: 'Menulis rumus', perkara: 'Perkara rumus', ganti: 'Gantian nilai', cari: 'Cari pemboleh ubah' };
function ruCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.tulis;
  if (ty === 'tulis') { const set = L === 0 ? fns.slice(0, 3) : L === 1 ? fns.slice(1, 5) : fns.slice(2); return pick(set)(); }
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['tulis', 'tulis', 'perkara', 'ganti', 'ganti', 'cari'] : Object.keys(CQT);
  return ruCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return ruCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
