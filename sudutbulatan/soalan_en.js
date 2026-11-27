'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_sudutbulatan_en.py; jangan sunting dengan tangan. */
/* =================== SUDUT BULAT · SOALAN BAB 6 SUDUT DAN TANGEN BAGI BULATAN (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "sb" / "SB" supaya tidak bertembung dengan teras.

/* =================== pembantu rawak & nombor =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// sbBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const SBBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const SBBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const SBBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${SBBTAT})+)( ?)\/\2((?:${SBBTAT})+)(?![\w]|\.\d)`);
const SBBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, SBBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const sbBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function sbBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + SBBTG[c][0] + '\u0002' + SBBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + sbBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(SBBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (SBBTUN.test(a) && SBBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && SBBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + sbBtP(a) + '\u0002' + sbBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function sbBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = sbBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// sbBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function sbBtTree(s) {
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
const sbBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function sbBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * sbBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = sbBtMeas(n.a, z2), B = sbBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = sbBtMeas(n.k, z), N = sbBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function sbBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += sbBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + sbBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += sbBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += sbBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const sbBtW = (t, z) => sbBtMeas(sbBtTree(sbBtTok(String(t))), z).w;
function sbBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = sbBtTree(sbBtTok(String(t))), m = sbBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${sbBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function sbBtO(o) {
  if (typeof o === 'string') return sbBt(o);
  if (Array.isArray(o)) return o.map(sbBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = sbBtO(o[k]);
  return o;
}

const SBG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };       // Latihan Kelas / games
const SBW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };              // Lembaran Kerja (berbenih)
const sbE = (r, a, b) => 2 * r.i(Math.ceil(a / 2), Math.floor(b / 2));                  // nombor genap dalam [a, b]
const sbD = v => `${fmt(v)}°`;
const sbNum = v => String(Math.round(v * 1000) / 1000);
const sbRad = d => d * Math.PI / 180;
const sbN1 = v => +v.toFixed(1);

/* =================== huruf =================== */
const SBL3 = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['E', 'F', 'G'], ['S', 'T', 'U']];
const SBL4 = [['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['K', 'L', 'M', 'N'], ['W', 'X', 'Y', 'Z']];

/* =================== rajah bulatan (unit piksel, pusat O di (0, 0), y ke bawah) =================== */
// o = { R, O:false, c:{nama:darjah pada lilitan}, x:{nama:[x,y]}, tan:[[titik, panjang+, panjang−, nama+, nama−]],
//       ext:[[dari, melalui, k, nama]], poly:[[[nama…], warna]], seg:[[a, b, warna, tebal, putus]],
//       ang:[[bucu, a, b, label, warna, refleks]], rt:[[bucu, a, b]], hide:[nama], lp:{nama:[dx,dy]}, label }
function sbFig(o) {
  const R = o.R || 100, pt = {}, onC = {}, tanEnd = {};
  if (o.O !== false) pt.O = [0, 0];
  Object.entries(o.c || {}).forEach(([k, d]) => { pt[k] = [R * Math.cos(sbRad(d)), -R * Math.sin(sbRad(d))]; onC[k] = d; });
  Object.entries(o.x || {}).forEach(([k, p]) => { pt[k] = p.slice(); });
  const segs = (o.seg || []).slice();
  (o.tan || []).forEach(([at, l1, l2, n1, n2]) => {
    const d = onC[at], t = [-Math.sin(sbRad(d)), -Math.cos(sbRad(d))], A = pt[at];
    pt[n1] = [A[0] + t[0] * l1, A[1] + t[1] * l1]; pt[n2] = [A[0] - t[0] * l2, A[1] - t[1] * l2];
    tanEnd[n1] = tanEnd[n2] = [Math.cos(sbRad(d)), -Math.sin(sbRad(d))];
    segs.unshift([n1, n2, 'gr', 4]);
  });
  (o.ext || []).forEach(([a, b, k, n]) => { const A = pt[a], B = pt[b], L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1; pt[n] = [B[0] + (B[0] - A[0]) / L * k, B[1] + (B[1] - A[1]) / L * k]; segs.push([b, n, 'pu', 3.5, true]); });
  const hide = new Set(o.hide || []);
  const tx = (x, y, t, c = 'tx', sz = 17) => `<text x="${sbN1(x)}" y="${sbN1(y)}" style="fill:var(--${c});stroke:var(--diag)" stroke-width="5" paint-order="stroke" stroke-linejoin="round" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="middle" dominant-baseline="central">${t}</text>`;
  const ln = (p, q, c, w, dash) => `<line x1="${sbN1(p[0])}" y1="${sbN1(p[1])}" x2="${sbN1(q[0])}" y2="${sbN1(q[1])}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
  const unit = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
  let s = '';
  (o.poly || []).forEach(([ns, c]) => { s += `<polygon points="${ns.map(n => pt[n].map(sbN1).join(',')).join(' ')}" style="fill:var(--${c});fill-opacity:.16;stroke:none"/>`; });
  s += `<circle cx="0" cy="0" r="${R}" style="fill:none;stroke:var(--mu)" stroke-width="3"/>`;
  segs.forEach(([a, b, c, w, dash]) => { s += ln(pt[a], pt[b], c || 'tx', w || 3.5, dash); });
  (o.ang || []).forEach(([v, a, b, lab, c, refl, rr, ld]) => {
    const V = pt[v], u = unit([pt[a][0] - V[0], pt[a][1] - V[1]]), w = unit([pt[b][0] - V[0], pt[b][1] - V[1]]);
    const deg = Math.acos(Math.max(-1, Math.min(1, u[0] * w[0] + u[1] * w[1]))) * 180 / Math.PI;
    const r = rr || (refl ? 20 : deg < 30 ? 40 : deg < 55 ? 31 : 24);
    const A = [V[0] + u[0] * r, V[1] + u[1] * r], B = [V[0] + w[0] * r, V[1] + w[1] * r];
    let sw = u[0] * w[1] - u[1] * w[0] > 0 ? 1 : 0, lg = 0; if (refl) { sw = 1 - sw; lg = 1; }
    const d = `M${sbN1(A[0])} ${sbN1(A[1])} A${r} ${r} 0 ${lg} ${sw} ${sbN1(B[0])} ${sbN1(B[1])}`;
    s += `<path d="M${sbN1(V[0])} ${sbN1(V[1])} L${d.slice(1)} Z" style="fill:var(--${c || 'am'});fill-opacity:.22"/><path d="${d}" style="fill:none;stroke:var(--${c || 'am'})" stroke-width="2.5"/>`;
    if (lab) { let bi = unit([u[0] + w[0], u[1] + w[1]]); if (refl) bi = [-bi[0], -bi[1]]; const k = ld || r + 12 + String(lab).length * 3.2; s += tx(V[0] + bi[0] * k, V[1] + bi[1] * k, lab, c || 'am', 15); }
  });
  (o.rt || []).forEach(([v, a, b]) => {
    const V = pt[v], u = unit([pt[a][0] - V[0], pt[a][1] - V[1]]), w = unit([pt[b][0] - V[0], pt[b][1] - V[1]]), k = 12;
    s += `<path d="M${sbN1(V[0] + u[0] * k)} ${sbN1(V[1] + u[1] * k)} L${sbN1(V[0] + (u[0] + w[0]) * k)} ${sbN1(V[1] + (u[1] + w[1]) * k)} L${sbN1(V[0] + w[0] * k)} ${sbN1(V[1] + w[1] * k)}" style="fill:none;stroke:var(--tx)" stroke-width="2"/>`;
  });
  (o.txt || []).forEach(([x, y, t, c]) => { s += tx(x, y, t, c || 'mu', 15); });
  Object.entries(pt).forEach(([k, p]) => {
    if (!tanEnd[k] && !hide.has(k)) s += `<circle cx="${sbN1(p[0])}" cy="${sbN1(p[1])}" r="${k === 'O' ? 4.5 : 5}" style="fill:var(--${k === 'O' ? 'mu' : 'tx'})"/>`;
  });
  Object.entries(pt).forEach(([k, p]) => {
    if (hide.has(k)) return;
    let off;
    if (o.lp && o.lp[k]) off = o.lp[k];
    else if (k === 'O') off = [13, 14];
    else if (tanEnd[k]) off = [tanEnd[k][0] * 16, tanEnd[k][1] * 16];
    else { const u = unit(p[0] || p[1] ? p : [1, 0]); off = [u[0] * 18, u[1] * 18]; }
    s += tx(p[0] + off[0], p[1] + off[1], k, k === 'O' ? 'mu' : 'tx', 17);
  });
  const xs = Object.values(pt).map(p => p[0]).concat([-R, R]), ys = Object.values(pt).map(p => p[1]).concat([-R, R]);
  const x0 = Math.min(...xs) - 34, x1 = Math.max(...xs) + 34, y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 30;
  return `<svg viewBox="${sbN1(x0)} ${sbN1(y0)} ${sbN1(x1 - x0)} ${sbN1(y1 - y0)}" role="img" aria-label="${esc(o.label || 'Circle diagram')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// sisi empat kitaran: darjah bucu [A,B,C,D] supaya ∠A = al dan ∠B = be (lawan jam)
function sbQuad(al, be, s0) {
  const a3 = Math.max(56, 2 * al + 2 * be - 304), a2 = 2 * al - a3, a4 = 2 * be - a3, a1 = 360 - a2 - a3 - a4;
  const A = s0, B = A + a1, C = B + a2, D = C + a3;
  return [A, B, C, D].map(d => ((d % 360) + 360) % 360);
}
// rajah tangen dari titik luar P (OP pada paksi-x): phi = ∠AOP
function sbTanFig(phi, opts) {
  const R = 80, d = R / Math.cos(sbRad(phi)), two = opts.two;
  const o = { R, c: { A: phi }, x: { P: [d, 0] }, seg: [['O', 'A', 'pa', 3.5], ['A', 'P', 'gr', 4]], rt: [['A', 'O', 'P']], ang: opts.ang || [], lp: { P: [16, 0], O: [-16, 0] }, label: opts.label };
  if (two) { o.c.B = -phi; o.seg.push(['O', 'B', 'pa', 3.5], ['B', 'P', 'gr', 4]); o.rt.push(['B', 'O', 'P']); o.poly = [[['O', 'A', 'P', 'B'], 'gr']]; }
  if (opts.op !== false) o.seg.push(['O', 'P', 'mu', 2.5, true]);
  if (opts.chord) o.seg.push(['A', 'B', 'pa', 3]);
  if (opts.C != null) { o.c.C = opts.C; o.seg.push(['C', 'A', 'tr', 3], ['C', 'B', 'tr', 3]); }
  if (opts.O === false) {
    o.O = false; o.seg = o.seg.filter(g => g[0] !== 'O' && g[1] !== 'O'); o.rt = []; if (o.poly) o.poly = [[['A', 'P', 'B'], 'gr']];
  }
  if (opts.txt) o.txt = opts.txt;
  return sbFig(o);
}

// dua bulatan mengikut bilangan tangen sepunya (tanpa garis tangen)
function sbSepFig(n) {
  const C = { 4: [[95, 100, 50], [230, 100, 40]], 3: [[110, 100, 55], [205, 100, 40]], 2: [[125, 100, 55], [195, 100, 45]], 1: [[150, 100, 75], [190, 100, 35]], 0: [[160, 100, 75], [172, 108, 32]] }[n];
  const s = C.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--${i ? 'pu' : 'tr'});fill-opacity:.12;stroke:var(--${i ? 'pu' : 'tr'})" stroke-width="3.5"/>`).join('');
  return `<svg viewBox="0 0 320 200" role="img" aria-label="Positions of two circles" font-family="Inter, sans-serif">${s}</svg>`;
}

/* =================== data bersama =================== */
const SBBS1 = [
  ['Angles at the circumference subtended by the same arc are equal.', true, 'All angles at the circumference in the same segment and subtended by the same arc are equal.'],
  ['The central angle is half the angle at the circumference subtended by the same arc.', false, 'The central angle is TWICE the angle at the circumference.'],
  ['The angle in a semicircle is 90°.', true, 'The angle at the circumference subtended by the diameter is ½ × 180° = 90°.'],
  ['Angles at the circumference subtended by arcs of the same length are equal.', true, 'Arcs of the same length subtend equal angles at the circumference.'],
  ['If the central angle is 100°, then the angle at the circumference subtended by the same arc is 200°.', false, 'Angle at the circumference = ½ × 100° = 50°.'],
  ['The angle in a semicircle is 180°.', false, 'The angle in a semicircle is 90°. The central angle of a diameter is 180°.'],
  ['The triangle formed by two radii and a chord is an isosceles triangle.', true, 'Two of its sides are radii of the same length.'],
  ['The longer the arc, the smaller the angle at the circumference it subtends.', false, 'The longer the arc, the LARGER the angle at the circumference it subtends.']
];
const SBBS2 = [
  ['The sum of the opposite interior angles in a cyclic quadrilateral is 180°.', true, '∠A + ∠C = 180° and ∠B + ∠D = 180°.'],
  ['The exterior angle of a cyclic quadrilateral is equal to the interior opposite angle.', true, 'Exterior angle = 180° − adjacent interior angle = interior opposite angle.'],
  ['The opposite interior angles in a cyclic quadrilateral are equal.', false, 'Opposite angles add up to 180°, they are not necessarily equal.'],
  ['All the vertices of a cyclic quadrilateral lie on the circumference of the circle.', true, 'That is the definition of a cyclic quadrilateral.'],
  ['Two adjacent angles in a cyclic quadrilateral always add up to 180°.', false, 'The angles that add up to 180° are the OPPOSITE angles.'],
  ['A quadrilateral with angles 70°, 100°, 110° and 80° in order is a cyclic quadrilateral.', true, '70° + 110° = 180° and 100° + 80° = 180°.'],
  ['A rectangle can be drawn as a cyclic quadrilateral.', true, 'Opposite angles 90° + 90° = 180°.'],
  ['A quadrilateral with angles 85°, 95°, 85° and 95° in order is a cyclic quadrilateral.', false, 'Opposite angles 85° + 85° = 170° ≠ 180°.']
];
const SBBS3 = [
  ['A tangent to a circle touches the circle at only one point.', true, 'That is the definition of a tangent. The point is called the point of tangency.'],
  ['A tangent is perpendicular to the radius at the point of tangency.', true, 'The angle between a tangent and a radius at the point of tangency is 90°.'],
  ['Two tangents drawn from an external point are equal in length.', true, 'PA = PB because ∆OAP and ∆OBP are congruent.'],
  ['The angle between a tangent and a chord is equal to the angle in the alternate segment.', true, 'This is the property of the angle in the alternate segment.'],
  ['A straight line that cuts a circle at two points is a tangent.', false, 'That line is a secant. A tangent touches at only one point.'],
  ['The angle between a tangent and a radius at the point of tangency is 45°.', false, 'The angle is 90°.'],
];
const SBSEP = [['are separate (not touching and not intersecting)', 4], ['touch externally', 3], ['intersect at two points', 2], ['touch internally', 1], ['are one inside the other without touching', 0]];
const SBTRI = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41]];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 6.1 ---------- */
  lilPusat: [
    ({ L, x }) => ({ q: `In the diagram below, O is the centre of the circle. Given ∠${L[0]}${L[2]}${L[1]} = ${x}°. Find ∠${L[0]}O${L[1]}.` }),
    ({ L, x }) => ({ q: `O is the centre of circle ${L.join('')}. The angle at the circumference ${L[0]}${L[2]}${L[1]} is ${x}°. Calculate the central angle ${L[0]}O${L[1]}.` }),
    ({ L, x }) => ({ q: `Based on the diagram below, state the value of ∠${L[0]}O${L[1]} if ∠${L[0]}${L[2]}${L[1]} = ${x}° and O is the centre of the circle.` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `O is the centre of the circle and ∠${L[0]}${L[2]}${L[1]} = ${x}°. ${N} says ∠${L[0]}O${L[1]} = ${x}° because both angles are subtended by the same arc. Is ${N} correct?` }, salah(N, ans, `The central angle is TWICE the angle at the circumference, not equal.`)); }
  ],
  pusatLil: [
    ({ L, y }) => ({ q: `In the diagram below, O is the centre of the circle and ∠${L[0]}O${L[1]} = ${y}°. Find ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, y }) => ({ q: `The central angle ${L[0]}O${L[1]} is ${y}°. What is the angle at the circumference ${L[0]}${L[2]}${L[1]} subtended by the same arc?` }),
    ({ L, y }) => ({ q: `Complete: ∠${L[0]}${L[2]}${L[1]} = ½ × ∠${L[0]}O${L[1]} = ½ × ${y}° = ___` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `O is the centre of the circle and ∠${L[0]}O${L[1]} = ${y}°. ${N} finds ∠${L[0]}${L[2]}${L[1]} = ${2 * y}°. Is ${N} correct?` }, salah(N, ans, `${N} multiplied by 2. The angle at the circumference is HALF the central angle.`)); }
  ],
  samaLengkok: [
    ({ L, x }) => ({ q: `In the diagram below, ∠${L[0]}${L[3]}${L[1]} = ${x}°. Find ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, x }) => ({ q: `Points ${L.join(', ')} lie on the circumference of a circle. Given ∠${L[0]}${L[3]}${L[1]} = ${x}°. State the value of ∠${L[0]}${L[2]}${L[1]} and give the reason.`, ans: `${x}° (subtended by the same arc ${L[0]}${L[1]})` }),
    ({ L, x }) => ({ q: `Based on the diagram below, what is ∠${L[0]}${L[2]}${L[1]} if ∠${L[0]}${L[3]}${L[1]} = ${x}°?` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `In the diagram below, ∠${L[0]}${L[3]}${L[1]} = ${x}°. ${N} says ∠${L[0]}${L[2]}${L[1]} = ${2 * x}°. Is ${N} correct?` }, salah(N, ans, `Both angles are at the circumference and subtended by the same arc, so the angles are equal.`)); }
  ],
  semibul: [
    ({ L, x }) => ({ q: `In the diagram below, ${L[0]}${L[1]} is the diameter of a circle with centre O. Given ∠${L[2]}${L[0]}${L[1]} = ${x}°. Find ∠${L[0]}${L[1]}${L[2]}.` }),
    ({ L, x }) => ({ q: `${L[0]}${L[1]} is the diameter of a circle and ${L[2]} is a point on the circumference. If ∠${L[2]}${L[0]}${L[1]} = ${x}°, calculate ∠${L[0]}${L[1]}${L[2]}.` }),
    ({ L, x }) => ({ q: `Based on the diagram below, state ∠${L[0]}${L[2]}${L[1]}, then find ∠${L[0]}${L[1]}${L[2]}.`, ans: `∠${L[0]}${L[2]}${L[1]} = 90°, ∠${L[0]}${L[1]}${L[2]} = ${90 - x}°` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `${L[0]}${L[1]} is the diameter and ∠${L[2]}${L[0]}${L[1]} = ${x}°. ${N} says ∠${L[0]}${L[1]}${L[2]} = ${180 - x}°. Is ${N} correct?` }, salah(N, ans, `${N} forgot that ∠${L[0]}${L[2]}${L[1]} = 90° (angle in a semicircle).`)); }
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  samaKaki: [
    ({ L, x }) => ({ q: `In the diagram below, O is the centre of the circle and ∠O${L[0]}${L[1]} = ${x}°. Find ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, x }) => ({ q: `O is the centre of circle ${L.join('')}. Given ∠O${L[0]}${L[1]} = ${x}°. Calculate (a) ∠${L[0]}O${L[1]}, (b) ∠${L[0]}${L[2]}${L[1]}.`, ans: `(a) ${180 - 2 * x}° (b) ${90 - x}°` }),
    ({ L, x }) => ({ q: `Based on the diagram below, O is the centre of the circle. If ∠O${L[1]}${L[0]} = ${x}°, what is ∠${L[0]}${L[2]}${L[1]}?` })
  ],
  refleks: [
    ({ L, y }) => ({ q: `In the diagram below, O is the centre of the circle and ∠${L[0]}O${L[1]} = ${y}°. Point ${L[2]} lies on the minor arc ${L[0]}${L[1]}. Find ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, y }) => ({ q: `O is the centre of the circle. The central angle ${L[0]}O${L[1]} = ${y}°. Calculate ∠${L[0]}${L[2]}${L[1]} where ${L[2]} is on the minor arc.` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `In the diagram below, ∠${L[0]}O${L[1]} = ${y}°. ${N} says ∠${L[0]}${L[2]}${L[1]} = ${y / 2}°. Is ${N} correct?` }, salah(N, ans, `${L[2]} is on the minor arc, so ∠${L[0]}${L[2]}${L[1]} is subtended by the major arc. Use the reflex angle ${L[0]}O${L[1]}.`)); }
  ],
  gab61: [
    ({ L, x }) => ({ q: `In the diagram below, ${L[0]}${L[1]} is the diameter of the circle. Given ∠${L[2]}${L[0]}${L[1]} = ${x}°. Find ∠${L[0]}${L[3]}${L[2]}.` }),
    ({ L, x }) => ({ q: `${L[0]}${L[1]} is the diameter and ${L[2]}, ${L[3]} are points on the circumference as shown in the diagram. If ∠${L[2]}${L[0]}${L[1]} = ${x}°, calculate ∠${L[0]}${L[1]}${L[2]} and ∠${L[0]}${L[3]}${L[2]}.`, ans: `∠${L[0]}${L[1]}${L[2]} = ${90 - x}°, ∠${L[0]}${L[3]}${L[2]} = ${90 - x}°` }),
    ({ L, x }) => ({ q: `Based on the diagram below, what is ∠${L[0]}${L[3]}${L[2]} if ${L[0]}${L[1]} is the diameter and ∠${L[2]}${L[0]}${L[1]} = ${x}°?` })
  ],
  k61: [
    ({ t }) => ({ q: `AB is the diameter of a circle and C is a point on the circumference. AC = ${t[0]} cm and BC = ${t[1]} cm. (a) State ∠ACB. (b) Calculate the length of AB. (c) Find the radius of the circle.`, ans: `(a) 90° (b) ${t[2]} cm (c) ${sbNum(t[2] / 2)} cm`, work: ['(a) ∠ACB = 90° (angle in a semicircle)', `(b) AB² = ${t[0]}² + ${t[1]}² = ${t[2] * t[2]}, thus AB = ${t[2]} cm`, `(c) Radius = ${t[2]} ÷ 2 = ${sbNum(t[2] / 2)} cm`] }),
    ({ e }) => ({ q: `Points A, B, C and D lie on the circumference of a circle with centre O. The length of arc AB is equal to the length of arc BC, and ∠ADB = ${e}°. Find (a) ∠BDC, (b) ∠ADC, (c) ∠AOC.`, ans: `(a) ${e}° (b) ${2 * e}° (c) ${4 * e}°`, work: [`(a) ∠BDC = ∠ADB = ${e}° (arcs of the same length)`, `(b) ∠ADC = ${e}° + ${e}° = ${2 * e}°`, `(c) ∠AOC = 2 × ∠ADC = 2 × ${2 * e}° = ${4 * e}°`] }),
    ({ g }) => ({ q: `O is the centre of circle ABC and O lies inside ∆ABC. Given ∠OAC = ${g[0]}° and ∠OBC = ${g[1]}°. Find (a) ∠ACB, (b) ∠AOB.`, ans: `(a) ${g[0] + g[1]}° (b) ${2 * (g[0] + g[1])}°`, work: [`OA = OC (radii), thus ∠OCA = ∠OAC = ${g[0]}°`, `OB = OC (radii), thus ∠OCB = ∠OBC = ${g[1]}°`, `(a) ∠ACB = ${g[0]}° + ${g[1]}° = ${g[0] + g[1]}°`, `(b) ∠AOB = 2 × ${g[0] + g[1]}° = ${2 * (g[0] + g[1])}°`] }),
    ({ h }) => ({ q: `In a circle with centre O, ∠AOB = ${h[0]}° and ∠BOC = ${h[1]}°, where A, B and C are on the circumference and O is inside ∆ABC. Find (a) ∠ACB, (b) ∠BAC, (c) ∠ABC.`, ans: `(a) ${h[0] / 2}° (b) ${h[1] / 2}° (c) ${180 - h[0] / 2 - h[1] / 2}°`, work: [`(a) ∠ACB = ½ × ∠AOB = ½ × ${h[0]}° = ${h[0] / 2}°`, `(b) ∠BAC = ½ × ∠BOC = ½ × ${h[1]}° = ${h[1] / 2}°`, `(c) ∠ABC = 180° − ${h[0] / 2}° − ${h[1] / 2}° = ${180 - h[0] / 2 - h[1] / 2}°`] })
  ],

  /* ---------- 6.2 ---------- */
  bertentangan: [
    ({ L, v, a, b }) => ({ q: `In the diagram below, ${L.join('')} is a cyclic quadrilateral. Given ∠${v} = ${a}°. Find ∠${b}.` }),
    ({ L, v, a, b }) => ({ q: `${L.join('')} is a cyclic quadrilateral with ∠${v} = ${a}°. Calculate the opposite angle, ∠${b}.` }),
    ({ v, a, b }) => ({ q: `Complete: ∠${b} = 180° − ∠${v} = 180° − ${a}° = ___` }),
    ({ L, v, a, b, ans }) => { const N = vnama(); return Object.assign({ q: `${L.join('')} is a cyclic quadrilateral and ∠${v} = ${a}°. ${N} says ∠${b} = ${a}°. Is ${N} correct?` }, salah(N, ans, 'Opposite angles in a cyclic quadrilateral add up to 180°, they are not equal.')); }
  ],
  peluaran: [
    ({ L, x }) => ({ q: `In the diagram below, ${L.join('')} is a cyclic quadrilateral and ${L[1]}${L[2]} is extended to E. Given ∠${L[3]}${L[0]}${L[1]} = ${x}°. Find ∠${L[3]}${L[2]}E.` }),
    ({ L, x }) => ({ q: `Side ${L[1]}${L[2]} of the cyclic quadrilateral ${L.join('')} is extended to E. If ∠${L[3]}${L[0]}${L[1]} = ${x}°, what is the exterior angle ${L[3]}${L[2]}E?` }),
    ({ L, x }) => ({ q: `Based on the diagram below, state the value of ∠${L[3]}${L[2]}E and give the reason.`, ans: `${x}° (exterior angle = interior opposite angle)` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `In the diagram below, ∠${L[3]}${L[0]}${L[1]} = ${x}°. ${N} says ∠${L[3]}${L[2]}E = ${180 - x}°. Is ${N} correct?` }, salah(N, ans, `${180 - x}° is ∠${L[1]}${L[2]}${L[3]}. Exterior angle = interior opposite angle = ${x}°.`)); }
  ],
  kenalKitaran: [
    ({ a }) => ({ q: `The angles of a quadrilateral PQRS in order are ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° and ∠S = ${a[3]}°. Is PQRS a cyclic quadrilateral?` }),
    ({ a }) => ({ q: `Can a circle be drawn through all four vertices of quadrilateral PQRS if ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° and ∠S = ${a[3]}°? Give a reason.` }),
    ({ a }) => ({ q: `A quadrilateral PQRS has ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° and ∠S = ${a[3]}°. Determine whether PQRS is a cyclic quadrilateral.` })
  ],
  algebra62: [
    ({ L, e1, e2 }) => ({ q: `In the cyclic quadrilateral ${L.join('')}, ∠${L[0]} = ${e1}° and ∠${L[2]} = ${e2}°. Find the value of x.` }),
    ({ L, e1, e2 }) => ({ q: `${L.join('')} is a cyclic quadrilateral. Given ∠${L[0]} = ${e1}° and ∠${L[2]} = ${e2}°. Calculate the value of x.` }),
    ({ L, e1, e2, x, v1 }) => ({ q: `The opposite angles ${L[0]} and ${L[2]} in the cyclic quadrilateral ${L.join('')} are ${e1}° and ${e2}° respectively. Find the value of x and ∠${L[0]}.`, ans: `x = ${x}, ∠${L[0]} = ${v1}°` })
  ],
  pusat62: [
    ({ L, y }) => ({ q: `In the diagram below, O is the centre of the circle and ${L.join('')} is a cyclic quadrilateral. Given ∠${L[1]}O${L[3]} = ${y}°. Find ∠${L[1]}${L[2]}${L[3]}.` }),
    ({ L, y }) => ({ q: `O is the centre of the circle and ∠${L[1]}O${L[3]} = ${y}°. Calculate (a) ∠${L[1]}${L[0]}${L[3]}, (b) ∠${L[1]}${L[2]}${L[3]}.`, ans: `(a) ${y / 2}° (b) ${180 - y / 2}°` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `In the diagram below, ∠${L[1]}O${L[3]} = ${y}°. ${N} says ∠${L[1]}${L[2]}${L[3]} = ${y / 2}°. Is ${N} correct?` }, salah(N, ans, `${y / 2}° is ∠${L[1]}${L[0]}${L[3]}. ∠${L[1]}${L[2]}${L[3]} is opposite to it, so 180° − ${y / 2}°.`)); }
  ],
  duaSudut: [
    ({ L, p, q }) => ({ q: `In the diagram below, ${L.join('')} is a cyclic quadrilateral with ∠${L[3]}${L[0]}${L[1]} = ${p}° and ∠${L[0]}${L[1]}${L[2]} = ${q}°. Find the values of x and y.` }),
    ({ L, p, q }) => ({ q: `Based on the diagram below, calculate the values of x and y.` }),
    ({ L, p, q }) => ({ q: `${L.join('')} is a cyclic quadrilateral. Given ∠${L[0]} = ${p}° and ∠${L[1]} = ${q}°. If ∠${L[2]} = x° and ∠${L[3]} = y°, find x + y.`, ans: `x + y = ${360 - p - q}` })
  ],
  k62: [
    ({ u }) => ({ q: `ABCD is a cyclic quadrilateral with AB = AD. Given ∠BCD = ${u}°. Find (a) ∠BAD, (b) ∠ABD.`, ans: `(a) ${180 - u}° (b) ${u / 2}°`, work: [`(a) ∠BAD = 180° − ${u}° = ${180 - u}° (opposite angles)`, '(b) AB = AD, thus ∆ABD is isosceles and ∠ABD = ∠ADB.', `∠ABD = (180° − ${180 - u}°) ÷ 2 = ${u / 2}°`] }),
    ({ w }) => ({ q: `ABCD is a cyclic quadrilateral and AC is the diameter of the circle. Given ∠BAC = ${w[0]}° and ∠CAD = ${w[1]}°. Find (a) ∠ABC, (b) ∠BCA, (c) ∠BCD.`, ans: `(a) 90° (b) ${90 - w[0]}° (c) ${180 - w[0] - w[1]}°`, work: ['(a) ∠ABC = 90° (angle in a semicircle)', `(b) ∠BCA = 180° − 90° − ${w[0]}° = ${90 - w[0]}°`, `(c) ∠BAD = ${w[0]}° + ${w[1]}° = ${w[0] + w[1]}°, thus ∠BCD = 180° − ${w[0] + w[1]}° = ${180 - w[0] - w[1]}°`] }),
    ({ z }) => ({ q: `In the cyclic quadrilateral PQRS, ∠P = ${z.a}x°, ∠R = (x + ${z.c})°, ∠Q = ${z.b}y° and ∠S = (y + ${z.d})°. Find the values of x and y.`, ans: `x = ${z.x}, y = ${z.y}`, work: [`∠P + ∠R = 180°: ${z.a}x + x + ${z.c} = 180`, `${z.a + 1}x = ${180 - z.c}, thus x = ${z.x}`, `∠Q + ∠S = 180°: ${z.b}y + y + ${z.d} = 180`, `${z.b + 1}y = ${180 - z.d}, thus y = ${z.y}`] })
  ],

  /* ---------- 6.3 ---------- */
  tjSudut: [
    ({ x }) => ({ q: `In the diagram below, PA is a tangent to the circle with centre O at A. Given ∠AOP = ${x}°. Find ∠APO.` }),
    ({ x }) => ({ q: `PA touches the circle with centre O at point A. If ∠AOP = ${x}°, calculate ∠OPA.` }),
    ({ x }) => ({ q: `Based on the diagram below, state ∠OAP, then find ∠APO.`, ans: `∠OAP = 90°, ∠APO = ${90 - x}°` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA is a tangent at A and ∠AOP = ${x}°. ${N} says ∠APO = ${180 - x}°. Is ${N} correct?` }, salah(N, ans, '∠OAP = 90° (tangent ⊥ radius). The sum of the interior angles of ∆OAP is 180°.')); }
  ],
  tjPanjang: [
    ({ r, h }) => ({ q: `PA is a tangent to the circle with centre O at A. The radius of the circle is ${r} cm and OP = ${h} cm. Calculate the length of PA.` }),
    ({ r, h }) => ({ q: `A circle with centre O has a radius of ${r} cm. Point P is ${h} cm from O. Find the length of the tangent from P to the circle.` }),
    ({ r, h }) => ({ q: `Complete: PA² = OP² − OA² = ${h}² − ${r}² = ___, thus PA = ___` })
  ],
  tjOP: [
    ({ r, t }) => ({ q: `PA is a tangent at A to the circle with centre O. Given OA = ${r} cm and PA = ${t} cm. Find OP.` }),
    ({ r, t }) => ({ q: `A tangent PA of length ${t} cm touches a circle of radius ${r} cm at A. What is the distance of point P from the centre O?` }),
    ({ r, t, h, ans }) => { const N = vnama(); return Object.assign({ q: `PA is a tangent at A, OA = ${r} cm and PA = ${t} cm. ${N} says OP = ${r + t} cm. Is ${N} correct?` }, salah(N, ans, `${N} added the lengths of the sides. ∠OAP = 90°, so use the Pythagoras theorem.`)); }
  ],
  duaTangen: [
    ({ a }) => ({ q: `PA and PB are tangents to the circle with centre O. If PA = ${a} cm, state the length of PB.` }),
    ({ x }) => ({ q: `In the diagram below, PA and PB are tangents to the circle with centre O. Given ∠APO = ${x}°. Find ∠APB.` }),
    ({ x }) => ({ q: `PA and PB are tangents from point P to the circle with centre O. If ∠APB = ${2 * x}°, find ∠OPB.` }),
    ({ x }) => ({ q: `Based on the diagram below, PA and PB are tangents. Given ∠AOP = ${x}°. Find ∠AOB.` })
  ],
  temberengSS: [
    ({ x }) => ({ q: `In the diagram below, SAT is a tangent to the circle at A. Given ∠TAB = ${x}°. Find ∠ACB.` }),
    ({ x }) => ({ q: `SAT touches the circle at A. If the angle between tangent AT and chord AB is ${x}°, what is ∠ACB?` }),
    ({ x }) => ({ q: `Based on the diagram below, state the value of ∠ACB and give the reason.`, ans: `${x}° (angle in the alternate segment)` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `SAT is a tangent at A and ∠TAB = ${x}°. ${N} says ∠ACB = ${90 - x}°. Is ${N} correct?` }, salah(N, ans, 'The angle between a tangent and a chord is EQUAL to the angle in the alternate segment.')); }
  ],
  sepunya: [
    ({ pos }) => ({ q: `Two circles ${pos}. How many common tangents can be drawn?` }),
    ({ pos }) => ({ q: `State the number of common tangents of two circles that ${pos}.` }),
    ({ pos }) => ({ q: `A belt has to go around two circular pulleys. If the two pulleys ${pos}, how many common tangents do the two pulleys have?` })
  ],
  tjKite: [
    ({ x }) => ({ q: `In the diagram below, PA and PB are tangents to the circle with centre O. Given ∠APB = ${x}°. Find ∠AOB.` }),
    ({ x }) => ({ q: `PA and PB touch the circle with centre O at A and B. If ∠APB = ${x}°, calculate the reflex angle AOB.`, ans: `${180 + x}°`, work: ['∠OAP = ∠OBP = 90° (tangent ⊥ radius)', `∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `Reflex angle AOB = 360° − ${180 - x}° = ${180 + x}°`] }),
    ({ x }) => ({ q: `Tangents PA and PB are drawn from point P. ∠APB = ${x}°. What is ∠AOB, where O is the centre of the circle?` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA and PB are tangents and ∠APB = ${x}°. ${N} says ∠AOB = ${2 * x}°. Is ${N} correct?` }, salah(N, ans, '∠OAP = ∠OBP = 90°. The sum of the interior angles of quadrilateral OAPB is 360°.')); }
  ],
  ssTiga: [
    ({ x, y }) => ({ q: `In the diagram below, SAT is a tangent at A. Given ∠TAB = ${x}° and ∠ABC = ${y}°. Find ∠BAC.` }),
    ({ x, y }) => ({ q: `SAT is a tangent to circle ABC at A. If ∠TAB = ${x}° and ∠ABC = ${y}°, calculate ∠ACB and ∠BAC.`, ans: `∠ACB = ${x}°, ∠BAC = ${180 - x - y}°` }),
    ({ x, y }) => ({ q: `Based on the diagram below, find the value of ∠BAC.` })
  ],
  tjDua: [
    ({ r, h }) => ({ q: `PA and PB are tangents to the circle with centre O and radius ${r} cm. OP = ${h} cm. Calculate the perimeter of quadrilateral OAPB.` }),
    ({ r, h }) => ({ q: `From point P which is ${h} cm from the centre O, two tangents PA and PB are drawn to a circle of radius ${r} cm. Find the total length PA + PB.` }),
    ({ r, h }) => ({ q: `PA and PB are tangents to the circle with centre O. OA = ${r} cm and OP = ${h} cm. Calculate the area of quadrilateral OAPB.` })
  ],
  k63: [
    ({ t }) => ({ q: `PA and PB are tangents to the circle with centre O at A and B. The radius of the circle is ${t[0]} cm and PA = ${t[1]} cm. Calculate (a) OP, (b) the area of quadrilateral OAPB.`, ans: `(a) ${t[2]} cm (b) ${t[0] * t[1]} cm²`, work: ['∠OAP = 90° (tangent ⊥ radius)', `(a) OP² = ${t[0]}² + ${t[1]}² = ${t[2] * t[2]}, thus OP = ${t[2]} cm`, `(b) Area = 2 × ½ × ${t[0]} × ${t[1]} = ${t[0] * t[1]} cm²`] }),
    ({ x }) => ({ q: `PA and PB are tangents to the circle with centre O. C is a point on the major arc AB. Given ∠APB = ${x}°. Find (a) ∠AOB, (b) ∠ACB, (c) ∠PAB.`, ans: `(a) ${180 - x}° (b) ${(180 - x) / 2}° (c) ${(180 - x) / 2}°`, work: [`(a) ∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `(b) ∠ACB = ½ × ${180 - x}° = ${(180 - x) / 2}°`, `(c) PA = PB, thus ∠PAB = (180° − ${x}°) ÷ 2 = ${(180 - x) / 2}° (equal to ∠ACB: alternate segment)`] }),
    ({ x }) => ({ q: `SAT is a tangent to the circle at A and AB is the diameter. C is a point on the circumference with ∠TAC = ${x}°. Find (a) ∠ABC, (b) ∠ACB, (c) ∠BAC.`, ans: `(a) ${x}° (b) 90° (c) ${90 - x}°`, work: [`(a) ∠ABC = ∠TAC = ${x}° (alternate segment)`, '(b) ∠ACB = 90° (angle in a semicircle)', `(c) ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`] })
  ],

  /* ---------- 6.4 ---------- */
  gTanDia: [
    ({ x }) => ({ q: `In the diagram below, PAQ is a tangent at A and AB is the diameter of the circle with centre O. Given ∠QAC = ${x}°. Find ∠BAC.` }),
    ({ x }) => ({ q: `PAQ touches the circle at A and AB is the diameter. If ∠QAC = ${x}°, calculate ∠BAC.` }),
    ({ x }) => ({ q: `Based on the diagram below, AB is the diameter and PAQ is a tangent. State ∠QAB, then find ∠BAC.`, ans: `∠QAB = 90°, ∠BAC = ${90 - x}°` })
  ],
  gTanJej: [
    ({ x }) => ({ q: `In the diagram below, SAT is a tangent at A to the circle with centre O. Given ∠OBA = ${x}°. Find ∠TAB.` }),
    ({ x }) => ({ q: `O is the centre of the circle and SAT is a tangent at A. If ∠OBA = ${x}°, calculate (a) ∠OAB, (b) ∠TAB.`, ans: `(a) ${x}° (b) ${90 - x}°` }),
    ({ x }) => ({ q: `Based on the diagram below, O is the centre of the circle. What is ∠TAB if ∠OBA = ${x}°?` })
  ],
  gTanIsos: [
    ({ x }) => ({ q: `In the diagram below, PA and PB are tangents to the circle at A and B. Given ∠APB = ${x}°. Find ∠PAB.` }),
    ({ x }) => ({ q: `Two tangents, PA and PB, are drawn from point P. If ∠APB = ${x}°, calculate ∠PBA.` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA and PB are tangents and ∠APB = ${x}°. ${N} says ∠PAB = ${180 - x}°. Is ${N} correct?` }, salah(N, ans, 'PA = PB, so ∆PAB is isosceles: ∠PAB = (180° − ∠APB) ÷ 2.')); }
  ],
  gPusatKit: [
    ({ L, y }) => ({ q: `In the diagram below, O is the centre of the circle. ${L[1]}${L[2]} is extended to E and ∠${L[1]}O${L[3]} = ${y}°. Find ∠${L[3]}${L[2]}E.` }),
    ({ L, y }) => ({ q: `O is the centre of circle ${L.join('')}. Given ∠${L[1]}O${L[3]} = ${y}° and ${L[1]}${L[2]} is extended to E. Calculate the exterior angle ${L[3]}${L[2]}E.` }),
    ({ L, y }) => ({ q: `Based on the diagram below, find ∠${L[1]}${L[0]}${L[3]}, then ∠${L[3]}${L[2]}E.`, ans: `∠${L[1]}${L[0]}${L[3]} = ${y / 2}°, ∠${L[3]}${L[2]}E = ${y / 2}°` })
  ],
  gTanSS: [
    ({ x }) => ({ q: `In the diagram below, PA and PB are tangents to the circle at A and B. Given ∠APB = ${x}°. Find ∠ACB.` }),
    ({ x }) => ({ q: `Tangents PA and PB touch the circle at A and B, and C is a point on the major arc AB. If ∠APB = ${x}°, calculate ∠ACB.` }),
    ({ x }) => ({ q: `Based on the diagram below, find ∠PAB, then ∠ACB.`, ans: `∠PAB = ${(180 - x) / 2}°, ∠ACB = ${(180 - x) / 2}°` })
  ],
  gKitTan: [
    ({ x, y }) => ({ q: `In the diagram below, ABCD is a cyclic quadrilateral and SAT is a tangent at A. Given ∠TAB = ${x}° and ∠BDC = ${y}°. Find ∠ABC.` }),
    ({ x, y }) => ({ q: `SAT touches the circle at A. ABCD is a cyclic quadrilateral with ∠TAB = ${x}° and ∠BDC = ${y}°. Calculate (a) ∠ADB, (b) ∠ABC.`, ans: `(a) ${x}° (b) ${180 - x - y}°` }),
    ({ x, y }) => ({ q: `Based on the diagram below, calculate ∠ABC.` })
  ],
  gHarian: [
    ({ r, h, u }) => ({ q: `A wheel of radius ${r} ${u} has centre O. Two strings, PA and PB, touch the wheel at A and B, and are tied at point P which is ${h} ${u} from O. Calculate the total length of the two strings.` }),
    ({ r, h, u }) => ({ q: `A circular pond has a radius of ${r} ${u}. Ali stands at P, ${h} ${u} from the centre of the pond. He walks straight to the edge of the pond so that his path touches the pond at A. What is the distance PA?` }),
    ({ r, h, u }) => ({ q: `A straight belt PA touches a pulley of radius ${r} ${u} at A. If P is ${h} ${u} from the centre of the pulley, find the length of PA.` })
  ],
  k64: [
    ({ x }) => ({ q: `PAT is a tangent to the circle at A and AB is the diameter. C and D are points on the circumference with D on the arc opposite C. Given ∠PAC = ${x}°. Find (a) ∠ABC, (b) ∠BAC, (c) ∠BDC.`, ans: `(a) ${x}° (b) ${90 - x}° (c) ${90 - x}°`, work: [`(a) ∠ABC = ∠PAC = ${x}° (alternate segment)`, `(b) ∠ACB = 90° (semicircle), thus ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`, `(c) ∠BDC = ∠BAC = ${90 - x}° (subtended by the same arc BC)`] }),
    ({ x }) => ({ q: `PA and PB are tangents to the circle with centre O. C is a point on the major arc AB and D is a point on the minor arc AB. Given ∠APB = ${x}°. Find (a) ∠AOB, (b) ∠ACB, (c) ∠ADB.`, ans: `(a) ${180 - x}° (b) ${(180 - x) / 2}° (c) ${180 - (180 - x) / 2}°`, work: [`(a) ∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `(b) ∠ACB = ½ × ${180 - x}° = ${(180 - x) / 2}°`, `(c) ACBD is a cyclic quadrilateral: ∠ADB = 180° − ${(180 - x) / 2}° = ${180 - (180 - x) / 2}°`] }),
    ({ t }) => ({ q: `A disc of radius ${t[0]} cm has centre O. Two tangents, PA and PB, are drawn from point P with OP = ${t[2]} cm. Calculate (a) the length of PA, (b) the perimeter of quadrilateral OAPB, (c) the area of quadrilateral OAPB.`, ans: `(a) ${t[1]} cm (b) ${2 * (t[0] + t[1])} cm (c) ${t[0] * t[1]} cm²`, work: ['∠OAP = 90° (tangent ⊥ radius)', `(a) PA = √(${t[2]}² − ${t[0]}²) = √${t[1] * t[1]} = ${t[1]} cm`, `(b) PB = PA = ${t[1]} cm; perimeter = 2(${t[0]} + ${t[1]}) = ${2 * (t[0] + t[1])} cm`, `(c) Area = 2 × ½ × ${t[0]} × ${t[1]} = ${t[0] * t[1]} cm²`] })
  ]
};

/* =================== rajah khusus =================== */
// 6.1
const sbF = {
  pusat: (L, x, labC, labO) => { const c0 = 90 + 0; const o = { c: { [L[0]]: 270 - x, [L[1]]: 270 + x, [L[2]]: c0 }, seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [[L[2], L[0], L[1], labC, 'tr'], ['O', L[0], L[1], labO, 'pa']], lp: { O: [16, -12] }, label: 'Circle with centre O with a central angle and an angle at the circumference' }; return sbFig(o); },
  sama: (L, x, labC, labD, dc, dd) => sbFig({ O: false, c: { [L[0]]: 270 - x, [L[1]]: 270 + x, [L[2]]: dc, [L[3]]: dd }, seg: [[L[2], L[0], 'tr', 3], [L[2], L[1], 'tr', 3], [L[3], L[0], 'pk', 3], [L[3], L[1], 'pk', 3]], ang: [[L[2], L[0], L[1], labC, 'tr'], [L[3], L[0], L[1], labD, 'pk']], label: 'Two angles at the circumference subtended by the same arc' }),
  semi: (L, x, labA, labB) => sbFig({ c: { [L[0]]: 180, [L[1]]: 0, [L[2]]: 2 * x }, seg: [[L[0], L[1], 'am', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], rt: [[L[2], L[0], L[1]]], ang: [[L[0], L[2], L[1], labA, 'pk'], [L[1], L[0], L[2], labB, 'gr']], lp: { O: [0, 16] }, label: 'Angle in a semicircle' }),
  samaKaki: (L, x, labA, labC) => sbFig({ c: { [L[0]]: 180 + x, [L[1]]: 360 - x, [L[2]]: 95 }, poly: [[['O', L[0], L[1]], 'pa']], seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[0], L[1], 'mu', 3], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [[L[0], 'O', L[1], labA, 'pk'], [L[2], L[0], L[1], labC, 'tr']], lp: { O: [0, -16] }, label: 'Isosceles triangle OAB in a circle' }),
  refleks: (L, y, labO, labC) => sbFig({ c: { [L[0]]: 270 - y / 2, [L[1]]: 270 + y / 2, [L[2]]: 270 }, seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [['O', L[0], L[1], labO, 'pa', false, 18, 32], [L[2], L[0], L[1], labC, 'tr']], lp: { O: [0, -16] }, label: 'Point on the minor arc' }),
  gab: (L, x, labA, labD, dd) => sbFig({ c: { [L[0]]: 180, [L[1]]: 0, [L[2]]: 2 * x, [L[3]]: dd }, seg: [[L[0], L[1], 'am', 3.5], [L[0], L[2], 'tr', 3], [L[1], L[2], 'tr', 3], [L[3], L[0], 'pk', 3], [L[3], L[2], 'pk', 3]], ang: [[L[0], L[2], L[1], labA, 'tr'], [L[3], L[0], L[2], labD, 'pk']], lp: { O: [0, 16] }, label: 'Diameter and angles at the circumference' }),
  // 6.2
  quad: (L, al, be, s0, angs, extra) => { const d = sbQuad(al, be, s0), c = {}; L.forEach((n, i) => { c[n] = d[i]; }); return sbFig(Object.assign({ O: false, c, poly: [[L, 'pu']], seg: [[L[0], L[1], 'pu', 3.5], [L[1], L[2], 'pu', 3.5], [L[2], L[3], 'pu', 3.5], [L[3], L[0], 'pu', 3.5]], ang: angs, label: 'Cyclic quadrilateral' }, extra || {})); },
  pusatKit: (L, y, angs, ext) => { const c = { [L[0]]: 100, [L[1]]: 270 - y / 2, [L[2]]: 270 + y / 5, [L[3]]: 270 + y / 2 }; return sbFig({ c, poly: [[L, 'pu']], seg: [[L[0], L[1], 'pu', 3.5], [L[1], L[2], 'pu', 3.5], [L[2], L[3], 'pu', 3.5], [L[3], L[0], 'pu', 3.5], ['O', L[1], 'pa', 3], ['O', L[3], 'pa', 3]], ext: ext ? [[L[1], L[2], 60, 'E']] : [], ang: angs.map(g => (g[0] === 'O' ? g.concat([false, 18, 32]) : g)), lp: { O: [0, -16] }, label: 'Cyclic quadrilateral with a central angle' }); },
  // 6.3
  ss: (x, labT, labC) => sbFig({ O: false, c: { A: 270, B: 270 + 2 * x, C: 270 + 2 * x + (360 - 2 * x) / 2 }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C'], 'tr']], seg: [['A', 'B', 'pa', 3.5], ['C', 'A', 'tr', 3], ['C', 'B', 'tr', 3]], ang: [['A', 'T', 'B', labT, 'am'], ['C', 'A', 'B', labC, 'am']], label: 'Tangent SAT and the angle in the alternate segment' }),
  ss3: (x, y) => sbFig({ O: false, c: { A: 270, B: 270 + 2 * x, C: 270 - 2 * y }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C'], 'tr']], seg: [['A', 'B', 'pa', 3.5], ['C', 'A', 'tr', 3], ['C', 'B', 'tr', 3]], ang: [['A', 'T', 'B', `${x}°`, 'am'], ['B', 'A', 'C', `${y}°`, 'pk'], ['A', 'B', 'C', '?', 'tr']], label: 'Tangent and a triangle in a circle' }),
  // 6.4
  tanDia: (x, labQ, labB) => sbFig({ c: { A: 270, B: 90, C: 270 + 2 * x }, tan: [['A', 140, 140, 'Q', 'P']], seg: [['A', 'B', 'am', 3.5], ['A', 'C', 'pa', 3.5], ['B', 'C', 'pa', 3.5]], rt: [['C', 'A', 'B']], ang: [['A', 'Q', 'C', labQ, 'gr'], ['A', 'C', 'B', labB, 'pk']], lp: { O: [-14, 0] }, label: 'Tangent PAQ and diameter AB' }),
  tanJej: x => sbFig({ c: { A: 270, B: 90 - 2 * x }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['O', 'A', 'B'], 'pa']], seg: [['O', 'A', 'pa', 3.5], ['O', 'B', 'pa', 3.5], ['A', 'B', 'tr', 3.5]], rt: [['A', 'O', 'S']], ang: [['B', 'O', 'A', `${x}°`, 'pk'], ['A', 'T', 'B', '?', 'am']], lp: { O: [-14, 0] }, label: 'Tangent SAT and radii OA, OB' }),
  kitTan: (x, y) => { const b = 270 + 2 * x, cc = b + 2 * y, d = cc + (360 + 270 - cc) / 2; return sbFig({ O: false, c: { A: 270, B: b, C: cc, D: d }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C', 'D'], 'pu']], seg: [['A', 'B', 'pu', 3.5], ['B', 'C', 'pu', 3.5], ['C', 'D', 'pu', 3.5], ['D', 'A', 'pu', 3.5], ['D', 'B', 'mu', 2.5]], ang: [['A', 'T', 'B', `${x}°`, 'am'], ['D', 'B', 'C', `${y}°`, 'pk'], ['B', 'A', 'C', '?', 'tr']], label: 'Cyclic quadrilateral and tangent' }); }
};

/* =================== pembina soalan (r = SBG atau SBW) =================== */
const SB = {};
SB.lilPusat = r => {
  const L = r.p(SBL3), x = r.i(20, 75), ans = `${2 * x}°`;
  return GEN_LQ('lilPusat', { L, x, ans, work: [`∠${L[0]}O${L[1]} and ∠${L[0]}${L[2]}${L[1]} are subtended by the same arc ${L[0]}${L[1]}.`, `∠${L[0]}O${L[1]} = 2 × ${x}° = ${2 * x}°`] }, { fig: sbF.pusat(L, x, `${x}°`, '?') });
};
SB.pusatLil = r => {
  const L = r.p(SBL3), y = sbE(r, 40, 160), ans = `${y / 2}°`;
  return GEN_LQ('pusatLil', { L, y, ans, work: ['Angle at the circumference = ½ × central angle (same arc)', `∠${L[0]}${L[2]}${L[1]} = ½ × ${y}° = ${y / 2}°`] }, { fig: sbF.pusat(L, y / 2, '?', `${y}°`) });
};
SB.samaLengkok = r => {
  const L = r.p(SBL4), x = r.i(25, 75), dc = r.i(50, 75), dd = r.i(105, 135), ans = `${x}°`;
  return GEN_LQ('samaLengkok', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} and ∠${L[0]}${L[3]}${L[1]} are subtended by the same arc ${L[0]}${L[1]}.`, `Thus ∠${L[0]}${L[2]}${L[1]} = ∠${L[0]}${L[3]}${L[1]} = ${x}°`] }, { fig: sbF.sama(L, x, '?', `${x}°`, dc, dd) });
};
SB.semibul = r => {
  const L = r.p(SBL3), x = r.i(20, 70), ans = `${90 - x}°`;
  return GEN_LQ('semibul', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} = 90° (angle in a semicircle)`, `∠${L[0]}${L[1]}${L[2]} = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.semi(L, x, `${x}°`, '?') });
};
SB.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
SB.samaKaki = r => {
  const L = r.p(SBL3), x = r.i(15, 70), ans = `${90 - x}°`;
  return GEN_LQ('samaKaki', { L, x, ans, work: [`O${L[0]} = O${L[1]} (radii), thus ∠O${L[1]}${L[0]} = ∠O${L[0]}${L[1]} = ${x}°`, `∠${L[0]}O${L[1]} = 180° − ${x}° − ${x}° = ${180 - 2 * x}°`, `∠${L[0]}${L[2]}${L[1]} = ½ × ${180 - 2 * x}° = ${90 - x}°`] }, { fig: sbF.samaKaki(L, x, `${x}°`, '?') });
};
SB.refleks = r => {
  const L = r.p(SBL3), y = sbE(r, 70, 160), ans = `${180 - y / 2}°`;
  return GEN_LQ('refleks', { L, y, ans, work: [`Reflex angle ${L[0]}O${L[1]} = 360° − ${y}° = ${360 - y}°`, `∠${L[0]}${L[2]}${L[1]} = ½ × ${360 - y}° = ${180 - y / 2}°`] }, { fig: sbF.refleks(L, y, `${y}°`, '?') });
};
SB.gab61 = r => {
  const L = r.p(SBL4), x = r.i(20, 65), dd = r.i(230, 300), ans = `${90 - x}°`;
  return GEN_LQ('gab61', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} = 90° (angle in a semicircle)`, `∠${L[0]}${L[1]}${L[2]} = 180° − 90° − ${x}° = ${90 - x}°`, `∠${L[0]}${L[3]}${L[2]} = ∠${L[0]}${L[1]}${L[2]} = ${90 - x}° (subtended by the same arc ${L[0]}${L[2]})`] }, { fig: sbF.gab(L, x, `${x}°`, '?', dd) });
};
SB.k61 = r => {
  const t = r.p([[6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25]]), e = r.i(12, 40);
  let g; do { g = [r.i(12, 45), r.i(12, 45)]; } while (g[0] + g[1] >= 85 || g[0] === g[1]);
  let h; do { h = [sbE(r, 80, 170), sbE(r, 80, 170)]; } while (h[0] + h[1] <= 180 || h[0] + h[1] >= 340);
  return GEN_LQ('k61', { t, e, g, h });
};
/* ---------- 6.2 ---------- */
SB.bertentangan = r => {
  const L = r.p(SBL4), al = r.i(62, 125), be = r.i(62, 125), i = r.i(0, 3), vals = [al, be, 180 - al, 180 - be], a = vals[i], b = 180 - a;
  const v = L[i], o = L[(i + 2) % 4], ans = `${b}°`;
  const angs = [[v, L[(i + 3) % 4], L[(i + 1) % 4], `${a}°`, 'am'], [o, L[(i + 1) % 4], L[(i + 3) % 4], '?', 'tr']];
  return GEN_LQ('bertentangan', { L, v, a, b: o, ans, work: [`∠${v} and ∠${o} are opposite angles in a cyclic quadrilateral.`, `∠${o} = 180° − ${a}° = ${b}°`] }, { fig: sbF.quad(L, al, be, r.i(95, 140), angs) });
};
SB.peluaran = r => {
  const L = r.p(SBL4), x = r.i(65, 120), be = r.i(70, 110), ans = `${x}°`;
  const fig = sbF.quad(L, x, be, r.i(100, 135), [[L[0], L[1], L[3], `${x}°`, 'am'], [L[2], L[3], 'E', '?', 'tr']], { ext: [[L[1], L[2], 60, 'E']] });
  return GEN_LQ('peluaran', { L, x, ans, work: [`∠${L[1]}${L[2]}${L[3]} = 180° − ${x}° = ${180 - x}° (opposite angles)`, `∠${L[3]}${L[2]}E = 180° − ${180 - x}° = ${x}° (angles on a straight line)`, 'That is, exterior angle = interior opposite angle.'] }, { fig });
};
SB.kenalKitaran = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  let a; do {
    const p = r.i(60, 125), q = r.i(60, 125);
    if (yes) a = [p, q, 180 - p, 180 - q];
    else { const k = r.p([5, 10, 15, 20]); a = [p, q, 180 - p + k, 180 - q - k]; }
  } while (a.some(v => v < 40 || v > 150) || new Set(a).size < 3);
  const ans = yes ? `Yes, because ∠P + ∠R = 180° and ∠Q + ∠S = 180°` : `No, because ∠P + ∠R = ${a[0] + a[2]}° ≠ 180°`;
  return GEN_LQ('kenalKitaran', { a, ans, work: [`∠P + ∠R = ${a[0]}° + ${a[2]}° = ${a[0] + a[2]}°`, `∠Q + ∠S = ${a[1]}° + ${a[3]}° = ${a[1] + a[3]}°`, yes ? 'Both pairs of opposite angles add up to 180°, thus PQRS is a cyclic quadrilateral.' : 'The opposite angles do not add up to 180°, thus PQRS is not a cyclic quadrilateral.'] });
};
SB.algebra62 = r => {
  let x, p, q, c1, c2, v1; do { x = r.i(10, 40); p = r.i(1, 4); q = r.i(1, 4); v1 = r.i(60, 125); c1 = v1 - p * x; c2 = 180 - v1 - q * x; } while (p === q || c1 === 0 || c2 === 0 || Math.abs(c1) > 90 || Math.abs(c2) > 90);
  const ex = (k, c) => `${k === 1 ? '' : k}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, e1 = `(${ex(p, c1)})`, e2 = `(${ex(q, c2)})`;
  const L = r.p(SBL4);
  const sc = c1 + c2, sp = p + q;
  return GEN_LQ('algebra62', { L, e1, e2, x, v1, ans: `x = ${x}`, work: [`∠${L[0]} + ∠${L[2]} = 180° (opposite angles)`, `${ex(p, c1)} + ${ex(q, c2)} = 180`, `${sp}x${sc === 0 ? '' : ` ${sc < 0 ? '−' : '+'} ${Math.abs(sc)}`} = 180`].concat(sc === 0 ? [`x = 180 ÷ ${sp} = ${x}`] : [`${sp}x = ${180 - sc}, thus x = ${x}`]) });
};
SB.pusat62 = r => {
  const L = r.p(SBL4), y = sbE(r, 80, 170), ans = `${180 - y / 2}°`;
  return GEN_LQ('pusat62', { L, y, ans, work: [`∠${L[1]}${L[0]}${L[3]} = ½ × ${y}° = ${y / 2}° (central angle = 2 × angle at the circumference)`, `∠${L[1]}${L[2]}${L[3]} = 180° − ${y / 2}° = ${180 - y / 2}° (opposite angles)`] }, { fig: sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[1], L[3], '?', 'tr']]) });
};
SB.duaSudut = r => {
  const L = r.p(SBL4), p = r.i(65, 120), q = r.i(65, 120);
  const fig = sbF.quad(L, p, q, r.i(100, 135), [[L[0], L[1], L[3], `${p}°`, 'am'], [L[1], L[2], L[0], `${q}°`, 'pk'], [L[2], L[3], L[1], 'x', 'tr'], [L[3], L[0], L[2], 'y', 'gr']]);
  return GEN_LQ('duaSudut', { L, p, q, ans: `x = ${180 - p}, y = ${180 - q}`, work: [`x = 180 − ${p} = ${180 - p} (opposite ∠${L[0]})`, `y = 180 − ${q} = ${180 - q} (opposite ∠${L[1]})`] }, { fig });
};
SB.k62 = r => {
  const u = sbE(r, 70, 130);
  let w; do { w = [r.i(20, 60), r.i(20, 60)]; } while (w[0] === w[1]);
  let z; do { const a = r.p([2, 3, 4]), b = r.p([2, 3, 4]), x = r.i(15, 40), y = r.i(15, 40); z = { a, b, x, y, c: 180 - (a + 1) * x, d: 180 - (b + 1) * y }; } while (z.c <= 5 || z.d <= 5 || z.a === z.b);
  return GEN_LQ('k62', { u, w, z });
};
/* ---------- 6.3 ---------- */
SB.tjSudut = r => {
  const x = r.i(42, 70), ans = `${90 - x}°`;
  return GEN_LQ('tjSudut', { x, ans, work: ['∠OAP = 90° (tangent ⊥ radius)', `∠APO = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbTanFig(x, { ang: [['O', 'A', 'P', `${x}°`, 'pa', false, 16, 32], ['P', 'A', 'O', '?', 'gr', false, 30, 46]], label: 'Tangent PA and radius OA' }) });
};
SB.tjPanjang = (r, k) => {
  const [a, b, c] = r.p(SBTRI.slice(0, 7)), sw = r.f() < .5, rr = sw ? a : b, t = sw ? b : a, findOP = k == null ? r.f() < .35 : k % 3 === 2;
  const phi = Math.acos(rr / c) * 180 / Math.PI;
  if (findOP) return GEN_LQ('tjOP', { r: rr, t, h: c, ans: `${c} cm`, work: ['∠OAP = 90° (tangent ⊥ radius)', `OP² = ${rr}² + ${t}² = ${c * c}`, `OP = √${c * c} = ${c} cm`] }, { fig: sbTanFig(phi, { label: 'Tangent PA and radius OA' }) });
  return GEN_LQ('tjPanjang', { r: rr, t, h: c, ans: `${t} cm`, work: ['∠OAP = 90° (tangent ⊥ radius)', `PA² = ${c}² − ${rr}² = ${c * c - rr * rr}`, `PA = √${t * t} = ${t} cm`] }, { fig: sbTanFig(phi, { label: 'Tangent PA and radius OA' }) });
};
SB.duaTangen = r => {
  const a = r.i(5, 20), x = r.i(20, 60);
  const d = GEN_LQ('duaTangen', { a, x, ans: '' }, {});
  let ans, work, fig;
  if (d.q.includes('PA =')) { ans = `${a} cm`; work = ['Two tangents from the same external point are equal in length.', `PB = PA = ${a} cm`]; fig = sbTanFig(60, { two: true, op: false, label: 'Two tangents PA and PB' }); }
  else if (d.q.includes('∠APO')) { ans = `${2 * x}°`; work = [`∠BPO = ∠APO = ${x}° (OP bisects ∠APB)`, `∠APB = 2 × ${x}° = ${2 * x}°`]; fig = sbTanFig(90 - x, { two: true, ang: [['P', 'A', 'O', `${x}°`, 'am', false, 26, 40]], label: 'Two tangents PA and PB' }); }
  else if (d.q.includes('∠OPB')) { ans = `${x}°`; work = ['OP bisects ∠APB.', `∠OPB = ${2 * x}° ÷ 2 = ${x}°`]; fig = sbTanFig(90 - x, { two: true, ang: [['P', 'A', 'B', `${2 * x}°`, 'am', false, 18, 30]], label: 'Two tangents PA and PB' }); }
  else { const y = r.i(45, 75); ans = `${2 * y}°`; work = [`∠BOP = ∠AOP = ${y}° (∆OAP and ∆OBP are congruent)`, `∠AOB = 2 × ${y}° = ${2 * y}°`]; d.q = d.q.replace(`${x}°`, `${y}°`); fig = sbTanFig(y, { two: true, ang: [['O', 'A', 'P', `${y}°`, 'pa']], label: 'Two tangents PA and PB' }); }
  return Object.assign(d, { ans, work, fig });
};
SB.temberengSS = r => {
  const x = r.i(30, 80), ans = `${x}°`;
  return GEN_LQ('temberengSS', { x, ans, work: ['∠TAB is the angle between tangent AT and chord AB.', `∠ACB = ∠TAB = ${x}° (angle in the alternate segment)`] }, { fig: sbF.ss(x, `${x}°`, '?') });
};
SB.sepunya = (r, k) => {
  const [pos, n] = k == null ? r.p(SBSEP) : SBSEP[k % SBSEP.length];
  return GEN_LQ('sepunya', { pos, ans: String(n), work: [`Two circles that ${pos} have ${n} common tangents.`] }, { fig: sbSepFig(n) });
};
SB.tjKite = r => {
  const x = r.i(30, 100), ans = `${180 - x}°`;
  return GEN_LQ('tjKite', { x, ans, work: ['∠OAP = ∠OBP = 90° (tangent ⊥ radius)', `∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['O', 'A', 'B', '?', 'pk']], label: 'Quadrilateral OAPB' }) });
};
SB.ssTiga = r => {
  let x, y; do { x = r.i(35, 75); y = r.i(35, 75); } while (x + y > 140);
  return GEN_LQ('ssTiga', { x, y, ans: `${180 - x - y}°`, work: [`∠ACB = ∠TAB = ${x}° (alternate segment)`, `∠BAC = 180° − ${x}° − ${y}° = ${180 - x - y}°`] }, { fig: sbF.ss3(x, y) });
};
SB.tjDua = r => {
  const [a, b, c] = r.p(SBTRI), sw = r.f() < .5, rr = sw ? a : b, t = sw ? b : a, phi = Math.acos(rr / c) * 180 / Math.PI;
  const d = GEN_LQ('tjDua', { r: rr, h: c, ans: '' }, { fig: sbTanFig(phi, { two: true, label: 'Two tangents PA and PB' }) });
  const base = ['∠OAP = 90° (tangent ⊥ radius)', `PA = √(${c}² − ${rr}²) = √${t * t} = ${t} cm`, `PB = PA = ${t} cm`];
  if (d.q.includes('perimeter')) return Object.assign(d, { ans: `${2 * (rr + t)} cm`, work: base.concat([`Perimeter = ${rr} + ${t} + ${t} + ${rr} = ${2 * (rr + t)} cm`]) });
  if (d.q.includes('luas')) return Object.assign(d, { ans: `${rr * t} cm²`, work: base.slice(0, 2).concat([`Luas OAPB = 2 × ½ × ${rr} × ${t} = ${rr * t} cm²`]) });
  return Object.assign(d, { ans: `${2 * t} cm`, work: base.concat([`PA + PB = ${2 * t} cm`]) });
};
SB.k63 = r => GEN_LQ('k63', { t: r.p(SBTRI.slice(0, 7)), x: sbE(r, 30, 80) });
/* ---------- 6.4 ---------- */
SB.gTanDia = r => {
  const x = r.i(25, 70);
  return GEN_LQ('gTanDia', { x, ans: `${90 - x}°`, work: ['∠QAB = 90° (tangent ⊥ radius/diameter)', `∠BAC = 90° − ${x}° = ${90 - x}°`, `Check: ∠ABC = ${x}° (alternate segment) and ∠ACB = 90°, thus ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.tanDia(x, `${x}°`, '?') });
};
SB.gTanJej = r => {
  const x = r.i(20, 65);
  return GEN_LQ('gTanJej', { x, ans: `${90 - x}°`, work: [`OA = OB (radii), thus ∠OAB = ∠OBA = ${x}°`, '∠OAT = 90° (tangent ⊥ radius)', `∠TAB = 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.tanJej(x) });
};
SB.gTanIsos = r => {
  const x = sbE(r, 30, 100);
  return GEN_LQ('gTanIsos', { x, ans: `${(180 - x) / 2}°`, work: ['PA = PB (tangents from an external point), thus ∆PAB is isosceles.', `∠PAB = ∠PBA = (180° − ${x}°) ÷ 2 = ${(180 - x) / 2}°`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['A', 'P', 'B', '?', 'pk']], label: 'Two tangents and chord AB' }) });
};
SB.gPusatKit = r => {
  const L = r.p(SBL4), y = sbE(r, 80, 170);
  return GEN_LQ('gPusatKit', { L, y, ans: `${y / 2}°`, work: [`∠${L[1]}${L[0]}${L[3]} = ½ × ${y}° = ${y / 2}° (central angle = 2 × angle at the circumference)`, `∠${L[1]}${L[2]}${L[3]} = 180° − ${y / 2}° = ${180 - y / 2}° (opposite angles)`, `∠${L[3]}${L[2]}E = 180° − ${180 - y / 2}° = ${y / 2}° (angles on a straight line)`] }, { fig: sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[3], 'E', '?', 'tr']], true) });
};
SB.gTanSS = r => {
  const x = sbE(r, 30, 100), h = (180 - x) / 2;
  return GEN_LQ('gTanSS', { x, ans: `${h}°`, work: ['PA = PB, thus ∆PAB is isosceles.', `∠PAB = (180° − ${x}°) ÷ 2 = ${h}°`, `∠ACB = ∠PAB = ${h}° (alternate segment)`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, C: 180, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['C', 'A', 'B', '?', 'tr']], label: 'Two tangents and angle ACB' }) });
};
SB.gKitTan = r => {
  let x, y; do { x = r.i(25, 60); y = r.i(20, 50); } while (x + y > 110);
  return GEN_LQ('gKitTan', { x, y, ans: `${180 - x - y}°`, work: [`∠ADB = ∠TAB = ${x}° (alternate segment)`, `∠ADC = ${x}° + ${y}° = ${x + y}°`, `∠ABC = 180° − ${x + y}° = ${180 - x - y}° (opposite angles of a cyclic quadrilateral)`] }, { fig: sbF.kitTan(x, y) });
};
SB.gHarian = r => {
  const [a, b, c] = r.p(SBTRI), k = r.p([1, 2, 3, 5]), u = r.p(['cm', 'm']), rr = a * k, t = b * k, h = c * k, phi = Math.acos(a / c) * 180 / Math.PI;
  const d = GEN_LQ('gHarian', { r: rr, h, u, ans: '' }, {});
  const base = ['∠OAP = 90° (tangent ⊥ radius)', `PA = √(${h}² − ${rr}²) = √${t * t} = ${t} ${u}`];
  if (d.q.includes('jumlah')) return Object.assign(d, { ans: `${2 * t} ${u}`, work: base.concat([`PB = PA, thus total = 2 × ${t} = ${2 * t} ${u}`]), fig: sbTanFig(phi, { two: true, label: 'A wheel and two tangent strings' }) });
  return Object.assign(d, { ans: `${t} ${u}`, work: base, fig: sbTanFig(phi, { label: 'Tangent PA to a circle' }) });
};
SB.k64 = r => GEN_LQ('k64', { x: sbE(r, 26, 64), t: (([a, b, c], k) => [a * k, b * k, c * k])(r.p(SBTRI.slice(0, 6)), r.p([1, 2, 3])) });

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '6.1': {
    m: [() => SB.lilPusat(SBG), () => SB.pusatLil(SBG), () => SB.samaLengkok(SBG), () => SB.semibul(SBG), () => SB.bs(SBG, SBBS1)],
    s: [() => SB.samaKaki(SBG), () => SB.refleks(SBG), () => SB.gab61(SBG)],
    k: [() => SB.k61(SBG)]
  },
  '6.2': {
    m: [() => SB.bertentangan(SBG), () => SB.bertentangan(SBG), () => SB.peluaran(SBG), () => SB.kenalKitaran(SBG), () => SB.bs(SBG, SBBS2)],
    s: [() => SB.algebra62(SBG), () => SB.pusat62(SBG), () => SB.duaSudut(SBG)],
    k: [() => SB.k62(SBG)]
  },
  '6.3': {
    m: [() => SB.tjSudut(SBG), () => SB.tjPanjang(SBG), () => SB.duaTangen(SBG), () => SB.temberengSS(SBG), () => SB.bs(SBG, SBBS3)],
    s: [() => SB.tjKite(SBG), () => SB.ssTiga(SBG), () => SB.tjDua(SBG)],
    k: [() => SB.k63(SBG)]
  },
  '6.4': {
    m: [() => SB.gTanDia(SBG), () => SB.gTanJej(SBG), () => SB.gTanIsos(SBG), () => SB.gPusatKit(SBG)],
    s: [() => SB.gTanSS(SBG), () => SB.gKitTan(SBG), () => SB.gHarian(SBG)],
    k: [() => SB.k64(SBG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 6.1
WG.lilPusat = () => SB.lilPusat(SBW);
WG.pusatLil = () => SB.pusatLil(SBW);
WG.samaLengkok = () => SB.samaLengkok(SBW);
WG.semibul = () => SB.semibul(SBW);
WG.bs1 = i => SB.bs(SBW, SBBS1, [0, 1, 2, 5][i % 4] + (i >= 4 ? 3 : 0));
WG.samaKaki = () => SB.samaKaki(SBW);
WG.refleks = () => SB.refleks(SBW);
WG.gab61 = () => SB.gab61(SBW);
WG.k61 = () => SB.k61(SBW);
// 6.2
WG.bertentangan = () => SB.bertentangan(SBW);
WG.peluaran = () => SB.peluaran(SBW);
WG.kenalKitaran = i => SB.kenalKitaran(SBW, i % 2 === 0);
WG.bs2 = i => SB.bs(SBW, SBBS2, [0, 2, 1, 4][i % 4]);
WG.algebra62 = () => SB.algebra62(SBW);
WG.pusat62 = () => SB.pusat62(SBW);
WG.duaSudut = () => SB.duaSudut(SBW);
WG.k62 = () => SB.k62(SBW);
// 6.3
WG.tjSudut = () => SB.tjSudut(SBW);
WG.tjPanjang = i => SB.tjPanjang(SBW, i);
WG.duaTangen = () => SB.duaTangen(SBW);
WG.temberengSS = () => SB.temberengSS(SBW);
WG.sepunya = i => SB.sepunya(SBW, i);
WG.bs3 = i => SB.bs(SBW, SBBS3, [1, 4, 2, 6][i % 4]);
WG.tjKite = () => SB.tjKite(SBW);
WG.ssTiga = () => SB.ssTiga(SBW);
WG.tjDua = () => SB.tjDua(SBW);
WG.k63 = () => SB.k63(SBW);
// 6.4
WG.gTanDia = () => SB.gTanDia(SBW);
WG.gTanJej = () => SB.gTanJej(SBW);
WG.gTanIsos = () => SB.gTanIsos(SBW);
WG.gPusatKit = () => SB.gPusatKit(SBW);
WG.gTanSS = () => SB.gTanSS(SBW);
WG.gKitTan = () => SB.gKitTan(SBW);
WG.gHarian = () => SB.gHarian(SBW);
WG.k64 = () => SB.k64(SBW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '6.1': [['m', 'lilPusat', 5], ['m', 'pusatLil', 4], ['m', 'samaLengkok', 4], ['m', 'semibul', 3], ['m', 'bs1', 2], ['s', 'samaKaki', 3], ['s', 'refleks', 3], ['s', 'gab61', 3], ['k', 'k61', 3]],
  '6.2': [['m', 'bertentangan', 7], ['m', 'peluaran', 5], ['m', 'kenalKitaran', 4], ['m', 'bs2', 2], ['s', 'algebra62', 3], ['s', 'pusat62', 3], ['s', 'duaSudut', 3], ['k', 'k62', 3]],
  '6.3': [['m', 'tjSudut', 4], ['m', 'tjPanjang', 4], ['m', 'duaTangen', 4], ['m', 'temberengSS', 5], ['m', 'bs3', 1], ['s', 'tjKite', 3], ['s', 'ssTiga', 3], ['s', 'tjDua', 3], ['k', 'k63', 3]],
  '6.4': [['m', 'gTanDia', 5], ['m', 'gTanJej', 5], ['m', 'gTanIsos', 4], ['m', 'gPusatKit', 4], ['s', 'gTanSS', 3], ['s', 'gKitTan', 3], ['s', 'gHarian', 3], ['k', 'k64', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function sbOpts(ans, cands, f) {
  f = f || sbD;
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isFinite(c) || c <= 0 || c >= 360 || c !== Math.round(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 5; if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function sbOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const sbMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const CQGEN = {
  lilitan: [
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(20, 75); return sbMcq(`O is the centre. ∠${L[0]}${L[2]}${L[1]} = ${x}°. Find ∠${L[0]}O${L[1]}.`, sbF.pusat(L, x, `${x}°`, '?'), sbOpts(2 * x, [x, x / 2, 180 - x, 90 + x, 180 - 2 * x])); } const y = 2 * ri(20, 80); return sbMcq(`O is the centre. ∠${L[0]}O${L[1]} = ${y}°. Find ∠${L[0]}${L[2]}${L[1]}.`, sbF.pusat(L, y / 2, '?', `${y}°`), sbOpts(y / 2, [y, 2 * y, 180 - y, 180 - y / 2, 90 - y / 2])); },
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(20, 70); return sbMcq(`${L[0]}${L[1]} is the diameter. ∠${L[2]}${L[0]}${L[1]} = ${x}°. Find ∠${L[0]}${L[1]}${L[2]}.`, sbF.semi(L, x, `${x}°`, '?'), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x, 90])); } const L4 = pick(SBL4), x = ri(25, 75); return sbMcq(`∠${L4[0]}${L4[3]}${L4[1]} = ${x}°. Find ∠${L4[0]}${L4[2]}${L4[1]}.`, sbF.sama(L4, x, '?', `${x}°`, ri(50, 75), ri(105, 135)), sbOpts(x, [2 * x, 180 - x, 90 - x, x / 2])); },
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(15, 70); return sbMcq(`O is the centre. ∠O${L[0]}${L[1]} = ${x}°. Find ∠${L[0]}${L[2]}${L[1]}.`, sbF.samaKaki(L, x, `${x}°`, '?'), sbOpts(90 - x, [180 - 2 * x, x, 2 * x, 90 + x])); } const y = 2 * ri(35, 80); return sbMcq(`O is the centre. ∠${L[0]}O${L[1]} = ${y}°. Find ∠${L[0]}${L[2]}${L[1]}.`, sbF.refleks(L, y, `${y}°`, '?'), sbOpts(180 - y / 2, [y / 2, 360 - y, y, 180 - y])); }
  ],
  kitaran: [
    () => { const L = pick(SBL4), al = ri(62, 125), be = ri(62, 125); return sbMcq(`${L.join('')} is a cyclic quadrilateral. ∠${L[0]} = ${al}°. Find ∠${L[2]}.`, sbF.quad(L, al, be, ri(95, 140), [[L[0], L[3], L[1], `${al}°`, 'am'], [L[2], L[1], L[3], '?', 'tr']]), sbOpts(180 - al, [al, 360 - al, 90 - al / 2, 180 - be, be])); },
    () => { const L = pick(SBL4), x = ri(65, 120), be = ri(70, 110); return sbMcq(`${L[1]}${L[2]} is extended to E. ∠${L[3]}${L[0]}${L[1]} = ${x}°. Find ∠${L[3]}${L[2]}E.`, sbF.quad(L, x, be, ri(100, 135), [[L[0], L[1], L[3], `${x}°`, 'am'], [L[2], L[3], 'E', '?', 'tr']], { ext: [[L[1], L[2], 60, 'E']] }), sbOpts(x, [180 - x, be, 180 - be, 90])); },
    () => { const L = pick(SBL4), y = 2 * ri(40, 85); return sbMcq(`O is the centre. ∠${L[1]}O${L[3]} = ${y}°. Find ∠${L[1]}${L[2]}${L[3]}.`, sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[1], L[3], '?', 'tr']]), sbOpts(180 - y / 2, [y / 2, 180 - y, 360 - y, y])); }
  ],
  tangen: [
    () => { const x = ri(42, 70); return sbMcq(`PA is a tangent at A. ∠AOP = ${x}°. Find ∠APO.`, sbTanFig(x, { ang: [['O', 'A', 'P', `${x}°`, 'pa', false, 16, 32], ['P', 'A', 'O', '?', 'gr', false, 30, 46]], label: 'Tangent PA' }), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x])); },
    () => { if (Math.random() < .5) { const x = ri(30, 80); return sbMcq(`SAT is a tangent at A. ∠TAB = ${x}°. Find ∠ACB.`, sbF.ss(x, `${x}°`, '?'), sbOpts(x, [90 - x, 180 - x, 2 * x, 90 + x])); } const [a, b, c] = pick(SBTRI.slice(0, 7)); return sbMcq(`PA is a tangent at A. OA = ${a} cm, OP = ${c} cm. Find PA.`, sbTanFig(Math.acos(a / c) * 180 / Math.PI, { label: 'Tangent PA' }), sbOpts(b, [c - a, c + a, a, b + 1, c], v => `${v} cm`)); },
    () => { const x = ri(30, 100); return sbMcq(`PA and PB are tangents. ∠APB = ${x}°. Find ∠AOB.`, sbTanFig(90 - x / 2, { two: true, op: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['O', 'A', 'B', '?', 'pk']], label: 'Quadrilateral OAPB' }), sbOpts(180 - x, [x, 2 * x, 360 - x, 90 - x / 2])); }
  ],
  gabung: [
    () => { const x = ri(25, 70); return sbMcq(`PAQ is a tangent at A, AB is the diameter. ∠QAC = ${x}°. Find ∠BAC.`, sbF.tanDia(x, `${x}°`, '?'), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x])); },
    () => { if (Math.random() < .5) { const x = 2 * ri(15, 50); return sbMcq(`PA and PB are tangents. ∠APB = ${x}°. Find ∠PAB.`, sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['A', 'P', 'B', '?', 'pk']], label: 'Two tangents' }), sbOpts((180 - x) / 2, [180 - x, x, x / 2, 90 + x / 2])); } const x = ri(20, 65); return sbMcq(`O is the centre, SAT is a tangent at A. ∠OBA = ${x}°. Find ∠TAB.`, sbF.tanJej(x), sbOpts(90 - x, [x, 180 - 2 * x, 2 * x, 90 + x])); },
    () => { if (Math.random() < .5) { const x = 2 * ri(15, 50), h = (180 - x) / 2; return sbMcq(`PA and PB are tangents. ∠APB = ${x}°. Find ∠ACB.`, sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, C: 180, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['C', 'A', 'B', '?', 'tr']], label: 'Two tangents' }), sbOpts(h, [180 - x, x, x / 2, 180 - h])); } let x, y; do { x = ri(25, 60); y = ri(20, 50); } while (x + y > 110); return sbMcq(`SAT is a tangent at A, ABCD is cyclic. ∠TAB = ${x}°, ∠BDC = ${y}°. Find ∠ABC.`, sbF.kitTan(x, y), sbOpts(180 - x - y, [x + y, 180 - x, 180 - y, 90 - x])); }
  ]
};
const CQT = { lilitan: 'Angles at circumference & centre', kitaran: 'Cyclic quadrilateral', tangen: 'Tangents', gabung: 'Combining angles & tangents' };
function sbCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.lilitan;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['lilitan', 'lilitan', 'kitaran', 'tangen'] : Object.keys(CQT);
  return sbCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return sbCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui sbBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => sbBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => sbBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => sbBtO(c0(...a)); gq = (...a) => sbBtO(g0(...a)); }
