'use strict';
/* =================== PENGENDALIAN DATA · SOALAN BAB 8 (Tingkatan 1, KP2027) =================== */
// Semua nama global berawalan "pd" / "PD".

const pdRG = { i: (a, b) => ri(a, b), p: a => pick(a), s: a => shuffle(a.slice()) };
const pdRW = { i: (a, b) => wri(a, b), p: a => wpick(a), s: a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = wri(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; } };
const pdRM = v => 'RM' + String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const PDC = ['#38BDF8', '#F472B6', '#FBBF24', '#34D399', '#A78BFA'];

/* ---------- rajah ---------- */
const pdT = (x, y, t, col = '#E6EDF7', sz = 16, a = 'middle') => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" fill="${col}" font-family="Inter,sans-serif" font-size="${sz}" font-weight="700" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const pdSvg = (inner, lab) => `<svg viewBox="0 0 500 340" role="img" aria-label="${lab}" style="width:100%;max-width:520px"><rect x="0" y="0" width="500" height="340" rx="18" fill="#131C2E" stroke="#22304A" stroke-width="2"/>${inner}</svg>`;
const pdRect = (x, y, w, h, c) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" fill="${c}" stroke="#0E1626" stroke-width="1.5"/>`;
function pdFrame(ymax, step, xl, yl) {
  let s = '';
  for (let v = 0; v <= ymax; v += step) { const y = 290 - v / ymax * 230; s += `<line x1="70" y1="${y}" x2="470" y2="${y}" stroke="#1E2A40" stroke-width="1.5"/>` + pdT(60, y, v, '#94A3B8', 13, 'end'); }
  return s + `<line x1="70" y1="290" x2="474" y2="290" stroke="#94A3B8" stroke-width="3"/><line x1="70" y1="292" x2="70" y2="50" stroke="#94A3B8" stroke-width="3"/>` + pdT(470, 325, xl, '#94A3B8', 14, 'end') + pdT(72, 30, yl, '#94A3B8', 14, 'start');
}
// mode: 'satu' | 'kelompok' | 'tindan'
function pdBars(labels, series, ymax, step, xl, yl, mode, legend) {
  let s = pdFrame(ymax, step, xl, yl); const gw = 400 / labels.length;
  labels.forEach((lab, i) => {
    const x0 = 70 + i * gw; let base = 290;
    series.forEach((ser, j) => {
      const h = ser[i] / ymax * 230;
      if (mode === 'tindan') { s += pdRect(x0 + gw * .22, base - h, gw * .56, h, PDC[j]); base -= h; }
      else { const bw = gw * .64 / series.length; s += pdRect(x0 + gw * .18 + j * bw, 290 - h, bw, h, PDC[j]); }
    });
    s += pdT(x0 + gw / 2, 306, lab, '#E6EDF7', 14);
  });
  (legend || []).forEach((l, j) => { s += `<rect x="${250 + j * 110}" y="16" width="14" height="14" rx="3" fill="${PDC[j]}"/>` + pdT(270 + j * 110, 23, l, '#E6EDF7', 13, 'start'); });
  return pdSvg(s, 'Carta palang');
}
function pdPie(parts) { // parts: [[label, sudut]]
  let s = '', a0 = -90; const c = [160, 170], r = 130;
  parts.forEach(([lab, ang], i) => {
    const a1 = a0 + ang, rad = d => d * Math.PI / 180, p0 = [c[0] + r * Math.cos(rad(a0)), c[1] + r * Math.sin(rad(a0))], p1 = [c[0] + r * Math.cos(rad(a1)), c[1] + r * Math.sin(rad(a1))];
    s += `<path d="M${c[0]} ${c[1]} L${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A${r} ${r} 0 ${ang > 180 ? 1 : 0} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Z" fill="${PDC[i]}" stroke="#0E1626" stroke-width="3"/>`;
    const m = rad((a0 + a1) / 2); if (ang !== null) s += pdT(c[0] + r * .62 * Math.cos(m), c[1] + r * .62 * Math.sin(m), parts[i][2] || ang + '°', '#0E1626', 15);
    s += `<rect x="320" y="${90 + i * 38}" width="16" height="16" rx="3" fill="${PDC[i]}"/>` + pdT(344, 98 + i * 38, lab, '#E6EDF7', 15, 'start');
    a0 = a1;
  });
  return pdSvg(s, 'Carta pai');
}
function pdLine(labels, vals, ymax, step, xl, yl) {
  let s = pdFrame(ymax, step, xl, yl); const gw = 400 / labels.length, pts = vals.map((v, i) => [70 + gw * (i + .5), 290 - v / ymax * 230]);
  s += `<polyline points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linejoin="round"/>`;
  pts.forEach((p, i) => { s += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="6" fill="#FBBF24"/>` + pdT(p[0], 306, labels[i], '#E6EDF7', 14); });
  return pdSvg(s, 'Graf garis');
}
function pdDot(vals, lo, hi, xl) {
  let s = `<line x1="50" y1="270" x2="450" y2="270" stroke="#94A3B8" stroke-width="3"/>`; const st = 400 / (hi - lo);
  for (let v = lo; v <= hi; v++) { const x = 50 + (v - lo) * st; s += `<line x1="${x}" y1="270" x2="${x}" y2="280" stroke="#94A3B8" stroke-width="2"/>` + pdT(x, 296, v, '#E6EDF7', 15); for (let k = 0; k < vals.filter(u => u === v).length; k++) s += `<circle cx="${x}" cy="${252 - k * 24}" r="9" fill="#38BDF8"/>`; }
  return pdSvg(s + pdT(250, 322, xl, '#94A3B8', 14), 'Plot titik');
}
function pdStem(data) { // data terisih
  const st = {}; data.forEach(v => { (st[Math.floor(v / 10)] = st[Math.floor(v / 10)] || []).push(v % 10); });
  const ks = Object.keys(st).map(Number).sort((a, b) => a - b);
  let s = pdT(150, 40, 'Batang', '#94A3B8', 15) + pdT(300, 40, 'Daun', '#94A3B8', 15) + `<line x1="200" y1="58" x2="200" y2="${70 + ks.length * 40}" stroke="#94A3B8" stroke-width="3"/>`;
  ks.forEach((k, i) => { s += pdT(150, 82 + i * 40, k, '#FBBF24', 20) + pdT(225, 82 + i * 40, st[k].join('   '), '#E6EDF7', 20, 'start'); });
  return pdSvg(s + pdT(250, 312, `Kekunci: ${ks[0]} | ${st[ks[0]][0]} bermaksud ${ks[0] * 10 + st[ks[0]][0]}`, '#94A3B8', 14), 'Plot batang-dan-daun');
}
function pdScatter(pts, xmax, ymax, xl, yl) {
  let s = pdFrame(ymax, ymax / 5, xl, yl);
  pts.forEach(([x, y]) => { s += `<circle cx="${(70 + x / xmax * 390).toFixed(1)}" cy="${(290 - y / ymax * 230).toFixed(1)}" r="7" fill="#F472B6"/>`; });
  return pdSvg(s, 'Graf sebar');
}

/* =================== QV =================== */
const QV = {
  jenis: [d => ({ q: `Kelaskan data berikut sebagai data kategori, numerik diskret atau numerik selanjar: ${d.x}.` }), d => ({ q: `Nyatakan jenis data bagi ${d.x}.` })],
  kaedah: [d => ({ q: `${d.x} Apakah kaedah pengumpulan data yang paling sesuai?` }), d => ({ q: `${d.x} Nyatakan kaedah mengumpul data yang sesuai.` })],
  baca: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Nyatakan').replace(/\?$/, '.') : d.q })],
  kira: [d => ({ q: d.q }), d => ({ q: d.q.replace('Hitung', 'Cari') }), d => ({ q: d.q.replace('Hitung', 'Tentukan') })],
  masalah: [d => ({ q: d.q }), d => ({ q: /Berapakah/.test(d.q) ? d.q.replace('Berapakah', 'Hitung').replace(/\?$/, '.') : d.q })]
};
const pdLQ = (k, d) => GEN_LQ(k, d, d.fig ? { fig: d.fig } : undefined);

/* =================== penjana =================== */
const PD_JENIS = [['warna kegemaran murid', 'Data kategori'], ['jenis sukan yang diminati', 'Data kategori'], ['jenama telefon bimbit', 'Data kategori'], ['negeri kelahiran murid', 'Data kategori'], ['bilangan adik-beradik', 'Data numerik diskret'], ['bilangan buku dibaca sebulan', 'Data numerik diskret'], ['bilangan kereta di tempat letak kereta', 'Data numerik diskret'], ['tinggi murid (cm)', 'Data numerik selanjar'], ['jisim beg sekolah (kg)', 'Data numerik selanjar'], ['masa larian 100 m (saat)', 'Data numerik selanjar'], ['suhu harian (°C)', 'Data numerik selanjar']];
const PD_KAEDAH = [['Cikgu ingin tahu pendapat pengusaha kantin tentang menu sihat.', 'Temu bual'], ['Kelab Sains ingin tahu masa yang diambil oleh ais untuk cair pada suhu berbeza.', 'Eksperimen'], ['Pengawas ingin mengira bilangan murid yang memakai topi keledar ketika menunggang basikal ke sekolah.', 'Pemerhatian'], ['PIBG ingin tahu cara murid datang ke sekolah daripada semua ibu bapa.', 'Tinjauan (borang soal selidik)'], ['Sebuah syarikat ingin tahu jenama minuman kegemaran 500 orang remaja.', 'Tinjauan (borang soal selidik)'], ['Murid ingin tahu bilangan kenderaan yang melalui simpang sekolah antara 7.00 dan 7.30 pagi.', 'Pemerhatian'], ['Murid ingin tahu sama ada baja mempercepat pertumbuhan anak benih.', 'Eksperimen']];
const PD = {};
PD.jenis = r => { const [x, a] = r.p(PD_JENIS); return pdLQ('jenis', { x, ans: a, work: [a === 'Data kategori' ? 'Data berbentuk label/kumpulan' : a.includes('diskret') ? 'Data diperoleh dengan membilang' : 'Data diperoleh dengan mengukur'] }); };
const PD_SEBAB = { 'Temu bual': 'Bertanya terus kepada seorang/beberapa orang', 'Eksperimen': 'Data diperoleh melalui ujian terkawal', 'Pemerhatian': 'Data diperoleh dengan melihat dan mengira', 'Tinjauan (borang soal selidik)': 'Ramai responden menjawab soalan yang sama' };
PD.kaedah = r => { const [x, a] = r.p(PD_KAEDAH); return pdLQ('kaedah', { x, ans: a, work: [PD_SEBAB[a]] }); };
PD.kekerapan = r => {
  const vals = [], k = r.i(0, 1), lo = k ? 1 : 3, n = 15 + r.i(0, 5); for (let i = 0; i < n; i++) vals.push(r.i(lo, lo + 3));
  const tgt = r.i(lo, lo + 3), f = vals.filter(v => v === tgt).length;
  const cnt = [0, 1, 2, 3].map(j => vals.filter(v => v === lo + j).length), mx = Math.max(...cnt), modes = cnt.map((c, j) => c === mx ? lo + j : null).filter(v => v !== null);
  const ctx = k ? 'Bilangan adik-beradik' : 'Saiz kasut';
  if (r.i(0, 1) === 0 || modes.length > 1) return pdLQ('baca', { q: `${ctx} bagi ${n} orang murid: ${vals.join(', ')}. Bina jadual kekerapan. Berapakah kekerapan bagi ${tgt}?`, ans: `${f}`, work: [`Bilang data ${tgt}: ${f} kali`, `Semak: jumlah kekerapan = ${n}`] });
  return pdLQ('baca', { q: `${ctx} bagi ${n} orang murid: ${vals.join(', ')}. Bina jadual kekerapan. Nilai manakah yang paling kerap?`, ans: `${modes[0]} (kekerapan ${mx})`, work: [cnt.map((c, j) => `${lo + j}: ${c}`).join(', ')] });
};
PD.bacaBar = r => {
  const labs = r.p([['Isn', 'Sel', 'Rab', 'Kha', 'Jum'], ['4A', '4B', '4C', '4D'], ['Jan', 'Feb', 'Mac', 'Apr']]), mode = r.p(['satu', 'kelompok', 'tindan']);
  if (mode === 'satu') { const v = labs.map(() => r.i(2, 12) * 5), i = r.i(0, labs.length - 1), j = (i + 1 + r.i(0, labs.length - 2)) % labs.length;
    return pdLQ('baca', { q: `Carta palang menunjukkan bilangan buku yang dipinjam dari perpustakaan. Berapakah beza bilangan buku antara ${labs[i]} dan ${labs[j]}?`, fig: pdBars(labs, [v], 60, 10, '', 'Bilangan buku', 'satu'), ans: `${Math.abs(v[i] - v[j])}`, work: [`${labs[i]} = ${v[i]}, ${labs[j]} = ${v[j]}`, `Beza = ${Math.abs(v[i] - v[j])}`] }); }
  const a = labs.map(() => r.i(2, 12)), b = labs.map(() => r.i(2, 12)), i = r.i(0, labs.length - 1);
  if (mode === 'kelompok') return pdLQ('baca', { q: `Carta palang berkelompok menunjukkan bilangan murid lelaki dan perempuan yang menyertai kelab. Berapakah jumlah murid bagi ${labs[i]}?`, fig: pdBars(labs, [a, b], 12, 2, '', 'Bilangan murid', 'kelompok', ['Lelaki', 'Perempuan']), ans: `${a[i] + b[i]}`, work: [`Lelaki ${a[i]} + perempuan ${b[i]} = ${a[i] + b[i]}`] });
  return pdLQ('baca', { q: `Carta palang bertindan menunjukkan bilangan murid lelaki dan perempuan yang menyertai kelab. Berapakah bilangan murid perempuan bagi ${labs[i]}?`, fig: pdBars(labs, [a, b], 24, 4, '', 'Bilangan murid', 'tindan', ['Lelaki', 'Perempuan']), ans: `${b[i]}`, work: [`Jumlah ${a[i] + b[i]} − lelaki ${a[i]} = ${b[i]}`] });
};
PD.bacaDot = r => {
  const vals = [], n = r.i(14, 20); for (let i = 0; i < n; i++) vals.push(r.p([0, 1, 1, 2, 2, 2, 3, 3, 4, 5]));
  const lim = r.i(1, 3), more = vals.filter(v => v > lim).length;
  return pdLQ('baca', { q: `Plot titik menunjukkan bilangan jam murid bersukan dalam seminggu. Berapakah bilangan murid yang bersukan lebih daripada ${lim} jam?`, fig: pdDot(vals.sort((a, b) => a - b), 0, 5, 'Bilangan jam'), ans: `${more}`, work: [`Kira titik bagi ${[...Array(5 - lim).keys()].map(k => k + lim + 1).join(', ')} jam: ${more}`] });
};
PD.sebar = r => {
  const t = r.p([['Jam ulang kaji', 'Markah', 1, 'Hubungan positif', 'jam ulang kaji dan markah'], ['Umur kereta (tahun)', 'Harga (RM ribu)', -1, 'Hubungan negatif', 'umur kereta dan harganya'], ['Saiz kasut', 'Markah', 0, 'Tiada hubungan', 'saiz kasut dan markah ujian']]);
  const pts = []; for (let x = 1; x <= 9; x++) pts.push([x, t[2] === 1 ? 10 + x * 9 + r.i(-6, 6) : t[2] === -1 ? 95 - x * 9 + r.i(-6, 6) : r.i(15, 90)]);
  return pdLQ('baca', { q: `Graf sebar menunjukkan ${t[4]} bagi sekumpulan data. Nyatakan jenis hubungan antara dua pemboleh ubah itu.`, fig: pdScatter(pts, 10, 100, t[0], t[1]), ans: t[3], work: [t[2] === 1 ? 'Apabila satu bertambah, satu lagi bertambah' : t[2] === -1 ? 'Apabila satu bertambah, satu lagi berkurang' : 'Titik bertaburan tanpa corak'] });
};
PD.pai = r => {
  const tot = r.p([36, 40, 60, 72, 90, 120]), divs = [...Array(tot).keys()].map(k => k + 1).filter(f => (f * 360) % tot === 0 && f < tot / 2), f = r.p(divs), ang = f * 360 / tot;
  const SP = r.s(['Bola sepak', 'Badminton', 'Bola jaring', 'Renang']), item = SP[0].toLowerCase();
  if (r.i(0, 1) === 0) return pdLQ('kira', { q: `Seramai ${tot} murid ditanya tentang sukan kegemaran. ${f} orang memilih ${item}. Hitung sudut sektor ${item} dalam carta pai.`, ans: `${ang}°`, work: [`${f}/${tot} × 360° = ${ang}°`] });
  const rest = 360 - ang, a2 = Math.round(rest * .5 / 6) * 6, a3 = rest - a2;
  return pdLQ('kira', { q: `Carta pai menunjukkan sukan kegemaran ${tot} orang murid. Hitung bilangan murid yang memilih ${item}.`, fig: pdPie([[SP[0], ang], [SP[1], a2], [SP[2], a3]]), ans: `${f}`, work: [`${ang}°/360° × ${tot} = ${f}`] });
};
PD.batang = r => {
  const n = r.i(9, 12), lo = r.i(3, 5), d = []; for (let i = 0; i < n; i++) d.push(r.i(lo * 10, lo * 10 + 29)); d.sort((a, b) => a - b);
  const k = r.i(0, 1), lim = (lo + 1) * 10 + r.i(0, 9), more = d.filter(v => v >= lim).length;
  if (k === 0) return pdLQ('kira', { q: 'Plot batang-dan-daun menunjukkan markah ujian sekumpulan murid. Hitung julat markah.', fig: pdStem(d), ans: `${d[n - 1] - d[0]}`, work: [`Tertinggi ${d[n - 1]}, terendah ${d[0]}`, `Julat = ${d[n - 1]} − ${d[0]} = ${d[n - 1] - d[0]}`] });
  return pdLQ('kira', { q: `Plot batang-dan-daun menunjukkan markah ujian sekumpulan murid. Murid yang mendapat ${lim} markah dan ke atas lulus. Hitung bilangan murid yang lulus.`, fig: pdStem(d), ans: `${more}`, work: [`Markah ≥ ${lim}: ${d.filter(v => v >= lim).join(', ') || 'tiada'}`, `Bilangan = ${more}`] });
};
PD.garis = r => {
  const labs = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun'], v = labs.map(() => r.i(4, 20) * 10); let i = r.i(0, 4); while (v[i + 1] === v[i]) v[i + 1] += 10;
  const up = v[i + 1] > v[i];
  return pdLQ('kira', { q: `Graf garis menunjukkan jualan kuih (RM) sebuah kedai. Hitung perubahan jualan dari ${labs[i]} ke ${labs[i + 1]} dan nyatakan sama ada naik atau turun.`, fig: pdLine(labs, v, 220, 40, 'Bulan', 'Jualan (RM)'), ans: `${up ? 'Naik' : 'Turun'} ${pdRM(Math.abs(v[i + 1] - v[i]))}`, work: [`${labs[i]} = RM${v[i]}, ${labs[i + 1]} = RM${v[i + 1]}`, `Perubahan = ${pdRM(Math.abs(v[i + 1] - v[i]))}`] });
};
PD.masalah = (r, idx) => {
  const k = idx == null ? r.i(0, 2) : idx % 3;
  if (k === 0) { const tot = r.p([360, 480, 600, 720, 900]), am = r.p([120, 144, 150, 180]), ab = r.p([60, 72, 90]); const m = am / 360 * tot, b = ab / 360 * tot; const ap = r.p([30, 36, 45]), as = 360 - am - ab - ap;
    return pdLQ('masalah', { q: `Carta pai menunjukkan perbelanjaan bulanan ${pdRM(tot)} sebuah keluarga. Berapakah beza perbelanjaan makanan dan pengangkutan?`, fig: pdPie([['Makanan', am], ['Pengangkutan', ab], ['Buku', ap], ['Simpanan', as]]), ans: pdRM(m - b), work: [`Makanan = ${am}/360 × ${pdRM(tot)} = ${pdRM(m)}`, `Pengangkutan = ${ab}/360 × ${pdRM(tot)} = ${pdRM(b)}`, `Beza = ${pdRM(m - b)}`] }); }
  if (k === 1) { const labs = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun'], v = labs.map(() => r.i(2, 9) * 5), mx = Math.max(...v), mi = v.indexOf(mx);
    return pdLQ('masalah', { q: 'Graf garis menunjukkan bilangan kemalangan jalan raya di sebuah daerah dalam enam bulan. Bulan manakah paling banyak kemalangan, dan berapakah jumlah kemalangan dalam tempoh itu?', fig: pdLine(labs, v, 50, 10, 'Bulan', 'Kemalangan'), ans: `${labs[mi]} (${mx}); jumlah ${v.reduce((a, b) => a + b, 0)}`, work: [`Titik tertinggi: ${labs[mi]} = ${mx}`, `Jumlah = ${v.join(' + ')} = ${v.reduce((a, b) => a + b, 0)}`] }); }
  const labs = ['A', 'B', 'C', 'D'], a = labs.map(() => r.i(3, 10)), b = labs.map(() => r.i(3, 10)), p = r.p([2, 3, 5]);
  const tot = a.reduce((x, y) => x + y, 0) + b.reduce((x, y) => x + y, 0);
  return pdLQ('masalah', { q: `Carta palang bertindan menunjukkan bilangan tiket dewasa dan kanak-kanak yang dijual oleh empat kumpulan. Setiap tiket berharga RM${p}. Berapakah jumlah kutipan semua kumpulan?`, fig: pdBars(labs, [a, b], 20, 4, 'Kumpulan', 'Bilangan tiket', 'tindan', ['Dewasa', 'Kanak-kanak']), ans: pdRM(tot * p), work: [`Jumlah tiket = ${labs.map((l, i) => a[i] + b[i]).join(' + ')} = ${tot}`, `Kutipan = ${tot} × RM${p} = ${pdRM(tot * p)}`] });
};

/* =================== GEN / WG / WSPLAN =================== */
const GEN = {
  '8.1': { m: [() => PD.jenis(pdRG), () => PD.kaedah(pdRG), () => PD.kekerapan(pdRG), () => PD.bacaBar(pdRG), () => PD.bacaDot(pdRG), () => PD.sebar(pdRG)], s: [() => PD.pai(pdRG), () => PD.batang(pdRG), () => PD.garis(pdRG)], k: [() => PD.masalah(pdRG)] }
};
const WG = { jenis: () => PD.jenis(pdRW), kaedah: () => PD.kaedah(pdRW), kekerapan: () => PD.kekerapan(pdRW), bacaBar: () => PD.bacaBar(pdRW), bacaDot: () => PD.bacaDot(pdRW), sebar: () => PD.sebar(pdRW), pai: () => PD.pai(pdRW), batang: () => PD.batang(pdRW), garis: () => PD.garis(pdRW), masalah: i => PD.masalah(pdRW, i) };
const WSPLAN = { '8.1': [['m', 'jenis', 4], ['m', 'kaedah', 3], ['m', 'kekerapan', 3], ['m', 'bacaBar', 3], ['m', 'bacaDot', 2], ['m', 'sebar', 3], ['s', 'pai', 3], ['s', 'batang', 3], ['s', 'garis', 3], ['k', 'masalah', 3]] };

/* =================== GAMES =================== */
function pdMcq(q, ans, wrongs, fig) {
  const A = String(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(wrongs.map(String))) { if (seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 60; k++) { const c = A.replace(/\d+/, m => String(+m + k)); if (!seen.has(c)) { seen.add(c); w.push(c); } }
  const opts = shuffle([A, ...w]); return { type: 'mcq', q, fig: fig || '', opts, c: opts.indexOf(A) };
}
const CQGEN = {
  jenis: L => {
    if (L === 2) { const [x, a] = pick(PD_KAEDAH); return pdMcq(`${x} Kaedah paling sesuai ialah`, a, ['Temu bual', 'Eksperimen', 'Pemerhatian', 'Tinjauan (borang soal selidik)']); }
    const [x, a] = pick(PD_JENIS); return pdMcq(`“${x[0].toUpperCase() + x.slice(1)}” ialah`, a, ['Data kategori', 'Data numerik diskret', 'Data numerik selanjar', 'Data kategori dan numerik']);
  },
  carta: L => {
    if (L === 0) { const labs = ['4A', '4B', '4C', '4D'], v = labs.map(() => ri(2, 12) * 5), i = ri(0, 3); return pdMcq(`Bilangan buku dipinjam oleh kelas ${labs[i]} ialah`, v[i], [v[(i + 1) % 4], v[i] + 5, v[i] - 5 || 55], pdBars(labs, [v], 60, 10, '', 'Bilangan buku', 'satu')); }
    if (L === 1) { const labs = ['A', 'B', 'C'], a = labs.map(() => ri(2, 10)), b = labs.map(() => ri(2, 10)), i = ri(0, 2); return pdMcq(`Bilangan murid perempuan dalam kumpulan ${labs[i]} ialah`, b[i], [a[i] + b[i], a[i], b[i] + 1], pdBars(labs, [a, b], 20, 4, '', 'Bilangan murid', 'tindan', ['Lelaki', 'Perempuan'])); }
    const t = pick([['Hubungan positif', 1], ['Hubungan negatif', -1]]), pts = []; for (let x = 1; x <= 9; x++) pts.push([x, t[1] === 1 ? 10 + x * 9 + ri(-5, 5) : 95 - x * 9 + ri(-5, 5)]);
    return pdMcq('Graf sebar ini menunjukkan', t[0], ['Hubungan positif', 'Hubungan negatif', 'Tiada hubungan', 'Hubungan sama'], pdScatter(pts, 10, 100, 'x', 'y'));
  },
  pai: L => {
    const tot = pick([36, 40, 60, 72, 90]), divs = [...Array(tot).keys()].map(k => k + 1).filter(f => (f * 360) % tot === 0 && f < tot / 2), f = pick(divs), ang = f * 360 / tot;
    if (L === 0) return pdMcq(`${f} daripada ${tot} murid suka renang. Sudut sektor renang ialah`, `${ang}°`, [`${f}°`, `${ang + 10}°`, `${360 - ang}°`]);
    if (L === 1) return pdMcq(`Sektor bersudut ${ang}° dalam carta pai bagi ${tot} murid mewakili`, `${f} murid`, [`${ang} murid`, `${f + 2} murid`, `${tot - f} murid`]);
    const T = pick([360, 720]), a = pick([90, 120, 60]); return pdMcq(`Perbelanjaan ${pdRM(T)}: sektor makanan bersudut ${a}°. Belanja makanan ialah`, pdRM(a / 360 * T), [pdRM(a), pdRM(a / 360 * T + 20), pdRM(T - a / 360 * T)]);
  }
};
const CQT = { jenis: 'Jenis data dan kaedah', carta: 'Membaca carta', pai: 'Carta pai' };
function gq(level) { return CQGEN[pick(Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
function cq(level, types) { const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]); return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0))); }
