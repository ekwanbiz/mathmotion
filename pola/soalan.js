'use strict';
/* =================== POLA · SOALAN BAB 1 POLA DAN JUJUKAN (Tingkatan 2) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "pl" / "PL" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor & rawak =================== */
// plRG untuk Latihan Kelas / games, plRW (berbenih) untuk Lembaran Kerja
const plRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random(), n: (a, b) => nz(a, b) };
const plRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR(), n: (a, b) => wnz(a, b) };
const plShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const plLs = (a, dots = true) => a.map(v => (typeof v === 'number' ? fmt(v) : v)).join(', ') + (dots ? ', …' : '');
const plDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const plSub = n => String(n).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join('');
const plT = k => `T${plSub(k)}`;
const plArit = (a, d, n) => Array.from({ length: n }, (_, i) => a + d * i);
const plGeom = (a, r, n) => Array.from({ length: n }, (_, i) => a * Math.pow(r, i));
const plFib = (a, b, n) => { const s = [a, b]; while (s.length < n) s.push(s[s.length - 1] + s[s.length - 2]); return s.slice(0, n); };
const plPascal = R => { const o = [[1]]; for (let r = 1; r <= R; r++) { const p = o[r - 1]; o.push([1, ...p.slice(1).map((v, i) => p[i] + v), 1]); } return o; };
const plSum = a => a.reduce((s, v) => s + v, 0);
// ungkapan Tn = a n + b (teks)
const plTnE = (a, b) => {
  const an = a === 1 ? 'n' : a === -1 ? '−n' : `${fmt(a)}n`;
  if (a < 0 && b > 0) return `${b} − ${a === -1 ? '' : -a}n`;
  if (b === 0) return an;
  return `${an} ${b > 0 ? '+' : '−'} ${Math.abs(b)}`;
};
const plTn = (a, b) => `Tₙ = ${plTnE(a, b)}`;
// gantian: a(k) + b
const plGanti = (a, b, k) => (a < 0 && b > 0 ? `${b} − ${-a === 1 ? '' : -a}(${k})` : `${a === 1 ? '' : a === -1 ? '−' : fmt(a)}(${k})${b ? ` ${b > 0 ? '+' : '−'} ${Math.abs(b)}` : ''}`);

/* ---------- jenis pola: tambah / tolak / darab / bahagi ---------- */
const PLOP = {
  add: k => `Tambah ${k} kepada nombor sebelumnya`,
  sub: k => `Tolak ${k} daripada nombor sebelumnya`,
  mul: k => `Darab nombor sebelumnya dengan ${k}`,
  div: k => `Bahagi nombor sebelumnya dengan ${k}`
};
const PLSYM = { add: '+', sub: '−', mul: '×', div: '÷' };
// jujukan rawak: { seq, kind, k, desc, next }
function plSeq(r, kind, len, neg) {
  kind = kind || r.p(['add', 'add', 'sub', 'sub', 'mul', 'div']);
  len = len || 5;
  let seq, k;
  if (kind === 'add') { k = r.i(2, 12); const a = neg && r.f() < .5 ? -r.i(2, 4) * k + r.i(0, k - 1) : r.i(1, 30); seq = plArit(a, k, len + 1); }
  else if (kind === 'sub') { k = r.i(2, 9); const a = neg && r.f() < .5 ? r.i(1, 3) * k + r.i(1, k - 1) : k * len + r.i(2, 40); seq = plArit(a, -k, len + 1); }
  else if (kind === 'mul') { k = r.p([2, 2, 3, 3, 4, 5]); const L = k >= 4 ? 4 : len; let a; do a = r.i(1, k === 2 ? 9 : 4); while (a * Math.pow(k, L) > 2000); seq = plGeom(a, k, L + 1); len = L; }
  else { k = r.p([2, 2, 3, 3, 4, 5]); const L = k >= 4 ? 4 : len; const c = r.i(1, k === 2 ? 9 : 3); seq = plGeom(c, k, L + 1).reverse(); len = L; }
  return { seq: seq.slice(0, len), next: seq[len], kind, k, desc: PLOP[kind](k) };
}
// huraian salah yang munasabah (untuk soalan "Adakah ... betul?")
const plWrongDesc = d => {
  if (d.kind === 'add') return PLOP.sub(d.k);
  if (d.kind === 'sub') return PLOP.add(d.k);
  if (d.kind === 'mul') return PLOP.add(d.seq[1] - d.seq[0]);
  return PLOP.sub(d.seq[0] - d.seq[1]);
};
const plOpW = d => { const s = d.seq; return [`${fmt(s[0])} ${PLSYM[d.kind]} ${d.k} = ${fmt(s[1])}, ${fmt(s[1])} ${PLSYM[d.kind]} ${d.k} = ${fmt(s[2])}, …`]; };

/* =================== rajah (var(--…) supaya ikut tema) =================== */
const plTx = (x, y, t, c = 'tx', sz = 18, a = 'middle', w = 700) => `<text x="${+x.toFixed(1)}" y="${+y.toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Space Grotesk, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
// sebaris kotak nombor; o = { blank:[i], hi:[i], ops:[teks], subs:[teks], c }
function plRowFig(vals, o = {}) {
  const n = vals.length, w = vals.some(v => String(typeof v === 'number' ? fmt(v) : v).length > 3) ? 64 : 54, gap = 14, top = o.ops ? 44 : 10;
  const Wd = n * w + (n - 1) * gap + 24, Hd = top + 52 + (o.subs ? 30 : 10);
  let s = '';
  vals.forEach((v, i) => {
    const x = 12 + i * (w + gap), bl = (o.blank || []).includes(i), hi = (o.hi || []).includes(i);
    const c = bl ? 'tr' : hi ? (o.c || 'gr') : 'bd';
    s += `<rect x="${x}" y="${top}" width="${w}" height="50" rx="11" style="fill:${bl || hi ? `color-mix(in srgb,var(--${bl ? 'tr' : o.c || 'gr'}) 16%,transparent)` : 'var(--surf)'};stroke:var(--${c})" stroke-width="2.2"${bl ? ' stroke-dasharray="6 4"' : ''}/>`;
    s += plTx(x + w / 2, top + 26, typeof v === 'number' ? fmt(v) : v, bl ? 'tr' : hi ? (o.c || 'gr') : 'tx', String(v).length > 4 ? 16 : 20);
    if (o.subs) s += plTx(x + w / 2, top + 70, o.subs[i], 'mu', 19, 'middle', 600);
  });
  (o.ops || []).forEach((t, i) => {
    if (!t) return;
    const a = 12 + i * (w + gap) + w / 2 + 6, b = a + w + gap - 12, m = (a + b) / 2;
    s += `<path d="M${a} ${top - 3} Q${m} ${top - 30} ${b} ${top - 3}" style="fill:none;stroke:var(--pu)" stroke-width="2.4" stroke-linecap="round"/>`;
    s += plTx(m, top - 26, t, 'pu', 14);
  });
  return `<svg viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="${esc(o.label || 'Senarai nombor')}" font-family="Inter, sans-serif">${s}</svg>`;
}
// segi tiga Pascal baris 0..R; o = { hide:[r,k], hi:[[r,k]…] }
function plPascalFig(R, o = {}) {
  const P = plPascal(R), dx = 46, dy = 42, Wd = (R + 1) * dx + 24, Hd = (R + 1) * dy + 18;
  let s = '';
  P.forEach((row, r) => row.forEach((v, k) => {
    const x = Wd / 2 + (k - r / 2) * dx, y = 30 + r * dy, hid = o.hide && o.hide[0] === r && o.hide[1] === k, hi = (o.hi || []).some(([a, b]) => a === r && b === k);
    s += `<circle cx="${+x.toFixed(1)}" cy="${y}" r="19" style="fill:${hid || hi ? `color-mix(in srgb,var(--${hid ? 'tr' : 'pu'}) 18%,transparent)` : 'var(--surf)'};stroke:var(--${hid ? 'tr' : hi ? 'pu' : k === 0 || k === r ? 'am' : 'bd'})" stroke-width="2"${hid ? ' stroke-dasharray="5 4"' : ''}/>`;
    s += plTx(x, y + 1, hid ? '?' : v, hid ? 'tr' : hi ? 'pu' : 'tx', v >= 100 ? 13 : v >= 10 ? 15 : 17);
  }));
  return `<svg viewBox="0 0 ${Wd} ${Hd}" role="img" aria-label="Segi tiga Pascal" font-family="Inter, sans-serif">${s}</svg>`;
}
/* ---------- pola objek: batang mancis & titik ---------- */
const PLOBJ = {
  sq: { a: 3, b: 1, unit: 'batang mancis', nama: 'petak sebaris yang dibina daripada batang mancis' },
  tri: { a: 2, b: 1, unit: 'batang mancis', nama: 'segi tiga sebaris yang dibina daripada batang mancis' },
  dL: { a: 2, b: -1, unit: 'titik', nama: 'susunan titik berbentuk huruf L' },
  dP: { a: 2, b: 2, unit: 'titik', nama: 'dua baris titik' },
  dSq: { sq: true, unit: 'titik', nama: 'susunan titik berbentuk segi empat sama' },
  dTri: { trin: true, unit: 'titik', nama: 'susunan titik berbentuk segi tiga' }
};
const plObjN = (kind, n) => { const o = PLOBJ[kind]; return o.sq ? n * n : o.trin ? n * (n + 1) / 2 : o.a * n + o.b; };
const plStick = (p, q) => `<line x1="${+p[0].toFixed(1)}" y1="${+p[1].toFixed(1)}" x2="${+q[0].toFixed(1)}" y2="${+q[1].toFixed(1)}" style="stroke:var(--am)" stroke-width="4" stroke-linecap="round"/><circle cx="${+q[0].toFixed(1)}" cy="${+q[1].toFixed(1)}" r="3.6" style="fill:var(--rd)"/>`;
const plDot = (x, y, c = 'tr') => `<circle cx="${+x.toFixed(1)}" cy="${+y.toFixed(1)}" r="5.5" style="fill:var(--${c})"/>`;
// lukis satu rajah objek; pulangkan { s, w, h, cnt }
function plObjDraw(kind, n, x0, y0) {
  let s = '', cnt = 0;
  const u = 26, sh = (p, q) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); s += plStick([p[0] + dx / L * 3, p[1] + dy / L * 3], [q[0] - dx / L * 3, q[1] - dy / L * 3]); cnt++; };
  if (kind === 'sq') {
    for (let i = 0; i < n; i++) { sh([x0 + i * u, y0], [x0 + (i + 1) * u, y0]); sh([x0 + i * u, y0 + u], [x0 + (i + 1) * u, y0 + u]); }
    for (let i = 0; i <= n; i++) sh([x0 + i * u, y0 + u], [x0 + i * u, y0]);
    return { s, w: n * u, h: u, cnt };
  }
  if (kind === 'tri') {
    const h = u * .866, B = j => [x0 + j * u, y0 + h], T = j => [x0 + u / 2 + j * u, y0], E = [];
    for (let i = 0; i < n; i++) {
      const t = i % 2 === 0 ? [B(i / 2), B(i / 2 + 1), T(i / 2)] : [T((i - 1) / 2), T((i + 1) / 2), B((i + 1) / 2)];
      [[0, 1], [1, 2], [2, 0]].forEach(([a, b]) => { const k = [t[a], t[b]].map(p => p.join(',')).sort().join('|'); if (!E.includes(k)) { E.push(k); sh(t[a], t[b]); } });
    }
    return { s, w: (Math.ceil(n / 2) + (n % 2 ? 0 : .5)) * u, h, cnt };
  }
  const g = 15;
  if (kind === 'dL') { for (let i = 0; i < n; i++) { s += plDot(x0, y0 + i * g); cnt++; } for (let i = 1; i < n; i++) { s += plDot(x0 + i * g, y0 + (n - 1) * g); cnt++; } return { s, w: (n - 1) * g, h: (n - 1) * g, cnt }; }
  if (kind === 'dP') { for (let i = 0; i <= n; i++) { s += plDot(x0 + i * g, y0, 'gr') + plDot(x0 + i * g, y0 + g, 'gr'); cnt += 2; } return { s, w: n * g, h: g, cnt }; }
  if (kind === 'dSq') { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { s += plDot(x0 + j * g, y0 + i * g, 'pk'); cnt++; } return { s, w: (n - 1) * g, h: (n - 1) * g, cnt }; }
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) { s += plDot(x0 + (j - i / 2) * g + (n - 1) * g / 2, y0 + i * g, 'pu'); cnt++; }
  return { s, w: (n - 1) * g, h: (n - 1) * g, cnt };
}
function plObjFig(kind, ns) {
  ns = ns || [1, 2, 3];
  let x = 14, s = '', H = 0;
  const parts = ns.map(n => { const d = plObjDraw(kind, n, 0, 0); H = Math.max(H, d.h); return d; });
  parts.forEach((d, i) => {
    const pw = Math.max(d.w, 60), dd = plObjDraw(kind, ns[i], x + (pw - d.w) / 2, 12 + (H - d.h));
    s += dd.s + plTx(x + pw / 2, H + 42, `Rajah ${ns[i]}`, 'mu', 14, 'middle', 600);
    x += pw + 30;
  });
  return `<svg viewBox="0 0 ${Math.round(x - 16)} ${Math.round(H + 58)}" role="img" aria-label="Pola objek Rajah ${ns.join(', ')}" font-family="Inter, sans-serif">${s}</svg>`;
}

/* =================== data bersama =================== */
const PLBS1 = [
  ['Setiap baris segi tiga Pascal bermula dan berakhir dengan nombor 1.', true, 'Nombor di hujung setiap baris segi tiga Pascal ialah 1.'],
  ['Dalam segi tiga Pascal, setiap nombor ialah hasil darab dua nombor di atasnya.', false, 'Setiap nombor ialah hasil TAMBAH dua nombor di atasnya.'],
  ['Nombor Fibonacci selepas 8 ialah 13.', true, 'Nombor sebelum 8 ialah 5, maka 5 + 8 = 13.'],
  ['Semua nombor yang berakhir dengan digit 5 ialah nombor genap.', false, 'Nombor yang berakhir dengan 5 tidak boleh dibahagi tepat dengan 2, maka ia nombor ganjil.'],
  ['Pola nombor genap dan nombor ganjil ialah tambah 2 kepada nombor sebelumnya.', true, '2, 4, 6, … dan 1, 3, 5, … kedua-duanya bertambah 2.'],
  ['Hasil tambah dua nombor ganjil ialah nombor ganjil.', false, 'Contoh: 3 + 5 = 8 ialah nombor genap.'],
  ['Nombor Fibonacci diperoleh dengan menambah dua nombor sebelumnya.', true, '0, 1, 1, 2, 3, 5, … : setiap nombor = hasil tambah dua nombor sebelumnya.'],
  ['Hasil tambah nombor dalam setiap baris segi tiga Pascal ialah 1, 2, 4, 8, 16, …', true, 'Jumlah setiap baris didarab dengan 2.']
];
const PLBS2 = [
  ['Jujukan ialah set nombor atau objek yang disusun mengikut suatu pola.', true, 'Itulah maksud jujukan.'],
  ['2, 5, 9, 11, … ialah satu jujukan.', false, 'Bezanya 3, 4, 2 – tidak mengikut pola yang tetap.'],
  ['Pola bagi jujukan 40, 36, 32, 28, … ialah tolak 4 daripada nombor sebelumnya.', true, '40 − 4 = 36, 36 − 4 = 32, 32 − 4 = 28.'],
  ['Pola bagi jujukan 3, 6, 12, 24, … ialah tambah 3 kepada nombor sebelumnya.', false, '6 + 3 = 9, bukan 12. Polanya ialah darab nombor sebelumnya dengan 2.'],
  ['Sebutan seterusnya bagi jujukan 81, 27, 9, … ialah 3.', true, 'Pola: bahagi dengan 3, maka 9 ÷ 3 = 3.'],
  ['Jujukan tidak boleh mengandungi nombor negatif.', false, 'Contoh: −8, −5, −2, 1, … ialah jujukan (tambah 3).'],
  ['Setiap nombor dalam suatu jujukan dipanggil sebutan.', true, 'Nombor dalam jujukan dipanggil sebutan.'],
  ['1, 4, 7, 10, … dan 10, 7, 4, 1, … mempunyai pola yang sama.', false, 'Jujukan pertama tambah 3, jujukan kedua tolak 3.']
];
const PLNAMA2 = ['Aina', 'Hafiz', 'Kumar', 'Mei Ling', 'Farah', 'Jason'];

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 1.1 Pola ---------- */
  huraiPola: [
    ({ ls }) => ({ q: `Huraikan pola bagi senarai nombor berikut: ${ls}` }),
    ({ ls }) => ({ q: `Nyatakan peraturan pola nombor ${ls}` }),
    ({ ls }) => ({ q: `Perhatikan senarai nombor ${ls} Apakah pola senarai nombor ini?` }),
    ({ ls, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata pola bagi ${ls} ialah "${wrong.toLowerCase()}". Adakah ${N} betul?` }, salah(N, ans, 'Semak hubungan antara setiap nombor dengan nombor sebelumnya.')); }
  ],
  seterusnya: [
    ({ ls }) => ({ q: `Nyatakan nombor seterusnya bagi pola ${ls}` }),
    ({ ls }) => ({ q: `Berdasarkan pola ${ls} apakah nombor yang berikutnya?` }),
    ({ ls, n }) => ({ q: `Senarai nombor ${ls} mengikut satu pola. Cari nombor ke-${n + 1}.` }),
    ({ ls }) => ({ q: `Lengkapkan pola: ${ls.replace(', …', '')}, ___` })
  ],
  genap: [
    ({ jenis, a, b }) => ({ q: `Senaraikan semua nombor ${jenis} di antara ${a} dan ${b}.` }),
    ({ jenis, a, b }) => ({ q: `Tulis semua nombor ${jenis} yang lebih besar daripada ${a} dan kurang daripada ${b}.` }),
    ({ jenis, a, b }) => ({ q: `Nyatakan nombor ${jenis} yang terletak di antara ${a} dengan ${b}.` })
  ],
  pilihGenap: [
    ({ jenis, ls }) => ({ q: `Antara nombor berikut, yang manakah nombor ${jenis}? ${ls}` }),
    ({ jenis, ls }) => ({ q: `Bulatkan semua nombor ${jenis}: ${ls}` }),
    ({ jenis, ls }) => ({ q: `Kenal pasti nombor ${jenis} dalam senarai ${ls}` })
  ],
  pascal: [
    () => ({ q: 'Rajah di bawah menunjukkan sebahagian daripada segi tiga Pascal. Cari nombor yang diwakili oleh ?.' }),
    () => ({ q: 'Lengkapkan segi tiga Pascal di bawah dengan mencari nilai ?.' }),
    () => ({ q: 'Berdasarkan pola segi tiga Pascal di bawah, apakah nombor yang tersembunyi?' }),
    ({ wrongV, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata nombor ? dalam segi tiga Pascal di bawah ialah ${wrongV}. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dua nombor di atasnya. Sepatutnya tambah.`)); }
  ],
  fibo: [
    ({ ls }) => ({ q: `Lengkapkan nombor Fibonacci berikut: ${ls}` }),
    ({ ls }) => ({ q: `Senarai berikut ialah nombor Fibonacci. Cari nombor yang tertinggal: ${ls}` }),
    ({ ls }) => ({ q: `Isi tempat kosong dalam pola Fibonacci ${ls}` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  polaObjek: [
    ({ nama, unit, m }) => ({ q: `Rajah di bawah menunjukkan pola ${nama}. Berapakah bilangan ${unit} dalam Rajah ${m}?` }),
    ({ unit, m }) => ({ q: `Perhatikan pola di bawah. Hitung bilangan ${unit} yang diperlukan untuk Rajah ${m}.` }),
    ({ unit, m }) => ({ q: `Pola di bawah berterusan. Nyatakan bilangan ${unit} dalam Rajah ${m}.` }),
    ({ nama, unit, m }) => ({ q: `Rajah 1, 2 dan 3 menunjukkan ${nama}. Jika pola ini diteruskan, berapakah ${unit} dalam Rajah ${m}?` })
  ],
  pascalJum: [
    ({ ls }) => ({ q: `Hitung hasil tambah semua nombor dalam baris segi tiga Pascal yang bermula dengan ${ls}` }),
    ({ ls }) => ({ q: `Satu baris segi tiga Pascal bermula dengan ${ls} Cari jumlah semua nombor dalam baris itu.` }),
    ({ ls }) => ({ q: `Berapakah jumlah nombor dalam baris segi tiga Pascal yang bermula dengan ${ls}?` })
  ],
  pascalBaris: [
    ({ row }) => ({ q: `Satu baris segi tiga Pascal ialah ${row}. Tulis baris seterusnya.` }),
    ({ row }) => ({ q: `Diberi baris segi tiga Pascal ${row}. Apakah baris di bawahnya?` }),
    ({ row }) => ({ q: `Lengkapkan baris seterusnya bagi segi tiga Pascal selepas baris ${row}.` })
  ],
  polaBeza: [
    ({ ls }) => ({ q: `Senarai nombor ${ls} mempunyai pola. Cari dua nombor seterusnya.` }),
    ({ ls }) => ({ q: `Perhatikan beza antara nombor dalam ${ls} Tulis dua nombor yang berikutnya.` }),
    ({ ls }) => ({ q: `Nyatakan dua nombor seterusnya bagi pola ${ls}` })
  ],
  k11: [
    ({ a, b, m, val, list }) => ({ q: `Satu pola bermula dengan ${a} dan ${b}. Setiap nombor seterusnya ialah hasil tambah dua nombor sebelumnya. Cari nombor ke-${m} dalam pola ini.`, ans: `${val}`, work: [`Tambah dua nombor sebelumnya: ${list}`, `Nombor ke-${m} = ${val}`] }),
    ({ S, o1, o2, o3 }) => ({ q: `Hasil tambah tiga nombor ganjil berturutan ialah ${S}. Cari ketiga-tiga nombor itu.`, ans: `${o1}, ${o2} dan ${o3}`, work: ['Nombor ganjil berturutan berbeza 2. Nombor tengah = jumlah ÷ 3.', `Nombor tengah = ${S} ÷ 3 = ${o2}`, `Nombor itu: ${o2} − 2 = ${o1}, ${o2} dan ${o2} + 2 = ${o3}`] }),
    ({ row, nx, nx2, js }) => ({ q: `Satu baris segi tiga Pascal ialah ${row}. Tulis dua baris seterusnya dan hitung hasil tambah nombor dalam baris yang terakhir.`, ans: `${nx}; ${nx2}; jumlah = ${js}`, work: ['Setiap nombor = hasil tambah dua nombor di atasnya, hujung = 1.', `Baris seterusnya: ${nx}`, `Baris berikutnya: ${nx2}`, `Jumlah = ${js}`] }),
    ({ c0, m2, val2, lst }) => ({ q: `Sebuah pola petak dibina daripada batang mancis: Rajah 1 ada ${c0} batang dan setiap rajah seterusnya memerlukan 3 batang lagi. Berapakah bilangan batang mancis dalam Rajah ${m2}?`, ans: `${val2} batang`, work: ['Pola: tambah 3 kepada nombor sebelumnya.', lst, `Rajah ${m2} = ${val2} batang`] }),
    ({ E, e1, e2, e3, e4 }) => ({ q: `Hasil tambah empat nombor genap berturutan ialah ${E}. Cari nombor genap yang terbesar.`, ans: `${e4}`, work: ['Nombor genap berturutan berbeza 2: x, x + 2, x + 4, x + 6.', `4x + 12 = ${E} → x = ${e1}`, `Nombor: ${e1}, ${e2}, ${e3}, ${e4}. Terbesar = ${e4}`] })
  ],

  /* ---------- 1.2 Jujukan ---------- */
  kenalJuj: [
    ({ ls }) => ({ q: `Tentukan sama ada ${ls.replace(', …', '')} ialah satu jujukan. Beri sebab.` }),
    ({ ls }) => ({ q: `Adakah set nombor ${ls.replace(', …', '')} satu jujukan? Jelaskan.` }),
    ({ ls }) => ({ q: `Set nombor ${ls.replace(', …', '')}. Adakah set nombor ini mengikut suatu pola?` }),
    ({ ls, isSeq, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata ${ls.replace(', …', '')} ${isSeq ? 'bukan' : 'ialah'} satu jujukan. Adakah ${N} betul?` }, salah(N, ans, isSeq ? 'Semua sebutan mengikut pola yang sama.' : 'Pola antara sebutan tidak tetap.')); }
  ],
  lengkap: [
    ({ ls }) => ({ q: `Lengkapkan jujukan berikut: ${ls}` }),
    ({ ls }) => ({ q: `Isi tempat kosong dalam jujukan ${ls}` }),
    ({ ls }) => ({ q: `Cari sebutan yang tertinggal dalam jujukan ${ls}` }),
    ({ ls }) => ({ q: `Jujukan ${ls} mempunyai dua tempat kosong. Nyatakan nombor-nombor itu.` })
  ],
  perkataan: [
    ({ ls }) => ({ q: `Huraikan pola jujukan ${ls} dengan perkataan.` }),
    ({ ls }) => ({ q: `Terangkan pola bagi jujukan ${ls} menggunakan perkataan.` }),
    ({ ls }) => ({ q: `Tulis pola jujukan ${ls} dalam bentuk perkataan.` }),
    ({ ls, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${N} menghuraikan pola jujukan ${ls} sebagai "${wrong.toLowerCase()}". Adakah ${N} betul?` }, salah(N, ans, 'Bandingkan setiap sebutan dengan sebutan sebelumnya.')); }
  ],
  duaLagi: [
    ({ ls }) => ({ q: `Tulis dua sebutan seterusnya bagi jujukan ${ls}` }),
    ({ ls }) => ({ q: `Panjangkan jujukan ${ls} dengan dua sebutan lagi.` }),
    ({ ls }) => ({ q: `Jujukan ${ls} berterusan mengikut polanya. Nyatakan dua sebutan yang berikutnya.` }),
    ({ ls, d1, d2 }) => { const N = vnama(); return { q: `${N} berkata dua sebutan seterusnya bagi jujukan ${ls} ialah ${d1} dan ${d2}. Adakah ${N} betul?` }; }
  ],
  lengkapTengah: [
    ({ ls }) => ({ q: `Jujukan ${ls} mempunyai pola tambah atau tolak nombor yang sama. Lengkapkan jujukan itu.` }),
    ({ ls }) => ({ q: `Sebutan-sebutan jujukan ${ls} berbeza dengan nombor yang sama. Cari nombor yang tertinggal.` }),
    ({ ls }) => ({ q: `Lengkapkan jujukan ${ls} dan huraikan polanya.` })
  ],
  jujObjek: [
    ({ nama, unit }) => ({ q: `Rajah di bawah menunjukkan ${nama}. Tulis jujukan bilangan ${unit} bagi empat rajah pertama dan huraikan polanya.` }),
    ({ unit }) => ({ q: `Bilangan ${unit} dalam rajah di bawah membentuk satu jujukan. Tulis empat sebutan pertama dan huraikan polanya.` }),
    ({ nama, unit }) => ({ q: `Berdasarkan ${nama} di bawah, bentukkan jujukan bilangan ${unit} (empat sebutan) dan nyatakan polanya.` })
  ],
  k12: [
    ({ a, b, x, y, d }) => ({ q: `Jujukan ${a}, p, q, ${b}, … mempunyai pola tambah nombor yang sama. Cari nilai p dan q.`, ans: `p = ${x}, q = ${y}`, work: [`Dari ${a} ke ${b} ada 3 langkah: beza = (${b} − ${a}) ÷ 3 = ${d}`, `p = ${a} + ${d} = ${x}`, `q = ${x} + ${d} = ${y}`] }),
    ({ H, k, v, lst }) => ({ q: `Sebiji bola dijatuhkan dari ketinggian ${H} cm. Selepas setiap lantunan, ketinggian bola menjadi separuh daripada ketinggian sebelumnya. Berapakah ketinggian bola selepas lantunan ke-${k}?`, ans: `${v} cm`, work: ['Pola: bahagi ketinggian sebelumnya dengan 2.', lst, `Selepas lantunan ke-${k}: ${v} cm`] }),
    ({ N, s0, d2, X, w, lst2 }) => ({ q: `${N} menyimpan RM${s0} pada minggu pertama. Setiap minggu dia menambah simpanannya sebanyak RM${d2}. Pada minggu keberapakah jumlah simpanannya menjadi RM${X}?`, ans: `Minggu ke-${w}`, work: [`Jujukan jumlah simpanan: ${lst2}`, `Pola: tambah ${d2} kepada nombor sebelumnya.`, `RM${X} dicapai pada minggu ke-${w}.`] }),
    ({ a0, r, c, b2 }) => ({ q: `Jujukan ${a0}, ${b2}, x, ${c * r}, … mempunyai pola darab nombor sebelumnya dengan nombor yang sama. Cari nilai x dan sebutan seterusnya selepas ${c * r}.`, ans: `x = ${c}; sebutan seterusnya = ${c * r * r}`, work: [`Pola: ${b2} ÷ ${a0} = ${r}, iaitu darab nombor sebelumnya dengan ${r}.`, `x = ${b2} × ${r} = ${c}`, `Sebutan seterusnya = ${c * r} × ${r} = ${c * r * r}`] })
  ],

  /* ---------- 1.3 Pola dan Jujukan ---------- */
  sebutTn: [
    ({ e, k }) => ({ q: `Diberi ${e}. Cari ${plT(k)}.` }),
    ({ e, k }) => ({ q: `Sebutan ke-n suatu jujukan ialah ${e}. Hitung sebutan ke-${k}.` }),
    ({ e, k }) => ({ q: `Jika ${e}, apakah nilai sebutan ke-${k}?` }),
    ({ e, k, wrongV, ans }) => { const N = vnama(); return Object.assign({ q: `Diberi ${e}. ${N} berkata ${plT(k)} = ${wrongV}. Adakah ${N} betul?` }, salah(N, ans, 'Ganti n dengan nombor kedudukan dalam ungkapan dan hitung dengan teliti.')); }
  ],
  nyata: [
    ({ ls, k1, k2 }) => ({ q: `Bagi jujukan ${ls} nyatakan ${plT(k1)} dan ${plT(k2)}.` }),
    ({ ls, k1, k2 }) => ({ q: `Jujukan ${ls} Tulis nilai sebutan ke-${k1} dan sebutan ke-${k2}.` }),
    ({ ls, k1, k2 }) => ({ q: `Daripada jujukan ${ls} kenal pasti ${plT(k1)} dan ${plT(k2)}.` })
  ],
  cariTn: [
    ({ ls }) => ({ q: `Tentukan ungkapan algebra bagi sebutan ke-n, Tₙ, untuk jujukan ${ls}` }),
    ({ ls }) => ({ q: `Cari Tₙ bagi jujukan ${ls}` }),
    ({ ls }) => ({ q: `Tulis pola jujukan ${ls} dalam bentuk ungkapan algebra Tₙ.` }),
    ({ ls, wrongE, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata sebutan ke-n bagi jujukan ${ls} ialah ${wrongE}. Adakah ${N} betul?` }, salah(N, ans, `Semak ungkapan dengan sebutan pertama: ganti n = 1.`)); }
  ],
  tulis4: [
    ({ e }) => ({ q: `Tulis empat sebutan pertama bagi jujukan dengan ${e}.` }),
    ({ e }) => ({ q: `Diberi ${e}. Senaraikan T₁, T₂, T₃ dan T₄.` }),
    ({ e }) => ({ q: `Bentukkan empat sebutan pertama jujukan jika sebutan ke-n ialah ${e}.` })
  ],
  cariN: [
    ({ e, v }) => ({ q: `Diberi ${e}. Sebutan keberapakah bernilai ${fmt(v)}?` }),
    ({ e, v }) => ({ q: `Sebutan ke-n suatu jujukan ialah ${e}. Cari nilai n apabila Tₙ = ${fmt(v)}.` }),
    ({ e, v }) => ({ q: `Jika ${e}, tentukan kedudukan sebutan yang bernilai ${fmt(v)}.` }),
    ({ ls, v }) => ({ q: `${fmt(v)} ialah satu sebutan dalam jujukan ${ls} Sebutan keberapakah ${fmt(v)}?` })
  ],
  adakah: [
    ({ e, v }) => ({ q: `Diberi ${e}. Adakah ${fmt(v)} satu sebutan dalam jujukan ini? Tunjukkan kerja.` }),
    ({ e, v }) => ({ q: `Tentukan sama ada ${fmt(v)} ialah sebutan bagi jujukan ${e}.` }),
    ({ ls, v }) => ({ q: `Adakah ${fmt(v)} satu sebutan dalam jujukan ${ls}? Beri sebab.` })
  ],
  tnObjek: [
    ({ nama, unit }) => ({ q: `Rajah di bawah menunjukkan ${nama}. Cari ungkapan algebra Tₙ bagi bilangan ${unit} dalam Rajah n.` }),
    ({ unit }) => ({ q: `Berdasarkan pola di bawah, tentukan Tₙ, iaitu bilangan ${unit} dalam Rajah n.` }),
    ({ unit, m }) => ({ q: `Bina ungkapan algebra Tₙ bagi bilangan ${unit} dalam pola di bawah, kemudian cari bilangan ${unit} dalam Rajah ${m}.` })
  ],
  k13: [
    ({ c1, d, k, ck, X, nX }) => ({ q: `Dalam sebuah dewan, baris pertama ada ${c1} buah kerusi dan setiap baris seterusnya ada ${d} buah kerusi lebih daripada baris sebelumnya. (a) Tulis Tₙ bagi bilangan kerusi dalam baris ke-n. (b) Berapakah kerusi dalam baris ke-${k}? (c) Baris keberapakah ada ${X} buah kerusi?`, ans: `(a) ${plTn(d, c1 - d)} (b) ${ck} buah (c) Baris ke-${nX}`, work: [`Jujukan: ${plLs(plArit(c1, d, 4))} → beza ${d}`, `(a) ${plTn(d, c1 - d)}`, `(b) ${plT(k)} = ${plGanti(d, c1 - d, k)} = ${ck}`, `(c) ${plTnE(d, c1 - d)} = ${X} → n = ${nX}`] }),
    ({ a, b, c, e, n, v }) => ({ q: `Dua jujukan mempunyai sebutan ke-n Tₙ = ${plTnE(a, b)} dan Uₙ = ${plTnE(c, e)}. Pada sebutan keberapakah kedua-dua jujukan mempunyai nilai yang sama? Nyatakan nilai itu.`, ans: `Sebutan ke-${n}, nilainya ${v}`, work: [`${plTnE(a, b)} = ${plTnE(c, e)}`, `${fmt(b - e)} = ${c - a}n → n = ${n}`, `${plT(n)} = ${plGanti(a, b, n)} = ${v}`] }),
    ({ M, nmax, sisa }) => ({ q: `Petak sebaris dibina dengan batang mancis mengikut pola Tₙ = 3n + 1 (n ialah bilangan petak). Sani ada ${M} batang mancis. Berapakah bilangan petak terbanyak yang dapat dibina dan berapa batang yang tinggal?`, ans: `${nmax} petak, baki ${sisa} batang`, work: [`3n + 1 ≤ ${M} → 3n ≤ ${M - 1} → n ≤ ${(Math.round((M - 1) / 3 * 100) / 100)}`, `Bilangan petak terbanyak = ${nmax}`, `Batang digunakan = 3(${nmax}) + 1 = ${3 * nmax + 1}; baki = ${M} − ${3 * nmax + 1} = ${sisa}`] }),
    ({ f, h, jam, kos, B, jB }) => ({ q: `Bayaran sewa sebuah basikal ialah RM${f} untuk jam pertama dan RM${h} bagi setiap jam tambahan. (a) Tulis Tₙ bagi bayaran untuk n jam. (b) Hitung bayaran untuk ${jam} jam. (c) Berapa jamkah basikal disewa jika bayarannya RM${B}?`, ans: `(a) ${plTn(h, f - h)} (b) RM${kos} (c) ${jB} jam`, work: [`Jujukan bayaran: ${plLs(plArit(f, h, 4))} → beza ${h}`, `(a) ${plTn(h, f - h)}`, `(b) ${plT(jam)} = ${plGanti(h, f - h, jam)} = ${kos}`, `(c) ${plTnE(h, f - h)} = ${B} → n = ${jB}`] })
  ]
};

/* =================== pembina soalan (r = plRG atau plRW) =================== */
const PL = {};
/* ---------- 1.1 ---------- */
PL.huraiPola = (r, kind) => {
  const d = plSeq(r, kind), ls = plLs(d.seq);
  return GEN_LQ('huraiPola', { ls, wrong: plWrongDesc(d), ans: d.desc, work: plOpW(d).concat([d.desc + '.']) }, { fig: plRowFig(d.seq.concat(['…']), { label: 'Pola nombor' }), figAns: plRowFig(d.seq, { ops: d.seq.slice(1).map(() => PLSYM[d.kind] + d.k) }) });
};
PL.seterusnya = (r, kind) => {
  const d = plSeq(r, kind), ls = plLs(d.seq);
  return GEN_LQ('seterusnya', { ls, n: d.seq.length, ans: fmt(d.next), work: [d.desc + '.', `${fmt(d.seq[d.seq.length - 1])} ${PLSYM[d.kind]} ${d.k} = ${fmt(d.next)}`] }, { figAns: plRowFig(d.seq.concat([d.next]), { ops: d.seq.map(() => PLSYM[d.kind] + d.k), hi: [d.seq.length] }) });
};
PL.genap = (r, k) => {
  const jenis = (k == null ? r.f() < .5 : k % 2 === 0) ? 'genap' : 'ganjil';
  const a = r.i(11, 380), b = a + r.i(7, 11), list = [];
  for (let v = a + 1; v < b; v++) if ((v % 2 === 0) === (jenis === 'genap')) list.push(v);
  return GEN_LQ('genap', { jenis, a, b, ans: list.join(', '), work: [`Nombor ${jenis} ${jenis === 'genap' ? 'berakhir dengan 0, 2, 4, 6 atau 8' : 'berakhir dengan 1, 3, 5, 7 atau 9'}.`, `Pola: tambah 2 → ${list.join(', ')}`] });
};
PL.pilihGenap = (r, k) => {
  const jenis = (k == null ? r.f() < .5 : k % 2 === 0) ? 'genap' : 'ganjil';
  let nums, ok;
  do { nums = Array.from({ length: 6 }, () => r.i(10, 999)); ok = nums.filter(v => (v % 2 === 0) === (jenis === 'genap')); } while (ok.length < 2 || ok.length > 4 || new Set(nums).size < 6);
  return GEN_LQ('pilihGenap', { jenis, ls: nums.join(', '), ans: ok.join(', '), work: [`Semak digit terakhir setiap nombor.`, `Nombor ${jenis}: ${ok.join(', ')}`] });
};
PL.pascal = r => {
  const R = r.i(4, 7), rr = r.i(3, R), kk = r.i(1, rr - 1), P = plPascal(R), v = P[rr][kk], a = P[rr - 1][kk - 1], b = P[rr - 1][kk];
  return GEN_LQ('pascal', { wrongV: a * b === v ? a * b + 1 : a * b, ans: `${v}`, work: [`Nombor ? = hasil tambah dua nombor di atasnya.`, `? = ${a} + ${b} = ${v}`] }, { fig: plPascalFig(R, { hide: [rr, kk], hi: [[rr - 1, kk - 1], [rr - 1, kk]] }) });
};
PL.fibo = r => {
  const F = plFib(0, 1, 16), st = r.i(0, 7), len = 7, seg = F.slice(st, st + len);
  let i1 = r.i(2, len - 1), i2;
  do i2 = r.i(2, len - 1); while (i2 === i1 || Math.abs(i2 - i1) < 2);
  if (i1 > i2) [i1, i2] = [i2, i1];
  const shown = seg.map((v, i) => (i === i1 || i === i2 ? '___' : v));
  return GEN_LQ('fibo', { ls: plLs(shown), ans: `${seg[i1]} dan ${seg[i2]}`, work: ['Setiap nombor = hasil tambah dua nombor sebelumnya.', `${seg[i1 - 2]} + ${seg[i1 - 1]} = ${seg[i1]}`, `${seg[i2 - 2]} + ${seg[i2 - 1]} = ${seg[i2]}`] }, { figAns: plRowFig(seg, { hi: [i1, i2] }) });
};
PL.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
PL.polaObjek = (r, kind) => {
  kind = kind || r.p(['sq', 'tri', 'dL', 'dP', 'dSq', 'dTri']);
  const o = PLOBJ[kind], m = r.i(4, 6), c = [1, 2, 3, 4, 5, 6].map(n => plObjN(kind, n)), dif = c.slice(1).map((v, i) => v - c[i]);
  const constD = dif.every(x => x === dif[0]);
  const work = [`Bilangan ${o.unit}: ${c.slice(0, 3).join(', ')}, …`, constD ? `Pola: tambah ${dif[0]} kepada nombor sebelumnya.` : `Beza: ${dif.slice(0, 2).join(', ')}, … (beza bertambah ${dif[1] - dif[0]})`, `Teruskan: ${c.slice(0, m).join(', ')}`, `Rajah ${m} = ${c[m - 1]} ${o.unit}`];
  return GEN_LQ('polaObjek', { nama: o.nama, unit: o.unit, m, ans: `${c[m - 1]} ${o.unit}`, work }, { fig: plObjFig(kind) });
};
PL.pascalJum = r => {
  const R = r.i(5, 10), row = plPascal(R)[R], js = plSum(row);
  if (r.f() < .5) return GEN_LQ('pascalJum', { ls: `1, ${R}, …`, ans: `${js}`, work: [`Baris itu: ${row.join(', ')}`, `Jumlah = ${row.join(' + ')} = ${js}`, `(Jumlah baris didarab 2 setiap kali: 1, 2, 4, 8, …)`] });
  const pr = plPascal(R - 1)[R - 1];
  return GEN_LQ('pascalBaris', { row: pr.join(', '), ans: row.join(', '), work: ['Hujung baris = 1.', 'Nombor lain = hasil tambah dua nombor di atasnya: ' + pr.slice(1).map((v, i) => `${pr[i]} + ${v} = ${pr[i] + v}`).join(', ')] });
};
PL.polaBeza = r => {
  let a, d0, s, L;
  do { a = r.i(1, 20); d0 = r.i(1, 5); s = r.p([1, 2, 3]); L = Array.from({ length: 7 }, (_, i) => a + i * d0 + s * i * (i - 1) / 2); } while (L[2] === L[0] + L[1]);
  const show = L.slice(0, 5), dif = L.slice(1).map((v, i) => v - L[i]);
  return GEN_LQ('polaBeza', { ls: plLs(show), ans: `${L[5]} dan ${L[6]}`, work: [`Beza: ${dif.slice(0, 4).join(', ')} → beza bertambah ${s} setiap kali.`, `Beza seterusnya: ${dif[4]} dan ${dif[5]}`, `${L[4]} + ${dif[4]} = ${L[5]}, ${L[5]} + ${dif[5]} = ${L[6]}`] }, { fig: plRowFig(show.concat(['?', '?']), { blank: [5, 6] }) });
};
PL.k11 = r => {
  const a = r.i(1, 6), b = r.i(a + 1, a + 6), m = r.i(7, 9), FL = plFib(a, b, m);
  const o2 = 2 * r.i(5, 40) + 1, S = 3 * o2;
  const R = r.i(4, 7), PR = plPascal(R + 2);
  const c0 = 4, mm = r.i(8, 15), cl = plArit(4, 3, mm);
  const e1 = 2 * r.i(3, 30), E = 4 * e1 + 12;
  return GEN_LQ('k11', { a, b, m, val: FL[m - 1], list: FL.join(', '), S, o1: o2 - 2, o2, o3: o2 + 2, row: PR[R].join(', '), nx: PR[R + 1].join(', '), nx2: PR[R + 2].join(', '), js: plSum(PR[R + 2]), c0, m2: mm, val2: cl[mm - 1], lst: cl.join(', '), E, e1, e2: e1 + 2, e3: e1 + 4, e4: e1 + 6 });
};
/* ---------- 1.2 ---------- */
// data: jujukan (ya) atau set nombor tanpa pola tetap (tidak)
function plKenal(r, yes) {
  if (yes) { const d = plSeq(r, r.p(['add', 'sub', 'mul', 'div', 'add']), 5); return { seq: d.seq, yes, d }; }
  let seq, ok;
  do {
    const a = r.i(1, 30), k = r.i(2, 9), j = r.i(1, 3), e = r.n(-3, 3);
    seq = plArit(a, k, 5); seq[j] += e;
    const df = seq.slice(1).map((v, i) => v - seq[i]), d2 = df.slice(1).map((v, i) => v - df[i]);
    const ratio = seq.slice(1).every((v, i) => v * seq[0] === seq[1] * seq[i]);
    ok = !df.every(x => x === df[0]) && !d2.every(x => x === d2[0]) && !ratio && seq.every(v => v > 0) && !(seq[2] === seq[0] + seq[1] && seq[3] === seq[1] + seq[2]);
  } while (!ok);
  return { seq, yes };
}
PL.kenalJuj = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  const K = plKenal(r, yes), seq = K.seq;
  let ans, work;
  if (yes) { ans = `Ya, jujukan. Pola: ${K.d.desc.toLowerCase()}`; work = plOpW(K.d).concat(['Semua sebutan mengikut pola yang sama.']); }
  else {
    const df = seq.slice(1).map((v, i) => v - seq[i]);
    ans = 'Bukan jujukan, kerana tiada pola yang tetap';
    work = [`Beza: ${df.map(fmt).join(', ')} – tidak sama.`, 'Tiada pola tambah, tolak, darab atau bahagi yang tetap.'];
  }
  return GEN_LQ('kenalJuj', { ls: plLs(seq), isSeq: yes, ans, work });
};
PL.lengkap = (r, kind) => {
  kind = kind || r.p(['add', 'sub', 'mul', 'div']);
  const geo = kind === 'mul' || kind === 'div', d = plSeq(r, kind, geo ? 5 : 6), seq = d.seq.concat([d.next]).slice(0, geo ? 5 : 6);
  const [b1, b2] = r.p(geo ? [[2, 4], [3, 4], [1, 4]] : [[2, 5], [1, 4], [2, 4], [3, 5]]), len = seq.length;
  const show = seq.map((v, i) => (i === b1 || i === b2 ? '___' : v));
  return GEN_LQ('lengkap', { ls: plLs(show, false), ans: `${fmt(seq[b1])} dan ${fmt(seq[b2])}`, work: [`Pola: ${d.desc.toLowerCase()}.`, `${fmt(seq[b1 - 1])} ${PLSYM[d.kind]} ${d.k} = ${fmt(seq[b1])}`, `${fmt(seq[b2 - 1])} ${PLSYM[d.kind]} ${d.k} = ${fmt(seq[b2])}`] }, { fig: plRowFig(seq.map((v, i) => (i === b1 || i === b2 ? '?' : v)), { blank: [b1, b2] }), figAns: plRowFig(seq, { hi: [b1, b2], ops: seq.slice(1).map(() => PLSYM[d.kind] + d.k) }) });
};
PL.perkataan = (r, kind) => {
  const d = plSeq(r, kind, 5, true), ls = plLs(d.seq);
  return GEN_LQ('perkataan', { ls, wrong: plWrongDesc(d), ans: d.desc, work: plOpW(d).concat([d.desc + '.']) }, { figAns: plRowFig(d.seq, { ops: d.seq.slice(1).map(() => PLSYM[d.kind] + d.k) }) });
};
PL.duaLagi = (r, kind) => {
  const d = plSeq(r, kind || r.p(['add', 'sub', 'add', 'mul']), 4, true);
  const n2 = d.kind === 'add' ? d.next + d.k : d.kind === 'sub' ? d.next - d.k : d.kind === 'mul' ? d.next * d.k : d.next / d.k;
  const ans = `${fmt(d.next)} dan ${fmt(n2)}`, last = d.seq[d.seq.length - 1];
  const v = vq('duaLagi', { ls: plLs(d.seq), d1: fmt(d.next), d2: fmt(n2 + (d.kind === 'mul' ? d.k : d.kind === 'sub' ? -1 : 1)) });
  const work = [`Pola: ${d.desc.toLowerCase()}.`, `${fmt(last)} ${PLSYM[d.kind]} ${d.k} = ${fmt(d.next)}`, `${fmt(d.next)} ${PLSYM[d.kind]} ${d.k} = ${fmt(n2)}`];
  const isN = v.q.includes('Adakah');
  return { q: v.q, ans: isN ? `Tidak betul. Jawapan yang betul: ${ans}` : ans, work, figAns: plRowFig(d.seq.concat([d.next, n2]), { hi: [d.seq.length, d.seq.length + 1], ops: d.seq.concat([d.next]).map(() => PLSYM[d.kind] + d.k) }) };
};
PL.lengkapTengah = r => {
  let a, d; do { a = r.i(-10, 40); d = r.n(-9, 12); } while (Math.abs(d) < 2 || a + 4 * d < -20);
  const s = plArit(a, d, 5), show = s.map((v, i) => (i % 2 ? '___' : v));
  const op = d > 0 ? PLOP.add(d) : PLOP.sub(-d);
  return GEN_LQ('lengkapTengah', { ls: plLs(show, false), ans: `${fmt(s[1])} dan ${fmt(s[3])}; ${op.toLowerCase()}`, work: [`Dari ${fmt(s[0])} ke ${fmt(s[2])} ada 2 langkah: (${fmt(s[2])} − ${par(s[0])}) ÷ 2 = ${fmt(d)}`, `${fmt(s[0])} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${fmt(s[1])}, ${fmt(s[2])} ${d > 0 ? '+' : '−'} ${Math.abs(d)} = ${fmt(s[3])}`, `Pola: ${op.toLowerCase()}.`] }, { fig: plRowFig(s.map((v, i) => (i % 2 ? '?' : v)), { blank: [1, 3] }) });
};
PL.jujObjek = (r, kind) => {
  kind = kind || r.p(['sq', 'tri', 'dL', 'dP']);
  const o = PLOBJ[kind], c = [1, 2, 3, 4].map(n => plObjN(kind, n));
  return GEN_LQ('jujObjek', { nama: o.nama, unit: o.unit, ans: `${c.join(', ')}; ${PLOP.add(o.a).toLowerCase()}`, work: [`Kira: Rajah 1 = ${c[0]}, Rajah 2 = ${c[1]}, Rajah 3 = ${c[2]}.`, `Beza = ${o.a}, maka Rajah 4 = ${c[2]} + ${o.a} = ${c[3]}.`, `Pola: ${PLOP.add(o.a).toLowerCase()}.`] }, { fig: plObjFig(kind) });
};
PL.k12 = r => {
  const a = r.i(2, 30), d = r.i(2, 15), x = a + d, y = a + 2 * d, b = a + 3 * d;
  const H = r.p([64, 128, 96, 160, 192, 320, 256]), k = r.i(3, 5), hs = plGeom(H, .5, k + 1);
  const ok = Number.isInteger(hs[k]) ? k : 3;
  const N = r.p(PLNAMA2), s0 = r.i(5, 20), dd = r.i(2, 6), w = r.i(6, 12), sv_ = plArit(s0, dd, w);
  const rr = r.p([2, 3]), a0 = r.i(1, rr === 2 ? 6 : 3), b2 = a0 * rr, c = b2 * rr;
  return GEN_LQ('k12', { a, b, x, y, d, H, k: ok, v: hs[ok], lst: plGeom(H, .5, ok + 1).map(v => `${v}`).join(' → '), N, s0, d2: dd, X: sv_[w - 1], w, lst2: sv_.map(v => `RM${v}`).join(', '), a0, r: rr, c, b2 });
};
/* ---------- 1.3 ---------- */
const plAB = (r, neg) => {
  let a, b;
  do { a = neg && r.f() < .25 ? -r.i(2, 6) : r.i(2, 9); b = a < 0 ? r.i(40, 90) : r.i(-9, 12); } while (a + b === 0 || (a < 0 && a * 12 + b < -20));
  return [a, b];
};
PL.sebutTn = r => {
  const [a, b] = plAB(r, true), k = r.i(a < 0 ? 6 : 8, a < 0 ? 15 : 40), v = a * k + b;
  const wrongV = a * k + b + (r.f() < .5 ? a : -a);
  return GEN_LQ('sebutTn', { e: plTn(a, b), k, wrongV: fmt(wrongV), ans: fmt(v), work: [`Ganti n = ${k}.`, `${plT(k)} = ${plGanti(a, b, k)}`, `= ${fmt(v)}`] });
};
PL.nyata = r => {
  const d = plSeq(r, r.p(['add', 'sub', 'mul']), 5), k1 = r.i(1, 3), k2 = r.i(k1 + 1, d.seq.length);
  return GEN_LQ('nyata', { ls: plLs(d.seq), k1, k2, ans: `${plT(k1)} = ${fmt(d.seq[k1 - 1])}, ${plT(k2)} = ${fmt(d.seq[k2 - 1])}`, work: [`T₁ ialah sebutan pertama, T₂ sebutan kedua, dan seterusnya.`, `${plT(k1)} = sebutan ke-${k1} = ${fmt(d.seq[k1 - 1])}`, `${plT(k2)} = sebutan ke-${k2} = ${fmt(d.seq[k2 - 1])}`] }, { fig: plRowFig(d.seq, { subs: d.seq.map((_, i) => plT(i + 1)) }) });
};
PL.cariTn = r => {
  const [a, b] = plAB(r, true), s = [1, 2, 3, 4].map(n => a * n + b);
  const wrongE = r.f() < .5 ? plTn(a, 0) : plTn(a, s[0]);
  return GEN_LQ('cariTn', { ls: plLs(s), wrongE, ans: plTn(a, b), work: [`Beza sepunya = ${fmt(s[1])} − ${par(s[0])} = ${fmt(a)}, maka ada ${plTnE(a, 0)}.`, `Bandingkan: ${plTnE(a, 0)} = ${[1, 2, 3, 4].map(n => fmt(a * n)).join(', ')}; Tₙ − (${plTnE(a, 0)}) = ${fmt(b)}`, plTn(a, b), `Semak: T₁ = ${plGanti(a, b, 1)} = ${fmt(s[0])} ✓`] });
};
PL.tulis4 = r => {
  const [a, b] = plAB(r, true), s = [1, 2, 3, 4].map(n => a * n + b);
  return GEN_LQ('tulis4', { e: plTn(a, b), ans: s.map(fmt).join(', '), work: [1, 2, 3, 4].map(n => `${plT(n)} = ${plGanti(a, b, n)} = ${fmt(s[n - 1])}`) });
};
PL.cariN = r => {
  const [a, b] = plAB(r, false), n = r.i(6, 45), v = a * n + b, s = [1, 2, 3, 4].map(k => a * k + b);
  return GEN_LQ('cariN', { e: plTn(a, b), v, ls: plLs(s), ans: `n = ${n} (sebutan ke-${n})`, work: [`Tₙ = ${plTnE(a, b)}`, `${plTnE(a, b)} = ${fmt(v)}`, `${fmt(a)}n = ${fmt(v - b)}`, `n = ${fmt(v - b)} ÷ ${a} = ${n}`] });
};
PL.adakah = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  const [a, b] = plAB(r, false), n = r.i(8, 40), v = yes ? a * n + b : a * n + b + r.i(1, a - 1), s = [1, 2, 3, 4].map(k => a * k + b);
  const q = (v - b) / a, qs = Number.isInteger(q) ? `${q}` : `${Math.round(q * 100) / 100}`;
  return GEN_LQ('adakah', { e: plTn(a, b), v, ls: plLs(s), ans: yes ? `Ya, ${fmt(v)} ialah sebutan ke-${n}` : `Bukan, kerana n bukan nombor bulat`, work: [`${plTnE(a, b)} = ${fmt(v)}`, `${fmt(a)}n = ${fmt(v - b)}`, `n = ${fmt(v - b)} ÷ ${a} = ${Number.isInteger(q) ? qs : `${qs}…`}`, yes ? 'n ialah nombor bulat positif, maka ya.' : 'n bukan nombor bulat, maka bukan sebutan.'] });
};
PL.tnObjek = (r, kind) => {
  kind = kind || r.p(['sq', 'tri', 'dL', 'dP']);
  const o = PLOBJ[kind], c = [1, 2, 3].map(n => plObjN(kind, n)), m = r.i(10, 30);
  const v = vq('tnObjek', { nama: o.nama, unit: o.unit, m });
  const withM = v.q.includes(`Rajah ${m}`);
  const work = [`Jujukan: ${c.join(', ')}, … → beza ${o.a}`, `${plTnE(o.a, 0)}: ${[1, 2, 3].map(n => o.a * n).join(', ')} → ${o.b > 0 ? 'tambah' : 'tolak'} ${Math.abs(o.b)}`, plTn(o.a, o.b)].concat(withM ? [`${plT(m)} = ${plGanti(o.a, o.b, m)} = ${o.a * m + o.b}`] : []);
  return { q: v.q, ans: plTn(o.a, o.b) + (withM ? `; Rajah ${m}: ${o.a * m + o.b} ${o.unit}` : ''), work, fig: plObjFig(kind) };
};
PL.k13 = r => {
  const c1 = r.i(8, 20), d = r.i(2, 5), k = r.i(12, 30), nX = r.i(6, 25);
  let a, b, c, e, n; do { a = r.i(2, 6); c = r.i(a + 1, a + 5); n = r.i(3, 12); b = r.i(-5, 15); e = b + (a - c) * n; } while (e === 0 || Math.abs(e) > 60);
  const nmax = r.i(10, 40), sisa = r.i(0, 2), M = 3 * nmax + 1 + sisa;
  const f = r.i(4, 10), h = r.i(2, 5), jam = r.i(4, 9), jB = r.i(3, 10);
  return GEN_LQ('k13', { c1, d, k, ck: c1 + d * (k - 1), X: c1 + d * (nX - 1), nX, a, b, c, e, n, v: a * n + b, M, nmax, sisa, f, h, jam, kos: f + h * (jam - 1), B: f + h * (jB - 1), jB });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '1.1': {
    m: [() => PL.huraiPola(plRG), () => PL.seterusnya(plRG), () => PL.genap(plRG), () => PL.pilihGenap(plRG), () => PL.pascal(plRG), () => PL.fibo(plRG), () => PL.bs(plRG, PLBS1)],
    s: [() => PL.polaObjek(plRG), () => PL.pascalJum(plRG), () => PL.polaBeza(plRG)],
    k: [() => PL.k11(plRG)]
  },
  '1.2': {
    m: [() => PL.kenalJuj(plRG), () => PL.lengkap(plRG), () => PL.perkataan(plRG), () => PL.duaLagi(plRG), () => PL.bs(plRG, PLBS2)],
    s: [() => PL.lengkapTengah(plRG), () => PL.jujObjek(plRG), () => PL.lengkap(plRG, 'mul')],
    k: [() => PL.k12(plRG)]
  },
  '1.3': {
    m: [() => PL.sebutTn(plRG), () => PL.nyata(plRG), () => PL.cariTn(plRG), () => PL.tulis4(plRG)],
    s: [() => PL.cariN(plRG), () => PL.adakah(plRG), () => PL.tnObjek(plRG)],
    k: [() => PL.k13(plRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
const PLK4 = ['add', 'sub', 'mul', 'div'];
// 1.1
WG.huraiPola = i => PL.huraiPola(plRW, PLK4[i % 4]);
WG.seterusnya = i => PL.seterusnya(plRW, PLK4[(i + 1) % 4]);
WG.genap = i => PL.genap(plRW, i);
WG.pilihGenap = i => PL.pilihGenap(plRW, i + 1);
WG.pascal = () => PL.pascal(plRW);
WG.fibo = () => PL.fibo(plRW);
WG.bs1 = i => PL.bs(plRW, PLBS1, [0, 3, 5, 6][i % 4] + wri(0, 1));
WG.polaObjek = i => PL.polaObjek(plRW, ['sq', 'tri', 'dL', 'dP', 'dSq', 'dTri'][i % 6]);
WG.pascalJum = () => PL.pascalJum(plRW);
WG.polaBeza = () => PL.polaBeza(plRW);
WG.k11 = () => PL.k11(plRW);
// 1.2
WG.kenalJuj = i => PL.kenalJuj(plRW, i % 2 === 0);
WG.lengkap = i => PL.lengkap(plRW, PLK4[i % 4]);
WG.perkataan = i => PL.perkataan(plRW, PLK4[(i + 2) % 4]);
WG.duaLagi = i => PL.duaLagi(plRW, ['add', 'sub', 'mul'][i % 3]);
WG.bs2 = i => PL.bs(plRW, PLBS2, [1, 3, 5][i % 3] + wri(0, 1) * [1, 1, 2][i % 3]);
WG.lengkapTengah = () => PL.lengkapTengah(plRW);
WG.jujObjek = i => PL.jujObjek(plRW, ['sq', 'tri', 'dL', 'dP'][i % 4]);
WG.k12 = () => PL.k12(plRW);
// 1.3
WG.sebutTn = () => PL.sebutTn(plRW);
WG.nyata = () => PL.nyata(plRW);
WG.cariTn = () => PL.cariTn(plRW);
WG.tulis4 = () => PL.tulis4(plRW);
WG.cariN = () => PL.cariN(plRW);
WG.adakah = i => PL.adakah(plRW, i % 2 === 0);
WG.tnObjek = i => PL.tnObjek(plRW, ['sq', 'tri', 'dL', 'dP'][i % 4]);
WG.k13 = () => PL.k13(plRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '1.1': [['m', 'huraiPola', 4], ['m', 'seterusnya', 4], ['m', 'genap', 2], ['m', 'pilihGenap', 2], ['m', 'pascal', 3], ['m', 'fibo', 2], ['m', 'bs1', 1], ['s', 'polaObjek', 4], ['s', 'pascalJum', 3], ['s', 'polaBeza', 2], ['k', 'k11', 3]],
  '1.2': [['m', 'kenalJuj', 4], ['m', 'lengkap', 4], ['m', 'perkataan', 4], ['m', 'duaLagi', 4], ['m', 'bs2', 2], ['s', 'lengkapTengah', 3], ['s', 'jujObjek', 4], ['s', 'lengkap', 2], ['k', 'k12', 3]],
  '1.3': [['m', 'sebutTn', 5], ['m', 'nyata', 4], ['m', 'cariTn', 5], ['m', 'tulis4', 4], ['s', 'cariN', 3], ['s', 'adakah', 3], ['s', 'tnObjek', 3], ['k', 'k13', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function plOptsN(ans, cands, f) {
  f = f || fmt;
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!Number.isInteger(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const s = f(ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2)); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function plOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const plMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const CQGEN = {
  pola: [
    () => { const d = plSeq(plRG, pick(['add', 'sub'])); return plMcq(`Apakah nombor seterusnya?`, plRowFig(d.seq.concat(['?']), { blank: [d.seq.length] }), plOptsN(d.next, [d.next + 1, d.next - 1, d.seq[d.seq.length - 1] + (d.kind === 'add' ? -d.k : d.k), d.next + d.k, d.next - d.k])); },
    () => { const d = plSeq(plRG), opts = [PLOP.add, PLOP.sub, PLOP.mul, PLOP.div].map(f => f(d.k)); if (d.kind === 'mul') opts.push(PLOP.add(d.seq[1] - d.seq[0])); return plMcq('Apakah pola senarai nombor ini?', plRowFig(d.seq.concat(['…'])), plOptsT(d.desc, opts.concat([PLOP.add(d.k + 1), PLOP.sub(d.k + 1)]))); },
    () => { let a, d0, s, L; do { a = ri(1, 20); d0 = ri(1, 5); s = pick([1, 2, 3]); L = Array.from({ length: 6 }, (_, i) => a + i * d0 + s * i * (i - 1) / 2); } while (L[2] === L[0] + L[1]); const v = L[5], dl = L[4] - L[3]; return plMcq('Beza antara nombor bertambah. Apakah nombor seterusnya?', plRowFig(L.slice(0, 5).concat(['?']), { blank: [5] }), plOptsN(v, [L[4] + dl, v + s, v - s, L[4] + d0, v + 1])); }
  ],
  istimewa: [
    () => { const jenis = Math.random() < .5 ? 'genap' : 'ganjil', want = jenis === 'genap' ? 0 : 1; let ns; do { ns = [ri(10, 99), ri(100, 999), ri(10, 999), ri(10, 999)]; } while (ns.filter(v => v % 2 === want).length !== 1 || new Set(ns).size < 4); const A = ns.find(v => v % 2 === want); return plMcq(`Yang manakah nombor <b>${jenis}</b>?`, plRowFig(shuffle(ns)), plOptsT(`${A}`, ns.map(String))); },
    () => { const R = ri(4, 6), rr = ri(3, R), kk = ri(1, rr - 1), P = plPascal(R), v = P[rr][kk], a = P[rr - 1][kk - 1], b = P[rr - 1][kk]; return plMcq('Segi tiga Pascal: apakah nombor ?', plPascalFig(R, { hide: [rr, kk] }), plOptsN(v, [a * b, v + 1, v - 1, a + b + 1, Math.max(a, b)])); },
    () => { if (Math.random() < .5) { const F = plFib(0, 1, 14), i = ri(5, 13), seg = F.slice(i - 5, i); return plMcq('Nombor Fibonacci seterusnya ialah …', plRowFig(seg.concat(['?']), { blank: [5] }), plOptsN(F[i], [F[i] + 1, F[i] - 1, seg[4] * 2, seg[4] + seg[2], F[i + 1]])); } const R = ri(5, 9), row = plPascal(R)[R]; return plMcq(`Jumlah semua nombor dalam baris segi tiga Pascal yang bermula 1, ${R}, … ialah`, plRowFig([1, R, '…']), plOptsN(Math.pow(2, R), [Math.pow(2, R - 1), Math.pow(2, R + 1), R * R, 2 * R, plSum(row) + 2])); }
  ],
  jujukan: [
    () => { const d = plSeq(plRG, pick(['add', 'sub', 'mul'])), i = ri(1, d.seq.length - 2), v = d.seq[i]; return plMcq('Lengkapkan jujukan ini.', plRowFig(d.seq.map((x, j) => (j === i ? '?' : x)), { blank: [i] }), plOptsN(v, [v + 1, v - 1, v + d.k, v - d.k, d.seq[i - 1] + 1])); },
    () => { const K = plKenal(plRG, Math.random() < .5); return plMcq('Adakah set nombor ini satu jujukan?', plRowFig(K.seq), plOptsT(K.yes ? 'Ya, ada pola tetap' : 'Bukan, tiada pola tetap', ['Ya, ada pola tetap', 'Bukan, tiada pola tetap', 'Ya, kerana semua nombor positif', 'Bukan, kerana nombornya besar'])); },
    () => { let a, d; do { a = ri(-10, 40); d = nz(-9, 12); } while (Math.abs(d) < 2); const s = plArit(a, d, 5); return plMcq('Cari nombor yang diwakili oleh ?.', plRowFig([s[0], '…', s[2], '?', s[4]], { blank: [3] }), plOptsN(s[3], [s[3] + d, s[3] - d, s[3] + 1, (s[2] + s[4]) / 2 + 1, s[4] + d])); }
  ],
  sebutan: [
    () => { const [a, b] = plAB(plRG, false), k = ri(5, 20), v = a * k + b; return plMcq(`Diberi ${plTn(a, b)}. Cari ${plT(k)}.`, plRowFig([1, 2, 3].map(n => a * n + b).concat(['…']), { subs: ['T₁', 'T₂', 'T₃', ''] }), plOptsN(v, [a * k, v + a, v - a, a + b + k, k * (a + b)])); },
    () => { const [a, b] = plAB(plRG, true), s = [1, 2, 3, 4].map(n => a * n + b), A = plTn(a, b); return plMcq('Apakah sebutan ke-n bagi jujukan ini?', plRowFig(s.concat(['…'])), plOptsT(A, [plTn(a, 0), plTn(a, s[0]), plTn(a, b + (b > 0 ? -2 : 2)), a + 1 !== 0 ? plTn(a + 1, b - 1) : plTn(a, b + 3), plTn(-a, b)].filter(x => x !== A))); },
    () => { const [a, b] = plAB(plRG, false), n = ri(6, 30), v = a * n + b; return plMcq(`Diberi ${plTn(a, b)}. Sebutan keberapakah bernilai ${fmt(v)}?`, plRowFig([1, 2, 3].map(k => a * k + b).concat(['…', v]), { hi: [4] }), plOptsN(n, [n + 1, n - 1, Math.round(v / a), n + 2], x => `ke-${x}`)); }
  ]
};
const CQT = { pola: 'Pola nombor', istimewa: 'Genap, ganjil, Pascal & Fibonacci', jujukan: 'Jujukan', sebutan: 'Sebutan ke-n' };
function plCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.pola;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['pola', 'pola', 'istimewa', 'jujukan', 'sebutan'] : Object.keys(CQT);
  return plCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return plCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
