'use strict';
/* =================== PEMFAKTORAN · SOALAN BAB 2 PEMFAKTORAN DAN PECAHAN ALGEBRA (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pf" / "PF" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
const pfGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const pfGcdA = a => a.reduce((g, v) => pfGcd(g, v), 0);
const pfLcm = (a, b) => Math.abs(a * b) / pfGcd(a, b);
// rawak: pfRG untuk Latihan Kelas / games, pfRW (berbenih) untuk Lembaran Kerja
const pfRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const pfRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const pfShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pfSgn = r => (r.f() < .5 ? 1 : -1);

/* =================== polinomial: { kunci monomial: pekali } =================== */
// kunci monomial: "x2y1" (pemboleh ubah ikut PFORD), pemalar: ""
const PFORD = 'xyabmnpqrstuvwhk';
const PFSUP = { 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶' };
const pfOrd = (a, b) => PFORD.indexOf(a) - PFORD.indexOf(b);
const pfKey = e => Object.keys(e).filter(v => e[v]).sort(pfOrd).map(v => v + e[v]).join('');
const pfExp = k => { const e = {}; k.replace(/([a-z])(\d+)/g, (m, v, n) => { e[v] = +n; return m; }); return e; };
const pfM = (c, e) => { const p = {}; if (c) p[pfKey(e || {})] = c; return p; };
const pfX = (v, c = 1, n = 1) => pfM(c, { [v]: n });
const pfK = c => pfM(c);
const pfAdd = (...ps) => { const o = {}; ps.forEach(p => Object.keys(p).forEach(k => { o[k] = (o[k] || 0) + p[k]; })); Object.keys(o).forEach(k => { if (!o[k]) delete o[k]; }); return o; };
const pfSc = (p, k) => { const o = {}; if (k) Object.keys(p).forEach(t => { o[t] = p[t] * k; }); return o; };
const pfSub = (a, b) => pfAdd(a, pfSc(b, -1));
const pfMul = (...ps) => ps.reduce((A, B) => {
  let o = {};
  Object.keys(A).forEach(ka => Object.keys(B).forEach(kb => {
    const ea = pfExp(ka), eb = pfExp(kb);
    Object.keys(eb).forEach(v => { ea[v] = (ea[v] || 0) + eb[v]; });
    o = pfAdd(o, { [pfKey(ea)]: A[ka] * B[kb] });
  }));
  return o;
}, { '': 1 });
const pfL = (a, v, b, w) => pfAdd(pfM(a, v ? { [v]: 1 } : {}), pfM(b, w ? { [w]: 1 } : {}));   // a·v + b·w (w kosong = pemalar)
const pfCmp = (ka, kb) => { const ea = pfExp(ka), eb = pfExp(kb); for (const v of PFORD) { const d = (eb[v] || 0) - (ea[v] || 0); if (d) return d; } return 0; };
const pfMonoS = k => { const e = pfExp(k); return Object.keys(e).sort(pfOrd).map(v => v + (e[v] > 1 ? PFSUP[e[v]] : '')).join(''); };
const pfS = p => {
  const ks = Object.keys(p).sort(pfCmp);
  if (!ks.length) return '0';
  return ks.map((k, i) => {
    const c = p[k], a = Math.abs(c), m = pfMonoS(k), body = (a === 1 && m ? '' : String(a)) + m;
    return i === 0 ? (c < 0 ? '−' : '') + body : ` ${c < 0 ? '−' : '+'} ${body}`;
  }).join('');
};
const pfB = p => `(${pfS(p)})`;
const pfN = p => Object.keys(p).length;                         // bilangan sebutan
const pfEq = (a, b) => pfS(pfSub(a, b)) === '0';
const pfCo = p => Object.keys(p).map(k => p[k]);
const pfLead = p => p[Object.keys(p).sort(pfCmp)[0]];
// pekali di hadapan kurungan: 3(…), −2x(…)
const pfPre = p => { const s = pfS(p); return s === '1' ? '' : s === '−1' ? '−' : s; };

/* =================== pecahan (HTML bertingkat) =================== */
const pfF = (n, d) => `<span class="pff" style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;margin:0 .15em;font-size:.9em;white-space:nowrap"><span style="padding:0 .22em;border-bottom:.09em solid currentColor">${n}</span><span style="padding:0 .22em">${d}</span></span>`;
// pecahan monomial: { n, d, e:{v:kuasa (negatif = penyebut)} }
const pfMF = (n, d, e) => { const g = pfGcd(n, d) || 1; let nn = n / g, dd = d / g; if (dd < 0) { nn = -nn; dd = -dd; } const o = {}; Object.keys(e || {}).forEach(v => { if (e[v]) o[v] = e[v]; }); return { n: nn, d: dd, e: o }; };
const pfMFmul = (A, B) => { const e = Object.assign({}, A.e); Object.keys(B.e).forEach(v => { e[v] = (e[v] || 0) + B.e[v]; }); return pfMF(A.n * B.n, A.d * B.d, e); };
const pfMFinv = A => { const e = {}; Object.keys(A.e).forEach(v => { e[v] = -A.e[v]; }); return pfMF(A.d * Math.sign(A.n), Math.abs(A.n), e); };
const pfVars = (e, s) => Object.keys(e).filter(v => e[v] * s > 0).sort(pfOrd).map(v => v + (Math.abs(e[v]) > 1 ? PFSUP[Math.abs(e[v])] : '')).join('');
const pfMFs = A => {
  const nv = pfVars(A.e, 1), dv = pfVars(A.e, -1), an = Math.abs(A.n);
  const num = (an === 1 && nv ? '' : String(an)) + nv, den = (A.d === 1 && dv ? '' : String(A.d)) + dv;
  return (A.n < 0 ? '−' : '') + (den === '1' ? num : pfF(num, den));
};
// paparan pecahan monomial seperti ditulis (tanpa dipermudah): pengangka & penyebut monomial
const pfMFraw = (nc, ne, dc, de) => pfF(pfS(pfM(nc, ne)), pfS(pfM(dc, de)));
// polinomial ÷ monomial { c, e } → dipermudahkan
function pfPM(N, dc, de) {
  de = Object.assign({}, de || {});
  let g = pfGcd(pfGcdA(pfCo(N)), dc) || 1;
  if (dc < 0) g = -g;
  let o = {}; Object.keys(N).forEach(k => { o[k] = N[k] / g; });
  dc = dc / g;
  Object.keys(de).forEach(v => {
    const mn = Math.min(de[v], ...Object.keys(o).map(k => pfExp(k)[v] || 0));
    if (mn > 0) {
      const o2 = {}; Object.keys(o).forEach(k => { const e = pfExp(k); e[v] -= mn; o2[pfKey(e)] = o[k]; }); o = o2; de[v] -= mn;
    }
  });
  return { N: o, c: dc, e: de };
}
const pfPMs = R => { const den = pfS(pfM(R.c, R.e)); return den === '1' ? pfS(R.N) : den === '−1' ? pfS(pfSc(R.N, -1)) : pfF(pfS(R.N), den); };

/* =================== semakan matematik (mod ujian sahaja) =================== */
// Bila window.PF_TEST = true, setiap soalan menyimpan _v = [[ungkapan soalan, jawapan] …] untuk disemak secara berangka.
const pfV = (o, pairs) => { if (typeof window !== 'undefined' && window.PF_TEST) o._v = pairs; return o; };

/* =================== rajah =================== */
const pfT = (x, y, t, c = 'tx', sz = 20, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pfR = (x, y, w, h, c, op = .2, rx = 6, sw = 2.5) => `<rect x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" width="${+w.toFixed(1)}" height="${+h.toFixed(1)}" rx="${rx}" style="fill:var(--${c});fill-opacity:${op};stroke:var(--${c})" stroke-width="${sw}"/>`;
const pfLn = (a, b, c, w = 3, dash) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const pfSvg = (s, label, w = 320, h = 214) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
const pfW = (t, sz) => String(t).replace(/<[^>]+>/g, '').length * sz * .58;
// kaedah jadual: kepala lajur, kepala baris, sel (warna: x² biru, x hijau, pemalar kuning)
function pfTableFig(colH, rowH, cells, colors, label) {
  const nc = colH.length, nr = rowH.length, cw = nc > 2 ? 78 : 104, ch = 62, x0 = 320 - 14 - nc * cw, y0 = 214 - 12 - nr * ch;
  let s = '';
  colH.forEach((t, j) => { s += pfT(x0 + j * cw + cw / 2, y0 - 22, t, 'tr', 21); });
  rowH.forEach((t, i) => { s += pfT(x0 - 14, y0 + i * ch + ch / 2, t, 'pa', 21, 'end'); });
  cells.forEach((row, i) => row.forEach((t, j) => {
    const c = colors[i][j], sz = Math.min(22, 70 / Math.max(2.2, t.length) * 1.6);
    s += pfR(x0 + j * cw + 3, y0 + i * ch + 3, cw - 6, ch - 6, c, .18, 8) + pfT(x0 + j * cw + cw / 2, y0 + i * ch + ch / 2, t, 'tx', sz);
  }));
  s += pfT(x0 - 14, y0 - 22, '×', 'mu', 20, 'end');
  return pfSvg(s, label || 'Kaedah jadual');
}
// warna sel ikut darjah sebutan dalam x
const pfCellC = p => { const k = Object.keys(p)[0] || ''; const d = Object.values(pfExp(k)).reduce((a, b) => a + b, 0); return d >= 2 ? 'tr' : d === 1 ? 'gr' : 'am'; };
function pfTabFor(A, B, label) {
  const ta = Object.keys(A).sort(pfCmp).map(k => ({ [k]: A[k] })), tb = Object.keys(B).sort(pfCmp).map(k => ({ [k]: B[k] }));
  const cells = ta.map(a => tb.map(b => pfS(pfMul(a, b)))), cols = ta.map(a => tb.map(b => pfCellC(pfMul(a, b))));
  return pfTableFig(tb.map(pfS), ta.map(pfS), cells, cols, label);
}
// kaedah pendaraban silang bagi (px + q)(rx + s)
function pfCrossFig(p, q, r, s_, v = 'x') {
  const L = 70, R = 170, Y1 = 50, Y2 = 140;
  const lx = t => pfT(L, t[0], t[1], 'tr', 26), rx = t => pfT(R, t[0], t[1], 'am', 26);
  let s = pfR(L - 38, Y1 - 24, 76, 48, 'tr', .1, 10) + pfR(L - 38, Y2 - 24, 76, 48, 'tr', .1, 10) + pfR(R - 38, Y1 - 24, 76, 48, 'am', .1, 10) + pfR(R - 38, Y2 - 24, 76, 48, 'am', .1, 10);
  s += lx([Y1, pfS(pfX(v, p))]) + lx([Y2, pfS(pfX(v, r))]) + rx([Y1, (q > 0 ? '+' : '−') + Math.abs(q)]) + rx([Y2, (s_ > 0 ? '+' : '−') + Math.abs(s_)]);
  s += pfLn([L + 40, Y1 + 14], [R - 40, Y2 - 14], 'pk', 3) + pfLn([L + 40, Y2 - 14], [R - 40, Y1 + 14], 'pk', 3);
  const t1 = pfS(pfX(v, q * r)), t2 = pfS(pfX(v, p * s_)), sm = pfS(pfX(v, q * r + p * s_));
  s += pfT(268, Y1, (q * r > 0 ? '+' : '') + t1, 'pk', 22) + pfT(268, Y2, (p * s_ > 0 ? '+' : '') + t2, 'pk', 22);
  s += pfLn([222, Y2 + 28], [314, Y2 + 28], 'pk', 2.5) + pfT(268, Y2 + 52, sm, 'gr', 22);
  return pfSvg(s, 'Rajah kaedah pendaraban silang');
}
// segi empat tepat berlabel (luas), pilihan: segi empat sama tidak berlorek di dalam
function pfRectFig(wl, hl, inner) {
  let s = pfR(40, 30, 230, 140, inner ? 'pu' : 'gr', inner ? .28 : .16, 4, 3);
  if (inner) s += `<rect x="40" y="30" width="${inner.w}" height="${inner.h}" style="fill:var(--diag);stroke:var(--tx)" stroke-width="2.5"/>` + pfT(40 + inner.w / 2, 30 + inner.h + 14, `${inner.lab} cm`, 'tx', 16) + pfT(40 + inner.w + 22, 30 + inner.h / 2, `${inner.lab} cm`, 'tx', 16);
  s += pfT(155, 192, wl, 'tr', 20) + pfT(282, 100, hl, 'pa', 20, 'start');
  return pfSvg(s, 'Segi empat tepat berlabel', 380, 214);
}
// kad ungkapan untuk games: item = teks atau { n, d } (pecahan)
function pfCardFig(items, cap) {
  const sz0 = 30, w = it => (typeof it === 'string' ? pfW(it, sz0) : Math.max(pfW(it.n, sz0 * .8), pfW(it.d, sz0 * .8)) + 12);
  const tot = items.reduce((a, it) => a + w(it) + 8, 0), k = Math.min(1, 288 / tot), sz = sz0 * k;
  let x = 160 - tot * k / 2, s = '';
  const cy = cap ? 118 : 107;
  items.forEach(it => {
    const ww = w(it) * k;
    if (typeof it === 'string') s += pfT(x + ww / 2, cy, it, 'tx', sz);
    else s += pfT(x + ww / 2, cy - sz * .62, it.n, 'tx', sz * .8) + pfT(x + ww / 2, cy + sz * .66, it.d, 'tx', sz * .8) + pfLn([+(x + 4).toFixed(1), cy], [+(x + ww - 4).toFixed(1), cy], 'tx', 2.5);
    x += ww + 8 * k;
  });
  if (cap) s = pfT(160, 34, cap, 'pu', 17) + s;
  return pfSvg(s, 'Ungkapan algebra');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 2.1 Kembangan ---------- */
  tunggal: [
    ({ E }) => ({ q: `Kembangkan ${E}.` }),
    ({ E }) => ({ q: `Guna hukum taburan untuk mengembangkan ${E}.` }),
    ({ E }) => ({ q: `Tulis ungkapan ${E} tanpa kurungan.` }),
    ({ kS, inS }) => ({ q: `Darabkan ${kS} dengan ${inS}.` }),
    ({ E, wrong, ans, kS }) => { const N = vnama(); return Object.assign({ q: `${N} mengembangkan ${E} dan mendapat ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya mendarab ${kS} dengan sebutan pertama. ${kS} mesti didarab dengan setiap sebutan dalam kurungan.`)); }
  ],
  dua: [
    ({ E }) => ({ q: `Kembangkan dan permudahkan ${E}.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} dalam bentuk ax² + bx + c.` }),
    ({ E }) => ({ q: `Cari hasil darab ${E}.` }),
    ({ E }) => ({ q: `Darabkan dua ungkapan ${E}, kemudian kumpulkan sebutan serupa.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${E} = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya mendarab sebutan pertama dengan sebutan pertama dan sebutan kedua dengan sebutan kedua. Setiap sebutan dalam kurungan pertama mesti didarab dengan setiap sebutan dalam kurungan kedua.`)); }
  ],
  khas: [
    ({ E }) => ({ q: `Dengan menggunakan kembangan khas, kembangkan ${E}.` }),
    ({ E }) => ({ q: `Cari hasil kembangan bagi ${E}.` }),
    ({ E }) => ({ q: `Tanpa menggunakan kaedah jadual, kembangkan ${E}.` }),
    ({ E, wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${E} = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  permudah: [
    ({ E }) => ({ q: `Permudahkan ${E}.` }),
    ({ E }) => ({ q: `Kembangkan setiap kurungan, kemudian permudahkan ${E}.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} dalam bentuk yang paling ringkas.` }),
    ({ E }) => ({ q: `Tulis ${E} sebagai satu ungkapan tanpa kurungan dalam bentuk termudah.` })
  ],
  luas: [
    ({ shape }) => ({ q: `Rajah di bawah menunjukkan sebuah ${shape}. Ungkapkan luas ${shape} itu, dalam cm², sebagai ungkapan yang dikembangkan.` }),
    ({ shape, wS, hS }) => ({ q: `Sebuah ${shape} berukuran ${wS} cm × ${hS} cm seperti dalam rajah di bawah. Cari luasnya dalam sebutan x.` }),
    ({ shape }) => ({ q: `Berdasarkan rajah di bawah, tulis ungkapan bagi luas ${shape} itu tanpa kurungan.` }),
    () => ({ q: `Sekeping kad berbentuk seperti rajah di bawah. Hitung luas kad itu dalam sebutan x (cm²) dan permudahkan.` })
  ],
  lorek: [
    () => ({ q: `Rajah di bawah menunjukkan sebuah segi empat tepat dengan sebuah segi empat sama tidak berlorek di dalamnya. Ungkapkan luas kawasan berlorek dalam sebutan x.` }),
    () => ({ q: `Cari luas kawasan berlorek dalam rajah di bawah, dalam cm². Permudahkan jawapan anda.` }),
    () => ({ q: `Sebuah petak segi empat sama sisi x cm dipotong daripada sekeping kadbod seperti dalam rajah di bawah. Ungkapkan luas kadbod yang tinggal.` })
  ],
  pekali: [
    ({ E, v }) => ({ q: `Cari pekali bagi ${v} dalam kembangan ${E}.` }),
    ({ E, v }) => ({ q: `Apabila ${E} dikembangkan, apakah pekali sebutan ${v}?` }),
    ({ E, v }) => ({ q: `Tanpa mengembangkan sepenuhnya, nyatakan pekali ${v} dalam ${E}.` })
  ],
  cariMN: [
    ({ E, R }) => ({ q: `Diberi ${E} = ${R}. Cari nilai m dan nilai n.` }),
    ({ E, R }) => ({ q: `Kembangkan ${E}. Seterusnya, jika ${E} = ${R}, nyatakan nilai m dan n.` }),
    ({ E, R }) => ({ q: `Ungkapan ${E} adalah setara dengan ${R}. Tentukan nilai m dan n.` })
  ],

  /* ---------- 2.2 Pemfaktoran ---------- */
  fstb: [
    ({ list }) => ({ q: `Cari faktor sepunya terbesar (FSTB) bagi ${list}.` }),
    ({ list }) => ({ q: `Nyatakan FSTB bagi ${list}.` }),
    ({ list }) => ({ q: `Apakah faktor sepunya terbesar bagi sebutan ${list}?` }),
    ({ list, wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata FSTB bagi ${list} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  fstbF: [
    ({ E }) => ({ q: `Faktorkan ${E}.` }),
    ({ E }) => ({ q: `Keluarkan faktor sepunya terbesar daripada ${E}.` }),
    ({ E }) => ({ q: `Dengan mengeluarkan FSTB, faktorkan ${E}.` }),
    ({ E, part, ans }) => { const N = vnama(); return Object.assign({ q: `${N} memfaktorkan ${E} sebagai ${part}. Adakah pemfaktoran itu lengkap?` }, { ans: `Tidak lengkap. Pemfaktoran lengkap: ${ans}`, pre: [`Masih ada faktor sepunya di dalam kurungan. Keluarkan FSTB.`] }); }
  ],
  beza: [
    ({ E }) => ({ q: `Faktorkan ungkapan beza dua kuasa dua ${E}.` }),
    ({ E }) => ({ q: `Dengan menggunakan a² − b² = (a + b)(a − b), faktorkan ${E}.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} sebagai hasil darab dua faktor.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} memfaktorkan ${E} sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `a² − b² = (a + b)(a − b): satu faktor mempunyai tanda + dan satu lagi tanda −.`)); }
  ],
  trinom: [
    ({ E }) => ({ q: `Faktorkan ungkapan kuadratik ${E}.` }),
    ({ E }) => ({ q: `Faktorkan ${E} dengan menggunakan kaedah pendaraban silang.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} sebagai hasil darab dua ungkapan linear.` }),
    ({ E }) => ({ q: `Cari dua faktor bagi ${E}.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} memfaktorkan ${E} sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Kembangkan ${wrong} untuk menyemak: hasilnya bukan ${E}.`)); }
  ],
  kumpul: [
    ({ E }) => ({ q: `Faktorkan ${E} dengan mengumpul sebutan.` }),
    ({ E }) => ({ q: `Dengan mengumpulkan sebutan, ungkapkan ${E} sebagai hasil darab dua faktor.` }),
    ({ E }) => ({ q: `Kumpulkan sebutan secara berpasangan, kemudian faktorkan ${E}.` }),
    ({ E }) => ({ q: `Faktorkan ungkapan empat sebutan ${E}.` })
  ],
  lengkap: [
    ({ E }) => ({ q: `Faktorkan selengkapnya ${E}.` }),
    ({ E }) => ({ q: `Faktorkan ${E} sepenuhnya.` }),
    ({ E, part, ans }) => { const N = vnama(); return Object.assign({ q: `${N} memfaktorkan ${E} sebagai ${part}. Adakah pemfaktoran itu lengkap?` }, { ans: `Tidak lengkap. Pemfaktoran lengkap: ${ans}`, pre: ['Ungkapan di dalam kurungan masih boleh difaktorkan.'] }); }
  ],

  /* ---------- 2.3 Pecahan algebra ---------- */
  samaP: [
    ({ E }) => ({ q: `Hitung ${E}.` }),
    ({ E }) => ({ q: `Gabungkan ${E} menjadi satu pecahan.` }),
    ({ E }) => ({ q: `Permudahkan ${E}.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${E} = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Apabila penyebut sama, hanya pengangka ditambah atau ditolak. Penyebut kekal.')); }
  ],
  bezaP: [
    ({ E }) => ({ q: `Ungkapkan ${E} sebagai satu pecahan tunggal dalam bentuk termudah.` }),
    ({ E }) => ({ q: `Dengan menggunakan GSTK bagi penyebut, hitung ${E}.` }),
    ({ E }) => ({ q: `Tulis ${E} sebagai satu pecahan tunggal.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${E} = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah atau menolak penyebut. Samakan penyebut menggunakan GSTK dahulu.`)); }
  ],
  darab: [
    ({ E }) => ({ q: `Hitung ${E} dan berikan jawapan dalam bentuk termudah.` }),
    ({ E }) => ({ q: `Cari hasil darab ${E}.` }),
    ({ E }) => ({ q: `Darabkan dan permudahkan ${E}.` })
  ],
  bahagi: [
    ({ E }) => ({ q: `Bahagikan dan permudahkan ${E}.` }),
    ({ E }) => ({ q: `Cari hasil bahagi ${E} dalam bentuk termudah.` }),
    ({ E }) => ({ q: `Dengan mendarab salingan, hitung ${E}.` }),
    ({ E, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${E} = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa menukar ÷ kepada × salingan pecahan kedua.`)); }
  ],
  permudahF: [
    ({ E }) => ({ q: `Permudahkan ${E}.` }),
    ({ E }) => ({ q: `Ungkapkan ${E} dalam bentuk termudah.` }),
    ({ E }) => ({ q: `Dengan memfaktorkan pengangka dan penyebut, permudahkan ${E}.` }),
    ({ E, ans }) => { const N = vnama(); return Object.assign({ q: `${N} membatalkan sebutan x dalam ${E} secara terus. Betulkan kaedah ${N} dan permudahkan pecahan itu.` }, { ans, pre: ['Hanya faktor sepunya boleh dibatalkan, bukan sebutan. Faktorkan dahulu.'] }); }
  ],
  tolakK: [
    ({ E }) => ({ q: `Ungkapkan ${E} sebagai satu pecahan tunggal dengan penyebut sepunya.` }),
    ({ E }) => ({ q: `Samakan penyebut, kemudian permudahkan ${E}.` }),
    ({ E }) => ({ q: `Tuliskan ${E} sebagai satu pecahan dalam bentuk termudah.` })
  ],
  darabF: [
    ({ E }) => ({ q: `Faktorkan dahulu, kemudian permudahkan ${E}.` }),
    ({ E }) => ({ q: `Dengan pemfaktoran, ungkapkan ${E} dalam bentuk termudah.` }),
    ({ E }) => ({ q: `Hitung ${E} dalam bentuk termudah.` })
  ]
};

/* =================== pembina soalan (r = pfRG atau pfRW) =================== */
const PF = {};
const PFV2 = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['h', 'k']];
const PFV1 = ['x', 'y', 'a', 'm', 'p', 'k'];
const pfFix = (r, f, ok, n = 60) => { let v; for (let i = 0; i < n; i++) { v = f(); if (ok(v)) return v; } return v; };

/* ---------- 2.1 Kembangan ---------- */
// sebutan tunggal × dua sebutan
PF.tunggal = r => {
  const d = pfFix(r, () => {
    const [v, w] = r.p(PFV2), kc = r.n(-6, 6), kv = r.f() < .55 ? v : '', a = r.i(1, 5), b = r.n(-9, 9), two = r.f() < .3;
    const k = pfM(kc, kv ? { [kv]: 1 } : {}), inner = two ? pfL(a, v, b, w) : pfL(a, v, b);
    return { v, k, inner, kc };
  }, d => Math.abs(d.kc) !== 1 && pfLead(d.inner) > 0);
  const { k, inner } = d, ans = pfS(pfMul(k, inner)), E = `${pfPre(k)}${pfB(inner)}`;
  const ks = Object.keys(inner).sort(pfCmp), t1 = { [ks[0]]: inner[ks[0]] }, t2 = { [ks[1]]: inner[ks[1]] };
  const wrong = pfS(pfAdd(pfMul(k, t1), t2));
  const work = [`${E} = (${pfS(k)})(${pfS(t1)}) + (${pfS(k)})(${pfS(t2)})`, `= ${ans}`];
  return pfV(GEN_LQ('tunggal', { E, kS: pfS(k), inS: pfB(inner), wrong, ans, work }), [[E, ans]]);
};
// (ax + b)(cx + d)
PF.dua = r => {
  const d = pfFix(r, () => ({ a: r.p([1, 1, 1, 2, 3]), b: r.n(-8, 8), c: r.p([1, 1, 2, 3]), dd: r.n(-8, 8) }), o => o.a * o.dd + o.b * o.c !== 0 && !(o.a === o.c && o.b === o.dd) && !(o.a === o.c && o.b === -o.dd));
  const A = pfL(d.a, 'x', d.b), B = pfL(d.c, 'x', d.dd), P_ = pfMul(A, B), ans = pfS(P_), E = `${pfB(A)}${pfB(B)}`;
  const wrong = pfS(pfAdd(pfX('x', d.a * d.c, 2), pfK(d.b * d.dd)));
  const raw = [pfMul(pfX('x', d.a), pfX('x', d.c)), pfMul(pfX('x', d.a), pfK(d.dd)), pfMul(pfK(d.b), pfX('x', d.c)), pfK(d.b * d.dd)].map(pfS);
  const work = [`${E} = ${raw[0]} ${raw.slice(1).map(t => (t[0] === '−' ? '− ' + t.slice(1) : '+ ' + t)).join(' ')}`, `= ${ans}`];
  return pfV(Object.assign(GEN_LQ('dua', { E, wrong, ans, work }), { figAns: pfTabFor(A, B, 'Kaedah jadual bagi ' + E) }), [[E, ans]]);
};
// kembangan khas
PF.khas = (r, k) => {
  const t = k == null ? r.i(0, 4) : k % 5;
  const a = r.p([1, 1, 2, 3, 4, 5]), b = r.i(1, 9), w = r.f() < .3 ? 'y' : '';
  let A, B, E, why, wrong;
  if (t === 0 || t === 1) {            // (ax ± b)²
    const s = t === 0 ? 1 : -1;
    A = w ? pfL(a, 'x', s * b, w) : pfL(a, 'x', s * b); B = A; E = `${pfB(A)}²`;
    wrong = pfS(pfAdd(pfMul(pfX('x', a), pfX('x', a)), w ? pfMul(pfX(w, s * b), pfX(w, s * b)) : pfK(b * b)));
    why = `${E} = ${pfB(A)}${pfB(A)}. Sebutan tengah 2(${pfS(pfX('x', a))})(${s * b > 0 ? '' : '−'}${pfS(w ? pfX(w, b) : pfK(b))}) tertinggal.`;
  } else if (t === 2 || t === 3) {     // (ax + b)(ax − b)
    A = w ? pfL(a, 'x', b, w) : pfL(a, 'x', b); B = w ? pfL(a, 'x', -b, w) : pfL(a, 'x', -b);
    E = t === 2 ? `${pfB(A)}${pfB(B)}` : `${pfB(B)}${pfB(A)}`;
    wrong = pfS(pfAdd(pfMul(pfX('x', a), pfX('x', a)), w ? pfMul(pfX(w, b), pfX(w, b)) : pfK(b * b)));
    why = `Hasil darab sebutan kedua ialah ${pfS(w ? pfX(w, b) : pfK(b))} × (−${pfS(w ? pfX(w, b) : pfK(b))}) = −${pfS(w ? pfX(w, b * b, 2) : pfK(b * b))}, dan sebutan tengah terhapus.`;
  } else {                              // (b − ax)²
    A = pfL(-a, 'x', b); B = A; E = `(${b} − ${pfS(pfX('x', a))})²`;
    wrong = pfS(pfAdd(pfK(b * b), pfX('x', -a * a, 2)));
    why = `(${b} − ${pfS(pfX('x', a))})² = (${b} − ${pfS(pfX('x', a))})(${b} − ${pfS(pfX('x', a))}). (−${pfS(pfX('x', a))})² adalah positif dan ada sebutan tengah.`;
  }
  const P_ = pfMul(A, B), ans = pfS(P_);
  const work = t < 2 || t === 4 ? ['(a ± b)² = a² ± 2ab + b²', `${E} = ${ans}`] : ['(a + b)(a − b) = a² − b²', `${E} = ${ans}`];
  return pfV(Object.assign(GEN_LQ('khas', { E, wrong, ans, why, work }), { figAns: pfTabFor(A, B, 'Kaedah jadual bagi ' + E) }), [[E, ans]]);
};
// permudahkan ungkapan melibatkan kembangan
PF.permudah = (r, k) => {
  const t = k == null ? r.i(0, 3) : k % 4;
  let E, P_, parts;
  if (t === 0) {          // (x + a)(x + b) + k(x + c)
    const a = r.n(-6, 6), b = r.n(-6, 6), kk = r.n(-5, 5), c = r.n(-6, 6);
    const A = pfL(1, 'x', a), B = pfL(1, 'x', b), C_ = pfL(1, 'x', c);
    E = `${pfB(A)}${pfB(B)} ${kk < 0 ? '−' : '+'} ${Math.abs(kk) === 1 ? '' : Math.abs(kk)}${pfB(C_)}`;
    parts = [pfS(pfMul(A, B)), pfS(pfSc(C_, kk))]; P_ = pfAdd(pfMul(A, B), pfSc(C_, kk));
  } else if (t === 1) {   // (ax + b)(cx + d) − kx(ex + f)
    const a = r.i(1, 3), b = r.n(-6, 6), c = r.i(1, 3), d = r.n(-6, 6), kk = r.i(1, 4), e = r.i(1, 3), f = r.n(-6, 6);
    const A = pfL(a, 'x', b), B = pfL(c, 'x', d), C_ = pfL(e, 'x', f), K_ = pfX('x', kk);
    E = `${pfB(A)}${pfB(B)} − ${pfS(K_)}${pfB(C_)}`;
    parts = [pfS(pfMul(A, B)), pfS(pfSc(pfMul(K_, C_), -1))]; P_ = pfSub(pfMul(A, B), pfMul(K_, C_));
  } else if (t === 2) {   // (x + a)² − (x + b)(x − b)
    const a = r.n(-7, 7), b = r.i(1, 7), A = pfL(1, 'x', a), B1 = pfL(1, 'x', b), B2 = pfL(1, 'x', -b);
    E = `${pfB(A)}² − ${pfB(B1)}${pfB(B2)}`;
    parts = [pfS(pfMul(A, A)), pfS(pfSc(pfMul(B1, B2), -1))]; P_ = pfSub(pfMul(A, A), pfMul(B1, B2));
  } else {                // k(x + a)² − (2x + b)²  atau  (ax + b)² + (x − c)²
    const kk = r.i(2, 4), a = r.n(-5, 5), b = r.n(-5, 5), A = pfL(1, 'x', a), B = pfL(r.p([1, 2]), 'x', b);
    E = `${kk}${pfB(A)}² − ${pfB(B)}²`;
    parts = [pfS(pfSc(pfMul(A, A), kk)), pfS(pfSc(pfMul(B, B), -1))]; P_ = pfSub(pfSc(pfMul(A, A), kk), pfMul(B, B));
  }
  const ans = pfS(P_);
  const work = [`Kembangkan bahagian pertama: ${parts[0]}`, `Kembangkan bahagian kedua bersama tandanya: ${parts[1]}`, `Kumpul sebutan serupa: ${ans}`];
  return pfV(GEN_LQ('permudah', { E, ans, work }), [[E, ans]]);
};
// luas segi empat tepat / segi empat sama
PF.luas = r => {
  const sq = r.f() < .3, a = r.i(1, 4), b = r.i(1, 9), c = sq ? a : r.i(1, 3), d = sq ? b : pfFix(r, () => r.i(-3, 9), v => v !== 0 && !(c === a && v === b));
  const A = pfL(a, 'x', b), B = pfL(c, 'x', d), ans = `${pfS(pfMul(A, B))} cm²`, shape = sq ? 'segi empat sama' : 'segi empat tepat';
  const work = [`Luas = ${pfB(A)} × ${pfB(B)}`, `= ${pfS(pfMul(A, B))}`];
  return pfV(GEN_LQ('luas', { shape, wS: pfB(A), hS: pfB(B), ans, work }, { fig: pfRectFig(`${pfS(A)} cm`, `${pfS(B)} cm`) }), [[`${pfB(A)}${pfB(B)}`, pfS(pfMul(A, B))]]);
};
// luas kawasan berlorek: segi empat tepat (x + a)(x + b) tolak segi empat sama x²
PF.lorek = r => {
  const a = r.i(2, 9), b = r.i(1, 8), A = pfL(1, 'x', a), B = pfL(1, 'x', b), P_ = pfSub(pfMul(A, B), pfX('x', 1, 2)), ans = `${pfS(P_)} cm²`;
  const work = [`Luas berlorek = luas segi empat tepat − luas segi empat sama`, `= ${pfB(A)}${pfB(B)} − x²`, `= ${pfS(pfMul(A, B))} − x²`, `= ${pfS(P_)}`];
  return pfV(GEN_LQ('lorek', { ans, work }, { fig: pfRectFig(`${pfS(A)} cm`, `${pfS(B)} cm`, { w: 118, h: 100, lab: 'x' }) }), [[`${pfB(A)}${pfB(B)} − x²`, pfS(P_)]]);
};
// pekali
PF.pekali = r => {
  const two = r.f() < .4, a = r.i(1, 4), c = r.i(1, 4), b = r.n(-7, 7), d = pfFix(r, () => r.n(-7, 7), v => a * v + b * c !== 0);
  const A = two ? pfL(a, 'x', b, 'y') : pfL(a, 'x', b), B = two ? pfL(c, 'x', d, 'y') : pfL(c, 'x', d);
  const P_ = pfMul(A, B), key = two ? 'x1y1' : 'x1', co = P_[key] || 0, v = two ? 'xy' : 'x', E = `${pfB(A)}${pfB(B)}`;
  const t1 = a * d, t2 = b * c;
  const work = [`Sebutan ${v} terhasil daripada hasil darab silang: (${pfS(pfX('x', a))})(${two ? pfS(pfX('y', d)) : d}) dan (${two ? pfS(pfX('y', b)) : b})(${pfS(pfX('x', c))})`, `= ${pfS(pfM(t1, two ? { x: 1, y: 1 } : { x: 1 }))} ${t2 < 0 ? '−' : '+'} ${pfS(pfM(Math.abs(t2), two ? { x: 1, y: 1 } : { x: 1 }))} = ${pfS(pfM(co, two ? { x: 1, y: 1 } : { x: 1 }))}`, `Pekali ${v} = ${fmt(co)}`];
  return pfV(GEN_LQ('pekali', { E, v, ans: fmt(co), work }), []);
};
// (x + p)(x + q) = x² + mx + n
PF.cariMN = r => {
  const p = r.n(-8, 8), q = pfFix(r, () => r.n(-8, 8), v => v + p !== 0), A = pfL(1, 'x', p), B = pfL(1, 'x', q);
  const E = `${pfB(A)}${pfB(B)}`, R = 'x² + mx + n', m = p + q, n = p * q;
  const sx = c => `${c < 0 ? '−' : '+'} ${pfS(pfX('x', Math.abs(c)))}`, work = [`${E} = x² ${sx(q)} ${sx(p)} ${n < 0 ? '−' : '+'} ${Math.abs(n)}`, `= ${pfS(pfMul(A, B))}`, `Bandingkan dengan x² + mx + n: m = ${fmt(m)}, n = ${fmt(n)}`];
  return pfV(GEN_LQ('cariMN', { E, R, ans: `m = ${fmt(m)}, n = ${fmt(n)}`, work }), []);
};
// sukar 2.1
PF.k21 = (r, k) => {
  const t = k == null ? r.i(0, 3) : k % 4;
  if (t === 0) {   // bingkai gambar
    const a = r.i(2, 4), b = r.i(1, 3), xv = r.i(4, 9);
    const O1 = pfL(1, 'x', 2 * a), O2 = pfL(1, 'x', 2 * b), Pv = pfSub(pfMul(O1, O2), pfX('x', 1, 2));
    const val = (xv + 2 * a) * (xv + 2 * b) - xv * xv;
    return pfV({ q: `Sekeping gambar berbentuk segi empat sama bersisi x cm dibingkaikan. Lebar bingkai di kiri dan kanan ialah ${a} cm masing-masing, manakala di atas dan bawah ialah ${b} cm masing-masing. (a) Ungkapkan luas bingkai dalam sebutan x. (b) Hitung luas bingkai jika x = ${xv}.`, ans: `(a) ${pfS(Pv)} cm² (b) ${val} cm²`, work: [`Ukuran luar = ${pfB(O1)} cm × ${pfB(O2)} cm`, `(a) Luas bingkai = ${pfB(O1)}${pfB(O2)} − x² = ${pfS(pfMul(O1, O2))} − x² = ${pfS(Pv)}`, `(b) ${pfS(Pv).replace(/x/g, `(${xv})`)} = ${val}`] }, [[`${pfB(O1)}${pfB(O2)} − x²`, pfS(Pv)]]);
  }
  if (t === 1) {   // (x + p)² − (x − p)² = 4px, guna untuk aritmetik
    const p = r.i(2, 9), X = r.p([100, 50, 200, 1000]), val = 4 * p * X;
    return pfV({ q: `(a) Kembangkan dan permudahkan (x + ${p})² − (x − ${p})². (b) Seterusnya, tanpa menggunakan kalkulator, hitung nilai ${X + p}² − ${X - p}².`, ans: `(a) ${4 * p}x (b) ${val}`, work: [`(a) (x² + ${2 * p}x + ${p * p}) − (x² − ${2 * p}x + ${p * p}) = ${4 * p}x`, `(b) ${X + p}² − ${X - p}² ialah (x + ${p})² − (x − ${p})² dengan x = ${X}`, `= ${4 * p} × ${X} = ${val}`] }, [[`(x + ${p})² − (x − ${p})²`, `${4 * p}x`]]);
  }
  if (t === 2) {   // (ax + m)(x + q) = ax² + nx + c, cari m dan n
    const a = r.i(2, 4), q = r.n(-5, 5), m = pfFix(r, () => r.n(-7, 7), v => v !== q * a && v + a * q !== 0), c = m * q, n = a * q + m;
    return pfV({ q: `Diberi (${a}x + m)(x ${q < 0 ? '−' : '+'} ${Math.abs(q)}) = ${a}x² + nx ${c < 0 ? '−' : '+'} ${Math.abs(c)}, dengan m dan n ialah pemalar. Cari nilai m dan nilai n.`, ans: `m = ${fmt(m)}, n = ${fmt(n)}`, work: [`Kembangkan: ${a}x² ${a * q < 0 ? '−' : '+'} ${Math.abs(a * q)}x + mx ${q < 0 ? '−' : '+'} ${Math.abs(q)}m`, `Bandingkan pemalar: ${fmt(q)}m = ${fmt(c)}, maka m = ${fmt(m)}`, `Bandingkan pekali x: n = ${fmt(a * q)} + m = ${fmt(a * q)} ${m < 0 ? '−' : '+'} ${Math.abs(m)} = ${fmt(n)}`] }, []);
  }
  // t === 3: taman dengan laluan
  const a = r.i(2, 3), b = r.i(3, 9), w = r.i(1, 2), L = pfL(a, 'x', b), Wd = pfL(1, 'x', 0), inner = pfMul(pfL(a, 'x', b - 2 * w), pfL(1, 'x', -2 * w));
  const Pv = pfSub(pfMul(L, Wd), inner);
  return pfV({ q: `Sebuah taman berbentuk segi empat tepat berukuran ${pfB(L)} m panjang dan x m lebar. Satu laluan selebar ${w} m dibina di sepanjang sisi dalam taman itu. (a) Ungkapkan panjang dan lebar kawasan rumput di dalam laluan. (b) Ungkapkan luas laluan dalam sebutan x.`, ans: `(a) ${pfB(pfL(a, 'x', b - 2 * w))} m dan ${pfB(pfL(1, 'x', -2 * w))} m (b) ${pfS(Pv)} m²`, work: [`(a) Panjang rumput = ${pfS(L)} − ${2 * w} = ${pfS(pfL(a, 'x', b - 2 * w))}; lebar rumput = x − ${2 * w}`, `Luas taman = ${pfB(L)}(x) = ${pfS(pfMul(L, Wd))}`, `Luas rumput = ${pfB(pfL(a, 'x', b - 2 * w))}${pfB(pfL(1, 'x', -2 * w))} = ${pfS(inner)}`, `(b) Luas laluan = ${pfS(pfMul(L, Wd))} − (${pfS(inner)}) = ${pfS(Pv)}`] }, [[`${pfB(L)}x − ${pfB(pfL(a, 'x', b - 2 * w))}${pfB(pfL(1, 'x', -2 * w))}`, pfS(Pv)]]);
};

/* ---------- 2.2 Pemfaktoran ---------- */
// monomial rawak dalam pemboleh ubah vs (kuasa 0-2)
const pfMono = (r, vs, c) => { const e = {}; vs.forEach(v => { e[v] = r.i(0, 2); }); return pfM(c, e); };
const pfMinE = ps => { const e = {}; const all = ps.map(p => pfExp(Object.keys(p)[0])); PFORD.split('').forEach(v => { const m = Math.min(...all.map(x => x[v] || 0)); if (m) e[v] = m; }); return e; };
PF.fstb = r => {
  const d = pfFix(r, () => {
    const vs = r.p(PFV2), n = r.f() < .3 ? 3 : 2, G = r.p([2, 3, 4, 5, 6, 8, 9, 12]);
    const cs = Array.from({ length: n }, () => r.i(1, 7));
    const ts = cs.map(c => pfMono(r, vs, G * c));
    return { vs, ts, cs, G };
  }, d => pfGcdA(d.cs) === 1 && new Set(d.ts.map(pfS)).size === d.ts.length && Object.keys(pfMinE(d.ts)).length > 0);
  const e = pfMinE(d.ts), g = pfM(d.G, e), ans = pfS(g), list = d.ts.length === 2 ? `${pfS(d.ts[0])} dan ${pfS(d.ts[1])}` : `${pfS(d.ts[0])}, ${pfS(d.ts[1])} dan ${pfS(d.ts[2])}`;
  const wrong = String(d.G), why = `${wrong} ialah FSTB bagi pekali sahaja. Pemboleh ubah sepunya (${pfMonoS(pfKey(e))}) juga mesti diambil.`;
  const work = [`FSTB pekali ${d.ts.map(t => pfLead(t)).join(', ')} = ${d.G}`, `Pemboleh ubah sepunya dengan kuasa terkecil: ${pfMonoS(pfKey(e))}`, `FSTB = ${ans}`];
  return pfV(GEN_LQ('fstb', { list, wrong, why, ans, work }), []);
};
PF.fstbF = r => {
  const d = pfFix(r, () => {
    const vs = r.p(PFV2), n = r.f() < .3 ? 3 : 2, G = r.p([2, 3, 4, 5, 6, 7, 8, 9]);
    const g = pfM(G, Object.fromEntries(vs.map(v => [v, r.i(0, 1)])));
    const inner = pfAdd(...Array.from({ length: n }, () => pfMono(r, vs, r.n(-7, 7))));
    return { g, inner, n };
  }, d => pfN(d.inner) === d.n && pfGcdA(pfCo(d.inner)) === 1 && Object.keys(pfMinE(Object.keys(d.inner).map(k => ({ [k]: 1 })))).length === 0 && pfLead(d.inner) > 0 && Object.keys(d.g)[0] !== '' && pfLead(d.g) > 0);
  const E = pfS(pfMul(d.g, d.inner)), ans = `${pfS(d.g)}${pfB(d.inner)}`;
  // separa: keluarkan pekali sahaja
  const gc = pfLead(d.g), part = `${gc}${pfB(pfSc(pfMul(pfM(1, pfExp(Object.keys(d.g)[0])), d.inner), 1))}`;
  const work = [`FSTB bagi semua sebutan = ${pfS(d.g)}`, `Bahagi setiap sebutan dengan ${pfS(d.g)}: ${Object.keys(pfMul(d.g, d.inner)).sort(pfCmp).map(k => `${pfS({ [k]: pfMul(d.g, d.inner)[k] })} ÷ ${pfS(d.g)}`).join(', ')}`, `${E} = ${ans}`];
  return pfV(GEN_LQ('fstbF', { E, part, ans, work }), [[E, ans]]);
};
PF.beza = r => {
  const t = r.i(0, 3), p = r.i(1, 7), q = pfFix(r, () => r.i(1, 9), v => pfGcd(v, p) === 1 && !(p === 1 && v === 1));
  let E, aS, bS;
  if (t === 2) { const v = r.p(['y', 'a', 'k']); aS = String(q); bS = pfS(pfX(v, p)); E = `${q * q} − ${pfS(pfX(v, p * p, 2))}`; }
  else { aS = pfS(pfX('x', p)); bS = t === 3 ? pfS(pfX('y', q)) : String(q); E = pfS(pfMul(pfL(p, 'x', q, t === 3 ? 'y' : ''), pfL(p, 'x', -q, t === 3 ? 'y' : ''))); }
  const ans = `(${aS} + ${bS})(${aS} − ${bS})`, wrong = `(${aS} − ${bS})²`;
  const work = [`${E} = (${aS})² − (${bS})²`, 'a² − b² = (a + b)(a − b)', `= ${ans}`];
  return pfV(GEN_LQ('beza', { E, wrong, ans, work }), [[E, ans]]);
};
// trinomial (px + q)(rx + s); aras: 1 → a = 1, 2 → a > 1
function pfTri(r, lvl) {
  return pfFix(r, () => {
    let p = 1, rr = 1;
    if (lvl === 2) { const a = r.p([2, 3, 4, 5, 6]); const fs = []; for (let i = 1; i <= a; i++) if (a % i === 0) fs.push(i); p = r.p(fs); rr = a / p; if (p < rr) [p, rr] = [rr, p]; }
    const sq = lvl === 1 && r.f() < .2;
    const q = r.n(-9, 9), s = sq ? q : r.n(-9, 9);
    return { p, q, r: rr, s };
  }, o => pfGcd(o.p, o.q) === 1 && pfGcd(o.r, o.s) === 1 && o.p * o.s + o.q * o.r !== 0 && Math.abs(o.q * o.s) <= 60);
}
function pfTriStr(o, v = 'x') {
  const A = pfL(o.p, v, o.q), B = pfL(o.r, v, o.s);
  return pfEq(A, B) ? `${pfB(A)}²` : `${pfB(A)}${pfB(B)}`;
}
PF.trinom = (r, lvl) => {
  const o = pfTri(r, lvl || (r.f() < .5 ? 1 : 2)), A = pfL(o.p, 'x', o.q), B = pfL(o.r, 'x', o.s), P_ = pfMul(A, B), E = pfS(P_), ans = pfTriStr(o);
  // calon jawapan salah: tukar tanda
  const wrong = pfTriStr({ p: o.p, q: -o.q, r: o.r, s: -o.s });   // tanda tertukar: sebutan tengah berubah tanda
  const a = o.p * o.r, c = o.q * o.s, b = o.p * o.s + o.q * o.r;
  const work = (a === 1
    ? [`Cari dua nombor dengan hasil darab ${fmt(c)} dan hasil tambah ${fmt(b)}: ${fmt(o.q)} dan ${fmt(o.s)}`]
    : [`Faktor ${pfS(pfX('x', a, 2))}: ${pfS(pfX('x', o.p))} dan ${pfS(pfX('x', o.r))}; faktor ${fmt(c)}: ${fmt(o.q)} dan ${fmt(o.s)}`,
      `Silang: (${pfS(pfX('x', o.p))})(${fmt(o.s)}) + (${fmt(o.q)})(${pfS(pfX('x', o.r))}) = ${pfS(pfX('x', b))} ✓`]).concat([`${E} = ${ans}`]);
  const res = GEN_LQ('trinom', { E, wrong, ans, work });
  return pfV(Object.assign(res, { figAns: pfCrossFig(o.p, o.q, o.r, o.s) }), [[E, ans]]);
};
PF.kumpul = r => {
  const d = pfFix(r, () => { const [v1, v2] = r.p(PFV2); return { v1, v2, p: r.i(1, 5), q: r.n(-7, 7), rr: r.i(1, 5), s: r.n(-7, 7) }; }, o => pfGcd(o.p, o.q) === 1 && pfGcd(o.rr, o.s) === 1 && !(o.p === 1 && o.rr === 1 && Math.abs(o.q) === 1 && Math.abs(o.s) === 1));
  const { v1, v2, p, q, rr, s } = d, A = pfL(p, v1, q), B = pfL(rr, v2, s);
  const T = [pfM(p * rr, { [v1]: 1, [v2]: 1 }), pfM(p * s, { [v1]: 1 }), pfM(q * rr, { [v2]: 1 }), pfK(q * s)];
  const E = T.map((t, i) => { const st = pfS(t); return i === 0 ? st : st[0] === '−' ? ` − ${st.slice(1)}` : ` + ${st}`; }).join('');
  const ans = `${pfB(A)}${pfB(B)}`, g1 = pfS(pfX(v1, p)), inB = pfB(B);
  const work = [`Kumpul: (${pfS(pfAdd(T[0], T[1]))}) ${q < 0 ? '−' : '+'} (${pfS(pfSc(pfAdd(T[2], T[3]), Math.sign(q)))})`, `= ${g1}${inB} ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${inB}`, `= ${ans}`];
  return pfV(GEN_LQ('kumpul', { E, ans, work }), [[E, ans]]);
};
PF.lengkap = r => {
  const k = r.p([2, 3, 4, 5]), t = r.i(0, 1);
  let inner, ansIn, wk;
  if (t === 0) { const q = r.i(1, 8); inner = pfMul(pfL(1, 'x', q), pfL(1, 'x', -q)); ansIn = `(x + ${q})(x − ${q})`; wk = `x² − ${q * q} = ${ansIn}`; }
  else { const o = pfTri(r, 1); inner = pfMul(pfL(1, 'x', o.q), pfL(1, 'x', o.s)); ansIn = pfTriStr(o); wk = `${pfS(inner)} = ${ansIn}`; }
  const E = pfS(pfSc(inner, k)), ans = `${k}${ansIn}`, part = `${k}(${pfS(inner)})`;
  return pfV(GEN_LQ('lengkap', { E, part, ans, work: [`Keluarkan FSTB ${k}: ${E} = ${part}`, `Faktorkan lagi: ${wk}`, `${E} = ${ans}`] }), [[E, ans]]);
};
PF.k22 = (r, k) => {
  const t = k == null ? r.i(0, 3) : k % 4;
  if (t === 0) {   // luas → lebar
    const o = pfFix(r, () => ({ p: r.i(1, 9), q: r.i(1, 9) }), o => o.p !== o.q), xv = r.i(2, 8), A = pfL(1, 'x', o.p), B = pfL(1, 'x', o.q), P_ = pfMul(A, B);
    return pfV({ q: `Luas sebuah segi empat tepat ialah (${pfS(P_)}) cm² dan panjangnya ${pfB(A)} cm. (a) Faktorkan ${pfS(P_)}. (b) Ungkapkan lebar segi empat tepat itu. (c) Hitung perimeter segi empat tepat itu apabila x = ${xv}.`, ans: `(a) ${pfB(A)}${pfB(B)} (b) ${pfB(B)} cm (c) ${2 * (2 * xv + o.p + o.q)} cm`, work: [`(a) Dua nombor dengan hasil darab ${o.p * o.q} dan hasil tambah ${o.p + o.q}: ${o.p} dan ${o.q}`, `(b) Lebar = luas ÷ panjang = ${pfS(B)}`, `(c) Perimeter = 2[${pfB(A)} + ${pfB(B)}] = ${pfS(pfSc(pfAdd(A, B), 2))} = ${2 * (2 * xv + o.p + o.q)} cm`] }, [[pfS(P_), `${pfB(A)}${pfB(B)}`]]);
  }
  if (t === 1) {   // aritmetik beza dua kuasa dua
    const a = r.i(51, 99), b = pfFix(r, () => r.i(1, 49), v => (a + v) % 100 === 0 || (a - v) % 10 === 0);
    return pfV({ q: `Dengan menggunakan pemfaktoran beza dua kuasa dua, hitung nilai ${a}² − ${b}² tanpa menggunakan kalkulator. Tunjukkan langkah kerja anda.`, ans: `${a * a - b * b}`, work: ['a² − b² = (a + b)(a − b)', `${a}² − ${b}² = (${a} + ${b})(${a} − ${b})`, `= ${a + b} × ${a - b} = ${a * a - b * b}`] }, [[`${a}² − ${b}²`, `${a * a - b * b}`]]);
  }
  if (t === 2) {   // kebun segi empat sama
    const a = r.i(2, 5), b = pfFix(r, () => r.i(1, 7), v => pfGcd(a, v) === 1), A = pfL(a, 'x', b), P_ = pfMul(A, A);
    return pfV({ q: `Sebuah kebun berbentuk segi empat sama mempunyai luas (${pfS(P_)}) m². (a) Faktorkan ${pfS(P_)}. (b) Ungkapkan perimeter kebun itu dalam sebutan x.`, ans: `(a) ${pfB(A)}² (b) (${pfS(pfSc(A, 4))}) m`, work: [`(a) ${pfS(P_)} = (${pfS(pfX('x', a))})² + 2(${pfS(pfX('x', a))})(${b}) + ${b}² = ${pfB(A)}²`, `Panjang sisi = ${pfS(A)}`, `(b) Perimeter = 4${pfB(A)} = ${pfS(pfSc(A, 4))}`] }, [[pfS(P_), `${pfB(A)}²`]]);
  }
  // t === 3: kumpul sebutan + nilai
  const p = r.i(1, 3), q = r.n(-5, 5), rr = r.i(1, 3), s = r.n(-5, 5), xv = r.i(1, 6), yv = r.i(1, 6);
  const A = pfL(p, 'x', q), B = pfL(rr, 'y', s), P_ = pfMul(A, B), va = (p * xv + q) * (rr * yv + s);
  return pfV({ q: `(a) Faktorkan ${pfS(P_)}. (b) Seterusnya, cari nilai ungkapan itu apabila x = ${xv} dan y = ${yv}.`, ans: `(a) ${pfB(A)}${pfB(B)} (b) ${fmt(va)}`, work: [`(a) Kumpul sebutan: ${pfS(pfX('x', p))}${pfB(B)} ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}${pfB(B)} = ${pfB(A)}${pfB(B)}`, `(b) (${p * xv + q})(${rr * yv + s}) = ${fmt(va)}`] }, [[pfS(P_), `${pfB(A)}${pfB(B)}`]]);
};

/* ---------- 2.3 Pecahan algebra ---------- */
const pfJoin = (a, op, b) => `${a} ${op} ${b}`;
// pecahan penyebut sama: (a1x + b1)/k ± (a2x + b2)/k
PF.samaP = r => {
  const d = pfFix(r, () => {
    const v = r.p(['x', 'y', 'm', 'p']), k = r.i(2, 9), s = pfSgn(r);
    const N1 = pfL(r.i(1, 6), v, r.n(-8, 8)), N2 = pfL(r.i(1, 6), v, r.n(-8, 8)), den = r.f() < .3 ? pfX(v, k) : pfK(k);
    return { v, k, s, N1, N2, den };
  }, d => pfN(pfAdd(d.N1, pfSc(d.N2, d.s))) === 2);
  const { s, N1, N2, den } = d, NR = pfAdd(N1, pfSc(N2, s)), de = Object.keys(den)[0] ? pfExp(Object.keys(den)[0]) : {};
  const R = pfPM(NR, den[Object.keys(den)[0]], de), ans = pfPMs(R), E = pfJoin(pfF(pfS(N1), pfS(den)), s > 0 ? '+' : '−', pfF(pfS(N2), pfS(den)));
  const wrong = pfF(pfS(NR), pfS(pfSc(den, 2)));
  const comb = s > 0 ? `${pfS(N1)} + ${pfS(N2)}` : `${pfS(N1)} − ${pfB(N2)}`;
  const work = [`Penyebut sama: ${pfF(comb, pfS(den))}`, `= ${pfF(pfS(NR), pfS(den))}`].concat(ans !== pfF(pfS(NR), pfS(den)) ? [`= ${ans}`] : []);
  return pfV(GEN_LQ('samaP', { E, wrong, ans, work }), [[E, ans]]);
};
// penyebut berbeza (monomial)
PF.bezaP = (r, k) => {
  const t = k == null ? r.i(0, 2) : k % 3, s = pfSgn(r);
  let E, R, work, wrong;
  if (t === 0) {        // a/(pv) ± b/(qv)
    const d = pfFix(r, () => ({ v: r.p(['x', 'y', 'p', 'm', 'k']), a: r.i(1, 9), b: r.i(1, 9), p: r.i(2, 6), q: r.i(2, 8) }), o => o.p !== o.q && pfLcm(o.p, o.q) <= 24 && o.a * pfLcm(o.p, o.q) / o.p + s * o.b * pfLcm(o.p, o.q) / o.q !== 0 && pfGcd(o.a, o.p) === 1 && pfGcd(o.b, o.q) === 1);
    const L = pfLcm(d.p, d.q), n1 = d.a * L / d.p, n2 = d.b * L / d.q;
    E = pfJoin(pfF(d.a, pfS(pfX(d.v, d.p))), s > 0 ? '+' : '−', pfF(d.b, pfS(pfX(d.v, d.q))));
    R = pfPM(pfK(n1 + s * n2), L, { [d.v]: 1 });
    wrong = pfF(d.a + s * d.b === 0 ? d.a + d.b : fmt(d.a + s * d.b), pfS(pfX(d.v, d.p + d.q)));
    work = [`GSTK bagi ${pfS(pfX(d.v, d.p))} dan ${pfS(pfX(d.v, d.q))} = ${pfS(pfX(d.v, L))}`, `= ${pfF(n1, pfS(pfX(d.v, L)))} ${s > 0 ? '+' : '−'} ${pfF(n2, pfS(pfX(d.v, L)))}`, `= ${pfF(fmt(n1 + s * n2), pfS(pfX(d.v, L)))}`];
  } else if (t === 1) { // a/v ± b/w
    const [v, w] = r.p(PFV2), a = r.i(1, 9), b = r.i(1, 9);
    E = pfJoin(pfF(a, v), s > 0 ? '+' : '−', pfF(b, w));
    R = pfPM(pfAdd(pfX(w, a), pfX(v, s * b)), 1, { [v]: 1, [w]: 1 });
    wrong = pfF(a + s * b === 0 ? a + b : fmt(a + s * b), `${v} ${s > 0 ? '+' : '−'} ${w}`);
    work = [`GSTK bagi ${v} dan ${w} = ${v}${w}`, `= ${pfF(pfS(pfX(w, a)), v + w)} ${s > 0 ? '+' : '−'} ${pfF(pfS(pfX(v, b)), v + w)}`];
  } else {              // a/(px) ± b/(qx²)
    const d = pfFix(r, () => ({ v: r.p(['x', 'y', 'a']), a: r.i(1, 7), b: r.i(1, 7), p: r.i(1, 5), q: r.i(2, 6) }), o => o.p !== o.q && pfLcm(o.p, o.q) <= 20 && pfGcd(o.a, o.p) === 1 && pfGcd(o.b, o.q) === 1);
    const L = pfLcm(d.p, d.q), n1 = d.a * L / d.p, n2 = d.b * L / d.q, v = d.v;
    E = pfJoin(pfF(d.a, pfS(pfX(v, d.p))), s > 0 ? '+' : '−', pfF(d.b, pfS(pfX(v, d.q, 2))));
    R = pfPM(pfAdd(pfX(v, n1), pfK(s * n2)), L, { [v]: 2 });
    wrong = pfF(d.a + s * d.b === 0 ? d.a + d.b : fmt(d.a + s * d.b), pfS(pfAdd(pfX(v, d.p), pfX(v, d.q, 2))));
    work = [`GSTK bagi ${pfS(pfX(v, d.p))} dan ${pfS(pfX(v, d.q, 2))} = ${pfS(pfX(v, L, 2))}`, `= ${pfF(pfS(pfX(v, n1)), pfS(pfX(v, L, 2)))} ${s > 0 ? '+' : '−'} ${pfF(n2, pfS(pfX(v, L, 2)))}`];
  }
  const ans = pfPMs(R);
  if (work[work.length - 1] !== `= ${ans}`) work.push(`= ${ans}`);
  return pfV(GEN_LQ('bezaP', { E, wrong, ans, work }), [[E, ans]]);
};
// pecahan monomial rawak dengan pengangka & penyebut tanpa faktor sepunya
function pfMFrand(r, vs) {
  return pfFix(r, () => {
    const nc = r.n(-9, 9), dc = r.i(1, 9), ne = {}, de = {};
    vs.forEach(v => { const k = r.i(-2, 2); if (k > 0) ne[v] = k; if (k < 0) de[v] = -k; });
    return { nc, dc, ne, de };
  }, o => pfGcd(o.nc, o.dc) === 1 && !(o.dc === 1 && !Object.keys(o.de).length) && Object.keys(o.ne).length + Object.keys(o.de).length > 0 && (o.nc > 0 || r.f() < .3));
}
const pfMFof = o => { const e = Object.assign({}, o.ne); Object.keys(o.de).forEach(v => { e[v] = -o.de[v]; }); return pfMF(o.nc, o.dc, e); };
const pfMFw = o => pfMFraw(o.nc, o.ne, o.dc, o.de);
PF.darab = r => {
  const vs = r.p(PFV2), a = pfMFrand(r, vs), b = pfFix(r, () => pfMFrand(r, vs), b => pfMFs(pfMFmul(pfMFof(a), pfMFof(b))) !== '1');
  const A = pfMFof(a), B = pfMFof(b), Rm = pfMFmul(A, B), E = `${pfMFw(a)} × ${pfMFw(b)}`, ans = pfMFs(Rm);
  const rawN = pfS(pfMul(pfM(a.nc, a.ne), pfM(b.nc, b.ne))), rawD = pfS(pfMul(pfM(a.dc, a.de), pfM(b.dc, b.de)));
  const work = ['Darab pengangka dengan pengangka, penyebut dengan penyebut', `= ${pfF(rawN, rawD)}`].concat(pfF(rawN, rawD) === ans ? [] : [`= ${ans}`]);
  return pfV(GEN_LQ('darab', { E, ans, work }), [[E, ans]]);
};
PF.bahagi = r => {
  const vs = r.p(PFV2), a = pfMFrand(r, vs), b = pfFix(r, () => pfMFrand(r, vs), b => b.nc > 0 && pfMFs(pfMFmul(pfMFof(a), pfMFinv(pfMFof(b)))) !== '1' && pfMFs(pfMFmul(pfMFof(a), pfMFof(b))) !== pfMFs(pfMFmul(pfMFof(a), pfMFinv(pfMFof(b)))));
  const A = pfMFof(a), Bi = pfMFinv(pfMFof(b)), Rm = pfMFmul(A, Bi), E = `${pfMFw(a)} ÷ ${pfMFw(b)}`, ans = pfMFs(Rm);
  const wrong = pfMFs(pfMFmul(A, pfMFof(b)));
  const raw = pfF(pfS(pfMul(pfM(a.nc, a.ne), pfM(b.dc, b.de))), pfS(pfMul(pfM(a.dc, a.de), pfM(b.nc, b.ne))));
  const work = [`Darab dengan salingan: ${pfMFw(a)} × ${pfMFraw(b.dc, b.de, b.nc, b.ne)}`, `= ${raw}`].concat(raw === ans ? [] : [`= ${ans}`]);
  return pfV(GEN_LQ('bahagi', { E, wrong, ans, work }), [[E, ans]]);
};
// permudahkan dengan pemfaktoran
PF.permudahF = (r, k) => {
  const t = k == null ? r.i(0, 3) : k % 4;
  let N, D, Nf, Df, ans, cf;
  if (t === 0) {        // (x² − b²)/(kx ± kb)
    const b = r.i(1, 9), kk = r.i(2, 7), s = pfSgn(r);
    N = pfMul(pfL(1, 'x', b), pfL(1, 'x', -b)); D = pfL(kk, 'x', s * kk * b);
    Nf = `(x + ${b})(x − ${b})`; Df = `${kk}(x ${s > 0 ? '+' : '−'} ${b})`; cf = `(x ${s > 0 ? '+' : '−'} ${b})`;
    ans = pfF(`x ${s > 0 ? '−' : '+'} ${b}`, kk);
  } else if (t === 1) { // (x + p)(x + q)/(x + p)
    const o = pfFix(r, () => ({ p: r.n(-8, 8), q: r.n(-8, 8) }), o => o.p !== o.q && o.p + o.q !== 0);
    N = pfMul(pfL(1, 'x', o.p), pfL(1, 'x', o.q)); D = pfL(1, 'x', o.p);
    Nf = `${pfB(pfL(1, 'x', o.p))}${pfB(pfL(1, 'x', o.q))}`; Df = pfB(D); cf = pfB(D);
    ans = pfS(pfL(1, 'x', o.q));
  } else if (t === 2) { // (kx + kp)/((x + p)(x + q))
    const o = pfFix(r, () => ({ p: r.n(-8, 8), q: r.n(-8, 8), k: r.i(2, 6) }), o => o.p !== o.q && o.p + o.q !== 0);
    N = pfL(o.k, 'x', o.k * o.p); D = pfMul(pfL(1, 'x', o.p), pfL(1, 'x', o.q));
    Nf = `${o.k}${pfB(pfL(1, 'x', o.p))}`; Df = `${pfB(pfL(1, 'x', o.p))}${pfB(pfL(1, 'x', o.q))}`; cf = pfB(pfL(1, 'x', o.p));
    ans = pfF(o.k, pfS(pfL(1, 'x', o.q)));
  } else {              // (x² − p²)/(x² + (p + q)x + pq) = (x − p)/(x + q)
    const o = pfFix(r, () => ({ p: r.i(1, 8), q: r.n(-8, 8) }), o => o.q !== o.p && o.q !== -o.p && o.p + o.q !== 0);
    N = pfMul(pfL(1, 'x', o.p), pfL(1, 'x', -o.p)); D = pfMul(pfL(1, 'x', o.p), pfL(1, 'x', o.q));
    Nf = `(x + ${o.p})(x − ${o.p})`; Df = `(x + ${o.p})${pfB(pfL(1, 'x', o.q))}`; cf = `(x + ${o.p})`;
    ans = pfF(`x − ${o.p}`, pfS(pfL(1, 'x', o.q)));
  }
  const E = pfF(pfS(N), pfS(D));
  const work = [`Faktorkan: ${pfF(Nf, Df)}`, `Batalkan faktor sepunya ${cf}`, `= ${ans}`];
  return pfV(GEN_LQ('permudahF', { E, ans, work }), [[E, ans], [pfF(Nf, Df), ans]]);
};
// (x + a)/p ± (x + b)/q
PF.tolakK = r => {
  const d = pfFix(r, () => ({ v: r.p(['x', 'y', 'm']), p: r.i(2, 6), q: r.i(2, 7), a: r.n(-7, 7), b: r.n(-7, 7), c1: r.i(1, 3), c2: r.i(1, 3), s: r.f() < .7 ? -1 : 1 }), o => o.p !== o.q && pfLcm(o.p, o.q) <= 30 && pfN(pfAdd(pfSc(pfL(o.c1, o.v, o.a), pfLcm(o.p, o.q) / o.p), pfSc(pfL(o.c2, o.v, o.b), o.s * pfLcm(o.p, o.q) / o.q))) === 2);
  const { v, p, q, a, b, c1, c2, s } = d, L = pfLcm(p, q), N1 = pfL(c1, v, a), N2 = pfL(c2, v, b);
  const NR = pfAdd(pfSc(N1, L / p), pfSc(N2, s * L / q)), R = pfPM(NR, L, {}), ans = pfPMs(R);
  const E = pfJoin(pfF(pfS(N1), p), s > 0 ? '+' : '−', pfF(pfS(N2), q));
  const m1 = L / p === 1 ? pfS(N1) : `${L / p}${pfB(N1)}`, m2 = L / q === 1 ? pfB(N2) : `${L / q}${pfB(N2)}`;
  const ex = pfS(pfSc(N1, L / p)) + ' ' + (s > 0 ? '+ ' + pfS(pfSc(N2, L / q)) : (s < 0 ? pfS(pfSc(N2, -L / q)).replace(/^(−?)/, m => (m ? '− ' : '+ ')) : ''));
  const work = [`GSTK bagi ${p} dan ${q} = ${L}`, `= ${pfF(`${m1} ${s > 0 ? '+' : '−'} ${m2}`, L)}`, `= ${pfF(ex, L)}`, `= ${pfF(pfS(NR), L)}`].concat(ans !== pfF(pfS(NR), L) ? [`= ${ans}`] : []);
  return pfV(GEN_LQ('tolakK', { E, ans, work }), [[E, ans], [pfF(ex, L), ans]]);
};
// darab / bahagi dengan pemfaktoran
PF.darabF = (r, k) => {
  const t = k == null ? r.i(0, 1) : k % 2, a = r.i(1, 7), kk = r.i(2, 5), m = r.i(2, 5);
  const Dm = pfMul(pfL(1, 'x', a), pfL(1, 'x', -a));
  if (t === 0) {   // (x + a)/(kx) ÷ (x² − a²)/(kmx²) = mx/(x − a)
    const E = `${pfF(`x + ${a}`, pfS(pfX('x', kk)))} ÷ ${pfF(pfS(Dm), pfS(pfX('x', kk * m, 2)))}`, ans = pfF(pfS(pfX('x', m)), `x − ${a}`);
    return pfV(GEN_LQ('darabF', { E, ans, work: [`Darab dengan salingan: ${pfF(`x + ${a}`, pfS(pfX('x', kk)))} × ${pfF(pfS(pfX('x', kk * m, 2)), pfS(Dm))}`, `Faktorkan: ${pfS(Dm)} = (x + ${a})(x − ${a})`, `= ${pfF(`(x + ${a}) × ${pfS(pfX('x', kk * m, 2))}`, `${pfS(pfX('x', kk))}(x + ${a})(x − ${a})`)}`, `Batalkan (x + ${a}) dan ${pfS(pfX('x', kk))}: ${ans}`] }), [[E, ans]]);
  }
  // (x² − a²)/(kx) × kmx²/(x + a) = mx(x − a)
  const E = `${pfF(pfS(Dm), pfS(pfX('x', kk)))} × ${pfF(pfS(pfX('x', kk * m, 2)), `x + ${a}`)}`, ans = `${pfS(pfX('x', m))}(x − ${a})`;
  return pfV(GEN_LQ('darabF', { E, ans, work: [`Faktorkan: ${pfS(Dm)} = (x + ${a})(x − ${a})`, `= ${pfF(`(x + ${a})(x − ${a}) × ${pfS(pfX('x', kk * m, 2))}`, `${pfS(pfX('x', kk))}(x + ${a})`)}`, `Batalkan (x + ${a}) dan ${pfS(pfX('x', kk))}: ${ans}`] }), [[E, ans]]);
};
PF.k23 = (r, k) => {
  const t = k == null ? r.i(0, 3) : k % 4;
  if (t === 0) {   // a/(x + p) + b/(x + q)
    const o = pfFix(r, () => ({ a: r.i(1, 6), b: r.i(1, 6), p: r.n(-6, 6), q: r.n(-6, 6), s: pfSgn(r) }), o => o.p !== o.q && o.a + o.s * o.b !== 0);
    const P1 = pfL(1, 'x', o.p), Q1 = pfL(1, 'x', o.q), NR = pfAdd(pfSc(Q1, o.a), pfSc(P1, o.s * o.b)), Dd = `${pfB(P1)}${pfB(Q1)}`;
    const E = pfJoin(pfF(o.a, pfS(P1)), o.s > 0 ? '+' : '−', pfF(o.b, pfS(Q1)));
    const g = pfGcdA(pfCo(NR)), ans = pfF(pfS(NR), Dd);
    return pfV({ q: `Tulis ${E} sebagai satu pecahan tunggal dengan penyebut ${Dd}.`, ans, work: [`Penyebut sepunya = ${Dd}`, `= ${pfF(`${o.a}${pfB(Q1)} ${o.s > 0 ? '+' : '−'} ${o.b}${pfB(P1)}`, Dd)}`, `= ${pfF(`${pfS(pfSc(Q1, o.a))} ${o.s > 0 ? '+ ' + pfS(pfSc(P1, o.b)) : pfS(pfSc(P1, -o.b)).replace(/^(−?)/, m => (m ? '− ' : '+ '))}`, Dd)}`, `= ${ans}`].concat(g > 1 ? [] : []) }, [[E, ans]]);
  }
  if (t === 1) {   // luas ÷ panjang
    const a = r.i(1, 9), xv = pfFix(r, () => r.i(2, 12), v => v > a);
    return pfV({ q: `Luas sebuah segi empat tepat ialah (x² − ${a * a}) cm² dan panjangnya (x + ${a}) cm. (a) Ungkapkan lebar segi empat tepat itu dalam bentuk termudah. (b) Ungkapkan perimeter segi empat tepat itu. (c) Hitung perimeter apabila x = ${xv}.`, ans: `(a) (x − ${a}) cm (b) 4x cm (c) ${4 * xv} cm`, work: [`(a) Lebar = ${pfF(`x² − ${a * a}`, `x + ${a}`)} = ${pfF(`(x + ${a})(x − ${a})`, `x + ${a}`)} = x − ${a}`, `(b) Perimeter = 2[(x + ${a}) + (x − ${a})] = 2(2x) = 4x`, `(c) 4(${xv}) = ${4 * xv} cm`] }, [[pfF(`x² − ${a * a}`, `x + ${a}`), `x − ${a}`]]);
  }
  if (t === 2) {   // (a/(2x) + b/x) × 2k x²/(a + 2b) = kx
    const a = pfFix(r, () => r.i(1, 9), v => v % 2 === 1), b = r.i(1, 6), kk = r.i(2, 5), S_ = a + 2 * b;
    const E = `(${pfF(a, '2x')} + ${pfF(b, 'x')}) × ${pfF(`${2 * kk}x²`, S_)}`;
    return pfV({ q: `Hitung dan permudahkan ${E}.`, ans: `${kk}x`, work: [`${pfF(a, '2x')} + ${pfF(b, 'x')} = ${pfF(a, '2x')} + ${pfF(2 * b, '2x')} = ${pfF(S_, '2x')}`, `${pfF(S_, '2x')} × ${pfF(`${2 * kk}x²`, S_)} = ${pfF(`${S_ * 2 * kk}x²`, `${2 * S_}x`)}`, `= ${kk}x`] }, [[E, `${kk}x`]]);
  }
  // t === 3: masa perjalanan
  const v1 = r.i(2, 6), v2 = pfFix(r, () => r.i(2, 6), v => v !== v1), d = r.p([12, 24, 30, 60]), L = pfLcm(v1, v2);
  const R = pfPM(pfK(d * (L / v1) + d * (L / v2)), L, { x: 1 }), ans = pfPMs(R);
  return pfV({ q: `Amir berbasikal sejauh ${d} km dengan laju ${v1}x km/j, kemudian berjalan sejauh ${d} km dengan laju ${v2}x km/j. Masa = jarak ÷ laju. Ungkapkan jumlah masa perjalanannya, dalam jam, sebagai satu pecahan tunggal dalam bentuk termudah.`, ans: `${ans} jam`, work: [`Masa = ${pfF(d, `${v1}x`)} + ${pfF(d, `${v2}x`)}`, `GSTK = ${L}x: ${pfF(d * L / v1, `${L}x`)} + ${pfF(d * L / v2, `${L}x`)} = ${pfF(d * L / v1 + d * L / v2, `${L}x`)}`, `= ${ans}`] }, [[`${pfF(d, `${v1}x`)} + ${pfF(d, `${v2}x`)}`, ans]]);
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '2.1': {
    m: [() => PF.tunggal(pfRG), () => PF.dua(pfRG), () => PF.dua(pfRG), () => PF.khas(pfRG)],
    s: [() => PF.permudah(pfRG), () => PF.luas(pfRG), () => PF.lorek(pfRG), () => PF.pekali(pfRG), () => PF.cariMN(pfRG)],
    k: [() => PF.k21(pfRG)]
  },
  '2.2': {
    m: [() => PF.fstb(pfRG), () => PF.fstbF(pfRG), () => PF.beza(pfRG), () => PF.trinom(pfRG, 1)],
    s: [() => PF.trinom(pfRG, 2), () => PF.kumpul(pfRG), () => PF.lengkap(pfRG)],
    k: [() => PF.k22(pfRG)]
  },
  '2.3': {
    m: [() => PF.samaP(pfRG), () => PF.bezaP(pfRG), () => PF.darab(pfRG), () => PF.bahagi(pfRG)],
    s: [() => PF.permudahF(pfRG), () => PF.tolakK(pfRG), () => PF.darabF(pfRG)],
    k: [() => PF.k23(pfRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 2.1
WG.tunggal = () => PF.tunggal(pfRW);
WG.dua = () => PF.dua(pfRW);
WG.khas = i => PF.khas(pfRW, i);
WG.permudah = i => PF.permudah(pfRW, i);
WG.luas = () => PF.luas(pfRW);
WG.lorek = () => PF.lorek(pfRW);
WG.pekali = () => PF.pekali(pfRW);
WG.cariMN = () => PF.cariMN(pfRW);
WG.k21 = i => PF.k21(pfRW, i);
// 2.2
WG.fstb = () => PF.fstb(pfRW);
WG.fstbF = () => PF.fstbF(pfRW);
WG.beza = () => PF.beza(pfRW);
WG.trinom1 = () => PF.trinom(pfRW, 1);
WG.trinom2 = () => PF.trinom(pfRW, 2);
WG.kumpul = () => PF.kumpul(pfRW);
WG.lengkap = () => PF.lengkap(pfRW);
WG.k22 = i => PF.k22(pfRW, i);
// 2.3
WG.samaP = () => PF.samaP(pfRW);
WG.bezaP = i => PF.bezaP(pfRW, i);
WG.darab = () => PF.darab(pfRW);
WG.bahagi = () => PF.bahagi(pfRW);
WG.permudahF = i => PF.permudahF(pfRW, i);
WG.tolakK = () => PF.tolakK(pfRW);
WG.darabF = i => PF.darabF(pfRW, i);
WG.k23 = i => PF.k23(pfRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '2.1': [['m', 'tunggal', 6], ['m', 'dua', 7], ['m', 'khas', 5], ['s', 'permudah', 4], ['s', 'luas', 2], ['s', 'lorek', 1], ['s', 'pekali', 1], ['s', 'cariMN', 1], ['k', 'k21', 3]],
  '2.2': [['m', 'fstb', 4], ['m', 'fstbF', 5], ['m', 'beza', 5], ['m', 'trinom1', 4], ['s', 'trinom2', 4], ['s', 'kumpul', 3], ['s', 'lengkap', 2], ['k', 'k22', 3]],
  '2.3': [['m', 'samaP', 5], ['m', 'bezaP', 5], ['m', 'darab', 4], ['m', 'bahagi', 4], ['s', 'permudahF', 4], ['s', 'tolakK', 3], ['s', 'darabF', 2], ['k', 'k23', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan: jawapan + calon salah (unik); calon tambahan dijana oleh fb(k) jika kurang
function pfOpts(ans, cands, fb) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c && !seen.has(c)) { seen.add(c); w.push(c); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const c = fb(k); if (c && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pfMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
// calon polinomial: ditapis supaya tidak sama dengan jawapan
const pfPolyOpts = (P_, cands) => pfOpts(pfS(P_), cands.filter(c => !pfEq(c, P_)).map(pfS), k => pfS(pfAdd(P_, pfK(k % 2 ? k : -k))));
const CQGEN = {
  kembangan: [
    () => { const kc = pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]), k = Math.random() < .5 ? pfK(kc) : pfX('x', kc), A = pfL(ri(1, 5), 'x', nz(-9, 9)), P_ = pfMul(k, A), ks = Object.keys(A).sort(pfCmp);
      return pfMcq(`Kembangkan ${pfPre(k)}${pfB(A)}.`, pfCardFig([`${pfPre(k)}${pfB(A)}`], 'KEMBANGKAN'), pfPolyOpts(P_, [pfAdd(pfMul(k, { [ks[0]]: A[ks[0]] }), { [ks[1]]: A[ks[1]] }), pfMul(pfSc(k, -1), A), pfAdd(pfMul(k, { [ks[0]]: A[ks[0]] }), pfSc(pfMul(k, { [ks[1]]: A[ks[1]] }), -1))])); },
    () => { const a = nz(-7, 7), b = nz(-7, 7), A = pfL(1, 'x', a), B = pfL(1, 'x', b), P_ = pfMul(A, B), E = `${pfB(A)}${pfB(B)}`;
      return pfMcq(`Kembangkan ${E}.`, pfCardFig([E], 'KEMBANGKAN'), pfPolyOpts(P_, [pfAdd(pfX('x', 1, 2), pfK(a * b)), pfAdd(pfX('x', 1, 2), pfX('x', a * b), pfK(a + b)), pfAdd(pfX('x', 1, 2), pfX('x', a + b), pfK(-a * b)), pfAdd(pfX('x', 1, 2), pfX('x', -(a + b)), pfK(a * b))])); },
    () => {
      if (Math.random() < .5) { const a = ri(1, 4), b = nz(-8, 8), A = pfL(a, 'x', b), P_ = pfMul(A, A), E = `${pfB(A)}²`;
        return pfMcq(`Kembangkan ${E}.`, pfCardFig([E], 'KEMBANGKAN'), pfPolyOpts(P_, [pfAdd(pfX('x', a * a, 2), pfK(b * b)), pfAdd(pfX('x', a * a, 2), pfX('x', a * b), pfK(b * b)), pfAdd(pfX('x', a * a, 2), pfX('x', -2 * a * b), pfK(b * b)), pfAdd(pfX('x', a, 2), pfX('x', 2 * a * b), pfK(b * b))])); }
      const a = ri(1, 3), b = nz(-6, 6), c = ri(1, 3), d = nz(-6, 6), A = pfL(a, 'x', b), B = pfL(c, 'x', d), P_ = pfMul(A, B), E = `${pfB(A)}${pfB(B)}`;
      return pfMcq(`Kembangkan ${E}.`, pfCardFig([E], 'KEMBANGKAN'), pfPolyOpts(P_, [pfAdd(pfX('x', a * c, 2), pfK(b * d)), pfAdd(pfX('x', a * c, 2), pfX('x', -(a * d + b * c)), pfK(b * d)), pfAdd(pfX('x', a * c, 2), pfX('x', a * d + b * c), pfK(-b * d)), pfAdd(pfX('x', a + c, 2), pfX('x', a * d + b * c), pfK(b * d))]));
    }
  ],
  faktor: [
    () => { const r = pfRG, q = PF_cqF(r); return q; },
    () => { const p = ri(1, 6), q = pfFix(pfRG, () => ri(1, 9), v => pfGcd(v, p) === 1 && !(p === 1 && v === 1)), A = pfL(p, 'x', q), B = pfL(p, 'x', -q), E = pfS(pfMul(A, B)), ans = `${pfB(A)}${pfB(B)}`;
      return pfMcq(`Faktorkan ${E}.`, pfCardFig([E], 'FAKTORKAN'), pfOpts(ans, [`${pfB(B)}²`, `${pfB(A)}²`, `${pfB(pfL(p * p, 'x', q))}${pfB(pfL(p * p, 'x', -q))}`, `${pfB(pfL(p, 'x', q * q))}${pfB(pfL(p, 'x', -q * q))}`], k => `${pfB(pfL(p, 'x', q + k))}${pfB(pfL(p, 'x', -q - k))}`)); },
    () => { const [v1, v2] = pick(PFV2), p = ri(1, 4), q = nz(-6, 6), rr = ri(1, 4), s = nz(-6, 6), A = pfL(p, v1, q), B = pfL(rr, v2, s);
      const T = [pfM(p * rr, { [v1]: 1, [v2]: 1 }), pfM(p * s, { [v1]: 1 }), pfM(q * rr, { [v2]: 1 }), pfK(q * s)], P_ = pfAdd(...T);
      const E = T.map((t, i) => { const st = pfS(t); return i === 0 ? st : st[0] === '−' ? ` − ${st.slice(1)}` : ` + ${st}`; }).join(''), ans = `${pfB(A)}${pfB(B)}`;
      const c = [[p, -q, rr, -s], [p, s, rr, q], [rr, q, p, s], [p, -q, rr, s], [p, q, rr, -s]].filter(([a, b, c_, d]) => !pfEq(pfMul(pfL(a, v1, b), pfL(c_, v2, d)), P_)).map(([a, b, c_, d]) => `${pfB(pfL(a, v1, b))}${pfB(pfL(c_, v2, d))}`);
      return pfMcq(`Faktorkan ${E}.`, pfCardFig([E], 'KUMPUL SEBUTAN'), pfOpts(ans, c, k => `${pfB(pfL(p, v1, q + k))}${pfB(B)}`)); }
  ],
  trinomial: [
    () => pfCqTri(1, true), () => pfCqTri(1, false), () => pfCqTri(2, false)
  ],
  pecahan: [
    () => pfCqSama(),
    () => (Math.random() < .5 ? pfCqMF('darab') : pfCqMF('bahagi')),
    () => pfCqPerm()
  ]
};
// FSTB (games aras 0)
function PF_cqF(r) {
  const d = pfFix(r, () => { const vs = r.p(PFV2), G = r.p([2, 3, 4, 5, 6]), g = pfM(G, { [vs[0]]: r.i(0, 1) }), inner = pfL(r.i(1, 6), vs[0], r.n(-7, 7), r.f() < .4 ? vs[1] : ''); return { G, g, inner }; }, d => pfGcdA(pfCo(d.inner)) === 1 && pfLead(d.inner) > 0);
  const E = pfS(pfMul(d.g, d.inner)), ans = `${pfS(d.g)}${pfB(d.inner)}`, P_ = pfMul(d.g, d.inner);
  const ks = Object.keys(d.inner).sort(pfCmp), half = pfAdd({ [ks[0]]: d.inner[ks[0]] }, pfMul(d.g, { [ks[1]]: d.inner[ks[1]] }));
  const c = [`${pfS(d.g)}${pfB(half)}`, `${pfS(pfSc(d.g, 2))}${pfB(d.inner)}`, `${pfS(d.g)}${pfB(pfSc(d.inner, -1))}`].filter(s => s !== ans);
  return pfMcq(`Faktorkan ${E}.`, pfCardFig([E], 'FAKTORKAN'), pfOpts(ans, c, k => `${pfS(d.g)}${pfB(pfAdd(d.inner, pfK(k)))}`));
}
function pfCqTri(lvl, pos) {
  const o = pfFix(pfRG, () => pfTri(pfRG, lvl), o => !pos || (o.q > 0 && o.s > 0));
  const A = pfL(o.p, 'x', o.q), B = pfL(o.r, 'x', o.s), P_ = pfMul(A, B), E = pfS(P_), ans = pfTriStr(o);
  const alts = [[o.p, -o.q, o.r, -o.s], [o.p, o.s, o.r, o.q], [o.p, -o.q, o.r, o.s], [o.p, o.q, o.r, -o.s], [o.r, o.q, o.p, o.s]];
  const c = alts.filter(([a, b, c_, d]) => pfGcd(a, b) === 1 && pfGcd(c_, d) === 1 && !pfEq(pfMul(pfL(a, 'x', b), pfL(c_, 'x', d)), P_)).map(([a, b, c_, d]) => pfTriStr({ p: a, q: b, r: c_, s: d }));
  return pfMcq(`Faktorkan ${E}.`, pfCardFig([E], 'FAKTORKAN'), pfOpts(ans, c, k => pfTriStr({ p: o.p, q: o.q + k, r: o.r, s: o.s })));
}
// pecahan monomial: darab / bahagi
function pfCqMF(kind) {
  const vs = pick(PFV2), a = pfMFrand(pfRG, vs), b = pfFix(pfRG, () => pfMFrand(pfRG, vs), b => b.nc > 0);
  const A = pfMFof(a), B = pfMFof(b), Bi = pfMFinv(B), R = kind === 'darab' ? pfMFmul(A, B) : pfMFmul(A, Bi), ans = pfMFs(R);
  const E = `${pfMFw(a)} ${kind === 'darab' ? '×' : '÷'} ${pfMFw(b)}`;
  const c = [pfMFs(kind === 'darab' ? pfMFmul(A, Bi) : pfMFmul(A, B)), pfMFs(pfMFinv(R)), pfMFs(pfMF(-R.n, R.d, R.e)), pfMFs(pfMF(R.n * 2, R.d, R.e))];
  return pfMcq(`${kind === 'darab' ? 'Hitung' : 'Permudahkan'} ${E}.`, pfCardFig([{ n: pfS(pfM(a.nc, a.ne)), d: pfS(pfM(a.dc, a.de)) }, kind === 'darab' ? '×' : '÷', { n: pfS(pfM(b.nc, b.ne)), d: pfS(pfM(b.dc, b.de)) }], kind === 'darab' ? 'DARAB' : 'BAHAGI'), pfOpts(ans, c, k => pfMFs(pfMF(R.n + k, R.d, R.e))));
}
// permudahkan (x² − b²)/(kx + kb) dsb.
function pfCqPerm() {
  if (Math.random() < .5) {
    const b = ri(1, 9), kk = ri(2, 6), N = `x² − ${b * b}`, D = `${kk}x + ${kk * b}`, ans = pfF(`x − ${b}`, kk);
    return pfMcq(`Permudahkan ${pfF(N, D)}.`, pfCardFig([{ n: N, d: D }], 'PERMUDAHKAN'), pfOpts(ans, [pfF(`x + ${b}`, kk), pfF(`x − ${b}`, `${kk}x`), `x − ${b}`, pfF(`x − ${b * b}`, kk), pfF(`x − ${b}`, kk * b)], k => pfF(`x − ${b + k}`, kk)));
  }
  const o = pfFix(pfRG, () => ({ p: nz(-7, 7), q: nz(-7, 7) }), o => o.p !== o.q && o.p + o.q !== 0 && o.p !== -o.q);
  const N = pfS(pfMul(pfL(1, 'x', o.p), pfL(1, 'x', o.q))), D = pfS(pfL(1, 'x', o.p)), ans = pfS(pfL(1, 'x', o.q));
  return pfMcq(`Permudahkan ${pfF(N, D)}.`, pfCardFig([{ n: N, d: D }], 'PERMUDAHKAN'), pfOpts(ans, [pfS(pfL(1, 'x', -o.q)), pfS(pfL(1, 'x', o.p)), pfS(pfL(1, 'x', o.q + o.p)), pfS(pfL(1, 'x', o.p * o.q))], k => pfS(pfL(1, 'x', o.q + k))));
}
// pecahan penyebut sama (games)
function pfCqSama() {
  const d = pfFix(pfRG, () => { const v = pick(['x', 'y', 'm']), k = ri(2, 9), s = Math.random() < .5 ? 1 : -1, N1 = pfL(ri(1, 6), v, nz(-8, 8)), N2 = pfL(ri(1, 6), v, nz(-8, 8)); return { v, k, s, N1, N2 }; }, d => pfN(pfAdd(d.N1, pfSc(d.N2, d.s))) === 2);
  const { v, k, s, N1, N2 } = d, NR = pfAdd(N1, pfSc(N2, s)), ans = pfPMs(pfPM(NR, k, {})), E = pfJoin(pfF(pfS(N1), k), s > 0 ? '+' : '−', pfF(pfS(N2), k));
  // kesilapan: tambah penyebut; tanda salah bagi sebutan kedua; lupa menolak pemalar
  const half = pfAdd(N1, pfSc(pfX(v, N2[v + '1']), s), pfK(N2[''] || 0));
  const c = [pfF(pfS(NR), 2 * k), pfPMs(pfPM(pfAdd(N1, pfSc(N2, -s)), k, {})), pfPMs(pfPM(half, k, {})), pfS(NR)];
  return pfMcq(`Permudahkan ${E}.`, pfCardFig([{ n: pfS(N1), d: String(k) }, s > 0 ? '+' : '−', { n: pfS(N2), d: String(k) }], 'PERMUDAHKAN'), pfOpts(ans, c, kk => pfF(pfS(pfAdd(NR, pfK(kk))), k)));
}
const CQT = { kembangan: 'Kembangan', faktor: 'FSTB, beza kuasa dua & kumpul sebutan', trinomial: 'Trinomial (kaedah silang)', pecahan: 'Pecahan algebra' };
function pfCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.kembangan;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['kembangan', 'kembangan', 'faktor', 'trinomial', 'pecahan'] : Object.keys(CQT);
  return pfCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pfCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
