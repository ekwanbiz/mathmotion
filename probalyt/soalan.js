'use strict';
/* =================== PROBALYT · SOALAN BAB 13 KEBARANGKALIAN MUDAH (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pb" / "PB" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor, pecahan & set =================== */
const pbGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// pecahan termudah: 0 → "0", n/n → "1"
const pbFr = (n, d) => { if (n === 0) return '0'; const g = pbGcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
// "n/d" diikuti bentuk termudah jika berbeza
const pbEq = (n, d) => { const s = pbFr(n, d), raw = `${n}/${d}`; return s === raw ? raw : `${raw} = ${s}`; };
const pbNum = x => String(Math.round(x * 1000) / 1000);
const pbH = h => String(h / 100);                // perseratus → perpuluhan (cth 35 → 0.35)
const pbSet = a => `{${a.join(', ')}}`;
const pbDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const pbRange = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
const pbPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const pbLc = s => s[0].toLowerCase() + s.slice(1);
const pbSum = a => a.reduce((x, y) => x + y, 0);
// rawak: pbRG untuk Latihan Kelas / games, pbRW (berbenih) untuk Lembaran Kerja
const pbRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const pbRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const pbShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const PBNAMA2 = [['Amir', 'Siti'], ['Mei Ling', 'Ravi'], ['Aisyah', 'Daniel'], ['Hafiz', 'Kavitha'], ['Farah', 'Wei Jie']];

/* =================== data bersama =================== */
const PBCOL = { merah: 'rd', biru: 'tr', hijau: 'gr', kuning: 'am', ungu: 'pu', oren: 'pa' };
const PBCN = Object.keys(PBCOL);
const PBVOK = 'AEIOU';
// perkataan dengan huruf berulang (kad huruf)
const PBWRD = ['MATEMATIK', 'MALAYSIA', 'PUTRAJAYA', 'KELANTAN', 'TERENGGANU', 'PAHANG', 'MERDEKA', 'SARAWAK', 'JOHOR', 'MELAKA', 'SABAH', 'KEBARANGKALIAN'];
// perkataan tanpa huruf berulang (ruang sampel)
// (tiada huruf S atau A supaya tidak keliru dengan nama set S dan A)
const PBWDU = ['BUKIT', 'KOMPUTER', 'PINTU', 'TIMUR', 'PUTIH', 'TELUK', 'BIRU'].filter(w => new Set(w).size === w.length && !/[SA]/.test(w));
const PBBULAN = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
const PBHARI = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu', 'Ahad'];

// peristiwa bagi nombor bulat a..b: [nama, syarat, nama pelengkap]
function pbEvs(r, a, b) {
  const E = [
    ['nombor genap', n => n % 2 === 0, 'nombor ganjil'],
    ['nombor ganjil', n => n % 2 === 1, 'nombor genap'],
    ['nombor perdana', pbPrime, 'nombor yang bukan nombor perdana'],
    ['nombor gandaan 3', n => n % 3 === 0, 'nombor yang bukan gandaan 3'],
    ['nombor gandaan 4', n => n % 4 === 0, 'nombor yang bukan gandaan 4'],
    ['nombor gandaan 5', n => n % 5 === 0, 'nombor yang bukan gandaan 5'],
    ['faktor bagi 12', n => 12 % n === 0, 'nombor yang bukan faktor bagi 12'],
    ['faktor bagi 18', n => 18 % n === 0, 'nombor yang bukan faktor bagi 18'],
    ['faktor bagi 20', n => 20 % n === 0, 'nombor yang bukan faktor bagi 20'],
    ['nombor kuasa dua sempurna', n => Math.round(Math.sqrt(n)) ** 2 === n, 'nombor yang bukan kuasa dua sempurna']
  ];
  const k1 = r.i(a + 1, b - 2), k2 = r.i(a + 2, b - 1);
  E.push([`nombor lebih besar daripada ${k1}`, n => n > k1, `nombor yang kurang daripada atau sama dengan ${k1}`]);
  E.push([`nombor kurang daripada ${k2}`, n => n < k2, `nombor yang lebih besar daripada atau sama dengan ${k2}`]);
  return E;
}
// pilih satu peristiwa dengan lo ≤ n(A) ≤ n(S) − gap
function pbEvent(r, a, b, lo = 1, gap = 1) {
  const S = pbRange(a, b);
  const E = pbEvs(r, a, b).map(([nm, f, cn]) => { const A = S.filter(f); return { nm, cn, A, C: S.filter(x => !f(x)) }; }).filter(e => e.A.length >= lo && e.A.length <= S.length - gap);
  return Object.assign({ S }, r.p(E));
}

/* =================== rajah (warna tema var(--…)) =================== */
const pbT = (x, y, t, c = 'tx', sz = 17, a = 'middle', w = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pbSvg = (W, H, s, label) => `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
const PBPIP = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function pbDie(x, y, s, v, c = 'tr') {
  let o = `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * .18}" style="fill:var(--surf);stroke:var(--${c})" stroke-width="3"/>`;
  (PBPIP[v] || []).forEach(([dx, dy]) => { o += `<circle cx="${+(x + s / 2 + dx * s * .27).toFixed(1)}" cy="${+(y + s / 2 + dy * s * .27).toFixed(1)}" r="${+(s * .09).toFixed(1)}" style="fill:var(--tx)"/>`; });
  return o;
}
function pbDiceFig(vals, label) {
  const s = 46, g = 10, W = vals.length * (s + g) + g;
  return pbSvg(W, s + 2 * g + 4, vals.map((v, i) => pbDie(g + i * (s + g), g + 2, s, v)).join(''), label || 'Dadu');
}
function pbCoinFig() {
  let s = `<circle cx="80" cy="70" r="50" style="fill:var(--am);fill-opacity:.25;stroke:var(--am)" stroke-width="4"/><circle cx="80" cy="70" r="40" style="fill:none;stroke:var(--am)" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  const st = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 11 : 26; st.push(`${(80 + rr * Math.cos(a)).toFixed(1)},${(70 + rr * Math.sin(a)).toFixed(1)}`); }
  s += `<polygon points="${st.join(' ')}" style="fill:var(--am)"/>`;
  s += `<circle cx="220" cy="70" r="50" style="fill:var(--mu);fill-opacity:.2;stroke:var(--mu)" stroke-width="4"/><circle cx="220" cy="70" r="40" style="fill:none;stroke:var(--mu)" stroke-width="1.5" stroke-dasharray="3 4"/>`;
  s += pbT(220, 64, '50', 'tx', 34) + pbT(220, 92, 'SEN', 'mu', 13);
  s += pbT(80, 140, 'Gambar', 'am', 17) + pbT(220, 140, 'Angka', 'mu', 17);
  return pbSvg(300, 156, s, 'Dua permukaan syiling: gambar dan angka');
}
function pbCardsFig(labels, label) {
  const per = Math.min(labels.length, 8), w = 36, h = 48, g = 8, rows = Math.ceil(labels.length / per);
  const W = per * (w + g) + g, H = rows * (h + g) + g;
  let s = '';
  labels.forEach((t, i) => { const x = g + (i % per) * (w + g), y = g + Math.floor(i / per) * (h + g); s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:var(--surf);stroke:var(--tr)" stroke-width="2.5"/>` + pbT(x + w / 2, y + h / 2 + 1, t, 'tx', String(t).length > 2 ? 15 : 20); });
  return pbSvg(W, H, s, label || 'Kad');
}
// pemutar: secs = [{ t: label, c: kunci warna }]
function pbSpinFig(secs, label, foot) {
  const n = secs.length, cx = 150, cy = 128, R = 112; let s = '';
  secs.forEach((sc, i) => {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, am = (a0 + a1) / 2;
    const p = a => `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`;
    s += `<path d="M${cx} ${cy}L${p(a0)}A${R} ${R} 0 0 1 ${p(a1)}Z" style="fill:var(--${sc.c});fill-opacity:.4;stroke:var(--tx)" stroke-width="2" stroke-linejoin="round"/>`;
    if (sc.t !== '') s += pbT(cx + R * .64 * Math.cos(am), cy + R * .64 * Math.sin(am), sc.t, 'tx', String(sc.t).length > 3 ? 13 : 21);
  });
  const pa = -Math.PI / 2 + .55, L = R * .36, ex = cx + L * Math.cos(pa), ey = cy + L * Math.sin(pa), nx = -Math.sin(pa), ny = Math.cos(pa);
  s += `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" style="stroke:var(--tx)" stroke-width="5" stroke-linecap="round"/>`;
  s += `<polygon points="${(ex + 14 * Math.cos(pa)).toFixed(1)},${(ey + 14 * Math.sin(pa)).toFixed(1)} ${(ex + 8 * nx).toFixed(1)},${(ey + 8 * ny).toFixed(1)} ${(ex - 8 * nx).toFixed(1)},${(ey - 8 * ny).toFixed(1)}" style="fill:var(--tx)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="9" style="fill:var(--tx)"/>`;
  if (foot) s += pbT(150, 268, foot, 'mu', 14, 'middle', 600);
  return pbSvg(300, foot ? 282 : 256, s, label || 'Pemutar');
}
// balang guli: parts = [[warna, bilangan|'?'] …]
function pbBagFig(parts, label) {
  const tot = pbSum(parts.map(p => (typeof p[1] === 'number' ? p[1] : 0))), grid = tot <= 30 && parts.every(p => typeof p[1] === 'number');
  let s = '', W = 320, jw, jh, x0;
  const marble = (x, y, c, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--${c});stroke:var(--tx)" stroke-width="1.2" stroke-opacity=".5"/><circle cx="${+(x - r * .35).toFixed(1)}" cy="${+(y - r * .35).toFixed(1)}" r="${+(r * .28).toFixed(1)}" style="fill:#fff" fill-opacity=".55"/>`;
  if (grid) {
    const cols = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(tot * 1.8)))), rows = Math.ceil(tot / cols), d = 28;
    jw = cols * d + 28; jh = rows * d + 30; x0 = (W - jw) / 2;
    const list = []; parts.forEach(([nm, k]) => { for (let i = 0; i < k; i++) list.push(PBCOL[nm]); });
    s += `<rect x="${x0 + jw * .25}" y="10" width="${jw * .5}" height="16" rx="5" style="fill:var(--mu);fill-opacity:.35;stroke:var(--mu)" stroke-width="2"/>`;
    s += `<rect x="${x0}" y="24" width="${jw}" height="${jh}" rx="22" style="fill:var(--surf);fill-opacity:.6;stroke:var(--mu)" stroke-width="3"/>`;
    list.forEach((c, k) => { const row = rows - 1 - Math.floor(k / cols), col = k % cols; s += marble(x0 + 14 + d / 2 + col * d, 24 + 15 + d / 2 + row * d, c); });
  } else {
    const n = parts.length, d = 74; jw = n * d + 28; jh = 96; x0 = (W - jw) / 2;
    s += `<rect x="${x0 + jw * .25}" y="10" width="${jw * .5}" height="16" rx="5" style="fill:var(--mu);fill-opacity:.35;stroke:var(--mu)" stroke-width="2"/>`;
    s += `<rect x="${x0}" y="24" width="${jw}" height="${jh}" rx="22" style="fill:var(--surf);fill-opacity:.6;stroke:var(--mu)" stroke-width="3"/>`;
    parts.forEach(([nm, k], i) => { const x = x0 + 14 + d / 2 + i * d; s += marble(x, 58, PBCOL[nm], 17) + pbT(x, 96, `× ${k}`, 'tx', 18); });
  }
  // petunjuk warna
  let lx = 10, ly = 24 + jh + 22; const items = [];
  parts.forEach(([nm]) => { const w = 26 + nm.length * 8.5 + 14; if (lx + w > W - 6) { lx = 10; ly += 24; } items.push([lx, ly, nm]); lx += w; });
  const shift = (W - lx) / 2 > 0 && items.every(it => it[1] === items[0][1]) ? (W - lx) / 2 : 0;
  items.forEach(([x, y, nm]) => { s += `<circle cx="${x + shift + 8}" cy="${y}" r="7" style="fill:var(--${PBCOL[nm]})"/>` + pbT(x + shift + 20, y + 1, nm, 'mu', 14, 'start', 600); });
  return pbSvg(W, ly + 16, s, label || 'Guli dalam balang');
}
// jadual: rows = [[tajuk, …], …]
function pbTabFig(rows, label) {
  const nc = rows[0].length, fw = Math.max(...rows.map(r => String(r[0]).length)) * 9 + 26;
  const cw = Math.max(42, Math.max(...rows.flatMap(r => r.slice(1).map(c => String(c).length))) * 10 + 22), rh = 40;
  const W = fw + (nc - 1) * cw, H = rows.length * rh;
  let s = `<rect x="2" y="2" width="${W}" height="${H}" rx="8" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  s += `<rect x="2" y="2" width="${fw}" height="${H}" rx="8" style="fill:var(--tr);fill-opacity:.12"/>`;
  if (String(rows[0][0]) === '') s += `<rect x="2" y="2" width="${W}" height="${rh}" rx="8" style="fill:var(--tr);fill-opacity:.12"/>`;
  for (let i = 1; i < rows.length; i++) s += `<line x1="2" y1="${2 + i * rh}" x2="${2 + W}" y2="${2 + i * rh}" style="stroke:var(--bd)" stroke-width="2"/>`;
  for (let j = 0; j < nc - 1; j++) s += `<line x1="${2 + fw + j * cw}" y1="2" x2="${2 + fw + j * cw}" y2="${2 + H}" style="stroke:var(--bd)" stroke-width="2"/>`;
  rows.forEach((r, i) => r.forEach((c, j) => { const x = j === 0 ? 2 + fw / 2 : 2 + fw + (j - 1) * cw + cw / 2; s += pbT(x, 2 + i * rh + rh / 2 + 1, c, j === 0 || (i === 0 && String(rows[0][0]) === '') ? 'tr' : 'tx', 15, 'middle', j === 0 || i === 0 ? 700 : 600); }));
  return pbSvg(W + 4, H + 4, s, label || 'Jadual');
}
// gambar rajah Venn: S (semua unsur), A (subset); shade: 'comp' | 'A' | ''
const PBVIN = (() => { const o = []; [-54, -27, 0, 27, 54].forEach(dy => { const hw = Math.sqrt(80 * 80 - dy * dy) - 16; for (let dx = -56; dx <= 56; dx += 28) if (Math.abs(dx) <= hw) o.push([118 + dx, 112 + dy]); }); return o.sort((p, q) => Math.hypot(p[0] - 118, p[1] - 112) - Math.hypot(q[0] - 118, q[1] - 112)); })();
const PBVOUT = [[226, 34], [262, 34], [298, 34], [226, 72], [262, 72], [298, 72], [226, 110], [262, 110], [298, 110], [226, 148], [262, 148], [298, 148], [226, 186], [262, 186], [298, 186], [176, 200], [62, 200], [24, 200]];
function pbVennFig(S, A, shade) {
  const inA = S.filter(x => A.includes(x)), out = S.filter(x => !A.includes(x));
  let s = '';
  if (shade === 'comp') s += `<path d="M8 10h306v204H8zM38 112a80 80 0 1 0 160 0a80 80 0 1 0 -160 0z" fill-rule="evenodd" style="fill:var(--pk);fill-opacity:.28"/>`;
  s += `<rect x="8" y="10" width="306" height="204" rx="10" style="fill:none;stroke:var(--tx)" stroke-width="2.5"/>`;
  s += `<circle cx="118" cy="112" r="80" style="fill:var(--tr);fill-opacity:${shade === 'A' ? .3 : .1};stroke:var(--tr)" stroke-width="3"/>`;
  s += pbT(24, 28, 'S', 'tx', 19) + pbT(50, 44, 'A', 'tr', 19);
  const slotsIn = PBVIN.slice(0, inA.length).sort((p, q) => p[1] - q[1] || p[0] - q[0]);
  inA.forEach((x, i) => { s += pbT(slotsIn[i][0], slotsIn[i][1], x, 'tx', String(x).length > 2 ? 13 : 16, 'middle', 600); });
  out.forEach((x, i) => { const p = PBVOUT[i]; s += pbT(p[0], p[1], x, 'tx', String(x).length > 2 ? 13 : 16, 'middle', 600); });
  return pbSvg(322, 222, s, 'Gambar rajah Venn bagi S dan A');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 13.1 Eksperimen Kebarangkalian ---------- */
  ruangSampel: [
    ({ desc }) => ({ q: `${desc} Senaraikan ruang sampel, S bagi eksperimen ini.` }),
    ({ desc }) => ({ q: `${desc} Tulis semua kesudahan yang mungkin dalam tatatanda set.` }),
    ({ desc, Ss, n }) => ({ q: `${desc} Nyatakan ruang sampel, S dan bilangan kesudahan yang mungkin, n(S).`, ans: `S = ${Ss}, n(S) = ${n}` }),
    ({ desc }) => { const N = vnama(); return { q: `${N} menjalankan satu eksperimen. ${desc} Apakah ruang sampel bagi eksperimen ${N}?` }; },
    ({ desc, wrong, miss, ans }) => { const N = vnama(); return Object.assign({ q: `${desc} ${N} menulis ruang sampelnya sebagai S = ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `Kesudahan ${miss} tertinggal. Ruang sampel mesti mengandungi semua kesudahan yang mungkin.`)); }
  ],
  kebExp: [
    ({ c, e, en }) => ({ q: `${c} dan ${e}. Hitung kebarangkalian eksperimen ${en}.` }),
    ({ c, e, en }) => ({ q: `Dalam satu eksperimen, ${pbLc(c)}. Didapati ${e}. Cari kebarangkalian eksperimen ${en}.` }),
    ({ c, e, en }) => ({ q: `${c}. Keputusannya, ${e}. Apakah kebarangkalian eksperimen ${en}? Beri jawapan dalam pecahan termudah.` }),
    ({ c, e, en, f, n, ans }) => { const N = vnama(); return Object.assign({ q: `${c} dan ${e}. ${N} berkata kebarangkalian eksperimen ${en} ialah ${pbFr(f, n - f)}. Adakah ${N} betul?` }, salah(N, ans, `${N} membahagikan dengan bilangan kali peristiwa itu tidak berlaku (${n - f}). Sepatutnya bahagi dengan jumlah cubaan, iaitu ${n}.`)); },
    ({ f, n }) => ({ q: `Lengkapkan: Kebarangkalian eksperimen = kekerapan peristiwa ÷ bilangan cubaan = ${f} ÷ ${n} = ___` }),
    ({ c, e, en, f, n }) => ({ q: `${c} dan ${e}. Nyatakan kebarangkalian eksperimen ${en} dalam bentuk peratus.`, ans: `${pbNum(100 * f / n)}%`, work: ['Kebarangkalian eksperimen = kekerapan peristiwa ÷ bilangan cubaan', `= ${f}/${n} × 100%`, `= ${pbNum(100 * f / n)}%`] })
  ],
  jadual: [
    ({ x, ev }) => ({ q: `Jadual di bawah menunjukkan keputusan ${x}. Hitung kebarangkalian eksperimen ${ev}.` }),
    ({ ev }) => ({ q: `Berdasarkan jadual kekerapan di bawah, cari kebarangkalian eksperimen ${ev}.` }),
    ({ x, ev }) => { const N = vnama(); return { q: `${N} merekodkan keputusan ${x} dalam jadual di bawah. Apakah kebarangkalian eksperimen ${ev}?` }; },
    ({ x, ev, n, ans }) => ({ q: `Jadual di bawah menunjukkan keputusan ${x}. (a) Berapakah jumlah cubaan? (b) Cari kebarangkalian eksperimen ${ev}.`, ans: `(a) ${n} (b) ${ans}` })
  ],
  jangka: [
    ({ en, p, tr, ask }) => ({ q: `Kebarangkalian eksperimen ${en} ialah ${p}. Jika ${tr}, ${ask}?` }),
    ({ c, e, tr, ask, f, n, p, N, ans }) => ({ q: `${c} dan ${e}. Jika ${tr}, ${ask}?`, work: [`Kebarangkalian eksperimen = ${pbEq(f, n)}`, 'Kekerapan dijangka = kebarangkalian × bilangan cubaan', `= ${p} × ${N}`, `= ${ans}`] }),
    ({ en, p, tr, ask }) => ({ q: `Berdasarkan rekod lepas, kebarangkalian ${en} ialah ${p}. Seterusnya, ${tr}. ${vcap(ask)}?` }),
    ({ en, p, tr, ask, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Kebarangkalian eksperimen ${en} ialah ${p}. Jika ${tr}, ${ask}? ${N} menjawab ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} mengira bilangan kali peristiwa itu tidak berlaku.`)); }
  ],
  cubaan: [
    ({ A, B, n1, f1, n2, f2, x, ev, th, p1, p2 }) => ({ q: `${A} ${x} ${n1} kali dan ${ev} sebanyak ${f1} kali. ${B} ${x} ${n2} kali dan ${ev} sebanyak ${f2} kali. (a) Hitung kebarangkalian eksperimen ${ev} bagi setiap murid. (b) Keputusan siapakah lebih hampir kepada kebarangkalian teori, ${th}? Beri sebab.`, ans: `(a) ${A}: ${p1}, ${B}: ${p2} (b) ${B}, kerana bilangan cubaannya lebih besar` }),
    ({ A, B, n1, f1, n2, f2, x, ev, th }) => ({ q: `Dua orang murid menjalankan eksperimen ${x}. ${A} membuat ${n1} cubaan dan ${ev} sebanyak ${f1} kali, manakala ${B} membuat ${n2} cubaan dan ${ev} sebanyak ${f2} kali. Kebarangkalian eksperimen siapakah lebih hampir kepada kebarangkalian teori, ${th}? Terangkan.`, ans: `${B}, kerana semakin besar bilangan cubaan, semakin hampir kebarangkalian eksperimen kepada kebarangkalian teori` }),
    ({ A, B, n1, f1, n2, f2, x, ev, th, p1, p2 }) => ({ q: `${A} ${x} ${n1} kali dan ${ev} sebanyak ${f1} kali, manakala ${B} ${x} ${n2} kali dan ${ev} sebanyak ${f2} kali. ${A} berkata bilangan cubaan tidak mempengaruhi kebarangkalian eksperimen. Adakah ${A} betul? Gunakan keputusan kedua-dua murid untuk menyokong jawapan anda.`, ans: `Tidak betul. Kebarangkalian eksperimen ${B} (${p2}) lebih hampir kepada ${th} berbanding ${A} (${p1}) kerana bilangan cubaannya lebih besar` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  k131: [
    ({ sp }) => ({ q: `Sebuah pemutar empat warna diputar beberapa kali dan keputusannya direkodkan dalam jadual di bawah. (a) Hitung kebarangkalian eksperimen jarum berhenti pada warna ${sp.c}. (b) Jika pemutar itu diputar ${sp.N} kali lagi, anggarkan bilangan kali jarum berhenti pada warna ${sp.c}.`, ans: `(a) ${sp.p} (b) ${sp.E} kali`, work: [`Jumlah cubaan = ${sp.f.join(' + ')} = ${sp.n}`, `(a) Kebarangkalian eksperimen = ${pbEq(sp.k, sp.n)}`, `(b) Kekerapan dijangka = ${sp.p} × ${sp.N} = ${sp.E}`] }),
    ({ dd }) => ({ q: `${dd.A} melambung sebiji dadu sebanyak ${dd.n} kali dan merekodkan keputusannya dalam jadual di bawah. (a) Hitung kebarangkalian eksperimen mendapat nombor perdana. (b) Kebarangkalian teori mendapat nombor perdana ialah 1/2. Apakah yang perlu ${dd.A} lakukan supaya kebarangkalian eksperimennya lebih hampir kepada 1/2?`, ans: `(a) ${dd.p} (b) Tambahkan bilangan cubaan, iaitu lambung dadu itu lebih banyak kali`, work: [`Nombor perdana: 2, 3 dan 5. Kekerapan = ${dd.f[1]} + ${dd.f[2]} + ${dd.f[4]} = ${dd.k}`, `(a) Kebarangkalian eksperimen = ${pbEq(dd.k, dd.n)}`, '(b) Semakin besar bilangan cubaan, semakin hampir kebarangkalian eksperimen kepada kebarangkalian teori.'] }),
    ({ mt }) => ({ q: `Sebuah kilang menguji ${mt.s} biji mentol yang dipilih secara rawak dan mendapati ${mt.d} biji rosak. (a) Hitung kebarangkalian eksperimen sebiji mentol rosak. (b) Kilang itu menghasilkan ${mt.B} biji mentol sebulan. Anggarkan bilangan mentol yang tidak rosak.`, ans: `(a) ${mt.p} (b) ${mt.ok} biji`, work: [`(a) Kebarangkalian eksperimen = ${pbEq(mt.d, mt.s)}`, `(b) Anggaran mentol rosak = ${mt.p} × ${mt.B} = ${mt.bad}`, `Mentol tidak rosak = ${mt.B} − ${mt.bad} = ${mt.ok}`] }),
    ({ ar }) => ({ q: `Berdasarkan latihan lepas, kebarangkalian eksperimen ${ar.A} memanah tepat pada sasaran ialah ${ar.pd}. Dalam satu pertandingan, ${ar.A} memanah sebanyak ${ar.N} kali. (a) Anggarkan bilangan kali panahannya tepat pada sasaran. (b) Anggarkan bilangan kali panahannya tersasar.`, ans: `(a) ${ar.hit} kali (b) ${ar.miss} kali`, work: [`(a) ${ar.pd} × ${ar.N} = ${ar.hit}`, `(b) ${ar.N} − ${ar.hit} = ${ar.miss}`] })
  ],

  /* ---------- 13.2 Kebarangkalian Teori ---------- */
  setA: [
    ({ Ss, ev }) => ({ q: `Satu nombor dipilih secara rawak daripada S = ${Ss}. A ialah peristiwa mendapat ${ev}. Senaraikan semua unsur A dan nyatakan n(A).` }),
    ({ Ss, ev, As }) => ({ q: `Diberi ruang sampel S = ${Ss}. Tulis peristiwa A, iaitu mendapat ${ev}, dalam tatatanda set.`, ans: `A = ${As}` }),
    ({ a, b, ev, As }) => ({ q: `Sekeping kad dipilih secara rawak daripada kad bernombor ${a} hingga ${b}. Peristiwa A ialah mendapat ${ev}. Senaraikan unsur A.`, ans: `A = ${As}` }),
    ({ Ss, ev, wrong, why, As }) => { const N = vnama(); return Object.assign({ q: `S = ${Ss} dan A ialah peristiwa mendapat ${ev}. ${N} menulis A = ${wrong}. Adakah ${N} betul?` }, salah(N, `A = ${As}`, why)); }
  ],
  pDadu: [
    ({ ev }) => ({ q: `Sebiji dadu adil dilambung. Cari kebarangkalian mendapat ${ev}.` }),
    ({ ev }) => ({ q: `Sebiji dadu dilambung sekali. Hitung P(A), dengan A ialah peristiwa mendapat ${ev}.` }),
    ({ ev }) => { const N = vnama(); return { q: `${N} melambung sebiji dadu adil. Apakah kebarangkalian dia mendapat ${ev}?` }; },
    ({ ev, nA, ans }) => { const N = vnama(); return Object.assign({ q: `Sebiji dadu dilambung. ${N} berkata kebarangkalian mendapat ${ev} ialah ${pbFr(nA, 6 - nA)}. Adakah ${N} betul?` }, salah(N, ans, `Penyebut mestilah bilangan semua kesudahan, n(S) = 6, bukan ${6 - nA}.`)); }
  ],
  pKad: [
    ({ L, a, b, ev }) => ({ q: `Sebuah kotak mengandungi ${L} keping kad bernombor ${a} hingga ${b}. Sekeping kad dipilih secara rawak. Cari kebarangkalian kad yang dipilih ialah ${ev}.` }),
    ({ a, b, ev }) => ({ q: `Kad bernombor ${a}, ${a + 1}, ${a + 2}, …, ${b} dimasukkan ke dalam sebuah kotak. Sekeping kad dicabut secara rawak. Hitung kebarangkalian mendapat ${ev}.` }),
    ({ Ss, ev }) => ({ q: `Satu nombor dipilih secara rawak daripada S = ${Ss}. Cari P(A) jika A ialah peristiwa mendapat ${ev}.` }),
    ({ a, b, ev }) => { const N = vnama(); return { q: `${N} memilih satu nombor secara rawak daripada ${a} hingga ${b}. Apakah kebarangkalian nombor yang dipilih ialah ${ev}?` }; }
  ],
  pHuruf: [
    ({ w, ev }) => ({ q: `Setiap huruf daripada perkataan "${w}" ditulis pada sekeping kad. Kad-kad itu dimasukkan ke dalam sebuah kotak dan sekeping kad dipilih secara rawak. Cari kebarangkalian mendapat ${ev}.` }),
    ({ n, ev }) => ({ q: `Rajah di bawah menunjukkan ${n} keping kad huruf. Sekeping kad dipilih secara rawak. Hitung kebarangkalian kad itu ialah ${ev}.` }),
    ({ w, ev }) => { const N = vnama(); return { q: `${N} menyusun kad huruf yang membentuk perkataan "${w}". Sekeping kad diambil secara rawak. Apakah kebarangkalian mendapat ${ev}?` }; },
    ({ w, ev, claim, ans, n }) => { const N = vnama(); return Object.assign({ q: `Kad huruf bagi perkataan "${w}" dimasukkan ke dalam sebuah kotak. Sekeping kad dipilih secara rawak. ${N} berkata kebarangkalian mendapat ${ev} ialah ${claim}. Adakah ${N} betul?` }, salah(N, ans, `Setiap kad dikira, termasuk huruf yang berulang. Maka n(S) = ${n}.`)); }
  ],
  julat: [
    ({ x, ev }) => ({ q: `${x} Nyatakan kebarangkalian ${ev}. Adakah peristiwa itu mustahil, pasti atau mungkin berlaku?` }),
    ({ x, ev }) => ({ q: `${x} Tentukan sama ada peristiwa ${ev} mustahil, pasti atau mungkin berlaku, dan nyatakan kebarangkaliannya.` }),
    ({ x, ev, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} berkata kebarangkalian ${ev} ialah ${claim}. Adakah ${N} betul?` }, salah(N, ans, 'Kebarangkalian = n(A) ÷ n(S).')); }
  ],
  pPutar: [
    ({ n, ev }) => ({ q: `Rajah di bawah menunjukkan sebuah pemutar yang dibahagikan kepada ${n} sektor sama besar. Pemutar itu diputar sekali. Cari kebarangkalian jarum berhenti pada ${ev}.` }),
    ({ ev }) => ({ q: `Pemutar dalam rajah di bawah diputar sekali. Hitung kebarangkalian jarum menunjuk ke ${ev}.` }),
    ({ ev }) => { const N = vnama(); return { q: `${N} memutar pemutar dalam rajah di bawah sekali. Apakah kebarangkalian jarum berhenti pada ${ev}?` }; }
  ],
  ramal: [
    ({ x, ask }) => ({ q: `${x} Ramalkan ${ask}.` }),
    ({ x, ask, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${N} meramalkan ${ask} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, 'Kekerapan dijangka = P(A) × bilangan cubaan.')); },
    ({ x, evd }) => ({ q: `${x} Hitung kekerapan dijangka bagi peristiwa ${evd}.` }),
    ({ p, N }) => ({ q: `Lengkapkan: Kekerapan dijangka = P(A) × bilangan cubaan = ${p} × ${N} = ___`, rev: true })
  ],
  k132: [
    ({ c2 }) => ({ q: `Dua keping syiling dilambung serentak. G mewakili gambar dan A mewakili angka. (a) Senaraikan ruang sampel, S. (b) Cari kebarangkalian mendapat ${c2.ev}.`, ans: `(a) S = {(G, G), (G, A), (A, G), (A, A)} (b) ${c2.p}`, work: ['(a) S = {(G, G), (G, A), (A, G), (A, A)}, n(S) = 4', `(b) Kesudahan yang memenuhi: ${c2.L}, n = ${c2.k}`, `P = ${pbEq(c2.k, 4)}`] }),
    ({ cd }) => ({ q: `Sekeping syiling dan sebiji dadu dilambung serentak. G mewakili gambar dan A mewakili angka. (a) Nyatakan bilangan kesudahan yang mungkin, n(S). (b) Senaraikan kesudahan bagi peristiwa mendapat ${cd.ev}. (c) Cari kebarangkalian mendapat ${cd.ev}.`, ans: `(a) 12 (b) ${cd.L} (c) ${cd.p}`, work: ['(a) S = {(G, 1), (G, 2), …, (G, 6), (A, 1), …, (A, 6)}, n(S) = 2 × 6 = 12', `(b) ${cd.L}, n = ${cd.k}`, `(c) P = ${pbEq(cd.k, 12)}`] }),
    ({ kd }) => ({ q: `Sebuah kotak mengandungi ${kd.L} keping kad bernombor ${kd.a} hingga ${kd.b}. Sekeping kad dicabut secara rawak. A ialah peristiwa mendapat ${kd.ev}. (a) Senaraikan unsur A. (b) Cari P(A). (c) Jika cabutan dilakukan sebanyak ${kd.N} kali dan kad dikembalikan setiap kali, ramalkan bilangan kali peristiwa A berlaku.`, ans: `(a) A = ${kd.As} (b) ${kd.p} (c) ${kd.E} kali`, work: [`(a) A = ${kd.As}, n(A) = ${kd.k}`, `(b) P(A) = ${pbEq(kd.k, kd.L)}`, `(c) ${kd.p} × ${kd.N} = ${kd.E}`] }),
    ({ dd }) => ({ q: `Sebiji dadu adil dilambung. A ialah peristiwa mendapat ${dd.e1} dan B ialah peristiwa mendapat ${dd.e2}. (a) Cari P(A) dan P(B). (b) Peristiwa manakah lebih berkemungkinan berlaku?`, ans: `(a) P(A) = ${dd.p1}, P(B) = ${dd.p2} (b) Peristiwa ${dd.W}`, work: [`A = ${dd.As}, P(A) = ${pbEq(dd.k1, 6)}`, `B = ${dd.Bs}, P(B) = ${pbEq(dd.k2, 6)}`, `Bandingkan: ${dd.k1}/6 dan ${dd.k2}/6. Peristiwa ${dd.W} mempunyai kebarangkalian lebih besar.`] })
  ],

  /* ---------- 13.3 Peristiwa Pelengkap ---------- */
  comp: [
    ({ pa }) => ({ q: `Diberi P(A) = ${pa}. Cari P(A′).` }),
    ({ pa, ev, evc }) => ({ q: `Kebarangkalian ${ev} ialah ${pa}. Hitung kebarangkalian ${evc}.` }),
    ({ pa, ev }) => ({ q: `A ialah peristiwa ${ev}, dengan P(A) = ${pa}. Nyatakan P(A′).` }),
    ({ pa, ans }) => { const N = vnama(); if (VR() < .5) return { q: `Diberi P(A) = ${pa}. ${N} berkata P(A′) = ${ans}. Adakah ${N} betul?`, ans: `Ya, ${N} betul` }; return Object.assign({ q: `Diberi P(A) = ${pa}. ${N} berkata P(A′) juga ${pa} kerana A′ ialah pelengkap A. Adakah ${N} betul?` }, salah(N, `P(A′) = ${ans}`, 'P(A′) = 1 − P(A), bukan sama dengan P(A).')); },
    ({ pa }) => ({ q: `Lengkapkan: P(A′) = 1 − P(A) = 1 − ${pa} = ___` }),
    ({ pa, ev, evc }) => ({ q: `Peluang ${ev} ialah ${pa}. Apakah peluang ${evc}?` })
  ],
  vennA: [
    () => ({ q: 'Gambar rajah Venn di bawah menunjukkan ruang sampel S dan peristiwa A. Senaraikan semua unsur bagi peristiwa pelengkap A′.' }),
    ({ Ss, As }) => ({ q: `Diberi ruang sampel S = ${Ss} dan peristiwa A = ${As}. Tulis A′ dalam tatatanda set.`, rev: true }),
    ({ Cs, nc }) => ({ q: 'Berdasarkan gambar rajah Venn di bawah, nyatakan A′ dan n(A′).', ans: `A′ = ${Cs}, n(A′) = ${nc}` }),
    ({ Ss, As, wrong, miss, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi S = ${Ss} dan A = ${As}. ${N} menulis A′ = ${wrong}. Adakah ${N} betul?`, rev: true }, salah(N, ans, `${miss} bukan unsur A, maka ${miss} ialah unsur A′.`)); }
  ],
  descComp: [
    ({ x, ev }) => ({ q: `${x} A ialah peristiwa mendapat ${ev}. Huraikan peristiwa pelengkap, A′ dalam perkataan dan senaraikan unsurnya.` }),
    ({ x, ev }) => ({ q: `${x} Peristiwa A ialah mendapat ${ev}. Nyatakan peristiwa A′ dalam perkataan dan dalam tatatanda set.` }),
    ({ x, ev }) => ({ q: `${x} Jika A ialah peristiwa mendapat ${ev}, apakah peristiwa A′?` })
  ],
  compCount: [
    ({ x, pk, en }) => ({ q: `${x} ${pk} Cari kebarangkalian ${en}.` }),
    ({ x, pk, en }) => ({ q: `${x} ${pk} Dengan menggunakan konsep peristiwa pelengkap, hitung kebarangkalian ${en}.` }),
    ({ x, pk, ev, pA, ans }) => ({ q: `${x} ${pk} A ialah peristiwa ${ev}. Cari P(A) dan P(A′).`, ans: `P(A) = ${pA}, P(A′) = ${ans}` }),
    ({ x, pk, ev, en, pA, ans }) => { const N = vnama(); return Object.assign({ q: `${x} ${pk} ${N} berkata kebarangkalian ${en} ialah ${pA}. Adakah ${N} betul?` }, salah(N, ans, `${pA} ialah kebarangkalian ${ev}. Kebarangkalian ${en} = 1 − ${pA}.`)); }
  ],
  vennP: [
    () => ({ q: 'Gambar rajah Venn di bawah menunjukkan ruang sampel S dan peristiwa A. Satu unsur dipilih secara rawak daripada S. Cari P(A′).' }),
    ({ pA, ans }) => ({ q: 'Berdasarkan gambar rajah Venn di bawah, hitung P(A) dan P(A′). Seterusnya, tunjukkan bahawa P(A) + P(A′) = 1.', ans: `P(A) = ${pA}, P(A′) = ${ans}; ${pA} + ${ans} = 1` }),
    () => ({ q: 'Kawasan berlorek dalam gambar rajah Venn di bawah mewakili peristiwa A′. Satu unsur dipilih secara rawak daripada S. Cari kebarangkalian unsur itu berada dalam kawasan berlorek.' })
  ],
  cariComp: [
    ({ c, t, pc }) => ({ q: `Dalam ${c.S(t)}, kebarangkalian ${c.not} ialah ${pc}. Hitung ${c.ask}.` }),
    ({ c, t, pc }) => ({ q: `Kebarangkalian ${c.not} ialah ${pc}. Jika terdapat ${t} ${c.noun} kesemuanya, berapakah ${c.ask}?` }),
    ({ t, pc, nA }) => ({ q: `Diberi n(S) = ${t} dan P(A′) = ${pc}. Cari n(A).`, ans: `n(A) = ${nA}` }),
    ({ c, t, pc, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Dalam ${c.S(t)}, kebarangkalian ${c.not} ialah ${pc}. ${N} berkata ${c.ask} ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${wrong} ialah bilangan yang bukan ${c.yes}.`)); }
  ],
  k133: [
    ({ v }) => ({ q: `Diberi ruang sampel S = ${v.Ss} dan A ialah peristiwa mendapat ${v.ev}. (a) Senaraikan unsur A′. (b) Nyatakan n(A′). (c) Cari P(A′).`, ans: `(a) A′ = ${v.Cs} (b) ${v.nc} (c) ${v.p}`, work: [`A = ${v.As}`, `(a) A′ = ${v.Cs}`, `(b) n(A′) = ${v.nc}`, `(c) P(A′) = ${pbEq(v.nc, v.L)}`] }),
    ({ pw }) => ({ q: `Kebarangkalian seorang murid yang dipilih secara rawak daripada sebuah sekolah bukan pengawas ialah ${pw.pc}. Sekolah itu mempunyai ${pw.k} orang pengawas. (a) Cari jumlah murid di sekolah itu. (b) Berapakah bilangan murid yang bukan pengawas?`, ans: `(a) ${pw.t} orang (b) ${pw.t - pw.k} orang`, work: [`P(pengawas) = 1 − ${pw.pc} = ${pw.pa}`, `(a) Jumlah murid = ${pw.k} ÷ ${pw.pa} = ${pw.t}`, `(b) ${pw.t} − ${pw.k} = ${pw.t - pw.k}`] }),
    ({ bg }) => ({ q: `Sebuah beg mengandungi guli merah dan guli biru sahaja. Kebarangkalian mengambil sebiji guli yang bukan merah ialah ${bg.pc}. Jika terdapat ${bg.r} biji guli merah, cari bilangan guli biru.`, ans: `${bg.b} biji`, work: [`P(bukan merah) = P(biru) = ${bg.pc}, maka P(merah) = 1 − ${bg.pc} = ${bg.pa}`, `Jumlah guli = ${bg.r} ÷ ${bg.pa} = ${bg.t}`, `Guli biru = ${bg.t} − ${bg.r} = ${bg.b}`] }),
    ({ tj }) => ({ q: `Dalam satu tinjauan terhadap ${tj.t} orang, kebarangkalian seorang yang dipilih secara rawak tidak meminati bola sepak ialah ${tj.pd}. (a) Berapakah bilangan orang yang meminati bola sepak? (b) Kemudian, ${tj.add} orang lagi yang meminati bola sepak menyertai tinjauan itu. Cari kebarangkalian baharu seorang yang dipilih secara rawak tidak meminati bola sepak.`, ans: `(a) ${tj.yes} orang (b) ${tj.pn}`, work: [`Tidak meminati = ${tj.pd} × ${tj.t} = ${tj.no}`, `(a) Meminati = ${tj.t} − ${tj.no} = ${tj.yes}`, `(b) Jumlah baharu = ${tj.t} + ${tj.add} = ${tj.t + tj.add}`, `P(tidak meminati) = ${pbEq(tj.no, tj.t + tj.add)}`] })
  ],

  /* ---------- 13.4 Kebarangkalian Mudah ---------- */
  guli: [
    ({ desc, c }) => ({ q: `Sebuah beg mengandungi ${desc}. Sebiji guli diambil secara rawak dari beg itu. Cari kebarangkalian guli itu berwarna ${c}.` }),
    ({ c }) => ({ q: `Rajah di bawah menunjukkan guli di dalam sebuah balang. Sebiji guli dipilih secara rawak. Hitung kebarangkalian mendapat guli ${c}.` }),
    ({ desc, c }) => { const N = vnama(); return { q: `${N} mengambil sebiji guli secara rawak daripada sebuah kotak yang mengandungi ${desc}. Apakah kebarangkalian dia mendapat guli ${c}?` }; },
    ({ desc, c, nc, t, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah beg mengandungi ${desc}. Sebiji guli diambil secara rawak. ${N} berkata kebarangkalian mendapat guli ${c} ialah ${pbFr(nc, t - nc)}. Adakah ${N} betul?` }, salah(N, ans, `Penyebut mestilah jumlah semua guli, iaitu ${t}.`)); }
  ],
  cabutan: [
    ({ T, k }) => { const N = vnama(); return { q: `Dalam cabutan bertuah Hari Sukan, ${T} keping tiket telah dijual. ${N} membeli ${k} keping tiket. Satu tiket dicabut secara rawak untuk hadiah utama. Cari kebarangkalian ${N} memenangi hadiah utama.` }; },
    ({ T, k }) => { const N = vnama(); return { q: `Sebanyak ${T} keping tiket cabutan bertuah dijual semasa Hari Kantin. ${N} membeli ${k} keping tiket. Jika satu tiket dicabut, apakah kebarangkalian ${N} menang?` }; },
    ({ T, k }) => { const N = vnama(); return { q: `Dalam satu cabutan bertuah, ${k} daripada ${T} keping tiket ialah milik ${N}. Hitung kebarangkalian tiket yang dicabut bukan milik ${N}.`, ans: pbFr(T - k, T), work: [`P(milik ${N}) = ${pbEq(k, T)}`, `P(bukan milik ${N}) = 1 − ${pbFr(k, T)} = ${pbFr(T - k, T)}`] }; },
    ({ T, k }) => ({ q: `Nama ${T} orang peserta kuiz dimasukkan ke dalam sebuah kotak untuk cabutan hadiah. ${k} orang daripadanya ialah murid Tingkatan 2. Satu nama dicabut secara rawak. Cari kebarangkalian nama yang dicabut ialah murid Tingkatan 2.` })
  ],
  harian: [
    ({ x, pk, ev }) => ({ q: [x, pk, `Cari kebarangkalian ${ev}.`].filter(Boolean).join(' ') }),
    ({ x, pk, ev }) => ({ q: [x, pk, `Apakah kebarangkalian ${ev}? Beri jawapan dalam pecahan termudah.`].filter(Boolean).join(' ') }),
    ({ x, pk, ev }) => ({ q: [x, pk, `Hitung P(A), dengan A ialah peristiwa ${ev}.`].filter(Boolean).join(' ') })
  ],
  cariBil: [
    ({ r, p, b, t }) => ({ q: `Sebuah beg mengandungi ${r} biji guli merah dan beberapa biji guli biru. Kebarangkalian mengambil sebiji guli merah secara rawak ialah ${p}. Cari bilangan guli biru dalam beg itu.`, ans: `${b} biji`, work: ['P(merah) = bilangan guli merah ÷ jumlah guli', `Jumlah guli = ${r} ÷ ${p} = ${t}`, `Guli biru = ${t} − ${r} = ${b}`] }),
    ({ r, p, b, t }) => ({ q: `Sebuah kotak mengandungi ${r} batang pen merah dan sejumlah pen biru. Jika kebarangkalian memilih sebatang pen merah secara rawak ialah ${p}, berapakah bilangan pen biru?`, ans: `${b} batang`, work: ['P(merah) = bilangan pen merah ÷ jumlah pen', `Jumlah pen = ${r} ÷ ${p} = ${t}`, `Pen biru = ${t} − ${r} = ${b}`] }),
    ({ r, p, t }) => ({ q: `Dalam sebuah balang, terdapat ${r} biji gula-gula perisa oren dan selebihnya perisa anggur. Kebarangkalian mengambil sebiji gula-gula perisa oren secara rawak ialah ${p}. Hitung jumlah gula-gula di dalam balang itu.`, ans: `${t} biji`, work: ['Kebarangkalian = bilangan gula-gula oren ÷ jumlah gula-gula', `Jumlah = ${r} ÷ ${p} = ${t}`] }),
    ({ r, p, b, t }) => { const N = vnama(); return { q: `${N} mempunyai ${r} keping kad hijau dan beberapa keping kad kuning. Kebarangkalian dia mencabut sekeping kad hijau secara rawak ialah ${p}. Berapakah bilangan kad kuning yang dia ada?`, ans: `${b} keping`, work: ['P(hijau) = bilangan kad hijau ÷ jumlah kad', `Jumlah kad = ${r} ÷ ${p} = ${t}`, `Kad kuning = ${t} − ${r} = ${b}`] }; }
  ],
  tambah: [
    ({ r, b, k }) => ({ q: `Sebuah beg mengandungi ${r} biji guli merah dan ${b} biji guli biru. ${k} biji guli merah lagi dimasukkan ke dalam beg itu. Cari kebarangkalian mengambil sebiji guli merah sekarang.`, ans: pbFr(r + k, r + b + k), work: [`Guli merah = ${r} + ${k} = ${r + k}`, `Jumlah guli = ${r} + ${b} + ${k} = ${r + b + k}`, `P(merah) = ${pbEq(r + k, r + b + k)}`] }),
    ({ r, b, k2 }) => { const N = vnama(); return { q: `Sebuah kotak mengandungi ${r} biji bola merah dan ${b} biji bola biru. ${N} mengeluarkan ${k2} biji bola biru daripada kotak itu. Sebiji bola kemudian dipilih secara rawak. Hitung kebarangkalian bola itu berwarna biru.`, ans: pbFr(b - k2, r + b - k2), work: [`Bola biru = ${b} − ${k2} = ${b - k2}`, `Jumlah bola = ${r} + ${b} − ${k2} = ${r + b - k2}`, `P(biru) = ${pbEq(b - k2, r + b - k2)}`] }; },
    ({ r, b, a, pt }) => ({ q: `Sebuah beg mengandungi ${r} biji guli merah dan ${b} biji guli biru. Berapakah bilangan guli biru yang perlu ditambah supaya kebarangkalian mengambil sebiji guli merah menjadi ${pt}?`, ans: `${a} biji`, work: [`Jumlah guli baharu = ${r} ÷ ${pt} = ${r + b + a}`, `Guli biru yang perlu ditambah = ${r + b + a} − ${r} − ${b} = ${a}`] })
  ],
  jadual2: [
    ({ K1, g, a1, row1 }) => ({ q: `Jadual di bawah menunjukkan bilangan ahli dua buah kelab. Seorang ahli ${K1} dipilih secara rawak. Cari kebarangkalian ahli itu ialah murid ${g}.`, ans: pbFr(a1, row1), work: [`Jumlah ahli ${K1} = ${row1}`, `Murid ${g} dalam ${K1} = ${a1}`, `P = ${pbEq(a1, row1)}`] }),
    ({ g, col, tot, colW }) => ({ q: `Berdasarkan jadual di bawah, seorang murid dipilih secara rawak daripada semua ahli kedua-dua kelab. Hitung kebarangkalian murid itu ialah murid ${g}.`, ans: pbFr(col, tot), work: [`Jumlah semua ahli = ${tot}`, `Murid ${g} = ${colW} = ${col}`, `P = ${pbEq(col, tot)}`] }),
    ({ K2, row2, tot }) => ({ q: `Seorang murid dipilih secara rawak daripada semua ahli dalam jadual di bawah. Apakah kebarangkalian murid itu ialah ahli ${K2}?`, ans: pbFr(row2, tot), work: [`Jumlah semua ahli = ${tot}`, `Ahli ${K2} = ${row2}`, `P = ${pbEq(row2, tot)}`] })
  ],
  k134: [
    ({ kk }) => ({ q: `Sebuah kotak mengandungi ${kk.t} keping kad merah dan kuning sahaja. Kebarangkalian mencabut sekeping kad merah secara rawak ialah ${kk.p}. (a) Cari bilangan kad kuning. (b) ${kk.x} keping kad merah dikeluarkan daripada kotak itu. Cari kebarangkalian mencabut sekeping kad kuning sekarang.`, ans: `(a) ${kk.y} keping (b) ${pbFr(kk.y, kk.t - kk.x)}`, work: [`Kad merah = ${kk.p} × ${kk.t} = ${kk.m}`, `(a) Kad kuning = ${kk.t} − ${kk.m} = ${kk.y}`, `(b) Jumlah kad sekarang = ${kk.t} − ${kk.x} = ${kk.t - kk.x}`, `P(kuning) = ${pbEq(kk.y, kk.t - kk.x)}`] }),
    ({ t3 }) => ({ q: `Sebuah beg mengandungi guli merah, biru dan hijau. Kebarangkalian mengambil sebiji guli merah ialah ${t3.pr} dan kebarangkalian mengambil sebiji guli biru ialah ${t3.pb}. Jika terdapat ${t3.g} biji guli hijau, cari jumlah guli di dalam beg itu.`, ans: `${t3.t} biji`, work: [`P(hijau) = 1 − ${t3.pr} − ${t3.pb} = ${t3.pg}`, `Jumlah guli = ${t3.g} ÷ ${t3.pg} = ${t3.t}`] }),
    ({ tb }) => ({ q: `Sebuah balang mengandungi ${tb.r} biji guli merah dan ${tb.b} biji guli biru. Beberapa biji guli merah ditambah ke dalam balang itu supaya kebarangkalian mengambil sebiji guli merah menjadi ${tb.pt}. Berapakah bilangan guli merah yang ditambah?`, ans: `${tb.x} biji`, work: [`Katakan x biji guli merah ditambah: (${tb.r} + x) ÷ (${tb.r + tb.b} + x) = ${tb.pt}`, `${tb.q}(${tb.r} + x) = ${tb.p === 1 ? '' : tb.p}(${tb.r + tb.b} + x)`, `${tb.q * tb.r} + ${tb.q}x = ${tb.p * (tb.r + tb.b)} + ${tb.p === 1 ? '' : tb.p}x`, tb.q - tb.p === 1 ? `x = ${tb.p * (tb.r + tb.b)} − ${tb.q * tb.r} = ${tb.x}` : `${tb.q - tb.p}x = ${tb.p * (tb.r + tb.b) - tb.q * tb.r}, maka x = ${tb.x}`] }),
    ({ dg }) => ({ q: `Dalam satu permainan, seorang pemain menang jika mendapat ${dg.ev} apabila sebiji dadu adil dilambung. ${dg.A} bermain sebanyak ${dg.N} kali. (a) Cari kebarangkalian ${dg.A} menang dalam satu permainan. (b) Anggarkan bilangan kali ${dg.A} kalah.`, ans: `(a) ${dg.p} (b) ${dg.lose} kali`, work: [`A = ${dg.As}, P(menang) = ${pbEq(dg.k, 6)}`, `P(kalah) = 1 − ${dg.p} = ${dg.pl}`, `(b) Bilangan kali kalah = ${dg.pl} × ${dg.N} = ${dg.lose}`] })
  ]
};

/* =================== pembina soalan (r = pbRG atau pbRW) =================== */
const PB = {};
const pbOne = (o, fig) => (fig ? Object.assign(o, { fig }) : o);

/* ---------- 13.1 ---------- */
const PBEXP = [
  r => ({ desc: 'Sekeping syiling dilambung sekali.', S: ['Gambar', 'Angka'], fig: pbCoinFig() }),
  r => ({ desc: 'Sebiji dadu adil dilambung sekali.', S: pbRange(1, 6), fig: pbDiceFig([r.i(1, 6)]), ex: 7 }),
  r => { const n = r.i(3, 6), L = 'KLMNPQ'.slice(0, n).split(''), cs = ['tr', 'pk', 'am', 'gr', 'pu', 'pa']; return { desc: `Sebuah pemutar dibahagikan kepada ${n} sektor sama besar berlabel ${pbDan(L)}. Pemutar itu diputar sekali.`, S: L, fig: pbSpinFig(L.map((t, i) => ({ t, c: cs[i] }))), ex: 'KLMNPQR'[n] }; },
  r => { const w = r.p(PBWDU), ex = 'ZXQVYWF'.split('').find(c => !w.includes(c)); return { desc: `Setiap huruf daripada perkataan "${w}" ditulis pada sekeping kad. Sekeping kad dipilih secara rawak.`, S: w.split(''), fig: pbCardsFig(w.split(''), `Kad huruf ${w}`), ex }; },
  r => { const a = r.i(1, 6), b = a + r.i(4, 7); return { desc: `Sebuah kotak mengandungi kad bernombor ${a} hingga ${b}. Sekeping kad dicabut secara rawak.`, S: pbRange(a, b), fig: pbCardsFig(pbRange(a, b), 'Kad nombor'), ex: b + 1 }; },
  r => { const cs = pbShuf(r, PBCN).slice(0, r.i(2, 4)), parts = cs.map(c => [c, r.i(1, 4)]); return { desc: `Sebuah beg mengandungi guli berwarna ${pbDan(cs)}. Sebiji guli diambil secara rawak dan warnanya dicatat.`, S: cs, fig: pbBagFig(parts), ex: PBCN.find(c => !cs.includes(c)) }; },
  r => ({ desc: 'Satu huruf vokal dipilih secara rawak daripada abjad Rumi.', S: ['a', 'e', 'i', 'o', 'u'], ex: 'y' }),
  r => ({ desc: 'Satu hari dalam seminggu dipilih secara rawak.', S: PBHARI.slice() })
];
PB.ruangSampel = (r, k) => {
  const e = (k == null ? r.p(PBEXP) : PBEXP[k % PBEXP.length])(r), Ss = pbSet(e.S), n = e.S.length;
  const mi = r.i(0, n - 1), miss = e.S[mi], wrong = pbSet(e.S.filter((_, i) => i !== mi));
  return GEN_LQ('ruangSampel', { desc: e.desc, Ss, n, wrong, miss, ans: `S = ${Ss}`, work: ['Ruang sampel ialah set semua kesudahan yang mungkin bagi suatu eksperimen.', `S = ${Ss}`, `n(S) = ${n}`] }, e.fig ? { fig: e.fig } : {});
};
// [konteks(n), peristiwa(f), nama peristiwa, cubaan baharu(N), soalan jangkaan, julat nisbah]
const PBKX = [
  [n => `Sebiji dadu dilambung ${n} kali`, f => `nombor 6 diperoleh sebanyak ${f} kali`, 'mendapat nombor 6', N => `dadu itu dilambung ${N} kali`, 'berapa kalikah nombor 6 dijangka diperoleh', [.1, .25]],
  [n => `Sekeping syiling dilambung ${n} kali`, f => `gambar diperoleh sebanyak ${f} kali`, 'mendapat gambar', N => `syiling itu dilambung ${N} kali`, 'berapa kalikah gambar dijangka diperoleh', [.38, .62]],
  [n => `Seorang pemain bola keranjang membuat ${n} balingan`, f => `${f} balingan masuk ke dalam jaring`, 'balingan masuk ke dalam jaring', N => `pemain itu membuat ${N} balingan`, 'berapa balingan dijangka masuk ke dalam jaring', [.3, .8]],
  [n => `Sebanyak ${n} biji benih kacang hijau ditanam`, f => `${f} biji benih bercambah`, 'sebiji benih bercambah', N => `${N} biji benih yang sama ditanam`, 'berapa biji benih dijangka bercambah', [.6, .95]],
  [n => `Sebuah pemutar diputar ${n} kali`, f => `jarumnya berhenti pada sektor merah sebanyak ${f} kali`, 'jarum berhenti pada sektor merah', N => `pemutar itu diputar ${N} kali`, 'berapa kalikah jarum dijangka berhenti pada sektor merah', [.15, .4]],
  [n => `Sebanyak ${n} biji mentol diuji di sebuah kilang`, f => `${f} biji mentol didapati rosak`, 'sebiji mentol rosak', N => `${N} biji mentol daripada kilang yang sama diuji`, 'berapa biji mentol dijangka rosak', [.02, .12]],
  [n => `Seorang pemain bola sepak membuat ${n} sepakan penalti`, f => `${f} sepakan menjaringkan gol`, 'sepakan penalti menjaringkan gol', N => `pemain itu membuat ${N} sepakan penalti`, 'berapa sepakan dijangka menjaringkan gol', [.5, .9]],
  [n => `Sekeping kad dicabut secara rawak daripada sebuah kotak dan dikembalikan semula, sebanyak ${n} kali`, f => `kad bernombor genap tercabut sebanyak ${f} kali`, 'mencabut kad bernombor genap', N => `cabutan itu diulang ${N} kali`, 'berapa kalikah kad bernombor genap dijangka tercabut', [.3, .6]]
];
const PBNX = [20, 25, 40, 50, 80, 100, 125, 200, 250, 400, 500];
function pbKxData(r, k) {
  const X = k == null ? r.p(PBKX) : PBKX[k % PBKX.length];
  let n, f, tries = 0;
  do { n = r.p(PBNX); f = r.i(Math.max(1, Math.ceil(X[5][0] * n)), Math.min(n - 1, Math.floor(X[5][1] * n))); tries++; } while (tries < 30 && (pbGcd(f, n) === 1 && r.f() < .6));
  return { X, n, f, c: X[0](n), e: X[1](f), en: X[2] };
}
PB.kebExp = (r, k) => {
  const d = pbKxData(r, k), ans = pbFr(d.f, d.n);
  return GEN_LQ('kebExp', Object.assign(d, { ans, work: ['Kebarangkalian eksperimen = kekerapan peristiwa ÷ bilangan cubaan', `= ${d.f}/${d.n}`].concat(pbFr(d.f, d.n) === `${d.f}/${d.n}` ? [] : [`= ${ans}`]) }));
};
const PBJAD = [
  r => { const f = pbRange(1, 6).map(() => r.i(4, 18)), E = r.p([['mendapat nombor ' + r.i(1, 6), null], ['mendapat nombor genap', [2, 4, 6]], ['mendapat nombor lebih besar daripada 4', [5, 6]], ['mendapat nombor perdana', [2, 3, 5]]]);
    const sel = E[1] || [+E[0].slice(-1)];
    return { x: 'eksperimen melambung sebiji dadu', rows: [['Nombor', 1, 2, 3, 4, 5, 6], ['Kekerapan', ...f]], f, ev: E[0], idx: sel.map(v => v - 1), lab: sel.map(String) }; },
  r => { const L = ['Merah', 'Biru', 'Hijau', 'Kuning'], f = L.map(() => r.i(5, 25)), i = r.i(0, 3), neg = r.f() < .4;
    return { x: 'eksperimen memutar sebuah pemutar empat warna', rows: [['Warna', ...L], ['Kekerapan', ...f]], f, ev: neg ? `jarum tidak berhenti pada warna ${L[i].toLowerCase()}` : `jarum berhenti pada warna ${L[i].toLowerCase()}`, idx: neg ? [0, 1, 2, 3].filter(j => j !== i) : [i], lab: (neg ? L.filter((_, j) => j !== i) : [L[i]]) }; },
  r => { const L = ['Putih', 'Hitam', 'Merah', 'Kelabu'], f = L.map(() => r.i(6, 30)), i = r.i(0, 3);
    return { x: 'tinjauan warna kereta yang melalui sebuah simpang', rows: [['Warna kereta', ...L], ['Bilangan', ...f]], f, ev: `sebuah kereta yang melalui simpang itu berwarna ${L[i].toLowerCase()}`, idx: [i], lab: [L[i]] }; }
];
PB.jadual = (r, k) => {
  const J = (k == null ? r.p(PBJAD) : PBJAD[k % PBJAD.length])(r), n = pbSum(J.f), kk = pbSum(J.idx.map(i => J.f[i])), ans = pbFr(kk, n);
  const work = [`Jumlah cubaan = ${J.f.join(' + ')} = ${n}`, J.idx.length > 1 ? `Kekerapan (${J.lab.join(', ')}) = ${J.idx.map(i => J.f[i]).join(' + ')} = ${kk}` : `Kekerapan (${J.lab[0]}) = ${kk}`, `Kebarangkalian eksperimen = ${pbEq(kk, n)}`];
  return GEN_LQ('jadual', { x: J.x, ev: J.ev, n, ans, work }, { fig: pbTabFig(J.rows, 'Jadual kekerapan') });
};
PB.jangka = (r, k) => {
  const d = pbKxData(r, k), g = pbGcd(d.f, d.n), pn = d.f / g, pd = d.n / g;
  const m0 = Math.max(2, Math.ceil(30 / pd)), m = r.i(m0, m0 + 10);
  const N = pd * m, ans = pn * m, wrong = N - ans === ans ? ans * 2 : N - ans, p = pbFr(d.f, d.n);
  return GEN_LQ('jangka', Object.assign(d, { p, N, tr: d.X[3](N), ask: d.X[4], ans: String(ans), wrong, work: ['Kekerapan dijangka = kebarangkalian × bilangan cubaan', `= ${p} × ${N}`, `= ${ans}`] }));
};
PB.cubaan = r => {
  const [A, B] = r.p(PBNAMA2), coin = r.f() < .5;
  let n1, f1, n2, f2, th;
  if (coin) { th = '1/2'; n1 = r.p([10, 20]); f1 = n1 / 2 + r.p([-3, -2, 2, 3]) * n1 / 10; n2 = r.p([200, 400, 500, 1000]); f2 = n2 / 2 + r.p([-1, 1]) * r.i(1, n2 / 100); }
  else { th = '1/6'; n1 = r.p([12, 18, 30]); f1 = n1 / 6 + r.p([-1, 2, 3]); n2 = r.p([300, 600, 1200]); f2 = n2 / 6 + r.p([-1, 1]) * r.i(1, n2 / 150); }
  const x = coin ? 'melambung sekeping syiling' : 'melambung sebiji dadu', ev = coin ? 'mendapat gambar' : 'mendapat nombor 6', p1 = pbFr(f1, n1), p2 = pbFr(f2, n2);
  const t = coin ? .5 : 1 / 6, d1 = Math.abs(f1 / n1 - t), d2 = Math.abs(f2 / n2 - t);
  return GEN_LQ('cubaan', { A, B, n1, f1, n2, f2, x, ev, th, p1, p2, work: [`${A}: ${pbEq(f1, n1)} ≈ ${pbNum(f1 / n1)}`, `${B}: ${pbEq(f2, n2)} ≈ ${pbNum(f2 / n2)}`, `Kebarangkalian teori = ${th} ≈ ${pbNum(t)}. Beza: ${A} ≈ ${pbNum(d1)}, ${B} ≈ ${pbNum(d2)}.`, `${B} membuat lebih banyak cubaan, maka kebarangkalian eksperimennya lebih hampir kepada kebarangkalian teori.`] });
};
const PBBS1 = [
  ['Kesudahan ialah hasil yang mungkin bagi suatu eksperimen.', true, 'Contoh: kesudahan melambung dadu ialah 1, 2, 3, 4, 5 atau 6.'],
  ['Ruang sampel ialah set yang mengandungi semua kesudahan yang mungkin bagi suatu eksperimen.', true, 'Ruang sampel ditulis sebagai S dalam tatatanda set.'],
  ['Kebarangkalian eksperimen = bilangan cubaan ÷ kekerapan peristiwa berlaku.', false, 'Kebarangkalian eksperimen = kekerapan peristiwa berlaku ÷ bilangan cubaan.'],
  ['Semakin besar bilangan cubaan, semakin hampir kebarangkalian eksperimen kepada kebarangkalian teori.', true, 'Bilangan cubaan yang besar memberi anggaran yang lebih tepat.'],
  ['Ruang sampel bagi melambung sekeping syiling ialah {Gambar}.', false, 'S = {Gambar, Angka}, kerana terdapat dua kesudahan yang mungkin.'],
  ['Jika eksperimen yang sama diulang, kebarangkalian eksperimen yang diperoleh sentiasa sama.', false, 'Keputusan eksperimen berubah-ubah setiap kali diulang.'],
  ['Melambung sebiji dadu ialah satu contoh eksperimen.', true, 'Eksperimen ialah proses yang menghasilkan kesudahan, seperti melambung dadu.'],
  ['Kebarangkalian eksperimen boleh bernilai lebih daripada 1.', false, 'Kekerapan peristiwa tidak boleh melebihi bilangan cubaan, maka nilainya antara 0 dan 1.']
];
PB.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
PB.k131 = r => {
  const L = ['merah', 'biru', 'hijau', 'kuning'];
  // (1) pemutar
  let sp; do { const f = L.map(() => r.i(6, 30)), i = r.i(0, 3), n = pbSum(f), g = pbGcd(f[i], n), pd = n / g; sp = { f, c: L[i], k: f[i], n, p: pbFr(f[i], n), N: pd * r.i(1, 6), pn: f[i] / g, pd }; sp.E = sp.pn * sp.N / sp.pd; } while (sp.N < 20 || sp.N > 1000);
  const spRows = [['Warna', 'Merah', 'Biru', 'Hijau', 'Kuning'], ['Kekerapan', ...sp.f]];
  // (2) dadu
  const dn = r.p([30, 40, 50, 60]); let df; do { df = pbRange(1, 5).map(() => r.i(3, 13)); df.push(dn - pbSum(df)); } while (df[5] < 3 || df[5] > 18);
  const dd = { A: vnama(), n: dn, f: df, k: df[1] + df[2] + df[4] }; dd.p = pbFr(dd.k, dn);
  // (3) mentol
  const s = r.p([100, 200, 250, 400, 500]), dfec = r.i(2, Math.max(3, s / 25)), mB = r.p([2000, 5000, 10000, 20000]);
  const mt = { s, d: dfec, p: pbFr(dfec, s), B: mB, bad: dfec * mB / s }; mt.ok = mB - mt.bad;
  // (4) memanah
  const pt = r.i(5, 9), N = 10 * r.i(3, 15);
  const ar = { A: vnama(), pd: pbH(pt * 10), N, hit: pt * N / 10, miss: N - pt * N / 10 };
  const v = vq('k131', { sp, dd, mt, ar });
  const fig = v.q.includes('empat warna') ? pbTabFig(spRows) : v.q.includes('sebiji dadu') ? pbTabFig([['Nombor', 1, 2, 3, 4, 5, 6], ['Kekerapan', ...dd.f]]) : '';
  return pbOne({ q: v.q, ans: v.ans, work: v.work }, fig);
};

/* ---------- 13.2 ---------- */
function pbRangeData(r, lo, hi, minA = 2, gap = 2) {
  const a = r.p([1, 1, 1, 2, 3, 5, 10, 11]), L = r.i(lo, hi), b = a + L - 1, e = pbEvent(r, a, b, minA, gap);
  return Object.assign(e, { a, b, L, Ss: pbSet(e.S), As: pbSet(e.A), Cs: pbSet(e.C) });
}
PB.setA = r => {
  const e = pbRangeData(r, 8, 14);
  let wrong, why;
  if (e.A.length >= 3) { const x = e.A[r.i(0, e.A.length - 1)]; wrong = pbSet(e.A.filter(y => y !== x)); why = `${x} juga ${e.nm}, maka ${x} mesti dimasukkan dalam A.`; }
  else { const x = r.p(e.C); wrong = pbSet(e.A.concat([x]).sort((p, q) => p - q)); why = `${x} bukan ${e.nm}, maka ${x} bukan unsur A.`; }
  return GEN_LQ('setA', { Ss: e.Ss, a: e.a, b: e.b, ev: e.nm, As: e.As, wrong, why, ans: `A = ${e.As}, n(A) = ${e.A.length}`, work: [`Pilih unsur S yang merupakan ${e.nm}.`, `A = ${e.As}`, `n(A) = ${e.A.length}`] });
};
function pbDiceEvent(r, single) {
  if (single) { const v = r.i(1, 6); return { nm: `nombor ${v}`, A: [v], C: pbRange(1, 6).filter(x => x !== v), cn: `nombor yang bukan ${v}`, S: pbRange(1, 6) }; }
  return pbEvent(r, 1, 6, 1, 1);
}
PB.pDadu = (r, k) => {
  const e = pbDiceEvent(r, k == null ? r.f() < .2 : k % 4 === 0), nA = e.A.length, ans = pbFr(nA, 6);
  return GEN_LQ('pDadu', { ev: e.nm, nA, ans, work: ['S = {1, 2, 3, 4, 5, 6}, n(S) = 6', `A = ${pbSet(e.A)}, n(A) = ${nA}`, `P(A) = ${pbEq(nA, 6)}`] }, { fig: pbDiceFig([1, 2, 3, 4, 5, 6], 'Enam permukaan dadu') });
};
PB.pKad = r => {
  const e = pbRangeData(r, 8, 16), nA = e.A.length, ans = pbFr(nA, e.L);
  return GEN_LQ('pKad', { L: e.L, a: e.a, b: e.b, Ss: e.Ss, ev: e.nm, ans, work: [`S = ${e.Ss}, n(S) = ${e.L}`, `A = ${e.As}, n(A) = ${nA}`, `P(A) = ${pbEq(nA, e.L)}`] }, e.L <= 12 ? { fig: pbCardsFig(e.S, 'Kad nombor') } : {});
};
PB.pHuruf = (r, k) => {
  const w = r.p(PBWRD), L = w.split(''), n = L.length, cnt = {}; L.forEach(c => { cnt[c] = (cnt[c] || 0) + 1; });
  const reps = Object.keys(cnt).filter(c => cnt[c] > 1), kind = k == null ? r.p(['h', 'h', 'v', 'k']) : ['h', 'v', 'h', 'k'][k % 4];
  let ev, nA, dist;
  const U = Object.keys(cnt);
  if (kind === 'h') { const c = r.p(reps); ev = `huruf ${c}`; nA = cnt[c]; dist = 1; }
  else if (kind === 'v') { ev = 'huruf vokal'; nA = L.filter(c => PBVOK.includes(c)).length; dist = U.filter(c => PBVOK.includes(c)).length; }
  else { ev = 'huruf konsonan'; nA = L.filter(c => !PBVOK.includes(c)).length; dist = U.filter(c => !PBVOK.includes(c)).length; }
  const ans = pbFr(nA, n); let claim = pbFr(dist, U.length); if (claim === ans) claim = pbFr(nA, U.length);
  const which = kind === 'h' ? ev : kind === 'v' ? 'huruf vokal (A, E, I, O, U)' : 'huruf konsonan';
  return GEN_LQ('pHuruf', { w, n, ev, claim, ans, work: [`n(S) = ${n} keping kad`, `Bilangan kad ${which} = ${nA}`, `P = ${pbEq(nA, n)}`] }, { fig: pbCardsFig(L, `Kad huruf ${w}`) });
};
const PBJUL = [
  ['Sebiji dadu dilambung.', 'mendapat nombor 7', 0, 0, 6],
  ['Sebiji dadu dilambung.', 'mendapat nombor kurang daripada 7', 1, 6, 6],
  ['Sebiji dadu dilambung.', 'mendapat nombor 0', 0, 0, 6],
  ['Sebiji dadu dilambung.', 'mendapat nombor genap', 2, 3, 6],
  ['Sebuah beg mengandungi 6 biji guli merah sahaja. Sebiji guli diambil secara rawak.', 'mendapat guli merah', 1, 6, 6],
  ['Sebuah beg mengandungi 6 biji guli merah sahaja. Sebiji guli diambil secara rawak.', 'mendapat guli biru', 0, 0, 6],
  ['Satu nombor dipilih secara rawak daripada S = {2, 4, 6, 8, 10}.', 'mendapat nombor genap', 1, 5, 5],
  ['Satu nombor dipilih secara rawak daripada S = {2, 4, 6, 8, 10}.', 'mendapat nombor ganjil', 0, 0, 5],
  ['Sekeping syiling dilambung.', 'mendapat gambar', 2, 1, 2],
  ['Sekeping kad dipilih secara rawak daripada kad huruf yang membentuk perkataan "BOLA".', 'mendapat huruf Z', 0, 0, 4],
  ['Sekeping kad dipilih secara rawak daripada kad huruf yang membentuk perkataan "BOLA".', 'mendapat huruf B', 2, 1, 4],
  ['Satu bulan dipilih secara rawak daripada 12 bulan dalam setahun.', 'mendapat bulan yang mempunyai 32 hari', 0, 0, 12],
  ['Satu bulan dipilih secara rawak daripada 12 bulan dalam setahun.', 'mendapat bulan yang mempunyai sekurang-kurangnya 28 hari', 1, 12, 12],
  ['Satu nombor dipilih secara rawak daripada S = {3, 6, 9, 12}.', 'mendapat nombor gandaan 3', 1, 4, 4],
  ['Satu nombor dipilih secara rawak daripada S = {1, 3, 5, 7, 9}.', 'mendapat nombor perdana', 2, 3, 5],
  ['Sebiji dadu dilambung.', 'mendapat nombor bulat', 1, 6, 6]
];
PB.julat = (r, k) => {
  const [x, ev, t, a, b] = k == null ? r.p(PBJUL) : PBJUL[k % PBJUL.length], P = pbFr(a, b);
  const ans = t === 0 ? 'P = 0; peristiwa mustahil berlaku' : t === 1 ? 'P = 1; peristiwa pasti berlaku' : `P = ${P}; peristiwa mungkin berlaku`;
  const claim = t === 0 ? '1' : t === 1 ? '0' : '1';
  const work = t === 0 ? ['Tiada kesudahan yang memenuhi peristiwa ini, n(A) = 0.', `P = 0 ÷ ${b} = 0, maka peristiwa itu mustahil berlaku.`] : t === 1 ? ['Semua kesudahan memenuhi peristiwa ini, n(A) = n(S).', `P = ${b} ÷ ${b} = 1, maka peristiwa itu pasti berlaku.`] : [`n(A) = ${a}, n(S) = ${b}`, `P = ${pbEq(a, b)}, iaitu antara 0 dan 1, maka peristiwa itu mungkin berlaku.`];
  return GEN_LQ('julat', { x, ev, claim, ans, work });
};
const PBBS2 = [
  ['Nilai kebarangkalian sesuatu peristiwa ialah dari 0 hingga 1, termasuk 0 dan 1.', true, '0 ≤ P(A) ≤ 1.'],
  ['P(A) = 5/4 adalah mungkin bagi suatu peristiwa A.', false, '5/4 > 1, sedangkan 0 ≤ P(A) ≤ 1.'],
  ['Kebarangkalian suatu peristiwa yang pasti berlaku ialah 1.', true, 'n(A) = n(S), maka P(A) = 1.'],
  ['Kebarangkalian suatu peristiwa yang mustahil berlaku ialah 1.', false, 'Peristiwa yang mustahil berlaku mempunyai kebarangkalian 0.'],
  ['P(A) = n(A) ÷ n(S), dengan syarat semua kesudahan sama boleh jadi.', true, 'Ini ialah rumus kebarangkalian teori.'],
  ['Kebarangkalian mendapat gambar apabila sekeping syiling adil dilambung ialah 1/2.', true, 'S = {Gambar, Angka}, maka P(gambar) = 1/2.'],
  ['Kebarangkalian mendapat nombor 3 apabila sebiji dadu adil dilambung ialah 1/3.', false, 'Hanya satu daripada enam kesudahan, maka P = 1/6.'],
  ['Kebarangkalian sesuatu peristiwa boleh bernilai negatif jika peristiwa itu jarang berlaku.', false, 'Kebarangkalian tidak pernah negatif; nilainya antara 0 dan 1.']
];
PB.pPutar = (r, k) => {
  const num = k == null ? r.f() < .5 : k % 2 === 0;
  if (num) {
    const n = r.p([5, 6, 8, 10]), e = pbEvent(r, 1, n, 1, 1), cs = ['tr', 'pk', 'am', 'gr', 'pu', 'pa'];
    return GEN_LQ('pPutar', { n, ev: e.nm, ans: pbFr(e.A.length, n), work: [`S = ${pbSet(e.S)}, n(S) = ${n}`, `A = ${pbSet(e.A)}, n(A) = ${e.A.length}`, `P(A) = ${pbEq(e.A.length, n)}`] }, { fig: pbSpinFig(pbRange(1, n).map((t, i) => ({ t, c: cs[i % (n % 6 === 1 ? 5 : 6)] })), `Pemutar ${n} sektor bernombor`) });
  }
  const n = r.p([6, 8, 10]), sp = pbColSpin(r, n), cs = sp.cs, cnt = sp.cnt;
  const i = r.i(0, 2), two = r.f() < .3, j = (i + 1) % 3;
  const ev = two ? `sektor ${cs[i]} atau ${cs[j]}` : `sektor ${cs[i]}`, kk = two ? cnt[i] + cnt[j] : cnt[i];
  return GEN_LQ('pPutar', { n, ev, ans: pbFr(kk, n), work: [`n(S) = ${n} sektor`, `Bilangan ${ev} = ${two ? `${cnt[i]} + ${cnt[j]} = ` : ''}${kk}`, `P = ${pbEq(kk, n)}`] }, { fig: sp.fig });
};
// pemutar berwarna dengan petunjuk (untuk ramal / games)
function pbColSpin(r, n) {
  const cs = pbShuf(r, ['merah', 'biru', 'hijau', 'kuning']).slice(0, 3);
  let cnt; do { const a = r.i(1, n - 2), b = r.i(1, n - a - 1); cnt = [a, b, n - a - b]; } while (cnt[2] < 1);
  const secs = []; cs.forEach((c, m) => { for (let t = 0; t < cnt[m]; t++) secs.push({ t: n <= 8 ? c : c[0].toUpperCase(), c: PBCOL[c] }); });
  return { cs, cnt, fig: pbSpinFig(pbShuf(r, secs), `Pemutar ${n} sektor: ${cs.map((c, m) => `${cnt[m]} ${c}`).join(', ')}`, n <= 8 ? '' : cs.map(c => `${c[0].toUpperCase()} = ${c}`).join(', ')) };
}
PB.ramal = (r, k) => {
  const kind = k == null ? r.i(0, 3) : k % 4;
  let x, ask, evd, kk, den, fig = '';
  if (kind === 0) { const n = r.p([4, 5, 6, 8]), sp = pbColSpin(r, n), i = r.i(0, 2), g = pbGcd(sp.cnt[i], n); kk = sp.cnt[i]; den = n; const N = n / g * r.i(3, 20); x = `Sebuah pemutar dengan ${n} sektor sama besar ditunjukkan dalam rajah di bawah. Pemutar itu diputar ${N} kali.`; ask = `bilangan kali jarum berhenti pada sektor ${sp.cs[i]}`; evd = `jarum berhenti pada sektor ${sp.cs[i]}`; fig = sp.fig; return pbRamalOut(x, ask, evd, kk, den, N, fig); }
  if (kind === 1) { const e = pbDiceEvent(r, false), g = pbGcd(e.A.length, 6), N = 6 / g * r.i(5, 40); return pbRamalOut(`Sebiji dadu adil dilambung ${N} kali.`, `bilangan kali mendapat ${e.nm}`, `mendapat ${e.nm}`, e.A.length, 6, N, ''); }
  if (kind === 2) { const cs = pbShuf(r, PBCN).slice(0, 3), parts = cs.map(c => [c, r.i(1, 6)]), t = pbSum(parts.map(p => p[1])), i = r.i(0, 2), g = pbGcd(parts[i][1], t), N = t / g * r.i(5, 20); return pbRamalOut(`Sebuah beg mengandungi ${pbDan(parts.map(([c, m]) => `${m} biji guli ${c}`))}. Sebiji guli diambil secara rawak, warnanya dicatat dan guli itu dimasukkan semula. Proses ini diulang ${N} kali.`, `bilangan kali guli ${cs[i]} diambil`, `mengambil guli ${cs[i]}`, parts[i][1], t, N, pbBagFig(parts)); }
  const N = 2 * r.i(15, 300), side = r.p(['gambar', 'angka']);
  return pbRamalOut(`Sekeping syiling adil dilambung ${N} kali.`, `bilangan kali mendapat ${side}`, `mendapat ${side}`, 1, 2, N, pbCoinFig());
};
function pbRamalOut(x, ask, evd, kk, den, N, fig) {
  const p = pbFr(kk, den), ans = kk * N / den, wrong = N - ans === ans ? 2 * ans : N - ans;
  return GEN_LQ('ramal', { x, ask, evd, p, N, ans: `${ans} kali`, wrong, work: [`P(A) = ${pbEq(kk, den)}`, 'Kekerapan dijangka = P(A) × bilangan cubaan', `= ${p} × ${N} = ${ans}`] }, fig ? { fig } : {});
}
PB.k132 = r => {
  const C2 = r.p([['sekurang-kurangnya satu gambar', ['(G, G)', '(G, A)', '(A, G)']], ['dua angka', ['(A, A)']], ['satu gambar dan satu angka', ['(G, A)', '(A, G)']], ['dua permukaan yang sama', ['(G, G)', '(A, A)']]]);
  const c2 = { ev: C2[0], L: C2[1].join(', '), k: C2[1].length, p: pbFr(C2[1].length, 4) };
  const CD = r.p([['gambar dan nombor genap', 'G', [2, 4, 6]], ['angka dan nombor perdana', 'A', [2, 3, 5]], ['gambar dan nombor lebih besar daripada 4', 'G', [5, 6]], ['angka dan nombor 6', 'A', [6]], ['gambar dan nombor gandaan 3', 'G', [3, 6]], ['angka dan nombor ganjil', 'A', [1, 3, 5]]]);
  const cd = { ev: CD[0], L: CD[2].map(v => `(${CD[1]}, ${v})`).join(', '), k: CD[2].length, p: pbFr(CD[2].length, 12) };
  const e = pbRangeData(r, 8, 12), g = pbGcd(e.A.length, e.L);
  const kd = { L: e.L, a: e.a, b: e.b, ev: e.nm, As: e.As, k: e.A.length, p: pbFr(e.A.length, e.L), N: e.L / g * r.i(3, 12) }; kd.E = kd.k * kd.N / e.L;
  let d1, d2; do { d1 = pbEvent(r, 1, 6, 1, 1); d2 = pbEvent(r, 1, 6, 1, 1); } while (d1.A.length === d2.A.length || d1.nm === d2.nm);
  const dd = { e1: d1.nm, e2: d2.nm, As: pbSet(d1.A), Bs: pbSet(d2.A), k1: d1.A.length, k2: d2.A.length, p1: pbFr(d1.A.length, 6), p2: pbFr(d2.A.length, 6), W: d1.A.length > d2.A.length ? 'A' : 'B' };
  const v = vq('k132', { c2, cd, kd, dd });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* ---------- 13.3 ---------- */
const PBCTX = [
  ['hujan turun esok', 'hujan tidak turun esok'],
  ['Amir lulus ujian memandu', 'Amir tidak lulus ujian memandu'],
  ['pasukan bola jaring sekolah memenangi perlawanan akhir', 'pasukan itu tidak memenangi perlawanan akhir'],
  ['bas sekolah tiba lewat pada suatu hari', 'bas sekolah tidak tiba lewat pada hari itu'],
  ['seorang murid yang dipilih secara rawak memakai cermin mata', 'murid itu tidak memakai cermin mata'],
  ['sebiji telur yang dipilih secara rawak retak', 'telur itu tidak retak'],
  ['lampu isyarat berwarna merah apabila sebuah kereta tiba di simpang', 'lampu isyarat tidak berwarna merah apabila kereta itu tiba'],
  ['Siti menjawab soalan kuiz dengan betul', 'Siti tidak menjawab soalan kuiz itu dengan betul']
];
PB.comp = (r, kind) => {
  kind = kind || r.p(['fr', 'fr', 'dec', 'pct']);
  const [ev, evc] = r.p(PBCTX);
  let pa, ans, work;
  if (kind === 'fr') { let p, q; do { q = r.p([3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20]); p = r.i(1, q - 1); } while (pbGcd(p, q) !== 1); pa = `${p}/${q}`; ans = `${q - p}/${q}`; work = ['P(A′) = 1 − P(A)', `= 1 − ${pa}`, `= ${q}/${q} − ${p}/${q}`, `= ${ans}`]; }
  else { let h; do h = r.i(5, 95); while (h % 10 === 0 && r.f() < .7); pa = kind === 'dec' ? pbH(h) : `${h}%`; ans = kind === 'dec' ? pbH(100 - h) : `${100 - h}%`; work = ['P(A′) = 1 − P(A)', kind === 'dec' ? `= 1 − ${pa}` : `= 100% − ${pa}`, `= ${ans}`]; }
  return GEN_LQ('comp', { pa, ans, ev, evc, work });
};
function pbVData(r, lo, hi) {
  if (r.f() < .3) { const w = r.p(PBWDU), S = w.split(''), A = S.filter(c => PBVOK.includes(c)), C = S.filter(c => !PBVOK.includes(c)); if (A.length >= 1 && C.length >= 2) return { S, A, C, Ss: pbSet(S), As: pbSet(A), Cs: pbSet(C), L: S.length, nm: 'huruf vokal', cn: 'huruf konsonan', desc: `huruf daripada perkataan "${w}"` }; }
  return pbRangeData(r, lo, hi);
}
PB.vennA = r => {
  const e = pbVData(r, 7, 12), mi = r.i(0, e.C.length - 1), miss = e.C[mi], wrong = pbSet(e.C.filter((_, i) => i !== mi));
  return GEN_LQ('vennA', { Ss: e.Ss, As: e.As, Cs: e.Cs, nc: e.C.length, wrong, miss, ans: `A′ = ${e.Cs}`, work: ['A′ ialah set semua unsur S yang bukan unsur A.', `A′ = ${e.Cs}`] }, { fig: pbVennFig(e.S, e.A) });
};
PB.descComp = (r, k) => {
  const dice = k == null ? r.f() < .5 : k % 2 === 0, e = dice ? pbDiceEvent(r, false) : pbRangeData(r, 8, 12);
  const Cs = pbSet(e.C), ans = `A′ ialah peristiwa mendapat ${e.cn}; A′ = ${Cs}`;
  const Ss = pbSet(e.S);
  const x = dice ? 'Sebiji dadu dilambung.' : `Satu nombor dipilih secara rawak daripada S = ${Ss}.`;
  return GEN_LQ('descComp', { x, ev: e.nm, ans, work: [`A = ${pbSet(e.A)}`, `A′ = unsur S yang bukan unsur A = ${Cs}`, `Dalam perkataan: A′ ialah peristiwa mendapat ${e.cn}.`] }, dice ? { fig: pbDiceFig([1, 2, 3, 4, 5, 6], 'Enam permukaan dadu') } : {});
};
const PBBS3 = [
  ['P(A) + P(A′) = 1', true, 'A dan A′ bersama-sama merangkumi semua kesudahan dalam S.'],
  ['Jika P(A) = 0.3, maka P(A′) = 0.3.', false, 'P(A′) = 1 − 0.3 = 0.7.'],
  ['A′ mengandungi semua unsur dalam S yang bukan unsur A.', true, 'Itulah takrif peristiwa pelengkap.'],
  ['Jika A ialah peristiwa mendapat nombor genap apabila sebiji dadu dilambung, maka A′ ialah peristiwa mendapat nombor ganjil.', true, 'A = {2, 4, 6}, maka A′ = {1, 3, 5}, iaitu nombor ganjil.'],
  ['n(A) + n(A′) = n(S)', true, 'Setiap unsur S berada sama ada dalam A atau dalam A′.'],
  ['Peristiwa pelengkap bagi ‘hujan turun’ ialah ‘cuaca panas’.', false, 'Pelengkap bagi ‘hujan turun’ ialah ‘hujan tidak turun’.'],
  ['P(A′) boleh bernilai lebih daripada 1.', false, 'P(A′) = 1 − P(A) dan 0 ≤ P(A) ≤ 1, maka 0 ≤ P(A′) ≤ 1.'],
  ['Jika P(A) = 1, maka P(A′) = 0.', true, 'P(A′) = 1 − 1 = 0.']
];
const PBCC1 = [
  r => { const cs = pbShuf(r, PBCN).slice(0, r.i(2, 4)), parts = cs.map(c => [c, r.i(2, 7)]), i = r.i(0, cs.length - 1); return { x: `Sebuah beg mengandungi ${pbDan(parts.map(([c, m]) => `${m} biji guli ${c}`))}.`, pk: 'Sebiji guli dipilih secara rawak.', ev: `guli yang dipilih berwarna ${cs[i]}`, en: `guli yang dipilih bukan berwarna ${cs[i]}`, nA: parts[i][1], t: pbSum(parts.map(p => p[1])), fig: pbBagFig(parts) }; },
  r => { const t = r.i(28, 42), b = r.i(5, 16); return { x: `Sebuah kelas mempunyai ${t} orang murid. ${b} orang daripadanya memakai cermin mata.`, pk: 'Seorang murid dipilih secara rawak.', ev: 'murid itu memakai cermin mata', en: 'murid itu tidak memakai cermin mata', nA: b, t }; },
  r => { const a = r.i(3, 12), b = r.i(3, 12), c = r.i(2, 9); return { x: `Sebuah kotak pensel mengandungi ${a} batang pen biru, ${b} batang pen hitam dan ${c} batang pen merah.`, pk: 'Sebatang pen diambil secara rawak.', ev: 'pen itu berwarna hitam', en: 'pen itu bukan berwarna hitam', nA: b, t: a + b + c }; },
  r => { const a = r.i(4, 15), b = r.i(4, 15), c = r.i(3, 10); return { x: `Sebuah bakul mengandungi ${a} biji epal, ${b} biji oren dan ${c} biji pear.`, pk: 'Sebiji buah diambil secara rawak.', ev: 'buah itu ialah oren', en: 'buah itu bukan oren', nA: b, t: a + b + c }; },
  r => { const t = r.p([24, 30, 36, 48, 60]), k = r.i(2, 9); return { x: `Sebuah dulang mengandungi ${t} biji telur. ${k} biji daripadanya retak.`, pk: 'Sebiji telur dipilih secara rawak.', ev: 'telur itu retak', en: 'telur itu tidak retak', nA: k, t }; }
];
PB.compCount = (r, k) => {
  let c; do c = (k == null ? r.p(PBCC1) : PBCC1[k % PBCC1.length])(r); while (2 * c.nA === c.t);
  const pA = pbFr(c.nA, c.t), ans = pbFr(c.t - c.nA, c.t);
  return GEN_LQ('compCount', Object.assign(c, { pA, ans, work: [`A ialah peristiwa ${c.ev}.`, `P(A) = ${pbEq(c.nA, c.t)}`, `P(A′) = 1 − P(A) = 1 − ${pA} = ${ans}`] }), c.fig ? { fig: c.fig } : {});
};
PB.vennP = r => {
  const e = pbVData(r, 8, 15), nc = e.C.length, ans = pbFr(nc, e.L), pA = pbFr(e.A.length, e.L);
  const o = GEN_LQ('vennP', { pA, ans, work: [`n(S) = ${e.L}, n(A) = ${e.A.length}, n(A′) = ${nc}`, `P(A′) = ${pbEq(nc, e.L)}`] });
  o.fig = pbVennFig(e.S, e.A, o.q.includes('berlorek') ? 'comp' : '');
  if (o.q.includes('tunjukkan')) o.work = [`n(S) = ${e.L}, n(A) = ${e.A.length}, n(A′) = ${nc}`, `P(A) = ${pbEq(e.A.length, e.L)}`, `P(A′) = ${pbEq(nc, e.L)}`, `P(A) + P(A′) = ${e.A.length}/${e.L} + ${nc}/${e.L} = ${e.L}/${e.L} = 1`];
  return o;
};
const PBCC = [
  { S: t => `sebuah kelas yang mempunyai ${t} orang murid`, not: 'seorang murid yang dipilih secara rawak bukan ahli Kelab Pengakap', ask: 'bilangan ahli Kelab Pengakap dalam kelas itu', noun: 'orang murid', yes: 'ahli Kelab Pengakap', u: 'orang' },
  { S: t => `sebuah dulang yang mengandungi ${t} biji telur`, not: 'sebiji telur yang dipilih secara rawak tidak retak', ask: 'bilangan telur yang retak', noun: 'biji telur', yes: 'telur yang retak', u: 'biji' },
  { S: t => `sebuah tin yang mengandungi ${t} keping biskut`, not: 'sekeping biskut yang dipilih secara rawak bukan berperisa coklat', ask: 'bilangan biskut berperisa coklat', noun: 'keping biskut', yes: 'biskut berperisa coklat', u: 'keping' },
  { S: t => `sebuah sudut bacaan yang mempunyai ${t} buah buku`, not: 'sebuah buku yang dipilih secara rawak bukan buku cerita', ask: 'bilangan buku cerita', noun: 'buah buku', yes: 'buku cerita', u: 'buah' }
];
PB.cariComp = (r, k) => {
  const c = k == null ? r.p(PBCC) : PBCC[k % PBCC.length];
  let q, p, m; do { q = r.p([3, 4, 5, 6, 8, 10]); p = r.i(1, q - 1); m = r.i(3, 10); } while (pbGcd(p, q) !== 1 || q * m > 60 || 2 * p >= q);
  const t = q * m, nA = p * m, pc = `${q - p}/${q}`, pa = `${p}/${q}`, wrong = t - nA;
  return GEN_LQ('cariComp', { c, t, pc, nA, wrong, ans: `${nA} ${c.u}`, work: [`P(A) = 1 − P(A′) = 1 − ${pc} = ${pa}`, `n(A) = P(A) × n(S) = ${pa} × ${t} = ${nA}`] });
};
PB.k133 = r => {
  const v = pbRangeData(r, 10, 15); v.ev = v.nm; v.nc = v.C.length; v.p = pbFr(v.nc, v.L);
  let pw; do { const q = r.p([5, 6, 8, 9, 10, 12]), p = r.i(1, Math.min(3, q - 1)), m = r.i(4, 15); pw = { q, p, m, pc: `${q - p}/${q}`, pa: `${p}/${q}`, k: p * m, t: q * m, ok: pbGcd(p, q) === 1 }; } while (!pw.ok);
  let bg; do { const q = r.p([5, 7, 8, 9, 11, 12]), p = r.i(1, q - 1), m = r.i(2, 6); bg = { pc: `${q - p}/${q}`, pa: `${p}/${q}`, r: p * m, t: q * m, b: (q - p) * m, ok: pbGcd(p, q) === 1 }; } while (!bg.ok);
  let tj; do { const t = r.p([100, 120, 150, 200, 240, 300]), h = r.p([15, 20, 25, 30, 35, 40, 45]), no = t * h / 100, add = r.p([10, 20, 25, 30, 40, 50]); tj = { t, pd: pbH(h), no, yes: t - no, add, pn: pbFr(no, t + add), ok: Number.isInteger(no) }; } while (!tj.ok);
  const o = vq('k133', { v, pw, bg, tj });
  return { q: o.q, ans: o.ans, work: o.work };
};

/* ---------- 13.4 ---------- */
function pbBag(r, maxT = 24) {
  let parts, t; do { const cs = pbShuf(r, PBCN).slice(0, r.i(2, 4)); parts = cs.map(c => [c, r.i(1, 9)]); t = pbSum(parts.map(p => p[1])); } while (t > maxT || t < 6);
  return { parts, t, desc: pbDan(parts.map(([c, m]) => `${m} biji guli ${c}`)) };
}
PB.guli = r => {
  const B = pbBag(r), two = B.parts.length >= 3 && r.f() < .3, i = r.i(0, B.parts.length - 1), j = (i + 1) % B.parts.length;
  const c = two ? `${B.parts[i][0]} atau ${B.parts[j][0]}` : B.parts[i][0], nc = two ? B.parts[i][1] + B.parts[j][1] : B.parts[i][1], ans = pbFr(nc, B.t);
  return GEN_LQ('guli', { desc: B.desc, c, nc, t: B.t, ans, work: [`Jumlah guli, n(S) = ${B.parts.map(p => p[1]).join(' + ')} = ${B.t}`, `Bilangan guli ${c} = ${two ? `${B.parts[i][1]} + ${B.parts[j][1]} = ` : ''}${nc}`, `P = ${pbEq(nc, B.t)}`] }, { fig: pbBagFig(B.parts) });
};
PB.cabutan = r => {
  let T, k; do { T = r.p([40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500]); k = r.i(1, 12); } while (k >= T / 4 || (pbGcd(k, T) === 1 && r.f() < .5));
  return GEN_LQ('cabutan', { T, k, ans: pbFr(k, T), work: [`n(S) = ${T}, n(A) = ${k}`, `P(A) = ${pbEq(k, T)}`] });
};
const PBHAR = [
  r => { const t = r.i(28, 40), b = r.i(10, t - 10); return { x: `Sebuah kelas mempunyai ${t} orang murid. ${b} orang daripadanya ialah murid lelaki.`, pk: 'Seorang murid dipilih secara rawak untuk menjadi ketua kelas.', ev: 'murid perempuan dipilih', nA: t - b, t, w0: `Murid perempuan = ${t} − ${b} = ${t - b}` }; },
  r => { const E = r.p([['mendapat bulan yang mempunyai 31 hari', ['Januari', 'Mac', 'Mei', 'Julai', 'Ogos', 'Oktober', 'Disember']], ['mendapat bulan yang bermula dengan huruf J', ['Januari', 'Jun', 'Julai']], ['mendapat bulan yang bermula dengan huruf M', ['Mac', 'Mei']], ['mendapat bulan yang namanya berakhir dengan huruf "i"', ['Januari', 'Februari', 'Mei', 'Julai']], ['mendapat bulan yang bermula dengan huruf O', ['Ogos', 'Oktober']]]); return { x: 'Satu bulan dipilih secara rawak daripada 12 bulan dalam setahun.', pk: '', ev: E[0], nA: E[1].length, t: 12, w0: `A = ${pbSet(E[1])}` }; },
  r => { const E = r.p([['mendapat hari yang bermula dengan huruf S', ['Selasa', 'Sabtu']], ['mendapat hari yang namanya mempunyai empat huruf', ['Rabu', 'Ahad']], ['mendapat hari yang namanya mempunyai enam huruf', ['Selasa', 'Khamis', 'Jumaat']], ['mendapat hari yang bermula dengan huruf J', ['Jumaat']]]); return { x: 'Satu hari dalam seminggu dipilih secara rawak.', pk: '', ev: E[0], nA: E[1].length, t: 7, w0: `A = ${pbSet(E[1])}` }; },
  r => { const a = r.i(2, 9), b = r.i(2, 9), c = r.i(2, 9), big = r.f() < .4; return { x: `Sebuah dompet mengandungi ${a} keping syiling 10 sen, ${b} keping syiling 20 sen dan ${c} keping syiling 50 sen.`, pk: 'Sekeping syiling dikeluarkan secara rawak.', ev: big ? 'mendapat syiling yang bernilai lebih daripada 10 sen' : 'mendapat syiling 20 sen', nA: big ? b + c : b, t: a + b + c, w0: big ? `Syiling 20 sen dan 50 sen = ${b} + ${c} = ${b + c}` : `Syiling 20 sen = ${b}` }; },
  r => { const a = r.i(3, 12), b = r.i(3, 12), c = r.i(3, 12); return { x: `Dalam sebuah peti sejuk terdapat ${a} tin minuman oren, ${b} tin minuman soda dan ${c} kotak susu.`, pk: 'Satu bekas minuman diambil secara rawak.', ev: 'mendapat minuman dalam tin', nA: a + b, t: a + b + c, w0: `Minuman dalam tin = ${a} + ${b} = ${a + b}` }; },
  r => { const t = r.p([30, 32, 35, 36, 40]), k = r.i(8, 20); return { x: `Dalam sebuah bas sekolah terdapat ${t} orang murid. ${k} orang daripadanya ialah murid Tingkatan 2.`, pk: 'Seorang murid dipilih secara rawak.', ev: 'murid yang dipilih bukan murid Tingkatan 2', nA: t - k, t, w0: `Bukan murid Tingkatan 2 = ${t} − ${k} = ${t - k}` }; }
];
PB.harian = (r, k) => {
  const c = (k == null ? r.p(PBHAR) : PBHAR[k % PBHAR.length])(r), ans = pbFr(c.nA, c.t);
  return GEN_LQ('harian', { x: c.x, pk: c.pk, ev: c.ev, ans, work: [`n(S) = ${c.t}`, c.w0, `P(A) = ${pbEq(c.nA, c.t)}`] });
};
PB.cariBil = r => {
  let p, q, m; do { q = r.i(3, 10); p = r.i(1, q - 1); m = r.i(2, 6); } while (pbGcd(p, q) !== 1);
  const rr = p * m, t = q * m, b = t - rr, pf = `${p}/${q}`;
  return GEN_LQ('cariBil', { r: rr, p: pf, b, t });
};
PB.tambah = r => {
  let rr, b, a, k, k2; do { rr = r.i(2, 9); b = r.i(3, 10); k = r.i(1, 6); k2 = r.i(1, b - 1); a = r.i(1, 12); } while (pbFr(rr, rr + b + a) === `${rr}/${rr + b + a}` && r.f() < .8);
  return GEN_LQ('tambah', { r: rr, b, k, k2, a, pt: pbFr(rr, rr + b + a) });
};
PB.jadual2 = r => {
  const [K1, K2] = r.p([['Kelab Sains', 'Kelab Matematik'], ['Kelab Catur', 'Kelab Robotik'], ['Kelab Seni', 'Kelab Muzik'], ['Kelab Bahasa', 'Kelab Komputer']]);
  const v = [[r.i(5, 20), r.i(5, 20)], [r.i(5, 20), r.i(5, 20)]], gi = r.i(0, 1), g = ['lelaki', 'perempuan'][gi];
  const row1 = v[0][0] + v[0][1], row2 = v[1][0] + v[1][1], tot = row1 + row2, col = v[0][gi] + v[1][gi];
  const o = GEN_LQ('jadual2', { K1, K2, g, a1: v[0][gi], row1, row2, tot, col, colW: `${v[0][gi]} + ${v[1][gi]}` });
  o.fig = pbTabFig([['', 'Lelaki', 'Perempuan'], [K1, v[0][0], v[0][1]], [K2, v[1][0], v[1][1]]], 'Jadual bilangan ahli kelab');
  return o;
};
PB.k134 = r => {
  let kk; do { const q = r.p([3, 4, 5, 6, 8]), p = r.i(1, q - 1), m = r.i(3, 8); kk = { t: q * m, p: `${p}/${q}`, m: p * m, y: (q - p) * m, x: r.i(1, p * m - 1), ok: pbGcd(p, q) === 1 && p * m >= 2 }; } while (!kk.ok);
  let t3; do { const D = r.p([12, 20, 24, 30, 15]), dv = pbRange(2, D - 1).filter(d => D % d === 0), d1 = r.p(dv), d2 = r.p(dv); const gr = D - D / d1 - D / d2; t3 = { pr: `1/${d1}`, pb: `1/${d2}`, D, gr, ok: d1 !== d2 && gr > 0 }; if (t3.ok) { t3.pg = pbFr(gr, D); const g = pbGcd(gr, D), m = r.i(1, 4); t3.g = gr / g * m; t3.t = D / g * m; } } while (!t3.ok);
  let tb; do { const rr = r.i(2, 8), b = r.i(4, 12), q = r.p([2, 3, 4, 5]), p = r.i(1, q - 1); const num = p * (rr + b) - q * rr, den = q - p; tb = { r: rr, b, p, q, pt: `${p}/${q}`, x: num / den, ok: pbGcd(p, q) === 1 && num > 0 && num % den === 0 && num / den <= 30 }; } while (!tb.ok);
  const E = r.p([['nombor gandaan 3', [3, 6]], ['nombor perdana', [2, 3, 5]], ['nombor lebih besar daripada 4', [5, 6]], ['nombor 6', [6]], ['faktor bagi 6', [1, 2, 3, 6]]]), k = E[1].length, N = 6 / pbGcd(k, 6) * r.i(4, 20);
  const dg = { A: vnama(), ev: E[0], As: pbSet(E[1]), k, p: pbFr(k, 6), pl: pbFr(6 - k, 6), N, lose: (6 - k) * N / 6 };
  const v = vq('k134', { kk, t3, tb, dg });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '13.1': {
    m: [() => PB.ruangSampel(pbRG), () => PB.kebExp(pbRG), () => PB.kebExp(pbRG), () => PB.bs(pbRG, PBBS1)],
    s: [() => PB.jadual(pbRG), () => PB.jangka(pbRG), () => PB.cubaan(pbRG)],
    k: [() => PB.k131(pbRG)]
  },
  '13.2': {
    m: [() => PB.setA(pbRG), () => PB.pDadu(pbRG), () => PB.pHuruf(pbRG), () => PB.julat(pbRG), () => PB.bs(pbRG, PBBS2)],
    s: [() => PB.pKad(pbRG), () => PB.pPutar(pbRG), () => PB.ramal(pbRG)],
    k: [() => PB.k132(pbRG)]
  },
  '13.3': {
    m: [() => PB.comp(pbRG), () => PB.comp(pbRG), () => PB.vennA(pbRG), () => PB.descComp(pbRG), () => PB.bs(pbRG, PBBS3)],
    s: [() => PB.compCount(pbRG), () => PB.vennP(pbRG), () => PB.cariComp(pbRG)],
    k: [() => PB.k133(pbRG)]
  },
  '13.4': {
    m: [() => PB.guli(pbRG), () => PB.cabutan(pbRG), () => PB.harian(pbRG)],
    s: [() => PB.cariBil(pbRG), () => PB.tambah(pbRG), () => PB.jadual2(pbRG)],
    k: [() => PB.k134(pbRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 13.1
WG.ruangSampel = i => PB.ruangSampel(pbRW, i * 5 + 3);
WG.kebExp = i => PB.kebExp(pbRW, i);
WG.bs1 = i => PB.bs(pbRW, PBBS1, [0, 2, 3, 5][i % 4] + wri(0, 1) * [6, 2, 4, 2][i % 4]);
WG.jadual = i => PB.jadual(pbRW, i);
WG.jangka = i => PB.jangka(pbRW, i * 3 + 1);
WG.cubaan = () => PB.cubaan(pbRW);
WG.k131 = () => PB.k131(pbRW);
// 13.2
WG.setA = () => PB.setA(pbRW);
WG.pDadu = i => PB.pDadu(pbRW, i);
WG.pHuruf = i => PB.pHuruf(pbRW, i);
WG.julat = i => PB.julat(pbRW, i * 5 + wri(0, 4));
WG.bs2 = i => PB.bs(pbRW, PBBS2, [1, 4][i % 2] + wri(0, 1) * 2);
WG.pKad = () => PB.pKad(pbRW);
WG.pPutar = i => PB.pPutar(pbRW, i);
WG.ramal = i => PB.ramal(pbRW, i);
WG.k132 = () => PB.k132(pbRW);
// 13.3
WG.compFr = () => PB.comp(pbRW, 'fr');
WG.compDec = () => PB.comp(pbRW, 'dec');
WG.compPct = () => PB.comp(pbRW, 'pct');
WG.vennA = () => PB.vennA(pbRW);
WG.descComp = i => PB.descComp(pbRW, i);
WG.bs3 = i => PB.bs(pbRW, PBBS3, [1, 6][i % 2] + wri(0, 1) * [4, 1][i % 2]);
WG.compCount = i => PB.compCount(pbRW, i * 2);
WG.vennP = () => PB.vennP(pbRW);
WG.cariComp = i => PB.cariComp(pbRW, i);
WG.k133 = () => PB.k133(pbRW);
// 13.4
WG.guli = () => PB.guli(pbRW);
WG.cabutan = () => PB.cabutan(pbRW);
WG.harian = i => PB.harian(pbRW, i);
WG.cariBil = () => PB.cariBil(pbRW);
WG.tambah = () => PB.tambah(pbRW);
WG.jadual2 = () => PB.jadual2(pbRW);
WG.k134 = () => PB.k134(pbRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '13.1': [['m', 'ruangSampel', 7], ['m', 'kebExp', 7], ['m', 'bs1', 4], ['s', 'jadual', 4], ['s', 'jangka', 3], ['s', 'cubaan', 2], ['k', 'k131', 3]],
  '13.2': [['m', 'setA', 5], ['m', 'pDadu', 4], ['m', 'pHuruf', 4], ['m', 'julat', 3], ['m', 'bs2', 2], ['s', 'pKad', 3], ['s', 'pPutar', 3], ['s', 'ramal', 3], ['k', 'k132', 3]],
  '13.3': [['m', 'compFr', 4], ['m', 'compDec', 2], ['m', 'compPct', 2], ['m', 'vennA', 4], ['m', 'descComp', 4], ['m', 'bs3', 2], ['s', 'compCount', 3], ['s', 'vennP', 3], ['s', 'cariComp', 3], ['k', 'k133', 3]],
  '13.4': [['m', 'guli', 7], ['m', 'cabutan', 5], ['m', 'harian', 6], ['s', 'cariBil', 4], ['s', 'tambah', 3], ['s', 'jadual2', 2], ['k', 'k134', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function pbOptsFr(n, d, cands) {
  const A = pbFr(n, d), seen = new Set([A]), w = [];
  for (const [cn, cd] of shuffle(cands)) { if (!cd || cn < 0) continue; const s = pbFr(cn, cd); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  const g = pbGcd(n, d) || 1, nn = n / g, dd = d / g;
  for (let k = 1; w.length < 3 && k < 60; k++) { const v = nn + (k % 2 ? 1 : -1) * Math.ceil(k / 2); if (v < 1) continue; const s = pbFr(v, dd); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function pbOptsN(ans, cands, f) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isInteger(c) || c < 0) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * Math.max(1, Math.round(ans / 10)); if (v < 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function pbOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pbMcq = (q, fig, o) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const pbKali = v => `${v} kali`;
const CQGEN = {
  eksperimen: [
    () => { const d = pbKxData(pbRG); return pbMcq(`${d.c} dan ${d.e}. Berapakah kebarangkalian eksperimen ${d.en}?`, '', pbOptsFr(d.f, d.n, [[d.f, d.n - d.f], [d.n - d.f, d.n], [1, d.f], [d.f, 2 * d.n]])); },
    () => {
      const e = pick([1, 2, 3, 4, 5, 6].map(i => PBEXP[i]))(pbRG), S = e.S, n = S.length, i1 = ri(0, n - 1); let i2; do i2 = ri(0, n - 1); while (i2 === i1);
      const ans = pbSet(S), c = [pbSet(S.filter((_, i) => i !== i1)), pbSet(S.filter((_, i) => i !== i2)), pbSet(S.concat([e.ex]))];
      return pbMcq(`${e.desc} Apakah ruang sampel, S?`, e.fig, pbOptsT(ans, c));
    },
    () => { const d = pbKxData(pbRG), g = pbGcd(d.f, d.n), pd = d.n / g, pn = d.f / g; let m; do m = ri(2, 10); while (pd * m > 2000); const N = pd * m, ans = pn * m; return pbMcq(`Kebarangkalian eksperimen ${d.en} ialah ${pbFr(d.f, d.n)}. Jika ${d.X[3](N)}, ${d.X[4]}?`, '', pbOptsN(ans, [N - ans, d.f, Math.round(N / 2), ans + pn, ans * 2], pbKali)); }
  ],
  teori: [
    () => { const e = pbDiceEvent(pbRG, Math.random() < .25), k = e.A.length; return pbMcq(`Sebiji dadu adil dilambung. Berapakah kebarangkalian mendapat ${e.nm}?`, pbDiceFig([1, 2, 3, 4, 5, 6]), pbOptsFr(k, 6, [[k, 6 - k], [6 - k, 6], [1, k], [k + 1, 6], [k, 12]])); },
    () => { const n = pick([4, 5, 6, 8]), sp = pbColSpin(pbRG, n), i = ri(0, 2), k = sp.cnt[i]; return pbMcq(`Pemutar dengan ${n} sektor sama besar diputar sekali. Berapakah kebarangkalian jarum berhenti pada sektor ${sp.cs[i]}?`, sp.fig, pbOptsFr(k, n, [[k, n - k], [n - k, n], [1, 3], [1, n], [k + 1, n]])); },
    () => {
      if (Math.random() < .5) { const ok = shuffle(['0', '1', '1/2', '3/4', '0.6', '2/5', '0.25', '45%']).slice(0, 3), bad = pick(['5/4', '1.2', '3/2', '120%', '7/5', '1.05']), opts = shuffle([bad, ...ok]); return { type: 'mcq', q: 'Antara berikut, yang manakah <b>BUKAN</b> nilai kebarangkalian?', fig: '', opts, c: opts.indexOf(bad) }; }
      const [x, ev, t, a, b] = pick(PBJUL), ans = t === 0 ? '0' : t === 1 ? '1' : pbFr(a, b), base = ['0', '1', '1/2', t === 2 ? pbFr(a + 1, b + 1) : pbFr(1, b)];
      return pbMcq(`${x} Berapakah kebarangkalian ${ev}?`, '', pbOptsT(ans, base));
    }
  ],
  pelengkap: [
    () => { let p, q; do { q = pick([4, 5, 6, 7, 8, 9, 10, 12]); p = ri(1, q - 1); } while (pbGcd(p, q) !== 1 || 2 * p === q); return pbMcq(`Diberi P(A) = ${p}/${q}. Berapakah P(A′)?`, '', pbOptsFr(q - p, q, [[p, q], [q, p], [q - p, p], [1, q], [q - 1, q]])); },
    () => {
      let h; do h = ri(5, 95); while (h === 50); const pct = Math.random() < .5, f = v => (pct ? `${v}%` : pbH(v)), ans = f(100 - h);
      const c = [h, 110 - h, 90 - h, 105 - h, 95 - h, h + 10].filter(v => v >= 1 && v <= 99 && v !== 100 - h).map(f);
      const [ev, evc] = pick(PBCTX);
      return pbMcq(`Kebarangkalian ${ev} ialah ${f(h)}. Berapakah kebarangkalian ${evc}?`, '', pbOptsT(ans, c));
    },
    () => { const e = pbVData(pbRG, 7, 10), C = e.C; return pbMcq('Berdasarkan gambar rajah Venn, apakah A′?', pbVennFig(e.S, e.A), pbOptsT(e.Cs, [e.As, e.Ss, pbSet(C.slice(1)), pbSet(C.slice(0, -1))])); }
  ],
  masalah: [
    () => { const B = pbBag(pbRG), i = ri(0, B.parts.length - 1), k = B.parts[i][1]; return pbMcq(`Sebiji guli diambil secara rawak dari balang ini. Berapakah kebarangkalian mendapat guli ${B.parts[i][0]}?`, pbBagFig(B.parts), pbOptsFr(k, B.t, [[k, B.t - k], [B.t - k, B.t], [1, B.parts.length], [1, k], [k, B.t + 1]])); },
    () => { let T, k; do { T = pick([50, 80, 100, 120, 200, 250, 400, 500]); k = ri(2, 10); } while (k >= T / 4); const N = vnama(); return pbMcq(`${T} keping tiket cabutan bertuah dijual. ${N} membeli ${k} keping. Berapakah kebarangkalian ${N} memenangi hadiah utama?`, '', pbOptsFr(k, T, [[1, T], [k, T - k], [T - k, T], [1, k], [k, 100]])); },
    () => { let p, q, m; do { q = ri(3, 8); p = ri(1, q - 1); m = ri(2, 6); } while (pbGcd(p, q) !== 1); const r0 = p * m, t = q * m, b = t - r0; return pbMcq(`Sebuah beg mengandungi ${r0} biji guli merah dan beberapa biji guli biru. P(merah) = ${p}/${q}. Berapakah bilangan guli biru?`, pbBagFig([['merah', r0], ['biru', '?']]), pbOptsN(b, [t, q - p, r0, b + p, q], v => `${v} biji`)); }
  ]
};
const CQT = { eksperimen: 'Kebarangkalian eksperimen', teori: 'Kebarangkalian teori', pelengkap: 'Peristiwa pelengkap', masalah: 'Penyelesaian masalah' };
function pbCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.teori;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['eksperimen', 'teori', 'teori', 'pelengkap', 'masalah'] : Object.keys(CQT);
  return pbCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pbCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
