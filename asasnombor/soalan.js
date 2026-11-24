'use strict';
/* =================== ASAS NOMBOR · SOALAN BAB 2 (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "an" / "AN" supaya tidak bertembung dengan teras.

/* =================== rawak =================== */
// anRG untuk Latihan Kelas / games, anRW (berbenih) untuk Lembaran Kerja
const anRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const anRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const anShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// pilih cara tanya (sama seperti vq teras) tetapi kekalkan semua medan (fig dsb.)
function anVQ(key, d, extra) {
  const list = QV[key], u = VUSE[key] || (VUSE[key] = list.map(() => 0));
  const min = Math.min(...u), idx = [];
  u.forEach((c, i) => { if (c === min) idx.push(i); });
  const k = idx[Math.floor(VR() * idx.length)];
  u[k]++;
  const v = list[k](d);
  const o = Object.assign({ fig: '', figAns: '' }, extra || {}, v);
  o.ans = v.ans || d.ans;
  o.work = v.work || (v.pre || []).concat(d.work || []);
  delete o.pre;
  return o;
}

/* =================== matematik asas nombor =================== */
const anTo = (n, b) => n.toString(b);
const anFrom = (s, b) => { s = String(s); for (const c of s) if (+c >= b) throw new Error('digit ' + c + ' tidak sah dalam asas ' + b); return parseInt(s, b); };
const anN = (s, b) => `${s}<sub>${b}</sub>`;
const anNu = (s, b, k) => { s = String(s); return `${s.slice(0, k)}<u>${s[k]}</u>${s.slice(k + 1)}<sub>${b}</sub>`; };
const ANSUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const anPw = (b, p) => (p === 0 ? `${b}<sup>0</sup>` : p === 1 ? `${b}<sup>1</sup>` : `${b}<sup>${p}</sup>`);
const ANWORD = { 2: 'dua', 3: 'tiga', 4: 'empat', 5: 'lima', 6: 'enam', 7: 'tujuh', 8: 'lapan', 9: 'sembilan', 10: 'sepuluh' };
const anAs = b => `asas ${ANWORD[b]}`;
// nombor rawak dalam asas b dengan len digit (digit pertama bukan 0)
function anRand(r, b, len) { let s = String(r.i(1, b - 1)); for (let i = 1; i < len; i++) s += r.i(0, b - 1); return s; }
// nombor rawak dengan digit berbeza
function anRandD(r, b, len) {
  const ds = anShuf(r, Array.from({ length: b }, (_, i) => i)).slice(0, len);
  if (ds[0] === 0) { const k = ds.findIndex(x => x); [ds[0], ds[k]] = [ds[k], ds[0]]; }
  return ds.join('');
}
// pengembangan: [baris nilai tempat, baris nilai digit] → nilai
function anExp(s, b) {
  const n = s.length, a = [], v = [];
  for (let i = 0; i < n; i++) { const p = n - 1 - i, d = +s[i]; a.push(p === 0 ? `${d}(1)` : `${d}(${anPw(b, p)})`); v.push(d * b ** p); }
  return [`${anN(s, b)} = ${a.join(' + ')}`, `= ${v.join(' + ')} = ${anFrom(s, b)}`];
}
// pembahagian berulang
function anDiv(n, b) {
  const w = []; let m = n;
  while (m) { w.push(`${m} ÷ ${b} = ${Math.floor(m / b)} baki ${m % b}`); m = Math.floor(m / b); }
  w.push(`Baca baki dari bawah ke atas: ${anN(anTo(n, b), b)}`);
  return w;
}
// lajur tambah: pulangkan hasil & senarai bawa (indeks dari kanan)
function anAdd(a, c, b) {
  const s = anTo(anFrom(a, b) + anFrom(c, b), b), carry = [], w = [];
  const A = a.padStart(s.length, '0'), C = c.padStart(s.length, '0');
  let k = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const t = +A[i] + +C[i] + k, nm = ['sa', 'kedua', 'ketiga', 'keempat', 'kelima', 'keenam', 'ketujuh', 'kelapan'][s.length - 1 - i];
    if (i === 0 && k && +A[i] === 0 && +C[i] === 0) { w.push(`Lajur ${nm}: bawa 1 → tulis 1`); break; }
    if (t >= b) w.push(`Lajur ${nm}: ${+A[i]} + ${+C[i]}${k ? ' + 1' : ''} = ${t} = 1(${b}) + ${t - b} → tulis ${t - b}, bawa 1`);
    else if (i >= s.length - Math.max(a.length, c.length)) w.push(`Lajur ${nm}: ${+A[i]} + ${+C[i]}${k ? ' + 1' : ''} = ${t} → tulis ${t}`);
    carry.push(t >= b ? 1 : 0); k = t >= b ? 1 : 0;
  }
  return { s, carry, w };
}
// lajur tolak: langkah pinjam
function anSub(a, c, b) {
  const s = anTo(anFrom(a, b) - anFrom(c, b), b), A = a.split('').map(Number), C = c.padStart(a.length, '0').split('').map(Number), w = [];
  let bw = 0;
  for (let i = a.length - 1; i >= 0; i--) {
    const nm = ['sa', 'kedua', 'ketiga', 'keempat', 'kelima', 'keenam', 'ketujuh', 'kelapan'][a.length - 1 - i];
    if (i < a.length - c.length && !bw) { if (+a.slice(0, i + 1)) w.push(`Digit selebihnya (${a.slice(0, i + 1)}) diturunkan terus.`); break; }
    const top = A[i] - bw, tt = `${A[i]}${bw ? ' − 1' : ''}`;
    if (top < C[i]) { w.push(`Lajur ${nm}: ${fmt(top)} &lt; ${C[i]}, pinjam 1 (= ${b}) daripada lajur kiri: ${tt} + ${b} − ${C[i]} = ${top + b - C[i]}`); bw = 1; }
    else { w.push(`Lajur ${nm}: ${tt} − ${C[i]} = ${top - C[i]}`); bw = 0; }
  }
  return { s, w };
}

/* =================== rajah (SVG, warna var(--…)) =================== */
const anR1 = v => Math.round(v * 10) / 10;
const anT = (x, y, t, c = 'tx', sz = 18, a = 'middle', w = 700) => `<text x="${anR1(x)}" y="${anR1(y)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
// nombor dengan subskrip asas dalam SVG
const anSV = (s, b, sz) => `<tspan>${s}</tspan><tspan dy="${anR1(sz * .32)}" font-size="${anR1(sz * .6)}">${b}</tspan>`;
const anSVr = (s, b, sz) => `${anSV(s, b, sz)}<tspan dy="${-anR1(sz * .32)}"></tspan>`;
const anBox = (x, y, w, h, c = 'bd', f = 'surf', rx = 10, sw = 2) => `<rect x="${anR1(x)}" y="${anR1(y)}" width="${anR1(w)}" height="${anR1(h)}" rx="${rx}" style="fill:var(--${f});stroke:var(--${c})" stroke-width="${sw}"/>`;
const anLn = (x1, y1, x2, y2, c = 'mu', w = 2) => `<line x1="${anR1(x1)}" y1="${anR1(y1)}" x2="${anR1(x2)}" y2="${anR1(y2)}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"/>`;
const anSvg = (w, h, inner, label) => `<svg viewBox="0 0 ${anR1(w)} ${anR1(h)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${inner}</svg>`;
// jadual nilai tempat: s = rentetan digit (boleh ada huruf), hl = indeks diserlahkan, vals: tunjuk nilai tempat (true / '?' / false)
function anPV(s, b, o = {}) {
  const n = s.length, cw = 64, rows = o.vals === false ? 2 : 3, rh = 40, W = n * cw + 20, Hh = rows * rh + 20;
  let g = anBox(10, 10, n * cw, rows * rh, 'bd', 'surf', 12);
  for (let i = 0; i < n; i++) {
    const p = n - 1 - i, x = 10 + i * cw;
    if (o.hl === i) g += `<rect x="${x + 3}" y="13" width="${cw - 6}" height="${rows * rh - 6}" rx="8" style="fill:var(--am);fill-opacity:.16;stroke:var(--am)" stroke-width="2"/>`;
    if (i) g += anLn(x, 14, x, 10 + rows * rh - 4, 'bd', 1.5);
    g += anT(x + cw / 2, 10 + rh / 2, `${b}${ANSUP[p]}`, 'mu', 16);
    if (rows === 3) g += anT(x + cw / 2, 10 + rh * 1.5, o.vals === '?' ? '?' : String(b ** p), o.vals === '?' ? 'mu' : 'tr', 16);
    g += anT(x + cw / 2, 10 + rh * (rows - .5), s[i], /[a-z]/.test(s[i]) ? 'pk' : 'tx', 22, 'middle', 800);
  }
  for (let r = 1; r < rows; r++) g += anLn(12, 10 + r * rh, 8 + n * cw, 10 + r * rh, 'bd', 1.5);
  return anSvg(W, Hh, g, o.label || `Jadual nilai tempat asas ${b}`);
}
// kad nombor (untuk games): lines = [[teks SVG, warna]]
function anCard(lines, label) {
  const H0 = 28 + lines.length * 46;
  let g = anBox(6, 6, 348, H0 - 12, 'bd', 'surf', 16);
  lines.forEach(([t, c, sz], i) => { g += anT(180, 36 + i * 46, t, c || 'tx', sz || 26, 'middle', 800); });
  return anSvg(360, H0, g, label || 'Kad nombor');
}
// pembahagian berulang
function anLadder(n, b) {
  const rows = []; let m = n;
  while (m) { rows.push([m, m % b]); m = Math.floor(m / b); }
  const rh = 34, Hh = 30 + (rows.length + 1) * rh, W = 260;
  let g = '';
  rows.forEach(([v], k) => {
    const y = 26 + k * rh;
    g += anT(24, y, String(b), 'pa', 18) + anLn(38, y - 14, 38, y + 14, 'mu') + anT(48, y, String(v), 'tx', 18, 'start') + anLn(38, y + 15, 120, y + 15, 'mu');
  });
  g += anT(48, 26 + rows.length * rh, '0', 'mu', 18, 'start');
  rows.forEach(([, r], k) => { g += anT(140, 26 + (k + 1) * rh, `baki ${r}`, 'am', 16, 'start'); });
  g += `<path d="M222 ${26 + rows.length * rh + 6} V${26 + rh - 8}" style="stroke:var(--gr)" stroke-width="3" fill="none"/><path d="M214 ${26 + rh} L222 ${26 + rh - 10} L230 ${26 + rh}" style="stroke:var(--gr)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return anSvg(W, Hh, g, `Pembahagian berulang ${n} dengan ${b}`);
}
// lajur tambah / tolak
function anCol(a, c, res, b, op, carry) {
  const n = Math.max(a.length, c.length, res ? res.length : 0) + (res ? 0 : 1), cw = 34, x1 = 52, rh = 40;
  const W = x1 + n * cw + 40, Hh = 4 * rh + 34;
  let g = '';
  const row = (s, y, col) => { s = s.padStart(n, ' '); for (let i = 0; i < n; i++) if (s[i] !== ' ') g += anT(x1 + i * cw + cw / 2, y, s[i], col, 24, 'middle', 800); };
  row(a, rh + 12, 'tx'); row(c, 2 * rh + 12, 'tx');
  g += anT(26, 2 * rh + 12, op, 'pa', 24, 'middle', 800);
  g += anT(x1 + n * cw + 4, rh + 20, String(b), 'mu', 13, 'start') + anT(x1 + n * cw + 4, 2 * rh + 20, String(b), 'mu', 13, 'start');
  g += anLn(14, 2 * rh + 34, x1 + n * cw + 22, 2 * rh + 34, 'mu', 2.5) + anLn(14, 3 * rh + 40, x1 + n * cw + 22, 3 * rh + 40, 'mu', 2.5);
  if (res) { row(res, 3 * rh + 16, 'gr'); g += anT(x1 + n * cw + 4, 3 * rh + 24, String(b), 'gr', 13, 'start'); }
  else for (let i = n - Math.max(a.length, c.length) - 1; i < n; i++) g += anBox(x1 + i * cw + 4, 2 * rh + 42, cw - 8, rh - 12, 'dim', 'surf', 6, 1.5);
  if (carry) carry.forEach((k, j) => { if (k) { const i = n - 2 - j; g += `<circle cx="${x1 + i * cw + cw / 2}" cy="14" r="10" style="fill:var(--am);fill-opacity:.22;stroke:var(--am)" stroke-width="1.5"/>` + anT(x1 + i * cw + cw / 2, 14, '1', 'am', 13); } });
  return anSvg(W, Hh, g, op === '+' ? 'Penambahan bentuk lajur' : 'Penolakan bentuk lajur');
}
// konsep pengumpulan: g kumpulan b dan s biji
function anGroup(g, s, b) {
  const cols = Math.ceil(b / 2), dw = 20, bw = cols * dw + 14, bh = 2 * dw + 14, per = Math.floor(330 / (bw + 10));
  let out = '', x = 14, y = 14, k = 0;
  for (let i = 0; i < g; i++) {
    if (k === per) { k = 0; x = 14; y += bh + 12; }
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" style="fill:var(--tr);fill-opacity:.12;stroke:var(--tr)" stroke-width="2"/>`;
    for (let j = 0; j < b; j++) out += `<circle cx="${x + 7 + dw / 2 + (j % cols) * dw}" cy="${y + 7 + dw / 2 + Math.floor(j / cols) * dw}" r="7.5" style="fill:var(--pa)"/>`;
    x += bw + 10; k++;
  }
  y += bh + 18; x = 20;
  for (let j = 0; j < s; j++) out += `<circle cx="${x + j * 22 + 8}" cy="${y + 10}" r="7.5" style="fill:var(--pa)"/>`;
  if (!s) out += anT(20, y + 10, 'tiada guli berbaki', 'mu', 13, 'start', 600);
  return anSvg(360, y + 32, out, `${g} kumpulan ${b} biji guli dan ${s} biji guli`);
}
// abakus: tiang dengan manik
function anAbacus(s, b) {
  const n = s.length, cw = 62, W = n * cw + 30, Hh = 40 + (b - 1) * 17 + 50;
  let g = anLn(10, Hh - 34, W - 10, Hh - 34, 'mu', 4);
  for (let i = 0; i < n; i++) {
    const x = 15 + i * cw + cw / 2, p = n - 1 - i;
    g += anLn(x, 16, x, Hh - 34, 'mu', 3);
    for (let j = 0; j < +s[i]; j++) g += `<ellipse cx="${x}" cy="${Hh - 44 - j * 17}" rx="17" ry="7.5" style="fill:var(--${['tr', 'pa', 'gr', 'pu', 'pk'][i % 5]})"/>`;
    g += anT(x, Hh - 16, `${b}${ANSUP[p]}`, 'mu', 14);
  }
  return anSvg(W, Hh, g, `Abakus asas ${b}`);
}
// papan lampu perduaan
function anLamps(bits, lab = true) {
  const n = bits.length, W = n * 52 + 16;
  let g = '';
  for (let i = 0; i < n; i++) {
    const x = 34 + i * 52, on = bits[i] === '1';
    g += `<circle cx="${x}" cy="34" r="18" style="fill:var(--${on ? 'am' : 'dim'});stroke:var(--${on ? 'am' : 'mu2'})" stroke-width="2.5"/>`;
    if (on) g += `<circle cx="${x}" cy="34" r="24" fill="none" style="stroke:var(--am)" stroke-width="1.5" stroke-dasharray="3 4"/>`;
    if (lab) g += anT(x, 74, on ? 'nyala' : 'padam', on ? 'am' : 'mu', 11, 'middle', 600);
  }
  return anSvg(W, lab ? 90 : 66, g, 'Papan lampu: menyala mewakili 1, padam mewakili 0');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 2.1.1 ---------- */
  tempat: [
    ({ U, b }) => ({ q: `Nyatakan nilai tempat bagi digit yang bergaris dalam ${U}.` }),
    ({ U, b }) => ({ q: `Apakah nilai tempat digit bergaris dalam nombor ${U}? Beri jawapan dalam bentuk indeks dan nombor.` }),
    ({ U, d }) => ({ q: `Dalam nombor ${U}, digit ${d} digariskan. Nyatakan nilai tempatnya.` }),
    ({ U, b, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata nilai tempat digit bergaris dalam ${U} ialah ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${N} mengira nilai tempat bermula dengan ${b}<sup>1</sup> pada digit paling kanan. Digit paling kanan mempunyai nilai tempat ${b}<sup>0</sup> = 1.`)); }
  ],
  digit: [
    ({ U }) => ({ q: `Cari nilai digit bagi digit yang bergaris dalam ${U}.` }),
    ({ U, d }) => ({ q: `Hitung nilai digit ${d} yang bergaris dalam nombor ${U}. Beri jawapan dalam asas sepuluh.` }),
    ({ U }) => ({ q: `Berapakah nilai digit bagi digit bergaris dalam ${U}?` }),
    ({ U, d, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menyatakan bahawa nilai digit bagi digit bergaris dalam ${U} ialah ${d}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya menulis digit itu. Nilai digit = digit × nilai tempat.`)); },
    ({ U, d }) => ({ q: `Digit ${d} digariskan dalam ${U}. Nyatakan nilai digitnya.` })
  ],
  sah: [
    ({ b, list }) => ({ q: `Antara nombor berikut, yang manakah <b>bukan</b> nombor dalam ${anAs(b)}?<br>${list}` }),
    ({ big }) => ({ q: `Nyatakan asas terkecil yang mungkin bagi nombor ${big}.`, ans: `Asas ${(Math.max(...big.split('').map(Number)) + 1)}`, work: [`Digit terbesar dalam ${big} ialah ${Math.max(...big.split('').map(Number))}.`, `Asas mesti lebih besar daripada digit terbesar, maka asas terkecil ialah ${Math.max(...big.split('').map(Number)) + 1}.`] }),
    ({ b2 }) => ({ q: `Tulis (a) digit terbesar dan (b) nombor tiga digit terbesar dalam ${anAs(b2)}.`, ans: `(a) ${b2 - 1} (b) ${anN(String(b2 - 1).repeat(3), b2)}`, work: [`Asas ${b2} menggunakan digit 0 hingga ${b2 - 1}.`, `Nombor tiga digit terbesar menggunakan digit ${b2 - 1} pada setiap tempat.`] }),
    ({ b3, s3, ok3 }) => ({ q: `Adakah ${anN(s3, b3)} nombor yang sah dalam ${anAs(b3)}? Berikan sebab.`, ans: ok3 ? 'Ya, sah' : 'Tidak sah', work: [ok3 ? `Semua digit dalam ${s3} kurang daripada ${b3}.` : `${s3} mengandungi digit ${Math.max(...s3.split('').map(Number))} yang tidak kurang daripada ${b3}.`] })
  ],
  kumpul: [
    ({ b }) => ({ q: `Rajah di bawah menunjukkan beberapa biji guli yang dikumpulkan dalam kumpulan ${ANWORD[b]}. Tulis bilangan guli itu sebagai nombor dalam ${anAs(b)}.` }),
    ({ b }) => ({ q: `Setiap kotak biru mengandungi ${b} biji guli. Nyatakan jumlah guli dalam rajah sebagai nombor ${anAs(b)}.` }),
    ({ b, n }) => ({ q: `Sebanyak ${n} biji guli dikumpulkan dalam kumpulan ${ANWORD[b]} seperti dalam rajah. Tulis ${n} sebagai nombor dalam ${anAs(b)}.` })
  ],
  nilai: [
    ({ s, b }) => ({ q: `Nyatakan nilai nombor ${anN(s, b)} dalam asas sepuluh.` }),
    ({ s, b }) => ({ q: `Cari nilai digit setiap digit dalam ${anN(s, b)}, seterusnya nyatakan nilai nombor itu.` }),
    ({ s, b }) => ({ q: `Tulis ${anN(s, b)} dalam bentuk pengembangan nilai tempat dan hitung nilainya dalam asas sepuluh.` }),
    ({ s, b }) => ({ q: `Dengan menggunakan jadual nilai tempat, hitung nilai nombor ${anN(s, b)}.` })
  ],
  beza: [
    ({ s, b, d1, d2 }) => ({ q: `Hitung beza antara nilai digit ${d1} dan nilai digit ${d2} dalam ${anN(s, b)}.` }),
    ({ s, b, d1, d2 }) => ({ q: `Dalam nombor ${anN(s, b)}, berapakah nilai digit ${d1} lebih besar atau lebih kecil daripada nilai digit ${d2}? Nyatakan bezanya.` }),
    ({ s, b, d1, d2, v1, v2 }) => ({ q: `Cari hasil tambah nilai digit ${d1} dan nilai digit ${d2} dalam ${anN(s, b)}.`, ans: `${v1 + v2}`, work: [`Nilai digit ${d1} = ${v1}`, `Nilai digit ${d2} = ${v2}`, `${v1} + ${v2} = ${v1 + v2}`] })
  ],
  hilang: [
    ({ T, b, v }) => ({ q: `Dalam nombor ${T}, nilai digit bagi digit <i>k</i> ialah ${v}. Cari nilai <i>k</i>.` }),
    ({ T, b, v }) => ({ q: `Nombor ${T} mempunyai satu digit <i>k</i> yang tidak diketahui. Diberi nilai digit <i>k</i> ialah ${v}, cari <i>k</i>.` }),
    ({ T, b, v }) => ({ q: `Diberi nilai digit bagi <i>k</i> dalam ${T} ialah ${v}. Tentukan digit <i>k</i>.` })
  ],
  k211: [
    ({ A }) => ({ q: `Rajah di bawah menunjukkan nombor ${anN(A.s, A.b)} dalam jadual nilai tempat.<br>(a) Nyatakan nilai tempat setiap digit.<br>(b) Cari nilai digit bagi digit ${A.d}.<br>(c) Hitung nilai nombor itu dalam asas sepuluh.`, ans: `(a) ${A.pv} (b) ${A.dv} (c) ${A.val}`, work: A.work, fig: A.fig, figAns: A.figAns }),
    ({ Bq }) => ({ q: `Rajah di bawah menunjukkan sebuah abakus ${anAs(Bq.b)}.<br>(a) Tulis nombor yang diwakili oleh abakus itu.<br>(b) Nyatakan nilai digit bagi manik pada tiang ${Bq.b}${ANSUP[Bq.p]}.<br>(c) ${Bq.add} manik lagi dimasukkan pada tiang ${Bq.b}⁰. Tulis nombor baharu yang diwakili oleh abakus itu dalam ${anAs(Bq.b)}.`, ans: `(a) ${anN(Bq.s, Bq.b)} (b) ${Bq.dv} (c) ${Bq.addTxt}`, work: Bq.work, fig: Bq.fig }),
    ({ Cq }) => ({ q: `Diberi P = ${anN(Cq.s1, Cq.b1)} dan Q = ${anN(Cq.s2, Cq.b2)}.<br>(a) Cari nilai digit ${Cq.d} dalam P.<br>(b) Cari nilai digit ${Cq.d} dalam Q.<br>(c) Nombor manakah yang mempunyai nilai lebih besar, dan berapakah bezanya?`, ans: `(a) ${Cq.v1} (b) ${Cq.v2} (c) ${Cq.big}, beza ${Cq.diff}`, work: Cq.work })
  ],
  /* ---------- 2.1.2 ---------- */
  ke10: [
    ({ s, b }) => ({ q: `Tukar ${anN(s, b)} kepada nombor asas sepuluh.` }),
    ({ s, b }) => ({ q: `Ungkapkan ${anN(s, b)} sebagai nombor dalam asas sepuluh.` }),
    ({ s, b }) => ({ q: `Nyatakan ${anN(s, b)} dalam asas sepuluh.` }),
    ({ s, b }) => ({ q: `Tukar nombor ${anAs(b)} ${anN(s, b)} kepada asas sepuluh dengan menggunakan nilai tempat.` }),
    ({ s, b, ans }) => { const N = vnama(), ds = s.split('').reduce((t, c) => t + +c, 0); return Object.assign({ q: `${N} berkata ${anN(s, b)} = ${ds} kerana ${s.split('').join(' + ')} = ${ds}. Adakah ${N} betul?` }, salah(N, ans, `${N} menambah digit sahaja. Setiap digit mesti didarab dengan nilai tempatnya.`)); }
  ],
  dari10: [
    ({ n, b }) => ({ q: `Tukar ${n} kepada nombor dalam ${anAs(b)}.` }),
    ({ n, b }) => ({ q: `Ungkapkan ${n}<sub>10</sub> sebagai nombor dalam ${anAs(b)}.` }),
    ({ n, b }) => ({ q: `Dengan menggunakan kaedah pembahagian berulang, tukar ${n} kepada nombor ${anAs(b)}.` }),
    ({ n, b }) => ({ q: `Nyatakan ${n} sebagai nombor dalam asas ${b}.` }),
    ({ n, b, ans, s }) => { const N = vnama(), rv = s.split('').reverse().join(''); if (rv === s) return { q: `Tukar ${n} kepada nombor dalam ${anAs(b)}. Semak jawapan anda dengan menukar semula kepada asas sepuluh.` }; return Object.assign({ q: `${N} menukar ${n} kepada ${anAs(b)} dan mendapat ${anN(rv, b)}. Adakah ${N} betul?` }, salah(N, ans, `${N} membaca baki dari atas ke bawah. Baki mesti dibaca dari bawah ke atas.`)); }
  ],
  dua8: [
    ({ s2, w2 }) => ({ q: `Tukar ${anN(s2, 2)} kepada asas lapan dengan kaedah yang sesuai.`, ans: anN(anTo(anFrom(s2, 2), 8), 8), work: w2 }),
    ({ s2, w2 }) => ({ q: `Dengan mengumpulkan tiga digit, tukar ${anN(s2, 2)} kepada asas lapan.`, ans: anN(anTo(anFrom(s2, 2), 8), 8), work: w2 }),
    ({ s8, w8 }) => ({ q: `Nyatakan ${anN(s8, 8)} sebagai nombor asas dua.`, ans: anN(anTo(anFrom(s8, 8), 2), 2), work: w8 }),
    ({ s8, w8 }) => ({ q: `Tulis setiap digit ${anN(s8, 8)} sebagai tiga digit asas dua. Seterusnya, nyatakan nombor itu dalam asas dua.`, ans: anN(anTo(anFrom(s8, 8), 2), 2), work: w8 })
  ],
  antara: [
    ({ s, b, c }) => ({ q: `Tukarkan ${anN(s, b)} kepada ${anAs(c)}.` }),
    ({ s, b, c }) => ({ q: `Ungkapkan ${anN(s, b)} sebagai nombor dalam asas ${c}.` }),
    ({ s, b, c }) => ({ q: `Tukar ${anN(s, b)} kepada asas sepuluh, kemudian kepada ${anAs(c)}.` }),
    ({ s, b, c, ans }) => { const N = vnama(); if (s.split('').some(x => +x >= c)) return { q: `Tukar ${anN(s, b)} kepada ${anAs(c)}. Semak jawapan dengan menukar kedua-dua nombor kepada asas sepuluh.` }; return Object.assign({ q: `${N} berkata ${anN(s, b)} = ${anN(s, c)} kerana digitnya sama. Adakah ${N} betul?` }, salah(N, ans, `Digit berubah apabila asas berubah. Tukar ${anN(s, b)} ke asas sepuluh dahulu.`)); }
  ],
  semak: [
    ({ L, R }) => ({ q: `Tentukan sama ada ${L} = ${R}.` }),
    ({ L, R }) => ({ q: `Benar atau palsu: ${L} = ${R}? Tunjukkan jalan kerja.` }),
    ({ L, R }) => ({ q: `Adakah ${L} dan ${R} mewakili nilai yang sama? Buktikan.` })
  ],
  k212: [
    ({ A }) => ({ q: `(a) Tukar ${anN(A.s, A.b)} kepada nombor dalam asas sepuluh.<br>(b) Seterusnya, tukar jawapan (a) kepada nombor dalam ${anAs(A.c)}.<br>(c) Tukar jawapan (a) kepada nombor dalam asas dua.`, ans: `(a) ${A.n} (b) ${anN(A.sc, A.c)} (c) ${anN(A.s2, 2)}`, work: A.work, figAns: A.figAns }),
    ({ Bq }) => ({ q: `(a) Tukar ${Bq.n} kepada nombor dalam asas dua.<br>(b) Dengan mengumpulkan tiga digit, tukar jawapan (a) kepada asas lapan.<br>(c) Semak jawapan (b) dengan pembahagian berulang ${Bq.n} dengan 8.`, ans: `(a) ${anN(Bq.s2, 2)} (b) ${anN(Bq.s8, 8)} (c) Sama`, work: Bq.work, figAns: Bq.figAns }),
    ({ Cq }) => ({ q: `Diberi P = ${anN(Cq.s1, Cq.b1)} dan Q = ${anN(Cq.s2, Cq.b2)}.<br>(a) Tukar P dan Q kepada asas sepuluh.<br>(b) Nyatakan nombor yang lebih besar.<br>(c) Ungkapkan P + Q sebagai nombor dalam ${anAs(Cq.c)}.`, ans: `(a) P = ${Cq.n1}, Q = ${Cq.n2} (b) ${Cq.n1 > Cq.n2 ? 'P' : 'Q'} (c) ${anN(Cq.sum, Cq.c)}`, work: Cq.work })
  ],
  /* ---------- 2.1.3 ---------- */
  tambah: [
    ({ a, c, b }) => ({ q: `Hitung ${anN(a, b)} + ${anN(c, b)}. Beri jawapan dalam ${anAs(b)}.` }),
    ({ a, c, b }) => ({ q: `Selesaikan ${anN(a, b)} + ${anN(c, b)}.` }),
    ({ a, c, b }) => ({ q: `Dengan menggunakan bentuk lajur, cari hasil tambah ${anN(a, b)} dan ${anN(c, b)}.` }),
    ({ a, c, b }) => ({ q: `Lengkapkan penambahan dalam ${anAs(b)} di bawah.` }),
    ({ a, c, b, ans, wrong }) => { const N = vnama(); if (!wrong) return { q: `Tambah ${anN(a, b)} dan ${anN(c, b)}. Nyatakan jawapan dalam ${anAs(b)}.` }; return Object.assign({ q: `${N} menghitung ${anN(a, b)} + ${anN(c, b)} = ${anN(wrong, b)}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak membawa 1 apabila hasil tambah satu lajur ≥ ${b}.`)); }
  ],
  tolak: [
    ({ a, c, b }) => ({ q: `Hitung ${anN(a, b)} − ${anN(c, b)}. Beri jawapan dalam ${anAs(b)}.` }),
    ({ a, c, b }) => ({ q: `Selesaikan ${anN(a, b)} − ${anN(c, b)}.` }),
    ({ a, c, b }) => ({ q: `Cari beza antara ${anN(a, b)} dan ${anN(c, b)} dalam ${anAs(b)}.` }),
    ({ a, c, b }) => ({ q: `Lengkapkan penolakan dalam ${anAs(b)} di bawah.` }),
    ({ a, c, b }) => ({ q: `Tolak ${anN(c, b)} daripada ${anN(a, b)}. Semak jawapan anda dengan penambahan.` })
  ],
  dua: [
    ({ a, c, op }) => ({ q: `Hitung ${anN(a, 2)} ${op} ${anN(c, 2)}.` }),
    ({ a, c, op }) => ({ q: `Selesaikan operasi asas dua berikut: ${anN(a, 2)} ${op} ${anN(c, 2)}.` }),
    ({ a, c, op }) => ({ q: `${op === '+' ? 'Cari hasil tambah' : 'Cari beza antara'} ${anN(a, 2)} dan ${anN(c, 2)}. Beri jawapan dalam asas dua.` }),
    ({ a, c, op }) => ({ q: `Lengkapkan ${op === '+' ? 'penambahan' : 'penolakan'} dalam asas dua di bawah.` })
  ],
  tigaOp: [
    ({ E, b }) => ({ q: `Hitung ${E}. Beri jawapan dalam ${anAs(b)}.` }),
    ({ E }) => ({ q: `Selesaikan ${E}.` }),
    ({ E, b }) => ({ q: `Nilaikan ${E} dan nyatakan jawapan dalam asas ${b}.` })
  ],
  campur: [
    ({ x, y, op, c }) => ({ q: `Hitung ${x} ${op} ${y}. Beri jawapan dalam ${anAs(c)}.` }),
    ({ x, y, op, c }) => ({ q: `Ungkapkan ${x} ${op} ${y} sebagai nombor dalam asas ${c}.` }),
    ({ x, y, op, c }) => ({ q: `Nombor ${x} dan ${y} mempunyai asas yang berbeza. Cari ${op === '+' ? 'hasil tambah' : 'beza'} kedua-duanya dalam ${anAs(c)}.` }),
    ({ x, y, op, c, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menulis ${x} ${op} ${y} dengan terus ${op === '+' ? 'menambah' : 'menolak'} digit-digitnya. Adakah cara ini betul? Cari jawapan sebenar dalam ${anAs(c)}.` }, salah(N, ans, 'Nombor dalam asas berbeza tidak boleh ditambah atau ditolak terus. Tukar kedua-duanya ke asas sepuluh dahulu.')); }
  ],
  cariX: [
    ({ L, b }) => ({ q: `Diberi ${L}. Cari nilai <i>x</i> dalam ${anAs(b)}.` }),
    ({ L, b }) => ({ q: `Cari <i>x</i> jika ${L}. Nyatakan <i>x</i> sebagai nombor ${anAs(b)}.` }),
    ({ L }) => ({ q: `Tentukan nombor <i>x</i> yang memuaskan ${L}.` })
  ],
  k213: [
    ({ A }) => ({ q: `Sebuah kedai menyimpan rekod stok dalam asas lapan. Stok awal ialah ${anN(A.s0, 8)} batang pen. Kedai itu menjual ${anN(A.j, 8)} batang pen dan kemudian menerima ${anN(A.t, 8)} batang pen.<br>(a) Hitung baki stok dalam asas lapan.<br>(b) Nyatakan baki stok itu dalam asas sepuluh.`, ans: `(a) ${anN(A.res, 8)} (b) ${A.dec}`, work: A.work }),
    ({ Bq }) => ({ q: `Diberi P = ${anN(Bq.p, 2)} dan Q = ${anN(Bq.q, 2)}.<br>(a) Hitung P + Q.<br>(b) Hitung P − Q.<br>(c) Semak jawapan (a) dan (b) dengan menukar kepada asas sepuluh.`, ans: `(a) ${anN(Bq.sum, 2)} (b) ${anN(Bq.dif, 2)} (c) ${Bq.chk}`, work: Bq.work }),
    ({ Cq }) => ({ q: `Hasil tambah dua nombor dalam ${anAs(Cq.b)} ialah ${anN(Cq.sum, Cq.b)}. Salah satu nombor itu ialah ${anN(Cq.a, Cq.b)}.<br>(a) Cari nombor yang satu lagi dalam ${anAs(Cq.b)}.<br>(b) Nyatakan kedua-dua nombor dalam asas sepuluh.`, ans: `(a) ${anN(Cq.c, Cq.b)} (b) ${Cq.na} dan ${Cq.nc}`, work: Cq.work })
  ],
  /* ---------- 2.1.4 ---------- */
  susun: [
    ({ list }) => ({ q: `Susun nombor berikut mengikut tertib menaik: ${list}.` }),
    ({ list, desc }) => ({ q: `Susun nombor berikut mengikut tertib menurun: ${list}.`, ans: desc }),
    ({ list, big }) => ({ q: `Antara ${list}, nombor manakah yang paling besar?`, ans: big }),
    ({ list, small }) => ({ q: `Kenal pasti nombor yang paling kecil antara ${list}.`, ans: small })
  ],
  cariP: [
    ({ T, v }) => ({ q: `Diberi ${T} = ${v}. Cari nilai <i>p</i>.` }),
    ({ T, v }) => ({ q: `Nombor ${T} bersamaan dengan ${v} dalam asas sepuluh. Tentukan digit <i>p</i>.` }),
    ({ T, v }) => ({ q: `Jika ${T} = ${v}<sub>10</sub>, apakah nilai <i>p</i>?` }),
    ({ T, v, ans, wrongP, wv }) => { const N = vnama(); if (wrongP == null) return { q: `Cari digit <i>p</i> supaya ${T} = ${v}.` }; return Object.assign({ q: `${N} mendapati <i>p</i> = ${wrongP} bagi ${T} = ${v}. Adakah ${N} betul?` }, salah(N, ans, `Jika <i>p</i> = ${wrongP}, nilai nombor itu ialah ${wv}, bukan ${v}.`)); }
  ],
  lampu: [
    ({ bits }) => ({ q: `Sebuah papan menggunakan ${bits.length} biji lampu untuk memaparkan nombor dalam asas dua. Lampu menyala mewakili 1 dan lampu padam mewakili 0. Nombor apakah (dalam asas sepuluh) yang dipaparkan dalam rajah di bawah?`, fig: anLamps(bits) }),
    ({ bits }) => ({ q: `Rajah di bawah menunjukkan ${bits.length} biji lampu. Lampu menyala = 1, lampu padam = 0. Tulis nombor yang dipaparkan dalam asas dua dan dalam asas sepuluh.`, ans: `${anN(bits.replace(/^0+/, ''), 2)} = ${anFrom(bits, 2)}`, fig: anLamps(bits) }),
    ({ m }) => ({ q: `Nombor ${m} hendak dipaparkan dengan lampu (menyala = 1, padam = 0). Berapakah bilangan lampu paling sedikit yang diperlukan? Lampu manakah yang menyala?`, ans: `${anTo(m, 2).length} lampu; corak ${anN(anTo(m, 2), 2)}`, work: anDiv(m, 2).slice(-1).concat([`${anTo(m, 2)} mempunyai ${anTo(m, 2).length} digit, maka ${anTo(m, 2).length} lampu diperlukan.`]), fig: '', figAns: anLamps(anTo(m, 2)) })
  ],
  cariN: [
    ({ T, v }) => ({ q: `Diberi ${T} = ${v}. Cari nilai <i>n</i>.` }),
    ({ T, v }) => ({ q: `Nombor ${T} bersamaan dengan ${v} dalam asas sepuluh. Tentukan asas <i>n</i>.` }),
    ({ T, v }) => ({ q: `Jika ${T} = ${v}<sub>10</sub>, apakah asas <i>n</i>?` })
  ],
  konteks: [
    ({ A }) => ({ q: `Guli dibungkus dalam beg berisi ${A.b} biji. Setiap kotak berisi ${A.b} beg dan setiap peti berisi ${A.b} kotak. Aiman mempunyai ${A.d[0]} peti, ${A.d[1]} kotak, ${A.d[2]} beg dan ${A.d[3]} biji guli. Berapakah jumlah guli Aiman?`, ans: `${A.n} biji`, work: [`Jumlah = ${anN(A.d.join(''), A.b)}`].concat(anExp(A.d.join(''), A.b)) }),
    ({ Bq }) => ({ q: `Sebanyak ${Bq.n} biji telur dibungkus. Setiap dulang memuatkan ${Bq.b} biji dan setiap kotak memuatkan ${Bq.b} dulang. Telur dibungkus dalam kotak sebanyak mungkin, kemudian dalam dulang, dan bakinya diasingkan. Berapakah bilangan kotak, dulang dan telur yang berbaki?`, ans: `${Bq.d[0]} kotak, ${Bq.d[1]} dulang, ${Bq.d[2]} biji`, work: anDiv(Bq.n, Bq.b).concat([`Digit ${Bq.d.join(', ')} ialah bilangan kotak, dulang dan biji.`]) }),
    ({ Cq }) => ({ q: `Umur datuk ditulis sebagai ${anN(Cq.s1, Cq.b1)} tahun dan umur cucunya ditulis sebagai ${anN(Cq.s2, Cq.b2)} tahun. Berapakah beza umur mereka dalam asas sepuluh?`, ans: `${Cq.n1 - Cq.n2} tahun`, work: anExp(Cq.s1, Cq.b1).concat(anExp(Cq.s2, Cq.b2), [`Beza = ${Cq.n1} − ${Cq.n2} = ${Cq.n1 - Cq.n2}`]) })
  ],
  ekstrem: [
    ({ b }) => ({ q: `Nyatakan nombor tiga digit yang terbesar dalam ${anAs(b)} sebagai nombor dalam asas sepuluh.`, ans: `${b ** 3 - 1}`, work: [`Nombor terbesar: ${anN(String(b - 1).repeat(3), b)}`, `= ${b - 1}(${b * b}) + ${b - 1}(${b}) + ${b - 1} = ${b ** 3 - 1}`] }),
    ({ b }) => ({ q: `Apakah nombor empat digit yang terkecil dalam ${anAs(b)}? Nyatakan nilainya dalam asas sepuluh.`, ans: `${anN(1000, b)} = ${b ** 3}`, work: [`Nombor empat digit terkecil: ${anN(1000, b)}`, `= 1 × ${b}<sup>3</sup> = ${b ** 3}`] }),
    ({ b }) => ({ q: `Berapakah bilangan nombor dua digit dalam ${anAs(b)}?`, ans: `${b * (b - 1)}`, work: [`Digit pertama: 1 hingga ${b - 1} (${b - 1} pilihan); digit kedua: 0 hingga ${b - 1} (${b} pilihan)`, `${b - 1} × ${b} = ${b * (b - 1)}`, `Semak: ${anN(10, b)} = ${b} hingga ${anN(String(b - 1).repeat(2), b)} = ${b * b - 1}; ${b * b - 1} − ${b} + 1 = ${b * (b - 1)}`] })
  ],
  k214: [
    ({ A }) => ({ q: `Diberi ${anN(A.a, '<i>n</i>')} + ${anN(A.c, '<i>n</i>')} = ${anN(A.s, '<i>n</i>')}.<br>(a) Cari nilai <i>n</i>.<br>(b) Nyatakan ${anN(A.s, '<i>n</i>')} dalam asas sepuluh.<br>(c) Tukar jawapan (b) kepada asas dua.`, ans: `(a) <i>n</i> = ${A.n} (b) ${A.v} (c) ${anN(anTo(A.v, 2), 2)}`, work: A.work }),
    ({ Bq }) => ({ q: `Sebuah kilang membungkus ${Bq.n} batang pen. Setiap kotak kecil berisi 8 batang pen, setiap kotak besar berisi 8 kotak kecil dan setiap peti berisi 8 kotak besar.<br>(a) Tulis ${Bq.n} dalam asas lapan dan nyatakan bilangan peti, kotak besar, kotak kecil dan pen berbaki.<br>(b) Kilang itu menerima ${anN(Bq.m, 8)} batang pen lagi. Hitung jumlah pen dalam asas lapan.<br>(c) Nyatakan jumlah itu dalam asas sepuluh.`, ans: `(a) ${anN(Bq.s, 8)}: ${Bq.d} (b) ${anN(Bq.t, 8)} (c) ${Bq.tv}`, work: Bq.work }),
    ({ Cq }) => ({ q: 'Dua papan lampu memaparkan nombor P dan Q dalam asas dua (menyala = 1, padam = 0), seperti dalam rajah.<br>(a) Nyatakan P dan Q dalam asas sepuluh.<br>(b) Hitung P + Q dalam asas dua.<br>(c) Tukar jawapan (b) kepada asas lapan.', ans: `(a) P = ${Cq.np}, Q = ${Cq.nq} (b) ${anN(Cq.sum, 2)} (c) ${anN(Cq.s8, 8)}`, work: Cq.work, fig: Cq.fig })
  ]
};

/* =================== pembina soalan (r = anRG atau anRW) =================== */
const AN = {};

// ---------- 2.1.1 ----------
AN.tempat = r => {
  const b = r.i(2, 9), s = anRand(r, b, b === 2 ? r.i(4, 6) : r.i(3, 5)), k = r.i(0, s.length - 2), p = s.length - 1 - k;
  const ans = `${b}<sup>${p}</sup> = ${b ** p}`, claim = `${b}<sup>${p + 1}</sup> = ${b ** (p + 1)}`;
  return anVQ('tempat', { U: anNu(s, b, k), b, d: s[k], claim, ans, work: [`Nilai tempat dari kanan: ${Array.from({ length: s.length }, (_, i) => `${b}<sup>${i}</sup>`).join(', ')}`, `Digit bergaris berada pada tempat ke-${p + 1} dari kanan → ${b}<sup>${p}</sup> = ${b ** p}`] }, { figAns: anPV(s, b, { hl: k }) });
};
AN.digit = r => {
  const b = r.i(3, 9), s = anRand(r, b, r.i(3, 4));
  let k = r.i(0, s.length - 2); if (s[k] === '0' || s[k] === '1') k = 0;
  const p = s.length - 1 - k, d = +s[k], v = d * b ** p;
  return anVQ('digit', { U: anNu(s, b, k), d, ans: `${v}`, work: [`Nilai tempat digit ${d} = ${b}<sup>${p}</sup> = ${b ** p}`, `Nilai digit = ${d} × ${b ** p} = ${v}`] }, { figAns: anPV(s, b, { hl: k }) });
};
AN.sah = r => {
  const b = r.i(3, 8), good = [], seen = new Set();
  while (good.length < 3) { const s = anRand(r, b, r.i(3, 4)); if (!seen.has(s)) { seen.add(s); good.push(s); } }
  let bad = anRand(r, b, r.i(3, 4)).split(''); bad[r.i(0, bad.length - 1)] = String(r.i(b, 9)); if (bad[0] === '0') bad[0] = '1'; bad = bad.join('');
  const all = anShuf(r, good.concat([bad])), L = 'ABCD', bi = all.indexOf(bad);
  const list = all.map((s, i) => `(${L[i]}) ${anN(s, b)}`).join(' &nbsp; ');
  const maxd = Math.max(...bad.split('').map(Number));
  let big = anRand(r, 9, 4); if (r.f() < .5) big = big.replace(/[89]/g, () => String(r.i(2, 6)));
  const b3 = r.i(3, 8), ok3 = r.f() < .5;
  let s3 = anRand(r, b3, 3); if (!ok3) { const a = s3.split(''); a[r.i(1, 2)] = String(r.i(b3, 9)); s3 = a.join(''); }
  return anVQ('sah', { b, list, big, b2: r.i(3, 9), b3, s3, ok3, ans: `(${L[bi]}) ${anN(bad, b)}`, work: [`Asas ${b} menggunakan digit 0 hingga ${b - 1} sahaja.`, `${bad} mengandungi digit ${maxd} ≥ ${b}, maka ${anN(bad, b)} tidak wujud.`] });
};
AN.kumpul = r => {
  const b = r.i(3, 6), g = r.i(1, b - 1), s = r.i(g === 1 ? 1 : 0, b - 1), n = g * b + s;
  return anVQ('kumpul', { b, n, ans: anN(`${g}${s}`, b), work: [`Bilangan kumpulan ${ANWORD[b]} = ${g}, baki = ${s}`, `${n} = ${g}(${b}) + ${s} = ${anN(`${g}${s}`, b)}`] }, { fig: anGroup(g, s, b) });
};
AN.nilai = r => {
  const b = r.i(2, 9), s = anRand(r, b, b === 2 ? r.i(5, 6) : r.i(3, 4));
  return anVQ('nilai', { s, b, ans: `${anFrom(s, b)}`, work: anExp(s, b) }, { figAns: anPV(s, b) });
};
AN.beza = r => {
  let b, s, i1, i2;
  do { b = r.i(4, 9); s = anRandD(r, b, 4); i1 = r.i(0, 1); i2 = r.i(2, 3); } while (s[i1] === '0' || s[i2] === '0');
  const d1 = +s[i1], d2 = +s[i2], v1 = d1 * b ** (3 - i1), v2 = d2 * b ** (3 - i2);
  return anVQ('beza', { s, b, d1, d2, v1, v2, ans: `${Math.abs(v1 - v2)}`, work: [`Nilai digit ${d1} = ${d1} × ${b}<sup>${3 - i1}</sup> = ${v1}`, `Nilai digit ${d2} = ${d2} × ${b}<sup>${3 - i2}</sup> = ${v2}`, `Beza = ${v1} − ${v2} = ${v1 - v2}`] }, { figAns: anPV(s, b) });
};
AN.hilang = r => {
  const b = r.i(4, 9), s = anRand(r, b, 4), k = r.i(0, 2), p = 3 - k, d = r.i(k === 0 ? 1 : 2, b - 1), v = d * b ** p;
  const T = anN(s.slice(0, k) + '<i>k</i>' + s.slice(k + 1), b);
  return anVQ('hilang', { T, b, v, ans: `<i>k</i> = ${d}`, work: [`Nilai tempat <i>k</i> = ${b}<sup>${p}</sup> = ${b ** p}`, `<i>k</i> × ${b ** p} = ${v}`, `<i>k</i> = ${v} ÷ ${b ** p} = ${d}`] }, { fig: anPV(s.slice(0, k) + 'k' + s.slice(k + 1), b, { hl: k }) });
};
AN.k211 = r => {
  const b = r.i(4, 9), s = anRandD(r, b, 4), k = s[1] !== '0' ? 1 : 0, d = +s[k];
  const A = { s, b, d, pv: Array.from({ length: 4 }, (_, i) => `${s[i]}: ${b ** (3 - i)}`).join(', '), dv: d * b ** (3 - k), val: anFrom(s, b),
    work: [`Nilai tempat: ${b}<sup>3</sup> = ${b ** 3}, ${b}<sup>2</sup> = ${b * b}, ${b}<sup>1</sup> = ${b}, ${b}<sup>0</sup> = 1`, `(b) ${d} × ${b ** (3 - k)} = ${d * b ** (3 - k)}`].concat(anExp(s, b).map(x => '(c) ' + x)),
    fig: anPV(s, b, { vals: '?' }), figAns: anPV(s, b, { hl: k }) };
  const b2 = r.i(4, 7); let s2; do s2 = anRand(r, b2, 3); while (+s2[2] === b2 - 1 || s2[1] === '0');
  const add = r.i(b2 - +s2[2], b2 - 1), nv = anFrom(s2, b2) + add, ns = anTo(nv, b2);
  const Bq = { s: s2, b: b2, p: 1, dv: +s2[1] * b2, add, addTxt: anN(ns, b2),
    work: [`(a) Bilangan manik pada setiap tiang: ${s2.split('').join(', ')} → ${anN(s2, b2)}`, `(b) ${s2[1]} × ${b2} = ${+s2[1] * b2}`, `(c) Tiang ${b2}⁰ ada ${s2[2]} manik; ${s2[2]} + ${add} = ${+s2[2] + add} ≥ ${b2}, maka ${b2} manik dikumpulkan menjadi 1 manik pada tiang ${b2}¹ (bawa 1).`, `${anFrom(s2, b2)} + ${add} = ${nv} = ${anN(ns, b2)}`],
    fig: anAbacus(s2, b2) };
  let b1, c2, dd, s1, t2;
  do { b1 = r.i(4, 9); c2 = r.i(4, 9); dd = r.i(1, Math.min(b1, c2) - 1); s1 = anRand(r, b1, 3); t2 = anRand(r, c2, 3); } while (b1 === c2 || s1.split('').filter(x => +x === dd).length !== 1 || t2.split('').filter(x => +x === dd).length !== 1 || anFrom(s1, b1) === anFrom(t2, c2));
  const v1 = dd * b1 ** (2 - s1.indexOf(String(dd))), v2 = dd * c2 ** (2 - t2.indexOf(String(dd))), n1 = anFrom(s1, b1), n2 = anFrom(t2, c2);
  const Cq = { s1, b1, s2: t2, b2: c2, d: dd, v1, v2, big: n1 > n2 ? 'P' : 'Q', diff: Math.abs(n1 - n2),
    work: [`(a) ${dd} × ${b1}<sup>${2 - s1.indexOf(String(dd))}</sup> = ${v1}`, `(b) ${dd} × ${c2}<sup>${2 - t2.indexOf(String(dd))}</sup> = ${v2}`, `(c) P = ${n1}, Q = ${n2}`, `Beza = ${Math.max(n1, n2)} − ${Math.min(n1, n2)} = ${Math.abs(n1 - n2)}`] };
  return anVQ('k211', { A, Bq, Cq });
};

// ---------- 2.1.2 ----------
AN.ke10 = r => {
  const b = r.i(2, 9), s = anRand(r, b, b === 2 ? r.i(5, 7) : b <= 5 ? r.i(3, 5) : r.i(3, 4));
  return anVQ('ke10', { s, b, ans: `${anFrom(s, b)}`, work: anExp(s, b) }, { figAns: anPV(s, b) });
};
AN.dari10 = r => {
  const b = r.i(2, 9), n = b === 2 ? r.i(20, 120) : b <= 4 ? r.i(30, 250) : r.i(60, 500), s = anTo(n, b);
  return anVQ('dari10', { n, b, s, ans: anN(s, b), work: anDiv(n, b) }, { figAns: anLadder(n, b) });
};
AN.dua8 = r => {
  const n2 = r.i(20, 400), s2 = anTo(n2, 2), s8 = anTo(r.i(9, 450), 8);
  const g = s2.padStart(Math.ceil(s2.length / 3) * 3, '0').match(/.{3}/g);
  const w2 = [`Kumpul tiga digit dari kanan: ${g.join(' | ')}`, `${g.map(x => `${x} → ${parseInt(x, 2)}`).join(', ')}`, `Maka ${anN(s2, 2)} = ${anN(anTo(n2, 8), 8)}`];
  const w8 = [`${s8.split('').map(x => `${x} → ${(+x).toString(2).padStart(3, '0')}`).join(', ')}`, `Gabungkan dan buang sifar di hadapan: ${anN(anTo(anFrom(s8, 8), 2), 2)}`];
  return anVQ('dua8', { s2, s8, w2, w8 });
};
AN.antara = r => {
  let b, c; do { b = r.i(2, 9); c = r.i(2, 9); } while (b === c);
  const s = anRand(r, b, b === 2 ? 6 : r.i(3, 4)), n = anFrom(s, b);
  if (c === 2 && n > 200) return AN.antara(r);
  return anVQ('antara', { s, b, c, ans: anN(anTo(n, c), c), work: anExp(s, b).concat(anDiv(n, c)) }, { figAns: anLadder(n, c) });
};
AN.semak = r => {
  let b, c; do { b = r.i(2, 9); c = r.i(2, 9); } while (b === c);
  const n = r.i(15, 150), same = r.f() < .5, s = anTo(n, b);
  let t = anTo(same ? n : n + r.p([-1, 1, 2, c]), c);
  const n2 = anFrom(t, c);
  const L = anN(s, b), R = anN(t, c);
  return anVQ('semak', { L, R, ans: n === n2 ? 'Ya, sama (benar)' : 'Tidak sama (palsu)', work: anExp(s, b).concat(anExp(t, c), [n === n2 ? `${n} = ${n2}, maka ${L} = ${R}` : `${n} ≠ ${n2}, maka ${L} ≠ ${R}`]) });
};
AN.k212 = r => {
  let b, c; do { b = r.i(3, 9); c = r.i(3, 9); } while (b === c);
  let s; do s = anRand(r, b, 3); while (anFrom(s, b) > 255 || anFrom(s, b) < 20);
  const n = anFrom(s, b);
  const A = { s, b, c, n, sc: anTo(n, c), s2: anTo(n, 2), work: anExp(s, b).map(x => '(a) ' + x).concat(anDiv(n, c).map(x => '(b) ' + x), [`(c) ${n} = ${anN(anTo(n, 2), 2)}`]), figAns: anLadder(n, c) };
  const m = r.i(40, 250), m2 = anTo(m, 2), m8 = anTo(m, 8), g = m2.padStart(Math.ceil(m2.length / 3) * 3, '0').match(/.{3}/g);
  const Bq = { n: m, s2: m2, s8: m8, work: anDiv(m, 2).map(x => '(a) ' + x).concat([`(b) ${g.join(' | ')} → ${g.map(x => parseInt(x, 2)).join(' ')} → ${anN(m8, 8)}`], anDiv(m, 8).map(x => '(c) ' + x)), figAns: anLadder(m, 2) };
  let b1, b2, c3; do { b1 = r.i(2, 9); b2 = r.i(2, 9); c3 = r.i(3, 9); } while (b1 === b2 || c3 === b1 || c3 === b2);
  let s1, t2; do { s1 = anRand(r, b1, b1 === 2 ? 6 : 3); t2 = anRand(r, b2, b2 === 2 ? 6 : 3); } while (anFrom(s1, b1) === anFrom(t2, b2));
  const n1 = anFrom(s1, b1), n2 = anFrom(t2, b2);
  const Cq = { s1, b1, s2: t2, b2, c: c3, n1, n2, sum: anTo(n1 + n2, c3), work: anExp(s1, b1).concat(anExp(t2, b2), [`(b) ${Math.max(n1, n2)} &gt; ${Math.min(n1, n2)}`, `(c) P + Q = ${n1} + ${n2} = ${n1 + n2}`], anDiv(n1 + n2, c3)) };
  return anVQ('k212', { A, Bq, Cq });
};

// ---------- 2.1.3 ----------
// salah biasa: tambah setiap lajur tanpa bawa (digit mod b)
function anNoCarry(a, c, b) {
  const n = Math.max(a.length, c.length), A = a.padStart(n, '0'), C = c.padStart(n, '0');
  let s = ''; for (let i = 0; i < n; i++) s += (+A[i] + +C[i]) % b;
  return s.replace(/^0+(?=.)/, '');
}
AN.tambah = (r, bb) => {
  const b = bb || r.i(3, 9);
  let a, c, t = 0;
  do { a = anRand(r, b, r.i(3, 4)); c = anRand(r, b, r.i(2, 3)); t++; } while (t < 50 && anAdd(a, c, b).carry.filter(Boolean).length < 1);
  const R = anAdd(a, c, b), wrong = anNoCarry(a, c, b);
  return anVQ('tambah', { a, c, b, wrong: wrong !== R.s ? wrong : null, ans: anN(R.s, b), work: R.w.concat([`Semak: ${anFrom(a, b)} + ${anFrom(c, b)} = ${anFrom(R.s, b)} = ${anN(R.s, b)}`]) }, { fig: anCol(a, c, null, b, '+'), figAns: anCol(a, c, R.s, b, '+', R.carry) });
};
AN.tolak = (r, bb) => {
  const b = bb || r.i(3, 9);
  let a, c, t = 0;
  do { a = anRand(r, b, r.i(3, 4)); c = anRand(r, b, r.i(2, 3)); t++; } while (t < 80 && (anFrom(c, b) >= anFrom(a, b) || !anSub(a, c, b).w.some(x => /pinjam/.test(x))));
  if (anFrom(c, b) >= anFrom(a, b)) [a, c] = [c, a];
  const R = anSub(a, c, b);
  return anVQ('tolak', { a, c, b, ans: anN(R.s, b), work: R.w.concat([`Semak: ${anN(R.s, b)} + ${anN(c, b)} = ${anN(a, b)} (${anFrom(R.s, b)} + ${anFrom(c, b)} = ${anFrom(a, b)})`]) }, { fig: anCol(a, c, null, b, '−'), figAns: anCol(a, c, R.s, b, '−') });
};
AN.dua = (r, i) => {
  const op = i == null ? r.p(['+', '−']) : (i % 2 ? '−' : '+');
  let a, c;
  do { a = anTo(r.i(9, 60), 2); c = anTo(r.i(5, 40), 2); } while (op === '−' && anFrom(c, 2) >= anFrom(a, 2));
  const R = op === '+' ? anAdd(a, c, 2) : anSub(a, c, 2), na = anFrom(a, 2), nc = anFrom(c, 2);
  return anVQ('dua', { a, c, op, ans: anN(R.s, 2), work: R.w.concat([`Semak: ${na} ${op} ${nc} = ${op === '+' ? na + nc : na - nc} = ${anN(R.s, 2)}`]) }, { fig: anCol(a, c, null, 2, op), figAns: anCol(a, c, R.s, 2, op, R.carry) });
};
AN.tigaOp = r => {
  const b = r.i(3, 9), plus = r.f() < .5;
  let a, c, d, v;
  do { a = anRand(r, b, 3); c = anRand(r, b, 3); d = anRand(r, b, 2 + r.i(0, 1)); v = plus ? anFrom(a, b) + anFrom(c, b) + anFrom(d, b) : anFrom(a, b) + anFrom(c, b) - anFrom(d, b); } while (v <= 0);
  const E = plus ? `${anN(a, b)} + ${anN(c, b)} + ${anN(d, b)}` : `${anN(a, b)} + ${anN(c, b)} − ${anN(d, b)}`;
  const s1 = anAdd(a, c, b).s, s2 = anTo(v, b);
  return anVQ('tigaOp', { E, b, ans: anN(s2, b), work: [`Langkah 1: ${anN(a, b)} + ${anN(c, b)} = ${anN(s1, b)}`, `Langkah 2: ${anN(s1, b)} ${plus ? '+' : '−'} ${anN(d, b)} = ${anN(s2, b)}`, `Semak (asas sepuluh): ${anFrom(a, b)} + ${anFrom(c, b)} ${plus ? '+' : '−'} ${anFrom(d, b)} = ${v}`] });
};
AN.campur = r => {
  let b1, b2, c; do { b1 = r.i(2, 9); b2 = r.i(2, 9); c = r.i(2, 9); } while (b1 === b2);
  const op = r.p(['+', '−']);
  let s1, s2, v;
  do { s1 = anRand(r, b1, b1 === 2 ? 5 : 3); s2 = anRand(r, b2, b2 === 2 ? 5 : 2 + r.i(0, 1)); v = op === '+' ? anFrom(s1, b1) + anFrom(s2, b2) : anFrom(s1, b1) - anFrom(s2, b2); } while (v <= 0 || (c === 2 && v > 127));
  const n1 = anFrom(s1, b1), n2 = anFrom(s2, b2);
  return anVQ('campur', { x: anN(s1, b1), y: anN(s2, b2), op, c, ans: anN(anTo(v, c), c), work: [`${anN(s1, b1)} = ${n1}, ${anN(s2, b2)} = ${n2}`, `${n1} ${op} ${n2} = ${v}`].concat(c === 10 ? [] : anDiv(v, c)) });
};
AN.cariX = r => {
  const b = r.i(3, 9), kind = r.i(0, 2);
  let x, c; do { x = anRand(r, b, r.i(2, 3)); c = anRand(r, b, 3); } while (kind === 2 && anFrom(c, b) <= anFrom(x, b));
  const nx = anFrom(x, b), nc = anFrom(c, b);
  let L, work;
  if (kind === 0) { const s = anTo(nx + nc, b); L = `<i>x</i> + ${anN(c, b)} = ${anN(s, b)}`; work = [`<i>x</i> = ${anN(s, b)} − ${anN(c, b)}`, `${nx + nc} − ${nc} = ${nx}`, `${nx} = ${anN(x, b)}`]; }
  else if (kind === 1) { const s = anTo(nx + nc, b); L = `${anN(s, b)} − <i>x</i> = ${anN(c, b)}`; work = [`<i>x</i> = ${anN(s, b)} − ${anN(c, b)}`, `${nx + nc} − ${nc} = ${nx}`, `${nx} = ${anN(x, b)}`]; }
  else { const s = anTo(nc - nx, b); L = `<i>x</i> − ${anN(s, b)} = ${anN(c, b)}`; const xx = anTo(nc + nc - nx, b); work = [`<i>x</i> = ${anN(c, b)} + ${anN(s, b)}`, `${nc} + ${nc - nx} = ${2 * nc - nx} = ${anN(xx, b)}`]; return anVQ('cariX', { L, b, ans: `<i>x</i> = ${anN(xx, b)}`, work }); }
  return anVQ('cariX', { L, b, ans: `<i>x</i> = ${anN(x, b)}`, work });
};
AN.k213 = r => {
  let s0, j, t, res;
  do { s0 = anRand(r, 8, 4); j = anRand(r, 8, 3); t = anRand(r, 8, 3); } while (anFrom(s0, 8) - anFrom(j, 8) <= 0);
  const m1 = anTo(anFrom(s0, 8) - anFrom(j, 8), 8); res = anTo(anFrom(m1, 8) + anFrom(t, 8), 8);
  const A = { s0, j, t, res, dec: anFrom(res, 8), work: [`(a) ${anN(s0, 8)} − ${anN(j, 8)} = ${anN(m1, 8)}`, `${anN(m1, 8)} + ${anN(t, 8)} = ${anN(res, 8)}`].concat(anExp(res, 8).map(x => '(b) ' + x)) };
  let p, q; do { p = anTo(r.i(20, 63), 2); q = anTo(r.i(5, 40), 2); } while (anFrom(q, 2) >= anFrom(p, 2));
  const np = anFrom(p, 2), nq = anFrom(q, 2), sum = anTo(np + nq, 2), dif = anTo(np - nq, 2);
  const Bq = { p, q, sum, dif, chk: `${np} + ${nq} = ${np + nq}, ${np} − ${nq} = ${np - nq}`, work: anAdd(p, q, 2).w.map(x => '(a) ' + x).concat(anSub(p, q, 2).w.map(x => '(b) ' + x), [`(c) P = ${np}, Q = ${nq}; ${anN(sum, 2)} = ${np + nq} ✓, ${anN(dif, 2)} = ${np - nq} ✓`]) };
  const b = r.i(4, 9); let a, c; do { a = anRand(r, b, 3); c = anRand(r, b, 3); } while (!anAdd(a, c, b).carry.some(Boolean));
  const ss = anAdd(a, c, b).s;
  const Cq = { b, a, c, sum: ss, na: anFrom(a, b), nc: anFrom(c, b), work: anSub(ss, a, b).w.map(x => '(a) ' + x).concat([`(a) Nombor itu = ${anN(ss, b)} − ${anN(a, b)} = ${anN(c, b)}`], anExp(a, b).map(x => '(b) ' + x), anExp(c, b).map(x => '(b) ' + x)) };
  return anVQ('k213', { A, Bq, Cq });
};

// ---------- 2.1.4 ----------
AN.susun = r => {
  let it;
  for (let t = 0; t < 200; t++) {
    const bs = anShuf(r, [2, 3, 4, 5, 6, 7, 8, 9]).slice(0, r.i(3, 4)), vals = new Set();
    it = bs.map(b => { const v = r.i(10, 60); vals.add(v); return { b, v, s: anTo(v, b) }; });
    if (vals.size === it.length) break;
  }
  const asc = it.slice().sort((x, y) => x.v - y.v), list = it.map(x => anN(x.s, x.b)).join(', ');
  return anVQ('susun', { list, ans: asc.map(x => anN(x.s, x.b)).join(', '), desc: asc.slice().reverse().map(x => anN(x.s, x.b)).join(', '), big: anN(asc[asc.length - 1].s, asc[asc.length - 1].b), small: anN(asc[0].s, asc[0].b),
    work: it.map(x => `${anN(x.s, x.b)} = ${x.v}`).concat([`${asc.map(x => x.v).join(' &lt; ')}`]) });
};
AN.cariP = r => {
  const b = r.i(3, 9), len = r.i(3, 4), s = anRand(r, b, len);
  const k = r.i(0, len - 1), d = +s[k], v = anFrom(s, b), p = len - 1 - k;
  const T = anN(s.slice(0, k) + '<i>p</i>' + s.slice(k + 1), b);
  const rest = v - d * b ** p;
  const terms = s.split('').map((c, i) => { const q = len - 1 - i, pv = q === 0 ? '' : `(${b ** q})`; return i === k ? `<i>p</i>${pv}` : `${c}${pv}`; }).join(' + ');
  const wrongP = d + 1 < b ? d + 1 : d - 1, wv = rest + wrongP * b ** p;
  const cp = b ** p === 1 ? '<i>p</i>' : `${b ** p}<i>p</i>`;
  return anVQ('cariP', { T, v, wrongP: k === 0 && wrongP === 0 ? null : wrongP, wv, ans: `<i>p</i> = ${d}`, work: [`${terms} = ${v}`, `${cp} + ${rest} = ${v}`, b ** p === 1 ? `<i>p</i> = ${v} − ${rest} = ${d}` : `${cp} = ${v - rest} → <i>p</i> = ${v - rest} ÷ ${b ** p} = ${d}`, `Semak: ${d} &lt; ${b} ✓`] }, { figAns: anPV(s, b, { hl: k }) });
};
AN.lampu = r => {
  const len = r.i(5, 7); let bits = '1'; for (let i = 1; i < len; i++) bits += r.i(0, 1);
  const n = anFrom(bits, 2), terms = bits.split('').map((c, i) => (c === '1' ? 2 ** (len - 1 - i) : 0)).filter(Boolean);
  return anVQ('lampu', { bits, m: r.i(20, 120), ans: `${n}`, work: [`Corak: ${anN(bits, 2)}`, `${terms.join(' + ')} = ${n}`] });
};
AN.cariN = r => {
  const tri = r.f() < .4;
  let n, s, v;
  if (tri) { n = r.i(3, 9); s = '1' + r.i(0, n - 1) + r.i(0, n - 1); }
  else { n = r.i(3, 9); s = String(r.i(2, n - 1)) + r.i(0, n - 1); }
  v = anFrom(s, n);
  const T = anN(s, '<i>n</i>'), d = s.split('').map(Number), mx = Math.max(...d);
  const lin = (d[1] === 0 ? '' : d[1] === 1 ? ' + <i>n</i>' : ` + ${d[1]}<i>n</i>`), k0 = d[2] - v, o2 = d[1] + n;
  const work = tri
    ? [`<i>n</i><sup>2</sup>${lin}${d[2] ? ` + ${d[2]}` : ''} = ${v}`, `<i>n</i><sup>2</sup>${lin} − ${-k0} = 0`, `(<i>n</i> − ${n})(<i>n</i> + ${o2}) = 0 → <i>n</i> = ${n} atau <i>n</i> = −${o2}`, `Asas mesti positif, maka <i>n</i> = ${n}. Semak: digit terbesar ${mx} &lt; ${n} ✓`]
    : [`${d[0]}<i>n</i> + ${d[1]} = ${v}`, `${d[0]}<i>n</i> = ${v - d[1]} → <i>n</i> = ${n}`, `Semak: digit terbesar ${mx} &lt; ${n} ✓`];
  return anVQ('cariN', { T, v, ans: `<i>n</i> = ${n}`, work });
};
AN.konteks = r => {
  const b = r.i(3, 9), dg = [r.i(1, b - 1), r.i(0, b - 1), r.i(0, b - 1), r.i(0, b - 1)];
  const A = { b, d: dg, n: anFrom(dg.join(''), b) };
  const b2 = r.i(5, 9), n2 = r.i(b2 * b2 + 1, b2 * b2 * b2 - 1), s2 = anTo(n2, b2);
  const Bq = { b: b2, n: n2, d: s2.split('') };
  let c1, c2, s1, t2, m1, m2;
  do { c1 = r.i(3, 9); c2 = r.i(3, 9); m1 = r.i(55, 85); m2 = r.i(6, 18); s1 = anTo(m1, c1); t2 = anTo(m2, c2); } while (c1 === c2);
  const Cq = { s1, b1: c1, s2: t2, b2: c2, n1: m1, n2: m2 };
  return anVQ('konteks', { A, Bq, Cq });
};
AN.ekstrem = r => anVQ('ekstrem', { b: r.i(3, 9) });
AN.k214 = r => {
  let n, a, c, s;
  do { n = r.i(5, 9); a = String(r.i(1, n - 3)) + r.i(1, n - 1); c = String(r.i(1, n - 3)) + r.i(1, n - 1); s = anTo(anFrom(a, n) + anFrom(c, n), n); } while (s.length !== 2 || +a[1] + +c[1] < n);
  const v = anFrom(s, n);
  const A = { a, c, s, n, v, work: [`(${a[0]}<i>n</i> + ${a[1]}) + (${c[0]}<i>n</i> + ${c[1]}) = ${s[0]}<i>n</i> + ${s[1]}`, `${+a[0] + +c[0]}<i>n</i> + ${+a[1] + +c[1]} = ${s[0]}<i>n</i> + ${s[1]}`, `<i>n</i> = ${+a[1] + +c[1]} − ${s[1]} = ${n}`, `(b) ${s[0]}(${n}) + ${s[1]} = ${v}`].concat(anDiv(v, 2).map(x => '(c) ' + x)) };
  const pn = r.i(600, 3500), ps = anTo(pn, 8), pd = ps.padStart(4, '0'), m = anRand(r, 8, 3), tt = anTo(pn + anFrom(m, 8), 8);
  const Bq = { n: pn, s: ps, m, t: tt, tv: pn + anFrom(m, 8), d: `${+pd[0]} peti, ${+pd[1]} kotak besar, ${+pd[2]} kotak kecil, ${+pd[3]} batang pen`, work: anDiv(pn, 8).map(x => '(a) ' + x).concat(anAdd(ps, m, 8).w.map(x => '(b) ' + x), [`(b) ${anN(ps, 8)} + ${anN(m, 8)} = ${anN(tt, 8)}`], anExp(tt, 8).map(x => '(c) ' + x)) };
  let P, Q; do { P = '1' + anTo(r.i(0, 31), 2).padStart(5, '0'); Q = '1' + anTo(r.i(0, 15), 2).padStart(4, '0'); } while (P === Q);
  const np = anFrom(P, 2), nq = anFrom(Q, 2), sum = anTo(np + nq, 2), s8 = anTo(np + nq, 8);
  const g = sum.padStart(Math.ceil(sum.length / 3) * 3, '0').match(/.{3}/g);
  const fig = anSvg(360, 190, `${anT(14, 22, 'P', 'tr', 18, 'start', 800)}${anT(14, 116, 'Q', 'pk', 18, 'start', 800)}<g transform="translate(26 0)">${anLamps(P, false).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><g transform="translate(26 94)">${anLamps(Q.padStart(6, '0'), false).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`, 'Dua papan lampu P dan Q');
  const Cq = { np, nq, sum, s8, fig, work: [`(a) P = ${anN(P, 2)} = ${np}, Q = ${anN(Q, 2)} = ${nq}`].concat(anAdd(P, Q, 2).w.map(x => '(b) ' + x), [`(b) P + Q = ${anN(sum, 2)}`, `(c) ${g.join(' | ')} → ${anN(s8, 8)}`]) };
  return anVQ('k214', { A, Bq, Cq });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '2.1.1': {
    m: [() => AN.tempat(anRG), () => AN.digit(anRG), () => AN.sah(anRG), () => AN.kumpul(anRG)],
    s: [() => AN.nilai(anRG), () => AN.beza(anRG), () => AN.hilang(anRG)],
    k: [() => AN.k211(anRG)]
  },
  '2.1.2': {
    m: [() => AN.ke10(anRG), () => AN.dari10(anRG), () => AN.dua8(anRG)],
    s: [() => AN.antara(anRG), () => AN.semak(anRG)],
    k: [() => AN.k212(anRG)]
  },
  '2.1.3': {
    m: [() => AN.tambah(anRG), () => AN.tolak(anRG), () => AN.dua(anRG)],
    s: [() => AN.tigaOp(anRG), () => AN.campur(anRG), () => AN.cariX(anRG)],
    k: [() => AN.k213(anRG)]
  },
  '2.1.4': {
    m: [() => AN.susun(anRG), () => AN.cariP(anRG), () => AN.lampu(anRG)],
    s: [() => AN.cariN(anRG), () => AN.konteks(anRG), () => AN.ekstrem(anRG)],
    k: [() => AN.k214(anRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
WG.tempat = () => AN.tempat(anRW);
WG.digit = () => AN.digit(anRW);
WG.sah = () => AN.sah(anRW);
WG.kumpul = () => AN.kumpul(anRW);
WG.nilai = () => AN.nilai(anRW);
WG.beza = () => AN.beza(anRW);
WG.hilang = () => AN.hilang(anRW);
WG.k211 = () => AN.k211(anRW);
WG.ke10 = () => AN.ke10(anRW);
WG.dari10 = () => AN.dari10(anRW);
WG.dua8 = () => AN.dua8(anRW);
WG.antara = () => AN.antara(anRW);
WG.semak = () => AN.semak(anRW);
WG.k212 = () => AN.k212(anRW);
WG.tambah = i => AN.tambah(anRW, [5, 8, 3, 6, 9, 4][i % 6]);
WG.tolak = i => AN.tolak(anRW, [4, 7, 5, 9, 3, 8][i % 6]);
WG.dua = i => AN.dua(anRW, i);
WG.tigaOp = () => AN.tigaOp(anRW);
WG.campur = () => AN.campur(anRW);
WG.cariX = () => AN.cariX(anRW);
WG.k213 = () => AN.k213(anRW);
WG.susun = () => AN.susun(anRW);
WG.cariP = () => AN.cariP(anRW);
WG.lampu = () => AN.lampu(anRW);
WG.cariN = () => AN.cariN(anRW);
WG.konteks = () => AN.konteks(anRW);
WG.ekstrem = () => AN.ekstrem(anRW);
WG.k214 = () => AN.k214(anRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '2.1.1': [['m', 'tempat', 5], ['m', 'digit', 5], ['m', 'sah', 4], ['m', 'kumpul', 4], ['s', 'nilai', 3], ['s', 'beza', 3], ['s', 'hilang', 3], ['k', 'k211', 3]],
  '2.1.2': [['m', 'ke10', 7], ['m', 'dari10', 7], ['m', 'dua8', 4], ['s', 'antara', 5], ['s', 'semak', 4], ['k', 'k212', 3]],
  '2.1.3': [['m', 'tambah', 7], ['m', 'tolak', 7], ['m', 'dua', 4], ['s', 'tigaOp', 3], ['s', 'campur', 3], ['s', 'cariX', 3], ['k', 'k213', 3]],
  '2.1.4': [['m', 'susun', 6], ['m', 'cariP', 6], ['m', 'lampu', 6], ['s', 'cariN', 3], ['s', 'konteks', 3], ['s', 'ekstrem', 3], ['k', 'k214', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// 4 pilihan unik: jawapan + calon + isian
const anInvalid = t => { if (t == null) return true; const re = /(\d+)<sub>(\d+)<\/sub>/g; let m; while ((m = re.exec(t))) if (m[1].split('').some(c => +c >= +m[2])) return true; return false; };
function anOpts(ans, cands, fill, keepBad) {
  const seen = new Set([ans]), w = [];
  if (!keepBad) { cands = cands.filter(c => !anInvalid(c)); const f0 = fill; fill = k => { const c = f0(k); return anInvalid(c) ? null : c; }; }
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 0; w.length < 3 && k < 200; k++) { const c = fill(k); if (c != null && !seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const anMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
// nombor asas b yang sah berhampiran v (untuk pilihan salah)
const anNear = (v, b, k) => { const x = v + [1, -1, 2, -2, b, -b, 3, b + 1][k % 8] * (1 + Math.floor(k / 8)); return x > 0 ? anN(anTo(x, b), b) : null; };
const anNum = (v, k) => { const x = v + [1, -1, 2, -2, 5, -5, 10, -10][k % 8] * (1 + Math.floor(k / 8)); return x > 0 ? String(x) : null; };
const anCardN = (s, b, extra) => anCard([[anSVr(s, b, 40), 'tr', 40]].concat(extra || []), `Nombor ${s} asas ${b}`);
const CQGEN = {
  nilai: [
    () => { const b = ri(3, 9), s = anRand(anRG, b, 3), k = ri(0, 1), p = 2 - k; return anMcq(`Apakah nilai tempat digit bergaris dalam ${anNu(s, b, k)}?`, anPV(s, b, { vals: false, hl: k }), anOpts(String(b ** p), [String(b ** (p + 1)), String(b * p), String(b), String(b ** (p - 1 < 0 ? 0 : p - 1)), String(10 ** p)], k2 => anNum(b ** p, k2))); },
    () => { const b = ri(3, 9), s = anRand(anRG, b, 4), k = ri(0, 2), p = 3 - k, d = Math.max(1, +s[k]), s2 = s.slice(0, k) + d + s.slice(k + 1), v = d * b ** p; return anMcq(`Nilai digit bagi digit bergaris dalam ${anNu(s2, b, k)} ialah`, anCardN(s2, b), anOpts(String(v), [String(d), String(d * 10 ** p), String(d * b ** (p + 1)), String(d * b ** Math.max(0, p - 1)), String(b ** p)], k2 => anNum(v, k2))); },
    () => { const b = ri(3, 8); let bad = anRand(anRG, b, 3).split(''); bad[ri(1, 2)] = String(ri(b, 9)); bad = bad.join(''); const g = []; while (g.length < 3) { const x = anRand(anRG, b, 3); if (!g.includes(x)) g.push(x); } return anMcq(`Antara berikut, yang manakah <b>bukan</b> nombor dalam ${anAs(b)}?`, anCard([[`Asas ${b}: digit 0 hingga ${b - 1}`, 'tr', 22]], `Digit asas ${b}`), anOpts(anN(bad, b), g.map(x => anN(x, b)), () => null, true)); }
  ],
  ke10: [
    () => { const b = ri(2, 5), s = anRand(anRG, b, b === 2 ? 4 : 3), v = anFrom(s, b); return anMcq(`${anN(s, b)} dalam asas sepuluh ialah`, anPV(s, b), anOpts(String(v), [String(s.split('').reduce((t, c) => t + +c, 0)), String(anFrom(s, Math.min(10, b + 1))), String(v + b), String(+s)], k => anNum(v, k))); },
    () => { const b = ri(2, 9), s = anRand(anRG, b, b === 2 ? 6 : 3), v = anFrom(s, b); return anMcq(`Tukar ${anN(s, b)} kepada asas sepuluh.`, anCardN(s, b, [['→ asas sepuluh', 'mu', 20]]), anOpts(String(v), [String(anFrom(s, Math.min(10, b + 1))), String(anFrom(s, Math.max(Math.max(...s.split('').map(Number)) + 1, b - 1))), String(v + 1), String(v - b)], k => anNum(v, k))); },
    () => { const b = ri(4, 9), s = anRand(anRG, b, 4), v = anFrom(s, b); return anMcq(`Nilai ${anN(s, b)} dalam asas sepuluh ialah`, anCardN(s, b, [['= ?', 'mu', 24]]), anOpts(String(v), [String(anFrom(s, b - 1 > Math.max(...s.split('').map(Number)) ? b - 1 : Math.min(10, b + 1))), String(v + b * b), String(v - b), String(anFrom(s.split('').reverse().join(''), b))], k => anNum(v, k))); }
  ],
  dari10: [
    () => { const b = ri(2, 5), n = ri(8, 40), s = anTo(n, b); return anMcq(`Tukar ${n} kepada ${anAs(b)}.`, anCard([[`${n} → asas ${b}`, 'pa', 32]]), anOpts(anN(s, b), [s.split('').reverse().join('').replace(/^0+/, ''), anTo(n + 1, b), anTo(n - 1, b), anTo(n + b, b)].map(x => anN(x, b)), k => anNear(n, b, k))); },
    () => { const b = ri(3, 9), n = ri(40, 300), s = anTo(n, b); return anMcq(`${n} dalam ${anAs(b)} ialah`, anLadder(n, b).replace(/<text[^>]*>baki \d<\/text>/g, ''), anOpts(anN(s, b), [anN(s.split('').reverse().join('').replace(/^0+/, ''), b), anN(anTo(n + b, b), b), anN(anTo(n - 1, b), b), n > b * b ? anN(anTo(n - b * b, b), b) : null], k => anNear(n, b, k))); },
    () => { const n2 = ri(20, 250), s2 = anTo(n2, 2), s8 = anTo(n2, 8); return anMcq(`Tukar ${anN(s2, 2)} kepada asas lapan.`, anCardN(s2, 2, [['kumpul 3 digit dari kanan', 'mu', 18]]), anOpts(anN(s8, 8), [anN(anTo(n2 + 8, 8), 8), anN(anTo(n2 + 1, 8), 8), anN(s8.split('').reverse().join(''), 8), anN(anTo(parseInt(s2.padEnd(Math.ceil(s2.length / 3) * 3, '0'), 2), 8), 8)], k => anNear(n2, 8, k))); }
  ],
  operasi: [
    () => { const b = ri(3, 6), a = anRand(anRG, b, 2), c = anRand(anRG, b, 2), R = anAdd(a, c, b); return anMcq(`${anN(a, b)} + ${anN(c, b)} =`, anCol(a, c, null, b, '+'), anOpts(anN(R.s, b), [anN(String(+a + +c), b), anN(anNoCarry(a, c, b), b), anN(anTo(anFrom(R.s, b) + 1, b), b)], k => anNear(anFrom(R.s, b), b, k))); },
    () => { const b = ri(3, 9), op = pick(['+', '−']); let a, c; do { a = anRand(anRG, b, 3); c = anRand(anRG, b, 3); } while (op === '−' && anFrom(c, b) >= anFrom(a, b)); const R = op === '+' ? anAdd(a, c, b) : anSub(a, c, b), v = anFrom(R.s, b); return anMcq(`${anN(a, b)} ${op} ${anN(c, b)} =`, anCol(a, c, null, b, op), anOpts(anN(R.s, b), [anN(anTo(v + b, b), b), anN(anTo(v - b, b), b), anN(anTo(v + 1, b), b), op === '+' ? anN(anNoCarry(a, c, b), b) : null], k => anNear(v, b, k))); },
    () => { const b = pick([2, 2, 3, 4, 5, 6, 7, 8, 9]), op = pick(['+', '−']); let a, c; do { a = anRand(anRG, b, b === 2 ? 5 : 4); c = anRand(anRG, b, b === 2 ? 4 : 3); } while (op === '−' && anFrom(c, b) >= anFrom(a, b)); const R = op === '+' ? anAdd(a, c, b) : anSub(a, c, b), v = anFrom(R.s, b); return anMcq(`${anN(a, b)} ${op} ${anN(c, b)} =`, anCol(a, c, null, b, op), anOpts(anN(R.s, b), [anN(anTo(v + b * b, b), b), anN(anTo(Math.max(1, v - b), b), b), anN(anTo(v + 2, b), b)], k => anNear(v, b, k))); }
  ],
  masalah: [
    () => { const b = ri(5, 9), s = anRand(anRG, b, 3), k = ri(1, 2), d = +s[k], v = anFrom(s, b); const T = anN(s.slice(0, k) + '<i>p</i>' + s.slice(k + 1), b); return anMcq(`Diberi ${T} = ${v}. Nilai <i>p</i> ialah`, anPV(s.slice(0, k) + 'p' + s.slice(k + 1), b, { hl: k }), anOpts(String(d), [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(x => x < b && x !== d).map(String), () => null)); },
    () => { const n = ri(3, 9), s = String(ri(2, n - 1)) + ri(0, n - 1), v = anFrom(s, n); return anMcq(`Diberi ${anN(s, '<i>n</i>')} = ${v}. Nilai <i>n</i> ialah`, anCard([[anSVr(s, 'n', 40) + ` = ${v}`, 'pu', 40]]), anOpts(String(n), [3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== n && x > Math.max(...s.split('').map(Number))).map(String), k => String(n + k + 1))); },
    () => { let it; for (let t = 0; t < 100; t++) { const bs = shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4), vs = new Set(); it = bs.map(b => { const v = ri(10, 60); vs.add(v); return { b, v, s: anTo(v, b) }; }); if (vs.size === 4) break; } const big = it.reduce((m, x) => (x.v > m.v ? x : m)); return anMcq('Nombor manakah yang paling besar?', anCard([['Tukar ke asas sepuluh', 'mu', 20], ['dan bandingkan', 'mu', 20]]), { opts: it.map(x => anN(x.s, x.b)), c: it.indexOf(big) }); }
  ]
};
const CQT = { nilai: 'Nilai tempat & digit', ke10: 'Ke asas sepuluh', dari10: 'Dari asas sepuluh', operasi: 'Tambah & tolak', masalah: 'Cari digit, asas & banding' };
function anCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.nilai;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  return anCqMake(pick(Object.keys(CQT)), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return anCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
