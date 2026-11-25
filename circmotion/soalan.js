'use strict';
/* =================== CIRCMOTION · SOALAN BAB 5 BULATAN (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "bl" / "BL" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & π =================== */
const bn = x => String(Math.round(x * 1e4) / 1e4);                       // nombor tepat (≤ 4 t.p.)
const b2 = x => (Math.round(x * 100 + 1e-7) / 100).toFixed(2);            // bundar 2 tempat perpuluhan
const blDp2 = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;        // ≤ 2 tempat perpuluhan?
const blPiV = pi => (pi === 7 ? 22 / 7 : 3.142);
const blPiS = pi => (pi === 7 ? fr(22, 7) : '3.142');
const blPiQ = pi => (pi === 7 ? ('Guna π = ' + fr(22, 7) + '.') : 'Guna π = 3.142 dan beri jawapan betul kepada dua tempat perpuluhan.');
const blAns = (pi, x, u) => `${pi === 7 ? bn(x) : b2(x)} ${u}`;
const blRes = (pi, x, u) => {
  if (pi === 7) return `= ${bn(x)} ${u}`;
  const r = b2(x), raw = bn(x);
  return Math.abs(+raw - +r) < 1e-9 ? `= ${r} ${u}` : `= ${raw} ≈ ${r} ${u} (2 tempat perpuluhan)`;
};
// rawak: RG untuk Latihan Kelas / games, RW (berbenih) untuk Lembaran Kerja
const RG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const RW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const blShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const blDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);

/* =================== rajah bulatan (SVG, warna tema) =================== */
const BLR = 100;
const blP = (a, r = BLR) => [+(r * Math.cos(a * Math.PI / 180)).toFixed(2), +(-r * Math.sin(a * Math.PI / 180)).toFixed(2)];
const blAdd = (p, q) => [+(p[0] + q[0]).toFixed(2), +(p[1] + q[1]).toFixed(2)];
const blRot = (p, d) => { const c = Math.cos(d * Math.PI / 180), s = Math.sin(d * Math.PI / 180); return [+(p[0] * c - p[1] * s).toFixed(2), +(p[0] * s + p[1] * c).toFixed(2)]; };
const blXY = p => `${p[0]} ${p[1]}`;
const blSvg = (inner, label, vb = '-150 -140 300 280') => `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${inner}</svg>`;
const blCirc = (c = 'mu', w = 3, r = BLR) => `<circle cx="0" cy="0" r="${r}" style="fill:none;stroke:var(--${c})" stroke-width="${w}"/>`;
const blTxt = (p, t, c = 'tx', sz = 18) => `<text x="${p[0]}" y="${p[1]}" style="fill:var(--${c})" font-size="${sz}" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="middle" dominant-baseline="central">${t}</text>`;
const blDot = (p, c = 'tx', r = 4.5) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" style="fill:var(--${c})"/>`;
const blLn = (p, q, c = 'tx', w = 3, dash) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const blArcA = (a1, a2, r = BLR) => { const e = blP(a2, r), sp = ((a2 - a1) % 360 + 360) % 360; return `A${r} ${r} 0 ${sp > 180 ? 1 : 0} 0 ${blXY(e)}`; };
const blFill = (c, op = .28, w = 3) => `style="fill:var(--${c});fill-opacity:${op};stroke:var(--${c})" stroke-width="${w}" stroke-linejoin="round"`;
const blO = (p = [-14, -14]) => blDot([0, 0]) + blTxt(p, 'O', 'tx', 18);

/* ---------- 5.1 bahagian bulatan ---------- */
const BLBAH = {
  pusat: ['Pusat', 'Jejari', ['Titik tetap di tengah bulatan ialah <b>pusat</b>.', 'Semua titik pada lilitan sama jarak dari pusat.']],
  jejari: ['Jejari', 'Diameter', ['Garis lurus dari pusat ke satu titik pada lilitan ialah <b>jejari</b>.']],
  diameter: ['Diameter', 'Jejari', ['Perentas yang melalui pusat bulatan ialah <b>diameter</b>.', 'Diameter = 2 × jejari.']],
  perentas: ['Perentas', 'Diameter', ['Garis lurus yang menyambungkan dua titik pada lilitan ialah <b>perentas</b>.', 'Perentas ini tidak melalui pusat, jadi bukan diameter.']],
  lkMin: ['Lengkok minor', 'Lengkok major', ['Sebahagian daripada lilitan ialah <b>lengkok</b>.', 'Lengkok ini lebih pendek daripada separuh lilitan: <b>lengkok minor</b>.']],
  lkMaj: ['Lengkok major', 'Lengkok minor', ['Sebahagian daripada lilitan ialah <b>lengkok</b>.', 'Lengkok ini lebih panjang daripada separuh lilitan: <b>lengkok major</b>.']],
  skMin: ['Sektor minor', 'Tembereng minor', ['Kawasan yang dibatasi oleh dua jejari dan satu lengkok ialah <b>sektor</b>.', 'Sektor ini lebih kecil daripada separuh bulatan: <b>sektor minor</b>.']],
  skMaj: ['Sektor major', 'Sektor minor', ['Kawasan yang dibatasi oleh dua jejari dan satu lengkok ialah <b>sektor</b>.', 'Sektor ini lebih besar daripada separuh bulatan: <b>sektor major</b>.']],
  tbMin: ['Tembereng minor', 'Sektor minor', ['Kawasan yang dibatasi oleh satu perentas dan satu lengkok ialah <b>tembereng</b>.', 'Tembereng ini lebih kecil daripada separuh bulatan: <b>tembereng minor</b>.']],
  tbMaj: ['Tembereng major', 'Tembereng minor', ['Kawasan yang dibatasi oleh satu perentas dan satu lengkok ialah <b>tembereng</b>.', 'Tembereng ini lebih besar daripada separuh bulatan: <b>tembereng major</b>.']],
  lilitan: ['Lilitan', 'Diameter', ['Sempadan (perimeter) sebuah bulatan ialah <b>lilitan</b>.']]
};
const BLBAHK = Object.keys(BLBAH);
function blBahFig(part, lab, rot, r) {
  const lb = p => blTxt(p, lab, 'pa', 26), op = blP(rot + 180, 18);
  let s = blCirc('mu', 3);
  if (part === 'pusat') return blSvg(s + blDot([0, 0], 'pa', 6) + lb(blP(rot, 24)), 'Bulatan dengan satu titik berlabel');
  if (part === 'jejari') { const e = blP(rot); s += blLn([0, 0], e, 'pa', 5) + blDot(e, 'pa') + lb(blAdd(blP(rot, 52), blP(rot + 90, 20))) + blO(op); }
  if (part === 'diameter') { const e = blP(rot), f = blP(rot + 180); s += blLn(f, e, 'pa', 5) + blDot(e, 'pa') + blDot(f, 'pa') + lb(blAdd(blP(rot, 52), blP(rot + 90, 20))) + blO(blP(rot - 90, 18)); }
  if (part === 'perentas') { const sp = r.i(100, 130), e = blP(rot - sp / 2), f = blP(rot + sp / 2); s += blLn(e, f, 'pa', 5) + blDot(e, 'pa') + blDot(f, 'pa') + lb(blP(rot, 100 * Math.cos(sp / 2 * Math.PI / 180) - 20)) + blO(op); }
  if (part === 'lkMin' || part === 'lkMaj') {
    const sp = part === 'lkMin' ? r.i(90, 140) : r.i(220, 260), a1 = rot - sp / 2, a2 = rot + sp / 2;
    s += `<path d="M${blXY(blP(a1))} ${blArcA(a1, a2)}" style="fill:none;stroke:var(--pa)" stroke-width="8" stroke-linecap="round"/>` + blDot(blP(a1), 'tx') + blDot(blP(a2), 'tx') + lb(blP(rot, 124)) + blO(op);
  }
  if (part === 'skMin' || part === 'skMaj') {
    const sp = part === 'skMin' ? r.i(70, 120) : r.i(230, 290), a1 = rot - sp / 2, a2 = rot + sp / 2;
    s += `<path d="M0 0 L${blXY(blP(a1))} ${blArcA(a1, a2)} Z" ${blFill('pa')}/>` + lb(blP(rot, 58)) + blO(op);
  }
  if (part === 'tbMin' || part === 'tbMaj') {
    const sp = part === 'tbMin' ? r.i(120, 150) : r.i(220, 250), a1 = rot - sp / 2, a2 = rot + sp / 2;
    s += `<path d="M${blXY(blP(a1))} ${blArcA(a1, a2)} Z" ${blFill('pa')}/>` + lb(blP(rot, part === 'tbMin' ? (100 + 100 * Math.cos(sp / 2 * Math.PI / 180)) / 2 : 58)) + blO(op);
  }
  if (part === 'lilitan') s = blCirc('pa', 7) + lb(blP(rot, 124)) + blO(op);
  return blSvg(s, 'Bulatan dengan satu bahagian berlabel');
}
// rajah garis: diameter, perentas dan jejari berlabel huruf
function blGarisFig(rot, L) {
  const [A, B, C, D, E] = L, pA = blP(rot), pB = blP(rot + 180), pC = blP(rot + 40), pD = blP(rot + 140), pE = blP(rot + 250);
  const lab = (a, t) => blTxt(blP(a, 120), t, 'tx', 20);
  let s = blCirc('mu', 3) + blLn(pA, pB, 'tr', 4) + blLn(pC, pD, 'gr', 4) + blLn([0, 0], pE, 'pu', 4);
  s += [pA, pB, pC, pD, pE].map(p => blDot(p)).join('') + lab(rot, A) + lab(rot + 180, B) + lab(rot + 40, C) + lab(rot + 140, D) + lab(rot + 250, E) + blO(blP(rot + 300, 20));
  return blSvg(s, 'Bulatan berpusat O dengan beberapa garis lurus');
}
// sektor: th darjah berpusat pada arah mid
function blSekFig(th, mid, o = {}) {
  const a1 = mid - th / 2, a2 = mid + th / 2, A = blP(a1), B = blP(a2);
  let s = blCirc('mu', 2.5);
  s += `<path d="M0 0 L${blXY(A)} ${blArcA(a1, a2)} Z" ${blFill(o.c || 'tr', .25)}/>`;
  if (o.arc) s += `<path d="M${blXY(A)} ${blArcA(a1, a2)}" style="fill:none;stroke:var(--pa)" stroke-width="7" stroke-linecap="round"/>`;
  s += `<path d="M${blXY(blP(a1, 22))} ${blArcA(a1, a2, 22)}" style="fill:none;stroke:var(--am)" stroke-width="2.5"/>`;
  if (o.th) s += blTxt(blP(mid, th < 70 ? 46 : 40), o.th, 'am', 17);
  if (o.jl) s += blTxt(blAdd(blP(a1, 55), blP(a1 - 90, 15)), o.jl, 'tx', 16);
  if (o.L) s += blDot(A) + blDot(B) + blTxt(blP(a1, 117), o.L[0], 'tx', 19) + blTxt(blP(a2, 117), o.L[1], 'tx', 19);
  s += blO(blP(mid + 180, 19));
  return blSvg(s, o.label || 'Sektor bulatan');
}
// perentas pada jarak t×jejari dari pusat (kaki tegak ke bawah, diputar rot darjah)
function blChordIn(t, L, rot = 0, o = {}) {
  const dp = 100 * t, hp = 100 * Math.sqrt(1 - t * t), R = p => blRot(p, rot);
  const A = R([-hp, dp]), B = R([hp, dp]), M = R([0, dp]);
  let s = '';
  if (o.tri) s += `<polygon points="0,0 ${A} ${M}" style="fill:var(--gr);fill-opacity:.25;stroke:none"/>`;
  s += blLn(A, B, o.c || 'tr', 4) + blLn([0, 0], M, 'pa', 3, o.dash);
  if (o.rad) s += blLn([0, 0], A, 'am', 3);
  s += `<polyline points="${R([0, dp - 11])} ${R([11, dp - 11])} ${R([11, dp])}" style="fill:none;stroke:var(--tx)" stroke-width="2"/>`;
  s += blDot(A) + blDot(B) + blDot(M, 'pa', 3.5);
  s += blTxt(R([-hp - 14, dp + 8]), L[0], 'tx', 19) + blTxt(R([hp + 14, dp + 8]), L[1], 'tx', 19) + blTxt(R(o.mp || [19, dp + 15]), L[2], 'pa', 18);
  if (o.labs) {
    const g = o.labs;
    if (g.om) s += blTxt(R([26, dp / 2]), g.om, 'pa', 15);
    if (g.am) s += blTxt(R([-hp / 2, dp + 19]), g.am, 'gr', 15);
    if (g.oa) s += blTxt(R([-hp / 2 - dp * .2, dp / 2 - hp * .2]), g.oa, 'am', 15);
  }
  return s;
}
const blChordFig = (t, L, o = {}) => blSvg(blCirc('mu', 3) + blChordIn(t, L, 0, o) + blO([16, -14]), 'Bulatan berpusat O dengan satu perentas');

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 5.1 Sifat Bulatan ---------- */
  namaBah: [
    ({ lab }) => ({ q: `Namakan bahagian bulatan yang berlabel ${lab} dalam rajah di bawah.` }),
    ({ lab }) => ({ q: `Rajah di bawah menunjukkan sebuah bulatan. Apakah nama bahagian ${lab} yang ditandakan?` }),
    ({ lab }) => ({ q: `Kenal pasti bahagian ${lab} pada bulatan di bawah.` }),
    ({ lab, ans, claim }) => { const N = vnama(); return Object.assign({ q: `${N} berkata bahagian ${lab} dalam rajah di bawah ialah ${claim.toLowerCase()}. Adakah ${N} betul? Jika tidak, nyatakan nama yang betul.` }, salah(N, ans, `Bahagian ${lab} ialah ${ans.toLowerCase()}, bukan ${claim.toLowerCase()}.`)); },
    ({ lab }) => ({ q: `Lengkapkan: Bahagian ${lab} dalam rajah di bawah ialah ______.` })
  ],
  istilah: [
    ({ def }) => ({ q: `Apakah istilah bagi ${def}?` }),
    ({ def }) => ({ q: `${vcap(def)} dipanggil apa?` }),
    ({ def }) => ({ q: `Lengkapkan: ${vcap(def)} dipanggil ______.` }),
    ({ def }) => ({ q: `Namakan bahagian bulatan yang ditakrifkan sebagai ${def}.` })
  ],
  j2d: [
    ({ j }) => ({ q: `Jejari sebuah bulatan ialah ${bn(j)} cm. Cari diameter bulatan itu.` }),
    ({ j }) => ({ q: `Cari diameter bagi bulatan yang berjejari ${bn(j)} cm.` }),
    ({ j }) => ({ q: `Sebuah jam dinding berbentuk bulatan mempunyai jejari ${bn(j)} cm. Berapakah diameter jam itu?` }),
    ({ j, dd }) => { const N = vnama(); return Object.assign({ q: `Jejari sebuah bulatan ialah ${bn(j)} cm. ${N} berkata diameternya ialah ${bn(j / 2)} cm. Adakah ${N} betul?` }, salah(N, `${bn(dd)} cm`, `${N} membahagi dua jejari; sepatutnya diameter = 2 × jejari.`)); },
    ({ j }) => ({ q: `Lengkapkan: Jika jejari sebuah bulatan = ${bn(j)} cm, maka diameternya = ___ cm.` })
  ],
  d2j: [
    ({ dd }) => ({ q: `Diameter sebuah bulatan ialah ${bn(dd)} cm. Cari jejari bulatan itu.` }),
    ({ dd }) => ({ q: `Cari jejari bagi bulatan yang berdiameter ${bn(dd)} cm.` }),
    ({ dd }) => ({ q: `Sebiji pinggan berbentuk bulatan mempunyai diameter ${bn(dd)} cm. Berapakah jejari pinggan itu?` }),
    ({ dd, j }) => { const N = vnama(); return Object.assign({ q: `Diameter sebuah bulatan ialah ${bn(dd)} cm. ${N} berkata jejarinya ialah ${bn(dd * 2)} cm. Adakah ${N} betul?` }, salah(N, `${bn(j)} cm`, `${N} mendarab dua diameter; sepatutnya jejari = diameter ÷ 2.`)); },
    ({ dd }) => ({ q: `Lengkapkan: Jika diameter sebuah bulatan = ${bn(dd)} cm, maka jejarinya = ___ cm.` })
  ],
  sifatBS: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  garis: [
    ({ what }) => ({ q: `Rajah di bawah menunjukkan sebuah bulatan berpusat O. Namakan ${what} dalam rajah itu.` }),
    ({ what }) => ({ q: `Berdasarkan rajah di bawah, garis lurus manakah yang merupakan ${what}?` }),
    ({ what, list }) => ({ q: `Antara garis ${list} dalam rajah di bawah, yang manakah ${what}?` }),
    ({ what, claim, ans, why }) => { const N = vnama(); return Object.assign({ q: `O ialah pusat bulatan di bawah. ${N} berkata garis ${claim} ialah ${what}. Adakah ${N} betul?` }, salah(N, ans, why)); }
  ],
  sudutMaj: [
    ({ th, A, B }) => ({ q: `Sudut di pusat bagi sektor minor ${A}O${B} ialah ${th}°. Cari sudut di pusat bagi sektor major ${A}O${B}.` }),
    ({ th, A, B }) => ({ q: `Lengkok minor ${A}${B} mencangkum sudut ${th}° di pusat O. Berapakah sudut yang dicangkum oleh lengkok major ${A}${B} di pusat O?` }),
    ({ th }) => ({ q: `Lengkapkan: Jika sudut di pusat bagi sektor minor ialah ${th}°, maka sudut di pusat bagi sektor major ialah ___°.` }),
    ({ th }) => { const N = vnama(); return Object.assign({ q: `${N} berkata jika sudut di pusat bagi sektor minor ialah ${th}°, maka sudut di pusat bagi sektor major ialah ${180 - th}°. Adakah ${N} betul?` }, salah(N, `${360 - th}°`, `Jumlah sudut di pusat ialah 360°, bukan 180°.`)); },
    ({ th }) => ({ q: `Sudut di pusat bagi sektor major sebuah bulatan ialah ${360 - th}°. Cari sudut di pusat bagi sektor minor.`, ans: `${th}°`, work: ['Sudut sektor minor + sudut sektor major = 360°.', `Sudut sektor minor = 360° − ${360 - th}° = ${th}°.`] })
  ],
  k51: [
    ({ j }) => ({ q: `Perentas yang paling panjang dalam sebuah bulatan ialah ${2 * j} cm. Cari jejari bulatan itu.`, ans: `${j} cm`, work: ['Perentas yang paling panjang ialah diameter.', `Jejari = ${2 * j} ÷ 2 = ${j} cm.`] }),
    ({ j }) => ({ q: `Diameter sebuah bulatan kecil sama dengan jejari sebuah bulatan besar. Diameter bulatan besar ialah ${4 * j} cm. Cari jejari bulatan kecil.`, ans: `${j} cm`, work: [`Jejari bulatan besar = ${4 * j} ÷ 2 = ${2 * j} cm.`, `Maka diameter bulatan kecil = ${2 * j} cm.`, `Jejari bulatan kecil = ${2 * j} ÷ 2 = ${j} cm.`] }),
    ({ j, n }) => ({ q: `${n} keping syiling yang sama saiz disusun sebaris dan bersentuhan antara satu sama lain. Panjang barisan syiling itu ialah ${2 * n * j} mm. Cari jejari setiap syiling.`, ans: `${j} mm`, work: [`Panjang barisan = ${n} × diameter.`, `Diameter = ${2 * n * j} ÷ ${n} = ${2 * j} mm.`, `Jejari = ${2 * j} ÷ 2 = ${j} mm.`] }),
    ({ j }) => ({ q: `Hasil tambah jejari dan diameter sebuah bulatan ialah ${3 * j} cm. Cari diameter bulatan itu.`, ans: `${2 * j} cm`, work: ['Diameter = 2 × jejari, maka jejari + diameter = 3 × jejari.', `Jejari = ${3 * j} ÷ 3 = ${j} cm.`, `Diameter = 2 × ${j} = ${2 * j} cm.`] }),
    ({ j }) => { const N = vnama(); return Object.assign({ q: `Titik A dan B terletak pada lilitan sebuah bulatan berpusat O dengan keadaan AOB ialah satu garis lurus. Diberi OA = ${j} cm. ${N} berkata panjang AB ialah ${j} cm. Adakah ${N} betul?` }, salah(N, `AB = ${2 * j} cm`, `AOB ialah garis lurus yang melalui pusat, jadi AB ialah diameter = 2 × OA = ${2 * j} cm.`)); }
  ],

  /* ---------- 5.2 Sifat Simetri Perentas ---------- */
  sepPer: [
    ({ A, B, M, ab }) => ({ q: `O ialah pusat bulatan dan O${M} berserenjang dengan perentas ${A}${B}. Diberi ${A}${B} = ${ab} cm, cari panjang ${A}${M}.` }),
    ({ A, B, M, ab }) => ({ q: `Dalam rajah di bawah, garis O${M} dari pusat O berserenjang dengan perentas ${A}${B}. Jika panjang ${A}${B} ialah ${ab} cm, berapakah panjang ${M}${B}?` }),
    ({ A, B, M, am, ab }) => ({ q: `O${M} berserenjang dengan perentas ${A}${B} dan ${A}${M} = ${am} cm. Cari panjang perentas ${A}${B}.`, ans: `${ab} cm`, work: ['Garis dari pusat yang berserenjang dengan perentas membahagi dua sama perentas itu.', `${A}${B} = 2 × ${am} = ${ab} cm.`] }),
    ({ A, B, M, am, ab }) => { const N = vnama(); return Object.assign({ q: `O${M} berserenjang dengan perentas ${A}${B} yang panjangnya ${ab} cm. ${N} berkata ${A}${M} = ${ab} cm. Adakah ${N} betul?` }, salah(N, `${A}${M} = ${am} cm`, `${M} ialah titik tengah ${A}${B}, jadi ${A}${M} ialah separuh daripada ${A}${B}.`)); },
    ({ A, B, M, ab }) => ({ q: `Lengkapkan: Oleh sebab O${M} berserenjang dengan ${A}${B}, maka ${A}${M} = ${M}${B}. Jika ${A}${B} = ${ab} cm, maka ${A}${M} = ___ cm.` }),
    ({ A, B, M, ab }) => ({ q: `Sebatang rod lurus ${A}${B} sepanjang ${ab} cm dipasang merentasi sebuah gelung bulat berpusat O. Seutas tali dari O diikat tegak lurus pada rod itu di titik ${M}. Cari jarak ${A}${M}.` })
  ],
  samaJ: [
    ({ ab, d }) => ({ q: `Dalam rajah di bawah, AB = CD = ${ab} cm. Jarak perentas AB dari pusat O ialah ${d} cm. Berapakah jarak perentas CD dari O?` }),
    ({ d }) => ({ q: `Perentas AB dan CD dalam bulatan berpusat O adalah sama panjang. Diberi OM = ${d} cm dengan OM berserenjang dengan AB. Cari panjang ON, iaitu jarak CD dari O.` }),
    ({ ab, d }) => ({ q: `Dalam rajah di bawah, OM = ON = ${d} cm. Diberi AB = ${ab} cm, cari panjang CD.`, ans: `${ab} cm`, work: ['Perentas yang sama jarak dari pusat bulatan adalah sama panjang.', `Maka CD = AB = ${ab} cm.`] }),
    ({ d }) => { const N = vnama(); return { q: `Perentas AB dan CD masing-masing berjarak ${d} cm dari pusat O. ${N} berkata CD lebih panjang daripada AB. Adakah ${N} betul?`, ans: `Tidak betul. CD = AB kerana kedua-duanya sama jarak dari pusat`, work: ['Perentas yang sama jarak dari pusat bulatan adalah sama panjang.'] }; },
    ({ ab, d }) => ({ q: `Lengkapkan: Jika AB = CD = ${ab} cm dan OM = ${d} cm, maka ON = ___ cm.` })
  ],
  pitaPer: [
    ({ j, d, A, B }) => ({ q: `Sebuah bulatan berpusat O mempunyai jejari ${j} cm. Perentas ${A}${B} berada ${d} cm dari O. Cari panjang ${A}${B}.` }),
    ({ j, d, A, B, M }) => ({ q: `Dalam rajah di bawah, O ialah pusat bulatan, O${M} berserenjang dengan ${A}${B}, O${A} = ${j} cm dan O${M} = ${d} cm. Hitung panjang perentas ${A}${B}.` }),
    ({ j, d }) => ({ q: `Sebuah meja bulat mempunyai jejari ${j} cm. Satu garis lurus dilukis dari tepi ke tepi meja sebagai perentas pada jarak ${d} cm dari pusat meja. Berapakah panjang garis itu?` }),
    ({ j, d, h, A, B, M }) => { const N = vnama(); return Object.assign({ q: `Jejari sebuah bulatan ialah ${j} cm dan jarak perentas ${A}${B} dari pusat ialah ${d} cm. ${N} mendapati ${A}${B} = ${h} cm. Adakah ${N} betul?` }, salah(N, `${A}${B} = ${2 * h} cm`, `${N} hanya mengira ${A}${M} = ${h} cm; panjang ${A}${B} = 2 × ${A}${M}.`)); },
    ({ j, d, h, A, B, M }) => ({ q: `Diberi O${A} = ${j} cm dan O${M} = ${d} cm dengan O${M} berserenjang dengan perentas ${A}${B}. Cari panjang ${A}${M}, seterusnya panjang ${A}${B}.`, ans: `${A}${M} = ${h} cm, ${A}${B} = ${2 * h} cm` })
  ],
  pitaJar: [
    ({ j, ab, A, B }) => ({ q: `Perentas ${A}${B} yang panjangnya ${ab} cm terletak dalam sebuah bulatan berpusat O berjejari ${j} cm. Cari jarak perentas itu dari O.` }),
    ({ j, ab, A, B, M }) => ({ q: `Dalam rajah di bawah, O${M} berserenjang dengan perentas ${A}${B}. Diberi ${A}${B} = ${ab} cm dan jejari bulatan = ${j} cm. Hitung panjang O${M}.` }),
    ({ j, ab }) => ({ q: `Sebuah roda berjejari ${j} cm mempunyai sebatang palang lurus sepanjang ${ab} cm yang kedua-dua hujungnya menyentuh bingkai roda. Berapakah jarak palang itu dari pusat roda?` }),
    ({ j, ab, d, h, A, B, M }) => { const N = vnama(); return Object.assign({ q: `Perentas ${A}${B} = ${ab} cm dalam bulatan berjejari ${j} cm. ${N} mengira O${M} dengan ${rt(`${j}² − ${ab}²`)}. Adakah kaedah ${N} betul?` }, salah(N, `O${M} = ${d} cm`, `${N} perlu guna separuh perentas, ${A}${M} = ${h} cm, bukan ${ab} cm.`)); }
  ],
  pitaJej: [
    ({ ab, d, A, B }) => ({ q: `Perentas ${A}${B} sepanjang ${ab} cm berada ${d} cm dari pusat bulatan O. Cari jejari bulatan itu.` }),
    ({ ab, d, A, B, M }) => ({ q: `Dalam rajah di bawah, O${M} berserenjang dengan ${A}${B}, ${A}${B} = ${ab} cm dan O${M} = ${d} cm. Hitung panjang O${A}.` }),
    ({ ab, d, j, h }) => ({ q: `Sebiji pinggan bulat telah pecah. Pada serpihannya, seorang murid mengukur satu perentas sepanjang ${ab} cm. Jarak perentas itu dari pusat pinggan ialah ${d} cm. Berapakah diameter pinggan itu?`, ans: `${2 * j} cm`, work: [`Separuh perentas = ${ab} ÷ 2 = ${h} cm.`, `Jejari = ${rt(`${h}² + ${d}²`)} = ${rt(h * h + d * d)} = ${j} cm.`, `Diameter = 2 × ${j} = ${2 * j} cm.`] }),
    ({ ab, d, j, h }) => { const N = vnama(); return Object.assign({ q: `Perentas sepanjang ${ab} cm berada ${d} cm dari pusat bulatan. ${N} mengira jejari dengan ${rt(`${ab}² + ${d}²`)}. Adakah kaedah ${N} betul?` }, salah(N, `Jejari = ${j} cm`, `${N} perlu guna separuh perentas, iaitu ${h} cm.`)); }
  ],
  duaPer: [
    ({ j, ab, cd, same }) => ({ q: `Perentas AB dan CD adalah selari dalam sebuah bulatan berpusat O yang berjejari ${j} cm. AB = ${ab} cm dan CD = ${cd} cm. Kedua-dua perentas berada pada ${same ? 'sebelah yang sama' : 'sebelah yang bertentangan'} dengan pusat O. Cari jarak di antara dua perentas itu.` }),
    ({ j, ab, cd }) => ({ q: `Dalam rajah di bawah, perentas AB selari dengan perentas CD. Jejari bulatan ialah ${j} cm, AB = ${ab} cm dan CD = ${cd} cm. Hitung jarak MN di antara dua perentas itu.` }),
    ({ j, ab, cd, same }) => ({ q: `Dua batang palang kayu yang selari, sepanjang ${ab} cm dan ${cd} cm, dipasang pada sebuah tingkap bulat berjejari ${j} cm. Kedua-dua palang berada pada ${same ? 'sebelah yang sama' : 'sebelah yang bertentangan'} dengan pusat tingkap. Berapakah jarak di antara dua palang itu?` })
  ],
  diaSer: [
    ({ j, ab }) => ({ q: `Dalam rajah di bawah, diameter CD berserenjang dengan perentas AB di M. Jejari bulatan ialah ${j} cm dan AB = ${ab} cm. Cari panjang MD.` }),
    ({ j, ab, d }) => ({ q: `Diameter CD sebuah bulatan berpusat O berserenjang dengan perentas AB di M. Diberi jejari = ${j} cm dan AB = ${ab} cm. Hitung panjang CM.`, ans: `${j + d} cm`, work: [`AM = ${ab} ÷ 2 = ${ab / 2} cm.`, `OM = ${rt(`${j}² − ${ab / 2}²`)} = ${d} cm.`, `CM = CO + OM = ${j} + ${d} = ${j + d} cm.`] }),
    ({ j, ab, d }) => ({ q: `Sebuah terowong air berbentuk bulatan mempunyai jejari ${j} m. Permukaan air di dalam terowong itu membentuk perentas selebar ${ab} m di bawah pusat. Berapakah kedalaman air yang paling dalam?`, ans: `${j - d} m`, work: [`Separuh lebar permukaan air = ${ab} ÷ 2 = ${ab / 2} m.`, `Jarak permukaan air dari pusat = ${rt(`${j}² − ${ab / 2}²`)} = ${d} m.`, `Kedalaman = ${j} − ${d} = ${j - d} m.`] })
  ],

  /* ---------- 5.3 Lilitan dan Luas ---------- */
  lilitan: [
    ({ gvb, pt }) => ({ q: `Hitung lilitan sebuah bulatan yang ${gvb}. ${pt}` }),
    ({ gv, pt }) => ({ q: `Cari lilitan bulatan yang mempunyai ${gv}. ${pt}` }),
    ({ gv, obj, pt }) => ({ q: `Sebuah ${obj} berbentuk bulatan mempunyai ${gv}. Berapakah lilitan ${obj} itu? ${pt}` }),
    ({ gvb, ans, pt }) => { const N = vnama(); return Object.assign({ q: `${N} mengira lilitan sebuah bulatan yang ${gvb} dengan rumus πj². Adakah kaedah ${N} betul? Jika tidak, cari lilitan yang betul. ${pt}` }, salah(N, ans, 'πj² ialah rumus luas. Rumus lilitan ialah 2πj atau πd.')); },
    ({ gvb, u, pt }) => ({ q: `Lengkapkan: Lilitan bulatan yang ${gvb} = ___ ${u}. ${pt}` }),
    ({ gvb, pt }) => ({ q: `Seutas dawai dibengkokkan dengan tepat menjadi sebuah bulatan yang ${gvb}. Berapakah panjang dawai itu? ${pt}` })
  ],
  luas: [
    ({ gvb, pt }) => ({ q: `Hitung luas sebuah bulatan yang ${gvb}. ${pt}` }),
    ({ gv, pt }) => ({ q: `Cari luas bulatan yang mempunyai ${gv}. ${pt}` }),
    ({ gv, obj, pt }) => ({ q: `Sebuah ${obj} berbentuk bulatan mempunyai ${gv}. Hitung luas permukaan ${obj} itu. ${pt}` }),
    ({ gvb, ans, pt }) => { const N = vnama(); return Object.assign({ q: `${N} mengira luas sebuah bulatan yang ${gvb} dengan rumus 2πj. Adakah kaedah ${N} betul? Jika tidak, cari luas yang betul. ${pt}` }, salah(N, ans, '2πj ialah rumus lilitan. Rumus luas ialah πj².')); },
    ({ gvb, u, pt }) => ({ q: `Lengkapkan: Luas bulatan yang ${gvb} = ___ ${u}². ${pt}` }),
    ({ gv, pt }) => ({ q: `Sekeping plat logam berbentuk bulatan mempunyai ${gv}. Berapakah luas plat logam itu? ${pt}` })
  ],
  cariJL: [
    ({ L, u, pt }) => ({ q: `Lilitan sebuah bulatan ialah ${L} ${u}. Cari jejari bulatan itu. ${pt}` }),
    ({ L, u, pt }) => ({ q: `Sebuah gelung rotan mempunyai lilitan ${L} ${u}. Berapakah jejari gelung itu? ${pt}` }),
    ({ L, u, j, pt }) => ({ q: `Lilitan sebuah bulatan ialah ${L} ${u}. Cari diameter bulatan itu. ${pt}`, ans: `${bn(2 * j)} ${u}`, work: ['Lilitan = πd.', `d = ${L} ÷ ${pt.includes(fr(22, 7)) ? fr(22, 7) : '3.142'}`, `= ${bn(2 * j)} ${u}`] }),
    ({ L, u, j, pt }) => { const N = vnama(); return Object.assign({ q: `Lilitan sebuah bulatan ialah ${L} ${u}. ${N} berkata jejari bulatan itu ialah ${bn(2 * j)} ${u}. Adakah ${N} betul? ${pt}` }, salah(N, `${bn(j)} ${u}`, `${bn(2 * j)} ${u} ialah diameter; jejari = diameter ÷ 2.`)); }
  ],
  cariJA: [
    ({ A, u, pt }) => ({ q: `Luas sebuah bulatan ialah ${A} ${u}². Cari jejari bulatan itu. ${pt}` }),
    ({ A, u, pt }) => ({ q: `Sebuah kolam berbentuk bulatan mempunyai luas permukaan ${A} ${u}². Berapakah jejari kolam itu? ${pt}` }),
    ({ A, u, j, pt }) => ({ q: `Luas sebuah bulatan ialah ${A} ${u}². Cari diameter bulatan itu. ${pt}`, ans: `${bn(2 * j)} ${u}`, work: [`j² = ${A} ÷ ${pt.includes(fr(22, 7)) ? fr(22, 7) : '3.142'} = ${bn(j * j)}`, `j = ${rt(bn(j * j))} = ${bn(j)} ${u}`, `Diameter = 2 × ${bn(j)} = ${bn(2 * j)} ${u}`] }),
    ({ A, u, j, pt }) => { const N = vnama(); return Object.assign({ q: `Luas sebuah bulatan ialah ${A} ${u}². ${N} berkata jejarinya ialah ${bn(j * j)} ${u}. Adakah ${N} betul? ${pt}` }, salah(N, `${bn(j)} ${u}`, `${N} lupa mencari punca kuasa dua: j² = ${bn(j * j)}, maka j = ${bn(j)}.`)); }
  ],
  lengkok: [
    ({ j, th, A, B, pt }) => ({ q: `Rajah di bawah menunjukkan sektor ${A}O${B} dengan jejari ${j} cm dan ∠${A}O${B} = ${th}°. Cari panjang lengkok ${A}${B}. ${pt}` }),
    ({ j, th, pt }) => ({ q: `Hitung panjang lengkok bagi sebuah bulatan berjejari ${j} cm yang mencangkum sudut ${th}° di pusat. ${pt}` }),
    ({ j, th, pt }) => ({ q: `Jarum minit sebuah jam dinding panjangnya ${j} cm. Jarum itu berputar sebanyak ${th}°. Berapakah panjang lengkok yang dilalui oleh hujung jarum itu? ${pt}` }),
    ({ j, th, ans, pt }) => { const N = vnama(); return Object.assign({ q: `${N} mengira panjang lengkok bagi sektor berjejari ${j} cm dan bersudut ${th}° dengan rumus ${fr(`${th}°`, '360°')} × πj². Adakah kaedah ${N} betul? Jika tidak, cari panjang lengkok yang betul. ${pt}` }, salah(N, ans, ('Rumus itu untuk luas sektor. Panjang lengkok = ' + fr('θ', '360°') + ' × 2πj.'))); },
    ({ j, th, pt }) => ({ q: `Lengkapkan: Panjang lengkok = ${fr(`${th}°`, '360°')} × 2 × π × ${j} = ___ cm. ${pt}` })
  ],
  sektor: [
    ({ j, th, A, B, pt }) => ({ q: `Rajah di bawah menunjukkan sektor ${A}O${B} dengan jejari ${j} cm dan ∠${A}O${B} = ${th}°. Cari luas sektor ${A}O${B}. ${pt}` }),
    ({ j, th, pt }) => ({ q: `Hitung luas sektor sebuah bulatan berjejari ${j} cm jika sudut di pusat sektor itu ialah ${th}°. ${pt}` }),
    ({ j, th, pt }) => ({ q: `Sebiji kek berbentuk bulatan berjejari ${j} cm. Sepotong kek berbentuk sektor dengan sudut ${th}° dipotong. Hitung luas permukaan atas potongan kek itu. ${pt}` }),
    ({ j, th, ans, pt }) => { const N = vnama(); return Object.assign({ q: `${N} mengira luas sektor berjejari ${j} cm dan bersudut ${th}° dengan rumus ${fr(`${th}°`, '360°')} × 2πj. Adakah kaedah ${N} betul? Jika tidak, cari luas yang betul. ${pt}` }, salah(N, ans, ('Rumus itu untuk panjang lengkok. Luas sektor = ' + fr('θ', '360°') + ' × πj².'))); },
    ({ j, th, pt }) => ({ q: `Lengkapkan: Luas sektor = ${fr(`${th}°`, '360°')} × π × ${j}² = ___ cm². ${pt}` })
  ],
  sudutL: [
    ({ j, L, A, B, pt }) => ({ q: `Panjang lengkok ${A}${B} bagi sebuah bulatan berpusat O yang berjejari ${j} cm ialah ${L} cm. Cari ∠${A}O${B}. ${pt}` }),
    ({ j, L, pt }) => ({ q: `Sebuah lengkok sepanjang ${L} cm mencangkum sudut θ di pusat sebuah bulatan berjejari ${j} cm. Hitung nilai θ. ${pt}` }),
    ({ j, L, pt }) => ({ q: `Hujung jarum minit sepanjang ${j} cm bergerak sejauh ${L} cm di sepanjang satu lengkok. Berapakah sudut yang dilalui oleh jarum itu? ${pt}` })
  ],
  sudutS: [
    ({ j, S, A, B, pt }) => ({ q: `Luas sektor ${A}O${B} ialah ${S} cm² dan jejarinya ${j} cm. Cari ∠${A}O${B}. ${pt}` }),
    ({ j, S, pt }) => ({ q: `Sebuah sektor bulatan berjejari ${j} cm mempunyai luas ${S} cm². Hitung sudut di pusat sektor itu. ${pt}` }),
    ({ j, S, pt }) => ({ q: `Sekeping pizza berbentuk sektor dipotong daripada sebiji pizza berjejari ${j} cm. Luas kepingan itu ialah ${S} cm². Berapakah sudut di pusat kepingan pizza itu? ${pt}` })
  ],
  jejL: [
    ({ L, th, pt }) => ({ q: `Panjang lengkok minor sebuah bulatan ialah ${L} cm dan sudut di pusatnya ${th}°. Cari jejari bulatan itu. ${pt}` }),
    ({ L, th, pt }) => ({ q: `Sebuah bandul berayun melalui sudut ${th}°. Hujungnya melalui lengkok sepanjang ${L} cm. Berapakah panjang bandul itu? ${pt}` }),
    ({ L, th, j, pt }) => ({ q: `Sektor bersudut ${th}° mempunyai panjang lengkok ${L} cm. Cari diameter bulatan itu. ${pt}`, ans: `${2 * j} cm`, work: [`${fr(`${th}°`, '360°')} × 2 × ${fr(22, 7)} × j = ${L}`, `j = ${j} cm`, `Diameter = 2 × ${j} = ${2 * j} cm`] })
  ],
  roda: [
    ({ D, n, m }) => ({ q: `Diameter sebuah roda basikal ialah ${D} cm. Hitung jarak, dalam m, yang dilalui oleh basikal itu apabila rodanya berputar ${n} kali. Guna π = ${fr(22, 7)}.`, ans: `${bn(m)} m` }),
    ({ D, n, m }) => ({ q: `Sebuah roda pengukur jalan berdiameter ${D} cm berputar ${n} kali di sepanjang sebatang jalan. Berapakah panjang jalan itu, dalam meter? Guna π = ${fr(22, 7)}.`, ans: `${bn(m)} m` }),
    ({ D, n, m, c }) => ({ q: `Roda sebuah kereta sorong mempunyai diameter ${D} cm. Berapakah bilangan putaran lengkap roda itu untuk bergerak sejauh ${bn(m)} m? Guna π = ${fr(22, 7)}.`, ans: `${n} putaran`, work: [`Lilitan roda = πd = ${fr(22, 7)} × ${D} = ${c} cm.`, `${bn(m)} m = ${bn(m * 100)} cm.`, `Bilangan putaran = ${bn(m * 100)} ÷ ${c} = ${n}.`] })
  ],
  trek: [
    ({ Pj, D, per }) => ({ q: `Rajah di bawah menunjukkan sebuah trek larian yang terdiri daripada dua garis lurus sepanjang ${Pj} m dan dua separuh bulatan berdiameter ${D} m. Hitung perimeter trek itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(per)} m` }),
    ({ Pj, D, area }) => ({ q: `Rajah di bawah menunjukkan sebuah padang berbentuk segi empat tepat ${Pj} m × ${D} m dengan separuh bulatan pada kedua-dua hujungnya. Hitung luas padang itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(area)} m²`, work: [`Luas segi empat tepat = ${Pj} × ${D} = ${Pj * D} m².`, `Dua separuh bulatan = satu bulatan: ${fr(22, 7)} × ${D / 2}² = ${bn(area - Pj * D)} m².`, `Luas padang = ${Pj * D} + ${bn(area - Pj * D)} = ${bn(area)} m².`] }),
    ({ Pj, D, per, n }) => ({ q: `Seorang atlet berlari ${n} pusingan mengelilingi trek di bawah. Trek itu terdiri daripada dua garis lurus sepanjang ${Pj} m dan dua separuh bulatan berdiameter ${D} m. Berapakah jumlah jarak larian atlet itu? Guna π = ${fr(22, 7)}.`, ans: `${bn(n * per)} m`, work: [`Satu pusingan = 2 × ${Pj} + ${fr(22, 7)} × ${D} = ${bn(per)} m.`, `Jumlah jarak = ${n} × ${bn(per)} = ${bn(n * per)} m.`] })
  ],
  gelang: [
    ({ R, r }) => ({ q: `Rajah di bawah menunjukkan dua bulatan sepusat berjejari ${R} cm dan ${r} cm. Hitung luas kawasan berlorek di antara dua bulatan itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(22 / 7 * (R * R - r * r))} cm²` }),
    ({ R, r }) => ({ q: `Sebuah kolam bulat berjejari ${r} m dikelilingi oleh laluan pejalan kaki selebar ${R - r} m. Cari luas laluan itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(22 / 7 * (R * R - r * r))} m²`, pre: [`Jejari luar = ${r} + ${R - r} = ${R} m.`] }),
    ({ R, r }) => ({ q: `Sebuah cincin logam berbentuk gelang mempunyai jejari luar ${R} mm dan jejari dalam ${r} mm. Cari luas permukaan cincin itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(22 / 7 * (R * R - r * r))} mm²` })
  ],
  pizza: [
    ({ j, n }) => ({ q: `Sebiji pizza berbentuk bulatan berjejari ${j} cm dipotong kepada ${n} keping sektor yang sama besar. Hitung luas sekeping pizza. Guna π = ${fr(22, 7)}.`, ans: `${bn(22 / 7 * j * j / n)} cm²`, work: [`Sudut setiap keping = 360° ÷ ${n} = ${bn(360 / n)}°.`, `Luas sekeping = ${fr(1, n)} × ${fr(22, 7)} × ${j}²`, `= ${bn(22 / 7 * j * j / n)} cm²`] }),
    ({ j, n }) => ({ q: `Sebiji pizza berjejari ${j} cm dipotong kepada ${n} keping sektor yang sama besar. Cari panjang tepi lengkok bagi sekeping pizza. Guna π = ${fr(22, 7)}.`, ans: `${bn(44 / 7 * j / n)} cm`, work: [`Lilitan pizza = 2 × ${fr(22, 7)} × ${j} = ${bn(44 / 7 * j)} cm.`, `Panjang lengkok sekeping = ${bn(44 / 7 * j)} ÷ ${n} = ${bn(44 / 7 * j / n)} cm.`] }),
    ({ j, n }) => ({ q: `Sebiji pizza berjejari ${j} cm dipotong kepada ${n} keping sektor yang sama besar. Hitung perimeter sekeping pizza. Guna π = ${fr(22, 7)}.`, ans: `${bn(44 / 7 * j / n + 2 * j)} cm`, work: [`Panjang lengkok = 2 × ${fr(22, 7)} × ${j} ÷ ${n} = ${bn(44 / 7 * j / n)} cm.`, `Perimeter = lengkok + 2 jejari = ${bn(44 / 7 * j / n)} + ${2 * j}`, `= ${bn(44 / 7 * j / n + 2 * j)} cm`] })
  ],
  separuh: [
    ({ D }) => ({ q: `Rajah di bawah menunjukkan sebuah separuh bulatan berdiameter ${D} cm. Hitung perimeter rajah itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(11 / 7 * D + D)} cm`, work: [`Panjang lengkok = ${fr(1, 2)} × ${fr(22, 7)} × ${D} = ${bn(11 / 7 * D)} cm.`, `Perimeter = lengkok + diameter = ${bn(11 / 7 * D)} + ${D}`, `= ${bn(11 / 7 * D + D)} cm`] }),
    ({ D }) => ({ q: `Sebuah tingkap berbentuk separuh bulatan mempunyai diameter ${D} cm. Hitung luas tingkap itu. Guna π = ${fr(22, 7)}.`, ans: `${bn(11 / 7 * D * D / 4)} cm²`, work: [`Jejari = ${D} ÷ 2 = ${D / 2} cm.`, `Luas = ${fr(1, 2)} × ${fr(22, 7)} × ${D / 2}²`, `= ${bn(11 / 7 * D * D / 4)} cm²`] }),
    ({ D }) => { const N = vnama(); return Object.assign({ q: `${N} berkata perimeter sebuah separuh bulatan berdiameter ${D} cm ialah ${bn(11 / 7 * D)} cm. Adakah ${N} betul? Guna π = ${fr(22, 7)}.` }, salah(N, `${bn(11 / 7 * D + D)} cm`, `${N} lupa menambah panjang diameter (sisi lurus): ${bn(11 / 7 * D)} + ${D} = ${bn(11 / 7 * D + D)} cm.`)); }
  ]
};

/* =================== data bersama =================== */
const BLIST = [
  ['titik tetap yang sama jarak dari semua titik pada lilitan', 'Pusat'],
  ['garis lurus yang menyambungkan pusat dengan satu titik pada lilitan', 'Jejari'],
  ['perentas yang melalui pusat bulatan', 'Diameter'],
  ['garis lurus yang menyambungkan dua titik pada lilitan', 'Perentas'],
  ['sebahagian daripada lilitan bulatan', 'Lengkok'],
  ['kawasan yang dibatasi oleh dua jejari dan satu lengkok', 'Sektor'],
  ['kawasan yang dibatasi oleh satu perentas dan satu lengkok', 'Tembereng'],
  ['perimeter atau sempadan sebuah bulatan', 'Lilitan'],
  ['perentas yang paling panjang dalam sebuah bulatan', 'Diameter'],
  ['lengkok yang lebih panjang daripada separuh lilitan', 'Lengkok major'],
  ['sektor yang lebih kecil daripada separuh bulatan', 'Sektor minor'],
  ['tembereng yang lebih besar daripada separuh bulatan', 'Tembereng major']
];
const BLBS1 = [
  ['Diameter ialah perentas yang paling panjang dalam sebuah bulatan.', true, 'Diameter melalui pusat dan merupakan perentas terpanjang.'],
  ['Panjang diameter ialah dua kali panjang jejari.', true, 'Diameter = 2 × jejari.'],
  ['Semua jejari bagi sebuah bulatan adalah sama panjang.', true, 'Semua titik pada lilitan sama jarak dari pusat.'],
  ['Sektor dibatasi oleh dua jejari dan satu lengkok.', true, 'Itulah takrif sektor.'],
  ['Tembereng dibatasi oleh satu perentas dan satu lengkok.', true, 'Itulah takrif tembereng.'],
  ['Semua perentas melalui pusat bulatan.', false, 'Hanya diameter yang melalui pusat bulatan.'],
  ['Panjang jejari ialah dua kali panjang diameter.', false, 'Jejari = diameter ÷ 2.'],
  ['Tembereng dibatasi oleh dua jejari dan satu lengkok.', false, 'Kawasan itu ialah sektor. Tembereng dibatasi oleh perentas dan lengkok.'],
  ['Lengkok major lebih pendek daripada lengkok minor.', false, 'Lengkok major lebih panjang daripada separuh lilitan.'],
  ['Sebuah bulatan hanya mempunyai satu diameter.', false, 'Sebuah bulatan mempunyai banyak diameter yang melalui pusat.']
];
const BLBS2 = [
  ['Garis lurus dari pusat bulatan yang berserenjang dengan perentas membahagi dua sama perentas itu.', true, 'Ini ialah sifat simetri perentas.'],
  ['Pembahagi dua sama serenjang bagi sebarang perentas melalui pusat bulatan.', true, 'Pembahagi dua sama serenjang perentas ialah paksi simetri bulatan.'],
  ['Dua perentas yang sama panjang berada pada jarak yang sama dari pusat bulatan.', true, 'Perentas yang sama panjang adalah sama jarak dari pusat.'],
  ['Diameter yang berserenjang dengan perentas membahagi dua sama perentas itu.', true, 'Diameter melalui pusat, jadi ia membahagi dua sama perentas.'],
  ['Perentas yang lebih panjang berada lebih jauh dari pusat bulatan.', false, 'Perentas yang lebih panjang berada lebih dekat dengan pusat.'],
  ['Garis dari pusat ke titik tengah perentas adalah selari dengan perentas itu.', false, 'Garis itu berserenjang (90°) dengan perentas.'],
  ['Dua perentas yang sama jarak dari pusat mempunyai panjang yang berbeza.', false, 'Perentas yang sama jarak dari pusat adalah sama panjang.']
];
const BLPDIR = [
  ['Apakah sudut di antara perentas dengan garis lurus dari pusat bulatan ke titik tengah perentas itu?', '90°', ['Garis dari pusat ke titik tengah perentas berserenjang dengan perentas.']],
  ['Pembahagi dua sama serenjang bagi sebarang perentas sentiasa melalui satu titik tetap. Namakan titik itu.', 'Pusat bulatan', ['Pembahagi dua sama serenjang perentas ialah paksi simetri bulatan.', 'Paksi simetri bulatan melalui pusat.']],
  ['Dua perentas dalam sebuah bulatan mempunyai panjang yang berbeza. Perentas yang manakah lebih dekat dengan pusat?', 'Perentas yang lebih panjang', ['Semakin panjang perentas, semakin dekat perentas itu dengan pusat.', 'Diameter (perentas terpanjang) melalui pusat.']],
  ['Garis lurus dari pusat bulatan berserenjang dengan perentas AB di titik M. Apakah hubungan antara panjang AM dan MB?', 'AM = MB', ['Garis dari pusat yang berserenjang dengan perentas membahagi dua sama perentas itu.']],
  ['Dua perentas berada pada jarak yang sama dari pusat bulatan. Apakah yang boleh dikatakan tentang panjang kedua-dua perentas itu?', 'Kedua-duanya sama panjang', ['Perentas yang sama jarak dari pusat bulatan adalah sama panjang.']]
];
const BLTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [10, 24, 26], [15, 20, 25], [20, 21, 29]];
const BLDUA = { 5: [[3, 4], [4, 3]], 10: [[6, 8], [8, 6]], 13: [[5, 12], [12, 5]], 15: [[9, 12], [12, 9]], 17: [[8, 15], [15, 8]], 20: [[12, 16], [16, 12]], 25: [[7, 24], [24, 7], [15, 20], [20, 15]], 26: [[10, 24], [24, 10]], 29: [[20, 21], [21, 20]] };
const BLHUR = [['A', 'B', 'M'], ['P', 'Q', 'R'], ['K', 'L', 'M'], ['S', 'T', 'U'], ['E', 'F', 'G'], ['X', 'Y', 'Z']];
const BLOBJ = { cm: ['jam dinding', 'pinggan', 'cermin', 'tudung saji', 'dulang'], m: ['kolam', 'petak bunga', 'taman permainan', 'gelanggang'] };
const blTri = r => { const [a, b, c] = r.p(BLTRI); return r.f() < .5 ? { h: a, d: b, j: c } : { h: b, d: a, j: c }; };
const blPyW = (A, B, M, j, d, h) => [`Guna Teorem Pythagoras dalam segi tiga O${A}${M}: O${A}² = O${M}² + ${A}${M}².`];

/* =================== pembina soalan (r = RG atau RW) =================== */
const BL = {};
/* ---------- 5.1 ---------- */
BL.namaBah = (r, part, lab) => {
  part = part || r.p(BLBAHK); lab = lab || r.p(['P', 'Q', 'R', 'S', 'T', 'X', 'Y']);
  const [ans, claim, work] = BLBAH[part], rot = r.i(0, 359);
  return GEN_LQ('namaBah', { lab, ans, claim, work }, { fig: blBahFig(part, lab, rot, r) });
};
BL.istilah = (r, k) => { const [def, term] = k == null ? r.p(BLIST) : BLIST[k % BLIST.length]; return GEN_LQ('istilah', { def, term, ans: term, work: [`${vcap(def)} ialah <b>${term.toLowerCase()}</b>.`] }); };
BL.j2d = r => { const j = r.p([3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 21, 25, 2.5, 3.5, 4.5, 6.5, 7.5, 12.5]), dd = 2 * j; return GEN_LQ('j2d', { j, dd, ans: `${bn(dd)} cm`, work: ['Diameter = 2 × jejari', `= 2 × ${bn(j)} = ${bn(dd)} cm`] }); };
BL.d2j = r => { const dd = r.i(4, 40), j = dd / 2; return GEN_LQ('d2j', { j, dd, ans: `${bn(j)} cm`, work: ['Jejari = diameter ÷ 2', `= ${dd} ÷ 2 = ${bn(j)} cm`] }); };
BL.sifatBS = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('sifatBS', { s, ok, work: [why] }); };
BL.garis = (r, k) => {
  const L = blShuf(r, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'K', 'P', 'Q', 'R', 'S', 'T']).slice(0, 5), [A, B, C, D, E] = L, rot = r.i(0, 359);
  const T = [
    { what: 'diameter', ans: `${A}${B}`, claim: `${C}${D}`, why: `${C}${D} tidak melalui pusat O, jadi ${C}${D} ialah perentas sahaja. Diameter ialah ${A}${B}.`, work: [`${A}${B} melalui pusat O dan menyambungkan dua titik pada lilitan.`] },
    { what: 'perentas yang bukan diameter', ans: `${C}${D}`, claim: `O${E}`, why: `O${E} menyambungkan pusat dengan lilitan, jadi O${E} ialah jejari.`, work: [`${C}${D} menyambungkan dua titik pada lilitan tetapi tidak melalui O.`] },
    { what: `jejari yang tidak terletak pada garis ${A}${B}`, ans: `O${E}`, claim: `${C}${D}`, why: `${C}${D} menyambungkan dua titik pada lilitan, jadi ${C}${D} ialah perentas. Jejari itu ialah O${E}.`, work: [`O${E} menyambungkan pusat O dengan satu titik pada lilitan.`] }
  ];
  const t = T[k == null ? r.i(0, 2) : k % 3];
  return GEN_LQ('garis', Object.assign({ list: blDan([`${A}${B}`, `${C}${D}`, `O${E}`]) }, t), { fig: blGarisFig(rot, L) });
};
BL.sudutMaj = r => {
  const th = r.p([40, 55, 70, 80, 95, 100, 110, 115, 125, 130, 140, 150, 160]), [A, B] = r.p([['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S']]);
  const mid = r.i(0, 359), a1 = mid - th / 2, a2 = mid + th / 2;
  const fig = blSvg(blCirc('mu', 2.5) + `<path d="M0 0 L${blXY(blP(a2))} ${blArcA(a2, a1 + 360)} Z" ${blFill('pa', .14, 2)}/>` + `<path d="M0 0 L${blXY(blP(a1))} ${blArcA(a1, a2)} Z" ${blFill('tr', .3)}/>` + blDot(blP(a1)) + blDot(blP(a2)) + blTxt(blP(a1, 117), A) + blTxt(blP(a2, 117), B) + blTxt(blP(mid, 55), 'minor', 'tr', 15) + blTxt(blP(mid + 180, 55), 'major', 'pa', 15) + blDot([0, 0]) + blTxt(blAdd(blP(mid + 90, 16), [0, 0]), 'O'), 'Sektor minor dan sektor major');
  return GEN_LQ('sudutMaj', { th, A, B, ans: `${360 - th}°`, work: ['Sudut sektor minor + sudut sektor major = 360°.', `Sudut sektor major = 360° − ${th}° = ${360 - th}°.`] }, { fig });
};
BL.k51 = r => GEN_LQ('k51', { j: r.i(5, 15), n: r.p([3, 4, 5, 6]) });

/* ---------- 5.2 ---------- */
BL.sepPer = r => {
  const [A, B, M] = r.p(BLHUR), am = r.i(3, 15), ab = 2 * am, t = r.p([.35, .45, .55, .65]);
  return GEN_LQ('sepPer', { A, B, M, am, ab, ans: `${am} cm`, work: ['Garis dari pusat yang berserenjang dengan perentas membahagi dua sama perentas itu.', `${A}${M} = ${M}${B} = ${ab} ÷ 2 = ${am} cm.`] }, { fig: blChordFig(t, [A, B, M]) });
};
BL.samaJ = r => {
  let tr; do tr = blTri(r); while (tr.d / tr.j > .85);
  const { h, d, j } = tr, ab = 2 * h, t = d / j, rot = r.p([110, 125, -115, -135, 180]);
  const dirs = [[0, 1], blRot([0, 1], rot)], sx = dirs[0][0] + dirs[1][0], sy = dirs[0][1] + dirs[1][1], ln = Math.hypot(sx, sy);
  const op = ln < .1 ? [-20, 0] : [+(-sx / ln * 20).toFixed(2), +(-sy / ln * 20).toFixed(2)];
  const fig = blSvg(blCirc('mu', 3) + blChordIn(t, ['A', 'B', 'M'], 0) + blChordIn(t, ['C', 'D', 'N'], rot, { c: 'gr' }) + blO(op), 'Bulatan dengan dua perentas sama panjang');
  return GEN_LQ('samaJ', { ab, d, ans: `${d} cm`, work: ['Perentas yang sama panjang adalah sama jarak dari pusat bulatan.', `Maka ON = OM = ${d} cm.`] }, { fig });
};
BL.sifatPer = (r, k) => {
  if (k == null ? r.f() < .5 : k % 2 === 0) return BL.sifatBS(r, BLBS2, k == null ? null : k / 2 * 3 + 1);
  const [q, ans, work] = k == null ? r.p(BLPDIR) : BLPDIR[((k - 1) / 2) % BLPDIR.length];
  return { q, ans, work };
};
const blPyFig = (j, d, h, L, show) => {
  const t = d / j, base = blCirc('mu', 3) + blO([16, -14]);
  return {
    fig: blSvg(base + blChordIn(t, L, 0, { rad: true }), 'Bulatan berpusat O dengan perentas'),
    figAns: blSvg(base + blChordIn(t, L, 0, { rad: true, tri: true, labs: { om: `${d}`, am: `${h}`, oa: `${j}`, ...(show || {}) } }), 'Segi tiga bersudut tegak dalam bulatan')
  };
};
BL.pitaPer = r => {
  const { h, d, j } = blTri(r), [A, B, M] = r.p(BLHUR);
  return GEN_LQ('pitaPer', { j, d, h, A, B, M, ans: `${A}${B} = ${2 * h} cm`, work: blPyW(A, B, M).concat([`${A}${M} = ${rt(`${j}² − ${d}²`)} = ${rt(j * j - d * d)} = ${h} cm`, `${A}${B} = 2 × ${h} = ${2 * h} cm`]) }, blPyFig(j, d, h, [A, B, M]));
};
BL.pitaJar = r => {
  const { h, d, j } = blTri(r), [A, B, M] = r.p(BLHUR), ab = 2 * h;
  return GEN_LQ('pitaJar', { j, d, h, ab, A, B, M, ans: `O${M} = ${d} cm`, work: [`${A}${M} = ${ab} ÷ 2 = ${h} cm`, `O${M} = ${rt(`${j}² − ${h}²`)} = ${rt(j * j - h * h)} = ${d} cm`] }, blPyFig(j, d, h, [A, B, M]));
};
BL.pitaJej = r => {
  const { h, d, j } = blTri(r), [A, B, M] = r.p(BLHUR), ab = 2 * h;
  return GEN_LQ('pitaJej', { j, d, h, ab, A, B, M, ans: `${j} cm`, work: [`${A}${M} = ${ab} ÷ 2 = ${h} cm`, `O${A} = ${rt(`${h}² + ${d}²`)} = ${rt(h * h + d * d)} = ${j} cm`] }, blPyFig(j, d, h, [A, B, M]));
};
BL.duaPer = r => {
  const j = +r.p(Object.keys(BLDUA)), pr2 = blShuf(r, BLDUA[j]).slice(0, 2), same = r.f() < .5;
  let [[h1, d1], [h2, d2]] = pr2; if (d1 < d2) [[h1, d1], [h2, d2]] = [[h2, d2], [h1, d1]];
  const ab = 2 * h1, cd = 2 * h2, dist = same ? d1 - d2 : d1 + d2;
  const s = blCirc('mu', 3) + blChordIn(d1 / j, ['A', 'B', 'M'], 0, { mp: [20, 100 * d1 / j - 14] }) + blChordIn(d2 / j, ['C', 'D', 'N'], same ? 0 : 180, { c: 'gr', mp: [20, 100 * d2 / j - 14] }) + blO([-18, same ? -12 : 0]);
  return GEN_LQ('duaPer', { j, ab, cd, same, ans: `${dist} cm`, work: [`Jarak AB dari O: OM = ${rt(`${j}² − ${h1}²`)} = ${d1} cm.`, `Jarak CD dari O: ON = ${rt(`${j}² − ${h2}²`)} = ${d2} cm.`, same ? `Sebelah yang sama: MN = ${d1} − ${d2} = ${dist} cm.` : `Sebelah bertentangan: MN = ${d1} + ${d2} = ${dist} cm.`] }, { fig: blSvg(s, 'Bulatan dengan dua perentas selari') });
};
BL.diaSer = r => {
  const { h, d, j } = blTri(r), ab = 2 * h, t = d / j;
  const s = blCirc('mu', 3) + blLn([0, -100], [0, 100], 'pu', 3) + blChordIn(t, ['A', 'B', 'M'], 0, { mp: [-19, 100 * t - 14] }) + blDot([0, -100]) + blDot([0, 100]) + blTxt([0, -116], 'C') + blTxt([0, 117], 'D') + blO([16, -14]);
  return GEN_LQ('diaSer', { j, ab, d, ans: `${j - d} cm`, work: [`AM = ${ab} ÷ 2 = ${h} cm.`, `OM = ${rt(`${j}² − ${h}²`)} = ${d} cm.`, `MD = OD − OM = ${j} − ${d} = ${j - d} cm.`] }, { fig: blSvg(s, 'Diameter berserenjang dengan perentas') });
};

/* ---------- 5.3 ---------- */
const blRFig = (lab, useD) => blSvg(blCirc('mu', 3) + (useD ? blLn([-100, 0], [100, 0], 'tr', 4) + blDot([-100, 0]) + blDot([100, 0]) : blLn([0, 0], blP(30), 'tr', 4) + blDot(blP(30))) + blDot([0, 0]) + blTxt(useD ? [0, 16] : [-14, 12], 'O', 'tx', 17) + blTxt(useD ? [0, -18] : blAdd(blP(30, 50), blP(120, 16)), lab, 'tr', 17), 'Bulatan dengan ukuran');
function blCData(r, pi, useD, u) {
  let j, dd;
  if (pi === 7) { if (useD) { dd = r.p([7, 14, 21, 28, 35, 42, 56, 70]); j = dd / 2; } else { j = r.p([7, 14, 21, 28, 35, 42]); dd = 2 * j; } }
  else if (useD) { dd = r.i(5, 30); j = dd / 2; } else { j = r.i(3, 20); dd = 2 * j; }
  const gv = useD ? `diameter ${bn(dd)} ${u}` : `jejari ${bn(j)} ${u}`, gvb = useD ? `berdiameter ${bn(dd)} ${u}` : `berjejari ${bn(j)} ${u}`;
  return { j, dd, gv, gvb, pt: blPiQ(pi), obj: r.p(BLOBJ[u]), u, fig: blRFig(`${bn(useD ? dd : j)} ${u}`, useD) };
}
BL.lilitan = (r, pi, useD) => {
  pi = pi || r.p([7, 7, 3]); useD = useD == null ? r.f() < .4 : useD;
  const u = r.f() < .7 ? 'cm' : 'm', c = blCData(r, pi, useD, u), L = blPiV(pi) * c.dd;
  const work = useD ? ['Lilitan = πd', `= ${blPiS(pi)} × ${bn(c.dd)}`, blRes(pi, L, u)] : ['Lilitan = 2πj', `= 2 × ${blPiS(pi)} × ${bn(c.j)}`, blRes(pi, L, u)];
  return GEN_LQ('lilitan', Object.assign(c, { ans: blAns(pi, L, u), work }), { fig: c.fig });
};
BL.luas = (r, pi, useD) => {
  pi = pi || r.p([7, 7, 3]); useD = useD == null ? r.f() < .4 : useD;
  const u = r.f() < .7 ? 'cm' : 'm', c = blCData(r, pi, useD, u), A = blPiV(pi) * c.j * c.j;
  const work = (useD ? [`Jejari = ${bn(c.dd)} ÷ 2 = ${bn(c.j)} ${u}`] : []).concat([`Luas = πj² = ${blPiS(pi)} × ${bn(c.j)}²`, blRes(pi, A, u + '²')]);
  return GEN_LQ('luas', Object.assign(c, { ans: blAns(pi, A, u + '²'), work }), { fig: c.fig });
};
BL.cariJ = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'L' : 'A');
  const pi = r.f() < .7 ? 7 : 3, u = r.p(['cm', 'cm', 'm']), j = pi === 7 ? r.p([7, 14, 21, 28, 35]) : r.p([5, 10, 15, 20]), pt = blPiQ(pi);
  if (kind === 'L') { const L = bn(2 * blPiV(pi) * j); return GEN_LQ('cariJL', { L, u, j, pt, ans: `${j} ${u}`, work: ['Lilitan = 2πj', `2 × ${blPiS(pi)} × j = ${L}`, `j = ${L} ÷ ${bn(2 * blPiV(pi))} = ${j} ${u}`.replace(`÷ ${bn(2 * 22 / 7)}`, ('÷ ' + fr(44, 7)))] }); }
  const A = bn(blPiV(pi) * j * j);
  return GEN_LQ('cariJA', { A, u, j, pt, ans: `${j} ${u}`, work: [`πj² = ${A}`, `j² = ${A} ÷ ${blPiS(pi)} = ${j * j}`, `j = ${rt(j * j)} = ${j} ${u}`] });
};
function blArcData(r, pi, easy) {
  for (let t = 0; t < 300; t++) {
    const th = r.p(easy ? [45, 60, 90, 120, 180, 270] : [30, 40, 45, 60, 72, 80, 100, 120, 135, 150, 210, 225, 240, 270, 300]);
    const j = pi === 7 ? r.p([7, 14, 21, 28, 35]) : r.i(4, 20), pv = blPiV(pi);
    const L = th / 360 * 2 * pv * j, S = th / 360 * pv * j * j;
    if (pi === 3 || (blDp2(L) && blDp2(S))) return { th, j, L, S };
  }
  return { th: 90, j: 14, L: 22, S: 154 };
}
BL.lengkok = (r, pi, easy) => {
  pi = pi || r.p([7, 7, 3]);
  const { th, j, L } = blArcData(r, pi, easy), [A, B] = r.p([['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S']]);
  return GEN_LQ('lengkok', { j, th, A, B, pt: blPiQ(pi), ans: blAns(pi, L, 'cm'), work: [('Panjang lengkok = ' + fr('θ', '360°') + ' × 2πj'), `= ${fr(`${th}°`, '360°')} × 2 × ${blPiS(pi)} × ${j}`, blRes(pi, L, 'cm')] }, { fig: blSekFig(th, r.i(0, 359), { arc: true, th: `${th}°`, jl: `${j} cm`, L: [A, B], c: 'tr' }) });
};
BL.sektor = (r, pi, easy) => {
  pi = pi || r.p([7, 7, 3]);
  const { th, j, S } = blArcData(r, pi, easy), [A, B] = r.p([['A', 'B'], ['P', 'Q'], ['M', 'N'], ['R', 'S']]);
  return GEN_LQ('sektor', { j, th, A, B, pt: blPiQ(pi), ans: blAns(pi, S, 'cm²'), work: [('Luas sektor = ' + fr('θ', '360°') + ' × πj²'), `= ${fr(`${th}°`, '360°')} × ${blPiS(pi)} × ${j}²`, blRes(pi, S, 'cm²')] }, { fig: blSekFig(th, r.i(0, 359), { th: `${th}°`, jl: `${j} cm`, L: [A, B], c: 'gr' }) });
};
BL.sudut = (r, kind) => {
  kind = kind || (r.f() < .5 ? 'L' : 'S');
  let a; do a = blArcData(r, 7); while (kind === 'S' && a.th > 180);
  const { th, j, L, S } = a, [A, B] = r.p([['A', 'B'], ['P', 'Q'], ['M', 'N']]), pt = blPiQ(7), fig = blSekFig(th, r.i(0, 359), { arc: kind === 'L', th: 'θ', jl: `${j} cm`, L: [A, B], c: kind === 'L' ? 'tr' : 'gr' });
  if (kind === 'L') return GEN_LQ('sudutL', { j, L: bn(L), A, B, pt, ans: `${th}°`, work: [`${fr('θ', '360°')} × 2 × ${fr(22, 7)} × ${j} = ${bn(L)}`, `${fr('θ', '360°')} × ${bn(44 / 7 * j)} = ${bn(L)}`, `θ = ${bn(L)} ÷ ${bn(44 / 7 * j)} × 360° = ${th}°`] }, { fig });
  return GEN_LQ('sudutS', { j, S: bn(S), A, B, pt, ans: `${th}°`, work: [`${fr('θ', '360°')} × ${fr(22, 7)} × ${j}² = ${bn(S)}`, `${fr('θ', '360°')} × ${bn(22 / 7 * j * j)} = ${bn(S)}`, `θ = ${bn(S)} ÷ ${bn(22 / 7 * j * j)} × 360° = ${th}°`] }, { fig });
};
BL.jejL = r => {
  let a; do a = blArcData(r, 7); while (a.th >= 180);
  const { th, j, L } = a;
  return GEN_LQ('jejL', { th, j, L: bn(L), pt: blPiQ(7), ans: `${j} cm`, work: [`${fr(`${th}°`, '360°')} × 2 × ${fr(22, 7)} × j = ${bn(L)}`, `j = ${bn(L)} × ${fr(360, th)} ÷ ${fr(44, 7)}`, `= ${j} cm`] });
};
BL.roda = r => {
  const D = r.p([35, 42, 49, 56, 63, 70, 77, 84]), n = r.p([25, 50, 100, 125, 200, 250, 500]), c = 22 * D / 7, m = n * c / 100;
  return GEN_LQ('roda', { D, n, c, m, work: [`Lilitan roda = πd = ${fr(22, 7)} × ${D} = ${c} cm.`, `Jarak = ${n} × ${c} = ${bn(n * c)} cm.`, `${bn(n * c)} cm ÷ 100 = ${bn(m)} m.`] });
};
function blTrekFig(Pj, D) {
  const w = 150, h = 80, x0 = -w / 2, y0 = -h / 2, rr = h / 2;
  const d = `M${x0} ${y0} H${x0 + w} A${rr} ${rr} 0 0 1 ${x0 + w} ${y0 + h} H${x0} A${rr} ${rr} 0 0 1 ${x0} ${y0} Z`;
  const s = `<path d="${d}" ${blFill('gr', .18, 4)}/>` + blLn([x0, y0], [x0, y0 + h], 'mu', 2, true) + blLn([x0 + w, y0], [x0 + w, y0 + h], 'mu', 2, true) + blTxt([0, y0 - 16], `${Pj} m`, 'tx', 16) + blTxt([x0 + 22, 0], `${D} m`, 'tx', 15);
  return blSvg(s, 'Trek dengan dua separuh bulatan', '-150 -90 300 180');
}
BL.trek = r => {
  const D = r.p([14, 28, 42, 56, 70]), Pj = r.p([50, 60, 80, 100, 120].filter(v => v > D + 10)), per = 2 * Pj + 22 / 7 * D, area = Pj * D + 22 / 7 * (D / 2) ** 2, n = r.p([2, 3, 4, 5]);
  return GEN_LQ('trek', { Pj, D, per, area, n, work: [`Dua separuh bulatan = satu lilitan: ${fr(22, 7)} × ${D} = ${bn(22 / 7 * D)} m.`, `Perimeter = 2 × ${Pj} + ${bn(22 / 7 * D)}`, `= ${bn(per)} m`] }, { fig: blTrekFig(Pj, D) });
};
BL.gelang = r => {
  const [R, rr] = r.p([[14, 7], [21, 14], [21, 7], [28, 14], [28, 21], [35, 28], [35, 14], [42, 35]]), ri2 = +(100 * rr / R).toFixed(2);
  const fig = blSvg(`<path d="M-100 0 A100 100 0 1 0 100 0 A100 100 0 1 0 -100 0 Z M-${ri2} 0 A${ri2} ${ri2} 0 1 0 ${ri2} 0 A${ri2} ${ri2} 0 1 0 -${ri2} 0 Z" fill-rule="evenodd" ${blFill('pu', .28, 3)}/>` + blLn([0, 0], blP(35), 'tx', 2.5) + blLn([0, 0], blP(160, ri2), 'tx', 2.5) + blO([0, 16]), 'Dua bulatan sepusat');
  return GEN_LQ('gelang', { R, r: rr, work: ['Luas berlorek = luas bulatan besar − luas bulatan kecil', `= ${fr(22, 7)} × ${R}² − ${fr(22, 7)} × ${rr}²`, `= ${bn(22 / 7 * R * R)} − ${bn(22 / 7 * rr * rr)} = ${bn(22 / 7 * (R * R - rr * rr))}`] }, { fig });
};
BL.pizza = r => {
  const [j, n] = r.p([[14, 4], [14, 8], [21, 6], [21, 12], [28, 8], [28, 4], [7, 4], [35, 10]]);
  let s = blCirc('am', 3);
  for (let i = 0; i < n; i++) s += blLn([0, 0], blP(90 + i * 360 / n), 'am', 2);
  s += `<path d="M0 0 L${blXY(blP(90))} ${blArcA(90, 90 + 360 / n)} Z" ${blFill('pa', .35)}/>` + blDot([0, 0]);
  return GEN_LQ('pizza', { j, n }, { fig: blSvg(s, 'Pizza dipotong kepada beberapa keping sama besar') });
};
BL.separuh = r => {
  const D = r.p([14, 28, 42, 56]);
  const s = `<path d="M-110 30 A110 110 0 0 1 110 30 Z" ${blFill('tr', .22, 3.5)}/>` + blTxt([0, 50], `${D} cm`, 'tx', 17);
  return GEN_LQ('separuh', { D }, { fig: blSvg(s, 'Separuh bulatan', '-150 -100 300 170') });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '5.1': {
    m: [() => BL.namaBah(RG), () => BL.namaBah(RG), () => (Math.random() < .5 ? BL.j2d(RG) : BL.d2j(RG)), () => BL.istilah(RG)],
    s: [() => BL.garis(RG), () => BL.sifatBS(RG, BLBS1), () => BL.sudutMaj(RG)],
    k: [() => BL.k51(RG)]
  },
  '5.2': {
    m: [() => BL.sepPer(RG), () => BL.samaJ(RG), () => BL.sifatPer(RG)],
    s: [() => BL.pitaPer(RG), () => BL.pitaJar(RG)],
    k: [() => BL.pitaJej(RG), () => BL.duaPer(RG), () => BL.diaSer(RG)]
  },
  '5.3': {
    m: [() => BL.lilitan(RG), () => BL.luas(RG), () => BL.lengkok(RG, 7, true), () => BL.sektor(RG, 7, true)],
    s: [() => BL.cariJ(RG), () => BL.sudut(RG), () => BL.lengkok(RG, 3), () => BL.sektor(RG, 3), () => BL.pizza(RG), () => BL.separuh(RG)],
    k: [() => BL.roda(RG), () => BL.trek(RG), () => BL.gelang(RG), () => BL.jejL(RG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
const wq = GEN_LQ;
const BLBAHWS = ['jejari', 'perentas', 'skMin', 'lkMaj', 'tbMin', 'diameter', 'skMaj', 'lkMin', 'tbMaj'];
// 5.1
WG.namaBah = i => BL.namaBah(RW, BLBAHWS[i % BLBAHWS.length], 'PQRSTUXYZ'[i % 9]);
WG.j2d = () => BL.j2d(RW);
WG.d2j = () => BL.d2j(RW);
WG.istilah = i => BL.istilah(RW, [1, 7, 4][i % 3] + wri(0, 1) * 5);
WG.garis = i => BL.garis(RW, i);
WG.sifatBS = i => BL.sifatBS(RW, BLBS1, [0, 5, 7][i % 3] + wri(0, 2));
WG.sudutMaj = () => BL.sudutMaj(RW);
WG.k51 = () => BL.k51(RW);
// 5.2
WG.sepPer = () => BL.sepPer(RW);
WG.samaJ = () => BL.samaJ(RW);
WG.sifatPer = i => BL.sifatPer(RW, i);
WG.pitaPer = () => BL.pitaPer(RW);
WG.pitaJar = () => BL.pitaJar(RW);
WG.pitaJej = () => BL.pitaJej(RW);
WG.duaPer = () => BL.duaPer(RW);
WG.diaSer = () => BL.diaSer(RW);
// 5.3
WG.lilitan = i => BL.lilitan(RW, i % 2 ? 3 : 7, i % 3 === 2);
WG.luas = i => BL.luas(RW, i % 2 ? 3 : 7, i % 3 === 1);
WG.lengkokM = () => BL.lengkok(RW, 7, true);
WG.sektorM = () => BL.sektor(RW, 7, true);
WG.cariJ = i => BL.cariJ(RW, i % 2 ? 'A' : 'L');
WG.sudut = i => BL.sudut(RW, i % 2 ? 'S' : 'L');
WG.lsk3 = i => (i % 2 ? BL.sektor(RW, 3) : BL.lengkok(RW, 3));
WG.separuh = () => BL.separuh(RW);
WG.pizza = () => BL.pizza(RW);
WG.roda = () => BL.roda(RW);
WG.gelang = () => BL.gelang(RW);
WG.trek = () => BL.trek(RW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '5.1': [['m', 'namaBah', 9], ['m', 'j2d', 3], ['m', 'd2j', 3], ['m', 'istilah', 3], ['s', 'garis', 3], ['s', 'sifatBS', 3], ['s', 'sudutMaj', 3], ['k', 'k51', 3]],
  '5.2': [['m', 'sepPer', 8], ['m', 'samaJ', 5], ['m', 'sifatPer', 5], ['s', 'pitaPer', 5], ['s', 'pitaJar', 4], ['k', 'pitaJej', 1], ['k', 'duaPer', 1], ['k', 'diaSer', 1]],
  '5.3': [['m', 'lilitan', 6], ['m', 'luas', 6], ['m', 'lengkokM', 3], ['m', 'sektorM', 3], ['s', 'cariJ', 3], ['s', 'sudut', 2], ['s', 'lsk3', 2], ['s', 'separuh', 1], ['s', 'pizza', 1], ['k', 'roda', 1], ['k', 'gelang', 1], ['k', 'trek', 1]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan nombor: jawapan + calon kesilapan biasa (unik, positif)
function blOpts(ans, cands, f) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !isFinite(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const st = ans >= 20 ? Math.max(1, Math.round(ans / 10)) : 1;
  for (let k = 1; w.length < 3 && k < 50; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * st; if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function blOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const blF = u => x => `${bn(x)} ${u}`;
const blMcq = (q, fig, o, reveal) => Object.assign({ type: 'mcq', q, fig, opts: o.opts, c: o.c }, reveal ? { reveal } : {});
const BLPARTN = BLBAHK.map(k => BLBAH[k][0]);
const BLFAM = { pusat: ['Jejari', 'Diameter', 'Lilitan'], jejari: ['Diameter', 'Perentas', 'Pusat'], diameter: ['Jejari', 'Perentas', 'Lilitan'], perentas: ['Diameter', 'Jejari', 'Tembereng minor'], lkMin: ['Lengkok major', 'Sektor minor', 'Perentas'], lkMaj: ['Lengkok minor', 'Sektor major', 'Lilitan'], skMin: ['Sektor major', 'Tembereng minor', 'Lengkok minor'], skMaj: ['Sektor minor', 'Tembereng major', 'Lengkok major'], tbMin: ['Tembereng major', 'Sektor minor', 'Lengkok minor'], tbMaj: ['Tembereng minor', 'Sektor major', 'Lengkok major'], lilitan: ['Diameter', 'Lengkok major', 'Jejari'] };
const CQGEN = {
  bahagian: [
    () => { const part = pick(BLBAHK), lab = pick(['P', 'Q', 'R', 'X']), ans = BLBAH[part][0]; return blMcq(`Apakah nama bahagian berlabel ${lab}?`, blBahFig(part, lab, ri(0, 359), RG), blOptsT(ans, BLFAM[part].concat(shuffle(BLPARTN)))); },
    () => {
      if (Math.random() < .5) { const j = pick([3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 2.5, 4.5, 6.5]); return blMcq(`Jejari bulatan ialah ${bn(j)} cm. Berapakah diameternya?`, blRFig(`${bn(j)} cm`, false), blOpts(2 * j, [j / 2, j, 4 * j, j + 2], blF('cm'))); }
      const L = shuffle(['A', 'B', 'C', 'D', 'E', 'K', 'P', 'Q']).slice(0, 5), [A, B, C, D, E] = L, k = ri(0, 1);
      const ans = k ? `${C}${D}` : `${A}${B}`;
      return blMcq(k ? 'Garis manakah ialah perentas yang <b>bukan</b> diameter?' : 'Garis manakah ialah <b>diameter</b>?', blGarisFig(ri(0, 359), L), blOptsT(ans, [`${A}${B}`, `${C}${D}`, `O${E}`, `O${A}`, `O${B}`]));
    },
    () => {
      if (Math.random() < .5) { const th = pick([50, 70, 80, 100, 110, 125, 140, 150]), mid = ri(0, 359); return blMcq(`Sudut sektor minor ialah ${th}°. Berapakah sudut sektor major?`, blSekFig(th, mid, { th: `${th}°`, c: 'tr' }), blOpts(360 - th, [180 - th, 180 + th, 2 * th], x => `${bn(x)}°`)); }
      const t = shuffle(BLBS1.filter(s => s[1]))[0], f = shuffle(BLBS1.filter(s => !s[1])).slice(0, 3).map(s => s[0]);
      const opts = shuffle([t[0], ...f]);
      return { type: 'mcq', q: 'Pernyataan manakah yang <b>betul</b>?', fig: blBahFig(pick(['diameter', 'skMin', 'tbMin']), '', ri(0, 359), RG), opts, c: opts.indexOf(t[0]) };
    }
  ],
  perentas: [
    () => { const [A, B, M] = ['A', 'B', 'M'], am = ri(3, 14), ab = 2 * am; return blMcq(`OM berserenjang dengan perentas AB. AB = ${ab} cm. Berapakah panjang AM?`, blChordFig(pick([.4, .5, .6]), [A, B, M]), blOpts(am, [ab, am / 2, 2 * ab, am + 2], blF('cm'))); },
    () => {
      const { h, d, j } = blTri(RG), F = blPyFig(j, d, h, ['A', 'B', 'M']);
      const rev = blChordIn(d / j, ['', '', ''], 0, { tri: true, labs: { am: `${h}` } });
      if (Math.random() < .5) return blMcq(`OA = ${j} cm dan OM = ${d} cm. Berapakah panjang perentas AB?`, F.fig, blOpts(2 * h, [h, j + d, 2 * d, 2 * j, j - d], blF('cm')), rev);
      return blMcq(`Jejari = ${j} cm dan AB = ${2 * h} cm. Berapakah jarak OM?`, F.fig, blOpts(d, [h, j - h, j + h, 2 * d, j], blF('cm')), rev);
    },
    () => {
      if (Math.random() < .35) { const { h, d } = blTri(RG); return blMcq(`Perentas AB dan CD sama panjang. OM = ${d} cm ialah jarak AB dari pusat. Berapakah jarak CD dari pusat?`, BL.samaJ(RG).fig, blOpts(d, [2 * d, d / 2, h, d + h], blF('cm'))); }
      const { h, d, j } = blTri(RG), F = blPyFig(j, d, h, ['A', 'B', 'M']);
      return blMcq(`AB = ${2 * h} cm dan OM = ${d} cm. Berapakah jejari OA?`, F.fig, blOpts(j, [h + d, 2 * j, 2 * h, Math.round(Math.sqrt(4 * h * h + d * d))], blF('cm')), blChordIn(d / j, ['', '', ''], 0, { tri: true, labs: { am: `${h}`, om: `${d}` } }));
    }
  ],
  lilitanLuas: [
    () => { const j = pick([7, 14, 21, 28, 35]), L = 44 * j / 7; return blMcq(`Jejari = ${j} cm. Berapakah lilitan bulatan? (π = ${fr(22, 7)})`, blRFig(`${j} cm`, false), blOpts(L, [L / 2, 2 * L, 22 / 7 * j * j, 22 / 7 * j], blF('cm'))); },
    () => {
      if (Math.random() < .5) { const j = pick([7, 14, 21, 28]), A = 22 / 7 * j * j; return blMcq(`Jejari = ${j} cm. Berapakah luas bulatan? (π = ${fr(22, 7)})`, blRFig(`${j} cm`, false), blOpts(A, [44 / 7 * j, 22 / 7 * 4 * j * j, 22 / 7 * j * 2, A / 2], x => `${bn(x)} cm²`)); }
      const dd = pick([14, 28, 42, 56]), A = 22 / 7 * dd * dd / 4; return blMcq(`Diameter = ${dd} cm. Berapakah luas bulatan? (π = ${fr(22, 7)})`, blRFig(`${dd} cm`, true), blOpts(A, [22 / 7 * dd * dd, 22 / 7 * dd, 4 * A, A / 2], x => `${bn(x)} cm²`));
    },
    () => {
      const j = pick([7, 14, 21, 28, 35]);
      if (Math.random() < .5) return blMcq(`Lilitan sebuah bulatan ialah ${bn(44 * j / 7)} cm. Berapakah jejarinya? (π = ${fr(22, 7)})`, blRFig('j = ?', false), blOpts(j, [2 * j, j / 2, j + 7, 44 * j / 7 / 2], blF('cm')));
      return blMcq(`Luas sebuah bulatan ialah ${bn(22 / 7 * j * j)} cm². Berapakah jejarinya? (π = ${fr(22, 7)})`, blRFig('j = ?', false), blOpts(j, [j * j, 2 * j, j / 2, j + 7], blF('cm')));
    }
  ],
  lengkokSektor: [
    () => { const { th, j, L } = blArcData(RG, 7, true), mid = ri(0, 359); return blMcq(`Jejari = ${j} cm, sudut = ${th}°. Berapakah panjang lengkok? (π = ${fr(22, 7)})`, blSekFig(th, mid, { arc: true, th: `${th}°`, jl: `${j} cm` }), blOpts(L, [th / 360 * 22 / 7 * j * j, 2 * L, 44 / 7 * j, L / 2], blF('cm'))); },
    () => { const { th, j, S, L } = blArcData(RG, 7, true), mid = ri(0, 359); return blMcq(`Jejari = ${j} cm, sudut = ${th}°. Berapakah luas sektor? (π = ${fr(22, 7)})`, blSekFig(th, mid, { th: `${th}°`, jl: `${j} cm`, c: 'gr' }), blOpts(S, [L, 2 * S, 22 / 7 * j * j, S / 2], x => `${bn(x)} cm²`)); },
    () => {
      const { th, j, S, L } = blArcData(RG, 7), mid = ri(0, 359), A = Math.random() < .5;
      return blMcq(A ? `Jejari = ${j} cm dan panjang lengkok = ${bn(L)} cm. Berapakah θ? (π = ${fr(22, 7)})` : `Jejari = ${j} cm dan luas sektor = ${bn(S)} cm². Berapakah θ? (π = ${fr(22, 7)})`, blSekFig(th, mid, { arc: A, th: 'θ', jl: `${j} cm`, c: A ? 'tr' : 'gr' }), blOpts(th, [360 - th, th / 2, 2 * th, th + 30], x => `${bn(x)}°`));
    }
  ]
};
const CQT = { bahagian: 'Bahagian bulatan', perentas: 'Sifat perentas', lilitanLuas: 'Lilitan & luas', lengkokSektor: 'Lengkok & sektor' };
function blCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.bahagian;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['bahagian', 'bahagian', 'perentas', 'lilitanLuas'] : Object.keys(CQT);
  return blCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return blCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
