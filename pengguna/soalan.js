'use strict';
/* =================== WANGKU · SOALAN BAB 3 MATEMATIK PENGGUNA (Tingkatan 3) =================== */
// QV: cara tanya · GEN: Latihan Kelas · WG/WSPLAN: bank Lembaran Kerja · gq: Cabaran 60 Saat · CQT/cq: game kelas
// Dimuat selepas teras/asas.js. Semua nama global di sini berawalan "mp" / "MP" supaya tidak bertembung dengan teras.
// Peraturan kad kredit (dipermudah ikut buku teks): bayaran minimum = 5% baki atau RM50 (yang lebih tinggi);
// caj lewat = 1% baki (min RM10, maks RM100); caj kewangan = kadar setahun ÷ 12 ke atas baki yang tidak dibayar.

/* =================== pembantu nombor & wang =================== */
const mpR2 = x => Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * 100) / 100;
const mpGrp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
// nombor: bulat tanpa perpuluhan, jika tidak 2 t.p. (f = paksa 2 t.p.)
const mpN = (x, f) => { x = mpR2(x); const neg = x < 0; x = Math.abs(x); let s; if (Number.isInteger(x) && !f) s = mpGrp(String(x)); else { const [a, b] = x.toFixed(2).split('.'); s = mpGrp(a) + '.' + b; } return (neg ? '−' : '') + s; };
const mpRM = (x, f) => { x = mpR2(x); return (x < 0 ? '−' : '') + 'RM' + mpN(Math.abs(x), f); };
const mpRMf = x => mpRM(x, !Number.isInteger(mpR2(x)));            // 2 t.p. jika ada sen
const mpD = x => String(+(+x).toFixed(6));                          // perpuluhan kemas (0.035)
const mpPc = r => mpD(r) + '%';
const mpRn = (r, n) => { const v = r / 100 / n; return Math.abs(v * 1e5 - Math.round(v * 1e5)) < 1e-6 ? mpD(v) : `${mpD(r / 100)}/${n}`; };  // r/n kemas
const mpSen = c => (c < 100 ? `${c} sen` : mpRM(c / 100, true));     // c dalam sen
// rawak: mpRG untuk Latihan Kelas / games, mpRW (berbenih) untuk Lembaran Kerja
const mpRG = { i: (a, b) => ri(a, b), p: a => pick(a), f: () => Math.random() };
const mpRW = { i: (a, b) => wri(a, b), p: a => wpick(a), f: () => WR() };

/* =================== peraturan & rumus =================== */
const mpSimple = (P, r, t) => mpR2(P * r / 100 * t);
const mpComp = (P, r, n, t) => mpR2(P * Math.pow(1 + r / 100 / n, n * t));
const mpMin = B => (B <= 50 ? B : Math.max(mpR2(B * 0.05), 50));
const mpLate = B => Math.min(Math.max(mpR2(B * 0.01), 10), 100);
const mpFC = (sisa, r) => mpR2(sisa * r / 100 / 12);
const MPKOMP = [[1, 'setiap tahun', 'tahunan'], [2, 'setiap 6 bulan', 'setengah tahunan'], [4, 'setiap suku tahun', 'suku tahunan'], [12, 'setiap bulan', 'bulanan']];
const MPBANK = ['Bank Delima', 'Bank Cempaka', 'Bank Teratai', 'Bank Melur', 'Bank Kenanga', 'Bank Seroja'];
const MPSAHAM = ['Syarikat Maju Jaya', 'Syarikat Sinar Timur', 'Syarikat Bumi Hijau', 'Syarikat Teknologi Cerdas', 'Syarikat Kelapa Emas'];
const MPDANA = ['Dana Amanah Wawasan', 'Dana Bestari', 'Dana Mutiara', 'Dana Harapan'];

/* =================== data bersama =================== */
// set purata kos seringgit yang kemas: [jumlah sebulan, [harga dalam sen × 3]]
const MPPKS = (() => {
  const out = [], A = [120, 150, 200, 240, 300, 360, 400, 450, 480, 500, 600];
  for (const a of A) for (let p1 = 50; p1 <= 300; p1 += 5) for (let p2 = 50; p2 <= 300; p2 += 5) for (let p3 = 50; p3 <= 300; p3 += 5) {
    if (p1 === p2 || p2 === p3 || p1 === p3) continue;
    const c = a * 100; if (c % p1 || c % p2 || c % p3) continue;
    const u = [c / p1, c / p2, c / p3], su = u[0] + u[1] + u[2];
    if ((3 * c) % su) continue;
    const avg = 3 * c / su, mean = (p1 + p2 + p3) / 3;
    if (Math.abs(mean - avg) < 2 || Math.max(...u) > 1500) continue;
    out.push([a, [p1, p2, p3]]);
  }
  return out;
})();
const MPBS1 = [
  ['Simpanan ialah wang lebihan yang disimpan untuk kegunaan masa hadapan.', true, 'Simpanan ialah wang lebihan yang disimpan di institusi kewangan untuk kegunaan masa hadapan.'],
  ['Pelaburan saham tidak mempunyai sebarang risiko.', false, 'Harga saham boleh turun, jadi pelaburan saham berisiko tinggi.'],
  ['Akaun simpanan mempunyai kecairan yang tinggi.', true, 'Wang dalam akaun simpanan boleh dikeluarkan dengan mudah dan cepat.'],
  ['Hartanah mempunyai kecairan yang tinggi kerana mudah dijual dengan segera.', false, 'Hartanah mengambil masa yang lama untuk dijual, maka kecairannya rendah.'],
  ['Biasanya, pelaburan yang berpotensi memberi pulangan tinggi mempunyai risiko yang tinggi.', true, 'Pulangan tinggi biasanya datang bersama risiko tinggi.'],
  ['Faedah mudah dikira ke atas prinsipal dan faedah terkumpul.', false, 'Faedah mudah dikira ke atas prinsipal sahaja; faedah kompaun dikira ke atas prinsipal dan faedah terkumpul.'],
  ['Bagi faedah yang dikompaun setiap suku tahun, nilai n ialah 4.', true, 'Setahun ada 4 suku tahun, maka n = 4.'],
  ['Dividen ialah salah satu bentuk pulangan pelaburan saham.', true, 'Pulangan saham boleh berupa dividen dan keuntungan modal.'],
  ['Strategi purata kos seringgit bermaksud membeli unit saham dalam bilangan yang sama setiap bulan.', false, 'Strategi ini melabur jumlah wang yang sama secara berkala, jadi bilangan unit berubah mengikut harga.'],
  ['Simpanan tetap memberi kadar faedah yang lebih tinggi daripada akaun simpanan biasa.', true, 'Wang simpanan tetap disimpan untuk tempoh tertentu, maka kadar faedahnya biasanya lebih tinggi.']
];
const MPBS2 = [
  ['Kredit membolehkan pengguna mendapatkan barang sekarang dan membayarnya kemudian.', true, 'Itulah maksud kredit.'],
  ['Pemegang kad kredit yang membayar baki penuh sebelum tarikh akhir tidak dikenakan caj kewangan.', true, 'Caj kewangan hanya dikenakan ke atas baki yang tidak dibayar.'],
  ['Membuat bayaran minimum akan menghapuskan semua caj kewangan.', false, 'Bayaran minimum hanya mengelakkan caj lewat bayaran; baki yang tidak dibayar masih dikenakan caj kewangan.'],
  ['Caj lewat bayaran dikenakan jika bayaran minimum tidak dibuat sebelum tarikh akhir.', true, 'Caj lewat bayaran dikenakan apabila bayaran minimum lewat atau tidak dibuat.'],
  ['Tempoh pinjaman yang lebih panjang menghasilkan jumlah faedah yang lebih rendah.', false, 'Faedah = Prt. Semakin besar t, semakin besar jumlah faedah.'],
  ['Tempoh pinjaman yang lebih panjang menghasilkan ansuran bulanan yang lebih rendah.', true, 'Jumlah bayaran balik dibahagi dengan lebih banyak bulan, maka ansuran lebih rendah (walaupun faedah lebih tinggi).'],
  ['Pengguna yang bijak berbelanja menggunakan kad kredit sehingga had kredit setiap bulan.', false, 'Pengguna bijak berbelanja mengikut kemampuan dan tidak menggunakan kad sehingga had kredit.'],
  ['Hutang ialah jumlah wang yang wajib dibayar balik kepada pemberi pinjaman.', true, 'Hutang perlu dibayar balik, biasanya bersama faedah.'],
  ['Wang pendahuluan mengurangkan jumlah pinjaman kereta.', true, 'Pinjaman = harga − wang pendahuluan.'],
  ['Bayaran minimum kad kredit ialah 5% daripada baki tertunggak walaupun nilainya kurang daripada RM50.', false, 'Bayaran minimum ialah 5% atau RM50, yang mana lebih tinggi.']
];

/* =================== rajah (SVG ikut tema: var(--…)) =================== */
const mpT = (x, y, t, c = 'tx', sz = 16, a = 'middle', w = 700) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" style="fill:var(--${c})" font-size="${sz}" font-weight="${w}" font-family="Inter, sans-serif" text-anchor="${a}" dominant-baseline="central">${t}</text>`;
const mpRect = (x, y, w, h, c, op = .18, rx = 10, sw = 2) => `<rect x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" width="${+Math.max(1, w).toFixed(1)}" height="${+Math.max(1, h).toFixed(1)}" rx="${rx}" style="fill:var(--${c});fill-opacity:${op};stroke:var(--${c})" stroke-width="${sw}"/>`;
const mpSvg = (w, h, s, label) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" font-family="Inter, sans-serif">${s}</svg>`;
// penyata / kad maklumat: rows = [[label, nilai, warna]]
function mpFigKad(title, rows, c = 'pa') {
  const H = 58 + rows.length * 36;
  let s = `<rect x="2" y="2" width="336" height="${H - 4}" rx="16" style="fill:var(--surf);stroke:var(--${c})" stroke-width="2.5"/>`;
  s += mpT(170, 28, title, c, 16, 'middle', 800) + `<line x1="18" y1="46" x2="322" y2="46" style="stroke:var(--bd)" stroke-width="2"/>`;
  rows.forEach(([l, v, cl], i) => { s += mpT(20, 66 + i * 36, l, 'mu', 15, 'start', 600) + mpT(320, 66 + i * 36, v, cl || 'tx', 16, 'end', 800); });
  return mpSvg(340, H, s, title);
}
// jadual: head[], rows[][]
function mpFigJadual(head, rows, c = 'gr') {
  const n = head.length, cw = 340 / n, H = 42 + rows.length * 34 + 6;
  let s = `<rect x="2" y="2" width="336" height="${H - 4}" rx="14" style="fill:var(--surf);stroke:var(--bd)" stroke-width="2"/>`;
  head.forEach((h, j) => { s += mpT(cw * j + cw / 2, 24, h, c, 14, 'middle', 800); });
  s += `<line x1="10" y1="42" x2="330" y2="42" style="stroke:var(--bd)" stroke-width="2"/>`;
  rows.forEach((r, i) => r.forEach((v, j) => { s += mpT(cw * j + cw / 2, 60 + i * 34, v, i === rows.length - 1 && r[0] === 'Jumlah' ? c : 'tx', 15, 'middle', 700); }));
  return mpSvg(340, H, s, 'Jadual');
}
// carta bar ringkas: bars = [[label, nilai, warna, teks]]
function mpFigBar(bars, title) {
  const W = 340, H = 230, L = 20, R = 320, Bt = 186, Tp = 40, mx = Math.max(...bars.map(b => b[1])) || 1, bw = (R - L) / bars.length;
  let s = title ? mpT(W / 2, 16, title, 'mu', 14, 'middle', 700) : '';
  bars.forEach(([l, v, c, t], i) => { const h = (Bt - Tp) * v / mx, x = L + i * bw + bw * .18; s += mpRect(x, Bt - h, bw * .64, h, c, .3, 6, 2.5) + mpT(x + bw * .32, Bt - h - 12, t, c, 14, 'middle', 800) + mpT(x + bw * .32, Bt + 18, l, 'mu', 13, 'middle', 700); });
  s += `<line x1="${L}" y1="${Bt}" x2="${R}" y2="${Bt}" style="stroke:var(--mu)" stroke-width="2"/>`;
  return mpSvg(W, H, s, title || 'Carta bar');
}
// ikon tema (untuk games)
function mpIkon(kind, big) {
  let s = '';
  if (kind === 'tabung') {
    s = `<ellipse cx="150" cy="150" rx="92" ry="66" style="fill:var(--gr);fill-opacity:.2;stroke:var(--gr)" stroke-width="5"/><rect x="122" y="80" width="56" height="10" rx="4" style="fill:var(--gr)"/><line x1="92" y1="208" x2="92" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><line x1="208" y1="208" x2="208" y2="232" style="stroke:var(--gr)" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="138" r="7" style="fill:var(--gr)"/><circle cx="150" cy="46" r="24" style="fill:var(--am);fill-opacity:.25;stroke:var(--am)" stroke-width="4"/>` + mpT(150, 47, 'RM', 'am', 17, 'middle', 800);
  } else if (kind === 'saham') {
    s = [60, 95, 75, 130].map((h, i) => mpRect(50 + i * 52, 230 - h, 36, h, 'am', .3, 6, 3)).join('') + `<polyline points="60,170 112,130 164,150 236,70" style="fill:none;stroke:var(--pk)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><polyline points="214,66 238,68 236,92" style="fill:none;stroke:var(--pk)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><line x1="36" y1="232" x2="264" y2="232" style="stroke:var(--mu)" stroke-width="3"/>`;
  } else if (kind === 'kad') {
    s = `<rect x="30" y="70" width="240" height="152" rx="18" style="fill:var(--pa);fill-opacity:.2;stroke:var(--pa)" stroke-width="5"/>` + mpRect(56, 104, 46, 34, 'am', .35, 6, 3) + mpT(56, 172, '•••• •••• •••• 2026', 'tx', 19, 'start', 800) + `<circle cx="218" cy="198" r="15" style="fill:var(--rd);fill-opacity:.6"/><circle cx="236" cy="198" r="15" style="fill:var(--am);fill-opacity:.6"/>`;
  } else if (kind === 'kereta') {
    s = `<path d="M24 190 L44 150 L96 140 L124 100 L196 100 L228 140 L270 150 L278 190 Z" style="fill:var(--tr);fill-opacity:.2;stroke:var(--tr)" stroke-width="5" stroke-linejoin="round"/><path d="M130 108 L104 140 L158 140 L158 108 Z M168 108 L168 140 L216 140 L192 108 Z" style="fill:var(--tr);fill-opacity:.4"/><circle cx="84" cy="192" r="24" style="fill:var(--surf);stroke:var(--mu)" stroke-width="6"/><circle cx="220" cy="192" r="24" style="fill:var(--surf);stroke:var(--mu)" stroke-width="6"/>`;
  } else {
    s = `<path d="M40 140 L150 56 L260 140" style="fill:none;stroke:var(--pu)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>` + mpRect(66, 136, 168, 100, 'pu', .2, 6, 5) + mpRect(132, 170, 38, 66, 'pu', .45, 4, 3);
  }
  return mpSvg(300, 260, s, 'Ikon ' + kind);
}

/* =================== QV: bank cara tanya =================== */
const QV = {
  /* ---------- 3.1 Simpanan & Pelaburan ---------- */
  faedahMudah: [
    ({ P, r, t }) => ({ q: `Hitung faedah mudah bagi prinsipal RM${mpN(P)} pada kadar ${mpPc(r)} setahun selama ${t} tahun.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} menyimpan RM${mpN(P)} dalam akaun simpanan tetap di ${B} yang menawarkan faedah mudah ${mpPc(r)} setahun. Berapakah faedah yang diperoleh selepas ${t} tahun?` }),
    ({ P, r, t }) => ({ q: `Sebuah koperasi sekolah menyimpan RM${mpN(P)} dengan kadar faedah mudah ${mpPc(r)} setahun. Cari jumlah faedah selepas ${t} tahun.` }),
    ({ P, r, t, ans }) => { const N = vnama(); return Object.assign({ q: `${N} mengira faedah mudah bagi RM${mpN(P)} pada kadar ${mpPc(r)} setahun selama ${t} tahun sebagai RM${mpN(P * r * t)}. Adakah ${N} betul?` }, salah(N, ans, `${N} tidak menukar ${mpPc(r)} kepada ${mpD(r / 100)}.`)); },
    ({ P, r, t }) => ({ q: `Lengkapkan: I = Prt = ${mpN(P)} × ${mpD(r / 100)} × ${t} = ___` })
  ],
  nilaiMatang: [
    ({ P, r, t }) => ({ q: `RM${mpN(P)} disimpan dengan kadar faedah mudah ${mpPc(r)} setahun selama ${t} tahun. Hitung nilai matang simpanan itu.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} melabur RM${mpN(P)} dalam simpanan tetap di ${B} pada kadar faedah mudah ${mpPc(r)} setahun. Berapakah jumlah wangnya selepas ${t} tahun?` }),
    ({ P, r, t }) => ({ q: `Cari nilai matang bagi simpanan RM${mpN(P)} yang memperoleh faedah mudah ${mpPc(r)} setahun selama ${t} tahun.` }),
    ({ P, r, t, I, ans }) => { const N = vnama(); return Object.assign({ q: `Simpanan RM${mpN(P)} memperoleh faedah mudah ${mpPc(r)} setahun selama ${t} tahun. ${N} berkata nilai matangnya ialah ${mpRMf(I)}. Adakah ${N} betul?` }, salah(N, ans, `${mpRMf(I)} ialah faedah sahaja. Nilai matang = prinsipal + faedah.`)); }
  ],
  tempohBulan: [
    ({ P, r, m }) => ({ q: `Hitung faedah mudah bagi RM${mpN(P)} pada kadar ${mpPc(r)} setahun selama ${m} bulan.` }),
    ({ P, r, m }) => ({ q: `${vnama()} menyimpan RM${mpN(P)} dalam simpanan tetap ${m} bulan dengan kadar faedah mudah ${mpPc(r)} setahun. Berapakah faedah yang diterimanya?` }),
    ({ P, r, m }) => ({ q: `Wang RM${mpN(P)} disimpan selama ${m} bulan pada kadar faedah mudah ${mpPc(r)} setahun. Cari faedahnya.` }),
    ({ P, r, m, ans }) => { const N = vnama(); return Object.assign({ q: `Bagi simpanan RM${mpN(P)} pada ${mpPc(r)} setahun selama ${m} bulan, ${N} menulis I = ${mpN(P)} × ${mpD(r / 100)} × ${m}. Adakah ${N} betul?` }, salah(N, ans, `Tempoh mesti dalam tahun: ${m} bulan = ${m}/12 tahun.`)); }
  ],
  nKompaun: [
    ({ r, kl, t }) => ({ q: `Faedah ${mpPc(r)} setahun dikompaun ${kl} selama ${t} tahun. Nyatakan nilai n dan nilai nt dalam rumus MV = P(1 + r/n)<sup>nt</sup>.` }),
    ({ r, kl, t }) => ({ q: `Sebuah bank menawarkan faedah ${mpPc(r)} setahun yang dikompaun ${kl}. Bagi simpanan selama ${t} tahun, berapakah nilai n dan nt?` }),
    ({ r, kl, t, n }) => ({ q: `Faedah ${mpPc(r)} setahun dikompaun ${kl} selama ${t} tahun. Nyatakan nilai r/n dan nt.`, ans: `r/n = ${mpRn(r, n)}, nt = ${n * t}` }),
    ({ r, kl, t, n }) => ({ q: `Lengkapkan bagi faedah ${mpPc(r)} setahun dikompaun ${kl} selama ${t} tahun: MV = P(1 + ___)<sup>___</sup>`, ans: `MV = P(1 + ${mpD(r / 100)}/${n})<sup>${n * t}</sup>` })
  ],
  bs: [
    ({ s, ok }) => ({ q: `Nyatakan sama ada pernyataan berikut betul atau salah: "${s}"`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => ({ q: `Betul atau salah? ${s}`, ans: ok ? 'Betul' : 'Salah' }),
    ({ s, ok }) => { const N = vnama(); return { q: `${N} berkata, "${s}" Adakah ${N} betul?`, ans: ok ? `Ya, ${N} betul` : `Tidak, ${N} tidak betul` }; }
  ],
  kompaun: [
    ({ P, r, kl, t }) => ({ q: `RM${mpN(P)} disimpan dengan kadar faedah ${mpPc(r)} setahun dikompaun ${kl}. Hitung nilai matang selepas ${t} tahun.` }),
    ({ P, r, kl, t, B }) => ({ q: `${vnama()} menyimpan RM${mpN(P)} di ${B} yang menawarkan faedah ${mpPc(r)} setahun dikompaun ${kl}. Berapakah nilai simpanannya selepas ${t} tahun?` }),
    ({ P, r, kl, t }) => ({ q: `Cari nilai matang bagi pelaburan RM${mpN(P)} selama ${t} tahun pada kadar ${mpPc(r)} setahun yang dikompaun ${kl}. Beri jawapan betul kepada sen terdekat.` }),
    ({ P, r, n, t }) => ({ q: `Lengkapkan: MV = ${mpN(P)}(1 + ${mpD(r / 100)}/${n})<sup>${n * t}</sup> = ___` })
  ],
  faedahKompaun: [
    ({ P, r, kl, t }) => ({ q: `Hitung faedah kompaun yang diperoleh daripada simpanan RM${mpN(P)} pada kadar ${mpPc(r)} setahun dikompaun ${kl} selama ${t} tahun.` }),
    ({ P, r, kl, t }) => ({ q: `${vnama()} menyimpan RM${mpN(P)} selama ${t} tahun. Faedah ${mpPc(r)} setahun dikompaun ${kl}. Berapakah jumlah faedah yang diterimanya?` }),
    ({ P, r, kl, t, MV, ans }) => { const N = vnama(); return Object.assign({ q: `Simpanan RM${mpN(P)} memperoleh faedah ${mpPc(r)} setahun dikompaun ${kl} selama ${t} tahun. ${N} berkata faedahnya ialah ${mpRM(MV, true)}. Adakah ${N} betul?` }, salah(N, ans, `${mpRM(MV, true)} ialah nilai matang. Faedah = MV − P.`)); }
  ],
  roi: [
    ({ u, b, d, j, Sy }) => ({ q: `${vnama()} membeli ${mpN(u)} unit saham ${Sy} pada harga ${mpSen(b)} seunit. Dia menerima dividen ${mpSen(d)} seunit dan kemudian menjual semua saham itu pada harga ${mpSen(j)} seunit. Hitung pulangan pelaburannya dalam peratus.` }),
    ({ u, b, d, j }) => ({ q: `Sebanyak ${mpN(u)} unit saham dibeli pada ${mpSen(b)} seunit. Selepas setahun, dividen ${mpSen(d)} seunit dibayar dan saham dijual pada ${mpSen(j)} seunit. Berapakah pulangan pelaburan (ROI)?` }),
    ({ u, b, d, j }) => ({ q: `Seorang pelabur membeli ${mpN(u)} unit saham pada ${mpSen(b)} seunit, menerima dividen ${mpSen(d)} seunit, lalu menjualnya pada ${mpSen(j)} seunit. Tentukan pulangan pelaburan.` }),
    ({ u, b, d, j, Sy }) => ({ q: `Jadual di bawah menunjukkan pelaburan dalam saham ${Sy}. Hitung pulangan pelaburan.`, rev: false })
  ],
  purataKos: [
    ({ a, Dn }) => ({ q: `${vnama()} melabur RM${mpN(a)} setiap bulan dalam ${Dn} menggunakan strategi purata kos seringgit. Harga seunit bagi tiga bulan ditunjukkan dalam jadual. Hitung purata kos seunit.` }),
    ({ a }) => ({ q: `Seorang pelabur membeli unit amanah saham bernilai RM${mpN(a)} setiap bulan selama tiga bulan pada harga seperti dalam jadual. Berapakah purata kos seunit?` }),
    ({ a }) => ({ q: `Berdasarkan jadual, RM${mpN(a)} dilaburkan setiap bulan. Cari jumlah unit yang dibeli dan purata kos seunit.` }),
    ({ a, mean, ans }) => { const N = vnama(); return Object.assign({ q: `RM${mpN(a)} dilaburkan setiap bulan pada harga seperti dalam jadual. ${N} berkata purata kos seunit ialah ${mpRM(mean / 100, true)}, iaitu purata tiga harga itu. Adakah ${N} betul?` }, salah(N, ans, 'Purata kos seunit = jumlah wang dilaburkan ÷ jumlah unit, bukan purata harga.')); }
  ],
  cariPrt: [
    ({ P, r, t, I, find }) => find === 't' ? { q: `Simpanan RM${mpN(P)} pada kadar faedah mudah ${mpPc(r)} setahun memperoleh faedah ${mpRMf(I)}. Berapa tahunkah tempoh simpanan itu?` }
      : find === 'r' ? { q: `Simpanan RM${mpN(P)} memperoleh faedah mudah ${mpRMf(I)} selepas ${t} tahun. Cari kadar faedah setahun.` } : { q: `Cari prinsipal yang memperoleh faedah mudah ${mpRMf(I)} pada kadar ${mpPc(r)} setahun selama ${t} tahun.` },
    ({ P, r, t, I, find }) => find === 't' ? { q: `Berapa lamakah RM${mpN(P)} perlu disimpan pada kadar faedah mudah ${mpPc(r)} setahun untuk memperoleh faedah ${mpRMf(I)}?` }
      : find === 'r' ? { q: `RM${mpN(P)} disimpan selama ${t} tahun dan memperoleh faedah mudah ${mpRMf(I)}. Hitung kadar faedah setahun.` } : { q: `Berapakah wang yang perlu disimpan selama ${t} tahun pada kadar faedah mudah ${mpPc(r)} setahun untuk memperoleh faedah ${mpRMf(I)}?` },
    ({ P, r, t, I, find }) => find === 't' ? { q: `${vnama()} menyimpan RM${mpN(P)} dengan faedah mudah ${mpPc(r)} setahun dan menerima faedah ${mpRMf(I)}. Cari tempoh simpanan.` }
      : find === 'r' ? { q: `Faedah mudah bagi RM${mpN(P)} selama ${t} tahun ialah ${mpRMf(I)}. Berapakah kadar faedah setahun?` } : { q: `${vnama()} menerima faedah mudah ${mpRMf(I)} selepas menyimpan selama ${t} tahun pada ${mpPc(r)} setahun. Berapakah wang yang disimpannya?` }
  ],
  k31: [
    ({ bk }) => ({ q: `${bk.N} mempunyai RM${mpN(bk.P)} untuk disimpan selama ${bk.t} tahun. ${bk.A} menawarkan faedah mudah ${mpPc(bk.r1)} setahun, manakala ${bk.Bn} menawarkan faedah ${mpPc(bk.r2)} setahun dikompaun ${bk.kl}. (a) Hitung nilai matang bagi setiap tawaran. (b) Tawaran manakah lebih menguntungkan dan berapakah bezanya?`, ans: `(a) ${bk.A}: ${mpRMf(bk.m1)}; ${bk.Bn}: ${mpRM(bk.m2, true)} (b) ${bk.best}, beza ${mpRM(Math.abs(bk.m2 - bk.m1), true)}`, work: [`${bk.A}: MV = ${mpN(bk.P)} + ${mpN(bk.P)} × ${mpD(bk.r1 / 100)} × ${bk.t} = ${mpRMf(bk.m1)}`, `${bk.Bn}: MV = ${mpN(bk.P)}(1 + ${mpD(bk.r2 / 100)}/${bk.n})<sup>${bk.n * bk.t}</sup> = ${mpRM(bk.m2, true)}`, `Beza = ${mpRM(Math.abs(bk.m2 - bk.m1), true)}, maka ${bk.best} lebih menguntungkan.`] }),
    ({ hr }) => ({ q: `${hr.N} membeli sebuah rumah berharga RM${mpN(hr.H)} dan menyewakannya pada RM${mpN(hr.sw)} sebulan selama ${hr.y} tahun. Sepanjang tempoh itu, kos penyelenggaraan dan cukai berjumlah RM${mpN(hr.kos)}. Rumah itu kemudian dijual pada harga RM${mpN(hr.J)}. Hitung pulangan pelaburannya.`, ans: `${mpD(hr.roi)}%`, work: [`Sewa = ${mpN(hr.sw)} × ${12 * hr.y} = ${mpRM(hr.sw * 12 * hr.y)}`, `Keuntungan modal = ${mpN(hr.J)} − ${mpN(hr.H)} = ${mpRM(hr.J - hr.H)}`, `Jumlah pulangan = ${mpN(hr.sw * 12 * hr.y)} + ${mpN(hr.J - hr.H)} − ${mpN(hr.kos)} = ${mpRM(hr.ret)}`, `ROI = ${mpN(hr.ret)} ÷ ${mpN(hr.H)} × 100% = ${mpD(hr.roi)}%`] }),
    ({ pk }) => ({ q: `${pk.N} melabur RM${mpN(pk.a)} setiap bulan dalam ${pk.Dn} selama tiga bulan. Harga seunit ialah ${pk.p.map(c => mpRM(c / 100, true)).join(', ')}. (a) Hitung purata kos seunit. (b) Jika dia melabur kesemua RM${mpN(3 * pk.a)} pada bulan pertama, berapakah unit yang diperolehnya? (c) Strategi manakah memberi lebih banyak unit?`, ans: `(a) ${mpRM(pk.avg / 100, true)} (b) ${mpN(pk.lump)} unit (c) ${pk.lump > pk.su ? 'Melabur sekali gus pada bulan pertama' : 'Purata kos seringgit'}`, work: [`Unit = ${pk.u.map(x => mpN(x)).join(' + ')} = ${mpN(pk.su)}`, `(a) Purata kos seunit = ${mpN(3 * pk.a)} ÷ ${mpN(pk.su)} = ${mpRM(pk.avg / 100, true)}`, `(b) ${mpN(3 * pk.a)} ÷ ${mpRM(pk.p[0] / 100, true)} = ${mpN(pk.lump)} unit`, `(c) ${mpN(pk.su)} unit berbanding ${mpN(pk.lump)} unit.`] }),
    ({ sg }) => ({ q: `${sg.N} menyimpan RM${mpN(sg.P)} pada kadar faedah ${mpPc(sg.r)} setahun dikompaun setiap tahun. Selepas berapa tahun penuh simpanan itu mula melebihi RM${mpN(sg.X)}?`, ans: `${sg.t} tahun`, work: sg.rows.map(([k, v]) => `Tahun ${k}: ${mpN(sg.P)}(1 + ${mpD(sg.r / 100)})<sup>${k}</sup> = ${mpRM(v, true)}`).concat([`Maka selepas ${sg.t} tahun, simpanan melebihi RM${mpN(sg.X)}.`]) })
  ],

  /* ---------- 3.2 Kredit & Hutang ---------- */
  bayarMin: [
    ({ B }) => ({ q: `Baki tertunggak kad kredit ${vnama()} ialah RM${mpN(B)}. Bayaran minimum ialah 5% daripada baki tertunggak atau RM50, yang mana lebih tinggi. Hitung bayaran minimum.` }),
    ({ B }) => ({ q: `Penyata kad kredit menunjukkan baki tertunggak RM${mpN(B)}. Berapakah bayaran minimum? (5% atau RM50, yang lebih tinggi)` }),
    () => ({ q: 'Berdasarkan penyata kad kredit di bawah, hitung bayaran minimum yang perlu dibuat. (5% atau RM50, yang lebih tinggi)' }),
    ({ B, ans }) => { const N = vnama(); return Object.assign({ q: `Baki tertunggak kad kredit ialah RM${mpN(B)}. ${N} berkata bayaran minimumnya ialah ${mpRMf(B * 0.05)}. Adakah ${N} betul? (5% atau RM50, yang lebih tinggi)` }, salah(N, ans, `5% × ${mpN(B)} = ${mpRMf(B * 0.05)}, iaitu kurang daripada RM50. Ambil nilai yang lebih tinggi.`)); }
  ],
  cajLewat: [
    ({ B }) => ({ q: `Baki tertunggak kad kredit ialah RM${mpN(B)}. Bayaran minimum tidak dibuat sebelum tarikh akhir. Hitung caj lewat bayaran jika kadarnya 1% daripada baki tertunggak (minimum RM10, maksimum RM100).` }),
    ({ B }) => ({ q: `${vnama()} terlupa membuat bayaran kad kredit sebelum tarikh akhir. Baki tertunggak ialah RM${mpN(B)}. Caj lewat bayaran ialah 1% daripada baki tertunggak, minimum RM10 dan maksimum RM100. Berapakah caj lewat yang dikenakan?` }),
    () => ({ q: 'Pemegang kad dalam penyata di bawah tidak membuat sebarang bayaran sebelum tarikh akhir. Hitung caj lewat bayaran. (1%, minimum RM10, maksimum RM100)' }),
    ({ B }) => ({ q: `Lengkapkan: Caj lewat = 1% × RM${mpN(B)} = ${mpRMf(B * 0.01)} → caj lewat yang dikenakan = ___ (minimum RM10, maksimum RM100)` })
  ],
  faedahPinjam: [
    ({ P, r, t }) => ({ q: `Hitung jumlah faedah bagi pinjaman RM${mpN(P)} pada kadar faedah ${mpPc(r)} setahun selama ${t} tahun.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} meminjam RM${mpN(P)} daripada ${B} pada kadar ${mpPc(r)} setahun untuk tempoh ${t} tahun. Berapakah faedah yang perlu dibayarnya?` }),
    ({ P, r, t }) => ({ q: `Sebuah pinjaman peribadi RM${mpN(P)} dikenakan faedah kadar rata ${mpPc(r)} setahun. Cari jumlah faedah bagi tempoh ${t} tahun.` }),
    ({ P, r, t }) => ({ q: `Lengkapkan: Faedah = Prt = ${mpN(P)} × ${mpD(r / 100)} × ${t} = ___` })
  ],
  jumlahBayar: [
    ({ P, r, t }) => ({ q: `Hitung jumlah bayaran balik bagi pinjaman RM${mpN(P)} pada kadar faedah ${mpPc(r)} setahun selama ${t} tahun.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} mengambil pinjaman peribadi RM${mpN(P)} daripada ${B}. Kadar faedah ialah ${mpPc(r)} setahun selama ${t} tahun. Berapakah jumlah yang perlu dibayar balik?` }),
    ({ P, r, t }) => ({ q: `Cari jumlah bayaran balik, A, bagi pinjaman RM${mpN(P)} dengan kadar ${mpPc(r)} setahun untuk ${t} tahun.` }),
    ({ P, r, t, I, ans }) => { const N = vnama(); return Object.assign({ q: `Bagi pinjaman RM${mpN(P)} pada ${mpPc(r)} setahun selama ${t} tahun, ${N} berkata jumlah bayaran balik ialah ${mpRMf(I)}. Adakah ${N} betul?` }, salah(N, ans, `${mpRMf(I)} ialah faedah sahaja. A = P + Prt.`)); }
  ],
  ansuran: [
    ({ P, r, t }) => ({ q: `Pinjaman RM${mpN(P)} dikenakan faedah ${mpPc(r)} setahun selama ${t} tahun. Hitung ansuran bulanan.` }),
    ({ P, r, t, B }) => ({ q: `${vnama()} meminjam RM${mpN(P)} daripada ${B} untuk membeli komputer riba. Kadar faedah ialah ${mpPc(r)} setahun dan tempoh pinjaman ${t} tahun. Berapakah ansuran bulanannya?` }),
    ({ P, r, t }) => ({ q: `Cari bayaran ansuran bulanan bagi pinjaman peribadi RM${mpN(P)} pada kadar faedah ${mpPc(r)} setahun yang dibayar dalam tempoh ${t} tahun.` }),
    ({ P, r, t, ans }) => { const N = vnama(); return Object.assign({ q: `Bagi pinjaman RM${mpN(P)} pada ${mpPc(r)} setahun selama ${t} tahun, ${N} mengira ansuran bulanan sebagai ${mpRMf(P / (12 * t))}. Adakah ${N} betul?` }, salah(N, ans, `${N} terlupa menambah faedah. Ansuran = (P + Prt) ÷ bilangan bulan.`)); }
  ],
  cajKewangan: [
    ({ B, pay, r }) => ({ q: `Baki tertunggak kad kredit ialah RM${mpN(B)}. Pemegang kad membayar RM${mpN(pay)} sebelum tarikh akhir. Caj kewangan ${mpPc(r)} setahun dikenakan ke atas baki yang tidak dibayar. Hitung (a) caj kewangan bagi bulan itu, (b) baki bulan berikutnya.` }),
    ({ B, pay, r }) => ({ q: `${vnama()} mempunyai baki kad kredit RM${mpN(B)} dan hanya membayar RM${mpN(pay)}. Jika caj kewangan ialah ${mpPc(r)} setahun, berapakah caj kewangan sebulan dan baki baharunya?` }),
    ({ r }) => ({ q: `Berdasarkan penyata di bawah, caj kewangan ${mpPc(r)} setahun dikenakan ke atas baki yang tidak dibayar. Hitung caj kewangan bagi sebulan dan baki bulan berikutnya.` })
  ],
  pinjamKereta: [
    ({ H, d, r, t }) => ({ q: `Harga sebuah kereta ialah RM${mpN(H)}. ${vnama()} membayar wang pendahuluan ${d}% dan membuat pinjaman bagi bakinya pada kadar ${mpPc(r)} setahun selama ${t} tahun. Hitung ansuran bulanan.` }),
    ({ H, d, r, t }) => ({ q: `Sebuah kereta terpakai berharga RM${mpN(H)} dibeli dengan wang pendahuluan ${d}%. Baki dibiayai dengan pinjaman ${mpPc(r)} setahun selama ${t} tahun. Berapakah bayaran bulanannya?` }),
    ({ H, d, r, t }) => ({ q: `Seorang guru membeli kereta RM${mpN(H)}. Wang pendahuluan ialah ${d}% daripada harga kereta. Kadar faedah pinjaman ${mpPc(r)} setahun untuk ${t} tahun. Cari (a) jumlah pinjaman, (b) ansuran bulanan.` })
  ],
  cariKadar: [
    ({ P, t, m }) => ({ q: `Pinjaman RM${mpN(P)} dibayar balik dengan ansuran ${mpRMf(m)} sebulan selama ${t} tahun. Hitung kadar faedah setahun.` }),
    ({ P, t, m }) => ({ q: `${vnama()} meminjam RM${mpN(P)} dan membayar ${mpRMf(m)} sebulan selama ${t} tahun. Berapakah kadar faedah setahun bagi pinjaman itu?` }),
    ({ P, t, m }) => ({ q: `Sebuah syarikat kewangan menawarkan pinjaman RM${mpN(P)} dengan ansuran ${mpRMf(m)} sebulan selama ${12 * t} bulan. Cari kadar faedah setahun.` })
  ],
  k32: [
    ({ kk }) => ({ q: `Baki tertunggak kad kredit ${kk.N} pada bulan Mac ialah RM${mpN(kk.B)}. Dia membuat bayaran minimum sebelum tarikh akhir dan tidak berbelanja lagi. Pada bulan April, dia tidak membuat sebarang bayaran sebelum tarikh akhir. Caj kewangan ialah 18% setahun. Hitung (a) bayaran minimum bulan Mac, (b) baki bulan April, (c) baki bulan Mei.`, ans: `(a) ${mpRMf(kk.m)} (b) ${mpRM(kk.B2, true)} (c) ${mpRM(kk.B3, true)}`, work: [`(a) 5% × ${mpN(kk.B)} = ${mpRMf(kk.B * 0.05)} → bayaran minimum = ${mpRMf(kk.m)}`, `(b) Caj kewangan = (${mpN(kk.B)} − ${mpN(kk.m)}) × 1.5% = ${mpRM(kk.f1, true)}; baki April = ${mpRM(kk.B2, true)}`, `(c) Caj lewat = 1% × ${mpN(kk.B2, true)} → ${mpRM(kk.late, true)}; caj kewangan = ${mpN(kk.B2, true)} × 1.5% = ${mpRM(kk.f2, true)}`, `Baki Mei = ${mpN(kk.B2, true)} + ${mpN(kk.late, true)} + ${mpN(kk.f2, true)} = ${mpRM(kk.B3, true)}`] }),
    ({ dt }) => ({ q: `${dt.N} ingin meminjam RM${mpN(dt.P)}. ${dt.A} menawarkan kadar ${mpPc(dt.r1)} setahun selama ${dt.t1} tahun, manakala ${dt.Bn} menawarkan kadar ${mpPc(dt.r2)} setahun selama ${dt.t2} tahun. (a) Hitung ansuran bulanan bagi setiap tawaran. (b) Tawaran manakah mempunyai jumlah faedah lebih rendah? Berapakah bezanya?`, ans: `(a) ${dt.A}: ${mpRMf(dt.m1)}; ${dt.Bn}: ${mpRMf(dt.m2)} (b) ${dt.low}, beza ${mpRMf(Math.abs(dt.I1 - dt.I2))}`, work: [`${dt.A}: faedah = ${mpN(dt.P)} × ${mpD(dt.r1 / 100)} × ${dt.t1} = ${mpRMf(dt.I1)}; ansuran = ${mpN(dt.P + dt.I1)} ÷ ${12 * dt.t1} = ${mpRMf(dt.m1)}`, `${dt.Bn}: faedah = ${mpN(dt.P)} × ${mpD(dt.r2 / 100)} × ${dt.t2} = ${mpRMf(dt.I2)}; ansuran = ${mpN(dt.P + dt.I2)} ÷ ${12 * dt.t2} = ${mpRMf(dt.m2)}`, `Beza faedah = ${mpRMf(Math.abs(dt.I1 - dt.I2))}, maka ${dt.low} lebih rendah.`] }),
    ({ bj }) => ({ q: `${bj.N} ingin membeli kereta berharga RM${mpN(bj.H)} dengan wang pendahuluan ${bj.d}%. Kadar faedah pinjaman ialah ${mpPc(bj.r)} setahun. Dia hanya mampu membayar ansuran tidak melebihi RM${mpN(bj.max)} sebulan. Cari tempoh pinjaman paling singkat (dalam tahun penuh) yang sesuai.`, ans: `${bj.t} tahun (ansuran ${mpRMf(bj.m)})`, work: [`Pinjaman = ${mpN(bj.H)} − ${bj.d}% × ${mpN(bj.H)} = ${mpRM(bj.P)}`].concat(bj.rows.map(([t, m]) => `${t} tahun: (${mpN(bj.P)} + ${mpN(bj.P)} × ${mpD(bj.r / 100)} × ${t}) ÷ ${12 * t} = ${mpRMf(m)}`), [`Tempoh ${bj.t} tahun ialah yang paling singkat dengan ansuran ≤ RM${mpN(bj.max)}.`]) }),
    ({ ch }) => ({ q: `${ch.N} membayar ansuran ${mpRMf(ch.m)} sebulan selama ${ch.t} tahun bagi pinjaman kereta pada kadar faedah ${mpPc(ch.r)} setahun. Dia telah membayar wang pendahuluan ${ch.d}%. Cari (a) jumlah pinjaman, (b) harga kereta itu.`, ans: `(a) ${mpRM(ch.P)} (b) ${mpRM(ch.H)}`, work: [`A = ${mpN(ch.m, !Number.isInteger(ch.m))} × ${12 * ch.t} = ${mpRM(ch.A)}`, `A = P(1 + rt) → P = ${mpN(ch.A)} ÷ (1 + ${mpD(ch.r / 100)} × ${ch.t}) = ${mpRM(ch.P)}`, `Pinjaman = ${100 - ch.d}% daripada harga → harga = ${mpN(ch.P)} ÷ ${mpD((100 - ch.d) / 100)} = ${mpRM(ch.H)}`] })
  ]
};

/* =================== pembina soalan (r = mpRG atau mpRW) =================== */
const MP = {};
const mpPRT = (r, Ps, rs, ts) => [r.p(Ps), r.p(rs), r.p(ts)];
/* ---------- 3.1 ---------- */
MP.faedahMudah = r => {
  const [P, rr, t] = mpPRT(r, [1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000], [2, 2.5, 3, 3.5, 4, 4.5, 5, 6], [2, 3, 4, 5, 6, 8, 10]);
  const I = mpSimple(P, rr, t), ans = mpRMf(I);
  return GEN_LQ('faedahMudah', { P, r: rr, t, B: r.p(MPBANK), ans, work: ['I = Prt', `= ${mpN(P)} × ${mpD(rr / 100)} × ${t}`, `= ${ans}`] });
};
MP.nilaiMatang = r => {
  const [P, rr, t] = mpPRT(r, [1000, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 8000, 10000, 12000, 16000], [2, 3, 3.5, 4, 4.5, 5, 5.5, 6], [2, 3, 4, 5, 6]);
  const I = mpSimple(P, rr, t), ans = mpRMf(P + I);
  return GEN_LQ('nilaiMatang', { P, r: rr, t, I, B: r.p(MPBANK), ans, work: [`I = ${mpN(P)} × ${mpD(rr / 100)} × ${t} = ${mpRMf(I)}`, `MV = P + I = ${mpN(P)} + ${mpN(I)}`, `= ${ans}`] },
    { fig: mpFigBar([['Prinsipal', P, 'tr', mpRM(P)], ['Faedah', I, 'gr', '?'], ['Nilai matang', P + I, 'am', '?']], `${mpPc(rr)} setahun, ${t} tahun`) });
};
MP.tempohBulan = r => {
  let P, rr, m, I; do { P = r.p([1200, 2000, 2400, 3000, 3600, 4000, 4800, 6000, 8000, 9000, 10000, 12000]); rr = r.p([2, 2.5, 3, 3.5, 4, 4.5, 5, 6]); m = r.p([3, 4, 6, 8, 9, 15, 18, 30]); I = P * rr / 100 * m / 12; } while (Math.abs(I * 100 - Math.round(I * 100)) > 1e-6);
  const ans = mpRMf(I);
  return GEN_LQ('tempohBulan', { P, r: rr, m, ans, work: [`t = ${m} bulan = ${m}/12 tahun`, `I = ${mpN(P)} × ${mpD(rr / 100)} × ${m}/12`, `= ${ans}`] });
};
MP.nKompaun = (r, k) => {
  const [n, kl] = k == null ? r.p(MPKOMP) : MPKOMP[k % 4], rr = r.p([3, 4, 5, 6, 8, 12]), t = r.p([2, 3, 4, 5, 6, 10]);
  return GEN_LQ('nKompaun', { r: rr, kl, t, n, ans: `n = ${n}, nt = ${n * t}`, work: [`Dikompaun ${kl} → ${n} kali setahun, maka n = ${n}.`, `nt = ${n} × ${t} = ${n * t}`, `r/n = ${mpD(rr / 100)} ÷ ${n}${mpRn(rr, n).includes('/') ? '' : ' = ' + mpRn(rr, n)}`] });
};
MP.bs = (r, list, k) => { const [s, ok, why] = k == null ? r.p(list) : list[k % list.length]; return GEN_LQ('bs', { s, ok, work: [why] }); };
function mpKompData(r) {
  const P = r.p([1000, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000]), kk = r.p(MPKOMP.slice(0, 3).concat([MPKOMP[0], MPKOMP[1]])), rr = r.p([3, 4, 5, 6, 8]), t = r.p([2, 3, 4, 5]);
  return { P, r: rr, n: kk[0], kl: kk[1], t, MV: mpComp(P, rr, kk[0], t) };
}
MP.kompaun = r => {
  const d = mpKompData(r), ans = mpRM(d.MV, true);
  return GEN_LQ('kompaun', Object.assign(d, { B: r.p(MPBANK), ans, work: ['MV = P(1 + r/n)<sup>nt</sup>', `= ${mpN(d.P)}(1 + ${mpD(d.r / 100)}/${d.n})<sup>${d.n} × ${d.t}</sup>`, `= ${mpN(d.P)}(${mpD(1 + d.r / 100 / d.n)})<sup>${d.n * d.t}</sup>`, `= ${ans}`] }));
};
MP.faedahKompaun = r => {
  const d = mpKompData(r), I = mpR2(d.MV - d.P), ans = mpRM(I, true);
  return GEN_LQ('faedahKompaun', Object.assign(d, { ans, work: [`MV = ${mpN(d.P)}(1 + ${mpD(d.r / 100)}/${d.n})<sup>${d.n * d.t}</sup> = ${mpRM(d.MV, true)}`, `Faedah kompaun = MV − P = ${mpN(d.MV, true)} − ${mpN(d.P)}`, `= ${ans}`] }));
};
function mpRoiData(r) {
  let u, b, d, j, roi, k = 0;
  do { u = r.p([500, 1000, 1500, 2000, 2500, 3000, 4000, 5000]); b = r.i(16, 100) * 5; d = r.i(2, 20); j = b + r.i(-6, 16) * 5; roi = (d + j - b) * 100 / b; k++; }
  while ((j <= 0 || roi <= 0 || Math.abs(roi * 100 - Math.round(roi * 100)) > 1e-6 || j === b) && k < 400);
  if (k >= 400) { u = 2000; b = 150; d = 9; j = 180; roi = 26; }
  const modal = u * b / 100, dv = u * d / 100, um = u * (j - b) / 100;
  return { u, b, d, j, roi: mpR2(roi), modal, dv, um, tot: dv + um };
}
MP.roi = r => {
  const D_ = mpRoiData(r), Sy = r.p(MPSAHAM);
  const fig = mpFigJadual(['Perkara', 'Nilai seunit'], [['Harga beli', mpSen(D_.b)], ['Dividen', mpSen(D_.d)], ['Harga jual', mpSen(D_.j)]], 'am');
  const rsign = D_.um < 0 ? `kerugian modal = ${mpN(D_.u)} × (${mpN(D_.j / 100, true)} − ${mpN(D_.b / 100, true)}) = ${mpRMf(D_.um)}` : `keuntungan modal = ${mpN(D_.u)} × (${mpN(D_.j / 100, true)} − ${mpN(D_.b / 100, true)}) = ${mpRMf(D_.um)}`;
  return GEN_LQ('roi', Object.assign({ Sy, ans: `${mpD(D_.roi)}%`, work: [`Modal = ${mpN(D_.u)} × RM${mpN(D_.b / 100, true)} = ${mpRMf(D_.modal)}`, `Dividen = ${mpN(D_.u)} × RM${mpN(D_.d / 100, true)} = ${mpRMf(D_.dv)}; ${rsign}`, `Jumlah pulangan = ${mpRMf(D_.tot)}`, `ROI = ${mpN(D_.tot)} ÷ ${mpN(D_.modal)} × 100% = ${mpD(D_.roi)}%`] }, D_), { fig });
};
function mpPksData(r) {
  const [a, p] = r.p(MPPKS), u = p.map(c => a * 100 / c), su = u[0] + u[1] + u[2];
  return { a, p, u, su, avg: 3 * a * 100 / su, mean: mpR2((p[0] + p[1] + p[2]) / 3), lump: 3 * a * 100 / p[0] };
}
MP.purataKos = r => {
  const d = mpPksData(r), ans = mpRM(d.avg / 100, true);
  const fig = mpFigJadual(['Bulan', 'Pelaburan', 'Harga seunit'], ['Januari', 'Februari', 'Mac'].map((b, i) => [b, mpRM(d.a), mpRM(d.p[i] / 100, true)]), 'pu');
  const figAns = mpFigJadual(['Bulan', 'Pelaburan', 'Unit'], ['Januari', 'Februari', 'Mac'].map((b, i) => [b, mpRM(d.a), mpN(d.u[i])]).concat([['Jumlah', mpRM(3 * d.a), mpN(d.su)]]), 'pu');
  return GEN_LQ('purataKos', Object.assign(d, { Dn: r.p(MPDANA), ans: `${ans} (jumlah unit ${mpN(d.su)})`, work: [`Unit = ${d.u.map((x, i) => `${mpN(d.a)} ÷ ${mpN(d.p[i] / 100, true)}`).join(', ')} = ${d.u.map(x => mpN(x)).join(', ')}`, `Jumlah unit = ${mpN(d.su)}; jumlah pelaburan = ${mpRM(3 * d.a)}`, `Purata kos seunit = ${mpN(3 * d.a)} ÷ ${mpN(d.su)} = ${ans}`] }), { fig, figAns });
};
MP.cariPrt = (r, find) => {
  find = find || r.p(['t', 'r', 'P']);
  const P = r.p([1000, 2000, 2500, 4000, 5000, 6000, 8000, 10000, 12000]), rr = r.p([2, 2.5, 3, 4, 5, 6]), t = r.p([2, 3, 4, 5, 6, 8]), I = mpSimple(P, rr, t);
  const ans = find === 't' ? `${t} tahun` : find === 'r' ? `${mpD(rr)}% setahun` : mpRM(P);
  const work = find === 't' ? ['I = Prt → t = I ÷ (P × r)', `t = ${mpN(I)} ÷ (${mpN(P)} × ${mpD(rr / 100)})`, `= ${t} tahun`]
    : find === 'r' ? ['I = Prt → r = I ÷ (P × t)', `r = ${mpN(I)} ÷ (${mpN(P)} × ${t}) = ${mpD(rr / 100)}`, `= ${mpD(rr)}% setahun`]
    : ['I = Prt → P = I ÷ (r × t)', `P = ${mpN(I)} ÷ (${mpD(rr / 100)} × ${t})`, `= ${mpRM(P)}`];
  return GEN_LQ('cariPrt', { P, r: rr, t, I, find, ans, work });
};
MP.k31 = r => {
  const N = vnama();
  // (1) mudah vs kompaun
  let bk; do {
    const P = r.p([5000, 8000, 10000, 12000, 20000]), t = r.p([3, 4, 5]), r1 = r.p([3.5, 4, 4.5, 5]), r2 = r1 - r.p([0, 0.5]), kk = r.p(MPKOMP.slice(1, 4)), [A, Bn] = gdShufMP(r, MPBANK).slice(0, 2);
    const m1 = mpR2(P + mpSimple(P, r1, t)), m2 = mpComp(P, r2, kk[0], t);
    bk = { N, P, t, r1, r2, n: kk[0], kl: kk[1], A, Bn, m1, m2, best: m2 > m1 ? Bn : A };
  } while (Math.abs(bk.m2 - bk.m1) < 1);
  // (2) hartanah
  let hr; do { const H = r.p([200, 250, 300, 350, 400, 450, 500]) * 1000, sw = r.p([800, 1000, 1200, 1500, 1800]), y = r.p([2, 3, 4, 5]), J = H + r.p([10, 20, 25, 30, 40, 50]) * 1000, kos = r.p([3, 4, 5, 6, 8, 10]) * 1000, ret = sw * 12 * y + J - H - kos; hr = { N, H, sw, y, J, kos, ret, roi: mpR2(ret * 100 / H) }; } while (Math.abs(hr.roi * 100 - Math.round(hr.roi * 100)) > 1e-6 || hr.ret <= 0 || (hr.ret * 10000) % hr.H);
  // (3) purata kos vs sekali gus
  const pd = mpPksData(r), pk = Object.assign({ N, Dn: r.p(MPDANA) }, pd);
  // (4) sasaran simpanan
  const P4 = r.p([1000, 2000, 5000, 10000]), r4 = r.p([4, 5, 6, 8]), t4 = r.p([3, 4, 5]), lo = P4 * Math.pow(1 + r4 / 100, t4 - 1), hi = P4 * Math.pow(1 + r4 / 100, t4);
  const X = Math.ceil((lo + (hi - lo) * 0.4) / 100) * 100, tt = (() => { let k = 0; while (mpComp(P4, r4, 1, k) <= X) k++; return k; })();
  const rows = []; for (let k = 1; k <= tt; k++) rows.push([k, mpComp(P4, r4, 1, k)]);
  const sg = { N, P: P4, r: r4, X, t: tt, rows };
  const v = vq('k31', { bk, hr, pk, sg });
  return { q: v.q, ans: v.ans, work: v.work };
};
function gdShufMP(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r.f() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/* ---------- 3.2 ---------- */
MP.bayarMin = (r, k) => {
  const low = k == null ? r.f() < .4 : k % 3 === 2, B = low ? r.i(8, 19) * 50 : r.i(11, 120) * 50, m = mpMin(B), ans = mpRMf(m);
  const fig = mpFigKad('PENYATA KAD KREDIT', [['Baki tertunggak', mpRM(B, true)], ['Tarikh akhir bayaran', `${r.i(10, 28)} ${r.p(['Januari', 'Mac', 'Mei', 'Julai', 'Oktober'])}`, 'mu'], ['Bayaran minimum', '?', 'pa']]);
  return GEN_LQ('bayarMin', { B, ans, work: [`5% × ${mpN(B)} = ${mpRMf(B * 0.05)}`, `Bandingkan dengan RM50: ${mpRMf(B * 0.05)} ${B * 0.05 >= 50 ? '≥' : '<'} RM50`, `Bayaran minimum = ${ans}`] }, { fig });
};
MP.cajLewat = (r, k) => {
  const z = k == null ? r.i(0, 2) : k % 3, B = z === 0 ? r.i(3, 9) * 100 : z === 1 ? r.i(11, 98) * 100 + r.p([0, 50]) : r.i(105, 300) * 100, c = mpLate(B), ans = mpRMf(c);
  const fig = mpFigKad('PENYATA KAD KREDIT', [['Baki tertunggak', mpRM(B, true)], ['Bayaran diterima', 'RM0.00', 'rd'], ['Caj lewat bayaran', '?', 'pa']]);
  return GEN_LQ('cajLewat', { B, ans, work: [`1% × ${mpN(B)} = ${mpRMf(B * 0.01)}`, B * 0.01 < 10 ? 'Kurang daripada minimum RM10, maka caj lewat = RM10.' : B * 0.01 > 100 ? 'Melebihi maksimum RM100, maka caj lewat = RM100.' : 'Nilai ini antara RM10 dan RM100.', `Caj lewat bayaran = ${ans}`] }, { fig });
};
function mpLoanData(r, clean) {
  let P, rr, t, I, A, m, k = 0;
  do { P = r.p([3000, 5000, 6000, 8000, 10000, 12000, 15000, 18000, 20000, 24000, 30000, 36000, 40000, 50000]); rr = r.p([3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8]); t = r.p([2, 3, 4, 5, 6, 7]); I = mpSimple(P, rr, t); A = P + I; m = A / (12 * t); k++; }
  while (clean && Math.abs(m * 100 - Math.round(m * 100)) > 1e-6 && k < 300);
  return { P, r: rr, t, I, A: mpR2(A), m: mpR2(m) };
}
MP.faedahPinjam = r => { const d = mpLoanData(r), ans = mpRMf(d.I); return GEN_LQ('faedahPinjam', Object.assign(d, { B: r.p(MPBANK), ans, work: ['Faedah = Prt', `= ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t}`, `= ${ans}`] })); };
MP.jumlahBayar = r => { const d = mpLoanData(r), ans = mpRMf(d.A); return GEN_LQ('jumlahBayar', Object.assign(d, { B: r.p(MPBANK), ans, work: [`Faedah = ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t} = ${mpRMf(d.I)}`, `A = P + Prt = ${mpN(d.P)} + ${mpN(d.I)}`, `= ${ans}`] })); };
MP.ansuran = r => {
  const d = mpLoanData(r, true), ans = mpRMf(d.m);
  return GEN_LQ('ansuran', Object.assign(d, { B: r.p(MPBANK), ans, work: [`Faedah = ${mpN(d.P)} × ${mpD(d.r / 100)} × ${d.t} = ${mpRMf(d.I)}`, `A = ${mpN(d.P)} + ${mpN(d.I)} = ${mpRMf(d.A)}`, `Ansuran = ${mpN(d.A)} ÷ ${12 * d.t} = ${ans}`] }));
};
MP.cajKewangan = r => {
  const B = r.i(10, 80) * 100, rr = r.p([15, 18]), pay = Math.max(mpMin(B), r.p([1, 2, 3, 4, 5]) * 100), sisa = B - pay, f = mpFC(sisa, rr), nb = mpR2(sisa + f);
  const fig = mpFigKad('PENYATA KAD KREDIT', [['Baki tertunggak', mpRM(B, true)], ['Bayaran (sebelum tarikh akhir)', mpRM(pay, true), 'gr'], ['Caj kewangan setahun', mpPc(rr), 'rd']]);
  return GEN_LQ('cajKewangan', { B, pay, r: rr, ans: `(a) ${mpRM(f, true)} (b) ${mpRM(nb, true)}`, work: [`Baki tidak dibayar = ${mpN(B)} − ${mpN(pay)} = ${mpRM(sisa)}`, `(a) Caj kewangan = ${mpN(sisa)} × ${mpPc(rr)} ÷ 12 = ${mpRM(f, true)}`, `(b) Baki baharu = ${mpN(sisa)} + ${mpN(f, true)} = ${mpRM(nb, true)}`] }, { fig });
};
MP.pinjamKereta = r => {
  let H, d, rr, t, P, I, m, k = 0;
  do { H = r.p([20, 24, 30, 36, 40, 45, 48, 50, 54, 60, 72, 80, 90, 96, 100, 120]) * 1000; d = r.p([10, 15, 20]); rr = r.p([2.5, 3, 3.5, 4, 4.5, 5]); t = r.p([3, 4, 5, 6, 7, 9]); P = H * (100 - d) / 100; I = mpSimple(P, rr, t); m = (P + I) / (12 * t); k++; }
  while ((Math.abs(m * 100 - Math.round(m * 100)) > 1e-6 || H < 5000) && k < 400);
  const ans = mpRMf(m);
  return GEN_LQ('pinjamKereta', { H, d, r: rr, t, ans: `Pinjaman ${mpRM(P)}, ansuran ${ans}`, work: [`Pendahuluan = ${d}% × ${mpN(H)} = ${mpRM(H * d / 100)}`, `Pinjaman = ${mpN(H)} − ${mpN(H * d / 100)} = ${mpRM(P)}`, `Faedah = ${mpN(P)} × ${mpD(rr / 100)} × ${t} = ${mpRMf(I)}`, `Ansuran = (${mpN(P)} + ${mpN(I)}) ÷ ${12 * t} = ${ans}`] });
};
MP.cariKadar = r => {
  let d, k = 0; do { d = mpLoanData(r, true); k++; } while (k < 50 && Math.abs(d.m * 100 - Math.round(d.m * 100)) > 1e-6);
  const A = mpR2(d.m * 12 * d.t);
  return GEN_LQ('cariKadar', { P: d.P, t: d.t, m: d.m, ans: `${mpD(d.r)}% setahun`, work: [`A = ${mpN(d.m, !Number.isInteger(d.m))} × ${12 * d.t} = ${mpRMf(A)}`, `Faedah = ${mpN(A)} − ${mpN(d.P)} = ${mpRMf(A - d.P)}`, `r = ${mpN(A - d.P)} ÷ (${mpN(d.P)} × ${d.t}) = ${mpD(d.r / 100)} = ${mpD(d.r)}% setahun`] });
};
MP.k32 = r => {
  const N = vnama();
  // (1) kad kredit dua bulan
  const B = r.i(15, 80) * 100, m = mpMin(B), f1 = mpFC(B - m, 18), B2 = mpR2(B - m + f1), late = mpLate(B2), f2 = mpFC(B2, 18), kk = { N, B, m, f1, B2, late, f2, B3: mpR2(B2 + late + f2) };
  // (2) dua tawaran pinjaman
  let dt, c = 0; do {
    const P = r.p([10000, 12000, 15000, 18000, 20000, 24000, 30000]), [A, Bn] = gdShufMP(r, MPBANK).slice(0, 2), r1 = r.p([4, 4.5, 5, 5.5, 6]), r2 = r1 - r.p([0.5, 1]), t1 = r.p([2, 3, 4]), t2 = t1 + r.p([1, 2]);
    const I1 = mpSimple(P, r1, t1), I2 = mpSimple(P, r2, t2); dt = { N, P, A, Bn, r1, r2, t1, t2, I1, I2, m1: mpR2((P + I1) / (12 * t1)), m2: mpR2((P + I2) / (12 * t2)), low: I1 < I2 ? A : Bn }; c++;
  } while ((dt.I1 === dt.I2 || [dt.m1, dt.m2].some((m, i) => Math.abs(m * 12 * [dt.t1, dt.t2][i] - (dt.P + [dt.I1, dt.I2][i])) > 1e-6)) && c < 300);
  // (3) tempoh paling singkat
  let bj; c = 0; do {
    const H = r.p([40, 45, 50, 60, 72, 80, 90]) * 1000, d = r.p([10, 20]), rr = r.p([3, 3.5, 4]), P = H * (100 - d) / 100, tt = r.i(4, 7);
    const mm = t => mpR2((P + P * rr / 100 * t) / (12 * t)), max = Math.ceil(mm(tt) / 50) * 50;
    let t = 1; while (t < 9 && mm(t) > max) t++;
    const rows = []; for (let k = Math.max(1, t - 2); k <= t; k++) rows.push([k, mm(k)]);
    bj = { N, H, d, r: rr, P, max, t, m: mm(t), rows }; c++;
  } while ((bj.t < 2 || bj.m > bj.max) && c < 100);
  // (4) cari harga kereta
  let ch; c = 0; do {
    const H = r.p([36, 40, 45, 48, 50, 54, 60, 72, 80]) * 1000, d = r.p([10, 20]), rr = r.p([2.5, 3, 4, 5]), t = r.p([4, 5, 6, 8, 9]), P = H * (100 - d) / 100, A = P + P * rr / 100 * t, m = A / (12 * t);
    ch = { N, H, d, r: rr, t, P, A, m: mpR2(m) }; c++;
  } while (Math.abs(ch.m * 100 - Math.round(ch.m * 100)) > 1e-6 && c < 300);
  const v = vq('k32', { kk, dt, bj, ch });
  return { q: v.q, ans: v.ans, work: v.work };
};

/* =================== GEN: Latihan Kelas =================== */
const GEN = {
  '3.1': {
    m: [() => MP.faedahMudah(mpRG), () => MP.nilaiMatang(mpRG), () => MP.tempohBulan(mpRG), () => MP.nKompaun(mpRG), () => MP.bs(mpRG, MPBS1)],
    s: [() => MP.kompaun(mpRG), () => MP.faedahKompaun(mpRG), () => MP.roi(mpRG), () => MP.purataKos(mpRG), () => MP.cariPrt(mpRG)],
    k: [() => MP.k31(mpRG)]
  },
  '3.2': {
    m: [() => MP.bayarMin(mpRG), () => MP.cajLewat(mpRG), () => MP.faedahPinjam(mpRG), () => MP.jumlahBayar(mpRG), () => MP.bs(mpRG, MPBS2)],
    s: [() => MP.ansuran(mpRG), () => MP.cajKewangan(mpRG), () => MP.pinjamKereta(mpRG), () => MP.cariKadar(mpRG)],
    k: [() => MP.k32(mpRG)]
  }
};

/* =================== WG + WSPLAN: bank Lembaran Kerja (rawak berbenih) =================== */
const WG = {};
// 3.1
WG.faedahMudah = () => MP.faedahMudah(mpRW);
WG.nilaiMatang = () => MP.nilaiMatang(mpRW);
WG.tempohBulan = () => MP.tempohBulan(mpRW);
WG.nKompaun = i => MP.nKompaun(mpRW, i + 1);
WG.bs1 = i => MP.bs(mpRW, MPBS1, [1, 3][i % 2] + wri(0, 2) * 2);
WG.kompaun = () => MP.kompaun(mpRW);
WG.faedahKompaun = () => MP.faedahKompaun(mpRW);
WG.roi = () => MP.roi(mpRW);
WG.purataKos = () => MP.purataKos(mpRW);
WG.cariPrt = i => MP.cariPrt(mpRW, ['t', 'r', 'P'][i % 3]);
WG.k31 = () => MP.k31(mpRW);
// 3.2
WG.bayarMin = i => MP.bayarMin(mpRW, i);
WG.cajLewat = i => MP.cajLewat(mpRW, i);
WG.faedahPinjam = () => MP.faedahPinjam(mpRW);
WG.jumlahBayar = () => MP.jumlahBayar(mpRW);
WG.bs2 = i => MP.bs(mpRW, MPBS2, [2, 4][i % 2] + wri(0, 2) * 2);
WG.ansuran = () => MP.ansuran(mpRW);
WG.cajKewangan = () => MP.cajKewangan(mpRW);
WG.pinjamKereta = () => MP.pinjamKereta(mpRW);
WG.cariKadar = () => MP.cariKadar(mpRW);
WG.k32 = () => MP.k32(mpRW);

// [aras, penjana, bilangan] — 30 soalan setiap subtopik (18 mudah, 9 sederhana, 3 sukar)
const WSPLAN = {
  '3.1': [['m', 'faedahMudah', 5], ['m', 'nilaiMatang', 5], ['m', 'tempohBulan', 3], ['m', 'nKompaun', 3], ['m', 'bs1', 2],
    ['s', 'kompaun', 2], ['s', 'faedahKompaun', 2], ['s', 'roi', 2], ['s', 'purataKos', 2], ['s', 'cariPrt', 1], ['k', 'k31', 3]],
  '3.2': [['m', 'bayarMin', 5], ['m', 'cajLewat', 4], ['m', 'faedahPinjam', 3], ['m', 'jumlahBayar', 4], ['m', 'bs2', 2],
    ['s', 'ansuran', 3], ['s', 'cajKewangan', 2], ['s', 'pinjamKereta', 2], ['s', 'cariKadar', 2], ['k', 'k32', 3]]
};

/* =================== GAMES: soalan pilih jawapan =================== */
// pilihan unik: jawapan + calon kesilapan biasa, dipaparkan dengan fungsi f
function mpOpts(ans, cands, f, step) {
  const A = f(ans), seen = new Set([A]), w = [];
  for (const c of shuffle(cands)) { if (!(c > 0) || !isFinite(c)) continue; const s = f(c); if (!seen.has(s)) { seen.add(s); w.push(s); } if (w.length === 3) break; }
  for (let k = 1; w.length < 3 && k < 80; k++) { const v = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (step || 1); if (v <= 0) continue; const s = f(v); if (!seen.has(s)) { seen.add(s); w.push(s); } }
  const opts = shuffle([A, ...w]);
  return { opts, c: opts.indexOf(A) };
}
function mpOptsT(ans, cands) { const w = shuffle(cands.filter(c => c !== ans)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 3), opts = shuffle([ans, ...w]); return { opts, c: opts.indexOf(ans) }; }
const mpMcq = (q, fig, o) => ({ type: 'mcq', q, fig, opts: o.opts, c: o.c });
const mpStep = v => (v >= 1000 ? 100 : v >= 100 ? 10 : 1);
const CQGEN = {
  faedah: [
    () => { const P = pick([1000, 2000, 4000, 5000, 8000, 10000]), r = pick([2, 3, 4, 5, 6]), t = pick([2, 3, 4, 5]), I = mpSimple(P, r, t);
      return mpMcq(`Faedah mudah bagi RM${mpN(P)} pada ${r}% setahun selama ${t} tahun ialah`, mpIkon('tabung'), mpOpts(I, [P * r * t, mpSimple(P, r, 1), P + I, I * 2, mpSimple(P, r, t + 1)], mpRMf, mpStep(I))); },
    () => { if (Math.random() < .5) { const P = pick([2000, 4000, 5000, 6000, 10000]), r = pick([3, 4, 5, 6]), t = pick([2, 3, 4]), I = mpSimple(P, r, t);
        return mpMcq(`Nilai matang bagi RM${mpN(P)} dengan faedah mudah ${r}% setahun selama ${t} tahun ialah`, mpIkon('tabung'), mpOpts(P + I, [I, P + mpSimple(P, r, 1), P + 2 * I, mpComp(P, r, 1, t)], mpRMf, mpStep(P))); }
      const [n, kl] = pick(MPKOMP), t = pick([2, 3, 5]); return mpMcq(`Faedah dikompaun ${kl} selama ${t} tahun. Nilai nt ialah`, mpIkon('tabung'), mpOpts(n * t, [t, n, n + t, 2 * n * t, 12 * t], v => String(v))); },
    () => { const d = mpKompData(mpRG); return mpMcq(`RM${mpN(d.P)} disimpan pada ${d.r}% setahun dikompaun ${d.kl} selama ${d.t} tahun. Nilai matangnya ialah`, mpIkon('tabung'), mpOpts(d.MV, [mpR2(d.P + mpSimple(d.P, d.r, d.t)), mpComp(d.P, d.r * d.n, d.n, d.t), mpR2(d.MV - d.P), mpComp(d.P, d.r, 1, d.t * d.n)], v => mpRM(v, true), mpStep(d.MV))); }
  ],
  labur: [
    () => { if (Math.random() < .5) { const d = pick([['Akaun simpanan', 'Tinggi'], ['Hartanah', 'Rendah']]); return mpMcq(`Kecairan bagi <b>${d[0].toLowerCase()}</b> ialah`, mpIkon(d[0] === 'Hartanah' ? 'rumah' : 'tabung'), mpOptsT(d[1], ['Tinggi', 'Rendah', 'Sederhana', 'Tiada'])); }
      const it = pick([['Saham', 'Pelaburan'], ['Amanah saham', 'Pelaburan'], ['Hartanah', 'Pelaburan'], ['Simpanan tetap', 'Simpanan'], ['Akaun semasa', 'Simpanan'], ['Akaun simpanan', 'Simpanan']]);
      return mpMcq(`<b>${it[0]}</b> ialah sejenis`, mpIkon(it[1] === 'Simpanan' ? 'tabung' : 'saham'), mpOptsT(it[1], ['Simpanan', 'Pelaburan', 'Kredit', 'Hutang'])); },
    () => { const d = mpRoiData(mpRG); return mpMcq(`${mpN(d.u)} unit saham dibeli pada ${mpSen(d.b)}, dividen ${mpSen(d.d)} seunit, dijual pada ${mpSen(d.j)}. Pulangan pelaburan ialah`, mpIkon('saham'), mpOpts(d.roi, [mpR2((d.j - d.b) * 100 / d.b), mpR2(d.d * 100 / d.b), mpR2((d.d + d.j - d.b) * 100 / d.j), mpR2(d.roi * 2)], v => `${mpD(mpR2(v))}%`)); },
    () => { const d = mpPksData(mpRG); return mpMcq(`RM${mpN(d.a)} dilaburkan setiap bulan pada harga ${d.p.map(c => mpRM(c / 100, true)).join(', ')}. Purata kos seunit ialah`, mpIkon('saham'), mpOpts(d.avg / 100, [d.mean / 100, d.p[0] / 100, d.p[2] / 100, mpR2(d.avg / 100 + 0.05)], v => mpRM(v, true), 0.01)); }
  ],
  kad: [
    () => { const B = Math.random() < .4 ? ri(8, 19) * 50 : ri(11, 120) * 50, m = mpMin(B); return mpMcq(`Baki tertunggak kad kredit ${mpRM(B)}. Bayaran minimum (5% atau RM50, yang lebih tinggi) ialah`, mpIkon('kad'), mpOpts(m, [mpR2(B * 0.05), 50, mpR2(B * 0.1), mpR2(B * 0.01), mpR2(B * 0.05) + 50], mpRMf, 5)); },
    () => { const B = pick([ri(3, 9) * 100, ri(11, 98) * 100, ri(105, 300) * 100]), c = mpLate(B); return mpMcq(`Baki tertunggak ${mpRM(B)} dan bayaran lewat. Caj lewat (1%, min RM10, maks RM100) ialah`, mpIkon('kad'), mpOpts(c, [mpR2(B * 0.01), 10, 100, mpR2(B * 0.05)], mpRMf, 5)); },
    () => { const s = ri(4, 60) * 100, rr = pick([15, 18]), f = mpFC(s, rr); return mpMcq(`Baki tidak dibayar ${mpRM(s)}, caj kewangan ${rr}% setahun. Caj kewangan sebulan ialah`, mpIkon('kad'), mpOpts(f, [mpR2(s * rr / 100), mpR2(f * 2), mpR2(s * 0.01), mpR2(s * rr / 100 / 365)], v => mpRM(v, true), 1)); }
  ],
  pinjam: [
    () => { const d = mpLoanData(mpRG); return mpMcq(`Faedah bagi pinjaman ${mpRM(d.P)} pada ${mpPc(d.r)} setahun selama ${d.t} tahun ialah`, mpIkon('kereta'), mpOpts(d.I, [d.A, mpSimple(d.P, d.r, 1), d.P * d.r * d.t, mpR2(d.I / 12)], mpRMf, mpStep(d.I))); },
    () => { if (Math.random() < .5) { const H = pick([40, 50, 60, 80, 90, 100, 120]) * 1000, dd = pick([10, 15, 20]), P = H * (100 - dd) / 100; return mpMcq(`Kereta ${mpRM(H)} dengan wang pendahuluan ${dd}%. Jumlah pinjaman ialah`, mpIkon('kereta'), mpOpts(P, [H * dd / 100, H, H + H * dd / 100, H - dd * 100], mpRMf, 1000)); }
      const d = mpLoanData(mpRG); return mpMcq(`Jumlah bayaran balik bagi pinjaman ${mpRM(d.P)} pada ${mpPc(d.r)} setahun selama ${d.t} tahun ialah`, mpIkon('kereta'), mpOpts(d.A, [d.I, mpR2(d.P + mpSimple(d.P, d.r, 1)), mpR2(d.P + 2 * d.I), mpComp(d.P, d.r, 1, d.t)], mpRMf, mpStep(d.A))); },
    () => { const d = mpLoanData(mpRG, true); return mpMcq(`Ansuran bulanan bagi pinjaman ${mpRM(d.P)} pada ${mpPc(d.r)} setahun selama ${d.t} tahun ialah`, mpIkon('kereta'), mpOpts(d.m, [mpR2(d.P / (12 * d.t)), mpR2(d.A / d.t), mpR2(d.A / 12), mpR2((d.P + mpSimple(d.P, d.r, 1)) / (12 * d.t))], mpRMf, 10)); }
  ]
};
const CQT = { faedah: 'Faedah mudah & kompaun', labur: 'Pelaburan & purata kos', kad: 'Kad kredit', pinjam: 'Pinjaman & ansuran' };
function mpCqMake(ty, level) {
  const L = Math.max(0, Math.min(2, level | 0)), fns = CQGEN[ty] || CQGEN.faedah;
  // aras lebih tinggi kadang-kadang mengulang soalan aras lebih rendah supaya pelbagai
  const k = L === 0 ? 0 : Math.random() < .7 ? L : L - 1;
  return fns[k]();
}
function gq(level) {
  const pool = level === 0 ? ['faedah', 'faedah', 'labur', 'kad', 'pinjam'] : Object.keys(CQT);
  return mpCqMake(pick(pool), level);
}
function cq(level, types) {
  const pool = (types && types.length ? types : Object.keys(CQT)).filter(t => CQGEN[t]);
  return mpCqMake(pick(pool.length ? pool : Object.keys(CQT)), level);
}
