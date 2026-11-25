'use strict';
/* =================== KOORDINAT · SOALAN BAB 7 KOORDINAT (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "ko" / "KO" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
const koN = v => { v = Math.round(v * 1000) / 1000; if (Object.is(v, -0)) v = 0; return fmt(v); };   // nombor kemas
const koPr = v => (v < 0 ? `(${koN(v)})` : koN(v));                                                 // kurungan bagi negatif
const koP = (x, y) => `(${koN(x)}, ${koN(y)})`;
const koSq = n => { const s = Math.round(Math.sqrt(n)); return s * s === n ? String(s) : `√${n}`; }; // √n atau nombor bulat
const ko2 = v => (Math.round(v * 100) / 100).toFixed(2);                                              // 2 tempat perpuluhan
const ko3 = v => (Math.floor(v * 1000) / 1000).toFixed(3);
// rawak: koRG untuk Latihan Kelas / games, koRW (berbenih) untuk Lembaran Kerja
const koRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const koRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const koSg = r => (r.f() < .5 ? -1 : 1);
const koShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* =================== data bersama =================== */
const KOTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]];
const KOTRI6 = [[3, 4, 5], [6, 8, 10]];                       // muat dalam grid −6 hingga 6
const KOHUR2 = [['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S'], ['C', 'D'], ['E', 'F'], ['K', 'L'], ['G', 'H']];
const KOHURT = KOHUR2.filter(h => h[0] !== 'M');                // tanpa M (M = titik tengah)
const KOTEMPAT = [['Sekolah', 'S'], ['Masjid', 'M'], ['Pasar', 'P'], ['Klinik', 'K'], ['Taman', 'T'], ['Hospital', 'H'], ['Balai bomba', 'B'], ['Perpustakaan', 'L'], ['Stesen bas', 'E'], ['Dewan', 'D']];
const KONAMA2 = [['Ali', 'Mei'], ['Siti', 'Ravi'], ['Hana', 'Daniel'], ['Aisyah', 'Kumar'], ['Farid', 'Ling']];
const KOBS1 = [
  ['Jarak antara dua titik sentiasa bernilai positif.', true, 'Jarak ialah panjang, jadi nilainya sentiasa positif.'],
  ['Jarak antara A(1, 2) dan B(1, 7) ialah 5 unit.', true, 'Koordinat-x sama, maka AB = 7 − 2 = 5 unit.'],
  ['Rumus jarak dua titik diterbitkan daripada Teorem Pythagoras.', true, 'Jarak ialah hipotenus segi tiga bersudut tegak dengan sisi (x₂ − x₁) dan (y₂ − y₁).'],
  ['Jarak antara titik (0, 0) dan (6, 8) ialah 10 unit.', true, '√(6² + 8²) = √100 = 10 unit.'],
  ['Jarak antara P(−3, 4) dan Q(5, 4) ialah 2 unit.', false, 'PQ = 5 − (−3) = 8 unit.'],
  ['Jarak AB berbeza daripada jarak BA.', false, 'Jarak AB = jarak BA.'],
  ['Jarak antara (0, 0) dan (3, 4) ialah 7 unit.', false, 'Jarak = √(3² + 4²) = √25 = 5 unit, bukan 3 + 4.'],
  ['(−5)² = −25', false, '(−5)² = (−5) × (−5) = 25.']
];
const KOBS2 = [
  ['Titik tengah membahagikan suatu garis lurus kepada dua bahagian yang sama panjang.', true, 'Jika M titik tengah AB, maka AM = MB.'],
  ['Titik tengah bagi (2, 6) dan (8, 6) ialah (5, 6).', true, '(2 + 8) ÷ 2 = 5 dan koordinat-y kekal 6.'],
  ['Koordinat-x titik tengah ialah purata koordinat-x kedua-dua titik hujung.', true, 'x = (x₁ + x₂) ÷ 2.'],
  ['Titik tengah bagi (1, 3) dan (1, 9) terletak pada garis x = 1.', true, 'Titik tengah = (1, 6), dan koordinat-x ialah 1.'],
  ['Titik tengah bagi (−4, 1) dan (6, 5) ialah (5, 2).', false, 'Titik tengah = ((−4 + 6) ÷ 2, (1 + 5) ÷ 2) = (1, 3).'],
  ['Titik tengah bagi (0, 0) dan (6, 10) ialah (6, 10).', false, 'Titik tengah = (6 ÷ 2, 10 ÷ 2) = (3, 5).'],
  ['Rumus titik tengah menggunakan beza koordinat.', false, 'Rumus titik tengah menggunakan hasil tambah koordinat dibahagi 2.'],
  ['Titik tengah bagi garis AB sentiasa terletak di luar garis AB.', false, 'Titik tengah terletak pada garis AB, di tengah-tengahnya.']
];
const KOBS3 = [
  ['Pepenjuru sebuah segi empat selari membahagi dua sama antara satu sama lain.', true, 'Titik tengah kedua-dua pepenjuru adalah sama.'],
  ['Pusat sebuah bulatan ialah titik tengah bagi diameternya.', true, 'Diameter melalui pusat, dan pusat membahagi diameter kepada dua jejari yang sama panjang.'],
  ['Untuk membuktikan segi tiga sama kaki, tunjukkan dua sisinya sama panjang.', true, 'Segi tiga sama kaki mempunyai dua sisi yang sama panjang.'],
  ['Perimeter sebuah segi tiga ialah hasil tambah panjang ketiga-tiga sisinya.', true, 'Perimeter = jumlah panjang semua sisi.'],
  ['Segi empat tepat dengan bucu (0, 0), (4, 0), (4, 3) dan (0, 3) mempunyai perimeter 12 unit.', false, 'Perimeter = 2(4 + 3) = 14 unit.'],
  ['Segi tiga dengan bucu (0, 0), (6, 0) dan (3, 4) ialah segi tiga sama sisi.', false, 'Sisi-sisinya ialah 6, 5 dan 5 unit, maka ia segi tiga sama kaki.'],
  ['Luas segi empat tepat dengan bucu (1, 1), (5, 1), (5, 3) dan (1, 3) ialah 12 unit².', false, 'Luas = 4 × 2 = 8 unit².'],
  ['Jarak lurus antara dua tempat pada peta tidak lebih panjang daripada jarak mengikut jalan berliku.', true, 'Garis lurus ialah laluan terpendek antara dua titik.']
];

/* =================== rajah =================== */
function koBox(xs, ys) {
  let x0 = Math.min(0, ...xs) - 1, x1 = Math.max(0, ...xs) + 1, y0 = Math.min(0, ...ys) - 1, y1 = Math.max(0, ...ys) + 1;
  while (x1 - x0 < 8) { x0--; if (x1 - x0 < 8) x1++; }
  while (y1 - y0 < 6) { y0--; if (y1 - y0 < 6) y1++; }
  return { x0: Math.floor(x0), x1: Math.ceil(x1), y0: Math.floor(y0), y1: Math.ceil(y1) };
}
// o = { pts:[[x,y,label,col]], segs:[[a,b,col,dash,w]], polys:[[pts,col]], texts:[[x,y,s,col,size]], label }
function koFig(o) {
  const xs = [], ys = [];
  (o.pts || []).forEach(p => { xs.push(p[0]); ys.push(p[1]); });
  (o.polys || []).forEach(([ps]) => ps.forEach(p => { xs.push(p[0]); ys.push(p[1]); }));
  const b = koBox(xs.length ? xs : [0], ys.length ? ys : [0]), items = [];
  (o.polys || []).forEach(([pts, c]) => items.push({ t: 'poly', pts, c: c || 'pa' }));
  (o.segs || []).forEach(([a, q, c, dash, w]) => items.push({ t: 'line', a, b: q, c: c || 'am', w: w || 4, dash }));
  (o.texts || []).forEach(([x, y, s, c, size]) => items.push({ t: 'text', x, y, s, c: c || 'tx', size: size || 16 }));
  (o.pts || []).forEach(([x, y, l, c]) => {
    const right = x > (b.x0 + b.x1) / 2, top = y >= b.y1 - .6;
    items.push({ t: 'pt', x, y, c: c || 'tx', l, dx: right ? -12 : 12, dy: top ? 28 : -12, anchor: right ? 'end' : 'start' });
  });
  return plot(Object.assign({}, b, { items, label: o.label || 'Satah Cartes' }));
}
// kaki mengufuk & mencancang (untuk figAns)
const koLegs = (x1, y1, x2, y2) => ({
  segs: [[[x1, y1], [x2, y1], 'pk', true, 3], [[x2, y1], [x2, y2], 'tr', true, 3]],
  texts: [[(x1 + x2) / 2, y1 + (y2 > y1 ? -.35 : .75), koN(Math.abs(x2 - x1)), 'pk', 17], [x2 + (x2 > x1 ? .55 : -.55), (y1 + y2) / 2, koN(Math.abs(y2 - y1)), 'tr', 17]]
});
function koTwo(A, B, x1, y1, x2, y2, o = {}) {
  const lab = (L, x, y) => (o.coords === false ? L : `${L}${koP(x, y)}`);
  const f = { pts: [[x1, y1, lab(A, x1, y1), 'am'], [x2, y2, lab(B, x2, y2), 'pk']], segs: [[[x1, y1], [x2, y2], 'am', false, 3.5]], texts: [], label: o.label || `Garis lurus ${A}${B}` };
  if (o.legs) { const g = koLegs(x1, y1, x2, y2); f.segs = f.segs.concat(g.segs); f.texts = f.texts.concat(g.texts); }
  if (o.mid) f.pts.push([(x1 + x2) / 2, (y1 + y2) / 2, o.mid === true ? 'M' : o.mid, 'gr']);
  return koFig(f);
}
// rajah games (gSvg teras, R = 6)
const KOR = 6;
const koIn = (...v) => v.every(t => Math.abs(t) <= KOR - .5);
const koGFig = (pts, segs, label, polys) => gSvg(KOR, (polys || []).map(([p, c]) => gPoly(p, c || 'pa')).join('') + (segs || []).map(([a, b, c, d]) => gLine(a, b, c || 'am', .13, d)).join('') + (pts || []).map(([x, y, c, l]) => gPt(x, y, c, l)).join(''), label || 'Satah Cartes');
const koGTxt = (x, y, t, c) => `<text x="${+x.toFixed(3)}" y="${+(-y).toFixed(3)}" font-size=".55" font-weight="700" text-anchor="middle" dominant-baseline="central" style="fill:var(--${c})">${t}</text>`;
const koGLegs = (x1, y1, x2, y2) => gLine([x1, y1], [x2, y1], 'pk', .09, true) + gLine([x2, y1], [x2, y2], 'tr', .09, true) + koGTxt((x1 + x2) / 2, y1 + (y2 > y1 ? -.45 : .45), koN(Math.abs(x2 - x1)), 'pk') + koGTxt(x2 + (x2 > x1 ? .55 : -.55), (y1 + y2) / 2, koN(Math.abs(y2 - y1)), 'tr');

/* =================== jalan kerja bersama =================== */
const koWJ = (L, x1, y1, x2, y2, unit = 'unit') => {
  const dx = x2 - x1, dy = y2 - y1, s = dx * dx + dy * dy, r = koSq(s);
  const w = [`${L} = √((x₂ − x₁)² + (y₂ − y₁)²)`, `= √((${koN(x2)} − ${koPr(x1)})² + (${koN(y2)} − ${koPr(y1)})²)`, `= √(${koPr(dx)}² + ${koPr(dy)}²)`, `= √(${dx * dx} + ${dy * dy}) = √${s}`];
  w.push(r[0] === '√' ? `= ${ko3(Math.sqrt(s))}… ≈ ${ko2(Math.sqrt(s))} ${unit}` : `= ${r} ${unit}`);
  return w;
};
const koWM = (x1, y1, x2, y2) => [
  'Titik tengah = ((x₁ + x₂)/2, (y₁ + y₂)/2)',
  `= ((${koN(x1)} + ${koPr(x2)})/2, (${koN(y1)} + ${koPr(y2)})/2)`,
  `= (${koN(x1 + x2)}/2, ${koN(y1 + y2)}/2)`,
  `= ${koP((x1 + x2) / 2, (y1 + y2) / 2)}`
];
const koWH = (x1, y1, mx, my, L = 'B') => [
  `Katakan ${L}(x, y). Titik tengah = ((${koN(x1)} + x)/2, (${koN(y1)} + y)/2) = ${koP(mx, my)}`,
  `${koN(x1)} + x = 2 × ${koPr(mx)} = ${koN(2 * mx)}, maka x = ${koN(2 * mx - x1)}`,
  `${koN(y1)} + y = 2 × ${koPr(my)} = ${koN(2 * my)}, maka y = ${koN(2 * my - y1)}`,
  `${L}${koP(2 * mx - x1, 2 * my - y1)}`
];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 7.1 Jarak ---------- */
  jarakLurus: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Hitung jarak antara titik ${A}${P(x1, y1)} dan titik ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2, dir }) => ({ q: `Titik ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} terletak pada satu garis ${dir}. Cari panjang ${A}${B}.` }),
    ({ A, B, x1, y1, x2, y2, d, work }) => ({ q: `Seekor semut merayap lurus dari titik ${A}${P(x1, y1)} ke titik ${B}${P(x2, y2)} pada satah Cartes. Setiap unit mewakili 1 cm. Berapakah jarak yang dilalui semut itu?`, ans: `${d} cm`, work: work.concat([`Jarak yang dilalui = ${d} × 1 cm = ${d} cm`]) }),
    ({ A, B }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${A}${B} pada satah Cartes. Cari jarak ${A}${B}.` }),
    ({ A, B, x1, y1, x2, y2, claim, ans, ax }) => { const N = vnama(); return Object.assign({ q: `${N} berkata jarak antara ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} ialah ${claim} unit. Adakah ${N} betul?` }, salah(N, ans, `${N} mengabaikan tanda negatif. Jarak = beza koordinat-${ax} = nilai besar − nilai kecil.`)); }
  ],
  jarakRumus: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Hitung jarak antara titik ${A}${P(x1, y1)} dan titik ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari panjang garis lurus ${A}${B}, dengan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2, d, work }) => ({ q: `Pada sebuah peta bergrid, rumah Lim terletak di ${A}${P(x1, y1)} dan taman permainan di ${B}${P(x2, y2)}. Setiap unit mewakili 1 km. Berapakah jarak lurus antara rumah Lim dan taman itu?`, ans: `${d} km`, work: work.concat([`Jarak sebenar = ${d} × 1 km = ${d} km`]) }),
    ({ A, B, x1, y1, x2, y2, adx, ady, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira jarak antara ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} sebagai ${adx} + ${ady} = ${adx + ady} unit. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah jarak mengufuk dan jarak mencancang secara terus. Gunakan rumus jarak (Teorem Pythagoras).`)); },
    ({ x1, y1, x2, y2 }) => ({ q: `Lengkapkan: √((${fmt(x2)} − ${par(x1)})² + (${fmt(y2)} − ${par(y1)})²) = ___` })
  ],
  jarakRajah: [
    ({ A, B }) => ({ q: `Rajah di bawah menunjukkan titik ${A} dan titik ${B} pada satah Cartes. Hitung jarak ${A}${B}.` }),
    ({ A, B, x1, y1, x2, y2, d }) => ({ q: `Berdasarkan rajah di bawah, nyatakan koordinat ${A} dan ${B}, seterusnya cari jarak ${A}${B}.`, ans: `${A}${P(x1, y1)}, ${B}${P(x2, y2)}; ${A}${B} = ${d} unit` }),
    ({ A, B, d, work }) => ({ q: `Sebuah dron terbang lurus dari titik ${A} ke titik ${B} seperti dalam rajah di bawah. Setiap unit mewakili 1 m. Berapakah jarak penerbangan dron itu?`, ans: `${d} m`, work: work.concat([`Jarak penerbangan = ${d} × 1 m = ${d} m`]) }),
    ({ A, B, adx, ady, d }) => ({ q: `Kira petak dalam rajah di bawah. Nyatakan jarak mengufuk dan jarak mencancang dari ${A} ke ${B}, kemudian hitung jarak ${A}${B}.`, ans: `Mengufuk ${adx} unit, mencancang ${ady} unit; ${A}${B} = ${d} unit` })
  ],
  jarakDp: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Hitung jarak antara ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}, betul kepada dua tempat perpuluhan.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari panjang garis lurus ${A}${B} dengan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}. Beri jawapan betul kepada dua tempat perpuluhan.` }),
    ({ A, B, x1, y1, x2, y2, v, work }) => ({ q: `Sebuah robot bergerak lurus dari ${A}${P(x1, y1)} ke ${B}${P(x2, y2)} di atas lantai bergrid. Setiap unit mewakili 1 m. Berapakah jarak pergerakan robot itu, betul kepada dua tempat perpuluhan?`, ans: `${v} m`, work: work.concat([`Jarak pergerakan ≈ ${v} m`]) }),
    ({ A, B, x1, y1, x2, y2, s, v }) => ({ q: `Nyatakan jarak antara ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} dalam bentuk √n, kemudian berikan nilainya betul kepada dua tempat perpuluhan.`, ans: `√${s} ≈ ${v} unit` })
  ],
  cariKoordJ: [
    ({ desc, D, cond, v }) => ({ q: `Diberi ${desc}, dengan AB = ${D} unit dan ${cond}. Cari nilai ${v}.` }),
    ({ desc, D, cond, v }) => ({ q: `Jarak antara titik ${desc} ialah ${D} unit. Jika ${cond}, hitung nilai ${v}.` }),
    ({ desc, D, cond, v }) => ({ q: `Titik ${desc} terletak ${D} unit antara satu sama lain, dengan ${cond}. Tentukan nilai ${v}.` })
  ],
  dekat: [
    ({ X, Y, C, px, qx, cx }) => ({ q: `Antara titik ${X}${px} dan ${Y}${qx}, titik manakah lebih dekat dengan titik ${C}${cx}?` }),
    ({ X, Y, C, n1, n2, px, qx, cx, nw, dP, dQ }) => ({ q: `${n1} berada di ${X}${px} dan ${n2} di ${Y}${qx} pada sebuah peta bergrid. Sebuah perpustakaan terletak di ${C}${cx}. Siapakah yang lebih dekat dengan perpustakaan itu?`, ans: `${nw} (${n1}: ${dP} unit, ${n2}: ${dQ} unit)` }),
    ({ X, Y, C, px, qx, cx, dP, dQ, far }) => ({ q: `Diberi ${X}${px}, ${Y}${qx} dan ${C}${cx}. Hitung ${X}${C} dan ${Y}${C}, kemudian nyatakan titik yang lebih jauh dari ${C}.`, ans: `${X}${C} = ${dP} unit, ${Y}${C} = ${dQ} unit; ${far} lebih jauh` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  k71: [
    ({ t }) => ({ q: `Jarak antara A(${fmt(t.x1)}, k) dan B${P(t.x2, t.y2)} ialah ${t.c} unit. Cari nilai-nilai yang mungkin bagi k.`, ans: `k = ${fmt(Math.min(t.k1, t.k2))} atau k = ${fmt(Math.max(t.k1, t.k2))}`, work: [`√((${fmt(t.x2)} − ${par(t.x1)})² + (${fmt(t.y2)} − k)²) = ${t.c}`, `${t.a * t.a} + (${fmt(t.y2)} − k)² = ${t.c * t.c}`, `(${fmt(t.y2)} − k)² = ${t.c * t.c - t.a * t.a}`, `${fmt(t.y2)} − k = ${t.b} atau ${fmt(t.y2)} − k = −${t.b}`, `k = ${fmt(t.k1)} atau k = ${fmt(t.k2)}`] }),
    ({ g }) => ({ q: `Diberi P${P(g.P[0], g.P[1])}, Q${P(g.Q[0], g.Q[1])} dan R${P(g.R[0], g.R[1])}. Dengan menggunakan akas Teorem Pythagoras, tunjukkan bahawa segi tiga PQR ialah segi tiga bersudut tegak.`, ans: `PQ² + QR² = ${g.pq} + ${g.qr} = ${g.pr} = PR², maka ∠PQR = 90°`, work: [`PQ² = ${koPr(g.Q[0] - g.P[0])}² + ${koPr(g.Q[1] - g.P[1])}² = ${g.pq}`, `QR² = ${koPr(g.R[0] - g.Q[0])}² + ${koPr(g.R[1] - g.Q[1])}² = ${g.qr}`, `PR² = ${koPr(g.R[0] - g.P[0])}² + ${koPr(g.R[1] - g.P[1])}² = ${g.pr}`, `PQ² + QR² = ${g.pq + g.qr} = PR², maka segi tiga PQR bersudut tegak di Q.`] }),
    ({ m }) => ({ q: `Pada sebuah peta bergrid, 1 unit mewakili ${m.s} km. Encik Ravi memandu dari A${P(m.A[0], m.A[1])} ke B${P(m.B[0], m.B[1])}, kemudian ke C${P(m.C[0], m.C[1])} di sepanjang jalan lurus. (a) Hitung jumlah jarak perjalanannya. (b) Berapakah jarak yang dapat dijimatkan jika dia memandu terus dari A ke C?`, ans: `(a) ${m.tot} km (b) ${m.tot - m.ac} km`, work: [`AB = ${m.a} unit = ${m.a * m.s} km, BC = ${m.b} unit = ${m.b * m.s} km`, `(a) Jumlah = ${m.a * m.s} + ${m.b * m.s} = ${m.tot} km`, `AC = √(${m.a}² + ${m.b}²) = ${m.c} unit = ${m.ac} km`, `(b) Jimat = ${m.tot} − ${m.ac} = ${m.tot - m.ac} km`] })
  ],

  /* ---------- 7.2 Titik Tengah ---------- */
  ttLurus: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari koordinat titik tengah bagi garis lurus yang menyambungkan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2, dir }) => ({ q: `Garis ${dir} ${A}${B} menyambungkan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}. Nyatakan koordinat titik tengah ${A}${B}.` }),
    ({ x1, y1, x2, y2 }) => ({ q: `Dua batang tiang lampu berada di ${P(x1, y1)} dan ${P(x2, y2)} pada pelan bergrid. Sebuah tong sampah akan diletakkan tepat di tengah-tengah antara kedua-dua tiang itu. Cari koordinat tong sampah itu.` }),
    ({ A, B, x1, y1, x2, y2, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata titik tengah bagi ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} ialah ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa membahagi hasil tambah koordinat dengan 2.`)); }
  ],
  ttRumus: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari titik tengah bagi garis lurus yang menghubungkan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `M ialah titik tengah bagi ${A}${B}, dengan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}. Cari koordinat M.` }),
    ({ x1, y1, x2, y2 }) => ({ q: `Dua orang sahabat tinggal di ${P(x1, y1)} dan ${P(x2, y2)} pada sebuah peta bergrid. Mereka bersetuju untuk bertemu tepat di tengah-tengah antara rumah mereka. Nyatakan koordinat tempat pertemuan itu.` }),
    ({ A, B, x1, y1, x2, y2, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira titik tengah bagi ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} sebagai ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${N} menolak koordinat. Rumus titik tengah menggunakan hasil tambah koordinat dibahagi 2.`)); },
    ({ x1, y1, x2, y2 }) => ({ q: `Lengkapkan: Titik tengah = ((${fmt(x1)} + ${par(x2)})/2, (${fmt(y1)} + ${par(y2)})/2) = ___` })
  ],
  ttRajah: [
    ({ A, B }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${A}${B} pada satah Cartes. Cari koordinat titik tengah ${A}${B}.` }),
    ({ A, B, x1, y1, x2, y2, ans }) => ({ q: `Berdasarkan rajah di bawah, nyatakan koordinat ${A} dan ${B}, seterusnya cari titik tengah ${A}${B}.`, ans: `${A}${P(x1, y1)}, ${B}${P(x2, y2)}; titik tengah = ${ans}` }),
    ({ A, B }) => ({ q: `Sebatang paip lurus dipasang dari ${A} ke ${B} seperti dalam rajah di bawah. Sebuah injap akan dipasang tepat di tengah-tengah paip itu. Cari koordinat injap itu.` })
  ],
  ttDp: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari koordinat titik tengah bagi ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}. Beri jawapan dalam bentuk perpuluhan.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Hitung koordinat titik tengah bagi garis lurus yang menyambungkan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ x1, y1, x2, y2 }) => ({ q: `Sebuah jambatan lurus menghubungkan ${P(x1, y1)} dan ${P(x2, y2)} pada pelan bergrid. Di manakah titik tengah jambatan itu?` })
  ],
  cariHujung: [
    ({ x1, y1, mx, my }) => ({ q: `M${koP(mx, my)} ialah titik tengah bagi garis lurus AB. Diberi A${P(x1, y1)}, cari koordinat B.` }),
    ({ x1, y1, mx, my }) => ({ q: `Titik tengah bagi garis lurus AB ialah ${koP(mx, my)}. Jika A${P(x1, y1)}, cari koordinat titik B.` }),
    ({ x1, y1, mx, my }) => ({ q: `Sebatang tali diregangkan dari tiang A${P(x1, y1)} ke tiang B. Titik tengah tali itu berada di ${koP(mx, my)}. Cari kedudukan tiang B.` }),
    ({ x1, y1, mx, my, ans }) => { const N = vnama(); return Object.assign({ q: `M${koP(mx, my)} ialah titik tengah AB dan A${P(x1, y1)}. ${N} berkata B ialah ${koP((x1 + mx) / 2, (y1 + my) / 2)}. Adakah ${N} betul?` }, salah(N, ans, `${N} mencari titik tengah AM. B ialah hujung yang lagi satu, iaitu B = (2 × xM − x₁, 2 × yM − y₁).`)); }
  ],
  cariHK: [
    ({ x1, y2, mx, my, yA, xB }) => ({ q: `Titik tengah bagi A(h, ${fmt(yA)}) dan B(${fmt(xB)}, k) ialah M${koP(mx, my)}. Cari nilai h dan nilai k.` }),
    ({ mx, my, yA, xB }) => ({ q: `Diberi M${koP(mx, my)} ialah titik tengah bagi garis lurus yang menyambungkan P(h, ${fmt(yA)}) dan Q(${fmt(xB)}, k). Hitung nilai h dan k.` }),
    ({ mx, my, yA, xB }) => ({ q: `Lengkapkan: (h + ${par(xB)})/2 = ${koN(mx)} dan (${fmt(yA)} + k)/2 = ${koN(my)}, maka h = ___ dan k = ___.` })
  ],
  k72: [
    ({ c }) => ({ q: `AB ialah diameter sebuah bulatan, dengan A${P(c.A[0], c.A[1])} dan B${P(c.B[0], c.B[1])}. Cari (a) koordinat pusat bulatan, (b) jejari bulatan itu.`, ans: `(a) ${koP(c.M[0], c.M[1])} (b) ${c.r} unit`, work: [`(a) Pusat = titik tengah AB = ((${fmt(c.A[0])} + ${par(c.B[0])})/2, (${fmt(c.A[1])} + ${par(c.B[1])})/2) = ${koP(c.M[0], c.M[1])}`, `(b) AB = √(${koPr(c.B[0] - c.A[0])}² + ${koPr(c.B[1] - c.A[1])}²) = √${c.d * c.d} = ${c.d} unit`, `Jejari = ${c.d} ÷ 2 = ${c.r} unit`] }),
    ({ m }) => ({ q: `Diberi P${P(m.P[0], m.P[1])}, Q${P(m.Q[0], m.Q[1])} dan R${P(m.R[0], m.R[1])}. M ialah titik tengah PQ. Hitung (a) koordinat M, (b) jarak MR.`, ans: `(a) M${koP(m.M[0], m.M[1])} (b) ${m.d} unit`, work: [`(a) M = ((${fmt(m.P[0])} + ${par(m.Q[0])})/2, (${fmt(m.P[1])} + ${par(m.Q[1])})/2) = ${koP(m.M[0], m.M[1])}`, `(b) MR = √((${fmt(m.R[0])} − ${koPr(m.M[0])})² + (${fmt(m.R[1])} − ${koPr(m.M[1])})²)`, `= √(${koPr(m.R[0] - m.M[0])}² + ${koPr(m.R[1] - m.M[1])}²) = √${m.d * m.d} = ${m.d} unit`] }),
    ({ x }) => ({ q: `Titik tengah bagi A(${fmt(x.x1)}, k) dan B${P(x.x2, x.y2)} terletak pada paksi-x. Cari (a) nilai k, (b) koordinat titik tengah AB.`, ans: `(a) k = ${fmt(x.k)} (b) ${koP(x.mx, 0)}`, work: ['Titik pada paksi-x mempunyai koordinat-y = 0.', `(a) (k + ${par(x.y2)})/2 = 0, maka k = ${fmt(x.k)}`, `(b) x = (${fmt(x.x1)} + ${par(x.x2)})/2 = ${koN(x.mx)}, maka titik tengah = ${koP(x.mx, 0)}`] }),
    ({ e }) => ({ q: `Titik P, M dan Q membahagikan garis lurus AB kepada empat bahagian yang sama panjang, dengan urutan A, P, M, Q, B. Diberi A${P(e.A[0], e.A[1])} dan B${P(e.B[0], e.B[1])}, cari koordinat P, M dan Q.`, ans: `P${koP(e.P[0], e.P[1])}, M${koP(e.M[0], e.M[1])}, Q${koP(e.Q[0], e.Q[1])}`, work: [`M ialah titik tengah AB: M = ${koP(e.M[0], e.M[1])}`, `P ialah titik tengah AM: P = ((${fmt(e.A[0])} + ${koPr(e.M[0])})/2, (${fmt(e.A[1])} + ${koPr(e.M[1])})/2) = ${koP(e.P[0], e.P[1])}`, `Q ialah titik tengah MB: Q = ((${koN(e.M[0])} + ${par(e.B[0])})/2, (${koN(e.M[1])} + ${par(e.B[1])})/2) = ${koP(e.Q[0], e.Q[1])}`] })
  ],

  /* ---------- 7.3 Sistem Koordinat Cartes ---------- */
  perimSE: [
    ({ L, pts, per }) => ({ q: `Bucu-bucu sebuah segi empat tepat ${L} ialah ${pts}. Hitung perimeter segi empat tepat itu.`, ans: `${per} unit` }),
    ({ L, per, luas }) => ({ q: `Rajah di bawah menunjukkan segi empat tepat ${L} pada satah Cartes. Cari perimeter dan luas ${L}.`, ans: `Perimeter = ${per} unit, luas = ${luas} unit²` }),
    ({ pts, per, work }) => ({ q: `Sebuah taman berbentuk segi empat tepat mempunyai bucu di ${pts} pada pelan bergrid. Setiap unit mewakili 10 m. Berapakah panjang pagar yang diperlukan untuk mengelilingi taman itu?`, ans: `${per * 10} m`, work: work.slice(0, 3).concat([`Panjang pagar = ${per} × 10 m = ${per * 10} m`]) }),
    ({ L, pts, luas }) => ({ q: `Pada satah Cartes, segi empat tepat ${L} mempunyai bucu ${pts}. Hitung luas ${L}.`, ans: `${luas} unit²` })
  ],
  petaJarak: [
    ({ n1, n2, p1, p2, s }) => ({ q: `Rajah di bawah ialah peta bergrid. ${n1} terletak di ${p1} dan ${n2.toLowerCase()} di ${p2}. Jika 1 unit mewakili ${s} km, hitung jarak lurus antara kedua-dua tempat itu.` }),
    ({ n1, n2, s }) => ({ q: `Sebuah helikopter terbang lurus dari ${n1.toLowerCase()} ke ${n2.toLowerCase()} seperti dalam peta di bawah. Setiap unit mewakili ${s} km. Berapakah jarak penerbangan helikopter itu?` }),
    ({ n1, n2, s }) => ({ q: `Pada peta di bawah, setiap unit mewakili ${s} km. Berapakah jarak terdekat (garis lurus) dari ${n1.toLowerCase()} ke ${n2.toLowerCase()}?` }),
    ({ n1, n2, s, adx, ady, ans }) => { const N = vnama(); return Object.assign({ q: `Berdasarkan peta di bawah (1 unit = ${s} km), ${N} berkata jarak lurus dari ${n1.toLowerCase()} ke ${n2.toLowerCase()} ialah ${(adx + ady) * s} km. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah jarak mengufuk dan mencancang. Jarak lurus dikira dengan rumus jarak.`)); }
  ],
  petaTengah: [
    ({ n1, n2, p1, p2 }) => ({ q: `${n1} terletak di ${p1} dan ${n2.toLowerCase()} di ${p2} pada sebuah peta bergrid. Sebuah perhentian bas akan dibina tepat di tengah-tengah antara kedua-dua tempat itu. Cari koordinat perhentian bas itu.` }),
    ({ p1, p2 }) => ({ q: `Dua pasukan pengakap berkhemah di ${p1} dan ${p2}. Mereka bersetuju bertemu di titik tengah antara kedua-dua khemah itu. Nyatakan koordinat titik pertemuan itu.` }),
    ({ n1, n2 }) => ({ q: `Berdasarkan peta di bawah, cari koordinat titik tengah bagi jalan lurus dari ${n1.toLowerCase()} ke ${n2.toLowerCase()}.` })
  ],
  perimTiga: [
    ({ pts, per }) => ({ q: `Bucu-bucu segi tiga ABC ialah ${pts}. Hitung perimeter segi tiga ABC.`, ans: `${per} unit` }),
    ({ per, luas }) => ({ q: 'Rajah di bawah menunjukkan segi tiga ABC pada satah Cartes. Cari perimeter dan luas segi tiga itu.', ans: `Perimeter = ${per} unit, luas = ${luas} unit²` }),
    ({ pts, per, work }) => ({ q: `Sebidang kebun berbentuk segi tiga mempunyai bucu di ${pts} pada pelan bergrid. Setiap unit mewakili 1 m. Berapakah panjang pagar yang diperlukan untuk memagar kebun itu?`, ans: `${per} m`, work: work.slice(0, 3).concat([`Panjang pagar = ${per} × 1 m = ${per} m`]) })
  ],
  samaKaki: [
    ({ pts, c }) => ({ q: `Tunjukkan bahawa segi tiga PQR dengan ${pts} ialah segi tiga sama kaki.`, ans: `PR = QR = ${c} unit, maka PQR ialah segi tiga sama kaki` }),
    ({ pts, per }) => ({ q: `Segi tiga PQR mempunyai bucu ${pts}. Tentukan jenis segi tiga itu (sama sisi, sama kaki atau tak sama kaki) dan hitung perimeternya.`, ans: `Sama kaki; perimeter = ${per} unit` }),
    ({ pts, c }) => ({ q: `Sebuah papan tanda berbentuk segi tiga mempunyai bucu ${pts} pada pelan bergrid. Adakah papan tanda itu berbentuk segi tiga sama kaki? Buktikan.`, ans: `Ya, kerana PR = QR = ${c} unit` })
  ],
  bucuKeempat: [
    ({ pts }) => ({ q: `ABCD ialah sebuah segi empat selari dengan ${pts}. Dengan menggunakan titik tengah pepenjuru, cari koordinat D.` }),
    ({ pts }) => ({ q: `Tiga bucu sebuah segi empat selari ABCD ialah ${pts}. Cari koordinat bucu keempat, D.` }),
    ({ pts, M, ans }) => ({ q: `Pepenjuru segi empat selari ABCD bersilang di titik M. Diberi ${pts}, cari koordinat M dan D.`, ans: `M${M}, ${ans}` })
  ],
  pusatBulatan: [
    ({ A, B }) => ({ q: `AB ialah diameter sebuah bulatan dengan A${A} dan B${B}. Cari koordinat pusat dan jejari bulatan itu.` }),
    ({ A, B }) => ({ q: `Sebuah bulatan mempunyai diameter PQ dengan P${A} dan Q${B}. Nyatakan koordinat pusat bulatan dan hitung jejarinya.` }),
    ({ A, B, M, r, work }) => ({ q: `Sebuah kolam berbentuk bulatan dilukis pada pelan bergrid. Hujung-hujung satu diameternya ialah ${A} dan ${B}. Setiap unit mewakili 1 m. Cari kedudukan pusat kolam dan jejarinya.`, ans: `Pusat ${M}, jejari ${r} m`, work: work.concat([`Jejari kolam = ${r} × 1 m = ${r} m`]) })
  ],
  k73: [
    ({ h }) => ({ q: `ABCD ialah sebuah rombus dengan A${P(h.A[0], h.A[1])}, B${P(h.B[0], h.B[1])}, C${P(h.C[0], h.C[1])} dan D${P(h.D[0], h.D[1])}. (a) Tunjukkan bahawa pepenjuru AC dan BD membahagi dua sama antara satu sama lain. (b) Hitung perimeter rombus itu.`, ans: `(a) Titik tengah AC = titik tengah BD = ${P(h.M[0], h.M[1])} (b) ${4 * h.c} unit`, work: [`(a) Titik tengah AC = ((${fmt(h.A[0])} + ${par(h.C[0])})/2, (${fmt(h.A[1])} + ${par(h.C[1])})/2) = ${P(h.M[0], h.M[1])}`, `Titik tengah BD = ((${fmt(h.B[0])} + ${par(h.D[0])})/2, (${fmt(h.B[1])} + ${par(h.D[1])})/2) = ${P(h.M[0], h.M[1])}`, 'Titik tengah sama, maka pepenjuru membahagi dua sama antara satu sama lain.', `(b) AB = √(${h.a}² + ${h.b}²) = ${h.c} unit`, `Perimeter = 4 × ${h.c} = ${4 * h.c} unit`] }),
    ({ s }) => ({ q: `Segi tiga ABC ialah segi tiga sama kaki dengan AC = BC. Diberi A${P(s.A[0], s.A[1])}, B${P(s.B[0], s.B[1])}, C(${fmt(s.x0)}, k) dan AC = ${s.c} unit, dengan k > ${fmt(s.y0)}. Cari (a) nilai k, (b) perimeter segi tiga ABC.`, ans: `(a) k = ${fmt(s.k)} (b) ${2 * s.c + 2 * s.a} unit`, work: [`(a) AC = √((${fmt(s.x0)} − ${par(s.A[0])})² + (k − ${par(s.y0)})²) = ${s.c}`, `${s.a * s.a} + (k − ${par(s.y0)})² = ${s.c * s.c}, maka (k − ${par(s.y0)})² = ${s.b * s.b}`, `k − ${par(s.y0)} = ${s.b} (kerana k > ${fmt(s.y0)}), maka k = ${fmt(s.k)}`, `(b) AB = ${fmt(s.B[0])} − ${par(s.A[0])} = ${2 * s.a} unit`, `Perimeter = ${s.c} + ${s.c} + ${2 * s.a} = ${2 * s.c + 2 * s.a} unit`] }),
    ({ j }) => ({ q: `Pada sebuah peta bergrid, 1 unit mewakili ${j.s} km. Hafiz berbasikal dari rumahnya di R${P(j.R[0], j.R[1])} terus ke sekolah di S${P(j.S[0], j.S[1])}, kemudian ke kedai di T${P(j.T[0], j.T[1])}. (a) Hitung jumlah jarak perjalanan Hafiz. (b) Sebuah gerai terletak di tengah-tengah jalan lurus RS. Nyatakan koordinat gerai itu.`, ans: `(a) ${j.tot} km (b) ${koP(j.M[0], j.M[1])}`, work: [`RS = √(${j.a}² + ${j.b}²) = ${j.c} unit = ${j.c * j.s} km`, `ST = ${j.e} unit = ${j.e * j.s} km (garis ${j.dir})`, `(a) Jumlah = ${j.c * j.s} + ${j.e * j.s} = ${j.tot} km`, `(b) Gerai = ((${fmt(j.R[0])} + ${par(j.S[0])})/2, (${fmt(j.R[1])} + ${par(j.S[1])})/2) = ${koP(j.M[0], j.M[1])}`] }),
    ({ o }) => ({ q: `Pusat sebuah bulatan ialah C${P(o.C[0], o.C[1])}. AB ialah diameter bulatan itu dengan A${P(o.A[0], o.A[1])}. Cari (a) koordinat B, (b) jejari bulatan itu.`, ans: `(a) B${P(o.B[0], o.B[1])} (b) ${o.r} unit`, work: [`(a) C ialah titik tengah AB: ((${fmt(o.A[0])} + x)/2, (${fmt(o.A[1])} + y)/2) = ${P(o.C[0], o.C[1])}`, `x = 2 × ${par(o.C[0])} − ${par(o.A[0])} = ${fmt(o.B[0])}, y = 2 × ${par(o.C[1])} − ${par(o.A[1])} = ${fmt(o.B[1])}`, `(b) Jejari = AC = √(${koPr(o.C[0] - o.A[0])}² + ${koPr(o.C[1] - o.A[1])}²) = √${o.r * o.r} = ${o.r} unit`] })
  ]
};

/* =================== pembina data =================== */
// dua titik dengan jarak integer (tigaan Pythagoras); lim = had koordinat
function koPy(r, lim = 8, tri = KOTRI) {
  let x1, y1, x2, y2, a, b, c;
  do {
    [a, b, c] = r.p(tri); if (r.f() < .5) [a, b] = [b, a];
    const sx = koSg(r), sy = koSg(r);
    x1 = r.i(-lim, lim); y1 = r.i(-lim, lim); x2 = x1 + sx * a; y2 = y1 + sy * b;
  } while (Math.abs(x2) > lim || Math.abs(y2) > lim || (x1 === 0 && y1 === 0) || (x2 === 0 && y2 === 0));
  return { x1, y1, x2, y2, dx: x2 - x1, dy: y2 - y1, d: c };
}
function koStr(pts) { const a = pts.map(([L, x, y]) => `${L}${P(x, y)}`); return a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]; }

/* =================== pembina soalan (r = koRG atau koRW) =================== */
const KO = {};
/* ---------- 7.1 ---------- */
KO.jarakLurus = (r, k) => {
  const dirH = k == null ? r.f() < .5 : k % 2 === 0, [A, B] = r.p(KOHUR2);
  let a, b; do { a = r.i(-7, -1); b = r.i(1, 7); } while (b === -a || b - a < 3);
  if (r.f() < .5) [a, b] = [b, a];
  const c0 = r.i(-6, 6), d = Math.abs(b - a), ans = `${d} unit`;
  const [x1, y1, x2, y2] = dirH ? [a, c0, b, c0] : [c0, a, c0, b];
  const ax = dirH ? 'x' : 'y', hi = Math.max(a, b), lo = Math.min(a, b);
  const work = [dirH ? `Koordinat-y sama (${fmt(c0)}), maka ${A}${B} ialah garis mengufuk.` : `Koordinat-x sama (${fmt(c0)}), maka ${A}${B} ialah garis mencancang.`, `${A}${B} = ${fmt(hi)} − ${par(lo)} = ${d} unit`];
  return GEN_LQ('jarakLurus', { A, B, x1, y1, x2, y2, d, ans, ax, dir: dirH ? 'mengufuk' : 'mencancang', claim: Math.abs(Math.abs(b) - Math.abs(a)), work }, { fig: koTwo(A, B, x1, y1, x2, y2) });
};
KO.jarakRumus = r => {
  const t = koPy(r, 9), [A, B] = r.p(KOHUR2), ans = `${t.d} unit`;
  return GEN_LQ('jarakRumus', Object.assign({ A, B, ans, adx: Math.abs(t.dx), ady: Math.abs(t.dy), work: koWJ(A + B, t.x1, t.y1, t.x2, t.y2) }, t));
};
KO.jarakRajah = r => {
  const t = koPy(r, 6, KOTRI6), [A, B] = r.p(KOHUR2), ans = `${t.d} unit`;
  const work = [`Daripada rajah, ${A}${P(t.x1, t.y1)} dan ${B}${P(t.x2, t.y2)}.`].concat(koWJ(A + B, t.x1, t.y1, t.x2, t.y2));
  return GEN_LQ('jarakRajah', Object.assign({ A, B, ans, adx: Math.abs(t.dx), ady: Math.abs(t.dy), work }, t), { fig: koTwo(A, B, t.x1, t.y1, t.x2, t.y2, { coords: false }), figAns: koTwo(A, B, t.x1, t.y1, t.x2, t.y2, { legs: true }) });
};
KO.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
KO.jarakDp = r => {
  let x1, y1, x2, y2, s;
  do { x1 = r.i(-7, 7); y1 = r.i(-7, 7); x2 = x1 + koSg(r) * r.i(1, 7); y2 = y1 + koSg(r) * r.i(1, 7); s = (x2 - x1) ** 2 + (y2 - y1) ** 2; }
  while (Math.abs(x2) > 9 || Math.abs(y2) > 9 || koSq(s)[0] !== '√');
  const [A, B] = r.p(KOHUR2), v = ko2(Math.sqrt(s));
  return GEN_LQ('jarakDp', { A, B, x1, y1, x2, y2, s, v, ans: `${v} unit`, work: koWJ(A + B, x1, y1, x2, y2) });
};
KO.cariKoordJ = (r, k) => {
  const py = k == null ? r.f() < .5 : k % 2 === 1;
  if (!py) {
    const hor = r.f() < .5, c0 = r.n(-5, 5), b = r.i(-6, 6), D = r.i(3, 9), up = r.f() < .5, h = up ? b + D : b - D;
    const desc = hor ? `A(h, ${fmt(c0)}) dan B(${fmt(b)}, ${fmt(c0)})` : `A(${fmt(c0)}, h) dan B(${fmt(c0)}, ${fmt(b)})`;
    const cond = `h ${up ? '>' : '<'} ${fmt(b)}`;
    const work = [`A dan B mempunyai koordinat-${hor ? 'y' : 'x'} yang sama, maka AB = beza koordinat-${hor ? 'x' : 'y'}.`, up ? `h − ${par(b)} = ${D}` : `${fmt(b)} − h = ${D}`, `h = ${fmt(h)}`];
    return GEN_LQ('cariKoordJ', { desc, D, cond, v: 'h', ans: `h = ${fmt(h)}`, work });
  }
  let a, b, c, x1, x2, y2; do { [a, b, c] = r.p(KOTRI6); if (r.f() < .5) [a, b] = [b, a]; x1 = r.i(-6, 6); x2 = x1 + koSg(r) * a; y2 = r.i(-5, 5); } while (Math.abs(x2) > 8);
  const up = r.f() < .5, kk = up ? y2 + b : y2 - b, k2 = up ? y2 - b : y2 + b;
  const desc = `A(${fmt(x1)}, k) dan B${P(x2, y2)}`, cond = `k ${up ? '>' : '<'} ${fmt(y2)}`;
  const work = [`√((${fmt(x2)} − ${par(x1)})² + (${fmt(y2)} − k)²) = ${c}`, `${a * a} + (${fmt(y2)} − k)² = ${c * c}`, `(${fmt(y2)} − k)² = ${c * c - a * a}`, `${fmt(y2)} − k = ±${b}, maka k = ${fmt(Math.min(kk, k2))} atau k = ${fmt(Math.max(kk, k2))}`, `Oleh sebab ${cond}, k = ${fmt(kk)}`];
  return GEN_LQ('cariKoordJ', { desc, D: c, cond, v: 'k', ans: `k = ${fmt(kk)}`, work });
};
KO.dekat = r => {
  let C, Pp, Qp, sP, sQ;
  do { C = [r.i(-4, 4), r.i(-4, 4)]; Pp = [r.i(-7, 7), r.i(-7, 7)]; Qp = [r.i(-7, 7), r.i(-7, 7)]; sP = (Pp[0] - C[0]) ** 2 + (Pp[1] - C[1]) ** 2; sQ = (Qp[0] - C[0]) ** 2 + (Qp[1] - C[1]) ** 2; }
  while (sP === sQ || sP < 5 || sQ < 5 || Math.abs(sP - sQ) > 30);
  const [X, Y] = r.p([['P', 'Q'], ['D', 'E'], ['K', 'L'], ['M', 'N']]), Cl = 'C', [n1, n2] = r.p(KONAMA2);
  const near = sP < sQ ? X : Y, far = sP < sQ ? Y : X, dP = koSq(sP), dQ = koSq(sQ);
  const work = koWJ(X + Cl, Pp[0], Pp[1], C[0], C[1]).slice(1, 4).map((w, i) => (i ? w : `${X}${Cl} ${w}`)).concat(koWJ(Y + Cl, Qp[0], Qp[1], C[0], C[1]).slice(1, 4).map((w, i) => (i ? w : `${Y}${Cl} ${w}`)), [`√${Math.min(sP, sQ)} < √${Math.max(sP, sQ)}, maka ${near} lebih dekat dengan ${Cl}.`]);
  return GEN_LQ('dekat', { X, Y, C: Cl, px: P(...Pp), qx: P(...Qp), cx: P(...C), n1, n2, nw: sP < sQ ? n1 : n2, dP, dQ, far, ans: `Titik ${near} (${X}${Cl} = ${dP} unit, ${Y}${Cl} = ${dQ} unit)`, work });
};
KO.k71 = r => {
  // (1) dua nilai k
  let a, b, c, x1, x2, y2; do { [a, b, c] = r.p(KOTRI6); if (r.f() < .5) [a, b] = [b, a]; x1 = r.i(-5, 5); x2 = x1 + koSg(r) * a; y2 = r.i(-4, 4); } while (Math.abs(x2) > 8);
  const t = { x1, x2, y2, a, b, c, k1: y2 - b, k2: y2 + b };
  // (2) akas Pythagoras: PQ ⟂ QR
  let g; do {
    const Q = [r.i(-3, 3), r.i(-3, 3)], u = [r.n(-3, 3), r.n(-3, 3)], kk = r.p([1, 2]), sg = koSg(r);
    const Pq = [Q[0] + u[0], Q[1] + u[1]], R = [Q[0] - sg * kk * u[1], Q[1] + sg * kk * u[0]];
    const sq = (A, B) => (A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2;
    g = { P: Pq, Q, R, pq: sq(Pq, Q), qr: sq(Q, R), pr: sq(Pq, R) };
  } while ([...g.P, ...g.R].some(v => Math.abs(v) > 8) || g.pq + g.qr !== g.pr);
  // (3) peta: A → B (mengufuk) → C (mencancang)
  const [ta, tb, tc] = r.p(KOTRI6.concat([[5, 12, 13]])), s = r.p([1, 2, 3, 5]);
  const A0 = [r.i(-6, 0), r.i(-6, 0)], sx = 1, sy = 1;
  const m = { s, a: ta, b: tb, c: tc, A: A0, B: [A0[0] + sx * ta, A0[1]], C: [A0[0] + sx * ta, A0[1] + sy * tb], tot: (ta + tb) * s, ac: tc * s };
  return GEN_LQ('k71', { t, g, m });
};

/* ---------- 7.2 ---------- */
KO.ttLurus = (r, k) => {
  const dirH = k == null ? r.f() < .5 : k % 2 === 0, [A, B] = r.p(KOHURT);
  let a, b; do { a = r.i(-8, 8); b = r.i(-8, 8); } while ((a + b) % 2 !== 0 || a === b || a + b === 0 || Math.abs(a - b) < 4);
  const c0 = r.i(-6, 6), m = (a + b) / 2;
  const [x1, y1, x2, y2] = dirH ? [a, c0, b, c0] : [c0, a, c0, b];
  const ans = dirH ? P(m, c0) : P(c0, m), claim = dirH ? P(a + b, c0) : P(c0, a + b);
  const work = [dirH ? `Koordinat-y sama (${fmt(c0)}), jadi titik tengah juga mempunyai y = ${fmt(c0)}.` : `Koordinat-x sama (${fmt(c0)}), jadi titik tengah juga mempunyai x = ${fmt(c0)}.`, `${dirH ? 'x' : 'y'} = (${fmt(a)} + ${par(b)})/2 = ${fmt(a + b)}/2 = ${fmt(m)}`, `Titik tengah = ${ans}`];
  return GEN_LQ('ttLurus', { A, B, x1, y1, x2, y2, ans, claim, dir: dirH ? 'mengufuk' : 'mencancang', work }, { fig: koTwo(A, B, x1, y1, x2, y2), figAns: koTwo(A, B, x1, y1, x2, y2, { mid: ans }) });
};
function koMidPts(r, lim, parity) {
  let x1, y1, x2, y2;
  do { x1 = r.i(-lim, lim); y1 = r.i(-lim, lim); x2 = r.i(-lim, lim); y2 = r.i(-lim, lim); }
  while (x1 === x2 || y1 === y2 || x1 === 0 || Math.abs(x1 - x2) + Math.abs(y1 - y2) < 5 ||
    (parity === 'even' ? ((x1 + x2) % 2 !== 0 || (y1 + y2) % 2 !== 0) : ((x1 + x2) % 2 === 0 && (y1 + y2) % 2 === 0)));
  return { x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}
KO.ttRumus = r => {
  const t = koMidPts(r, 8, 'even'), [A, B] = r.p(KOHURT), ans = koP(t.mx, t.my);
  return GEN_LQ('ttRumus', Object.assign({ A, B, ans, claim: koP((t.x2 - t.x1) / 2, (t.y2 - t.y1) / 2), work: koWM(t.x1, t.y1, t.x2, t.y2) }, t));
};
KO.ttRajah = r => {
  const t = koMidPts(r, 5, 'even'), [A, B] = r.p(KOHURT), ans = koP(t.mx, t.my);
  const work = [`Daripada rajah, ${A}${P(t.x1, t.y1)} dan ${B}${P(t.x2, t.y2)}.`].concat(koWM(t.x1, t.y1, t.x2, t.y2));
  return GEN_LQ('ttRajah', Object.assign({ A, B, ans, work }, t), { fig: koTwo(A, B, t.x1, t.y1, t.x2, t.y2, { coords: false }), figAns: koTwo(A, B, t.x1, t.y1, t.x2, t.y2, { mid: ans }) });
};
KO.ttDp = r => {
  const t = koMidPts(r, 8, 'odd'), [A, B] = r.p(KOHURT), ans = koP(t.mx, t.my);
  return GEN_LQ('ttDp', Object.assign({ A, B, ans, work: koWM(t.x1, t.y1, t.x2, t.y2) }, t));
};
KO.cariHujung = r => {
  let x1, y1, mx, my, x2, y2;
  do { x1 = r.i(-7, 7); y1 = r.i(-7, 7); mx = r.i(-4, 4); my = r.i(-4, 4); x2 = 2 * mx - x1; y2 = 2 * my - y1; }
  while (Math.abs(x2) > 9 || Math.abs(y2) > 9 || x1 === mx || y1 === my);
  const ans = `B${P(x2, y2)}`;
  return GEN_LQ('cariHujung', { x1, y1, mx, my, ans, work: koWH(x1, y1, mx, my) }, { fig: koFig({ pts: [[x1, y1, `A${P(x1, y1)}`, 'am'], [mx, my, `M${P(mx, my)}`, 'gr']], segs: [[[x1, y1], [mx, my], 'am', false, 3.5]] }), figAns: koFig({ pts: [[x1, y1, 'A', 'am'], [mx, my, 'M', 'gr'], [x2, y2, `B${P(x2, y2)}`, 'pk']], segs: [[[x1, y1], [x2, y2], 'am', false, 3.5]] }) });
};
KO.cariHK = r => {
  let xA, yA, xB, yB; do { xA = r.i(-8, 8); yA = r.i(-8, 8); xB = r.i(-8, 8); yB = r.i(-8, 8); } while ((xA + xB) % 2 !== 0 || (yA + yB) % 2 !== 0 || xA === xB || yA === yB || xA === 0 || yB === 0);
  const mx = (xA + xB) / 2, my = (yA + yB) / 2;
  const work = [`(h + ${par(xB)})/2 = ${koN(mx)} → h + ${par(xB)} = ${koN(2 * mx)} → h = ${fmt(xA)}`, `(${fmt(yA)} + k)/2 = ${koN(my)} → ${fmt(yA)} + k = ${koN(2 * my)} → k = ${fmt(yB)}`];
  return GEN_LQ('cariHK', { mx, my, yA, xB, ans: `h = ${fmt(xA)}, k = ${fmt(yB)}`, work });
};
KO.k72 = r => {
  // (1) diameter → pusat & jejari
  const DI = [[6, 8], [8, 6], [0, 10], [10, 0], [6, 0], [0, 8]];
  let c; do { let [a, b] = r.p(DI); a *= koSg(r); b *= koSg(r); const A = [r.i(-6, 6), r.i(-6, 6)], B = [A[0] + a, A[1] + b], d = Math.hypot(a, b); c = { A, B, M: [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d, r: d / 2 }; } while (Math.abs(c.B[0]) > 9 || Math.abs(c.B[1]) > 9);
  // (2) titik tengah lalu jarak
  let m; do { const M = [r.i(-4, 4), r.i(-4, 4)], v = [r.n(-4, 4), r.n(-4, 4)], [a, b, cc] = r.p(KOTRI6), sw = r.f() < .5; const R = [M[0] + koSg(r) * (sw ? b : a), M[1] + koSg(r) * (sw ? a : b)]; m = { M, P: [M[0] - v[0], M[1] - v[1]], Q: [M[0] + v[0], M[1] + v[1]], R, d: cc }; } while ([...m.P, ...m.Q, ...m.R].some(t => Math.abs(t) > 9) || (m.R[0] === m.P[0] && m.R[1] === m.P[1]) || (m.R[0] === m.Q[0] && m.R[1] === m.Q[1]));
  // (3) titik tengah pada paksi-x
  let x; do { x = { x1: r.i(-8, 8), x2: r.i(-8, 8), y2: r.n(-7, 7) }; } while ((x.x1 + x.x2) % 2 !== 0 || x.x1 === x.x2);
  x.k = -x.y2; x.mx = (x.x1 + x.x2) / 2;
  // (4) empat bahagian sama
  let e; do { const A = [r.i(-8, 8), r.i(-8, 8)], v = [koSg(r) * r.p([4, 8, 12]), koSg(r) * r.p([0, 4, 8])], B = [A[0] + v[0], A[1] + v[1]]; e = { A, B, M: [A[0] + v[0] / 2, A[1] + v[1] / 2], P: [A[0] + v[0] / 4, A[1] + v[1] / 4], Q: [A[0] + 3 * v[0] / 4, A[1] + 3 * v[1] / 4] }; } while (Math.abs(e.B[0]) > 10 || Math.abs(e.B[1]) > 10);
  return GEN_LQ('k72', { c, m, x, e });
};

/* ---------- 7.3 ---------- */
KO.perimSE = r => {
  let x1, y1, w, h; do { x1 = r.i(-6, 3); y1 = r.i(-6, 3); w = r.i(2, 8); h = r.i(2, 7); } while (w === h || x1 + w > 7 || y1 + h > 7);
  const L = r.p(['ABCD', 'PQRS', 'KLMN', 'EFGH']), V = [[x1, y1], [x1 + w, y1], [x1 + w, y1 + h], [x1, y1 + h]];
  const pts = koStr(V.map((p, i) => [L[i], p[0], p[1]])), per = 2 * (w + h), luas = w * h;
  const work = [`${L[0]}${L[1]} = ${fmt(x1 + w)} − ${par(x1)} = ${w} unit`, `${L[1]}${L[2]} = ${fmt(y1 + h)} − ${par(y1)} = ${h} unit`, `Perimeter = 2(${w} + ${h}) = ${per} unit`, `Luas = ${w} × ${h} = ${luas} unit²`];
  return GEN_LQ('perimSE', { L, pts, per, luas, work }, { fig: koFig({ polys: [[V, 'pa']], pts: V.map((p, i) => [p[0], p[1], `${L[i]}${P(p[0], p[1])}`, 'tx']), label: `Segi empat tepat ${L}` }) });
};
function koPeta(r, lim) {
  const [t1, t2] = koShuf(r, KOTEMPAT).slice(0, 2);
  let t; do { t = koPy(r, lim, lim <= 6 ? KOTRI6 : KOTRI); } while (t.x1 < -1 && t.x2 < -1);
  return { t1, t2, t };
}
const koPetaFig = (t1, t2, x1, y1, x2, y2, mid, legs) => koFig({ pts: [[x1, y1, `${t1[1]}${P(x1, y1)}`, 'tr'], [x2, y2, `${t2[1]}${P(x2, y2)}`, 'rd']].concat(mid ? [[(x1 + x2) / 2, (y1 + y2) / 2, `${koP((x1 + x2) / 2, (y1 + y2) / 2)}`, 'gr']] : []), segs: [[[x1, y1], [x2, y2], 'am', true, 3]].concat(legs ? koLegs(x1, y1, x2, y2).segs : []), texts: legs ? koLegs(x1, y1, x2, y2).texts : [], label: `Peta bergrid: ${t1[0]} dan ${t2[0]}` });
KO.petaJarak = r => {
  const { t1, t2, t } = koPeta(r, 6), s = r.p([1, 2, 3, 5]), D = t.d * s;
  const work = koWJ(t1[1] + t2[1], t.x1, t.y1, t.x2, t.y2).concat([`Jarak sebenar = ${t.d} × ${s} = ${D} km`]);
  return GEN_LQ('petaJarak', { n1: t1[0], n2: t2[0], p1: P(t.x1, t.y1), p2: P(t.x2, t.y2), s, adx: Math.abs(t.dx), ady: Math.abs(t.dy), ans: `${D} km`, work }, { fig: koPetaFig(t1, t2, t.x1, t.y1, t.x2, t.y2), figAns: koPetaFig(t1, t2, t.x1, t.y1, t.x2, t.y2, false, true) });
};
KO.petaTengah = r => {
  const [t1, t2] = koShuf(r, KOTEMPAT).slice(0, 2), m = koMidPts(r, 6, 'even'), ans = koP(m.mx, m.my);
  return GEN_LQ('petaTengah', { n1: t1[0], n2: t2[0], p1: P(m.x1, m.y1), p2: P(m.x2, m.y2), ans, work: koWM(m.x1, m.y1, m.x2, m.y2) }, { fig: koPetaFig(t1, t2, m.x1, m.y1, m.x2, m.y2), figAns: koPetaFig(t1, t2, m.x1, m.y1, m.x2, m.y2, true) });
};
KO.perimTiga = r => {
  let A, Bv, Cv, a, b, c; do { [a, b, c] = r.p(KOTRI6.concat([[5, 12, 13]])); if (r.f() < .5) [a, b] = [b, a]; const sx = koSg(r), sy = koSg(r); A = [r.i(-7, 7), r.i(-7, 7)]; Bv = [A[0] + sx * a, A[1]]; Cv = [Bv[0], A[1] + sy * b]; } while ([...Bv, ...Cv].some(v => Math.abs(v) > 8));
  const pts = koStr([['A', ...A], ['B', ...Bv], ['C', ...Cv]]), per = a + b + c, luas = a * b / 2;
  const work = [`AB = ${a} unit (mengufuk), BC = ${b} unit (mencancang)`, `AC = √(${a}² + ${b}²) = √${c * c} = ${c} unit`, `Perimeter = ${a} + ${b} + ${c} = ${per} unit`, `Luas = ½ × ${a} × ${b} = ${luas} unit²`];
  return GEN_LQ('perimTiga', { pts, per, luas, work }, { fig: koFig({ polys: [[[A, Bv, Cv], 'pa']], pts: [[A[0], A[1], `A${P(...A)}`, 'tx'], [Bv[0], Bv[1], `B${P(...Bv)}`, 'tx'], [Cv[0], Cv[1], `C${P(...Cv)}`, 'tx']], label: 'Segi tiga ABC' }) });
};
KO.samaKaki = r => {
  let Pp, Qp, Rp, a, b, c; do { [a, b, c] = r.p(KOTRI6.concat([[5, 12, 13]])); const x0 = r.i(-4, 4), y0 = r.i(-5, 5), sg = koSg(r); if (r.f() < .5) { Pp = [x0 - a, y0]; Qp = [x0 + a, y0]; Rp = [x0, y0 + sg * b]; } else { Pp = [y0, x0 - a]; Qp = [y0, x0 + a]; Rp = [y0 + sg * b, x0]; } } while ([...Pp, ...Qp, ...Rp].some(v => Math.abs(v) > 9));
  const pts = koStr([['P', ...Pp], ['Q', ...Qp], ['R', ...Rp]]), per = 2 * c + 2 * a;
  const work = koWJ('PR', Pp[0], Pp[1], Rp[0], Rp[1]).concat(koWJ('QR', Qp[0], Qp[1], Rp[0], Rp[1]), [`PQ = ${2 * a} unit`, `PR = QR, maka PQR ialah segi tiga sama kaki. Perimeter = ${c} + ${c} + ${2 * a} = ${per} unit`]);
  return GEN_LQ('samaKaki', { pts, c, per, work });
};
KO.bucuKeempat = r => {
  let A, Bv, Cv, Dv; do { A = [r.i(-7, 4), r.i(-7, 4)]; Bv = [A[0] + r.i(2, 7), A[1] + r.i(-2, 2)]; const v = [r.i(-3, 4), r.i(2, 6)]; Cv = [Bv[0] + v[0], Bv[1] + v[1]]; Dv = [A[0] + v[0], A[1] + v[1]]; } while ([...Bv, ...Cv, ...Dv].some(t => Math.abs(t) > 9));
  const M = [(A[0] + Cv[0]) / 2, (A[1] + Cv[1]) / 2], pts = koStr([['A', ...A], ['B', ...Bv], ['C', ...Cv]]), ans = `D${P(...Dv)}`;
  const work = [`Titik tengah AC = ((${fmt(A[0])} + ${par(Cv[0])})/2, (${fmt(A[1])} + ${par(Cv[1])})/2) = ${koP(...M)}`, 'Pepenjuru segi empat selari membahagi dua sama, jadi titik ini juga titik tengah BD.'].concat(koWH(Bv[0], Bv[1], M[0], M[1], 'D').slice(1));
  work[2] = `Katakan D(x, y): ${work[2]}`;
  return GEN_LQ('bucuKeempat', { pts, M: koP(...M), ans, work }, { fig: koFig({ pts: [[A[0], A[1], 'A', 'tx'], [Bv[0], Bv[1], 'B', 'tx'], [Cv[0], Cv[1], 'C', 'tx']], segs: [[A, Bv, 'pa', false, 3.5], [Bv, Cv, 'pa', false, 3.5]], label: 'Tiga bucu segi empat selari ABCD' }), figAns: koFig({ polys: [[[A, Bv, Cv, Dv], 'pa']], segs: [[A, Cv, 'mu', true, 2], [Bv, Dv, 'mu', true, 2]], pts: [[A[0], A[1], 'A', 'tx'], [Bv[0], Bv[1], 'B', 'tx'], [Cv[0], Cv[1], 'C', 'tx'], [Dv[0], Dv[1], `D${P(...Dv)}`, 'pk'], [M[0], M[1], '', 'gr']], label: 'Segi empat selari ABCD' }) });
};
KO.pusatBulatan = r => {
  const DI = [[6, 8], [8, 6], [0, 8], [6, 0], [0, 10], [10, 0], [0, 4], [4, 0]];
  let A, Bv, a, b; do { [a, b] = r.p(DI); a *= koSg(r); b *= koSg(r); A = [r.i(-7, 7), r.i(-7, 7)]; Bv = [A[0] + a, A[1] + b]; } while (Math.abs(Bv[0]) > 9 || Math.abs(Bv[1]) > 9);
  const d = Math.hypot(a, b), rr = d / 2, M = [(A[0] + Bv[0]) / 2, (A[1] + Bv[1]) / 2];
  const work = koWM(A[0], A[1], Bv[0], Bv[1]).map((w, i) => (i ? w : 'Pusat = titik tengah diameter = ((x₁ + x₂)/2, (y₁ + y₂)/2)')).concat([`Panjang diameter = √(${koPr(a)}² + ${koPr(b)}²) = √${d * d} = ${d} unit`, `Jejari = ${d} ÷ 2 = ${rr} unit`]);
  return GEN_LQ('pusatBulatan', { A: P(...A), B: P(...Bv), M: koP(...M), r: rr, ans: `Pusat ${koP(...M)}, jejari ${rr} unit`, work });
};
KO.k73 = r => {
  // (1) rombus
  let h; do { const [a, b, c] = r.p(KOTRI6), M = [r.i(-2, 2), r.i(-2, 2)]; h = { a, b, c, M, A: [M[0] - a, M[1]], B: [M[0], M[1] - b], C: [M[0] + a, M[1]], D: [M[0], M[1] + b] }; } while ([...h.A, ...h.B, ...h.C, ...h.D].some(v => Math.abs(v) > 9));
  // (2) sama kaki, cari k
  let s; do { const [a, b, c] = r.p(KOTRI6.concat([[5, 12, 13]])), x0 = r.i(-3, 3), y0 = r.i(-5, 2); s = { a, b, c, x0, y0, A: [x0 - a, y0], B: [x0 + a, y0], k: y0 + b }; } while (Math.abs(s.A[0]) > 9 || Math.abs(s.B[0]) > 9 || s.k > 10);
  // (3) perjalanan R → S → T
  let j; do { const [a, b, c] = r.p(KOTRI6), R = [r.i(-6, 0), r.i(-6, 0)], S = [R[0] + a, R[1] + b], e = r.p([2, 4, 6]), hor = r.f() < .5, T = hor ? [S[0] + e, S[1]] : [S[0], S[1] + e], sc = r.p([1, 2, 3]); j = { a, b, c, R, S, T, e, s: sc, dir: hor ? 'mengufuk' : 'mencancang', M: [(R[0] + S[0]) / 2, (R[1] + S[1]) / 2], tot: (c + e) * sc }; } while ([...j.S, ...j.T].some(v => Math.abs(v) > 9));
  // (4) pusat & satu hujung diameter
  let o; do { const C = [r.i(-3, 3), r.i(-3, 3)], [a, b, c] = r.p(KOTRI6), sw = r.f() < .5, A = [C[0] + koSg(r) * (sw ? b : a), C[1] + koSg(r) * (sw ? a : b)]; o = { C, A, B: [2 * C[0] - A[0], 2 * C[1] - A[1]], r: c }; } while ([...o.A, ...o.B].some(v => Math.abs(v) > 9));
  return GEN_LQ('k73', { h, s, j, o });
};

/* ---------- pecahan bertingkat & punca kuasa (25 Nov) ----------
   Penjana di atas menulis teks biasa: √(…), √n, (…)/d, a/b, ½. koFx menukarnya kepada fr()/rt()
   pada output akhir sahaja (logik dalaman yang membanding teks kekal teks biasa). Rajah SVG tidak disentuh. */
const koFx = s => {
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
const koFixQ = q => {
  if (typeof q === 'string') return koFx(q);
  if (Array.isArray(q)) return q.map(koFixQ);
  if (q && typeof q === 'object') Object.keys(q).forEach(k => { if (k === 'fig' || k === 'figAns') return; q[k] = koFixQ(q[k]); });
  return q;
};
Object.keys(KO).forEach(k => { const f = KO[k]; KO[k] = (...a) => koFixQ(f(...a)); });

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '7.1': {
    m: [() => KO.jarakLurus(koRG), () => KO.jarakRumus(koRG), () => KO.jarakRumus(koRG), () => KO.jarakRajah(koRG), () => KO.bs(koRG, KOBS1)],
    s: [() => KO.jarakDp(koRG), () => KO.cariKoordJ(koRG), () => KO.dekat(koRG)],
    k: [() => KO.k71(koRG)]
  },
  '7.2': {
    m: [() => KO.ttLurus(koRG), () => KO.ttRumus(koRG), () => KO.ttRumus(koRG), () => KO.ttRajah(koRG), () => KO.bs(koRG, KOBS2)],
    s: [() => KO.cariHujung(koRG), () => KO.cariHK(koRG), () => KO.ttDp(koRG)],
    k: [() => KO.k72(koRG)]
  },
  '7.3': {
    m: [() => KO.perimSE(koRG), () => KO.petaJarak(koRG), () => KO.petaTengah(koRG), () => KO.bs(koRG, KOBS3)],
    s: [() => KO.perimTiga(koRG), () => KO.samaKaki(koRG), () => KO.bucuKeempat(koRG), () => KO.pusatBulatan(koRG)],
    k: [() => KO.k73(koRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 7.1
WG.jarakLurus = i => KO.jarakLurus(koRW, i);
WG.jarakRumus = () => KO.jarakRumus(koRW);
WG.jarakRajah = () => KO.jarakRajah(koRW);
WG.bs1 = i => KO.bs(koRW, KOBS1, [0, 4][i % 2] + wri(0, 3));
WG.jarakDp = () => KO.jarakDp(koRW);
WG.cariKoordJ = i => KO.cariKoordJ(koRW, i);
WG.dekat = () => KO.dekat(koRW);
WG.k71 = () => KO.k71(koRW);
// 7.2
WG.ttLurus = i => KO.ttLurus(koRW, i);
WG.ttRumus = () => KO.ttRumus(koRW);
WG.ttRajah = () => KO.ttRajah(koRW);
WG.bs2 = i => KO.bs(koRW, KOBS2, [0, 4][i % 2] + wri(0, 3));
WG.cariHujung = () => KO.cariHujung(koRW);
WG.cariHK = () => KO.cariHK(koRW);
WG.ttDp = () => KO.ttDp(koRW);
WG.k72 = () => KO.k72(koRW);
// 7.3
WG.perimSE = () => KO.perimSE(koRW);
WG.petaJarak = () => KO.petaJarak(koRW);
WG.petaTengah = () => KO.petaTengah(koRW);
WG.bs3 = i => KO.bs(koRW, KOBS3, [[0, 1, 2, 3], [4, 5, 6], [7, 0, 1]][i % 3][wri(0, 2)]);
WG.perimTiga = () => KO.perimTiga(koRW);
WG.samaKaki = () => KO.samaKaki(koRW);
WG.bucuKeempat = () => KO.bucuKeempat(koRW);
WG.pusatBulatan = () => KO.pusatBulatan(koRW);
WG.k73 = () => KO.k73(koRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '7.1': [['m', 'jarakLurus', 5], ['m', 'jarakRumus', 7], ['m', 'jarakRajah', 4], ['m', 'bs1', 2], ['s', 'jarakDp', 3], ['s', 'cariKoordJ', 3], ['s', 'dekat', 3], ['k', 'k71', 3]],
  '7.2': [['m', 'ttLurus', 5], ['m', 'ttRumus', 7], ['m', 'ttRajah', 4], ['m', 'bs2', 2], ['s', 'cariHujung', 4], ['s', 'cariHK', 3], ['s', 'ttDp', 2], ['k', 'k72', 3]],
  '7.3': [['m', 'perimSE', 5], ['m', 'petaJarak', 5], ['m', 'petaTengah', 5], ['m', 'bs3', 3], ['s', 'perimTiga', 3], ['s', 'samaKaki', 2], ['s', 'bucuKeempat', 2], ['s', 'pusatBulatan', 2], ['k', 'k73', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// 4 pilihan unik: jawapan + calon kesilapan biasa, kemudian isian automatik
function koOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || /NaN|undefined/.test(c)) continue; if (!seen.has(c)) { seen.add(c); w.push(c); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const koKs = k => (k % 2 ? 1 : -1) * Math.ceil(k / 2);
const koMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const koU = v => `${v} unit`;
const CQGEN = {
  jarak: [
    () => {
      const hor = Math.random() < .5; let a, b; do { a = ri(-5, 5); b = ri(-5, 5); } while (Math.abs(a - b) < 2);
      const c0 = ri(-5, 5), [x1, y1, x2, y2] = hor ? [a, c0, b, c0] : [c0, a, c0, b], d = Math.abs(b - a);
      return koMcq(`Berapakah jarak antara A${P(x1, y1)} dan B${P(x2, y2)}?`, koGFig([[x1, y1, 'am', 'A'], [x2, y2, 'pk', 'B']], [[[x1, y1], [x2, y2], 'am']]), koOpts(koU(d), [koU(Math.abs(Math.abs(a) - Math.abs(b))), koU(Math.abs(a + b)), koU(d + 1), koU(d * 2)].filter(s => s !== '0 unit'), k => koU(Math.max(1, d + koKs(k)))));
    },
    () => {
      const t = koPy(koRG, 5, KOTRI6), ad = Math.abs(t.dx), ay = Math.abs(t.dy);
      return koMcq(`Cari jarak antara A${P(t.x1, t.y1)} dan B${P(t.x2, t.y2)}.`, koGFig([[t.x1, t.y1, 'am', 'A'], [t.x2, t.y2, 'pk', 'B']], [[[t.x1, t.y1], [t.x2, t.y2], 'am']]), koOpts(koU(t.d), [koU(ad + ay), koU(`√${Math.abs(ad * ad - ay * ay)}`), koU(Math.abs(ad - ay) || t.d + 2), koU(t.d * t.d)], k => koU(t.d + koKs(k))), koGLegs(t.x1, t.y1, t.x2, t.y2));
    },
    () => {
      if (Math.random() < .5) {
        let x1, y1, x2, y2, s; do { x1 = ri(-5, 5); y1 = ri(-5, 5); x2 = ri(-5, 5); y2 = ri(-5, 5); s = (x2 - x1) ** 2 + (y2 - y1) ** 2; } while (x1 === x2 || y1 === y2 || koSq(s)[0] !== '√');
        const ad = Math.abs(x2 - x1), ay = Math.abs(y2 - y1), v = Math.sqrt(s);
        return koMcq(`Jarak antara P${P(x1, y1)} dan Q${P(x2, y2)}, betul kepada dua tempat perpuluhan, ialah`, koGFig([[x1, y1, 'am', 'P'], [x2, y2, 'pk', 'Q']], [[[x1, y1], [x2, y2], 'am']]), koOpts(ko2(v), [ko2(ad + ay), ko2(Math.sqrt(Math.abs(ad * ad - ay * ay))), ko2(s / 2), ko2(v + 1)], k => ko2(v + koKs(k) * .5)), koGLegs(x1, y1, x2, y2));
      }
      const t = koPy(koRG, 5, KOTRI6), up = t.y2 > t.y1;
      return koMcq(`Jarak antara A(${fmt(t.x1)}, k) dan B${P(t.x2, t.y2)} ialah ${t.d} unit dan k ${up ? '<' : '>'} ${fmt(t.y2)}. Cari nilai k.`, koGFig([[t.x2, t.y2, 'pk', 'B']], [[[t.x1, -KOR], [t.x1, KOR], 'mu', true]]), koOpts(`k = ${fmt(t.y1)}`, [`k = ${fmt(2 * t.y2 - t.y1)}`, `k = ${fmt(t.y2 + t.d)}`, `k = ${fmt(t.y2 - t.d)}`, `k = ${fmt(t.dy)}`], k => `k = ${fmt(t.y1 + koKs(k))}`), gPt(t.x1, t.y1, 'gr', 'A') + koGLegs(t.x1, t.y1, t.x2, t.y2));
    }
  ],
  tengah: [
    () => {
      const hor = Math.random() < .5; let a, b; do { a = ri(-5, 5); b = ri(-5, 5); } while ((a + b) % 2 || Math.abs(a - b) < 2);
      const c0 = ri(-5, 5), [x1, y1, x2, y2] = hor ? [a, c0, b, c0] : [c0, a, c0, b], m = (a + b) / 2, ans = hor ? P(m, c0) : P(c0, m);
      return koMcq(`Apakah titik tengah bagi A${P(x1, y1)} dan B${P(x2, y2)}?`, koGFig([[x1, y1, 'am', 'A'], [x2, y2, 'pk', 'B']], [[[x1, y1], [x2, y2], 'am']]), koOpts(ans, [hor ? P(a + b, c0) : P(c0, a + b), hor ? P((b - a) / 2, c0) : P(c0, (b - a) / 2), hor ? P(c0, m) : P(m, c0)], k => (hor ? P(m + koKs(k), c0) : P(c0, m + koKs(k)))), gPt(hor ? m : c0, hor ? c0 : m, 'gr'));
    },
    () => {
      const t = koMidPts(koRG, 5, 'even'), ans = koP(t.mx, t.my);
      return koMcq('Berdasarkan rajah, apakah koordinat titik tengah AB?', koGFig([[t.x1, t.y1, 'am', 'A'], [t.x2, t.y2, 'pk', 'B']], [[[t.x1, t.y1], [t.x2, t.y2], 'am']]), koOpts(ans, [koP(t.x1 + t.x2, t.y1 + t.y2), koP((t.x2 - t.x1) / 2, (t.y2 - t.y1) / 2), koP(t.my, t.mx)], k => koP(t.mx + koKs(k), t.my)), gPt(t.mx, t.my, 'gr', 'M'));
    },
    () => {
      const t = koMidPts(koRG, 8, Math.random() < .5 ? 'odd' : 'even'), ans = koP(t.mx, t.my);
      const fig = koIn(t.x1, t.y1, t.x2, t.y2) ? koGFig([[t.x1, t.y1, 'am', 'P'], [t.x2, t.y2, 'pk', 'Q']], [[[t.x1, t.y1], [t.x2, t.y2], 'am']]) : koGFig([], []);
      return koMcq(`Cari titik tengah bagi P${P(t.x1, t.y1)} dan Q${P(t.x2, t.y2)}.`, fig, koOpts(ans, [koP(t.x1 + t.x2, t.y1 + t.y2), koP((t.x2 - t.x1) / 2, (t.y2 - t.y1) / 2), koP(t.my, t.mx), koP((t.x1 - t.x2) / 2, (t.y1 - t.y2) / 2)], k => koP(t.mx, t.my + koKs(k))), koIn(t.mx, t.my) ? gPt(t.mx, t.my, 'gr', Number.isInteger(t.mx) && Number.isInteger(t.my) ? 'M' : '') : '');
    }
  ],
  hujung: [
    () => {
      let x1, y1, mx, my, x2, y2; do { x1 = ri(-5, 5); y1 = ri(-5, 5); mx = ri(-3, 3); my = ri(-3, 3); x2 = 2 * mx - x1; y2 = 2 * my - y1; } while (!koIn(x2, y2) || (x1 === mx && y1 === my));
      return koMcq(`M${P(mx, my)} ialah titik tengah AB dan A${P(x1, y1)}. Cari koordinat B.`, koGFig([[x1, y1, 'am', 'A'], [mx, my, 'gr', 'M']], [[[x1, y1], [mx, my], 'am']]), koOpts(P(x2, y2), [koP((x1 + mx) / 2, (y1 + my) / 2), P(mx - x1, my - y1), P(x1 + mx, y1 + my), P(-x2, -y2)], k => P(x2 + koKs(k), y2)), gPt(x2, y2, 'pk', 'B') + gLine([mx, my], [x2, y2], 'am', .1, true));
    },
    () => {
      let xA, yA, xB, yB; do { xA = ri(-7, 7); yA = ri(-7, 7); xB = ri(-7, 7); yB = ri(-7, 7); } while ((xA + xB) % 2 || (yA + yB) % 2 || xA === xB || yA === yB);
      const mx = (xA + xB) / 2, my = (yA + yB) / 2, ans = `h = ${fmt(xA)}, k = ${fmt(yB)}`;
      return koMcq(`Titik tengah bagi A(h, ${fmt(yA)}) dan B(${fmt(xB)}, k) ialah ${P(mx, my)}. Cari h dan k.`, koGFig([], []), koOpts(ans, [`h = ${fmt(mx - xB)}, k = ${fmt(my - yA)}`, `h = ${fmt(2 * mx + xB)}, k = ${fmt(2 * my + yA)}`, `h = ${fmt(yB)}, k = ${fmt(xA)}`, `h = ${koN((mx + xB) / 2)}, k = ${koN((my + yA) / 2)}`], k => `h = ${fmt(xA + koKs(k))}, k = ${fmt(yB)}`), koIn(xA, yA, xB, yB) ? gPt(xA, yA, 'am', 'A') + gPt(xB, yB, 'pk', 'B') + gPt(mx, my, 'gr') : '');
    },
    () => {
      let A, Bv, Cv, Dv; do { A = [ri(-5, 1), ri(-5, 0)]; Bv = [A[0] + ri(2, 5), A[1] + ri(-1, 1)]; const v = [ri(-2, 3), ri(2, 5)]; Cv = [Bv[0] + v[0], Bv[1] + v[1]]; Dv = [A[0] + v[0], A[1] + v[1]]; } while (!koIn(...Bv, ...Cv, ...Dv));
      return koMcq(`ABCD ialah segi empat selari dengan A${P(...A)}, B${P(...Bv)} dan C${P(...Cv)}. Cari koordinat D.`, koGFig([[A[0], A[1], 'tx', 'A'], [Bv[0], Bv[1], 'tx', 'B'], [Cv[0], Cv[1], 'tx', 'C']], [[A, Bv, 'pa'], [Bv, Cv, 'pa']]), koOpts(P(...Dv), [P(Bv[0] + Cv[0] - A[0], Bv[1] + Cv[1] - A[1]), P(A[0] + Bv[0] - Cv[0], A[1] + Bv[1] - Cv[1]), koP((A[0] + Cv[0]) / 2, (A[1] + Cv[1]) / 2)], k => P(Dv[0] + koKs(k), Dv[1])), gPt(Dv[0], Dv[1], 'pk', 'D') + gLine(Cv, Dv, 'pa', .1, true) + gLine(Dv, A, 'pa', .1, true));
    }
  ],
  masalah: [
    () => {
      let x1, y1, w, h; do { x1 = ri(-5, 1); y1 = ri(-5, 1); w = ri(2, 6); h = ri(2, 5); } while (w === h || !koIn(x1 + w, y1 + h));
      const V = [[x1, y1], [x1 + w, y1], [x1 + w, y1 + h], [x1, y1 + h]], per = Math.random() < .5;
      return koMcq(`Berapakah ${per ? 'perimeter' : 'luas'} segi empat tepat ABCD?`, koGFig(V.map((p, i) => [p[0], p[1], 'tx', 'ABCD'[i]]), [], 'Segi empat tepat ABCD', [[V, 'pa']]), per ? koOpts(koU(2 * (w + h)), [koU(w + h), koU(w * h), koU(4 * w)], k => koU(2 * (w + h) + 2 * koKs(k))) : koOpts(`${w * h} unit²`, [`${2 * (w + h)} unit²`, `${w + h} unit²`, `${(w + 1) * (h + 1)} unit²`], k => `${w * h + koKs(k)} unit²`));
    },
    () => {
      let A, Bv, Cv, a, b, c; do { [a, b, c] = pick(KOTRI6); if (Math.random() < .5) [a, b] = [b, a]; A = [ri(-5, 5), ri(-5, 5)]; Bv = [A[0] + (Math.random() < .5 ? -a : a), A[1]]; Cv = [Bv[0], A[1] + (Math.random() < .5 ? -b : b)]; } while (!koIn(...Bv, ...Cv));
      return koMcq('Berapakah perimeter segi tiga ABC?', koGFig([[A[0], A[1], 'tx', 'A'], [Bv[0], Bv[1], 'tx', 'B'], [Cv[0], Cv[1], 'tx', 'C']], [], 'Segi tiga ABC', [[[A, Bv, Cv], 'pa']]), koOpts(koU(a + b + c), [koU(a + b), koU(2 * (a + b)), koU(a * b / 2), koU(a + b + a + b)], k => koU(a + b + c + koKs(k))));
    },
    () => {
      if (Math.random() < .5) {
        const DI = [[6, 8], [8, 6], [0, 8], [6, 0], [0, 10], [10, 0], [0, 4], [4, 0]];
        let A, Bv, a, b; do { [a, b] = pick(DI); a *= Math.random() < .5 ? -1 : 1; b *= Math.random() < .5 ? -1 : 1; A = [ri(-5, 5), ri(-5, 5)]; Bv = [A[0] + a, A[1] + b]; } while (!koIn(...Bv));
        const d = Math.hypot(a, b), M = [(A[0] + Bv[0]) / 2, (A[1] + Bv[1]) / 2], ans = `Pusat ${koP(...M)}, jejari ${d / 2}`;
        return koMcq(`AB ialah diameter sebuah bulatan, dengan A${P(...A)} dan B${P(...Bv)}. Nyatakan pusat dan jejarinya.`, koGFig([[A[0], A[1], 'am', 'A'], [Bv[0], Bv[1], 'pk', 'B']], [[A, Bv, 'am']]), koOpts(ans, [`Pusat ${koP(...M)}, jejari ${d}`, `Pusat ${koP(a / 2, b / 2)}, jejari ${d / 2}`, `Pusat ${koP(A[0] + Bv[0], A[1] + Bv[1])}, jejari ${d}`], k => `Pusat ${koP(M[0] + koKs(k), M[1])}, jejari ${d / 2}`), gPt(M[0], M[1], 'gr', 'O'));
      }
      const [a, b, c] = pick(KOTRI6.concat([[5, 12, 13]])), x0 = ri(-2, 2), y0 = ri(-6, 0), Pp = [x0 - a, y0], Qp = [x0 + a, y0], Rp = [x0, y0 + b];
      return koMcq(`Segi tiga PQR dengan P${P(...Pp)}, Q${P(...Qp)} dan R${P(...Rp)}. Berapakah panjang PR?`, koGFig(koIn(...Pp, ...Qp, ...Rp) ? [[Pp[0], Pp[1], 'tx', 'P'], [Qp[0], Qp[1], 'tx', 'Q'], [Rp[0], Rp[1], 'tx', 'R']] : [], [], 'Segi tiga PQR', koIn(...Pp, ...Qp, ...Rp) ? [[[Pp, Qp, Rp], 'pu']] : []), koOpts(koU(c), [koU(a + b), koU(2 * a), koU(b), koU(2 * c)], k => koU(c + koKs(k))));
    }
  ]
};
Object.keys(CQGEN).forEach(t => { CQGEN[t] = CQGEN[t].map(f => (...a) => koFixQ(f(...a))); });
const CQT = { jarak: 'Jarak dua titik', tengah: 'Titik tengah', hujung: 'Titik hujung', masalah: 'Bentuk & peta' };
function koCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.jarak;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['jarak', 'jarak', 'tengah', 'tengah', 'masalah'] : Object.keys(CQT);
  return koCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return koCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
