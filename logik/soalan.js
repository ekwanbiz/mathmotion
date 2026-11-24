'use strict';
/* =================== LOGIK · SOALAN BAB 3 PENAAKULAN LOGIK (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "lg" / "LG" supaya tidak bertembung dengan teras.

/* =================== pembantu =================== */
// rawak: lgRG untuk Latihan Kelas / games, lgRW (berbenih) untuk Lembaran Kerja
const lgRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const lgRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const lgShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const lgBP = v => (v ? 'Benar' : 'Palsu');
const lgB1 = v => (v ? 'B' : 'P');
// huruf kecil/besar pada perkataan pertama sahaja; nama khas, label (PQRS) dan pemboleh ubah (x) tidak diubah
const LGNAMA = ['Amir', 'Siti', 'Mei', 'Ravi', 'Aisyah', 'Daniel', 'Aina', 'Kuala', 'Malaysia', 'Pak', 'Kelantan'];
const lgW1 = s => (s.match(/^[^\s,.]+/) || [''])[0];
const lgLow = s => { const w = lgW1(s); return /^[A-Z][a-z]+$/.test(w) && !LGNAMA.includes(w) ? s.charAt(0).toLowerCase() + s.slice(1) : s; };
const lgCap = s => (/^[a-z][a-z]+$/.test(lgW1(s)) ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const lgSup = n => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');
const lgPr = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const lgPm = c => (c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`);   // " + c" / " − c"
const lgDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);

/* =================== pernyataan mudah (nilai kebenaran dikira) =================== */
const LGGEO = [
  ['Segi tiga mempunyai tiga sisi', 'Segi tiga tidak mempunyai tiga sisi', true, 'Setiap segi tiga mempunyai tepat tiga sisi.'],
  ['Pentagon mempunyai enam sisi', 'Pentagon tidak mempunyai enam sisi', false, 'Pentagon mempunyai lima sisi.'],
  ['Segi empat sama mempunyai empat paksi simetri', 'Segi empat sama tidak mempunyai empat paksi simetri', true, 'Dua pepenjuru dan dua garis tengah ialah paksi simetri segi empat sama.'],
  ['Hasil tambah sudut pedalaman segi tiga ialah 180°', 'Hasil tambah sudut pedalaman segi tiga bukan 180°', true, 'Hasil tambah tiga sudut pedalaman segi tiga ialah 180°.'],
  ['Kubus mempunyai lapan muka', 'Kubus tidak mempunyai lapan muka', false, 'Kubus mempunyai enam muka (dan lapan bucu).'],
  ['Heksagon mempunyai enam bucu', 'Heksagon tidak mempunyai enam bucu', true, 'Heksagon mempunyai enam sisi dan enam bucu.'],
  ['Sudut tegak ialah 90°', 'Sudut tegak bukan 90°', true, 'Sudut tegak ialah sudut 90°.'],
  ['Kon mempunyai dua bucu', 'Kon tidak mempunyai dua bucu', false, 'Kon mempunyai satu bucu sahaja.'],
  ['Oktagon mempunyai lapan sisi', 'Oktagon tidak mempunyai lapan sisi', true, 'Oktagon ialah poligon lapan sisi.'],
  ['Silinder mempunyai tiga muka rata', 'Silinder tidak mempunyai tiga muka rata', false, 'Silinder mempunyai dua muka rata (dan satu permukaan melengkung).'],
  ['Sudut refleks lebih kecil daripada 90°', 'Sudut refleks tidak lebih kecil daripada 90°', false, 'Sudut refleks lebih besar daripada 180° dan kurang daripada 360°.'],
  ['Hasil tambah sudut pedalaman sisi empat ialah 360°', 'Hasil tambah sudut pedalaman sisi empat bukan 360°', true, '(4 − 2) × 180° = 360°.']
];
const LGKINDS = ['perdana', 'genap', 'faktor', 'gandaan', 'kuasa2', 'banding', 'kuasa', 'punca', 'geo'];
function lgSt(r, kind, want) {
  kind = kind || r.p(LGKINDS);
  for (let t = 0; t < 60; t++) {
    const o = lgSt1(r, kind);
    if (want == null || o.v === want) return o;
  }
  return lgSt1(r, kind);
}
function lgSt1(r, kind) {
  if (kind === 'perdana') {
    const n = r.i(2, 49), v = lgPr(n); let d = 2; while (!v && n % d) d++;
    return { s: `${n} ialah nombor perdana`, ns: `${n} bukan nombor perdana`, v, why: v ? `${n} hanya mempunyai dua faktor, iaitu 1 dan ${n}.` : `${n} = ${d} × ${n / d}, jadi ${n} mempunyai faktor selain 1 dan ${n}.` };
  }
  if (kind === 'genap') {
    const n = r.i(11, 99), v = n % 2 === 0;
    return { s: `${n} ialah nombor genap`, ns: `${n} bukan nombor genap`, v, why: v ? `${n} ÷ 2 = ${n / 2}` : `${n} ÷ 2 = ${Math.floor(n / 2)} baki 1` };
  }
  if (kind === 'faktor' || kind === 'gandaan') {
    const a = r.i(3, 12), b = a * r.i(2, 9) + (r.f() < .5 ? 0 : r.i(1, a - 1)), v = b % a === 0;
    const why = v ? `${b} ÷ ${a} = ${b / a}` : `${b} ÷ ${a} = ${Math.floor(b / a)} baki ${b % a}`;
    if (kind === 'faktor') return { s: `${a} ialah faktor bagi ${b}`, ns: `${a} bukan faktor bagi ${b}`, v, why };
    return { s: `${b} ialah gandaan ${a}`, ns: `${b} bukan gandaan ${a}`, v, why };
  }
  if (kind === 'kuasa2') {
    const k = r.i(3, 12), n = r.f() < .5 ? k * k : k * k + r.i(1, 2 * k), v = Number.isInteger(Math.sqrt(n));
    return { s: `${n} ialah nombor kuasa dua sempurna`, ns: `${n} bukan nombor kuasa dua sempurna`, v, why: v ? `${k}² = ${n}` : `${k}² = ${k * k} dan ${k + 1}² = ${(k + 1) * (k + 1)}, tiada integer yang kuasa duanya ${n}.` };
  }
  if (kind === 'banding') {
    let a, b; do { a = r.i(-12, 12); b = r.i(-12, 12); } while (a === b || (a >= 0 && b >= 0));
    const v = a > b;
    return { s: `${fmt(a)} lebih besar daripada ${fmt(b)}`, ns: `${fmt(a)} tidak lebih besar daripada ${fmt(b)}`, v, why: `Pada garis nombor, ${fmt(a)} berada di sebelah ${v ? 'kanan' : 'kiri'} ${fmt(b)}.` };
  }
  if (kind === 'kuasa') {
    const a = r.i(2, 6), e = a > 4 ? 2 : r.p([2, 3]), t = Math.pow(a, e), c = r.f() < .5 ? t : r.p([a * e, t + a, t - 1, t + 1]), v = c === t;
    return { s: `${a}${lgSup(e)} = ${c}`, ns: `${a}${lgSup(e)} ≠ ${c}`, v, why: `${a}${lgSup(e)} = ${Array(e).fill(a).join(' × ')} = ${t}` };
  }
  if (kind === 'punca') {
    const k = r.i(2, 13), n = k * k, c = r.f() < .5 ? k : r.p([2 * k, k + 1, n / 2 | 0]), v = c === k;
    return { s: `√${n} = ${c}`, ns: `√${n} ≠ ${c}`, v, why: `${k} × ${k} = ${n}, maka √${n} = ${k}.` };
  }
  const [s, ns, v, why] = r.p(LGGEO);
  return { s, ns, v, why };
}
function lgSt2(r, va, vb) {   // dua pernyataan berbeza jenis
  const [ka, kb] = lgShuf(r, LGKINDS).slice(0, 2);
  return [lgSt(r, ka, va), lgSt(r, kb, vb)];
}

/* bukan pernyataan */
const LGNOT = [
  ['Adakah 15 nombor ganjil?', 'soalan'], ['Selesaikan 2x + 3 = 9.', 'arahan'], ['Lukis sebuah segi tiga sama sisi.', 'arahan'],
  ['Wah, cantiknya corak itu!', 'seruan'], ['x + 5 = 12', 'nilai kebenarannya bergantung pada nilai x'], ['2y lebih besar daripada 10', 'nilai kebenarannya bergantung pada nilai y'],
  ['Berapakah nilai 3²?', 'soalan'], ['Kira luas segi empat tepat itu.', 'arahan'], ['k ialah nombor perdana', 'nilai kebenarannya bergantung pada nilai k'],
  ['Tolong tutup tingkap itu.', 'arahan'], ['Alangkah sukarnya soalan ini!', 'seruan'], ['Adakah segi empat sama mempunyai empat sisi?', 'soalan'],
  ['3m − 1 = 8', 'nilai kebenarannya bergantung pada nilai m'], ['Senaraikan semua faktor bagi 12.', 'arahan'], ['p² ialah nombor genap', 'nilai kebenarannya bergantung pada nilai p']
];
/* pengkuantiti: [pernyataan, nilai, sebab, pembetulan (atau '')] */
const LGQ = [
  ['Semua segi empat sama ialah segi empat tepat', true, 'Setiap segi empat sama mempunyai empat sudut tegak.', ''],
  ['Semua segi empat tepat ialah segi empat sama', false, 'Segi empat tepat 2 cm × 5 cm bukan segi empat sama.', 'Sebilangan segi empat tepat ialah segi empat sama'],
  ['Sebilangan segi empat tepat ialah segi empat sama', true, 'Segi empat tepat 3 cm × 3 cm ialah segi empat sama, tetapi 2 cm × 5 cm bukan.', ''],
  ['Semua gandaan 10 ialah gandaan 5', true, '10 = 2 × 5, maka setiap gandaan 10 juga gandaan 5.', ''],
  ['Semua gandaan 5 ialah gandaan 10', false, '15 ialah gandaan 5 tetapi bukan gandaan 10.', 'Sebilangan gandaan 5 ialah gandaan 10'],
  ['Semua nombor perdana ialah nombor ganjil', false, '2 ialah nombor perdana tetapi genap.', ''],
  ['Sebilangan nombor ganjil ialah nombor perdana', true, '3 ialah nombor ganjil dan perdana, tetapi 9 ialah nombor ganjil yang bukan perdana.', ''],
  ['Semua nombor ganjil ialah nombor perdana', false, '9 ialah nombor ganjil tetapi 9 = 3 × 3 bukan nombor perdana.', 'Sebilangan nombor ganjil ialah nombor perdana'],
  ['Semua segi tiga mempunyai satu sudut tegak', false, 'Segi tiga sama sisi mempunyai tiga sudut 60°.', 'Sebilangan segi tiga mempunyai satu sudut tegak'],
  ['Semua nombor genap ialah gandaan 4', false, '6 ialah nombor genap tetapi bukan gandaan 4.', 'Sebilangan nombor genap ialah gandaan 4'],
  ['Sebilangan nombor genap ialah gandaan 4', true, '8 ialah gandaan 4 tetapi 6 bukan.', ''],
  ['Semua faktor bagi 6 ialah faktor bagi 12', true, 'Faktor bagi 6 (1, 2, 3, 6) semuanya membahagi tepat 12.', ''],
  ['Semua faktor bagi 12 ialah faktor bagi 6', false, '4 ialah faktor bagi 12 tetapi bukan faktor bagi 6.', 'Sebilangan faktor bagi 12 ialah faktor bagi 6'],
  ['Semua heksagon mempunyai enam sisi', true, 'Heksagon ialah poligon enam sisi.', ''],
  ['Sebilangan pentagon mempunyai enam sisi', false, 'Setiap pentagon mempunyai lima sisi; tiada pentagon dengan enam sisi.', ''],
  ['Semua kuasa dua sempurna ialah nombor genap', false, '9 = 3² ialah kuasa dua sempurna tetapi ganjil.', 'Sebilangan kuasa dua sempurna ialah nombor genap']
];

/* =================== implikasi (nilai: [implikasi, akas, songsangan, kontrapositif]) =================== */
const LGIMN = ['implikasi', 'akas', 'songsangan', 'kontrapositif'];
const LGIMK = [['p', 'q'], ['q', 'p'], ['np', 'nq'], ['nq', 'np']];
function lgImp(r, t) {
  t = t == null ? r.i(0, 8) : t;
  if (t === 0) { const k = r.i(2, 9); return { p: `x = ${k}`, np: `x ≠ ${k}`, q: `x² = ${k * k}`, nq: `x² ≠ ${k * k}`, v: [1, 0, 0, 1], ce: ['', `x = −${k}: x² = ${k * k} tetapi x ≠ ${k}`, `x = −${k}: x ≠ ${k} tetapi x² = ${k * k}`, ''] }; }
  if (t === 1) { const a = r.p([2, 3, 4, 5]), m = r.p([2, 3]), A = a * m; return { p: `n ialah gandaan ${A}`, np: `n bukan gandaan ${A}`, q: `n ialah gandaan ${a}`, nq: `n bukan gandaan ${a}`, v: [1, 0, 0, 1], ce: ['', `n = ${a}: gandaan ${a} tetapi bukan gandaan ${A}`, `n = ${a}: bukan gandaan ${A} tetapi gandaan ${a}`, ''] }; }
  if (t === 2) { const b = r.i(0, 6), a = b + r.i(2, 5); return { p: `x > ${a}`, np: `x ≤ ${a}`, q: `x > ${b}`, nq: `x ≤ ${b}`, v: [1, 0, 0, 1], ce: ['', `x = ${b + 1}: ${b + 1} > ${b} tetapi ${b + 1} ≤ ${a}`, `x = ${b + 1}: ${b + 1} ≤ ${a} tetapi ${b + 1} > ${b}`, ''] }; }
  if (t === 3) { const M = r.p([4, 6, 8, 9, 10]), k = r.p([2, 3]); return { p: `y ialah faktor bagi ${M}`, np: `y bukan faktor bagi ${M}`, q: `y ialah faktor bagi ${k * M}`, nq: `y bukan faktor bagi ${k * M}`, v: [1, 0, 0, 1], ce: ['', `y = ${k * M}: faktor bagi ${k * M} tetapi bukan faktor bagi ${M}`, `y = ${k * M}: bukan faktor bagi ${M} tetapi faktor bagi ${k * M}`, ''] }; }
  if (t === 4) { const a = r.i(2, 6), b = r.i(2, 9); return { p: `${a}x = ${a * b}`, np: `${a}x ≠ ${a * b}`, q: `x = ${b}`, nq: `x ≠ ${b}`, v: [1, 1, 1, 1], ce: ['', '', '', ''] }; }
  if (t === 5) { const a = r.i(2, 9), c = r.i(1, 12); return { p: `x + ${a} = ${a + c}`, np: `x + ${a} ≠ ${a + c}`, q: `x = ${c}`, nq: `x ≠ ${c}`, v: [1, 1, 1, 1], ce: ['', '', '', ''] }; }
  if (t === 6) { const k = r.i(2, 9); return { p: `x² = ${k * k}`, np: `x² ≠ ${k * k}`, q: `x = ${k}`, nq: `x ≠ ${k}`, v: [0, 1, 1, 0], ce: [`x = −${k}: x² = ${k * k} tetapi x ≠ ${k}`, '', '', `x = −${k}: x ≠ ${k} tetapi x² = ${k * k}`] }; }
  if (t === 7) return r.p([
    { p: 'ABCD ialah segi empat sama', np: 'ABCD bukan segi empat sama', q: 'ABCD mempunyai empat sisi yang sama panjang', nq: 'ABCD tidak mempunyai empat sisi yang sama panjang', v: [1, 0, 0, 1], ce: ['', 'rombus bersudut 60° dan 120° mempunyai empat sisi sama panjang tetapi bukan segi empat sama', 'rombus bersudut 60° dan 120° bukan segi empat sama tetapi empat sisinya sama panjang', ''] },
    { p: 'PQR ialah segi tiga sama sisi', np: 'PQR bukan segi tiga sama sisi', q: 'setiap sudut pedalaman PQR ialah 60°', nq: 'bukan setiap sudut pedalaman PQR ialah 60°', v: [1, 1, 1, 1], ce: ['', '', '', ''] },
    { p: 'sebuah poligon ialah heksagon', np: 'sebuah poligon bukan heksagon', q: 'poligon itu mempunyai enam sisi', nq: 'poligon itu tidak mempunyai enam sisi', v: [1, 1, 1, 1], ce: ['', '', '', ''] }]);
  return { p: 'n ialah nombor perdana', np: 'n bukan nombor perdana', q: 'n ialah nombor ganjil', nq: 'n bukan nombor ganjil', v: [0, 0, 0, 0], ce: ['n = 2: nombor perdana tetapi bukan ganjil', 'n = 9: ganjil tetapi bukan perdana', 'n = 9: bukan perdana tetapi ganjil', 'n = 2: bukan ganjil tetapi perdana'] };
}
const lgImpTxt = (I, j) => `Jika ${I[LGIMK[j][0]]}, maka ${I[LGIMK[j][1]]}`;

/* contoh penyangkal: [pernyataan, jawapan, kerja] */
function lgCe(r, t) {
  t = t == null ? r.i(0, 6) : t;
  if (t === 0) return ['Semua nombor perdana ialah nombor ganjil.', '2', ['2 ialah nombor perdana (faktornya 1 dan 2 sahaja).', '2 ialah nombor genap, bukan ganjil.', 'Maka pernyataan itu palsu.']];
  if (t === 1) { const a = r.p([2, 3, 4, 5, 6]), m = r.p([2, 3]); return [`Semua gandaan ${a} ialah gandaan ${a * m}.`, `${a * (m + 1)} (gandaan ${a} tetapi bukan gandaan ${a * m})`, [`${a * (m + 1)} = ${a} × ${m + 1}, maka ${a * (m + 1)} gandaan ${a}.`, `${a * (m + 1)} ÷ ${a * m} bukan nombor bulat, maka ${a * (m + 1)} bukan gandaan ${a * m}.`, `Jawapan lain yang diterima: ${a}, ${a * (2 * m + 1)}, ...`]]; }
  if (t === 2) { const k = r.i(2, 9); return [`Jika x² = ${k * k}, maka x = ${k}.`, `x = −${k}`, [`(−${k})² = ${k * k}, maka antejadian benar.`, `Tetapi −${k} ≠ ${k}, maka akibat palsu.`]]; }
  if (t === 3) { const b = r.i(1, 6), a = b + r.i(2, 4); return [`Jika x > ${b}, maka x > ${a}.`, `x = ${b + 1}`, [`${b + 1} > ${b}, maka antejadian benar.`, `${b + 1} ≤ ${a}, maka akibat palsu.`, `Jawapan lain yang diterima: sebarang x dengan ${b} < x ≤ ${a}.`]]; }
  if (t === 4) { const M = r.p([4, 6, 9, 10]), k = r.p([2, 3]); return [`Semua faktor bagi ${k * M} ialah faktor bagi ${M}.`, `${k * M}`, [`${k * M} ialah faktor bagi ${k * M}.`, `${k * M} > ${M}, maka ${k * M} bukan faktor bagi ${M}.`]]; }
  if (t === 5) return ['Jika n ialah nombor genap, maka n ialah gandaan 4.', 'n = 6', ['6 ialah nombor genap, maka antejadian benar.', '6 ÷ 4 = 1 baki 2, maka 6 bukan gandaan 4.', 'Jawapan lain yang diterima: 2, 10, 14, ...']];
  return r.p([['Semua nombor ganjil ialah nombor perdana.', '9', ['9 ialah nombor ganjil.', '9 = 3 × 3, maka 9 bukan nombor perdana.', 'Jawapan lain yang diterima: 15, 21, 25, ...']],
    ['Semua segi empat tepat ialah segi empat sama.', 'segi empat tepat 2 cm × 5 cm', ['Segi empat tepat 2 cm × 5 cm mempunyai empat sudut tegak.', 'Sisinya tidak sama panjang, maka bukan segi empat sama.']],
    ['Jika x ialah nombor bulat, maka x² > x.', 'x = 1 (atau x = 0)', ['1² = 1, dan 1 tidak lebih besar daripada 1.', 'Maka akibat palsu walaupun antejadian benar.']]]);
}

/* =================== hujah deduktif =================== */
const LGPOLI = [[5, 'pentagon'], [6, 'heksagon'], [7, 'heptagon'], [8, 'oktagon'], [9, 'nonagon'], [10, 'dekagon']];
// Bentuk I: { p1, p2, k, A } (Semua A ...)
function lgFormI(r) {
  const t = r.i(0, 4);
  if (t === 0) { const a = r.p([2, 3, 4, 5]), m = r.p([2, 3, 5]), C = a * m * r.i(2, 9); return { p1: `Semua gandaan ${a * m} ialah gandaan ${a}.`, p2: `${C} ialah gandaan ${a * m}.`, k: `${C} ialah gandaan ${a}.`, nb: `${C} bukan gandaan ${a}.`, na: `${C} bukan gandaan ${a * m}.` }; }
  if (t === 1) { const [n, nm] = r.p(LGPOLI), o = 'ABCDEFGHIJ'.slice(0, n); return { p1: `Semua ${nm} mempunyai ${n} sisi.`, p2: `${o} ialah ${nm}.`, k: `${o} mempunyai ${n} sisi.`, nb: `${o} tidak mempunyai ${n} sisi.`, na: `${o} bukan ${nm}.` }; }
  if (t === 2) { const o = r.p(['PQRS', 'KLMN', 'ABCD']); return r.p([
    { p1: 'Semua segi empat sama mempunyai empat paksi simetri.', p2: `${o} ialah segi empat sama.`, k: `${o} mempunyai empat paksi simetri.`, nb: `${o} tidak mempunyai empat paksi simetri.`, na: `${o} bukan segi empat sama.` },
    { p1: 'Semua segi empat tepat mempunyai dua pepenjuru yang sama panjang.', p2: `${o} ialah segi empat tepat.`, k: `Pepenjuru ${o} sama panjang.`, nb: `Pepenjuru ${o} tidak sama panjang.`, na: `${o} bukan segi empat tepat.` }]); }
  if (t === 3) { const o = r.p(['KLM', 'PQR', 'XYZ']); return { p1: 'Semua segi tiga sama sisi mempunyai tiga paksi simetri.', p2: `${o} ialah segi tiga sama sisi.`, k: `${o} mempunyai tiga paksi simetri.`, nb: `${o} tidak mempunyai tiga paksi simetri.`, na: `${o} bukan segi tiga sama sisi.` }; }
  const N = vnama(); return r.p([
    { p1: 'Semua murid Tingkatan 4 Cerdik mengambil subjek Matematik.', p2: `${N} ialah murid Tingkatan 4 Cerdik.`, k: `${N} mengambil subjek Matematik.`, nb: `${N} tidak mengambil subjek Matematik.`, na: `${N} bukan murid Tingkatan 4 Cerdik.` },
    { p1: 'Semua ahli kelab robotik menyertai pertandingan sains.', p2: `${N} ialah ahli kelab robotik.`, k: `${N} menyertai pertandingan sains.`, nb: `${N} tidak menyertai pertandingan sains.`, na: `${N} bukan ahli kelab robotik.` }]);
}
// Bentuk II / III: implikasi dengan objek khusus { p1, p, q, np, nq }
function lgB23(r) {
  const t = r.i(0, 5);
  if (t === 0) { const a = r.i(2, 9), b = r.i(2, 5), c = r.i(1, 9); return { p1: `Jika x = ${a}, maka ${b}x + ${c} = ${a * b + c}.`, p: `x = ${a}`, q: `${b}x + ${c} = ${a * b + c}`, np: `x ≠ ${a}`, nq: `${b}x + ${c} ≠ ${a * b + c}` }; }
  if (t === 1) { const [n, nm] = r.p(LGPOLI), o = 'PQRSTUVWXY'.slice(0, n), S = (n - 2) * 180; return { p1: `Jika sebuah poligon ialah ${nm}, maka hasil tambah sudut pedalamannya ialah ${S}°.`, p: `${o} ialah ${nm}`, q: `hasil tambah sudut pedalaman ${o} ialah ${S}°`, np: `${o} bukan ${nm}`, nq: `hasil tambah sudut pedalaman ${o} bukan ${S}°` }; }
  if (t === 2) { const a = r.p([2, 3, 5]), m = r.p([2, 3]), C = a * m * r.i(2, 9); return { p1: `Jika suatu nombor ialah gandaan ${a * m}, maka nombor itu ialah gandaan ${a}.`, p: `${C} ialah gandaan ${a * m}`, q: `${C} ialah gandaan ${a}`, np: `${C} bukan gandaan ${a * m}`, nq: `${C} bukan gandaan ${a}` }; }
  if (t === 3) return r.p([
    { p1: 'Jika hari ini hujan, maka padang sekolah basah.', p: 'hari ini hujan', q: 'padang sekolah basah', np: 'hari ini tidak hujan', nq: 'padang sekolah tidak basah' },
    { p1: 'Jika Aisyah lulus ujian memandu, maka Aisyah mendapat lesen memandu.', p: 'Aisyah lulus ujian memandu', q: 'Aisyah mendapat lesen memandu', np: 'Aisyah tidak lulus ujian memandu', nq: 'Aisyah tidak mendapat lesen memandu' },
    { p1: 'Jika air dipanaskan hingga 100°C, maka air itu mendidih.', p: 'air dalam cerek dipanaskan hingga 100°C', q: 'air dalam cerek mendidih', np: 'air dalam cerek tidak dipanaskan hingga 100°C', nq: 'air dalam cerek tidak mendidih' }]);
  if (t === 4) { const o = r.p(['ABCD', 'PQRS', 'EFGH']); return { p1: 'Jika sebuah sisi empat ialah segi empat sama, maka sisi empat itu mempunyai empat paksi simetri.', p: `${o} ialah segi empat sama`, q: `${o} mempunyai empat paksi simetri`, np: `${o} bukan segi empat sama`, nq: `${o} tidak mempunyai empat paksi simetri` }; }
  const k = r.i(2, 9); return { p1: `Jika m = ${k}, maka m² = ${k * k}.`, p: `m = ${k}`, q: `m² = ${k * k}`, np: `m ≠ ${k}`, nq: `m² ≠ ${k * k}` };
}
// hujah lengkap: f = 1/2/3 (sah) atau 'ak'/'na'/'b1' (tidak sah)
function lgArg(r, f) {
  if (f === 1 || f === 'b1') { const a = lgFormI(r); return f === 1 ? { P1: a.p1, P2: a.p2, K: a.k, f, sah: true } : { P1: a.p1, P2: lgCap(a.k), K: a.p2, f, sah: false }; }
  const b = lgB23(r);
  if (f === 2) return { P1: b.p1, P2: lgCap(b.p) + '.', K: lgCap(b.q) + '.', f, sah: true };
  if (f === 3) return { P1: b.p1, P2: lgCap(b.nq) + '.', K: lgCap(b.np) + '.', f, sah: true };
  if (f === 'ak') return { P1: b.p1, P2: lgCap(b.q) + '.', K: lgCap(b.p) + '.', f, sah: false };
  return { P1: b.p1, P2: lgCap(b.np) + '.', K: lgCap(b.nq) + '.', f, sah: false };
}
const LGBN = { 1: 'Bentuk I', 2: 'Bentuk II', 3: 'Bentuk III' };
const LGBW = {
  1: 'Premis 1 berbentuk "Semua A ialah B" dan premis 2 "C ialah A", maka kesimpulan "C ialah B" (Bentuk I).',
  2: 'Premis 1 berbentuk "Jika p, maka q" dan premis 2 mengesahkan p, maka kesimpulan q (Bentuk II).',
  3: 'Premis 1 berbentuk "Jika p, maka q" dan premis 2 menafikan q, maka kesimpulan ~p (Bentuk III).',
  ak: 'Premis 2 mengesahkan akibat q, bukan antejadian p. Ini bukan Bentuk II, maka kesimpulan tidak pasti benar.',
  na: 'Premis 2 menafikan antejadian p, bukan akibat q. Ini bukan Bentuk III, maka kesimpulan tidak pasti benar.',
  b1: 'Premis 2 menyatakan C mempunyai sifat B, bukan "C ialah A". Ini bukan Bentuk I, maka kesimpulan tidak pasti benar.'
};
// hujah untuk sah & munasabah: { P1, P2, K, sah, mun, why[] }
function lgMun(r) {
  const t = r.i(0, 5);
  if (t === 0) return { P1: 'Semua nombor perdana ialah nombor ganjil.', P2: '2 ialah nombor perdana.', K: '2 ialah nombor ganjil.', sah: true, mun: false, why: ['Hujah mengikut Bentuk I, maka hujah sah.', 'Premis 1 palsu (2 ialah perdana tetapi genap), maka hujah tidak munasabah.'] };
  if (t === 1) { const a = r.p([2, 3, 5]), m = r.p([2, 3]), C = a * m * r.i(2, 9); return { P1: `Semua gandaan ${a * m} ialah gandaan ${a}.`, P2: `${C} ialah gandaan ${a * m}.`, K: `${C} ialah gandaan ${a}.`, sah: true, mun: true, why: ['Hujah mengikut Bentuk I, maka hujah sah.', `Premis 1 benar dan premis 2 benar (${C} = ${a * m} × ${C / (a * m)}), maka hujah munasabah.`] }; }
  if (t === 2) { const a = r.p([2, 3, 5]), m = r.p([2, 3]); let C; do C = a * r.i(3, 19); while (C % (a * m) === 0); return { P1: `Jika suatu nombor ialah gandaan ${a * m}, maka nombor itu ialah gandaan ${a}.`, P2: `${C} ialah gandaan ${a * m}.`, K: `${C} ialah gandaan ${a}.`, sah: true, mun: false, why: ['Hujah mengikut Bentuk II, maka hujah sah.', `Premis 2 palsu (${C} ÷ ${a * m} bukan nombor bulat), maka hujah tidak munasabah.`] }; }
  if (t === 3) { const a = r.p([2, 3, 5]), m = r.p([2, 3]); let C; do C = r.i(11, 59); while (C % a === 0); return { P1: `Jika suatu nombor ialah gandaan ${a * m}, maka nombor itu ialah gandaan ${a}.`, P2: `${C} bukan gandaan ${a}.`, K: `${C} bukan gandaan ${a * m}.`, sah: true, mun: true, why: ['Hujah mengikut Bentuk III, maka hujah sah.', `Premis 1 benar dan premis 2 benar (${C} ÷ ${a} bukan nombor bulat), maka hujah munasabah.`] }; }
  if (t === 4) return r.p([
    { P1: 'Semua segi empat tepat ialah segi empat sama.', P2: 'PQRS ialah segi empat tepat.', K: 'PQRS ialah segi empat sama.', sah: true, mun: false, why: ['Hujah mengikut Bentuk I, maka hujah sah.', 'Premis 1 palsu (segi empat tepat 2 cm × 5 cm bukan segi empat sama), maka hujah tidak munasabah.'] },
    { P1: 'Semua pentagon mempunyai lima sisi.', P2: 'ABCDE ialah pentagon.', K: 'ABCDE mempunyai lima sisi.', sah: true, mun: true, why: ['Hujah mengikut Bentuk I, maka hujah sah.', 'Kedua-dua premis benar, maka hujah munasabah.'] }]);
  const a = lgArg(r, r.p(['ak', 'na', 'b1'])); return { P1: a.P1, P2: a.P2, K: a.K, sah: false, mun: false, why: [LGBW[a.f], 'Hujah yang tidak sah juga tidak munasabah.'] };
}

/* =================== hujah induktif =================== */
// pola: { g:'lin'|'kuad'|'eksp', k, c, b }
function lgPola(r, g) {
  g = g || r.p(['lin', 'lin', 'kuad', 'eksp']);
  if (g === 'lin') return { g, k: r.i(2, 9), c: r.n(-6, 12) };
  if (g === 'kuad') return { g, k: r.p([1, 1, 2, 3]), c: r.n(-4, 9) };
  return { g, k: r.i(1, 5), c: r.p([0, 0, 1, -1, 2]), b: r.p([2, 2, 3]) };
}
const lgTv = (o, n) => (o.g === 'lin' ? o.k * n + o.c : o.g === 'kuad' ? o.k * n * n + o.c : o.k * Math.pow(o.b, n) + o.c);
function lgExpr(o) {
  const kk = o.k === 1 ? '' : o.k;
  if (o.g === 'lin') return `${kk}n${lgPm(o.c)}`;
  if (o.g === 'kuad') return `${kk}n²${lgPm(o.c)}`;
  return (o.k === 1 ? `${o.b}ⁿ` : `${o.k}(${o.b}ⁿ)`) + lgPm(o.c);
}
function lgRow(o, n) {   // "5 = 4(1) + 1"
  let m;
  if (o.g === 'lin') m = `${o.k}(${n})`;
  else if (o.g === 'kuad') m = o.k === 1 ? `${n}²` : `${o.k}(${n}²)`;
  else m = o.k === 1 ? `${o.b}${lgSup(n)}` : `${o.k}(${o.b}${lgSup(n)})`;
  return `${fmt(lgTv(o, n))} = ${m}${lgPm(o.c)}`;
}
function lgSub(o, N) {    // gantian n = N
  let m;
  if (o.g === 'lin') m = `${o.k}(${N})`;
  else if (o.g === 'kuad') m = o.k === 1 ? `${N}²` : `${o.k}(${N}²)`;
  else m = o.k === 1 ? `${o.b}${lgSup(N)}` : `${o.k}(${o.b}${lgSup(N)})`;
  return `${m}${lgPm(o.c)} = ${fmt(lgTv(o, N))}`;
}
const lgSeq = (o, m = 4) => [1, 2, 3, 4, 5].slice(0, m).map(n => fmt(lgTv(o, n)));
// hujah induktif: [teks, kuat?, premis benar?, sebab]
const LGIND = [
  ['Sejak 10 tahun lalu, hujan lebat turun di Kelantan setiap bulan Disember. Maka hujan lebat akan turun di Kelantan pada bulan Disember tahun ini.', true, true, 'Pemerhatian berulang selama 10 tahun menjadikan kesimpulan berkemungkinan besar benar.'],
  ['Dua orang murid Tingkatan 4 Bestari suka bermain bola sepak. Maka semua murid di sekolah itu suka bermain bola sepak.', false, true, 'Hanya dua kes daripada ratusan murid; bukti terlalu sedikit.'],
  ['Hasil tambah sudut pedalaman 50 buah segi tiga yang diukur ialah 180°. Maka hasil tambah sudut pedalaman semua segi tiga ialah 180°.', true, true, 'Banyak kes diperiksa dan semuanya sepadan.'],
  ['Seekor kucing yang dilihat oleh Ravi berwarna hitam. Maka semua kucing berwarna hitam.', false, true, 'Satu pemerhatian sahaja tidak mencukupi.'],
  ['Matahari terbit dari arah timur setiap hari yang direkodkan dalam sejarah. Maka matahari akan terbit dari arah timur esok.', true, true, 'Rekod yang sangat banyak dan konsisten.'],
  ['Harga petrol naik pada bulan Januari. Maka harga petrol akan naik setiap bulan.', false, true, 'Satu bulan sahaja tidak menunjukkan corak.'],
  ['Bas sekolah tiba lewat pada hari Isnin dan Selasa. Maka bas sekolah sentiasa tiba lewat.', false, true, 'Dua hari sahaja ialah sampel yang terlalu kecil.'],
  ['Dalam 200 kali lambungan, syiling itu menunjukkan angka kira-kira separuh daripada lambungan. Maka kebarangkalian mendapat angka bagi syiling itu ialah kira-kira 1/2.', true, true, 'Sampel yang besar memberi anggaran yang boleh dipercayai.'],
  ['Dua orang pemain bola keranjang sekolah itu lebih tinggi daripada 180 cm. Maka semua murid sekolah itu lebih tinggi daripada 180 cm.', false, true, 'Dua pemain bola keranjang tidak mewakili semua murid.'],
  ['Setiap minggu dalam tahun lalu, kedai Pak Ali menjual lebih daripada 100 buku. Maka minggu depan kedai Pak Ali akan menjual lebih daripada 100 buku.', true, true, 'Corak konsisten selama 52 minggu.'],
  ['Setiap ekor daripada 100 ekor ikan jerung yang dikaji bernafas menggunakan peparu. Maka semua ikan jerung bernafas menggunakan peparu.', true, false, 'Jika premis benar, kesimpulan berkemungkinan besar benar (hujah kuat). Tetapi premis palsu kerana ikan jerung bernafas menggunakan insang.'],
  ['Setiap tahun sejak tahun 2000, salji turun di Kuala Lumpur pada bulan Julai. Maka salji akan turun di Kuala Lumpur pada bulan Julai tahun hadapan.', true, false, 'Corak yang berulang setiap tahun menjadikan hujah kuat, tetapi premis palsu kerana salji tidak turun di Kuala Lumpur.'],
  ['Setiap kali Siti menanam benih kacang di dalam gelap selama 20 kali percubaan, benih itu bercambah. Maka benih kacang boleh bercambah di dalam gelap.', true, true, '20 percubaan dengan keputusan yang sama.'],
  ['Kereta Daniel rosak sekali pada tahun 2020. Maka kereta Daniel akan rosak setiap tahun.', false, true, 'Satu kejadian sahaja.'],
  ['Bulan berbentuk bulan penuh setiap kira-kira 29 hari sejak rekod dibuat. Maka bulan penuh seterusnya akan berlaku kira-kira 29 hari lagi.', true, true, 'Pemerhatian yang sangat banyak dan konsisten.'],
  ['Lima ekor ikan paus yang dikaji bernafas menggunakan peparu. Maka semua ikan paus bernafas menggunakan insang.', false, true, 'Kesimpulan bercanggah dengan premis.'],
  ['Setiap murid dalam 12 kelas yang ditinjau mempunyai sekurang-kurangnya seorang adik-beradik. Maka setiap murid di Malaysia ialah anak tunggal.', false, true, 'Kesimpulan bercanggah dengan premis.']
];

/* =================== rajah =================== */
const lgTx = (x, y, t, c = 'tx', sz = 15, a = 'start', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
function lgWrap(t, max) { const w = String(t).split(' '), L = []; let c = ''; w.forEach(x => { if ((c + ' ' + x).trim().length > max) { L.push(c.trim()); c = x; } else c += ' ' + x; }); if (c.trim()) L.push(c.trim()); return L; }
// kad bertindan: rows = [[label, teks, warna, nilai?]]
function lgCards(rows, label) {
  let y = 8, s = '';
  rows.forEach(([lab, txt, c, v]) => {
    const L = lgWrap(txt, 38), h = 30 + L.length * 20;
    s += `<rect x="6" y="${y}" width="348" height="${h}" rx="12" style="fill:var(--surf);stroke:var(--${c})" stroke-width="2.5"/>`;
    s += lgTx(18, y + 14, lab, c, 12.5, 'start', 800);
    if (v != null) s += lgTx(342, y + 14, v === true ? 'B' : v === false ? 'P' : v, v === true ? 'gr' : v === false ? 'rd' : 'mu', 15, 'end', 800);
    L.forEach((l, i) => { s += lgTx(18, y + 36 + i * 20, l, 'tx', 15, 'start', 600); });
    y += h + 8;
  });
  return `<svg viewBox="0 0 360 ${y}" role="img" aria-label="${esc(label || 'Kad pernyataan')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// jadual kebenaran: head [..], rows [[...]] (true/false/'?'/teks), hl = lajur diserlahkan
function lgTT(head, rows, hl, label) {
  const cw = head.map(h => Math.max(62, h.length * 9 + 22)), W = cw.reduce((a, b) => a + b, 0), RH = 34, H = RH * (rows.length + 1);
  let s = `<rect x="1" y="1" width="${W}" height="${H}" rx="10" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  if (hl != null) { const x = cw.slice(0, hl).reduce((a, b) => a + b, 0); s += `<rect x="${x + 3}" y="3" width="${cw[hl] - 6}" height="${H - 4}" rx="8" style="fill:var(--am);fill-opacity:.12;stroke:var(--am)" stroke-width="1.5"/>`; }
  s += `<line x1="1" y1="${RH}" x2="${W + 1}" y2="${RH}" style="stroke:var(--bd)" stroke-width="2"/>`;
  let x = 1;
  head.forEach((h, i) => { if (i) s += `<line x1="${x}" y1="4" x2="${x}" y2="${H - 2}" style="stroke:var(--bd)" stroke-width="1.5"/>`; s += lgTx(x + cw[i] / 2, RH / 2 + 1, h, i < 2 ? 'tr' : 'pa', 14, 'middle', 800); x += cw[i]; });
  rows.forEach((row, j) => { x = 1; row.forEach((v, i) => { const y = RH * (j + 1.5) + 1; s += lgTx(x + cw[i] / 2, y, v === true ? 'B' : v === false ? 'P' : v, v === true ? 'gr' : v === false ? 'rd' : 'mu', 16, 'middle', 800); x += cw[i]; }); });
  return `<svg viewBox="0 0 ${W + 2} ${H + 2}" role="img" aria-label="${esc(label || 'Jadual kebenaran')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// carta bar pola
function lgBars(vals, label, hide) {
  const n = vals.length, mx = Math.max(...vals, 1), mn = Math.min(0, ...vals), bw = 46, gap = 18, W = n * (bw + gap) + gap, Hc = 150, sc = Hc / (mx - mn || 1), y0 = 24 + mx * sc;
  let s = `<line x1="4" y1="${+y0.toFixed(1)}" x2="${W - 4}" y2="${+y0.toFixed(1)}" style="stroke:var(--mu)" stroke-width="2"/>`;
  vals.forEach((v, i) => {
    const x = gap + i * (bw + gap), h = Math.max(2, Math.abs(v) * sc), y = v >= 0 ? y0 - h : y0;
    const q = hide && i === n - 1;
    s += `<rect x="${x}" y="${+y.toFixed(1)}" width="${bw}" height="${+h.toFixed(1)}" rx="6" style="fill:var(--${q ? 'dim' : 'pk'});fill-opacity:.35;stroke:var(--${q ? 'mu' : 'pk'})" stroke-width="2"${q ? ' stroke-dasharray="5 4"' : ''}/>`;
    s += lgTx(x + bw / 2, v >= 0 ? y - 12 : y + h + 12, q ? '?' : fmt(v), q ? 'mu' : 'pk', 15, 'middle', 800);
    s += lgTx(x + bw / 2, y0 + (v >= 0 ? 16 : -14), `n = ${i + 1}`, 'mu', 12, 'middle', 700);
  });
  return `<svg viewBox="0 0 ${W} ${Math.ceil(y0 + 30 + (mn < 0 ? -mn * sc : 0))}" role="img" aria-label="${esc(label || 'Carta pola')}" font-family="Inter, sans-serif">${s}</svg>`;
}
const lgArgFig = (a, show) => lgCards([['PREMIS 1', a.P1, 'tr'], ['PREMIS 2', a.P2 || '______', 'pu'], ['KESIMPULAN', a.K || '______', 'am']], 'Hujah: premis dan kesimpulan');

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 3.1.1 Pernyataan & Penafian ---------- */
  kenal: [
    ({ a }) => ({ q: `Tentukan sama ada ayat berikut ialah pernyataan atau bukan pernyataan: "${a}"` }),
    ({ a }) => ({ q: `Adakah ayat "${a}" suatu pernyataan? Jika ya, nyatakan nilai kebenarannya.` }),
    ({ a }) => ({ q: `Nyatakan sama ada ayat di bawah ialah pernyataan. Beri sebab.<br>"${a}"` }),
    ({ a, isSt, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ayat "${a}" ${isSt ? 'bukan pernyataan' : 'ialah pernyataan'}. Adakah ${N} betul?` }, salah(N, ans, isSt ? 'Ayat itu boleh ditentukan sama ada benar atau palsu, maka ia ialah pernyataan.' : 'Pernyataan mesti boleh ditentukan sama ada benar atau palsu.')); }
  ],
  nilai: [
    ({ s }) => ({ q: `Tentukan nilai kebenaran pernyataan berikut: ${s}.` }),
    ({ s }) => ({ q: `Adakah pernyataan "${s}" benar atau palsu?` }),
    ({ s }) => ({ q: `Nyatakan sama ada pernyataan berikut benar atau palsu.<br>${s}.` }),
    ({ s, v, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata pernyataan "${s}" ialah ${v ? 'palsu' : 'benar'}. Adakah ${N} betul?` }, salah(N, ans, 'Semak fakta matematik pernyataan itu.')); }
  ],
  nafi: [
    ({ s }) => ({ q: `Tulis penafian bagi pernyataan <i>p</i>: ${s}. Seterusnya, nyatakan nilai kebenaran ~<i>p</i>.` }),
    ({ s }) => ({ q: `Diberi <i>p</i>: ${s}. Tuliskan ~<i>p</i> dan tentukan sama ada ~<i>p</i> benar atau palsu.` }),
    ({ s }) => ({ q: `Bentuk penafian bagi pernyataan "${s}" dengan menggunakan perkataan "bukan" atau "tidak". Nyatakan nilai kebenaran penafian itu.` }),
    ({ s }) => ({ q: `Pernyataan <i>p</i>: ${s}. Nyatakan nilai kebenaran <i>p</i> dan ~<i>p</i>, kemudian tulis ~<i>p</i>.` })
  ],
  kuant: [
    ({ s }) => ({ q: `Tentukan nilai kebenaran pernyataan berikut. Beri sebab.<br>${s}.` }),
    ({ s }) => ({ q: `Adakah pernyataan "${s}" benar atau palsu? Jelaskan.` }),
    ({ s, ans }) => { const N = vnama(); return { q: `${N} berkata, "${s}." Adakah ${N} betul? Beri sebab.`, ans: ans.startsWith('Benar') ? `Ya, ${N} betul. ` + ans : `Tidak, ${N} tidak betul. ` + ans }; }
  ],
  betul: [
    ({ s }) => ({ q: `Pernyataan "${s}" adalah palsu. Tukar pengkuantiti "semua" kepada "sebilangan" supaya pernyataan itu menjadi benar.` }),
    ({ s }) => ({ q: `Tentukan nilai kebenaran "${s}". Jika palsu, tulis semula dengan pengkuantiti yang sesuai supaya pernyataan itu benar.` }),
    ({ s }) => ({ q: `Gunakan pengkuantiti "sebilangan" untuk membetulkan pernyataan palsu berikut: ${s}.` })
  ],
  nafiSemua: [
    ({ s }) => ({ q: `Tulis penafian bagi pernyataan <i>p</i>: ${s}. Nyatakan nilai kebenaran <i>p</i> dan ~<i>p</i>.` }),
    ({ s }) => ({ q: `Diberi <i>p</i>: ${s}. Bentuk ~<i>p</i> dan tentukan nilai kebenarannya.` }),
    ({ s, ns, v }) => { const N = vnama(); return Object.assign({ q: `${N} menulis penafian bagi "${s}" sebagai "${s.replace('Semua ', 'Semua ').replace(' ialah ', ' bukan ').replace(' mempunyai ', ' tidak mempunyai ')}". Adakah ${N} betul?` }, salah(N, `~p: ${ns} (${lgBP(!v)})`, 'Penafian bagi "semua" ialah "bukan semua", bukan "semua ... bukan".')); }
  ],
  k111: [
    ({ A, B }) => ({ q: `Diberi <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}.<br>(a) Nyatakan nilai kebenaran <i>p</i> dan <i>q</i>.<br>(b) Tulis ~<i>p</i> dan ~<i>q</i>, serta nilai kebenarannya.`, ans: `(a) p: ${lgBP(A.v)}, q: ${lgBP(B.v)} (b) ~p: ${A.ns} (${lgBP(!A.v)}); ~q: ${B.ns} (${lgBP(!B.v)})`, work: [`p: ${A.why}`, `q: ${B.why}`, 'Penafian menterbalikkan nilai kebenaran.'] }),
    ({ L }) => ({ q: `Antara ayat berikut, kenal pasti ayat yang merupakan pernyataan dan nyatakan nilai kebenarannya.<br>${L.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x.a}`).join('<br>')}`, ans: L.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x.ans}`).join('; '), work: L.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x.why}`) }),
    ({ fx, okv, bad }) => ({ q: `Diberi ayat "x ialah faktor bagi ${fx}".<br>(a) Adakah ayat ini suatu pernyataan? Beri sebab.<br>(b) Gantikan x dengan satu nilai supaya ayat itu menjadi pernyataan benar, dan satu nilai lain supaya menjadi pernyataan palsu.`, ans: `(a) Bukan pernyataan (b) Contoh: x = ${okv} (benar), x = ${bad} (palsu)`, work: ['(a) Nilai kebenaran bergantung pada nilai x.', `(b) ${fx} ÷ ${okv} = ${fx / okv}, maka "${okv} ialah faktor bagi ${fx}" benar.`, `${fx} ÷ ${bad} bukan nombor bulat, maka "${bad} ialah faktor bagi ${fx}" palsu.`] })
  ],

  /* ---------- 3.1.3 Pernyataan Majmuk ---------- */
  majNilai: [
    ({ txt }) => ({ q: `Tentukan nilai kebenaran pernyataan majmuk berikut:<br>${txt}.` }),
    ({ txt }) => ({ q: `Adakah pernyataan majmuk "${txt}" benar atau palsu?` }),
    ({ txt }) => ({ q: `Nyatakan sama ada pernyataan berikut benar atau palsu. Tunjukkan nilai kebenaran setiap komponen.<br>${txt}.` }),
    ({ txt, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata pernyataan "${txt}" ialah ${ans === 'Benar' ? 'palsu' : 'benar'}. Adakah ${N} betul?` }, salah(N, ans, 'Nilai setiap pernyataan dahulu, kemudian guna peraturan "dan" atau "atau".')); }
  ],
  pecah: [
    ({ txt }) => ({ q: `Kenal pasti dua pernyataan, <i>p</i> dan <i>q</i>, dalam pernyataan majmuk berikut. Seterusnya, tentukan nilai kebenaran pernyataan majmuk itu.<br>${txt}.` }),
    ({ txt }) => ({ q: `Pecahkan pernyataan majmuk "${txt}" kepada dua pernyataan mudah dan tentukan nilai kebenarannya.` }),
    ({ txt }) => ({ q: `Tulis dua pernyataan yang membentuk "${txt}". Adakah pernyataan majmuk itu benar?` })
  ],
  bina: [
    ({ A, B, c }) => ({ q: `Diberi <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}. Bina pernyataan majmuk menggunakan perkataan "${c}". Nyatakan nilai kebenarannya.` }),
    ({ A, B, c }) => ({ q: `Gabungkan dua pernyataan berikut dengan perkataan "${c}", kemudian tentukan sama ada pernyataan majmuk itu benar atau palsu.<br><i>p</i>: ${A.s}<br><i>q</i>: ${B.s}` }),
    ({ A, B, c }) => ({ q: `Tulis "<i>p</i> ${c} <i>q</i>" bagi <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}. Adakah pernyataan itu benar?` })
  ],
  pilih: [
    ({ A, B, want }) => ({ q: `Lengkapkan dengan "dan" atau "atau" supaya pernyataan majmuk berikut ${want}:<br>${A.s} ___ ${B.s}.` }),
    ({ A, B, want }) => ({ q: `Pilih "dan" atau "atau" untuk membentuk pernyataan majmuk yang ${want}.<br><i>p</i>: ${A.s}<br><i>q</i>: ${B.s}` }),
    ({ A, B, want }) => ({ q: `Perkataan penghubung manakah, "dan" atau "atau", menjadikan pernyataan "${A.s} ___ ${B.s}" ${want}?` })
  ],
  majNeg: [
    ({ A, B, form }) => ({ q: `Diberi <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}. Tentukan nilai kebenaran bagi "${form}".` }),
    ({ A, B, form }) => ({ q: `Pernyataan <i>p</i>: ${A.s}. Pernyataan <i>q</i>: ${B.s}. Tulis pernyataan "${form}" dan nyatakan nilai kebenarannya.`, ans: null }),
    ({ A, B, form }) => ({ q: `Jika <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}, adakah "${form}" benar atau palsu?` })
  ],
  jadual: [
    ({ form }) => ({ q: `Lengkapkan lajur "${form}" dalam jadual kebenaran di bawah.` }),
    ({ form }) => ({ q: `Salin dan lengkapkan jadual kebenaran bagi "${form}".` }),
    ({ form }) => ({ q: `Tentukan nilai kebenaran "${form}" bagi setiap baris jadual di bawah.` })
  ],
  k113: [
    ({ a, m, sDan, sAtauP }) => ({ q: `Diberi x ialah integer dengan 1 ≤ x ≤ 12, <i>p</i>: x > ${a} dan <i>q</i>: x ialah gandaan ${m}.<br>(a) Senaraikan semua nilai x yang menjadikan "<i>p</i> dan <i>q</i>" benar.<br>(b) Senaraikan semua nilai x yang menjadikan "<i>p</i> atau <i>q</i>" palsu.`, ans: `(a) ${sDan.join(', ')} (b) ${sAtauP.join(', ')}`, work: [`Gandaan ${m} dalam 1 hingga 12: ${[...Array(12)].map((_, i) => i + 1).filter(x => x % m === 0).join(', ')}`, `(a) "dan" benar jika x > ${a} DAN x gandaan ${m}: ${sDan.join(', ')}`, `(b) "atau" palsu jika kedua-dua palsu: x ≤ ${a} dan x bukan gandaan ${m}: ${sAtauP.join(', ')}`] }),
    ({ f1, f2, c1, c2 }) => ({ q: `Lengkapkan jadual kebenaran bagi "${f1}" dan "${f2}" dalam jadual di bawah.`, ans: `${f1}: ${c1.join(', ')}; ${f2}: ${c2.join(', ')}`, work: ['Tulis ~p dan ~q dahulu dengan menterbalikkan nilai p dan q.', `${f1}: ${c1.join(', ')}`, `${f2}: ${c2.join(', ')}`] }),
    ({ A, B }) => ({ q: `Diberi <i>p</i>: ${A.s} dan <i>q</i>: ${B.s}.<br>Tentukan nilai kebenaran bagi (a) <i>p</i> dan <i>q</i> (b) <i>p</i> atau <i>q</i> (c) ~<i>p</i> atau <i>q</i> (d) <i>p</i> dan ~<i>q</i>.`, ans: `(a) ${lgBP(A.v && B.v)} (b) ${lgBP(A.v || B.v)} (c) ${lgBP(!A.v || B.v)} (d) ${lgBP(A.v && !B.v)}`, work: [`p: ${lgBP(A.v)} (${A.why}) · q: ${lgBP(B.v)} (${B.why})`, `~p: ${lgBP(!A.v)} · ~q: ${lgBP(!B.v)}`, '"dan" benar hanya jika kedua-dua benar; "atau" palsu hanya jika kedua-dua palsu.'] })
  ],

  /* ---------- 3.1.4 Implikasi ---------- */
  tulisImp: [
    ({ p, q }) => ({ q: `Diberi <i>p</i>: ${p} dan <i>q</i>: ${q}. Bina implikasi "jika <i>p</i>, maka <i>q</i>".` }),
    ({ p, q }) => ({ q: `Tulis satu implikasi dengan antejadian "${p}" dan akibat "${q}".` }),
    ({ p, q }) => ({ q: `Gabungkan dua pernyataan berikut dalam bentuk "jika <i>p</i>, maka <i>q</i>".<br><i>p</i>: ${p}<br><i>q</i>: ${q}` })
  ],
  ante: [
    ({ imp }) => ({ q: `Kenal pasti antejadian dan akibat bagi implikasi berikut:<br>${imp}.` }),
    ({ imp }) => ({ q: `Dalam implikasi "${imp}", nyatakan antejadian dan akibatnya.` }),
    ({ imp, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata antejadian bagi implikasi "${imp}" ialah bahagian selepas perkataan "maka". Adakah ${N} betul?` }, salah(N, ans, 'Antejadian ialah bahagian selepas "jika"; akibat ialah bahagian selepas "maka".')); }
  ],
  dwiPecah: [
    ({ p, q }) => ({ q: `Tulis dua implikasi berdasarkan pernyataan berikut:<br>${lgCap(p)} jika dan hanya jika ${q}.` }),
    ({ p, q }) => ({ q: `Pernyataan "${lgCap(p)} jika dan hanya jika ${q}" terdiri daripada dua implikasi. Tuliskan kedua-duanya.` }),
    ({ p, q }) => ({ q: `Nyatakan implikasi 1 dan implikasi 2 bagi "${p} jika dan hanya jika ${q}".` })
  ],
  dwiGabung: [
    ({ p, q }) => ({ q: `Gabungkan dua implikasi berikut menjadi satu pernyataan dalam bentuk "<i>p</i> jika dan hanya jika <i>q</i>".<br>Implikasi 1: Jika ${p}, maka ${q}.<br>Implikasi 2: Jika ${q}, maka ${p}.` }),
    ({ p, q }) => ({ q: `Tulis satu pernyataan "jika dan hanya jika" daripada: "Jika ${p}, maka ${q}" dan "Jika ${q}, maka ${p}".` }),
    ({ p, q }) => ({ q: `Implikasi "Jika ${p}, maka ${q}" dan akasnya kedua-duanya benar. Tulis kedua-duanya sebagai satu pernyataan dwisyarat.` })
  ],
  nilaiImp: [
    ({ imp }) => ({ q: `Tentukan nilai kebenaran implikasi berikut:<br>${imp}.` }),
    ({ imp }) => ({ q: `Adakah implikasi "${imp}" benar atau palsu? Beri sebab.` }),
    ({ imp, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata implikasi "${imp}" ${ans === 'Benar' ? 'palsu' : 'benar'}. Adakah ${N} betul?` }, salah(N, ans, 'Implikasi palsu hanya apabila antejadian benar dan akibat palsu.')); }
  ],
  akasDll: [
    ({ imp, nm }) => ({ q: `Tulis ${nm} bagi implikasi berikut dan nyatakan nilai kebenarannya.<br>${imp}.` }),
    ({ imp, nm }) => ({ q: `Diberi implikasi "${imp}". Bina ${nm}nya. Adakah ${nm} itu benar?` }),
    ({ imp, nm }) => ({ q: `Bentuk ${nm} bagi "${imp}", kemudian tentukan nilai kebenarannya.` }),
    ({ imp, nm, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${nm} bagi "${imp}" sebagai "${wrong}". Adakah ${N} betul?` }, salah(N, ans, `Itu bukan ${nm}. Semak sama ada perlu tukar tempat, nafikan atau kedua-duanya.`)); }
  ],
  penyangkal: [
    ({ st }) => ({ q: `Berikan satu contoh penyangkal bagi pernyataan berikut:<br>${st}` }),
    ({ st }) => ({ q: `Tunjukkan bahawa pernyataan "${st.replace(/\.$/, '')}" adalah palsu dengan memberikan satu contoh penyangkal.` }),
    ({ st }) => ({ q: `Pernyataan berikut adalah palsu. Nyatakan satu contoh penyangkal.<br>${st}` })
  ],
  k114: [
    ({ I }) => ({ q: `Diberi implikasi: Jika ${I.p}, maka ${I.q}.<br>Tulis (a) akas, (b) songsangan, (c) kontrapositif bagi implikasi itu, dan nyatakan nilai kebenaran setiap satu.` }),
    ({ I }) => ({ q: `Bagi implikasi "Jika ${I.p}, maka ${I.q}":<br>(a) Bina akas, songsangan dan kontrapositifnya.<br>(b) Tentukan nilai kebenaran setiap satu. Beri contoh penyangkal bagi yang palsu.` }),
    ({ I }) => ({ q: `Implikasi: Jika ${I.p}, maka ${I.q}.<br>(a) Adakah implikasi ini benar? (b) Tulis akas dan kontrapositifnya serta nilai kebenaran masing-masing.` })
  ],

  /* ---------- 3.2.1 Hujah Deduktif ---------- */
  jenisHujah: [
    ({ t }) => ({ q: `Tentukan sama ada hujah berikut ialah hujah deduktif atau hujah induktif.<br>${t}` }),
    ({ t }) => ({ q: `Adakah hujah di bawah deduktif atau induktif? Beri sebab.<br>${t}` }),
    ({ t, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hujah berikut ialah hujah ${ans === 'Deduktif' ? 'induktif' : 'deduktif'}. Adakah ${N} betul?<br>${t}` }, salah(N, ans, 'Deduktif: umum → khusus. Induktif: khusus → umum.')); }
  ],
  lengkapK: [
    ({ a }) => ({ q: `Lengkapkan hujah berikut.<br>Premis 1: ${a.P1}<br>Premis 2: ${a.P2}<br>Kesimpulan: ______`, rev: true }),
    () => ({ q: 'Berdasarkan premis dalam rajah di bawah, tulis kesimpulan yang sah.' }),
    ({ a }) => ({ q: `Buat satu kesimpulan secara deduktif daripada dua premis berikut.<br>Premis 1: ${a.P1}<br>Premis 2: ${a.P2}`, rev: true }),
    ({ a, bn }) => ({ q: 'Tulis kesimpulan bagi hujah dalam rajah di bawah dan nyatakan bentuk hujah itu.', ans: `Kesimpulan: ${a.K} (${bn})` })
  ],
  kenalBentuk: [
    () => ({ q: 'Nyatakan bentuk hujah deduktif dalam rajah di bawah (Bentuk I, II atau III).' }),
    ({ a }) => ({ q: `Hujah berikut mengikut bentuk yang mana?<br>Premis 1: ${a.P1}<br>Premis 2: ${a.P2}<br>Kesimpulan: ${a.K}`, rev: true }),
    () => ({ q: 'Kenal pasti sama ada hujah di bawah ialah Bentuk I, Bentuk II atau Bentuk III.' })
  ],
  lengkapP: [
    ({ a, which }) => ({ q: `Lengkapkan premis yang tertinggal dalam hujah berikut.<br>Premis 1: ${which === 1 ? '______' : a.P1}<br>Premis 2: ${which === 2 ? '______' : a.P2}<br>Kesimpulan: ${a.K}`, rev: true }),
    () => ({ q: 'Tulis premis yang tertinggal supaya hujah dalam rajah di bawah menjadi sah.' }),
    ({ which }) => ({ q: `Rajah di bawah menunjukkan satu hujah yang sah. Nyatakan premis ${which} yang tertinggal.` })
  ],
  sah: [
    () => ({ q: 'Adakah hujah dalam rajah di bawah sah? Beri sebab.' }),
    ({ a }) => ({ q: `Tentukan sama ada hujah berikut sah atau tidak sah. Jelaskan.<br>Premis 1: ${a.P1}<br>Premis 2: ${a.P2}<br>Kesimpulan: ${a.K}`, rev: true }),
    ({ ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hujah dalam rajah di bawah ${ans.startsWith('Sah') ? 'tidak sah' : 'sah'}. Adakah ${N} betul?` }, salah(N, ans, 'Semak sama ada hujah mengikut Bentuk I, II atau III.')); }
  ],
  mun: [
    () => ({ q: 'Tentukan sama ada hujah dalam rajah di bawah sah dan munasabah. Beri sebab.' }),
    ({ a }) => ({ q: `Adakah hujah berikut sah? Adakah hujah itu munasabah?<br>Premis 1: ${a.P1}<br>Premis 2: ${a.P2}<br>Kesimpulan: ${a.K}`, rev: true }),
    () => ({ q: 'Nilaikan hujah di bawah: sah atau tidak sah, munasabah atau tidak munasabah.' })
  ],
  dedNum: [
    ({ p1, p2 }) => ({ q: `Buat kesimpulan secara deduktif.<br>Premis 1: ${p1}<br>Premis 2: ${p2}` }),
    ({ p1, p2 }) => ({ q: `Lengkapkan hujah deduktif berikut dengan kesimpulan yang sesuai.<br>Premis 1: ${p1}<br>Premis 2: ${p2}<br>Kesimpulan: ______` }),
    ({ p1, p2 }) => ({ q: `Gunakan penaakulan deduktif untuk menulis kesimpulan bagi:<br>${p1} ${p2}` })
  ],
  k121: [
    ({ S, n }) => ({ q: `Premis 1: Hasil tambah sudut pedalaman sebuah poligon <i>n</i> sisi ialah (<i>n</i> − 2) × 180°.<br>Premis 2: Hasil tambah sudut pedalaman poligon P ialah ${S}°.<br>Buat kesimpulan secara deduktif tentang bilangan sisi poligon P.`, ans: `Poligon P mempunyai ${n} sisi`, work: [`(n − 2) × 180° = ${S}°`, `n − 2 = ${S} ÷ 180 = ${n - 2}`, `n = ${n}`] }),
    ({ b, f }) => ({ q: `Diberi premis 1: ${b.p1}<br>(a) Tulis premis 2 dan kesimpulan supaya terbentuk hujah ${LGBN[f]} yang sah.<br>(b) Nyatakan bentuk hujah yang tidak sah jika premis 2 ialah "${lgCap(b.q)}".`, ans: f === 2 ? `(a) Premis 2: ${lgCap(b.p)}. Kesimpulan: ${lgCap(b.q)}. (b) Mengesahkan akibat; kesimpulan "${lgCap(b.p)}" tidak pasti benar` : `(a) Premis 2: ${lgCap(b.nq)}. Kesimpulan: ${lgCap(b.np)}. (b) Mengesahkan akibat; kesimpulan "${lgCap(b.p)}" tidak pasti benar`, work: [f === 2 ? 'Bentuk II: premis 2 mengesahkan antejadian p, kesimpulan q.' : 'Bentuk III: premis 2 menafikan akibat q, kesimpulan ~p.', 'Premis 2 yang mengesahkan q tidak memastikan p benar (tidak sah).'] }),
    ({ m }) => ({ q: `Premis 1: ${m.P1}<br>Premis 2: ${m.P2}<br>Kesimpulan: ${m.K}<br>(a) Adakah hujah ini sah? (b) Adakah hujah ini munasabah? Beri sebab bagi setiap jawapan.`, ans: `(a) ${m.sah ? 'Sah' : 'Tidak sah'} (b) ${m.mun ? 'Munasabah' : 'Tidak munasabah'}`, work: m.why })
  ],

  /* ---------- 3.2.4 Hujah Induktif ---------- */
  umum: [
    ({ rows }) => ({ q: `Buat satu kesimpulan umum secara induktif bagi senarai nombor yang mengikut pola berikut:<br>${rows.join(', &nbsp;')}, ...` }),
    ({ rows, seq }) => ({ q: `Senarai nombor ${seq.join(', ')}, ... mengikut pola ${rows.join('; ')}. Tulis kesimpulan umum bagi pola itu.` }),
    ({ rows }) => ({ q: `Perhatikan pola ini: ${rows.join(', ')}. Apakah kesimpulan umum yang boleh dibuat secara induktif?` })
  ],
  umumNom: [
    ({ seq }) => ({ q: `Buat kesimpulan umum secara induktif bagi senarai nombor ${seq.join(', ')}, ...` }),
    ({ seq }) => ({ q: 'Rajah di bawah menunjukkan sebutan pertama hingga keempat suatu pola. Tulis kesimpulan umum bagi pola itu.', rev: false }),
    ({ seq }) => ({ q: `Senarai nombor ${seq.join(', ')}, ... boleh ditulis dalam bentuk umum. Tentukan bentuk umum itu.` })
  ],
  sebutan: [
    ({ rows, N }) => ({ q: `Diberi ${rows.join(', ')}, ...<br>(a) Buat kesimpulan umum secara induktif. (b) Hitung sebutan ke-${N}.` }),
    ({ ex, N }) => ({ q: `Kesimpulan umum bagi suatu pola nombor ialah ${ex}, n = 1, 2, 3, ... Hitung sebutan ke-${N}.`, ans: null }),
    ({ seq, N }) => ({ q: `Pola ${seq.join(', ')}, ... dalam rajah di bawah mengikut satu rumus umum. Cari rumus itu dan sebutan ke-${N}.` })
  ],
  kuat: [
    ({ t }) => ({ q: `Tentukan sama ada hujah induktif berikut kuat atau lemah.<br>${t}` }),
    ({ t }) => ({ q: `Adakah hujah ini kuat atau lemah? Beri sebab.<br>${t}` }),
    ({ t, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hujah berikut ialah hujah induktif yang ${ans === 'Kuat' ? 'lemah' : 'kuat'}. Adakah ${N} betul?<br>${t}` }, salah(N, ans, 'Hujah kuat: kesimpulan berkemungkinan besar benar berdasarkan premis.')); }
  ],
  yakin: [
    ({ t }) => ({ q: `Tentukan sama ada hujah induktif berikut kuat atau lemah, dan sama ada ia meyakinkan.<br>${t}` }),
    ({ t }) => ({ q: `Nilaikan hujah di bawah: kuat atau lemah? Meyakinkan atau tidak meyakinkan?<br>${t}` }),
    ({ t }) => ({ q: `Adakah hujah berikut meyakinkan? Jelaskan dengan merujuk kepada kekuatan hujah dan kebenaran premis.<br>${t}` })
  ],
  masalah: [
    ({ c }) => ({ q: c.q1 }),
    ({ c }) => ({ q: c.q2 }),
    ({ c }) => ({ q: c.q3 })
  ]
};

/* =================== pembina soalan (r = lgRG atau lgRW) =================== */
const LG = {};
/* ---------- 3.1.1 ---------- */
LG.kenal = (r, k) => {
  const mode = k == null ? r.i(0, 2) : k % 3;
  if (mode === 0) { const [a, why] = r.p(LGNOT); return GEN_LQ('kenal', { a, isSt: false, ans: 'Bukan pernyataan', work: [`Ayat ini ${why.startsWith('nilai') ? 'tidak mempunyai nilai kebenaran yang tetap kerana ' + why : 'ialah ' + why}, maka ia bukan pernyataan.`] }); }
  const o = lgSt(r, null, mode === 1);
  return GEN_LQ('kenal', { a: o.s + '.', isSt: true, ans: `Pernyataan (${lgLow(lgBP(o.v))})`, work: ['Ayat ini boleh ditentukan sama ada benar atau palsu, maka ia ialah pernyataan.', `${o.why} Maka pernyataan ini ${lgLow(lgBP(o.v))}.`] });
};
LG.nilai = (r, k) => {
  const o = lgSt(r, k == null ? null : LGKINDS[k % LGKINDS.length]);
  return GEN_LQ('nilai', { s: o.s, v: o.v, ans: lgBP(o.v), work: [o.why] });
};
LG.nafi = (r, k) => {
  const o = lgSt(r, k == null ? null : LGKINDS[(k * 2 + 1) % LGKINDS.length]);
  return GEN_LQ('nafi', { s: o.s, ans: `~p: ${o.ns} (${lgLow(lgBP(!o.v))})`, work: [`p ${lgLow(lgBP(o.v))}: ${o.why}`, 'Tambah perkataan "bukan" atau "tidak" untuk membentuk ~p.', `Penafian menterbalikkan nilai kebenaran, maka ~p ${lgLow(lgBP(!o.v))}.`] }, { fig: lgCards([['p', o.s, 'tr', o.v], ['~p', '?', 'pk']], 'Pernyataan p dan penafiannya'), figAns: lgCards([['p', o.s, 'tr', o.v], ['~p', o.ns, 'pk', !o.v]], 'Pernyataan p dan penafiannya') });
};
LG.kuant = (r, k) => {
  const L = k == null ? LGQ : LGQ.filter((x, i) => i % 2 === k % 2), [s, v, why] = r.p(L);
  return GEN_LQ('kuant', { s, ans: `${lgBP(v)}. ${why}`, work: [s.startsWith('Semua') ? '"Semua" benar hanya jika setiap objek memenuhi syarat.' : '"Sebilangan" benar jika sekurang-kurangnya satu objek memenuhi syarat.', why] });
};
LG.betul = r => {
  const [s, , why, fix] = r.p(LGQ.filter(x => x[3]));
  return GEN_LQ('betul', { s, ans: fix + '.', work: [`Pernyataan asal palsu: ${why}`, `Tukar "Semua" kepada "Sebilangan": ${fix}.`] });
};
LG.nafiSemua = r => {
  const [s, v, why] = r.p(LGQ.filter(x => x[0].startsWith('Semua'))), ns = 'Bukan semua ' + lgLow(s.slice(6));
  return GEN_LQ('nafiSemua', { s, ns, v, ans: `~p: ${ns} (${lgLow(lgBP(!v))})`, work: [`p ${lgLow(lgBP(v))}: ${why}`, 'Penafian bagi "semua" ialah "bukan semua".', `~p ${lgLow(lgBP(!v))}.`] });
};
LG.k111 = r => {
  const [A, B] = lgSt2(r);
  const L = lgShuf(r, [0, 1, 2, 3].map(i => {
    if (i < 2) { const [a, why] = r.p(LGNOT.slice(i * 7, i * 7 + 7)); return { a, ans: 'Bukan pernyataan', why: `${why}, bukan pernyataan` }; }
    const o = lgSt(r, null, i === 2); return { a: o.s, ans: `Pernyataan ${lgLow(lgBP(o.v))}`, why: o.why };
  }));
  const fx = r.p([12, 18, 20, 24, 30, 36]), fs = [...Array(fx)].map((_, i) => i + 1).filter(d => fx % d === 0 && d > 1 && d < fx), okv = r.p(fs);
  let bad; do bad = r.i(5, 11); while (fx % bad === 0);
  return GEN_LQ('k111', { A, B, L, fx, okv, bad });
};
/* ---------- 3.1.3 ---------- */
const LGPROP = [
  ['nombor genap', n => n % 2 === 0], ['nombor ganjil', n => n % 2 === 1], ['nombor perdana', lgPr], ['nombor kuasa dua sempurna', n => Number.isInteger(Math.sqrt(n))],
  ['gandaan 3', n => n % 3 === 0], ['gandaan 4', n => n % 4 === 0], ['gandaan 5', n => n % 5 === 0], ['faktor bagi 36', n => 36 % n === 0], ['faktor bagi 48', n => 48 % n === 0]
];
LG.majNilai = (r, k) => {
  const c = k == null ? r.p(['dan', 'atau']) : ['dan', 'atau'][k % 2];
  const [A, B] = lgSt2(r, r.f() < .5, r.f() < .6);
  const v = c === 'dan' ? A.v && B.v : A.v || B.v, txt = `${A.s} ${c} ${lgLow(B.s)}`;
  return GEN_LQ('majNilai', { txt, ans: lgBP(v), work: [`p: ${A.s} → ${lgBP(A.v)} (${A.why})`, `q: ${B.s} → ${lgBP(B.v)} (${B.why})`, c === 'dan' ? `"dan" benar hanya jika kedua-dua benar → ${lgBP(v)}` : `"atau" palsu hanya jika kedua-dua palsu → ${lgBP(v)}`] }, { fig: lgTT(['p', 'q', `p ${c} q`], [[A.v, B.v, '?']], null, 'Nilai kebenaran p dan q'), figAns: lgTT(['p', 'q', `p ${c} q`], [[A.v, B.v, v]], 2, 'Nilai kebenaran pernyataan majmuk') });
};
LG.pecah = r => {
  let n, a, b; do { n = r.i(2, 48); [a, b] = lgShuf(r, LGPROP).slice(0, 2); } while ((a[0].includes('genap') && b[0].includes('ganjil')) || (a[0].includes('ganjil') && b[0].includes('genap')));
  const c = r.p(['dan', 'atau']), va = a[1](n), vb = b[1](n), v = c === 'dan' ? va && vb : va || vb;
  const txt = `${n} ialah ${a[0]} ${c} ${b[0]}`;
  return GEN_LQ('pecah', { txt, ans: `p: ${n} ialah ${a[0]} (${lgB1(va)}); q: ${n} ialah ${b[0]} (${lgB1(vb)}); pernyataan majmuk: ${lgBP(v)}`, work: [`p: ${n} ialah ${a[0]} → ${lgBP(va)}`, `q: ${n} ialah ${b[0]} → ${lgBP(vb)}`, `p ${c} q → ${lgBP(v)}`] });
};
LG.bina = (r, k) => {
  const c = k == null ? r.p(['dan', 'atau']) : ['atau', 'dan'][k % 2];
  const [A, B] = lgSt2(r), v = c === 'dan' ? A.v && B.v : A.v || B.v;
  return GEN_LQ('bina', { A, B, c, ans: `${A.s} ${c} ${lgLow(B.s)} (${lgLow(lgBP(v))})`, work: [`p ${lgLow(lgBP(A.v))}: ${A.why}`, `q ${lgLow(lgBP(B.v))}: ${B.why}`, `p ${c} q → ${lgBP(v)}`] });
};
LG.pilih = r => {
  const first = r.f() < .5, [A, B] = lgSt2(r, first, !first), wantB = r.f() < .5;
  return GEN_LQ('pilih', { A, B, want: wantB ? 'benar' : 'palsu', ans: wantB ? '"atau"' : '"dan"', work: [`${A.s}: ${lgBP(A.v)}; ${B.s}: ${lgBP(B.v)}`, 'Satu benar dan satu palsu: "atau" memberi benar, "dan" memberi palsu.', `Maka guna ${wantB ? '"atau"' : '"dan"'}.`] });
};
const LGFORMS = [['~p dan q', (p, q) => !p && q], ['p atau ~q', (p, q) => p || !q], ['~p atau ~q', (p, q) => !p || !q], ['~p dan ~q', (p, q) => !p && !q], ['p dan ~q', (p, q) => p && !q], ['~p atau q', (p, q) => !p || q]];
LG.majNeg = (r, k) => {
  const [form, f] = k == null ? r.p(LGFORMS) : LGFORMS[k % LGFORMS.length], [A, B] = lgSt2(r), v = f(A.v, B.v);
  const txt = form.replace('~p', `<<NP>>`).replace('~q', '<<NQ>>').replace(/^p/, '<<P>>').replace(/ q$/, ' <<Q>>');
  const word = txt.replace('<<NP>>', A.ns).replace('<<P>>', A.s).replace('<<NQ>>', lgLow(B.ns)).replace('<<Q>>', lgLow(B.s));
  return GEN_LQ('majNeg', { A, B, form, ans: `${lgBP(v)} (${word})`, work: [`p: ${lgBP(A.v)}, maka ~p: ${lgBP(!A.v)}`, `q: ${lgBP(B.v)}, maka ~q: ${lgBP(!B.v)}`, `${form} → ${lgBP(v)}`] });
};
const LGROWS = [[true, true], [true, false], [false, true], [false, false]];
LG.jadual = (r, k) => {
  const [form, f] = k == null ? r.p(LGFORMS) : LGFORMS[k % LGFORMS.length], col = LGROWS.map(([p, q]) => f(p, q));
  const extra = form.includes('~p') && form.includes('~q') ? ['~p', '~q'] : form.includes('~p') ? ['~p'] : ['~q'];
  const ev = (h, p, q) => (h === '~p' ? !p : !q);
  const fig = lgTT(['p', 'q', ...extra, form], LGROWS.map(([p, q]) => [p, q, ...extra.map(h => ev(h, p, q)), '?']), extra.length + 2, `Jadual kebenaran ${form}`);
  const figAns = lgTT(['p', 'q', ...extra, form], LGROWS.map(([p, q], i) => [p, q, ...extra.map(h => ev(h, p, q)), col[i]]), extra.length + 2, `Jadual kebenaran ${form} lengkap`);
  return GEN_LQ('jadual', { form, ans: col.map(lgB1).join(', ') + ' (dari atas ke bawah)', work: [`Tulis ${extra.join(' dan ')} dengan menterbalikkan nilai.`, form.includes('dan') ? '"dan": B hanya jika kedua-dua B.' : '"atau": P hanya jika kedua-dua P.', `Lajur ${form}: ${col.map(lgB1).join(', ')}`] }, { fig, figAns });
};
LG.k113 = r => {
  const a = r.i(3, 7), m = r.p([2, 3, 4]), X = [...Array(12)].map((_, i) => i + 1);
  const sDan = X.filter(x => x > a && x % m === 0), sAtauP = X.filter(x => x <= a && x % m !== 0);
  const [f1, g1] = r.p(LGFORMS.slice(0, 3)); let f2, g2; do [f2, g2] = r.p(LGFORMS.slice(3)); while (f2 === f1);
  const [A, B] = lgSt2(r);
  const v = vq('k113', { a, m, sDan, sAtauP, f1, f2, c1: LGROWS.map(([p, q]) => lgB1(g1(p, q))), c2: LGROWS.map(([p, q]) => lgB1(g2(p, q))), A, B });
  const o = { q: v.q, ans: v.ans, work: v.work };
  if (v.q.includes('dalam jadual')) { o.fig = lgTT(['p', 'q', f1, f2], LGROWS.map(([p, q]) => [p, q, '?', '?']), null, 'Jadual kebenaran'); o.figAns = lgTT(['p', 'q', f1, f2], LGROWS.map(([p, q]) => [p, q, g1(p, q), g2(p, q)]), null, 'Jadual kebenaran lengkap'); }
  return o;
};
/* ---------- 3.1.4 ---------- */
LG.tulisImp = (r, k) => {
  const I = lgImp(r, k == null ? null : k % 9), sw = r.f() < .3, p = sw ? I.q : I.p, q = sw ? I.p : I.q;
  return GEN_LQ('tulisImp', { p, q, ans: `Jika ${p}, maka ${q}.`, work: ['Bentuk implikasi: Jika (antejadian), maka (akibat).', `Antejadian p: ${p}; akibat q: ${q}.`] }, { fig: lgCards([['p · ANTEJADIAN', p, 'tr'], ['q · AKIBAT', q, 'pk']], 'Antejadian dan akibat') });
};
LG.ante = (r, k) => {
  const I = lgImp(r, k == null ? null : (k * 4 + 2) % 9), imp = `Jika ${I.p}, maka ${I.q}`;
  return GEN_LQ('ante', { imp, ans: `Antejadian: ${I.p}; akibat: ${I.q}`, work: ['Antejadian ialah bahagian selepas "jika".', 'Akibat ialah bahagian selepas "maka".'] });
};
LG.dwi = (r, k) => {
  const T = [4, 5, 7], I = lgImp(r, T[(k == null ? r.i(0, 2) : k) % 3]);
  if (I.v.join('') !== '1111') return LG.dwi(r, k == null ? null : k + 1);
  if ((k == null ? r.f() < .5 : k % 2 === 0)) return GEN_LQ('dwiPecah', { p: I.p, q: I.q, ans: `Implikasi 1: Jika ${I.p}, maka ${I.q}. Implikasi 2: Jika ${I.q}, maka ${I.p}.`, work: ['"p jika dan hanya jika q" = (jika p, maka q) dan (jika q, maka p).'] });
  return GEN_LQ('dwiGabung', { p: I.p, q: I.q, ans: `${lgCap(I.p)} jika dan hanya jika ${I.q}.`, work: ['Dua implikasi "jika p, maka q" dan "jika q, maka p" digabungkan sebagai "p jika dan hanya jika q".'] });
};
LG.nilaiImp = (r, k) => {
  const want = k == null ? r.i(0, 3) : k % 4, pv = want < 2, qv = want % 2 === 0;
  const [A, B] = lgSt2(r, pv, qv), v = !A.v || B.v, imp = `Jika ${lgLow(A.s)}, maka ${lgLow(B.s)}`;
  return GEN_LQ('nilaiImp', { imp, ans: lgBP(v), work: [`Antejadian: ${A.s} → ${lgBP(A.v)} (${A.why})`, `Akibat: ${B.s} → ${lgBP(B.v)} (${B.why})`, v ? 'Implikasi benar kerana bukan kes "antejadian benar, akibat palsu".' : 'Antejadian benar tetapi akibat palsu, maka implikasi palsu.'] }, { fig: lgTT(['p', 'q', 'Jika p, maka q'], [[A.v, B.v, '?']], null, 'Nilai kebenaran implikasi'), figAns: lgTT(['p', 'q', 'Jika p, maka q'], [[A.v, B.v, v]], 2, 'Nilai kebenaran implikasi') });
};
LG.akasDll = (r, k) => {
  const j = k == null ? r.i(1, 3) : 1 + k % 3, I = lgImp(r, k == null ? null : [0, 1, 2, 3, 6, 8, 4, 7, 5][k % 9]), nm = LGIMN[j];
  const imp = lgImpTxt(I, 0), form = lgImpTxt(I, j), v = !!I.v[j], wj = [1, 2, 3].find(x => x !== j);
  return GEN_LQ('akasDll', { imp, nm, wrong: lgImpTxt(I, wj), ans: `${form} (${lgLow(lgBP(v))})`, work: [j === 1 ? 'Akas: tukar tempat antejadian dan akibat.' : j === 2 ? 'Songsangan: nafikan antejadian dan akibat.' : 'Kontrapositif: tukar tempat dan nafikan kedua-duanya.', `${lgCap(nm)}: ${form}.`, v ? `${lgCap(nm)} ini benar.` : `${lgCap(nm)} ini palsu. Contoh penyangkal: ${I.ce[j]}.`] });
};
LG.penyangkal = (r, k) => {
  const [st, ans, work] = lgCe(r, k == null ? null : k % 7);
  return GEN_LQ('penyangkal', { st, ans: `Contoh penyangkal: ${ans}`, work });
};
LG.k114 = (r, k) => {
  const I = lgImp(r, k == null ? r.p([0, 1, 2, 3, 6, 8]) : [0, 2, 6, 1, 3, 8][k % 6]);
  const rows = [1, 2, 3].map(j => `${['', '(a) Akas', '(b) Songsangan', '(c) Kontrapositif'][j]}: ${lgImpTxt(I, j)} (${lgLow(lgBP(I.v[j]))})`);
  const work = [`Implikasi asal ${lgLow(lgBP(I.v[0]))}${I.v[0] ? '' : '; contoh penyangkal: ' + I.ce[0]}.`].concat([1, 2, 3].filter(j => !I.v[j]).map(j => `${lgCap(LGIMN[j])} palsu; contoh penyangkal: ${I.ce[j]}.`), ['Implikasi dan kontrapositif sentiasa sama nilai; akas dan songsangan juga sama nilai.']);
  const v = vq('k114', { I });
  const ans = v.q.includes('(a) Adakah implikasi') ? `(a) ${lgBP(I.v[0])} (b) Akas: ${lgImpTxt(I, 1)} (${lgLow(lgBP(I.v[1]))}); Kontrapositif: ${lgImpTxt(I, 3)} (${lgLow(lgBP(I.v[3]))})` : rows.join('; ');
  return { q: v.q, ans, work };
};
/* ---------- 3.2.1 ---------- */
function lgJenisData(r, ded) {
  if (ded) { const a = lgArg(r, r.p([1, 2, 3])); return { t: `${a.P1} ${a.P2} Maka ${lgLow(a.K)}`, why: 'Hujah bermula dengan premis umum dan membuat kesimpulan tentang kes khusus.' }; }
  const o = lgPola(r, r.p(['lin', 'kuad'])); if (r.f() < .5) return { t: `${[1, 2, 3].map(n => lgRow(o, n)).join(', ')}. Maka senarai nombor itu boleh ditulis sebagai ${lgExpr(o)}, n = 1, 2, 3, ...`, why: 'Kesimpulan umum dibuat berdasarkan beberapa kes khusus.' };
  const [t] = r.p(LGIND); return { t, why: 'Kesimpulan umum dibuat berdasarkan pemerhatian kes-kes khusus.' };
}
LG.jenisHujah = (r, k) => {
  const ded = k == null ? r.f() < .5 : k % 2 === 0, d = lgJenisData(r, ded);
  return GEN_LQ('jenisHujah', { t: d.t, ans: ded ? 'Deduktif' : 'Induktif', work: [d.why, ded ? 'Umum → khusus: hujah deduktif.' : 'Khusus → umum: hujah induktif.'] });
};
LG.lengkapK = (r, k) => {
  const f = k == null ? r.p([1, 2, 3]) : [1, 2, 3][k % 3], a = lgArg(r, f);
  return GEN_LQ('lengkapK', { a, bn: LGBN[f], ans: `Kesimpulan: ${a.K}`, work: [LGBW[f]] }, { fig: lgArgFig({ P1: a.P1, P2: a.P2 }), figAns: lgArgFig(a) });
};
LG.kenalBentuk = (r, k) => {
  const f = k == null ? r.p([1, 2, 3]) : [2, 3, 1][k % 3], a = lgArg(r, f);
  return GEN_LQ('kenalBentuk', { a, ans: LGBN[f], work: [LGBW[f]] }, { fig: lgArgFig(a) });
};
LG.lengkapP = (r, k) => {
  const f = k == null ? r.p([1, 2, 3]) : [3, 1, 2][k % 3], a = lgArg(r, f), which = f === 1 ? (r.f() < .4 ? 1 : 2) : 2;
  const miss = which === 1 ? a.P1 : a.P2;
  return GEN_LQ('lengkapP', { a, which, ans: `Premis ${which}: ${miss}`, work: [LGBW[f], `Maka premis ${which} ialah: ${miss}`] }, { fig: lgArgFig(which === 1 ? { P1: '______', P2: a.P2, K: a.K } : { P1: a.P1, K: a.K }), figAns: lgArgFig(a) });
};
LG.sah = (r, k) => {
  const f = k == null ? r.p([1, 2, 3, 'ak', 'na', 'b1']) : [2, 'ak', 3, 'na', 1, 'b1'][k % 6], a = lgArg(r, f);
  const ans = a.sah ? `Sah (${LGBN[f]})` : 'Tidak sah';
  return GEN_LQ('sah', { a, ans, work: [LGBW[f]] }, { fig: lgArgFig(a) });
};
LG.mun = (r, k) => {
  let m, tries = 0; do { m = lgMun(r); tries++; } while (k != null && tries < 30 && (k % 3 === 0 ? !(m.sah && !m.mun) : k % 3 === 1 ? !m.mun : m.sah));
  const ans = m.sah ? (m.mun ? 'Sah dan munasabah' : 'Sah tetapi tidak munasabah') : 'Tidak sah dan tidak munasabah';
  return GEN_LQ('mun', { a: m, ans, work: m.why }, { fig: lgArgFig(m) });
};
function lgDedNumData(r, t) {
  t = t == null ? r.i(0, 4) : t;
  if (t === 0) { const [n, nm] = r.p(LGPOLI); return { p1: 'Hasil tambah sudut pedalaman sebuah poligon <i>n</i> sisi ialah (<i>n</i> − 2) × 180°.', p2: `Sebuah ${nm} mempunyai ${n} sisi.`, ans: `Hasil tambah sudut pedalaman ${nm} ialah ${(n - 2) * 180}°`, work: [`n = ${n}`, `(${n} − 2) × 180° = ${n - 2} × 180° = ${(n - 2) * 180}°`] }; }
  if (t === 1) { const n = r.p([5, 6, 8, 9, 10, 12]), nm = { 5: 'pentagon', 6: 'heksagon', 8: 'oktagon', 9: 'nonagon', 10: 'dekagon', 12: 'dodekagon' }[n]; return { p1: 'Sudut peluaran sebuah poligon sekata <i>n</i> sisi ialah 360° ÷ <i>n</i>.', p2: `Sebuah ${nm} sekata mempunyai ${n} sisi.`, ans: `Sudut peluaran ${nm} sekata itu ialah ${360 / n}°`, work: [`n = ${n}`, `360° ÷ ${n} = ${360 / n}°`] }; }
  if (t === 2) { const b = r.i(4, 16), h = r.i(3, 12) * 2; return { p1: 'Luas segi tiga ialah ½ × tapak × tinggi.', p2: `Segi tiga ABC mempunyai tapak ${b} cm dan tinggi ${h} cm.`, ans: `Luas segi tiga ABC ialah ${b * h / 2} cm²`, work: [`½ × ${b} × ${h} = ${b * h / 2}`] }; }
  if (t === 3) { const s = r.i(2, 9); return { p1: 'Isi padu kubus bersisi <i>s</i> ialah <i>s</i>³.', p2: `Sebuah kotak berbentuk kubus mempunyai sisi ${s} cm.`, ans: `Isi padu kotak itu ialah ${s * s * s} cm³`, work: [`s = ${s}`, `${s}³ = ${s} × ${s} × ${s} = ${s * s * s}`] }; }
  const a = r.i(2, 9), b = r.i(2, 6), c = r.n(-9, 9), y = b * a + c; return { p1: `Jika x = ${a}, maka y = ${b}x${lgPm(c)}.`, p2: `x = ${a}.`, ans: `y = ${fmt(y)}`, work: ['Bentuk II: antejadian disahkan, maka akibat benar.', `y = ${b}(${a})${lgPm(c)} = ${fmt(y)}`] };
}
LG.dedNum = (r, k) => { const d = lgDedNumData(r, k == null ? null : k % 5); return GEN_LQ('dedNum', d); };
LG.k121 = (r, k) => {
  let n; do n = r.i(5, 20); while (n === 0);
  const f = r.p([2, 3]), b = lgB23(r);
  let m; do m = lgMun(r); while (!m.sah);
  return GEN_LQ('k121', { S: (n - 2) * 180, n, b, f, m });
};
/* ---------- 3.2.4 ---------- */
LG.umum = (r, k) => {
  const o = lgPola(r, k == null ? null : ['lin', 'kuad', 'lin', 'eksp'][k % 4]), rows = [1, 2, 3, 4].map(n => lgRow(o, n)), ex = lgExpr(o);
  return GEN_LQ('umum', { rows, seq: lgSeq(o), ans: `${ex}, n = 1, 2, 3, 4, ...`, work: ['Kenal pasti bahagian yang berubah (1, 2, 3, 4) dan gantikan dengan n.', `Bahagian yang tetap kekal: ${ex}`, `Kesimpulan umum: ${ex}, n = 1, 2, 3, 4, ...`] });
};
LG.umumNom = (r, k) => {
  const o = lgPola(r, k == null ? r.p(['lin', 'lin', 'kuad']) : ['lin', 'kuad'][k % 2]), seq = lgSeq(o), ex = lgExpr(o);
  const work = o.g === 'lin' ? [`Beza antara sebutan berturutan ialah ${o.k}, maka bentuknya ${o.k}n + c.`, `n = 1: ${o.k}(1) + c = ${fmt(lgTv(o, 1))} → c = ${fmt(o.c)}`, `Kesimpulan umum: ${ex}`] : [`Bandingkan dengan n²: 1, 4, 9, 16, ...${o.k > 1 ? ` dan ${o.k}n²: ${[1, 2, 3, 4].map(n => o.k * n * n).join(', ')}` : ''}`, `Setiap sebutan ${o.c >= 0 ? 'lebih' : 'kurang'} ${Math.abs(o.c)} daripada ${o.k > 1 ? o.k + 'n²' : 'n²'}.`, `Kesimpulan umum: ${ex}`];
  return GEN_LQ('umumNom', { seq, ans: `${ex}, n = 1, 2, 3, 4, ...`, work }, { fig: lgBars(lgSeq(o).map((_, i) => lgTv(o, i + 1)), 'Pola sebutan') });
};
LG.sebutan = (r, k) => {
  const o = lgPola(r, k == null ? r.p(['lin', 'kuad', 'eksp']) : ['lin', 'kuad', 'eksp'][k % 3]), N = o.g === 'eksp' ? r.i(6, 8) : r.i(10, 30), ex = lgExpr(o);
  return GEN_LQ('sebutan', { rows: [1, 2, 3].map(n => lgRow(o, n)), seq: lgSeq(o), ex, N, ans: `${ex}; sebutan ke-${N} = ${fmt(lgTv(o, N))}`, work: [`Kesimpulan umum: ${ex}, n = 1, 2, 3, ...`, `Gantikan n = ${N}: ${lgSub(o, N)}`] }, { fig: lgBars([1, 2, 3, 4].map(n => lgTv(o, n)), 'Pola sebutan') });
};
LG.kuat = (r, k) => {
  const L = k == null ? LGIND : LGIND.filter(x => x[1] === (k % 2 === 0)), [t, kt, , why] = r.p(L);
  return GEN_LQ('kuat', { t, ans: kt ? 'Kuat' : 'Lemah', work: [why, kt ? 'Kesimpulan berkemungkinan besar benar → hujah kuat.' : 'Kesimpulan berkemungkinan tidak benar → hujah lemah.'] });
};
LG.yakin = (r, k) => {
  const L = k == null ? LGIND : LGIND.filter((x, i) => (k % 3 === 0 ? x[1] && x[2] : k % 3 === 1 ? !x[1] : x[1] && !x[2])), [t, kt, pb, why] = r.p(L);
  const ans = kt ? (pb ? 'Kuat dan meyakinkan' : 'Kuat tetapi tidak meyakinkan') : 'Lemah dan tidak meyakinkan';
  return GEN_LQ('yakin', { t, ans, work: [why, 'Hujah meyakinkan = hujah kuat + semua premis benar.'] });
};
function lgMasalahData(r, t) {
  t = t == null ? r.i(0, 2) : t;
  if (t === 0) {
    const k = r.p([5, 10, 15, 20]), c = r.p([10, 20, 30, 50]), W = r.i(10, 20), N = r.p([2, 3, 4]) * 100, w = Math.ceil((N - c) / k), o = { g: 'lin', k, c };
    const vals = [1, 2, 3, 4].map(n => k * n + c), N2 = k * w + c;
    const base = `Simpanan Aina pada minggu ke-1, ke-2, ke-3 dan ke-4 ialah RM${vals.join(', RM')}.`;
    return { q1: `${base}<br>(a) Buat kesimpulan umum secara induktif bagi simpanan Aina pada minggu ke-n.<br>(b) Hitung simpanannya pada minggu ke-${W}.<br>(c) Pada minggu ke berapakah simpanannya mula mencapai sekurang-kurangnya RM${N}?`, q2: `${base} Corak ini berterusan.<br>(a) Tulis rumus umum simpanan pada minggu ke-n. (b) Berapakah simpanan pada minggu ke-${W}? (c) Bilakah simpanan pertama kali mencapai RM${N} atau lebih?`, q3: `${base}<br>Dengan menggunakan hujah induktif, (a) tentukan rumus simpanan minggu ke-n, (b) ramalkan simpanan minggu ke-${W}, (c) tentukan minggu pertama simpanan mencapai RM${N}.`, ans: `(a) RM(${lgExpr(o)}) (b) RM${k * W + c} (c) Minggu ke-${w}`, work: [`${vals.map((v, i) => `${v} = ${k}(${i + 1}) + ${c}`).join(', ')}`, `(a) Simpanan = ${lgExpr(o)}, n = 1, 2, 3, ...`, `(b) ${k}(${W}) + ${c} = ${k * W + c}`, `(c) ${k}n + ${c} ≥ ${N} → ${k}n ≥ ${N - c} → n ≥ ${N - c} ÷ ${k}`, `Integer terkecil: n = ${w} (RM${N2}); n = ${w - 1} memberi RM${N2 - k} sahaja`], fig: lgBars(vals, 'Simpanan mingguan') };
  }
  if (t === 1) {
    const k = r.p([3, 4, 5]), c = 1, Wn = r.i(10, 25), S = r.i(12, 30), M = k * S + c, o = { g: 'lin', k, c };
    const vals = [1, 2, 3, 4].map(n => k * n + c), sh = k === 3 ? 'segi tiga' : k === 4 ? 'segi empat sama' : 'pentagon';
    const base = `Batang mancis disusun untuk membentuk ${sh} bersambung. Bilangan batang mancis bagi 1, 2, 3 dan 4 ${sh} ialah ${vals.join(', ')}.`;
    return { q1: `${base}<br>(a) Buat kesimpulan umum bagi bilangan batang mancis untuk n ${sh}. (b) Berapakah batang mancis yang diperlukan untuk ${Wn} ${sh}? (c) Berapakah ${sh} yang dapat dibentuk dengan ${M} batang mancis?`, q2: `${base}<br>(a) Tulis rumus umum. (b) Cari bilangan batang mancis bagi ${Wn} ${sh}. (c) Jika ${M} batang mancis digunakan, berapakah bilangan ${sh}?`, q3: `${base}<br>Gunakan hujah induktif untuk (a) menulis rumus umum, (b) mengira batang mancis bagi ${Wn} ${sh}, (c) menentukan bilangan ${sh} yang menggunakan ${M} batang mancis.`, ans: `(a) ${lgExpr(o)} (b) ${k * Wn + c} (c) ${S}`, work: [`${vals.map((v, i) => `${v} = ${k}(${i + 1}) + 1`).join(', ')}`, `(a) ${lgExpr(o)}, n = 1, 2, 3, ...`, `(b) ${k}(${Wn}) + 1 = ${k * Wn + c}`, `(c) ${k}n + 1 = ${M} → n = ${S}`], fig: lgBars(vals, 'Bilangan batang mancis') };
  }
  const b = r.p([2, 3]), k = r.p([2, 3, 4, 5]), o = { g: 'eksp', k, c: 0, b }, N = b === 2 ? r.i(6, 8) : r.i(5, 6), vals = [1, 2, 3, 4].map(n => k * Math.pow(b, n));
  const base = `Bilangan bakteria dalam satu kultur pada jam ke-1, ke-2, ke-3 dan ke-4 ialah ${vals.join(', ')}.`;
  let h = 1; while (k * Math.pow(b, h) <= 1000) h++;
  return { q1: `${base}<br>(a) Buat kesimpulan umum secara induktif bagi bilangan bakteria pada jam ke-n. (b) Ramalkan bilangan bakteria pada jam ke-${N}. (c) Pada jam ke berapakah bilangan bakteria mula melebihi 1000?`, q2: `${base}<br>(a) Tulis rumus umum bilangan bakteria. (b) Hitung bilangan bakteria pada jam ke-${N}. (c) Bilakah bilangan bakteria pertama kali melebihi 1000?`, q3: `${base} Pola ini berterusan.<br>(a) Bentuk kesimpulan umum. (b) Cari bilangan bakteria pada jam ke-${N}. (c) Tentukan jam pertama bilangannya melebihi 1000.`, ans: `(a) ${lgExpr(o)} (b) ${k * Math.pow(b, N)} (c) Jam ke-${h}`, work: [`${vals.map((v, i) => lgRow(o, i + 1)).join(', ')}`, `(a) ${lgExpr(o)}, n = 1, 2, 3, ...`, `(b) ${lgSub(o, N)}`, `(c) ${lgSub(o, h - 1)} ≤ 1000, ${lgSub(o, h)} > 1000 → jam ke-${h}`], fig: lgBars(vals, 'Bilangan bakteria') };
}
LG.masalah = (r, k) => { const c = lgMasalahData(r, k == null ? null : k % 3); return GEN_LQ('masalah', { c, ans: c.ans, work: c.work }, { fig: c.fig }); };

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '3.1.1': {
    m: [() => LG.kenal(lgRG), () => LG.nilai(lgRG), () => LG.nilai(lgRG), () => LG.nafi(lgRG)],
    s: [() => LG.kuant(lgRG), () => LG.betul(lgRG), () => LG.nafiSemua(lgRG)],
    k: [() => LG.k111(lgRG)]
  },
  '3.1.3': {
    m: [() => LG.majNilai(lgRG), () => LG.majNilai(lgRG), () => LG.pecah(lgRG), () => LG.bina(lgRG)],
    s: [() => LG.pilih(lgRG), () => LG.majNeg(lgRG), () => LG.jadual(lgRG)],
    k: [() => LG.k113(lgRG)]
  },
  '3.1.4': {
    m: [() => LG.tulisImp(lgRG), () => LG.ante(lgRG), () => LG.dwi(lgRG), () => LG.nilaiImp(lgRG)],
    s: [() => LG.akasDll(lgRG), () => LG.akasDll(lgRG), () => LG.penyangkal(lgRG)],
    k: [() => LG.k114(lgRG)]
  },
  '3.2.1': {
    m: [() => LG.jenisHujah(lgRG), () => LG.lengkapK(lgRG), () => LG.kenalBentuk(lgRG)],
    s: [() => LG.lengkapP(lgRG), () => LG.sah(lgRG), () => LG.mun(lgRG), () => LG.dedNum(lgRG)],
    k: [() => LG.k121(lgRG)]
  },
  '3.2.4': {
    m: [() => LG.umum(lgRG), () => LG.umum(lgRG), () => LG.kuat(lgRG)],
    s: [() => LG.umumNom(lgRG), () => LG.sebutan(lgRG), () => LG.yakin(lgRG)],
    k: [() => LG.masalah(lgRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 3.1.1
WG.kenal = i => LG.kenal(lgRW, i);
WG.nilai = i => LG.nilai(lgRW, i);
WG.nafi = i => LG.nafi(lgRW, i);
WG.kuant = i => LG.kuant(lgRW, i);
WG.betul = () => LG.betul(lgRW);
WG.nafiSemua = () => LG.nafiSemua(lgRW);
WG.k111 = () => LG.k111(lgRW);
// 3.1.3
WG.majNilai = i => LG.majNilai(lgRW, i);
WG.pecah = () => LG.pecah(lgRW);
WG.bina = i => LG.bina(lgRW, i);
WG.pilih = () => LG.pilih(lgRW);
WG.majNeg = i => LG.majNeg(lgRW, i);
WG.jadual = i => LG.jadual(lgRW, i + 3);
WG.k113 = () => LG.k113(lgRW);
// 3.1.4
WG.tulisImp = i => LG.tulisImp(lgRW, i);
WG.ante = i => LG.ante(lgRW, i);
WG.dwi = i => LG.dwi(lgRW, i);
WG.nilaiImp = i => LG.nilaiImp(lgRW, i);
WG.akasDll = i => LG.akasDll(lgRW, i);
WG.penyangkal = i => LG.penyangkal(lgRW, i * 2 + 1);
WG.k114 = i => LG.k114(lgRW, i);
// 3.2.1
WG.jenisHujah = i => LG.jenisHujah(lgRW, i);
WG.lengkapK = i => LG.lengkapK(lgRW, i);
WG.kenalBentuk = i => LG.kenalBentuk(lgRW, i);
WG.lengkapP = i => LG.lengkapP(lgRW, i);
WG.sah = i => LG.sah(lgRW, i);
WG.mun = i => LG.mun(lgRW, i);
WG.dedNum = i => LG.dedNum(lgRW, i);
WG.k121 = () => LG.k121(lgRW);
// 3.2.4
WG.umum = i => LG.umum(lgRW, i);
WG.kuat = i => LG.kuat(lgRW, i);
WG.umumNom = i => LG.umumNom(lgRW, i);
WG.sebutan = i => LG.sebutan(lgRW, i);
WG.yakin = i => LG.yakin(lgRW, i);
WG.masalah = i => LG.masalah(lgRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '3.1.1': [['m', 'kenal', 6], ['m', 'nilai', 6], ['m', 'nafi', 6], ['s', 'kuant', 4], ['s', 'betul', 2], ['s', 'nafiSemua', 3], ['k', 'k111', 3]],
  '3.1.3': [['m', 'majNilai', 7], ['m', 'pecah', 5], ['m', 'bina', 6], ['s', 'pilih', 3], ['s', 'majNeg', 3], ['s', 'jadual', 3], ['k', 'k113', 3]],
  '3.1.4': [['m', 'tulisImp', 5], ['m', 'ante', 4], ['m', 'dwi', 4], ['m', 'nilaiImp', 5], ['s', 'akasDll', 6], ['s', 'penyangkal', 3], ['k', 'k114', 3]],
  '3.2.1': [['m', 'jenisHujah', 5], ['m', 'lengkapK', 8], ['m', 'kenalBentuk', 5], ['s', 'lengkapP', 2], ['s', 'sah', 3], ['s', 'mun', 2], ['s', 'dedNum', 2], ['k', 'k121', 3]],
  '3.2.4': [['m', 'umum', 10], ['m', 'kuat', 8], ['s', 'umumNom', 3], ['s', 'sebutan', 3], ['s', 'yakin', 3], ['k', 'masalah', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function lgOpts(ans, cands) {
  const w = []; shuffle(cands).forEach(c => { if (c !== ans && !w.includes(c) && w.length < 3) w.push(c); });
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const lgMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const lgCol = f => LGROWS.map(([p, q]) => lgB1(f(p, q))).join(', ');
const LGCOLS = [['p dan q', (p, q) => p && q], ['p atau q', (p, q) => p || q], ['Jika p, maka q', (p, q) => !p || q], ['p jika dan hanya jika q', (p, q) => p === q]].concat(LGFORMS);
const CQGEN = {
  pernyataan: [
    () => { const o = lgSt(lgRG), nots = shuffle(LGNOT).slice(0, 3).map(x => x[0]); const opts = shuffle([o.s + '.', ...nots]); return lgMcq('Antara berikut, yang manakah <b>pernyataan</b>?', lgCards([['PERNYATAAN', 'Ayat yang benar atau palsu, tetapi bukan kedua-duanya', 'tr']], 'Takrif pernyataan'), { opts, c: opts.indexOf(o.s + '.') }); },
    () => { const o = lgSt(lgRG); return lgMcq(`<i>p</i>: ${o.s}. Apakah ~<i>p</i> dan nilai kebenarannya?`, lgCards([['p', o.s, 'tr', o.v]], 'Pernyataan p'), lgOpts(`${o.ns} (${lgB1(!o.v)})`, [`${o.ns} (${lgB1(o.v)})`, `${o.s} (${lgB1(!o.v)})`, `${o.s} (${lgB1(o.v)})`])); },
    () => { const [s, v] = pick(LGQ.filter(x => x[0].startsWith('Semua'))), rest = lgLow(s.slice(6)); const ns = 'Bukan semua ' + rest; return lgMcq(`Apakah penafian bagi "${s}"?`, lgCards([['p', s, 'tr', v]], 'Pernyataan semua'), lgOpts(ns, ['Semua ' + rest.replace(' ialah ', ' bukan ').replace(' mempunyai ', ' tidak mempunyai '), 'Sebilangan ' + rest, 'Tiada ' + rest])); }
  ],
  majmuk: [
    () => { const [n, f] = pick(LGCOLS.slice(0, 2)); return lgMcq(`Lajur manakah ialah nilai kebenaran "<b>${n}</b>" bagi baris (p, q) = (B, B), (B, P), (P, B), (P, P)?`, lgTT(['p', 'q', n], LGROWS.map(([p, q]) => [p, q, '?']), 2), lgOpts(lgCol(f), ['B, P, P, P', 'B, B, B, P', 'P, B, B, B', 'B, P, B, B', 'P, P, P, B'])); },
    () => {
      const c = pick(['dan', 'atau']), want = Math.random() < .5, mk = v => { for (let t = 0; t < 80; t++) { const [A, B] = lgSt2(lgRG, Math.random() < .5, Math.random() < .5), w = c === 'dan' ? A.v && B.v : A.v || B.v; if (w === v) return `${A.s} ${c} ${lgLow(B.s)}`; } return null; };
      const ans = mk(want), w = []; while (w.length < 3) { const t = mk(!want); if (t && !w.includes(t)) w.push(t); }
      const opts = shuffle([ans, ...w]); return lgMcq(`Pernyataan majmuk manakah <b>${want ? 'benar' : 'palsu'}</b>?`, lgTT(['p', 'q', 'p dan q', 'p atau q'], LGROWS.map(([p, q]) => [p, q, p && q, p || q]), null, 'Jadual kebenaran dan serta atau'), { opts, c: opts.indexOf(ans) });
    },
    () => { const [n, f] = pick(LGFORMS); return lgMcq(`Lajur manakah ialah nilai kebenaran "<b>${n}</b>"?`, lgTT(['p', 'q', n], LGROWS.map(([p, q]) => [p, q, '?'])), lgOpts(lgCol(f), LGCOLS.map(([, g]) => lgCol(g)))); }
  ],
  implikasi: [
    () => { const j = ri(1, 3); return lgMcq(`Apakah <b>${LGIMN[j]}</b> bagi "Jika <i>p</i>, maka <i>q</i>"?`, lgCards([['IMPLIKASI', 'Jika p, maka q', 'pu']]), lgOpts(['', 'Jika q, maka p', 'Jika ~p, maka ~q', 'Jika ~q, maka ~p'][j], ['Jika p, maka q', 'Jika q, maka p', 'Jika ~p, maka ~q', 'Jika ~q, maka ~p'])); },
    () => { const I = lgImp(lgRG), j = ri(1, 3); return lgMcq(`Apakah <b>${LGIMN[j]}</b> bagi implikasi di bawah?`, lgCards([['IMPLIKASI', lgImpTxt(I, 0), 'pu']]), lgOpts(lgImpTxt(I, j), [0, 1, 2, 3].map(x => lgImpTxt(I, x)))); },
    () => { const t = ri(0, 3); const [st, ans] = lgCe(lgRG, [0, 2, 3, 5][t]); const opt = { 0: ['2', ['3', '5', '7', '11']], 1: [ans.replace('x = ', 'x = '), []], 2: [ans, []], 3: ['n = 6', ['n = 4', 'n = 8', 'n = 12', 'n = 16']] }[t]; let cands = opt[1]; if (t === 1) { const k = +ans.replace('x = −', ''); cands = [`x = ${k}`, `x = ${k * k}`, `x = ${2 * k}`, `x = −${k * k}`]; } if (t === 2) { const m = st.match(/x > (\d+), maka x > (\d+)/), b = +m[1], a = +m[2]; cands = [`x = ${a + 1}`, `x = ${a + 3}`, `x = ${b}`, `x = ${b - 1}`]; } return lgMcq(`Yang manakah <b>contoh penyangkal</b> bagi pernyataan di bawah?`, lgCards([['PERNYATAAN', st, 'pu']]), lgOpts(opt[0], cands)); }
  ],
  hujah: [
    () => { const b = lgFormI(lgRG); return lgMcq('Apakah kesimpulan yang sah bagi hujah di bawah?', lgArgFig({ P1: b.p1, P2: b.p2, K: '?' }), lgOpts(b.k, [b.nb, lgCap(b.na), b.p2])); },
    () => { const f = pick([2, 3]), b = lgB23(lgRG); const P2 = f === 2 ? lgCap(b.p) + '.' : lgCap(b.nq) + '.', K = f === 2 ? lgCap(b.q) + '.' : lgCap(b.np) + '.'; return lgMcq('Apakah kesimpulan yang sah?', lgArgFig({ P1: b.p1, P2, K: '?' }), lgOpts(K, [lgCap(b.q) + '.', lgCap(b.np) + '.', lgCap(b.p) + '.', lgCap(b.nq) + '.'])); },
    () => { const f = pick([1, 2, 3, 'ak', 'na']), a = lgArg(lgRG, f); return lgMcq('Hujah di bawah ialah ...', lgArgFig(a), lgOpts(a.sah ? LGBN[f] : 'Tidak sah', ['Bentuk I', 'Bentuk II', 'Bentuk III', 'Tidak sah'])); }
  ],
  induktif: [
    () => { const o = lgPola(lgRG, pick(['lin', 'kuad'])), ex = lgExpr(o); return lgMcq(`Kesimpulan umum bagi ${[1, 2, 3].map(n => lgRow(o, n)).join(', ')}, ... ialah`, lgBars([1, 2, 3].map(n => lgTv(o, n))), lgOpts(ex, [lgExpr(Object.assign({}, o, { c: o.c + o.k })), lgExpr(Object.assign({}, o, { g: o.g === 'lin' ? 'kuad' : 'lin' })), lgExpr(Object.assign({}, o, { c: -o.c })), lgExpr(Object.assign({}, o, { k: o.k + 1 }))])); },
    () => { const o = lgPola(lgRG, 'lin'), ex = lgExpr(o); return lgMcq(`Kesimpulan umum bagi ${lgSeq(o).join(', ')}, ... ialah`, lgBars([1, 2, 3, 4].map(n => lgTv(o, n))), lgOpts(ex, [lgExpr({ g: 'lin', k: o.k, c: o.c + o.k }), lgExpr({ g: 'lin', k: lgTv(o, 1), c: o.k }), lgExpr({ g: 'lin', k: o.k + 1, c: o.c - 1 }), lgExpr({ g: 'kuad', k: 1, c: o.c }), lgExpr({ g: 'lin', k: o.k, c: -o.c })])); },
    () => { const o = lgPola(lgRG), N = o.g === 'eksp' ? ri(5, 7) : ri(8, 20), v = lgTv(o, N); return lgMcq(`Kesimpulan umum suatu pola ialah ${lgExpr(o)}. Berapakah sebutan ke-${N}?`, lgBars([1, 2, 3].map(n => lgTv(o, n)).concat([0]), 'Pola', true), lgOpts(fmt(v), [fmt(lgTv(o, N - 1)), fmt(lgTv(o, N + 1)), fmt(v + o.k), fmt(v - o.k), fmt(v + 1)])); }
  ]
};
const CQT = { pernyataan: 'Pernyataan & penafian', majmuk: 'Pernyataan majmuk', implikasi: 'Implikasi', hujah: 'Hujah deduktif', induktif: 'Hujah induktif' };
function lgCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.pernyataan;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['pernyataan', 'pernyataan', 'majmuk', 'implikasi', 'hujah', 'induktif'] : Object.keys(CQT);
  return lgCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return lgCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
