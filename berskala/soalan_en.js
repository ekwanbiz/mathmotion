'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_berskala_en.py; jangan sunting dengan tangan. */
/* =================== BERSKALA · SOALAN BAB 4 LUKISAN BERSKALA (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "bs" / "BS" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// bsBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const BSBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const BSBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const BSBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${BSBTAT})+)( ?)\/\2((?:${BSBTAT})+)(?![\w]|\.\d)`);
const BSBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, BSBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const bsBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function bsBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + BSBTG[c][0] + '\u0002' + BSBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + bsBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(BSBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (BSBTUN.test(a) && BSBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && BSBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + bsBtP(a) + '\u0002' + bsBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function bsBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = bsBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// bsBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function bsBtTree(s) {
  let i = 0;
  const run = stop => {
    const out = []; let buf = '';
    const fl = () => { if (buf) out.push({ t: 's', v: buf }); buf = ''; };
    while (i < s.length) {
      const c = s[i];
      if (stop.includes(c)) break;
      if (c === '\u0001') { fl(); i++; const a = run('\u0002'); i++; const b = run('\u0003'); i++; out.push({ t: 'f', a, b }); }
      else if (c === '\u0004') { fl(); i++; const n = run('\u0005'); i++; const k = run('\u0006'); i++; out.push({ t: 'r', n, k }); }
      else { buf += c; i++; }
    }
    fl(); return out;
  };
  return run('');
}
const bsBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function bsBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * bsBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = bsBtMeas(n.a, z2), B = bsBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = bsBtMeas(n.k, z), N = bsBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function bsBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += bsBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + bsBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += bsBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += bsBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const bsBtW = (t, z) => bsBtMeas(bsBtTree(bsBtTok(String(t))), z).w;
function bsBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = bsBtTree(bsBtTok(String(t))), m = bsBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${bsBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function bsBtO(o) {
  if (typeof o === 'string') return bsBt(o);
  if (Array.isArray(o)) return o.map(bsBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = bsBtO(o[k]);
  return o;
}

const bsGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// nombor kemas: bundar 4 t.p., tiada −0, ribuan dipisah ruang (≥ 10 000)
const bsN = x => {
  let r = Math.round(x * 10000) / 10000; if (Object.is(r, -0) || Math.abs(r) < 1e-12) r = 0;
  let s = String(Math.abs(r));
  if (Number.isInteger(r) && Math.abs(r) >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (r < 0 ? '−' : '') + s;
};
// pecahan a/b termudah (b > 0)
const bsFr = (a, b) => { const g = bsGcd(a, b) || 1; a /= g; b /= g; return b === 1 ? bsN(a) : `${a}/${b}`; };
// skala 1 : n, n = a/b (rasional)
const bsSk = (a, b = 1) => `1 : ${bsFr(a, b)}`;
const bsCm = x => `${bsN(x)} cm`, bsM = x => `${bsN(x)} m`, bsKm = x => `${bsN(x)} km`;
const bsM2 = x => `${bsN(x)} m²`, bsCm2 = x => `${bsN(x)} cm²`;
const bsRM = x => `RM${bsN(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}`;
// cm sebenar → teks unit sesuai
const bsReal = cm => (cm >= 100000 ? `${bsN(cm)} cm = ${bsN(cm / 100)} m = ${bsN(cm / 100000)} km` : cm >= 100 ? `${bsN(cm)} cm = ${bsN(cm / 100)} m` : `${bsN(cm)} cm`);
const bsTidy = (x, dp = 2) => Math.abs(x * 10 ** dp - Math.round(x * 10 ** dp)) < 1e-9;
// rawak: bsRG untuk Latihan Kelas / games, bsRW (berbenih) untuk Lembaran Kerja
const bsRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const bsRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const bsShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* =================== data bersama =================== */
// bentuk asas pada grid (unit petak, y ke bawah)
const BSHAPE = [
  { n: 'rectangle', p: [[0, 0], [3, 0], [3, 2], [0, 2]] },
  { n: 'L', p: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]] },
  { n: 'right-angled triangle', p: [[0, 0], [0, 2], [3, 2]] },
  { n: 'house', p: [[1, 0], [2, 1], [2, 3], [0, 3], [0, 1]] },
  { n: 'T', p: [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]] },
  { n: 'trapezium', p: [[1, 0], [2, 0], [3, 2], [0, 2]] },
  { n: 'pentagon', p: [[0, 0], [2, 0], [3, 1], [2, 2], [0, 2]] },
  { n: 'L', p: [[0, 0], [1, 0], [1, 1], [3, 1], [3, 2], [0, 2]] }
];
const BSOBJ = ['a book', 'a tile', 'a picture frame', 'a box', 'a drawing board', 'a tray', 'a greeting card', 'a bag'];
const bsPj = ob => (ob === 'ant' ? 'an' : 'a');
const bsBare = s => s.replace(/^(a|an) /, '');
const BSLUAS_S = ['fish pond', 'storeroom', 'stage', 'seedling bed', 'sandpit'];
const BSLUAS = ['field', 'house lot', 'fish pond', 'hall', 'playground', 'car park', 'court', 'vegetable garden'];
const BSBILIK = ['bedroom', 'living room', 'kitchen', 'study room', 'storeroom', 'prayer room', 'laboratory', 'office'];
const BSTEMPAT = [['Kampung Baru', 'Pekan Lama'], ['Town A', 'Town B'], ['Taman Seri', 'Bukit Indah'], ['Kuala Hijau', 'Sungai Biru'], ['Town P', 'Town Q'], ['Jetty', 'Waterfall']];
const BSKECIL = [['ant', 'length'], ['beetle', 'length'], ['leaf', 'width'], ['bee', 'length'], ['button', 'diameter'], ['mosquito', 'length']];
const BSBS1 = [
  ['A scale drawing has the same shape as the actual object.', true, 'A scale drawing only changes the size, not the shape.'],
  ['A scale drawing is always smaller than the actual object.', false, 'A scale drawing can be smaller than, bigger than or the same size as the object.'],
  ['If 2 cm is added to every side of an object, the drawing obtained is a scale drawing.', false, 'Adding the same value changes the ratio of the sides. A scale drawing is obtained by multiplying every side by the same number.'],
  ['In a scale drawing, all the angles are the same as the angles of the object.', true, 'The shape does not change, thus all the angles remain unchanged.'],
  ['House plans and maps are examples of scale drawings that are smaller than the object.', true, 'The measurements on plans and maps are much smaller than the actual measurements.'],
  ['A scale drawing can be produced by multiplying only the length by a number.', false, 'All measurements, not only the length, must be multiplied by the same number.'],
  ['The drawing of a cell in a science book is usually a scale drawing that is bigger than the object.', true, 'A cell is very small, so its drawing is enlarged so that it can be seen.'],
  ['The ratio of measurement of drawing to measurement of object is the same for all corresponding sides.', true, 'That is the condition for a scale drawing.']
];
const BSBS2 = [
  ['A scale of 1 : 100 means 1 cm on the drawing represents 100 cm on the actual object.', true, '1 : n means one unit on the scale drawing will represent n units on the object.'],
  ['A scale of 1 : 1/2 produces a drawing that is smaller than the object.', false, 'n = 1/2 < 1, thus the drawing is bigger (2 times the object).'],
  ['Scale is the ratio of actual measurement to measurement of drawing.', false, 'Scale = measurement of scale drawing : measurement of object.'],
  ['For a scale of 1 : n where n > 1, the drawing is smaller than the object.', true, 'Every measurement of the drawing = actual measurement ÷ n, where n > 1.'],
  ['A scale of 1 : 1 means the drawing is the same size as the object.', true, 'Measurement of drawing = actual measurement.'],
  ['If a drawing of 5 cm represents 2 m, then the scale is 5 : 2.', false, 'The units must be the same: 5 cm : 200 cm = 1 : 40.'],
  ['A scale of 1 : 50 000 on a map means 1 cm represents 0.5 km.', true, '50 000 cm = 500 m = 0.5 km.'],
  ['A map with a scale of 1 : 200 000 shows an area in more detail than a map with a scale of 1 : 50 000.', false, 'The 1 : 50 000 map is bigger (smaller n), thus it is more detailed.']
];

/* =================== rajah =================== */
const bsF = v => +(+v).toFixed(1);
const bsT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => /[\u0001\u0004]/.test(bsBtTok(String(t))) ? bsBtSvg(x, y, t, `style="fill:var(--${c})" font-family="Inter, sans-serif"`, sz, a, w) : `<text x="${bsF(x)}" y="${bsF(y)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const bsL = (p, q, c, w = 3, dash) => `<line x1="${bsF(p[0])}" y1="${bsF(p[1])}" x2="${bsF(q[0])}" y2="${bsF(q[1])}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const bsSvg = (w, h, s, label) => `<svg viewBox="0 0 ${bsF(w)} ${bsF(h)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// segi empat tepat berlabel, dilukis berkadar: items [{w, h, c, t, wl, hl}]
function bsRects(items, label, maxH = 140) {
  const tw = items.reduce((a, it) => a + it.w, 0), mh = Math.max(...items.map(it => it.h));
  const k = Math.min((440 - 70 * items.length) / tw, maxH / mh), gap = 70;
  let x = 40, s = '';
  const H = maxH + 92, base = 40 + maxH;
  items.forEach(it => {
    const w = Math.max(it.w * k, 14), h = Math.max(it.h * k, 14), y = base - h;
    s += `<rect x="${bsF(x)}" y="${bsF(y)}" width="${bsF(w)}" height="${bsF(h)}" rx="3" style="fill:var(--${it.c});fill-opacity:.18;stroke:var(--${it.c})" stroke-width="3"/>`;
    if (it.t) s += bsT(x + w / 2, 18, it.t, it.c, 16);
    if (it.wl) s += bsT(x + w / 2, base + 18, it.wl, it.c, 15);
    if (it.hl) s += bsT(x + w + 7, y + h / 2, it.hl, it.c, 15, 'start');
    x += w + gap;
  });
  return bsSvg(Math.max(x - gap + 60, 300), H, s, label || 'Object and drawing');
}
// titik dalam poligon
function bsIn(pt, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// panel grid: { cols, rows, cell, title, tc, shapes:[{pts, c, ox, oy, lab:'unit'|null, pts2}], marks:[{i,j,s,c}] }
function bsGridFig(panels, label) {
  let x = 14, s = '', H = 0;
  const top = panels.some(p => p.title) ? 34 : 12;
  panels.forEach(p => {
    const c = p.cell, X = i => x + i * c, Y = j => top + j * c;
    for (let i = 0; i <= p.cols; i++) s += `<line x1="${bsF(X(i))}" y1="${bsF(Y(0))}" x2="${bsF(X(i))}" y2="${bsF(Y(p.rows))}" style="stroke:var(--mu);stroke-opacity:.4" stroke-width="1.2"/>`;
    for (let j = 0; j <= p.rows; j++) s += `<line x1="${bsF(X(0))}" y1="${bsF(Y(j))}" x2="${bsF(X(p.cols))}" y2="${bsF(Y(j))}" style="stroke:var(--mu);stroke-opacity:.4" stroke-width="1.2"/>`;
    if (p.title) s += bsT(x + p.cols * c / 2, 15, p.title, p.tc || 'tx', 15);
    (p.shapes || []).forEach(sh => {
      const ox = sh.ox || 0, oy = sh.oy || 0, pts = sh.pts.map(([i, j]) => [i + ox, j + oy]);
      s += `<polygon points="${pts.map(([i, j]) => bsF(X(i)) + ',' + bsF(Y(j))).join(' ')}" style="fill:var(--${sh.c});fill-opacity:.22;stroke:var(--${sh.c})" stroke-width="3" stroke-linejoin="round"/>`;
      if (sh.lab) {
        pts.forEach((a, k) => {
          const b = pts[(k + 1) % pts.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (a[0] !== b[0] && a[1] !== b[1]) return;          // label sisi mengufuk/mencancang sahaja
          let nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if (bsIn([m[0] + nx * .2, m[1] + ny * .2], pts)) { nx = -nx; ny = -ny; }
          const d = c < 20 ? 11 : 13;
          s += bsT(X(m[0]) + nx * (nx ? d + 6 : 0), Y(m[1]) + ny * d, sh.lab(len), sh.c, c < 20 ? 12 : 14, nx > 0 ? 'start' : nx < 0 ? 'end' : 'middle');
        });
      }
      (sh.vl || []).forEach(([k, t]) => {
        const a = pts[k], cx = pts.reduce((u, q) => u + q[0], 0) / pts.length, cy = pts.reduce((u, q) => u + q[1], 0) / pts.length;
        const dx = a[0] - cx, dy = a[1] - cy, ln = Math.hypot(dx, dy) || 1;
        s += `<circle cx="${bsF(X(a[0]))}" cy="${bsF(Y(a[1]))}" r="4.5" style="fill:var(--${sh.c})"/>` + bsT(X(a[0]) + dx / ln * 15, Y(a[1]) + dy / ln * 15, t, 'tx', 16);
      });
    });
    (p.marks || []).forEach(m => { s += bsT(X(m.i), Y(m.j), m.s, m.c || 'tx', m.sz || 16); });
    H = Math.max(H, top + p.rows * c + 14);
    x += p.cols * c + (p.gap || 28);
  });
  return bsSvg(x - 14, H, s, label || 'Grid');
}
// peta: dua tempat dengan jarak pada peta
function bsMapFig(A, B, dl, sk, route) {
  let s = `<rect x="6" y="6" width="348" height="168" rx="16" style="fill:var(--gr);fill-opacity:.08;stroke:var(--mu);stroke-opacity:.5" stroke-width="1.5"/>`;
  s += `<path d="M6 140 C 90 120, 160 170, 240 140 S 330 110, 354 124" fill="none" style="stroke:var(--tr);stroke-opacity:.45" stroke-width="8"/>`;
  if (route) {
    s += bsL([50, 110], [180, 58], 'am', 3.5, true) + bsL([180, 58], [310, 110], 'am', 3.5, true);
    s += `<circle cx="50" cy="110" r="8" style="fill:var(--pk)"/><circle cx="180" cy="58" r="8" style="fill:var(--pu)"/><circle cx="310" cy="110" r="8" style="fill:var(--pk)"/>`;
    s += bsT(50, 132, A, 'tx', 14) + bsT(180, 36, route.C, 'tx', 14) + bsT(310, 132, B, 'tx', 14) + bsT(104, 72, route.d1, 'am', 14, 'end') + bsT(256, 72, route.d2, 'am', 14, 'start');
  } else {
    s += bsL([60, 80], [300, 80], 'am', 3.5, true) + `<circle cx="60" cy="80" r="8" style="fill:var(--pk)"/><circle cx="300" cy="80" r="8" style="fill:var(--pk)"/>`;
    s += bsT(60, 56, A, 'tx', 14) + bsT(300, 56, B, 'tx', 14) + (dl ? bsT(180, 102, dl, 'am', 15) : '');
  }
  if (sk) s += bsT(180, 160, `Scale ${sk}`, 'mu', 14);
  return bsSvg(360, 180, s, 'Map');
}
// pelan bilik: rooms [{w, h, t, c}] dalam cm pada pelan, disusun sebaris
function bsPlanFig(rooms, sk) {
  const k = Math.min(300 / rooms.reduce((a, r) => a + r.w, 0), 120 / Math.max(...rooms.map(r => r.h)));
  let x = 30, s = '';
  rooms.forEach(r => {
    const w = r.w * k, h = r.h * k;
    s += `<rect x="${bsF(x)}" y="24" width="${bsF(w)}" height="${bsF(h)}" style="fill:var(--${r.c});fill-opacity:.16;stroke:var(--${r.c})" stroke-width="3"/>`;
    s += bsT(x + w / 2, 24 + h / 2, r.t, r.c, 14) + bsT(x + w / 2, 24 + h + 16, bsCm(r.w), r.c, 14) + bsT(x + w + 6, 24 + h / 2, bsCm(r.h), r.c, 14, 'start');
    x += w + (rooms.length > 1 ? 52 : 0);
  });
  s += sk ? bsT(x / 2 + 20, 24 + Math.max(...rooms.map(r => r.h)) * k + 40, `Plan · scale ${sk}`, 'mu', 14) : '';
  return bsSvg(Math.max(x + 60, 320), Math.max(...rooms.map(r => r.h)) * k + 64, s, 'Plan');
}
// pembaris: lukisan d cm (skala, label)
function bsBarFig(d, lab, sk, c = 'am') {
  const k = Math.min(30, 280 / d), w = d * k;
  let s = `<rect x="30" y="40" width="${bsF(w)}" height="22" rx="4" style="fill:var(--${c});fill-opacity:.25;stroke:var(--${c})" stroke-width="2.5"/>`;
  for (let i = 0; i <= Math.floor(d); i++) s += bsL([30 + i * k, 62], [30 + i * k, 72], 'mu', 1.5);
  s += bsT(30 + w / 2, 92, lab, c, 15) + (sk ? bsT(30 + w / 2, 18, sk, 'mu', 14) : '');
  return bsSvg(Math.max(w + 60, 200), 108, s, 'Measurement on the drawing');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 4.1.1 Maksud Lukisan Berskala ---------- */
  nisbah: [
    ({ ob, a, b, a2, b2 }) => ({ q: `A rectangular object measures ${a} cm × ${b} cm. Its scale drawing measures ${bsN(a2)} cm × ${bsN(b2)} cm. State the ratio of measurement of drawing to measurement of object in the simplest form.` }),
    () => ({ q: 'The diagram below shows an object and its scale drawing. Find the ratio of the length of the drawing to the length of the object in the simplest form.' }),
    ({ ob, a, a2 }) => ({ q: `The length of ${ob} is ${a} cm. In a scale drawing, its length is ${bsN(a2)} cm. State the ratio of measurement of drawing to measurement of object.` }),
    ({ a, b, a2, b2, rev, ans }) => { const N = vnama(); return Object.assign({ q: `An object measures ${a} cm × ${b} cm and its scale drawing measures ${bsN(a2)} cm × ${bsN(b2)} cm. ${N} says the ratio of measurement of drawing to measurement of object is ${rev}. Is ${N} correct?` }, salah(N, ans, `${N} wrote the ratio of measurement of object to measurement of drawing. It should be drawing : object.`)); }
  ],
  kali: [
    ({ a, a2, nm }) => ({ q: `The ${nm} side of an object is ${a} cm, while the corresponding side on its scale drawing is ${bsN(a2)} cm. Is the drawing smaller or bigger than the object? Every measurement of the drawing is how many times the measurement of the object?` }),
    ({ a, a2, f }) => ({ q: `Complete: Object ${a} cm, drawing ${bsN(a2)} cm. Every measurement of drawing = ___ × measurement of object.`, ans: f }),
    ({ ob, a, a2 }) => ({ q: `The length of ${ob} is ${a} cm and the length of its scale drawing is ${bsN(a2)} cm. Describe the relationship between the measurement of the drawing and the measurement of the object.` }),
    ({ a, a2 }) => ({ q: `A scale drawing is constructed with a length of ${bsN(a2)} cm for an object with a length of ${a} cm. Is the drawing smaller, bigger or the same size? How many times?` })
  ],
  kenal: [
    () => ({ q: 'The diagram below shows an object and three drawings, A, B and C, on the same grid. Which drawing is the scale drawing of the object?' }),
    () => ({ q: 'Among drawings A, B and C in the diagram below, which one has the same shape as the object, that is the scale drawing of the object?' }),
    ({ X, kt }) => ({ q: 'Identify the scale drawing of the object in the diagram below. Give your reason.', ans: `Drawing ${X}, because each of its sides is ${kt} the corresponding side of the object` }),
    ({ Y, X }) => { const N = vnama(); return Object.assign({ q: `${N} says drawing ${Y} in the diagram below is the scale drawing of the object. Is ${N} correct?` }, salah(N, `Drawing ${X}`, `Drawing ${Y} is stretched differently in the horizontal and vertical directions, so its shape changes.`)); }
  ],
  sisiHilang: [
    ({ ob, a, b, a2 }) => ({ q: `${vcap(ob)} measuring ${a} cm × ${b} cm is drawn as a scale drawing. The length of the drawing is ${bsN(a2)} cm. Calculate the width of the drawing.` }),
    ({ a, b, a2 }) => ({ q: `A rectangle measures ${a} cm × ${b} cm. Its scale drawing has a length of ${bsN(a2)} cm. What is the width of the drawing?` }),
    () => ({ q: 'The diagram below shows an object and its scale drawing. Find the value of x.' }),
    ({ a, b, a2 }) => ({ q: `Complete: Object ${a} cm × ${b} cm → drawing ${bsN(a2)} cm × ___ cm (scale drawing).` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  semak: [
    ({ ob, a, b, a2, b2 }) => ({ q: `${vcap(ob)} measures ${a} cm × ${b} cm. A drawing measures ${bsN(a2)} cm × ${bsN(b2)} cm. Determine whether the drawing is a scale drawing of the object. Show your calculation.` }),
    () => ({ q: 'Based on the measurements in the diagram below, is the drawing a scale drawing of the object? Give a reason.' }),
    ({ a, b, a2, b2 }) => { const N = vnama(); return { q: `${N} draws a rectangle measuring ${bsN(a2)} cm × ${bsN(b2)} cm to represent an object measuring ${a} cm × ${b} cm. Is ${N}'s drawing a scale drawing?` }; },
    ({ a, b, a2, b2 }) => ({ q: `Object: ${a} cm × ${b} cm. Drawing: ${bsN(a2)} cm × ${bsN(b2)} cm. Compare the ratio of the lengths and the ratio of the widths. Is it a scale drawing?` })
  ],
  segitiga: [
    ({ s1, s2, s3, d1 }) => ({ q: `The sides of a triangle are ${s1} cm, ${s2} cm and ${s3} cm. In its scale drawing, the side corresponding to ${s1} cm is ${bsN(d1)} cm. Calculate the lengths of the other two sides of the drawing.` }),
    ({ s1, s2, s3, d1 }) => ({ q: `A triangular signboard has sides of ${s1} cm, ${s2} cm and ${s3} cm. The signboard is drawn so that the ${s1} cm side becomes ${bsN(d1)} cm. Find the lengths of the other sides in the drawing.` }),
    () => ({ q: 'The diagram below shows a triangle object and its scale drawing. Find the value of x and the value of y.' }),
    ({ s1, s2, s3, d1, per }) => ({ q: `A triangle with sides ${s1} cm, ${s2} cm and ${s3} cm is drawn to scale with the ${s1} cm side becoming ${bsN(d1)} cm. Calculate the perimeter of the drawing.`, ans: bsCm(per) })
  ],
  k411: [
    ({ pw, ph, W, H, P2 }) => ({ q: `A photo measuring ${pw} cm × ${ph} cm is enlarged to scale so that its width becomes ${W} cm. (a) Calculate the height of the enlarged photo. (b) Every measurement of the new photo is how many times the original measurement? (c) Calculate the perimeter of the new photo.`, ans: `(a) ${bsCm(H)} (b) ${bsFr(W, pw)} times (c) ${bsCm(P2)}`, work: [`(a) Factor = ${W} ÷ ${pw} = ${bsFr(W, pw)}; height = ${ph} × ${bsFr(W, pw)} = ${bsN(H)} cm`, `(b) Every measurement is multiplied by ${bsFr(W, pw)}`, `(c) Perimeter = 2 × (${W} + ${bsN(H)}) = ${bsN(P2)} cm`] }),
    ({ ra, rb, k, da, db, A1, A2 }) => ({ q: `A rectangle measuring ${ra} cm × ${rb} cm is drawn to scale with every side becoming ${bsFr(k[0], k[1])} times the original side. (a) State the measurements of the drawing. (b) Calculate the area of the object and the area of the drawing. (c) The area of the drawing is how many times the area of the object?`, ans: `(a) ${bsN(da)} cm × ${bsN(db)} cm (b) ${bsCm2(A1)} and ${bsCm2(A2)} (c) ${bsFr(k[0] * k[0], k[1] * k[1])} times`, work: [`(a) ${ra} × ${bsFr(k[0], k[1])} = ${bsN(da)} cm, ${rb} × ${bsFr(k[0], k[1])} = ${bsN(db)} cm`, `(b) Area of object = ${ra} × ${rb} = ${bsN(A1)} cm²; area of drawing = ${bsN(da)} × ${bsN(db)} = ${bsN(A2)} cm²`, `(c) ${bsN(A2)} ÷ ${bsN(A1)} = ${bsFr(k[0] * k[0], k[1] * k[1])}, that is (${bsFr(k[0], k[1])})²`] }),
    ({ X, Y, ta, tb, xa, xb, ya, yb, good, kt }) => ({ q: `A rectangular object measures ${ta} cm × ${tb} cm. Drawing ${X} measures ${bsN(xa)} cm × ${bsN(xb)} cm and drawing ${Y} measures ${bsN(ya)} cm × ${bsN(yb)} cm. (a) Which drawing is the scale drawing of the object? (b) State the ratio of measurement of the drawing to measurement of the object.`, ans: `(a) Drawing ${good} (b) ${kt}`, work: [`${X}: ${bsN(xa)} ÷ ${ta} = ${bsFr(Math.round(xa * 10), ta * 10)}, ${bsN(xb)} ÷ ${tb} = ${bsFr(Math.round(xb * 10), tb * 10)}`, `${Y}: ${bsN(ya)} ÷ ${ta} = ${bsFr(Math.round(ya * 10), ta * 10)}, ${bsN(yb)} ÷ ${tb} = ${bsFr(Math.round(yb * 10), tb * 10)}`, `Only drawing ${good} has the same ratio for the length and the width.`] }),
    ({ s1, s2, s3, dl, k2 }) => {
      const f = bsFr(k2[0], k2[1]), P1 = s1 + s2 + s3, P2 = dl[0] + dl[1] + dl[2];
      return { q: `A triangle has sides of ${s1} cm, ${s2} cm and ${s3} cm. A scale drawing is constructed so that its longest side is ${bsN(dl[2])} cm. (a) Find the lengths of the other two sides. (b) Calculate the perimeter of the object and the perimeter of the drawing. (c) What is the relationship between the two perimeters?`, ans: `(a) ${bsCm(dl[0])} and ${bsCm(dl[1])} (b) ${bsCm(P1)} and ${bsCm(P2)} (c) Perimeter of drawing = ${f} × perimeter of object`, work: [`Factor = ${bsN(dl[2])} ÷ ${s3} = ${f}`, `(a) ${s1} × ${f} = ${bsN(dl[0])} cm, ${s2} × ${f} = ${bsN(dl[1])} cm`, `(b) Object: ${P1} cm; drawing: ${bsN(P2)} cm`, `(c) ${bsN(P2)} ÷ ${P1} = ${f}`] };
    }
  ],

  /* ---------- 4.1.2 Mentafsir Skala ---------- */
  tafsir: [
    ({ n, rt }) => ({ q: `Explain the meaning of the scale ${bsSk(n)}.`, ans: `1 cm on the drawing represents ${rt} on the actual object` }),
    ({ n, ru }) => ({ q: `Complete: The scale ${bsSk(n)} means 1 cm on the drawing represents ___ on the actual object.`, ans: ru }),
    ({ n, ru, ctx }) => ({ q: `A ${ctx} is drawn to a scale of ${bsSk(n)}. What is the actual distance represented by 1 cm on the ${ctx}?`, ans: ru }),
    ({ n, ru }) => ({ q: `On a scale drawing, 1 cm represents ${ru}. Write the scale of the drawing in the form 1 : n.`, ans: bsSk(n), work: (n >= 100 ? [`${ru} = ${bsN(n)} cm`] : []).concat([`Scale = 1 : ${bsN(n)}`]) })
  ],
  jenisSkala: [
    ({ sk }) => ({ q: `A drawing is drawn to a scale of ${sk}. Is the drawing smaller than, bigger than or the same size as the actual object?` }),
    ({ sk, ob }) => ({ q: `${vcap(ob)} is drawn to a scale of ${sk}. State whether the drawing is smaller than, bigger than or the same size as the ${bsBare(ob)}.` }),
    ({ sk }) => ({ q: `The scale of a drawing is ${sk}. What can you say about the size of the drawing compared to the size of the object?` }),
    ({ sk, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says the scale drawing with a scale of ${sk} is ${claim} than the object. Is ${N} correct?` }, salah(N, ans, 'For a scale of 1 : n, n > 1 means smaller, n = 1 means the same size and 0 < n < 1 means bigger.')); }
  ],
  sebenar: [
    ({ d, sk, ctx }) => ({ q: `On a plan with a scale of ${sk}, the length of the ${ctx} is ${bsN(d)} cm. Calculate the actual length of the ${ctx} in metres.` }),
    ({ d, sk }) => ({ q: `A drawing has a scale of ${sk}. A line on the drawing measures ${bsN(d)} cm. What is the actual length that it represents, in metres?` }),
    ({ d, sk }) => ({ q: 'The measurement on the drawing in the diagram below is drawn to a scale of ' + sk + '. Find the actual length in metres.' }),
    ({ d, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `The length of a corridor on a plan with a scale of ${sk} is ${bsN(d)} cm. ${N} says the actual length of the corridor is ${bsN(d * n)} m. Is ${N} correct?` }, salah(N, ans, `${N} forgot to change centimetres to metres: ${bsN(d)} × ${bsN(n)} = ${bsN(d * n)} cm, not ${bsN(d * n)} m.`)); }
  ],
  lukisan: [
    ({ R, sk, ctx }) => ({ q: `The actual length of the ${ctx} is ${bsN(R)} m. Calculate its length on a plan with a scale of ${sk}, in cm.` }),
    ({ R, sk }) => ({ q: `A road ${bsN(R)} m long is drawn to a scale of ${sk}. What is the length of the road on the drawing?` }),
    ({ R, sk }) => ({ q: `Complete: Actual measurement ${bsN(R)} m, scale ${sk}. Measurement of drawing = ___ cm.` }),
    ({ R, sk, ctx }) => ({ q: `An architect draws a ${ctx} with a length of ${bsN(R)} m to a scale of ${sk}. What is the length of the ${ctx} in the architect's drawing?` })
  ],
  cariSkala: [
    ({ dt, rt }) => ({ q: `The length of an object is ${rt} and the length of its drawing is ${dt}. Determine the scale of the drawing in the form 1 : n.` }),
    ({ dt, rt, thing }) => ({ q: `${vcap(thing)} with a length of ${rt} is drawn with a length of ${dt}. What is the scale of the drawing?` }),
    ({ dt, rt }) => ({ q: `Complete: A drawing of ${dt} represents ${rt}. Scale = 1 : ___` }),
    ({ dt, rt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `A drawing of ${dt} represents an actual measurement of ${rt}. ${N} writes the scale as ${wrong}. Is ${N} correct?` }, salah(N, ans, `${N} did not change both measurements to the same unit.`)); }
  ],
  peta: [
    ({ d, sk, A, B }) => ({ q: `The distance between ${A} and ${B} on a map with a scale of ${sk} is ${bsN(d)} cm. Calculate the actual distance in km.` }),
    ({ d, sk }) => ({ q: `On a map with a scale of ${sk}, the length of a river is ${bsN(d)} cm. What is the actual length of the river, in km?` }),
    ({ km, sk, A, B }) => ({ q: `The actual distance between ${A} and ${B} is ${bsN(km)} km. What is the distance on a map with a scale of ${sk}?` }),
    () => ({ q: 'The diagram below shows two places on a map. Calculate the actual distance between the two places in km.' })
  ],
  besar: [
    ({ ob, ukur, sk, d }) => ({ q: `The drawing of ${bsPj(ob)} ${ob} in a book is enlarged to a scale of ${sk}. The ${ukur} of the ${ob} on the drawing is ${bsN(d)} cm. Calculate the actual ${ukur} of the ${ob}.` }),
    ({ ob, ukur, sk, R }) => ({ q: `The actual ${ukur} of a type of ${ob} is ${bsN(R)} cm. The ${ob} is drawn to a scale of ${sk}. What is its ${ukur} on the drawing?` }),
    ({ ob, ukur, d, R }) => ({ q: `The ${ukur} of the ${ob} is ${bsN(R)} cm, but its ${ukur} in the drawing is ${bsN(d)} cm. Determine the scale of the drawing.` })
  ],
  k412: [
    ({ A, B, n1, d1, d2, n2 }) => ({ q: `The distance between ${A} and ${B} is ${bsN(d1)} cm on a map with a scale of ${bsSk(n1)}. On a second map, the same distance is ${bsN(d2)} cm. (a) Calculate the actual distance in km. (b) Find the scale of the second map.`, ans: `(a) ${bsKm(d1 * n1 / 100000)} (b) ${bsSk(n2)}`, work: [`(a) ${bsN(d1)} × ${bsN(n1)} = ${bsN(d1 * n1)} cm = ${bsN(d1 * n1 / 100000)} km`, `(b) ${bsN(d2)} : ${bsN(d1 * n1)}`, `= 1 : ${bsN(n2)}`] }),
    ({ Lr, Ld, n, Wd, Wr }) => ({ q: `The actual length of a hall is ${bsN(Lr)} m and its length on the plan is ${bsN(Ld)} cm. (a) Find the scale of the plan. (b) The width of the hall on the plan is ${bsN(Wd)} cm. Calculate the actual width of the hall. (c) Calculate the actual area of the floor of the hall.`, ans: `(a) ${bsSk(n)} (b) ${bsM(Wr)} (c) ${bsM2(Lr * Wr)}`, work: [`(a) ${bsN(Lr)} m = ${bsN(Lr * 100)} cm; ${bsN(Ld)} : ${bsN(Lr * 100)} = 1 : ${bsN(n)}`, `(b) ${bsN(Wd)} × ${bsN(n)} = ${bsN(Wd * n)} cm = ${bsN(Wr)} m`, `(c) Area = ${bsN(Lr)} × ${bsN(Wr)} = ${bsN(Lr * Wr)} m²`] }),
    ({ a, km, nn, dd, Rr }) => ({ q: `The scale of a map is written as "${a} cm represents ${km} km". (a) Write the scale of the map in the form 1 : n. (b) The distance between two towns on the map is ${bsN(dd)} cm. Calculate the actual distance.`, ans: `(a) ${bsSk(nn)} (b) ${bsKm(Rr)}`, work: [`(a) ${km} km = ${bsN(km * 100000)} cm; ${a} : ${bsN(km * 100000)} = 1 : ${bsN(nn)}`, `(b) ${bsN(dd)} × ${bsN(nn)} = ${bsN(dd * nn)} cm = ${bsN(Rr)} km`] }),
    ({ ob, q1, e1, Re, q2, e2 }) => ({ q: `The drawing of ${bsPj(ob)} ${ob} is enlarged to a scale of 1 : 1/${q1}. The length of the ${ob} on the drawing is ${bsN(e1)} cm. (a) Calculate the actual length of the ${ob}. (b) If the same ${ob} is drawn to a scale of 1 : 1/${q2}, what is its length on the new drawing?`, ans: `(a) ${bsCm(Re)} (b) ${bsCm(e2)}`, work: [`(a) Actual measurement = ${bsN(e1)} × 1/${q1} = ${bsN(Re)} cm`, `(b) Measurement of drawing = ${bsN(Re)} ÷ 1/${q2} = ${bsN(Re)} × ${q2} = ${bsN(e2)} cm`] })
  ],

  /* ---------- 4.1.3 Melukis Lukisan Berskala ---------- */
  lukis: [
    ({ L, sk }) => ({ q: `The diagram below shows object ${L} drawn on a grid of equal squares with sides of 1 cm. On the grid provided, draw the scale drawing of object ${L} using a scale of ${sk}.` }),
    ({ L, sk }) => ({ q: `Object ${L} is drawn on a 1 cm grid. Redraw object ${L} on the blank grid using a scale of ${sk}.` }),
    ({ L, sk, nm }) => ({ q: `The diagram below shows object ${L} (shape: ${nm}) on a 1 cm grid. Using a scale of ${sk}, draw the scale drawing of ${L} on the grid beside it.` })
  ],
  ukuranLukisan: [
    ({ tp, L, W, sk }) => ({ q: `A rectangular ${tp} measures ${bsN(L)} m × ${bsN(W)} m. Calculate its length and width on a scale drawing with a scale of ${sk}.` }),
    ({ tp, L, W, sk }) => ({ q: `The plan of a ${tp} measuring ${bsN(L)} m × ${bsN(W)} m is to be drawn to a scale of ${sk}. What are the measurements of the ${tp} on the plan?` }),
    ({ tp, L, W, sk }) => ({ q: `Complete: ${vcap(tp)} ${bsN(L)} m × ${bsN(W)} m, scale ${sk} → drawing ___ cm × ___ cm.` }),
    ({ tp, L, W, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} draws a ${tp} measuring ${bsN(L)} m × ${bsN(W)} m to a scale of ${sk}. ${N} calculates the length of the drawing as ${bsN(L)} ÷ ${bsN(n)} = ${bsN(L / n)} cm. Is ${N} correct?` }, salah(N, ans, `${N} did not change metres to centimetres before dividing by n.`)); }
  ],
  bacaGrid: [
    ({ sk, P1, P2 }) => ({ q: `The diagram below shows the plan of a piece of land drawn on a grid of 1 cm squares to a scale of ${sk}. Calculate the actual length of side ${P1}${P2} in metres.` }),
    ({ sk, P1, P2 }) => ({ q: `The plan in the diagram below is drawn on a 1 cm grid to a scale of ${sk}. What is the actual length of fence ${P1}${P2}?` }),
    ({ sk, P1, P2 }) => ({ q: `Based on the scale drawing with a scale of ${sk} on the 1 cm grid below, find the actual distance from ${P1} to ${P2}.` })
  ],
  gridBeza: [
    ({ a, b }) => ({ q: `An object is drawn on a grid of equal squares with sides of ${bsN(a)} cm. Its scale drawing is drawn on a grid with sides of ${bsN(b)} cm with the same number of squares. Find the scale of the drawing.` }),
    () => ({ q: 'The diagram below shows an object and its drawing. Both shapes have the same number of squares. Find the scale of the drawing.' }),
    ({ a, b }) => ({ q: `Complete: Object on a ${bsN(a)} cm grid, drawing on a ${bsN(b)} cm grid (same number of squares). Scale = ___` }),
    ({ a, b, ans }) => { const N = vnama(); return Object.assign({ q: `An object on a grid with sides of ${bsN(a)} cm is copied onto a grid with sides of ${bsN(b)} cm with the same number of squares. ${N} says the scale is ${bsSk(b, a)}. Is ${N} correct?` }, salah(N, ans, `${N} wrote the ratio actual : drawing. Scale = grid size of scale drawing : grid size of object.`)); }
  ],
  bentukL: [
    ({ a, b, c, d, sk }) => ({ q: `A piece of land is L-shaped. Four of its sides are ${bsN(a)} m, ${bsN(b)} m, ${bsN(c)} m and ${bsN(d)} m. Calculate the length of each side on a plan with a scale of ${sk}.` }),
    ({ sk }) => ({ q: `The diagram below shows the actual measurements of an L-shaped piece of land. Calculate the measurements of the labelled sides on a scale drawing with a scale of ${sk}.` }),
    ({ a, b, c, d, sk }) => ({ q: `An L-shaped house lot has sides of ${bsN(a)} m, ${bsN(b)} m, ${bsN(c)} m and ${bsN(d)} m. A draughtsman uses a scale of ${sk}. List the measurements of the four sides on the plan.` })
  ],
  k413: [
    ({ sk, n, P, A }) => ({ q: `The diagram below shows the plan of an L-shaped piece of land drawn on a 1 cm grid to a scale of ${sk}. (a) Calculate the actual perimeter of the land. (b) Calculate the actual area of the land.`, ans: `(a) ${bsM(P)} (b) ${bsM2(A)}` }),
    ({ L, W, n1, n2, L2, W2, RL, RW }) => ({ q: `A rectangle measuring ${bsN(L)} cm × ${bsN(W)} cm is the drawing of a court with a scale of ${bsSk(n1)}. (a) Calculate the actual measurements of the court. (b) The court is redrawn to a scale of ${bsSk(n2)}. State the measurements of the new drawing.`, ans: `(a) ${bsN(RL)} m × ${bsN(RW)} m (b) ${bsN(L2)} cm × ${bsN(W2)} cm`, work: [`(a) ${bsN(L)} × ${bsN(n1)} = ${bsN(L * n1)} cm = ${bsN(RL)} m; ${bsN(W)} × ${bsN(n1)} = ${bsN(W * n1)} cm = ${bsN(RW)} m`, `(b) ${bsN(L * n1)} ÷ ${bsN(n2)} = ${bsN(L2)} cm; ${bsN(W * n1)} ÷ ${bsN(n2)} = ${bsN(W2)} cm`] }),
    ({ a, b, w, h, k, A1, A2, sk3: sk }) => ({ q: `A rectangular object of ${w} squares × ${h} squares is drawn on a grid with sides of ${bsN(a)} cm. The object is copied onto a grid with sides of ${bsN(b)} cm with the same number of squares. (a) Find the scale of the drawing. (b) Calculate the area of the object and the area of the drawing. (c) The area of the drawing is how many times the area of the object?`, ans: `(a) ${sk} (b) ${bsCm2(A1)} and ${bsCm2(A2)} (c) ${k} times`, work: [`(a) Scale = grid size of scale drawing : grid size of object = ${bsN(b)} : ${bsN(a)}${`${bsN(b)} : ${bsN(a)}` === sk ? '' : ` = ${sk}`}`, `(b) Object: ${bsN(w * a)} × ${bsN(h * a)} = ${bsN(A1)} cm²; drawing: ${bsN(w * b)} × ${bsN(h * b)} = ${bsN(A2)} cm²`, `(c) ${bsN(A2)} ÷ ${bsN(A1)} = ${k}`] })
  ],

  /* ---------- 4.1.4 Penyelesaian Masalah ---------- */
  luasBilik: [
    ({ bl, l, w, sk }) => ({ q: `On a plan with a scale of ${sk}, a rectangular ${bl} measures ${bsN(l)} cm × ${bsN(w)} cm. Calculate the actual area of the ${bl} in m².` }),
    ({ bl, sk }) => ({ q: `The diagram below shows the plan of a ${bl} with a scale of ${sk}. What is the actual floor area of the ${bl}?` }),
    ({ bl, l, w, sk }) => ({ q: `Encik Rahman looks at the plan of his new house with a scale of ${sk}. The ${bl} measures ${bsN(l)} cm × ${bsN(w)} cm on the plan. What is the actual area of the ${bl}?` }),
    ({ bl, l, w, sk, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `A ${bl} measures ${bsN(l)} cm × ${bsN(w)} cm on a plan with a scale of ${sk}. ${N} says its actual area is ${wrong}. Is ${N} correct?` }, salah(N, ans, `${N} only multiplied the area on the plan by n. Find the actual length and width first, then multiply.`)); }
  ],
  laluan: [
    ({ A, B, C, d1, d2, sk }) => ({ q: `On a map with a scale of ${sk}, the distance from ${A} to ${C} is ${bsN(d1)} cm and from ${C} to ${B} is ${bsN(d2)} cm. Calculate the total actual distance of the journey from ${A} to ${B} via ${C}, in km.` }),
    ({ A, B, C, sk }) => ({ q: `The diagram below shows the route from ${A} to ${B} via ${C} on a map with a scale of ${sk}. What is the total actual distance of the route?` }),
    ({ A, B, C, d1, d2, sk }) => ({ q: `A bus travels from ${A} to ${C}, then to ${B}. On a map with a scale of ${sk}, the two parts of the route are ${bsN(d1)} cm and ${bsN(d2)} cm. How far does the bus travel?` })
  ],
  model: [
    ({ thing, ml, R }) => ({ q: `The length of a model ${thing} is ${bsN(ml)} cm, while the length of the actual ${thing} is ${bsN(R)} m. Find the scale of the model.` }),
    ({ thing, n, R }) => ({ q: `A model ${thing} is built to a scale of ${bsSk(n)}. If the length of the actual ${thing} is ${bsN(R)} m, what is the length of the model?` }),
    ({ thing, n, ml }) => ({ q: `A model ${thing} with a scale of ${bsSk(n)} is ${bsN(ml)} cm long. Calculate the length of the actual ${thing} in metres.` })
  ],
  luasN: [
    ({ Ad, sk }) => ({ q: `The area of a garden on a scale drawing with a scale of ${sk} is ${bsN(Ad)} cm². Calculate the actual area of the garden in m².` }),
    ({ Ad, sk, tp }) => ({ q: `On a plan with a scale of ${sk}, the area of the ${tp} is ${bsN(Ad)} cm². What is the actual area of the ${tp}?` }),
    ({ Ar, sk, tp }) => ({ q: `The actual area of the ${tp} is ${bsN(Ar)} m². What is its area on a plan with a scale of ${sk}, in cm²?` }),
    ({ Ad, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `The area of a region on a plan with a scale of ${sk} is ${bsN(Ad)} cm². ${N} says its actual area is ${bsN(Ad * n)} cm². Is ${N} correct?` }, salah(N, ans, `${N} only multiplied by n. For area, multiply by n².`)); }
  ],
  kos: [
    ({ bl, l, w, sk, h, A }) => ({ q: `A ${bl} measures ${bsN(l)} cm × ${bsN(w)} cm on a plan with a scale of ${sk}. The cost of laying carpet is RM${h} per square metre. Calculate the cost of laying carpet on the whole floor of the ${bl}.` }),
    ({ tp, l, w, sk, h }) => ({ q: `A ${tp} measures ${bsN(l)} cm × ${bsN(w)} cm on a plan with a scale of ${sk}. A fence will be built around the ${tp} at a cost of RM${h} per metre. What is the cost of fencing?`, per: true }),
    ({ bl, l, w, sk, h }) => ({ q: `A plan with a scale of ${sk} shows the floor of a ${bl} measuring ${bsN(l)} cm × ${bsN(w)} cm. If the price of tiles is RM${h} per square metre, what is the cost of tiles for the floor?` })
  ],
  masa: [
    ({ A, B, d, sk, v }) => ({ q: `The distance from ${A} to ${B} on a map with a scale of ${sk} is ${bsN(d)} cm. A car travels at an average speed of ${v} km/h. What is the time taken, in minutes?` }),
    ({ A, B, d, sk, v }) => ({ q: `On a map with a scale of ${sk}, the length of the road from ${A} to ${B} is ${bsN(d)} cm. Puan Lim rides a motorcycle at a speed of ${v} km/h. Calculate the time of her journey in minutes.` }),
    ({ A, B, d, sk, t }) => ({ q: `The distance from ${A} to ${B} on a map with a scale of ${sk} is ${bsN(d)} cm. A bus takes ${t} minutes for the journey. Calculate the average speed of the bus in km/h.`, inv: true })
  ],
  k414: [
    ({ sk, n, r1, r2, h }) => ({ q: `The plan of a house is drawn to a scale of ${sk}. The ${r1.t} measures ${bsN(r1.l)} cm × ${bsN(r1.w)} cm and the ${r2.t} measures ${bsN(r2.l)} cm × ${bsN(r2.w)} cm on the plan. (a) Calculate the actual area of each room. (b) The cost of laying vinyl flooring is RM${h} per square metre. Calculate the total cost for both rooms.` }),
    ({ sk, A, B, C, d1, d2, d3, v }) => ({ q: `On a map with a scale of ${sk}, the first route from ${A} to ${B} is a straight road ${bsN(d1)} cm long. The second route goes via ${C}: ${bsN(d2)} cm and ${bsN(d3)} cm. (a) Calculate the actual distance of each route. (b) If the average speed is ${v} km/h, how many minutes can be saved by choosing the shorter route?` }),
    ({ sk, l, w, g, h }) => ({ q: `A rectangular garden measures ${bsN(l)} cm × ${bsN(w)} cm on a plan with a scale of ${sk}. A fence will be built around the garden except for a gate ${bsN(g)} m wide. (a) Calculate the actual perimeter of the garden. (b) The cost of the fence is RM${h} per metre. Calculate the cost of building the fence.` })
  ]
};

/* =================== pembina soalan (r = bsRG atau bsRW) =================== */
const BS = {};
// faktor lukisan k = [p, q] (lukisan = objek × p/q)
const BSK_KECIL = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4]], BSK_BESAR = [[2, 1], [3, 1], [3, 2], [4, 1], [5, 2]];
const bsKtxt = ([p, q]) => (q === 1 ? `${p} times` : `${p}/${q} times`);
const bsRatio = ([p, q]) => `${p} : ${q}`;    // lukisan : objek, termudah
// objek a × b (integer) dengan faktor k menghasilkan lukisan kemas (≤ 1 t.p.)
function bsPair(r, big) {
  let k, a, b, a2, b2;
  do {
    k = r.p(big == null ? (r.f() < .7 ? BSK_KECIL : BSK_BESAR) : big ? BSK_BESAR : BSK_KECIL);
    a = r.i(2, big ? 9 : 30); b = r.i(2, big ? 8 : 24); a2 = a * k[0] / k[1]; b2 = b * k[0] / k[1];
  } while (a === b || a < b || a > 3 * b || !bsTidy(a2, 1) || !bsTidy(b2, 1) || a2 > 40);
  return { k, a, b, a2, b2 };
}
/* ---------- 4.1.1 ---------- */
BS.nisbah = (r, big) => {
  const { k, a, b, a2, b2 } = bsPair(r, big), ob = r.p(BSOBJ), ans = bsRatio(k), rev = bsRatio([k[1], k[0]]);
  const work = [`Drawing : object = ${bsN(a2)} : ${a}`, `= ${bsRatio(k)} (divide by the common factor)`, `Check the width: ${bsN(b2)} : ${b} = ${bsRatio(k)}`];
  return GEN_LQ('nisbah', { ob, a, b, a2, b2, rev, ans, work }, { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Object', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Drawing', wl: bsCm(a2), hl: bsCm(b2) }], 'Object and scale drawing') });
};
BS.kali = r => {
  const { k, a, a2 } = bsPair(r), ob = r.p(BSOBJ), nm = r.p(['longest', 'base', 'top', 'left']);
  const small = k[0] < k[1], ans = `${small ? 'Smaller' : 'Bigger'}; every measurement of drawing = ${bsKtxt(k)} the measurement of object`;
  return GEN_LQ('kali', { a, a2, ob, nm, f: bsFr(k[0], k[1]), ans, work: [`${bsN(a2)} ÷ ${a} = ${bsFr(k[0], k[1])}`, small ? `${bsFr(k[0], k[1])} < 1, thus the drawing is smaller.` : `${bsFr(k[0], k[1])} > 1, thus the drawing is bigger.`] });
};
// objek + tiga calon (satu berskala, dua diregang)
function bsKenalData(r) {
  for (;;) {
    const sh = r.p(BSHAPE), kc = r.p([1, 3]), kd = r.p([1, 2, 3].filter(x => x !== kc));
    const W = Math.max(...sh.p.map(p => p[0])), H = Math.max(...sh.p.map(p => p[1])), ar = W / H;
    const st = [[kc, kc], [kc, kd], [kd, kc]];
    // calon diregang tidak boleh sebentuk (nisbah kotak sama atau songsang)
    if (st.slice(1).some(([sx, sy]) => { const a2 = (W * sx) / (H * sy); return Math.abs(a2 - ar) < 1e-9 || Math.abs(a2 - 1 / ar) < 1e-9; })) continue;
    const order = bsShuf(r, [0, 1, 2]), L = ['A', 'B', 'C'];
    const X = L[order.indexOf(0)], Y = L[order.indexOf(r.p([1, 2]))];
    const cell = 13, mk = ([sx, sy], c, t) => ({ cols: W * 3 + 2, rows: H * 3 + 2, cell, title: t, tc: c, shapes: [{ pts: sh.p.map(([i, j]) => [i * sx, j * sy]), c, ox: 1, oy: 1 }], gap: 18 });
    const panels = [Object.assign(mk([2, 2], 'tr', 'Object'), { gap: 30 })].concat(order.map((o, i) => mk(st[o], 'am', L[i])));
    return { sh, kc, X, Y, kt: bsKtxt([kc, 2]), fig: bsGridFig(panels, 'Object and three drawings A, B and C') };
  }
}
BS.kenal = r => {
  const d = bsKenalData(r);
  return GEN_LQ('kenal', { X: d.X, Y: d.Y, kt: d.kt, ans: `Drawing ${d.X}`, work: [`Drawing ${d.X}: every side = ${d.kt} the corresponding side of the object, so the shape is the same.`, 'The other two drawings are stretched differently in the horizontal and vertical directions, so their shapes change.'] }, { fig: d.fig });
};
BS.sisiHilang = r => {
  const { k, a, b, a2, b2 } = bsPair(r), ob = r.p(BSOBJ);
  return GEN_LQ('sisiHilang', { ob, a, b, a2, ans: bsCm(b2), work: [`Factor = ${bsN(a2)} ÷ ${a} = ${bsFr(k[0], k[1])}`, `Width of drawing = ${b} × ${bsFr(k[0], k[1])} = ${bsN(b2)} cm`] },
    { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Object', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Drawing', wl: bsCm(a2), hl: 'x cm' }], 'Object and drawing with side x') });
};
BS.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
BS.semak = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  let { k, a, b, a2, b2 } = bsPair(r), ob = r.p(BSOBJ);
  if (!yes) { const d = r.p([1, 2, -1]); b2 = b2 + d > 0 && b2 + d !== b2 ? b2 + d : b2 + 1; }
  const ra = a2 / a, rb = b2 / b, same = Math.abs(ra - rb) < 1e-9;
  const ans = same ? `Yes, because the ratio of the lengths and the ratio of the widths are the same (${bsRatio(k)})` : `No, because the ratio of the lengths (${bsFr(Math.round(a2 * 10), a * 10)}) is not the same as the ratio of the widths (${bsFr(Math.round(b2 * 10), b * 10)})`;
  return GEN_LQ('semak', { ob, a, b, a2, b2, ans, work: [`Length: ${bsN(a2)} ÷ ${a} = ${bsFr(Math.round(a2 * 10), a * 10)}`, `Width: ${bsN(b2)} ÷ ${b} = ${bsFr(Math.round(b2 * 10), b * 10)}`, same ? 'Both ratios are the same, thus it is a scale drawing.' : 'The ratios are different, thus the shape changes and the drawing is not a scale drawing.'] },
    { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Object', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Drawing', wl: bsCm(a2), hl: bsCm(b2) }], 'Object and drawing') });
};
const BSTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 6, 8], [6, 9, 12], [8, 10, 14], [9, 12, 15], [10, 12, 16], [4, 5, 6]];
BS.segitiga = r => {
  let t, k, d; do { t = r.p(BSTRI); k = r.p(BSK_KECIL.concat(BSK_BESAR)); d = t.map(x => x * k[0] / k[1]); } while (!d.every(x => bsTidy(x, 1)) || d[2] > 40);
  const [s1, s2, s3] = t, per = d[0] + d[1] + d[2];
  // rajah: segi tiga objek & lukisan (bentuk lebih kurang)
  const tri = (x0, sc, c, l) => {
    const A = [x0, 150], Bp = [x0 + s3 * sc, 150], ca = (s2 * s2 + s3 * s3 - s1 * s1) / (2 * s2 * s3), sa = Math.sqrt(1 - ca * ca), Cp = [x0 + s2 * sc * ca, 150 - s2 * sc * sa];
    return `<polygon points="${[A, Bp, Cp].map(p => bsF(p[0]) + ',' + bsF(p[1])).join(' ')}" style="fill:var(--${c});fill-opacity:.18;stroke:var(--${c})" stroke-width="3" stroke-linejoin="round"/>`
      + bsT((A[0] + Bp[0]) / 2, 166, l[2], c, 14) + bsT((A[0] + Cp[0]) / 2 - 10, (A[1] + Cp[1]) / 2, l[1], c, 14, 'end') + bsT((Bp[0] + Cp[0]) / 2 + 10, (Bp[1] + Cp[1]) / 2, l[0], c, 14, 'start');
  };
  const f = k[0] / k[1], so = f > 1 ? 120 / s3 / Math.min(f, 1.5) : 120 / s3, sd = so * Math.max(.55, Math.min(1.5, f));
  const fig = bsSvg(420, 180, bsT(100, 14, 'Object', 'tr', 15) + bsT(320, 14, 'Drawing', 'am', 15) + tri(40, so, 'tr', [bsCm(s1), bsCm(s2), bsCm(s3)]) + tri(250, sd, 'am', [bsCm(d[0]), 'x cm', 'y cm']), 'Triangle object and drawing');
  return GEN_LQ('segitiga', { s1, s2, s3, d1: d[0], per, ans: `${bsCm(d[1])} and ${bsCm(d[2])}`, work: [`Factor = ${bsN(d[0])} ÷ ${s1} = ${bsFr(k[0], k[1])}`, `${s2} × ${bsFr(k[0], k[1])} = ${bsN(d[1])} cm`, `${s3} × ${bsFr(k[0], k[1])} = ${bsN(d[2])} cm`].concat([`(Perimeter of drawing = ${bsN(per)} cm)`]) }, { fig });
};
BS.k411 = (r, v) => {
  let pw, ph, W; do { pw = r.p([4, 5, 6, 8, 10, 12, 15]); ph = r.p([3, 4, 6, 8, 9, 10]); W = pw * r.p([2, 3, 4, 1.5, 2.5]); } while (pw === ph || !Number.isInteger(W) || !bsTidy(ph * W / pw, 1));
  const H = ph * W / pw, P2 = 2 * (W + H);
  const kk = r.p([[1, 2], [2, 1], [3, 1], [1, 3], [3, 2]]); let ra, rb; do { ra = r.i(4, 15); rb = r.i(3, 12); } while (ra === rb || !bsTidy(ra * kk[0] / kk[1], 1) || !bsTidy(rb * kk[0] / kk[1], 1));
  const da = ra * kk[0] / kk[1], db = rb * kk[0] / kk[1];
  const { k, a: ta, b: tb, a2: xa0, b2: xb0 } = bsPair(r), good = r.f() < .5 ? 'P' : 'Q';
  const bad = [xa0, xb0 + (xb0 > 2 ? -1 : 1)];
  const [xa, xb] = good === 'P' ? [xa0, xb0] : bad, [ya, yb] = good === 'P' ? bad : [xa0, xb0];
  let t, kt2, dl; do { t = r.p(BSTRI); kt2 = r.p([[1, 2], [2, 1], [3, 1], [3, 2], [5, 2]]); dl = t.map(x => x * kt2[0] / kt2[1]); } while (!dl.every(x => bsTidy(x, 1)));
  return GEN_LQ('k411', { pw, ph, W, H, P2, ra, rb, k: kk, da, db, A1: ra * rb, A2: da * db, X: 'P', Y: 'Q', ta, tb, xa, xb, ya, yb, good, kt: bsRatio(k), s1: t[0], s2: t[1], s3: t[2], dl, k2: kt2 });
};
/* ---------- 4.1.2 ---------- */
const BSN_PELAN = [20, 25, 40, 50, 80, 100, 200, 250, 300, 400, 500, 1000];
const BSN_PETA = [10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000];
const bsRu = n => (n >= 100000 ? `${bsN(n / 100000)} km` : n >= 100 ? `${bsN(n / 100)} m` : `${bsN(n)} cm`);
BS.tafsir = r => {
  const n = r.p(BSN_PELAN.concat(BSN_PETA)), ctx = n >= 10000 ? 'map' : r.p(['plan', 'drawing']);
  return GEN_LQ('tafsir', { n, rt: bsReal(n), ru: bsRu(n), ctx, ans: bsRu(n), work: [`Scale ${bsSk(n)}: 1 cm represents ${bsN(n)} cm`, `${bsReal(n)}`] });
};
const BSSK_J = [[[40, 1], 'k'], [[200, 1], 'k'], [[5, 1], 'k'], [[1, 1], 's'], [[1, 2], 'b'], [[1, 3], 'b'], [[1, 4], 'b'], [[1, 10], 'b'], [[3, 2], 'k'], [[2, 5], 'b']];
const BSJ_TXT = { k: ['Smaller', 'smaller'], s: ['The same size', 'the same size'], b: ['Bigger', 'bigger'] };
BS.jenisSkala = (r, k) => {
  const [[a, b], j] = k == null ? r.p(BSSK_J) : BSSK_J[k % BSSK_J.length], sk = bsSk(a, b), ob = r.p(BSOBJ.concat(['a butterfly', 'a building']));
  const claim = j === 'k' ? 'bigger' : 'smaller', nv = bsFr(a, b);
  const ans = j === 'k' ? `${BSJ_TXT.k[0]}, because n = ${nv} > 1` : j === 's' ? `${BSJ_TXT.s[0]}, because n = 1` : `${BSJ_TXT.b[0]}, because 0 < n = ${nv} < 1`;
  return GEN_LQ('jenisSkala', { sk, ob, claim, ans, work: [`n = ${nv}`, j === 'k' ? 'n > 1: measurement of drawing = actual measurement ÷ n, smaller.' : j === 's' ? 'n = 1: measurement of drawing = actual measurement.' : `0 < n < 1: measurement of drawing = actual measurement × ${bsFr(b, a)}, bigger.`] });
};
BS.sebenar = r => {
  let n, d; do { n = r.p(BSN_PELAN); d = r.p([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 1.5, 2.5, 3.5, 4.5, 6.5, 7.5]); } while (!bsTidy(d * n / 100, 2));
  const R = d * n / 100, ctx = r.p(['hall', 'corridor', 'field', 'swimming pool', 'classroom', 'canteen']);
  return GEN_LQ('sebenar', { d, n, sk: bsSk(n), ctx, ans: bsM(R), work: [`Actual measurement = measurement of drawing × n`, `= ${bsN(d)} × ${bsN(n)} = ${bsN(d * n)} cm`, `= ${bsN(R)} m`] }, { fig: bsBarFig(d, bsCm(d), `Scale ${bsSk(n)}`) });
};
BS.lukisan = r => {
  let n, d; do { n = r.p(BSN_PELAN); d = r.p([2, 3, 4, 5, 6, 8, 10, 12, 1.5, 2.5, 4.5, 7.5]); } while (!bsTidy(d * n / 100, 2) || d * n / 100 < 1);
  const R = d * n / 100, ctx = r.p(['hall', 'fence', 'wall', 'balcony', 'small bridge', 'track']);
  return GEN_LQ('lukisan', { R, n, sk: bsSk(n), ctx, ans: bsCm(d), work: [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Measurement of drawing = actual measurement ÷ n = ${bsN(R * 100)} ÷ ${bsN(n)}`, `= ${bsN(d)} cm`] });
};
BS.cariSkala = (r, kind) => {
  kind = kind || r.p(['m', 'm', 'km', 'besar']);
  let dcm, rcm, dt, rt, thing, wrong;
  if (kind === 'm') { const n = r.p(BSN_PELAN); dcm = r.p([2, 4, 5, 6, 8, 10, 12, 15]); rcm = dcm * n; if (!bsTidy(rcm / 100, 2)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsM(rcm / 100); thing = r.p(['a bus', 'a hall', 'a boat', 'a pole', 'a container']); wrong = bsSk(rcm / 100, dcm); }
  else if (kind === 'km') { const n = r.p(BSN_PETA); dcm = r.p([2, 3, 4, 5, 6, 8]); rcm = dcm * n; if (!bsTidy(rcm / 100000, 2)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsKm(rcm / 100000); thing = 'the distance between two towns'; wrong = bsSk(rcm / 100000, dcm); }
  else { const q = r.p([2, 4, 5, 8, 10]); rcm = r.p([0.5, 0.8, 1.2, 1.5, 2, 2.5]); dcm = rcm * q; if (!bsTidy(dcm, 1)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsCm(rcm); thing = r.p(['an ant', 'a beetle', 'a button']); wrong = bsSk(q, 1); }
  const g = 1, num = Math.round(rcm * 10), den = Math.round(dcm * 10), ans = bsSk(num, den);
  const work = [kind === 'm' ? `${rt} = ${bsN(rcm)} cm` : kind === 'km' ? `${rt} = ${bsN(rcm)} cm` : 'Both measurements are already in cm.', `Scale = ${bsN(dcm)} : ${bsN(rcm)}`, `= 1 : ${bsN(rcm)} ÷ ${bsN(dcm)} = ${ans}`];
  return GEN_LQ('cariSkala', { dt, rt, thing, wrong: wrong === ans ? bsSk(num * 10, den) : wrong, ans, work });
};
BS.peta = r => {
  let n, d; do { n = r.p(BSN_PETA); d = r.p([2, 3, 4, 5, 6, 8, 2.5, 3.5, 4.5, 7.5, 1.5]); } while (!bsTidy(d * n / 100000, 2));
  const km = d * n / 100000, [A, B] = r.p(BSTEMPAT), sk = bsSk(n);
  const work = [`1 cm represents ${bsN(n)} cm = ${bsN(n / 100000)} km`, `Actual distance = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`];
  const o = GEN_LQ('peta', { d, n, km, sk, A, B, ans: bsKm(km), work }, { fig: bsMapFig(A, B, bsCm(d), sk) });
  if (o.q.startsWith('The actual distance between')) { o.ans = bsCm(d); o.work = [`${bsN(km)} km = ${bsN(km * 100000)} cm`, `Distance on the map = ${bsN(km * 100000)} ÷ ${bsN(n)} = ${bsN(d)} cm`]; o.fig = bsMapFig(A, B, '? cm', sk); }
  return o;
};
BS.besar = r => {
  let q, R, d; do { q = r.p([2, 3, 4, 5, 8, 10]); R = r.p([0.5, 0.6, 0.8, 1.2, 1.5, 2, 2.5, 3]); d = R * q; } while (!bsTidy(d, 1) || d > 20);
  const [ob, ukur] = r.p(BSKECIL), sk = bsSk(1, q);
  const o = GEN_LQ('besar', { ob, ukur, sk, d, R, ans: bsCm(R), work: [`Scale ${sk}: actual measurement = measurement of drawing × 1/${q}`, `= ${bsN(d)} ÷ ${q} = ${bsN(R)} cm`] });
  if (o.q.includes('of a type of ' + ob + ' is')) { o.ans = bsCm(d); o.work = [`Measurement of drawing = actual measurement ÷ 1/${q} = actual measurement × ${q}`, `= ${bsN(R)} × ${q} = ${bsN(d)} cm`]; }
  else if (o.q.includes('Determine the scale')) { o.ans = sk; o.work = [`Scale = ${bsN(d)} : ${bsN(R)}`, `= 1 : ${bsN(R)}/${bsN(d)} = ${sk}`]; }
  return o;
};
BS.k412 = r => {
  const [A, B] = r.p(BSTEMPAT);
  let n1, d1, n2, d2; do { n1 = r.p([50000, 100000, 200000, 250000]); d1 = r.p([3, 4, 5, 6, 8, 2.5, 4.5]); d2 = d1 * r.p([2, 0.5, 4, 2.5]); n2 = d1 * n1 / d2; } while (!bsTidy(d1 * n1 / 100000, 2) || !Number.isInteger(n2) || !bsTidy(d2, 1));
  let n, Ld, Wd; do { n = r.p([100, 200, 250, 400, 500]); Ld = r.p([6, 8, 9, 10, 12, 7.5]); Wd = r.p([3, 4, 5, 6, 4.5, 2.5]); } while (Wd >= Ld || !bsTidy(Ld * n / 100, 2) || !bsTidy(Wd * n / 100, 2));
  let a, km, d; do { a = r.p([2, 4, 5]); km = r.p([1, 3, 5, 10, 15]); d = r.p([3, 6, 7, 8, 9, 12, 2.5]); } while (!Number.isInteger(km * 100000 / a) || !bsTidy(d * km / a, 2));
  const nn = km * 100000 / a, [ob] = r.p(BSKECIL);
  let q1, q2, R, e1; do { q1 = r.p([2, 3, 4, 5]); q2 = r.p([2, 3, 4, 6, 8, 10]); R = r.p([0.5, 0.8, 1.2, 1.5, 2, 2.5, 3]); e1 = R * q1; } while (q1 === q2 || !bsTidy(e1, 1) || !bsTidy(R * q2, 1));
  return GEN_LQ('k412', { A, B, n1, d1, d2, n2, Lr: Ld * n / 100, Ld, n, Wd, Wr: Wd * n / 100, a, km, nn, dd: d, Rr: d * nn / 100000, ob, q1, e1, q2, Re: R, e2: R * q2 });
};

/* ---------- 4.1.3 ---------- */
// lukis: mode 'x2' (1 : 1/2), 'd2' (1 : 2), 'x3' (1 : 1/3), 'd15' (1 : 1.5 → × 2/3)
const BSLUKIS = { x2: [1, 2, 'Every side of the object is multiplied by 2', 'Scale 1 : 1/2: measurement of drawing = measurement of object ÷ 1/2 = measurement of object × 2.'], d2: [2, 1, 'Every side of the object is divided by 2', 'Scale 1 : 2: measurement of drawing = measurement of object ÷ 2.'], x3: [1, 3, 'Every side of the object is multiplied by 3', 'Scale 1 : 1/3: measurement of drawing = measurement of object × 3.'], d15: [3, 2, 'Every side of the object is multiplied by 2/3', 'Scale 1 : 1.5: measurement of drawing = measurement of object ÷ 1.5 = measurement of object × 2/3.'] };
BS.lukis = (r, mode) => {
  const [ko, kd, how, why] = BSLUKIS[mode], sh = r.p(BSHAPE), L = r.p(['P', 'Q', 'R', 'S', 'K', 'M']);
  const sk = mode === 'x2' ? '1 : 1/2' : mode === 'd2' ? '1 : 2' : mode === 'x3' ? '1 : 1/3' : '1 : 1.5';
  const obj = sh.p.map(([i, j]) => [i * ko, j * ko]), drw = sh.p.map(([i, j]) => [i * kd, j * kd]);
  const ow = Math.max(...obj.map(p => p[0])), oh = Math.max(...obj.map(p => p[1])), dw = Math.max(...drw.map(p => p[0])), dh = Math.max(...drw.map(p => p[1]));
  const tc = Math.max(dw + 3, 8), tr = Math.max(dh + 3, 7), cell = Math.min(22, 300 / tc);
  const lab = len => `${bsN(len)}`;
  const po = { cols: ow + 2, rows: Math.max(oh + 2, tr), cell, title: `Object ${L}`, tc: 'tr', shapes: [{ pts: obj, c: 'tr', ox: 1, oy: 1, lab: null }] };
  const pt = { cols: tc, rows: tr, cell, title: 'Drawing', tc: 'am', shapes: [] };
  const fig = bsGridFig([po, pt], `Object ${L} on a grid and a blank grid`);
  const figAns = bsGridFig([po, Object.assign({}, pt, { shapes: [{ pts: drw, c: 'am', ox: 1, oy: 1, lab }] })], `Object ${L} and its scale drawing`);
  return GEN_LQ('lukis', { L, sk, nm: sh.n, ans: `${how}: width ${ow} cm → ${dw} cm, height ${oh} cm → ${dh} cm (see the answer diagram)`, work: [why, 'Start from one vertex, count the squares for every side and keep all the angles.'] }, { kind: 'lukis', fig, figAns });
};
BS.ukuranLukisan = r => {
  let n, dl, dw; do { n = r.p([100, 200, 250, 400, 500, 1000, 50]); dl = r.p([4, 5, 6, 8, 10, 12, 7.5, 4.5]); dw = r.p([2, 3, 4, 5, 6, 2.5, 3.5]); } while (dw >= dl || !bsTidy(dl * n / 100, 2) || !bsTidy(dw * n / 100, 2));
  const L = dl * n / 100, W = dw * n / 100, tp = r.p(L < 12 ? BSLUAS_S : BSLUAS), sk = bsSk(n);
  return GEN_LQ('ukuranLukisan', { tp, L, W, n, sk, ans: `${bsCm(dl)} × ${bsCm(dw)}`, work: [`${bsN(L)} m = ${bsN(L * 100)} cm, ${bsN(W)} m = ${bsN(W * 100)} cm`, `Length of drawing = ${bsN(L * 100)} ÷ ${bsN(n)} = ${bsN(dl)} cm`, `Width of drawing = ${bsN(W * 100)} ÷ ${bsN(n)} = ${bsN(dw)} cm`] });
};
// pelan L pada grid: lebar W, tinggi H, takuk (cw, ch) di bucu kanan atas
function bsLShape(r) {
  const W = r.i(4, 7), H = r.i(3, 5), cw = r.i(1, W - 2), ch = r.i(1, H - 2);
  return { W, H, cw, ch, pts: [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]] };
}
BS.bacaGrid = r => {
  const s = bsLShape(r), n = r.p([100, 200, 250, 300, 400, 500, 1000]);
  const V = ['A', 'B', 'C', 'D', 'E', 'F'], k = r.i(0, 5), a = s.pts[k], b = s.pts[(k + 1) % 6], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const fig = bsGridFig([{ cols: s.W + 2, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1, vl: s.pts.map((p, i) => [i, V[i]]) }] }], 'Plan of L-shaped land on a grid');
  return GEN_LQ('bacaGrid', { sk: bsSk(n), P1: V[k], P2: V[(k + 1) % 6], ans: bsM(len * n / 100), work: [`${V[k]}${V[(k + 1) % 6]} = ${len} squares = ${len} cm on the plan`, `Actual length = ${len} × ${bsN(n)} = ${bsN(len * n)} cm`, `= ${bsN(len * n / 100)} m`] }, { fig });
};
const BSGRID = [[1, 2], [1, 0.5], [2, 1], [1, 3], [2, 0.5], [0.5, 1], [0.5, 2], [2, 3], [3, 1]];
BS.gridBeza = r => {
  const [a, b] = r.p(BSGRID), ans = bsSk(Math.round(a * 10), Math.round(b * 10)), sh = r.p(BSHAPE);
  const cA = 15 * a > 34 ? 34 : 15 * a, cB = 15 * b > 34 ? 34 : 15 * b, sz = Math.max(...sh.p.flat()) + 2;
  const fig = bsGridFig([{ cols: sz + 1, rows: sz, cell: cA * (a >= b ? 1 : 1), title: `Object (${bsN(a)} cm squares)`, tc: 'tr', shapes: [{ pts: sh.p, c: 'tr', ox: 1, oy: 1 }] }, { cols: sz + 1, rows: sz, cell: cB, title: `Drawing (${bsN(b)} cm squares)`, tc: 'am', shapes: [{ pts: sh.p, c: 'am', ox: 1, oy: 1 }] }], 'Object and drawing on grids of different sizes');
  return GEN_LQ('gridBeza', { a, b, ans, work: [`Scale = grid size of scale drawing : grid size of object = ${bsN(b)} : ${bsN(a)}`, `= 1 : ${bsN(a)} ÷ ${bsN(b)} = ${ans}`, b > a ? 'The drawing is bigger.' : 'The drawing is smaller.'] }, { fig });
};
BS.bentukL = r => {
  const n = r.p([100, 200, 250, 400, 500]), s = bsLShape(r);
  const u = r.p([1, 2, 3, 4, 5]); // 1 petak = u m sebenar
  const a = s.W * u, b = s.H * u, c = (s.W - s.cw) * u, d = (s.H - s.ch) * u;
  const dl = x => x * 100 / n;
  if (![a, b, c, d].every(x => bsTidy(dl(x), 2))) return BS.bentukL(r);
  const sk = bsSk(n);
  const fig = bsGridFig([{ cols: s.W + 4, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1 }], marks: [{ i: 1 + s.W / 2, j: 1 + s.H + .5, s: bsM(a), c: 'gr', sz: 14 }, { i: .5, j: 1 + s.H / 2, s: bsM(b), c: 'gr', sz: 14 }, { i: 1 + (s.W - s.cw) / 2, j: .5, s: bsM(c), c: 'gr', sz: 14 }, { i: 1 + s.W + 1.3, j: 1 + s.ch + (s.H - s.ch) / 2, s: bsM(d), c: 'gr', sz: 14 }] }], 'L-shaped land with actual measurements');
  return GEN_LQ('bentukL', { a, b, c, d, sk, ans: `${bsM(a)} → ${bsCm(dl(a))}, ${bsM(b)} → ${bsCm(dl(b))}, ${bsM(c)} → ${bsCm(dl(c))}, ${bsM(d)} → ${bsCm(dl(d))}`, work: [`Measurement of drawing = actual measurement (cm) ÷ ${bsN(n)}`, `${bsN(a * 100)} ÷ ${bsN(n)} = ${bsN(dl(a))} cm; ${bsN(b * 100)} ÷ ${bsN(n)} = ${bsN(dl(b))} cm`, `${bsN(c * 100)} ÷ ${bsN(n)} = ${bsN(dl(c))} cm; ${bsN(d * 100)} ÷ ${bsN(n)} = ${bsN(dl(d))} cm`] }, { fig });
};
BS.k413 = r => {
  const s = bsLShape(r), n = r.p([100, 200, 300, 400, 500]), u = n / 100;
  const P = 2 * (s.W + s.H) * u, A = (s.W * s.H - s.cw * s.ch) * u * u;
  const fig = bsGridFig([{ cols: s.W + 2, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1, lab: len => `${len}` }] }], 'Plan of L-shaped land');
  let L, W, n1, n2; do { L = r.p([4, 5, 6, 8, 10, 12]); W = r.p([2, 3, 4, 5, 6]); n1 = r.p([100, 200, 400, 500]); n2 = n1 * r.p([2, 0.5, 4, 2.5]); } while (W >= L || !Number.isInteger(n2) || !bsTidy(L * n1 / n2, 1) || !bsTidy(W * n1 / n2, 1));
  let a, b, w, h; do { [a, b] = r.p([[1, 2], [1, 3], [2, 1], [1, 0.5], [0.5, 1.5]]); w = r.i(2, 5); h = r.i(2, 4); } while (w === h);
  const k = bsFr(Math.round(b * 10) ** 2, Math.round(a * 10) ** 2), sk3 = bsSk(Math.round(a * 10), Math.round(b * 10));
  const v = vq('k413', { sk: bsSk(n), n, P, A, L, W, n1, n2, L2: L * n1 / n2, W2: W * n1 / n2, RL: L * n1 / 100, RW: W * n1 / 100, a, b, w, h, k, sk3, A1: w * a * h * a, A2: w * b * h * b });
  let work = v.work;
  if (v.q.includes('L-shaped')) work = [`1 cm on the plan represents ${bsN(n)} cm = ${bsN(u)} m`, `(a) Perimeter on the plan = 2 × (${s.W} + ${s.H}) = ${2 * (s.W + s.H)} cm; actual = ${2 * (s.W + s.H)} × ${bsN(u)} = ${bsN(P)} m`, `(b) Area on the plan = ${s.W} × ${s.H} − ${s.cw} × ${s.ch} = ${s.W * s.H - s.cw * s.ch} cm²`, `Actual area = ${s.W * s.H - s.cw * s.ch} × ${bsN(u)}² = ${bsN(A)} m²`];
  return Object.assign({ q: v.q, ans: v.ans, work }, v.q.includes('L-shaped') ? { fig } : {});
};

/* ---------- 4.1.4 ---------- */
// ukuran pelan (cm) yang menghasilkan ukuran sebenar kemas
function bsPlanDims(r, big) {
  let n, l, w, L, W; do {
    n = r.p(big ? [200, 250, 400, 500] : [100, 200, 250]); l = r.p([2, 3, 4, 5, 6, 2.5, 3.5, 4.5, 1.5]); w = r.p([1.5, 2, 2.5, 3, 4, 1.2]); L = l * n / 100; W = w * n / 100;
  } while (w >= l || !bsTidy(L, 2) || !bsTidy(W, 2) || !bsTidy(L * W, 1) || (!big && (L > 8 || W < 2.4)) || (big && L < 8));
  return { n, l, w, L, W };
}
BS.luasBilik = r => {
  const { n, l, w, L, W } = bsPlanDims(r), bl = r.p(BSBILIK), sk = bsSk(n), A = L * W;
  return GEN_LQ('luasBilik', { bl, l, w, sk, wrong: bsM2(l * w * n / 10000) === bsM2(A) ? bsM2(A * 2) : `${bsN(l * w * n)} cm²`, ans: bsM2(A), work: [`1 cm represents ${bsN(n)} cm = ${bsN(n / 100)} m`, `Actual length = ${bsN(l)} × ${bsN(n / 100)} = ${bsN(L)} m; actual width = ${bsN(w)} × ${bsN(n / 100)} = ${bsN(W)} m`, `Actual area = ${bsN(L)} × ${bsN(W)} = ${bsN(A)} m²`] }, { fig: bsPlanFig([{ w: l, h: w, t: vcap(bl), c: 'pk' }], sk) });
};
BS.laluan = r => {
  let n, d1, d2; do { n = r.p(BSN_PETA.slice(2)); d1 = r.p([2, 3, 4, 5, 2.5, 3.5, 1.5]); d2 = r.p([2, 3, 4, 6, 4.5, 1.5]); } while (!bsTidy((d1 + d2) * n / 100000, 2) || !bsTidy(d1 * n / 100000, 2) || !bsTidy(d2 * n / 100000, 2));
  const [A, B] = r.p(BSTEMPAT), C = r.p(['Simpang Empat', 'Pekan Rabu', 'Batu Lima', 'Bridge']), sk = bsSk(n), k1 = n / 100000;
  return GEN_LQ('laluan', { A, B, C, d1, d2, sk, ans: bsKm((d1 + d2) * k1), work: [`Total distance on the map = ${bsN(d1)} + ${bsN(d2)} = ${bsN(d1 + d2)} cm`, `1 cm represents ${bsN(n)} cm = ${bsN(k1)} km`, `Actual distance = ${bsN(d1 + d2)} × ${bsN(k1)} = ${bsN((d1 + d2) * k1)} km`] }, { fig: bsMapFig(A, B, '', sk, { C, d1: bsCm(d1), d2: bsCm(d2) }) });
};
BS.model = r => {
  const [thing, Rs] = r.p([['car', [4, 4.5, 3.6, 4.2]], ['bus', [12, 10, 9]], ['aeroplane', [36, 40, 30]], ['lorry', [8, 9, 7.2]], ['boat', [6, 4.8, 7.5]], ['train', [20, 24, 18]]]);
  let R, n, ml; do { R = r.p(Rs); n = r.p([10, 12, 18, 20, 24, 25, 30, 40, 50, 100, 200]); ml = R * 100 / n; } while (!bsTidy(ml, 1) || ml < 5 || ml > 60);
  const v = vq('model', { thing, ml, R, n });
  let ans, work;
  if (v.q.startsWith('The length of a model')) { ans = bsSk(n); work = [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Scale = ${bsN(ml)} : ${bsN(R * 100)} = 1 : ${bsN(n)}`]; }
  else if (v.q.includes('what is the length of the model')) { ans = bsCm(ml); work = [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Length of model = ${bsN(R * 100)} ÷ ${bsN(n)} = ${bsN(ml)} cm`]; }
  else { ans = bsM(R); work = [`Actual length = ${bsN(ml)} × ${bsN(n)} = ${bsN(ml * n)} cm`, `= ${bsN(R)} m`]; }
  return { q: v.q, ans, work };
};
BS.luasN = r => {
  let n, Ad; do { n = r.p([10, 20, 50, 100, 200, 250, 500, 1000]); Ad = r.p([4, 5, 6, 8, 9, 12, 15, 20, 24, 2.5, 7.5]); } while (!bsTidy(Ad * n * n / 10000, 2));
  const Ar = Ad * n * n / 10000, sk = bsSk(n), tp = r.p(BSLUAS);
  const v = vq('luasN', { Ad, Ar, n, sk, tp, ans: bsM2(Ar) });
  let ans = v.ans, work = [`Actual area = area of drawing × n² = ${bsN(Ad)} × ${bsN(n)}²`, `= ${bsN(Ad * n * n)} cm²`, `= ${bsN(Ad * n * n)} ÷ 10${' '}000 = ${bsN(Ar)} m²`];
  if (v.q.startsWith('The actual area')) { ans = bsCm2(Ad); work = [`${bsN(Ar)} m² = ${bsN(Ar * 10000)} cm²`, `Area of drawing = actual area ÷ n² = ${bsN(Ar * 10000)} ÷ ${bsN(n * n)}`, `= ${bsN(Ad)} cm²`]; }
  else if (v.work && v.work.length && v.q.includes('correct?')) work = v.work.slice(0, 1).concat(work);
  return { q: v.q, ans, work };
};
BS.kos = r => {
  const v0 = vq('kos', { bl: '#B', tp: '#T', l: 0, w: 0, sk: '#S', n: 0, h: 0 }), per = v0.q.includes('memagar');
  const { n, l, w, L, W } = bsPlanDims(r, per), bl = r.p(BSBILIK), tp = r.p(BSLUAS), sk = bsSk(n);
  const v = { q: QV.kos.find(f => { const t = f({ bl: '#B', tp: '#T', l: 0, w: 0, sk: '#S', n: 0, h: 0 }).q; return t === v0.q; })({ bl, tp, l, w, sk, n, h: 0 }).q };
  const h = per ? r.p([15, 20, 25, 30, 40]) : r.p([20, 25, 30, 35, 40, 45, 50, 60]);
  const q = v.q.replace(/RM0/g, `RM${h}`), A = L * W, Pm = 2 * (L + W);
  if (per) return { q, ans: bsRM(Pm * h), work: [`Actual length = ${bsN(l)} × ${bsN(n)} = ${bsN(l * n)} cm = ${bsN(L)} m; actual width = ${bsN(w * n)} cm = ${bsN(W)} m`, `Perimeter = 2 × (${bsN(L)} + ${bsN(W)}) = ${bsN(Pm)} m`, `Cost = ${bsN(Pm)} × RM${h} = ${bsRM(Pm * h)}`] };
  return { q, ans: bsRM(A * h), work: [`Actual length = ${bsN(l)} × ${bsN(n)} = ${bsN(l * n)} cm = ${bsN(L)} m; actual width = ${bsN(w * n)} cm = ${bsN(W)} m`, `Area = ${bsN(L)} × ${bsN(W)} = ${bsN(A)} m²`, `Cost = ${bsN(A)} × RM${h} = ${bsRM(A * h)}`] };
};
BS.masa = r => {
  let n, d, v; do { n = r.p([100000, 200000, 250000, 500000]); d = r.p([2, 3, 4, 5, 6, 8, 2.5, 4.5, 7.5]); v = r.p([40, 45, 50, 60, 72, 80, 90]); } while (!Number.isInteger(d * n / 100000 / v * 60) || !bsTidy(d * n / 100000, 2));
  const km = d * n / 100000, t = km / v * 60, [A, B] = r.p(BSTEMPAT), sk = bsSk(n);
  const o = vq('masa', { A, B, d, sk, v, t });
  if (o.q.includes('average speed of the bus')) return { q: o.q, ans: `${bsN(v)} km/j`, work: [`Actual distance = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`, `${t} minutes = ${bsFr(t, 60)} hour`, `Speed = ${bsN(km)} ÷ ${bsFr(t, 60)} = ${bsN(km)} × ${bsFr(60, t)} = ${bsN(v)} km/h`] };
  return { q: o.q, ans: `${bsN(t)} minutes`, work: [`Actual distance = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`, `Time = ${bsN(km)} ÷ ${v} = ${bsFr(Math.round(km * 100), v * 100)} hour`, `= ${bsFr(Math.round(km * 100), v * 100)} × 60 = ${bsN(t)} minutes`] };
};
BS.k414 = r => {
  // (1) dua bilik + kos
  let p1, p2; do { p1 = bsPlanDims(r); p2 = bsPlanDims(r); p2.n = p1.n; p2.L = p2.l * p1.n / 100; p2.W = p2.w * p1.n / 100; } while (!bsTidy(p2.L, 2) || !bsTidy(p2.W, 2) || !bsTidy(p2.L * p2.W, 1) || p2.L > 8 || p2.W < 2.4 || (p1.l === p2.l && p1.w === p2.w));
  const [t1, t2] = bsShuf(r, BSBILIK).slice(0, 2), h1 = r.p([25, 30, 35, 40, 45]);
  // (2) dua laluan
  let n2, d1, d2, d3, v; do { n2 = r.p([100000, 200000, 250000]); d1 = r.p([5, 6, 7, 8, 9]); d2 = r.p([3, 4, 5, 2.5]); d3 = r.p([3, 4, 5, 3.5]); v = r.p([40, 50, 60, 80]); } while (d2 + d3 <= d1 || !Number.isInteger((d2 + d3 - d1) * n2 / 100000 / v * 60));
  const [A, B] = r.p(BSTEMPAT), C = r.p(['Simpang Empat', 'Pekan Rabu', 'Batu Lima']);
  // (3) pagar
  let n3, l3, w3, g; do { n3 = r.p([200, 250, 400, 500]); l3 = r.p([4, 5, 6, 8, 4.5]); w3 = r.p([2, 3, 4, 2.5]); g = r.p([1, 1.5, 2, 3]); } while (w3 >= l3 || !bsTidy(l3 * n3 / 100, 2) || !bsTidy(w3 * n3 / 100, 2));
  const h3 = r.p([15, 20, 25, 30]);
  const d = { sk: bsSk(p1.n), n: p1.n, r1: { t: t1, l: p1.l, w: p1.w }, r2: { t: t2, l: p2.l, w: p2.w }, h: h1 };
  const v1 = vq('k414', Object.assign(d, { A, B, C, d1, d2, d3, v, l: l3, w: w3, g }));
  if (v1.q.startsWith('The plan of a house')) {
    const a1 = p1.L * p1.W, a2 = p2.L * p2.W;
    return { q: v1.q, ans: `(a) ${vcap(t1)}: ${bsM2(a1)}, ${t2}: ${bsM2(a2)} (b) ${bsRM((a1 + a2) * h1)}`, work: [`1 cm represents ${bsN(p1.n / 100)} m`, `(a) ${vcap(t1)}: ${bsN(p1.L)} m × ${bsN(p1.W)} m = ${bsN(a1)} m²; ${t2}: ${bsN(p2.L)} m × ${bsN(p2.W)} m = ${bsN(a2)} m²`, `(b) Total area = ${bsN(a1 + a2)} m²; cost = ${bsN(a1 + a2)} × RM${h1} = ${bsRM((a1 + a2) * h1)}`] };
  }
  if (v1.q.startsWith('On a map')) {
    const q = v1.q.replace(/skala 1 : [\d ]+/, `scale of ${bsSk(n2)}`), k = n2 / 100000, R1 = d1 * k, R2 = (d2 + d3) * k, save = (R2 - R1) / v * 60;
    return { q, ans: `(a) First route ${bsKm(R1)}, second route ${bsKm(R2)} (b) ${bsN(save)} minutes`, work: [`1 cm represents ${bsN(k)} km`, `(a) First route = ${bsN(d1)} × ${bsN(k)} = ${bsN(R1)} km; second route = (${bsN(d2)} + ${bsN(d3)}) × ${bsN(k)} = ${bsN(R2)} km`, `(b) Difference in distance = ${bsN(R2 - R1)} km; time saved = ${bsN(R2 - R1)} ÷ ${v} × 60 = ${bsN(save)} minutes`] };
  }
  const q = v1.q.replace(/skala 1 : [\d ]+/, `scale of ${bsSk(n3)}`).replace(/RM\d+ semeter/, `RM${h3} per metre`), L = l3 * n3 / 100, W = w3 * n3 / 100, P = 2 * (L + W);
  return { q, ans: `(a) ${bsM(P)} (b) ${bsRM((P - g) * h3)}`, work: [`Actual length = ${bsN(l3)} × ${bsN(n3)} = ${bsN(l3 * n3)} cm = ${bsN(L)} m; width = ${bsN(w3 * n3)} cm = ${bsN(W)} m`, `(a) Perimeter = 2 × (${bsN(L)} + ${bsN(W)}) = ${bsN(P)} m`, `(b) Length of fence = ${bsN(P)} − ${bsN(g)} = ${bsN(P - g)} m; cost = ${bsN(P - g)} × RM${h3} = ${bsRM((P - g) * h3)}`] };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '4.1.1': {
    m: [() => BS.nisbah(bsRG), () => BS.kali(bsRG), () => BS.kenal(bsRG), () => BS.sisiHilang(bsRG), () => BS.bs(bsRG, BSBS1)],
    s: [() => BS.semak(bsRG), () => BS.segitiga(bsRG)],
    k: [() => BS.k411(bsRG)]
  },
  '4.1.2': {
    m: [() => BS.tafsir(bsRG), () => BS.jenisSkala(bsRG), () => BS.sebenar(bsRG), () => BS.lukisan(bsRG), () => BS.bs(bsRG, BSBS2)],
    s: [() => BS.cariSkala(bsRG), () => BS.peta(bsRG), () => BS.besar(bsRG)],
    k: [() => BS.k412(bsRG)]
  },
  '4.1.3': {
    m: [() => BS.lukis(bsRG, pick(['x2', 'd2'])), () => BS.ukuranLukisan(bsRG), () => BS.bacaGrid(bsRG)],
    s: [() => BS.gridBeza(bsRG), () => BS.lukis(bsRG, pick(['x3', 'd15'])), () => BS.bentukL(bsRG)],
    k: [() => BS.k413(bsRG)]
  },
  '4.1.4': {
    m: [() => BS.luasBilik(bsRG), () => BS.laluan(bsRG), () => BS.model(bsRG)],
    s: [() => BS.luasN(bsRG), () => BS.kos(bsRG), () => BS.masa(bsRG)],
    k: [() => BS.k414(bsRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 4.1.1
WG.nisbahK = () => BS.nisbah(bsRW, false);
WG.nisbahB = () => BS.nisbah(bsRW, true);
WG.kali = () => BS.kali(bsRW);
WG.kenal = () => BS.kenal(bsRW);
WG.sisiHilang = () => BS.sisiHilang(bsRW);
WG.bs1 = i => BS.bs(bsRW, BSBS1, [1, 2][i % 2] + wri(0, 1) * 4);
WG.semak = i => BS.semak(bsRW, i % 2 === 0);
WG.segitiga = () => BS.segitiga(bsRW);
WG.k411 = () => BS.k411(bsRW);
// 4.1.2
WG.tafsir = () => BS.tafsir(bsRW);
WG.jenisSkala = i => BS.jenisSkala(bsRW, [0, 4, 3, 6, 8][i % 5]);
WG.sebenar = () => BS.sebenar(bsRW);
WG.lukisan = () => BS.lukisan(bsRW);
WG.bs2 = i => BS.bs(bsRW, BSBS2, [1, 5][i % 2] + wri(0, 1) * 2);
WG.cariSkala = i => BS.cariSkala(bsRW, ['m', 'km', 'besar', 'm'][i % 4]);
WG.peta = () => BS.peta(bsRW);
WG.besar = () => BS.besar(bsRW);
WG.k412 = () => BS.k412(bsRW);
// 4.1.3
WG.lukisM = i => BS.lukis(bsRW, ['x2', 'd2'][i % 2]);
WG.lukisS = i => BS.lukis(bsRW, ['x3', 'd15'][i % 2]);
WG.ukuranLukisan = () => BS.ukuranLukisan(bsRW);
WG.bacaGrid = () => BS.bacaGrid(bsRW);
WG.gridBeza = () => BS.gridBeza(bsRW);
WG.bentukL = () => BS.bentukL(bsRW);
WG.k413 = () => BS.k413(bsRW);
// 4.1.4
WG.luasBilik = () => BS.luasBilik(bsRW);
WG.laluan = () => BS.laluan(bsRW);
WG.model = () => BS.model(bsRW);
WG.luasN = () => BS.luasN(bsRW);
WG.kos = () => BS.kos(bsRW);
WG.masa = () => BS.masa(bsRW);
WG.k414 = () => BS.k414(bsRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '4.1.1': [['m', 'nisbahK', 3], ['m', 'nisbahB', 2], ['m', 'kali', 4], ['m', 'kenal', 4], ['m', 'sisiHilang', 3], ['m', 'bs1', 2], ['s', 'semak', 5], ['s', 'segitiga', 4], ['k', 'k411', 3]],
  '4.1.2': [['m', 'tafsir', 5], ['m', 'jenisSkala', 4], ['m', 'sebenar', 4], ['m', 'lukisan', 3], ['m', 'bs2', 2], ['s', 'cariSkala', 4], ['s', 'peta', 3], ['s', 'besar', 2], ['k', 'k412', 3]],
  '4.1.3': [['m', 'lukisM', 5], ['m', 'ukuranLukisan', 7], ['m', 'bacaGrid', 6], ['s', 'gridBeza', 3], ['s', 'lukisS', 3], ['s', 'bentukL', 3], ['k', 'k413', 3]],
  '4.1.4': [['m', 'luasBilik', 6], ['m', 'laluan', 6], ['m', 'model', 6], ['s', 'luasN', 3], ['s', 'kos', 3], ['s', 'masa', 3], ['k', 'k414', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan teks unik: jawapan + calon (diambil 3 yang berbeza), ditambah dengan fn isi jika kurang
function bsOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || /NaN|undefined|Infinity/.test(String(c))) continue; if (!seen.has(c)) { seen.add(c); w.push(c); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const bsMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const bsNF = (v, u) => `${bsN(v)} ${u}`;
const CQGEN = {
  maksud: [
    () => { const d = bsKenalData(bsRG); return { type: 'mcq', q: 'Which drawing is the <b>scale drawing</b> of the object?', fig: d.fig, opts: ['A', 'B', 'C'].concat([]).slice(0, 3).concat(['None']), c: 'ABC'.indexOf(d.X) }; },
    () => { const { k, a, b, a2, b2 } = bsPair(bsRG); return bsMcq('The ratio of measurement of drawing to measurement of object is', bsRects([{ w: a, h: b, c: 'tr', t: 'Object', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Drawing', wl: bsCm(a2), hl: bsCm(b2) }]), bsOpts(bsRatio(k), [[k[1], k[0]], [1, a], [k[0], k[1] + 1], [k[0] + 1, k[1]], [k[0], 2 * k[1] + 1]].map(([x, y]) => { const g = bsGcd(x, y); return x === y ? null : bsRatio([x / g, y / g]); }), i => bsRatio([1, k[1] + i + 1]))); },
    () => { const { k, a, b, a2, b2 } = bsPair(bsRG); return bsMcq(`Object ${a} cm × ${b} cm. The length of the scale drawing is ${bsN(a2)} cm. What is its width?`, bsRects([{ w: a, h: b, c: 'tr', t: 'Object', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Drawing', wl: bsCm(a2), hl: '?' }]), bsOpts(bsCm(b2), [bsCm(b + a2 - a), bsCm(b * k[1] / k[0]), bsCm(b2 + 1), bsCm(Math.max(1, b2 - 1)), bsCm(a2 * a / b)].filter(s => /^\d+(\.\d)? cm$/.test(s)), i => bsCm(b2 + i + 1))); }
  ],
  skala: [
    () => { const n = pick(BSN_PELAN.concat(BSN_PETA)); return bsMcq(`The scale <b>${bsSk(n)}</b> means 1 cm on the drawing represents`, bsBarFig(1, '1 cm', `Scale ${bsSk(n)}`), bsOpts(bsRu(n), [bsRu(n * 10), bsRu(n / 10 >= 1 ? n / 10 : n * 100), `${bsN(n)} m`, `${bsN(n)} km`, bsRu(n * 100)], i => bsRu(n * (i + 2)))); },
    () => { const [[a, b], j] = pick(BSSK_J); return bsMcq(`A scale drawing with a scale of <b>${bsSk(a, b)}</b> is`, bsBarFig(3, 'drawing', `Scale ${bsSk(a, b)}`), bsOpts(['Smaller than the object', 'The same size as the object', 'Bigger than the object'][{ k: 0, s: 1, b: 2 }[j]], ['Smaller than the object', 'The same size as the object', 'Bigger than the object', 'Cannot be determined'], () => 'Cannot be determined')); },
    () => {
      const kind = pick(['m', 'km', 'besar']); let d, R, rt, wrong;
      if (kind === 'm') { const n = pick([20, 25, 40, 50, 100, 200, 250, 500]); d = pick([2, 4, 5, 8, 10]); R = d * n; rt = bsM(R / 100); wrong = bsSk(R / 100, d); }
      else if (kind === 'km') { const n = pick([20000, 50000, 100000, 200000]); d = pick([2, 3, 4, 5]); R = d * n; rt = bsKm(R / 100000); wrong = bsSk(R / 100000, d); }
      else { const q = pick([2, 4, 5, 10]); R = pick([0.5, 1, 1.5, 2]); d = R * q; rt = bsCm(R); wrong = bsSk(q); }
      const ans = bsSk(Math.round(R * 10), Math.round(d * 10)), rev = `${bsFr(Math.round(R * 10), Math.round(d * 10))} : 1`;
      return bsMcq(`A drawing of <b>${bsCm(d)}</b> represents <b>${rt}</b>. The scale of the drawing is`, bsBarFig(d, bsCm(d), 'Drawing'), bsOpts(ans, [wrong, rev, bsSk(Math.round(R * 100), Math.round(d * 10)), bsSk(Math.round(d * 10), Math.round(R * 10))], i => bsSk(i * 25)));
    }
  ],
  lukis: [
    () => { let n, d; do { n = pick(BSN_PELAN); d = pick([2, 3, 4, 5, 6, 8, 2.5, 1.5]); } while (!bsTidy(d * n / 100, 2)); const R = d * n / 100; return bsMcq(`Actual length = <b>${bsN(R)} m</b>, scale <b>${bsSk(n)}</b>. What is the length of the drawing?`, bsBarFig(d, '? cm', `Scale ${bsSk(n)}`), bsOpts(bsCm(d), [bsCm(R * n), bsCm(R / n), bsCm(d * 10), bsCm(d / 10), bsCm(d + 1)], i => bsCm(d + i + 1))); },
    () => { let n, d; do { n = pick(BSN_PELAN); d = pick([2, 3, 4, 5, 6, 8, 2.5, 1.5, 3.5]); } while (!bsTidy(d * n / 100, 2)); const R = d * n / 100; return bsMcq(`On a scale drawing with a scale of <b>${bsSk(n)}</b>, length = <b>${bsN(d)} cm</b>. What is the actual length?`, bsBarFig(d, bsCm(d), `Scale ${bsSk(n)}`), bsOpts(bsM(R), [bsM(R * 10), bsM(R / 10), bsM(d * n), bsCm(d / n), bsM(R + 1)], i => bsM(R + i + 1))); },
    () => { const [a, b] = pick(BSGRID), ans = bsSk(Math.round(a * 10), Math.round(b * 10)), sh = pick(BSHAPE); const sz = Math.max(...sh.p.flat()) + 2; return bsMcq(`An object on a <b>${bsN(a)} cm</b> grid is copied onto a <b>${bsN(b)} cm</b> grid (same number of squares). The scale is`, bsGridFig([{ cols: sz, rows: sz, cell: Math.min(34, 15 * a), title: `${bsN(a)} cm`, tc: 'tr', shapes: [{ pts: sh.p, c: 'tr', ox: 1, oy: 1 }] }, { cols: sz, rows: sz, cell: Math.min(34, 15 * b), title: `${bsN(b)} cm`, tc: 'am', shapes: [{ pts: sh.p, c: 'am', ox: 1, oy: 1 }] }]), bsOpts(ans, [bsSk(Math.round(b * 10), Math.round(a * 10)), bsSk(Math.round(a * b * 10), 10), '1 : 1', bsSk(Math.round(a * 20), Math.round(b * 10))], i => bsSk(i + 4))); }
  ],
  masalah: [
    () => { let n, d; do { n = pick(BSN_PETA); d = pick([2, 3, 4, 5, 6, 2.5, 3.5]); } while (!bsTidy(d * n / 100000, 2)); const km = d * n / 100000, [A, B] = pick(BSTEMPAT); return bsMcq(`Distance on the map = <b>${bsN(d)} cm</b>, scale <b>${bsSk(n)}</b>. What is the actual distance?`, bsMapFig(A, B, bsCm(d), bsSk(n)), bsOpts(bsKm(km), [bsKm(km * 10), bsKm(km / 10), bsKm(km * 100), `${bsN(km)} m`, bsKm(n / 100000)], i => bsKm(km + i))); },
    () => { const { n, l, w, L, W } = bsPlanDims(bsRG); return bsMcq(`Plan with a scale of <b>${bsSk(n)}</b>: room ${bsN(l)} cm × ${bsN(w)} cm. What is the actual area?`, bsPlanFig([{ w: l, h: w, t: 'Room', c: 'pk' }], bsSk(n)), bsOpts(bsM2(L * W), [bsM2(L * W * 10), bsM2(l * w * n / 100), bsM2(2 * (L + W)), bsM2(L * W / 10), bsM2(L + W)], i => bsM2(L * W + i))); },
    () => { let n, Ad; do { n = pick([10, 20, 50, 100, 200]); Ad = pick([4, 5, 6, 8, 12, 15, 20]); } while (!bsTidy(Ad * n * n / 10000, 2)); const Ar = Ad * n * n / 10000; return bsMcq(`Area on a scale drawing with a scale of <b>${bsSk(n)}</b> = <b>${bsN(Ad)} cm²</b>. What is the actual area?`, bsBarFig(4, `${bsN(Ad)} cm²`, `Scale ${bsSk(n)}`, 'pk'), bsOpts(bsM2(Ar), [bsM2(Ad * n / 100), bsM2(Ad * n / 10000), bsM2(Ar * 10), bsM2(Ar / 10), bsM2(Ad * n)], i => bsM2(Ar * (i + 2)))); }
  ]
};
const CQT = { maksud: 'Meaning of scale drawing', skala: 'Interpreting the scale', lukis: 'Drawing & actual measurements', masalah: 'Plans & maps' };
function bsCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.skala;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['maksud', 'skala', 'skala', 'lukis', 'masalah'] : Object.keys(CQT);
  return bsCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return bsCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui bsBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => bsBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => bsBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => bsBtO(c0(...a)); gq = (...a) => bsBtO(g0(...a)); }
