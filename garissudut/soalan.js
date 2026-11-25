'use strict';
/* =================== GARIS DAN SUDUT · SOALAN BAB 6 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "gs" / "GS".

const gsRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const gsRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };

/* ---------- rajah ---------- */
const gsPt = (c, r, d) => [c[0] + r * Math.cos(d * Math.PI / 180), c[1] - r * Math.sin(d * Math.PI / 180)];
const gsL = (p, q, col, w = 4) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
const gsT = (p, t, col, sz = 20) => `<text x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" fill="${col}" font-family="Inter,sans-serif" font-size="${sz}" font-weight="700" text-anchor="middle" dominant-baseline="central">${t}</text>`;
const gsArc = (c, r, a0, a1, col, lab, lr) => {
  const p0 = gsPt(c, r, a0), p1 = gsPt(c, r, a1), large = ((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0;
  let s = `<path d="M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 ${large} 0 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}" fill="none" stroke="${col}" stroke-width="3"/>`;
  if (lab) s += gsT(gsPt(c, lr || r + 24, a0 + (((a1 - a0) % 360 + 360) % 360) / 2), lab, col, 18);
  return s;
};
const gsSvg = (inner, lab) => `<svg viewBox="0 0 500 340" role="img" aria-label="${lab}" style="width:100%;max-width:520px"><rect x="0" y="0" width="500" height="340" rx="18" fill="#131C2E" stroke="#22304A" stroke-width="2"/>${inner}</svg>`;
// dua garis bersilang: sudut a (dari arah 0°). labs: [sudut0-a, sudut a-180, sudut 180-180+a, sudut 180+a-360]
function gsCross(a, labs) {
  const c = [250, 170]; let s = gsL(gsPt(c, 200, 0), gsPt(c, 200, 180), '#E6EDF7') + gsL(gsPt(c, 160, a), gsPt(c, 160, a + 180), '#E6EDF7');
  const cols = ['#38BDF8', '#FBBF24', '#F472B6', '#34D399'], seg = [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]];
  labs.forEach((l, i) => { if (l) s += gsArc(c, 34 + i % 2 * 10, seg[i][0], seg[i][1], cols[i], l, 64 + i % 2 * 10); });
  return gsSvg(s, 'Dua garis lurus bersilang');
}
// sudut pada garis lurus dibahagi: senarai label & saiz
function gsStraight(sizes, labs) {
  const c = [250, 250]; let s = gsL(gsPt(c, 210, 0), gsPt(c, 210, 180), '#E6EDF7'), acc = 0; const cols = ['#38BDF8', '#FBBF24', '#F472B6', '#34D399'];
  sizes.forEach((z, i) => { s += gsArc(c, 40 + i * 8, acc, acc + z, cols[i], labs[i], 78 + i * 10); acc += z; if (acc < 180) s += gsL(c, gsPt(c, 190, acc), '#E6EDF7'); });
  return gsSvg(s, 'Sudut pada garis lurus');
}
// garis selari dengan rentas lintang bersudut t; tanda: {sep, sel, ped} label di persilangan atas/bawah
function gsPar(t, top, bot) {
  const y1 = 110, y2 = 240, dx = (y2 - y1) / Math.tan(t * Math.PI / 180), P = [250 - dx / 2, y2], Q = [250 + dx / 2, y1];
  let s = gsL([30, y1], [470, y1], '#E6EDF7') + gsL([30, y2], [470, y2], '#E6EDF7') + gsL(gsPt(P, 70, t + 180), gsPt(Q, 70, t), '#F472B6');
  [y1, y2].forEach(y => s += `<polygon points="410,${y - 8} 424,${y} 410,${y + 8}" fill="#94A3B8"/>`);
  const seg = { kananAtas: [0, t], kiriAtas: [t, 180], kiriBawah: [180, 180 + t], kananBawah: [180 + t, 360] };
  const draw = (C, spec, cols) => Object.keys(spec).forEach((k, i) => { const [a0, a1] = seg[k]; s += gsArc(C, 28 + i * 6, a0, a1, cols[i % 2], spec[k], 56 + i * 6); });
  draw(Q, top, ['#FBBF24', '#38BDF8']); draw(P, bot, ['#34D399', '#A78BFA']);
  s += gsT([480, y1 - 16], 'PQ', '#94A3B8', 13) + gsT([480, y2 - 16], 'RS', '#94A3B8', 13);
  return gsSvg(s, 'Dua garis selari PQ dan RS dengan garis rentas lintang');
}

/* =================== QV =================== */
const QV = {
  jenis: [d => ({ q: `Namakan jenis sudut bagi ${d.a}°.` }), d => ({ q: `Sudut ${d.a}° ialah sudut jenis apa?` }), d => ({ q: `Kelaskan sudut berukuran ${d.a}°.` })],
  pasangan: [d => ({ q: `Cari ${d.nm} bagi ${d.a}°.` }), d => ({ q: `Hitung ${d.nm} bagi sudut ${d.a}°.` }), d => ({ q: `Apakah ${d.nm} bagi ${d.a}°?` })],
  cari: [d => ({ q: d.q, fig: d.fig }), d => ({ q: d.q.replace('Cari', 'Hitung'), fig: d.fig }), d => ({ q: d.q.replace('Cari', 'Tentukan'), fig: d.fig })],
  kenal: [d => ({ q: d.q, fig: d.fig }), d => ({ q: d.q.replace('Namakan', 'Nyatakan'), fig: d.fig })],
  masalah: [d => ({ q: d.q, fig: d.fig }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q, fig: d.fig })]
};

/* =================== penjana =================== */
const gsLQ = (k, d) => GEN_LQ(k, d, d.fig ? { fig: d.fig } : undefined);
const GS = {};
const gsJenis = a => a < 90 ? 'Sudut tirus' : a === 90 ? 'Sudut tegak' : a < 180 ? 'Sudut cakah' : a === 180 ? 'Sudut pada garis lurus' : a < 360 ? 'Sudut refleks' : 'Sudut putaran lengkap';
GS.jenis = r => { const a = r.p([r.i(5, 89), 90, r.i(91, 179), 180, r.i(181, 359), r.i(181, 359), r.i(5, 89), r.i(91, 179)]); return gsLQ('jenis', { a, ans: gsJenis(a), work: [a < 90 ? 'Kurang daripada 90°' : a === 90 ? 'Tepat 90°' : a < 180 ? 'Antara 90° dan 180°' : a === 180 ? 'Tepat 180°' : 'Antara 180° dan 360°'] }); };
GS.pasangan = r => {
  const k = r.i(0, 2), a = k === 0 ? r.i(5, 85) : k === 1 ? r.i(10, 170) : r.i(15, 345), T = [90, 180, 360][k], nm = ['sudut pelengkap', 'sudut penggenap', 'sudut konjugat'][k];
  return gsLQ('pasangan', { a, nm, ans: `${T - a}°`, work: [`${nm[0].toUpperCase() + nm.slice(1)}: hasil tambah ${T}°`, `${T}° − ${a}° = ${T - a}°`] });
};
GS.silang = r => {
  const a = r.i(30, 150); if (a === 90) return GS.silang(r);
  const k = r.i(0, 2);
  if (k === 0) return gsLQ('cari', { q: `Dalam rajah, dua garis lurus bersilang. Cari nilai x dan y.`, fig: gsCross(a, [`${a}°`, 'y', 'x', '']), ans: `x = ${a}°, y = ${180 - a}°`, work: [`x dan ${a}° ialah sudut bertentang bucu: x = ${a}°`, `y dan ${a}° pada garis lurus: y = 180° − ${a}° = ${180 - a}°`] });
  if (k === 1) return gsLQ('cari', { q: `Dalam rajah, dua garis lurus bersilang. Cari nilai x.`, fig: gsCross(a, ['', `${180 - a}°`, '', 'x']), ans: `x = ${180 - a}°`, work: [`x dan ${180 - a}° ialah sudut bertentang bucu`, `x = ${180 - a}°`] });
  return gsLQ('cari', { q: `Dua garis lurus bersilang. Satu daripada sudut yang terbentuk ialah ${a}°. Cari tiga sudut yang lain.`, fig: gsCross(a, [`${a}°`, '', '', '']), ans: `${180 - a}°, ${a}° dan ${180 - a}°`, work: [`Sudut bersebelahan: 180° − ${a}° = ${180 - a}°`, `Sudut bertentang bucu: ${a}°`] });
};
GS.lurus = r => {
  const k = r.i(0, 2);
  if (k === 0) { const x = r.i(15, 45), m = r.i(2, 3), b = r.i(10, 40), tot = (m + 1) * x + b; if (tot >= 180 || 180 - tot < 15) return GS.lurus(r); const c = 180 - tot;
    return gsLQ('cari', { q: `Dalam rajah, sudut-sudut pada garis lurus ialah ${m}x, x + ${b}° dan ${c}°. Cari nilai x.`, fig: gsStraight([m * x, x + b, c], [`${m}x`, `x + ${b}°`, `${c}°`]), ans: `x = ${x}°`, work: [`${m}x + x + ${b} + ${c} = 180`, `${m + 1}x = ${180 - b - c}`, `x = ${x}°`] }); }
  if (k === 1) { const a = r.i(20, 70), x = 90 - a;
    return gsLQ('cari', { q: `Dalam rajah, sudut ${a}° dan x adalah sudut pelengkap yang bersebelahan dengan satu sudut tegak pada garis lurus. Cari nilai x.`, fig: gsStraight([a, x, 90], [`${a}°`, 'x', '90°']), ans: `x = ${x}°`, work: [`${a}° + x = 90°`, `x = ${x}°`] }); }
  const x = r.i(20, 50), y = r.i(15, 40); if (x + x + y >= 175) return GS.lurus(r);
  const c = 180 - 2 * x - y;
  return gsLQ('cari', { q: `Sudut-sudut pada garis lurus ialah x, x dan ${y + c}°. Cari nilai x.`, fig: gsStraight([x, x, y + c], ['x', 'x', `${y + c}°`]), ans: `x = ${x}°`, work: [`2x + ${y + c} = 180`, `2x = ${180 - y - c}`, `x = ${x}°`] });
};
GS.masalah1 = (r, idx) => {
  const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const h = r.p([1, 2, 3, 4, 5, 7, 8, 10, 11]), a = Math.min(h, 12 - h) * 30, refl = 360 - a;
    return gsLQ('masalah', { q: `Pada pukul ${h}:00, jarum jam dan jarum minit sebuah jam membentuk satu sudut. Berapakah saiz sudut kecil itu, apakah jenisnya, dan apakah sudut konjugatnya?`, ans: `${a}°, ${gsJenis(a).toLowerCase()}; konjugat ${refl}°`, work: [`Setiap nombor = 360° ÷ 12 = 30°`, `${Math.min(h, 12 - h)} × 30° = ${a}°`, `Konjugat = 360° − ${a}° = ${refl}°`] }); }
  if (k === 1) { const a = r.i(35, 75);
    return gsLQ('masalah', { q: `Dua batang kayu kekuda bumbung bersilang membentuk sudut ${a}° di bahagian atas persilangan. Tukang kayu mahu memotong bahagian sisi. Berapakah sudut di sebelah kiri dan sudut di bahagian bawah persilangan itu?`, ans: `Sebelah kiri ${180 - a}°, bawah ${a}°`, work: [`Sudut bersebelahan: 180° − ${a}° = ${180 - a}°`, `Sudut bertentang bucu: ${a}°`] }); }
  const a = r.i(25, 65);
  return gsLQ('masalah', { q: `Sebatang tangga disandarkan pada dinding yang tegak dan membentuk sudut ${a}° dengan lantai. Berapakah sudut antara tangga dan dinding?`, ans: `${90 - a}°`, work: [`Lantai dan dinding membentuk 90°`, `Sudut dengan dinding = 90° − ${a}° = ${90 - a}°`] });
};
// ---- 6.2 ----
GS.kenal = r => {
  const t = r.i(50, 75), k = r.i(0, 2);
  if (k === 0) return gsLQ('kenal', { q: 'Dalam rajah, PQ selari dengan RS. Namakan pasangan sudut a dan b.', fig: gsPar(t, { kananAtas: 'a' }, { kananAtas: 'b' }), ans: 'Sudut sepadan', work: ['Kedua-dua sudut berada pada kedudukan sama di setiap persilangan (bentuk F).'] });
  if (k === 1) return gsLQ('kenal', { q: 'Dalam rajah, PQ selari dengan RS. Namakan pasangan sudut a dan b.', fig: gsPar(t, { kiriBawah: 'a' }, { kananAtas: 'b' }), ans: 'Sudut selang-seli', work: ['Sudut berada di sisi bertentangan garis rentas lintang, di antara garis selari (bentuk Z).'] });
  return gsLQ('kenal', { q: 'Dalam rajah, PQ selari dengan RS. Namakan pasangan sudut a dan b.', fig: gsPar(t, { kiriBawah: 'a' }, { kiriAtas: 'b' }), ans: 'Sudut pedalaman', work: ['Kedua-dua sudut di antara garis selari pada sebelah yang sama (bentuk C).'] });
};
GS.selari = r => {
  const t = r.i(40, 80), k = r.i(0, 2);
  if (k === 0) return gsLQ('cari', { q: `PQ selari dengan RS. Cari nilai x.`, fig: gsPar(t, { kananAtas: `${t}°` }, { kananAtas: 'x' }), ans: `x = ${t}°`, work: ['Sudut sepadan adalah sama', `x = ${t}°`] });
  if (k === 1) return gsLQ('cari', { q: `PQ selari dengan RS. Cari nilai x.`, fig: gsPar(t, { kiriBawah: `${t}°` }, { kananAtas: 'x' }), ans: `x = ${t}°`, work: ['Sudut selang-seli adalah sama', `x = ${t}°`] });
  return gsLQ('cari', { q: `PQ selari dengan RS. Cari nilai x.`, fig: gsPar(t, { kiriBawah: `${t}°` }, { kiriAtas: 'x' }), ans: `x = ${180 - t}°`, work: ['Sudut pedalaman: hasil tambah 180°', `x = 180° − ${t}° = ${180 - t}°`] });
};
GS.selariAlg = r => {
  const k = r.i(0, 1);
  if (k === 0) { const x = r.i(15, 30), m = r.i(2, 3), b = r.i(5, 20), t = m * x + b; if (t >= 90) return GS.selariAlg(r);
    return gsLQ('cari', { q: `PQ selari dengan RS. Sudut selang-seli ialah ${t}° dan (${m}x + ${b})°. Cari nilai x.`, fig: gsPar(t, { kiriBawah: `${t}°` }, { kananAtas: `${m}x + ${b}°` }), ans: `x = ${x}`, work: [`Sudut selang-seli sama: ${m}x + ${b} = ${t}`, `${m}x = ${t - b}`, `x = ${x}`] }); }
  const x = r.i(20, 40), b = r.i(10, 30), t = 180 - (2 * x + b) - x; const p = 2 * x + b, q = x + t; if (q <= 25 || p <= 25 || q >= 155 || t <= 0) return GS.selariAlg(r);
  return gsLQ('cari', { q: `PQ selari dengan RS. Dua sudut pedalaman ialah (2x + ${b})° dan (x + ${t})°. Cari nilai x.`, fig: gsPar(q, { kiriBawah: `x + ${t}°` }, { kiriAtas: `2x + ${b}°` }), ans: `x = ${x}`, work: [`Sudut pedalaman: (2x + ${b}) + (x + ${t}) = 180`, `3x + ${b + t} = 180`, `x = ${x}`] });
};
GS.masalah2 = (r, idx) => {
  const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const a = r.i(55, 80); return gsLQ('masalah', { q: `Dua lorong jalan raya adalah selari. Sebatang jalan masuk menyilang kedua-dua lorong dan membentuk sudut ${a}° dengan lorong pertama. Berapakah sudut pedalaman di lorong kedua?`, fig: gsPar(a, { kiriBawah: `${a}°` }, { kiriAtas: '?' }), ans: `${180 - a}°`, work: ['Lorong selari, jalan masuk ialah garis rentas lintang', `Sudut pedalaman = 180° − ${a}° = ${180 - a}°`] }); }
  if (k === 1) { const a = r.i(50, 70); return gsLQ('masalah', { q: `Sebuah rak buku mempunyai dua papan mendatar yang selari. Satu batang penyokong condong membentuk sudut ${a}° dengan papan atas (sudut selang-seli). Berapakah sudut antara penyokong itu dengan papan bawah, dan sudut pedalaman di papan bawah?`, ans: `${a}° (selang-seli) dan ${180 - a}° (pedalaman)`, work: [`Sudut selang-seli sama: ${a}°`, `Sudut pedalaman = 180° − ${a}° = ${180 - a}°`] }); }
  const a = r.i(60, 80); return gsLQ('masalah', { q: `Garisan lintasan pejalan kaki dicat selari antara satu sama lain. Sebatang garisan sempadan jalan menyilang garisan-garisan itu pada sudut ${a}°. Apakah sudut sepadan pada garisan lintasan yang lain? Terangkan.`, ans: `${a}°, kerana sudut sepadan pada garis selari adalah sama`, work: ['Garisan lintasan selari, sempadan jalan ialah garis rentas lintang', `Sudut sepadan = ${a}°`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '6.1': { m: [() => GS.jenis(gsRG), () => GS.pasangan(gsRG), () => GS.silang(gsRG)], s: [() => GS.lurus(gsRG), () => GS.silang(gsRG)], k: [() => GS.masalah1(gsRG)] },
  '6.2': { m: [() => GS.kenal(gsRG), () => GS.selari(gsRG)], s: [() => GS.selariAlg(gsRG)], k: [() => GS.masalah2(gsRG)] }
};
const WG = {
  jenis: () => GS.jenis(gsRW), pasangan: () => GS.pasangan(gsRW), silang: () => GS.silang(gsRW), lurus: () => GS.lurus(gsRW), masalah1: i => GS.masalah1(gsRW, i),
  kenal: () => GS.kenal(gsRW), selari: () => GS.selari(gsRW), selariAlg: () => GS.selariAlg(gsRW), masalah2: i => GS.masalah2(gsRW, i)
};
const WSPLAN = {
  '6.1': [['m', 'jenis', 6], ['m', 'pasangan', 6], ['m', 'silang', 6], ['s', 'lurus', 6], ['s', 'silang', 3], ['k', 'masalah1', 3]],
  '6.2': [['m', 'kenal', 9], ['m', 'selari', 9], ['s', 'selariAlg', 9], ['k', 'masalah2', 3]]
};

/* =================== GAMES =================== */
function gsMcq(q, ans, wrongs, fig) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 5; w.length < 3 && k < 200; k += 5) { const c = A.replace(/\d+/, m => String(+m + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: fig || '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  jenis: L => {
    if (L === 0) { const a = pick([ri(10, 85), ri(95, 175), ri(185, 350)]); return gsMcq(`Sudut ${a}° ialah`, gsJenis(a), ['Sudut tirus', 'Sudut cakah', 'Sudut refleks', 'Sudut tegak']); }
    const k = ri(0, 2), a = k === 0 ? ri(10, 80) : k === 1 ? ri(20, 160) : ri(30, 330), T = [90, 180, 360][k], nm = ['pelengkap', 'penggenap', 'konjugat'][k];
    return gsMcq(`Sudut ${nm} bagi ${a}° ialah`, `${T - a}°`, [90, 180, 360].filter(x => x !== T && x > a).map(x => `${x - a}°`).concat([`${a}°`, `${T - a + 10}°`]));
  },
  silang: L => {
    const a = ri(35, 145); if (a === 90) return CQGEN.silang(L);
    if (L === 2) { const x = ri(15, 40), m = 2, b = ri(10, 30), c = 180 - 3 * x - b; if (c < 20) return CQGEN.silang(L); return gsMcq(`Sudut pada garis lurus: 2x, x + ${b}° dan ${c}°. Nilai x ialah`, `${x}°`, [`${x + 10}°`, `${Math.round((180 - c) / 2)}°`, `${x * 2}°`], gsStraight([2 * x, x + b, c], ['2x', `x + ${b}°`, `${c}°`])); }
    return gsMcq('Dua garis lurus bersilang. Nilai x ialah', L === 0 ? `${a}°` : `${180 - a}°`, L === 0 ? [`${180 - a}°`, `${90 - a > 0 ? 90 - a : a + 20}°`, `${360 - a}°`] : [`${a}°`, `${360 - a}°`, `${Math.abs(90 - a) || 45}°`], gsCross(a, L === 0 ? [`${a}°`, '', 'x', ''] : [`${a}°`, '', '', 'x']));
  },
  selari: L => {
    const t = ri(45, 80), k = L === 0 ? 0 : L === 1 ? 1 : 2;
    const figs = [gsPar(t, { kananAtas: `${t}°` }, { kananAtas: 'x' }), gsPar(t, { kiriBawah: `${t}°` }, { kananAtas: 'x' }), gsPar(t, { kiriBawah: `${t}°` }, { kiriAtas: 'x' })];
    const ans = k === 2 ? `${180 - t}°` : `${t}°`;
    return gsMcq('PQ selari dengan RS. Nilai x ialah', ans, [k === 2 ? `${t}°` : `${180 - t}°`, `${90 - t > 0 ? 90 - t : t - 20}°`, `${360 - t}°`], figs[k]);
  }
};
const CQT = { jenis: 'Jenis & pasangan sudut', silang: 'Garis bersilang', selari: 'Garis selari' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
