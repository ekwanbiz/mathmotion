'use strict';
/* =================== TRIGONOMETRI · SOALAN BAB 5 NISBAH TRIGONOMETRI (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "tg" / "TG" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
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
const TGF = { sin: d => Math.sin(tgRad(d)), kos: d => Math.cos(tgRad(d)), tan: d => Math.tan(tgRad(d)) };
const TGINV = { sin: v => tgDeg(Math.asin(v)), kos: v => tgDeg(Math.acos(v)), tan: v => tgDeg(Math.atan(v)) };
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
const TGWHAT = { hyp: 'hipotenus', opp: 'sisi bertentangan', adj: 'sisi bersebelahan' };
const TGFN = ['sin', 'kos', 'tan'];
const TGNISBAH = { sin: 'bertentangan ÷ hipotenus', kos: 'bersebelahan ÷ hipotenus', tan: 'bertentangan ÷ bersebelahan' };
// nilai tepat sudut khas
const TGKHAS = {
  'sin 30°': '1/2', 'sin 45°': '1/√2', 'sin 60°': '√3/2',
  'kos 30°': '√3/2', 'kos 45°': '1/√2', 'kos 60°': '1/2',
  'tan 30°': '1/√3', 'tan 45°': '1', 'tan 60°': '√3'
};
const TGKHASV = ['1/2', '1/√2', '√3/2', '1/√3', '1', '√3'];
// sebutan rasional bagi operasi: [paparan, gantian, nilai [n, d]]
const TGTERM = [
  ['sin 30°', '1/2', [1, 2]], ['kos 60°', '1/2', [1, 2]], ['tan 45°', '1', [1, 1]],
  ['sin 60° × kos 30°', '√3/2 × √3/2', [3, 4]], ['tan 30° × tan 60°', '1/√3 × √3', [1, 1]],
  ['sin 45° × kos 45°', '1/√2 × 1/√2', [1, 2]], ['kos 30° × tan 30°', '√3/2 × 1/√3', [1, 2]],
  ['sin 60° × tan 60°', '√3/2 × √3', [3, 2]]
];
const TGBS1 = [
  ['Hipotenus ialah sisi terpanjang dalam segi tiga bersudut tegak.', true, 'Hipotenus bertentangan dengan sudut tegak, iaitu sudut terbesar, maka ia sisi terpanjang.'],
  ['Hipotenus boleh menjadi sisi bersebelahan bagi suatu sudut tirus.', false, 'Hipotenus menyentuh sudut tirus tetapi ia tidak dipanggil sisi bersebelahan.'],
  ['Sisi bertentangan bagi suatu sudut tidak menyentuh bucu sudut itu.', true, 'Sisi bertentangan berada berhadapan dengan sudut itu.'],
  ['Sisi bertentangan bagi satu sudut tirus ialah sisi bersebelahan bagi sudut tirus yang satu lagi.', true, 'Kedua-dua sisi pendek bertukar peranan apabila sudut yang dirujuk bertukar.'],
  ['Hipotenus bertukar apabila sudut tirus yang dirujuk bertukar.', false, 'Hipotenus sentiasa bertentangan dengan sudut tegak, jadi ia tidak bertukar.'],
  ['Sisi bersebelahan bagi suatu sudut menyentuh bucu sudut itu.', true, 'Sisi bersebelahan ialah sisi yang menyentuh sudut itu, selain hipotenus.'],
  ['Sisi tegak dalam rajah sentiasa sisi bertentangan.', false, 'Nama sisi bergantung pada kedudukan sudut yang dirujuk, bukan arah sisi.'],
  ['Setiap segi tiga bersudut tegak mempunyai dua sudut tirus.', true, 'Jumlah sudut 180°, satu sudut 90°, maka dua sudut lagi tirus.']
];
const TGBS2 = [
  ['sin θ = sisi bertentangan ÷ hipotenus.', true, 'Ini ialah takrif sinus.'],
  ['tan θ = sisi bersebelahan ÷ sisi bertentangan.', false, 'tan θ = sisi bertentangan ÷ sisi bersebelahan.'],
  ['Nilai sin θ bagi sudut tirus sentiasa kurang daripada 1.', true, 'Sisi bertentangan sentiasa lebih pendek daripada hipotenus.'],
  ['Apabila θ bertambah, nilai kos θ juga bertambah.', false, 'Apabila θ bertambah, kos θ berkurang.'],
  ['Dua segi tiga bersudut tegak yang berlainan saiz tetapi mempunyai sudut θ yang sama mempunyai nilai sin θ yang sama.', true, 'Bagi sudut yang sama, nisbah sisi adalah tetap.'],
  ['Nilai tan θ tidak boleh melebihi 1.', false, 'tan θ melebihi 1 apabila θ > 45°, contohnya tan 60° = √3.'],
  ['kos θ = sisi bersebelahan ÷ hipotenus.', true, 'Ini ialah takrif kosinus.'],
  ['Jika saiz segi tiga digandakan, nilai tan θ juga digandakan.', false, 'Kedua-dua sisi digandakan, maka nisbahnya tidak berubah.']
];

/* =================== rajah =================== */
const tgT = (x, y, t, c = 'tx', sz = 16, a = 'middle') => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
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
  return `<svg viewBox="0 0 320 234" role="img" aria-label="${esc(o.label || 'Segi tiga bersudut tegak')}" font-family="Inter, sans-serif">${g}</svg>`;
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
    ({ what, tri }) => ({ q: `Rajah di bawah menunjukkan segi tiga bersudut tegak ${tri}. Namakan ${what} bagi sudut θ.` }),
    ({ what }) => ({ q: `Berdasarkan rajah di bawah, sisi manakah ialah ${what} bagi sudut θ?` }),
    ({ what, tri }) => ({ q: `Dalam ∆${tri} di bawah, θ ialah sudut tirus. Nyatakan ${what} bagi θ.` }),
    ({ what, other, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sisi ${other} dalam rajah di bawah ialah ${what} bagi sudut θ. Adakah ${N} betul?` }, salah(N, ans, `${other} bukan ${what} bagi θ.`)); }
  ],
  kenalNama: [
    ({ tri, rt, what, ang }) => ({ q: `Dalam ∆${tri}, ${rt} = 90°. Nyatakan ${what} bagi ${ang}.` }),
    ({ tri, rt, what, ang }) => ({ q: `∆${tri} ialah segi tiga bersudut tegak dengan ${rt} = 90°. Sisi manakah ialah ${what} bagi ${ang}?` }),
    ({ tri, rt, what, ang }) => ({ q: `Diberi ∆${tri} dengan ${rt} = 90°. Namakan ${what} jika sudut yang dirujuk ialah ${ang}.` }),
    ({ tri, rt, what, ang }) => ({ q: `Lakarkan ∆${tri} dengan ${rt} = 90°. Kemudian, nyatakan ${what} bagi ${ang}.` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  duaSudut: [
    ({ a1, a2 }) => ({ q: `Berdasarkan rajah di bawah, nyatakan (a) sisi bertentangan bagi ${a1}, (b) sisi bersebelahan bagi ${a2}.` }),
    ({ a1, a2 }) => ({ q: `Rajah di bawah menunjukkan segi tiga bersudut tegak. Namakan (a) sisi bertentangan bagi ${a1} dan (b) sisi bersebelahan bagi ${a2}.` }),
    ({ a1, a2 }) => ({ q: `Dalam rajah di bawah, (a) sisi manakah bertentangan dengan ${a1}? (b) Sisi manakah bersebelahan dengan ${a2}?` })
  ],
  sudutDari: [
    ({ sd, peranan }) => ({ q: `Berdasarkan rajah di bawah, sisi ${sd} ialah ${peranan} bagi sudut tirus yang mana?` }),
    ({ sd, peranan }) => ({ q: `Dalam rajah di bawah, nyatakan sudut tirus yang mempunyai ${sd} sebagai ${peranan}nya.` }),
    ({ sd, peranan, ans }) => { const N = vnama(); return { q: `${N} ingin menggunakan ${sd} sebagai ${peranan}. Sudut tirus manakah yang perlu ${N} rujuk dalam rajah di bawah?` }; }
  ],
  k511: [
    ({ A, B, C, D }) => ({ q: `Dalam rajah di bawah, ${tgAng(B, A, C)} = 90° dan ${B}${D} berserenjang dengan ${A}${C}. (a) Namakan hipotenus bagi ∆${A}${B}${C} dan ∆${B}${C}${D}. (b) Dalam ∆${B}${C}${D}, namakan sisi bertentangan dan sisi bersebelahan bagi ${tgAng(C, B, D)}.`, ans: `(a) ${tgSide(A, C)}; ${tgSide(B, C)} (b) bertentangan ${tgSide(B, D)}, bersebelahan ${tgSide(C, D)}`, work: [`∆${A}${B}${C}: sudut tegak di ${B}, maka hipotenus = ${tgSide(A, C)}.`, `∆${B}${C}${D}: sudut tegak di ${D}, maka hipotenus = ${tgSide(B, C)}.`, `Bagi ${tgAng(C, B, D)}: sisi yang tidak menyentuh ${C} ialah ${tgSide(B, D)} (bertentangan); sisi yang menyentuh ${C} selain hipotenus ialah ${tgSide(C, D)} (bersebelahan).`] }),
    ({ A, B, C, D }) => ({ q: `Dalam rajah di bawah, ${tgAng(B, A, C)} = 90° dan ${B}${D} ⊥ ${A}${C}. (a) Namakan hipotenus bagi ∆${A}${B}${D}. (b) Dalam ∆${A}${B}${D}, namakan sisi bertentangan dan sisi bersebelahan bagi ${tgAng(A, B, D)}.`, ans: `(a) ${tgSide(A, B)} (b) bertentangan ${tgSide(B, D)}, bersebelahan ${tgSide(A, D)}`, work: [`∆${A}${B}${D}: sudut tegak di ${D}, maka hipotenus = ${tgSide(A, B)}.`, `Bagi ${tgAng(A, B, D)}: ${tgSide(B, D)} tidak menyentuh ${A}, maka ia sisi bertentangan.`, `${tgSide(A, D)} menyentuh ${A} dan bukan hipotenus, maka ia sisi bersebelahan.`] }),
    ({ A, B, C, D }) => ({ q: `Dalam rajah di bawah, ${tgAng(B, A, C)} = 90° dan ${B}${D} ⊥ ${A}${C}. Dalam ∆${B}${C}${D}, sisi ${B}${D} ialah sisi apa bagi (a) ${tgAng(C, B, D)}, (b) ${tgAng(B, C, D)}? (c) Namakan hipotenus ∆${B}${C}${D}.`, ans: `(a) sisi bertentangan (b) sisi bersebelahan (c) ${tgSide(B, C)}`, work: [`∆${B}${C}${D} bersudut tegak di ${D}, maka hipotenus = ${tgSide(B, C)}.`, `(a) ${tgAng(C, B, D)} di bucu ${C}: ${B}${D} tidak menyentuh ${C}, maka ia sisi bertentangan.`, `(b) ${tgAng(B, C, D)} di bucu ${B}: ${B}${D} menyentuh ${B} dan bukan hipotenus, maka ia sisi bersebelahan.`] })
  ],

  /* ---------- 5.1.2 sin, kos, tan ---------- */
  nisbahRajah: [
    ({ fn }) => ({ q: `Berdasarkan rajah di bawah, cari nilai ${fn} θ. Beri jawapan sebagai pecahan termudah.` }),
    ({ fn }) => ({ q: `Rajah di bawah menunjukkan sebuah segi tiga bersudut tegak. Tulis ${fn} θ dalam bentuk pecahan.` }),
    ({ fn }) => ({ q: `Hitung ${fn} θ bagi segi tiga dalam rajah di bawah.` }),
    ({ fn, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${fn} θ = ${wrong} bagi segi tiga di bawah. Adakah ${N} betul?` }, salah(N, ans, `${N} tersilap memilih sisi. ${fn} θ = ${TGNISBAH[fn]}.`)); },
    ({ fn }) => ({ q: `Lengkapkan: Bagi segi tiga di bawah, ${fn} θ = ${TGNISBAH[fn]} = ___` })
  ],
  nisbahHuruf: [
    ({ fn, ang }) => ({ q: `Berdasarkan rajah di bawah, ungkapkan ${fn} ${ang} sebagai nisbah dua sisi.` }),
    ({ fn, ang }) => ({ q: `Tulis ${fn} ${ang} dalam sebutan sisi-sisi segi tiga di bawah.` }),
    ({ fn, ang }) => ({ q: `Rajah di bawah menunjukkan segi tiga bersudut tegak. Nyatakan ${fn} ${ang} sebagai pecahan dua sisi.` })
  ],
  sisiKetiga: [
    ({ fn, giv }) => ({ q: `Dalam segi tiga bersudut tegak di bawah, ${giv}. Cari nilai ${fn} θ.` }),
    ({ fn, giv }) => ({ q: `Diberi ${giv}, seperti dalam rajah di bawah. Hitung ${fn} θ sebagai pecahan termudah.` }),
    ({ fn }) => ({ q: `Satu sisi segi tiga di bawah tidak diberi. Cari ${fn} θ.` }),
    ({ fn, giv }) => ({ q: `Rajah di bawah menunjukkan segi tiga bersudut tegak dengan ${giv}. Tentukan ${fn} θ.` })
  ],
  kesanSudut: [
    ({ fn, a, b }) => ({ q: `Tanpa menggunakan kalkulator, yang manakah lebih besar: ${fn} ${a}° atau ${fn} ${b}°? Beri sebab.` }),
    ({ fn, a, b }) => ({ q: `Bandingkan ${fn} ${a}° dengan ${fn} ${b}°. Yang manakah lebih besar? Terangkan.` }),
    ({ fn, a, b, ans }) => { const N = vnama(); return { q: `${N} berkata ${fn} ${a}° dan ${fn} ${b}° mempunyai nilai yang sama kerana kedua-duanya nisbah ${fn}. Adakah ${N} betul?`, ans: `Tidak betul. ${ans}` }; },
    ({ fn, a, b }) => ({ q: `Tanpa mengira, nyatakan sama ada ${fn} ${a}° lebih besar atau lebih kecil daripada ${fn} ${b}°.` })
  ],
  k512: [
    ({ g, H, ansP }) => ({ q: `Dalam ∆PQR di bawah, ∠PQR = 90°, ${g.giv} dan PR = ${H} cm, dengan θ = ∠QPR. Hitung (a) panjang ${g.sideN}, (b) panjang ${g.sideM}, (c) ${g.f2} θ.`, ans: ansP }),
    ({ g, H }) => ({ q: `Sebuah segi tiga bersudut tegak mempunyai hipotenus ${H} cm dan ${g.giv}, dengan θ sudut tirus. Cari (a) sisi bertentangan, (b) sisi bersebelahan, (c) ${g.f2} θ.`, rev: true }),
    ({ g, H }) => ({ q: `Diberi ${g.giv}, dengan θ sudut tirus dalam segi tiga bersudut tegak yang hipotenusnya ${H} cm. Tentukan (a) sisi bertentangan, (b) sisi bersebelahan, dan (c) nilai ${g.f2} θ.`, rev: true })
  ],

  /* ---------- 5.1.4 nilai & sudut khas ---------- */
  kalk: [
    ({ fn, a }) => ({ q: `Dengan menggunakan kalkulator, cari nilai ${fn} ${a}° betul kepada 4 tempat perpuluhan.` }),
    ({ fn, a }) => ({ q: `Tentukan nilai ${fn} ${a}°. Beri jawapan betul kepada 4 tempat perpuluhan.` }),
    ({ fn, a }) => ({ q: `Hitung ${fn} ${a}° (4 tempat perpuluhan).` }),
    ({ fn, a, ans }) => { const N = vnama(); return { q: `${N} mendapati ${fn} ${a}° = ${ans}. Semak jawapan ${N} dengan kalkulator dan nyatakan sama ada betul.`, ans: `Betul, ${fn} ${a}° = ${ans}` }; }
  ],
  sudutKalk: [
    ({ fn, v }) => ({ q: `Diberi ${fn} θ = ${v} dan θ ialah sudut tirus. Cari θ betul kepada 2 tempat perpuluhan.` }),
    ({ fn, v }) => ({ q: `Cari sudut tirus θ jika ${fn} θ = ${v}. Beri jawapan dalam darjah, 2 tempat perpuluhan.` }),
    ({ fn, v }) => ({ q: `Dengan kalkulator, tentukan θ (2 tempat perpuluhan) bagi ${fn} θ = ${v}, 0° &lt; θ &lt; 90°.` })
  ],
  khas: [
    ({ e }) => ({ q: `Tanpa menggunakan kalkulator, nyatakan nilai ${e}.` }),
    ({ e }) => ({ q: `Tulis nilai tepat bagi ${e}.` }),
    ({ e }) => ({ q: `Berdasarkan segi tiga sudut khas, apakah nilai ${e}?` })
  ],
  darjahMinit: [
    ({ x, toDM }) => ({ q: toDM ? `Tukarkan ${x}° kepada darjah dan minit.` : `Tukarkan ${x} kepada darjah dalam bentuk perpuluhan.` }),
    ({ x, toDM }) => ({ q: toDM ? `Ungkapkan ${x}° dalam darjah dan minit.` : `Ungkapkan ${x} dalam darjah perpuluhan.` }),
    ({ x, toDM }) => ({ q: toDM ? `Sudut ${x}° ditulis dalam darjah dan minit sebagai ___` : `Sudut ${x} bersamaan ___ darjah (perpuluhan).` })
  ],
  operasi: [
    ({ e }) => ({ q: `Tanpa menggunakan kalkulator, hitung nilai ${e}.` }),
    ({ e }) => ({ q: `Nilaikan ${e} tanpa kalkulator.` }),
    ({ e }) => ({ q: `Cari nilai tepat bagi ${e}.` }),
    ({ e, ans }) => { const N = vnama(); return { q: `${N} mengira ${e} tanpa kalkulator. Apakah jawapan yang sepatutnya diperoleh ${N}?` }; }
  ],
  khasSudut: [
    ({ eq }) => ({ q: `Diberi ${eq} dan θ ialah sudut tirus. Cari θ tanpa menggunakan kalkulator.` }),
    ({ eq }) => ({ q: `Tanpa kalkulator, tentukan sudut tirus θ jika ${eq}.` }),
    ({ eq }) => ({ q: `Jika ${eq}, dengan 0° &lt; θ &lt; 90°, apakah nilai θ?` })
  ],
  sudutMinit: [
    ({ fn, v }) => ({ q: `Diberi ${fn} θ = ${v}. Cari sudut tirus θ dalam darjah dan minit.` }),
    ({ fn, v }) => ({ q: `Cari θ, dalam darjah dan minit, jika ${fn} θ = ${v} dan θ ialah sudut tirus.` }),
    ({ fn, v }) => ({ q: `Dengan menggunakan kalkulator, tentukan θ (darjah dan minit) bagi ${fn} θ = ${v}.` })
  ],
  k514: [
    ({ s }) => ({ q: `Dalam rajah di bawah, ∠ABC = 90°, ∠BAC = ${s.ang}° dan ${s.giv}. Tanpa menggunakan kalkulator, cari panjang ${s.f1} dan ${s.f2}.` }),
    ({ s }) => ({ q: `Rajah di bawah menunjukkan ∆ABC bersudut tegak di B dengan ∠BAC = ${s.ang}° dan ${s.giv}. Hitung ${s.f1} dan ${s.f2} dalam bentuk tepat (tanpa kalkulator).` }),
    ({ s }) => ({ q: `Gunakan nilai sudut khas untuk mencari panjang ${s.f1} dan ${s.f2} dalam rajah di bawah, dengan ∠BAC = ${s.ang}° dan ${s.giv}.` })
  ],

  /* ---------- 5.1.7 penyelesaian masalah ---------- */
  cariSisi: [
    () => ({ q: 'Berdasarkan rajah di bawah, hitung panjang <i>x</i>. Beri jawapan betul kepada 2 tempat perpuluhan.' }),
    () => ({ q: 'Cari nilai <i>x</i> dalam rajah di bawah (2 tempat perpuluhan).' }),
    ({ th, fn }) => ({ q: `Rajah di bawah menunjukkan segi tiga bersudut tegak dengan sudut ${th}°. Gunakan ${fn} ${th}° untuk mencari <i>x</i>, betul kepada 2 tempat perpuluhan.` }),
    () => ({ q: 'Tentukan panjang sisi bertanda <i>x</i> dalam rajah di bawah. Bundarkan kepada 2 tempat perpuluhan.' })
  ],
  cariSudut: [
    () => ({ q: 'Berdasarkan rajah di bawah, cari sudut θ dalam darjah dan minit.' }),
    () => ({ q: 'Hitung sudut θ dalam rajah di bawah. Beri jawapan dalam darjah dan minit.' }),
    ({ fn }) => ({ q: `Gunakan nisbah ${fn} untuk mencari θ dalam rajah di bawah (darjah dan minit).` }),
    () => ({ q: 'Tentukan saiz sudut θ dalam segi tiga di bawah, dalam darjah dan minit.' })
  ],
  pilihNisbah: [
    () => ({ q: 'Nisbah trigonometri manakah (sin, kos atau tan) paling sesuai untuk mencari <i>x</i> dalam rajah di bawah? Beri sebab.' }),
    () => ({ q: 'Untuk mencari <i>x</i> dalam rajah di bawah, nyatakan nisbah yang perlu digunakan dan tulis persamaannya.' }),
    ({ ans }) => { const N = vnama(); return { q: `${N} ingin mencari <i>x</i> dalam rajah di bawah. Nisbah manakah yang patut ${N} gunakan?` }; }
  ],
  cariSisiB: [
    () => ({ q: 'Berdasarkan rajah di bawah, hitung panjang <i>x</i> betul kepada 2 tempat perpuluhan.' }),
    () => ({ q: 'Cari <i>x</i> dalam rajah di bawah. Beri jawapan kepada 2 tempat perpuluhan.' }),
    ({ wrongx, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mendapati <i>x</i> = ${wrongx} bagi rajah di bawah. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dengan nisbah. Oleh sebab <i>x</i> berada di penyebut, kita perlu membahagi.`)); },
    () => ({ q: 'Rajah di bawah menunjukkan segi tiga bersudut tegak. Tentukan panjang <i>x</i> (2 tempat perpuluhan).' })
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
  const work = [`Sudut tegak di ${t.nR}, maka hipotenus = ${t.hyp} (bertentangan dengan sudut tegak).`, `Sisi yang tidak menyentuh θ (di ${t.nA}) ialah sisi bertentangan = ${t.opp}.`, `Sisi yang menyentuh θ selain hipotenus ialah sisi bersebelahan = ${t.adj}.`];
  const tp = r.p([[4, 3], [3, 2], [5, 3], [2, 1.4], [3, 4]]);
  return GEN_LQ('kenalSisi', { what, ans, other, tri: t.tri, work }, { fig: tgTri(Object.assign({ w: tp[0], h: tp[1], V: t.V, th: 'θ' }, tgOri(r))) });
};
TG.kenalNama = (r, k) => {
  const t = tgLetTri(r), role = k == null ? r.p(['hyp', 'opp', 'adj']) : ['opp', 'adj', 'hyp'][k % 3];
  const ang = tgAng(t.nA, t.nR, t.nC), rt = tgAng(t.nR, t.nA, t.nC);
  const work = [`${rt} = 90°, maka hipotenus = ${t.hyp}.`, `${ang} berada di bucu ${t.nA}.`, `Bertentangan (tidak menyentuh ${t.nA}) = ${t.opp}; bersebelahan (menyentuh ${t.nA}, bukan hipotenus) = ${t.adj}.`];
  return GEN_LQ('kenalNama', { tri: t.tri, rt, ang, what: TGWHAT[role], ans: t[role], work }, { figAns: tgTri(Object.assign({ w: 4, h: 3, V: t.V, th: 'θ', col: true, hyp: 'hip.', opp: 'bert.', adj: 'bers.' }, tgOri(r))) });
};
TG.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
TG.duaSudut = r => {
  const t = tgLetTri(r), a1 = tgAng(t.nA, t.nR, t.nC), a2 = tgAng(t.nC, t.nA, t.nR), swap = r.f() < .5;
  // (a) bertentangan bagi a1 / a2, (b) bersebelahan bagi yang lain
  const [x1, x2] = swap ? [a2, a1] : [a1, a2];
  const opp1 = swap ? t.adj : t.opp, adj2 = swap ? t.opp : t.adj;
  const fig = tgTri(Object.assign({ w: r.p([4, 3, 5]), h: r.p([3, 2, 4]), V: t.V }, tgOri(r)));
  return GEN_LQ('duaSudut', { a1: x1, a2: x2, ans: `(a) ${opp1} (b) ${adj2}`, work: [`Hipotenus = ${t.hyp} (bertentangan dengan sudut tegak di ${t.nR}).`, `(a) Sisi yang tidak menyentuh bucu ${x1.slice(2, 3)} ialah ${opp1}.`, `(b) Sisi yang menyentuh bucu ${x2.slice(2, 3)}, selain hipotenus, ialah ${adj2}.`] }, { fig });
};
TG.sudutDari = r => {
  const t = tgLetTri(r), useOpp = r.f() < .5, sd = t.opp; // sisi R–C
  // sd bertentangan bagi sudut di A, bersebelahan bagi sudut di C
  const ans = useOpp ? tgAng(t.nA, t.nR, t.nC) : tgAng(t.nC, t.nA, t.nR);
  const peranan = useOpp ? 'sisi bertentangan' : 'sisi bersebelahan';
  const fig = tgTri(Object.assign({ w: r.p([4, 3, 5]), h: r.p([3, 2, 4]), V: t.V }, tgOri(r)));
  return GEN_LQ('sudutDari', { sd, peranan, ans, work: [`Sudut tirus ialah di ${t.nA} dan di ${t.nC}.`, `${sd} tidak menyentuh ${t.nA}, maka ${sd} bertentangan dengan ${tgAng(t.nA, t.nR, t.nC)}.`, `${sd} menyentuh ${t.nC} dan bukan hipotenus, maka ${sd} bersebelahan dengan ${tgAng(t.nC, t.nA, t.nR)}.`] }, { fig });
};
TG.k511 = r => {
  const [A, B, C, D] = r.p(TGHUR4), phi = r.i(55, 125);
  const v = GEN_LQ('k511', { A, B, C, D, ans: '' });
  return Object.assign(v, { fig: tgAltFig([A, B, C, D], phi, '') });
};

/* ---------- 5.1.2 ---------- */
const tgRatio = (fn, o, a, h) => (fn === 'sin' ? [o, h] : fn === 'kos' ? [a, h] : [o, a]);
TG.nisbahRajah = (r, k) => {
  const [o, a, h] = r.p(TGTRIP), fn = k == null ? r.p(TGFN) : TGFN[k % 3], [n, d] = tgRatio(fn, o, a, h), ans = tgFr(n, d);
  const wr = fn === 'sin' ? tgFr(o, a) : fn === 'kos' ? tgFr(o, h) : tgFr(a, o);
  const raw = `${n}/${d}`, work = [`${fn} θ = ${TGNISBAH[fn]}`, `= ${raw}`].concat(raw === ans ? [] : [`= ${ans}`]);
  const u = r.p(['cm', 'm', 'unit']), lab = x => (u === 'unit' ? `${x}` : `${x} ${u}`);
  return GEN_LQ('nisbahRajah', { fn, ans, wrong: wr, work }, { fig: tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: lab(h), opp: lab(o), adj: lab(a) }, tgOri(r))) });
};
TG.nisbahHuruf = (r, k) => {
  const t = tgLetTri(r), fn = k == null ? r.p(TGFN) : TGFN[k % 3], ang = tgAng(t.nA, t.nR, t.nC);
  const [n, d] = tgRatio(fn, t.opp, t.adj, t.hyp), ans = `${n}/${d}`;
  return GEN_LQ('nisbahHuruf', { fn, ang, ans, work: [`Bagi ${ang}: hipotenus = ${t.hyp}, bertentangan = ${t.opp}, bersebelahan = ${t.adj}.`, `${fn} ${ang} = ${TGNISBAH[fn]} = ${ans}`] }, { fig: tgTri(Object.assign({ w: 4, h: 3, V: t.V }, tgOri(r))) });
};
TG.sisiKetiga = r => {
  const [o, a, h] = r.p(TGTRIP), miss = r.p(['hyp', 'opp', 'adj']), fn = r.p(TGFN.filter(f => miss === 'hyp' ? f !== 'tan' : miss === 'opp' ? f !== 'kos' : f !== 'sin'));
  const [n, d] = tgRatio(fn, o, a, h), ans = tgFr(n, d), u = r.p(['cm', 'm']);
  const giv = miss === 'hyp' ? `sisi bertentangan = ${o} ${u} dan sisi bersebelahan = ${a} ${u}` : miss === 'opp' ? `hipotenus = ${h} ${u} dan sisi bersebelahan = ${a} ${u}` : `hipotenus = ${h} ${u} dan sisi bertentangan = ${o} ${u}`;
  const pyt = miss === 'hyp' ? `Hipotenus = √(${o}² + ${a}²) = √${o * o + a * a} = ${h} ${u}` : miss === 'opp' ? `Sisi bertentangan = √(${h}² − ${a}²) = √${o * o} = ${o} ${u}` : `Sisi bersebelahan = √(${h}² − ${o}²) = √${a * a} = ${a} ${u}`;
  const raw = `${n}/${d}`;
  return GEN_LQ('sisiKetiga', { fn, giv, ans, work: ['Guna Teorem Pythagoras untuk mencari sisi ketiga.', pyt, `${fn} θ = ${TGNISBAH[fn]} = ${raw}`].concat(raw === ans ? [] : [`= ${ans}`]) }, { fig: tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: miss === 'hyp' ? '?' : `${h} ${u}`, opp: miss === 'opp' ? '?' : `${o} ${u}`, adj: miss === 'adj' ? '?' : `${a} ${u}` }, tgOri(r))) });
};
TG.kesanSudut = r => {
  const fn = r.p(TGFN); let a, b; do { a = r.i(5, 85); b = r.i(5, 85); } while (Math.abs(a - b) < 8);
  const big = fn === 'kos' ? (a < b ? a : b) : (a > b ? a : b), small = big === a ? b : a;
  const why = fn === 'kos' ? 'kos θ berkurang apabila θ bertambah' : `${fn} θ bertambah apabila θ bertambah`;
  const ans = `${fn} ${big}° lebih besar, kerana ${why}`;
  return GEN_LQ('kesanSudut', { fn, a, b, ans, work: [`Bagi sudut tirus, ${why}.`, `${big}° ${fn === 'kos' ? '&lt;' : '&gt;'} ${small}°, maka ${fn} ${big}° &gt; ${fn} ${small}°.`, `Semakan: ${fn} ${big}° = ${tg4(TGF[fn](big))}, ${fn} ${small}° = ${tg4(TGF[fn](small))}.`] });
};
TG.k512 = r => {
  const [o, a, h] = r.p([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25]]), m = r.p([2, 3, 4]), H = h * m;
  const gk = r.p(['sin', 'kos', 'tan']);
  const g = gk === 'sin' ? { giv: `sin θ = ${tgFr(o, h)}`, f2: 'tan', sideN: 'QR', sideM: 'PQ' } : gk === 'kos' ? { giv: `kos θ = ${tgFr(a, h)}`, f2: 'tan', sideN: 'PQ', sideM: 'QR' } : { giv: `tan θ = ${tgFr(o, a)}`, f2: 'sin', sideN: 'QR', sideM: 'PQ' };
  const O = o * m, A_ = a * m, f2v = g.f2 === 'tan' ? tgFr(o, a) : tgFr(o, h);
  let work;
  if (gk === 'sin') work = [`sin θ = bertentangan ÷ hipotenus → bertentangan = ${tgFr(o, h)} × ${H} = ${O} cm`, `Bersebelahan = √(${H}² − ${O}²) = √${A_ * A_} = ${A_} cm`, `tan θ = ${O}/${A_} = ${f2v}`];
  else if (gk === 'kos') work = [`kos θ = bersebelahan ÷ hipotenus → bersebelahan = ${tgFr(a, h)} × ${H} = ${A_} cm`, `Bertentangan = √(${H}² − ${A_}²) = √${O * O} = ${O} cm`, `tan θ = ${O}/${A_} = ${f2v}`];
  else work = [`tan θ = ${tgFr(o, a)}: katakan bertentangan = ${o}k dan bersebelahan = ${a}k, maka hipotenus = √((${o}k)² + (${a}k)²) = ${h}k.`, `${h}k = ${H} → k = ${m}, maka bertentangan = ${O} cm dan bersebelahan = ${A_} cm`, `sin θ = ${O}/${H} = ${f2v}`];
  const ansP = gk === 'kos' ? `(a) PQ = ${A_} cm (b) QR = ${O} cm (c) tan θ = ${f2v}` : `(a) QR = ${O} cm (b) PQ = ${A_} cm (c) ${g.f2} θ = ${f2v}`;
  return GEN_LQ('k512', { g, H, ansP, ans: `(a) ${O} cm (b) ${A_} cm (c) ${g.f2} θ = ${f2v}`, work }, { fig: tgTri({ w: a, h: o, V: ['P', 'Q', 'R'], th: 'θ', hyp: `${H} cm` }) });
};

/* ---------- 5.1.4 ---------- */
TG.kalk = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3], a = r.i(1, 89), ans = tg4(TGF[fn](a));
  return GEN_LQ('kalk', { fn, a, ans, work: ['Pastikan kalkulator dalam mod darjah (D).', `Tekan ${fn === 'kos' ? 'cos' : fn} ${a} = → ${TGF[fn](a).toFixed(7)}…`, `≈ ${ans} (4 tempat perpuluhan)`] });
};
TG.sudutKalk = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3], v = tg4(TGF[fn](r.i(100, 850) / 10)), th = TGINV[fn](+v), ans = `θ = ${tg2(th)}°`;
  return GEN_LQ('sudutKalk', { fn, v, ans, work: [`θ = ${fn === 'kos' ? 'kos' : fn}⁻¹ ${v}`, `Tekan SHIFT ${fn === 'kos' ? 'cos' : fn} ${v} = → ${th.toFixed(5)}…`, `θ = ${tg2(th)}°`] });
};
const TGKHASK = Object.keys(TGKHAS);
TG.khas = (r, k) => {
  const e = k == null ? r.p(TGKHASK) : TGKHASK[(k * 2 + wri(0, 8)) % 9], ans = TGKHAS[e], [fn, ang] = e.split(' ');
  const tri = ang === '45°' ? 'segi tiga sama kaki bersudut tegak bersisi 1, 1, √2' : 'separuh segi tiga sama sisi bersisi 1, √3, 2';
  return GEN_LQ('khas', { e, ans, work: [`Guna ${tri}.`, `${e} = ${TGNISBAH[fn]} = ${ans}`] }, { fig: tgKhasFig(ang) });
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
  return GEN_LQ('darjahMinit', { x, toDM, ans, work: ['1′ = 1/60 darjah', `${x} = ${D} + ${M}/60`, `= ${D}${dec}°`] });
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
  const L = [['2 sin θ = 1', '30°', 'sin θ = 1/2'], ['2 kos θ = 1', '60°', 'kos θ = 1/2'], ['tan θ = √3', '60°', 'tan θ = √3'], ['√3 tan θ = 1', '30°', 'tan θ = 1/√3'], ['2 sin θ = √3', '60°', 'sin θ = √3/2'], ['2 kos θ = √3', '30°', 'kos θ = √3/2'], ['tan θ = 1', '45°', 'tan θ = 1'], ['√2 sin θ = 1', '45°', 'sin θ = 1/√2']];
  const [eq, ans, st] = k == null ? r.p(L) : L[(k * 3 + wri(0, 7)) % L.length];
  return GEN_LQ('khasSudut', { eq, ans: `θ = ${ans}`, work: [st, `Daripada nilai sudut khas, θ = ${ans}`] });
};
TG.sudutMinit = r => {
  const fn = r.p(TGFN), v = tg4(TGF[fn](r.i(100, 850) / 10)), th = TGINV[fn](+v);
  return GEN_LQ('sudutMinit', { fn, v, ans: `θ = ${tgDM(th)}`, work: [`θ = ${fn}⁻¹ ${v} = ${th.toFixed(4)}°`, `${(th - Math.floor(th)).toFixed(4)} × 60 = ${((th - Math.floor(th)) * 60).toFixed(2)}′`, `θ = ${tgDM(th)}`] });
};
TG.k514 = r => {
  const ang = r.p([30, 45, 60]), k = r.i(2, 9);
  let s;
  if (ang === 45) { const mode = r.f() < .5; s = mode ? { ang, giv: `AB = ${k} cm`, f1: 'BC', f2: 'AC', ans: `BC = ${k} cm, AC = ${k}√2 cm`, work: ['tan 45° = BC/AB = 1, maka BC = AB = ' + k + ' cm', `kos 45° = AB/AC → 1/√2 = ${k}/AC`, `AC = ${k}√2 cm`], fig: { w: 1, h: 1, adj: `${k} cm`, opp: 'BC', hyp: 'AC' } } : { ang, giv: `AC = ${2 * k} cm`, f1: 'BC', f2: 'AB', ans: `BC = AB = ${k}√2 cm`, work: [`sin 45° = BC/AC → 1/√2 = BC/${2 * k}`, `BC = ${2 * k}/√2 = ${k}√2 cm`, `Segi tiga sama kaki, maka AB = BC = ${k}√2 cm`], fig: { w: 1, h: 1, hyp: `${2 * k} cm`, opp: 'BC', adj: 'AB' } }; }
  else if (ang === 30) s = { ang, giv: `AC = ${2 * k} cm`, f1: 'BC', f2: 'AB', ans: `BC = ${k} cm, AB = ${k}√3 cm`, work: [`sin 30° = BC/AC → 1/2 = BC/${2 * k}, maka BC = ${k} cm`, `kos 30° = AB/AC → √3/2 = AB/${2 * k}`, `AB = ${k}√3 cm`], fig: { w: Math.sqrt(3), h: 1, hyp: `${2 * k} cm`, opp: 'BC', adj: 'AB' } };
  else s = { ang, giv: `AB = ${k} cm`, f1: 'BC', f2: 'AC', ans: `BC = ${k}√3 cm, AC = ${2 * k} cm`, work: [`tan 60° = BC/AB → √3 = BC/${k}, maka BC = ${k}√3 cm`, `kos 60° = AB/AC → 1/2 = ${k}/AC`, `AC = ${2 * k} cm`], fig: { w: 1, h: Math.sqrt(3), adj: `${k} cm`, opp: 'BC', hyp: 'AC' } };
  const v = vq('k514', { s, ans: s.ans, work: s.work });
  return { q: v.q, ans: s.ans, work: s.work, fig: tgTri(Object.assign({ V: ['A', 'B', 'C'], th: `${ang}°` }, s.fig)) };
};

/* ---------- 5.1.7 ---------- */
// segi tiga berangka: sudut th, satu sisi diberi, satu dicari (x)
// mod 'atas': x di pengangka (x = sisi × nisbah); 'bawah': x di penyebut (x = sisi ÷ nisbah)
const TGPAIR = { atas: [['hyp', 'opp', 'sin'], ['hyp', 'adj', 'kos'], ['adj', 'opp', 'tan']], bawah: [['opp', 'hyp', 'sin'], ['adj', 'hyp', 'kos'], ['opp', 'adj', 'tan']] };
function tgNumTri(r, mode, forceFn) {
  const th = r.i(15, 75), opts = TGPAIR[mode], pr = forceFn ? opts.find(p => p[2] === forceFn) : r.p(opts), [gv, fd, fn] = pr;
  const L = r.p([5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25]), u = r.p(['cm', 'cm', 'm']);
  const fv = TGF[fn](th), x = mode === 'atas' ? L * fv : L / fv;
  const lab = { hyp: '', opp: '', adj: '' }; lab[gv] = `${L} ${u}`; lab[fd] = 'x';
  const eqn = mode === 'atas' ? `${fn} ${th}° = x/${L}` : `${fn} ${th}° = ${L}/x`;
  const work = [`Diberi ${TGWHAT[gv]} = ${L} ${u}, dicari ${TGWHAT[fd]} → guna ${fn}.`, eqn, mode === 'atas' ? `x = ${L} × ${fn} ${th}°` : `x = ${L} ÷ ${fn} ${th}°`, `x = ${tg2(x)} ${u}`];
  const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: `${th}°` }, lab, tgOri(r)));
  return { mode, th, fn, L, u, x, ans: `x = ${tg2(x)} ${u}`, work, fig, wrongx: `${tg2(mode === 'atas' ? L / fv : L * fv)} ${u}`, gv, fd };
}
TG.cariSisi = (r, k) => { const d = tgNumTri(r, 'atas', k == null ? null : TGFN[k % 3]); return GEN_LQ('cariSisi', d, { fig: d.fig }); };
TG.cariSisiB = (r, k) => { const d = tgNumTri(r, 'bawah', k == null ? null : TGFN[k % 3]); return GEN_LQ('cariSisiB', d, { fig: d.fig }); };
TG.pilihNisbah = (r, k) => {
  const d = tgNumTri(r, r.f() < .5 ? 'atas' : 'bawah', k == null ? null : TGFN[k % 3]);
  const eqn = d.work[1];
  return GEN_LQ('pilihNisbah', { ans: `${d.fn} ${d.th}°, kerana sisi yang terlibat ialah ${TGWHAT[d.gv]} dan ${TGWHAT[d.fd]}; ${eqn}`, work: [`Sisi diberi: ${TGWHAT[d.gv]}. Sisi dicari: ${TGWHAT[d.fd]}.`, `${d.fn} θ = ${TGNISBAH[d.fn]}`, `Persamaan: ${eqn}`] }, { fig: d.fig });
};
TG.cariSudut = (r, k) => {
  const fn = k == null ? r.p(TGFN) : TGFN[k % 3]; let n, d;
  do { n = r.i(3, 20); d = r.i(4, 25); } while ((fn !== 'tan' && n >= d) || n === d || tgGcd(n, d) > 2);
  const v = n / d, th = TGINV[fn](v), u = r.p(['cm', 'm']);
  const lab = fn === 'sin' ? { opp: `${n} ${u}`, hyp: `${d} ${u}` } : fn === 'kos' ? { adj: `${n} ${u}`, hyp: `${d} ${u}` } : { opp: `${n} ${u}`, adj: `${d} ${u}` };
  const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: 'θ' }, lab, tgOri(r)));
  return GEN_LQ('cariSudut', { fn, ans: `θ = ${tgDM(th)}`, work: [`${fn} θ = ${TGNISBAH[fn]} = ${n}/${d}`, `θ = ${fn}⁻¹ (${n}/${d}) = ${th.toFixed(4)}°`, `θ = ${tgDM(th)}`] }, { fig });
};
TG.konteks = r => {
  const kind = r.p(['tangga', 'tanjakan', 'layang', 'tiang', 'gelongsor']);
  let c;
  if (kind === 'tangga') {
    const L = r.p([4, 5, 6, 7, 8]), th = r.i(55, 78), hh = L * TGF.sin(th), fi = r.f() < .5;
    c = fi ? { q1: `Sebatang tangga sepanjang ${L} m disandarkan pada dinding tegak dan membuat sudut ${th}° dengan lantai. Hitung tinggi hujung atas tangga dari lantai.`, q2: `Tangga ${L} m bersandar pada dinding dengan sudut ${th}° di antara tangga dan lantai mengufuk. Berapakah tinggi tangga mencecah dinding?`, q3: `Seorang tukang cat menyandarkan tangga ${L} m pada dinding. Tangga itu membuat sudut ${th}° dengan lantai. Cari tinggi titik sentuhan tangga pada dinding.`, ans: `${tg2(hh)} m`, work: [`Hipotenus = ${L} m, dicari sisi bertentangan → sin`, `tinggi = ${L} × sin ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('tangga', th, { th: `${th}°`, hyp: `${L} m`, opp: '?' }) }
      : { q1: `Sebatang tangga sepanjang ${L} m disandarkan pada dinding tegak dan membuat sudut ${th}° dengan lantai. Hitung jarak kaki tangga dari dinding.`, q2: `Tangga ${L} m bersandar pada dinding dengan sudut ${th}° dengan lantai. Berapa jauhkah kaki tangga dari dinding?`, q3: `Tangga ${L} m disandarkan pada dinding dan membuat sudut ${th}° dengan lantai mengufuk. Cari jarak mengufuk dari kaki tangga ke dinding.`, ans: `${tg2(L * TGF.kos(th))} m`, work: [`Hipotenus = ${L} m, dicari sisi bersebelahan → kos`, `jarak = ${L} × kos ${th}°`, `= ${tg2(L * TGF.kos(th))} m`], fig: tgCtxFig('tangga', th, { th: `${th}°`, hyp: `${L} m`, adj: '?' }) };
  } else if (kind === 'tanjakan') {
    const hc = r.p([30, 40, 45, 50, 60, 75, 80]), D = r.p([4, 5, 6, 8, 9]), th = TGINV.tan(hc / 100 / D);
    c = { q1: `Sebuah tanjakan kerusi roda naik setinggi ${hc} cm bagi jarak mengufuk ${D} m. Hitung sudut tanjakan dengan tanah dalam darjah dan minit.`, q2: `Tanjakan ke pintu sebuah dewan mempunyai tinggi ${hc} cm dan jarak mengufuk ${D} m. Cari sudut di antara tanjakan dengan tanah (darjah dan minit).`, q3: `Sebuah tanjakan dibina dengan tinggi ${hc} cm dan jarak mengufuk ${D} m. Berapakah sudut kecondongan tanjakan itu? Beri jawapan dalam darjah dan minit.`, ans: `${tgDM(th)}`, work: [`Tukar unit: ${hc} cm = ${hc / 100} m`, `tan θ = ${hc / 100}/${D}`, `θ = tan⁻¹ (${hc / 100}/${D}) = ${th.toFixed(4)}° = ${tgDM(th)}`], fig: tgCtxFig('tanjakan', Math.max(th, 12), { th: 'θ', opp: `${hc} cm`, adj: `${D} m` }) };
  } else if (kind === 'layang') {
    const L = r.p([20, 25, 30, 40, 50]), th = r.i(30, 65), hh = L * TGF.sin(th);
    c = { q1: `Tali sebuah layang-layang sepanjang ${L} m ditegangkan lurus dan membuat sudut ${th}° dengan tanah. Hitung tinggi layang-layang dari tanah. (Abaikan tinggi orang yang memegang tali.)`, q2: `Seorang murid menerbangkan layang-layang dengan tali lurus ${L} m. Tali itu membuat sudut ${th}° dengan tanah mengufuk. Berapakah tinggi layang-layang? (Abaikan tinggi murid.)`, q3: `Layang-layang diterbangkan dengan tali ${L} m yang membuat sudut ${th}° dengan tanah. Cari tinggi layang-layang itu, dengan andaian tali bermula dari paras tanah.`, ans: `${tg2(hh)} m`, work: ['Hipotenus = panjang tali, dicari sisi bertentangan → sin', `tinggi = ${L} × sin ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('layang', th, { th: `${th}°`, hyp: `${L} m`, opp: '?' }) };
  } else if (kind === 'tiang') {
    const D = r.p([6, 8, 10, 12, 15, 20]), th = r.i(30, 65), hh = D * TGF.tan(th);
    c = { q1: `Seorang murid berdiri ${D} m dari kaki sebatang tiang. Sudut dari kakinya ke puncak tiang, diukur dari tanah, ialah ${th}°. Hitung tinggi tiang itu.`, q2: `Dari satu titik di tanah ${D} m dari kaki sebuah menara, sudut ke puncak menara ialah ${th}° dengan tanah. Cari tinggi menara.`, q3: `Sebuah tiang tegak berdiri di atas tanah rata. Dari titik ${D} m dari kaki tiang, garis ke puncak tiang membuat sudut ${th}° dengan tanah. Berapakah tinggi tiang?`, ans: `${tg2(hh)} m`, work: ['Bersebelahan = jarak di tanah, dicari sisi bertentangan → tan', `tinggi = ${D} × tan ${th}°`, `= ${tg2(hh)} m`], fig: tgCtxFig('tiang', th, { th: `${th}°`, adj: `${D} m`, opp: '?' }) };
  } else {
    const hh = r.p([2, 2.5, 3, 3.5, 4]), th = r.i(25, 50), L = hh / TGF.sin(th);
    c = { q1: `Sebuah papan gelongsor setinggi ${hh} m membuat sudut ${th}° dengan tanah. Hitung panjang permukaan gelongsor itu.`, q2: `Permukaan sebuah gelongsor membuat sudut ${th}° dengan tanah dan puncaknya ${hh} m dari tanah. Berapakah panjang permukaan gelongsor?`, q3: `Puncak sebuah gelongsor berada ${hh} m di atas tanah. Jika permukaannya membuat sudut ${th}° dengan tanah, cari panjang permukaan itu.`, ans: `${tg2(L)} m`, work: ['Bertentangan = tinggi, dicari hipotenus → sin', `sin ${th}° = ${hh}/x → x = ${hh} ÷ sin ${th}°`, `= ${tg2(L)} m`], fig: tgCtxFig('gelongsor', th, { th: `${th}°`, opp: `${hh} m`, hyp: 'x' }) };
  }
  return GEN_LQ('konteks', { c, ans: c.ans, work: c.work }, { fig: c.fig });
};
TG.k517 = (r, k) => {
  const typ = k == null ? r.i(0, 2) : k % 3;
  let t;
  if (typ === 0) {
    const D = r.p([12, 15, 18, 20, 25]), th = r.i(28, 50), e = r.p([1.4, 1.5, 1.6]), x = D * TGF.tan(th), N = vnama();
    t = { q: `${N} berdiri ${D} m dari sebatang pokok di atas tanah rata. Dengan menggunakan klinometer pada paras mata ${e} m dari tanah, ${N} mendapati garis penglihatan ke puncak pokok membuat sudut ${th}° dengan garis mengufuk. Hitung tinggi pokok itu.`, ans: `${tg2(x + e)} m`, work: [`tan ${th}° = x/${D}, dengan x = tinggi puncak di atas paras mata`, `x = ${D} × tan ${th}° = ${tg2(x)} m`, `Tinggi pokok = ${tg2(x)} + ${e} = ${tg2(x + e)} m`], fig: tgCtxFig('tiang', th, { th: `${th}°`, adj: `${D} m`, opp: 'x' }) };
  } else if (typ === 1) {
    const h = r.p([6, 8, 9, 10, 12]); let a1, a2; do { a1 = r.i(40, 70); a2 = r.i(20, 40); } while (a1 - a2 < 12);
    const d1 = h / TGF.tan(a1), d2 = h / TGF.tan(a2), dc = d2 - d1;
    t = { q: `Dalam ∆ABC, ∠ABC = 90°, AB = ${h} cm dan D ialah titik pada BC. Diberi ∠ADB = ${a1}° dan ∠ACB = ${a2}°. Hitung panjang DC.`, ans: `DC = ${tg2(dc)} cm`, work: [`∆ABD: tan ${a1}° = ${h}/BD → BD = ${h} ÷ tan ${a1}° = ${tg2(d1)} cm`, `∆ABC: tan ${a2}° = ${h}/BC → BC = ${h} ÷ tan ${a2}° = ${tg2(d2)} cm`, `DC = BC − BD = ${tg2(dc)} cm (guna nilai penuh kalkulator)`], fig: tgTwoFig(h, a1, a2) };
  } else {
    const L = r.p([4, 5, 6, 8, 10]), drop = L * TGF.sin(60) - L * TGF.sin(45);
    t = { q: `Sebatang tangga sepanjang ${L} m bersandar pada dinding dan membuat sudut 60° dengan lantai. Kaki tangga kemudian ditarik menjauhi dinding sehingga sudut itu menjadi 45°. Berapa jauhkah hujung atas tangga turun? Beri jawapan betul kepada 2 tempat perpuluhan.`, ans: `${tg2(drop)} m`, work: [`Tinggi asal = ${L} sin 60° = ${L}(√3/2) = ${tg2(L * TGF.sin(60))} m`, `Tinggi baharu = ${L} sin 45° = ${L}(1/√2) = ${tg2(L * TGF.sin(45))} m`, `Jarak turun = ${tg2(drop)} m`], fig: tgCtxFig('tangga', 60, { th: '60°', hyp: `${L} m` }) };
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
      const t = tgLetTri(tgRG), role = pick(['hyp', 'opp', 'adj']), w = { hyp: 'hipotenus', opp: 'sisi bertentangan', adj: 'sisi bersebelahan' }[role];
      // pilihan ke-4: sisi palsu (huruf bukan bucu segi tiga)
      const fake = tgSide(t.nA, pick(TGHUR3.find(h => !h.includes(t.nA)) || ['W']));
      return tgMcq(`Apakah <b>${w}</b> bagi sudut θ?`, tgTri(Object.assign({ w: 4, h: 3, V: t.V, th: 'θ' }, tgOri(tgRG))), tgOptsT(t[role], [t.hyp, t.opp, t.adj, fake]));
    },
    () => {
      const L = pick(TGHUR4), [A, B, C, D] = L, ty = ri(0, 2);
      const fig = tgAltFig(L, ri(60, 120), ty === 2 ? 'A' : 'C');
      const all = [tgSide(A, B), tgSide(B, C), tgSide(A, C), tgSide(B, D), tgSide(A, D), tgSide(C, D)];
      if (ty === 0) return tgMcq(`Apakah hipotenus bagi ∆${B}${C}${D}?`, fig, tgOptsT(tgSide(B, C), all));
      if (ty === 1) return tgMcq(`Dalam ∆${B}${C}${D}, apakah sisi bertentangan bagi ${tgAng(C, B, D)}?`, fig, tgOptsT(tgSide(B, D), all));
      return tgMcq(`Dalam ∆${A}${B}${D}, apakah sisi bersebelahan bagi ${tgAng(A, B, D)}?`, fig, tgOptsT(tgSide(A, D), all));
    },
    () => {
      const L = pick(TGHUR4), [A, B, C, D] = L, fig = tgAltFig(L, ri(60, 120), 'C');
      const all = [tgSide(A, B), tgSide(B, C), tgSide(A, C), tgSide(B, D), tgSide(A, D), tgSide(C, D)];
      if (Math.random() < .5) return tgMcq(`Dalam ∆${A}${B}${C}, apakah sisi bertentangan bagi ${tgAng(C, A, B)}?`, fig, tgOptsT(tgSide(A, B), all));
      return tgMcq(`Apakah hipotenus bagi ∆${A}${B}${D}?`, fig, tgOptsT(tgSide(A, B), all));
    }
  ],
  nisbah: [
    () => {
      const [o, a, h] = pick(TGTRIP), fn = pick(TGFN), [n, d] = tgRatio(fn, o, a, h);
      return tgMcq(`Berapakah <b>${fn} θ</b>?`, tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: `${h}`, opp: `${o}`, adj: `${a}` }, tgOri(tgRG))), tgOptsT(tgFr(n, d), [tgFr(o, h), tgFr(a, h), tgFr(o, a), tgFr(a, o), tgFr(h, o), tgFr(h, a)]));
    },
    () => {
      const t = tgLetTri(tgRG), fn = pick(TGFN), [n, d] = tgRatio(fn, t.opp, t.adj, t.hyp), ang = tgAng(t.nA, t.nR, t.nC);
      return tgMcq(`${fn} ${ang} = ?`, tgTri(Object.assign({ w: 4, h: 3, V: t.V }, tgOri(tgRG))), tgOptsT(`${n}/${d}`, [`${t.opp}/${t.hyp}`, `${t.adj}/${t.hyp}`, `${t.opp}/${t.adj}`, `${t.adj}/${t.opp}`, `${t.hyp}/${t.opp}`]));
    },
    () => {
      if (Math.random() < .5) {
        const [o, a, h] = pick(TGTRIP), miss = pick(['opp', 'adj']), fn = miss === 'opp' ? 'tan' : 'kos', [n, d] = tgRatio(fn, o, a, h);
        return tgMcq(`Cari <b>${fn} θ</b>. (Guna Teorem Pythagoras)`, tgTri(Object.assign({ w: a, h: o, th: 'θ', hyp: `${h}`, opp: miss === 'opp' ? '?' : `${o}`, adj: miss === 'adj' ? '?' : `${a}` }, tgOri(tgRG))), tgOptsT(tgFr(n, d), [tgFr(o, h), tgFr(a, h), tgFr(o, a), tgFr(a, o), tgFr(h, a), tgFr(h, o)]));
      }
      const fn = pick(TGFN); let a, b; do { a = ri(5, 85); b = ri(5, 85); } while (Math.abs(a - b) < 10);
      const big = fn === 'kos' ? Math.min(a, b) : Math.max(a, b), small = big === a ? b : a;
      const o = shuffle([`${fn} ${big}° lebih besar`, `${fn} ${small}° lebih besar`, 'Kedua-duanya sama', 'Tidak dapat ditentukan']);
      return { type: 'mcq', q: `Bandingkan <b>${fn} ${a}°</b> dan <b>${fn} ${b}°</b>.`, fig: tgTri({ w: 4, h: 3, th: 'θ', col: true, hyp: 'hip.', opp: 'bert.', adj: 'bers.' }), opts: o, c: o.indexOf(`${fn} ${big}° lebih besar`) };
    }
  ],
  khas: [
    () => { const e = pick(TGKHASK); return tgMcq(`<b>${e}</b> = ?`, tgKhasFig(e.split(' ')[1]), tgOptsT(TGKHAS[e], TGKHASV)); },
    () => {
      const e = pick(TGKHASK), [fn, ang] = e.split(' '), v = TGKHAS[e];
      return tgMcq(`Jika <b>${fn} θ = ${v}</b>, maka θ = ?`, tgTri({ w: 4, h: 3, th: 'θ' }), tgOptsT(ang, ['30°', '45°', '60°', '90°']));
    },
    () => {
      let i, j; do { i = ri(0, TGTERM.length - 1); j = ri(0, TGTERM.length - 1); } while (i === j || TGTERM[i][0] === TGTERM[j][0]);
      const a = pick([1, 2]), plus = Math.random() < .6, v = tgAdd(tgMul(TGTERM[i][2], a), tgMul(TGTERM[j][2], plus ? 1 : -1)), ans = tgFr(v[0], v[1]);
      const cands = [tgFr(v[0] + v[1], v[1]), tgFr(v[0] - v[1], v[1]), tgFr(v[0] * 2, v[1]), tgFr(v[0] + 1, v[1] * 2), '1/2', '3/4', '2', '0', '1', '3/2'];
      return tgMcq(`Hitung <b>${a === 1 ? '' : a + ' '}${TGTERM[i][0]} ${plus ? '+' : '−'} ${TGTERM[j][0]}</b>`, tgKhasFig(pick(['30°', '45°', '60°'])), tgOptsT(ans, cands));
    }
  ],
  masalah: [
    () => {
      const d = tgNumTri(tgRG, 'atas'), fv = TGF[d.fn](d.th), other = d.fn === 'sin' ? TGF.kos(d.th) : d.fn === 'kos' ? TGF.sin(d.th) : 1 / TGF.tan(d.th);
      return tgMcq('Cari <b><i>x</i></b> (2 t.p.)', d.fig, tgOptsN(d.x, [d.L / fv, d.L * other, d.L * TGF.tan(d.th), d.L / other], d.u));
    },
    () => {
      const d = tgNumTri(tgRG, Math.random() < .5 ? 'atas' : 'bawah'), fv = TGF[d.fn](d.th);
      return tgMcq('Cari <b><i>x</i></b> (2 t.p.)', d.fig, tgOptsN(d.x, [d.mode === 'atas' ? d.L / fv : d.L * fv, d.L * fv, d.L / fv, d.L * TGF.kos(d.th), d.L / TGF.tan(d.th)], d.u));
    },
    () => {
      const fn = pick(TGFN); let n, dd; do { n = ri(3, 15); dd = ri(4, 20); } while ((fn !== 'tan' && n >= dd) || n === dd);
      const v = n / dd, th = TGINV[fn](v), lab = fn === 'sin' ? { opp: `${n}`, hyp: `${dd}` } : fn === 'kos' ? { adj: `${n}`, hyp: `${dd}` } : { opp: `${n}`, adj: `${dd}` };
      const fig = tgTri(Object.assign({ w: Math.cos(tgRad(th)), h: Math.sin(tgRad(th)), th: 'θ' }, lab, tgOri(tgRG)));
      const cands = [90 - th, TGINV.tan(v), v <= 1 ? TGINV.sin(v) : 0, v <= 1 ? TGINV.kos(v) : 0, TGINV.tan(1 / v), th + 5].filter(x => x > 0 && x < 90).map(x => tgDM(x));
      return tgMcq('Cari sudut <b>θ</b>', fig, tgOptsT(tgDM(th), cands.concat([tgDM(Math.min(89, th + 10)), tgDM(Math.max(1, th - 10))])));
    }
  ]
};
const CQT = { sisi: 'Sisi segi tiga', nisbah: 'sin, kos & tan', khas: 'Sudut khas', masalah: 'Cari sisi & sudut' };
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
