'use strict';
/* =================== UBAHAN · SOALAN BAB 1 UBAHAN (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Semua nama global berawalan "ub" / "UB".

/* =================== pembantu =================== */
const ubGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const ubLcm = (a, b) => a / ubGcd(a, b) * b;
const ubRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const ubRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
// kuasa: 1, 2, 3, 'h' (punca kuasa dua), 't' (punca kuasa tiga)
const UBX = { 1: [1, 2, 3, 4, 5, 6, 8, 10, 12], 2: [1, 2, 3, 4, 5, 6, 8, 10], 3: [1, 2, 3, 4, 5], h: [1, 4, 9, 16, 25, 36, 49, 64, 81, 100], t: [1, 8, 27, 64, 125] };
const ubF = (v, n) => (n === 'h' ? Math.round(Math.sqrt(v)) : n === 't' ? Math.round(Math.cbrt(v)) : v ** n);
const ubPw = (L, n) => (n === 1 ? L : n === 2 ? L + '²' : n === 3 ? L + '³' : n === 'h' ? '√' + L : '∛' + L);
const ubSb = (v, n) => (n === 1 ? '' + v : n === 2 ? v + '²' : n === 3 ? v + '³' : n === 'h' ? '√' + v : '∛' + v);
const ubW = (L, n) => (n === 1 ? L : n === 2 ? 'kuasa dua ' + L : n === 3 ? 'kuasa tiga ' + L : n === 'h' ? 'punca kuasa dua ' + L : 'punca kuasa tiga ' + L);
const UBH2 = [['y', 'x'], ['p', 'q'], ['m', 'n'], ['w', 'v'], ['P', 'Q'], ['s', 't']];
const UBH3 = [['y', 'x', 'z'], ['p', 'q', 'r'], ['w', 'u', 'v'], ['m', 'n', 't'], ['P', 'Q', 'R']];

/* ---------- spesifikasi hubungan: Y, terms [{L, n, inv}] ---------- */
function ubRel(Y, T) {
  const num = T.filter(t => !t.inv), den = T.filter(t => t.inv);
  const ns = num.map(t => ubPw(t.L, t.n)).join(''), ds = den.map(t => ubPw(t.L, t.n)).join('');
  const dsp = den.length > 1 ? `(${ds})` : ds;
  const prop = `${Y} ∝ ${den.length ? `${ns || '1'}/${dsp}` : ns}`;
  const eq = k => { const kk = k == null ? 'k' : (k === 1 && ns ? '' : '' + k); return `${Y} = ${den.length ? `${kk || '1'}${ns}/${dsp}` : kk + ns}`; };
  // ayat
  let ayat;
  if (!den.length) ayat = `${Y} berubah secara langsung dengan ${num.map(t => ubW(t.L, t.n)).join(' dan ')}`;
  else if (!num.length) ayat = `${Y} berubah secara songsang dengan ${den.map(t => ubW(t.L, t.n)).join(' dan ')}`;
  else ayat = `${Y} berubah secara langsung dengan ${num.map(t => ubW(t.L, t.n)).join(' dan ')} dan secara songsang dengan ${den.map(t => ubW(t.L, t.n)).join(' dan ')}`;
  return { Y, T, prop, eq, ayat };
}
// nilai: vals = [v untuk setiap term]; pulang {N, D}
const ubND = (T, vals) => { let N = 1, D = 1; T.forEach((t, i) => { const f = ubF(vals[i], t.n); if (t.inv) D *= f; else N *= f; }); return { N, D }; };
const ubSubs = (T, vals, k) => {
  const num = [], den = [];
  T.forEach((t, i) => (t.inv ? den : num).push(ubSb(vals[i], t.n)));
  const kk = k == null ? 'k' : '' + k;
  const top = [kk].concat(num).join(' × ');
  return den.length ? `${num.length ? '(' + top + ')' : top} / ${den.length > 1 ? '(' + den.join(' × ') + ')' : den[0]}` : top;
};
const ubVals = (T, vs) => T.map((t, i) => `${t.L} = ${vs[i]}`).join(' dan ');

// jana dua set nilai + k supaya y1, y2 integer (k boleh pecahan/perpuluhan jika UB_FRAC)
let UB_FRAC = true;
function ubGen(r, T, opt) {
  opt = opt || {};
  // songsang tulen: k = y × xⁿ sentiasa integer, jadi k pecahan hanya untuk langsung/bergabung
  const wantFrac = opt.frac !== false && UB_FRAC && T.some(t => !t.inv) && r.f() < 0.4;
  for (let tries = 0; tries < 400; tries++) {
    const v1 = T.map(t => r.p(UBX[t.n])), v2 = T.map(t => r.p(UBX[t.n]));
    if (v1.join() === v2.join()) continue;
    if (opt.noOne && (v1.includes(1) || v2.includes(1))) continue;
    const a = ubND(T, v1), b = ubND(T, v2);
    let k, y1, y2;
    if (wantFrac && tries < 300) {
      // k pecahan/perpuluhan (0.5, 1.5, 0.25, 2.4 …); y1, y2 kekal integer
      const den = r.p([2, 2, 4, 5, 10]), num = r.i(1, 3 * den);
      if (ubGcd(num, den) !== 1 || (num * a.N) % (den * a.D) || (num * b.N) % (den * b.D)) continue;
      k = num / den; y1 = num * a.N / (den * a.D); y2 = num * b.N / (den * b.D);
    } else {
      const L = ubLcm(a.D / ubGcd(a.N, a.D), b.D / ubGcd(b.N, b.D));
      k = L * r.i(1, opt.km || 4); y1 = k * a.N / a.D; y2 = k * b.N / b.D;
    }
    if (!Number.isInteger(y1) || !Number.isInteger(y2) || y1 === y2) continue;
    if (k > (opt.kmax || 400) || y1 > (opt.ymax || 2000) || y2 > (opt.ymax || 2000)) continue;
    return { k, v1, v2, y1, y2 };
  }
  return { k: 2, v1: T.map(() => 2), v2: T.map(() => 4), y1: 0, y2: 0, bad: true };
}

/* ---------- spesifikasi rawak setiap subtopik ---------- */
const UBN1 = [1, 2, 3, 'h', 't'];
function ubSpec(r, sub, nForce) {
  if (sub === '1.3') {
    const [Y, X, Z] = r.p(UBH3);
    const kind = r.p(['xz', 'x2z', 'xhz', 'x/z', 'x/z2', 'x2/z', 'xz/']);
    const T = kind === 'xz' ? [{ L: X, n: 1 }, { L: Z, n: 1 }] : kind === 'x2z' ? [{ L: X, n: 2 }, { L: Z, n: 1 }] : kind === 'xhz' ? [{ L: X, n: 1 }, { L: Z, n: 'h' }]
      : kind === 'x/z' ? [{ L: X, n: 1 }, { L: Z, n: 1, inv: true }] : kind === 'x/z2' ? [{ L: X, n: 1 }, { L: Z, n: 2, inv: true }] : kind === 'x2/z' ? [{ L: X, n: 2 }, { L: Z, n: 1, inv: true }]
      : [{ L: X, n: 1, inv: true }, { L: Z, n: 1, inv: true }];
    return ubRel(Y, T);
  }
  const [Y, X] = r.p(UBH2), n = nForce != null ? nForce : r.p(UBN1);
  return ubRel(Y, [{ L: X, n, inv: sub === '1.2' }]);
}

/* =================== QV: cara tanya =================== */
const QV = {
  tulis: [
    d => ({ q: `Diberi ${d.ayat}. Tuliskan hubungan itu dengan simbol ∝ dan dalam bentuk persamaan.` }),
    d => ({ q: `Ungkapkan pernyataan berikut menggunakan simbol ubahan dan pemalar k: “${d.ayat}”.` }),
    d => ({ q: `Tulis persamaan yang menghubungkan pemboleh ubah bagi pernyataan “${d.ayat}”. Gunakan k sebagai pemalar.` }),
    d => ({ q: `Hubungan ${d.prop} diberikan. Huraikan hubungan ini dalam ayat dan tulis persamaannya.`, ans: `${d.ayat}; ${d.eqk}` })
  ],
  cariK: [
    d => ({ q: `Diberi ${d.ayat}. Apabila ${d.c1}, ${d.Y} = ${d.y1}. Ungkapkan ${d.Y} dalam sebutan ${d.vars}.` }),
    d => ({ q: `Diberi ${d.prop} dan ${d.Y} = ${d.y1} apabila ${d.c1}. Cari nilai pemalar k dan tulis persamaan yang menghubungkan pemboleh ubah itu.` }),
    d => ({ q: `Diberi ${d.prop}. Jika ${d.Y} = ${d.y1} apabila ${d.c1}, cari nilai k.`, ans: `k = ${d.k}` }),
    d => ({ q: `Diberi ${d.ayat}. Diketahui ${d.Y} = ${d.y1} apabila ${d.c1}. Bentukkan persamaan ${d.Y} dalam sebutan ${d.vars}.` })
  ],
  cariY: [
    d => ({ q: `Diberi ${d.ayat} dan ${d.Y} = ${d.y1} apabila ${d.c1}. Hitung nilai ${d.Y} apabila ${d.c2}.` }),
    d => ({ q: `Diketahui ${d.ayat}. Jika ${d.Y} = ${d.y1} apabila ${d.c1}, cari nilai ${d.Y} apabila ${d.c2}.` }),
    d => ({ q: `Diberi ${d.prop} dan ${d.Y} = ${d.y1} apabila ${d.c1}. Cari ${d.Y} apabila ${d.c2}.` }),
    d => { const N = vnama(); return Object.assign({ q: `Diberi ${d.prop}, dengan ${d.Y} = ${d.y1} apabila ${d.c1}. ${N} berkata ${d.Y} = ${d.wrong} apabila ${d.c2}. Adakah ${N} betul?` }, salah(N, d.ans, `${N} tidak mencari nilai pemalar k dahulu.`)); },
    d => ({ q: `Lengkapkan: ${d.prop}; ${d.Y} = ${d.y1} apabila ${d.c1}. Maka apabila ${d.c2}, ${d.Y} = ___` })
  ],
  cariX: [
    d => ({ q: `Diberi ${d.ayat} dan ${d.Y} = ${d.y1} apabila ${d.c1}. Cari nilai ${d.X} apabila ${d.c2}${d.pos}.` }),
    d => ({ q: `Diketahui ${d.ayat}. Jika ${d.Y} = ${d.y1} apabila ${d.c1}, hitung nilai ${d.X} apabila ${d.c2}${d.pos}.` }),
    d => ({ q: `Diberi ${d.prop} dan ${d.Y} = ${d.y1} apabila ${d.c1}. Tentukan nilai ${d.X} yang menjadikan ${d.c2}${d.pos}.` }),
    d => ({ q: `Hubungan ${d.prop} mempunyai ${d.Y} = ${d.y1} apabila ${d.c1}. Berapakah nilai ${d.X} apabila ${d.c2}${d.pos}?` })
  ],
  jadual: [
    d => ({ q: `Jadual di bawah menunjukkan nilai ${d.X} dan ${d.Y}. Tentukan sama ada ${d.Y} berubah secara langsung atau secara songsang dengan ${d.wx}. Seterusnya, tulis persamaannya.` }),
    d => ({ q: `Berdasarkan jadual di bawah, tunjukkan bahawa ${d.Y} berubah secara ${d.jenis} dengan ${d.wx}. Cari nilai pemalar k.`, ans: `${d.Y} ∝ ${d.pp}, k = ${d.k}` }),
    d => ({ q: `Jadual di bawah memberikan beberapa pasangan nilai ${d.X} dan ${d.Y}. Nyatakan hubungan antara ${d.Y} dan ${d.wx}, dan tulis persamaannya.` })
  ],
  masalah: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') }),
    d => ({ q: d.q.replace('Hitung', 'Tentukan') })
  ]
};

/* =================== penjana teras =================== */
const UB = {};
function ubPack(rel, g) {
  const T = rel.T, X = T[0].L;
  return {
    Y: rel.Y, X, ayat: rel.ayat, prop: rel.prop, eqk: rel.eq(), k: g.k,
    vars: T.map(t => t.L).join(' dan '), c1: ubVals(T, g.v1), c2: ubVals(T, g.v2), y1: g.y1, y2: g.y2
  };
}
const ubKWork = (rel, g) => [`${rel.prop} → ${rel.eq()}`, `${g.y1} = ${ubSubs(rel.T, g.v1)}`, `k = ${g.k}`];

UB.tulis = (r, sub) => {
  const rel = ubSpec(r, sub), ans = `${rel.prop}; ${rel.eq()}`;
  return GEN_LQ('tulis', { ayat: rel.ayat, prop: rel.prop, eqk: rel.eq(), ans, work: [`“${rel.ayat}” ditulis ${rel.prop}.`, `Gantikan ∝ dengan “= k ×”: ${rel.eq()}, k ialah pemalar.`] });
};
UB.cariK = (r, sub) => {
  const rel = ubSpec(r, sub), g = ubGen(r, rel.T), d = ubPack(rel, g);
  d.ans = rel.eq(g.k); d.work = ubKWork(rel, g).concat([`Maka ${rel.eq(g.k)}`]);
  return GEN_LQ('cariK', d);
};
UB.cariY = (r, sub) => {
  const rel = ubSpec(r, sub), g = ubGen(r, rel.T), d = ubPack(rel, g);
  d.ans = `${rel.Y} = ${g.y2}`;
  const kk = Math.ceil(g.k); d.wrong = g.y2 + kk === g.y1 ? g.y2 + 1 : g.y2 + kk;
  d.work = ubKWork(rel, g).concat([`${rel.eq(g.k)}`, `Apabila ${d.c2}: ${rel.Y} = ${ubSubs(rel.T, g.v2, g.k)} = ${g.y2}`]);
  return GEN_LQ('cariY', d);
};
UB.cariX = (r, sub) => {
  let rel; do rel = ubSpec(r, sub); while (rel.T[0].n === 3 && sub === '1.3');
  const g = ubGen(r, rel.T, { noOne: true }), t0 = rel.T[0], x2 = g.v2[0], d = ubPack(rel, g);
  const others = rel.T.slice(1).map((t, i) => `${t.L} = ${g.v2[i + 1]}`);
  d.c2 = [`${rel.Y} = ${g.y2}`].concat(others).join(' dan ');
  d.pos = t0.n === 2 ? ` (${t0.L} > 0)` : '';
  d.ans = `${t0.L} = ${x2}`;
  const shown = rel.T.map((t, i) => (i === 0 ? t.L : g.v2[i]));
  const eqSub = ubSubs(rel.T.map((t, i) => (i === 0 ? Object.assign({}, t, { n: 1 }) : t)), shown, g.k).replace(t0.L, ubPw(t0.L, t0.n));
  d.work = ubKWork(rel, g).concat([`${rel.eq(g.k)}`, `${g.y2} = ${eqSub}`].concat(t0.n === 1 ? [] : [`${ubPw(t0.L, t0.n)} = ${ubF(x2, t0.n)}`], [`${t0.L} = ${x2}`]));
  return GEN_LQ('cariX', d);
};
// jadual nilai (SVG)
function ubTable(X, Y, xs, ys) {
  const w = 110 + xs.length * 80, cell = (x, y, t, c) => `<text x="${x}" y="${y}" style="fill:var(--${c})" font-size="20" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="middle" dominant-baseline="central">${t}</text>`;
  let s = `<rect x="2" y="2" width="${w - 4}" height="116" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/><line x1="2" y1="60" x2="${w - 2}" y2="60" style="stroke:var(--bd)" stroke-width="2"/><line x1="100" y1="2" x2="100" y2="118" style="stroke:var(--bd)" stroke-width="2"/>`;
  s += cell(51, 31, X, 'tr') + cell(51, 89, Y, 'pk');
  xs.forEach((v, i) => { s += cell(140 + i * 80, 31, v, 'tx') + cell(140 + i * 80, 89, ys[i], 'tx'); });
  return `<svg viewBox="0 0 ${w} 120" style="max-width:${w}px;width:100%" role="img" aria-label="Jadual nilai ${X} dan ${Y}">${s}</svg>`;
}
UB.jadual = (r, sub) => {
  const [Y, X] = r.p(UBH2), n = r.p([1, 1, 2, 2, 'h', 3]), inv = sub === '1.2';
  let xs, k, ys;
  for (let t = 0; t < 200; t++) {
    xs = shuffleR(r, UBX[n]).slice(0, 4).sort((a, b) => a - b);
    const fs = xs.map(v => ubF(v, n));
    k = inv ? fs.reduce(ubLcm, 1) * r.i(1, 3) : r.i(2, 9);
    ys = fs.map(f => (inv ? k / f : k * f));
    if (ys.every(Number.isInteger) && Math.max(...ys) <= 1500 && k <= 600) break;
  }
  const rel = ubRel(Y, [{ L: X, n, inv }]), pp = rel.prop.split('∝ ')[1];
  const chk = xs.map((v, i) => inv ? `${ys[i]} × ${ubSb(v, n)} = ${k}` : `${ys[i]} ÷ ${ubSb(v, n)} = ${k}`).join(', ');
  const work = [inv ? `Darab ${Y} dengan ${ubPw(X, n)}: ${chk}` : `Bahagi ${Y} dengan ${ubPw(X, n)}: ${chk}`, `Nilai ${inv ? Y + ubPw(X, n) : Y + '/' + ubPw(X, n)} sentiasa ${k}, maka ${rel.prop}.`, rel.eq(k)];
  return GEN_LQ('jadual', { X, Y, wx: ubW(X, n), jenis: inv ? 'songsang' : 'langsung', pp, k, ans: `${rel.prop}; ${rel.eq(k)}`, work }, { fig: ubTable(X, Y, xs, ys) });
};
function shuffleR(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- masalah harian (aras sukar) ---------- */
// [teks pengenalan, Y, unitY, terms, label pembolehubah {L: [nama, unit]}]
const UBCTX = {
  '1.1': [
    { Y: 'J', u: 'g', T: [{ L: 'p', n: 1 }], intro: 'Jisim, J g, seutas dawai berubah secara langsung dengan panjangnya, p cm.', vu: ['cm'], ask: 'jisim dawai' },
    { Y: 'd', u: 'm', T: [{ L: 't', n: 2 }], intro: 'Jarak, d m, yang dilalui oleh sebiji bola yang jatuh bebas berubah secara langsung dengan kuasa dua masa, t saat.', vu: ['saat'], ask: 'jarak yang dilalui' },
    { Y: 'H', u: 'sen', T: [{ L: 'j', n: 2 }], intro: 'Harga, H sen, sekeping biskut bulat berubah secara langsung dengan kuasa dua jejarinya, j cm.', vu: ['cm'], ask: 'harga biskut' },
    { Y: 'T', u: 'saat', T: [{ L: 'L', n: 'h' }], intro: 'Tempoh ayunan, T saat, sebuah bandul berubah secara langsung dengan punca kuasa dua panjangnya, L cm.', vu: ['cm'], ask: 'tempoh ayunan', km: 1 },
    { Y: 'V', u: 'cm³', T: [{ L: 's', n: 3 }], intro: 'Isi padu, V cm³, sebuah kubus ais berubah secara langsung dengan kuasa tiga panjang sisinya, s cm.', vu: ['cm'], ask: 'isi padu kubus' }
  ],
  '1.2': [
    { Y: 't', u: 'hari', T: [{ L: 'n', n: 1, inv: true }], intro: 'Masa, t hari, untuk menyiapkan sebuah rumah berubah secara songsang dengan bilangan pekerja, n.', vu: ['orang'], ask: 'masa yang diperlukan' },
    { Y: 't', u: 'jam', T: [{ L: 'v', n: 1, inv: true }], intro: 'Masa, t jam, bagi suatu perjalanan berubah secara songsang dengan laju purata, v km/j.', vu: ['km/j'], ask: 'masa perjalanan' },
    { Y: 'I', u: 'unit', T: [{ L: 'd', n: 2, inv: true }], intro: 'Keamatan cahaya, I unit, daripada sebuah lampu berubah secara songsang dengan kuasa dua jarak, d m, dari lampu itu.', vu: ['m'], ask: 'keamatan cahaya' },
    { Y: 'B', u: 'biji', T: [{ L: 'm', n: 1, inv: true }], intro: 'Bilangan gula-gula, B biji, yang diterima setiap murid berubah secara songsang dengan bilangan murid, m.', vu: ['orang'], ask: 'bilangan gula-gula setiap murid' }
  ],
  '1.3': [
    { Y: 'U', u: 'RM', T: [{ L: 'p', n: 1 }, { L: 'h', n: 1 }], intro: 'Jumlah upah, RM U, berubah secara langsung dengan bilangan pekerja, p, dan bilangan hari bekerja, h.', vu: ['orang', 'hari'], ask: 'jumlah upah', pre: true },
    { Y: 'V', u: 'cm³', T: [{ L: 'j', n: 2 }, { L: 't', n: 1 }], intro: 'Isi padu, V cm³, sebuah tin berubah secara langsung dengan kuasa dua jejari, j cm, dan tinggi, t cm.', vu: ['cm', 'cm'], ask: 'isi padu tin' },
    { Y: 't', u: 'jam', T: [{ L: 's', n: 1 }, { L: 'v', n: 1, inv: true }], intro: 'Masa, t jam, berubah secara langsung dengan jarak, s km, dan secara songsang dengan laju, v km/j.', vu: ['km', 'km/j'], ask: 'masa yang diambil' },
    { Y: 'F', u: 'N', T: [{ L: 'm', n: 1 }, { L: 'd', n: 2, inv: true }], intro: 'Daya, F N, berubah secara langsung dengan jisim, m kg, dan secara songsang dengan kuasa dua jarak, d m.', vu: ['kg', 'm'], ask: 'daya' }
  ]
};
const ubU = (u, v, pre) => (pre ? `${u} ${v}` : `${v} ${u}`);
UB.masalah = (r, sub, idx) => {
  const list = UBCTX[sub], c = idx == null ? r.p(list) : list[idx % list.length];
  const g = ubGen(r, c.T, { km: c.km || 4, ymax: 5000 });
  const rel = ubRel(c.Y, c.T);
  const cond = vs => c.T.map((t, i) => `${t.L} = ${vs[i]}`).join(' dan ');
  const yu = v => (c.u === 'RM' ? `RM${v}` : `${v} ${c.u}`);
  const q = `${c.intro} Diberi ${c.Y} = ${g.y1} apabila ${cond(g.v1)}. Hitung ${c.ask} apabila ${cond(g.v2)}.`;
  const work = [`${rel.prop} → ${rel.eq()}`, `${g.y1} = ${ubSubs(c.T, g.v1)} → k = ${g.k}`, rel.eq(g.k), `${c.Y} = ${ubSubs(c.T, g.v2, g.k)} = ${g.y2}`];
  return GEN_LQ('masalah', { q, ans: yu(g.y2), work });
};

/* =================== GEN: Latihan Kelas =================== */
const ubSubGen = sub => ({
  m: [() => UB.tulis(ubRG, sub), () => UB.cariK(ubRG, sub), () => UB.cariY(ubRG, sub)],
  s: sub === '1.3' ? [() => UB.cariY(ubRG, sub), () => UB.cariX(ubRG, sub)] : [() => UB.cariX(ubRG, sub), () => UB.jadual(ubRG, sub)],
  k: [() => UB.masalah(ubRG, sub)]
});
const GEN = { '1.1': ubSubGen('1.1'), '1.2': ubSubGen('1.2'), '1.3': ubSubGen('1.3') };

/* =================== WG + WSPLAN =================== */
const WG = {};
['1.1', '1.2', '1.3'].forEach(sub => {
  const s = sub.replace('.', '');
  WG['tulis' + s] = () => UB.tulis(ubRW, sub);
  WG['cariK' + s] = () => UB.cariK(ubRW, sub);
  WG['cariY' + s] = () => UB.cariY(ubRW, sub);
  WG['cariX' + s] = () => UB.cariX(ubRW, sub);
  WG['jadual' + s] = () => UB.jadual(ubRW, sub);
  WG['masalah' + s] = i => UB.masalah(ubRW, sub, i + wri(0, 1));
});
const WSPLAN = {
  '1.1': [['m', 'tulis11', 5], ['m', 'cariK11', 6], ['m', 'cariY11', 7], ['s', 'cariX11', 5], ['s', 'jadual11', 4], ['k', 'masalah11', 3]],
  '1.2': [['m', 'tulis12', 5], ['m', 'cariK12', 6], ['m', 'cariY12', 7], ['s', 'cariX12', 5], ['s', 'jadual12', 4], ['k', 'masalah12', 3]],
  '1.3': [['m', 'tulis13', 6], ['m', 'cariK13', 6], ['m', 'cariY13', 6], ['s', 'cariY13', 4], ['s', 'cariX13', 5], ['k', 'masalah13', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function ubOpts(ans, cands) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 50; k++) { const c = ans + '′'.repeat(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
function ubOptsN(ans, cands, f) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isInteger(c) || c <= 0) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const ubMcq = (q, o) => ({ type: 'mcq', q, fig: '', opts: o.opts, c: o.c });
// variasi hubungan yang salah (untuk pilihan)
function ubWrongProps(rel) {
  const T = rel.T, out = [];
  out.push(ubRel(rel.Y, T.map(t => Object.assign({}, t, { inv: !t.inv }))).prop);
  T.forEach((t, i) => { [1, 2, 3, 'h'].forEach(n => { if (n !== t.n) out.push(ubRel(rel.Y, T.map((u, j) => (j === i ? Object.assign({}, u, { n }) : u))).prop); }); });
  if (T.length > 1) out.push(ubRel(rel.Y, T.map((t, i) => Object.assign({}, t, { inv: i === 0 ? !t.inv : t.inv }))).prop);
  return out;
}
const CQGEN = {
  tulis: sub => { const rel = ubSpec(ubRG, sub); return ubMcq(`Diberi ${rel.ayat}. Hubungan yang betul ialah`, ubOpts(rel.prop, ubWrongProps(rel))); },
  cariK: sub => { const rel = ubSpec(ubRG, sub), g = ubGen(ubRG, rel.T, { km: 3 }); const a = ubND(rel.T, g.v1); return ubMcq(`Diberi ${rel.prop} dan ${rel.Y} = ${g.y1} apabila ${ubVals(rel.T, g.v1)}. Cari nilai k.`, ubOptsN(g.k, [g.y1 * a.N / a.D, g.y1 * a.N, g.y1 * a.D, g.k * 2, g.y1], v => `k = ${v}`)); },
  cariY: sub => { const rel = ubSpec(ubRG, sub), g = ubGen(ubRG, rel.T, { km: 3 }); return ubMcq(`Diberi ${rel.prop} dan ${rel.Y} = ${g.y1} apabila ${ubVals(rel.T, g.v1)}. Cari ${rel.Y} apabila ${ubVals(rel.T, g.v2)}.`, ubOptsN(g.y2, [g.y2 * 2, g.y1 + g.k, Math.round(g.y2 / 2), g.y2 + g.k, g.y1 * g.v2[0]], v => `${rel.Y} = ${v}`)); }
};
const CQT = { langsung: 'Ubahan langsung', songsang: 'Ubahan songsang', bergabung: 'Ubahan bergabung' };
const UBCQSUB = { langsung: '1.1', songsang: '1.2', bergabung: '1.3' };
function ubCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), sub = UBCQSUB[ty] || '1.1';
  const kinds = ['tulis', 'cariK', 'cariY'], k = L === 0 ? (Math.random() < .6 ? 0 : 1) : Math.random() < .7 ? L : L - 1;
  UB_FRAC = L > 0; // aras mudah (game): k integer sahaja
  try { return CQGEN[kinds[k]](sub); } finally { UB_FRAC = true; }
}
function gq(level) {
  const pool = level === 0 ? ['langsung', 'langsung', 'songsang', 'bergabung'] : Object.keys(CQT);
  return ubCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => UBCQSUB[t]);
  return ubCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
