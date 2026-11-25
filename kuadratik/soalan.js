'use strict';
/* =================== KUADRATIK · SOALAN BAB 1 FUNGSI DAN PERSAMAAN KUADRATIK (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "kq" / "KQ" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & ungkapan =================== */
const kqGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan termudah dengan tanda tolak sebenar (−)
const kqFr = (n, d = 1) => {
  if (d < 0) { n = -n; d = -d; }
  const g = kqGcd(n, d) || 1; n /= g; d /= g;
  return (n < 0 ? '−' : '') + (d === 1 ? String(Math.abs(n)) : fr(Math.abs(n), d));
};
const kqPm = s => (s[0] === '−' ? `(${s})` : s);
// sebutan [pekali, pemboleh ubah] → "2x² − 3x + 1" (ikut susunan yang diberi)
function kqT(cs) {
  let s = '';
  cs.forEach(([k, v]) => {
    if (!k) return;
    const a = Math.abs(k), body = (a === 1 && v ? '' : a) + v;
    s += s ? (k < 0 ? ' − ' : ' + ') + body : (k < 0 ? '−' : '') + body;
  });
  return s || '0';
}
const kqPoly = (a, b, c, v = 'x') => kqT([[a, v + '²'], [b, v], [c, '']]);
const kqFac = r => (r === 0 ? 'x' : `(x ${r > 0 ? '−' : '+'} ${Math.abs(r)})`);          // faktor bagi punca r
const kqFacA = (u, v) => `(${u === 1 ? '' : u}x ${v > 0 ? '−' : '+'} ${Math.abs(v)})`;     // faktor (ux − v), punca v/u
const kqOr = (rs) => { const u = rs.slice().sort((p, q) => p[0] / p[1] - q[0] / q[1]); return u.map(([n, d]) => `x = ${kqFr(n, d)}`).join(' atau '); };
const kqOrI = (...xs) => kqOr(xs.map(x => [x, 1]));
// gantian: a(t)² + b(t) + c
function kqSub(a, b, c, t) {
  const T = `(${fmt(t)})`, out = [];
  out.push((a === 1 ? '' : a === -1 ? '−' : fmt(a)) + T + '²');
  if (b) out.push((b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + T);
  if (c) out.push((c < 0 ? ' − ' : ' + ') + Math.abs(c));
  return out.join('');
}
const kqSubV = (a, b, c, t) => kqT([[a * t * t, ''], [b * t, ''], [c, '']]);
const kqAv = a => (a === .5 ? fr(1, 2) : a === -.5 ? '−' + fr(1, 2) : fmt(a));
const kqVal = (a, b, c, t) => a * t * t + b * t + c;
// rawak: kqRG untuk Latihan Kelas / games, kqRW (berbenih) untuk Lembaran Kerja
const kqRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const kqRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const kqShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const kqTp = a => (a > 0 ? 'minimum' : 'maksimum');
const kqShape = a => (a > 0 ? '∪' : '∩');
const kqSide = h => (h < 0 ? 'di sebelah kiri paksi-y' : h > 0 ? 'di sebelah kanan paksi-y' : 'pada paksi-y');
// pekali a sebagai teks (termasuk ½)
const kqCa = a => (a === 1 ? '' : a === -1 ? '−' : a === .5 ? fr(1, 2) : a === -.5 ? '−' + fr(1, 2) : fmt(a));
const kqPolyA = (a, b, c) => kqCa(a) + 'x²' + kqT([[1, 'X'], [b, 'x'], [c, '']]).replace(/^X/, '');
const kqAbsA = a => (Math.abs(a) === .5 ? fr(1, 2) : String(Math.abs(a)));

/* =================== rajah =================== */
const kqStep = span => [1, 2, 5, 10, 20, 50, 100].find(s => span / s <= 8) || 200;
// o = { x0, x1, y0, y1, fns:[{f, c, w, dash}], pts:[{x, y, c, l, at}], vl:[{x, c, l}], nums, label, W, H }
function kqPlot(o) {
  const W = o.W || 340, H = o.H || 260, L = 34, R = W - 14, T = 14, B = H - 24;
  const { x0, x1, y0, y1 } = o, sx = (R - L) / (x1 - x0), sy = (B - T) / (y1 - y0);
  const X = x => +(L + (x - x0) * sx).toFixed(1), Y = y => +(B - (y - y0) * sy).toFixed(1);
  const xs = (x1 - x0) > 12 ? 2 : 1, ys = o.ys || kqStep(y1 - y0), nums = o.nums !== false;
  const tx = (x, y, t, c, sz, an) => `<text x="${x}" y="${y}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" text-anchor="${an || 'middle'}" dominant-baseline="central">${t}</text>`;
  let s = '';
  if (o.grid !== false) {
    for (let x = Math.ceil(x0); x <= x1; x++) s += `<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${B}" style="stroke:var(--grid)" stroke-width="1.2"/>`;
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1; y += ys) s += `<line x1="${L}" y1="${Y(y)}" x2="${R}" y2="${Y(y)}" style="stroke:var(--grid)" stroke-width="1.2"/>`;
  }
  const ax = x0 <= 0 && 0 <= x1 ? X(0) : L, ay = y0 <= 0 && 0 <= y1 ? Y(0) : B;
  s += `<line x1="${L}" y1="${ay}" x2="${R}" y2="${ay}" style="stroke:var(--mu)" stroke-width="2.2"/><line x1="${ax}" y1="${T}" x2="${ax}" y2="${B}" style="stroke:var(--mu)" stroke-width="2.2"/>`;
  s += tx(R - 4, ay - 11, 'x', 'mu', 14, 'end') + tx(ax + 10, T + 4, 'y', 'mu', 14, 'start');
  if (nums) {
    for (let x = Math.ceil(x0); x <= x1; x++) if (x && x % xs === 0) s += tx(X(x), ay + 13, fmt(x), 'mu', 12);
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1; y += ys) if (y) s += tx(ax - 5, Y(y), fmt(y), 'mu', 12, 'end');
    s += tx(ax - 5, ay + 12, '0', 'mu', 12, 'end');
  }
  (o.vl || []).forEach(v => { s += `<line x1="${X(v.x)}" y1="${T}" x2="${X(v.x)}" y2="${B}" style="stroke:var(--${v.c || 'pu'})" stroke-width="2.2" stroke-dasharray="7 6"/>`; if (v.l) s += tx(X(v.x) + 6, T + 10, v.l, v.c || 'pu', 14, 'start'); });
  (o.fns || []).forEach(fn => {
    let d = '', pen = false;
    for (let k = 0; k <= 200; k++) {
      const x = x0 + (x1 - x0) * k / 200, y = fn.f(x);
      if (y < y0 - .3 || y > y1 + .3) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + X(x) + ' ' + Y(y); pen = true;
    }
    s += `<path d="${d}" fill="none" style="stroke:var(--${fn.c || 'tr'})" stroke-width="${fn.w || 3.5}" stroke-linecap="round" stroke-linejoin="round"${fn.dash ? ' stroke-dasharray="8 6"' : ''}/>`;
  });
  (o.pts || []).forEach(p => {
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" style="fill:var(--${p.c || 'am'})"/>`;
    if (p.l) { const at = p.at || 'n', dx = at.includes('e') ? 9 : at.includes('w') ? -9 : 0, dy = at.includes('n') ? -14 : at.includes('s') ? 15 : 0; s += `<text x="${X(p.x) + dx}" y="${Y(p.y) + dy}" style="fill:var(--${p.c || 'am'})" font-size="14" font-weight="700" text-anchor="${dx > 0 ? 'start' : dx < 0 ? 'end' : 'middle'}" dominant-baseline="central" paint-order="stroke" stroke-width="4" stroke-linejoin="round" stroke="var(--surf)">${p.l}</text>`; }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Graf fungsi kuadratik')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// kotak paparan bagi f(x) = ax² + bx + c (merangkumi titik pusingan, pintasan dan punca)
function kqBox(a, b, c, xs) {
  const h = -b / (2 * a), k = kqVal(a, b, c, h), pts = [h, 0].concat(xs || []);
  let x0 = Math.floor(Math.min(...pts)) - 2, x1 = Math.ceil(Math.max(...pts)) + 2;
  while (x1 - x0 < 8) { x0--; if (x1 - x0 < 8) x1++; }
  const fe = Math.max(kqVal(a, b, c, x0), kqVal(a, b, c, x1)) * Math.sign(a), ys = [k, 0, c];
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (a > 0) y1 = Math.max(y1, Math.min(fe, k + Math.max(6, y1 - k + 2))); else y0 = Math.min(y0, -Math.min(fe, -k + Math.max(6, k - y0 + 2)));
  const pad = Math.max(1, Math.ceil((y1 - y0) * .1));
  return { x0, x1, y0: Math.floor(y0 - pad), y1: Math.ceil(y1 + pad) };
}
function kqGraf(a, b, c, o = {}) {
  const f = x => a * x * x + b * x + c, box = Object.assign(kqBox(a, b, c, o.xs), o.box || {});
  return kqPlot(Object.assign({}, box, { fns: [{ f, c: 'tr', w: 4 }], pts: o.pts || [], vl: o.vl || [], label: o.label || 'Graf fungsi kuadratik', nums: o.nums }));
}
// kad persamaan (games)
const kqCard = (t, sub) => `<svg viewBox="0 0 340 150" role="img" aria-label="${esc(t)}" font-family="Inter, sans-serif"><rect x="6" y="6" width="328" height="138" rx="20" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/><text x="170" y="${sub ? 64 : 76}" style="fill:var(--tx)" font-size="${t.length > 22 ? 22 : 27}" font-weight="800" text-anchor="middle" dominant-baseline="central">${t}</text>${sub ? `<text x="170" y="108" style="fill:var(--mu)" font-size="16" font-weight="700" text-anchor="middle" dominant-baseline="central">${sub}</text>` : ''}</svg>`;
// paksi kosong untuk soalan melukis
const kqBlank = () => kqPlot({ x0: -6, x1: 6, y0: -6, y1: 6, nums: false, grid: false, label: 'Paksi untuk melakar graf' });

/* =================== data bersama =================== */
const KQBS = [
  ['Jika nilai c dalam f(x) = ax² + bx + c bertambah, graf bergerak ke atas.', true, 'Nilai c ialah pintasan-y; c bertambah, graf bergerak ke atas.'],
  ['Perubahan nilai c mengubah kedudukan paksi simetri graf.', false, `Paksi simetri x = −${fr('b', '2a')} tidak bergantung pada c.`],
  ['Graf y = 3x² lebih sempit daripada graf y = x².', true, '3 > 1, maka graf y = 3x² lebih sempit.'],
  ['Graf y = −4x² lebih lebar daripada graf y = 2x².', false, 'Abaikan tanda: 4 > 2, maka graf y = −4x² lebih sempit.'],
  ['Jika a dan b mempunyai tanda yang sama, paksi simetri berada di sebelah kiri paksi-y.', true, `x = −${fr('b', '2a')} bernilai negatif apabila a dan b sama tanda.`],
  ['Jika b = 0, paksi simetri graf ialah paksi-y.', true, `x = −${fr(0, '2a')} = 0, iaitu paksi-y.`],
  ['Nilai a yang negatif menghasilkan graf berbentuk ∪.', false, 'a < 0 menghasilkan graf berbentuk ∩.'],
  ['Perubahan nilai b tidak mengubah pintasan-y graf.', true, 'Pintasan-y ialah c, jadi perubahan b tidak mengubahnya.'],
  ['Graf y = x² + 5 ialah graf y = x² yang bergerak 5 unit ke kanan.', false, 'Graf itu bergerak 5 unit ke atas, bukan ke kanan.'],
  ['Graf y = 2x² − 3 memotong paksi-y pada titik (0, −3).', true, 'Pintasan-y = c = −3.']
];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 1.1.1 Ungkapan & Fungsi Kuadratik ---------- */
  kenal: [
    ({ e }) => ({ q: `Tentukan sama ada ${e} ialah ungkapan kuadratik dalam satu pemboleh ubah. Beri sebab.` }),
    ({ e }) => ({ q: `Adakah ${e} suatu ungkapan kuadratik dalam satu pemboleh ubah? Jelaskan.` }),
    ({ e }) => ({ q: `Ungkapan ${e} diberi. Nyatakan sama ada ungkapan itu ialah ungkapan kuadratik dalam satu pemboleh ubah dan berikan alasan.` }),
    ({ e, ok, ans, why }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${e} ${ok ? 'bukan' : 'ialah'} ungkapan kuadratik dalam satu pemboleh ubah. Adakah ${N} betul?` }, salah(N, ans, 'Semak bilangan pemboleh ubah dan kuasa tertinggi pemboleh ubah itu.')); }
  ],
  abc: [
    ({ e }) => ({ q: `Nyatakan nilai a, b dan c bagi ungkapan kuadratik ${e} apabila ditulis dalam bentuk ax² + bx + c.` }),
    ({ e }) => ({ q: `Bandingkan ${e} dengan ax² + bx + c. Kenal pasti nilai a, b dan c.` }),
    ({ e }) => ({ q: `Fungsi kuadratik f(x) = ${e}. Nyatakan nilai a, b dan c.` }),
    ({ e, b, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata bagi ungkapan ${e}, nilai b = ${fmt(-b)}. Adakah ${N} betul?` }, salah(N, ans, 'Tanda di hadapan sebutan x mesti diambil bersama sebagai sebahagian daripada nilai b.')); }
  ],
  nilaiF: [
    ({ e, t }) => ({ q: `Diberi f(x) = ${e}. Cari nilai f(${fmt(t)}).` }),
    ({ e, t }) => ({ q: `Hitung nilai fungsi kuadratik f(x) = ${e} apabila x = ${fmt(t)}.` }),
    ({ e, t }) => ({ q: `Lengkapkan: Jika f(x) = ${e}, maka f(${fmt(t)}) = ___` }),
    ({ e, t }) => ({ q: `Cari imej bagi ${fmt(t)} di bawah fungsi kuadratik f(x) = ${e}.` })
  ],
  bentuk: [
    ({ e }) => ({ q: `Nyatakan bentuk graf f(x) = ${e} dan sama ada graf itu mempunyai titik maksimum atau titik minimum.` }),
    ({ e }) => ({ q: `Tanpa melukis, tentukan sama ada graf y = ${e} berbentuk ∪ atau ∩. Seterusnya nyatakan sama ada graf itu mempunyai titik maksimum atau minimum.` }),
    ({ e }) => ({ q: `Fungsi kuadratik f(x) = ${e} diberi. Adakah graf f mempunyai titik maksimum atau minimum? Beri sebab.` }),
    ({ e, a, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata graf f(x) = ${e} mempunyai titik ${kqTp(-a)}. Adakah ${N} betul?` }, salah(N, ans, `Pekali x² ialah ${fmt(a)}, iaitu ${a > 0 ? 'positif' : 'negatif'}.`)); }
  ],
  paksi: [
    ({ e, tp }) => ({ q: `Cari persamaan paksi simetri dan koordinat titik ${tp} bagi graf f(x) = ${e}.` }),
    ({ e, tp }) => ({ q: `Bagi fungsi kuadratik f(x) = ${e}, tentukan paksi simetri graf dan titik ${tp}nya.` }),
    ({ e, tp, h, k }) => ({ q: `Graf y = ${e} mempunyai satu titik ${tp}. Cari koordinat titik itu dan nyatakan nilai ${tp} y.`, ans: `Titik ${tp} (${fmt(h)}, ${fmt(k)}); nilai ${tp} ${fmt(k)}` }),
    ({ e, h, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati paksi simetri graf f(x) = ${e} ialah x = ${fmt(-h)}. Adakah ${N} betul? Seterusnya cari titik maksimum atau minimum graf itu.` }, salah(N, ans, `Rumus paksi simetri ialah x = −${fr('b', '2a')}; tanda negatif tidak boleh tertinggal.`)); }
  ],
  banyakSatu: [
    ({ e, t }) => ({ q: `Diberi f(x) = ${e}. Cari satu lagi nilai x, selain ${fmt(t)}, supaya f(x) = f(${fmt(t)}).` }),
    ({ e, t }) => ({ q: `Fungsi f(x) = ${e} ialah hubungan banyak kepada satu. Cari nilai x yang lain yang mempunyai imej yang sama dengan imej bagi x = ${fmt(t)}.` }),
    ({ e, t, v, t2 }) => ({ q: `Titik (${fmt(t)}, ${fmt(v)}) terletak pada graf y = ${e}. Nyatakan koordinat satu lagi titik pada graf itu yang mempunyai nilai y yang sama.`, ans: `(${fmt(t2)}, ${fmt(v)})` })
  ],
  grafBaca: [
    () => ({ q: 'Rajah di bawah menunjukkan graf suatu fungsi kuadratik. Nyatakan persamaan paksi simetri dan koordinat titik maksimum atau minimum graf itu.' }),
    () => ({ q: 'Berdasarkan graf di bawah, nyatakan (a) persamaan paksi simetri, (b) koordinat titik maksimum atau minimum.' }),
    ({ tp }) => ({ q: `Graf y = f(x) ditunjukkan di bawah. Adakah graf itu mempunyai titik maksimum atau minimum? Nyatakan koordinatnya dan persamaan paksi simetri.` })
  ],
  k111: [
    ({ v1 }) => ({ q: `Diberi fungsi kuadratik f(x) = ${v1.e}. Nyatakan (a) bentuk graf, (b) pintasan-y, (c) persamaan paksi simetri, (d) koordinat titik ${kqTp(v1.a)}.`, ans: `(a) ${kqShape(v1.a)} (b) ${fmt(v1.c)} (c) x = ${fmt(v1.h)} (d) (${fmt(v1.h)}, ${fmt(v1.k)})`, work: [`(a) a = ${fmt(v1.a)} ${v1.a > 0 ? '> 0, bentuk ∪' : '< 0, bentuk ∩'}`, `(b) Pintasan-y = c = ${fmt(v1.c)}`, `(c) x = ${fr(`−(${fmt(v1.b)})`, `2 × ${par(v1.a)}`)} = ${fmt(v1.h)}`, `(d) f(${fmt(v1.h)}) = ${kqSub(v1.a, v1.b, v1.c, v1.h)} = ${fmt(v1.k)}`] }),
    ({ v2 }) => ({ q: `Graf fungsi f(x) = x² + px + q mempunyai titik minimum (${fmt(v2.h)}, ${fmt(v2.k)}). Cari nilai p dan nilai q.`, ans: `p = ${fmt(v2.p)}, q = ${fmt(v2.q)}`, work: [`Paksi simetri: x = −${fr('p', '2 × 1')} = ${fmt(v2.h)}`, `p = ${fmt(v2.p)}`, `f(${fmt(v2.h)}) = ${fmt(v2.k)}: (${fmt(v2.h)})² ${v2.p < 0 ? '−' : '+'} ${Math.abs(v2.p)}(${fmt(v2.h)}) + q = ${fmt(v2.k)}`, `${fmt(v2.h * v2.h + v2.p * v2.h)} + q = ${fmt(v2.k)}, maka q = ${fmt(v2.q)}`] }),
    ({ v3 }) => ({ q: `Titik (${fmt(v3.x1)}, m) dan (${fmt(v3.x2)}, m) terletak pada graf f(x) = x² + bx + c. Nilai minimum f ialah ${fmt(v3.k)}. Cari (a) persamaan paksi simetri, (b) nilai b dan c, (c) nilai m.`, ans: `(a) x = ${fmt(v3.h)} (b) b = ${fmt(v3.b)}, c = ${fmt(v3.c)} (c) m = ${fmt(v3.m)}`, work: [`(a) Paksi simetri di tengah-tengah: x = (${fmt(v3.x1)} + ${par(v3.x2)}) ÷ 2 = ${fmt(v3.h)}`, `(b) −${fr('b', 2)} = ${fmt(v3.h)} → b = ${fmt(v3.b)}`, `f(${fmt(v3.h)}) = ${fmt(v3.k)}: ${fmt(v3.h * v3.h + v3.b * v3.h)} + c = ${fmt(v3.k)} → c = ${fmt(v3.c)}`, `(c) m = f(${fmt(v3.x1)}) = ${kqSub(1, v3.b, v3.c, v3.x1)} = ${fmt(v3.m)}`] }),
    ({ v4 }) => ({ q: `Diberi f(x) = ${kqT([[v4.a, 'x²'], [v4.b, 'x']])} + c. Nilai ${kqTp(v4.a)} f ialah ${fmt(v4.k)}. Cari nilai c dan koordinat titik ${kqTp(v4.a)}.`, ans: `c = ${fmt(v4.c)}; titik ${kqTp(v4.a)} (${fmt(v4.h)}, ${fmt(v4.k)})`, work: [`Paksi simetri: x = ${fr(`−(${fmt(v4.b)})`, `2 × ${par(v4.a)}`)} = ${fmt(v4.h)}`, `f(${fmt(v4.h)}) = ${kqSub(v4.a, v4.b, 0, v4.h)} + c = ${fmt(v4.k)}`, `${fmt(v4.a * v4.h * v4.h + v4.b * v4.h)} + c = ${fmt(v4.k)} → c = ${fmt(v4.c)}`] })
  ],

  /* ---------- 1.1.3 Kesan a, b, c ---------- */
  kesanA: [
    ({ e1, e2, w }) => ({ q: `Graf f(x) = ${e1} dan g(x) = ${e2} dilukis pada satah yang sama. Graf manakah lebih ${w}? Beri sebab.` }),
    ({ e1, e2, w }) => ({ q: `Antara graf f(x) = ${e1} dan graf g(x) = ${e2}, yang manakah lebih ${w}?` }),
    ({ e1, e2 }) => ({ q: `Bandingkan kelebaran graf f(x) = ${e1} dan graf g(x) = ${e2}. Nyatakan graf yang lebih sempit.` }),
    ({ e1, e2, w, other, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi f(x) = ${e1} dan g(x) = ${e2}. ${N} berkata graf ${other} lebih ${w}. Adakah ${N} betul?` }, salah(N, ans, 'Kelebaran graf bergantung pada nilai a (abaikan tanda).')); }
  ],
  kesanC: [
    ({ e1, e2 }) => ({ q: `Graf f(x) = ${e1} berubah menjadi graf g(x) = ${e2}. Huraikan perubahan pada graf itu.` }),
    ({ e1, c2 }) => ({ q: `Pemalar c dalam fungsi f(x) = ${e1} ditukar kepada ${fmt(c2)}. Nyatakan kesan perubahan ini terhadap graf f.` }),
    ({ e1, e2, c1, c2, d }) => ({ q: `Bandingkan graf y = ${e1} dan graf y = ${e2}. Apakah yang sama dan apakah yang berbeza?`, ans: `Bentuk dan paksi simetri sama; pintasan-y berbeza (${fmt(c1)} dan ${fmt(c2)}): graf kedua ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'} daripada graf pertama` }),
    ({ e1, c2 }) => ({ q: `Lengkapkan: Jika c dalam f(x) = ${e1} ditukar kepada ${fmt(c2)}, graf bergerak ___ unit ke ___ dan pintasan-y menjadi ___.` })
  ],
  tandaA: [
    ({ e1, a2 }) => ({ q: `Nilai a dalam f(x) = ${e1} ditukar kepada ${a2}. Apakah kesan perubahan ini terhadap bentuk graf?` }),
    ({ e1, e2, ans2 }) => ({ q: `Graf f(x) = ${e1} dan g(x) = ${e2} dibandingkan. Nyatakan dua perbezaan antara kedua-dua graf itu.`, ans: ans2 }),
    ({ e1, a2 }) => ({ q: `Jika pekali x² dalam y = ${e1} diubah menjadi ${a2}, adakah graf baharu berbentuk ∪ atau ∩, dan adakah ia lebih lebar atau lebih sempit?` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  kesanB: [
    ({ e1, b1, b2 }) => ({ q: `Nilai b dalam f(x) = ${e1} ditukar daripada ${fmt(b1)} kepada ${fmt(b2)}. Huraikan kesan perubahan ini terhadap paksi simetri graf.` }),
    ({ e1, e2 }) => ({ q: `Graf f(x) = ${e1} dan g(x) = ${e2} dilukis pada satah yang sama. Bandingkan paksi simetri dan pintasan-y kedua-dua graf.` }),
    ({ e1, b2, h2 }) => ({ q: `Diberi f(x) = ${e1}. Jika nilai b ditukar kepada ${fmt(b2)}, di manakah kedudukan paksi simetri graf baharu? Nyatakan persamaannya.`, ans: `x = ${kqFr(h2[0], h2[1])}, ${kqSide(h2[0])}` })
  ],
  tandaRajah: [
    () => ({ q: 'Rajah di bawah menunjukkan graf f(x) = ax² + bx + c. Nyatakan (a) sama ada a positif atau negatif, (b) nilai c, (c) sama ada b positif atau negatif.' }),
    () => ({ q: 'Berdasarkan graf y = ax² + bx + c di bawah, tentukan tanda a, nilai c dan tanda b. Beri sebab bagi setiap jawapan.' }),
    () => ({ q: 'Graf fungsi kuadratik f(x) = ax² + bx + c ditunjukkan di bawah. Apakah yang boleh disimpulkan tentang a, b dan c?' })
  ],
  fungsiBaru: [
    ({ e1, d }) => ({ q: `Graf f(x) = ${e1} digerakkan ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'}. Tulis fungsi kuadratik bagi graf baharu.` }),
    ({ e1, c2 }) => ({ q: `Graf f(x) = ${e1} diubah supaya pintasan-y menjadi ${fmt(c2)}, tanpa mengubah bentuk dan paksi simetrinya. Tulis fungsi bagi graf baharu.` }),
    ({ e1, d, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Graf f(x) = ${e1} digerakkan ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'}. ${N} berkata fungsi baharu ialah g(x) = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Gerakan ke atas atau ke bawah hanya mengubah pemalar c.')); }
  ],
  k113: [
    ({ v1 }) => ({ q: `Graf f(x) = x² ${v1.b < 0 ? '−' : '+'} ${Math.abs(v1.b)}x + c mempunyai titik minimum (${fmt(v1.h)}, ${fmt(v1.k)}). (a) Cari nilai c. (b) Nilai c diubah supaya graf hanya menyentuh paksi-x. Cari nilai c yang baharu. (c) Huraikan perubahan pada graf.`, ans: `(a) c = ${fmt(v1.c)} (b) c = ${fmt(v1.c2)} (c) graf bergerak ${Math.abs(v1.k)} unit ke atas`, work: [`(a) f(${fmt(v1.h)}) = ${fmt(v1.h * v1.h + v1.b * v1.h)} + c = ${fmt(v1.k)} → c = ${fmt(v1.c)}`, `(b) Graf menyentuh paksi-x apabila nilai minimum = 0: ${fmt(v1.h * v1.h + v1.b * v1.h)} + c = 0 → c = ${fmt(v1.c2)}`, `(c) c bertambah ${fmt(v1.c2 - v1.c)}, graf bergerak ${Math.abs(v1.k)} unit ke atas; bentuk dan paksi simetri x = ${fmt(v1.h)} tidak berubah.`] }),
    ({ v2 }) => ({ q: `Diberi f(x) = ${v2.e1} dan g(x) = ${v2.e2}. Bandingkan (a) bentuk graf, (b) paksi simetri, (c) pintasan-y kedua-dua graf.`, ans: `(a) f: ∪, g: ∩ (b) f: x = ${fmt(v2.h1)}, g: x = ${fmt(v2.h2)} (c) sama, iaitu ${fmt(v2.c)}`, work: [`(a) Pekali x²: f ialah 1 > 0 (∪); g ialah −1 < 0 (∩).`, `(b) f: x = ${fr(`−(${fmt(v2.b)})`, `2 × 1`)} = ${fmt(v2.h1)}; g: x = ${fr(`−(${fmt(v2.b)})`, `2 × (−1)`)} = ${fmt(v2.h2)}`, `(c) Kedua-dua graf mempunyai c = ${fmt(v2.c)}.`] }),
    ({ v3 }) => ({ q: `Graf y = ${v3.e1} berubah menjadi graf y = ${v3.e2}. (a) Pekali manakah yang berubah? (b) Cari paksi simetri setiap graf. (c) Nyatakan hubungan antara kedua-dua graf.`, ans: `(a) b (b) x = ${fmt(v3.h)} dan x = ${fmt(-v3.h)} (c) graf kedua ialah pantulan graf pertama pada paksi-y`, work: [`(a) Hanya b berubah: ${fmt(v3.b)} → ${fmt(-v3.b)}`, `(b) x = ${fr(`−(${fmt(v3.b)})`, `2 × ${v3.a}`)} = ${fmt(v3.h)}; x = ${fr(`−(${fmt(-v3.b)})`, `2 × ${v3.a}`)} = ${fmt(-v3.h)}`, `(c) Bentuk dan pintasan-y (${fmt(v3.c)}) sama, paksi simetri bertentangan: graf kedua ialah pantulan graf pertama pada paksi-y.`] }),
    ({ v4 }) => ({ q: `Graf f(x) = −x² + ${2 * v4.h}x + c melalui titik (${fmt(v4.x1)}, ${fmt(v4.y1)}). (a) Cari nilai c. (b) Cari titik maksimum graf. (c) Jika c bertambah ${v4.d}, nyatakan titik maksimum yang baharu.`, ans: `(a) c = ${fmt(v4.c)} (b) (${fmt(v4.h)}, ${fmt(v4.k)}) (c) (${fmt(v4.h)}, ${fmt(v4.k + v4.d)})`, work: [`(a) ${fmt(v4.y1)} = −(${fmt(v4.x1)})² + ${2 * v4.h}(${fmt(v4.x1)}) + c → c = ${fmt(v4.c)}`, `(b) x = ${fr(`−${2 * v4.h}`, '2 × (−1)')} = ${fmt(v4.h)}; f(${fmt(v4.h)}) = ${fmt(v4.k)}`, `(c) Graf bergerak ${v4.d} unit ke atas: (${fmt(v4.h)}, ${fmt(v4.k + v4.d)})`] })
  ],

  /* ---------- 1.1.4 Persamaan & Punca ---------- */
  bentukAm: [
    ({ eq }) => ({ q: `Ungkapkan persamaan ${eq} dalam bentuk am ax² + bx + c = 0.` }),
    ({ eq, A, B, C, ans }) => ({ q: `Tulis persamaan ${eq} dalam bentuk am, kemudian nyatakan nilai a, b dan c.`, ans: `${ans}; a = ${fmt(A)}, b = ${fmt(B)}, c = ${fmt(C)}` }),
    ({ eq }) => ({ q: `Susun semula persamaan kuadratik ${eq} supaya sebelah kanan ialah sifar dan a positif.` }),
    ({ eq, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${eq} dalam bentuk am sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Apabila sesuatu sebutan dipindahkan ke sebelah lain, tandanya bertukar.')); }
  ],
  semakPunca: [
    ({ e, t }) => ({ q: `Tentukan sama ada x = ${fmt(t)} ialah punca bagi persamaan ${e} = 0.` }),
    ({ e, t }) => ({ q: `Adakah ${fmt(t)} merupakan punca persamaan kuadratik ${e} = 0? Tunjukkan pengiraan anda.` }),
    ({ e, t }) => ({ q: `Dengan kaedah penggantian, tentusahkan sama ada ${fmt(t)} ialah punca bagi ${e} = 0.` }),
    ({ e, t, ok, v }) => { const N = vnama(); return { q: `${N} berkata ${fmt(t)} ialah punca bagi ${e} = 0. Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul kerana hasil gantian ialah 0` : `Tidak betul kerana hasil gantian ialah ${fmt(v)} ≠ 0` }; }
  ],
  fungsiSituasi: [
    ({ sit, what, fn }) => ({ q: `${sit} Bentukkan fungsi kuadratik bagi ${what}, ${fn}.` }),
    ({ sit, what }) => ({ q: `${sit} Ungkapkan ${what} dalam sebutan x sebagai suatu fungsi kuadratik.` }),
    ({ sit, what, fn, poly }) => ({ q: `${sit} Tunjukkan bahawa ${what}, ${fn} = ${poly}.` })
  ],
  puncaGraf: [
    () => ({ q: 'Rajah di bawah menunjukkan graf y = f(x). Nyatakan punca-punca bagi persamaan f(x) = 0.' }),
    () => ({ q: 'Berdasarkan graf fungsi kuadratik di bawah, apakah punca persamaan f(x) = 0? Jelaskan.' }),
    ({ ans }) => ({ q: 'Graf di bawah memotong paksi-x pada dua titik. Apakah kaitan titik-titik itu dengan punca persamaan f(x) = 0? Nyatakan punca itu.', ans: `Pintasan-x ialah punca: ${ans}` })
  ],
  cariK: [
    ({ e, r }) => ({ q: `Diberi x = ${fmt(r)} ialah punca bagi persamaan ${e} = 0, dengan k ialah pemalar. Cari nilai k.` }),
    ({ e, r }) => ({ q: `Persamaan kuadratik ${e} = 0 mempunyai punca ${fmt(r)}. Hitung nilai k.` }),
    ({ e, r, k, s }) => ({ q: `Jika ${fmt(r)} ialah salah satu punca bagi ${e} = 0, cari nilai k dan seterusnya punca yang satu lagi.`, ans: `k = ${fmt(k)}; punca yang satu lagi ialah ${fmt(s)}` })
  ],
  bentukPers: [
    ({ sit }) => ({ q: `${sit} Bentukkan persamaan kuadratik dan ungkapkan dalam bentuk am.` }),
    ({ sit }) => ({ q: `${sit} Tulis satu persamaan kuadratik bagi situasi ini dalam bentuk ax² + bx + c = 0.` }),
    ({ sit, ans }) => ({ q: `${sit} Tunjukkan bahawa ${ans}.` })
  ],
  k114: [
    ({ v1 }) => ({ q: `Panjang sebuah taman berbentuk segi empat tepat ialah ${v1.p} m lebih daripada lebarnya, x m. Luas taman itu ialah ${v1.q} m². (a) Bentukkan fungsi luas, L(x). (b) Bentukkan persamaan kuadratik dalam bentuk am. (c) Tentusahkan bahawa x = ${v1.r} ialah punca dan jelaskan mengapa punca ${fmt(v1.s)} ditolak.`, ans: `(a) L(x) = x² + ${v1.p}x (b) x² + ${v1.p}x − ${v1.q} = 0 (c) ${v1.r}² + ${v1.p}(${v1.r}) − ${v1.q} = 0; ${fmt(v1.s)} ditolak kerana lebar tidak boleh negatif`, work: [`(a) L(x) = x(x + ${v1.p}) = x² + ${v1.p}x`, `(b) x² + ${v1.p}x = ${v1.q} → x² + ${v1.p}x − ${v1.q} = 0`, `(c) ${v1.r * v1.r} + ${v1.p * v1.r} − ${v1.q} = 0 ✓`, `x = ${fmt(v1.s)} juga memuaskan persamaan tetapi lebar mesti positif.`] }),
    ({ v2 }) => ({ q: `Diberi ${fmt(v2.r)} ialah punca bagi persamaan 2x² + px ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)} = 0. (a) Cari nilai p. (b) Tentusahkan bahawa x = ${fr(1, 2)} juga ialah punca persamaan itu.`, ans: `(a) p = ${fmt(v2.p)} (b) 2(${fr(1, 2)})² ${v2.p < 0 ? '−' : '+'} ${Math.abs(v2.p)}(${fr(1, 2)}) ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)} = 0`, work: [`(a) 2(${fmt(v2.r)})² + p(${fmt(v2.r)}) ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)} = 0`, `${2 * v2.r * v2.r + v2.r} ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)}p = 0 → p = ${fmt(v2.p)}`, `(b) 2(${fr(1, 4)}) ${v2.p < 0 ? '−' : '+'} ${kqFr(Math.abs(v2.p), 2)} ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)} = ${fr(1, 2)} ${v2.p < 0 ? '−' : '+'} ${kqFr(Math.abs(v2.p), 2)} ${v2.r < 0 ? '−' : '+'} ${Math.abs(v2.r)} = 0 ✓`] }),
    ({ v3 }) => ({ q: `Persamaan kuadratik x² + bx + c = 0 mempunyai punca ${fmt(v3.r)} dan ${fmt(v3.s)}. (a) Cari nilai b dan c. (b) Nyatakan pintasan-y dan pintasan-x graf y = x² + bx + c. (c) Cari persamaan paksi simetri graf itu.`, ans: `(a) b = ${fmt(v3.b)}, c = ${fmt(v3.c)} (b) pintasan-y ${fmt(v3.c)}; pintasan-x ${fmt(v3.r)} dan ${fmt(v3.s)} (c) x = ${v3.hs}`, work: [`(a) ${kqFac(v3.r)}${kqFac(v3.s)} = 0 → ${kqPoly(1, v3.b, v3.c)} = 0`, `(b) Pintasan-y = c = ${fmt(v3.c)}; punca ialah pintasan-x.`, `(c) x = (${fmt(v3.r)} + ${par(v3.s)}) ÷ 2 = ${v3.hs}`] }),
    ({ v4 }) => ({ q: `Hasil tambah kuasa dua bagi dua nombor bulat positif berturutan ialah ${v4.q}. Katakan nombor yang lebih kecil ialah x. (a) Tunjukkan bahawa x² + x − ${(v4.q - 1) / 2} = 0. (b) Tentusahkan bahawa x = ${v4.r} ialah punca. (c) Nyatakan kedua-dua nombor itu.`, ans: `(a) x² + (x + 1)² = ${v4.q} (b) ${v4.r}² + ${v4.r} − ${(v4.q - 1) / 2} = 0 (c) ${v4.r} dan ${v4.r + 1}`, work: [`(a) x² + (x + 1)² = ${v4.q} → 2x² + 2x + 1 − ${v4.q} = 0 → 2x² + 2x − ${v4.q - 1} = 0`, `Bahagi dengan 2: x² + x − ${(v4.q - 1) / 2} = 0`, `(b) ${v4.r * v4.r} + ${v4.r} − ${(v4.q - 1) / 2} = 0 ✓`, `(c) ${v4.r} dan ${v4.r + 1}; semak: ${v4.r * v4.r} + ${(v4.r + 1) ** 2} = ${v4.q}`] })
  ],

  /* ---------- 1.1.6 Pemfaktoran & Masalah ---------- */
  faktorA1: [
    ({ e }) => ({ q: `Selesaikan persamaan kuadratik ${e} = 0.` }),
    ({ e }) => ({ q: `Cari punca-punca bagi ${e} = 0 dengan kaedah pemfaktoran.` }),
    ({ e }) => ({ q: `Dengan memfaktorkan, selesaikan ${e} = 0.` }),
    ({ e }) => ({ q: `Lengkapkan: ${e} = 0 → (x ___)(x ___) = 0, maka x = ___ atau x = ___` }),
    ({ e, p, q, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menyelesaikan ${e} = 0 dan mendapat x = ${fmt(-p)} atau x = ${fmt(-q)}. Adakah ${N} betul?` }, salah(N, ans, 'Jika (x − p)(x − q) = 0, maka x = p atau x = q. Tanda punca berlawanan dengan tanda nombor dalam faktor.')); }
  ],
  faktorSepunya: [
    ({ eq }) => ({ q: `Selesaikan ${eq}.` }),
    ({ eq }) => ({ q: `Cari punca-punca bagi persamaan ${eq} dengan memfaktorkan faktor sepunya.` }),
    ({ eq }) => ({ q: `Selesaikan persamaan kuadratik ${eq}.` }),
    ({ eq, r, ans }) => { const N = vnama(); return { q: `${N} membahagikan kedua-dua belah ${eq} dengan x dan mendapat x = ${r} sahaja. Adakah jawapan ${N} lengkap?`, ans: `Tidak lengkap. Jawapan penuh: ${ans}`, pre: ['Membahagi dengan x menghilangkan punca x = 0. Faktorkan x sebagai faktor sepunya.'] }; }
  ],
  bezaKD: [
    ({ eq }) => ({ q: `Selesaikan ${eq}.` }),
    ({ eq }) => ({ q: `Cari punca-punca bagi ${eq} menggunakan beza dua kuasa dua.` }),
    ({ eq }) => ({ q: `Dengan pemfaktoran, selesaikan persamaan ${eq}.` }),
    ({ eq, pos, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata punca bagi ${eq} ialah x = ${pos} sahaja. Adakah ${N} betul?` }, salah(N, ans, 'Persamaan ini mempunyai dua punca, satu positif dan satu negatif.')); }
  ],
  faktorA: [
    ({ e }) => ({ q: `Selesaikan persamaan kuadratik ${e} = 0.` }),
    ({ e }) => ({ q: `Dengan menggunakan kaedah pemfaktoran, cari punca-punca bagi ${e} = 0.` }),
    ({ e }) => ({ q: `Faktorkan ${e}, seterusnya selesaikan ${e} = 0.` })
  ],
  susun: [
    ({ eq }) => ({ q: `Selesaikan persamaan ${eq}.` }),
    ({ eq }) => ({ q: `Tulis ${eq} dalam bentuk am, kemudian selesaikan dengan pemfaktoran.` }),
    ({ eq }) => ({ q: `Cari nilai-nilai x yang memuaskan ${eq}.` })
  ],
  lakar: [
    ({ e, tp }) => ({ q: `Lakar graf f(x) = ${e}. Tandakan pintasan-x, pintasan-y, paksi simetri dan titik ${tp}.` }),
    ({ e }) => ({ q: `Bagi fungsi f(x) = ${e}, (a) selesaikan f(x) = 0, (b) seterusnya lakar graf y = f(x).` }),
    ({ e }) => ({ q: `Lakarkan graf y = ${e} dengan menunjukkan semua titik penting.` })
  ],
  k116: [
    ({ v1 }) => ({ q: `Panjang sekeping papan kenyataan berbentuk segi empat tepat ialah ${v1.p} cm lebih daripada lebarnya. Luasnya ialah ${v1.q} cm². Cari panjang dan lebar papan kenyataan itu.`, ans: `Lebar = ${v1.r} cm, panjang = ${v1.r + v1.p} cm`, work: [`Katakan lebar = x cm: x(x + ${v1.p}) = ${v1.q}`, `x² + ${v1.p}x − ${v1.q} = 0`, `(x − ${v1.r})(x + ${v1.r + v1.p}) = 0`, `x = ${v1.r} atau x = −${v1.r + v1.p} (ditolak kerana lebar mesti positif)`, `Semak: ${v1.r} × ${v1.r + v1.p} = ${v1.q} ✓`] }),
    ({ v2 }) => ({ q: `Tinggi sebiji bola, h m, t saat selepas dilontar ke atas ialah h(t) = −5t² + ${v2.u}t. (a) Bilakah bola berada pada ketinggian ${v2.H} m? (b) Cari tinggi maksimum bola. (c) Bilakah bola jatuh semula ke tanah?`, ans: `(a) t = ${v2.t1} s dan t = ${v2.t2} s (b) ${v2.hm} m (c) t = ${v2.tl} s`, work: [`(a) −5t² + ${v2.u}t = ${v2.H} → −5t² + ${v2.u}t − ${v2.H} = 0`, `Bahagi dengan −5: t² − ${v2.u / 5}t + ${v2.H / 5} = 0 → (t − ${v2.t1})(t − ${v2.t2}) = 0`, `t = ${v2.t1} (naik) atau t = ${v2.t2} (turun)`, `(b) Paksi simetri t = ${fr(`−${v2.u}`, '2 × (−5)')} = ${v2.tm}; h(${v2.tm}) = ${v2.hm} m`, `(c) −5t² + ${v2.u}t = 0 → −5t(t − ${v2.tl}) = 0 → t = ${v2.tl} s (t = 0 ialah masa dilontar)`] }),
    ({ v3 }) => ({ q: `Sisi sebuah segi tiga bersudut tegak ialah x cm, (x + ${v3.k}) cm dan hipotenusnya (x + ${2 * v3.k}) cm. (a) Tunjukkan bahawa x² − ${2 * v3.k}x − ${3 * v3.k * v3.k} = 0. (b) Cari nilai x. (c) Hitung perimeter segi tiga itu.`, ans: `(b) x = ${3 * v3.k} (c) ${12 * v3.k} cm`, work: [`(a) x² + (x + ${v3.k})² = (x + ${2 * v3.k})²`, `x² + x² + ${2 * v3.k}x + ${v3.k * v3.k} = x² + ${4 * v3.k}x + ${4 * v3.k * v3.k}`, `x² − ${2 * v3.k}x − ${3 * v3.k * v3.k} = 0`, `(b) (x − ${3 * v3.k})(x + ${v3.k}) = 0 → x = ${3 * v3.k} (x = −${v3.k} ditolak)`, `(c) Sisi: ${3 * v3.k}, ${4 * v3.k}, ${5 * v3.k}; perimeter = ${12 * v3.k} cm`] }),
    ({ v4 }) => ({ q: `Sebuah kolam ${v4.m} m × ${v4.n} m dikelilingi oleh laluan yang sama lebar, x m. Jumlah luas kolam dan laluan ialah ${v4.A} m². (a) Tunjukkan bahawa 2x² + ${v4.m + v4.n}x − ${v4.C} = 0. (b) Cari lebar laluan itu.`, ans: `(b) ${v4.r} m`, work: [`(a) (${v4.m} + 2x)(${v4.n} + 2x) = ${v4.A}`, `4x² + ${2 * (v4.m + v4.n)}x + ${v4.m * v4.n} − ${v4.A} = 0 → 4x² + ${2 * (v4.m + v4.n)}x − ${2 * v4.C} = 0`, `Bahagi dengan 2: 2x² + ${v4.m + v4.n}x − ${v4.C} = 0`, `(b) (x − ${v4.r})(2x + ${2 * v4.r + v4.m + v4.n}) = 0`, `x = ${v4.r} atau x = ${kqFr(-(2 * v4.r + v4.m + v4.n), 2)} (ditolak)`] })
  ]
};

/* =================== pembina soalan (r = kqRG atau kqRW) =================== */
const KQ = {};
/* ---------- 1.1.1 ---------- */
KQ.kenal = (r, k) => {
  const ok = k == null ? r.f() < .5 : k % 2 === 0;
  const a = r.n(-6, 6), b = r.n(-9, 9), c = r.n(-9, 9);
  let e, why;
  if (ok) {
    const t = r.i(0, 3);
    if (t === 0) { e = kqPoly(a, b, c); why = 'Ada satu pemboleh ubah, x, dan kuasa tertingginya ialah 2.'; }
    else if (t === 1) { e = kqT([[c, ''], [a, 'x²']]); why = `Ada satu pemboleh ubah, x, dan kuasa tertingginya ialah 2 (a = ${fmt(a)}, b = 0).`; }
    else if (t === 2) { e = kqPoly(a, b, 0, 'y'); why = 'Ada satu pemboleh ubah, y, dan kuasa tertingginya ialah 2.'; }
    else { e = `x(${kqT([[1, 'x'], [b, '']])})`; why = `x(${kqT([[1, 'x'], [b, '']])}) = ${kqPoly(1, b, 0)}; kuasa tertinggi x ialah 2.`; }
  } else {
    const t = r.i(0, 4);
    if (t === 0) { e = kqT([[a, 'x³'], [b, 'x²'], [c, '']]); why = 'Kuasa tertinggi x ialah 3, bukan 2.'; }
    else if (t === 1) { e = kqT([[a, 'x'], [c, '']]); why = 'Tiada sebutan x²; kuasa tertinggi x ialah 1.'; }
    else if (t === 2) { e = `${kqT([[a, 'x²']])} ${b < 0 ? '−' : '+'} ${fr(Math.abs(b), 'x')}`; why = 'Ada pemboleh ubah x pada penyebut (kuasa −1).'; }
    else if (t === 3) { e = kqT([[a, 'x²'], [b, 'y'], [c, '']]); why = 'Ada dua pemboleh ubah, x dan y.'; }
    else { e = `${kqT([[a, 'x²']])} ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${rt('x')}`; why = `Kuasa bagi x dalam ${rt('x')} ialah ${fr(1, 2)}, bukan nombor bulat.`; }
  }
  const ans = ok ? `Ya. ${why}` : `Bukan. ${why}`;
  return GEN_LQ('kenal', { e, ok, why, ans, work: [why] });
};
KQ.abc = r => {
  const a = r.n(-6, 6), b = r.n(-9, 9), c = r.i(-9, 9);
  const order = r.p([[0, 1, 2], [2, 1, 0], [1, 0, 2], [2, 0, 1], [1, 2, 0], [0, 1, 2]]), terms = [[a, 'x²'], [b, 'x'], [c, '']];
  const e = kqT(order.map(i => terms[i])), std = kqPoly(a, b, c);
  const ans = `a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`;
  const work = (e === std ? [] : [`Susun mengikut kuasa menurun: ${std}`]).concat(['Bandingkan dengan ax² + bx + c; tanda di hadapan setiap sebutan diambil bersama.', ans]);
  return GEN_LQ('abc', { e, b, ans, work });
};
KQ.nilaiF = r => {
  const a = r.n(-4, 4), b = r.i(-8, 8), c = r.i(-9, 9), t = r.n(-4, 4), v = kqVal(a, b, c, t);
  const e = kqPoly(a, b, c);
  return GEN_LQ('nilaiF', { e, t, ans: fmt(v), work: [`f(${fmt(t)}) = ${kqSub(a, b, c, t)}`, `= ${kqSubV(a, b, c, t)}`, `= ${fmt(v)}`] });
};
KQ.bentuk = r => {
  const a = r.n(-5, 5), b = r.i(-9, 9), c = r.n(-9, 9), order = r.p([[0, 1, 2], [2, 1, 0], [1, 0, 2], [2, 0, 1]]), terms = [[a, 'x²'], [b, 'x'], [c, '']];
  const e = kqT(order.map(i => terms[i])), ans = `Bentuk ${kqShape(a)}; mempunyai titik ${kqTp(a)}`;
  const fig = kqGraf(a, b, c, { label: 'Lakaran bentuk graf' });
  return GEN_LQ('bentuk', { e, a, ans, work: [`Pekali x², a = ${fmt(a)} ${a > 0 ? '> 0' : '< 0'}.`, a > 0 ? 'a > 0: graf berbentuk ∪ dan mempunyai titik minimum.' : 'a < 0: graf berbentuk ∩ dan mempunyai titik maksimum.'] }, { figAns: fig });
};
function kqVtx(r, as, hr) {
  let a, h, k, b, c; do { a = r.p(as); h = r.i(-hr, hr); k = r.i(-8, 8); b = -2 * a * h; c = k + a * h * h; } while (!h || Math.abs(c) > 20 || Math.abs(b) > 16);
  return { a, h, k, b, c };
}
KQ.paksi = r => {
  const { a, h, k, b, c } = kqVtx(r, [1, 1, 2, -1, -2, 3, -3], 4), tp = kqTp(a), e = kqPoly(a, b, c);
  const ans = `Paksi simetri x = ${fmt(h)}; titik ${tp} (${fmt(h)}, ${fmt(k)})`;
  const work = [`a = ${fmt(a)}, b = ${fmt(b)}`, `x = −${fr('b', '2a')} = ${fr(`−(${fmt(b)})`, `2 × ${par(a)}`)} = ${fmt(h)}`, `f(${fmt(h)}) = ${kqSub(a, b, c, h)} = ${fmt(k)}`, `a ${a > 0 ? '> 0' : '< 0'}, maka (${fmt(h)}, ${fmt(k)}) ialah titik ${tp}.`];
  const figAns = kqGraf(a, b, c, { vl: [{ x: h, l: `x = ${fmt(h)}` }], pts: [{ x: h, y: k, l: `(${fmt(h)}, ${fmt(k)})`, at: a > 0 ? 's' : 'n' }] });
  return GEN_LQ('paksi', { e, tp, h, k, ans, work }, { figAns });
};
KQ.banyakSatu = r => {
  const { a, h, b, c } = kqVtx(r, [1, 1, -1, 2], 3);
  let t; do { t = r.i(h - 4, h + 4); } while (t === h);
  const t2 = 2 * h - t, v = kqVal(a, b, c, t), e = kqPoly(a, b, c);
  const work = [`f(${fmt(t)}) = ${kqSub(a, b, c, t)} = ${fmt(v)}`, `Paksi simetri: x = ${fr(`−(${fmt(b)})`, `2 × ${par(a)}`)} = ${fmt(h)}`, `${fmt(t)} berada ${Math.abs(t - h)} unit dari paksi simetri, maka nilai x yang lagi satu = ${fmt(h)} ${t2 > h ? '+' : '−'} ${Math.abs(t - h)} = ${fmt(t2)}`, `Semak: f(${fmt(t2)}) = ${kqSub(a, b, c, t2)} = ${fmt(kqVal(a, b, c, t2))}`, 'Dua nilai x mempunyai imej yang sama: hubungan banyak kepada satu.'];
  return GEN_LQ('banyakSatu', { e, t, t2, v, ans: `x = ${fmt(t2)}`, work });
};
KQ.grafBaca = r => {
  let a, h, k; do { a = r.p([1, -1, 1, -1, 2, -2]); h = r.i(-3, 3); k = r.i(-5, 5); } while (Math.abs(k) < 1 || (a > 0 && k > 3) || (a < 0 && k < -3));
  const b = -2 * a * h, c = k + a * h * h, tp = kqTp(a);
  const fig = kqGraf(a, b, c, { label: 'Graf fungsi kuadratik' });
  const figAns = kqGraf(a, b, c, { vl: [{ x: h, l: `x = ${fmt(h)}` }], pts: [{ x: h, y: k, l: `(${fmt(h)}, ${fmt(k)})`, at: a > 0 ? 's' : 'n' }] });
  return GEN_LQ('grafBaca', { tp, ans: `Paksi simetri x = ${fmt(h)}; titik ${tp} (${fmt(h)}, ${fmt(k)})`, work: [`Graf berbentuk ${kqShape(a)}, maka graf mempunyai titik ${tp}.`, `Titik ${tp} ialah (${fmt(h)}, ${fmt(k)}).`, `Paksi simetri ialah garis mencancang yang melalui titik itu: x = ${fmt(h)}.`] }, { fig, figAns });
};
KQ.k111 = r => {
  const p1 = kqVtx(r, [1, 2, -1, -2, 3], 3), v1 = Object.assign(p1, { e: kqPoly(p1.a, p1.b, p1.c) });
  let h, k; do { h = r.n(-4, 4); k = r.i(-9, 6); } while (h * h + k === 0);
  const v2 = { h, k, p: -2 * h, q: k + h * h };
  let v3; do { const hh = r.i(-3, 3), d = r.i(1, 4), kk = r.i(-8, 2); v3 = { h: hh, x1: hh - d, x2: hh + d, k: kk, b: -2 * hh, c: kk + hh * hh, m: kk + d * d }; } while (!v3.b || !v3.c);
  let v4; do { const a = r.p([1, 2, 3, -1, -2]), hh = r.n(-3, 3), kk = r.i(-9, 9); v4 = { a, h: hh, k: kk, b: -2 * a * hh, c: kk + a * hh * hh }; } while (!v4.c);
  return GEN_LQ('k111', { v1, v2, v3, v4 });
};

/* ---------- 1.1.3 ---------- */
const KQAV = [.5, 1, 2, 3, 4, 5];
KQ.kesanA = (r, k) => {
  let a1, a2; do { a1 = r.p(KQAV) * (r.f() < .7 ? 1 : -1); a2 = r.p(KQAV) * (r.f() < .7 ? 1 : -1); } while (Math.abs(a1) === Math.abs(a2));
  const b = r.p([0, 0, r.n(-6, 6)]), c = r.i(-6, 6), wide = k == null ? r.f() < .5 : k % 2 === 1, w = wide ? 'lebar' : 'sempit';
  const e1 = kqPolyA(a1, b, c), e2 = kqPolyA(a2, b, c), fNarrow = Math.abs(a1) > Math.abs(a2), pickF = wide ? !fNarrow : fNarrow;
  const nm = pickF ? 'f' : 'g', other = pickF ? 'g' : 'f', aa = pickF ? a1 : a2, ab = pickF ? a2 : a1;
  const ans = `Graf ${nm}, kerana nilai a (abaikan tanda) ${kqAbsA(aa)} ${wide ? '<' : '>'} ${kqAbsA(ab)}`;
  const narrowName = fNarrow ? 'f' : 'g';
  return GEN_LQ('kesanA', { e1, e2, w, other, ans, work: [`Pekali x²: f → ${kqAv(a1)}, g → ${kqAv(a2)}`, `Abaikan tanda: ${kqAbsA(a1)} dan ${kqAbsA(a2)}.`, `Semakin besar nilai a (abaikan tanda), semakin sempit graf. Maka graf ${narrowName} lebih sempit dan graf ${narrowName === 'f' ? 'g' : 'f'} lebih lebar.`] }, {});
};
KQ.kesanC = r => {
  const a = r.n(-3, 3), b = r.i(-6, 6), c1 = r.i(-8, 8); let c2; do { c2 = r.i(-8, 8); } while (c2 === c1);
  const d = c2 - c1, e1 = kqPoly(a, b, c1), e2 = kqPoly(a, b, c2);
  const ans = `Graf bergerak ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'}; pintasan-y berubah daripada ${fmt(c1)} kepada ${fmt(c2)}`;
  const box = kqBox(a, b, Math.min(c1, c2)), box2 = kqBox(a, b, Math.max(c1, c2));
  const figAns = kqPlot({ x0: box.x0, x1: box.x1, y0: Math.min(box.y0, box2.y0), y1: Math.max(box.y1, box2.y1), fns: [{ f: x => a * x * x + b * x + c1, c: 'mu', dash: true }, { f: x => a * x * x + b * x + c2, c: 'tr', w: 4 }], pts: [{ x: 0, y: c1, c: 'mu' }, { x: 0, y: c2, c: 'pu' }], label: 'Graf asal (putus-putus) dan graf baharu' });
  return GEN_LQ('kesanC', { e1, e2, c1, c2, d, ans, work: [`Hanya c berubah: ${fmt(c1)} → ${fmt(c2)} (${d > 0 ? 'bertambah' : 'berkurang'} ${Math.abs(d)}).`, `Pintasan-y = c, jadi graf bergerak ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'}.`, 'a dan b tidak berubah, maka bentuk dan paksi simetri kekal.'] }, { figAns });
};
KQ.tandaA = r => {
  const a1 = r.p(KQAV) * (r.f() < .5 ? 1 : -1), a2 = -Math.sign(a1) * r.p(KQAV);
  const b = r.p([0, r.n(-5, 5)]), c = r.i(-6, 6), e1 = kqPolyA(a1, b, c), e2 = kqPolyA(a2, b, c);
  const wd = Math.abs(a2) > Math.abs(a1) ? 'lebih sempit' : Math.abs(a2) < Math.abs(a1) ? 'lebih lebar' : 'sama lebar';
  const ans = `Bentuk graf bertukar daripada ${kqShape(a1)} kepada ${kqShape(a2)} (titik ${kqTp(a1)} menjadi titik ${kqTp(a2)}); graf baharu ${wd}`;
  const wg = wd === 'lebih sempit' ? 'g lebih sempit' : wd === 'lebih lebar' ? 'g lebih lebar' : 'kedua-dua graf sama lebar';
  const ans2 = `f berbentuk ${kqShape(a1)} (titik ${kqTp(a1)}), g berbentuk ${kqShape(a2)} (titik ${kqTp(a2)}); graf ${wg}`;
  return GEN_LQ('tandaA', { e1, e2, a2: kqAv(a2), ans, ans2, work: [`a: ${kqAv(a1)} → ${kqAv(a2)}; tanda a bertukar.`, `${a2 > 0 ? 'a > 0: bentuk ∪, titik minimum' : 'a < 0: bentuk ∩, titik maksimum'}.`, `Abaikan tanda: ${kqAbsA(a1)} → ${kqAbsA(a2)}, maka graf ${wd}.`] });
};
KQ.bs = (r, k) => { const [s, ok, why] = k == null ? r.p(KQBS) : KQBS[k % KQBS.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
KQ.kesanB = r => {
  let a, h1, h2; do { a = r.p([1, 1, -1, 2]); h1 = r.i(-3, 3); h2 = r.i(-3, 3); } while (h1 === h2);
  const b1 = -2 * a * h1, b2 = -2 * a * h2, c = r.i(-6, 6), e1 = kqPoly(a, b1, c), e2 = kqPoly(a, b2, c), d = h2 - h1;
  const ans = `Paksi simetri beralih daripada x = ${fmt(h1)} kepada x = ${fmt(h2)} (${Math.abs(d)} unit ke ${d > 0 ? 'kanan' : 'kiri'}); bentuk dan pintasan-y (${fmt(c)}) tidak berubah`;
  const figAns = kqPlot(Object.assign(kqBox(a, Math.abs(b1) > Math.abs(b2) ? b1 : b2, c, [h1, h2]), { fns: [{ f: x => a * x * x + b1 * x + c, c: 'mu', dash: true }, { f: x => a * x * x + b2 * x + c, c: 'tr', w: 4 }], vl: [{ x: h1, c: 'mu' }, { x: h2, c: 'pu', l: `x = ${fmt(h2)}` }], label: 'Graf asal dan graf baharu dengan paksi simetri masing-masing' }));
  return GEN_LQ('kesanB', { e1, e2, b1, b2, h2: [h2, 1], ans, work: [`f: x = ${fr(`−(${fmt(b1)})`, `2 × ${par(a)}`)} = ${fmt(h1)}`, `Baharu: x = ${fr(`−(${fmt(b2)})`, `2 × ${par(a)}`)} = ${fmt(h2)}`, `Perubahan b hanya mengalihkan paksi simetri; a dan c tidak berubah.`] }, { figAns });
};
KQ.tandaRajah = r => {
  let a, h, k, c; do { a = r.p([1, -1, .5, -.5]); h = r.n(-3, 3); k = r.i(-5, 5); c = k + a * h * h; } while (!Number.isInteger(c) || !c || Math.abs(c) > 8 || (a > 0 && k >= c) || (a < 0 && k <= c) || !k);
  const b = -2 * a * h, sb = b > 0 ? 'positif' : 'negatif';
  const fig = kqGraf(a, b, c, { xs: [h], pts: [{ x: 0, y: c, c: 'pu' }] });
  const ans = `a ${a > 0 ? 'positif' : 'negatif'}; c = ${fmt(c)}; b ${sb}`;
  return GEN_LQ('tandaRajah', { ans, work: [`Graf berbentuk ${kqShape(a)}, maka a ${a > 0 ? 'positif' : 'negatif'}.`, `Graf memotong paksi-y pada ${fmt(c)}, maka c = ${fmt(c)}.`, `Paksi simetri x = ${fmt(h)} ${kqSide(h)}, maka a dan b ${h < 0 ? 'sama tanda' : 'berlainan tanda'}: b ${sb}.`] }, { fig });
};
KQ.fungsiBaru = r => {
  const a = r.n(-4, 4), b = r.i(-7, 7), c = r.i(-8, 8); let d; do { d = r.n(-6, 6); } while (Math.abs(c + d) > 12);
  const e1 = kqPoly(a, b, c), ans = `g(x) = ${kqPoly(a, b, c + d)}`, wrong = b + d === 0 ? kqPoly(a + d, b, c) : kqPoly(a, b + d, c);
  return GEN_LQ('fungsiBaru', { e1, d, c2: c + d, wrong, ans, work: [`Gerakan ${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'} menukar pintasan-y: c = ${fmt(c)} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${fmt(c + d)}.`, 'a dan b tidak berubah.', ans] });
};
KQ.k113 = r => {
  let v1; do { const h = r.n(-4, 4), k = r.i(-9, -1); v1 = { h, k, b: -2 * h, c: k + h * h, c2: h * h }; } while (!v1.c);
  const bb = 2 * r.n(-4, 4), c = r.n(-8, 8);
  const v2 = { b: bb, c, e1: kqPoly(1, bb, c), e2: kqPoly(-1, bb, c), h1: -bb / 2, h2: bb / 2 };
  const a3 = r.p([1, 2, 3]), h3 = r.n(-3, 3), b3 = -2 * a3 * h3, c3 = r.n(-9, 9);
  const v3 = { a: a3, b: b3, c: c3, h: h3, e1: kqPoly(a3, b3, c3), e2: kqPoly(a3, -b3, c3) };
  const h4 = r.i(1, 4); let x1; do { x1 = r.i(-2, 5); } while (x1 === h4);
  const y1 = r.i(-6, 8), c4 = y1 + x1 * x1 - 2 * h4 * x1;
  const v4 = { h: h4, x1, y1, c: c4, k: h4 * h4 + c4, d: r.i(2, 6) };
  return GEN_LQ('k113', { v1, v2, v3, v4 });
};

/* ---------- 1.1.4 ---------- */
KQ.bentukAm = r => {
  const t = r.i(0, 4); let eq, A, B, C, ex;
  if (t === 0) { const p = r.n(-7, 7), q = r.n(2, 30); eq = `x(${kqT([[1, 'x'], [p, '']])}) = ${q}`; A = 1; B = p; C = -q; ex = `Kembangkan: ${kqPoly(1, p, 0)} = ${q}`; }
  else if (t === 1) { const p = r.n(-5, 5); let q; do { q = r.i(1, 20); } while (q === p * p); eq = `(${kqT([[1, 'x'], [p, '']])})² = ${q}`; A = 1; B = 2 * p; C = p * p - q; ex = `Kembangkan: ${kqPoly(1, 2 * p, p * p)} = ${q}`; }
  else if (t === 2) { const a = r.i(2, 5), b = r.n(-9, 9), c = r.n(-9, 9); eq = `${a}x² = ${kqT([[b, 'x'], [c, '']])}`; A = a; B = -b; C = -c; ex = 'Pindahkan semua sebutan ke sebelah kiri dan tukar tandanya.'; }
  else if (t === 3) { const p = r.n(-6, 6), q = r.n(-6, 6); let v; do { v = r.n(-12, 12); } while (v === p * q); eq = `(${kqT([[1, 'x'], [p, '']])})(${kqT([[1, 'x'], [q, '']])}) = ${fmt(v)}`; A = 1; B = p + q; C = p * q - v; ex = `Kembangkan: ${kqPoly(1, p + q, p * q)} = ${fmt(v)}`; }
  else { const p = r.i(2, 9), q = r.n(-9, 9); eq = `x(${p} − x) = ${fmt(q)}`; A = 1; B = -p; C = q; ex = `Kembangkan: ${kqT([[p, 'x'], [-1, 'x²']])} = ${fmt(q)}; pindahkan semua sebutan ke sebelah kanan supaya a positif.`; }
  const ans = `${kqPoly(A, B, C)} = 0`, wrong = C ? `${kqPoly(A, B, -C)} = 0` : `${kqPoly(A, -B, C)} = 0`;
  return GEN_LQ('bentukAm', { eq, A, B, C, ans, wrong, work: [ex, ans] });
};
KQ.semakPunca = (r, k) => {
  let p, q; do { p = r.i(-7, 7); q = r.i(-7, 7); } while (p === q || (!p && !q));
  const a = r.p([1, 1, 1, 2, -1]), A = a, B = -a * (p + q), C = a * p * q, e = kqPoly(A, B, C);
  const ok = k == null ? r.f() < .5 : k % 2 === 0;
  let t; if (ok) t = r.p([p, q]); else { do { t = r.i(-6, 6); } while (t === p || t === q); }
  const v = kqVal(A, B, C, t);
  const ans = ok ? `Ya, x = ${fmt(t)} ialah punca kerana hasil gantian ialah 0` : `Bukan, kerana hasil gantian ialah ${fmt(v)} ≠ 0`;
  return GEN_LQ('semakPunca', { e, t, ok, v, ans, work: [`Gantikan x = ${fmt(t)}: ${kqSub(A, B, C, t)}`, `= ${kqSubV(A, B, C, t)}`, `= ${fmt(v)}${ok ? '' : ' ≠ 0'}`, ok ? `Maka ${fmt(t)} ialah punca.` : `Maka ${fmt(t)} bukan punca.`] });
};
KQ.fungsiSituasi = r => {
  const t = r.i(0, 4); let sit, what, fn, poly, work;
  if (t === 0) { const p = r.i(2, 9); sit = `Panjang sebuah segi empat tepat ialah ${p} cm lebih daripada lebarnya, x cm.`; what = 'luas segi empat tepat itu'; fn = 'L(x)'; poly = kqPoly(1, p, 0); work = [`Panjang = (x + ${p}) cm`, `L(x) = x(x + ${p})`, `= ${poly}`]; }
  else if (t === 1) { const p = r.i(1, 7); sit = `Panjang sebuah bilik ialah ${p} m kurang daripada dua kali lebarnya, x m.`; what = 'luas lantai bilik itu'; fn = 'L(x)'; poly = kqPoly(2, -p, 0); work = [`Panjang = (2x − ${p}) m`, `L(x) = x(2x − ${p})`, `= ${poly}`]; }
  else if (t === 2) { const p = r.i(1, 6); sit = `Sisi sebuah petak segi empat sama ialah (x + ${p}) m.`; what = 'luas petak itu'; fn = 'L(x)'; poly = kqPoly(1, 2 * p, p * p); work = [`L(x) = (x + ${p})²`, `= (x + ${p})(x + ${p})`, `= ${poly}`]; }
  else if (t === 3) { const p = r.i(1, 8); sit = `Tapak sebuah segi tiga ialah 2x cm dan tingginya (x + ${p}) cm.`; what = 'luas segi tiga itu'; fn = 'L(x)'; poly = kqPoly(1, p, 0); work = [`L(x) = ${fr(1, 2)} × 2x × (x + ${p})`, `= x(x + ${p})`, `= ${poly}`]; }
  else { const m = r.p([10, 12, 15, 20]), n = r.p([6, 8, 9, 10]); sit = `Sekeping gambar berukuran ${m} cm × ${n} cm diletakkan dalam bingkai yang lebarnya x cm di setiap sisi.`; what = 'jumlah luas gambar dan bingkai'; fn = 'J(x)'; poly = kqPoly(4, 2 * (m + n), m * n); work = [`Ukuran keseluruhan: (${m} + 2x) cm × (${n} + 2x) cm`, `J(x) = (${m} + 2x)(${n} + 2x)`, `= ${m * n} + ${2 * m}x + ${2 * n}x + 4x²`, `= ${poly}`]; }
  return GEN_LQ('fungsiSituasi', { sit, what, fn, poly, ans: `${fn} = ${poly}`, work });
};
KQ.puncaGraf = r => {
  let p, q; do { p = r.i(-5, 4); q = r.i(-4, 5); } while (q - p < 2 || q - p > 7 || !p || !q);
  const a = r.p([1, -1, 1]), B = -a * (p + q), C = a * p * q, ans = `x = ${fmt(p)} dan x = ${fmt(q)}`;
  const fig = kqGraf(a, B, C, { xs: [p, q] });
  const figAns = kqGraf(a, B, C, { xs: [p, q], pts: [{ x: p, y: 0, c: 'pk', l: fmt(p), at: a > 0 ? 'nw' : 'sw' }, { x: q, y: 0, c: 'pk', l: fmt(q), at: a > 0 ? 'ne' : 'se' }] });
  return GEN_LQ('puncaGraf', { ans, work: [`Graf memotong paksi-x pada x = ${fmt(p)} dan x = ${fmt(q)}.`, 'Pada titik itu, y = f(x) = 0, maka nilai-nilai x itu ialah punca bagi f(x) = 0.'] }, { fig, figAns });
};
KQ.cariK = (r, k) => {
  let rr, s; do { rr = r.n(-6, 6); s = r.n(-6, 6); } while (rr === s || rr + s === 0);
  const t = k == null ? r.i(0, 1) : k % 2;
  if (t === 0) {   // x² + kx + c = 0, c diketahui
    const c = rr * s, kk = -(rr + s), e = `x² + kx ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
    return GEN_LQ('cariK', { e, r: rr, k: kk, s, ans: `k = ${fmt(kk)}`, work: [`Gantikan x = ${fmt(rr)}: (${fmt(rr)})² + k(${fmt(rr)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0`, `${fmt(rr * rr + c)} ${rr < 0 ? '−' : '+'} ${Math.abs(rr) === 1 ? '' : Math.abs(rr)}k = 0`, `k = ${fmt(kk)}`, `Semak: ${kqPoly(1, kk, c)} = ${kqFac(rr)}${kqFac(s)}; punca yang satu lagi ialah ${fmt(s)}.`] });
  }
  const b = -(rr + s), kk = rr * s, e = `${kqPoly(1, b, 0)} + k`;
  return GEN_LQ('cariK', { e, r: rr, k: kk, s, ans: `k = ${fmt(kk)}`, work: [`Gantikan x = ${fmt(rr)}: ${kqSub(1, b, 0, rr)} + k = 0`, `${fmt(rr * rr + b * rr)} + k = 0`, `k = ${fmt(kk)}`, `Semak: ${kqPoly(1, b, kk)} = ${kqFac(rr)}${kqFac(s)}; punca yang satu lagi ialah ${fmt(s)}.`] });
};
KQ.bentukPers = r => {
  const t = r.i(0, 4); let sit, A, B, C, work;
  if (t === 0) { const p = r.i(2, 8), x = r.i(3, 12), q = x * (x + p); sit = `Panjang sebuah segi empat tepat ialah (x + ${p}) cm dan lebarnya x cm. Luasnya ialah ${q} cm².`; A = 1; B = p; C = -q; work = [`x(x + ${p}) = ${q}`, `x² + ${p}x = ${q}`]; }
  else if (t === 1) { const x = r.i(4, 20), q = x * (x + 1); sit = `Hasil darab dua nombor bulat positif berturutan ialah ${q}. Katakan nombor yang lebih kecil ialah x.`; A = 1; B = 1; C = -q; work = [`x(x + 1) = ${q}`, `x² + x = ${q}`]; }
  else if (t === 2) { const p = r.i(3, 6), s = r.i(1, 2), x = r.i(5, 10), q = (x + p) * (x - s); sit = `Sisi sebuah segi empat sama ialah x cm. Panjangnya ditambah ${p} cm dan lebarnya dikurangkan ${s} cm untuk membentuk segi empat tepat seluas ${q} cm².`; A = 1; B = p - s; C = -p * s - q; work = [`(x + ${p})(x − ${s}) = ${q}`, `${kqPoly(1, p - s, -p * s)} = ${q}`]; }
  else if (t === 3) { const t1 = r.i(1, 2), t2 = r.i(3, 4), u = 5 * (t1 + t2), H = 5 * t1 * t2; sit = `Tinggi sebiji bola, h m, selepas t saat ialah h = −5t² + ${u}t. Bola itu berada pada ketinggian ${H} m. (Gunakan pemboleh ubah t.)`; A = 5; B = -u; C = H; work = [`−5t² + ${u}t = ${H}`, `Pindahkan semua sebutan ke sebelah kanan supaya a positif.`]; }
  else { const k = r.i(1, 4); sit = `Sisi-sisi sebuah segi tiga bersudut tegak ialah x cm dan (x + ${k}) cm, manakala hipotenusnya (x + ${2 * k}) cm.`; A = 1; B = -2 * k; C = -3 * k * k; work = [`x² + (x + ${k})² = (x + ${2 * k})²`, `2x² + ${2 * k}x + ${k * k} = x² + ${4 * k}x + ${4 * k * k}`]; }
  const v = t === 3 ? 't' : 'x', ans = `${kqPoly(A, B, C, v)} = 0`;
  return GEN_LQ('bentukPers', { sit, ans, work: work.concat([ans]) });
};
KQ.k114 = r => {
  const p = r.i(2, 6), rr = r.i(3, 9), v1 = { p, r: rr, q: rr * (rr + p), s: -(rr + p) };
  const r2 = r.n(-5, 5), v2 = { r: r2, p: -(2 * r2 + 1) };
  let a3, b3; do { a3 = r.n(-6, 6); b3 = r.n(-6, 6); } while (a3 === b3);
  const v3 = { r: Math.min(a3, b3), s: Math.max(a3, b3), b: -(a3 + b3), c: a3 * b3, hs: kqFr(a3 + b3, 2) };
  const r4 = r.i(3, 12), v4 = { r: r4, q: r4 * r4 + (r4 + 1) ** 2 };
  return GEN_LQ('k114', { v1, v2, v3, v4 });
};

/* ---------- 1.1.6 ---------- */
KQ.faktorA1 = r => {
  let p, q; do { p = r.n(-9, 9); q = r.n(-9, 9); } while (p === q || p + q === 0 || Math.abs(p * q) > 60);
  const B = -(p + q), C = p * q, e = kqPoly(1, B, C), ans = kqOrI(p, q);
  return GEN_LQ('faktorA1', { e, p, q, ans, work: [`Cari dua nombor dengan hasil darab ${fmt(C)} dan hasil tambah ${fmt(B)}: ${fmt(-p)} dan ${fmt(-q)}.`, `${kqFac(p)}${kqFac(q)} = 0`, `${kqFac(p).replace(/[()]/g, '')} = 0 atau ${kqFac(q).replace(/[()]/g, '')} = 0`, ans] });
};
KQ.faktorSepunya = r => {
  const a = r.p([1, 2, 3, 4, 5, -1, -2]); let b; do { b = r.n(-12, 12); } while (Math.abs(b) === Math.abs(a));
  const form = r.f() < .6, eq = form ? `${kqPoly(a, b, 0)} = 0` : `${kqT([[a, 'x²']])} = ${kqT([[-b, 'x']])}`;
  const rtv = kqFr(-b, a), g = kqGcd(a, b) * Math.sign(a), ans = `x = 0 atau x = ${rtv}`;
  const inner = kqT([[a / g, 'x'], [b / g, '']]);
  const sorted = kqOr([[0, 1], [-b, a]]);
  return GEN_LQ('faktorSepunya', { eq, r: rtv, ans: sorted, work: (form ? [] : [`Bentuk am: ${kqPoly(a, b, 0)} = 0`]).concat([`Faktor sepunya ${g === 1 ? '' : g === -1 ? '−' : fmt(g)}x: ${g === 1 ? '' : g === -1 ? '−' : fmt(g)}x(${inner}) = 0`, `x = 0 atau ${inner} = 0`, sorted]) });
};
KQ.bezaKD = r => {
  const t = r.i(0, 2); let eq, n, m, work;
  if (t === 0) { m = r.i(2, 12); n = 1; eq = `x² − ${m * m} = 0`; work = [`x² − ${m}² = 0`, `(x − ${m})(x + ${m}) = 0`]; }
  else if (t === 1) { do { n = r.i(2, 5); m = r.i(1, 9); } while (kqGcd(n, m) !== 1); eq = `${n * n}x² − ${m * m} = 0`; work = [`(${n}x)² − ${m}² = 0`, `(${n}x − ${m})(${n}x + ${m}) = 0`]; }
  else { const k = r.i(2, 5); m = r.i(2, 6); n = 1; eq = `${k}x² − ${k * m * m} = 0`; work = [`Faktor sepunya ${k}: ${k}(x² − ${m * m}) = 0`, `${k}(x − ${m})(x + ${m}) = 0`]; }
  const pos = kqFr(m, n), ans = `x = ${kqFr(-m, n)} atau x = ${pos}`;
  return GEN_LQ('bezaKD', { eq, pos, ans, work: work.concat([ans]) });
};
KQ.faktorA = r => {
  let u, v, s; do { u = r.p([2, 3, 2, 5]); v = r.n(-7, 7); s = r.n(-5, 5); } while (kqGcd(u, v) !== 1 || v === u * s);
  const A = u, B = -(u * s + v), C = v * s, e = kqPoly(A, B, C), ans = kqOr([[v, u], [s, 1]]);
  return GEN_LQ('faktorA', { e, ans, work: [`a = ${A}, c = ${fmt(C)}: guna kaedah silang (${u}x dan x; ${fmt(-v)} dan ${fmt(-s)}).`, `Semak sebutan tengah: ${u}x × ${par(-s)} + x × ${par(-v)} = ${fmt(B)}x ✓`, `${kqFacA(u, v)}${kqFac(s)} = 0`, ans] });
};
KQ.susun = r => {
  let p, q; do { p = r.n(-7, 7); q = r.n(-7, 7); } while (p === q || p + q === 0);
  const S = p + q, Pr = p * q, t = r.i(0, 3); let eq, work = [];
  if (t === 0) { eq = `x(${kqT([[1, 'x'], [-S, '']])}) = ${fmt(-Pr)}`; work.push(`Kembangkan: ${kqPoly(1, -S, 0)} = ${fmt(-Pr)}`); }
  else if (t === 1) { eq = `x² = ${kqT([[S, 'x'], [-Pr, '']])}`; work.push('Pindahkan semua sebutan ke sebelah kiri.'); }
  else if (t === 2) { let m, n, R; do { m = r.n(-4, 4); n = -S - m; R = m * n - Pr; } while (!R || !n); eq = `(${kqT([[1, 'x'], [m, '']])})(${kqT([[1, 'x'], [n, '']])}) = ${fmt(R)}`; work.push(`Kembangkan: ${kqPoly(1, m + n, m * n)} = ${fmt(R)}`); }
  else { eq = `${kqT([[1, 'x²'], [Pr, '']])} = ${kqT([[S, 'x']])}`; work.push(`Pindahkan ${kqT([[S, 'x']])} ke sebelah kiri.`); }
  const ans = kqOrI(p, q);
  return GEN_LQ('susun', { eq, ans, work: work.concat([`Bentuk am: ${kqPoly(1, -S, Pr)} = 0`, `${kqFac(p)}${kqFac(q)} = 0`, ans]) });
};
KQ.lakar = r => {
  let p, q; do { p = r.i(-6, 3); q = r.i(-2, 6); } while (q - p < 2 || (p + q) % 2 || q - p > 8 || !p || !q);
  const a = r.p([1, 1, -1]), B = -a * (p + q), C = a * p * q, h = (p + q) / 2, k = kqVal(a, B, C, h), tp = kqTp(a), e = kqPoly(a, B, C);
  const figAns = kqGraf(a, B, C, { xs: [p, q], nums: false, vl: [{ x: h, l: `x = ${fmt(h)}` }], pts: [{ x: p, y: 0, c: 'pk', l: fmt(p), at: a > 0 ? 'nw' : 'sw' }, { x: q, y: 0, c: 'pk', l: fmt(q), at: a > 0 ? 'ne' : 'se' }, { x: 0, y: C, c: 'pu', l: fmt(C), at: h > 0 ? 'w' : 'e' }, { x: h, y: k, l: `(${fmt(h)}, ${fmt(k)})`, at: a > 0 ? 's' : 'n' }], label: `Lakaran graf y = ${e}` });
  const ans = `Bentuk ${kqShape(a)}; pintasan-x ${fmt(p)} dan ${fmt(q)}; pintasan-y ${fmt(C)}; paksi simetri x = ${fmt(h)}; titik ${tp} (${fmt(h)}, ${fmt(k)})`;
  const v = GEN_LQ('lakar', { e, tp, ans, work: [`a = ${fmt(a)} ${a > 0 ? '> 0: bentuk ∪' : '< 0: bentuk ∩'}; pintasan-y = ${fmt(C)}`, `${e} = 0 → ${a < 0 ? '−' : ''}${kqFac(p)}${kqFac(q)} = 0 → x = ${fmt(p)} atau x = ${fmt(q)}`, `Paksi simetri: x = (${fmt(p)} + ${par(q)}) ÷ 2 = ${fmt(h)}`, `f(${fmt(h)}) = ${fmt(k)} → titik ${tp} (${fmt(h)}, ${fmt(k)})`] }, { fig: kqBlank(), figAns });
  return Object.assign(v, { kind: 'lukis' });
};
KQ.k116 = r => {
  const p = r.i(2, 9), rr = r.i(4, 15), v1 = { p, r: rr, q: rr * (rr + p) };
  const t1 = r.i(1, 2), t2 = r.i(3, 5), u = 5 * (t1 + t2), tm = (t1 + t2) / 2;
  const v2 = { t1, t2, u, H: 5 * t1 * t2, tm: String(tm).replace('-', '−'), hm: String(-5 * tm * tm + u * tm), tl: u / 5 };
  const v3 = { k: r.i(1, 5) };
  const m = r.p([6, 8, 10, 12]), n = r.p([4, 6, 8]), x = r.i(1, 3), A = (m + 2 * x) * (n + 2 * x);
  const v4 = { m, n, r: x, A, C: (A - m * n) / 2 };
  return GEN_LQ('k116', { v1, v2, v3, v4 });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '1.1.1': {
    m: [() => KQ.kenal(kqRG), () => KQ.abc(kqRG), () => KQ.nilaiF(kqRG), () => KQ.bentuk(kqRG)],
    s: [() => KQ.paksi(kqRG), () => KQ.paksi(kqRG), () => KQ.banyakSatu(kqRG), () => KQ.grafBaca(kqRG)],
    k: [() => KQ.k111(kqRG)]
  },
  '1.1.3': {
    m: [() => KQ.kesanA(kqRG), () => KQ.kesanC(kqRG), () => KQ.tandaA(kqRG), () => KQ.bs(kqRG)],
    s: [() => KQ.kesanB(kqRG), () => KQ.tandaRajah(kqRG), () => KQ.fungsiBaru(kqRG)],
    k: [() => KQ.k113(kqRG)]
  },
  '1.1.4': {
    m: [() => KQ.bentukAm(kqRG), () => KQ.semakPunca(kqRG), () => KQ.fungsiSituasi(kqRG), () => KQ.puncaGraf(kqRG)],
    s: [() => KQ.cariK(kqRG), () => KQ.bentukPers(kqRG)],
    k: [() => KQ.k114(kqRG)]
  },
  '1.1.6': {
    m: [() => KQ.faktorA1(kqRG), () => KQ.faktorA1(kqRG), () => KQ.faktorSepunya(kqRG), () => KQ.bezaKD(kqRG)],
    s: [() => KQ.faktorA(kqRG), () => KQ.susun(kqRG), () => KQ.lakar(kqRG)],
    k: [() => KQ.k116(kqRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 1.1.1
WG.kenal = i => KQ.kenal(kqRW, i);
WG.abc = () => KQ.abc(kqRW);
WG.nilaiF = () => KQ.nilaiF(kqRW);
WG.bentuk = () => KQ.bentuk(kqRW);
WG.paksi = () => KQ.paksi(kqRW);
WG.banyakSatu = () => KQ.banyakSatu(kqRW);
WG.grafBaca = () => KQ.grafBaca(kqRW);
WG.k111 = () => KQ.k111(kqRW);
// 1.1.3
WG.kesanA = i => KQ.kesanA(kqRW, i);
WG.kesanC = () => KQ.kesanC(kqRW);
WG.tandaA = () => KQ.tandaA(kqRW);
WG.bs = i => KQ.bs(kqRW, [0, 3, 6, 9][i % 4] + wri(0, 1) * [1, 1, 1, -1][i % 4]);
WG.kesanB = () => KQ.kesanB(kqRW);
WG.tandaRajah = () => KQ.tandaRajah(kqRW);
WG.fungsiBaru = () => KQ.fungsiBaru(kqRW);
WG.k113 = () => KQ.k113(kqRW);
// 1.1.4
WG.bentukAm = () => KQ.bentukAm(kqRW);
WG.semakPunca = i => KQ.semakPunca(kqRW, i);
WG.fungsiSituasi = () => KQ.fungsiSituasi(kqRW);
WG.puncaGraf = () => KQ.puncaGraf(kqRW);
WG.cariK = i => KQ.cariK(kqRW, i);
WG.bentukPers = () => KQ.bentukPers(kqRW);
WG.k114 = () => KQ.k114(kqRW);
// 1.1.6
WG.faktorA1 = () => KQ.faktorA1(kqRW);
WG.faktorSepunya = () => KQ.faktorSepunya(kqRW);
WG.bezaKD = () => KQ.bezaKD(kqRW);
WG.faktorA = () => KQ.faktorA(kqRW);
WG.susun = () => KQ.susun(kqRW);
WG.lakar = () => KQ.lakar(kqRW);
WG.k116 = () => KQ.k116(kqRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '1.1.1': [['m', 'kenal', 5], ['m', 'abc', 5], ['m', 'nilaiF', 4], ['m', 'bentuk', 4], ['s', 'paksi', 4], ['s', 'banyakSatu', 2], ['s', 'grafBaca', 3], ['k', 'k111', 3]],
  '1.1.3': [['m', 'kesanA', 5], ['m', 'kesanC', 5], ['m', 'tandaA', 4], ['m', 'bs', 4], ['s', 'kesanB', 3], ['s', 'tandaRajah', 3], ['s', 'fungsiBaru', 3], ['k', 'k113', 3]],
  '1.1.4': [['m', 'bentukAm', 5], ['m', 'semakPunca', 5], ['m', 'fungsiSituasi', 4], ['m', 'puncaGraf', 4], ['s', 'cariK', 4], ['s', 'bentukPers', 5], ['k', 'k114', 3]],
  '1.1.6': [['m', 'faktorA1', 8], ['m', 'faktorSepunya', 5], ['m', 'bezaKD', 5], ['s', 'faktorA', 3], ['s', 'susun', 3], ['s', 'lakar', 3], ['k', 'k116', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan unik: jawapan + calon salah (teks), ditambah pengisi jika kurang
function kqOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const kqMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const kqNumFill = v => k => `x = ${fmt(v + (k % 2 ? 1 : -1) * Math.ceil(k / 2))}`;
const kqPairs = (p, q) => `x = ${fmt(Math.min(p, q))}, ${fmt(Math.max(p, q))}`;
const CQGEN = {
  bentuk: [
    () => {
      const a = nz(-5, 5), b = ri(-8, 8), c = nz(-9, 9), e = kqPoly(a, b, c), A = a > 0 ? '∪, titik minimum' : '∩, titik maksimum';
      return kqMcq(`Apakah bentuk graf f(x) = ${e}?`, kqCard(`f(x) = ${e}`), kqOpts(A, ['∪, titik minimum', '∩, titik maksimum', '∪, titik maksimum', '∩, titik minimum'], k => `${k}`));
    },
    () => {
      const a = nz(-6, 6), b = nz(-9, 9), c = nz(-9, 9), ord = pick([[2, 1, 0], [1, 0, 2], [2, 0, 1]]), terms = [[a, 'x²'], [b, 'x'], [c, '']];
      const e = kqT(ord.map(i => terms[i])), which = pick(['a', 'b', 'c']), val = { a, b, c }[which];
      return kqMcq(`Bagi ${e}, apakah nilai <b>${which}</b> dalam bentuk ax² + bx + c?`, kqCard(e), kqOpts(fmt(val), [fmt(-val), fmt(a), fmt(b), fmt(c), fmt(-a), fmt(-c)], k => fmt(val + k + 1)));
    },
    () => {
      const a = pick([1, -1]), h = nz(-3, 3), k = a > 0 ? ri(-4, -1) : ri(1, 4), b = -2 * a * h, c = k + a * h * h, ok = `${a > 0 ? 'a > 0' : 'a < 0'}, c ${c > 0 ? '> 0' : c < 0 ? '< 0' : '= 0'}`;
      const fig = kqGraf(a, b, c, { xs: [h] });
      const all = ['a > 0, c > 0', 'a > 0, c < 0', 'a < 0, c > 0', 'a < 0, c < 0', 'a > 0, c = 0', 'a < 0, c = 0'];
      return kqMcq('Graf y = ax² + bx + c ditunjukkan. Yang manakah <b>benar</b>?', fig, kqOpts(ok, all, k => all[k % 6]));
    }
  ],
  paksi: [
    () => {
      const h = nz(-5, 5), b = -2 * h, c = ri(-9, 9), e = kqPoly(1, b, c);
      return kqMcq(`Apakah paksi simetri graf y = ${e}?`, kqCard(`y = ${e}`), kqOpts(`x = ${fmt(h)}`, [`x = ${fmt(-h)}`, `x = ${fmt(b)}`, `x = ${fmt(-b)}`, `x = ${fmt(c)}`], kqNumFill(h)));
    },
    () => {
      const { a, h, k, b, c } = kqVtx(kqRG, [1, -1, 2, -2], 4), e = kqPoly(a, b, c), tp = kqTp(a);
      return kqMcq(`Titik ${tp} graf f(x) = ${e} ialah`, kqCard(`f(x) = ${e}`), kqOpts(`(${fmt(h)}, ${fmt(k)})`, [`(${fmt(-h)}, ${fmt(k)})`, `(${fmt(h)}, ${fmt(c)})`, `(${fmt(-h)}, ${fmt(kqVal(a, b, c, -h))})`, `(${fmt(k)}, ${fmt(h)})`], kk => `(${fmt(h)}, ${fmt(k + kk)})`));
    },
    () => {
      const h = ri(-4, 4), d = ri(1, 4), y = ri(-6, 6), x1 = h - d, x2 = h + d;
      const fig = kqPlot({ x0: Math.min(x1, 0) - 1, x1: Math.max(x2, 0) + 1, y0: Math.min(y, 0) - 2, y1: Math.max(y, 0) + 2, pts: [{ x: x1, y, c: 'pk', l: `(${fmt(x1)}, ${fmt(y)})`, at: 'n' }, { x: x2, y, c: 'pk', l: `(${fmt(x2)}, ${fmt(y)})`, at: 'n' }], label: 'Dua titik pada graf dengan nilai y sama' });
      return kqMcq(`Titik (${fmt(x1)}, ${fmt(y)}) dan (${fmt(x2)}, ${fmt(y)}) terletak pada graf suatu fungsi kuadratik. Paksi simetrinya ialah`, fig, kqOpts(`x = ${fmt(h)}`, [`x = ${fmt(y)}`, `x = ${fmt(d)}`, `x = ${fmt(x2 - x1)}`, `x = ${fmt(-h)}`], kqNumFill(h)));
    }
  ],
  kesan: [
    () => {
      const vals = shuffle(KQAV).slice(0, 4).map(v => v * (Math.random() < .3 ? -1 : 1)), big = vals.reduce((b, v, i) => (Math.abs(v) > Math.abs(vals[b]) ? i : b), 0);
      const fs = vals.map(v => `y = ${kqCa(v) === '' ? '' : kqCa(v)}x²`);
      const o = shuffle(fs);
      return { type: 'mcq', q: 'Graf manakah yang <b>paling sempit</b>?', fig: kqPlot({ x0: -4, x1: 4, y0: -6, y1: 6, fns: vals.map((v, i) => ({ f: x => v * x * x, c: ['tr', 'pk', 'am', 'gr'][i], w: 3 })), label: 'Empat graf y = ax²' }), opts: o, c: o.indexOf(fs[big]) };
    },
    () => {
      const a = pick([1, -1, 2]), b = ri(-5, 5), c1 = ri(-6, 6); let c2; do { c2 = ri(-6, 6); } while (c2 === c1);
      const d = c2 - c1, A = `${Math.abs(d)} unit ke ${d > 0 ? 'atas' : 'bawah'}`;
      return kqMcq(`Graf y = ${kqPoly(a, b, c1)} berubah menjadi y = ${kqPoly(a, b, c2)}. Graf itu bergerak`, kqCard(`c: ${fmt(c1)} → ${fmt(c2)}`, 'a dan b tidak berubah'), kqOpts(A, [`${Math.abs(d)} unit ke ${d > 0 ? 'bawah' : 'atas'}`, `${Math.abs(d)} unit ke kanan`, `${Math.abs(d)} unit ke kiri`, `${Math.abs(c2)} unit ke atas`], k => `${Math.abs(d) + k} unit ke ${d > 0 ? 'atas' : 'bawah'}`));
    },
    () => {
      let h1, h2; do { h1 = ri(-3, 3); h2 = ri(-3, 3); } while (h1 === h2);
      const c = ri(-5, 5), b2 = -2 * h2;
      return kqMcq(`Nilai b dalam y = ${kqPoly(1, -2 * h1, c)} ditukar kepada ${fmt(b2)}. Paksi simetri baharu ialah`, kqCard(`b: ${fmt(-2 * h1)} → ${fmt(b2)}`, 'a dan c tidak berubah'), kqOpts(`x = ${fmt(h2)}`, [`x = ${fmt(-h2)}`, `x = ${fmt(b2)}`, `x = ${fmt(h1)}`, `x = ${fmt(c)}`], kqNumFill(h2)));
    }
  ],
  punca: [
    () => {
      let p, q; do { p = nz(-7, 7); q = nz(-7, 7); } while (p === q);
      return kqMcq(`Punca bagi ${kqFac(p)}${kqFac(q)} = 0 ialah`, kqCard(`${kqFac(p)}${kqFac(q)} = 0`), kqOpts(kqPairs(p, q), [kqPairs(-p, -q), kqPairs(p, -q), kqPairs(-p, q), `x = ${fmt(p * q)}`], k => kqPairs(p + k, q)));
    },
    () => {
      let p, q; do { p = nz(-8, 8); q = nz(-8, 8); } while (p === q || p + q === 0);
      const e = kqPoly(1, -(p + q), p * q);
      return kqMcq(`Selesaikan ${e} = 0.`, kqCard(`${e} = 0`), kqOpts(kqPairs(p, q), [kqPairs(-p, -q), kqPairs(p, -q), kqPairs(-p, q), kqPairs(p + q, p * q)], k => kqPairs(p + k, q - k)));
    },
    () => {
      let rr, s; do { rr = nz(-6, 6); s = nz(-6, 6); } while (rr === s || rr + s === 0);
      const c = rr * s, kk = -(rr + s), e = `x² + kx ${c < 0 ? '−' : '+'} ${Math.abs(c)} = 0`;
      return kqMcq(`Diberi ${fmt(rr)} ialah punca bagi ${e}. Nilai k ialah`, kqCard(e, `punca x = ${fmt(rr)}`), kqOpts(`k = ${fmt(kk)}`, [`k = ${fmt(-kk)}`, `k = ${fmt(s)}`, `k = ${fmt(rr)}`, `k = ${fmt(c)}`], k => `k = ${fmt(kk + (k % 2 ? 1 : -1) * Math.ceil(k / 2))}`));
    }
  ]
};
const CQT = { bentuk: 'Bentuk & pekali', paksi: 'Paksi simetri & titik', kesan: 'Kesan a, b, c', punca: 'Punca & pemfaktoran' };
function kqCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.bentuk;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['bentuk', 'bentuk', 'paksi', 'kesan', 'punca'] : Object.keys(CQT);
  return kqCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return kqCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
