'use strict';
/* =================== PECUT · SOALAN BAB 9 LAJU DAN PECUTAN (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pc" / "PC" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor, unit & masa =================== */
// nombor kemas: bundar 3 t.p., tiada −0, tanda tolak sebenar (−)
const pcN = x => { let v = Math.round(x * 1000) / 1000; if (v === 0) v = 0; return v < 0 ? '−' + (-v) : String(v); };
const pcU = (x, u) => `${pcN(x)} ${u}`;
const pcP = x => (x < 0 ? `(${pcN(x)})` : pcN(x));
const pcGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const pcFr = (n, d) => { const g = pcGcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : fr(n, d); };
// minit → "2 jam 30 minit"
const pcJM = m => { const h = Math.floor(m / 60), mm = m % 60; return h && mm ? `${h} jam ${mm} minit` : h ? `${h} jam` : `${mm} minit`; };
// minit → nilai jam (perpuluhan tepat jika boleh, jika tidak pecahan)
const pcJamX = m => ((m * 1000) % 60 === 0 ? pcN(m / 60) : pcFr(m, 60));
const pcIsDec = (num, den, dp) => (num * Math.pow(10, dp)) % den === 0; // num/den tepat dalam dp tempat perpuluhan
const pcClock = min => { const h = Math.floor(min / 60), mm = min % 60, sf = h < 12 ? 'pagi' : h < 13 ? 'tengah hari' : h < 19 ? 'petang' : 'malam'; return `${h > 12 ? h - 12 : h}:${String(mm).padStart(2, '0')} ${sf}`; };
// rawak: pcRG untuk Latihan Kelas / games, pcRW (berbenih) untuk Lembaran Kerja
const pcRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const pcRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const pcCap = s => s[0].toUpperCase() + s.slice(1);
const pcNama = ex => { let N, k = 0; do { N = vnama(); k++; } while (N === ex && k < 12); return N; };

/* =================== data konteks =================== */
// [Pengenalan (awal ayat), rujukan, kata kerja]
const PCSUBJ = {
  ms: [['Seorang pelari', 'pelari itu', 'berlari'], ['Seekor kuda', 'kuda itu', 'berlari'], ['Seorang penunggang basikal', 'penunggang basikal itu', 'berkayuh'], ['Sebuah kereta kawalan jauh', 'kereta kawalan jauh itu', 'bergerak'], ['Seekor anjing', 'anjing itu', 'berlari']],
  kmj: [['Sebuah bas', 'bas itu', 'bergerak'], ['Sebuah kereta', 'kereta itu', 'bergerak'], ['Sebuah kereta api', 'kereta api itu', 'bergerak'], ['Sebuah lori', 'lori itu', 'bergerak'], ['Sebuah motosikal', 'motosikal itu', 'bergerak'], ['Sebuah van', 'van itu', 'bergerak']],
  mmin: [['Seorang murid', 'murid itu', 'berjalan'], ['Seorang pejalan kaki', 'pejalan kaki itu', 'berjalan'], ['Seorang atlet lumba jalan', 'atlet itu', 'berjalan'], ['Seorang pengawal keselamatan', 'pengawal itu', 'meronda']]
};
const PCUNIT = { ms: { du: 'm', tu: 's', vu: 'm/s', t1: 'saat' }, kmj: { du: 'km', tu: 'jam', vu: 'km/j', t1: 'jam' }, mmin: { du: 'm', tu: 'minit', vu: 'm/min', t1: 'minit' } };
const PCTEMPAT = ['P', 'Q', 'R', 'S', 'T', 'K', 'L', 'M', 'A', 'B', 'D', 'E'].map(h => 'bandar ' + h);
const pcHur = t => t.slice(-1); // label rajah: 'bandar P' → 'P'
const PCLOKASI = { ms: ['garisan mula', 'garisan penamat'], kmj: null, mmin: ['rumah', 'sekolah'] };
const PCKEND = [['Sebuah kereta', 'kereta itu'], ['Sebuah motosikal', 'motosikal itu'], ['Sebuah bas', 'bas itu'], ['Sebuah lori', 'lori itu'], ['Sebuah van', 'van itu'], ['Sebuah teksi', 'teksi itu']];
const PCGERAK = [['Sebuah kereta', 'kereta itu'], ['Sebuah motosikal', 'motosikal itu'], ['Sebuah kereta lumba', 'kereta lumba itu'], ['Sebuah kereta api', 'kereta api itu'], ['Sebuah bot laju', 'bot laju itu'], ['Sebuah van', 'van itu']];
function pcSubj(r, kind) {
  const [S, s, act] = r.p(PCSUBJ[kind]);
  if (kind !== 'kmj' && r.f() < .35) { const N = vnama(); return { S: N, s: N, sl: N, act, nm: N }; }
  return { S, s, sl: S[0].toLowerCase() + S.slice(1), act, nm: '' };
}
const pcObj = (r, list) => { const [S, s] = r.p(list); return { S, s, sl: S[0].toLowerCase() + S.slice(1) }; };
const pcTowns = (r, n) => { const a = PCTEMPAT.slice(), o = []; while (o.length < n) o.push(a.splice(Math.floor(r.f() * a.length), 1)[0]); return o; };

/* =================== rajah (warna tema var(--…)) =================== */
const pcSvg = (w, h, s, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
const pcT = (x, y, t, c = 'tx', sz = 15, a = 'middle', fw = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${fw}" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pcLn = (x1, y1, x2, y2, c, w = 3, dash) => `<line x1="${+x1.toFixed(1)}" y1="${+y1.toFixed(1)}" x2="${+x2.toFixed(1)}" y2="${+y2.toFixed(1)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const pcCar = (x, y, c) => `<g><path d="M${x - 24} ${y - 7}v-9h10l7-8h15l8 8h8v9z" style="fill:var(--${c});stroke:var(--tx)" stroke-width="1.4" stroke-linejoin="round"/><circle cx="${x - 13}" cy="${y - 5}" r="5" style="fill:var(--tx)"/><circle cx="${x + 12}" cy="${y - 5}" r="5" style="fill:var(--tx)"/></g>`;
// perjalanan berperingkat: stops = nama hentian, segs = [{d, t}], rest = { indeksHentian: 'teks' }
function pcTrip(stops, segs, rest, c = 'rd') {
  const n = segs.length, x0 = 34, x1 = 306, xs = stops.map((_, i) => x0 + (x1 - x0) * i / n), yR = 98;
  let s = pcLn(x0 - 14, yR, x1 + 14, yR, 'dim', 12) + pcLn(x0 - 10, yR, x1 + 10, yR, 'mu', 1.5, '8 8');
  segs.forEach((g, i) => {
    const a = xs[i] + 14, b = xs[i + 1] - 14, m = (xs[i] + xs[i + 1]) / 2;
    s += pcLn(a, 62, b, 62, 'mu', 2) + `<path d="M${b - 7} 57l7 5-7 5" style="fill:none;stroke:var(--mu)" stroke-width="2" stroke-linejoin="round"/>`;
    s += pcT(m, 44, g.d, 'tx', 15) + pcT(m, 78, g.t, 'pa', 14);
  });
  stops.forEach((nm, i) => {
    s += `<circle cx="${xs[i]}" cy="${yR}" r="7" style="fill:var(--${c});stroke:var(--tx)" stroke-width="1.5"/>`;
    s += pcT(xs[i], 124, nm, 'tx', 14, i === 0 ? 'start' : i === n ? 'end' : 'middle');
    if (rest && rest[i]) s += pcT(xs[i], 144, rest[i], 'tr', 13);
  });
  if (n === 1) s += pcCar(x0 + 40, yR - 8, c);
  return pcSvg(340, 156, s, 'Rajah perjalanan');
}
// kedudukan objek setiap 1 saat
function pcDots(incs, c = 'rd', u = 'm') {
  const tot = incs.reduce((a, b) => a + b, 0), x0 = 24, W = 292, y = 82;
  const pos = [0]; incs.forEach(d => pos.push(pos[pos.length - 1] + d));
  const X = p => x0 + W * p / tot;
  let s = pcLn(x0 - 10, y, x0 + W + 12, y, 'mu', 2.5);
  incs.forEach((d, i) => { const m = (X(pos[i]) + X(pos[i + 1])) / 2; s += pcT(m, i % 2 ? 36 : 54, `${d} ${u}`, 'tr', 13); });
  pos.forEach((p, i) => {
    s += `<circle cx="${X(p).toFixed(1)}" cy="${y}" r="7" style="fill:var(--${c});fill-opacity:${(.35 + .65 * i / incs.length).toFixed(2)};stroke:var(--${c})" stroke-width="1.5"/>`;
    s += pcLn(X(p), y + 10, X(p), y + 16, 'mu', 1.5) + pcT(X(p), i % 2 ? 128 : 110, `${i} s`, 'mu', 13);
  });
  return pcSvg(340, 146, s, 'Kedudukan objek setiap 1 saat');
}
// jadual mengufuk: rows = [[tajuk, nilai…], …]
function pcTable(rows, c = 'rd') {
  const n = rows[0].length - 1, w0 = 112, w = Math.min(52, Math.floor(216 / n)), H = 38, W = w0 + w * n;
  let s = '';
  rows.forEach((row, ri2) => row.forEach((v, j) => {
    const x = j === 0 ? 0 : w0 + w * (j - 1), cw = j === 0 ? w0 : w, y = ri2 * H;
    s += `<rect x="${x + 1}" y="${y + 1}" width="${cw}" height="${H}" style="fill:${j === 0 ? `var(--${c})` : 'var(--surf2)'};fill-opacity:${j === 0 ? .18 : 1};stroke:var(--mu)" stroke-width="1.5"/>`;
    s += pcT(x + cw / 2 + 1, y + H / 2 + 1, v, j === 0 ? c : 'tx', j === 0 ? 13 : 15, 'middle', j === 0 ? 700 : 600);
  }));
  return pcSvg(W + 2, rows.length * H + 2, s, 'Jadual');
}
// graf garis lurus berpaksi bernama (jarak-masa / laju-masa)
function pcGraph(o) {
  const ox = 56, oy = 184, PW = 254, PH = 150, X = x => ox + PW * x / o.xmax, Y = y => oy - PH * y / o.ymax, c = o.c || 'rd';
  let s = '';
  for (let x = o.xstep; x <= o.xmax + 1e-9; x += o.xstep) s += pcLn(X(x), oy, X(x), oy - PH, 'grid', 1.2) + pcT(X(x), oy + 14, pcN(x), 'mu', 12);
  for (let y = o.ystep; y <= o.ymax + 1e-9; y += o.ystep) s += pcLn(ox, Y(y), ox + PW, Y(y), 'grid', 1.2) + pcT(ox - 7, Y(y), pcN(y), 'mu', 12, 'end');
  s += pcLn(ox, oy, ox + PW + 8, oy, 'mu', 2.5) + pcLn(ox, oy, ox, oy - PH - 8, 'mu', 2.5) + pcT(ox - 7, oy + 12, '0', 'mu', 12, 'end');
  (o.pts || []).forEach(([x, y]) => { if (x > 0 || y > 0) { if (y > 0) s += pcLn(ox, Y(y), X(x), Y(y), 'mu', 1.3, '4 4'); if (x > 0) s += pcLn(X(x), oy, X(x), Y(y), 'mu', 1.3, '4 4'); } });
  s += `<polyline points="${o.pts.map(([x, y]) => `${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join(' ')}" style="fill:none;stroke:var(--${c})" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  o.pts.forEach(([x, y]) => { s += `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="4.5" style="fill:var(--${c})"/>`; });
  (o.labs || []).forEach(([x, y, t]) => { s += pcT(X(x), Y(y) - 13, t, 'tx', 15); });
  s += pcT(8, 14, o.yl, 'tx', 13, 'start') + pcT(330, 214, o.xl, 'tx', 13, 'end');
  return pcSvg(336, 222, s, o.label || 'Graf');
}
// dua meter laju (awal → akhir)
function pcGauge(cx, cy, v, max, lab, u, c) {
  const R = 46, ang = Math.PI * (1 - Math.min(v, max) / max), nx = cx + (R - 10) * Math.cos(ang), ny = cy - (R - 10) * Math.sin(ang);
  let s = `<path d="M${cx - R} ${cy}A${R} ${R} 0 0 1 ${cx + R} ${cy}" style="fill:none;stroke:var(--dim)" stroke-width="9" stroke-linecap="round"/>`;
  if (v > 0) s += `<path d="M${cx - R} ${cy}A${R} ${R} 0 0 1 ${(cx + R * Math.cos(ang)).toFixed(1)} ${(cy - R * Math.sin(ang)).toFixed(1)}" style="fill:none;stroke:var(--${c})" stroke-width="9" stroke-linecap="round"/>`;
  s += pcLn(cx, cy, nx, ny, 'tx', 3.5) + `<circle cx="${cx}" cy="${cy}" r="5" style="fill:var(--tx)"/>`;
  s += pcT(cx, cy + 22, `${pcN(v)} ${u}`, 'tx', 16) + pcT(cx, cy + 42, lab, 'mu', 12, 'middle', 600);
  return s;
}
function pcGauges(u, v, t, un = 'm/s', c = 'am') {
  const max = Math.max(10, Math.ceil(Math.max(u, v) * 1.25 / 10) * 10);
  const s = pcGauge(78, 82, u, max, 'laju awal', un, c) + pcGauge(262, 82, v, max, 'laju akhir', un, c) +
    pcLn(140, 70, 196, 70, 'tr', 2.5) + `<path d="M189 64l8 6-8 6" style="fill:none;stroke:var(--tr)" stroke-width="2.5" stroke-linejoin="round"/>` + pcT(168, 52, t, 'tr', 15);
  return pcSvg(340, 140, s, 'Meter laju awal dan akhir');
}

/* =================== jalan kerja bersama =================== */
const pcWLaju = (d, du, t, tu, v, vu) => ['Laju = jarak ÷ masa', `= ${d} ${du} ÷ ${t} ${tu}`, `= ${pcN(v)} ${vu}`];
const pcWPec = (u, v, t, un = 'm/s', tu = 's', au = 'm/s²') => ['Pecutan = (laju akhir − laju awal) ÷ masa', `= (${pcN(v)} − ${pcN(u)}) ÷ ${t}`, `= ${pcN(v - u)} ÷ ${t}`, `= ${pcN((v - u) / t)} ${au}`];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 9.1 Laju ---------- */
  lajuKira: [
    ({ S, s, act, d, du, t, tu }) => ({ q: `${S} ${act} sejauh ${d} ${du} dalam masa ${t} ${tu}. Hitung laju ${s}.` }),
    ({ sl, act, d, du, t, tu }) => ({ q: `Berapakah laju ${sl} yang ${act} sejauh ${d} ${du} dalam masa ${t} ${tu}?` }),
    ({ d, du, t, tu, vu }) => ({ q: `Lengkapkan: Laju = ${d} ${du} ÷ ${t} ${tu} = ___ ${vu}` }),
    ({ S, s, act, d, du, t, tu, vu, ans, nm }) => { const N = pcNama(nm); return Object.assign({ q: `${S} ${act} sejauh ${d} ${du} dalam masa ${t} ${tu}. ${N} mengira laju ${s} sebagai ${d} × ${t} = ${d * t} ${vu}. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab jarak dengan masa. Sepatutnya laju = jarak ÷ masa.`)); },
    ({ S, s, act, d, du, t, tu, t1, v, vu }) => ({ q: `${S} ${act} sejauh ${d} ${du} dalam masa ${t} ${tu} dengan laju seragam. Berapakah jarak yang dilalui oleh ${s} dalam setiap 1 ${t1}?`, ans: `${v} ${du} setiap ${t1}, iaitu laju ${v} ${vu}` })
  ],
  jarakKira: [
    ({ S, act, v, vu, tTxt }) => ({ q: `${S} ${act} dengan laju seragam ${v} ${vu} selama ${tTxt}. Hitung jarak yang dilalui.` }),
    ({ sl, act, v, vu, tTxt }) => ({ q: `Berapakah jarak yang dilalui oleh ${sl} yang ${act} pada laju ${v} ${vu} selama ${tTxt}?` }),
    ({ v, vu, tV, tu, du }) => ({ q: `Lengkapkan: Jarak = laju × masa = ${v} ${vu} × ${tV} ${tu} = ___ ${du}` }),
    ({ S, s, act, v, vu, tTxt, tV, du, ans, nm }) => { const N = pcNama(nm), dv = (v * 1000) % (+tV * 1000) === 0; return Object.assign({ q: `${S} ${act} pada laju ${v} ${vu} selama ${tTxt}. ${N} berkata jarak yang dilalui oleh ${s} ialah ${dv ? pcN(v / tV) : pcN(v + +tV)} ${du}. Adakah ${N} betul?` }, salah(N, ans, `${N} ${dv ? 'membahagikan laju dengan masa' : 'menambah laju dengan masa'}. Sepatutnya jarak = laju × masa.`)); }
  ],
  masaKira: [
    ({ S, s, act, d, du, v, vu }) => ({ q: `${S} ${act} sejauh ${d} ${du} dengan laju seragam ${v} ${vu}. Berapakah masa yang diambil oleh ${s}?` }),
    ({ P1, P2, d, du, S, s, act, v, vu }) => ({ q: `Jarak dari ${P1} ke ${P2} ialah ${d} ${du}. ${S} ${act} dengan laju seragam ${v} ${vu}. Berapa lamakah masa yang diambil oleh ${s} untuk sampai ke ${P2}?` }),
    ({ d, du, v, vu, tu }) => ({ q: `Lengkapkan: Masa = jarak ÷ laju = ${d} ${du} ÷ ${v} ${vu} = ___ ${tu}` }),
    ({ sl, act, d, du, v, vu, kind }) => ({ q: `Hitung masa yang diperlukan oleh ${sl} yang ${act} pada laju ${v} ${vu} untuk melalui jarak ${d} ${du}.${kind === 'kmj' ? ' Beri jawapan dalam jam dan minit.' : ''}` })
  ],
  seragam: [
    ({ sl, s }) => ({ q: `Rajah di bawah menunjukkan kedudukan ${sl} pada setiap 1 saat. Adakah ${s} bergerak dengan laju seragam atau laju tak seragam?` }),
    ({ sl, s }) => ({ q: `Jadual di bawah menunjukkan jarak ${sl} dari titik permulaan pada setiap saat. Nyatakan sama ada ${s} bergerak dengan laju seragam atau laju tak seragam.` }),
    ({ sl, s, claim, ans, nm }) => { const N = pcNama(nm); return Object.assign({ q: `Rajah di bawah menunjukkan kedudukan ${sl} pada setiap 1 saat. ${N} berkata ${s} bergerak dengan ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, `Bandingkan jarak yang dilalui dalam setiap 1 saat.`)); },
    ({ s, ans, why }) => ({ q: `Berdasarkan jadual di bawah, nyatakan jenis laju ${s}. Beri sebab.`, ans: `${ans}, kerana ${why}` })
  ],
  tukarUnit: [
    ({ from, toU }) => ({ q: `Tukarkan ${from} kepada ${toU}.` }),
    ({ obj, from, toU }) => ({ q: `Laju ${obj} ialah ${from}. Nyatakan laju itu dalam ${toU}.` }),
    ({ from, toU }) => ({ q: `Lengkapkan: ${from} = ___ ${toU}` }),
    ({ from, toU, wrong, why, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menukar ${from} kepada ${toU} dan mendapat ${wrong}. Adakah ${N} betul?` }, salah(N, ans, why.replace(/\$N/g, N))); }
  ],
  masaMinit: [
    ({ S, s, act, d, tm }) => ({ q: `${S} ${act} sejauh ${d} km dalam masa ${tm} minit. Hitung laju ${s} dalam km/j.` }),
    ({ sl, d, tm }) => ({ q: `Berapakah laju, dalam km/j, ${sl} yang melalui jarak ${d} km dalam ${tm} minit?` }),
    ({ S, s, act, d, tm, ans, wr }) => { const N = vnama(); return Object.assign({ q: `${S} ${act} sejauh ${d} km dalam ${tm} minit. ${N} berkata laju ${s} ialah ${d} ÷ ${tm} = ${wr} km/j. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menukar minit kepada jam. ${tm} minit = ${fr(tm, 60)} jam.`)); },
    ({ d, tm }) => ({ q: `Lengkapkan: Laju = ${d} km ÷ ${fr(tm, 60)} jam = ___ km/j` })
  ],
  lajuPurata: [
    ({ S, s, A, B, C, d1, d2, t1, t2, r }) => ({ q: `${S} bergerak dari ${A} ke ${B} sejauh ${d1} km dalam masa ${pcJM(t1)}. ${pcCap(s)} berhenti rehat di ${B} selama ${pcJM(r)}, kemudian bergerak sejauh ${d2} km lagi ke ${C} dalam masa ${pcJM(t2)}. Hitung laju purata ${s} bagi seluruh perjalanan.` }),
    ({ sl, s, A, B, C }) => ({ q: `Rajah di bawah menunjukkan perjalanan ${sl} dari ${A} ke ${C} melalui ${B}, termasuk masa rehat di ${B}. Cari laju purata ${s} bagi seluruh perjalanan dalam km/j.` }),
    ({ S, s, A, B, C, d1, d2, t1, t2, r, D, ans }) => { const N = vnama(); return Object.assign({ q: `${S} bergerak ${d1} km dari ${A} ke ${B} dalam ${pcJM(t1)}, berhenti ${pcJM(r)} di ${B}, kemudian bergerak ${d2} km ke ${C} dalam ${pcJM(t2)}. ${N} mengira laju purata ${s} dengan membahagikan ${D} km dengan ${pcJM(t1 + t2)}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak memasukkan masa rehat. Jumlah masa mesti termasuk masa berhenti.`)); },
    ({ sl, A, B, C, d1, d2, t1, t2, r }) => ({ q: `Seorang pemandu memandu ${sl} dari ${A} ke ${C}. Dia memandu ${d1} km dalam ${pcJM(t1)} pertama, berehat selama ${pcJM(r)} di ${B}, dan memandu ${d2} km lagi dalam ${pcJM(t2)}. Berapakah laju purata bagi perjalanan itu?` })
  ],
  purataLaju: [
    ({ S, s, v1, v2, t1, t2 }) => ({ q: `${S} bergerak dengan laju purata ${v1} km/j selama ${pcJM(t1)}, kemudian dengan laju purata ${v2} km/j selama ${pcJM(t2)}. Hitung laju purata ${s} bagi keseluruhan perjalanan.` }),
    ({ S, s, v1, v2, t1, t2, ans }) => { const N = vnama(); return Object.assign({ q: `${S} bergerak pada ${v1} km/j selama ${pcJM(t1)}, kemudian pada ${v2} km/j selama ${pcJM(t2)}. ${N} berkata laju purata ${s} ialah (${v1} + ${v2}) ÷ 2 = ${pcN((v1 + v2) / 2)} km/j. Adakah ${N} betul?` }, salah(N, ans, 'Laju purata bukan purata dua nilai laju. Laju purata = jumlah jarak ÷ jumlah masa.')); },
    ({ sl, v1, v2, t1, t2, D, avg }) => ({ q: `Seorang pemandu memandu ${sl} pada laju purata ${v1} km/j bagi ${pcJM(t1)} pertama dan ${v2} km/j bagi ${pcJM(t2)} berikutnya. Hitung jumlah jarak yang dilalui dan laju purata bagi seluruh perjalanan.`, ans: `Jumlah jarak = ${D} km, laju purata = ${pcN(avg)} km/j` })
  ],
  grafJM: [
    ({ sl, s, t1, du, tu }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${sl}. Hitung laju ${s} dalam ${t1} ${tu} pertama.` }),
    ({ s, rest, tu }) => ({ q: `Berdasarkan graf jarak-masa di bawah, berapa lamakah ${s} berhenti? Terangkan bagaimana anda mengetahuinya.`, ans: `${rest} ${tu}, kerana bahagian graf itu mengufuk (jarak tidak berubah)` }),
    ({ sl, s, a3, vu }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${sl}. Hitung laju purata ${s} bagi seluruh perjalanan.`, ans: `${pcN(a3)} ${vu}` }),
    ({ s, t2, t3, v3, vu, tu }) => ({ q: `Graf jarak-masa di bawah menunjukkan perjalanan ${s}. Hitung laju ${s} dari ${tu === 'jam' ? 'jam' : 'minit'} ke-${t2} hingga ${tu === 'jam' ? 'jam' : 'minit'} ke-${t3}.`, ans: `${pcN(v3)} ${vu}` })
  ],
  k91: [
    ({ jm }) => ({ q: `Sebuah ${jm.kend} bertolak dari ${jm.A} pada ${pcClock(jm.dep)} dan tiba di ${jm.B} pada ${pcClock(jm.dep + jm.dur)}. Jarak perjalanan ialah ${jm.D} km. (a) Berapakah masa perjalanan? (b) Hitung laju purata ${jm.kend} itu dalam km/j. (c) Nyatakan laju purata itu dalam m/s.`, ans: `(a) ${pcJM(jm.dur)} (b) ${jm.v} km/j (c) ${jm.v * 5 / 18} m/s`, work: [`(a) Masa = ${pcClock(jm.dep + jm.dur)} − ${pcClock(jm.dep)} = ${pcJM(jm.dur)} = ${pcJamX(jm.dur)} jam`, `(b) Laju purata = ${jm.D} ÷ ${pcJamX(jm.dur)} = ${jm.v} km/j`, `(c) ${jm.v} km/j = ${jm.v} × 1000 m ÷ 3600 s = ${jm.v * 5 / 18} m/s`] }),
    ({ rt }) => ({ q: `${rt.N} memandu sejauh ${rt.D} km dari ${rt.A} ke ${rt.B} dengan laju purata ${rt.v1} km/j. Dia kembali ke ${rt.A} melalui jalan yang sama dengan laju purata ${rt.v2} km/j. (a) Hitung jumlah masa perjalanan pergi dan balik. (b) Hitung laju purata bagi seluruh perjalanan. (c) Adakah laju purata itu sama dengan (${rt.v1} + ${rt.v2}) ÷ 2?`, ans: `(a) ${rt.t1 + rt.t2} jam (b) ${pcN(rt.avg)} km/j (c) Tidak, kerana (${rt.v1} + ${rt.v2}) ÷ 2 = ${pcN((rt.v1 + rt.v2) / 2)} km/j`, work: [`(a) Masa pergi = ${rt.D} ÷ ${rt.v1} = ${rt.t1} jam; masa balik = ${rt.D} ÷ ${rt.v2} = ${rt.t2} jam`, `Jumlah masa = ${rt.t1} + ${rt.t2} = ${rt.t1 + rt.t2} jam`, `(b) Jumlah jarak = 2 × ${rt.D} = ${2 * rt.D} km`, `Laju purata = ${2 * rt.D} ÷ ${rt.t1 + rt.t2} = ${pcN(rt.avg)} km/j`, `(c) (${rt.v1} + ${rt.v2}) ÷ 2 = ${pcN((rt.v1 + rt.v2) / 2)} km/j ≠ ${pcN(rt.avg)} km/j, kerana masa pergi dan balik tidak sama.`] }),
    ({ tg }) => ({ q: `Sebuah bas perlu menempuh ${tg.D} km dengan laju purata ${tg.V} km/j. Dalam ${pcJM(tg.t1)} pertama, bas itu bergerak sejauh ${tg.d1} km. (a) Berapakah jumlah masa yang dibenarkan bagi seluruh perjalanan? (b) Berapakah laju purata yang diperlukan bagi baki perjalanan?`, ans: `(a) ${pcJM(tg.T)} (b) ${pcN(tg.v2)} km/j`, work: [`(a) Masa = jarak ÷ laju = ${tg.D} ÷ ${tg.V} = ${pcJamX(tg.T)} jam = ${pcJM(tg.T)}`, `(b) Baki jarak = ${tg.D} − ${tg.d1} = ${tg.D - tg.d1} km`, `Baki masa = ${pcJM(tg.T)} − ${pcJM(tg.t1)} = ${pcJM(tg.T - tg.t1)} = ${pcJamX(tg.T - tg.t1)} jam`, `Laju diperlukan = ${tg.D - tg.d1} ÷ ${pcJamX(tg.T - tg.t1)} = ${pcN(tg.v2)} km/j`] }),
    ({ ch }) => ({ q: `Seekor cheetah berlari sejauh ${ch.d} m dalam ${ch.t} s. Seekor kuda berlari dengan laju ${ch.kh} km/j. (a) Hitung laju cheetah itu dalam km/j. (b) Haiwan manakah lebih laju, dan berapakah beza laju mereka dalam m/s?`, ans: `(a) ${pcN(ch.vc * 3.6)} km/j (b) ${ch.vc > ch.vk ? 'Cheetah' : 'Kuda'}; beza ${Math.abs(ch.vc - ch.vk)} m/s`, work: [`(a) Laju cheetah = ${ch.d} ÷ ${ch.t} = ${ch.vc} m/s`, `${ch.vc} m/s = ${ch.vc} × 3600 ÷ 1000 = ${pcN(ch.vc * 3.6)} km/j`, `(b) Laju kuda = ${ch.kh} × 1000 ÷ 3600 = ${ch.vk} m/s`, `Beza = ${Math.max(ch.vc, ch.vk)} − ${Math.min(ch.vc, ch.vk)} = ${Math.abs(ch.vc - ch.vk)} m/s, maka ${ch.vc > ch.vk ? 'cheetah' : 'kuda'} lebih laju.`] })
  ],

  /* ---------- 9.2 Pecutan ---------- */
  pecutanKira: [
    ({ sl, s, u, v, t }) => ({ q: `Laju ${sl} bertambah daripada ${u} m/s kepada ${v} m/s dalam masa ${t} s. Hitung pecutan ${s}.` }),
    ({ S, u, v, t }) => ({ q: `${S} ${u === 0 ? 'bermula dari keadaan pegun dan mencapai' : `memecut daripada ${u} m/s hingga mencapai`} laju ${v} m/s dalam ${t} saat. Berapakah pecutannya?` }),
    ({ u, v, t }) => ({ q: `Lengkapkan: Pecutan = (${v} − ${u}) m/s ÷ ${t} s = ___ m/s²` }),
    ({ S, s, u, v, t, ans }) => { const N = vnama(); return Object.assign({ q: `Laju ${S[0].toLowerCase() + S.slice(1)} bertambah daripada ${u} m/s kepada ${v} m/s dalam ${t} s. ${N} berkata pecutan ${s} ialah ${v - u} m/s². Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa membahagikan perubahan laju dengan masa.`)); },
    ({ sl, s, t }) => ({ q: `Rajah di bawah menunjukkan bacaan meter laju ${sl} pada awal dan akhir tempoh ${t} saat. Hitung pecutan ${s}.` })
  ],
  nyahpecutan: [
    ({ S, s, u, v, t }) => ({ q: `${S} membrek. Lajunya berkurang daripada ${u} m/s kepada ${v} m/s dalam masa ${t} s. Hitung nyahpecutan ${s}.` }),
    ({ sl, u, v, t, a }) => ({ q: `Hitung pecutan ${sl} yang lajunya berkurang daripada ${u} m/s kepada ${v} m/s dalam ${t} s. Nyatakan sama ada gerakan itu mengalami pecutan atau nyahpecutan.`, ans: `−${a} m/s², iaitu nyahpecutan` }),
    ({ S, s, u, v, t }) => ({ q: `${S} bergerak pada laju ${u} m/s. Pemandunya menekan brek dan ${s} ${v === 0 ? 'berhenti' : `menjadi perlahan hingga ${v} m/s`} selepas ${t} saat. Cari nyahpecutan ${s}.` }),
    ({ sl, s, u, v, t, a, ans }) => { const N = vnama(); return Object.assign({ q: `Laju ${sl} berkurang daripada ${u} m/s kepada ${v} m/s dalam ${t} s. ${N} berkata pecutan ${s} ialah ${a} m/s². Adakah ${N} betul?` }, salah(N, ans, 'Laju berkurang, maka pecutan bernilai negatif. Pecutan = (laju akhir − laju awal) ÷ masa.')); },
    ({ sl, s, t }) => ({ q: `Rajah di bawah menunjukkan bacaan meter laju ${sl} sebelum dan selepas membrek selama ${t} saat. Hitung nyahpecutan ${s}.` })
  ],
  jenisP: [
    ({ sl, s }) => ({ q: `Jadual di bawah menunjukkan laju ${sl} pada setiap saat. Adakah ${s} mengalami pecutan, nyahpecutan atau pecutan sifar?` }),
    ({ sl, s, desc }) => ({ q: `Laju ${sl} ${desc}. Nyatakan sama ada ${s} mengalami pecutan, nyahpecutan atau pecutan sifar, dan hitung nilai pecutannya.` }),
    ({ sl, s, claim, ans }) => { const N = vnama(); return Object.assign({ q: `Jadual di bawah menunjukkan laju ${sl} pada setiap saat. ${N} berkata ${s} mengalami ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, 'Lihat perubahan laju dalam setiap saat.')); }
  ],
  unitKmjs: [
    ({ sl, s, u, v, t }) => ({ q: `Laju ${sl} bertambah daripada ${u} km/j kepada ${v} km/j dalam ${t} saat. Hitung pecutan ${s} dalam km/j per s.` }),
    ({ S, u, v, t }) => ({ q: `${S} ${u === 0 ? 'bermula dari keadaan pegun dan mencapai' : `memecut daripada ${u} km/j hingga`} ${v} km/j dalam ${t} s. Berapakah pecutannya dalam km/j per s?` }),
    ({ u, v, t }) => ({ q: `Lengkapkan: Pecutan = (${v} − ${u}) km/j ÷ ${t} s = ___ km/j per s` })
  ],
  bs: [
    ({ st, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${st}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ st, ok }) => ({ q: `Betul atau salah? ${st}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ st, ok }) => { const N = vnama(); return { q: `${N} berkata, "${st}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  lajuAkhir: [
    ({ S, s, u, a, t, dec }) => ({ q: `${S} bergerak dengan laju ${u} m/s dan ${dec ? `mengalami nyahpecutan seragam ${a} m/s²` : `memecut dengan pecutan seragam ${a} m/s²`} selama ${t} s. Hitung laju akhir ${s}.` }),
    ({ sl, u, sa, t }) => ({ q: `Laju awal ${sl} ialah ${u} m/s. Jika pecutannya ialah ${pcN(sa)} m/s², berapakah lajunya selepas ${t} saat?` }),
    ({ S, s, u, a, t, dec, ans }) => { const N = vnama(); return Object.assign({ q: `${S} bergerak pada ${u} m/s dan ${dec ? `mengalami nyahpecutan ${a} m/s²` : `memecut ${a} m/s²`} selama ${t} s. ${N} berkata laju akhir ${s} ialah ${dec ? u - a : u + a} m/s. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa mendarab pecutan dengan masa: perubahan laju = pecutan × masa.`)); },
    ({ u, a, t, dec }) => ({ q: `Lengkapkan: Laju akhir = ${u} m/s ${dec ? '−' : '+'} (${a} m/s² × ${t} s) = ___ m/s` })
  ],
  masaP: [
    ({ sl, ph }) => ({ q: `Berapakah masa yang diambil oleh ${sl} yang ${ph}?` }),
    ({ S, s, ph }) => ({ q: `${S} ${ph}. Hitung masa yang diambil oleh ${s}.` }),
    ({ u, v, sa }) => ({ q: `Lengkapkan: Masa = (${v} − ${u}) m/s ÷ ${pcP(sa)} m/s² = ___ s` })
  ],
  tukarMs2: [
    ({ sl, s, u, v, t }) => ({ q: `Laju ${sl} bertambah daripada ${u} km/j kepada ${v} km/j dalam ${t} s. Hitung pecutan ${s} dalam m/s².` }),
    ({ S, u, v, t }) => ({ q: `${S} memecut ${u === 0 ? 'dari keadaan pegun' : `daripada ${u} km/j`} hingga ${v} km/j dalam masa ${t} saat. Nyatakan pecutannya dalam m/s².` }),
    ({ dv, t }) => ({ q: `Laju sebuah objek bertambah sebanyak ${dv} km/j dalam ${t} s. Tukarkan perubahan laju itu kepada m/s, kemudian hitung pecutan dalam m/s².`, pre: [] })
  ],
  tukarKmj2: [
    ({ sl, s, u, v, tm }) => ({ q: `Laju ${sl} ${u > v ? 'berkurang' : 'bertambah'} daripada ${u} km/j kepada ${v} km/j dalam ${tm} minit. Hitung pecutan ${s} dalam km/j².` }),
    ({ S, u, v, tm }) => ({ q: `${S} ${u > v ? 'menjadi perlahan' : 'memecut'} daripada ${u} km/j kepada ${v} km/j dalam masa ${tm} minit. Berapakah pecutannya dalam km/j²?` }),
    ({ u, v, tm }) => ({ q: `Lengkapkan: Pecutan = (${v} − ${u}) km/j ÷ ${fr(tm, 60)} jam = ___ km/j²` })
  ],
  grafLM: [
    ({ sl, s, t1 }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${sl}. Hitung pecutan ${s} dalam ${t1} saat pertama.` }),
    ({ sl, s, t2, t3, a3 }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan ${sl}. Hitung nyahpecutan ${s} dari saat ke-${t2} hingga saat ke-${t3}.`, ans: `Nyahpecutan ${pcN(a3)} m/s² (pecutan = −${pcN(a3)} m/s²)` }),
    ({ s, t1, t2, V }) => ({ q: `Berdasarkan graf laju-masa di bawah, nyatakan tempoh masa ${s} bergerak dengan laju seragam dan pecutannya dalam tempoh itu.`, ans: `${t2 - t1} s (dari saat ke-${t1} hingga ke-${t2}); pecutan = 0 m/s²` }),
    ({ s, t1, t2, V }) => { const N = vnama(); return { q: `Graf laju-masa di bawah menunjukkan gerakan ${s}. ${N} berkata ${s} pegun dari saat ke-${t1} hingga saat ke-${t2} kerana graf itu mengufuk. Adakah ${N} betul?`, ans: `Tidak betul. ${pcCap(s)} bergerak dengan laju seragam ${V} m/s (pecutan sifar)` }; }
  ],
  k92: [
    ({ st }) => ({ q: `Graf laju-masa di bawah menunjukkan gerakan sebuah kereta. Kereta itu bermula dari keadaan pegun, mencapai ${st.V} m/s dalam ${st.t1} s, bergerak dengan laju seragam selama ${st.t2} s, kemudian membrek hingga berhenti dalam ${st.t3} s. Hitung (a) pecutan dalam ${st.t1} s pertama, (b) pecutan semasa laju seragam, (c) nyahpecutan semasa membrek.`, ans: `(a) ${st.V / st.t1} m/s² (b) 0 m/s² (c) ${st.V / st.t3} m/s²`, work: [`(a) Pecutan = (${st.V} − 0) ÷ ${st.t1} = ${st.V / st.t1} m/s²`, '(b) Laju tidak berubah, maka pecutan = 0 m/s².', `(c) Pecutan = (0 − ${st.V}) ÷ ${st.t3} = −${st.V / st.t3} m/s², maka nyahpecutan = ${st.V / st.t3} m/s²`] }),
    ({ km }) => ({ q: `Laju sebuah kereta api bertambah daripada ${km.u} km/j kepada ${km.v} km/j dalam masa ${km.t} s. (a) Nyatakan perubahan laju dalam m/s. (b) Hitung pecutan kereta api itu dalam m/s².`, ans: `(a) ${km.dms} m/s (b) ${pcN(km.dms / km.t)} m/s²`, work: [`(a) Perubahan laju = ${km.v} − ${km.u} = ${km.v - km.u} km/j`, `${km.v - km.u} km/j = ${km.v - km.u} × 1000 ÷ 3600 = ${km.dms} m/s`, `(b) Pecutan = ${km.dms} ÷ ${km.t} = ${pcN(km.dms / km.t)} m/s²`] }),
    ({ br }) => ({ q: `Sebuah lori bergerak pada laju ${br.u} m/s. Pemandunya membrek dan lori itu mengalami nyahpecutan seragam ${br.a} m/s². (a) Berapakah laju lori itu selepas ${br.t1} s? (b) Berapakah masa yang diambil untuk lori itu berhenti?`, ans: `(a) ${br.u - br.a * br.t1} m/s (b) ${br.u / br.a} s`, work: [`(a) Perubahan laju = ${br.a} × ${br.t1} = ${br.a * br.t1} m/s (berkurang)`, `Laju = ${br.u} − ${br.a * br.t1} = ${br.u - br.a * br.t1} m/s`, `(b) Berhenti: laju akhir = 0`, `Masa = (0 − ${br.u}) ÷ (−${br.a}) = ${br.u / br.a} s`] }),
    ({ cp }) => ({ q: `Kereta P memecut dari keadaan pegun hingga ${cp.v1} km/j dalam ${cp.t1} s. Kereta Q memecut dari keadaan pegun hingga ${cp.v2} km/j dalam ${cp.t2} s. (a) Hitung pecutan setiap kereta dalam km/j per s. (b) Kereta manakah mempunyai pecutan yang lebih besar?`, ans: `(a) P: ${pcN(cp.a1)} km/j per s, Q: ${pcN(cp.a2)} km/j per s (b) Kereta ${cp.a1 > cp.a2 ? 'P' : 'Q'}`, work: [`(a) Pecutan P = (${cp.v1} − 0) ÷ ${cp.t1} = ${pcN(cp.a1)} km/j per s`, `Pecutan Q = (${cp.v2} − 0) ÷ ${cp.t2} = ${pcN(cp.a2)} km/j per s`, `(b) ${pcN(Math.max(cp.a1, cp.a2))} > ${pcN(Math.min(cp.a1, cp.a2))}, maka kereta ${cp.a1 > cp.a2 ? 'P' : 'Q'} mempunyai pecutan yang lebih besar.`] })
  ]
};

/* =================== pembina soalan (r = pcRG atau pcRW) =================== */
const PC = {};
/* ---------- 9.1 ---------- */
PC.lajuKira = (r, kind) => {
  kind = kind || r.p(['ms', 'kmj', 'mmin']);
  const U = PCUNIT[kind], sj = pcSubj(r, kind);
  let v, t;
  if (kind === 'ms') { v = r.i(2, 12); t = r.i(4, 30); }
  else if (kind === 'kmj') { v = r.p([40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110]); t = r.i(2, 5); }
  else { v = r.p([40, 45, 50, 55, 60, 65, 70, 75, 80, 90]); t = r.i(5, 25); }
  const d = v * t, ans = `${v} ${U.vu}`;
  return GEN_LQ('lajuKira', Object.assign({}, sj, U, { d, t, v, ans, work: pcWLaju(d, U.du, t, U.tu, v, U.vu) }), { fig: pcTrip(['Mula', 'Tamat'], [{ d: `${d} ${U.du}`, t: `${t} ${U.tu}` }]) });
};
PC.jarakKira = (r, kind) => {
  kind = kind || r.p(['ms', 'kmj', 'mmin']);
  const U = PCUNIT[kind], sj = pcSubj(r, kind);
  let v, tm, tTxt, tV, d, pre = [];
  if (kind === 'ms') { v = r.i(3, 15); tm = r.i(6, 40); tTxt = `${tm} saat`; tV = tm; d = v * tm; }
  else if (kind === 'mmin') { v = r.p([40, 50, 60, 65, 70, 75, 80, 85]); tm = r.i(5, 30); tTxt = `${tm} minit`; tV = tm; d = v * tm; }
  else {
    do { v = r.p([40, 48, 50, 56, 60, 64, 70, 72, 80, 84, 90, 96, 100, 110, 120]); tm = r.p([30, 45, 75, 90, 105, 120, 135, 150, 180, 210]); } while ((v * tm) % 60);
    tTxt = pcJM(tm); tV = pcN(tm / 60); d = v * tm / 60;
    if (tm % 60) pre = [`${tTxt} = ${tV} jam`];
  }
  const ans = `${d} ${U.du}`;
  return GEN_LQ('jarakKira', Object.assign({}, sj, U, { v, tTxt, tV, d, ans, work: pre.concat(['Jarak = laju × masa', `= ${v} ${U.vu} × ${tV} ${U.tu}`, `= ${d} ${U.du}`]) }), { fig: pcTrip(['Mula', 'Tamat'], [{ d: `? ${U.du}`, t: tTxt }]) });
};
PC.masaKira = (r, kind) => {
  kind = kind || r.p(['ms', 'kmj', 'mmin']);
  const U = PCUNIT[kind], sj = pcSubj(r, kind);
  let v, tm, d, ans, work, P1, P2;
  if (kind === 'kmj') {
    do { v = r.p([40, 48, 50, 60, 64, 70, 72, 80, 90, 100, 120]); tm = r.p([60, 90, 105, 120, 135, 150, 180, 195, 210, 240, 270]); } while ((v * tm) % 60);
    d = v * tm / 60; const tH = pcN(tm / 60);
    ans = tm % 60 ? `${tH} jam = ${pcJM(tm)}` : `${tH} jam`;
    work = ['Masa = jarak ÷ laju', `= ${d} km ÷ ${v} km/j`, `= ${tH} jam`].concat(tm % 60 ? [`= ${Math.floor(tm / 60)} jam + ${pcN((tm % 60) / 60)} × 60 minit = ${pcJM(tm)}`] : []);
    [P1, P2] = pcTowns(r, 2);
  } else {
    if (kind === 'ms') { v = r.i(2, 12); tm = r.i(5, 40); } else { v = r.p([40, 50, 60, 70, 75, 80]); tm = r.i(4, 25); }
    d = v * tm; ans = `${tm} ${U.tu}`; work = ['Masa = jarak ÷ laju', `= ${d} ${U.du} ÷ ${v} ${U.vu}`, `= ${tm} ${U.tu}`];
    [P1, P2] = PCLOKASI[kind];
  }
  return GEN_LQ('masaKira', Object.assign({}, sj, U, { kind, v, d, ans, work, P1, P2 }), { fig: pcTrip([kind === 'kmj' ? pcCap(P1) : pcCap(P1), kind === 'kmj' ? pcCap(P2) : pcCap(P2)], [{ d: `${d} ${U.du}`, t: '? ' + U.tu }]) });
};
PC.seragam = (r, k) => {
  const ser = k == null ? r.f() < .5 : k % 2 === 0, sj = pcSubj(r, 'ms');
  let incs;
  if (ser) { const st = r.i(3, 9); incs = [st, st, st, st]; }
  else { do { incs = [0, 0, 0, 0].map(() => r.i(3, 11)); } while (new Set(incs).size < 3); }
  const pos = [0]; incs.forEach(d => pos.push(pos[pos.length - 1] + d));
  const ans = ser ? 'Laju seragam' : 'Laju tak seragam', claim = ser ? 'Laju tak seragam' : 'Laju seragam';
  const why = ser ? `jarak yang sama (${incs[0]} m) dilalui dalam setiap 1 saat` : 'jarak yang dilalui dalam setiap 1 saat tidak sama';
  const work = [`Jarak dalam setiap 1 saat: ${incs.join(' m, ')} m.`, ser ? `Jarak yang sama dilalui dalam selang masa yang sama, maka laju seragam (${incs[0]} m/s).` : 'Jarak yang dilalui dalam selang masa yang sama berbeza, maka laju tak seragam.'];
  const v = vq('seragam', Object.assign({}, sj, { ans, claim, why, work }));
  const fig = /[Jj]adual/.test(v.q) ? pcTable([['Masa (s)', 0, 1, 2, 3, 4], ['Jarak (m)'].concat(pos)]) : pcDots(incs);
  return { q: v.q, ans: v.ans, work: v.work, fig };
};
const PCTUKAR = {
  kmj2ms: r => { const k = r.i(1, 7), v = 18 * k, o = 5 * k; return { from: `${v} km/j`, toU: 'm/s', ans: `${o} m/s`, wrong: `${pcN(v * 3.6)} m/s`, why: '$N mendarab dengan 3.6. Untuk menukar km/j kepada m/s, darab dengan 1000 dan bahagi dengan 3600.', work: [`${v} km/j = ${v} × 1000 m ÷ 3600 s`, `= ${v * 1000} m ÷ 3600 s`, `= ${o} m/s`], v, o }; },
  ms2kmj: r => { const v = r.i(2, 30), o = v * 3.6; return { from: `${v} m/s`, toU: 'km/j', ans: `${pcN(o)} km/j`, wrong: `${v * 60} km/j`, why: '$N hanya mendarab dengan 60. 1 jam = 3600 s dan 1 km = 1000 m, maka darab dengan 3600 dan bahagi dengan 1000.', work: [`${v} m/s = ${v} m dalam 1 s`, `Dalam 1 jam (3600 s): ${v} × 3600 = ${v * 3600} m = ${pcN(v * 3.6)} km`, `= ${pcN(o)} km/j`], v, o }; },
  kmj2mmin: r => { const v = 3 * r.i(1, 20), o = v * 1000 / 60; return { from: `${v} km/j`, toU: 'm/min', ans: `${pcN(o)} m/min`, wrong: `${v * 60} m/min`, why: '$N mendarab dengan 60. Sepatutnya tukar km kepada m (× 1000) dan jam kepada minit (÷ 60).', work: [`${v} km/j = ${v} × 1000 m ÷ 60 minit`, `= ${v * 1000} m ÷ 60 minit`, `= ${pcN(o)} m/min`], v, o }; },
  ms2mmin: r => { const v = r.i(2, 15), o = v * 60; return { from: `${v} m/s`, toU: 'm/min', ans: `${o} m/min`, wrong: `${v * 3600} m/min`, why: '$N mendarab dengan 3600. 1 minit = 60 s, maka darab dengan 60 sahaja.', work: [`${v} m/s = ${v} m dalam 1 s`, `Dalam 1 minit (60 s): ${v} × 60 = ${o} m`, `= ${o} m/min`], v, o }; },
  mmin2kmj: r => { const v = 50 * r.i(1, 30), o = v * 60 / 1000; return { from: `${v} m/min`, toU: 'km/j', ans: `${pcN(o)} km/j`, wrong: `${v * 60} km/j`, why: '$N terlupa menukar meter kepada kilometer (÷ 1000).', work: [`Dalam 1 jam (60 minit): ${v} × 60 = ${v * 60} m`, `${v * 60} m = ${v * 60} ÷ 1000 = ${pcN(o)} km`, `= ${pcN(o)} km/j`], v, o }; }
};
const PCTK = ['kmj2ms', 'ms2kmj', 'kmj2mmin', 'ms2mmin', 'mmin2kmj'];
const PCTOBJ = { kmj2ms: ['sebuah kereta', 'sebuah bas', 'sebuah kereta api', 'sebuah motosikal'], ms2kmj: ['seorang pelari', 'seekor kuda', 'sebuah basikal', 'sebuah dron'], kmj2mmin: ['seorang pejalan kaki', 'sebuah basikal', 'sebuah bot kecil'], ms2mmin: ['seorang pelari', 'sebuah eskalator', 'seekor anjing'], mmin2kmj: ['seorang pejalan kaki', 'seorang atlet lumba jalan', 'sebuah kereta kawalan jauh'] };
PC.tukarUnit = (r, k) => {
  const kind = k == null ? r.p(PCTK) : PCTK[k % PCTK.length], d = PCTUKAR[kind](r);
  return GEN_LQ('tukarUnit', Object.assign(d, { obj: r.p(PCTOBJ[kind]) }));
};
PC.masaMinit = r => {
  let v, tm, d; do { tm = r.p([10, 12, 15, 20, 30, 40, 45, 50]); v = r.i(6, 20) * 6; d = v * tm / 60; } while (!Number.isInteger(d) || d < 2);
  const sj = pcSubj(r, 'kmj'), g = pcGcd(tm, 60);
  const wr = pcIsDec(d, tm, 3) ? pcN(d / tm) : `${pcFr(d, tm)}`;
  return GEN_LQ('masaMinit', Object.assign({}, sj, { d, tm, wr, ans: `${v} km/j`, work: [`${tm} minit = ${fr(tm, 60)} jam = ${pcFr(tm, 60)} jam`, `Laju = ${d} km ÷ ${pcFr(tm, 60)} jam`, `= ${d} × ${60 / g} ÷ ${tm / g}`, `= ${v} km/j`] }), { fig: pcTrip(['Mula', 'Tamat'], [{ d: `${d} km`, t: `${tm} minit` }]) });
};
PC.lajuPurata = r => {
  let v1, v2, t1, t2, rs, d1, d2, D, T;
  do {
    v1 = r.p([40, 48, 50, 60, 64, 70, 72, 80, 90, 100]); v2 = r.p([40, 48, 50, 60, 64, 70, 72, 80, 90, 100]);
    t1 = r.p([45, 60, 75, 90, 105, 120, 150]); t2 = r.p([30, 45, 60, 75, 90, 120]); rs = r.p([15, 20, 30, 45]);
    d1 = v1 * t1 / 60; d2 = v2 * t2 / 60; D = d1 + d2; T = t1 + rs + t2;
  } while (!Number.isInteger(d1) || !Number.isInteger(d2) || !pcIsDec(D * 60, T, 1));
  const ob = pcObj(r, PCKEND), [A, B, C] = pcTowns(r, 3), avg = D * 60 / T, ans = `${pcN(avg)} km/j`;
  const work = [`Jumlah jarak = ${d1} + ${d2} = ${D} km`, `Jumlah masa = ${pcJM(t1)} + ${pcJM(rs)} + ${pcJM(t2)} = ${pcJM(T)}${T % 60 ? ` = ${pcJamX(T)} jam` : ''}`, 'Laju purata = jumlah jarak ÷ jumlah masa', `= ${D} ÷ ${pcJamX(T)}`].concat(pcJamX(T).includes('class="fr"') ? [`= ${D} × 60 ÷ ${T}`] : []).concat([`= ${pcN(avg)} km/j`]);
  return GEN_LQ('lajuPurata', Object.assign({}, ob, { A, B, C, d1, d2, t1, t2, r: rs, D, ans, work }), { fig: pcTrip([A, B, C].map(pcHur), [{ d: `${d1} km`, t: pcJM(t1) }, { d: `${d2} km`, t: pcJM(t2) }], { 1: `rehat ${pcJM(rs)}` }) });
};
PC.purataLaju = r => {
  let v1, v2, t1, t2, d1, d2, D, T;
  do {
    v1 = r.p([40, 50, 60, 70, 80, 90, 100, 110]); v2 = r.p([40, 50, 60, 70, 80, 90, 100, 110]);
    t1 = r.p([30, 45, 60, 90, 120, 150]); t2 = r.p([30, 45, 60, 90, 120]);
    d1 = v1 * t1 / 60; d2 = v2 * t2 / 60; D = d1 + d2; T = t1 + t2;
  } while (v1 === v2 || t1 === t2 || !Number.isInteger(d1) || !Number.isInteger(d2) || !pcIsDec(D * 60, T, 2) || D * 60 / T === (v1 + v2) / 2);
  const ob = pcObj(r, PCKEND), avg = D * 60 / T;
  const work = [`Jarak pertama = ${v1} × ${pcJamX(t1)} = ${d1} km`, `Jarak kedua = ${v2} × ${pcJamX(t2)} = ${d2} km`, `Jumlah jarak = ${d1} + ${d2} = ${D} km`, `Jumlah masa = ${pcJamX(t1)} + ${pcJamX(t2)} = ${pcJamX(T)} jam`, `Laju purata = ${D} ÷ ${pcJamX(T)} = ${pcN(avg)} km/j`];
  return GEN_LQ('purataLaju', Object.assign({}, ob, { v1, v2, t1, t2, D, avg, ans: `${pcN(avg)} km/j`, work }));
};
PC.grafJM = (r, k) => {
  const km = r.f() < .6, du = km ? 'km' : 'm', tu = km ? 'jam' : 'minit', vu = km ? 'km/j' : 'm/min';
  let ys, t1, t2, t3, d1, d3, v1, v3, a3;
  do {
    ys = km ? r.p([20, 30, 40, 50]) : r.p([100, 200]);
    t1 = r.i(1, 3); t2 = t1 + 1; t3 = t2 + r.i(1, 3);
    d1 = ys * r.i(1, 4); d3 = d1 + ys * r.i(1, 3);
    v1 = d1 / t1; v3 = (d3 - d1) / (t3 - t2); a3 = d3 / t3;
  } while (!Number.isInteger(v1) || !Number.isInteger(v3) || !pcIsDec(d3, t3, 2) || v1 === v3 || d3 / ys > 7);
  const sj = km ? pcObj(r, PCKEND) : pcSubj(r, 'mmin');
  const ymax = Math.ceil(d3 / ys) * ys + ys;
  const fig = pcGraph({ xmax: t3 + 1, xstep: 1, ymax, ystep: ys, pts: [[0, 0], [t1, d1], [t2, d1], [t3, d3]], xl: `Masa (${tu})`, yl: `Jarak (${du})`, label: 'Graf jarak-masa' });
  const kk = k == null ? r.i(0, 3) : k % 4, d = Object.assign({}, sj, { t1, t2, t3, d1, d3, v3, a3, du, tu, vu, rest: t2 - t1 });
  const W = [
    { ans: `${v1} ${vu}`, work: [`Dalam ${t1} ${tu} pertama, jarak = ${d1} ${du}.`].concat(pcWLaju(d1, du, t1, tu, v1, vu)) },
    { work: [`Dari ${tu} ke-${t1} hingga ke-${t2}, jarak kekal ${d1} ${du}.`, `Graf mengufuk bermaksud ${sj.s} pegun (berhenti).`, `Tempoh berhenti = ${t2} − ${t1} = ${t2 - t1} ${tu}`] },
    { work: [`Jumlah jarak = ${d3} ${du}, jumlah masa = ${t3} ${tu} (termasuk masa berhenti).`, `Laju purata = ${d3} ÷ ${t3}`, `= ${pcN(a3)} ${vu}`] },
    { work: [`Jarak = ${d3} − ${d1} = ${d3 - d1} ${du}`, `Masa = ${t3} − ${t2} = ${t3 - t2} ${tu}`, `Laju = ${d3 - d1} ÷ ${t3 - t2} = ${v3} ${vu}`] }
  ][kk];
  const v = QV.grafJM[kk](d);
  return { q: v.q, ans: v.ans || W.ans, work: W.work, fig };
};
PC.k91 = r => {
  let jm; do { const dur = r.p([90, 120, 135, 150, 165, 180, 210]), v = r.p([54, 72, 90, 108]), dep = r.i(84, 114) * 5; jm = { dur, v, dep, D: v * dur / 60 }; } while (!Number.isInteger(jm.D) || jm.dep + jm.dur >= 17 * 60);
  [jm.A, jm.B] = pcTowns(r, 2); jm.kend = r.p(['bas', 'kereta api']);
  let rt; do { const t1 = r.i(1, 4), t2 = r.i(1, 5), v1 = r.p([40, 50, 60, 70, 80, 90, 100, 120]), D = v1 * t1; rt = { t1, t2, v1, D, v2: D / t2, avg: 2 * D / (t1 + t2) }; } while (rt.t1 === rt.t2 || !Number.isInteger(rt.v2) || rt.v2 < 30 || rt.v2 > 120 || !pcIsDec(2 * rt.D, rt.t1 + rt.t2, 2));
  [rt.A, rt.B] = pcTowns(r, 2); rt.N = vnama();
  let tg; do { const V = r.p([50, 60, 70, 80, 90]), T = r.p([120, 150, 180, 210, 240, 300]), t1 = r.p([30, 60, 90, 120]), v1 = r.p([40, 50, 60, 70, 80, 90, 100]); tg = { V, T, t1, D: V * T / 60, d1: v1 * t1 / 60 }; tg.v2 = (tg.D - tg.d1) * 60 / (T - t1); } while (tg.t1 > tg.T - 60 || !Number.isInteger(tg.D) || !Number.isInteger(tg.d1) || tg.d1 >= tg.D || !pcIsDec((tg.D - tg.d1) * 60, tg.T - tg.t1, 2) || tg.v2 > 120 || tg.v2 < 20);
  let ch; do { const vc = r.p([20, 25, 30]), t = r.i(3, 8), kh = 18 * r.i(2, 4); ch = { vc, t, d: vc * t, kh, vk: kh * 5 / 18 }; } while (ch.vc === ch.vk);
  return GEN_LQ('k91', { jm, rt, tg, ch });
};

/* ---------- 9.2 ---------- */
PC.pecutanKira = r => {
  const ob = pcObj(r, PCGERAK); let a, t, u, v; do { a = r.i(1, 6); t = r.i(2, 10); u = r.f() < .3 ? 0 : r.i(1, 15); v = u + a * t; } while (v > 40);
  return GEN_LQ('pecutanKira', Object.assign({}, ob, { u, v, t, a, ans: `${a} m/s²`, work: pcWPec(u, v, t) }), { fig: pcGauges(u, v, `${t} s`) });
};
PC.nyahpecutan = r => {
  const ob = pcObj(r, PCKEND); let a, t, u, v; do { a = r.i(1, 6); t = r.i(2, 8); v = r.f() < .35 ? 0 : r.i(1, 10); u = v + a * t; } while (u > 35);
  return GEN_LQ('nyahpecutan', Object.assign({}, ob, { u, v, t, a, ans: `Nyahpecutan ${a} m/s² (pecutan = −${a} m/s²)`, work: pcWPec(u, v, t).concat(['Nilai negatif menunjukkan nyahpecutan.']) }), { fig: pcGauges(u, v, `${t} s`) });
};
const PCJENIS = { pos: ['Pecutan', 'bertambah'], neg: ['Nyahpecutan', 'berkurang'], zero: ['Pecutan sifar', 'tidak berubah'] };
PC.jenisP = (r, k) => {
  const kind = k == null ? r.p(['pos', 'neg', 'zero']) : ['pos', 'neg', 'zero'][k % 3], ob = pcObj(r, PCGERAK);
  const a = kind === 'zero' ? 0 : r.i(1, 4) * (kind === 'pos' ? 1 : -1), u = kind === 'neg' ? r.i(-a * 4 + 1, 20) : kind === 'zero' ? r.i(3, 15) : r.i(0, 10);
  const vs = [0, 1, 2, 3, 4].map(i => u + a * i), v = vs[4];
  const J = PCJENIS[kind], ans = kind === 'pos' ? `Pecutan, ${a} m/s²` : kind === 'neg' ? `Nyahpecutan, pecutan = −${-a} m/s²` : 'Pecutan sifar (laju seragam), 0 m/s²';
  const desc = kind === 'zero' ? `kekal ${u} m/s selama 4 s` : `${J[1]} daripada ${u} m/s kepada ${v} m/s dalam 4 s`;
  const claim = kind === 'pos' ? 'Nyahpecutan' : kind === 'neg' ? 'Pecutan' : 'Nyahpecutan';
  const work = [`Laju ${J[1]}${kind === 'zero' ? '' : ` ${Math.abs(a)} m/s setiap saat`}.`, `Pecutan = (${v} − ${u}) ÷ 4 = ${pcN(a)} m/s²`, kind === 'pos' ? 'Pecutan positif: laju bertambah.' : kind === 'neg' ? 'Pecutan negatif ialah nyahpecutan: laju berkurang.' : 'Pecutan sifar: objek bergerak dengan laju seragam.'];
  const vv = vq('jenisP', Object.assign({}, ob, { desc, claim, ans, work }));
  return { q: vv.q, ans: vv.ans, work: vv.work, fig: pcTable([['Masa (s)', 0, 1, 2, 3, 4], ['Laju (m/s)'].concat(vs)], 'am') };
};
PC.unitKmjs = r => {
  const ob = pcObj(r, PCKEND), a = r.i(2, 15), t = r.i(2, 10), u = r.f() < .4 ? 0 : 10 * r.i(1, 4), v = u + a * t;
  if (v > 160) return PC.unitKmjs(r);
  return GEN_LQ('unitKmjs', Object.assign({}, ob, { u, v, t, ans: `${a} km/j per s`, work: pcWPec(u, v, t, 'km/j', 's', 'km/j per s') }), { fig: pcGauges(u, v, `${t} s`, 'km/j') });
};
const PCBS = [
  ['Pecutan ialah kadar perubahan laju terhadap masa.', true, 'Pecutan = perubahan laju ÷ masa.'],
  ['Unit bagi pecutan ialah m/s.', false, 'm/s ialah unit laju. Unit pecutan ialah m/s² atau km/j².'],
  ['Objek yang bergerak dengan laju seragam mempunyai pecutan sifar.', true, 'Laju tidak berubah, maka perubahan laju = 0 dan pecutan = 0.'],
  ['Nyahpecutan berlaku apabila laju sesuatu objek bertambah.', false, 'Nyahpecutan berlaku apabila laju berkurang.'],
  ['Pecutan yang bernilai negatif menunjukkan nyahpecutan.', true, 'Jika laju akhir kurang daripada laju awal, pecutan bernilai negatif, iaitu nyahpecutan.'],
  ['Pecutan = (laju awal − laju akhir) ÷ masa.', false, 'Rumus yang betul: pecutan = (laju akhir − laju awal) ÷ masa.'],
  ['Pecutan 3 m/s² bermaksud laju objek bertambah 3 m/s dalam setiap saat.', true, 'm/s² = perubahan laju (m/s) bagi setiap saat.'],
  ['Jika laju sebuah kereta berkurang 2 m/s setiap saat, pecutannya ialah 2 m/s².', false, 'Laju berkurang, maka pecutan = −2 m/s² (nyahpecutan 2 m/s²).'],
  ['Sebuah kereta yang pegun mempunyai laju 0 m/s dan pecutan 0 m/s².', true, 'Pegun bermaksud tidak bergerak; laju tidak berubah, maka pecutan juga sifar.']
];
PC.bs = (r, k) => { const [st, ok, why] = k == null ? r.p(PCBS) : PCBS[k % PCBS.length]; return GEN_LQ('bs', { st, ok, work: [why] }); };
PC.lajuAkhir = (r, k) => {
  const dec = k == null ? r.f() < .5 : k % 2 === 1, ob = pcObj(r, PCGERAK);
  let u, a, t, v; do { a = r.i(1, 5); t = r.i(2, 8); u = r.i(dec ? 10 : 1, 30); v = dec ? u - a * t : u + a * t; } while (v < 0 || v > 40 || (dec && v === 0 && r.f() < .5));
  const sa = dec ? -a : a;
  return GEN_LQ('lajuAkhir', Object.assign({}, ob, { u, a, t, dec, sa, ans: `${v} m/s`, work: ['Pecutan = (laju akhir − laju awal) ÷ masa', `${pcN(sa)} = (v − ${u}) ÷ ${t}`, `v − ${u} = ${pcN(sa)} × ${t} = ${pcN(sa * t)}`, `v = ${u} ${dec ? '−' : '+'} ${a * t} = ${v} m/s`] }), { fig: pcGauges(u, v, `${t} s`).replace(`>${v} m/s<`, '>? m/s<') });
};
PC.masaP = (r, k) => {
  const dec = k == null ? r.f() < .5 : k % 2 === 1, ob = pcObj(r, dec ? PCKEND : PCGERAK);
  let u, a, t, v; do { a = r.i(1, 6); t = r.i(2, 10); if (dec) { v = r.f() < .5 ? 0 : r.i(1, 8); u = v + a * t; } else { u = r.i(1, 12); v = u + a * t; } } while (u > 40 || v > 40);
  const sa = dec ? -a : a;
  const ph = dec ? (v === 0 ? `membrek daripada ${u} m/s hingga berhenti dengan nyahpecutan seragam ${a} m/s²` : `menjadi perlahan daripada ${u} m/s kepada ${v} m/s dengan nyahpecutan seragam ${a} m/s²`) : `memecut daripada ${u} m/s kepada ${v} m/s dengan pecutan seragam ${a} m/s²`;
  return GEN_LQ('masaP', Object.assign({}, ob, { u, v, a, sa, ph, ans: `${t} s`, work: ['Pecutan = (laju akhir − laju awal) ÷ masa', 'Masa = (laju akhir − laju awal) ÷ pecutan', `= (${v} − ${u}) ÷ ${pcP(sa)}`, `= ${pcN(v - u)} ÷ ${pcP(sa)}`, `= ${t} s`] }), { fig: pcGauges(u, v, '? s') });
};
PC.tukarMs2 = r => {
  let a, t; do { a = r.i(1, 5); t = r.i(2, 12); } while ((a * t) % 5 || a * t > 30);
  const dms = a * t, dv = dms * 18 / 5, u = 18 * r.i(0, 4), v = u + dv, ob = pcObj(r, PCKEND);
  return GEN_LQ('tukarMs2', Object.assign({}, ob, { u, v, t, dv, ans: `${a} m/s²`, work: [`Perubahan laju = ${v} − ${u} = ${dv} km/j`, `${dv} km/j = ${dv} × 1000 m ÷ 3600 s = ${dms} m/s`, `Pecutan = ${dms} m/s ÷ ${t} s = ${a} m/s²`] }));
};
PC.tukarKmj2 = r => {
  const tm = r.p([1, 2, 3, 4, 5, 6, 10, 12, 15]), dvv = 10 * r.i(1, 6), dec = r.f() < .3, ob = pcObj(r, PCKEND);
  const u = dec ? dvv + 10 * r.i(1, 5) : 10 * r.i(0, 5), v = dec ? u - dvv : u + dvv, acc = (v - u) * 60 / tm;
  return GEN_LQ('tukarKmj2', Object.assign({}, ob, { u, v, tm, ans: dec ? `${pcN(acc)} km/j² (nyahpecutan ${pcN(-acc)} km/j²)` : `${pcN(acc)} km/j²`, work: [`Perubahan laju = ${v} − ${u} = ${pcN(v - u)} km/j`, `${tm} minit = ${fr(tm, 60)} jam = ${pcFr(tm, 60)} jam`, `Pecutan = ${pcN(v - u)} ÷ ${pcFr(tm, 60)}`, `= ${pcN(v - u)} × 60 ÷ ${tm}`, `= ${pcN(acc)} km/j²`] }));
};
PC.grafLM = (r, k) => {
  let ys, u0, V, t1, t2, t3, xs;
  do {
    xs = r.p([1, 2, 5]); ys = r.p([2, 4, 5, 10]);
    V = ys * r.i(2, 5); u0 = r.f() < .5 ? 0 : ys * r.i(1, 2);
    t1 = xs * r.i(1, 3); t2 = t1 + xs * r.i(1, 3); t3 = t2 + xs * r.i(1, 3);
  } while (V > 30 || u0 >= V || (V - u0) % t1 || V % (t3 - t2) || t3 / xs > 8);
  const ob = pcObj(r, PCGERAK), a1 = (V - u0) / t1, a3 = V / (t3 - t2);
  const fig = pcGraph({ xmax: t3 + xs, xstep: xs, ymax: V + ys, ystep: ys, pts: [[0, u0], [t1, V], [t2, V], [t3, 0]], xl: 'Masa (s)', yl: 'Laju (m/s)', c: 'am', label: 'Graf laju-masa' });
  const kk = k == null ? r.i(0, 3) : k % 4, d = Object.assign({}, ob, { t1, t2, t3, V, a3 });
  const W = [
    { ans: `${a1} m/s²`, work: pcWPec(u0, V, t1) },
    { work: pcWPec(V, 0, t3 - t2).concat([`Pecutan negatif, maka nyahpecutan = ${a3} m/s².`]) },
    { work: [`Graf mengufuk dari saat ke-${t1} hingga ke-${t2}: laju kekal ${V} m/s.`, `Tempoh = ${t2} − ${t1} = ${t2 - t1} s`, 'Laju tidak berubah, maka pecutan = 0 m/s².'] },
    { work: [`Graf laju-masa yang mengufuk bermaksud laju tidak berubah (${V} m/s), bukan pegun.`, 'Objek pegun hanya jika laju = 0 m/s (graf pada paksi masa).'] }
  ][kk];
  const v = QV.grafLM[kk](d);
  return { q: v.q, ans: v.ans || W.ans, work: W.work, fig };
};
PC.k92 = r => {
  let st; do { const V = r.i(2, 6) * 5, t1 = r.i(2, 10), t2 = r.i(5, 20), t3 = r.i(2, 8); st = { V, t1, t2, t3 }; } while (st.V % st.t1 || st.V % st.t3);
  let km; do { const t = r.i(4, 12), a = r.i(1, 3), u = 18 * r.i(1, 4); km = { t, u, dms: a * t, v: u + a * t * 3.6 }; } while (km.dms % 5);
  km.v = Math.round(km.v);
  let br; do { const a = r.i(2, 6), ts = r.i(3, 9); br = { a, u: a * ts, t1: r.i(1, ts - 1) }; } while (br.u > 40);
  let cp; do { const v1 = 10 * r.i(6, 12), t1 = r.i(4, 12), v2 = 10 * r.i(6, 12), t2 = r.i(4, 12); cp = { v1, t1, v2, t2, a1: v1 / t1, a2: v2 / t2 }; } while (cp.a1 === cp.a2 || !pcIsDec(cp.v1, cp.t1, 2) || !pcIsDec(cp.v2, cp.t2, 2));
  const v = vq('k92', { st, km, br, cp });
  const fig = v.q.startsWith('Graf') ? pcGraph({ xmax: st.t1 + st.t2 + st.t3 + 2, xstep: st.t1 + st.t2 + st.t3 > 16 ? 2 : 1, ymax: st.V + 5, ystep: 5, pts: [[0, 0], [st.t1, st.V], [st.t1 + st.t2, st.V], [st.t1 + st.t2 + st.t3, 0]], xl: 'Masa (s)', yl: 'Laju (m/s)', c: 'am', label: 'Graf laju-masa' }) : '';
  return Object.assign({ q: v.q, ans: v.ans, work: v.work }, fig ? { fig } : {});
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '9.1': {
    m: [() => PC.lajuKira(pcRG), () => PC.lajuKira(pcRG), () => PC.jarakKira(pcRG), () => PC.masaKira(pcRG), () => PC.seragam(pcRG), () => PC.tukarUnit(pcRG), () => PC.masaMinit(pcRG)],
    s: [() => PC.lajuPurata(pcRG), () => PC.lajuPurata(pcRG), () => PC.purataLaju(pcRG), () => PC.grafJM(pcRG)],
    k: [() => PC.k91(pcRG)]
  },
  '9.2': {
    m: [() => PC.pecutanKira(pcRG), () => PC.pecutanKira(pcRG), () => PC.nyahpecutan(pcRG), () => PC.jenisP(pcRG), () => PC.unitKmjs(pcRG), () => PC.bs(pcRG)],
    s: [() => PC.lajuAkhir(pcRG), () => PC.masaP(pcRG), () => PC.tukarMs2(pcRG), () => PC.tukarKmj2(pcRG), () => PC.grafLM(pcRG)],
    k: [() => PC.k92(pcRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 9.1
WG.lajuKira = i => PC.lajuKira(pcRW, ['ms', 'kmj', 'mmin'][i % 3]);
WG.jarakKira = i => PC.jarakKira(pcRW, ['kmj', 'ms', 'mmin'][i % 3]);
WG.masaKira = i => PC.masaKira(pcRW, ['kmj', 'ms', 'mmin', 'kmj'][i % 4]);
WG.seragam = i => PC.seragam(pcRW, i);
WG.tukarUnit = i => PC.tukarUnit(pcRW, i);
WG.masaMinit = () => PC.masaMinit(pcRW);
WG.lajuPurata = () => PC.lajuPurata(pcRW);
WG.purataLaju = () => PC.purataLaju(pcRW);
WG.grafJM = i => PC.grafJM(pcRW, i);
WG.k91 = () => PC.k91(pcRW);
// 9.2
WG.pecutanKira = () => PC.pecutanKira(pcRW);
WG.nyahpecutan = () => PC.nyahpecutan(pcRW);
WG.jenisP = i => PC.jenisP(pcRW, i);
WG.unitKmjs = () => PC.unitKmjs(pcRW);
WG.bs = i => PC.bs(pcRW, i * 3 + wri(0, 2));
WG.lajuAkhir = i => PC.lajuAkhir(pcRW, i);
WG.masaP = i => PC.masaP(pcRW, i);
WG.tukarMs2 = () => PC.tukarMs2(pcRW);
WG.tukarKmj2 = () => PC.tukarKmj2(pcRW);
WG.grafLM = i => PC.grafLM(pcRW, i);
WG.k92 = () => PC.k92(pcRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '9.1': [['m', 'lajuKira', 4], ['m', 'jarakKira', 3], ['m', 'masaKira', 3], ['m', 'seragam', 3], ['m', 'tukarUnit', 3], ['m', 'masaMinit', 2], ['s', 'lajuPurata', 3], ['s', 'purataLaju', 2], ['s', 'grafJM', 4], ['k', 'k91', 3]],
  '9.2': [['m', 'pecutanKira', 5], ['m', 'nyahpecutan', 4], ['m', 'jenisP', 3], ['m', 'unitKmjs', 3], ['m', 'bs', 3], ['s', 'lajuAkhir', 2], ['s', 'masaP', 2], ['s', 'tukarMs2', 1], ['s', 'tukarKmj2', 1], ['s', 'grafLM', 3], ['k', 'k92', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan nombor + unit: jawapan + calon kesilapan biasa (unik, positif)
function pcOpts(ans, cands, f, allowNeg) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!isFinite(c) || (!allowNeg && c <= 0) || Math.abs(Math.round(c * 100) - c * 100) > 1e-6) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const st = Math.abs(ans) >= 20 ? Math.max(1, Math.round(Math.abs(ans) / 10)) : 1;
  for (let k = 1; w.length < 3 && k < 80; k++) { const vv = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * st; if (!allowNeg && vv <= 0) continue; const s = f(vv); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function pcOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pcMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const pcFU = u => x => pcU(x, u);
const CQGEN = {
  laju: [
    () => {
      const kind = pick(['ms', 'kmj']), U = PCUNIT[kind], v = kind === 'ms' ? ri(2, 12) : pick([40, 50, 60, 70, 80, 90]), t = kind === 'ms' ? ri(3, 12) : ri(2, 5), d = v * t;
      return pcMcq(`Jarak ${d} ${U.du} dilalui dalam ${t} ${U.tu}. Berapakah lajunya?`, pcTrip(['Mula', 'Tamat'], [{ d: `${d} ${U.du}`, t: `${t} ${U.tu}` }]), pcOpts(v, [d * t, v + t, d - t, v * 2], pcFU(U.vu)));
    },
    () => {
      let v, tm; do { v = pick([40, 48, 60, 64, 72, 80, 90, 100]); tm = pick([30, 45, 90, 150, 75]); } while ((v * tm) % 60);
      const d = v * tm / 60, h = Math.floor(tm / 60), mm = tm % 60;
      if (Math.random() < .5) return pcMcq(`Sebuah kereta bergerak pada ${v} km/j selama ${pcJM(tm)}. Berapakah jarak yang dilalui?`, pcTrip(['Mula', 'Tamat'], [{ d: '? km', t: pcJM(tm) }]), pcOpts(d, [v * (h + mm / 100), v * tm, v + tm, d + v / 2], pcFU('km')));
      const o = pcOptsT(pcJM(tm), [pcJM(tm + 15), pcJM(Math.max(15, tm - 15)), pcJM(tm + 60), pcJM(tm + 30), pcJM(tm * 2)]);
      return pcMcq(`Sebuah bas bergerak sejauh ${d} km pada laju seragam ${v} km/j. Berapakah masa yang diambil?`, pcTrip(['Mula', 'Tamat'], [{ d: `${d} km`, t: '? jam' }]), o);
    },
    () => {
      let v, tm, d; do { tm = pick([10, 12, 15, 20, 30, 40, 45]); v = ri(6, 20) * 6; d = v * tm / 60; } while (!Number.isInteger(d) || d < 2);
      return pcMcq(`Sebuah motosikal bergerak ${d} km dalam ${tm} minit. Berapakah lajunya dalam km/j?`, pcTrip(['Mula', 'Tamat'], [{ d: `${d} km`, t: `${tm} minit` }]), pcOpts(v, [d * tm, v / 2, v * 2, d * 6, v + 10], pcFU('km/j')));
    }
  ],
  purata: [
    () => {
      let d1, d2, t1, t2; do { t1 = ri(1, 3); t2 = ri(1, 3); d1 = t1 * pick([40, 50, 60, 70, 80]); d2 = t2 * pick([40, 50, 60, 70, 80, 90]); } while (!pcIsDec(d1 + d2, t1 + t2, 1));
      const D = d1 + d2, T = t1 + t2;
      return pcMcq(`Sebuah kereta bergerak ${d1} km dalam ${t1} jam, kemudian ${d2} km dalam ${t2} jam. Berapakah laju purata kereta itu?`, pcTrip(['A', 'B', 'C'], [{ d: `${d1} km`, t: `${t1} jam` }, { d: `${d2} km`, t: `${t2} jam` }]), pcOpts(D / T, [(d1 / t1 + d2 / t2) / 2, D, D / t1, D / T + 10, (d1 + d2) / 2], pcFU('km/j')));
    },
    () => {
      let d1, d2, t1, t2, rs; do { t1 = pick([60, 90, 120]); t2 = pick([60, 90, 120]); rs = pick([30, 60]); d1 = t1 / 60 * pick([40, 60, 80]); d2 = t2 / 60 * pick([40, 60, 80, 100]); } while (!Number.isInteger(d1) || !Number.isInteger(d2) || !pcIsDec((d1 + d2) * 60, t1 + t2 + rs, 1) || !pcIsDec((d1 + d2) * 60, t1 + t2, 1));
      const D = d1 + d2, T = t1 + t2 + rs;
      return pcMcq(`Sebuah bas bergerak ${d1} km dalam ${pcJM(t1)}, berhenti ${pcJM(rs)}, kemudian bergerak ${d2} km dalam ${pcJM(t2)}. Berapakah laju purata bas itu?`, pcTrip(['A', 'B', 'C'], [{ d: `${d1} km`, t: pcJM(t1) }, { d: `${d2} km`, t: pcJM(t2) }], { 1: `rehat ${pcJM(rs)}` }), pcOpts(D * 60 / T, [D * 60 / (t1 + t2), D / T, D * 60 / T + 5, D * 60 / T - 5], pcFU('km/j')));
    },
    () => { const q = PC.grafJM(pcRG, pick([0, 2, 3])), n = parseFloat(q.ans.replace('−', '-')), u = q.ans.split(' ').slice(1).join(' '); return pcMcq(q.q.replace('Graf jarak-masa di bawah', 'Graf jarak-masa ini').replace('di bawah', 'ini'), q.fig, pcOpts(n, [n * 2, n / 2, n + 10, n - 10], pcFU(u))); }
  ],
  unit: [
    () => { const k = ri(1, 7), v = 18 * k; return pcMcq(`Tukarkan ${v} km/j kepada m/s.`, pcTrip(['0 jam', '1 jam'], [{ d: `${v} km`, t: '1 jam' }]), pcOpts(5 * k, [v * 3.6, 5 * k + 5, v / 10, 10 * k, 18 * k / 5], pcFU('m/s'))); },
    () => { const v = ri(2, 25); return pcMcq(`Tukarkan ${v} m/s kepada km/j.`, pcTrip(['0 s', '1 s'], [{ d: `${v} m`, t: '1 saat' }]), pcOpts(v * 3.6, [v * 60, v * 36, v * 3.6 + 3.6, v * 3.6 - 3.6, v / 3.6], pcFU('km/j'))); },
    () => {
      if (Math.random() < .5) { const v = ri(2, 15); return pcMcq(`${v} m/s = ? m/min`, pcTrip(['0 s', '60 s'], [{ d: '? m', t: '1 minit' }]), pcOpts(v * 60, [v * 3600, v * 6, v * 100, v * 60 + 60], pcFU('m/min'))); }
      let a, t; do { a = ri(1, 4); t = ri(2, 10); } while ((a * t) % 5); const dv = a * t * 3.6;
      return pcMcq(`Laju bertambah ${pcN(dv)} km/j dalam ${t} s. Berapakah pecutan dalam m/s²?`, pcGauges(0, dv, `${t} s`, 'km/j'), pcOpts(a, [dv / t, a * 3.6, a + 1, a * t], pcFU('m/s²')));
    }
  ],
  pecutan: [
    () => { const a = ri(1, 6), t = ri(2, 8), u = ri(0, 10), v = u + a * t; return pcMcq(`Laju bertambah daripada ${u} m/s kepada ${v} m/s dalam ${t} s. Berapakah pecutannya?`, pcGauges(u, v, `${t} s`), pcOpts(a, [v - u, v / t, (u + v) / t, a + 2, t], pcFU('m/s²'))); },
    () => {
      if (Math.random() < .5) { const a = ri(1, 5), t = ri(2, 6), v = ri(0, 8), u = v + a * t; return pcMcq(`Sebuah kereta membrek. Lajunya berkurang daripada ${u} m/s kepada ${v} m/s dalam ${t} s. Berapakah pecutannya?`, pcGauges(u, v, `${t} s`), pcOpts(-a, [a, -(u - v), -(u + v) / t, -a - 1, -a + 1 || -2], pcFU('m/s²'), true)); }
      const kind = pick(['pos', 'neg', 'zero']), u = ri(5, 15), v = kind === 'pos' ? u + ri(3, 10) : kind === 'neg' ? u - ri(3, 5) : u;
      return pcMcq(`Laju sebuah objek berubah daripada ${u} m/s kepada ${v} m/s. Objek itu mengalami …`, pcGauges(u, v, '4 s'), pcOptsT({ pos: 'Pecutan', neg: 'Nyahpecutan', zero: 'Pecutan sifar' }[kind], ['Pecutan', 'Nyahpecutan', 'Pecutan sifar', 'Pegun']));
    },
    () => {
      if (Math.random() < .5) { const a = ri(1, 5), t = ri(2, 8), u = ri(0, 15), v = u + a * t; return pcMcq(`Laju awal ${u} m/s, pecutan ${a} m/s², masa ${t} s. Berapakah laju akhir?`, pcGauges(u, v, `${t} s`).replace(`>${v} m/s<`, '>? m/s<'), pcOpts(v, [u + a, a * t, u * a * t, v + a], pcFU('m/s'))); }
      const a = ri(2, 15), t = ri(2, 8), v = a * t;
      return pcMcq(`Sebuah kereta memecut dari keadaan pegun hingga ${v} km/j dalam ${t} s. Berapakah pecutannya?`, pcGauges(0, v, `${t} s`, 'km/j'), pcOpts(a, [v, v * t, a + 2, a * 2], pcFU('km/j per s')));
    }
  ]
};
const CQT = { laju: 'Laju, jarak & masa', purata: 'Laju purata', unit: 'Tukar unit', pecutan: 'Pecutan & nyahpecutan' };
function pcCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.laju;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['laju', 'laju', 'unit', 'pecutan', 'purata'] : Object.keys(CQT);
  return pcCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pcCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
