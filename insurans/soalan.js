'use strict';
/* =================== INSURANS · SOALAN BAB 3 (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Semua nama global berawalan "is" / "IS".

/* =================== pembantu =================== */
const isRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const isRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
const isR2 = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? 0 : r; };
// nombor: pemisah ribu = ruang tak putus (gaya buku teks KSSM: RM150 000)
const isN = v => { const r = isR2(v), s = Number.isInteger(r) ? String(r) : r.toFixed(2); const [a, b] = s.split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (b ? '.' + b : ''); };
const isRM = v => 'RM' + isN(v);
const isRM2 = v => 'RM' + (() => { const r = isR2(v), [a, b] = r.toFixed(2).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '.' + b; })();
const ISNAMA = ['Encik Kamal', 'Puan Lina', 'Encik Ravi', 'Cik Mei Ling', 'Puan Aisyah', 'Encik Daniel', 'Cik Nurul', 'Encik Ah Kow', 'Puan Devi', 'Encik Faiz', 'Puan Rosnah', 'Encik Jason'];
const isTxt = (x, y, t, c, s, a) => `<text x="${x}" y="${y}" style="fill:var(--${c || 'tx'})" font-size="${s || 15}" font-weight="700" font-family="Inter, sans-serif" text-anchor="${a || 'start'}" dominant-baseline="central">${t}</text>`;
function isShuf(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = r.i(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- 3.1.1 data ---------- */
const ISTILAH = [
  ['premium', 'bayaran yang dibuat oleh pemegang polisi kepada syarikat insurans untuk mendapat perlindungan'],
  ['polisi', 'kontrak bertulis antara pemegang polisi dengan syarikat insurans'],
  ['pemegang polisi', 'individu atau organisasi yang membeli polisi insurans'],
  ['penanggung insurans', 'syarikat insurans yang menanggung risiko dan membayar pampasan'],
  ['tuntutan', 'permohonan rasmi pemegang polisi kepada syarikat insurans untuk mendapat pampasan'],
  ['pampasan', 'bayaran oleh syarikat insurans kepada pemegang polisi apabila berlaku kerugian yang dilindungi'],
  ['nilai muka', 'jumlah perlindungan yang dinyatakan dalam polisi insurans hayat'],
  ['benefisiari', 'orang yang dinamakan untuk menerima bayaran insurans hayat apabila pemegang polisi meninggal dunia'],
  ['risiko', 'peluang berlakunya kerugian'],
  ['deduktibel', 'jumlah kerugian yang perlu ditanggung sendiri oleh pemegang polisi sebelum syarikat insurans membayar']
];
// [situasi, jenis insurans, hayat/am]
const ISJENIS = [
  ['melindungi keluarga daripada kehilangan pendapatan jika pemegang polisi meninggal dunia dalam tempoh tertentu', 'insurans hayat sementara', 'hayat'],
  ['menyimpan wang dan mendapat perlindungan hayat dengan pulangan pada akhir tempoh tertentu', 'insurans hayat (endowmen)', 'hayat'],
  ['melindungi rumah daripada kerugian akibat kebakaran', 'insurans kebakaran', 'am'],
  ['menanggung kos rawatan di hospital', 'insurans perubatan dan kesihatan', 'am'],
  ['melindungi kehilangan bagasi dan pembatalan penerbangan semasa melancong', 'insurans perjalanan', 'am'],
  ['menanggung kerosakan kenderaan orang lain akibat kemalangan jalan raya', 'insurans motor', 'am'],
  ['memberi pampasan jika pemegang polisi cedera atau hilang upaya akibat kemalangan', 'insurans kemalangan diri', 'am'],
  ['melindungi kenderaan sendiri daripada kecurian', 'insurans motor', 'am']
];
const ISPOL = ['pihak ketiga', 'pihak ketiga, kebakaran dan kecurian', 'komprehensif'];
// [kejadian, perlindungan minimum diperlukan: 0 pihak ketiga, 1 PKKK, 2 komprehensif]
const ISKEJ = [
  ['kereta orang lain yang dilanggar oleh pemegang polisi', 0],
  ['kecederaan pejalan kaki yang dilanggar oleh pemegang polisi', 0],
  ['kereta pemegang polisi yang dicuri', 1],
  ['kereta pemegang polisi yang terbakar', 1],
  ['kerosakan kereta pemegang polisi akibat kemalangan', 2],
  ['kereta pemegang polisi yang rosak kerana terbabas sendiri', 2]
];

/* ---------- 3.1.2 data ---------- */
// contoh jadual kadar premium tahunan insurans hayat per RM1 000 nilai muka
const ISUMUR = [20, 25, 30, 35, 40, 45];
const ISKADAR = {
  'lelaki bukan perokok': [1.18, 1.24, 1.33, 1.48, 1.76, 2.31],
  'lelaki perokok': [1.54, 1.66, 1.81, 2.05, 2.53, 3.37],
  'perempuan bukan perokok': [0.98, 1.03, 1.10, 1.24, 1.47, 1.90],
  'perempuan perokok': [1.18, 1.25, 1.35, 1.54, 1.86, 2.46]
};
function isKadarFig() {
  const K = Object.keys(ISKADAR), lab = ['L, bukan perokok', 'L, perokok', 'P, bukan perokok', 'P, perokok'];
  let s = `<rect x="2" y="2" width="456" height="262" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  s += isTxt(230, 20, 'Kadar premium tahunan per RM1 000 (RM)', 'tr', 14, 'middle') + isTxt(16, 46, 'Umur', 'tr', 13);
  lab.forEach((l, j) => { s += isTxt(150 + j * 82, 46, l.split(', ')[0] === 'L' ? 'Lelaki' : 'Perempuan', 'mu', 12, 'middle') + isTxt(150 + j * 82, 62, l.split(', ')[1], 'mu', 11, 'middle'); });
  ISUMUR.forEach((u, i) => { const y = 92 + i * 29; s += `<line x1="10" y1="${y - 15}" x2="450" y2="${y - 15}" style="stroke:var(--bd)" stroke-width="1"/>` + isTxt(16, y, u + ' tahun', 'tx', 14); K.forEach((k, j) => { s += isTxt(150 + j * 82, y, ISKADAR[k][i].toFixed(2), 'am', 15, 'middle'); }); });
  return `<svg viewBox="0 0 460 266" style="max-width:460px;width:100%" role="img" aria-label="Jadual kadar premium insurans hayat">${s}</svg>`;
}
// contoh jadual tarif motor Semenanjung Malaysia: [cc bawah, cc atas, komprehensif RM1 000 pertama, pihak ketiga]
const ISTARIF = [[0, 1400, 273.80, 120.60], [1401, 1650, 305.50, 135.00], [1651, 2200, 339.10, 151.20], [2201, 3050, 372.60, 167.40]];
const ISTAMBAH = 26;
const ISNCD = [25, 30, 38.33, 45, 55];
const isTarif = cc => ISTARIF.find(b => cc <= b[1]);
function isTarifFig() {
  let s = `<rect x="2" y="2" width="456" height="214" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>`;
  s += isTxt(230, 20, 'Tarif motor (Semenanjung Malaysia)', 'tr', 14, 'middle') + isTxt(16, 48, 'Kapasiti enjin', 'tr', 13) + isTxt(240, 40, 'Komprehensif', 'tr', 13, 'middle') + isTxt(240, 56, '(RM1 000 pertama)', 'mu', 11, 'middle') + isTxt(380, 48, 'Pihak ketiga', 'tr', 13, 'middle');
  ISTARIF.forEach((b, i) => { const y = 88 + i * 28; s += `<line x1="10" y1="${y - 14}" x2="450" y2="${y - 14}" style="stroke:var(--bd)" stroke-width="1"/>` + isTxt(16, y, b[0] ? `${isN(b[0])} – ${isN(b[1])} cc` : `≤ ${isN(b[1])} cc`, 'tx', 14) + isTxt(240, y, isRM2(b[2]), 'am', 15, 'middle') + isTxt(380, y, isRM2(b[3]), 'am', 15, 'middle'); });
  s += isTxt(230, 196, 'Setiap RM1 000 berikutnya (komprehensif): RM26.00', 'gr', 13, 'middle');
  return `<svg viewBox="0 0 460 218" style="max-width:460px;width:100%" role="img" aria-label="Jadual tarif insurans motor">${s}</svg>`;
}
const isAsas = (cc, nilai) => { const b = isTarif(cc); return isR2(b[2] + (nilai - 1000) / 1000 * ISTAMBAH); };
const isAsasWork = (cc, nilai) => { const b = isTarif(cc), n = (nilai - 1000) / 1000, t = isR2(n * ISTAMBAH); return [`RM1 000 pertama (${b[0] ? isN(b[0]) + ' – ' + isN(b[1]) : '≤ ' + isN(b[1])} cc): ${isRM2(b[2])}`, `Baki ${isRM(nilai - 1000)}: ${n} × RM26 = ${isRM2(t)}`, `Premium asas = ${isN(b[2])} + ${isN(t)} = ${isRM2(isAsas(cc, nilai))}`]; };

/* ---------- 3.1.3 rajah ---------- */
// bar: bahagian ditanggung pemegang polisi vs syarikat
function isBarFig(total, segs, title) {
  const H = 130 + segs.length * 20;
  let s = `<rect x="2" y="2" width="456" height="${H - 4}" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/>` + isTxt(230, 22, title, 'tx', 15, 'middle');
  let x = 20;
  segs.forEach(([v, lab, c]) => { const w = 420 * v / total; s += `<rect x="${x.toFixed(1)}" y="42" width="${w.toFixed(1)}" height="46" rx="6" style="fill:color-mix(in srgb,var(--${c}) 35%,transparent);stroke:var(--${c})" stroke-width="2"/>`; x += w; });
  segs.forEach(([v, lab, c], i) => { const y = 108 + i * 20; s += `<rect x="24" y="${y - 7}" width="14" height="14" rx="3" style="fill:var(--${c})"/>` + isTxt(46, y, lab, 'tx', 13); });
  return `<svg viewBox="0 0 460 ${H}" style="max-width:460px;width:100%" role="img" aria-label="${title}">${s}</svg>`;
}

/* =================== QV: cara tanya =================== */
const QV = {
  istilah: [
    d => ({ q: `Apakah istilah insurans bagi “${d.mk}”?` }),
    d => ({ q: `Nyatakan istilah yang sesuai: ${d.mk}.` }),
    d => ({ q: `Dalam insurans, ${d.mk} dikenali sebagai apa?` }),
    d => ({ q: `Terangkan maksud ${d.ist} dalam insurans.`, ans: vcap(d.mk) })
  ],
  jenis: [
    d => ({ q: `${d.nama} ingin ${d.sit}. Apakah jenis insurans yang sesuai, dan adakah ia insurans hayat atau insurans am?` }),
    d => ({ q: `Nyatakan jenis insurans yang sesuai untuk ${d.sit}. Kelaskan sebagai insurans hayat atau insurans am.` }),
    d => ({ q: `Polisi insurans yang digunakan untuk ${d.sit} ialah insurans jenis apa? Adakah ia tergolong dalam insurans hayat atau am?` })
  ],
  motor: [
    d => ({ q: `${d.nama} memegang polisi motor ${d.pol}. Adakah syarikat insurans membayar pampasan bagi ${d.kej}?` }),
    d => ({ q: `Polisi insurans motor ${d.nama} ialah polisi ${d.pol}. Berlaku kejadian berikut: ${d.kej}. Adakah kerugian ini dilindungi? Terangkan.` }),
    d => ({ q: `Adakah polisi motor ${d.pol} melindungi ${d.kej}?` }),
    d => ({ q: `Polisi motor manakah yang paling murah tetapi masih melindungi ${d.kej}?`, ans: `Polisi ${ISPOL[d.min]}` })
  ],
  pihak: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Kenal pasti', 'Nyatakan') }),
    d => ({ q: d.q.replace('Kenal pasti', 'Tentukan') })
  ],
  kemalangan: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') }),
    d => ({ q: d.q.replace('Hitung', 'Berapakah').replace(/\.$/, '?') })
  ],
  hayat: [
    d => ({ q: `${d.nama} membeli polisi insurans hayat bernilai muka ${isRM(d.nm)}. Kadar premium tahunan ialah ${isRM2(d.k)} per RM1 000. Hitung premium tahunannya.` }),
    d => ({ q: `Kadar premium sebuah polisi hayat ialah ${isRM2(d.k)} per RM1 000 nilai muka setahun. Cari premium tahunan bagi nilai muka ${isRM(d.nm)}.` }),
    d => ({ q: `Berapakah premium tahunan bagi polisi hayat bernilai muka ${isRM(d.nm)} jika kadar premium ialah ${isRM2(d.k)} per RM1 000?` }),
    d => { const N = vnama(); return Object.assign({ q: `Polisi hayat bernilai muka ${isRM(d.nm)} mempunyai kadar premium ${isRM2(d.k)} per RM1 000. ${N} berkata premium tahunannya ialah ${isRM2(d.wrong)}. Adakah ${N} betul?` }, salah(N, isRM2(d.p), `${N} tidak membahagikan nilai muka dengan RM1 000 dengan betul.`)); }
  ],
  asas: [
    d => ({ q: `Kereta ${d.nama} (${isN(d.cc)} cc, Semenanjung Malaysia) diinsuranskan dengan polisi komprehensif bernilai ${isRM(d.nilai)}. Berdasarkan jadual di bawah, hitung premium asas.` }),
    d => ({ q: `Gunakan jadual tarif di bawah. Cari premium asas polisi komprehensif bagi kereta ${isN(d.cc)} cc yang diinsuranskan ${isRM(d.nilai)}.` }),
    d => ({ q: `Berapakah premium asas polisi komprehensif bagi kereta berkapasiti ${isN(d.cc)} cc dengan jumlah diinsuranskan ${isRM(d.nilai)}? Rujuk jadual di bawah.` })
  ],
  ncd: [
    d => ({ q: `Premium asas insurans motor ${d.nama} ialah ${isRM2(d.b)}. Dia layak mendapat NCD ${d.r}%. Hitung premium yang perlu dibayar.` }),
    d => ({ q: `Seorang pemegang polisi mendapat diskaun tanpa tuntutan (NCD) ${d.r}% ke atas premium asas ${isRM2(d.b)}. Cari premium selepas NCD.` }),
    d => ({ q: `Berapakah premium motor yang dibayar jika premium asas ialah ${isRM2(d.b)} dan NCD ialah ${d.r}%?` })
  ],
  hayatJ: [
    d => ({ q: `${d.nama}, ${d.jen}, berumur ${d.u} tahun, ingin membeli polisi insurans hayat bernilai muka ${isRM(d.nm)}. Berdasarkan jadual di bawah, hitung premium tahunan dan premium bulanan (premium tahunan ÷ 12).` }),
    d => ({ q: `Gunakan jadual di bawah. Cari premium tahunan dan premium bulanan (tahunan ÷ 12) bagi ${d.jen} berumur ${d.u} tahun yang membeli polisi hayat bernilai muka ${isRM(d.nm)}.` }),
    d => ({ q: `Berapakah premium tahunan dan premium bulanan (tahunan ÷ 12) yang dibayar oleh ${d.jen} berumur ${d.u} tahun untuk nilai muka ${isRM(d.nm)}? Rujuk jadual di bawah.` })
  ],
  komp: [
    d => ({ q: `Kereta ${d.nama} berkapasiti ${isN(d.cc)} cc di Semenanjung Malaysia diinsuranskan ${isRM(d.nilai)}. Dia membeli polisi ${d.pol} dan layak mendapat NCD ${d.r}%. Berdasarkan jadual di bawah, hitung premium yang perlu dibayar.` }),
    d => ({ q: `Gunakan jadual di bawah. Cari premium polisi ${d.pol} bagi kereta ${isN(d.cc)} cc yang diinsuranskan ${isRM(d.nilai)} dengan NCD ${d.r}%.` }),
    d => ({ q: `Berapakah premium polisi ${d.pol} bagi kereta ${isN(d.cc)} cc bernilai ${isRM(d.nilai)} jika NCD ialah ${d.r}%? Rujuk jadual di bawah.` })
  ],
  bajet: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') })
  ],
  deduk: [
    d => ({ q: `${d.nama} membuat tuntutan bagi kerugian ${isRM(d.L)}. Polisinya mempunyai deduktibel ${isRM(d.d)}. Hitung bayaran pampasan oleh syarikat insurans.` }),
    d => ({ q: `Polisi insurans dengan deduktibel ${isRM(d.d)}. Kerugian yang berlaku ialah ${isRM(d.L)}. Berapakah pampasan yang diterima?` }),
    d => ({ q: `Cari bayaran pampasan bagi kerugian ${isRM(d.L)} jika deduktibel polisi ialah ${isRM(d.d)}.` }),
    d => { const N = vnama(); return Object.assign({ q: `Kerugian ialah ${isRM(d.L)} dan deduktibel ialah ${isRM(d.d)}. ${N} berkata pampasan ialah ${isRM(d.L + d.d)}. Adakah ${N} betul?` }, salah(N, isRM(d.pay), `${N} menambah deduktibel; deduktibel sepatutnya ditolak.`)); }
  ],
  perlu: [
    d => ({ q: `Nilai boleh diinsuranskan bagi ${d.harta} ialah ${isRM(d.v)}. Polisi mempunyai fasal ko-insurans ${d.p}%. Hitung jumlah insurans yang perlu dibeli.` }),
    d => ({ q: `Fasal ko-insurans ${d.p}% dikenakan ke atas ${d.harta} bernilai ${isRM(d.v)}. Cari jumlah insurans minimum yang perlu dibeli.` }),
    d => ({ q: `Berapakah jumlah insurans yang perlu dibeli bagi ${d.harta} bernilai ${isRM(d.v)} dengan ko-insurans ${d.p}%?` })
  ],
  perubatan: [
    d => ({ q: `Polisi perubatan ${d.nama} mempunyai deduktibel ${isRM(d.d)} dan fasal ko-insurans ${d.a}/${100 - d.a}. Kos rawatan ialah ${isRM(d.kos)}. Hitung bayaran oleh syarikat insurans.` }),
    d => ({ q: `Kos rawatan hospital ialah ${isRM(d.kos)}. Polisi: deduktibel ${isRM(d.d)}, ko-insurans ${d.a}/${100 - d.a} (syarikat/pemegang polisi). Cari bayaran syarikat insurans.` }),
    d => ({ q: `Berapakah yang dibayar oleh syarikat insurans bagi kos perubatan ${isRM(d.kos)} jika deduktibel ialah ${isRM(d.d)} dan ko-insurans ${d.a}/${100 - d.a}?` })
  ],
  koins: [
    d => ({ q: `${d.H} bernilai boleh diinsuranskan ${isRM(d.v)}. Polisi: ko-insurans ${d.p}%, deduktibel ${isRM(d.d)}. ${d.harta2} diinsuranskan ${isRM(d.beli)}. Berlaku kebakaran dengan kerugian ${isRM(d.L)}. Hitung bayaran pampasan.` }),
    d => ({ q: `${d.nama} menginsuranskan ${d.harta} bernilai ${isRM(d.v)} sebanyak ${isRM(d.beli)}. Polisi mempunyai fasal ko-insurans ${d.p}% dan deduktibel ${isRM(d.d)}. Cari pampasan bagi kerugian ${isRM(d.L)}.` }),
    d => ({ q: `Berapakah pampasan bagi kerugian ${isRM(d.L)} jika ${d.harta} bernilai ${isRM(d.v)} diinsuranskan ${isRM(d.beli)}, dengan ko-insurans ${d.p}% dan deduktibel ${isRM(d.d)}?` })
  ],
  medPenuh: [
    d => ({ q: `Polisi perubatan ${d.nama}: deduktibel ${isRM(d.d)}, ko-insurans ${d.a}/${100 - d.a}. Kos rawatannya ialah ${isRM(d.kos)}. Hitung bayaran syarikat insurans dan jumlah kos yang ditanggung ${d.nama}.` }),
    d => ({ q: `Kos rawatan ${isRM(d.kos)} dituntut di bawah polisi dengan deduktibel ${isRM(d.d)} dan ko-insurans ${d.a}/${100 - d.a}. Cari bahagian syarikat insurans dan bahagian pemegang polisi.` }),
    d => ({ q: `${d.nama} dimasukkan ke hospital dan kosnya ${isRM(d.kos)}. Polisinya: deduktibel ${isRM(d.d)}, ko-insurans ${d.a}/${100 - d.a}. Berapakah yang dibayar oleh syarikat dan oleh ${d.nama}?` })
  ],
  koinsK: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Hitung', 'Cari') })
  ]
};

/* =================== penjana teras =================== */
const IS = {};
// 3.1.1
IS.istilah = r => {
  const t = r.p(ISTILAH);
  return GEN_LQ('istilah', { ist: t[0], mk: t[1], ans: vcap(t[0]), work: [`${vcap(t[0])}: ${t[1]}.`] });
};
IS.jenis = r => {
  const j = r.p(ISJENIS);
  return GEN_LQ('jenis', { nama: r.p(ISNAMA), sit: j[0], ans: `${vcap(j[1])}; insurans ${j[2]}`, work: [`Tujuan: ${j[0]} → ${j[1]}.`, j[2] === 'hayat' ? 'Insurans hayat melindungi nyawa pemegang polisi.' : 'Insurans am melindungi harta, kesihatan atau liabiliti.'] });
};
IS.motor = r => {
  const k = r.p(ISKEJ), pi = r.i(0, 2), ok = pi >= k[1];
  return GEN_LQ('motor', { nama: r.p(ISNAMA), pol: ISPOL[pi], kej: k[0], min: k[1], ans: ok ? 'Ya, dilindungi' : 'Tidak dilindungi', work: [`Kejadian ini memerlukan sekurang-kurangnya polisi ${ISPOL[k[1]]}.`, `Polisi ${ISPOL[pi]} ${ok ? 'meliputi' : 'tidak meliputi'} kejadian ini.`] });
};
// 3.1.1 sederhana: kenal pasti pihak
IS.pihak = r => {
  const A = r.p(ISNAMA), B = r.p(ISNAMA.filter(n => n !== A)), sy = r.p(['Syarikat Insurans Amanah', 'Syarikat Insurans Bestari', 'Syarikat Insurans Cempaka', 'Syarikat Insurans Delima']), x = r.p(['keretanya', 'motosikalnya', 'van syarikatnya']);
  const kenal = r.p([['pihak pertama', A], ['pihak kedua', sy], ['pihak ketiga', B]]);
  const q = `${A} membeli polisi insurans motor bagi ${x} daripada ${sy}. Semasa memandu, ${A} melanggar kereta milik ${B}. Kenal pasti ${kenal[0]} dalam situasi ini, dan nyatakan siapa yang membayar premium.`;
  return GEN_LQ('pihak', { q, ans: `${vcap(kenal[0])}: ${kenal[1]}; premium dibayar oleh ${A}`, work: [`Pihak pertama = pemegang polisi (${A})`, `Pihak kedua = syarikat insurans (${sy})`, `Pihak ketiga = orang lain yang terlibat (${B})`, `Premium dibayar oleh pemegang polisi, ${A}.`] });
};
// 3.1.1 sukar: kemalangan & jenis polisi
IS.kemalangan = (r, i) => {
  const A = r.p(ISNAMA), pi = i == null ? r.i(0, 2) : i % 3, x = r.i(3, 18) * 500, y = r.i(2, 16) * 500;
  const pay = pi === 2 ? x + y : y;
  const q = `Kereta ${A} yang diinsuranskan dengan polisi ${ISPOL[pi]} terlibat dalam kemalangan. Kerosakan pada kereta ${A} ialah ${isRM(x)} dan kerosakan pada kereta pihak ketiga ialah ${isRM(y)}. Hitung jumlah yang dibayar oleh syarikat insurans ${A} dan jumlah yang ditanggung sendiri oleh ${A}.`;
  return GEN_LQ('kemalangan', { q, ans: `Syarikat insurans: ${isRM(pay)}; ${A}: ${isRM(x + y - pay)}`, work: pi === 2 ? ['Polisi komprehensif melindungi kerosakan pihak ketiga dan kenderaan sendiri.', `Syarikat bayar = ${isN(x)} + ${isN(y)} = ${isRM(pay)}`, `${A} tanggung RM0`] : [`Polisi ${ISPOL[pi]} hanya melindungi pihak ketiga dalam kemalangan${pi === 1 ? ' (kebakaran dan kecurian sahaja untuk kenderaan sendiri)' : ''}.`, `Syarikat bayar kerosakan pihak ketiga = ${isRM(y)}`, `${A} tanggung kerosakan keretanya sendiri = ${isRM(x)}`] });
};
// 3.1.2
IS.hayat = r => {
  const nm = r.i(5, 60) * 5000, k = r.p([1.05, 1.18, 1.24, 1.33, 1.48, 1.76, 2.05, 2.15, 2.31, 2.53, 3.12]), p = isR2(nm / 1000 * k);
  return GEN_LQ('hayat', { nama: r.p(ISNAMA), nm, k, p, wrong: isR2(nm / 100 * k), ans: isRM2(p) + ' setahun', work: [`Bilangan unit RM1 000 = ${isN(nm)} ÷ 1 000 = ${isN(nm / 1000)}`, `Premium = ${isN(nm / 1000)} × ${k.toFixed(2)} = ${isRM2(p)}`] });
};
IS.asas = r => {
  const cc = r.p([998, 1298, 1332, 1496, 1598, 1798, 1998, 2354, 2488]), nilai = r.i(20, 120) * 1000, b = isAsas(cc, nilai);
  return GEN_LQ('asas', { nama: r.p(ISNAMA), cc, nilai, ans: isRM2(b), work: isAsasWork(cc, nilai) }, { fig: isTarifFig() });
};
IS.ncd = r => {
  const b = isR2(r.i(400, 2600) * 1.5 + r.p([0, 0.2, 0.4, 0.8])), rr = r.p([25, 30, 45, 55]), dis = isR2(b * rr / 100), p = isR2(b - dis);
  return GEN_LQ('ncd', { nama: r.p(ISNAMA), b, r: rr, ans: isRM2(p), work: [`NCD = ${rr}% × ${isN(b)} = ${isRM2(dis)}`, `Premium = ${isN(b)} − ${isN(dis)} = ${isRM2(p)}`] });
};
IS.hayatJ = r => {
  const jen = r.p(Object.keys(ISKADAR)), nama = r.p(ISNAMA.filter(n => (n.startsWith('Encik') ? 'l' : 'p') === jen[0])), ui = r.i(0, 5), u = ISUMUR[ui], k = ISKADAR[jen][ui], nm = r.i(4, 30) * 10000, t = isR2(nm / 1000 * k), b = isR2(t / 12);
  return GEN_LQ('hayatJ', { nama, jen, u, nm, ans: `${isRM2(t)} setahun; ${isRM2(b)} sebulan`, work: [`Kadar bagi ${jen}, ${u} tahun = ${isRM2(k)} per RM1 000`, `Premium tahunan = (${isN(nm)} ÷ 1 000) × ${k.toFixed(2)} = ${isN(nm / 1000)} × ${k.toFixed(2)} = ${isRM2(t)}`, `Premium bulanan = ${isN(t)} ÷ 12 = ${isRM2(b)}`] }, { fig: isKadarFig() });
};
IS.komp = r => {
  const cc = r.p([1298, 1496, 1598, 1798, 1998, 2354]), nilai = r.i(25, 110) * 1000, rr = r.p(ISNCD), pkk = r.i(0, 2) === 0;
  const b = isAsas(cc, nilai), b2 = pkk ? isR2(b * 0.75) : b, dis = isR2(b2 * rr / 100), p = isR2(b2 - dis);
  const w = isAsasWork(cc, nilai);
  if (pkk) w.push(`Pihak ketiga, kebakaran dan kecurian = 75% × ${isN(b)} = ${isRM2(b2)}`);
  w.push(`NCD ${rr}% = ${rr}% × ${isN(b2)} = ${isRM2(dis)}`, `Premium = ${isN(b2)} − ${isN(dis)} = ${isRM2(p)}`);
  return GEN_LQ('komp', { nama: r.p(ISNAMA), cc, nilai, r: rr, pol: pkk ? 'pihak ketiga, kebakaran dan kecurian' : 'komprehensif', ans: isRM2(p), work: w }, { fig: isTarifFig() });
};
IS.bajet = (r, i) => {
  const nama = r.p(ISNAMA), kind = (i == null ? r.i(0, 1) : i) % 2;
  if (kind === 0) {
    const k = r.p([1.18, 1.24, 1.33, 1.48, 1.76, 2.15]), bln = r.i(4, 16) * 5, tahun = bln * 12, unit = Math.floor(tahun / k), nm = unit * 1000;
    const q = `${nama} mampu membayar premium insurans hayat sebanyak ${isRM(bln)} sebulan. Kadar premium tahunan ialah ${isRM2(k)} per RM1 000 nilai muka. Hitung nilai muka maksimum (dalam gandaan RM1 000) yang boleh dibelinya.`;
    return GEN_LQ('bajet', { q, ans: isRM(nm), work: [`Premium setahun yang mampu dibayar = ${isN(bln)} × 12 = ${isRM(tahun)}`, `Bilangan unit RM1 000 = ${isN(tahun)} ÷ ${k.toFixed(2)} = ${(tahun / k).toFixed(2)}`, `Bundarkan ke bawah: ${unit} unit`, `Nilai muka maksimum = ${unit} × RM1 000 = ${isRM(nm)}`] });
  }
  const k1 = r.p([1.18, 1.33, 1.48]), k2 = isR2(k1 + r.p([0.36, 0.48, 0.57, 0.72])), nm = r.i(10, 40) * 10000, p1 = isR2(nm / 1000 * k1), p2 = isR2(nm / 1000 * k2), n = r.p([10, 15, 20]);
  const q = `Kadar premium tahunan insurans hayat bagi ${nama} ialah ${isRM2(k1)} per RM1 000 jika dia bukan perokok dan ${isRM2(k2)} per RM1 000 jika dia perokok. Hitung jumlah premium tambahan yang perlu dibayar dalam tempoh ${n} tahun bagi nilai muka ${isRM(nm)} jika dia merokok.`;
  return GEN_LQ('bajet', { q, ans: isRM2((p2 - p1) * n), work: [`Bukan perokok: ${isN(nm / 1000)} × ${k1.toFixed(2)} = ${isRM2(p1)} setahun`, `Perokok: ${isN(nm / 1000)} × ${k2.toFixed(2)} = ${isRM2(p2)} setahun`, `Beza setahun = ${isN(p2)} − ${isN(p1)} = ${isRM2(p2 - p1)}`, `Dalam ${n} tahun = ${isN(p2 - p1)} × ${n} = ${isRM2((p2 - p1) * n)}`] });
};
// 3.1.3
IS.deduk = r => {
  const d = r.p([200, 300, 500, 1000, 1500, 2000]), L = r.i(0, 9) === 0 ? d - r.p([50, 100]) : d + r.i(3, 60) * 100, pay = Math.max(0, L - d);
  return GEN_LQ('deduk', { nama: r.p(ISNAMA), d, L, pay, ans: isRM(pay), work: L <= d ? [`Kerugian ${isRM(L)} ≤ deduktibel ${isRM(d)}`, 'Syarikat insurans tidak membayar pampasan: RM0'] : [`Pampasan = kerugian − deduktibel`, `= ${isN(L)} − ${isN(d)} = ${isRM(pay)}`] }, { fig: L > d ? isBarFig(L, [[d, `Deduktibel (pemegang polisi): ${isRM(d)}`, 'rd'], [L - d, 'Pampasan (syarikat): ?', 'gr']], `Kerugian ${isRM(L)}`) : '' });
};
const ISHARTA = [['Rumah', 'rumah', 'Rumah itu'], ['Kedai', 'kedai', 'Kedai itu'], ['Kilang', 'kilang', 'Kilang itu'], ['Gudang', 'gudang', 'Gudang itu'], ['Bangunan pejabat', 'bangunan pejabat', 'Bangunan itu']];
IS.perlu = r => {
  const h = r.p(ISHARTA), v = r.i(15, 90) * 10000, p = r.p([70, 75, 80, 85, 90]), need = v * p / 100;
  return GEN_LQ('perlu', { harta: h[1], v, p, ans: isRM(need), work: [`Jumlah insurans perlu dibeli = ${p}% × ${isN(v)}`, `= ${isRM(need)}`] });
};
const isMed = r => { const d = r.p([300, 500, 1000]), a = r.p([70, 75, 80, 90]), kos = d + r.i(20, 300) * 100, s = (kos - d) * a / 100; return { d, a, kos, s, own: kos - s }; };
IS.perubatan = r => {
  const m = isMed(r);
  return GEN_LQ('perubatan', Object.assign({ nama: r.p(ISNAMA), ans: isRM(m.s), work: [`Selepas deduktibel = ${isN(m.kos)} − ${isN(m.d)} = ${isRM(m.kos - m.d)}`, `Syarikat bayar ${m.a}% × ${isN(m.kos - m.d)} = ${isRM(m.s)}`] }, m));
};
// ko-insurans harta: pilih nombor supaya pampasan nombor bulat
const isKoins = (r, cukup) => {
  const v = r.i(10, 60) * 10000, p = r.p([75, 80, 90]), need = v * p / 100;
  const f = cukup ? r.p([[1, 1], [11, 10], [6, 5]]) : r.p([[1, 2], [3, 5], [3, 4], [4, 5], [2, 3]]);
  const beli = need * f[0] / f[1];
  const d = r.p([500, 1000, 2000, 2500]), L = f[1] * 1000 * r.i(3, 15);
  const pay = cukup ? Math.min(beli, L - d) : beli / need * L - d;
  return { v, p, need, beli, d, L, pay: isR2(pay), cukup };
};
const isKoinsWork = o => o.cukup
  ? [`Perlu dibeli = ${o.p}% × ${isN(o.v)} = ${isRM(o.need)}`, `${isRM(o.beli)} ≥ ${isRM(o.need)} → insurans mencukupi`, `Pampasan = ${isN(o.L)} − ${isN(o.d)} = ${isRM(o.pay)}`]
  : [`Perlu dibeli = ${o.p}% × ${isN(o.v)} = ${isRM(o.need)}`, `${isRM(o.beli)} < ${isRM(o.need)} → insurans tidak mencukupi`, `Pampasan = (${isN(o.beli)} ÷ ${isN(o.need)}) × ${isN(o.L)} − ${isN(o.d)}`, `= ${isN(o.beli / o.need * o.L)} − ${isN(o.d)} = ${isRM(o.pay)}`];
IS.koins = r => {
  const o = isKoins(r, r.i(0, 3) === 0), h = r.p(ISHARTA);
  return GEN_LQ('koins', Object.assign({}, o, { nama: r.p(ISNAMA), H: h[0], harta: h[1], harta2: h[2], ans: isRM(o.pay), work: isKoinsWork(o) }));
};
IS.medPenuh = r => {
  const m = isMed(r);
  return GEN_LQ('medPenuh', Object.assign({ nama: r.p(ISNAMA), ans: `Syarikat ${isRM(m.s)}; pemegang polisi ${isRM(m.own)}`, work: [`Selepas deduktibel = ${isN(m.kos)} − ${isN(m.d)} = ${isRM(m.kos - m.d)}`, `Syarikat bayar ${m.a}% × ${isN(m.kos - m.d)} = ${isRM(m.s)}`, `Pemegang polisi = ${isN(m.d)} + ${100 - m.a}% × ${isN(m.kos - m.d)} = ${isN(m.d)} + ${isN(m.kos - m.d - m.s)} = ${isRM(m.own)}`] }, m), { fig: isBarFig(m.kos, [[m.d, `Deduktibel: ${isRM(m.d)}`, 'rd'], [m.kos - m.d - m.s, `${100 - m.a}% pemegang polisi`, 'am'], [m.s, `${m.a}% syarikat insurans`, 'gr']], `Kos rawatan ${isRM(m.kos)}`) });
};
IS.koinsK = (r, i) => {
  const nama = r.p(ISNAMA), kind = (i == null ? r.i(0, 2) : i) % 3, h = r.p(ISHARTA);
  if (kind === 0) {
    // jumlah kerugian (total loss) – pampasan terhad kepada jumlah dibeli
    const v = r.i(20, 60) * 10000, p = 80, need = v * 0.8, beli = need * r.p([1, 3, 4]) / 4 || need, d = r.p([1000, 2000]);
    const raw = beli / need * v - d, pay = Math.min(raw, beli);
    const q = `${h[0]} milik ${nama} bernilai ${isRM(v)} diinsuranskan sebanyak ${isRM(beli)}. Polisi mempunyai fasal ko-insurans ${p}% dan deduktibel ${isRM(d)}. ${h[2]} musnah sepenuhnya dalam kebakaran (kerugian ${isRM(v)}). Hitung pampasan yang diterima dan kerugian yang ditanggung sendiri oleh ${nama}.`;
    const w = [`Perlu dibeli = ${p}% × ${isN(v)} = ${isRM(need)}`, beli < need ? `Pampasan = (${isN(beli)} ÷ ${isN(need)}) × ${isN(v)} − ${isN(d)} = ${isRM(raw)}` : `Insurans mencukupi: ${isN(v)} − ${isN(d)} = ${isRM(raw)}`];
    if (raw > beli) w.push(`Pampasan tidak boleh melebihi jumlah insurans dibeli, ${isRM(beli)}`);
    w.push(`Ditanggung ${nama} = ${isN(v)} − ${isN(pay)} = ${isRM(v - pay)}`);
    return GEN_LQ('koinsK', { q, ans: `Pampasan ${isRM(pay)}; ditanggung sendiri ${isRM(v - pay)}`, work: w });
  }
  if (kind === 1) {
    // cari jumlah insurans dibeli daripada pampasan
    const o = isKoins(r, false);
    const q = `${h[0]} milik ${nama} bernilai ${isRM(o.v)} diinsuranskan di bawah polisi dengan fasal ko-insurans ${o.p}% dan deduktibel ${isRM(o.d)}. Bagi kerugian ${isRM(o.L)}, syarikat insurans membayar pampasan ${isRM(o.pay)}. Hitung jumlah insurans yang telah dibeli oleh ${nama}.`;
    return GEN_LQ('koinsK', { q, ans: isRM(o.beli), work: [`Perlu dibeli = ${o.p}% × ${isN(o.v)} = ${isRM(o.need)}`, `(x ÷ ${isN(o.need)}) × ${isN(o.L)} − ${isN(o.d)} = ${isN(o.pay)}`, `(x ÷ ${isN(o.need)}) × ${isN(o.L)} = ${isN(o.pay + o.d)}`, `x = ${isN(o.pay + o.d)} × ${isN(o.need)} ÷ ${isN(o.L)} = ${isRM(o.beli)}`] });
  }
  // perubatan: had tahunan / dua rawatan
  const m1 = isMed(r), extra = r.i(10, 80) * 100, s2 = extra * m1.a / 100;
  const q = `Polisi perubatan ${nama}: deduktibel ${isRM(m1.d)} setahun dan ko-insurans ${m1.a}/${100 - m1.a}. Dalam setahun, dia menjalani dua rawatan: ${isRM(m1.kos)} dan kemudian ${isRM(extra)}. Deduktibel hanya dikenakan sekali setahun. Hitung jumlah yang ditanggung sendiri oleh ${nama} bagi tahun itu.`;
  const own = m1.own + extra - s2;
  return GEN_LQ('koinsK', { q, ans: isRM(own), work: [`Rawatan 1: syarikat = ${m1.a}% × (${isN(m1.kos)} − ${isN(m1.d)}) = ${isRM(m1.s)}; ${nama} = ${isRM(m1.own)}`, `Rawatan 2 (tiada deduktibel): syarikat = ${m1.a}% × ${isN(extra)} = ${isRM(s2)}; ${nama} = ${isRM(extra - s2)}`, `Jumlah ditanggung = ${isN(m1.own)} + ${isN(extra - s2)} = ${isRM(own)}`] });
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '3.1.1': { m: [() => IS.istilah(isRG), () => IS.jenis(isRG), () => IS.motor(isRG)], s: [() => IS.pihak(isRG)], k: [() => IS.kemalangan(isRG)] },
  '3.1.2': { m: [() => IS.hayat(isRG), () => IS.asas(isRG), () => IS.ncd(isRG)], s: [() => IS.hayatJ(isRG), () => IS.komp(isRG)], k: [() => IS.bajet(isRG)] },
  '3.1.3': { m: [() => IS.deduk(isRG), () => IS.perlu(isRG), () => IS.perubatan(isRG)], s: [() => IS.koins(isRG), () => IS.medPenuh(isRG)], k: [() => IS.koinsK(isRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {
  istilah: () => IS.istilah(isRW), jenis: () => IS.jenis(isRW), motor: () => IS.motor(isRW), pihak: () => IS.pihak(isRW), kemalangan: i => IS.kemalangan(isRW, i),
  hayat: () => IS.hayat(isRW), asas: () => IS.asas(isRW), ncd: () => IS.ncd(isRW), hayatJ: () => IS.hayatJ(isRW), komp: () => IS.komp(isRW), bajet: i => IS.bajet(isRW, i),
  deduk: () => IS.deduk(isRW), perlu: () => IS.perlu(isRW), perubatan: () => IS.perubatan(isRW), koins: () => IS.koins(isRW), medPenuh: () => IS.medPenuh(isRW), koinsK: i => IS.koinsK(isRW, i)
};
const WSPLAN = {
  '3.1.1': [['m', 'istilah', 6], ['m', 'jenis', 6], ['m', 'motor', 6], ['s', 'pihak', 9], ['k', 'kemalangan', 3]],
  '3.1.2': [['m', 'hayat', 6], ['m', 'asas', 6], ['m', 'ncd', 6], ['s', 'hayatJ', 5], ['s', 'komp', 4], ['k', 'bajet', 3]],
  '3.1.3': [['m', 'deduk', 6], ['m', 'perlu', 6], ['m', 'perubatan', 6], ['s', 'koins', 5], ['s', 'medPenuh', 4], ['k', 'koinsK', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function isOpts(ans, cands) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c) || /NaN|undefined/.test(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const isMoneyOpts = (v, alts, f) => { f = f || isRM2; const c = alts.map(isR2).filter(x => x > 0 && x !== isR2(v)); for (let k = 1; c.length < 8; k++) c.push(isR2(v + k * 10)); return isOpts(f(v), c.map(f)); };
const isMcq = (q, o, fig) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const CQGEN = {
  istilah: () => { const t = pick(ISTILAH); return isMcq(`${vcap(t[1])} dipanggil`, isOpts(vcap(t[0]), ISTILAH.map(x => vcap(x[0])))); },
  jenis: L => {
    if (L === 0) { const j = pick(ISJENIS); return isMcq(`Insurans yang sesuai untuk ${j[0]} ialah`, isOpts(vcap(j[1]), ISJENIS.map(x => vcap(x[1])))); }
    const k = pick(ISKEJ); return isMcq(`Polisi motor paling murah yang melindungi ${k[0]} ialah`, isOpts(vcap(ISPOL[k[1]]), ISPOL.map(vcap).concat(['Insurans perjalanan'])));
  },
  hayat: L => {
    const nm = ri(2, 30) * 10000, k = pick([1.10, 1.24, 1.33, 1.48, 1.76, 2.15, 2.31]), p = isR2(nm / 1000 * k);
    return isMcq(`Nilai muka ${isRM(nm)}, kadar ${isRM2(k)} per RM1 000. Premium tahunan ialah`, isMoneyOpts(p, [nm / 100 * k, nm / 10000 * k, p * 12, p / 12, p + k * 10]));
  },
  motor: L => {
    if (L === 0) { const b = isR2(ri(500, 1500) + 0.8), rr = pick([25, 30, 45, 55]), p = isR2(b * (1 - rr / 100)); return isMcq(`Premium asas ${isRM2(b)}, NCD ${rr}%. Premium dibayar ialah`, isMoneyOpts(p, [b * rr / 100, b + b * rr / 100, b - rr, b * 0.75])); }
    const cc = pick([1298, 1496, 1798, 1998]), nilai = ri(20, 90) * 1000, b = isAsas(cc, nilai), t = isTarif(cc);
    return isMcq(`Premium asas komprehensif kereta ${isN(cc)} cc diinsuranskan ${isRM(nilai)} ialah (rujuk jadual)`, isMoneyOpts(b, [t[2] + nilai / 1000 * 26, nilai / 1000 * 26, t[2] * nilai / 1000, b * 0.75, ISTARIF[0][2] + (nilai - 1000) / 1000 * 26]), isTarifFig());
  },
  deduktibel: L => {
    if (L === 0) { const d = pick([300, 500, 1000, 2000]), Lx = d + ri(5, 60) * 100; return isMcq(`Kerugian ${isRM(Lx)}, deduktibel ${isRM(d)}. Pampasan ialah`, isMoneyOpts(Lx - d, [Lx + d, Lx, d, Lx - 2 * d], isRM)); }
    const m = isMed(isRG); return isMcq(`Kos rawatan ${isRM(m.kos)}, deduktibel ${isRM(m.d)}, ko-insurans ${m.a}/${100 - m.a}. Syarikat membayar`, isMoneyOpts(m.s, [m.kos * m.a / 100, m.own, m.kos * m.a / 100 - m.d, m.kos - m.d], isRM));
  },
  koins: L => {
    if (L === 0) { const v = ri(15, 80) * 10000, p = pick([75, 80, 90]); return isMcq(`Harta bernilai ${isRM(v)}, ko-insurans ${p}%. Jumlah insurans perlu dibeli ialah`, isMoneyOpts(v * p / 100, [v * (100 - p) / 100, v, v * p / 1000, v - p * 100], isRM)); }
    const o = isKoins(isRG, false); return isMcq(`Nilai ${isRM(o.v)}, ko-insurans ${o.p}%, dibeli ${isRM(o.beli)}, deduktibel ${isRM(o.d)}, kerugian ${isRM(o.L)}. Pampasan ialah`, isMoneyOpts(o.pay, [o.L - o.d, o.beli / o.v * o.L - o.d, o.beli / o.need * (o.L - o.d), o.beli / o.need * o.L], isRM));
  }
};
const CQT = { istilah: 'Istilah insurans', jenis: 'Jenis insurans', hayat: 'Premium hayat', motor: 'Premium motor', deduktibel: 'Deduktibel', koins: 'Ko-insurans' };
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return CQGEN[pick(pool.length ? pool : Object.keys(CQT))](Math.max(0, Math.min(2, level | 0)));
}
function gq(level) {
  const pool = level === 0 ? ['istilah', 'jenis', 'hayat', 'deduktibel', 'koins'] : Object.keys(CQT);
  return CQGEN[pick(pool)](level | 0);
}
