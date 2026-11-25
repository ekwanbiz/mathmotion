'use strict';
/* =================== KETAKSAMAAN · SOALAN BAB 6 KETAKSAMAAN LINEAR DALAM DUA PEMBOLEH UBAH (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "kt" / "KT" supaya tidak bertembung dengan teras.
// Ketaksamaan disimpan sebagai separuh satah h = { A, B, C, op } yang bermaksud A x + B y op C.

/* =================== pembantu asas =================== */
const KTOP = { '<': '&lt;', '>': '&gt;', '<=': '≤', '>=': '≥' };
const KTFLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };          // terbalikkan arah (darab dengan negatif)
const KTSTRICT = { '<': '<=', '<=': '<', '>': '>=', '>=': '>' };        // tukar jenis garis
const ktIsBig = op => op === '>' || op === '>=';
const ktIsStrict = op => op === '<' || op === '>';
const ktCmp = (v, op, c) => (op === '<' ? v < c : op === '>' ? v > c : op === '<=' ? v <= c : v >= c);
const ktH = (A, B, C, op) => ({ A, B, C, op });
const ktHolds = (h, x, y) => ktCmp(h.A * x + h.B * y, h.op, h.C);
const ktOn = (h, x, y) => h.A * x + h.B * y === h.C;
const ktGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// rawak: ktRG untuk Latihan Kelas / games, ktRW (berbenih) untuk Lembaran Kerja
const ktRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const ktRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const ktShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ktDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);

/* ---------- teks ungkapan ---------- */
// sebutan k·v : first = sebutan pertama
const ktTerm = (k, v, first) => {
  if (!k) return '';
  const s = Math.abs(k) === 1 ? v : Math.abs(k) + v;
  return first ? (k < 0 ? '−' : '') + s : (k < 0 ? ' − ' : ' + ') + s;
};
const ktLHS = (A, B) => (A ? ktTerm(A, 'x', true) + ktTerm(B, 'y', false) : ktTerm(B, 'y', true));
const ktRhs = (m, c) => (m === 0 ? fmt(c) : ktTerm(m, 'x', true) + (c ? (c < 0 ? ' − ' : ' + ') + Math.abs(c) : ''));
const ktStd = h => `${ktLHS(h.A, h.B)} ${KTOP[h.op]} ${fmt(h.C)}`;           // 2x + 3y ≤ 12
const ktYf = (m, c, op) => `y ${KTOP[op]} ${ktRhs(m, c)}`;                   // y > 2x + 1
const ktYH = (m, c, op) => ktH(-m, 1, c, op);                               // y op mx + c
const ktXH = (a, op) => ktH(1, 0, a, op);                                   // x op a
// persamaan garis sempadan
const ktEq = h => {
  if (h.B === 0) return `x = ${fmt(h.C / h.A)}`;
  if (h.A === 0) return `y = ${fmt(h.C / h.B)}`;
  if (h.A % h.B === 0 && h.C % h.B === 0) return `y = ${ktRhs(-h.A / h.B, h.C / h.B)}`;
  return `${ktLHS(h.A, h.B)} = ${fmt(h.C)}`;
};
// teks ketaksamaan dalam bentuk paling semula jadi (y … mx + c jika boleh)
const ktTxt = h => {
  if (h.B === 0) return `x ${KTOP[h.A > 0 ? h.op : KTFLIP[h.op]]} ${fmt(h.C / h.A)}`;
  if (h.B === 1) return h.A === 0 ? `y ${KTOP[h.op]} ${fmt(h.C)}` : ktYf(-h.A, h.C, h.op);
  return ktStd(h);
};
const ktSide = h => {
  if (h.B === 0) return ktIsBig(h.op) !== (h.A < 0) ? 'kanan' : 'kiri';
  return ktIsBig(h.op) !== (h.B < 0) ? 'atas' : 'bawah';
};
const ktSideTxt = s => (s === 'atas' || s === 'bawah' ? `di ${s} garis` : `di sebelah ${s} garis`);
const ktGaris = op => (ktIsStrict(op) ? 'garis putus-putus' : 'garis padu');
const ktBenar = b => (b ? 'benar' : 'palsu');
const ktCek = b => (b ? '✓' : '✗');
// gantian: "2(3) + 3(−1) = 3"
const ktSub = (h, x, y) => {
  const t = (k, v, first) => { if (!k) return ''; const s = (Math.abs(k) === 1 ? '' : Math.abs(k)) + `(${fmt(v)})`; return first ? (k < 0 ? '−' : '') + s : (k < 0 ? ' − ' : ' + ') + s; };
  return (h.A ? t(h.A, x, true) + t(h.B, y, false) : t(h.B, y, true)) + ` = ${fmt(h.A * x + h.B * y)}`;
};
// semakan satu titik pada satu ketaksamaan (teks jalan kerja)
const ktWChk = (h, x, y) => {
  const v = h.A * x + h.B * y, ok = ktHolds(h, x, y);
  return `${ktStd(h)}: ${ktSub(h, x, y)}, ${fmt(v)} ${KTOP[h.op]} ${fmt(h.C)} ${ktBenar(ok)} ${ktCek(ok)}`;
};

/* =================== rajah satah Cartes =================== */
// klip poligon kepada separuh satah (sempadan disertakan)
function ktClip(poly, h) {
  const s = ktIsBig(h.op) ? -1 : 1, f = p => (h.A * p[0] + h.B * p[1] - h.C) * s, out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], fp = f(p), fq = f(q);
    if (fp <= 1e-9) out.push(p);
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) { const t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
  }
  return out;
}
const ktArea = p => Math.abs(p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2;
const ktRegion = (hs, b) => hs.reduce((poly, h) => (poly.length ? ktClip(poly, h) : poly), [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]]);
// hujung garis sempadan dalam kotak
function ktSeg(h, b) {
  if (h.B === 0) { const x = h.C / h.A; return x >= b.x0 && x <= b.x1 ? [[x, b.y0], [x, b.y1]] : null; }
  const p = [b.x0, (h.C - h.A * b.x0) / h.B], q = [b.x1, (h.C - h.A * b.x1) / h.B], dx = q[0] - p[0], dy = q[1] - p[1];
  let t0 = 0, t1 = 1;
  if (dy !== 0) { let a = (b.y0 - p[1]) / dy, c = (b.y1 - p[1]) / dy; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); }
  else if (p[1] < b.y0 || p[1] > b.y1) return null;
  if (t1 <= t0) return null;
  return [[p[0] + t0 * dx, p[1] + t0 * dy], [p[0] + t1 * dx, p[1] + t1 * dy]];
}
const ktN = v => +v.toFixed(1);
// o = { box, hs:[{h, c, lab}], shade:'common'|'each'|'none', sc, pts:[{x, y, l, c}], label, blank }
function ktFig(o) {
  const b = o.box || { x0: -5, x1: 5, y0: -5, y1: 5 }, nx = b.x1 - b.x0, ny = b.y1 - b.y0;
  const u = o.u || Math.min(36, 400 / Math.max(nx, ny)), pad = 28, W = nx * u + pad * 2, H = ny * u + pad * 2;
  const X = x => ktN(pad + (x - b.x0) * u), Y = y => ktN(pad + (b.y1 - y) * u);
  const st = nx <= 13 && ny <= 13 ? 1 : nx <= 26 && ny <= 26 ? 2 : 5, gs = nx > 26 || ny > 26 ? st : 1;
  let s = '';
  for (let x = Math.ceil(b.x0 / gs) * gs; x <= b.x1; x += gs) s += `<line x1="${X(x)}" y1="${Y(b.y0)}" x2="${X(x)}" y2="${Y(b.y1)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  for (let y = Math.ceil(b.y0 / gs) * gs; y <= b.y1; y += gs) s += `<line x1="${X(b.x0)}" y1="${Y(y)}" x2="${X(b.x1)}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.5"/>`;
  const hs = o.hs || [];
  if (!o.blank) {
    if (o.shade === 'each') hs.forEach(e => { const p = ktRegion([e.h], b); if (p.length > 2) s += `<polygon points="${p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" style="fill:var(--${e.c || 'tr'});fill-opacity:.16"/>`; });
    if (o.shade !== 'none' && o.shade !== 'each') { const p = ktRegion(hs.map(e => e.h), b); if (p.length > 2) s += `<polygon points="${p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" style="fill:var(--${o.sc || 'pk'});fill-opacity:.34"/>`; }
  }
  // paksi
  const ax = b.y0 <= 0 && b.y1 >= 0 ? 0 : b.y0, ay = b.x0 <= 0 && b.x1 >= 0 ? 0 : b.x0;
  s += `<line x1="${X(b.x0)}" y1="${Y(ax)}" x2="${X(b.x1) + 8}" y2="${Y(ax)}" style="stroke:var(--mu)" stroke-width="2.5"/><line x1="${X(ay)}" y1="${Y(b.y0)}" x2="${X(ay)}" y2="${Y(b.y1) - 8}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
  s += `<text x="${X(b.x1) + 4}" y="${Y(ax) - 10}" style="fill:var(--mu)" font-size="16" font-style="italic" font-weight="700" text-anchor="middle">x</text><text x="${X(ay) + 12}" y="${Y(b.y1) - 6}" style="fill:var(--mu)" font-size="16" font-style="italic" font-weight="700" text-anchor="middle">y</text>`;
  for (let x = Math.ceil(b.x0 / st) * st; x <= b.x1; x += st) if (x !== ay && x !== b.x1) s += `<text x="${X(x)}" y="${Y(ax) + 18}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="middle">${fmt(x)}</text>`;
  for (let y = Math.ceil(b.y0 / st) * st; y <= b.y1; y += st) if (y !== ax && y !== b.y1) s += `<text x="${X(ay) - 7}" y="${Y(y) + 5}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="end">${fmt(y)}</text>`;
  if (ay === 0 && ax === 0) s += `<text x="${X(0) - 7}" y="${Y(0) + 18}" style="fill:var(--mu)" font-size="13" font-weight="600" text-anchor="end">0</text>`;
  // garis sempadan
  if (!o.blank) hs.forEach(e => {
    const g = ktSeg(e.h, b); if (!g) return;
    const c = `var(--${e.c || 'am'})`;
    s += `<line x1="${X(g[0][0])}" y1="${Y(g[0][1])}" x2="${X(g[1][0])}" y2="${Y(g[1][1])}" style="stroke:${c}" stroke-width="4"${ktIsStrict(e.h.op) ? ' stroke-dasharray="10 7"' : ' stroke-linecap="round"'}/>`;
    if (e.lab) {
      // label dekat hujung atas/kanan garis, di dalam kotak
      const k = e.at == null ? .84 : e.at, px = g[0][0] + (g[1][0] - g[0][0]) * k, py = g[0][1] + (g[1][1] - g[0][1]) * k;
      const right = px < (b.x0 + b.x1) / 2;
      s += `<text x="${ktN(X(px) + (right ? 8 : -8))}" y="${ktN(Y(py) - 8)}" style="fill:${c};paint-order:stroke;stroke:var(--diag, var(--nav));stroke-width:5px;stroke-linejoin:round" font-size="16" font-weight="700" font-style="italic" text-anchor="${right ? 'start' : 'end'}">${e.lab}</text>`;
    }
  });
  (o.pts || []).forEach(p => {
    const c = `var(--${p.c || 'tx'})`, right = p.x > (b.x0 + b.x1) / 2, top = p.y >= b.y1 - .8;
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="6.5" style="fill:${c};stroke:var(--nav)" stroke-width="2"/>`;
    if (p.l) s += `<text x="${X(p.x) + (right ? -10 : 10)}" y="${Y(p.y) + (top ? 22 : -10)}" style="fill:${c};paint-order:stroke;stroke:var(--diag, var(--nav));stroke-width:5px;stroke-linejoin:round" font-family="Space Grotesk, sans-serif" font-size="17" font-weight="700" text-anchor="${right ? 'end' : 'start'}">${p.l}</text>`;
  });
  return `<svg viewBox="0 0 ${ktN(W)} ${ktN(H)}" role="img" aria-label="${esc(o.label || 'Satah Cartes')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// kotak yang memuatkan titik-titik penting
function ktBox(xs, ys, m = 1, min = 8) {
  let x0 = Math.min(0, ...xs) - m, x1 = Math.max(0, ...xs) + m, y0 = Math.min(0, ...ys) - m, y1 = Math.max(0, ...ys) + m;
  while (x1 - x0 < min) { x1++; if (x1 - x0 < min) x0--; }
  while (y1 - y0 < min) { y1++; if (y1 - y0 < min) y0--; }
  return { x0, x1, y0, y1 };
}
// pintasan garis (untuk jalan kerja)
const ktIntc = h => {
  const r = [];
  if (h.B !== 0 && h.C % h.B === 0) r.push([0, h.C / h.B]);
  if (h.A !== 0 && h.C % h.A === 0) r.push([h.C / h.A, 0]);
  return r;
};

// dua titik integer pada garis (utamakan pintasan) untuk melukis garis
const ktTwo = h => {
  const out = ktIntc(h).filter(p => Math.abs(p[0]) <= 6 && Math.abs(p[1]) <= 6);
  for (let x = 0; out.length < 2 && x <= 6; x = x > 0 ? -x : -x + 1) {
    if (h.B !== 0 && (h.C - h.A * x) % h.B === 0) { const y = (h.C - h.A * x) / h.B; if (Math.abs(y) <= 6 && !out.some(p => p[0] === x && p[1] === y)) out.push([x, y]); }
    if (h.B === 0 && x === 0) { out.push([h.C / h.A, 0], [h.C / h.A, 2]); }
  }
  return out.slice(0, 2);
};

/* =================== data bersama =================== */
const KTFRASA = [['tidak melebihi', '<='], ['selebih-lebihnya', '<='], ['paling banyak', '<='], ['sekurang-kurangnya', '>='], ['tidak kurang daripada', '>='], ['kurang daripada', '<'], ['lebih daripada', '>'], ['melebihi', '>']];
// kesilapan biasa: simbol yang sering tertukar
const KTSALAH = { '<=': '<', '>=': '>', '<': '<=', '>': '>=' };
// konteks 6.1: s = situasi, t = jumlah; p, q pekali
const KTCTX1 = [
  { s: (p, q) => `Harga sebatang pen ialah RM${p} dan harga sebuah buku nota ialah RM${q}. ${vnama()} membeli x batang pen dan y buah buku nota.`, t: (f, n) => `Jumlah wang yang dibelanjakan ${f} RM${n}.`, p: [1, 2, 3], q: [3, 4, 5, 6] },
  { s: (p, q) => `Sebiji kek cawan berharga RM${p} dan sebuku roti berharga RM${q}. Sebuah gerai menjual x biji kek cawan dan y buku roti dalam sehari.`, t: (f, n) => `Jumlah jualan sehari ${f} RM${n}.`, p: [2, 3, 4], q: [3, 5, 6] },
  { s: (p, q) => `Jisim sebuah kotak A ialah ${p} kg dan jisim sebuah kotak B ialah ${q} kg. Sebuah lif membawa x kotak A dan y kotak B.`, t: (f, n) => `Jumlah jisim kotak ${f} ${n} kg.`, p: [5, 8, 10, 12], q: [15, 20, 25] },
  { s: (p, q) => `${vnama()} mengambil ${p} minit untuk menjawab satu soalan objektif dan ${q} minit untuk satu soalan struktur. Dia menjawab x soalan objektif dan y soalan struktur.`, t: (f, n) => `Jumlah masa yang diambil ${f} ${n} minit.`, p: [1, 2], q: [4, 5, 6] },
  { s: (p, q) => `Harga sekeping tiket dewasa ialah RM${p} dan harga sekeping tiket kanak-kanak ialah RM${q}. Sebanyak x keping tiket dewasa dan y keping tiket kanak-kanak dijual.`, t: (f, n) => `Jumlah kutipan jualan tiket ${f} RM${n}.`, p: [10, 12, 15], q: [5, 6, 8] },
  { s: (p, q) => `Dalam satu kuiz, setiap jawapan betul diberi ${p} markah dan setiap soalan bonus diberi ${q} markah. Sebuah pasukan menjawab x soalan dengan betul dan y soalan bonus.`, t: (f, n) => `Jumlah markah pasukan itu ${f} ${n}.`, p: [2, 3, 5], q: [4, 10] },
  { s: () => 'Sebuah kelab mempunyai x orang ahli lelaki dan y orang ahli perempuan.', t: (f, n) => `Jumlah ahli kelab ${f} ${n} orang.`, p: [1], q: [1] }
];
// konteks 6.2: X, Y = nama barang (bilangan x dan y)
const KTCTX2 = [
  { X: 'kerusi', Y: 'meja', intro: 'Sebuah kedai perabot menjual x buah kerusi dan y buah meja dalam sebulan.' },
  { X: 'bola sepak', Y: 'bola jaring', intro: 'Sebuah kelab sukan membeli x biji bola sepak dan y biji bola jaring.' },
  { X: 'murid lelaki', Y: 'murid perempuan', intro: 'Sebuah bas rombongan membawa x orang murid lelaki dan y orang murid perempuan.' },
  { X: 'kek', Y: 'roti', intro: 'Sebuah kedai bakeri menghasilkan x biji kek dan y buku roti sehari.' },
  { X: 'buku cerita', Y: 'buku rujukan', intro: 'Pusat sumber sekolah membeli x buah buku cerita dan y buah buku rujukan.' },
  { X: 'ayam', Y: 'itik', intro: 'Seorang penternak memelihara x ekor ayam dan y ekor itik.' },
  { X: 'pokok bunga', Y: 'pokok sayur', intro: 'Kelab Rakan Alam menanam x pasu pokok bunga dan y pasu pokok sayur.' }
];
// hubungan dua pemboleh ubah: [teks(X, Y, k), ketaksamaan h, teks salah biasa, sebab]
const ktRel = (r, X, Y) => {
  const k = r.p([2, 3, 4]), n = r.p([20, 25, 30, 40, 50, 60]), [a, b] = r.p([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5]]);
  return r.p([
    () => [`Bilangan ${X} sekurang-kurangnya ${k} kali bilangan ${Y}.`, ktH(1, -k, 0, '>='), `${k}x ≥ y`, `"${X} sekurang-kurangnya ${k} kali ${Y}" bermaksud x ≥ ${k}y.`],
    () => [`Bilangan ${X} selebih-lebihnya ${k} kali bilangan ${Y}.`, ktH(1, -k, 0, '<='), `${k}x ≤ y`, `"${X} selebih-lebihnya ${k} kali ${Y}" bermaksud x ≤ ${k}y.`],
    () => [`Bilangan ${Y} melebihi ${k} kali bilangan ${X}.`, ktH(-k, 1, 0, '>'), `y ≥ ${k}x`, `"Melebihi" bermaksud lebih daripada, iaitu simbol &gt;, maka y &gt; ${k}x.`],
    () => [`Bilangan ${Y} kurang daripada ${k} kali bilangan ${X}.`, ktH(-k, 1, 0, '<'), `${k}y &lt; x`, `"${Y} kurang daripada ${k} kali ${X}" bermaksud y &lt; ${k}x.`],
    () => [`Bilangan ${X} melebihi bilangan ${Y} sekurang-kurangnya ${k + 2}.`, ktH(1, -1, k + 2, '>='), `y − x ≥ ${k + 2}`, `Beza x − y mestilah sekurang-kurangnya ${k + 2}, maka x − y ≥ ${k + 2}.`],
    () => [`Bilangan ${X} melebihi bilangan ${Y} selebih-lebihnya ${k + 2}.`, ktH(1, -1, k + 2, '<='), `x − y ≥ ${k + 2}`, `"Selebih-lebihnya" bermaksud ≤, maka x − y ≤ ${k + 2}.`],
    () => [`Jumlah ${X} dan ${Y} tidak melebihi ${n}.`, ktH(1, 1, n, '<='), `x + y &lt; ${n}`, `"Tidak melebihi" bermaksud ≤ (boleh sama dengan ${n}).`],
    () => [`Jumlah ${X} dan ${Y} sekurang-kurangnya ${n}.`, ktH(1, 1, n, '>='), `x + y &gt; ${n}`, `"Sekurang-kurangnya" bermaksud ≥ (boleh sama dengan ${n}).`],
    () => [`Nisbah bilangan ${X} kepada bilangan ${Y} sekurang-kurangnya ${a} : ${b}.`, ktH(b, -a, 0, '>='), `${ktTerm(a, 'x', true)} ≥ ${b}y`, `${fr('x', 'y')} ≥ ${fr(a, b)}, darab silang: ${b}x ≥ ${ktTerm(a, 'y', true)}.`],
    () => [`Nisbah bilangan ${X} kepada bilangan ${Y} selebih-lebihnya ${a} : ${b}.`, ktH(b, -a, 0, '<='), `${ktTerm(a, 'x', true)} ≤ ${b}y`, `${fr('x', 'y')} ≤ ${fr(a, b)}, darab silang: ${b}x ≤ ${ktTerm(a, 'y', true)}.`],
    () => [`Bilangan ${Y} tidak kurang daripada ${k + 3}.`, ktH(0, 1, k + 3, '>='), `y &lt; ${k + 3}`, `"Tidak kurang daripada" bermaksud ≥, maka y ≥ ${k + 3}.`],
    () => [`Bilangan ${X} kurang daripada ${n}.`, ktH(1, 0, n, '<'), `x ≤ ${n}`, `"Kurang daripada" tidak termasuk ${n}, maka x &lt; ${n}.`]
  ])();
};
// teks h dalam bentuk ringkas sesuai untuk hubungan (x ≥ 2y, 3x ≥ 2y, x − y ≥ 5)
const ktRelTxt = h => {
  if (h.C === 0 && h.A > 0 && h.B < 0) return `${ktTerm(h.A, 'x', true)} ${KTOP[h.op]} ${ktTerm(-h.B, 'y', true)}`;
  if (h.C === 0 && h.A < 0 && h.B > 0) return `${ktTerm(h.B, 'y', true)} ${KTOP[h.op]} ${ktTerm(-h.A, 'x', true)}`;
  if (h.A && h.B) return ktStd(h);
  return ktTxt(h);
};

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 6.1 Ketaksamaan Linear ---------- */
  bentuk1: [
    ({ ctx, tot }) => ({ q: `${ctx} ${tot} Bentukkan satu ketaksamaan linear dalam x dan y.` }),
    ({ ctx, tot }) => ({ q: `${ctx} ${tot} Tulis ketaksamaan linear yang mewakili situasi ini.` }),
    ({ ctx, tot }) => ({ q: `Wakilkan situasi berikut dalam bentuk ketaksamaan linear. ${ctx} ${tot}` }),
    ({ ctx, tot, wrong, frasa, ans }) => { const N = vnama(); return Object.assign({ q: `${ctx} ${tot} ${N} menulis ketaksamaan ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `"${frasa}" diwakili oleh simbol ${ans.split(' ').slice(-2, -1)[0]}.`)); },
    ({ ctx, tot, lhs, n, sym, ans }) => ({ q: `${ctx} ${tot} Lengkapkan ketaksamaan: ${lhs} ___ ${n}`, ans: `${sym} (iaitu ${ans})` })
  ],
  titik1: [
    ({ pt, t }) => ({ q: `Tentukan sama ada titik ${pt} memuaskan ketaksamaan ${t}.` }),
    ({ pt, t }) => ({ q: `Adakah titik ${pt} terletak dalam rantau yang mewakili ketaksamaan ${t}?` }),
    ({ pt, t }) => ({ q: `Semak sama ada (x, y) = ${pt} ialah satu penyelesaian bagi ketaksamaan ${t}.` }),
    ({ pt, t, ok }) => { const N = vnama(), cl = vr([true, false]); return cl === ok ? { q: `${N} berkata titik ${pt} ${cl ? 'memuaskan' : 'tidak memuaskan'} ketaksamaan ${t}. Adakah ${N} betul?`, ans: `Ya, ${N} betul. Titik ${pt} ${ok ? 'memuaskan' : 'tidak memuaskan'} ketaksamaan itu` } : Object.assign({ q: `${N} berkata titik ${pt} ${cl ? 'memuaskan' : 'tidak memuaskan'} ketaksamaan ${t}. Adakah ${N} betul?` }, salah(N, `titik ${pt} ${ok ? 'memuaskan' : 'tidak memuaskan'} ketaksamaan itu`, 'Gantikan nilai x dan y ke dalam ketaksamaan dan semak.')); }
  ],
  garis1: [
    ({ t, eq, pair }) => ({ q: `Bagi ketaksamaan ${t}, nyatakan sama ada garis ${eq} dilukis sebagai garis padu atau garis putus-putus, dan sama ada rantaunya ${pair} garis itu.` }),
    ({ t, eq }) => ({ q: `Rantau yang mewakili ${t} hendak dilorek pada satah Cartes. Nyatakan jenis garis ${eq} dan kedudukan rantau itu.` }),
    ({ t, eq, side, garis, ans }) => { const N = vnama(), wg = vr([true, false]), cg = wg ? (garis === 'garis padu' ? 'garis putus-putus' : 'garis padu') : garis, cs = wg ? side : ktSideTxt({ atas: 'bawah', bawah: 'atas', kiri: 'kanan', kanan: 'kiri' }[side]); return Object.assign({ q: `${N} melukis ${eq} sebagai ${cg} dan melorek rantau ${cs} bagi ketaksamaan ${t}. Adakah ${N} betul?` }, salah(N, ans, wg ? `Simbol ${t.includes('≤') || t.includes('≥') ? '≤ atau ≥ memerlukan garis padu' : '&lt; atau &gt; memerlukan garis putus-putus'}.` : 'Kedudukan rantau tidak tepat.')); },
    ({ t, eq }) => ({ q: `Lengkapkan: Bagi ketaksamaan ${t}, garis ${eq} ialah ___ dan rantaunya terletak ___.` })
  ],
  graf1: [
    ({ eq }) => ({ q: `Rajah di bawah menunjukkan rantau berlorek yang dibatasi oleh garis ${eq}. Tulis ketaksamaan yang mentakrifkan rantau berlorek itu.` }),
    () => ({ q: 'Nyatakan ketaksamaan linear yang diwakili oleh rantau berlorek dalam rajah di bawah.' }),
    ({ eq }) => ({ q: `Garis ${eq} dilukis pada satah Cartes di bawah. Tulis ketaksamaan yang dipenuhi oleh semua titik dalam rantau berlorek.` }),
    ({ wrong, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata rantau berlorek dalam rajah di bawah mewakili ketaksamaan ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  lorek1: [
    ({ t, eq }) => ({ q: `Pada satah Cartes di bawah, lukis garis ${eq} dan lorek rantau yang memuaskan ketaksamaan ${t}.` }),
    ({ t }) => ({ q: `Lorek rantau yang mewakili ketaksamaan ${t} pada satah Cartes di bawah.` }),
    ({ t, tp }) => ({ q: `Dengan menggunakan titik ujian ${tp}, lorek rantau yang memuaskan ketaksamaan ${t} pada satah Cartes di bawah.` })
  ],
  ubah: [
    ({ t }) => ({ q: `Tulis ketaksamaan ${t} dalam bentuk y … mx + c. Seterusnya, nyatakan sama ada rantaunya di atas atau di bawah garis.` }),
    ({ t }) => ({ q: `Ungkapkan ketaksamaan ${t} dengan y sebagai perkara rumus, kemudian tentukan kedudukan rantau yang memuaskannya.` }),
    ({ t, wrongT, wrongS, ans, neg }) => { const N = vnama(); return Object.assign({ q: `${N} menukar ketaksamaan ${t} kepada ${wrongT} dan melorek rantau ${wrongS} garis. Adakah ${N} betul?` }, salah(N, ans, neg ? 'Apabila kedua-dua belah dibahagi dengan nombor negatif, simbol ketaksamaan mesti diterbalikkan.' : 'Membahagi dengan nombor positif tidak mengubah simbol ketaksamaan.')); },
    ({ t, mid, rhs }) => ({ q: `Lengkapkan: ${t} → ${mid} → y ___ ${rhs}. Nyatakan juga kedudukan rantaunya.` })
  ],
  cariK: [
    ({ pt, t }) => ({ q: `Titik ${pt} terletak dalam rantau yang memuaskan ketaksamaan ${t}. Cari julat nilai k.` }),
    ({ pt, t }) => ({ q: `Diberi titik ${pt} memuaskan ketaksamaan ${t}, tentukan julat nilai k.` }),
    ({ pt, t, ext, extAns }) => ({ q: `Titik ${pt} terletak dalam rantau ${t}. Cari nilai integer ${ext} bagi k.`, ans: extAns })
  ],
  k61: [
    ({ p, q, n, a, b, x0, le }) => ({ q: `Harga sebuah buku latihan ialah RM${p} dan harga sebatang pen ialah RM${q}. ${vnama()} membeli x buah buku latihan dan y batang pen dengan wang tidak melebihi RM${n}. (a) Bentukkan satu ketaksamaan linear. (b) Bolehkah dia membeli ${a} buah buku latihan dan ${b} batang pen? (c) Jika dia membeli ${x0} buah buku latihan, berapakah bilangan maksimum pen yang boleh dibeli?`, ans: le.ans, work: le.work }),
    ({ p, q, n, a, b, x0, le, lhs }) => ({ q: `Sebuah lif boleh membawa muatan selebih-lebihnya ${n * 10} kg. Jisim sebuah kotak A ialah ${p * 10} kg dan jisim sebuah kotak B ialah ${q * 10} kg. Lif itu membawa x kotak A dan y kotak B. (a) Bentukkan satu ketaksamaan linear dan permudahkannya. (b) Bolehkah lif itu membawa ${a} kotak A dan ${b} kotak B serentak? (c) Jika lif itu membawa ${x0} kotak A, berapakah bilangan maksimum kotak B?`, ans: le.ans.replace(`(a) ${lhs} ≤`, `(a) ${p * 10}x + ${q * 10}y ≤ ${n * 10}, iaitu ${lhs} ≤`), work: [`(a) ${p * 10}x + ${q * 10}y ≤ ${n * 10}; bahagi dengan 10: ${lhs} ≤ ${n}`].concat(le.work.slice(1)) }),
    ({ p, q, n, a, b, x0, ge }) => ({ q: `Harga tiket dewasa ialah RM${p} dan harga tiket kanak-kanak ialah RM${q}. Penganjur menjual x tiket dewasa dan y tiket kanak-kanak. Kutipan mestilah sekurang-kurangnya RM${n} untuk menampung kos. (a) Bentukkan satu ketaksamaan linear. (b) Adakah jualan ${a} tiket dewasa dan ${b} tiket kanak-kanak mencukupi? (c) Jika ${x0} tiket dewasa dijual, berapakah bilangan minimum tiket kanak-kanak yang perlu dijual?`, ans: ge.ans, work: ge.work }),
    ({ p, q, n, a, b, x0, le }) => ({ q: `Dalam satu ujian, ${vnama()} memperuntukkan ${p} minit bagi setiap soalan objektif dan ${q} minit bagi setiap soalan subjektif. Masa ujian tidak melebihi ${n} minit. Dia menjawab x soalan objektif dan y soalan subjektif. (a) Bentukkan satu ketaksamaan linear. (b) Bolehkah dia menjawab ${a} soalan objektif dan ${b} soalan subjektif? (c) Jika dia menjawab ${x0} soalan objektif, berapakah bilangan maksimum soalan subjektif yang boleh dijawab?`, ans: le.ans, work: le.work })
  ],

  /* ---------- 6.2 Sistem Ketaksamaan ---------- */
  frasa2: [
    ({ intro, rel }) => ({ q: `${intro} ${rel} Tulis satu ketaksamaan linear yang mewakili syarat ini.` }),
    ({ intro, rel }) => ({ q: `${intro} Ungkapkan syarat berikut sebagai ketaksamaan linear: "${rel}"` }),
    ({ intro, rel, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${intro} ${N} menulis syarat "${rel}" sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Terjemahkan setiap frasa mengikut susunan pemboleh ubah dalam ayat.')); },
    ({ intro, rel }) => ({ q: `Berdasarkan maklumat berikut, bentukkan satu ketaksamaan linear. ${intro} ${rel}` })
  ],
  bentuk2: [
    ({ intro, r1, r2 }) => ({ q: `${intro} ${r1} ${r2} Tulis dua ketaksamaan linear yang mewakili situasi ini.` }),
    ({ intro, r1, r2 }) => ({ q: `${intro} Syarat-syaratnya ialah: (i) ${r1} (ii) ${r2} Bentukkan sistem ketaksamaan linear bagi syarat-syarat itu.` }),
    ({ intro, r1, r2 }) => ({ q: `Bentukkan sistem ketaksamaan linear bagi situasi berikut. ${intro} ${r1} ${r2}` })
  ],
  titik2: [
    ({ pt, list }) => ({ q: `Tentukan sama ada titik ${pt} memuaskan sistem ketaksamaan ${list}.` }),
    ({ pt, list }) => ({ q: `Adakah titik ${pt} terletak dalam rantau sepunya bagi ketaksamaan ${list}?` }),
    ({ pt, list }) => ({ q: `Diberi sistem ketaksamaan linear ${list}. Semak sama ada ${pt} ialah satu penyelesaian bagi sistem itu.` }),
    ({ pt, list, ok }) => { const N = vnama(); return ok ? Object.assign({ q: `${N} berkata titik ${pt} tidak terletak dalam rantau sepunya bagi ${list}. Adakah ${N} betul?` }, salah(N, `${pt} terletak dalam rantau sepunya`, 'Titik itu memuaskan setiap ketaksamaan.')) : { q: `${N} berkata titik ${pt} tidak terletak dalam rantau sepunya bagi ${list}. Adakah ${N} betul?`, ans: `Ya, ${N} betul. Sekurang-kurangnya satu ketaksamaan tidak dipenuhi` }; }
  ],
  graf2: [
    ({ eqs, n }) => ({ q: `Rajah di bawah menunjukkan rantau berlorek yang dibatasi oleh garis ${eqs}. Tulis ${n} ketaksamaan yang mentakrifkan rantau berlorek itu.` }),
    () => ({ q: 'Nyatakan sistem ketaksamaan linear yang mentakrifkan rantau berlorek dalam rajah di bawah.' }),
    ({ n }) => ({ q: `Rantau berlorek dalam rajah di bawah memuaskan ${n} ketaksamaan linear. Tulis ketaksamaan-ketaksamaan itu.` })
  ],
  lorek2: [
    ({ list }) => ({ q: `Pada satah Cartes di bawah, lukis garis-garis yang sesuai dan lorek rantau yang memuaskan ${list}.` }),
    ({ list }) => ({ q: `Lorek rantau sepunya bagi sistem ketaksamaan ${list} pada satah Cartes di bawah.` }),
    ({ list }) => ({ q: `Lukis dan lorek rantau R yang memuaskan semua ketaksamaan berikut: ${list}.` })
  ],
  maks: [
    ({ list, x0 }) => ({ q: `Diberi sistem ketaksamaan ${list}. Jika x = ${x0}, cari nilai integer maksimum bagi y.` }),
    ({ list, x0, lo }) => ({ q: `Titik (${x0}, y) terletak dalam rantau sepunya bagi ${list}. Cari nilai integer terkecil bagi y.`, ans: `y = ${lo}` }),
    ({ list, x0, range }) => ({ q: `Bagi x = ${x0}, tentukan julat nilai y yang memuaskan sistem ketaksamaan ${list}.`, ans: range })
  ],
  k62: [
    ({ d }) => ({ q: `Sebuah kelab sukan ingin membeli x biji bola sepak dan y biji bola jaring. Jumlah bola yang dibeli tidak melebihi ${d.n}. Bilangan bola sepak sekurang-kurangnya ${d.kw}bilangan bola jaring. Sekurang-kurangnya ${d.b} biji bola jaring perlu dibeli. (a) Tulis tiga ketaksamaan yang mewakili syarat-syarat ini. (b) Bolehkah kelab itu membeli ${d.ta} biji bola sepak dan ${d.tb} biji bola jaring? (c) Berapakah bilangan maksimum bola jaring yang boleh dibeli?`, ans: `(a) ${d.sys} (b) ${d.tAns} (c) ${d.ymax}`, work: d.wA.concat(d.wB, d.wY) }),
    ({ d }) => ({ q: `Sebuah kedai bakeri menghasilkan x biji kek dan y biji pai sehari. Jumlah kek dan pai yang dihasilkan selebih-lebihnya ${d.n} biji. Bilangan kek sekurang-kurangnya ${d.kw}bilangan pai. Sekurang-kurangnya ${d.b} biji pai dihasilkan sehari. (a) Tulis sistem ketaksamaan linear yang mewakili syarat-syarat ini. (b) Bolehkah kedai itu menghasilkan ${d.ta} biji kek dan ${d.tb} biji pai sehari? (c) Berapakah bilangan maksimum kek yang boleh dihasilkan sehari?`, ans: `(a) ${d.sys} (b) ${d.tAns} (c) ${d.xmax}`, work: d.wA.concat(d.wB, d.wX) }),
    ({ d }) => ({ q: `Sebuah bengkel kraf menghasilkan x bakul anyaman dan y tikar mengkuang seminggu. Jumlah hasil seminggu tidak melebihi ${d.n} unit. Bilangan bakul sekurang-kurangnya ${d.kw}bilangan tikar. Sekurang-kurangnya ${d.b} helai tikar dihasilkan seminggu. (a) Tulis sistem ketaksamaan linear bagi situasi ini. (b) Adakah ${d.ta} bakul dan ${d.tb} tikar memenuhi semua syarat? (c) Jika ${d.y0} helai tikar dihasilkan, nyatakan julat bilangan bakul yang boleh dihasilkan.`, ans: `(a) ${d.sys} (b) ${d.tAns} (c) ${d.xr}`, work: d.wA.concat(d.wB, d.wR) })
  ]
};

/* =================== pembina soalan (r = ktRG atau ktRW) =================== */
const KT = {};
/* ---------- 6.1 ---------- */
KT.bentuk1 = (r, k) => {
  const cx = k == null ? r.p(KTCTX1) : KTCTX1[k % KTCTX1.length];
  const p = r.p(cx.p), q = r.p(cx.q), [frasa, op] = r.p(KTFRASA);
  const n = cx.p.length === 1 ? r.p([30, 35, 40, 45, 50]) : (p * r.i(3, 8) + q * r.i(3, 8));
  const lhs = ktLHS(p, q), ans = `${lhs} ${KTOP[op]} ${n}`, wrong = `${lhs} ${KTOP[KTSALAH[op]]} ${n}`;
  const ctx = cx.s(p, q), tot = cx.t(frasa, n);
  return GEN_LQ('bentuk1', { ctx, tot, frasa, lhs, n, sym: KTOP[op], wrong, ans, work: [`Jumlah = ${p === 1 ? '' : p}x + ${q === 1 ? '' : q}y`, `"${frasa}" → ${KTOP[op]}`, `Maka ${ans}`] });
};
function ktLine1(r, simple) {
  // y op mx + c (B = 1) atau bentuk am A x + B y op C
  const op = r.p(['<', '>', '<=', '>=']);
  if (simple || r.f() < .55) { const m = r.n(-3, 3), c = r.i(-5, 5); return Object.assign(ktYH(m, c, op), { t: ktYf(m, c, op) }); }
  let A, B, C; do { A = r.n(-4, 4); B = r.n(-3, 3); C = r.i(-10, 12); } while (A < 0 && B < 0);
  const h = ktH(A, B, C, op); h.t = ktStd(h); return h;
}
KT.titik1 = (r, k) => {
  const h = ktLine1(r), kind = k == null ? r.p(['in', 'out', 'out', 'on', 'in']) : ['in', 'out', 'on', 'in', 'out'][k % 5];
  let x, y, tries = 0;
  do {
    x = r.i(-5, 5); y = r.i(-6, 6);
    if (kind === 'on' && h.B !== 0 && (h.C - h.A * x) % h.B === 0) y = (h.C - h.A * x) / h.B;
    tries++;
  } while (tries < 200 && (kind === 'on' ? !ktOn(h, x, y) : ktOn(h, x, y) || ktHolds(h, x, y) !== (kind === 'in')));
  const ok = ktHolds(h, x, y), pt = P(x, y);
  const w = h.t.startsWith('y ') && h.A !== 0
    ? [`Gantikan x = ${fmt(x)}: ${ktRhs(-h.A, h.C)} = ${fmt(-h.A * x + h.C)}`, `y = ${fmt(y)}, maka ${fmt(y)} ${KTOP[h.op]} ${fmt(-h.A * x + h.C)} adalah ${ktBenar(ok)}.`]
    : [`Gantikan x = ${fmt(x)} dan y = ${fmt(y)}: ${ktSub(h, x, y)}`, `${fmt(h.A * x + h.B * y)} ${KTOP[h.op]} ${fmt(h.C)} adalah ${ktBenar(ok)}.`];
  if (ktOn(h, x, y)) w.push(`Titik itu terletak pada garis ${ktEq(h)} (${ktGaris(h.op)}).`);
  w.push(ok ? `Maka titik ${pt} memuaskan ketaksamaan itu.` : `Maka titik ${pt} tidak memuaskan ketaksamaan itu.`);
  return GEN_LQ('titik1', { pt, t: h.t, ok, ans: ok ? 'Ya, memuaskan' : 'Tidak memuaskan', work: w });
};
function ktLineG(r, kind) {
  // kind: 'y' (y op mx + c), 'x' (x op a), 'h' (y op a)
  const op = r.p(['<', '>', '<=', '>=']);
  if (kind === 'x') { const a = r.n(-4, 4); return Object.assign(ktXH(a, op), { t: `x ${KTOP[op]} ${fmt(a)}` }); }
  if (kind === 'h') { const a = r.n(-4, 4); return Object.assign(ktH(0, 1, a, op), { t: `y ${KTOP[op]} ${fmt(a)}` }); }
  const m = r.n(-3, 3), c = r.i(-4, 4); return Object.assign(ktYH(m, c, op), { t: ktYf(m, c, op) });
}
const ktSmallBox = h => {
  const pts = ktIntc(h).filter(p => Math.abs(p[0]) <= 7 && Math.abs(p[1]) <= 7);
  return ktBox(pts.map(p => p[0]).concat([-4, 4]), pts.map(p => p[1]).concat([-4, 4]), 1, 8);
};
KT.garis1 = (r, k) => {
  const kind = k == null ? r.p(['y', 'y', 'x', 'h']) : ['y', 'x', 'y', 'h'][k % 4], h = ktLineG(r, kind);
  const side = ktSide(h), garis = ktGaris(h.op), eq = ktEq(h), pair = side === 'atas' || side === 'bawah' ? 'di atas atau di bawah' : 'di sebelah kiri atau kanan';
  const ans = `${vcap(garis)}; rantau ${ktSideTxt(side)} ${eq}`;
  const figAns = ktFig({ box: ktSmallBox(h), hs: [{ h, c: 'am', lab: eq }], sc: 'tr', label: `Rantau ${h.t}` });
  return GEN_LQ('garis1', { t: h.t, eq, pair, side, garis, ans, work: [`Simbol ${KTOP[h.op]} → ${garis}${ktIsStrict(h.op) ? ' (titik pada garis tidak termasuk)' : ' (titik pada garis termasuk)'}.`, kind === 'x' ? `x ${ktIsBig(h.op) ? 'lebih' : 'kurang'} daripada ${fmt(h.C)} → rantau ${ktSideTxt(side)} ${eq}.` : `y ${ktIsBig(h.op) ? 'lebih' : 'kurang'} daripada nilai pada garis → rantau ${ktSideTxt(side)}.`] }, { figAns });
};
KT.graf1 = (r, k) => {
  const kind = k == null ? r.p(['y', 'y', 'y', 'x', 'h']) : ['y', 'x', 'y', 'h', 'y'][k % 5], h = ktLineG(r, kind), eq = ktEq(h);
  const b = { x0: -5, x1: 5, y0: -5, y1: 5 };
  const pts = kind === 'y' ? [[0, h.C], [1, h.C - h.A], [-1, h.C + h.A], [2, h.C - 2 * h.A]].filter(p => Math.abs(p[1]) <= 4).slice(0, 2).map(p => ({ x: p[0], y: p[1], c: 'am' })) : [];
  const fig = ktFig({ box: b, hs: [{ h, c: 'am', lab: eq }], sc: 'tr', pts, label: `Rantau berlorek dibatasi oleh garis ${eq}` });
  const flipStrict = r.f() < .5, wrongH = flipStrict ? Object.assign({}, h, { op: KTSTRICT[h.op] }) : Object.assign({}, h, { op: KTFLIP[h.op] });
  const wrong = kind === 'x' ? `x ${KTOP[wrongH.op]} ${fmt(h.C)}` : kind === 'h' ? `y ${KTOP[wrongH.op]} ${fmt(h.C)}` : ktYf(-h.A, h.C, wrongH.op);
  const why = flipStrict ? `Garis dalam rajah ialah ${ktGaris(h.op)}, maka simbolnya ${ktIsStrict(h.op) ? '&lt; atau &gt;' : '≤ atau ≥'}.` : `Rantau berlorek terletak ${ktSideTxt(ktSide(h))}.`;
  const w = [kind === 'y' ? `Garis melalui (0, ${fmt(h.C)}) dengan kecerunan ${fmt(-h.A)}: ${eq}.` : `Garis sempadan ialah ${eq}.`, `${vcap(ktGaris(h.op))} → simbol ${ktIsStrict(h.op) ? '&lt; atau &gt;' : '≤ atau ≥'}.`, `Rantau ${ktSideTxt(ktSide(h))} → ${ktIsBig(h.op) ? (ktIsStrict(h.op) ? '&gt;' : '≥') : (ktIsStrict(h.op) ? '&lt;' : '≤')}.`, `Maka ${h.t}.`];
  return GEN_LQ('graf1', { eq, wrong, why, ans: h.t, work: w }, { fig });
};
KT.lorek1 = r => {
  let h;
  if (r.f() < .35) { const op = r.p(['<', '>', '<=', '>=']), m = r.p([-2, -1, 1, 2]), c = r.n(-3, 4); h = Object.assign(ktYH(m, c, op), { t: ktYf(m, c, op) }); }
  else { let A, B, t; do { A = r.p([1, 2, 3]); B = r.p([1, 2, 3, -1, -2, -3]); t = r.p([1, 2, -1]); } while (A === B || Math.abs(B * t) > 6 || Math.abs(A * t) > 6 || (B < 0 && t < 0)); h = ktH(A, B, A * B * t, r.p(['<', '>', '<=', '>='])); h.t = ktStd(h); }
  const eq = ktEq(h), ic = ktTwo(h), xs = ic.map(p => p[0]), ys = ic.map(p => p[1]), b = ktBox(xs.concat([-2, 2]), ys.concat([-2, 2]), 1, 8);
  const tp = ktOn(h, 0, 0) ? [1, 0] : [0, 0], tpT = P(tp[0], tp[1]), inT = ktHolds(h, tp[0], tp[1]);
  const fig = ktFig({ box: b, blank: true, label: 'Satah Cartes kosong' });
  const figAns = ktFig({ box: b, hs: [{ h, c: 'am', lab: eq }], sc: 'tr', pts: ic.map(p => ({ x: p[0], y: p[1], c: 'am' })), label: `Rantau ${h.t} berlorek` });
  const w = [`Lukis garis ${eq} melalui ${ic.map(p => P(p[0], p[1])).join(' dan ')}.`, `Simbol ${KTOP[h.op]} → ${ktGaris(h.op)}.`, h.t.startsWith('y ') && h.A ? `Uji titik ${tpT}: ${fmt(tp[1])} ${KTOP[h.op]} ${ktRhs(-h.A, h.C).replace('x', `(${fmt(tp[0])})`)} = ${fmt(h.C - h.A * tp[0])} ${ktBenar(inT)}.` : `Uji titik ${tpT}: ${ktSub(h, tp[0], tp[1])}, ${fmt(h.A * tp[0] + h.B * tp[1])} ${KTOP[h.op]} ${fmt(h.C)} ${ktBenar(inT)}.`, inT ? `Lorek rantau yang mengandungi ${tpT}, iaitu ${ktSideTxt(ktSide(h))}.` : `Lorek rantau yang tidak mengandungi ${tpT}, iaitu ${ktSideTxt(ktSide(h))}.`];
  return Object.assign(GEN_LQ('lorek1', { t: h.t, eq, tp: tpT, ans: `Rantau ${ktSideTxt(ktSide(h))} ${eq} (${ktGaris(h.op)}) dilorek`, work: w }, { fig, figAns }), { kind: 'lukis' });
};
KT.ubah = (r, k) => {
  const neg = k == null ? r.f() < .7 : k % 3 !== 1, B = neg ? r.p([-1, -2, -3]) : r.p([2, 3]), m = r.n(-3, 3), c = r.i(-4, 5), op = r.p(['<', '>', '<=', '>=']);
  const h = ktH(-m * B, B, c * B, op), t = ktStd(h), yop = B < 0 ? KTFLIP[op] : op, rhs = ktRhs(m, c), side = ktIsBig(yop) ? 'atas' : 'bawah';
  const mid = `${ktTerm(B, 'y', true)} ${KTOP[op]} ${ktRhs(m * B, c * B)}`;
  const ans = `y ${KTOP[yop]} ${rhs}; rantau di ${side} garis`;
  const work = [`${ktLHS(h.A, h.B)} ${KTOP[op]} ${fmt(h.C)}`, `${mid}`, B === -1 ? `Darab kedua-dua belah dengan −1 dan terbalikkan simbol: y ${KTOP[yop]} ${rhs}` : `Bahagi kedua-dua belah dengan ${fmt(B)}${B < 0 ? ' dan terbalikkan simbol' : ''}: y ${KTOP[yop]} ${rhs}`, `Simbol ${KTOP[yop]} → rantau di ${side} garis y = ${rhs}.`];
  const wrongT = `y ${KTOP[B < 0 ? op : KTFLIP[op]]} ${rhs}`, wrongS = `di ${side === 'atas' ? 'bawah' : 'atas'}`;
  return GEN_LQ('ubah', { t, mid, rhs, wrongT, wrongS, neg: B < 0, ans, work });
};
KT.cariK = (r, k) => {
  const op = r.p(['<', '>', '<=', '>=']), m = r.n(-3, 3), c = r.i(-5, 5), t = ktYf(m, c, op);
  const xMode = k == null ? r.f() < .4 : k % 3 === 2;
  let pt, v, kop, work;
  if (!xMode) {
    const hx = r.n(-3, 4); v = m * hx + c; kop = op; pt = `(${fmt(hx)}, k)`;
    work = [`Gantikan x = ${fmt(hx)} dan y = k: k ${KTOP[op]} ${ktSub(ktH(m, 0, 0, op), hx, 0).replace(/ = .*$/, '')}${c ? (c < 0 ? ' − ' : ' + ') + Math.abs(c) : ''}`, `k ${KTOP[op]} ${fmt(v)}`];
  } else {
    // y0 op m k + c  ⇔  m k  flip(op)  y0 − c
    let y0; do { y0 = c + m * r.i(-3, 3); } while (y0 === c);
    const rhs = (y0 - c) / m; pt = `(k, ${fmt(y0)})`; kop = m > 0 ? KTFLIP[op] : op; v = rhs;
    work = [`Gantikan x = k dan y = ${fmt(y0)}: ${fmt(y0)} ${KTOP[op]} ${ktRhs(m, c).replace('x', 'k')}`, `${ktTerm(m, 'k', true)} ${KTOP[KTFLIP[op]]} ${fmt(y0 - c)}`, m === 1 ? `k ${KTOP[kop]} ${fmt(v)}` : `Bahagi dengan ${fmt(m)}${m < 0 ? ' dan terbalikkan simbol' : ''}: k ${KTOP[kop]} ${fmt(v)}`];
  }
  const big = ktIsBig(kop), ext = big ? 'terkecil' : 'terbesar', ev = ktIsStrict(kop) ? (big ? v + 1 : v - 1) : v;
  return GEN_LQ('cariK', { pt, t, ext, extAns: `k = ${fmt(ev)}`, ans: `k ${KTOP[kop]} ${fmt(v)}`, work: work.concat(ktIsStrict(kop) ? [`Nilai integer ${ext}: k = ${fmt(ev)}`] : []) });
};
KT.k61 = r => {
  let p, q, n, x0; do { p = r.p([2, 3, 4, 5]); q = r.p([1, 2, 3]); n = r.p([30, 36, 40, 45, 50, 60]); x0 = r.i(2, 6); } while (p === q || n - p * x0 < q * 2 || (n - p * x0) % q === 0 && r.f() < .5);
  const ymax = Math.floor((n - p * x0) / q), ymin = Math.ceil((n - p * x0) / q);
  let a, b; do { a = r.i(2, 8); b = r.i(2, 12); } while (p * a + q * b === n);
  const sum = p * a + q * b, okLE = sum <= n, okGE = sum >= n, lhs = ktLHS(p, q);
  const sb = `${p}(${a}) + ${q === 1 ? '' : q}(${b}) = ${sum}`;
  const le = { ans: `(a) ${lhs} ≤ ${n} (b) ${okLE ? 'Ya' : 'Tidak'} (c) ${ymax}`, work: [`(a) ${lhs} ≤ ${n}`, `(b) ${sb}; ${sum} ≤ ${n} ${ktBenar(okLE)}, maka ${okLE ? 'boleh' : 'tidak boleh'}.`, `(c) ${p}(${x0}) + ${q === 1 ? '' : q}y ≤ ${n} → ${q === 1 ? '' : q}y ≤ ${n - p * x0}${q === 1 ? '' : ` → y ≤ ${ktFrS(n - p * x0, q)}`}`, `Nilai integer maksimum y = ${ymax}`] };
  const ge = { ans: `(a) ${lhs} ≥ ${n} (b) ${okGE ? 'Ya, mencukupi' : 'Tidak mencukupi'} (c) ${ymin}`, work: [`(a) ${lhs} ≥ ${n}`, `(b) ${sb}; ${sum} ≥ ${n} ${ktBenar(okGE)}, maka ${okGE ? 'mencukupi' : 'tidak mencukupi'}.`, `(c) ${p}(${x0}) + ${q === 1 ? '' : q}y ≥ ${n} → ${q === 1 ? '' : q}y ≥ ${n - p * x0}${q === 1 ? '' : ` → y ≥ ${ktFrS(n - p * x0, q)}`}`, `Nilai integer minimum y = ${ymin}`] };
  const v = vq('k61', { p, q, n, a, b, x0, le, ge, lhs });
  return { q: v.q, ans: v.ans, work: v.work };
};
// pecahan ringkas (bertingkat) untuk jalan kerja, contoh 22 per 3
function ktFrS(n, d) { const g = ktGcd(n, d) || 1; n /= g; d /= g; return d === 1 ? fmt(n) : (n < 0 ? '−' : '') + fr(Math.abs(n), d); }

/* ---------- 6.2 ---------- */
KT.frasa2 = r => {
  const cx = r.p(KTCTX2), [rel, h, wrong, why] = ktRel(r, cx.X, cx.Y), ans = ktRelTxt(h);
  return GEN_LQ('frasa2', { intro: cx.intro, rel, wrong, why, ans, work: [why, `Maka ${ans}`] });
};
// adakah sistem mempunyai penyelesaian integer positif yang munasabah?
const ktFeas = hs => { for (let x = 1; x <= 80; x++) for (let y = 1; y <= 80; y++) if (hs.every(h => ktHolds(h, x, y))) return true; return false; };
KT.bentuk2 = r => {
  const cx = r.p(KTCTX2); let a, b;
  do { a = ktRel(r, cx.X, cx.Y); b = ktRel(r, cx.X, cx.Y); } while (a[0] === b[0] || (a[1].A === b[1].A && a[1].B === b[1].B) || !ktFeas([a[1], b[1]]) || ((a[1].C === 0) === (b[1].C === 0) && r.f() < .7));
  const t1 = ktRelTxt(a[1]), t2 = ktRelTxt(b[1]);
  return GEN_LQ('bentuk2', { intro: cx.intro, r1: a[0], r2: b[0], ans: `${t1}, ${t2}`, work: [`(i) ${a[3]}`, `(ii) ${b[3]}`, `Sistem: ${t1} dan ${t2}`] });
};
// sistem rawak dengan rantau sepunya yang tidak kosong dalam kotak [-5, 5]
function ktSys(r, n, opt) {
  opt = opt || {};
  const b = opt.box || { x0: -5, x1: 5, y0: -5, y1: 5 };
  for (let tries = 0; tries < 400; tries++) {
    const hs = [], used = new Set();
    for (let i = 0; i < n; i++) {
      let h, key;
      do {
        const kind = i === 0 ? 'y' : r.p(['y', 'y', 'x', 'h']), op = r.p(['<', '>', '<=', '>=']);
        if (kind === 'x') h = Object.assign(ktXH(r.n(-3, 3), op), { kind });
        else if (kind === 'h') h = Object.assign(ktH(0, 1, r.n(-3, 3), op), { kind });
        else { const m = r.p(opt.ms || [-2, -1, 1, 2]), c = r.i(-3, 3); h = Object.assign(ktYH(m, c, op), { kind }); }
        key = `${h.A},${h.B}`;
      } while (used.has(key));
      used.add(key); hs.push(h);
    }
    const poly = ktRegion(hs, b);
    if (poly.length < 3 || ktArea(poly) < (opt.minA || 3) || ktArea(poly) > (opt.maxA || 40)) continue;
    // setiap garis mesti menyentuh sempadan rantau (tiada ketaksamaan berlebihan)
    if (hs.some(h => !poly.some(p => Math.abs(h.A * p[0] + h.B * p[1] - h.C) < 1e-7))) continue;
    hs.forEach(h => { h.t = ktTxt(h); h.eq = ktEq(h); });
    return { hs, poly, box: b };
  }
  // sandaran tetap
  const hs = [Object.assign(ktYH(1, 1, '<='), { kind: 'y' }), Object.assign(ktH(0, 1, -1, '>'), { kind: 'h' }), Object.assign(ktXH(3, '<'), { kind: 'x' })].slice(0, n);
  hs.forEach(h => { h.t = ktTxt(h); h.eq = ktEq(h); });
  return { hs, poly: ktRegion(hs, b), box: b };
}
const KTLC = ['am', 'tr', 'gr'];
KT.titik2 = (r, k) => {
  const n = r.f() < .5 ? 2 : 3, S = ktSys(r, n), want = k == null ? r.f() < .5 : k % 2 === 0;
  let x, y, tries = 0;
  do { x = r.i(-5, 5); y = r.i(-5, 5); tries++; } while (tries < 300 && (S.hs.every(h => ktHolds(h, x, y)) !== want || S.hs.some(h => ktOn(h, x, y) && r.f() < .6)));
  const ok = S.hs.every(h => ktHolds(h, x, y)), pt = P(x, y), list = ktDan(S.hs.map(h => h.t));
  const work = S.hs.map(h => { const o = ktHolds(h, x, y); return `${h.t}: ${h.B === 1 && h.A ? `${fmt(y)} ${KTOP[h.op]} ${fmt(h.C - h.A * x)}` : h.B === 0 ? `${fmt(x)} ${KTOP[h.op]} ${fmt(h.C)}` : `${fmt(y)} ${KTOP[h.op]} ${fmt(h.C)}`} ${ktCek(o)}`; });
  work.push(ok ? 'Semua ketaksamaan dipenuhi, maka titik itu dalam rantau sepunya.' : 'Sekurang-kurangnya satu ketaksamaan tidak dipenuhi, maka titik itu bukan dalam rantau sepunya.');
  return GEN_LQ('titik2', { pt, list, ok, ans: ok ? 'Ya, memuaskan' : 'Tidak memuaskan', work });
};
KT.graf2 = (r, n) => {
  const S = ktSys(r, n), eqs = ktDan(S.hs.map(h => h.eq));
  const fig = ktFig({ box: S.box, hs: S.hs.map((h, i) => ({ h, c: KTLC[i], lab: h.eq })), sc: 'pk', label: `Rantau berlorek dibatasi oleh ${eqs}` });
  const ans = S.hs.map(h => h.t).join(', ');
  const work = S.hs.map(h => `${h.eq}: ${ktGaris(h.op)}, rantau ${ktSideTxt(ktSide(h))} → ${h.t}`);
  return GEN_LQ('graf2', { eqs, n: n === 2 ? 'dua' : 'tiga', ans, work }, { fig });
};
KT.lorek2 = (r, k) => {
  const n = k == null ? (r.f() < .4 ? 2 : 3) : (k % 3 === 0 ? 2 : 3), S = ktSys(r, n), list = ktDan(S.hs.map(h => h.t));
  const fig = ktFig({ box: S.box, blank: true, label: 'Satah Cartes kosong' });
  const figAns = ktFig({ box: S.box, hs: S.hs.map((h, i) => ({ h, c: KTLC[i], lab: h.eq })), sc: 'pk', label: `Rantau sepunya bagi ${list}` });
  const work = S.hs.map(h => `${h.t}: lukis ${h.eq} sebagai ${ktGaris(h.op)}, rantau ${ktSideTxt(ktSide(h))}.`).concat(['Lorek kawasan yang bertindih bagi semua rantau.']);
  return Object.assign(GEN_LQ('lorek2', { list, ans: 'Rantau sepunya dilorek (lihat rajah jawapan)', work }, { fig, figAns }), { kind: 'lukis' });
};
KT.maks = r => {
  // sukuan pertama: y op1 b (bawah), y op2 kx atau x + y op3 n (atas)
  let d; do {
    const kk = r.p([1, 2, 3]), n = r.i(8, 14), bb = r.i(1, 3), x0 = r.i(2, 6);
    const lowOp = r.p(['>', '>=']), u1 = r.p(['<', '<=']), u2 = r.p(['<', '<=']);
    const hs = [ktH(0, 1, bb, lowOp), ktYH(kk, 0, u1), ktH(1, 1, n, u2)];
    const ub = [[kk * x0, u1], [n - x0, u2]].map(([v, o]) => (o === '<' ? v - 1 : v));
    const hi = Math.min(...ub), lo = lowOp === '>' ? bb + 1 : bb;
    const hiR = Math.min(kk * x0, n - x0), hiOp = (kk * x0 === hiR && u1 === '<') || (n - x0 === hiR && u2 === '<') ? '<' : '<=';
    d = { hs, x0, hi, lo, hiR, hiOp, lowOp, bb, kk, n };
  } while (d.hi - d.lo < 1);
  const list = ktDan([ktRelTxt(d.hs[0]), ktRelTxt(d.hs[1]), ktStd(d.hs[2])]);
  const work = [`Gantikan x = ${d.x0}:`, (d.kk === 1 ? `y ${KTOP[d.hs[1].op]} ${d.x0}` : `y ${KTOP[d.hs[1].op]} ${d.kk}(${d.x0}) = ${d.kk * d.x0}`), `${d.x0} + y ${KTOP[d.hs[2].op]} ${d.n} → y ${KTOP[d.hs[2].op]} ${d.n - d.x0}`, `y ${KTOP[d.lowOp]} ${d.bb}`, `Maka ${d.bb} ${KTOP[KTFLIP[d.lowOp]]} y ${KTOP[d.hiOp]} ${d.hiR}`];
  return GEN_LQ('maks', { list, x0: d.x0, lo: d.lo, range: `${d.bb} ${KTOP[KTFLIP[d.lowOp]]} y ${KTOP[d.hiOp]} ${d.hiR}`, ans: `y = ${d.hi}`, work: work.concat([`Nilai integer maksimum y = ${d.hi}, nilai integer minimum y = ${d.lo}`]) });
};
KT.k62 = r => {
  let d; do {
    const n = r.p([10, 12, 15, 16, 18, 20, 24]), kt = r.p([1, 2, 3]), b = r.i(2, 4);
    const hs = [ktH(1, 1, n, '<='), ktH(1, -kt, 0, '>='), ktH(0, 1, b, '>=')];
    let ymax = -1, xmax = -1;
    for (let x = 0; x <= n; x++) for (let y = 0; y <= n; y++) if (hs.every(h => ktHolds(h, x, y))) { ymax = Math.max(ymax, y); xmax = Math.max(xmax, x); }
    const ta = r.i(2, n - 1), tb = r.i(1, n - ta + 1), y0 = r.i(b, Math.floor(n / (kt + 1)));
    d = { n, kt, b, hs, ymax, xmax, ta, tb, y0 };
  } while (d.ymax < d.b + 1 || d.kt * d.y0 > d.n - d.y0);
  const ktx = d.kt === 1 ? '' : d.kt;
  d.kw = { 1: '', 2: 'dua kali ', 3: 'tiga kali ' }[d.kt];
  d.sys = `x + y ≤ ${d.n}, x ≥ ${ktx}y, y ≥ ${d.b}`;
  const chk = d.hs.map(h => ktHolds(h, d.ta, d.tb)), ok = chk.every(Boolean);
  d.tAns = ok ? 'Ya' : 'Tidak';
  d.wA = [`(a) Jumlah tidak melebihi ${d.n}: x + y ≤ ${d.n}; x sekurang-kurangnya ${d.kw}y: x ≥ ${ktx}y; y ≥ ${d.b}`];
  d.wB = [`(b) (${d.ta}, ${d.tb}): ${d.ta + d.tb} ≤ ${d.n} ${ktCek(chk[0])}, ${d.ta} ≥ ${ktx === '' ? '' : ktx + '(' }${d.tb}${ktx === '' ? '' : ')'} ${ktCek(chk[1])}, ${d.tb} ≥ ${d.b} ${ktCek(chk[2])} → ${ok ? 'semua syarat dipenuhi' : 'tidak semua syarat dipenuhi'}`];
  const kv = ktx === '' ? 1 : ktx;
  d.wY = [`(c) Bucu teratas rantau: x = ${ktx}y dan x + y = ${d.n} → ${kv + 1}y = ${d.n}, y = ${ktFrS(d.n, kv + 1)}`, `Nilai integer maksimum y = ${d.ymax}`];
  d.wX = [`(c) x paling besar apabila y paling kecil: y = ${d.b}`, `x + ${d.b} ≤ ${d.n} → x ≤ ${d.n - d.b}; semak x ≥ ${ktx}y: ${d.n - d.b} ≥ ${kv * d.b} ✓`, `Bilangan maksimum kek = ${d.xmax}`];
  d.xr = `${kv * d.y0} ≤ x ≤ ${d.n - d.y0}`;
  d.wR = [`(c) y = ${d.y0}: x ≥ ${ktx === '' ? '' : ktx + '('}${d.y0}${ktx === '' ? '' : ')'} = ${kv * d.y0} dan x + ${d.y0} ≤ ${d.n} → x ≤ ${d.n - d.y0}`, `Julat: ${d.xr}`];
  const v = vq('k62', { d });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '6.1': {
    m: [() => KT.bentuk1(ktRG), () => KT.titik1(ktRG), () => KT.garis1(ktRG), () => KT.graf1(ktRG)],
    s: [() => KT.lorek1(ktRG), () => KT.ubah(ktRG), () => KT.cariK(ktRG)],
    k: [() => KT.k61(ktRG)]
  },
  '6.2': {
    m: [() => KT.frasa2(ktRG), () => KT.bentuk2(ktRG), () => KT.titik2(ktRG), () => KT.graf2(ktRG, 2)],
    s: [() => KT.lorek2(ktRG), () => KT.graf2(ktRG, 3), () => KT.maks(ktRG)],
    k: [() => KT.k62(ktRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 6.1
WG.bentuk1 = i => KT.bentuk1(ktRW, i);
WG.titik1 = i => KT.titik1(ktRW, i);
WG.garis1 = i => KT.garis1(ktRW, i);
WG.graf1 = i => KT.graf1(ktRW, i);
WG.lorek1 = () => KT.lorek1(ktRW);
WG.ubah = i => KT.ubah(ktRW, i);
WG.cariK = i => KT.cariK(ktRW, i);
WG.k61 = () => KT.k61(ktRW);
// 6.2
WG.frasa2 = () => KT.frasa2(ktRW);
WG.bentuk2 = () => KT.bentuk2(ktRW);
WG.titik2 = i => KT.titik2(ktRW, i);
WG.graf2a = () => KT.graf2(ktRW, 2);
WG.graf2b = () => KT.graf2(ktRW, 3);
WG.lorek2 = i => KT.lorek2(ktRW, i);
WG.maks = () => KT.maks(ktRW);
WG.k62 = () => KT.k62(ktRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '6.1': [['m', 'bentuk1', 6], ['m', 'titik1', 5], ['m', 'garis1', 4], ['m', 'graf1', 3], ['s', 'lorek1', 3], ['s', 'ubah', 3], ['s', 'cariK', 3], ['k', 'k61', 3]],
  '6.2': [['m', 'frasa2', 5], ['m', 'bentuk2', 4], ['m', 'titik2', 5], ['m', 'graf2a', 4], ['s', 'lorek2', 3], ['s', 'graf2b', 3], ['s', 'maks', 3], ['k', 'k62', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function ktOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const ktMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const KTGB = { x0: -5, x1: 5, y0: -5, y1: 5 };
const ktGFig = (hs, pts, shade) => ktFig({ box: KTGB, hs, pts, sc: 'tr', shade: shade || 'common', label: 'Satah Cartes' });
const KTGL = ['Garis padu, rantau di atas', 'Garis padu, rantau di bawah', 'Garis putus-putus, rantau di atas', 'Garis putus-putus, rantau di bawah'];
const KTGLX = ['Garis padu, rantau di kanan', 'Garis padu, rantau di kiri', 'Garis putus-putus, rantau di kanan', 'Garis putus-putus, rantau di kiri'];
// empat titik berbeza: tepat satu memenuhi syarat ok(x, y)
function ktPts4(ok, lo = -4, hi = 4) {
  let good, bad = [], t = 0;
  do { good = [ri(lo, hi), ri(lo, hi)]; t++; } while (!ok(...good) && t < 500);
  t = 0;
  while (bad.length < 3 && t < 2000) { const p = [ri(lo, hi), ri(lo, hi)]; t++; if (!ok(...p) && !bad.some(b => b[0] === p[0] && b[1] === p[1])) bad.push(p); }
  return { good, bad };
}
const CQGEN = {
  simbol: [
    () => { const h = ktLineG(ktRG, pick(['y', 'y', 'x'])), x = h.B === 0, s = ktSide(h), lab = `${ktIsStrict(h.op) ? 'Garis putus-putus' : 'Garis padu'}, rantau di ${s}`; return ktMcq(`Bagaimanakah rantau <b>${h.t}</b> dilukis?`, ktGFig([{ h, c: 'am', lab: ktEq(h) }], [], 'none'), ktOptsT(lab, x ? KTGLX : KTGL)); },
    () => { const h = ktLineG(ktRG, 'y'), eq = ktEq(h); return ktMcq(`Simbol manakah melengkapkan ketaksamaan bagi rantau berlorek: <b>y ? ${ktRhs(-h.A, h.C)}</b>`, ktGFig([{ h, c: 'am', lab: eq }]), ktOptsT(KTOP[h.op], ['&lt;', '&gt;', '≤', '≥'])); },
    () => { const B = pick([-1, -2]), m = nz(-3, 3), c = nz(-4, 4), op = pick(['<', '>', '<=', '>=']), h = ktH(-m * B, B, c * B, op), rhs = ktRhs(m, c); return ktMcq(`Ketaksamaan <b>${ktStd(h)}</b> bersamaan dengan`, ktGFig([{ h, c: 'am', lab: ktEq(h) }], [], 'none'), ktOptsT(`y ${KTOP[KTFLIP[op]]} ${rhs}`, [`y ${KTOP[op]} ${rhs}`, `y ${KTOP[KTSTRICT[KTFLIP[op]]]} ${rhs}`, `y ${KTOP[KTFLIP[op]]} ${ktRhs(-m, c)}`, `y ${KTOP[op]} ${ktRhs(-m, -c)}`])); }
  ],
  titik: [
    () => { const h = ktLine1(ktRG, true), { good, bad } = ktPts4((x, y) => ktHolds(h, x, y)); const o = ktOptsT(P(...good), bad.map(p => P(...p))); return ktMcq(`Titik manakah <b>memuaskan</b> ketaksamaan ${h.t}?`, ktGFig([{ h, c: 'am', lab: ktEq(h) }], [], 'none'), o); },
    () => { let A, B, C; do { A = ri(1, 4); B = ri(1, 4); C = ri(6, 14); } while (A === B); const h = ktH(A, B, C, pick(['<=', '<'])), { good, bad } = ktPts4((x, y) => !ktHolds(h, x, y), 0, 5); return ktMcq(`Titik manakah <b>tidak</b> memuaskan ${ktStd(h)}?`, ktGFig([{ h, c: 'am', lab: ktEq(h) }], [], 'none'), ktOptsT(P(...good), bad.map(p => P(...p)))); },
    () => { const op = pick(['<', '>', '<=', '>=']), m = nz(-3, 3), c = ri(-4, 4), hx = nz(-2, 3), v = m * hx + c; return ktMcq(`Titik (${fmt(hx)}, k) terletak dalam rantau <b>${ktYf(m, c, op)}</b>. Julat nilai k ialah`, ktGFig([{ h: ktYH(m, c, op), c: 'am' }], [], 'tr'), ktOptsT(`k ${KTOP[op]} ${fmt(v)}`, ['<', '>', '<=', '>='].map(o => `k ${KTOP[o]} ${fmt(v)}`))); }
  ],
  graf: [
    () => { const h = ktLineG(ktRG, pick(['x', 'h'])), a = fmt(h.C), v = h.B === 0 ? 'x' : 'y'; return ktMcq('Ketaksamaan manakah mewakili rantau berlorek?', ktGFig([{ h, c: 'am', lab: ktEq(h) }]), ktOptsT(h.t, ['<', '>', '<=', '>='].map(o => `${v} ${KTOP[o]} ${a}`))); },
    () => { const h = ktLineG(ktRG, 'y'), rhs = ktRhs(-h.A, h.C); return ktMcq('Ketaksamaan manakah mewakili rantau berlorek?', ktGFig([{ h, c: 'am', lab: ktEq(h) }]), ktOptsT(h.t, ['<', '>', '<=', '>='].map(o => `y ${KTOP[o]} ${rhs}`))); },
    () => { const h = ktLineG(ktRG, 'y'), m = -h.A, c = h.C; return ktMcq('Ketaksamaan manakah mewakili rantau berlorek?', ktGFig([{ h, c: 'am' }]), ktOptsT(h.t, [ktYf(-m, c, h.op), ktYf(m, c, KTFLIP[h.op]), ktYf(m, c, KTSTRICT[h.op]), ktYf(m, -c, h.op), ktYf(-m, -c, h.op)].filter(s => s !== h.t))); }
  ],
  sistem: [
    () => {
      const S = ktSys(ktRG, pick([2, 3])), inside = (x, y) => S.hs.every(h => ktHolds(h, x, y) && !ktOn(h, x, y)), outside = (x, y) => !S.hs.every(h => ktHolds(h, x, y));
      let good, t = 0; do { good = [ri(-4, 4), ri(-4, 4)]; t++; } while (!inside(...good) && t < 400);
      if (!inside(...good)) return CQGEN.titik[0]();
      const bad = []; t = 0; while (bad.length < 3 && t < 2000) { const p = [ri(-4, 4), ri(-4, 4)]; t++; if (outside(...p) && !bad.some(b => b[0] === p[0] && b[1] === p[1])) bad.push(p); }
      const L = shuffle(['A', 'B', 'C', 'D']), all = [good].concat(bad), pts = all.map((p, i) => ({ x: p[0], y: p[1], l: L[i], c: 'tx' }));
      return { type: 'mcq', q: 'Titik manakah terletak dalam <b>rantau sepunya</b> berlorek?', fig: ktFig({ box: S.box, hs: S.hs.map((h, i) => ({ h, c: KTLC[i] })), sc: 'pk', pts, label: 'Rantau sepunya dan empat titik' }), opts: ['A', 'B', 'C', 'D'], c: ['A', 'B', 'C', 'D'].indexOf(L[0]) };
    },
    () => {
      const S = ktSys(ktRG, 3), { good, bad } = ktPts4((x, y) => S.hs.every(h => ktHolds(h, x, y)));
      if (!S.hs.every(h => ktHolds(h, ...good)) || bad.length < 3) return CQGEN.titik[0]();
      return ktMcq(`Titik manakah memuaskan semua ketaksamaan <b>${ktDan(S.hs.map(h => h.t))}</b>?`, ktFig({ box: S.box, hs: S.hs.map((h, i) => ({ h, c: KTLC[i] })), shade: 'none', label: 'Garis sempadan sistem' }), ktOptsT(P(...good), bad.map(p => P(...p))));
    },
    () => {
      const S = ktSys(ktRG, 2), ans = S.hs.map(h => h.t).join(', '), alt = h => Object.assign({}, h, { op: KTFLIP[h.op] }), alt2 = h => Object.assign({}, h, { op: KTSTRICT[h.op] });
      const [h1, h2] = S.hs, c = [[alt(h1), h2], [h1, alt(h2)], [alt(h1), alt(h2)], [alt2(h1), h2], [h1, alt2(h2)]].map(p => p.map(ktTxt).join(', '));
      return ktMcq('Sistem ketaksamaan manakah mentakrifkan rantau berlorek?', ktFig({ box: S.box, hs: S.hs.map((h, i) => ({ h, c: KTLC[i], lab: h.eq })), sc: 'pk', label: 'Rantau sepunya dua ketaksamaan' }), ktOptsT(ans, c));
    }
  ]
};
const CQT = { simbol: 'Garis & rantau', titik: 'Titik memuaskan', graf: 'Baca graf', sistem: 'Rantau sepunya' };
function ktCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.simbol;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['simbol', 'titik', 'titik', 'graf', 'sistem'] : Object.keys(CQT);
  return ktCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return ktCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
