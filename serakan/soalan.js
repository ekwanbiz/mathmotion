'use strict';
/* =================== SERAKAN · SOALAN BAB 8 SUKATAN SERAKAN DATA TAK TERKUMPUL (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "sk" / "SK" supaya tidak bertembung dengan teras.
// Kuartil mengikut buku teks KSSM: Q1 = nilai tengah bahagian data sebelum median, Q3 = nilai tengah bahagian
// data selepas median (median tidak dimasukkan apabila n ganjil). Varians σ² = Σ(x − x̄)² ÷ N = Σx² ÷ N − x̄².

/* =================== pembantu nombor & statistik =================== */
const skN = x => { let v = Math.round(x * 100) / 100; if (Object.is(v, -0) || Math.abs(v) < 1e-9) v = 0; return (v < 0 ? '−' : '') + String(Math.abs(v)); };
const skClean = x => Math.abs(Math.round(x * 100) - x * 100) < 1e-7;
const skL = a => a.map(skN).join(', ');
const skSum = a => a.reduce((s, x) => s + x, 0);
const skSort = a => a.slice().sort((p, q) => p - q);
const skMean = a => skSum(a) / a.length;
const skMed = a => { const s = skSort(a), n = s.length; return (s[(n - 1) >> 1] + s[n >> 1]) / 2; };
const skLow = a => { const s = skSort(a); return s.slice(0, s.length >> 1); };
const skUp = a => { const s = skSort(a); return s.slice((s.length + 1) >> 1); };
const skQ1 = a => skMed(skLow(a));
const skQ3 = a => skMed(skUp(a));
const skJul = a => Math.max(...a) - Math.min(...a);
const skJak = a => skQ3(a) - skQ1(a);
const skVar = a => { const m = skMean(a); return skSum(a.map(x => (x - m) * (x - m))) / a.length; };
const skSq = a => skSum(a.map(x => x * x));
// sisihan piawai sebagai teks: tepat jika ≤ 2 t.p., jika tidak dibundarkan kepada 2 t.p.
const skSdT = v2 => { const s = Math.sqrt(v2); return skClean(s) ? skN(s) : (Math.round(s * 100) / 100).toFixed(2); };
const skSdV = v2 => Math.round(Math.sqrt(v2) * 100) / 100;
const skPlus = a => a.map(skN).join(' + ');
const skDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
// rawak: skRG untuk Latihan Kelas / games, skRW (berbenih) untuk Lembaran Kerja
const skRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const skRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const skShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// buang unit daripada jawapan jika ayat soalan tidak menyebut konteks (unit tidak diketahui murid)
const skFixU = (res, key, u) => { if (u && !res.q.includes(key)) { res.ans = res.ans.split(u).join(''); if (res.work) res.work = res.work.map(w => w.split(u).join('')); } return res; };
const SKQ1 = 'Q<sub>1</sub>', SKQ3 = 'Q<sub>3</sub>', SKV = 'σ<sup>2</sup>', SKXB = 'x̄';

/* =================== konteks data =================== */
const SKCTX = [
  { t: n => `markah kuiz ${n} orang murid`, lo: 3, hi: 20, u: '' },
  { t: n => `bilangan buku yang dibaca oleh ${n} orang murid dalam sebulan`, lo: 0, hi: 12, u: '' },
  { t: n => `jisim, dalam kg, ${n} ekor kambing`, lo: 18, hi: 40, u: ' kg' },
  { t: n => `masa, dalam minit, ${n} orang murid berjalan ke sekolah`, lo: 4, hi: 25, u: ' minit' },
  { t: n => `suhu, dalam °C, di sebuah bandar selama ${n} hari`, lo: 24, hi: 35, u: '°C' },
  { t: n => `tinggi, dalam cm, ${n} pokok cili`, lo: 20, hi: 45, u: ' cm' },
  { t: n => `bilangan pelanggan sebuah kedai dalam ${n} jam`, lo: 5, hi: 30, u: '' },
  { t: n => `skor ${n} orang peserta pertandingan memanah`, lo: 10, hi: 30, u: '' }
];
const SKPLOT = [ // plot titik / plot batang-dan-daun: [paksi, subjek]
  { x: 'Bilangan gol', who: 'perlawanan' }, { x: 'Markah kuiz', who: 'murid' }, { x: 'Bilangan buku', who: 'murid' },
  { x: 'Bilangan kereta', who: 'keluarga' }, { x: 'Saiz kasut', who: 'murid' }, { x: 'Bilangan ikan ditangkap', who: 'nelayan' }
];
const SKBD = [ // plot batang-dan-daun (data dua digit)
  { nm: 'markah ujian', who: 'murid', u: '' }, { nm: 'jisim, dalam kg,', who: 'murid', u: ' kg' }, { nm: 'umur', who: 'pengunjung', u: ' tahun' },
  { nm: 'skor', who: 'pemain', u: '' }, { nm: 'tinggi lompatan, dalam cm,', who: 'atlet', u: ' cm' }
];
const SKBOX = [ // plot kotak: [nama, unit, subjek, lo, hi, langkah]
  { x: 'Markah', nm: 'markah ujian', u: '', who: 'murid', lo: 20, hi: 100, st: 5 },
  { x: 'Jisim (kg)', nm: 'jisim', u: ' kg', who: 'murid', lo: 30, hi: 70, st: 2 },
  { x: 'Masa (minit)', nm: 'masa larian', u: ' minit', who: 'peserta', lo: 10, hi: 50, st: 2 },
  { x: 'Tinggi (cm)', nm: 'tinggi', u: ' cm', who: 'pokok', lo: 10, hi: 50, st: 2 },
  { x: 'Umur (tahun)', nm: 'umur', u: ' tahun', who: 'pengunjung', lo: 10, hi: 70, st: 5 }
];
const SKDUA = [ // dua kumpulan untuk dibanding
  ['Kelas Amanah', 'Kelas Bestari'], ['Pasukan Helang', 'Pasukan Harimau'], ['Kilang P', 'Kilang Q'],
  ['Ali', 'Bala'], ['Siti', 'Mei Ling'], ['Kedai A', 'Kedai B']
];

/* =================== rajah (SVG, warna var(--…)) =================== */
const skT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const skLn = (x1, y1, x2, y2, c = 'mu', w = 2.5, dash) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
const skRect = (x, y, w, h, c = 'bd', fill = 'surf', op = 1, rx = 6) => `<rect x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" rx="${rx}" style="fill:var(--${fill});fill-opacity:${op};stroke:var(--${c})" stroke-width="2"/>`;
const skSvg = (w, h, s, label) => `<svg viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
function skChipsFig(vals, label, hl) {
  const per = Math.min(6, vals.length), rows = Math.ceil(vals.length / per), cw = 48, gap = 8, W = Math.max(320, per * (cw + gap) + 24);
  let s = '';
  vals.forEach((v, i) => {
    const r = Math.floor(i / per), c = i % per, n = Math.min(per, vals.length - r * per), x0 = (W - (n * (cw + gap) - gap)) / 2, on = hl && hl.includes(i);
    s += skRect(x0 + c * (cw + gap), 14 + r * 52, cw, 42, on ? 'pa' : 'bd', on ? 'pa' : 'surf', on ? .2 : 1, 9) + skT(x0 + c * (cw + gap) + cw / 2, 35 + r * 52, skN(v), 'tx', 18);
  });
  return skSvg(W, rows * 52 + 20, s, label || 'Set data');
}
// garis nombor: pulangkan [svg, X]
function skAxis(lo, hi, L, R, y, st, lab) {
  const X = v => L + (v - lo) / (hi - lo) * (R - L);
  let s = skLn(L - 8, y, R + 8, y, 'mu', 2.5);
  const L0 = st * lab, isLab = v => Math.abs(v / L0 - Math.round(v / L0)) < 1e-9;
  for (let k = 0, v = lo; v <= hi + 1e-9; k++, v = lo + k * st) s += skLn(X(v), y - 5, X(v), y + 5, 'mu', 2) + (isLab(v) ? skT(X(v), y + 17, skN(v), 'mu', 12.5, 'middle', 600) : '');
  return [s, X];
}
// plot titik satu set
function skDotFig(data, lo, hi, xl, label) {
  const cnt = {}; data.forEach(v => (cnt[v] = (cnt[v] || 0) + 1));
  const mx = Math.max(...Object.values(cnt)), W = 340, L = 24, R = W - 24, gap = 16, base = 26 + mx * gap, H = base + (xl ? 54 : 32);
  const lab = hi - lo > 12 ? 2 : 1, [ax, X] = skAxis(lo, hi, L, R, base, 1, lab);
  let s = ax; const k = {};
  skSort(data).forEach(v => { const j = k[v] || 0; k[v] = j + 1; s += `<circle cx="${+X(v).toFixed(1)}" cy="${+(base - 13 - j * gap).toFixed(1)}" r="6.5" style="fill:var(--tr)"/>`; });
  if (xl) s += skT(W / 2, base + 40, xl, 'mu', 13, 'middle', 600);
  return skSvg(W, H, s, label || 'Plot titik');
}
// dua plot titik (set A di atas, set B di bawah)
function skDot2Fig(A, B, lo, hi, la, lb, xl) {
  const ca = {}, cb = {}; A.forEach(v => (ca[v] = (ca[v] || 0) + 1)); B.forEach(v => (cb[v] = (cb[v] || 0) + 1));
  const ma = Math.max(...Object.values(ca)), mb = Math.max(...Object.values(cb)), W = 340, L = 24, R = W - 24, gap = 15;
  const b1 = 34 + ma * gap, b2 = b1 + 62 + mb * gap, H = b2 + (xl ? 52 : 30), lab = hi - lo > 12 ? 2 : 1;
  const [a1, X] = skAxis(lo, hi, L, R, b1, 1, lab), [a2] = skAxis(lo, hi, L, R, b2, 1, lab);
  let s = a1 + a2 + skT(L - 6, 12, la, 'tr', 14, 'start') + skT(L - 6, b1 + 40, lb, 'pa', 14, 'start');
  const put = (D, base, c) => { const k = {}; skSort(D).forEach(v => { const j = k[v] || 0; k[v] = j + 1; s += `<circle cx="${+X(v).toFixed(1)}" cy="${+(base - 12 - j * gap).toFixed(1)}" r="6" style="fill:var(--${c})"/>`; }); };
  put(A, b1, 'tr'); put(B, b2, 'pa');
  if (xl) s += skT(W / 2, b2 + 38, xl, 'mu', 13, 'middle', 600);
  return skSvg(W, H, s, `Plot titik ${la} dan ${lb}`);
}
const skStems = d => { const o = {}; skSort(d).forEach(v => (o[Math.floor(v / 10)] = o[Math.floor(v / 10)] || []).push(v % 10)); return o; };
// plot batang-dan-daun
function skStemFig(data, label, unit) {
  const st = skStems(data), ks = Object.keys(st).map(Number), lo = Math.min(...ks), hi = Math.max(...ks), rows = hi - lo + 1;
  const W = Math.max(300, 140 + Math.max(...Object.values(st).map(a => a.length)) * 22), H = 58 + rows * 28 + 26;
  let s = skT(70, 18, 'Batang', 'mu', 13, 'middle', 600) + skT(170, 18, 'Daun', 'mu', 13, 'middle', 600) + skLn(100, 32, 100, 32 + rows * 28, 'mu', 2.5);
  for (let k = lo; k <= hi; k++) { const y = 46 + (k - lo) * 28; s += skT(70, y, String(k), 'tx', 17); (st[k] || []).forEach((d, j) => { s += skT(122 + j * 22, y, String(d), 'tx', 17); }); }
  s += skT(W / 2, H - 14, `Kekunci: ${lo} | ${st[lo][0]} bermaksud ${lo * 10 + st[lo][0]}${unit || ''}`, 'mu', 13, 'middle', 600);
  return skSvg(W, H, s, label || 'Plot batang-dan-daun');
}
// plot batang-dan-daun berganda (A kiri, B kanan)
function skStem2Fig(A, B, la, lb) {
  const sa = skStems(A), sb = skStems(B), ks = Object.keys(sa).concat(Object.keys(sb)).map(Number), lo = Math.min(...ks), hi = Math.max(...ks), rows = hi - lo + 1;
  const W = 340, H = 64 + rows * 28 + 46, cx = 170;
  let s = skT(80, 18, la, 'tr', 13) + skT(cx, 18, 'Batang', 'mu', 12, 'middle', 600) + skT(260, 18, lb, 'pa', 13);
  s += skLn(cx - 20, 32, cx - 20, 32 + rows * 28, 'mu', 2.5) + skLn(cx + 20, 32, cx + 20, 32 + rows * 28, 'mu', 2.5);
  for (let k = lo; k <= hi; k++) {
    const y = 46 + (k - lo) * 28; s += skT(cx, y, String(k), 'tx', 17);
    (sa[k] || []).slice().reverse().forEach((d, j) => { s += skT(cx - 38 - j * 20, y, String(d), 'tr', 17); });
    (sb[k] || []).forEach((d, j) => { s += skT(cx + 38 + j * 20, y, String(d), 'pa', 17); });
  }
  const ka = Object.keys(sa).map(Number)[0], kb = Object.keys(sb).map(Number)[0];
  s += skT(W / 2, H - 34, `Kekunci: ${sa[ka][0]} | ${ka} | bermaksud ${ka * 10 + sa[ka][0]} (${la})`, 'mu', 12, 'middle', 600);
  s += skT(W / 2, H - 14, `| ${kb} | ${sb[kb][0]} bermaksud ${kb * 10 + sb[kb][0]} (${lb})`, 'mu', 12, 'middle', 600);
  return skSvg(W, H, s, `Plot batang-dan-daun berganda ${la} dan ${lb}`);
}
// plot kotak: sets = [{v:[min,Q1,med,Q3,maks], lab, c}]
function skBoxFig(sets, lo, hi, st, xl, label) {
  const W = 340, L = 26, R = W - 18, n = sets.length, top = sets.some(o => o.lab) ? 30 : 14, bh = 34, gapY = 62;
  const ay = top + n * gapY + 4, H = ay + (xl ? 50 : 30);
  const nt = Math.round((hi - lo) / st), lab = nt > 10 ? (nt > 20 ? 5 : 2) : 1, [ax, X] = skAxis(lo, hi, L, R, ay, st, lab);
  let s = ax;
  sets.forEach((o, i) => {
    const y = top + i * gapY + gapY / 2 - 6, [a, b, c, d, e] = o.v, cl = o.c || 'pu';
    s += skLn(X(a), y, X(b), y, cl, 2.5) + skLn(X(d), y, X(e), y, cl, 2.5) + skLn(X(a), y - 10, X(a), y + 10, cl, 2.5) + skLn(X(e), y - 10, X(e), y + 10, cl, 2.5);
    s += `<rect x="${+X(b).toFixed(1)}" y="${+(y - bh / 2).toFixed(1)}" width="${+(X(d) - X(b)).toFixed(1)}" height="${bh}" rx="4" style="fill:var(--${cl});fill-opacity:.2;stroke:var(--${cl})" stroke-width="2.5"/>`;
    s += skLn(X(c), y - bh / 2, X(c), y + bh / 2, 'am', 3);
    if (o.lab) s += skT(L - 8, y - bh / 2 - 10, o.lab, cl, 13, 'start');
  });
  if (xl) s += skT(W / 2, ay + 36, xl, 'mu', 13, 'middle', 600);
  return skSvg(W, H, s, label || 'Plot kotak');
}
// jadual kekerapan mengufuk
function skTabFig(xl, xs, fs, label) {
  const n = xs.length, c0 = 130, cw = 40, W = c0 + n * cw + 12;
  let s = skRect(6, 6, W - 12, 80, 'bd', 'surf', 1, 10) + skLn(6, 46, W - 6, 46, 'bd', 2) + skLn(c0, 6, c0, 86, 'bd', 2);
  s += skT(c0 / 2 + 3, 26, xl, 'tr', 13) + skT(c0 / 2 + 3, 66, 'Kekerapan', 'pa', 13);
  xs.forEach((x, i) => { s += skT(c0 + cw * i + cw / 2, 26, skN(x), 'tx', 15) + skT(c0 + cw * i + cw / 2, 66, skN(fs[i]), 'tx', 15); if (i) s += skLn(c0 + cw * i, 6, c0 + cw * i, 86, 'bd', 1); });
  return skSvg(W, 92, s, label || 'Jadual kekerapan');
}
// jadual ringkasan dua kumpulan (baris: [label, a, b])
function skCmpFig(la, lb, rows, label) {
  const W = 340, rh = 32, H = (rows.length + 1) * rh + 16;
  let s = skRect(6, 6, W - 12, H - 12, 'bd', 'surf', 1, 10) + skLn(130, 6, 130, H - 6, 'bd', 2) + skLn(235, 6, 235, H - 6, 'bd', 2) + skLn(6, 6 + rh, W - 6, 6 + rh, 'bd', 2);
  s += skT(183, 6 + rh / 2, la, 'tr', 13) + skT(288, 6 + rh / 2, lb, 'pa', 13);
  rows.forEach(([t, a, b], i) => { const y = 6 + rh * (i + 1) + rh / 2; s += skT(68, y, t, 'mu', 14) + skT(183, y, a, 'tx', 15) + skT(288, y, b, 'tx', 15); });
  return skSvg(W, H, s, label || 'Jadual perbandingan');
}
function skCardFig(lines, label) {
  const W = 340, H = 40 + lines.length * 34;
  let s = skRect(6, 6, W - 12, H - 12, 'bd', 'surf', 1, 16);
  lines.forEach(([t, c, sz], i) => { s += skT(W / 2, 38 + i * 34, t, c || 'tx', sz || 19); });
  return skSvg(W, H, s, label || 'Maklumat soalan');
}

/* =================== penjana data =================== */
// data rawak dengan sekurang-kurangnya 'dist' nilai berbeza
function skData(r, n, lo, hi, dist) {
  let d; do { d = []; for (let i = 0; i < n; i++) d.push(r.i(lo, hi)); } while (new Set(d).size < (dist || Math.min(n, 4)));
  return d;
}
// data dengan min integer dan varians tepat ≤ 2 t.p.
function skVarData(r, n, lo, hi) {
  let d, k = 0;
  do {
    d = skData(r, n, lo, hi, Math.min(n, 4));
    const rem = skSum(d) % n; if (rem) { d[n - 1] += n - rem; }
    k++;
  } while ((d[n - 1] > hi + n || !Number.isInteger(skMean(d)) || !skClean(skVar(d)) || !skClean(skSq(d) / n) || skVar(d) === 0) && k < 500);
  return skShuf(r, d);
}
// data dua digit untuk plot batang-dan-daun (3–4 batang)
function skBDData(r, n) {
  const s0 = r.i(2, 6), d = [];
  while (d.length < n) { const v = r.i(s0 * 10, s0 * 10 + r.i(25, 39)); if (d.filter(x => x === v).length < 2) d.push(v); }
  return d;
}
// lima nilai plot kotak
function skFive(r, c) {
  const st = c.st, span = c.hi - c.lo, u = Math.round(span / st);
  let v;
  do {
    const a = r.i(0, Math.floor(u * .3)), e = r.i(Math.ceil(u * .7), u);
    const b = r.i(a + 1, a + Math.max(2, Math.floor((e - a) * .4))), d = r.i(Math.max(b + 2, e - Math.max(2, Math.floor((e - a) * .4))), e - 1);
    const m = r.i(b + 1, d - 1);
    v = [a, b, m, d, e].map(k => c.lo + k * st);
  } while (!(v[0] < v[1] && v[1] < v[2] && v[2] < v[3] && v[3] < v[4]));
  return v;
}
const skFiveOf = d => [Math.min(...d), skQ1(d), skMed(d), skQ3(d), Math.max(...d)];

/* =================== jalan kerja =================== */
function skMedLine(s) {
  const n = s.length;
  return n % 2 ? `n = ${n}, median = nilai ke-${(n + 1) / 2} = ${skN(skMed(s))}` : `n = ${n}, median = (${skN(s[n / 2 - 1])} + ${skN(s[n / 2])}) ÷ 2 = ${skN(skMed(s))}`;
}
function skHalfLine(h, Q) {
  const n = h.length;
  return n % 2 ? `${skL(h)} → ${Q} = ${skN(skMed(h))}` : `${skL(h)} → ${Q} = (${skN(h[n / 2 - 1])} + ${skN(h[n / 2])}) ÷ 2 = ${skN(skMed(h))}`;
}
function skQWork(d) {
  const s = skSort(d);
  return [`Susun mengikut tertib menaik: ${skL(s)}`, skMedLine(s),
    `Sebelum median: ${skHalfLine(skLow(d), SKQ1)}`, `Selepas median: ${skHalfLine(skUp(d), SKQ3)}`];
}
const skJulWork = d => [`Nilai terbesar = ${skN(Math.max(...d))}, nilai terkecil = ${skN(Math.min(...d))}`, `Julat = ${skN(Math.max(...d))} − ${skN(Math.min(...d))} = ${skN(skJul(d))}`];
function skVarWorkDef(d) {
  const m = skMean(d), n = d.length, t = skSum(d.map(x => (x - m) * (x - m)));
  return [`${SKXB} = ${fr(`${skN(skSum(d))}`, `${n}`)} = ${skN(m)}`,
    `Σ(x − ${SKXB})² = ${d.map(x => `(${skN(x)} − ${skN(m)})²`).join(' + ')}`,
    `= ${d.map(x => skN((x - m) * (x - m))).join(' + ')} = ${skN(t)}`,
    `${SKV} = ${fr(`${skN(t)}`, `${n}`)} = ${skN(skVar(d))}`];
}
function skVarWorkAlt(d) {
  const m = skMean(d), n = d.length, t = skSq(d);
  return [`Σx = ${skPlus(d)} = ${skN(skSum(d))}, ${SKXB} = ${fr(`${skN(skSum(d))}`, `${n}`)} = ${skN(m)}`,
    `Σx² = ${d.map(x => `${skN(x)}²`).join(' + ')} = ${skN(t)}`,
    `${SKV} = ${fr(`${skN(t)}`, `${n}`)} − ${skN(m)}² = ${skN(t / n)} − ${skN(m * m)} = ${skN(skVar(d))}`,
    `σ = ${rt(skN(skVar(d)))} = ${skSdT(skVar(d))}`];
}

/* =================== pernyataan betul / salah =================== */
const SKBS1 = [
  ['Serakan menunjukkan sejauh mana nilai-nilai dalam suatu set data tersebar.', true, 'Serakan mengukur sejauh mana data tersebar atau tertumpu.'],
  ['Dua set data yang mempunyai min yang sama mesti mempunyai serakan yang sama.', false, 'Min yang sama tidak bermakna serakan sama; julat atau taburan boleh berbeza.'],
  ['Kekunci dalam plot batang-dan-daun menerangkan nilai yang diwakili oleh batang dan daun.', true, 'Contohnya, kekunci 4 | 5 bermaksud 45.'],
  ['Set data yang mempunyai julat lebih kecil adalah kurang terserak.', true, 'Julat yang kecil menunjukkan data lebih tertumpu.'],
  ['Dalam plot titik, setiap titik mewakili satu data.', true, 'Setiap ● ditanda di atas nilai bagi satu data.'],
  ['Daun dalam plot batang-dan-daun tidak perlu disusun.', false, 'Daun perlu disusun mengikut tertib menaik.'],
  ['Data yang lebih terserak menunjukkan prestasi yang lebih konsisten.', false, 'Data yang kurang terserak (lebih tertumpu) menunjukkan prestasi yang lebih konsisten.'],
  ['Plot titik membantu kita melihat nilai yang jauh daripada data lain.', true, 'Nilai yang terpencil jelas kelihatan pada plot titik.']
];
const SKBS2 = [
  ['Julat hanya menggunakan nilai terbesar dan nilai terkecil dalam set data.', true, 'Julat = nilai terbesar − nilai terkecil.'],
  ['Julat antara kuartil terjejas teruk oleh pencilan.', false, 'Julat antara kuartil tidak menggunakan nilai terbesar dan terkecil, jadi kurang terjejas oleh pencilan.'],
  ['Sisihan piawai menggunakan semua nilai dalam set data.', true, 'Setiap nilai digunakan untuk mengira Σ(x − x̄)².'],
  ['Unit varians sama dengan unit data.', false, 'Unit varians ialah kuasa dua unit data. Sisihan piawai mempunyai unit yang sama dengan data.'],
  ['Varians boleh mempunyai nilai negatif.', false, 'Varians ialah purata kuasa dua, jadi tidak mungkin negatif.'],
  ['Sisihan piawai ialah punca kuasa dua varians.', true, 'σ = ' + rt('σ²')],
  ['Sisihan piawai yang kecil menunjukkan data tertumpu berhampiran min.', true, 'Beza setiap data dengan min adalah kecil.'],
  ['Jika semua nilai dalam set data adalah sama, sisihan piawai ialah 0.', true, 'Setiap x − x̄ = 0, maka σ² = 0 dan σ = 0.']
];
const SKBS3 = [
  ['Plot kotak dibina menggunakan nilai minimum, Q1, median, Q3 dan nilai maksimum.', true, 'Plot kotak menggunakan lima nilai ini.'],
  ['Panjang kotak dalam plot kotak mewakili julat.', false, 'Panjang kotak mewakili julat antara kuartil, Q3 − Q1.'],
  ['Kira-kira 50% data terletak di dalam kotak.', true, 'Kotak bermula di Q1 dan berakhir di Q3.'],
  ['Garis median sentiasa berada di tengah-tengah kotak.', false, 'Median boleh lebih dekat dengan Q1 atau Q3.'],
  ['Bahagian plot kotak yang lebih panjang mengandungi lebih banyak data.', false, 'Setiap bahagian mengandungi kira-kira 25% data; bahagian panjang bermakna data lebih terserak.'],
  ['Plot kotak boleh digunakan untuk membanding serakan dua set data.', true, 'Bandingkan panjang kotak (JAK) dan panjang keseluruhan (julat).']
];
const SKBS4 = [
  ['Jika setiap nilai ditambah 5, sisihan piawai juga bertambah 5.', false, 'Tambah pemalar tidak mengubah sisihan piawai.'],
  ['Jika setiap nilai didarab 3, varians menjadi 9 kali ganda.', true, 'Varians didarab 3² = 9.'],
  ['Jika setiap nilai ditolak 2, julat antara kuartil tidak berubah.', true, 'Tolak pemalar hanya mengalihkan data.'],
  ['Jika setiap nilai dibahagi 2, sisihan piawai juga dibahagi 2.', true, 'Sisihan piawai berubah mengikut nisbah yang sama.'],
  ['Pencilan memberi kesan yang besar kepada julat.', true, 'Julat menggunakan nilai terbesar atau terkecil, iaitu pencilan itu sendiri.'],
  ['Jika setiap nilai didarab 2, julat tidak berubah.', false, 'Julat juga didarab 2.'],
  ['Menambah satu nilai yang sama dengan min akan menambah sisihan piawai.', false, 'Nilai yang sama dengan min menjadikan data lebih tertumpu, jadi sisihan piawai berkurang.'],
  ['Jika setiap nilai ditambah 4, varians bertambah 16.', false, 'Tambah pemalar tidak mengubah varians.']
];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 8.1.1 Serakan ---------- */
  plotJulat: [
    ({ who, n }) => ({ q: `Plot titik di bawah menunjukkan data bagi ${n} ${who}. Nyatakan nilai terbesar, nilai terkecil dan julat data itu.` }),
    ({ n }) => ({ q: `Berdasarkan plot titik di bawah (${n} data), hitung julat.` }),
    ({ who, n }) => ({ q: `Setiap ● dalam plot titik di bawah mewakili satu ${who}. Terdapat ${n} ${who} semuanya. Berapakah julat data itu?` }),
    ({ wrong, ans, n }) => { const N = vnama(); return Object.assign({ q: `${N} berkata julat bagi data ${n} titik dalam plot di bawah ialah ${wrong}, iaitu bilangan titik pada lajur paling tinggi. Adakah ${N} betul?` }, salah(N, ans, 'Julat ialah nilai terbesar tolak nilai terkecil, bukan kekerapan.')); }
  ],
  bdBaca: [
    ({ nm, who, what }) => ({ q: `Plot batang-dan-daun di bawah menunjukkan ${nm} sekumpulan ${who}. Nyatakan ${what}.` }),
    ({ what }) => ({ q: `Berdasarkan plot batang-dan-daun di bawah, tentukan ${what}.` }),
    ({ what, who }) => ({ q: `Plot batang-dan-daun di bawah mewakili data beberapa orang ${who}. Apakah ${what}?` })
  ],
  bandingTitik: [
    ({ la, lb, xl }) => ({ q: `Plot titik di bawah menunjukkan ${xl.toLowerCase()} bagi ${la} dan ${lb}. Hitung julat setiap set data. Set data manakah lebih terserak?` }),
    ({ la, lb }) => ({ q: `Bandingkan serakan data ${la} dan ${lb} dalam plot titik di bawah dengan menggunakan julat.` }),
    ({ la, lb }) => ({ q: `Berdasarkan plot titik di bawah, data manakah lebih tertumpu, ${la} atau ${lb}? Beri sebab.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  binaBD: [
    ({ L, nm, who }) => ({ q: `Data berikut menunjukkan ${nm} sekumpulan ${who}.<br>${L}<br>Bina plot batang-dan-daun bagi data itu dan nyatakan julatnya.` }),
    ({ L }) => ({ q: `Wakilkan data berikut dengan plot batang-dan-daun. Kemudian, hitung julat.<br>${L}` }),
    ({ L }) => ({ q: `Lukis plot batang-dan-daun bagi data ${L}. Sertakan kekunci dan nyatakan julat.` })
  ],
  binaTitik: [
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Lukis plot titik bagi data itu dan nyatakan julatnya.` }),
    ({ L }) => ({ q: `Bina plot titik bagi data ${L}. Huraikan serakan data itu.` }),
    ({ L }) => ({ q: `Wakilkan data berikut dengan plot titik, kemudian hitung julat.<br>${L}` })
  ],
  bandingBD: [
    ({ la, lb, nm }) => ({ q: `Plot batang-dan-daun berganda di bawah menunjukkan ${nm} ${la} dan ${lb}. Hitung julat setiap set data dan nyatakan set yang lebih konsisten.` }),
    ({ la, lb }) => ({ q: `Berdasarkan plot batang-dan-daun berganda di bawah, bandingkan serakan data ${la} dan ${lb}.` }),
    ({ la, lb }) => ({ q: `Plot di bawah membandingkan data ${la} (daun kiri) dengan ${lb} (daun kanan). Data manakah lebih terserak? Wajarkan jawapan anda.` })
  ],
  k811: [d => ({ q: d.q0, ans: d.a0, work: d.w0 }), d => ({ q: d.q1, ans: d.a1, work: d.w1 }), d => ({ q: d.q2, ans: d.a2, work: d.w2 })],

  /* ---------- 8.2.1 Julat & JAK ---------- */
  julat: [
    ({ L }) => ({ q: `Hitung julat bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Cari julat data itu.` }),
    ({ L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata julat bagi data ${L} ialah ${wrong}, iaitu nilai terakhir tolak nilai pertama. Adakah ${N} betul?` }, salah(N, ans, 'Julat = nilai terbesar − nilai terkecil, bukan nilai terakhir − nilai pertama.')); },
    ({ L, ctx }) => ({ q: `${vcap(ctx)} ialah ${L}. Berapakah julatnya?` })
  ],
  kuartil: [
    ({ L, Q }) => ({ q: `Cari ${Q} bagi set data berikut.<br>${L}` }),
    ({ L, Q, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Tentukan ${Q}.` }),
    ({ L, Q }) => ({ q: `Susun data ${L} mengikut tertib menaik, kemudian nyatakan ${Q}.` }),
    ({ L, Q }) => ({ q: `Tentukan kuartil ${Q === SKQ1 ? 'pertama' : 'ketiga'}, ${Q}, bagi data: ${L}` })
  ],
  jakS: [
    ({ L }) => ({ q: `Hitung julat antara kuartil bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Cari julat antara kuartil.` }),
    ({ L }) => ({ q: `Cari ${SKQ1}, ${SKQ3} dan julat antara kuartil bagi data ${L}.` }),
    ({ L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira julat antara kuartil bagi data ${L} dan mendapat ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah ${SKQ1} dan ${SKQ3}. Julat antara kuartil = ${SKQ3} − ${SKQ1}.`)); }
  ],
  jakBD: [
    ({ nm, who }) => ({ q: `Plot batang-dan-daun di bawah menunjukkan ${nm} sekumpulan ${who}. Hitung julat dan julat antara kuartil.` }),
    ({ n }) => ({ q: `Berdasarkan plot batang-dan-daun di bawah (${n} data), cari ${SKQ1}, ${SKQ3} dan julat antara kuartil.` }),
    ({ who }) => ({ q: `Data bagi beberapa orang ${who} ditunjukkan dalam plot batang-dan-daun di bawah. Tentukan julat dan julat antara kuartil.` })
  ],
  cariJulat: [
    ({ Lx, J }) => ({ q: `Julat bagi set data ${Lx} ialah ${J}. Diberi x ialah nilai terbesar, cari nilai x.` }),
    ({ Lx, J }) => ({ q: `Set data ${Lx} mempunyai julat ${J}. Jika x lebih besar daripada semua nilai lain, hitung x.` }),
    ({ Lx, J }) => ({ q: `Diberi julat bagi ${Lx} ialah ${J} dan x ialah nilai terkecil, tentukan nilai x.` })
  ],
  bandingJak: [
    ({ la, lb, LA, LB, nm }) => ({ q: `${vcap(nm)} ${la}: ${LA}<br>${vcap(nm)} ${lb}: ${LB}<br>Hitung julat antara kuartil bagi setiap set. Set manakah lebih tertumpu?` }),
    ({ la, lb, LA, LB }) => ({ q: `Bandingkan serakan data ${la} (${LA}) dan ${lb} (${LB}) menggunakan julat antara kuartil.` }),
    ({ la, lb, LA, LB, nm }) => ({ q: `Data berikut ialah ${nm} ${la} dan ${lb}.<br>${la}: ${LA}<br>${lb}: ${LB}<br>Data manakah lebih terserak berdasarkan julat antara kuartil?` })
  ],
  k821: [d => ({ q: d.q0, ans: d.a0, work: d.w0 }), d => ({ q: d.q1, ans: d.a1, work: d.w1 }), d => ({ q: d.q2, ans: d.a2, work: d.w2 })],

  /* ---------- 8.2.2 Varians & sisihan piawai ---------- */
  varS: [
    ({ L }) => ({ q: `Hitung varians bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Cari varians data itu.` }),
    ({ L }) => ({ q: `Dengan menggunakan rumus ${SKV} = ${fr(`Σ(x − ${SKXB})²`, `N`)}, cari varians bagi ${L}.` }),
    ({ L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati varians bagi data ${L} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak mengkuasaduakan beza (x − ${SKXB}). Varians ialah purata kuasa dua beza setiap data dengan min.`)); }
  ],
  sdS: [
    ({ L }) => ({ q: `Hitung sisihan piawai bagi set data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Cari varians dan sisihan piawai.` }),
    ({ L }) => ({ q: `Dengan menggunakan rumus ${SKV} = ${fr(`Σx²`, `N`)} − ${SKXB}², cari sisihan piawai bagi ${L}.` }),
    ({ L, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sisihan piawai bagi data ${L} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${wrong} ialah varians. Sisihan piawai ialah punca kuasa dua varians.`)); }
  ],
  dariJum: [
    ({ n, sx, sx2 }) => ({ q: `Bagi suatu set ${n} data, Σx = ${sx} dan Σx² = ${sx2}. Hitung min, varians dan sisihan piawai.` }),
    ({ n, sx, sx2 }) => ({ q: `Diberi N = ${n}, Σx = ${sx} dan Σx² = ${sx2}. Cari varians dan sisihan piawai set data itu.` }),
    ({ n, sx, sx2 }) => ({ q: `Hasil tambah ${n} nombor ialah ${sx} dan hasil tambah kuasa dua nombor-nombor itu ialah ${sx2}. Tentukan sisihan piawai.` })
  ],
  varJadual: [
    ({ x }) => ({ q: `Jadual kekerapan di bawah menunjukkan ${x.toLowerCase()} bagi sekumpulan murid. Hitung varians dan sisihan piawai.` }),
    () => ({ q: 'Cari min, varians dan sisihan piawai bagi data dalam jadual kekerapan di bawah.' }),
    () => ({ q: `Dengan menggunakan ${SKV} = ${fr(`Σfx²`, `Σf`)} − ${SKXB}², hitung varians bagi data dalam jadual di bawah.` })
  ],
  bandingSd: [
    ({ la, lb, LA, LB, nm }) => ({ q: `${vcap(nm)} ${la}: ${LA}<br>${vcap(nm)} ${lb}: ${LB}<br>Hitung sisihan piawai bagi setiap set. Data manakah lebih konsisten?` }),
    ({ la, lb, LA, LB }) => ({ q: `Dengan menggunakan sisihan piawai, bandingkan serakan data ${la} (${LA}) dan ${lb} (${LB}).` }),
    ({ la, lb, LA, LB, nm }) => ({ q: `Data berikut ialah ${nm} ${la} dan ${lb} dalam 5 percubaan.<br>${la}: ${LA}<br>${lb}: ${LB}<br>Data manakah kurang terserak? Tunjukkan pengiraan.` })
  ],
  cariSumX2: [
    ({ n, m, s }) => ({ q: `Min dan sisihan piawai bagi ${n} nombor masing-masing ialah ${m} dan ${s}. Cari Σx dan Σx².` }),
    ({ n, m, s }) => ({ q: `Suatu set ${n} data mempunyai min ${m} dan sisihan piawai ${s}. Hitung hasil tambah kuasa dua data itu, Σx².` }),
    ({ n, m, v }) => ({ q: `Bagi ${n} data, min = ${m} dan varians = ${v}. Tentukan nilai Σx².` })
  ],
  k822: [d => ({ q: d.q0, ans: d.a0, work: d.w0 }), d => ({ q: d.q1, ans: d.a1, work: d.w1 }), d => ({ q: d.q2, ans: d.a2, work: d.w2 })],

  /* ---------- 8.2.3 Plot kotak ---------- */
  bacaKotak: [
    ({ nm, who, what }) => ({ q: `Plot kotak di bawah menunjukkan ${nm} sekumpulan ${who}. Nyatakan ${what}.` }),
    ({ what }) => ({ q: `Berdasarkan plot kotak di bawah, apakah ${what}?` }),
    ({ what, who }) => ({ q: `Plot kotak di bawah mewakili data bagi beberapa ${who}. Tentukan ${what}.` })
  ],
  julatKotak: [
    ({ nm, who }) => ({ q: `Plot kotak di bawah menunjukkan ${nm} sekumpulan ${who}. Hitung julat dan julat antara kuartil.` }),
    () => ({ q: 'Berdasarkan plot kotak di bawah, cari julat dan julat antara kuartil.' }),
    ({ who }) => ({ q: `Plot kotak di bawah mewakili data bagi beberapa ${who}. Tentukan julat dan julat antara kuartil data itu.` }),
    ({ wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata julat antara kuartil bagi data dalam plot kotak di bawah ialah ${wrong}, iaitu panjang keseluruhan plot. Adakah ${N} betul?` }, salah(N, ans, `Panjang keseluruhan ialah julat. Julat antara kuartil ialah panjang kotak, ${SKQ3} − ${SKQ1}.`)); }
  ],
  limaNilai: [
    ({ L }) => ({ q: `Tentukan nilai minimum, ${SKQ1}, median, ${SKQ3} dan nilai maksimum bagi data berikut.<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Nyatakan lima nilai yang diperlukan untuk membina plot kotak.` }),
    ({ L }) => ({ q: `Sebelum membina plot kotak bagi data ${L}, cari lima nilai yang diperlukan.` })
  ],
  binaKotak: [
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Bina plot kotak bagi data itu.` }),
    ({ L }) => ({ q: `Lukis plot kotak bagi data ${L}. Nyatakan julat antara kuartil.` }),
    ({ L }) => ({ q: `Wakilkan data berikut dengan plot kotak di atas garis nombor berskala.<br>${L}` })
  ],
  bandingKotak: [
    ({ la, lb, nm }) => ({ q: `Plot kotak di bawah menunjukkan ${nm} ${la} dan ${lb}. Bandingkan median dan julat antara kuartil. Kumpulan manakah lebih konsisten?` }),
    ({ la, lb }) => ({ q: `Berdasarkan dua plot kotak di bawah, bandingkan serakan data ${la} dan ${lb}.` }),
    ({ la, lb }) => ({ q: `Dua plot kotak di bawah mewakili ${la} dan ${lb}. Nyatakan kumpulan yang mempunyai median lebih tinggi dan kumpulan yang kurang terserak.` })
  ],
  peratus: [
    ({ N, who, what }) => ({ q: `Plot kotak di bawah menunjukkan data bagi ${N} orang ${who}. Anggarkan bilangan ${who} yang ${what}.` }),
    ({ N, who, what }) => ({ q: `Seramai ${N} orang ${who} terlibat. Berdasarkan plot kotak di bawah, berapakah bilangan ${who} yang ${what}?` }),
    ({ N, who, what }) => ({ q: `Plot kotak di bawah mewakili ${N} orang ${who}. Kira-kira berapa orang ${who} ${what}?` })
  ],
  k823: [d => ({ q: d.q0, ans: d.a0, work: d.w0 }), d => ({ q: d.q1, ans: d.a1, work: d.w1 }), d => ({ q: d.q2, ans: d.a2, work: d.w2 })],

  /* ---------- 8.2.4 Perubahan & perbandingan ---------- */
  tambahK: [
    ({ m, J, Q, s, opTxt }) => ({ q: `Suatu set data mempunyai min ${m}, julat ${J}, julat antara kuartil ${Q} dan sisihan piawai ${s}. Setiap nilai ${opTxt}. Cari min, julat, julat antara kuartil dan sisihan piawai yang baharu.` }),
    ({ m, J, Q, s, opTxt }) => ({ q: `Min = ${m}, julat = ${J}, julat antara kuartil = ${Q}, sisihan piawai = ${s}. Jika setiap data ${opTxt}, nyatakan nilai-nilai baharu.` }),
    ({ m, J, Q, s, k, add }) => ({ q: add ? `Markah suatu kuiz mempunyai min ${m}, julat ${J}, julat antara kuartil ${Q} dan sisihan piawai ${s}. Guru menambah ${k} markah bonus kepada setiap murid. Cari min, julat, julat antara kuartil dan sisihan piawai yang baharu.` : `Masa larian sekumpulan murid mempunyai min ${m} minit, julat ${J} minit, julat antara kuartil ${Q} minit dan sisihan piawai ${s} minit. Selepas latihan, masa setiap murid berkurang ${k} minit. Cari nilai-nilai baharu itu.` }),
    ({ m, J, Q, s, opTxt, ans }) => { const N = vnama(); return Object.assign({ q: `Suatu set data mempunyai min ${m}, julat ${J}, julat antara kuartil ${Q} dan sisihan piawai ${s}. Setiap nilai ${opTxt}. ${N} berkata semua nilai itu turut berubah. Adakah ${N} betul?` }, salah(N, ans, 'Tambah atau tolak pemalar hanya mengubah min; sukatan serakan tidak berubah.')); }
  ],
  darabK: [
    ({ J, Q, s, opTxt }) => ({ q: `Suatu set data mempunyai julat ${J}, julat antara kuartil ${Q} dan sisihan piawai ${s}. Setiap nilai ${opTxt}. Cari julat, julat antara kuartil, sisihan piawai dan varians yang baharu.` }),
    ({ J, Q, s, opTxt }) => ({ q: `Julat = ${J}, julat antara kuartil = ${Q} dan sisihan piawai = ${s}. Jika setiap data ${opTxt}, tentukan julat, julat antara kuartil, sisihan piawai dan varians yang baharu.` }),
    ({ J, Q, s, k, mul }) => ({ q: mul ? `Jisim beberapa bungkusan mempunyai julat ${J} kg, julat antara kuartil ${Q} kg dan sisihan piawai ${s} kg. Setiap bungkusan digandakan ${k} kali jisimnya. Cari julat, julat antara kuartil, sisihan piawai dan varians yang baharu.` : `Panjang beberapa batang kayu mempunyai julat ${J} cm, julat antara kuartil ${Q} cm dan sisihan piawai ${s} cm. Setiap batang dipotong kepada ${k} bahagian yang sama panjang. Cari julat, julat antara kuartil, sisihan piawai dan varians bagi panjang satu bahagian.` }),
    ({ J, Q, s, opTxt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Suatu set data mempunyai julat ${J}, julat antara kuartil ${Q} dan sisihan piawai ${s}. Setiap nilai ${opTxt}. ${N} berkata varians baharu ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Varians berubah dengan faktor k², bukan k.')); }
  ],
  pencilanKenal: [
    ({ L }) => ({ q: `Kenal pasti pencilan dalam set data berikut. Sukatan serakan manakah, julat atau julat antara kuartil, lebih sesuai digunakan?<br>${L}` }),
    ({ L, ctx }) => ({ q: `Data berikut menunjukkan ${ctx}.<br>${L}<br>Nyatakan pencilan dan sukatan serakan yang paling sesuai.` }),
    ({ L }) => ({ q: `Set data ${L} mengandungi satu pencilan. Nyatakan pencilan itu dan terangkan sukatan serakan yang patut dipilih.` })
  ],
  gabungK: [
    ({ m, s, a, b }) => ({ q: `Min dan sisihan piawai suatu set data masing-masing ialah ${m} dan ${s}. Setiap nilai didarab ${a}, kemudian ditambah ${b}. Cari min, sisihan piawai dan varians yang baharu.` }),
    ({ m, s, a, b }) => ({ q: `Suatu set data mempunyai min ${m} dan sisihan piawai ${s}. Setiap data diubah kepada ${a}x + ${b}. Hitung min, sisihan piawai dan varians set data baharu.` }),
    ({ m, s, a, b }) => ({ q: `Markah suatu ujian mempunyai min ${m} dan sisihan piawai ${s}. Untuk penskalaan, setiap markah didarab ${a} dan ditambah ${b}. Tentukan min, sisihan piawai dan varians yang baharu.` })
  ],
  pencilanKira: [
    ({ L, X }) => ({ q: `Data: ${L}. Nilai ${X} ditambah ke dalam set data itu. Hitung julat dan julat antara kuartil sebelum dan selepas ${X} ditambah. Sukatan manakah lebih terjejas?` }),
    ({ L, X }) => ({ q: `Masa, dalam minit, beberapa orang murid menyiapkan tugasan ialah ${L}. Seorang murid lagi mengambil masa ${X} minit. Bandingkan julat dan julat antara kuartil sebelum dan selepas data ${X} ditambah.` }),
    ({ L, X }) => ({ q: `Set data ${L} ditambah satu pencilan, ${X}. Cari julat dan julat antara kuartil yang baharu dan nyatakan sukatan yang kurang terjejas.` })
  ],
  bandingMinSd: [
    ({ la, lb, LA, LB, nm }) => ({ q: `${vcap(nm)} ${la}: ${LA}<br>${vcap(nm)} ${lb}: ${LB}<br>Hitung min dan sisihan piawai bagi setiap set. Siapakah yang patut dipilih untuk mewakili sekolah jika jurulatih mahukan peserta yang konsisten?` }),
    ({ la, lb, LA, LB, nm }) => ({ q: `Data berikut ialah ${nm} ${la} dan ${lb}.<br>${la}: ${LA}<br>${lb}: ${LB}<br>Bandingkan min dan sisihan piawai, kemudian buat kesimpulan.` }),
    ({ la, lb, LA, LB }) => ({ q: `Dengan menggunakan min dan sisihan piawai, bandingkan prestasi ${la} (${LA}) dan ${lb} (${LB}).` })
  ],
  k824: [d => ({ q: d.q0, ans: d.a0, work: d.w0 }), d => ({ q: d.q1, ans: d.a1, work: d.w1 }), d => ({ q: d.q2, ans: d.a2, work: d.w2 })]
};

/* =================== penjana soalan =================== */
const SK = {};
SK.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };

/* ---------- 8.1.1 ---------- */
SK.plotJulat = (r) => {
  const c = r.p(SKPLOT), lo = r.i(0, 4), hi = lo + r.i(8, 10), n = r.i(9, 14);
  let d, mf; do { d = skData(r, n, lo, hi, 5); const cn = {}; d.forEach(v => (cn[v] = (cn[v] || 0) + 1)); mf = Math.max(...Object.values(cn)); } while (mf > 5 || mf === skJul(d));
  const ans = `Nilai terbesar = ${Math.max(...d)}, nilai terkecil = ${Math.min(...d)}, julat = ${skJul(d)}`;
  return GEN_LQ('plotJulat', { who: c.who, n, wrong: mf, ans, work: [`Baca titik paling kiri dan paling kanan pada plot.`].concat(skJulWork(d)) }, { fig: skDotFig(d, lo, hi, c.x, `Plot titik ${c.x.toLowerCase()}`) });
};
SK.bdBaca = (r, k) => {
  const c = r.p(SKBD), n = r.i(10, 14), d = skBDData(r, n), s = skSort(d);
  const kk = (k == null ? r.i(0, 3) : k) % 4;
  const what = ['nilai terbesar dan nilai terkecil', 'julat data itu', 'bilangan data dan julat', 'nilai terkecil dan julat'][kk];
  const ans = [`Nilai terbesar = ${s[n - 1]}${c.u}, nilai terkecil = ${s[0]}${c.u}`, `Julat = ${skJul(d)}${c.u}`, `Bilangan data = ${n}, julat = ${skJul(d)}${c.u}`, `Nilai terkecil = ${s[0]}${c.u}, julat = ${skJul(d)}${c.u}`][kk];
  const work = (kk === 2 ? [`Kira bilangan daun: n = ${n}`] : []).concat([`Nilai terkecil: batang pertama, daun pertama = ${s[0]}`, `Nilai terbesar: batang terakhir, daun terakhir = ${s[n - 1]}`], kk ? [`Julat = ${s[n - 1]} − ${s[0]} = ${skJul(d)}${c.u}`] : []);
  return skFixU(GEN_LQ('bdBaca', { nm: c.nm, who: c.who, what, ans, work }, { fig: skStemFig(d, `Plot batang-dan-daun ${c.nm}`, c.u) }), c.nm, c.u);
};
SK.bandingTitik = (r) => {
  const [la, lb] = r.p(SKDUA), c = r.p(SKPLOT), lo = r.i(0, 3), hi = lo + 10;
  let A, B; do { A = skData(r, r.i(8, 10), lo, hi, 4); B = skData(r, r.i(8, 10), lo, hi, 4); } while (Math.abs(skJul(A) - skJul(B)) < 3);
  const more = skJul(A) > skJul(B) ? la : lb, less = more === la ? lb : la;
  return GEN_LQ('bandingTitik', { la, lb, xl: c.x, ans: `Julat ${la} = ${skJul(A)}, julat ${lb} = ${skJul(B)}. Data ${more} lebih terserak; data ${less} lebih tertumpu.`,
    work: [`Julat ${la} = ${Math.max(...A)} − ${Math.min(...A)} = ${skJul(A)}`, `Julat ${lb} = ${Math.max(...B)} − ${Math.min(...B)} = ${skJul(B)}`, `Julat ${more} lebih besar, maka data ${more} lebih terserak.`] },
  { fig: skDot2Fig(A, B, lo, hi, la, lb, c.x) });
};
SK.binaBD = (r) => {
  const c = r.p(SKBD), n = r.i(10, 13), d = skShuf(r, skBDData(r, n)), st = skStems(d), ks = Object.keys(st).map(Number);
  const rows = []; for (let k = Math.min(...ks); k <= Math.max(...ks); k++) rows.push(`${k} | ${(st[k] || []).join(' ')}`);
  const v = vq('binaBD', { L: skL(d), nm: c.nm, who: c.who }), u = v.q.includes(c.nm) ? c.u : '';
  return { q: v.q, ans: `Julat = ${skJul(d)}${u}`, kind: 'lukis', work: ['Batang = digit puluh, daun = digit sa (disusun menaik):'].concat(rows, [`Kekunci: ${Math.min(...ks)} | ${st[Math.min(...ks)][0]} bermaksud ${Math.min(...ks) * 10 + st[Math.min(...ks)][0]}`, `Julat = ${Math.max(...d)} − ${Math.min(...d)} = ${skJul(d)}${u}`]), figAns: skStemFig(d, 'Plot batang-dan-daun (jawapan)', u) };
};
SK.binaTitik = (r) => {
  const c = r.p(SKCTX.slice(0, 2)), n = r.i(10, 14), lo = r.i(1, 4), hi = lo + r.i(6, 8);
  let d; do { d = skData(r, n, lo, hi, 5); } while (Math.max(...Object.values(d.reduce((o, v) => (o[v] = (o[v] || 0) + 1, o), {}))) > 5);
  const v = vq('binaTitik', { L: skL(d), ctx: c.t(n) });
  const s = skSort(d), mid = s.slice(Math.floor(n * .25), Math.ceil(n * .75));
  return { q: v.q, ans: `Julat = ${skJul(d)}`, kind: 'lukis', work: [`Lukis garis nombor dari ${Math.min(...d)} hingga ${Math.max(...d)} dan tandakan satu ● bagi setiap data.`].concat(skJulWork(d), [`Separuh data di tengah terletak antara ${mid[0]} dan ${mid[mid.length - 1]}.`]), figAns: skDotFig(d, Math.min(...d), Math.max(...d), '', 'Plot titik (jawapan)') };
};
SK.bandingBD = (r) => {
  const [la, lb] = r.p(SKDUA), c = r.p(SKBD);
  let A, B; do { A = skBDData(r, r.i(8, 10)); B = skBDData(r, r.i(8, 10)); } while (Math.abs(skJul(A) - skJul(B)) < 5 || Math.abs(Math.floor(Math.min(...A) / 10) - Math.floor(Math.min(...B) / 10)) > 1);
  const more = skJul(A) > skJul(B) ? la : lb, less = more === la ? lb : la;
  return skFixU(GEN_LQ('bandingBD', { la, lb, nm: c.nm, ans: `Julat ${la} = ${skJul(A)}${c.u}, julat ${lb} = ${skJul(B)}${c.u}. Data ${less} kurang terserak, maka lebih konsisten.`,
    work: [`${la}: ${Math.max(...A)} − ${Math.min(...A)} = ${skJul(A)}`, `${lb}: ${Math.max(...B)} − ${Math.min(...B)} = ${skJul(B)}`, `Julat ${less} lebih kecil → data ${less} lebih tertumpu dan konsisten; data ${more} lebih terserak.`] },
  { fig: skStem2Fig(A, B, la, lb) }), c.nm, c.u);
};
SK.k811 = (r, k) => {
  const d = {};
  // (0) daun tidak diketahui dalam plot batang-dan-daun, julat diberi
  let A; do { A = skBDData(r, 9); } while (skSort(A)[8] % 10 > 6);
  const s = skSort(A), top = s[8], st0 = Math.floor(top / 10), x = r.i(top % 10 + 1, 9), J = st0 * 10 + x - s[0];
  const A2 = s.slice(0, 8).concat([st0 * 10 + x]);
  d.q0 = `Data berikut menunjukkan markah 9 orang murid: ${skL(s.slice(0, 8))} dan ${st0}x, dengan ${st0}x ialah nombor dua digit yang mempunyai digit puluh ${st0} dan digit sa x. Diberi julat data ialah ${J} dan ${st0}x ialah markah tertinggi. (a) Cari nilai x. (b) Bina plot batang-dan-daun bagi data itu.`;
  d.a0 = `(a) x = ${x} (b) plot batang-dan-daun seperti jalan kerja`;
  const stA = skStems(A2), ksA = Object.keys(stA).map(Number);
  d.w0 = [`Markah tertinggi − ${s[0]} = ${J}`, `Markah tertinggi = ${J} + ${s[0]} = ${J + s[0]}, maka x = ${x}`].concat(ksA.map(kk => `${kk} | ${stA[kk].join(' ')}`), [`Kekunci: ${ksA[0]} | ${stA[ksA[0]][0]} bermaksud ${ksA[0] * 10 + stA[ksA[0]][0]}`]);
  d.f0 = '';
  // (1) tambah satu data supaya julat dua set sama
  let P, Q; do { P = skData(r, 8, 2, 9, 4); Q = skData(r, 8, 0, 12, 5); } while (skJul(Q) - skJul(P) < 3 || Math.max(...P) + (skJul(Q) - skJul(P)) > 14);
  const need = Math.max(...P) + skJul(Q) - skJul(P);
  d.q1 = `Plot titik di bawah menunjukkan bilangan buku yang dibaca oleh murid Kumpulan P dan Kumpulan Q. (a) Hitung julat setiap kumpulan. (b) Seorang murid baharu menyertai Kumpulan P dan julat Kumpulan P menjadi sama dengan julat Kumpulan Q. Murid itu membaca lebih banyak buku daripada semua murid lain dalam Kumpulan P. Berapakah bilangan buku yang dibacanya?`;
  d.f1 = skDot2Fig(P, Q, 0, 14, 'Kumpulan P', 'Kumpulan Q', 'Bilangan buku');
  d.a1 = `(a) Julat P = ${skJul(P)}, julat Q = ${skJul(Q)} (b) ${need} buah buku`;
  d.w1 = [`(a) Julat P = ${Math.max(...P)} − ${Math.min(...P)} = ${skJul(P)}`, `Julat Q = ${Math.max(...Q)} − ${Math.min(...Q)} = ${skJul(Q)}`, `(b) Nilai baharu − ${Math.min(...P)} = ${skJul(Q)}`, `Nilai baharu = ${skJul(Q)} + ${Math.min(...P)} = ${need}`];
  // (2) dua kelas: julat sama tetapi taburan berbeza
  let C1, C2; do { C1 = skData(r, 10, 3, 13, 6); const lo = Math.min(...C1), hi = Math.max(...C1); C2 = skShuf(r, skData(r, 8, lo + 1, hi - 1, 3).concat([lo, hi])); } while (skJul(C1) < 6 || Math.abs(skJak(C1) - skJak(C2)) < 2);
  const tA = skJak(C1) < skJak(C2) ? 'A' : 'B';
  d.q2 = `Plot titik di bawah menunjukkan skor 10 orang pemain Pasukan A dan 10 orang pemain Pasukan B. (a) Tunjukkan bahawa kedua-dua pasukan mempunyai julat yang sama. (b) Adakah julat sahaja cukup untuk membanding serakan? Gunakan julat antara kuartil untuk menentukan pasukan yang skornya lebih tertumpu.`;
  d.f2 = skDot2Fig(C1, C2, 2, 14, 'Pasukan A', 'Pasukan B', 'Skor');
  d.a2 = `(a) Julat A = julat B = ${skJul(C1)} (b) Tidak cukup. JAK A = ${skN(skJak(C1))}, JAK B = ${skN(skJak(C2))}, maka skor Pasukan ${tA} lebih tertumpu.`;
  d.w2 = [`(a) A: ${Math.max(...C1)} − ${Math.min(...C1)} = ${skJul(C1)}; B: ${Math.max(...C2)} − ${Math.min(...C2)} = ${skJul(C2)}`,
    `(b) A: ${SKQ1} = ${skN(skQ1(C1))}, ${SKQ3} = ${skN(skQ3(C1))}, JAK = ${skN(skJak(C1))}`,
    `B: ${SKQ1} = ${skN(skQ1(C2))}, ${SKQ3} = ${skN(skQ3(C2))}, JAK = ${skN(skJak(C2))}`,
    `Julat hanya menggunakan dua nilai. JAK yang lebih kecil menunjukkan 50% data di tengah lebih tertumpu.`];
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k811[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: d['f' + kk] || '' };
};

/* ---------- 8.2.1 ---------- */
SK.julat = (r) => {
  const c = r.p(SKCTX), n = r.i(6, 10);
  let d; do { d = skData(r, n, c.lo, c.hi, 5); } while (d[n - 1] - d[0] === skJul(d) || d[n - 1] - d[0] <= 0);
  return skFixU(GEN_LQ('julat', { L: skL(d), ctx: c.t(n), wrong: skN(d[n - 1] - d[0]), ans: `Julat = ${skN(skJul(d))}${c.u}`, work: skJulWork(d) }), c.t(n), c.u);
};
SK.kuartil = (r, k) => {
  const c = r.p(SKCTX), n = k == null ? r.i(7, 12) : [7, 8, 9, 10, 11, 12][k % 6], Q = (k == null ? r.f() < .5 : k % 2 === 0) ? SKQ1 : SKQ3;
  const d = skData(r, n, c.lo, c.hi, Math.min(n, 6)), val = Q === SKQ1 ? skQ1(d) : skQ3(d);
  const w = skQWork(d);
  return skFixU(GEN_LQ('kuartil', { L: skL(d), Q, ctx: c.t(n), ans: `${Q} = ${skN(val)}${c.u}`, work: Q === SKQ1 ? w.slice(0, 3) : [w[0], w[1], w[3]] }), c.t(n), c.u);
};
SK.jakS = (r, k) => {
  const c = r.p(SKCTX), n = k == null ? r.i(7, 12) : [8, 11, 9, 12, 7, 10][k % 6];
  const d = skData(r, n, c.lo, c.hi, Math.min(n, 6));
  return skFixU(GEN_LQ('jakS', { L: skL(d), ctx: c.t(n), wrong: skN(skQ1(d) + skQ3(d)), ans: `${SKQ1} = ${skN(skQ1(d))}, ${SKQ3} = ${skN(skQ3(d))}, julat antara kuartil = ${skN(skJak(d))}${c.u}`,
    work: skQWork(d).concat([`Julat antara kuartil = ${skN(skQ3(d))} − ${skN(skQ1(d))} = ${skN(skJak(d))}`]) }), c.t(n), c.u);
};
SK.jakBD = (r) => {
  const c = r.p(SKBD), n = r.i(11, 15), d = skBDData(r, n), s = skSort(d);
  return skFixU(GEN_LQ('jakBD', { nm: c.nm, who: c.who, n, ans: `Julat = ${skJul(d)}${c.u}, julat antara kuartil = ${skN(skJak(d))}${c.u}`,
    work: [`Julat = ${s[n - 1]} − ${s[0]} = ${skJul(d)}`, skMedLine(s), `Sebelum median: ${skHalfLine(skLow(d), SKQ1)}`, `Selepas median: ${skHalfLine(skUp(d), SKQ3)}`, `JAK = ${skN(skQ3(d))} − ${skN(skQ1(d))} = ${skN(skJak(d))}`] },
  { fig: skStemFig(d, `Plot batang-dan-daun ${c.nm}`, c.u) }), c.nm, c.u);
};
SK.cariJulat = (r) => {
  const n = r.i(5, 7);
  let d; do { d = skData(r, n - 1, 5, 30, n - 1); } while (new Set(d).size < n - 1);
  const mn = Math.min(...d), mx = Math.max(...d), J = r.i(skJul(d) + 2, Math.min(skJul(d) + 15, mx - 1));
  const all = skShuf(r, d.concat(['x'])), Lx = all.map(v => (v === 'x' ? 'x' : skN(v))).join(', ');
  const v = vq('cariJulat', { Lx, J }), big = /terbesar|lebih besar/.test(v.q), x = big ? mn + J : mx - J;
  return { q: v.q, ans: `x = ${x}`, work: big ? [`x ialah nilai terbesar, nilai terkecil = ${mn}`, `x − ${mn} = ${J}`, `x = ${J} + ${mn} = ${x}`] : [`x ialah nilai terkecil, nilai terbesar = ${mx}`, `${mx} − x = ${J}`, `x = ${mx} − ${J} = ${x}`] };
};
SK.bandingJak = (r) => {
  const [la, lb] = r.p(SKDUA), c = r.p(SKCTX);
  let A, B; do { A = skData(r, r.i(7, 9), c.lo, c.hi, 5); B = skData(r, r.i(7, 9), c.lo, c.hi, 5); } while (Math.abs(skJak(A) - skJak(B)) < 2);
  const less = skJak(A) < skJak(B) ? la : lb, more = less === la ? lb : la;
  const wA = skQWork(A), wB = skQWork(B);
  return GEN_LQ('bandingJak', { la, lb, LA: skL(A), LB: skL(B), nm: r.p(['markah kuiz', 'skor', 'masa, dalam minit,', 'jualan harian, dalam RM,']),
    ans: `JAK ${la} = ${skN(skJak(A))}, JAK ${lb} = ${skN(skJak(B))}. Data ${less} lebih tertumpu; data ${more} lebih terserak.`,
    work: [`${la}: ${wA[0].replace('Susun mengikut tertib menaik', 'susun')}`, `${SKQ1} = ${skN(skQ1(A))}, ${SKQ3} = ${skN(skQ3(A))}, JAK = ${skN(skJak(A))}`,
      `${lb}: ${wB[0].replace('Susun mengikut tertib menaik', 'susun')}`, `${SKQ1} = ${skN(skQ1(B))}, ${SKQ3} = ${skN(skQ3(B))}, JAK = ${skN(skJak(B))}`, `JAK ${less} lebih kecil, maka 50% data di tengah bagi ${less} lebih tertumpu.`] });
};
SK.k821 = (r, k) => {
  const d = {};
  // (0) JAK diberi, cari x (x ialah Q3 dalam set 7 data)
  let s0, x, J; do { s0 = skSort(skData(r, 6, 3, 30, 6)); x = r.i(s0[4] + 1, s0[5] - 1); } while (!(x > s0[4] && x < s0[5]) || new Set(s0).size < 6);
  const full = s0.slice(0, 5).concat([x, s0[5]]);
  J = x - full[1];
  d.q0 = `Data berikut telah disusun mengikut tertib menaik: ${skL(full.slice(0, 5))}, x, ${s0[5]}. Diberi julat antara kuartil ialah ${J}, cari nilai x. Seterusnya, hitung julat.`;
  d.a0 = `x = ${x}, julat = ${s0[5] - full[0]}`;
  d.w0 = [`n = 7, median = nilai ke-4 = ${full[3]}`, `${SKQ1} = nilai ke-2 = ${full[1]}, ${SKQ3} = nilai ke-6 = x`, `x − ${full[1]} = ${J}`, `x = ${x}`, `Julat = ${s0[5]} − ${full[0]} = ${s0[5] - full[0]}`];
  // (1) jadual kekerapan kecil (n = 4k + 3 supaya kedudukan jelas)
  let xs, fs, data; do { const lo = r.i(1, 3); xs = [0, 1, 2, 3, 4, 5].map(t => lo + t); fs = xs.map(() => r.i(1, 5)); data = []; xs.forEach((v, i) => { for (let t = 0; t < fs[i]; t++) data.push(v); }); } while (data.length % 4 !== 3 || data.length < 11);
  d.f1 = skTabFig('Bilangan adik-beradik', xs, fs);
  const n1 = data.length;
  d.q1 = `Jadual kekerapan di bawah menunjukkan bilangan adik-beradik bagi ${n1} orang murid. Cari julat, ${SKQ1}, ${SKQ3} dan julat antara kuartil.`;
  d.a1 = `Julat = ${skJul(data)}, ${SKQ1} = ${skN(skQ1(data))}, ${SKQ3} = ${skN(skQ3(data))}, julat antara kuartil = ${skN(skJak(data))}`;
  const cum = []; let t0 = 0; fs.forEach(f => { t0 += f; cum.push(t0); });
  d.w1 = [`Julat = ${Math.max(...data)} − ${Math.min(...data)} = ${skJul(data)}`, `n = ${n1}: median = nilai ke-${(n1 + 1) / 2}`, `Bahagian sebelum median ada ${(n1 - 1) / 2} data → ${SKQ1} = nilai ke-${(n1 + 1) / 4}`, `${SKQ3} = nilai ke-${3 * (n1 + 1) / 4}`, `Kekerapan longgokan: ${cum.join(', ')}`, `${SKQ1} = ${skN(skQ1(data))}, ${SKQ3} = ${skN(skQ3(data))}`, `JAK = ${skN(skQ3(data))} − ${skN(skQ1(data))} = ${skN(skJak(data))}`];
  // (2) julat lawan JAK apabila pencilan ditambah
  let D; do { D = skData(r, 7, 10, 25, 6); } while (new Set(D).size < 6);
  const X = Math.max(...D) + r.i(25, 40), D2 = D.concat([X]);
  d.q2 = `Masa, dalam saat, 7 orang peserta menyelesaikan suatu teka-teki ialah ${skL(D)}. Seorang peserta lagi mengambil masa ${X} saat. (a) Hitung julat dan julat antara kuartil bagi 7 orang peserta. (b) Hitung julat dan julat antara kuartil bagi 8 orang peserta. (c) Sukatan manakah lebih sesuai untuk mewakili serakan data 8 orang peserta? Beri sebab.`;
  d.a2 = `(a) Julat = ${skJul(D)}, JAK = ${skN(skJak(D))} (b) Julat = ${skJul(D2)}, JAK = ${skN(skJak(D2))} (c) Julat antara kuartil, kerana ${X} ialah pencilan yang menjejaskan julat dengan banyak.`;
  d.w2 = [`(a) ${skQWork(D)[0]}`, `Julat = ${skJul(D)}; ${SKQ1} = ${skN(skQ1(D))}, ${SKQ3} = ${skN(skQ3(D))}, JAK = ${skN(skJak(D))}`, `(b) ${skQWork(D2)[0]}`, `Julat = ${X} − ${Math.min(...D)} = ${skJul(D2)}; ${SKQ1} = ${skN(skQ1(D2))}, ${SKQ3} = ${skN(skQ3(D2))}, JAK = ${skN(skJak(D2))}`, `(c) Julat berubah ${skJul(D)} → ${skJul(D2)}, JAK hanya berubah ${skN(skJak(D))} → ${skN(skJak(D2))}.`];
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k821[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: d['f' + kk] || '' };
};

/* ---------- 8.2.2 ---------- */
SK.varS = (r, k) => {
  const c = r.p(SKCTX), n = k == null ? r.p([4, 5, 5, 6]) : [4, 5, 6][k % 3];
  let d, m, wrong; do { d = skVarData(r, n, c.lo, c.lo + 12); m = skMean(d); wrong = skSum(d.map(x => Math.abs(x - m))) / n; } while (Math.abs(wrong - skVar(d)) < 1e-9);
  return GEN_LQ('varS', { L: skL(d), ctx: c.t(n), wrong: skN(wrong), ans: `Varians = ${skN(skVar(d))}`, work: skVarWorkDef(d) });
};
SK.sdS = (r, k) => {
  const c = r.p(SKCTX), n = k == null ? r.p([4, 5, 5]) : [5, 4][k % 2];
  let d; do { d = skVarData(r, n, c.lo, c.lo + 12); } while (skVar(d) < 1.5);
  return GEN_LQ('sdS', { L: skL(d), ctx: c.t(n), wrong: skN(skVar(d)), ans: `Varians = ${skN(skVar(d))}, sisihan piawai = ${skSdT(skVar(d))}`, work: skVarWorkAlt(d) });
};
SK.dariJum = (r) => {
  let n, m, K, v; do { n = r.p([4, 5, 8, 10]); m = r.i(4, 20); K = r.i(n * 2, n * 30); v = K / n; } while (!skClean(v) || !skClean(skSdV(v)));
  const sx = n * m, sx2 = n * m * m + K;
  return GEN_LQ('dariJum', { n, sx, sx2, ans: `Min = ${m}, varians = ${skN(v)}, sisihan piawai = ${skSdT(v)}`,
    work: [`${SKXB} = ${fr(`Σx`, `N`)} = ${fr(`${sx}`, `${n}`)} = ${m}`, `${SKV} = ${fr(`Σx²`, `N`)} − ${SKXB}² = ${fr(`${sx2}`, `${n}`)} − ${m}²`, `= ${skN(sx2 / n)} − ${m * m} = ${skN(v)}`, `σ = ${rt(skN(v))} = ${skSdT(v)}`] });
};
SK.varJadual = (r) => {
  const ctxs = ['Bilangan adik-beradik', 'Bilangan buku dibaca', 'Bilangan gol', 'Saiz kasut'];
  let xs, fs, sf, sfx, sfx2, m, v; do {
    const lo = r.i(1, 5); xs = [0, 1, 2, 3, 4].map(t => lo + t); fs = xs.map(() => r.i(1, 9));
    sf = skSum(fs); sfx = skSum(xs.map((x, i) => x * fs[i])); sfx2 = skSum(xs.map((x, i) => x * x * fs[i])); m = sfx / sf; v = sfx2 / sf - m * m;
  } while (!Number.isInteger(m) || !skClean(sfx2 / sf) || !skClean(v));
  const x = r.p(ctxs);
  return GEN_LQ('varJadual', { x, ans: `Min = ${m}, varians = ${skN(v)}, sisihan piawai = ${skSdT(v)}`,
    work: [`Σf = ${skPlus(fs)} = ${sf}`, `Σfx = ${xs.map((t, i) => `${t}(${fs[i]})`).join(' + ')} = ${sfx}, ${SKXB} = ${fr(`${sfx}`, `${sf}`)} = ${m}`,
      `Σfx² = ${xs.map((t, i) => `${t}²(${fs[i]})`).join(' + ')} = ${sfx2}`, `${SKV} = ${fr(`${sfx2}`, `${sf}`)} − ${m}² = ${skN(sfx2 / sf)} − ${m * m} = ${skN(v)}`, `σ = ${rt(skN(v))} = ${skSdT(v)}`] },
  { fig: skTabFig(x, xs, fs) });
};
SK.bandingSd = (r) => {
  const [la, lb] = r.p(SKDUA), nm = r.p(['skor', 'masa, dalam saat,', 'jarak lontaran, dalam m,']);
  let A, B; do { A = skVarData(r, 5, 10, 20); B = skVarData(r, 5, 8, 24); } while (Math.abs(skVar(A) - skVar(B)) < 3);
  const less = skVar(A) < skVar(B) ? la : lb;
  return GEN_LQ('bandingSd', { la, lb, LA: skL(A), LB: skL(B), nm, ans: `σ ${la} = ${skSdT(skVar(A))}, σ ${lb} = ${skSdT(skVar(B))}. ${less} lebih konsisten (kurang terserak).`,
    work: [`${la}: ${SKXB} = ${skN(skMean(A))}, ${SKV} = ${fr(`${skN(skSq(A))}`, `5`)} − ${skN(skMean(A))}² = ${skN(skVar(A))}, σ = ${skSdT(skVar(A))}`,
      `${lb}: ${SKXB} = ${skN(skMean(B))}, ${SKV} = ${fr(`${skN(skSq(B))}`, `5`)} − ${skN(skMean(B))}² = ${skN(skVar(B))}, σ = ${skSdT(skVar(B))}`,
      `Sisihan piawai ${less} lebih kecil, maka data ${less} lebih tertumpu di sekitar min.`] });
};
SK.cariSumX2 = (r) => {
  const n = r.i(5, 12), m = r.i(5, 25), s = r.i(2, 6), v = s * s;
  const q = vq('cariSumX2', { n, m, s, v });
  const sx2 = n * (v + m * m);
  return { q: q.q, ans: /Σx dan/.test(q.q) ? `Σx = ${n * m}, Σx² = ${sx2}` : `Σx² = ${sx2}`,
    work: [`Σx = N × ${SKXB} = ${n} × ${m} = ${n * m}`, `${SKV} = ${v}`, `${fr(`Σx²`, `${n}`)} − ${m}² = ${v}`, `${fr(`Σx²`, `${n}`)} = ${v + m * m}`, `Σx² = ${n} × ${v + m * m} = ${sx2}`] };
};
SK.k822 = (r, k) => {
  const d = {};
  // (0) cari x daripada min, kemudian sisihan piawai
  let D, x, j; do { D = skVarData(r, 5, 4, 16); j = r.i(0, 4); x = D[j]; } while (D.filter(t => t === x).length > 1);
  const Lx = D.map((t, i) => (i === j ? 'x' : skN(t))).join(', '), m = skMean(D), rest = D.filter((_, i) => i !== j);
  d.q0 = `Min bagi set data ${Lx} ialah ${m}. (a) Cari nilai x. (b) Hitung sisihan piawai set data itu.`;
  d.a0 = `(a) x = ${x} (b) σ = ${skSdT(skVar(D))}`;
  d.w0 = [`(a) ${skPlus(rest)} + x = ${m} × 5 = ${5 * m}`, `x = ${5 * m} − ${skSum(rest)} = ${x}`].concat(skVarWorkAlt(D).slice(1).map((w, i) => (i ? '' : '(b) ') + w));
  // (1) gabung dua kumpulan
  let nA, nB, mA, mB, vA, vB, N, SX, SX2, M, V; do {
    nA = r.p([4, 5, 6]); nB = r.p([4, 5, 6]); mA = r.i(8, 15); mB = r.i(8, 15); vA = r.i(2, 9); vB = r.i(2, 9);
    N = nA + nB; SX = nA * mA + nB * mB; SX2 = nA * (vA + mA * mA) + nB * (vB + mB * mB); M = SX / N; V = SX2 / N - M * M;
  } while (!Number.isInteger(M) || !skClean(V) || !skClean(SX2 / N) || mA === mB);
  d.q1 = `Kumpulan A terdiri daripada ${nA} orang murid dengan min skor ${mA} dan varians ${vA}. Kumpulan B terdiri daripada ${nB} orang murid dengan min skor ${mB} dan varians ${vB}. Hitung min dan sisihan piawai skor bagi gabungan kedua-dua kumpulan.`;
  d.a1 = `Min = ${M}, sisihan piawai = ${skSdT(V)}`;
  d.w1 = [`A: Σx = ${nA} × ${mA} = ${nA * mA}, Σx² = ${nA}(${vA} + ${mA}²) = ${nA * (vA + mA * mA)}`, `B: Σx = ${nB} × ${mB} = ${nB * mB}, Σx² = ${nB}(${vB} + ${mB}²) = ${nB * (vB + mB * mB)}`,
    `Gabungan: N = ${N}, Σx = ${SX}, Σx² = ${SX2}`, `${SKXB} = ${fr(`${SX}`, `${N}`)} = ${M}`, `${SKV} = ${fr(`${SX2}`, `${N}`)} − ${M}² = ${skN(SX2 / N)} − ${M * M} = ${skN(V)}`, `σ = ${rt(skN(V))} = ${skSdT(V)}`];
  // (2) buang satu nilai
  let n2, m2, v2, y, SXa, SX2a, M2, V2; do {
    n2 = r.p([6, 8, 9, 11]); m2 = r.i(10, 20); v2 = r.i(3, 12); y = r.i(m2 - 6, m2 + 8);
    SXa = n2 * m2; SX2a = n2 * (v2 + m2 * m2); M2 = (SXa - y) / (n2 - 1); V2 = (SX2a - y * y) / (n2 - 1) - M2 * M2;
  } while (!Number.isInteger(M2) || !skClean(V2) || !skClean((SX2a - y * y) / (n2 - 1)) || V2 <= 0 || y === m2);
  d.q2 = `Min dan varians bagi ${n2} nombor masing-masing ialah ${m2} dan ${v2}. (a) Cari Σx dan Σx². (b) Nombor ${y} dikeluarkan daripada set itu. Hitung min dan varians bagi nombor yang tinggal.`;
  d.a2 = `(a) Σx = ${SXa}, Σx² = ${SX2a} (b) Min = ${M2}, varians = ${skN(V2)}`;
  d.w2 = [`(a) Σx = ${n2} × ${m2} = ${SXa}`, `Σx² = ${n2}(${v2} + ${m2}²) = ${SX2a}`, `(b) Σx baharu = ${SXa} − ${y} = ${SXa - y}, Σx² baharu = ${SX2a} − ${y}² = ${SX2a - y * y}`, `${SKXB} = ${fr(`${SXa - y}`, `${n2 - 1}`)} = ${M2}`, `${SKV} = ${fr(`${SX2a - y * y}`, `${n2 - 1}`)} − ${M2}² = ${skN(V2)}`];
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k822[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: '' };
};

/* ---------- 8.2.3 ---------- */
const SKWHAT = [['median', 2], ['kuartil pertama, Q<sub>1</sub>', 1], ['kuartil ketiga, Q<sub>3</sub>', 3], ['nilai minimum dan nilai maksimum', -1], ['median dan Q<sub>3</sub>', -2]];
SK.bacaKotak = (r, k) => {
  const c = r.p(SKBOX), v = skFive(r, c), [what, i] = SKWHAT[(k == null ? r.i(0, 4) : k) % 5];
  const ans = i >= 0 ? `${vcap(what.replace(/, Q<sub>\d<\/sub>/, ''))} = ${skN(v[i])}${c.u}` : i === -1 ? `Nilai minimum = ${v[0]}${c.u}, nilai maksimum = ${v[4]}${c.u}` : `Median = ${v[2]}${c.u}, Q<sub>3</sub> = ${v[3]}${c.u}`;
  return GEN_LQ('bacaKotak', { nm: c.nm, who: c.who, what, ans, work: [`Lima nilai plot kotak: minimum ${v[0]}, Q<sub>1</sub> ${v[1]}, median ${v[2]}, Q<sub>3</sub> ${v[3]}, maksimum ${v[4]}`, i === 2 || i === -2 ? 'Median ialah garis di dalam kotak.' : i === -1 ? 'Nilai minimum dan maksimum ialah hujung misai.' : 'Q<sub>1</sub> ialah tepi kiri kotak dan Q<sub>3</sub> ialah tepi kanan kotak.'] },
  { fig: skBoxFig([{ v }], c.lo, c.hi, c.st, c.x, `Plot kotak ${c.nm}`) });
};
SK.julatKotak = (r) => {
  const c = r.p(SKBOX), v = skFive(r, c);
  return GEN_LQ('julatKotak', { nm: c.nm, who: c.who, wrong: skN(v[4] - v[0]), ans: `Julat = ${v[4] - v[0]}${c.u}, julat antara kuartil = ${v[3] - v[1]}${c.u}`,
    work: [`Minimum = ${v[0]}, maksimum = ${v[4]} → julat = ${v[4]} − ${v[0]} = ${v[4] - v[0]}`, `Q<sub>1</sub> = ${v[1]}, Q<sub>3</sub> = ${v[3]} → JAK = ${v[3]} − ${v[1]} = ${v[3] - v[1]}`] },
  { fig: skBoxFig([{ v }], c.lo, c.hi, c.st, c.x, `Plot kotak ${c.nm}`) });
};
SK.limaNilai = (r, k) => {
  const c = r.p(SKCTX), n = k == null ? r.i(7, 12) : [9, 10, 11, 8][k % 4], d = skData(r, n, c.lo, c.hi, Math.min(n, 6)), f = skFiveOf(d);
  return GEN_LQ('limaNilai', { L: skL(d), ctx: c.t(n), ans: `Minimum = ${skN(f[0])}, ${SKQ1} = ${skN(f[1])}, median = ${skN(f[2])}, ${SKQ3} = ${skN(f[3])}, maksimum = ${skN(f[4])}`,
    work: skQWork(d).concat([`Nilai minimum = ${skN(f[0])}, nilai maksimum = ${skN(f[4])}`]) });
};
SK.binaKotak = (r) => {
  const c = r.p(SKCTX), n = r.i(9, 12), d = skData(r, n, c.lo, c.hi, 6), f = skFiveOf(d);
  const lo = Math.floor(f[0] / 2) * 2 - 2, hi = Math.ceil(f[4] / 2) * 2 + 2;
  const v = vq('binaKotak', { L: skL(d), ctx: c.t(n) });
  return { q: v.q, ans: `Minimum = ${skN(f[0])}, ${SKQ1} = ${skN(f[1])}, median = ${skN(f[2])}, ${SKQ3} = ${skN(f[3])}, maksimum = ${skN(f[4])}; JAK = ${skN(f[3] - f[1])}`, kind: 'lukis',
    work: skQWork(d).concat([`Lukis garis nombor berskala dari ${lo} hingga ${hi}.`, `Lukis kotak dari ${skN(f[1])} hingga ${skN(f[3])}, garis median pada ${skN(f[2])}, dan misai ke ${skN(f[0])} dan ${skN(f[4])}.`]),
    figAns: skBoxFig([{ v: f }], lo, hi, 1, '', 'Plot kotak (jawapan)') };
};
SK.bandingKotak = (r) => {
  const [la, lb] = r.p(SKDUA), c = r.p(SKBOX);
  let A, B; do { A = skFive(r, c); B = skFive(r, c); } while (A[2] === B[2] || Math.abs((A[3] - A[1]) - (B[3] - B[1])) < 2 * c.st);
  const hiM = A[2] > B[2] ? la : lb, lessQ = (A[3] - A[1]) < (B[3] - B[1]) ? la : lb;
  return GEN_LQ('bandingKotak', { la, lb, nm: c.nm, ans: `Median ${la} = ${A[2]}, median ${lb} = ${B[2]}; JAK ${la} = ${A[3] - A[1]}, JAK ${lb} = ${B[3] - B[1]}. ${hiM} mempunyai median lebih tinggi; ${lessQ} lebih konsisten (JAK lebih kecil).`,
    work: [`${la}: median = ${A[2]}, JAK = ${A[3]} − ${A[1]} = ${A[3] - A[1]}, julat = ${A[4] - A[0]}`, `${lb}: median = ${B[2]}, JAK = ${B[3]} − ${B[1]} = ${B[3] - B[1]}, julat = ${B[4] - B[0]}`, `Kotak yang lebih pendek (JAK kecil) bermakna 50% data di tengah lebih tertumpu.`] },
  { fig: skBoxFig([{ v: A, lab: la, c: 'tr' }, { v: B, lab: lb, c: 'pa' }], c.lo, c.hi, c.st, c.x, `Plot kotak ${la} dan ${lb}`) });
};
SK.peratus = (r, k) => {
  const c = r.p(SKBOX), v = skFive(r, c), N = r.p([40, 60, 80, 100, 120, 200]);
  const opts = [[`mencatat nilai lebih daripada ${v[3]}${c.u}`, 25, `Lebih daripada ${SKQ3}: kira-kira 25% data`], [`mencatat nilai antara ${v[1]}${c.u} dan ${v[3]}${c.u}`, 50, `Antara ${SKQ1} dan ${SKQ3}: kira-kira 50% data`],
    [`mencatat nilai kurang daripada ${v[2]}${c.u}`, 50, 'Kurang daripada median: kira-kira 50% data'], [`mencatat nilai lebih daripada ${v[1]}${c.u}`, 75, `Lebih daripada ${SKQ1}: kira-kira 75% data`], [`mencatat nilai kurang daripada ${v[1]}${c.u}`, 25, `Kurang daripada ${SKQ1}: kira-kira 25% data`]];
  const [what, p, w] = opts[(k == null ? r.i(0, 4) : k) % 5], a = p * N / 100;
  return GEN_LQ('peratus', { N, who: c.who, what, ans: `Kira-kira ${a} orang`, work: [`Lima nilai: ${v.join(', ')}`, w, `${p}% × ${N} = ${a} orang`] },
  { fig: skBoxFig([{ v }], c.lo, c.hi, c.st, c.x, `Plot kotak ${c.nm}`) });
};
SK.k823 = (r, k) => {
  const d = {};
  // (0) plot batang-dan-daun → plot kotak
  const D = skBDData(r, 15), f = skFiveOf(D);
  d.f0 = skStemFig(D, 'Plot batang-dan-daun jisim 15 orang murid', ' kg');
  d.q0 = `Plot batang-dan-daun di bawah menunjukkan jisim, dalam kg, 15 orang murid. (a) Cari ${SKQ1}, median dan ${SKQ3}. (b) Bina plot kotak bagi data itu. (c) Hitung julat antara kuartil.`;
  d.a0 = `(a) ${SKQ1} = ${skN(f[1])} kg, median = ${skN(f[2])} kg, ${SKQ3} = ${skN(f[3])} kg (b) plot kotak (c) JAK = ${skN(f[3] - f[1])} kg`;
  d.w0 = [`(a) n = 15: median = nilai ke-8 = ${skN(f[2])}`, `${SKQ1} = nilai ke-4 = ${skN(f[1])}, ${SKQ3} = nilai ke-12 = ${skN(f[3])}`, `(b) Minimum = ${f[0]}, maksimum = ${f[4]}; lukis kotak dari ${skN(f[1])} hingga ${skN(f[3])} dengan garis median pada ${skN(f[2])}`, `(c) JAK = ${skN(f[3])} − ${skN(f[1])} = ${skN(f[3] - f[1])} kg`];
  // (1) plot kotak + data dengan nilai hilang
  let s, x; do { s = skSort(skData(r, 11, 10, 40, 9)); } while (new Set(s).size < 10 || s[8] - s[7] < 2);
  x = s[8]; const shown = s.map((t, i) => (i === 8 ? 'x' : skN(t))).join(', ');
  const f1 = skFiveOf(s);
  d.q1 = `Data berikut telah disusun mengikut tertib menaik: ${shown}. Diberi julat antara kuartil ialah ${skN(f1[3] - f1[1])}. (a) Cari nilai x. (b) Nyatakan lima nilai untuk membina plot kotak.`;
  d.a1 = `(a) x = ${x} (b) ${skN(f1[0])}, ${skN(f1[1])}, ${skN(f1[2])}, ${skN(f1[3])}, ${skN(f1[4])}`;
  d.w1 = [`(a) n = 11: median = nilai ke-6 = ${s[5]}`, `${SKQ1} = nilai ke-3 = ${s[2]}, ${SKQ3} = nilai ke-9 = x`, `x − ${s[2]} = ${skN(f1[3] - f1[1])}, maka x = ${x}`, `(b) Minimum ${s[0]}, ${SKQ1} ${s[2]}, median ${s[5]}, ${SKQ3} ${x}, maksimum ${s[10]}`];
  // (2) banding dua plot kotak dengan pencilan
  const c = SKBOX[0];
  let A, B; do { A = skFive(r, c); B = skFive(r, c); } while (Math.abs((A[3] - A[1]) - (B[3] - B[1])) < 10 || (A[4] - A[0]) === (B[4] - B[0]) || Math.sign((A[4] - A[0]) - (B[4] - B[0])) === Math.sign((A[3] - A[1]) - (B[3] - B[1])));
  d.f2 = skBoxFig([{ v: A, lab: 'Kelas A', c: 'tr' }, { v: B, lab: 'Kelas B', c: 'pa' }], c.lo, c.hi, c.st, 'Markah');
  const jA = A[4] - A[0], jB = B[4] - B[0], qA = A[3] - A[1], qB = B[3] - B[1];
  d.q2 = `Plot kotak di bawah menunjukkan markah ujian Kelas A dan Kelas B. (a) Hitung julat dan julat antara kuartil bagi setiap kelas. (b) Kelas manakah lebih terserak jika dinilai menggunakan julat? Menggunakan julat antara kuartil? (c) Sukatan manakah lebih baik untuk membanding serakan jika terdapat pencilan? Terangkan.`;
  d.a2 = `(a) A: julat ${jA}, JAK ${qA}; B: julat ${jB}, JAK ${qB} (b) Julat: Kelas ${jA > jB ? 'A' : 'B'}; JAK: Kelas ${qA > qB ? 'A' : 'B'} (c) Julat antara kuartil, kerana tidak dipengaruhi nilai minimum atau maksimum yang mungkin pencilan.`;
  d.w2 = [`(a) A: ${A[4]} − ${A[0]} = ${jA}; ${A[3]} − ${A[1]} = ${qA}`, `B: ${B[4]} − ${B[0]} = ${jB}; ${B[3]} − ${B[1]} = ${qB}`, `(b) Dua sukatan memberi kesimpulan berbeza kerana julat bergantung pada nilai ekstrem.`, `(c) JAK mengukur serakan 50% data di tengah.`];
  const kk = (k == null ? r.i(0, 2) : k) % 3, v = QV.k823[kk](d);
  return { q: v.q, ans: v.ans, work: v.work, fig: d['f' + kk] || '' };
};

/* ---------- 8.2.4 ---------- */
function skStat(r) {
  const s = r.i(2, 9), Q = s + r.i(1, 5), J = Q + r.i(4, 15), m = r.i(20, 60) + (r.f() < .3 ? .5 : 0);
  return { s, Q, J, m };
}
SK.tambahK = (r, i) => {
  const add = i == null ? r.f() < .55 : i % 2 === 0, k = r.i(2, 9), S = skStat(r), opTxt = add ? `ditambah ${k}` : `ditolak ${k}`;
  const nm = skN(add ? S.m + k : S.m - k), ans = `Min = ${nm}, julat = ${S.J}, julat antara kuartil = ${S.Q}, sisihan piawai = ${S.s}`;
  const v = vq('tambahK', { m: skN(S.m), J: S.J, Q: S.Q, s: S.s, k, add, opTxt, ans });
  return { q: v.q, ans: v.ans, work: (v.work.length && /Tambah atau tolak pemalar hanya/.test(v.work[0]) ? [v.work[0]] : []).concat([`Min ${opTxt}: ${skN(S.m)} ${add ? '+' : '−'} ${k} = ${nm}`, `Setiap nilai beralih sejauh ${k}, jarak antara data tidak berubah.`, `Julat = ${S.J}, julat antara kuartil = ${S.Q}, sisihan piawai = ${S.s} (tidak berubah)`]) };
};
SK.darabK = (r, i) => {
  const mul = i == null ? r.f() < .55 : i % 2 === 0, k = mul ? r.i(2, 5) : r.p([2, 4, 5]);
  let S; do { S = skStat(r); } while (!mul && ![S.J, S.Q, S.s].every(t => skClean(t / k) && skClean((t / k) * (t / k))));
  const f = t => (mul ? t * k : t / k), opTxt = mul ? `didarab ${k}` : `dibahagi ${k}`, sym = mul ? '×' : '÷';
  const sn = f(S.s), ans = `Julat = ${skN(f(S.J))}, julat antara kuartil = ${skN(f(S.Q))}, sisihan piawai = ${skN(sn)}, varians = ${skN(sn * sn)}`;
  const v = vq('darabK', { J: S.J, Q: S.Q, s: S.s, k, mul, opTxt, wrong: skN(mul ? S.s * S.s * k : S.s * S.s / k), ans });
  return { q: v.q, ans: v.ans, work: (/faktor k²/.test(v.work[0] || '') ? [v.work[0]] : []).concat([`Julat = ${S.J} ${sym} ${k} = ${skN(f(S.J))}`, `Julat antara kuartil = ${S.Q} ${sym} ${k} = ${skN(f(S.Q))}`, `Sisihan piawai = ${S.s} ${sym} ${k} = ${skN(sn)}`, `Varians = ${skN(sn)}² = ${skN(sn * sn)} (atau ${S.s * S.s} ${sym} ${k}²)`]) };
};
SK.pencilanKenal = (r) => {
  const c = r.p([SKCTX[0], SKCTX[3], SKCTX[6], SKCTX[7]]), n = r.i(7, 9);
  const d = skData(r, n - 1, c.lo, c.lo + 8, 5), X = Math.max(...d) + r.i(20, 40);
  const all = skShuf(r, d.concat([X]));
  return GEN_LQ('pencilanKenal', { L: skL(all), ctx: c.t(n), ans: `Pencilan = ${X}${c.u}. Julat antara kuartil lebih sesuai.`,
    work: [`Data lain terletak antara ${Math.min(...d)} dan ${Math.max(...d)}; ${X} jauh lebih besar, maka ${X} ialah pencilan.`, `Julat = ${X} − ${Math.min(...d)} = ${X - Math.min(...d)} (terjejas oleh pencilan)`, `JAK = ${skN(skQ3(all))} − ${skN(skQ1(all))} = ${skN(skJak(all))} (tidak menggunakan nilai ekstrem)`, 'Maka julat antara kuartil lebih sesuai.'] });
};
SK.gabungK = (r) => {
  const a = r.i(2, 5), b = r.i(1, 20), m = r.i(10, 40), s = r.i(2, 8);
  return GEN_LQ('gabungK', { a, b, m, s, ans: `Min = ${a * m + b}, sisihan piawai = ${a * s}, varians = ${a * a * s * s}`,
    work: [`Min baharu = ${a}(${m}) + ${b} = ${a * m + b}`, `Darab ${a}: sisihan piawai = ${a} × ${s} = ${a * s}`, `Tambah ${b}: tiada kesan pada sisihan piawai`, `Varians = ${a * s}² = ${a * a * s * s}`] });
};
SK.pencilanKira = (r) => {
  const n = r.p([6, 7, 8]);
  let d, X; do { d = skData(r, n, 8, 25, 5); X = Math.max(...d) + r.i(20, 45); } while (skJak(d.concat([X])) === skJak(d) && r.f() < .2);
  const d2 = d.concat([X]);
  return GEN_LQ('pencilanKira', { L: skL(d), X, ans: `Sebelum: julat = ${skJul(d)}, JAK = ${skN(skJak(d))}. Selepas: julat = ${skJul(d2)}, JAK = ${skN(skJak(d2))}. Julat lebih terjejas.`,
    work: [`Sebelum: ${skQWork(d)[0]}`, `Julat = ${skJul(d)}, ${SKQ1} = ${skN(skQ1(d))}, ${SKQ3} = ${skN(skQ3(d))}, JAK = ${skN(skJak(d))}`, `Selepas: ${skQWork(d2)[0]}`, `Julat = ${X} − ${Math.min(...d)} = ${skJul(d2)}, ${SKQ1} = ${skN(skQ1(d2))}, ${SKQ3} = ${skN(skQ3(d2))}, JAK = ${skN(skJak(d2))}`, `Julat berubah sebanyak ${skJul(d2) - skJul(d)}, JAK berubah sebanyak ${skN(Math.abs(skJak(d2) - skJak(d)))}.`] });
};
SK.bandingMinSd = (r) => {
  const [la, lb] = r.p(SKDUA.slice(3)), nm = r.p(['skor lontar peluru, dalam m,', 'markah kuiz', 'masa larian 100 m, dalam saat,']);
  let A, B; do { A = skVarData(r, 5, 10, 18); B = skVarData(r, 5, 8, 22); } while (Math.abs(skVar(A) - skVar(B)) < 4 || Math.abs(skMean(A) - skMean(B)) > 2);
  const less = skVar(A) < skVar(B) ? la : lb;
  return GEN_LQ('bandingMinSd', { la, lb, LA: skL(A), LB: skL(B), nm,
    ans: `${la}: min = ${skN(skMean(A))}, σ = ${skSdT(skVar(A))}; ${lb}: min = ${skN(skMean(B))}, σ = ${skSdT(skVar(B))}. ${less} lebih konsisten kerana sisihan piawai lebih kecil.`,
    work: [`${la}: ${SKXB} = ${fr(`${skSum(A)}`, `5`)} = ${skN(skMean(A))}, ${SKV} = ${fr(`${skN(skSq(A))}`, `5`)} − ${skN(skMean(A))}² = ${skN(skVar(A))}, σ = ${skSdT(skVar(A))}`,
      `${lb}: ${SKXB} = ${fr(`${skSum(B)}`, `5`)} = ${skN(skMean(B))}, ${SKV} = ${fr(`${skN(skSq(B))}`, `5`)} − ${skN(skMean(B))}² = ${skN(skVar(B))}, σ = ${skSdT(skVar(B))}`,
      `Min hampir sama. Sisihan piawai ${less} lebih kecil, maka ${less} lebih konsisten.`] });
};
SK.k824 = (r, k) => {
  const d = {};
  // (0) tambah satu nombor kepada Σx, Σx²
  let n, m, v, y, M, V; do { n = r.p([5, 7, 9, 11]); m = r.i(6, 15); v = r.i(2, 10); y = r.i(m - 5, m + 15); M = (n * m + y) / (n + 1); V = (n * (v + m * m) + y * y) / (n + 1) - M * M; } while (!Number.isInteger(M) || !skClean(V) || !skClean((n * (v + m * m) + y * y) / (n + 1)) || y === m);
  const SX = n * m, SX2 = n * (v + m * m);
  d.q0 = `Bagi ${n} nombor, Σx = ${SX} dan Σx² = ${SX2}. (a) Hitung min dan varians. (b) Nombor ${y} ditambah ke dalam set itu. Hitung min dan varians yang baharu. (c) Adakah set data baharu lebih terserak? Terangkan.`;
  d.a0 = `(a) Min = ${m}, varians = ${v} (b) Min = ${M}, varians = ${skN(V)} (c) ${V > v ? 'Ya, varians bertambah' : 'Tidak, varians berkurang'}`;
  d.w0 = [`(a) ${SKXB} = ${fr(`${SX}`, `${n}`)} = ${m}; ${SKV} = ${fr(`${SX2}`, `${n}`)} − ${m}² = ${v}`, `(b) Σx = ${SX} + ${y} = ${SX + y}, Σx² = ${SX2} + ${y}² = ${SX2 + y * y}`, `${SKXB} = ${fr(`${SX + y}`, `${n + 1}`)} = ${M}`, `${SKV} = ${fr(`${SX2 + y * y}`, `${n + 1}`)} − ${M}² = ${skN(V)}`, `(c) Varians ${v} → ${skN(V)}`];
  // (1) penskalaan ax + b dan Σx²
  const a = r.i(2, 4), b = r.i(1, 10), m1 = r.i(5, 15), s1 = r.i(2, 5), n1 = r.p([10, 20, 25]);
  const M1 = a * m1 + b, S1 = a * s1;
  d.q1 = `Suatu set ${n1} data mempunyai min ${m1} dan sisihan piawai ${s1}. Setiap data didarab ${a}, kemudian ditambah ${b}. (a) Cari min dan sisihan piawai set data baharu. (b) Hitung Σx² bagi set data baharu.`;
  d.a1 = `(a) Min = ${M1}, sisihan piawai = ${S1} (b) Σx² = ${n1 * (S1 * S1 + M1 * M1)}`;
  d.w1 = [`(a) Min = ${a}(${m1}) + ${b} = ${M1}`, `Sisihan piawai = ${a} × ${s1} = ${S1} (tambah ${b} tiada kesan)`, `(b) ${SKV} = ${S1}² = ${S1 * S1}`, `${fr(`Σx²`, `${n1}`)} − ${M1}² = ${S1 * S1}`, `Σx² = ${n1}(${S1 * S1} + ${M1 * M1}) = ${n1 * (S1 * S1 + M1 * M1)}`];
  // (2) pilih wakil: min dan σ dua atlet
  let A, B; do { A = skVarData(r, 5, 11, 17); B = skVarData(r, 5, 10, 20); } while (skMean(B) <= skMean(A) || skVar(B) <= skVar(A) + 3 || skMean(B) - skMean(A) > 2);
  d.q2 = `Masa, dalam saat, bagi 5 larian Atlet P ialah ${skL(A)} dan bagi Atlet Q ialah ${skL(B)}. (a) Hitung min dan sisihan piawai masa setiap atlet. (b) Masa yang lebih singkat adalah lebih baik. Atlet manakah patut dipilih? Wajarkan jawapan anda menggunakan min dan sisihan piawai.`;
  d.a2 = `(a) P: min = ${skN(skMean(A))} s, σ = ${skSdT(skVar(A))} s; Q: min = ${skN(skMean(B))} s, σ = ${skSdT(skVar(B))} s (b) Atlet P, kerana min masanya lebih singkat dan sisihan piawainya lebih kecil (lebih konsisten).`;
  d.w2 = [`(a) P: ${SKXB} = ${fr(`${skSum(A)}`, `5`)} = ${skN(skMean(A))}, ${SKV} = ${fr(`${skN(skSq(A))}`, `5`)} − ${skN(skMean(A))}² = ${skN(skVar(A))}, σ = ${skSdT(skVar(A))}`, `Q: ${SKXB} = ${fr(`${skSum(B)}`, `5`)} = ${skN(skMean(B))}, ${SKV} = ${fr(`${skN(skSq(B))}`, `5`)} − ${skN(skMean(B))}² = ${skN(skVar(B))}, σ = ${skSdT(skVar(B))}`, `(b) Min P < min Q dan σ P < σ Q.`];
  const kk = (k == null ? r.i(0, 2) : k) % 3, v2 = QV.k824[kk](d);
  return { q: v2.q, ans: v2.ans, work: v2.work, fig: '' };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '8.1.1': {
    m: [() => SK.plotJulat(skRG), () => SK.bdBaca(skRG), () => SK.bandingTitik(skRG), () => SK.bs(skRG, SKBS1)],
    s: [() => SK.binaBD(skRG), () => SK.bandingBD(skRG), () => SK.binaTitik(skRG)],
    k: [() => SK.k811(skRG)]
  },
  '8.2.1': {
    m: [() => SK.julat(skRG), () => SK.kuartil(skRG), () => SK.jakS(skRG)],
    s: [() => SK.jakBD(skRG), () => SK.cariJulat(skRG), () => SK.bandingJak(skRG)],
    k: [() => SK.k821(skRG)]
  },
  '8.2.2': {
    m: [() => SK.varS(skRG), () => SK.sdS(skRG), () => SK.dariJum(skRG), () => SK.bs(skRG, SKBS2)],
    s: [() => SK.varJadual(skRG), () => SK.bandingSd(skRG), () => SK.cariSumX2(skRG)],
    k: [() => SK.k822(skRG)]
  },
  '8.2.3': {
    m: [() => SK.bacaKotak(skRG), () => SK.julatKotak(skRG), () => SK.limaNilai(skRG), () => SK.bs(skRG, SKBS3)],
    s: [() => SK.binaKotak(skRG), () => SK.bandingKotak(skRG), () => SK.peratus(skRG)],
    k: [() => SK.k823(skRG)]
  },
  '8.2.4': {
    m: [() => SK.tambahK(skRG), () => SK.darabK(skRG), () => SK.pencilanKenal(skRG), () => SK.bs(skRG, SKBS4)],
    s: [() => SK.gabungK(skRG), () => SK.pencilanKira(skRG), () => SK.bandingMinSd(skRG)],
    k: [() => SK.k824(skRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 8.1.1
WG.plotJulat = () => SK.plotJulat(skRW);
WG.bdBaca = i => SK.bdBaca(skRW, i);
WG.bandingTitik = () => SK.bandingTitik(skRW);
WG.bs1 = i => SK.bs(skRW, SKBS1, [1, 5, 6][i % 3]);
WG.binaBD = () => SK.binaBD(skRW);
WG.bandingBD = () => SK.bandingBD(skRW);
WG.binaTitik = () => SK.binaTitik(skRW);
WG.k811 = i => SK.k811(skRW, i);
// 8.2.1
WG.julat = () => SK.julat(skRW);
WG.kuartil = i => SK.kuartil(skRW, i);
WG.jakS = i => SK.jakS(skRW, i);
WG.jakBD = () => SK.jakBD(skRW);
WG.cariJulat = () => SK.cariJulat(skRW);
WG.bandingJak = () => SK.bandingJak(skRW);
WG.k821 = i => SK.k821(skRW, i);
// 8.2.2
WG.varS = i => SK.varS(skRW, i);
WG.sdS = i => SK.sdS(skRW, i);
WG.dariJum = () => SK.dariJum(skRW);
WG.bs2 = i => SK.bs(skRW, SKBS2, [3, 4][i % 2]);
WG.varJadual = () => SK.varJadual(skRW);
WG.bandingSd = () => SK.bandingSd(skRW);
WG.cariSumX2 = () => SK.cariSumX2(skRW);
WG.k822 = i => SK.k822(skRW, i);
// 8.2.3
WG.bacaKotak = i => SK.bacaKotak(skRW, i);
WG.julatKotak = () => SK.julatKotak(skRW);
WG.limaNilai = i => SK.limaNilai(skRW, i);
WG.bs3 = i => SK.bs(skRW, SKBS3, [1, 4][i % 2]);
WG.binaKotak = () => SK.binaKotak(skRW);
WG.bandingKotak = () => SK.bandingKotak(skRW);
WG.peratus = i => SK.peratus(skRW, i);
WG.k823 = i => SK.k823(skRW, i);
// 8.2.4
WG.tambahK = i => SK.tambahK(skRW, i);
WG.darabK = i => SK.darabK(skRW, i);
WG.pencilanKenal = () => SK.pencilanKenal(skRW);
WG.bs4 = i => SK.bs(skRW, SKBS4, [0, 1, 6][i % 3]);
WG.gabungK = () => SK.gabungK(skRW);
WG.pencilanKira = () => SK.pencilanKira(skRW);
WG.bandingMinSd = () => SK.bandingMinSd(skRW);
WG.k824 = i => SK.k824(skRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '8.1.1': [['m', 'plotJulat', 6], ['m', 'bdBaca', 5], ['m', 'bandingTitik', 4], ['m', 'bs1', 3], ['s', 'binaBD', 3], ['s', 'bandingBD', 3], ['s', 'binaTitik', 3], ['k', 'k811', 3]],
  '8.2.1': [['m', 'julat', 6], ['m', 'kuartil', 6], ['m', 'jakS', 6], ['s', 'jakBD', 3], ['s', 'cariJulat', 3], ['s', 'bandingJak', 3], ['k', 'k821', 3]],
  '8.2.2': [['m', 'varS', 6], ['m', 'sdS', 6], ['m', 'dariJum', 4], ['m', 'bs2', 2], ['s', 'varJadual', 3], ['s', 'bandingSd', 3], ['s', 'cariSumX2', 3], ['k', 'k822', 3]],
  '8.2.3': [['m', 'bacaKotak', 6], ['m', 'julatKotak', 6], ['m', 'limaNilai', 4], ['m', 'bs3', 2], ['s', 'binaKotak', 3], ['s', 'bandingKotak', 3], ['s', 'peratus', 3], ['k', 'k823', 3]],
  '8.2.4': [['m', 'tambahK', 6], ['m', 'darabK', 6], ['m', 'pencilanKenal', 3], ['m', 'bs4', 3], ['s', 'gabungK', 3], ['s', 'pencilanKira', 3], ['s', 'bandingMinSd', 3], ['k', 'k824', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function skOptsN(ans, cands, step) {
  step = step || 1;
  const A = skN(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (c == null || !isFinite(c) || c < 0) continue; const s = skN(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step; if (v < 0) continue; const s = skN(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function skOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const skMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const SKCQ = {
  serakan: [
    () => { const d = skData(skRG, ri(6, 8), 2, 20, 5); return skMcq('Apakah julat bagi set data ini?', skChipsFig(d), skOptsN(skJul(d), [d[d.length - 1] - d[0], Math.max(...d), Math.max(...d) + Math.min(...d), skJul(d) + 1].map(Math.abs))); },
    () => { let A, B; do { A = skData(skRG, 8, 1, 11, 4); B = skData(skRG, 8, 1, 11, 4); } while (Math.abs(skJul(A) - skJul(B)) < 3); return skMcq('Set data manakah lebih terserak?', skDot2Fig(A, B, 0, 12, 'Set A', 'Set B'), skOptsT(skJul(A) > skJul(B) ? 'Set A' : 'Set B', ['Set A', 'Set B', 'Sama terserak', 'Tidak dapat ditentukan'])); },
    () => { const d = skBDData(skRG, 10); return skMcq('Berdasarkan plot batang-dan-daun, apakah julat?', skStemFig(d), skOptsN(skJul(d), [Math.max(...d), Math.floor(Math.max(...d) / 10) - Math.floor(Math.min(...d) / 10), skJul(d) + 10, skJul(d) - 1])); }
  ],
  kuartil: [
    () => { let d; do { d = skData(skRG, 7, 1, 20, 7); } while (new Set(d).size < 7); const s = skSort(d); return skMcq('Apakah kuartil pertama, Q₁, bagi data ini?', skChipsFig(d), skOptsN(skQ1(d), [d[1], s[1] === skQ1(d) ? s[2] : s[1], skMed(d), skQ3(d), s[0]])); },
    () => { let d; do { d = skData(skRG, 8, 1, 25, 8); } while (new Set(d).size < 8); const s = skSort(d); return skMcq('Apakah kuartil ketiga, Q₃, bagi data ini?', skChipsFig(d), skOptsN(skQ3(d), [s[5], s[6], skMed(d), (d[5] + d[6]) / 2], .5)); },
    () => { let d; do { d = skData(skRG, ri(7, 8), 1, 25, 7); } while (new Set(d).size < 7); return skMcq('Apakah julat antara kuartil bagi data ini?', skChipsFig(d), skOptsN(skJak(d), [skJul(d), skQ1(d) + skQ3(d), skQ3(d), skJak(d) + 1], .5)); }
  ],
  varians: [
    () => { const d = skVarData(skRG, 4, 1, 12), m = skMean(d); return skMcq('Apakah varians bagi data ini?', skChipsFig(d), skOptsN(skVar(d), [Math.sqrt(skVar(d)), skSum(d.map(x => Math.abs(x - m))) / 4, skSq(d) / 4 - m, skVar(d) * 4 / 3], .5)); },
    () => { const s = ri(2, 12); return skMcq(`Varians suatu set data ialah ${s * s}. Apakah sisihan piawainya?`, skCardFig([[`σ² = ${s * s}`, 'pk', 24], ['σ = ?', 'am']]), skOptsN(s, [s * s / 2, s * s * s, s + 1, 2 * s])); },
    () => { let n, m, K; do { n = pick([4, 5, 10]); m = ri(3, 12); K = ri(n, n * 20); } while (!skClean(K / n)); const sx = n * m, sx2 = n * m * m + K; return skMcq('Apakah varians?', skCardFig([[`N = ${n}`, 'tr'], [`Σx = ${sx}`, 'gr'], [`Σx² = ${sx2}`, 'pu']]), skOptsN(K / n, [sx2 / n, sx2 / n - m, K, sx2 / n - sx], .5)); }
  ],
  plotkotak: [
    () => { const c = pick(SKBOX), v = skFive(skRG, c); return skMcq('Apakah median?', skBoxFig([{ v }], c.lo, c.hi, c.st, c.x), skOptsN(v[2], [v[1], v[3], (v[0] + v[4]) / 2, v[4] - v[0]], c.st)); },
    () => { const c = pick(SKBOX), v = skFive(skRG, c); return skMcq('Apakah julat antara kuartil?', skBoxFig([{ v }], c.lo, c.hi, c.st, c.x), skOptsN(v[3] - v[1], [v[4] - v[0], v[3] - v[2], v[2] - v[1], v[3] + v[1]], c.st)); },
    () => { const c = pick(SKBOX), v = skFive(skRG, c), N = pick([40, 80, 120, 200]); return skMcq(`${N} orang ${c.who}: berapa orang melebihi ${v[3]}?`, skBoxFig([{ v }], c.lo, c.hi, c.st, c.x), skOptsN(N / 4, [N / 2, 3 * N / 4, N / 5, N / 10])); }
  ],
  perubahan: [
    () => { const s = ri(2, 9), k = ri(2, 9), add = Math.random() < .5; return skMcq(`Sisihan piawai = ${s}. Setiap nilai ${add ? 'ditambah' : 'ditolak'} ${k}. Sisihan piawai baharu?`, skCardFig([[`σ = ${s}`, 'pk'], [`setiap nilai ${add ? '+' : '−'} ${k}`, 'pa']]), skOptsN(s, [add ? s + k : Math.abs(s - k), s * k, s + 2 * k])); },
    () => { const v = ri(2, 12), k = ri(2, 4); return skMcq(`Varians = ${v}. Setiap nilai didarab ${k}. Varians baharu?`, skCardFig([[`σ² = ${v}`, 'pk'], [`setiap nilai × ${k}`, 'pa']]), skOptsN(v * k * k, [v * k, v, v + k, v * 2 * k])); },
    () => { const d = skData(skRG, 7, 10, 20, 5), X = Math.max(...d) + ri(25, 40); return skMcq(`Nilai ${X} ditambah ke dalam set data ini. Sukatan manakah paling kurang terjejas?`, skChipsFig(d), skOptsT('Julat antara kuartil', ['Julat', 'Julat antara kuartil', 'Sisihan piawai', 'Varians'])); }
  ]
};
const CQT = { serakan: 'Serakan', kuartil: 'Kuartil & JAK', varians: 'Varians & sisihan piawai', plotkotak: 'Plot kotak', perubahan: 'Kesan perubahan' };
function skCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = SKCQ[ty] || SKCQ.serakan;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['serakan', 'serakan', 'kuartil', 'varians', 'plotkotak', 'perubahan'] : Object.keys(CQT);
  return skCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => SKCQ[t]);
  return skCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
