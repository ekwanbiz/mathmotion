'use strict';
/* =================== SUDUT BULAT · SOALAN BAB 6 SUDUT DAN TANGEN BAGI BULATAN (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "sb" / "SB" supaya tidak bertembung dengan teras.

/* =================== pembantu rawak & nombor =================== */
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
  return `<svg viewBox="${sbN1(x0)} ${sbN1(y0)} ${sbN1(x1 - x0)} ${sbN1(y1 - y0)}" role="img" aria-label="${esc(o.label || 'Rajah bulatan')}" font-family="Inter, sans-serif">${s}</svg>`;
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
  return `<svg viewBox="0 0 320 200" role="img" aria-label="Kedudukan dua bulatan" font-family="Inter, sans-serif">${s}</svg>`;
}

/* =================== data bersama =================== */
const SBBS1 = [
  ['Sudut pada lilitan yang dicangkum oleh lengkok yang sama adalah sama.', true, 'Semua sudut pada lilitan dalam tembereng yang sama dan dicangkum oleh lengkok yang sama adalah sama.'],
  ['Sudut pusat ialah separuh daripada sudut pada lilitan yang dicangkum oleh lengkok yang sama.', false, 'Sudut pusat ialah DUA kali sudut pada lilitan.'],
  ['Sudut dalam semibulatan ialah 90°.', true, 'Sudut pada lilitan yang dicangkum oleh diameter ialah ½ × 180° = 90°.'],
  ['Sudut pada lilitan yang dicangkum oleh lengkok yang sama panjang adalah sama.', true, 'Lengkok yang sama panjang mencangkum sudut pada lilitan yang sama besar.'],
  ['Jika sudut pusat ialah 100°, maka sudut pada lilitan yang dicangkum oleh lengkok yang sama ialah 200°.', false, 'Sudut pada lilitan = ½ × 100° = 50°.'],
  ['Sudut dalam semibulatan ialah 180°.', false, 'Sudut dalam semibulatan ialah 90°. Sudut pusat bagi diameter ialah 180°.'],
  ['Segi tiga yang dibentuk oleh dua jejari dan satu perentas ialah segi tiga sama kaki.', true, 'Dua sisinya ialah jejari yang sama panjang.'],
  ['Semakin panjang lengkok, semakin kecil sudut pada lilitan yang dicangkumnya.', false, 'Semakin panjang lengkok, semakin BESAR sudut pada lilitan yang dicangkumnya.']
];
const SBBS2 = [
  ['Hasil tambah sudut pedalaman yang bertentangan dalam sisi empat kitaran ialah 180°.', true, '∠A + ∠C = 180° dan ∠B + ∠D = 180°.'],
  ['Sudut peluaran sisi empat kitaran sama dengan sudut pedalaman yang bertentangan.', true, 'Sudut peluaran = 180° − sudut pedalaman bersebelahan = sudut pedalaman bertentangan.'],
  ['Sudut pedalaman yang bertentangan dalam sisi empat kitaran adalah sama.', false, 'Sudut bertentangan berjumlah 180°, tidak semestinya sama.'],
  ['Semua bucu sisi empat kitaran terletak pada lilitan bulatan.', true, 'Itulah takrif sisi empat kitaran.'],
  ['Dua sudut bersebelahan dalam sisi empat kitaran sentiasa berjumlah 180°.', false, 'Yang berjumlah 180° ialah sudut yang BERTENTANGAN.'],
  ['Sisi empat dengan sudut 70°, 100°, 110° dan 80° mengikut tertib ialah sisi empat kitaran.', true, '70° + 110° = 180° dan 100° + 80° = 180°.'],
  ['Segi empat tepat boleh dilukis sebagai sisi empat kitaran.', true, 'Sudut bertentangan 90° + 90° = 180°.'],
  ['Sisi empat dengan sudut 85°, 95°, 85° dan 95° mengikut tertib ialah sisi empat kitaran.', false, 'Sudut bertentangan 85° + 85° = 170° ≠ 180°.']
];
const SBBS3 = [
  ['Tangen kepada bulatan menyentuh bulatan pada satu titik sahaja.', true, 'Itulah takrif tangen. Titik itu dipanggil titik ketangenan.'],
  ['Tangen berserenjang dengan jejari di titik ketangenan.', true, 'Sudut di antara tangen dan jejari di titik ketangenan ialah 90°.'],
  ['Dua tangen yang dilukis dari satu titik luar adalah sama panjang.', true, 'PA = PB kerana ∆OAP dan ∆OBP kongruen.'],
  ['Sudut di antara tangen dan perentas sama dengan sudut dalam tembereng selang-seli.', true, 'Ini ialah sifat sudut dalam tembereng selang-seli.'],
  ['Garis lurus yang memotong bulatan pada dua titik ialah tangen.', false, 'Garis itu ialah sekan. Tangen menyentuh pada satu titik sahaja.'],
  ['Sudut di antara tangen dan jejari di titik ketangenan ialah 45°.', false, 'Sudutnya ialah 90°.'],
  ['Dua bulatan yang bersilang pada dua titik mempunyai empat tangen sepunya.', false, 'Dua bulatan bersilang mempunyai 2 tangen sepunya sahaja.'],
  ['Dua bulatan yang berasingan mempunyai empat tangen sepunya.', true, '2 tangen sepunya luar dan 2 tangen sepunya dalam.']
];
const SBSEP = [['berasingan (tidak bersentuh dan tidak bersilang)', 4], ['bersentuhan di luar', 3], ['bersilang pada dua titik', 2], ['bersentuhan di dalam', 1], ['berada satu di dalam yang lain tanpa bersentuhan', 0]];
const SBTRI = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41]];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 6.1 ---------- */
  lilPusat: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan. Diberi ∠${L[0]}${L[2]}${L[1]} = ${x}°. Cari ∠${L[0]}O${L[1]}.` }),
    ({ L, x }) => ({ q: `O ialah pusat bulatan ${L.join('')}. Sudut pada lilitan ${L[0]}${L[2]}${L[1]} ialah ${x}°. Hitung sudut pusat ${L[0]}O${L[1]}.` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, nyatakan nilai ∠${L[0]}O${L[1]} jika ∠${L[0]}${L[2]}${L[1]} = ${x}° dan O ialah pusat bulatan.` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `O ialah pusat bulatan dan ∠${L[0]}${L[2]}${L[1]} = ${x}°. ${N} berkata ∠${L[0]}O${L[1]} = ${x}° kerana kedua-dua sudut dicangkum oleh lengkok yang sama. Adakah ${N} betul?` }, salah(N, ans, `Sudut pusat ialah DUA kali sudut pada lilitan, bukan sama.`)); }
  ],
  pusatLil: [
    ({ L, y }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan dan ∠${L[0]}O${L[1]} = ${y}°. Cari ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, y }) => ({ q: `Sudut pusat ${L[0]}O${L[1]} ialah ${y}°. Berapakah sudut pada lilitan ${L[0]}${L[2]}${L[1]} yang dicangkum oleh lengkok yang sama?` }),
    ({ L, y }) => ({ q: `Lengkapkan: ∠${L[0]}${L[2]}${L[1]} = ½ × ∠${L[0]}O${L[1]} = ½ × ${y}° = ___` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `O ialah pusat bulatan dan ∠${L[0]}O${L[1]} = ${y}°. ${N} mendapati ∠${L[0]}${L[2]}${L[1]} = ${2 * y}°. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dengan 2. Sudut pada lilitan ialah SEPARUH sudut pusat.`)); }
  ],
  samaLengkok: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, ∠${L[0]}${L[3]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, x }) => ({ q: `Titik ${L.join(', ')} terletak pada lilitan sebuah bulatan. Diberi ∠${L[0]}${L[3]}${L[1]} = ${x}°. Nyatakan nilai ∠${L[0]}${L[2]}${L[1]} dan berikan sebabnya.`, ans: `${x}° (dicangkum oleh lengkok ${L[0]}${L[1]} yang sama)` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, berapakah ∠${L[0]}${L[2]}${L[1]} jika ∠${L[0]}${L[3]}${L[1]} = ${x}°?` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `Dalam rajah di bawah, ∠${L[0]}${L[3]}${L[1]} = ${x}°. ${N} berkata ∠${L[0]}${L[2]}${L[1]} = ${2 * x}°. Adakah ${N} betul?` }, salah(N, ans, `Kedua-dua sudut berada pada lilitan dan dicangkum oleh lengkok yang sama, jadi sudutnya sama.`)); }
  ],
  semibul: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, ${L[0]}${L[1]} ialah diameter bulatan berpusat O. Diberi ∠${L[2]}${L[0]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[1]}${L[2]}.` }),
    ({ L, x }) => ({ q: `${L[0]}${L[1]} ialah diameter sebuah bulatan dan ${L[2]} ialah satu titik pada lilitan. Jika ∠${L[2]}${L[0]}${L[1]} = ${x}°, hitung ∠${L[0]}${L[1]}${L[2]}.` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, nyatakan ∠${L[0]}${L[2]}${L[1]}, seterusnya cari ∠${L[0]}${L[1]}${L[2]}.`, ans: `∠${L[0]}${L[2]}${L[1]} = 90°, ∠${L[0]}${L[1]}${L[2]} = ${90 - x}°` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `${L[0]}${L[1]} ialah diameter dan ∠${L[2]}${L[0]}${L[1]} = ${x}°. ${N} berkata ∠${L[0]}${L[1]}${L[2]} = ${180 - x}°. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa ∠${L[0]}${L[2]}${L[1]} = 90° (sudut dalam semibulatan).`)); }
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  samaKaki: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan dan ∠O${L[0]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, x }) => ({ q: `O ialah pusat bulatan ${L.join('')}. Diberi ∠O${L[0]}${L[1]} = ${x}°. Hitung (a) ∠${L[0]}O${L[1]}, (b) ∠${L[0]}${L[2]}${L[1]}.`, ans: `(a) ${180 - 2 * x}° (b) ${90 - x}°` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, O ialah pusat bulatan. Jika ∠O${L[1]}${L[0]} = ${x}°, berapakah ∠${L[0]}${L[2]}${L[1]}?` })
  ],
  refleks: [
    ({ L, y }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan dan ∠${L[0]}O${L[1]} = ${y}°. Titik ${L[2]} terletak pada lengkok minor ${L[0]}${L[1]}. Cari ∠${L[0]}${L[2]}${L[1]}.` }),
    ({ L, y }) => ({ q: `O ialah pusat bulatan. Sudut pusat ${L[0]}O${L[1]} = ${y}°. Hitung ∠${L[0]}${L[2]}${L[1]} dengan ${L[2]} pada lengkok minor.` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `Dalam rajah di bawah, ∠${L[0]}O${L[1]} = ${y}°. ${N} berkata ∠${L[0]}${L[2]}${L[1]} = ${y / 2}°. Adakah ${N} betul?` }, salah(N, ans, `${L[2]} berada pada lengkok minor, jadi ∠${L[0]}${L[2]}${L[1]} dicangkum oleh lengkok major. Gunakan sudut refleks ${L[0]}O${L[1]}.`)); }
  ],
  gab61: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, ${L[0]}${L[1]} ialah diameter bulatan. Diberi ∠${L[2]}${L[0]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[3]}${L[2]}.` }),
    ({ L, x }) => ({ q: `${L[0]}${L[1]} ialah diameter dan ${L[2]}, ${L[3]} ialah titik pada lilitan seperti dalam rajah. Jika ∠${L[2]}${L[0]}${L[1]} = ${x}°, hitung ∠${L[0]}${L[1]}${L[2]} dan ∠${L[0]}${L[3]}${L[2]}.`, ans: `∠${L[0]}${L[1]}${L[2]} = ${90 - x}°, ∠${L[0]}${L[3]}${L[2]} = ${90 - x}°` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, berapakah ∠${L[0]}${L[3]}${L[2]} jika ${L[0]}${L[1]} ialah diameter dan ∠${L[2]}${L[0]}${L[1]} = ${x}°?` })
  ],
  k61: [
    ({ t }) => ({ q: `AB ialah diameter sebuah bulatan dan C ialah satu titik pada lilitan. AC = ${t[0]} cm dan BC = ${t[1]} cm. (a) Nyatakan ∠ACB. (b) Hitung panjang AB. (c) Cari jejari bulatan itu.`, ans: `(a) 90° (b) ${t[2]} cm (c) ${sbNum(t[2] / 2)} cm`, work: ['(a) ∠ACB = 90° (sudut dalam semibulatan)', `(b) AB² = ${t[0]}² + ${t[1]}² = ${t[2] * t[2]}, maka AB = ${t[2]} cm`, `(c) Jejari = ${t[2]} ÷ 2 = ${sbNum(t[2] / 2)} cm`] }),
    ({ e }) => ({ q: `Titik A, B, C dan D terletak pada lilitan bulatan berpusat O. Panjang lengkok AB sama dengan panjang lengkok BC, dan ∠ADB = ${e}°. Cari (a) ∠BDC, (b) ∠ADC, (c) ∠AOC.`, ans: `(a) ${e}° (b) ${2 * e}° (c) ${4 * e}°`, work: [`(a) ∠BDC = ∠ADB = ${e}° (lengkok yang sama panjang)`, `(b) ∠ADC = ${e}° + ${e}° = ${2 * e}°`, `(c) ∠AOC = 2 × ∠ADC = 2 × ${2 * e}° = ${4 * e}°`] }),
    ({ g }) => ({ q: `O ialah pusat bulatan ABC dan O terletak di dalam ∆ABC. Diberi ∠OAC = ${g[0]}° dan ∠OBC = ${g[1]}°. Cari (a) ∠ACB, (b) ∠AOB.`, ans: `(a) ${g[0] + g[1]}° (b) ${2 * (g[0] + g[1])}°`, work: [`OA = OC (jejari), maka ∠OCA = ∠OAC = ${g[0]}°`, `OB = OC (jejari), maka ∠OCB = ∠OBC = ${g[1]}°`, `(a) ∠ACB = ${g[0]}° + ${g[1]}° = ${g[0] + g[1]}°`, `(b) ∠AOB = 2 × ${g[0] + g[1]}° = ${2 * (g[0] + g[1])}°`] }),
    ({ h }) => ({ q: `Dalam sebuah bulatan berpusat O, ∠AOB = ${h[0]}° dan ∠BOC = ${h[1]}°, dengan A, B dan C pada lilitan dan O di dalam ∆ABC. Cari (a) ∠ACB, (b) ∠BAC, (c) ∠ABC.`, ans: `(a) ${h[0] / 2}° (b) ${h[1] / 2}° (c) ${180 - h[0] / 2 - h[1] / 2}°`, work: [`(a) ∠ACB = ½ × ∠AOB = ½ × ${h[0]}° = ${h[0] / 2}°`, `(b) ∠BAC = ½ × ∠BOC = ½ × ${h[1]}° = ${h[1] / 2}°`, `(c) ∠ABC = 180° − ${h[0] / 2}° − ${h[1] / 2}° = ${180 - h[0] / 2 - h[1] / 2}°`] })
  ],

  /* ---------- 6.2 ---------- */
  bertentangan: [
    ({ L, v, a, b }) => ({ q: `Dalam rajah di bawah, ${L.join('')} ialah sisi empat kitaran. Diberi ∠${v} = ${a}°. Cari ∠${b}.` }),
    ({ L, v, a, b }) => ({ q: `${L.join('')} ialah sisi empat kitaran dengan ∠${v} = ${a}°. Hitung sudut bertentangan, ∠${b}.` }),
    ({ v, a, b }) => ({ q: `Lengkapkan: ∠${b} = 180° − ∠${v} = 180° − ${a}° = ___` }),
    ({ L, v, a, b, ans }) => { const N = vnama(); return Object.assign({ q: `${L.join('')} ialah sisi empat kitaran dan ∠${v} = ${a}°. ${N} berkata ∠${b} = ${a}°. Adakah ${N} betul?` }, salah(N, ans, 'Sudut bertentangan dalam sisi empat kitaran berjumlah 180°, bukan sama.')); }
  ],
  peluaran: [
    ({ L, x }) => ({ q: `Dalam rajah di bawah, ${L.join('')} ialah sisi empat kitaran dan ${L[1]}${L[2]} dipanjangkan ke E. Diberi ∠${L[3]}${L[0]}${L[1]} = ${x}°. Cari ∠${L[3]}${L[2]}E.` }),
    ({ L, x }) => ({ q: `Sisi ${L[1]}${L[2]} bagi sisi empat kitaran ${L.join('')} dipanjangkan ke E. Jika ∠${L[3]}${L[0]}${L[1]} = ${x}°, berapakah sudut peluaran ${L[3]}${L[2]}E?` }),
    ({ L, x }) => ({ q: `Berdasarkan rajah di bawah, nyatakan nilai ∠${L[3]}${L[2]}E dan berikan sebabnya.`, ans: `${x}° (sudut peluaran = sudut pedalaman bertentangan)` }),
    ({ L, x, ans }) => { const N = vnama(); return Object.assign({ q: `Dalam rajah di bawah, ∠${L[3]}${L[0]}${L[1]} = ${x}°. ${N} berkata ∠${L[3]}${L[2]}E = ${180 - x}°. Adakah ${N} betul?` }, salah(N, ans, `${180 - x}° ialah ∠${L[1]}${L[2]}${L[3]}. Sudut peluaran = sudut pedalaman bertentangan = ${x}°.`)); }
  ],
  kenalKitaran: [
    ({ a }) => ({ q: `Sudut-sudut sebuah sisi empat PQRS mengikut tertib ialah ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° dan ∠S = ${a[3]}°. Adakah PQRS sisi empat kitaran?` }),
    ({ a }) => ({ q: `Bolehkah sebuah bulatan dilukis melalui keempat-empat bucu sisi empat PQRS jika ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° dan ∠S = ${a[3]}°? Beri sebab.` }),
    ({ a }) => ({ q: `Sebuah sisi empat PQRS mempunyai ∠P = ${a[0]}°, ∠Q = ${a[1]}°, ∠R = ${a[2]}° dan ∠S = ${a[3]}°. Tentukan sama ada PQRS ialah sisi empat kitaran.` })
  ],
  algebra62: [
    ({ L, e1, e2 }) => ({ q: `Dalam sisi empat kitaran ${L.join('')}, ∠${L[0]} = ${e1}° dan ∠${L[2]} = ${e2}°. Cari nilai x.` }),
    ({ L, e1, e2 }) => ({ q: `${L.join('')} ialah sisi empat kitaran. Diberi ∠${L[0]} = ${e1}° dan ∠${L[2]} = ${e2}°. Hitung nilai x.` }),
    ({ L, e1, e2, x, v1 }) => ({ q: `Sudut bertentangan ${L[0]} dan ${L[2]} dalam sisi empat kitaran ${L.join('')} masing-masing ialah ${e1}° dan ${e2}°. Cari nilai x dan ∠${L[0]}.`, ans: `x = ${x}, ∠${L[0]} = ${v1}°` })
  ],
  pusat62: [
    ({ L, y }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan dan ${L.join('')} ialah sisi empat kitaran. Diberi ∠${L[1]}O${L[3]} = ${y}°. Cari ∠${L[1]}${L[2]}${L[3]}.` }),
    ({ L, y }) => ({ q: `O ialah pusat bulatan dan ∠${L[1]}O${L[3]} = ${y}°. Hitung (a) ∠${L[1]}${L[0]}${L[3]}, (b) ∠${L[1]}${L[2]}${L[3]}.`, ans: `(a) ${y / 2}° (b) ${180 - y / 2}°` }),
    ({ L, y, ans }) => { const N = vnama(); return Object.assign({ q: `Dalam rajah di bawah, ∠${L[1]}O${L[3]} = ${y}°. ${N} berkata ∠${L[1]}${L[2]}${L[3]} = ${y / 2}°. Adakah ${N} betul?` }, salah(N, ans, `${y / 2}° ialah ∠${L[1]}${L[0]}${L[3]}. ∠${L[1]}${L[2]}${L[3]} bertentangan dengannya, jadi 180° − ${y / 2}°.`)); }
  ],
  duaSudut: [
    ({ L, p, q }) => ({ q: `Dalam rajah di bawah, ${L.join('')} ialah sisi empat kitaran dengan ∠${L[3]}${L[0]}${L[1]} = ${p}° dan ∠${L[0]}${L[1]}${L[2]} = ${q}°. Cari nilai x dan y.` }),
    ({ L, p, q }) => ({ q: `Berdasarkan rajah di bawah, hitung nilai x dan nilai y.` }),
    ({ L, p, q }) => ({ q: `${L.join('')} ialah sisi empat kitaran. Diberi ∠${L[0]} = ${p}° dan ∠${L[1]} = ${q}°. Jika ∠${L[2]} = x° dan ∠${L[3]} = y°, cari x + y.`, ans: `x + y = ${360 - p - q}` })
  ],
  k62: [
    ({ u }) => ({ q: `ABCD ialah sisi empat kitaran dengan AB = AD. Diberi ∠BCD = ${u}°. Cari (a) ∠BAD, (b) ∠ABD.`, ans: `(a) ${180 - u}° (b) ${u / 2}°`, work: [`(a) ∠BAD = 180° − ${u}° = ${180 - u}° (sudut bertentangan)`, '(b) AB = AD, maka ∆ABD sama kaki dan ∠ABD = ∠ADB.', `∠ABD = (180° − ${180 - u}°) ÷ 2 = ${u / 2}°`] }),
    ({ w }) => ({ q: `ABCD ialah sisi empat kitaran dan AC ialah diameter bulatan. Diberi ∠BAC = ${w[0]}° dan ∠CAD = ${w[1]}°. Cari (a) ∠ABC, (b) ∠BCA, (c) ∠BCD.`, ans: `(a) 90° (b) ${90 - w[0]}° (c) ${180 - w[0] - w[1]}°`, work: ['(a) ∠ABC = 90° (sudut dalam semibulatan)', `(b) ∠BCA = 180° − 90° − ${w[0]}° = ${90 - w[0]}°`, `(c) ∠BAD = ${w[0]}° + ${w[1]}° = ${w[0] + w[1]}°, maka ∠BCD = 180° − ${w[0] + w[1]}° = ${180 - w[0] - w[1]}°`] }),
    ({ z }) => ({ q: `Dalam sisi empat kitaran PQRS, ∠P = ${z.a}x°, ∠R = (x + ${z.c})°, ∠Q = ${z.b}y° dan ∠S = (y + ${z.d})°. Cari nilai x dan y.`, ans: `x = ${z.x}, y = ${z.y}`, work: [`∠P + ∠R = 180°: ${z.a}x + x + ${z.c} = 180`, `${z.a + 1}x = ${180 - z.c}, maka x = ${z.x}`, `∠Q + ∠S = 180°: ${z.b}y + y + ${z.d} = 180`, `${z.b + 1}y = ${180 - z.d}, maka y = ${z.y}`] })
  ],

  /* ---------- 6.3 ---------- */
  tjSudut: [
    ({ x }) => ({ q: `Dalam rajah di bawah, PA ialah tangen kepada bulatan berpusat O di A. Diberi ∠AOP = ${x}°. Cari ∠APO.` }),
    ({ x }) => ({ q: `PA menyentuh bulatan berpusat O di titik A. Jika ∠AOP = ${x}°, hitung ∠OPA.` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, nyatakan ∠OAP, seterusnya cari ∠APO.`, ans: `∠OAP = 90°, ∠APO = ${90 - x}°` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA ialah tangen di A dan ∠AOP = ${x}°. ${N} berkata ∠APO = ${180 - x}°. Adakah ${N} betul?` }, salah(N, ans, '∠OAP = 90° (tangen ⊥ jejari). Hasil tambah sudut dalam ∆OAP ialah 180°.')); }
  ],
  tjPanjang: [
    ({ r, h }) => ({ q: `PA ialah tangen kepada bulatan berpusat O di A. Jejari bulatan ialah ${r} cm dan OP = ${h} cm. Hitung panjang PA.` }),
    ({ r, h }) => ({ q: `Sebuah bulatan berpusat O mempunyai jejari ${r} cm. Titik P berada ${h} cm dari O. Cari panjang tangen dari P ke bulatan itu.` }),
    ({ r, h }) => ({ q: `Lengkapkan: PA² = OP² − OA² = ${h}² − ${r}² = ___, maka PA = ___` })
  ],
  tjOP: [
    ({ r, t }) => ({ q: `PA ialah tangen di A kepada bulatan berpusat O. Diberi OA = ${r} cm dan PA = ${t} cm. Cari OP.` }),
    ({ r, t }) => ({ q: `Tangen PA sepanjang ${t} cm menyentuh bulatan berjejari ${r} cm di A. Berapakah jarak titik P dari pusat O?` }),
    ({ r, t, h, ans }) => { const N = vnama(); return Object.assign({ q: `PA ialah tangen di A, OA = ${r} cm dan PA = ${t} cm. ${N} berkata OP = ${r + t} cm. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah panjang sisi. ∠OAP = 90°, jadi guna Teorem Pythagoras.`)); }
  ],
  duaTangen: [
    ({ a }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O. Jika PA = ${a} cm, nyatakan panjang PB.` }),
    ({ x }) => ({ q: `Dalam rajah di bawah, PA dan PB ialah tangen kepada bulatan berpusat O. Diberi ∠APO = ${x}°. Cari ∠APB.` }),
    ({ x }) => ({ q: `PA dan PB ialah tangen dari titik P kepada bulatan berpusat O. Jika ∠APB = ${2 * x}°, cari ∠OPB.` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, PA dan PB ialah tangen. Diberi ∠AOP = ${x}°. Cari ∠AOB.` })
  ],
  temberengSS: [
    ({ x }) => ({ q: `Dalam rajah di bawah, SAT ialah tangen kepada bulatan di A. Diberi ∠TAB = ${x}°. Cari ∠ACB.` }),
    ({ x }) => ({ q: `SAT menyentuh bulatan di A. Jika sudut di antara tangen AT dan perentas AB ialah ${x}°, berapakah ∠ACB?` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, nyatakan nilai ∠ACB dan berikan sebabnya.`, ans: `${x}° (sudut dalam tembereng selang-seli)` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `SAT ialah tangen di A dan ∠TAB = ${x}°. ${N} berkata ∠ACB = ${90 - x}°. Adakah ${N} betul?` }, salah(N, ans, 'Sudut di antara tangen dan perentas SAMA dengan sudut dalam tembereng selang-seli.')); }
  ],
  sepunya: [
    ({ pos }) => ({ q: `Dua bulatan ${pos}. Berapakah bilangan tangen sepunya yang boleh dilukis?` }),
    ({ pos }) => ({ q: `Nyatakan bilangan tangen sepunya bagi dua bulatan yang ${pos}.` }),
    ({ pos }) => ({ q: `Sebuah tali sawat perlu melilit dua takal bulat. Jika dua takal itu ${pos}, berapakah bilangan garis tangen sepunya bagi kedua-dua takal?` })
  ],
  tjKite: [
    ({ x }) => ({ q: `Dalam rajah di bawah, PA dan PB ialah tangen kepada bulatan berpusat O. Diberi ∠APB = ${x}°. Cari ∠AOB.` }),
    ({ x }) => ({ q: `PA dan PB menyentuh bulatan berpusat O di A dan B. Jika ∠APB = ${x}°, hitung sudut refleks AOB.`, ans: `${180 + x}°`, work: ['∠OAP = ∠OBP = 90° (tangen ⊥ jejari)', `∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `Sudut refleks AOB = 360° − ${180 - x}° = ${180 + x}°`] }),
    ({ x }) => ({ q: `Tangen PA dan PB dilukis dari titik P. ∠APB = ${x}°. Berapakah ∠AOB, dengan O pusat bulatan?` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA dan PB ialah tangen dan ∠APB = ${x}°. ${N} berkata ∠AOB = ${2 * x}°. Adakah ${N} betul?` }, salah(N, ans, '∠OAP = ∠OBP = 90°. Hasil tambah sudut dalam sisi empat OAPB ialah 360°.')); }
  ],
  ssTiga: [
    ({ x, y }) => ({ q: `Dalam rajah di bawah, SAT ialah tangen di A. Diberi ∠TAB = ${x}° dan ∠ABC = ${y}°. Cari ∠BAC.` }),
    ({ x, y }) => ({ q: `SAT ialah tangen kepada bulatan ABC di A. Jika ∠TAB = ${x}° dan ∠ABC = ${y}°, hitung ∠ACB dan ∠BAC.`, ans: `∠ACB = ${x}°, ∠BAC = ${180 - x - y}°` }),
    ({ x, y }) => ({ q: `Berdasarkan rajah di bawah, cari nilai ∠BAC.` })
  ],
  tjDua: [
    ({ r, h }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O berjejari ${r} cm. OP = ${h} cm. Hitung perimeter sisi empat OAPB.` }),
    ({ r, h }) => ({ q: `Dari titik P yang berada ${h} cm dari pusat O, dua tangen PA dan PB dilukis kepada bulatan berjejari ${r} cm. Cari jumlah panjang PA + PB.` }),
    ({ r, h }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O. OA = ${r} cm dan OP = ${h} cm. Hitung luas sisi empat OAPB.` })
  ],
  k63: [
    ({ t }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O di A dan B. Jejari bulatan ialah ${t[0]} cm dan PA = ${t[1]} cm. Hitung (a) OP, (b) luas sisi empat OAPB.`, ans: `(a) ${t[2]} cm (b) ${t[0] * t[1]} cm²`, work: ['∠OAP = 90° (tangen ⊥ jejari)', `(a) OP² = ${t[0]}² + ${t[1]}² = ${t[2] * t[2]}, maka OP = ${t[2]} cm`, `(b) Luas = 2 × ½ × ${t[0]} × ${t[1]} = ${t[0] * t[1]} cm²`] }),
    ({ x }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O. C ialah titik pada lengkok major AB. Diberi ∠APB = ${x}°. Cari (a) ∠AOB, (b) ∠ACB, (c) ∠PAB.`, ans: `(a) ${180 - x}° (b) ${(180 - x) / 2}° (c) ${(180 - x) / 2}°`, work: [`(a) ∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `(b) ∠ACB = ½ × ${180 - x}° = ${(180 - x) / 2}°`, `(c) PA = PB, maka ∠PAB = (180° − ${x}°) ÷ 2 = ${(180 - x) / 2}° (sama dengan ∠ACB: tembereng selang-seli)`] }),
    ({ x }) => ({ q: `SAT ialah tangen kepada bulatan di A dan AB ialah diameter. C ialah titik pada lilitan dengan ∠TAC = ${x}°. Cari (a) ∠ABC, (b) ∠ACB, (c) ∠BAC.`, ans: `(a) ${x}° (b) 90° (c) ${90 - x}°`, work: [`(a) ∠ABC = ∠TAC = ${x}° (tembereng selang-seli)`, '(b) ∠ACB = 90° (sudut dalam semibulatan)', `(c) ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`] })
  ],

  /* ---------- 6.4 ---------- */
  gTanDia: [
    ({ x }) => ({ q: `Dalam rajah di bawah, PAQ ialah tangen di A dan AB ialah diameter bulatan berpusat O. Diberi ∠QAC = ${x}°. Cari ∠BAC.` }),
    ({ x }) => ({ q: `PAQ menyentuh bulatan di A dan AB ialah diameter. Jika ∠QAC = ${x}°, hitung ∠BAC.` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, AB ialah diameter dan PAQ ialah tangen. Nyatakan ∠QAB, seterusnya cari ∠BAC.`, ans: `∠QAB = 90°, ∠BAC = ${90 - x}°` })
  ],
  gTanJej: [
    ({ x }) => ({ q: `Dalam rajah di bawah, SAT ialah tangen di A kepada bulatan berpusat O. Diberi ∠OBA = ${x}°. Cari ∠TAB.` }),
    ({ x }) => ({ q: `O ialah pusat bulatan dan SAT ialah tangen di A. Jika ∠OBA = ${x}°, hitung (a) ∠OAB, (b) ∠TAB.`, ans: `(a) ${x}° (b) ${90 - x}°` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, O ialah pusat bulatan. Berapakah ∠TAB jika ∠OBA = ${x}°?` })
  ],
  gTanIsos: [
    ({ x }) => ({ q: `Dalam rajah di bawah, PA dan PB ialah tangen kepada bulatan di A dan B. Diberi ∠APB = ${x}°. Cari ∠PAB.` }),
    ({ x }) => ({ q: `Dua tangen, PA dan PB, dilukis dari titik P. Jika ∠APB = ${x}°, hitung ∠PBA.` }),
    ({ x, ans }) => { const N = vnama(); return Object.assign({ q: `PA dan PB ialah tangen dan ∠APB = ${x}°. ${N} berkata ∠PAB = ${180 - x}°. Adakah ${N} betul?` }, salah(N, ans, 'PA = PB, jadi ∆PAB sama kaki: ∠PAB = (180° − ∠APB) ÷ 2.')); }
  ],
  gPusatKit: [
    ({ L, y }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan. ${L[1]}${L[2]} dipanjangkan ke E dan ∠${L[1]}O${L[3]} = ${y}°. Cari ∠${L[3]}${L[2]}E.` }),
    ({ L, y }) => ({ q: `O ialah pusat bulatan ${L.join('')}. Diberi ∠${L[1]}O${L[3]} = ${y}° dan ${L[1]}${L[2]} dipanjangkan ke E. Hitung sudut peluaran ${L[3]}${L[2]}E.` }),
    ({ L, y }) => ({ q: `Berdasarkan rajah di bawah, cari ∠${L[1]}${L[0]}${L[3]}, seterusnya ∠${L[3]}${L[2]}E.`, ans: `∠${L[1]}${L[0]}${L[3]} = ${y / 2}°, ∠${L[3]}${L[2]}E = ${y / 2}°` })
  ],
  gTanSS: [
    ({ x }) => ({ q: `Dalam rajah di bawah, PA dan PB ialah tangen kepada bulatan di A dan B. Diberi ∠APB = ${x}°. Cari ∠ACB.` }),
    ({ x }) => ({ q: `Tangen PA dan PB menyentuh bulatan di A dan B, dan C ialah titik pada lengkok major AB. Jika ∠APB = ${x}°, hitung ∠ACB.` }),
    ({ x }) => ({ q: `Berdasarkan rajah di bawah, cari ∠PAB, seterusnya ∠ACB.`, ans: `∠PAB = ${(180 - x) / 2}°, ∠ACB = ${(180 - x) / 2}°` })
  ],
  gKitTan: [
    ({ x, y }) => ({ q: `Dalam rajah di bawah, ABCD ialah sisi empat kitaran dan SAT ialah tangen di A. Diberi ∠TAB = ${x}° dan ∠BDC = ${y}°. Cari ∠ABC.` }),
    ({ x, y }) => ({ q: `SAT menyentuh bulatan di A. ABCD ialah sisi empat kitaran dengan ∠TAB = ${x}° dan ∠BDC = ${y}°. Hitung (a) ∠ADB, (b) ∠ABC.`, ans: `(a) ${x}° (b) ${180 - x - y}°` }),
    ({ x, y }) => ({ q: `Berdasarkan rajah di bawah, hitung ∠ABC.` })
  ],
  gHarian: [
    ({ r, h, u }) => ({ q: `Sebuah roda berjejari ${r} ${u} berpusat O. Dua utas tali, PA dan PB, menyentuh roda di A dan B, dan diikat pada titik P yang berada ${h} ${u} dari O. Hitung jumlah panjang kedua-dua utas tali itu.` }),
    ({ r, h, u }) => ({ q: `Sebuah kolam bulat berjejari ${r} ${u}. Ali berdiri di P, ${h} ${u} dari pusat kolam. Dia berjalan lurus ke tepi kolam sehingga laluannya menyentuh kolam di A. Berapakah jarak PA?` }),
    ({ r, h, u }) => ({ q: `Seutas tali sawat lurus PA menyentuh takal berjejari ${r} ${u} di A. Jika P berada ${h} ${u} dari pusat takal, cari panjang PA.` })
  ],
  k64: [
    ({ x }) => ({ q: `PAT ialah tangen kepada bulatan di A dan AB ialah diameter. C dan D ialah titik pada lilitan dengan D pada lengkok yang bertentangan dengan C. Diberi ∠PAC = ${x}°. Cari (a) ∠ABC, (b) ∠BAC, (c) ∠BDC.`, ans: `(a) ${x}° (b) ${90 - x}° (c) ${90 - x}°`, work: [`(a) ∠ABC = ∠PAC = ${x}° (tembereng selang-seli)`, `(b) ∠ACB = 90° (semibulatan), maka ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`, `(c) ∠BDC = ∠BAC = ${90 - x}° (dicangkum lengkok BC yang sama)`] }),
    ({ x }) => ({ q: `PA dan PB ialah tangen kepada bulatan berpusat O. C ialah titik pada lengkok major AB dan D ialah titik pada lengkok minor AB. Diberi ∠APB = ${x}°. Cari (a) ∠AOB, (b) ∠ACB, (c) ∠ADB.`, ans: `(a) ${180 - x}° (b) ${(180 - x) / 2}° (c) ${180 - (180 - x) / 2}°`, work: [`(a) ∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`, `(b) ∠ACB = ½ × ${180 - x}° = ${(180 - x) / 2}°`, `(c) ACBD ialah sisi empat kitaran: ∠ADB = 180° − ${(180 - x) / 2}° = ${180 - (180 - x) / 2}°`] }),
    ({ t }) => ({ q: `Sebuah cakera berjejari ${t[0]} cm berpusat O. Dua tangen, PA dan PB, dilukis dari titik P dengan OP = ${t[2]} cm. Hitung (a) panjang PA, (b) perimeter sisi empat OAPB, (c) luas sisi empat OAPB.`, ans: `(a) ${t[1]} cm (b) ${2 * (t[0] + t[1])} cm (c) ${t[0] * t[1]} cm²`, work: ['∠OAP = 90° (tangen ⊥ jejari)', `(a) PA = √(${t[2]}² − ${t[0]}²) = √${t[1] * t[1]} = ${t[1]} cm`, `(b) PB = PA = ${t[1]} cm; perimeter = 2(${t[0]} + ${t[1]}) = ${2 * (t[0] + t[1])} cm`, `(c) Luas = 2 × ½ × ${t[0]} × ${t[1]} = ${t[0] * t[1]} cm²`] })
  ]
};

/* =================== rajah khusus =================== */
// 6.1
const sbF = {
  pusat: (L, x, labC, labO) => { const c0 = 90 + 0; const o = { c: { [L[0]]: 270 - x, [L[1]]: 270 + x, [L[2]]: c0 }, seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [[L[2], L[0], L[1], labC, 'tr'], ['O', L[0], L[1], labO, 'pa']], lp: { O: [16, -12] }, label: 'Bulatan berpusat O dengan sudut pusat dan sudut pada lilitan' }; return sbFig(o); },
  sama: (L, x, labC, labD, dc, dd) => sbFig({ O: false, c: { [L[0]]: 270 - x, [L[1]]: 270 + x, [L[2]]: dc, [L[3]]: dd }, seg: [[L[2], L[0], 'tr', 3], [L[2], L[1], 'tr', 3], [L[3], L[0], 'pk', 3], [L[3], L[1], 'pk', 3]], ang: [[L[2], L[0], L[1], labC, 'tr'], [L[3], L[0], L[1], labD, 'pk']], label: 'Dua sudut pada lilitan dicangkum lengkok yang sama' }),
  semi: (L, x, labA, labB) => sbFig({ c: { [L[0]]: 180, [L[1]]: 0, [L[2]]: 2 * x }, seg: [[L[0], L[1], 'am', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], rt: [[L[2], L[0], L[1]]], ang: [[L[0], L[2], L[1], labA, 'pk'], [L[1], L[0], L[2], labB, 'gr']], lp: { O: [0, 16] }, label: 'Sudut dalam semibulatan' }),
  samaKaki: (L, x, labA, labC) => sbFig({ c: { [L[0]]: 180 + x, [L[1]]: 360 - x, [L[2]]: 95 }, poly: [[['O', L[0], L[1]], 'pa']], seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[0], L[1], 'mu', 3], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [[L[0], 'O', L[1], labA, 'pk'], [L[2], L[0], L[1], labC, 'tr']], lp: { O: [0, -16] }, label: 'Segi tiga sama kaki OAB dalam bulatan' }),
  refleks: (L, y, labO, labC) => sbFig({ c: { [L[0]]: 270 - y / 2, [L[1]]: 270 + y / 2, [L[2]]: 270 }, seg: [['O', L[0], 'pa', 3.5], ['O', L[1], 'pa', 3.5], [L[2], L[0], 'tr', 3.5], [L[2], L[1], 'tr', 3.5]], ang: [['O', L[0], L[1], labO, 'pa', false, 18, 32], [L[2], L[0], L[1], labC, 'tr']], lp: { O: [0, -16] }, label: 'Titik pada lengkok minor' }),
  gab: (L, x, labA, labD, dd) => sbFig({ c: { [L[0]]: 180, [L[1]]: 0, [L[2]]: 2 * x, [L[3]]: dd }, seg: [[L[0], L[1], 'am', 3.5], [L[0], L[2], 'tr', 3], [L[1], L[2], 'tr', 3], [L[3], L[0], 'pk', 3], [L[3], L[2], 'pk', 3]], ang: [[L[0], L[2], L[1], labA, 'tr'], [L[3], L[0], L[2], labD, 'pk']], lp: { O: [0, 16] }, label: 'Diameter dan sudut pada lilitan' }),
  // 6.2
  quad: (L, al, be, s0, angs, extra) => { const d = sbQuad(al, be, s0), c = {}; L.forEach((n, i) => { c[n] = d[i]; }); return sbFig(Object.assign({ O: false, c, poly: [[L, 'pu']], seg: [[L[0], L[1], 'pu', 3.5], [L[1], L[2], 'pu', 3.5], [L[2], L[3], 'pu', 3.5], [L[3], L[0], 'pu', 3.5]], ang: angs, label: 'Sisi empat kitaran' }, extra || {})); },
  pusatKit: (L, y, angs, ext) => { const c = { [L[0]]: 100, [L[1]]: 270 - y / 2, [L[2]]: 270 + y / 5, [L[3]]: 270 + y / 2 }; return sbFig({ c, poly: [[L, 'pu']], seg: [[L[0], L[1], 'pu', 3.5], [L[1], L[2], 'pu', 3.5], [L[2], L[3], 'pu', 3.5], [L[3], L[0], 'pu', 3.5], ['O', L[1], 'pa', 3], ['O', L[3], 'pa', 3]], ext: ext ? [[L[1], L[2], 60, 'E']] : [], ang: angs.map(g => (g[0] === 'O' ? g.concat([false, 18, 32]) : g)), lp: { O: [0, -16] }, label: 'Sisi empat kitaran dengan sudut pusat' }); },
  // 6.3
  ss: (x, labT, labC) => sbFig({ O: false, c: { A: 270, B: 270 + 2 * x, C: 270 + 2 * x + (360 - 2 * x) / 2 }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C'], 'tr']], seg: [['A', 'B', 'pa', 3.5], ['C', 'A', 'tr', 3], ['C', 'B', 'tr', 3]], ang: [['A', 'T', 'B', labT, 'am'], ['C', 'A', 'B', labC, 'am']], label: 'Tangen SAT dan sudut dalam tembereng selang-seli' }),
  ss3: (x, y) => sbFig({ O: false, c: { A: 270, B: 270 + 2 * x, C: 270 - 2 * y }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C'], 'tr']], seg: [['A', 'B', 'pa', 3.5], ['C', 'A', 'tr', 3], ['C', 'B', 'tr', 3]], ang: [['A', 'T', 'B', `${x}°`, 'am'], ['B', 'A', 'C', `${y}°`, 'pk'], ['A', 'B', 'C', '?', 'tr']], label: 'Tangen dan segi tiga dalam bulatan' }),
  // 6.4
  tanDia: (x, labQ, labB) => sbFig({ c: { A: 270, B: 90, C: 270 + 2 * x }, tan: [['A', 140, 140, 'Q', 'P']], seg: [['A', 'B', 'am', 3.5], ['A', 'C', 'pa', 3.5], ['B', 'C', 'pa', 3.5]], rt: [['C', 'A', 'B']], ang: [['A', 'Q', 'C', labQ, 'gr'], ['A', 'C', 'B', labB, 'pk']], lp: { O: [-14, 0] }, label: 'Tangen PAQ dan diameter AB' }),
  tanJej: x => sbFig({ c: { A: 270, B: 90 - 2 * x }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['O', 'A', 'B'], 'pa']], seg: [['O', 'A', 'pa', 3.5], ['O', 'B', 'pa', 3.5], ['A', 'B', 'tr', 3.5]], rt: [['A', 'O', 'S']], ang: [['B', 'O', 'A', `${x}°`, 'pk'], ['A', 'T', 'B', '?', 'am']], lp: { O: [-14, 0] }, label: 'Tangen SAT dan jejari OA, OB' }),
  kitTan: (x, y) => { const b = 270 + 2 * x, cc = b + 2 * y, d = cc + (360 + 270 - cc) / 2; return sbFig({ O: false, c: { A: 270, B: b, C: cc, D: d }, tan: [['A', 140, 140, 'T', 'S']], poly: [[['A', 'B', 'C', 'D'], 'pu']], seg: [['A', 'B', 'pu', 3.5], ['B', 'C', 'pu', 3.5], ['C', 'D', 'pu', 3.5], ['D', 'A', 'pu', 3.5], ['D', 'B', 'mu', 2.5]], ang: [['A', 'T', 'B', `${x}°`, 'am'], ['D', 'B', 'C', `${y}°`, 'pk'], ['B', 'A', 'C', '?', 'tr']], label: 'Sisi empat kitaran dan tangen' }); }
};

/* =================== pembina soalan (r = SBG atau SBW) =================== */
const SB = {};
SB.lilPusat = r => {
  const L = r.p(SBL3), x = r.i(20, 75), ans = `${2 * x}°`;
  return GEN_LQ('lilPusat', { L, x, ans, work: [`∠${L[0]}O${L[1]} dan ∠${L[0]}${L[2]}${L[1]} dicangkum oleh lengkok ${L[0]}${L[1]} yang sama.`, `∠${L[0]}O${L[1]} = 2 × ${x}° = ${2 * x}°`] }, { fig: sbF.pusat(L, x, `${x}°`, '?') });
};
SB.pusatLil = r => {
  const L = r.p(SBL3), y = sbE(r, 40, 160), ans = `${y / 2}°`;
  return GEN_LQ('pusatLil', { L, y, ans, work: ['Sudut pada lilitan = ½ × sudut pusat (lengkok yang sama)', `∠${L[0]}${L[2]}${L[1]} = ½ × ${y}° = ${y / 2}°`] }, { fig: sbF.pusat(L, y / 2, '?', `${y}°`) });
};
SB.samaLengkok = r => {
  const L = r.p(SBL4), x = r.i(25, 75), dc = r.i(50, 75), dd = r.i(105, 135), ans = `${x}°`;
  return GEN_LQ('samaLengkok', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} dan ∠${L[0]}${L[3]}${L[1]} dicangkum oleh lengkok ${L[0]}${L[1]} yang sama.`, `Maka ∠${L[0]}${L[2]}${L[1]} = ∠${L[0]}${L[3]}${L[1]} = ${x}°`] }, { fig: sbF.sama(L, x, '?', `${x}°`, dc, dd) });
};
SB.semibul = r => {
  const L = r.p(SBL3), x = r.i(20, 70), ans = `${90 - x}°`;
  return GEN_LQ('semibul', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} = 90° (sudut dalam semibulatan)`, `∠${L[0]}${L[1]}${L[2]} = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.semi(L, x, `${x}°`, '?') });
};
SB.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
SB.samaKaki = r => {
  const L = r.p(SBL3), x = r.i(15, 70), ans = `${90 - x}°`;
  return GEN_LQ('samaKaki', { L, x, ans, work: [`O${L[0]} = O${L[1]} (jejari), maka ∠O${L[1]}${L[0]} = ∠O${L[0]}${L[1]} = ${x}°`, `∠${L[0]}O${L[1]} = 180° − ${x}° − ${x}° = ${180 - 2 * x}°`, `∠${L[0]}${L[2]}${L[1]} = ½ × ${180 - 2 * x}° = ${90 - x}°`] }, { fig: sbF.samaKaki(L, x, `${x}°`, '?') });
};
SB.refleks = r => {
  const L = r.p(SBL3), y = sbE(r, 70, 160), ans = `${180 - y / 2}°`;
  return GEN_LQ('refleks', { L, y, ans, work: [`Sudut refleks ${L[0]}O${L[1]} = 360° − ${y}° = ${360 - y}°`, `∠${L[0]}${L[2]}${L[1]} = ½ × ${360 - y}° = ${180 - y / 2}°`] }, { fig: sbF.refleks(L, y, `${y}°`, '?') });
};
SB.gab61 = r => {
  const L = r.p(SBL4), x = r.i(20, 65), dd = r.i(230, 300), ans = `${90 - x}°`;
  return GEN_LQ('gab61', { L, x, ans, work: [`∠${L[0]}${L[2]}${L[1]} = 90° (sudut dalam semibulatan)`, `∠${L[0]}${L[1]}${L[2]} = 180° − 90° − ${x}° = ${90 - x}°`, `∠${L[0]}${L[3]}${L[2]} = ∠${L[0]}${L[1]}${L[2]} = ${90 - x}° (dicangkum lengkok ${L[0]}${L[2]} yang sama)`] }, { fig: sbF.gab(L, x, `${x}°`, '?', dd) });
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
  return GEN_LQ('bertentangan', { L, v, a, b: o, ans, work: [`∠${v} dan ∠${o} ialah sudut bertentangan dalam sisi empat kitaran.`, `∠${o} = 180° − ${a}° = ${b}°`] }, { fig: sbF.quad(L, al, be, r.i(95, 140), angs) });
};
SB.peluaran = r => {
  const L = r.p(SBL4), x = r.i(65, 120), be = r.i(70, 110), ans = `${x}°`;
  const fig = sbF.quad(L, x, be, r.i(100, 135), [[L[0], L[1], L[3], `${x}°`, 'am'], [L[2], L[3], 'E', '?', 'tr']], { ext: [[L[1], L[2], 60, 'E']] });
  return GEN_LQ('peluaran', { L, x, ans, work: [`∠${L[1]}${L[2]}${L[3]} = 180° − ${x}° = ${180 - x}° (sudut bertentangan)`, `∠${L[3]}${L[2]}E = 180° − ${180 - x}° = ${x}° (sudut pada garis lurus)`, 'Iaitu sudut peluaran = sudut pedalaman bertentangan.'] }, { fig });
};
SB.kenalKitaran = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  let a; do {
    const p = r.i(60, 125), q = r.i(60, 125);
    if (yes) a = [p, q, 180 - p, 180 - q];
    else { const k = r.p([5, 10, 15, 20]); a = [p, q, 180 - p + k, 180 - q - k]; }
  } while (a.some(v => v < 40 || v > 150) || new Set(a).size < 3);
  const ans = yes ? `Ya, kerana ∠P + ∠R = 180° dan ∠Q + ∠S = 180°` : `Bukan, kerana ∠P + ∠R = ${a[0] + a[2]}° ≠ 180°`;
  return GEN_LQ('kenalKitaran', { a, ans, work: [`∠P + ∠R = ${a[0]}° + ${a[2]}° = ${a[0] + a[2]}°`, `∠Q + ∠S = ${a[1]}° + ${a[3]}° = ${a[1] + a[3]}°`, yes ? 'Kedua-dua pasangan sudut bertentangan berjumlah 180°, maka PQRS ialah sisi empat kitaran.' : 'Sudut bertentangan tidak berjumlah 180°, maka PQRS bukan sisi empat kitaran.'] });
};
SB.algebra62 = r => {
  let x, p, q, c1, c2, v1; do { x = r.i(10, 40); p = r.i(1, 4); q = r.i(1, 4); v1 = r.i(60, 125); c1 = v1 - p * x; c2 = 180 - v1 - q * x; } while (p === q || c1 === 0 || c2 === 0 || Math.abs(c1) > 90 || Math.abs(c2) > 90);
  const ex = (k, c) => `${k === 1 ? '' : k}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, e1 = `(${ex(p, c1)})`, e2 = `(${ex(q, c2)})`;
  const L = r.p(SBL4);
  const sc = c1 + c2, sp = p + q;
  return GEN_LQ('algebra62', { L, e1, e2, x, v1, ans: `x = ${x}`, work: [`∠${L[0]} + ∠${L[2]} = 180° (sudut bertentangan)`, `${ex(p, c1)} + ${ex(q, c2)} = 180`, `${sp}x${sc === 0 ? '' : ` ${sc < 0 ? '−' : '+'} ${Math.abs(sc)}`} = 180`].concat(sc === 0 ? [`x = 180 ÷ ${sp} = ${x}`] : [`${sp}x = ${180 - sc}, maka x = ${x}`]) });
};
SB.pusat62 = r => {
  const L = r.p(SBL4), y = sbE(r, 80, 170), ans = `${180 - y / 2}°`;
  return GEN_LQ('pusat62', { L, y, ans, work: [`∠${L[1]}${L[0]}${L[3]} = ½ × ${y}° = ${y / 2}° (sudut pusat = 2 × sudut pada lilitan)`, `∠${L[1]}${L[2]}${L[3]} = 180° − ${y / 2}° = ${180 - y / 2}° (sudut bertentangan)`] }, { fig: sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[1], L[3], '?', 'tr']]) });
};
SB.duaSudut = r => {
  const L = r.p(SBL4), p = r.i(65, 120), q = r.i(65, 120);
  const fig = sbF.quad(L, p, q, r.i(100, 135), [[L[0], L[1], L[3], `${p}°`, 'am'], [L[1], L[2], L[0], `${q}°`, 'pk'], [L[2], L[3], L[1], 'x', 'tr'], [L[3], L[0], L[2], 'y', 'gr']]);
  return GEN_LQ('duaSudut', { L, p, q, ans: `x = ${180 - p}, y = ${180 - q}`, work: [`x = 180 − ${p} = ${180 - p} (bertentangan dengan ∠${L[0]})`, `y = 180 − ${q} = ${180 - q} (bertentangan dengan ∠${L[1]})`] }, { fig });
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
  return GEN_LQ('tjSudut', { x, ans, work: ['∠OAP = 90° (tangen ⊥ jejari)', `∠APO = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbTanFig(x, { ang: [['O', 'A', 'P', `${x}°`, 'pa', false, 16, 32], ['P', 'A', 'O', '?', 'gr', false, 30, 46]], label: 'Tangen PA dan jejari OA' }) });
};
SB.tjPanjang = (r, k) => {
  const [a, b, c] = r.p(SBTRI.slice(0, 7)), sw = r.f() < .5, rr = sw ? a : b, t = sw ? b : a, findOP = k == null ? r.f() < .35 : k % 3 === 2;
  const phi = Math.acos(rr / c) * 180 / Math.PI;
  if (findOP) return GEN_LQ('tjOP', { r: rr, t, h: c, ans: `${c} cm`, work: ['∠OAP = 90° (tangen ⊥ jejari)', `OP² = ${rr}² + ${t}² = ${c * c}`, `OP = √${c * c} = ${c} cm`] }, { fig: sbTanFig(phi, { label: 'Tangen PA dan jejari OA' }) });
  return GEN_LQ('tjPanjang', { r: rr, t, h: c, ans: `${t} cm`, work: ['∠OAP = 90° (tangen ⊥ jejari)', `PA² = ${c}² − ${rr}² = ${c * c - rr * rr}`, `PA = √${t * t} = ${t} cm`] }, { fig: sbTanFig(phi, { label: 'Tangen PA dan jejari OA' }) });
};
SB.duaTangen = r => {
  const a = r.i(5, 20), x = r.i(20, 60);
  const d = GEN_LQ('duaTangen', { a, x, ans: '' }, {});
  let ans, work, fig;
  if (d.q.includes('PA =')) { ans = `${a} cm`; work = ['Dua tangen dari titik luar yang sama adalah sama panjang.', `PB = PA = ${a} cm`]; fig = sbTanFig(60, { two: true, op: false, label: 'Dua tangen PA dan PB' }); }
  else if (d.q.includes('∠APO')) { ans = `${2 * x}°`; work = [`∠BPO = ∠APO = ${x}° (OP membahagi dua sama ∠APB)`, `∠APB = 2 × ${x}° = ${2 * x}°`]; fig = sbTanFig(90 - x, { two: true, ang: [['P', 'A', 'O', `${x}°`, 'am', false, 26, 40]], label: 'Dua tangen PA dan PB' }); }
  else if (d.q.includes('∠OPB')) { ans = `${x}°`; work = ['OP membahagi dua sama ∠APB.', `∠OPB = ${2 * x}° ÷ 2 = ${x}°`]; fig = sbTanFig(90 - x, { two: true, ang: [['P', 'A', 'B', `${2 * x}°`, 'am', false, 18, 30]], label: 'Dua tangen PA dan PB' }); }
  else { const y = r.i(45, 75); ans = `${2 * y}°`; work = [`∠BOP = ∠AOP = ${y}° (∆OAP dan ∆OBP kongruen)`, `∠AOB = 2 × ${y}° = ${2 * y}°`]; d.q = d.q.replace(`${x}°`, `${y}°`); fig = sbTanFig(y, { two: true, ang: [['O', 'A', 'P', `${y}°`, 'pa']], label: 'Dua tangen PA dan PB' }); }
  return Object.assign(d, { ans, work, fig });
};
SB.temberengSS = r => {
  const x = r.i(30, 80), ans = `${x}°`;
  return GEN_LQ('temberengSS', { x, ans, work: ['∠TAB ialah sudut di antara tangen AT dan perentas AB.', `∠ACB = ∠TAB = ${x}° (sudut dalam tembereng selang-seli)`] }, { fig: sbF.ss(x, `${x}°`, '?') });
};
SB.sepunya = (r, k) => {
  const [pos, n] = k == null ? r.p(SBSEP) : SBSEP[k % SBSEP.length];
  return GEN_LQ('sepunya', { pos, ans: String(n), work: [`Dua bulatan yang ${pos} mempunyai ${n} tangen sepunya.`] }, { fig: sbSepFig(n) });
};
SB.tjKite = r => {
  const x = r.i(30, 100), ans = `${180 - x}°`;
  return GEN_LQ('tjKite', { x, ans, work: ['∠OAP = ∠OBP = 90° (tangen ⊥ jejari)', `∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['O', 'A', 'B', '?', 'pk']], label: 'Sisi empat OAPB' }) });
};
SB.ssTiga = r => {
  let x, y; do { x = r.i(35, 75); y = r.i(35, 75); } while (x + y > 140);
  return GEN_LQ('ssTiga', { x, y, ans: `${180 - x - y}°`, work: [`∠ACB = ∠TAB = ${x}° (tembereng selang-seli)`, `∠BAC = 180° − ${x}° − ${y}° = ${180 - x - y}°`] }, { fig: sbF.ss3(x, y) });
};
SB.tjDua = r => {
  const [a, b, c] = r.p(SBTRI), sw = r.f() < .5, rr = sw ? a : b, t = sw ? b : a, phi = Math.acos(rr / c) * 180 / Math.PI;
  const d = GEN_LQ('tjDua', { r: rr, h: c, ans: '' }, { fig: sbTanFig(phi, { two: true, label: 'Dua tangen PA dan PB' }) });
  const base = ['∠OAP = 90° (tangen ⊥ jejari)', `PA = √(${c}² − ${rr}²) = √${t * t} = ${t} cm`, `PB = PA = ${t} cm`];
  if (d.q.includes('perimeter')) return Object.assign(d, { ans: `${2 * (rr + t)} cm`, work: base.concat([`Perimeter = ${rr} + ${t} + ${t} + ${rr} = ${2 * (rr + t)} cm`]) });
  if (d.q.includes('luas')) return Object.assign(d, { ans: `${rr * t} cm²`, work: base.slice(0, 2).concat([`Luas OAPB = 2 × ½ × ${rr} × ${t} = ${rr * t} cm²`]) });
  return Object.assign(d, { ans: `${2 * t} cm`, work: base.concat([`PA + PB = ${2 * t} cm`]) });
};
SB.k63 = r => GEN_LQ('k63', { t: r.p(SBTRI.slice(0, 7)), x: sbE(r, 30, 80) });
/* ---------- 6.4 ---------- */
SB.gTanDia = r => {
  const x = r.i(25, 70);
  return GEN_LQ('gTanDia', { x, ans: `${90 - x}°`, work: ['∠QAB = 90° (tangen ⊥ jejari/diameter)', `∠BAC = 90° − ${x}° = ${90 - x}°`, `Semak: ∠ABC = ${x}° (tembereng selang-seli) dan ∠ACB = 90°, maka ∠BAC = 180° − 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.tanDia(x, `${x}°`, '?') });
};
SB.gTanJej = r => {
  const x = r.i(20, 65);
  return GEN_LQ('gTanJej', { x, ans: `${90 - x}°`, work: [`OA = OB (jejari), maka ∠OAB = ∠OBA = ${x}°`, '∠OAT = 90° (tangen ⊥ jejari)', `∠TAB = 90° − ${x}° = ${90 - x}°`] }, { fig: sbF.tanJej(x) });
};
SB.gTanIsos = r => {
  const x = sbE(r, 30, 100);
  return GEN_LQ('gTanIsos', { x, ans: `${(180 - x) / 2}°`, work: ['PA = PB (tangen dari titik luar), maka ∆PAB sama kaki.', `∠PAB = ∠PBA = (180° − ${x}°) ÷ 2 = ${(180 - x) / 2}°`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['A', 'P', 'B', '?', 'pk']], label: 'Dua tangen dan perentas AB' }) });
};
SB.gPusatKit = r => {
  const L = r.p(SBL4), y = sbE(r, 80, 170);
  return GEN_LQ('gPusatKit', { L, y, ans: `${y / 2}°`, work: [`∠${L[1]}${L[0]}${L[3]} = ½ × ${y}° = ${y / 2}° (sudut pusat = 2 × sudut pada lilitan)`, `∠${L[1]}${L[2]}${L[3]} = 180° − ${y / 2}° = ${180 - y / 2}° (sudut bertentangan)`, `∠${L[3]}${L[2]}E = 180° − ${180 - y / 2}° = ${y / 2}° (sudut pada garis lurus)`] }, { fig: sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[3], 'E', '?', 'tr']], true) });
};
SB.gTanSS = r => {
  const x = sbE(r, 30, 100), h = (180 - x) / 2;
  return GEN_LQ('gTanSS', { x, ans: `${h}°`, work: ['PA = PB, maka ∆PAB sama kaki.', `∠PAB = (180° − ${x}°) ÷ 2 = ${h}°`, `∠ACB = ∠PAB = ${h}° (tembereng selang-seli)`] }, { fig: sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, C: 180, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['C', 'A', 'B', '?', 'tr']], label: 'Dua tangen dan sudut ACB' }) });
};
SB.gKitTan = r => {
  let x, y; do { x = r.i(25, 60); y = r.i(20, 50); } while (x + y > 110);
  return GEN_LQ('gKitTan', { x, y, ans: `${180 - x - y}°`, work: [`∠ADB = ∠TAB = ${x}° (tembereng selang-seli)`, `∠ADC = ${x}° + ${y}° = ${x + y}°`, `∠ABC = 180° − ${x + y}° = ${180 - x - y}° (sudut bertentangan sisi empat kitaran)`] }, { fig: sbF.kitTan(x, y) });
};
SB.gHarian = r => {
  const [a, b, c] = r.p(SBTRI), k = r.p([1, 2, 3, 5]), u = r.p(['cm', 'm']), rr = a * k, t = b * k, h = c * k, phi = Math.acos(a / c) * 180 / Math.PI;
  const d = GEN_LQ('gHarian', { r: rr, h, u, ans: '' }, {});
  const base = ['∠OAP = 90° (tangen ⊥ jejari)', `PA = √(${h}² − ${rr}²) = √${t * t} = ${t} ${u}`];
  if (d.q.includes('jumlah')) return Object.assign(d, { ans: `${2 * t} ${u}`, work: base.concat([`PB = PA, maka jumlah = 2 × ${t} = ${2 * t} ${u}`]), fig: sbTanFig(phi, { two: true, label: 'Roda dan dua tali tangen' }) });
  return Object.assign(d, { ans: `${t} ${u}`, work: base, fig: sbTanFig(phi, { label: 'Tangen PA kepada bulatan' }) });
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
    m: [() => SB.tjSudut(SBG), () => SB.tjPanjang(SBG), () => SB.duaTangen(SBG), () => SB.temberengSS(SBG), () => SB.sepunya(SBG), () => SB.bs(SBG, SBBS3)],
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
  '6.3': [['m', 'tjSudut', 4], ['m', 'tjPanjang', 4], ['m', 'duaTangen', 4], ['m', 'temberengSS', 3], ['m', 'sepunya', 2], ['m', 'bs3', 1], ['s', 'tjKite', 3], ['s', 'ssTiga', 3], ['s', 'tjDua', 3], ['k', 'k63', 3]],
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
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(20, 75); return sbMcq(`O ialah pusat. ∠${L[0]}${L[2]}${L[1]} = ${x}°. Cari ∠${L[0]}O${L[1]}.`, sbF.pusat(L, x, `${x}°`, '?'), sbOpts(2 * x, [x, x / 2, 180 - x, 90 + x, 180 - 2 * x])); } const y = 2 * ri(20, 80); return sbMcq(`O ialah pusat. ∠${L[0]}O${L[1]} = ${y}°. Cari ∠${L[0]}${L[2]}${L[1]}.`, sbF.pusat(L, y / 2, '?', `${y}°`), sbOpts(y / 2, [y, 2 * y, 180 - y, 180 - y / 2, 90 - y / 2])); },
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(20, 70); return sbMcq(`${L[0]}${L[1]} ialah diameter. ∠${L[2]}${L[0]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[1]}${L[2]}.`, sbF.semi(L, x, `${x}°`, '?'), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x, 90])); } const L4 = pick(SBL4), x = ri(25, 75); return sbMcq(`∠${L4[0]}${L4[3]}${L4[1]} = ${x}°. Cari ∠${L4[0]}${L4[2]}${L4[1]}.`, sbF.sama(L4, x, '?', `${x}°`, ri(50, 75), ri(105, 135)), sbOpts(x, [2 * x, 180 - x, 90 - x, x / 2])); },
    () => { const L = pick(SBL3); if (Math.random() < .5) { const x = ri(15, 70); return sbMcq(`O ialah pusat. ∠O${L[0]}${L[1]} = ${x}°. Cari ∠${L[0]}${L[2]}${L[1]}.`, sbF.samaKaki(L, x, `${x}°`, '?'), sbOpts(90 - x, [180 - 2 * x, x, 2 * x, 90 + x])); } const y = 2 * ri(35, 80); return sbMcq(`O ialah pusat. ∠${L[0]}O${L[1]} = ${y}°. Cari ∠${L[0]}${L[2]}${L[1]}.`, sbF.refleks(L, y, `${y}°`, '?'), sbOpts(180 - y / 2, [y / 2, 360 - y, y, 180 - y])); }
  ],
  kitaran: [
    () => { const L = pick(SBL4), al = ri(62, 125), be = ri(62, 125); return sbMcq(`${L.join('')} ialah sisi empat kitaran. ∠${L[0]} = ${al}°. Cari ∠${L[2]}.`, sbF.quad(L, al, be, ri(95, 140), [[L[0], L[3], L[1], `${al}°`, 'am'], [L[2], L[1], L[3], '?', 'tr']]), sbOpts(180 - al, [al, 360 - al, 90 - al / 2, 180 - be, be])); },
    () => { const L = pick(SBL4), x = ri(65, 120), be = ri(70, 110); return sbMcq(`${L[1]}${L[2]} dipanjangkan ke E. ∠${L[3]}${L[0]}${L[1]} = ${x}°. Cari ∠${L[3]}${L[2]}E.`, sbF.quad(L, x, be, ri(100, 135), [[L[0], L[1], L[3], `${x}°`, 'am'], [L[2], L[3], 'E', '?', 'tr']], { ext: [[L[1], L[2], 60, 'E']] }), sbOpts(x, [180 - x, be, 180 - be, 90])); },
    () => { const L = pick(SBL4), y = 2 * ri(40, 85); return sbMcq(`O ialah pusat. ∠${L[1]}O${L[3]} = ${y}°. Cari ∠${L[1]}${L[2]}${L[3]}.`, sbF.pusatKit(L, y, [['O', L[1], L[3], `${y}°`, 'pa'], [L[2], L[1], L[3], '?', 'tr']]), sbOpts(180 - y / 2, [y / 2, 180 - y, 360 - y, y])); }
  ],
  tangen: [
    () => { const x = ri(42, 70); return sbMcq(`PA ialah tangen di A. ∠AOP = ${x}°. Cari ∠APO.`, sbTanFig(x, { ang: [['O', 'A', 'P', `${x}°`, 'pa', false, 16, 32], ['P', 'A', 'O', '?', 'gr', false, 30, 46]], label: 'Tangen PA' }), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x])); },
    () => { if (Math.random() < .5) { const x = ri(30, 80); return sbMcq(`SAT ialah tangen di A. ∠TAB = ${x}°. Cari ∠ACB.`, sbF.ss(x, `${x}°`, '?'), sbOpts(x, [90 - x, 180 - x, 2 * x, 90 + x])); } const [a, b, c] = pick(SBTRI.slice(0, 7)); return sbMcq(`PA ialah tangen di A. OA = ${a} cm, OP = ${c} cm. Cari PA.`, sbTanFig(Math.acos(a / c) * 180 / Math.PI, { label: 'Tangen PA' }), sbOpts(b, [c - a, c + a, a, b + 1, c], v => `${v} cm`)); },
    () => { if (Math.random() < .5) { const x = ri(30, 100); return sbMcq(`PA dan PB ialah tangen. ∠APB = ${x}°. Cari ∠AOB.`, sbTanFig(90 - x / 2, { two: true, op: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['O', 'A', 'B', '?', 'pk']], label: 'Sisi empat OAPB' }), sbOpts(180 - x, [x, 2 * x, 360 - x, 90 - x / 2])); } const [pos, n] = pick(SBSEP); return sbMcq(`Berapakah bilangan tangen sepunya bagi dua bulatan yang ${pos}?`, sbSepFig(n), sbOptsT(String(n), ['0', '1', '2', '3', '4'])); }
  ],
  gabung: [
    () => { const x = ri(25, 70); return sbMcq(`PAQ tangen di A, AB diameter. ∠QAC = ${x}°. Cari ∠BAC.`, sbF.tanDia(x, `${x}°`, '?'), sbOpts(90 - x, [x, 180 - x, 90 + x, 2 * x])); },
    () => { if (Math.random() < .5) { const x = 2 * ri(15, 50); return sbMcq(`PA dan PB ialah tangen. ∠APB = ${x}°. Cari ∠PAB.`, sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['A', 'P', 'B', '?', 'pk']], label: 'Dua tangen' }), sbOpts((180 - x) / 2, [180 - x, x, x / 2, 90 + x / 2])); } const x = ri(20, 65); return sbMcq(`O ialah pusat, SAT tangen di A. ∠OBA = ${x}°. Cari ∠TAB.`, sbF.tanJej(x), sbOpts(90 - x, [x, 180 - 2 * x, 2 * x, 90 + x])); },
    () => { if (Math.random() < .5) { const x = 2 * ri(15, 50), h = (180 - x) / 2; return sbMcq(`PA dan PB ialah tangen. ∠APB = ${x}°. Cari ∠ACB.`, sbTanFig(90 - x / 2, { two: true, op: false, chord: true, O: false, C: 180, ang: [['P', 'A', 'B', `${x}°`, 'am', false, 18, 30], ['C', 'A', 'B', '?', 'tr']], label: 'Dua tangen' }), sbOpts(h, [180 - x, x, x / 2, 180 - h])); } let x, y; do { x = ri(25, 60); y = ri(20, 50); } while (x + y > 110); return sbMcq(`SAT tangen di A, ABCD kitaran. ∠TAB = ${x}°, ∠BDC = ${y}°. Cari ∠ABC.`, sbF.kitTan(x, y), sbOpts(180 - x - y, [x + y, 180 - x, 180 - y, 90 - x])); }
  ]
};
const CQT = { lilitan: 'Sudut lilitan & pusat', kitaran: 'Sisi empat kitaran', tangen: 'Tangen', gabung: 'Gabungan sudut & tangen' };
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
