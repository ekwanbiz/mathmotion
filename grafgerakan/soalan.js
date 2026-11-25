'use strict';
/* =================== GRAF GERAKAN · SOALAN BAB 7 GRAF GERAKAN (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "gg" / "GG" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
const ggR2 = x => Math.round(x * 100) / 100;
const ggClean = (x, dp = 2) => { const k = Math.pow(10, dp); return Number.isFinite(x) && Math.abs(x * k - Math.round(x * k)) < 1e-7; };
// nombor kemas: maksimum 2 t.p., tanda tolak sebenar, tiada −0
const ggN = x => { const v = ggR2(x); return v === 0 ? '0' : fmt(v); };
// rawak: ggRG untuk Latihan Kelas / games, ggRW (berbenih) untuk Lembaran Kerja
const ggRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const ggRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const ggLc = s => s[0].toLowerCase() + s.slice(1);

/* =================== data bersama =================== */
const GGU = {
  jam: { t: 'jam', d: 'km', v: 'km/j', tl: 'Masa (jam)', dl: 'Jarak (km)' },
  s: { t: 's', d: 'm', v: 'm/s', tl: 'Masa (s)', dl: 'Jarak (m)' },
  min: { t: 'minit', d: 'km', v: 'km/j', tl: 'Masa (minit)', dl: 'Jarak (km)' }
};
const GGOBJ = {
  jam: [['Sebuah kereta', 'kereta itu'], ['Sebuah bas', 'bas itu'], ['Sebuah lori', 'lori itu'], ['Sebuah van', 'van itu'], ['Sebuah motosikal', 'motosikal itu']],
  s: [['Seorang pelari', 'pelari itu'], ['Sebuah kereta kawalan jauh', 'kereta kawalan jauh itu'], ['Seorang penunggang basikal', 'penunggang basikal itu'], ['Sebuah robot', 'robot itu'], ['Seekor kuda', 'kuda itu']],
  min: [['Encik Rahman', 'Encik Rahman'], ['Puan Devi', 'Puan Devi'], ['Kak Mei', 'Kak Mei'], ['Abang Zul', 'Abang Zul']]
};
const GGLM = [['Sebuah kereta', 'kereta itu'], ['Sebuah motosikal', 'motosikal itu'], ['Sebuah kereta api', 'kereta api itu'], ['Sebuah bas', 'bas itu'], ['Seorang pelumba basikal', 'pelumba basikal itu'], ['Sebuah lori', 'lori itu']];
const ggObj = (r, unit) => r.p(GGOBJ[unit]);
const GGBS1 = [
  ['Kecerunan graf jarak-masa mewakili laju objek.', true, 'Laju = jarak ÷ masa = kecerunan graf jarak-masa.'],
  ['Garis mengufuk dalam graf jarak-masa menunjukkan objek bergerak dengan laju seragam.', false, 'Garis mengufuk bermaksud jarak tidak berubah, iaitu objek pegun.'],
  ['Garis yang lebih curam dalam graf jarak-masa menunjukkan laju yang lebih tinggi.', true, 'Kecerunan yang lebih besar bermaksud laju yang lebih tinggi.'],
  ['Laju purata ialah jumlah jarak dibahagi dengan jumlah masa.', true, 'Laju purata = jumlah jarak ÷ jumlah masa.'],
  ['Masa berhenti tidak diambil kira semasa mengira laju purata.', false, 'Jumlah masa termasuk masa objek berhenti.'],
  ['Garis yang turun dalam graf jarak-masa menunjukkan objek bergerak kembali ke arah titik mula.', true, 'Jarak dari titik mula berkurang, jadi objek bergerak kembali.'],
  ['Dalam graf jarak-masa, paksi mencancang mewakili masa.', false, 'Paksi mencancang mewakili jarak; paksi mengufuk mewakili masa.'],
  ['Jika graf jarak-masa kembali ke paksi masa, jumlah jarak yang dilalui ialah sifar.', false, 'Objek kembali ke titik mula, tetapi jarak pergi dan jarak balik tetap dilalui.']
];
const GGBS2 = [
  ['Kecerunan graf laju-masa mewakili pecutan.', true, 'Pecutan = perubahan laju ÷ masa = kecerunan graf laju-masa.'],
  ['Luas di bawah graf laju-masa mewakili jarak yang dilalui.', true, 'Jarak = luas di bawah graf laju-masa.'],
  ['Garis mengufuk dalam graf laju-masa menunjukkan objek pegun.', false, 'Garis mengufuk bermaksud laju tidak berubah (laju seragam). Objek pegun hanya apabila laju = 0.'],
  ['Kecerunan negatif dalam graf laju-masa menunjukkan nyahpecutan.', true, 'Laju berkurang, maka pecutan negatif, iaitu nyahpecutan.'],
  ['Pecutan sifar bermaksud objek bergerak dengan laju seragam.', true, 'Laju tidak berubah, jadi pecutan = 0.'],
  ['Luas di bawah graf laju-masa mewakili pecutan.', false, 'Luas di bawah graf laju-masa mewakili jarak. Pecutan ialah kecerunan graf.'],
  ['Unit pecutan ialah m/s.', false, 'Unit pecutan ialah m/s² (laju ÷ masa).'],
  ['Nyahpecutan 3 m/s² bermaksud laju berkurang 3 m/s setiap saat.', true, 'Nyahpecutan ialah kadar laju berkurang.']
];
const GGGERAK = {
  acc: ['Pecutan (laju bertambah)', 'Garis naik dari kiri ke kanan: laju bertambah, maka objek memecut.', 'nyahpecutan'],
  uni: ['Laju seragam (pecutan sifar)', 'Garis mengufuk: laju tidak berubah, maka objek bergerak dengan laju seragam.', 'pegun'],
  dec: ['Nyahpecutan (laju berkurang)', 'Garis turun dari kiri ke kanan: laju berkurang, maka objek mengalami nyahpecutan.', 'pecutan']
};

/* =================== rajah: graf gerakan =================== */
const ggT = (x, y, t, c = 'tx', sz = 15, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const ggL = (p, q, c, w = 3.5, dash) => `<line x1="${+p[0].toFixed(1)}" y1="${+p[1].toFixed(1)}" x2="${+q[0].toFixed(1)}" y2="${+q[1].toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="6 5"' : ''}/>`;
// o = { tmax, ymax, xt:[[nilai,label]], yt:[[nilai,label]], grid:{x,y}, xlab, ylab, lines:[{pts,c,w}], areas:[{pts,c}], guides:[[t,v]], dots:[{t,v,c,l,dx,dy,a}], texts:[{t,v,s,c,size,a}], table:[[...],[...]], label }
function ggGraf(o) {
  const tb = o.table ? 58 : 0, W = 360, H = 264 + tb, L = 62, T = 34 + tb, R = 328, B = 214 + tb;
  const X = t => L + (R - L) * t / o.tmax, Y = v => B - (B - T) * v / o.ymax;
  let s = '';
  if (o.table) {
    const cols = o.table[0].length, cw = (W - 16) / cols;
    o.table.forEach((row, ri) => row.forEach((c, ci) => {
      s += `<rect x="${+(8 + ci * cw).toFixed(1)}" y="${4 + ri * 25}" width="${+cw.toFixed(1)}" height="25" style="fill:var(--${ci === 0 ? 'grid' : 'bg'});stroke:var(--mu)" stroke-width="1"/>`;
      s += ggT(8 + ci * cw + cw / 2, 16.5 + ri * 25, c, 'tx', ci === 0 ? 12 : 13.5, 'middle', ci === 0 ? 700 : 600);
    }));
  }
  if (o.grid) {
    for (let t = o.grid.x; t <= o.tmax + 1e-9; t += o.grid.x) s += ggL([X(t), Y(0)], [X(t), Y(o.ymax)], 'grid', 1.2);
    for (let v = o.grid.y; v <= o.ymax + 1e-9; v += o.grid.y) s += ggL([X(0), Y(v)], [X(o.tmax), Y(v)], 'grid', 1.2);
  }
  (o.areas || []).forEach(a => {
    const pp = [[a.pts[0][0], 0]].concat(a.pts, [[a.pts[a.pts.length - 1][0], 0]]);
    s += `<polygon points="${pp.map(p => `${+X(p[0]).toFixed(1)},${+Y(p[1]).toFixed(1)}`).join(' ')}" style="fill:var(--${a.c});fill-opacity:.22;stroke:none"/>`;
  });
  (o.guides || []).forEach(([t, v]) => { if (t > 0) s += ggL([X(t), Y(0)], [X(t), Y(v)], 'mu', 1.6, true); if (v > 0 && t > 0) s += ggL([X(0), Y(v)], [X(t), Y(v)], 'mu', 1.6, true); });
  s += ggL([L, B], [R + 18, B], 'mu', 2.4) + `<path d="M${R + 12} ${B - 5} L${R + 19} ${B} L${R + 12} ${B + 5}" style="fill:none;stroke:var(--mu)" stroke-width="2.4"/>`;
  s += ggL([L, B], [L, T - 18], 'mu', 2.4) + `<path d="M${L - 5} ${T - 12} L${L} ${T - 19} L${L + 5} ${T - 12}" style="fill:none;stroke:var(--mu)" stroke-width="2.4"/>`;
  s += ggT(L - 7, B + 13, '0', 'mu', 13, 'end', 600);
  (o.xt || []).forEach(([t, l]) => { s += ggL([X(t), B], [X(t), B + 5], 'mu', 2) + ggT(X(t), B + 15, l, /^[a-zA-Z]/.test(l) ? 'pk' : 'mu', /^[a-zA-Z]/.test(l) ? 16 : 13, 'middle', 700); });
  (o.yt || []).forEach(([v, l]) => { s += ggL([L - 5, Y(v)], [L, Y(v)], 'mu', 2) + ggT(L - 8, Y(v), l, /^[a-zA-Z]/.test(l) ? 'pk' : 'mu', /^[a-zA-Z]/.test(l) ? 16 : 13, 'end', 700); });
  s += ggT(L - 4, T - 26, o.ylab, 'tx', 13.5, 'start', 700) + ggT(W - 4, B + 36, o.xlab, 'tx', 13.5, 'end', 700);
  (o.lines || []).forEach(l => { s += `<polyline points="${l.pts.map(p => `${+X(p[0]).toFixed(1)},${+Y(p[1]).toFixed(1)}`).join(' ')}" style="fill:none;stroke:var(--${l.c || 'am'})" stroke-width="${l.w || 4}" stroke-linecap="round" stroke-linejoin="round"/>`; });
  (o.dots || []).forEach(d => { s += `<circle cx="${+X(d.t).toFixed(1)}" cy="${+Y(d.v).toFixed(1)}" r="5" style="fill:var(--${d.c || 'am'})"/>`; if (d.l) s += ggT(X(d.t) + (d.dx || 0), Y(d.v) + (d.dy == null ? -14 : d.dy), d.l, d.c || 'am', 15, d.a || 'middle'); });
  (o.texts || []).forEach(d => { s += ggT(X(d.t), Y(d.v), d.s, d.c || 'tx', d.size || 14, d.a || 'middle'); });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Graf gerakan')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// label huruf pada bucu graf (P, Q, R ...)
const ggLetters = (pts, names, c) => pts.map((p, i) => ({ t: p[0], v: p[1], c: c || 'am', l: names[i], dx: i === 0 ? 10 : 0, dy: i === 0 ? -12 : (i === pts.length - 1 && p[1] === 0 ? -14 : -14) }));
// graf jarak-masa daripada data ggJMData
function ggJMFig(d, o = {}) {
  const U = d.U, top = Math.max(d.d1, d.d3), xt = [[d.t1, ggN(d.t1)], [d.t2, ggN(d.t2)], [d.T, o.hideT ? 'T' : ggN(d.T)]];
  const yt = [[d.d1, o.hideD ? 'd' : ggN(d.d1)]].concat(d.kind === 'pergi' ? [[d.d3, ggN(d.d3)]] : []);
  return ggGraf({ tmax: d.T * 1.1, ymax: top * 1.16, xt, yt, xlab: U.tl, ylab: U.dl, guides: [[d.t1, d.d1], [d.t2, d.d1]].concat(d.kind === 'pergi' ? [[d.T, d.d3]] : []),
    lines: [{ pts: d.pts, c: 'am', w: 4 }], dots: o.letters ? ggLetters(d.pts, ['O', 'P', 'Q', 'R'], 'am').slice(1) : [], label: o.label || 'Graf jarak-masa' });
}
// graf laju-masa daripada data ggLMData
function ggLMFig(d, o = {}) {
  const xt = [], yt = [];
  d.pts.forEach(([t, v], i) => { if (t > 0) xt.push([t, o.hideT && i === d.pts.length - 1 ? 'T' : ggN(t)]); });
  const vs = [...new Set(d.pts.map(p => p[1]).filter(v => v > 0))];
  vs.forEach(v => yt.push([v, o.hideV && v === d.v ? 'v' : ggN(v)]));
  const guides = d.pts.filter(p => p[0] > 0 && p[1] > 0);
  const areas = o.shade ? d.pts.slice(0, -1).map((p, i) => ({ pts: [p, d.pts[i + 1]], c: ['gr', 'am', 'rd', 'tr'][i] })) : [];
  return ggGraf({ tmax: d.T * 1.1, ymax: d.v * 1.2, xt, yt, xlab: 'Masa (s)', ylab: 'Laju (m/s)', guides, areas,
    lines: [{ pts: d.pts, c: 'am', w: 4 }], dots: o.letters ? ggLetters(d.pts, ['P', 'Q', 'R', 'S'], 'am') : [], label: o.label || 'Graf laju-masa' });
}
// skala grid kemas untuk soalan melukis
const ggStep = m => { const raw = m / 5, p = Math.pow(10, Math.floor(Math.log10(raw))); for (const k of [1, 2, 2.5, 5, 10]) if (k * p >= raw) return k * p; return 10 * p; };
function ggLukisFig(d, filled, kind) {
  const ymaxRaw = kind === 'jm' ? Math.max(d.d1, d.d3) : d.v, ys = ggStep(ymaxRaw), ymax = Math.ceil(ymaxRaw / ys + .01) * ys;
  const xs = ggStep(d.T), tmax = Math.ceil(d.T / xs + .01) * xs;
  const xt = [], yt = [];
  for (let t = xs; t <= tmax + 1e-9; t += xs) xt.push([ggR2(t), ggN(t)]);
  for (let v = ys; v <= ymax + 1e-9; v += ys) yt.push([ggR2(v), ggN(v)]);
  const U = kind === 'jm' ? d.U : { tl: 'Masa (s)', dl: 'Laju (m/s)' };
  const table = [[U.tl].concat(d.pts.map(p => ggN(p[0]))), [U.dl].concat(d.pts.map(p => ggN(p[1])))];
  return ggGraf({ tmax, ymax, xt, yt, grid: { x: xs, y: ys }, xlab: U.tl, ylab: U.dl, table, lines: filled ? [{ pts: d.pts, c: 'am', w: 4 }] : [],
    dots: filled ? d.pts.map(([t, v]) => ({ t, v, c: 'pk' })) : [], label: filled ? 'Graf yang dilukis' : 'Jadual dan grid untuk melukis graf' });
}

/* =================== data gerakan =================== */
// graf jarak-masa 3 peringkat: bergerak, pegun, (pergi lagi | balik ke titik mula)
function ggJMData(r, kind, unit, opt = {}) {
  kind = kind || (r.f() < .5 ? 'balik' : 'pergi'); unit = unit || r.p(['jam', 's']);
  let d, n = 0;
  do {
    let v1, t1, tr, t3, v3;
    if (unit === 'jam') { v1 = r.p([40, 50, 60, 70, 80, 90, 100, 120]); t1 = r.p([1, 1.5, 2, 2.5, 3]); tr = r.p([0.5, 1, 1.5]); t3 = r.p([1, 1.5, 2, 2.5, 3]); v3 = r.p([30, 40, 50, 60, 70, 80, 90]); }
    else { v1 = r.i(2, 12); t1 = r.p([5, 10, 15, 20, 25, 30]); tr = r.p([5, 10, 15, 20]); t3 = r.p([5, 10, 15, 20, 25, 30, 40]); v3 = r.i(2, 10); }
    const d1 = v1 * t1, t2 = t1 + tr, T = t2 + t3;
    if (kind === 'balik') v3 = d1 / t3;
    const d3 = kind === 'balik' ? 0 : d1 + v3 * t3, total = kind === 'balik' ? 2 * d1 : d3;
    d = { kind, unit, U: GGU[unit], v1, t1, tr, t2, t3, T, d1, v3, d3, total, avg: total / T, pts: [[0, 0], [t1, d1], [t2, d1], [T, d3]] };
    d.wrongAvg = kind === 'balik' ? d1 / T : d3 / (T - tr);
    d.ok = ggClean(v3, 1) && ggClean(d1) && tr / T >= .1 && t1 / T >= .14 && t3 / T >= .14 && (kind === 'balik' || (d3 - d1) / d3 >= .2) && d1 / Math.max(d1, d3) >= .3
      && (!opt.no1 || (t1 !== 1 && t3 !== 1)) && (!opt.avg || (ggClean(d.avg, 1) && ggClean(d.wrongAvg, 1) && Math.abs(d.avg - d.wrongAvg) > 1e-9));
  } while (!d.ok && ++n < 4000);
  return d;
}
// graf jarak-masa dalam km & minit (laju dalam km/j)
function ggJMMin(r, opt = {}) {
  let d, n = 0;
  do {
    const d1 = r.i(2, 15), t1 = r.p([5, 6, 10, 12, 15, 20, 24, 30, 36, 40, 45]), tr = r.p([5, 10, 15, 20]), t3 = r.p([6, 10, 12, 15, 20, 24, 30, 40]);
    const t2 = t1 + tr, T = t2 + t3, v1 = d1 * 60 / t1, v3 = d1 * 60 / t3;
    d = { kind: 'balik', unit: 'min', U: GGU.min, v1, t1, tr, t2, t3, T, d1, v3, d3: 0, total: 2 * d1, avg: 2 * d1 * 60 / T, pts: [[0, 0], [t1, d1], [t2, d1], [T, 0]] };
    d.ok = ggClean(v1, 1) && ggClean(v3, 1) && v1 >= 6 && v1 <= 120 && v3 >= 6 && v3 <= 120 && tr / T >= .1 && t1 / T >= .14 && t3 / T >= .14 && Math.abs(v1 - v3) > .01 && (!opt.avg || ggClean(d.avg, 1));
  } while (!d.ok && ++n < 4000);
  return d;
}
// graf laju-masa: (0,u) → (t1,v) → (t2,v) → (T,0)
function ggLMData(r, opt = {}) {
  let d, n = 0;
  do {
    const u = opt.u0 ? 0 : opt.u1 ? r.p([2, 4, 5, 6, 8, 10, 12]) : (r.f() < .5 ? 0 : r.p([2, 4, 5, 6, 8, 10, 12]));
    const v = r.p([10, 12, 14, 15, 16, 18, 20, 24, 25, 30]), t1 = r.p([2, 3, 4, 5, 6, 8, 10]), t2 = t1 + r.p([4, 5, 6, 8, 10, 12]), T = t2 + r.p([2, 3, 4, 5, 6, 8, 10]);
    const a1 = (v - u) / t1, dec = v / (T - t2), A1 = (u + v) / 2 * t1, A2 = v * (t2 - t1), A3 = v * (T - t2) / 2, D = A1 + A2 + A3;
    d = { u, v, t1, t2, T, a1, dec, A1, A2, A3, D, avg: D / T, pts: [[0, u], [t1, v], [t2, v], [T, 0]] };
    d.ok = u < v && a1 <= 8 && dec <= 10 && ggClean(a1, 1) && ggClean(dec, 1) && ggClean(D, 1) && ggClean(A1, 1) && ggClean(A3, 1) && (u === 0 || (v - u) / v >= .25) && t1 / T >= .12 && (t2 - t1) / T >= .15 && (T - t2) / T >= .12
      && (!opt.avg || ggClean(d.avg, 2));
  } while (!d.ok && ++n < 4000);
  return d;
}
const ggArea1 = d => d.u === 0
  ? [`Luas segi tiga = ${fr(1, 2)} × ${d.t1} × ${d.v}`, `= ${ggN(d.A1)} m`]
  : [`Luas trapezium = ${fr(1, 2)} × (${d.u} + ${d.v}) × ${d.t1}`, `= ${ggN(d.A1)} m`];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 7.1 Graf Jarak-Masa ---------- */
  jmBaca: [
    ({ o, tq, U, T }) => ({ q: `Graf jarak-masa di bawah menunjukkan gerakan ${ggLc(o[0])} selama ${ggN(T)} ${U.t}. Berapakah jarak ${o[1]} dari titik mula pada masa ${ggN(tq)} ${U.t}?` }),
    ({ o, tq, U }) => ({ q: `Berdasarkan graf jarak-masa di bawah, nyatakan jarak ${ggLc(o[0])} dari titik mula selepas ${ggN(tq)} ${U.t}.` }),
    ({ o, tq, U }) => ({ q: `Rajah di bawah ialah graf jarak-masa bagi ${ggLc(o[0])}. Pada masa ${ggN(tq)} ${U.t}, berapa jauhkah ${o[1]} dari titik mula?` }),
    ({ o, tq, U, T }) => ({ q: `${o[0]} bergerak selama ${ggN(T)} ${U.t} seperti dalam graf jarak-masa di bawah. Baca graf untuk menentukan jarak ${o[1]} dari titik mula pada masa ${ggN(tq)} ${U.t}.` })
  ],
  jmPegun: [
    ({ o, U, T }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${ggLc(o[0])} selama ${ggN(T)} ${U.t}. Berapa lamakah ${o[1]} berhenti?` }),
    ({ o, U, T }) => ({ q: `Berdasarkan graf jarak-masa di bawah bagi perjalanan ${ggN(T)} ${U.t} oleh ${ggLc(o[0])}, nyatakan tempoh masa ${o[1]} pegun.` }),
    ({ o, U, t1, t2, ans }) => { const N = vnama(); return Object.assign({ q: `Graf jarak-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. ${N} berkata ${o[1]} bergerak dengan laju seragam dari ${ggN(t1)} ${U.t} hingga ${ggN(t2)} ${U.t}. Adakah ${N} betul?` }, salah(N, `${o[1]} pegun selama ${ans}`, 'Garis mengufuk dalam graf jarak-masa bermaksud jarak tidak berubah, iaitu objek pegun.')); },
    ({ o, U, T }) => ({ q: `${o[0]} membuat perjalanan selama ${ggN(T)} ${U.t} dan berhenti seketika, seperti dalam graf jarak-masa di bawah. Tentukan tempoh ${o[1]} berhenti.` })
  ],
  jmLaju: [
    ({ o, when }) => ({ q: `Graf jarak-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Hitung laju ${o[1]} ${when}.` }),
    ({ o, when }) => ({ q: `Berdasarkan graf jarak-masa di bawah, cari laju ${ggLc(o[0])} ${when}.` }),
    ({ o, when }) => ({ q: `Kecerunan graf jarak-masa mewakili laju. Gunakan graf di bawah untuk mencari laju ${ggLc(o[0])} ${when}.` }),
    ({ o, when, dist, U, ans }) => { const N = vnama(); return Object.assign({ q: `Rujuk graf jarak-masa di bawah. ${N} berkata laju ${ggLc(o[0])} ${when} ialah ${ggN(dist)} ${U.v}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya membaca jarak. Laju = jarak ÷ masa.`)); }
  ],
  lajuPurata: [
    ({ O, d1, t1, tr, d2, t2, U }) => ({ q: `${O[0]} bergerak sejauh ${ggN(d1)} ${U.d} dalam ${ggN(t1)} ${U.t}, berhenti selama ${ggN(tr)} ${U.t}, kemudian bergerak lagi sejauh ${ggN(d2)} ${U.d} dalam ${ggN(t2)} ${U.t}. Hitung laju purata ${O[1]} bagi seluruh perjalanan.` }),
    ({ O, d1, t1, tr, d2, t2, U }) => ({ q: `Dalam satu perjalanan, ${ggLc(O[0])} menempuh ${ggN(d1)} ${U.d} dalam ${ggN(t1)} ${U.t} dan ${ggN(d2)} ${U.d} lagi dalam ${ggN(t2)} ${U.t}. Di antara dua bahagian itu, ${O[1]} berhenti selama ${ggN(tr)} ${U.t}. Berapakah laju purata ${O[1]}?` }),
    ({ d1, t1, tr, d2, t2, U }) => ({ q: `Lengkapkan: Laju purata = (${ggN(d1)} + ${ggN(d2)}) ÷ (${ggN(t1)} + ${ggN(tr)} + ${ggN(t2)}) = ___ ${U.v}` }),
    ({ O, d1, t1, tr, d2, t2, U, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${O[0]} bergerak ${ggN(d1)} ${U.d} dalam ${ggN(t1)} ${U.t}, berhenti ${ggN(tr)} ${U.t}, lalu bergerak ${ggN(d2)} ${U.d} dalam ${ggN(t2)} ${U.t}. ${N} berkata laju puratanya ialah ${ggN(wrong)} ${U.v}, iaitu purata bagi dua laju itu. Adakah ${N} betul?` }, salah(N, ans, 'Laju purata ialah jumlah jarak ÷ jumlah masa (termasuk masa berhenti), bukan purata bagi laju-laju.')); }
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  lukisJM: [
    ({ o, U }) => ({ q: `Jadual di bawah menunjukkan jarak ${ggLc(o[0])} dari titik mula pada masa tertentu. Lukis graf jarak-masa pada grid yang diberi (${U.tl.toLowerCase()} pada paksi mengufuk).` }),
    ({ o }) => ({ q: `Dengan menggunakan skala pada grid, plot titik-titik daripada jadual di bawah dan lukis graf jarak-masa bagi gerakan ${ggLc(o[0])}.` }),
    ({ o }) => ({ q: `Lukis graf jarak-masa bagi perjalanan ${ggLc(o[0])} berdasarkan jadual di bawah. Kemudian, nyatakan tempoh ${o[1]} pegun.` })
  ],
  jmPurata: [
    ({ o, U, T }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${ggLc(o[0])} selama ${ggN(T)} ${U.t}. Hitung laju purata ${o[1]} bagi seluruh perjalanan.` }),
    ({ o, U, T }) => ({ q: `Berdasarkan graf jarak-masa di bawah, cari laju purata ${ggLc(o[0])} dalam tempoh ${ggN(T)} ${U.t}.` }),
    ({ o, U, wrong, ans, kind }) => { const N = vnama(); return Object.assign({ q: `Rujuk graf jarak-masa di bawah. ${N} mengira laju purata ${ggLc(o[0])} bagi seluruh perjalanan sebagai ${ggN(wrong)} ${U.v}. Adakah ${N} betul?` }, salah(N, ans, kind === 'balik' ? `${N} hanya mengambil jarak pergi. Jumlah jarak termasuk jarak balik.` : `${N} tidak memasukkan masa berhenti. Jumlah masa termasuk masa pegun.`)); },
    ({ o, U, T, kind }) => ({ q: `${o[0]} ${kind === 'balik' ? 'bergerak dari titik mula, berhenti, kemudian kembali ke titik mula' : 'bergerak, berhenti, kemudian meneruskan perjalanan'} dalam masa ${ggN(T)} ${U.t} seperti graf di bawah. Tentukan laju purata ${o[1]}.` })
  ],
  jmCariT: [
    ({ o, U, t2, v3 }) => ({ q: `Graf jarak-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Laju ${o[1]} dari masa ${ggN(t2)} ${U.t} hingga T ${U.t} ialah ${ggN(v3)} ${U.v}. Cari nilai T.` }),
    ({ o, U, v3 }) => ({ q: `Berdasarkan graf jarak-masa di bawah, ${ggLc(o[0])} bergerak dengan laju ${ggN(v3)} ${U.v} pada peringkat terakhir. Hitung nilai T.` }),
    ({ o, U, v3 }) => ({ q: `${o[0]} bergerak seperti dalam graf jarak-masa di bawah. Jika laju ${o[1]} pada peringkat akhir ialah ${ggN(v3)} ${U.v}, cari nilai T.` })
  ],
  jmCariD: [
    ({ o, U, t1, v1 }) => ({ q: `Graf jarak-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Laju ${o[1]} dalam ${ggN(t1)} ${U.t} pertama ialah ${ggN(v1)} ${U.v}. Cari nilai d.` }),
    ({ o, U, v1 }) => ({ q: `Berdasarkan graf jarak-masa di bawah, ${ggLc(o[0])} bergerak dengan laju seragam ${ggN(v1)} ${U.v} pada peringkat pertama. Hitung nilai d.` }),
    ({ o, U, t1, v1 }) => ({ q: `${o[0]} mula bergerak dengan laju ${ggN(v1)} ${U.v} selama ${ggN(t1)} ${U.t} seperti graf di bawah. Apakah nilai d?` })
  ],
  jmUnit: [
    ({ o, when }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${o[0]}. Hitung laju ${o[1]} ${when}, dalam km/j.` }),
    ({ o, when }) => ({ q: `Berdasarkan graf jarak-masa di bawah, cari laju ${o[0]} ${when}. Beri jawapan dalam km/j.` }),
    ({ o, when }) => ({ q: `${o[0]} berbasikal seperti dalam graf jarak-masa di bawah. Berapakah lajunya ${when} dalam unit km/j?` })
  ],
  k71: [
    ({ a }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${a.o[0]} dari rumah ke sebuah kedai dan kembali ke rumah. (a) Hitung laju ${a.o[1]} ke kedai, dalam km/j. (b) Berapa lamakah ${a.o[1]} pegun di kedai? (c) Hitung laju purata bagi seluruh perjalanan, dalam km/j.`, ans: `(a) ${ggN(a.v1)} km/j (b) ${ggN(a.tr)} minit (c) ${ggN(a.avg)} km/j`, work: [`(a) Laju = ${ggN(a.d1)} km ÷ ${ggN(a.t1)} minit = ${ggN(a.d1)} × ${fr(60, ggN(a.t1))} = ${ggN(a.v1)} km/j`, `(b) Garis mengufuk: ${ggN(a.t2)} − ${ggN(a.t1)} = ${ggN(a.tr)} minit`, `(c) Jumlah jarak = ${ggN(a.d1)} + ${ggN(a.d1)} = ${ggN(2 * a.d1)} km; jumlah masa = ${ggN(a.T)} minit`, `Laju purata = ${ggN(2 * a.d1)} × ${fr(60, ggN(a.T))} = ${ggN(a.avg)} km/j`] }),
    ({ b }) => ({ q: `Graf di bawah menunjukkan jarak dari bandar P bagi kereta X (bertolak dari P) dan kereta Y (bertolak dari Q menuju ke P) yang bertolak serentak. Jarak PQ ialah ${b.D} km. (a) Hitung laju kereta X dan laju kereta Y. (b) Selepas berapa jam kedua-dua kereta bertemu? (c) Berapakah jarak dari P ketika mereka bertemu?`, ans: `(a) X: ${b.vA} km/j, Y: ${b.vB} km/j (b) ${ggN(b.tm)} jam (c) ${ggN(b.dm)} km`, work: [`(a) X: ${b.D} ÷ ${ggN(b.tA)} = ${b.vA} km/j; Y: ${b.D} ÷ ${ggN(b.tB)} = ${b.vB} km/j`, `(b) Mereka bertemu apabila jumlah jarak = ${b.D} km: (${b.vA} + ${b.vB})t = ${b.D}`, `t = ${b.D} ÷ ${b.vA + b.vB} = ${ggN(b.tm)} jam`, `(c) Jarak dari P = ${b.vA} × ${ggN(b.tm)} = ${ggN(b.dm)} km`] }),
    ({ c }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${ggLc(c.o[0])} dari bandar P ke bandar Q dan kembali ke P. Laju purata bagi seluruh perjalanan ialah ${ggN(c.A)} km/j. (a) Cari nilai T. (b) Hitung laju ${c.o[1]} semasa kembali ke P.`, ans: `(a) T = ${ggN(c.T)} (b) ${ggN(c.v3)} km/j`, work: [`(a) Jumlah jarak = ${c.d1} + ${c.d1} = ${2 * c.d1} km`, `Jumlah masa = jumlah jarak ÷ laju purata = ${2 * c.d1} ÷ ${ggN(c.A)} = ${ggN(c.T)} jam, maka T = ${ggN(c.T)}`, `(b) Masa kembali = ${ggN(c.T)} − ${ggN(c.t2)} = ${ggN(c.t3)} jam`, `Laju = ${c.d1} ÷ ${ggN(c.t3)} = ${ggN(c.v3)} km/j`] })
  ],

  /* ---------- 7.2 Graf Laju-Masa ---------- */
  lmPecutan: [
    ({ o, t1 }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Hitung pecutan ${o[1]} dalam ${t1} s pertama.` }),
    ({ o, t1 }) => ({ q: `Berdasarkan graf laju-masa di bawah, cari pecutan ${ggLc(o[0])} dalam tempoh ${t1} s yang pertama.` }),
    ({ o, t1 }) => ({ q: `Kecerunan graf laju-masa mewakili pecutan. Gunakan graf di bawah untuk mencari pecutan ${ggLc(o[0])} dari 0 s hingga ${t1} s.` }),
    ({ o, t1, u, v, ans }) => { const N = vnama(); return Object.assign({ q: `Rujuk graf laju-masa di bawah. ${N} berkata pecutan ${ggLc(o[0])} dalam ${t1} s pertama ialah ${v - u} m/s². Adakah ${N} betul?` }, salah(N, ans, `${v - u} m/s ialah perubahan laju sahaja. Pecutan = perubahan laju ÷ masa.`)); }
  ],
  lmJenis: [
    ({ o, ta, tb }) => ({ q: `Berdasarkan graf laju-masa di bawah, nyatakan jenis gerakan ${ggLc(o[0])} dari ${ta} s hingga ${tb} s.` }),
    ({ o, ta, tb }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Huraikan gerakan ${o[1]} dalam tempoh ${ta} s hingga ${tb} s.` }),
    ({ o, ta, tb }) => ({ q: `Adakah ${ggLc(o[0])} dalam graf laju-masa di bawah mengalami pecutan, nyahpecutan atau bergerak dengan laju seragam dari ${ta} s hingga ${tb} s?` }),
    ({ o, ta, tb, claim, ans }) => { const N = vnama(); return Object.assign({ q: `Rujuk graf laju-masa di bawah. ${N} berkata ${ggLc(o[0])} ${claim === 'pegun' ? 'pegun' : 'mengalami ' + claim} dari ${ta} s hingga ${tb} s. Adakah ${N} betul?` }, salah(N, ans, claim === 'pegun' ? 'Dalam graf laju-masa, garis mengufuk bermaksud laju seragam. Objek pegun apabila laju = 0.' : 'Lihat arah garis: naik bermaksud pecutan, turun bermaksud nyahpecutan.')); }
  ],
  lmJarakSeg: [
    ({ o, ta, tb }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])}. Hitung jarak yang dilalui oleh ${o[1]} dari ${ta} s hingga ${tb} s.` }),
    ({ o, ta, tb }) => ({ q: `Berdasarkan graf laju-masa di bawah, cari jarak yang dilalui ${ggLc(o[0])} dalam tempoh ${ta} s hingga ${tb} s.` }),
    ({ o, ta, tb, shape }) => ({ q: `Jarak = luas di bawah graf laju-masa. Kawasan dari ${ta} s hingga ${tb} s di bawah graf ${ggLc(o[0])} berikut berbentuk ${shape}. Hitung jarak itu.` }),
    ({ ta, tb, shape }) => ({ q: `Lengkapkan: Jarak dari ${ta} s hingga ${tb} s = luas ${shape} di bawah graf = ___ m` })
  ],
  lukisLM: [
    ({ o }) => ({ q: `Jadual di bawah menunjukkan laju ${ggLc(o[0])} pada masa tertentu. Lukis graf laju-masa pada grid yang diberi.` }),
    ({ o }) => ({ q: `Plot titik-titik daripada jadual di bawah dan lukis graf laju-masa bagi gerakan ${ggLc(o[0])}. Kemudian, nyatakan tempoh ${o[1]} bergerak dengan laju seragam.` }),
    ({ o }) => ({ q: `Dengan menggunakan skala pada grid, lukis graf laju-masa bagi ${ggLc(o[0])} berdasarkan jadual di bawah.` })
  ],
  lmJumlah: [
    ({ o, T }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])} selama ${T} s. Hitung jumlah jarak yang dilalui.` }),
    ({ o, T }) => ({ q: `Berdasarkan graf laju-masa di bawah, cari jumlah jarak yang dilalui oleh ${ggLc(o[0])} dalam ${T} s.` }),
    ({ o, T }) => ({ q: `${o[0]} bergerak selama ${T} s seperti dalam graf laju-masa di bawah sehingga berhenti. Berapakah jarak yang dilaluinya?` }),
    ({ o, T, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Rujuk graf laju-masa di bawah bagi ${ggLc(o[0])} dalam ${T} s. ${N} berkata jumlah jaraknya ialah ${ggN(wrong)} m (laju maksimum × masa). Adakah ${N} betul?` }, salah(N, ans, 'Jarak = luas di bawah graf, bukan luas segi empat tepat laju maksimum × jumlah masa.')); }
  ],
  lmPurata: [
    ({ o, T }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])} selama ${T} s. Hitung laju purata ${o[1]}.` }),
    ({ o, T }) => ({ q: `Berdasarkan graf laju-masa di bawah, cari laju purata ${ggLc(o[0])} bagi tempoh ${T} s.` }),
    ({ o, T }) => ({ q: `${o[0]} bergerak seperti dalam graf laju-masa di bawah. Tentukan laju puratanya dalam ${T} s itu.` })
  ],
  lmCariV: [
    ({ o, D, T }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])} selama ${T} s. Jumlah jarak yang dilalui ialah ${ggN(D)} m. Cari nilai v.` }),
    ({ o, D }) => ({ q: `${o[0]} bergerak sejauh ${ggN(D)} m seperti dalam graf laju-masa di bawah. Hitung nilai v.` }),
    ({ o, D }) => ({ q: `Luas di bawah graf laju-masa ${ggLc(o[0])} berikut ialah ${ggN(D)} m. Apakah nilai v?` })
  ],
  lmCariT: [
    ({ o, D, v }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(o[0])} yang bergerak dengan laju ${v} m/s kemudian berhenti. Jumlah jarak ialah ${ggN(D)} m. Cari nilai T.` }),
    ({ o, D }) => ({ q: `Berdasarkan graf laju-masa di bawah, ${ggLc(o[0])} bergerak sejauh ${ggN(D)} m sebelum berhenti. Hitung nilai T.` }),
    ({ o, D }) => ({ q: `${o[0]} menempuh jarak ${ggN(D)} m seperti graf laju-masa di bawah. Apakah nilai T?` })
  ],
  k72: [
    ({ a }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(a.o[0])} selama ${a.T} s. (a) Hitung pecutan dalam ${a.t1} s pertama. (b) Hitung jarak yang dilalui dalam tempoh laju seragam. (c) Hitung laju purata bagi seluruh gerakan.`, ans: `(a) ${ggN(a.a1)} m/s² (b) ${ggN(a.A2)} m (c) ${ggN(a.avg)} m/s`, work: [`(a) (${a.v} − ${a.u}) ÷ ${a.t1} = ${ggN(a.a1)} m/s²`, `(b) ${a.t2 - a.t1} × ${a.v} = ${ggN(a.A2)} m`, `(c) Jumlah jarak = ${ggN(a.A1)} + ${ggN(a.A2)} + ${ggN(a.A3)} = ${ggN(a.D)} m`, `Laju purata = ${ggN(a.D)} ÷ ${a.T} = ${ggN(a.avg)} m/s`] }),
    ({ b }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${ggLc(b.o[0])}. Jumlah jarak yang dilalui ialah ${ggN(b.D)} m. (a) Cari nilai v. (b) Hitung pecutan dalam ${b.t1} s pertama. (c) Hitung nyahpecutan dalam ${b.T - b.t2} s terakhir.`, ans: `(a) v = ${b.v} (b) ${ggN(b.a1)} m/s² (c) ${ggN(b.dec)} m/s²`, work: [`(a) ${fr(1, 2)} × (${b.t2 - b.t1} + ${b.T}) × v = ${ggN(b.D)}`, `${ggN((b.t2 - b.t1 + b.T) / 2)}v = ${ggN(b.D)} → v = ${b.v}`, `(b) ${b.v} ÷ ${b.t1} = ${ggN(b.a1)} m/s²`, `(c) (0 − ${b.v}) ÷ ${b.T - b.t2} = −${ggN(b.dec)}, nyahpecutan ${ggN(b.dec)} m/s²`] }),
    ({ c }) => ({ q: `${c.o[0]} memecut secara seragam dari pegun hingga mencapai laju ${c.v} m/s dalam ${c.t1} s, kemudian mengalami nyahpecutan seragam hingga berhenti pada masa T s, seperti graf di bawah. Jumlah jarak ialah ${ggN(c.D)} m. (a) Cari nilai T. (b) Hitung nyahpecutan ${c.o[1]}.`, ans: `(a) T = ${ggN(c.T)} (b) ${ggN(c.dec)} m/s²`, work: [`(a) Luas segi tiga: ${fr(1, 2)} × T × ${c.v} = ${ggN(c.D)}`, `T = ${ggN(c.D)} × 2 ÷ ${c.v} = ${ggN(c.T)}`, `(b) Masa nyahpecutan = ${ggN(c.T)} − ${c.t1} = ${ggN(c.T - c.t1)} s`, `Nyahpecutan = ${c.v} ÷ ${ggN(c.T - c.t1)} = ${ggN(c.dec)} m/s²`] })
  ]
};

/* =================== pembina soalan (r = ggRG atau ggRW) =================== */
const GG = {};
/* ---------- 7.1 ---------- */
GG.jmBaca = r => {
  const d = ggJMData(r), o = ggObj(r, d.unit), tq = r.f() < .65 ? d.t1 : d.t2, U = d.U;
  const work = [`Dari graf, pada masa ${ggN(tq)} ${U.t}, jarak dari titik mula = ${ggN(d.d1)} ${U.d}.`].concat(tq === d.t2 ? [`Garis mengufuk dari ${ggN(d.t1)} hingga ${ggN(d.t2)} ${U.t}: jarak tidak berubah.`] : []);
  return GEN_LQ('jmBaca', { o, tq, U, T: d.T, ans: `${ggN(d.d1)} ${U.d}`, work }, { fig: ggJMFig(d) });
};
GG.jmPegun = r => {
  const d = ggJMData(r), o = ggObj(r, d.unit), U = d.U, ans = `${ggN(d.tr)} ${U.t}`;
  return GEN_LQ('jmPegun', { o, U, T: d.T, t1: d.t1, t2: d.t2, ans, work: ['Bahagian graf yang mengufuk menunjukkan objek pegun.', `Tempoh pegun = ${ggN(d.t2)} − ${ggN(d.t1)} = ${ans}`] }, { fig: ggJMFig(d) });
};
GG.jmLaju = (r, k) => {
  const seg = k == null ? (r.f() < .5 ? 1 : 3) : (k % 2 ? 3 : 1), d = ggJMData(r, null, null, { no1: true }), o = ggObj(r, d.unit), U = d.U;
  const dist = seg === 1 ? d.d1 : Math.abs(d.d3 - d.d1), tt = seg === 1 ? d.t1 : d.t3, v = seg === 1 ? d.v1 : d.v3;
  const when = seg === 1 ? `dalam ${ggN(d.t1)} ${U.t} pertama` : `dari masa ${ggN(d.t2)} ${U.t} hingga ${ggN(d.T)} ${U.t}`, ans = `${ggN(v)} ${U.v}`;
  const work = ['Laju = kecerunan = jarak ÷ masa'].concat(seg === 1 ? [`= ${ggN(d.d1)} ÷ ${ggN(d.t1)}`] : [`Jarak = ${d.kind === 'balik' ? ggN(d.d1) + ' − 0' : ggN(d.d3) + ' − ' + ggN(d.d1)} = ${ggN(dist)} ${U.d}, masa = ${ggN(d.T)} − ${ggN(d.t2)} = ${ggN(tt)} ${U.t}`, `= ${ggN(dist)} ÷ ${ggN(tt)}`], [`= ${ans}`], seg === 3 && d.kind === 'balik' ? ['Garis turun: objek bergerak kembali ke titik mula.'] : []);
  return GEN_LQ('jmLaju', { o, when, dist, U, ans, work }, { fig: ggJMFig(d) });
};
function ggLPData(r) {
  let x, n = 0;
  do {
    const unit = r.p(['jam', 's']), U = GGU[unit];
    let v1, t1, tr, v2, t2;
    if (unit === 'jam') { v1 = r.p([40, 50, 60, 70, 80, 90, 100]); t1 = r.p([1, 1.5, 2, 2.5, 3]); tr = r.p([0.5, 1]); v2 = r.p([30, 40, 50, 60, 70, 80, 90, 100]); t2 = r.p([0.5, 1, 1.5, 2, 3]); }
    else { v1 = r.i(2, 12); t1 = r.p([10, 15, 20, 25, 30, 40]); tr = r.p([5, 10, 15, 20]); v2 = r.i(2, 12); t2 = r.p([10, 15, 20, 30, 40]); }
    const d1 = v1 * t1, d2 = v2 * t2, D = d1 + d2, Tt = t1 + tr + t2;
    x = { O: ggObj(r, unit), U, v1, v2, d1, t1, tr, d2, t2, D, Tt, avg: D / Tt, wrong: (v1 + v2) / 2 };
  } while ((!ggClean(x.avg, 2) || !ggClean(x.wrong, 1) || Math.abs(x.avg - x.wrong) < .01) && ++n < 4000);
  return x;
}
GG.lajuPurata = r => {
  const x = ggLPData(r), ans = `${ggN(x.avg)} ${x.U.v}`;
  return GEN_LQ('lajuPurata', Object.assign(x, { ans, work: ['Laju purata = jumlah jarak ÷ jumlah masa', `Jumlah jarak = ${ggN(x.d1)} + ${ggN(x.d2)} = ${ggN(x.D)} ${x.U.d}`, `Jumlah masa = ${ggN(x.t1)} + ${ggN(x.tr)} + ${ggN(x.t2)} = ${ggN(x.Tt)} ${x.U.t}`, `Laju purata = ${ggN(x.D)} ÷ ${ggN(x.Tt)} = ${ans}`] }));
};
GG.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
GG.lukisJM = r => {
  const d = ggJMData(r), o = ggObj(r, d.unit);
  return GEN_LQ('lukisJM', { o, U: d.U, ans: `Graf melalui ${d.pts.map(p => `(${ggN(p[0])}, ${ggN(p[1])})`).join(', ')} (rujuk rajah jawapan); pegun selama ${ggN(d.tr)} ${d.U.t}`, work: ['Plot setiap pasangan (masa, jarak) daripada jadual.', 'Sambungkan titik-titik berturutan dengan garis lurus.', `Garis mengufuk dari ${ggN(d.t1)} hingga ${ggN(d.t2)} ${d.U.t} menunjukkan objek pegun.`] }, { kind: 'lukis', fig: ggLukisFig(d, false, 'jm'), figAns: ggLukisFig(d, true, 'jm') });
};
GG.jmPurata = r => {
  const d = ggJMData(r, null, null, { avg: true }), o = ggObj(r, d.unit), U = d.U, ans = `${ggN(d.avg)} ${U.v}`;
  const work = ['Laju purata = jumlah jarak ÷ jumlah masa', d.kind === 'balik' ? `Jumlah jarak = ${ggN(d.d1)} + ${ggN(d.d1)} = ${ggN(d.total)} ${U.d} (pergi dan balik)` : `Jumlah jarak = ${ggN(d.d3)} ${U.d}`, `Jumlah masa = ${ggN(d.T)} ${U.t} (termasuk masa pegun)`, `Laju purata = ${ggN(d.total)} ÷ ${ggN(d.T)} = ${ans}`];
  return GEN_LQ('jmPurata', { o, U, T: d.T, kind: d.kind, wrong: d.wrongAvg, ans, work }, { fig: ggJMFig(d) });
};
GG.jmCariT = r => {
  const d = ggJMData(r), o = ggObj(r, d.unit), U = d.U, dist = Math.abs(d.d3 - d.d1);
  return GEN_LQ('jmCariT', { o, U, t2: d.t2, v3: d.v3, ans: `T = ${ggN(d.T)}`, work: [`Jarak pada peringkat akhir = ${ggN(dist)} ${U.d}`, `Masa = jarak ÷ laju = ${ggN(dist)} ÷ ${ggN(d.v3)} = ${ggN(d.t3)} ${U.t}`, `T = ${ggN(d.t2)} + ${ggN(d.t3)} = ${ggN(d.T)}`] }, { fig: ggJMFig(d, { hideT: true }), figAns: ggJMFig(d) });
};
GG.jmCariD = r => {
  const d = ggJMData(r), o = ggObj(r, d.unit), U = d.U;
  return GEN_LQ('jmCariD', { o, U, t1: d.t1, v1: d.v1, ans: `d = ${ggN(d.d1)}`, work: ['Jarak = laju × masa', `d = ${ggN(d.v1)} × ${ggN(d.t1)}`, `d = ${ggN(d.d1)}`] }, { fig: ggJMFig(d, { hideD: true }), figAns: ggJMFig(d) });
};
GG.jmUnit = (r, k) => {
  const d = ggJMMin(r), o = r.p(GGOBJ.min), seg = k == null ? (r.f() < .5 ? 1 : 3) : (k % 2 ? 3 : 1);
  const tt = seg === 1 ? d.t1 : d.t3, v = seg === 1 ? d.v1 : d.v3, when = seg === 1 ? `dari rumah dalam ${d.t1} minit pertama` : `semasa pulang dari minit ke-${d.t2} hingga minit ke-${d.T}`;
  return GEN_LQ('jmUnit', { o, when, ans: `${ggN(v)} km/j`, work: [`Jarak = ${d.d1} km, masa = ${tt} minit = ${fr(tt, 60)} jam`, `Laju = ${d.d1} ÷ ${fr(tt, 60)} = ${d.d1} × ${fr(60, tt)}`, `= ${ggN(v)} km/j`] }, { fig: ggJMFig(d) });
};
GG.k71 = r => {
  const a = Object.assign(ggJMMin(r, { avg: true }), { o: r.p(GGOBJ.min) });
  let b, n = 0;
  do { const D = r.p([120, 150, 180, 200, 240, 300]), vA = r.p([40, 50, 60, 75, 80, 90, 100]), vB = r.p([40, 50, 60, 75, 80, 90, 100]); b = { D, vA, vB, tA: D / vA, tB: D / vB, tm: D / (vA + vB), dm: vA * D / (vA + vB) }; }
  while ((b.vA === b.vB || !ggClean(b.tA, 1) || !ggClean(b.tB, 1) || !ggClean(b.tm, 2) || !ggClean(b.dm, 1) || Math.abs(b.tA - b.tB) / Math.max(b.tA, b.tB) < .15) && ++n < 4000);
  let c; n = 0;
  do {
    const d1 = r.p([60, 80, 90, 100, 120, 150, 160, 180, 200, 240]), v1 = r.p([40, 50, 60, 80, 100]), tr = r.p([0.5, 1, 1.5]), A = r.p([30, 32, 36, 40, 45, 48, 50, 60]);
    const t1 = d1 / v1, t2 = t1 + tr, T = 2 * d1 / A, t3 = T - t2;
    c = { o: r.p(GGOBJ.jam), d1, v1, t1, tr, t2, T, t3, A, v3: d1 / t3, kind: 'balik', U: GGU.jam, d3: 0, pts: [[0, 0], [t1, d1], [t2, d1], [T, 0]] };
  } while ((!ggClean(c.t1, 1) || !ggClean(c.T, 1) || c.t3 / c.T < .2 || c.t1 / c.T < .15 || !ggClean(c.v3, 1)) && ++n < 4000);
  const v = vq('k71', { a, b, c });
  let fig;
  if (v.q.includes('kereta Y')) {
    const top = b.D * 1.16, tmax = Math.max(b.tA, b.tB) * 1.1;
    fig = ggGraf({ tmax, ymax: top, xt: [[b.tA, ggN(b.tA)], [b.tB, ggN(b.tB)]], yt: [[b.D, String(b.D)]], xlab: 'Masa (jam)', ylab: 'Jarak dari P (km)', guides: [[b.tA, b.D]],
      lines: [{ pts: [[0, 0], [b.tA, b.D]], c: 'tr' }, { pts: [[0, b.D], [b.tB, 0]], c: 'pk' }], texts: [{ t: b.tA * .62, v: b.D * .62 * (1 + .1), s: 'X', c: 'tr', size: 17, a: 'end' }, { t: b.tB * .25, v: b.D * .75 + top * .08, s: 'Y', c: 'pk', size: 17 }], label: 'Graf jarak-masa dua kereta' });
  } else if (v.q.includes('nilai T')) fig = ggJMFig(c, { hideT: true });
  else fig = ggJMFig(a);
  return { q: v.q, ans: v.ans, work: v.work, fig };
};

/* ---------- 7.2 ---------- */
GG.lmPecutan = r => {
  const d = ggLMData(r), o = r.p(GGLM), ans = `${ggN(d.a1)} m/s²`;
  return GEN_LQ('lmPecutan', { o, t1: d.t1, u: d.u, v: d.v, ans, work: ['Pecutan = kecerunan = perubahan laju ÷ masa', `= (${d.v} − ${d.u}) ÷ (${d.t1} − 0)`, `= ${ans}`] }, { fig: ggLMFig(d) });
};
GG.lmJenis = (r, k) => {
  const d = ggLMData(r), o = r.p(GGLM), seg = k == null ? r.i(0, 2) : k % 3, key = ['acc', 'uni', 'dec'][seg], J = GGGERAK[key];
  const ta = [0, d.t1, d.t2][seg], tb = [d.t1, d.t2, d.T][seg];
  return GEN_LQ('lmJenis', { o, ta, tb, claim: J[2], ans: J[0], work: [J[1]] }, { fig: ggLMFig(d) });
};
GG.lmJarakSeg = (r, k) => {
  const d = ggLMData(r), o = r.p(GGLM), seg = k == null ? r.i(0, 2) : k % 3;
  const ta = [0, d.t1, d.t2][seg], tb = [d.t1, d.t2, d.T][seg], A = [d.A1, d.A2, d.A3][seg];
  const shape = seg === 0 ? (d.u === 0 ? 'segi tiga' : 'trapezium') : seg === 1 ? 'segi empat tepat' : 'segi tiga';
  const work = seg === 0 ? ggArea1(d) : seg === 1 ? [`Luas segi empat tepat = ${d.t2 - d.t1} × ${d.v}`, `= ${ggN(A)} m`] : [`Luas segi tiga = ${fr(1, 2)} × ${d.T - d.t2} × ${d.v}`, `= ${ggN(A)} m`];
  return GEN_LQ('lmJarakSeg', { o, ta, tb, shape, ans: `${ggN(A)} m`, work: ['Jarak = luas di bawah graf'].concat(work) }, { fig: ggLMFig(d), figAns: ggLMFig(d, { shade: true }) });
};
GG.lukisLM = r => {
  const d = ggLMData(r), o = r.p(GGLM);
  return GEN_LQ('lukisLM', { o, ans: `Graf melalui ${d.pts.map(p => `(${p[0]}, ${p[1]})`).join(', ')} (rujuk rajah jawapan); laju seragam selama ${d.t2 - d.t1} s`, work: ['Plot setiap pasangan (masa, laju) daripada jadual.', 'Sambungkan titik-titik berturutan dengan garis lurus.', `Garis mengufuk dari ${d.t1} s hingga ${d.t2} s menunjukkan laju seragam ${d.v} m/s.`] }, { kind: 'lukis', fig: ggLukisFig(d, false, 'lm'), figAns: ggLukisFig(d, true, 'lm') });
};
const ggWSum = d => ['Jarak = luas di bawah graf'].concat([`${ggArea1(d)[0]} = ${ggN(d.A1)} m`,`Luas segi empat tepat = ${d.t2 - d.t1} × ${d.v} = ${ggN(d.A2)} m`, `Luas segi tiga = ${fr(1, 2)} × ${d.T - d.t2} × ${d.v} = ${ggN(d.A3)} m`, `Jumlah jarak = ${ggN(d.A1)} + ${ggN(d.A2)} + ${ggN(d.A3)} = ${ggN(d.D)} m`]);
GG.lmJumlah = r => {
  const d = ggLMData(r), o = r.p(GGLM);
  return GEN_LQ('lmJumlah', { o, T: d.T, wrong: d.v * d.T, ans: `${ggN(d.D)} m`, work: ggWSum(d) }, { fig: ggLMFig(d), figAns: ggLMFig(d, { shade: true }) });
};
GG.lmPurata = r => {
  const d = ggLMData(r, { avg: true }), o = r.p(GGLM);
  return GEN_LQ('lmPurata', { o, T: d.T, ans: `${ggN(d.avg)} m/s`, work: ggWSum(d).concat([`Laju purata = ${ggN(d.D)} ÷ ${d.T} = ${ggN(d.avg)} m/s`]) }, { fig: ggLMFig(d), figAns: ggLMFig(d, { shade: true }) });
};
GG.lmCariV = r => {
  const d = ggLMData(r, { u0: true }), o = r.p(GGLM), k = (d.t2 - d.t1 + d.T) / 2;
  return GEN_LQ('lmCariV', { o, D: d.D, T: d.T, ans: `v = ${d.v}`, work: ['Kawasan di bawah graf ialah trapezium.', `${fr(1, 2)} × (${d.t2 - d.t1} + ${d.T}) × v = ${ggN(d.D)}`, `${ggN(k)}v = ${ggN(d.D)}`, `v = ${ggN(d.D)} ÷ ${ggN(k)} = ${d.v}`] }, { fig: ggLMFig(d, { hideV: true }), figAns: ggLMFig(d, { shade: true }) });
};
// (0,v) → (t1,v) → (T,0): laju seragam kemudian berhenti
function ggLMStop(r) {
  let d, n = 0;
  do {
    const v = r.p([8, 10, 12, 15, 16, 20, 24, 25, 30]), t1 = r.p([4, 5, 6, 8, 10, 12, 15]), tt = r.p([2, 3, 4, 5, 6, 8, 10]), T = t1 + tt;
    d = { u: v, v, t1, t2: t1, T, A1: v * t1, A3: v * tt / 2, D: v * t1 + v * tt / 2, dec: v / tt, pts: [[0, v], [t1, v], [T, 0]] };
  } while ((!ggClean(d.D, 1) || !ggClean(d.dec, 1) || d.t1 / d.T < .2 || (d.T - d.t1) / d.T < .15) && ++n < 4000);
  return d;
}
GG.lmCariT = r => {
  const d = ggLMStop(r), o = r.p(GGLM);
  return GEN_LQ('lmCariT', { o, D: d.D, v: d.v, ans: `T = ${d.T}`, work: [`Luas segi empat tepat = ${d.v} × ${d.t1} = ${ggN(d.A1)} m`, `Luas segi tiga = ${ggN(d.D)} − ${ggN(d.A1)} = ${ggN(d.A3)} m`, `${fr(1, 2)} × (T − ${d.t1}) × ${d.v} = ${ggN(d.A3)} → T − ${d.t1} = ${d.T - d.t1}`, `T = ${d.T}`] }, { fig: ggLMFig(d, { hideT: true }), figAns: ggLMFig(d, { shade: true }) });
};
GG.k72 = r => {
  const a = Object.assign(ggLMData(r, { avg: true, u1: true }), { o: r.p(GGLM) });
  const b = Object.assign(ggLMData(r, { u0: true }), { o: r.p(GGLM) });
  let c, n = 0;
  do { const v = r.p([10, 12, 15, 16, 18, 20, 24, 25, 30]), t1 = r.p([4, 5, 6, 8, 10, 12]), D = r.p([60, 75, 80, 90, 100, 120, 150, 160, 180, 200, 240, 300]), T = 2 * D / v; c = { o: r.p(GGLM), v, t1, D, T, dec: v / (T - t1), pts: [[0, 0], [t1, v], [T, 0]] }; }
  while ((!ggClean(c.T, 1) || c.T - c.t1 < 2 || (c.T - c.t1) / c.T < .2 || c.t1 / c.T < .15 || !ggClean(c.dec, 1)) && ++n < 4000);
  const v = vq('k72', { a, b, c });
  let fig;
  if (v.q.includes('nilai v')) fig = ggLMFig(b, { hideV: true });
  else if (v.q.includes('nilai T')) fig = ggGraf({ tmax: c.T * 1.1, ymax: c.v * 1.2, xt: [[c.t1, String(c.t1)], [c.T, 'T']], yt: [[c.v, String(c.v)]], xlab: 'Masa (s)', ylab: 'Laju (m/s)', guides: [[c.t1, c.v]], lines: [{ pts: c.pts, c: 'am', w: 4 }], label: 'Graf laju-masa memecut kemudian berhenti' });
  else fig = ggLMFig(a);
  return { q: v.q, ans: v.ans, work: v.work, fig };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '7.1': {
    m: [() => GG.jmBaca(ggRG), () => GG.jmPegun(ggRG), () => GG.jmLaju(ggRG), () => GG.jmLaju(ggRG), () => GG.lajuPurata(ggRG), () => GG.bs(ggRG, GGBS1)],
    s: [() => GG.jmPurata(ggRG), () => GG.jmPurata(ggRG), () => GG.jmCariT(ggRG), () => GG.jmCariD(ggRG), () => GG.jmUnit(ggRG)],
    k: [() => GG.k71(ggRG)]
  },
  '7.2': {
    m: [() => GG.lmPecutan(ggRG), () => GG.lmJenis(ggRG), () => GG.lmJarakSeg(ggRG), () => GG.lmJarakSeg(ggRG), () => GG.bs(ggRG, GGBS2)],
    s: [() => GG.lmJumlah(ggRG), () => GG.lmPurata(ggRG), () => GG.lmCariV(ggRG), () => GG.lmCariT(ggRG)],
    k: [() => GG.k72(ggRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 7.1
WG.jmBaca = () => GG.jmBaca(ggRW);
WG.jmPegun = () => GG.jmPegun(ggRW);
WG.jmLaju = i => GG.jmLaju(ggRW, i);
WG.lajuPurata = () => GG.lajuPurata(ggRW);
WG.bs1 = i => GG.bs(ggRW, GGBS1, [1, 4, 7, 0][i % 4] + 8 * wri(0, 1));
WG.lukisJM = () => GG.lukisJM(ggRW);
WG.jmPurata = () => GG.jmPurata(ggRW);
WG.jmCariT = () => GG.jmCariT(ggRW);
WG.jmCariD = () => GG.jmCariD(ggRW);
WG.jmUnit = i => GG.jmUnit(ggRW, i);
WG.k71 = () => GG.k71(ggRW);
// 7.2
WG.lmPecutan = () => GG.lmPecutan(ggRW);
WG.lmJenis = i => GG.lmJenis(ggRW, i);
WG.lmJarakSeg = i => GG.lmJarakSeg(ggRW, i);
WG.bs2 = i => GG.bs(ggRW, GGBS2, [2, 6, 7, 5][i % 4] + 8 * wri(0, 1));
WG.lukisLM = () => GG.lukisLM(ggRW);
WG.lmJumlah = () => GG.lmJumlah(ggRW);
WG.lmPurata = () => GG.lmPurata(ggRW);
WG.lmCariV = () => GG.lmCariV(ggRW);
WG.lmCariT = () => GG.lmCariT(ggRW);
WG.k72 = () => GG.k72(ggRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '7.1': [['m', 'jmBaca', 3], ['m', 'jmPegun', 3], ['m', 'jmLaju', 6], ['m', 'lajuPurata', 3], ['m', 'bs1', 1], ['m', 'lukisJM', 2], ['s', 'jmPurata', 3], ['s', 'jmCariT', 2], ['s', 'jmCariD', 2], ['s', 'jmUnit', 2], ['k', 'k71', 3]],
  '7.2': [['m', 'lmPecutan', 5], ['m', 'lmJenis', 3], ['m', 'lmJarakSeg', 6], ['m', 'bs2', 2], ['m', 'lukisLM', 2], ['s', 'lmJumlah', 3], ['s', 'lmPurata', 2], ['s', 'lmCariV', 2], ['s', 'lmCariT', 2], ['k', 'k72', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan nombor + unit (unik, positif, kemas)
function ggOptsN(ans, cands, unit) {
  const f = x => `${ggN(x)}${unit ? ' ' + unit : ''}`, A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !ggClean(c, 2)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const st = ans >= 20 ? Math.max(1, Math.round(ans / 10)) : ans >= 4 ? 1 : 0.5;
  for (let k = 1; w.length < 3 && k < 80; k++) { const x = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * st; if (x <= 0) continue; const s = f(x); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function ggOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const ggMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
// graf satu peringkat (jarak-masa atau laju-masa)
function ggOneSeg(r, lm) {
  let t, y0, y1, n = 0;
  do {
    if (lm) { t = r.p([2, 4, 5, 6, 8, 10]); y0 = r.p([0, 0, 4, 5, 6, 10]); y1 = r.p([10, 12, 15, 16, 20, 24, 30]); }
    else { t = r.p([2, 3, 4, 5, 10, 20]); y0 = 0; y1 = t <= 5 ? r.p([60, 80, 90, 120, 150, 180, 200, 240]) : r.p([40, 60, 80, 100, 120, 150, 200]); }
  } while ((!ggClean((y1 - y0) / t, 1) || (y0 > 0 && (y1 - y0) / y1 < .25)) && ++n < 4000);
  const U = !lm && t <= 5 ? GGU.jam : GGU.s;
  const fig = ggGraf({ tmax: t * 1.15, ymax: y1 * 1.2, xt: [[t, ggN(t)]], yt: (y0 ? [[y0, ggN(y0)]] : []).concat([[y1, ggN(y1)]]), xlab: lm ? 'Masa (s)' : U.tl, ylab: lm ? 'Laju (m/s)' : U.dl, guides: [[t, y1]], lines: [{ pts: [[0, y0], [t, y1]], c: 'am', w: 4 }], label: lm ? 'Graf laju-masa' : 'Graf jarak-masa' });
  return { t, y0, y1, U, fig, k: (y1 - y0) / t };
}
const CQGEN = {
  jm: [
    () => { const g = ggOneSeg(ggRG, false); return ggMcq('Berapakah laju objek berdasarkan graf jarak-masa ini?', g.fig, ggOptsN(g.k, [g.y1, g.k * 2, g.k / 2, g.y1 / (g.t + 1), g.k + 10], g.U.v)); },
    () => {
      const d = ggJMData(ggRG, null, null, { no1: true });
      if (Math.random() < .5) return ggMcq('Berapa lamakah objek ini pegun?', ggJMFig(d), ggOptsN(d.tr, [d.t1, d.t2, d.t3, d.T, d.tr * 2], d.U.t));
      return ggMcq(`Berapakah laju objek dari ${ggN(d.t2)} ${d.U.t} hingga ${ggN(d.T)} ${d.U.t}?`, ggJMFig(d), ggOptsN(d.v3, [d.v1, Math.abs(d.d3 - d.d1), d.v3 * 2, d.v3 / 2, Math.max(d.d1, d.d3) / d.T], d.U.v));
    },
    () => {
      const d = ggJMData(ggRG, 'balik'), seg = ri(0, 2), ta = [0, d.t1, d.t2][seg], tb = [d.t1, d.t2, d.T][seg];
      const ch = ['Bergerak menjauhi titik mula dengan laju seragam', 'Pegun', 'Bergerak kembali ke titik mula', 'Memecut'];
      return ggMcq(`Apakah yang berlaku kepada objek dari ${ggN(ta)} ${d.U.t} hingga ${ggN(tb)} ${d.U.t}?`, ggJMFig(d), ggOptsT(ch[seg], ch));
    }
  ],
  purata: [
    () => { const g = ggOneSeg(ggRG, false), T = g.t + (g.U === GGU.jam ? 1 : 5), fig = ggGraf({ tmax: T * 1.12, ymax: g.y1 * 1.2, xt: [[g.t, ggN(g.t)], [T, ggN(T)]], yt: [[g.y1, ggN(g.y1)]], xlab: g.U.tl, ylab: g.U.dl, guides: [[g.t, g.y1], [T, g.y1]], lines: [{ pts: [[0, 0], [g.t, g.y1], [T, g.y1]], c: 'am', w: 4 }], label: 'Graf jarak-masa' }); const avg = g.y1 / T; return ggClean(avg, 2) ? ggMcq(`Berapakah laju purata objek dalam ${ggN(T)} ${g.U.t}?`, fig, ggOptsN(avg, [g.k, g.y1, g.y1 / g.t / 2, avg * 2], g.U.v)) : ggMcq('Berapakah laju objek sebelum berhenti?', fig, ggOptsN(g.k, [g.y1, g.k * 2, g.k / 2, g.k + 5], g.U.v)); },
    () => { const x = ggLPData(ggRG); return ggMcq(`${x.O[0]} bergerak ${ggN(x.d1)} ${x.U.d} dalam ${ggN(x.t1)} ${x.U.t}, berhenti ${ggN(x.tr)} ${x.U.t}, kemudian bergerak ${ggN(x.d2)} ${x.U.d} dalam ${ggN(x.t2)} ${x.U.t}. Berapakah laju puratanya?`, '', ggOptsN(x.avg, [x.wrong, x.D / (x.t1 + x.t2), x.v1, x.v2, x.avg * 2], x.U.v)); },
    () => { const d = ggJMData(ggRG, 'balik', null, { avg: true }); return ggMcq('Berapakah laju purata bagi seluruh perjalanan ini?', ggJMFig(d), ggOptsN(d.avg, [d.wrongAvg, d.v1, d.v3, d.total / (d.T - d.tr), d.avg * 2], d.U.v)); }
  ],
  pecutan: [
    () => { const g = ggOneSeg(ggRG, true); return ggMcq('Berapakah pecutan objek berdasarkan graf laju-masa ini?', g.fig, ggOptsN(g.k, [g.y1 / g.t, g.y1 - g.y0, g.k * 2, g.t, g.k + 1], 'm/s²')); },
    () => { const d = ggLMData(ggRG), seg = ri(0, 2), ta = [0, d.t1, d.t2][seg], tb = [d.t1, d.t2, d.T][seg], ch = ['Pecutan', 'Laju seragam', 'Nyahpecutan', 'Pegun']; return ggMcq(`Apakah jenis gerakan objek dari ${ta} s hingga ${tb} s?`, ggLMFig(d), ggOptsT(ch[seg], ch)); },
    () => { const d = ggLMData(ggRG); return ggMcq(`Berapakah nyahpecutan objek dalam ${d.T - d.t2} s terakhir?`, ggLMFig(d), ggOptsN(d.dec, [d.a1, d.v, d.T - d.t2, d.dec * 2, d.v / d.T], 'm/s²')); }
  ],
  luas: [
    () => { const d = ggLMData(ggRG, { u0: true }), seg = ri(1, 2), A = seg === 1 ? d.A2 : d.A3, ta = seg === 1 ? d.t1 : d.t2, tb = seg === 1 ? d.t2 : d.T; return ggMcq(`Berapakah jarak yang dilalui dari ${ta} s hingga ${tb} s?`, ggLMFig(d), ggOptsN(A, seg === 1 ? [d.v + d.t2 - d.t1, A / 2, A * 2, d.v * d.t2] : [A * 2, d.v * d.T / 2, d.v + d.T - d.t2, A + d.v], 'm')); },
    () => { const d = ggLMData(ggRG); return ggMcq('Berapakah jumlah jarak yang dilalui objek ini?', ggLMFig(d), ggOptsN(d.D, [d.v * d.T, d.A2, d.D - d.A3, d.D + d.A3, d.A1 + d.A2], 'm')); },
    () => { const d = ggLMData(ggRG, { u0: true }); return ggMcq(`Jumlah jarak ialah ${ggN(d.D)} m. Cari nilai v.`, ggLMFig(d, { hideV: true }), ggOptsN(d.v, [d.D / d.T, d.v * 2, d.v + 5, d.v - 4, 2 * d.D / d.T], 'm/s')); }
  ]
};
const CQT = { jm: 'Graf jarak-masa', purata: 'Laju purata', pecutan: 'Pecutan', luas: 'Jarak = luas' };
function ggCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.jm;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['jm', 'jm', 'purata', 'pecutan', 'luas'] : Object.keys(CQT);
  return ggCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return ggCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
