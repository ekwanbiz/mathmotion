'use strict';
/* =================== NISBAH, KADAR DAN PERKADARAN · SOALAN BAB 3 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "nk" / "NK".

const nkG = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const nkGs = a => a.reduce(nkG);
const nkL = (a, b) => a / nkG(a, b) * b;
const nkR = a => a.join(' : ');
const nkSimp = a => { const g = nkGs(a); return a.map(v => v / g); };
const nkRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const nkRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const nkRM = v => 'RM' + (Number.isInteger(v) ? String(v) : v.toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const nkD = v => String(Math.round(v * 1000) / 1000);
const nkPrim = (r, k, max) => { for (let t = 0; t < 200; t++) { const a = []; for (let i = 0; i < k; i++) a.push(r.i(1, max)); if (nkGs(a) === 1 && new Set(a).size === k) return a; } return k === 2 ? [2, 3] : [2, 3, 4]; };

/* =================== QV =================== */
const QV = {
  tulis: [
    d => ({ q: `${d.cerita} Tulis nisbah ${d.urutan}.` }),
    d => ({ q: `${d.cerita} Nyatakan nisbah ${d.urutan} dalam bentuk termudah.` }),
    d => ({ q: `${d.cerita} Apakah nisbah ${d.urutan}?` })
  ],
  termudah: [
    d => ({ q: `Ungkapkan ${d.e} dalam bentuk termudah.` }),
    d => ({ q: `Permudahkan nisbah ${d.e}.` }),
    d => ({ q: `Tulis ${d.e} sebagai nisbah dalam bentuk termudah.` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} menulis ${d.e} sebagai ${d.wrong} dalam bentuk termudah. Adakah ${N} betul?` }, salah(N, d.ans, 'Bahagi semua sebutan dengan FSTB sehingga tiada faktor sepunya selain 1.')); }
  ],
  setara: [
    d => ({ q: `Cari nilai x jika ${d.e}.` }),
    d => ({ q: `Diberi ${d.e} ialah nisbah setara. Tentukan x.` }),
    d => ({ q: `Lengkapkan nisbah setara: ${d.e.replace('x', '___')}` })
  ],
  gabung: [d => ({ q: d.q }), d => ({ q: d.q.replace('Ungkapkan', 'Tulis') })],
  kadar: [d => ({ q: d.q }), d => ({ q: d.q.replace('Hitung', 'Cari') }), d => ({ q: d.q.replace('Hitung', 'Tentukan') })],
  perkadaran: [
    d => ({ q: `Adakah ${d.e} suatu perkadaran? Tunjukkan pengiraan.` }),
    d => ({ q: `Tentukan sama ada ${d.e} membentuk perkadaran.` }),
    d => ({ q: `${vnama()} berkata ${d.e} ialah perkadaran. Adakah dia betul?`, ans: d.ok ? `Betul. ${d.ans}` : `Tidak betul. ${d.ans}` })
  ],
  cariX: [
    d => ({ q: `Cari nilai x dalam perkadaran ${d.e}.` }),
    d => ({ q: `Dengan kaedah darab silang, selesaikan ${d.e}.` }),
    d => ({ q: `Diberi ${d.e}. Hitung x.` })
  ],
  masalah: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q })]
};

/* =================== penjana =================== */
const NK = {};
// ---- 3.1 ----
const NKCTX = [
  (a, b, c) => [`Sebuah kek memerlukan ${a} cawan tepung, ${b} cawan gula dan ${c} cawan susu.`, ['tepung', 'gula', 'susu']],
  (a, b, c) => [`Dalam sebuah kelas, terdapat ${a} murid lelaki, ${b} murid perempuan dan ${c} orang guru pembimbing.`, ['murid lelaki', 'murid perempuan', 'guru pembimbing']],
  (a, b, c) => [`Sebuah bekas mengandungi ${a} guli merah, ${b} guli biru dan ${c} guli hijau.`, ['guli merah', 'guli biru', 'guli hijau']],
  (a, b, c) => [`Sebuah bengkel menerima ${a} buah kereta, ${b} buah motosikal dan ${c} buah lori minggu ini.`, ['kereta', 'motosikal', 'lori']]
];
NK.tulis = r => {
  const three = r.i(0, 1) === 1, m = r.i(1, 4), base = nkPrim(r, 3, 6).map(v => v * m), [cer, nm] = r.p(NKCTX)(...base);
  const idx = three ? [0, 1, 2] : r.p([[0, 1], [1, 0], [0, 2], [2, 1]]);
  const vals = idx.map(i => base[i]), s = nkSimp(vals);
  return GEN_LQ('tulis', { cerita: cer, urutan: idx.map(i => nm[i]).join(' kepada '), ans: nkR(s), work: [`${idx.map(i => nm[i]).join(' : ')} = ${nkR(vals)}`, nkGs(vals) > 1 ? `Bahagi dengan FSTB ${nkGs(vals)}: ${nkR(s)}` : 'Sudah dalam bentuk termudah.'] });
};
NK.termudah = r => {
  const k = r.p([2, 3]), m = r.p([2, 3, 4, 5, 6, 8, 12]), b = nkPrim(r, k, 9), v = b.map(x => x * m);
  const pp = m % 2 === 0 ? 2 : m % 3 === 0 ? 3 : 5, w = v.map(x => x / pp), wrong = nkR(w) === nkR(b) ? nkR(b.map(x => x * 2)) : nkR(w);
  return GEN_LQ('termudah', { e: nkR(v), ans: nkR(b), wrong, work: [`FSTB bagi ${v.join(', ')} = ${m}`, `${nkR(v)} ÷ ${m} = ${nkR(b)}`] });
};
const NKUNIT = [
  [45, 'minit', 2, 'jam', 60], [40, 'minit', 3, 'jam', 60], [750, 'g', 2, 'kg', 1000], [600, 'g', 4, 'kg', 1000],
  [80, 'cm', 2, 'm', 100], [35, 'cm', 1, 'm', 100], [50, 'sen', 3, 'ringgit (RM3)', 100], [250, 'ml', 2, 'liter', 1000]
];
NK.unit = r => {
  const [a, ua, b, ub, f] = r.p(NKUNIT), B = b * f, s = nkSimp([a, B]);
  return GEN_LQ('termudah', { e: `${a} ${ua} : ${b} ${ub}`, ans: nkR(s), wrong: nkR(nkSimp([a, b])), work: [`Tukar kepada unit yang sama: ${b} ${ub.split(' ')[0]} = ${B} ${ua}`, `${a} : ${B}`, `Bahagi dengan FSTB ${nkG(a, B)}: ${nkR(s)}`] });
};
NK.pecahan = r => {
  const k = r.i(0, 2);
  if (k === 0) { const [p, q] = r.p([[[1, 2], [3, 4]], [[2, 3], [1, 6]], [[3, 4], [5, 8]], [[1, 3], [2, 5]], [[3, 5], [1, 2]]]); const L = nkL(p[1], q[1]), A = p[0] * L / p[1], B = q[0] * L / q[1], s = nkSimp([A, B]);
    return GEN_LQ('termudah', { e: `${fr(p[0], p[1])} : ${fr(q[0], q[1])}`, ans: nkR(s), wrong: `${p[0]} : ${q[0]}`, work: [`Darab kedua-dua sebutan dengan GSTK penyebut, ${L}`, `${A} : ${B}`, s[0] !== A ? `Permudahkan: ${nkR(s)}` : `Sudah termudah: ${nkR(s)}`] }); }
  if (k === 1) { const a = r.p([0.4, 0.6, 1.2, 0.8, 2.5, 1.5]), b = r.p([1.5, 0.9, 2, 3.6, 0.5, 1.8]); if (a === b) return NK.pecahan(r); const A = Math.round(a * 10), B = Math.round(b * 10), s = nkSimp([A, B]);
    return GEN_LQ('termudah', { e: `${a} : ${b}`, ans: nkR(s), wrong: `${A} : ${B}`, work: [`Darab dengan 10: ${A} : ${B}`, `Bahagi dengan FSTB ${nkG(A, B)}: ${nkR(s)}`] }); }
  const a = r.p([20, 25, 30, 40, 45, 60, 75]), b = r.p([15, 35, 50, 80, 90, 100]); if (a === b) return NK.pecahan(r); const s = nkSimp([a, b]);
  return GEN_LQ('termudah', { e: `${a}% : ${b}%`, ans: nkR(s), wrong: `${a / 5} : ${b}`, work: [`${a}% : ${b}% = ${a} : ${b}`, `Bahagi dengan FSTB ${nkG(a, b)}: ${nkR(s)}`] });
};
NK.setara = r => {
  const three = r.i(0, 2) === 0, b = nkPrim(r, three ? 3 : 2, 9), m = r.i(2, 9), v = b.map(x => x * m), pos = r.i(0, b.length - 1);
  const shown = v.map((x, i) => i === pos ? 'x' : x);
  return GEN_LQ('setara', { e: `${nkR(b)} = ${nkR(shown)}`, ans: `x = ${v[pos]}`, work: [`Cari pendarab: ${b[(pos + 1) % b.length]} × ? = ${v[(pos + 1) % b.length]} → ${m}`, `x = ${b[pos]} × ${m} = ${v[pos]}`] });
};
NK.gabung = (r, idx) => {
  const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { // a:b dan b:c -> a:b:c
    let a, b1, b2, c; do { [a, b1] = nkPrim(r, 2, 7); [b2, c] = nkPrim(r, 2, 7); } while (b1 === b2);
    const L = nkL(b1, b2), A = a * L / b1, C = c * L / b2, s = nkSimp([A, L, C]);
    return GEN_LQ('gabung', { q: `Nisbah wang Ali kepada wang Bala ialah ${a} : ${b1}, manakala nisbah wang Bala kepada wang Chong ialah ${b2} : ${c}. Ungkapkan nisbah wang Ali : Bala : Chong dalam bentuk termudah.`, ans: nkR(s), work: [`Samakan sebutan Bala: GSTK bagi ${b1} dan ${b2} = ${L}`, `Ali : Bala = ${A} : ${L}; Bala : Chong = ${L} : ${C}`, `Ali : Bala : Chong = ${nkR([A, L, C])}${nkGs([A, L, C]) > 1 ? ' = ' + nkR(s) : ''}`] });
  }
  if (k === 1) { const [p, q] = r.p([[1, 3], [3, 1], [1, 4], [2, 3], [3, 2], [1, 9], [3, 7], [7, 3], [9, 11], [7, 13], [3, 17], [6, 19], [12, 13]]); const t = p + q;
    return GEN_LQ('gabung', { q: `Nisbah murid yang suka bola sepak kepada murid yang suka badminton ialah ${p} : ${q}. (a) Lukis model bar. (b) Ungkapkan bilangan murid yang suka bola sepak sebagai pecahan daripada jumlah murid. (c) Ungkapkan sebagai peratusan.`, ans: `(b) ${fr(p, t)} (c) ${nkD(p / t * 100)}%`, work: [`Bola sepak ${p} unit, badminton ${q} unit, jumlah ${t} unit`, `Pecahan = ${fr(p, t)}`, `Peratusan = ${fr(p, t)} × 100% = ${nkD(p / t * 100)}%`] }); }
  const [a, b, c] = nkPrim(r, 3, 6), m = r.i(2, 6);
  return GEN_LQ('gabung', { q: `Sebuah resipi minuman memerlukan sirap, air dan ais dalam nisbah ${a} : ${b} : ${c}. Puan Lim mahu membuat ${m} kali ganda resipi itu dan menggunakan cawan sebagai unit. (a) Nyatakan nisbah setara bagi kuantiti yang digunakan. (b) Berapakah jumlah cawan bahan?`, ans: `(a) ${nkR([a * m, b * m, c * m])} (b) ${(a + b + c) * m} cawan`, work: [`Darab setiap sebutan dengan ${m}: ${nkR([a * m, b * m, c * m])}`, `Jumlah = ${a * m} + ${b * m} + ${c * m} = ${(a + b + c) * m}`] });
};
// ---- 3.2 ----
NK.kadar = r => {
  const k = r.i(0, 3);
  if (k === 0) { const v = r.p([60, 72, 80, 90, 95, 100, 110]), t = r.p([2, 3, 4, 1.5, 2.5]); const d = v * t; return GEN_LQ('kadar', { q: `Sebuah bas bergerak sejauh ${nkD(d)} km dalam masa ${nkD(t)} jam. Hitung laju purata bas itu.`, ans: `${v} km/j`, work: [`Laju = jarak ÷ masa`, `= ${nkD(d)} km ÷ ${nkD(t)} j = ${v} km/j`] }); }
  if (k === 1) { const u = r.p([2.5, 3, 4.2, 1.8, 6.5]), n = r.i(3, 9); return GEN_LQ('kadar', { q: `${n} kg beras berharga RM${(u * n).toFixed(2)}. Hitung harga sekilogram beras itu.`, ans: `RM${u.toFixed(2)} sekilogram`, work: [`Harga sekilogram = RM${(u * n).toFixed(2)} ÷ ${n}`, `= RM${u.toFixed(2)}`] }); }
  if (k === 2) { const w = r.p([30, 35, 40, 45, 50]), t = r.i(3, 8); return GEN_LQ('kadar', { q: `${vnama()} menaip ${w * t} patah perkataan dalam ${t} minit. Hitung kadar menaipnya.`, ans: `${w} patah perkataan seminit`, work: [`Kadar = ${w * t} ÷ ${t}`, `= ${w} patah perkataan seminit`] }); }
  const a = r.p([2, 3, 4, 5]), t = r.p([4, 5, 6, 8]); return GEN_LQ('kadar', { q: `Laju sebuah kereta bertambah daripada 0 m/s kepada ${a * t} m/s dalam masa ${t} saat. Hitung pecutan kereta itu.`, ans: `${a} m/s²`, work: [`Pecutan = perubahan laju ÷ masa`, `= ${a * t} ÷ ${t} = ${a} m/s²`] });
};
NK.perkadaran = r => {
  const [a, b] = nkPrim(r, 2, 9), m = r.i(2, 8), ok = r.i(0, 1) === 1, d = b * m + (ok ? 0 : r.p([1, -1, 2]));
  const e = `${a} : ${b} = ${a * m} : ${d}`;
  return GEN_LQ('perkadaran', { e, ok, ans: ok ? `Ya, ${a} × ${d} = ${b} × ${a * m} = ${a * d}` : `Bukan, ${a} × ${d} = ${a * d} tetapi ${b} × ${a * m} = ${b * a * m}`, work: [`Darab silang: ${a} × ${d} = ${a * d}`, `${b} × ${a * m} = ${b * a * m}`, ok ? 'Sama, maka perkadaran.' : 'Tidak sama, maka bukan perkadaran.'] });
};
NK.cariX = r => {
  const [a, b] = nkPrim(r, 2, 9), m = r.p([2, 3, 4, 5, 1.5, 2.5]), c = a * m, x = b * m;
  if (!Number.isInteger(c)) return NK.cariX(r);
  const form = r.i(0, 1);
  const e = form ? `${fr(a, b)} = ${fr(c, 'x')}` : `${a} : ${b} = ${c} : x`;
  return GEN_LQ('cariX', { e, ans: `x = ${nkD(x)}`, work: [`Darab silang: ${a} × x = ${b} × ${c}`, `${a}x = ${b * c}`, `x = ${b * c} ÷ ${a} = ${nkD(x)}`] });
};
NK.unitari = r => {
  const item = r.p([['pensel', 'batang'], ['buku latihan', 'buah'], ['minuman', 'tin'], ['kotak tisu', 'kotak']]), u = r.p([0.8, 1.2, 1.5, 2.4, 3.5]), n1 = r.i(3, 8); let n2; do n2 = r.i(4, 15); while (n2 === n1);
  return GEN_LQ('masalah', { q: `${n1} ${item[1]} ${item[0]} berharga RM${(u * n1).toFixed(2)}. Berapakah harga ${n2} ${item[1]} ${item[0]} yang sama?`, ans: `RM${(u * n2).toFixed(2)}`, work: [`Kaedah unitari: 1 ${item[1]} = RM${(u * n1).toFixed(2)} ÷ ${n1} = RM${u.toFixed(2)}`, `${n2} ${item[1]} = ${n2} × RM${u.toFixed(2)} = RM${(u * n2).toFixed(2)}`] });
};
NK.masalah = (r, idx) => {
  const k = idx == null ? r.i(0, 4) : idx % 5;
  if (k === 0) { const [a, b, c] = nkPrim(r, 3, 6), u = r.p([5, 8, 10, 12, 15, 20]), who = r.i(0, 2), nm = ['Ali', 'Bala', 'Chong'], v = [a, b, c];
    return GEN_LQ('masalah', { q: `Wang simpanan Ali, Bala dan Chong dalam nisbah ${nkR(v)}. Simpanan ${nm[who]} ialah ${nkRM(v[who] * u)}. Berapakah jumlah simpanan mereka bertiga?`, ans: nkRM((a + b + c) * u), work: [`${v[who]} unit = ${nkRM(v[who] * u)} → 1 unit = ${nkRM(u)}`, `Jumlah = ${a} + ${b} + ${c} = ${a + b + c} unit`, `${a + b + c} × ${nkRM(u)} = ${nkRM((a + b + c) * u)}`] }); }
  if (k === 1) { const [p, q] = nkPrim(r, 2, 7), u = r.p([6, 9, 12, 15, 25, 40]), t = (p + q) * u;
    return GEN_LQ('masalah', { q: `Sebanyak ${t} biji kek cawan dibahagikan antara Kelas A dan Kelas B dalam nisbah ${p} : ${q}. Berapakah biji kek cawan yang diterima oleh Kelas B?`, ans: `${q * u} biji`, work: [`Jumlah unit = ${p} + ${q} = ${p + q}`, `1 unit = ${t} ÷ ${p + q} = ${u}`, `Kelas B = ${q} × ${u} = ${q * u} biji`] }); }
  if (k === 2) { const p1 = r.p([150, 200, 250, 300]), c1 = r.p([140, 150, 160, 175]), p2 = r.p([120, 180, 240, 320]); let c2; do c2 = r.p([135, 145, 155, 165, 180]); while (c2 === c1);
    const best = c1 < c2 ? 'Taman Melati' : 'Taman Kenanga';
    return GEN_LQ('masalah', { q: `Taman Melati (${p1} orang) menggunakan ${(p1 * c1).toLocaleString('ms-MY').replace(/,/g, ' ')} liter air sehari, manakala Taman Kenanga (${p2} orang) menggunakan ${(p2 * c2).toLocaleString('ms-MY').replace(/,/g, ' ')} liter sehari. Taman manakah menggunakan air dengan lebih cekap? Beri sebab.`, ans: `${best}, kerana kadar penggunaan seorang lebih rendah (${Math.min(c1, c2)} liter berbanding ${Math.max(c1, c2)} liter)`, work: [`Melati: ${p1 * c1} ÷ ${p1} = ${c1} liter/orang`, `Kenanga: ${p2 * c2} ÷ ${p2} = ${c2} liter/orang`, `Kadar lebih rendah lebih cekap: ${best}`] }); }
  if (k === 3) { const v = r.p([36, 54, 72, 90, 108]); return GEN_LQ('masalah', { q: `Laju sebuah kereta api ialah ${v} km/j. Berapakah laju itu dalam m/s?`, ans: `${v * 1000 / 3600} m/s`, work: [`1 km = 1000 m, 1 j = 3600 s`, `${v} km/j = ${v} × 1000 ÷ 3600`, `= ${v * 1000 / 3600} m/s`] }); }
  const per = r.p([2, 3, 4]), unitMl = r.p([150, 200, 250]), people = r.p([12, 18, 24, 30]);
  const tot = people / per * unitMl;
  if (!Number.isInteger(tot)) return NK.masalah(r, 0);
  return GEN_LQ('masalah', { q: `Satu resipi sup untuk ${per} orang memerlukan ${unitMl} ml santan. Berapakah santan yang diperlukan untuk ${people} orang? Beri jawapan dalam liter.`, ans: `${nkD(tot / 1000)} liter`, work: [`Perkadaran: ${per} orang : ${unitMl} ml = ${people} orang : x`, `x = ${unitMl} × ${people} ÷ ${per} = ${tot} ml`, `${tot} ml = ${nkD(tot / 1000)} liter`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '3.1': { m: [() => NK.tulis(nkRG), () => NK.termudah(nkRG), () => NK.unit(nkRG)], s: [() => NK.pecahan(nkRG), () => NK.setara(nkRG)], k: [() => NK.gabung(nkRG)] },
  '3.2': { m: [() => NK.kadar(nkRG), () => NK.perkadaran(nkRG)], s: [() => NK.cariX(nkRG), () => NK.unitari(nkRG)], k: [() => NK.masalah(nkRG)] }
};
const WG = {
  tulis: () => NK.tulis(nkRW), termudah: () => NK.termudah(nkRW), unit: () => NK.unit(nkRW), pecahan: () => NK.pecahan(nkRW), setara: () => NK.setara(nkRW), gabung: i => NK.gabung(nkRW, i),
  kadar: () => NK.kadar(nkRW), perkadaran: () => NK.perkadaran(nkRW), cariX: () => NK.cariX(nkRW), unitari: () => NK.unitari(nkRW), masalah: i => NK.masalah(nkRW, i)
};
const WSPLAN = {
  '3.1': [['m', 'tulis', 6], ['m', 'termudah', 6], ['m', 'unit', 6], ['s', 'pecahan', 5], ['s', 'setara', 4], ['k', 'gabung', 3]],
  '3.2': [['m', 'kadar', 9], ['m', 'perkadaran', 9], ['s', 'cariX', 5], ['s', 'unitari', 4], ['k', 'masalah', 3]]
};

/* =================== GAMES =================== */
function nkMcq(q, ans, wrongs) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c) || /NaN|undefined/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 2; w.length < 3 && k < 40; k++) { const c = A.replace(/\d+/, m => String(+m + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  nisbah: L => {
    const b = nkPrim(nkRG, L === 2 ? 3 : 2, 9), m = pick([2, 3, 4, 5, 6]), v = b.map(x => x * m);
    if (L === 1) { const [a, ua, bb, ub, f] = pick(NKUNIT), s = nkSimp([a, bb * f]); return nkMcq(`${a} ${ua} : ${bb} ${ub} dalam bentuk termudah ialah`, nkR(s), [nkR(nkSimp([a, bb])), nkR(s.slice().reverse()), nkR([s[0], s[1] + 1])]); }
    return nkMcq(`${nkR(v)} dalam bentuk termudah ialah`, nkR(b), [nkR(b.slice().reverse()), nkR(b.map(x => x * 2)), nkR(b.map((x, i) => i ? x + 1 : x))]);
  },
  setara: L => {
    const b = nkPrim(nkRG, 2, 9), m = ri(2, 9), x = b[1] * m;
    if (L === 2) return nkMcq(`Diberi ${fr(b[0], b[1])} = ${fr(b[0] * m, 'x')}. Nilai x ialah`, x, [x + b[1], b[0] * m + b[1], x - 1, b[1] + m]);
    return nkMcq(`${nkR(b)} = ${b[0] * m} : x. Nilai x ialah`, x, [x + m, b[0] * m, b[1] + m, x - b[1]]);
  },
  kadar: L => {
    if (L === 0) { const u = pick([2, 3, 4, 5, 6]), n = ri(3, 9); return nkMcq(`${n} biji mangga berharga RM${u * n}. Harga sebiji mangga ialah`, `RM${u}`, [`RM${u + 1}`, `RM${u * 2}`, `RM${n}`]); }
    if (L === 1) { const v = pick([60, 80, 90, 100]), t = pick([2, 3, 4]); return nkMcq(`Sebuah kereta bergerak ${v * t} km dalam ${t} jam. Laju puratanya ialah`, `${v} km/j`, [`${v * t * t} km/j`, `${v + 10} km/j`, `${v * t / 2} km/j`]); }
    const v = pick([36, 54, 72, 90]); return nkMcq(`${v} km/j dalam m/s ialah`, `${v * 1000 / 3600} m/s`, [`${v * 1000 / 60} m/s`, `${v / 3.6 + 5} m/s`, `${v * 3.6} m/s`]);
  }
};
const CQT = { nisbah: 'Nisbah termudah', setara: 'Nisbah setara & perkadaran', kadar: 'Kadar' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
