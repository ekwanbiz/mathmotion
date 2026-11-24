'use strict';
/* =================== SERAKAN TERKUMPUL · SOALAN BAB 7 (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Semua nama global berawalan "st" / "ST".

/* =================== pembantu =================== */
const stRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const stRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const stN = v => { let x = Math.round(v * 100) / 100; if (Object.is(x, -0)) x = 0; return String(x); };
const stN2 = v => { const x = Math.round(v * 100) / 100; return (Object.is(x, -0) ? 0 : x).toFixed(2); };
const STCTX = [
  { v: 'Jisim', u: 'kg', o: 'murid', a: 'jisim' },
  { v: 'Markah', u: 'markah', o: 'murid', a: 'markah' },
  { v: 'Tinggi', u: 'cm', o: 'anak pokok', a: 'tinggi' },
  { v: 'Masa', u: 'minit', o: 'peserta', a: 'masa' },
  { v: 'Laju', u: 'km/j', o: 'kenderaan', a: 'laju' },
  { v: 'Panjang', u: 'cm', o: 'ikan', a: 'panjang' }
];
// cond: 'q' (n/4 & 3n/4 pada sempadan), 'p' (ada persentil integer)
function stData(r, cond) {
  for (let t = 0; t < 4000; t++) {
    const w = r.p([5, 10]), K = r.i(5, 6);
    const lo0 = w === 5 ? 5 * r.i(0, 8) + 1 : 10 * r.i(1, 5);
    const f = Array.from({ length: K }, () => r.i(1, 12));
    const n = f.reduce((a, b) => a + b, 0);
    if (n > 48 || n < 16) continue;
    const cum = f.map((_, i) => f.slice(0, i + 1).reduce((a, b) => a + b, 0));
    if (cond === 'q' && !(n % 4 === 0 && cum.includes(n / 4) && cum.includes(3 * n / 4))) continue;
    if (cond === 'p' && !cum.slice(0, -1).some(c => (100 * c) % n === 0)) continue;
    const lo = f.map((_, i) => lo0 + i * w), hi = lo.map(l => l + w - 1);
    const d = { w, K, f, n, cum, lo, hi, lb: lo.map(l => l - 0.5), ub: hi.map(h => h + 0.5), mid: lo.map((l, i) => (l + hi[i]) / 2), c: r.p(STCTX) };
    d.lab = lo.map((l, i) => `${l} – ${hi[i]}`);
    d.sfx = d.f.reduce((a, x, i) => a + x * d.mid[i], 0);
    d.sfx2 = d.f.reduce((a, x, i) => a + x * d.mid[i] * d.mid[i], 0);
    d.mean = d.sfx / n; d.vr = d.sfx2 / n - d.mean * d.mean; d.sd = Math.sqrt(d.vr);
    return d;
  }
  return null;
}
/* ---------- rajah: jadual kekerapan (SVG) ---------- */
function stTable(d, cumCol) {
  const cw = 92, x0 = 150, w = x0 + d.K * cw + 6, rows = cumCol ? 3 : 2, h = rows * 50 + 4;
  const tx = (x, y, t, c, s) => `<text x="${x}" y="${y}" style="fill:var(--${c})" font-size="${s || 17}" font-weight="700" font-family="Inter, sans-serif" text-anchor="middle" dominant-baseline="central">${t}</text>`;
  let s = `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  for (let i = 1; i < rows; i++) s += `<line x1="2" y1="${2 + i * 50}" x2="${w - 2}" y2="${2 + i * 50}" style="stroke:var(--bd)" stroke-width="2"/>`;
  for (let i = 0; i < d.K; i++) s += `<line x1="${x0 + i * cw}" y1="2" x2="${x0 + i * cw}" y2="${h - 2}" style="stroke:var(--bd)" stroke-width="${i ? 1 : 2}"/>`;
  s += tx(x0 / 2, 27, `${d.c.v} (${d.c.u})`, 'tr', 15) + tx(x0 / 2, 77, 'Kekerapan', 'pk', 15);
  if (cumCol) s += tx(x0 / 2, 127, 'K. longgokan', 'am', 15);
  d.lab.forEach((t, i) => { const x = x0 + i * cw + cw / 2; s += tx(x, 27, t, 'tx', 16) + tx(x, 77, d.f[i], 'tx'); if (cumCol) s += tx(x, 127, cumCol === 'q' && i === cumCol.i ? '?' : d.cum[i], 'tx'); });
  return `<svg viewBox="0 0 ${w} ${h}" style="max-width:${w}px;width:100%" role="img" aria-label="Jadual kekerapan">${s}</svg>`;
}
/* ---------- rajah: ogif (SVG) ---------- */
function stOgif(d, guides) {
  const W = 520, H = 340, X0 = 58, X1 = 500, Y0 = 290, Y1 = 24;
  const xa = d.lb[0], xb = d.ub[d.K - 1];
  const r1 = v => Math.round(v * 10) / 10, gx = v => r1(X0 + (v - xa) / (xb - xa) * (X1 - X0)), gy = v => r1(Y0 - v / d.n * (Y0 - Y1));
  const step = d.n <= 24 ? 2 : 4;
  let s = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="14" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  for (let v = 0; v <= d.n; v++) s += `<line x1="${X0}" y1="${gy(v)}" x2="${X1}" y2="${gy(v)}" style="stroke:var(--bd)" stroke-width="${v % step ? 0.6 : 1.4}"/>`;
  for (let v = 0; v <= d.n; v += step) s += `<text x="${X0 - 8}" y="${gy(v)}" style="fill:var(--mu)" font-size="13" font-weight="700" font-family="Inter, sans-serif" text-anchor="end" dominant-baseline="central">${v}</text>`;
  const xs = [xa].concat(d.ub);
  xs.forEach(v => { s += `<line x1="${gx(v)}" y1="${Y1}" x2="${gx(v)}" y2="${Y0}" style="stroke:var(--bd)" stroke-width="1"/><text x="${gx(v)}" y="${Y0 + 17}" style="fill:var(--mu)" font-size="13" font-weight="700" font-family="Inter, sans-serif" text-anchor="middle">${stN(v)}</text>`; });
  s += `<line x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y0}" style="stroke:var(--mu)" stroke-width="2.5"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 6}" style="stroke:var(--mu)" stroke-width="2.5"/>`;
  const pts = [[xa, 0]].concat(d.ub.map((u, i) => [u, d.cum[i]]));
  s += `<path d="M${pts.map(p => gx(p[0]).toFixed(1) + ' ' + gy(p[1]).toFixed(1)).join(' L')}" fill="none" style="stroke:var(--pk)" stroke-width="3.5" stroke-linejoin="round"/>`;
  pts.forEach(p => { s += `<circle cx="${gx(p[0]).toFixed(1)}" cy="${gy(p[1]).toFixed(1)}" r="4.5" style="fill:var(--pk)"/>`; });
  (guides || []).forEach(([k]) => { s += `<line x1="${X0}" y1="${gy(k)}" x2="${X1}" y2="${gy(k)}" style="stroke:var(--am)" stroke-width="2" stroke-dasharray="6 5"/>`; });
  s += `<text x="${X1}" y="${H - 8}" style="fill:var(--mu)" font-size="13" font-weight="700" font-family="Inter, sans-serif" text-anchor="end">${d.c.v} (${d.c.u})</text><text x="${X0 + 6}" y="${Y1 - 10}" style="fill:var(--mu)" font-size="13" font-weight="700" font-family="Inter, sans-serif">Kekerapan longgokan</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px;width:100%" role="img" aria-label="Ogif">${s}</svg>`;
}

/* =================== QV: cara tanya =================== */
const QV = {
  titik: [
    d => ({ q: `Cari titik tengah bagi selang kelas ${d.kl}.` }),
    d => ({ q: `Suatu data terkumpul mempunyai selang kelas ${d.kl}. Hitung titik tengah kelas itu.` }),
    d => ({ q: `Tentukan titik tengah kelas ${d.kl} dalam jadual ${d.a} ${d.o}.` }),
    d => ({ q: `Berapakah titik tengah bagi kelas ${d.kl}?` })
  ],
  sempadan: [
    d => ({ q: `Bagi selang kelas ${d.kl}, nyatakan sempadan bawah, sempadan atas dan saiz selang kelas.` }),
    d => ({ q: `Suatu jadual kekerapan mempunyai kelas ${d.kl}. Cari sempadan bawah, sempadan atas dan saiz selang kelasnya.` }),
    d => ({ q: `Tentukan sempadan kelas dan saiz selang kelas bagi kelas ${d.kl}.` })
  ],
  longgokan: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Cari kekerapan longgokan bagi kelas ${d.kl}.` }),
    d => ({ q: `Berdasarkan jadual kekerapan, hitung kekerapan longgokan kelas ${d.kl}.` }),
    d => ({ q: `Berapakah bilangan ${d.o} yang ${d.a}nya ${d.u0} hingga ${d.kh}? Gunakan jadual.` }),
    d => ({ q: `Lengkapkan: kekerapan longgokan bagi kelas ${d.kl} ialah ___ (rujuk jadual).` })
  ],
  ogifTitik: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Senaraikan semua titik yang perlu diplot untuk melukis ogif.` }),
    d => ({ q: `Untuk melukis ogif bagi data dalam jadual, tuliskan koordinat (sempadan atas, kekerapan longgokan) yang perlu diplot.` }),
    d => ({ q: `Aisyah mahu melukis ogif bagi data dalam jadual. Nyatakan titik-titik yang perlu diplotnya, termasuk titik permulaan.` })
  ],
  poligon: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Senaraikan titik-titik bagi poligon kekerapan, termasuk kelas berkekerapan sifar di kedua-dua hujung.` }),
    d => ({ q: `Tuliskan koordinat (titik tengah, kekerapan) yang perlu diplot untuk melukis poligon kekerapan bagi data dalam jadual.` }),
    d => ({ q: `Ravi mahu melukis poligon kekerapan bagi data dalam jadual. Nyatakan semua titik yang perlu diplot.` })
  ],
  bacaOgif: [
    d => ({ q: `Ogif menunjukkan taburan ${d.a} ${d.n} ${d.o}. Berapakah bilangan ${d.o} yang ${d.a}nya kurang daripada ${d.x} ${d.u}? Berapakah pula yang lebih daripada ${d.x} ${d.u}?` }),
    d => ({ q: `Berdasarkan ogif, cari bilangan ${d.o} dengan ${d.a} melebihi ${d.x} ${d.u}.`, ans: d.ansM }),
    d => ({ q: `Daripada ogif ${d.a} ${d.n} ${d.o}, hitung peratus ${d.o} yang ${d.a}nya kurang daripada ${d.x} ${d.u}.`, ans: d.ansP })
  ],
  julat: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Hitung julat data itu.` }),
    d => ({ q: `Berdasarkan jadual kekerapan, cari julat ${d.a} ${d.o}.` }),
    d => ({ q: `Cari julat bagi data terkumpul dalam jadual.` }),
    d => ({ q: `Siti berkata julat data dalam jadual ialah ${d.wrong}. Adakah Siti betul?`, ans: `Tidak betul. Julat = ${d.ans}`, pre: ['Julat data terkumpul menggunakan titik tengah, bukan had kelas.'] })
  ],
  min: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Hitung min data itu.` }),
    d => ({ q: `Hitung min ${d.a} ${d.o} berdasarkan jadual. Beri jawapan betul kepada dua tempat perpuluhan.` }),
    d => ({ q: `Dengan menggunakan titik tengah, cari min bagi data terkumpul dalam jadual.` })
  ],
  jak: [
    d => ({ q: `Ogif menunjukkan taburan ${d.a} ${d.n} ${d.o}. Cari kuartil pertama, kuartil ketiga dan julat antara kuartil.` }),
    d => ({ q: `Berdasarkan ogif, hitung julat antara kuartil bagi ${d.a} ${d.o}.`, ans: d.ansJ }),
    d => ({ q: `Gunakan ogif untuk mencari Q₁ dan Q₃. Seterusnya, cari julat antara kuartil.` }),
    d => ({ q: `Daripada ogif ${d.a} ${d.n} ${d.o}, tentukan julat antara kuartil.`, ans: d.ansJ })
  ],
  varians: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Hitung varians data itu.` }),
    d => ({ q: `Hitung varians bagi data terkumpul dalam jadual. Beri jawapan betul kepada dua tempat perpuluhan.` }),
    d => ({ q: `Dengan menggunakan rumus σ² = Σfx²/Σf − x̄², cari varians ${d.a} ${d.o}.` })
  ],
  sisihan: [
    d => ({ q: `Jadual menunjukkan taburan ${d.a} ${d.n} ${d.o}. Hitung sisihan piawai data itu.` }),
    d => ({ q: `Cari sisihan piawai bagi data terkumpul dalam jadual, betul kepada dua tempat perpuluhan.` }),
    d => ({ q: `Hitung sisihan piawai ${d.a} ${d.o} berdasarkan jadual kekerapan.` })
  ],
  persentil: [
    d => ({ q: `Ogif menunjukkan taburan ${d.a} ${d.n} ${d.o}. Cari persentil ke-${d.k}, P${d.ks}, dan tafsirkan nilai itu.` }),
    d => ({ q: `Berdasarkan ogif, tentukan nilai P${d.ks}. Apakah maksud nilai ini?` }),
    d => ({ q: `Daripada ogif ${d.a} ${d.n} ${d.o}, cari persentil ke-${d.k} dan terangkan maksudnya.` })
  ]
};

/* =================== penjana teras =================== */
const ST = {};
const stBase = d => ({ a: d.c.a, o: d.c.o, u: d.c.u, n: d.n });
const stSub = n => String(n).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[c]).join('');
ST.titik = r => {
  const d = stData(r), i = r.i(0, d.K - 1);
  return GEN_LQ('titik', Object.assign(stBase(d), { kl: d.lab[i], ans: stN(d.mid[i]), work: [`Titik tengah = (had bawah + had atas) ÷ 2`, `= (${d.lo[i]} + ${d.hi[i]}) ÷ 2 = ${stN(d.mid[i])}`] }));
};
ST.sempadan = r => {
  const d = stData(r), i = r.i(0, d.K - 1);
  return GEN_LQ('sempadan', Object.assign(stBase(d), { kl: d.lab[i], ans: `sempadan bawah = ${stN(d.lb[i])}, sempadan atas = ${stN(d.ub[i])}, saiz selang kelas = ${d.w}`, work: [`Sempadan bawah = ${d.lo[i]} − 0.5 = ${stN(d.lb[i])}`, `Sempadan atas = ${d.hi[i]} + 0.5 = ${stN(d.ub[i])}`, `Saiz selang kelas = ${stN(d.ub[i])} − ${stN(d.lb[i])} = ${d.w}`] }));
};
ST.longgokan = r => {
  const d = stData(r), i = r.i(1, d.K - 1);
  return GEN_LQ('longgokan', Object.assign(stBase(d), { kl: d.lab[i], u0: d.lo[0], kh: d.hi[i], ans: String(d.cum[i]), work: [`Kekerapan longgokan = ${d.f.slice(0, i + 1).join(' + ')} = ${d.cum[i]}`] }), { fig: stTable(d) });
};
ST.ogifTitik = r => {
  const d = stData(r), pts = [`(${stN(d.lb[0])}, 0)`].concat(d.ub.map((u, i) => `(${stN(u)}, ${d.cum[i]})`));
  return GEN_LQ('ogifTitik', Object.assign(stBase(d), { ans: pts.join(', '), work: [`Kekerapan longgokan: ${d.cum.join(', ')}`, `Sempadan atas: ${d.ub.map(stN).join(', ')}`, `Titik permulaan ialah sempadan bawah kelas pertama dengan kekerapan longgokan 0: (${stN(d.lb[0])}, 0)`] }), { fig: stTable(d) });
};
ST.poligon = r => {
  const d = stData(r), a = d.mid[0] - d.w, b = d.mid[d.K - 1] + d.w;
  const pts = [`(${stN(a)}, 0)`].concat(d.mid.map((m, i) => `(${stN(m)}, ${d.f[i]})`)).concat([`(${stN(b)}, 0)`]);
  return GEN_LQ('poligon', Object.assign(stBase(d), { ans: pts.join(', '), work: [`Titik tengah: ${d.mid.map(stN).join(', ')}`, `Tambah kelas sifar: titik tengah ${stN(d.mid[0])} − ${d.w} = ${stN(a)} dan ${stN(d.mid[d.K - 1])} + ${d.w} = ${stN(b)}`] }), { fig: stTable(d) });
};
ST.bacaOgif = r => {
  const d = stData(r), i = r.i(1, d.K - 2), x = d.ub[i], kc = d.cum[i], lb = d.n - kc;
  const pc = stN(kc / d.n * 100);
  return GEN_LQ('bacaOgif', Object.assign(stBase(d), { x: stN(x), ans: `kurang daripada ${stN(x)}: ${kc}; lebih daripada ${stN(x)}: ${lb}`, ansM: String(lb), ansP: `${pc}%`, work: [`Daripada ogif, kekerapan longgokan pada ${stN(x)} ialah ${kc}.`, `Lebih daripada ${stN(x)} = ${d.n} − ${kc} = ${lb}`, `Peratus kurang daripada ${stN(x)} = ${kc}/${d.n} × 100% = ${pc}%`] }), { fig: stOgif(d) });
};
ST.julat = r => {
  const d = stData(r), J = d.mid[d.K - 1] - d.mid[0];
  return GEN_LQ('julat', Object.assign(stBase(d), { ans: stN(J), wrong: stN(d.hi[d.K - 1] - d.lo[0]), work: [`Titik tengah kelas tertinggi = ${stN(d.mid[d.K - 1])}`, `Titik tengah kelas terendah = ${stN(d.mid[0])}`, `Julat = ${stN(d.mid[d.K - 1])} − ${stN(d.mid[0])} = ${stN(J)}`] }), { fig: stTable(d) });
};
ST.min = r => {
  const d = stData(r);
  return GEN_LQ('min', Object.assign(stBase(d), { ans: `x̄ = ${stN(d.mean)}`, work: [`Titik tengah, x: ${d.mid.map(stN).join(', ')}`, `Σfx = ${stN(d.sfx)}, Σf = ${d.n}`, `x̄ = ${stN(d.sfx)} ÷ ${d.n} = ${stN(d.mean)}`] }), { fig: stTable(d) });
};
ST.jak = r => {
  const d = stData(r, 'q'), q1 = d.ub[d.cum.indexOf(d.n / 4)], q3 = d.ub[d.cum.indexOf(3 * d.n / 4)];
  return GEN_LQ('jak', Object.assign(stBase(d), { ans: `Q₁ = ${stN(q1)}, Q₃ = ${stN(q3)}, julat antara kuartil = ${stN(q3 - q1)}`, ansJ: stN(q3 - q1), work: [`Kedudukan Q₁ = ¼ × ${d.n} = ${d.n / 4} → Q₁ = ${stN(q1)}`, `Kedudukan Q₃ = ¾ × ${d.n} = ${3 * d.n / 4} → Q₃ = ${stN(q3)}`, `Julat antara kuartil = ${stN(q3)} − ${stN(q1)} = ${stN(q3 - q1)}`] }), { fig: stOgif(d, [[d.n / 4], [3 * d.n / 4]]) });
};
const stVarWork = d => [`Σf = ${d.n}, Σfx = ${stN(d.sfx)}, Σfx² = ${stN(d.sfx2)}`, `x̄ = ${stN(d.sfx)} ÷ ${d.n} = ${stN(d.mean)}`, `σ² = ${stN(d.sfx2)}/${d.n} − (${stN(d.sfx)}/${d.n})² = ${stN2(d.vr)}`];
ST.varians = r => { const d = stData(r); return GEN_LQ('varians', Object.assign(stBase(d), { ans: `σ² = ${stN2(d.vr)}`, work: stVarWork(d) }), { fig: stTable(d) }); };
ST.sisihan = r => { const d = stData(r); return GEN_LQ('sisihan', Object.assign(stBase(d), { ans: `σ = ${stN2(d.sd)}`, work: stVarWork(d).concat([`σ = √${stN2(d.vr)} = ${stN2(d.sd)}`]) }), { fig: stTable(d) }); };
ST.persentil = r => {
  const d = stData(r, 'p'), ok = d.cum.slice(0, -1).map((c, i) => [c, i]).filter(([c]) => (100 * c) % d.n === 0), [c, i] = r.p(ok), k = 100 * c / d.n;
  return GEN_LQ('persentil', Object.assign(stBase(d), { k, ks: stSub(k), ans: `P${stSub(k)} = ${stN(d.ub[i])}; ${k}% ${d.c.o} mempunyai ${d.c.a} kurang daripada ${stN(d.ub[i])} ${d.c.u}`, work: [`Kedudukan = ${k}/100 × ${d.n} = ${c}`, `Daripada ogif, kekerapan longgokan ${c} sepadan dengan ${stN(d.ub[i])}`] }), { fig: stOgif(d, [[c]]) });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '7.1': { m: [() => ST.titik(stRG), () => ST.sempadan(stRG), () => ST.longgokan(stRG)], s: [() => ST.ogifTitik(stRG), () => ST.poligon(stRG)], k: [() => ST.bacaOgif(stRG)] },
  '7.2': { m: [() => ST.julat(stRG), () => ST.min(stRG), () => ST.jak(stRG)], s: [() => ST.varians(stRG), () => ST.sisihan(stRG)], k: [() => ST.persentil(stRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {};
['titik', 'sempadan', 'longgokan', 'ogifTitik', 'poligon', 'bacaOgif', 'julat', 'min', 'jak', 'varians', 'sisihan', 'persentil'].forEach(k => { WG[k] = () => ST[k](stRW); });
const WSPLAN = {
  '7.1': [['m', 'titik', 6], ['m', 'sempadan', 6], ['m', 'longgokan', 6], ['s', 'ogifTitik', 5], ['s', 'poligon', 4], ['k', 'bacaOgif', 3]],
  '7.2': [['m', 'julat', 6], ['m', 'min', 6], ['m', 'jak', 6], ['s', 'varians', 5], ['s', 'sisihan', 4], ['k', 'persentil', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function stOpts(ans, cands) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || c === 'NaN' || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const c = stN(parseFloat(ans) + (k % 2 ? 1 : -1) * Math.ceil(k / 2)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { type: 'mcq', fig: '', opts, c: opts.indexOf(ans) };
}
const CQGEN = {
  titik: () => { const d = stData(stRG), i = ri(0, d.K - 1); return Object.assign(stOpts(stN(d.mid[i]), [stN(d.mid[i] + 0.5), stN(d.mid[i] - 0.5), stN(d.lo[i] + d.w / 2), stN(d.hi[i] - 1)]), { q: `Titik tengah kelas ${d.lab[i]} ialah` }); },
  sempadan: () => { const d = stData(stRG), i = ri(0, d.K - 1); return Object.assign(stOpts(stN(d.ub[i]), [String(d.hi[i]), stN(d.hi[i] + 1), stN(d.lb[i]), stN(d.ub[i] + 1)]), { q: `Sempadan atas kelas ${d.lab[i]} ialah` }); },
  longgokan: () => { const d = stData(stRG), i = ri(1, d.K - 1); return Object.assign(stOpts(String(d.cum[i]), [String(d.f[i]), String(d.cum[i - 1]), String(d.cum[i] + d.f[i]), String(d.n)]), { q: `Kekerapan bagi kelas berturut-turut ialah ${d.f.join(', ')}. Kekerapan longgokan bagi kelas ke-${i + 1} ialah` }); },
  julat: () => { const d = stData(stRG), J = d.mid[d.K - 1] - d.mid[0]; return Object.assign(stOpts(stN(J), [stN(d.hi[d.K - 1] - d.lo[0]), stN(d.ub[d.K - 1] - d.lb[0]), stN(J - d.w), stN(J + d.w)]), { q: `Kelas terendah ialah ${d.lab[0]} dan kelas tertinggi ialah ${d.lab[d.K - 1]}. Julat data ialah` }); },
  jak: () => { const q1 = ri(4, 30) + 0.5, g = ri(4, 25), q3 = q1 + g; return Object.assign(stOpts(stN(g), [stN(q3 + q1), stN(g / 2), stN(q3), stN(g + 1)]), { q: `Daripada ogif, Q₁ = ${stN(q1)} dan Q₃ = ${stN(q3)}. Julat antara kuartil ialah` }); },
  varians: () => { const n = pick([10, 20, 25, 40, 50]), m = ri(5, 20), v = ri(2, 30), s2 = n * (v + m * m); return Object.assign(stOpts(String(v), [String(s2 / n), String(v + m), String(s2 / n - m), String(m * m)]), { q: `Diberi Σf = ${n}, Σfx² = ${s2} dan min x̄ = ${m}. Varians data ialah` }); },
  sisihan: () => { const s = ri(2, 12), v = s * s; return Object.assign(stOpts(String(s), [String(v), String(v * 2), String(s * 2), String(v / 2)]), { q: `Varians suatu data terkumpul ialah ${v}. Sisihan piawainya ialah` }); }
};
const CQT = { titik: 'Titik tengah', sempadan: 'Sempadan kelas', longgokan: 'Kekerapan longgokan', julat: 'Julat', jak: 'Julat antara kuartil', varians: 'Varians', sisihan: 'Sisihan piawai' };
function gq(level) {
  const pool = level === 0 ? ['titik', 'sempadan', 'longgokan', 'julat'] : level === 1 ? ['longgokan', 'julat', 'jak', 'sisihan'] : ['jak', 'varians', 'sisihan', 'julat'];
  return CQGEN[pick(pool)]();
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return CQGEN[pick(pool.length ? pool : Object.keys(CQT))]();
}
