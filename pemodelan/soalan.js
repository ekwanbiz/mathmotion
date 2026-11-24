'use strict';
/* =================== PEMODELAN · SOALAN BAB 8 PEMODELAN MATEMATIK (Tingkatan 5) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Semua nama global berawalan "pm" / "PM".

/* =================== pembantu =================== */
const pmRG = { i: (a, b) => ri(a, b), p: a => pick(a) };
const pmRW = { i: (a, b) => wri(a, b), p: a => wpick(a) };
// nombor kemas: 2 t.p. paling banyak, ruang ribuan (6 400)
const pmN = v => {
  let r = Math.round(v * 100) / 100; if (Object.is(r, -0)) r = 0;
  const [a, b] = String(Math.abs(r)).split('.');
  const s = a.length > 4 ? a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : a;
  return (r < 0 ? '−' : '') + s + (b ? '.' + b : '');
};
const pmRM = v => 'RM' + pmN(v);
const pmD = v => String(+v.toFixed(4));
const PML = ['Kenal pasti dan definisikan masalah', 'Membuat andaian dan mengenal pasti pemboleh ubah', 'Mengaplikasikan matematik untuk menyelesaikan masalah', 'Menentusahkan dan menafsir penyelesaian dalam konteks masalah', 'Memurnikan (memperhalusi) model matematik', 'Melaporkan dapatan'];
const PMLS = ['Kenal pasti masalah', 'Andaian & pemboleh ubah', 'Aplikasi matematik', 'Tentusahkan & tafsir', 'Perhalusi model', 'Laporkan dapatan'];
// aktiviti → langkah
const PMACT = [
  [0, 'Ahli kumpulan berbincang tentang apa yang perlu dicari, iaitu kos minimum untuk lawatan sekolah'], [0, 'Murid menulis soalan utama: “Berapakah bilangan bas yang diperlukan?”'], [0, 'Murid mengenal pasti maklumat yang diberi dan maklumat yang tidak diketahui dalam masalah'],
  [1, 'Murid menganggap harga petrol tidak berubah sepanjang bulan itu'], [1, 'Murid menetapkan t sebagai masa (jam) dan C sebagai kos (RM)'], [1, 'Murid mengabaikan rintangan udara semasa bola dilontar'],
  [2, 'Murid membina persamaan C = 4t + 10 dan menyelesaikannya'], [2, 'Murid melukis graf dan mencari titik maksimum parabola'], [2, 'Murid menggantikan t = 5 ke dalam N = 300(2ᵗ) untuk mengira N'],
  [3, 'Murid membandingkan nilai daripada model dengan data sebenar yang dikumpul'], [3, 'Murid menyemak sama ada jawapan 2.5 orang pekerja munasabah'], [3, 'Murid menyemak bahawa masa yang diperoleh bukan nilai negatif'],
  [4, 'Model tidak sepadan dengan data, jadi murid menambah caj perkhidmatan ke dalam persamaan'], [4, 'Murid menukar model linear kepada model eksponen kerana data bertambah secara berganda'], [4, 'Murid mengubah andaian “tiada diskaun” kerana keadaan sebenar ada diskaun'],
  [5, 'Murid membentangkan penyelesaian dan cadangan kepada pihak sekolah'], [5, 'Murid menulis laporan yang menerangkan model, jawapan dan batasan model'], [5, 'Murid menyampaikan dapatan menggunakan jadual dan graf kepada kelas']
];
// konteks pemboleh ubah: [situasi, pb tidak bersandar, pb bersandar]
const PMVAR = [
  ['Jumlah bayaran tambang teksi bergantung pada jarak perjalanan.', 'jarak perjalanan', 'jumlah bayaran tambang'],
  ['Bilangan bakteria dalam satu bekas bertambah mengikut masa.', 'masa', 'bilangan bakteria'],
  ['Tinggi sebiji bola yang dilontar berubah mengikut masa.', 'masa', 'tinggi bola'],
  ['Bil elektrik bulanan bergantung pada bilangan unit elektrik yang digunakan.', 'bilangan unit elektrik', 'bil elektrik'],
  ['Nilai sebuah kereta menyusut setiap tahun.', 'bilangan tahun', 'nilai kereta'],
  ['Jumlah simpanan Aiman bertambah setiap minggu.', 'bilangan minggu', 'jumlah simpanan'],
  ['Kos mencetak baju kelab bergantung pada bilangan baju yang dicetak.', 'bilangan baju', 'kos mencetak'],
  ['Isi padu air dalam tangki berkurang semasa paip dibuka.', 'masa paip dibuka', 'isi padu air']
];
// konteks linear: caj asas + kadar
const PMLIN = [
  { s: 'Sebuah kedai menyewakan basikal dengan caj asas RM{a} dan RM{b} bagi setiap jam.', x: 't', xu: 'jam', y: 'C', a: [3, 4, 5, 6], b: [2, 3, 4, 5], ask: 'masa sewa' },
  { s: 'Tambang teksi ialah RM{a} bagi caj permulaan dan RM{b} bagi setiap kilometer.', x: 'd', xu: 'km', y: 'T', a: [3, 4, 5], b: [1, 2, 3], ask: 'jarak perjalanan' },
  { s: 'Sebuah syarikat mencetak baju dengan caj reka bentuk RM{a} dan RM{b} bagi setiap helai baju.', x: 'n', xu: 'helai', y: 'K', a: [20, 30, 40, 50], b: [12, 15, 18, 20], ask: 'bilangan baju' },
  { s: 'Yuran gim ialah RM{a} untuk pendaftaran dan RM{b} bagi setiap bulan.', x: 'm', xu: 'bulan', y: 'Y', a: [30, 40, 50, 60], b: [25, 30, 35, 40], ask: 'bilangan bulan' },
  { s: 'Kos menyewa dewan ialah RM{a} untuk deposit dan RM{b} bagi setiap jam.', x: 'h', xu: 'jam', y: 'D', a: [50, 80, 100], b: [40, 45, 60], ask: 'tempoh sewa' }
];
const pmFill = (s, o) => s.replace(/\{(\w)\}/g, (m, k) => o[k]);

/* =================== QV: cara tanya =================== */
const QV = {
  langkah: [
    d => ({ q: `Dalam satu projek pemodelan matematik, ${d.act.toLowerCase()}. Nyatakan langkah proses pemodelan matematik yang terlibat.` }),
    d => ({ q: `“${d.act}.” Aktiviti ini ialah langkah yang mana dalam proses pemodelan matematik?` }),
    d => ({ q: `Kenal pasti langkah proses pemodelan matematik bagi aktiviti berikut: ${d.act}.` })
  ],
  urutan: [
    d => ({ q: `Dalam proses pemodelan matematik, apakah langkah yang ${d.arah} langkah “${d.L}”?` }),
    d => ({ q: `Nyatakan langkah proses pemodelan matematik yang ${d.arah} “${d.L}”.` }),
    d => ({ q: `Seorang murid baru sahaja ${d.arah === 'selepas' ? 'selesai' : 'akan memulakan'} langkah “${d.L}”. Apakah langkah ${d.arah === 'selepas' ? 'seterusnya' : 'sebelumnya'}?` })
  ],
  pbu: [
    d => ({ q: `${d.sit} Kenal pasti pemboleh ubah ${d.jenis} dalam situasi ini.` }),
    d => ({ q: `${d.sit} Apakah pemboleh ubah ${d.jenis} yang sesuai untuk membina model matematik?` }),
    d => ({ q: `Langkah “membuat andaian dan mengenal pasti pemboleh ubah”: ${d.sit} Nyatakan pemboleh ubah ${d.jenis}.` })
  ],
  binaLin: [
    d => ({ q: `${d.s} (a) Bina model matematik bagi ${d.y} (RM) dalam sebutan ${d.x} (${d.xu}). (b) Cari ${d.ask} jika ${d.y} = RM${d.Y}.` }),
    d => ({ q: `${d.s} Nyatakan satu andaian, bina model ${d.y} dalam sebutan ${d.x}, kemudian hitung ${d.x} apabila ${d.y} = ${d.Y}.` }),
    d => ({ q: `${d.s} Seorang pelanggan membayar RM${d.Y}. Dengan membina model matematik, tentukan ${d.ask} (${d.x}).` })
  ],
  tentusah: [
    d => ({ q: `Model ${d.model} digunakan untuk meramal ${d.ap}. Data sebenar menunjukkan ${d.ap} = ${d.obs} apabila ${d.cond}. Hitung nilai daripada model dan nyatakan sama ada model boleh diterima (beza ≤ ${d.tol}).` }),
    d => ({ q: `Tentusahkan model ${d.model}: apabila ${d.cond}, nilai sebenar ialah ${d.obs}. Adakah model ini boleh diterima jika beza yang dibenarkan ialah ${d.tol}?` }),
    d => ({ q: `Sekumpulan murid membina model ${d.model}. Data yang dikumpul: ${d.cond}, ${d.ap} = ${d.obs}. Dengan had beza ${d.tol}, perlukah model ini diperhalusi?` })
  ],
  kitaran: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Gunakan proses pemodelan matematik', 'Dengan menggunakan langkah pemodelan matematik') }),
    d => ({ q: d.q.replace('Gunakan proses pemodelan matematik', 'Selesaikan secara pemodelan matematik') })
  ],
  jenisData: [
    d => ({ q: `Jadual di bawah menunjukkan nilai ${d.Y} bagi beberapa nilai ${d.X}. Tentukan jenis model (linear, kuadratik atau eksponen) yang paling sesuai. Beri sebab.` }),
    d => ({ q: `Berdasarkan data dalam jadual, adakah hubungan antara ${d.X} dan ${d.Y} linear, kuadratik atau eksponen? Tunjukkan ujian anda.` }),
    d => ({ q: `Seorang murid mengumpul data seperti jadual di bawah. Pilih model matematik yang sesuai untuk data ini dan terangkan.` })
  ],
  nilaiLin: [
    d => ({ q: `${d.s} Model: ${d.model}. Hitung ${d.y} apabila ${d.x} = ${d.X}.` }),
    d => ({ q: `Gunakan model ${d.model} untuk meramal ${d.y} apabila ${d.x} = ${d.X}. (${d.s})` }),
    d => ({ q: `${d.s} Dengan model ${d.model}, berapakah ${d.y} jika ${d.x} = ${d.X}?` })
  ],
  nilaiEksp: [
    d => ({ q: `${d.s} Model: ${d.model}. Cari ${d.ap} selepas ${d.t} ${d.tu}.` }),
    d => ({ q: `Diberi model eksponen ${d.model}, dengan ${d.t0}. Hitung ${d.ap} apabila t = ${d.t}.` }),
    d => ({ q: `${d.s} Ramalkan ${d.ap} selepas ${d.t} ${d.tu} menggunakan model ${d.model}.` })
  ],
  kuad: [
    d => ({ q: `Tinggi, h m, sebiji bola selepas t saat dimodelkan oleh ${d.model}. Cari (a) tinggi maksimum bola, (b) masa bola mencecah tanah.` }),
    d => ({ q: `Sebiji bola dilontar ke atas. Tingginya ialah ${d.model}, dengan h dalam meter dan t dalam saat. Bilakah bola mencapai tinggi maksimum, berapakah tinggi itu, dan bilakah ia jatuh ke tanah?` }),
    d => ({ q: `Model ${d.model} menerangkan gerakan sebiji bola (h dalam m, t dalam s). Tentukan tinggi maksimum dan masa bola berada di udara.` })
  ],
  binaModel: [
    d => ({ q: `Jadual di bawah menunjukkan data ${d.ctx}. Kenal pasti jenis model dan bina model matematik bagi ${d.Y} dalam sebutan ${d.X}.` }),
    d => ({ q: `Berdasarkan jadual di bawah (${d.ctx}), bina model matematik yang sesuai. Seterusnya, ramalkan ${d.Y} apabila ${d.X} = ${d.xp}.`, ans: d.ans + `; apabila ${d.X} = ${d.xp}, ${d.Y} = ${d.yp}`, work: d.work.concat([`${d.Y} = ${d.yp} apabila ${d.X} = ${d.xp}`]) }),
    d => ({ q: `Data ${d.ctx} diberikan dalam jadual. Tulis model matematik yang mewakili data itu.` })
  ],
  masalah: [
    d => ({ q: d.q }),
    d => ({ q: d.q.replace('Gunakan pemodelan matematik untuk', 'Bina model matematik dan') }),
    d => ({ q: d.q.replace('Gunakan pemodelan matematik untuk', 'Dengan pemodelan matematik,') })
  ]
};

/* =================== penjana teras =================== */
const PM = {};
PM.langkah = r => {
  const [i, act] = r.p(PMACT);
  return GEN_LQ('langkah', { act, ans: `Langkah ${i + 1}: ${PML[i]}`, work: ['Enam langkah: ' + PMLS.map((s, j) => `${j + 1}. ${s}`).join(', ') + '.', `Aktiviti ini sepadan dengan langkah ${i + 1}: ${PML[i]}.`] });
};
PM.urutan = r => {
  const after = r.p([true, false]), i = after ? r.i(0, 4) : r.i(1, 5), j = after ? i + 1 : i - 1;
  return GEN_LQ('urutan', { L: PMLS[i], arah: after ? 'selepas' : 'sebelum', ans: PML[j], work: ['Urutan: ' + PMLS.map((s, k) => `${k + 1}. ${s}`).join(' → '), `Langkah ${i + 1} ${after ? 'diikuti oleh' : 'didahului oleh'} langkah ${j + 1}.`] });
};
PM.pbu = r => {
  const [sit, xi, yi] = r.p(PMVAR), dep = r.p([true, false]);
  return GEN_LQ('pbu', { sit, jenis: dep ? 'bersandar' : 'tidak bersandar (pemboleh ubah bebas)', ans: dep ? yi : xi, work: [`Pemboleh ubah tidak bersandar: ${xi} (nilai yang berubah dengan bebas).`, `Pemboleh ubah bersandar: ${yi} (bergantung pada ${xi}).`] });
};
function pmLinData(r) {
  const c = r.p(PMLIN), a = r.p(c.a), b = r.p(c.b), X = r.i(3, 12), Y = a + b * X;
  return { c, a, b, X, Y, s: pmFill(c.s, { a, b }), model: `${c.y} = ${b}${c.x} + ${a}` };
}
PM.binaLin = r => {
  const L = pmLinData(r), c = L.c;
  return GEN_LQ('binaLin', {
    s: L.s, x: c.x, xu: c.xu, y: c.y, Y: L.Y, ask: c.ask,
    ans: `${L.model}; ${c.x} = ${L.X} ${c.xu}`,
    work: [`Andaian: kadar RM${L.b} tetap; tiada caj lain.`, `Pemboleh ubah: ${c.x} (${c.xu}), ${c.y} (RM).`, `Model: ${L.model}`, `${L.Y} = ${L.b}${c.x} + ${L.a} → ${L.b}${c.x} = ${L.Y - L.a} → ${c.x} = ${L.X}`, `Tentusahkan: ${L.b}(${L.X}) + ${L.a} = ${L.Y} ✓`]
  });
};
PM.tentusah = r => {
  const kind = r.p(['lin', 'eksp']);
  let model, ap, cond, val, work0;
  if (kind === 'lin') {
    const m = r.i(2, 9), c = r.i(5, 30), x = r.i(4, 15); val = m * x + c;
    model = `y = ${m}x + ${c}`; ap = 'y'; cond = `x = ${x}`; work0 = `Model: y = ${m}(${x}) + ${c} = ${val}`;
  } else {
    const a = r.p([50, 100, 200, 300]), b = r.p([2, 3]), t = r.i(2, 4); val = a * b ** t;
    model = `N = ${a}(${b}ᵗ)`; ap = 'N'; cond = `t = ${t}`; work0 = `Model: N = ${a} × ${b}${'⁰¹²³⁴'[t]} = ${pmN(val)}`;
  }
  const tol = Math.max(2, Math.round(val * 0.05)), ok = r.p([true, false]);
  const diff = ok ? r.i(1, tol) : tol + r.i(2, Math.max(3, tol));
  const obs = r.p([1, -1]) === 1 ? val + diff : val - diff;
  return GEN_LQ('tentusah', { model, ap, cond, obs: pmN(obs), tol: pmN(tol), ans: `Nilai model = ${pmN(val)}; beza = ${pmN(diff)}; ${ok ? 'model boleh diterima' : 'model perlu diperhalusi'}`, work: [work0, `Beza = |${pmN(obs)} − ${pmN(val)}| = ${pmN(diff)}`, ok ? `${pmN(diff)} ≤ ${pmN(tol)} → model boleh diterima.` : `${pmN(diff)} > ${pmN(tol)} → model tidak tepat; perhalusi andaian/model.`] });
};
const PMKIT = [
  r => { const p = r.p([8, 10, 12]), n = r.i(150, 320), k = r.p([40, 44, 48]), bus = Math.ceil((n + p) / k);
    return { q: `Gunakan proses pemodelan matematik: ${n} orang murid dan ${p} orang guru akan menyertai lawatan. Setiap bas boleh membawa ${k} orang. Berapakah bilangan bas minimum yang perlu disewa?`, ans: `${bus} buah bas`,
      work: [`Masalah: cari bilangan bas minimum.`, `Andaian: semua bas sama saiz; setiap tempat duduk boleh digunakan. Pemboleh ubah: b = bilangan bas.`, `Model: ${k}b ≥ ${n + p} → b ≥ ${pmN((n + p) / k)}`, `Tafsir: bilangan bas mesti nombor bulat, maka b = ${bus}.`, `Lapor: sewa ${bus} buah bas.`] }; },
  r => { const a = r.p([2, 3, 4]), b = r.p([5, 6, 8]), A = r.p([30, 40, 50]), B = r.p([10, 15, 20]);
    // pelan A: A + a·x, pelan B: B + b·x → sama apabila x = (A−B)/(b−a)
    let x = (A - B) / (b - a); if (!Number.isInteger(x)) { return PMKIT[0](r); }
    return { q: `Gunakan proses pemodelan matematik: Pelan telefon P mengenakan RM${A} sebulan dan RM${a} bagi setiap GB data. Pelan Q mengenakan RM${B} sebulan dan RM${b} bagi setiap GB. Bagi berapa GB data kedua-dua pelan sama kos, dan pelan manakah lebih jimat jika menggunakan ${x + 2} GB?`, ans: `${x} GB; pelan P lebih jimat bagi ${x + 2} GB`,
      work: [`Andaian: kadar tetap, tiada caj tersembunyi. Pemboleh ubah: g GB, kos RM.`, `Model: P = ${a}g + ${A}, Q = ${b}g + ${B}`, `${a}g + ${A} = ${b}g + ${B} → ${b - a}g = ${A - B} → g = ${x}`, `g = ${x + 2}: P = RM${a * (x + 2) + A}, Q = RM${b * (x + 2) + B}`, `Lapor: pelan P lebih jimat jika penggunaan melebihi ${x} GB.`] }; },
  r => { const a = r.p([100, 200, 500]), t = r.i(3, 6), N = a * 2 ** t;
    return { q: `Gunakan proses pemodelan matematik: Sebuah kolam mempunyai ${a} helai daun teratai. Bilangan daun berganda dua setiap minggu. Ramalkan bilangan daun selepas ${t} minggu dan nyatakan satu batasan model ini.`, ans: `${pmN(N)} helai; batasan: kolam terhad, pertumbuhan tidak boleh berganda selama-lamanya`,
      work: [`Andaian: kadar pertumbuhan tetap (ganda dua) dan ruang mencukupi.`, `Pemboleh ubah: t minggu, N helai daun.`, `Model: N = ${a}(2ᵗ)`, `N = ${a} × 2^${t} = ${a} × ${2 ** t} = ${pmN(N)}`, `Tentusahkan: kolam ada saiz terhad, jadi model perlu diperhalusi untuk tempoh panjang.`] }; }
];
PM.kitaran = (r, idx) => GEN_LQ('kitaran', (idx == null ? r.p(PMKIT) : PMKIT[idx % PMKIT.length])(r));

/* ---------- 8.1.2 ---------- */
function pmTable(X, Y, xs, ys) {
  const w = 110 + xs.length * 80, cell = (x, y, t, c) => `<text x="${x}" y="${y}" style="fill:var(--${c})" font-size="20" font-weight="700" font-family="Space Grotesk, sans-serif" text-anchor="middle" dominant-baseline="central">${t}</text>`;
  let s = `<rect x="2" y="2" width="${w - 4}" height="116" rx="12" style="fill:var(--sf);stroke:var(--bd)" stroke-width="2"/><line x1="2" y1="60" x2="${w - 2}" y2="60" style="stroke:var(--bd)" stroke-width="2"/><line x1="100" y1="2" x2="100" y2="118" style="stroke:var(--bd)" stroke-width="2"/>`;
  s += cell(51, 31, X, 'tr') + cell(51, 89, Y, 'pk');
  xs.forEach((v, i) => { s += cell(140 + i * 80, 31, v, 'tx') + cell(140 + i * 80, 89, pmN(ys[i]), 'tx'); });
  return `<svg viewBox="0 0 ${w} 120" style="max-width:${w}px;width:100%" role="img" aria-label="Jadual nilai ${X} dan ${Y}">${s}</svg>`;
}
const pmDiff = a => a.slice(1).map((v, i) => v - a[i]);
function pmSeries(r, kind) {
  const xs = [0, 1, 2, 3, 4];
  if (kind === 'linear') { const m = r.p([2, 3, 4, 5, 6, 7, 8, -3, -4]), c = r.i(5, 40); return { xs, ys: xs.map(x => m * x + c), model: `y = ${m}x + ${c}`, m, c }; }
  if (kind === 'kuadratik') { const a = r.p([1, 2, 3]), b = r.i(0, 4), c = r.i(1, 10); return { xs, ys: xs.map(x => a * x * x + b * x + c), model: `y = ${a === 1 ? '' : a}x² ${b ? `+ ${b}x ` : ''}+ ${c}`, a, b, c }; }
  const a = r.p([2, 3, 4, 5, 10]), b = r.p([2, 3]); return { xs, ys: xs.map(x => a * b ** x), model: `y = ${a}(${b}ˣ)`, a, b };
}
PM.jenisData = r => {
  const kind = r.p(['linear', 'kuadratik', 'eksponen']), S = pmSeries(r, kind), d1 = pmDiff(S.ys), d2 = pmDiff(d1);
  const rat = S.ys.slice(1).map((v, i) => pmN(v / S.ys[i]));
  const work = [`Beza pertama: ${d1.map(pmN).join(', ')}`];
  if (kind === 'linear') work.push('Beza pertama tetap → model linear.');
  else if (kind === 'kuadratik') work.push(`Beza kedua: ${d2.map(pmN).join(', ')} (tetap) → model kuadratik.`);
  else work.push(`Nisbah berturutan: ${rat.join(', ')} (tetap) → model eksponen.`);
  return GEN_LQ('jenisData', { X: 'x', Y: 'y', ans: `Model ${kind}`, work }, { fig: pmTable('x', 'y', S.xs, S.ys) });
};
PM.nilaiLin = r => {
  const L = pmLinData(r), c = L.c;
  return GEN_LQ('nilaiLin', { s: L.s, model: L.model, x: c.x, y: c.y, X: L.X, ans: `${c.y} = ${pmRM(L.Y)}`, work: [`${L.model}`, `${c.y} = ${L.b}(${L.X}) + ${L.a} = ${L.b * L.X} + ${L.a} = ${L.Y}`] });
};
const PMEKS = [
  { s: 'Populasi bakteria bermula dengan {a} dan berganda dua setiap jam.', a: [100, 150, 200, 300, 500], b: 2, ap: 'bilangan bakteria', tu: 'jam', v: 'N', t: [3, 4, 5, 6] },
  { s: 'Bilangan pengikut sebuah akaun media sosial ialah {a} dan menjadi tiga kali ganda setiap bulan.', a: [20, 40, 50, 100], b: 3, ap: 'bilangan pengikut', tu: 'bulan', v: 'P', t: [2, 3, 4] },
  { s: 'Jisim {a} mg sejenis bahan radioaktif berkurang separuh setiap hari.', a: [640, 800, 960, 1280], b: 0.5, ap: 'jisim bahan', tu: 'hari', v: 'M', t: [2, 3, 4] },
  { s: 'Bilangan sel yeast ialah {a} dan bertambah empat kali ganda setiap jam.', a: [10, 25, 50], b: 4, ap: 'bilangan sel', tu: 'jam', v: 'N', t: [2, 3] }
];
PM.nilaiEksp = r => {
  const c = r.p(PMEKS), a = r.p(c.a), t = r.p(c.t), val = a * c.b ** t, bs = c.b === 0.5 ? '½' : '' + c.b;
  const model = `${c.v} = ${a}(${bs})ᵗ`;
  return GEN_LQ('nilaiEksp', { s: pmFill(c.s, { a }), model, ap: c.ap, t, tu: c.tu, t0: `${c.v} = ${a} apabila t = 0`, ans: `${c.v} = ${pmN(val)}`, work: [`${model}`, `${c.v} = ${a} × (${bs})^${t} = ${a} × ${pmD(c.b ** t)} = ${pmN(val)}`] });
};
PM.kuad = r => {
  // h = −5t² + vt ; v = 5T  → mendarat T, puncak T/2, hmax = 5(T/2)²
  const T = r.p([2, 4, 6, 8]), v = 5 * T, tm = T / 2, hm = -5 * tm * tm + v * tm;
  const model = `h = −5t² + ${v}t`;
  return GEN_LQ('kuad', { model, ans: `Tinggi maksimum ${pmN(hm)} m (t = ${pmN(tm)} s); mencecah tanah pada t = ${T} s`, work: [`Andaian: rintangan udara diabaikan.`, `Paksi simetri: t = −${v} ÷ (2 × −5) = ${pmN(tm)}`, `h = −5(${pmN(tm)})² + ${v}(${pmN(tm)}) = ${pmN(hm)}`, `h = 0: −5t(t − ${T}) = 0 → t = 0 atau t = ${T}`, `Tafsir: bola mendarat pada t = ${T} s.`] });
};
const PMBM = [
  { ctx: 'jumlah bayaran sewa (RM) melawan bilangan hari', X: 'x', Y: 'y', kind: 'linear' },
  { ctx: 'bilangan bakteria melawan masa (jam)', X: 'x', Y: 'y', kind: 'eksponen' },
  { ctx: 'isi padu air (liter) dalam tangki melawan masa (minit)', X: 'x', Y: 'y', kind: 'linear' },
  { ctx: 'bilangan pengguna aplikasi melawan bulan', X: 'x', Y: 'y', kind: 'eksponen' }
];
PM.binaModel = r => {
  const c = r.p(PMBM); let S = pmSeries(r, c.kind);
  if (c.ctx.startsWith('isi padu')) { const m = -r.p([5, 10, 15, 20]), k = r.p([200, 300, 400]); S = { xs: [0, 1, 2, 3, 4], ys: [0, 1, 2, 3, 4].map(x => m * x + k), model: `y = ${m}x + ${k}`, m, c: k }; }
  else if (c.kind === 'linear' && S.m < 0) S = pmSeries({ i: r.i, p: () => 5 }, 'linear');
  const xp = 6, yp = c.kind === 'linear' ? S.m * xp + S.c : S.a * S.b ** xp;
  const work = c.kind === 'linear'
    ? [`Beza pertama tetap = ${S.m} → model linear y = mx + c.`, `c = nilai y apabila x = 0 = ${S.c}; m = ${S.m}.`, S.model]
    : [`Nisbah berturutan tetap = ${S.b} → model eksponen y = a(bˣ).`, `a = nilai y apabila x = 0 = ${S.a}; b = ${S.b}.`, S.model];
  return GEN_LQ('binaModel', { ctx: c.ctx, X: 'x', Y: 'y', xp, yp: pmN(yp), ans: `Model ${c.kind}: ${S.model}`, work }, { fig: pmTable('x', 'y', S.xs, S.ys) });
};
const PMMAS = [
  r => { const P = r.p([40000, 50000, 60000, 80000]), t = r.i(2, 4), v = P * 0.8 ** t;
    return { q: `Gunakan pemodelan matematik untuk menyelesaikan: Harga sebuah kereta baharu ialah RM${pmN(P)}. Nilainya menyusut 20% setiap tahun. Bina model nilai kereta, V, selepas t tahun dan cari nilainya selepas ${t} tahun.`, ans: `V = ${pmN(P)}(0.8ᵗ); ${pmRM(v)}`,
      work: [`Andaian: kadar susut tetap 20% setahun.`, `Setiap tahun nilai tinggal 80% = 0.8 → model eksponen.`, `V = ${pmN(P)}(0.8ᵗ)`, `t = ${t}: V = ${pmN(P)} × ${pmD(0.8 ** t)} = ${pmN(v)}`, `Lapor: nilai kereta ${pmRM(v)}.`] }; },
  r => { const k = r.p([1, 2]), b = r.p([20, 30, 40]) * k, a = b / 10, hm = b * b / (4 * a), xm = b / (2 * a);
    // untung U = −a x² + b x (RM ratus), x = harga
    return { q: `Gunakan pemodelan matematik untuk menyelesaikan: Keuntungan harian sebuah gerai, U (RM), apabila harga sebiji burger ialah RM x dimodelkan oleh U = −${pmN(a)}x² + ${b}x. Cari harga burger yang memberi keuntungan maksimum dan keuntungan itu.`, ans: `Harga RM${pmN(xm)}; keuntungan maksimum RM${pmN(hm)}`,
      work: [`Model kuadratik dengan a < 0 → graf ada titik maksimum.`, `x = −b ÷ 2a = −${b} ÷ (2 × −${pmN(a)}) = ${pmN(xm)}`, `U = −${pmN(a)}(${pmN(xm)})² + ${b}(${pmN(xm)}) = ${pmN(hm)}`, `Tafsir: harga RM${pmN(xm)} munasabah untuk sebiji burger.`] }; },
  r => { const L = r.p([600, 800, 900, 1200]), q = r.p([20, 30, 40, 50]), t = L / q;
    return { q: `Gunakan pemodelan matematik untuk menyelesaikan: Sebuah tangki mengandungi ${L} liter air. Air dialirkan keluar dengan kadar tetap ${q} liter seminit. Bina model isi padu air, V, selepas t minit dan cari masa tangki menjadi kosong.`, ans: `V = ${L} − ${q}t; ${pmN(t)} minit`,
      work: [`Andaian: kadar aliran tetap; tiada air masuk.`, `Model linear: V = ${L} − ${q}t`, `V = 0: ${q}t = ${L} → t = ${pmN(t)}`, `Tentusahkan: ${L} − ${q}(${pmN(t)}) = 0 ✓`] }; }
];
PM.masalah = (r, idx) => GEN_LQ('masalah', (idx == null ? r.p(PMMAS) : PMMAS[idx % PMMAS.length])(r));

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '8.1.1': { m: [() => PM.langkah(pmRG), () => PM.urutan(pmRG), () => PM.pbu(pmRG)], s: [() => PM.binaLin(pmRG), () => PM.tentusah(pmRG)], k: [() => PM.kitaran(pmRG)] },
  '8.1.2': { m: [() => PM.jenisData(pmRG), () => PM.nilaiLin(pmRG), () => PM.nilaiEksp(pmRG)], s: [() => PM.kuad(pmRG), () => PM.binaModel(pmRG)], k: [() => PM.masalah(pmRG)] }
};

/* =================== WG + WSPLAN =================== */
const WG = {
  langkah: () => PM.langkah(pmRW), urutan: () => PM.urutan(pmRW), pbu: () => PM.pbu(pmRW), binaLin: () => PM.binaLin(pmRW), tentusah: () => PM.tentusah(pmRW), kitaran: i => PM.kitaran(pmRW, i),
  jenisData: () => PM.jenisData(pmRW), nilaiLin: () => PM.nilaiLin(pmRW), nilaiEksp: () => PM.nilaiEksp(pmRW), kuad: () => PM.kuad(pmRW), binaModel: () => PM.binaModel(pmRW), masalah: i => PM.masalah(pmRW, i)
};
const WSPLAN = {
  '8.1.1': [['m', 'langkah', 6], ['m', 'urutan', 6], ['m', 'pbu', 6], ['s', 'binaLin', 5], ['s', 'tentusah', 4], ['k', 'kitaran', 3]],
  '8.1.2': [['m', 'jenisData', 6], ['m', 'nilaiLin', 6], ['m', 'nilaiEksp', 6], ['s', 'kuad', 4], ['s', 'binaModel', 5], ['k', 'masalah', 3]]
};

/* =================== GAMES: pilih jawapan =================== */
function pmOpts(ans, cands) {
  const seen = new Set([ans]), w = [];
  for (const c of shuffle(cands)) { if (c == null || seen.has(c)) continue; seen.add(c); w.push(c); if (w.length === 3) break; }
  const opts = shuffle([ans, ...w]);
  return { opts, c: opts.indexOf(ans) };
}
const pmMcq = (q, o, fig) => ({ type: 'mcq', q, fig: fig || '', opts: o.opts, c: o.c });
const CQGEN = {
  langkah: () => { const [i, act] = pick(PMACT); return pmMcq(`“${act}.” Langkah pemodelan manakah ini?`, pmOpts(PMLS[i], PMLS)); },
  jenis: () => { const kind = pick(['linear', 'kuadratik', 'eksponen']), S = pmSeries(pmRG, kind); return pmMcq(`Data y bagi x = 0, 1, 2, 3, 4: ${S.ys.map(pmN).join(', ')}. Model yang paling sesuai ialah`, pmOpts('Model ' + kind, ['Model linear', 'Model kuadratik', 'Model eksponen', 'Tiada model'])); },
  nilai: () => {
    if (Math.random() < .5) { const L = pmLinData(pmRG); return pmMcq(`${L.s} Model ${L.model}. Cari ${L.c.y} apabila ${L.c.x} = ${L.X}.`, pmOpts(pmRM(L.Y), [pmRM(L.Y + L.b), pmRM(L.Y - L.a), pmRM((L.a + L.b) * L.X), pmRM(L.Y + L.a), pmRM(L.b * L.X)])); }
    const a = pick([100, 200, 300, 500]), b = pick([2, 3]), t = ri(2, 4), v = a * b ** t;
    return pmMcq(`Model N = ${a}(${b}ᵗ). Cari N apabila t = ${t}.`, pmOpts(pmN(v), [pmN(a * b * t), pmN(v / b), pmN(v * b), pmN((a * b) ** t > 1e7 ? a * b * t + a : (a * b) ** t), pmN(a + b ** t)]));
  }
};
const CQT = { langkah: 'Langkah pemodelan', jenis: 'Jenis model', nilai: 'Guna model' };
function pmCqMake(ty) { return (CQGEN[ty] || CQGEN.langkah)(); }
function gq(level) {
  const pool = level === 0 ? ['langkah', 'langkah', 'jenis', 'nilai'] : level === 1 ? ['langkah', 'jenis', 'nilai', 'nilai'] : ['jenis', 'nilai', 'nilai'];
  return pmCqMake(pick(pool));
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return pmCqMake(pick(pool.length ? pool : Object.keys(CQT)));
}
