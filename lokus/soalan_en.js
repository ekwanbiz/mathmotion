'use strict';
/* ENGLISH (DLP): dijana daripada soalan.js oleh alat/en/soalan_lokus_en.py; jangan sunting dengan tangan. */
/* =================== LOKUS · SOALAN BAB 8 LOKUS DALAM DUA DIMENSI (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "lk" / "LK" supaya tidak bertembung dengan teras.

/* =================== pembantu =================== */
// rawak: lkRG untuk Latihan Kelas / games, lkRW (berbenih) untuk Lembaran Kerja
const lkRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const lkRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const lkShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const lkDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const lkN = x => { const v = Math.round(x * 1000) / 1000; return fmt(Object.is(v, -0) ? 0 : v); };
const lkIsInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const lkSq = (dx, dy) => dx * dx + dy * dy;
// jarak dalam bentuk punca: "5" jika kuasa dua sempurna, jika tidak rt(20) (garis atas penuh)
const lkRt = d2 => (lkIsInt(Math.sqrt(d2)) ? String(Math.round(Math.sqrt(d2))) : rt(d2));
const lkPyth = (dx, dy) => { dx = Math.abs(dx); dy = Math.abs(dy); if (!dx || !dy) return `${dx + dy}`; return `${rt(`${dx}² + ${dy}²`)} = ${rt(lkSq(dx, dy))}${lkIsInt(Math.sqrt(lkSq(dx, dy))) ? ' = ' + Math.sqrt(lkSq(dx, dy)) : ''}`; };
const LKHUR = ['P', 'Q', 'R', 'S', 'T', 'K', 'L', 'M', 'N', 'G', 'H', 'U', 'V', 'W'];
const LKCAND = ['A', 'B', 'C', 'D', 'E', 'F'];

/* =================== rajah grid (var(--…)) =================== */
let LKID = 0;
// o = { nx, ny, axes, u, polys:[{pts,c}], segs:[{a,b,c,w,dash}], inf:[{L:[A,B,C],c,w,dash}], circ:[{x,y,r,c,w,dash,fill}], pts:[{x,y,l,c,dx,dy,anchor,r}], texts:[{x,y,s,c,size,anchor}], label }
function lkFig(o) {
  const nx = o.nx || 10, ny = o.ny || 10, u = o.u || 34, pad = o.axes ? 34 : 18;
  const W = nx * u + pad * 2, H = ny * u + pad * 2;
  const X = x => +(pad + x * u).toFixed(1), Y = y => +(pad + (ny - y) * u).toFixed(1);
  const id = 'lkc' + (++LKID);
  let s = `<defs><clipPath id="${id}"><rect x="${X(0)}" y="${Y(ny)}" width="${nx * u}" height="${ny * u}"/></clipPath></defs>`;
  for (let x = 0; x <= nx; x++) s += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(ny)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  for (let y = 0; y <= ny; y++) s += `<line x1="${X(0)}" y1="${Y(y)}" x2="${X(nx)}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  if (o.axes) {
    s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(nx) + 12}" y2="${Y(0)}" style="stroke:var(--mu)" stroke-width="2.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(ny) - 12}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
    for (let x = 0; x <= nx; x += 2) s += `<text x="${X(x)}" y="${Y(0) + 20}" style="fill:var(--mu)" font-size="14" font-weight="600" text-anchor="middle">${x}</text>`;
    for (let y = 2; y <= ny; y += 2) s += `<text x="${X(0) - 8}" y="${Y(y) + 5}" style="fill:var(--mu)" font-size="14" font-weight="600" text-anchor="end">${y}</text>`;
    s += `<text x="${X(nx) + 14}" y="${Y(0) - 8}" style="fill:var(--mu)" font-size="15" font-style="italic" font-weight="700">x</text><text x="${X(0) + 8}" y="${Y(ny) - 10}" style="fill:var(--mu)" font-size="15" font-style="italic" font-weight="700">y</text>`;
  }
  let clip = '';
  (o.polys || []).forEach(p => { clip += `<polygon points="${p.pts.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" style="fill:var(--${p.c});fill-opacity:.12;stroke:var(--${p.c})" stroke-width="3" stroke-linejoin="round"/>`; });
  (o.circ || []).forEach(c => { clip += `<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${+(c.r * u).toFixed(1)}" style="fill:${c.fill ? `var(--${c.c})` : 'none'};fill-opacity:.1;stroke:var(--${c.c})" stroke-width="${c.w || 3.5}"${c.dash ? ' stroke-dasharray="9 6"' : ''}/>`; });
  (o.inf || []).forEach(l => {
    const [A, B, C] = l.L, M = 2 * Math.max(nx, ny); let p, q;
    if (Math.abs(B) > 1e-9) { p = [-M, (C + A * M) / B]; q = [nx + M, (C - A * (nx + M)) / B]; } else { p = [C / A, -M]; q = [C / A, ny + M]; }
    clip += `<line x1="${X(p[0])}" y1="${Y(p[1])}" x2="${X(q[0])}" y2="${Y(q[1])}" style="stroke:var(--${l.c})" stroke-width="${l.w || 3.5}"${l.dash ? ' stroke-dasharray="9 6"' : ''}/>`;
  });
  s += `<g clip-path="url(#${id})">${clip}</g>`;
  (o.segs || []).forEach(l => { s += `<line x1="${X(l.a[0])}" y1="${Y(l.a[1])}" x2="${X(l.b[0])}" y2="${Y(l.b[1])}" style="stroke:var(--${l.c})" stroke-width="${l.w || 4}" stroke-linecap="round"${l.dash ? ' stroke-dasharray="9 6"' : ''}/>`; });
  (o.texts || []).forEach(t => { s += `<text x="${X(t.x)}" y="${Y(t.y)}" style="fill:var(--${t.c || 'tx'})" font-size="${t.size || 16}" font-weight="700" text-anchor="${t.anchor || 'middle'}" dominant-baseline="central" font-family="Space Grotesk, sans-serif">${t.s}</text>`; });
  (o.pts || []).forEach(p => {
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r || 6}" style="fill:var(--${p.c || 'tx'})"/>`;
    if (p.ring) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="12" style="fill:none;stroke:var(--${p.c || 'tx'})" stroke-width="2.5"/>`;
    if (p.l) {
      const right = p.x > nx - 1.2, top = p.y > ny - .8;
      const dx = p.dx ?? (right ? -11 : 11), dy = p.dy ?? (top ? 20 : -11), an = p.anchor || (dx < 0 ? 'end' : 'start');
      s += `<text x="${X(p.x) + dx}" y="${Y(p.y) + dy}" style="fill:var(--${p.c || 'tx'})" font-family="Space Grotesk, sans-serif" font-size="18" font-weight="700" text-anchor="${an}">${p.l}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Locus diagram')}" font-family="Inter, sans-serif">${s}</svg>`;
}
const lkMerge = (...os) => { const r = {}; os.forEach(o => Object.keys(o || {}).forEach(k => { if (Array.isArray(o[k])) r[k] = (r[k] || []).concat(o[k]); else r[k] = o[k]; })); return r; };

/* =================== 8.1 data: situasi harian =================== */
// [situasi, titik, kategori, huraian lokus, sebab]
const LKCAT = { bul: 'Circle', lengkok: 'Arc of a circle', suku: 'Quarter circle', lurus: 'Straight line' };
const LKHARI = [
  ['the minute hand of a wall clock rotates one full turn', 'the tip of the minute hand', 'bul', 'A circle centred at the centre of the clock', 'The tip of the hand is always at the same distance (the length of the hand) from the centre of the clock and rotates one full turn.'],
  ['a swing swings forward and backward', 'the seat of the swing', 'lengkok', 'An arc of a circle centred at the bar of the swing', 'The seat is always at the same distance (the length of the chain) from the bar but does not rotate one full turn.'],
  ['a door is opened from the closed position to 90° (viewed from above)', 'the edge of the door', 'suku', 'A quarter circle centred at the hinge of the door', 'The edge of the door is always at the same distance (the width of the door) from the hinge and rotates 90°.'],
  ['a lift moves from the ground floor to the top floor', 'the floor of the lift', 'lurus', 'A vertical straight line', 'The lift moves vertically upwards without turning.'],
  ['a ceiling fan rotates', 'the tip of a fan blade', 'bul', 'A circle centred at the axis of the fan', 'The tip of the blade is always at the same distance (the length of the blade) from the axis of the fan and rotates fully.'],
  ['a runner runs in a straight 100 m lane', 'the runner', 'lurus', 'A straight line along the lane', 'The runner moves along the straight lane.'],
  ['a Ferris wheel rotates one full turn', 'a cabin of the Ferris wheel', 'bul', 'A circle centred at the axis of the Ferris wheel', 'The cabin is always at the same distance from the axis of the wheel and rotates one full turn.'],
  ['a ball is dropped vertically from the roof of a building', 'the ball', 'lurus', 'A vertical straight line', 'The ball falls vertically downwards.'],
  ['a bicycle moves on a straight flat road', 'the centre of the bicycle wheel', 'lurus', 'A straight line parallel to the road', 'The centre of the wheel is always at the same height (the radius of the wheel) from the road.'],
  ['a goat tied to a pole walks with its rope always taut', 'the goat', 'bul', 'A circle centred at the pole', 'The goat is always at the same distance (the length of the rope) from the pole.'],
  ['the pendulum of a grandfather clock swings', 'the tip of the pendulum', 'lengkok', 'An arc of a circle centred at the point where the pendulum hangs', 'The tip of the pendulum is always at the same distance from the point where it hangs but only swings through part of a circle.'],
  ['the barrier at the entrance of a car park is raised from horizontal to vertical', 'the tip of the barrier', 'suku', 'A quarter circle centred at the base of the barrier', 'The tip of the barrier rotates 90° about its base at a constant distance.'],
  ['the windscreen wiper of a car moves left and right', 'the tip of the wiper', 'lengkok', 'An arc of a circle centred at the base of the wiper', 'The tip of the wiper is always at the same distance from its base but does not rotate fully.'],
  ['a train moves on a straight track', 'the front of the train', 'lurus', 'A straight line along the track', 'The train moves along the straight track.']
];
const LKBS1 = [
  ['A locus is a trace or path of a set of points that satisfies certain conditions.', true, 'This is the meaning of a locus.'],
  ['A locus consists of only one point.', false, 'A locus is the set of all points that satisfy the conditions, usually many points.'],
  ['The locus of the tip of a clock hand that rotates one full turn is a circle.', true, 'The tip of the hand is always at the same distance from the centre of the clock.'],
  ['The locus of the edge of a door opened 90° is a full circle.', false, 'The door only rotates 90°, so its locus is a quarter circle.'],
  ['The locus of a lift moving up is a vertical straight line.', true, 'The lift moves vertically upwards.'],
  ['The locus of the hinge of a door when the door is opened is an arc of a circle.', false, 'The hinge does not move; it is the centre of rotation of the door.'],
  ['The locus of the centre of a wheel rolling on a flat road is a straight line parallel to the road.', true, 'The centre of the wheel is always one radius away from the road.'],
  ['The locus of the seat of a swinging swing is a straight line.', false, 'The seat is at a constant distance from the bar, so its locus is an arc of a circle.'],
  ['A locus in two dimensions lies on a plane.', true, 'A 2D locus is drawn on a plane, for example on paper.']
];

/* =================== 8.2 data: lima lokus =================== */
const LKJN = { C: 'Circle', B: 'Perpendicular bisector', D: 'A pair of parallel lines', M: 'Parallel line in the middle', A: 'Angle bisector' };
const LKJK = ['C', 'B', 'D', 'M', 'A'];
const LKBS2 = [
  ['The locus of points at a constant distance from a fixed point is a circle.', true, 'All the points are at the same distance (the radius) from the centre.'],
  ['The locus of points equidistant from two fixed points P and Q is the straight line PQ.', false, 'The locus is the perpendicular bisector of PQ, not the line PQ.'],
  ['The perpendicular bisector of PQ passes through the midpoint of PQ and is perpendicular to PQ.', true, 'That is the meaning of a perpendicular bisector.'],
  ['The locus of points 3 cm from a straight line AB is only one straight line.', false, 'The locus is a pair of parallel lines, one on each side of AB.'],
  ['The locus of points equidistant from two parallel lines is a parallel straight line in the middle of the two lines.', true, 'The middle line is equidistant from both lines.'],
  ['The locus of points equidistant from two intersecting lines is the angle bisector of the lines.', true, 'Every point on the angle bisector is equidistant from both lines.'],
  ['A point that satisfies two conditions is a point of intersection of two loci.', true, 'The point must lie on both loci.'],
  ['Two loci always intersect at exactly one point.', false, 'Two loci can intersect at 0, 1, 2 or more points.'],
  ['When constructing a perpendicular bisector, the opening of the compasses must be less than half the length of PQ.', false, 'The opening of the compasses must be more than half the length of PQ so that the arcs intersect.'],
  ['An angle bisector divides an angle into two equal angles.', true, 'The original angle is bisected.']
];

/* =================== enjin lokus: primitif & persilangan =================== */
// primitif: { t:'L', L:[A,B,C] } untuk Ax + By = C ; { t:'C', x, y, r }
function lkMeet(p, q) {
  const E = 1e-9;
  if (p.t === 'C' && q.t === 'L') return lkMeet(q, p);
  if (p.t === 'L' && q.t === 'L') {
    const [a1, b1, c1] = p.L, [a2, b2, c2] = q.L, det = a1 * b2 - a2 * b1;
    if (Math.abs(det) < E) { const k = Math.abs(a1) > E ? a2 / a1 : b2 / b1; return Math.abs(c2 - k * c1) < E ? null : []; }
    return [[(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det]];
  }
  if (p.t === 'L') {
    const [a, b, c] = p.L, n = Math.hypot(a, b), d = (a * q.x + b * q.y - c) / n;
    if (Math.abs(d) > q.r + E) return [];
    const fx = q.x - a * d / n, fy = q.y - b * d / n, h2 = q.r * q.r - d * d;
    if (h2 < E) return [[fx, fy]];
    const h = Math.sqrt(h2), ux = -b / n, uy = a / n;
    return [[fx + ux * h, fy + uy * h], [fx - ux * h, fy - uy * h]];
  }
  const dx = q.x - p.x, dy = q.y - p.y, D = Math.hypot(dx, dy);
  if (D < E) return Math.abs(p.r - q.r) < E ? null : [];
  if (D > p.r + q.r + E || D < Math.abs(p.r - q.r) - E) return [];
  const a = (p.r * p.r - q.r * q.r + D * D) / (2 * D), h2 = p.r * p.r - a * a, mx = p.x + a * dx / D, my = p.y + a * dy / D;
  if (h2 < E) return [[mx, my]];
  const h = Math.sqrt(h2);
  return [[mx - h * dy / D, my + h * dx / D], [mx + h * dy / D, my - h * dx / D]];
}
// persilangan dua set primitif dalam rantau [0,n]x[0,m]; null = tak terhingga
function lkMeetAll(A, B, n, m) {
  let out = [];
  for (const p of A) for (const q of B) { const r = lkMeet(p, q); if (r === null) return null; out = out.concat(r); }
  const E = 1e-7, uniq = [];
  out.forEach(([x, y]) => {
    if (x < -E || y < -E || x > n + E || y > m + E) return;
    if (!uniq.some(u => Math.abs(u[0] - x) < 1e-6 && Math.abs(u[1] - y) < 1e-6)) uniq.push([x, y]);
  });
  return uniq.map(([x, y]) => [lkIsInt(x) ? Math.round(x) : x, lkIsInt(y) ? Math.round(y) : y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
const lkPtsTxt = a => lkDan(a.map(([x, y]) => P(x, y)));

/* ---------- syarat pada satah Cartes 0..10 (untuk persilangan) ---------- */
// nm() memberi huruf seterusnya. Pulangkan { ty, s (klausa), lok, prims, given, loc, chk(x,y) }
function lkCond(r, ty, nm) {
  const N = 10, line = (a, b, c, w) => ({ a, b, c, w: w || 4 });
  if (ty === 'C') {
    const x = r.i(2, 8), y = r.i(2, 8), rad = r.p([2, 3, 4, 5]), T = nm();
    return { ty, s: `is always ${rad} units from point ${T}${P(x, y)}`, lok: `a circle centred at ${T} with a radius of ${rad} units`,
      prims: [{ t: 'C', x, y, r: rad }], given: { pts: [{ x, y, l: T, c: 'tr' }] }, loc: { circ: [{ x, y, r: rad, c: 'pk', dash: true }] },
      chk: (a, b) => `distance from ${T} = ${lkPyth(a - x, b - y)}`, pts: [[x, y]] };
  }
  if (ty === 'B') {
    const o = r.p(['h', 'v', 's']), Q = nm(), R = nm(); let q, w, L;
    if (o === 's') { let a, b; do { a = r.i(0, 10); b = r.i(0, 10); } while (Math.abs(a - b) < 2); q = [a, b]; w = [b, a]; L = [1, -1, 0]; }
    else { const c = r.i(1, 9), x1 = r.i(0, 6), k = r.i(1, Math.floor((N - x1) / 2)), x2 = x1 + 2 * k; q = o === 'h' ? [x1, c] : [c, x1]; w = o === 'h' ? [x2, c] : [c, x2]; L = o === 'h' ? [1, 0, x1 + k] : [0, 1, x1 + k]; }
    return { ty, s: `is always equidistant from point ${Q}${P(...q)} and point ${R}${P(...w)}`, lok: `the perpendicular bisector of the line ${Q}${R}`,
      prims: [{ t: 'L', L }], given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }] }, loc: { inf: [{ L, c: 'pk', dash: true }] },
      chk: (a, b) => `distance to ${Q} = distance to ${R} = ${lkRt(lkSq(a - q[0], b - q[1]))}`, pts: [q, w] };
  }
  if (ty === 'D') {
    const o = r.p(['h', 'v']), K = nm(), L2 = nm(); let c, d;
    do { c = r.i(1, 9); d = r.i(1, 4); } while (c - d < 0 && c + d > N);
    const ks = [c - d, c + d].filter(v => v >= 0 && v <= N), h = o === 'h';
    const prims = ks.map(v => ({ t: 'L', L: h ? [0, 1, v] : [1, 0, v] }));
    const ep = h ? [[0, c], [N, c]] : [[c, 0], [c, N]];
    return { ty, s: `is always ${d} units from the straight line ${K}${L2}`, lok: `a pair of straight lines parallel to ${K}${L2} and ${d} units from ${K}${L2}`,
      prims, given: { segs: [line(ep[0], ep[1], 'tr')], pts: [{ x: ep[0][0], y: ep[0][1], l: K, c: 'tr', r: 5 }, { x: ep[1][0], y: ep[1][1], l: L2, c: 'tr', r: 5 }] },
      loc: { inf: prims.map(p => ({ L: p.L, c: 'pk', dash: true })) }, chk: (a, b) => `distance from ${K}${L2} = ${Math.abs((h ? b : a) - c)}`, pts: ep, lines: [h ? [0, 1, c] : [1, 0, c]] };
  }
  if (ty === 'M') {
    const o = r.p(['h', 'v']), E1 = nm(), F1 = nm(), G1 = nm(), H1 = nm(), c1 = r.i(1, 6), g = 2 * r.i(1, Math.floor((9 - c1) / 2)), c2 = c1 + g, md = c1 + g / 2, h = o === 'h';
    const ep = v => (h ? [[0, v], [N, v]] : [[v, 0], [v, N]]), e1 = ep(c1), e2 = ep(c2), L = h ? [0, 1, md] : [1, 0, md];
    return { ty, s: `is always equidistant from the straight lines ${E1}${F1} and ${G1}${H1}`, lok: `the straight line parallel to ${E1}${F1} and ${G1}${H1} in the middle of the two lines`,
      prims: [{ t: 'L', L }], given: { segs: [line(e1[0], e1[1], 'tr'), line(e2[0], e2[1], 'tr')], pts: [{ x: e1[0][0], y: e1[0][1], l: E1, c: 'tr', r: 5 }, { x: e1[1][0], y: e1[1][1], l: F1, c: 'tr', r: 5 }, { x: e2[0][0], y: e2[0][1], l: G1, c: 'tr', r: 5 }, { x: e2[1][0], y: e2[1][1], l: H1, c: 'tr', r: 5 }] },
      loc: { inf: [{ L, c: 'pk', dash: true }] }, chk: () => `distance from ${E1}${F1} = distance from ${G1}${H1} = ${g / 2}`, pts: e1.concat(e2), lines: [h ? [0, 1, c1] : [1, 0, c1], h ? [0, 1, c2] : [1, 0, c2]] };
  }
  // A: sama jarak dari dua garis bersilang
  if (r.f() < .45) return { ty, s: 'is always equidistant from the x-axis and the y-axis', lok: 'the angle bisector between the x-axis and the y-axis',
    prims: [{ t: 'L', L: [1, -1, 0] }], given: {}, loc: { inf: [{ L: [1, -1, 0], c: 'pk', dash: true }] }, chk: (a, b) => `distance from the x-axis = distance from the y-axis = ${b}`, pts: [], lines: [[0, 1, 0], [1, 0, 0]] };
  const a = r.i(2, 8), b = r.i(2, 8), S1 = nm(), T1 = nm(), U1 = nm(), V1 = nm(), Ls = [[1, -1, a - b], [1, 1, a + b]];
  return { ty, s: `is always equidistant from the straight lines ${S1}${T1} and ${U1}${V1}`, lok: `a pair of angle bisectors between ${S1}${T1} and ${U1}${V1}`,
    prims: Ls.map(L => ({ t: 'L', L })), given: { segs: [line([0, b], [N, b], 'tr'), line([a, 0], [a, N], 'tr')], pts: [{ x: 0, y: b, l: S1, c: 'tr', r: 5 }, { x: N, y: b, l: T1, c: 'tr', r: 5 }, { x: a, y: 0, l: U1, c: 'tr', r: 5, dy: -10 }, { x: a, y: N, l: V1, c: 'tr', r: 5 }] },
    loc: { inf: Ls.map(L => ({ L, c: 'pk', dash: true })) }, chk: (x, y) => `distance from ${S1}${T1} = distance from ${U1}${V1} = ${Math.abs(y - b)}`, pts: [[0, b], [N, b], [a, 0], [a, N]], lines: [[0, 1, b], [1, 0, a]] };
}
// dua syarat berbeza yang bersilang pada 1–4 titik integer dalam grid
function lkPair(r, opt) {
  opt = opt || {};
  for (let t = 0; t < 600; t++) {
    const pool = lkShuf(r, LKHUR), nm = () => pool.shift();
    const [t1, t2] = opt.types || lkShuf(r, LKJK).slice(0, 2);
    if (t1 === t2) continue;
    const a = lkCond(r, t1, nm), b = lkCond(r, t2, nm);
    // objek diberi tidak bertindih
    const gp = a.pts.concat(b.pts), key = gp.map(p => p.join(','));
    if (new Set(key).size !== key.length) continue;
    const X = lkMeetAll(a.prims, b.prims, 10, 10);
    if (!X || !X.length || X.length > (opt.max || 4) || X.length < (opt.min || 1)) continue;
    if (!opt.any && !X.every(p => Number.isInteger(p[0]) && Number.isInteger(p[1]))) continue;
    // titik persilangan bukan objek diberi
    if (X.some(p => key.includes(p.join(',')) || (Math.abs(p[0]) < 1e-9 && Math.abs(p[1]) < 1e-9))) continue;
    return { a, b, X };
  }
  // sandaran: X sama jarak dari Q(1, 5) dan R(7, 5); X berjarak 5 unit dari P(1, 1)
  const a = { ty: 'B', s: 'is always equidistant from point Q(1, 5) and point R(7, 5)', lok: 'the perpendicular bisector of the line QR', prims: [{ t: 'L', L: [1, 0, 4] }], given: { pts: [{ x: 1, y: 5, l: 'Q', c: 'tr' }, { x: 7, y: 5, l: 'R', c: 'tr' }] }, loc: { inf: [{ L: [1, 0, 4], c: 'pk', dash: true }] }, chk: (x, y) => `distance to Q = distance to R = ${lkRt(lkSq(x - 1, y - 5))}`, pts: [[1, 5], [7, 5]] };
  const b = { ty: 'C', s: 'is always 5 units from point P(1, 1)', lok: 'a circle centred at P with a radius of 5 units', prims: [{ t: 'C', x: 1, y: 1, r: 5 }], given: { pts: [{ x: 1, y: 1, l: 'P', c: 'tr' }] }, loc: { circ: [{ x: 1, y: 1, r: 5, c: 'pk', dash: true }] }, chk: (x, y) => `distance from P = ${lkPyth(x - 1, y - 1)}`, pts: [[1, 1]] };
  return { a, b, X: [[4, 5]] };
}
function lkPairFig(pr, ans) {
  const lc = o => Object.assign({}, o, { circ: (o.circ || []).map(c => Object.assign({}, c, { c: 'pu' })), inf: (o.inf || []).map(l => Object.assign({}, l, { c: 'pu' })) });
  const base = lkMerge({ nx: 10, ny: 10, axes: true, u: 30, label: 'Cartesian plane with the fixed objects for two locus conditions' }, pr.a.given, pr.b.given);
  if (!ans) return lkFig(base);
  return lkFig(lkMerge(pr.a.loc, lc(pr.b.loc), base, { pts: pr.X.map(([x, y]) => ({ x, y, c: 'gr', ring: true, l: Number.isInteger(x) && Number.isInteger(y) ? P(x, y) : '' })) }));
}

/* ---------- bentuk lokus pada grid 10 × 8 tanpa paksi (8.2 Mudah) ---------- */
function lkShape(r, ty, u) {
  u = u || 'units';
  const nm = lkShuf(r, LKHUR), seg = (a, b) => ({ a, b, c: 'tr', w: 4 });
  if (ty === 'C') {
    const x = r.i(3, 7), y = r.i(3, 5), rad = r.p([2, 3]), T = nm[0];
    return { ty, s: `is always ${rad} ${u} from point ${T}`, lok: `A circle centred at ${T} with a radius of ${rad} ${u}`,
      given: { pts: [{ x, y, l: T, c: 'tr' }] }, loc: { circ: [{ x, y, r: rad, c: 'pk', dash: true }] }, key: `C${x}${y}${rad}` };
  }
  if (ty === 'B') {
    const o = r.p(['h', 'v', 's']), Q = nm[0], R = nm[1]; let q, w, L;
    if (o === 'h') { const y = r.i(2, 6), x1 = r.i(1, 3), k = r.i(2, 3); q = [x1, y]; w = [x1 + 2 * k, y]; L = [1, 0, x1 + k]; }
    else if (o === 'v') { const x = r.i(2, 8), y1 = r.i(1, 2), k = r.i(2, 3); q = [x, y1]; w = [x, y1 + 2 * k]; L = [0, 1, y1 + k]; }
    else { const a = r.i(1, 3), b = a + 2 * r.i(2, 3); q = [a, b]; w = [b, a]; L = [1, -1, 0]; }
    return { ty, s: `is always equidistant from point ${Q} and point ${R}`, lok: `The perpendicular bisector of the line ${Q}${R}`,
      given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }], segs: [{ a: q, b: w, c: 'mu', w: 2, dash: true }] }, loc: { inf: [{ L, c: 'pk', dash: true }] }, key: `B${q}${w}` };
  }
  if (ty === 'D') {
    const h = r.f() < .6, K = nm[0], L2 = nm[1], d = r.p([2, 3]);
    const c = h ? r.i(3, 5) : r.i(3, 7), ep = h ? [[1, c], [9, c]] : [[c, 1], [c, 7]];
    const ls = [c - d, c + d].filter(v => v >= 0 && v <= (h ? 8 : 10));
    return { ty, s: `is always ${d} ${u} from the straight line ${K}${L2}`, lok: `A pair of straight lines parallel to ${K}${L2} and ${d} ${u} from ${K}${L2}`,
      given: { segs: [seg(ep[0], ep[1])], pts: [{ x: ep[0][0], y: ep[0][1], l: K, c: 'tr', r: 5 }, { x: ep[1][0], y: ep[1][1], l: L2, c: 'tr', r: 5 }] },
      loc: { inf: ls.map(v => ({ L: h ? [0, 1, v] : [1, 0, v], c: 'pk', dash: true })) }, key: `D${h}${c}${d}` };
  }
  if (ty === 'M') {
    const h = r.f() < .6, [E1, F1, G1, H1] = nm, g = r.p([4, 6]), c1 = h ? r.i(1, 7 - g) : r.i(1, 9 - g), md = c1 + g / 2;
    const ep = v => (h ? [[0, v], [10, v]] : [[v, 0], [v, 8]]), e1 = ep(c1), e2 = ep(c1 + g);
    return { ty, s: `is always equidistant from two parallel lines ${E1}${F1} and ${G1}${H1}`, lok: `A straight line parallel to ${E1}${F1} and ${G1}${H1}, in the middle of the two lines (${g / 2} ${u} from each line)`,
      given: { segs: [seg(e1[0], e1[1]), seg(e2[0], e2[1])], texts: [{ x: e1[0][0] + (h ? .6 : .5), y: e1[0][1] + (h ? .45 : .5), s: E1 + F1, c: 'tr', size: 16, anchor: 'start' }, { x: e2[0][0] + (h ? .6 : .5), y: e2[0][1] + (h ? .45 : .5), s: G1 + H1, c: 'tr', size: 16, anchor: 'start' }] },
      loc: { inf: [{ L: h ? [0, 1, md] : [1, 0, md], c: 'pk', dash: true }] }, key: `M${h}${c1}${g}`, names: [E1 + F1, G1 + H1] };
  }
  const O = nm[0], A1 = nm[1], B1 = nm[2];
  if (r.f() < .5) {
    const ox = r.i(1, 2), oy = 1, a = [9, oy], b = [ox, 7];
    return { ty, s: `is always equidistant from the straight lines ${O}${A1} and ${O}${B1}`, lok: `The angle bisector of ${A1}${O}${B1}`,
      given: { segs: [seg([ox, oy], a), seg([ox, oy], b)], pts: [{ x: ox, y: oy, l: O, c: 'tr', dx: -8, dy: 20, anchor: 'end' }, { x: a[0], y: a[1], l: A1, c: 'tr', r: 5 }, { x: b[0], y: b[1], l: B1, c: 'tr', r: 5 }] },
      loc: { segs: [{ a: [ox, oy], b: [ox + 6, oy + 6], c: 'pk', w: 3.5, dash: true }] }, key: `A${ox}` };
  }
  const x = r.i(4, 6), y = 4;
  return { ty, s: `is always equidistant from two straight lines ${A1}${O} and ${B1}${O} intersecting at ${O}`, lok: `A pair of angle bisectors of the angles formed by the lines ${A1}${O} and ${B1}${O}`,
    given: { segs: [seg([0, y], [10, y]), seg([x, 0], [x, 8])], pts: [{ x, y, l: O, c: 'tr', dx: 10, dy: 22 }, { x: 0, y, l: A1, c: 'tr', r: 5, dx: 6, dy: -10, anchor: 'start' }, { x, y: 8, l: B1, c: 'tr', r: 5, dx: 10, dy: 18 }] },
    loc: { inf: [{ L: [1, -1, x - y], c: 'pk', dash: true }, { L: [1, 1, x + y], c: 'pk', dash: true }] }, key: `X${x}` };
}
const lkShapeFig = (sh, ans, label) => lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: label || 'Diagram on a square grid' }, ans ? sh.loc : {}, sh.given));

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 8.1 Lokus ---------- */
  harian: [
    ({ sit, tt }) => ({ q: `Describe the locus of ${tt} when ${sit}.` }),
    ({ sit, tt }) => ({ q: `What is the shape of the locus of ${tt} when ${sit}?` }),
    ({ sit, tt }) => { const N = vnama(); return { q: `${N} observes that ${sit}. State the locus of ${tt}.` }; },
    ({ sit, tt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} says the locus of ${tt} when ${sit} is ${wrong.toLowerCase()}. Is ${N} correct?` }, salah(N, ans, `The locus of ${tt} is not ${wrong.toLowerCase()}.`)); },
    ({ sit, tt }) => ({ q: `Complete: When ${sit}, the locus of ${tt} is ___.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `State whether the following statement is true or false: "${s}"`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => ({ q: `True or false? ${s}`, ans: ok ? 'True' : 'False' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} says, "${s}" Is ${N} correct?`, ans: ok ? `Yes, ${N} is correct` : `No, ${N} is not correct` }; }
  ],
  titik: [
    ({ s }) => ({ q: `The diagram below is drawn on a grid of squares with sides of 1 unit. Point X moves such that X ${s}. Among points A to F, which lie on the locus of X?` }),
    ({ s }) => ({ q: `Point X ${s}. Based on the diagram below (1-unit grid), list all the labelled points A to F that satisfy the condition.` }),
    ({ s }) => ({ q: `An ant X crawls on the grid such that it ${s}. Which labelled points in the diagram below can the ant pass through?` }),
    ({ s, n }) => ({ q: `In the diagram below, there are ${n} labelled points on the locus of point X which ${s}. Name the points. (Grid with sides of 1 unit.)` })
  ],
  ferris: [
    ({ D, h0 }) => ({ q: `A Ferris wheel has a diameter of ${D} m. The lowest point of its cabin is ${h0} m from the ground. Describe the locus of a cabin when the wheel rotates one full turn, and state the maximum height of the cabin from the ground.` }),
    ({ D, h0 }) => ({ q: `A cabin of a Ferris wheel moves on a circular locus with a diameter of ${D} m. If the lowest position of the cabin is ${h0} m from the ground, what is the height of the centre of the wheel and the maximum height of the cabin?`, ans: `Centre: ${h0 + D / 2} m, maximum: ${h0 + D} m` }),
    ({ D, h0 }) => ({ q: `The centre of a Ferris wheel is ${h0 + D / 2} m from the ground and its radius is ${D / 2} m. State the lowest and the highest heights of the locus of a cabin.`, ans: `Lowest: ${h0} m, highest: ${h0 + D} m` })
  ],
  tambat: [
    ({ L }) => ({ q: `A goat is tied to pole T with a rope ${L} m long in a flat field. Describe the locus of the goat when its rope is always taut, and find the greatest distance between two positions of the goat.` }),
    ({ L }) => ({ q: `A cow is tied to a tree with a ${L} m rope. The cow walks around the tree with the rope always taut. What is its locus and what is the diameter of the locus?` }),
    ({ L }) => { const N = vnama(); return Object.assign({ q: `A goat is tied to a pole with a ${L} m rope and walks with the rope always taut. ${N} says its locus is a circle with a radius of ${2 * L} m. Is ${N} correct?` }, salah(N, `a circle with a radius of ${L} m`, `The radius of the locus is the length of the rope, that is ${L} m. ${2 * L} m is the diameter.`)); }
  ],
  roda: [
    ({ D }) => ({ q: `A wheel with a diameter of ${D} cm rolls on a straight flat road. Describe the locus of the centre of the wheel.` }),
    ({ D }) => ({ q: `A bicycle tyre with a diameter of ${D} cm rolls on a straight flat road. At what height from the road is the locus of the centre of the tyre? Describe the locus.` }),
    ({ D }) => ({ q: `Complete: The locus of the centre of a wheel with a diameter of ${D} cm rolling on a flat road is a straight line parallel to the road and ___ cm from the road.`, ans: `${D / 2} cm` })
  ],
  k81: [
    ({ w }) => ({ q: `A door ${w} cm wide is opened from the closed position to 90°. (a) Describe the locus of the edge of the door (viewed from above). (b) Calculate the length of the locus. (Use π = ${fr(22, 7)})`, ans: `(a) A quarter circle centred at the hinge, radius ${w} cm (b) ${w * 11 / 7} cm`, work: ['(a) The edge of the door is always at the same distance (the width of the door) from the hinge and rotates 90°.', `(b) Length = ${fr(1, 4)} × 2 × ${fr(22, 7)} × ${w}`, `= ${w * 11 / 7} cm`] }),
    ({ L }) => ({ q: `A goat is tied with a ${L} m rope at a corner of a fenced rectangular field. The goat is inside the field. (a) Describe the locus of the goat when the rope is always taut. (b) Calculate the length of the locus. (Use π = ${fr(22, 7)})`, ans: `(a) A quarter circle centred at the corner, radius ${L} m (b) ${L * 11 / 7} m`, work: ['(a) The fence forms a right angle (90°) at the corner, so the goat can only move in a quarter circle.', `(b) Arc length = ${fr(1, 4)} × 2 × ${fr(22, 7)} × ${L}`, `= ${L * 11 / 7} m`] }),
    ({ rr, n }) => ({ q: `A wheel with a radius of ${rr} cm rolls on a straight road for ${n} complete turns. (a) Describe the locus of the centre of the wheel. (b) Calculate the length of the locus of the centre of the wheel in metres. (Use π = ${fr(22, 7)})`, ans: `(a) A straight line parallel to the road, ${rr} cm from the road (b) ${lkN(n * 44 * rr / 7 / 100)} m`, work: ['(a) The centre of the wheel is always one radius away from the road.', `(b) Circumference = 2 × ${fr(22, 7)} × ${rr} = ${44 * rr / 7} cm`, `Length of locus = ${n} × ${44 * rr / 7} = ${n * 44 * rr / 7} cm = ${lkN(n * 44 * rr / 7 / 100)} m`] }),
    ({ D, h0 }) => ({ q: `A Ferris wheel has a diameter of ${D} m. The lowest cabin is ${h0} m from the ground. (a) Describe the locus of a cabin in one turn. (b) At what height is the cabin when it is at the same level as the centre of the wheel? (c) What is the distance travelled by the cabin in one turn? (Use π = ${fr(22, 7)})`, ans: `(a) A circle centred at the axis of the wheel, radius ${D / 2} m (b) ${h0 + D / 2} m (c) ${D * 22 / 7} m`, work: [`(a) Radius = ${D} ÷ 2 = ${D / 2} m`, `(b) Height of centre = ${h0} + ${D / 2} = ${h0 + D / 2} m`, `(c) Circumference = ${fr(22, 7)} × ${D} = ${D * 22 / 7} m`] })
  ],

  /* ---------- 8.2 Lokus dalam Dua Dimensi ---------- */
  jenis: [
    ({ s }) => ({ q: `Point X moves such that X ${s}. Describe the locus of X.` }),
    ({ s }) => ({ q: `Describe the locus of point X which ${s}.` }),
    ({ s }) => ({ q: `What is the locus of a point which ${s}?` }),
    ({ s, wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} says the locus of point X which ${s} is ${wrong}. Is ${N} correct?` }, salah(N, ans, why)); },
    ({ s }) => ({ q: `Complete: The locus of point X which ${s} is ___.` })
  ],
  rajah: [
    () => ({ q: 'The diagram below is drawn on a grid of squares with sides of 1 unit. The dashed line or curve is the locus of point X. State the condition of the movement of X.' }),
    () => ({ q: 'The locus of point X is shown by the dashed lines in the diagram below (1-unit grid). Describe the condition satisfied by X.' }),
    ({ jn, sy }) => ({ q: `The diagram below shows the locus of point X (dashed lines) on a grid with sides of 1 unit. (a) Name the type of the locus. (b) State the condition for X.`, ans: `(a) ${jn} (b) X ${sy}` })
  ],
  lukis: [
    ({ s }) => ({ q: `On the diagram in the answer space, draw the locus of point X which ${s}. (Grid with sides of 1 unit.)` }),
    ({ s }) => ({ q: `The diagram below is drawn on a grid of squares with sides of 1 unit. Construct the locus of point X which ${s}.` }),
    ({ s }) => ({ q: `Using the grid below (sides of 1 unit), draw and label the locus of X which ${s}.` })
  ],
  silang: [
    ({ s1, s2 }) => ({ q: `On the Cartesian plane below, X is a point moving in the grid such that X ${s1} and X ${s2}. State the coordinates of all the positions of X.` }),
    ({ s1, s2 }) => ({ q: `Point X moves in the grid below. Given X ${s1}, and X also ${s2}. Find the coordinates of point X that satisfies both conditions.` }),
    ({ s1, s2 }) => ({ q: `On the diagram below, draw the locus of points which ${s1} and the locus of points which ${s2}. Hence, state the coordinates of the points of intersection of both loci in the grid.` }),
    ({ s1, s2 }) => ({ q: `A toy drone X flies above the grid field below. The drone ${s1} and ${s2}. State the coordinates of all the positions of the drone.` })
  ],
  bilSilang: [
    ({ s1, s2 }) => ({ q: `Based on the diagram below, how many points in the grid ${s1} and ${s2}?` }),
    ({ s1, s2 }) => ({ q: `Point X ${s1} and ${s2}. By drawing both loci on the diagram below, determine how many positions of X there are in the grid.` }),
    ({ s1, s2, ans, wn }) => { const N = vnama(); return Object.assign({ q: `${N} says there are only ${wn} positions of point X which ${s1} and ${s2} in the grid below. Is ${N} correct?` }, salah(N, ans, 'Draw both loci completely and count all the points of intersection in the grid.')); }
  ],
  bina: [
    ({ what }) => ({ q: `Describe the steps to construct ${what} using only a pair of compasses and a ruler.` }),
    ({ what, lok }) => ({ q: `The locus of point X is ${lok}. Explain how to construct ${what} with a pair of compasses and a ruler.` }),
    ({ what }) => { const N = vnama(); return { q: `${N} needs to construct ${what}. List the correct steps for ${N}.` }; }
  ],
  k82: [
    ({ L }) => ({ q: `Two houses, R${P(L.x1, L.y)} and S${P(L.x2, L.y)}, are beside a straight road along the x-axis. A lamp post L must be installed so that it is equidistant from R and S, and ${L.d} units from the road (on the side of the houses). (a) Describe the locus of points equidistant from R and S. (b) Find the coordinates of L.`, ans: `(a) The perpendicular bisector of RS (a vertical line through ${P(L.m, 0)}) (b) L${P(L.m, L.d)}`, work: [`(a) Midpoint of RS = ${P(L.m, L.y)}; the perpendicular bisector is the vertical line through that point.`, `(b) The locus ${L.d} units from the road (x-axis): a horizontal line through ${P(0, L.d)}.`, `Intersection: L${P(L.m, L.d)}. Check: LR = LS = ${lkRt(lkSq(L.m - L.x1, L.d - L.y))} units.`] }),
    ({ H }) => ({ q: `ABCD is a square with A(0, 0), B(${H.s}, 0), C(${H.s}, ${H.s}) and D(0, ${H.s}). A treasure T is inside ABCD such that T is equidistant from AB and DC, and T is ${H.r} units from ${H.cn}. (a) Describe the locus for each condition. (b) Find the coordinates of T.`, ans: `(a) A parallel line in the middle of AB and DC; a circle centred at ${H.cn} with a radius of ${H.r} units (b) T${P(H.tx, H.h)}`, work: [`Locus 1: the horizontal line in the middle of AB and DC, that is ${H.h} units from AB.`, `Locus 2: a circle centred at ${H.cn} with a radius of ${H.r} units.`, `Horizontal distance from ${H.cn} = ${rt(`${H.r}² − ${H.h}²`)} = ${rt(H.r * H.r - H.h * H.h)} = ${H.k}`, `T${P(H.tx, H.h)}`] }),
    ({ G }) => ({ q: `A goat is tied to pole T${P(G.tx, G.ty)} with a ${G.r} m rope (1 unit = 1 m). A bucket of water is to be placed at a position that the goat can reach when the rope is taut and that is equidistant from two trees, M${P(G.m1[0], G.m1[1])} and N${P(G.m2[0], G.m2[1])}. Find the coordinates of all the possible positions of the bucket.`, ans: lkPtsTxt(G.X), work: [`Locus 1: a circle centred at T with a radius of ${G.r} units.`, `Locus 2: the perpendicular bisector of MN, that is ${G.desc}.`, `Intersection: ${lkPtsTxt(G.X)}.`, `Check: ${G.X.map(([x, y]) => `${P(x, y)} → distance from T = ${lkPyth(x - G.tx, y - G.ty)}`).join('; ')}`] }),
    ({ Q }) => ({ q: `On a Cartesian plane, point X moves such that X is equidistant from the x-axis and the y-axis, and X is ${Q.d} units from the straight line that passes through ${P(0, Q.c)} and is parallel to the x-axis. (a) Describe both loci. (b) Find the coordinates of all the positions of X in the first quadrant.`, ans: `(a) The angle bisector between the x-axis and the y-axis; a pair of parallel lines ${Q.d} units from that line (b) ${lkPtsTxt(Q.X)}`, work: ['Locus 1: the line that bisects the angle between the x-axis and the y-axis (points with coordinates x = y).', `Locus 2: two horizontal lines through ${lkDan(Q.ys.map(v => P(0, v)))}.`, `Intersections in the first quadrant: ${lkPtsTxt(Q.X)}`] })
  ]
};

/* =================== pembina soalan (r = lkRG atau lkRW) =================== */
const LK = {};
/* ---------- 8.1 ---------- */
LK.harian = (r, k) => {
  const [sit, tt, cat, desc, why] = k == null ? r.p(LKHARI) : LKHARI[k % LKHARI.length];
  const wrong = LKCAT[r.p(Object.keys(LKCAT).filter(c => c !== cat))];
  return GEN_LQ('harian', { sit, tt, wrong, ans: desc, why, work: [why, `Thus the locus of ${tt} is ${desc[0].toLowerCase() + desc.slice(1)}.`] });
};
LK.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
// syarat untuk soalan "titik manakah pada lokus" (grid 10 × 8)
function lkTitikCond(r, ty) {
  const nm = lkShuf(r, LKHUR), seg = (a, b) => ({ a, b, c: 'tr', w: 4 });
  if (ty === 'D') {
    const c = r.i(3, 5), d = r.p([1, 2, 3]), K = nm[0], L = nm[1];
    return { s: `is always ${d} units from the straight line ${K}${L}`, g: (x, y) => Math.abs(Math.abs(y - c) - d), chk: (x, y) => `distance from ${K}${L} = ${Math.abs(y - c)}`,
      given: { segs: [seg([0, c], [10, c])], texts: [{ x: .3, y: c + .4, s: K, c: 'tr', anchor: 'start' }, { x: 9.7, y: c + .4, s: L, c: 'tr', anchor: 'end' }] },
      loc: { inf: [c - d, c + d].filter(v => v >= 0 && v <= 8).map(v => ({ L: [0, 1, v], c: 'pk', dash: true })) }, bad: (x, y) => y === c };
  }
  if (ty === 'M') {
    const c1 = r.i(1, 3), g = r.p([2, 4]), c2 = c1 + g, md = c1 + g / 2, nmz = [nm[0] + nm[1], nm[2] + nm[3]];
    return { s: `is always equidistant from two parallel lines ${nmz[0]} and ${nmz[1]}`, g: (x, y) => Math.abs(y - md), chk: (x, y) => `distance from ${nmz[0]} = ${Math.abs(y - c1)}, from ${nmz[1]} = ${Math.abs(y - c2)}`,
      given: { segs: [seg([0, c1], [10, c1]), seg([0, c2], [10, c2])], texts: [{ x: .3, y: c1 + .4, s: nmz[0], c: 'tr', anchor: 'start' }, { x: .3, y: c2 + .4, s: nmz[1], c: 'tr', anchor: 'start' }] },
      loc: { inf: [{ L: [0, 1, md], c: 'pk', dash: true }] }, bad: (x, y) => y === c1 || y === c2 };
  }
  if (ty === 'Bh') {
    const y0 = r.i(2, 6), x1 = r.i(1, 3), k = r.i(2, 3), x2 = x1 + 2 * k, md = x1 + k, Q = nm[0], R = nm[1];
    return { s: `is always equidistant from point ${Q} and point ${R}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x1, y - y0)) - Math.sqrt(lkSq(x - x2, y - y0))), chk: (x, y) => `${Q} → ${lkRt(lkSq(x - x1, y - y0))}, ${R} → ${lkRt(lkSq(x - x2, y - y0))}`,
      given: { pts: [{ x: x1, y: y0, l: Q, c: 'tr' }, { x: x2, y: y0, l: R, c: 'tr' }] }, loc: { inf: [{ L: [1, 0, md], c: 'pk', dash: true }] }, bad: (x, y) => (x === x1 || x === x2) && y === y0 };
  }
  if (ty === 'Cs') {
    const x0 = r.i(3, 7), y0 = r.i(3, 5), rad = r.p([2, 3]), T = nm[0];
    return { s: `is always ${rad} units from point ${T}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x0, y - y0)) - rad), chk: (x, y) => `distance from ${T} = ${lkPyth(x - x0, y - y0)}`,
      given: { pts: [{ x: x0, y: y0, l: T, c: 'tr' }] }, loc: { circ: [{ x: x0, y: y0, r: rad, c: 'pk', dash: true }] }, bad: (x, y) => x === x0 && y === y0 };
  }
  if (ty === 'C5') {
    const x0 = r.i(4, 6), y0 = 4, T = nm[0];
    return { s: `is always 5 units from point ${T}`, g: (x, y) => Math.abs(Math.sqrt(lkSq(x - x0, y - y0)) - 5), chk: (x, y) => `distance from ${T} = ${lkPyth(x - x0, y - y0)}`,
      given: { pts: [{ x: x0, y: y0, l: T, c: 'tr' }] }, loc: { circ: [{ x: x0, y: y0, r: 5, c: 'pk', dash: true }] }, bad: (x, y) => x === x0 && y === y0 };
  }
  if (ty === 'Bg') {
    let q, w; do { q = [r.i(1, 5), r.i(1, 4)]; w = [q[0] + r.p([2, 4]), q[1] + r.p([2, -2, 4])]; } while (w[1] < 0 || w[1] > 8 || w[0] > 9);
    const Q = nm[0], R = nm[1], A = 2 * (w[0] - q[0]), B = 2 * (w[1] - q[1]), Cc = lkSq(w[0], w[1]) - lkSq(q[0], q[1]);
    return { s: `is always equidistant from point ${Q} and point ${R}`, g: (x, y) => Math.abs(lkSq(x - q[0], y - q[1]) - lkSq(x - w[0], y - w[1])) / 4, chk: (x, y) => `${Q} → ${lkRt(lkSq(x - q[0], y - q[1]))}, ${R} → ${lkRt(lkSq(x - w[0], y - w[1]))}`,
      given: { pts: [{ x: q[0], y: q[1], l: Q, c: 'tr' }, { x: w[0], y: w[1], l: R, c: 'tr' }], segs: [{ a: q, b: w, c: 'mu', w: 2, dash: true }] }, loc: { inf: [{ L: [A, B, Cc], c: 'pk', dash: true }] }, bad: (x, y) => (x === q[0] && y === q[1]) || (x === w[0] && y === w[1]) };
  }
  // A: sudut tegak di O
  const ox = r.i(0, 2), oy = r.i(0, 1), O = nm[0], A1 = nm[1], B1 = nm[2];
  return { s: `is always equidistant from the straight lines ${O}${A1} and ${O}${B1}`, g: (x, y) => (x < ox || y < oy ? 9 : Math.abs((x - ox) - (y - oy))), chk: (x, y) => `distance from ${O}${A1} = ${y - oy}, from ${O}${B1} = ${x - ox}`,
    given: { segs: [seg([ox, oy], [10, oy]), seg([ox, oy], [ox, 8])], pts: [{ x: ox, y: oy, l: O, c: 'tr', dx: 8, dy: -8 }, { x: 10, y: oy, l: A1, c: 'tr', r: 5 }, { x: ox, y: 8, l: B1, c: 'tr', r: 5 }] },
    loc: { segs: [{ a: [ox, oy], b: [ox + 8 - oy, 8], c: 'pk', w: 3.5, dash: true }] }, bad: (x, y) => x === ox || y === oy };
}
LK.titik = (r, tys) => {
  const ty = r.p(tys), cd = lkTitikCond(r, ty);
  for (let t = 0; t < 200; t++) {
    const on = [], off = [];
    for (let x = 0; x <= 10; x++) for (let y = 0; y <= 8; y++) {
      if (cd.bad(x, y)) continue; const g = cd.g(x, y);
      if (g < 1e-9) on.push([x, y]); else if (g < 1.6) off.push([x, y]);
    }
    const nOn = r.i(2, 3), pickSet = [], far = p => pickSet.every(q => Math.hypot(p[0] - q[0], p[1] - q[1]) >= 1.9);
    lkShuf(r, on).forEach(p => { if (pickSet.length < nOn && far(p)) pickSet.push(p); });
    const nOnGot = pickSet.length;
    lkShuf(r, off).forEach(p => { if (pickSet.length < 6 && far(p)) pickSet.push(p); });
    if (nOnGot < 2 || pickSet.length < 6) continue;
    const cand = pickSet.sort((a, b) => a[0] - b[0] || b[1] - a[1]).map((p, i) => ({ x: p[0], y: p[1], l: LKCAND[i], on: cd.g(p[0], p[1]) < 1e-9 }));
    const yes = cand.filter(c => c.on).map(c => c.l);
    const fig = lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: 'Points A to F on a grid' }, cd.given, { pts: cand.map(c => ({ x: c.x, y: c.y, l: c.l, c: 'am', r: 5.5 })) }));
    const figAns = lkFig(lkMerge({ nx: 10, ny: 8, u: 32, label: 'A locus and the points on it' }, cd.loc, cd.given, { pts: cand.map(c => ({ x: c.x, y: c.y, l: c.l, c: c.on ? 'gr' : 'mu', r: 5.5, ring: c.on })) }));
    return GEN_LQ('titik', { s: cd.s, n: yes.length, ans: lkDan(yes), work: cand.map(c => `${c.l}: ${cd.chk(c.x, c.y)} ${c.on ? '✓' : '✗'}`) }, { fig, figAns });
  }
  return LK.titik(r, ['D']);
};
LK.ferris = r => {
  const D = r.p([14, 20, 28, 30, 40, 42, 50, 56, 60]), h0 = r.i(1, 5);
  return GEN_LQ('ferris', { D, h0, ans: `A circle with a radius of ${D / 2} m; maximum height = ${h0 + D} m`, work: [`Radius = ${D} ÷ 2 = ${D / 2} m`, `Height of the centre of the wheel = ${h0} + ${D / 2} = ${h0 + D / 2} m`, `Maximum height = ${h0} + ${D} = ${h0 + D} m`] });
};
LK.tambat = r => {
  const L = r.i(2, 12);
  return GEN_LQ('tambat', { L, ans: `A circle centred at the point where it is tied, radius ${L} m; greatest distance = diameter = ${2 * L} m`, work: ['The animal is always at the same distance (the length of the rope) from the point where it is tied, so its locus is a circle.', `Radius = ${L} m`, `Diameter = 2 × ${L} = ${2 * L} m`] });
};
LK.roda = r => {
  const D = r.p([24, 30, 40, 50, 56, 60, 64, 70]);
  return GEN_LQ('roda', { D, ans: `A straight line parallel to the road, ${D / 2} cm from the road`, work: [`Radius of the wheel = ${D} ÷ 2 = ${D / 2} cm`, 'The centre of the wheel is always one radius away from the road.', `Locus: a straight line parallel to the road at a height of ${D / 2} cm.`] });
};
LK.k81 = r => {
  const [rr, n] = r.p([[35, 5], [14, 25], [21, 50], [35, 10], [7, 50], [28, 25]]);
  return GEN_LQ('k81', { w: r.p([70, 77, 84, 91, 105]), L: r.p([7, 14, 21, 28]), rr, n, D: r.p([14, 28, 42, 56, 70]), h0: r.i(1, 4) });
};

/* ---------- 8.2 ---------- */
function lkJenisData(r, ty) {
  const nm = lkShuf(r, LKHUR);
  if (ty === 'C') { const a = r.i(2, 9), T = nm[0]; return { s: `is always ${a} cm from point ${T}`, ans: `A circle centred at ${T} with a radius of ${a} cm`, wrong: `a circle centred at ${T} with a diameter of ${a} cm`, why: 'The constant distance from the centre is the radius, not the diameter.', work: [`All the points ${a} cm from ${T} form a circle.`, `Centre = ${T}, radius = ${a} cm`] }; }
  if (ty === 'B') { const [p, q] = nm; return { s: `is always equidistant from point ${p} and point ${q}`, ans: `The perpendicular bisector of the line ${p}${q}`, wrong: `the straight line ${p}${q}`, why: `Points on the line ${p}${q} (except its midpoint) are not equidistant from ${p} and ${q}.`, work: [`Points equidistant from ${p} and ${q} lie on the line that passes through the midpoint of ${p}${q} and is perpendicular to ${p}${q}.`] }; }
  if (ty === 'D') { const d = r.i(2, 8), [k, l] = nm; return { s: `is always ${d} cm from the straight line ${k}${l}`, ans: `A pair of straight lines parallel to ${k}${l} and ${d} cm from ${k}${l}`, wrong: `one straight line parallel to ${k}${l}`, why: `The points that satisfy the condition are on both sides of ${k}${l}.`, work: [`The distance of ${d} cm can be measured above and below ${k}${l}.`, `Thus the locus is two parallel lines, ${d} cm from ${k}${l}.`] }; }
  if (ty === 'M') { const g = 2 * r.i(2, 6), [e, f, gg, h] = nm; return { s: `is always equidistant from two parallel lines ${e}${f} and ${gg}${h} which are ${g} cm apart`, ans: `A straight line parallel to ${e}${f} and ${gg}${h}, ${g / 2} cm from each line`, wrong: `a straight line parallel to ${e}${f} and ${g} cm from it`, why: `The locus is in the middle, that is ${g} ÷ 2 = ${g / 2} cm from each line.`, work: [`The locus is in the middle of the two parallel lines.`, `Distance from each line = ${g} ÷ 2 = ${g / 2} cm`] }; }
  const [o, a, b] = nm;
  return { s: `is always equidistant from the straight lines ${o}${a} and ${o}${b} which intersect at ${o}`, ans: `The angle bisector of ${a}${o}${b}`, wrong: `the perpendicular bisector of the line ${a}${b}`, why: 'Being equidistant from two intersecting lines produces an angle bisector.', work: [`Points equidistant from ${o}${a} and ${o}${b} lie on the line that bisects the angle ${a}${o}${b}.`] };
}
LK.jenis = (r, k) => { const ty = k == null ? r.p(LKJK) : LKJK[k % 5]; return GEN_LQ('jenis', lkJenisData(r, ty)); };
LK.rajah = (r, k) => {
  const ty = k == null ? r.p(LKJK) : LKJK[k % 5], sh = lkShape(r, ty);
  return GEN_LQ('rajah', { jn: LKJN[ty], sy: sh.s, ans: `X ${sh.s}`, work: [`The locus in the diagram: ${sh.lok[0].toLowerCase() + sh.lok.slice(1)}.`, `Thus X ${sh.s}.`] }, { fig: lkShapeFig(sh, true, 'Locus of point X on a grid') });
};
LK.lukis = (r, k) => {
  const ty = k == null ? r.p(LKJK) : LKJK[k % 5], sh = lkShape(r, ty);
  const tip = { C: 'Use a pair of compasses: put the point at the centre and draw a circle.', B: 'Draw the line that passes through the midpoint and is perpendicular to the line connecting the two points.', D: 'Draw parallel lines on both sides of the line, at the same distance.', M: 'Draw a parallel line in the middle of the two lines.', A: 'Draw the line that bisects the angle between the two lines.' }[ty];
  return GEN_LQ('lukis', { s: sh.s, ans: `${sh.lok} (refer to the answer diagram)`, work: [tip] }, { fig: lkShapeFig(sh, false), figAns: lkShapeFig(sh, true, 'Locus of X drawn'), kind: 'lukis' });
};
LK.silang = r => {
  const pr = lkPair(r);
  return GEN_LQ('silang', { s1: pr.a.s, s2: pr.b.s, ans: lkPtsTxt(pr.X), work: [`First locus: ${pr.a.lok}.`, `Second locus: ${pr.b.lok}.`].concat(pr.X.map(([x, y]) => `${P(x, y)}: ${pr.a.chk(x, y)}; ${pr.b.chk(x, y)}`)) }, { fig: lkPairFig(pr), figAns: lkPairFig(pr, true) });
};
LK.bilSilang = r => {
  const pr = lkPair(r, { any: true }), n = pr.X.length;
  return GEN_LQ('bilSilang', { s1: pr.a.s, s2: pr.b.s, wn: n === 1 ? 2 : n - 1, ans: `${n} points`, work: [`First locus: ${pr.a.lok}.`, `Second locus: ${pr.b.lok}.`, `Both loci intersect at ${n} points in the grid.`] }, { fig: lkPairFig(pr), figAns: lkPairFig(pr, true) });
};
LK.bina = (r, k) => {
  const nm = lkShuf(r, LKHUR), [a, b, c] = nm, d = r.i(2, 6);
  const L = [
    { what: `the perpendicular bisector of the line ${a}${b}`, lok: `points equidistant from ${a} and ${b}`, ans: `Draw arcs of the same radius (more than half of ${a}${b}) from ${a} and from ${b}; join the two points where the arcs intersect`, work: [`Open the compasses to more than half the length of ${a}${b}.`, `With the point at ${a}, draw arcs above and below ${a}${b}.`, `Repeat from ${b} with the same opening.`, 'Join the two points of intersection of the arcs with a ruler.'] },
    { what: `the angle bisector of ${a}${b}${c}`, lok: `points equidistant from the lines ${b}${a} and ${b}${c}`, ans: `Draw an arc from ${b} cutting ${b}${a} and ${b}${c}; from both cutting points draw arcs of the same radius; join ${b} to the point where they intersect`, work: [`With the point at ${b}, draw an arc that cuts ${b}${a} and ${b}${c}.`, 'From each cutting point, draw an arc with the same opening until they intersect.', `Join ${b} to the point of intersection.`] },
    { what: `the locus of points ${d} cm from point ${a}`, lok: `a circle centred at ${a} with a radius of ${d} cm`, ans: `Open the compasses to ${d} cm, put the point at ${a} and draw a full circle`, work: [`Measure the opening of the compasses to ${d} cm with a ruler.`, `Put the point of the compasses at ${a}.`, 'Draw a full circle.'] },
    { what: `the locus of points ${d} cm from the straight line ${a}${b}`, lok: `a pair of parallel lines ${d} cm from ${a}${b}`, ans: `Mark two points ${d} cm from ${a}${b} (measured perpendicularly) on each side, then draw two lines parallel to ${a}${b}`, work: [`At two positions along ${a}${b}, measure ${d} cm perpendicularly above and below ${a}${b}.`, 'Join the marks on the same side with a ruler.', `The two parallel lines are the locus.`] }
  ][k == null ? r.i(0, 3) : k % 4];
  return GEN_LQ('bina', L);
};
LK.k82 = r => {
  let x1, x2, y, d; do { x1 = r.i(0, 4); x2 = x1 + 2 * r.i(2, 4); y = r.i(1, 3); d = r.i(2, 6); } while (d === y);
  const L = { x1, x2, y, d, m: (x1 + x2) / 2 };
  const [s, h, rr, kk] = r.p([[8, 4, 5, 3], [6, 3, 5, 4], [12, 6, 10, 8], [16, 8, 10, 6], [10, 5, 13, 12]].filter(v => v[3] < v[0])), cn = r.p(['A', 'B', 'C', 'D']);
  const H = { s, h, r: rr, k: kk, cn, tx: cn === 'A' || cn === 'D' ? kk : s - kk };
  let tx, dx; do { tx = r.i(4, 8); dx = r.p([0, 3, 4, -3, -4]); } while (tx + dx < 3);
  const ty = r.i(5, 8), dy = Math.round(Math.sqrt(25 - dx * dx)), kx = r.i(1, 3), yy = r.i(0, 3);
  const G = { tx, ty, r: 5, m1: [tx + dx - kx, yy], m2: [tx + dx + kx, yy], X: [[tx + dx, ty - dy], [tx + dx, ty + dy]], desc: `a vertical line through ${P(tx + dx, yy)}` };
  const c = r.i(3, 7), dd = r.i(1, c - 1), Q = { c, d: dd, ys: [c - dd, c + dd], X: [[c - dd, c - dd], [c + dd, c + dd]] };
  return GEN_LQ('k82', { L, H, G, Q });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '8.1': {
    m: [() => LK.harian(lkRG), () => LK.harian(lkRG), () => LK.bs(lkRG, LKBS1), () => LK.titik(lkRG, ['D', 'M', 'Bh', 'Cs'])],
    s: [() => LK.titik(lkRG, ['C5', 'Bg', 'A']), () => LK.ferris(lkRG), () => LK.tambat(lkRG), () => LK.roda(lkRG)],
    k: [() => LK.k81(lkRG)]
  },
  '8.2': {
    m: [() => LK.jenis(lkRG), () => LK.rajah(lkRG), () => LK.lukis(lkRG), () => LK.bs(lkRG, LKBS2)],
    s: [() => LK.silang(lkRG), () => LK.silang(lkRG), () => LK.bilSilang(lkRG), () => LK.bina(lkRG)],
    k: [() => LK.k82(lkRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 8.1
WG.harian = i => LK.harian(lkRW, i * 3 + wri(0, 2));
WG.bs1 = i => LK.bs(lkRW, LKBS1, i * 3 + wri(0, 2));
WG.titikM = i => LK.titik(lkRW, [['D', 'M', 'Bh', 'Cs'][i % 4]]);
WG.titikS = i => LK.titik(lkRW, [['C5', 'Bg', 'A'][i % 3]]);
WG.ferris = () => LK.ferris(lkRW);
WG.tambat = () => LK.tambat(lkRW);
WG.roda = () => LK.roda(lkRW);
WG.k81 = () => LK.k81(lkRW);
// 8.2
WG.jenis = i => LK.jenis(lkRW, i);
WG.rajah = i => LK.rajah(lkRW, i + 2);
WG.lukis = i => LK.lukis(lkRW, i * 2);
WG.bs2 = i => LK.bs(lkRW, LKBS2, i * 3 + wri(0, 2));
WG.silang = () => LK.silang(lkRW);
WG.bilSilang = () => LK.bilSilang(lkRW);
WG.bina = i => LK.bina(lkRW, i);
WG.k82 = () => LK.k82(lkRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '8.1': [['m', 'harian', 9], ['m', 'bs1', 3], ['m', 'titikM', 6], ['s', 'titikS', 3], ['s', 'ferris', 2], ['s', 'tambat', 2], ['s', 'roda', 2], ['k', 'k81', 3]],
  '8.2': [['m', 'jenis', 7], ['m', 'rajah', 5], ['m', 'lukis', 3], ['m', 'bs2', 3], ['s', 'silang', 5], ['s', 'bilSilang', 2], ['s', 'bina', 2], ['k', 'k82', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function lkOptsT(ans, cands, pad) {
  const w = []; shuffle(cands).forEach(c => { if (c !== ans && !w.includes(c) && w.length < 3) w.push(c); });
  (pad || []).forEach(c => { if (c !== ans && !w.includes(c) && w.length < 3) w.push(c); });
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
function lkOptsN(ans, cands, f) {
  const A = f(ans), w = [];
  shuffle(cands).forEach(c => { if (c > 0 && Number.isFinite(c)) { const s = f(c); if (s !== A && !w.includes(s) && w.length < 3) w.push(s); } });
  for (let k = 1; w.length < 3 && k < 40; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (v > 0) { const s = f(v); if (s !== A && !w.includes(s)) w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const lkMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const LK3D = [['Points in space at a constant distance from a point', 'Surface of a sphere'], ['Points in space at a constant distance from a straight line', 'Surface of a cylinder'],
  ['Points on a plane at a constant distance from a point', 'Circle'], ['Points on a plane at a constant distance from a straight line', 'A pair of parallel lines']];
// rajah pasangan: hanya objek + lokus (tanpa titik persilangan)
const lkPairLoc = pr => lkFig(lkMerge(pr.a.loc, { circ: (pr.b.loc.circ || []).map(c => Object.assign({}, c, { c: 'pu' })), inf: (pr.b.loc.inf || []).map(l => Object.assign({}, l, { c: 'pu' })) }, { nx: 10, ny: 10, axes: true, u: 30, label: 'Two loci on a Cartesian plane' }, pr.a.given, pr.b.given));
function lkCoordOpts(pr) {
  const [x, y] = r0(pr.X), key = p => p.join(','), inX = p => pr.X.some(q => key(q) === key(p));
  const near = [[y, x], [x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1], [x + 2, y], [x, y + 2], [x + 1, y + 1], [x - 1, y - 1]].filter(p => p[0] >= 0 && p[1] >= 0 && p[0] <= 10 && p[1] <= 10 && !inX(p));
  return lkOptsT(P(x, y), near.map(p => P(...p)));
  function r0(a) { return a[Math.floor(Math.random() * a.length)]; }
}
const CQGEN = {
  harian: [
    () => { const [sit, tt, cat] = pick(LKHARI); return lkMcq(`What is the locus of ${tt} when ${sit}?`, '', lkOptsT(LKCAT[cat], Object.values(LKCAT))); },
    () => {
      const [sit, tt, cat] = pick(LKHARI); return lkMcq(`When ${sit}, what is the locus of ${tt}?`, '', lkOptsT(LKCAT[cat], Object.values(LKCAT)));
    },
    () => {
      const k = ri(0, 2);
      if (k === 0) { const D = pick([20, 28, 30, 40, 50, 60]), h0 = ri(1, 5); return lkMcq(`A Ferris wheel has a diameter of ${D} m. The lowest cabin is ${h0} m from the ground. What is the maximum height of the cabin?`, '', lkOptsN(h0 + D, [h0 + D / 2, D, h0 + 2 * D, D / 2], v => `${v} m`)); }
      if (k === 1) { const D = pick([30, 40, 50, 56, 60, 70]); return lkMcq(`A wheel with a diameter of ${D} cm rolls on a flat road. The locus of its centre is a line parallel to the road at a height of…`, '', lkOptsN(D / 2, [D, 2 * D, D / 4], v => `${v} cm`)); }
      const L = ri(3, 12); return lkMcq(`A goat is tied to a pole with a ${L} m rope (rope taut). What is the diameter of the locus of the goat?`, '', lkOptsN(2 * L, [L, L / 2, 4 * L, L + 2], v => `${v} m`));
    }
  ],
  jenis: [
    () => { const ty = pick(LKJK), d = lkJenisData(lkRG, ty); return lkMcq(`The locus of points which ${d.s} is…`, '', lkOptsT(LKJN[ty], Object.values(LKJN))); },
    () => { const ty = pick(LKJK), sh = lkShape(lkRG, ty); return lkMcq('The dashed line is the locus of point X. What type of locus is it?', lkShapeFig(sh, true, 'Locus of point X'), lkOptsT(LKJN[ty], Object.values(LKJN))); },
    () => {
      const k = ri(0, 2);
      if (k === 0) { const g = 2 * ri(2, 7); return lkMcq(`Two parallel lines are ${g} cm apart. How far from each line is the locus of points equidistant from both lines?`, '', lkOptsN(g / 2, [g, 2 * g, g / 2 + 1], v => `${v} cm`)); }
      if (k === 1) { const sh = lkShape(lkRG, 'C'), m = sh.s.match(/(\d+) unit/); const rad = +m[1]; return lkMcq('The locus of point X in the diagram is a circle. What is the constant distance of X from its centre? (1-unit grid)', lkShapeFig(sh, true, 'Locus circle'), lkOptsN(rad, [2 * rad, rad + 1, rad - 1], v => `${v} units`)); }
      const d = ri(2, 6); return lkMcq(`How many straight lines are there in the locus of points ${d} cm from a straight line AB?`, '', lkOptsT('2', ['1', '3', '4']));
    }
  ],
  silang: [
    () => { const pr = lkPair(lkRG, { any: true }); const n = pr.X.length; return lkMcq('How many points of intersection of the two loci are there in the grid?', lkPairLoc(pr), lkOptsT(String(n), ['1', '2', '3', '4', '0'])); },
    () => { const pr = lkPair(lkRG); return lkMcq(`X ${pr.a.s} and X ${pr.b.s}. Which one is a position of X?`, lkPairFig(pr), lkCoordOpts(pr)); },
    () => { const pr = lkPair(lkRG, { types: shuffle(['C', pick(['B', 'D', 'M', 'A'])]) }); return lkMcq(`X ${pr.a.s} and X ${pr.b.s}. Which one is a position of X?`, lkPairFig(pr), lkCoordOpts(pr)); }
  ]
};
const CQT = { harian: 'Daily loci', jenis: 'Five basic loci', silang: 'Intersection of loci' };
function lkCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.harian;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['harian', 'harian', 'jenis', 'jenis', 'silang'] : Object.keys(CQT);
  return lkCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return lkCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
