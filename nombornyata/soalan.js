'use strict';
/* =================== NOMBOR NYATA · SOALAN BAB 1 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "nn" / "NN".

/* ---------- pembantu nombor ---------- */
const nnG = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const nnQ = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = nnG(n, d); return { n: n / g, d: d / g }; };
const nnAdd = (a, b) => nnQ(a.n * b.d + b.n * a.d, a.d * b.d);
const nnSub = (a, b) => nnQ(a.n * b.d - b.n * a.d, a.d * b.d);
const nnMul = (a, b) => nnQ(a.n * b.n, a.d * b.d);
const nnDiv = (a, b) => nnQ(a.n * b.d, a.d * b.n);
const nnV = a => a.n / a.d;
const nnM = s => String(s).replace(/-/g, '−');
const nnS = a => nnM(a.d === 1 ? '' + a.n : `${a.n}/${a.d}`);           // 3/4, −5/2, 7
const nnP = a => (a.n < 0 ? `(${nnS(a)})` : nnS(a));                     // berkurung jika negatif
const nnDec = x => nnM(String(Math.round(x * 1e6) / 1e6));
const nnDP = x => (x < 0 ? `(${nnDec(x)})` : nnDec(x));
const nnRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const nnRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const nnNZ = (r, a, b) => { let v; do v = r.i(a, b); while (v === 0); return v; };
const nnShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = r.i(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ---------- senarai nombor untuk 1.1 ---------- */
// [teks, nilai, nisbah?, sebab]
const NNPOOL = () => [
  ['7', 7, 1, 'nombor bulat boleh ditulis 7/1'], ['−12', -12, 1, 'integer boleh ditulis −12/1'], ['0', 0, 1, '0 = 0/1'],
  ['3/8', .375, 1, 'sudah dalam bentuk a/b'], ['−5/6', -5 / 6, 1, 'sudah dalam bentuk a/b'], ['2½', 2.5, 1, '2½ = 5/2'],
  ['0.75', .75, 1, 'perpuluhan terhingga: 0.75 = 3/4'], ['−1.2', -1.2, 1, 'perpuluhan terhingga: −1.2 = −6/5'],
  ['0.333…', 1 / 3, 1, 'perpuluhan berulang: 0.333… = 1/3'], ['0.1818…', 2 / 11, 1, 'perpuluhan berulang: 0.1818… = 2/11'],
  ['√25', 5, 1, '√25 = 5 (25 ialah kuasa dua sempurna)'], ['√49', 7, 1, '√49 = 7'], ['∛27', 3, 1, '∛27 = 3 (27 ialah kuasa tiga sempurna)'], ['∛(−8)', -2, 1, '∛(−8) = −2'],
  ['π', Math.PI, 0, 'π = 3.14159… perpuluhan tak terhingga dan tak berulang'], ['√2', Math.SQRT2, 0, '2 bukan kuasa dua sempurna; √2 = 1.41421… tidak berulang'],
  ['√7', Math.sqrt(7), 0, '7 bukan kuasa dua sempurna; √7 = 2.6457… tidak berulang'], ['√15', Math.sqrt(15), 0, '15 bukan kuasa dua sempurna'],
  ['∛10', Math.cbrt(10), 0, '10 bukan kuasa tiga sempurna'], ['0.101001000…', .101001, 0, 'perpuluhan tak terhingga dan tidak berulang']
];
const NNORD = () => [
  ['−3', -3], ['−2.5', -2.5], ['−7/4', -1.75], ['−1', -1], ['−0.6', -.6], ['−1/3', -1 / 3], ['0', 0], ['0.4', .4], ['1/2', .5], ['3/4', .75],
  ['1.2', 1.2], ['√2', Math.SQRT2], ['1.5', 1.5], ['√3', Math.sqrt(3)], ['2', 2], ['9/4', 2.25], ['√5', Math.sqrt(5)], ['2.8', 2.8], ['π', Math.PI], ['3.2', 3.2], ['√10', Math.sqrt(10)]
];

/* =================== QV: cara tanya =================== */
const QV = {
  kelas: [
    d => ({ q: `Adakah ${d.t} nombor nisbah atau nombor tak nisbah? Beri sebab.` }),
    d => ({ q: `Kelaskan nombor ${d.t} sebagai nombor nisbah atau nombor tak nisbah. Terangkan.` }),
    d => ({ q: `${vnama()} berkata ${d.t} ialah nombor ${d.salah}. Adakah dia betul? Jelaskan.`, ans: `Tidak. ${d.ans}` }),
    d => ({ q: `Nyatakan sama ada ${d.t} boleh ditulis dalam bentuk a/b (a dan b integer, b ≠ 0).`, ans: `${d.nis ? 'Boleh' : 'Tidak boleh'}. ${d.ans}` })
  ],
  tukar: [
    d => ({ q: d.q1 }),
    d => ({ q: d.q2 }),
    d => ({ q: d.q1.replace('Tukarkan', 'Ungkapkan') })
  ],
  banding: [
    d => ({ q: `Isi petak kosong dengan simbol &lt; atau &gt;:  ${d.a} ☐ ${d.b}` }),
    d => ({ q: `Bandingkan ${d.a} dan ${d.b}. Nombor manakah lebih besar?`, ans: d.besar }),
    d => ({ q: `Gunakan simbol &lt; atau &gt; untuk membanding ${d.a} dengan ${d.b}.` }),
    d => ({ q: `Pada garis nombor, nombor manakah terletak lebih ke kanan: ${d.a} atau ${d.b}?`, ans: d.besar })
  ],
  susun: [
    d => ({ q: `Susun nombor berikut mengikut tertib ${d.tertib}: ${d.list}` }),
    d => ({ q: `Tulis nombor-nombor ini dalam tertib ${d.tertib}: ${d.list}` }),
    d => ({ q: `${vnama()} mahu menyusun ${d.list} mengikut tertib ${d.tertib}. Bantu dia.` })
  ],
  campur: [
    d => ({ q: `Diberi senarai nombor: ${d.list}. (a) Nyatakan nombor tak nisbah. (b) Susun semua nombor mengikut tertib ${d.tertib}.` }),
    d => ({ q: `Daripada ${d.list}, kenal pasti nombor tak nisbah. Kemudian, susun semua nombor itu mengikut tertib ${d.tertib}.` })
  ],
  kira: [
    d => ({ q: `Hitung: ${d.e}` }),
    d => ({ q: `Cari nilai bagi ${d.e}` }),
    d => ({ q: `Nilaikan ${d.e} tanpa menggunakan kalkulator.` }),
    d => ({ q: `Selesaikan: ${d.e}` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} mendapat ${d.wrong} bagi ${d.e}. Adakah jawapannya betul?` }, salah(N, d.ans, d.why || 'Ikut tertib operasi: kurungan, × ÷, kemudian + −.')); }
  ],
  hukum: [
    d => ({ q: `Hitung ${d.e} dengan cara yang paling mudah. Nyatakan hukum yang digunakan.` }),
    d => ({ q: `Gunakan hukum operasi asas aritmetik untuk menghitung ${d.e} tanpa kalkulator.` }),
    d => ({ q: `Cari nilai ${d.e} secara efisien.` })
  ],
  masalah: [d => ({ q: d.q }), d => ({ q: d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') }), d => ({ q: d.q.replace('Berapakah', 'Cari').replace(/\?$/, '.') })],
  sempurna: [
    d => ({ q: `Tentukan sama ada ${d.N} ialah ${d.jenis}. Tunjukkan cara.` }),
    d => ({ q: `Adakah ${d.N} ${d.jenis}? Jelaskan.` }),
    d => ({ q: `Dengan memfaktorkan ${d.N}, tentukan sama ada nombor itu ${d.jenis}.` })
  ],
  anggar: [
    d => ({ q: `Tanpa kalkulator, nyatakan dua integer berturutan yang terletak di antara ${d.e}.` }),
    d => ({ q: `${d.e} terletak di antara dua integer berturutan. Nyatakan integer itu.` }),
    d => ({ q: `Anggarkan ${d.e}: di antara integer berturutan manakah nilainya?` })
  ]
};

/* =================== penjana =================== */
const NN = {};
// ---- 1.1 ----
NN.kelas = r => {
  const [t, , nis, why] = r.p(NNPOOL());
  return GEN_LQ('kelas', { t, nis, salah: nis ? 'tak nisbah' : 'nisbah', ans: `${t} ialah nombor ${nis ? 'nisbah' : 'tak nisbah'} kerana ${why}.`, work: [why, nis ? 'Nombor yang boleh ditulis a/b ialah nombor nisbah.' : 'Nombor yang tidak boleh ditulis a/b ialah nombor tak nisbah.'] });
};
const NNFRAC = [[1, 4], [3, 4], [1, 5], [2, 5], [3, 8], [5, 8], [7, 20], [9, 25], [1, 8], [3, 5], [7, 4], [6, 5], [11, 20], [13, 25]];
const NNREC = [[1, 3, '0.<span style="text-decoration:overline">3</span>'], [2, 3, '0.<span style="text-decoration:overline">6</span>'], [1, 9, '0.<span style="text-decoration:overline">1</span>'], [4, 9, '0.<span style="text-decoration:overline">4</span>'], [5, 9, '0.<span style="text-decoration:overline">5</span>'], [1, 11, '0.<span style="text-decoration:overline">09</span>'], [5, 11, '0.<span style="text-decoration:overline">45</span>'], [1, 6, '0.1<span style="text-decoration:overline">6</span>'], [5, 6, '0.8<span style="text-decoration:overline">3</span>']];
NN.tukar = r => {
  const mode = r.i(0, 2);
  if (mode === 0) {
    const [a, b] = r.p(NNFRAC), x = a / b, pc = x * 100;
    return GEN_LQ('tukar', { q1: `Tukarkan ${a}/${b} kepada perpuluhan dan peratusan.`, q2: `Ungkapkan pecahan ${a}/${b} sebagai perpuluhan dan sebagai peratusan.`, ans: `${nnDec(x)} dan ${nnDec(pc)}%`, work: [`${a} ÷ ${b} = ${nnDec(x)}`, `${nnDec(x)} × 100% = ${nnDec(pc)}%`] });
  }
  if (mode === 1) {
    const [a, b] = r.p(NNFRAC), x = a / b, dp = nnDec(x).split('.')[1].length, den = 10 ** dp, num = Math.round(x * den);
    return GEN_LQ('tukar', { q1: `Tukarkan ${nnDec(x)} kepada pecahan dalam bentuk termudah.`, q2: `Ungkapkan perpuluhan ${nnDec(x)} sebagai pecahan termudah.`, ans: `${a}/${b}`, work: [`${nnDec(x)} = ${num}/${den}`, `Bahagi dengan FSTB ${nnG(num, den)}: ${a}/${b}`] });
  }
  const [a, b, rep] = r.p(NNREC);
  return GEN_LQ('tukar', { q1: `Tukarkan ${a}/${b} kepada perpuluhan. Adakah perpuluhan itu berulang?`, q2: `Tulis ${a}/${b} sebagai perpuluhan dan nyatakan jenis perpuluhan itu.`, ans: `${rep} (perpuluhan berulang)`, work: [`${a} ÷ ${b} = ${nnDec(a / b).slice(0, 7)}…`, `Digit berulang tanpa henti, ditulis ${rep}. Ia nombor nisbah.`] });
};
NN.banding = r => {
  let A, B;
  do { const L = NNORD(); A = r.p(L); B = r.p(L); } while (A[0] === B[0] || Math.abs(A[1] - B[1]) < 0.05);
  const s = A[1] < B[1] ? '&lt;' : '&gt;';
  return GEN_LQ('banding', { a: A[0], b: B[0], besar: `${A[1] > B[1] ? A[0] : B[0]} lebih besar`, ans: `${A[0]} ${s} ${B[0]}`, work: [`${A[0]} ≈ ${nnDec(Math.round(A[1] * 1000) / 1000)}, ${B[0]} ≈ ${nnDec(Math.round(B[1] * 1000) / 1000)}`, `Maka ${A[0]} ${s} ${B[0]}`] });
};
const nnPickN = (r, n, need0) => {
  for (let t = 0; t < 200; t++) {
    const L = nnShuf(r, NNORD()).slice(0, n);
    const v = L.map(x => x[1]).sort((a, b) => a - b);
    if (v.some((x, i) => i && x - v[i - 1] < 0.04)) continue;
    if (need0 && !L.some(x => x[1] < 0)) continue;
    return L;
  }
  return NNORD().slice(0, n);
};
NN.susun = r => {
  const L = nnPickN(r, 5, true), naik = r.i(0, 1) === 1, S = L.slice().sort((a, b) => naik ? a[1] - b[1] : b[1] - a[1]);
  return GEN_LQ('susun', { list: L.map(x => x[0]).join(', '), tertib: naik ? 'menaik' : 'menurun', ans: S.map(x => x[0]).join(', '), work: [L.map(x => `${x[0]} ≈ ${nnDec(Math.round(x[1] * 100) / 100)}`).join('; '), `Tertib ${naik ? 'menaik (kecil → besar)' : 'menurun (besar → kecil)'}: ${S.map(x => x[0]).join(', ')}`] });
};
NN.campur = r => {
  let L; do L = nnPickN(r, 6, true); while (!L.some(x => ['√2', '√3', '√5', 'π', '√10'].includes(x[0])));
  const naik = r.i(0, 1) === 1, S = L.slice().sort((a, b) => naik ? a[1] - b[1] : b[1] - a[1]);
  const tak = L.filter(x => ['√2', '√3', '√5', 'π', '√10'].includes(x[0])).map(x => x[0]);
  return GEN_LQ('campur', { list: L.map(x => x[0]).join(', '), tertib: naik ? 'menaik' : 'menurun', ans: `(a) ${tak.join(', ')}  (b) ${S.map(x => x[0]).join(', ')}`, work: [`Tak nisbah: ${tak.join(', ')} (perpuluhan tak berulang)`, L.map(x => `${x[0]} ≈ ${nnDec(Math.round(x[1] * 100) / 100)}`).join('; '), S.map(x => x[0]).join(', ')] });
};
// ---- 1.2 ----
NN.tertib = r => {
  const k = r.i(0, 3), a = r.i(2, 9), b = r.i(2, 9), c = r.i(1, 9), d = nnNZ(r, -9, 9);
  let e, v, w, wrong;
  if (k === 0) { v = 40 + a - b * (c + d); e = `${40 + a} − ${b} × (${c} + ${nnP({ n: d, d: 1 })})`; w = [`Kurungan: ${c} + ${nnP({ n: d, d: 1 })} = ${nnM(c + d)}`, `Darab: ${b} × ${nnP({ n: c + d, d: 1 })} = ${nnM(b * (c + d))}`, `${40 + a} − ${nnP({ n: b * (c + d), d: 1 })} = ${nnM(v)}`]; wrong = (40 + a - b) * (c + d); }
  else if (k === 1) { const p = a * b * c; v = p / a * b; e = `${p} ÷ ${a} × ${b}`; w = [`Dari kiri ke kanan: ${p} ÷ ${a} = ${p / a}`, `${p / a} × ${b} = ${v}`]; wrong = p / (a * b); }
  else if (k === 2) { v = -a * b + c * d; e = `(−${a}) × ${b} + ${c} × ${nnP({ n: d, d: 1 })}`; w = [`(−${a}) × ${b} = −${a * b}`, `${c} × ${nnP({ n: d, d: 1 })} = ${nnM(c * d)}`, `−${a * b} + ${nnP({ n: c * d, d: 1 })} = ${nnM(v)}`]; wrong = (-a * b + c) * d; }
  else { const m = a * c; v = (-m) / a - b * d; e = `(−${m}) ÷ ${a} − ${b} × ${nnP({ n: d, d: 1 })}`; w = [`(−${m}) ÷ ${a} = −${c}`, `${b} × ${nnP({ n: d, d: 1 })} = ${nnM(b * d)}`, `−${c} − ${nnP({ n: b * d, d: 1 })} = ${nnM(v)}`]; wrong = (-c - b) * d; }
  if (wrong === v) wrong = v + 2;
  return GEN_LQ('kira', { e, ans: nnM(v), wrong: nnM(wrong), work: w });
};
const NNF = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6], [2, 5], [3, 5], [1, 8], [3, 8]];
NN.pecahan = r => {
  const f = () => { const [a, b] = r.p(NNF); return nnQ(r.i(0, 3) ? a : -a, b); };
  const A = f(), B = f(), k = r.i(0, 2); let Cn; do Cn = nnQ(nnNZ(r, -4, 4), r.p([1, 1, 2, 3])); while (Cn.d === 1 && Math.abs(Cn.n) === 1);
  let e, v, w;
  if (k === 0) { const m = nnMul(B, Cn); v = nnAdd(A, m); e = `${nnS(A)} + ${nnP(B)} × ${nnP(Cn)}`; w = [`Darab dahulu: ${nnP(B)} × ${nnP(Cn)} = ${nnS(m)}`, `${nnS(A)} + ${nnP(m)} = ${nnS(v)}`]; }
  else if (k === 1) { const s = nnSub(A, B); v = nnMul(s, Cn); e = `(${nnS(A)} − ${nnP(B)}) × ${nnP(Cn)}`; w = [`Kurungan: ${nnS(A)} − ${nnP(B)} = ${nnS(s)}`, `${nnP(s)} × ${nnP(Cn)} = ${nnS(v)}`]; }
  else { const q = nnDiv(A, B); v = nnSub(q, Cn); e = `${nnP(A)} ÷ ${nnP(B)} − ${nnP(Cn)}`; w = [`Bahagi: ${nnP(A)} ÷ ${nnP(B)} = ${nnP(A)} × ${nnS(nnQ(B.d, B.n))} = ${nnS(q)}`, `${nnS(q)} − ${nnP(Cn)} = ${nnS(v)}`]; }
  const wrong = nnS(nnAdd(v, nnQ(1, 2)));
  return GEN_LQ('kira', { e, ans: nnS(v), wrong, work: w, why: 'Tukar pecahan kepada penyebut sepunya dan ikut tertib operasi.' });
};
NN.perpuluhan = r => {
  // guna integer (persepuluh) supaya tepat
  const a = r.i(2, 9), b = r.p([2, 4, 5]), d = nnNZ(r, -6, 6), k = r.i(0, 1); let c; do c = r.i(11, 49); while (c % 10 === 0);
  let e, v, w;
  if (k === 0) { const A = -a * b; v = -a + (c / 10) * d; e = `${nnDec(A / 10)} ÷ ${nnDec(b / 10)} + ${nnDec(c / 10)} × ${nnP({ n: d, d: 1 })}`; w = [`${nnDec(A / 10)} ÷ ${nnDec(b / 10)} = −${a}`, `${nnDec(c / 10)} × ${nnP({ n: d, d: 1 })} = ${nnDec(c * d / 10)}`, `−${a} + ${nnDP(c * d / 10)} = ${nnDec(Math.round(v * 10) / 10)}`]; }
  else { v = (c / 10 - a) * d; e = `(${nnDec(c / 10)} − ${a}) × ${nnP({ n: d, d: 1 })}`; w = [`Kurungan: ${nnDec(c / 10)} − ${a} = ${nnDec((c - 10 * a) / 10)}`, `${nnDP((c - 10 * a) / 10)} × ${nnP({ n: d, d: 1 })} = ${nnDec(Math.round(v * 10) / 10)}`]; }
  const ans = nnDec(Math.round(v * 10) / 10);
  return GEN_LQ('kira', { e, ans, wrong: nnDec(Math.round(v * 10) / 10 + 1), work: w });
};
NN.hukum = r => {
  const k = r.i(0, 3);
  if (k === 0) { const n = r.i(12, 39); return GEN_LQ('hukum', { e: `25 × ${n} × 4`, ans: `${100 * n}`, work: [`Kalis tukar dan sekutuan darab: (25 × 4) × ${n}`, `= 100 × ${n} = ${100 * n}`] }); }
  if (k === 1) { const a = r.i(3, 12), b = r.p([99, 98, 101, 102, 999]); return GEN_LQ('hukum', { e: `${a} × ${b}`, ans: `${a * b}`, work: [`Kalis agihan: ${a} × (${b > 100 && b < 200 ? '100 + ' + (b - 100) : b === 999 ? '1000 − 1' : '100 − ' + (100 - b)})`, `= ${b === 999 ? a * 1000 + ' − ' + a : b > 100 ? a * 100 + ' + ' + a * (b - 100) : a * 100 + ' − ' + a * (100 - b)} = ${a * b}`] }); }
  if (k === 2) { const p = r.i(11, 39), q = 50 - p, m = r.i(12, 48); return GEN_LQ('hukum', { e: `${nnDec(p / 10)} + ${nnDec(m / 10)} + ${nnDec(q / 10)}`, ans: nnDec((p + q + m) / 10), work: [`Kalis tukar dan sekutuan tambah: (${nnDec(p / 10)} + ${nnDec(q / 10)}) + ${nnDec(m / 10)}`, `= 5 + ${nnDec(m / 10)} = ${nnDec((50 + m) / 10)}`] }); }
  const a = r.p([3, 4, 6, 8]), b = r.i(13, 37), c = 100 - b; return GEN_LQ('hukum', { e: `${a} × ${b} + ${a} × ${c}`, ans: `${a * 100}`, work: [`Kalis agihan: ${a} × (${b} + ${c})`, `= ${a} × 100 = ${a * 100}`] });
};
const nnRM = v => 'RM' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
NN.masalah12 = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) {
    const [p, q] = r.p([[5, 4], [4, 3], [6, 5], [3, 2], [5, 3]]), s = r.p([300, 450, 500, 600, 750, 800]);
    // beri 1/p kepada ibu; (q-1)/q baki kepada isteri; simpan 1/q baki
    const g = s * p * q / (p - 1);
    if (!Number.isInteger(g)) return NN.masalah12(r, 1);
    const nm = vnama();
    return GEN_LQ('masalah', { q: `${nm} memberikan 1/${p} daripada gaji bulanannya kepada ibunya. Kemudian, ${q - 1}/${q} daripada baki gaji digunakan untuk perbelanjaan rumah dan selebihnya disimpan. Jumlah simpanan ialah ${nnRM(s)}. Berapakah gaji bulanan ${nm}?`, ans: nnRM(g), work: [`Baki selepas ibu = ${p - 1}/${p} gaji`, `Simpanan = 1/${q} × ${p - 1}/${p} = ${nnS(nnQ(p - 1, p * q))} gaji`, `Gaji = ${nnRM(s)} ÷ ${nnS(nnQ(p - 1, p * q))} = ${nnRM(g)}`] });
  }
  if (k === 1) {
    const t0 = r.i(-8, 5), up = r.i(3, 9), h = r.i(2, 5), dn = r.i(10, 25), t = t0 + up * h - dn;
    return GEN_LQ('masalah', { q: `Suhu di sebuah makmal pada waktu pagi ialah ${nnM(t0)}°C. Suhu meningkat ${up}°C setiap jam selama ${h} jam, kemudian turun sebanyak ${dn}°C. Berapakah suhu akhir makmal itu?`, ans: `${nnM(t)}°C`, work: [`${nnM(t0)} + ${up} × ${h} − ${dn}`, `= ${nnM(t0)} + ${up * h} − ${dn}`, `= ${nnM(t)}°C`] });
  }
  if (k === 2) {
    const n = r.p([24, 30, 36, 40, 48]), harga = r.p([1.5, 1.8, 2.2, 2.5]), jual = r.p([3, 4, 5]), lebih = r.i(2, 6);
    const kos = Math.round(n * harga * 100) / 100, dapat = (n - lebih) * jual, untung = Math.round((dapat - kos) * 100) / 100;
    return GEN_LQ('masalah', { q: `Koperasi sekolah membeli ${n} botol air dengan harga RM${harga.toFixed(2)} sebotol. Semua botol kecuali ${lebih} botol dijual dengan harga RM${jual} sebotol. Berapakah keuntungan koperasi?`, ans: `RM${untung.toFixed(2)}`, work: [`Kos = ${n} × RM${harga.toFixed(2)} = RM${kos.toFixed(2)}`, `Jualan = (${n} − ${lebih}) × RM${jual} = RM${dapat}.00`, `Untung = RM${dapat}.00 − RM${kos.toFixed(2)} = RM${untung.toFixed(2)}`] });
  }
  const tot = r.p([1200, 1500, 1800, 2400, 3000]), [a, b] = r.p([[1, 4], [1, 3], [2, 5], [3, 10]]), pc = r.p([10, 20, 25, 40]);
  const x = tot * a / b, baki = tot - x, y = baki * pc / 100, sisa = baki - y;
  return GEN_LQ('masalah', { q: `Sebuah keluarga menerima pendapatan ${nnRM(tot)} sebulan. ${a}/${b} daripadanya digunakan untuk sewa rumah dan ${pc}% daripada baki digunakan untuk makanan. Berapakah wang yang tinggal?`, ans: nnRM(sisa), work: [`Sewa = ${a}/${b} × ${nnRM(tot)} = ${nnRM(x)}`, `Baki = ${nnRM(baki)}; makanan = ${pc}% × ${nnRM(baki)} = ${nnRM(y)}`, `Tinggal = ${nnRM(baki)} − ${nnRM(y)} = ${nnRM(sisa)}`] });
};
// ---- 1.3 ----
NN.kuasa = r => {
  const k = r.i(0, 6), n = r.i(2, 15), m = r.i(2, 9);
  const L = [
    () => [`${n}²`, n * n, [`${n}² = ${n} × ${n} = ${n * n}`]],
    () => [`${m}³`, m ** 3, [`${m}³ = ${m} × ${m} × ${m} = ${m ** 3}`]],
    () => [`√${n * n}`, n, [`${n} × ${n} = ${n * n}`, `maka √${n * n} = ${n}`]],
    () => [`∛${m ** 3}`, m, [`${m} × ${m} × ${m} = ${m ** 3}`, `maka ∛${m ** 3} = ${m}`]],
    () => [`(−${m})³`, -(m ** 3), [`(−${m}) × (−${m}) × (−${m}) = −${m ** 3}`]],
    () => [`∛(−${m ** 3})`, -m, [`(−${m})³ = −${m ** 3}`, `maka ∛(−${m ** 3}) = −${m}`]],
    () => { const [a, b] = r.p([[2, 3], [3, 4], [1, 5], [2, 5], [3, 7]]); return [`(${a}/${b})²`, `${a * a}/${b * b}`, [`${a}/${b} × ${a}/${b} = ${a * a}/${b * b}`]]; }
  ][k]();
  const ans = typeof L[1] === 'number' ? nnM(L[1]) : L[1];
  return GEN_LQ('kira', { e: L[0], ans, wrong: typeof L[1] === 'number' ? nnM(L[1] * 2 || 1) : '1', work: L[2], why: 'Kuasa bermaksud pendaraban berulang.' });
};
const nnFac = n => { const f = []; let d = 2; while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; } return f; };
NN.sempurna = r => {
  const cube = r.i(0, 1) === 1;
  let N;
  if (cube) N = r.i(0, 1) ? r.i(2, 10) ** 3 : r.p([36, 48, 72, 100, 200, 250, 500, 81, 128]);
  else N = r.i(0, 1) ? r.i(4, 20) ** 2 : r.p([48, 72, 75, 90, 98, 108, 120, 150, 180, 200]);
  const f = nnFac(N), cnt = {}; f.forEach(p => cnt[p] = (cnt[p] || 0) + 1);
  const ok = Object.values(cnt).every(c => c % (cube ? 3 : 2) === 0);
  const root = cube ? Math.round(Math.cbrt(N)) : Math.round(Math.sqrt(N));
  const grp = Object.keys(cnt).map(p => `${p}${cnt[p] > 1 ? '^' + cnt[p] : ''}`).join(' × ').replace(/\^(\d+)/g, (m, d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'.split('').map((c, i) => [i, c]).filter(x => ('' + d).includes('' + x[0])).map(x => x[1]).join(''));
  return GEN_LQ('sempurna', { N, jenis: cube ? 'kuasa tiga sempurna' : 'kuasa dua sempurna', ans: ok ? `Ya, ${N} = ${cube ? root + ' × ' + root + ' × ' + root : root + ' × ' + root}` : `Bukan ${cube ? 'kuasa tiga' : 'kuasa dua'} sempurna`, work: [`${N} = ${f.join(' × ')}`, ok ? `Faktor dapat dikumpul dalam ${cube ? 'tiga' : 'dua'} kumpulan yang sama, maka ${N} ialah ${cube ? 'kuasa tiga' : 'kuasa dua'} sempurna.` : `Faktor tidak dapat dikumpul dalam ${cube ? 'tiga' : 'dua'} kumpulan yang sama.`] });
};
NN.anggar = r => {
  const cube = r.i(0, 3) === 0;
  let N, lo; do { N = cube ? r.i(10, 900) : r.i(10, 390); lo = cube ? Math.floor(Math.cbrt(N) + 1e-9) : Math.floor(Math.sqrt(N)); } while ((cube ? lo ** 3 : lo * lo) === N);
  const hi = lo + 1, p = cube ? (x => x ** 3) : (x => x * x), sym = cube ? '∛' : '√';
  return GEN_LQ('anggar', { e: `${sym}${N}`, ans: `${lo} dan ${hi}  (${lo} &lt; ${sym}${N} &lt; ${hi})`, work: [`${p(lo)} &lt; ${N} &lt; ${p(hi)}`, `${sym}${p(lo)} &lt; ${sym}${N} &lt; ${sym}${p(hi)}`, `${lo} &lt; ${sym}${N} &lt; ${hi}`] });
};
NN.gabung = r => {
  const a = r.i(2, 5), b = r.i(2, 9), c = r.i(2, 12), d = r.i(2, 6), k = r.i(0, 2);
  let e, v, w;
  if (k === 0) { v = a * b * b - c + d; e = `${a} × ${b}² − √${c * c} + ∛${d ** 3}`; w = [`${b}² = ${b * b}, √${c * c} = ${c}, ∛${d ** 3} = ${d}`, `${a} × ${b * b} − ${c} + ${d}`, `= ${a * b * b} − ${c} + ${d} = ${v}`]; }
  else if (k === 1) { v = (-d) ** 3 + c * c / c * a; e = `(−${d})³ + ${a} × √${c * c}`; w = [`(−${d})³ = −${d ** 3}`, `${a} × √${c * c} = ${a} × ${c} = ${a * c}`, `−${d ** 3} + ${a * c} = ${nnM(-(d ** 3) + a * c)}`]; v = -(d ** 3) + a * c; }
  else { v = -(b * b) + (c * c); e = `−${b}² + (−${c})²`; w = [`−${b}² = −${b * b}`, `(−${c})² = ${c * c}`, `−${b * b} + ${c * c} = ${nnM(v)}`]; }
  return GEN_LQ('kira', { e, ans: nnM(v), wrong: nnM(v + 2 * (k === 2 ? b * b : 2)), work: w, why: k === 2 ? '−b² = −(b × b) tetapi (−c)² = (−c) × (−c).' : 'Kira kuasa dan punca dahulu, kemudian × ÷, akhir sekali + −.' });
};
NN.masalah13 = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { const s = r.i(6, 25); return GEN_LQ('masalah', { q: `Sebuah taman berbentuk segi empat sama mempunyai luas ${s * s} m². Berapakah panjang pagar yang diperlukan untuk memagar sekeliling taman itu?`, ans: `${4 * s} m`, work: [`Sisi = √${s * s} = ${s} m`, `Perimeter = 4 × ${s} = ${4 * s} m`] }); }
  if (k === 1) { const s = r.i(3, 12); return GEN_LQ('masalah', { q: `Sebuah kotak berbentuk kubus mempunyai isi padu ${s ** 3} cm³. Berapakah luas satu permukaan kotak itu?`, ans: `${s * s} cm²`, work: [`Sisi = ∛${s ** 3} = ${s} cm`, `Luas satu permukaan = ${s}² = ${s * s} cm²`] }); }
  if (k === 2) { const a = r.i(3, 9), n = r.p([16, 25, 36, 49, 64]), t = a * a * n; return GEN_LQ('masalah', { q: `Lantai sebuah dewan berbentuk segi empat sama dengan luas ${t} m² akan dipasang jubin segi empat sama bersisi ${a} m. Berapakah bilangan jubin pada satu sisi lantai, dan jumlah jubin yang diperlukan?`, ans: `${Math.sqrt(n)} jubin; ${n} jubin`, work: [`Sisi lantai = √${t} = ${a * Math.sqrt(n)} m`, `Jubin pada satu sisi = ${a * Math.sqrt(n)} ÷ ${a} = ${Math.sqrt(n)}`, `Jumlah jubin = ${Math.sqrt(n)}² = ${n}`] }); }
  const s = r.i(2, 6), m = r.p([2, 3]); const big = s * m;
  return GEN_LQ('masalah', { q: `Sebuah kubus kecil mempunyai isi padu ${s ** 3} cm³. Beberapa kubus kecil disusun untuk membentuk sebuah kubus besar dengan isi padu ${big ** 3} cm³. Berapakah bilangan kubus kecil yang diperlukan?`, ans: `${m ** 3} kubus`, work: [`Sisi kubus kecil = ∛${s ** 3} = ${s} cm; sisi kubus besar = ∛${big ** 3} = ${big} cm`, `Kubus kecil pada satu sisi = ${big} ÷ ${s} = ${m}`, `Bilangan = ${m}³ = ${m ** 3}`] });
};

/* ---------- pecahan bertingkat & punca kuasa (25 Nov) ----------
   Penjana di atas menulis teks biasa (3/4, 2½, √25, ∛(−8)); nnFx menukarnya kepada fr()/rt() pada output akhir.
   Data dalaman (NNPOOL, perbandingan label) kekal teks biasa. Tiada rajah (fig) dalam bab ini. */
const nnFx = s => typeof s !== 'string' ? s : s
  .replace(/(\d+)½/g, (m, w) => w + fr(1, 2))
  .replace(/\b(\d+)\/(\d+)\b/g, (m, a, b) => fr(a, b))
  .replace(/\ba\/b\b/g, () => fr('a', 'b'))
  .replace(/∛\(−(\d+)\)/g, (m, n) => rt('−' + n, 3))
  .replace(/∛(\d+)/g, (m, n) => rt(n, 3))
  .replace(/√(\d+)/g, (m, n) => rt(n));
const nnFixQ = q => { if (!q || typeof q !== 'object') return q; Object.keys(q).forEach(k => { if (k === 'fig') return; const v = q[k]; if (typeof v === 'string') q[k] = nnFx(v); else if (Array.isArray(v)) q[k] = v.map(nnFx); }); return q; };
Object.keys(NN).forEach(k => { const f = NN[k]; NN[k] = (...a) => nnFixQ(f(...a)); });

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '1.1': { m: [() => NN.kelas(nnRG), () => NN.tukar(nnRG), () => NN.banding(nnRG)], s: [() => NN.susun(nnRG)], k: [() => NN.campur(nnRG)] },
  '1.2': { m: [() => NN.tertib(nnRG), () => NN.pecahan(nnRG)], s: [() => NN.perpuluhan(nnRG), () => NN.hukum(nnRG), () => NN.pecahan(nnRG)], k: [() => NN.masalah12(nnRG)] },
  '1.3': { m: [() => NN.kuasa(nnRG), () => NN.sempurna(nnRG)], s: [() => NN.anggar(nnRG), () => NN.gabung(nnRG)], k: [() => NN.masalah13(nnRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {
  kelas: () => NN.kelas(nnRW), tukar: () => NN.tukar(nnRW), banding: () => NN.banding(nnRW), susun: () => NN.susun(nnRW), campur: () => NN.campur(nnRW),
  tertib: () => NN.tertib(nnRW), pecahan: () => NN.pecahan(nnRW), perpuluhan: () => NN.perpuluhan(nnRW), hukum: () => NN.hukum(nnRW), masalah12: i => NN.masalah12(nnRW, i),
  kuasa: () => NN.kuasa(nnRW), sempurna: () => NN.sempurna(nnRW), anggar: () => NN.anggar(nnRW), gabung: () => NN.gabung(nnRW), masalah13: i => NN.masalah13(nnRW, i)
};
const WSPLAN = {
  '1.1': [['m', 'kelas', 6], ['m', 'tukar', 6], ['m', 'banding', 6], ['s', 'susun', 9], ['k', 'campur', 3]],
  '1.2': [['m', 'tertib', 9], ['m', 'pecahan', 9], ['s', 'perpuluhan', 4], ['s', 'hukum', 5], ['k', 'masalah12', 3]],
  '1.3': [['m', 'kuasa', 10], ['m', 'sempurna', 8], ['s', 'anggar', 4], ['s', 'gabung', 5], ['k', 'masalah13', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function nnOpts(ans, wrongs) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(wrongs)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const c = nnM(String((parseFloat(String(ans).replace('−', '-')) || 0) + k * (k % 2 ? 1 : -1))); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]); return { type: 'mcq', q: '', fig: '', opts, c: opts.indexOf(ans) };
}
const nnMcq = (q, ans, wrongs) => Object.assign(nnOpts(ans, wrongs), { q });
const CQGEN = {
  nisbah: L => {
    if (L === 0 || Math.random() < .5) {
      const P = NNPOOL(), tak = P.filter(x => !x[2]), nis = P.filter(x => x[2]), wantTak = Math.random() < .5;
      const a = pick(wantTak ? tak : nis), others = shuffle(wantTak ? nis : tak).slice(0, 3).map(x => x[0]);
      return nnMcq(`Antara berikut, yang manakah nombor ${wantTak ? 'tak nisbah' : 'nisbah'}?`, a[0], others);
    }
    const L5 = nnPickN(nnRG, 4, false), S = L5.slice().sort((a, b) => a[1] - b[1]);
    return nnMcq('Antara berikut, yang manakah nombor paling kecil?', S[0][0], S.slice(1).map(x => x[0]));
  },
  operasi: L => {
    const a = ri(2, 9), b = ri(2, 9), c = ri(1, 9), d = nz(-6, 6);
    if (L === 0) { const v = 30 + a - b * c; return nnMcq(`Hitung: ${30 + a} − ${b} × ${c}`, nnM(v), [nnM((30 + a - b) * c), nnM(v + b), nnM(-v)]); }
    if (L === 1) { const v = -a * b + c * d; return nnMcq(`Hitung: (−${a}) × ${b} + ${c} × ${nnP({ n: d, d: 1 })}`, nnM(v), [nnM(a * b + c * d), nnM(-a * b - c * d), nnM((-a * b + c) * d)]); }
    const [p, q] = pick(NNF), [r2, t] = pick(NNF), A = nnQ(p, q), B = nnQ(r2, t), v = nnSub(A, nnMul(B, nnQ(d, 1)));
    return nnMcq(`Hitung: ${nnS(A)} − ${nnS(B)} × ${nnP({ n: d, d: 1 })}`, nnS(v), [nnS(nnAdd(A, nnMul(B, nnQ(d, 1)))), nnS(nnMul(nnSub(A, B), nnQ(d, 1))), nnS(nnQ(-v.n, v.d))]);
  },
  kuasa: L => {
    if (L === 2) { let N, lo; do { N = ri(10, 390); lo = Math.floor(Math.sqrt(N)); } while (lo * lo === N); return nnMcq(`√${N} terletak di antara`, `${lo} dan ${lo + 1}`, [`${lo - 1} dan ${lo}`, `${lo + 1} dan ${lo + 2}`, `${lo + 2} dan ${lo + 3}`]); }
    const n = ri(2, 12), m = ri(2, 6), k = ri(0, L === 0 ? 3 : 5);
    const L2 = [[`${n}²`, n * n, [2 * n, n + 2, n * n + n]], [`${m}³`, m ** 3, [3 * m, m * m, m ** 3 + m]], [`√${n * n}`, n, [n * n, 2 * n, n + 1]], [`∛${m ** 3}`, m, [3 * m, m * m, m + 1]], [`(−${m})³`, -(m ** 3), [m ** 3, -3 * m, -(m * m)]], [`−${n}² + (−${m})²`, -(n * n) + m * m, [n * n + m * m, -(n * n) - m * m, n * n - m * m]]][k];
    return nnMcq(`Nilai bagi ${L2[0]} ialah`, nnM(L2[1]), L2[2].map(x => nnM(x)));
  }
};
Object.keys(CQGEN).forEach(k => { const f = CQGEN[k]; CQGEN[k] = L => nnFixQ(f(L)); });
const CQT = { nisbah: 'Nombor nisbah & tak nisbah', operasi: 'Gabungan operasi', kuasa: 'Kuasa & punca kuasa' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
