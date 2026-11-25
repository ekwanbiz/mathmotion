'use strict';
/* =================== BERSKALA · SOALAN BAB 4 LUKISAN BERSKALA (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "bs" / "BS" supaya tidak bertembung dengan teras.

/* =================== pembantu nombor =================== */
/* =================== pecahan bertingkat & punca (25 Nov) =================== */
// bsBt: teks soalan → a/b, ½ … menjadi pecahan bertingkat fr(); √x, √(..), ∛x menjadi rt() bergaris atas.
// Unit (km/j, m/s, RM/kg …) dan perkataan (dan/atau) tidak diubah. Rajah (fig) tidak disentuh.
const BSBTG = { '½': [1, 2], '⅓': [1, 3], '⅔': [2, 3], '¼': [1, 4], '¾': [3, 4], '⅕': [1, 5], '⅖': [2, 5], '⅗': [3, 5], '⅘': [4, 5], '⅙': [1, 6], '⅚': [5, 6], '⅛': [1, 8], '⅜': [3, 8], '⅝': [5, 8], '⅞': [7, 8] };
const BSBTAT = String.raw`(?:\d+(?:\.\d+)?|[A-Za-zθαβ]|\((?:[^()]|\([^()]*\))*\)|\u0004[^\u0006]*\u0006|\u0001[^\u0003]*\u0003)[²³]?`;
const BSBTRE = new RegExp(String.raw`(?<![\w.>\u0003\u0006])((?:${BSBTAT})+)( ?)\/\2((?:${BSBTAT})+)(?![\w]|\.\d)`);
const BSBTUN = /^(?:km|m|cm|mm|RM|kg|g|l|ml|sen|kWj|unit|orang|liter)$/, BSBTUD = /^(?:j|jam|s|min|saat|minit|hari|kg|g|m|m²|m³|cm|cm²|cm³|km|l|L|unit|liter|kWj|minggu|bulan|tahun|orang|kotak)$/;
const bsBtP = x => (/^\((?:[^()]|\([^()]*\))*\)$/.test(x) ? x.slice(1, -1) : x);
function bsBtTok(s) {
  s = s.replace(/[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g, c => '\u0001' + BSBTG[c][0] + '\u0002' + BSBTG[c][1] + '\u0003');
  s = s.replace(/([√∛∜])(\((?:[^()]|\([^()]*\))*\)|\d+(?:\.\d+)?|[A-Za-zθ](?![A-Za-z]))/g, (m, r, x) => '\u0004' + ({ '∛': 3, '∜': 4 }[r] || '') + '\u0005' + bsBtP(x) + '\u0006');
  let k = 0, m, skip = '';
  while (k++ < 30 && (m = s.match(BSBTRE))) {
    const a = m[1], b = m[3];
    if ((/^[A-Za-z]{3,}$/.test(a) && /^[A-Za-z]{3,}$/.test(b)) || (BSBTUN.test(a) && BSBTUD.test(b)) || (/^[A-Za-z]{2,}$/.test(a) || /^RM/.test(a)) && BSBTUD.test(b)) {
      skip += s.slice(0, m.index + m[0].length).replace(/\//g, '\u0007'); s = s.slice(m.index + m[0].length); continue;
    }
    s = s.slice(0, m.index) + '\u0001' + bsBtP(a) + '\u0002' + bsBtP(b) + '\u0003' + s.slice(m.index + m[0].length);
  }
  return (skip + s).replace(/\u0007/g, '/');
}
function bsBt(s) {
  if (typeof s !== 'string' || !/[\/½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞√∛∜]/.test(s)) return s;
  s = bsBtTok(s);
  for (let k = 0; k < 12 && /[\u0001\u0004]/.test(s); k++)
    s = s.replace(/\u0001([^\u0001-\u0006]*)\u0002([^\u0001-\u0006]*)\u0003/g, (m, a, b) => fr(a, b))
      .replace(/\u0004([^\u0001-\u0006]*)\u0005([^\u0001-\u0006]*)\u0006/g, (m, n, x) => rt(x, n));
  return s;
}
// bsBtSvg: teks rajah SVG dengan pecahan bertingkat & punca; y = garis tengah, st = gaya isi (cth 'style="fill:var(--tx)"')
function bsBtTree(s) {
  let i = 0;
  const run = stop => {
    const out = []; let buf = '';
    const fl = () => { if (buf) out.push({ t: 's', v: buf }); buf = ''; };
    while (i < s.length) {
      const c = s[i];
      if (stop.includes(c)) break;
      if (c === '\u0001') { fl(); i++; const a = run('\u0002'); i++; const b = run('\u0003'); i++; out.push({ t: 'f', a, b }); }
      else if (c === '\u0004') { fl(); i++; const n = run('\u0005'); i++; const k = run('\u0006'); i++; out.push({ t: 'r', n, k }); }
      else { buf += c; i++; }
    }
    fl(); return out;
  };
  return run('');
}
const bsBtCW = ch => (ch === ' ' ? .27 : /[()[\].,:;'|]/.test(ch) ? .34 : ch === '1' ? .5 : /\d/.test(ch) ? .6 : /[mwMW]/.test(ch) ? .86 : /[−+=×÷<>≤≥]/.test(ch) ? .64 : /[ijlrtf]/.test(ch) ? .32 : /[A-Z]/.test(ch) ? .68 : ch === '°' ? .4 : .57);
function bsBtMeas(L, z) {
  let w = 0, up = z * .5, dn = z * .5;
  L.forEach(n => {
    if (n.t === 's') n.w = [...n.v].reduce((a, ch) => a + z * bsBtCW(ch), 0);
    else if (n.t === 'f') { const z2 = z * .8, A = bsBtMeas(n.a, z2), B = bsBtMeas(n.b, z2); n.A = A; n.B = B; n.w = Math.max(A.w, B.w) + z * .24; up = Math.max(up, A.up + A.dn + z * .12); dn = Math.max(dn, B.up + B.dn + z * .12); }
    else { const K = bsBtMeas(n.k, z), N = bsBtMeas(n.n, z * .5); n.K = K; n.ix = n.n.length ? Math.max(0, N.w - z * .25) : 0; n.w = K.w + z * .76 + n.ix; up = Math.max(up, K.up + z * .14); }
    w += n.w;
  });
  return { w, up, dn };
}
function bsBtDraw(L, x, y, z, st, fw) {
  let o = '';
  const r = v => +v.toFixed(1), col = (st.match(/var\(--[\w-]+\)|#[0-9a-fA-F]{3,8}/) || ['currentColor'])[0];
  L.forEach(n => {
    if (n.t === 's') o += `<text x="${r(x)}" y="${r(y)}" ${st} font-size="${r(z)}" font-weight="${fw}" dominant-baseline="central">${n.v.replace(/ /g, ' ')}</text>`;
    else if (n.t === 'f') {
      o += bsBtDraw(n.a, x + (n.w - n.A.w) / 2, y - z * .12 - n.A.dn, z * .8, st, fw) + bsBtDraw(n.b, x + (n.w - n.B.w) / 2, y + z * .12 + n.B.up, z * .8, st, fw);
      o += `<line x1="${r(x + z * .06)}" y1="${r(y)}" x2="${r(x + n.w - z * .06)}" y2="${r(y)}" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 14))}"/>`;
    } else {
      const x0 = x + n.ix, rw = z * .62, top = y - n.K.up - z * .1;
      if (n.n.length) o += bsBtDraw(n.n, x, y - z * .38, z * .5, st, fw);
      o += `<path d="M${r(x0)} ${r(y + z * .05)} L${r(x0 + rw * .3)} ${r(y - z * .05)} L${r(x0 + rw * .6)} ${r(y + z * .5)} L${r(x0 + rw)} ${r(top)} L${r(x + n.w)} ${r(top)}" fill="none" style="stroke:${col}" stroke-width="${r(Math.max(1.3, z / 13))}" stroke-linejoin="round"/>`;
      o += bsBtDraw(n.k, x0 + rw + z * .06, y, z, st, fw);
    }
    x += n.w;
  });
  return o;
}
const bsBtW = (t, z) => bsBtMeas(bsBtTree(bsBtTok(String(t))), z).w;
function bsBtSvg(x, y, t, st, z, anchor = 'middle', fw = 700) {
  const L = bsBtTree(bsBtTok(String(t))), m = bsBtMeas(L, z), x0 = anchor === 'start' ? x : anchor === 'end' ? x - m.w : x - m.w / 2;
  return `<g>${bsBtDraw(L, x0, y, z, st, fw)}</g>`;
}
function bsBtO(o) {
  if (typeof o === 'string') return bsBt(o);
  if (Array.isArray(o)) return o.map(bsBtO);
  if (o && typeof o === 'object') for (const k in o) if (!/fig|svg|img|^type$|^id$|^key$/i.test(k)) o[k] = bsBtO(o[k]);
  return o;
}

const bsGcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
// nombor kemas: bundar 4 t.p., tiada −0, ribuan dipisah ruang (≥ 10 000)
const bsN = x => {
  let r = Math.round(x * 10000) / 10000; if (Object.is(r, -0) || Math.abs(r) < 1e-12) r = 0;
  let s = String(Math.abs(r));
  if (Number.isInteger(r) && Math.abs(r) >= 10000) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (r < 0 ? '−' : '') + s;
};
// pecahan a/b termudah (b > 0)
const bsFr = (a, b) => { const g = bsGcd(a, b) || 1; a /= g; b /= g; return b === 1 ? bsN(a) : `${a}/${b}`; };
// skala 1 : n, n = a/b (rasional)
const bsSk = (a, b = 1) => `1 : ${bsFr(a, b)}`;
const bsCm = x => `${bsN(x)} cm`, bsM = x => `${bsN(x)} m`, bsKm = x => `${bsN(x)} km`;
const bsM2 = x => `${bsN(x)} m²`, bsCm2 = x => `${bsN(x)} cm²`;
const bsRM = x => `RM${bsN(x).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}`;
// cm sebenar → teks unit sesuai
const bsReal = cm => (cm >= 100000 ? `${bsN(cm)} cm = ${bsN(cm / 100)} m = ${bsN(cm / 100000)} km` : cm >= 100 ? `${bsN(cm)} cm = ${bsN(cm / 100)} m` : `${bsN(cm)} cm`);
const bsTidy = (x, dp = 2) => Math.abs(x * 10 ** dp - Math.round(x * 10 ** dp)) < 1e-9;
// rawak: bsRG untuk Latihan Kelas / games, bsRW (berbenih) untuk Lembaran Kerja
const bsRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const bsRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const bsShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* =================== data bersama =================== */
// bentuk asas pada grid (unit petak, y ke bawah)
const BSHAPE = [
  { n: 'segi empat tepat', p: [[0, 0], [3, 0], [3, 2], [0, 2]] },
  { n: 'L', p: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]] },
  { n: 'segi tiga bersudut tegak', p: [[0, 0], [0, 2], [3, 2]] },
  { n: 'rumah', p: [[1, 0], [2, 1], [2, 3], [0, 3], [0, 1]] },
  { n: 'T', p: [[0, 0], [3, 0], [3, 1], [2, 1], [2, 2], [1, 2], [1, 1], [0, 1]] },
  { n: 'trapezium', p: [[1, 0], [2, 0], [3, 2], [0, 2]] },
  { n: 'pentagon', p: [[0, 0], [2, 0], [3, 1], [2, 2], [0, 2]] },
  { n: 'L', p: [[0, 0], [1, 0], [1, 1], [3, 1], [3, 2], [0, 2]] }
];
const BSOBJ = ['sebuah buku', 'sekeping jubin', 'sebuah bingkai gambar', 'sebuah kotak', 'sekeping papan lukis', 'sebuah dulang', 'sekeping kad ucapan', 'sebuah beg'];
const bsPj = ob => (ob === 'daun' ? 'sehelai' : ob === 'kancing baju' ? 'sebiji' : 'seekor');
const bsBare = s => s.replace(/^(sebuah|sekeping|sehelai|seekor|sebiji|sebatang) /, '');
const BSLUAS_S = ['kolam ikan', 'bilik stor', 'pentas', 'petak semaian', 'kotak pasir'];
const BSLUAS = ['padang', 'tapak rumah', 'kolam ikan', 'dewan', 'taman permainan', 'tempat letak kereta', 'gelanggang', 'kebun sayur'];
const BSBILIK = ['bilik tidur', 'ruang tamu', 'dapur', 'bilik belajar', 'bilik stor', 'surau', 'makmal', 'pejabat'];
const BSTEMPAT = [['Kampung Baru', 'Pekan Lama'], ['Bandar A', 'Bandar B'], ['Taman Seri', 'Bukit Indah'], ['Kuala Hijau', 'Sungai Biru'], ['Pekan P', 'Pekan Q'], ['Jeti', 'Air Terjun']];
const BSKECIL = [['semut', 'panjang'], ['kumbang', 'panjang'], ['daun', 'lebar'], ['lebah', 'panjang'], ['kancing baju', 'diameter'], ['nyamuk', 'panjang']];
const BSBS1 = [
  ['Lukisan berskala mempunyai bentuk yang sama dengan objek sebenar.', true, 'Lukisan berskala hanya mengubah saiz, bukan bentuk.'],
  ['Lukisan berskala sentiasa lebih kecil daripada objek sebenar.', false, 'Lukisan berskala boleh dikecilkan, dibesarkan atau sama saiz dengan objek.'],
  ['Jika setiap sisi objek ditambah 2 cm, lukisan yang terhasil ialah lukisan berskala.', false, 'Menambah nilai yang sama mengubah nisbah sisi. Lukisan berskala diperoleh dengan mendarab setiap sisi dengan nombor yang sama.'],
  ['Dalam lukisan berskala, semua sudut adalah sama dengan sudut objek.', true, 'Bentuk tidak berubah, maka semua sudut tidak berubah.'],
  ['Pelan rumah dan peta ialah contoh lukisan berskala yang dikecilkan.', true, 'Ukuran pada pelan dan peta jauh lebih kecil daripada ukuran sebenar.'],
  ['Lukisan berskala boleh dihasilkan dengan mendarab panjang sahaja dengan suatu nombor.', false, 'Semua ukuran, bukan panjang sahaja, mesti didarab dengan nombor yang sama.'],
  ['Lukisan sel dalam buku sains biasanya ialah lukisan berskala yang dibesarkan.', true, 'Sel sangat kecil, jadi lukisannya dibesarkan supaya dapat dilihat.'],
  ['Nisbah ukuran lukisan kepada ukuran objek adalah sama bagi semua sisi yang sepadan.', true, 'Itulah syarat lukisan berskala.']
];
const BSBS2 = [
  ['Skala 1 : 100 bermaksud 1 cm pada lukisan mewakili 100 cm pada objek sebenar.', true, 'Skala 1 : n bermaksud 1 unit pada lukisan mewakili n unit sebenar.'],
  ['Skala 1 : 1/2 menghasilkan lukisan yang lebih kecil daripada objek.', false, 'n = 1/2 < 1, maka lukisan dibesarkan (2 kali objek).'],
  ['Skala ialah nisbah ukuran sebenar kepada ukuran lukisan.', false, 'Skala = ukuran lukisan : ukuran sebenar.'],
  ['Bagi skala 1 : n dengan n > 1, lukisan itu dikecilkan.', true, 'Setiap ukuran lukisan = ukuran sebenar ÷ n, dengan n > 1.'],
  ['Skala 1 : 1 bermaksud lukisan sama saiz dengan objek.', true, 'Ukuran lukisan = ukuran sebenar.'],
  ['Jika lukisan 5 cm mewakili 2 m, maka skalanya ialah 5 : 2.', false, 'Unit mesti sama: 5 cm : 200 cm = 1 : 40.'],
  ['Skala 1 : 50 000 pada peta bermaksud 1 cm mewakili 0.5 km.', true, '50 000 cm = 500 m = 0.5 km.'],
  ['Peta berskala 1 : 200 000 menunjukkan kawasan lebih terperinci daripada peta berskala 1 : 50 000.', false, 'Peta 1 : 50 000 lebih besar (n lebih kecil), maka lebih terperinci.']
];

/* =================== rajah =================== */
const bsF = v => +(+v).toFixed(1);
const bsT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => /[\u0001\u0004]/.test(bsBtTok(String(t))) ? bsBtSvg(x, y, t, `style="fill:var(--${c})" font-family="Inter, sans-serif"`, sz, a, w) : `<text x="${bsF(x)}" y="${bsF(y)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const bsL = (p, q, c, w = 3, dash) => `<line x1="${bsF(p[0])}" y1="${bsF(p[1])}" x2="${bsF(q[0])}" y2="${bsF(q[1])}" style="stroke:var(--${c})" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="7 6"' : ''}/>`;
const bsSvg = (w, h, s, label) => `<svg viewBox="0 0 ${bsF(w)} ${bsF(h)}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// segi empat tepat berlabel, dilukis berkadar: items [{w, h, c, t, wl, hl}]
function bsRects(items, label, maxH = 140) {
  const tw = items.reduce((a, it) => a + it.w, 0), mh = Math.max(...items.map(it => it.h));
  const k = Math.min((440 - 70 * items.length) / tw, maxH / mh), gap = 70;
  let x = 40, s = '';
  const H = maxH + 92, base = 40 + maxH;
  items.forEach(it => {
    const w = Math.max(it.w * k, 14), h = Math.max(it.h * k, 14), y = base - h;
    s += `<rect x="${bsF(x)}" y="${bsF(y)}" width="${bsF(w)}" height="${bsF(h)}" rx="3" style="fill:var(--${it.c});fill-opacity:.18;stroke:var(--${it.c})" stroke-width="3"/>`;
    if (it.t) s += bsT(x + w / 2, 18, it.t, it.c, 16);
    if (it.wl) s += bsT(x + w / 2, base + 18, it.wl, it.c, 15);
    if (it.hl) s += bsT(x + w + 7, y + h / 2, it.hl, it.c, 15, 'start');
    x += w + gap;
  });
  return bsSvg(Math.max(x - gap + 60, 300), H, s, label || 'Objek dan lukisan');
}
// titik dalam poligon
function bsIn(pt, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
// panel grid: { cols, rows, cell, title, tc, shapes:[{pts, c, ox, oy, lab:'unit'|null, pts2}], marks:[{i,j,s,c}] }
function bsGridFig(panels, label) {
  let x = 14, s = '', H = 0;
  const top = panels.some(p => p.title) ? 34 : 12;
  panels.forEach(p => {
    const c = p.cell, X = i => x + i * c, Y = j => top + j * c;
    for (let i = 0; i <= p.cols; i++) s += `<line x1="${bsF(X(i))}" y1="${bsF(Y(0))}" x2="${bsF(X(i))}" y2="${bsF(Y(p.rows))}" style="stroke:var(--mu);stroke-opacity:.4" stroke-width="1.2"/>`;
    for (let j = 0; j <= p.rows; j++) s += `<line x1="${bsF(X(0))}" y1="${bsF(Y(j))}" x2="${bsF(X(p.cols))}" y2="${bsF(Y(j))}" style="stroke:var(--mu);stroke-opacity:.4" stroke-width="1.2"/>`;
    if (p.title) s += bsT(x + p.cols * c / 2, 15, p.title, p.tc || 'tx', 15);
    (p.shapes || []).forEach(sh => {
      const ox = sh.ox || 0, oy = sh.oy || 0, pts = sh.pts.map(([i, j]) => [i + ox, j + oy]);
      s += `<polygon points="${pts.map(([i, j]) => bsF(X(i)) + ',' + bsF(Y(j))).join(' ')}" style="fill:var(--${sh.c});fill-opacity:.22;stroke:var(--${sh.c})" stroke-width="3" stroke-linejoin="round"/>`;
      if (sh.lab) {
        pts.forEach((a, k) => {
          const b = pts[(k + 1) % pts.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (a[0] !== b[0] && a[1] !== b[1]) return;          // label sisi mengufuk/mencancang sahaja
          let nx = (b[1] - a[1]) / len, ny = -(b[0] - a[0]) / len; const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          if (bsIn([m[0] + nx * .2, m[1] + ny * .2], pts)) { nx = -nx; ny = -ny; }
          const d = c < 20 ? 11 : 13;
          s += bsT(X(m[0]) + nx * (nx ? d + 6 : 0), Y(m[1]) + ny * d, sh.lab(len), sh.c, c < 20 ? 12 : 14, nx > 0 ? 'start' : nx < 0 ? 'end' : 'middle');
        });
      }
      (sh.vl || []).forEach(([k, t]) => {
        const a = pts[k], cx = pts.reduce((u, q) => u + q[0], 0) / pts.length, cy = pts.reduce((u, q) => u + q[1], 0) / pts.length;
        const dx = a[0] - cx, dy = a[1] - cy, ln = Math.hypot(dx, dy) || 1;
        s += `<circle cx="${bsF(X(a[0]))}" cy="${bsF(Y(a[1]))}" r="4.5" style="fill:var(--${sh.c})"/>` + bsT(X(a[0]) + dx / ln * 15, Y(a[1]) + dy / ln * 15, t, 'tx', 16);
      });
    });
    (p.marks || []).forEach(m => { s += bsT(X(m.i), Y(m.j), m.s, m.c || 'tx', m.sz || 16); });
    H = Math.max(H, top + p.rows * c + 14);
    x += p.cols * c + (p.gap || 28);
  });
  return bsSvg(x - 14, H, s, label || 'Grid');
}
// peta: dua tempat dengan jarak pada peta
function bsMapFig(A, B, dl, sk, route) {
  let s = `<rect x="6" y="6" width="348" height="168" rx="16" style="fill:var(--gr);fill-opacity:.08;stroke:var(--mu);stroke-opacity:.5" stroke-width="1.5"/>`;
  s += `<path d="M6 140 C 90 120, 160 170, 240 140 S 330 110, 354 124" fill="none" style="stroke:var(--tr);stroke-opacity:.45" stroke-width="8"/>`;
  if (route) {
    s += bsL([50, 110], [180, 58], 'am', 3.5, true) + bsL([180, 58], [310, 110], 'am', 3.5, true);
    s += `<circle cx="50" cy="110" r="8" style="fill:var(--pk)"/><circle cx="180" cy="58" r="8" style="fill:var(--pu)"/><circle cx="310" cy="110" r="8" style="fill:var(--pk)"/>`;
    s += bsT(50, 132, A, 'tx', 14) + bsT(180, 36, route.C, 'tx', 14) + bsT(310, 132, B, 'tx', 14) + bsT(104, 72, route.d1, 'am', 14, 'end') + bsT(256, 72, route.d2, 'am', 14, 'start');
  } else {
    s += bsL([60, 80], [300, 80], 'am', 3.5, true) + `<circle cx="60" cy="80" r="8" style="fill:var(--pk)"/><circle cx="300" cy="80" r="8" style="fill:var(--pk)"/>`;
    s += bsT(60, 56, A, 'tx', 14) + bsT(300, 56, B, 'tx', 14) + (dl ? bsT(180, 102, dl, 'am', 15) : '');
  }
  if (sk) s += bsT(180, 160, `Skala ${sk}`, 'mu', 14);
  return bsSvg(360, 180, s, 'Peta');
}
// pelan bilik: rooms [{w, h, t, c}] dalam cm pada pelan, disusun sebaris
function bsPlanFig(rooms, sk) {
  const k = Math.min(300 / rooms.reduce((a, r) => a + r.w, 0), 120 / Math.max(...rooms.map(r => r.h)));
  let x = 30, s = '';
  rooms.forEach(r => {
    const w = r.w * k, h = r.h * k;
    s += `<rect x="${bsF(x)}" y="24" width="${bsF(w)}" height="${bsF(h)}" style="fill:var(--${r.c});fill-opacity:.16;stroke:var(--${r.c})" stroke-width="3"/>`;
    s += bsT(x + w / 2, 24 + h / 2, r.t, r.c, 14) + bsT(x + w / 2, 24 + h + 16, bsCm(r.w), r.c, 14) + bsT(x + w + 6, 24 + h / 2, bsCm(r.h), r.c, 14, 'start');
    x += w + (rooms.length > 1 ? 52 : 0);
  });
  s += sk ? bsT(x / 2 + 20, 24 + Math.max(...rooms.map(r => r.h)) * k + 40, `Pelan · skala ${sk}`, 'mu', 14) : '';
  return bsSvg(Math.max(x + 60, 320), Math.max(...rooms.map(r => r.h)) * k + 64, s, 'Pelan');
}
// pembaris: lukisan d cm (skala, label)
function bsBarFig(d, lab, sk, c = 'am') {
  const k = Math.min(30, 280 / d), w = d * k;
  let s = `<rect x="30" y="40" width="${bsF(w)}" height="22" rx="4" style="fill:var(--${c});fill-opacity:.25;stroke:var(--${c})" stroke-width="2.5"/>`;
  for (let i = 0; i <= Math.floor(d); i++) s += bsL([30 + i * k, 62], [30 + i * k, 72], 'mu', 1.5);
  s += bsT(30 + w / 2, 92, lab, c, 15) + (sk ? bsT(30 + w / 2, 18, sk, 'mu', 14) : '');
  return bsSvg(Math.max(w + 60, 200), 108, s, 'Ukuran pada lukisan');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 4.1.1 Maksud Lukisan Berskala ---------- */
  nisbah: [
    ({ ob, a, b, a2, b2 }) => ({ q: `Sebuah objek berbentuk segi empat tepat berukuran ${a} cm × ${b} cm. Lukisan berskalanya berukuran ${bsN(a2)} cm × ${bsN(b2)} cm. Nyatakan nisbah ukuran lukisan kepada ukuran objek dalam bentuk termudah.` }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah objek dan lukisan berskalanya. Cari nisbah panjang lukisan kepada panjang objek dalam bentuk termudah.' }),
    ({ ob, a, a2 }) => ({ q: `Panjang ${ob} ialah ${a} cm. Dalam sebuah lukisan berskala, panjangnya ialah ${bsN(a2)} cm. Nyatakan nisbah ukuran lukisan kepada ukuran objek.` }),
    ({ a, b, a2, b2, rev, ans }) => { const N = vnama(); return Object.assign({ q: `Sebuah objek berukuran ${a} cm × ${b} cm dan lukisan berskalanya berukuran ${bsN(a2)} cm × ${bsN(b2)} cm. ${N} berkata nisbah ukuran lukisan kepada ukuran objek ialah ${rev}. Adakah ${N} betul?` }, salah(N, ans, `${N} menulis nisbah ukuran objek kepada ukuran lukisan. Sepatutnya lukisan : objek.`)); }
  ],
  kali: [
    ({ a, a2, nm }) => ({ q: `Sisi ${nm} sebuah objek ialah ${a} cm, manakala sisi yang sepadan pada lukisan berskalanya ialah ${bsN(a2)} cm. Adakah lukisan itu dikecilkan atau dibesarkan? Setiap ukuran lukisan ialah berapa kali ukuran objek?` }),
    ({ a, a2, f }) => ({ q: `Lengkapkan: Objek ${a} cm, lukisan ${bsN(a2)} cm. Setiap ukuran lukisan = ___ × ukuran objek.`, ans: f }),
    ({ ob, a, a2 }) => ({ q: `Panjang ${ob} ialah ${a} cm dan panjang lukisan berskalanya ialah ${bsN(a2)} cm. Huraikan hubungan antara ukuran lukisan dengan ukuran objek.` }),
    ({ a, a2 }) => ({ q: `Sebuah lukisan berskala dibina dengan panjang ${bsN(a2)} cm bagi objek yang panjangnya ${a} cm. Lukisan itu dikecilkan, dibesarkan atau sama saiz? Berapa kali?` })
  ],
  kenal: [
    () => ({ q: 'Rajah di bawah menunjukkan sebuah objek dan tiga lukisan, A, B dan C, pada grid yang sama. Lukisan manakah ialah lukisan berskala bagi objek itu?' }),
    () => ({ q: 'Antara lukisan A, B dan C dalam rajah di bawah, yang manakah mempunyai bentuk yang sama dengan objek, iaitu lukisan berskala bagi objek itu?' }),
    ({ X, kt }) => ({ q: 'Kenal pasti lukisan berskala bagi objek dalam rajah di bawah. Berikan sebab anda.', ans: `Lukisan ${X}, kerana setiap sisinya ialah ${kt} sisi objek yang sepadan` }),
    ({ Y, X }) => { const N = vnama(); return Object.assign({ q: `${N} berkata lukisan ${Y} dalam rajah di bawah ialah lukisan berskala bagi objek itu. Adakah ${N} betul?` }, salah(N, `Lukisan ${X}`, `Lukisan ${Y} diregangkan secara berbeza pada arah mengufuk dan mencancang, jadi bentuknya berubah.`)); }
  ],
  sisiHilang: [
    ({ ob, a, b, a2 }) => ({ q: `${vcap(ob)} berukuran ${a} cm × ${b} cm dilukis sebagai lukisan berskala. Panjang lukisan ialah ${bsN(a2)} cm. Hitung lebar lukisan itu.` }),
    ({ a, b, a2 }) => ({ q: `Sebuah segi empat tepat berukuran ${a} cm × ${b} cm. Lukisan berskalanya mempunyai panjang ${bsN(a2)} cm. Berapakah lebar lukisan itu?` }),
    () => ({ q: 'Rajah di bawah menunjukkan sebuah objek dan lukisan berskalanya. Cari nilai x.' }),
    ({ a, b, a2 }) => ({ q: `Lengkapkan: Objek ${a} cm × ${b} cm → lukisan ${bsN(a2)} cm × ___ cm (lukisan berskala).` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  semak: [
    ({ ob, a, b, a2, b2 }) => ({ q: `${vcap(ob)} berukuran ${a} cm × ${b} cm. Sebuah lukisan berukuran ${bsN(a2)} cm × ${bsN(b2)} cm. Tentukan sama ada lukisan itu ialah lukisan berskala bagi objek tersebut. Tunjukkan pengiraan anda.` }),
    () => ({ q: 'Berdasarkan ukuran dalam rajah di bawah, adakah lukisan itu lukisan berskala bagi objek? Berikan sebab.' }),
    ({ a, b, a2, b2 }) => { const N = vnama(); return { q: `${N} melukis sebuah segi empat tepat berukuran ${bsN(a2)} cm × ${bsN(b2)} cm untuk mewakili objek berukuran ${a} cm × ${b} cm. Adakah lukisan ${N} lukisan berskala?` }; },
    ({ a, b, a2, b2 }) => ({ q: `Objek: ${a} cm × ${b} cm. Lukisan: ${bsN(a2)} cm × ${bsN(b2)} cm. Bandingkan nisbah panjang dan nisbah lebar. Adakah lukisan itu berskala?` })
  ],
  segitiga: [
    ({ s1, s2, s3, d1 }) => ({ q: `Sisi-sisi sebuah segi tiga ialah ${s1} cm, ${s2} cm dan ${s3} cm. Dalam lukisan berskalanya, sisi yang sepadan dengan ${s1} cm ialah ${bsN(d1)} cm. Hitung panjang dua sisi lukisan yang lain.` }),
    ({ s1, s2, s3, d1 }) => ({ q: `Sebuah papan tanda berbentuk segi tiga mempunyai sisi ${s1} cm, ${s2} cm dan ${s3} cm. Papan tanda itu dilukis supaya sisi ${s1} cm menjadi ${bsN(d1)} cm. Cari panjang sisi-sisi lain dalam lukisan.` }),
    () => ({ q: 'Rajah di bawah menunjukkan segi tiga objek dan lukisan berskalanya. Cari nilai x dan nilai y.' }),
    ({ s1, s2, s3, d1, per }) => ({ q: `Segi tiga bersisi ${s1} cm, ${s2} cm dan ${s3} cm dilukis secara berskala dengan sisi ${s1} cm menjadi ${bsN(d1)} cm. Hitung perimeter lukisan itu.`, ans: bsCm(per) })
  ],
  k411: [
    ({ pw, ph, W, H, P2 }) => ({ q: `Sekeping foto berukuran ${pw} cm × ${ph} cm dibesarkan secara berskala supaya lebarnya menjadi ${W} cm. (a) Hitung tinggi foto yang dibesarkan. (b) Setiap ukuran foto baharu ialah berapa kali ukuran asal? (c) Hitung perimeter foto baharu.`, ans: `(a) ${bsCm(H)} (b) ${bsFr(W, pw)} kali (c) ${bsCm(P2)}`, work: [`(a) Faktor = ${W} ÷ ${pw} = ${bsFr(W, pw)}; tinggi = ${ph} × ${bsFr(W, pw)} = ${bsN(H)} cm`, `(b) Setiap ukuran didarab dengan ${bsFr(W, pw)}`, `(c) Perimeter = 2 × (${W} + ${bsN(H)}) = ${bsN(P2)} cm`] }),
    ({ ra, rb, k, da, db, A1, A2 }) => ({ q: `Sebuah segi empat tepat berukuran ${ra} cm × ${rb} cm dilukis secara berskala dengan setiap sisi menjadi ${bsFr(k[0], k[1])} kali sisi asal. (a) Nyatakan ukuran lukisan. (b) Hitung luas objek dan luas lukisan. (c) Luas lukisan ialah berapa kali luas objek?`, ans: `(a) ${bsN(da)} cm × ${bsN(db)} cm (b) ${bsCm2(A1)} dan ${bsCm2(A2)} (c) ${bsFr(k[0] * k[0], k[1] * k[1])} kali`, work: [`(a) ${ra} × ${bsFr(k[0], k[1])} = ${bsN(da)} cm, ${rb} × ${bsFr(k[0], k[1])} = ${bsN(db)} cm`, `(b) Luas objek = ${ra} × ${rb} = ${bsN(A1)} cm²; luas lukisan = ${bsN(da)} × ${bsN(db)} = ${bsN(A2)} cm²`, `(c) ${bsN(A2)} ÷ ${bsN(A1)} = ${bsFr(k[0] * k[0], k[1] * k[1])}, iaitu (${bsFr(k[0], k[1])})²`] }),
    ({ X, Y, ta, tb, xa, xb, ya, yb, good, kt }) => ({ q: `Sebuah objek berbentuk segi empat tepat berukuran ${ta} cm × ${tb} cm. Lukisan ${X} berukuran ${bsN(xa)} cm × ${bsN(xb)} cm dan lukisan ${Y} berukuran ${bsN(ya)} cm × ${bsN(yb)} cm. (a) Lukisan manakah ialah lukisan berskala bagi objek itu? (b) Nyatakan nisbah ukuran lukisan itu kepada ukuran objek.`, ans: `(a) Lukisan ${good} (b) ${kt}`, work: [`${X}: ${bsN(xa)} ÷ ${ta} = ${bsFr(Math.round(xa * 10), ta * 10)}, ${bsN(xb)} ÷ ${tb} = ${bsFr(Math.round(xb * 10), tb * 10)}`, `${Y}: ${bsN(ya)} ÷ ${ta} = ${bsFr(Math.round(ya * 10), ta * 10)}, ${bsN(yb)} ÷ ${tb} = ${bsFr(Math.round(yb * 10), tb * 10)}`, `Hanya lukisan ${good} mempunyai nisbah yang sama bagi panjang dan lebar.`] }),
    ({ s1, s2, s3, dl, k2 }) => {
      const f = bsFr(k2[0], k2[1]), P1 = s1 + s2 + s3, P2 = dl[0] + dl[1] + dl[2];
      return { q: `Sebuah segi tiga mempunyai sisi ${s1} cm, ${s2} cm dan ${s3} cm. Sebuah lukisan berskala dibina supaya sisi terpanjangnya ${bsN(dl[2])} cm. (a) Cari panjang dua sisi lain. (b) Hitung perimeter objek dan perimeter lukisan. (c) Apakah hubungan antara kedua-dua perimeter itu?`, ans: `(a) ${bsCm(dl[0])} dan ${bsCm(dl[1])} (b) ${bsCm(P1)} dan ${bsCm(P2)} (c) Perimeter lukisan = ${f} × perimeter objek`, work: [`Faktor = ${bsN(dl[2])} ÷ ${s3} = ${f}`, `(a) ${s1} × ${f} = ${bsN(dl[0])} cm, ${s2} × ${f} = ${bsN(dl[1])} cm`, `(b) Objek: ${P1} cm; lukisan: ${bsN(P2)} cm`, `(c) ${bsN(P2)} ÷ ${P1} = ${f}`] };
    }
  ],

  /* ---------- 4.1.2 Mentafsir Skala ---------- */
  tafsir: [
    ({ n, rt }) => ({ q: `Terangkan maksud skala ${bsSk(n)}.`, ans: `1 cm pada lukisan mewakili ${rt} pada objek sebenar` }),
    ({ n, ru }) => ({ q: `Lengkapkan: Skala ${bsSk(n)} bermaksud 1 cm pada lukisan mewakili ___ sebenar.`, ans: ru }),
    ({ n, ru, ctx }) => ({ q: `Sebuah ${ctx} dilukis dengan skala ${bsSk(n)}. Berapakah jarak sebenar yang diwakili oleh 1 cm pada ${ctx} itu?`, ans: ru }),
    ({ n, ru }) => ({ q: `Pada sebuah lukisan berskala, 1 cm mewakili ${ru}. Tuliskan skala lukisan itu dalam bentuk 1 : n.`, ans: bsSk(n), work: (n >= 100 ? [`${ru} = ${bsN(n)} cm`] : []).concat([`Skala = 1 : ${bsN(n)}`]) })
  ],
  jenisSkala: [
    ({ sk }) => ({ q: `Sebuah lukisan dilukis dengan skala ${sk}. Adakah lukisan itu dikecilkan, dibesarkan atau sama saiz dengan objek sebenar?` }),
    ({ sk, ob }) => ({ q: `${vcap(ob)} dilukis dengan skala ${sk}. Nyatakan sama ada lukisan itu lebih kecil, lebih besar atau sama saiz dengan ${bsBare(ob)} itu.` }),
    ({ sk }) => ({ q: `Skala sebuah lukisan ialah ${sk}. Apakah yang dapat anda katakan tentang saiz lukisan berbanding saiz objek?` }),
    ({ sk, claim, ans }) => { const N = vnama(); return Object.assign({ q: `${N} berkata lukisan berskala ${sk} adalah ${claim} daripada objek. Adakah ${N} betul?` }, salah(N, ans, 'Bagi skala 1 : n, n > 1 bermaksud dikecilkan, n = 1 sama saiz dan 0 < n < 1 bermaksud dibesarkan.')); }
  ],
  sebenar: [
    ({ d, sk, ctx }) => ({ q: `Pada sebuah pelan berskala ${sk}, panjang ${ctx} ialah ${bsN(d)} cm. Hitung panjang sebenar ${ctx} itu dalam meter.` }),
    ({ d, sk }) => ({ q: `Sebuah lukisan berskala ${sk}. Satu garis pada lukisan itu berukuran ${bsN(d)} cm. Berapakah panjang sebenar yang diwakilinya, dalam meter?` }),
    ({ d, sk }) => ({ q: 'Ukuran pada lukisan dalam rajah di bawah dilukis dengan skala ' + sk + '. Cari panjang sebenar dalam meter.' }),
    ({ d, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `Panjang sebuah koridor pada pelan berskala ${sk} ialah ${bsN(d)} cm. ${N} berkata panjang sebenar koridor ialah ${bsN(d * n)} m. Adakah ${N} betul?` }, salah(N, ans, `${N} lupa menukar sentimeter kepada meter: ${bsN(d)} × ${bsN(n)} = ${bsN(d * n)} cm, bukan ${bsN(d * n)} m.`)); }
  ],
  lukisan: [
    ({ R, sk, ctx }) => ({ q: `Panjang sebenar ${ctx} ialah ${bsN(R)} m. Hitung panjangnya pada pelan berskala ${sk}, dalam cm.` }),
    ({ R, sk }) => ({ q: `Sebatang jalan sepanjang ${bsN(R)} m dilukis dengan skala ${sk}. Berapakah panjang jalan itu pada lukisan?` }),
    ({ R, sk }) => ({ q: `Lengkapkan: Ukuran sebenar ${bsN(R)} m, skala ${sk}. Ukuran lukisan = ___ cm.` }),
    ({ R, sk, ctx }) => ({ q: `Seorang arkitek melukis ${ctx} yang panjangnya ${bsN(R)} m dengan skala ${sk}. Berapakah panjang ${ctx} dalam lukisan arkitek itu?` })
  ],
  cariSkala: [
    ({ dt, rt }) => ({ q: `Panjang sebuah objek ialah ${rt} dan panjang lukisannya ialah ${dt}. Tentukan skala lukisan itu dalam bentuk 1 : n.` }),
    ({ dt, rt, thing }) => ({ q: `${vcap(thing)} yang panjangnya ${rt} dilukis dengan panjang ${dt}. Apakah skala lukisan itu?` }),
    ({ dt, rt }) => ({ q: `Lengkapkan: Lukisan ${dt} mewakili ${rt}. Skala = 1 : ___` }),
    ({ dt, rt, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `Lukisan ${dt} mewakili ukuran sebenar ${rt}. ${N} menulis skalanya sebagai ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menukar kedua-dua ukuran kepada unit yang sama.`)); }
  ],
  peta: [
    ({ d, sk, A, B }) => ({ q: `Jarak antara ${A} dan ${B} pada sebuah peta berskala ${sk} ialah ${bsN(d)} cm. Hitung jarak sebenar dalam km.` }),
    ({ d, sk }) => ({ q: `Pada sebuah peta berskala ${sk}, panjang sebatang sungai ialah ${bsN(d)} cm. Berapakah panjang sebenar sungai itu, dalam km?` }),
    ({ km, sk, A, B }) => ({ q: `Jarak sebenar antara ${A} dan ${B} ialah ${bsN(km)} km. Berapakah jarak itu pada peta berskala ${sk}?` }),
    () => ({ q: 'Rajah di bawah menunjukkan dua tempat pada sebuah peta. Hitung jarak sebenar antara kedua-dua tempat itu dalam km.' })
  ],
  besar: [
    ({ ob, ukur, sk, d }) => ({ q: `Lukisan ${bsPj(ob)} ${ob} dalam sebuah buku dibesarkan dengan skala ${sk}. ${vcap(ukur)} ${ob} pada lukisan ialah ${bsN(d)} cm. Hitung ${ukur} sebenar ${ob} itu.` }),
    ({ ob, ukur, sk, R }) => ({ q: `${vcap(ukur)} sebenar sejenis ${ob} ialah ${bsN(R)} cm. ${vcap(ob)} itu dilukis dengan skala ${sk}. Berapakah ${ukur}nya pada lukisan?` }),
    ({ ob, ukur, d, R }) => ({ q: `${vcap(ukur)} ${ob} ialah ${bsN(R)} cm, tetapi dalam lukisan ${ukur}nya ialah ${bsN(d)} cm. Tentukan skala lukisan itu.` })
  ],
  k412: [
    ({ A, B, n1, d1, d2, n2 }) => ({ q: `Jarak antara ${A} dan ${B} ialah ${bsN(d1)} cm pada peta berskala ${bsSk(n1)}. Pada peta kedua, jarak yang sama ialah ${bsN(d2)} cm. (a) Hitung jarak sebenar dalam km. (b) Tentukan skala peta kedua.`, ans: `(a) ${bsKm(d1 * n1 / 100000)} (b) ${bsSk(n2)}`, work: [`(a) ${bsN(d1)} × ${bsN(n1)} = ${bsN(d1 * n1)} cm = ${bsN(d1 * n1 / 100000)} km`, `(b) ${bsN(d2)} : ${bsN(d1 * n1)}`, `= 1 : ${bsN(n2)}`] }),
    ({ Lr, Ld, n, Wd, Wr }) => ({ q: `Panjang sebenar sebuah dewan ialah ${bsN(Lr)} m dan panjangnya pada pelan ialah ${bsN(Ld)} cm. (a) Tentukan skala pelan itu. (b) Lebar dewan pada pelan ialah ${bsN(Wd)} cm. Hitung lebar sebenar dewan. (c) Hitung luas sebenar lantai dewan.`, ans: `(a) ${bsSk(n)} (b) ${bsM(Wr)} (c) ${bsM2(Lr * Wr)}`, work: [`(a) ${bsN(Lr)} m = ${bsN(Lr * 100)} cm; ${bsN(Ld)} : ${bsN(Lr * 100)} = 1 : ${bsN(n)}`, `(b) ${bsN(Wd)} × ${bsN(n)} = ${bsN(Wd * n)} cm = ${bsN(Wr)} m`, `(c) Luas = ${bsN(Lr)} × ${bsN(Wr)} = ${bsN(Lr * Wr)} m²`] }),
    ({ a, km, nn, dd, Rr }) => ({ q: `Skala sebuah peta ditulis sebagai "${a} cm mewakili ${km} km". (a) Tuliskan skala peta itu dalam bentuk 1 : n. (b) Jarak dua bandar pada peta itu ialah ${bsN(dd)} cm. Hitung jarak sebenar.`, ans: `(a) ${bsSk(nn)} (b) ${bsKm(Rr)}`, work: [`(a) ${km} km = ${bsN(km * 100000)} cm; ${a} : ${bsN(km * 100000)} = 1 : ${bsN(nn)}`, `(b) ${bsN(dd)} × ${bsN(nn)} = ${bsN(dd * nn)} cm = ${bsN(Rr)} km`] }),
    ({ ob, q1, e1, Re, q2, e2 }) => ({ q: `Lukisan ${bsPj(ob)} ${ob} dibesarkan dengan skala 1 : 1/${q1}. Panjang ${ob} pada lukisan ialah ${bsN(e1)} cm. (a) Hitung panjang sebenar ${ob} itu. (b) Jika ${ob} yang sama dilukis dengan skala 1 : 1/${q2}, berapakah panjangnya pada lukisan baharu?`, ans: `(a) ${bsCm(Re)} (b) ${bsCm(e2)}`, work: [`(a) Ukuran sebenar = ${bsN(e1)} × 1/${q1} = ${bsN(Re)} cm`, `(b) Ukuran lukisan = ${bsN(Re)} ÷ 1/${q2} = ${bsN(Re)} × ${q2} = ${bsN(e2)} cm`] })
  ],

  /* ---------- 4.1.3 Melukis Lukisan Berskala ---------- */
  lukis: [
    ({ L, sk }) => ({ q: `Rajah di bawah menunjukkan objek ${L} yang dilukis pada grid segi empat sama bersisi 1 cm. Pada grid yang disediakan, lukis lukisan berskala bagi objek ${L} dengan skala ${sk}.` }),
    ({ L, sk }) => ({ q: `Objek ${L} dilukis pada grid berpetak 1 cm. Lukis semula objek ${L} pada grid kosong dengan skala ${sk}.` }),
    ({ L, sk, nm }) => ({ q: `Rajah di bawah menunjukkan objek ${L} yang berbentuk ${nm} pada grid bersisi 1 cm. Dengan menggunakan skala ${sk}, lukis lukisan berskala ${L} pada grid di sebelahnya.` })
  ],
  ukuranLukisan: [
    ({ tp, L, W, sk }) => ({ q: `Sebuah ${tp} berbentuk segi empat tepat berukuran ${bsN(L)} m × ${bsN(W)} m. Hitung panjang dan lebarnya pada lukisan berskala ${sk}.` }),
    ({ tp, L, W, sk }) => ({ q: `Pelan ${tp} berukuran ${bsN(L)} m × ${bsN(W)} m hendak dilukis dengan skala ${sk}. Apakah ukuran ${tp} itu pada pelan?` }),
    ({ tp, L, W, sk }) => ({ q: `Lengkapkan: ${vcap(tp)} ${bsN(L)} m × ${bsN(W)} m, skala ${sk} → lukisan ___ cm × ___ cm.` }),
    ({ tp, L, W, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `${N} melukis ${tp} berukuran ${bsN(L)} m × ${bsN(W)} m dengan skala ${sk}. ${N} mengira panjang lukisan sebagai ${bsN(L)} ÷ ${bsN(n)} = ${bsN(L / n)} cm. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menukar meter kepada sentimeter sebelum membahagi dengan n.`)); }
  ],
  bacaGrid: [
    ({ sk, P1, P2 }) => ({ q: `Rajah di bawah menunjukkan pelan sebidang tanah yang dilukis pada grid segi empat sama bersisi 1 cm dengan skala ${sk}. Hitung panjang sebenar sisi ${P1}${P2} dalam meter.` }),
    ({ sk, P1, P2 }) => ({ q: `Pelan dalam rajah di bawah dilukis pada grid berpetak 1 cm dengan skala ${sk}. Berapakah panjang sebenar pagar ${P1}${P2}?` }),
    ({ sk, P1, P2 }) => ({ q: `Berdasarkan lukisan berskala ${sk} pada grid berpetak 1 cm di bawah, cari jarak sebenar dari ${P1} ke ${P2}.` })
  ],
  gridBeza: [
    ({ a, b }) => ({ q: `Sebuah objek dilukis pada grid segi empat sama bersisi ${bsN(a)} cm. Lukisan berskalanya dilukis pada grid bersisi ${bsN(b)} cm dengan bilangan petak yang sama. Tentukan skala lukisan itu.` }),
    () => ({ q: 'Rajah di bawah menunjukkan objek dan lukisannya. Kedua-dua bentuk mempunyai bilangan petak yang sama. Tentukan skala lukisan itu.' }),
    ({ a, b }) => ({ q: `Lengkapkan: Objek pada grid ${bsN(a)} cm, lukisan pada grid ${bsN(b)} cm (bilangan petak sama). Skala = ___` }),
    ({ a, b, ans }) => { const N = vnama(); return Object.assign({ q: `Objek pada grid bersisi ${bsN(a)} cm disalin ke grid bersisi ${bsN(b)} cm dengan bilangan petak yang sama. ${N} berkata skalanya ialah ${bsSk(b, a)}. Adakah ${N} betul?` }, salah(N, ans, `${N} menulis nisbah sebenar : lukisan. Skala = sisi petak lukisan : sisi petak objek.`)); }
  ],
  bentukL: [
    ({ a, b, c, d, sk }) => ({ q: `Sebidang tanah berbentuk L. Empat sisinya ialah ${bsN(a)} m, ${bsN(b)} m, ${bsN(c)} m dan ${bsN(d)} m. Hitung panjang setiap sisi itu pada pelan berskala ${sk}.` }),
    ({ sk }) => ({ q: `Rajah di bawah menunjukkan ukuran sebenar sebidang tanah berbentuk L. Hitung ukuran sisi-sisi yang dilabel pada lukisan berskala ${sk}.` }),
    ({ a, b, c, d, sk }) => ({ q: `Tapak sebuah rumah berbentuk L dengan sisi ${bsN(a)} m, ${bsN(b)} m, ${bsN(c)} m dan ${bsN(d)} m. Seorang pelukis pelan menggunakan skala ${sk}. Senaraikan ukuran keempat-empat sisi itu pada pelan.` })
  ],
  k413: [
    ({ sk, n, P, A }) => ({ q: `Rajah di bawah menunjukkan pelan sebidang tanah berbentuk L yang dilukis pada grid berpetak 1 cm dengan skala ${sk}. (a) Hitung perimeter sebenar tanah itu. (b) Hitung luas sebenar tanah itu.`, ans: `(a) ${bsM(P)} (b) ${bsM2(A)}` }),
    ({ L, W, n1, n2, L2, W2, RL, RW }) => ({ q: `Sebuah segi empat tepat berukuran ${bsN(L)} cm × ${bsN(W)} cm ialah lukisan sebuah gelanggang dengan skala ${bsSk(n1)}. (a) Hitung ukuran sebenar gelanggang itu. (b) Gelanggang itu dilukis semula dengan skala ${bsSk(n2)}. Nyatakan ukuran lukisan baharu.`, ans: `(a) ${bsN(RL)} m × ${bsN(RW)} m (b) ${bsN(L2)} cm × ${bsN(W2)} cm`, work: [`(a) ${bsN(L)} × ${bsN(n1)} = ${bsN(L * n1)} cm = ${bsN(RL)} m; ${bsN(W)} × ${bsN(n1)} = ${bsN(W * n1)} cm = ${bsN(RW)} m`, `(b) ${bsN(L * n1)} ÷ ${bsN(n2)} = ${bsN(L2)} cm; ${bsN(W * n1)} ÷ ${bsN(n2)} = ${bsN(W2)} cm`] }),
    ({ a, b, w, h, k, A1, A2, sk3: sk }) => ({ q: `Objek berbentuk segi empat tepat ${w} petak × ${h} petak dilukis pada grid bersisi ${bsN(a)} cm. Objek itu disalin ke grid bersisi ${bsN(b)} cm dengan bilangan petak yang sama. (a) Tentukan skala lukisan itu. (b) Hitung luas objek dan luas lukisan. (c) Luas lukisan ialah berapa kali luas objek?`, ans: `(a) ${sk} (b) ${bsCm2(A1)} dan ${bsCm2(A2)} (c) ${k} kali`, work: [`(a) Skala = sisi petak lukisan : sisi petak objek = ${bsN(b)} : ${bsN(a)}${`${bsN(b)} : ${bsN(a)}` === sk ? '' : ` = ${sk}`}`, `(b) Objek: ${bsN(w * a)} × ${bsN(h * a)} = ${bsN(A1)} cm²; lukisan: ${bsN(w * b)} × ${bsN(h * b)} = ${bsN(A2)} cm²`, `(c) ${bsN(A2)} ÷ ${bsN(A1)} = ${k}`] })
  ],

  /* ---------- 4.1.4 Penyelesaian Masalah ---------- */
  luasBilik: [
    ({ bl, l, w, sk }) => ({ q: `Pada pelan berskala ${sk}, ${bl} berbentuk segi empat tepat berukuran ${bsN(l)} cm × ${bsN(w)} cm. Hitung luas sebenar ${bl} itu dalam m².` }),
    ({ bl, sk }) => ({ q: `Rajah di bawah menunjukkan pelan ${bl} dengan skala ${sk}. Berapakah luas lantai sebenar ${bl} itu?` }),
    ({ bl, l, w, sk }) => ({ q: `Encik Rahman melihat pelan rumah barunya yang berskala ${sk}. ${vcap(bl)} berukuran ${bsN(l)} cm × ${bsN(w)} cm pada pelan. Berapakah luas sebenar ${bl} itu?` }),
    ({ bl, l, w, sk, wrong, ans }) => { const N = vnama(); return Object.assign({ q: `${vcap(bl)} berukuran ${bsN(l)} cm × ${bsN(w)} cm pada pelan berskala ${sk}. ${N} berkata luas sebenarnya ialah ${wrong}. Adakah ${N} betul?` }, salah(N, ans, `${N} hanya mendarab luas pada pelan dengan n. Cari panjang dan lebar sebenar dahulu, kemudian darab.`)); }
  ],
  laluan: [
    ({ A, B, C, d1, d2, sk }) => ({ q: `Pada peta berskala ${sk}, jarak dari ${A} ke ${C} ialah ${bsN(d1)} cm dan dari ${C} ke ${B} ialah ${bsN(d2)} cm. Hitung jumlah jarak sebenar perjalanan dari ${A} ke ${B} melalui ${C}, dalam km.` }),
    ({ A, B, C, sk }) => ({ q: `Rajah di bawah menunjukkan laluan dari ${A} ke ${B} melalui ${C} pada peta berskala ${sk}. Berapakah jumlah jarak sebenar laluan itu?` }),
    ({ A, B, C, d1, d2, sk }) => ({ q: `Sebuah bas bergerak dari ${A} ke ${C}, kemudian ke ${B}. Pada peta berskala ${sk}, kedua-dua bahagian laluan itu ialah ${bsN(d1)} cm dan ${bsN(d2)} cm. Berapa jauhkah bas itu bergerak?` })
  ],
  model: [
    ({ thing, ml, R }) => ({ q: `Panjang sebuah model ${thing} ialah ${bsN(ml)} cm, manakala panjang ${thing} sebenar ialah ${bsN(R)} m. Tentukan skala model itu.` }),
    ({ thing, n, R }) => ({ q: `Sebuah model ${thing} dibina dengan skala ${bsSk(n)}. Jika panjang ${thing} sebenar ialah ${bsN(R)} m, berapakah panjang model itu?` }),
    ({ thing, n, ml }) => ({ q: `Sebuah model ${thing} berskala ${bsSk(n)} panjangnya ${bsN(ml)} cm. Hitung panjang ${thing} sebenar dalam meter.` })
  ],
  luasN: [
    ({ Ad, sk }) => ({ q: `Luas sebuah taman pada lukisan berskala ${sk} ialah ${bsN(Ad)} cm². Hitung luas sebenar taman itu dalam m².` }),
    ({ Ad, sk, tp }) => ({ q: `Pada sebuah pelan berskala ${sk}, luas ${tp} ialah ${bsN(Ad)} cm². Berapakah luas sebenar ${tp} itu?` }),
    ({ Ar, sk, tp }) => ({ q: `Luas sebenar ${tp} ialah ${bsN(Ar)} m². Berapakah luasnya pada pelan berskala ${sk}, dalam cm²?` }),
    ({ Ad, sk, n, ans }) => { const N = vnama(); return Object.assign({ q: `Luas sebuah kawasan pada pelan berskala ${sk} ialah ${bsN(Ad)} cm². ${N} berkata luas sebenarnya ialah ${bsN(Ad * n)} cm². Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dengan n sahaja. Bagi luas, darab dengan n².`)); }
  ],
  kos: [
    ({ bl, l, w, sk, h, A }) => ({ q: `${vcap(bl)} berukuran ${bsN(l)} cm × ${bsN(w)} cm pada pelan berskala ${sk}. Kos memasang permaidani ialah RM${h} bagi setiap meter persegi. Hitung kos memasang permaidani di seluruh lantai ${bl} itu.` }),
    ({ tp, l, w, sk, h }) => ({ q: `Sebuah ${tp} berukuran ${bsN(l)} cm × ${bsN(w)} cm pada pelan berskala ${sk}. Pagar akan dipasang di sekeliling ${tp} itu dengan kos RM${h} semeter. Berapakah kos memagar?`, per: true }),
    ({ bl, l, w, sk, h }) => ({ q: `Pelan berskala ${sk} menunjukkan lantai ${bl} berukuran ${bsN(l)} cm × ${bsN(w)} cm. Jika harga jubin ialah RM${h} semeter persegi, berapakah kos jubin untuk lantai itu?` })
  ],
  masa: [
    ({ A, B, d, sk, v }) => ({ q: `Jarak dari ${A} ke ${B} pada peta berskala ${sk} ialah ${bsN(d)} cm. Sebuah kereta bergerak pada laju purata ${v} km/j. Berapakah masa yang diambil, dalam minit?` }),
    ({ A, B, d, sk, v }) => ({ q: `Pada peta berskala ${sk}, panjang jalan dari ${A} ke ${B} ialah ${bsN(d)} cm. Puan Lim menunggang motosikal pada laju ${v} km/j. Hitung masa perjalanannya dalam minit.` }),
    ({ A, B, d, sk, t }) => ({ q: `Jarak ${A} ke ${B} pada peta berskala ${sk} ialah ${bsN(d)} cm. Sebuah bas mengambil masa ${t} minit untuk perjalanan itu. Hitung laju purata bas dalam km/j.`, inv: true })
  ],
  k414: [
    ({ sk, n, r1, r2, h }) => ({ q: `Pelan sebuah rumah dilukis dengan skala ${sk}. ${vcap(r1.t)} berukuran ${bsN(r1.l)} cm × ${bsN(r1.w)} cm dan ${r2.t} berukuran ${bsN(r2.l)} cm × ${bsN(r2.w)} cm pada pelan. (a) Hitung luas sebenar setiap bilik. (b) Kos memasang lantai vinil ialah RM${h} semeter persegi. Hitung jumlah kos untuk kedua-dua bilik.` }),
    ({ sk, A, B, C, d1, d2, d3, v }) => ({ q: `Pada peta berskala ${sk}, laluan pertama dari ${A} ke ${B} ialah jalan terus sepanjang ${bsN(d1)} cm. Laluan kedua melalui ${C}: ${bsN(d2)} cm dan ${bsN(d3)} cm. (a) Hitung jarak sebenar setiap laluan. (b) Jika laju purata ialah ${v} km/j, berapa minit dapat dijimatkan dengan memilih laluan yang lebih pendek?` }),
    ({ sk, l, w, g, h }) => ({ q: `Sebuah kebun berbentuk segi empat tepat berukuran ${bsN(l)} cm × ${bsN(w)} cm pada pelan berskala ${sk}. Pagar akan dipasang di sekeliling kebun kecuali pintu pagar selebar ${bsN(g)} m. (a) Hitung perimeter sebenar kebun. (b) Kos pagar ialah RM${h} semeter. Hitung kos memasang pagar itu.` })
  ]
};

/* =================== pembina soalan (r = bsRG atau bsRW) =================== */
const BS = {};
// faktor lukisan k = [p, q] (lukisan = objek × p/q)
const BSK_KECIL = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4]], BSK_BESAR = [[2, 1], [3, 1], [3, 2], [4, 1], [5, 2]];
const bsKtxt = ([p, q]) => (q === 1 ? `${p} kali` : `${p}/${q} kali`);
const bsRatio = ([p, q]) => `${p} : ${q}`;    // lukisan : objek, termudah
// objek a × b (integer) dengan faktor k menghasilkan lukisan kemas (≤ 1 t.p.)
function bsPair(r, big) {
  let k, a, b, a2, b2;
  do {
    k = r.p(big == null ? (r.f() < .7 ? BSK_KECIL : BSK_BESAR) : big ? BSK_BESAR : BSK_KECIL);
    a = r.i(2, big ? 9 : 30); b = r.i(2, big ? 8 : 24); a2 = a * k[0] / k[1]; b2 = b * k[0] / k[1];
  } while (a === b || a < b || a > 3 * b || !bsTidy(a2, 1) || !bsTidy(b2, 1) || a2 > 40);
  return { k, a, b, a2, b2 };
}
/* ---------- 4.1.1 ---------- */
BS.nisbah = (r, big) => {
  const { k, a, b, a2, b2 } = bsPair(r, big), ob = r.p(BSOBJ), ans = bsRatio(k), rev = bsRatio([k[1], k[0]]);
  const work = [`Lukisan : objek = ${bsN(a2)} : ${a}`, `= ${bsRatio(k)} (bahagi dengan faktor sepunya)`, `Semak lebar: ${bsN(b2)} : ${b} = ${bsRatio(k)}`];
  return GEN_LQ('nisbah', { ob, a, b, a2, b2, rev, ans, work }, { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Objek', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Lukisan', wl: bsCm(a2), hl: bsCm(b2) }], 'Objek dan lukisan berskala') });
};
BS.kali = r => {
  const { k, a, a2 } = bsPair(r), ob = r.p(BSOBJ), nm = r.p(['terpanjang', 'tapak', 'atas', 'kiri']);
  const small = k[0] < k[1], ans = `${small ? 'Dikecilkan' : 'Dibesarkan'}; setiap ukuran lukisan = ${bsKtxt(k)} ukuran objek`;
  return GEN_LQ('kali', { a, a2, ob, nm, f: bsFr(k[0], k[1]), ans, work: [`${bsN(a2)} ÷ ${a} = ${bsFr(k[0], k[1])}`, small ? `${bsFr(k[0], k[1])} < 1, maka lukisan dikecilkan.` : `${bsFr(k[0], k[1])} > 1, maka lukisan dibesarkan.`] });
};
// objek + tiga calon (satu berskala, dua diregang)
function bsKenalData(r) {
  for (;;) {
    const sh = r.p(BSHAPE), kc = r.p([1, 3]), kd = r.p([1, 2, 3].filter(x => x !== kc));
    const W = Math.max(...sh.p.map(p => p[0])), H = Math.max(...sh.p.map(p => p[1])), ar = W / H;
    const st = [[kc, kc], [kc, kd], [kd, kc]];
    // calon diregang tidak boleh sebentuk (nisbah kotak sama atau songsang)
    if (st.slice(1).some(([sx, sy]) => { const a2 = (W * sx) / (H * sy); return Math.abs(a2 - ar) < 1e-9 || Math.abs(a2 - 1 / ar) < 1e-9; })) continue;
    const order = bsShuf(r, [0, 1, 2]), L = ['A', 'B', 'C'];
    const X = L[order.indexOf(0)], Y = L[order.indexOf(r.p([1, 2]))];
    const cell = 13, mk = ([sx, sy], c, t) => ({ cols: W * 3 + 2, rows: H * 3 + 2, cell, title: t, tc: c, shapes: [{ pts: sh.p.map(([i, j]) => [i * sx, j * sy]), c, ox: 1, oy: 1 }], gap: 18 });
    const panels = [Object.assign(mk([2, 2], 'tr', 'Objek'), { gap: 30 })].concat(order.map((o, i) => mk(st[o], 'am', L[i])));
    return { sh, kc, X, Y, kt: bsKtxt([kc, 2]), fig: bsGridFig(panels, 'Objek dan tiga lukisan A, B dan C') };
  }
}
BS.kenal = r => {
  const d = bsKenalData(r);
  return GEN_LQ('kenal', { X: d.X, Y: d.Y, kt: d.kt, ans: `Lukisan ${d.X}`, work: [`Lukisan ${d.X}: setiap sisi = ${d.kt} sisi objek yang sepadan, jadi bentuknya sama.`, 'Dua lukisan lain diregangkan secara berbeza pada arah mengufuk dan mencancang, jadi bentuknya berubah.'] }, { fig: d.fig });
};
BS.sisiHilang = r => {
  const { k, a, b, a2, b2 } = bsPair(r), ob = r.p(BSOBJ);
  return GEN_LQ('sisiHilang', { ob, a, b, a2, ans: bsCm(b2), work: [`Faktor = ${bsN(a2)} ÷ ${a} = ${bsFr(k[0], k[1])}`, `Lebar lukisan = ${b} × ${bsFr(k[0], k[1])} = ${bsN(b2)} cm`] },
    { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Objek', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Lukisan', wl: bsCm(a2), hl: 'x cm' }], 'Objek dan lukisan dengan sisi x') });
};
BS.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
BS.semak = (r, yes) => {
  yes = yes == null ? r.f() < .5 : yes;
  let { k, a, b, a2, b2 } = bsPair(r), ob = r.p(BSOBJ);
  if (!yes) { const d = r.p([1, 2, -1]); b2 = b2 + d > 0 && b2 + d !== b2 ? b2 + d : b2 + 1; }
  const ra = a2 / a, rb = b2 / b, same = Math.abs(ra - rb) < 1e-9;
  const ans = same ? `Ya, kerana nisbah panjang dan nisbah lebar sama (${bsRatio(k)})` : `Bukan, kerana nisbah panjang (${bsFr(Math.round(a2 * 10), a * 10)}) tidak sama dengan nisbah lebar (${bsFr(Math.round(b2 * 10), b * 10)})`;
  return GEN_LQ('semak', { ob, a, b, a2, b2, ans, work: [`Panjang: ${bsN(a2)} ÷ ${a} = ${bsFr(Math.round(a2 * 10), a * 10)}`, `Lebar: ${bsN(b2)} ÷ ${b} = ${bsFr(Math.round(b2 * 10), b * 10)}`, same ? 'Kedua-dua nisbah sama, maka lukisan itu berskala.' : 'Nisbah berbeza, maka bentuk berubah dan lukisan itu bukan lukisan berskala.'] },
    { fig: bsRects([{ w: a, h: b, c: 'tr', t: 'Objek', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Lukisan', wl: bsCm(a2), hl: bsCm(b2) }], 'Objek dan lukisan') });
};
const BSTRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 6, 8], [6, 9, 12], [8, 10, 14], [9, 12, 15], [10, 12, 16], [4, 5, 6]];
BS.segitiga = r => {
  let t, k, d; do { t = r.p(BSTRI); k = r.p(BSK_KECIL.concat(BSK_BESAR)); d = t.map(x => x * k[0] / k[1]); } while (!d.every(x => bsTidy(x, 1)) || d[2] > 40);
  const [s1, s2, s3] = t, per = d[0] + d[1] + d[2];
  // rajah: segi tiga objek & lukisan (bentuk lebih kurang)
  const tri = (x0, sc, c, l) => {
    const A = [x0, 150], Bp = [x0 + s3 * sc, 150], ca = (s2 * s2 + s3 * s3 - s1 * s1) / (2 * s2 * s3), sa = Math.sqrt(1 - ca * ca), Cp = [x0 + s2 * sc * ca, 150 - s2 * sc * sa];
    return `<polygon points="${[A, Bp, Cp].map(p => bsF(p[0]) + ',' + bsF(p[1])).join(' ')}" style="fill:var(--${c});fill-opacity:.18;stroke:var(--${c})" stroke-width="3" stroke-linejoin="round"/>`
      + bsT((A[0] + Bp[0]) / 2, 166, l[2], c, 14) + bsT((A[0] + Cp[0]) / 2 - 10, (A[1] + Cp[1]) / 2, l[1], c, 14, 'end') + bsT((Bp[0] + Cp[0]) / 2 + 10, (Bp[1] + Cp[1]) / 2, l[0], c, 14, 'start');
  };
  const f = k[0] / k[1], so = f > 1 ? 120 / s3 / Math.min(f, 1.5) : 120 / s3, sd = so * Math.max(.55, Math.min(1.5, f));
  const fig = bsSvg(420, 180, bsT(100, 14, 'Objek', 'tr', 15) + bsT(320, 14, 'Lukisan', 'am', 15) + tri(40, so, 'tr', [bsCm(s1), bsCm(s2), bsCm(s3)]) + tri(250, sd, 'am', [bsCm(d[0]), 'x cm', 'y cm']), 'Segi tiga objek dan lukisan');
  return GEN_LQ('segitiga', { s1, s2, s3, d1: d[0], per, ans: `${bsCm(d[1])} dan ${bsCm(d[2])}`, work: [`Faktor = ${bsN(d[0])} ÷ ${s1} = ${bsFr(k[0], k[1])}`, `${s2} × ${bsFr(k[0], k[1])} = ${bsN(d[1])} cm`, `${s3} × ${bsFr(k[0], k[1])} = ${bsN(d[2])} cm`].concat([`(Perimeter lukisan = ${bsN(per)} cm)`]) }, { fig });
};
BS.k411 = (r, v) => {
  let pw, ph, W; do { pw = r.p([4, 5, 6, 8, 10, 12, 15]); ph = r.p([3, 4, 6, 8, 9, 10]); W = pw * r.p([2, 3, 4, 1.5, 2.5]); } while (pw === ph || !Number.isInteger(W) || !bsTidy(ph * W / pw, 1));
  const H = ph * W / pw, P2 = 2 * (W + H);
  const kk = r.p([[1, 2], [2, 1], [3, 1], [1, 3], [3, 2]]); let ra, rb; do { ra = r.i(4, 15); rb = r.i(3, 12); } while (ra === rb || !bsTidy(ra * kk[0] / kk[1], 1) || !bsTidy(rb * kk[0] / kk[1], 1));
  const da = ra * kk[0] / kk[1], db = rb * kk[0] / kk[1];
  const { k, a: ta, b: tb, a2: xa0, b2: xb0 } = bsPair(r), good = r.f() < .5 ? 'P' : 'Q';
  const bad = [xa0, xb0 + (xb0 > 2 ? -1 : 1)];
  const [xa, xb] = good === 'P' ? [xa0, xb0] : bad, [ya, yb] = good === 'P' ? bad : [xa0, xb0];
  let t, kt2, dl; do { t = r.p(BSTRI); kt2 = r.p([[1, 2], [2, 1], [3, 1], [3, 2], [5, 2]]); dl = t.map(x => x * kt2[0] / kt2[1]); } while (!dl.every(x => bsTidy(x, 1)));
  return GEN_LQ('k411', { pw, ph, W, H, P2, ra, rb, k: kk, da, db, A1: ra * rb, A2: da * db, X: 'P', Y: 'Q', ta, tb, xa, xb, ya, yb, good, kt: bsRatio(k), s1: t[0], s2: t[1], s3: t[2], dl, k2: kt2 });
};
/* ---------- 4.1.2 ---------- */
const BSN_PELAN = [20, 25, 40, 50, 80, 100, 200, 250, 300, 400, 500, 1000];
const BSN_PETA = [10000, 20000, 25000, 50000, 100000, 200000, 250000, 500000];
const bsRu = n => (n >= 100000 ? `${bsN(n / 100000)} km` : n >= 100 ? `${bsN(n / 100)} m` : `${bsN(n)} cm`);
BS.tafsir = r => {
  const n = r.p(BSN_PELAN.concat(BSN_PETA)), ctx = n >= 10000 ? 'peta' : r.p(['pelan', 'lukisan']);
  return GEN_LQ('tafsir', { n, rt: bsReal(n), ru: bsRu(n), ctx, ans: bsRu(n), work: [`Skala ${bsSk(n)}: 1 cm mewakili ${bsN(n)} cm`, `${bsReal(n)}`] });
};
const BSSK_J = [[[40, 1], 'k'], [[200, 1], 'k'], [[5, 1], 'k'], [[1, 1], 's'], [[1, 2], 'b'], [[1, 3], 'b'], [[1, 4], 'b'], [[1, 10], 'b'], [[3, 2], 'k'], [[2, 5], 'b']];
const BSJ_TXT = { k: ['Dikecilkan', 'lebih kecil'], s: ['Sama saiz', 'sama saiz'], b: ['Dibesarkan', 'lebih besar'] };
BS.jenisSkala = (r, k) => {
  const [[a, b], j] = k == null ? r.p(BSSK_J) : BSSK_J[k % BSSK_J.length], sk = bsSk(a, b), ob = r.p(BSOBJ.concat(['seekor rama-rama', 'sebuah bangunan']));
  const claim = j === 'k' ? 'lebih besar' : 'lebih kecil', nv = bsFr(a, b);
  const ans = j === 'k' ? `${BSJ_TXT.k[0]}, kerana n = ${nv} > 1` : j === 's' ? `${BSJ_TXT.s[0]}, kerana n = 1` : `${BSJ_TXT.b[0]}, kerana 0 < n = ${nv} < 1`;
  return GEN_LQ('jenisSkala', { sk, ob, claim, ans, work: [`n = ${nv}`, j === 'k' ? 'n > 1: ukuran lukisan = ukuran sebenar ÷ n, lebih kecil.' : j === 's' ? 'n = 1: ukuran lukisan = ukuran sebenar.' : `0 < n < 1: ukuran lukisan = ukuran sebenar × ${bsFr(b, a)}, lebih besar.`] });
};
BS.sebenar = r => {
  let n, d; do { n = r.p(BSN_PELAN); d = r.p([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 1.5, 2.5, 3.5, 4.5, 6.5, 7.5]); } while (!bsTidy(d * n / 100, 2));
  const R = d * n / 100, ctx = r.p(['dewan', 'koridor', 'padang', 'kolam renang', 'bilik darjah', 'kantin']);
  return GEN_LQ('sebenar', { d, n, sk: bsSk(n), ctx, ans: bsM(R), work: [`Ukuran sebenar = ukuran lukisan × n`, `= ${bsN(d)} × ${bsN(n)} = ${bsN(d * n)} cm`, `= ${bsN(R)} m`] }, { fig: bsBarFig(d, bsCm(d), `Skala ${bsSk(n)}`) });
};
BS.lukisan = r => {
  let n, d; do { n = r.p(BSN_PELAN); d = r.p([2, 3, 4, 5, 6, 8, 10, 12, 1.5, 2.5, 4.5, 7.5]); } while (!bsTidy(d * n / 100, 2) || d * n / 100 < 1);
  const R = d * n / 100, ctx = r.p(['dewan', 'pagar', 'tembok', 'balkoni', 'jambatan kecil', 'landasan']);
  return GEN_LQ('lukisan', { R, n, sk: bsSk(n), ctx, ans: bsCm(d), work: [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Ukuran lukisan = ukuran sebenar ÷ n = ${bsN(R * 100)} ÷ ${bsN(n)}`, `= ${bsN(d)} cm`] });
};
BS.cariSkala = (r, kind) => {
  kind = kind || r.p(['m', 'm', 'km', 'besar']);
  let dcm, rcm, dt, rt, thing, wrong;
  if (kind === 'm') { const n = r.p(BSN_PELAN); dcm = r.p([2, 4, 5, 6, 8, 10, 12, 15]); rcm = dcm * n; if (!bsTidy(rcm / 100, 2)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsM(rcm / 100); thing = r.p(['sebuah bas', 'sebuah dewan', 'sebuah bot', 'sebatang tiang', 'sebuah kontena']); wrong = bsSk(rcm / 100, dcm); }
  else if (kind === 'km') { const n = r.p(BSN_PETA); dcm = r.p([2, 3, 4, 5, 6, 8]); rcm = dcm * n; if (!bsTidy(rcm / 100000, 2)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsKm(rcm / 100000); thing = 'jarak dua bandar'; wrong = bsSk(rcm / 100000, dcm); }
  else { const q = r.p([2, 4, 5, 8, 10]); rcm = r.p([0.5, 0.8, 1.2, 1.5, 2, 2.5]); dcm = rcm * q; if (!bsTidy(dcm, 1)) return BS.cariSkala(r, kind); dt = bsCm(dcm); rt = bsCm(rcm); thing = r.p(['seekor semut', 'seekor kumbang', 'sebiji butang']); wrong = bsSk(q, 1); }
  const g = 1, num = Math.round(rcm * 10), den = Math.round(dcm * 10), ans = bsSk(num, den);
  const work = [kind === 'm' ? `${rt} = ${bsN(rcm)} cm` : kind === 'km' ? `${rt} = ${bsN(rcm)} cm` : 'Kedua-dua ukuran sudah dalam cm.', `Skala = ${bsN(dcm)} : ${bsN(rcm)}`, `= 1 : ${bsN(rcm)} ÷ ${bsN(dcm)} = ${ans}`];
  return GEN_LQ('cariSkala', { dt, rt, thing, wrong: wrong === ans ? bsSk(num * 10, den) : wrong, ans, work });
};
BS.peta = r => {
  let n, d; do { n = r.p(BSN_PETA); d = r.p([2, 3, 4, 5, 6, 8, 2.5, 3.5, 4.5, 7.5, 1.5]); } while (!bsTidy(d * n / 100000, 2));
  const km = d * n / 100000, [A, B] = r.p(BSTEMPAT), sk = bsSk(n);
  const work = [`1 cm mewakili ${bsN(n)} cm = ${bsN(n / 100000)} km`, `Jarak sebenar = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`];
  const o = GEN_LQ('peta', { d, n, km, sk, A, B, ans: bsKm(km), work }, { fig: bsMapFig(A, B, bsCm(d), sk) });
  if (o.q.startsWith('Jarak sebenar antara')) { o.ans = bsCm(d); o.work = [`${bsN(km)} km = ${bsN(km * 100000)} cm`, `Jarak pada peta = ${bsN(km * 100000)} ÷ ${bsN(n)} = ${bsN(d)} cm`]; o.fig = bsMapFig(A, B, '? cm', sk); }
  return o;
};
BS.besar = r => {
  let q, R, d; do { q = r.p([2, 3, 4, 5, 8, 10]); R = r.p([0.5, 0.6, 0.8, 1.2, 1.5, 2, 2.5, 3]); d = R * q; } while (!bsTidy(d, 1) || d > 20);
  const [ob, ukur] = r.p(BSKECIL), sk = bsSk(1, q);
  const o = GEN_LQ('besar', { ob, ukur, sk, d, R, ans: bsCm(R), work: [`Skala ${sk}: ukuran sebenar = ukuran lukisan × 1/${q}`, `= ${bsN(d)} ÷ ${q} = ${bsN(R)} cm`] });
  if (o.q.includes('sebenar sejenis ' + ob + ' ialah')) { o.ans = bsCm(d); o.work = [`Ukuran lukisan = ukuran sebenar ÷ 1/${q} = ukuran sebenar × ${q}`, `= ${bsN(R)} × ${q} = ${bsN(d)} cm`]; }
  else if (o.q.includes('Tentukan skala')) { o.ans = sk; o.work = [`Skala = ${bsN(d)} : ${bsN(R)}`, `= 1 : ${bsN(R)}/${bsN(d)} = ${sk}`]; }
  return o;
};
BS.k412 = r => {
  const [A, B] = r.p(BSTEMPAT);
  let n1, d1, n2, d2; do { n1 = r.p([50000, 100000, 200000, 250000]); d1 = r.p([3, 4, 5, 6, 8, 2.5, 4.5]); d2 = d1 * r.p([2, 0.5, 4, 2.5]); n2 = d1 * n1 / d2; } while (!bsTidy(d1 * n1 / 100000, 2) || !Number.isInteger(n2) || !bsTidy(d2, 1));
  let n, Ld, Wd; do { n = r.p([100, 200, 250, 400, 500]); Ld = r.p([6, 8, 9, 10, 12, 7.5]); Wd = r.p([3, 4, 5, 6, 4.5, 2.5]); } while (Wd >= Ld || !bsTidy(Ld * n / 100, 2) || !bsTidy(Wd * n / 100, 2));
  let a, km, d; do { a = r.p([2, 4, 5]); km = r.p([1, 3, 5, 10, 15]); d = r.p([3, 6, 7, 8, 9, 12, 2.5]); } while (!Number.isInteger(km * 100000 / a) || !bsTidy(d * km / a, 2));
  const nn = km * 100000 / a, [ob] = r.p(BSKECIL);
  let q1, q2, R, e1; do { q1 = r.p([2, 3, 4, 5]); q2 = r.p([2, 3, 4, 6, 8, 10]); R = r.p([0.5, 0.8, 1.2, 1.5, 2, 2.5, 3]); e1 = R * q1; } while (q1 === q2 || !bsTidy(e1, 1) || !bsTidy(R * q2, 1));
  return GEN_LQ('k412', { A, B, n1, d1, d2, n2, Lr: Ld * n / 100, Ld, n, Wd, Wr: Wd * n / 100, a, km, nn, dd: d, Rr: d * nn / 100000, ob, q1, e1, q2, Re: R, e2: R * q2 });
};

/* ---------- 4.1.3 ---------- */
// lukis: mode 'x2' (1 : 1/2), 'd2' (1 : 2), 'x3' (1 : 1/3), 'd15' (1 : 1.5 → × 2/3)
const BSLUKIS = { x2: [1, 2, 'Setiap sisi objek didarab dengan 2', 'Skala 1 : 1/2: ukuran lukisan = ukuran objek ÷ 1/2 = ukuran objek × 2.'], d2: [2, 1, 'Setiap sisi objek dibahagi dengan 2', 'Skala 1 : 2: ukuran lukisan = ukuran objek ÷ 2.'], x3: [1, 3, 'Setiap sisi objek didarab dengan 3', 'Skala 1 : 1/3: ukuran lukisan = ukuran objek × 3.'], d15: [3, 2, 'Setiap sisi objek didarab dengan 2/3', 'Skala 1 : 1.5: ukuran lukisan = ukuran objek ÷ 1.5 = ukuran objek × 2/3.'] };
BS.lukis = (r, mode) => {
  const [ko, kd, how, why] = BSLUKIS[mode], sh = r.p(BSHAPE), L = r.p(['P', 'Q', 'R', 'S', 'K', 'M']);
  const sk = mode === 'x2' ? '1 : 1/2' : mode === 'd2' ? '1 : 2' : mode === 'x3' ? '1 : 1/3' : '1 : 1.5';
  const obj = sh.p.map(([i, j]) => [i * ko, j * ko]), drw = sh.p.map(([i, j]) => [i * kd, j * kd]);
  const ow = Math.max(...obj.map(p => p[0])), oh = Math.max(...obj.map(p => p[1])), dw = Math.max(...drw.map(p => p[0])), dh = Math.max(...drw.map(p => p[1]));
  const tc = Math.max(dw + 3, 8), tr = Math.max(dh + 3, 7), cell = Math.min(22, 300 / tc);
  const lab = len => `${bsN(len)}`;
  const po = { cols: ow + 2, rows: Math.max(oh + 2, tr), cell, title: `Objek ${L}`, tc: 'tr', shapes: [{ pts: obj, c: 'tr', ox: 1, oy: 1, lab: null }] };
  const pt = { cols: tc, rows: tr, cell, title: 'Lukisan', tc: 'am', shapes: [] };
  const fig = bsGridFig([po, pt], `Objek ${L} pada grid dan grid kosong`);
  const figAns = bsGridFig([po, Object.assign({}, pt, { shapes: [{ pts: drw, c: 'am', ox: 1, oy: 1, lab }] })], `Objek ${L} dan lukisan berskalanya`);
  return GEN_LQ('lukis', { L, sk, nm: sh.n, ans: `${how}: lebar ${ow} cm → ${dw} cm, tinggi ${oh} cm → ${dh} cm (lihat rajah jawapan)`, work: [why, 'Mulakan dari satu bucu, kira petak bagi setiap sisi dan kekalkan semua sudut.'] }, { kind: 'lukis', fig, figAns });
};
BS.ukuranLukisan = r => {
  let n, dl, dw; do { n = r.p([100, 200, 250, 400, 500, 1000, 50]); dl = r.p([4, 5, 6, 8, 10, 12, 7.5, 4.5]); dw = r.p([2, 3, 4, 5, 6, 2.5, 3.5]); } while (dw >= dl || !bsTidy(dl * n / 100, 2) || !bsTidy(dw * n / 100, 2));
  const L = dl * n / 100, W = dw * n / 100, tp = r.p(L < 12 ? BSLUAS_S : BSLUAS), sk = bsSk(n);
  return GEN_LQ('ukuranLukisan', { tp, L, W, n, sk, ans: `${bsCm(dl)} × ${bsCm(dw)}`, work: [`${bsN(L)} m = ${bsN(L * 100)} cm, ${bsN(W)} m = ${bsN(W * 100)} cm`, `Panjang lukisan = ${bsN(L * 100)} ÷ ${bsN(n)} = ${bsN(dl)} cm`, `Lebar lukisan = ${bsN(W * 100)} ÷ ${bsN(n)} = ${bsN(dw)} cm`] });
};
// pelan L pada grid: lebar W, tinggi H, takuk (cw, ch) di bucu kanan atas
function bsLShape(r) {
  const W = r.i(4, 7), H = r.i(3, 5), cw = r.i(1, W - 2), ch = r.i(1, H - 2);
  return { W, H, cw, ch, pts: [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]] };
}
BS.bacaGrid = r => {
  const s = bsLShape(r), n = r.p([100, 200, 250, 300, 400, 500, 1000]);
  const V = ['A', 'B', 'C', 'D', 'E', 'F'], k = r.i(0, 5), a = s.pts[k], b = s.pts[(k + 1) % 6], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const fig = bsGridFig([{ cols: s.W + 2, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1, vl: s.pts.map((p, i) => [i, V[i]]) }] }], 'Pelan tanah berbentuk L pada grid');
  return GEN_LQ('bacaGrid', { sk: bsSk(n), P1: V[k], P2: V[(k + 1) % 6], ans: bsM(len * n / 100), work: [`${V[k]}${V[(k + 1) % 6]} = ${len} petak = ${len} cm pada pelan`, `Panjang sebenar = ${len} × ${bsN(n)} = ${bsN(len * n)} cm`, `= ${bsN(len * n / 100)} m`] }, { fig });
};
const BSGRID = [[1, 2], [1, 0.5], [2, 1], [1, 3], [2, 0.5], [0.5, 1], [0.5, 2], [2, 3], [3, 1]];
BS.gridBeza = r => {
  const [a, b] = r.p(BSGRID), ans = bsSk(Math.round(a * 10), Math.round(b * 10)), sh = r.p(BSHAPE);
  const cA = 15 * a > 34 ? 34 : 15 * a, cB = 15 * b > 34 ? 34 : 15 * b, sz = Math.max(...sh.p.flat()) + 2;
  const fig = bsGridFig([{ cols: sz + 1, rows: sz, cell: cA * (a >= b ? 1 : 1), title: `Objek (petak ${bsN(a)} cm)`, tc: 'tr', shapes: [{ pts: sh.p, c: 'tr', ox: 1, oy: 1 }] }, { cols: sz + 1, rows: sz, cell: cB, title: `Lukisan (petak ${bsN(b)} cm)`, tc: 'am', shapes: [{ pts: sh.p, c: 'am', ox: 1, oy: 1 }] }], 'Objek dan lukisan pada grid berlainan saiz');
  return GEN_LQ('gridBeza', { a, b, ans, work: [`Skala = sisi petak lukisan : sisi petak objek = ${bsN(b)} : ${bsN(a)}`, `= 1 : ${bsN(a)} ÷ ${bsN(b)} = ${ans}`, b > a ? 'Lukisan dibesarkan.' : 'Lukisan dikecilkan.'] }, { fig });
};
BS.bentukL = r => {
  const n = r.p([100, 200, 250, 400, 500]), s = bsLShape(r);
  const u = r.p([1, 2, 3, 4, 5]); // 1 petak = u m sebenar
  const a = s.W * u, b = s.H * u, c = (s.W - s.cw) * u, d = (s.H - s.ch) * u;
  const dl = x => x * 100 / n;
  if (![a, b, c, d].every(x => bsTidy(dl(x), 2))) return BS.bentukL(r);
  const sk = bsSk(n);
  const fig = bsGridFig([{ cols: s.W + 4, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1 }], marks: [{ i: 1 + s.W / 2, j: 1 + s.H + .5, s: bsM(a), c: 'gr', sz: 14 }, { i: .5, j: 1 + s.H / 2, s: bsM(b), c: 'gr', sz: 14 }, { i: 1 + (s.W - s.cw) / 2, j: .5, s: bsM(c), c: 'gr', sz: 14 }, { i: 1 + s.W + 1.3, j: 1 + s.ch + (s.H - s.ch) / 2, s: bsM(d), c: 'gr', sz: 14 }] }], 'Tanah berbentuk L dengan ukuran sebenar');
  return GEN_LQ('bentukL', { a, b, c, d, sk, ans: `${bsM(a)} → ${bsCm(dl(a))}, ${bsM(b)} → ${bsCm(dl(b))}, ${bsM(c)} → ${bsCm(dl(c))}, ${bsM(d)} → ${bsCm(dl(d))}`, work: [`Ukuran lukisan = ukuran sebenar (cm) ÷ ${bsN(n)}`, `${bsN(a * 100)} ÷ ${bsN(n)} = ${bsN(dl(a))} cm; ${bsN(b * 100)} ÷ ${bsN(n)} = ${bsN(dl(b))} cm`, `${bsN(c * 100)} ÷ ${bsN(n)} = ${bsN(dl(c))} cm; ${bsN(d * 100)} ÷ ${bsN(n)} = ${bsN(dl(d))} cm`] }, { fig });
};
BS.k413 = r => {
  const s = bsLShape(r), n = r.p([100, 200, 300, 400, 500]), u = n / 100;
  const P = 2 * (s.W + s.H) * u, A = (s.W * s.H - s.cw * s.ch) * u * u;
  const fig = bsGridFig([{ cols: s.W + 2, rows: s.H + 2, cell: 26, shapes: [{ pts: s.pts, c: 'gr', ox: 1, oy: 1, lab: len => `${len}` }] }], 'Pelan tanah berbentuk L');
  let L, W, n1, n2; do { L = r.p([4, 5, 6, 8, 10, 12]); W = r.p([2, 3, 4, 5, 6]); n1 = r.p([100, 200, 400, 500]); n2 = n1 * r.p([2, 0.5, 4, 2.5]); } while (W >= L || !Number.isInteger(n2) || !bsTidy(L * n1 / n2, 1) || !bsTidy(W * n1 / n2, 1));
  let a, b, w, h; do { [a, b] = r.p([[1, 2], [1, 3], [2, 1], [1, 0.5], [0.5, 1.5]]); w = r.i(2, 5); h = r.i(2, 4); } while (w === h);
  const k = bsFr(Math.round(b * 10) ** 2, Math.round(a * 10) ** 2), sk3 = bsSk(Math.round(a * 10), Math.round(b * 10));
  const v = vq('k413', { sk: bsSk(n), n, P, A, L, W, n1, n2, L2: L * n1 / n2, W2: W * n1 / n2, RL: L * n1 / 100, RW: W * n1 / 100, a, b, w, h, k, sk3, A1: w * a * h * a, A2: w * b * h * b });
  let work = v.work;
  if (v.q.includes('berbentuk L')) work = [`1 cm pada pelan mewakili ${bsN(n)} cm = ${bsN(u)} m`, `(a) Perimeter pada pelan = 2 × (${s.W} + ${s.H}) = ${2 * (s.W + s.H)} cm; sebenar = ${2 * (s.W + s.H)} × ${bsN(u)} = ${bsN(P)} m`, `(b) Luas pada pelan = ${s.W} × ${s.H} − ${s.cw} × ${s.ch} = ${s.W * s.H - s.cw * s.ch} cm²`, `Luas sebenar = ${s.W * s.H - s.cw * s.ch} × ${bsN(u)}² = ${bsN(A)} m²`];
  return Object.assign({ q: v.q, ans: v.ans, work }, v.q.includes('berbentuk L') ? { fig } : {});
};

/* ---------- 4.1.4 ---------- */
// ukuran pelan (cm) yang menghasilkan ukuran sebenar kemas
function bsPlanDims(r, big) {
  let n, l, w, L, W; do {
    n = r.p(big ? [200, 250, 400, 500] : [100, 200, 250]); l = r.p([2, 3, 4, 5, 6, 2.5, 3.5, 4.5, 1.5]); w = r.p([1.5, 2, 2.5, 3, 4, 1.2]); L = l * n / 100; W = w * n / 100;
  } while (w >= l || !bsTidy(L, 2) || !bsTidy(W, 2) || !bsTidy(L * W, 1) || (!big && (L > 8 || W < 2.4)) || (big && L < 8));
  return { n, l, w, L, W };
}
BS.luasBilik = r => {
  const { n, l, w, L, W } = bsPlanDims(r), bl = r.p(BSBILIK), sk = bsSk(n), A = L * W;
  return GEN_LQ('luasBilik', { bl, l, w, sk, wrong: bsM2(l * w * n / 10000) === bsM2(A) ? bsM2(A * 2) : `${bsN(l * w * n)} cm²`, ans: bsM2(A), work: [`1 cm mewakili ${bsN(n)} cm = ${bsN(n / 100)} m`, `Panjang sebenar = ${bsN(l)} × ${bsN(n / 100)} = ${bsN(L)} m; lebar sebenar = ${bsN(w)} × ${bsN(n / 100)} = ${bsN(W)} m`, `Luas sebenar = ${bsN(L)} × ${bsN(W)} = ${bsN(A)} m²`] }, { fig: bsPlanFig([{ w: l, h: w, t: vcap(bl), c: 'pk' }], sk) });
};
BS.laluan = r => {
  let n, d1, d2; do { n = r.p(BSN_PETA.slice(2)); d1 = r.p([2, 3, 4, 5, 2.5, 3.5, 1.5]); d2 = r.p([2, 3, 4, 6, 4.5, 1.5]); } while (!bsTidy((d1 + d2) * n / 100000, 2) || !bsTidy(d1 * n / 100000, 2) || !bsTidy(d2 * n / 100000, 2));
  const [A, B] = r.p(BSTEMPAT), C = r.p(['Simpang Empat', 'Pekan Rabu', 'Batu Lima', 'Jambatan']), sk = bsSk(n), k1 = n / 100000;
  return GEN_LQ('laluan', { A, B, C, d1, d2, sk, ans: bsKm((d1 + d2) * k1), work: [`Jumlah jarak pada peta = ${bsN(d1)} + ${bsN(d2)} = ${bsN(d1 + d2)} cm`, `1 cm mewakili ${bsN(n)} cm = ${bsN(k1)} km`, `Jarak sebenar = ${bsN(d1 + d2)} × ${bsN(k1)} = ${bsN((d1 + d2) * k1)} km`] }, { fig: bsMapFig(A, B, '', sk, { C, d1: bsCm(d1), d2: bsCm(d2) }) });
};
BS.model = r => {
  const [thing, Rs] = r.p([['kereta', [4, 4.5, 3.6, 4.2]], ['bas', [12, 10, 9]], ['kapal terbang', [36, 40, 30]], ['lori', [8, 9, 7.2]], ['bot', [6, 4.8, 7.5]], ['kereta api', [20, 24, 18]]]);
  let R, n, ml; do { R = r.p(Rs); n = r.p([10, 12, 18, 20, 24, 25, 30, 40, 50, 100, 200]); ml = R * 100 / n; } while (!bsTidy(ml, 1) || ml < 5 || ml > 60);
  const v = vq('model', { thing, ml, R, n });
  let ans, work;
  if (v.q.startsWith('Panjang sebuah model')) { ans = bsSk(n); work = [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Skala = ${bsN(ml)} : ${bsN(R * 100)} = 1 : ${bsN(n)}`]; }
  else if (v.q.includes('berapakah panjang model')) { ans = bsCm(ml); work = [`${bsN(R)} m = ${bsN(R * 100)} cm`, `Panjang model = ${bsN(R * 100)} ÷ ${bsN(n)} = ${bsN(ml)} cm`]; }
  else { ans = bsM(R); work = [`Panjang sebenar = ${bsN(ml)} × ${bsN(n)} = ${bsN(ml * n)} cm`, `= ${bsN(R)} m`]; }
  return { q: v.q, ans, work };
};
BS.luasN = r => {
  let n, Ad; do { n = r.p([10, 20, 50, 100, 200, 250, 500, 1000]); Ad = r.p([4, 5, 6, 8, 9, 12, 15, 20, 24, 2.5, 7.5]); } while (!bsTidy(Ad * n * n / 10000, 2));
  const Ar = Ad * n * n / 10000, sk = bsSk(n), tp = r.p(BSLUAS);
  const v = vq('luasN', { Ad, Ar, n, sk, tp, ans: bsM2(Ar) });
  let ans = v.ans, work = [`Luas sebenar = luas lukisan × n² = ${bsN(Ad)} × ${bsN(n)}²`, `= ${bsN(Ad * n * n)} cm²`, `= ${bsN(Ad * n * n)} ÷ 10${' '}000 = ${bsN(Ar)} m²`];
  if (v.q.startsWith('Luas sebenar')) { ans = bsCm2(Ad); work = [`${bsN(Ar)} m² = ${bsN(Ar * 10000)} cm²`, `Luas lukisan = luas sebenar ÷ n² = ${bsN(Ar * 10000)} ÷ ${bsN(n * n)}`, `= ${bsN(Ad)} cm²`]; }
  else if (v.work && v.work.length && v.q.includes('Adakah')) work = v.work.slice(0, 1).concat(work);
  return { q: v.q, ans, work };
};
BS.kos = r => {
  const v0 = vq('kos', { bl: '#B', tp: '#T', l: 0, w: 0, sk: '#S', n: 0, h: 0 }), per = v0.q.includes('memagar');
  const { n, l, w, L, W } = bsPlanDims(r, per), bl = r.p(BSBILIK), tp = r.p(BSLUAS), sk = bsSk(n);
  const v = { q: QV.kos.find(f => { const t = f({ bl: '#B', tp: '#T', l: 0, w: 0, sk: '#S', n: 0, h: 0 }).q; return t === v0.q; })({ bl, tp, l, w, sk, n, h: 0 }).q };
  const h = per ? r.p([15, 20, 25, 30, 40]) : r.p([20, 25, 30, 35, 40, 45, 50, 60]);
  const q = v.q.replace(/RM0/g, `RM${h}`), A = L * W, Pm = 2 * (L + W);
  if (per) return { q, ans: bsRM(Pm * h), work: [`Panjang sebenar = ${bsN(l)} × ${bsN(n)} = ${bsN(l * n)} cm = ${bsN(L)} m; lebar sebenar = ${bsN(w * n)} cm = ${bsN(W)} m`, `Perimeter = 2 × (${bsN(L)} + ${bsN(W)}) = ${bsN(Pm)} m`, `Kos = ${bsN(Pm)} × RM${h} = ${bsRM(Pm * h)}`] };
  return { q, ans: bsRM(A * h), work: [`Panjang sebenar = ${bsN(l)} × ${bsN(n)} = ${bsN(l * n)} cm = ${bsN(L)} m; lebar sebenar = ${bsN(w * n)} cm = ${bsN(W)} m`, `Luas = ${bsN(L)} × ${bsN(W)} = ${bsN(A)} m²`, `Kos = ${bsN(A)} × RM${h} = ${bsRM(A * h)}`] };
};
BS.masa = r => {
  let n, d, v; do { n = r.p([100000, 200000, 250000, 500000]); d = r.p([2, 3, 4, 5, 6, 8, 2.5, 4.5, 7.5]); v = r.p([40, 45, 50, 60, 72, 80, 90]); } while (!Number.isInteger(d * n / 100000 / v * 60) || !bsTidy(d * n / 100000, 2));
  const km = d * n / 100000, t = km / v * 60, [A, B] = r.p(BSTEMPAT), sk = bsSk(n);
  const o = vq('masa', { A, B, d, sk, v, t });
  if (o.q.includes('laju purata bas')) return { q: o.q, ans: `${bsN(v)} km/j`, work: [`Jarak sebenar = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`, `${t} minit = ${bsFr(t, 60)} jam`, `Laju = ${bsN(km)} ÷ ${bsFr(t, 60)} = ${bsN(km)} × ${bsFr(60, t)} = ${bsN(v)} km/j`] };
  return { q: o.q, ans: `${bsN(t)} minit`, work: [`Jarak sebenar = ${bsN(d)} × ${bsN(n / 100000)} = ${bsN(km)} km`, `Masa = ${bsN(km)} ÷ ${v} = ${bsFr(Math.round(km * 100), v * 100)} jam`, `= ${bsFr(Math.round(km * 100), v * 100)} × 60 = ${bsN(t)} minit`] };
};
BS.k414 = r => {
  // (1) dua bilik + kos
  let p1, p2; do { p1 = bsPlanDims(r); p2 = bsPlanDims(r); p2.n = p1.n; p2.L = p2.l * p1.n / 100; p2.W = p2.w * p1.n / 100; } while (!bsTidy(p2.L, 2) || !bsTidy(p2.W, 2) || !bsTidy(p2.L * p2.W, 1) || p2.L > 8 || p2.W < 2.4 || (p1.l === p2.l && p1.w === p2.w));
  const [t1, t2] = bsShuf(r, BSBILIK).slice(0, 2), h1 = r.p([25, 30, 35, 40, 45]);
  // (2) dua laluan
  let n2, d1, d2, d3, v; do { n2 = r.p([100000, 200000, 250000]); d1 = r.p([5, 6, 7, 8, 9]); d2 = r.p([3, 4, 5, 2.5]); d3 = r.p([3, 4, 5, 3.5]); v = r.p([40, 50, 60, 80]); } while (d2 + d3 <= d1 || !Number.isInteger((d2 + d3 - d1) * n2 / 100000 / v * 60));
  const [A, B] = r.p(BSTEMPAT), C = r.p(['Simpang Empat', 'Pekan Rabu', 'Batu Lima']);
  // (3) pagar
  let n3, l3, w3, g; do { n3 = r.p([200, 250, 400, 500]); l3 = r.p([4, 5, 6, 8, 4.5]); w3 = r.p([2, 3, 4, 2.5]); g = r.p([1, 1.5, 2, 3]); } while (w3 >= l3 || !bsTidy(l3 * n3 / 100, 2) || !bsTidy(w3 * n3 / 100, 2));
  const h3 = r.p([15, 20, 25, 30]);
  const d = { sk: bsSk(p1.n), n: p1.n, r1: { t: t1, l: p1.l, w: p1.w }, r2: { t: t2, l: p2.l, w: p2.w }, h: h1 };
  const v1 = vq('k414', Object.assign(d, { A, B, C, d1, d2, d3, v, l: l3, w: w3, g }));
  if (v1.q.startsWith('Pelan sebuah rumah')) {
    const a1 = p1.L * p1.W, a2 = p2.L * p2.W;
    return { q: v1.q, ans: `(a) ${vcap(t1)}: ${bsM2(a1)}, ${t2}: ${bsM2(a2)} (b) ${bsRM((a1 + a2) * h1)}`, work: [`1 cm mewakili ${bsN(p1.n / 100)} m`, `(a) ${vcap(t1)}: ${bsN(p1.L)} m × ${bsN(p1.W)} m = ${bsN(a1)} m²; ${t2}: ${bsN(p2.L)} m × ${bsN(p2.W)} m = ${bsN(a2)} m²`, `(b) Jumlah luas = ${bsN(a1 + a2)} m²; kos = ${bsN(a1 + a2)} × RM${h1} = ${bsRM((a1 + a2) * h1)}`] };
  }
  if (v1.q.startsWith('Pada peta')) {
    const q = v1.q.replace(/skala 1 : [\d ]+/, `skala ${bsSk(n2)}`), k = n2 / 100000, R1 = d1 * k, R2 = (d2 + d3) * k, save = (R2 - R1) / v * 60;
    return { q, ans: `(a) Laluan pertama ${bsKm(R1)}, laluan kedua ${bsKm(R2)} (b) ${bsN(save)} minit`, work: [`1 cm mewakili ${bsN(k)} km`, `(a) Laluan pertama = ${bsN(d1)} × ${bsN(k)} = ${bsN(R1)} km; laluan kedua = (${bsN(d2)} + ${bsN(d3)}) × ${bsN(k)} = ${bsN(R2)} km`, `(b) Beza jarak = ${bsN(R2 - R1)} km; masa dijimatkan = ${bsN(R2 - R1)} ÷ ${v} × 60 = ${bsN(save)} minit`] };
  }
  const q = v1.q.replace(/skala 1 : [\d ]+/, `skala ${bsSk(n3)}`).replace(/RM\d+ semeter/, `RM${h3} semeter`), L = l3 * n3 / 100, W = w3 * n3 / 100, P = 2 * (L + W);
  return { q, ans: `(a) ${bsM(P)} (b) ${bsRM((P - g) * h3)}`, work: [`Panjang sebenar = ${bsN(l3)} × ${bsN(n3)} = ${bsN(l3 * n3)} cm = ${bsN(L)} m; lebar = ${bsN(w3 * n3)} cm = ${bsN(W)} m`, `(a) Perimeter = 2 × (${bsN(L)} + ${bsN(W)}) = ${bsN(P)} m`, `(b) Panjang pagar = ${bsN(P)} − ${bsN(g)} = ${bsN(P - g)} m; kos = ${bsN(P - g)} × RM${h3} = ${bsRM((P - g) * h3)}`] };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '4.1.1': {
    m: [() => BS.nisbah(bsRG), () => BS.kali(bsRG), () => BS.kenal(bsRG), () => BS.sisiHilang(bsRG), () => BS.bs(bsRG, BSBS1)],
    s: [() => BS.semak(bsRG), () => BS.segitiga(bsRG)],
    k: [() => BS.k411(bsRG)]
  },
  '4.1.2': {
    m: [() => BS.tafsir(bsRG), () => BS.jenisSkala(bsRG), () => BS.sebenar(bsRG), () => BS.lukisan(bsRG), () => BS.bs(bsRG, BSBS2)],
    s: [() => BS.cariSkala(bsRG), () => BS.peta(bsRG), () => BS.besar(bsRG)],
    k: [() => BS.k412(bsRG)]
  },
  '4.1.3': {
    m: [() => BS.lukis(bsRG, pick(['x2', 'd2'])), () => BS.ukuranLukisan(bsRG), () => BS.bacaGrid(bsRG)],
    s: [() => BS.gridBeza(bsRG), () => BS.lukis(bsRG, pick(['x3', 'd15'])), () => BS.bentukL(bsRG)],
    k: [() => BS.k413(bsRG)]
  },
  '4.1.4': {
    m: [() => BS.luasBilik(bsRG), () => BS.laluan(bsRG), () => BS.model(bsRG)],
    s: [() => BS.luasN(bsRG), () => BS.kos(bsRG), () => BS.masa(bsRG)],
    k: [() => BS.k414(bsRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 4.1.1
WG.nisbahK = () => BS.nisbah(bsRW, false);
WG.nisbahB = () => BS.nisbah(bsRW, true);
WG.kali = () => BS.kali(bsRW);
WG.kenal = () => BS.kenal(bsRW);
WG.sisiHilang = () => BS.sisiHilang(bsRW);
WG.bs1 = i => BS.bs(bsRW, BSBS1, [1, 2][i % 2] + wri(0, 1) * 4);
WG.semak = i => BS.semak(bsRW, i % 2 === 0);
WG.segitiga = () => BS.segitiga(bsRW);
WG.k411 = () => BS.k411(bsRW);
// 4.1.2
WG.tafsir = () => BS.tafsir(bsRW);
WG.jenisSkala = i => BS.jenisSkala(bsRW, [0, 4, 3, 6, 8][i % 5]);
WG.sebenar = () => BS.sebenar(bsRW);
WG.lukisan = () => BS.lukisan(bsRW);
WG.bs2 = i => BS.bs(bsRW, BSBS2, [1, 5][i % 2] + wri(0, 1) * 2);
WG.cariSkala = i => BS.cariSkala(bsRW, ['m', 'km', 'besar', 'm'][i % 4]);
WG.peta = () => BS.peta(bsRW);
WG.besar = () => BS.besar(bsRW);
WG.k412 = () => BS.k412(bsRW);
// 4.1.3
WG.lukisM = i => BS.lukis(bsRW, ['x2', 'd2'][i % 2]);
WG.lukisS = i => BS.lukis(bsRW, ['x3', 'd15'][i % 2]);
WG.ukuranLukisan = () => BS.ukuranLukisan(bsRW);
WG.bacaGrid = () => BS.bacaGrid(bsRW);
WG.gridBeza = () => BS.gridBeza(bsRW);
WG.bentukL = () => BS.bentukL(bsRW);
WG.k413 = () => BS.k413(bsRW);
// 4.1.4
WG.luasBilik = () => BS.luasBilik(bsRW);
WG.laluan = () => BS.laluan(bsRW);
WG.model = () => BS.model(bsRW);
WG.luasN = () => BS.luasN(bsRW);
WG.kos = () => BS.kos(bsRW);
WG.masa = () => BS.masa(bsRW);
WG.k414 = () => BS.k414(bsRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '4.1.1': [['m', 'nisbahK', 3], ['m', 'nisbahB', 2], ['m', 'kali', 4], ['m', 'kenal', 4], ['m', 'sisiHilang', 3], ['m', 'bs1', 2], ['s', 'semak', 5], ['s', 'segitiga', 4], ['k', 'k411', 3]],
  '4.1.2': [['m', 'tafsir', 5], ['m', 'jenisSkala', 4], ['m', 'sebenar', 4], ['m', 'lukisan', 3], ['m', 'bs2', 2], ['s', 'cariSkala', 4], ['s', 'peta', 3], ['s', 'besar', 2], ['k', 'k412', 3]],
  '4.1.3': [['m', 'lukisM', 5], ['m', 'ukuranLukisan', 7], ['m', 'bacaGrid', 6], ['s', 'gridBeza', 3], ['s', 'lukisS', 3], ['s', 'bentukL', 3], ['k', 'k413', 3]],
  '4.1.4': [['m', 'luasBilik', 6], ['m', 'laluan', 6], ['m', 'model', 6], ['s', 'luasN', 3], ['s', 'kos', 3], ['s', 'masa', 3], ['k', 'k414', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan teks unik: jawapan + calon (diambil 3 yang berbeza), ditambah dengan fn isi jika kurang
function bsOpts(ans, cands, fill) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || /NaN|undefined|Infinity/.test(String(c))) continue; if (!seen.has(c)) { seen.add(c); w.push(c); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const c = fill(k); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const bsMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const bsNF = (v, u) => `${bsN(v)} ${u}`;
const CQGEN = {
  maksud: [
    () => { const d = bsKenalData(bsRG); return { type: 'mcq', q: 'Lukisan manakah ialah <b>lukisan berskala</b> bagi objek?', fig: d.fig, opts: ['A', 'B', 'C'].concat([]).slice(0, 3).concat(['Tiada']), c: 'ABC'.indexOf(d.X) }; },
    () => { const { k, a, b, a2, b2 } = bsPair(bsRG); return bsMcq('Nisbah ukuran lukisan kepada ukuran objek ialah', bsRects([{ w: a, h: b, c: 'tr', t: 'Objek', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Lukisan', wl: bsCm(a2), hl: bsCm(b2) }]), bsOpts(bsRatio(k), [[k[1], k[0]], [1, a], [k[0], k[1] + 1], [k[0] + 1, k[1]], [k[0], 2 * k[1] + 1]].map(([x, y]) => { const g = bsGcd(x, y); return x === y ? null : bsRatio([x / g, y / g]); }), i => bsRatio([1, k[1] + i + 1]))); },
    () => { const { k, a, b, a2, b2 } = bsPair(bsRG); return bsMcq(`Objek ${a} cm × ${b} cm. Lukisan berskala panjangnya ${bsN(a2)} cm. Berapakah lebarnya?`, bsRects([{ w: a, h: b, c: 'tr', t: 'Objek', wl: bsCm(a), hl: bsCm(b) }, { w: a2, h: b2, c: 'am', t: 'Lukisan', wl: bsCm(a2), hl: '?' }]), bsOpts(bsCm(b2), [bsCm(b + a2 - a), bsCm(b * k[1] / k[0]), bsCm(b2 + 1), bsCm(Math.max(1, b2 - 1)), bsCm(a2 * a / b)].filter(s => /^\d+(\.\d)? cm$/.test(s)), i => bsCm(b2 + i + 1))); }
  ],
  skala: [
    () => { const n = pick(BSN_PELAN.concat(BSN_PETA)); return bsMcq(`Skala <b>${bsSk(n)}</b> bermaksud 1 cm pada lukisan mewakili`, bsBarFig(1, '1 cm', `Skala ${bsSk(n)}`), bsOpts(bsRu(n), [bsRu(n * 10), bsRu(n / 10 >= 1 ? n / 10 : n * 100), `${bsN(n)} m`, `${bsN(n)} km`, bsRu(n * 100)], i => bsRu(n * (i + 2)))); },
    () => { const [[a, b], j] = pick(BSSK_J); return bsMcq(`Lukisan berskala <b>${bsSk(a, b)}</b> adalah`, bsBarFig(3, 'lukisan', `Skala ${bsSk(a, b)}`), bsOpts(['Lebih kecil daripada objek', 'Sama saiz dengan objek', 'Lebih besar daripada objek'][{ k: 0, s: 1, b: 2 }[j]], ['Lebih kecil daripada objek', 'Sama saiz dengan objek', 'Lebih besar daripada objek', 'Tidak dapat ditentukan'], () => 'Tidak dapat ditentukan')); },
    () => {
      const kind = pick(['m', 'km', 'besar']); let d, R, rt, wrong;
      if (kind === 'm') { const n = pick([20, 25, 40, 50, 100, 200, 250, 500]); d = pick([2, 4, 5, 8, 10]); R = d * n; rt = bsM(R / 100); wrong = bsSk(R / 100, d); }
      else if (kind === 'km') { const n = pick([20000, 50000, 100000, 200000]); d = pick([2, 3, 4, 5]); R = d * n; rt = bsKm(R / 100000); wrong = bsSk(R / 100000, d); }
      else { const q = pick([2, 4, 5, 10]); R = pick([0.5, 1, 1.5, 2]); d = R * q; rt = bsCm(R); wrong = bsSk(q); }
      const ans = bsSk(Math.round(R * 10), Math.round(d * 10)), rev = `${bsFr(Math.round(R * 10), Math.round(d * 10))} : 1`;
      return bsMcq(`Lukisan <b>${bsCm(d)}</b> mewakili <b>${rt}</b>. Skala lukisan ialah`, bsBarFig(d, bsCm(d), 'Lukisan'), bsOpts(ans, [wrong, rev, bsSk(Math.round(R * 100), Math.round(d * 10)), bsSk(Math.round(d * 10), Math.round(R * 10))], i => bsSk(i * 25)));
    }
  ],
  lukis: [
    () => { let n, d; do { n = pick(BSN_PELAN); d = pick([2, 3, 4, 5, 6, 8, 2.5, 1.5]); } while (!bsTidy(d * n / 100, 2)); const R = d * n / 100; return bsMcq(`Panjang sebenar = <b>${bsN(R)} m</b>, skala <b>${bsSk(n)}</b>. Berapakah panjang lukisan?`, bsBarFig(d, '? cm', `Skala ${bsSk(n)}`), bsOpts(bsCm(d), [bsCm(R * n), bsCm(R / n), bsCm(d * 10), bsCm(d / 10), bsCm(d + 1)], i => bsCm(d + i + 1))); },
    () => { let n, d; do { n = pick(BSN_PELAN); d = pick([2, 3, 4, 5, 6, 8, 2.5, 1.5, 3.5]); } while (!bsTidy(d * n / 100, 2)); const R = d * n / 100; return bsMcq(`Pada lukisan berskala <b>${bsSk(n)}</b>, panjang = <b>${bsN(d)} cm</b>. Berapakah panjang sebenar?`, bsBarFig(d, bsCm(d), `Skala ${bsSk(n)}`), bsOpts(bsM(R), [bsM(R * 10), bsM(R / 10), bsM(d * n), bsCm(d / n), bsM(R + 1)], i => bsM(R + i + 1))); },
    () => { const [a, b] = pick(BSGRID), ans = bsSk(Math.round(a * 10), Math.round(b * 10)), sh = pick(BSHAPE); const sz = Math.max(...sh.p.flat()) + 2; return bsMcq(`Objek pada grid <b>${bsN(a)} cm</b> disalin ke grid <b>${bsN(b)} cm</b> (bilangan petak sama). Skalanya ialah`, bsGridFig([{ cols: sz, rows: sz, cell: Math.min(34, 15 * a), title: `${bsN(a)} cm`, tc: 'tr', shapes: [{ pts: sh.p, c: 'tr', ox: 1, oy: 1 }] }, { cols: sz, rows: sz, cell: Math.min(34, 15 * b), title: `${bsN(b)} cm`, tc: 'am', shapes: [{ pts: sh.p, c: 'am', ox: 1, oy: 1 }] }]), bsOpts(ans, [bsSk(Math.round(b * 10), Math.round(a * 10)), bsSk(Math.round(a * b * 10), 10), '1 : 1', bsSk(Math.round(a * 20), Math.round(b * 10))], i => bsSk(i + 4))); }
  ],
  masalah: [
    () => { let n, d; do { n = pick(BSN_PETA); d = pick([2, 3, 4, 5, 6, 2.5, 3.5]); } while (!bsTidy(d * n / 100000, 2)); const km = d * n / 100000, [A, B] = pick(BSTEMPAT); return bsMcq(`Jarak pada peta = <b>${bsN(d)} cm</b>, skala <b>${bsSk(n)}</b>. Berapakah jarak sebenar?`, bsMapFig(A, B, bsCm(d), bsSk(n)), bsOpts(bsKm(km), [bsKm(km * 10), bsKm(km / 10), bsKm(km * 100), `${bsN(km)} m`, bsKm(n / 100000)], i => bsKm(km + i))); },
    () => { const { n, l, w, L, W } = bsPlanDims(bsRG); return bsMcq(`Pelan berskala <b>${bsSk(n)}</b>: bilik ${bsN(l)} cm × ${bsN(w)} cm. Berapakah luas sebenar?`, bsPlanFig([{ w: l, h: w, t: 'Bilik', c: 'pk' }], bsSk(n)), bsOpts(bsM2(L * W), [bsM2(L * W * 10), bsM2(l * w * n / 100), bsM2(2 * (L + W)), bsM2(L * W / 10), bsM2(L + W)], i => bsM2(L * W + i))); },
    () => { let n, Ad; do { n = pick([10, 20, 50, 100, 200]); Ad = pick([4, 5, 6, 8, 12, 15, 20]); } while (!bsTidy(Ad * n * n / 10000, 2)); const Ar = Ad * n * n / 10000; return bsMcq(`Luas pada lukisan berskala <b>${bsSk(n)}</b> = <b>${bsN(Ad)} cm²</b>. Berapakah luas sebenar?`, bsBarFig(4, `${bsN(Ad)} cm²`, `Skala ${bsSk(n)}`, 'pk'), bsOpts(bsM2(Ar), [bsM2(Ad * n / 100), bsM2(Ad * n / 10000), bsM2(Ar * 10), bsM2(Ar / 10), bsM2(Ad * n)], i => bsM2(Ar * (i + 2)))); }
  ]
};
const CQT = { maksud: 'Maksud lukisan berskala', skala: 'Mentafsir skala', lukis: 'Ukuran lukisan & sebenar', masalah: 'Pelan & peta' };
function bsCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.skala;
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['maksud', 'skala', 'skala', 'lukis', 'masalah'] : Object.keys(CQT);
  return bsCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return bsCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}

/* pecahan bertingkat & punca (25 Nov): semua soalan Latihan, Lembaran, game & kuiz melalui bsBtO */
for (const s in GEN) for (const l in GEN[s]) GEN[s][l] = GEN[s][l].map(f => (...a) => bsBtO(f(...a)));
if (typeof WG === 'object') for (const k in WG) { const f = WG[k]; WG[k] = (...a) => bsBtO(f(...a)); }
{ const c0 = cq, g0 = gq; cq = (...a) => bsBtO(c0(...a)); gq = (...a) => bsBtO(g0(...a)); }
