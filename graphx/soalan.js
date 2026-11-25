'use strict';
/* =================== GRAPHX · SOALAN BAB 8 GRAF FUNGSI (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "gx" / "GX" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & ungkapan =================== */
const gxN = x => { let v = Math.round(x * 1e4) / 1e4; if (v === 0) v = 0; return v < 0 ? '−' + (-v) : '' + v; };   // tiada 0.30000000004, tiada −0
const gxP = (x, y) => `(${gxN(x)}, ${gxN(y)})`;
const gxPar = x => (x < 0 ? `(${gxN(x)})` : gxN(x));
// rawak: GXRG untuk Latihan Kelas / games, GXRW (berbenih) untuk Lembaran Kerja
const GXRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const GXRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const gxShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const gxNz = (r, a, b) => { let v; do v = r.i(a, b); while (v === 0); return v; };
const gxDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const gxRange = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const GXSUP = ['', '', '²', '³'];
const gxX = p => (p ? 'x' + GXSUP[p] : '');
// pecahan (HTML) untuk teks soalan & pilihan jawapan
const gxFr = (n, d) => fr(n, d); // gaya dikongsi .fr (teras/asas.js) – mathPlain() faham untuk game/RPH
// pecahan bertingkat dalam rajah SVG (warna melalui pemboleh ubah CSS seperti gxT)
const gxSFr = (x, y, a, b, c = 'tx', sz = 18) => svgFr(x, y, a, b, '#000', sz).replace(/fill="#000"/g, `style="fill:var(--${c})"`).replace(/stroke="#000"/g, `style="stroke:var(--${c})"`);

/* Fungsi F = { T:[[pekali, kuasa] …] } (polinomial) atau { rec:a } (salingan y = a/x) */
function gxE(F, html = true) {
  if (F.rec != null) return html ? (F.rec < 0 ? '−' : '') + gxFr(gxN(Math.abs(F.rec)), 'x') : `${gxN(F.rec)}/x`;
  let s = '';
  F.T.filter(t => t[0] !== 0).forEach(([c, p], i) => {
    const ac = Math.abs(c), body = (ac === 1 && p > 0 ? '' : gxN(ac)) + gxX(p);
    s += i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body;
  });
  return s || '0';
}
const gxV = (F, k) => (F.rec != null ? F.rec / k : F.T.reduce((s, [c, p]) => s + c * Math.pow(k, p), 0));
const gxMaxP = F => (F.rec != null ? -1 : Math.max(...F.T.filter(t => t[0] !== 0).map(t => t[1])));
const gxJenis = F => ({ '-1': 'sal', 0: 'lin', 1: 'lin', 2: 'kuad', 3: 'kub' })[gxMaxP(F)];
// langkah penggantian: [ 'lhs = 3(−2) + 1', '= −6 + 1', '= −5' ]
function gxSub(F, k, lhs) {
  const v = gxV(F, k);
  if (F.rec != null) return [`${lhs} = ${(F.rec < 0 ? '−' : '') + gxFr(gxN(Math.abs(F.rec)), gxPar(k))}`, `= ${gxN(v)}`];
  const ts = F.T.filter(t => t[0] !== 0);
  let s1 = '', s2 = '';
  ts.forEach(([c, p], i) => {
    const ac = Math.abs(c); let body;
    if (p === 0) body = gxN(ac);
    else if (ac === 1) body = (k < 0 || (c < 0 && (p > 1 || k === 0)) ? `(${gxN(k)})` : gxN(k)) + GXSUP[p];
    else body = `${gxN(ac)}(${gxN(k)})${GXSUP[p]}`;
    s1 += i === 0 ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body;
    const tv = c * Math.pow(k, p);
    s2 += i === 0 ? gxN(tv) : (tv < 0 ? ' − ' : ' + ') + gxN(Math.abs(tv));
  });
  const out = [`${lhs} = ${s1}`];
  if (s2 !== s1 && s2 !== gxN(v)) out.push(`= ${s2}`);
  if (gxN(v) !== s1) out.push(`= ${gxN(v)}`);
  return out;
}
const GXJN = { lin: 'Fungsi linear', kuad: 'Fungsi kuadratik', kub: 'Fungsi kubik', sal: 'Fungsi salingan' };
const GXJW = {
  lin: 'Kuasa tertinggi x ialah 1, maka fungsi ini ialah <b>fungsi linear</b>.',
  kuad: 'Kuasa tertinggi x ialah 2, maka fungsi ini ialah <b>fungsi kuadratik</b>.',
  kub: 'Kuasa tertinggi x ialah 3, maka fungsi ini ialah <b>fungsi kubik</b>.',
  sal: 'x berada pada penyebut (y = ' + fr('a', 'x') + '), maka fungsi ini ialah <b>fungsi salingan</b>.'
};
const gxBentuk = F => {
  const j = gxJenis(F), a = F.rec != null ? F.rec : F.T.filter(t => t[1] === gxMaxP(F))[0][0];
  if (j === 'lin') return 'Garis lurus';
  if (j === 'kuad') return a > 0 ? 'Lengkung berbentuk ∪ (parabola terbuka ke atas)' : 'Lengkung berbentuk ∩ (parabola terbuka ke bawah)';
  if (j === 'kub') return a > 0 ? 'Lengkung berbentuk S yang menaik dari kiri ke kanan' : 'Lengkung berbentuk S yang menurun dari kiri ke kanan';
  return a > 0 ? 'Dua lengkung berasingan dalam sukuan I dan III, tidak menyentuh paksi' : 'Dua lengkung berasingan dalam sukuan II dan IV, tidak menyentuh paksi';
};
const GXBW = {
  lin: 'Graf fungsi linear ialah <b>garis lurus</b>.',
  kuad: 'Graf fungsi kuadratik ialah lengkung berbentuk <b>∪</b> atau <b>∩</b> (parabola).',
  kub: 'Graf fungsi kubik ialah lengkung berbentuk <b>S</b>.',
  sal: 'Graf fungsi salingan terdiri daripada <b>dua lengkung berasingan</b> yang tidak menyentuh paksi-x dan paksi-y.'
};

/* =================== rajah (SVG, warna tema) =================== */
const gxSvg = (inner, label, vb) => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${inner}</svg>`;
const gxT = (x, y, t, c = 'tx', sz = 18, w = 700, anc = 'middle') => `<text x="${x}" y="${y}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${anc}" dominant-baseline="central">${t}</text>`;
const gxHead = (a, b, c, w = 2.5) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, f = p => +p.toFixed(1);
  return `<polygon points="${f(b[0])},${f(b[1])} ${f(b[0] - 11 * ux - 5 * uy)},${f(b[1] - 11 * uy + 5 * ux)} ${f(b[0] - 11 * ux + 5 * uy)},${f(b[1] - 11 * uy - 5 * ux)}" style="fill:var(--${c})"/>` + `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0] - 8 * ux)}" y2="${f(b[1] - 8 * uy)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"/>`;
};

/* ---------- gambar rajah anak panah ---------- */
const gxCol = n => { const g = n > 1 ? Math.min(44, 156 / (n - 1)) : 0; return i => +(146 + (i - (n - 1) / 2) * g).toFixed(1); };
function gxArrowFig(P, Q, pairs, o = {}) {
  const yP = gxCol(P.length), yQ = gxCol(Q.length), ry = n => Math.max(58, (n > 1 ? Math.min(44, 156 / (n - 1)) * (n - 1) : 0) / 2 + 34);
  let s = `<ellipse cx="70" cy="146" rx="40" ry="${ry(P.length)}" style="fill:var(--tr);fill-opacity:.1;stroke:var(--tr)" stroke-width="2.5"/>`;
  s += `<ellipse cx="250" cy="146" rx="40" ry="${ry(Q.length)}" style="fill:var(--pa);fill-opacity:.1;stroke:var(--pa)" stroke-width="2.5"/>`;
  pairs.forEach(([i, j]) => { s += gxHead([96, yP(i)], [224, yQ(j)], 'gr'); });
  P.forEach((v, i) => { s += gxT(70, yP(i), typeof v === 'number' ? gxN(v) : v, 'tx', 19); });
  Q.forEach((v, i) => { s += gxT(250, yQ(i), typeof v === 'number' ? gxN(v) : v, 'tx', 19); });
  s += gxT(70, 14, o.A || 'Set A', 'tr', 15) + gxT(250, 14, o.B || 'Set B', 'pa', 15);
  if (o.rule) s += gxT(160, 14, o.rule, 'gr', 15);
  return gxSvg(s, o.label || 'Gambar rajah anak panah', '0 0 320 266');
}

/* ---------- jadual nilai ---------- */
function gxTabFig(xs, ys, o = {}) {
  const n = xs.length, cw = n > 7 ? 46 : 54, hw = 44, h = 42, W = hw + cw * n + 4, y2 = 2 + h;
  let s = `<rect x="2" y="2" width="${hw}" height="${h}" style="fill:var(--surf2);stroke:var(--bd)" stroke-width="2"/><rect x="2" y="${y2}" width="${hw}" height="${h}" style="fill:var(--surf2);stroke:var(--bd)" stroke-width="2"/>`;
  s += gxT(2 + hw / 2, 2 + h / 2, 'x', 'mu', 19, 800) + gxT(2 + hw / 2, y2 + h / 2, o.y || 'y', 'mu', 19, 800);
  xs.forEach((x, i) => {
    const cx = 2 + hw + i * cw, hi = typeof ys[i] === 'string';
    s += `<rect x="${cx}" y="2" width="${cw}" height="${h}" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
    s += `<rect x="${cx}" y="${y2}" width="${cw}" height="${h}" style="fill:${hi ? 'var(--pa);fill-opacity:.16' : 'var(--surf)'};stroke:var(--bd)" stroke-width="2"/>`;
    s += gxT(cx + cw / 2, 2 + h / 2, gxN(x), 'tr', 17);
    s += gxT(cx + cw / 2, y2 + h / 2, hi ? ys[i] : gxN(ys[i]), hi ? 'pa' : 'tx', hi ? 19 : 17, hi ? 800 : 700);
  });
  return gxSvg(s, o.label || 'Jadual nilai', `0 0 ${W + 2} ${2 * h + 6}`);
}

/* ---------- mesin fungsi ---------- */
function gxMachFig(inp, steps, out = '?') {
  const bw = steps.length > 1 ? 104 : 150, gap = 34, x0 = 76, W = x0 + steps.length * (bw + gap) + 50;
  let s = '', x = x0;
  s += `<circle cx="38" cy="70" r="28" style="fill:var(--tr)"/>` + gxT(38, 70, inp, 'bg', 20, 800) + gxT(38, 122, 'input', 'mu', 14, 600);
  steps.forEach((st, i) => {
    s += gxHead([i ? x - gap + 2 : 68, 70], [x - 2, 70], 'mu', 3);
    s += `<rect x="${x}" y="30" width="${bw}" height="80" rx="14" style="fill:var(--pu);fill-opacity:.14;stroke:var(--pu)" stroke-width="3"/>`;
    if (steps.length === 1) s += gxT(x + bw / 2, 50, 'f(x)', 'mu', 14, 600);
    const fm = /^(−?)(\d+)\/x$/.exec(st); // salingan a/x → pecahan bertingkat
    if (fm) { const cy = steps.length === 1 ? 84 : 72; s += (fm[1] ? gxT(x + bw / 2 - 22, cy, '−', 'pu', 20, 800) : '') + gxSFr(x + bw / 2 + (fm[1] ? 6 : 0), cy, fm[2], 'x', 'pu', 17); }
    else s += gxT(x + bw / 2, steps.length === 1 ? 80 : 70, st, 'pu', st.length > 9 ? 17 : 21, 800);
    x += bw + gap;
  });
  const ox = x - gap + 36;
  s += gxHead([x - gap + 2, 70], [ox - 30, 70], 'mu', 3);
  s += `<circle cx="${ox}" cy="70" r="28" style="fill:var(--pa)"/>` + gxT(ox, 70, out, 'bg', 20, 800) + gxT(ox, 122, 'output', 'mu', 14, 600);
  return gxSvg(s, 'Mesin fungsi', `0 0 ${ox + 34} 140`);
}

/* ---------- kad ungkapan (untuk games tanpa rajah) ---------- */
function gxCardFig(F, lhs = 'y') {
  let s = `<rect x="4" y="4" width="312" height="112" rx="18" style="fill:var(--pu);fill-opacity:.1;stroke:var(--pu)" stroke-width="2.5"/>`;
  if (F.rec != null) {
    s += gxT(118, 60, `${lhs} = ${F.rec < 0 ? '−' : ''}`, 'tx', 34, 800, 'end');
    s += gxT(152, 36, gxN(Math.abs(F.rec)), 'tx', 30, 800) + `<line x1="128" y1="60" x2="176" y2="60" style="stroke:var(--tx)" stroke-width="3"/>` + gxT(152, 84, 'x', 'tx', 30, 800);
  } else s += gxT(160, 60, `${lhs} = ${gxE(F, false)}`, 'tx', 32, 800);
  return gxSvg(s, 'Persamaan fungsi', '0 0 320 120');
}

// kad teks (cth. set pasangan bertertib), dipecah kepada beberapa baris
function gxTextFig(t) {
  const parts = t.replace(/^\{|\}$/g, '').split(/,\s(?=\()/), lines = [];
  for (let i = 0; i < parts.length; i += 3) lines.push(parts.slice(i, i + 3).join(', ') + (i + 3 < parts.length ? ',' : ''));
  lines[0] = '{' + lines[0]; lines[lines.length - 1] += '}';
  const H = 40 + lines.length * 34;
  let s = `<rect x="4" y="4" width="352" height="${H - 8}" rx="18" style="fill:var(--pu);fill-opacity:.1;stroke:var(--pu)" stroke-width="2.5"/>`;
  lines.forEach((l, i) => { s += gxT(180, 37 + i * 34, l, 'tx', 22, 800); });
  return gxSvg(s, 'Set pasangan bertertib', `0 0 360 ${H}`);
}

/* ---------- graf pada satah Cartes ---------- */
// o: { F, x0, x1, y0, y1, xs, ys (langkah label), pts:[{x,y,c,l}], guide:[{x,y}], only (unsur sahaja, untuk reveal), eq }
function gxGraphFig(o) {
  const { x0, x1, y0, y1 } = o, L = 42, T = 18, W = 300, H = o.H || 250;
  const sx = x => +(L + (x - x0) / (x1 - x0) * W).toFixed(1), sy = y => +(T + (y1 - y) / (y1 - y0) * H).toFixed(1);
  const xs = o.xs || 1, ys = o.ys || 1, ax = x0 <= 0 && 0 <= x1 ? 0 : x0, ay = y0 <= 0 && 0 <= y1 ? 0 : y0;
  let s = '', e = '';
  if (!o.only) {
    const gxs = x1 - x0 > 16 ? xs : 1, gys = y1 - y0 > 24 ? ys : 1;
    for (let x = Math.ceil(x0 / gxs) * gxs; x <= x1; x += gxs) s += `<line x1="${sx(x)}" y1="${T}" x2="${sx(x)}" y2="${T + H}" style="stroke:var(--grid)" stroke-width="1.3"/>`;
    for (let y = Math.ceil(y0 / gys) * gys; y <= y1; y += gys) s += `<line x1="${L}" y1="${sy(y)}" x2="${L + W}" y2="${sy(y)}" style="stroke:var(--grid)" stroke-width="1.3"/>`;
    s += `<line x1="${L}" y1="${sy(ay)}" x2="${L + W + 8}" y2="${sy(ay)}" style="stroke:var(--mu)" stroke-width="2.4"/><line x1="${sx(ax)}" y1="${T + H}" x2="${sx(ax)}" y2="${T - 8}" style="stroke:var(--mu)" stroke-width="2.4"/>`;
    for (let x = Math.ceil(x0 / xs) * xs; x <= x1; x += xs) if (x !== ax) s += gxT(sx(x), sy(ay) + 14, gxN(x), 'mu', 12, 600);
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1; y += ys) if (y !== ay) s += gxT(sx(ax) - 6, sy(y), gxN(y), 'mu', 12, 600, 'end');
    if (ax === 0 && ay === 0) s += gxT(sx(0) - 6, sy(0) + 13, '0', 'mu', 12, 600, 'end');
    s += gxT(L + W + 14, sy(ay), 'x', 'mu', 15, 800) + gxT(sx(ax), T - 14, 'y', 'mu', 15, 800);
    if (o.F) {
      const f = k => gxV(o.F, k), segs = o.F.rec != null ? [[x0, -1e-3], [1e-3, x1]] : [[x0, x1]];
      for (const [a, b] of segs) {
        let d = '', prev = null;
        const N = 240, inR = y => y >= y0 && y <= y1, bnd = (p, q) => { const yb = (inR(p.y) ? q.y : p.y) > y1 ? y1 : y0; return [p.x + (yb - p.y) * (q.x - p.x) / (q.y - p.y), yb]; };
        for (let i = 0; i <= N; i++) {
          const x = a + (b - a) * i / N, y = f(x), cur = { x, y };
          if (inR(y)) {
            if (!prev || !inR(prev.y)) { const st = prev ? bnd(prev, cur) : [x, y]; d += `M${sx(st[0])} ${sy(st[1])}`; }
            d += `L${sx(x)} ${sy(y)}`;
          } else if (prev && inR(prev.y)) { const en = bnd(prev, cur); d += `L${sx(en[0])} ${sy(en[1])}`; }
          prev = cur;
        }
        s += `<path d="${d}" style="fill:none;stroke:var(--${o.c || 'pu'})" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      }
    }
    if (o.eq) s += `<rect x="${L + W - 132}" y="${T + H - 30}" width="128" height="26" rx="6" style="fill:var(--surf);fill-opacity:.85"/>` + gxT(L + W - 8, T + H - 17, o.eq, o.c || 'pu', 15, 800, 'end');
  }
  for (const g of o.guide || []) e += `<polyline points="${sx(g.x)},${sy(ay)} ${sx(g.x)},${sy(g.y)} ${sx(ax)},${sy(g.y)}" style="fill:none;stroke:var(--am)" stroke-width="2.5" stroke-dasharray="7 5"/>`;
  for (const p of o.pts || []) e += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="5.5" style="fill:var(--${p.c || 'am'})"/>` + (p.l ? gxT(sx(p.x) + 9, sy(p.y) - 12, p.l, p.c || 'am', 14, 800, 'start') : '');
  if (o.only) return e;
  return gxSvg(s + e, o.label || 'Graf fungsi', `0 0 ${L + W + 24} ${T + H + 26}`);
}

/* =================== data bersama =================== */
const GXTN = { ss: 'satu kepada satu', sb: 'satu kepada banyak', bs: 'banyak kepada satu', bb: 'banyak kepada banyak' };
const GXTD = { ss: 'setiap objek ada satu imej dan setiap imej ada satu objek', sb: 'ada objek yang mempunyai lebih daripada satu imej', bs: 'ada imej yang mempunyai lebih daripada satu objek, tetapi setiap objek ada satu imej sahaja', bb: 'ada objek dengan beberapa imej dan ada imej dengan beberapa objek' };
const GXSH = { lin: 'garis lurus', kuad: 'lengkung berbentuk ∪ atau ∩', kub: 'lengkung berbentuk S', sal: 'dua lengkung berasingan' };
const GXKW = { lin: 'kuasa tertinggi x ialah 1', kuad: 'kuasa tertinggi x ialah 2', kub: 'kuasa tertinggi x ialah 3', sal: 'x berada pada penyebut' };
const GXSET = [['A', 'B'], ['P', 'Q'], ['X', 'Y'], ['M', 'N']];
// hubungan rawak jenis t: ss, sb, bs, bb, atau 'tiada' (ada objek tanpa imej)
function gxRel(r, t) {
  const n = t === 'sb' || t === 'bb' ? 3 : r.i(3, 4), P = gxShuf(r, gxRange(1, 9)).slice(0, n).sort((a, b) => a - b), pairs = [];
  let m;
  if (t === 'ss') { m = n + r.i(0, 1); const pm = gxShuf(r, gxRange(0, m - 1)); for (let i = 0; i < n; i++) pairs.push([i, pm[i]]); }
  if (t === 'sb') { m = n + 1; const pm = gxShuf(r, gxRange(0, m - 1)), d = r.i(0, n - 1); let j = 0; for (let i = 0; i < n; i++) { pairs.push([i, pm[j++]]); if (i === d) pairs.push([i, pm[j++]]); } }
  if (t === 'bs') { m = n - 1 - (n === 4 ? r.i(0, 1) : 0); const im = gxShuf(r, gxRange(0, m - 1)); for (let i = 0; i < n; i++) pairs.push([i, i < m ? im[i] : r.i(0, m - 1)]); m += r.i(0, 1); }
  if (t === 'bb') { m = 3; const po = gxShuf(r, [0, 1, 2]), pi = gxShuf(r, [0, 1, 2]); [[0, 0], [0, 1], [1, 1], [2, 2]].forEach(([a, b]) => pairs.push([po[a], pi[b]])); if (r.f() < .5) pairs.push([po[2], pi[0]]); }
  if (t === 'tiada') { m = n; const pm = gxShuf(r, gxRange(0, m - 1)), u = r.i(0, n - 1); for (let i = 0; i < n; i++) if (i !== u) pairs.push([i, pm[i]]); }
  const Q = gxShuf(r, gxRange(2, 24)).slice(0, m).sort((a, b) => a - b);
  pairs.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  return { P, Q, pairs };
}
// analisis hubungan: jenis + sebab
function gxInfo(rel) {
  const { P, Q, pairs } = rel, out = P.map(() => []), inn = Q.map(() => []);
  pairs.forEach(([i, j]) => { out[i].push(Q[j]); inn[j].push(P[i]); });
  const tiada = out.findIndex(o => !o.length), dua = out.findIndex(o => o.length > 1), ramai = inn.findIndex(o => o.length > 1);
  const t = tiada >= 0 ? 'tiada' : dua >= 0 && ramai >= 0 ? 'bb' : dua >= 0 ? 'sb' : ramai >= 0 ? 'bs' : 'ss';
  const fn = t === 'ss' || t === 'bs';
  const why = {
    ss: 'Setiap objek mempunyai tepat satu imej dan setiap imej mempunyai tepat satu objek.',
    sb: dua >= 0 ? `Objek ${gxN(P[dua])} mempunyai dua imej, iaitu ${gxDan(out[dua].map(gxN))}.` : '',
    bs: ramai >= 0 ? `Imej ${gxN(Q[ramai])} mempunyai lebih daripada satu objek (${gxDan(inn[ramai].map(gxN))}), tetapi setiap objek hanya ada satu imej.` : '',
    bb: dua >= 0 && ramai >= 0 ? `Objek ${gxN(P[dua])} mempunyai dua imej dan imej ${gxN(Q[ramai])} mempunyai dua objek.` : '',
    tiada: tiada >= 0 ? `Objek ${gxN(P[tiada])} tidak mempunyai imej.` : ''
  }[t];
  const whyF = fn ? 'Setiap objek mempunyai <b>tepat satu</b> imej, maka hubungan ini ialah <b>fungsi</b>.'
    : t === 'tiada' ? `Objek ${gxN(P[tiada])} tidak mempunyai imej, maka hubungan ini <b>bukan fungsi</b>.`
      : `Objek ${gxN(P[dua])} mempunyai dua imej, maka hubungan ini <b>bukan fungsi</b>.`;
  return { t, fn, why, whyF };
}
const gxPairs = rel => `{${rel.pairs.map(([i, j]) => gxP(rel.P[i], rel.Q[j])).join(', ')}}`;
// peraturan fungsi (gambar rajah anak panah / tatatanda)
const GXRULE = {
  tambah: r => { const c = r.i(1, 9); return { F: { T: [[1, 1], [c, 0]] }, op: `Setiap objek ditambah ${c} untuk mendapat imejnya.` }; },
  tolak: r => { const c = r.i(1, 6); return { F: { T: [[1, 1], [-c, 0]] }, op: `Setiap objek ditolak ${c} untuk mendapat imejnya.`, min: c + 1 }; },
  darab: r => { const c = r.i(2, 6); return { F: { T: [[c, 1]] }, op: `Setiap objek didarab dengan ${c} untuk mendapat imejnya.` }; },
  kuasa: () => ({ F: { T: [[1, 2]] }, op: 'Setiap objek dikuasaduakan untuk mendapat imejnya.' })
};
function gxRuleRel(r, kind) {
  const R = GXRULE[kind](r), n = r.i(3, 4), lo = R.min || 1;
  const P = gxShuf(r, gxRange(lo, kind === 'kuasa' ? 6 : lo + 8)).slice(0, n).sort((a, b) => a - b);
  const img = P.map(x => gxV(R.F, x)), extra = r.f() < .5 ? [Math.max(...img) + r.i(1, 3)] : [];
  const Q = img.concat(extra).sort((a, b) => a - b);
  return Object.assign(R, { P, Q, img, pairs: P.map((x, i) => [i, Q.indexOf(img[i])]) });
}
const GXCTX = [
  ['Jumlah bayaran, <i>B</i> (RM), bergantung pada bilangan tiket wayang, <i>t</i>, yang dibeli.', 'B', 't', 'bilangan tiket'],
  ['Jarak yang dilalui sebuah kereta, <i>d</i> km, bergantung pada masa perjalanan, <i>t</i> jam.', 'd', 't', 'masa perjalanan'],
  ['Luas sebuah segi empat sama, <i>L</i> cm², bergantung pada panjang sisinya, <i>s</i> cm.', 'L', 's', 'panjang sisi'],
  ['Isi padu air dalam sebuah tangki, <i>V</i> liter, berubah mengikut masa pengisian, <i>m</i> minit.', 'V', 'm', 'masa pengisian'],
  ['Upah harian seorang pekerja, <i>U</i> (RM), bergantung pada bilangan jam bekerja, <i>j</i>.', 'U', 'j', 'bilangan jam bekerja'],
  ['Suhu sejenis cecair, <i>T</i> °C, berubah mengikut masa pemanasan, <i>m</i> minit.', 'T', 'm', 'masa pemanasan'],
  ['Kos pos sebuah bungkusan, <i>K</i> (RM), bergantung pada jisim bungkusan, <i>w</i> kg.', 'K', 'w', 'jisim bungkusan'],
  ['Bilangan kalori yang dibakar, <i>E</i>, bergantung pada jarak larian, <i>x</i> km.', 'E', 'x', 'jarak larian']
];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 8.1 Fungsi ---------- */
  jenisHub: [
    ({ A, B }) => ({ q: `Rajah di bawah menunjukkan hubungan antara set ${A} dan set ${B}. Nyatakan jenis hubungan itu.` }),
    () => ({ q: 'Kenal pasti jenis hubungan yang ditunjukkan oleh gambar rajah anak panah di bawah.' }),
    () => ({ q: 'Berdasarkan gambar rajah anak panah di bawah, adakah hubungan itu satu kepada satu, satu kepada banyak, banyak kepada satu atau banyak kepada banyak?' }),
    ({ claim, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata hubungan dalam rajah di bawah ialah hubungan ${claim}. Adakah ${N} betul? Jika tidak, nyatakan jenis yang betul.` }, salah(N, ans, why)); },
    ({ A, B }) => ({ q: `Lengkapkan: Hubungan dari set ${A} ke set ${B} dalam rajah di bawah ialah hubungan ______.` })
  ],
  fungsiYT: [
    () => ({ q: 'Adakah hubungan yang ditunjukkan dalam gambar rajah anak panah di bawah suatu fungsi? Berikan sebab.' }),
    () => ({ q: 'Tentukan sama ada hubungan di bawah ialah fungsi atau bukan fungsi.' }),
    ({ fn }) => { const N = vnama(); return { q: `${N} berkata hubungan di bawah ialah suatu fungsi. Adakah anda setuju? Jelaskan.`, ans: fn ? `Setuju, hubungan ini ialah fungsi` : `Tidak setuju, hubungan ini bukan fungsi` }; },
    ({ A }) => ({ q: `Semak setiap objek dalam set ${A}. Adakah hubungan dalam rajah di bawah suatu fungsi?` })
  ],
  objImej: [
    ({ p }) => ({ q: `Berdasarkan gambar rajah anak panah di bawah, nyatakan imej bagi ${gxN(p)}.` }),
    ({ q, oq, work2 }) => ({ q: `Dalam rajah di bawah, apakah objek bagi ${gxN(q)}?`, ans: gxN(oq), work: work2 }),
    ({ p, ip, q, oq, work, work2 }) => ({ q: `Nyatakan imej bagi ${gxN(p)} dan objek bagi ${gxN(q)} dalam hubungan di bawah.`, ans: `Imej bagi ${gxN(p)} = ${gxN(ip)}; objek bagi ${gxN(q)} = ${gxN(oq)}`, work: work.concat(work2) }),
    ({ p }) => ({ q: `Rajah di bawah menunjukkan fungsi f. Cari nilai f(${gxN(p)}).` }),
    ({ q, oq, work2 }) => ({ q: `Lengkapkan: Dalam rajah di bawah, ${gxN(q)} ialah imej bagi ___.`, ans: gxN(oq), work: work2 })
  ],
  cariFk: [
    ({ e, k }) => ({ q: `Diberi f(x) = ${e}. Cari nilai f(${gxN(k)}).` }),
    ({ e, k }) => ({ q: `Diberi fungsi f : x → ${e}. Cari imej bagi ${gxN(k)}.` }),
    ({ e, k }) => ({ q: `Hitung f(${gxN(k)}) jika f(x) = ${e}.` }),
    ({ e, k, a, b, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi f(x) = ${e}. ${N} mendapati f(${gxN(k)}) = ${gxN(a * k)}. Adakah ${N} betul?` }, salah(N, `f(${gxN(k)}) = ${ans}`, `${N} hanya mengira ${gxN(a)} × ${gxPar(k)} dan terlupa ${b > 0 ? 'menambah' : 'menolak'} ${Math.abs(b)}.`)); },
    ({ e, k }) => ({ q: `Fungsi f ditakrifkan oleh f(x) = ${e}. Apakah nilai f(${gxN(k)})?` })
  ],
  mesin: [
    ({ k }) => ({ q: `Rajah di bawah menunjukkan sebuah mesin fungsi. Apakah output jika input ialah ${gxN(k)}?` }),
    ({ k }) => ({ q: `Nombor ${gxN(k)} dimasukkan ke dalam mesin fungsi di bawah. Cari outputnya.` }),
    ({ k, desc }) => ({ q: `Mesin fungsi di bawah ${desc}. Cari output bagi input ${gxN(k)}.` }),
    ({ k, ex, ans, work }) => ({ q: `Tulis fungsi bagi mesin di bawah dalam bentuk f(x) = …, kemudian cari f(${gxN(k)}).`, ans: `f(x) = ${ex}; f(${gxN(k)}) = ${ans}`, work: [`Mesin itu memberi f(x) = ${ex}.`].concat(work) })
  ],
  tatatanda: [
    ({ ex }) => ({ q: 'Tulis hubungan dalam rajah di bawah menggunakan tatatanda fungsi f : x → … .', ans: `f : x → ${ex}` }),
    ({ ex }) => ({ q: 'Lengkapkan tatatanda fungsi bagi rajah di bawah: f : x → ____', ans: `f : x → ${ex}` }),
    ({ ex }) => ({ q: 'Ungkapkan fungsi dalam gambar rajah anak panah di bawah dalam bentuk f(x) = … .', ans: `f(x) = ${ex}` }),
    ({ ex }) => ({ q: 'Setiap objek dalam rajah di bawah dipetakan kepada imejnya oleh satu peraturan yang sama. Tulis peraturan itu sebagai f(x) = … .', ans: `f(x) = ${ex}` })
  ],
  cariObj: [
    ({ e, v }) => ({ q: `Diberi f(x) = ${e}. Cari nilai x jika f(x) = ${gxN(v)}.` }),
    ({ e, v }) => ({ q: `Diberi fungsi f : x → ${e}. Cari objek yang mempunyai imej ${gxN(v)}.` }),
    ({ e, v, k }) => ({ q: `Jika f(x) = ${e} dan f(k) = ${gxN(v)}, cari nilai k.`, ans: `k = ${gxN(k)}` }),
    ({ e, v }) => ({ q: `Mesin fungsi f(x) = ${e} menghasilkan output ${gxN(v)}. Apakah inputnya?` })
  ],
  fNonLin: [
    ({ e, k }) => ({ q: `Diberi f(x) = ${e}. Cari nilai f(${gxN(k)}).` }),
    ({ e, k }) => ({ q: `Cari imej bagi ${gxN(k)} di bawah fungsi f : x → ${e}.` }),
    ({ e, k }) => ({ q: `Hitung nilai f(${gxN(k)}) bagi fungsi f(x) = ${e}.` }),
    ({ e, k }) => ({ q: `Lengkapkan: Jika f(x) = ${e}, maka f(${gxN(k)}) = ___.` })
  ],
  pasTertib: [
    ({ S }) => ({ q: `Satu hubungan diwakili oleh set pasangan bertertib ${S}. Nyatakan jenis hubungan itu.` }),
    ({ S, fnAns, whyF }) => ({ q: `Diberi set pasangan bertertib ${S}. Adakah hubungan ini suatu fungsi? Berikan sebab.`, ans: fnAns, work: [whyF] }),
    ({ S, ans, fnAns, work, whyF }) => ({ q: `Pasangan bertertib ${S} mewakili satu hubungan. Nyatakan jenis hubungan itu dan sama ada hubungan itu suatu fungsi.`, ans: `${ans}; ${fnAns.toLowerCase()}`, work: work.concat([whyF]) }),
    ({ S }) => ({ q: `Wakilkan hubungan ${S} dengan gambar rajah anak panah, kemudian nyatakan jenis hubungan itu.` })
  ],
  bersandar: [
    ({ ctx, dep, ind }) => ({ q: `${ctx} Nyatakan pemboleh ubah bersandar dan pemboleh ubah tak bersandar.`, ans: `Bersandar: ${dep}; tak bersandar: ${ind}` }),
    ({ ctx, ind }) => ({ q: `${ctx} Yang manakah pemboleh ubah tak bersandar?`, ans: ind }),
    ({ ctx, dep }) => ({ q: `${ctx} Kenal pasti pemboleh ubah bersandar.`, ans: dep }),
    ({ ctx, dep, ind }) => { const N = vnama(); return Object.assign({ q: `${ctx} ${N} berkata ${dep} ialah pemboleh ubah tak bersandar. Adakah ${N} betul?` }, salah(N, `${dep} ialah pemboleh ubah bersandar; ${ind} ialah pemboleh ubah tak bersandar`, `${N} tertukar antara pemboleh ubah bersandar dengan pemboleh ubah tak bersandar.`)); }
  ],
  objKuasa: [
    ({ e, v }) => ({ q: `Diberi f(x) = ${e}. Cari nilai-nilai x jika f(x) = ${gxN(v)}.` }),
    ({ e, v }) => ({ q: `Fungsi f ditakrifkan oleh f : x → ${e}. Cari objek-objek yang mempunyai imej ${gxN(v)}.` }),
    ({ e, v, s, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi f(x) = ${e}. ${N} berkata objek bagi imej ${gxN(v)} hanyalah ${s}. Adakah ${N} betul?` }, salah(N, ans, `(−${s})² = ${s * s} juga, jadi −${s} juga ialah objek bagi ${gxN(v)}.`)); }
  ],
  k81: [
    ({ a, b, m, n, fm, fn }) => ({
      q: `Diberi f(x) = ax + b dengan keadaan a dan b ialah pemalar. Jika f(${m}) = ${gxN(fm)} dan f(${n}) = ${gxN(fn)}, cari nilai a dan nilai b.`, ans: `a = ${gxN(a)}, b = ${gxN(b)}`,
      work: [`f(${m}) = ${m === 1 ? '' : m}a + b = ${gxN(fm)} … (1)`, `f(${n}) = ${n}a + b = ${gxN(fn)} … (2)`, `(2) − (1): ${n - m === 1 ? '' : n - m}a = ${gxN(fn - fm)}, maka a = ${gxN(a)}`, `Daripada (1): b = ${gxN(fm)} − ${gxPar(m * a)} = ${gxN(b)}`]
    }),
    ({ a, b, m, fm }) => ({
      q: `Diberi f(x) = px ${b < 0 ? '−' : '+'} ${Math.abs(b)} dengan keadaan p ialah pemalar. Jika f(${m}) = ${gxN(fm)}, cari nilai p. Seterusnya, cari f(−2).`, ans: `p = ${gxN(a)}; f(−2) = ${gxN(-2 * a + b)}`,
      work: [`${m === 1 ? '' : m}p ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${gxN(fm)}`, `${m === 1 ? '' : m}p = ${gxN(fm - b)}, maka p = ${gxN(a)}`].concat(gxSub({ T: [[a, 1], [b, 0]] }, -2, 'f(−2)'))
    }),
    ({ a, x0 }) => {
      const bf = -x0 * (a - 1), F = { T: [[a, 1], [bf, 0]] };
      return { q: `Bagi fungsi f(x) = ${gxE(F)}, cari objek yang imejnya sama dengan objek itu sendiri, iaitu f(x) = x.`, ans: `x = ${gxN(x0)}`, work: [`${gxE(F)} = x`, `${a}x − x = ${gxN(-bf)}`, `${a - 1 === 1 ? '' : a - 1}x = ${gxN(-bf)}, maka x = ${gxN(x0)}`] };
    },
    ({ rate, base, dist }) => { const N = vnama(), fare = rate * dist + base; return { q: `Tambang teksi, T (RM), bagi perjalanan sejauh x km diberi oleh fungsi T(x) = ${rate}x + ${base}. ${N} membayar RM${fare}. Berapakah jarak perjalanan ${N}?`, ans: `${dist} km`, work: [`${rate}x + ${base} = ${fare}`, `${rate}x = ${fare - base}`, `x = ${fare - base} ÷ ${rate} = ${dist}`] }; },
    ({ h, mm }) => { const vv = mm * mm + h * mm; return { q: `Diberi f(x) = x² + hx dengan keadaan h ialah pemalar. Jika f(${mm}) = ${gxN(vv)}, cari nilai h.`, ans: `h = ${gxN(h)}`, work: [`${mm}² + ${mm === 1 ? '' : mm}h = ${gxN(vv)}`, `${mm === 1 ? '' : mm}h = ${gxN(vv)} − ${mm * mm} = ${gxN(vv - mm * mm)}`].concat(mm === 1 ? [] : [`h = ${gxN(vv - mm * mm)} ÷ ${mm} = ${gxN(h)}`]) }; }
  ],

  /* ---------- 8.2 Graf Fungsi ---------- */
  jadual: [
    ({ e }) => ({ q: `Lengkapkan jadual nilai di bawah bagi fungsi y = ${e}. Cari nilai p dan q.` }),
    ({ e }) => ({ q: `Jadual di bawah ialah jadual nilai bagi y = ${e}. Hitung nilai p dan nilai q.` }),
    ({ e }) => ({ q: `Cari nilai p dan q dalam jadual nilai bagi persamaan y = ${e} di bawah.` }),
    ({ e }) => ({ q: `Jadual di bawah disediakan untuk melukis graf y = ${e}. Tentukan nilai p dan nilai q.` }),
    ({ e }) => ({ q: `Diberi y = ${e}. Hitung nilai y yang ditandakan p dan q dalam jadual di bawah.` }),
    ({ e }) => ({ q: `Nilai p dan q dalam jadual di bawah memenuhi persamaan y = ${e}. Cari p dan q.` })
  ],
  jenisGraf: [
    () => ({ q: 'Rajah di bawah menunjukkan graf suatu fungsi. Nyatakan jenis fungsi itu.' }),
    ({ shape }) => ({ q: 'Perihalkan bentuk graf di bawah.', ans: shape }),
    ({ ans, shape }) => ({ q: 'Kenal pasti jenis fungsi bagi graf di bawah. Nyatakan juga bentuk graf itu.', ans: `${ans}; ${shape.toLowerCase()}` }),
    ({ list, eq, work }) => ({ q: `Antara persamaan ${list}, yang manakah mungkin mewakili graf di bawah?`, ans: `y = ${eq}`, work }),
    ({ claim, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata graf di bawah ialah graf ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  jenisPers: [
    ({ e }) => ({ q: `Nyatakan jenis fungsi bagi y = ${e}.` }),
    ({ e }) => ({ q: `Adakah y = ${e} suatu fungsi linear, kuadratik, kubik atau salingan?` }),
    ({ e, shape, sw }) => ({ q: `Apakah bentuk graf bagi y = ${e}?`, ans: shape, work: [sw] }),
    ({ e, claim, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata y = ${e} ialah ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, why)); },
    ({ e }) => ({ q: `Kenal pasti jenis fungsi y = ${e}. Berikan sebab.` })
  ],
  skala: [
    ({ ax, cm, k, v, Lv }) => ({ q: `Pada paksi-${ax}, skala ${cm} cm mewakili ${k} unit. Berapakah jarak (dalam cm) dari 0 ke tanda ${ax} = ${gxN(v)}?`, ans: `${gxN(Lv)} cm`, work: [`${k} unit → ${cm} cm`, `${gxN(Math.abs(v))} unit → ${gxN(Math.abs(v))} ÷ ${k} × ${cm} = ${gxN(Lv)} cm`] }),
    ({ ax, cm, k, v, Lv }) => ({ q: `Graf dilukis dengan skala ${cm} cm kepada ${k} unit pada paksi-${ax}. Satu tanda dibuat ${gxN(Lv)} cm dari 0 pada arah positif. Apakah nilai ${ax} pada tanda itu?`, ans: `${ax} = ${gxN(Math.abs(v))}`, work: [`${cm} cm → ${k} unit`, `${gxN(Lv)} cm → ${gxN(Lv)} ÷ ${cm} × ${k} = ${gxN(Math.abs(v))} unit`] }),
    ({ ax, cm, k, lo, hi }) => { const N = vnama(), Lt = (hi - lo) / k * cm; return { q: `${N} melukis paksi-${ax} dengan skala ${cm} cm kepada ${k} unit untuk nilai ${ax} dari ${gxN(lo)} hingga ${gxN(hi)}. Berapakah panjang paksi itu dalam cm?`, ans: `${gxN(Lt)} cm`, work: [`Julat nilai = ${gxN(hi)} − ${gxPar(lo)} = ${gxN(hi - lo)} unit`, `Panjang = ${gxN(hi - lo)} ÷ ${k} × ${cm} = ${gxN(Lt)} cm`] }; },
    ({ cm, k, v, Lv }) => ({ q: `Lengkapkan: Jika ${cm} cm mewakili ${k} unit, maka ${gxN(Math.abs(v))} unit diwakili oleh ___ cm.`, ans: `${gxN(Lv)} cm`, work: [`${gxN(Math.abs(v))} ÷ ${k} × ${cm} = ${gxN(Lv)} cm`] })
  ],
  titikPada: [
    ({ pt, e }) => ({ q: `Tentukan sama ada titik ${pt} terletak pada graf y = ${e}.` }),
    ({ pt, e }) => ({ q: `Adakah titik ${pt} berada pada graf fungsi y = ${e}? Tunjukkan jalan kerja.` }),
    ({ pt, e, on }) => { const N = vnama(); return { q: `${N} berkata titik ${pt} terletak pada graf y = ${e}. Adakah ${N} betul?`, ans: on ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; },
    ({ pt, e }) => ({ q: `Semak sama ada graf y = ${e} melalui titik ${pt}.` })
  ],
  bacaY: [
    ({ k, eqT }) => ({ q: `Rajah di bawah menunjukkan graf y = ${eqT}. Daripada graf, cari nilai y apabila x = ${gxN(k)}.` }),
    ({ k }) => ({ q: `Berdasarkan graf di bawah, apakah nilai y apabila x = ${gxN(k)}?` }),
    ({ k }) => ({ q: `Gunakan graf di bawah untuk mencari nilai y yang sepadan dengan x = ${gxN(k)}.` }),
    ({ k }) => ({ q: `Titik (${gxN(k)}, h) terletak pada graf di bawah. Baca nilai h daripada graf.` })
  ],
  bacaX: [
    ({ v, eqT }) => ({ q: `Rajah di bawah menunjukkan graf y = ${eqT}. Daripada graf, cari nilai-nilai x apabila y = ${gxN(v)}.` }),
    ({ v }) => ({ q: `Berdasarkan graf di bawah, cari nilai-nilai x yang memberi y = ${gxN(v)}.` }),
    ({ v, s, ans }) => { const N = vnama(); return Object.assign({ q: `Daripada graf di bawah, ${N} berkata x = ${s} sahaja apabila y = ${gxN(v)}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlepas pandang titik persilangan kedua di sebelah kiri paksi-y.`)); }
  ],
  titikK: [
    ({ h, eL }) => ({ q: `Titik (${gxN(h)}, k) terletak pada graf y = ${eL}. Cari nilai k.`, ans: `k = ${gxN(gxV(eL.F, h))}`, work: gxSub(eL.F, h, 'k') }),
    ({ v, eL, h }) => { const [a, b] = [eL.F.T[0][0], eL.F.T[1][0]]; return { q: `Titik (k, ${gxN(v)}) terletak pada graf y = ${eL}. Cari nilai k.`, ans: `k = ${gxN(h)}`, work: [`${gxE({ T: [[a, 1], [b, 0]] }).replace('x', 'k')} = ${gxN(v)}`, `${a === 1 ? '' : a === -1 ? '−' : gxN(a)}k = ${gxN(v - b)}`, `k = ${gxN(h)}`] }; },
    ({ m, eQ }) => ({ q: `Titik (${gxN(m)}, k) terletak pada graf y = ${eQ}. Cari nilai k.`, ans: `k = ${gxN(gxV(eQ.F, m))}`, work: gxSub(eQ.F, m, 'k') }),
    ({ h, eL }) => ({ q: `Graf fungsi y = ${eL} melalui titik P(${gxN(h)}, t). Hitung nilai t.`, ans: `t = ${gxN(gxV(eL.F, h))}`, work: gxSub(eL.F, h, 't') })
  ],
  lukis: [
    ({ e, ys, lo, hi }) => ({ q: `Lengkapkan jadual nilai bagi y = ${e} di bawah. Kemudian, dengan menggunakan skala 2 cm kepada 1 unit pada paksi-x dan 2 cm kepada ${ys} unit pada paksi-y, lukis graf y = ${e} untuk ${gxN(lo)} ≤ x ≤ ${gxN(hi)}.` }),
    ({ e, ys }) => ({ q: `Salin dan lengkapkan jadual di bawah bagi fungsi y = ${e}. Seterusnya, lukis graf fungsi itu pada kertas graf. Guna skala 2 cm kepada 1 unit (paksi-x) dan 2 cm kepada ${ys} unit (paksi-y).` }),
    ({ e, ys }) => ({ q: `Bina jadual nilai bagi y = ${e} dengan melengkapkan jadual di bawah, kemudian plot titik-titik itu dan lukis graf yang licin. Skala: 2 cm kepada 1 unit (paksi-x), 2 cm kepada ${ys} unit (paksi-y).` })
  ],
  k82: [
    ({ a2, c2, m, v2 }) => ({ q: `Graf y = ax² + c melalui titik (0, ${gxN(c2)}) dan (${m}, ${gxN(v2)}). Cari nilai a dan nilai c.`, ans: `a = ${gxN(a2)}, c = ${gxN(c2)}`, work: [`Pada (0, ${gxN(c2)}): y = a(0)² + c, maka c = ${gxN(c2)}`, `Pada (${m}, ${gxN(v2)}): a(${m})² ${c2 < 0 ? '−' : '+'} ${Math.abs(c2)} = ${gxN(v2)}`, `${m * m}a = ${gxN(v2 - c2)}, maka a = ${gxN(a2)}`] }),
    ({ a, c, m, n }) => { const v = a * m + c, F = { T: [[a, 1], [c, 0]] }; return { q: `Satu garis lurus y = ax + c melalui titik (0, ${gxN(c)}) dan (${m}, ${gxN(v)}). Cari persamaan garis itu, seterusnya cari nilai y apabila x = ${gxN(n)}.`, ans: `y = ${gxE(F)}; y = ${gxN(gxV(F, n))}`, work: [`Pada (0, ${gxN(c)}): c = ${gxN(c)}`, `Pada (${m}, ${gxN(v)}): ${m}a ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${gxN(v)}, maka a = ${gxN(a)}`, `Persamaan: y = ${gxE(F)}`].concat(gxSub(F, n, 'y')) }; },
    ({ m, c3, n }) => { const w = m * m + c3, F = { T: [[1, 2], [c3, 0]] }; return { q: `Graf y = x² + c melalui titik (${m}, ${gxN(w)}). Cari nilai c, kemudian cari nilai y apabila x = −${n}.`, ans: `c = ${gxN(c3)}; y = ${gxN(gxV(F, -n))}`, work: [`${m}² + c = ${gxN(w)}, maka c = ${gxN(w)} − ${m * m} = ${gxN(c3)}`].concat(gxSub(F, -n, 'y')) }; },
    ({ a3, s }) => { const F = { T: [[a3, 2], [-a3 * s * s, 0]] }; return { q: `Graf y = ${gxE(F)} memotong paksi-x pada dua titik. Cari koordinat kedua-dua titik itu.`, ans: `(−${s}, 0) dan (${s}, 0)`, work: ['Pada paksi-x, y = 0.', `${gxE(F)} = 0`, `${a3 === 1 ? '' : a3}x² = ${a3 * s * s}, maka x² = ${s * s}`, `x = −${s} atau x = ${s}`] }; },
    ({ c4 }) => { const F = { T: [[1, 3], [c4, 0]] }; return { q: `Bagi graf y = x³ + c, apabila x = 2, y = ${gxN(8 + c4)}. Cari nilai c dan nilai y apabila x = −2.`, ans: `c = ${gxN(c4)}; y = ${gxN(-8 + c4)}`, work: [`2³ + c = ${gxN(8 + c4)}, maka c = ${gxN(c4)}`].concat(gxSub(F, -2, 'y')) }; }
  ]
};

/* =================== pembina soalan (r = GXRG atau GXRW) =================== */
const GXB = {};
/* ---------- 8.1 ---------- */
GXB.jenisHub = (r, t) => {
  t = t || r.p(['ss', 'sb', 'bs', 'bb']);
  const rel = gxRel(r, t), inf = gxInfo(rel), [A, B] = r.p(GXSET), ans = 'Hubungan ' + GXTN[inf.t];
  const ck = r.p(Object.keys(GXTN).filter(k => k !== inf.t)), claim = GXTN[ck];
  return GEN_LQ('jenisHub', { A, B, ans, claim, why: `Hubungan ${claim} bermaksud ${GXTD[ck]}; rajah ini tidak begitu.`, work: [inf.why] }, { fig: gxArrowFig(rel.P, rel.Q, rel.pairs, { A: 'Set ' + A, B: 'Set ' + B }) });
};
GXB.fungsiYT = (r, t) => {
  t = t || r.p(['ss', 'bs', 'sb', 'bb', 'tiada']);
  const rel = gxRel(r, t), inf = gxInfo(rel), [A, B] = r.p(GXSET);
  return GEN_LQ('fungsiYT', { A, fn: inf.fn, ans: inf.fn ? 'Ya, hubungan ini ialah fungsi' : 'Bukan fungsi', work: [inf.whyF] }, { fig: gxArrowFig(rel.P, rel.Q, rel.pairs, { A: 'Set ' + A, B: 'Set ' + B }) });
};
GXB.objImej = (r, kind) => {
  const R = gxRuleRel(r, kind || r.p(['tambah', 'tolak', 'darab'])), n = R.P.length, i = r.i(0, n - 1); let j; do j = r.i(0, n - 1); while (j === i && n > 1);
  const p = R.P[i], ip = R.img[i], q = R.img[j], oq = R.P[j];
  return GEN_LQ('objImej', { p, ip, q, oq, ans: gxN(ip), work: [`Ikut anak panah dari ${gxN(p)}: imej bagi ${gxN(p)} ialah ${gxN(ip)}.`], work2: [`Anak panah yang menuju ke ${gxN(q)} bermula dari ${gxN(oq)}, maka objeknya ialah ${gxN(oq)}.`] }, { fig: gxArrowFig(R.P, R.Q, R.pairs, { A: 'Objek', B: 'Imej', rule: 'f' }) });
};
GXB.cariFk = r => {
  const a = r.p([2, 3, 4, 5, 6, -2, -3]), b = gxNz(r, -9, 9), k = gxNz(r, -5, 6), F = { T: [[a, 1], [b, 0]] }, e = gxE(F), v = gxV(F, k);
  return GEN_LQ('cariFk', { e, k, a, b, ans: gxN(v), work: gxSub(F, k, `f(${gxN(k)})`) }, { fig: gxMachFig(gxN(k), [gxE(F, false)]) });
};
GXB.mesin = r => {
  const a = r.i(2, 5), b = r.i(1, 9), t = r.i(0, 3), k = t === 3 ? b + r.i(1, 6) : r.i(1, 9);
  const M = [
    { st: [`× ${a}`, `+ ${b}`], desc: `mendarab input dengan ${a}, kemudian menambah ${b}`, ex: `${a}x + ${b}`, v: a * k + b, w: [`${k} × ${a} = ${a * k}`, `${a * k} + ${b} = ${a * k + b}`] },
    { st: [`× ${a}`, `− ${b}`], desc: `mendarab input dengan ${a}, kemudian menolak ${b}`, ex: `${a}x − ${b}`, v: a * k - b, w: [`${k} × ${a} = ${a * k}`, `${a * k} − ${b} = ${gxN(a * k - b)}`] },
    { st: [`+ ${b}`, `× ${a}`], desc: `menambah ${b} kepada input, kemudian mendarab dengan ${a}`, ex: `${a}(x + ${b})`, v: (k + b) * a, w: [`${k} + ${b} = ${k + b}`, `${k + b} × ${a} = ${(k + b) * a}`] },
    { st: [`− ${b}`, `× ${a}`], desc: `menolak ${b} daripada input, kemudian mendarab dengan ${a}`, ex: `${a}(x − ${b})`, v: (k - b) * a, w: [`${k} − ${b} = ${gxN(k - b)}`, `${gxN(k - b)} × ${a} = ${gxN((k - b) * a)}`] }
  ][t];
  return GEN_LQ('mesin', { k, desc: M.desc, ex: M.ex, ans: gxN(M.v), work: M.w }, { fig: gxMachFig(gxN(k), M.st) });
};
GXB.tatatanda = (r, kind) => {
  const R = gxRuleRel(r, kind || r.p(['tambah', 'tolak', 'darab', 'kuasa'])), ex = gxE(R.F);
  return GEN_LQ('tatatanda', { ex, work: [R.op, R.P.map((x, i) => `${gxN(x)} → ${gxN(R.img[i])}`).join(', '), `Maka f(x) = ${ex}.`] }, { fig: gxArrowFig(R.P, R.Q, R.pairs, { A: 'x', B: 'f(x)' }) });
};
GXB.cariObj = r => {
  const a = r.p([2, 3, 4, 5, -2, -3]), b = gxNz(r, -9, 9), k = gxNz(r, -6, 8), F = { T: [[a, 1], [b, 0]] }, e = gxE(F), v = gxV(F, k);
  return GEN_LQ('cariObj', { e, v, k, ans: `x = ${gxN(k)}`, work: [`f(x) = ${gxN(v)}`, `${e} = ${gxN(v)}`, `${gxN(a)}x = ${gxN(v)} ${b < 0 ? '+' : '−'} ${Math.abs(b)} = ${gxN(v - b)}`, `x = ${gxN(v - b)} ÷ ${gxPar(a)} = ${gxN(k)}`] }, { fig: gxMachFig('?', [gxE(F, false)], gxN(v)) });
};
GXB.fNonLin = r => {
  const t = r.i(0, 3); let F, k;
  if (t === 0) { F = { T: [[r.p([1, 2, 3, -1, -2]), 2], [gxNz(r, -9, 9), 0]] }; k = r.p([-4, -3, -2, -1, 2, 3]); }
  if (t === 1) { F = { T: [[r.p([1, 2, -1]), 3], [gxNz(r, -9, 9), 0]] }; k = r.p([-3, -2, -1, 2]); }
  if (t === 2) { F = { T: [[1, 2], [gxNz(r, -5, 5), 1]] }; k = r.p([-4, -3, -2, 2, 3, 4]); }
  if (t === 3) { const a = r.p([6, 12, 24, -12, -24]); F = { rec: a }; k = r.p([-6, -4, -3, -2, 2, 3, 4, 6].filter(x => Math.abs(a) % Math.abs(x) === 0)); }
  const e = gxE(F);
  return GEN_LQ('fNonLin', { e, k, ans: gxN(gxV(F, k)), work: gxSub(F, k, `f(${gxN(k)})`) }, { fig: gxMachFig(gxN(k), [gxE(F, false)]) });
};
GXB.pasTertib = (r, t) => {
  t = t || r.p(['ss', 'sb', 'bs', 'bb']);
  const rel = gxRel(r, t), inf = gxInfo(rel);
  return GEN_LQ('pasTertib', { S: gxPairs(rel), ans: 'Hubungan ' + GXTN[inf.t], fnAns: inf.fn ? 'Fungsi' : 'Bukan fungsi', whyF: inf.whyF, work: [inf.why] }, { figAns: gxArrowFig(rel.P, rel.Q, rel.pairs, { A: 'Objek', B: 'Imej' }) });
};
GXB.bersandar = (r, k) => {
  const [ctx, dep, ind] = k == null ? r.p(GXCTX) : GXCTX[k % GXCTX.length];
  return GEN_LQ('bersandar', { ctx, dep, ind, work: [`Nilai ${dep} bergantung pada nilai ${ind}.`, `Maka ${dep} ialah pemboleh ubah <b>bersandar</b> dan ${ind} ialah pemboleh ubah <b>tak bersandar</b>.`] });
};
GXB.objKuasa = r => {
  const c = r.i(-6, 6), s = r.i(2, 6), F = { T: [[1, 2], [c, 0]] }, e = gxE(F), v = s * s + c, ans = `x = −${s} atau x = ${s}`;
  return GEN_LQ('objKuasa', { e, v, s, ans, work: [`${e} = ${gxN(v)}`, `x² = ${s * s}`, `x = −${s} atau x = ${s}`] });
};
GXB.k81 = r => GEN_LQ('k81', (() => { const a = r.p([2, 3, 4, 5, -2, -3]), b = gxNz(r, -9, 9), m = r.i(1, 3), n = m + r.i(1, 3); return { a, b, m, n, fm: a * m + b, fn: a * n + b, x0: gxNz(r, -5, 5), rate: r.p([2, 3]), base: r.p([3, 4, 5]), dist: r.i(4, 15), h: gxNz(r, -5, 5), mm: r.i(1, 3) }; })());

/* ---------- 8.2 ---------- */
const GXJF = {
  lin: r => ({ T: [[r.p([1, 2, 3, -1, -2, -3]), 1], [r.i(-5, 5), 0]] }),
  kuad: r => ({ T: [[r.p([1, 2, -1, -2]), 2], [r.i(-5, 5), 0]] }),
  kub: r => ({ T: [[r.p([1, 2, -1]), 3], [r.i(-5, 5), 0]] }),
  sal: r => ({ rec: r.p([6, 12, 24, -6, -12, -24]) })
};
const GXXS = { lin: [[-2, 3], [-3, 2], [0, 5], [-1, 4]], kuad: [[-3, 3]], kub: [[-2, 2], [-3, 3]] };
function gxTabData(r, j, F) {
  F = F || GXJF[j](r);
  let xs;
  if (j === 'sal') xs = Math.abs(F.rec) % 4 === 0 ? [-4, -3, -2, -1, 1, 2, 3, 4] : [-3, -2, -1, 1, 2, 3, 4];
  else { const [lo, hi] = r.p(GXXS[j]); xs = gxRange(lo, hi); }
  const ys = xs.map(x => gxV(F, x));
  // dua sel kosong: elak x = 0 (terlalu mudah) kecuali linear, sekurang-kurangnya satu x negatif jika ada
  const cand = xs.map((x, i) => i).filter(i => j === 'lin' || xs[i] !== 0), neg = cand.filter(i => xs[i] < 0), oth = cand.filter(i => xs[i] >= 0);
  const i1 = neg.length && r.f() < .8 ? r.p(neg) : r.p(cand);
  let i2; do i2 = r.p(r.f() < .6 && oth.length ? oth : cand); while (i2 === i1);
  const [ip, iq] = [i1, i2].sort((a, b) => a - b);
  return { F, xs, ys, ip, iq, e: gxE(F) };
}
GXB.jadual = (r, j) => {
  j = j || r.p(['lin', 'kuad']);
  const D = gxTabData(r, j), { F, xs, ys, ip, iq, e } = D, yv = ys.map((y, i) => (i === ip ? 'p' : i === iq ? 'q' : y));
  const pre = j === 'sal' ? ['Ingat: x ≠ 0 bagi fungsi salingan.'] : [];
  return GEN_LQ('jadual', { e, ans: `p = ${gxN(ys[ip])}, q = ${gxN(ys[iq])}`, work: pre.concat(gxSub(F, xs[ip], 'p'), gxSub(F, xs[iq], 'q')) }, { fig: gxTabFig(xs, yv, { label: 'Jadual nilai dengan dua nilai y tidak diketahui' }), figAns: gxTabFig(xs, ys) });
};
// graf contoh bagi setiap jenis (julat paparan)
function gxShapeF(r, j) {
  if (j === 'lin') return { F: { T: [[r.p([1, 2, -1, -2]), 1], [r.i(-3, 3), 0]] }, x0: -4, x1: 4, y0: -6, y1: 6, ys: 2 };
  if (j === 'kuad') { const a = r.p([1, -1]), c = a > 0 ? r.i(-5, -1) : r.i(1, 5); return { F: { T: [[a, 2], [c, 0]] }, x0: -4, x1: 4, y0: -6, y1: 6, ys: 2 }; }
  if (j === 'kub') return { F: { T: [[r.p([1, -1]), 3], [r.i(-2, 2), 0]] }, x0: -3, x1: 3, y0: -8, y1: 8, ys: 2 };
  return { F: { rec: r.p([2, 3, 4, -2, -3, -4]) }, x0: -4, x1: 4, y0: -6, y1: 6, ys: 2 };
}
const GXJK = ['lin', 'kuad', 'kub', 'sal'];
GXB.jenisGraf = (r, j) => {
  j = j || r.p(GXJK);
  const G = gxShapeF(r, j), ans = GXJN[j], shape = gxBentuk(G.F), eq = gxE(G.F);
  const others = gxShuf(r, GXJK.filter(k => k !== j)).map(k => gxE(gxShapeF(r, k).F));
  const list = gxDan(gxShuf(r, [eq].concat(others)).map(s => `y = ${s}`));
  const ck = r.p(GXJK.filter(k => k !== j)), claim = GXJN[ck];
  return GEN_LQ('jenisGraf', { ans, shape, eq, list, claim, why: `Graf ${claim.toLowerCase()} ialah ${GXSH[ck]}, bukan seperti graf ini.`, work: [GXBW[j], `Graf ini ialah graf ${ans.toLowerCase()}.`] }, { fig: gxGraphFig(Object.assign({ label: 'Graf suatu fungsi' }, G)) });
};
function gxPersF(r, j) {
  let F;
  if (j === 'lin') F = r.p([() => ({ T: [[gxNz(r, -5, 5), 1], [gxNz(r, -9, 9), 0]] }), () => ({ T: [[gxNz(r, 1, 9), 0], [-r.i(1, 5), 1]] }), () => ({ T: [[r.i(2, 7), 1]] })])();
  if (j === 'kuad') F = r.p([() => ({ T: [[gxNz(r, -3, 3), 2], [gxNz(r, -9, 9), 0]] }), () => ({ T: [[r.i(1, 9), 0], [-1, 2]] }), () => ({ T: [[1, 2], [gxNz(r, -5, 5), 1]] })])();
  if (j === 'kub') F = r.p([() => ({ T: [[gxNz(r, -3, 3), 3], [gxNz(r, -9, 9), 0]] }), () => ({ T: [[-1, 3]] }), () => ({ T: [[r.i(1, 9), 0], [-r.i(1, 2), 3]] })])();
  if (j === 'sal') F = { rec: r.p([2, 3, 4, 5, 6, 8, 10, 12, -2, -4, -6, -8]) };
  return F;
}
GXB.jenisPers = (r, j) => {
  j = j || r.p(GXJK);
  const F = gxPersF(r, j), ans = GXJN[j], ck = r.p(GXJK.filter(k => k !== j)), claim = GXJN[ck];
  return GEN_LQ('jenisPers', { e: gxE(F), ans, claim, why: `Bagi ${claim.toLowerCase()}, ${GXKW[ck]}; ini tidak sepadan dengan y = ${gxE(F)}.`, shape: gxBentuk(F), sw: GXBW[j], work: [GXJW[j]] });
};
GXB.skala = r => {
  const [cm, k] = r.p([[2, 1], [2, 2], [2, 5], [2, 10], [1, 2], [1, 5], [2, 4]]), ax = r.p(['x', 'y']), mlt = r.i(2, 8), v = mlt * k * (r.f() < .3 ? -1 : 1);
  return GEN_LQ('skala', { cm, k, ax, v, Lv: mlt * cm, lo: -k * r.i(1, 4), hi: k * r.i(3, 8) });
};
GXB.titikPada = r => {
  const F = r.f() < .5 ? GXJF.lin(r) : GXJF.kuad(r), p = gxNz(r, -3, 4), yv = gxV(F, p), on = r.f() < .5, q = on ? yv : yv + r.p([-2, -1, 1, 2, 3]);
  const sub = gxSub(F, p, 'y');
  return GEN_LQ('titikPada', { pt: gxP(p, q), e: gxE(F), on, ans: on ? 'Ya, titik itu terletak pada graf' : 'Tidak, titik itu tidak terletak pada graf', work: [`Gantikan x = ${gxN(p)} ke dalam y = ${gxE(F)}:`].concat(sub, [on ? `y = ${gxN(q)}, sama dengan koordinat-y titik itu.` : `${gxN(yv)} ≠ ${gxN(q)}, maka titik ${gxP(p, q)} tidak terletak pada graf.`]) });
};
GXB.bacaY = (r, j) => {
  j = j || r.p(['lin', 'kuad']);
  let F, x0, x1;
  if (j === 'lin') { const a = r.p([1, 2, 3, -1, -2]), b = r.i(-3, 4); F = { T: [[a, 1], [b, 0]] }; [x0, x1] = r.p([[-1, 5], [-2, 4], [0, 6]]); }
  else { const a = r.p([1, -1]), c = a > 0 ? r.i(-5, 0) : r.i(0, 5); F = { T: [[a, 2], [c, 0]] }; [x0, x1] = [-3, 3]; }
  const vals = gxRange(x0, x1).map(x => gxV(F, x)), y0 = Math.min(0, ...vals) - 1, y1 = Math.max(0, ...vals) + 1;
  const ks = gxRange(x0, x1).filter(x => x !== 0 && x !== x0 && x !== x1), k = r.p(ks), v = gxV(F, k);
  const box = { F, x0, x1, y0, y1, ys: y1 - y0 > 12 ? 2 : 1, label: 'Graf fungsi pada satah Cartes' };
  return GEN_LQ('bacaY', { k, eqT: gxE(F), ans: `y = ${gxN(v)}`, work: [`Dari x = ${gxN(k)} pada paksi-x, lukis garis tegak hingga menyentuh graf.`, 'Dari titik itu, lukis garis mendatar ke paksi-y.', `Bacaan: y = ${gxN(v)}.`] }, { fig: gxGraphFig(box), figAns: gxGraphFig(Object.assign({}, box, { guide: [{ x: k, y: v }], pts: [{ x: k, y: v, l: gxP(k, v) }] })) });
};
GXB.bacaX = r => {
  const a = r.p([1, -1]), c = a > 0 ? r.i(-5, 0) : r.i(0, 5), F = { T: [[a, 2], [c, 0]] }, s = r.i(1, 3), v = gxV(F, s);
  const vals = gxRange(-3, 3).map(x => gxV(F, x)), y0 = Math.min(0, ...vals) - 1, y1 = Math.max(0, ...vals) + 1;
  const box = { F, x0: -3, x1: 3, y0, y1, ys: y1 - y0 > 12 ? 2 : 1, label: 'Graf fungsi kuadratik' }, ans = `x = −${s} atau x = ${s}`;
  return GEN_LQ('bacaX', { v, s, eqT: gxE(F), ans, work: [`Lukis garis mendatar y = ${gxN(v)}.`, `Garis itu memotong graf pada dua titik: x = −${s} dan x = ${s}.`] }, { fig: gxGraphFig(box), figAns: gxGraphFig(Object.assign({}, box, { guide: [{ x: -s, y: v }, { x: s, y: v }], pts: [{ x: -s, y: v }, { x: s, y: v }] })) });
};
GXB.titikK = r => {
  const a = r.p([2, 3, 4, -2, -3]), b = gxNz(r, -9, 9), FL = { T: [[a, 1], [b, 0]] }, h = gxNz(r, -5, 6);
  const FQ = { T: [[r.p([1, 2, -1, 3]), 2], [gxNz(r, -9, 9), 0]] }, m = r.p([-3, -2, -1, 2, 3]);
  const eL = { toString: () => gxE(FL), F: FL }, eQ = { toString: () => gxE(FQ), F: FQ };
  return GEN_LQ('titikK', { h, v: gxV(FL, h), eL, m, eQ });
};
GXB.lukis = (r, j) => {
  j = j || r.p(['lin', 'kuad', 'kuad', 'kub']);
  const F = j === 'lin' ? { T: [[r.p([2, 3, -2]), 1], [r.i(-4, 4), 0]] } : j === 'kuad' ? { T: [[r.p([1, 2, -1]), 2], [r.i(-4, 4), 0]] } : { T: [[1, 3], [r.i(-4, 4), 0]] };
  const xs = j === 'kub' ? gxRange(-3, 3) : j === 'kuad' ? gxRange(-3, 3) : gxRange(-2, 3), ys = xs.map(x => gxV(F, x));
  const miss = gxShuf(r, xs.map((x, i) => i).filter(i => xs[i] !== 0)).slice(0, 3).sort((a, b) => a - b);
  const rng = Math.max(...ys) - Math.min(...ys), yst = rng > 40 ? 10 : rng > 16 ? 5 : rng > 8 ? 2 : 1;
  const y0 = Math.floor(Math.min(0, ...ys) / yst) * yst, y1 = Math.ceil(Math.max(0, ...ys) / yst) * yst;
  const e = gxE(F);
  return GEN_LQ('lukis', { e, ys: yst, lo: xs[0], hi: xs[xs.length - 1], ans: miss.map(i => `x = ${gxN(xs[i])}: y = ${gxN(ys[i])}`).join('; ') + '. Graf ialah ' + gxBentuk(F).toLowerCase() + ' yang melalui semua titik dalam jadual.', work: [].concat(...miss.map(i => gxSub(F, xs[i], `x = ${gxN(xs[i])}: y`))).concat(['Plot semua titik (x, y), kemudian sambungkan dengan ' + (j === 'lin' ? 'garis lurus.' : 'lengkung licin.')]) },
    { kind: 'lukis', fig: gxTabFig(xs, ys.map((y, i) => (miss.includes(i) ? '' : y)), { label: 'Jadual nilai untuk dilengkapkan' }), figAns: gxGraphFig({ F, x0: xs[0], x1: xs[xs.length - 1], y0, y1, ys: yst, eq: `y = ${gxE(F, false)}`, pts: xs.map((x, i) => ({ x, y: ys[i] })), label: 'Graf yang dilukis' }) });
};
GXB.k82 = r => GEN_LQ('k82', (() => { const a2 = r.p([1, 2, 3, -1, -2]), c2 = gxNz(r, -6, 6), m = r.i(1, 3); return { a2, c2, m, v2: a2 * m * m + c2, a: r.p([2, 3, -2, 4]), c: gxNz(r, -6, 6), n: gxNz(r, -4, 5), c3: gxNz(r, -6, 6), a3: r.p([1, 2, 3]), s: r.i(1, 4), c4: gxNz(r, -9, 9) }; })());

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '8.1': {
    m: [() => GXB.jenisHub(GXRG), () => GXB.fungsiYT(GXRG), () => GXB.objImej(GXRG), () => GXB.cariFk(GXRG), () => GXB.mesin(GXRG), () => GXB.tatatanda(GXRG)],
    s: [() => GXB.cariObj(GXRG), () => GXB.fNonLin(GXRG), () => GXB.pasTertib(GXRG), () => GXB.bersandar(GXRG), () => GXB.objKuasa(GXRG), () => GXB.objImej(GXRG, 'kuasa')],
    k: [() => GXB.k81(GXRG)]
  },
  '8.2': {
    m: [() => GXB.jadual(GXRG, 'lin'), () => GXB.jadual(GXRG, 'kuad'), () => GXB.jenisGraf(GXRG), () => GXB.jenisPers(GXRG), () => GXB.skala(GXRG), () => GXB.titikPada(GXRG)],
    s: [() => GXB.jadual(GXRG, 'kub'), () => GXB.jadual(GXRG, 'sal'), () => GXB.bacaY(GXRG), () => GXB.bacaX(GXRG), () => GXB.titikK(GXRG), () => GXB.lukis(GXRG)],
    k: [() => GXB.k82(GXRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
const GXHUB = ['ss', 'sb', 'bs', 'bb'], GXFN = ['ss', 'sb', 'tiada', 'bs', 'bb'];
// 8.1
WG.jenisHub = i => GXB.jenisHub(GXRW, GXHUB[i % 4]);
WG.fungsiYT = i => GXB.fungsiYT(GXRW, GXFN[i % 5]);
WG.objImej = i => GXB.objImej(GXRW, ['tambah', 'darab', 'tolak'][i % 3]);
WG.cariFk = () => GXB.cariFk(GXRW);
WG.mesin = () => GXB.mesin(GXRW);
WG.tatatanda = i => GXB.tatatanda(GXRW, ['tambah', 'darab', 'kuasa', 'tolak'][i % 4]);
WG.cariObj = () => GXB.cariObj(GXRW);
WG.fNonLin = () => GXB.fNonLin(GXRW);
WG.pasTertib = i => GXB.pasTertib(GXRW, ['bs', 'sb', 'ss', 'bb'][i % 4]);
WG.bersandar = i => GXB.bersandar(GXRW, [0, 5, 2, 7][i % 4] + wri(0, 1));
WG.objKuasa = () => GXB.objKuasa(GXRW);
WG.k81 = () => GXB.k81(GXRW);
// 8.2
WG.jadLin = () => GXB.jadual(GXRW, 'lin');
WG.jadKuad = () => GXB.jadual(GXRW, 'kuad');
WG.jenisGraf = i => GXB.jenisGraf(GXRW, GXJK[i % 4]);
WG.jenisPers = i => GXB.jenisPers(GXRW, GXJK[(i + 2) % 4]);
WG.skala = () => GXB.skala(GXRW);
WG.titikPada = () => GXB.titikPada(GXRW);
WG.jadKub = () => GXB.jadual(GXRW, 'kub');
WG.jadSal = () => GXB.jadual(GXRW, 'sal');
WG.bacaY = i => GXB.bacaY(GXRW, i % 2 ? 'kuad' : 'lin');
WG.bacaX = () => GXB.bacaX(GXRW);
WG.titikK = () => GXB.titikK(GXRW);
WG.lukis = () => GXB.lukis(GXRW, 'kuad');
WG.k82 = () => GXB.k82(GXRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '8.1': [['m', 'jenisHub', 4], ['m', 'fungsiYT', 3], ['m', 'objImej', 3], ['m', 'cariFk', 3], ['m', 'mesin', 3], ['m', 'tatatanda', 2], ['s', 'cariObj', 2], ['s', 'fNonLin', 2], ['s', 'pasTertib', 2], ['s', 'bersandar', 2], ['s', 'objKuasa', 1], ['k', 'k81', 3]],
  '8.2': [['m', 'jadLin', 4], ['m', 'jadKuad', 4], ['m', 'jenisGraf', 3], ['m', 'jenisPers', 3], ['m', 'skala', 2], ['m', 'titikPada', 2], ['s', 'jadKub', 2], ['s', 'jadSal', 2], ['s', 'bacaY', 2], ['s', 'bacaX', 1], ['s', 'titikK', 1], ['s', 'lukis', 1], ['k', 'k82', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan nombor: jawapan + calon kesilapan biasa (unik, boleh negatif)
function gxOptsN(ans, cands, f = gxN) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!isFinite(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const s = f(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2)); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function gxOptsT(ans, cands) {
  const w = shuffle(cands.filter((c, i, a) => c !== ans && a.indexOf(c) === i)).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const gxMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const GXHUBN = Object.keys(GXTN).map(k => vcap(GXTN[k]));
const GXFS = ['Fungsi, kerana setiap objek ada tepat satu imej', 'Bukan fungsi, kerana ada objek yang mempunyai dua imej', 'Bukan fungsi, kerana ada objek yang tiada imej', 'Bukan fungsi, kerana ada imej yang mempunyai dua objek'];
const CQGEN = {
  hubungan: [
    () => { const rel = gxRel(GXRG, pick(['ss', 'sb', 'bs', 'bb'])), inf = gxInfo(rel); return gxMcq('Apakah jenis hubungan ini?', gxArrowFig(rel.P, rel.Q, rel.pairs), gxOptsT(vcap(GXTN[inf.t]), GXHUBN)); },
    () => { const rel = gxRel(GXRG, pick(['ss', 'bs', 'sb', 'bb', 'tiada'])), inf = gxInfo(rel), ans = inf.fn ? GXFS[0] : inf.t === 'tiada' ? GXFS[2] : GXFS[1]; return gxMcq('Pernyataan manakah yang <b>betul</b> tentang hubungan ini?', gxArrowFig(rel.P, rel.Q, rel.pairs), gxOptsT(ans, GXFS)); },
    () => {
      if (Math.random() < .5) { const s = ri(2, 4), P = [-s, -1, 1, s].sort((a, b) => a - b), Q = [1, s * s], fig = gxArrowFig(P, Q, P.map((x, i) => [i, Q.indexOf(x * x)]), { A: 'x', B: 'f(x)', rule: 'f : x → x²' }); return gxMcq(`Bagi fungsi f : x → x², apakah objek bagi ${s * s}?`, fig, gxOptsT(`−${s} dan ${s}`, [`${s} sahaja`, `−${s} sahaja`, `${s ** 4}`, `${2 * s}`])); }
      const rel = gxRel(GXRG, pick(['ss', 'sb', 'bs', 'bb'])), inf = gxInfo(rel), S = gxPairs(rel);
      return gxMcq('Pasangan bertertib ini mewakili hubungan jenis apa?', gxTextFig(S), gxOptsT(vcap(GXTN[inf.t]), GXHUBN));
    }
  ],
  nilaiF: [
    () => { const a = ri(2, 5), b = ri(1, 9), k = ri(1, 5), F = { T: [[a, 1], [b, 0]] }; return gxMcq(`f(x) = ${gxE(F)}. Cari f(${k}).`, gxMachFig(k, [gxE(F, false)]), gxOptsN(a * k + b, [a + k + b, a * k, a * (k + b), a * k - b])); },
    () => {
      if (Math.random() < .5) { const a = pick([2, 3, 4, -2, -3]), b = nz(-9, 9), k = ri(-5, -1), F = { T: [[a, 1], [b, 0]] }, v = gxV(F, k); return gxMcq(`f(x) = ${gxE(F)}. Cari f(${gxN(k)}).`, gxMachFig(gxN(k), [gxE(F, false)]), gxOptsN(v, [-a * k + b, a * k - b, a + k + b, -v])); }
      const a = ri(2, 5), b = ri(1, 9), k = ri(1, 9), add = Math.random() < .5; const v = add ? a * k + b : (k + b) * a;
      return gxMcq(`Apakah output mesin fungsi ini?`, gxMachFig(k, add ? [`× ${a}`, `+ ${b}`] : [`+ ${b}`, `× ${a}`]), gxOptsN(v, [add ? (k + b) * a : a * k + b, a * k, k + b + a, v + a]));
    },
    () => {
      if (Math.random() < .5) { const a = pick([2, 3, 4, 5]), b = nz(-9, 9), k = nz(-5, 7), F = { T: [[a, 1], [b, 0]] }, v = gxV(F, k); return gxMcq(`f(x) = ${gxE(F)} dan f(k) = ${gxN(v)}. Cari k.`, gxMachFig('?', [gxE(F, false)], gxN(v)), gxOptsN(k, [(v + b) / a, v - b, a * v + b, -k])); }
      const a = pick([1, 2, -1]), c = nz(-6, 6), k = pick([-3, -2]), F = { T: [[a, 2], [c, 0]] }, v = gxV(F, k);
      return gxMcq(`f(x) = ${gxE(F)}. Cari f(${gxN(k)}).`, gxMachFig(gxN(k), [gxE(F, false)]), gxOptsN(v, [-a * k * k + c, 2 * a * k + c, a * k * k - c, a * 2 * k * k + c]));
    }
  ],
  jadual: [
    () => { const D = gxTabData(GXRG, 'lin'), i = D.xs.findIndex(x => x > 0), { xs, ys, F } = D, a = F.T[0][0], b = F.T[1][0], k = Math.max(i, 0) + ri(0, xs.length - 1 - Math.max(i, 0)); return gxMcq(`Jadual nilai bagi y = ${D.e}. Apakah nilai y yang hilang?`, gxTabFig(xs, ys.map((y, t) => (t === k ? '?' : y))), gxOptsN(ys[k], [ys[k] + 1, ys[k] - 1, ys[k] + a, a + xs[k] + b, -ys[k]])); },
    () => { const a = pick([1, 2, -1]), c = nz(-5, 5), F = { T: [[a, 2], [c, 0]] }, xs = gxRange(-3, 3), ys = xs.map(x => gxV(F, x)), k = pick([0, 1, 2]), x = xs[k]; return gxMcq(`Jadual nilai bagi y = ${gxE(F)}. Apakah nilai y yang hilang?`, gxTabFig(xs, ys.map((y, t) => (t === k ? '?' : y))), gxOptsN(ys[k], [-a * x * x + c, 2 * a * x + c, a * x * x - c, ys[k] + 1])); },
    () => {
      if (Math.random() < .5) { const a = pick([1, -1, 2]), c = nz(-5, 5), F = { T: [[a, 3], [c, 0]] }, xs = gxRange(-2, 2), ys = xs.map(x => gxV(F, x)), k = pick([0, 1]), x = xs[k]; return gxMcq(`Jadual nilai bagi y = ${gxE(F)}. Apakah nilai y yang hilang?`, gxTabFig(xs, ys.map((y, t) => (t === k ? '?' : y))), gxOptsN(ys[k], [-a * x * x * x + c, 3 * a * x + c, a * x * x + c, a * x * x * x - c])); }
      const D = gxTabData(GXRG, 'sal'), { xs, ys, F } = D, neg = xs.map((x, i) => i).filter(i => xs[i] < 0), k = pick(neg);
      return gxMcq(`Jadual nilai bagi y = ${D.e}. Apakah nilai y yang hilang?`, gxTabFig(xs, ys.map((y, t) => (t === k ? '?' : y))), gxOptsN(ys[k], [-ys[k], F.rec * xs[k], F.rec + xs[k], ys[k] / 2]));
    }
  ],
  graf: [
    () => { const j = pick(GXJK), G = gxShapeF(GXRG, j); return gxMcq('Apakah jenis fungsi bagi graf ini?', gxGraphFig(G), gxOptsT(GXJN[j], GXJK.map(k => GXJN[k]))); },
    () => {
      if (Math.random() < .5) { const j = pick(GXJK), F = gxPersF(GXRG, j); return gxMcq('Apakah jenis fungsi ini?', gxCardFig(F), gxOptsT(GXJN[j], GXJK.map(k => GXJN[k]))); }
      const a = pick([1, 2, -1, -2]), b = ri(-2, 3), F = { T: [[a, 1], [b, 0]] }, x0 = -1, x1 = 4, vals = gxRange(x0, x1).map(x => gxV(F, x)), y0 = Math.min(0, ...vals) - 1, y1 = Math.max(0, ...vals) + 1, k = ri(1, 3), v = gxV(F, k);
      const box = { F, x0, x1, y0, y1, ys: y1 - y0 > 12 ? 2 : 1 };
      return gxMcq(`Daripada graf, apakah nilai y apabila x = ${k}?`, gxGraphFig(box), gxOptsN(v, [v + 1, v - 1, k, v + a, -v]), gxGraphFig(Object.assign({}, box, { only: true, guide: [{ x: k, y: v }], pts: [{ x: k, y: v }] })));
    },
    () => {
      if (Math.random() < .5) {
        const a = pick([1, -1]), c = a > 0 ? ri(-5, 0) : ri(0, 5), F = { T: [[a, 2], [c, 0]] }, s = ri(1, 3), v = gxV(F, s), vals = gxRange(-3, 3).map(x => gxV(F, x)), y0 = Math.min(0, ...vals) - 1, y1 = Math.max(0, ...vals) + 1;
        const box = { F, x0: -3, x1: 3, y0, y1, ys: y1 - y0 > 12 ? 2 : 1 };
        return gxMcq(`Daripada graf, cari nilai-nilai x apabila y = ${gxN(v)}.`, gxGraphFig(box), gxOptsT(`x = −${s} dan x = ${s}`, [`x = ${s} sahaja`, `x = −${s} sahaja`, `x = ${gxN(v)}`, `x = 0 dan x = ${s}`]), gxGraphFig(Object.assign({}, box, { only: true, guide: [{ x: -s, y: v }, { x: s, y: v }], pts: [{ x: -s, y: v }, { x: s, y: v }] })));
      }
      const j = pick(GXJK), G = gxShapeF(GXRG, j), eq = 'y = ' + gxE(G.F);
      return gxMcq('Persamaan manakah yang mungkin mewakili graf ini?', gxGraphFig(G), gxOptsT(eq, GXJK.filter(k => k !== j).map(k => 'y = ' + gxE(gxShapeF(GXRG, k).F))));
    }
  ]
};
const CQT = { hubungan: 'Hubungan & fungsi', nilaiF: 'Nilai fungsi', jadual: 'Jadual nilai', graf: 'Jenis & bacaan graf' };
function gxCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.hubungan;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['hubungan', 'nilaiF', 'nilaiF', 'jadual', 'graf'] : Object.keys(CQT);
  return gxCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return gxCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
