'use strict';
/* =================== UNGKAPAN ALGEBRA · SOALAN BAB 4 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "ua" / "UA".

const uaRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const uaRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const uaNZ = (r, a, b) => { let v; do v = r.i(a, b); while (v === 0); return v; };
const uaM = s => String(s).replace(/-/g, '−');
// sebutan: [pekali, pemboleh ubah] ; ungkapan: senarai sebutan
const uaT = (c, v, first) => {
  if (c === 0) return '';
  const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a);
  if (first) return (c < 0 ? '−' : '') + body;
  return (c < 0 ? ' − ' : ' + ') + body;
};
const uaE = terms => { let s = ''; terms.forEach(([c, v]) => { const t = uaT(c, v, !s); s += t; }); return s || '0'; };
const uaCollect = (terms, order) => { const m = {}; terms.forEach(([c, v]) => m[v] = (m[v] || 0) + c); return order.filter(v => v in m).map(v => [m[v], v]).concat(Object.keys(m).filter(v => !order.includes(v)).map(v => [m[v], v])); };
const uaP = e => /[+−]/.test(e.slice(1)) ? `(${e})` : e;

/* =================== QV =================== */
const QV = {
  bentuk: [
    d => ({ q: `Tulis ungkapan algebra bagi: “${d.ayat}”.` }),
    d => ({ q: `Wakilkan pernyataan berikut sebagai ungkapan algebra: ${d.ayat}.` }),
    d => ({ q: `Bentukkan ungkapan algebra untuk ${d.ayat}.` })
  ],
  balik: [
    d => ({ q: `Tulis satu pernyataan yang mewakili ungkapan ${d.e}.` }),
    d => ({ q: `Huraikan ungkapan algebra ${d.e} dengan perkataan.` })
  ],
  pekali: [
    d => ({ q: `Bagi ungkapan ${d.e}, nyatakan (a) bilangan sebutan, (b) pekali bagi ${d.v}.` }),
    d => ({ q: `Dalam ungkapan ${d.e}, berapakah bilangan sebutan dan apakah pekali ${d.v}?` })
  ],
  serupa: [
    d => ({ q: `Antara sebutan berikut, kenal pasti sebutan yang serupa dengan ${d.t}: ${d.list}.` }),
    d => ({ q: `Pilih sebutan yang serupa dengan ${d.t} daripada senarai: ${d.list}.` })
  ],
  ringkas: [
    d => ({ q: `Permudahkan ${d.e}.` }),
    d => ({ q: `Ringkaskan ungkapan ${d.e}.` }),
    d => ({ q: `Kumpulkan sebutan serupa dan permudahkan: ${d.e}` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} mempermudahkan ${d.e} dan mendapat ${d.wrong}. Adakah ${N} betul?` }, salah(N, d.ans, d.why || 'Hanya sebutan serupa boleh digabungkan. Tanda di hadapan setiap sebutan ikut bersama sebutan itu.')); }
  ],
  operasi: [
    d => ({ q: `Permudahkan ${d.e}.` }),
    d => ({ q: `Ringkaskan ${d.e}.` }),
    d => ({ q: `Hitung dan permudahkan: ${d.e}` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} mempermudahkan ${d.e} dan mendapat ${d.wrong}. Adakah ${N} betul?` }, salah(N, d.ans, d.why || 'Darab atau bahagi nombor dengan nombor, dan huruf dengan huruf.')); }
  ],
  nilai: [
    d => ({ q: `Cari nilai ${d.e} apabila ${d.given}.` }),
    d => ({ q: `Diberi ${d.given}. Hitung nilai ${d.e}.` }),
    d => ({ q: `Gantikan ${d.given} ke dalam ${d.e} dan nilaikan.` })
  ],
  masalah: [d => ({ q: d.q }), d => ({ q: d.q.replace('Ungkapkan', 'Tulis') })]
};

/* =================== penjana =================== */
const UA = {};
const UAV = ['x', 'y', 'p', 'k', 'm', 'n', 'a', 'b'];
UA.bentuk = r => {
  const v = r.p(UAV), n = r.i(2, 9), k = r.i(0, 7);
  const L = [
    [`${n} lebih daripada ${v}`, `${v} + ${n}`], [`${n} kurang daripada ${v}`, `${v} − ${n}`], [`${n} kali ${v}`, `${n}${v}`], [`${v} dibahagi dengan ${n}`, `${v}/${n}`],
    [`hasil tambah dua kali ${v} dan ${n}`, `2${v} + ${n}`], [`${n} ditolak daripada tiga kali ${v}`, `3${v} − ${n}`],
    [`harga ${n} buah buku jika sebuah berharga RM${v}`, `${n}${v}`], [`umur Ali ${n} tahun lagi jika umurnya sekarang ${v} tahun`, `${v} + ${n}`]
  ][k];
  return GEN_LQ('bentuk', { ayat: L[0], ans: L[1], work: [`${L[0]} → ${L[1]}`] });
};
UA.balik = r => {
  const v = r.p(UAV), n = r.i(2, 9), k = r.i(0, 3);
  const L = [[`${n}${v} + 1`, `1 lebih daripada ${n} kali ${v}`], [`${v} − ${n}`, `${n} kurang daripada ${v}`], [`${v}/${n}`, `${v} dibahagi dengan ${n}`], [`2${v} − ${n}`, `${n} ditolak daripada dua kali ${v}`]][k];
  return GEN_LQ('balik', { e: L[0], ans: L[1], work: [`${L[0]} bermaksud ${L[1]}`] });
};
UA.pekali = r => {
  const [u, w] = r.p([['x', 'y'], ['p', 'q'], ['a', 'b'], ['m', 'n']]), a = uaNZ(r, -9, 9), b = uaNZ(r, -9, 9), c = r.i(1, 12);
  const terms = [[a, u], [b, w], [r.i(0, 1) ? c : -c, '']], e = uaE(terms), ask = r.i(0, 1) ? u : w, pk = ask === u ? a : b;
  return GEN_LQ('pekali', { e, v: ask, ans: `(a) 3 sebutan (b) pekali ${ask} ialah ${uaM(pk)}`, work: [`Sebutan: ${terms.map(([c, v]) => uaT(c, v, true)).join(', ')}`, `Pekali ${ask} = ${uaM(pk)}`] });
};
UA.serupa = r => {
  const v = r.p(['x', 'y', 'ab', 'pq', 'm']), c = r.i(2, 9);
  const same = [`${r.i(2, 9)}${v}`, `−${v}`, `${r.i(2, 12)}${v}`].slice(0, r.i(1, 2) + 1);
  const other = [v === 'x' ? 'x²' : `${v}²`, `${c}`, `${r.i(2, 9)}${v === 'ab' ? 'a' : v === 'pq' ? 'q' : v === 'x' ? 'y' : 'n'}`, `${r.i(2, 9)}${v}${v === 'm' ? 'n' : 'z'}`];
  const all = shuffle(same.concat(other.slice(0, 5 - same.length)));
  return GEN_LQ('serupa', { t: `${c}${v}`, list: all.join(', '), ans: same.join(', '), work: [`Sebutan serupa mempunyai pemboleh ubah dan kuasa yang sama (${v}).`, `Jawapan: ${same.join(', ')}`] });
};
UA.ringkas = (r, lvl) => {
  const [u, w] = r.p([['x', 'y'], ['a', 'b'], ['p', 'q'], ['m', 'n']]);
  if (lvl === 'm') { // satu pemboleh ubah + pemalar
    const a = r.i(2, 9), b = uaNZ(r, -8, 8), c = uaNZ(r, -7, 7), d = uaNZ(r, -9, 9);
    const terms = [[a, u], [b, ''], [c, u], [d, '']], res = uaCollect(terms, [u, '']);
    return GEN_LQ('ringkas', { e: uaE(terms), ans: uaE(res), wrong: uaE([[a + c + b + d, u]]), work: [`Kumpulkan: (${uaE([[a, u], [c, u]])}) + (${uaE([[b, ''], [d, '']])})`, `= ${uaE(res)}`] });
  }
  // ungkapan tolak ungkapan
  const A = [[r.i(2, 9), u], [uaNZ(r, -9, 9), w]], B = [[r.i(1, 6), u], [uaNZ(r, -9, 9), w]], op = r.i(0, 1);
  const terms = op ? A.concat(B.map(([c, v]) => [-c, v])) : A.concat(B), res = uaCollect(terms, [u, w]);
  const e = `(${uaE(A)}) ${op ? '−' : '+'} (${uaE(B)})`;
  const wrong = op ? uaE(uaCollect(A.concat([[-B[0][0], u], [B[1][0], w]]), [u, w])) : uaE(uaCollect(A.concat([[B[0][0], u], [-B[1][0], w]]), [u, w]));
  return GEN_LQ('ringkas', { e, ans: uaE(res), wrong: wrong === uaE(res) ? uaE(res.map(([c, v]) => [c + 1, v])) : wrong, why: op ? 'Tanda − di hadapan kurungan menukar tanda SETIAP sebutan di dalam kurungan.' : '', work: [op ? `Buka kurungan: ${uaE(terms)}` : `Buang kurungan: ${uaE(terms)}`, `Kumpulkan sebutan serupa: ${uaE(res)}`] });
};
UA.darab = r => {
  const k = r.i(0, 3), [u, w] = r.p([['x', 'y'], ['a', 'b'], ['p', 'q'], ['m', 'n']]), a = r.i(2, 6), b = uaNZ(r, -7, 7);
  if (k === 0) return GEN_LQ('operasi', { e: `${a}${u} × ${uaP(uaT(b, w, true))}`, ans: uaT(a * b, u + w, true), wrong: uaT(a + b, u + w, true), work: [`${a} × ${uaM(b)} = ${uaM(a * b)}`, `${u} × ${w} = ${u}${w}`, `Jawapan: ${uaT(a * b, u + w, true)}`] });
  if (k === 1) return GEN_LQ('operasi', { e: `${a}${u} × ${Math.abs(b)}${u}`, ans: `${a * Math.abs(b)}${u}²`, wrong: `${a * Math.abs(b)}${u}`, work: [`${a} × ${Math.abs(b)} = ${a * Math.abs(b)}`, `${u} × ${u} = ${u}²`] });
  if (k === 2) { const q = a * b; return GEN_LQ('operasi', { e: `${uaT(q, u + w, true)} ÷ ${a}${w}`, ans: uaT(b, u, true), wrong: uaT(b, u + w, true), work: [`${uaM(q)} ÷ ${a} = ${uaM(b)}`, `${u}${w} ÷ ${w} = ${u}`] }); }
  const q = a * r.i(2, 6); return GEN_LQ('operasi', { e: `${q}${u}${w} ÷ ${a}${u}`, ans: `${q / a}${w}`, wrong: `${q / a}${u}${w}`, work: [`${q} ÷ ${a} = ${q / a}`, `${u}${w} ÷ ${u} = ${w}`] });
};
UA.kembang = r => {
  const v = r.p(UAV), a = uaNZ(r, -6, 6), b = r.i(2, 9), c = uaNZ(r, -9, 9), k = r.i(0, 1);
  if (k === 0) { const inner = uaE([[b, v], [c, '']]), res = [[a * b, v], [a * c, '']];
    return GEN_LQ('operasi', { e: `${uaM(a)}(${inner})`, ans: uaE(res), wrong: uaE([[a * b, v], [c, '']]), why: 'Darab pemalar dengan SETIAP sebutan di dalam kurungan.', work: [`${uaM(a)} × ${b}${v} = ${uaT(a * b, v, true)}`, `${uaM(a)} × ${uaM(c)} = ${uaM(a * c)}`, `= ${uaE(res)}`] }); }
  const d = r.i(2, 5), inner = uaE([[b * d, v], [c * d, '']]), res = [[b, v], [c, '']];
  return GEN_LQ('operasi', { e: `(${inner}) ÷ ${d}`, ans: uaE(res), wrong: uaE([[b, v], [c * d, '']]), why: 'Bahagi SETIAP sebutan dengan pemalar.', work: [`${b * d}${v} ÷ ${d} = ${b}${v}`, `${uaM(c * d)} ÷ ${d} = ${uaM(c)}`, `= ${uaE(res)}`] });
};
UA.nilai = r => {
  const [u, w] = r.p([['x', 'y'], ['a', 'b'], ['p', 'q']]), a = r.i(2, 6), b = uaNZ(r, -5, 5), X = uaNZ(r, -4, 6), Y = uaNZ(r, -3, 5), c = uaNZ(r, -9, 9), two = r.i(0, 1);
  const terms = two ? [[a, u], [b, w], [c, '']] : [[a, u], [c, '']], val = a * X + (two ? b * Y : 0) + c;
  const given = two ? `${u} = ${uaM(X)} dan ${w} = ${uaM(Y)}` : `${u} = ${uaM(X)}`;
  const sub = `${a}(${uaM(X)})` + (two ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}(${uaM(Y)})` : '') + ` ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
  return GEN_LQ('nilai', { e: uaE(terms), given, ans: uaM(val), work: [`= ${sub}`, `= ${uaM(val)}`] });
};
const uaRM = v => 'RM' + v;
UA.masalah = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { const n1 = r.i(2, 6), n2 = r.i(2, 5), d = r.i(1, 4), X = r.i(d + 3, 15);
    return GEN_LQ('masalah', { q: `Harga sebuah buku ialah RMx dan harga sebatang pen ialah RM${d} kurang daripada harga buku. ${vnama()} membeli ${n1} buah buku dan ${n2} batang pen. (a) Ungkapkan jumlah bayaran dalam sebutan x. (b) Hitung jumlah bayaran jika x = ${X}.`, ans: `(a) RM(${uaE([[n1 + n2, 'x'], [-n2 * d, '']])}) (b) ${uaRM((n1 + n2) * X - n2 * d)}`, work: [`Harga pen = RM(x − ${d})`, `Jumlah = ${n1}x + ${n2}(x − ${d}) = ${uaE([[n1 + n2, 'x'], [-n2 * d, '']])}`, `x = ${X}: ${n1 + n2}(${X}) − ${n2 * d} = ${(n1 + n2) * X - n2 * d}`] }); }
  if (k === 1) { const a = r.i(2, 5), b = r.i(1, 6), X = r.i(3, 9);
    return GEN_LQ('masalah', { q: `Panjang sebuah segi empat tepat ialah (${a}y + ${b}) cm dan lebarnya ialah y cm. (a) Ungkapkan perimeter segi empat tepat itu dalam sebutan y. (b) Cari perimeter jika y = ${X}.`, ans: `(a) (${2 * a + 2}y + ${2 * b}) cm (b) ${(2 * a + 2) * X + 2 * b} cm`, work: [`Perimeter = 2(${a}y + ${b}) + 2(y)`, `= ${2 * a}y + ${2 * b} + 2y = ${2 * a + 2}y + ${2 * b}`, `y = ${X}: ${2 * a + 2}(${X}) + ${2 * b} = ${(2 * a + 2) * X + 2 * b}`] }); }
  if (k === 2) { const m = r.i(2, 3), t = r.i(5, 15), N = r.i(5, 12);
    return GEN_LQ('masalah', { q: `Dalam satu perlawanan bola keranjang, Kevin menjaringkan n mata. Hafiz menjaringkan ${m} kali mata Kevin, dan Lim menjaringkan ${t} mata kurang daripada Hafiz. (a) Ungkapkan jumlah mata mereka bertiga dalam sebutan n. (b) Hitung jumlah mata jika n = ${N}.`, ans: `(a) ${uaE([[1 + 2 * m, 'n'], [-t, '']])} (b) ${(1 + 2 * m) * N - t}`, work: [`Hafiz = ${m}n, Lim = ${m}n − ${t}`, `Jumlah = n + ${m}n + ${m}n − ${t} = ${uaE([[1 + 2 * m, 'n'], [-t, '']])}`, `n = ${N}: ${(1 + 2 * m) * N - t}`] }); }
  const w = r.p([2, 3, 4]), s = r.i(3, 8), X = r.i(10, 30);
  return GEN_LQ('masalah', { q: `Sebuah bekas berisi x ml air. ${vnama()} menuang ${s * 10} ml ke dalam sebiji cawan, kemudian membahagikan baki air sama rata ke dalam ${w} botol. (a) Ungkapkan isi padu air dalam sebuah botol dalam sebutan x. (b) Cari isi padu itu jika x = ${X * 10 * w + s * 10}.`, ans: `(a) (x − ${s * 10})/${w} ml (b) ${X * 10} ml`, work: [`Baki = x − ${s * 10}`, `Sebuah botol = (x − ${s * 10}) ÷ ${w}`, `= (${X * 10 * w + s * 10} − ${s * 10}) ÷ ${w} = ${X * 10} ml`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '4.1': { m: [() => UA.bentuk(uaRG), () => UA.pekali(uaRG), () => UA.ringkas(uaRG, 'm'), () => UA.nilai(uaRG)], s: [() => UA.ringkas(uaRG, 's'), () => UA.darab(uaRG), () => UA.kembang(uaRG)], k: [() => UA.masalah(uaRG)] }
};
const WG = {
  bentuk: () => UA.bentuk(uaRW), balik: () => UA.balik(uaRW), pekali: () => UA.pekali(uaRW), serupa: () => UA.serupa(uaRW), ringkasM: () => UA.ringkas(uaRW, 'm'), nilai: () => UA.nilai(uaRW),
  ringkasS: () => UA.ringkas(uaRW, 's'), darab: () => UA.darab(uaRW), kembang: () => UA.kembang(uaRW), masalah: i => UA.masalah(uaRW, i)
};
const WSPLAN = {
  '4.1': [['m', 'bentuk', 4], ['m', 'balik', 2], ['m', 'pekali', 3], ['m', 'serupa', 2], ['m', 'ringkasM', 4], ['m', 'nilai', 3], ['s', 'ringkasS', 3], ['s', 'darab', 3], ['s', 'kembang', 3], ['k', 'masalah', 3]]
};

/* =================== GAMES =================== */
function uaMcq(q, ans, wrongs) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c) || /NaN|undefined/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const c = A.replace(/\d+/, m => String(+m + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  bentuk: L => {
    const v = pick(UAV), n = ri(2, 9);
    if (L === 0) return uaMcq(`“${n} kurang daripada ${v}” ialah`, `${v} − ${n}`, [`${n} − ${v}`, `${n}${v}`, `${v} + ${n}`]);
    if (L === 1) return uaMcq(`“${n} ditolak daripada tiga kali ${v}” ialah`, `3${v} − ${n}`, [`${n} − 3${v}`, `3(${v} − ${n})`, `3${v} + ${n}`]);
    return uaMcq(`Harga sebuah beg ialah RM${v}. Harga ${n} buah beg selepas diskaun RM${n + 1} ialah`, `${n}${v} − ${n + 1}`, [`${n}(${v} − ${n + 1})`, `${v} − ${n + 1}`, `${n}${v} + ${n + 1}`]);
  },
  ringkas: L => {
    const [u, w] = pick([['x', 'y'], ['a', 'b'], ['p', 'q']]), a = ri(2, 9), b = nz(-6, 6), c = nz(-7, 7);
    if (L === 0) { const res = uaCollect([[a, u], [c, u]], [u]); return uaMcq(`${uaE([[a, u], [c, u]])} = `, uaE(res), [uaE([[a - c, u]]), uaE([[a + c, u + u]]), uaE([[a * c, u]])]); }
    if (L === 1) { const res = [[a * 3, u], [b * 3, '']]; return uaMcq(`3(${uaE([[a, u], [b, '']])}) = `, uaE(res), [uaE([[a * 3, u], [b, '']]), uaE([[a + 3, u], [b + 3, '']]), uaE([[a * 3, u], [-b * 3, '']])]); }
    const A = [[a, u], [b, w]], B = [[ri(1, 5), u], [c, w]], res = uaCollect(A.concat(B.map(([k, v]) => [-k, v])), [u, w]);
    return uaMcq(`(${uaE(A)}) − (${uaE(B)}) = `, uaE(res), [uaE(uaCollect(A.concat([[-B[0][0], u], [B[1][0], w]]), [u, w])), uaE(uaCollect(A.concat(B), [u, w])), uaE(res.map(([k, v]) => [k + 1, v]))]);
  },
  nilai: L => {
    const a = ri(2, 6), c = nz(-9, 9), X = L === 0 ? ri(1, 6) : nz(-5, 5), v = a * X + c;
    if (L === 2) { const b = nz(-4, 4), Y = nz(-3, 4), val = a * X + b * Y; return uaMcq(`Jika x = ${uaM(X)} dan y = ${uaM(Y)}, nilai ${uaE([[a, 'x'], [b, 'y']])} ialah`, uaM(val), [uaM(a * X - b * Y), uaM(a + X + b + Y), uaM(-val)]); }
    return uaMcq(`Jika x = ${uaM(X)}, nilai ${uaE([[a, 'x'], [c, '']])} ialah`, uaM(v), [uaM(a + X + c), uaM(a * X - c), uaM(Number(String(a) + String(Math.abs(X))) + c)]);
  }
};
const CQT = { bentuk: 'Membentuk ungkapan', ringkas: 'Permudahkan ungkapan', nilai: 'Nilai ungkapan' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
