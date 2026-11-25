'use strict';
/* =================== ISOMOVE · SOALAN BAB =================== */
// Semua soalan bab ini datang daripada BANK (50 soalan / subtopik, gaya buku teks T2 KSSM).
// Satu bank dipakai oleh Latihan (GEN), Lembaran Kerja (WSPLAN/WG), Cabaran 60 Saat (gq),
// Kuiz Online & game kelas (CQT/cq). Dimuat selepas teras/asas.js.
/* =================== BANK SOALAN GAYA BUKU TEKS (50 soalan / subtopik) ===================
   Setiap item: { l:'m'|'s'|'k', q, fig?, a (jawapan betul ringkas), x:[3 pengganggu], ans? (jawapan penuh), work[] }
   Satu bank dipakai oleh Latihan (GEN), Lembaran Kerja (WSPLAN/WG), Kuiz Online & game kelas (cq), Cabaran 60 Saat (gq). */
const BK = (() => {
  const nrm = P => { const mx = Math.min(...P.map(p => p[0])), my = Math.min(...P.map(p => p[1])); return P.map(([x, y]) => [x - mx, y - my]); };
  const at = (P, ox, oy) => nrm(P).map(([x, y]) => [x + ox, y + oy]);
  const op = {
    tr: P => P,
    ref: P => P.map(([x, y]) => [-x, y]),
    refx: P => P.map(([x, y]) => [x, -y]),
    r90: P => P.map(([x, y]) => [-y, x]),
    r180: P => P.map(([x, y]) => [-x, -y]),
    r270: P => P.map(([x, y]) => [y, -x]),
    sh: P => P.map(([x, y]) => [x + y, y]),            // ricih: rupa bentuk berubah
    st: P => P.map(([x, y]) => [x * 2, y]),            // regang: rupa bentuk berubah
    sc: P => P.map(([x, y]) => [x * 2, y * 2]),        // saiz berubah
    sc15: P => P.map(([x, y]) => [x * 1.5, y * 1.5])
  };
  const SH = {
    L: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 4], [0, 4]],
    trap: [[0, 0], [4, 0], [3, 2], [0, 2]],
    seg3: [[0, 0], [4, 0], [1, 3]],
    sisi4: [[0, 0], [3, 0], [4, 3], [1, 2]],
    pent: [[0, 0], [3, 0], [3, 2], [1, 3], [0, 2]],
    kecil: [[0, 0], [2, 0], [2, 1], [1, 2], [0, 1]]
  };
  const W = P => Math.max(...P.map(p => p[0])), H = P => Math.max(...P.map(p => p[1]));
  // dua bentuk sebelah-menyebelah
  function pair(sh, f, o) {
    o = o || {};
    const A = at(SH[sh], 0, 0), B0 = nrm(op[f](SH[sh])), gap = 2;
    const hh = Math.max(H(A), H(B0));
    const A2 = at(A, 0, Math.round((hh - H(A)) / 2)), B = at(B0, W(A) + gap, Math.round((hh - H(B0)) / 2));
    return { A: A2, B, w: W(B), h: hh };
  }
  const itemsOf = (A, B, cA, cB) => [{ t: 'poly', pts: A, c: cA || 'tr' }, { t: 'poly', pts: B, c: cB || 'pa' }];
  function fig2(sh, f, lab) {
    const p = pair(sh, f);
    const it = itemsOf(p.A, p.B);
    if (lab !== false) {
      it.push({ t: 'text', x: W(p.A) / 2, y: -0.75, s: 'Objek', c: 'tr' });
      it.push({ t: 'text', x: (Math.min(...p.B.map(q => q[0])) + p.w) / 2, y: -0.75, s: 'Imej', c: 'pa' });
    }
    return plot({ x0: -1, x1: p.w + 1, y0: -1.5, y1: p.h + 1, axes: false, items: it, label: 'Objek dan imej', u: 34 });
  }
  // 4 panel (a)–(d)
  function fig4(list) {
    const parts = list.map(([sh, f]) => {
      const p = pair(sh, f);
      return plot({ x0: -1, x1: Math.max(p.w + 1, 9), y0: -1, y1: Math.max(p.h + 1, 5), axes: false, items: itemsOf(p.A, p.B), label: 'Pasangan bentuk', u: 26 });
    });
    const vb = s => s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
    const inner = s => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const cw = Math.max(...parts.map(s => vb(s)[0])), ch = Math.max(...parts.map(s => vb(s)[1]));
    let out = '';
    parts.forEach((s, i) => {
      const [w, h] = vb(s), x = (i % 2) * (cw + 20), y = Math.floor(i / 2) * (ch + 34);
      out += `<text x="${x + 4}" y="${y + 22}" style="fill:var(--tx)" font-size="20" font-weight="800">(${'abcd'[i]})</text>`;
      out += `<svg x="${x}" y="${y + 26}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner(s)}</svg>`;
    });
    return `<svg viewBox="0 0 ${2 * cw + 20} ${2 * ch + 60}" role="img" aria-label="Empat pasangan bentuk (a) hingga (d)" font-family="Inter, sans-serif">${out}</svg>`;
  }
  // label bucu & sisi di luar poligon
  const cen = P => [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
  function vlab(P, letters, c) {
    const n = P.length, area = P.reduce((s, [x, y], i) => s + x * P[(i + 1) % n][1] - P[(i + 1) % n][0] * y, 0), sg = Math.sign(area) || 1;
    return P.map(([x, y], i) => {
      const [ax, ay] = P[(i + n - 1) % n], [bx, by] = P[(i + 1) % n];
      const u1 = [x - ax, y - ay], u2 = [x - bx, y - by], l1 = Math.hypot(...u1), l2 = Math.hypot(...u2);
      let dx = u1[0] / l1 + u2[0] / l2, dy = u1[1] / l1 + u2[1] / l2;
      const cross = (x - ax) * (by - y) - (y - ay) * (bx - x);
      if (cross * sg < 0) { dx = -dx; dy = -dy; }          // bucu cekung: label ke luar
      const d = Math.hypot(dx, dy) || 1;
      return { t: 'text', x: x + dx / d * .55, y: y + dy / d * .55 - .2, s: letters[i], c, size: 18 };
    });
  }
  function slab(P, vals, c) {
    const [cx, cy] = cen(P);
    return P.map(([x, y], i) => {
      if (vals[i] == null) return null;
      const [x2, y2] = P[(i + 1) % P.length], mx = (x + x2) / 2, my = (y + y2) / 2, dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1;
      return { t: 'text', x: mx + dx / d * .55, y: my + dy / d * .55 - .2, s: vals[i], c: c || 'mu', size: 14 };
    }).filter(Boolean);
  }
  // objek berlabel + imej berlabel (imej[i] sepadan objek[i])
  function figMap(O, f, ol, il, o) {
    o = o || {};
    const A = at(O, 0, 0), B0 = nrm(op[f](O)), hh = Math.max(H(A), H(B0));
    const A2 = at(A, 0, (hh - H(A)) / 2), B = at(B0, W(A) + 3, (hh - H(B0)) / 2);
    const it = itemsOf(A2, B).concat(vlab(A2, ol, 'tr'), vlab(B, il, 'pa'));
    if (o.sa) it.push(...slab(A2, o.sa)); if (o.sb) it.push(...slab(B, o.sb));
    return plot({ x0: -1, x1: W(B) + 1, y0: -1, y1: hh + 1, axes: false, items: it, label: 'Objek dan imej berlabel', u: 40 });
  }
  return { fig2, fig4, figMap, SH, op };
})();

const BANK = {};
BANK['11.1'] = (() => {
  const Q = [];
  const add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));

  /* ---- Mudah: konsep (6) ---- */
  add('m', 'Dalam suatu transformasi, bentuk asal sebelum transformasi dinamakan ____.', 'Objek', ['Imej', 'Paksi', 'Vektor'],
    ['Sebelum transformasi berlaku, bentuk asal dinamakan <b>objek</b>.', 'Selepas transformasi, bentuk itu dinamakan imej.']);
  add('m', 'Bentuk yang terhasil selepas suatu transformasi dinamakan ____.', 'Imej', ['Objek', 'Pusat', 'Sudut'],
    ['Bentuk asal ialah objek.', 'Bentuk yang terhasil selepas transformasi dinamakan <b>imej</b>.']);
  add('m', 'Dua objek adalah kongruen jika kedua-duanya mempunyai ____.', 'bentuk dan saiz yang sama', ['bentuk sama, saiz berbeza', 'saiz sama, bentuk berbeza', 'orientasi yang sama sahaja'],
    ['Kongruen ialah perihal <b>sama bentuk dan sama saiz</b>.', 'Orientasi tidak diambil kira.']);
  add('m', 'Apakah yang dimaksudkan dengan orientasi?', 'Hala sesuatu objek', ['Saiz sesuatu objek', 'Luas sesuatu objek', 'Bilangan bucu objek'],
    ['Orientasi ialah <b>hala</b> sesuatu.', 'Contohnya arah jam, lawan arah jam, sebelah kiri dan sebelah kanan.'],
    { ans: 'Hala sesuatu objek, contohnya arah jam, lawan arah jam, kiri atau kanan' });
  add('m', 'Transformasi melibatkan ____ titik pada suatu satah.', 'pemindahan', ['pembesaran', 'pemotongan', 'penambahan'],
    ['Transformasi melibatkan <b>pemindahan</b> titik pada suatu satah.', 'Setiap titik objek mengikut corak pergerakan yang sama.']);
  add('m', 'Setiap titik pada objek dipetakan kepada tepat satu titik pada imej. Apakah nama padanan ini?', 'Padanan satu-dengan-satu', ['Padanan satu-dengan-banyak', 'Padanan banyak-dengan-satu', 'Padanan banyak-dengan-banyak'],
    ['Satu titik objek sepadan dengan <b>satu</b> titik imej sahaja.', 'Maka padanan itu ialah padanan satu-dengan-satu.']);

  /* ---- Mudah: situasi harian (4) ---- */
  add('m', 'Duit syiling 10 sen dan duit syiling 20 sen kedua-duanya berbentuk bulat. Adakah kedua-dua syiling itu kongruen?', 'Tidak, saiznya berbeza', ['Ya, bentuknya sama', 'Ya, kedua-duanya bulat', 'Tidak, bentuknya berbeza'],
    ['Kedua-dua syiling bulat, jadi bentuknya sama.', 'Tetapi saiz syiling 20 sen lebih besar.', 'Bentuk sama tetapi saiz berbeza → <b>tidak kongruen</b> (hanya serupa).']);
  add('m', 'Dua keping duit syiling 10 sen diletakkan di atas meja. Adakah kedua-dua syiling itu kongruen?', 'Ya, bentuk dan saiznya sama', ['Tidak, kedudukannya berbeza', 'Tidak, orientasinya berbeza', 'Ya, kerana warnanya sama'],
    ['Semua syiling 10 sen mempunyai bentuk dan saiz yang sama.', 'Kedudukan tidak diambil kira.', 'Maka kedua-duanya <b>kongruen</b>.']);
  add('m', 'Akmal berjalan dari rumahnya ke perhentian bas. Apakah yang berubah pada Akmal?', 'Kedudukannya', ['Saiznya', 'Rupa bentuknya', 'Saiz dan rupa bentuknya'],
    ['Akmal berpindah dari satu tempat ke tempat lain.', 'Rupa bentuk dan saiznya tidak berubah.', 'Hanya <b>kedudukannya</b> yang berubah.']);
  add('m', 'Bilah kipas siling berpusing. Adakah rupa bentuk dan saiz bilah kipas itu berubah?', 'Tidak berubah', ['Rupa bentuk berubah', 'Saiz berubah', 'Rupa bentuk dan saiz berubah'],
    ['Bilah kipas hanya berpusing pada satu titik.', 'Kedudukan dan orientasinya berubah.', 'Rupa bentuk dan saiznya <b>tidak berubah</b>.'],
    { ans: 'Tidak berubah; hanya kedudukan dan orientasi berubah' });

  /* ---- Mudah: transformasi atau bukan (7) ---- */
  const TY = 'Transformasi, rupa bentuk tidak berubah', TN = 'Bukan transformasi, rupa bentuk berubah';
  const tfX = ok => ok ? [TN, 'Transformasi, rupa bentuk berubah', 'Bukan transformasi, kedudukan berubah'] : [TY, 'Transformasi, rupa bentuk berubah', 'Bukan transformasi, kedudukan berubah'];
  const tfW = ok => ok ? ['Bandingkan rupa bentuk objek dan imej.', 'Rupa bentuk imej <b>sama</b> dengan objek; hanya kedudukan atau orientasi berubah.', 'Maka ini ialah transformasi.'] : ['Bandingkan rupa bentuk objek dan imej.', 'Rupa bentuk imej <b>berubah</b> (sudut dan sisi tidak sama).', 'Maka ini bukan transformasi.'];
  [['L', 'tr', 1, 'Adakah rajah di bawah menunjukkan suatu transformasi? Berikan sebab.'],
   ['trap', 'sh', 0, 'Objek (biru) dipetakan kepada imej (oren). Adakah ini suatu transformasi? Mengapa?'],
   ['seg3', 'r90', 1, 'Rajah di bawah menunjukkan objek dan imej. Adakah ini suatu transformasi? Berikan sebab.'],
   ['pent', 'ref', 1, 'Adakah imej (oren) terhasil daripada suatu transformasi ke atas objek (biru)? Terangkan.'],
   ['sisi4', 'st', 0, 'Adakah rajah di bawah menunjukkan suatu transformasi? Berikan sebab.'],
   ['L', 'sh', 0, 'Objek (biru) dan imej (oren) ditunjukkan di bawah. Adakah ini suatu transformasi? Mengapa?'],
   ['trap', 'ref', 1, 'Rajah di bawah menunjukkan objek dan imej. Adakah ini suatu transformasi? Berikan sebab.']
  ].forEach(([sh, f, ok, q]) => add('m', q, ok ? TY : TN, tfX(ok), tfW(ok), { fig: BK.fig2(sh, f) }));

  /* ---- Mudah: kongruen atau tidak (8) ---- */
  const KY = 'Kongruen, bentuk dan saiz sama', KS = 'Tidak kongruen, saiz tidak sama', KB = 'Tidak kongruen, bentuk tidak sama', KO = 'Tidak kongruen, orientasi berbeza';
  const kgW = { Y: ['Bandingkan bentuk dan saiz kedua-dua rajah.', 'Bentuk dan saiznya <b>sama</b>; hanya kedudukan atau orientasi berbeza.', 'Maka kedua-duanya kongruen.'],
    S: ['Bentuk kedua-dua rajah sama.', 'Tetapi saiznya <b>tidak sama</b>.', 'Maka kedua-duanya tidak kongruen.'],
    B: ['Bandingkan sudut dan sisi kedua-dua rajah.', 'Bentuknya <b>tidak sama</b>.', 'Maka kedua-duanya tidak kongruen.'] };
  const kgA = { Y: KY, S: KS, B: KB }, kgX = { Y: [KS, KB, KO], S: [KY, KB, KO], B: [KY, KS, KO] };
  [['seg3', 'r90', 'Y', 'Adakah kedua-dua rajah di bawah kongruen? Nyatakan sebabnya.'],
   ['L', 'sc', 'S', 'Kenal pasti sama ada pasangan rajah di bawah kongruen dan nyatakan sebabnya.'],
   ['trap', 'ref', 'Y', 'Adakah pasangan rajah di bawah kongruen? Nyatakan sebabnya.'],
   ['sisi4', 'tr', 'Y', 'Kenal pasti sama ada pasangan rajah di bawah kongruen dan nyatakan sebabnya.'],
   ['kecil', 'sc', 'S', 'Adakah kedua-dua rajah di bawah kongruen? Nyatakan sebabnya.'],
   ['L', 'r180', 'Y', 'Adakah pasangan rajah di bawah kongruen? Nyatakan sebabnya.'],
   ['seg3', 'sc', 'S', 'Kenal pasti sama ada pasangan rajah di bawah kongruen dan nyatakan sebabnya.'],
   ['sisi4', 'sh', 'B', 'Adakah kedua-dua rajah di bawah kongruen? Nyatakan sebabnya.']
  ].forEach(([sh, f, k, q]) => add('m', q, kgA[k], kgX[k], kgW[k], { fig: BK.fig2(sh, f, false) }));

  /* ---- Sederhana: pilih satu daripada (a)–(d) (4) ---- */
  const AD = ['(a)', '(b)', '(c)', '(d)'], adX = c => AD.filter(v => v !== c);
  add('s', 'Antara rajah berikut, yang manakah menunjukkan <b>bukan</b> suatu transformasi?', '(c)', adX('(c)'),
    ['Semak rupa bentuk objek dan imej bagi setiap rajah.', '(a), (b) dan (d): rupa bentuk tidak berubah.', '(c): rupa bentuk berubah, maka <b>bukan transformasi</b>.'],
    { fig: BK.fig4([['L', 'tr'], ['seg3', 'r90'], ['trap', 'sh'], ['pent', 'ref']]) });
  add('s', 'Antara rajah berikut, yang manakah menunjukkan <b>bukan</b> suatu transformasi?', '(a)', adX('(a)'),
    ['Semak rupa bentuk objek dan imej bagi setiap rajah.', '(a): rupa bentuk berubah, maka <b>bukan transformasi</b>.', '(b), (c) dan (d): rupa bentuk tidak berubah.'],
    { fig: BK.fig4([['sisi4', 'st'], ['L', 'r180'], ['trap', 'tr'], ['seg3', 'ref']]) });
  add('s', 'Antara pasangan rajah berikut, yang manakah kongruen?', '(d)', adX('(d)'),
    ['Kongruen bermaksud sama bentuk dan sama saiz.', '(a) dan (c): saiz tidak sama. (b): bentuk tidak sama.', '(d): bentuk dan saiz sama, maka <b>kongruen</b>.'],
    { fig: BK.fig4([['seg3', 'sc'], ['L', 'sh'], ['kecil', 'sc'], ['trap', 'r180']]) });
  add('s', 'Antara pasangan rajah berikut, yang manakah kongruen?', '(b)', adX('(b)'),
    ['Kongruen bermaksud sama bentuk dan sama saiz.', '(b): bentuk dan saiz sama walaupun orientasi berbeza, maka <b>kongruen</b>.', '(a) dan (d): saiz tidak sama. (c): bentuk tidak sama.'],
    { fig: BK.fig4([['L', 'sc'], ['pent', 'ref'], ['trap', 'st'], ['kecil', 'sc']]) });

  /* ---- Sederhana: padanan titik, sisi, sudut (10) ---- */
  const mapQs = (O, f, ol, il, list) => {
    const fig = BK.figMap(O, f, ol, il), n = ol.length, I = c => il[ol.indexOf(c)];
    list.forEach(([kind, s, q]) => {
      let a, x, w;
      if (kind === 'pt') { a = I(s); x = il.split('').filter(c => c !== a).slice(0, 3); w = [`Cari bucu imej yang berada pada kedudukan yang sama dengan bucu ${s} pada objek.`, `Imej bagi titik ${s} ialah <b>${a}</b>.`]; }
      if (kind === 'obj') { a = ol[il.indexOf(s)]; x = ol.split('').filter(c => c !== a).slice(0, 3); w = [`Titik ${s} pada imej sepadan dengan satu bucu objek.`, `Objek bagi titik ${s} ialah <b>${a}</b>.`]; }
      if (kind === 'sisi') {
        a = I(s[0]) + I(s[1]);
        const i0 = ol.indexOf(s[0]), cand = [];
        for (let k = 0; k < n; k++) { const e = il[k] + il[(k + 1) % n]; if (e !== a && e.split('').reverse().join('') !== a) cand.push(e); }
        x = cand.slice(0, 3); w = [`Imej bagi ${s[0]} ialah ${I(s[0])} dan imej bagi ${s[1]} ialah ${I(s[1])}.`, `Maka imej bagi sisi ${s} ialah <b>${a}</b>.`];
      }
      if (kind === 'sud') {
        a = '∠' + I(s[0]) + I(s[1]) + I(s[2]);
        const cand = [];
        for (let k = 0; k < n; k++) { const v = '∠' + il[(k + n - 1) % n] + il[k] + il[(k + 1) % n]; if (il[k] !== I(s[1])) cand.push(v); }
        x = cand.slice(0, 3); w = [`Padankan setiap bucu: ${s[0]} → ${I(s[0])}, ${s[1]} → ${I(s[1])}, ${s[2]} → ${I(s[2])}.`, `Maka imej bagi ∠${s} ialah <b>${a}</b>.`];
      }
      add('s', q, a, x, w, { fig });
    });
  };
  mapQs(BK.SH.pent, 'r90', 'ABCDE', 'RSTPQ', [
    ['pt', 'C', 'Pentagon ABCDE (biru) dipetakan kepada pentagon (oren) di bawah suatu transformasi. Nyatakan imej bagi titik C.'],
    ['sisi', 'AB', 'Pentagon ABCDE dipetakan kepada pentagon oren di bawah suatu transformasi. Nyatakan imej bagi sisi AB.'],
    ['sud', 'BCD', 'Pentagon ABCDE dipetakan kepada pentagon oren di bawah suatu transformasi. Nyatakan imej bagi ∠BCD.'],
    ['obj', 'Q', 'Pentagon oren ialah imej bagi pentagon ABCDE. Nyatakan objek bagi titik Q.']]);
  mapQs(BK.SH.L, 'ref', 'ABCDEF', 'NMLKQP', [
    ['pt', 'D', 'Rajah di bawah menunjukkan ABCDEF ialah objek dan bentuk oren ialah imej. Nyatakan imej bagi titik D.'],
    ['sisi', 'EF', 'ABCDEF ialah objek dan bentuk oren ialah imej. Nyatakan imej bagi garisan EF.'],
    ['obj', 'L', 'ABCDEF ialah objek dan bentuk oren ialah imej. Nyatakan objek bagi titik L.']]);
  mapQs(BK.SH.sisi4, 'r180', 'ABCD', 'YZWX', [
    ['pt', 'B', 'Sisi empat ABCD dipetakan kepada sisi empat oren di bawah suatu transformasi. Kenal pasti imej bagi bucu B.'],
    ['sud', 'DAB', 'Sisi empat ABCD dipetakan kepada sisi empat oren. Kenal pasti imej bagi ∠DAB.'],
    ['sisi', 'CD', 'Sisi empat ABCD dipetakan kepada sisi empat oren. Kenal pasti imej bagi panjang CD.']]);

  /* ---- Sederhana & Sukar: dua segi tiga kongruen (6) ---- */
  const T1 = [[0, 0], [4, 0], [0, 3]];            // PQR: PQ = 4, QR = 5, RP = 3
  const f1 = BK.figMap(T1, 'r90', 'PQR', 'BCA', { sa: ['4 cm', '5 cm', '3 cm'], sb: ['4 cm', '5 cm', '3 cm'] });
  add('s', 'Segi tiga PQR dan segi tiga ABC di bawah adalah kongruen. Sisi manakah pada segi tiga ABC yang sepadan dengan sisi PQ?', 'BC', ['AB', 'CA', 'PQ'],
    ['PQ = 4 cm.', 'Sisi segi tiga ABC yang panjangnya 4 cm ialah <b>BC</b>.'], { fig: f1 });
  add('s', 'Segi tiga PQR dan segi tiga ABC di bawah adalah kongruen. Sudut manakah yang sepadan dengan ∠PQR?', '∠BCA', ['∠CAB', '∠ABC', '∠PRQ'],
    ['P sepadan dengan B, Q sepadan dengan C, R sepadan dengan A.', 'Maka ∠PQR sepadan dengan <b>∠BCA</b>.'], { fig: f1 });
  add('s', 'Segi tiga PQR dan segi tiga ABC di bawah adalah kongruen. Sisi manakah pada segi tiga PQR yang sepadan dengan sisi AB?', 'RP', ['PQ', 'QR', 'BC'],
    ['AB = 3 cm.', 'Sisi segi tiga PQR yang panjangnya 3 cm ialah <b>RP</b>.'], { fig: f1 });
  const T2 = [[0, 0], [5, 0], [1.5, 2.5]];        // KLM: KL = 11, LM = 8, MK = 5 (tidak ikut skala)
  const f2 = BK.figMap(T2, 'ref', 'KLM', 'XZY', { sa: ['11 cm', '8 cm', '5 cm'], sb: ['11 cm', '8 cm', '5 cm'] });
  add('k', 'Segi tiga KLM dan segi tiga XYZ adalah kongruen (rajah tidak dilukis mengikut skala). Lengkapkan: sisi yang sepadan dengan LM ialah ____ dan sudut yang sepadan dengan ∠KLM ialah ____.', 'ZY; ∠XZY', ['XY; ∠XYZ', 'ZY; ∠XYZ', 'XZ; ∠ZXY'],
    ['LM = 8 cm, maka sisi sepadan ialah ZY (8 cm).', 'K → X, L → Z, M → Y.', 'Maka ∠KLM sepadan dengan <b>∠XZY</b>.'], { fig: f2, ans: 'LM ↔ ZY; ∠KLM ↔ ∠XZY' });
  add('k', 'Segi tiga KLM dan segi tiga XYZ adalah kongruen (rajah tidak dilukis mengikut skala). Diberi ∠LKM = 38°. Sudut manakah pada segi tiga XYZ yang bernilai 38°?', '∠ZXY', ['∠XYZ', '∠XZY', '∠KLM'],
    ['K sepadan dengan X kerana sisi 11 cm dan 5 cm bertemu di K dan di X.', 'Sudut sepadan adalah sama besar.', 'Maka <b>∠ZXY</b> = 38°.'], { fig: f2 });
  add('k', 'Segi tiga KLM dan segi tiga XYZ adalah kongruen (rajah tidak dilukis mengikut skala). Hitung perimeter segi tiga XYZ.', '24 cm', ['19 cm', '16 cm', '48 cm'],
    ['Segi tiga kongruen mempunyai sisi yang sama panjang.', 'Perimeter XYZ = 11 + 8 + 5 = <b>24 cm</b>.'], { fig: f2 });

  /* ---- Sukar: penyelesaian masalah kekongruenan (5) ---- */
  add('k', 'Segi tiga ABC kongruen dengan segi tiga PQR, dengan A sepadan dengan P, B sepadan dengan Q dan C sepadan dengan R. Diberi ∠A = 48° dan ∠B = 75°. Hitung ∠R.', '57°', ['48°', '75°', '123°'],
    ['∠C = 180° − 48° − 75° = 57°.', 'C sepadan dengan R, maka ∠R = ∠C = <b>57°</b>.']);
  add('k', 'Sisi empat ABCD kongruen dengan sisi empat PQRS. Diberi AB = 7 cm, BC = 5 cm, CD = 6 cm dan DA = 4 cm. Hitung perimeter sisi empat PQRS.', '22 cm', ['18 cm', '11 cm', '44 cm'],
    ['Bentuk kongruen mempunyai sisi sepadan yang sama panjang.', 'Perimeter PQRS = perimeter ABCD = 7 + 5 + 6 + 4 = <b>22 cm</b>.']);
  add('k', 'Segi tiga KLM kongruen dengan segi tiga XYZ, dengan K ↔ X, L ↔ Y dan M ↔ Z. Diberi KL = 9 cm, LM = 12 cm dan ∠KLM = 90°. Hitung luas segi tiga XYZ.', '54 cm²', ['108 cm²', '21 cm²', '42 cm²'],
    ['XY = KL = 9 cm, YZ = LM = 12 cm dan ∠XYZ = 90°.', 'Luas = ' + fr(1, 2) + ' × 9 × 12 = <b>54 cm²</b>.']);
  add('k', 'Dua segi empat tepat adalah kongruen. Satu daripadanya berukuran 8 cm × 5 cm. Hitung luas segi empat tepat yang satu lagi.', '40 cm²', ['13 cm²', '26 cm²', '80 cm²'],
    ['Bentuk kongruen mempunyai saiz yang sama.', 'Maka ukurannya juga 8 cm × 5 cm.', 'Luas = 8 × 5 = <b>40 cm²</b>.']);
  add('k', 'Segi tiga DEF kongruen dengan segi tiga RST, dengan D ↔ R, E ↔ S dan F ↔ T. Diberi ∠D = 2x°, ∠S = 70° dan ∠T = 50°. Cari nilai x.', 'x = 30', ['x = 60', 'x = 35', 'x = 25'],
    ['∠R = 180° − 70° − 50° = 60°.', 'D sepadan dengan R, maka 2x = 60.', '<b>x = 30</b>.']);
  return Q;
})();


/* ---------- pembantu rajah satah Cartes & pengganggu ---------- */
const BK2 = (() => {
  const bnd = (all, pad) => { const xs = all.map(p => p[0]).concat(0), ys = all.map(p => p[1]).concat(0); return { x0: Math.floor(Math.min(...xs)) - pad, x1: Math.ceil(Math.max(...xs)) + pad, y0: Math.floor(Math.min(...ys)) - pad, y1: Math.ceil(Math.max(...ys)) + pad }; };
  // o = { pts:[[x,y,label,col]], polys:[[pts,col,dash]], lines:[[a,b,col,dash,label]], axes, pad, extra:[[x,y]] }
  function cart(o) {
    const all = [];
    (o.pts || []).forEach(p => all.push([p[0], p[1]]));
    (o.polys || []).forEach(p => all.push(...p[0]));
    (o.extra || []).forEach(p => all.push(p));
    const b = bnd(all, o.pad == null ? 1 : o.pad), it = [];
    (o.lines || []).forEach(([a, c2, col, dash, lab]) => {
      it.push({ t: 'line', a, b: c2, c: col || 'pa', dash: dash !== false, w: 3 });
      if (lab) it.push({ t: 'text', x: c2[0] + .2, y: c2[1] + .3, s: lab, c: col || 'pa', anchor: 'start', size: 15 });
    });
    (o.polys || []).forEach(([pts, c, dash]) => it.push({ t: 'poly', pts, c, dash }));
    (o.pts || []).forEach(([x, y, l, c, dx, dy]) => it.push({ t: 'pt', x, y, l, c: c || 'tr', dx, dy }));
    if (o.axes === false) { b.x0 = Math.min(b.x0, ...all.map(p => p[0])); }
    return plot(Object.assign(b, { axes: o.axes !== false, items: it, label: o.label || 'Rajah pada grid', u: o.u || 34 }));
  }
  // pengganggu titik: buang yang sama dengan jawapan / berulang
  function dPts(ans, cands) {
    const k = p => p[0] + ',' + p[1], seen = new Set([k(ans)]), out = [];
    cands = cands.concat([[ans[0] + 1, ans[1]], [ans[0], ans[1] - 1], [ans[0] - 1, ans[1] + 1], [ans[1], ans[0]]]);
    for (const c of cands) { if (!seen.has(k(c))) { seen.add(k(c)); out.push(c); } if (out.length === 3) break; }
    return out;
  }
  const dNum = (ans, cands) => { const seen = new Set([String(ans)]), out = []; for (const c of cands) { if (!seen.has(String(c))) { seen.add(String(c)); out.push(c); } if (out.length === 3) break; } return out; };
  const rot = (x, y, cx, cy, t) => { const dx = x - cx, dy = y - cy; return t === 90 ? [cx - dy, cy + dx] : t === 180 ? [cx - dx, cy - dy] : [cx + dy, cy - dx]; }; // t: 90 lawan, 180, 270 lawan (=90 ikut)
  return { cart, dPts, dNum, rot };
})();

/* ======================= 11.2 TRANSLASI ======================= */
BANK['11.2'] = (() => {
  const Q = [], add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));
  const V = (a, b) => vec(a, b), PP = p => P(p[0], p[1]);
  const vX = (a, b) => [V(b, a), V(-a, -b), V(a, -b), V(-a, b), V(a + 1, b), V(a, b - 1)].filter(s => s !== V(a, b)).filter((s, i, A) => A.indexOf(s) === i).slice(0, 3);
  const arahW = (a, b) => [`${a > 0 ? 'Ke kanan → positif' : a < 0 ? 'Ke kiri → negatif' : 'Tiada gerakan mengufuk → 0'}: a = ${fmt(a)}.`, `${b > 0 ? 'Ke atas → positif' : b < 0 ? 'Ke bawah → negatif' : 'Tiada gerakan mencancang → 0'}: b = ${fmt(b)}.`, `Vektor translasi = ${V(a, b)}.`];

  /* Mudah: konsep (4) */
  add('m', 'Translasi ialah pemindahan semua titik pada suatu satah mengikut ____ yang sama dan melalui jarak yang sama.', 'arah', ['saiz', 'sudut', 'paksi'],
    ['Dalam translasi, semua titik bergerak mengikut <b>arah</b> yang sama dan melalui jarak yang sama.']);
  add('m', 'Di bawah suatu translasi, objek dan imej mempunyai bentuk, saiz dan ____ yang sama.', 'orientasi', ['kedudukan', 'koordinat', 'paksi simetri'],
    ['Translasi hanya mengubah kedudukan.', 'Bentuk, saiz dan <b>orientasi</b> imej sama dengan objek.']);
  add('m', `Dalam vektor translasi ${V('a', 'b')}, nilai a yang positif bermaksud objek bergerak ke ____.`, 'kanan', ['kiri', 'atas', 'bawah'],
    ['a mewakili gerakan selari dengan paksi-x.', 'a positif → bergerak ke <b>kanan</b>; a negatif → ke kiri.']);
  add('m', `Dalam vektor translasi ${V('a', 'b')}, nilai b yang negatif bermaksud objek bergerak ke ____.`, 'bawah', ['atas', 'kanan', 'kiri'],
    ['b mewakili gerakan selari dengan paksi-y.', 'b positif → ke atas; b negatif → ke <b>bawah</b>.']);

  /* Mudah: kenal translasi (4) */
  const TY = 'Translasi, orientasi sama', TN = 'Bukan translasi, orientasi berubah';
  [['L', 'tr', 1], ['L', 'ref', 0], ['trap', 'tr', 1], ['seg3', 'r90', 0]].forEach(([sh, f, ok]) =>
    add('m', 'Adakah rajah di bawah menunjukkan suatu translasi? Berikan justifikasi.', ok ? TY : TN, ok ? [TN, 'Bukan translasi, saiz berubah', 'Translasi, orientasi berubah'] : [TY, 'Bukan translasi, saiz berubah', 'Translasi, orientasi berubah'],
      ok ? ['Bandingkan bentuk, saiz dan orientasi objek dan imej.', 'Ketiga-tiganya <b>sama</b>; hanya kedudukan berubah.', 'Maka ini ialah translasi.'] : ['Bandingkan orientasi objek dan imej.', 'Orientasi imej <b>berubah</b> (terbalik atau berpusing).', 'Maka ini bukan translasi.'],
      { fig: BK.fig2(sh, f) }));

  /* Mudah: huraian kata → vektor (5) */
  [[3, -2], [-4, 1], [5, 0], [0, 4], [-2, -5]].forEach(([a, b]) => {
    const t = [a ? `${Math.abs(a)} unit ke ${a > 0 ? 'kanan' : 'kiri'}` : '', b ? `${Math.abs(b)} unit ke ${b > 0 ? 'atas' : 'bawah'}` : ''].filter(Boolean).join(' dan ');
    add('m', `Suatu objek bergerak ${t}. Tulis translasi itu dalam bentuk vektor.`, V(a, b), vX(a, b), arahW(a, b));
  });

  /* Mudah: vektor daripada rajah titik (5) */
  [[[-3, -2], [0, 2]], [[2, 3], [-1, 1]], [[-2, 1], [3, -2]], [[1, -3], [1, 2]], [[3, 2], [-2, 2]]].forEach(([p, q]) => {
    const a = q[0] - p[0], b = q[1] - p[1];
    add('m', 'Rajah di bawah menunjukkan titik P dan imejnya P′ di bawah suatu translasi. Tentukan vektor translasi itu.', V(a, b), vX(a, b), arahW(a, b),
      { fig: BK2.cart({ pts: [[p[0], p[1], 'P', 'tr'], [q[0], q[1], 'P′', 'pa']], lines: [[p, q, 'gr', true]] }) });
  });

  /* Mudah: koordinat imej (7) */
  [[[5, -3], [2, 2]], [[5, -3], [4, 6]], [[5, -3], [-3, -1]], [[5, -3], [-2, -5]], [[2, 4], [-3, 1]], [[-1, -2], [4, 3]], [[0, 5], [-2, -6]]].forEach(([[x, y], [a, b]], i) => {
    const X = x + a, Y = y + b;
    add('m', i < 4 ? `Tentukan koordinat imej bagi objek ${P(x, y)} di bawah translasi ${V(a, b)}.` : `Titik Q${P(x, y)} ditranslasikan oleh ${V(a, b)}. Cari koordinat imej Q′.`,
      P(X, Y), BK2.dPts([X, Y], [[x - a, y - b], [x + b, y + a], [X, y - b], [x + a, y - b], [X + 1, Y]]).map(PP),
      [`Imej = ${V(x, y)} + ${V(a, b)}.`, `x′ = ${fmt(x)} + ${par(a)} = ${fmt(X)}, y′ = ${fmt(y)} + ${par(b)} = ${fmt(Y)}.`, `Koordinat imej = <b>${P(X, Y)}</b>.`]);
  });

  /* Sederhana: koordinat objek (6) */
  [[[-2, 3], [1, 4]], [[-2, 3], [-3, 5]], [[-2, 3], [6, 0]], [[-2, 3], [4, -2]], [[-5, 2], [3, -1]], [[8, 1], [-2, -4]]].forEach(([[X, Y], [a, b]], i) => {
    const x = X - a, y = Y - b;
    add('s', i < 4 ? `Tentukan koordinat objek bagi imej ${P(X, Y)} di bawah translasi ${V(a, b)}.` : `A′${P(X, Y)} ialah imej bagi titik A di bawah translasi ${V(a, b)}. Cari koordinat A.`,
      P(x, y), BK2.dPts([x, y], [[X + a, Y + b], [X - a, Y + b], [X + a, Y - b], [X - b, Y - a]]).map(PP),
      ['Untuk mencari objek, tolak vektor translasi daripada imej.', `x = ${fmt(X)} − ${par(a)} = ${fmt(x)}, y = ${fmt(Y)} − ${par(b)} = ${fmt(y)}.`, `Koordinat objek = <b>${P(x, y)}</b>.`]);
  });

  /* Sederhana: vektor daripada koordinat (5) */
  [[[2, 1], [5, 4], 'A'], [[6, 3], [-1, 1], 'B'], [[-3, 4], [2, -2], 'C'], [[0, -5], [-4, 0], 'D'], [[7, -2], [7, 3], 'E']].forEach(([[x, y], [X, Y], L]) => {
    const a = X - x, b = Y - y;
    add('s', `Nyatakan vektor translasi yang memetakan ${L}${P(x, y)} kepada ${L}′${P(X, Y)}.`, V(a, b), vX(a, b),
      [`Vektor translasi = ${V("x′ − x", "y′ − y")}.`, `= ${V(`${fmt(X)} − ${par(x)}`, `${fmt(Y)} − ${par(y)}`)} = <b>${V(a, b)}</b>.`]);
  });

  /* Sederhana: vektor daripada rajah bentuk (3) */
  [[BK.SH.seg3, [-4, -3], [5, 2]], [BK.SH.L, [1, 2], [-5, -4]], [BK.SH.trap, [-5, 2], [6, -3]]].forEach(([S, [ox, oy], [a, b]]) => {
    const A = S.map(([x, y]) => [x + ox, y + oy]), B = A.map(([x, y]) => [x + a, y + b]);
    add('s', 'Rajah di bawah menunjukkan objek (biru) dan imejnya (oren) di bawah suatu translasi. Tentukan vektor translasi itu.', V(a, b), vX(a, b),
      ['Pilih satu bucu objek dan bucu sepadan pada imej.', `Gerakan mengufuk = ${fmt(a)}, gerakan mencancang = ${fmt(b)}.`, `Vektor translasi = <b>${V(a, b)}</b>.`],
      { fig: BK2.cart({ polys: [[A, 'tr'], [B, 'pa']] }) });
  });

  /* Sederhana: bucu imej segi tiga (3) */
  [[[[1, 1], [4, 1], [1, 3]], [-2, 3], 1, 'B'], [[[-3, 0], [0, 2], [-2, 4]], [4, -3], 2, 'C'], [[[2, -1], [5, -1], [5, 2]], [-6, 2], 0, 'A']].forEach(([T, [a, b], k, L]) => {
    const [x, y] = T[k], X = x + a, Y = y + b;
    add('s', `Segi tiga ABC dengan A${P(...T[0])}, B${P(...T[1])} dan C${P(...T[2])} ditranslasikan oleh ${V(a, b)}. Nyatakan koordinat ${L}′.`,
      P(X, Y), BK2.dPts([X, Y], [[x - a, y - b], [x + b, y + a], [X, y], [x, Y]]).map(PP),
      [`${L}${P(x, y)} + ${V(a, b)}.`, `${L}′ = (${fmt(x)} + ${par(a)}, ${fmt(y)} + ${par(b)}) = <b>${P(X, Y)}</b>.`],
      { fig: BK2.cart({ polys: [[T, 'tr']], pts: T.map((p, i) => [p[0], p[1], 'ABC'[i], 'tr']) }) });
  });

  /* Sukar: translasi yang sama (3) */
  const tk = [-3, 2];
  add('k', `Titik K${P(2, 3)} dipetakan kepada K′${P(-1, 5)} di bawah suatu translasi. Cari imej bagi titik A${P(4, -1)} di bawah translasi yang sama.`, P(1, 1), [P(7, -3), P(1, -1), P(6, -4)].slice(0, 3),
    [`Vektor translasi = ${V('−1 − 2', '5 − 3')} = ${V(-3, 2)}.`, `A′ = (4 + (−3), −1 + 2) = <b>${P(1, 1)}</b>.`]);
  add('k', `Titik K${P(2, 3)} dipetakan kepada K′${P(-1, 5)} di bawah suatu translasi. Cari objek bagi titik S′${P(0, 2)} di bawah translasi yang sama.`, P(3, 0), [P(-3, 4), P(3, 4), P(-3, 0)],
    [`Vektor translasi = ${V(-3, 2)}.`, `Objek = imej − vektor = (0 − (−3), 2 − 2) = <b>${P(3, 0)}</b>.`]);
  add('k', `Di bawah suatu translasi, M${P(-4, 1)} dipetakan kepada M′${P(1, -2)}. Titik J${P(-3, -2)} dan imejnya J′ ditranslasikan dengan translasi yang sama. Cari koordinat J′.`, P(2, -5), [P(-8, 1), P(2, 1), P(-2, -5)],
    [`Vektor translasi = ${V('1 − (−4)', '−2 − 1')} = ${V(5, -3)}.`, `J′ = (−3 + 5, −2 + (−3)) = <b>${P(2, -5)}</b>.`]);

  /* Sukar: papan catur (3) */
  const board = (() => {
    const it = [];
    const pcs = [[1, 4, 'A'], [5, 2, 'B'], [2, 0, 'C']];
    pcs.forEach(([x, y, l]) => it.push([x + .5, y + .5, l, l === 'A' ? 'tr' : l === 'B' ? 'pa' : 'gr', -6, -12]));
    return BK2.cart({ pts: it, axes: false, extra: [[0, 0], [7, 6]], pad: 0, label: 'Kedudukan buah dam A, B dan C' });
  })();
  add('k', 'Rajah menunjukkan kedudukan buah dam A, B dan C pada papan. Buah dam digerakkan dari A ke B. Nyatakan gerakan itu dalam bentuk vektor translasi.', V(4, -2), [V(-4, 2), V(-2, 4), V(4, 2)],
    ['Dari A ke B: 4 petak ke kanan dan 2 petak ke bawah.', `Vektor translasi = <b>${V(4, -2)}</b>.`], { fig: board });
  add('k', 'Rajah menunjukkan kedudukan buah dam A, B dan C pada papan. Buah dam kemudian digerakkan dari B ke C. Nyatakan gerakan itu dalam bentuk vektor translasi.', V(-3, -2), [V(3, 2), V(-2, -3), V(3, -2)],
    ['Dari B ke C: 3 petak ke kiri dan 2 petak ke bawah.', `Vektor translasi = <b>${V(-3, -2)}</b>.`], { fig: board });
  add('k', `Titik P${P(1, 1)} ditranslasikan oleh ${V(2, -1)}, kemudian imejnya ditranslasikan pula oleh ${V(-5, 3)}. Nyatakan koordinat imej akhir.`, P(-2, 3), [P(3, 0), P(-4, 4), P(4, -1)],
    [`Imej pertama = (1 + 2, 1 + (−1)) = ${P(3, 0)}.`, `Imej akhir = (3 + (−5), 0 + 3) = <b>${P(-2, 3)}</b>.`]);
  add('k', `Sebuah kereta mainan bergerak dari ${P(-2, 1)} ke ${P(3, -2)}. Kereta itu kemudian bergerak sekali lagi dengan translasi yang sama. Nyatakan kedudukan akhir kereta itu.`, P(8, -5), [P(5, -3), P(1, 4), P(8, 1)],
    [`Vektor translasi = ${V('3 − (−2)', '−2 − 1')} = ${V(5, -3)}.`, `Kedudukan akhir = (3 + 5, −2 + (−3)) = <b>${P(8, -5)}</b>.`]);
  add('k', `Suatu objek ditranslasikan oleh ${V(2, -1)} dan kemudian oleh ${V(-5, 3)}. Nyatakan satu translasi tunggal yang memberi kesan yang sama.`, V(-3, 2), [V(7, -4), V(-7, 4), V(3, -2)],
    ['Tambah kedua-dua vektor.', `${V(2, -1)} + ${V(-5, 3)} = <b>${V(-3, 2)}</b>.`]);
  return Q;
})();

/* ======================= 11.3 PANTULAN ======================= */
BANK['11.3'] = (() => {
  const Q = [], add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));
  const PP = p => P(p[0], p[1]);
  /* Mudah: sifat (5) */
  add('m', 'Di bawah suatu pantulan, objek dan imej berada pada sebelah yang ____ dengan paksi pantulan.', 'bertentangan', ['sama', 'selari', 'bertindih'],
    ['Objek dan imej berada pada sebelah yang <b>bertentangan</b> dengan paksi pantulan.']);
  add('m', 'Di bawah suatu pantulan, jarak serenjang objek dari paksi pantulan adalah ____ jarak serenjang imej dari paksi itu.', 'sama dengan', ['dua kali', 'separuh', 'lebih besar daripada'],
    ['Objek dan imej mempunyai jarak serenjang yang <b>sama</b> dari paksi pantulan.']);
  add('m', 'Di bawah suatu pantulan, bentuk dan saiz imej adalah sama dengan objek tetapi orientasinya ____.', 'songsang', ['sama', 'lebih besar', 'tidak berubah'],
    ['Bentuk dan saiz tidak berubah.', 'Orientasi imej <b>songsang</b>, seperti imej dalam cermin.']);
  add('m', 'Imej bagi suatu titik yang terletak pada paksi pantulan ialah ____.', 'titik itu sendiri', ['titik asalan', 'tiada imej', 'titik pada paksi-y'],
    ['Titik pada paksi pantulan tidak berubah kedudukan.', 'Imejnya ialah <b>titik itu sendiri</b>.']);
  add('m', 'Apakah nama garis yang menjadi pembahagi dua sama serenjang bagi garis yang menyambungkan objek dan imejnya dalam suatu pantulan?', 'Paksi pantulan', ['Paksi-x', 'Garis translasi', 'Pusat putaran'],
    ['Garis itu membahagikan objek dan imej kepada dua bahagian yang kongruen.', 'Garis itu ialah <b>paksi pantulan</b>.']);

  /* Mudah: kenal pantulan (5) */
  const fRef = (sh, f) => { // pasangan + paksi
    const A = BK.SH[sh].map(p => p.slice()), w = Math.max(...A.map(p => p[0])), h = Math.max(...A.map(p => p[1]));
    let B, ax = null;
    if (f === 'ref') { const m = w + 1; B = A.map(([x, y]) => [2 * m - x, y]); ax = [[m, -1], [m, h + 1]]; }
    else if (f === 'tr') B = A.map(([x, y]) => [x + w + 2, y]);
    else { B = A.map(([x, y]) => [h - y + w + 2, x]); }
    return BK2.cart({ polys: [[A, 'tr'], [B, 'pa']], lines: ax ? [[ax[0], ax[1], 'gr', true]] : [], axes: false, pad: 1, label: 'Objek dan imej' });
  };
  const RY = 'Pantulan, orientasi songsang', RN1 = 'Bukan pantulan, orientasi sama', RN2 = 'Bukan pantulan, imej berpusing';
  [['L', 'ref', RY], ['seg3', 'tr', RN1], ['pent', 'ref', RY], ['L', 'r90', RN2], ['trap', 'ref', RY]].forEach(([sh, f, a]) =>
    add('m', 'Adakah rajah di bawah menunjukkan suatu pantulan? Berikan sebab.', a, [RY, RN1, RN2, 'Pantulan, saiz berubah'].filter(s => s !== a).slice(0, 3),
      a === RY ? ['Imej ialah seperti imej cermin bagi objek.', 'Orientasinya <b>songsang</b>, bentuk dan saiz sama.', 'Maka ini ialah pantulan.'] : a === RN1 ? ['Orientasi imej sama dengan objek.', 'Imej hanya beralih kedudukan (translasi).', 'Maka ini <b>bukan pantulan</b>.'] : ['Imej berpusing berbanding objek.', 'Ini ialah putaran, bukan imej cermin.', 'Maka ini <b>bukan pantulan</b>.'],
      { fig: fRef(sh, f) }));

  /* Mudah: pantulan pada paksi-x (5) & paksi-y (5) */
  [[3, 4], [-3, -5], [2, -1], [-4, 6], [5, 0]].forEach(([x, y]) => add('m', `Nyatakan koordinat imej bagi titik ${P(x, y)} di bawah pantulan pada paksi-x.`, P(x, -y),
    BK2.dPts([x, -y], [[-x, y], [-x, -y], [y, x], [x, y + 1]]).map(PP), ['Pantulan pada paksi-x: (x, y) → (x, −y).', `Koordinat-x kekal, koordinat-y bertukar tanda.`, `Imej = <b>${P(x, -y)}</b>.`]));
  [[3, 4], [-3, -5], [-2, 7], [6, -1], [0, 3]].forEach(([x, y]) => add('m', `Nyatakan koordinat imej bagi titik ${P(x, y)} di bawah pantulan pada paksi-y.`, P(-x, y),
    BK2.dPts([-x, y], [[x, -y], [-x, -y], [y, x], [x - 1, y]]).map(PP), ['Pantulan pada paksi-y: (x, y) → (−x, y).', `Koordinat-y kekal, koordinat-x bertukar tanda.`, `Imej = <b>${P(-x, y)}</b>.`]));

  /* Mudah: huraikan pantulan daripada rajah (5) */
  const AXN = { x: 'Pantulan pada paksi-x', y: 'Pantulan pada paksi-y' };
  [['x', [[-4, 1], [1, 1], [-4, 3]]], ['y', [[-4, -3], [-1, -3], [-1, 1]]], ['x', [[1, 1], [4, 1], [4, 3], [2, 3]]], ['y', [[1, 1], [3, 1], [3, 4], [1, 2]]], ['h', [[-3, 0], [-1, 0], [-1, 3]]]].forEach(([k, T]) => {
    let B, a, lines = [];
    if (k === 'x') { B = T.map(([x, y]) => [x, -y]); a = AXN.x; }
    else if (k === 'y') { B = T.map(([x, y]) => [-x, y]); a = AXN.y; }
    else { B = T.map(([x, y]) => [2 - x, y]); a = 'Pantulan pada garis x = 1'; lines = [[[1, -1], [1, 4], 'gr', true, 'x = 1']]; }
    add('m', 'Dalam rajah di bawah, M′ (oren) ialah imej bagi M (biru) di bawah suatu pantulan. Huraikan pantulan itu.', a,
      [AXN.x, AXN.y, 'Pantulan pada garis x = 1', 'Pantulan pada garis y = 1'].filter(s => s !== a).slice(0, 3),
      ['Cari garis yang berada di tengah-tengah antara objek dan imej.', 'Jarak setiap bucu objek dan bucu imej dari garis itu sama.', `Maka ini ialah <b>${a.toLowerCase()}</b>.`],
      { fig: BK2.cart({ polys: [[T, 'tr'], [B, 'pa']], lines }) });
  });

  /* Sederhana: pantulan pada x = h (5) dan y = k (5) */
  [[[4, 3], 1], [[-2, 5], 2], [[6, -1], 3], [[0, 4], -2], [[-5, -3], -1]].forEach(([[x, y], h]) => {
    const X = 2 * h - x;
    add('s', `Tentukan koordinat imej bagi titik ${P(x, y)} di bawah pantulan pada garis x = ${fmt(h)}.`, P(X, y),
      BK2.dPts([X, y], [[-x, y], [x, 2 * h - y], [X + 1, y], [h, y]]).map(PP),
      [`Jarak mengufuk titik dari garis x = ${fmt(h)} ialah ${Math.abs(x - h)} unit.`, `Imej berada ${Math.abs(x - h)} unit di sebelah bertentangan: x′ = ${fmt(X)}.`, `Imej = <b>${P(X, y)}</b>.`]);
  });
  [[[2, 5], 1], [[-3, 0], 2], [[4, -2], -1], [[-1, 6], 3], [[5, 1], -3]].forEach(([[x, y], k]) => {
    const Y = 2 * k - y;
    add('s', `Tentukan koordinat imej bagi titik ${P(x, y)} di bawah pantulan pada garis y = ${fmt(k)}.`, P(x, Y),
      BK2.dPts([x, Y], [[x, -y], [2 * k - x, y], [x, Y - 1], [x, k]]).map(PP),
      [`Jarak mencancang titik dari garis y = ${fmt(k)} ialah ${Math.abs(y - k)} unit.`, `Imej berada ${Math.abs(y - k)} unit di sebelah bertentangan: y′ = ${fmt(Y)}.`, `Imej = <b>${P(x, Y)}</b>.`]);
  });

  /* Sederhana: kenal pasti paksi daripada pasangan titik (5) */
  const AX4 = ['paksi-x', 'paksi-y'];
  [[[3, 2], [-3, 2], 'paksi-y'], [[-4, 5], [-4, -5], 'paksi-x'], [[2, 5], [6, 5], 'garis x = 4'], [[1, -3], [1, 7], 'garis y = 2'], [[-5, 1], [1, 1], 'garis x = −2']].forEach(([p, q, a]) => {
    const x = a === 'paksi-y' ? ['paksi-x', 'garis y = 2', 'garis x = 3'] : a === 'paksi-x' ? ['paksi-y', 'garis y = 5', 'garis x = −4'] : a.startsWith('garis x') ? ['paksi-y', `garis y = ${fmt(p[1])}`, `garis x = ${fmt((p[0] + q[0]) / 2 + 1)}`] : ['paksi-x', `garis x = ${fmt(p[0])}`, `garis y = ${fmt((p[1] + q[1]) / 2 + 1)}`];
    add('s', `Titik A${PP(p)} dipetakan kepada A′${PP(q)} di bawah suatu pantulan. Kenal pasti paksi pantulan.`, vcap(a), x.map(vcap),
      [p[0] === q[0] ? 'Koordinat-x sama, maka paksi pantulan ialah garis mengufuk.' : 'Koordinat-y sama, maka paksi pantulan ialah garis mencancang.', p[0] === q[0] ? `Titik tengah: y = (${fmt(p[1])} + ${par(q[1])}) ÷ 2 = ${fmt((p[1] + q[1]) / 2)}.` : `Titik tengah: x = (${fmt(p[0])} + ${par(q[0])}) ÷ 2 = ${fmt((p[0] + q[0]) / 2)}.`, `Paksi pantulan: <b>${a}</b>.`]);
  });

  /* Sederhana: pantulan pada garis y = x (2) */
  [[4, 1], [-2, 5]].forEach(([x, y]) => add('s', `Titik ${P(x, y)} dipantulkan pada garis y = x. Nyatakan koordinat imejnya.`, P(y, x),
    BK2.dPts([y, x], [[-x, y], [x, -y], [-y, -x], [y, -x]]).map(PP), ['Garis y = x condong 45°.', 'Pantulan pada garis y = x menukar kedudukan koordinat-x dan koordinat-y.', `Imej = <b>${P(y, x)}</b>.`],
    { fig: BK2.cart({ pts: [[x, y, `${P(x, y)}`, 'tr']], lines: [[[-3, -3], [5, 5], 'gr', true, 'y = x']], extra: [[y, x]] }) }));

  /* Sukar (8) */
  add('k', `Titik L${P(2, -1)} dipetakan kepada L′${P(2, 5)} di bawah suatu pantulan. Nyatakan paksi pantulan.`, 'Garis y = 2', ['Garis x = 2', 'Paksi-x', 'Garis y = 3'],
    ['Koordinat-x sama, maka paksi ialah garis mengufuk.', 'Titik tengah: y = (−1 + 5) ÷ 2 = 2.', 'Paksi pantulan: <b>y = 2</b>.']);
  add('k', `Titik L${P(2, -1)} dipetakan kepada L′${P(2, 5)} di bawah suatu pantulan. Cari koordinat imej bagi titik ${P(-4, 0)} di bawah pantulan yang sama.`, P(-4, 4), [P(4, 0), P(-4, 5), P(-4, -4)],
    ['Paksi pantulan ialah y = 2.', 'Titik (−4, 0) berada 2 unit di bawah paksi, maka imej 2 unit di atas paksi.', `Imej = <b>${P(-4, 4)}</b>.`]);
  add('k', `Titik L${P(2, -1)} dipetakan kepada L′${P(2, 5)} di bawah suatu pantulan. Cari koordinat objek bagi imej ${P(6, -3)} di bawah pantulan yang sama.`, P(6, 7), [P(6, 3), P(-6, -3), P(6, 5)],
    ['Paksi pantulan ialah y = 2.', 'Imej (6, −3) berada 5 unit di bawah paksi, maka objek 5 unit di atas paksi.', `Objek = <b>${P(6, 7)}</b>.`]);
  const Mk = [[1, 2], [4, 2], [4, 4], [2, 4]], Mi = Mk.map(([x, y]) => [-2 - x, y]);
  add('k', 'Dalam rajah, M′ ialah imej bagi M di bawah suatu pantulan. Tentukan koordinat imej bagi titik P di bawah pantulan yang sama.', P(-5, -2), [P(1, 2), P(3, -2), P(-3, 2)],
    ['Paksi pantulan berada di tengah-tengah M dan M′, iaitu garis x = −1.', 'P(3, −2) berada 4 unit di kanan garis x = −1.', `Imej = (−1 − 4, −2) = <b>${P(-5, -2)}</b>.`],
    { fig: BK2.cart({ polys: [[Mk, 'tr'], [Mi, 'pa']], pts: [[3, -2, 'P', 'gr']], extra: [[-6, -3]] }), ans: 'P′(−5, −2); paksi pantulan x = −1' });
  add('k', 'Titik P berada 3 unit dari paksi pantulan. Berapakah jarak antara P dan imejnya, P′?', '6 unit', ['3 unit', '9 unit', '1.5 unit'],
    ['Jarak P′ dari paksi juga 3 unit, di sebelah bertentangan.', 'Jarak PP′ = 3 + 3 = <b>6 unit</b>.']);
  add('k', `Titik A${P(5, 2)} dipantulkan pada garis x = h dan menghasilkan imej A′${P(-1, 2)}. Cari nilai h.`, 'h = 2', ['h = 3', 'h = 4', 'h = −2'],
    ['Paksi pantulan ialah titik tengah koordinat-x.', 'h = (5 + (−1)) ÷ 2 = <b>2</b>.']);
  add('k', `Titik B${P(-3, 4)} dipantulkan pada paksi-x dan kemudian imejnya dipantulkan pada paksi-y. Nyatakan koordinat imej akhir.`, P(3, -4), [P(-3, -4), P(3, 4), P(4, -3)],
    ['Pantulan pada paksi-x: (−3, 4) → (−3, −4).', 'Pantulan pada paksi-y: (−3, −4) → <b>(3, −4)</b>.']);
  add('k', `Titik C${P(1, 3)} dipetakan kepada C′${P(5, 3)} di bawah suatu pantulan. Titik D${P(-2, 6)} juga dipantulkan pada paksi yang sama. Cari koordinat D′.`, P(8, 6), [P(2, 6), P(-2, 0), P(6, 6)],
    ['Paksi pantulan: x = (1 + 5) ÷ 2 = 3.', 'D berada 5 unit di kiri garis x = 3, maka D′ 5 unit di kanan.', `D′ = <b>${P(8, 6)}</b>.`]);
  return Q;
})();

/* ======================= 11.4 PUTARAN ======================= */
BANK['11.4'] = (() => {
  const Q = [], add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));
  const PP = p => P(p[0], p[1]), R = BK2.rot;
  /* Mudah: konsep (5) */
  add('m', 'Apabila memerihalkan suatu putaran, kita perlu menyatakan pusat, sudut dan ____ putaran.', 'arah', ['saiz', 'paksi', 'vektor'],
    ['Putaran diperihalkan dengan <b>pusat</b>, <b>sudut</b> dan <b>arah</b> putaran.']);
  add('m', 'Di bawah suatu putaran, titik manakah yang tidak berubah kedudukannya?', 'Pusat putaran', ['Semua bucu objek', 'Titik asalan sahaja', 'Titik pada paksi-x'],
    ['Pusat putaran ialah satu titik pegun.', 'Kedudukannya tidak berubah.']);
  add('m', 'Di bawah suatu putaran, jarak setiap titik imej ke pusat putaran adalah ____ jarak titik objek ke pusat putaran.', 'sama dengan', ['dua kali', 'separuh', 'lebih kecil daripada'],
    ['Jarak semua titik imej ke pusat putaran adalah <b>sama</b> dengan jarak titik objek ke pusat putaran.']);
  add('m', 'Imej yang dihasilkan melalui putaran 180° ikut arah jam adalah sama dengan imej yang dihasilkan melalui putaran ____.', '180° lawan arah jam', ['90° lawan arah jam', '90° ikut arah jam', '360° ikut arah jam'],
    ['Putaran 180° ialah separuh pusingan.', 'Arah ikut atau lawan jam memberi imej yang sama.']);
  add('m', 'Putaran 90° ikut arah jam memberi imej yang sama dengan putaran ____.', '270° lawan arah jam', ['90° lawan arah jam', '180° lawan arah jam', '270° ikut arah jam'],
    ['90° ikut arah jam + 270° lawan arah jam = satu pusingan penuh dari arah bertentangan.', 'Maka kedua-duanya memberi imej yang sama.']);

  /* Mudah: kenal putaran (4) */
  const UY = 'Putaran, bentuk berpusing pada satu titik', UN = 'Bukan putaran';
  [['L', 'r90', 1], ['L', 'tr', 0], ['trap', 'r180', 1], ['seg3', 'ref', 0]].forEach(([sh, f, ok]) =>
    add('m', 'Adakah imej (oren) terhasil daripada suatu putaran ke atas objek (biru)?', ok ? UY : (f === 'tr' ? 'Bukan putaran, ini translasi' : 'Bukan putaran, ini pantulan'),
      ok ? ['Bukan putaran, ini translasi', 'Bukan putaran, ini pantulan', 'Bukan putaran, saiz berubah'] : [UY, f === 'tr' ? 'Bukan putaran, ini pantulan' : 'Bukan putaran, ini translasi', 'Bukan putaran, saiz berubah'],
      ok ? ['Imej berpusing berbanding objek tetapi tidak terbalik.', 'Bentuk dan saiz sama.', 'Maka ini ialah putaran.'] : f === 'tr' ? ['Orientasi imej sama dengan objek.', 'Imej hanya beralih kedudukan.', 'Maka ini translasi, <b>bukan putaran</b>.'] : ['Imej terbalik seperti imej cermin.', 'Maka ini pantulan, <b>bukan putaran</b>.'],
      { fig: BK.fig2(sh, f) }));

  /* Mudah: jam (4) */
  [['12', '3', '90° ikut arah jam', ['90° lawan arah jam', '180°', '30° ikut arah jam']], ['12', '6', '180°', ['90° ikut arah jam', '60° ikut arah jam', '360°']],
   ['2', '6', '120° ikut arah jam', ['120° lawan arah jam', '90° ikut arah jam', '150° ikut arah jam']], ['12', '9', '270° ikut arah jam', ['90° ikut arah jam', '180°', '270° lawan arah jam']]].forEach(([a, b, ans, x]) =>
    add('m', `Jarum minit sebuah jam berputar pada pusat jam dari angka ${a} ke angka ${b} mengikut arah pergerakan jarum jam. Nyatakan sudut dan arah putaran itu.`, ans, x,
      ['Satu pusingan penuh = 360°, setiap 3 angka = 90°.', `Dari ${a} ke ${b} mengikut arah jarum jam → <b>${ans}</b>.`]));

  /* Mudah: 180° pada asalan (6) & 90° ikut arah jam pada asalan (6) */
  [[3, 1], [-2, 4], [5, -3], [-1, -6], [0, 4], [4, 2]].forEach(([x, y]) => add('m', `Tentukan koordinat imej bagi titik ${P(x, y)} di bawah putaran 180° pada asalan O.`, P(-x, -y),
    BK2.dPts([-x, -y], [[-x, y], [x, -y], [y, -x], [-y, x]]).map(PP), ['Putaran 180° pada asalan: (x, y) → (−x, −y).', `Imej = <b>${P(-x, -y)}</b>.`]));
  [[-3, 2], [2, 5], [4, -1], [-2, -3], [5, 0], [1, 3]].forEach(([x, y]) => add('m', `Tentukan koordinat imej bagi titik ${P(x, y)} di bawah putaran 90° ikut arah jam pada asalan O.`, P(y, -x),
    BK2.dPts([y, -x], [[-y, x], [-x, -y], [y, x], [-x, y]]).map(PP), ['Putaran 90° ikut arah jam pada asalan: (x, y) → (y, −x).', `Imej = <b>${P(y, -x)}</b>.`],
    { fig: BK2.cart({ pts: [[x, y, 'A', 'tr'], [0, 0, 'O', 'mu', 8, 18]], extra: [[y, -x]] }) }));

  /* Sederhana: 90° lawan arah jam pada asalan (5) */
  [[3, 1], [-2, 4], [5, -2], [-4, -1], [0, -3]].forEach(([x, y]) => add('s', `Tentukan koordinat imej bagi titik ${P(x, y)} di bawah putaran 90° lawan arah jam pada asalan O.`, P(-y, x),
    BK2.dPts([-y, x], [[y, -x], [-x, -y], [y, x], [-y, -x]]).map(PP), ['Putaran 90° lawan arah jam pada asalan: (x, y) → (−y, x).', `Imej = <b>${P(-y, x)}</b>.`]));

  /* Sederhana: pusat bukan asalan (6) */
  const TN = { 90: '90° lawan arah jam', 180: '180°', 270: '90° ikut arah jam' };
  [[[4, 3], [1, 2], 180], [[3, 1], [1, 1], 270], [[-1, 4], [1, 2], 90], [[5, -1], [2, 0], 180], [[2, 4], [0, 1], 270], [[-3, 1], [-1, -1], 90]].forEach(([[x, y], [cx, cy], t]) => {
    const [X, Y] = R(x, y, cx, cy, t), o = [90, 180, 270].filter(u => u !== t);
    add('s', `Titik A${P(x, y)} diputarkan ${TN[t]} pada pusat ${P(cx, cy)}. Cari koordinat imej A′.`, P(X, Y),
      BK2.dPts([X, Y], [R(x, y, cx, cy, o[0]), R(x, y, cx, cy, o[1]), R(x, y, 0, 0, t), [X + 1, Y]]).map(PP),
      [`Lukis garis dari pusat ${P(cx, cy)} ke A.`, `Putar garis itu ${TN[t]} dengan panjang yang sama.`, `Imej A′ = <b>${P(X, Y)}</b>.`],
      { fig: BK2.cart({ pts: [[x, y, 'A', 'tr'], [cx, cy, 'C', 'pu']], extra: [[X, Y]], lines: [[[cx, cy], [x, y], 'tr', true]] }) });
  });

  /* Sederhana: huraikan putaran daripada rajah (6) */
  const S = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]];
  [[[0, 0], 270, [1, 1]], [[1, -1], 180, [2, 0]], [[0, 0], 90, [1, 1]], [[-1, 2], 270, [0, 3]], [[2, 0], 180, [3, 1]], [[0, 1], 90, [1, 2]]].forEach(([[cx, cy], t, [ox, oy]]) => {
    const A = S.map(([x, y]) => [x + ox, y + oy]), B = A.map(([x, y]) => R(x, y, cx, cy, t)), a = TN[t] + ' pada pusat C';
    add('s', 'Dalam rajah, imej (oren) ialah hasil putaran ke atas objek (biru). Titik C ialah pusat putaran. Huraikan putaran itu.', vcap(a),
      Object.values(TN).filter(s => s !== TN[t]).map(s => vcap(s + ' pada pusat C')).concat(['Pantulan pada garis melalui C']),
      ['Sambungkan satu bucu objek dan bucu sepadan imej ke pusat C.', `Sudut antara kedua-dua garis ialah ${t === 180 ? 180 : 90}°${t === 180 ? '' : t === 90 ? ', lawan arah jam' : ', ikut arah jam'}.`, `Maka putaran itu ialah <b>${a}</b>.`],
      { fig: BK2.cart({ polys: [[A, 'tr'], [B, 'pa']], pts: [[cx, cy, 'C', 'pu']] }) });
  });

  /* Sukar (8) */
  [[[-1, 3], [0, 0], 270, 'P'], [[3, 2], [1, 1], 90, 'Q'], [[4, -1], [0, -1], 90, 'R'], [[2, 5], [0, 3], 270, 'S']].forEach(([[X, Y], [cx, cy], t, L]) => {
    const inv = t === 90 ? 270 : t === 270 ? 90 : 180, [x, y] = R(X, Y, cx, cy, inv);
    add('k', `${L}′${P(X, Y)} ialah imej bagi titik ${L} di bawah putaran ${TN[t]} pada pusat ${P(cx, cy)}. Tentukan koordinat ${L}.`, P(x, y),
      BK2.dPts([x, y], [R(X, Y, cx, cy, t), R(X, Y, cx, cy, 180), [x, y + 1], [-x, y]]).map(PP),
      ['Untuk mencari objek, putar imej dalam arah yang <b>bertentangan</b>.', `Putar ${L}′ ${TN[inv]} pada ${P(cx, cy)}.`, `${L} = <b>${P(x, y)}</b>.`]);
  });
  add('k', `Titik A${P(2, 1)} dipetakan kepada A′${P(4, 5)} di bawah suatu putaran 180°. Tentukan koordinat pusat putaran.`, P(3, 3), [P(1, 2), P(6, 6), P(2, 4)],
    ['Di bawah putaran 180°, pusat putaran ialah titik tengah AA′.', `Pusat = ((2 + 4) ÷ 2, (1 + 5) ÷ 2) = <b>${P(3, 3)}</b>.`]);
  add('k', `Titik B${P(-4, 2)} dipetakan kepada B′${P(0, -6)} di bawah suatu putaran 180°. Tentukan koordinat pusat putaran.`, P(-2, -2), [P(-4, -4), P(2, -4), P(-2, 2)],
    ['Pusat putaran 180° ialah titik tengah BB′.', `Pusat = ((−4 + 0) ÷ 2, (2 + (−6)) ÷ 2) = <b>${P(-2, -2)}</b>.`]);
  add('k', `Titik ${P(5, 2)} diputarkan 90° ikut arah jam pada asalan, kemudian imejnya diputarkan 180° pada asalan. Nyatakan koordinat imej akhir.`, P(-2, 5), [P(2, -5), P(-5, -2), P(5, -2)],
    ['90° ikut arah jam: (5, 2) → (2, −5).', '180°: (2, −5) → <b>(−2, 5)</b>.', 'Ini sama dengan satu putaran 90° lawan arah jam.']);
  add('k', `Titik ${P(-3, 4)} diputarkan 90° lawan arah jam pada titik ${P(2, 1)}. Nyatakan koordinat imejnya.`, P(-1, -4), [P(5, 6), P(7, -2), P(-4, -3)],
    ['Dari pusat (2, 1) ke titik: 5 unit ke kiri, 3 unit ke atas.', 'Putar 90° lawan arah jam: menjadi 3 unit ke kiri, 5 unit ke bawah.', `Imej = (2 − 3, 1 − 5) = <b>${P(-1, -4)}</b>.`]);
  return Q;
})();

/* ======================= 11.5 ISOMETRI ======================= */
BANK['11.5'] = (() => {
  const Q = [], add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));
  /* Mudah: konsep (6) */
  add('m', 'Isometri ialah suatu transformasi yang mengekalkan ____ di antara sebarang dua titik pada objek.', 'jarak', ['orientasi', 'kedudukan', 'koordinat'],
    ['Isometri mengekalkan <b>jarak</b> di antara sebarang dua titik.', 'Maka bentuk dan saiz objek dikekalkan.']);
  add('m', 'Di bawah suatu isometri, objek dan imej adalah ____.', 'kongruen', ['serupa tetapi berbeza saiz', 'berbeza bentuk', 'selari'],
    ['Isometri mengekalkan bentuk dan saiz.', 'Maka objek dan imej adalah <b>kongruen</b>.']);
  add('m', 'Antara berikut, yang manakah <b>bukan</b> suatu isometri?', 'Transformasi yang menggandakan saiz', ['Translasi', 'Pantulan', 'Putaran'],
    ['Translasi, pantulan dan putaran mengekalkan bentuk dan saiz → isometri.', 'Transformasi yang mengubah saiz <b>bukan</b> isometri.']);
  add('m', 'Antara berikut, yang manakah merupakan isometri?', 'Translasi, pantulan dan putaran', ['Translasi sahaja', 'Pantulan sahaja', 'Putaran sahaja'],
    ['Ketiga-tiga transformasi mengekalkan bentuk dan saiz.', 'Maka <b>translasi, pantulan dan putaran</b> ialah isometri.']);
  add('m', 'Isometri ialah transformasi yang imejnya ____ dengan objek.', 'kongruen', ['tidak kongruen', 'berbeza saiz', 'berbeza bentuk'],
    ['Isometri ialah transformasi yang imejnya <b>kongruen</b> dengan objek.']);
  add('m', 'Jika objek dipetakan kepada imej yang lebih besar, transformasi itu ialah ____.', 'bukan isometri', ['isometri', 'translasi', 'pantulan'],
    ['Saiz imej berubah, maka jarak di antara titik tidak dikekalkan.', 'Transformasi itu <b>bukan isometri</b>.']);

  /* Mudah: isometri atau bukan daripada rajah (8) */
  const IY = 'Isometri, bentuk dan saiz sama', IS = 'Bukan isometri, saiz berubah', IB = 'Bukan isometri, bentuk berubah';
  [['seg3', 'tr', IY], ['L', 'sc', IS], ['trap', 'ref', IY], ['sisi4', 'sh', IB], ['pent', 'r90', IY], ['kecil', 'sc', IS], ['L', 'r180', IY], ['trap', 'st', IB]].forEach(([sh, f, a]) =>
    add('m', 'Tentukan sama ada transformasi yang memetakan objek (biru) kepada imej (oren) ialah suatu isometri.', a, [IY, IS, IB, 'Isometri, orientasi sama'].filter(s => s !== a).slice(0, 3),
      a === IY ? ['Bandingkan bentuk dan saiz.', 'Bentuk dan saiz <b>sama</b>.', 'Maka transformasi itu isometri.'] : a === IS ? ['Bentuk sama tetapi saiz <b>berubah</b>.', 'Maka bukan isometri.'] : ['Bentuk <b>berubah</b>.', 'Maka bukan isometri.'],
      { fig: BK.fig2(sh, f) }));

  /* Mudah: ukuran dikekalkan (6) */
  [['translasi', 'AB = 5 cm', 'A′B′', '5 cm', ['10 cm', '2.5 cm', '0 cm']], ['pantulan', '∠PQR = 64°', '∠P′Q′R′', '64°', ['116°', '26°', '128°']], ['putaran 90°', 'KL = 7.5 cm', 'K′L′', '7.5 cm', ['15 cm', '3.75 cm', '9.5 cm']],
   ['putaran 180°', '∠ABC = 110°', '∠A′B′C′', '110°', ['70°', '290°', '220°']], ['pantulan', 'perimeter segi empat tepat = 26 cm', 'perimeter imej', '26 cm', ['52 cm', '13 cm', '20 cm']], ['translasi', 'luas segi tiga = 18 cm²', 'luas imej', '18 cm²', ['36 cm²', '9 cm²', '24 cm²']]].forEach(([tf, g, ask, a, x]) =>
    add('m', `Suatu objek dipetakan kepada imejnya di bawah suatu ${tf}. Diberi ${g}. Nyatakan ${ask}.`, a, x,
      [`${vcap(tf)} ialah isometri.`, 'Isometri mengekalkan panjang sisi, saiz sudut, perimeter dan luas.', `Maka ${ask} = <b>${a}</b>.`]));

  /* Mudah: pernyataan (5) */
  [['Suatu pantulan diikuti suatu pantulan.', 'Isometri'], ['Suatu translasi.', 'Isometri'], ['Suatu putaran secara berturut-turut.', 'Isometri'], ['Transformasi yang menggandakan panjang setiap sisi.', 'Bukan isometri'], ['Suatu putaran diikuti suatu translasi.', 'Isometri']].forEach(([s, a]) =>
    add('m', `Tentukan sama ada transformasi berikut merupakan suatu isometri: ${s}`, a, a === 'Isometri' ? ['Bukan isometri', 'Isometri jika objek segi tiga sahaja', 'Tidak dapat ditentukan'] : ['Isometri', 'Isometri jika objek segi tiga sahaja', 'Tidak dapat ditentukan'],
      a === 'Isometri' ? ['Setiap translasi, pantulan dan putaran mengekalkan bentuk dan saiz.', 'Gabungannya juga mengekalkan bentuk dan saiz.', 'Maka <b>isometri</b>.'] : ['Panjang sisi berubah.', 'Saiz tidak dikekalkan, maka <b>bukan isometri</b>.']));

  /* Sederhana: jenis isometri daripada rajah (8) */
  const TT = { tr: 'Translasi', ref: 'Pantulan', r90: 'Putaran', r180: 'Putaran' };
  [['L', 'tr'], ['L', 'ref'], ['L', 'r90'], ['trap', 'r180'], ['seg3', 'ref'], ['pent', 'tr'], ['sisi4', 'r90'], ['sisi4', 'ref']].forEach(([sh, f]) => {
    const a = TT[f];
    add('s', 'Objek (biru) dipetakan kepada imej (oren) di bawah suatu isometri. Nyatakan jenis isometri itu.', a, ['Translasi', 'Pantulan', 'Putaran', 'Bukan isometri'].filter(s => s !== a).slice(0, 3),
      a === 'Translasi' ? ['Orientasi imej sama dengan objek.', 'Semua titik bergerak dalam arah yang sama.', 'Maka isometri itu ialah <b>translasi</b>.'] : a === 'Pantulan' ? ['Imej terbalik seperti imej cermin.', 'Orientasi songsang.', 'Maka isometri itu ialah <b>pantulan</b>.'] : ['Imej berpusing berbanding objek tetapi tidak terbalik.', 'Maka isometri itu ialah <b>putaran</b>.'],
      { fig: BK.fig2(sh, f) });
  });

  /* Sederhana: pasangan kongruen (3) */
  const AD = ['(a)', '(b)', '(c)', '(d)'];
  [[[['L', 'sc'], ['pent', 'r90'], ['trap', 'sh'], ['kecil', 'sc']], '(b)'], [[['seg3', 'sc'], ['sisi4', 'st'], ['L', 'ref'], ['trap', 'sh']], '(c)'], [[['trap', 'tr'], ['L', 'sh'], ['kecil', 'sc'], ['seg3', 'st']], '(a)']].forEach(([L4, a]) =>
    add('s', 'Antara pasangan rajah berikut, yang manakah menunjukkan imej isometri bagi objek?', a, AD.filter(v => v !== a),
      ['Imej isometri mesti kongruen dengan objek.', `Hanya ${a} mempunyai bentuk dan saiz yang sama.`], { fig: BK.fig4(L4) }));

  /* Sederhana: penamaan poligon kongruen (3) */
  add('s', 'Sisi empat ABCD dan sisi empat SRQP adalah kongruen (huruf ditulis mengikut bucu sepadan). Sisi manakah yang sepadan dengan BC?', 'RQ', ['QP', 'SR', 'PS'],
    ['A ↔ S, B ↔ R, C ↔ Q, D ↔ P.', 'Maka BC sepadan dengan <b>RQ</b>.']);
  add('s', 'Segi tiga KLM dan segi tiga ZYX adalah kongruen (huruf ditulis mengikut bucu sepadan). Sudut manakah yang sepadan dengan ∠KLM?', '∠ZYX', ['∠YXZ', '∠XZY', '∠KML'],
    ['K ↔ Z, L ↔ Y, M ↔ X.', 'Maka ∠KLM sepadan dengan <b>∠ZYX</b>.']);
  add('s', 'Pentagon ABCDE kongruen dengan pentagon VWXYZ (huruf ditulis mengikut bucu sepadan). Diberi DE = 6 cm. Nyatakan sisi yang sama panjang dengan DE.', 'YZ', ['XY', 'ZV', 'WX'],
    ['D ↔ Y dan E ↔ Z.', 'Maka DE = <b>YZ</b> = 6 cm.']);
  add('s', `Jarak di antara titik A dan B ialah 7 unit. Selepas suatu putaran, A dan B dipetakan kepada A′ dan B′. Berapakah jarak A′B′?`, '7 unit', ['14 unit', '3.5 unit', '0 unit'],
    ['Putaran ialah isometri.', 'Isometri mengekalkan jarak di antara dua titik.', 'A′B′ = <b>7 unit</b>.']);
  add('s', `Titik A${P(1, 2)} dan B${P(4, 6)} ditranslasikan oleh ${vec(-3, 2)}. Hitung jarak A′B′.`, '5 unit', ['3 unit', '4 unit', '7 unit'],
    ['Translasi ialah isometri, maka A′B′ = AB.', `AB = ` + rt('3² + 4²') + ' = ' + rt(25) + ' = <b>5 unit</b>.']);

  /* Sukar (8) */
  add('k', 'Segi tiga ABC ialah imej bagi segi tiga DEF di bawah suatu isometri, dengan A ↔ D, B ↔ E dan C ↔ F. Diberi ∠D = 40° dan ∠E = 65°. Hitung ∠C.', '75°', ['40°', '65°', '105°'],
    ['∠A = ∠D = 40°, ∠B = ∠E = 65°.', '∠C = 180° − 40° − 65° = <b>75°</b>.']);
  add('k', 'Segi tiga sama kaki PQR mempunyai PQ = PR dan ∠QPR = 50°. Segi tiga XYZ ialah imej bagi segi tiga PQR di bawah suatu pantulan (P ↔ X, Q ↔ Y, R ↔ Z). Hitung ∠XYZ.', '65°', ['50°', '130°', '75°'],
    ['∠PQR = (180° − 50°) ÷ 2 = 65°.', 'Pantulan ialah isometri, maka ∠XYZ = ∠PQR = <b>65°</b>.']);
  add('k', 'ABCD ialah imej bagi PQRS di bawah suatu isometri, dengan A ↔ P, B ↔ Q, C ↔ R dan D ↔ S. Diberi ∠P = 90°, ∠Q = 90° dan ∠R = 65°. Hitung ∠D.', '115°', ['65°', '90°', '125°'],
    ['∠A = 90°, ∠B = 90°, ∠C = 65°.', 'Hasil tambah sudut sisi empat = 360°.', '∠D = 360° − 90° − 90° − 65° = <b>115°</b>.']);
  add('k', 'Trapezium ABCD ialah imej bagi trapezium PQRS di bawah suatu isometri. Diberi PQ = 9 cm, QR = 5 cm, RS = 4 cm dan SP = 5 cm. Hitung perimeter ABCD.', '23 cm', ['18 cm', '46 cm', '14 cm'],
    ['Isometri mengekalkan panjang sisi.', 'Perimeter ABCD = 9 + 5 + 4 + 5 = <b>23 cm</b>.']);
  add('k', 'Segi empat tepat EFGH ialah imej bagi segi empat tepat JKLM di bawah suatu putaran. Diberi JK = 12 cm dan KL = 5 cm. Hitung luas EFGH.', '60 cm²', ['34 cm²', '17 cm²', '120 cm²'],
    ['Putaran ialah isometri, maka EFGH kongruen dengan JKLM.', 'Luas = 12 × 5 = <b>60 cm²</b>.']);
  add('k', 'Segi tiga KLM ialah imej bagi segi tiga RST di bawah suatu isometri (R ↔ K, S ↔ L, T ↔ M). Diberi ∠R = 3y°, ∠S = 2y° dan ∠M = 80°. Cari nilai y.', 'y = 20', ['y = 16', 'y = 25', 'y = 30'],
    ['∠T = ∠M = 80°.', '3y + 2y + 80 = 180 → 5y = 100.', '<b>y = 20</b>.']);
  add('k', `Titik P${P(-2, 1)} dan Q${P(4, 9)} dipantulkan pada paksi-y. Hitung jarak P′Q′.`, '10 unit', ['6 unit', '8 unit', '14 unit'],
    ['Pantulan ialah isometri, maka P′Q′ = PQ.', 'PQ = ' + rt('6² + 8²') + ' = ' + rt(100) + ' = <b>10 unit</b>.']);
  add('s', 'Dua segi tiga kongruen dicantumkan untuk membentuk sebuah segi empat selari. Setiap segi tiga mempunyai luas 21 cm². Hitung luas segi empat selari itu.', '42 cm²', ['21 cm²', '10.5 cm²', '63 cm²'],
    ['Segi tiga kongruen mempunyai luas yang sama.', 'Luas = 21 + 21 = <b>42 cm²</b>.']);
  add('k', `Titik A${P(0, 0)} dan B${P(5, 12)} diputarkan 90° ikut arah jam pada asalan. Hitung panjang A′B′.`, '13 unit', ['17 unit', '12 unit', '7 unit'],
    ['Putaran ialah isometri, maka A′B′ = AB.', 'AB = ' + rt('5² + 12²') + ' = ' + rt(169) + ' = <b>13 unit</b>.']);
  return Q;
})();

/* ======================= 11.6 SIMETRI PUTARAN ======================= */
BANK['11.6'] = (() => {
  const Q = [], add = (l, q, a, x, work, ex) => Q.push(Object.assign({ l, q, a, x, work: work || [] }, ex || {}));
  const c = 'var(--pk)', wrap = s => `<svg viewBox="0 0 300 300" role="img" aria-label="Bentuk" font-family="Inter, sans-serif">${s}</svg>`;
  const poly = pts => `<polygon points="${pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" style="fill:${c};fill-opacity:.2;stroke:${c}" stroke-width="5" stroke-linejoin="round"/>`;
  const reg = (n, r, a0) => Array.from({ length: n }, (_, i) => { const a = (a0 ?? -Math.PI / 2) + i * 2 * Math.PI / n; return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]; });
  const star = n => { const o = reg(n, 115), I = reg(n, 50, -Math.PI / 2 + Math.PI / n); return o.flatMap((p, i) => [p, I[i]]); };
  const SV = {
    poly: n => wrap(poly(reg(n, 110))), star: n => wrap(poly(star(n))),
    plus: () => wrap(poly([[115, 40], [185, 40], [185, 115], [260, 115], [260, 185], [185, 185], [185, 260], [115, 260], [115, 185], [40, 185], [40, 115], [115, 115]])),
    kincir: n => wrap(Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n, p = [[0, 0], [110, 0], [70, 45]].map(([x, y]) => [150 + x * Math.cos(a) - y * Math.sin(a), 150 + x * Math.sin(a) + y * Math.cos(a)]); return poly(p); }).join('')),
    arrow: () => wrap(poly([[40, 120], [170, 120], [170, 70], [260, 150], [170, 230], [170, 180], [40, 180]])),
    rect: () => shapeSVG('rect'), letter: s => shapeSVG('letter', s),
    flag: () => wrap(poly([[70, 40], [90, 40], [90, 60], [230, 100], [90, 140], [90, 260], [70, 260]]))
  };
  const ORD = ['Peringkat 1', 'Peringkat 2', 'Peringkat 3', 'Peringkat 4', 'Peringkat 5', 'Peringkat 6', 'Peringkat 8'];
  const oX = n => { const base = ['Peringkat ' + (n + 1), 'Peringkat ' + Math.max(1, n - 1), 'Peringkat ' + (n * 2), 'Peringkat 1', 'Peringkat 3', 'Peringkat ' + (n + 2), 'Peringkat 4']; const out = []; for (const s of base) if (s !== 'Peringkat ' + n && !out.includes(s)) out.push(s); return out.slice(0, 3); };
  /* Mudah: konsep (5) */
  add('m', 'Suatu bentuk mempunyai simetri putaran jika bentuk itu tidak berubah selepas diputarkan ____ daripada satu putaran lengkap.', 'kurang', ['lebih', 'tepat', 'dua kali'],
    ['Bentuk mempunyai simetri putaran jika ia kelihatan sama selepas putaran <b>kurang</b> daripada 360°.']);
  add('m', 'Peringkat simetri putaran ialah bilangan kali suatu bentuk ____ dirinya sendiri dalam satu putaran lengkap.', 'menepati', ['melebihi', 'memantulkan', 'menggandakan'],
    ['Peringkat simetri putaran = bilangan kali bentuk <b>menepati</b> dirinya dalam satu putaran 360°.']);
  add('m', 'Suatu bentuk yang hanya menepati dirinya selepas putaran lengkap 360° mempunyai simetri putaran peringkat ____.', '1', ['0', '2', '360'],
    ['Bentuk itu menepati dirinya sekali sahaja dalam satu putaran lengkap.', 'Peringkatnya ialah <b>1</b>, iaitu tiada simetri putaran.']);
  add('m', 'Satu putaran lengkap bersamaan dengan ____.', '360°', ['180°', '90°', '270°'], ['Satu putaran lengkap = <b>360°</b>.']);
  add('m', 'Titik tetap yang menjadi pusat bagi simetri putaran sesuatu bentuk dinamakan ____.', 'pusat putaran', ['paksi pantulan', 'titik asalan', 'bucu'], ['Bentuk diputarkan pada satu titik tetap, iaitu <b>pusat putaran</b>.']);

  /* Mudah: ada simetri putaran? (8) */
  const HY = 'Ya, mempunyai simetri putaran', HN = 'Tidak, tiada simetri putaran';
  [[SV.star(5), 1], [SV.arrow(), 0], [SV.letter('S'), 1], [SV.letter('L'), 0], [SV.kincir(3), 1], [SV.flag(), 0], [SV.letter('Z'), 1], [SV.letter('F'), 0]].forEach(([fig, ok]) =>
    add('m', 'Adakah bentuk di bawah mempunyai simetri putaran?', ok ? HY : HN, ok ? [HN, 'Ya, tetapi hanya selepas 360°', 'Tidak dapat ditentukan'] : [HY, 'Ya, selepas putaran 180°', 'Tidak dapat ditentukan'],
      ok ? ['Putarkan bentuk itu pada pusatnya.', 'Bentuk itu kelihatan sama sebelum lengkap satu pusingan.', 'Maka bentuk itu <b>mempunyai simetri putaran</b>.'] : ['Putarkan bentuk itu pada pusatnya.', 'Bentuk itu hanya kelihatan sama selepas lengkap 360°.', 'Maka <b>tiada simetri putaran</b> (peringkat 1).'],
      { fig }));

  /* Mudah: peringkat (12) */
  [[SV.poly(3), 3, 'segi tiga sama sisi'], [SV.poly(4), 4, 'segi empat sama'], [SV.poly(5), 5, 'pentagon sekata'], [SV.poly(6), 6, 'heksagon sekata'], [SV.poly(8), 8, 'oktagon sekata'], [SV.rect(), 2, 'segi empat tepat'],
   [SV.letter('H'), 2, 'huruf H'], [SV.letter('N'), 2, 'huruf N'], [SV.plus(), 4, 'tanda tambah'], [SV.star(6), 6, 'bintang enam bucu'], [SV.letter('E'), 1, 'huruf E'], [SV.kincir(4), 4, 'kincir angin']].forEach(([fig, n, nm]) =>
    add('m', `Tentukan peringkat simetri putaran bagi ${nm} di bawah.`, 'Peringkat ' + n, oX(n),
      [`Putarkan ${nm} satu putaran lengkap pada pusatnya.`, `Kira bilangan kali bentuk itu menepati dirinya: ${n} kali.`, `Peringkat simetri putaran = <b>${n}</b>.`], { fig }));

  /* Sederhana: sudut putaran terkecil (5) & peringkat daripada sudut (4) */
  [3, 4, 5, 6, 8].forEach(n => add('s', `Suatu bentuk mempunyai simetri putaran peringkat ${n}. Berapakah sudut putaran terkecil supaya bentuk itu menepati dirinya?`, (360 / n) + '°',
    BK2.dNum((360 / n) + '°', [(180 / n) + '°', (360 / (n + 1)).toFixed(0) + '°', (360 * n) + '°', n * 10 + '°', '90°']),
    [`Sudut terkecil = 360° ÷ peringkat.`, `= 360° ÷ ${n} = <b>${360 / n}°</b>.`]));
  [[120, 3], [72, 5], [45, 8], [180, 2]].forEach(([d, n]) => add('s', `Suatu bentuk menepati dirinya buat kali pertama selepas diputarkan ${d}°. Tentukan peringkat simetri putaran bentuk itu.`, 'Peringkat ' + n, oX(n),
    ['Peringkat = 360° ÷ sudut terkecil.', `= 360° ÷ ${d}° = <b>${n}</b>.`]));

  /* Sederhana: bentuk (5) + pilih (a)–(d) (3) */
  [[SV.star(4), 4, 'bintang empat bucu'], [SV.kincir(5), 5, 'kipas lima bilah'], [SV.letter('Z'), 2, 'huruf Z'], [SV.star(8), 8, 'bintang lapan bucu'], [SV.kincir(6), 6, 'kincir enam bilah']].forEach(([fig, n, nm]) =>
    add('s', `Nyatakan peringkat simetri putaran bagi ${nm} di bawah.`, 'Peringkat ' + n, oX(n),
      ['Tandakan satu bucu dan putarkan bentuk pada pusatnya.', `Bentuk itu menepati dirinya ${n} kali dalam satu putaran lengkap.`, `Peringkat = <b>${n}</b>.`], { fig }));
  const four = (L, lbl) => {
    const vb = 300, g = 20;
    return `<svg viewBox="0 0 ${4 * vb + 3 * g} ${vb + 50}" role="img" aria-label="Empat bentuk" font-family="Inter, sans-serif">` + L.map((s, i) =>
      `<text x="${i * (vb + g) + 10}" y="34" style="fill:var(--tx)" font-size="34" font-weight="800">(${'abcd'[i]})</text><svg x="${i * (vb + g)}" y="50" width="${vb}" height="${vb}" viewBox="0 0 300 300">${s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`).join('') + '</svg>';
  };
  add('s', 'Antara bentuk berikut, yang manakah mempunyai simetri putaran?', '(c)', ['(a)', '(b)', '(d)'],
    ['(a), (b) dan (d) hanya menepati dirinya selepas 360°.', '(c) menepati dirinya selepas 180°, maka <b>mempunyai simetri putaran</b>.'], { fig: four([SV.arrow(), SV.letter('L'), SV.letter('S'), SV.flag()]) });
  add('s', 'Antara bentuk berikut, yang manakah <b>tidak</b> mempunyai simetri putaran?', '(b)', ['(a)', '(c)', '(d)'],
    ['(a), (c) dan (d) menepati dirinya sebelum 360°.', '(b) hanya menepati dirinya selepas 360°, maka <b>tiada simetri putaran</b>.'], { fig: four([SV.poly(5), SV.letter('F'), SV.plus(), SV.letter('N')]) });
  add('s', 'Antara bentuk berikut, yang manakah mempunyai simetri putaran peringkat tertinggi?', '(d)', ['(a)', '(b)', '(c)'],
    ['(a) peringkat 2, (b) peringkat 3, (c) peringkat 4.', '(d) peringkat 6, maka <b>(d)</b> paling tinggi.'], { fig: four([SV.letter('H'), SV.poly(3), SV.plus(), SV.poly(6)]) });

  /* Sukar (8) */
  const pentL = (() => { const pts = reg(5, 100); return wrap(poly(pts) + pts.map(([x, y], i) => { const dx = x - 150, dy = y - 150, d = Math.hypot(dx, dy); return `<text x="${x + dx / d * 26}" y="${y + dy / d * 26 + 9}" text-anchor="middle" style="fill:var(--tx)" font-size="28" font-weight="800">${'ABCDE'[i]}</text>`; }).join('')); })();
  add('k', 'Pentagon sekata ABCDE diputarkan ikut arah jam pada pusatnya. Tentukan peringkat simetri putaran apabila kedudukan A berada di kedudukan D.', 'Peringkat ketiga', ['Peringkat kedua', 'Peringkat keempat', 'Peringkat kelima'],
    ['A → B → C → D.', 'A melalui 3 kedudukan.', 'Maka <b>peringkat ketiga</b>.'], { fig: pentL });
  add('k', 'Pentagon sekata ABCDE diputarkan ikut arah jam pada pusatnya. Berapakah sudut putaran apabila kedudukan A berada di kedudukan C?', '144°', ['72°', '216°', '120°'],
    ['Setiap langkah = 360° ÷ 5 = 72°.', 'A → B → C ialah 2 langkah.', 'Sudut = 2 × 72° = <b>144°</b>.'], { fig: pentL });
  add('k', 'Sebuah heksagon sekata diputarkan pada pusatnya sebanyak 240°. Berapa kalikah heksagon itu telah menepati dirinya sepanjang putaran itu?', '4 kali', ['2 kali', '3 kali', '6 kali'],
    ['Sudut terkecil = 360° ÷ 6 = 60°.', '240° ÷ 60° = <b>4 kali</b>.']);
  add('k', `Sebuah segi empat sama berpusat pada titik ${P(3, 3)}. Bucu A berada pada ${P(5, 5)}. Segi empat sama itu diputarkan 90° lawan arah jam pada pusatnya. Nyatakan kedudukan baharu A.`, P(1, 5), [P(5, 1), P(1, 1), P(3, 5)],
    ['Dari pusat (3, 3) ke A: 2 unit ke kanan, 2 unit ke atas.', 'Putaran 90° lawan arah jam: 2 unit ke kiri, 2 unit ke atas.', `Kedudukan baharu = <b>${P(1, 5)}</b>, iaitu kedudukan satu bucu lain.`]);
  add('k', 'Sebuah kompas mempunyai lapan arah (Utara, Timur Laut, Timur, Tenggara, Selatan, Barat Daya, Barat, Barat Laut) yang sama jarak. Berapakah peringkat simetri putaran kompas itu?', 'Peringkat 8', ['Peringkat 4', 'Peringkat 2', 'Peringkat 16'],
    ['Lapan arah yang sama jarak.', 'Kompas menepati dirinya setiap 360° ÷ 8 = 45°.', 'Peringkat = <b>8</b>.']);
  add('k', 'Pada kompas lapan arah yang sama jarak, jarum diputarkan ikut arah jam dari Tenggara ke Barat Daya, kemudian ke Barat Laut. Berapakah jumlah sudut putaran?', '180°', ['90°', '135°', '225°'],
    ['Setiap arah bersebelahan = 45°.', 'Tenggara → Selatan → Barat Daya → Barat → Barat Laut = 4 langkah.', '4 × 45° = <b>180°</b>.']);
  add('k', 'Suatu logo mempunyai simetri putaran peringkat 3. Logo itu diputarkan 600° pada pusatnya. Berapa kalikah logo itu menepati dirinya?', '5 kali', ['3 kali', '6 kali', '4 kali'],
    ['Sudut terkecil = 360° ÷ 3 = 120°.', '600° ÷ 120° = <b>5 kali</b>.']);
  add('k', 'Sebuah bintang mempunyai simetri putaran peringkat 5. Bintang itu diputarkan 72° ikut arah jam, kemudian 144° lagi ikut arah jam. Adakah bintang itu kelihatan sama seperti asal? Berapakah jumlah sudut putaran?', 'Ya, 216°', ['Tidak, 216°', 'Ya, 180°', 'Tidak, 144°'],
    ['Sudut terkecil = 360° ÷ 5 = 72°.', 'Jumlah = 72° + 144° = 216° = 3 × 72°.', 'Gandaan 72°, maka <b>ya, bintang kelihatan sama</b>.']);
  return Q;
})();
/* ---------- sambungkan bank kepada Latihan, Lembaran, kuiz & game ---------- */
const bankQ = it => ({ q: it.q, fig: it.fig || '', ans: it.ans || it.a, work: it.work || [] });
const bankMcq = it => { const o = shuffle([it.a, ...it.x]); return { type: 'mcq', q: it.q, fig: it.fig || '', opts: o, c: o.indexOf(it.a), work: it.work || [] }; };
const bankLv = (sub, L) => { const B = BANK[sub], want = ['m', 's', 'k'][L] || 'm', p = B.filter(it => it.l === want); return p.length ? p : B; };
const GEN = {}, WG = {}, WSPLAN = {}, CQT = {};
Object.keys(BANK).forEach(sub => {
  const B = BANK[sub], by = l => B.filter(it => it.l === l);
  GEN[sub] = { m: by('m').map(it => () => bankQ(it)), s: by('s').map(it => () => bankQ(it)), k: by('k').map(it => () => bankQ(it)) };
  WSPLAN[sub] = ['m', 's', 'k'].map(l => { WG['bk' + sub + l] = i => bankQ(by(l)[i]); return [l, 'bk' + sub + l, by(l).length]; }).filter(r => r[2]);
  CQT[sub] = SHORT[sub] + ' (' + sub + ')';
});
function cq(level, types) {
  const pool = (types || []).filter(t => BANK[t]), ty = pick(pool.length ? pool : Object.keys(BANK));
  return bankMcq(pick(bankLv(ty, level)));
}
function gq(level) {   // Cabaran 60 Saat & game: pilihan jawapan pendek sahaja
  for (let k = 0; k < 40; k++) {
    const p = bankLv(pick(Object.keys(BANK)), level).filter(it => [it.a, ...it.x].every(s => !/class="vec"/.test(s) && mathPlain(s).replace(/<[^>]+>/g, '').length <= 24));
    if (p.length) return bankMcq(pick(p));
  }
  return cq(level);
}
