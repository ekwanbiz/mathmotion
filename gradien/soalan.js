'use strict';
/* =================== GRADIEN · SOALAN BAB 10 KECERUNAN GARIS LURUS (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "gd" / "GD" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & pecahan =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// gdBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const GDBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const GDBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const GDBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${GDBTAT})+)( ?)\/\2((?:${GDBTAT})+)(?![\w]|\.\d)`);
const GDBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, GDBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const gdBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function gdBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + GDBTG[c][0] + '\u0002' + GDBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + gdBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(GDBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (GDBTUN.test(a) && GDBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && GDBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + gdBtP(a) + '\u0002' + gdBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function gdBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = gdBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// gdBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function gdBtTree(s) {
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
const gdBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function gdBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * gdBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = gdBtMeas(n.a, z2), B = gdBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = gdBtMeas(n.k, z), N = gdBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function gdBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += gdBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + gdBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += gdBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += gdBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const gdBtW = (t, z) => gdBtMeas(gdBtTree(gdBtTok(String(t))), z).w;
function gdBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = gdBtTree(gdBtTok(String(t))), m = gdBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${gdBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function gdBtO(o) {
  if (typeof o === 'string') return gdBt(o);
  if (Array.isArray(o)) return o.map(gdBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = gdBtO(o[k]);
  return o;
}

const gdGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan termudah dengan tanda tolak sebenar (−); penyebut 0 → "tidak tertakrif"
const gdFr = (n, d) => {
  if (d === 0) return 'tidak tertakrif';
  if (d < 0) { n = -n; d = -d; }
  const g = gdGcd(n, d) || 1; n /= g; d /= g;
  return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d);
};
const gdPm = s => (s[0] === '−' ? `(${s})` : s);              // kurungan bagi nilai negatif
const gdCoef = c => (c === 1 ? '' : c === -1 ? '−' : fmt(c));    // pekali bagi h
const gdNum = x => String(Math.round(x * 1000) / 1000);
// rawak: gdRG untuk Latihan Kelas / games, gdRW (berbenih) untuk Lembaran Kerja
const gdRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const gdRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const gdShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gdDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);

/* =================== data bersama =================== */
const GDFR = [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5], [3, 5], [4, 3], [3, 2], [5, 2], [2, 1], [3, 1], [1, 5], [5, 4], [4, 5], [5, 3]];
const GDABS = [[1, 3], [1, 2], [2, 3], [3, 4], [1, 1], [4, 3], [3, 2], [2, 1], [5, 2], [3, 1], [4, 1]];
const GDTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20], [15, 20, 25], [20, 21, 29]];
const GDHUR3 = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['D', 'E', 'F'], ['S', 'T', 'U'], ['X', 'Y', 'Z']];
const GDHUR2 = [['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S'], ['C', 'D'], ['E', 'F'], ['K', 'L'], ['G', 'H']];
const GDJENIS = {
  pos: ['Positif', 'naik dari kiri ke kanan', 'Garis lurus itu naik dari kiri ke kanan, maka kecerunannya positif.', 'Naik dari kiri ke kanan'],
  neg: ['Negatif', 'turun dari kiri ke kanan', 'Garis lurus itu turun dari kiri ke kanan, maka kecerunannya negatif.', 'Turun dari kiri ke kanan'],
  zero: ['Sifar', 'mengufuk (selari dengan paksi-x)', 'Garis lurus itu mengufuk (selari dengan paksi-x): jarak mencancang = 0, maka kecerunan = 0.', 'Mengufuk'],
  und: ['Tidak tertakrif', 'mencancang (selari dengan paksi-y)', 'Garis lurus itu mencancang (selari dengan paksi-y): jarak mengufuk = 0, maka kecerunan tidak tertakrif.', 'Mencancang']
};
const GDJK = ['pos', 'neg', 'zero', 'und'];
const GDCLAIM = { pos: 'neg', neg: 'pos', zero: 'und', und: 'zero' };
const GDBS1 = [
  ['Kecerunan sebuah cerun ialah nisbah jarak mencancang kepada jarak mengufuk.', true, 'Kecerunan = jarak mencancang ÷ jarak mengufuk.'],
  ['Kecerunan = jarak mengufuk ÷ jarak mencancang.', false, 'Rumus yang betul: kecerunan = jarak mencancang ÷ jarak mengufuk.'],
  ['Semakin besar nilai kecerunan, semakin curam sesuatu cerun.', true, 'Nilai kecerunan yang lebih besar bermaksud kenaikan yang lebih tinggi bagi jarak mengufuk yang sama.'],
  ['Dua cerun yang mempunyai jarak mencancang yang sama sentiasa sama curam.', false, 'Kecuraman bergantung pada nisbah jarak mencancang kepada jarak mengufuk, bukan jarak mencancang sahaja.'],
  ['Panjang permukaan cerun digunakan sebagai penyebut dalam rumus kecerunan.', false, 'Penyebut ialah jarak mengufuk, bukan panjang permukaan cerun.'],
  ['Jika jarak mencancang ialah 3 m dan jarak mengufuk ialah 6 m, maka kecerunannya ialah 1/2.', true, 'Kecerunan = 3 ÷ 6 = 1/2.'],
  ['Cerun dengan kecerunan 1/4 lebih curam daripada cerun dengan kecerunan 1/2.', false, '1/4 lebih kecil daripada 1/2, jadi cerun berkecerunan 1/2 lebih curam.'],
  ['Jarak mencancang diukur secara tegak, manakala jarak mengufuk diukur secara melintang.', true, 'Mencancang = tegak (atas–bawah); mengufuk = melintang (kiri–kanan).']
];
const GDBS3 = [
  ['Garis lurus yang mengufuk mempunyai kecerunan sifar.', true, 'Jarak mencancang = 0, maka kecerunan = 0.'],
  ['Garis lurus yang mencancang mempunyai kecerunan tidak tertakrif.', true, 'Jarak mengufuk = 0 dan pembahagian dengan sifar tidak tertakrif.'],
  ['Garis lurus yang naik dari kiri ke kanan mempunyai kecerunan positif.', true, 'Kecerunan positif: garis naik dari kiri ke kanan.'],
  ['Garis lurus dengan kecerunan −3 lebih curam daripada garis lurus dengan kecerunan 2.', true, 'Tanpa mengambil kira tanda, 3 > 2, maka garis berkecerunan −3 lebih curam.'],
  ['Kecerunan paksi-x ialah sifar.', true, 'Paksi-x ialah garis mengufuk, maka kecerunannya sifar.'],
  ['Garis lurus yang turun dari kiri ke kanan mempunyai kecerunan positif.', false, 'Garis yang turun dari kiri ke kanan mempunyai kecerunan negatif.'],
  ['Kecerunan paksi-y ialah sifar.', false, 'Paksi-y ialah garis mencancang, maka kecerunannya tidak tertakrif.'],
  ['Garis lurus dengan kecerunan 1/2 lebih curam daripada garis lurus dengan kecerunan 2.', false, '2 lebih besar daripada 1/2, maka garis berkecerunan 2 lebih curam.'],
  ['Garis lurus dengan kecerunan negatif sentiasa kurang curam daripada garis lurus dengan kecerunan positif.', false, 'Tanda hanya menunjukkan arah. Kecuraman dibandingkan tanpa mengambil kira tanda.']
];

/* =================== rajah =================== */
const gdT = (x, y, t, c = 'tx', sz = 17, a = 'middle') => /[\u0001\u0004]/.test(gdBtTok(String(t))) ? gdBtSvg(x, y, t, `style="fill:var(--${c})" font-family="Space Grotesk, sans-serif"`, sz, a) : `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const gdL = (p, q, c, w = 3.5, dash) => `<line x1="${+p[0].toFixed(1)}" y1="${+p[1].toFixed(1)}" x2="${+q[0].toFixed(1)}" y2="${+q[1].toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
// segi tiga cerun: o = { v, h, up, L:[kaki, sudut tegak, puncak], vl, hl, sl, plain }
function gdTriFig(o) {
  const { v, h } = o, up = o.up !== false, rt = v / h;
  let w, hh;
  if (rt * 220 <= 150) { w = 220; hh = Math.max(26, 220 * rt); } else { hh = 150; w = Math.max(36, 150 / rt); }
  const y0 = 178, x0 = up ? 40 : 280 - w;
  const B = up ? [x0, y0] : [x0 + w, y0], R = up ? [x0 + w, y0] : [x0, y0], T = up ? [x0 + w, y0 - hh] : [x0, y0 - hh];
  const cv = o.plain ? 'mu' : 'tr', ch = o.plain ? 'mu' : 'pk';
  let s = `<polygon points="${B.join(',')} ${R.join(',')} ${T.join(',')}" style="fill:var(--am);fill-opacity:.14;stroke:none"/>`;
  s += gdL(B, R, ch, 3.5) + gdL(R, T, cv, 3.5) + gdL(B, T, 'am', 5);
  const sx = up ? -12 : 12;
  s += `<polyline points="${R[0] + sx},${R[1]} ${R[0] + sx},${R[1] - 12} ${R[0]},${R[1] - 12}" style="fill:none;stroke:var(--tx)" stroke-width="1.8"/>`;
  if (o.vl) s += gdT(R[0] + (up ? 12 : -12), (R[1] + T[1]) / 2, o.vl, cv, 17, up ? 'start' : 'end');
  if (o.hl) s += gdT((B[0] + R[0]) / 2, y0 + 24, o.hl, ch, 17);
  if (o.sl) {
    const dx = T[0] - B[0], dy = T[1] - B[1], ln = Math.hypot(dx, dy);
    let nx = dy / ln, ny = -dx / ln; if (ny > 0) { nx = -nx; ny = -ny; }
    s += gdT((B[0] + T[0]) / 2 + nx * 14, (B[1] + T[1]) / 2 + ny * 14, o.sl, 'am', 17, nx < 0 ? 'end' : 'start');
  }
  if (o.L) {
    const c = [(B[0] + R[0] + T[0]) / 3, (B[1] + R[1] + T[1]) / 3];
    [B, R, T].forEach((p, i) => { const dx = p[0] - c[0], dy = p[1] - c[1], ln = Math.hypot(dx, dy) || 1; s += gdT(p[0] + dx / ln * 17, p[1] + dy / ln * 17, o.L[i], 'tx', 19); });
  }
  return `<svg viewBox="0 0 320 214" role="img" aria-label="${esc(o.label || 'Segi tiga cerun')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// satah Cartes (plot teras)
function gdBox(xs, ys) {
  let x0 = Math.min(0, ...xs) - 1, x1 = Math.max(0, ...xs) + 1, y0 = Math.min(0, ...ys) - 1, y1 = Math.max(0, ...ys) + 1;
  while (x1 - x0 < 8) { x0--; if (x1 - x0 < 8) x1++; }
  while (y1 - y0 < 6) { y0--; if (y1 - y0 < 6) y1++; }
  return { x0, x1, y0, y1 };
}
function gdClip(p, q, b) {
  const dx = q[0] - p[0], dy = q[1] - p[1]; let t0 = -Infinity, t1 = Infinity;
  const lim = (d, s, lo, hi) => { if (d === 0) return; let a = (lo - s) / d, c = (hi - s) / d; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); };
  lim(dx, p[0], b.x0, b.x1); lim(dy, p[1], b.y0, b.y1);
  return [[+(p[0] + t0 * dx).toFixed(3), +(p[1] + t0 * dy).toFixed(3)], [+(p[0] + t1 * dx).toFixed(3), +(p[1] + t1 * dy).toFixed(3)]];
}
function gdPlane(o) {
  const xs = [], ys = [];
  (o.pts || []).forEach(p => { xs.push(p.x); ys.push(p.y); });
  (o.lines || []).forEach(l => { if (l.seg) { xs.push(l.a[0], l.b[0]); ys.push(l.a[1], l.b[1]); } });
  const b = o.box || gdBox(xs.length ? xs : [0], ys.length ? ys : [0]), items = [];
  (o.lines || []).forEach(l => { const [p, q] = l.seg ? [l.a, l.b] : gdClip(l.a, l.b, b); items.push({ t: 'line', a: p, b: q, c: l.c || 'am', w: l.w || 4, dash: l.dash }); });
  (o.texts || []).forEach(t => items.push(Object.assign({ t: 'text' }, t)));
  (o.pts || []).forEach(p => {
    const right = p.x > (b.x0 + b.x1) / 2, top = p.y >= b.y1 - .6;
    items.push({ t: 'pt', x: p.x, y: p.y, c: p.c || 'tx', l: p.l, dx: right ? -12 : 12, dy: top ? 28 : -12, anchor: right ? 'end' : 'start' });
  });
  return plot(Object.assign({}, b, { items, label: o.label || 'Satah Cartes' }));
}
// kaki mencancang & mengufuk antara dua titik (untuk figAns)
const gdLegs = (x1, y1, x2, y2) => ({
  lines: [{ a: [x1, y1], b: [x2, y1], c: 'pk', w: 3, dash: true, seg: true }, { a: [x2, y1], b: [x2, y2], c: 'tr', w: 3, dash: true, seg: true }],
  texts: [{ x: (x1 + x2) / 2, y: y1 + (y2 > y1 ? -.45 : .3), s: fmt(x2 - x1), c: 'pk', size: 17 }, { x: x2 + (x2 > x1 ? .5 : -.5), y: (y1 + y2) / 2, s: fmt(y2 - y1), c: 'tr', size: 17 }]
});
function gdTwoPt(A, B, x1, y1, x2, y2, coords, legs) {
  const pts = [{ x: x1, y: y1, l: coords ? `${A}${P(x1, y1)}` : A, c: 'am' }, { x: x2, y: y2, l: coords ? `${B}${P(x2, y2)}` : B, c: 'pk' }];
  const o = { pts, lines: [{ a: [x1, y1], b: [x2, y2], c: 'am', w: 3.5 }], label: `Garis lurus ${A}${B}` };
  if (legs) { const g = gdLegs(x1, y1, x2, y2); o.lines = o.lines.concat(g.lines); o.texts = g.texts; }
  return gdPlane(o);
}
// graf dengan paksi bernama (situasi harian)
function gdAxFig(yl, xl, Y, X) {
  let s = `<line x1="56" y1="186" x2="292" y2="186" style="stroke:var(--mu)" stroke-width="2.5"/><line x1="56" y1="186" x2="56" y2="18" style="stroke:var(--mu)" stroke-width="2.5"/>`;
  s += gdL([56, 40], [250, 186], 'am', 5) + `<circle cx="56" cy="40" r="6" style="fill:var(--tr)"/><circle cx="250" cy="186" r="6" style="fill:var(--pk)"/>`;
  s += gdT(48, 40, Y, 'tr', 16, 'end') + gdT(250, 204, X, 'pk', 16) + gdT(48, 194, 'O', 'mu', 15, 'end') + gdT(64, 14, yl, 'tx', 15, 'start') + gdT(300, 168, xl, 'tx', 15, 'end');
  return `<svg viewBox="0 0 320 214" role="img" aria-label="Graf garis lurus" font-family="Inter, sans-serif">${s}</svg>`;
}
// rajah games (gSvg teras, R = 6)
const GDR = 6, GDGB = { x0: -GDR, x1: GDR, y0: -GDR, y1: GDR };
const gdGFig = (pts, lines, label) => gSvg(GDR, (lines || []).map(([a, b, c]) => { const [p, q] = gdClip(a, b, GDGB); return gLine(p, q, c || 'am', .13); }).join('') + (pts || []).map(([x, y, c, l]) => gPt(x, y, c, l)).join(''), label || 'Satah Cartes');
const gdGTxt = (x, y, t, c) => `<text x="${x}" y="${-y}" font-size=".55" font-weight="700" text-anchor="middle" dominant-baseline="central" style="fill:var(--${c})">${t}</text>`;
const gdGLegs = (x1, y1, x2, y2) => gLine([x1, y1], [x2, y1], 'pk', .09, true) + gLine([x2, y1], [x2, y2], 'tr', .09, true) + gdGTxt((x1 + x2) / 2, y1 + (y2 > y1 ? -.45 : .45), fmt(x2 - x1), 'pk') + gdGTxt(x2 + (x2 > x1 ? .55 : -.55), (y1 + y2) / 2, fmt(y2 - y1), 'tr');

/* =================== jalan kerja bersama =================== */
const gdW2 = (x1, y1, x2, y2) => {
  const raw = `${fmt(y2 - y1)}/${par(x2 - x1)}`, m = gdFr(y2 - y1, x2 - x1);
  return ['m = (y₂ − y₁) / (x₂ − x₁)', `= (${fmt(y2)} − ${par(y1)}) / (${fmt(x2)} − ${par(x1)})`, `= ${raw}`].concat(raw === m ? [] : [`= ${m}`]);
};
const gdNeg = b => (b < 0 ? `−(${fmt(b)})` : `−${b}`);
const gdWPin = (a, b) => ['m = −(pintasan-y) / (pintasan-x)', `= ${gdNeg(b)} / ${par(a)}`, `= ${gdFr(-b, a)}`];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 10.1.1 Kecerunan & Jarak ---------- */
  kenalJarak: [
    ({ what, slope, tri }) => ({ q: `Rajah di bawah menunjukkan sebuah cerun ${slope} yang membentuk segi tiga bersudut tegak ${tri}. Namakan sisi yang mewakili jarak ${what}.` }),
    ({ what, slope }) => ({ q: `Berdasarkan rajah di bawah, sisi manakah ialah jarak ${what} bagi cerun ${slope}?` }),
    ({ what, slope }) => ({ q: `Dalam rajah di bawah, ${slope} ialah sebuah tanjakan. Nyatakan sisi yang mewakili jarak ${what} tanjakan itu.` }),
    ({ what, other, otherWhat, slope, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sisi ${other} dalam rajah di bawah ialah jarak ${what} bagi cerun ${slope}. Adakah ${N} betul?` }, salah(N, ans, `${other} ialah jarak ${otherWhat}.`)); }
  ],
  kecJarak: [
    ({ v, h }) => ({ q: `Jarak mencancang sebuah cerun ialah ${v} m dan jarak mengufuknya ialah ${h} m. Hitung kecerunan cerun itu.` }),
    ({ v, h }) => ({ q: `Sekeping papan disandarkan pada sebuah tembok. Hujung atas papan berada ${v} m dari tanah dan hujung bawahnya berada ${h} m dari tembok. Cari kecerunan papan itu.` }),
    ({ v, h }) => ({ q: `Sebatang jalan menaik setinggi ${v} m bagi jarak mengufuk sejauh ${h} m. Berapakah kecerunan jalan itu?` }),
    ({ v, h }) => ({ q: `Bumbung sebuah pondok naik ${v} m secara mencancang bagi setiap ${h} m secara mengufuk. Tentukan kecerunan bumbung itu.` }),
    ({ v, h, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah papan gelongsor mempunyai jarak mencancang ${v} m dan jarak mengufuk ${h} m. ${N} berkata kecerunannya ialah ${gdFr(h, v)}. Adakah ${N} betul?` }, salah(N, ans, `${N} membahagikan jarak mengufuk dengan jarak mencancang. Sepatutnya jarak mencancang ÷ jarak mengufuk.`)); },
    ({ v, h }) => ({ q: `Lengkapkan: Kecerunan = jarak mencancang ÷ jarak mengufuk = ${v} ÷ ${h} = ___` })
  ],
  kecRajah: [
    ({ slope }) => ({ q: `Rajah di bawah menunjukkan sebuah cerun ${slope}. Hitung kecerunan ${slope}.` }),
    ({ slope }) => ({ q: `Berdasarkan ukuran dalam rajah di bawah, cari kecerunan garis ${slope}.` }),
    ({ slope, v, c, ans }) => { const N = vnama(); return Object.assign({ q: `Rajah di bawah menunjukkan sebuah cerun ${slope}. ${N} mengira kecerunannya sebagai ${gdFr(v, c)} dengan membahagikan jarak mencancang dengan panjang cerun. Adakah ${N} betul?` }, salah(N, ans, `Penyebut mestilah jarak mengufuk, bukan panjang cerun ${slope}.`)); },
    ({ slope }) => ({ q: `Rajah di bawah menunjukkan sebuah tanjakan kerusi roda ${slope}. Berapakah kecerunan tanjakan itu?` })
  ],
  cariV: [
    ({ m, h }) => ({ q: `Kecerunan sebuah cerun ialah ${m}. Jika jarak mengufuknya ${h} m, cari jarak mencancangnya.` }),
    ({ m, h }) => ({ q: `Sebatang jalan mempunyai kecerunan ${m}. Seorang penunggang basikal bergerak sejauh ${h} m secara mengufuk di sepanjang jalan itu. Berapakah ketinggian yang dinaikinya?` }),
    ({ m, h }) => ({ q: `Bumbung sebuah pondok mempunyai kecerunan ${m} dan jarak mengufuk ${h} m. Hitung tinggi bumbung itu.` }),
    ({ m, h, p, q, ans }) => { const N = vnama(); return Object.assign({ q: `Kecerunan sebuah cerun ialah ${m} dan jarak mengufuknya ${h} m. ${N} berkata jarak mencancangnya ialah ${gdFr(h * q, p)} m. Adakah ${N} betul?` }, salah(N, ans, `${N} membahagikan jarak mengufuk dengan kecerunan. Sepatutnya jarak mencancang = kecerunan × jarak mengufuk.`)); }
  ],
  cariH: [
    ({ m, v }) => ({ q: `Kecerunan sebuah cerun ialah ${m} dan jarak mencancangnya ialah ${v} m. Cari jarak mengufuk cerun itu.` }),
    ({ m, v }) => ({ q: `Sebatang jalan bukit mempunyai kecerunan ${m}. Jalan itu naik setinggi ${v} m. Berapakah jarak mengufuk jalan itu?` }),
    ({ m, v }) => ({ q: `Sebuah tanjakan setinggi ${v} m mempunyai kecerunan ${m}. Berapakah jarak mengufuk tanjakan itu?` }),
    ({ m, v }) => ({ q: `Lengkapkan: Jarak mengufuk = jarak mencancang ÷ kecerunan = ${v} ÷ ${m} = ___ m` })
  ],
  banding: [
    ({ X, Y, v1, h1, v2, h2, S, mS, mW }) => ({ q: `Cerun ${X} mempunyai jarak mencancang ${v1} m dan jarak mengufuk ${h1} m. Cerun ${Y} mempunyai jarak mencancang ${v2} m dan jarak mengufuk ${h2} m. Cerun manakah lebih curam?`, ans: `Cerun ${S}, kerana kecerunannya (${mS}) lebih besar daripada ${mW}` }),
    ({ X, Y, v1, h1, v2, h2, S, mS, mW }) => ({ q: `Dua batang jalan, ${X} dan ${Y}, menaik ke sebuah bukit. Jalan ${X} naik ${v1} m bagi jarak mengufuk ${h1} m, manakala jalan ${Y} naik ${v2} m bagi jarak mengufuk ${h2} m. Jalan manakah lebih curam? Beri sebab.`, ans: `Jalan ${S}, kerana kecerunannya (${mS}) lebih besar daripada ${mW}` }),
    ({ X, Y, v1, h1, v2, h2, S, W, mS, mW }) => { const N = vnama(); return { q: `Gelongsor ${X} setinggi ${v1} m dengan jarak mengufuk ${h1} m, manakala gelongsor ${Y} setinggi ${v2} m dengan jarak mengufuk ${h2} m. ${N} berkata gelongsor ${W} lebih curam. Adakah ${N} betul?`, ans: `Tidak betul. Gelongsor ${S} lebih curam kerana ${mS} > ${mW}` }; },
    ({ X, Y, v1, h1, v2, h2, S, mS, mW }) => ({ q: `Antara tanjakan ${X} (tinggi ${v1} m, jarak mengufuk ${h1} m) dan tanjakan ${Y} (tinggi ${v2} m, jarak mengufuk ${h2} m), yang manakah lebih curam?`, ans: `Tanjakan ${S}, kerana kecerunannya (${mS}) lebih besar daripada ${mW}` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  k111: [
    ({ ta, tb, tc }) => ({ q: `Sebatang tangga sepanjang ${tc} m disandarkan pada dinding tegak di atas lantai mengufuk. Kaki tangga berada ${tb} m dari dinding. Hitung kecerunan tangga itu.`, ans: gdFr(ta, tb), work: ['Tangga, dinding dan lantai membentuk segi tiga bersudut tegak.', `Jarak mencancang = √(${tc}² − ${tb}²) = √${tc * tc - tb * tb} = ${ta} m`, `Kecerunan = ${ta} ÷ ${tb} = ${gdFr(ta, tb)}`] }),
    ({ vc, hm }) => ({ q: `Sebatang jalan menaik ${vc} cm bagi setiap ${hm} m jarak mengufuk. Cari kecerunan jalan itu.`, ans: gdFr(vc, hm * 100), work: [`Tukar kepada unit yang sama: ${hm} m = ${hm * 100} cm.`, `Kecerunan = ${vc} ÷ ${hm * 100}`, `= ${gdFr(vc, hm * 100)}`] }),
    ({ bm, H, x, hk, Dt, rem }) => ({ q: `Sebuah bukit mempunyai cerun lurus dengan kecerunan ${bm}. Puncak bukit itu ${H} m lebih tinggi daripada kakinya. Seorang pendaki telah berjalan sejauh ${x} m secara mengufuk dari kaki bukit. (a) Berapakah ketinggian pendaki itu sekarang? (b) Berapakah lagi jarak mengufuk ke puncak?`, ans: `(a) ${hk} m (b) ${rem} m`, work: [`(a) Jarak mencancang = ${bm} × ${x} = ${hk} m`, `(b) Jumlah jarak mengufuk ke puncak = ${H} ÷ ${bm} = ${Dt} m`, `Baki = ${Dt} − ${x} = ${rem} m`] }),
    ({ W, Tb }) => ({ q: `Bumbung sebuah rumah berbentuk segi tiga sama kaki. Lebar bumbung ialah ${W} m dan puncaknya ${Tb} m di atas alang mengufuk. Hitung kecerunan sebelah bumbung itu.`, ans: gdFr(Tb, W / 2), work: [`Puncak berada di tengah-tengah, jadi jarak mengufuk sebelah bumbung = ${W} ÷ 2 = ${W / 2} m.`, `Kecerunan = ${Tb} ÷ ${W / 2} = ${gdFr(Tb, W / 2)}`] }),
    ({ vr }) => ({ q: `Kecerunan maksimum bagi sebuah tanjakan kerusi roda ialah 1/12. Lantai pintu masuk sebuah dewan berada ${vr} cm lebih tinggi daripada tanah. Berapakah jarak mengufuk minimum bagi tanjakan itu? Beri jawapan dalam meter.`, ans: `${gdNum(12 * vr / 100)} m`, work: ['Kecerunan = jarak mencancang ÷ jarak mengufuk', `1/12 = ${vr} ÷ jarak mengufuk`, `Jarak mengufuk = ${vr} × 12 = ${12 * vr} cm = ${gdNum(12 * vr / 100)} m`] })
  ],

  /* ---------- 10.1.2 Rumus Dua Titik ---------- */
  duaTitik: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Hitung kecerunan garis lurus yang melalui titik ${A}${P(x1, y1)} dan titik ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Cari kecerunan garis lurus ${A}${B}, dengan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Titik ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} terletak pada satu garis lurus. Apakah kecerunan garis itu?` }),
    ({ A, B, x1, y1, x2, y2, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira kecerunan garis lurus yang melalui ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} sebagai (${fmt(y2)} − ${par(y1)}) / (${fmt(x1)} − ${par(x2)}) = ${gdFr(y2 - y1, x1 - x2)}. Adakah ${N} betul?` }, salah(N, ans, `${N} menolak koordinat-x mengikut susunan yang berbeza. Susunan titik mesti sama pada pengangka dan penyebut.`)); },
    ({ x1, y1, x2, y2 }) => ({ q: `Lengkapkan: m = (${fmt(y2)} − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ___` }),
    ({ x1, y1, x2, y2 }) => ({ q: `Pada sebuah peta bergrid, sekolah terletak di ${P(x1, y1)} dan perpustakaan di ${P(x2, y2)}. Cari kecerunan jalan lurus yang menghubungkan kedua-dua tempat itu.` })
  ],
  bacaRajah: [
    ({ A, B }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${A}${B} pada satah Cartes. Cari kecerunan ${A}${B}.` }),
    ({ A, B, x1, y1, x2, y2, m }) => ({ q: `Berdasarkan rajah di bawah, nyatakan koordinat titik ${A} dan ${B}, seterusnya hitung kecerunan garis lurus ${A}${B}.`, ans: `${A}${P(x1, y1)}, ${B}${P(x2, y2)}; m = ${m}` }),
    ({ A, B }) => ({ q: `Dua titik, ${A} dan ${B}, ditandakan pada satah Cartes di bawah. Apakah kecerunan garis lurus yang melalui kedua-dua titik itu?` }),
    ({ A, B }) => ({ q: `Sebuah dron terbang lurus dari titik ${A} ke titik ${B} seperti dalam rajah di bawah. Cari kecerunan laluan dron itu.` })
  ],
  koordY: [
    ({ A, B, x1, y1, x2, m }) => ({ q: `Kecerunan garis lurus yang melalui ${A}${P(x1, y1)} dan ${B}(${fmt(x2)}, k) ialah ${m}. Cari nilai k.` }),
    ({ A, B, x1, y1, x2, m }) => ({ q: `Garis lurus ${A}${B} mempunyai kecerunan ${m}. Diberi ${A}${P(x1, y1)} dan ${B}(${fmt(x2)}, k), hitung nilai k.` }),
    ({ x1, y1, x2, m }) => ({ q: `Lengkapkan: (k − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ${m}, maka k = ___` }),
    ({ x1, y1, x2, m }) => ({ q: `Seekor semut merayap di sepanjang satu garis lurus berkecerunan ${m} dari titik ${P(x1, y1)} ke titik (${fmt(x2)}, k). Cari nilai k.` })
  ],
  koordX: [
    ({ A, B, x1, y1, y2, m }) => ({ q: `Kecerunan garis lurus yang melalui ${A}${P(x1, y1)} dan ${B}(h, ${fmt(y2)}) ialah ${m}. Cari nilai h.` }),
    ({ A, B, x1, y1, y2, m }) => ({ q: `Garis lurus ${A}${B} berkecerunan ${m}. Diberi ${A}${P(x1, y1)} dan ${B}(h, ${fmt(y2)}), hitung nilai h.` }),
    ({ x1, y1, y2, m }) => ({ q: `Lengkapkan: (${fmt(y2)} − ${par(y1)}) / (h − ${par(x1)}) = ${m}, maka h = ___` }),
    ({ A, B, x1, y1, y2, m }) => ({ q: `Sebuah kereta kawalan jauh bergerak lurus dari ${A}${P(x1, y1)} ke ${B}(h, ${fmt(y2)}) di atas lantai bergrid. Kecerunan laluannya ialah ${m}. Cari nilai h.` })
  ],
  k112: [
    ({ s }) => ({ q: `Titik A${P(s.x1, s.y1)}, B${P(s.x2, s.y2)} dan C(${fmt(s.x3)}, k) terletak pada garis lurus yang sama. Cari nilai k.`, ans: `k = ${fmt(s.k)}`, work: [`m<sub>AB</sub> = (${fmt(s.y2)} − ${par(s.y1)}) / (${fmt(s.x2)} − ${par(s.x1)}) = ${s.m}`, 'A, B dan C segaris, maka m<sub>BC</sub> = m<sub>AB</sub>.', `(k − ${par(s.y2)}) / (${fmt(s.x3)} − ${par(s.x2)}) = ${s.m}`, `k − ${par(s.y2)} = ${gdPm(s.m)} × ${par(s.x3 - s.x2)} = ${fmt(s.k - s.y2)}`, `k = ${fmt(s.k)}`] }),
    ({ g }) => { const am = Math.abs(g.m); return { q: `Garis lurus yang melalui titik A(h, ${fmt(g.a)}) dan B(${fmt(g.b)}, h) mempunyai kecerunan ${fmt(g.m)}. Cari nilai h.`, ans: `h = ${fmt(g.h)}`, work: [`(h − ${par(g.a)}) / (${fmt(g.b)} − h) = ${fmt(g.m)}`, `h − ${par(g.a)} = ${fmt(g.m)}(${fmt(g.b)} − h)`, `h − ${par(g.a)} = ${fmt(g.m * g.b)} ${g.m > 0 ? '−' : '+'} ${am === 1 ? '' : am}h`, `h ${g.m > 0 ? '+' : '−'} ${am === 1 ? '' : am}h = ${fmt(g.m * g.b)} + ${par(g.a)}`, `${gdCoef(1 + g.m)}h = ${fmt(g.m * g.b + g.a)}`, `h = ${fmt(g.h)}`] }; },
    ({ c }) => ({ q: `Diberi A${P(c.x1, c.y1)}, B${P(c.x2, c.y2)} dan C${P(c.x3, c.y3)}. Tentukan sama ada titik C terletak pada garis lurus AB. Tunjukkan pengiraan anda.`, ans: c.on ? `Ya, kerana m<sub>AB</sub> = m<sub>AC</sub> = ${c.m}` : `Tidak, kerana m<sub>AB</sub> = ${c.m} tetapi m<sub>AC</sub> = ${c.mAC}`, work: [`m<sub>AB</sub> = (${fmt(c.y2)} − ${par(c.y1)}) / (${fmt(c.x2)} − ${par(c.x1)}) = ${c.m}`, `m<sub>AC</sub> = (${fmt(c.y3)} − ${par(c.y1)}) / (${fmt(c.x3)} − ${par(c.x1)}) = ${c.mAC}`, c.on ? 'Kecerunan sama dan berkongsi titik A, maka C terletak pada garis AB.' : 'Kecerunan berbeza, maka C tidak terletak pada garis AB.'] }),
    ({ kc }) => ({ q: `Sebuah kereta kabel bergerak di sepanjang kabel lurus dari stesen bawah S(0, ${kc.y0}) ke stesen atas T(${kc.X}, ${kc.YT}). Semua ukuran dalam meter. (a) Hitung kecerunan kabel itu. (b) Berapakah ketinggian kereta kabel apabila jarak mengufuknya ${kc.d} m dari stesen bawah?`, ans: `(a) ${kc.m} (b) ${kc.y0 + kc.rise} m`, work: [`(a) m = (${kc.YT} − ${kc.y0}) / (${kc.X} − 0) = ${kc.YT - kc.y0}/${kc.X} = ${kc.m}`, `(b) Kenaikan = ${kc.m} × ${kc.d} = ${kc.rise} m`, `Ketinggian = ${kc.y0} + ${kc.rise} = ${kc.y0 + kc.rise} m`] })
  ],

  /* ---------- 10.1.3 Arah & Pintasan ---------- */
  jenisRajah: [
    ({ L }) => ({ q: `Nyatakan sama ada kecerunan garis lurus ${L} dalam rajah di bawah adalah positif, negatif, sifar atau tidak tertakrif.` }),
    ({ L }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${L} pada satah Cartes. Apakah jenis kecerunan ${L}?` }),
    ({ L }) => ({ q: `Perhatikan arah kecondongan garis lurus ${L} dalam rajah di bawah. Adakah kecerunannya positif, negatif, sifar atau tidak tertakrif?` }),
    ({ L, ans, claim, claimDesc }) => { const N = vnama(); return Object.assign({ q: `${N} berkata kecerunan garis lurus ${L} dalam rajah di bawah ialah ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, `Kecerunan ${claim.toLowerCase()} adalah bagi garis lurus yang ${claimDesc}.`)); }
  ],
  jenisTitik: [
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Tentukan jenis kecerunan (positif, negatif, sifar atau tidak tertakrif) bagi garis lurus yang melalui ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.` }),
    ({ A, B, x1, y1, x2, y2 }) => ({ q: `Garis lurus ${A}${B} melalui ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}. Adakah kecerunan ${A}${B} positif, negatif, sifar atau tidak tertakrif?` }),
    ({ A, B, x1, y1, x2, y2, dir, ans }) => ({ q: `Tanpa melukis, nyatakan sama ada garis lurus yang menyambungkan ${A}${P(x1, y1)} dan ${B}${P(x2, y2)} naik dari kiri ke kanan, turun dari kiri ke kanan, mengufuk atau mencancang. Seterusnya nyatakan jenis kecerunannya.`, ans: `${dir}; kecerunan ${ans[0].toLowerCase() + ans.slice(1)}` }),
    ({ x1, y1, x2, y2 }) => ({ q: `Sebuah kapal terbang kertas meluncur lurus dari titik ${P(x1, y1)} ke titik ${P(x2, y2)} pada satah Cartes. Apakah jenis kecerunan laluannya?` })
  ],
  pintasan: [
    ({ a, b }) => ({ q: `Sebuah garis lurus mempunyai pintasan-x ${fmt(a)} dan pintasan-y ${fmt(b)}. Hitung kecerunan garis lurus itu.` }),
    ({ L, a, b }) => ({ q: `Garis lurus ${L} memotong paksi-x pada ${P(a, 0)} dan memotong paksi-y pada ${P(0, b)}. Cari kecerunan ${L}.` }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah garis lurus. Dengan menggunakan pintasan-x dan pintasan-y, hitung kecerunannya.' }),
    ({ a, b, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah garis lurus mempunyai pintasan-x ${fmt(a)} dan pintasan-y ${fmt(b)}. ${N} berkata kecerunannya ialah ${gdFr(b, a)}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa tanda negatif dalam rumus m = −(pintasan-y)/(pintasan-x).`)); },
    ({ a, b }) => ({ q: `Lengkapkan: m = −(pintasan-y) / (pintasan-x) = ${gdNeg(b)} / ${par(a)} = ___` })
  ],
  curam: [
    ({ n, ms }) => ({ q: `Kecerunan garis lurus ${gdDan(n)} masing-masing ialah ${gdDan(ms)}. Garis lurus manakah paling curam?` }),
    ({ n, ms, S }) => ({ q: `Tiga batang jalan lurus, ${gdDan(n)}, masing-masing mempunyai kecerunan ${gdDan(ms)}. Jalan manakah paling curam?`, ans: `Jalan ${S}` }),
    ({ n, ms, S, claim, big }) => { const N = vnama(); return Object.assign({ q: `Garis lurus ${gdDan(n)} masing-masing mempunyai kecerunan ${gdDan(ms)}. ${N} berkata garis ${claim} paling curam${big ? ' kerana nilai kecerunannya paling besar' : ''}. Adakah ${N} betul?` }, salah(N, `Garis ${S}`, 'Tanda positif atau negatif hanya menunjukkan arah; kecuraman bergantung pada nilai kecerunan tanpa tanda.')); },
    ({ n, ms, order }) => ({ q: `Susun garis lurus ${gdDan(n.map((x, i) => `${x} (m = ${ms[i]})`))} mengikut tertib kecuraman, bermula dengan yang paling curam.`, ans: order.join(', ') })
  ],
  cariPinY: [
    ({ m, a }) => ({ q: `Sebuah garis lurus mempunyai kecerunan ${m} dan pintasan-x ${fmt(a)}. Cari pintasan-y garis lurus itu.` }),
    ({ L, m, a, b }) => ({ q: `Garis lurus ${L} berkecerunan ${m} memotong paksi-x pada titik ${P(a, 0)}. Nyatakan koordinat titik ${L} memotong paksi-y.`, ans: P(0, b) }),
    ({ m, a }) => ({ q: `Lengkapkan: ${m} = −(pintasan-y) / ${par(a)}, maka pintasan-y = ___` }),
    ({ m, a, b, ans }) => { const N = vnama(); return Object.assign({ q: `Kecerunan sebuah garis lurus ialah ${m} dan pintasan-x ialah ${fmt(a)}. ${N} mendapati pintasan-y ialah ${fmt(-b)}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa tanda negatif dalam rumus m = −(pintasan-y)/(pintasan-x).`)); }
  ],
  cariPinX: [
    ({ m, b }) => ({ q: `Sebuah garis lurus mempunyai kecerunan ${m} dan pintasan-y ${fmt(b)}. Cari pintasan-x garis lurus itu.` }),
    ({ L, m, a, b }) => ({ q: `Garis lurus ${L} berkecerunan ${m} memotong paksi-y pada titik ${P(0, b)}. Nyatakan koordinat titik ${L} memotong paksi-x.`, ans: P(a, 0) }),
    ({ m, b }) => ({ q: `Lengkapkan: ${m} = −(${fmt(b)}) / (pintasan-x), maka pintasan-x = ___` }),
    ({ m, b }) => ({ q: `Sebatang paip lurus dilukis pada satah Cartes dengan kecerunan ${m}. Paip itu memotong paksi-y pada ${fmt(b)}. Pada nilai x berapakah paip itu memotong paksi-x?` })
  ],
  pinRajah: [
    ({ L }) => ({ q: `Rajah di bawah menunjukkan garis lurus ${L}. Nyatakan pintasan-x dan pintasan-y, kemudian hitung kecerunan ${L}.` }),
    ({ m }) => ({ q: 'Berdasarkan rajah di bawah, cari kecerunan garis lurus itu dengan menggunakan pintasannya.', ans: `m = ${m}` }),
    ({ m }) => ({ q: 'Garis lurus dalam rajah di bawah memotong paksi-x dan paksi-y. Tentukan kecerunannya dan nyatakan sama ada garis itu naik atau turun dari kiri ke kanan.', ans: `m = ${m}; garis ${m[0] === '−' ? 'turun' : 'naik'} dari kiri ke kanan` })
  ],
  k113: [
    ({ tk }) => ({ q: `Graf garis lurus bagi isi padu air, V liter, dalam sebuah tangki melawan masa, t minit, memotong paksi-V pada ${tk.V0} dan paksi-t pada ${tk.T}. (a) Hitung kecerunan graf itu. (b) Tafsirkan maksud kecerunan tersebut.`, ans: `(a) −${tk.rate} (b) Isi padu air dalam tangki berkurang ${tk.rate} liter setiap minit`, work: ['m = −(pintasan-y) / (pintasan-x)', `= −${tk.V0} / ${tk.T} = −${tk.rate}`, `Kecerunan negatif bermaksud isi padu air semakin berkurang, iaitu ${tk.rate} liter bagi setiap minit.`] }),
    ({ tp }) => ({ q: `Garis lurus ${tp.L} melalui titik ${P(tp.x1, tp.y1)} dan mempunyai pintasan-y ${fmt(tp.c)}. Cari (a) kecerunan ${tp.L}, (b) pintasan-x ${tp.L}.`, ans: `(a) ${tp.m} (b) ${fmt(tp.a)}`, work: [`Pintasan-y ${fmt(tp.c)} bermaksud garis melalui ${P(0, tp.c)}.`, `(a) m = (${fmt(tp.y1)} − ${par(tp.c)}) / (${fmt(tp.x1)} − 0) = ${tp.m}`, `(b) pintasan-x = −(pintasan-y) ÷ m = −(${fmt(tp.c)}) ÷ ${gdPm(tp.m)} = ${fmt(tp.a)}`] }),
    ({ kk }) => ({ q: `Pintasan-y sebuah garis lurus ialah ${kk.K} kali pintasan-x, dan kedua-dua pintasan itu positif. Garis lurus itu melalui titik ${P(kk.x1, kk.y1)}. Cari (a) kecerunan garis lurus itu, (b) pintasan-x dan pintasan-y.`, ans: `(a) −${kk.K} (b) pintasan-x = ${kk.h}, pintasan-y = ${kk.K * kk.h}`, work: [`Katakan pintasan-x = h, maka pintasan-y = ${kk.K}h.`, `(a) m = −(${kk.K}h) / h = −${kk.K}`, `(b) Guna titik (h, 0) dan ${P(kk.x1, kk.y1)}: (${fmt(kk.y1)} − 0) / (${fmt(kk.x1)} − h) = −${kk.K}`, `${fmt(kk.y1)} = −${kk.K}(${fmt(kk.x1)} − h), maka h = ${kk.h}`, `Pintasan-x = ${kk.h}, pintasan-y = ${kk.K} × ${kk.h} = ${kk.K * kk.h}`] }),
    ({ dg }) => ({ q: `Garis lurus AB melalui A${P(dg.a[0], dg.a[1])} dan B${P(dg.b[0], dg.b[1])}, manakala garis lurus CD melalui C${P(dg.c[0], dg.c[1])} dan D${P(dg.d[0], dg.d[1])}. (a) Nyatakan jenis kecerunan setiap garis. (b) Garis manakah lebih curam?`, ans: `(a) AB: ${dg.t1} (m = ${dg.m1}); CD: ${dg.t2} (m = ${dg.m2}) (b) ${dg.S}`, work: [`m<sub>AB</sub> = (${fmt(dg.b[1])} − ${par(dg.a[1])}) / (${fmt(dg.b[0])} − ${par(dg.a[0])}) = ${dg.m1}, iaitu ${dg.t1.toLowerCase()}.`, `m<sub>CD</sub> = (${fmt(dg.d[1])} − ${par(dg.c[1])}) / (${fmt(dg.d[0])} − ${par(dg.c[0])}) = ${dg.m2}, iaitu ${dg.t2.toLowerCase()}.`, `Bandingkan tanpa tanda: ${dg.u1} dan ${dg.u2}. Maka ${dg.S} lebih curam.`] })
  ]
};

/* =================== pembina soalan (r = gdRG atau gdRW) =================== */
const GD = {};
/* ---------- 10.1.1 ---------- */
GD.kenalJarak = (r, k) => {
  const L = r.p(GDHUR3), up = r.f() < .5, [lB, lR, lT] = L;
  const what = (k == null ? r.f() < .5 : k % 2 === 0) ? 'mencancang' : 'mengufuk', otherWhat = what === 'mencancang' ? 'mengufuk' : 'mencancang';
  const srt = (a, b) => [a, b].sort().join(''), vert = srt(lR, lT), hor = srt(lB, lR), slope = srt(lB, lT);
  const ans = what === 'mencancang' ? vert : hor, other = what === 'mencancang' ? hor : vert;
  const work = ['Jarak mencancang ialah jarak tegak (atas–bawah).', 'Jarak mengufuk ialah jarak melintang (kiri–kanan).', `Maka jarak ${what} bagi cerun ${slope} ialah ${ans}.`];
  return GEN_LQ('kenalJarak', { what, otherWhat, ans, other, slope, tri: L.join(''), work }, { fig: gdTriFig({ v: r.i(3, 7), h: r.i(5, 9), up, L, plain: true }) });
};
GD.kecJarak = r => {
  let v, h; do { v = r.i(1, 12); h = r.i(2, 15); } while (v === h || (gdGcd(v, h) === 1 && r.f() < .4));
  const ans = gdFr(v, h);
  return GEN_LQ('kecJarak', { v, h, ans, work: ['Kecerunan = jarak mencancang ÷ jarak mengufuk', `= ${v} ÷ ${h}`, `= ${ans}`] }, { fig: gdTriFig({ v, h, vl: `${v} m`, hl: `${h} m` }) });
};
GD.kecRajah = r => {
  const [a, b, c] = r.p(GDTRI), sw = r.f() < .5, v = sw ? a : b, h = sw ? b : a, L = r.p(GDHUR3), slope = L[0] + L[2], ans = gdFr(v, h);
  return GEN_LQ('kecRajah', { v, h, c, slope, ans, work: [`Jarak mencancang = ${L[1]}${L[2]} = ${v} m, jarak mengufuk = ${L[0]}${L[1]} = ${h} m.`, `Panjang cerun ${slope} = ${c} m tidak digunakan.`, `Kecerunan = ${v} ÷ ${h} = ${ans}`] }, { fig: gdTriFig({ v, h, vl: `${v} m`, hl: `${h} m`, sl: `${c} m`, L }) });
};
GD.cariJarak = (r, find) => {
  find = find || (r.f() < .5 ? 'v' : 'h');
  let p, q, k; do { [p, q] = r.p(GDFR); k = r.i(1, 6); } while (p * k > 30 || q * k > 30 || (p * k === 1 && q * k === 1));
  const v = p * k, h = q * k, m = gdFr(p, q);
  if (find === 'v') return GEN_LQ('cariV', { m, v, h, p, q, ans: `${v} m`, work: ['Kecerunan = jarak mencancang ÷ jarak mengufuk', `${m} = jarak mencancang ÷ ${h}`, `Jarak mencancang = ${m} × ${h} = ${v} m`] }, { fig: gdTriFig({ v, h, vl: '?', hl: `${h} m`, sl: `m = ${m}` }) });
  return GEN_LQ('cariH', { m, v, h, p, q, ans: `${h} m`, work: ['Kecerunan = jarak mencancang ÷ jarak mengufuk', `${m} = ${v} ÷ jarak mengufuk`, `Jarak mengufuk = ${v} ÷ ${m} = ${h} m`] }, { fig: gdTriFig({ v, h, vl: `${v} m`, hl: '?', sl: `m = ${m}` }) });
};
GD.banding = r => {
  let v1, h1, v2, h2; do { v1 = r.i(2, 12); h1 = r.i(2, 15); v2 = r.i(2, 12); h2 = r.i(2, 15); } while (v1 * h2 === v2 * h1 || v1 === h1 || v2 === h2 || (v1 === v2 && h1 === h2));
  const [X, Y] = r.p(GDHUR2), m1 = gdFr(v1, h1), m2 = gdFr(v2, h2), first = v1 * h2 > v2 * h1;
  const S = first ? X : Y, W = first ? Y : X, mS = first ? m1 : m2, mW = first ? m2 : m1;
  return GEN_LQ('banding', { X, Y, v1, h1, v2, h2, S, W, mS, mW, work: [`Kecerunan ${X} = ${v1} ÷ ${h1} = ${m1}`, `Kecerunan ${Y} = ${v2} ÷ ${h2} = ${m2}`, `Samakan penyebut: ${m1} = ${v1 * h2}/${h1 * h2} dan ${m2} = ${v2 * h1}/${h1 * h2}`, `${mS} > ${mW}, maka ${S} lebih curam.`] });
};
GD.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
GD.k111 = r => {
  const [x, y, tc] = r.p(GDTRI.slice(0, 3)), ta = Math.max(x, y), tb = Math.min(x, y);
  const vc = r.p([20, 25, 30, 40, 50, 60, 75, 80]), hm = r.p([2, 3, 4, 5, 6, 8, 10]);
  const [p, q] = r.p([[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [1, 3]]), K = r.i(3, 6), k1 = r.i(1, K - 1), sc = r.p([2, 3, 4, 5]);
  const H = p * K * sc, Dt = q * K * sc, xx = q * k1 * sc, hk = p * k1 * sc, rem = Dt - xx;
  let W, Tb; do { W = r.p([6, 8, 10, 12, 14, 16]); Tb = r.i(2, 6); } while (Tb * 2 === W);
  const vr = r.p([30, 45, 50, 60, 75, 90, 100]);
  return GEN_LQ('k111', { ta, tb, tc, vc, hm, bm: gdFr(p, q), H, x: xx, hk, Dt, rem, W, Tb, vr });
};

/* ---------- 10.1.2 ---------- */
GD.duaTitik = (r, neg) => {
  let x1, y1, x2, y2;
  do {
    if (neg) { x1 = r.i(-6, 6); y1 = r.i(-6, 6); x2 = r.i(-6, 6); y2 = r.i(-6, 6); }
    else { x1 = r.i(0, 9); y1 = r.i(0, 9); x2 = r.i(0, 9); y2 = r.i(0, 9); }
  } while (x1 === x2 || y1 === y2 || (neg && Math.min(x1, y1, x2, y2) >= 0) || Math.abs(x2 - x1) > 9);
  const [A, B] = r.p(GDHUR2), ans = gdFr(y2 - y1, x2 - x1);
  return GEN_LQ('duaTitik', { A, B, x1, y1, x2, y2, ans, work: gdW2(x1, y1, x2, y2) }, { fig: gdTwoPt(A, B, x1, y1, x2, y2, true) });
};
GD.bacaRajah = r => {
  let x1, y1, x2, y2; do { x1 = r.i(-5, 5); y1 = r.i(-5, 5); x2 = r.i(-5, 5); y2 = r.i(-5, 5); } while (x1 === x2 || y1 === y2 || Math.abs(x2 - x1) < 2);
  const [A, B] = r.p(GDHUR2), m = gdFr(y2 - y1, x2 - x1);
  return GEN_LQ('bacaRajah', { A, B, x1, y1, x2, y2, m, ans: m, work: [`Dari rajah: ${A}${P(x1, y1)} dan ${B}${P(x2, y2)}.`].concat(gdW2(x1, y1, x2, y2)) }, { fig: gdTwoPt(A, B, x1, y1, x2, y2, false), figAns: gdTwoPt(A, B, x1, y1, x2, y2, true, true) });
};
// m = sp/q, dx = q·t, dy = sp·t
function gdKoordData(r) {
  let p, q, sg, t, x1, y1;
  do { [p, q] = r.p(GDFR); sg = r.f() < .5 ? 1 : -1; t = r.n(-2, 2); x1 = r.i(-4, 4); y1 = r.i(-4, 4); } while (Math.abs(q * t) > 8 || Math.abs(p * t) > 10 || !x1 || !y1);
  return { p, q, sg, x1, y1, x2: x1 + q * t, y2: y1 + sg * p * t, m: gdFr(sg * p, q) };
}
GD.koord = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'y' : 'x');
  const d = gdKoordData(r), [A, B] = r.p(GDHUR2), { x1, y1, x2, y2, m } = d, dx = x2 - x1, dy = y2 - y1;
  if (kind === 'y') return GEN_LQ('koordY', { A, B, x1, y1, x2, m, ans: `k = ${fmt(y2)}`, work: [`(k − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ${m}`, `(k − ${par(y1)}) / ${par(dx)} = ${m}`, `k − ${par(y1)} = ${gdPm(m)} × ${par(dx)} = ${fmt(dy)}`, `k = ${fmt(dy)} + ${par(y1)} = ${fmt(y2)}`] });
  return GEN_LQ('koordX', { A, B, x1, y1, y2, m, ans: `h = ${fmt(x2)}`, work: [`(${fmt(y2)} − ${par(y1)}) / (h − ${par(x1)}) = ${m}`, `${fmt(dy)} / (h − ${par(x1)}) = ${m}`, `h − ${par(x1)} = ${fmt(dy)} ÷ ${gdPm(m)} = ${fmt(dx)}`, `h = ${fmt(dx)} + ${par(x1)} = ${fmt(x2)}`] });
};
GD.k112 = r => {
  // (1) tiga titik segaris
  let s; do {
    const [p, q] = r.p(GDFR.slice(0, 11)), sg = r.f() < .5 ? 1 : -1, t1 = r.n(-2, 2), t2 = r.n(-2, 2), x1 = r.i(-4, 4), y1 = r.i(-4, 4);
    s = { m: gdFr(sg * p, q), x1, y1, x2: x1 + q * t1, y2: y1 + sg * p * t1 }; s.x3 = s.x2 + q * t2; s.k = s.y2 + sg * p * t2; s.ok = t1 + t2 !== 0 && Math.abs(s.x3) <= 12 && Math.abs(s.k) <= 15 && Math.abs(s.x2) <= 12 && Math.abs(s.y2) <= 15;
  } while (!s.ok);
  // (2) A(h, a), B(b, h)
  let g; do { const m = r.p([1, 2, 3, 4, -2, -3, -4]), h = r.i(-4, 6), b = h + r.n(-4, 4); g = { m, h, b, a: h - m * (b - h) }; } while (Math.abs(g.a) > 20 || Math.abs(g.b) > 12);
  // (3) adakah C pada garis AB?
  let c; do {
    const [p, q] = r.p(GDFR.slice(0, 11)), sg = r.f() < .5 ? 1 : -1, x1 = r.i(-3, 3), y1 = r.i(-3, 3), t1 = r.n(-2, 2), t2 = r.n(-3, 3), on = r.f() < .5;
    c = { x1, y1, x2: x1 + q * t1, y2: y1 + sg * p * t1, x3: x1 + q * t2, y3: y1 + sg * p * t2 + (on ? 0 : r.p([-1, 1])), on, m: gdFr(sg * p, q) };
    c.mAC = gdFr(c.y3 - c.y1, c.x3 - c.x1); c.ok = t1 !== t2 && Math.abs(c.x2) <= 12 && Math.abs(c.x3) <= 12 && Math.abs(c.y2) <= 15 && Math.abs(c.y3) <= 15;
  } while (!c.ok);
  // (4) kereta kabel
  const [p, q] = r.p([[1, 2], [2, 5], [3, 5], [3, 4], [1, 3], [2, 3]]), u = r.p([100, 120, 200]), y0 = r.p([50, 80, 100, 120, 150]), sd = u / r.p([2, 4, 5]);
  const kc = { m: gdFr(p, q), X: q * u, YT: y0 + p * u, y0, d: q * sd, rise: p * sd };
  return GEN_LQ('k112', { s, g, c, kc });
};

/* ---------- 10.1.3 ---------- */
function gdJenisLine(r, kind) {
  if (kind === 'und') { const x = r.n(-4, 4), y1 = r.i(-4, -1), y2 = r.i(1, 4); return [x, y1, x, y2]; }
  if (kind === 'zero') { const y = r.n(-4, 4), x1 = r.i(-4, -1), x2 = r.i(1, 4); return [x1, y, x2, y]; }
  let x1, y1, dx, dy;
  do { const [p, q] = r.p([[1, 2], [1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 2]]), t = r.p([1, 2]); dx = q * t; dy = (kind === 'pos' ? 1 : -1) * p * t; x1 = r.i(-4, 3); y1 = r.i(-4, 4); } while (Math.abs(x1 + dx) > 4 || Math.abs(y1 + dy) > 4 || (x1 === 0 && y1 === 0));
  return [x1, y1, x1 + dx, y1 + dy];
}
GD.jenisRajah = (r, k) => {
  const kind = k == null ? r.p(GDJK) : GDJK[k % 4], [A, B] = r.p(GDHUR2), [x1, y1, x2, y2] = gdJenisLine(r, kind), J = GDJENIS[kind], cl = GDJENIS[GDCLAIM[kind]];
  const fig = gdPlane({ box: { x0: -5, x1: 5, y0: -5, y1: 5 }, pts: [{ x: x1, y: y1, l: A, c: 'am' }, { x: x2, y: y2, l: B, c: 'am' }], lines: [{ a: [x1, y1], b: [x2, y2], c: 'am', w: 4 }], label: `Garis lurus ${A}${B}` });
  return GEN_LQ('jenisRajah', { L: A + B, ans: J[0], claim: cl[0], claimDesc: cl[1], work: [J[2]] }, { fig });
};
GD.jenisTitik = (r, k) => {
  const kind = k == null ? r.p(GDJK) : GDJK[k % 4], [A, B] = r.p(GDHUR2), J = GDJENIS[kind];
  let x1, y1, x2, y2;
  do { x1 = r.i(-8, 8); y1 = r.i(-8, 8); x2 = r.i(-8, 8); y2 = r.i(-8, 8); if (kind === 'und') x2 = x1; if (kind === 'zero') y2 = y1; }
  while ((kind === 'und' ? y1 === y2 : x1 === x2) || (kind === 'pos' && (y2 - y1) * (x2 - x1) <= 0) || (kind === 'neg' && (y2 - y1) * (x2 - x1) >= 0));
  let ans, work;
  if (kind === 'und') { ans = J[0]; work = [`m = (${fmt(y2)} − ${par(y1)}) / (${fmt(x2)} − ${par(x1)}) = ${fmt(y2 - y1)}/0`, 'Pembahagian dengan sifar tidak tertakrif.', J[2]]; }
  else { const m = gdFr(y2 - y1, x2 - x1); ans = `${J[0]} (m = ${m})`; work = gdW2(x1, y1, x2, y2).concat([J[2]]); }
  return GEN_LQ('jenisTitik', { A, B, x1, y1, x2, y2, dir: J[3], ans, work });
};
GD.pintasan = r => {
  const a = r.n(-6, 6), b = r.n(-6, 6), [A, B] = r.p(GDHUR2), ans = gdFr(-b, a);
  const fig = gdPlane({ pts: [{ x: a, y: 0, l: `${P(a, 0)}`, c: 'pk' }, { x: 0, y: b, l: `${P(0, b)}`, c: 'tr' }], lines: [{ a: [a, 0], b: [0, b], c: 'am', w: 4 }], label: 'Garis lurus dengan pintasan-x dan pintasan-y' });
  return GEN_LQ('pintasan', { L: A + B, a, b, ans, work: gdWPin(a, b) }, { fig });
};
GD.curam = r => {
  const n = r.p([['P', 'Q', 'R'], ['K', 'L', 'M'], ['A', 'B', 'C'], ['U', 'V', 'W']]);
  let vals; do { vals = gdShuf(r, GDABS).slice(0, 3).map(([p, q]) => [(r.f() < .5 ? -1 : 1) * p, q]); } while (vals.every(v => v[0] > 0));
  const ms = vals.map(([p, q]) => gdFr(p, q)), ab = vals.map(([p, q]) => Math.abs(p) / q), sv = vals.map(([p, q]) => p / q);
  const idx = [0, 1, 2].sort((i, j) => ab[j] - ab[i]), S = n[idx[0]], order = idx.map(i => n[i]);
  const bigI = [0, 1, 2].sort((i, j) => sv[j] - sv[i])[0], big = bigI !== idx[0], claim = big ? n[bigI] : n[idx[2]];
  const cols = ['am', 'pk', 'tr'], items = vals.map(([p, q], i) => ({ a: [0, 0], b: [q, p], c: cols[i], w: 4 }));
  const box = { x0: -4, x1: 4, y0: -4, y1: 4 };
  const texts = vals.map(([p, q], i) => { const [, e] = gdClip([0, 0], [q, p], box); return { x: e[0] * .8 + (e[0] > 0 ? .1 : -.1), y: e[1] * .8 + .3, s: n[i], c: cols[i], size: 19 }; });
  const figAns = gdPlane({ box, lines: items, texts, label: 'Tiga garis lurus melalui asalan' });
  return GEN_LQ('curam', { n, ms, S, claim, big, order, ans: `Garis ${S}`, work: ['Kecuraman dibandingkan menggunakan nilai kecerunan tanpa tanda (positif atau negatif).', `Tanpa tanda: ${n.map((x, i) => `${x} → ${gdFr(Math.abs(vals[i][0]), vals[i][1])}`).join(', ')}`, `Nilai terbesar ialah bagi ${S}, maka garis ${S} paling curam.`] }, { figAns });
};
function gdPinData(r) {
  let p, q, sg, t; do { [p, q] = r.p(GDFR); sg = r.f() < .5 ? 1 : -1; t = r.n(-3, 3); } while (Math.abs(q * t) > 9 || Math.abs(p * t) > 12);
  const a = q * t, b = -sg * p * t;
  return { m: gdFr(sg * p, q), a, b };
}
GD.cariPin = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'y' : 'x');
  const { m, a, b } = gdPinData(r), L = r.p(GDHUR2).join('');
  if (kind === 'y') return GEN_LQ('cariPinY', { L, m, a, b, ans: fmt(b), work: ['m = −(pintasan-y) / (pintasan-x)', `${m} = −(pintasan-y) / ${par(a)}`, `pintasan-y = −${gdPm(m)} × ${par(a)} = ${fmt(b)}`] });
  return GEN_LQ('cariPinX', { L, m, a, b, ans: fmt(a), work: ['m = −(pintasan-y) / (pintasan-x)', `${m} = −(${fmt(b)}) / (pintasan-x)`, `pintasan-x = −(${fmt(b)}) ÷ ${gdPm(m)} = ${fmt(a)}`] });
};
GD.pinRajah = r => {
  let a, b; do { a = r.n(-6, 6); b = r.n(-6, 6); } while (Math.abs(a) < 2 && Math.abs(b) < 2);
  const L = r.p(GDHUR2).join(''), m = gdFr(-b, a);
  const base = { lines: [{ a: [a, 0], b: [0, b], c: 'am', w: 4 }], label: `Garis lurus ${L}` };
  const fig = gdPlane(Object.assign({ pts: [{ x: a, y: 0, c: 'pk' }, { x: 0, y: b, c: 'tr' }] }, base));
  const figAns = gdPlane(Object.assign({ pts: [{ x: a, y: 0, l: `x = ${fmt(a)}`, c: 'pk' }, { x: 0, y: b, l: `y = ${fmt(b)}`, c: 'tr' }] }, base));
  return GEN_LQ('pinRajah', { L, m, ans: `Pintasan-x = ${fmt(a)}, pintasan-y = ${fmt(b)}, m = ${m}`, work: [`Garis memotong paksi-x pada ${fmt(a)} dan paksi-y pada ${fmt(b)}.`].concat(gdWPin(a, b)) }, { fig, figAns });
};
GD.k113 = r => {
  // (1) tangki air
  let tk; do { const V0 = r.p([120, 150, 180, 200, 240, 300, 360]), rate = r.p([2, 3, 4, 5, 6, 10, 12, 15, 20, 30]); tk = { V0, rate, T: V0 / rate }; } while (tk.V0 % tk.rate || tk.T > 120 || tk.T < 6);
  // (2) titik + pintasan-y
  let tp; do {
    const a = r.n(-8, 8), c = r.n(-8, 8), g = gdGcd(a, c), qd = Math.abs(a / g), x1 = qd * r.n(-3, 3), y1 = c - c * x1 / a;
    tp = { a, c, x1, y1, m: gdFr(-c, a), L: r.p(GDHUR2).join('') };
  } while (tp.x1 === tp.a || Math.abs(tp.x1) > 12 || Math.abs(tp.y1) > 15);
  // (3) pintasan-y = K × pintasan-x
  let kk; do { const K = r.p([2, 3]), h = r.i(2, 5), x1 = r.i(1, h + 2); kk = { K, h, x1, y1: K * (h - x1) }; } while (kk.x1 === kk.h);
  // (4) dua garis
  let dg; do {
    const pr2 = gdShuf(r, GDABS).slice(0, 2), sgn = r.f() < .5 ? [1, -1] : [-1, 1];
    const mk = ([p, q], sg) => { const x = r.i(-4, 3), y = r.i(-4, 4), t = r.p([1, 2]); return [[x, y], [x + q * t, y + sg * p * t]]; };
    const [a, b] = mk(pr2[0], sgn[0]), [c, d] = mk(pr2[1], sgn[1]);
    const v1 = Math.abs(pr2[0][0]) / pr2[0][1], v2 = Math.abs(pr2[1][0]) / pr2[1][1];
    dg = { a, b, c, d, m1: gdFr(sgn[0] * pr2[0][0], pr2[0][1]), m2: gdFr(sgn[1] * pr2[1][0], pr2[1][1]), t1: sgn[0] > 0 ? 'Positif' : 'Negatif', t2: sgn[1] > 0 ? 'Positif' : 'Negatif', u1: gdFr(pr2[0][0], pr2[0][1]), u2: gdFr(pr2[1][0], pr2[1][1]), S: v1 > v2 ? 'AB' : 'CD' };
  } while ([dg.a, dg.b, dg.c, dg.d].some(p => Math.abs(p[0]) > 10 || Math.abs(p[1]) > 12));
  const v = vq('k113', { tk, tp, kk, dg });
  return Object.assign({ q: v.q, ans: v.ans, work: v.work }, v.q.includes('isi padu air') ? { fig: gdAxFig('V (liter)', 't (minit)', tk.V0, tk.T) } : {});
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '10.1.1': {
    m: [() => GD.kenalJarak(gdRG), () => GD.kecJarak(gdRG), () => GD.kecJarak(gdRG), () => GD.kecRajah(gdRG), () => GD.bs(gdRG, GDBS1)],
    s: [() => GD.cariJarak(gdRG), () => GD.cariJarak(gdRG), () => GD.banding(gdRG)],
    k: [() => GD.k111(gdRG)]
  },
  '10.1.2': {
    m: [() => GD.duaTitik(gdRG, false), () => GD.duaTitik(gdRG, true), () => GD.duaTitik(gdRG, true)],
    s: [() => GD.bacaRajah(gdRG), () => GD.koord(gdRG, 'y'), () => GD.koord(gdRG, 'x')],
    k: [() => GD.k112(gdRG)]
  },
  '10.1.3': {
    m: [() => GD.jenisRajah(gdRG), () => GD.jenisTitik(gdRG), () => GD.pintasan(gdRG), () => GD.bs(gdRG, GDBS3)],
    s: [() => GD.curam(gdRG), () => GD.cariPin(gdRG), () => GD.pinRajah(gdRG)],
    k: [() => GD.k113(gdRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 10.1.1
WG.kenalJarak = i => GD.kenalJarak(gdRW, i);
WG.kecJarak = () => GD.kecJarak(gdRW);
WG.kecRajah = () => GD.kecRajah(gdRW);
WG.bs1 = i => GD.bs(gdRW, GDBS1, [0, 3][i % 2] + wri(0, 1) * 4);
WG.cariJarak = i => GD.cariJarak(gdRW, i % 2 ? 'h' : 'v');
WG.banding = () => GD.banding(gdRW);
WG.k111 = () => GD.k111(gdRW);
// 10.1.2
WG.duaTitikP = () => GD.duaTitik(gdRW, false);
WG.duaTitikN = () => GD.duaTitik(gdRW, true);
WG.bacaRajah = () => GD.bacaRajah(gdRW);
WG.koordY = () => GD.koord(gdRW, 'y');
WG.koordX = () => GD.koord(gdRW, 'x');
WG.k112 = () => GD.k112(gdRW);
// 10.1.3
WG.jenisRajah = i => GD.jenisRajah(gdRW, i);
WG.jenisTitik = i => GD.jenisTitik(gdRW, i + 2);
WG.pintasan = () => GD.pintasan(gdRW);
WG.bs3 = i => GD.bs(gdRW, GDBS3, [1, 6, 3][i % 3] + wri(0, 1) * [3, 1, 4][i % 3]);
WG.curam = () => GD.curam(gdRW);
WG.cariPinY = () => GD.cariPin(gdRW, 'y');
WG.cariPinX = () => GD.cariPin(gdRW, 'x');
WG.pinRajah = () => GD.pinRajah(gdRW);
WG.k113 = () => GD.k113(gdRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '10.1.1': [['m', 'kenalJarak', 4], ['m', 'kecJarak', 7], ['m', 'kecRajah', 5], ['m', 'bs1', 2], ['s', 'cariJarak', 6], ['s', 'banding', 3], ['k', 'k111', 3]],
  '10.1.2': [['m', 'duaTitikP', 6], ['m', 'duaTitikN', 8], ['m', 'bacaRajah', 4], ['s', 'bacaRajah', 3], ['s', 'koordY', 3], ['s', 'koordX', 3], ['k', 'k112', 3]],
  '10.1.3': [['m', 'jenisRajah', 5], ['m', 'jenisTitik', 4], ['m', 'pintasan', 6], ['m', 'bs3', 3], ['s', 'curam', 3], ['s', 'cariPinY', 2], ['s', 'cariPinX', 2], ['s', 'pinRajah', 2], ['k', 'k113', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan pecahan: jawapan n/d + calon kesilapan biasa [n, d] (unik)
function gdOptsFr(n, d, cands) {
  const A = gdFr(n, d), seen = new Set([A]), w = [];
  for (const [cn, cd] of shuffle(cands)) { if (!cd) continue; const s = gdFr(cn, cd); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const g = gdGcd(n, d) || 1; let nn = n / g, dd = d / g; if (dd < 0) { nn = -nn; dd = -dd; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const s = gdFr(nn + (k % 2 ? 1 : -1) * Math.ceil(k / 2), dd); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
// pilihan nombor bulat (dengan unit)
function gdOptsN(ans, cands, f, pos) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isInteger(c) || (pos && c <= 0)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const vv = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (pos && vv <= 0) continue; const s = f(vv); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function gdOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const gdMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const gdFm = v => `${fmt(v)} m`;
function gdGPts(lo, hi, cond) {
  let x1, y1, x2, y2; do { x1 = ri(lo, hi); y1 = ri(lo, hi); x2 = ri(lo, hi); y2 = ri(lo, hi); } while (x1 === x2 || y1 === y2 || (cond && !cond(x1, y1, x2, y2)));
  return [x1, y1, x2, y2];
}
const CQGEN = {
  jarak: [
    () => { let v, h; do { v = ri(1, 10); h = ri(2, 12); } while (v === h); return gdMcq(`Jarak mencancang = ${v} m, jarak mengufuk = ${h} m. Berapakah kecerunan cerun ini?`, gdTriFig({ v, h, vl: `${v} m`, hl: `${h} m` }), gdOptsFr(v, h, [[h, v], [v, v + h], [h, v + h], [v + 1, h], [v, h + 1]])); },
    () => {
      let p, q, k; do { [p, q] = pick(GDFR); k = ri(1, 5); } while (p * k > 25 || q * k > 25);
      const v = p * k, h = q * k, m = gdFr(p, q);
      if (Math.random() < .5) return gdMcq(`Kecerunan cerun = ${m} dan jarak mengufuk = ${h} m. Berapakah jarak mencancang?`, gdTriFig({ v, h, vl: '?', hl: `${h} m` }), gdOptsN(v, [h * q / p, v + h, h - v, 2 * v, h], gdFm, true));
      return gdMcq(`Kecerunan cerun = ${m} dan jarak mencancang = ${v} m. Berapakah jarak mengufuk?`, gdTriFig({ v, h, vl: `${v} m`, hl: '?' }), gdOptsN(h, [v * p / q, v + h, 2 * h, v, h + p], gdFm, true));
    },
    () => {
      if (Math.random() < .4) {
        const L = pick(GDHUR3), up = Math.random() < .5, vert = L[1] + L[2], hor = up ? L[0] + L[1] : L[1] + L[0], slope = up ? L[0] + L[2] : L[2] + L[0], v = Math.random() < .5;
        return gdMcq(`Sisi manakah ialah jarak <b>${v ? 'mencancang' : 'mengufuk'}</b> bagi cerun ${slope}?`, gdTriFig({ v: ri(3, 7), h: ri(5, 9), up, L, plain: true }), gdOptsT(v ? vert : hor, [vert, hor, slope, L[0] + L[1] + L[2]]));
      }
      const set = shuffle([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5], [4, 5], [5, 6], [3, 2], [5, 4]]).slice(0, 4);
      const k = set.map(() => ri(1, 4)), txt = set.map(([p, q], i) => `naik ${p * k[i]} m, mengufuk ${q * k[i]} m`), best = set.reduce((b, s, i) => (s[0] / s[1] > set[b][0] / set[b][1] ? i : b), 0);
      const opts = shuffle(txt);
      return { type: 'mcq', q: 'Cerun manakah <b>paling curam</b>?', fig: gdTriFig({ v: 3, h: 5, vl: 'mencancang', hl: 'mengufuk' }), opts, c: opts.indexOf(txt[best]) };
    }
  ],
  duaTitik: [
    () => { const [x1, y1, x2, y2] = gdGPts(0, 5); const dy = y2 - y1, dx = x2 - x1; return gdMcq(`Cari kecerunan garis yang melalui A${P(x1, y1)} dan B${P(x2, y2)}.`, gdGFig([[x1, y1, 'am', 'A'], [x2, y2, 'pk', 'B']], [[[x1, y1], [x2, y2], 'am']]), gdOptsFr(dy, dx, [[dx, dy], [-dy, dx], [y2 + y1, x2 + x1], [dy, 1], [dy + 1, dx]]), gdGLegs(x1, y1, x2, y2)); },
    () => {
      const [x1, y1, x2, y2] = gdGPts(-5, 5, (a, b, c, d) => Math.min(a, b, c, d) < 0); const dy = y2 - y1, dx = x2 - x1;
      if (Math.random() < .5) return gdMcq(`Cari kecerunan garis lurus AB, dengan A${P(x1, y1)} dan B${P(x2, y2)}.`, gdGFig([[x1, y1, 'am', 'A'], [x2, y2, 'pk', 'B']], [[[x1, y1], [x2, y2], 'am']]), gdOptsFr(dy, dx, [[dx, dy], [-dy, dx], [y2 + y1, x2 + x1], [y2 - y1, x1 - x2], [dy + 1, dx]]), gdGLegs(x1, y1, x2, y2));
      return gdMcq('Berdasarkan rajah, berapakah kecerunan garis lurus AB?', gdGFig([[x1, y1, 'am', 'A'], [x2, y2, 'pk', 'B']], [[[x1, y1], [x2, y2], 'am']]), gdOptsFr(dy, dx, [[dx, dy], [-dy, dx], [-dx, dy], [dy + 1, dx]]), gdGLegs(x1, y1, x2, y2));
    },
    () => {
      const d = gdKoordData(gdRG), dy = d.y2 - d.y1, dx = d.x2 - d.x1;
      return gdMcq(`Kecerunan garis yang melalui ${P(d.x1, d.y1)} dan (${fmt(d.x2)}, k) ialah ${d.m}. Cari nilai k.`, gdGFig([[d.x1, d.y1, 'am', 'A']], []), gdOptsN(d.y2, [d.y1 - dy, dy, d.x1 + dy, d.y2 + 2, -d.y2], v => `k = ${fmt(v)}`));
    }
  ],
  arah: [
    () => { const kind = pick(GDJK), [x1, y1, x2, y2] = gdJenisLine(gdRG, kind), ans = GDJENIS[kind][0]; return gdMcq('Apakah jenis kecerunan garis lurus ini?', gdGFig([[x1, y1, 'am'], [x2, y2, 'am']], [[[x1, y1], [x2, y2], 'am']]), gdOptsT(ans, GDJK.map(k => GDJENIS[k][0]))); },
    () => {
      const kind = pick(GDJK); let x1, y1, x2, y2;
      do { x1 = ri(-6, 6); y1 = ri(-6, 6); x2 = ri(-6, 6); y2 = ri(-6, 6); if (kind === 'und') x2 = x1; if (kind === 'zero') y2 = y1; }
      while ((kind === 'und' ? y1 === y2 : x1 === x2) || (kind === 'pos' && (y2 - y1) * (x2 - x1) <= 0) || (kind === 'neg' && (y2 - y1) * (x2 - x1) >= 0));
      return gdMcq(`Garis lurus melalui ${P(x1, y1)} dan ${P(x2, y2)}. Apakah jenis kecerunannya?`, gdGFig([], []), gdOptsT(GDJENIS[kind][0], GDJK.map(k => GDJENIS[k][0])), gPt(x1, y1, 'am') + gPt(x2, y2, 'am') + gLine([x1, y1], [x2, y2], 'am', .1));
    },
    () => {
      const vals = shuffle(GDABS).slice(0, 4).map(([p, q]) => [(Math.random() < .5 ? -1 : 1) * p, q]), ms = vals.map(([p, q]) => gdFr(p, q));
      const best = vals.reduce((b, v, i) => (Math.abs(v[0]) / v[1] > Math.abs(vals[b][0]) / vals[b][1] ? i : b), 0), opts = shuffle(ms);
      return { type: 'mcq', q: 'Garis lurus dengan kecerunan manakah <b>paling curam</b>?', fig: gdGFig([], vals.map(([p, q], i) => [[0, 0], [q, p], ['am', 'pk', 'tr', 'gr'][i]])), opts, c: opts.indexOf(ms[best]) };
    }
  ],
  pintasan: [
    () => { const a = nz(-5, 5), b = nz(-5, 5); return gdMcq(`Pintasan-x = ${fmt(a)} dan pintasan-y = ${fmt(b)}. Berapakah kecerunan garis lurus itu?`, gdGFig([[a, 0, 'pk'], [0, b, 'tr']], [[[a, 0], [0, b], 'am']]), gdOptsFr(-b, a, [[b, a], [a, b], [-a, b], [b, 1], [-b, 1]])); },
    () => {
      const { m, a, b } = gdPinData(gdRG);
      if (Math.random() < .5) return gdMcq(`Kecerunan = ${m} dan pintasan-x = ${fmt(a)}. Berapakah pintasan-y?`, gdGFig(Math.abs(a) <= 5 ? [[a, 0, 'pk']] : [], []), gdOptsN(b, [-b, a, -a, b + 1], v => fmt(v)));
      return gdMcq(`Kecerunan = ${m} dan pintasan-y = ${fmt(b)}. Berapakah pintasan-x?`, gdGFig(Math.abs(b) <= 5 ? [[0, b, 'tr']] : [], []), gdOptsN(a, [-a, b, -b, a + 1], v => fmt(v)));
    },
    () => { let a, b; do { a = nz(-5, 5); b = nz(-5, 5); } while (Math.abs(a) === Math.abs(b)); return gdMcq('Berdasarkan pintasan dalam rajah, berapakah kecerunan garis lurus ini?', gdGFig([[a, 0, 'pk'], [0, b, 'tr']], [[[a, 0], [0, b], 'am']]), gdOptsFr(-b, a, [[b, a], [-a, b], [a, b], [b, 1]])); }
  ]
};
const CQT = { jarak: 'Jarak & kecerunan', duaTitik: 'Rumus dua titik', arah: 'Arah kecerunan', pintasan: 'Pintasan' };
function gdCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.jarak;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['jarak', 'jarak', 'duaTitik', 'arah', 'pintasan'] : Object.keys(CQT);
  return gdCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return gdCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui gdBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => gdBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => gdBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => gdBtO(c0(...a)); gq = (...a) => gdBtO(g0(...a)); }
