'use strict';
/* =================== LEMBARAN KERJA: bank 180 soalan tetap =================== */
// Soalan dijana dengan nombor rawak BERBENIH, jadi bank sama setiap kali dibuka.
// Bergantung pada fungsi app.js: plot, fmt, par, P, vec, esc.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let WR = Math.random;
const wri = (a, b) => a + Math.floor(WR() * (b - a + 1));
const wpick = a => a[Math.floor(WR() * a.length)];
const wnz = (a, b) => { let v; do v = wri(a, b); while (v === 0); return v; };
const wcap = s => s[0].toUpperCase() + s.slice(1);
const LET = ['ABC', 'PQR', 'KLM', 'DEF', 'XYZ', 'JKL', 'STU'];

/* ---------- rajah ---------- */
function wsTri(x0, x1, y0, y1) {
  // segi tiga tidak simetri dengan bucu titik grid dalam julat
  for (let t = 0; t < 200; t++) {
    const a = [wri(x0, x1), wri(y0, y1)], b = [wri(x0, x1), wri(y0, y1)], c = [wri(x0, x1), wri(y0, y1)];
    const area2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]));
    const d = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    const s = [d(a, b), d(b, c), d(a, c)];
    if (area2 >= 4 && area2 <= 10 && new Set(s).size === 3 && Math.max(...s) <= 18 && Math.min(...s) >= 4) return [a, b, c];
  }
  return [[x0, y0], [x0 + 2, y0], [x0, y0 + 3]];
}
const offs = (pts, i) => { const g = [pts.reduce((s, p) => s + p[0], 0) / 3, pts.reduce((s, p) => s + p[1], 0) / 3]; const p = pts[i]; let dx = p[0] - g[0], dy = p[1] - g[1]; const L = Math.hypot(dx, dy) || 1; return { dx: Math.round(dx / L * 16) - 6, dy: Math.round(-dy / L * 16) + 6 }; };
function triItems(pts, c, names, dash) {
  return [{ t: 'poly', pts, c, dash }].concat(pts.map((p, i) => Object.assign({ t: 'pt', x: p[0], y: p[1], c, l: names[i] }, offs(pts, i))));
}
const G6 = { x0: -6, x1: 6, y0: -6, y1: 6, u: 30 };
function wsShape(kind, n) {
  const c = 'var(--pk)', st = `style="fill:${c};fill-opacity:.18;stroke:${c}" stroke-width="5" stroke-linejoin="round"`;
  let s = '';
  if (kind === 'poly') { const pts = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n) + i * 2 * Math.PI / n; pts.push((150 + 100 * Math.cos(a)).toFixed(1) + ',' + (150 + 100 * Math.sin(a)).toFixed(1)); } s = `<polygon points="${pts.join(' ')}" ${st}/>`; }
  if (kind === 'rect') s = `<rect x="40" y="95" width="220" height="110" ${st}/>`;
  if (kind === 'rhombus') s = `<polygon points="150,40 230,150 150,260 70,150" ${st}/>`;
  if (kind === 'para') s = `<polygon points="90,90 270,90 210,210 30,210" ${st}/>`;
  if (kind === 'kite') s = `<polygon points="150,30 230,120 150,270 70,120" ${st}/>`;
  if (kind === 'trap') s = `<polygon points="100,90 200,90 260,210 40,210" ${st}/>`;
  if (kind === 'letter') s = `<text x="150" y="222" text-anchor="middle" font-family="Inter, sans-serif" font-size="210" font-weight="800" ${st.replace('stroke-width="5"', 'stroke-width="4"')}>${n}</text>`;
  return `<svg class="shp" viewBox="0 0 300 300" role="img" aria-label="Bentuk">${s}</svg>`;
}

/* ---------- penjana (i = indeks dalam kumpulan) ---------- */
const WG = {};
// 11.1
WG.kongruen = i => {
  const same = i % 3 !== 2, a = wri(2, 3), b = wri(2, 4);
  const o = wpick([[[0, 0], [a, 0], [0, b]], [[0, 0], [a, 0], [a, b], [0, b]], [[0, 0], [a + 1, 0], [1, b]]]);
  const how = wri(0, 2);
  let im;
  if (!same) im = o.map(([x, y]) => [5 + 2 * x, 2 * y]);
  else if (how === 0) im = o.map(([x, y]) => [13 - x, y]);
  else if (how === 1) im = o.map(([x, y]) => [9 + y, a + 1 - x]);
  else im = o.map(([x, y]) => [x + 8, y + 1]);
  return { q: 'Adakah kedua-dua bentuk di bawah kongruen? Berikan sebab.', fig: plot({ x0: 0, x1: 14, y0: 0, y1: 8, u: 26, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Dua bentuk' }),
    ans: same ? 'Ya, kongruen' : 'Tidak kongruen', work: same ? ['Bentuk dan saiz kedua-duanya sama.'] : ['Bentuk sama tetapi saiz berbeza.'] };
};
WG.objekImej = i => {
  const [o, m] = [['P', 'Q'], ['M', 'N'], ['X', 'Y'], ['F', 'G'], ['S', 'T']][i % 5];
  const sh = wpick(['Segi tiga', 'Segi empat', 'Pentagon']);
  return { q: `${sh} ${o} dipetakan kepada ${sh.toLowerCase()} ${m} oleh satu transformasi. Nyatakan objek dan imej.`, ans: `Objek: ${sh.toLowerCase()} ${o}; Imej: ${sh.toLowerCase()} ${m}`, work: ['Bentuk asal ialah objek.', 'Bentuk selepas transformasi ialah imej.'] };
};
WG.titikImej = i => {
  const nm = ['ABCD', 'PQRS', 'KLMN', 'EFGH', 'WXYZ'][i % 5], k = wri(0, 3);
  return { q: `Segi empat ${nm} dipetakan kepada ${nm.split('').map(c => c + '′').join('')}. Nyatakan imej bagi titik ${nm[k]}.`, ans: `${nm[k]}′`, work: [`Titik ${nm[k]} dipetakan kepada titik sepadan ${nm[k]}′.`] };
};
WG.isometriFig = i => {
  const iso = i % 2 === 0, o = wpick([[[1, 1], [3, 1], [1, 3]], [[1, 1], [4, 1], [4, 3]], [[1, 1], [3, 1], [3, 2], [1, 3]]]);
  const dy = wri(0, 3), im = iso ? o.map(([x, y]) => [x + 6, y + dy]) : o.map(([x, y]) => [6 + (x - 1) * 2, 1 + (y - 1) * 2]);
  return { q: 'Objek (biru) dipetakan kepada imej (oren). Adakah transformasi ini satu isometri? Terangkan.', fig: plot({ x0: 0, x1: 13, y0: 0, y1: 8, u: 26, axes: false, items: [{ t: 'poly', pts: o, c: 'tr' }, { t: 'poly', pts: im, c: 'pa', dash: true }], label: 'Objek dan imej' }),
    ans: iso ? 'Ya, isometri' : 'Bukan isometri', work: iso ? ['Bentuk dan saiz imej sama dengan objek.'] : ['Saiz imej berbeza daripada objek.'] };
};
WG.isometriTeks = i => {
  const L = [['Imej mempunyai bentuk dan saiz yang sama dengan objek.', 'Ya, isometri'], ['Panjang setiap sisi imej dua kali panjang sisi objek.', 'Bukan isometri'], ['Imej ialah hasil pantulan objek pada paksi-y.', 'Ya, isometri'], ['Luas imej separuh daripada luas objek.', 'Bukan isometri']][i % 4];
  return { q: `Diberi: "${L[0]}" Adakah transformasi ini satu isometri?`, ans: L[1], work: ['Isometri mengekalkan bentuk dan saiz.'] };
};
WG.panjangSudut = i => {
  const ab = [5, 8, 12][i], ang = [40, 65, 110][i], n = LET[i];
  return { q: `Segi tiga ${n} dipetakan kepada segi tiga ${n.split('').map(c => c + '′').join('')} oleh satu isometri. Diberi ${n[0]}${n[1]} = ${ab} cm dan ∠${n} = ${ang}°. Nyatakan panjang ${n[0]}′${n[1]}′ dan saiz ∠${n[0]}′${n[1]}′${n[2]}′.`,
    ans: `${n[0]}′${n[1]}′ = ${ab} cm, ∠${n[0]}′${n[1]}′${n[2]}′ = ${ang}°`, work: ['Isometri mengekalkan bentuk dan saiz.', 'Panjang sisi dan saiz sudut tidak berubah.'] };
};
// 11.2
WG.imejTitik = () => { const x = wri(-4, 4), y = wri(-4, 4), a = wnz(-4, 4), b = wnz(-4, 4); return { q: `Titik P${P(x, y)} ditranslasikan oleh ${vec(a, b)}. Cari koordinat imej P′.`, ans: `P′${P(x + a, y + b)}`, work: [`x: ${fmt(x)} + ${par(a)} = ${fmt(x + a)}`, `y: ${fmt(y)} + ${par(b)} = ${fmt(y + b)}`] }; };
WG.vektorKata = () => { const a = wnz(-5, 5), b = wnz(-5, 5); return { q: `Satu titik digerakkan ${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'} dan ${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}. Tuliskan vektor translasi.`, ans: vec(a, b), work: [`${a > 0 ? 'Kanan positif' : 'Kiri negatif'}: ${fmt(a)}.`, `${b > 0 ? 'Atas positif' : 'Bawah negatif'}: ${fmt(b)}.`] }; };
function lukis(kind, opt) {
  // soalan melukis: objek pada grid, murid lukis imej
  for (let t = 0; t < 300; t++) {
    let o, f, extra = [], desc;
    const names = wpick(LET);
    if (kind === 'tr') { o = wsTri(-5, 0, -5, 0); const a = opt.neg ? wnz(-4, 4) : wri(2, 5), b = opt.neg ? wnz(-4, 4) : wri(1, 5); f = ([x, y]) => [x + a, y + b]; desc = `di bawah translasi ${vec(a, b)}`; }
    if (kind === 'px') { o = wsTri(-5, 5, 1, 5); f = ([x, y]) => [x, -y]; desc = 'apabila dipantulkan pada paksi-x'; }
    if (kind === 'py') { o = wsTri(1, 5, -5, 5); f = ([x, y]) => [-x, y]; desc = 'apabila dipantulkan pada paksi-y'; }
    if (kind === 'xh') { const h = wnz(-2, 2); o = wsTri(h + 1, Math.min(6, h + 4), -4, 4); f = ([x, y]) => [2 * h - x, y]; desc = `apabila dipantulkan pada garis x = ${fmt(h)}`; extra = [{ t: 'line', a: [h, -6], b: [h, 6], c: 'pa', w: 3 }, { t: 'text', x: h, y: 6, s: `x = ${fmt(h)}`, c: 'pa', anchor: 'start', size: 14 }]; }
    if (kind === 'yk') { const k = wnz(-2, 2); o = wsTri(-4, 4, k + 1, Math.min(6, k + 4)); f = ([x, y]) => [x, 2 * k - y]; desc = `apabila dipantulkan pada garis y = ${fmt(k)}`; extra = [{ t: 'line', a: [-6, k], b: [6, k], c: 'pa', w: 3 }, { t: 'text', x: -6, y: k, s: `y = ${fmt(k)}`, c: 'pa', anchor: 'start', size: 14 }]; }
    if (kind === 'r180') { o = wsTri(1, 5, 1, 5); f = ([x, y]) => [-x, -y]; desc = 'apabila diputar 180° pada asalan O'; }
    if (kind === 'r90') { const cw = opt.cw; o = wsTri(1, 5, 1, 5); f = cw ? ([x, y]) => [y, -x] : ([x, y]) => [-y, x]; desc = `apabila diputar 90° ${cw ? 'ikut' : 'lawan'} arah jam pada asalan O`; }
    const im = o.map(f);
    if (!im.every(([x, y]) => Math.abs(x) <= 6 && Math.abs(y) <= 6)) continue;
    const nm = names.split(''), nm2 = nm.map(c => c + '′');
    const base = Object.assign({}, G6, { u: 28 });
    return { kind: 'lukis', q: `Pada grid di bawah, lukis imej bagi segi tiga ${names} ${desc}. Labelkan imej itu ${nm2.join('')}.`,
      fig: plot(Object.assign({}, base, { items: extra.concat(triItems(o, 'tr', nm)), label: `Grid dengan segi tiga ${names}` })),
      figAns: plot(Object.assign({}, base, { items: extra.concat(triItems(o, 'tr', nm), triItems(im, 'gr', nm2, true)), label: `Segi tiga ${names} dan imejnya` })),
      ans: im.map((p, i) => `${nm2[i]}${P(p[0], p[1])}`).join(', '), work: [] };
  }
}
WG.lukisTr = i => lukis('tr', { neg: false });
WG.lukisTrNeg = i => lukis('tr', { neg: true });
WG.cariVektor = () => { const x = wri(-4, 4), y = wri(-4, 4), a = wnz(-5, 5), b = wnz(-5, 5); return { q: `Titik A${P(x, y)} dipetakan kepada A′${P(x + a, y + b)} oleh satu translasi. Tentukan vektor translasi.`, ans: vec(a, b), work: [`${fmt(x + a)} − ${par(x)} = ${fmt(a)}`, `${fmt(y + b)} − ${par(y)} = ${fmt(b)}`] }; };
WG.cariObjek = () => { const X = wri(-3, 6), Y = wri(-3, 6), a = wnz(-4, 4), b = wnz(-4, 4); return { q: `Q′${P(X, Y)} ialah imej bagi titik Q di bawah translasi ${vec(a, b)}. Cari koordinat Q.`, ans: `Q${P(X - a, Y - b)}`, work: [`${fmt(X)} − ${par(a)} = ${fmt(X - a)}`, `${fmt(Y)} − ${par(b)} = ${fmt(Y - b)}`] }; };
WG.imejB = () => { const ax = wri(-3, 3), ay = wri(-3, 3), a = wnz(-4, 4), b = wnz(-4, 4), bx = wri(-4, 4), by = wri(-4, 4); return { q: `Translasi T memetakan A${P(ax, ay)} kepada A′${P(ax + a, ay + b)}. Cari imej bagi B${P(bx, by)} di bawah translasi T.`, ans: `B′${P(bx + a, by + b)}`, work: [`Vektor T = ${vec(a, b)}`, `B′ = (${fmt(bx)} + ${par(a)}, ${fmt(by)} + ${par(b)})`] }; };
WG.duaTranslasi = () => { const x = wri(-3, 3), y = wri(-3, 3), a = wnz(-3, 3), b = wnz(-3, 3), c = wnz(-3, 3), d = wnz(-3, 3); return { q: `Titik R${P(x, y)} ditranslasikan oleh ${vec(a, b)}, kemudian imejnya ditranslasikan pula oleh ${vec(c, d)}. Cari koordinat imej akhir.`, ans: P(x + a + c, y + b + d), work: [`Selepas translasi pertama: ${P(x + a, y + b)}`, `Selepas translasi kedua: ${P(x + a + c, y + b + d)}`] }; };
// 11.3
WG.paksiTitik = () => { const x = wnz(-5, 5), y = wnz(-5, 5), onX = WR() < .5; return { q: `Titik P${P(x, y)} dipantulkan pada ${onX ? 'paksi-x' : 'paksi-y'}. Cari koordinat imej P′.`, ans: `P′${P(onX ? x : -x, onX ? -y : y)}`, work: [onX ? '(x, y) → (x, −y)' : '(x, y) → (−x, y)'] }; };
WG.padaPaksi = i => { const v = wnz(-5, 5), onX = i % 2 === 0; return { q: `Titik T${onX ? P(v, 0) : P(0, v)} dipantulkan pada ${onX ? 'paksi-x' : 'paksi-y'}. Nyatakan koordinat imej T′.`, ans: `T′${onX ? P(v, 0) : P(0, v)}`, work: ['Titik pada paksi pantulan tidak berubah kedudukan.'] }; };
WG.lukisPaksi = i => lukis(i % 2 ? 'px' : 'py', {});
WG.garisHK = i => {
  const h = wri(-2, 4);
  if (i % 2 === 0) { let x = wri(-3, 6); if (x === h) x = h - 2; const y = wri(-4, 5); return { q: `Titik P${P(x, y)} dipantulkan pada garis x = ${fmt(h)}. Cari koordinat imej P′.`, ans: `P′${P(2 * h - x, y)}`, work: [`Jarak ke garis = ${Math.abs(h - x)} unit`, `x′ = ${fmt(2 * h - x)}, y tidak berubah`] }; }
  let y = wri(-3, 6); if (y === h) y = h - 2; const x = wri(-4, 5);
  return { q: `Titik P${P(x, y)} dipantulkan pada garis y = ${fmt(h)}. Cari koordinat imej P′.`, ans: `P′${P(x, 2 * h - y)}`, work: [`Jarak ke garis = ${Math.abs(h - y)} unit`, `y′ = ${fmt(2 * h - y)}, x tidak berubah`] };
};
WG.lukisHK = i => lukis(i % 2 ? 'yk' : 'xh', {});
WG.cariPaksi = i => { const m = wri(-3, 4), d = wri(1, 4), c = wri(-3, 4); if (i % 2 === 0) return { q: `Titik A${P(m - d, c)} dipetakan kepada A′${P(m + d, c)} oleh satu pantulan. Nyatakan persamaan paksi pantulan.`, ans: `x = ${fmt(m)}`, work: [`Titik tengah AA′: x = ${fmt(m)}`] }; return { q: `Titik A${P(c, m - d)} dipetakan kepada A′${P(c, m + d)} oleh satu pantulan. Nyatakan persamaan paksi pantulan.`, ans: `y = ${fmt(m)}`, work: [`Titik tengah AA′: y = ${fmt(m)}`] }; };
// 11.4
WG.r180 = () => { const x = wnz(-5, 5), y = wnz(-5, 5); return { q: `Titik A${P(x, y)} diputar 180° pada asalan O. Cari koordinat imej A′.`, ans: `A′${P(-x, -y)}`, work: ['(x, y) → (−x, −y)'] }; };
WG.lukis180 = () => lukis('r180', {});
WG.r90 = i => { const x = wnz(-5, 5), y = wnz(-5, 5), cw = i % 2 === 0; return { q: `Titik A${P(x, y)} diputar 90° ${cw ? 'ikut' : 'lawan'} arah jam pada asalan O. Cari koordinat imej A′.`, ans: `A′${P(cw ? y : -y, cw ? -x : x)}`, work: [cw ? '(x, y) → (y, −x)' : '(x, y) → (−y, x)'] }; };
WG.lukis90 = i => lukis('r90', { cw: i % 2 === 0 });
WG.r90pusat = i => { const h = wri(-2, 2), k = wri(-2, 2), dx = wnz(-3, 3), dy = wnz(-3, 3), cw = i % 2 === 0; const X = cw ? h + dy : h - dy, Y = cw ? k - dx : k + dx; return { q: `Titik A${P(h + dx, k + dy)} diputar 90° ${cw ? 'ikut' : 'lawan'} arah jam pada pusat ${P(h, k)}. Cari koordinat imej A′.`, ans: `A′${P(X, Y)}`, work: [`Dari pusat ke A: (${fmt(dx)}, ${fmt(dy)})`, `Selepas putaran: (${fmt(X - h)}, ${fmt(Y - k)})`, `A′ = ${P(X, Y)}`] }; };
// 11.5
WG.panjang = () => { const n = wri(3, 20), t = wpick(['translasi', 'pantulan', 'putaran']), nm = wpick(LET); return { q: `Panjang sisi ${nm[0]}${nm[1]} sebuah objek ialah ${n} cm. Objek itu mengalami ${t}. Berapakah panjang ${nm[0]}′${nm[1]}′?`, ans: `${n} cm`, work: [`${wcap(t)} ialah isometri; jarak dikekalkan.`] }; };
WG.sudut = () => { const d = wpick([30, 35, 42, 50, 58, 64, 72, 85, 96, 105, 118, 125]), t = wpick(['translasi', 'pantulan', 'putaran']), nm = wpick(LET); return { q: `Diberi ∠${nm} = ${d}°. Segi tiga ${nm} mengalami ${t}. Nyatakan saiz ∠${nm.split('').map(c => c + '′').join('')}.`, ans: `${d}°`, work: [`${wcap(t)} ialah isometri; saiz sudut dikekalkan.`] }; };
const SIFAT = [
  ['Dalam pantulan, titik manakah yang tidak berubah kedudukan?', 'Titik pada paksi pantulan'],
  ['Dalam putaran, titik manakah yang tidak berubah kedudukan?', 'Pusat putaran'],
  ['Transformasi isometri manakah yang menghasilkan imej terbalik (songsang sisi)?', 'Pantulan'],
  ['Nyatakan tiga maklumat yang diperlukan untuk menghuraikan satu putaran.', 'Pusat, sudut dan arah putaran'],
  ['Apakah maklumat yang diperlukan untuk menghuraikan satu translasi?', 'Vektor translasi'],
  ['Apakah maklumat yang diperlukan untuk menghuraikan satu pantulan?', 'Paksi pantulan'],
  ['Adakah imej yang dihasilkan oleh isometri sentiasa kongruen dengan objek?', 'Ya'],
  ['Dalam translasi, adakah orientasi imej sama dengan orientasi objek?', 'Ya, sama'],
  ['Dalam putaran, adakah jarak setiap titik dari pusat putaran berubah?', 'Tidak berubah']
];
WG.sifat = i => ({ q: SIFAT[i % SIFAT.length][0], ans: SIFAT[i % SIFAT.length][1], work: [] });
WG.luas = i => { const p = [8, 10, 7][i], l = [5, 3, 6][i], area = i !== 1, t = ['diputar 90° pada satu titik', 'dipantulkan pada satu garis', 'ditranslasikan'][i]; return { q: `Sebuah segi empat tepat berukuran ${p} cm × ${l} cm ${t}. Hitung ${area ? 'luas' : 'perimeter'} imejnya.`, ans: area ? `${p * l} cm²` : `${2 * (p + l)} cm`, work: ['Isometri: imej kongruen dengan objek.', area ? `${p} × ${l} = ${p * l} cm²` : `2 × (${p} + ${l}) = ${2 * (p + l)} cm`] }; };
// 11.6
const BENTUK = [['poly', 3, 'segi tiga sama sisi', 3], ['poly', 4, 'segi empat sama', 4], ['rect', 0, 'segi empat tepat', 2], ['poly', 5, 'pentagon sekata', 5], ['poly', 6, 'heksagon sekata', 6], ['poly', 8, 'oktagon sekata', 8], ['rhombus', 0, 'rombus', 2], ['para', 0, 'segi empat selari', 2], ['kite', 0, 'lelayang', 1], ['trap', 0, 'trapezium sama kaki', 1]];
WG.bentuk = i => { const o = BENTUK[i % BENTUK.length]; return { q: `Nyatakan peringkat simetri putaran bagi ${o[2]} di bawah.`, fig: wsShape(o[0], o[1]), ans: `${o[3]}`, work: [`Bentuk kelihatan sama ${o[3]} kali dalam satu putaran lengkap.`] }; };
const HURUF1 = [['H', 2], ['N', 2], ['S', 2], ['Z', 2], ['X', 2], ['I', 2], ['A', 1], ['T', 1]];
const HURUF2 = [['L', 1], ['F', 1], ['E', 1], ['K', 1], ['M', 1], ['W', 1], ['V', 1], ['U', 1], ['Y', 1]];
WG.huruf = i => { const o = HURUF1[i % HURUF1.length]; return { q: `Nyatakan peringkat simetri putaran bagi huruf ${o[0]}.`, fig: wsShape('letter', o[0]), ans: `${o[1]}`, work: [o[1] === 2 ? 'Kelihatan sama selepas diputar 180°.' : 'Hanya kelihatan sama selepas satu putaran lengkap.'] }; };
WG.huruf2 = i => { const o = HURUF2[i % HURUF2.length]; return { q: `Nyatakan peringkat simetri putaran bagi huruf ${o[0]}. Terangkan.`, fig: wsShape('letter', o[0]), ans: `${o[1]}`, work: ['Huruf ini tidak kelihatan sama selepas diputar 90° atau 180°.', 'Ia hanya kelihatan sama selepas satu putaran lengkap.'] }; };
WG.poligonSudut = i => { const n = [5, 8, 12][i]; return { q: `Sebuah poligon sekata mempunyai ${n} sisi. Berapakah sudut putaran terkecil supaya poligon itu kelihatan sama seperti asal?`, ans: `${360 / n}°`, work: [`Peringkat simetri putaran = ${n}`, `360° ÷ ${n} = ${360 / n}°`] }; };

/* ---------- susunan bank ---------- */
const WSPLAN = {
  '11.1': [['m', 'kongruen', 8], ['m', 'objekImej', 5], ['m', 'titikImej', 5], ['s', 'isometriFig', 5], ['s', 'isometriTeks', 4], ['k', 'panjangSudut', 3]],
  '11.2': [['m', 'imejTitik', 10], ['m', 'vektorKata', 4], ['m', 'lukisTr', 4], ['s', 'cariVektor', 4], ['s', 'cariObjek', 3], ['s', 'lukisTrNeg', 2], ['k', 'imejB', 2], ['k', 'duaTranslasi', 1]],
  '11.3': [['m', 'paksiTitik', 10], ['m', 'padaPaksi', 4], ['m', 'lukisPaksi', 4], ['s', 'garisHK', 6], ['s', 'lukisHK', 3], ['k', 'cariPaksi', 3]],
  '11.4': [['m', 'r180', 12], ['m', 'lukis180', 6], ['s', 'r90', 6], ['s', 'lukis90', 3], ['k', 'r90pusat', 3]],
  '11.5': [['m', 'panjang', 10], ['m', 'sudut', 8], ['s', 'sifat', 9], ['k', 'luas', 3]],
  '11.6': [['m', 'bentuk', 10], ['m', 'huruf', 8], ['s', 'huruf2', 9], ['k', 'poligonSudut', 3]]
};
let WSBANK = null;
function wsBank() {
  if (WSBANK) return WSBANK;
  WSBANK = [];
  Object.keys(WSPLAN).forEach((sub, si) => {
    WR = mulberry32(20261124 + si * 1009);
    const seen = new Set(); let n = 0;
    for (const [lvl, g, cnt] of WSPLAN[sub]) {
      for (let i = 0; i < cnt; i++) {
        let q, tries = 0;
        do { q = WG[g](i); tries++; } while (tries < 40 && seen.has(q.q + (q.fig || '')));
        seen.add(q.q + (q.fig || ''));
        n++;
        WSBANK.push(Object.assign({ kind: 'jawab', fig: '', figAns: '', work: [] }, q, { id: `${sub}-${String(n).padStart(2, '0')}`, sub, lvl }));
      }
    }
  });
  WR = Math.random;
  return WSBANK;
}

/* =================== Paparan Lembaran Kerja =================== */
const WS = { sub: '11.1', lvl: 'all', sel: [] , key: true };
try { const s0 = store().ws; if (s0) { WS.sel = (s0.sel || []).filter(Boolean); WS.key = s0.key !== false; } } catch (e) {}
const wsSave = () => save({ ws: { sel: WS.sel, key: WS.key } });
const LVLN = { m: ['Mudah', 'gr'], s: ['Sederhana', 'am'], k: ['Sukar', 'rd'] };
function latSeg(cur) {
  return `<nav class="seg latseg" aria-label="Jenis latihan"><a href="#/latihan"${cur === 'kelas' ? ' aria-current="page"' : ''}>Latihan Kelas</a><a href="#/latihan/lembaran"${cur === 'ws' ? ' aria-current="page"' : ''}>Lembaran Kerja</a></nav>`;
}
function viewLembaran() {
  const bank = wsBank();
  const list = bank.filter(q => q.sub === WS.sub && (WS.lvl === 'all' || (WS.lvl === 'lukis' ? q.kind === 'lukis' : q.lvl === WS.lvl)));
  const subs = SUBS.map(s => { const c = WS.sel.filter(id => id.startsWith(s.no + '-')).length; return `<button type="button" class="opt" data-wsub="${s.no}" aria-pressed="${WS.sub === s.no}" style="--c:${subCol(s.no)}">${s.no}${c ? ` <span class="wcnt">${c}</span>` : ''}</button>`; }).join('');
  const lv = [['all', 'Semua'], ['m', 'Mudah'], ['s', 'Sederhana'], ['k', 'Sukar'], ['lukis', 'Melukis']].map(([k, t]) => `<button type="button" class="opt" data-wlvl="${k}" aria-pressed="${WS.lvl === k}" style="--c:var(--tr)">${t}</button>`).join('');
  const cards = list.map(q => {
    const on = WS.sel.includes(q.id), [ln, lc] = LVLN[q.lvl];
    return `<label class="wq${on ? ' on' : ''}"><input type="checkbox" data-wq="${q.id}"${on ? ' checked' : ''}>
      <span class="wqb"><span class="wqh"><b>${q.id}</b><span class="chip" style="height:26px;font-size:12px;background:color-mix(in srgb,var(--${lc}) 15%,transparent);color:var(--${lc})">${ln}</span>${q.kind === 'lukis' ? '<span class="chip" style="height:26px;font-size:12px;background:color-mix(in srgb,var(--pu) 15%,transparent);color:var(--pu)">Melukis</span>' : ''}</span>
      <span class="wqt">${q.q}</span></span>${q.fig ? `<span class="wqf">${q.fig}</span>` : ''}</label>`;
  }).join('');
  const byId = Object.fromEntries(bank.map(q => [q.id, q]));
  const selList = WS.sel.map((id, i) => byId[id] ? `<li><span class="n">${i + 1}</span><span class="t">${byId[id].id} · ${LVLN[byId[id].lvl][0]}${byId[id].kind === 'lukis' ? ' · Melukis' : ''}</span>
      <button type="button" class="mini" data-up="${i}" aria-label="Naikkan soalan ${i + 1}"${i ? '' : ' disabled'}>↑</button><button type="button" class="mini" data-dn="${i}" aria-label="Turunkan soalan ${i + 1}"${i < WS.sel.length - 1 ? '' : ' disabled'}>↓</button><button type="button" class="mini" data-rm="${i}" aria-label="Buang soalan ${i + 1}">×</button></li>` : '').join('');
  return `<div class="wrap wswrap">
    ${latSeg('ws')}
    <div><h1 class="h1">Lembaran Kerja</h1><p class="lead">Pilih soalan yang dikehendaki, kemudian cetak untuk diberi kepada murid.</p></div>
    <div class="wsgrid">
      <section class="wslist">
        <div class="opts wsubs" role="group" aria-label="Subtopik">${subs}</div>
        <p class="wsname">${WS.sub} ${subOf(WS.sub).name}</p>
        <div class="opts wlvls" role="group" aria-label="Tapis aras">${lv}</div>
        <div class="wqs">${cards || '<p class="lead">Tiada soalan.</p>'}</div>
      </section>
      <aside class="wsside">
        <div class="pbox" style="gap:12px">
          <h3>DIPILIH: ${WS.sel.length} SOALAN</h3>
          ${WS.sel.length ? `<ol class="wsel">${selList}</ol><button type="button" class="btn sec" id="wsClear" style="min-height:42px;font-size:15px">Kosongkan pilihan</button>` : '<p style="margin:0;color:var(--mu);font-size:15px">Tandakan soalan di sebelah untuk dimasukkan ke dalam lembaran kerja.</p>'}
          <label class="tg" style="--c:var(--tr)">Sertakan skema jawapan <input type="checkbox" id="wsKey"${WS.key ? ' checked' : ''}></label>
        </div>
        <button type="button" class="btn pri big" id="wsPrint"${WS.sel.length ? '' : ' disabled'}>${IC.print} Cetak / PDF</button>
      </aside>
    </div></div>`;
}
function bindLembaran() {
  const main = document.getElementById('main');
  main.querySelectorAll('[data-wsub]').forEach(b => b.onclick = () => { WS.sub = b.dataset.wsub; render(true); main.querySelector('.wqs') && (document.getElementById('main').scrollTop = 0); });
  main.querySelectorAll('[data-wlvl]').forEach(b => b.onclick = () => { WS.lvl = b.dataset.wlvl; render(true); });
  main.querySelectorAll('[data-wq]').forEach(c => c.onchange = () => { const id = c.dataset.wq; WS.sel = WS.sel.filter(x => x !== id); if (c.checked) WS.sel.push(id); wsSave(); render(true); });
  main.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const i = +b.dataset.up; [WS.sel[i - 1], WS.sel[i]] = [WS.sel[i], WS.sel[i - 1]]; wsSave(); render(true); });
  main.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => { const i = +b.dataset.dn; [WS.sel[i + 1], WS.sel[i]] = [WS.sel[i], WS.sel[i + 1]]; wsSave(); render(true); });
  main.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { WS.sel.splice(+b.dataset.rm, 1); wsSave(); render(true); });
  const cl = document.getElementById('wsClear'); if (cl) cl.onclick = () => { WS.sel = []; wsSave(); render(true); };
  document.getElementById('wsKey').onchange = e => { WS.key = e.target.checked; wsSave(); };
  document.getElementById('wsPrint').onclick = () => printDoc(wsDocHTML(), WS_PAGE);
}
function wsDocHTML() {
  const byId = Object.fromEntries(wsBank().map(q => [q.id, q]));
  const qs = WS.sel.map(id => byId[id]).filter(Boolean);
  const head = `<header class="wshead"><h1>Lembaran Kerja · Bab 11: Transformasi Isometri</h1>
    <div class="wsfields"><span>Nama: <i></i></span><span>Kelas: <i></i></span><span>Tarikh: <i></i></span></div></header>`;
  const body = qs.map((q, i) => {
    const sp = q.kind === 'lukis' ? '' : `<div class="wspace sp-${q.lvl}"></div>`;
    return `<section class="wsq"><div class="wsqh"><b>${i + 1}.</b><span class="wsqt">${q.q}</span><span class="wslv">[${LVLN[q.lvl][0]}]</span></div>
      ${q.fig ? `<div class="wsfig${q.kind === 'lukis' ? ' big' : ''}">${q.fig}</div>` : ''}
      ${sp}${q.kind === 'lukis' ? '' : '<div class="wsans">Jawapan: <i></i></div>'}</section>`;
  }).join('');
  let key = '';
  if (WS.key) key = `<div class="wskey"><header class="wshead"><h1>Skema Jawapan · Bab 11: Transformasi Isometri</h1><p>Untuk kegunaan guru</p></header>
    ${qs.map((q, i) => `<section class="wskq"><b>${i + 1}.</b><div><div class="ka">${q.ans}</div>${q.work.length ? `<div class="kw">${q.work.join(' · ')}</div>` : ''}${q.figAns ? `<div class="wsfig small">${q.figAns}</div>` : ''}</div></section>`).join('')}</div>`;
  return `<div class="wsdoc">${head}${body}</div>${key ? `<div class="wsdoc">${key}</div>` : ''}`;
}
