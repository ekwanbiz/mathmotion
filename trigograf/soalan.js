'use strict';
/* =================== GRAF TRIGO · SOALAN BAB 6 NISBAH DAN GRAF FUNGSI TRIGONOMETRI (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "tf" / "TF".

/* =================== pembantu nombor =================== */
const tfRad = d => d * Math.PI / 180;
const tfS = d => Math.sin(tfRad(d)), tfC = d => Math.cos(tfRad(d)), tfT = d => Math.tan(tfRad(d));
const TFF = { sin: tfS, kos: tfC, tan: tfT };
// nombor kemas: 4 t.p. maksimum, tiada −0
const tfN = (v, dp = 4) => { let r = +(+v).toFixed(dp); if (Object.is(r, -0) || Math.abs(r) < 1e-12) r = 0; return fmt(r); };
const tfSuk = t => (t > 0 && t < 90 ? 1 : t > 90 && t < 180 ? 2 : t > 180 && t < 270 ? 3 : 4);
const TFROM = ['', 'I', 'II', 'III', 'IV'];
const tfRef = t => { const q = tfSuk(t); return q === 1 ? t : q === 2 ? 180 - t : q === 3 ? t - 180 : 360 - t; };
const tfRefW = t => { const q = tfSuk(t); return q === 1 ? `α = ${t}°` : q === 2 ? `α = 180° − ${t}° = ${180 - t}°` : q === 3 ? `α = ${t}° − 180° = ${t - 180}°` : `α = 360° − ${t}° = ${360 - t}°`; };
const TFPOS = { sin: [1, 2], kos: [1, 4], tan: [1, 3] };
const tfSign = (f, t) => (TFPOS[f].includes(tfSuk(t)) ? 1 : -1);
// nilai tepat sudut khas (α = 0, 30, 45, 60, 90)
const TFEX = {
  sin: { 0: '0', 30: '½', 45: '1/√2', 60: '√3/2', 90: '1' },
  kos: { 0: '1', 30: '√3/2', 45: '1/√2', 60: '½', 90: '0' },
  tan: { 0: '0', 30: '1/√3', 45: '1', 60: '√3', 90: 'tidak tertakrif' }
};
const tfEx = (f, t) => {
  if (f === 'tan' && (t === 90 || t === 270)) return 'tidak tertakrif';
  const v = TFF[f](t); if (Math.abs(v) < 1e-9) return '0';
  const a = t % 90 === 0 ? (f === 'kos' ? 0 : 90) : tfRef(t);
  const base = t % 90 === 0 ? (Math.abs(v) > .5 ? '1' : '0') : TFEX[f][a];
  return (v < 0 ? '−' : '') + base;
};
// rawak: tfRG (Latihan Kelas / games), tfRW (berbenih, Lembaran Kerja)
const tfRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const tfRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
// sudut bukan gandaan 90
const tfSudut = (r, q) => { const k = q || r.i(1, 4); return (k - 1) * 90 + r.i(1, 89); };
const tfKhas = r => r.p([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);

/* ---------- fungsi y = a f(bx) + c ---------- */
const tfBs = b => (b === .5 ? '½' : b === 1 ? '' : String(b));
const tfFx = (a, f, b, c) => {
  let s = (a === 1 ? '' : a === -1 ? '−' : fmt(a) + ' ') + `${f} ${tfBs(b)}x`;
  if (c) s += (c > 0 ? ' + ' : ' − ') + Math.abs(c);
  return 'y = ' + s;
};
const tfKala = (f, b) => (f === 'tan' ? 180 : 360) / b;
const tfVal = (a, f, b, c, x) => a * TFF[f](b * x) + c;

/* =================== rajah =================== */
function tfUC(t, o = {}) {
  const W = 300, H = 260, cx = 150, cy = 130, R = 92;
  const px = +(cx + R * tfC(t)).toFixed(1), py = +(cy - R * tfS(t)).toFixed(1);
  let s = `<line x1="30" y1="${cy}" x2="270" y2="${cy}" style="stroke:var(--mu)" stroke-width="2"/><line x1="${cx}" y1="18" x2="${cx}" y2="242" style="stroke:var(--mu)" stroke-width="2"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" style="stroke:var(--bd)" stroke-width="2.5"/>`;
  const n = Math.max(2, Math.round(t / 6)), r = 26;
  let d = '';
  for (let k = 0; k <= n; k++) { const a = t * k / n; d += (k ? 'L' : 'M') + (cx + r * tfC(a)).toFixed(1) + ' ' + (cy - r * tfS(a)).toFixed(1); }
  s += `<path d="${d}" fill="none" style="stroke:var(--am)" stroke-width="2.5"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" style="stroke:var(--pu)" stroke-width="3.5" stroke-linecap="round"/><circle cx="${px}" cy="${py}" r="6" style="fill:var(--am)"/>`;
  if (o.lab !== false) s += `<text x="${(cx + 46 * tfC(t / 2)).toFixed(1)}" y="${(cy - 46 * tfS(t / 2)).toFixed(1)}" style="fill:var(--am)" font-size="14" font-weight="800" text-anchor="middle" dominant-baseline="central">${o.txt || t + '°'}</text>`;
  s += `<text x="262" y="${cy - 12}" style="fill:var(--mu)" font-size="13" font-weight="700">x</text><text x="${cx + 8}" y="26" style="fill:var(--mu)" font-size="13" font-weight="700">y</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Sudut pada bulatan unit')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// graf trigo: o = { fns:[{f, c}], y0, y1, x1, xs, yt }
function tfPlot(o) {
  const W = 340, H = 240, L = 36, R = W - 16, T = 14, B = H - 26;
  const x1 = o.x1 || 360, xs = o.xs || 90, y0 = o.y0, y1 = o.y1;
  const X = x => +(L + x * (R - L) / (x1 + 15)).toFixed(1), Y = y => +(B - (y - y0) * (B - T) / (y1 - y0)).toFixed(1);
  const tx = (x, y, t, an) => `<text x="${x}" y="${y}" style="fill:var(--mu)" font-size="11.5" font-weight="700" text-anchor="${an || 'middle'}" dominant-baseline="central">${t}</text>`;
  let s = '';
  for (let x = xs; x <= x1; x += xs) s += `<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${B}" style="stroke:var(--grid)" stroke-width="1.2"/>`;
  (o.yt || []).forEach(y => { s += `<line x1="${L}" y1="${Y(y)}" x2="${R}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.2"/>`; if (y) s += tx(L - 5, Y(y), fmt(y), 'end'); });
  const ay = Y(Math.max(y0, Math.min(y1, 0)));
  s += `<line x1="${L}" y1="${ay}" x2="${R}" y2="${ay}" style="stroke:var(--mu)" stroke-width="2"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" style="stroke:var(--mu)" stroke-width="2"/>`;
  for (let x = xs; x <= x1; x += xs) s += tx(X(x), ay + 12, x + '°');
  s += tx(L - 5, ay + 10, '0', 'end') + tx(R - 2, ay - 10, 'x', 'end') + tx(L + 9, T + 4, 'y', 'start');
  (o.fns || []).forEach(fn => {
    let d = '', pen = false;
    for (let k = 0; k <= 360; k++) {
      const x = x1 * k / 360, y = fn.f(x);
      if (!isFinite(y) || y < y0 - .2 || y > y1 + .2) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + X(x) + ' ' + Y(y); pen = true;
    }
    s += `<path d="${d}" fill="none" style="stroke:var(--${fn.c || 'tr'})" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Graf fungsi trigonometri')}" font-family="Inter, sans-serif">${s}</svg>`;
}
const tfGraf = (a, f, b, c, lab) => {
  const top = Math.abs(a) + c, bot = -Math.abs(a) + c, yt = [];
  for (let y = Math.floor(bot); y <= Math.ceil(top); y++) yt.push(y);
  return tfPlot({ fns: [{ f: x => tfVal(a, f, b, c, x), c: 'tr' }], y0: Math.min(bot, 0) - .6, y1: Math.max(top, 0) + .6, yt, xs: b >= 2 ? 45 : 90, label: lab || 'Graf fungsi trigonometri' });
};
const tfCard = (t, sub) => `<svg viewBox="0 0 340 150" role="img" aria-label="${esc(t)}" font-family="Inter, sans-serif"><rect x="6" y="6" width="328" height="138" rx="20" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/><text x="170" y="${sub ? 64 : 76}" style="fill:var(--tx)" font-size="${t.length > 20 ? 22 : 27}" font-weight="800" text-anchor="middle" dominant-baseline="central">${t}</text>${sub ? `<text x="170" y="108" style="fill:var(--mu)" font-size="16" font-weight="700" text-anchor="middle" dominant-baseline="central">${sub}</text>` : ''}</svg>`;

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 6.1 ---------- */
  sukuan: [
    ({ t }) => ({ q: `Dalam sukuan manakah sudut ${t}° terletak?` }),
    ({ t }) => ({ q: `Sisi OP pada bulatan unit diputar ${t}° lawan arah jam dari paksi-x positif. Nyatakan sukuan bagi P.` }),
    ({ t }) => ({ q: `Tentukan sukuan bagi sudut θ = ${t}°.` }),
    ({ t, ans }) => { const N = vnama(), w = (tfSuk(t) % 4) + 1; return Object.assign({ q: `${N} berkata sudut ${t}° terletak dalam Sukuan ${TFROM[w]}. Adakah ${N} betul?` }, salah(N, ans, 'Bandingkan sudut itu dengan 90°, 180° dan 270°.')); }
  ],
  tanda: [
    ({ f, t }) => ({ q: `Tanpa kalkulator, tentukan sama ada ${f} ${t}° bernilai positif atau negatif.` }),
    ({ f, t }) => ({ q: `Nyatakan tanda bagi ${f} ${t}°. Beri sebab.` }),
    ({ f, t }) => ({ q: `Adakah nilai ${f} ${t}° positif atau negatif?` }),
    ({ f, t, ans, pos }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${f} ${t}° bernilai ${pos ? 'negatif' : 'positif'}. Adakah ${N} betul?` }, salah(N, ans, 'Ingat: Semua – Sin – Tan – Kos (Sukuan I hingga IV).')); }
  ],
  rujukan: [
    ({ t }) => ({ q: `Cari sudut rujukan bagi ${t}°.` }),
    ({ t }) => ({ q: `Nyatakan sudut rujukan α bagi sudut θ = ${t}°.` }),
    ({ t }) => ({ q: `Sudut ${t}° dilukis pada bulatan unit. Berapakah sudut tirus di antara sisi OP dengan paksi-x?` }),
    ({ t, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sudut rujukan bagi ${t}° ialah ${tfRef(t) === 45 ? t : 90 - tfRef(t)}°. Adakah ${N} betul?` }, salah(N, ans, 'Sudut rujukan diukur dari paksi-x, bukan paksi-y.')); }
  ],
  nilaiK: [
    ({ f, t }) => ({ q: `Tanpa menggunakan kalkulator, cari nilai tepat ${f} ${t}°.` }),
    ({ f, t }) => ({ q: `Nyatakan nilai tepat bagi ${f} ${t}°.` }),
    ({ f, t }) => ({ q: `Dengan menggunakan sudut rujukan, tentukan nilai tepat ${f} ${t}°.` })
  ],
  nilai4: [
    ({ f, t }) => ({ q: `Cari nilai ${f} ${t}° betul kepada 4 tempat perpuluhan.` }),
    ({ f, t }) => ({ q: `Dengan menggunakan sudut rujukan dan kalkulator, hitung ${f} ${t}° (4 tempat perpuluhan).` }),
    ({ f, t }) => ({ q: `Nilaikan ${f} ${t}°. Beri jawapan betul kepada 4 tempat perpuluhan.` })
  ],
  cariTheta: [
    ({ f, v }) => ({ q: `Diberi ${f} θ = ${v} dan 0° ≤ θ ≤ 360°. Cari nilai-nilai θ.` }),
    ({ f, v }) => ({ q: `Selesaikan ${f} θ = ${v} bagi 0° ≤ θ ≤ 360°.` }),
    ({ f, v }) => ({ q: `Cari semua sudut θ dengan keadaan 0° ≤ θ ≤ 360° yang memuaskan ${f} θ = ${v}.` }),
    ({ f, v, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menyelesaikan ${f} θ = ${v} (0° ≤ θ ≤ 360°) dan hanya memperoleh satu jawapan. Adakah jawapan ${N} lengkap?` }, salah(N, ans, 'Bagi 0° ≤ θ ≤ 360°, cari dalam kedua-dua sukuan yang mempunyai tanda yang sama.')); }
  ],
  k61: [
    ({ g, v, syarat }) => ({ q: `Diberi ${g} θ = ${v} dengan ${syarat}. Tanpa kalkulator, cari nilai dua nisbah trigonometri yang lain bagi θ.` }),
    ({ g, v, syarat }) => ({ q: `Sudut θ memuaskan ${syarat} dan ${g} θ = ${v}. Lukis segi tiga rujukan dan tentukan nilai dua nisbah trigonometri yang lain bagi θ.` }),
    ({ g, v, syarat }) => ({ q: `Jika ${g} θ = ${v} dan ${syarat}, ungkapkan dua nisbah trigonometri yang lain bagi θ dalam bentuk pecahan.` })
  ],
  /* ---------- 6.2 ---------- */
  ampKala: [
    ({ e }) => ({ q: `Nyatakan amplitud dan kala bagi graf ${e}.` }),
    ({ e }) => ({ q: `Bagi fungsi ${e}, tentukan amplitud dan kala graf itu.` }),
    ({ e }) => ({ q: `Graf ${e} dilukis. Berapakah amplitud dan kalanya?` }),
    ({ e, ans, kala }) => { const N = vnama(); return Object.assign({ q: `${N} berkata kala bagi graf ${e} ialah ${kala * 4}°. Adakah ${N} betul?` }, salah(N, ans, 'Kala = 360° dibahagi dengan b, bukan didarab.')); }
  ],
  maksMin: [
    ({ e }) => ({ q: `Cari nilai maksimum dan nilai minimum bagi ${e}.` }),
    ({ e }) => ({ q: `Tentukan nilai maksimum dan minimum fungsi ${e}.` }),
    ({ e }) => ({ q: `Graf ${e} dilakar. Nyatakan nilai maksimum dan minimumnya.` }),
    ({ e, ans, A }) => { const N = vnama(); return Object.assign({ q: `${N} berkata nilai maksimum bagi ${e} ialah ${A}. Adakah ${N} betul?` }, salah(N, ans, 'Maksimum = |a| + c; jangan lupa anjakan c.')); }
  ],
  nilaiGraf: [
    ({ e, x }) => ({ q: `Diberi ${e}. Cari nilai y apabila x = ${x}°.` }),
    ({ e, x }) => ({ q: `Hitung nilai y bagi ${e} pada x = ${x}°.` }),
    ({ e, x }) => ({ q: `Titik (${x}°, k) terletak pada graf ${e}. Cari nilai k.` })
  ],
  bacaGraf: [
    ({ f }) => ({ q: `Rajah menunjukkan graf y = a ${f} bx + c bagi 0° ≤ x ≤ 360°, dengan a > 0. Cari nilai a, b dan c.` }),
    ({ f }) => ({ q: `Berdasarkan graf y = a ${f} bx + c (a > 0) dalam rajah, tentukan persamaan graf itu.` }),
    ({ f }) => ({ q: `Graf dalam rajah ialah graf y = a ${f} bx + c dengan a > 0. Nyatakan amplitud, kala dan persamaan graf.` })
  ],
  persamaan: [
    ({ f, M, m, K }) => ({ q: `Graf y = a ${f} bx + c (a > 0, b > 0) mempunyai nilai maksimum ${fmt(M)}, nilai minimum ${fmt(m)} dan kala ${K}°. Cari nilai a, b dan c.` }),
    ({ f, M, m, K }) => ({ q: `Suatu graf fungsi ${f} berbentuk y = a ${f} bx + c (a > 0, b > 0) berkala ${K}° dengan julat nilai y dari ${fmt(m)} hingga ${fmt(M)}. Tulis persamaan graf itu.` }),
    ({ f, M, m, K }) => ({ q: `Tulis persamaan y = a ${f} bx + c (a > 0, b > 0) yang mempunyai kala ${K}°, nilai maksimum ${fmt(M)} dan nilai minimum ${fmt(m)}.` })
  ],
  k62: [
    ({ obj, e, u }) => ({ q: `${obj} diberi oleh ${e}, dengan t dalam ${u}. Cari (i) ketinggian maksimum dan minimum, (ii) kala, (iii) ketinggian apabila t = 1.` }),
    ({ obj, e, u }) => ({ q: `Model ${e} (t dalam ${u}) mewakili ${obj.toLowerCase()}. Tentukan ketinggian maksimum, minimum, kala dan nilai h ketika t = 1.` }),
    ({ obj, e, u }) => ({ q: `${obj} berubah mengikut ${e} (t dalam ${u}). Hitung nilai maksimum dan minimum h, kala bagi fungsi itu, dan h apabila t = 1.` })
  ]
};

/* =================== pembina soalan (r = tfRG atau tfRW) =================== */
const TF = {};
/* ---------- 6.1 ---------- */
TF.sukuan = (r, i) => {
  const t = tfSudut(r, i == null ? null : (i % 4) + 1), q = tfSuk(t), ans = `Sukuan ${TFROM[q]}`;
  const lo = (q - 1) * 90, hi = q * 90;
  return GEN_LQ('sukuan', { t, ans, work: [`${lo}° < ${t}° < ${hi}°`, ans] }, { figAns: tfUC(t) });
};
TF.tanda = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos', 'tan']) : ['sin', 'kos', 'tan'][i % 3], t = tfSudut(r), q = tfSuk(t), pos = tfSign(f, t) > 0;
  const ans = pos ? 'Positif' : 'Negatif';
  return GEN_LQ('tanda', { f, t, pos, ans, work: [`${t}° dalam Sukuan ${TFROM[q]}.`, `Dalam Sukuan ${TFROM[q]}, ${['', 'semua nisbah positif', 'hanya sin positif', 'hanya tan positif', 'hanya kos positif'][q]}.`, `${f} ${t}° ${pos ? '> 0' : '< 0'}`] });
};
TF.rujukan = (r, i) => {
  const t = tfSudut(r, i == null ? r.i(2, 4) : (i % 3) + 2), a = tfRef(t);
  return GEN_LQ('rujukan', { t, ans: `α = ${a}°`, work: [`${t}° dalam Sukuan ${TFROM[tfSuk(t)]}.`, tfRefW(t)] }, { figAns: tfUC(t) });
};
TF.nilaiK = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos', 'tan']) : ['sin', 'kos', 'tan'][i % 3], t = tfKhas(r), a = tfRef(t), sg = tfSign(f, t);
  const ans = `${f} ${t}° = ${tfEx(f, t)}`;
  return GEN_LQ('nilaiK', { f, t, ans, work: [`${t}° dalam Sukuan ${TFROM[tfSuk(t)]}; ${tfRefW(t)}.`, `${f} ${t}° = ${sg > 0 ? '' : '−'}${f} ${a}°`, `= ${tfEx(f, t)}`] });
};
TF.nilai4 = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos', 'tan']) : ['sin', 'kos', 'tan'][i % 3];
  let t; do { t = tfSudut(r, r.i(2, 4)); } while (t % 5 && r.f() < .5);
  const a = tfRef(t), sg = tfSign(f, t), v = TFF[f](t);
  const ans = `${f} ${t}° = ${tfN(v)}`;
  return GEN_LQ('nilai4', { f, t, ans, work: [`${t}° dalam Sukuan ${TFROM[tfSuk(t)]}; ${tfRefW(t)}.`, `${f} ${t}° = ${sg > 0 ? '' : '−'}${f} ${a}°`, `= ${tfN(v)}`] });
};
TF.cariTheta = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos', 'tan']) : ['sin', 'kos', 'tan'][i % 3];
  const a = f === 'tan' ? r.p([30, 45, 60]) : r.p([30, 45, 60]), neg = r.f() < .5;
  const base = TFEX[f][a], v = (neg ? '−' : '') + base;
  const sol = [];
  for (let t = 0; t <= 360; t++) { const y = TFF[f](t), tgt = (neg ? -1 : 1) * TFF[f](a); if (Math.abs(y - tgt) < 1e-9) sol.push(t); }
  const qs = sol.map(tfSuk).map(q => TFROM[q]);
  const ans = `θ = ${sol[0]}° atau θ = ${sol[1]}°`;
  return GEN_LQ('cariTheta', { f, v, ans, work: [`Sudut rujukan: ${f} α = ${base} → α = ${a}°.`, `${f} ${neg ? 'negatif' : 'positif'} dalam Sukuan ${qs[0]} dan ${qs[1]}.`, ans] }, { figAns: tfUC(sol[0], { label: 'Salah satu penyelesaian pada bulatan unit' }) });
};
const TFTRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
TF.k61 = (r, i) => {
  const [p, q, h] = TFTRI[i == null ? r.i(0, 3) : i % 4], Q = r.i(2, 4), g = r.p(['sin', 'kos', 'tan']);
  // sudut rujukan α dengan sin α = p/h, kos α = q/h
  const sS = TFPOS.sin.includes(Q) ? '' : '−', sC = TFPOS.kos.includes(Q) ? '' : '−', sT = TFPOS.tan.includes(Q) ? '' : '−';
  const val = { sin: `${sS}${p}/${h}`, kos: `${sC}${q}/${h}`, tan: `${sT}${p}/${q}` };
  const syarat = ['', '', '90° < θ < 180°', '180° < θ < 270°', '270° < θ < 360°'][Q];
  const others = ['sin', 'kos', 'tan'].filter(x => x !== g);
  const ans = others.map(x => `${x} θ = ${val[x]}`).join(', ');
  return GEN_LQ('k61', { g, v: val[g], syarat, ans, work: [`θ dalam Sukuan ${TFROM[Q]}.`, `Segi tiga rujukan bersisi ${p}, ${q}, ${h} (${p}² + ${q}² = ${h}²).`, `Tanda dalam Sukuan ${TFROM[Q]}: sin ${sS || '+'}, kos ${sC || '+'}, tan ${sT || '+'}.`, ans] });
};

/* ---------- 6.2 ---------- */
const TFB = [1, 2, 3, .5];
const tfAbc = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos']) : ['sin', 'kos'][i % 2];
  const a = r.p([1, 2, 3, 4, 5, -2, -3]), b = i == null ? r.p(TFB) : TFB[Math.floor(i / 2) % 4], c = r.i(-3, 3);
  return { f, a, b, c, e: tfFx(a, f, b, c) };
};
TF.ampKala = (r, i) => {
  const { f, a, b, c, e } = tfAbc(r, i), kala = tfKala(f, b), A = Math.abs(a);
  const ans = `Amplitud = ${A}, kala = ${kala}°`;
  return GEN_LQ('ampKala', { e, kala, ans, work: [`a = ${fmt(a)}, b = ${b === .5 ? '½' : b}`, `Amplitud = |a| = ${A}`, `Kala = 360° ÷ ${b === .5 ? '½' : b} = ${kala}°`] }, { figAns: tfGraf(a, f, b, c) });
};
TF.maksMin = (r, i) => {
  const { f, a, b, c, e } = tfAbc(r, i), A = Math.abs(a), M = A + c, m = -A + c;
  const ans = `Maksimum = ${fmt(M)}, minimum = ${fmt(m)}`;
  return GEN_LQ('maksMin', { e, A, ans, work: [`Amplitud = |a| = ${A}, c = ${fmt(c)}`, `Maksimum = ${A} + (${fmt(c)}) = ${fmt(M)}`, `Minimum = −${A} + (${fmt(c)}) = ${fmt(m)}`] });
};
TF.nilaiGraf = (r, i) => {
  const { f, a, b, c, e } = tfAbc(r, i);
  // pilih x supaya bx gandaan 30 dan nilai kemas
  const opts = [];
  for (let x = 0; x <= 360; x += 15) { const u = b * x; if (u % 90 === 0 && u <= 720) opts.push(x); }
  const x = r.p(opts.filter(v => v > 0)), u = b * x, fv = TFF[f](u), y = tfVal(a, f, b, c, x);
  const ans = `y = ${tfN(y)}`;
  return GEN_LQ('nilaiGraf', { e, x, ans, work: [`y = ${a === 1 ? '' : a === -1 ? '−' : fmt(a) + ' '}${f} (${b === .5 ? '½' : b} × ${x}°)${c ? (c > 0 ? ' + ' : ' − ') + Math.abs(c) : ''}`, `= ${fmt(a)} × ${f} ${u}°${c ? (c > 0 ? ' + ' : ' − ') + Math.abs(c) : ''}`, `= ${fmt(a)} × (${tfN(fv)})${c ? (c > 0 ? ' + ' : ' − ') + Math.abs(c) : ''} = ${tfN(y)}`] });
};
TF.bacaGraf = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos']) : ['sin', 'kos'][i % 2], a = r.i(1, 4), b = i == null ? r.p([1, 2]) : [1, 2][Math.floor(i / 2) % 2], c = r.i(-2, 2);
  const kala = 360 / b, e = tfFx(a, f, b, c);
  return GEN_LQ('bacaGraf', { f, ans: `a = ${a}, b = ${b}, c = ${fmt(c)}; ${e}`, work: [`Maksimum ${fmt(a + c)}, minimum ${fmt(-a + c)} → a = (${fmt(a + c)} − (${fmt(-a + c)})) ÷ 2 = ${a}`, `c = (${fmt(a + c)} + (${fmt(-a + c)})) ÷ 2 = ${fmt(c)}`, `Satu kitaran lengkap dalam ${kala}° → b = 360° ÷ ${kala}° = ${b}`] }, { fig: tfGraf(a, f, b, c, 'Graf y = a ' + f + ' bx + c') });
};
TF.persamaan = (r, i) => {
  const f = i == null ? r.p(['sin', 'kos']) : ['sin', 'kos'][i % 2], a = r.i(1, 5), b = r.p([1, 2, 3, 4, .5]), c = r.i(-3, 4), K = 360 / b, M = a + c, m = c - a;
  const ans = `a = ${a}, b = ${b === .5 ? '½' : b}, c = ${fmt(c)}; ${tfFx(a, f, b, c)}`;
  return GEN_LQ('persamaan', { f, M, m, K, ans, work: [`a = (${fmt(M)} − (${fmt(m)})) ÷ 2 = ${a}`, `c = (${fmt(M)} + (${fmt(m)})) ÷ 2 = ${fmt(c)}`, `b = 360° ÷ ${K}° = ${b === .5 ? '½' : b}`] });
};
const TFK62 = [['Ketinggian air pasang, h meter, di sebuah jeti', 'jam'], ['Ketinggian sebuah kabin roda Ferris, h meter, dari tanah', 'minit'], ['Ketinggian hujung bilah kipas, h meter, dari lantai', 'saat'], ['Ketinggian sebuah buai, h meter, dari tanah', 'saat']];
TF.k62 = (r, i) => {
  const [obj, u] = TFK62[i == null ? r.i(0, 3) : i % 4], a = r.i(1, 6), c = a + r.i(2, 9), b = r.p([30, 45, 90]), f = 'sin';
  const e = `h = ${a === 1 ? '' : a + ' '}sin ${b}t + ${c}`, K = 360 / b, h1 = a * tfS(b) + c;
  const ans = `(i) maksimum ${a + c} m, minimum ${c - a} m; (ii) kala ${tfN(K)} ${u}; (iii) h = ${tfN(h1, 2)} m`;
  return GEN_LQ('k62', { obj, e, u, ans, work: [`Amplitud = ${a}, c = ${c}`, `Maksimum = ${a} + ${c} = ${a + c}; minimum = ${c} − ${a} = ${c - a}`, `Kala = 360° ÷ ${b}° = ${tfN(K)} ${u}`, `t = 1: h = ${a} sin ${b}° + ${c} = ${tfN(h1, 2)}`] });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '6.1': {
    m: [() => TF.sukuan(tfRG), () => TF.tanda(tfRG), () => TF.rujukan(tfRG), () => TF.nilaiK(tfRG)],
    s: [() => TF.nilai4(tfRG), () => TF.cariTheta(tfRG)],
    k: [() => TF.k61(tfRG)]
  },
  '6.2': {
    m: [() => TF.ampKala(tfRG), () => TF.maksMin(tfRG), () => TF.nilaiGraf(tfRG)],
    s: [() => TF.bacaGraf(tfRG), () => TF.persamaan(tfRG)],
    k: [() => TF.k62(tfRG)]
  }
};

/* =================== WG + WSPLAN =================== */
const WG = {};
['sukuan', 'tanda', 'rujukan', 'nilaiK', 'nilai4', 'cariTheta', 'k61', 'ampKala', 'maksMin', 'nilaiGraf', 'bacaGraf', 'persamaan', 'k62']
  .forEach(k => { WG[k] = i => TF[k](tfRW, i); });
const WSPLAN = {
  '6.1': [['m', 'sukuan', 5], ['m', 'tanda', 5], ['m', 'rujukan', 4], ['m', 'nilaiK', 4], ['s', 'nilai4', 5], ['s', 'cariTheta', 4], ['k', 'k61', 3]],
  '6.2': [['m', 'ampKala', 6], ['m', 'maksMin', 6], ['m', 'nilaiGraf', 6], ['s', 'bacaGraf', 5], ['s', 'persamaan', 4], ['k', 'k62', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function tfOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const tfMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const tfDeg = v => k => `${v + (k % 2 ? 1 : -1) * 10 * Math.ceil(k / 2)}°`;
const CQGEN = {
  sukuan: [
    () => { const t = tfSudut(tfRG); return tfMcq(`Sudut ${t}° terletak dalam`, tfCard(`θ = ${t}°`), tfOpts(`Sukuan ${TFROM[tfSuk(t)]}`, ['Sukuan I', 'Sukuan II', 'Sukuan III', 'Sukuan IV'], k => `Sukuan ${k}`)); },
    () => { const q = ri(1, 4), f = TFPOS; const set = ['sin', 'kos', 'tan'].filter(x => f[x].includes(q)); const A = q === 1 ? 'Semua positif' : `Hanya ${set.find(x => x !== 'sin' || q === 2)} positif`; return tfMcq(`Dalam Sukuan ${TFROM[q]}, nisbah manakah yang positif?`, tfCard(`Sukuan ${TFROM[q]}`), tfOpts(A, ['Semua positif', 'Hanya sin positif', 'Hanya kos positif', 'Hanya tan positif'], k => `${k}`)); },
    () => { const t = tfSudut(tfRG); return tfMcq('Sudut yang ditunjukkan pada bulatan unit terletak dalam', tfUC(t, { lab: false, label: 'Sudut pada bulatan unit' }), tfOpts(`Sukuan ${TFROM[tfSuk(t)]}`, ['Sukuan I', 'Sukuan II', 'Sukuan III', 'Sukuan IV'], k => `Sukuan ${k}`)); }
  ],
  tanda: [
    () => { const f = pick(['sin', 'kos', 'tan']), t = tfSudut(tfRG); return tfMcq(`Tanda bagi ${f} ${t}° ialah`, tfCard(`${f} ${t}°`), tfOpts(tfSign(f, t) > 0 ? 'Positif' : 'Negatif', ['Positif', 'Negatif', 'Sifar', 'Tidak tertakrif'], k => `${k}`)); },
    () => { const f = pick(['sin', 'kos', 'tan']), t = tfKhas(tfRG); const A = tfEx(f, t); return tfMcq(`Nilai tepat ${f} ${t}° ialah`, tfCard(`${f} ${t}°`), tfOpts(A, [A[0] === '−' ? A.slice(1) : '−' + A, '½', '−½', '√3/2', '−√3/2', '1/√2', '−1/√2', '√3', '1/√3', '1', '−1'], k => `${k}`)); },
    () => { const f = pick(['sin', 'kos']), t = tfKhas(tfRG); const A = tfN(TFF[f](t)); return tfMcq(`${f} ${t}° = ?`, tfCard(`${f} ${t}°`), tfOpts(A, [A[0] === '−' ? A.slice(1) : '−' + A, '0.5', '−0.5', '0.866', '−0.866', '0.7071', '−0.7071'], k => `${k}`)); }
  ],
  rujukan: [
    () => { const t = tfSudut(tfRG, ri(2, 4)), a = tfRef(t); return tfMcq(`Sudut rujukan bagi ${t}° ialah`, tfCard(`θ = ${t}°`), tfOpts(`${a}°`, [`${90 - a}°`, `${180 - t > 0 ? 180 - t : t - 180}°`, `${360 - t}°`, `${t - 90}°`], tfDeg(a))); },
    () => { const a = pick([20, 25, 35, 40, 50, 55, 65, 70]), q = ri(2, 4), t = [0, a, 180 - a, 180 + a, 360 - a][q]; return tfMcq(`Sudut θ dalam Sukuan ${TFROM[q]} mempunyai sudut rujukan ${a}°. Nilai θ ialah`, tfCard(`α = ${a}°`, `Sukuan ${TFROM[q]}`), tfOpts(`${t}°`, [`${180 - a}°`, `${180 + a}°`, `${360 - a}°`, `${90 + a}°`], tfDeg(t))); },
    () => { const f = pick(['sin', 'kos', 'tan']), a = pick([30, 45, 60]), neg = Math.random() < .5; const tgt = (neg ? -1 : 1) * TFF[f](a), sol = []; for (let t = 0; t <= 360; t++) if (Math.abs(TFF[f](t) - tgt) < 1e-9) sol.push(t); const A = `${sol[0]}°, ${sol[1]}°`; const v = (neg ? '−' : '') + TFEX[f][a]; return tfMcq(`Selesaikan ${f} θ = ${v}, 0° ≤ θ ≤ 360°.`, tfCard(`${f} θ = ${v}`), tfOpts(A, [`${a}°, ${180 - a}°`, `${180 - a}°, ${180 + a}°`, `${180 + a}°, ${360 - a}°`, `${a}°, ${360 - a}°`, `${a}°, ${180 + a}°`], k => `${a + k}°, ${180 + a + k}°`)); }
  ],
  graf: [
    () => { const f = pick(['sin', 'kos']), a = pick([1, 2, 3, 4, -2, -3]), b = pick([1, 2, 3]), c = ri(-2, 2), e = tfFx(a, f, b, c); const A = `${Math.abs(a)}`; return tfMcq(`Amplitud bagi graf ${e} ialah`, tfCard(e), tfOpts(A, [fmt(a), fmt(b), fmt(c), fmt(Math.abs(a) * 2), fmt(Math.abs(a) + c)], k => fmt(Math.abs(a) + k))); },
    () => { const f = pick(['sin', 'kos', 'tan']), b = pick([1, 2, 3, 4, .5]), e = tfFx(1, f, b, 0), K = tfKala(f, b); return tfMcq(`Kala bagi graf ${e} ialah`, tfCard(e), tfOpts(`${K}°`, [`${360 * b}°`, `${180 * b}°`, `${360 / b === K ? 180 / b : 360 / b}°`, '360°', '180°'], k => `${K + 30 * k}°`)); },
    () => { const f = pick(['sin', 'kos']), a = ri(1, 3), b = pick([1, 2]), c = ri(-1, 2), e = tfFx(a, f, b, c); return tfMcq('Persamaan bagi graf yang ditunjukkan ialah', tfGraf(a, f, b, c), tfOpts(e, [tfFx(a, f === 'sin' ? 'kos' : 'sin', b, c), tfFx(a, f, b === 1 ? 2 : 1, c), tfFx(a, f, b, -c || c + 1), tfFx(a + 1, f, b, c)], k => tfFx(a + k + 1, f, b, c + 1))); }
  ]
};
const CQT = { sukuan: 'Sukuan & tanda', tanda: 'Nilai sin, kos, tan', rujukan: 'Sudut rujukan', graf: 'Graf fungsi trigo' };
function tfCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.sukuan;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['sukuan', 'sukuan', 'tanda', 'rujukan', 'graf'] : Object.keys(CQT);
  return tfCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return tfCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
