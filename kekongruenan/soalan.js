'use strict';
/* =================== KEKONGRUENAN · SOALAN BAB 5 (Tingkatan 5) =================== */
// QV · GEN · WG/WSPLAN · gq · CQT/cq. Semua nama global berawalan "kg" / "KG".

const kgRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const kgRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const kgGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const kgFr = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = kgGcd(n, d) || 1; n /= g; d /= g; return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d); };
const kgN = x => fmt(Math.round(x * 1000) / 1000);
const kgP = (x, y) => `(${kgN(x)}, ${kgN(y)})`;
const kgHUR = [['A', 'B', 'C', 'P', 'Q', 'R'], ['K', 'L', 'M', 'X', 'Y', 'Z'], ['D', 'E', 'F', 'S', 'T', 'U'], ['A', 'B', 'C', 'D', 'E', 'F'], ['P', 'Q', 'R', 'K', 'L', 'M']];
const KGPOLI = { 3: 'segi tiga sama sisi', 4: 'segi empat sama', 5: 'pentagon sekata', 6: 'heksagon sekata', 8: 'oktagon sekata', 9: 'nonagon sekata', 10: 'dekagon sekata', 12: 'dodekagon sekata' };
const kgSud = n => 180 * (n - 2) / n;

/* ---------- rajah ---------- */
const kgFig = (polys, pts, R = 7, label = 'Satah Cartes') => gSvg(R, polys.map(([p, c, d]) => gPoly(p, c, d)).join('') + (pts || []).map(([x, y, c, l]) => gPt(x, y, c, l)).join(''), label);
const kgTriFig = (L, info) => {
  const t = (x, y, s, c = 'tx') => `<text x="${x}" y="${y}" font-size="16" font-weight="700" text-anchor="middle" dominant-baseline="central" style="fill:var(--${c})">${s}</text>`;
  const A = [[30, 170], [150, 170], [60, 50]], B = [[190, 170], [310, 170], [280, 50]];
  const pl = p => `<polygon points="${p.map(q => q.join(',')).join(' ')}" style="fill:var(--tr);fill-opacity:.15;stroke:var(--tr)" stroke-width="3" stroke-linejoin="round"/>`;
  const pl2 = p => `<polygon points="${p.map(q => q.join(',')).join(' ')}" style="fill:var(--pk);fill-opacity:.15;stroke:var(--pk)" stroke-width="3" stroke-linejoin="round"/>`;
  let s = pl(A) + pl2(B);
  [[18, 185], [162, 185], [55, 35], [180, 185], [322, 185], [286, 35]].forEach(([x, y], i) => { s += t(x, y, L[i]); });
  if (info) s += t(170, 205, info, 'am');
  return `<svg viewBox="0 0 340 215" role="img" aria-label="Dua segi tiga" font-family="Inter, sans-serif">${s}</svg>`;
};

/* =================== QV: cara tanya =================== */
const QV = {
  syarat: [
    d => ({ q: `Dalam Δ${d.t1} dan Δ${d.t2}, ${d.info}. Nyatakan syarat kekongruenan yang dipenuhi.` }),
    d => ({ q: `Diberi ${d.info} bagi Δ${d.t1} dan Δ${d.t2}. Dengan syarat apakah Δ${d.t1} ≅ Δ${d.t2}?` }),
    d => ({ q: `Tunjukkan bahawa Δ${d.t1} dan Δ${d.t2} kongruen jika ${d.info}. Namakan syaratnya.` })
  ],
  sepadan: [
    d => ({ q: `Δ${d.t1} ≅ Δ${d.t2}. Diberi ${d.s1} = ${d.v} cm. Cari panjang ${d.s2}.` }),
    d => ({ q: `Segi tiga ${d.t1} dan ${d.t2} adalah kongruen dengan bucu sepadan mengikut susunan. Jika ${d.s1} = ${d.v} cm, berapakah ${d.s2}?` }),
    d => ({ q: `Diberi Δ${d.t1} ≅ Δ${d.t2} dan sisi ${d.s1} ialah ${d.v} cm. Nyatakan panjang sisi ${d.s2}.` })
  ],
  sudutK: [
    d => ({ q: `Δ${d.t1} ≅ Δ${d.t2}. Diberi ∠${d.a1} = ${d.x}° dan ∠${d.a2} = ${d.y}°. Cari ∠${d.tgt}.` }),
    d => ({ q: `Segi tiga ${d.t1} kongruen dengan segi tiga ${d.t2}. Jika ∠${d.a1} = ${d.x}° dan ∠${d.a2} = ${d.y}°, hitung ∠${d.tgt}.` }),
    d => ({ q: `Diberi Δ${d.t1} ≅ Δ${d.t2}, ∠${d.a1} = ${d.x}° dan ∠${d.a2} = ${d.y}°. Berapakah saiz ∠${d.tgt}?` })
  ],
  bsK: [
    d => ({ q: `Benar atau palsu: ${d.s}` }),
    d => ({ q: `Tentukan sama ada pernyataan berikut benar atau palsu. "${d.s}"` }),
    d => { const N = vnama(); return { q: `${N} berkata: "${d.s}" Adakah ${N} betul?` }; }
  ],
  kongYa: [
    d => ({ q: `Δ${d.t1}: ${d.i1}. Δ${d.t2}: ${d.i2}. Adakah kedua-dua segi tiga itu pasti kongruen? Beri sebab.` }),
    d => ({ q: `Diberi Δ${d.t1} dengan ${d.i1} dan Δ${d.t2} dengan ${d.i2}. Tentukan sama ada Δ${d.t1} ≅ Δ${d.t2} dan nyatakan alasan.` }),
    d => ({ q: `Adakah Δ${d.t1} (${d.i1}) dan Δ${d.t2} (${d.i2}) kongruen? Jelaskan.` })
  ],
  pbImej: [
    d => ({ q: `Titik ${d.L}${kgP(d.x, d.y)} dibesarkan pada pusat ${d.cn} dengan faktor skala ${d.k}. Cari koordinat imej ${d.L}′.` }),
    d => ({ q: `Cari imej bagi titik ${kgP(d.x, d.y)} di bawah pembesaran pada pusat ${d.cn} dengan faktor skala ${d.k}.` }),
    d => ({ q: `Satu pembesaran berpusat ${d.cn} dengan faktor skala ${d.k} memetakan ${d.L}${kgP(d.x, d.y)} kepada ${d.L}′. Nyatakan koordinat ${d.L}′.` }),
    d => ({ q: `Rajah menunjukkan titik ${d.L}${kgP(d.x, d.y)}. Titik ini dibesarkan dengan faktor skala ${d.k} pada pusat ${d.cn}. Tentukan ${d.L}′.` })
  ],
  pbLuas: [
    d => ({ q: `Luas sebuah objek ialah ${d.a} cm². Objek itu dibesarkan dengan faktor skala ${d.k}. Hitung luas imej.` }),
    d => ({ q: `Sebuah poligon dengan luas ${d.a} cm² mengalami pembesaran berfaktor skala ${d.k}. Berapakah luas imejnya?` }),
    d => ({ q: `Sekeping gambar seluas ${d.a} cm² dibesarkan dengan faktor skala ${d.k}. Cari luas gambar yang baharu.` }),
    d => { const N = vnama(); return Object.assign({ q: `Objek seluas ${d.a} cm² dibesarkan dengan faktor skala ${d.k}. ${N} berkata luas imej ialah ${d.salah} cm². Adakah ${N} betul?` }, salah(N, d.ans, `${N} mendarab dengan k, sepatutnya dengan k².`)); }
  ],
  pbK: [
    d => ({ q: `Panjang sisi objek ialah ${d.o} cm dan panjang sisi imej yang sepadan ialah ${d.i} cm. Cari faktor skala pembesaran (imej di sebelah yang sama dengan objek).` }),
    d => ({ q: `Sebuah segi empat dengan sisi ${d.o} cm dibesarkan supaya sisi sepadan menjadi ${d.i} cm. Berapakah faktor skala?` }),
    d => ({ q: `Pembesaran memetakan sisi ${d.o} cm kepada ${d.i} cm di sebelah yang sama dengan pusat. Nyatakan nilai k.` })
  ],
  pbLuasO: [
    d => ({ q: `Luas imej selepas pembesaran dengan faktor skala ${d.k} ialah ${d.ai} cm². Cari luas objek.` }),
    d => ({ q: `Sebuah bentuk dibesarkan dengan faktor skala ${d.k} dan luas imejnya ${d.ai} cm². Hitung luas bentuk asal.` }),
    d => ({ q: `Diberi luas imej = ${d.ai} cm² dan k = ${d.k}. Berapakah luas objek?` })
  ],
  pbKLuas: [
    d => ({ q: `Luas objek ialah ${d.ao} cm² dan luas imej ialah ${d.ai} cm². Imej berada di sebelah bertentangan pusat. Cari faktor skala, k, dan panjang imej bagi sisi objek ${d.s} cm.` }),
    d => ({ q: `Satu pembesaran dengan k negatif memetakan objek seluas ${d.ao} cm² kepada imej seluas ${d.ai} cm². Tentukan k dan panjang sisi imej yang sepadan dengan sisi objek ${d.s} cm.` }),
    d => ({ q: `Objek (${d.ao} cm²) dan imej (${d.ai} cm²) berada pada sisi bertentangan pusat pembesaran. Hitung k, kemudian cari panjang imej bagi sisi ${d.s} cm.` })
  ],
  gbAB: [
    d => ({ q: `${d.def} Cari imej titik ${kgP(d.x, d.y)} di bawah gabungan ${d.ord}.` }),
    d => ({ q: `${d.def} Titik ${kgP(d.x, d.y)} dipetakan oleh ${d.ord}. Nyatakan koordinat imej akhir.` }),
    d => ({ q: `${d.def} Tentukan imej bagi ${kgP(d.x, d.y)} di bawah transformasi ${d.ord}.` })
  ],
  gbTT: [
    d => ({ q: `Translasi T = ${d.t1} dan translasi U = ${d.t2}. Nyatakan satu translasi yang setara dengan UT.` }),
    d => ({ q: `Gabungan translasi ${d.t1} diikuti translasi ${d.t2} setara dengan satu translasi. Cari translasi itu.` }),
    d => ({ q: `Titik bergerak mengikut translasi ${d.t1}, kemudian translasi ${d.t2}. Nyatakan translasi tunggal yang setara.` })
  ],
  gbDua: [
    d => ({ q: `${d.def} Cari imej titik ${kgP(d.x, d.y)} di bawah (a) AB, (b) BA. Adakah AB = BA bagi titik ini?` }),
    d => ({ q: `${d.def} Bandingkan imej ${kgP(d.x, d.y)} di bawah AB dan BA.` }),
    d => ({ q: `${d.def} Tentukan imej ${kgP(d.x, d.y)} di bawah gabungan AB dan juga BA.` })
  ],
  gbPu: [
    d => ({ q: `R ialah putaran ${d.a}° ${d.ar1} pada asalan dan S ialah putaran ${d.b}° ${d.ar2} pada asalan. Huraikan satu transformasi tunggal yang setara dengan SR.` }),
    d => ({ q: `Gabungan putaran ${d.a}° ${d.ar1} diikuti putaran ${d.b}° ${d.ar2}, kedua-duanya pada asalan, setara dengan satu putaran. Huraikan putaran itu.` }),
    d => ({ q: `Satu objek diputar ${d.a}° ${d.ar1} pada O, kemudian ${d.b}° ${d.ar2} pada O. Nyatakan putaran tunggal yang setara.` })
  ],
  gbLuas: [
    d => ({ q: `V ialah pembesaran pada asalan dengan faktor skala ${d.k} dan T ialah translasi ${d.t}. Sebuah objek seluas ${d.a} cm² dipetakan oleh VT. Cari luas imej akhir dan imej bagi titik ${kgP(d.x, d.y)}.` }),
    d => ({ q: `Objek seluas ${d.a} cm² ditranslasikan oleh T = ${d.t}, kemudian dibesarkan oleh V (pusat O, k = ${d.k}). Hitung luas imej akhir dan cari imej titik ${kgP(d.x, d.y)} di bawah VT.` }),
    d => ({ q: `Di bawah gabungan VT (T = translasi ${d.t}, V = pembesaran pusat O faktor ${d.k}), cari imej ${kgP(d.x, d.y)} dan luas imej bagi objek ${d.a} cm².` })
  ],
  tsSudut: [
    d => ({ q: `Hitung saiz sudut pedalaman sebuah ${d.nm}.` }),
    d => ({ q: `Berapakah saiz setiap sudut pedalaman ${d.nm} (${d.n} sisi)?` }),
    d => ({ q: `Sebuah jubin berbentuk ${d.nm}. Cari saiz satu sudut pedalamannya.` })
  ],
  tsBoleh: [
    d => ({ q: `Adakah ${d.nm} sahaja boleh membentuk teselasi? Beri sebab.` }),
    d => ({ q: `Tentukan sama ada jubin berbentuk ${d.nm} boleh menutup lantai tanpa ruang dan tanpa bertindih.` }),
    d => ({ q: `Bolehkah ${d.nm} menteselasi satah secara sendirian? Jelaskan.` })
  ],
  tsBaki: [
    d => ({ q: `Pada satu bucu teselasi, bertemu ${d.desc}, serta satu poligon sekata yang lain. Cari sudut pedalaman poligon itu dan namakan poligon tersebut.` }),
    d => ({ q: `Satu bucu teselasi dikelilingi oleh ${d.desc}, serta satu lagi poligon sekata. Namakan poligon sekata itu.` }),
    d => ({ q: `Jika ${d.desc} bertemu pada satu bucu bersama satu poligon sekata yang belum diketahui, apakah poligon itu?` })
  ],
  tsSemak: [
    d => ({ q: `Adakah ${d.desc} boleh bertemu pada satu bucu dalam teselasi? Tunjukkan pengiraan.` }),
    d => ({ q: `Semak sama ada gabungan ${d.desc} pada satu bucu membentuk teselasi.` }),
    d => ({ q: `Bolehkah ${d.desc} mengelilingi satu bucu tanpa ruang? Buktikan.` })
  ]
};

/* =================== penjana =================== */
const KG = {};
KG.syarat = (r, k) => {
  const L = r.p(kgHUR), [A, B, C, P, Q, R] = L, t1 = A + B + C, t2 = P + Q + R;
  const s1 = r.i(4, 12), s2 = r.i(4, 12), s3 = r.i(5, 14), a1 = r.i(30, 70), a2 = r.i(40, 80);
  const ty = ['SSS', 'SAS', 'ASA', 'AAS'][k == null ? r.i(0, 3) : k % 4];
  let info;
  if (ty === 'SSS') info = `${A}${B} = ${P}${Q} = ${s1} cm, ${B}${C} = ${Q}${R} = ${s2} cm dan ${A}${C} = ${P}${R} = ${s3} cm`;
  else if (ty === 'SAS') info = `${A}${B} = ${P}${Q} = ${s1} cm, ∠${A}${B}${C} = ∠${P}${Q}${R} = ${a1}° dan ${B}${C} = ${Q}${R} = ${s2} cm`;
  else if (ty === 'ASA') info = `∠${C}${A}${B} = ∠${R}${P}${Q} = ${a1}°, ${A}${B} = ${P}${Q} = ${s1} cm dan ∠${A}${B}${C} = ∠${P}${Q}${R} = ${a2}°`;
  else info = `∠${C}${A}${B} = ∠${R}${P}${Q} = ${a1}°, ∠${A}${B}${C} = ∠${P}${Q}${R} = ${a2}° dan ${B}${C} = ${Q}${R} = ${s2} cm`;
  const why = { SSS: 'Tiga pasang sisi sepadan sama panjang.', SAS: `Sudut ∠${B} terletak di antara sisi ${A}${B} dan ${B}${C}.`, ASA: `Sisi ${A}${B} terletak di antara ∠${A} dan ∠${B}.`, AAS: `Sisi ${B}${C} tidak terletak di antara ∠${A} dan ∠${B}.` }[ty];
  return GEN_LQ('syarat', { t1, t2, info, ans: ty, work: [why, `Maka Δ${t1} ≅ Δ${t2} (${ty}).`] }, { fig: kgTriFig(L) });
};
KG.sepadan = r => {
  const L = r.p(kgHUR), t1 = L.slice(0, 3).join(''), t2 = L.slice(3).join(''), i = r.i(0, 2), j = (i + 1 + r.i(0, 1)) % 3;
  const s1 = L[i] + L[j], s2 = L[3 + i] + L[3 + j], v = r.i(3, 25);
  return GEN_LQ('sepadan', { t1, t2, s1, s2, v, ans: `${s2} = ${v} cm`, work: [`Padankan bucu: ${L[0]}↔${L[3]}, ${L[1]}↔${L[4]}, ${L[2]}↔${L[5]}.`, `${s2} sepadan dengan ${s1}.`, `${s2} = ${s1} = ${v} cm`] }, { fig: kgTriFig(L) });
};
KG.sudutK = r => {
  const L = r.p(kgHUR), t1 = L.slice(0, 3).join(''), t2 = L.slice(3).join('');
  let x, y; do { x = r.i(25, 95); y = r.i(25, 95); } while (x + y >= 160 || x === y);
  const i = r.i(0, 2), a1 = L[i], a2 = L[(i + 1) % 3], tgtI = (i + 2) % 3, tgt = L[3 + tgtI], z = 180 - x - y;
  return GEN_LQ('sudutK', { t1, t2, a1, a2, x, y, tgt, ans: `∠${tgt} = ${z}°`, work: [`∠${tgt} sepadan dengan ∠${L[tgtI]}.`, `∠${L[tgtI]} = 180° − ${x}° − ${y}° = ${z}°`, `Maka ∠${tgt} = ${z}°`] });
};
const KGBS1 = [
  ['Dua segi tiga dengan tiga pasang sudut sepadan yang sama pasti kongruen.', false, 'AAA hanya menjamin segi tiga serupa, bukan kongruen.'],
  ['Imej di bawah putaran sentiasa kongruen dengan objek.', true, 'Putaran ialah isometri: bentuk dan saiz kekal.'],
  ['SSA ialah syarat kekongruenan segi tiga.', false, 'SSA tidak menjamin kekongruenan; boleh terbentuk dua segi tiga berbeza.'],
  ['Bentuk kongruen mempunyai sisi sepadan yang sama panjang.', true, 'Kongruen = bentuk dan saiz sama.'],
  ['Imej di bawah pembesaran dengan faktor skala 2 kongruen dengan objek.', false, 'Saiz imej berubah, jadi imej serupa tetapi tidak kongruen.'],
  ['Dua segi tiga yang memenuhi syarat AAS adalah kongruen.', true, 'AAS ialah syarat kekongruenan segi tiga.'],
  ['Pembesaran dengan faktor skala −1 menghasilkan imej yang kongruen dengan objek.', true, '|k| = 1, maka saiz tidak berubah.'],
  ['Semua segi empat tepat dengan perimeter yang sama adalah kongruen.', false, 'Contoh: 2 × 4 dan 1 × 5 mempunyai perimeter sama tetapi bentuk berbeza.']
];
KG.bs = (r, list, k) => {
  const [s, b, why] = list[k == null ? r.i(0, list.length - 1) : k % list.length];
  return GEN_LQ('bsK', { s, ans: b ? 'Benar' : 'Palsu', work: [why] });
};
KG.kongYa = (r, k) => {
  const L = r.p(kgHUR), t1 = L.slice(0, 3).join(''), t2 = L.slice(3).join('');
  const a = r.i(35, 75), b = r.i(40, 80), s = r.i(4, 15), mode = k == null ? r.i(0, 2) : k % 3;
  if (mode === 0) return GEN_LQ('kongYa', { t1, t2, i1: `∠${L[0]} = ${a}°, ∠${L[1]} = ${b}°, ${L[1]}${L[2]} = ${s} cm`, i2: `∠${L[3]} = ${a}°, ∠${L[4]} = ${b}°, ${L[4]}${L[5]} = ${s} cm`, ans: 'Ya, kongruen (AAS)', work: ['Dua pasang sudut sepadan sama.', `Sisi ${L[1]}${L[2]} = ${L[4]}${L[5]} bukan di antara dua sudut itu.`, 'Syarat AAS dipenuhi.'] });
  if (mode === 1) return GEN_LQ('kongYa', { t1, t2, i1: `∠${L[0]} = ${a}°, ∠${L[1]} = ${b}°, ∠${L[2]} = ${180 - a - b}°`, i2: `∠${L[3]} = ${a}°, ∠${L[4]} = ${b}°, ∠${L[5]} = ${180 - a - b}°`, ans: 'Tidak pasti kongruen (AAA)', work: ['Hanya sudut diketahui (AAA).', 'Segi tiga itu serupa, tetapi saiznya mungkin berbeza.', 'Maka tidak pasti kongruen.'] });
  const p = r.i(5, 12), q = p + r.i(2, 6);
  return GEN_LQ('kongYa', { t1, t2, i1: `${L[0]}${L[1]} = ${p} cm, ${L[1]}${L[2]} = ${q} cm, ∠${L[1]} = ${a}°`, i2: `${L[3]}${L[4]} = ${p} cm, ${L[4]}${L[5]} = ${q} cm, ∠${L[4]} = ${a}°`, ans: 'Ya, kongruen (SAS)', work: [`∠${L[1]} terletak di antara sisi ${L[0]}${L[1]} dan ${L[1]}${L[2]}.`, 'Dua sisi dan sudut di antaranya sama.', 'Syarat SAS dipenuhi.'] });
};
/* ---------- 5.2 ---------- */
const KGK = [[2, 1], [3, 1], [-1, 1], [-2, 1], [1, 2], [-1, 2], [3, 2], [-3, 1]];
KG.pbImej = (r, pusatLain) => {
  const [kn, kd] = r.p(KGK), cx = pusatLain ? r.n(-3, 3) : 0, cy = pusatLain ? r.n(-3, 3) : 0;
  let dx, dy; do { dx = r.i(-3, 3) * kd; dy = r.i(-3, 3) * kd; } while (!dx && !dy);
  const x = cx + dx, y = cy + dy, X = cx + dx * kn / kd, Y = cy + dy * kn / kd, k = kgFr(kn, kd), Lt = r.p(['A', 'B', 'P', 'Q', 'M']);
  const cn = pusatLain ? `${r.p(['C', 'E', 'O′'])}${kgP(cx, cy)}` : 'asalan O(0, 0)';
  const ok = Math.abs(X) <= 9 && Math.abs(Y) <= 9;
  return GEN_LQ('pbImej', { L: Lt, x, y, cn, k, ans: `${Lt}′${kgP(X, Y)}`, work: [`Vektor dari pusat: (${kgN(dx)}, ${kgN(dy)})`, `Darab dengan k = ${k}: (${kgN(dx * kn / kd)}, ${kgN(dy * kn / kd)})`, `Tambah pada pusat ${kgP(cx, cy)}: ${Lt}′${kgP(X, Y)}`] }, ok && Math.abs(x) <= 6 && Math.abs(y) <= 6 ? { fig: kgFig([], [[cx, cy, 'am', 'pusat'], [x, y, 'tr', Lt]], 7) } : {});
};
KG.pbLuas = r => {
  const [kn, kd] = r.p([[2, 1], [3, 1], [-2, 1], [-3, 1], [4, 1], [1, 2], [3, 2], [-1, 2], [5, 2]]);
  const a = r.i(2, 12) * kd * kd, ai = a * kn * kn / (kd * kd), k = kgFr(kn, kd);
  return GEN_LQ('pbLuas', { a, k, salah: kgN(Math.abs(a * kn / kd)), ans: `${kgN(ai)} cm²`, work: [`Luas imej = k² × luas objek`, `= (${k})² × ${a}`, `= ${kgFr(kn * kn, kd * kd)} × ${a} = ${kgN(ai)} cm²`] });
};
KG.pbK = r => {
  const [kn, kd] = r.p([[2, 1], [3, 1], [1, 2], [3, 2], [5, 2], [1, 3], [2, 3], [4, 1]]), m = r.i(1, 4), o = kd * m * r.i(1, 3), i = o * kn / kd;
  return GEN_LQ('pbK', { o, i, ans: `k = ${kgFr(kn, kd)}`, work: ['k = panjang imej ÷ panjang objek', `= ${kgN(i)} ÷ ${o}`, `= ${kgFr(kn, kd)}`] });
};
KG.pbLuasO = r => {
  const [kn, kd] = r.p([[2, 1], [3, 1], [-2, 1], [-3, 1], [4, 1], [3, 2], [-5, 2]]), ao = r.i(2, 15) * kd * kd, ai = ao * kn * kn / (kd * kd), k = kgFr(kn, kd);
  return GEN_LQ('pbLuasO', { k, ai: kgN(ai), ans: `${ao} cm²`, work: ['Luas objek = luas imej ÷ k²', `= ${kgN(ai)} ÷ ${kgFr(kn * kn, kd * kd)}`, `= ${ao} cm²`] });
};
KG.pbKLuas = r => {
  const kk = r.p([2, 3, 4, 5]), ao = r.i(2, 9), ai = ao * kk * kk, s = r.i(2, 8);
  return GEN_LQ('pbKLuas', { ao, ai, s, ans: `k = −${kk}; sisi imej = ${s * kk} cm`, work: [`k² = ${ai} ÷ ${ao} = ${kk * kk}`, `|k| = ${kk}; imej di sebelah bertentangan, maka k = −${kk}`, `Panjang sisi imej = |k| × ${s} = ${s * kk} cm`] });
};
/* ---------- 5.3 ---------- */
const kgTv = (a, b) => `(${kgN(a)}, ${kgN(b)})`;
const KGPT = { // pantulan
  x: [p => [p[0], -p[1]], 'pantulan pada paksi-x'], y: [p => [-p[0], p[1]], 'pantulan pada paksi-y'],
  yx: [p => [p[1], p[0]], 'pantulan pada garis y = x'],
  r90: [p => [p[1], -p[0]], 'putaran 90° ikut arah jam pada asalan'], r90l: [p => [-p[1], p[0]], 'putaran 90° lawan arah jam pada asalan'],
  r180: [p => [-p[0], -p[1]], 'putaran 180° pada asalan']
};
function kgPair(r) {
  const tx = r.n(-4, 4), ty = r.n(-4, 4), key = r.p(Object.keys(KGPT)), [f, nm] = KGPT[key], Tf = p => [p[0] + tx, p[1] + ty];
  const tFirst = r.f() < .5;
  const A = tFirst ? [Tf, `translasi ${kgTv(tx, ty)}`] : [f, nm], B = tFirst ? [f, nm] : [Tf, `translasi ${kgTv(tx, ty)}`];
  return { A, B, def: `A ialah ${A[1]} dan B ialah ${B[1]}.` };
}
KG.gbAB = (r, k) => {
  const { A, B, def } = kgPair(r), x = r.n(-4, 4), y = r.n(-4, 4), ab = (k == null ? r.f() < .5 : k % 2 === 0);
  const [F1, n1, F2, n2] = ab ? [B[0], 'B', A[0], 'A'] : [A[0], 'A', B[0], 'B'], p1 = F1([x, y]), p2 = F2(p1);
  return GEN_LQ('gbAB', { def, x, y, ord: ab ? 'AB' : 'BA', ans: kgP(...p2), work: [`${ab ? 'AB' : 'BA'}: lakukan ${n1} dahulu, kemudian ${n2}.`, `${n1}: ${kgP(x, y)} → ${kgP(...p1)}`, `${n2}: ${kgP(...p1)} → ${kgP(...p2)}`] });
};
KG.gbTT = r => {
  const a = r.n(-6, 6), b = r.n(-6, 6), c = r.n(-6, 6), d = r.n(-6, 6);
  return GEN_LQ('gbTT', { t1: kgTv(a, b), t2: kgTv(c, d), ans: `translasi ${kgTv(a + c, b + d)}`, work: ['Tambah komponen translasi.', `(${kgN(a)} + ${par(c)}, ${kgN(b)} + ${par(d)})`, `= ${kgTv(a + c, b + d)}`] });
};
KG.gbDua = r => {
  const { A, B, def } = kgPair(r), x = r.n(-4, 4), y = r.n(-4, 4);
  const b1 = B[0]([x, y]), ab = A[0](b1), a1 = A[0]([x, y]), ba = B[0](a1), same = ab[0] === ba[0] && ab[1] === ba[1];
  return GEN_LQ('gbDua', { def, x, y, ans: `AB: ${kgP(...ab)}; BA: ${kgP(...ba)}; ${same ? 'AB = BA' : 'AB ≠ BA'}`, work: [`AB: B → ${kgP(...b1)}, kemudian A → ${kgP(...ab)}`, `BA: A → ${kgP(...a1)}, kemudian B → ${kgP(...ba)}`, same ? 'Imej sama.' : 'Imej berbeza, maka AB ≠ BA.'] });
};
KG.gbPu = r => {
  const a = r.p([30, 45, 60, 90, 120, 150]), b = r.p([30, 45, 60, 90, 120, 180]), c1 = r.f() < .5, c2 = r.f() < .5;
  const net = (c1 ? -a : a) + (c2 ? -b : b); // + lawan arah jam
  let ans; const m = ((net % 360) + 360) % 360;
  if (m === 0) ans = 'putaran 360° (imej sama dengan objek)';
  else if (m === 180) ans = 'putaran 180° pada asalan';
  else ans = m < 180 ? `putaran ${m}° lawan arah jam pada asalan` : `putaran ${360 - m}° ikut arah jam pada asalan`;
  return GEN_LQ('gbPu', { a, b, ar1: ARAH(c1), ar2: ARAH(c2), ans, work: ['Ambil lawan arah jam sebagai positif.', `${c1 ? '−' : '+'}${a}° ${c2 ? '−' : '+'} ${b}° = ${net < 0 ? '−' + (-net) : net}°`, `Setara dengan ${ans}.`] });
};
KG.gbLuas = r => {
  const kk = r.p([2, 3, -2, -3]), tx = r.n(-3, 3), ty = r.n(-3, 3), a = r.i(3, 12), x = r.n(-3, 3), y = r.n(-3, 3), p1 = [x + tx, y + ty], p2 = [kk * p1[0], kk * p1[1]];
  return GEN_LQ('gbLuas', { k: kgN(kk), t: kgTv(tx, ty), a, x, y, ans: `Luas = ${a * kk * kk} cm²; imej = ${kgP(...p2)}`, work: ['VT: T dahulu, kemudian V.', `T: ${kgP(x, y)} → ${kgP(...p1)}; V: → ${kgP(...p2)}`, `Translasi tidak mengubah luas: luas akhir = (${kgN(kk)})² × ${a} = ${a * kk * kk} cm²`] });
};
/* ---------- 5.4 ---------- */
KG.tsSudut = (r, k) => {
  const ns = [3, 4, 5, 6, 8, 9, 10, 12], n = k == null ? r.p(ns) : ns[k % ns.length], s = kgSud(n);
  return GEN_LQ('tsSudut', { n, nm: KGPOLI[n], ans: `${kgN(s)}°`, work: ['Sudut pedalaman = (n − 2) × 180° ÷ n', `= (${n} − 2) × 180° ÷ ${n}`, `= ${kgN(s)}°`] });
};
KG.tsBoleh = (r, k) => {
  const ns = [3, 4, 5, 6, 8, 10, 12, 9], n = k == null ? r.p(ns) : ns[k % ns.length], s = kgSud(n), q = 360 / s, ya = Number.isInteger(q);
  return GEN_LQ('tsBoleh', { nm: KGPOLI[n], ans: ya ? `Ya, ${q} keping bertemu pada satu bucu` : 'Tidak boleh', work: [`Sudut pedalaman = ${kgN(s)}°`, `360° ÷ ${kgN(s)}° = ${kgN(q)}`, ya ? 'Nombor bulat, maka boleh menteselasi.' : 'Bukan nombor bulat, maka tidak boleh menteselasi sendirian.'] });
};
const KGKOMBI = [ // [poligon diketahui], baki
  [[4, 8], 8], [[3, 3, 3, 3], 6], [[3, 12], 12], [[3, 3, 4], 12], [[3, 4, 4], 6], [[6, 6], 6], [[3, 3, 6], 6], [[4, 6], 12], [[3, 3, 3, 4], 4], [[4, 4, 4], 4]
];
const kgDesc = ns => { const c = {}; ns.forEach(n => { c[n] = (c[n] || 0) + 1; }); const parts = Object.keys(c).map(n => `${c[n] === 1 ? 'satu' : c[n] === 2 ? 'dua' : c[n] === 3 ? 'tiga' : 'empat'} ${KGPOLI[n]}`); return parts.length < 2 ? parts[0] : parts.slice(0, -1).join(', ') + ' dan ' + parts[parts.length - 1]; };
KG.tsBaki = (r, k) => {
  const [ns, b] = KGKOMBI[k == null ? r.i(0, KGKOMBI.length - 1) : k % KGKOMBI.length], sum = ns.reduce((s, n) => s + kgSud(n), 0), rem = 360 - sum;
  if (Math.abs(rem - kgSud(b)) > 1e-9) throw new Error('kombi');
  return GEN_LQ('tsBaki', { desc: kgDesc(ns), ans: `${kgN(rem)}°, ${KGPOLI[b]}`, work: [`Jumlah sudut diketahui = ${ns.map(n => kgN(kgSud(n)) + '°').join(' + ')} = ${kgN(sum)}°`, `Baki = 360° − ${kgN(sum)}° = ${kgN(rem)}°`, `Poligon sekata bersudut ${kgN(rem)}° ialah ${KGPOLI[b]}.`] });
};
const KGSEMAK = [[3, 3, 4, 4, 3], [5, 5, 10], [4, 8, 8], [5, 5, 5], [3, 12, 12], [6, 6, 6], [4, 6, 12], [8, 8, 5], [3, 3, 3, 3, 3, 3], [5, 6, 6]];
KG.tsSemak = (r, k) => {
  const ns = KGSEMAK[k == null ? r.i(0, KGSEMAK.length - 1) : k % KGSEMAK.length], sum = ns.reduce((s, n) => s + kgSud(n), 0), ok = Math.abs(sum - 360) < 1e-9;
  return GEN_LQ('tsSemak', { desc: kgDesc(ns), ans: ok ? 'Ya, jumlah sudut = 360°' : `Tidak, jumlah sudut = ${kgN(sum)}°`, work: [ns.map(n => kgN(kgSud(n)) + '°').join(' + ') + ` = ${kgN(sum)}°`, ok ? 'Tepat 360°, maka boleh.' : (sum < 360 ? 'Kurang daripada 360°: ada ruang kosong.' : 'Lebih daripada 360°: bertindih.')] });
};

/* =================== GEN =================== */
const GEN = {
  '5.1': { m: [() => KG.syarat(kgRG), () => KG.sepadan(kgRG), () => KG.bs(kgRG, KGBS1)], s: [() => KG.sudutK(kgRG), () => KG.syarat(kgRG)], k: [() => KG.kongYa(kgRG)] },
  '5.2': { m: [() => KG.pbImej(kgRG, false), () => KG.pbLuas(kgRG), () => KG.pbK(kgRG)], s: [() => KG.pbImej(kgRG, true), () => KG.pbLuasO(kgRG)], k: [() => KG.pbKLuas(kgRG)] },
  '5.3': { m: [() => KG.gbAB(kgRG), () => KG.gbTT(kgRG)], s: [() => KG.gbDua(kgRG), () => KG.gbPu(kgRG)], k: [() => KG.gbLuas(kgRG)] },
  '5.4': { m: [() => KG.tsSudut(kgRG), () => KG.tsBoleh(kgRG)], s: [() => KG.tsBaki(kgRG), () => KG.tsSemak(kgRG)], k: [() => KG.tsBaki(kgRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {
  syarat: i => KG.syarat(kgRW, i), sepadan: () => KG.sepadan(kgRW), bs1: i => KG.bs(kgRW, KGBS1, i), sudutK: () => KG.sudutK(kgRW), kongYa: i => KG.kongYa(kgRW, i),
  pbImejO: () => KG.pbImej(kgRW, false), pbLuas: () => KG.pbLuas(kgRW), pbK: () => KG.pbK(kgRW), pbImejC: () => KG.pbImej(kgRW, true), pbLuasO: () => KG.pbLuasO(kgRW), pbKLuas: () => KG.pbKLuas(kgRW),
  gbAB: i => KG.gbAB(kgRW, i), gbTT: () => KG.gbTT(kgRW), gbDua: () => KG.gbDua(kgRW), gbPu: () => KG.gbPu(kgRW), gbLuas: () => KG.gbLuas(kgRW),
  tsSudut: i => KG.tsSudut(kgRW, i), tsBoleh: i => KG.tsBoleh(kgRW, i), tsBaki: i => KG.tsBaki(kgRW, i), tsSemak: i => KG.tsSemak(kgRW, i), tsBakiK: i => KG.tsBaki(kgRW, i + 7)
};
const WSPLAN = {
  '5.1': [['m', 'syarat', 8], ['m', 'sepadan', 6], ['m', 'bs1', 4], ['s', 'sudutK', 6], ['s', 'syarat', 3], ['k', 'kongYa', 3]],
  '5.2': [['m', 'pbImejO', 7], ['m', 'pbLuas', 6], ['m', 'pbK', 5], ['s', 'pbImejC', 5], ['s', 'pbLuasO', 4], ['k', 'pbKLuas', 3]],
  '5.3': [['m', 'gbAB', 12], ['m', 'gbTT', 6], ['s', 'gbDua', 5], ['s', 'gbPu', 4], ['k', 'gbLuas', 3]],
  '5.4': [['m', 'tsSudut', 8], ['m', 'tsBoleh', 8], ['m', 'tsSemak', 2], ['s', 'tsBaki', 6], ['s', 'tsSemak', 3], ['k', 'tsBakiK', 3]]
};

/* =================== GAMES =================== */
function kgOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (!seen.has(c)) { seen.add(c); w.push(c); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && fill && k < 60; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]); return { opts, c: opts.indexOf(ans) };
}
const kgMcq = (q, fig, o) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const kgNoFig = t => `<svg viewBox="0 0 320 120" role="img" aria-label="${esc(t)}" font-family="Inter, sans-serif"><text x="160" y="60" font-size="30" font-weight="700" text-anchor="middle" dominant-baseline="central" style="fill:var(--am)">${t}</text></svg>`;
const CQGEN = {
  kongruen: [
    () => { const ty = pick(['SSS', 'SAS', 'ASA', 'AAS']); const d = KG.syarat(kgRG, ['SSS', 'SAS', 'ASA', 'AAS'].indexOf(ty)); return kgMcq(d.q, d.fig, kgOpts(ty, ['SSS', 'SAS', 'ASA', 'AAS', 'SSA', 'AAA'])); },
    () => { const s = pick(KGBS1); return kgMcq(`Benar atau palsu: ${s[0]}`, kgNoFig('≅ ?'), kgOpts(s[1] ? 'Benar' : 'Palsu', [s[1] ? 'Palsu' : 'Benar', 'Tidak pasti', 'Bergantung pada saiz'])); },
    () => { let x, y; do { x = ri(30, 90); y = ri(30, 90); } while (x + y >= 160); const z = 180 - x - y; return kgMcq(`ΔABC ≅ ΔPQR, ∠A = ${x}°, ∠B = ${y}°. Cari ∠R.`, kgNoFig('ΔABC ≅ ΔPQR'), kgOpts(`${z}°`, [`${x}°`, `${y}°`, `${180 - x}°`, `${z + 10}°`])); }
  ],
  pembesaran: [
    () => { const k = pick([2, 3, -2, -3, 4]), a = ri(2, 10); return kgMcq(`Luas objek ${a} cm², faktor skala ${fmt(k)}. Luas imej?`, kgNoFig(`k = ${fmt(k)}`), kgOpts(`${a * k * k} cm²`, [`${a * Math.abs(k)} cm²`, `${a * k * k * 2} cm²`, `${a + k * k} cm²`, `${a * (k * k + 1)} cm²`])); },
    () => { const k = pick([2, 3, -1, -2]), x = nz(-3, 3), y = nz(-3, 3); return kgMcq(`Imej ${kgP(x, y)} di bawah pembesaran pusat O, k = ${fmt(k)}?`, kgFig([], [[0, 0, 'am', 'O'], [x, y, 'tr', 'A']], 7), kgOpts(kgP(k * x, k * y), [kgP(-k * x, -k * y), kgP(x + k, y + k), kgP(k * y, k * x), kgP(k * x, -k * y)], j => kgP(k * x + j, k * y - j))); },
    () => { const kk = pick([2, 3, 4]), ao = ri(2, 8); return kgMcq(`Luas objek ${ao} cm², luas imej ${ao * kk * kk} cm². Imej sebelah bertentangan pusat. Nilai k?`, kgNoFig('k = ?'), kgOpts(`−${kk}`, [`${kk}`, `−${kk * kk}`, `${kk * kk}`, `−1/${kk}`])); }
  ],
  gabungan: [
    () => { const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), d = nz(-5, 5); return kgMcq(`Translasi ${kgTv(a, b)} diikuti ${kgTv(c, d)} setara dengan?`, kgNoFig('T + U'), kgOpts(kgTv(a + c, b + d), [kgTv(a - c, b - d), kgTv(a * c, b * d), kgTv(a + d, b + c), kgTv(c - a, d - b)])); },
    () => { const d = KG.gbAB(kgRG), x = d.ans; return kgMcq(d.q, '', kgOpts(x, [], k => { const m = x.match(/\(([^,]+), ([^)]+)\)/); const u = +m[1].replace('−', '-'), v = +m[2].replace('−', '-'); return kgP(u + [1, -1, 0, 2, -2][k % 5], v + [0, 1, -1, 2, 1][k % 5]); })); },
    () => { const s = pick([['Dalam gabungan AB, transformasi yang dilakukan dahulu ialah', 'B'], ['Dalam gabungan BA, transformasi yang dilakukan dahulu ialah', 'A']]); return kgMcq(s[0] + '?', kgNoFig('AB'), kgOpts(s[1], [s[1] === 'A' ? 'B' : 'A', 'Kedua-dua serentak', 'Tidak penting'])); }
  ],
  teselasi: [
    () => { const n = pick([3, 4, 5, 6, 8, 10, 12]); return kgMcq(`Sudut pedalaman ${KGPOLI[n]}?`, kgNoFig(`n = ${n}`), kgOpts(`${kgN(kgSud(n))}°`, [3, 4, 5, 6, 8, 10, 12].filter(m => m !== n).map(m => `${kgN(kgSud(m))}°`))); },
    () => kgMcq('Poligon sekata manakah boleh menteselasi sendirian?', kgNoFig('360°'), kgOpts(pick(['heksagon sekata', 'segi empat sama', 'segi tiga sama sisi']), ['pentagon sekata', 'oktagon sekata', 'dekagon sekata', 'nonagon sekata'])),
    () => { const i = ri(0, KGKOMBI.length - 1), d = KG.tsBaki(kgRG, i), b = KGKOMBI[i][1]; return kgMcq(`${vcap(kgDesc(KGKOMBI[i][0]))} bertemu pada satu bucu, serta satu poligon sekata lain. Poligon itu?`, kgNoFig('Σ = 360°'), kgOpts(KGPOLI[b], Object.values(KGPOLI))); }
  ]
};
const CQT = { kongruen: 'Kekongruenan', pembesaran: 'Pembesaran', gabungan: 'Gabungan transformasi', teselasi: 'Teselasi' };
function kgCqMake(ty, level) { const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.kongruen, k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1; return fns[k](); }
function gq(level) { return kgCqMake(pick(Object.keys(CQT)), level); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return kgCqMake(pick(pool.length ? pool : Object.keys(CQT)), level); }
