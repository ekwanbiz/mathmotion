'use strict';
/* =================== MIN MOD · SOALAN BAB 12 SUKATAN KECENDERUNGAN MEMUSAT (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "kc" / "KC" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & statistik =================== */
// nombor kemas: bundar 2 t.p., tiada −0, tanda tolak sebenar
const kcN = x => { let v = Math.round(x * 100) / 100; if (Object.is(v, -0) || Math.abs(v) < 1e-9) v = 0; return (v < 0 ? '−' : '') + String(Math.abs(v)); };
const kcClean = x => Math.abs(Math.round(x * 100) - x * 100) < 1e-7;          // tepat ≤ 2 tempat perpuluhan
const kcL = a => a.map(kcN).join(', ');
const kcSum = a => a.reduce((s, x) => s + x, 0);
const kcSort = a => a.slice().sort((p, q) => p - q);
const kcMean = a => kcSum(a) / a.length;
const kcMed = a => { const s = kcSort(a), n = s.length; return (s[(n - 1) >> 1] + s[n >> 1]) / 2; };
const kcCount = a => { const m = new Map(); a.forEach(x => m.set(x, (m.get(x) || 0) + 1)); return m; };
// senarai mod (kosong jika semua nilai sama kerap)
const kcMod = a => { const m = kcCount(a), mx = Math.max(...m.values()); if ([...m.values()].every(c => c === mx) && m.size > 1) return []; return [...m.keys()].filter(k => m.get(k) === mx).sort((p, q) => p - q); };
const kcModTxt = ms => (ms.length ? ms.map(kcN).join(' dan ') : 'tiada mod');
const kcDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const kcGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// rawak: kcRG untuk Latihan Kelas / games, kcRW (berbenih) untuk Lembaran Kerja
const kcRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const kcRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const kcShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const kcPlus = a => a.map(kcN).join(' + ');
const kcKel = (a, b) => `${a} – ${b}`;

/* =================== konteks data =================== */
// t(n) → frasa huruf kecil; lo..hi julat nilai; u unit jawapan
const KCCTX = [
  { t: n => `bilangan gol yang dijaringkan oleh sebuah pasukan dalam ${n} perlawanan`, lo: 0, hi: 6, u: '' },
  { t: n => `markah kuiz ${n} orang murid`, lo: 2, hi: 10, u: '' },
  { t: n => `bilangan adik-beradik ${n} orang murid`, lo: 1, hi: 7, u: '' },
  { t: n => `saiz kasut ${n} orang murid`, lo: 3, hi: 9, u: '' },
  { t: n => `jisim, dalam kg, ${n} biji tembikai`, lo: 2, hi: 9, u: ' kg' },
  { t: n => `bilangan jam ${n} orang murid bersukan dalam seminggu`, lo: 1, hi: 12, u: ' jam' },
  { t: n => `suhu, dalam °C, di sebuah bandar selama ${n} hari`, lo: 24, hi: 34, u: '°C' },
  { t: n => `bilangan buku yang dibaca oleh ${n} orang murid dalam sebulan`, lo: 0, hi: 9, u: '' },
  { t: n => `bilangan mesej yang diterima oleh ${n} orang murid dalam sejam`, lo: 2, hi: 15, u: '' }
];
const KCJCTX = [ // jadual kekerapan / plot titik: [paksi x, perkataan subjek]
  { x: 'Bilangan adik-beradik', who: 'murid', lo: 1 },
  { x: 'Markah kuiz', who: 'murid', lo: 3 },
  { x: 'Bilangan buku dibaca', who: 'murid', lo: 0 },
  { x: 'Bilangan gol', who: 'perlawanan', lo: 0 },
  { x: 'Saiz kasut', who: 'murid', lo: 4 },
  { x: 'Bilangan kereta', who: 'keluarga', lo: 0 }
];
const KCGCTX = [ // data terkumpul: nama pemboleh ubah, unit, subjek, pilihan [saiz kelas, had bawah kelas pertama]
  { x: 'Jisim (kg)', nm: 'jisim', u: ' kg', who: 'murid', g: [[5, [30, 35, 40]]] },
  { x: 'Markah', nm: 'markah', u: '', who: 'murid', g: [[10, [1, 11, 21, 31, 41]], [5, [40, 45, 50, 55]]] },
  { x: 'Masa (minit)', nm: 'masa', u: ' minit', who: 'murid', g: [[5, [5, 10, 15, 20]], [10, [1, 11, 21]]] },
  { x: 'Tinggi (cm)', nm: 'tinggi', u: ' cm', who: 'pokok', g: [[10, [11, 21, 31, 41]], [5, [20, 25, 30]]] },
  { x: 'Umur (tahun)', nm: 'umur', u: ' tahun', who: 'pengunjung', g: [[10, [1, 11, 21]]] }
];

/* =================== rajah (SVG, warna var(--…)) =================== */
const kcT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const kcLn = (x1, y1, x2, y2, c = 'mu', w = 2.5, dash) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const kcRect = (x, y, w, h, c = 'bd', fill = 'surf', op = 1, rx = 6) => `<rect x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" rx="${rx}" style="fill:var(--${fill});fill-opacity:${op};stroke:var(--${c})" stroke-width="2"/>`;
const kcSvg = (w, h, s, label) => `<svg viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// cip data
function kcChipsFig(vals, label, hl) {
  const per = Math.min(6, vals.length), rows = Math.ceil(vals.length / per), cw = 48, gap = 8, W = Math.max(320, per * (cw + gap) + 24);
  let s = '';
  vals.forEach((v, i) => {
    const r = Math.floor(i / per), c = i % per, n = Math.min(per, vals.length - r * per), x0 = (W - (n * (cw + gap) - gap)) / 2;
    const on = hl && hl.includes(i);
    s += kcRect(x0 + c * (cw + gap), 14 + r * 52, cw, 42, on ? 'am' : 'bd', on ? 'am' : 'surf', on ? .2 : 1, 9) + kcT(x0 + c * (cw + gap) + cw / 2, 35 + r * 52, kcN(v), 'tx', 18);
  });
  return kcSvg(W, rows * 52 + 20, s, label || 'Set data');
}
// plot titik
function kcDotFig(data, lo, hi, xl, label, mark) {
  const cnt = kcCount(data), mx = Math.max(...cnt.values()), W = 340, L = 26, R = W - 26, gap = 17;
  const base = 30 + mx * gap, H = base + (xl ? 58 : 34);
  const X = v => L + (v - lo) / (hi - lo) * (R - L);
  let s = kcLn(L - 10, base, R + 10, base, 'mu', 2.5);
  for (let v = lo; v <= hi; v++) s += kcLn(X(v), base - 5, X(v), base + 5, 'mu', 2) + ((hi - lo > 12 && (v - lo) % 2) ? '' : kcT(X(v), base + 19, kcN(v), 'mu', 13, 'middle', 600));
  const k = new Map();
  kcSort(data).forEach(v => { const j = k.get(v) || 0; k.set(v, j + 1); s += `<circle cx="${+X(v).toFixed(1)}" cy="${+(base - 14 - j * gap).toFixed(1)}" r="7" style="fill:var(--${mark && mark.includes(v) ? 'pk' : 'tr'})"/>`; });
  if (xl) s += kcT(W / 2, base + 44, xl, 'mu', 14, 'middle', 600);
  return kcSvg(W, H, s, label || 'Plot titik');
}
// jadual kekerapan mengufuk (x, f)
function kcTabFig(xl, xs, fs, fl = 'Kekerapan', label, xsTxt) {
  const n = xs.length, c0 = 150, cw = 42, W = c0 + n * cw + 12, H = 92, cell = v => (typeof v === 'string' ? `<tspan style="font-style:italic">${v}</tspan>` : kcN(v));
  let s = kcRect(6, 6, W - 12, 80, 'bd', 'surf', 1, 10) + kcLn(6, 46, W - 6, 46, 'bd', 2) + kcLn(c0, 6, c0, 86, 'bd', 2);
  s += kcT(c0 / 2 + 3, 26, xl, 'tr', 12.5) + kcT(c0 / 2 + 3, 66, fl, 'pa', 13);
  xs.forEach((x, i) => { s += kcT(c0 + cw * i + cw / 2, 26, xsTxt ? xsTxt[i] : kcN(x), 'tx', 15) + kcT(c0 + cw * i + cw / 2, 66, cell(fs[i]), 'tx', 15); if (i) s += kcLn(c0 + cw * i, 6, c0 + cw * i, 86, 'bd', 1); });
  return kcSvg(W, H, s, label || 'Jadual kekerapan');
}
// jadual data terkumpul menegak
function kcClassFig(xl, cls, fs, label, extra) {
  const n = cls.length, rh = 30, W = 300, H = (n + 1) * rh + 16;
  let s = kcRect(6, 6, W - 12, H - 12, 'bd', 'surf', 1, 10) + kcLn(W / 2, 6, W / 2, H - 6, 'bd', 2);
  s += kcT(W / 4 + 3, 6 + rh / 2 + 2, xl, 'pu', 14) + kcT(3 * W / 4 - 3, 6 + rh / 2 + 2, extra || 'Kekerapan', 'pa', 14) + kcLn(6, 6 + rh + 2, W - 6, 6 + rh + 2, 'bd', 2);
  cls.forEach(([a, b], i) => { const y = 6 + rh * (i + 1) + rh / 2 + 4; s += kcT(W / 4 + 3, y, kcKel(a, b), 'tx', 15) + kcT(3 * W / 4 - 3, y, fs[i] === null ? '<tspan style="font-style:italic">p</tspan>' : kcN(fs[i]), 'tx', 15); });
  return kcSvg(W, H, s, label || 'Jadual kekerapan data terkumpul');
}
// jadual data terkumpul dua kumpulan
function kcClass2Fig(xl, cls, fA, fB, hA, hB) {
  const n = cls.length, rh = 30, W = 330, H = (n + 1) * rh + 16, c1 = 130, c2 = 230;
  let s = kcRect(6, 6, W - 12, H - 12, 'bd', 'surf', 1, 10) + kcLn(c1, 6, c1, H - 6, 'bd', 2) + kcLn(c2, 6, c2, H - 6, 'bd', 2) + kcLn(6, 6 + rh + 2, W - 6, 6 + rh + 2, 'bd', 2);
  s += kcT(c1 / 2 + 3, 23, xl, 'pu', 13) + kcT((c1 + c2) / 2, 23, hA, 'tr', 13) + kcT((c2 + W) / 2 - 3, 23, hB, 'pa', 13);
  cls.forEach(([a, b], i) => { const y = 6 + rh * (i + 1) + rh / 2 + 4; s += kcT(c1 / 2 + 3, y, kcKel(a, b), 'tx', 15) + kcT((c1 + c2) / 2, y, kcN(fA[i]), 'tx', 15) + kcT((c2 + W) / 2 - 3, y, kcN(fB[i]), 'tx', 15); });
  return kcSvg(W, H, s, 'Jadual kekerapan dua kumpulan');
}
// carta palang / histogram
function kcBarFig(labels, vals, o) {
  o = o || {};
  const n = labels.length, W = 340, H = 236, L = 44, R = W - 12, T = 22, B = H - 46, mx = Math.max(...vals);
  const st = mx <= 6 ? 1 : mx <= 12 ? 2 : mx <= 30 ? 5 : 10, top = Math.ceil(mx / st) * st + (mx % st === 0 ? st : 0);
  const Y = v => B - v / top * (B - T), cw = (R - L) / n;
  let s = '';
  for (let v = 0; v <= top; v += st) s += kcLn(L, Y(v), R, Y(v), 'grid', 1.2) + kcT(L - 7, Y(v), kcN(v), 'mu', 12, 'end', 600);
  vals.forEach((v, i) => {
    const w = o.hist ? cw : cw * .62, x = L + i * cw + (cw - w) / 2, hl = o.hl === i;
    if (v > 0) s += `<rect x="${+x.toFixed(1)}" y="${+Y(v).toFixed(1)}" width="${+w.toFixed(1)}" height="${+(B - Y(v)).toFixed(1)}" style="fill:var(--${hl ? 'pk' : (o.c || 'tr')});fill-opacity:.8;stroke:var(--nav)" stroke-width="${o.hist ? 1.5 : 0}"/>`;
    s += kcT(L + i * cw + cw / 2, B + 15, labels[i], 'mu', n > 5 ? 11 : 12.5, 'middle', 600);
  });
  s += kcLn(L, B, R, B, 'mu', 2.5) + kcLn(L, B, L, T - 6, 'mu', 2.5);
  if (o.yl) s += kcT(L - 4, T - 12, o.yl, 'mu', 12, 'start', 600);
  if (o.xl) s += kcT((L + R) / 2, H - 10, o.xl, 'mu', 13, 'middle', 600);
  return kcSvg(W, H, s, o.label || (o.hist ? 'Histogram' : 'Carta palang'));
}
// plot batang-dan-daun
function kcStemFig(data, label) {
  const s0 = kcSort(data), st = {}; s0.forEach(v => (st[Math.floor(v / 10)] = st[Math.floor(v / 10)] || []).push(v % 10));
  const lo = Math.floor(s0[0] / 10), hi = Math.floor(s0[s0.length - 1] / 10), rows = hi - lo + 1, H = 58 + rows * 30 + 26, W = Math.max(320, 140 + Math.max(...Object.values(st).map(a => a.length)) * 22);
  let s = kcT(70, 20, 'Batang', 'mu', 13, 'middle', 600) + kcT(170, 20, 'Daun', 'mu', 13, 'middle', 600) + kcLn(100, 34, 100, 34 + rows * 30, 'mu', 2.5);
  for (let k = lo; k <= hi; k++) { const y = 49 + (k - lo) * 30; s += kcT(70, y, String(k), 'tx', 18); (st[k] || []).forEach((d, j) => { s += kcT(122 + j * 22, y, String(d), 'tx', 18); }); }
  s += kcT(W / 2, H - 14, `Kekunci: ${lo} | ${st[lo][0]} bermaksud ${lo * 10 + st[lo][0]}`, 'mu', 13, 'middle', 600);
  return kcSvg(W, H, s, label || 'Plot batang-dan-daun');
}
// kad teks besar (games tanpa rajah lain)
function kcCardFig(lines, label) {
  const W = 340, H = 40 + lines.length * 34;
  let s = kcRect(6, 6, W - 12, H - 12, 'bd', 'surf', 1, 16);
  lines.forEach(([t, c, sz], i) => { s += kcT(W / 2, 38 + i * 34, t, c || 'tx', sz || 19); });
  return kcSvg(W, H, s, label || 'Maklumat soalan');
}

/* =================== penjana data =================== */
// set data dengan SATU mod (muncul 3 kali, nilai lain ≤ 2 kali)
function kcModeData(r, n, lo, hi) {
  let d, mo;
  do {
    mo = r.i(lo, hi); d = [mo, mo, mo];
    while (d.length < n) { const v = r.i(lo, hi); if (v !== mo && d.filter(x => x === v).length < 2) d.push(v); }
  } while (kcMod(d).length !== 1);
  return { d: kcShuf(r, d), mo };
}
// set data bebas dengan min tepat ≤ 2 t.p. (laraskan nilai terakhir)
function kcMeanData(r, n, lo, hi) {
  let d;
  do {
    d = []; for (let i = 0; i < n; i++) d.push(r.i(lo, hi));
    let k = 0; while (!kcClean(kcMean(d)) && k < 12) { d[n - 1]++; k++; }
  } while (!kcClean(kcMean(d)) || d[n - 1] > hi + 4 || new Set(d).size < 3);
  return kcShuf(r, d);
}
// jadual kekerapan x lo..lo+4 dengan min tepat
function kcFreqData(r, lo, needMed) {
  let xs, fs, data;
  do {
    xs = [0, 1, 2, 3, 4].map(k => lo + k); fs = xs.map(() => r.i(1, 9));
    data = []; xs.forEach((x, i) => { for (let k = 0; k < fs[i]; k++) data.push(x); });
  } while (!kcClean(kcMean(data)) || kcMod(data).length !== 1 || (needMed && false));
  return { xs, fs, data };
}
// data terkumpul: kelas bersaiz w bermula a0, k kelas
function kcGroupData(r, ctx, kk) {
  const [w, a0s] = r.p(ctx.g), k = kk || r.i(4, 5), a0 = r.p(a0s);
  const cls = []; for (let i = 0; i < k; i++) cls.push([a0 + i * w, a0 + i * w + w - 1]);
  let fs, mids, sf, sfx;
  do {
    fs = cls.map(() => r.i(1, 10)); mids = cls.map(([a, b]) => (a + b) / 2);
    sf = kcSum(fs); sfx = kcSum(fs.map((f, i) => f * mids[i]));
  } while (!kcClean(sfx / sf) || fs.filter(f => f === Math.max(...fs)).length !== 1);
  return { w, cls, fs, mids, sf, sfx, mean: sfx / sf, ctx };
}
const kcFxWork = g => [
  `Titik tengah, x: ${kcDan(g.mids.map(kcN))}`,
  `Σf = ${kcPlus(g.fs)} = ${g.sf}`,
  `Σfx = ${g.fs.map((f, i) => `${f}(${kcN(g.mids[i])})`).join(' + ')} = ${kcN(g.sfx)}`,
  `Min = Σfx ÷ Σf = ${kcN(g.sfx)} ÷ ${g.sf} = ${kcN(g.mean)}`
];
// kerja median
function kcMedWork(d) {
  const s = kcSort(d), n = s.length;
  const w = [`Susun mengikut tertib menaik: ${kcL(s)}`, `Bilangan data, n = ${n}`];
  if (n % 2) w.push(`n ganjil: median ialah nilai ke-${(n + 1) / 2} = ${kcN(s[(n - 1) / 2])}`);
  else w.push(`n genap: median = purata nilai ke-${n / 2} dan ke-${n / 2 + 1}`, `= (${kcN(s[n / 2 - 1])} + ${kcN(s[n / 2])}) ÷ 2 = ${kcN(kcMed(s))}`);
  return w;
}
const kcMeanWork = d => [`Hasil tambah = ${kcPlus(d)} = ${kcN(kcSum(d))}`, `Bilangan data = ${d.length}`, `Min = ${kcN(kcSum(d))} ÷ ${d.length} = ${kcN(kcMean(d))}`];
function kcModWork(d) {
  const c = kcCount(d), ms = kcMod(d), mx = Math.max(...c.values());
  return [`Kira kekerapan setiap nilai: ${kcSort([...c.keys()]).map(k => `${kcN(k)} (${c.get(k)})`).join(', ')}`, ms.length ? `Kekerapan tertinggi ialah ${mx}, maka mod = ${kcModTxt(ms)}` : 'Semua nilai sama kerap, maka tiada mod'];
}

/* =================== pernyataan betul / salah =================== */
const KCBS2 = [
  ['Jika setiap nilai dalam suatu set data ditambah 5, min set data itu juga bertambah 5.', true, 'Tambah nombor yang sama kepada setiap nilai: mod, median dan min bertambah dengan nombor itu.'],
  ['Jika setiap nilai dalam suatu set data didarab 2, median set data itu tidak berubah.', false, 'Setiap nilai didarab 2, maka median juga didarab 2.'],
  ['Nilai ekstrem paling banyak mempengaruhi min berbanding mod dan median.', true, 'Min menggunakan semua nilai data, jadi nilai ekstrem menarik min ke arahnya.'],
  ['Jika setiap nilai ditolak 3, mod set data itu bertambah 3.', false, 'Setiap nilai ditolak 3, maka mod juga berkurang 3.'],
  ['Menambah satu data yang sama dengan min tidak mengubah min set data itu.', true, 'Hasil tambah bertambah dengan min dan bilangan data bertambah 1, maka min kekal.'],
  ['Jika setiap nilai dibahagi 4, min set data itu juga dibahagi 4.', true, 'Bahagi setiap nilai dengan 4, maka mod, median dan min juga dibahagi 4.'],
  ['Membuang data yang lebih besar daripada min akan menaikkan min.', false, 'Membuang data yang lebih besar daripada min akan menurunkan min.'],
  ['Nilai ekstrem tidak mengubah min suatu set data.', false, 'Nilai ekstrem mengubah min dengan banyak kerana min menggunakan semua data.']
];
const KCBS3 = [
  ['Titik tengah bagi kelas 20 – 29 ialah 24.5.', true, 'Titik tengah = (20 + 29) ÷ 2 = 24.5'],
  ['Kelas mod ialah kelas yang mempunyai kekerapan tertinggi.', true, 'Kelas mod ialah selang kelas dengan kekerapan tertinggi.'],
  ['Min data terkumpul dikira dengan menggunakan had atas setiap kelas.', false, 'Min data terkumpul menggunakan titik tengah setiap kelas.'],
  ['Saiz selang kelas bagi kelas 10 – 14, 15 – 19, 20 – 24 ialah 4.', false, 'Saiz selang kelas = 15 − 10 = 5.'],
  ['Min yang dikira daripada data terkumpul ialah nilai anggaran.', true, 'Nilai sebenar setiap data dalam kelas tidak diketahui, maka min ialah anggaran.'],
  ['Dalam histogram, kelas mod diwakili oleh palang yang paling tinggi.', true, 'Palang paling tinggi mempunyai kekerapan tertinggi.'],
  ['Selang kelas dalam jadual kekerapan boleh bertindih, contohnya 10 – 20 dan 20 – 30.', false, 'Selang kelas tidak boleh bertindih supaya setiap data dikira sekali sahaja.'],
  ['Min data terkumpul = Σfx ÷ bilangan kelas.', false, 'Min = Σfx ÷ Σf, iaitu jumlah kekerapan, bukan bilangan kelas.']
];
const KCBS4 = [
  ['Mod ialah sukatan yang paling sesuai untuk data kategori seperti warna kegemaran.', true, 'Data kategori bukan nombor, jadi hanya mod boleh ditentukan.'],
  ['Min ialah sukatan yang paling sesuai jika terdapat nilai ekstrem.', false, 'Nilai ekstrem menjejaskan min; median lebih sesuai.'],
  ['Median tidak banyak terjejas oleh nilai ekstrem.', true, 'Median hanya bergantung pada kedudukan nilai di tengah.'],
  ['Min menggunakan semua nilai dalam set data.', true, 'Min = hasil tambah semua nilai ÷ bilangan data.'],
  ['Min boleh dikira bagi data saiz baju S, M, L dan XL.', false, 'Saiz baju ialah data kategori; hanya mod boleh ditentukan.'],
  ['Min gabungan dua kelas sentiasa sama dengan purata dua min itu.', false, 'Min gabungan bergantung pada bilangan murid dalam setiap kelas.'],
  ['Median sesuai untuk mewakili harga rumah di suatu kawasan yang mempunyai beberapa rumah yang sangat mahal.', true, 'Rumah yang sangat mahal ialah nilai ekstrem, maka median lebih sesuai.'],
  ['Satu set data sentiasa mempunyai satu mod sahaja.', false, 'Satu set data boleh mempunyai lebih daripada satu mod atau tiada mod.']
];
const KCPILIH = [
  ['Seorang pemilik kedai ingin mengetahui saiz baju yang paling laris dijual.', 'Mod', 'saiz baju ialah data kategori dan pemilik ingin tahu saiz yang paling kerap dibeli'],
  ['Seorang guru ingin mewakili markah ujian 30 orang murid. Markah antara 45 hingga 85 tanpa nilai ekstrem.', 'Min', 'data berangka tanpa nilai ekstrem dan min menggunakan semua markah'],
  ['Gaji bulanan 8 orang pekerja sebuah syarikat, termasuk gaji pengurus yang jauh lebih tinggi daripada pekerja lain.', 'Median', 'gaji pengurus ialah nilai ekstrem yang menjejaskan min'],
  ['Warna kereta yang paling popular di sebuah tempat letak kereta.', 'Mod', 'warna ialah data kategori'],
  ['Harga rumah di sebuah taman perumahan yang mempunyai beberapa banglo yang sangat mahal.', 'Median', 'harga banglo yang sangat mahal ialah nilai ekstrem'],
  ['Suhu harian sebuah bandar selama seminggu: 30°C, 31°C, 29°C, 32°C, 30°C, 31°C, 30°C.', 'Min', 'data berangka tanpa nilai ekstrem'],
  ['Perisa aiskrim kegemaran murid-murid Tingkatan 2.', 'Mod', 'perisa ialah data kategori'],
  ['Masa larian 10 orang peserta, dengan seorang peserta tercedera dan mengambil masa yang sangat lama.', 'Median', 'masa peserta yang tercedera ialah nilai ekstrem'],
  ['Jisim 20 biji telur yang hampir sama antara satu sama lain.', 'Min', 'data berangka tanpa nilai ekstrem dan min menggunakan semua data'],
  ['Jenama telefon pintar yang paling ramai digunakan oleh guru di sebuah sekolah.', 'Mod', 'jenama ialah data kategori'],
  ['Bilangan pengunjung harian sebuah muzium dalam sebulan, termasuk satu hari cuti umum yang sangat ramai pengunjung.', 'Median', 'bilangan pengunjung pada hari cuti umum ialah nilai ekstrem'],
  ['Tinggi 25 anak benih dalam satu eksperimen yang tumbuh dengan seragam.', 'Min', 'data berangka tanpa nilai ekstrem']
];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 12.1.1 Mod, Median dan Min ---------- */
  modS: [
    ({ L }) => ({ q: `Cari mod bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Nyatakan mod data itu.` }),
    ({ L }) => ({ q: `Apakah nilai yang paling kerap muncul dalam set data ${L}?` }),
    ({ L, mc, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata mod bagi data ${L} ialah ${mc} kerana nilai mod muncul ${mc} kali. Adakah ${N} betul?` }, salah(N, ans, 'Mod ialah nilai data yang paling kerap muncul, bukan bilangan kali ia muncul.')); },
    ({ L, ctx }) => ({ q: `${vcap(ctx)} ialah ${L}. Tentukan mod.` })
  ],
  medS: [
    ({ L }) => ({ q: `Cari median bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Tentukan median data itu.` }),
    ({ L }) => ({ q: `Susun data berikut mengikut tertib menaik, kemudian nyatakan mediannya.<br>${L}` }),
    ({ L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata median bagi data ${L} ialah ${wrong}, iaitu nilai di tengah senarai itu. Adakah ${N} betul?` }, salah(N, ans, 'Data mesti disusun mengikut tertib dahulu sebelum mencari nilai di tengah.')); }
  ],
  minS: [
    ({ L }) => ({ q: `Hitung min bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Hitung min data itu.` }),
    ({ L, n }) => ({ q: `Cari min bagi ${n} nombor berikut: ${L}` }),
    ({ L, n, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira min bagi data ${L} dan mendapat ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} membahagikan hasil tambah dengan ${n - 1}. Sepatutnya bahagi dengan bilangan data, iaitu ${n}.`)); },
    ({ L, ctx }) => ({ q: `${vcap(ctx)} ialah ${L}. Berapakah min?` })
  ],
  plotS: [
    ({ what, who }) => ({ q: `Plot titik di bawah menunjukkan suatu data bagi beberapa ${who}. Cari ${what} data itu.` }),
    ({ what }) => ({ q: `Berdasarkan plot titik di bawah, tentukan ${what}.` }),
    ({ what, who }) => ({ q: `Setiap ● dalam plot titik di bawah mewakili satu ${who}. Apakah ${what} bagi data itu?` })
  ],
  jMod: [
    ({ x }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${x.toLowerCase()} bagi sekumpulan murid. Nyatakan mod.` }),
    () => ({ q: 'Berdasarkan jadual kekerapan di bawah, apakah mod data itu?' }),
    ({ mf, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata mod bagi data dalam jadual di bawah ialah ${mf}. Adakah ${N} betul?` }, salah(N, ans, `${mf} ialah kekerapan tertinggi. Mod ialah nilai data yang mempunyai kekerapan itu.`)); },
    () => ({ q: 'Tentukan mod bagi data yang diwakili oleh jadual kekerapan di bawah.' })
  ],
  jMin: [
    () => ({ q: 'Hitung min bagi data dalam jadual kekerapan di bawah.' }),
    ({ x }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${x.toLowerCase()} bagi sekumpulan murid. Cari min.` }),
    () => ({ q: 'Berdasarkan jadual kekerapan di bawah, lengkapkan: Min = Σfx ÷ Σf = ___ ÷ ___ = ___' })
  ],
  jMed: [
    () => ({ q: 'Cari median bagi data dalam jadual kekerapan di bawah.' }),
    ({ x }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${x.toLowerCase()} bagi sekumpulan murid. Tentukan median.` }),
    () => ({ q: 'Berdasarkan jadual kekerapan di bawah, apakah median data itu?' })
  ],
  cariNilai: [
    ({ Lx, m }) => ({ q: `Min bagi set data ${Lx} ialah ${m}. Cari nilai x.` }),
    ({ Lx, m, n }) => ({ q: `${n} nombor ${Lx} mempunyai min ${m}. Hitung nilai x.` }),
    ({ Lk, m, n, u }) => ({ q: `Min jisim ${n} bungkus beras ialah ${m} kg. Jisim ${n - 1} bungkus ialah ${Lk} kg. Berapakah jisim bungkus yang terakhir?`, ans: undefined, unit: u }),
    ({ Lx, m }) => ({ q: `Diberi min bagi ${Lx} ialah ${m}. Tentukan nilai x.` })
  ],
  k1211: [
    d => ({ q: d.q0, ans: d.a0, work: d.w0 }),
    d => ({ q: d.q1, ans: d.a1, work: d.w1 }),
    d => ({ q: d.q2, ans: d.a2, work: d.w2 })
  ],

  /* ---------- 12.1.2 Kesan Perubahan Data ---------- */
  tambahK: [
    ({ mo, me, mn, opTxt }) => ({ q: `Mod, median dan min bagi suatu set data masing-masing ialah ${mo}, ${me} dan ${mn}. Jika setiap nilai ${opTxt}, cari mod, median dan min yang baharu.` }),
    ({ mo, me, mn, opTxt }) => ({ q: `Suatu set data mempunyai mod ${mo}, median ${me} dan min ${mn}. Setiap nilai data itu ${opTxt}. Nyatakan mod, median dan min yang baharu.` }),
    ({ mo, me, mn, k, add }) => ({ q: add ? `Mod, median dan min markah suatu kuiz ialah ${mo}, ${me} dan ${mn}. Guru memberi bonus ${k} markah kepada setiap murid. Cari mod, median dan min markah yang baharu.` : `Mod, median dan min harga beberapa jenis buku ialah RM${mo}, RM${me} dan RM${mn}. Semasa jualan murah, harga setiap buku dikurangkan RM${k}. Cari mod, median dan min harga yang baharu.`, ans: undefined }),
    ({ mo, me, mn, opTxt, ans }) => { const N = vnama(); return Object.assign({ q: `Suatu set data mempunyai mod ${mo}, median ${me} dan min ${mn}. Setiap nilai ${opTxt}. ${N} berkata mod, median dan min tidak berubah. Adakah ${N} betul?` }, salah(N, ans, 'Apabila setiap nilai ditambah atau ditolak nombor yang sama, mod, median dan min juga berubah dengan nombor itu.')); }
  ],
  darabK: [
    ({ mo, me, mn, opTxt }) => ({ q: `Mod, median dan min bagi suatu set data masing-masing ialah ${mo}, ${me} dan ${mn}. Jika setiap nilai ${opTxt}, cari mod, median dan min yang baharu.` }),
    ({ mo, me, mn, opTxt }) => ({ q: `Setiap nilai dalam suatu set data ${opTxt}. Sebelum itu, mod = ${mo}, median = ${me} dan min = ${mn}. Tentukan mod, median dan min yang baharu.` }),
    ({ L, opTxt, k, mul }) => ({ q: `Data asal: ${L}. Setiap nilai ${opTxt}. Tanpa menyenaraikan data baharu, cari min dan median yang baharu.` }),
    ({ mo, me, mn, k, mul }) => ({ q: mul ? `Mod, median dan min markah suatu kuiz ialah ${mo}, ${me} dan ${mn}. Guru mendarab setiap markah dengan ${k} untuk menukarnya kepada markah peperiksaan. Cari mod, median dan min markah yang baharu.` : `Mod, median dan min jisim beberapa karung baja ialah ${mo} kg, ${me} kg dan ${mn} kg. Setiap karung dibahagi sama rata kepada ${k} beg kecil. Cari mod, median dan min jisim sebuah beg kecil.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  tambahData: [
    ({ n, m, x }) => ({ q: `Min bagi ${n} nombor ialah ${m}. Nombor ${x} ditambah ke dalam set itu. Cari min yang baharu.` }),
    ({ n, m, x }) => ({ q: `Min markah ${n} orang murid ialah ${m}. Seorang murid baharu dengan markah ${x} menyertai kumpulan itu. Hitung min markah yang baharu.` }),
    ({ n, m, x }) => ({ q: `Min jisim ${n} buah kotak buku ialah ${m} kg. Sebuah kotak lagi berjisim ${x} kg ditambah. Berapakah min jisim yang baharu?` })
  ],
  buangData: [
    ({ n, m, m2 }) => ({ q: `Min bagi ${n} nombor ialah ${m}. Apabila satu nombor dikeluarkan, min bagi nombor yang tinggal ialah ${m2}. Cari nombor yang dikeluarkan.` }),
    ({ n, m, m2 }) => ({ q: `Min umur ${n} orang ahli sebuah kelab ialah ${m} tahun. Seorang ahli berhenti dan min umur ahli yang tinggal menjadi ${m2} tahun. Berapakah umur ahli yang berhenti?` }),
    ({ n, m, m2 }) => ({ q: `Min skor ${n} orang pemain ialah ${m}. Selepas skor seorang pemain dibatalkan, min skor menjadi ${m2}. Berapakah skor yang dibatalkan?` })
  ],
  ekstrem: [
    ({ L, X }) => ({ q: `Data: ${L}. Nilai ${X} ditambah ke dalam set data itu. Hitung min dan median sebelum dan selepas ${X} ditambah. Sukatan manakah lebih terjejas?` }),
    ({ L, X }) => ({ q: `Masa, dalam minit, beberapa orang murid berjalan ke sekolah ialah ${L}. Seorang murid lagi mengambil masa ${X} minit. Bandingkan min dan median sebelum dan selepas data ${X} ditambah.` }),
    ({ L, X }) => ({ q: `Set data ${L} ditambah satu nilai ekstrem, ${X}. Cari min dan median yang baharu, dan nyatakan sukatan yang lebih terjejas.` })
  ],
  k1212: [
    d => ({ q: d.q0, ans: d.a0, work: d.w0 }),
    d => ({ q: d.q1, ans: d.a1, work: d.w1 }),
    d => ({ q: d.q2, ans: d.a2, work: d.w2 })
  ],

  /* ---------- 12.1.3 Data Terkumpul ---------- */
  titikTengah: [
    ({ a, b }) => ({ q: `Cari titik tengah bagi selang kelas ${kcKel(a, b)}.` }),
    ({ a, b, nm }) => ({ q: `Dalam suatu jadual kekerapan ${nm}, salah satu kelas ialah ${kcKel(a, b)}. Hitung titik tengah kelas itu.` }),
    ({ a, b, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata titik tengah bagi kelas ${kcKel(a, b)} ialah ${kcN(b - a)}. Adakah ${N} betul?` }, salah(N, ans, `${N} menolak had bawah daripada had atas. Titik tengah = (had bawah + had atas) ÷ 2.`)); },
    ({ a, b }) => ({ q: `Lengkapkan: Titik tengah kelas ${kcKel(a, b)} = (${a} + ${b}) ÷ 2 = ___` }),
    ({ a, b, w }) => ({ q: `Kelas-kelas dalam suatu jadual ialah ${kcKel(a, b)}, ${kcKel(a + w, b + w)}, ${kcKel(a + 2 * w, b + 2 * w)}. Nyatakan saiz selang kelas dan titik tengah kelas ${kcKel(a, b)}.`, ans: `Saiz selang kelas = ${w}, titik tengah = ${kcN((a + b) / 2)}`, work: [`Saiz selang kelas = ${a + w} − ${a} = ${w}`, `Titik tengah = (${a} + ${b}) ÷ 2 = ${kcN((a + b) / 2)}`] })
  ],
  kelasMod: [
    ({ nm, who }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${nm} sekumpulan ${who}. Nyatakan kelas mod.` }),
    () => ({ q: 'Berdasarkan jadual kekerapan di bawah, tentukan kelas mod.' }),
    ({ mf, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata kelas mod bagi data dalam jadual di bawah ialah ${mf}. Adakah ${N} betul?` }, salah(N, ans, `${mf} ialah kekerapan tertinggi. Kelas mod ialah selang kelas yang mempunyai kekerapan itu.`)); },
    () => ({ q: 'Apakah kelas mod bagi data terkumpul di bawah?' })
  ],
  kelasModH: [
    ({ nm, who }) => ({ q: `Histogram di bawah menunjukkan ${nm} sekumpulan ${who}. Nyatakan kelas mod.` }),
    () => ({ q: 'Berdasarkan histogram di bawah, tentukan kelas mod.' }),
    ({ who }) => ({ q: `Histogram di bawah mewakili data bagi beberapa ${who}. Kelas manakah ialah kelas mod?` })
  ],
  minTerkumpul: [
    ({ nm, who }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${nm} sekumpulan ${who}. Hitung min ${nm}.` }),
    () => ({ q: 'Hitung min anggaran bagi data terkumpul dalam jadual di bawah.' }),
    () => ({ q: 'Dengan menggunakan titik tengah setiap kelas, cari min bagi data dalam jadual di bawah.' }),
    ({ nm }) => ({ q: `Cari min ${nm} berdasarkan jadual kekerapan di bawah.` })
  ],
  kiraF: [
    ({ L, nm, who, cls }) => ({ q: `Data berikut menunjukkan ${nm} ${who}.<br>${L}<br>Dengan menggunakan kelas ${kcDan(cls.map(c => kcKel(c[0], c[1])))}, bina jadual kekerapan. Nyatakan kekerapan setiap kelas.` }),
    ({ L, cls }) => ({ q: `Kumpulkan data berikut ke dalam kelas ${kcDan(cls.map(c => kcKel(c[0], c[1])))}, kemudian nyatakan kekerapan setiap kelas dan kelas mod.<br>${L}` }),
    ({ L, cls }) => ({ q: `Buat gundalan bagi data berikut menggunakan kelas ${kcDan(cls.map(c => kcKel(c[0], c[1])))}. Berapakah kekerapan setiap kelas?<br>${L}` })
  ],
  k1213: [
    d => ({ q: d.q0, ans: d.a0, work: d.w0 }),
    d => ({ q: d.q1, ans: d.a1, work: d.w1 }),
    d => ({ q: d.q2, ans: d.a2, work: d.w2 })
  ],

  /* ---------- 12.1.4 Memilih Sukatan ---------- */
  pilih: [
    ({ sc }) => ({ q: `${sc} Sukatan kecenderungan memusat manakah yang paling sesuai digunakan? Wajarkan jawapan anda.` }),
    ({ sc }) => ({ q: `${sc} Pilih sukatan yang paling sesuai (mod, median atau min) dan beri sebab.` }),
    ({ sc, wrongM, ans }) => { const N = vnama(); return Object.assign({ q: `${sc} ${N} berkata ${wrongM.toLowerCase()} ialah sukatan yang paling sesuai. Adakah ${N} betul?` }, salah(N, ans, `${wrongM} kurang sesuai bagi situasi ini.`)); }
  ],
  batangDaun: [
    ({ what }) => ({ q: `Plot batang-dan-daun di bawah menunjukkan markah ujian sekumpulan murid. Cari ${what}.` }),
    ({ what }) => ({ q: `Berdasarkan plot batang-dan-daun di bawah, tentukan ${what} data itu.` }),
    ({ what, n }) => ({ q: `Plot batang-dan-daun di bawah mewakili ${n} data. Apakah ${what}?` })
  ],
  ekstremPilih: [
    ({ L, u }) => ({ q: `Data berikut menunjukkan gaji harian${u} beberapa orang pekerja: ${L}. Hitung min dan median. Sukatan manakah lebih sesuai untuk mewakili data itu? Wajarkan.` }),
    ({ L }) => ({ q: `Bagi set data ${L}, cari min dan median. Seterusnya, pilih sukatan yang lebih sesuai untuk mewakili data itu dan beri sebab.` }),
    ({ L }) => ({ q: `Harga, dalam RM ribu, beberapa buah rumah di sebuah taman ialah ${L}. Sukatan manakah, min atau median, lebih sesuai untuk mewakili harga rumah itu? Tunjukkan pengiraan.` })
  ],
  sasaran: [
    ({ n, m, T }) => ({ q: `Min markah ${n} ujian seorang murid ialah ${m}. Berapakah markah yang perlu diperolehnya dalam ujian ke-${n + 1} supaya min ${n + 1} ujian menjadi ${T}?` }),
    ({ n, m, T }) => ({ q: `Sebuah pasukan bola keranjang menjaringkan min ${m} mata dalam ${n} perlawanan. Berapakah mata yang perlu dijaringkan dalam perlawanan seterusnya supaya min menjadi ${T} mata?` }),
    ({ n, m, T }) => ({ q: `Min jualan sebuah gerai bagi ${n} hari ialah RM${m}. Berapakah jualan pada hari ke-${n + 1} supaya min jualan ${n + 1} hari itu menjadi RM${T}?`, rm: true })
  ],
  gabungan: [
    ({ na, ma, nb, mb }) => ({ q: `Min markah ${na} orang murid Kelas A ialah ${ma} dan min markah ${nb} orang murid Kelas B ialah ${mb}. Cari min markah bagi semua murid dalam kedua-dua kelas.` }),
    ({ na, ma, nb, mb }) => ({ q: `Sekumpulan ${na} orang lelaki mempunyai min jisim ${ma} kg dan sekumpulan ${nb} orang perempuan mempunyai min jisim ${mb} kg. Hitung min jisim semua orang itu.` }),
    ({ na, ma, nb, mb, ans }) => { const N = vnama(); return Object.assign({ q: `Min markah ${na} orang murid ialah ${ma} dan min markah ${nb} orang murid lain ialah ${mb}. ${N} berkata min markah semua murid ialah ${kcN((ma + mb) / 2)}. Adakah ${N} betul?` }, salah(N, ans, 'Bilangan murid dalam dua kumpulan tidak sama, jadi min gabungan bukan purata dua min.')); }
  ],
  k1214: [
    d => ({ q: d.q0, ans: d.a0, work: d.w0 }),
    d => ({ q: d.q1, ans: d.a1, work: d.w1 }),
    d => ({ q: d.q2, ans: d.a2, work: d.w2 })
  ]
};

/* =================== penjana soalan =================== */
const KC = {};
/* ---------- 12.1.1 ---------- */
KC.modS = r => {
  const c = r.p(KCCTX), n = r.i(7, 10);
  let D; do { D = kcModeData(r, n, c.lo, c.hi); } while (D.mo === 3);
  return GEN_LQ('modS', { L: kcL(D.d), ctx: c.t(n), mc: 3, ans: kcN(D.mo) + c.u, work: kcModWork(D.d) });
};
KC.medS = (r, k) => {
  const c = r.p(KCCTX), n = k == null ? r.i(5, 10) : (k % 2 ? r.p([6, 8, 10]) : r.p([5, 7, 9]));
  let d, wrong;
  do {
    d = []; for (let i = 0; i < n; i++) d.push(r.i(c.lo, c.hi));
    wrong = (d[(n - 1) >> 1] + d[n >> 1]) / 2;
  } while (wrong === kcMed(d) || new Set(d).size < 4);
  return GEN_LQ('medS', { L: kcL(d), ctx: c.t(n), wrong: kcN(wrong), ans: kcN(kcMed(d)) + c.u, work: kcMedWork(d) });
};
KC.minS = r => {
  const c = r.p(KCCTX), n = r.i(4, 8), d = kcMeanData(r, n, c.lo, c.hi);
  return GEN_LQ('minS', { L: kcL(d), n, ctx: c.t(n), wrong: kcN(kcSum(d) / (n - 1)), ans: kcN(kcMean(d)) + c.u, work: kcMeanWork(d) });
};
KC.plotS = (r, k) => {
  const c = r.p(KCJCTX), lo = Math.max(c.lo, 1), hi = lo + r.i(7, 8), n = r.i(9, 12);
  let d; do { d = kcModeData(r, n, lo, hi).d; } while (!kcClean(kcMean(d)) || kcCount(d).get(kcMod(d)[0]) > 5);
  const what = ['mod', 'median', 'min'][k == null ? r.i(0, 2) : k % 3];
  const work = ['Kira bilangan titik: n = ' + n].concat(what === 'mod' ? kcModWork(d).slice(1) : what === 'median' ? kcMedWork(d).slice(2) : kcMeanWork(d));
  const ans = what === 'mod' ? kcModTxt(kcMod(d)) : what === 'median' ? kcN(kcMed(d)) : kcN(kcMean(d));
  return GEN_LQ('plotS', { what, who: c.who, ans, work }, { fig: kcDotFig(d, lo, hi, c.x, `Plot titik ${c.x.toLowerCase()}`) });
};
KC.jMod = r => {
  const c = r.p(KCJCTX); let F;
  do { F = kcFreqData(r, c.lo); } while (F.xs.includes(Math.max(...F.fs)));
  const mo = kcMod(F.data), mf = Math.max(...F.fs);
  return GEN_LQ('jMod', { x: c.x, mf, ans: kcModTxt(mo), work: [`Kekerapan tertinggi ialah ${mf}.`, `Nilai yang mempunyai kekerapan ${mf} ialah ${kcModTxt(mo)}, maka mod = ${kcModTxt(mo)}.`] }, { fig: kcTabFig(c.x, F.xs, F.fs) });
};
KC.jMin = r => {
  const c = r.p(KCJCTX), F = kcFreqData(r, c.lo), sf = kcSum(F.fs), sfx = kcSum(F.xs.map((x, i) => x * F.fs[i]));
  return GEN_LQ('jMin', { x: c.x, ans: kcN(sfx / sf), work: [`Σf = ${kcPlus(F.fs)} = ${sf}`, `Σfx = ${F.xs.map((x, i) => `${x}(${F.fs[i]})`).join(' + ')} = ${sfx}`, `Min = ${sfx} ÷ ${sf} = ${kcN(sfx / sf)}`] }, { fig: kcTabFig(c.x, F.xs, F.fs) });
};
KC.jMed = r => {
  const c = r.p(KCJCTX), F = kcFreqData(r, c.lo), n = F.data.length, cum = []; let t = 0;
  F.fs.forEach(f => { t += f; cum.push(t); });
  const s = kcSort(F.data), med = kcMed(s);
  const pos = n % 2 ? `nilai ke-${(n + 1) / 2}` : `purata nilai ke-${n / 2} dan ke-${n / 2 + 1}`;
  const work = [`Σf = ${n}, maka median ialah ${pos}.`, `Kekerapan longgokan: ${cum.join(', ')}`];
  if (n % 2) work.push(`Nilai ke-${(n + 1) / 2} ialah ${kcN(s[(n - 1) / 2])}`);
  else work.push(`Nilai ke-${n / 2} = ${kcN(s[n / 2 - 1])}, nilai ke-${n / 2 + 1} = ${kcN(s[n / 2])}`, `Median = ${kcN(med)}`);
  return GEN_LQ('jMed', { x: c.x, ans: kcN(med), work }, { fig: kcTabFig(c.x, F.xs, F.fs) });
};
KC.cariNilai = r => {
  let n, d, m, x, j;
  do { n = r.i(4, 7); m = r.i(5, 15); d = []; for (let i = 0; i < n - 1; i++) d.push(r.i(m - 5, m + 6)); x = m * n - kcSum(d); } while (x < 1 || x > m + 10 || d.includes(x));
  j = r.i(0, n - 1); const full = d.slice(); full.splice(j, 0, 'x');
  const Lx = full.map(v => (v === 'x' ? 'x' : kcN(v))).join(', ');
  const v = vq('cariNilai', { Lx, Lk: kcL(d), m, n });
  const isKg = /beras/.test(v.q);
  return { q: v.q, ans: isKg ? `${x} kg` : `x = ${x}`, work: [`Hasil tambah = min × bilangan data = ${m} × ${n} = ${m * n}`, `${kcPlus(d)} + ${isKg ? 'jisim terakhir' : 'x'} = ${m * n}`, `${kcSum(d)} + ${isKg ? 'jisim terakhir' : 'x'} = ${m * n}`, `${isKg ? 'Jisim terakhir' : 'x'} = ${m * n} − ${kcSum(d)} = ${x}${isKg ? ' kg' : ''}`] };
};
KC.k1211 = (r, k) => {
  // (0) kekerapan tidak diketahui daripada min
  let xs, fs, p, j, m, sf, sfx;
  do { xs = [1, 2, 3, 4, 5]; fs = xs.map(() => r.i(1, 8)); j = r.i(0, 4); p = r.i(2, 9); fs[j] = p; sf = kcSum(fs); sfx = kcSum(xs.map((x, i) => x * fs[i])); m = sfx / sf; }
  while (!kcClean(m) || Math.abs(xs[j] - m) < 1e-9 || Number.isInteger(m) === false && r.f() < .5);
  const S0 = sfx - p * xs[j], N0 = sf - p;
  const d = {
    f0: kcTabFig('Bilangan buku', xs, fs.map((f, i) => (i === j ? 'p' : f)), 'Kekerapan', 'Jadual kekerapan dengan kekerapan p'),
    q0: `Jadual kekerapan di bawah menunjukkan bilangan buku yang dibaca oleh sekumpulan murid. Diberi min bilangan buku ialah ${kcN(m)}, cari nilai p.`,
    a0: `p = ${p}`,
    w0: [`Σf = ${N0} + p`, `Σfx = ${S0} + ${xs[j]}p`, `(${S0} + ${xs[j]}p) ÷ (${N0} + p) = ${kcN(m)}`, `${S0} + ${xs[j]}p = ${kcN(m * N0)} + ${kcN(m)}p`, `${kcN(xs[j] - m)}p = ${kcN(m * N0 - S0)}`, `p = ${p}`]
  };
  // (1) set data algebra x, x+a, ...
  let off, x0, M;
  do { off = [0, r.i(1, 3), r.i(4, 6), r.i(7, 9), r.i(10, 14)]; x0 = r.i(3, 15); M = kcSum(off.map(o => x0 + o)) / 5; } while (!Number.isInteger(M));
  const terms = off.map(o => (o ? `x + ${o}` : 'x'));
  d.q1 = `Min bagi set data ${terms.join(', ')} ialah ${M}. Cari nilai x, kemudian tentukan median set data itu.`;
  d.a1 = `x = ${x0}, median = ${x0 + off[2]}`;
  d.w1 = [`Hasil tambah = 5x + ${kcSum(off)}`, `(5x + ${kcSum(off)}) ÷ 5 = ${M}`, `5x + ${kcSum(off)} = ${5 * M}`, `5x = ${5 * M - kcSum(off)}, x = ${x0}`, `Data: ${kcL(off.map(o => x0 + o))}`, `Median = nilai ke-3 = ${x0 + off[2]}`];
  // (2) plot titik: tambah satu murid supaya min menjadi nombor bulat
  let dd, add;
  do { dd = kcModeData(r, r.i(7, 9), 2, 9).d; add = (Math.floor(kcMean(dd)) + 1) * (dd.length + 1) - kcSum(dd); } while (Number.isInteger(kcMean(dd)) || add < 1 || add > 10);
  const M2 = (kcSum(dd) + add) / (dd.length + 1);
  d.q2 = `Plot titik di bawah menunjukkan markah kuiz ${dd.length} orang murid. Seorang murid lagi mengambil kuiz itu dan min markah semua murid menjadi ${M2}. (a) Cari mod dan median bagi ${dd.length} orang murid itu. (b) Berapakah markah murid yang baharu?`;
  d.f2 = kcDotFig(dd, 1, 10, 'Markah kuiz');
  d.a2 = `(a) Mod = ${kcModTxt(kcMod(dd))}, median = ${kcN(kcMed(dd))} (b) ${add}`;
  d.w2 = [`(a) ${kcModWork(dd)[1]}`].concat(kcMedWork(dd).slice(1).map(w => '(a) ' + w), [`(b) Hasil tambah asal = ${kcSum(dd)}`, `Hasil tambah baharu = ${M2} × ${dd.length + 1} = ${M2 * (dd.length + 1)}`, `Markah murid baharu = ${M2 * (dd.length + 1)} − ${kcSum(dd)} = ${add}`]);
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k1211[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: d['f' + kk] || '' };
};

/* ---------- 12.1.2 ---------- */
// statistik permulaan yang kemas
function kcStats(r, half) {
  const mo = r.i(4, 20), me = mo + r.i(-2, 4) + (half && r.f() < .5 ? .5 : 0), mn = me + r.p([-1.5, -1, -.5, .5, 1, 1.5, 2, 2.5]);
  return { mo, me, mn };
}
KC.tambahK = (r, i) => {
  const add = i == null ? r.f() < .55 : i % 2 === 0, k = r.i(2, 9);
  let s; do { s = kcStats(r, true); } while (!add && Math.min(s.mo, s.me, s.mn) - k < 1);
  const sg = add ? 1 : -1, opTxt = add ? `ditambah ${k}` : `ditolak ${k}`;
  const nm = [s.mo + sg * k, s.me + sg * k, s.mn + sg * k].map(kcN);
  const v = vq('tambahK', { mo: kcN(s.mo), me: kcN(s.me), mn: kcN(s.mn), k, add, opTxt, ans: `Mod = ${nm[0]}, median = ${nm[1]}, min = ${nm[2]}` });
  const rm = /RM/.test(v.q);
  return { q: v.q, ans: rm ? `Mod = RM${nm[0]}, median = RM${nm[1]}, min = RM${nm[2]}` : (v.ans || `Mod = ${nm[0]}, median = ${nm[1]}, min = ${nm[2]}`), work: (/tidak berubah/.test(v.q) ? ['Apabila setiap nilai ditambah atau ditolak nombor yang sama, mod, median dan min juga berubah dengan nombor itu.'] : []).concat([`Setiap nilai ${opTxt}, maka setiap sukatan ${opTxt}.`, `Mod = ${kcN(s.mo)} ${add ? '+' : '−'} ${k} = ${nm[0]}`, `Median = ${kcN(s.me)} ${add ? '+' : '−'} ${k} = ${nm[1]}`, `Min = ${kcN(s.mn)} ${add ? '+' : '−'} ${k} = ${nm[2]}`]) };
};
KC.darabK = (r, i) => {
  const mul = i == null ? r.f() < .55 : i % 2 === 0, k = mul ? r.i(2, 5) : r.p([2, 4, 5, 10]);
  let s; do { s = kcStats(r, mul); } while (!mul && ![s.mo, s.me, s.mn].every(v => kcClean(v / k)));
  const f = v => (mul ? v * k : v / k), sym = mul ? '×' : '÷', opTxt = mul ? `didarab ${k}` : `dibahagi ${k}`;
  // data asal untuk varian senarai
  let d; do { d = kcMeanData(r, 5, 2, 12); } while (!kcClean(kcMean(d) / k) || !kcClean(kcMed(d) / k));
  const v = vq('darabK', { mo: kcN(s.mo), me: kcN(s.me), mn: kcN(s.mn), k, mul, opTxt, L: kcL(d) });
  if (/Data asal/.test(v.q)) {
    return { q: v.q, ans: `Min = ${kcN(f(kcMean(d)))}, median = ${kcN(f(kcMed(d)))}`, work: [`Min asal = ${kcN(kcSum(d))} ÷ 5 = ${kcN(kcMean(d))}`, `Median asal = ${kcN(kcMed(d))} (susun: ${kcL(kcSort(d))})`, `Min baharu = ${kcN(kcMean(d))} ${sym} ${k} = ${kcN(f(kcMean(d)))}`, `Median baharu = ${kcN(kcMed(d))} ${sym} ${k} = ${kcN(f(kcMed(d)))}`] };
  }
  const u = /baja/.test(v.q) ? ' kg' : '';
  const nm = [s.mo, s.me, s.mn].map(v2 => kcN(f(v2)) + u);
  return { q: v.q, ans: `Mod = ${nm[0]}, median = ${nm[1]}, min = ${nm[2]}`, work: [`Setiap nilai ${opTxt}, maka mod, median dan min juga ${opTxt}.`, `Mod = ${kcN(s.mo)} ${sym} ${k} = ${nm[0]}`, `Median = ${kcN(s.me)} ${sym} ${k} = ${nm[1]}`, `Min = ${kcN(s.mn)} ${sym} ${k} = ${nm[2]}`] };
};
KC.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
KC.tambahData = r => {
  let n, m, M, x; do { n = r.i(4, 9); m = r.i(5, 20); M = m + r.p([-2, -1, 1, 2, 3]); x = M * (n + 1) - n * m; } while (x < 1);
  return GEN_LQ('tambahData', { n, m, x, ans: kcN(M), work: [`Hasil tambah asal = ${n} × ${m} = ${n * m}`, `Hasil tambah baharu = ${n * m} + ${x} = ${n * m + x}`, `Min baharu = ${n * m + x} ÷ ${n + 1} = ${kcN(M)}`] });
};
KC.buangData = r => {
  let n, m, m2, x; do { n = r.i(5, 10); m = r.i(8, 40); m2 = m + r.p([-3, -2, -1, 1, 2]); x = n * m - (n - 1) * m2; } while (x < 1);
  return GEN_LQ('buangData', { n, m, m2, ans: kcN(x), work: [`Hasil tambah asal = ${n} × ${m} = ${n * m}`, `Hasil tambah selepas dikeluarkan = ${n - 1} × ${m2} = ${(n - 1) * m2}`, `Nilai yang dikeluarkan = ${n * m} − ${(n - 1) * m2} = ${x}`] });
};
KC.ekstrem = r => {
  let d, X;
  do {
    const n = r.i(4, 5); d = kcMeanData(r, n, 5, 15);
    X = r.i(5, 8) * Math.max(...d); let t = 0; while (!kcClean((kcSum(d) + X) / (d.length + 1)) && t < 10) { X++; t++; }
  } while (!kcClean((kcSum(d) + X) / (d.length + 1)) || !kcClean(kcMean(d)));
  const e = d.concat([X]), m0 = kcMean(d), m1 = kcMean(e), d0 = kcMed(d), d1 = kcMed(e);
  return GEN_LQ('ekstrem', { L: kcL(d), X, ans: `Min: ${kcN(m0)} → ${kcN(m1)}; median: ${kcN(d0)} → ${kcN(d1)}. Min lebih terjejas.`, work: [`Sebelum: min = ${kcN(kcSum(d))} ÷ ${d.length} = ${kcN(m0)}, median = ${kcN(d0)}`, `Selepas: min = ${kcN(kcSum(e))} ÷ ${e.length} = ${kcN(m1)}`, `Susun: ${kcL(kcSort(e))}, median = ${kcN(d1)}`, `Min berubah sebanyak ${kcN(m1 - m0)}, median hanya berubah ${kcN(d1 - d0)}.`] });
};
KC.k1212 = (r, k) => {
  const d = {};
  // (0) data tersalah catat
  let n, m, a, b, M; do { n = r.i(6, 10); m = r.i(12, 30); a = r.i(10, 40); b = a + r.p([-9, -6, 6, 9, 10, 12, 15]); M = (n * m - b + a) / n; } while (!kcClean(M) || b < 1);
  d.q0 = `Min markah ${n} orang murid dikira sebagai ${m}. Kemudian, didapati satu markah ${a} telah tersalah catat sebagai ${b}. Cari min markah yang betul.`;
  d.a0 = kcN(M);
  d.w0 = [`Hasil tambah yang dikira = ${n} × ${m} = ${n * m}`, `Hasil tambah betul = ${n * m} − ${b} + ${a} = ${n * m - b + a}`, `Min betul = ${n * m - b + a} ÷ ${n} = ${kcN(M)}`];
  // (1) dua data ditambah
  let n1, m1, M1, p, q; do { n1 = r.i(5, 10); m1 = r.i(10, 25); M1 = m1 + r.p([-1, 1, 2]); p = r.i(5, 30); q = M1 * (n1 + 2) - n1 * m1 - p; } while (q < 1 || q === p);
  d.q1 = `Min bagi ${n1} nombor ialah ${m1}. Apabila dua nombor, ${p} dan y, ditambah, min bagi ${n1 + 2} nombor itu menjadi ${M1}. Cari nilai y.`;
  d.a1 = `y = ${q}`;
  d.w1 = [`Hasil tambah asal = ${n1} × ${m1} = ${n1 * m1}`, `Hasil tambah baharu = ${n1 + 2} × ${M1} = ${(n1 + 2) * M1}`, `${p} + y = ${(n1 + 2) * M1} − ${n1 * m1} = ${(n1 + 2) * M1 - n1 * m1}`, `y = ${q}`];
  // (2) darab kemudian tolak
  const s = { mo: r.i(4, 12), me: 0, mn: 0 }; s.me = s.mo + r.i(1, 3); s.mn = s.me + r.p([.5, 1, 1.5, 2]);
  const A = r.i(2, 4), Bv = r.i(1, 6), f = v => v * A - Bv;
  d.q2 = `Mod, median dan min bagi suatu set data masing-masing ialah ${kcN(s.mo)}, ${kcN(s.me)} dan ${kcN(s.mn)}. Setiap nilai dalam set data itu didarab ${A} dan kemudian ditolak ${Bv}. Cari mod, median dan min yang baharu.`;
  d.a2 = `Mod = ${kcN(f(s.mo))}, median = ${kcN(f(s.me))}, min = ${kcN(f(s.mn))}`;
  d.w2 = [`Setiap sukatan didarab ${A} dan kemudian ditolak ${Bv}.`, `Mod = ${kcN(s.mo)} × ${A} − ${Bv} = ${kcN(f(s.mo))}`, `Median = ${kcN(s.me)} × ${A} − ${Bv} = ${kcN(f(s.me))}`, `Min = ${kcN(s.mn)} × ${A} − ${Bv} = ${kcN(f(s.mn))}`];
  const v = QV.k1212[(k == null ? r.i(0, 2) : k) % 3](d);
  return { q: v.q, ans: v.ans, work: v.work };
};

/* ---------- 12.1.3 ---------- */
KC.titikTengah = r => {
  const w = r.p([5, 10]), a = w === 5 ? r.p([15, 20, 25, 30, 35, 40, 45, 50, 55, 60]) + r.p([0, 1]) : r.p([10, 20, 30, 40, 50, 60]) + r.p([0, 1]), b = a + w - 1;
  const c = r.p(KCGCTX);
  return GEN_LQ('titikTengah', { a, b, w, nm: c.nm, ans: kcN((a + b) / 2), work: ['Titik tengah = (had bawah + had atas) ÷ 2', `= (${a} + ${b}) ÷ 2`, `= ${kcN((a + b) / 2)}`] });
};
KC.kelasMod = r => {
  const c = r.p(KCGCTX), g = kcGroupData(r, c), mf = Math.max(...g.fs), j = g.fs.indexOf(mf), ans = kcKel(...g.cls[j]) + c.u;
  return GEN_LQ('kelasMod', { nm: c.nm, who: c.who, mf, ans, work: [`Kekerapan tertinggi ialah ${mf}.`, `Kelas dengan kekerapan ${mf} ialah ${kcKel(...g.cls[j])}.`] }, { fig: kcClassFig(c.x, g.cls, g.fs) });
};
KC.kelasModH = r => {
  const c = r.p(KCGCTX), g = kcGroupData(r, c), mf = Math.max(...g.fs), j = g.fs.indexOf(mf), ans = kcKel(...g.cls[j]) + c.u;
  return GEN_LQ('kelasModH', { nm: c.nm, who: c.who, ans, work: [`Palang paling tinggi mewakili kekerapan ${mf}.`, `Kelas mod = ${kcKel(...g.cls[j])}`] }, { fig: kcBarFig(g.cls.map(([a, b]) => `${a}–${b}`), g.fs, { hist: true, c: 'pu', xl: c.x, yl: 'Kekerapan', label: `Histogram ${c.nm}` }), figAns: kcBarFig(g.cls.map(([a, b]) => `${a}–${b}`), g.fs, { hist: true, c: 'pu', hl: j, xl: c.x, yl: 'Kekerapan', label: `Histogram ${c.nm}, kelas mod diserlahkan` }) });
};
KC.minTerkumpul = r => {
  const c = r.p(KCGCTX), g = kcGroupData(r, c);
  return GEN_LQ('minTerkumpul', { nm: c.nm, who: c.who, ans: kcN(g.mean) + c.u, work: kcFxWork(g) }, { fig: kcClassFig(c.x, g.cls, g.fs) });
};
KC.kiraF = r => {
  const c = r.p(KCGCTX), [w, a0s] = r.p(c.g), a0 = r.p(a0s), k = 4;
  const cls = []; for (let i = 0; i < k; i++) cls.push([a0 + i * w, a0 + i * w + w - 1]);
  let d, fs;
  do { const n = r.i(14, 18); d = []; for (let i = 0; i < n; i++) d.push(r.i(a0, a0 + k * w - 1)); fs = cls.map(([a, b]) => d.filter(v => v >= a && v <= b).length); } while (fs.some(f => f === 0) || fs.filter(f => f === Math.max(...fs)).length !== 1);
  const j = fs.indexOf(Math.max(...fs));
  const v = vq('kiraF', { L: kcL(d), nm: c.nm, who: `${d.length} ${c.who}`, cls });
  const ft = cls.map(([a, b], i) => `${kcKel(a, b)}: ${fs[i]}`).join('; ');
  return { q: v.q, ans: /kelas mod/.test(v.q) ? `${ft}. Kelas mod = ${kcKel(...cls[j])}` : ft, work: cls.map(([a, b], i) => `${kcKel(a, b)}: ${kcL(kcSort(d.filter(x => x >= a && x <= b)))} → ${fs[i]}`).concat([`Semak: ${kcPlus(fs)} = ${d.length} data`]) };
};
KC.k1213 = (r, k) => {
  const d = {};
  // (0) kekerapan p daripada min
  let g, j, p, m;
  do { g = kcGroupData(r, KCGCTX[1]); j = r.i(0, g.cls.length - 1); p = g.fs[j]; m = g.mean; } while (Math.abs(g.mids[j] - m) < 1e-9);
  const S0 = g.sfx - p * g.mids[j], N0 = g.sf - p;
  d.q0 = `Jadual kekerapan di bawah menunjukkan markah sekumpulan murid. Diberi min markah ialah ${kcN(m)}, cari nilai p.`;
  d.f0 = kcClassFig('Markah', g.cls, g.fs.map((f, i) => (i === j ? null : f)));
  d.a0 = `p = ${p}`;
  d.w0 = [`Titik tengah: ${kcDan(g.mids.map(kcN))}`, `Σf = ${N0} + p, Σfx = ${kcN(S0)} + ${kcN(g.mids[j])}p`, `${kcN(S0)} + ${kcN(g.mids[j])}p = ${kcN(m)}(${N0} + p) = ${kcN(m * N0)} + ${kcN(m)}p`, `${kcN(g.mids[j] - m)}p = ${kcN(m * N0 - S0)}`, `p = ${p}`];
  // (1) histogram: kelas mod, min, peratus
  const c = KCGCTX[2]; let h; do { h = kcGroupData(r, c); } while (!kcClean(100 * kcSum(h.fs.slice(-2)) / h.sf));
  const jj = h.fs.indexOf(Math.max(...h.fs)), lim = h.cls[h.cls.length - 2][0], pc = 100 * kcSum(h.fs.slice(-2)) / h.sf;
  d.q1 = `Histogram di bawah menunjukkan masa, dalam minit, yang diambil oleh sekumpulan murid untuk menyiapkan satu tugasan. (a) Nyatakan kelas mod. (b) Hitung min masa. (c) Berapakah peratus murid yang mengambil masa sekurang-kurangnya ${lim} minit?`;
  d.f1 = kcBarFig(h.cls.map(([a, b]) => `${a}–${b}`), h.fs, { hist: true, c: 'pu', xl: 'Masa (minit)', yl: 'Bilangan murid' });
  d.a1 = `(a) ${kcKel(...h.cls[jj])} minit (b) ${kcN(h.mean)} minit (c) ${kcN(pc)}%`;
  d.w1 = [`(a) Palang tertinggi: ${kcKel(...h.cls[jj])}`].concat(kcFxWork(h).map(w => '(b) ' + w), [`(c) Murid ≥ ${lim} minit = ${kcPlus(h.fs.slice(-2))} = ${kcSum(h.fs.slice(-2))}`, `Peratus = ${kcSum(h.fs.slice(-2))} ÷ ${h.sf} × 100% = ${kcN(pc)}%`]);
  // (2) bandingkan dua kumpulan
  let gA, gB; do { gA = kcGroupData(r, KCGCTX[0], 5); gB = kcGroupData(r, KCGCTX[0], 5); gB.cls = gA.cls; gB.mids = gA.mids; gB.sfx = kcSum(gB.fs.map((f, i) => f * gA.mids[i])); gB.mean = gB.sfx / gB.sf; }
  while (gA.cls.length !== gB.fs.length || !kcClean(gB.mean) || Math.abs(gA.mean - gB.mean) < .5);
  const hi = gA.mean > gB.mean ? 'A' : 'B';
  d.f2 = kcClass2Fig('Jisim (kg)', gA.cls, gA.fs, gB.fs, 'Kumpulan A', 'Kumpulan B');
  d.q2 = 'Jadual di bawah menunjukkan jisim, dalam kg, murid dalam Kumpulan A dan Kumpulan B. Hitung min jisim setiap kumpulan. Kumpulan manakah mempunyai min jisim yang lebih tinggi?';
  d.a2 = `Min A = ${kcN(gA.mean)} kg, min B = ${kcN(gB.mean)} kg. Kumpulan ${hi} lebih tinggi.`;
  d.w2 = kcFxWork(gA).map(w => 'A: ' + w).concat(kcFxWork(gB).map(w => 'B: ' + w), [`${kcN(Math.max(gA.mean, gB.mean))} > ${kcN(Math.min(gA.mean, gB.mean))}, maka Kumpulan ${hi}.`]);
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k1213[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: d['f' + kk] || '' };
};

/* ---------- 12.1.4 ---------- */
KC.pilih = (r, k) => {
  const [sc, ans, why] = k == null ? r.p(KCPILIH) : KCPILIH[k % KCPILIH.length];
  const wrongM = r.p(['Mod', 'Median', 'Min'].filter(m => m !== ans));
  return GEN_LQ('pilih', { sc, wrongM, ans: `${ans}, kerana ${why}`, work: [`Situasi: ${why}.`, `Maka ${ans.toLowerCase()} ialah sukatan yang paling sesuai.`] });
};
KC.batangDaun = (r, k) => {
  let d; do { const n = r.i(9, 12), base = r.i(3, 5) * 10; d = []; const mo = base + r.i(5, 25); d.push(mo, mo, mo); while (d.length < n) { const v = base + r.i(0, 39); if (d.filter(x => x === v).length < 1) d.push(v); } }
  while (kcMod(d).length !== 1 || !kcClean(kcMean(d)));
  const what = ['mod', 'median', 'min'][k == null ? r.i(0, 2) : k % 3];
  const ans = what === 'mod' ? kcModTxt(kcMod(d)) : what === 'median' ? kcN(kcMed(d)) : kcN(kcMean(d));
  const work = [`Baca data (sudah tersusun): ${kcL(kcSort(d))}`].concat(what === 'mod' ? kcModWork(d).slice(1) : what === 'median' ? kcMedWork(d).slice(1) : kcMeanWork(d));
  return GEN_LQ('batangDaun', { what, n: d.length, ans, work }, { fig: kcStemFig(d) });
};
KC.ekstremPilih = r => {
  let d, X;
  do { d = kcMeanData(r, r.i(4, 6), 60, 120); X = r.i(5, 9) * 100; } while (!kcClean((kcSum(d) + X) / (d.length + 1)));
  const e = kcShuf(r, d.concat([X])), mn = kcMean(e), md = kcMed(e);
  return GEN_LQ('ekstremPilih', { L: kcL(e), u: ', dalam RM,', ans: `Min = ${kcN(mn)}, median = ${kcN(md)}. Median lebih sesuai kerana ${X} ialah nilai ekstrem.`, work: [`Min = ${kcN(kcSum(e))} ÷ ${e.length} = ${kcN(mn)}`].concat(kcMedWork(e).slice(0, 1), kcMedWork(e).slice(2), [`${X} jauh lebih besar daripada nilai lain (nilai ekstrem), menyebabkan min lebih besar daripada kebanyakan data.`]) });
};
KC.sasaran = r => {
  let n, m, T, x; do { n = r.i(3, 6); m = r.i(55, 80); T = m + r.i(1, 5); x = (n + 1) * T - n * m; } while (x > 100);
  const v = vq('sasaran', { n, m, T });
  const rm = /RM/.test(v.q);
  return { q: v.q, ans: rm ? `RM${x}` : `${x}`, work: [`Jumlah ${n} sekarang = ${n} × ${m} = ${n * m}`, `Jumlah ${n + 1} yang diperlukan = ${n + 1} × ${T} = ${(n + 1) * T}`, `Yang diperlukan = ${(n + 1) * T} − ${n * m} = ${rm ? 'RM' : ''}${x}`] };
};
KC.gabungan = r => {
  let na, ma, nb, mb, M; do { na = r.i(10, 40); nb = r.i(10, 40); ma = r.i(40, 80); mb = ma + r.p([-8, -6, -5, -4, 4, 5, 6, 8, 10]); M = (na * ma + nb * mb) / (na + nb); } while (!kcClean(M) || na === nb);
  return GEN_LQ('gabungan', { na, ma, nb, mb, ans: kcN(M), work: [`Jumlah pertama = ${na} × ${ma} = ${na * ma}`, `Jumlah kedua = ${nb} × ${mb} = ${nb * mb}`, `Min gabungan = (${na * ma} + ${nb * mb}) ÷ ${na + nb} = ${kcN(M)}`] });
};
KC.k1214 = (r, k) => {
  const d = {};
  // (0) dua pemain
  let A, Bp; do { A = kcMeanData(r, 5, 12, 20); Bp = kcMeanData(r, 4, 8, 14).concat([r.i(35, 45)]); } while (!kcClean(kcMean(Bp)) || kcMean(Bp) <= kcMean(A) || kcMed(Bp) >= kcMed(A));
  Bp = kcShuf(r, Bp);
  d.q0 = `Mata yang dijaringkan oleh dua orang pemain bola keranjang dalam 5 perlawanan ditunjukkan di bawah.<br>Pemain P: ${kcL(A)}<br>Pemain Q: ${kcL(Bp)}<br>(a) Hitung min dan median bagi setiap pemain. (b) Jurulatih ingin memilih pemain yang lebih konsisten menjaringkan mata yang tinggi. Pemain manakah patut dipilih? Wajarkan.`;
  d.a0 = `(a) P: min ${kcN(kcMean(A))}, median ${kcN(kcMed(A))}; Q: min ${kcN(kcMean(Bp))}, median ${kcN(kcMed(Bp))} (b) Pemain P, kerana min Q dipengaruhi nilai ekstrem ${Math.max(...Bp)}; median P lebih tinggi.`;
  d.w0 = [`P: min = ${kcSum(A)} ÷ 5 = ${kcN(kcMean(A))}; susun ${kcL(kcSort(A))}, median = ${kcN(kcMed(A))}`, `Q: min = ${kcSum(Bp)} ÷ 5 = ${kcN(kcMean(Bp))}; susun ${kcL(kcSort(Bp))}, median = ${kcN(kcMed(Bp))}`, `Q mempunyai nilai ekstrem ${Math.max(...Bp)}, jadi median lebih sesuai untuk membandingkan.`, `Median P (${kcN(kcMed(A))}) > median Q (${kcN(kcMed(Bp))}), maka pilih P.`];
  // (1) boleh capai sasaran?
  let n, m, T, x; do { n = r.i(3, 5); m = r.i(55, 75); T = m + r.i(4, 12); x = (n + 1) * T - n * m; } while (Math.abs(x - 100) < 3);
  d.q1 = `Min markah ${n} ujian Daniel ialah ${m}. Dia berharap min ${n + 1} ujian menjadi ${T}. Markah maksimum setiap ujian ialah 100. Adakah harapan Daniel boleh dicapai? Tunjukkan pengiraan.`;
  d.a1 = x <= 100 ? `Boleh, Daniel perlu mendapat ${x} markah (≤ 100)` : `Tidak boleh, kerana Daniel perlu mendapat ${x} markah (> 100)`;
  d.w1 = [`Jumlah sekarang = ${n} × ${m} = ${n * m}`, `Jumlah diperlukan = ${n + 1} × ${T} = ${(n + 1) * T}`, `Markah ujian seterusnya = ${(n + 1) * T} − ${n * m} = ${x}`, x <= 100 ? `${x} ≤ 100, maka boleh dicapai.` : `${x} > 100, maka tidak boleh dicapai.`];
  // (2) cari bilangan kumpulan kedua
  let na, ma, mb, M, nb; do { na = r.i(10, 30); ma = r.i(50, 75); mb = ma + r.p([-10, -8, -6, 6, 8, 10, 12]); M = ma + (mb > ma ? 1 : -1) * r.i(2, 4); nb = na * (ma - M) / (M - mb); } while (!Number.isInteger(nb) || nb < 5 || nb > 60);
  d.q2 = `Min markah ${na} orang murid Kelas Bestari ialah ${ma}. Min markah murid Kelas Cemerlang ialah ${mb}. Apabila kedua-dua kelas digabungkan, min markah menjadi ${M}. Berapakah bilangan murid Kelas Cemerlang?`;
  d.a2 = `${nb} orang`;
  d.w2 = [`Katakan bilangan murid Kelas Cemerlang = n.`, `(${na} × ${ma} + ${mb}n) ÷ (${na} + n) = ${M}`, `${na * ma} + ${mb}n = ${na * M} + ${M}n`, `${kcN(mb - M)}n = ${kcN(na * M - na * ma)}`, `n = ${nb}`];
  const v = QV.k1214[(k == null ? r.i(0, 2) : k) % 3](d);
  return { q: v.q, ans: v.ans, work: v.work };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '12.1.1': {
    m: [() => KC.modS(kcRG), () => KC.medS(kcRG), () => KC.minS(kcRG), () => KC.plotS(kcRG), () => KC.jMod(kcRG)],
    s: [() => KC.jMin(kcRG), () => KC.jMed(kcRG), () => KC.cariNilai(kcRG)],
    k: [() => KC.k1211(kcRG)]
  },
  '12.1.2': {
    m: [() => KC.tambahK(kcRG), () => KC.darabK(kcRG), () => KC.bs(kcRG, KCBS2)],
    s: [() => KC.tambahData(kcRG), () => KC.buangData(kcRG), () => KC.ekstrem(kcRG)],
    k: [() => KC.k1212(kcRG)]
  },
  '12.1.3': {
    m: [() => KC.titikTengah(kcRG), () => KC.kelasMod(kcRG), () => KC.kelasModH(kcRG), () => KC.bs(kcRG, KCBS3)],
    s: [() => KC.minTerkumpul(kcRG), () => KC.minTerkumpul(kcRG), () => KC.kiraF(kcRG)],
    k: [() => KC.k1213(kcRG)]
  },
  '12.1.4': {
    m: [() => KC.pilih(kcRG), () => KC.batangDaun(kcRG), () => KC.bs(kcRG, KCBS4)],
    s: [() => KC.ekstremPilih(kcRG), () => KC.sasaran(kcRG), () => KC.gabungan(kcRG)],
    k: [() => KC.k1214(kcRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 12.1.1
WG.modS = () => KC.modS(kcRW);
WG.medS = i => KC.medS(kcRW, i);
WG.minS = () => KC.minS(kcRW);
WG.plotS = i => KC.plotS(kcRW, i);
WG.jMod = () => KC.jMod(kcRW);
WG.jMin = () => KC.jMin(kcRW);
WG.jMed = () => KC.jMed(kcRW);
WG.cariNilai = () => KC.cariNilai(kcRW);
WG.k1211 = i => KC.k1211(kcRW, i);
// 12.1.2
WG.tambahK = i => KC.tambahK(kcRW, i);
WG.darabK = i => KC.darabK(kcRW, i);
WG.bs2 = i => KC.bs(kcRW, KCBS2, i * 2 + (i > 1 ? 1 : 0));
WG.tambahData = () => KC.tambahData(kcRW);
WG.buangData = () => KC.buangData(kcRW);
WG.ekstrem = () => KC.ekstrem(kcRW);
WG.k1212 = i => KC.k1212(kcRW, i);
// 12.1.3
WG.titikTengah = () => KC.titikTengah(kcRW);
WG.kelasMod = () => KC.kelasMod(kcRW);
WG.kelasModH = () => KC.kelasModH(kcRW);
WG.bs3 = i => KC.bs(kcRW, KCBS3, [2, 4, 7][i % 3]);
WG.minTerkumpul = () => KC.minTerkumpul(kcRW);
WG.kiraF = () => KC.kiraF(kcRW);
WG.k1213 = i => KC.k1213(kcRW, i);
// 12.1.4
WG.pilih = i => KC.pilih(kcRW, [0, 2, 1, 3, 4, 5, 9, 10][i % 8]);
WG.bs4 = i => KC.bs(kcRW, KCBS4, [1, 2, 4, 5][i % 4]);
WG.batangDaun = i => KC.batangDaun(kcRW, i);
WG.ekstremPilih = () => KC.ekstremPilih(kcRW);
WG.sasaran = () => KC.sasaran(kcRW);
WG.gabungan = () => KC.gabungan(kcRW);
WG.k1214 = i => KC.k1214(kcRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '12.1.1': [['m', 'modS', 5], ['m', 'medS', 5], ['m', 'minS', 4], ['m', 'plotS', 2], ['m', 'jMod', 2], ['s', 'jMin', 3], ['s', 'jMed', 3], ['s', 'cariNilai', 3], ['k', 'k1211', 3]],
  '12.1.2': [['m', 'tambahK', 7], ['m', 'darabK', 7], ['m', 'bs2', 4], ['s', 'tambahData', 3], ['s', 'buangData', 3], ['s', 'ekstrem', 3], ['k', 'k1212', 3]],
  '12.1.3': [['m', 'titikTengah', 6], ['m', 'kelasMod', 5], ['m', 'kelasModH', 4], ['m', 'bs3', 3], ['s', 'minTerkumpul', 6], ['s', 'kiraF', 3], ['k', 'k1213', 3]],
  '12.1.4': [['m', 'pilih', 8], ['m', 'bs4', 4], ['m', 'batangDaun', 6], ['s', 'ekstremPilih', 3], ['s', 'sasaran', 3], ['s', 'gabungan', 3], ['k', 'k1214', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan nombor unik: jawapan + calon kesilapan biasa, diisi dengan jiran terdekat
function kcOptsN(ans, cands, f, step) {
  f = f || kcN; step = step || 1;
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (c == null || !isFinite(c) || c < 0) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step; if (v < 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function kcOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const kcMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const KCCQ = {
  mod: [
    () => { const { d, mo } = kcModeData(kcRG, ri(7, 9), 1, 9); return kcMcq('Apakah mod bagi set data ini?', kcChipsFig(d), kcOptsN(mo, [3, kcMed(d), Math.round(kcMean(d)), Math.max(...d), d[0]])); },
    () => { const c = pick(KCJCTX); let F; do { F = kcFreqData(kcRG, c.lo); } while (F.xs.includes(Math.max(...F.fs))); const mo = kcMod(F.data)[0]; return kcMcq('Berdasarkan jadual kekerapan, apakah mod?', kcTabFig(c.x, F.xs, F.fs), kcOptsN(mo, [Math.max(...F.fs), F.xs[F.fs.indexOf(Math.min(...F.fs))], F.xs[2], F.xs[4]])); },
    () => { const lo = 1, hi = 9; let d; do { d = kcModeData(kcRG, ri(9, 13), lo, hi).d; } while (kcCount(d).get(kcMod(d)[0]) > 5); const mo = kcMod(d)[0]; return kcMcq('Plot titik menunjukkan markah kuiz. Apakah mod?', kcDotFig(d, lo, hi, 'Markah kuiz'), kcOptsN(mo, [kcCount(d).get(mo), Math.round(kcMed(d)), Math.max(...d), Math.min(...d)])); }
  ],
  median: [
    () => { const n = pick([5, 7]); let d; do { d = []; for (let i = 0; i < n; i++) d.push(ri(1, 15)); } while (new Set(d).size < n || d[(n - 1) / 2] === kcMed(d)); return kcMcq('Apakah median bagi set data ini?', kcChipsFig(d), kcOptsN(kcMed(d), [d[(n - 1) / 2], kcMean(d), kcSort(d)[(n - 1) / 2 + 1], kcSort(d)[(n - 1) / 2 - 1]])); },
    () => { const n = pick([6, 8]); let d; do { d = []; for (let i = 0; i < n; i++) d.push(ri(2, 20)); } while (new Set(d).size < n || kcMed(d) % 1 === 0); const s = kcSort(d); return kcMcq('Apakah median bagi set data ini?', kcChipsFig(d), kcOptsN(kcMed(d), [s[n / 2 - 1], s[n / 2], (d[n / 2 - 1] + d[n / 2]) / 2, kcMean(d)], kcN, .5)); },
    () => { const c = pick(KCJCTX), F = kcFreqData(kcRG, c.lo), m = kcMed(F.data); return kcMcq('Berdasarkan jadual kekerapan, apakah median?', kcTabFig(c.x, F.xs, F.fs), kcOptsN(m, [F.xs[2], kcMod(F.data)[0], F.fs[2], kcMean(F.data)], kcN, .5)); }
  ],
  min: [
    () => { const d = kcMeanData(kcRG, pick([4, 5]), 2, 12); return kcMcq('Apakah min bagi set data ini?', kcChipsFig(d), kcOptsN(kcMean(d), [kcSum(d) / (d.length - 1), kcMed(d), kcSum(d) / (d.length + 1)], kcN, .5)); },
    () => { const n = ri(4, 6), m = ri(5, 12), tot = m * n; return kcMcq(`Min bagi ${n} nombor ialah ${m}. Apakah hasil tambah nombor-nombor itu?`, kcCardFig([[`n = ${n}`, 'tr'], [`min = ${m}`, 'gr'], ['hasil tambah = ?', 'am']]), kcOptsN(tot, [m + n, tot + n, tot - m, m * (n - 1)])); },
    () => { const c = pick(KCJCTX), F = kcFreqData(kcRG, c.lo), sf = kcSum(F.fs), sfx = kcSum(F.xs.map((x, i) => x * F.fs[i])); return kcMcq('Berdasarkan jadual kekerapan, apakah min?', kcTabFig(c.x, F.xs, F.fs), kcOptsN(sfx / sf, [sfx / 5, kcSum(F.xs) / 5, kcMed(F.data), sf / 5], kcN, .25)); }
  ],
  perubahan: [
    () => { const add = Math.random() < .5, k = ri(2, 9), m = ri(10, 30); return kcMcq(`Min suatu set data ialah ${m}. Setiap nilai ${add ? 'ditambah' : 'ditolak'} ${k}. Apakah min yang baharu?`, kcCardFig([[`min = ${m}`, 'gr'], [`setiap nilai ${add ? '+' : '−'} ${k}`, 'pa']]), kcOptsN(add ? m + k : m - k, [m, add ? m - k : m + k, m * k, m + 2 * k])); },
    () => { const mul = Math.random() < .5, k = mul ? ri(2, 5) : pick([2, 4, 5]), m = ri(4, 12) * (mul ? 1 : k), md = m + (mul ? 1 : k); return kcMcq(`Median suatu set data ialah ${md}. Setiap nilai ${mul ? 'didarab' : 'dibahagi'} ${k}. Apakah median yang baharu?`, kcCardFig([[`median = ${md}`, 'am'], [`setiap nilai ${mul ? '×' : '÷'} ${k}`, 'pa']]), kcOptsN(mul ? md * k : md / k, [md, md + k, Math.abs(md - k), mul ? md / k : md * k])); },
    () => {
      if (Math.random() < .5) { let n, m, M, x; do { n = ri(4, 8); m = ri(5, 15); M = m + pick([-1, 1, 2]); x = M * (n + 1) - n * m; } while (x < 1); return kcMcq(`Min ${n} nombor ialah ${m}. Nombor ${x} ditambah. Apakah min baharu?`, kcCardFig([[`${n} nombor, min ${m}`, 'gr'], [`+ ${x}`, 'pa']]), kcOptsN(M, [(m + x) / 2, m, (n * m + x) / n, M + 1], kcN, 1)); }
      const opts = ['Min', 'Median', 'Mod', 'Semua sama']; const o = kcOptsT('Min', opts);
      let d; do { d = kcMeanData(kcRG, 5, 5, 12); } while (kcMod(d).length !== 1);
      return kcMcq(`Nilai ${Math.max(...d) * 8} ditambah ke dalam set data ini. Sukatan manakah paling banyak berubah?`, kcChipsFig(d), o);
    }
  ],
  terkumpul: [
    () => { const w = pick([5, 10]), a = pick([10, 15, 20, 30, 40, 50]) + pick([0, 1]), b = a + w - 1; return kcMcq(`Apakah titik tengah bagi kelas ${kcKel(a, b)}?`, kcCardFig([[`kelas ${kcKel(a, b)}`, 'pu', 26]]), kcOptsN((a + b) / 2, [b - a, a + b, (a + b) / 2 + .5, a + w / 2], kcN, .5)); },
    () => { const c = pick(KCGCTX), g = kcGroupData(kcRG, c), mf = Math.max(...g.fs), j = g.fs.indexOf(mf), L = g.cls.map(([a, b]) => kcKel(a, b)); return kcMcq('Berdasarkan histogram, apakah kelas mod?', kcBarFig(g.cls.map(([a, b]) => `${a}–${b}`), g.fs, { hist: true, c: 'pu', xl: c.x }), kcOptsT(L[j], L.concat([String(mf)]))); },
    () => { const c = pick(KCGCTX), g = kcGroupData(kcRG, c), sfxU = kcSum(g.fs.map((f, i) => f * g.cls[i][1])); return kcMcq('Apakah min anggaran bagi data terkumpul ini?', kcClassFig(c.x, g.cls, g.fs), kcOptsN(g.mean, [sfxU / g.sf, g.sfx / g.cls.length, g.mids[g.fs.indexOf(Math.max(...g.fs))]], kcN, .5)); }
  ],
  pilih: [
    () => { const [sc, ans] = pick(KCPILIH); return kcMcq(`${sc} Sukatan manakah paling sesuai?`, kcCardFig([['Mod?', 'pk'], ['Median?', 'am'], ['Min?', 'gr']]), kcOptsT(ans, ['Mod', 'Median', 'Min', 'Ketiga-tiganya sama sesuai'])); },
    () => { const d = kcMeanData(kcRG, 5, 60, 120), X = ri(6, 9) * 100, e = shuffle(d.concat([X])); return kcMcq(`Gaji harian (RM) 6 orang pekerja ditunjukkan. Sukatan manakah paling sesuai untuk mewakili gaji mereka?`, kcChipsFig(e), kcOptsT('Median', ['Mod', 'Median', 'Min', 'Ketiga-tiganya sama sesuai'])); },
    () => { let n, m, T, x; do { n = ri(3, 5); m = ri(55, 80); T = m + ri(1, 5); x = (n + 1) * T - n * m; } while (x > 100); return kcMcq(`Min ${n} ujian ialah ${m}. Berapakah markah ujian ke-${n + 1} supaya min menjadi ${T}?`, kcCardFig([[`${n} ujian: min ${m}`, 'tr'], [`sasaran: min ${T}`, 'gr']]), kcOptsN(x, [T, T + (T - m), (n + 1) * T - m, x - T + m])); }
  ]
};
const CQT = { mod: 'Mod', median: 'Median', min: 'Min', perubahan: 'Kesan perubahan', terkumpul: 'Data terkumpul', pilih: 'Memilih sukatan' };
function kcCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = KCCQ[ty] || KCCQ.mod;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['mod', 'median', 'min', 'min', 'perubahan', 'terkumpul'] : Object.keys(CQT);
  return kcCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => KCCQ[t]);
  return kcCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
