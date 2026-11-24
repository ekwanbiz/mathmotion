'use strict';
/* =================== PERCUKAIAN · SOALAN BAB 4 (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Semua nama global berawalan "ck" / "CK".

/* =================== pembantu =================== */
const ckRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const ckRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const ckR2 = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? 0 : r; };
const ckN = v => { const r = ckR2(v), s = Number.isInteger(r) ? String(r) : r.toFixed(2); const [a, b] = s.split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + (b ? '.' + b : ''); };
const ckRM = v => 'RM' + ckN(v);
const CKNAMA = ['Encik Kamal', 'Puan Lina', 'Encik Ravi', 'Cik Mei Ling', 'Puan Aisyah', 'Encik Daniel', 'Cik Nurul', 'Encik Ah Kow', 'Puan Devi', 'Encik Faiz'];
// kadar cukai pendapatan (jadual buku teks): [bawah, atas, kadar %, cukai terkumpul pada bawah]
const CKBAND = [[0, 5000, 0, 0], [5000, 20000, 1, 0], [20000, 35000, 3, 150], [35000, 50000, 8, 600], [50000, 70000, 14, 1800], [70000, 100000, 21, 4600]];
const ckBand = ci => CKBAND.find(b => ci <= b[1]);
const ckTax = ci => { const b = ckBand(ci); return ckR2(b[3] + (ci - b[0]) * b[2] / 100); };
const ckTaxWork = ci => {
  const b = ckBand(ci);
  if (b[2] === 0) return [`Pendapatan bercukai ${ckRM(ci)} ≤ RM5 000, kadar 0%: cukai = RM0`];
  return [`${ckRM(ci)} berada dalam julat ${ckRM(b[0] + 1)} – ${ckRM(b[1])} (kadar ${b[2]}%)`, `Cukai bagi ${ckRM(b[0])} pertama = ${ckRM(b[3])}`,
    `Baki ${ckN(ci)} − ${ckN(b[0])} = ${ckN(ci - b[0])} × ${b[2]}% = ${ckRM((ci - b[0]) * b[2] / 100)}`, `Cukai = ${ckN(b[3])} + ${ckN((ci - b[0]) * b[2] / 100)} = ${ckRM(ckTax(ci))}`];
};
// rajah jadual kadar cukai
const ckTxt = (x, y, t, c, s, a) => `<text x="${x}" y="${y}" style="fill:var(--${c || 'tx'})" font-size="${s || 15}" font-weight="700" font-family="Inter, sans-serif" text-anchor="${a || 'start'}" dominant-baseline="central">${t}</text>`;
function ckJadualFig() {
  let s = `<rect x="2" y="2" width="456" height="246" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  s += ckTxt(16, 22, 'Pendapatan bercukai (RM)', 'tr', 14) + ckTxt(250, 22, 'Kadar', 'tr', 14) + ckTxt(330, 22, 'Cukai terkumpul', 'tr', 14);
  CKBAND.forEach((b, i) => { const y = 54 + i * 32; s += `<line x1="10" y1="${y - 16}" x2="450" y2="${y - 16}" style="stroke:var(--bd)" stroke-width="1"/>` + ckTxt(16, y, `${ckN(b[0] === 0 ? 0 : b[0] + 1)} – ${ckN(b[1])}`, 'tx', 15) + ckTxt(250, y, b[2] + '%', 'am', 15) + ckTxt(330, y, `${ckN(b[1])} pertama: ${ckN(ckTax(b[1]))}`, 'mu', 13); });
  return `<svg viewBox="0 0 460 250" style="max-width:460px;width:100%" role="img" aria-label="Jadual kadar cukai pendapatan">${s}</svg>`;
}
// cukai jalan Semenanjung, kereta persendirian individu
const CKJALAN = [[0, 1000, 20, 0], [1000, 1200, 55, 0], [1200, 1400, 70, 0], [1400, 1600, 90, 0], [1600, 1800, 200, 0.4], [1800, 2000, 280, 0.5], [2000, 2500, 380, 1], [2500, 3000, 880, 2.5]];
const ckJ = cc => CKJALAN.find(b => cc <= b[1]);
const ckJalan = cc => { const b = ckJ(cc); return ckR2(b[2] + (b[3] ? (cc - b[0]) * b[3] : 0)); };
function ckJalanFig() {
  let s = `<rect x="2" y="2" width="456" height="290" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  s += ckTxt(16, 22, 'Kapasiti enjin (cc)', 'pk', 14) + ckTxt(180, 22, 'Kadar asas', 'pk', 14) + ckTxt(285, 22, 'Kadar progresif', 'pk', 14);
  CKJALAN.forEach((b, i) => { const y = 52 + i * 30; s += `<line x1="10" y1="${y - 15}" x2="450" y2="${y - 15}" style="stroke:var(--bd)" stroke-width="1"/>` + ckTxt(16, y, b[0] === 0 ? '≤ 1 000' : `${ckN(b[0] + 1)} – ${ckN(b[1])}`, 'tx', 15) + ckTxt(180, y, ckRM(b[2]), 'am', 15) + ckTxt(285, y, b[3] ? `+${ckRM(b[3])} / cc > ${ckN(b[0])}` : '–', 'mu', 13); });
  return `<svg viewBox="0 0 460 294" style="max-width:460px;width:100%" role="img" aria-label="Jadual kadar cukai jalan">${s}</svg>`;
}
const ckJWork = cc => { const b = ckJ(cc); return b[3] ? [`${ckN(cc)} cc berada dalam julat ${ckN(b[0] + 1)} – ${ckN(b[1])} cc: kadar asas ${ckRM(b[2])}`, `Lebihan = ${ckN(cc)} − ${ckN(b[0])} = ${cc - b[0]} cc × ${ckRM(b[3])} = ${ckRM((cc - b[0]) * b[3])}`, `Cukai jalan = ${ckN(b[2])} + ${ckN((cc - b[0]) * b[3])} = ${ckRM(ckJalan(cc))}`] : [`${ckN(cc)} cc berada dalam julat ${b[0] === 0 ? '≤ 1 000' : ckN(b[0] + 1) + ' – ' + ckN(b[1])} cc`, `Cukai jalan = kadar asas = ${ckRM(b[2])}`]; };

/* ---------- 4.1.1 data ---------- */
const CKAG = [
  ['cukai pendapatan', 'LHDNM', 'pendapatan tahunan seorang jurutera'],
  ['cukai jalan', 'JPJ', 'memperbaharui lesen kenderaan motosikal'],
  ['cukai pintu', 'PBT', 'rumah teres yang dimiliki di kawasan majlis perbandaran'],
  ['cukai tanah', 'Pejabat Tanah', 'sebidang tanah dusun yang dimiliki'],
  ['cukai jualan', 'JKDM', 'peti sejuk yang dibeli di kedai elektrik'],
  ['cukai perkhidmatan', 'JKDM', 'bil makan di restoran berhawa dingin'],
  ['cukai keuntungan harta tanah', 'LHDNM', 'keuntungan menjual sebuah rumah'],
  ['duti import', 'JKDM', 'kereta yang dibawa masuk dari luar negara'],
  ['cukai pelancongan', 'Kerajaan Persekutuan (melalui pengusaha hotel)', 'pelancong asing yang menginap di hotel']
];
const CKAGN = { LHDNM: 'Lembaga Hasil Dalam Negeri Malaysia (LHDNM)', JKDM: 'Jabatan Kastam Diraja Malaysia (JKDM)', JPJ: 'Jabatan Pengangkutan Jalan (JPJ)', PBT: 'Pihak Berkuasa Tempatan (PBT)', 'Pejabat Tanah': 'Pejabat Tanah dan Galian / Pejabat Tanah Daerah' };
const CKTUJ = [
  ['membina sekolah dan hospital', 'pembangunan kemudahan awam'],
  ['membayar gaji penjawat awam', 'menampung perbelanjaan mengurus negara'],
  ['menaikkan cukai ke atas rokok', 'mengawal penggunaan barang yang tidak sihat'],
  ['memberi subsidi kepada petani', 'mengagihkan semula pendapatan'],
  ['membina jalan raya dan jambatan', 'pembangunan infrastruktur'],
  ['mengenakan duti import yang tinggi ke atas barang luar', 'melindungi industri tempatan'],
  ['membiayai pasukan polis dan tentera', 'menjaga keselamatan negara']
];

/* =================== QV: cara tanya =================== */
const QV = {
  agensi: [
    d => ({ q: `Agensi manakah yang memungut ${d.cukai}?` }),
    d => ({ q: `Namakan agensi kerajaan yang bertanggungjawab mengutip ${d.cukai}.` }),
    d => ({ q: `${d.nama} perlu membayar cukai bagi ${d.sit}. Nyatakan jenis cukai itu dan agensi yang memungutnya.`, ans: `${d.cukai}; ${d.ag}` }),
    d => ({ q: `${d.nama} berkata ${d.cukai} dibayar kepada ${d.wrong}. Adakah dia betul?`, ans: `Tidak betul. ${vcap(d.cukai)} dipungut oleh ${d.ag}.` })
  ],
  jenis: [
    d => ({ q: `Nyatakan jenis cukai yang dikenakan ke atas ${d.sit}.` }),
    d => ({ q: `${d.nama} membayar cukai bagi ${d.sit}. Apakah jenis cukai itu?` }),
    d => ({ q: `Kenal pasti cukai yang terlibat dalam situasi berikut: ${d.sit}.` })
  ],
  tujuan: [
    d => ({ q: `Kerajaan menggunakan hasil cukai untuk ${d.a}. Nyatakan tujuan percukaian yang ditunjukkan.` }),
    d => ({ q: `Apakah tujuan percukaian dalam tindakan kerajaan berikut: ${d.a}?` }),
    d => ({ q: `Langkah kerajaan ${d.a} menunjukkan salah satu tujuan percukaian. Terangkan tujuan itu.` })
  ],
  setahun: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') }),
    d => ({ q: d.q.replace('Hitung', 'Berapakah') .replace(/\.$/, '?') })
  ],
  bercukai: [
    d => ({ q: `Pendapatan tahunan ${d.nama} ialah ${ckRM(d.inc)}. Dia menuntut pelepasan cukai berikut: ${d.list}. Hitung pendapatan bercukainya.` }),
    d => ({ q: `${d.nama} memperoleh ${ckRM(d.inc)} setahun. Pelepasan yang layak dituntut: ${d.list}. Cari pendapatan bercukai.` }),
    d => ({ q: `Diberi jumlah pendapatan tahunan ${ckRM(d.inc)} dan pelepasan cukai ${d.list}. Tentukan pendapatan bercukai.` }),
    d => { const N = vnama(); return Object.assign({ q: `Pendapatan tahunan ${d.nama} ialah ${ckRM(d.inc)} dengan pelepasan ${d.list}. ${N} berkata pendapatan bercukainya ialah ${ckRM(d.wrong)}. Adakah ${N} betul?` }, salah(N, ckRM(d.ci), `${N} tidak menolak semua pelepasan.`)); }
  ],
  cukai: [
    d => ({ q: `Pendapatan bercukai ${d.nama} ialah ${ckRM(d.ci)}. Berdasarkan jadual kadar cukai di bawah, hitung cukai pendapatannya (sebelum rebat).` }),
    d => ({ q: `Gunakan jadual kadar cukai di bawah. Cari cukai pendapatan bagi pendapatan bercukai ${ckRM(d.ci)}.` }),
    d => ({ q: `Berapakah cukai pendapatan (sebelum rebat) bagi pendapatan bercukai ${ckRM(d.ci)}? Gunakan jadual di bawah.` })
  ],
  rebat: [
    d => ({ q: `Pendapatan bercukai ${d.nama} ialah ${ckRM(d.ci)}. ${d.rb} Berdasarkan jadual di bawah, hitung cukai pendapatan yang perlu dibayar.` }),
    d => ({ q: `${d.nama} mempunyai pendapatan bercukai ${ckRM(d.ci)}. ${d.rb} Cari cukai pendapatan yang perlu dibayarnya. Gunakan jadual di bawah.` }),
    d => ({ q: `Diberi pendapatan bercukai ${ckRM(d.ci)}. ${d.rb} Tentukan cukai pendapatan yang perlu dibayar berdasarkan jadual di bawah.` })
  ],
  penuh: [
    d => ({ q: `Pendapatan tahunan ${d.nama} ialah ${ckRM(d.inc)}. Pelepasan: ${d.list}. ${d.rb} Hitung cukai pendapatan yang perlu dibayar. Gunakan jadual di bawah.` }),
    d => ({ q: `${d.nama} berpendapatan ${ckRM(d.inc)} setahun dan menuntut pelepasan ${d.list}. ${d.rb} Berdasarkan jadual di bawah, cari cukai pendapatan yang perlu dibayar.` }),
    d => ({ q: `Diberi pendapatan tahunan ${ckRM(d.inc)}, pelepasan ${d.list}. ${d.rb} Tentukan cukai yang perlu dibayar menggunakan jadual di bawah.` })
  ],
  pcb: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Adakah', 'Tentukan sama ada').replace(/\? /, '. ') })
  ],
  jalan: [
    d => ({ q: `Kapasiti enjin kereta ${d.nama} ialah ${ckN(d.cc)} cc (Semenanjung Malaysia, kereta persendirian). Berdasarkan jadual di bawah, hitung cukai jalan setahun.` }),
    d => ({ q: `Gunakan jadual di bawah. Cari cukai jalan bagi kereta persendirian berkapasiti ${ckN(d.cc)} cc di Semenanjung Malaysia.` }),
    d => ({ q: `${d.nama} ingin memperbaharui cukai jalan keretanya yang berkapasiti ${ckN(d.cc)} cc. Berapakah cukai jalan yang perlu dibayar? Gunakan jadual di bawah.` })
  ],
  sst: [
    d => ({ q: `${d.nama} membeli ${d.item} berharga ${ckRM(d.p)}. ${vcap(d.jen)} ${d.r}% dikenakan. Hitung jumlah bayaran.` }),
    d => ({ q: `Harga ${d.item} ialah ${ckRM(d.p)} sebelum ${d.jen} ${d.r}%. Cari jumlah yang perlu dibayar.` }),
    d => ({ q: `${vcap(d.jen)} ${d.r}% dikenakan ke atas ${d.item} berharga ${ckRM(d.p)}. Berapakah cukai dan jumlah bayaran?`, ans: `Cukai ${ckRM(d.t)}; jumlah ${ckRM(d.tot)}` })
  ],
  tanah: [
    d => ({ q: `Luas tanah milik ${d.nama} ialah ${ckN(d.L)} m². Kadar cukai tanah ialah ${d.k} sen per m². Hitung cukai tanah setahun.` }),
    d => ({ q: `Sebidang tanah seluas ${ckN(d.L)} m² dikenakan cukai tanah ${d.k} sen per m². Cari cukai tanah yang perlu dibayar.` }),
    d => ({ q: `Berapakah cukai tanah bagi tanah seluas ${ckN(d.L)} m² jika kadarnya ${d.k} sen per m²?` })
  ],
  pintu: [
    d => ({ q: `Nilai tahunan rumah ${d.nama} ialah ${ckRM(d.nt)}. Kadar cukai pintu ialah ${d.r}%. Hitung cukai pintu setahun dan bayaran bagi setiap setengah tahun.` }),
    d => ({ q: `PBT mengenakan cukai pintu ${d.r}% ke atas nilai tahunan sebuah kedai, ${ckRM(d.nt)}. Cari cukai pintu setahun dan bayaran setiap penggal (dua kali setahun).` }),
    d => ({ q: `Sebuah rumah mempunyai nilai tahunan ${ckRM(d.nt)}. Jika kadar cukai pintu ialah ${d.r}%, berapakah cukai pintu setahun dan bayaran setiap setengah tahun?` })
  ],
  gabung: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') })
  ]
};

/* =================== penjana teras =================== */
const CK = {};
CK.agensi = r => {
  const a = r.p(CKAG.filter(x => CKAGN[x[1]]));
  const wrong = r.p(Object.keys(CKAGN).filter(k => k !== a[1]));
  return GEN_LQ('agensi', { cukai: a[0], ag: CKAGN[a[1]], sit: a[2], nama: r.p(CKNAMA), wrong: CKAGN[wrong], ans: CKAGN[a[1]], work: [`${vcap(a[0])} dipungut oleh ${CKAGN[a[1]]}.`] });
};
CK.jenis = r => {
  const a = r.p(CKAG);
  return GEN_LQ('jenis', { sit: a[2], nama: r.p(CKNAMA), ans: vcap(a[0]), work: [`Situasi “${a[2]}” melibatkan ${a[0]}.`] });
};
CK.tujuan = r => {
  const a = r.p(CKTUJ);
  return GEN_LQ('tujuan', { a: a[0], ans: vcap(a[1]), work: [`Hasil cukai digunakan untuk ${a[1]}.`] });
};
// 4.1.1 sederhana: jumlah cukai setahun (pintu + tanah)
CK.setahun = r => {
  const nama = r.p(CKNAMA), h = r.i(3, 12) * 50, L = r.i(4, 20) * 25, k = r.p([20, 25, 30, 35, 40]);
  const tp = ckR2(h * 2), tt = ckR2(L * k / 100), tot = ckR2(tp + tt);
  const q = `${nama} membayar cukai pintu ${ckRM(h)} setiap setengah tahun dan cukai tanah bagi tanah seluas ${ckN(L)} m² pada kadar ${k} sen per m². Hitung jumlah cukai harta yang dibayarnya setahun.`;
  return GEN_LQ('setahun', { q, ans: ckRM(tot), work: [`Cukai pintu setahun = ${ckN(h)} × 2 = ${ckRM(tp)} (PBT)`, `Cukai tanah = ${ckN(L)} × RM${(k / 100).toFixed(2)} = ${ckRM(tt)} (Pejabat Tanah)`, `Jumlah = ${ckN(tp)} + ${ckN(tt)} = ${ckRM(tot)}`] });
};
// 4.1.1 sukar: barang berbilang cukai
CK.belanja = r => {
  const nama = r.p(CKNAMA), p1 = r.i(6, 40) * 10, p2 = r.i(4, 30) * 5, cc = r.p([998, 1197, 1298, 1496]);
  const t1 = ckR2(p1 * 0.1), t2 = ckR2(p2 * 0.06), tj = ckJalan(cc), tot = ckR2(t1 + t2 + tj);
  const q = `Dalam sebulan, ${nama} membeli televisyen berharga ${ckRM(p1)} (cukai jualan 10%), makan di restoran dengan bil ${ckRM(p2)} (cukai perkhidmatan 6%) dan memperbaharui cukai jalan kereta ${ckN(cc)} cc (${ckRM(tj)}). Hitung jumlah cukai yang dibayarnya dan nyatakan agensi yang memungut setiap cukai.`;
  return GEN_LQ('gabung', { q, ans: `${ckRM(tot)}; JKDM (cukai jualan & perkhidmatan), JPJ (cukai jalan)`, work: [`Cukai jualan = ${ckN(p1)} × 10% = ${ckRM(t1)}`, `Cukai perkhidmatan = ${ckN(p2)} × 6% = ${ckRM(t2)}`, `Cukai jalan = ${ckRM(tj)}`, `Jumlah = ${ckN(t1)} + ${ckN(t2)} + ${ckN(tj)} = ${ckRM(tot)}`] });
};
// pelepasan
const ckRelief = r => {
  const L = [['individu', 9000]];
  const opt = shuffleCK(r, [['KWSP', r.i(2, 4) * 1000], ['gaya hidup', r.p([1500, 2000, 2500])], ['insurans nyawa', r.p([1500, 2000, 3000])], ['perubatan ibu bapa', r.p([1000, 2000, 3000])], ['pendidikan', r.p([2000, 3000, 4000])], ['pasangan', 4000]]).slice(0, r.i(2, 3));
  return L.concat(opt);
};
function shuffleCK(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = r.i(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const ckList = L => L.map(x => `${x[0]} ${ckRM(x[1])}`).join(', ');
CK.bercukai = r => {
  const L = ckRelief(r), tr = L.reduce((s, x) => s + x[1], 0), inc = r.i(30, 110) * 1000 + r.p([0, 500]), ci = inc - tr;
  return GEN_LQ('bercukai', { nama: r.p(CKNAMA), inc, list: ckList(L), ci, wrong: inc - 9000 === ci ? inc : inc - 9000, ans: ckRM(ci), work: [`Jumlah pelepasan = ${L.map(x => ckN(x[1])).join(' + ')} = ${ckRM(tr)}`, `Pendapatan bercukai = ${ckN(inc)} − ${ckN(tr)} = ${ckRM(ci)}`] });
};
CK.cukai = r => {
  const ci = r.i(12, 99) * 1000 + r.p([0, 250, 500]);
  return GEN_LQ('cukai', { nama: r.p(CKNAMA), ci, ans: ckRM(ckTax(ci)), work: ckTaxWork(ci) }, { fig: ckJadualFig() });
};
const ckRebat = (r, ci) => {
  const z = r.p([0, 0, 100, 200, 300]);
  const ind = ci <= 35000 ? 400 : 0;
  const rb = `Dia layak menerima rebat individu RM400 jika pendapatan bercukai tidak melebihi RM35 000${z ? ` dan telah membayar zakat ${ckRM(z)}` : ''}.`;
  return { z, ind, rb };
};
const ckRebatWork = (t, R) => {
  const tot = R.ind + R.z, pay = Math.max(0, ckR2(t - tot));
  const w = [R.ind ? 'Pendapatan bercukai ≤ RM35 000: layak rebat individu RM400' : 'Pendapatan bercukai > RM35 000: tidak layak rebat individu'];
  if (R.z) w.push(`Rebat zakat = ${ckRM(R.z)}`);
  w.push(tot ? `Cukai perlu dibayar = ${ckN(t)} − ${ckN(tot)}${t - tot < 0 ? ' < 0, maka RM0' : ` = ${ckRM(pay)}`}` : `Cukai perlu dibayar = ${ckRM(pay)}`);
  return { pay, w };
};
CK.rebat = r => {
  const ci = r.i(18, 60) * 1000 + r.p([0, 500]), t = ckTax(ci), R = ckRebat(r, ci), o = ckRebatWork(t, R);
  return GEN_LQ('rebat', { nama: r.p(CKNAMA), ci, rb: R.rb, ans: ckRM(o.pay), work: ckTaxWork(ci).concat(o.w) }, { fig: ckJadualFig() });
};
CK.penuh = r => {
  const L = ckRelief(r), tr = L.reduce((s, x) => s + x[1], 0), inc = r.i(36, 100) * 1000, ci = inc - tr, t = ckTax(ci), R = ckRebat(r, ci), o = ckRebatWork(t, R);
  return GEN_LQ('penuh', { nama: r.p(CKNAMA), inc, list: ckList(L), rb: R.rb, ans: ckRM(o.pay), work: [`Pendapatan bercukai = ${ckN(inc)} − ${ckN(tr)} = ${ckRM(ci)}`].concat(ckTaxWork(ci), o.w) }, { fig: ckJadualFig() });
};
CK.pcb = r => {
  const L = ckRelief(r), tr = L.reduce((s, x) => s + x[1], 0), inc = r.i(60, 100) * 1000, ci = inc - tr, t = ckTax(ci), m = r.i(Math.max(1, Math.round(t / 12 / 10) - 8), Math.round(t / 12 / 10) + 8) * 10;
  const paid = m * 12, diff = ckR2(paid - t), nama = r.p(CKNAMA);
  const q = `Pendapatan tahunan ${nama} ialah ${ckRM(inc)} dengan pelepasan ${ckList(L)}. Majikannya memotong potongan cukai bulanan (PCB) ${ckRM(m)} sebulan. Adakah ${nama} perlu membayar baki cukai atau menerima bayaran balik? Hitung amaunnya. Gunakan jadual di bawah.`;
  const ans = diff === 0 ? 'Tiada baki dan tiada bayaran balik' : diff > 0 ? `Menerima bayaran balik ${ckRM(diff)}` : `Perlu membayar baki ${ckRM(-diff)}`;
  return GEN_LQ('pcb', { q, ans, work: [`Pendapatan bercukai = ${ckN(inc)} − ${ckN(tr)} = ${ckRM(ci)}`].concat(ckTaxWork(ci), [`Jumlah PCB = ${ckN(m)} × 12 = ${ckRM(paid)}`, `${ckN(paid)} − ${ckN(t)} = ${diff < 0 ? '−' + ckN(-diff) : ckN(diff)} → ${ans}`]) }, { fig: ckJadualFig() });
};
// 4.1.4
const CKCC_A = [998, 1197, 1298, 1332, 1396, 1496, 1598];
CK.jalan = (r, hard) => {
  const cc = hard ? r.i(1601, 2500) : r.p(CKCC_A);
  return GEN_LQ('jalan', { nama: r.p(CKNAMA), cc, ans: ckRM(ckJalan(cc)), work: ckJWork(cc) }, { fig: ckJalanFig() });
};
const CKITEM = [['sepasang kasut', 'cukai jualan', 10], ['sebuah mesin basuh', 'cukai jualan', 10], ['sebuah telefon pintar', 'cukai jualan', 5], ['set perabot', 'cukai jualan', 10], ['bil makan di restoran', 'cukai perkhidmatan', 6], ['bil penginapan hotel', 'cukai perkhidmatan', 6], ['bil telefon bulanan', 'cukai perkhidmatan', 6], ['bil servis kereta', 'cukai perkhidmatan', 6]];
CK.sst = r => {
  const it = r.p(CKITEM), p = r.i(8, 300) * 5, t = ckR2(p * it[2] / 100), tot = ckR2(p + t);
  return GEN_LQ('sst', { nama: r.p(CKNAMA), item: it[0], jen: it[1], r: it[2], p, t, tot, ans: ckRM(tot), work: [`${vcap(it[1])} = ${ckN(p)} × ${it[2]}% = ${ckRM(t)}`, `Jumlah bayaran = ${ckN(p)} + ${ckN(t)} = ${ckRM(tot)}`] });
};
CK.tanah = r => {
  const L = r.i(8, 80) * 25, k = r.p([15, 20, 25, 30, 35, 40, 45, 50]), t = ckR2(L * k / 100);
  return GEN_LQ('tanah', { nama: r.p(CKNAMA), L, k, ans: ckRM(t), work: [`${k} sen = RM${(k / 100).toFixed(2)}`, `Cukai tanah = ${ckN(L)} × ${(k / 100).toFixed(2)} = ${ckRM(t)}`] });
};
CK.pintu = r => {
  const nt = r.i(12, 60) * 1000, rr = r.p([4, 5, 6, 7, 8, 10]), t = ckR2(nt * rr / 100), h = ckR2(t / 2);
  return GEN_LQ('pintu', { nama: r.p(CKNAMA), nt, r: rr, ans: `${ckRM(t)} setahun; ${ckRM(h)} setiap setengah tahun`, work: [`Cukai pintu = ${ckN(nt)} × ${rr}% = ${ckRM(t)} setahun`, `Setiap setengah tahun = ${ckN(t)} ÷ 2 = ${ckRM(h)}`] });
};
CK.gabung4 = (r, i) => {
  const nama = r.p(CKNAMA), kind = (i == null ? r.i(0, 2) : i) % 3;
  if (kind === 0) {
    const p = r.i(10, 40) * 5, n = r.i(2, 6), tot = p * n, t = ckR2(tot * 0.06);
    return GEN_LQ('gabung', { q: `${nama} menjamu ${n} orang rakan di sebuah restoran. Harga setiap hidangan ialah ${ckRM(p)}. Cukai perkhidmatan 6% dikenakan ke atas bil. Jika bil dikongsi sama rata oleh ${n + 1} orang, hitung bayaran setiap orang.`, ans: ckRM(ckR2((tot + t) / (n + 1))), work: [`Bil = ${ckN(p)} × ${n} = ${ckRM(tot)}`, `Cukai perkhidmatan = ${ckN(tot)} × 6% = ${ckRM(t)}`, `Jumlah = ${ckRM(tot + t)}`, `Setiap orang = ${ckN(tot + t)} ÷ ${n + 1} = ${ckRM((tot + t) / (n + 1))}`] });
  }
  if (kind === 1) {
    const a = r.i(1601, 1999), b = r.p(CKCC_A), ta = ckJalan(a), tb = ckJalan(b);
    return GEN_LQ('gabung', { q: `${nama} mempunyai dua buah kereta persendirian di Semenanjung Malaysia berkapasiti ${ckN(a)} cc dan ${ckN(b)} cc. Hitung jumlah cukai jalan setahun bagi kedua-dua kereta. Gunakan jadual di bawah.`, ans: ckRM(ckR2(ta + tb)), work: ckJWork(a).concat(ckJWork(b), [`Jumlah = ${ckN(ta)} + ${ckN(tb)} = ${ckRM(ta + tb)}`]) }, { fig: ckJalanFig() });
  }
  const nt = r.i(15, 40) * 1000, rr = r.p([5, 6, 8]), L = r.i(8, 24) * 25, k = r.p([25, 30, 40]), tp = ckR2(nt * rr / 100), tt = ckR2(L * k / 100);
  return GEN_LQ('gabung', { q: `Rumah ${nama} mempunyai nilai tahunan ${ckRM(nt)} dengan kadar cukai pintu ${rr}%. Tanahnya seluas ${ckN(L)} m² dikenakan cukai tanah ${k} sen per m². Hitung jumlah cukai harta setahun dan nyatakan kepada siapa setiap cukai dibayar.`, ans: `${ckRM(tp + tt)} (cukai pintu kepada PBT, cukai tanah kepada Pejabat Tanah)`, work: [`Cukai pintu = ${ckN(nt)} × ${rr}% = ${ckRM(tp)}`, `Cukai tanah = ${ckN(L)} × ${(k / 100).toFixed(2)} = ${ckRM(tt)}`, `Jumlah = ${ckRM(tp + tt)}`] });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '4.1.1': { m: [() => CK.agensi(ckRG), () => CK.jenis(ckRG), () => CK.tujuan(ckRG)], s: [() => CK.setahun(ckRG)], k: [() => CK.belanja(ckRG)] },
  '4.1.3': { m: [() => CK.bercukai(ckRG), () => CK.cukai(ckRG), () => CK.rebat(ckRG)], s: [() => CK.penuh(ckRG)], k: [() => CK.pcb(ckRG)] },
  '4.1.4': { m: [() => CK.jalan(ckRG), () => CK.sst(ckRG), () => CK.tanah(ckRG)], s: [() => CK.pintu(ckRG), () => CK.jalan(ckRG, true)], k: [() => CK.gabung4(ckRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {
  agensi: () => CK.agensi(ckRW), jenis: () => CK.jenis(ckRW), tujuan: () => CK.tujuan(ckRW), setahun: () => CK.setahun(ckRW), belanja: () => CK.belanja(ckRW),
  bercukai: () => CK.bercukai(ckRW), cukai: () => CK.cukai(ckRW), rebat: () => CK.rebat(ckRW), penuh: () => CK.penuh(ckRW), pcb: () => CK.pcb(ckRW),
  jalan: () => CK.jalan(ckRW), sst: () => CK.sst(ckRW), tanah: () => CK.tanah(ckRW), pintu: () => CK.pintu(ckRW), jalanP: () => CK.jalan(ckRW, true), gabung4: i => CK.gabung4(ckRW, i)
};
const WSPLAN = {
  '4.1.1': [['m', 'agensi', 6], ['m', 'jenis', 6], ['m', 'tujuan', 6], ['s', 'setahun', 9], ['k', 'belanja', 3]],
  '4.1.3': [['m', 'bercukai', 6], ['m', 'cukai', 6], ['m', 'rebat', 6], ['s', 'penuh', 9], ['k', 'pcb', 3]],
  '4.1.4': [['m', 'jalan', 6], ['m', 'sst', 6], ['m', 'tanah', 6], ['s', 'pintu', 5], ['s', 'jalanP', 4], ['k', 'gabung4', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function ckOpts(ans, cands) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c) || /NaN|undefined/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const ckMoneyOpts = (v, alts) => { const c = alts.map(ckR2).filter(x => x > 0 && x !== ckR2(v)); for (let k = 1; c.length < 6; k++) c.push(ckR2(v + k * 10)); return ckOpts(ckRM(v), c.map(ckRM)); };
const ckMcq = (q, o, fig) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const CQGEN = {
  agensi: () => { const a = pick(CKAG.filter(x => CKAGN[x[1]])); const A = { LHDNM: 'LHDNM', JKDM: 'JKDM', JPJ: 'JPJ', PBT: 'PBT', 'Pejabat Tanah': 'Pejabat Tanah' }; return ckMcq(`Agensi yang memungut ${a[0]} ialah`, ckOpts(A[a[1]], Object.values(A))); },
  pendapatan: L => {
    if (L === 0) { const inc = ri(30, 90) * 1000, rel = ri(12, 25) * 500; return ckMcq(`Pendapatan tahunan ${ckRM(inc)}, jumlah pelepasan ${ckRM(rel)}. Pendapatan bercukai ialah`, ckMoneyOpts(inc - rel, [inc + rel, inc - 9000, rel, inc - rel - 1000])); }
    const ci = ri(21, 69) * 1000, t = ckTax(ci), b = ckBand(ci);
    return ckMcq(`Cukai bagi pendapatan bercukai ${ckRM(ci)} ialah (rujuk jadual)`, ckMoneyOpts(t, [ci * b[2] / 100, b[3], t + 400, (ci - b[0]) * b[2] / 100, t - 400]), ckJadualFig());
  },
  jalan: L => { const cc = L === 0 ? pick(CKCC_A) : ri(1601, 1999); const v = ckJalan(cc), b = ckJ(cc); return ckMcq(`Cukai jalan kereta persendirian ${ckN(cc)} cc (Semenanjung) ialah (rujuk jadual)`, ckMoneyOpts(v, [b[3] ? cc * b[3] : b[2] + 35, b[2], v + 20, b[3] ? b[2] + (cc - b[0]) : 90, 55, 70, 20].filter(x => x !== v)), ckJalanFig()); },
  sst: () => { const it = pick(CKITEM), p = ri(8, 120) * 5, t = ckR2(p * it[2] / 100); return ckMcq(`${vcap(it[0])} berharga ${ckRM(p)} dikenakan ${it[1]} ${it[2]}%. Jumlah bayaran ialah`, ckMoneyOpts(p + t, [t, p + p * 0.1, p - t, p + it[2]])); }
};
const CQT = { agensi: 'Agensi pemungut cukai', pendapatan: 'Cukai pendapatan', jalan: 'Cukai jalan', sst: 'Cukai jualan & perkhidmatan' };
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0)));
}
function gq(level) {
  const pool = level === 0 ? ['agensi', 'agensi', 'sst', 'pendapatan', 'jalan'] : Object.keys(CQT);
  return CQGEN[pick(pool)](level | 0);
}
