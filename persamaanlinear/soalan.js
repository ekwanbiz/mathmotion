'use strict';
/* =================== PERSAMAAN DAN KETAKSAMAAN LINEAR · SOALAN BAB 5 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "pl" / "PL".

const plRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const plRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const plNZ = (r, a, b) => { let v; do v = r.i(a, b); while (v === 0); return v; };
const plM = s => String(s).replace(/-/g, '−');
const plT = (c, v, first) => { if (c === 0) return ''; const a = Math.abs(c), b = v ? (a === 1 ? v : a + v) : String(a); return first ? (c < 0 ? '−' : '') + b : (c < 0 ? ' − ' : ' + ') + b; };
const plE = terms => { let s = ''; terms.forEach(([c, v]) => { s += plT(c, v, !s); }); return s || '0'; };
const PLV = ['x', 'y', 'p', 'k', 'm', 'n'];
const plSym = { '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
const plFlip = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

/* =================== QV =================== */
const QV = {
  kenal: [
    d => ({ q: `Adakah ${d.e} suatu persamaan linear dalam satu pemboleh ubah? Beri sebab.` }),
    d => ({ q: `Tentukan sama ada ${d.e} ialah persamaan linear dalam satu pemboleh ubah.` }),
    d => ({ q: `${vnama()} berkata ${d.e} ialah persamaan linear dalam satu pemboleh ubah. Adakah dia betul?`, ans: d.yes ? `Betul. ${d.why}` : `Tidak betul. ${d.why}` })
  ],
  bentuk: [
    d => ({ q: `Bentukkan persamaan linear bagi pernyataan: “${d.ayat}”.` }),
    d => ({ q: `Tulis persamaan linear yang mewakili: ${d.ayat}.` }),
    d => ({ q: `${d.ayat}. Tulis satu persamaan linear dalam sebutan ${d.v}.` })
  ],
  selesai: [
    d => ({ q: `Selesaikan ${d.e}.` }),
    d => ({ q: `Cari nilai ${d.v} jika ${d.e}.` }),
    d => ({ q: `Selesaikan persamaan linear ${d.e}.` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} menyelesaikan ${d.e} dan mendapat ${d.v} = ${d.wrong}. Adakah ${N} betul?` }, salah(N, `${d.v} = ${d.sol}`, 'Gunakan operasi songsang pada kedua-dua belah persamaan. Semak dengan menggantikan nilai.')); }
  ],
  banding: [
    d => ({ q: `Isi petak dengan simbol &lt; atau &gt;: ${d.a} ☐ ${d.b}` }),
    d => ({ q: `Bandingkan ${d.a} dan ${d.b} menggunakan simbol ketaksamaan.` })
  ],
  garis: [
    d => ({ q: `Pada garis nombor, ${d.desc}. Tulis ketaksamaan yang diwakili.` }),
    d => ({ q: `Garis nombor menunjukkan ${d.desc}. Nyatakan ketaksamaan bagi ${d.v}.` })
  ],
  bentukK: [
    d => ({ q: `Tulis ketaksamaan bagi situasi berikut: ${d.ayat}.` }),
    d => ({ q: `${d.ayat}. Wakilkan situasi ini dengan ketaksamaan.` })
  ],
  operasi: [
    d => ({ q: `Diberi ${d.e}. Lengkapkan: ${d.q}` }),
    d => ({ q: `Jika ${d.e}, isi petak dengan simbol &lt; atau &gt;: ${d.q}` })
  ],
  selesaiK: [
    d => ({ q: `Selesaikan ketaksamaan ${d.e}.` }),
    d => ({ q: `Cari julat nilai ${d.v} yang memuaskan ${d.e}.` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} menyelesaikan ${d.e} dan mendapat ${d.wrong}. Adakah ${N} betul?` }, salah(N, d.ans, 'Apabila mendarab atau membahagi dengan nombor negatif, simbol ketaksamaan bertukar arah.')); }
  ],
  serentak: [
    d => ({ q: `Cari penyelesaian sepunya bagi ketaksamaan linear serentak ${d.e1} dan ${d.e2}. Seterusnya, senaraikan semua integer yang memuaskan.` }),
    d => ({ q: `Selesaikan ketaksamaan serentak ${d.e1} dan ${d.e2}, kemudian nyatakan integer yang memuaskan kedua-duanya.` })
  ],
  masalah: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q })]
};

/* =================== penjana =================== */
const PL = {};
// ---- 5.1 ----
PL.kenal = r => {
  const v = r.p(PLV), a = r.i(2, 9), b = r.i(1, 12), c = r.i(13, 40), k = r.i(0, 5);
  const L = [
    [`${a}${v} + ${b} = ${c}`, 1, `Ada tanda “=”, satu pemboleh ubah (${v}) dan kuasa ${v} ialah 1.`],
    [`${fr(v, a)} − ${b} = ${c}`, 1, `Satu pemboleh ubah dengan kuasa 1 dan ada tanda “=”.`],
    [`${v}² + ${b} = ${c}`, 0, `Kuasa ${v} ialah 2, bukan 1.`],
    [`${a}${v} + ${b}w = ${c}`, 0, `Ada dua pemboleh ubah (${v} dan w).`],
    [`${a}${v} + ${b}`, 0, `Tiada tanda “=”, ini hanya ungkapan algebra.`],
    [`${c} = ${a}(${v} − ${b})`, 1, `Selepas dikembangkan, kuasa ${v} ialah 1 dan hanya ada satu pemboleh ubah.`]
  ][k];
  return GEN_LQ('kenal', { e: L[0], yes: !!L[1], why: L[2], ans: `${L[1] ? 'Ya' : 'Bukan'}. ${L[2]}`, work: [L[2]] });
};
PL.bentuk = r => {
  const v = r.p(PLV), a = r.i(2, 9), b = r.i(2, 15), X = r.i(2, 12), k = r.i(0, 4);
  const L = [
    [`Hasil tambah suatu nombor, ${v}, dan ${b} ialah ${X + b}`, `${v} + ${b} = ${X + b}`],
    [`${a} kali suatu nombor, ${v}, ditolak ${b} ialah ${a * X - b}`, `${a}${v} − ${b} = ${a * X - b}`],
    [`Harga ${a} batang pen ialah RM${a * X}; harga sebatang pen ialah RM${v}`, `${a}${v} = ${a * X}`],
    [`Umur Farid ${b} tahun lagi ialah ${X + b} tahun; umur Farid sekarang ialah ${v} tahun`, `${v} + ${b} = ${X + b}`],
    [`Sebatang reben ${a * X} cm dipotong kepada ${a} bahagian sama panjang, setiap satu ${v} cm`, `${a}${v} = ${a * X}`]
  ][k];
  return GEN_LQ('bentuk', { ayat: L[0], v, ans: L[1], work: [`${L[0]} → ${L[1]}`] });
};
PL.selesai = (r, lvl) => {
  const v = r.p(PLV), X = plNZ(r, -6, 12), a = r.i(2, 9), b = plNZ(r, -12, 12), k = lvl === 'm' ? r.i(0, 2) : r.i(3, 6);
  let e, w, wrong;
  if (k === 0) { const c = X + b; e = `${plE([[1, v], [b, '']])} = ${plM(c)}`; w = [`${v} = ${plM(c)} ${b > 0 ? '−' : '+'} ${Math.abs(b)}`]; wrong = c + b; }
  else if (k === 1) { e = `${a}${v} = ${plM(a * X)}`; w = [`${v} = ${plM(a * X)} ÷ ${a}`]; wrong = a * X - a; }
  else if (k === 2) { const c = a * X + b; e = `${plE([[a, v], [b, '']])} = ${plM(c)}`; w = [`${a}${v} = ${plM(c)} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${plM(a * X)}`, `${v} = ${plM(a * X)} ÷ ${a}`]; wrong = (c + b) / a; }
  else if (k === 3) { const m = r.i(2, 5), c = m * (X + b); e = `${m}(${plE([[1, v], [b, '']])}) = ${plM(c)}`; w = [`Bahagi ${m}: ${plE([[1, v], [b, '']])} = ${plM(X + b)}`, `${v} = ${plM(X)}`]; wrong = X + 2 * b; }
  else if (k === 4) { const d = r.i(2, 5), q = r.i(-3, 6), top = d * q; const bb = top - X; e = `${fr(plE([[1, v], [bb, '']]), d)} = ${plM(q)}`; w = [`Darab ${d}: ${plE([[1, v], [bb, '']])} = ${plM(top)}`, `${v} = ${plM(X)}`]; wrong = q - bb; }
  else if (k === 5) { const p = r.i(a + 1, a + 6), c = (p - a) * X; const B = r.i(1, 9), C = c - B; e = `${p}${v} ${B >= 0 ? '+' : '−'} ${Math.abs(B)} = ${a}${v} ${C >= 0 ? '+' : '−'} ${Math.abs(C)}`; w = [`${p}${v} − ${a}${v} = ${plM(C)} − ${B}`, `${p - a}${v} = ${plM(c)}`, `${v} = ${plM(X)}`]; wrong = (C + B) / (p - a); }
  else { const d = r.i(2, 4), c = r.i(1, 5), rhs = X / d + c; if (!Number.isInteger(rhs)) return PL.selesai(r, lvl); e = `${fr(v, d)} + ${c} = ${plM(rhs)}`; w = [`${fr(v, d)} = ${plM(rhs - c)}`, `${v} = ${plM((rhs - c) * d)}`]; wrong = rhs - c; }
  if (!Number.isInteger(wrong) || wrong === X) wrong = X + 2;
  return GEN_LQ('selesai', { e, v, sol: plM(X), wrong: plM(wrong), ans: `${v} = ${plM(X)}`, work: w.concat([`${v} = ${plM(X)}`]) });
};
PL.masalah1 = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { const w = r.i(5, 20), d = r.i(1, 5), P = 2 * (2 * w + d) + 2 * w; return GEN_LQ('masalah', { q: `Perimeter sebuah padang segi empat tepat ialah ${P} m. Panjangnya ${d} m lebih daripada dua kali lebarnya. Berapakah lebar padang itu?`, ans: `${w} m`, work: [`Lebar = x, panjang = 2x + ${d}`, `2(2x + ${d}) + 2x = ${P} → 6x + ${2 * d} = ${P}`, `x = ${w}`] }); }
  if (k === 1) { const p = r.p([2, 3, 4]), u = r.i(3, 12), fee = r.p([5, 8, 10]), n = r.i(3, 8), tot = n * u + fee; return GEN_LQ('masalah', { q: `${vnama()} membeli ${n} buah buku cerita dan membayar caj penghantaran RM${fee}. Jumlah bayaran ialah RM${tot}. Berapakah harga sebuah buku cerita?`, ans: `RM${u}`, work: [`${n}x + ${fee} = ${tot}`, `${n}x = ${tot - fee}`, `x = ${u}`] }); }
  if (k === 2) { const A = r.i(8, 14), d = r.i(20, 30), y = r.i(2, 8); return GEN_LQ('masalah', { q: `Umur seorang ibu ialah ${d} tahun lebih daripada umur anaknya. Hasil tambah umur mereka ialah ${2 * A + d} tahun. Berapakah umur anak itu?`, ans: `${A} tahun`, work: [`Anak = x, ibu = x + ${d}`, `x + x + ${d} = ${2 * A + d}`, `2x = ${2 * A}, x = ${A}`] }); }
  const w = r.i(3, 6), l = r.i(2, 5), pts = w * 3 + l * 1, draw = r.i(1, 4), tot = w * 3 + draw;
  return GEN_LQ('masalah', { q: `Dalam satu liga bola sepak, pasukan mendapat 3 mata bagi setiap kemenangan dan 1 mata bagi setiap seri. Sebuah pasukan seri ${draw} perlawanan dan mengumpul ${tot} mata. Berapakah bilangan kemenangan pasukan itu?`, ans: `${w} kemenangan`, work: [`3m + ${draw} = ${tot}`, `3m = ${tot - draw}`, `m = ${w}`] });
};
// ---- 5.2 ----
PL.banding = r => {
  const L = [['−5', -5], ['−3', -3], ['−1.5', -1.5], ['−1', -1], ['0', 0], ['0.5', .5], ['2', 2], ['−' + fr(2, 3), -2 / 3], ['−0.7', -.7], ['3', 3], ['−4', -4]];
  let A, B; do { A = r.p(L); B = r.p(L); } while (A[0] === B[0]);
  return GEN_LQ('banding', { a: A[0], b: B[0], ans: `${A[0]} ${A[1] < B[1] ? '&lt;' : '&gt;'} ${B[0]}`, work: [`${A[0]} terletak di ${A[1] < B[1] ? 'kiri' : 'kanan'} ${B[0]} pada garis nombor.`] });
};
PL.garis = r => {
  const v = r.p(PLV), n = r.i(-5, 8), closed = r.i(0, 1) === 1, right = r.i(0, 1) === 1;
  const sym = right ? (closed ? '≥' : '&gt;') : (closed ? '≤' : '&lt;');
  return GEN_LQ('garis', { v, desc: `bulatan ${closed ? 'penuh (●)' : 'kosong (○)'} pada ${plM(n)} dengan anak panah ke ${right ? 'kanan' : 'kiri'}`, ans: `${v} ${sym} ${plM(n)}`, work: [`Bulatan ${closed ? 'penuh: nilai itu termasuk' : 'kosong: nilai itu tidak termasuk'}`, `Anak panah ke ${right ? 'kanan: lebih besar' : 'kiri: lebih kecil'}`, `${v} ${sym} ${plM(n)}`] });
};
PL.bentukK = r => {
  const k = r.i(0, 5), n = r.i(2, 9);
  const L = [
    [`Had laju di kawasan sekolah ialah ${r.p([30, 40])} km/j; laju kenderaan ialah v km/j`, s => `v ≤ ${s}`],
    [`Ketinggian kenderaan, h meter, tidak boleh melebihi had ketinggian ${r.p([4.2, 4.5, 5])} m di bawah jejantas`, s => `h ≤ ${s}`],
    [`Murid mesti berumur sekurang-kurangnya ${r.p([12, 13, 16])} tahun untuk menyertai kem; umur murid ialah u tahun`, s => `u ≥ ${s}`],
    [`Sebuah lif boleh membawa jisim maksimum ${r.p([600, 800, 900])} kg; jumlah jisim ialah m kg`, s => `m ≤ ${s}`],
    [`Markah lulus ialah lebih daripada ${r.p([39, 49])}; markah ialah x`, s => `x &gt; ${s}`],
    [`Bilangan peserta kurang daripada ${r.p([30, 40, 50])} orang; bilangan peserta ialah p`, s => `p &lt; ${s}`]
  ][k];
  const num = L[0].match(/(\d+(\.\d+)?)/)[1];
  return GEN_LQ('bentukK', { ayat: L[0], ans: L[1](num), work: [`Kata kunci → ${L[1](num)}`] });
};
PL.operasi = r => {
  const a = r.i(-6, 4), b = a + r.i(1, 6), op = r.i(0, 3), k = r.p([2, 3, 4, 5]);
  const ops = [[`${plM(a)} + ${k} ☐ ${plM(b)} + ${k}`, '&lt;', 'Tambah nombor yang sama: simbol kekal.'], [`${plM(a)} − ${k} ☐ ${plM(b)} − ${k}`, '&lt;', 'Tolak nombor yang sama: simbol kekal.'], [`${k}(${plM(a)}) ☐ ${k}(${plM(b)})`, '&lt;', 'Darab nombor positif: simbol kekal.'], [`−${k}(${plM(a)}) ☐ −${k}(${plM(b)})`, '&gt;', 'Darab nombor negatif: simbol bertukar arah.']][op];
  return GEN_LQ('operasi', { e: `${plM(a)} &lt; ${plM(b)}`, q: ops[0], ans: ops[0].replace('☐', ops[1]), work: [ops[2]] });
};
PL.selesaiK = r => {
  const v = r.p(PLV), X = r.i(-5, 8), a = plNZ(r, -5, 6), b = plNZ(r, -10, 10), s0 = r.p(['<', '>', '<=', '>=']);
  if (Math.abs(a) === 1 && r.i(0, 1)) return PL.selesaiK(r);
  const c = a * X + b, sol = a > 0 ? s0 : plFlip[s0];
  const e = `${plE([[a, v], [b, '']])} ${plSym[s0]} ${plM(c)}`;
  const ans = `${v} ${plSym[sol]} ${plM(X)}`, wrong = `${v} ${plSym[a > 0 ? plFlip[s0] : s0]} ${plM(X)}`;
  return GEN_LQ('selesaiK', { e, v, ans, wrong, work: [`${plE([[a, v]])} ${plSym[s0]} ${plM(c)} ${b > 0 ? '−' : '+'} ${Math.abs(b)} = ${plM(a * X)}`, a > 0 ? `Bahagi ${a}: ${ans}` : `Bahagi ${plM(a)} (nombor negatif, tukar arah): ${ans}`] });
};
PL.serentak = r => {
  const v = 'x', lo = r.i(-4, 3), hi = lo + r.i(2, 5), a = r.i(2, 4), b = plNZ(r, -6, 6), c = plNZ(r, -5, 5);
  const loStrict = r.i(0, 1) === 1, hiStrict = r.i(0, 1) === 1;
  const e1 = `${plE([[a, v], [b, '']])} ${loStrict ? '&gt;' : '≥'} ${plM(a * lo + b)}`;
  const e2 = `${plE([[1, v], [c, '']])} ${hiStrict ? '&lt;' : '≤'} ${plM(hi + c)}`;
  const ints = []; for (let t = lo; t <= hi; t++) if ((loStrict ? t > lo : t >= lo) && (hiStrict ? t < hi : t <= hi)) ints.push(plM(t));
  const range = `${plM(lo)} ${loStrict ? '&lt;' : '≤'} x ${hiStrict ? '&lt;' : '≤'} ${plM(hi)}`;
  return GEN_LQ('serentak', { e1, e2, ans: `${range}; integer: ${ints.join(', ')}`, work: [`${e1} → x ${loStrict ? '&gt;' : '≥'} ${plM(lo)}`, `${e2} → x ${hiStrict ? '&lt;' : '≤'} ${plM(hi)}`, `Kawasan sepunya: ${range}`] });
};
PL.masalah2 = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { const fix = r.p([300, 400, 500]), per = r.p([25, 35, 45]), bud = r.p([1200, 1500, 2000]); const t = Math.floor((bud - fix) / per);
    return GEN_LQ('masalah', { q: `Sewa sebuah dewan ialah RM${fix} ditambah RM${per} bagi setiap tetamu. Bajet maksimum ialah RM${String(bud).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}. Berapakah bilangan tetamu maksimum?`, ans: `${t} orang`, work: [`${fix} + ${per}t ≤ ${bud}`, `${per}t ≤ ${bud - fix} → t ≤ ${(Math.round((bud - fix) / per * 100) / 100)}`, `Integer terbesar: ${t}`] }); }
  if (k === 1) { const m = r.p([60, 70, 75, 80]), a = r.i(55, m + 10), b = r.i(55, m + 10); const need = 3 * m - a - b;
    return GEN_LQ('masalah', { q: `Untuk mendapat gred A, purata markah tiga ujian mesti sekurang-kurangnya ${m}. Aina mendapat ${a} dan ${b} dalam dua ujian pertama. Berapakah markah minimum ujian ketiga?`, ans: need > 100 ? 'Tidak mungkin (melebihi 100)' : `${Math.max(0, need)}`, work: [`${fr(`${a} + ${b} + x`, 3)} ≥ ${m}`, `${a + b} + x ≥ ${3 * m}`, `x ≥ ${need}`] }); }
  if (k === 2) { const cap = r.p([500, 600, 800]), w = r.p([65, 70, 75]), bag = r.p([20, 30, 40]); const n = Math.floor((cap - bag) / w);
    return GEN_LQ('masalah', { q: `Sebuah lif boleh membawa jisim maksimum ${cap} kg. Seorang pekerja membawa barang berjisim ${bag} kg ke dalam lif. Jika jisim purata seorang ialah ${w} kg, berapakah bilangan maksimum orang (termasuk pekerja itu) boleh menaiki lif bersama barang tersebut?`, ans: `${n} orang`, work: [`${w}n + ${bag} ≤ ${cap}`, `n ≤ ${Math.round((cap - bag) / w * 100) / 100}`, `n = ${n}`] }); }
  const save = r.p([15, 20, 25]), have = r.p([40, 60, 80]), goal = r.p([250, 300, 350]); const wk = Math.ceil((goal - have) / save);
  return GEN_LQ('masalah', { q: `${vnama()} sudah ada RM${have} dan menyimpan RM${save} setiap minggu. Dia mahu simpanannya sekurang-kurangnya RM${goal}. Berapakah bilangan minggu minimum yang diperlukan?`, ans: `${wk} minggu`, work: [`${have} + ${save}w ≥ ${goal}`, `w ≥ ${Math.round((goal - have) / save * 100) / 100}`, `Integer terkecil: ${wk}`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '5.1': { m: [() => PL.kenal(plRG), () => PL.bentuk(plRG), () => PL.selesai(plRG, 'm')], s: [() => PL.selesai(plRG, 's')], k: [() => PL.masalah1(plRG)] },
  '5.2': { m: [() => PL.banding(plRG), () => PL.garis(plRG), () => PL.bentukK(plRG)], s: [() => PL.operasi(plRG), () => PL.selesaiK(plRG), () => PL.serentak(plRG)], k: [() => PL.masalah2(plRG)] }
};
const WG = {
  kenal: () => PL.kenal(plRW), bentuk: () => PL.bentuk(plRW), selesaiM: () => PL.selesai(plRW, 'm'), selesaiS: () => PL.selesai(plRW, 's'), masalah1: i => PL.masalah1(plRW, i),
  banding: () => PL.banding(plRW), garis: () => PL.garis(plRW), bentukK: () => PL.bentukK(plRW), operasi: () => PL.operasi(plRW), selesaiK: () => PL.selesaiK(plRW), serentak: () => PL.serentak(plRW), masalah2: i => PL.masalah2(plRW, i)
};
const WSPLAN = {
  '5.1': [['m', 'kenal', 5], ['m', 'bentuk', 5], ['m', 'selesaiM', 8], ['s', 'selesaiS', 9], ['k', 'masalah1', 3]],
  '5.2': [['m', 'banding', 5], ['m', 'garis', 7], ['m', 'bentukK', 6], ['s', 'operasi', 3], ['s', 'selesaiK', 4], ['s', 'serentak', 2], ['k', 'masalah2', 3]]
};

/* =================== GAMES =================== */
function plMcq(q, ans, wrongs) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c) || /NaN|undefined/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const c = A.replace(/−?\d+/, m => plM(+m.replace('−', '-') + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  persamaan: L => {
    const X = L === 0 ? ri(1, 9) : nz(-6, 9), a = ri(2, 6), b = nz(-9, 9);
    if (L === 0) return plMcq(`Selesaikan x + ${a} = ${X + a}.`, `x = ${X}`, [`x = ${X + 2 * a}`, `x = ${X + a}`, `x = ${a}`]);
    const c = a * X + b;
    if (L === 1) return plMcq(`Selesaikan ${plE([[a, 'x'], [b, '']])} = ${plM(c)}.`, `x = ${plM(X)}`, [`x = ${plM((c + b) / a)}`, `x = ${plM(c - b)}`, `x = ${plM(-X)}`].filter(s => !/\./.test(s)));
    const m = ri(2, 4), d = nz(-5, 5); return plMcq(`Selesaikan ${m}(x ${d < 0 ? '−' : '+'} ${Math.abs(d)}) = ${plM(m * (X + d))}.`, `x = ${plM(X)}`, [`x = ${plM(X + 2 * d)}`, `x = ${plM(m * (X + d) - d)}`, `x = ${plM(-X)}`]);
  },
  simbol: L => {
    const n = ri(-5, 8), closed = Math.random() < .5, right = Math.random() < .5, sym = right ? (closed ? '≥' : '&gt;') : (closed ? '≤' : '&lt;');
    if (L === 0) { const s = pick([['tidak melebihi 90', '≤ 90'], ['sekurang-kurangnya 16', '≥ 16'], ['kurang daripada 40', '&lt; 40'], ['lebih daripada 49', '&gt; 49']]); return plMcq(`“Nilai x ${s[0]}” ditulis sebagai`, `x ${s[1]}`, ['≤', '≥', '&lt;', '&gt;'].map(t => `x ${t} ${s[1].split(' ')[1]}`)); }
    return plMcq(`Garis nombor: bulatan ${closed ? 'penuh' : 'kosong'} pada ${plM(n)}, anak panah ke ${right ? 'kanan' : 'kiri'}. Ketaksamaannya ialah`, `x ${sym} ${plM(n)}`, ['≤', '≥', '&lt;', '&gt;'].map(t => `x ${t} ${plM(n)}`));
  },
  ketaksamaan: L => {
    const X = ri(-4, 6), a = L === 2 ? -ri(2, 5) : ri(2, 5), b = nz(-8, 8), s0 = pick(['<', '>', '<=', '>=']), c = a * X + b, sol = a > 0 ? s0 : plFlip[s0];
    return plMcq(`Selesaikan ${plE([[a, 'x'], [b, '']])} ${plSym[s0]} ${plM(c)}.`, `x ${plSym[sol]} ${plM(X)}`, [`x ${plSym[plFlip[sol]]} ${plM(X)}`, `x ${plSym[sol]} ${plM(-X || 1)}`, `x ${plSym[sol]} ${plM(X + 1)}`]);
  }
};
const CQT = { persamaan: 'Selesaikan persamaan linear', simbol: 'Simbol & garis nombor', ketaksamaan: 'Selesaikan ketaksamaan' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
