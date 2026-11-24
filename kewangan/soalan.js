'use strict';
/* =================== KEWANGAN · SOALAN BAB 10 MATEMATIK PENGGUNA: PENGURUSAN KEWANGAN (Tingkatan 4) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "kw" / "KW" supaya tidak bertembung dengan teras.
// Takrif yang digunakan (ikut buku teks):
//   aliran tunai = jumlah pendapatan − jumlah perbelanjaan (positif = lebihan, negatif = defisit)
//   pelan kewangan: pendapatan − simpanan tetap (10%) − dana kecemasan − perbelanjaan tetap − perbelanjaan tidak tetap = lebihan
//   simpanan bulanan = nilai matlamat ÷ bilangan bulan; tempoh = nilai matlamat ÷ simpanan bulanan (bundar ke atas)
//   pelan boleh dilaksanakan jika simpanan bulanan yang diperlukan ≤ lebihan pendapatan bulanan

/* =================== pembantu nombor & wang =================== */
const kwR2 = x => Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100;
const kwGrp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const kwN = x => { x = kwR2(x); const neg = x < 0; x = Math.abs(x); const s = Number.isInteger(x) ? kwGrp(String(x)) : (() => { const [a, b] = x.toFixed(2).split('.'); return kwGrp(a) + '.' + b; })(); return (neg ? '−' : '') + s; };
const kwRM = x => { x = kwR2(x); return (x < 0 ? '−' : '') + 'RM' + kwN(Math.abs(x)); };
const kwD2 = x => { const v = Math.round(x * 100) / 100; return String(v); };       // 16.67 (perpuluhan kemas)
const kwDan = a => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' dan ' + a[a.length - 1]);
const kwSum = a => a.reduce((s, v) => s + v, 0);
// rawak: kwRG untuk Latihan Kelas / games, kwRW (berbenih) untuk Lembaran Kerja
const kwRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const kwRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };
const kwShuf = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const kwStep = (r, a, b, s) => a + s * r.i(0, Math.floor((b - a) / s));           // nombor rawak a..b dengan langkah s
const kwAt = (r, list, k, m = 7) => (k == null ? r.p(list) : list[(k * m + 3) % list.length]);
const kwCF = x => (x > 0 ? 'aliran tunai positif' : x < 0 ? 'aliran tunai negatif' : 'aliran tunai sifar');

/* =================== data bersama =================== */
const KWLANGKAH = ['Menetapkan matlamat kewangan', 'Menilai status kewangan', 'Mewujudkan pelan kewangan', 'Melaksanakan pelan kewangan', 'Mengkaji semula dan menyemak kemajuan'];
const KWAKT = [
  ['menentukan bahawa dia mahu membeli komputer riba dalam tempoh setahun', 0],
  ['memutuskan untuk mengumpul RM5 000 bagi wang pendahuluan kereta', 0],
  ['menyenaraikan barang yang diingini dan mengutamakan keperluan', 0],
  ['menyenaraikan semua aset dan liabiliti yang dimilikinya', 1],
  ['mengira jumlah pendapatan dan perbelanjaan bulanannya sekarang', 1],
  ['menyemak baki akaun bank dan jumlah hutang yang ada', 1],
  ['menyediakan belanjawan bulanan dan menetapkan jumlah simpanan', 2],
  ['merancang untuk mengasingkan 10% daripada gajinya sebagai simpanan', 2],
  ['merancang dana kecemasan dan had perbelanjaan setiap bulan', 2],
  ['merekod perbelanjaan harian mengikut belanjawan', 3],
  ['membandingkan perbelanjaan sebenar dengan perbelanjaan yang dirancang', 3],
  ['memasukkan RM200 ke dalam akaun simpanan setiap bulan seperti yang dirancang', 3],
  ['mendapati matlamatnya tidak realistik lalu memanjangkan tempoh simpanan', 4],
  ['menyemak kemajuan simpanan setiap tiga bulan dan mengubah suai pelan', 4],
  ['mengubah pelan kewangannya selepas gajinya meningkat', 4]
];
const KWPERLU = [
  ['beras dan lauk-pauk', 1], ['sewa rumah', 1], ['bil elektrik', 1], ['tambang bas ke sekolah', 1],
  ['ubat-ubatan', 1], ['pakaian seragam sekolah', 1], ['bil air', 1], ['buku latihan dan alat tulis', 1],
  ['telefon pintar model terbaharu', 0], ['kasut sukan berjenama', 0], ['langganan permainan dalam talian', 0], ['makan malam di restoran mewah', 0],
  ['jam tangan pintar', 0], ['percutian ke luar negara', 0], ['beg tangan berjenama', 0], ['konsol permainan video', 0]
];
const KWPEND = [
  ['gaji bulanan', 1], ['elaun kerja lebih masa', 1], ['komisen jualan', 1], ['upah mengajar tuisyen', 1],
  ['bonus tahunan daripada majikan', 1], ['upah kerja sambilan', 1], ['bayaran menjahit baju tempahan', 1], ['upah menghantar makanan', 1],
  ['sewa rumah yang disewakan kepada orang lain', 0], ['dividen saham', 0], ['faedah simpanan tetap', 0], ['royalti buku', 0],
  ['hasil sewa kedai', 0], ['dividen amanah saham', 0], ['hasil sewa tanah', 0], ['faedah akaun simpanan', 0]
];
const KWBEL = [
  ['sewa rumah', 1], ['ansuran kereta', 1], ['premium insurans', 1], ['bayaran balik pinjaman PTPTN', 1],
  ['ansuran rumah', 1], ['yuran tuisyen bulanan anak', 1], ['ansuran motosikal', 1], ['yuran gimnasium bulanan', 1],
  ['bil elektrik', 0], ['bil air', 0], ['makanan', 0], ['petrol', 0],
  ['hiburan', 0], ['pakaian', 0], ['barang dapur', 0], ['makan di luar', 0]
];
// matlamat: [frasa, harga min, harga maks, langkah]
const KWBARANG = [['membeli komputer riba', 1800, 4200, 600], ['membeli telefon pintar', 1200, 3000, 600], ['membeli basikal', 480, 1200, 120],
  ['membeli motosikal', 4800, 9600, 1200], ['membayar yuran kursus memandu', 1200, 2400, 600], ['melancong ke Sabah', 1800, 3600, 600],
  ['membeli mesin jahit', 960, 1920, 240], ['membeli peti sejuk baharu', 1800, 3000, 600]];
// matlamat jangka panjang: [frasa kerja, frasa nama, harga min, harga maks]
const KWPANJANG = [['membeli rumah', 'wang pendahuluan rumah', 300000, 600000], ['menyimpan untuk persaraan', 'dana persaraan', 200000, 500000], ['membiayai pengajian universiti anak', 'dana pengajian anak', 50000, 150000],
  ['membuka perniagaan sendiri', 'modal perniagaan', 30000, 100000], ['menunaikan haji', 'tabungan haji', 20000, 40000]];
// pilih matlamat yang sesuai dengan nilai wang
const KWITEM = [[1500, ['membeli basikal', 'membeli telefon pintar', 'membeli mesin jahit', 'membayar yuran kursus memandu']],
  [5000, ['membeli komputer riba', 'melancong ke Sabah', 'membeli peti sejuk baharu', 'membeli set sofa baharu']],
  [15000, ['membeli motosikal', 'melancong ke Jepun', 'mengubah suai dapur rumah', 'membeli perabot baharu']],
  [Infinity, ['membayar wang pendahuluan kereta', 'membayar wang pendahuluan rumah', 'membeli kereta terpakai']]];
const kwItemFor = (r, v) => r.p(KWITEM.find(x => v <= x[0])[1]);
const KWHURUF = ['P', 'Q', 'R', 'S', 'T'];
const KWSMART = { S: 'Spesifik (S)', M: 'Boleh diukur (M)', T: 'Tempoh masa (T)' };
const KWBS1 = [
  ['Langkah pertama dalam proses pengurusan kewangan ialah menetapkan matlamat kewangan.', true, 'Proses bermula dengan menetapkan matlamat kewangan.'],
  ['Proses pengurusan kewangan mempunyai lima langkah.', true, 'Lima langkah: matlamat, status, pelan, laksana, semak semula.'],
  ['Matlamat "Saya mahu menjadi kaya" ialah matlamat SMART.', false, 'Matlamat itu tidak spesifik, tidak boleh diukur dan tiada tempoh masa.'],
  ['Kehendak perlu diutamakan sebelum keperluan.', false, 'Keperluan mesti diutamakan sebelum kehendak.'],
  ['Matlamat kewangan jangka pendek biasanya dicapai dalam tempoh setahun atau kurang.', true, 'Matlamat jangka pendek: setahun atau kurang.'],
  ['Membeli rumah biasanya ialah matlamat kewangan jangka pendek.', false, 'Membeli rumah memerlukan jumlah wang yang besar dan tempoh yang panjang, maka ia matlamat jangka panjang.'],
  ['Huruf T dalam SMART bermaksud tempoh masa.', true, 'T: matlamat mesti mempunyai tempoh masa atau tarikh akhir.'],
  ['Pelan kewangan tidak perlu dikaji semula selepas dilaksanakan.', false, 'Langkah kelima ialah mengkaji semula dan menyemak kemajuan pelan.'],
  ['Menilai status kewangan termasuk mengenal pasti aset dan liabiliti.', true, 'Status kewangan dinilai melalui pendapatan, perbelanjaan, aset dan liabiliti.']
];
const KWBS2 = [
  ['Gaji ialah contoh pendapatan aktif.', true, 'Gaji diperoleh dengan bekerja, maka ia pendapatan aktif.'],
  ['Dividen saham ialah contoh pendapatan aktif.', false, 'Dividen diperoleh tanpa bekerja secara aktif, maka ia pendapatan pasif.'],
  ['Ansuran kereta ialah perbelanjaan tetap.', true, 'Jumlah ansuran kereta sama setiap bulan.'],
  ['Bil elektrik ialah perbelanjaan tetap kerana dibayar setiap bulan.', false, 'Jumlah bil elektrik berubah setiap bulan, maka ia perbelanjaan tidak tetap.'],
  ['Aliran tunai positif bermaksud jumlah pendapatan melebihi jumlah perbelanjaan.', true, 'Aliran tunai = pendapatan − perbelanjaan > 0.'],
  ['Aliran tunai negatif bermaksud ada lebihan wang untuk disimpan.', false, 'Aliran tunai negatif bermaksud perbelanjaan melebihi pendapatan (defisit).'],
  ['Gaji bersih digunakan dalam pelan kewangan peribadi.', true, 'Gaji bersih ialah wang yang benar-benar diterima selepas potongan.'],
  ['Simpanan sebaik-baiknya diasingkan pada awal bulan, sebelum berbelanja.', true, 'Konsep "bayar diri sendiri dahulu".'],
  ['Sewa yang diterima daripada rumah yang disewakan ialah pendapatan pasif.', true, 'Sewa diterima tanpa bekerja secara aktif.']
];
const KWBS3 = [
  ['Pelan kewangan boleh dilaksanakan jika simpanan bulanan yang diperlukan tidak melebihi lebihan pendapatan.', true, 'Simpanan perlu ≤ lebihan → boleh dilaksanakan.'],
  ['Memanjangkan tempoh simpanan akan menambah simpanan bulanan yang diperlukan.', false, 'Tempoh lebih panjang → simpanan bulanan lebih kecil.'],
  ['Jika simpanan bulanan RM250 dan matlamat RM1 000, tempohnya ialah 4 bulan.', true, 'Tempoh = 1 000 ÷ 250 = 4 bulan.'],
  ['Tempoh 2 tahun bersamaan dengan 24 bulan.', true, '2 × 12 = 24 bulan.'],
  ['Tempoh simpanan 16.2 bulan dibundarkan kepada 16 bulan.', false, 'Selepas 16 bulan simpanan belum cukup, maka bundarkan ke atas: 17 bulan.'],
  ['Mengurangkan perbelanjaan tidak tetap boleh menambah lebihan pendapatan.', true, 'Lebihan = pendapatan − perbelanjaan; perbelanjaan berkurang, lebihan bertambah.'],
  ['Kebolehlaksanaan pelan dinilai dengan membandingkan simpanan perlu dengan jumlah pendapatan.', false, 'Bandingkan dengan lebihan pendapatan, bukan jumlah pendapatan.'],
  ['Menambah pendapatan pasif ialah satu cara menambah baik pelan kewangan.', true, 'Pendapatan bertambah, maka lebihan bertambah.']
];

/* =================== rajah (SVG ikut tema: var(--…)) =================== */
const kwT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const kwRect = (x, y, w, h, c, op = .18, rx = 10, sw = 2) => `<rect x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" width="${+Math.max(1, w).toFixed(1)}" height="${+Math.max(1, h).toFixed(1)}" rx="${rx}" style="fill:var(--${c});fill-opacity:${op};stroke:var(--${c})" stroke-width="${sw}"/>`;
const kwSvg = (w, h, s, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// penyata / kad maklumat: rows = [[label, nilai, warna]] ; label '—' = garis pemisah
function kwKad(title, rows, c = 'gr') {
  let y = 66, s = '';
  rows.forEach(([l, v, cl]) => {
    if (l === '—') { s += `<line x1="18" y1="${y - 16}" x2="342" y2="${y - 16}" style="stroke:var(--bd)" stroke-width="2"/>`; y += 6; return; }
    s += kwT(20, y, l, 'mu', 15, 'start', 600) + kwT(340, y, v, cl || 'tx', 16, 'end', 800); y += 34;
  });
  const H = y - 8;
  return kwSvg(360, H, `<rect x="2" y="2" width="356" height="${H - 4}" rx="16" style="fill:var(--surf);stroke:var(--${c})" stroke-width="2.5"/>` + kwT(180, 28, title, c, 16, 'middle', 800) + `<line x1="18" y1="46" x2="342" y2="46" style="stroke:var(--bd)" stroke-width="2"/>` + s, title);
}
// balang simpanan: isi (0..1), label atas & bawah
function kwBalang(top, bot, frac, c = 'gr') {
  const fh = 150 * Math.max(0, Math.min(1, frac));
  let s = kwRect(108, 182 - fh, 124, fh, c, .35, 8, 0);
  s += `<path d="M100 40 V170 Q100 190 120 190 H220 Q240 190 240 170 V40" style="fill:none;stroke:var(--${c})" stroke-width="5" stroke-linejoin="round"/>` + kwRect(92, 26, 156, 16, c, .3, 6, 3);
  s += `<circle cx="170" cy="112" r="24" style="fill:var(--am);fill-opacity:.25;stroke:var(--am)" stroke-width="4"/>` + kwT(170, 113, 'RM', 'am', 16, 'middle', 800);
  s += kwT(300, 70, top, 'tx', 17, 'middle', 800) + kwT(300, 150, bot, 'mu', 15, 'middle', 700);
  return kwSvg(380, 210, s, 'Balang simpanan');
}
// ikon tema (untuk games)
function kwIkon(kind) {
  let s = '';
  if (kind === 'kitaran') {
    const cols = ['tr', 'pu', 'gr', 'am', 'pk'];
    for (let i = 0; i < 5; i++) { const a = (-90 + 72 * i) * Math.PI / 180, x = 150 + 92 * Math.cos(a), y = 140 + 92 * Math.sin(a); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" style="fill:var(--${cols[i]});fill-opacity:.25;stroke:var(--${cols[i]})" stroke-width="4"/>` + kwT(x, y + 1, i + 1, cols[i], 22, 'middle', 800); }
    s += `<circle cx="150" cy="140" r="56" style="fill:none;stroke:var(--mu2)" stroke-width="3" stroke-dasharray="7 7"/>` + kwT(150, 141, 'RM', 'am', 22, 'middle', 800);
  } else if (kind === 'smart') {
    const cols = ['tr', 'gr', 'am', 'pa', 'pk'];
    'SMART'.split('').forEach((L, i) => { s += kwRect(14 + i * 56, 100, 48, 72, cols[i], .22, 12, 3) + kwT(38 + i * 56, 137, L, cols[i], 34, 'middle', 800); });
    s += kwT(150, 60, 'Matlamat kewangan', 'tx', 20, 'middle', 800) + kwT(150, 214, 'Spesifik · Diukur · Dicapai', 'mu', 14, 'middle', 700) + kwT(150, 236, 'Realistik · Tempoh', 'mu', 14, 'middle', 700);
  } else if (kind === 'aliran') {
    s = kwRect(30, 60, 90, 170, 'gr', .25, 8, 3) + kwRect(180, 110, 90, 120, 'pk', .25, 8, 3) + kwT(75, 40, 'Masuk', 'gr', 18, 'middle', 800) + kwT(225, 90, 'Keluar', 'pk', 18, 'middle', 800);
    s += `<line x1="20" y1="232" x2="280" y2="232" style="stroke:var(--mu)" stroke-width="3"/>` + kwT(150, 262, 'Aliran tunai = masuk − keluar', 'mu', 15, 'middle', 700);
  } else {
    s = `<ellipse cx="150" cy="150" rx="92" ry="66" style="fill:var(--gr);fill-opacity:.2;stroke:var(--gr)" stroke-width="5"/><rect x="122" y="80" width="56" height="10" rx="4" style="fill:var(--gr)"/><line x1="92" y1="208" x2="92" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><line x1="208" y1="208" x2="208" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="138" r="7" style="fill:var(--gr)"/><circle cx="150" cy="46" r="24" style="fill:var(--am);fill-opacity:.25;stroke:var(--am)" stroke-width="4"/>` + kwT(150, 47, 'RM', 'am', 17, 'middle', 800);
  }
  return kwSvg(300, 280, s, 'Ikon pengurusan kewangan');
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 10.1.1 Proses Kewangan ---------- */
  langkahNo: [
    ({ n }) => ({ q: `Apakah langkah ke-${n} dalam proses pengurusan kewangan?` }),
    ({ n }) => ({ q: `Proses pengurusan kewangan mempunyai lima langkah. Nyatakan langkah ke-${n}.` }),
    ({ n }) => ({ q: `Lengkapkan: Langkah ${n} dalam proses pengurusan kewangan ialah ___.` }),
    ({ n, prev }) => ({ q: n === 1 ? `Proses pengurusan kewangan ialah satu kitaran. Selepas langkah "${prev}", proses bermula semula dengan langkah apa?` : `Dalam proses pengurusan kewangan, apakah langkah yang dilakukan selepas "${prev}"?` })
  ],
  langkahAkt: [
    ({ N, akt }) => ({ q: `${N} ${akt}. Langkah manakah dalam proses pengurusan kewangan yang sedang dilakukannya?` }),
    ({ akt }) => ({ q: `Aktiviti "${akt}" termasuk dalam langkah pengurusan kewangan yang mana?` }),
    ({ N, akt }) => ({ q: `${N} ${akt}. Nyatakan langkah pengurusan kewangan yang sepadan dengan tindakan ini.` }),
    ({ N, akt, wrong, ans }) => Object.assign({ q: `${N} ${akt}. Rakannya berkata ini ialah langkah "${wrong}". Adakah rakannya betul?` }, salah(N, ans, `Langkah "${wrong}" tidak sepadan dengan aktiviti ini.`))
  ],
  perlu: [
    ({ item }) => ({ q: `Kelaskan "${item}" sebagai keperluan atau kehendak.` }),
    ({ item }) => ({ q: `Adakah perbelanjaan untuk ${item} satu keperluan atau kehendak?` }),
    ({ N, item }) => ({ q: `${N} mahu menggunakan wangnya untuk ${item}. Adakah ini satu keperluan atau kehendak?` }),
    ({ N, item, claim, ans }) => Object.assign({ q: `${N} berkata ${item} ialah satu ${claim}. Adakah ${N} betul?` }, salah(N, ans, `${vcap(item)} ialah ${ans.toLowerCase()}.`))
  ],
  jangka: [
    ({ N, goal, amt, per }) => ({ q: `${N} merancang untuk ${goal} bernilai ${amt} dalam tempoh ${per}. Adakah ini matlamat kewangan jangka pendek atau jangka panjang?` }),
    ({ goal, amt, per }) => ({ q: `Kelaskan matlamat berikut sebagai jangka pendek atau jangka panjang: ${goal} bernilai ${amt} dalam tempoh ${per}.` }),
    ({ N, goal, amt, per }) => ({ q: `Matlamat ${N}: "Saya mahu ${goal} (${amt}) dalam masa ${per}." Apakah jenis matlamat kewangan ini?` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  smartKurang: [
    ({ N, st }) => ({ q: `Matlamat ${N}: "${st}" Ciri SMART manakah yang tidak dipenuhi oleh matlamat ini?` }),
    ({ N, st }) => ({ q: `${N} menulis matlamat kewangan "${st}" Nyatakan ciri SMART yang tiada dalam matlamat itu.` }),
    ({ st }) => ({ q: `Mengapakah matlamat "${st}" bukan matlamat SMART?` }),
    ({ st }) => ({ q: `Kenal pasti ciri SMART yang perlu ditambah supaya matlamat "${st}" menjadi matlamat SMART.` })
  ],
  realistik: [
    ({ N, g, goal, item, m }) => ({ q: `${N} menerima gaji bersih ${kwRM(g)} sebulan. Dia mahu menyimpan ${kwRM(goal)} untuk ${item} dalam ${m} bulan. Hitung simpanan bulanannya dan nyatakan simpanan itu sebagai peratus daripada gaji bersih.` }),
    ({ N, g, goal, m }) => ({ q: `Matlamat ${N} ialah mengumpul ${kwRM(goal)} dalam tempoh ${m} bulan. Gaji bersihnya ${kwRM(g)} sebulan. Berapakah simpanan bulanan yang diperlukan, dan berapa peratus daripada gajinya?` }),
    ({ N, g, goal, item, m }) => ({ q: `Untuk menilai sama ada matlamatnya realistik, ${N} (gaji bersih ${kwRM(g)}) mengira simpanan bulanan untuk ${item} bernilai ${kwRM(goal)} dalam ${m} bulan sebagai peratus daripada gajinya. Apakah jawapannya?` })
  ],
  susun: [
    ({ list }) => ({ q: `Susun langkah berikut mengikut urutan proses pengurusan kewangan: ${list}.` }),
    ({ list }) => ({ q: `Langkah-langkah pengurusan kewangan di bawah tidak tersusun: ${list}. Tulis urutan yang betul.` }),
    ({ N, list }) => ({ q: `${N} mencatat langkah pengurusan kewangan secara rawak: ${list}. Bantu ${N} menyusunnya mengikut urutan yang betul.` })
  ],
  k111: [
    ({ a }) => ({ q: `${a.N} menerima gaji bersih ${kwRM(a.g)} sebulan. Dia ada dua matlamat: (i) ${a.g1} bernilai ${kwRM(a.c1)} dalam ${a.m1} bulan, (ii) mengumpul ${a.g2} sebanyak ${kwRM(a.c2)} dalam ${a.y2} tahun. (a) Kelaskan setiap matlamat sebagai jangka pendek atau jangka panjang. (b) Hitung simpanan bulanan bagi setiap matlamat. (c) Berapakah baki gajinya selepas kedua-dua simpanan itu?`,
      ans: `(a) (i) jangka pendek, (ii) jangka panjang (b) ${kwRM(a.s1)} dan ${kwRM(a.s2)} (c) ${kwRM(a.g - a.s1 - a.s2)}`,
      work: [`(a) (i) ${a.m1} bulan ≤ 1 tahun → jangka pendek; (ii) ${a.y2} tahun > 5 tahun → jangka panjang.`, `(b) (i) ${kwN(a.c1)} ÷ ${a.m1} = ${kwRM(a.s1)}`, `(ii) ${a.y2} tahun = ${a.y2 * 12} bulan; ${kwN(a.c2)} ÷ ${a.y2 * 12} = ${kwRM(a.s2)}`, `(c) ${kwN(a.g)} − ${kwN(a.s1)} − ${kwN(a.s2)} = ${kwRM(a.g - a.s1 - a.s2)}`] }),
    ({ b }) => ({ q: `${b.N} mahu mengumpul ${kwRM(b.D)} untuk ${b.what} dalam tempoh ${b.y} tahun. Gaji bersihnya ${kwRM(b.g)} sebulan. (a) Hitung simpanan bulanan yang diperlukan. (b) Berapa peratus daripada gajinya simpanan itu? (c) Jika dia hanya mampu menyimpan 10% daripada gajinya, berapa tahunkah diperlukan?`,
      ans: `(a) ${kwRM(b.s)} (b) ${b.pc}% (c) ${b.Y2} tahun`,
      work: [`(a) ${b.y} tahun = ${b.y * 12} bulan; ${kwN(b.D)} ÷ ${b.y * 12} = ${kwRM(b.s)}`, `(b) ${kwN(b.s)} ÷ ${kwN(b.g)} × 100% = ${b.pc}%`, `(c) 10% × ${kwN(b.g)} = ${kwRM(b.g / 10)} sebulan`, `${kwN(b.D)} ÷ ${kwN(b.g / 10)} = ${b.Y2 * 12} bulan = ${b.Y2} tahun`] }),
    ({ c }) => ({ q: `Matlamat ${c.N}: "Saya mahu ${c.goal}." (a) Nyatakan dua ciri SMART yang tidak dipenuhi. (b) Kos yang dianggarkan ialah ${kwRM(c.cost)} dan ${c.N} mahu mencapainya dalam ${c.m} bulan. Tulis semula matlamat itu sebagai matlamat SMART. (c) Hitung simpanan bulanan yang diperlukan.`,
      ans: `(a) Boleh diukur (tiada jumlah wang) dan tempoh masa (tiada tempoh) (b) "Saya mahu menyimpan ${kwRM(c.cost)} untuk ${c.goal} dalam tempoh ${c.m} bulan." (c) ${kwRM(c.cost / c.m)}`,
      work: ['(a) Matlamat itu tidak menyatakan jumlah wang dan tidak menyatakan tempoh.', `(b) Tambah jumlah wang (${kwRM(c.cost)}) dan tempoh (${c.m} bulan).`, `(c) ${kwN(c.cost)} ÷ ${c.m} = ${kwRM(c.cost / c.m)}`] })
  ],

  /* ---------- 10.1.2 Pelan & Aliran Tunai ---------- */
  jenisPend: [
    ({ item }) => ({ q: `Adakah ${item} pendapatan aktif atau pendapatan pasif?` }),
    ({ item }) => ({ q: `Kelaskan "${item}" sebagai pendapatan aktif atau pendapatan pasif.` }),
    ({ N, item }) => ({ q: `${N} menerima wang daripada ${item}. Apakah jenis pendapatan ini?` }),
    ({ N, item, claim, ans, why }) => Object.assign({ q: `${N} berkata ${item} ialah ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, why))
  ],
  jenisBel: [
    ({ item }) => ({ q: `Adakah perbelanjaan untuk ${item} perbelanjaan tetap atau perbelanjaan tidak tetap?` }),
    ({ item }) => ({ q: `Kelaskan "${item}" sebagai perbelanjaan tetap atau perbelanjaan tidak tetap.` }),
    ({ N, item }) => ({ q: `${N} membelanjakan wang untuk ${item} setiap bulan. Apakah jenis perbelanjaan ini?` }),
    ({ N, item, claim, ans, why }) => Object.assign({ q: `${N} berkata ${item} ialah ${claim.toLowerCase()}. Adakah ${N} betul?` }, salah(N, ans, why))
  ],
  aliranJum: [
    ({ N, I, E }) => ({ q: `Jumlah pendapatan bulanan ${N} ialah ${kwRM(I)} dan jumlah perbelanjaannya ${kwRM(E)}. Hitung aliran tunainya dan nyatakan sama ada positif atau negatif.` }),
    ({ N, I, E, mo }) => ({ q: `Pada bulan ${mo}, ${N} menerima ${kwRM(I)} dan membelanjakan ${kwRM(E)}. Berapakah aliran tunai bulan itu?` }),
    ({ I, E }) => ({ q: `Lengkapkan: Aliran tunai = ${kwRM(I)} − ${kwRM(E)} = ___` }),
    ({ N, I, E, ans }) => Object.assign({ q: `Pendapatan ${N} ialah ${kwRM(I)} dan perbelanjaannya ${kwRM(E)}. ${N} mengira aliran tunainya sebagai ${kwN(E)} − ${kwN(I)} = ${kwRM(E - I)}. Adakah ${N} betul?` }, salah(N, ans, 'Aliran tunai = jumlah pendapatan − jumlah perbelanjaan, bukan sebaliknya.'))
  ],
  jumPend: [
    ({ N }) => ({ q: `Rajah di bawah menunjukkan pendapatan bulanan ${N}. Hitung jumlah pendapatannya.` }),
    ({ N }) => ({ q: `Berdasarkan maklumat dalam rajah, berapakah jumlah pendapatan bulanan ${N}?` }),
    ({ N }) => ({ q: `${N} menyenaraikan semua sumber pendapatannya seperti dalam rajah. Berapakah jumlah aliran tunai masuk sebulan?` })
  ],
  jumJenis: [
    ({ N, jenis }) => ({ q: `Rajah di bawah menunjukkan sumber pendapatan ${N}. Hitung jumlah pendapatan ${jenis}nya.` }),
    ({ N, jenis }) => ({ q: `Berdasarkan rajah, kenal pasti pendapatan ${jenis} ${N} dan hitung jumlahnya.` }),
    ({ N, jenis }) => ({ q: `Antara pendapatan ${N} dalam rajah, berapakah jumlah pendapatan ${jenis}?` })
  ],
  aliranSenarai: [
    ({ N }) => ({ q: `Rajah di bawah menunjukkan pendapatan dan perbelanjaan bulanan ${N}. Hitung aliran tunainya dan nyatakan sama ada positif atau negatif.` }),
    ({ N }) => ({ q: `Berdasarkan penyata bulanan ${N} dalam rajah, adakah ${N} mempunyai aliran tunai positif atau negatif? Tunjukkan pengiraan.` }),
    ({ N }) => ({ q: `${N} menyenaraikan pendapatan dan perbelanjaan bulanannya seperti dalam rajah. Berapakah lebihan atau defisit wangnya sebulan?` })
  ],
  kelasJumlah: [
    ({ N }) => ({ q: `Rajah di bawah menunjukkan perbelanjaan bulanan ${N}. Hitung jumlah perbelanjaan tetap dan jumlah perbelanjaan tidak tetapnya.` }),
    ({ N }) => ({ q: `Kelaskan perbelanjaan ${N} dalam rajah kepada tetap dan tidak tetap, kemudian hitung jumlah setiap jenis.` }),
    ({ N }) => ({ q: `Berdasarkan senarai perbelanjaan ${N} dalam rajah, berapakah jumlah perbelanjaan tetap dan jumlah perbelanjaan tidak tetap?` })
  ],
  pelan: [
    ({ N, g, p, dk, tf, tv }) => ({ q: `${N} menerima gaji bersih ${kwRM(g)} dan pendapatan pasif ${kwRM(p)} sebulan. Dia menyimpan 10% daripada jumlah pendapatan dan ${kwRM(dk)} untuk dana kecemasan. Perbelanjaan tetapnya ${kwRM(tf)} dan perbelanjaan tidak tetapnya ${kwRM(tv)}. Hitung lebihan atau kurangan pendapatannya.` }),
    ({ N }) => ({ q: `Rajah di bawah menunjukkan pelan kewangan bulanan ${N}. Lengkapkan pelan itu dengan mencari nilai lebihan atau kurangan pendapatan.` }),
    ({ N, g, p, dk, tf, tv }) => ({ q: `Dalam pelan kewangan ${N}, jumlah pendapatan ialah ${kwRM(g + p)}. Selepas simpanan tetap 10% dan dana kecemasan ${kwRM(dk)}, dia membayar perbelanjaan tetap ${kwRM(tf)} dan perbelanjaan tidak tetap ${kwRM(tv)}. Berapakah baki akhirnya?` })
  ],
  cariX: [
    ({ N, I, known, x, CF }) => ({ q: `Jumlah pendapatan ${N} ialah ${kwRM(I)} sebulan. Perbelanjaannya ialah ${known} serta ${x}. Jika aliran tunainya ${kwRM(CF)}, berapakah perbelanjaan untuk ${x}?` }),
    ({ N, I, known, x, CF }) => ({ q: `${N} mempunyai aliran tunai positif ${kwRM(CF)} sebulan. Pendapatannya ${kwRM(I)}, dan perbelanjaannya terdiri daripada ${known} serta ${x}. Cari perbelanjaan untuk ${x}.` }),
    ({ N, x }) => ({ q: `Rajah di bawah menunjukkan penyata bulanan ${N}. Perbelanjaan untuk ${x} tertinggal. Cari nilai itu.` })
  ],
  k112: [
    ({ a }) => ({ q: `${a.N} menerima gaji bersih ${kwRM(a.g)} dan sewa bilik ${kwRM(a.p)} sebulan. Perbelanjaan tetapnya ${kwRM(a.tf)} dan perbelanjaan tidak tetapnya ${kwRM(a.tv)}. Dia menyimpan 10% daripada jumlah pendapatan. (a) Hitung jumlah pendapatan. (b) Hitung simpanan bulanan. (c) Hitung lebihan atau kurangan pendapatan. (d) ${a.neg ? 'Berapakah perbelanjaan tidak tetap yang perlu dikurangkan supaya tiada kurangan?' : `Berapa bulankah lebihan itu diperlukan untuk mengumpul ${kwRM(a.T)}?`}`,
      ans: `(a) ${kwRM(a.I)} (b) ${kwRM(a.sv)} (c) ${a.L < 0 ? 'Kurangan ' + kwRM(-a.L) : 'Lebihan ' + kwRM(a.L)} (d) ${a.neg ? kwRM(-a.L) : a.mo + ' bulan'}`,
      work: [`(a) ${kwN(a.g)} + ${kwN(a.p)} = ${kwRM(a.I)}`, `(b) 10% × ${kwN(a.I)} = ${kwRM(a.sv)}`, `(c) ${kwN(a.I)} − ${kwN(a.sv)} − ${kwN(a.tf)} − ${kwN(a.tv)} = ${kwRM(a.L)}`, a.neg ? `(d) Kurangkan perbelanjaan tidak tetap sekurang-kurangnya ${kwRM(-a.L)} sebulan.` : `(d) ${kwN(a.T)} ÷ ${kwN(a.L)} = ${a.mo} bulan`] }),
    ({ b }) => ({ q: `Pendapatan ${b.N} ialah ${kwRM(b.I)} setiap bulan. Pada bulan Januari, perbelanjaannya ${kwRM(b.E1)}. Pada bulan Februari, perbelanjaan tetapnya tidak berubah tetapi perbelanjaan tidak tetapnya bertambah ${kwRM(b.d)}. (a) Hitung aliran tunai bulan Januari. (b) Hitung aliran tunai bulan Februari dan nyatakan jenisnya. (c) Berapakah perubahan aliran tunai?`,
      ans: `(a) ${kwRM(b.I - b.E1)} (b) ${kwRM(b.I - b.E1 - b.d)}, ${kwCF(b.I - b.E1 - b.d)} (c) berkurang ${kwRM(b.d)}`,
      work: [`(a) ${kwN(b.I)} − ${kwN(b.E1)} = ${kwRM(b.I - b.E1)}`, `(b) Perbelanjaan Februari = ${kwN(b.E1)} + ${kwN(b.d)} = ${kwRM(b.E1 + b.d)}`, `Aliran tunai = ${kwN(b.I)} − ${kwN(b.E1 + b.d)} = ${kwRM(b.I - b.E1 - b.d)} (${kwCF(b.I - b.E1 - b.d)})`, `(c) Aliran tunai berkurang sebanyak ${kwRM(b.d)}, iaitu pertambahan perbelanjaan tidak tetap.`] }),
    ({ c }) => ({ q: `${c.N} ialah pelajar Tingkatan 4. Dia menerima wang saku ${kwRM(c.ws)} dan upah kerja sambilan ${kwRM(c.up)} sebulan. Dia berbelanja ${kwRM(c.mk)} untuk makanan, ${kwRM(c.tb)} untuk tambang dan ${kwRM(c.hb)} untuk hiburan. (a) Hitung aliran tunainya. (b) ${c.N} mahu menyimpan 10% daripada pendapatannya. Adakah lebihannya cukup? (c) Jika dia mengurangkan hiburan separuh, berapakah lebihan baharunya selepas simpanan 10%?`,
      ans: `(a) ${kwRM(c.CF)} (b) ${c.CF >= c.sv ? 'Ya' : 'Tidak'}, simpanan 10% = ${kwRM(c.sv)} (c) ${kwRM(c.CF + c.hb / 2 - c.sv)}`,
      work: [`(a) Pendapatan = ${c.ws} + ${c.up} = ${kwRM(c.I)}; perbelanjaan = ${c.mk} + ${c.tb} + ${c.hb} = ${kwRM(c.E)}`, `Aliran tunai = ${kwN(c.I)} − ${kwN(c.E)} = ${kwRM(c.CF)}`, `(b) 10% × ${kwN(c.I)} = ${kwRM(c.sv)}; ${kwRM(c.CF)} ${c.CF >= c.sv ? '≥' : '<'} ${kwRM(c.sv)}`, `(c) Hiburan baharu = ${c.hb} ÷ 2 = ${kwRM(c.hb / 2)}; lebihan = ${kwN(c.CF)} + ${kwN(c.hb / 2)} − ${kwN(c.sv)} = ${kwRM(c.CF + c.hb / 2 - c.sv)}`] })
  ],

  /* ---------- 10.1.3 Menilai Pelan ---------- */
  simpBulan: [
    ({ N, goal, item, m }) => ({ q: `${N} mahu mengumpul ${kwRM(goal)} untuk ${item} dalam tempoh ${m} bulan. Berapakah simpanan bulanan yang diperlukan?` }),
    ({ goal, m }) => ({ q: `Hitung simpanan bulanan untuk mencapai matlamat ${kwRM(goal)} dalam ${m} bulan.` }),
    ({ goal, m }) => ({ q: `Lengkapkan: Simpanan bulanan = ${kwRM(goal)} ÷ ${m} bulan = ___` }),
    ({ N, goal, item, m, ans }) => Object.assign({ q: `${N} mahu ${item} bernilai ${kwRM(goal)} dalam ${m} bulan. Dia berkata dia perlu menyimpan ${kwRM(goal * m)} sebulan. Adakah ${N} betul?` }, salah(N, ans, `${N} mendarab dengan bilangan bulan. Sepatutnya nilai matlamat ÷ bilangan bulan.`))
  ],
  simpTahun: [
    ({ N, goal, item, y }) => ({ q: `${N} merancang untuk ${item} bernilai ${kwRM(goal)} dalam masa ${y} tahun. Berapakah yang perlu disimpan setiap bulan?` }),
    ({ goal, y }) => ({ q: `Matlamat sebuah keluarga ialah mengumpul ${kwRM(goal)} dalam tempoh ${y} tahun. Hitung simpanan bulanan yang diperlukan.` }),
    ({ N, goal, y, ans }) => Object.assign({ q: `${N} mahu mengumpul ${kwRM(goal)} dalam ${y} tahun. Dia mengira simpanan bulanannya sebagai ${kwN(goal)} ÷ ${y} = ${kwRM(goal / y)}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menukar ${y} tahun kepada ${y * 12} bulan.`)),
    ({ goal, y }) => ({ q: `Berapakah simpanan sebulan untuk mencapai ${kwRM(goal)} dalam ${y} tahun?` })
  ],
  tempoh: [
    ({ N, goal, s, item }) => ({ q: `${N} menyimpan ${kwRM(s)} sebulan untuk ${item} bernilai ${kwRM(goal)}. Berapa bulankah yang diperlukan untuk mencapai matlamatnya?` }),
    ({ goal, s }) => ({ q: `Berapa bulankah diperlukan untuk mengumpul ${kwRM(goal)} jika ${kwRM(s)} disimpan setiap bulan?` }),
    ({ goal, s }) => ({ q: `Lengkapkan: Tempoh = ${kwRM(goal)} ÷ ${kwRM(s)} = ___ bulan` }),
    ({ N, goal, s, item }) => ({ q: `Dengan menyimpan ${kwRM(s)} setiap bulan, dalam berapa bulankah ${N} dapat ${item} yang berharga ${kwRM(goal)}?` })
  ],
  bolehMudah: [
    ({ N, need, L }) => ({ q: `${N} perlu menyimpan ${kwRM(need)} sebulan untuk mencapai matlamatnya. Lebihan pendapatannya ialah ${kwRM(L)} sebulan. Adakah pelan kewangannya boleh dilaksanakan?` }),
    ({ need, L }) => ({ q: `Simpanan bulanan yang diperlukan ialah ${kwRM(need)} dan lebihan pendapatan bulanan ialah ${kwRM(L)}. Nilaikan kebolehlaksanaan pelan ini.` }),
    ({ N, need, L }) => ({ q: `Lebihan pendapatan ${N} ialah ${kwRM(L)} sebulan. Matlamatnya memerlukan simpanan ${kwRM(need)} sebulan. Bolehkah matlamat itu dicapai mengikut pelan?` })
  ],
  tempohAtas: [
    ({ N, goal, s, item }) => ({ q: `${N} menyimpan ${kwRM(s)} sebulan untuk ${item} berharga ${kwRM(goal)}. Berapakah bilangan bulan minimum yang diperlukan?` }),
    ({ goal, s }) => ({ q: `Hitung tempoh minimum (dalam bulan) untuk mengumpul ${kwRM(goal)} dengan simpanan ${kwRM(s)} sebulan.` }),
    ({ N, goal, s, ans, lo }) => Object.assign({ q: `${N} menyimpan ${kwRM(s)} sebulan untuk mengumpul ${kwRM(goal)}. Dia berkata dia memerlukan ${lo} bulan. Adakah ${N} betul?` }, salah(N, ans, `Selepas ${lo} bulan, simpanan hanya ${kwRM(s * lo)}, belum cukup. Tempoh mesti dibundarkan ke atas.`))
  ],
  nilai: [
    ({ N, goal, item, y, L }) => ({ q: `${N} mahu ${item} bernilai ${kwRM(goal)} dalam ${y} tahun. Lebihan pendapatannya ialah ${kwRM(L)} sebulan. Adakah pelan ini boleh dilaksanakan? Tunjukkan pengiraan.` }),
    ({ N, goal, item, y, L }) => ({ q: `Nilaikan kebolehlaksanaan pelan ${N}: matlamat ${kwRM(goal)} untuk ${item} dalam tempoh ${y} tahun, dengan lebihan pendapatan ${kwRM(L)} sebulan.` }),
    ({ N, goal, y, L }) => ({ q: `Lebihan pendapatan bulanan ${N} ialah ${kwRM(L)}. Dia mahu mengumpul ${kwRM(goal)} dalam ${y} tahun. Bolehkah dia mencapainya? Jika tidak, berapakah kekurangan sebulan?` })
  ],
  ubahTempoh: [
    ({ N, goal, m, L }) => ({ q: `${N} mahu mengumpul ${kwRM(goal)} dalam ${m} bulan, tetapi lebihan pendapatannya hanya ${kwRM(L)} sebulan. Jika dia menyimpan semua lebihannya, berapakah tempoh minimum yang diperlukan?` }),
    ({ N, goal, m, L }) => ({ q: `Pelan ${N} untuk mengumpul ${kwRM(goal)} dalam ${m} bulan tidak boleh dilaksanakan kerana lebihannya ${kwRM(L)} sebulan. Cadangkan tempoh baharu (dalam bulan) yang paling singkat.` }),
    ({ goal, m, L }) => ({ q: `Matlamat ${kwRM(goal)} dalam ${m} bulan tidak dapat dicapai dengan lebihan ${kwRM(L)} sebulan. Berapa bulankah sebenarnya diperlukan jika semua lebihan disimpan?` })
  ],
  kurangBelanja: [
    ({ N, goal, m, L }) => ({ q: `${N} mahu mengumpul ${kwRM(goal)} dalam ${m} bulan. Lebihan pendapatannya ${kwRM(L)} sebulan. Berapakah perbelanjaan tidak tetap yang perlu dikurangkan setiap bulan supaya pelan itu boleh dilaksanakan?` }),
    ({ N, goal, m, L }) => ({ q: `Untuk mencapai ${kwRM(goal)} dalam ${m} bulan, ${N} yang mempunyai lebihan ${kwRM(L)} sebulan perlu mengurangkan perbelanjaan. Hitung jumlah minimum yang perlu dikurangkan sebulan.` }),
    ({ N, goal, m, L }) => ({ q: `${N} mempunyai lebihan ${kwRM(L)} sebulan. Matlamatnya ${kwRM(goal)} dalam ${m} bulan. Berapakah pendapatan tambahan sebulan yang diperlukan daripada kerja sambilan?` })
  ],
  k113: [
    ({ a }) => ({ q: `${a.N} menerima gaji bersih ${kwRM(a.I)} sebulan. Perbelanjaan tetapnya ${kwRM(a.tf)} dan perbelanjaan tidak tetapnya ${kwRM(a.tv)}. Dia mahu ${a.item} bernilai ${kwRM(a.goal)} dalam ${a.y} tahun. (a) Hitung lebihan pendapatannya. (b) Hitung simpanan bulanan yang diperlukan. (c) Adakah pelan ini boleh dilaksanakan? (d) ${a.ok ? 'Berapakah baki lebihan selepas simpanan?' : 'Cadangkan tempoh minimum (dalam bulan) jika dia menyimpan semua lebihannya.'}`,
      ans: `(a) ${kwRM(a.L)} (b) ${kwRM(a.need)} (c) ${a.ok ? 'Boleh' : 'Tidak boleh'} (d) ${a.ok ? kwRM(a.L - a.need) : a.mo + ' bulan'}`,
      work: [`(a) ${kwN(a.I)} − ${kwN(a.tf)} − ${kwN(a.tv)} = ${kwRM(a.L)}`, `(b) ${a.y} tahun = ${a.y * 12} bulan; ${kwN(a.goal)} ÷ ${a.y * 12} = ${kwRM(a.need)}`, `(c) ${kwRM(a.need)} ${a.ok ? '≤' : '>'} ${kwRM(a.L)}, maka ${a.ok ? 'boleh' : 'tidak boleh'} dilaksanakan.`, a.ok ? `(d) ${kwN(a.L)} − ${kwN(a.need)} = ${kwRM(a.L - a.need)}` : `(d) ${kwN(a.goal)} ÷ ${kwN(a.L)} = ${kwD2(a.goal / a.L)} → ${a.mo} bulan`] }),
    ({ b }) => ({ q: `${b.N} mahu mengumpul ${kwRM(b.goal)} untuk wang pendahuluan kereta. Lebihan pendapatannya ${kwRM(b.L)} sebulan dan semuanya disimpan. (a) Berapa bulankah diperlukan? (b) Jika dia mengurangkan perbelanjaan hiburan sebanyak ${kwRM(b.x)} sebulan dan menyimpan wang itu juga, berapa bulankah diperlukan? (c) Berapa bulan lebih awal matlamat itu tercapai?`,
      ans: `(a) ${b.m1} bulan (b) ${b.m2} bulan (c) ${b.m1 - b.m2} bulan`,
      work: [`(a) ${kwN(b.goal)} ÷ ${kwN(b.L)} = ${b.m1} bulan`, `(b) Simpanan baharu = ${kwN(b.L)} + ${kwN(b.x)} = ${kwRM(b.L + b.x)}; ${kwN(b.goal)} ÷ ${kwN(b.L + b.x)} = ${b.m2} bulan`, `(c) ${b.m1} − ${b.m2} = ${b.m1 - b.m2} bulan`] }),
    ({ c }) => ({ q: `${c.N} sudah mempunyai simpanan ${kwRM(c.S0)}. Dia mahu ${c.item} bernilai ${kwRM(c.goal)} dalam ${c.m} bulan. Lebihan pendapatannya ${kwRM(c.L)} sebulan. (a) Berapakah lagi wang yang perlu dikumpul? (b) Hitung simpanan bulanan yang diperlukan. (c) Adakah pelan itu boleh dilaksanakan? Beri sebab.`,
      ans: `(a) ${kwRM(c.goal - c.S0)} (b) ${kwRM(c.need)} (c) ${c.ok ? 'Boleh' : 'Tidak boleh'}, kerana ${kwRM(c.need)} ${c.ok ? '≤' : '>'} ${kwRM(c.L)}`,
      work: [`(a) ${kwN(c.goal)} − ${kwN(c.S0)} = ${kwRM(c.goal - c.S0)}`, `(b) ${kwN(c.goal - c.S0)} ÷ ${c.m} = ${kwRM(c.need)}`, `(c) Bandingkan dengan lebihan: ${kwRM(c.need)} ${c.ok ? '≤' : '>'} ${kwRM(c.L)}, maka pelan ${c.ok ? 'boleh' : 'tidak boleh'} dilaksanakan.`] })
  ]
};

/* =================== pembina soalan (r = kwRG atau kwRW) =================== */
const KW = {};
/* ---------- 10.1.1 ---------- */
KW.langkahNo = (r, k) => {
  const n = k == null ? r.i(1, 5) : (k % 5) + 1, ans = KWLANGKAH[n - 1], prev = KWLANGKAH[(n + 3) % 5];
  return GEN_LQ('langkahNo', { n, prev, ans, work: ['Lima langkah: (1) menetapkan matlamat kewangan, (2) menilai status kewangan, (3) mewujudkan pelan kewangan, (4) melaksanakan pelan kewangan, (5) mengkaji semula dan menyemak kemajuan.', `Langkah ${n}: ${ans}.`] });
};
KW.langkahAkt = (r, k) => {
  const [akt, st] = kwAt(r, KWAKT, k, 4), ans = KWLANGKAH[st];
  const wrong = KWLANGKAH[(st + 1 + r.i(0, 3)) % 5], N = vnama();
  return GEN_LQ('langkahAkt', { N, akt, wrong, ans, work: [`Aktiviti ini ialah sebahagian daripada langkah ${st + 1}: ${ans.toLowerCase()}.`] });
};
KW.perlu = (r, k) => {
  const [item, ok] = kwAt(r, KWPERLU, k, 5), ans = ok ? 'Keperluan' : 'Kehendak', N = vnama();
  return GEN_LQ('perlu', { N, item, claim: ok ? 'kehendak' : 'keperluan', ans, work: [ok ? `${vcap(item)} perlu untuk kehidupan harian, maka ia keperluan.` : `Kita masih boleh hidup tanpa ${item}, maka ia kehendak.`] });
};
KW.jangka = (r, k) => {
  const pendek = k == null ? r.f() < .5 : k % 2 === 0, N = vnama();
  let goal, amt, per, ans, work;
  if (pendek) {
    const [g, lo, hi, st] = r.p(KWBARANG), m = r.p([3, 4, 6, 8, 10, 12]);
    goal = g; amt = kwRM(kwStep(r, lo, hi, st)); per = m === 12 ? '1 tahun' : `${m} bulan`; ans = 'Jangka pendek';
    work = [`Tempoh ${per} ialah setahun atau kurang, maka ia matlamat jangka pendek.`];
  } else {
    const [g, , lo, hi] = r.p(KWPANJANG), y = r.p([6, 8, 10, 15, 20, 25]);
    goal = g; amt = kwRM(kwStep(r, lo, hi, 10000)); per = `${y} tahun`; ans = 'Jangka panjang';
    work = [`Tempoh ${per} lebih daripada 5 tahun dan jumlah wang besar, maka ia matlamat jangka panjang.`];
  }
  return GEN_LQ('jangka', { N, goal, amt, per, ans, work });
};
KW.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
KW.smartKurang = (r, k) => {
  const miss = k == null ? r.p(['S', 'M', 'T']) : ['S', 'M', 'T'][k % 3], N = vnama();
  const [g, lo, hi, st] = r.p(KWBARANG), m = r.p([6, 8, 10, 12, 18, 24]);
  const amt = kwRM(kwStep(r, lo, hi, st)), per = `${m} bulan`;
  const stTxt = miss === 'S' ? `Saya mahu menyimpan ${amt} dalam tempoh ${per}.` : miss === 'M' ? `Saya mahu menyimpan wang untuk ${g} dalam tempoh ${per}.` : `Saya mahu menyimpan ${amt} untuk ${g}.`;
  const why = { S: 'Matlamat tidak menyatakan untuk apa wang itu disimpan.', M: 'Matlamat tidak menyatakan jumlah wang, jadi kemajuan tidak boleh diukur.', T: 'Matlamat tidak menyatakan tempoh atau tarikh akhir.' }[miss];
  return GEN_LQ('smartKurang', { N, st: stTxt, ans: KWSMART[miss], work: [why] });
};
KW.realistik = r => {
  const g = kwStep(r, 1200, 4500, 100), pc = r.p([5, 8, 10, 12, 15, 20]), m = r.p([6, 8, 10, 12, 18, 24]), s = g * pc / 100, goal = s * m;
  const item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('realistik', { N, g, goal, item, m, ans: `${kwRM(s)} sebulan, iaitu ${pc}% daripada gaji bersih`, work: [`Simpanan bulanan = ${kwN(goal)} ÷ ${m} = ${kwRM(s)}`, `Peratus = ${kwN(s)} ÷ ${kwN(g)} × 100% = ${pc}%`, 'Panduan: simpanan sekitar 10% daripada pendapatan dianggap munasabah.'] });
};
KW.susun = r => {
  const perm = kwShuf(r, [0, 1, 2, 3, 4]), N = vnama();
  const list = perm.map((st, i) => `${KWHURUF[i]}: ${KWLANGKAH[st].toLowerCase()}`).join('; ');
  const order = [0, 1, 2, 3, 4].map(st => KWHURUF[perm.indexOf(st)]);
  return GEN_LQ('susun', { N, list, ans: order.join(' → '), work: KWLANGKAH.map((t, i) => `${i + 1}. ${t} (${KWHURUF[perm.indexOf(i)]})`) });
};
KW.k111 = r => {
  // (1) dua matlamat
  const [g1, lo, hi, st] = r.p(KWBARANG), m1 = r.p([6, 8, 10, 12]), s1 = kwStep(r, Math.ceil(lo / m1 / 10) * 10, Math.max(Math.ceil(lo / m1 / 10) * 10, Math.floor(hi / m1 / 10) * 10), 10);
  const g2 = r.p(KWPANJANG)[1], y2 = r.p([6, 8, 10]), s2 = r.p([100, 150, 200, 250]), gg = kwStep(r, 2500, 5000, 100);
  const a = { N: vnama(), g: gg, g1, c1: s1 * m1, m1, s1, g2, c2: s2 * 12 * y2, y2, s2 };
  // (2) wang pendahuluan
  const g = r.p([2000, 2400, 3000, 3600, 4000, 5000]), [Y2, y] = r.p([[10, 5], [8, 4], [6, 4], [10, 4], [8, 5], [6, 5]]);
  const D = g / 10 * 12 * Y2, s = D / (12 * y);
  const b = { N: vnama(), D, g, y, Y2, s, pc: kwR2(s / g * 100), what: r.p(['wang pendahuluan rumah', 'modal perniagaan', 'dana pengajian']) };
  // (3) tulis semula SMART
  const [goal, cost, m] = r.p([['melancong ke Sabah', 2400, 12], ['membeli komputer riba', 3000, 10], ['membeli basikal baharu', 900, 6], ['membeli mesin jahit', 1440, 8], ['membeli telefon pintar', 1800, 9]]);
  const c = { N: vnama(), goal, cost, m };
  return GEN_LQ('k111', { a, b, c });
};

/* ---------- 10.1.2 ---------- */
KW.jenisPend = (r, k) => {
  const [item, akt] = kwAt(r, KWPEND, k, 5), ans = akt ? 'Pendapatan aktif' : 'Pendapatan pasif', N = vnama();
  const why = 'Tanya: adakah wang itu diperoleh dengan bekerja (aktif) atau tanpa bekerja secara aktif (pasif)?';
  return GEN_LQ('jenisPend', { N, item, ans, why, claim: akt ? 'Pendapatan pasif' : 'Pendapatan aktif', work: [akt ? `${vcap(item)} diperoleh dengan bekerja, maka ia pendapatan aktif.` : `${vcap(item)} diperoleh tanpa bekerja secara aktif, maka ia pendapatan pasif.`] });
};
KW.jenisBel = (r, k) => {
  const [item, tetap] = kwAt(r, KWBEL, k, 5), ans = tetap ? 'Perbelanjaan tetap' : 'Perbelanjaan tidak tetap', N = vnama();
  const why = 'Tanya: adakah jumlahnya sama setiap bulan (tetap) atau berubah-ubah (tidak tetap)?';
  return GEN_LQ('jenisBel', { N, item, ans, why, claim: tetap ? 'Perbelanjaan tidak tetap' : 'Perbelanjaan tetap', work: [tetap ? `Perbelanjaan untuk ${item} adalah sama setiap bulan, maka ia perbelanjaan tetap.` : `Perbelanjaan untuk ${item} berubah-ubah setiap bulan, maka ia perbelanjaan tidak tetap.`] });
};
KW.aliranJum = r => {
  let I, E; do { I = kwStep(r, 1500, 8000, 100); E = I + kwStep(r, -1200, 800, 50); } while (E <= 0 || E === I);
  const CF = I - E, N = vnama(), mo = r.p(['Januari', 'Mac', 'Mei', 'Julai', 'Oktober', 'Disember']);
  return GEN_LQ('aliranJum', { N, I, E, mo, ans: `${kwRM(CF)} (${kwCF(CF)})`, work: ['Aliran tunai = jumlah pendapatan − jumlah perbelanjaan', `= ${kwN(I)} − ${kwN(E)} = ${kwRM(CF)}`, CF > 0 ? 'Pendapatan melebihi perbelanjaan, maka aliran tunai positif.' : 'Perbelanjaan melebihi pendapatan, maka aliran tunai negatif.'] });
};
KW.jumPend = r => {
  const N = vnama(), akt = kwShuf(r, KWPEND.filter(x => x[1])).slice(0, 2), pas = kwShuf(r, KWPEND.filter(x => !x[1])).slice(0, r.i(1, 2));
  const va = akt.map((_, i) => i === 0 ? kwStep(r, 1800, 5000, 100) : kwStep(r, 100, 900, 50)), vp = pas.map(() => kwStep(r, 50, 1200, 50));
  const rows = akt.map((x, i) => [vcap(x[0]), kwRM(va[i]), 'gr']).concat(pas.map((x, i) => [vcap(x[0]), kwRM(vp[i]), 'tr']));
  const mode = r.p([0, 0, 1, 2]), all = va.concat(vp);
  let ans, work, pasOnly = false;
  if (mode === 0) { ans = kwRM(kwSum(all)); work = [`Jumlah pendapatan = ${all.map(kwN).join(' + ')} = ${ans}`]; }
  else if (mode === 1) { pasOnly = true; ans = kwRM(kwSum(vp)); work = [`Pendapatan pasif: ${pas.map(x => x[0]).join(', ')}.`, `Jumlah = ${vp.map(kwN).join(' + ')} = ${ans}`]; }
  else { ans = kwRM(kwSum(va)); work = [`Pendapatan aktif: ${akt.map(x => x[0]).join(', ')}.`, `Jumlah = ${va.map(kwN).join(' + ')} = ${ans}`]; }
  const v = mode === 0 ? vq('jumPend', { N }) : vq('jumJenis', { N, jenis: pasOnly ? 'pasif' : 'aktif' });
  return { q: v.q, ans, work, fig: kwKad(`Pendapatan bulanan ${N}`, rows, 'gr') };
};
// penyata pendapatan & perbelanjaan rawak
function kwPenyata(r, opt = {}) {
  const inc = [['gaji bersih', kwStep(r, 2500, 5000, 100)]];
  if (r.f() < .6) inc.push([r.p(KWPEND.filter(x => !x[1]))[0], kwStep(r, 100, 800, 50)]);
  const fix = kwShuf(r, KWBEL.filter(x => x[1])).slice(0, 2).map(x => [x[0], kwStep(r, 150, 1200, 50)]);
  const vr_ = kwShuf(r, KWBEL.filter(x => !x[1])).slice(0, 3).map(x => [x[0], kwStep(r, 150, 1200, 10)]);
  return { inc, fix, vr: vr_, I: kwSum(inc.map(x => x[1])), F: kwSum(fix.map(x => x[1])), V: kwSum(vr_.map(x => x[1])) };
}
KW.aliranSenarai = r => {
  let p; do { p = kwPenyata(r); } while (p.I === p.F + p.V);
  const N = vnama(), CF = p.I - p.F - p.V, all = p.fix.concat(p.vr);
  const rows = p.inc.map(([a, b]) => [vcap(a), kwRM(b), 'gr']).concat([['—']]).concat(all.map(([a, b]) => [vcap(a), kwRM(b), 'pk']));
  return GEN_LQ('aliranSenarai', { N, ans: `${kwRM(CF)} (${kwCF(CF)})`, work: [p.inc.length > 1 ? `Jumlah pendapatan = ${p.inc.map(x => kwN(x[1])).join(' + ')} = ${kwRM(p.I)}` : `Jumlah pendapatan = ${kwRM(p.I)}`, `Jumlah perbelanjaan = ${all.map(x => kwN(x[1])).join(' + ')} = ${kwRM(p.F + p.V)}`, `Aliran tunai = ${kwN(p.I)} − ${kwN(p.F + p.V)} = ${kwRM(CF)}`] }, { fig: kwKad(`Penyata bulanan ${N}`, rows, 'gr') });
};
KW.kelasJumlah = r => {
  const N = vnama(), fix = kwShuf(r, KWBEL.filter(x => x[1])).slice(0, r.i(2, 3)).map(x => [x[0], kwStep(r, 150, 1200, 50)]);
  const vr_ = kwShuf(r, KWBEL.filter(x => !x[1])).slice(0, r.i(2, 3)).map(x => [x[0], kwStep(r, 60, 800, 10)]);
  const all = kwShuf(r, fix.concat(vr_)), F = kwSum(fix.map(x => x[1])), V = kwSum(vr_.map(x => x[1]));
  return GEN_LQ('kelasJumlah', { N, ans: `Tetap: ${kwRM(F)}; tidak tetap: ${kwRM(V)}`, work: [`Tetap: ${fix.map(x => x[0]).join(', ')} → ${fix.map(x => kwN(x[1])).join(' + ')} = ${kwRM(F)}`, `Tidak tetap: ${vr_.map(x => x[0]).join(', ')} → ${vr_.map(x => kwN(x[1])).join(' + ')} = ${kwRM(V)}`] }, { fig: kwKad(`Perbelanjaan bulanan ${N}`, all.map(([a, b]) => [vcap(a), kwRM(b), 'pk']), 'pk') });
};
KW.pelan = r => {
  let g, p, dk, tf, tv, L;
  do { g = kwStep(r, 2500, 7000, 100); p = kwStep(r, 100, 800, 100); dk = r.p([100, 150, 200, 250, 300]); tf = kwStep(r, 800, 2500, 50); tv = kwStep(r, 600, 2200, 50); L = g + p - (g + p) / 10 - dk - tf - tv; } while (L === 0 || L < -600 || L > 1500);
  const I = g + p, sv = I / 10, N = vnama(), lab = L > 0 ? 'Lebihan pendapatan' : 'Kurangan pendapatan';
  const fig = kwKad(`Pelan kewangan ${N}`, [['Gaji bersih', kwRM(g), 'gr'], ['Pendapatan pasif', kwRM(p), 'gr'], ['—'], ['Simpanan tetap (10%)', '?', 'tr'], ['Dana kecemasan', kwRM(dk), 'tr'], ['Perbelanjaan tetap', kwRM(tf), 'pu'], ['Perbelanjaan tidak tetap', kwRM(tv), 'pk'], ['—'], ['Lebihan / kurangan', '?', 'am']], 'gr');
  return GEN_LQ('pelan', { N, g, p, dk, tf, tv, ans: `${lab} ${kwRM(Math.abs(L))}`, work: [`Jumlah pendapatan = ${kwN(g)} + ${kwN(p)} = ${kwRM(I)}`, `Simpanan tetap = 10% × ${kwN(I)} = ${kwRM(sv)}`, `Baki = ${kwN(I)} − ${kwN(sv)} − ${kwN(dk)} = ${kwRM(I - sv - dk)}`, `${kwN(I - sv - dk)} − ${kwN(tf)} − ${kwN(tv)} = ${kwRM(L)}`, L > 0 ? 'Nilai positif: lebihan pendapatan.' : 'Nilai negatif: kurangan pendapatan (defisit).'] }, { fig });
};
KW.cariX = r => {
  const p = kwPenyata(r), N = vnama(), all = p.fix.concat(p.vr), xi = r.i(0, all.length - 1), x = all[xi][0], xv = all[xi][1];
  let CF = p.I - p.F - p.V;
  if (CF <= 0) { p.inc[0][1] += Math.ceil((-CF + 100) / 100) * 100; p.I = kwSum(p.inc.map(v => v[1])); CF = p.I - p.F - p.V; }
  const others = all.filter((_, i) => i !== xi), known = others.map(([a, b]) => `${a} ${kwRM(b)}`).join(', ');
  const rows = p.inc.map(([a, b]) => [vcap(a), kwRM(b), 'gr']).concat([['—']]).concat(all.map(([a, b], i) => [vcap(a), i === xi ? '?' : kwRM(b), 'pk'])).concat([['—'], ['Aliran tunai', kwRM(CF), 'am']]);
  return GEN_LQ('cariX', { N, I: p.I, known, x, CF, ans: kwRM(xv), work: [`Jumlah perbelanjaan = ${kwN(p.I)} − ${kwN(CF)} = ${kwRM(p.I - CF)}`, `Perbelanjaan lain = ${others.map(v => kwN(v[1])).join(' + ')} = ${kwRM(kwSum(others.map(v => v[1])))}`, `${vcap(x)} = ${kwN(p.I - CF)} − ${kwN(kwSum(others.map(v => v[1])))} = ${kwRM(xv)}`] }, { fig: kwKad(`Penyata bulanan ${N}`, rows, 'gr') });
};
KW.k112 = r => {
  // (1) pelan penuh
  let a; do {
    const g = kwStep(r, 2500, 6000, 100), p = kwStep(r, 200, 800, 100), I = g + p, sv = I / 10, tf = kwStep(r, 800, 2200, 50), tv = kwStep(r, 600, 2000, 50), L = I - sv - tf - tv;
    const T = r.p([1200, 1800, 2400, 3000, 3600, 6000]);
    a = { N: vnama(), g, p, I, sv, tf, tv, L, neg: L < 0, T, mo: L > 0 ? Math.ceil(T / L - 1e-9) : 0 };
  } while (a.L === 0 || a.L < -800 || (a.L > 0 && (a.T % a.L !== 0 || a.mo > 36 || a.mo < 2)));
  // (2) dua bulan
  let b; do { const I = kwStep(r, 2500, 6000, 100), E1 = I - kwStep(r, 100, 600, 50), d = kwStep(r, 150, 900, 50); b = { N: vnama(), I, E1, d }; } while (b.I - b.E1 - b.d === 0);
  // (3) pelajar
  let c; do {
    const ws = kwStep(r, 100, 300, 10), up = kwStep(r, 100, 400, 10), mk = kwStep(r, 80, 250, 10), tb = kwStep(r, 20, 80, 10), hb = kwStep(r, 20, 120, 20);
    c = { N: vnama(), ws, up, mk, tb, hb, I: ws + up, E: mk + tb + hb }; c.CF = c.I - c.E; c.sv = c.I / 10;
  } while (c.CF <= 0 || c.I % 10 !== 0 || c.CF + c.hb / 2 - c.sv <= 0);
  return GEN_LQ('k112', { a, b, c });
};

/* ---------- 10.1.3 ---------- */
KW.simpBulan = r => {
  const m = r.p([4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), s = kwStep(r, 50, 600, 10), goal = s * m, item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('simpBulan', { N, goal, item, m, ans: kwRM(s), work: ['Simpanan bulanan = nilai matlamat ÷ bilangan bulan', `= ${kwN(goal)} ÷ ${m} = ${kwRM(s)}`] });
};
KW.simpTahun = r => {
  const y = r.p([2, 3, 4, 5, 6, 8, 10]), s = kwStep(r, 100, 800, 25), goal = s * 12 * y, item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('simpTahun', { N, goal, item, y, ans: kwRM(s), work: [`Tempoh = ${y} × 12 = ${y * 12} bulan`, `Simpanan bulanan = ${kwN(goal)} ÷ ${y * 12} = ${kwRM(s)}`] });
};
KW.tempoh = r => {
  const s = kwStep(r, 50, 500, 25), m = r.i(3, 30), goal = s * m, item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('tempoh', { N, goal, s, item, ans: `${m} bulan`, work: ['Tempoh = nilai matlamat ÷ simpanan bulanan', `= ${kwN(goal)} ÷ ${kwN(s)} = ${m} bulan`] });
};
KW.bolehMudah = (r, k) => {
  const ok = k == null ? r.f() < .5 : k % 2 === 0, L = kwStep(r, 150, 1200, 50);
  let need; do { need = ok ? kwStep(r, 50, L, 10) : kwStep(r, L + 10, L + 400, 10); } while (need <= 0);
  const N = vnama();
  return GEN_LQ('bolehMudah', { N, need, L, ans: ok ? 'Boleh dilaksanakan' : 'Tidak boleh dilaksanakan', work: [`Simpanan perlu = ${kwRM(need)}; lebihan = ${kwRM(L)}`, ok ? `${kwRM(need)} ≤ ${kwRM(L)}, maka pelan boleh dilaksanakan.` : `${kwRM(need)} > ${kwRM(L)}, maka pelan tidak boleh dilaksanakan (kurang ${kwRM(need - L)} sebulan).`] });
};
KW.tempohAtas = r => {
  let s, goal; do { s = kwStep(r, 120, 600, 20); goal = kwStep(r, 1000, 9000, 100); } while (goal % s === 0 || goal / s > 40 || goal / s < 3);
  const m = Math.ceil(goal / s), lo = m - 1, item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('tempohAtas', { N, goal, s, item, lo, ans: `${m} bulan`, work: [`Tempoh = ${kwN(goal)} ÷ ${kwN(s)} = ${kwD2(goal / s)} bulan`, `Selepas ${lo} bulan: ${kwRM(s * lo)} (belum cukup); selepas ${m} bulan: ${kwRM(s * m)} ✓`, `Bundarkan ke atas: ${m} bulan`] });
};
KW.nilai = (r, k) => {
  const ok = k == null ? r.f() < .5 : k % 2 === 0, y = r.p([1, 2, 3, 4, 5]), need = kwStep(r, 100, 800, 25), goal = need * 12 * y;
  let L; do { L = ok ? kwStep(r, need, need + 400, 50) : kwStep(r, Math.max(50, need - 300), need - 25, 25); } while (L <= 0 || (ok ? L < need : L >= need));
  const item = kwItemFor(r, goal), N = vnama();
  return GEN_LQ('nilai', { N, goal, item, y, L, ans: ok ? `Boleh dilaksanakan; simpanan perlu ${kwRM(need)} ≤ lebihan ${kwRM(L)}` : `Tidak boleh dilaksanakan; kurang ${kwRM(need - L)} sebulan`, work: [`Tempoh = ${y} × 12 = ${y * 12} bulan`, `Simpanan perlu = ${kwN(goal)} ÷ ${y * 12} = ${kwRM(need)}`, ok ? `${kwRM(need)} ≤ ${kwRM(L)} → boleh dilaksanakan.` : `${kwRM(need)} > ${kwRM(L)} → tidak boleh; kekurangan = ${kwN(need)} − ${kwN(L)} = ${kwRM(need - L)} sebulan.`] });
};
KW.ubahTempoh = r => {
  let goal, m, L; do { L = kwStep(r, 150, 700, 50); m = r.p([6, 8, 10, 12, 15, 18, 24]); goal = kwStep(r, 1200, 12000, 100); } while (goal / m <= L || goal / L > 48 || goal % m !== 0);
  const mo = Math.ceil(goal / L - 1e-9), N = vnama();
  return GEN_LQ('ubahTempoh', { N, goal, m, L, ans: `${mo} bulan`, work: [`Simpanan perlu dalam ${m} bulan = ${kwN(goal)} ÷ ${m} = ${kwRM(goal / m)} > ${kwRM(L)}`, `Tempoh baharu = ${kwN(goal)} ÷ ${kwN(L)} = ${kwD2(goal / L)} bulan`].concat(goal % L ? [`Bundarkan ke atas: ${mo} bulan`] : []) });
};
KW.kurangBelanja = r => {
  let goal, m, L; do { m = r.p([6, 8, 10, 12, 15, 18, 24]); const need = kwStep(r, 150, 900, 10); goal = need * m; L = kwStep(r, 100, need - 10, 10); } while (goal / m - L < 20);
  const need = goal / m, N = vnama();
  return GEN_LQ('kurangBelanja', { N, goal, m, L, ans: kwRM(need - L), work: [`Simpanan perlu = ${kwN(goal)} ÷ ${m} = ${kwRM(need)}`, `Kekurangan = ${kwN(need)} − ${kwN(L)} = ${kwRM(need - L)} sebulan`, 'Perbelanjaan perlu dikurangkan (atau pendapatan ditambah) sebanyak nilai ini.'] });
};
KW.k113 = r => {
  let a; do {
    const I = kwStep(r, 2500, 6000, 100), tf = kwStep(r, 700, 2000, 50), tv = kwStep(r, 600, 2000, 50), L = I - tf - tv, y = r.p([1, 2, 3]), need = kwStep(r, 100, 700, 25);
    a = { N: vnama(), I, tf, tv, L, y, need, goal: need * 12 * y }; a.item = kwItemFor(r, a.goal);
    a.ok = a.need <= a.L; a.mo = a.L > 0 ? Math.ceil(a.goal / a.L - 1e-9) : 0;
  } while (a.L <= 50 || a.L === a.need || (!a.ok && a.mo > 60));
  let b; do { const L = kwStep(r, 200, 800, 50), x = kwStep(r, 50, 300, 50), m1 = r.i(8, 30); b = { N: vnama(), L, x, m1, goal: L * m1 }; b.m2 = b.goal / (L + x); } while (!Number.isInteger(b.m2) || b.m1 === b.m2);
  let c; do { const m = r.p([6, 8, 10, 12]), need = kwStep(r, 100, 600, 10), S0 = kwStep(r, 200, 3000, 100), L = kwStep(r, 100, 700, 50); c = { N: vnama(), m, need, S0, goal: S0 + need * m, L }; c.item = kwItemFor(r, c.goal); c.ok = c.need <= c.L; } while (c.need === c.L);
  return GEN_LQ('k113', { a, b, c });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '10.1.1': {
    m: [() => KW.langkahNo(kwRG), () => KW.langkahAkt(kwRG), () => KW.perlu(kwRG), () => KW.jangka(kwRG), () => KW.bs(kwRG, KWBS1)],
    s: [() => KW.smartKurang(kwRG), () => KW.realistik(kwRG), () => KW.susun(kwRG)],
    k: [() => KW.k111(kwRG)]
  },
  '10.1.2': {
    m: [() => KW.jenisPend(kwRG), () => KW.jenisBel(kwRG), () => KW.aliranJum(kwRG), () => KW.jumPend(kwRG), () => KW.bs(kwRG, KWBS2)],
    s: [() => KW.aliranSenarai(kwRG), () => KW.kelasJumlah(kwRG), () => KW.pelan(kwRG), () => KW.cariX(kwRG)],
    k: [() => KW.k112(kwRG)]
  },
  '10.1.3': {
    m: [() => KW.simpBulan(kwRG), () => KW.simpTahun(kwRG), () => KW.tempoh(kwRG), () => KW.bolehMudah(kwRG), () => KW.bs(kwRG, KWBS3)],
    s: [() => KW.tempohAtas(kwRG), () => KW.nilai(kwRG), () => KW.ubahTempoh(kwRG), () => KW.kurangBelanja(kwRG)],
    k: [() => KW.k113(kwRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 10.1.1
WG.langkahNo = i => KW.langkahNo(kwRW, i * 2);
WG.langkahAkt = i => KW.langkahAkt(kwRW, i);
WG.perlu = i => KW.perlu(kwRW, i);
WG.jangka = i => KW.jangka(kwRW, i);
WG.bs1 = i => KW.bs(kwRW, KWBS1, [0, 3, 5][i % 3] + wri(0, 1));
WG.smartKurang = i => KW.smartKurang(kwRW, i);
WG.realistik = () => KW.realistik(kwRW);
WG.susun = () => KW.susun(kwRW);
WG.k111 = () => KW.k111(kwRW);
// 10.1.2
WG.jenisPend = i => KW.jenisPend(kwRW, i);
WG.jenisBel = i => KW.jenisBel(kwRW, i);
WG.aliranJum = () => KW.aliranJum(kwRW);
WG.jumPend = () => KW.jumPend(kwRW);
WG.bs2 = i => KW.bs(kwRW, KWBS2, [1, 3, 5][i % 3] + wri(0, 1) * 2);
WG.aliranSenarai = () => KW.aliranSenarai(kwRW);
WG.kelasJumlah = () => KW.kelasJumlah(kwRW);
WG.pelan = () => KW.pelan(kwRW);
WG.cariX = () => KW.cariX(kwRW);
WG.k112 = () => KW.k112(kwRW);
// 10.1.3
WG.simpBulan = () => KW.simpBulan(kwRW);
WG.simpTahun = () => KW.simpTahun(kwRW);
WG.tempoh = () => KW.tempoh(kwRW);
WG.bolehMudah = i => KW.bolehMudah(kwRW, i);
WG.bs3 = i => KW.bs(kwRW, KWBS3, [1, 4, 6][i % 3] + wri(0, 1));
WG.tempohAtas = () => KW.tempohAtas(kwRW);
WG.nilai = i => KW.nilai(kwRW, i);
WG.ubahTempoh = () => KW.ubahTempoh(kwRW);
WG.kurangBelanja = () => KW.kurangBelanja(kwRW);
WG.k113 = () => KW.k113(kwRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '10.1.1': [['m', 'langkahNo', 3], ['m', 'langkahAkt', 5], ['m', 'perlu', 4], ['m', 'jangka', 4], ['m', 'bs1', 2], ['s', 'smartKurang', 3], ['s', 'realistik', 3], ['s', 'susun', 3], ['k', 'k111', 3]],
  '10.1.2': [['m', 'jenisPend', 4], ['m', 'jenisBel', 4], ['m', 'aliranJum', 5], ['m', 'jumPend', 3], ['m', 'bs2', 2], ['s', 'aliranSenarai', 3], ['s', 'kelasJumlah', 2], ['s', 'pelan', 2], ['s', 'cariX', 2], ['k', 'k112', 3]],
  '10.1.3': [['m', 'simpBulan', 5], ['m', 'simpTahun', 4], ['m', 'tempoh', 4], ['m', 'bolehMudah', 3], ['m', 'bs3', 2], ['s', 'tempohAtas', 3], ['s', 'nilai', 2], ['s', 'ubahTempoh', 2], ['s', 'kurangBelanja', 2], ['k', 'k113', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
function kwOptsT(ans, cands) {
  const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
// pilihan nilai wang / bilangan: f = format; step = langkah isian jika calon tidak cukup
function kwOptsN(ans, cands, f, step = 10, pos = true) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!isFinite(c) || (pos && c <= 0)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step; if (pos && v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
const kwMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const kwBln = v => `${v} bulan`;
const KWKAT = ['Pendapatan aktif', 'Pendapatan pasif', 'Perbelanjaan tetap', 'Perbelanjaan tidak tetap'];
const CQGEN = {
  proses: [
    () => { const n = ri(1, 5); return kwMcq(Math.random() < .5 ? `Apakah langkah ke-${n} dalam proses pengurusan kewangan?` : `Langkah manakah datang selepas "${KWLANGKAH[(n + 3) % 5]}"?`, kwIkon('kitaran'), kwOptsT(KWLANGKAH[n - 1], KWLANGKAH)); },
    () => { const [akt, st] = pick(KWAKT); return kwMcq(`Seorang pekerja ${akt}. Ini ialah langkah …`, kwIkon('kitaran'), kwOptsT(KWLANGKAH[st], KWLANGKAH)); },
    () => {
      if (Math.random() < .5) { const d = KW.smartKurang(kwRG); return kwMcq(d.q, kwIkon('smart'), kwOptsT(d.ans, ['Spesifik (S)', 'Boleh diukur (M)', 'Tempoh masa (T)', 'Realistik (R)'])); }
      const d = KW.jangka(kwRG); return kwMcq(d.q, kwIkon('smart'), kwOptsT(d.ans, ['Jangka pendek', 'Jangka panjang', 'Bukan matlamat kewangan', 'Keperluan harian']));
    }
  ],
  jenis: [
    () => { const all = KWPEND.map(([t, a]) => [t, a ? 0 : 1]).concat(KWBEL.map(([t, a]) => [t, a ? 2 : 3])), [t, k] = pick(all.filter(x => x[0] !== 'sewa rumah')); return kwMcq(`"${vcap(t)}" ialah …`, kwIkon('aliran'), kwOptsT(KWKAT[k], KWKAT)); },
    () => { const per = shuffle(KWPERLU.filter(x => x[1])).slice(0, 3).map(x => x[0]), keh = pick(KWPERLU.filter(x => !x[1]))[0], opts = shuffle([keh, ...per]); return { type: 'mcq', q: 'Antara berikut, yang manakah satu <b>kehendak</b>?', fig: kwIkon('tabung'), opts: opts.map(vcap), c: opts.indexOf(keh) }; },
    () => {
      if (Math.random() < .5) { const a = shuffle(KWPEND.filter(x => x[1])).slice(0, 3).map(x => x[0]), p = pick(KWPEND.filter(x => !x[1]))[0], opts = shuffle([p, ...a]); return { type: 'mcq', q: 'Yang manakah <b>pendapatan pasif</b>?', fig: kwIkon('aliran'), opts: opts.map(vcap), c: opts.indexOf(p) }; }
      const a = shuffle(KWBEL.filter(x => !x[1])).slice(0, 3).map(x => x[0]), p = pick(KWBEL.filter(x => x[1]))[0], opts = shuffle([p, ...a]); return { type: 'mcq', q: 'Yang manakah <b>perbelanjaan tetap</b>?', fig: kwIkon('aliran'), opts: opts.map(vcap), c: opts.indexOf(p) };
    }
  ],
  aliran: [
    () => { let I, E; do { I = ri(15, 60) * 100; E = I + ri(-20, 10) * 50; } while (E === I || E <= 0); return kwMcq(`Pendapatan ${kwRM(I)}, perbelanjaan ${kwRM(E)}. Berapakah aliran tunai?`, kwIkon('aliran'), kwOptsN(I - E, [E - I, I + E, I - E + 100, I - E - 100], kwRM, 50, false)); },
    () => { const p = kwPenyata(kwRG), CF = p.I - p.F - p.V, rows = p.inc.map(([a, b]) => [vcap(a), kwRM(b), 'gr']).concat([['—']]).concat(p.fix.concat(p.vr).map(([a, b]) => [vcap(a), kwRM(b), 'pk'])); return kwMcq('Berdasarkan penyata, berapakah aliran tunai bulanan?', kwKad('Penyata bulanan', rows, 'gr'), kwOptsN(CF, [-CF, p.I - p.F, p.I - p.V, CF + p.fix[0][1]], kwRM, 50, false)); },
    () => {
      let g, tf, tv, L; do { g = ri(25, 60) * 100; tf = ri(16, 40) * 50; tv = ri(12, 40) * 50; L = g - g / 10 - tf - tv; } while (L === 0 || Math.abs(L) > 1500);
      return kwMcq(`Gaji bersih ${kwRM(g)}. Simpan 10%, perbelanjaan tetap ${kwRM(tf)}, tidak tetap ${kwRM(tv)}. Berapakah lebihan (atau kurangan)?`, kwIkon('tabung'), kwOptsN(L, [g - tf - tv, L - g / 10, L + g / 10 + 100, -L], kwRM, 50, false));
    }
  ],
  matlamat: [
    () => { const m = pick([4, 5, 6, 8, 10, 12]), s = ri(5, 40) * 10, goal = s * m; return kwMcq(`Matlamat ${kwRM(goal)} dalam ${m} bulan. Simpanan bulanan?`, kwBalang(kwRM(goal), `${m} bulan`, .3), kwOptsN(s, [goal * m, s * 2, s + 50, goal / (m + 2)].map(v => Math.round(v)), kwRM, 10)); },
    () => {
      if (Math.random() < .5) { const y = pick([2, 3, 4, 5]), s = ri(4, 30) * 25, goal = s * 12 * y; return kwMcq(`Matlamat ${kwRM(goal)} dalam ${y} tahun. Simpanan bulanan?`, kwBalang(kwRM(goal), `${y} tahun`, .5), kwOptsN(s, [goal / y, s * 2, goal / (12 * y + 12), s + 25], kwRM, 25)); }
      const s = ri(2, 20) * 25, m = ri(4, 24), goal = s * m; return kwMcq(`Simpan ${kwRM(s)} sebulan untuk ${kwRM(goal)}. Berapa bulan?`, kwBalang(kwRM(goal), `${kwRM(s)} sebulan`, .6), kwOptsN(m, [m + 1, m - 1, m * 2, m + 12], kwBln, 1));
    },
    () => {
      if (Math.random() < .5) { let s, goal; do { s = ri(6, 30) * 20; goal = ri(10, 90) * 100; } while (goal % s === 0 || goal / s > 40 || goal / s < 3); const m = Math.ceil(goal / s); return kwMcq(`Simpan ${kwRM(s)} sebulan untuk ${kwRM(goal)}. Tempoh minimum?`, kwBalang(kwRM(goal), `${kwRM(s)} sebulan`, .8), kwOptsN(m, [m - 1, m + 1, m + 2], kwBln, 1)); }
      const L = ri(6, 24) * 50, need = L + ri(1, 8) * 25, m = pick([6, 8, 10, 12]); return kwMcq(`Matlamat ${kwRM(need * m)} dalam ${m} bulan, lebihan ${kwRM(L)} sebulan. Berapakah kekurangan sebulan?`, kwBalang(kwRM(need * m), `${m} bulan`, .4), kwOptsN(need - L, [need, L, need + L, (need - L) * m], kwRM, 25));
    }
  ]
};
const CQT = { proses: 'Proses & SMART', jenis: 'Pendapatan & perbelanjaan', aliran: 'Aliran tunai', matlamat: 'Simpanan & tempoh' };
function kwCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.proses;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['proses', 'jenis', 'aliran', 'aliran', 'matlamat'] : Object.keys(CQT);
  return kwCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return kwCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
