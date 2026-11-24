'use strict';
/* =================== FAKTOR DAN GANDAAN · SOALAN BAB 2 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "fg" / "FG".

const fgG = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const fgL = (a, b) => a / fgG(a, b) * b;
const fgGs = a => a.reduce(fgG), fgLs = a => a.reduce(fgL);
const fgPf = n => { const f = []; let d = 2; while (n > 1) { while (n % d === 0) { f.push(d); n /= d; } d++; } return f; };
const fgPrime = n => n > 1 && fgPf(n).length === 1;
const fgFac = n => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const fgIdx = n => { const c = {}; fgPf(n).forEach(p => c[p] = (c[p] || 0) + 1); return Object.keys(c).map(p => p + (c[p] > 1 ? String(c[p]).split('').map(d => SUP[d]).join('') : '')).join(' × '); };
const fgRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const fgRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const fgList = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1] : '' + a[0];
// nombor dengan banyak faktor (sesuai T1)
const FGN = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 75, 80, 84, 90, 96, 100];
// set untuk FSTB: [FSTB, pengganda...]
function fgSetG(r, k, big) {
  for (let t = 0; t < 300; t++) {
    const g = r.p(big ? [6, 8, 9, 10, 12, 15, 16, 18, 20, 24] : [2, 3, 4, 5, 6, 8, 9, 12, 15]), m = [];
    while (m.length < k) { const v = r.i(2, 9); if (!m.includes(v)) m.push(v); }
    if (fgGs(m) !== 1) continue;
    const ns = m.map(v => v * g);
    if (Math.max(...ns) > (big ? 240 : 150)) continue;
    return ns;
  }
  return [12, 18];
}
function fgSetL(r, k) {
  for (let t = 0; t < 300; t++) {
    const ns = []; while (ns.length < k) { const v = r.p([2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24]); if (!ns.includes(v)) ns.push(v); }
    const l = fgLs(ns);
    if (l > 360 || ns.some(v => v === l)) continue;
    return ns.sort((a, b) => a - b);
  }
  return [4, 6];
}

/* =================== QV =================== */
const QV = {
  faktor: [
    d => ({ q: `Senaraikan semua faktor bagi ${d.n}.` }),
    d => ({ q: `Tulis semua nombor bulat yang dapat membahagi ${d.n} dengan tepat.` }),
    d => ({ q: `Apakah faktor-faktor bagi ${d.n}?` }),
    d => ({ q: `${vnama()} mahu menyusun ${d.n} biji guli dalam bentuk segi empat tepat. Senaraikan semua faktor bagi ${d.n} untuk mencari susunan yang mungkin.` })
  ],
  perdana: [
    d => ({ q: `Senaraikan semua faktor perdana bagi ${d.n}.` }),
    d => ({ q: `Antara faktor bagi ${d.n}, yang manakah nombor perdana?` }),
    d => ({ q: `Nyatakan faktor perdana bagi ${d.n}.` })
  ],
  isPerdana: [
    d => ({ q: `Adakah ${d.n} nombor perdana? Beri sebab.` }),
    d => ({ q: `Tentukan sama ada ${d.n} ialah nombor perdana.` }),
    d => ({ q: `${vnama()} berkata ${d.n} ${d.claim} nombor perdana. Adakah dia betul?`, ans: d.claimOk ? `Betul. ${d.ans}` : `Tidak betul. ${d.ans}` })
  ],
  pfp: [
    d => ({ q: `Ungkapkan ${d.n} dalam bentuk pemfaktoran perdana.` }),
    d => ({ q: `Dengan melukis pokok faktor, tulis ${d.n} sebagai hasil darab faktor perdana.` }),
    d => ({ q: `Gunakan pembahagian berulang untuk mengungkapkan ${d.n} sebagai hasil darab faktor perdana.` })
  ],
  fstb: [
    d => ({ q: `Cari FSTB bagi ${d.list}.` }),
    d => ({ q: `Tentukan faktor sepunya terbesar bagi ${d.list}.` }),
    d => ({ q: `Dengan pemfaktoran perdana, cari FSTB bagi ${d.list}.` }),
    d => ({ q: `Senaraikan faktor sepunya bagi ${d.list}. Seterusnya, nyatakan FSTB.`, ans: `Faktor sepunya: ${d.common}; FSTB = ${d.g}` })
  ],
  koperdana: [
    d => ({ q: `Adakah ${d.a} dan ${d.b} nombor koperdana? Jelaskan.` }),
    d => ({ q: `Tentukan sama ada ${d.a} dan ${d.b} ialah nombor koperdana.` }),
    d => ({ q: `${vnama()} berkata ${d.a} dan ${d.b} ${d.claim} nombor koperdana. Adakah dia betul?`, ans: d.claimOk ? `Betul. ${d.why}` : `Tidak betul. ${d.why}` })
  ],
  gandaan: [
    d => ({ q: `Senaraikan ${d.k} gandaan pertama bagi ${d.n}.` }),
    d => ({ q: `Tulis ${d.k} gandaan yang pertama bagi ${d.n}.` }),
    d => ({ q: `Apakah ${d.k} gandaan pertama bagi ${d.n}?` })
  ],
  gsepunya: [
    d => ({ q: `Senaraikan tiga gandaan sepunya yang pertama bagi ${d.list}.` }),
    d => ({ q: `Tentukan tiga gandaan sepunya terkecil bagi ${d.list}.` }),
    d => ({ q: `Nyatakan tiga gandaan sepunya pertama bagi ${d.list}.` })
  ],
  gstk: [
    d => ({ q: `Cari GSTK bagi ${d.list}.` }),
    d => ({ q: `Tentukan gandaan sepunya terkecil bagi ${d.list}.` }),
    d => ({ q: `Dengan pembahagian berulang, cari GSTK bagi ${d.list}.` }),
    d => { const N = vnama(); return Object.assign({ q: `${N} berkata GSTK bagi ${d.list} ialah ${d.wrong}. Adakah ${N} betul?` }, salah(N, `GSTK = ${d.l}`, `${d.wrong} ialah hasil darab semua nombor, bukan gandaan sepunya yang terkecil.`)); }
  ],
  masalah: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Cari').replace(/\?$/, '.') : d.q })]
};

/* =================== penjana =================== */
const FG = {};
FG.faktor = r => { const n = r.p(FGN), f = fgFac(n), pr = []; f.forEach(a => { const b = n / a; if (a <= b) pr.push(`${a} × ${b}`); }); return GEN_LQ('faktor', { n, ans: f.join(', '), work: [`Pasangan faktor: ${pr.join(', ')}`, `Faktor bagi ${n}: ${f.join(', ')}`] }); };
FG.perdana = r => { const n = r.p(FGN), f = fgFac(n), p = f.filter(fgPrime); return GEN_LQ('perdana', { n, ans: p.join(', '), work: [`Faktor bagi ${n}: ${f.join(', ')}`, `Yang perdana (hanya dua faktor): ${p.join(', ')}`] }); };
FG.isPerdana = r => {
  const n = r.p([2, 9, 15, 17, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 49, 51, 53, 57, 59, 61, 87, 91, 97, 1]);
  const ok = fgPrime(n), f = fgFac(n), claimPrime = r.i(0, 1) === 1;
  const ans = n === 1 ? '1 bukan nombor perdana kerana hanya mempunyai satu faktor.' : ok ? `${n} ialah nombor perdana kerana faktornya hanya 1 dan ${n}.` : `${n} bukan nombor perdana kerana faktornya ${f.join(', ')}.`;
  return GEN_LQ('isPerdana', { n, claim: claimPrime ? 'ialah' : 'bukan', claimOk: claimPrime === ok, ans, work: [`Faktor bagi ${n}: ${f.join(', ')}`, ans] });
};
FG.pfp = r => { const n = r.p([24, 36, 40, 45, 48, 60, 72, 84, 90, 96, 100, 108, 120, 126, 135, 144, 150, 168, 180, 196, 210, 225, 252]); const f = fgPf(n);
  const steps = []; let v = n; f.forEach(p => { steps.push(`${v} ÷ ${p} = ${v / p}`); v /= p; });
  return GEN_LQ('pfp', { n, ans: `${n} = ${f.join(' × ')} = ${fgIdx(n)}`, work: steps.concat([`${n} = ${f.join(' × ')}`]) }); };
FG.fstb = (r, k) => {
  const ns = fgSetG(r, k || r.p([2, 2, 3])), g = fgGs(ns), list = fgList(ns), common = fgFac(g).join(', ');
  return GEN_LQ('fstb', { list, g, common, ans: `FSTB = ${g}`, work: ns.map(v => `${v} = ${fgPf(v).join(' × ')}`).concat([`Faktor perdana sepunya didarab: FSTB = ${fgPf(g).length > 1 ? fgPf(g).join(' × ') + ' = ' : ''}${g}`]) });
};
FG.koperdana = r => {
  const pairs = [[8, 15], [9, 10], [14, 25], [16, 21], [12, 35], [27, 32], [6, 9], [12, 18], [14, 21], [15, 25], [20, 28], [9, 16], [11, 33], [10, 27]];
  const [a, b] = r.p(pairs), g = fgG(a, b), ok = g === 1, claimYes = r.i(0, 1) === 1;
  const ans = ok ? `Ya. Faktor sepunya bagi ${a} dan ${b} hanyalah 1.` : `Bukan. ${a} dan ${b} mempunyai faktor sepunya ${fgFac(g).join(', ')}.`;
  return GEN_LQ('koperdana', { a, b, claim: claimYes ? 'ialah' : 'bukan', claimOk: claimYes === ok, ans, why: ok ? `Faktor sepunya bagi ${a} dan ${b} hanyalah 1, maka nombor itu koperdana.` : `${a} dan ${b} mempunyai faktor sepunya ${fgFac(g).join(', ')}, maka bukan koperdana.`, work: [`Faktor ${a}: ${fgFac(a).join(', ')}`, `Faktor ${b}: ${fgFac(b).join(', ')}`, `FSTB = ${g}`] });
};
FG.gandaan = r => { const n = r.i(3, 25), k = r.p([5, 6]); const m = []; for (let i = 1; i <= k; i++) m.push(n * i); return GEN_LQ('gandaan', { n, k, ans: m.join(', '), work: m.map((v, i) => `${n} × ${i + 1} = ${v}`).slice(0, 3).concat(['…']) }); };
FG.gsepunya = r => { const ns = fgSetL(r, 2), l = fgLs(ns); return GEN_LQ('gsepunya', { list: fgList(ns), ans: `${l}, ${2 * l}, ${3 * l}`, work: [`GSTK bagi ${fgList(ns)} = ${l}`, `Gandaan sepunya ialah gandaan bagi GSTK: ${l}, ${2 * l}, ${3 * l}, …`] }); };
FG.gstk = (r, k) => {
  const ns = fgSetL(r, k || r.p([2, 2, 3])), l = fgLs(ns), prod = ns.reduce((a, b) => a * b, 1);
  return GEN_LQ('gstk', { list: fgList(ns), l, wrong: prod === l ? l * 2 : prod, ans: `GSTK = ${l}`, work: ns.map(v => `${v} = ${fgPf(v).join(' × ')}`).concat([`Ambil setiap faktor perdana dengan bilangan terbanyak: GSTK = ${fgIdx(l)} = ${l}`]) });
};
const FGRM = v => 'RM' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
FG.mG = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { const ns = fgSetG(r, 3, 1), g = fgGs(ns); return GEN_LQ('masalah', { q: `Sebuah pusat pemindahan banjir menerima ${ns[0]} botol air, ${ns[1]} bungkus roti dan ${ns[2]} tin sardin. Semua barang itu dibahagikan sama rata ke dalam beg bantuan tanpa baki. Berapakah bilangan beg maksimum yang boleh disediakan?`, ans: `${g} beg (setiap beg: ${ns[0] / g} botol air, ${ns[1] / g} roti, ${ns[2] / g} tin sardin)`, work: [`Bilangan beg maksimum = FSTB bagi ${fgList(ns)}`, `FSTB = ${g}`, `${ns[0]} ÷ ${g} = ${ns[0] / g}, ${ns[1]} ÷ ${g} = ${ns[1] / g}, ${ns[2]} ÷ ${g} = ${ns[2] / g}`] }); }
  if (k === 1) { const ns = fgSetG(r, 2, 1), g = fgGs(ns), [a, b] = ns; return GEN_LQ('masalah', { q: `Sebidang tanah berbentuk segi empat tepat berukuran ${a} m × ${b} m akan dibahagikan kepada petak segi empat sama yang sama besar untuk menanam sayur, tanpa lebihan tanah. Berapakah panjang sisi terbesar setiap petak, dan berapa petak yang terhasil?`, ans: `${g} m; ${(a / g) * (b / g)} petak`, work: [`Sisi terbesar = FSTB bagi ${a} dan ${b} = ${g} m`, `Petak = (${a} ÷ ${g}) × (${b} ÷ ${g}) = ${a / g} × ${b / g} = ${(a / g) * (b / g)}`] }); }
  if (k === 2) { const ns = fgSetG(r, 2, 1), g = fgGs(ns); return GEN_LQ('masalah', { q: `Kelab sukan mempunyai ${ns[0]} ahli lelaki dan ${ns[1]} ahli perempuan. Mereka dibahagikan kepada beberapa kumpulan dengan bilangan ahli lelaki yang sama dan bilangan ahli perempuan yang sama dalam setiap kumpulan. Berapakah bilangan kumpulan terbanyak yang boleh dibentuk?`, ans: `${g} kumpulan`, work: [`Bilangan kumpulan terbanyak = FSTB bagi ${ns[0]} dan ${ns[1]}`, `FSTB = ${g}`, `Setiap kumpulan: ${ns[0] / g} lelaki dan ${ns[1] / g} perempuan`] }); }
  const ns = fgSetG(r, 2), g = fgGs(ns); const a = ns[0] * 10, b = ns[1] * 10, G = g * 10;
  return GEN_LQ('masalah', { q: `Persatuan Matematik mempunyai dua tabung derma: ${FGRM(a)} dan ${FGRM(b)}. Wang itu akan dimasukkan ke dalam sampul dengan jumlah wang yang sama dalam setiap sampul, tanpa baki. Berapakah jumlah wang terbesar dalam setiap sampul?`, ans: FGRM(G), work: [`FSTB bagi ${a} dan ${b}`, `${a} = ${fgPf(a).join(' × ')}; ${b} = ${fgPf(b).join(' × ')}`, `FSTB = ${G}`] });
};
const fgTime = (h, m) => { const t = h * 60 + m; return `${Math.floor(t / 60) % 24 > 12 ? Math.floor(t / 60) % 24 - 12 : Math.floor(t / 60) % 24}:${String(t % 60).padStart(2, '0')} ${Math.floor(t / 60) % 24 < 12 ? 'pagi' : Math.floor(t / 60) % 24 < 14 ? 'tengah hari' : Math.floor(t / 60) % 24 < 19 ? 'petang' : 'malam'}`; };
FG.mL = (r, idx) => {
  const k = idx == null ? r.i(0, 3) : idx % 4;
  if (k === 0) { let a, b, l; do { a = r.p([10, 12, 15, 18, 20, 24, 30]); b = r.p([8, 12, 15, 16, 20, 25, 40, 45]); l = fgL(a, b); } while (a === b || l > 120 || l === a || l === b); const h = r.i(6, 8); return GEN_LQ('masalah', { q: `Bas A bertolak dari sebuah stesen setiap ${a} minit dan Bas B setiap ${b} minit. Kedua-dua bas bertolak bersama pada ${h}:00 pagi. Pada pukul berapakah kedua-dua bas bertolak bersama sekali lagi?`, ans: fgTime(h, l), work: [`Masa bersama semula = GSTK bagi ${a} dan ${b} = ${l} minit`, `${h}:00 pagi + ${l} minit = ${fgTime(h, l)}`] }); }
  if (k === 1) { const ns = fgSetL(r, 3), l = fgLs(ns); return GEN_LQ('masalah', { q: `Tiga lampu berkelip setiap ${ns[0]} saat, ${ns[1]} saat dan ${ns[2]} saat. Ketiga-tiga lampu berkelip serentak pada mulanya. Selepas berapa saat lampu-lampu itu berkelip serentak sekali lagi?`, ans: `${l} saat`, work: [`GSTK bagi ${fgList(ns)}`, ...ns.map(v => `${v} = ${fgPf(v).join(' × ')}`), `GSTK = ${l}`] }); }
  if (k === 2) { const ns = fgSetL(r, 2), l = fgLs(ns); return GEN_LQ('masalah', { q: `Pinggan kertas dijual dalam pek ${ns[0]} keping dan cawan kertas dalam pek ${ns[1]} biji. Encik Lim mahu membeli bilangan pinggan dan cawan yang sama. Berapakah bilangan pinggan paling sedikit yang perlu dibeli, dan berapa pek pinggan itu?`, ans: `${l} keping; ${l / ns[0]} pek pinggan (dan ${l / ns[1]} pek cawan)`, work: [`Bilangan sama paling sedikit = GSTK bagi ${ns[0]} dan ${ns[1]} = ${l}`, `Pek pinggan = ${l} ÷ ${ns[0]} = ${l / ns[0]}; pek cawan = ${l} ÷ ${ns[1]} = ${l / ns[1]}`] }); }
  const ns = fgSetL(r, 2), l = fgLs(ns), g = fgG(ns[0], ns[1]);
  return GEN_LQ('masalah', { q: `Diberi dua nombor ${ns[0]} dan ${ns[1]}. Cari FSTB dan GSTK, kemudian tunjukkan bahawa FSTB × GSTK sama dengan hasil darab kedua-dua nombor itu.`, ans: `FSTB = ${g}, GSTK = ${l}; ${g} × ${l} = ${ns[0]} × ${ns[1]} = ${g * l}`, work: [`${ns[0]} = ${fgPf(ns[0]).join(' × ')}; ${ns[1]} = ${fgPf(ns[1]).join(' × ')}`, `FSTB = ${g}; GSTK = ${l}`, `${g} × ${l} = ${g * l} dan ${ns[0]} × ${ns[1]} = ${ns[0] * ns[1]}`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '2.1': { m: [() => FG.faktor(fgRG), () => FG.perdana(fgRG), () => FG.isPerdana(fgRG), () => FG.pfp(fgRG)], s: [() => FG.fstb(fgRG), () => FG.koperdana(fgRG)], k: [() => FG.mG(fgRG)] },
  '2.2': { m: [() => FG.gandaan(fgRG), () => FG.gsepunya(fgRG)], s: [() => FG.gstk(fgRG, 2), () => FG.gstk(fgRG, 3)], k: [() => FG.mL(fgRG)] }
};
const WG = {
  faktor: () => FG.faktor(fgRW), perdana: () => FG.perdana(fgRW), isPerdana: () => FG.isPerdana(fgRW), pfp: () => FG.pfp(fgRW),
  fstb2: () => FG.fstb(fgRW, 2), fstb3: () => FG.fstb(fgRW, 3), koperdana: () => FG.koperdana(fgRW), mG: i => FG.mG(fgRW, i),
  gandaan: () => FG.gandaan(fgRW), gsepunya: () => FG.gsepunya(fgRW), gstk2: () => FG.gstk(fgRW, 2), gstk3: () => FG.gstk(fgRW, 3), mL: i => FG.mL(fgRW, i)
};
const WSPLAN = {
  '2.1': [['m', 'faktor', 5], ['m', 'perdana', 4], ['m', 'isPerdana', 4], ['m', 'pfp', 5], ['s', 'fstb2', 4], ['s', 'fstb3', 3], ['s', 'koperdana', 2], ['k', 'mG', 3]],
  '2.2': [['m', 'gandaan', 6], ['m', 'gsepunya', 6], ['m', 'gstk2', 6], ['s', 'gstk2', 3], ['s', 'gstk3', 6], ['k', 'mL', 3]]
};

/* =================== GAMES =================== */
function fgMcq(q, ans, wrongs) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c) || c === 'NaN' || c === '0') continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 40; k++) { const c = String(+ans + k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  faktor: L => {
    const n = pick(FGN), f = fgFac(n);
    if (L === 0) { const non = []; for (let v = 2; v < n && non.length < 6; v++) if (n % v) non.push(v); return fgMcq(`Antara berikut, yang manakah faktor bagi ${n}?`, pick(f.slice(1, -1)), shuffle(non)); }
    if (L === 1) { const p = pick([2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]); return fgMcq('Antara berikut, yang manakah nombor perdana?', p, [1, 9, 15, 21, 27, 33, 39, 49, 51, 57, 91]); }
    const v = pick([36, 48, 60, 72, 84, 90, 120]); return fgMcq(`Pemfaktoran perdana bagi ${v} ialah`, fgIdx(v), [fgIdx(v * 2), fgIdx(v / 2), fgIdx(v / 3 * 2), fgIdx(v * 3)].filter(x => x !== fgIdx(v)));
  },
  fstb: L => { const ns = fgSetG(fgRG, L === 2 ? 3 : 2), g = fgGs(ns); return fgMcq(`FSTB bagi ${fgList(ns)} ialah`, g, [g * 2, g / 2, fgLs(ns), Math.min(...ns), g + 1].filter(Number.isInteger)); },
  gstk: L => { const ns = fgSetL(fgRG, L === 2 ? 3 : 2), l = fgLs(ns); if (L === 0) { const n = ri(3, 12), k = ri(4, 9); return fgMcq(`Antara berikut, yang manakah gandaan bagi ${n}?`, n * k, [n * k + 1, n * k - 1, n * k + 2, n * k - 2, n + k + 1].filter(v => v % n)); } return fgMcq(`GSTK bagi ${fgList(ns)} ialah`, l, [l * 2, ns.reduce((a, b) => a * b, 1), fgGs(ns), l / 2].filter(Number.isInteger)); }
};
const CQT = { faktor: 'Faktor & nombor perdana', fstb: 'FSTB', gstk: 'Gandaan & GSTK' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
