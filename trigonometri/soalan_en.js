'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_trigonometri_en.py; jangan sunting dengan tangan. */
/* =================== TRIGONOMETRI · SOALAN BAB 5 NISBAH TRIGONOMETRI (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "tg" / "TG" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// tgBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const TGBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const TGBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const TGBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${TGBTAT})+)( ?)\/\2((?:${TGBTAT})+)(?![\w]|\.\d)`);
const TGBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, TGBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const tgBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function tgBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + TGBTG[c][0] + '\u0002' + TGBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + tgBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(TGBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (TGBTUN.test(a) && TGBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && TGBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + tgBtP(a) + '\u0002' + tgBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function tgBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = tgBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// tgBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function tgBtTree(s) {
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
const tgBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function tgBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * tgBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = tgBtMeas(n.a, z2), B = tgBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = tgBtMeas(n.k, z), N = tgBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function tgBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += tgBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + tgBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += tgBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += tgBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const tgBtW = (t, z) => tgBtMeas(tgBtTree(tgBtTok(String(t))), z).w;
function tgBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = tgBtTree(tgBtTok(String(t))), m = tgBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${tgBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function tgBtO(o) {
  if (typeof o === 'string') return tgBt(o);
  if (Array.isArray(o)) return o.map(tgBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = tgBtO(o[k]);
  return o;
}

const tgGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan termudah dengan tanda tolak sebenar (−)
const tgFr = (n, d) => {
  if (d < 0) { n = -n; d = -d; }
  const g = tgGcd(n, d) || 1; n /= g; d /= g;
  return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d);
};
const tgAdd = (a, b) => { const n = a[0] * b[1] + b[0] * a[1], d = a[1] * b[1], g = tgGcd(n, d) || 1; return [n / g, d / g]; };
const tgMul = (a, k) => { const n = a[0] * k, g = tgGcd(n, a[1]) || 1; return [n / g, a[1] / g]; };
const tgRad = d => d * Math.PI / 180, tgDeg = r => r * 180 / Math.PI;
const TGF = { sin: d => Math.sin(tgRad(d)), cos: d => Math.cos(tgRad(d)), tan: d => Math.tan(tgRad(d)) };
const TGINV = { sin: v => tgDeg(Math.asin(v)), cos: v => tgDeg(Math.acos(v)), tan: v => tgDeg(Math.atan(v)) };
const tg4 = x => x.toFixed(4);
const tg2 = x => x.toFixed(2);
// darjah perpuluhan → darjah dan minit (minit dibundarkan)
const tgDM = deg => { let D = Math.floor(deg), M = Math.round((deg - D) * 60); if (M === 60) { D++; M = 0; } return `${D}°${M}′`; };
// rawak: tgRG untuk Latihan Kelas / games, tgRW (berbenih) untuk Lembaran Kerja
const tgRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const tgRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const tgShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const tgSide = (a, b) => [a, b].sort().join('');
// ∠XVY bagi bucu V (jiran disusun ikut abjad)
const tgAng = (V, a, b) => { const [x, y] = [a, b].sort(); return `∠${x}${V}${y}`; };

/* =================== data bersama =================== */
// [bertentangan, bersebelahan, hipotenus] (tripel Pythagoras)
const TGTRIP = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25], [6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [20, 21, 29], [21, 20, 29], [9, 40, 41], [12, 16, 20]];
const TGHUR3 = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['D', 'E', 'F'], ['S', 'T', 'U'], ['X', 'Y', 'Z'], ['G', 'H', 'J']];
const TGHUR4 = [['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['K', 'L', 'M', 'N'], ['E', 'F', 'G', 'H'], ['T', 'U', 'V', 'W']];
const TGWHAT = { hyp: 'hypotenuse', opp: 'opposite side', adj: 'adjacent side' };
const TGFN = ['sin', 'cos', 'tan'];
const TGNISBAH = { sin: 'opposite ÷ hypotenuse', cos: 'adjacent ÷ hypotenuse', tan: 'opposite ÷ adjacent' };
// nilai tepat sudut khas
const TGKHAS = {
  'sin 30°': '1/2', 'sin 45°': '1/√2', 'sin 60°': '√3/2',
  'cos 30°': '√3/2', 'cos 45°': '1/√2', 'cos 60°': '1/2',
  'tan 30°': '1/√3', 'tan 45°': '1', 'tan 60°': '√3'
};
const TGKHASV = ['1/2', '1/√2', '√3/2', '1/√3', '1', '√3'];
// sebutan rasional bagi operasi: [paparan, gantian, nilai [n, d]]
const TGTERM = [
  ['sin 30°', '1/2', [1, 2]], ['cos 60°', '1/2', [1, 2]], ['tan 45°', '1', [1, 1]],
  ['sin 60° × cos 30°', '√3/2 × √3/2', [3, 4]], ['tan 30° × tan 60°', '1/√3 × √3', [1, 1]],
  ['sin 45° × cos 45°', '1/√2 × 1/√2', [1, 2]], ['cos 30° × tan 30°', '√3/2 × 1/√3', [1, 2]],
  ['sin 60° × tan 60°', '√3/2 × √3', [3, 2]]
];
const TGBS1 = [
  ['The hypotenuse is the longest side in a right-angled triangle.', true, 'The hypotenuse is opposite the right angle, which is the largest angle, thus it is the longest side.'],
  ['The hypotenuse can be the adjacent side of an acute angle.', false, 'The hypotenuse touches the acute angle but it is not called the adjacent side.'],
  ['The opposite side of an angle does not touch the vertex of the angle.', true, 'The opposite side faces the angle.'],
  ['The opposite side of one acute angle is the adjacent side of the other acute angle.', true, 'The two shorter sides swap roles when the referred angle changes.'],
  ['The hypotenuse changes when the referred acute angle changes.', false, 'The hypotenuse is always opposite the right angle, so it does not change.'],
  ['The adjacent side of an angle touches the vertex of the angle.', true, 'The adjacent side is the side that touches the angle, other than the hypotenuse.'],
  ['The vertical side in a diagram is always the opposite side.', false, 'The names of the sides depend on the position of the referred angle, not the direction of the side.'],
  ['Every right-angled triangle has two acute angles.', true, 'The sum of the angles is 180° and one angle is 90°, thus the other two angles are acute.']
];
const TGBS2 = [
  ['sin θ = opposite side ÷ hypotenuse.', true, 'This is the definition of sine.'],
  ['tan θ = adjacent side ÷ opposite side.', false, 'tan θ = opposite side ÷ adjacent side.'],
  ['The value of sin θ for an acute angle is always less than 1.', true, 'The opposite side is always shorter than the hypotenuse.'],
  ['When θ increases, the value of cos θ also increases.', false, 'When θ increases, cos θ decreases.'],
  ['Two right-angled triangles of different sizes but with the same angle θ have the same value of sin θ.', true, 'For the same angle, the ratios of the sides are constant.'],
  ['The value of tan θ cannot exceed 1.', false, 'tan θ exceeds 1 when θ > 45°, for example tan 60° = √3.'],
  ['cos θ = adjacent side ÷ hypotenuse.', true, 'This is the definition of cosine.'],
  ['If the size of the triangle is doubled, the value of tan θ is also doubled.', false, 'Both sides are doubled, thus the ratio does not change.']
];

/* =================== rajah =================== */
const tgT = (x, y, t, c = 'tx', sz = 16, a = 'middle') => /[\u0001\u0004]/.test(tgBtTok(String(t))) ? tgBtSvg(x, y, t, `style="fill:var(--${c})" font-family="Space Grotesk, sans-serif"`, sz, a) : `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const tgL = (p, q, c, w = 3.5, dash) => `<line x1="${+p[0].toFixed(1)}" y1="${+p[1].toFixed(1)}" x2="${+q[0].toFixed(1)}" y2="${+q[1].toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const tgU = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; };
const tgRt = (M, P1, P2, k = 11) => { const u = tgU(M, P1), v = tgU(M, P2), a = [M[0] + u[0] * k, M[1] + u[1] * k], b = [a[0] + v[0] * k, a[1] + v[1] * k], c = [M[0] + v[0] * k, M[1] + v[1] * k]; return `<polyline points="${a.map(n => n.toFixed(1))} ${b.map(n => n.toFixed(1))} ${c.map(n => n.toFixed(1))}" style="fill:none;stroke:var(--tx)" stroke-width="1.8"/>`; };
function tgArc(V, P1, P2, r, lab, c = 'pa') {
  const u = tgU(V, P1), v = tgU(V, P2), a = [V[0] + u[0] * r, V[1] + u[1] * r], b = [V[0] + v[0] * r, V[1] + v[1] * r], cr = u[0] * v[1] - u[1] * v[0];
  let s = `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${cr > 0 ? 1 : 0} ${b[0].toFixed(1)} ${b[1].toFixed(1)}" style="fill:none;stroke:var(--${c})" stroke-width="3" stroke-linecap="round"/>`;
  if (lab) { const bx = u[0] + v[0], by = u[1] + v[1], L = Math.hypot(bx, by) || 1, k = r + 9 + lab.length * 3.2; s += tgT(V[0] + bx / L * k, V[1] + by / L * k, lab, c, 15); }
  return s;
}
function tgSideLab(p, q, cen, t, c) {
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
  let nx = -dy / L, ny = dx / L; if ((mx - cen[0]) * nx + (my - cen[1]) * ny < 0) { nx = -nx; ny = -ny; }
  return tgT(mx + nx * 14, my + ny * 15, t, c, 16, Math.abs(nx) < .35 ? 'middle' : nx > 0 ? 'start' : 'end');
}
// segi tiga bersudut tegak: A = bucu sudut θ, R = sudut tegak, C = bucu ketiga
// o = { w, h (bersebelahan, bertentangan: nisbah bentuk), rot 0–3, flip, V:[nA,nR,nC], th, hyp, opp, adj, col, label }
function tgTri(o) {
  const w = o.w || 4, h = o.h || 3;
  let p = [[0, 0], [w, 0], [w, h]];
  if (o.flip) p = p.map(([x, y]) => [-x, y]);
  for (let i = 0; i < (o.rot || 0); i++) p = p.map(([x, y]) => [-y, x]);
  p = p.map(([x, y]) => [x, -y]);
  const xs = p.map(q => q[0]), ys = p.map(q => q[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const s = Math.min(190 / (x1 - x0), 140 / (y1 - y0)), ox = 160 - s * (x0 + x1) / 2, oy = 117 - s * (y0 + y1) / 2;
  const [A, R, C] = p.map(([x, y]) => [ox + s * x, oy + s * y]), cen = [(A[0] + R[0] + C[0]) / 3, (A[1] + R[1] + C[1]) / 3];
  const ch = o.col ? 'am' : 'tx', co = o.col ? 'pk' : 'tx', ca = o.col ? 'tr' : 'tx';
  let g = `<polygon points="${A.map(n => n.toFixed(1))} ${R.map(n => n.toFixed(1))} ${C.map(n => n.toFixed(1))}" style="fill:var(--pu);fill-opacity:.1;stroke:none"/>`;
  g += tgL(A, C, ch, o.col ? 4.5 : 3.5) + tgL(R, C, co, o.col ? 4 : 3.5) + tgL(A, R, ca, o.col ? 4 : 3.5) + tgRt(R, A, C);
  if (o.th) { const r = Math.max(18, Math.min(34, .3 * Math.hypot(R[0] - A[0], R[1] - A[1]))); g += tgArc(A, R, C, r, o.th); }
  if (o.hyp) g += tgSideLab(A, C, cen, o.hyp, ch);
  if (o.opp) g += tgSideLab(R, C, cen, o.opp, co);
  if (o.adj) g += tgSideLab(A, R, cen, o.adj, ca);
  if (o.V) [A, R, C].forEach((q, i) => { const dx = q[0] - cen[0], dy = q[1] - cen[1], L = Math.hypot(dx, dy) || 1; g += tgT(q[0] + dx / L * 16, q[1] + dy / L * 16, o.V[i], 'tx', 18); });
  return `<svg viewBox="0 0 320 234" role="img" aria-label="${esc(o.label || 'Right-angled triangle')}" font-family="Inter, sans-serif">${g}</svg>`;
}
// orientasi rawak
const tgOri = r => ({ rot: r.i(0, 3), flip: r.f() < .5 });
// ∆ABC bersudut tegak di B, D pada AC dengan BD ⊥ AC; ang = bucu yang ditanda lengkok ('A' atau 'C')
function tgAltFig(L, phi, ang) {
  const [nA, nB, nC, nD] = L, A = [34, 184], C = [286, 184], B = [160 + 126 * Math.cos(tgRad(phi)), 184 - 126 * Math.sin(tgRad(phi))], D = [B[0], 184];
  let g = `<polygon points="${A} ${B.map(n => n.toFixed(1))} ${C}" style="fill:var(--pu);fill-opacity:.1;stroke:none"/>`;
  g += tgL(A, B, 'tx') + tgL(B, C, 'tx') + tgL(A, C, 'tx') + tgL(B, D, 'tx', 3) + tgRt(B, A, C, 12) + tgRt(D, B, C, 10);
  if (ang === 'A') g += tgArc(A, C, B, 26, '');
  if (ang === 'C') g += tgArc(C, A, B, 26, '');
  g += tgT(A[0] - 12, A[1] + 4, nA, 'tx', 18) + tgT(C[0] + 12, C[1] + 4, nC, 'tx', 18) + tgT(B[0], B[1] - 16, nB, 'tx', 18) + tgT(D[0], D[1] + 18, nD, 'tx', 18);
  return `<svg viewBox="0 0 320 214" role="img" aria-label="Segi tiga bersudut tegak dengan garis serenjang dari bucu sudut tegak" font-family="Inter, sans-serif">${g}</svg>`;
}
// rajah konteks: tangga, tanjakan, layang-layang, tiang
function tgCtxFig(kind, th, labs) {
  const c = Math.cos(tgRad(th)), s = Math.sin(tgRad(th));
  let g = '', A, R, C;
  if (kind === 'tangga') {
    const L = 170 / Math.max(s, .55); A = [250 - L * c, 196]; R = [250, 196]; C = [250, 196 - L * s];
    g += `<rect x="250" y="14" width="22" height="182" style="fill:var(--mu);fill-opacity:.25;stroke:var(--mu)" stroke-width="1.5"/>`;
  } else if (kind === 'tanjakan' || kind === 'gelongsor') {
    const k = Math.min(240, 150 / Math.max(Math.tan(tgRad(th)), .3)); A = [270 - k, 196]; R = [270, 196]; C = [270, 196 - k * Math.tan(tgRad(th))];
  } else {
    const k = Math.min(230, 170 / Math.max(Math.tan(tgRad(th)), .5)); A = [40, 196]; R = [40 + k, 196]; C = [40 + k, 196 - k * Math.tan(tgRad(th))];
    if (kind === 'layang') g += `<polygon points="${C[0]},${C[1] - 16} ${C[0] + 12},${C[1]} ${C[0]},${C[1] + 16} ${C[0] - 12},${C[1]}" style="fill:var(--pk);stroke:var(--pk)" stroke-width="1.5"/>`;
  }
  const cen = [(A[0] + R[0] + C[0]) / 3, (A[1] + R[1] + C[1]) / 3];
  g = `<line x1="14" y1="196" x2="306" y2="196" style="stroke:var(--mu)" stroke-width="3"/>` + g;
  g += `<polygon points="${A.map(n => n.toFixed(1))} ${R.map(n => n.toFixed(1))} ${C.map(n => n.toFixed(1))}" style="fill:var(--pu);fill-opacity:.1;stroke:none"/>`;
  g += tgL(A, C, 'am', 4.5) + tgL(R, C, 'tx', 3, true) + tgL(A, R, 'tx', 3, kind !== 'tangga' && kind !== 'tiang') + tgRt(R, A, C) + tgArc(A, R, C, 30, labs.th);
  if (labs.hyp) g += tgSideLab(A, C, cen, labs.hyp, 'am');
  if (labs.opp) g += tgSideLab(R, C, cen, labs.opp, 'pk');
  if (labs.adj) g += tgT((A[0] + R[0]) / 2, 214, labs.adj, 'tr', 16);
  return `<svg viewBox="0 0 320 228" role="img" aria-label="Rajah situasi" font-family="Inter, sans-serif">${g}</svg>`;
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 5.1.1 Sisi segi tiga ---------- */
  kenalSisi: [
    ({ what, tri }) => ({ q: `The diagram below shows a right-angled triangle ${tri}. Name the ${what} of angle θ.` }),
    ({ what }) => ({ q: `Based on the diagram below, which side is the ${what} of angle θ?` }),
    ({ what, tri }) => ({ q: `In ∆${tri} below, θ is an acute angle. State the ${what} of θ.` }),
    ({ what, other, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says side ${other} in the diagram below is the ${what} of angle θ. Is ${N} correct?` }, salah(N, ans, `${other} is not the ${what} of θ.`)); }
  ],
  kenalNama: [
    ({ tri, rt, what, ang }) => ({ q: `In ∆${tri}, ${rt} = 90°. State the ${what} of ${ang}.` }),
    ({ tri, rt, what, ang }) => ({ q: `∆${tri} is a right-angled triangle with ${rt} = 90°. Which side is the ${what} of ${ang}?` }),
    ({ tri, rt, what, ang }) => ({ q: `Given ∆${tri} with ${rt} = 90°. Name the ${what} if the referred angle is ${ang}.` }),
    ({ tri, rt, what, ang }) => ({ q: `Sketch ∆${tri} with ${rt} = 90°. Then, state the ${what} of ${ang}.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  duaSudut: [
    ({ a1, a2 }) => ({ q: `Based on the diagram below, state (a) the opposite side of ${a1}, (b) the adjacent side of ${a2}.` }),
    ({ a1, a2 }) => ({ q: `The diagram below shows a right-angled triangle. Name (a) the opposite side of ${a1} and (b) the adjacent side of ${a2}.` }),
    ({ a1, a2 }) => ({ q: `In the diagram below, (a) which side is opposite ${a1}? (b) Which side is adjacent to ${a2}?` })
  ],
  sudutDari: [
    ({ sd, peranan }) => ({ q: `Based on the diagram below, side ${sd} is the ${peranan} of which acute angle?` }),
    ({ sd, peranan }) => ({ q: `In the diagram below, state the acute angle that has ${sd} as its ${peranan}.` }),
    ({ sd, peranan, ans }) => { const N = vnama(); return { q: `${N} wants to use ${sd} as the ${peranan}. Which acute angle should ${N} refer to in the diagram below?` }; }
  ],
  k511: [
    ({ A, B, C, D }) => ({ q: `In the diagram below, ${tgAng(B, A, C)} = 90° and ${B}${D} is perpendicular to ${A}${C}. (a) Name the hypotenuse of ∆${A}${B}${C} and of ∆${B}${C}${D}. (b) In ∆${B}${C}${D}, name the opposite side and the adjacent side of ${tgAng(C, B, D)}.`, ans: `(a) ${tgSide(A, C)}; ${tgSide(B, C)} (b) opposite ${tgSide(B, D)}, adjacent ${tgSide(C, D)}`, work: [`∆${A}${B}${C}: right angle at ${B}, thus hypotenuse = ${tgSide(A, C)}.`, `∆${B}${C}${D}: right angle at ${D}, thus hypotenuse = ${tgSide(B, C)}.`, `For ${tgAng(C, B, D)}: the side that does not touch ${C} is ${tgSide(B, D)} (opposite); the side that touches ${C} other than the hypotenuse is ${tgSide(C, D)} (adjacent).`] }),
    ({ A, B, C, D }) => ({ q: `In the diagram below, ${tgAng(B, A, C)} = 90° and ${B}${D} ⊥ ${A}${C}. (a) Name the hypotenuse of ∆${A}${B}${D}. (b) In ∆${A}${B}${D}, name the opposite side and the adjacent side of ${tgAng(A, B, D)}.`, ans: `(a) ${tgSide(A, B)} (b) opposite ${tgSide(B, D)}, adjacent ${tgSide(A, D)}`, work: [`∆${A}${B}${D}: right angle at ${D}, thus hypotenuse = ${tgSide(A, B)}.`, `For ${tgAng(A, B, D)}: ${tgSide(B, D)} does not touch ${A}, thus it is the opposite side.`, `${tgSide(A, D)} touches ${A} and is not the hypotenuse, thus it is the adjacent side.`] }),
    ({ A, B, C, D }) => ({ q: `In the diagram below, ${tgAng(B, A, C)} = 90° and ${B}${D} ⊥ ${A}${C}. In ∆${B}${C}${D}, what type of side is ${B}${D} for (a) ${tgAng(C, B, D)}, (b) ${tgAng(B, C, D)}? (c) Name the hypotenuse of ∆${B}${C}${D}.`, ans: `(a) opposite side (b) adjacent side (c) ${tgSide(B, C)}`, work: [`∆${B}${C}${D} is right-angled at ${D}, thus hypotenuse = ${tgSide(B, C)}.`, `(a) ${tgAng(C, B, D)} at vertex ${C}: ${B}${D} does not touch ${C}, thus it is the opposite side.`, `(b) ${tgAng(B, C, D)} at vertex ${B}: ${B}${D} touches ${B} and is not the hypotenuse, thus it is the adjacent side.`] })
  ],

  /* ---------- 5.1.2 sin, cos, tan ---------- */
  nisbahRajah: [
    ({ fn }) => ({ q: `Based on the diagram below, find the value of ${fn} θ. Give the answer as a fraction in the simplest form.` }),
    ({ fn }) => ({ q: `The diagram below shows a right-angled triangle. Write ${fn} θ as a fraction.` }),
    ({ fn }) => ({ q: `Calculate ${fn} θ for the triangle in the diagram below.` }),
    ({ fn, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} writes ${fn} θ = ${wrong} for the triangle below. Is ${N} correct?` }, salah(N, ans, `${N} chose the wrong sides. ${fn} θ = ${TGNISBAH[fn]}.`)); },
    ({ fn }) => ({ q: `Complete: For the triangle below, ${fn} θ = ${TGNISBAH[fn]} = ___` })
  ],
  nisbahHuruf: [
    ({ fn, ang }) => ({ q: `Based on the diagram below, express ${fn} ${ang} as a ratio of two sides.` }),
    ({ fn, ang }) => ({ q: `Write ${fn} ${ang} in terms of the sides of the triangle below.` }),
    ({ fn, ang }) => ({ q: `The diagram below shows a right-angled triangle. State ${fn} ${ang} as a fraction of two sides.` })
  ],
  sisiKetiga: [
    ({ fn, giv }) => ({ q: `In the right-angled triangle below, ${giv}. Find the value of ${fn} θ.` }),
    ({ fn, giv }) => ({ q: `Given ${giv}, as in the diagram below. Calculate ${fn} θ as a fraction in the simplest form.` }),
    ({ fn }) => ({ q: `One side of the triangle below is not given. Find ${fn} θ.` }),
    ({ fn, giv }) => ({ q: `The diagram below shows a right-angled triangle with ${giv}. Determine ${fn} θ.` })
  ],
  kesanSudut: [
    ({ fn, a, b }) => ({ q: `Without using a calculator, which is larger: ${fn} ${a}° or ${fn} ${b}°? Give a reason.` }),
    ({ fn, a, b }) => ({ q: `Compare ${fn} ${a}° with ${fn} ${b}°. Which one is larger? Explain.` }),
    ({ fn, a, b, ans }) => { const N = vnama(); return { q: `${N} says ${fn} ${a}° and ${fn} ${b}° have the same value because both are ${fn} ratios. Is ${N} correct?`, ans: `Not correct. ${ans}` }; },
    ({ fn, a, b }) => ({ q: `Without calculating, state whether ${fn} ${a}° is larger or smaller than ${fn} ${b}°.` })
  ],
  k512: [
    ({ g, H, ansP }) => ({ q: `In ∆PQR below, ∠PQR = 90°, ${g.giv} and PR = ${H} cm, where θ = ∠QPR. Calculate (a) the length of ${g.sideN}, (b) the length of ${g.sideM}, (c) ${g.f2} θ.`, ans: ansP }),
    ({ g, H }) => ({ q: `A right-angled triangle has a hypotenuse of ${H} cm and ${g.giv}, where θ is an acute angle. Find (a) the opposite side, (b) the adjacent side, (c) ${g.f2} θ.`, rev: true }),
    ({ g, H }) => ({ q: `Given ${g.giv}, where θ is an acute angle in a right-angled triangle with a hypotenuse of ${H} cm. Determine (a) the opposite side, (b) the adjacent side, and (c) the value of ${g.f2} θ.`, rev: true })
  ],

  /* ---------- 5.1.4 nilai & sudut khas ---------- */
  kalk: [
    ({ fn, a }) => ({ q: `Using a calculator, find the value of ${fn} ${a}° correct to 4 decimal places.` }),
    ({ fn, a }) => ({ q: `Determine the value of ${fn} ${a}°. Give the answer correct to 4 decimal places.` }),
    ({ fn, a }) => ({ q: `Calculate ${fn} ${a}° (4 decimal places).` }),
    ({ fn, a, ans }) => { const N = vnama(); return { q: `${N} finds that ${fn} ${a}° = ${ans}. Check ${N}'s answer with a calculator and state whether it is correct.`, ans: `Correct, ${fn} ${a}° = ${ans}` }; }
  ],
  sudutKalk: [
    ({ fn, v }) => ({ q: `Given ${fn} θ = ${v} and θ is an acute angle. Find θ correct to 2 decimal places.` }),
    ({ fn, v }) => ({ q: `Find the acute angle θ if ${fn} θ = ${v}. Give the answer in degrees, 2 decimal places.` }),
    ({ fn, v }) => ({ q: `Using a calculator, determine θ (2 decimal places) for ${fn} θ = ${v}, 0° &lt; θ &lt; 90°.` })
  ],
  khas: [
    ({ e }) => ({ q: `Without using a calculator, state the value of ${e}.` }),
    ({ e }) => ({ q: `Write the exact value of ${e}.` }),
    ({ e }) => ({ q: `Based on the special angle triangles, what is the value of ${e}?` })
  ],
  darjahMinit: [
    ({ x, toDM }) => ({ q: toDM ? `Convert ${x}° to degrees and minutes.` : `Convert ${x} to degrees in decimal form.` }),
    ({ x, toDM }) => ({ q: toDM ? `Express ${x}° in degrees and minutes.` : `Express ${x} in decimal degrees.` }),
    ({ x, toDM }) => ({ q: toDM ? `The angle ${x}° written in degrees and minutes is ___` : `The angle ${x} is equal to ___ degrees (decimal).` })
  ],
  operasi: [
    ({ e }) => ({ q: `Without using a calculator, calculate the value of ${e}.` }),
    ({ e }) => ({ q: `Evaluate ${e} without a calculator.` }),
    ({ e }) => ({ q: `Find the exact value of ${e}.` }),
    ({ e, ans }) => { const N = vnama(); return { q: `${N} calculates ${e} without a calculator. What answer should ${N} get?` }; }
  ],
  khasSudut: [
    ({ eq }) => ({ q: `Given ${eq} and θ is an acute angle. Find θ without using a calculator.` }),
    ({ eq }) => ({ q: `Without a calculator, determine the acute angle θ if ${eq}.` }),
    ({ eq }) => ({ q: `If ${eq}, where 0° &lt; θ &lt; 90°, what is the value of θ?` })
  ],
  sudutMinit: [
    ({ fn, v }) => ({ q: `Given ${fn} θ = ${v}. Find the acute angle θ in degrees and minutes.` }),
    ({ fn, v }) => ({ q: `Find θ, in degrees and minutes, if ${fn} θ = ${v} and θ is an acute angle.` }),
    ({ fn, v }) => ({ q: `Using a calculator, determine θ (degrees and minutes) for ${fn} θ = ${v}.` })
  ],
  k514: [
    ({ s }) => ({ q: `In the diagram below, ∠ABC = 90°, ∠BAC = ${s.ang}° and ${s.giv}. Without using a calculator, find the lengths of ${s.f1} and ${s.f2}.` }),
    ({ s }) => ({ q: `The diagram below shows ∆ABC right-angled at B with ∠BAC = ${s.ang}° and ${s.giv}. Calculate ${s.f1} and ${s.f2} in exact form (without a calculator).` }),
    ({ s }) => ({ q: `Use the values of special angles to find the lengths of ${s.f1} and ${s.f2} in the diagram below, where ∠BAC = ${s.ang}° and ${s.giv}.` })
  ],

  /* ---------- 5.1.7 penyelesaian masalah ---------- */
  cariSisi: [
    () => ({ q: 'Based on the diagram below, calculate the length of <i>x</i>. Give the answer correct to 2 decimal places.' }),
    () => ({ q: 'Find the value of <i>x</i> in the diagram below (2 decimal places).' }),
    ({ th, fn }) => ({ q: `The diagram below shows a right-angled triangle with an angle of ${th}°. Use ${fn} ${th}° to find <i>x</i>, correct to 2 decimal places.` }),
    () => ({ q: 'Determine the length of the side marked <i>x</i> in the diagram below. Round off to 2 decimal places.' })
  ],
  cariSudut: [
    () => ({ q: 'Based on the diagram below, find the angle θ in degrees and minutes.' }),
    () => ({ q: 'Calculate the angle θ in the diagram below. Give the answer in degrees and minutes.' }),
    ({ fn }) => ({ q: `Use the ${fn} ratio to find θ in the diagram below (degrees and minutes).` }),
    () => ({ q: 'Determine the size of angle θ in the triangle below, in degrees and minutes.' })
  ],
  pilihNisbah: [
    () => ({ q: 'Which trigonometric ratio (sin, cos or tan) is the most suitable to find <i>x</i> in the diagram below? Give a reason.' }),
    () => ({ q: 'To find <i>x</i> in the diagram below, state the ratio to be used and write its equation.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} wants to find <i>x</i> in the diagram below. Which ratio should ${N} use?` }; }
  ],
  cariSisiB: [
    () => ({ q: 'Based on the diagram below, calculate the length of <i>x</i> correct to 2 decimal places.' }),
    () => ({ q: 'Find <i>x</i> in the diagram below. Give the answer to 2 decimal places.' }),
    ({ wrongx, ans }) => { const N = vnama(); return Object.assign({ q: `${N} finds that <i>x</i> = ${wrongx} for the diagram below. Is ${N} correct?` }, salah(N, ans, `${N} multiplied by the ratio. Since <i>x</i> is in the denominator, we need to divide.`)); },
    () => ({ q: 'The diagram below shows a right-angled triangle. Determine the length of <i>x</i> (2 decimal places).' })
  ],
  konteks: [
    ({ c }) => ({ q: c.q1 }),
    ({ c }) => ({ q: c.q2 }),
    ({ c }) => ({ q: c.q3 })
  ],
  k517: [
    ({ t }) => ({ q: t.q, ans: t.ans, work: t.work })
  ]
};

/* =================== pembina soalan (r = tgRG atau tgRW) =================== */
const TG = {};
/* ---------- 5.1.1 ---------- */
// segi tiga rawak berhuruf: V = [bucu θ, bucu tegak, bucu ketiga]
function tgLetTri(r) {
  const L = tgShuf(r, r.p(TGHUR3)), [nA, nR, nC] = L;
  return { V: L, nA, nR, nC, hyp: tgSide(nA, nC), opp: tgSide(nR, nC), adj: tgSide(nA, nR), tri: L.slice().sort().join('') };
}
TG.kenalSisi = (r, k) => {
  const t = tgLetTri(r), role = k == null ? r.p(['hyp', 'opp', 'adj']) : ['hyp', 'opp', 'adj'][k % 3], what = TGWHAT[role], ans = t[role];
  const other = t[role === 'hyp' ? 'adj' : role === 'opp' ? 'adj' : 'hyp'];
  const work = [`Right angle at ${t.nR}, thus hypotenuse = ${t.hyp} (opposite the right angle).`, `The side that does not touch θ (at ${t.nA}) is the opposite side = ${t.opp}.`, `The side that touches θ other than the hypotenuse is the adjacent side = ${t.adj}.`];
  const tp = r.p([[4, 3], [3, 2], [5, 3], [2, 1.4], [3, 4]]);
  return GEN_LQ('kenalSisi', { what, ans, other, tri: t.tri, work }, { fig: tgTri(Object.assign({ w: tp[0], h: tp[1], V: t.V, th: 'θ' }, tgOri(r))) });
};
TG.kenalNama = (r, k) => {
  const t = tgLetTri(r), role = k == null ? r.p(['hyp', 'opp', 'adj']) : ['opp', 'adj', 'hyp'][k % 3];
  const ang = tgAng(t.nA, t.nR, t.nC), rt = tgAng(t.nR, t.nA, t.nC);
  const work = [`${rt} = 90°, thus hypotenuse = ${t.hyp}.`, `${ang} is at vertex ${t.nA}.`, `Opposite (does not touch ${t.nA}) = ${t.opp}; adjacent (touches ${t.nA}, not the hypotenuse) = ${t.adj}.`];
  return GEN_LQ('kenalNama', { tri: t.tri, rt, ang, what: TGWHAT[role], ans: t[role], work }, { figAns: tgTri(Object.assign({ w: 4, h: 3, V: t.V, th: 'θ', col: true, hyp: 'hyp.', opp: 'opp.', adj: 'adj.' }, tgOri(r))) });
};
TG.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
TG.duaSudut = r => {
  const t = tgLetTri(r), a1 = tgAng(t.nA, t.nR, t.nC), a2 = tgAng(t.nC, t.nA, t.nR), swap = r.f() < .5;
  // (a) bertentangan bagi a1 / a2, (b) bersebelahan bagi yang lain
  const [x1, x2] = swap ? [a2, a1] : [a1, a2];
  const opp1 = swap ? t.adj : t.opp, adj2 = swap ? t.opp : t.adj;
  const fig = tgTri(Object.assign({ w: r.p([4, 3, 5]), h: r.p([3, 2, 4]), V: t.V }, tgOri(r)));
  return GEN_LQ('duaSudut', { a1: x1, a2: x2, ans: `(a) ${opp1} (b) ${adj2}`, work: [`Hypotenuse = ${t.hyp} (opposite the right angle at ${t.nR}).`, `(a) The side that does not touch vertex ${x1.slice(2, 3)} is ${opp1}.`, `(b) The side that touches vertex ${x2.slice(2, 3)}, other than the hypotenuse, is ${adj2}.`] }, { fig });
};
TG.sudutDari = r => {
  const t = tgLetTri(r), useOpp = r.f() < .5, sd = t.opp; // sisi R–C
  // sd bertentangan bagi sudut di A, bersebelahan bagi sudut di C
  const ans = useOpp ? tgAng(t.nA, t.nR, t.nC) : tgAng(t.nC, t.nA, t.nR);
  const peranan = useOpp ? 'opposite side' : 'adjacent side';
  const fig = tgTri(Object.assign({ w: r.p([4, 3, 5]), h: r.p([3, 2, 4]), V: t.V }, tgOri(r)));
  return GEN_LQ('sudutDari', { sd, peranan, ans, work: [`The acute angles are at ${t.nA} and at ${t.nC}.`, `${sd} does not touch ${t.nA}, thus ${sd} is opposite ${tgAng(t.nA, t.nR, t.nC)}.`, `${sd} touches ${t.nC} and is not the hypotenuse, thus ${sd} is adjacent to ${tgAng(t.nC, t.nA, t.nR)}.`] }, { fig });
};
TG.k511 = r => {
  const [A, B, C, D] = r.p(TGHUR4), phi = r.i(55, 125);
  const v = GEN_LQ('k511', { A, B, C, D, ans: '' });
  return Object.assign(v, { fig: tgAltFig([A, B, C, D], phi, '') });
};

/* ---------- 5.1.2 ---------- */
const tgRatio = (fn, o, a, h) => (fn === 'sin' ? [o, h] : fn === 'cos' ? [a, h] : [o, a]);
TG.nisbahRajah = (r, k) => {
  const [o, a, h] = r.p(TGTRIP), fn = k == null ? r.p(TGFN) : TGFN[k % 3], [n, d] = tgRatio(fn, o, a, h), ans = tgFr(n, d);
  const wr = fn === 'sin' ? tgFr(o, a) : fn === 'cos' ? tgFr(o, h) : tgFr(a, o);
  const raw = `${n}/${d}`, work = [`${fn} θ = ${TGNISBAH[fn]}`, `= ${raw}`].concat(raw === ans ? [] : [`= ${ans}`]);
  const u = r.p(['cm', 'm', 'unit']), lab = x => (u === 'unit' ? `${x}` : `${x} ${u}`);
  return GEN_LQ('nisbahRajah', { fn, ans, wrong: wr, work }, { fig: tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: lab(h), opp: lab(o), adj: lab(a) }, tgOri(r))) });
};
TG.nisbahHuruf = (r, k) => {
  const t = tgLetTri(r), fn = k == null ? r.p(TGFN) : TGFN[k % 3], ang = tgAng(t.nA, t.nR, t.nC);
  const [n, d] = tgRatio(fn, t.opp, t.adj, t.hyp), ans = `${n}/${d}`;
  return GEN_LQ('nisbahHuruf', { fn, ang, ans, work: [`For ${ang}: hypotenuse = ${t.hyp}, opposite = ${t.opp}, adjacent = ${t.adj}.`, `${fn} ${ang} = ${TGNISBAH[fn]} = ${ans}`] }, { fig: tgTri(Object.assign({ w: 4, h: 3, V: t.V }, tgOri(r))) });
};
TG.sisiKetiga = r => {
  const [o, a, h] = r.p(TGTRIP), miss = r.p(['hyp', 'opp', 'adj']), fn = r.p(TGFN.filter(f => miss === 'hyp' ? f !== 'tan' : miss === 'opp' ? f !== 'cos' : f !== 'sin'));
  const [n, d] = tgRatio(fn, o, a, h), ans = tgFr(n, d), u = r.p(['cm', 'm']);
  const giv = miss === 'hyp' ? `opposite side = ${o} ${u} and adjacent side = ${a} ${u}` : miss === 'opp' ? `hypotenuse = ${h} ${u} and adjacent side = ${a} ${u}` : `hypotenuse = ${h} ${u} and opposite side = ${o} ${u}`;
  const pyt = miss === 'hyp' ? `Hypotenuse = √(${o}² + ${a}²) = √${o * o + a * a} = ${h} ${u}` : miss === 'opp' ? `Opposite side = √(${h}² − ${a}²) = √${o * o} = ${o} ${u}` : `Adjacent side = √(${h}² − ${o}²) = √${a * a} = ${a} ${u}`;
  const raw = `${n}/${d}`;
  return GEN_LQ('sisiKetiga', { fn, giv, ans, work: ['Use the Pythagoras theorem to find the third side.', pyt, `${fn} θ = ${TGNISBAH[fn]} = ${raw}`].concat(raw === ans ? [] : [`= ${ans}`]) }, { fig: tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: miss === 'hyp' ? '?' : `${h} ${u}`, opp: miss === 'opp' ? '?' : `${o} ${u}`, adj: miss === 'adj' ? '?' : `${a} ${u}` }, tgOri(r))) });
};
TG.kesanSudut = r => {
  const fn = r.p(TGFN); let a, b; do { a = r.i(5, 85); b = r.i(5, 85); } while (Math.abs(a - b) < 8);
  const big = fn === 'cos' ? (a < b ? a : b) : (a > b ? a : b), small = big === a ? b : a;
  const why = fn === 'cos' ? 'cos θ decreases when θ increases' : `${fn} θ increases when θ increases`;
  const ans = `${fn} ${big}° is larger, because ${why}`;
  return GEN_LQ('kesanSudut', { fn, a, b, ans, work: [`For acute angles, ${why}.`, `${big}° ${fn === 'cos' ? '&lt;' : '&gt;'} ${small}°, thus ${fn} ${big}° &gt; ${fn} ${small}°.`, `Check: ${fn} ${big}° = ${tg4(TGF[fn](big))}, ${fn} ${small}° = ${tg4(TGF[fn](small))}.`] });
};
TG.k512 = r => {
  const [o, a, h] = r.p([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25]]), m = r.p([2, 3, 4]), H = h * m;
  const gk = r.p(['sin', 'cos', 'tan']);
  const g = gk === 'sin' ? { giv: `sin θ = ${tgFr(o, h)}`, f2: 'tan', sideN: 'QR', sideM: 'PQ' } : gk === 'cos' ? { giv: `cos θ = ${tgFr(a, h)}`, f2: 'tan', sideN: 'PQ', sideM: 'QR' } : { giv: `tan θ = ${tgFr(o, a)}`, f2: 'sin', sideN: 'QR', sideM: 'PQ' };
  const O = o * m, A_ = a * m, f2v = g.f2 === 'tan' ? tgFr(o, a) : tgFr(o, h);
  let work;
  if (gk === 'sin') work = [`sin θ = opposite ÷ hypotenuse → opposite = ${tgFr(o, h)} × ${H} = ${O} cm`, `Adjacent = √(${H}² − ${O}²) = √${A_ * A_} = ${A_} cm`, `tan θ = ${O}/${A_} = ${f2v}`];
  else if (gk === 'cos') work = [`cos θ = adjacent ÷ hypotenuse → adjacent = ${tgFr(a, h)} × ${H} = ${A_} cm`, `Opposite = √(${H}² − ${A_}²) = √${O * O} = ${O} cm`, `tan θ = ${O}/${A_} = ${f2v}`];
  else work = [`tan θ = ${tgFr(o, a)}: let opposite = ${o}k and adjacent = ${a}k, thus hypotenuse = √((${o}k)² + (${a}k)²) = ${h}k.`, `${h}k = ${H} → k = ${m}, thus opposite = ${O} cm and adjacent = ${A_} cm`, `sin θ = ${O}/${H} = ${f2v}`];
  const ansP = gk === 'cos' ? `(a) PQ = ${A_} cm (b) QR = ${O} cm (c) tan θ = ${f2v}` : `(a) QR = ${O} cm (b) PQ = ${A_} cm (c) ${g.f2} θ = ${f2v}`;
  return GEN_LQ('k512', { g, H, ansP, ans: `(a) ${O} cm (b) ${A_} cm (c) ${g.f2} θ = ${f2v}`, work }, { fig: tgTri({ w: a, h: o, V: ['P', 'Q', 'R'], th: 'θ', hyp: `${H} cm` }) });
};

/* ---------- 5.1.4 ---------- */
TG.kalk = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3], a = r.i(1, 89), ans = tg4(TGF[fn](a));
  return GEN_LQ('kalk', { fn, a, ans, work: ['Make sure the calculator is in degree mode (D).', `Press ${fn === 'cos' ? 'cos' : fn} ${a} = → ${TGF[fn](a).toFixed(7)}…`, `≈ ${ans} (4 decimal places)`] });
};
TG.sudutKalk = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3], v = tg4(TGF[fn](r.i(100, 850) / 10)), th = TGINV[fn](+v), ans = `θ = ${tg2(th)}°`;
  return GEN_LQ('sudutKalk', { fn, v, ans, work: [`θ = ${fn === 'cos' ? 'cos' : fn}⁻¹ ${v}`, `Press SHIFT ${fn === 'cos' ? 'cos' : fn} ${v} = → ${th.toFixed(5)}…`, `θ = ${tg2(th)}°`] });
};
const TGKHASK = Object.keys(TGKHAS);
TG.khas = (r, k) => {
  const e = k == null ? r.p(TGKHASK) : TGKHASK[(k * 2 + wri(0, 8)) % 9], ans = TGKHAS[e], [fn, ang] = e.split(' ');
  const tri = ang === '45°' ? 'the right-angled isosceles triangle with sides 1, 1, √2' : 'half of the equilateral triangle with sides 1, √3, 2';
  return GEN_LQ('khas', { e, ans, work: [`Use ${tri}.`, `${e} = ${TGNISBAH[fn]} = ${ans}`] }, { fig: tgKhasFig(ang) });
};
function tgKhasFig(ang) {
  if (ang === '45°') return tgTri({ w: 1, h: 1, th: '45°', hyp: '√2', opp: '1', adj: '1', col: true });
  if (ang === '30°') return tgTri({ w: Math.sqrt(3), h: 1, th: '30°', hyp: '2', opp: '1', adj: '√3', col: true });
  return tgTri({ w: 1, h: Math.sqrt(3), th: '60°', hyp: '2', opp: '√3', adj: '1', col: true });
}
TG.darjahMinit = (r, k) => {
  const toDM = k == null ? r.f() < .5 : k % 3 !== 1;
  if (toDM) {
    const D = r.i(10, 85), q5 = r.i(1, 19), x = `${D}.${String(q5 * 5).padStart(2, '0')}`.replace(/0$/, ''), M = q5 * 3, ans = `${D}°${M}′`;
    return GEN_LQ('darjahMinit', { x, toDM, ans, work: ['1° = 60′', `${x}° = ${D}° + (0.${String(q5 * 5).padStart(2, '0').replace(/0$/, '')} × 60)′`, `= ${D}°${M}′`] });
  }
  const D = r.i(10, 85), M = r.p([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]), dec = (M / 60).toFixed(2).replace(/0+$/, '').slice(1), x = `${D}°${M}′`, ans = `${D}${dec}°`;
  return GEN_LQ('darjahMinit', { x, toDM, ans, work: ['1′ = 1/60 degree', `${x} = ${D} + ${M}/60`, `= ${D}${dec}°`] });
};
TG.operasi = r => {
  let i, j; do { i = r.i(0, TGTERM.length - 1); j = r.i(0, TGTERM.length - 1); } while (i === j || TGTERM[i][0] === TGTERM[j][0]);
  const a = r.p([1, 1, 2, 3, 4]), b = r.p([1, 2, 2, 3]), plus = r.f() < .6, T1 = TGTERM[i], T2 = TGTERM[j];
  const cf = c => (c === 1 ? '' : c + ' ');
  const e = `${cf(a)}${T1[0]} ${plus ? '+' : '−'} ${cf(b)}${T2[0]}`;
  const sub = t => (t[0].includes('×') ? `(${t[1]})` : t[1]);
  const v1 = tgMul(T1[2], a), v2 = tgMul(T2[2], plus ? b : -b), tot = tgAdd(v1, v2), ans = tgFr(tot[0], tot[1]);
  const show = (c, t) => (c === 1 ? sub(t) : `${c}(${t[1]})`);
  const l2 = `${tgFr(v1[0], v1[1])} ${plus ? '+' : '−'} ${tgFr(Math.abs(v2[0]), v2[1])}`;
  return GEN_LQ('operasi', { e, ans, work: [`= ${show(a, T1)} ${plus ? '+' : '−'} ${show(b, T2)}`, `= ${l2}`, `= ${ans}`] });
};
TG.khasSudut = (r, k) => {
  const L = [['2 sin θ = 1', '30°', 'sin θ = 1/2'], ['2 cos θ = 1', '60°', 'cos θ = 1/2'], ['tan θ = √3', '60°', 'tan θ = √3'], ['√3 tan θ = 1', '30°', 'tan θ = 1/√3'], ['2 sin θ = √3', '60°', 'sin θ = √3/2'], ['2 cos θ = √3', '30°', 'cos θ = √3/2'], ['tan θ = 1', '45°', 'tan θ = 1'], ['√2 sin θ = 1', '45°', 'sin θ = 1/√2']];
  const [eq, ans, st] = k == null ? r.p(L) : L[(k * 3 + wri(0, 7)) % L.length];
  return GEN_LQ('khasSudut', { eq, ans: `θ = ${ans}`, work: [st, `From the values of special angles, θ = ${ans}`] });
};
TG.sudutMinit = r => {
  const fn = r.p(TGFN), v = tg4(TGF[fn](r.i(100, 850) / 10)), th = TGINV[fn](+v);
  return GEN_LQ('sudutMinit', { fn, v, ans: `θ = ${tgDM(th)}`, work: [`θ = ${fn}⁻¹ ${v} = ${th.toFixed(4)}°`, `${(th - Math.floor(th)).toFixed(4)} × 60 = ${((th - Math.floor(th)) * 60).toFixed(2)}′`, `θ = ${tgDM(th)}`] });
};
TG.k514 = r => {
  const ang = r.p([30, 45, 60]), k = r.i(2, 9);
  let s;
  if (ang === 45) { const mode = r.f() < .5; s = mode ? { ang, giv: `AB = ${k} cm`, f1: 'BC', f2: 'AC', ans: `BC = ${k} cm, AC = ${k}√2 cm`, work: ['tan 45° = BC/AB = 1, thus BC = AB = ' + k + ' cm', `cos 45° = AB/AC → 1/√2 = ${k}/AC`, `AC = ${k}√2 cm`], fig: { w: 1, h: 1, adj: `${k} cm`, opp: 'BC', hyp: 'AC' } } : { ang, giv: `AC = ${2 * k} cm`, f1: 'BC', f2: 'AB', ans: `BC = AB = ${k}√2 cm`, work: [`sin 45° = BC/AC → 1/√2 = BC/${2 * k}`, `BC = ${2 * k}/√2 = ${k}√2 cm`, `Isosceles triangle, thus AB = BC = ${k}√2 cm`], fig: { w: 1, h: 1, hyp: `${2 * k} cm`, opp: 'BC', adj: 'AB' } }; }
  else if (ang === 30) s = { ang, giv: `AC = ${2 * k} cm`, f1: 'BC', f2: 'AB', ans: `BC = ${k} cm, AB = ${k}√3 cm`, work: [`sin 30° = BC/AC → 1/2 = BC/${2 * k}, thus BC = ${k} cm`, `cos 30° = AB/AC → √3/2 = AB/${2 * k}`, `AB = ${k}√3 cm`], fig: { w: Math.sqrt(3), h: 1, hyp: `${2 * k} cm`, opp: 'BC', adj: 'AB' } };
  else s = { ang, giv: `AB = ${k} cm`, f1: 'BC', f2: 'AC', ans: `BC = ${k}√3 cm, AC = ${2 * k} cm`, work: [`tan 60° = BC/AB → √3 = BC/${k}, thus BC = ${k}√3 cm`, `cos 60° = AB/AC → 1/2 = ${k}/AC`, `AC = ${2 * k} cm`], fig: { w: 1, h: Math.sqrt(3), adj: `${k} cm`, opp: 'BC', hyp: 'AC' } };
  const v = vq('k514', { s, ans: s.ans, work: s.work });
  return { q: v.q, ans: s.ans, work: s.work, fig: tgTri(Object.assign({ V: ['A', 'B', 'C'], th: `${ang}°` }, s.fig)) };
};

/* ---------- 5.1.7 ---------- */
// segi tiga berangka: sudut th, satu sisi diberi, satu dicari (x)
// mod 'atas': x di pengangka (x = sisi × nisbah); 'bawah': x di penyebut (x = sisi ÷ nisbah)
const TGPAIR = { atas: [['hyp', 'opp', 'sin'], ['hyp', 'adj', 'cos'], ['adj', 'opp', 'tan']], bawah: [['opp', 'hyp', 'sin'], ['adj', 'hyp', 'cos'], ['opp', 'adj', 'tan']] };
function tgNumTri(r, mode, forceFn) {
  const th = r.i(15, 75), opts = TGPAIR[mode], pr = forceFn ? opts.find(p => p[2] === forceFn) : r.p(opts), [gv, fd, fn] = pr;
  const L = r.p([5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25]), u = r.p(['cm', 'cm', 'm']);
  const fv = TGF[fn](th), x = mode === 'atas' ? L * fv : L / fv;
  const lab = { hyp: '', opp: '', adj: '' }; lab[gv] = `${L} ${u}`; lab[fd] = 'x';
  const eqn = mode === 'atas' ? `${fn} ${th}° = x/${L}` : `${fn} ${th}° = ${L}/x`;
  const work = [`Given ${TGWHAT[gv]} = ${L} ${u}, to find ${TGWHAT[fd]} → use ${fn}.`, eqn, mode === 'atas' ? `x = ${L} × ${fn} ${th}°` : `x = ${L} ÷ ${fn} ${th}°`, `x = ${tg2(x)} ${u}`];
  const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: `${th}°` }, lab, tgOri(r)));
  return { mode, th, fn, L, u, x, ans: `x = ${tg2(x)} ${u}`, work, fig, wrongx: `${tg2(mode === 'atas' ? L / fv : L * fv)} ${u}`, gv, fd };
}
TG.cariSisi = (r, k) => { const d = tgNumTri(r, 'atas', k == null ? null : TGFN[k % 3]); return GEN_LQ('cariSisi', d, { fig: d.fig }); };
TG.cariSisiB = (r, k) => { const d = tgNumTri(r, 'bawah', k == null ? null : TGFN[k % 3]); return GEN_LQ('cariSisiB', d, { fig: d.fig }); };
TG.pilihNisbah = (r, k) => {
  const d = tgNumTri(r, r.f() < .5 ? 'atas' : 'bawah', k == null ? null : TGFN[k % 3]);
  const eqn = d.work[1];
  return GEN_LQ('pilihNisbah', { ans: `${d.fn} ${d.th}°, because the sides involved are the ${TGWHAT[d.gv]} and the ${TGWHAT[d.fd]}; ${eqn}`, work: [`Given side: ${TGWHAT[d.gv]}. Side to find: ${TGWHAT[d.fd]}.`, `${d.fn} θ = ${TGNISBAH[d.fn]}`, `Equation: ${eqn}`] }, { fig: d.fig });
};
TG.cariSudut = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3]; let n, d;
  do { n = r.i(3, 20); d = r.i(4, 25); } while ((fn !== 'tan' && n >= d) || n === d || tgGcd(n, d) > 2);
  const v = n / d, th = TGINV[fn](v), u = r.p(['cm', 'm']);
  const lab = fn === 'sin' ? { opp: `${n} ${u}`, hyp: `${d} ${u}` } : fn === 'cos' ? { adj: `${n} ${u}`, hyp: `${d} ${u}` } : { opp: `${n} ${u}`, adj: `${d} ${u}` };
  const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: 'θ' }, lab, tgOri(r)));
  return GEN_LQ('cariSudut', { fn, ans: `θ = ${tgDM(th)}`, work: [`${fn} θ = ${TGNISBAH[fn]} = ${n}/${d}`, `θ = ${fn}⁻¹ (${n}/${d}) = ${th.toFixed(4)}°`, `θ = ${tgDM(th)}`] }, { fig });
};
TG.konteks = r => {
  const kind = r.p(['tangga', 'tanjakan', 'layang', 'tiang', 'gelongsor']);
  let c;
  if (kind === 'tangga') {
    const L = r.p([4, 5, 6, 7, 8]), th = r.i(55, 78), hh = L * TGF.sin(th), fi = r.f() < .5;
    c = fi ? { q1: `A ladder ${L} m long leans against a vertical wall and makes an angle of ${th}° with the floor. Calculate the height of the top end of the ladder from the floor.`, q2: `A ${L} m ladder leans against a wall with an angle of ${th}° between the ladder and the horizontal floor. How high up the wall does the ladder reach?`, q3: `A painter leans a ${L} m ladder against a wall. The ladder makes an angle of ${th}° with the floor. Find the height of the point where the ladder touches the wall.`, ans: `${tg2(hh)} m`, work: [`Hypotenuse = ${L} m, to find the opposite side → sin`, `height = ${L} × sin ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('tangga', th, { th: `${th}°`, hyp: `${L} m`, opp: '?' }) }
      : { q1: `A ladder ${L} m long leans against a vertical wall and makes an angle of ${th}° with the floor. Calculate the distance of the foot of the ladder from the wall.`, q2: `A ${L} m ladder leans against a wall at an angle of ${th}° with the floor. How far is the foot of the ladder from the wall?`, q3: `A ${L} m ladder leans against a wall and makes an angle of ${th}° with the horizontal floor. Find the horizontal distance from the foot of the ladder to the wall.`, ans: `${tg2(L * TGF.cos(th))} m`, work: [`Hypotenuse = ${L} m, to find the adjacent side → cos`, `distance = ${L} × cos ${th}°`, `= ${tg2(L * TGF.cos(th))} m`], fig: tgCtxFig('tangga', th, { th: `${th}°`, hyp: `${L} m`, adj: '?' }) };
  } else if (kind === 'tanjakan') {
    const hc = r.p([30, 40, 45, 50, 60, 75, 80]), D = r.p([4, 5, 6, 8, 9]), th = TGINV.tan(hc / 100 / D);
    c = { q1: `A wheelchair ramp rises ${hc} cm over a horizontal distance of ${D} m. Calculate the angle between the ramp and the ground in degrees and minutes.`, q2: `A ramp to the door of a hall has a height of ${hc} cm and a horizontal distance of ${D} m. Find the angle between the ramp and the ground (degrees and minutes).`, q3: `A ramp is built with a height of ${hc} cm and a horizontal distance of ${D} m. What is the angle of inclination of the ramp? Give the answer in degrees and minutes.`, ans: `${tgDM(th)}`, work: [`Change the unit: ${hc} cm = ${hc / 100} m`, `tan θ = ${hc / 100}/${D}`, `θ = tan⁻¹ (${hc / 100}/${D}) = ${th.toFixed(4)}° = ${tgDM(th)}`], fig: tgCtxFig('tanjakan', Math.max(th, 12), { th: 'θ', opp: `${hc} cm`, adj: `${D} m` }) };
  } else if (kind === 'layang') {
    const L = r.p([20, 25, 30, 40, 50]), th = r.i(30, 65), hh = L * TGF.sin(th);
    c = { q1: `The string of a kite, ${L} m long, is pulled straight and makes an angle of ${th}° with the ground. Calculate the height of the kite from the ground. (Ignore the height of the person holding the string.)`, q2: `A student flies a kite with a straight string ${L} m long. The string makes an angle of ${th}° with the horizontal ground. What is the height of the kite? (Ignore the height of the student.)`, q3: `A kite is flown with a ${L} m string that makes an angle of ${th}° with the ground. Find the height of the kite, assuming the string starts from ground level.`, ans: `${tg2(hh)} m`, work: ['Hypotenuse = length of string, to find the opposite side → sin', `height = ${L} × sin ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('layang', th, { th: `${th}°`, hyp: `${L} m`, opp: '?' }) };
  } else if (kind === 'tiang') {
    const D = r.p([6, 8, 10, 12, 15, 20]), th = r.i(30, 65), hh = D * TGF.tan(th);
    c = { q1: `A student stands ${D} m from the foot of a pole. The angle from the student's feet to the top of the pole, measured from the ground, is ${th}°. Calculate the height of the pole.`, q2: `From a point on the ground ${D} m from the foot of a tower, the angle to the top of the tower is ${th}° with the ground. Find the height of the tower.`, q3: `A vertical pole stands on flat ground. From a point ${D} m from the foot of the pole, the line to the top of the pole makes an angle of ${th}° with the ground. What is the height of the pole?`, ans: `${tg2(hh)} m`, work: ['Adjacent = distance on the ground, to find the opposite side → tan', `height = ${D} × tan ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('tiang', th, { th: `${th}°`, adj: `${D} m`, opp: '?' }) };
  } else {
    const hh = r.p([2, 2.5, 3, 3.5, 4]), th = r.i(25, 50), L = hh / TGF.sin(th);
    c = { q1: `A slide ${hh} m high makes an angle of ${th}° with the ground. Calculate the length of the surface of the slide.`, q2: `The surface of a slide makes an angle of ${th}° with the ground and its top is ${hh} m from the ground. What is the length of the surface of the slide?`, q3: `The top of a slide is ${hh} m above the ground. If its surface makes an angle of ${th}° with the ground, find the length of the surface.`, ans: `${tg2(L)} m`, work: ['Opposite = height, to find the hypotenuse → sin', `sin ${th}° = ${hh}/x → x = ${hh} ÷ sin ${th}°`, `= ${tg2(L)} m`], fig: tgCtxFig('gelongsor', th, { th: `${th}°`, opp: `${hh} m`, hyp: 'x' }) };
  }
  return GEN_LQ('konteks', { c, ans: c.ans, work: c.work }, { fig: c.fig });
};
TG.k517 = (r, k) => {
  const typ = k == null ? r.i(0, 2) : k % 3;
  let t;
  if (typ === 0) {
    const D = r.p([12, 15, 18, 20, 25]), th = r.i(28, 50), e = r.p([1.4, 1.5, 1.6]), x = D * TGF.tan(th), N = vnama();
    t = { q: `${N} stands ${D} m from a tree on flat ground. Using a clinometer at eye level ${e} m from the ground, ${N} finds that the line of sight to the top of the tree makes an angle of ${th}° with the horizontal line. Calculate the height of the tree.`, ans: `${tg2(x + e)} m`, work: [`tan ${th}° = x/${D}, where x = height of the top above eye level`, `x = ${D} × tan ${th}° = ${tg2(x)} m`, `Height of the tree = ${tg2(x)} + ${e} = ${tg2(x + e)} m`], fig: tgCtxFig('tiang', th, { th: `${th}°`, adj: `${D} m`, opp: 'x' }) };
  } else if (typ === 1) {
    const h = r.p([6, 8, 9, 10, 12]); let a1, a2; do { a1 = r.i(40, 70); a2 = r.i(20, 40); } while (a1 - a2 < 12);
    const d1 = h / TGF.tan(a1), d2 = h / TGF.tan(a2), dc = d2 - d1;
    t = { q: `In ∆ABC, ∠ABC = 90°, AB = ${h} cm and D is a point on BC. Given ∠ADB = ${a1}° and ∠ACB = ${a2}°. Calculate the length of DC.`, ans: `DC = ${tg2(dc)} cm`, work: [`∆ABD: tan ${a1}° = ${h}/BD → BD = ${h} ÷ tan ${a1}° = ${tg2(d1)} cm`, `∆ABC: tan ${a2}° = ${h}/BC → BC = ${h} ÷ tan ${a2}° = ${tg2(d2)} cm`, `DC = BC − BD = ${tg2(dc)} cm (use the full calculator value)`], fig: tgTwoFig(h, a1, a2) };
  } else {
    const L = r.p([4, 5, 6, 8, 10]), drop = L * TGF.sin(60) - L * TGF.sin(45);
    t = { q: `A ladder ${L} m long leans against a wall and makes an angle of 60° with the floor. The foot of the ladder is then pulled away from the wall until the angle becomes 45°. How far does the top end of the ladder slide down? Give the answer correct to 2 decimal places.`, ans: `${tg2(drop)} m`, work: [`Original height = ${L} sin 60° = ${L}(√3/2) = ${tg2(L * TGF.sin(60))} m`, `New height = ${L} sin 45° = ${L}(1/√2) = ${tg2(L * TGF.sin(45))} m`, `Distance moved down = ${tg2(drop)} m`], fig: tgCtxFig('tangga', 60, { th: '60°', hyp: `${L} m` }) };
  }
  return GEN_LQ('k517', { t, ans: t.ans }, { fig: t.fig });
};
// ∆ABC bersudut tegak di B, D pada BC; sudut di D dan di C
function tgTwoFig(h, a1, a2) {
  const d1 = h / TGF.tan(a1), d2 = h / TGF.tan(a2), s = Math.min(250 / d2, 150 / h);
  const B = [30, 196], A = [30, 196 - h * s], D = [30 + d1 * s, 196], C = [30 + d2 * s, 196];
  let g = `<polygon points="${A.map(n => n.toFixed(1))} ${B} ${C.map(n => n.toFixed(1))}" style="fill:var(--pu);fill-opacity:.1;stroke:none"/>`;
  g += tgL(A, B, 'pk') + tgL(B, C, 'tx') + tgL(A, C, 'am') + tgL(A, D, 'tr') + tgRt(B, A, C);
  g += tgArc(D, C, A, 22, `${a1}°`, 'tr') + tgArc(C, B, A, 34, `${a2}°`, 'pa');
  g += tgT(A[0] - 12, A[1], 'A', 'tx', 18) + tgT(B[0] - 12, B[1] + 8, 'B', 'tx', 18) + tgT(D[0], D[1] + 18, 'D', 'tx', 18) + tgT(C[0] + 10, C[1] + 12, 'C', 'tx', 18);
  g += tgT(A[0] - 8, (A[1] + B[1]) / 2, `${h} cm`, 'pk', 15, 'end');
  return `<svg viewBox="-30 0 340 228" role="img" aria-label="Dua segi tiga bersudut tegak berkongsi sisi AB" font-family="Inter, sans-serif">${g}</svg>`;
}

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '5.1.1': {
    m: [() => TG.kenalSisi(tgRG), () => TG.kenalSisi(tgRG), () => TG.kenalNama(tgRG), () => TG.bs(tgRG, TGBS1)],
    s: [() => TG.duaSudut(tgRG), () => TG.sudutDari(tgRG)],
    k: [() => TG.k511(tgRG)]
  },
  '5.1.2': {
    m: [() => TG.nisbahRajah(tgRG), () => TG.nisbahRajah(tgRG), () => TG.nisbahHuruf(tgRG), () => TG.bs(tgRG, TGBS2)],
    s: [() => TG.sisiKetiga(tgRG), () => TG.sisiKetiga(tgRG), () => TG.kesanSudut(tgRG)],
    k: [() => TG.k512(tgRG)]
  },
  '5.1.4': {
    m: [() => TG.kalk(tgRG), () => TG.sudutKalk(tgRG), () => TG.khas(tgRG), () => TG.darjahMinit(tgRG)],
    s: [() => TG.operasi(tgRG), () => TG.operasi(tgRG), () => TG.khasSudut(tgRG), () => TG.sudutMinit(tgRG)],
    k: [() => TG.k514(tgRG)]
  },
  '5.1.7': {
    m: [() => TG.cariSisi(tgRG), () => TG.cariSisi(tgRG), () => TG.cariSudut(tgRG), () => TG.pilihNisbah(tgRG)],
    s: [() => TG.cariSisiB(tgRG), () => TG.konteks(tgRG), () => TG.konteks(tgRG)],
    k: [() => TG.k517(tgRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 5.1.1
WG.kenalSisi = i => TG.kenalSisi(tgRW, i);
WG.kenalNama = i => TG.kenalNama(tgRW, i);
WG.bs1 = i => TG.bs(tgRW, TGBS1, [0, 4, 6][i % 3] + wri(0, 1));
WG.duaSudut = () => TG.duaSudut(tgRW);
WG.sudutDari = () => TG.sudutDari(tgRW);
WG.k511 = () => TG.k511(tgRW);
// 5.1.2
WG.nisbahRajah = i => TG.nisbahRajah(tgRW, i);
WG.nisbahHuruf = i => TG.nisbahHuruf(tgRW, i);
WG.bs2 = i => TG.bs(tgRW, TGBS2, [0, 2, 5][i % 3] + wri(0, 1) * [1, 1, 2][i % 3]);
WG.sisiKetiga = () => TG.sisiKetiga(tgRW);
WG.kesanSudut = () => TG.kesanSudut(tgRW);
WG.k512 = () => TG.k512(tgRW);
// 5.1.4
WG.kalk = i => TG.kalk(tgRW, i);
WG.sudutKalk = i => TG.sudutKalk(tgRW, i);
WG.khas = i => TG.khas(tgRW, i);
WG.darjahMinit = i => TG.darjahMinit(tgRW, i);
WG.operasi = () => TG.operasi(tgRW);
WG.khasSudut = i => TG.khasSudut(tgRW, i);
WG.sudutMinit = () => TG.sudutMinit(tgRW);
WG.k514 = () => TG.k514(tgRW);
// 5.1.7
WG.cariSisi = i => TG.cariSisi(tgRW, i);
WG.cariSudut = i => TG.cariSudut(tgRW, i);
WG.pilihNisbah = i => TG.pilihNisbah(tgRW, i);
WG.cariSisiB = i => TG.cariSisiB(tgRW, i);
WG.konteks = () => TG.konteks(tgRW);
WG.k517 = i => TG.k517(tgRW, i);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '5.1.1': [['m', 'kenalSisi', 9], ['m', 'kenalNama', 6], ['m', 'bs1', 3], ['s', 'duaSudut', 5], ['s', 'sudutDari', 4], ['k', 'k511', 3]],
  '5.1.2': [['m', 'nisbahRajah', 9], ['m', 'nisbahHuruf', 6], ['m', 'bs2', 3], ['s', 'sisiKetiga', 5], ['s', 'kesanSudut', 4], ['k', 'k512', 3]],
  '5.1.4': [['m', 'kalk', 6], ['m', 'sudutKalk', 4], ['m', 'khas', 5], ['m', 'darjahMinit', 3], ['s', 'operasi', 5], ['s', 'khasSudut', 2], ['s', 'sudutMinit', 2], ['k', 'k514', 3]],
  '5.1.7': [['m', 'cariSisi', 8], ['m', 'cariSudut', 6], ['m', 'pilihNisbah', 4], ['s', 'cariSisiB', 5], ['s', 'konteks', 4], ['k', 'k517', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function tgOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
// pilihan nombor (2 t.p.) dengan unit
function tgOptsN(ans, cands, u) {
  const A = `${tg2(ans)} ${u}`, seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !isFinite(c)) continue; const s = `${tg2(c)} ${u}`; if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const s = `${tg2(ans * (1 + k * .13))} ${u}`; if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const tgMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const CQGEN = {
  sisi: [
    () => {
      const t = tgLetTri(tgRG), role = pick(['hyp', 'opp', 'adj']), w = { hyp: 'hypotenuse', opp: 'opposite side', adj: 'adjacent side' }[role];
      // pilihan ke-4: sisi palsu (huruf bukan bucu segi tiga)
      const fake = tgSide(t.nA, pick(TGHUR3.find(h => !h.includes(t.nA)) || ['W']));
      return tgMcq(`What is the <b>${w}</b> of angle θ?`, tgTri(Object.assign({ w: 4, h: 3, V: t.V, th: 'θ' }, tgOri(tgRG))), tgOptsT(t[role], [t.hyp, t.opp, t.adj, fake]));
    },
    () => {
      const L = pick(TGHUR4), [A, B, C, D] = L, ty = ri(0, 2);
      const fig = tgAltFig(L, ri(60, 120), ty === 2 ? 'A' : 'C');
      const all = [tgSide(A, B), tgSide(B, C), tgSide(A, C), tgSide(B, D), tgSide(A, D), tgSide(C, D)];
      if (ty === 0) return tgMcq(`What is the hypotenuse of ∆${B}${C}${D}?`, fig, tgOptsT(tgSide(B, C), all));
      if (ty === 1) return tgMcq(`In ∆${B}${C}${D}, what is the opposite side of ${tgAng(C, B, D)}?`, fig, tgOptsT(tgSide(B, D), all));
      return tgMcq(`In ∆${A}${B}${D}, what is the adjacent side of ${tgAng(A, B, D)}?`, fig, tgOptsT(tgSide(A, D), all));
    },
    () => {
      const L = pick(TGHUR4), [A, B, C, D] = L, fig = tgAltFig(L, ri(60, 120), 'C');
      const all = [tgSide(A, B), tgSide(B, C), tgSide(A, C), tgSide(B, D), tgSide(A, D), tgSide(C, D)];
      if (Math.random() < .5) return tgMcq(`In ∆${A}${B}${C}, what is the opposite side of ${tgAng(C, A, B)}?`, fig, tgOptsT(tgSide(A, B), all));
      return tgMcq(`What is the hypotenuse of ∆${A}${B}${D}?`, fig, tgOptsT(tgSide(A, B), all));
    }
  ],
  nisbah: [
    () => {
      const [o, a, h] = pick(TGTRIP), fn = pick(TGFN), [n, d] = tgRatio(fn, o, a, h);
      return tgMcq(`What is <b>${fn} θ</b>?`, tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: `${h}`, opp: `${o}`, adj: `${a}` }, tgOri(tgRG))), tgOptsT(tgFr(n, d), [tgFr(o, h), tgFr(a, h), tgFr(o, a), tgFr(a, o), tgFr(h, o), tgFr(h, a)]));
    },
    () => {
      const t = tgLetTri(tgRG), fn = pick(TGFN), [n, d] = tgRatio(fn, t.opp, t.adj, t.hyp), ang = tgAng(t.nA, t.nR, t.nC);
      return tgMcq(`${fn} ${ang} = ?`, tgTri(Object.assign({ w: 4, h: 3, V: t.V }, tgOri(tgRG))), tgOptsT(`${n}/${d}`, [`${t.opp}/${t.hyp}`, `${t.adj}/${t.hyp}`, `${t.opp}/${t.adj}`, `${t.adj}/${t.opp}`, `${t.hyp}/${t.opp}`]));
    },
    () => {
      if (Math.random() < .5) {
        const [o, a, h] = pick(TGTRIP), miss = pick(['opp', 'adj']), fn = miss === 'opp' ? 'tan' : 'cos', [n, d] = tgRatio(fn, o, a, h);
        return tgMcq(`Find <b>${fn} θ</b>. (Use the Pythagoras theorem)`, tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: `${h}`, opp: miss === 'opp' ? '?' : `${o}`, adj: miss === 'adj' ? '?' : `${a}` }, tgOri(tgRG))), tgOptsT(tgFr(n, d), [tgFr(o, h), tgFr(a, h), tgFr(o, a), tgFr(a, o), tgFr(h, a), tgFr(h, o)]));
      }
      const fn = pick(TGFN); let a, b; do { a = ri(5, 85); b = ri(5, 85); } while (Math.abs(a - b) < 10);
      const big = fn === 'cos' ? Math.min(a, b) : Math.max(a, b), small = big === a ? b : a;
      const o = shuffle([`${fn} ${big}° is larger`, `${fn} ${small}° is larger`, 'Both are equal', 'Cannot be determined']);
      return { type: 'mcq', q: `Compare <b>${fn} ${a}°</b> and <b>${fn} ${b}°</b>.`, fig: tgTri({ w: 4, h: 3, th: 'θ', col: true, hyp: 'hyp.', opp: 'opp.', adj: 'adj.' }), opts: o, c: o.indexOf(`${fn} ${big}° is larger`) };
    }
  ],
  khas: [
    () => { const e = pick(TGKHASK); return tgMcq(`<b>${e}</b> = ?`, tgKhasFig(e.split(' ')[1]), tgOptsT(TGKHAS[e], TGKHASV)); },
    () => {
      const e = pick(TGKHASK), [fn, ang] = e.split(' '), v = TGKHAS[e];
      return tgMcq(`If <b>${fn} θ = ${v}</b>, then θ = ?`, tgTri({ w: 4, h: 3, th: 'θ' }), tgOptsT(ang, ['30°', '45°', '60°', '90°']));
    },
    () => {
      let i, j; do { i = ri(0, TGTERM.length - 1); j = ri(0, TGTERM.length - 1); } while (i === j || TGTERM[i][0] === TGTERM[j][0]);
      const a = pick([1, 2]), plus = Math.random() < .6, v = tgAdd(tgMul(TGTERM[i][2], a), tgMul(TGTERM[j][2], plus ? 1 : -1)), ans = tgFr(v[0], v[1]);
      const cands = [tgFr(v[0] + v[1], v[1]), tgFr(v[0] - v[1], v[1]), tgFr(v[0] * 2, v[1]), tgFr(v[0] + 1, v[1] * 2), '1/2', '3/4', '2', '0', '1', '3/2'];
      return tgMcq(`Calculate <b>${a === 1 ? '' : a + ' '}${TGTERM[i][0]} ${plus ? '+' : '−'} ${TGTERM[j][0]}</b>`, tgKhasFig(pick(['30°', '45°', '60°'])), tgOptsT(ans, cands));
    }
  ],
  masalah: [
    () => {
      const d = tgNumTri(tgRG, 'atas'), fv = TGF[d.fn](d.th), other = d.fn === 'sin' ? TGF.cos(d.th) : d.fn === 'cos' ? TGF.sin(d.th) : 1 / TGF.tan(d.th);
      return tgMcq('Find <b><i>x</i></b> (2 d.p.)', d.fig, tgOptsN(d.x, [d.L / fv, d.L * other, d.L * TGF.tan(d.th), d.L / other], d.u));
    },
    () => {
      const d = tgNumTri(tgRG, Math.random() < .5 ? 'atas' : 'bawah'), fv = TGF[d.fn](d.th);
      return tgMcq('Find <b><i>x</i></b> (2 d.p.)', d.fig, tgOptsN(d.x, [d.mode === 'atas' ? d.L / fv : d.L * fv, d.L * fv, d.L / fv, d.L * TGF.cos(d.th), d.L / TGF.tan(d.th)], d.u));
    },
    () => {
      const fn = pick(TGFN); let n, dd; do { n = ri(3, 15); dd = ri(4, 20); } while ((fn !== 'tan' && n >= dd) || n === dd);
      const v = n / dd, th = TGINV[fn](v), lab = fn === 'sin' ? { opp: `${n}`, hyp: `${dd}` } : fn === 'cos' ? { adj: `${n}`, hyp: `${dd}` } : { opp: `${n}`, adj: `${dd}` };
      const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: 'θ' }, lab, tgOri(tgRG)));
      const cands = [90 - th, TGINV.tan(v), v <= 1 ? TGINV.sin(v) : 0, v <= 1 ? TGINV.cos(v) : 0, TGINV.tan(1 / v), th + 5].filter(x => x > 0 && x < 90).map(x => tgDM(x));
      return tgMcq('Find the angle <b>θ</b>', fig, tgOptsT(tgDM(th), cands.concat([tgDM(Math.min(89, th + 10)), tgDM(Math.max(1, th - 10))])));
    }
  ]
};
const CQT = { sisi: 'Sides of a triangle', nisbah: 'sin, cos & tan', khas: 'Special angles', masalah: 'Find sides & angles' };
function tgCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.nisbah;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['sisi', 'nisbah', 'nisbah', 'khas'] : Object.keys(CQT);
  return tgCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return tgCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui tgBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => tgBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => tgBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => tgBtO(c0(...a)); gq = (...a) => tgBtO(g0(...a)); }
