'use strict';
/* =================== PIAWAI · SOALAN BAB 2 BENTUK PIAWAI (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pw" / "PW" supaya tidak bertembung dengan teras.
// Nombor diwakili sebagai { m, e } = m × 10^e (m integer positif) supaya semua kiraan TEPAT (tiada ralat titik terapung).

/* =================== rawak =================== */
// pwRG untuk Latihan Kelas / games, pwRW (berbenih) untuk Lembaran Kerja
const pwRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const pwRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const pwShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pwDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);

/* =================== nombor tepat { m, e } =================== */
const PWNB = ' ';
const pwLen = m => String(m).length;
const pwV = (m, e) => ({ m, e });
const pwNorm = v => { let { m, e } = v; while (m && m % 10 === 0) { m /= 10; e++; } return { m, e }; };
// teks biasa m × 10^e (sifar dalam m dikekalkan)
function pwRaw(m, e) {
  const s = String(m);
  if (e >= 0) return s + '0'.repeat(e);
  const k = -e;
  if (s.length > k) return s.slice(0, s.length - k) + '.' + s.slice(s.length - k);
  return '0.' + '0'.repeat(k - s.length) + s;
}
// kumpulan digit cara KSSM: 47 826 · 0.000 305
function pwGrp(s) {
  let [a, b] = s.split('.');
  if (a.length >= 4) { const r = []; while (a.length > 3) { r.unshift(a.slice(-3)); a = a.slice(0, -3); } r.unshift(a); a = r.join(PWNB); }
  if (b !== undefined && b.length >= 5) b = b.match(/.{1,3}/g).join(PWNB);
  return b === undefined ? a : a + '.' + b;
}
const pwN = v => pwGrp(pwRaw(v.m, v.e));                  // paparan nombor (kekal sifar dalam m)
const pwNx = v => pwN(pwNorm(v));                          // paparan nilai tepat (tanpa sifar berlebihan)
const pwSup = n => `10<sup>${fmt(n)}</sup>`;
const pwE = (A, n) => `<span style="white-space:nowrap">${A} × ${pwSup(n)}</span>`;
// bentuk piawai { A, n, s }; keep = kekalkan sifar bererti dalam m (nilai yang dibundarkan)
function pwSF(v, keep) {
  const w = keep ? v : pwNorm(v), s = String(w.m), n = w.e + s.length - 1;
  const A = s.length > 1 ? s[0] + '.' + s.slice(1) : s;
  return { A, n, s: pwE(A, n) };
}
const pwS = (v, keep) => pwSF(v, keep).s;
// bundarkan kepada n angka bererti (separuh ke atas); m hasil mempunyai tepat n digit
function pwRound(v, n) {
  let { m, e } = v; const L = pwLen(m);
  if (L <= n) return { m: m * 10 ** (n - L), e: e - (n - L) };
  const d = L - n, p = 10 ** d; let q = Math.floor(m / p); const r = m - q * p;
  if (r * 2 >= p) q++;
  e += d;
  if (pwLen(q) > n) { q /= 10; e++; }
  return { m: q, e };
}
// pangkas (kesilapan biasa: tidak membundar)
function pwTrunc(v, n) { const L = pwLen(v.m); if (L <= n) return v; const d = L - n; return { m: Math.floor(v.m / 10 ** d), e: v.e + d }; }
const pwDropNZ = (v, n) => { const L = pwLen(v.m); return L > n && v.m % 10 ** (L - n) !== 0; };
const pwMul = (a, b) => ({ m: a.m * b.m, e: a.e + b.e });
function pwAlign(a, b) { const e = Math.min(a.e, b.e); return [a.m * 10 ** (a.e - e), b.m * 10 ** (b.e - e), e]; }
const pwAdd = (a, b) => { const [x, y, e] = pwAlign(a, b); return { m: x + y, e }; };
const pwSubV = (a, b) => { const [x, y, e] = pwAlign(a, b); return { m: x - y, e }; };
const pwCmp = (a, b) => { const [x, y] = pwAlign(a, b); return x - y; };
const pwSfn = v => pwSF(v).n;
// digit rawak: panjang L, digit pertama & terakhir bukan sifar
function pwDig(r, L, zeroMid) {
  let s = String(r.i(1, 9));
  for (let i = 1; i < L - 1; i++) s += String(zeroMid ? r.i(0, 9) : r.i(1, 9));
  if (L > 1) s += String(r.i(1, 9));
  return s;
}

/* =================== angka bererti =================== */
// topeng setiap digit: 's' bererti, 'n' tidak bererti, 'q' bergantung (sifar hujung nombor bulat tanpa maklumat)
function pwMask(str, place) {
  const s = str.replace(/[\s ]/g, ''), dig = s.replace('.', '').split(''), dec = s.includes('.');
  const first = dig.findIndex(c => c !== '0'); let last = -1;
  dig.forEach((c, i) => { if (c !== '0') last = i; });
  return dig.map((c, i) => {
    if (i < first) return 'n';
    if (dec || i <= last) return 's';
    if (place == null) return 'q';
    return i < dig.length - place ? 's' : 'n';
  });
}
const pwCount = (str, place) => pwMask(str, place).filter(x => x === 's').length;
const pwSigDig = (str, place) => { const d = str.replace(/[\s .]/g, '').split(''), m = pwMask(str, place); return d.filter((c, i) => m[i] === 's'); };
const PWPLACE = { 1: 'puluh', 2: 'ratus', 3: 'ribu', 4: 'puluh ribu', 5: 'ratus ribu' };

/* =================== rajah =================== */
const pwT = (x, y, t, c = 'tx', sz = 17, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
// jubin digit; cols(i) → nama warna atau null (biasa)
function pwTileParts(str, cols) {
  const TW = 40, TG = 6, PT = 16, SP = 14, TH = 52;
  let w = 0; for (const ch of str) w += ch === '.' ? PT : ch === PWNB || ch === ' ' ? SP : TW + TG;
  w -= TG;
  const VW = Math.max(320, Math.ceil(w + 40)), y = 30;
  let x = (VW - w) / 2, base = '', over = '', i = 0;
  for (const ch of str) {
    if (ch === '.') { base += `<circle cx="${+(x + PT / 2 - TG / 2).toFixed(1)}" cy="${y + TH - 7}" r="5" style="fill:var(--am)"/>`; x += PT; continue; }
    if (ch === PWNB || ch === ' ') { x += SP; continue; }
    base += `<rect x="${+x.toFixed(1)}" y="${y}" width="${TW}" height="${TH}" rx="9" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>` + pwT(x + TW / 2, y + TH / 2 + 1, ch, 'tx', 27);
    const c = cols ? cols(i) : null;
    if (c) over += `<rect x="${+x.toFixed(1)}" y="${y}" width="${TW}" height="${TH}" rx="9" style="fill:var(--${c});fill-opacity:.2;stroke:var(--${c})" stroke-width="3"/>` + pwT(x + TW / 2, y + TH / 2 + 1, ch, c, 27);
    x += TW + TG; i++;
  }
  return { VW, base, over };
}
const pwSvgWrap = (VW, H, inner, label) => `<svg viewBox="0 0 ${VW} ${H}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${inner}</svg>`;
function pwTiles(str, cols, label) { const t = pwTileParts(str, cols); return pwSvgWrap(t.VW, 112, t.base + t.over, label || 'Jubin digit'); }
const PWMC = { s: 'gr', n: 'mu', q: 'am' };
const pwSigTiles = (str, place) => { const m = pwMask(str, place); return pwTiles(str, i => PWMC[m[i]], 'Digit bererti diwarnakan hijau'); };
// kad ungkapan (games): baris teks HTML-bebas; superskrip guna tspan
function pwSvgSup(t, sz) {
  // "10^k" ditulis sebagai 10<sup>k</sup> dalam HTML → tspan dalam SVG
  return t.replace(/<\/?span[^>]*>/g, '').replace(/<sup>(.*?)<\/sup>/g, (_, k) => `<tspan dy="${-(sz * .42).toFixed(1)}" font-size="${+(sz * .68).toFixed(1)}">${k}</tspan><tspan dy="${+(sz * .42).toFixed(1)}">&#8203;</tspan>`);
}
function pwCard(lines, label) {
  const H = 60 + lines.length * 52;
  let s = `<rect x="10" y="10" width="300" height="${H - 20}" rx="18" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  lines.forEach(([t, c], i) => {
    const plain = t.replace(/<[^>]+>/g, ''), sz = Math.min(30, Math.floor(280 / (0.56 * Math.max(6, plain.length))));
    s += `<text x="160" y="${56 + i * 52}" style="fill:var(--${c || 'tx'})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="middle" dominant-baseline="central">${pwSvgSup(t, sz)}</text>`;
  });
  return pwSvgWrap(320, H, s, label || 'Ungkapan');
}
// segi empat tepat berlabel
function pwRectFig(p, l, u) {
  let s = `<rect x="60" y="34" width="200" height="120" rx="4" style="fill:var(--tr);fill-opacity:.16;stroke:var(--tr)" stroke-width="3.5"/>`;
  s += pwT(160, 176, `${p} ${u}`, 'pk', 18) + pwT(270, 94, `${l} ${u}`, 'am', 18, 'start');
  return pwSvgWrap(380, 200, s, 'Segi empat tepat');
}

/* =================== jalan kerja bersama =================== */
const pwExp = (a, op, b) => `${fmt(a)} ${op} ${par(b)}`;
const pwAdj = (v, n0) => { const x = pwSF(v); return x.n === n0 ? [] : [`= ${x.s}`]; };
// darab dua nilai dalam bentuk piawai
function pwMulWork(a, b) {
  const A = pwSF(a), Bf = pwSF(b), p = pwMul(a, b), k = A.n + Bf.n;
  const prodA = pwNx({ m: pwNorm(a).m * pwNorm(b).m, e: -(pwLen(pwNorm(a).m) - 1) - (pwLen(pwNorm(b).m) - 1) });
  return [`(${A.s}) × (${Bf.s})`, `= (${A.A} × ${Bf.A}) × 10<sup>${pwExp(A.n, '+', Bf.n)}</sup>`, `= ${prodA} × ${pwSup(k)}`].concat(pwAdj(p, k));
}
// bahagi (hasil mesti tepat)
function pwDivWork(a, b, q) {
  const A = pwSF(a), Bf = pwSF(b), k = A.n - Bf.n, qn = pwNorm(q);
  const quoA = pwNx({ m: qn.m, e: qn.e - k });
  return [`(${A.s}) ÷ (${Bf.s})`, `= (${A.A} ÷ ${Bf.A}) × 10<sup>${pwExp(A.n, '−', Bf.n)}</sup>`, `= ${quoA} × ${pwSup(k)}`].concat(pwAdj(q, k));
}
// tambah/tolak: a mempunyai indeks lebih besar atau sama
function pwAddWork(a, b, op) {
  const A = pwSF(a), Bf = pwSF(b), n = A.n, res = op === '+' ? pwAdd(a, b) : pwSubV(a, b);
  const toN = v => pwNx({ m: pwNorm(v).m, e: pwNorm(v).e - n });
  const w = [];
  if (Bf.n !== n) w.push(`Samakan indeks: ${Bf.s} = ${pwE(toN(b), n)}`);
  w.push(`${A.s} ${op} ${Bf.s} = (${A.A} ${op} ${toN(b)}) × ${pwSup(n)}`);
  w.push(`= ${pwE(toN(res), n)}`);
  return { res, work: w.concat(pwAdj(res, n)) };
}

/* =================== data bersama =================== */
const PWBS = [
  ['Semua digit bukan sifar ialah angka bererti.', true, 'Digit 1 hingga 9 sentiasa bererti.'],
  ['Sifar di hadapan digit bukan sifar pertama, seperti dalam 0.004, ialah angka bererti.', false, 'Sifar di hadapan digit bukan sifar pertama tidak bererti. 0.004 mempunyai 1 angka bererti.'],
  ['Nombor 5.020 mempunyai 4 angka bererti.', true, 'Sifar di antara digit bukan sifar dan sifar di hujung nombor perpuluhan adalah bererti: 5, 0, 2, 0.'],
  ['Nombor 0.0300 mempunyai 5 angka bererti.', false, 'Sifar di hadapan tidak bererti. Angka bererti ialah 3, 0, 0, iaitu 3 angka bererti.'],
  ['Sifar di antara dua digit bukan sifar sentiasa bererti.', true, 'Contohnya, 4 006 mempunyai 4 angka bererti.'],
  ['3 806 betul kepada 2 angka bererti ialah 38.', false, '3 8|06: 0 < 5, maka 8 kekal. Sifar pemegang tempat mesti ditulis: 3 800.'],
  ['0.0649 betul kepada 2 angka bererti ialah 0.065.', true, '0.064|9: 9 ≥ 5, maka 4 menjadi 5: 0.065.'],
  ['7.96 betul kepada 2 angka bererti ialah 8.0.', true, '7.9|6: 6 ≥ 5, maka 7.9 menjadi 8.0. Sifar ditulis supaya ada 2 angka bererti.'],
  ['Semakin banyak angka bererti, semakin kurang jitu sesuatu ukuran.', false, 'Semakin banyak angka bererti, semakin jitu ukuran itu.'],
  ['Nombor 12.0 mempunyai 2 angka bererti.', false, 'Sifar di hujung nombor perpuluhan adalah bererti. 12.0 mempunyai 3 angka bererti.']
];
// konteks yang sesuai dengan magnitud nombor
const PWCX_INT = [u => `Jumlah penduduk sebuah negeri ialah ${u} orang`, u => `Jarak yang dilalui oleh sebuah lori dalam setahun ialah ${u} km`, u => `Jisim muatan sebuah kapal ialah ${u} kg`, u => `Jumlah jualan sebuah syarikat pada tahun lalu ialah RM${u}`];
const PWCX_DEC = [u => `Bacaan sebuah penimbang digital ialah ${u} kg`, u => `Jisim suatu sampel bahan kimia ialah ${u} g`, u => `Hasil suatu ukuran di makmal ialah ${u} cm`, u => `Masa yang direkodkan oleh sebuah jam randik ialah ${u} saat`];
const PWCX_BIG = [u => `Jisim suatu objek ialah ${u} kg`, u => `Jarak yang dilalui oleh sebuah kenderaan ialah ${u} m`, u => `Luas suatu kawasan ialah ${u} m²`, u => `Isi padu air dalam sebuah takungan ialah ${u} liter`];
const PWCX_SML = [u => `Jisim suatu sampel bahan ialah ${u} kg`, u => `Ketebalan suatu lapisan salutan ialah ${u} m`, u => `Masa yang diambil oleh suatu proses ialah ${u} saat`, u => `Isi padu setitis cecair ialah ${u} liter`];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 2.1 Angka Bererti ---------- */
  kiraAB: [
    ({ N, ctx }) => ({ q: `Nyatakan bilangan angka bererti bagi ${N}${ctx}.` }),
    ({ N, ctx }) => ({ q: `Berapakah bilangan angka bererti dalam nombor ${N}${ctx}?` }),
    ({ N, ctx }) => ({ q: `Tentukan bilangan angka bererti bagi nombor ${N}${ctx}.` }),
    ({ N, ctx }) => ({ q: `Panjang seutas tali ialah ${N} cm${ctx}. Berapakah bilangan angka bererti bagi ukuran itu?` }),
    ({ N, ctx, wrong, ans, why }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} berkata nombor ${N}${ctx} mempunyai ${wrong} angka bererti. Adakah ${Nm} betul?` }, salah(Nm, ans, why)); }
  ],
  bundar: [
    ({ N, n }) => ({ q: `Bundarkan ${N} betul kepada ${n} angka bererti.` }),
    ({ N, n }) => ({ q: `Nyatakan ${N} betul kepada ${n} angka bererti.` }),
    ({ N, n, cx }) => ({ q: `${cx(N)}. Bundarkan nilai itu kepada ${n} angka bererti.` }),
    ({ N, n }) => ({ q: `Lengkapkan: ${N} = ___ (betul kepada ${n} angka bererti)` }),
    ({ N, n, wrong, ans, why }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} membundarkan ${N} kepada ${n} angka bererti dan mendapat ${wrong}. Adakah ${Nm} betul?` }, salah(Nm, ans, why)); }
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const Nm = vnama(); return { q: `${Nm} berkata, "${s}" Adakah ${Nm} betul?`, ans: ok ? `Ya, ${Nm} betul` : `Tidak, ${Nm} tidak betul` }; }
  ],
  kiraBundar: [
    ({ ex, n }) => ({ q: `Hitung nilai ${ex}. Beri jawapan betul kepada ${n} angka bererti.` }),
    ({ ex, n }) => ({ q: `Nilaikan ${ex}, kemudian bundarkan jawapan kepada ${n} angka bererti.` }),
    ({ ex, n, exact }) => ({ q: `Lengkapkan: ${ex} = ${exact} ≈ ___ (${n} angka bererti)` }),
    ({ ex, n, exact, wrong, ans }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} mendapati ${ex} = ${exact}, lalu menulis jawapan ${wrong} betul kepada ${n} angka bererti. Adakah ${Nm} betul?` }, salah(Nm, ans, `Bundarkan ${exact} dengan melihat digit selepas digit ke-${n}.`)); }
  ],
  luas: [
    ({ p, l, n, u }) => ({ q: `Sekeping kad berbentuk segi empat tepat mempunyai panjang ${p} ${u} dan lebar ${l} ${u}. Hitung luas kad itu, betul kepada ${n} angka bererti.` }),
    ({ n }) => ({ q: `Rajah di bawah menunjukkan sekeping jubin berbentuk segi empat tepat. Hitung luas jubin itu dan bundarkan jawapan kepada ${n} angka bererti.` }),
    ({ p, l, n, u }) => ({ q: `Sehelai kertas lukisan berukuran ${p} ${u} × ${l} ${u}. Cari luas kertas itu, betul kepada ${n} angka bererti.` })
  ],
  pilihAB: [
    ({ list, k }) => ({ q: `Antara nombor ${pwDan(list)}, yang manakah mempunyai ${k} angka bererti?` }),
    ({ list, k }) => ({ q: `Nombor manakah mempunyai tepat ${k} angka bererti: ${pwDan(list)}?` }),
    ({ list, k }) => ({ q: `Diberi nombor ${pwDan(list)}. Nyatakan nombor yang mempunyai ${k} angka bererti.` })
  ],
  k21: [
    ({ jul }) => ({ q: `Suatu integer positif apabila dibundarkan kepada ${jul.n} angka bererti menjadi ${jul.R}. Cari nilai terkecil dan nilai terbesar yang mungkin bagi integer itu.`, ans: `Terkecil: ${jul.lo}, terbesar: ${jul.hi}`, work: [`Digit ke-${jul.n} berada pada tempat ${jul.pl}.`, `Integer itu mesti ≥ ${jul.lo} dan &lt; ${jul.hp} supaya dibundarkan kepada ${jul.R}.`, `Terkecil = ${jul.lo}, terbesar = ${jul.hi}`] }),
    ({ kub }) => ({ q: `Sebuah kotak berbentuk kubus mempunyai sisi ${kub.s} cm. Hitung isi padu kotak itu, betul kepada ${kub.n} angka bererti.`, ans: `${kub.ans} cm³`, work: [`Isi padu = ${kub.s} × ${kub.s} × ${kub.s}`, `= ${kub.exact} cm³`, `≈ ${kub.ans} cm³ (${kub.n} angka bererti)`] }),
    ({ avg }) => ({ q: `Jisim empat biji tembikai ialah ${pwDan(avg.xs.map(x => x + ' kg'))}. Hitung min jisim sebiji tembikai, betul kepada 3 angka bererti.`, ans: `${avg.ans} kg`, work: [`Jumlah jisim = ${avg.xs.join(' + ')} = ${avg.sum} kg`, `Min = ${avg.sum} ÷ 4 = ${avg.exact} kg`, `≈ ${avg.ans} kg (3 angka bererti)`] }),
    ({ hrg }) => { const Nm = vnama(); return { q: `Harga sebatang pen ialah RM${hrg.p}. ${Nm} membeli ${hrg.k} batang pen untuk kelasnya. Anggarkan jumlah harga pen itu, betul kepada 2 angka bererti.`, ans: `RM${hrg.ans}`, work: [`Jumlah harga = ${hrg.k} × RM${hrg.p} = RM${hrg.exact}`, `≈ RM${hrg.ans} (2 angka bererti)`] }; }
  ],

  /* ---------- 2.2 Bentuk Piawai ---------- */
  tulisBP: [
    ({ N }) => ({ q: `Tulis ${N} dalam bentuk piawai.` }),
    ({ N }) => ({ q: `Ungkapkan ${N} dalam bentuk piawai.` }),
    ({ N }) => ({ q: `Nyatakan ${N} dalam bentuk A × 10<sup>n</sup>, dengan 1 ≤ A &lt; 10 dan n ialah integer.` }),
    ({ N, cx }) => ({ q: `${cx(N)}. Tulis nilai itu dalam bentuk piawai.` }),
    ({ N, wrong, ans, why }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} menulis ${N} dalam bentuk piawai sebagai ${wrong}. Adakah ${Nm} betul?` }, salah(Nm, ans, why)); }
  ],
  keNombor: [
    ({ E }) => ({ q: `Tulis ${E} sebagai nombor tunggal.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} sebagai nombor tunggal.` }),
    ({ E, cx }) => ({ q: `${cx(E)}. Tulis nilai itu sebagai nombor tunggal.` }),
    ({ E }) => ({ q: `Lengkapkan: ${E} = ___` })
  ],
  kenalBP: [
    ({ list, ok }) => ({ q: `Antara ungkapan berikut, yang manakah ditulis dalam bentuk piawai? ${list.map((x, i) => `(${['i', 'ii', 'iii', 'iv'][i]}) ${x}`).join(' &nbsp; ')}`, ans: ok.ans, work: ok.work }),
    ({ fix }) => ({ q: `Ungkapan ${fix.E} bukan dalam bentuk piawai. Tulis semula ungkapan itu dalam bentuk piawai.`, ans: fix.ans, work: fix.work }),
    ({ an }) => ({ q: `Apabila ${an.N} ditulis dalam bentuk piawai A × 10<sup>n</sup>, nyatakan nilai A dan nilai n.`, ans: `A = ${an.A}, n = ${fmt(an.n)}`, work: an.work })
  ],
  tambahTolak: [
    ({ ex }) => ({ q: `Hitung ${ex}. Nyatakan jawapan dalam bentuk piawai.` }),
    ({ ex }) => ({ q: `Nilaikan ${ex} dan ungkapkan jawapan dalam bentuk piawai.` }),
    ({ ex }) => ({ q: `Lengkapkan dalam bentuk piawai: ${ex} = ___` }),
    ({ ex, wrong, ans }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} mengira ${ex} = ${wrong}. Adakah ${Nm} betul?` }, salah(Nm, ans, 'Indeks mesti disamakan dahulu sebelum nilai A ditambah atau ditolak.')); }
  ],
  darabBahagi: [
    ({ ex }) => ({ q: `Hitung ${ex}. Nyatakan jawapan dalam bentuk piawai.` }),
    ({ ex }) => ({ q: `Nilaikan ${ex} dan ungkapkan jawapan dalam bentuk piawai.` }),
    ({ ex }) => ({ q: `Permudahkan ${ex}. Beri jawapan dalam bentuk piawai.` }),
    ({ ex, wrong, ans, op }) => { const Nm = vnama(); return Object.assign({ q: `${Nm} mendapati ${ex} = ${wrong}. Adakah ${Nm} betul?` }, salah(Nm, ans, op === '×' ? 'Apabila mendarab, indeks ditambah, kemudian nilai A dilaraskan supaya 1 ≤ A &lt; 10.' : 'Apabila membahagi, indeks ditolak, kemudian nilai A dilaraskan supaya 1 ≤ A &lt; 10.')); }
  ],
  abBP: [
    ({ N, n }) => ({ q: `Bundarkan ${N} betul kepada ${n} angka bererti, kemudian tulis jawapan dalam bentuk piawai.` }),
    ({ N, n }) => ({ q: `Ungkapkan ${N} dalam bentuk piawai, betul kepada ${n} angka bererti.` }),
    ({ N, n, cx }) => ({ q: `${cx(N)}. Tulis nilai itu dalam bentuk piawai, betul kepada ${n} angka bererti.` })
  ],
  k22: [
    ({ isy }) => ({ q: `Isyarat radio bergerak pada laju ${pwE(3, 5)} km sesaat. Sebuah kapal angkasa berada ${isy.D} km dari Bumi. Berapakah masa, dalam saat, untuk isyarat itu sampai ke kapal angkasa? Beri jawapan dalam bentuk piawai.`, ans: `${isy.T} saat`, work: ['Masa = jarak ÷ laju'].concat(isy.work) }),
    ({ sel }) => ({ q: `Diameter sejenis sel ialah ${sel.d} m. Berapakah bilangan sel yang boleh disusun sebaris dalam jarak ${sel.L} m? Beri jawapan dalam bentuk piawai.`, ans: sel.N, work: ['Bilangan sel = jarak ÷ diameter'].concat(sel.work) }),
    ({ pad }) => ({ q: `Keluasan sebuah daerah ialah ${pad.A} km². Secara purata, terdapat ${pad.P} orang bagi setiap km². Anggarkan bilangan penduduk daerah itu dalam bentuk piawai.`, ans: `${pad.ans} orang`, work: ['Bilangan penduduk = keluasan × kepadatan'].concat(pad.work) }),
    ({ fail }) => ({ q: `Sebuah pemacu kilat boleh menyimpan ${fail.S} bait data. Setiap fail gambar bersaiz ${fail.F} bait. Berapakah bilangan maksimum fail gambar yang boleh disimpan? Beri jawapan dalam bentuk piawai dan sebagai nombor tunggal.`, ans: `${fail.ans} = ${fail.num}`, work: ['Bilangan fail = jumlah storan ÷ saiz satu fail'].concat(fail.work, [`= ${fail.num}`]) })
  ]
};

/* =================== pembina soalan (r = pwRG atau pwRW) =================== */
const PW = {};
/* ---------- 2.1 ---------- */
// nombor untuk mengira angka bererti; kind: a semua bukan sifar · b sifar di tengah · c sifar di hadapan · d sifar di hujung perpuluhan · e sifar di hujung nombor bulat
function pwABNum(r, kind) {
  const withPt = (s, pos) => (pos >= s.length ? s : s.slice(0, pos) + '.' + s.slice(pos));
  let raw, place = null;
  if (kind === 'a') { const L = r.i(3, 5); raw = withPt(pwDig(r, L, false), r.i(1, L)); }
  else if (kind === 'b') {
    let s; do { s = pwDig(r, r.i(4, 6), true); } while (!s.slice(1, -1).includes('0'));
    raw = withPt(s, r.i(1, s.length));
  } else if (kind === 'c') { raw = '0.' + '0'.repeat(r.i(1, 3)) + pwDig(r, r.i(2, 4), true); }
  else if (kind === 'd') {
    const core = pwDig(r, r.i(1, 3), true), z = '0'.repeat(r.i(1, 2));
    if (r.f() < .35) raw = '0.0' + core + z;
    else { const ps = r.i(1, core.length); raw = core.slice(0, ps) + '.' + core.slice(ps) + z; }
  } else {
    const core = pwDig(r, r.i(2, 3), true), z = r.i(2, 4); place = r.i(1, z); raw = core + '0'.repeat(z);
  }
  const str = pwGrp(raw), k = pwCount(raw, place);
  return { raw, str, place, k, kind, total: raw.replace('.', '').length };
}
const PWRULE = {
  a: 'Semua digit bukan sifar adalah bererti.',
  b: 'Sifar di antara digit bukan sifar adalah bererti.',
  c: 'Sifar di hadapan digit bukan sifar pertama tidak bererti.',
  d: 'Sifar di hujung nombor perpuluhan adalah bererti.'
};
const PWKIND = ['a', 'b', 'c', 'd', 'e'];
PW.kiraAB = (r, kind) => {
  kind = kind || r.p(PWKIND);
  const d = pwABNum(r, kind), { str, place, k } = d;
  const ctx = place ? ` (betul kepada ${PWPLACE[place]} terdekat)` : '';
  const sig = pwSigDig(d.raw, place);
  const rule = kind === 'e' ? `Nombor itu betul kepada ${PWPLACE[place]} terdekat, maka digit hingga tempat ${PWPLACE[place]} adalah bererti.` : PWRULE[kind];
  const extra = kind !== 'c' && d.raw.startsWith('0') ? [PWRULE.c] : [];
  const work = [rule].concat(extra, [`Angka bererti: ${sig.join(', ')}`, `Bilangan angka bererti = ${k}`]);
  let wrong, why;
  if (kind === 'e') { wrong = d.total; why = `Sifar selepas tempat ${PWPLACE[place]} tidak bererti kerana nombor itu hanya betul kepada ${PWPLACE[place]} terdekat.`; }
  else if (d.total !== k) { wrong = d.total; why = `${d.total} ialah bilangan semua digit. ${PWRULE.c}`; }
  else { wrong = k - 1; why = `Nombor ini mempunyai ${k} digit dan semua digit itu bererti.`; }
  return GEN_LQ('kiraAB', { N: str, ctx, k, ans: String(k), wrong, why, work },
    { fig: pwTiles(str, null, `Jubin digit ${str}`), figAns: pwSigTiles(str, place) });
};
// bundar: kind 'int' atau 'dec'
PW.bundar = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'int' : 'dec');
  let v, n;
  if (kind === 'int') {
    do { const L = r.i(4, 7); v = pwV(+pwDig(r, L, true), 0); n = r.i(1, Math.min(4, L - 1)); } while (!pwDropNZ(v, n));
  } else {
    do {
      if (r.f() < .5) { const L = r.i(4, 5); v = pwV(+pwDig(r, L, true), -(L + r.i(0, 2))); }
      else { const L = r.i(4, 6); v = pwV(+pwDig(r, L, true), -r.i(1, L - 1)); }
      n = r.i(1, 3);
    } while (!pwDropNZ(v, n) || pwLen(v.m) <= n);
  }
  const R = pwRound(v, n), N = pwN(v), ans = pwN(R), ds = String(v.m), X = ds[n - 1], Y = +ds[n];
  const work = [`Digit ke-${n} ialah ${X} dan digit selepasnya ialah ${Y}.`, Y >= 5 ? `${Y} ≥ 5, maka tambah 1 pada digit ke-${n}.` : `${Y} &lt; 5, maka digit ke-${n} kekal.`];
  if (R.e > 0) work.push(kind === 'int' ? `Gantikan digit selepas digit ke-${n} dengan sifar.` : 'Gantikan digit nombor bulat selepas digit itu dengan sifar dan gugurkan digit perpuluhan.');
  else if (R.e === 0 && v.e < 0) work.push('Gugurkan semua digit perpuluhan.');
  else work.push(`Gugurkan digit selepas digit ke-${n}.`);
  work.push(`${N} ≈ ${ans}`);
  const T = pwTrunc(v, n);
  let wrong, why;
  if (kind === 'int') { wrong = String(R.m); why = 'Sifar pemegang tempat mesti ditulis supaya nilai nombor tidak berubah.'; }
  else if (pwN(T) !== ans) { wrong = pwN(T); why = `Digit selepas digit ke-${n} ialah ${Y} ≥ 5, maka perlu tambah 1.`; }
  else { const W = pwRound(v, n + 1); wrong = pwN(W); why = `${wrong} mempunyai ${n + 1} angka bererti, bukan ${n}.`; }
  return GEN_LQ('bundar', { N, n, ans, wrong, why, work, cx: r.p(kind === 'int' ? PWCX_INT : PWCX_DEC) });
};
PW.bs = (r, k) => { const [s, ok, why] = k == null ? r.p(PWBS) : PWBS[k % PWBS.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
// nombor perpuluhan rawak dengan L digit dan t tempat perpuluhan
const pwDecR = (r, L, t) => pwV(+pwDig(r, L, true), -t);
function pwKBData(r) {
  let a, b, op, exact, n;
  do {
    op = r.p(['×', '×', '+', '−', '²']);
    n = r.p([2, 3]);
    a = pwDecR(r, r.i(2, 3), r.i(1, 2)); b = pwDecR(r, r.i(2, 3), r.i(1, 2));
    if (op === '×') exact = pwMul(a, b);
    else if (op === '²') exact = pwMul(a, a);
    else if (op === '+') exact = pwAdd(a, b);
    else { if (pwCmp(a, b) <= 0) [a, b] = [b, a]; exact = pwSubV(a, b); }
    exact = pwNorm(exact);
  } while (!exact.m || !pwDropNZ(exact, n) || pwLen(exact.m) < n + 1);
  const ex = op === '²' ? `${pwN(a)}<sup>2</sup>` : `${pwN(a)} ${op} ${pwN(b)}`;
  const R = pwRound(exact, n), ans = pwN(R), T = pwTrunc(exact, n);
  const wrong = pwN(T) !== ans ? pwN(T) : pwN(pwRound(exact, n + 1));
  return { ex, n, exact: pwN(exact), R, ans, wrong, work: [`${ex} = ${pwN(exact)}`, `Digit selepas digit ke-${n} ialah ${String(exact.m)[n]}.`, `${pwN(exact)} ≈ ${ans} (${n} angka bererti)`] };
}
PW.kiraBundar = r => GEN_LQ('kiraBundar', pwKBData(r));
PW.luas = r => {
  let p, l, A, n;
  do { p = pwDecR(r, r.i(2, 3), 1); l = pwDecR(r, r.i(2, 3), r.i(1, 2)); A = pwNorm(pwMul(p, l)); n = r.p([2, 3, 3]); } while (pwCmp(p, l) <= 0 || pwCmp(l, pwV(1, 0)) < 0 || !pwDropNZ(A, n) || pwLen(A.m) < n + 1);
  const P = pwN(p), Ls = pwN(l), ans = pwN(pwRound(A, n)), u = 'cm';
  return GEN_LQ('luas', { p: P, l: Ls, n, u, ans: `${ans} ${u}²`, work: [`Luas = panjang × lebar = ${P} × ${Ls}`, `= ${pwN(A)} ${u}²`, `≈ ${ans} ${u}² (${n} angka bererti)`] }, { fig: pwRectFig(P, Ls, u) });
};
PW.pilihAB = r => {
  let nums, k;
  do {
    nums = pwShuf(r, ['a', 'b', 'c', 'd']).map(kd => pwABNum(r, kd));
    k = r.p(nums).k;
  } while (nums.filter(x => x.k === k).length !== 1 || new Set(nums.map(x => x.str)).size < 4);
  const S = nums.find(x => x.k === k);
  return GEN_LQ('pilihAB', { list: nums.map(x => x.str), k, ans: S.str, work: nums.map(x => `${x.str}: ${x.k} angka bererti`) });
};
PW.k21 = r => {
  // (1) julat integer
  const n = r.p([2, 3]), dd = r.i(1, 3); let q; do { q = +pwDig(r, n, true); } while (q % 10 === 0);
  const P = 10 ** dd, R = q * P, lo = (q * 10 - 5) * P / 10, hp = (q * 10 + 5) * P / 10;
  const jul = { n, R: pwGrp(String(R)), lo: pwGrp(String(lo)), hi: pwGrp(String(hp - 1)), hp: pwGrp(String(hp)), pl: PWPLACE[dd] };
  // (2) kubus
  let s, ex, kn; do { s = pwDecR(r, 2, 1); ex = pwNorm(pwMul(pwMul(s, s), s)); kn = r.p([2, 3]); } while (!pwDropNZ(ex, kn));
  const kub = { s: pwN(s), n: kn, exact: pwN(ex), ans: pwN(pwRound(ex, kn)) };
  // (3) min empat jisim
  let xs, sum, mean; do { xs = [0, 0, 0, 0].map(() => pwV(r.i(150, 480), -2)); sum = xs.reduce((a, b) => pwAdd(a, b)); mean = pwNorm({ m: sum.m * 25, e: sum.e - 2 }); } while (!pwDropNZ(mean, 3) || xs.some(x => x.m % 10 === 0));
  const avg = { xs: xs.map(pwN), sum: pwNx(sum), exact: pwN(mean), ans: pwN(pwRound(mean, 3)) };
  // (4) harga
  let pp, kk, tot; do { pp = pwV(r.i(21, 199) * 5, -2); kk = r.i(12, 48); tot = pwNorm({ m: pp.m * kk, e: pp.e }); } while (!pwDropNZ(tot, 2) || pp.m % 100 === 0);
  const totS = pwRaw(pp.m * kk, -2);
  const hrg = { p: pwRaw(pp.m, -2), k: kk, exact: pwGrp(totS), ans: pwN(pwRound(tot, 2)) };
  return GEN_LQ('k21', { jul, kub, avg, hrg });
};

/* ---------- 2.2 ---------- */
// nombor besar (≥ 10) atau kecil (antara 0 dan 1) dengan 1–4 angka bererti
function pwBig(r) { const L = r.i(1, 4); let v; do { v = pwV(+pwDig(r, L, true), r.i(-2, 6)); } while (pwSfn(v) < 1 || pwSfn(v) > 8 || (v.e < 0 && pwLen(v.m) + v.e < 2)); return v; }
function pwSmall(r) { const L = r.i(1, 3), m = +pwDig(r, L, true), n = -r.i(1, 7); return pwV(m, n - (L - 1)); }
PW.tulisBP = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'big' : 'small');
  const v = kind === 'big' ? pwBig(r) : pwSmall(r), N = pwN(v), F = pwSF(v), ans = F.s;
  const moves = Math.abs(F.n);
  const work = [`Letakkan titik perpuluhan selepas digit bukan sifar pertama: A = ${F.A}`, `Titik perpuluhan bergerak ${moves} tempat ke ${F.n > 0 ? 'kiri' : 'kanan'}, maka n = ${fmt(F.n)}.`, `${N} = ${ans}`];
  let wrong, why;
  if (kind === 'big') { const A10 = pwNx({ m: pwNorm(v).m, e: -(pwLen(pwNorm(v).m) - 2) }); wrong = pwE(A10, F.n - 1); why = `Nilai A mesti kurang daripada 10. ${A10} ≥ 10.`; }
  else { wrong = pwE(F.A, -F.n); why = 'Nombor antara 0 dan 1 mempunyai indeks n yang negatif.'; }
  return GEN_LQ('tulisBP', { N, ans, wrong, why, work, cx: r.p(kind === 'big' ? PWCX_BIG : PWCX_SML) });
};
PW.keNombor = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'big' : 'small');
  const L = r.i(1, 4), m = +pwDig(r, L, true), n = kind === 'big' ? r.i(1, 7) : -r.i(1, 6), v = pwV(m, n - (L - 1)), F = pwSF(v), E = F.s, ans = pwN(v);
  return GEN_LQ('keNombor', { E, ans, cx: r.p(n > 0 ? PWCX_BIG : PWCX_SML), work: [`n = ${fmt(n)}, maka gerakkan titik perpuluhan ${Math.abs(n)} tempat ke ${n > 0 ? 'kanan' : 'kiri'}.`, `${E} = ${ans}`] });
};
PW.kenalBP = r => {
  // (1) pilih yang betul
  const A1 = pwSF(pwV(+pwDig(r, r.i(2, 3), true), 0)).A, n1 = r.n(-6, 8);
  const badA = [String(r.i(11, 99)), '0.' + r.i(1, 9), String(r.i(10, 99)) + '.' + r.i(1, 9), '0.0' + r.i(1, 9)];
  const list = pwShuf(r, [pwE(A1, n1)].concat(pwShuf(r, badA).slice(0, 3).map(a => pwE(a, r.n(-6, 8)))));
  const ok = { ans: pwE(A1, n1), work: [`Dalam ${pwE(A1, n1)}, 1 ≤ ${A1} &lt; 10 dan ${fmt(n1)} ialah integer.`, 'Ungkapan lain mempunyai A ≥ 10 atau A &lt; 1.'] };
  // (2) betulkan
  let fix; {
    const big = r.f() < .5, L = r.i(2, 3), m = +pwDig(r, L, true), n0 = r.n(-5, 6);
    const As = big ? pwRaw(m, -(L - 2)) : pwRaw(m, -L), v = big ? pwV(m, n0 - (L - 2)) : pwV(m, n0 - L), F = pwSF(v);
    fix = { E: pwE(As, n0), ans: F.s, work: [big ? `${As} = ${F.A} × 10<sup>1</sup>` : `${As} = ${F.A} × 10<sup>−1</sup>`, `${pwE(As, n0)} = ${F.A} × 10<sup>${pwExp(n0, '+', big ? 1 : -1)}</sup>`, `= ${F.s}`] };
  }
  // (3) A dan n
  const vv = r.f() < .5 ? pwBig(r) : pwSmall(r), Fv = pwSF(vv);
  const an = { N: pwN(vv), A: Fv.A, n: Fv.n, work: [`${pwN(vv)} = ${Fv.s}`, `A = ${Fv.A}, n = ${fmt(Fv.n)}`] };
  return GEN_LQ('kenalBP', { list, ok, fix, an });
};
// nilai dalam bentuk piawai dengan A berdigit L
const pwSFv = (r, L, n) => { const m = +pwDig(r, L, true); if (n === 0) n = r.f() < .5 ? 1 : -1; return pwV(m, n - (L - 1)); };
const pwAv = v => { const w = pwNorm(v); return pwV(w.m, -(pwLen(w.m) - 1)); };   // nilai A sahaja
function pwTTData(r, same) {
  let a, b, op, W;
  do {
    const n1 = r.i(-4, 7), n2 = same ? n1 : n1 - r.i(1, 2);
    a = pwSFv(r, r.i(1, 2), n1); b = pwSFv(r, r.i(1, 2), n2); op = r.f() < .5 ? '+' : '−';
    W = pwAddWork(a, b, op);
  } while (W.res.m <= 0 || pwCmp(a, b) <= 0);
  const ex = `${pwS(a)} ${op} ${pwS(b)}`, F = pwSF(W.res), ans = F.s, Aa = pwSF(a), Ab = pwSF(b);
  // kesilapan biasa: tambah/tolak nilai A tanpa menyamakan indeks (atau menambah indeks)
  let wrong = null;
  const wA = op === '+' ? pwAdd(pwAv(a), pwAv(b)) : pwSubV(pwAv(a), pwAv(b));
  if (wA.m > 0 && pwCmp(wA, pwV(10, 0)) < 0 && pwCmp(wA, pwV(1, 0)) >= 0) wrong = pwE(pwNx(wA), same ? Aa.n + Ab.n : Aa.n);
  if (!wrong || wrong === ans) wrong = pwE(F.A, F.n + 1);
  return { ex, ans, wrong, F, work: W.work };
}
PW.tambahTolak = (r, same) => GEN_LQ('tambahTolak', pwTTData(r, same));
function pwDBData(r, op) {
  op = op || (r.f() < .5 ? '×' : '÷');
  let a, b, res, work;
  if (op === '×') { a = pwSFv(r, r.i(1, 2), r.i(-6, 8)); b = pwSFv(r, r.i(1, 2), r.i(-6, 8)); res = pwMul(a, b); work = pwMulWork(a, b); }
  else {
    let q; do { q = pwSFv(r, r.i(1, 2), r.i(-5, 7)); b = pwSFv(r, 1, r.i(-6, 8)); a = pwMul(q, b); } while (pwLen(pwNorm(a).m) > 3);
    res = q; work = pwDivWork(a, b, q);
  }
  const ex = `(${pwS(a)}) ${op} (${pwS(b)})`, F = pwSF(res), ans = F.s, Aa = pwSF(a), Ab = pwSF(b);
  // kesilapan biasa: darab indeks (×) atau tambah indeks (÷)
  let wrong = pwE(F.A, op === '×' ? Aa.n * Ab.n : Aa.n + Ab.n);
  if (wrong === ans) wrong = pwE(F.A, F.n + (op === '×' ? 1 : -1));
  return { ex, ans, wrong, op, F, work };
}
PW.darabBahagi = (r, op) => GEN_LQ('darabBahagi', pwDBData(r, op));
PW.abBP = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'big' : 'small');
  let v, n;
  do {
    const L = r.i(4, 6);
    v = kind === 'big' ? pwV(+pwDig(r, L, true), r.i(-1, 3)) : pwV(+pwDig(r, L, true), -(L + r.i(1, 4)));
    n = r.p([2, 3]);
  } while (!pwDropNZ(v, n) || (kind === 'big' && pwSfn(v) < 3));
  const R = pwRound(v, n), F = pwSF(R, true), ans = F.s;
  return GEN_LQ('abBP', { N: pwN(v), n, ans, cx: r.p(kind === 'big' ? PWCX_BIG : PWCX_SML), work: [`${pwN(v)} ≈ ${pwN(R)} (${n} angka bererti)`, `${pwN(R)} = ${ans}`] });
};
PW.k22 = r => {
  // (1) isyarat radio: masa = jarak ÷ (3 × 10^5)
  const T = pwSFv(r, r.p([1, 1, 2]), r.i(1, 4)), c = pwV(3, 5), Dd = pwMul(T, c);
  const isy = { D: pwS(Dd), T: pwS(T), work: pwDivWork(Dd, c, T) };
  // (2) sel
  const N = pwV(r.p([2, 4, 5, 8, 12, 25]), r.i(2, 3)), dm = pwV(r.p([2, 4, 5, 8]), -r.i(5, 6)), L = pwMul(N, dm);
  const sel = { d: pwS(dm), L: pwS(L), N: pwS(N), work: pwDivWork(L, dm, N) };
  // (3) kepadatan penduduk
  const Ar = pwSFv(r, 2, r.i(3, 4)), Pd = pwSFv(r, r.i(1, 2), 2), pop = pwMul(Ar, Pd);
  const pad = { A: pwS(Ar), P: pwS(Pd), ans: pwS(pop), work: pwMulWork(Ar, Pd) };
  // (4) fail
  const F = pwSFv(r, 2, 6), Nf = pwV(r.p([2, 4, 5, 8, 12, 15, 25]), r.i(1, 2)), St = pwMul(F, Nf);
  const fail = { S: pwS(St), F: pwS(F), ans: pwS(Nf), num: pwNx(Nf), work: pwDivWork(St, F, Nf) };
  return GEN_LQ('k22', { isy, sel, pad, fail });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '2.1': {
    m: [() => PW.kiraAB(pwRG), () => PW.kiraAB(pwRG), () => PW.bundar(pwRG, 'int'), () => PW.bundar(pwRG, 'dec'), () => PW.bs(pwRG)],
    s: [() => PW.kiraBundar(pwRG), () => PW.luas(pwRG), () => PW.pilihAB(pwRG)],
    k: [() => PW.k21(pwRG)]
  },
  '2.2': {
    m: [() => PW.tulisBP(pwRG, 'big'), () => PW.tulisBP(pwRG, 'small'), () => PW.keNombor(pwRG), () => PW.kenalBP(pwRG)],
    s: [() => PW.tambahTolak(pwRG, false), () => PW.tambahTolak(pwRG, true), () => PW.darabBahagi(pwRG), () => PW.abBP(pwRG)],
    k: [() => PW.k22(pwRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 2.1
WG.kiraAB = i => PW.kiraAB(pwRW, PWKIND[i % 5]);
WG.bundarInt = () => PW.bundar(pwRW, 'int');
WG.bundarDec = () => PW.bundar(pwRW, 'dec');
WG.bs = i => PW.bs(pwRW, i * 3 + wri(0, 2));
WG.kiraBundar = () => PW.kiraBundar(pwRW);
WG.luas = () => PW.luas(pwRW);
WG.pilihAB = () => PW.pilihAB(pwRW);
WG.k21 = () => PW.k21(pwRW);
// 2.2
WG.tulisBesar = () => PW.tulisBP(pwRW, 'big');
WG.tulisKecil = () => PW.tulisBP(pwRW, 'small');
WG.keNombor = i => PW.keNombor(pwRW, i % 2 ? 'small' : 'big');
WG.kenalBP = () => PW.kenalBP(pwRW);
WG.tambahTolak = i => PW.tambahTolak(pwRW, i === 0);
WG.darabBahagi = i => PW.darabBahagi(pwRW, i % 2 ? '÷' : '×');
WG.abBP = i => PW.abBP(pwRW, i % 2 ? 'small' : 'big');
WG.k22 = () => PW.k22(pwRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '2.1': [['m', 'kiraAB', 8], ['m', 'bundarInt', 4], ['m', 'bundarDec', 4], ['m', 'bs', 2], ['s', 'kiraBundar', 3], ['s', 'luas', 3], ['s', 'pilihAB', 3], ['k', 'k21', 3]],
  '2.2': [['m', 'tulisBesar', 5], ['m', 'tulisKecil', 5], ['m', 'keNombor', 5], ['m', 'kenalBP', 3], ['s', 'tambahTolak', 3], ['s', 'darabBahagi', 3], ['s', 'abBP', 3], ['k', 'k22', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan unik: jawapan + calon (rentetan) + pengisi fill(k)
function pwOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || c === '' || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (c != null && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pwMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const pwAlt = k => (k % 2 ? 1 : -1) * Math.ceil(k / 2);
const pwFillN = ans => k => { const v = +ans + pwAlt(k); return v > 0 ? String(v) : null; };
const pwFillE = (A, n) => k => pwE(A, n + pwAlt(k));
function pwCqAB(level) {
  if (level < 2) {
    const kind = level === 0 ? pick(['a', 'b', 'c']) : pick(['c', 'd', 'e', 'b']), d = pwABNum(pwRG, kind);
    const ctx = d.place ? ` (betul kepada ${PWPLACE[d.place]} terdekat)` : '';
    const t = pwTileParts(d.str, i => PWMC[pwMask(d.raw, d.place)[i]]);
    const fig = pwSvgWrap(t.VW, 112, t.base, `Nombor ${d.str}`);
    return pwMcq(`Berapakah bilangan angka bererti bagi ${d.str}${ctx}?`, fig, pwOpts(String(d.k), [String(d.total), String(d.k + 1), String(d.k - 1), String(pwSigDig(d.raw).length)], pwFillN(d.k)), t.over);
  }
  return pwPilihGame();
}
function pwPilihGame() {
  let nums, k;
  do { nums = shuffle(['a', 'b', 'c', 'd']).map(kd => pwABNum(pwRG, kd)); k = pick(nums).k; } while (nums.filter(x => x.k === k).length !== 1 || new Set(nums.map(x => x.str)).size < 4);
  const S = nums.find(x => x.k === k), opts = shuffle(nums.map(x => x.str));
  return { type: 'mcq', q: `Nombor manakah mempunyai <b>${k} angka bererti</b>?`, fig: pwCard([[`${k} angka bererti`, 'tr']], 'Bilangan angka bererti'), opts, c: opts.indexOf(S.str) };
}
function pwCqBundar(level) {
  if (level === 2) {
    const d = pwKBData(pwRG);
    return pwMcq(`Nilaikan ${d.ex}, betul kepada <b>${d.n} angka bererti</b>.`, pwCard([[d.ex, 'tx'], [`${d.n} angka bererti`, 'am']]), pwOpts(d.ans, [d.wrong, pwN({ m: d.R.m + 1, e: d.R.e }), pwN({ m: d.R.m - 1, e: d.R.e })], k => { const m = d.R.m + pwAlt(k); return m > 0 ? pwN({ m, e: d.R.e }) : null; }));
  }
  let v, n;
  const kind = level === 0 ? 'int' : 'dec';
  if (kind === 'int') { do { const L = ri(4, 6); v = pwV(+pwDig(pwRG, L, true), 0); n = ri(1, Math.min(3, L - 1)); } while (!pwDropNZ(v, n)); }
  else { do { const L = ri(4, 5); v = pwV(+pwDig(pwRG, L, true), Math.random() < .5 ? -(L + ri(0, 2)) : -ri(1, L - 1)); n = ri(1, 3); } while (!pwDropNZ(v, n) || pwLen(v.m) <= n); }
  const R = pwRound(v, n), ans = pwN(R), N = pwN(v);
  const cands = [pwN(pwTrunc(v, n)), pwN(pwRound(v, Math.max(1, n - 1))), pwN(pwRound(v, n + 1)), kind === 'int' && n > 1 ? String(R.m) : null, pwN({ m: R.m + 1, e: R.e })];
  const t = pwTileParts(N, i => (i < n ? 'gr' : i === n ? 'pk' : null));
  return pwMcq(`Bundarkan ${N} kepada <b>${n} angka bererti</b>.`, pwSvgWrap(t.VW, 112, t.base, `Nombor ${N}`), pwOpts(ans, cands, k => { const m = R.m + pwAlt(k); return m > 0 ? pwN({ m, e: R.e }) : null; }), t.over);
}
function pwCqPiawai(level) {
  if (level === 0) {
    const v = pwBig(pwRG), F = pwSF(v), N = pwN(v);
    const A10 = pwNx({ m: pwNorm(v).m, e: -(pwLen(pwNorm(v).m) - 2) });
    return pwMcq(`Tulis ${N} dalam bentuk piawai.`, pwTiles(N, null, `Nombor ${N}`), pwOpts(F.s, [pwE(F.A, F.n + 1), pwE(F.A, F.n - 1), pwE(F.A, -F.n), pwE(A10, F.n - 1)], pwFillE(F.A, F.n)));
  }
  if (level === 1) {
    if (Math.random() < .5) {
      const v = pwSmall(pwRG), F = pwSF(v), N = pwN(v);
      return pwMcq(`Tulis ${N} dalam bentuk piawai.`, pwTiles(N, null, `Nombor ${N}`), pwOpts(F.s, [pwE(F.A, -F.n), pwE(F.A, F.n + 1), pwE(F.A, F.n - 1)], pwFillE(F.A, F.n)));
    }
    const L = ri(1, 3), m = +pwDig(pwRG, L, true), n = nz(-5, 6), v = pwV(m, n - (L - 1)), F = pwSF(v);
    return pwMcq(`Tulis ${F.s} sebagai nombor tunggal.`, pwCard([[F.s, 'pu']]), pwOpts(pwN(v), [pwN(pwV(m, n - L)), pwN(pwV(m, n - L + 2)), pwN(pwV(m, -n - (L - 1)))], k => pwN(pwV(m, n - (L - 1) + pwAlt(k)))));
  }
  const kind = Math.random() < .5 ? 'big' : 'small';
  let v, n;
  do { const L = ri(4, 6); v = kind === 'big' ? pwV(+pwDig(pwRG, L, true), ri(-1, 3)) : pwV(+pwDig(pwRG, L, true), -(L + ri(1, 4))); n = pick([2, 3]); } while (!pwDropNZ(v, n) || (kind === 'big' && pwSfn(v) < 3));
  const R = pwRound(v, n), F = pwSF(R, true), T = pwSF(pwTrunc(v, n), true);
  return pwMcq(`Tulis ${pwN(v)} dalam bentuk piawai, betul kepada ${n} angka bererti.`, pwTiles(pwN(v), null, `Nombor ${pwN(v)}`), pwOpts(F.s, [T.s, pwE(F.A, F.n + 1), pwE(F.A, F.n - 1), pwE(F.A, -F.n), pwSF(pwRound(v, n + 1), true).s], pwFillE(F.A, F.n)));
}
function pwCqOperasi(level) {
  let d;
  if (level === 0) d = pwTTData(pwRG, true);
  else if (level === 1) d = Math.random() < .5 ? pwDBData(pwRG, '×') : pwTTData(pwRG, false);
  else d = pwDBData(pwRG, Math.random() < .7 ? '÷' : '×');
  const { A, n } = d.F;
  return pwMcq(`Hitung ${d.ex}. Berikan jawapan dalam bentuk piawai.`, pwCard([[d.ex, 'tx']], 'Ungkapan'), pwOpts(d.ans, [d.wrong, pwE(A, n + 1), pwE(A, n - 1), pwE(A, -n)], pwFillE(A, n)));
}
const CQGEN = { angka: pwCqAB, bundar: pwCqBundar, piawai: pwCqPiawai, operasi: pwCqOperasi };
const CQT = { angka: 'Angka bererti', bundar: 'Membundarkan', piawai: 'Bentuk piawai', operasi: 'Operasi bentuk piawai' };
function pwCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fn = CQGEN[ty] || CQGEN.angka;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fn(k);
}
function gq(level) {
  const pool = level === 0 ? ['angka', 'angka', 'bundar', 'piawai', 'piawai'] : Object.keys(CQT);
  return pwCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pwCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
