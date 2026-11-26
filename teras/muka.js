'use strict';
/* =================== TerokaMath · MUKA DEPAN NOTA ===================
   Halaman pertama tab NOTA: "BAB n" + tajuk bab, dengan rajah hiasan yang sesuai dengan tajuk.
   Rajah dilukis dalam warna gelap (warna subtopik bab) dan ditukar ke mod cerah melalui themed().
   Tambah bab baharu: tambah satu fungsi dalam MUKA dengan kunci = BAB.id (viewBox 600×600). */
const MK = (() => {
  const N = '#94A3B8', TX = '#E6EDF7', GD = '#1E2A40', FONT = "Space Grotesk, Inter, sans-serif";
  const a = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');
  const L = (x1, y1, x2, y2, c, w = 4, x = '') => `<line ${a({ x1, y1, x2, y2, stroke: c, 'stroke-width': w, 'stroke-linecap': 'round' })} ${x}/>`;
  const D = (x1, y1, x2, y2, c, w = 3) => L(x1, y1, x2, y2, c, w, 'stroke-dasharray="10 9"');
  const C = (cx, cy, r, c, f = .16, w = 4) => `<circle ${a({ cx, cy, r, stroke: c, 'stroke-width': w, fill: c, 'fill-opacity': f })}/>`;
  const Dt = (cx, cy, c, r = 10) => `<circle ${a({ cx, cy, r, fill: c })}/>`;
  const R = (x, y, w, h, c, f = .16, rx = 6, sw = 4) => `<rect ${a({ x, y, width: w, height: h, rx, stroke: c, 'stroke-width': sw, fill: c, 'fill-opacity': f })}/>`;
  const P = (d, c, f = 0, w = 4, x = '') => `<path ${a({ d, stroke: c, 'stroke-width': w, fill: f ? c : 'none', 'fill-opacity': f, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })} ${x}/>`;
  const PG = (pts, c, f = .16, w = 4) => P('M' + pts.map(p => p.join(' ')).join('L') + 'Z', c, f, w);
  const T = (x, y, s, c = TX, z = 30, an = 'middle', wt = 700) => `<text ${a({ x, y, fill: c, 'font-family': FONT, 'font-size': z, 'font-weight': wt, 'text-anchor': an, 'dominant-baseline': 'central' })}>${s}</text>`;
  const AR = (x1, y1, x2, y2, c, w = 4) => { const t = Math.atan2(y2 - y1, x2 - x1), h = 16, s = .45; return L(x1, y1, x2, y2, c, w) + PG([[x2, y2], [x2 - h * Math.cos(t - s), y2 - h * Math.sin(t - s)], [x2 - h * Math.cos(t + s), y2 - h * Math.sin(t + s)]], c, 1, 2); };
  const AX = (ox, oy, x0 = 50, x1 = 560, y0 = 560, y1 = 40) => AR(x0, oy, x1, oy, N, 3) + AR(ox, y0, ox, y1, N, 3);
  const GRID = (x0, y0, x1, y1, s) => { let g = ''; for (let x = x0; x <= x1 + .1; x += s) g += L(x, y0, x, y1, GD, 2); for (let y = y0; y <= y1 + .1; y += s) g += L(x0, y, x1, y, GD, 2); return g; };
  const reg = (cx, cy, r, n, rot = -90) => Array.from({ length: n }, (_, k) => { const t = (rot + 360 * k / n) * Math.PI / 180; return [+(cx + r * Math.cos(t)).toFixed(1), +(cy + r * Math.sin(t)).toFixed(1)]; });
  const fn = (f, x0, x1, ox, oy, sx, sy, n = 80) => 'M' + Array.from({ length: n + 1 }, (_, k) => { const x = x0 + (x1 - x0) * k / n; return `${(ox + x * sx).toFixed(1)} ${(oy - f(x) * sy).toFixed(1)}`; }).join('L');
  const arc = (cx, cy, r, t0, t1) => { const p = t => [cx + r * Math.cos(t * Math.PI / 180), cy - r * Math.sin(t * Math.PI / 180)]; const [x0, y0] = p(t0), [x1, y1] = p(t1); return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${Math.abs(t1 - t0) > 180 ? 1 : 0} 0 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const die = (x, y, s, n, c, rot) => { const pp = { 1: [[.5, .5]], 2: [[.27, .27], [.73, .73]], 3: [[.25, .25], [.5, .5], [.75, .75]], 4: [[.27, .27], [.73, .27], [.27, .73], [.73, .73]], 5: [[.25, .25], [.75, .25], [.5, .5], [.25, .75], [.75, .75]], 6: [[.27, .23], [.73, .23], [.27, .5], [.73, .5], [.27, .77], [.73, .77]] }[n]; return `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})">${R(x, y, s, s, c, .14, s * .18, 5)}${pp.map(([u, v]) => Dt(x + u * s, y + v * s, c, s * .075)).join('')}</g>`; };
  const g = (k, s) => `<g class="mk" style="animation-delay:${(k * .12).toFixed(2)}s">${s}</g>`;
  return { N, TX, GD, L, D, C, Dt, R, P, PG, T, AR, AX, GRID, reg, fn, arc, die, g };
})();

const MUKA = {
  /* ---------- Tingkatan 1 ---------- */
  nombornyata: ([c1, c2, c3]) => { const { L, T, Dt, P, g, N, TX } = MK; let t = ''; for (let k = -4; k <= 4; k++) t += L(300 + k * 62, 318, 300 + k * 62, 342, N, 3) + T(300 + k * 62, 372, k < 0 ? '−' + -k : k, N, 24, 'middle', 600);
    return g(0, MK.AR(30, 330, 570, 330, N, 4) + MK.AR(570, 330, 30, 330, N, 4) + t) + g(1, P('M300 300Q362 210 424 300', c1, 0, 4) + P('M424 300Q486 210 548 300', c1, 0, 4) + T(362, 220, '+1', c1, 28) + T(486, 220, '+1', c1, 28))
      + g(2, Dt(145, 330, c2, 12) + T(145, 268, '−2.5', c2, 30)) + g(3, Dt(387.6, 330, c3, 12) + T(387.6, 440, '√2', c3, 40)) + g(4, Dt(494.7, 330, c1, 12) + T(494.7, 440, 'π', c1, 44)) + g(5, T(110, 140, 'ℝ', TX, 120)); },
  faktorgandaan: ([c1, c2, c3]) => { const { L, C, T, g, N } = MK; const nd = (x, y, s, c, p) => C(x, y, 44, c, p ? .9 : .14) + T(x, y, s, p ? '#0B1220' : c, 34);
    return g(0, L(300, 110, 180, 250, N, 4) + L(300, 110, 420, 250, N, 4) + nd(300, 100, '60', c1)) + g(1, nd(180, 260, '6', c2) + nd(420, 260, '10', c2)) + g(2, L(180, 260, 110, 420, N, 4) + L(180, 260, 250, 420, N, 4) + L(420, 260, 350, 420, N, 4) + L(420, 260, 490, 420, N, 4) + nd(110, 430, '2', c3, 1) + nd(250, 430, '3', c3, 1) + nd(350, 430, '2', c3, 1) + nd(490, 430, '5', c3, 1)) + g(3, T(300, 540, '60 = 2 × 2 × 3 × 5', N, 30, 'middle', 600)); },
  nisbahkadar: ([c1, c2, c3]) => { const { R, T, g, D, N } = MK; let a = '', b = ''; for (let k = 0; k < 2; k++) a += R(110 + k * 90, 140, 90, 90, c1, .25, 4); for (let k = 0; k < 3; k++) b += R(110 + k * 90, 290, 90, 90, c2, .25, 4);
    return g(0, T(70, 185, 'A', c1, 40) + a) + g(1, T(70, 335, 'B', c2, 40) + b) + g(2, D(110, 420, 110, 470, N) + D(380, 420, 380, 470, N) + T(245, 500, '5 bahagian', N, 28, 'middle', 600)) + g(3, T(470, 260, '2 : 3', c3, 64)); },
  ungkapanalgebra: ([c1, c2, c3]) => { const { R, T, g } = MK; let x = '', u = ''; for (let k = 0; k < 3; k++) x += R(300 + k * 66, 100, 56, 200, c2, .22, 6); for (let k = 0; k < 4; k++) u += R(300 + (k % 2) * 66, 360 + Math.floor(k / 2) * 66, 56, 56, c3, .22, 6);
    return g(0, R(70, 100, 200, 200, c1, .22, 8) + T(170, 200, 'x²', c1, 54)) + g(1, x + T(399, 330, 'x', c2, 34)) + g(2, u + T(470, 425, '1', c3, 40)) + g(3, T(170, 420, 'x² + 3x + 4', c1, 34)); },
  persamaanlinear: ([c1, c2, c3]) => { const { L, P, R, C, T, g, N, PG } = MK; const pan = (x, y) => P(`M${x - 110} ${y}Q${x} ${y + 60} ${x + 110} ${y}Z`, N, .12, 4);
    return g(0, PG([[300, 300], [250, 520], [350, 520]], N, .12) + L(180, 520, 420, 520, N, 6) + L(100, 300, 500, 300, N, 8) + L(130, 300, 130, 380, N, 3) + L(470, 300, 470, 380, N, 3) + pan(130, 380) + pan(470, 380))
      + g(1, R(70, 300, 70, 70, c1, .3, 8) + T(105, 335, 'x', c1, 40) + C(165, 350, 18, c3, .4, 3) + C(195, 330, 18, c3, .4, 3)) + g(2, [0, 1, 2, 3, 4].map(k => C(410 + (k % 3) * 40, 355 - Math.floor(k / 3) * 38, 18, c2, .4, 3)).join('')) + g(3, T(300, 140, 'x + 2 = 5', c1, 52)); },
  garissudut: ([c1, c2, c3]) => { const { L, P, T, g, N, arc } = MK;
    return g(0, L(40, 220, 560, 220, N, 5) + L(40, 420, 560, 420, N, 5) + L(180, 560, 440, 60, c3, 5)) + g(1, P(arc(334.3, 220, 50, 0, 62.5), c1, 0, 6) + T(400, 180, 'x', c1, 36)) + g(2, P(arc(230.3, 420, 50, 0, 62.5), c2, 0, 6) + T(296, 380, 'y', c2, 36)) + g(3, T(300, 520, 'x = y', N, 36)); },
  segitiga: ([c1, c2, c3]) => { const { PG, P, T, g } = MK;
    return g(0, PG([[70, 330], [270, 330], [70, 110]], c1, .18) + P('M70 300H100V330', c1, 0, 3)) + g(1, PG([[330, 330], [540, 330], [490, 150], [380, 150]], c2, .18)) + g(2, PG([[160, 540], [440, 540], [520, 400], [240, 400]], c3, .18)) + g(3, T(130, 260, '90°', c1, 26)); },
  pengendaliandata: ([c1, c2, c3]) => { const { R, g, AX } = MK; const h = [180, 300, 240, 400, 140], cs = [c1, c2, c3, c1, c2];
    return g(0, AX(80, 520, 60, 570, 540, 60)) + h.map((v, k) => g(k + 1, R(110 + k * 90, 520 - v, 64, v, cs[k], .3, 4))).join(''); },

  /* ---------- Tingkatan 2 ---------- */
  pola: ([c1, c2, c3]) => { const { Dt, T, g, TX } = MK; const tri = (x0, y0, n, c) => { let s = ''; for (let r = 0; r < n; r++) for (let k = 0; k <= r; k++) s += Dt(x0 + (k - r / 2) * 38, y0 + r * 36, c, 13); return s; };
    return g(0, tri(90, 300, 1, c1)) + g(1, tri(180, 264, 2, c2)) + g(2, tri(300, 228, 3, c3)) + g(3, tri(460, 192, 4, c1)) + g(4, T(300, 440, '1, 3, 6, 10, ...', TX, 44)); },
  pemfaktoran: ([c1, c2, c3]) => { const { R, T, g, N } = MK;
    return g(0, R(140, 140, 240, 240, c1, .22, 4) + T(260, 260, 'x²', c1, 54)) + g(1, R(380, 140, 120, 240, c2, .22, 4) + T(440, 260, '3x', c2, 40)) + g(2, R(140, 380, 240, 100, c2, .22, 4) + T(260, 430, '2x', c2, 40)) + g(3, R(380, 380, 120, 100, c3, .22, 4) + T(440, 430, '6', c3, 40))
      + g(4, T(260, 105, 'x', N, 34) + T(440, 105, '3', N, 34) + T(100, 260, 'x', N, 34) + T(100, 430, '2', N, 34)); },
  rumus: ([c1, c2, c3]) => { const { R, T, g, AR, N } = MK;
    return g(0, R(80, 120, 260, 170, c1, .2, 4) + T(210, 205, 'A', c1, 56) + T(210, 320, 'p', N, 34) + T(50, 205, 'l', N, 34)) + g(1, T(470, 205, 'A = pl', c2, 50)) + g(2, AR(470, 270, 470, 380, N, 4)) + g(3, T(470, 450, 'p = A ÷ l', c3, 46)); },
  poligon: ([c1, c2, c3]) => { const { PG, g, reg } = MK; const cs = [c1, c2, c3, c1];
    return [3, 4, 5, 6].map((n, k) => g(k, PG(reg(300, 310, 70 + k * 70, n), cs[k], k === 0 ? .25 : .06, 5))).join(''); },
  circmotion: ([c1, c2, c3]) => { const { C, L, P, Dt, g } = MK;
    return g(0, C(300, 300, 220, MK.N, .05, 5)) + g(1, P('M300 300L520 300A220 220 0 0 0 410.0 109.5Z', c3, .25, 4)) + g(2, L(300, 300, 145.4, 455.6, c1, 6) + Dt(300, 300, c1, 10)) + g(3, L(120, 173.8, 480, 173.8, c2, 6)); },
  bentuk3d: ([c1, c2, c3]) => { const { P, PG, D, g } = MK;
    return g(0, PG([[60, 200], [220, 200], [220, 360], [60, 360]], c1, .18) + PG([[60, 200], [120, 140], [280, 140], [220, 200]], c1, .3) + PG([[220, 200], [280, 140], [280, 300], [220, 360]], c1, .1))
      + g(1, P('M340 160A90 30 0 1 0 520 160A90 30 0 1 0 340 160M340 160V380A90 30 0 0 0 520 380V160', c2, .14, 5)) + g(2, PG([[300, 560], [180, 520], [300, 400]], c3, .14) + PG([[300, 560], [420, 520], [300, 400]], c3, .28) + D(180, 520, 420, 520, c3)); },
  koordinat: ([c1, c2, c3]) => { const { GRID, AX, Dt, T, D, g } = MK; const p = (x, y) => [300 + x * 50, 300 - y * 50];
    const [a, b, c] = [p(3, 3), p(-3, 1), p(2, -3)];
    return g(0, GRID(50, 50, 550, 550, 50) + AX(300, 300, 40, 565, 565, 35)) + g(1, D(...a, ...b, MK.N) + Dt(...a, c1, 12) + T(a[0] + 20, a[1] - 26, 'A', c1, 32, 'start')) + g(2, Dt(...b, c2, 12) + T(b[0] - 20, b[1] - 26, 'B', c2, 32, 'end')) + g(3, Dt(...c, c3, 12) + T(c[0] + 20, c[1] + 26, 'C', c3, 32, 'start')); },
  graphx: ([c1, c2, c3]) => { const { AX, P, g, fn } = MK;
    return g(0, AX(300, 400, 40, 565, 565, 35)) + g(1, P(fn(x => x * x, -3.2, 3.2, 300, 400, 70, 33), c1, 0, 6)) + g(2, P(fn(x => x * x * x / 4, -3.4, 3.4, 300, 400, 70, 33), c2, 0, 6)) + g(3, P(fn(x => -x + 1, -3.4, 3.4, 300, 400, 70, 33), c3, 0, 6)); },
  pecut: ([c1, c2, c3]) => { const { AX, P, T, Dt, g, D } = MK;
    return g(0, AX(80, 500, 60, 570, 520, 50) + T(60, 70, 'v', MK.N, 34) + T(560, 540, 't', MK.N, 34)) + g(1, P('M80 500L200 200L420 200L520 500Z', c1, .16, 0)) + g(2, P('M80 500L200 200', c2, 0, 6) + P('M420 200L520 500', c3, 0, 6) + P('M200 200L420 200', c1, 0, 6)) + g(3, Dt(200, 200, c1) + Dt(420, 200, c1) + D(200, 200, 200, 500, MK.N) + D(420, 200, 420, 500, MK.N)); },
  gradien: ([c1, c2, c3]) => { const { GRID, L, Dt, P, g } = MK;
    return g(0, GRID(50, 50, 550, 550, 50)) + g(1, L(80, 520, 520, 80, c1, 7)) + g(2, L(200, 400, 400, 400, c2, 6) + P('M380 400V380H400', MK.N, 0, 3)) + g(3, L(400, 400, 400, 200, c3, 6) + Dt(200, 400, c1, 11) + Dt(400, 200, c1, 11)); },
  isomove: ([c1, c2, c3]) => { const { GRID, PG, AR, D, g } = MK;
    return g(0, GRID(50, 50, 550, 550, 50)) + g(1, PG([[100, 250], [200, 250], [100, 100]], c1, .25)) + g(2, AR(160, 210, 300, 210, MK.N, 4) + PG([[300, 250], [400, 250], [300, 100]], c2, .25)) + g(3, D(50, 300, 550, 300, MK.N) + PG([[100, 350], [200, 350], [100, 500]], c3, .25)); },
  kecenderungan: ([c1, c2, c3]) => { const { L, T, Dt, PG, g, N } = MK; const st = [1, 3, 5, 2, 1], xs = [120, 210, 300, 390, 480]; let d = '';
    st.forEach((n, k) => { for (let j = 0; j < n; j++) d += Dt(xs[k], 400 - j * 52, k === 2 ? c1 : c2, 19); });
    return g(0, L(60, 440, 540, 440, N, 4) + xs.map((x, k) => L(x, 432, x, 448, N, 3) + T(x, 480, k + 2, N, 26, 'middle', 600)).join('')) + g(1, d) + g(2, PG([[300, 510], [284, 540], [316, 540]], c3, 1, 2) + T(300, 568, 'min', c3, 24)) + g(3, T(300, 110, 'mod', c1, 34)); },
  probalyt: ([c1, c2, c3]) => { const { die, C, T, g } = MK;
    return g(0, die(80, 120, 190, 5, c1, -12)) + g(1, die(320, 230, 190, 3, c2, 10)) + g(2, C(170, 450, 70, c3, .18, 5) + T(170, 450, 'P', c3, 54)); },

  /* ---------- Tingkatan 3 ---------- */
  indeks: ([c1, c2, c3]) => { const { R, T, g, L, N } = MK; const h = [25, 50, 100, 200, 400], cs = [c1, c2, c3, c1, c2];
    return g(0, L(40, 500, 560, 500, N, 3)) + h.map((v, k) => g(k + 1, R(70 + k * 100, 500 - v, 70, v, cs[k], .28, 4) + T(105 + k * 100, 540, `2<tspan dy="-12" font-size="20">${k + 1}</tspan>`, cs[k], 30))).join(''); },
  piawai: ([c1, c2, c3]) => { const { L, T, Dt, g, N } = MK; let t = ''; for (let k = -3; k <= 3; k++) t += L(300 + k * 75, 280, 300 + k * 75, 320, N, 3) + T(300 + k * 75, 350, `10<tspan dy="-11" font-size="17">${k < 0 ? '−' + -k : k}</tspan>`, N, 24, 'middle', 600);
    return g(0, L(50, 300, 550, 300, N, 4) + t) + g(1, Dt(75, 300, c2, 9) + Dt(110, 300, c2, 13)) + g(2, Dt(450, 300, c3, 20) + Dt(525, 300, c3, 28)) + g(3, T(300, 160, `A × 10<tspan dy="-20" font-size="34">n</tspan>`, c1, 58)) + g(4, T(300, 460, '1 ≤ A < 10', N, 36)); },
  pengguna: ([c1, c2, c3]) => { const { R, P, g, L, N, fn } = MK; const h = [120, 150, 188, 235, 294, 367];
    return g(0, L(50, 500, 560, 500, N, 3)) + g(1, h.map((v, k) => R(70 + k * 80, 500 - v, 56, v, c1, .25, 4)).join('')) + g(2, P(fn(x => 120 * Math.pow(1.25, x), 0, 5, 98, 500, 80, 1), c2, 0, 6)) + g(3, [0, 1, 2, 3].map(k => P(`M60 ${200 - k * 22}a70 18 0 1 0 140 0a70 18 0 1 0 -140 0`, c3, .25, 4)).join('')); },
  berskala: ([c1, c2, c3]) => { const { GRID, PG, D, g } = MK; const h = (x, y, s) => [[x, y], [x + 2 * s, y], [x + 2 * s, y - 1.4 * s], [x + s, y - 2.4 * s], [x, y - 1.4 * s]];
    return g(0, GRID(40, 60, 560, 540, 40)) + g(1, PG(h(80, 520, 40), c1, .25)) + g(2, PG(h(280, 520, 120), c2, .15)) + g(3, D(80, 520, 280, 520, c3) + D(200, 424, 400, 232, c3)); },
  trigonometri: ([c1, c2, c3]) => { const { L, P, T, g, arc } = MK;
    return g(0, L(90, 480, 510, 480, c3, 7) + T(300, 530, 'bersebelahan', c3, 28)) + g(1, L(510, 480, 510, 140, c2, 7) + `<text x="548" y="310" fill="${c2}" font-family="Space Grotesk, Inter, sans-serif" font-size="28" font-weight="700" text-anchor="middle" dominant-baseline="central" transform="rotate(90 548 310)">bertentangan</text>` + P('M480 480V450H510', MK.N, 0, 3)) + g(2, L(90, 480, 510, 140, c1, 7) + T(250, 270, 'hipotenus', c1, 28)) + g(3, P(arc(90, 480, 80, 0, 39), c1, 0, 5) + T(205, 450, 'θ', c1, 40)); },
  sudutbulatan: ([c1, c2, c3]) => { const { C, L, P, Dt, g } = MK; const pt = t => [300 + 210 * Math.cos(t * Math.PI / 180), 300 - 210 * Math.sin(t * Math.PI / 180)];
    const A = pt(200), B = pt(-20), P1 = pt(110), P2 = pt(70), Tp = pt(-90);
    return g(0, C(300, 300, 210, MK.N, .05, 5)) + g(1, L(...A, ...P1, c1, 5) + L(...B, ...P1, c1, 5) + Dt(...P1, c1)) + g(2, L(...A, ...P2, c2, 5) + L(...B, ...P2, c2, 5) + Dt(...P2, c2)) + g(3, L(80, Tp[1], 520, Tp[1], c3, 6) + L(300, 300, ...Tp, MK.N, 3) + P(`M300 ${Tp[1] - 22}H322V${Tp[1]}`, MK.N, 0, 3) + Dt(...A, MK.TX) + Dt(...B, MK.TX)); },
  pelan: ([c1, c2, c3]) => { const { PG, D, T, R, g } = MK;
    return g(0, PG([[200, 260], [320, 200], [440, 260], [320, 320]], c1, .35) + PG([[200, 260], [320, 320], [320, 440], [200, 380]], c1, .18) + PG([[320, 320], [440, 260], [440, 380], [320, 440]], c1, .08))
      + g(1, R(60, 470, 150, 80, c2, .2, 2) + T(135, 575, 'dongakan', c2, 24) + D(200, 380, 135, 470, MK.N)) + g(2, R(420, 60, 120, 120, c3, .2, 2) + T(480, 40, 'pelan', c3, 24) + D(440, 260, 480, 180, MK.N)); },
  lokus: ([c1, c2, c3]) => { const { C, Dt, T, P, L, g } = MK;
    return g(0, Dt(200, 260, c1, 11) + T(222, 238, 'O', c1, 30, 'start')) + g(1, `<circle cx="200" cy="260" r="140" fill="none" stroke="${c1}" stroke-width="5" stroke-dasharray="14 10"/>`) + g(2, Dt(330, 470, c2, 11) + Dt(530, 470, c2, 11) + L(430, 280, 430, 580, c2, 5, 'stroke-dasharray="14 10"') + P('M430 450H452V470', MK.N, 0, 3) + L(330, 470, 530, 470, MK.N, 3)) + g(3, L(300, 260, 340, 260, MK.N, 0)); },
  garislurus: ([c1, c2, c3]) => { const { AX, L, Dt, g, T } = MK;
    return g(0, AX(300, 300, 40, 565, 565, 35)) + g(1, L(60, 480, 540, 120, c1, 6) + Dt(300, 300, c1)) + g(2, L(60, 380, 540, 20, c2, 6) + Dt(300, 200, c2) + T(320, 190, 'c', c2, 34, 'start')) + g(3, L(80, 120, 520, 560, c3, 6)); },

  /* ---------- Tingkatan 4 ---------- */
  kuadratik: ([c1, c2, c3]) => { const { AX, P, Dt, D, g, fn } = MK;
    return g(0, AX(300, 380, 40, 565, 565, 35)) + g(1, P(fn(x => (x - 0.5) * (x - 0.5) - 4, -2.3, 3.3, 300, 380, 80, 45), c1, 0, 6)) + g(2, D(340, 60, 340, 590, MK.N)) + g(3, Dt(180, 380, c2, 12) + Dt(500, 380, c2, 12)) + g(4, Dt(340, 560, c3, 12)); },
  asasnombor: ([c1, c2, c3]) => { const { R, T, g, N } = MK; const d = ['1', '0', '1', '1'], p = ['3', '2', '1', '0'], cs = [c1, c2, c3, c1];
    return d.map((v, k) => g(k, T(120 + k * 120, 200, `2<tspan dy="-14" font-size="24">${p[k]}</tspan>`, N, 36) + R(70 + k * 120, 250, 100, 120, cs[k], .2, 10) + T(120 + k * 120, 310, v, cs[k], 64))).join('') + g(5, T(300, 480, '1011₂ = 11₁₀', N, 40)); },
  logik: ([c1, c2, c3]) => { const { R, T, AR, g, L, N } = MK; const tb = [['p', 'q', 'p ⇒ q'], ['B', 'B', 'B'], ['B', 'P', 'P'], ['P', 'B', 'B'], ['P', 'P', 'B']];
    return g(0, R(70, 90, 140, 110, c1, .2, 18) + T(140, 145, 'p', c1, 56)) + g(1, AR(225, 145, 365, 145, N, 5)) + g(2, R(380, 90, 140, 110, c2, .2, 18) + T(450, 145, 'q', c2, 56))
      + g(3, L(110, 290, 490, 290, N, 3) + L(340, 250, 340, 560, N, 3) + tb.map((r, i) => r.map((v, j) => T([160, 270, 420][j], 270 + i * 64 - (i ? 0 : 0), v, i ? (j === 2 ? c3 : MK.TX) : N, i ? 32 : 28)).join('')).join('')); },
  operasiset: ([c1, c2, c3]) => { const { R, C, T, g, N } = MK;
    return g(0, R(40, 50, 520, 500, N, .03, 18, 3) + T(80, 90, 'ξ', N, 40)) + g(1, C(230, 240, 150, c1, .18, 5) + T(150, 180, 'A', c1, 40)) + g(2, C(370, 240, 150, c2, .18, 5) + T(450, 180, 'B', c2, 40)) + g(3, C(300, 360, 150, c3, .18, 5) + T(300, 450, 'C', c3, 40)); },
  teorigraf: ([c1, c2, c3]) => { const { L, C, T, g, N } = MK; const v = [[120, 150], [320, 90], [500, 200], [460, 430], [240, 480], [110, 350]], e = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 4]], cs = [c1, c2, c3];
    return g(0, e.map(([i, j]) => L(...v[i], ...v[j], N, 4)).join('')) + v.map((p, k) => g(1 + k % 3, C(...p, 32, cs[k % 3], .9, 4) + T(...p, 'ABCDEF'[k], '#0B1220', 30))).join(''); },
  ketaksamaan: ([c1, c2, c3]) => { const { AX, L, PG, g } = MK;
    return g(0, PG([[300, 300], [300, 100], [500, 300]], c1, .3, 0)) + g(1, AX(300, 300, 40, 565, 565, 35)) + g(2, L(250, 50, 550, 350, c2, 5, 'stroke-dasharray="14 10"')) + g(3, L(300, 40, 300, 560, c3, 5) + L(40, 300, 560, 300, c3, 5)); },
  grafgerakan: ([c1, c2, c3]) => { const { AX, P, Dt, T, g, N } = MK;
    return g(0, AX(80, 500, 60, 570, 520, 50) + T(80, 40, 's', N, 32) + T(560, 540, 't', N, 32)) + g(1, P('M80 500L230 220', c1, 0, 6) + Dt(230, 220, c1)) + g(2, P('M230 220L380 220', c2, 0, 6) + Dt(380, 220, c2)) + g(3, P('M380 220L520 500', c3, 0, 6) + Dt(520, 500, c3)); },
  serakan: ([c1, c2, c3]) => { const { L, R, Dt, g, N } = MK; const d = [90, 140, 170, 210, 240, 260, 290, 330, 370, 420, 510];
    return g(0, d.map(x => Dt(x, 180, c3, 12)).join('')) + g(1, L(90, 360, 190, 360, N, 5) + L(400, 360, 510, 360, N, 5) + L(90, 320, 90, 400, N, 5) + L(510, 320, 510, 400, N, 5)) + g(2, R(190, 290, 210, 140, c1, .2, 6, 5)) + g(3, L(270, 290, 270, 430, c2, 7)) + g(4, L(40, 500, 560, 500, N, 3)); },
  peristiwa: ([c1, c2, c3]) => { const { L, Dt, T, g, N } = MK; const ends = [[480, 70, c1], [480, 210, c2], [480, 390, c1], [480, 530, c2]];
    return g(0, Dt(80, 300, N, 12) + L(80, 300, 260, 140, c1, 5) + L(80, 300, 260, 460, c2, 5)) + g(1, Dt(260, 140, c1, 12) + Dt(260, 460, c2, 12) + T(150, 190, '½', c1, 34) + T(150, 410, '½', c2, 34))
      + g(2, ends.map(([x, y, c], k) => L(260, k < 2 ? 140 : 460, x, y, c, 4) + Dt(x, y, c, 12) + T(x + 30, y, ['A', 'B', 'A', 'B'][k], c, 34, 'start')).join('')) + g(3, T(80, 520, 'P(A ∩ B)', c3, 32, 'start')); },
  kewangan: ([c1, c2, c3]) => { const { P, g, T, N } = MK; const seg = (t0, t1, c) => { const r = 200, ri = 110, p = (t, rr) => [300 + rr * Math.cos(t), 300 + rr * Math.sin(t)].map(v => v.toFixed(1)).join(' '), la = t1 - t0 > Math.PI ? 1 : 0;
      return P(`M${p(t0, r)}A${r} ${r} 0 ${la} 1 ${p(t1, r)}L${p(t1, ri)}A${ri} ${ri} 0 ${la} 0 ${p(t0, ri)}Z`, c, .35, 4); }; const q = Math.PI / 2;
    return g(0, seg(-q, -q + 2 * Math.PI * .5, c1)) + g(1, seg(-q + Math.PI, -q + 2 * Math.PI * .8, c2)) + g(2, seg(-q + 2 * Math.PI * .8, -q + 2 * Math.PI - .001, c3)) + g(3, T(300, 300, 'RM', N, 54)); },

  /* ---------- Tingkatan 5 ---------- */
  ubahan: ([c1, c2, c3]) => { const { AX, P, T, g, fn } = MK;
    return g(0, AX(80, 520, 60, 570, 540, 40)) + g(1, P(fn(x => 0.8 * x, 0, 5.4, 80, 520, 85, 100), c1, 0, 6) + T(530, 70, 'y ∝ x', c1, 32, 'end')) + g(2, P(fn(x => 1 / x, 0.22, 5.6, 80, 520, 85, 100), c2, 0, 6) + T(530, 440, 'y ∝ 1/x', c2, 32, 'end')); },
  matriks: ([c1, c2, c3]) => { const { P, T, g, N } = MK; const m = [['2', '−1', '0'], ['4', '3', '1'], ['0', '5', '−2']], cs = [c1, c2, c3];
    return g(0, P('M120 120H90V480H120', N, 0, 7) + P('M480 120H510V480H480', N, 0, 7)) + m.map((r, i) => g(i + 1, r.map((v, j) => T(180 + j * 120, 180 + i * 120, v, cs[i], 60)).join(''))).join(''); },
  insurans: ([c1, c2, c3]) => { const { P, PG, R, g, L, N } = MK;
    return g(0, P('M80 260A220 180 0 0 1 520 260Q465 230 410 260Q355 230 300 260Q245 230 190 260Q135 230 80 260Z', c1, .25, 5)) + g(1, L(300, 80, 300, 450, N, 5) + P('M300 450Q300 500 340 500Q370 500 370 470', N, 0, 5))
      + g(2, PG([[180, 560], [180, 450], [240, 400], [300, 450], [300, 560]], c2, .2) + R(222, 500, 36, 60, c2, .4, 3, 3)) + g(3, PG([[330, 560], [330, 470], [390, 430], [450, 470], [450, 560]], c3, .2)); },
  percukaian: ([c1, c2, c3]) => { const { P, L, T, g, N } = MK; let ln = ''; for (let k = 0; k < 5; k++) ln += L(140, 170 + k * 50, k % 2 ? 330 : 380, 170 + k * 50, N, 5) + L(400, 170 + k * 50, 450, 170 + k * 50, N, 5);
    return g(0, P('M110 80H480V500L445 530L410 500L375 530L340 500L305 530L270 500L235 530L200 500L165 530L110 500Z', c1, .12, 5)) + g(1, ln) + g(2, L(140, 440, 450, 440, c2, 5) + T(140, 470, 'Cukai', c2, 30, 'start') + T(450, 470, '6%', c2, 30, 'end')) + g(3, T(500, 140, '%', c3, 110)); },
  kekongruenan: ([c1, c2, c3]) => { const { PG, D, Dt, T, g } = MK; const P0 = [70, 520], s = [[150, 440], [230, 440], [150, 320]], b = s.map(([x, y]) => [P0[0] + 2.5 * (x - P0[0]), P0[1] + 2.5 * (y - P0[1])]);
    return g(0, Dt(...P0, c3, 12) + T(50, 555, 'P', c3, 32)) + g(1, b.map(p => D(...P0, ...p, MK.N)).join('')) + g(2, PG(s, c1, .3)) + g(3, PG(b, c2, .12)); },
  trigograf: ([c1, c2, c3]) => { const { AX, P, g, fn, T } = MK;
    return g(0, AX(70, 300, 50, 575, 520, 80)) + g(1, P(fn(x => Math.sin(x * Math.PI / 180), 0, 360, 70, 300, 1.4, 170), c1, 0, 6) + T(185, 105, 'sin x', c1, 30)) + g(2, P(fn(x => Math.cos(x * Math.PI / 180), 0, 360, 70, 300, 1.4, 170), c2, 0, 6) + T(420, 520, 'cos x', c2, 30)) + g(3, T(574, 330, '360°', MK.N, 24, 'end', 600)); },
  serakanterkumpul: ([c1, c2, c3]) => { const { R, P, AX, Dt, g } = MK; const h = [60, 140, 260, 330, 210, 90], x0 = 100, w = 70;
    return g(0, AX(80, 520, 60, 575, 540, 40)) + g(1, h.map((v, k) => R(x0 + k * w, 520 - v, w, v, c1, .25, 0, 3)).join('')) + g(2, P('M' + [[x0 - w / 2, 520], ...h.map((v, k) => [x0 + k * w + w / 2, 520 - v]), [x0 + 6.5 * w, 520]].map(p => p.join(' ')).join('L'), c2, 0, 5) + h.map((v, k) => Dt(x0 + k * w + w / 2, 520 - v, c2, 8)).join('')) + g(3, ''); },
  pemodelan: ([c1, c2, c3]) => { const { C, P, T, g, AR, N } = MK; const pts = [[300, 110], [490, 300], [300, 490], [110, 300]], cs = [c1, c2, c3, c1], lb = ['1', '2', '3', '4'];
    const arw = k => { const t0 = (-90 + k * 90 + 22) * Math.PI / 180, t1 = (-90 + k * 90 + 68) * Math.PI / 180, r = 190, p = t => [300 + r * Math.cos(t), 300 + r * Math.sin(t)]; const [x0, y0] = p(t0), [x1, y1] = p(t1), [x2, y2] = p(t1 - .05); return P(`M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`, N, 0, 4) + AR(x2, y2, x1, y1, N, 4); };
    return pts.map((p, k) => g(k, C(...p, 62, cs[k], .2, 5) + T(...p, lb[k], cs[k], 50) + arw(k))).join(''); },
};

/* ---------- slaid tajuk: satu di depan setiap subtopik (n = 0) ---------- */
(function tambahTajuk() {
  if (typeof SLIDES === 'undefined' || SLIDES.some(x => x.cover)) return;
  SUBS.forEach(su => {
    const k = SLIDES.findIndex(x => x.sub === su.no); if (k < 0) return;
    SLIDES.splice(k, 0, { sub: su.no, n: 0, N: SLIDES[k].N, cover: true, kicker: 'TAJUK', title: 'Tajuk subtopik', body: '', fig: '' });
  });
})();
function coverHTML(s, light) {
  const su = subOf(s.sub), base = [...new Set([...SUBS.map(x => x.col.toUpperCase()), '#38BDF8', '#FBBF24', '#34D399', '#A78BFA', '#F472B6'])];
  const k = Math.max(0, base.indexOf(su.col.toUpperCase())), pal = [base[k], ...base.filter((_, j) => j !== k)].slice(0, 3);
  const f = MUKA[BAB.id], art = f ? themed(f(pal), light) : '', col = themed(su.col, light);
  const len = su.name.length, cls = len > 44 ? ' xl' : len > 24 ? ' l' : '';
  return `<div class="cover cvslide" style="--c:${col}">
    <div class="cv-txt">
      <p class="cv-bab">BAB ${BAB.no} : ${BAB.tajuk}</p>
      <h1 class="cv-t${cls}"><span class="cv-no">${s.sub}</span>${su.name}</h1>
      <div class="cv-bar" aria-hidden="true"><i style="background:${col}"></i></div>
    </div>
    ${art ? `<svg class="cv-art" viewBox="0 0 600 600" role="img" aria-label="Rajah hiasan ${su.name}">${art}</svg>` : ''}
  </div>`;
}
