'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 3 (format Ujian Sumatif: A + B, Bab 1–2) ===================
   Set 3 (27 Nov 2026): 20 A · 5 B. Diolah semula oleh Mat berdasarkan bentuk dan aras Ujian Sumatif 1 2026 SMKRP
   (rujukan: Downloads/Bank Soalan/Ujian Sumatif 1 - Matematik Tingkatan 2 - 2026). Bab 1 Pola dan Jujukan, Bab 2 Pemfaktoran
   dan Pecahan Algebra (kembangan). Dimuat selepas t2.js. */

Object.assign(BS_FIG, {
  S3A17: (() => {
    let h = '<svg viewBox="0 0 300 70" width="290" role="img" aria-label="Tiga corak titik: corak 1 ada 3 titik, corak 2 ada 7 titik, corak 3 ada 11 titik"><g fill="currentColor">';
    let x0 = 10;
    [1, 2, 3].forEach(n => {
      for (let i = 0; i < 2 * n - 1; i++) h += `<circle cx="${x0 + 9 + i * 16}" cy="18" r="5.5"/>`;
      for (let i = 0; i < 2 * n; i++) h += `<circle cx="${x0 + 1 + i * 16}" cy="36" r="5.5"/>`;
      h += `<text x="${x0 + n * 16 - 12}" y="62" font-family="Inter,sans-serif" font-size="11">Corak ${n}</text>`;
      x0 += 2 * n * 16 + 22;
    });
    return h + '</g></svg>';
  })(),
  S3B01: (() => {
    let h = '<svg viewBox="0 0 290 80" width="280" role="img" aria-label="Tiga corak segi empat sama: corak 1 ada 2, corak 2 ada 5, corak 3 ada 8 segi empat sama"><g fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5">';
    let x0 = 8; const s = 16;
    [1, 2, 3].forEach(n => {
      for (let i = 0; i < 2 * n; i++) h += `<rect x="${x0 + i * s}" y="40" width="${s}" height="${s}"/>`;
      for (let i = 0; i < n - 1; i++) h += `<rect x="${x0 + (2 * n - 1 - i) * s}" y="${40 - s}" width="${s}" height="${s}"/>`;
      x0 += 2 * n * s + 24;
    });
    h += '</g><g font-family="Inter,sans-serif" fill="currentColor" font-size="11">';
    x0 = 8; [1, 2, 3].forEach(n => { h += `<text x="${x0}" y="74">Corak ${n}</text>`; x0 += 2 * n * s + 24; });
    return h + '</g></svg>';
  })()
});

BS_T2.push(
  // ---------------- SET 3 · BAHAGIAN A ----------------
  { id: 'T2S3-A01', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'S', why: 'Pola bagi subset nombor genap dalam urutan', m: 1,
    q: 'Berikut ialah suatu urutan nombor.<br>12, 19, 26, 33, 40, 47, …<br>Apakah pola bagi nombor-nombor genap dalam urutan itu?',
    qe: 'The following is a sequence of numbers.<br>12, 19, 26, 33, 40, 47, …<br>What is the pattern of the even numbers in the sequence?',
    pil: ['Menambah 7 kepada nombor sebelumnya', 'Menambah 12 kepada nombor sebelumnya', 'Menambah 14 kepada nombor sebelumnya', 'Menambah 21 kepada nombor sebelumnya'],
    pe: ['Adding 7 to the previous number', 'Adding 12 to the previous number', 'Adding 14 to the previous number', 'Adding 21 to the previous number'], jaw: 'C', sk: 'Nombor genap: 12, 26, 40, … (tambah 14)' },
  { id: 'T2S3-A02', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dua ungkapan binomial', m: 1,
    q: 'Kembangkan (<i>x</i> + 4)(<i>x</i> − 6).', qe: 'Expand (<i>x</i> + 4)(<i>x</i> − 6).',
    pil: ['<i>x</i>² + 2<i>x</i> − 24', '<i>x</i>² − 2<i>x</i> − 24', '<i>x</i>² − 10<i>x</i> − 24', '<i>x</i>² + 10<i>x</i> − 24'], jaw: 'B', sk: '<i>x</i>² − 6<i>x</i> + 4<i>x</i> − 24 = <i>x</i>² − 2<i>x</i> − 24' },
  { id: 'T2S3-A03', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Cari sebutan yang hilang', m: 1,
    q: 'Diberi suatu jujukan nombor 8, <i>m</i>, 20, 26, 32, … Tentukan nilai <i>m</i>.', qe: 'Given a number sequence 8, <i>m</i>, 20, 26, 32, … Determine the value of <i>m</i>.',
    pil: ['12', '14', '16', '18'], jaw: 'B', sk: 'Beza sepunya 6 → <i>m</i> = 8 + 6 = 14' },
  { id: 'T2S3-A04', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'S', why: 'Bandingkan kembangan dengan ungkapan', m: 1,
    q: 'Diberi <i>a</i>(4 + <i>x</i>) = 20 + 5<i>x</i>. Apakah nilai <i>a</i>?', qe: 'Given <i>a</i>(4 + <i>x</i>) = 20 + 5<i>x</i>. What is the value of <i>a</i>?',
    pil: ['4', '5', '16', '20'], jaw: 'B', sk: '4<i>a</i> + <i>ax</i> = 20 + 5<i>x</i> → <i>a</i> = 5' },
  { id: 'T2S3-A05', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Cari kedudukan sebutan', m: 1,
    q: 'Diberi jujukan nombor −7, 2, 11, 20, … Sebutan yang keberapakah bernilai 83?', qe: 'Given the number sequence −7, 2, 11, 20, … Which term has the value 83?',
    pil: ['9', '10', '11', '12'], jaw: 'C', sk: '−7 + 9(<i>n</i> − 1) = 83 → <i>n</i> − 1 = 10 → <i>n</i> = 11' },
  { id: 'T2S3-A06', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'Kembangan kuasa dua binomial', m: 1,
    q: 'Kembangkan (3<i>p</i> − 4<i>q</i>)².', qe: 'Expand (3<i>p</i> − 4<i>q</i>)².',
    pil: ['3<i>p</i>² − 24<i>pq</i> + 16<i>q</i>²', '9<i>p</i>² − 12<i>pq</i> + 16<i>q</i>²', '9<i>p</i>² − 24<i>pq</i> + 16<i>q</i>²', '9<i>p</i>² + 16<i>q</i>²'], jaw: 'C',
    sk: '(3<i>p</i>)² − 2(3<i>p</i>)(4<i>q</i>) + (4<i>q</i>)² = 9<i>p</i>² − 24<i>pq</i> + 16<i>q</i>²' },
  { id: 'T2S3-A07', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Pola jujukan perpuluhan negatif', m: 1,
    q: 'Berikut ialah suatu set nombor.<br>−1.5, −2.7, −3.9, −5.1, …<br>Apakah pola bagi set nombor ini?', qe: 'The following is a set of numbers.<br>−1.5, −2.7, −3.9, −5.1, …<br>What is the pattern of this set of numbers?',
    pil: ['Menolak 1.2 daripada nombor sebelumnya', 'Menambah 1.2 kepada nombor sebelumnya', 'Membahagi nombor sebelumnya dengan 2', 'Menolak −1.2 daripada nombor sebelumnya'],
    pe: ['Subtracting 1.2 from the previous number', 'Adding 1.2 to the previous number', 'Dividing the previous number by 2', 'Subtracting −1.2 from the previous number'], jaw: 'A' },
  { id: 'T2S3-A08', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'T', why: 'Kembangan diikuti penambahan sebutan serupa', m: 1,
    q: '(4<i>m</i> + 2<i>n</i>)(<i>m</i> − <i>n</i>) + 3<i>mn</i> =', qe: '(4<i>m</i> + 2<i>n</i>)(<i>m</i> − <i>n</i>) + 3<i>mn</i> =',
    pil: ['4<i>m</i>² + <i>mn</i> − 2<i>n</i>²', '4<i>m</i>² − 2<i>mn</i> − 2<i>n</i>²', '4<i>m</i>² + 5<i>mn</i> − 2<i>n</i>²', '4<i>m</i>² + <i>mn</i> + 2<i>n</i>²'], jaw: 'A',
    sk: '4<i>m</i>² − 4<i>mn</i> + 2<i>mn</i> − 2<i>n</i>² + 3<i>mn</i> = 4<i>m</i>² + <i>mn</i> − 2<i>n</i>²' },
  { id: 'T2S3-A09', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Jujukan darab', m: 1,
    q: 'Bagi jujukan nombor 2, 6, 18, <i>y</i>, 162, … cari nilai <i>y</i>.', qe: 'For the number sequence 2, 6, 18, <i>y</i>, 162, … find the value of <i>y</i>.',
    pil: ['36', '48', '54', '72'], jaw: 'C', sk: 'Darab 3: 18 × 3 = 54' },
  { id: 'T2S3-A10', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Cari n daripada sebutan', m: 1,
    q: 'Diberi suatu jujukan nombor 7, 14, 21, 28, … Jika sebutan ke-<i>n</i> ialah 63, tentukan nilai <i>n</i>.', qe: 'Given a number sequence 7, 14, 21, 28, … If the <i>n</i>th term is 63, determine the value of <i>n</i>.',
    pil: ['7', '8', '9', '10'], jaw: 'C', sk: '7<i>n</i> = 63 → <i>n</i> = 9' },
  { id: 'T2S3-A11', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dengan pekali negatif', m: 1,
    q: '−3(2<i>k</i> − 5) =', qe: '−3(2<i>k</i> − 5) =',
    pil: ['−6<i>k</i> − 15', '−6<i>k</i> + 15', '6<i>k</i> − 15', '−6<i>k</i> + 5'], jaw: 'B' },
  { id: 'T2S3-A12', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Kenal pasti jujukan', m: 1,
    q: 'Antara berikut, yang manakah suatu jujukan?', qe: 'Which of the following is a sequence?',
    pil: ['2, 5, 8, 11, 14, …', '50, 40, 32, 30, …', '0.2, 0.4, 0.5, 0.9, …', '3, 6, 7, 12, 15, …'], jaw: 'A', sk: 'Tambah 3 setiap kali' },
  { id: 'T2S3-A13', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan sebutan tunggal', m: 1,
    q: 'Kembangkan <i>p</i>(3<i>q</i> − <i>r</i>).', qe: 'Expand <i>p</i>(3<i>q</i> − <i>r</i>).',
    pil: ['3<i>pq</i> − <i>r</i>', '3<i>pq</i> − <i>pr</i>', '3<i>p</i> − <i>pr</i>', '<i>pq</i> − 3<i>pr</i>'], jaw: 'B' },
  { id: 'T2S3-A14', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Pola jujukan menurun', m: 1,
    q: 'Berikut ialah suatu jujukan nombor.<br>10, 6, 2, −2, −6, …<br>Tentukan pola jujukan itu.', qe: 'The following is a number sequence.<br>10, 6, 2, −2, −6, …<br>Determine the pattern of the sequence.',
    pil: ['−4', '+4', '×2', '÷2'], jaw: 'A' },
  { id: 'T2S3-A15', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Lanjutkan jujukan darab dua sebutan', m: 1,
    q: 'Berikut ialah suatu urutan nombor.<br>4, 12, 36, 108, <i>m</i>, <i>n</i>, …<br>Cari nilai <i>m</i> + <i>n</i>.', qe: 'The following is a sequence of numbers.<br>4, 12, 36, 108, <i>m</i>, <i>n</i>, …<br>Find the value of <i>m</i> + <i>n</i>.',
    pil: ['432', '972', '1 296', '1 404'], jaw: 'C', sk: '<i>m</i> = 324, <i>n</i> = 972 → 1 296' },
  { id: 'T2S3-A16', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dua binomial berlainan pemboleh ubah', m: 1,
    q: 'Kembangkan (<i>p</i> + 5)(<i>q</i> − 3).', qe: 'Expand (<i>p</i> + 5)(<i>q</i> − 3).',
    pil: ['<i>pq</i> − 3<i>p</i> + 5<i>q</i> − 15', '<i>pq</i> + 2<i>pq</i> − 15', '<i>pq</i> − 3<i>p</i> − 5<i>q</i> − 15', '<i>pq</i> + 3<i>p</i> + 5<i>q</i> − 15'], jaw: 'A' },
  { id: 'T2S3-A17', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Kenal pasti pola daripada corak titik', m: 1, fig: 'S3A17',
    q: 'Rajah menunjukkan tiga corak pertama dalam suatu jujukan. Berapakah bilangan titik dalam corak ke-8?', qe: 'The diagram shows the first three patterns in a sequence. How many dots are there in the 8th pattern?',
    pil: ['27', '29', '31', '35'], jaw: 'C', sk: '3, 7, 11, … (tambah 4) → 3 + 7 × 4 = 31' },
  { id: 'T2S3-A18', bhg: 'A', bab: 1, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti jujukan Fibonacci', m: 1,
    q: 'Antara berikut, yang manakah jujukan Fibonacci?', qe: 'Which of the following is a Fibonacci sequence?',
    pil: ['1, 2, 4, 8, 16, …', '2, 4, 6, 8, 10, …', '1, 1, 2, 3, 5, 8, …', '1, 3, 4, 6, 9, …'], jaw: 'C', sk: 'Setiap sebutan ialah hasil tambah dua sebutan sebelumnya' },
  { id: 'T2S3-A19', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Gantian dalam ungkapan sebutan ke-n', m: 1,
    q: 'Sebutan ke-<i>n</i> bagi suatu jujukan nombor ialah 4<i>n</i> + 3. Apakah sebutan ke-9?', qe: 'The <i>n</i>th term of a number sequence is 4<i>n</i> + 3. What is the 9th term?',
    pil: ['12', '36', '39', '43'], jaw: 'C', sk: '4(9) + 3 = 39' },
  { id: 'T2S3-A20', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Lengkapkan urutan nombor genap, kemudian nilaikan ungkapan', m: 1,
    q: 'Berikut ialah suatu urutan nombor genap.<br>34, <i>x</i>, 38, 40, <i>y</i>, 44<br>Hitung nilai 3<i>x</i> − <i>y</i>.', qe: 'The following is a sequence of even numbers.<br>34, <i>x</i>, 38, 40, <i>y</i>, 44<br>Calculate the value of 3<i>x</i> − <i>y</i>.',
    pil: ['62', '66', '70', '78'], jaw: 'B', sk: '<i>x</i> = 36, <i>y</i> = 42 → 108 − 42 = 66' },

  // ---------------- SET 3 · BAHAGIAN B ----------------
  { id: 'T2S3-B01', bhg: 'B', bab: 1, parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada setiap yang berikut mempunyai pola. Bulatkan jawapan anda.', qe: 'Determine whether each of the following has a pattern. Circle your answer.',
      items: [{ t: 'Segi tiga, sisi empat, pentagon, heksagon, …: CH(Ya|Tidak)', te: 'Triangle, quadrilateral, pentagon, hexagon, …: CH(Yes|No)', a: 'Ya' },
        { t: '5, 2, 9, 4, 1, …: CH(Ya|Tidak)', te: '5, 2, 9, 4, 1, …: CH(Yes|No)', a: 'Tidak' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', fig: 'S3B01', q: 'Rajah menunjukkan tiga corak pertama suatu jujukan. Isi tempat kosong.', qe: 'The diagram shows the first three patterns of a sequence. Fill in the blanks.',
      items: [{ t: 'Bilangan segi empat sama dalam corak ke-4 = __________', te: 'The number of squares in the 4th pattern = __________', a: '11' },
        { t: 'Bilangan segi empat sama dalam corak ke-10 = __________', te: 'The number of squares in the 10th pattern = __________', a: '29' }] }] },
  { id: 'T2S3-B02', bhg: 'B', bab: 1, parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Senarai nombor berikut ialah sebahagian daripada jujukan Fibonacci yang berturutan.<br>5, 8, 13, <i>a</i>, 34, 55, <i>b</i>, …<br>Cari nilai <i>a</i> + <i>b</i>. Bulatkan jawapan anda.',
      qe: 'The following list of numbers is part of a consecutive Fibonacci sequence.<br>5, 8, 13, <i>a</i>, 34, 55, <i>b</i>, …<br>Find the value of <i>a</i> + <i>b</i>. Circle your answer.',
      items: [{ t: 'CH(76|89|110|144)', a: '110' }], sk: '<i>a</i> = 21, <i>b</i> = 89 → 110' },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Berikut ialah dua baris daripada Segi Tiga Pascal. Isi tempat kosong.', qe: 'The following are two rows of Pascal\'s Triangle. Fill in the blanks.',
      items: [{ t: '1, 5, ____, 10, 5, 1', a: '10' }, { t: '1, 7, 21, ____, 35, 21, 7, 1', a: '35' }] }] },
  { id: 'T2S3-B03', bhg: 'B', bab: 1, parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Pilih nombor yang betul daripada senarai berikut untuk melengkapkan jujukan.<br>30 &nbsp; 35 &nbsp; 40 &nbsp; −10 &nbsp; −15 &nbsp; −20<br>50, ____, 20, 5, ____, −25',
      qe: 'Choose the correct numbers from the following list to complete the sequence.<br>30 &nbsp; 35 &nbsp; 40 &nbsp; −10 &nbsp; −15 &nbsp; −20<br>50, ____, 20, 5, ____, −25',
      items: [{ t: 'Petak pertama: ____', te: 'First blank: ____', a: '35' }, { t: 'Petak kedua: ____', te: 'Second blank: ____', a: '−10' }] },
    { l: '(b)', jenis: 'bp', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Diberi jujukan nombor −5, 1, 7, 13, … Tulis <b>Benar</b> atau <b>Palsu</b> bagi setiap pernyataan.', qe: 'Given the number sequence −5, 1, 7, 13, … Write <b>True</b> or <b>False</b> for each statement.',
      items: [{ t: 'Sebutan ke-<i>n</i> ialah −5 + 6(<i>n</i> − 1), dengan keadaan <i>n</i> = 1, 2, 3, …', te: 'The <i>n</i>th term is −5 + 6(<i>n</i> − 1), where <i>n</i> = 1, 2, 3, …', a: 'Benar' },
        { t: '43 ialah sebutan ke-8.', te: '43 is the 8th term.', a: 'Palsu' }], sk: 'Sebutan ke-8 = −5 + 42 = 37' }] },
  { id: 'T2S3-B04', bhg: 'B', bab: 1, parts: [
    { l: '(a)', jenis: 'tanda', m: 2, aras: 'R', kon: 'Memahami', q: 'Tandakan (✓) bagi jujukan yang mengikut pola yang diberi.<br>(i) Mendarab nombor sebelumnya dengan 3<br>(ii) Menolak 6 daripada nombor sebelumnya',
      qe: 'Tick (✓) the sequences that follow the given pattern.<br>(i) Multiplying the previous number by 3<br>(ii) Subtracting 6 from the previous number',
      items: [{ t: '(i) 2, 6, 18, 54, …', a: '✓' }, { t: '(i) 3, 6, 9, 12, …', a: '' }, { t: '(ii) 20, 14, 8, 2, …', a: '✓' }, { t: '(ii) 20, 14, 9, 5, …', a: '' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi jujukan nombor −4, 3, 10, 17, … Bulatkan jawapan yang betul.', qe: 'Given the number sequence −4, 3, 10, 17, … Circle the correct answers.',
      items: [{ t: 'Sebutan ke-10 ialah CH(52|59|66)', te: 'The 10th term is CH(52|59|66)', a: '59' }, { t: 'Nombor 80 ialah sebutan ke-CH(12|13|14)', te: 'The number 80 is term number CH(12|13|14)', a: '13' }],
      sk: '−4 + 7(9) = 59; −4 + 7(<i>n</i> − 1) = 80 → <i>n</i> = 13' }] },
  { id: 'T2S3-B05', bhg: 'B', bab: 2, parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: '(<i>x</i> − 4)(3<i>x</i> + 5) = 3<i>x</i>² − ______ − 20', a: '7<i>x</i>' }, { t: '(2<i>x</i> + 1)² = 4<i>x</i>² + 4<i>x</i> + ______', a: '1' }] },
    { l: '(b)', jenis: 'pad', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan kembangannya yang betul.', qe: 'Match each expression with its correct expansion.',
      items: [{ t: '4(2<i>y</i> − 3)', a: '8<i>y</i> − 12' }, { t: '(3<i>a</i> − <i>b</i>)(2<i>a</i> + <i>b</i>)', a: '6<i>a</i>² + <i>ab</i> − <i>b</i>²' }, { t: '(<i>a</i> − <i>b</i>)²', a: '<i>a</i>² − 2<i>ab</i> + <i>b</i>²' }],
      kanan: ['<i>a</i>² − 2<i>ab</i> + <i>b</i>²', '8<i>y</i> − 12', '6<i>a</i>² + <i>ab</i> − <i>b</i>²'] }] }
);
