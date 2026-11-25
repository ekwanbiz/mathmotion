'use strict';
/* =================== MATRIKS · SOALAN BAB 2 MATRIKS (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "mx" / "MX".

/* =================== pembantu =================== */
const mxGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const mxFr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = mxGcd(n, d) || 1; n /= g; d /= g; return (n < 0 ? '−' : '') + Math.abs(n) + (d === 1 ? '' : '/' + d); };
const mxV = v => (typeof v === 'string' ? v : fmt(v));
// matriks HTML sebaris
const mxH = (M, c) => `<span class="vec" style="display:inline-grid;grid-template-columns:repeat(${M[0].length},auto);gap:2px 12px;text-align:center;--c:var(--${c || 'tr'})">${M.map(r => r.map(v => `<span>${mxV(v)}</span>`).join('')).join('')}</span>`;
// matriks teks (untuk pilihan jawapan games)
const mxT = M => '[' + M.map(r => r.map(mxV).join('  ')).join(' ; ') + ']';
const mxMul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mxAdd = (A, B, s = 1) => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
const mxSc = (k, A) => A.map(r => r.map(v => k * v));
const mxDet = A => A[0][0] * A[1][1] - A[0][1] * A[1][0];
const mxAdj = A => [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]];
const mxEq = (A, B) => JSON.stringify(A) === JSON.stringify(B);
const mxK = d => (d === 1 ? '' : d === -1 ? '−' : `${fr(1, par(d))} `);
const mxXY = [['<i>x</i>'], ['<i>y</i>']];
// songsang sebagai teks HTML
const mxInvH = A => { const d = mxDet(A), J = mxAdj(A); return J.every(r => r.every(v => v % d === 0)) ? mxH(mxSc(1 / d, J).map(r => r.map(v => v + 0))) : `${d < 0 ? '−' : ''}${fr(1, Math.abs(d))} ${mxH(J)}`; };
const mxInvT = A => { const d = mxDet(A), J = mxAdj(A); return J.every(r => r.every(v => v % d === 0)) ? mxT(mxSc(1 / d, J).map(r => r.map(v => v + 0))) : `${d < 0 ? '−' : ''}${fr(1, Math.abs(d))} ${mxT(J)}`; };
const mxRand = (r, m, n, lo = -6, hi = 9) => Array.from({ length: m }, () => Array.from({ length: n }, () => r.i(lo, hi)));
const MXRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const MXRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const mxOrd = M => `${M.length} × ${M[0].length}`;
const MXJ = [['Kedai A', 'Kedai B', 'Kedai C'], ['Kelas 5A', 'Kelas 5B', 'Kelas 5C'], ['Pasukan Merah', 'Pasukan Biru', 'Pasukan Hijau']];
const MXK = [['epal', 'oren', 'pisang'], ['lelaki', 'perempuan', 'guru'], ['emas', 'perak', 'gangsa']];
// matriks 2 × 2 dengan penentu bukan sifar (penentu kecil)
function mxInv2(r, dets) { let A; do { A = [[r.n(-5, 6), r.i(-4, 5)], [r.i(-4, 5), r.n(-5, 6)]]; } while (!dets.includes(mxDet(A))); return A; }

/* =================== rajah (SVG, var(--…)) =================== */
function mxSvgM(M, x, y, c, hl) {
  const cw = 46, rh = 40, w = M[0].length * cw + 16, h = M.length * rh;
  let s = `<path d="M${x + 9} ${y}H${x}V${y + h}H${x + 9}M${x + w - 9} ${y}H${x + w}V${y + h}H${x + w - 9}" fill="none" style="stroke:var(--${c || 'tr'})" stroke-width="3" stroke-linecap="round"/>`;
  M.forEach((r, i) => r.forEach((v, j) => { const k = hl && hl.some(([a, b]) => a === i && b === j); s += `<text x="${x + 8 + cw * j + cw / 2}" y="${y + rh * i + rh / 2}" style="fill:var(--${k ? 'am' : 'tx'})" font-size="21" font-weight="800" text-anchor="middle" dominant-baseline="central">${mxV(v)}</text>`; }));
  return { s, w, h };
}
// kad: senarai [label, matriks] sebaris
function mxCard(items, sub, hl) {
  let x = 16, s = '';
  const tot = items.reduce((t, [l, M]) => t + (l ? l.length * 13 + 14 : 0) + M[0].length * 46 + 16 + 18, 0) - 18;
  x = Math.max(12, (340 - tot) / 2);
  items.forEach(([l, M]) => {
    if (l) { s += `<text x="${x}" y="72" style="fill:var(--tx)" font-size="21" font-weight="800" dominant-baseline="central">${l}</text>`; x += l.length * 13 + 14; }
    const o = mxSvgM(M, x, 72 - M.length * 20, 'tr', hl); s += o.s; x += o.w + 18;
  });
  const W = Math.max(340, x + 4);
  return `<svg viewBox="0 0 ${W} 150" role="img" aria-label="Matriks" font-family="Inter, sans-serif"><rect x="4" y="4" width="${W - 8}" height="142" rx="20" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>${s}${sub ? `<text x="${W / 2}" y="130" style="fill:var(--mu)" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="central">${sub}</text>` : ''}</svg>`;
}
// jadual data (SVG)
function mxTab(rows, cols, M) {
  const cw = 92, rh = 36, L = 120, W = L + cols.length * cw + 10, Hh = 40 + rows.length * rh + 10;
  let s = cols.map((c, j) => `<text x="${L + cw * j + cw / 2}" y="22" style="fill:var(--pk)" font-size="14" font-weight="800" text-anchor="middle" dominant-baseline="central">${c}</text>`).join('');
  rows.forEach((r, i) => {
    s += `<text x="10" y="${40 + rh * i + rh / 2}" style="fill:var(--tr)" font-size="14" font-weight="800" dominant-baseline="central">${r}</text>`;
    M[i].forEach((v, j) => { s += `<rect x="${L + cw * j + 4}" y="${40 + rh * i + 3}" width="${cw - 8}" height="${rh - 6}" rx="7" style="fill:var(--surf);stroke:var(--bd)" stroke-width="1.5"/><text x="${L + cw * j + cw / 2}" y="${40 + rh * i + rh / 2}" style="fill:var(--tx)" font-size="16" font-weight="700" text-anchor="middle" dominant-baseline="central">${v}</text>`; });
  });
  return `<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Jadual data" font-family="Inter, sans-serif">${s}</svg>`;
}
// dua garis lurus dan titik persilangan
function mxGraf(A, b, x, y) {
  const W = 340, H = 260, x0 = Math.min(x, 0) - 4, x1 = Math.max(x, 0) + 4, y0 = Math.min(y, 0) - 4, y1 = Math.max(y, 0) + 4;
  const X = v => 20 + (v - x0) * (W - 40) / (x1 - x0), Y = v => H - 20 - (v - y0) * (H - 40) / (y1 - y0);
  let s = `<line x1="20" y1="${Y(0)}" x2="${W - 20}" y2="${Y(0)}" style="stroke:var(--mu)" stroke-width="2"/><line x1="${X(0)}" y1="20" x2="${X(0)}" y2="${H - 20}" style="stroke:var(--mu)" stroke-width="2"/>`;
  [[0, 'tr'], [1, 'pk']].forEach(([i, c]) => {
    const [p, q] = A[i], k = b[i][0]; let pts;
    if (q !== 0) pts = [[x0, (k - p * x0) / q], [x1, (k - p * x1) / q]]; else pts = [[k / p, y0], [k / p, y1]];
    s += `<line x1="${X(pts[0][0]).toFixed(1)}" y1="${Y(pts[0][1]).toFixed(1)}" x2="${X(pts[1][0]).toFixed(1)}" y2="${Y(pts[1][1]).toFixed(1)}" style="stroke:var(--${c})" stroke-width="3.5"/>`;
  });
  s += `<circle cx="${X(x)}" cy="${Y(y)}" r="6" style="fill:var(--am)"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Dua garis lurus bersilang" font-family="Inter, sans-serif"><defs><clipPath id="mxc"><rect x="20" y="20" width="${W - 40}" height="${H - 40}"/></clipPath></defs><g clip-path="url(#mxc)">${s}</g></svg>`;
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 2.1.1 ---------- */
  peringkat: [
    ({ A }) => ({ q: `Nyatakan peringkat matriks ${mxH(A)}.` }),
    ({ A }) => ({ q: `Berapakah bilangan baris dan bilangan lajur bagi matriks ${mxH(A)}? Seterusnya nyatakan peringkatnya.` }),
    ({ A }) => ({ q: `Tentukan peringkat bagi matriks <i>P</i> = ${mxH(A)}.` }),
    ({ A, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata peringkat matriks ${mxH(A)} ialah ${A[0].length} × ${A.length}. Adakah ${N} betul?` }, salah(N, ans, 'Peringkat ditulis sebagai bilangan baris × bilangan lajur.')); }
  ],
  unsur: [
    ({ A, i, j }) => ({ q: `Diberi <i>A</i> = ${mxH(A)}. Nyatakan unsur <i>a</i><sub>${i}${j}</sub>.` }),
    ({ A, i, j }) => ({ q: `Bagi matriks <i>A</i> = ${mxH(A)}, apakah unsur pada baris ke-${i} dan lajur ke-${j}?` }),
    ({ A, i, j }) => ({ q: `Matriks <i>A</i> = ${mxH(A)}. Cari nilai <i>a</i><sub>${i}${j}</sub>.` }),
    ({ A, v }) => ({ q: `Diberi <i>A</i> = ${mxH(A)}. Kenal pasti kedudukan unsur ${fmt(v)} dalam bentuk <i>a</i><sub>ij</sub>.`, rev: true })
  ],
  wakil: [
    ({ what }) => ({ q: `Jadual di bawah menunjukkan ${what}. Wakilkan maklumat itu dalam bentuk matriks dan nyatakan peringkatnya.` }),
    ({ what }) => ({ q: `Tulis satu matriks yang mewakili ${what} dalam jadual di bawah. Apakah peringkat matriks itu?` }),
    ({ what }) => ({ q: `Berdasarkan jadual di bawah tentang ${what}, bentukkan matriks <i>M</i> dan nyatakan peringkat <i>M</i>.` })
  ],
  sama: [
    ({ L, R }) => ({ q: `Diberi ${mxH(L)} = ${mxH(R)}. Cari nilai <i>x</i> dan nilai <i>y</i>.` }),
    ({ L, R }) => ({ q: `Dua matriks ${mxH(L)} dan ${mxH(R)} adalah sama. Hitung nilai <i>x</i> dan <i>y</i>.` }),
    ({ L, R }) => ({ q: `Jika ${mxH(L)} = ${mxH(R)}, tentukan nilai <i>x</i> dan <i>y</i>.` })
  ],
  bina: [
    ({ m, n, rule }) => ({ q: `Bina matriks <i>A</i> berperingkat ${m} × ${n} dengan <i>a</i><sub>ij</sub> = ${rule}.` }),
    ({ m, n, rule }) => ({ q: `Matriks <i>A</i> berperingkat ${m} × ${n} mempunyai unsur <i>a</i><sub>ij</sub> = ${rule}. Tulis matriks <i>A</i>.` }),
    ({ m, n, rule }) => ({ q: `Tulis matriks ${m} × ${n} yang unsurnya diberi oleh <i>a</i><sub>ij</sub> = ${rule}.` })
  ],
  k211: [
    ({ L, R }) => ({ q: `Diberi ${mxH(L)} = ${mxH(R)}. (a) Nyatakan peringkat matriks itu. (b) Cari nilai <i>x</i>, <i>y</i> dan <i>z</i>.` }),
    ({ L, R }) => ({ q: `Matriks ${mxH(L)} dan ${mxH(R)} adalah sama. Cari nilai <i>x</i>, <i>y</i> dan <i>z</i>, kemudian nyatakan unsur <i>a</i><sub>22</sub> matriks itu.` }),
    ({ L, R }) => ({ q: `Jika ${mxH(L)} = ${mxH(R)}, hitung nilai <i>x</i>, <i>y</i> dan <i>z</i>. Tunjukkan langkah kerja.` })
  ],
  /* ---------- 2.2.1 ---------- */
  tambah: [
    ({ A, B }) => ({ q: `Hitung ${mxH(A)} + ${mxH(B, 'pu')}.` }),
    ({ A, B }) => ({ q: `Diberi <i>A</i> = ${mxH(A)} dan <i>B</i> = ${mxH(B, 'pu')}. Cari <i>A</i> + <i>B</i>.` }),
    ({ A, B }) => ({ q: `Permudahkan ${mxH(A)} + ${mxH(B, 'pu')}.` })
  ],
  tolak: [
    ({ A, B }) => ({ q: `Hitung ${mxH(A)} − ${mxH(B, 'pu')}.` }),
    ({ A, B }) => ({ q: `Diberi <i>P</i> = ${mxH(A)} dan <i>Q</i> = ${mxH(B, 'pu')}. Cari <i>P</i> − <i>Q</i>.` }),
    ({ A, B }) => ({ q: `Cari hasil tolak ${mxH(A)} − ${mxH(B, 'pu')}.` }),
    ({ A, B, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} menghitung ${mxH(A)} − ${mxH(B, 'pu')} dan mendapat ${mxH(wrong, 'rd')}. Adakah ${N} betul?` }, salah(N, ans, 'Tolak setiap unsur sepadan dan berhati-hati dengan nombor negatif.')); }
  ],
  skalar: [
    ({ k, A }) => ({ q: `Hitung ${fmt(k)}${mxH(A)}.` }),
    ({ k, A }) => ({ q: `Diberi <i>A</i> = ${mxH(A)}. Cari ${fmt(k)}<i>A</i>.` }),
    ({ k, A }) => ({ q: `Darabkan matriks ${mxH(A)} dengan skalar ${fmt(k)}.` })
  ],
  gabung: [
    ({ p, q, A, B }) => ({ q: `Diberi <i>A</i> = ${mxH(A)} dan <i>B</i> = ${mxH(B, 'pu')}. Cari ${p}<i>A</i> − ${q === 1 ? '' : q}<i>B</i>.` }),
    ({ p, q, A, B }) => ({ q: `Hitung ${p}${mxH(A)} − ${q === 1 ? '' : q}${mxH(B, 'pu')}.` }),
    ({ p, q, A, B }) => ({ q: `Jika <i>A</i> = ${mxH(A)} dan <i>B</i> = ${mxH(B, 'pu')}, ungkapkan ${p}<i>A</i> − ${q === 1 ? '' : q}<i>B</i> sebagai satu matriks.` })
  ],
  persX: [
    ({ k, A, B }) => ({ q: `Cari matriks <i>X</i> jika ${k}<i>X</i> + ${mxH(A)} = ${mxH(B, 'pu')}.` }),
    ({ k, A, B }) => ({ q: `Selesaikan persamaan matriks ${k}<i>X</i> + ${mxH(A)} = ${mxH(B, 'pu')}.` }),
    ({ k, A, B }) => ({ q: `Diberi ${k}<i>X</i> + ${mxH(A)} = ${mxH(B, 'pu')}. Tentukan matriks <i>X</i>.` })
  ],
  k221: [
    ({ L1, L2, R }) => ({ q: `Diberi ${L1} + ${L2} = ${R}. Cari nilai <i>x</i>, <i>y</i> dan <i>z</i>.` }),
    ({ L1, L2, R }) => ({ q: `Persamaan matriks ${L1} + ${L2} = ${R} diberi. Hitung nilai <i>x</i>, <i>y</i> dan <i>z</i>.` }),
    ({ L1, L2, R }) => ({ q: `Tentukan nilai <i>x</i>, <i>y</i> dan <i>z</i> yang memuaskan ${L1} + ${L2} = ${R}.` })
  ],
  /* ---------- 2.2.3 ---------- */
  perAB: [
    ({ a, b }) => ({ q: `Matriks <i>A</i> berperingkat ${a} dan matriks <i>B</i> berperingkat ${b}. Adakah <i>AB</i> tertakrif? Jika ya, nyatakan peringkat <i>AB</i>.` }),
    ({ a, b }) => ({ q: `Diberi peringkat <i>A</i> ialah ${a} dan peringkat <i>B</i> ialah ${b}. Tentukan sama ada hasil darab <i>AB</i> boleh dilakukan dan peringkatnya.` }),
    ({ a, b }) => ({ q: `Bolehkah matriks ${a} didarab dengan matriks ${b} (dalam tertib itu)? Nyatakan peringkat hasil darab jika boleh.` })
  ],
  darabV: [
    ({ A, B }) => ({ q: `Hitung ${mxH(A)}${mxH(B, 'pk')}.` }),
    ({ A, B }) => ({ q: `Cari hasil darab ${mxH(A)} × ${mxH(B, 'pk')}.` }),
    ({ A, B }) => ({ q: `Diberi <i>A</i> = ${mxH(A)} dan <i>B</i> = ${mxH(B, 'pk')}. Cari <i>AB</i>.` })
  ],
  darab22: [
    ({ A, B }) => ({ q: `Hitung ${mxH(A)}${mxH(B, 'pk')}.` }),
    ({ A, B }) => ({ q: `Diberi <i>P</i> = ${mxH(A)} dan <i>Q</i> = ${mxH(B, 'pk')}. Cari <i>PQ</i>.` }),
    ({ A, B }) => ({ q: `Darabkan ${mxH(A)} dengan ${mxH(B, 'pk')} (dalam tertib itu).` })
  ],
  kuasa: [
    ({ A }) => ({ q: `Diberi <i>A</i> = ${mxH(A)}. Cari <i>A</i>².` }),
    ({ A }) => ({ q: `Hitung <i>A</i>² bagi <i>A</i> = ${mxH(A)}.` }),
    ({ A, ans, wrong }) => { const N = vnama(); return Object.assign({ q: `${N} berkata jika <i>A</i> = ${mxH(A)}, maka <i>A</i>² = ${mxH(wrong, 'rd')}. Adakah ${N} betul?` }, salah(N, ans, '<i>A</i>² = <i>A</i> × <i>A</i> menggunakan baris × lajur, bukan kuasa dua setiap unsur.')); }
  ],
  identiti: [
    ({ A }) => ({ q: `Diberi <i>A</i> = ${mxH(A)} dan <i>I</i> ialah matriks identiti 2 × 2. Cari <i>AI</i> − <i>A</i> + 2<i>I</i>.` }),
    ({ A }) => ({ q: `Jika <i>I</i> ialah matriks identiti dan <i>A</i> = ${mxH(A)}, hitung <i>IA</i> + 2<i>I</i> − <i>A</i>.` }),
    ({ A }) => ({ q: `Permudahkan <i>AI</i> + 2<i>I</i> − <i>IA</i> dengan <i>A</i> = ${mxH(A)}.` })
  ],
  k223: [
    ({ A, B, R }) => ({ q: `Diberi ${mxH(A)}${mxH(B, 'pk')} = ${mxH(R, 'am')}. Cari nilai <i>h</i> dan nilai <i>k</i>.` }),
    ({ A, B, R }) => ({ q: `Hasil darab ${mxH(A)}${mxH(B, 'pk')} ialah ${mxH(R, 'am')}. Hitung nilai <i>h</i> dan <i>k</i>.` }),
    ({ A, B, R }) => ({ q: `Cari nilai <i>h</i> dan <i>k</i> jika ${mxH(A)}${mxH(B, 'pk')} = ${mxH(R, 'am')}.` })
  ],
  /* ---------- 2.2.5 ---------- */
  penentu: [
    ({ A }) => ({ q: `Cari penentu bagi matriks ${mxH(A)}.` }),
    ({ A }) => ({ q: `Hitung |<i>A</i>| jika <i>A</i> = ${mxH(A)}. Adakah <i>A</i> mempunyai songsang?` }),
    ({ A }) => ({ q: `Tentukan sama ada matriks ${mxH(A)} mempunyai matriks songsang. Beri sebab.` })
  ],
  songsang: [
    ({ A }) => ({ q: `Cari matriks songsang bagi ${mxH(A)}.` }),
    ({ A }) => ({ q: `Diberi <i>A</i> = ${mxH(A)}. Cari <i>A</i><sup>−1</sup>.` }),
    ({ A }) => ({ q: `Tentukan songsang bagi matriks <i>M</i> = ${mxH(A)}.` })
  ],
  semakS: [
    ({ A, B }) => ({ q: `Tentukan sama ada ${mxH(B, 'pu')} ialah matriks songsang bagi ${mxH(A)}.` }),
    ({ A, B }) => ({ q: `Adakah <i>B</i> = ${mxH(B, 'pu')} songsang bagi <i>A</i> = ${mxH(A)}? Tunjukkan dengan mendarab.` }),
    ({ A, B }) => { const N = vnama(); return { q: `${N} berkata ${mxH(B, 'pu')} ialah songsang bagi ${mxH(A)}. Semak dakwaan ${N} dengan mencari hasil darab kedua-dua matriks.` }; }
  ],
  bentukMx: [
    ({ e1, e2 }) => ({ q: `Tulis persamaan linear serentak ${e1} dan ${e2} dalam bentuk matriks.` }),
    ({ e1, e2 }) => ({ q: `Ungkapkan ${e1}, ${e2} dalam bentuk <i>AX</i> = <i>B</i>.` }),
    ({ e1, e2 }) => ({ q: `Persamaan ${e1} dan ${e2} diberi. Bentukkan persamaan matriks yang setara.` })
  ],
  serentak: [
    ({ e1, e2 }) => ({ q: `Dengan kaedah matriks, selesaikan persamaan linear serentak ${e1} dan ${e2}.` }),
    ({ e1, e2 }) => ({ q: `Gunakan matriks songsang untuk mencari <i>x</i> dan <i>y</i> yang memuaskan ${e1} dan ${e2}.` }),
    ({ e1, e2 }) => ({ q: `Selesaikan ${e1} dan ${e2} menggunakan kaedah matriks. Seterusnya nyatakan titik persilangan kedua-dua garis itu.` })
  ],
  masalah: [
    ({ sit }) => ({ q: `${sit} Bentukkan persamaan matriks dan gunakan kaedah matriks untuk mencari jawapan.` }),
    ({ sit }) => ({ q: `${sit} Selesaikan masalah ini menggunakan kaedah matriks.` }),
    ({ sit }) => ({ q: `${sit} Tulis dua persamaan linear, ungkapkan dalam bentuk matriks dan selesaikan.` })
  ]
};

/* =================== pembina soalan (r = MXRG atau MXRW) =================== */
const MX = {};
const mxDim = r => { let m, n; do { m = r.i(1, 3); n = r.i(1, 3); } while (m * n === 1); return [m, n]; };
MX.peringkat = r => {
  const [m, n] = mxDim(r), A = mxRand(r, m, n, -9, 12), ans = `${m} × ${n}`;
  return GEN_LQ('peringkat', { A, ans, work: [`Bilangan baris = ${m}, bilangan lajur = ${n}.`, `Peringkat = ${m} × ${n}`] });
};
MX.unsur = r => {
  const m = r.i(2, 3), n = r.i(2, 3); let A; do { A = mxRand(r, m, n, -9, 12); } while (new Set(A.flat()).size < m * n);
  const i = r.i(1, m), j = r.i(1, n), v = A[i - 1][j - 1];
  const o = GEN_LQ('unsur', { A, i, j, v, ans: fmt(v), work: [`Baris ke-${i}, lajur ke-${j}.`, `<i>a</i><sub>${i}${j}</sub> = ${fmt(v)}`] });
  if (o.q.includes('Kenal pasti')) { o.ans = `<i>a</i><sub>${i}${j}</sub>`; o.work = [`${fmt(v)} berada pada baris ke-${i} dan lajur ke-${j}.`]; }
  return o;
};
MX.wakil = r => {
  const t = r.i(0, 2), m = r.i(2, 3), n = r.i(2, 3), rows = MXJ[t].slice(0, m), cols = MXK[t].slice(0, n), M = mxRand(r, m, n, 3, 48);
  const what = ['bilangan buah yang dijual oleh beberapa kedai', 'bilangan murid dalam beberapa kelas', 'bilangan pingat yang dimenangi oleh beberapa pasukan'][t];
  const fig = mxTab(rows, cols, M);
  return GEN_LQ('wakil', { what, ans: `<i>M</i> = ${mxH(M)}, peringkat ${m} × ${n}`, work: ['Setiap baris jadual menjadi satu baris matriks; setiap lajur jadual menjadi satu lajur matriks.', `Peringkat = ${m} baris × ${n} lajur = ${m} × ${n}`] }, { fig });
};
MX.sama = r => {
  const x = r.n(-6, 8), y = r.n(-6, 8), p = r.i(2, 4), a = r.i(-6, 6), b = r.n(-5, 7), c = r.i(-9, 9), d = r.i(-9, 9);
  const L = [[`${p}<i>x</i> ${a < 0 ? '−' : '+'} ${Math.abs(a)}`.replace(' + 0', '').replace(' − 0', ''), c], [d, `<i>y</i> ${b < 0 ? '−' : '+'} ${Math.abs(b)}`]];
  const R = [[p * x + a, c], [d, y + b]];
  return GEN_LQ('sama', { L, R, ans: `<i>x</i> = ${fmt(x)}, <i>y</i> = ${fmt(y)}`, work: [`Samakan unsur sepadan: ${p}<i>x</i>${a ? (a < 0 ? ' − ' : ' + ') + Math.abs(a) : ''} = ${fmt(p * x + a)}`, `${p}<i>x</i> = ${fmt(p * x)} → <i>x</i> = ${fmt(x)}`, `<i>y</i> ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${fmt(y + b)} → <i>y</i> = ${fmt(y)}`] });
};
MX.bina = r => {
  const m = r.i(2, 3), n = r.i(2, 3), p = r.i(1, 3), q = r.n(-3, 3), t = r.i(0, 1);
  const f = t ? (i, j) => p * i + q * j : (i, j) => p * i * j + q;
  const rule = t ? `${p === 1 ? '' : p}<i>i</i> ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}<i>j</i>` : `${p === 1 ? '' : p}<i>ij</i> ${q < 0 ? '−' : '+'} ${Math.abs(q)}`;
  const A = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => f(i + 1, j + 1)));
  return GEN_LQ('bina', { m, n, rule, ans: `<i>A</i> = ${mxH(A)}`, work: [`<i>a</i><sub>11</sub> = ${fmt(f(1, 1))}, <i>a</i><sub>12</sub> = ${fmt(f(1, 2))}, <i>a</i><sub>21</sub> = ${fmt(f(2, 1))}, …`, `<i>A</i> = ${mxH(A)}`] });
};
MX.k211 = r => {
  const x = r.n(-5, 6), y = r.n(-5, 6), z = r.n(-5, 6), a = r.i(2, 4), b = r.i(2, 5), c = r.i(-8, 8);
  // [ax  c ; x + y  z − y] = [a*x  c ; x+y  z−y]
  const L = [[`${a}<i>x</i>`, c], [`<i>x</i> + <i>y</i>`, `${b}<i>z</i> − <i>y</i>`]], R = [[a * x, c], [x + y, b * z - y]];
  return GEN_LQ('k211', { L, R, ans: `2 × 2; <i>x</i> = ${fmt(x)}, <i>y</i> = ${fmt(y)}, <i>z</i> = ${fmt(z)}`, work: ['Peringkat 2 × 2.', `${a}<i>x</i> = ${fmt(a * x)} → <i>x</i> = ${fmt(x)}`, `<i>x</i> + <i>y</i> = ${fmt(x + y)} → <i>y</i> = ${fmt(x + y)} − ${par(x)} = ${fmt(y)}`, `${b}<i>z</i> − <i>y</i> = ${fmt(b * z - y)} → ${b}<i>z</i> = ${fmt(b * z)} → <i>z</i> = ${fmt(z)}`, `<i>a</i><sub>22</sub> = ${fmt(b * z - y)}`] });
};
/* 2.2.1 */
const mx2 = r => { const m = r.i(1, 3), n = r.i(m === 1 ? 2 : 1, 3); return [m, n]; };
MX.tambah = r => {
  const [m, n] = mx2(r), A = mxRand(r, m, n, -8, 9), B = mxRand(r, m, n, -8, 9), S = mxAdd(A, B);
  return GEN_LQ('tambah', { A, B, ans: mxH(S), work: ['Tambah unsur sepadan.', `= ${mxH(A.map((row, i) => row.map((v, j) => `${fmt(v)} + ${par(B[i][j])}`)))}`, `= ${mxH(S)}`] });
};
MX.tolak = r => {
  const [m, n] = mx2(r), A = mxRand(r, m, n, -8, 9); let B; do { B = mxRand(r, m, n, -8, 9); } while (!B.flat().some(v => v < 0));
  const D = mxAdd(A, B, -1), wrong = A.map((row, i) => row.map((v, j) => v - Math.abs(B[i][j])));
  return GEN_LQ('tolak', { A, B, wrong, ans: mxH(D), work: ['Tolak unsur sepadan.', `= ${mxH(A.map((row, i) => row.map((v, j) => `${fmt(v)} − ${par(B[i][j])}`)))}`, `= ${mxH(D)}`] });
};
MX.skalar = r => {
  const [m, n] = mx2(r), A = mxRand(r, m, n, -6, 9), k = r.p([2, 3, 4, 5, -2, -3, -1]), K = mxSc(k, A);
  return GEN_LQ('skalar', { k, A, ans: mxH(K), work: [`Darab setiap unsur dengan ${fmt(k)}.`, `= ${mxH(A.map(row => row.map(v => `${fmt(k)} × ${par(v)}`)))}`, `= ${mxH(K)}`] });
};
MX.gabung = r => {
  const A = mxRand(r, 2, 2, -5, 7), B = mxRand(r, 2, 2, -5, 7), p = r.i(2, 3), q = r.i(1, 3), R = mxAdd(mxSc(p, A), mxSc(q, B), -1);
  return GEN_LQ('gabung', { p, q, A, B, ans: mxH(R), work: [`${p}<i>A</i> = ${mxH(mxSc(p, A))}`, `${q === 1 ? '' : q}<i>B</i> = ${mxH(mxSc(q, B))}`, `${p}<i>A</i> − ${q === 1 ? '' : q}<i>B</i> = ${mxH(R)}`] });
};
MX.persX = r => {
  const k = r.i(2, 4), X = mxRand(r, 1 + r.i(0, 1), 2, -5, 6), A = mxRand(r, X.length, 2, -8, 8), B = mxAdd(mxSc(k, X), A);
  return GEN_LQ('persX', { k, A, B, ans: `<i>X</i> = ${mxH(X)}`, work: [`${k}<i>X</i> = ${mxH(B)} − ${mxH(A)} = ${mxH(mxSc(k, X))}`, `<i>X</i> = ${fr(1, k)} × ${mxH(mxSc(k, X))} = ${mxH(X)}`] });
};
MX.k221 = r => {
  const x = r.n(-5, 6), y = r.n(-5, 6), z = r.n(-4, 5), k = r.i(2, 3), a = r.i(-6, 6), b = r.i(-6, 6), c = r.n(1, 4);
  // k[x 3 ; a 2] + [b y ; z c] = [kx+b  3k+y ; ka+z  2k+c]
  const L1 = `${k}${mxH([['<i>x</i>', 3], [a, 2]])}`, L2 = mxH([[b, '<i>y</i>'], ['<i>z</i>', c]], 'pu'), R = mxH([[k * x + b, 3 * k + y], [k * a + z, 2 * k + c]], 'am');
  return GEN_LQ('k221', { L1, L2, R, ans: `<i>x</i> = ${fmt(x)}, <i>y</i> = ${fmt(y)}, <i>z</i> = ${fmt(z)}`, work: [`${k}${mxH([['<i>x</i>', 3], [a, 2]])} = ${mxH([[`${k}<i>x</i>`, 3 * k], [k * a, 2 * k]])}`, `${k}<i>x</i> + ${par(b)} = ${fmt(k * x + b)} → <i>x</i> = ${fmt(x)}`, `${3 * k} + <i>y</i> = ${fmt(3 * k + y)} → <i>y</i> = ${fmt(y)}`, `${fmt(k * a)} + <i>z</i> = ${fmt(k * a + z)} → <i>z</i> = ${fmt(z)}`] });
};
/* 2.2.3 */
MX.perAB = (r, i) => {
  const ok = i == null ? r.f() < .65 : i % 3 !== 2, m = r.i(1, 4), n = r.i(1, 4), p = r.i(1, 4); let n2 = n;
  if (!ok) do { n2 = r.i(1, 4); } while (n2 === n);
  const a = `${m} × ${n}`, b = `${n2} × ${p}`;
  return GEN_LQ('perAB', { a, b, ans: ok ? `Ya, <i>AB</i> berperingkat ${m} × ${p}` : 'Tidak tertakrif', work: [ok ? `Lajur <i>A</i> = ${n} = baris <i>B</i>.` : `Lajur <i>A</i> = ${n} ≠ baris <i>B</i> = ${n2}.`, ok ? `Peringkat <i>AB</i> = ${m} × ${p}` : '<i>AB</i> tidak boleh dikira.'] });
};
MX.darabV = r => {
  const t = r.i(0, 2); let A, B;
  if (t === 0) { A = mxRand(r, 1, 2, -5, 6); B = mxRand(r, 2, 1, -5, 6); }
  else if (t === 1) { A = mxRand(r, 2, 2, -5, 6); B = mxRand(r, 2, 1, -5, 6); }
  else { A = mxRand(r, 1, 2, -5, 6); B = mxRand(r, 2, 2, -5, 6); }
  const R = mxMul(A, B);
  return GEN_LQ('darabV', { A, B, ans: mxH(R), work: [`(${mxOrd(A)})(${mxOrd(B)}) → ${mxOrd(R)}`].concat(R.map((row, i) => row.map((v, j) => `(${i + 1}, ${j + 1}): ${A[i].map((a, k) => `(${fmt(a)})(${fmt(B[k][j])})`).join(' + ')} = ${fmt(v)}`).join('; '))).concat([`= ${mxH(R)}`]) });
};
MX.darab22 = r => {
  const A = mxRand(r, 2, 2, -4, 6), B = mxRand(r, 2, 2, -4, 6), R = mxMul(A, B);
  return GEN_LQ('darab22', { A, B, ans: mxH(R), work: R.map((row, i) => row.map((v, j) => `(${i + 1}, ${j + 1}): (${fmt(A[i][0])})(${fmt(B[0][j])}) + (${fmt(A[i][1])})(${fmt(B[1][j])}) = ${fmt(v)}`).join('; ')).concat([`= ${mxH(R)}`]) });
};
MX.kuasa = r => {
  const A = mxRand(r, 2, 2, -4, 5), R = mxMul(A, A), wrong = mxSc(1, A.map(row => row.map(v => v * v)));
  if (mxEq(R, wrong)) A[0][1] = A[0][1] + 1;
  const R2 = mxMul(A, A), W2 = A.map(row => row.map(v => v * v));
  return GEN_LQ('kuasa', { A, wrong: W2, ans: `<i>A</i>² = ${mxH(R2)}`, work: [`<i>A</i>² = ${mxH(A)}${mxH(A)}`].concat(R2.map((row, i) => row.map((v, j) => `(${fmt(A[i][0])})(${fmt(A[0][j])}) + (${fmt(A[i][1])})(${fmt(A[1][j])}) = ${fmt(v)}`).join('; '))).concat([`= ${mxH(R2)}`]) });
};
MX.identiti = r => {
  const A = mxRand(r, 2, 2, -6, 9), R = [[2, 0], [0, 2]];
  return GEN_LQ('identiti', { A, ans: mxH(R), work: ['<i>AI</i> = <i>IA</i> = <i>A</i>', '<i>A</i> − <i>A</i> + 2<i>I</i> = 2<i>I</i>', `= ${mxH(R)}`] });
};
MX.k223 = r => {
  const A = [[r.n(1, 4), r.n(-3, 4)], [r.n(-3, 4), r.n(1, 5)]], h = r.n(-4, 5), k = r.n(-4, 5), Bv = [[h], [k]], R = mxMul(A, Bv);
  if (mxDet(A) === 0) A[1][1]++;
  const R2 = mxMul(A, Bv);
  return GEN_LQ('k223', { A, B: [['<i>h</i>'], ['<i>k</i>']], R: R2, ans: `<i>h</i> = ${fmt(h)}, <i>k</i> = ${fmt(k)}`, work: [`${fmt(A[0][0])}<i>h</i> ${A[0][1] < 0 ? '−' : '+'} ${Math.abs(A[0][1])}<i>k</i> = ${fmt(R2[0][0])} … (1)`, `${fmt(A[1][0])}<i>h</i> ${A[1][1] < 0 ? '−' : '+'} ${Math.abs(A[1][1])}<i>k</i> = ${fmt(R2[1][0])} … (2)`, `Selesaikan serentak: <i>h</i> = ${fmt(h)}, <i>k</i> = ${fmt(k)}`, `Semak: ${fmt(A[0][0])}(${fmt(h)}) + ${par(A[0][1])}(${fmt(k)}) = ${fmt(R2[0][0])} ✓`] });
};
/* 2.2.5 */
MX.penentu = (r, i) => {
  let A; const zero = i == null ? r.f() < .25 : i % 4 === 3;
  if (zero) { const a = r.n(1, 5), b = r.n(-4, 5), t = r.n(-3, 3); A = [[a, b], [t * a, t * b]]; } else do { A = mxRand(r, 2, 2, -6, 8); } while (mxDet(A) === 0);
  const d = mxDet(A);
  return GEN_LQ('penentu', { A, ans: `|<i>A</i>| = ${fmt(d)}; ${d ? 'mempunyai songsang' : 'tiada songsang'}`, work: [`<i>ad</i> − <i>bc</i> = (${fmt(A[0][0])})(${fmt(A[1][1])}) − (${fmt(A[0][1])})(${fmt(A[1][0])})`, `= ${fmt(A[0][0] * A[1][1])} − ${par(A[0][1] * A[1][0])} = ${fmt(d)}`, d ? `${fmt(d)} ≠ 0, maka songsang wujud.` : 'Penentu = 0, maka tiada songsang.'] });
};
MX.songsang = r => {
  const A = mxInv2(r, [1, -1, 2, -2, 3, 4, 5]), d = mxDet(A);
  return GEN_LQ('songsang', { A, ans: mxInvH(A), work: [`Penentu = (${fmt(A[0][0])})(${fmt(A[1][1])}) − (${fmt(A[0][1])})(${fmt(A[1][0])}) = ${fmt(d)}`, `Tukar <i>a</i> ↔ <i>d</i>, tukar tanda <i>b</i> dan <i>c</i>: ${mxH(mxAdj(A))}`, `<i>A</i><sup>−1</sup> = ${mxK(d)}${mxH(mxAdj(A))}` + (mxInvH(A).startsWith('1/') || mxInvH(A).startsWith('−1/') ? '' : ` = ${mxInvH(A)}`)] });
};
MX.semakS = (r, i) => {
  const A = mxInv2(r, [1, -1]), ok = i == null ? r.f() < .5 : i % 2 === 0, J = mxSc(mxDet(A), mxAdj(A)).map(row => row.map(v => v + 0));
  const B = ok ? J : [[J[0][0], -J[0][1] || 1], [-J[1][0] || 1, J[1][1]]], P = mxMul(A, B), isI = mxEq(P, [[1, 0], [0, 1]]);
  return GEN_LQ('semakS', { A, B, ans: isI ? `Ya, hasil darab = <i>I</i> ${mxH([[1, 0], [0, 1]])}` : `Bukan, hasil darab = ${mxH(P)} ≠ <i>I</i>`, work: [`${mxH(A)}${mxH(B, 'pu')} = ${mxH(P)}`, isI ? 'Hasil darab ialah matriks identiti, maka songsang.' : 'Hasil darab bukan matriks identiti, maka bukan songsang.'] });
};
const mxEqn = (p, q, k, u = 'x', v = 'y') => `${p === 1 ? '' : p === -1 ? '−' : fmt(p)}<i>${u}</i> ${q < 0 ? '−' : '+'} ${Math.abs(q) === 1 ? '' : Math.abs(q)}<i>${v}</i> = ${fmt(k)}`;
function mxSys(r, dets) { const A = mxInv2(r, dets), x = r.n(-5, 6), y = r.n(-5, 6), b = mxMul(A, [[x], [y]]); return { A, x, y, b, e1: mxEqn(A[0][0], A[0][1], b[0][0]), e2: mxEqn(A[1][0], A[1][1], b[1][0]) }; }
MX.bentukMx = r => {
  const s = mxSys(r, [1, -1, 2, -2, 3, -3, 5, 7]);
  return GEN_LQ('bentukMx', { e1: s.e1, e2: s.e2, ans: `${mxH(s.A)}${mxH(mxXY, 'pk')} = ${mxH(s.b, 'am')}`, work: ['Pekali <i>x</i> dan <i>y</i> → matriks <i>A</i>; pemboleh ubah → <i>X</i>; pemalar → <i>B</i>.'] });
};
MX.serentak = r => {
  const s = mxSys(r, [1, -1, 2, -2, 3, -3, 4]), d = mxDet(s.A), J = mxAdj(s.A), Jb = mxMul(J, s.b);
  return GEN_LQ('serentak', { e1: s.e1, e2: s.e2, ans: `<i>x</i> = ${fmt(s.x)}, <i>y</i> = ${fmt(s.y)}`, work: [`${mxH(s.A)}${mxH(mxXY, 'pk')} = ${mxH(s.b, 'am')}`, `Penentu = ${fmt(d)}`, `${mxH(mxXY, 'pk')} = ${mxK(d)}${mxH(J)}${mxH(s.b, 'am')} = ${mxK(d)}${mxH(Jb)}`, `= ${mxH([[s.x], [s.y]])}; titik persilangan (${fmt(s.x)}, ${fmt(s.y)})`] }, { figAns: mxGraf(s.A, s.b, s.x, s.y) });
};
const MXSIT = [
  (a, b, c, d, x, y) => [`${vnama()} membeli ${a} buku dan ${b} pen dengan harga RM${a * x + b * y}. ${vnama()} membeli ${c} buku dan ${d} pen dengan harga RM${c * x + d * y}.`, `Harga sebuah buku RM${x}, sebatang pen RM${y}`, 'harga sebuah buku (RM<i>x</i>) dan sebatang pen (RM<i>y</i>)'],
  (a, b, c, d, x, y) => [`Sebuah kedai menjual ${a} kek dan ${b} roti dengan jumlah RM${a * x + b * y}. Keesokan harinya, ${c} kek dan ${d} roti dijual dengan jumlah RM${c * x + d * y}.`, `Harga sebiji kek RM${x}, sebuku roti RM${y}`, 'harga sebiji kek (RM<i>x</i>) dan sebuku roti (RM<i>y</i>)'],
  (a, b, c, d, x, y) => [`Tiket ${a} dewasa dan ${b} kanak-kanak berharga RM${a * x + b * y}. Tiket ${c} dewasa dan ${d} kanak-kanak berharga RM${c * x + d * y}.`, `Tiket dewasa RM${x}, tiket kanak-kanak RM${y}`, 'harga tiket dewasa (RM<i>x</i>) dan kanak-kanak (RM<i>y</i>)']
];
MX.masalah = (r, i) => {
  let A; do { A = [[r.i(1, 5), r.i(1, 5)], [r.i(1, 5), r.i(1, 5)]]; } while (![1, -1, 2, -2, 3, -3].includes(mxDet(A)));
  const x = r.i(4, 15), y = r.i(2, 9), b = mxMul(A, [[x], [y]]), t = i == null ? r.i(0, 2) : i % 3, [sit, ans, what] = MXSIT[t](A[0][0], A[0][1], A[1][0], A[1][1], x, y), d = mxDet(A);
  return GEN_LQ('masalah', { sit: sit + ` Cari ${what}.`, ans, work: [`${mxEqn(A[0][0], A[0][1], b[0][0])}, ${mxEqn(A[1][0], A[1][1], b[1][0])}`, `${mxH(A)}${mxH(mxXY, 'pk')} = ${mxH(b, 'am')}; penentu = ${fmt(d)}`, `${mxH(mxXY, 'pk')} = ${mxK(d)}${mxH(mxAdj(A))}${mxH(b, 'am')} = ${mxH([[x], [y]])}`, ans] });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '2.1.1': { m: [() => MX.peringkat(MXRG), () => MX.unsur(MXRG), () => MX.wakil(MXRG)], s: [() => MX.sama(MXRG), () => MX.bina(MXRG)], k: [() => MX.k211(MXRG)] },
  '2.2.1': { m: [() => MX.tambah(MXRG), () => MX.tolak(MXRG), () => MX.skalar(MXRG)], s: [() => MX.gabung(MXRG), () => MX.persX(MXRG)], k: [() => MX.k221(MXRG)] },
  '2.2.3': { m: [() => MX.perAB(MXRG), () => MX.darabV(MXRG), () => MX.identiti(MXRG)], s: [() => MX.darab22(MXRG), () => MX.kuasa(MXRG)], k: [() => MX.k223(MXRG)] },
  '2.2.5': { m: [() => MX.penentu(MXRG), () => MX.songsang(MXRG), () => MX.semakS(MXRG)], s: [() => MX.bentukMx(MXRG), () => MX.serentak(MXRG)], k: [() => MX.masalah(MXRG)] }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja =================== */
const WG = {};
['peringkat', 'unsur', 'wakil', 'sama', 'bina', 'k211', 'tambah', 'tolak', 'skalar', 'gabung', 'persX', 'k221', 'darabV', 'darab22', 'kuasa', 'identiti', 'k223', 'songsang', 'bentukMx', 'serentak'].forEach(k => { WG[k] = () => MX[k](MXRW); });
['perAB', 'penentu', 'semakS', 'masalah'].forEach(k => { WG[k] = i => MX[k](MXRW, i); });
// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '2.1.1': [['m', 'peringkat', 6], ['m', 'unsur', 6], ['m', 'wakil', 6], ['s', 'sama', 5], ['s', 'bina', 4], ['k', 'k211', 3]],
  '2.2.1': [['m', 'tambah', 6], ['m', 'tolak', 6], ['m', 'skalar', 6], ['s', 'gabung', 5], ['s', 'persX', 4], ['k', 'k221', 3]],
  '2.2.3': [['m', 'perAB', 6], ['m', 'darabV', 6], ['m', 'identiti', 3], ['m', 'darab22', 3], ['s', 'darab22', 4], ['s', 'kuasa', 5], ['k', 'k223', 3]],
  '2.2.5': [['m', 'penentu', 6], ['m', 'songsang', 6], ['m', 'semakS', 6], ['s', 'bentukMx', 4], ['s', 'serentak', 5], ['k', 'masalah', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function mxOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const mxMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const CQGEN = {
  asas: [
    () => { const [m, n] = mxDim(MXRG), A = mxRand(MXRG, m, n, -9, 9); return mxMcq('Apakah peringkat matriks ini?', mxCard([['', A]]), mxOpts(`${m} × ${n}`, [`${n} × ${m}`, `${m * n} × 1`, `${m} × ${m}`, `${n} × ${n}`], k => `${m + k} × ${n}`)); },
    () => { const A = mxRand(MXRG, 2, 3, -9, 9), i = ri(1, 2), j = ri(1, 3), v = A[i - 1][j - 1]; return mxMcq(`Bagi matriks <i>A</i>, apakah unsur <i>a</i><sub>${i}${j}</sub>?`, mxCard([['A =', A]]), mxOpts(fmt(v), A.flat().map(fmt).concat(j <= 2 && i <= 3 ? [] : []), k => fmt(v + k))); },
    () => { const x = nz(-6, 7), p = ri(2, 4), a = ri(-6, 6); return mxMcq(`Diberi [${p}x ${a < 0 ? '−' : '+'} ${Math.abs(a)}  5] = [${fmt(p * x + a)}  5]. Nilai x ialah`, mxCard([['', [[`${p}x${a ? (a < 0 ? '−' : '+') + Math.abs(a) : ''}`, 5]]], ['=', [[p * x + a, 5]]]]), mxOpts(`x = ${fmt(x)}`, [`x = ${fmt(-x)}`, `x = ${fmt(p * x + a)}`, `x = ${fmt(x + 1)}`], k => `x = ${fmt(x + k + 1)}`)); }
  ],
  tambah: [
    () => { const A = mxRand(MXRG, 1, 2, -6, 9), B = mxRand(MXRG, 1, 2, -6, 9), S = mxAdd(A, B); return mxMcq('Hitung A + B.', mxCard([['A =', A], ['B =', B]]), mxOpts(mxT(S), [mxT(mxAdd(A, B, -1)), mxT(mxAdd(B, A, -1)), mxT([[S[0][0] + 1, S[0][1]]])], k => mxT([[S[0][0], S[0][1] + k]]))); },
    () => { const A = mxRand(MXRG, 2, 2, -5, 6), k = pick([2, 3, -2]); return mxMcq(`Hitung ${fmt(k)}A.`, mxCard([['A =', A]]), mxOpts(mxT(mxSc(k, A)), [mxT(mxSc(-k, A)), mxT([[k * A[0][0], A[0][1]], [k * A[1][0], A[1][1]]]), mxT(A.map(r => r.map(v => v + k)))], kk => mxT(mxSc(k + kk, A)))); },
    () => { const A = mxRand(MXRG, 2, 2, -6, 8), B = mxRand(MXRG, 2, 2, -6, 8), D = mxAdd(A, B, -1); return mxMcq('Hitung A − B.', mxCard([['A =', A], ['B =', B]]), mxOpts(mxT(D), [mxT(mxAdd(B, A, -1)), mxT(mxAdd(A, B)), mxT(D.map(r => r.map(v => Math.abs(v))))], k => mxT(mxAdd(D, [[k, 0], [0, 0]])))); }
  ],
  darab: [
    () => { const m = ri(1, 3), n = ri(1, 3), p = ri(1, 3); return mxMcq(`A berperingkat ${m} × ${n} dan B berperingkat ${n} × ${p}. Peringkat AB ialah`, mxCard([['', [[`${m} × ${n}`]]], ['×', [[`${n} × ${p}`]]]]), mxOpts(`${m} × ${p}`, [`${n} × ${n}`, `${p} × ${m}`, `${m} × ${n}`, 'Tidak tertakrif'], k => `${m + k} × ${p}`)); },
    () => { const A = mxRand(MXRG, 1, 2, -4, 5), B = mxRand(MXRG, 2, 1, -4, 5), R = mxMul(A, B)[0][0]; return mxMcq('Hitung AB.', mxCard([['A =', A], ['B =', B]]), mxOpts(`[${fmt(R)}]`, [`[${fmt(A[0][0] * B[0][0])}  ${fmt(A[0][1] * B[1][0])}]`, `[${fmt(A[0][0] * B[1][0] + A[0][1] * B[0][0])}]`, `[${fmt(-R)}]`], k => `[${fmt(R + k)}]`)); },
    () => { const A = mxRand(MXRG, 2, 2, -3, 4), B = mxRand(MXRG, 2, 2, -3, 4), R = mxMul(A, B), v = R[0][0]; return mxMcq('Apakah unsur baris 1, lajur 1 bagi AB?', mxCard([['A =', A], ['B =', B]], '', [[0, 0], [0, 1]]), mxOpts(fmt(v), [fmt(A[0][0] * B[0][0]), fmt(A[0][0] * B[0][0] + A[0][1] * B[0][1]), fmt(mxMul(B, A)[0][0]), fmt(-v)], k => fmt(v + k))); }
  ],
  songsang: [
    () => { let A; do { A = mxRand(MXRG, 2, 2, -5, 7); } while (!mxDet(A)); const d = mxDet(A); return mxMcq('Penentu matriks ini ialah', mxCard([['', A]]), mxOpts(fmt(d), [fmt(A[0][0] * A[1][1] + A[0][1] * A[1][0]), fmt(A[0][1] * A[1][0] - A[0][0] * A[1][1]), fmt(A[0][0] * A[0][1] - A[1][0] * A[1][1])], k => fmt(d + k))); },
    () => { const A = mxInv2(MXRG, [1]), J = mxAdj(A); return mxMcq('Matriks songsang bagi A ialah', mxCard([['A =', A]], 'penentu = 1'), mxOpts(mxT(J), [mxT([[A[1][1], A[0][1]], [A[1][0], A[0][0]]]), mxT(mxSc(-1, J).map(r => r.map(v => v + 0))), mxT([[A[0][0], -A[0][1]], [-A[1][0], A[1][1]]])], k => mxT([[J[0][0] + k, J[0][1]], J[1]]))); },
    () => { const s = mxSys(MXRG, [1, -1, 2, -2]); return mxMcq(`Selesaikan: ${s.e1.replace(/<\/?i>/g, '')}, ${s.e2.replace(/<\/?i>/g, '')}`, mxGraf(s.A, s.b, s.x, s.y), mxOpts(`x = ${fmt(s.x)}, y = ${fmt(s.y)}`, [`x = ${fmt(s.y)}, y = ${fmt(s.x)}`, `x = ${fmt(-s.x)}, y = ${fmt(s.y)}`, `x = ${fmt(s.x)}, y = ${fmt(-s.y)}`], k => `x = ${fmt(s.x + k)}, y = ${fmt(s.y)}`)); }
  ]
};
const CQT = { asas: 'Peringkat & unsur', tambah: 'Tambah, tolak, skalar', darab: 'Pendaraban matriks', songsang: 'Penentu & songsang' };
function mxCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.asas;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) { return mxCqMake(pick(level === 0 ? ['asas', 'asas', 'tambah', 'darab', 'songsang'] : Object.keys(CQT)), level); }
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return mxCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
