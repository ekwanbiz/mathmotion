'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 12 (format Pentaksiran Pertengahan Penggal, Bab 1–5) ===================
   Set 12 (27 Nov 2026): 16 A · 4 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras PPT T2 2023/24 SMKRP
   (rujukan: Downloads/Bank Soalan/T2_PPT-2023-24.docx). Kebanyakan soalan aras rendah, sesuai untuk latihan asas.
   Soalan bina bulatan diganti soalan bertulis. Dimuat selepas t2.js. */

BS_T2.push(
  // ---------------- SET 12 · BAHAGIAN A ----------------
  { id: 'T2S12-A01', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Sebutan yang hilang', m: 1,
    q: 'Diberi jujukan 17, 29, 41, <i>x</i>, 65, … Tentukan nilai <i>x</i>.', qe: 'Given the sequence 17, 29, 41, <i>x</i>, 65, … Determine the value of <i>x</i>.', pil: ['51', '52', '53', '54'], jaw: 'C' },
  { id: 'T2S12-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Kedudukan sebutan', m: 1,
    q: 'Diberi jujukan 6, 13, 20, 27, … Jika sebutan ke-<i>n</i> ialah 83, tentukan nilai <i>n</i>.', qe: 'Given the sequence 6, 13, 20, 27, … If the <i>n</i>th term is 83, determine the value of <i>n</i>.', pil: ['10', '11', '12', '13'], jaw: 'C', sk: '6 + 7(<i>n</i> − 1) = 83' },
  { id: 'T2S12-A03', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan sebutan tunggal', m: 1,
    q: '6(3 − 2<i>q</i>) =', qe: '6(3 − 2<i>q</i>) =', pil: ['18 − 12<i>q</i>', '9 − 2<i>q</i>', '18 + 12<i>q</i>', '−18 − 12<i>q</i>'], jaw: 'A' },
  { id: 'T2S12-A04', bhg: 'A', bab: 4, kon: 'Mengingat', aras: 'R', why: 'Nama poligon', m: 1,
    q: 'Sebuah poligon yang mempunyai sembilan sisi dikenali sebagai', qe: 'A polygon with nine sides is known as', pil: ['heptagon', 'oktagon', 'nonagon', 'dekagon'], pe: ['a heptagon', 'an octagon', 'a nonagon', 'a decagon'], jaw: 'C' },
  { id: 'T2S12-A05', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Faktorkan sebutan sepunya', m: 1,
    q: 'Faktorkan 6<i>x</i> − 18.', qe: 'Factorise 6<i>x</i> − 18.', pil: ['6(<i>x</i> − 3)', '6(<i>x</i> + 3)', '3(<i>x</i> − 6)', '6(<i>x</i> − 18)'], jaw: 'A' },
  { id: 'T2S12-A06', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan', m: 1,
    q: 'Kembangkan <i>k</i>(3<i>k</i> − 2<i>m</i>).', qe: 'Expand <i>k</i>(3<i>k</i> − 2<i>m</i>).', pil: ['3<i>k</i>² − 2<i>m</i>', '3<i>k</i>² − 2<i>km</i>', '3<i>k</i> − 2<i>km</i>', '4<i>k</i> − 2<i>km</i>'], jaw: 'B' },
  { id: 'T2S12-A07', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Tukar perkara rumus mudah', m: 1,
    q: 'Diberi <i>p</i> = <i>q</i> − 9. Ungkapkan <i>q</i> sebagai perkara rumus.', qe: 'Given <i>p</i> = <i>q</i> − 9. Express <i>q</i> as the subject of the formula.',
    pil: ['<i>q</i> = <i>p</i> + 9', '<i>q</i> = <i>p</i> − 9', '<i>q</i> = 9 − <i>p</i>', '<i>p</i> = <i>q</i> + 9'], jaw: 'A' },
  { id: 'T2S12-A08', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Tambah pecahan algebra sepenyebut', m: 1,
    q: 'FR(15<i>a</i>|8<i>b</i>) + FR(9<i>a</i>|8<i>b</i>) =', qe: 'FR(15<i>a</i>|8<i>b</i>) + FR(9<i>a</i>|8<i>b</i>) =', pil: ['FR(3<i>a</i>|<i>b</i>)', 'FR(24<i>a</i>²|16<i>b</i>²)', 'FR(6<i>a</i>|<i>b</i>)', 'FR(3<i>a</i>|2<i>b</i>)'], jaw: 'A' },
  { id: 'T2S12-A09', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Gantian ke dalam rumus', m: 1,
    q: 'Diberi <i>w</i> = 5<i>z</i> − 4. Cari nilai <i>z</i> apabila <i>w</i> = 31.', qe: 'Given <i>w</i> = 5<i>z</i> − 4. Find the value of <i>z</i> when <i>w</i> = 31.', pil: ['5', '6', '7', '9'], jaw: 'C' },
  { id: 'T2S12-A10', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'FSTB sebutan algebra', m: 1,
    q: 'Cari FSTB bagi 12<i>mn</i> dan 18<i>n</i>².', qe: 'Find the HCF of 12<i>mn</i> and 18<i>n</i>².', pil: ['6', '3<i>n</i>', '6<i>n</i>', '6<i>mn</i>'], jaw: 'C' },
  { id: 'T2S12-A11', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Pola jujukan', m: 1,
    q: 'Tentukan pola bagi jujukan −15, −9, −3, 3, 9, …', qe: 'Determine the pattern of the sequence −15, −9, −3, 3, 9, …', pil: ['−6', '+6', '×3', '÷3'], jaw: 'B' },
  { id: 'T2S12-A12', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dua binomial', m: 1,
    q: 'Kembangkan (<i>x</i> + 5)(<i>x</i> + 3).', qe: 'Expand (<i>x</i> + 5)(<i>x</i> + 3).', pil: ['<i>x</i>² + 8<i>x</i> + 15', '<i>x</i>² + 15<i>x</i> + 8', '<i>x</i>² + 8<i>x</i> − 15', '<i>x</i>² + 2<i>x</i> + 15'], jaw: 'A' },
  { id: 'T2S12-A13', bhg: 'A', bab: 4, kon: 'Memahami', aras: 'R', why: 'Paksi simetri poligon sekata', m: 1,
    q: 'Nyatakan bilangan paksi simetri bagi sebuah pentagon sekata.', qe: 'State the number of axes of symmetry of a regular pentagon.', pil: ['3', '4', '5', '10'], jaw: 'C' },
  { id: 'T2S12-A14', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'R', why: 'Lilitan bulatan', m: 1,
    q: 'Hitung lilitan sebuah bulatan berjejari 14 cm. (Guna π = FR(22|7))', qe: 'Calculate the circumference of a circle with a radius of 14 cm. (Use π = FR(22|7))', pil: ['44 cm', '88 cm', '154 cm', '616 cm'], jaw: 'B' },
  { id: 'T2S12-A15', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Jejari daripada luas', m: 1,
    q: 'Luas sebuah bulatan ialah 154 cm². Hitung jejari bulatan itu. (Guna π = FR(22|7))', qe: 'The area of a circle is 154 cm². Calculate the radius of the circle. (Use π = FR(22|7))', pil: ['3.5 cm', '7 cm', '14 cm', '49 cm'], jaw: 'B' },
  { id: 'T2S12-A16', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Luas daripada diameter', m: 1,
    q: 'Hitung luas sebuah bulatan berdiameter 28 cm, dalam cm². (Guna π = FR(22|7))', qe: 'Calculate the area of a circle with a diameter of 28 cm, in cm². (Use π = FR(22|7))', pil: ['88', '154', '616', '2 464'], jaw: 'C' },

  // ---------------- SET 12 · BAHAGIAN B ----------------
  { id: 'T2S12-B01', bhg: 'B', bab: 1, parts: [
    { l: '', jenis: 'bulat', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Bulatkan sebutan yang hilang bagi setiap jujukan.', qe: 'Circle the missing terms of each sequence.',
      items: [{ t: '15, 26, ____, 48, … Sebutan ke-3: CH(36|37|38)', te: '3rd term', a: '37' }, { t: '15, 26, 37, 48, ____, … Sebutan ke-5: CH(57|59|61)', te: '5th term', a: '59' },
        { t: '640, 610, ____, 550, … Sebutan ke-3: CH(570|580|590)', te: '3rd term', a: '580' }, { t: '640, 610, 580, 550, ____, … Sebutan ke-5: CH(500|520|530)', te: '5th term', a: '520' }] }] },
  { id: 'T2S12-B02', bhg: 'B', bab: 2, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan faktornya.', qe: 'Match each expression with its factors.',
      items: [{ t: '<i>x</i>² + 8<i>x</i> + 16', a: '(<i>x</i> + 4)(<i>x</i> + 4)' }, { t: '<i>x</i>² + 2<i>x</i> − 15', a: '(<i>x</i> + 5)(<i>x</i> − 3)' }, { t: '<i>x</i>² − 2<i>x</i> − 3', a: '(<i>x</i> − 3)(<i>x</i> + 1)' }, { t: '<i>x</i>² + 5<i>x</i> + 6', a: '(<i>x</i> + 2)(<i>x</i> + 3)' }],
      kanan: ['(<i>x</i> + 2)(<i>x</i> + 3)', '(<i>x</i> − 3)(<i>x</i> + 1)', '(<i>x</i> + 4)(<i>x</i> + 4)', '(<i>x</i> + 5)(<i>x</i> − 3)'] }] },
  { id: 'T2S12-B03', bhg: 'B', bab: 3, parts: [
    { l: '', jenis: 'bp', m: 4, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada pemboleh ubah yang diberi ialah perkara rumus. Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'Determine whether the given variable is the subject of the formula. Write <b>True</b> or <b>False</b>.',
      items: [{ t: '<i>p</i> = 4<i>q</i> − <i>r</i> &nbsp;&nbsp; (<i>p</i>)', a: 'Benar' }, { t: '2<i>m</i> = <i>n</i> + 5<i>k</i> &nbsp;&nbsp; (<i>m</i>)', a: 'Palsu' }, { t: '−<i>y</i> = <i>x</i> + 3 &nbsp;&nbsp; (<i>y</i>)', a: 'Palsu' }, { t: '<i>h</i> = FR(<i>g</i>|3) + 1 &nbsp;&nbsp; (<i>h</i>)', a: 'Benar' }] }] },
  { id: 'T2S12-B04', bhg: 'B', bab: 4, babs: [4, 5], parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'R', kon: 'Memahami', q: 'Bagi sebuah heksagon sekata, tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'For a regular hexagon, write <b>True</b> or <b>False</b>.',
      items: [{ t: 'Sudut peluarannya ialah 72°.', te: 'Its exterior angle is 72°.', a: 'Palsu' }, { t: 'Hasil tambah sudut pedalamannya ialah 720°.', te: 'The sum of its interior angles is 720°.', a: 'Benar' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengingat', q: 'Bulatkan nama bahagian bulatan yang betul.', qe: 'Circle the correct name of the part of the circle.',
      items: [{ t: 'Rantau yang dibatasi oleh dua jejari dan lengkok minor: CH(sektor minor|sektor major|tembereng minor)', te: 'Region bounded by two radii and a minor arc', a: 'sektor minor' },
        { t: 'Garis lurus melalui pusat yang menyambungkan dua titik pada lilitan: CH(jejari|diameter|perentas)', te: 'Straight line through the centre joining two points on the circumference', a: 'diameter' }] }] },

  // ---------------- SET 12 · BAHAGIAN C ----------------
  { id: 'T2S12-C01', bhg: 'C', bab: 1, parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Lengkapkan baris Segi Tiga Pascal berikut: 1, 5, ____, ____, 5, 1', qe: 'Complete the following row of Pascal\'s Triangle: 1, 5, ____, ____, 5, 1', sk: '10, 10 <b>P2</b>' },
    { l: '(b)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi jujukan <i>m</i>, −5, 2, <i>n</i>, 16, 23, …<br>(i) Cari nilai <i>m</i> dan <i>n</i>.<br>(ii) Cari sebutan ke-12.', qe: 'Given the sequence <i>m</i>, −5, 2, <i>n</i>, 16, 23, …<br>(i) Find the values of <i>m</i> and <i>n</i>.<br>(ii) Find the 12th term.',
      sk: '(i) <i>m</i> = −12 <b>N1</b>; <i>n</i> = 9 <b>N1</b><br>(ii) −12 + 7(11) <b>K1</b> = 65 <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Puan Faizah mempunyai 220 biji gula-gula. Dia memasukkan 4 biji ke dalam kotak pertama, 7 biji ke dalam kotak kedua, 10 biji ke dalam kotak ketiga dan seterusnya mengikut pola yang sama. Berapakah bilangan kotak yang dapat diisi penuh mengikut pola itu, dan berapakah baki gula-gula?',
      qe: 'Puan Faizah has 220 sweets. She puts 4 sweets into the first box, 7 into the second, 10 into the third and so on following the same pattern. How many boxes can be filled completely following the pattern, and how many sweets are left?',
      sk: '4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37 <b>K1</b><br>Jumlah 11 kotak = 209; 12 kotak = 246 > 220 <b>K1</b><br>11 kotak <b>N1</b>; baki 11 biji <b>N1</b>' }] },
  { id: 'T2S12-C02', bhg: 'C', bab: 2, parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Faktorkan selengkapnya.<br>(i) 24<i>c</i> − 6<br>(ii) <i>y</i>² − 10<i>y</i> + 21', qe: 'Factorise completely.<br>(i) 24<i>c</i> − 6<br>(ii) <i>y</i>² − 10<i>y</i> + 21',
      sk: '(i) 6(4<i>c</i> − 1) <b>P2</b><br>(ii) (<i>y</i> − 3)(<i>y</i> − 7) <b>P2</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Permudahkan FR(2|<i>x</i>) + FR(3|2<i>x</i>).', qe: 'Simplify FR(2|<i>x</i>) + FR(3|2<i>x</i>).', sk: 'FR(4 + 3|2<i>x</i>) <b>K1</b> = FR(7|2<i>x</i>) <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah segi empat sama bersisi (2<i>p</i> + 1) cm.<br>(i) Ungkapkan luas segi empat sama itu dalam sebutan <i>p</i>.<br>(ii) Hitung luasnya, dalam cm², jika <i>p</i> = 3.', qe: 'A square has sides of (2<i>p</i> + 1) cm.<br>(i) Express the area of the square in terms of <i>p</i>.<br>(ii) Calculate its area, in cm², if <i>p</i> = 3.',
      sk: '(i) (2<i>p</i> + 1)² <b>K1</b> = 4<i>p</i>² + 4<i>p</i> + 1 <b>N1</b><br>(ii) 7² <b>K1</b> = 49 cm² <b>N1</b>' }] },
  { id: 'T2S12-C03', bhg: 'C', bab: 3, parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi <i>a</i>² = <i>b</i>² + <i>c</i>².<br>(i) Ungkapkan <i>a</i> sebagai perkara rumus.<br>(ii) Ungkapkan <i>b</i> sebagai perkara rumus.', qe: 'Given <i>a</i>² = <i>b</i>² + <i>c</i>².<br>(i) Express <i>a</i> as the subject of the formula.<br>(ii) Express <i>b</i> as the subject of the formula.',
      sk: '(i) <i>a</i> = RT(<i>b</i>² + <i>c</i>²) <b>P2</b><br>(ii) <i>b</i>² = <i>a</i>² − <i>c</i>² <b>K1</b>; <i>b</i> = RT(<i>a</i>² − <i>c</i>²) <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi 5<i>u</i> − <i>s</i> = 3<i>r</i>.<br>(i) Ungkapkan <i>u</i> sebagai perkara rumus.<br>(ii) Hitung nilai <i>u</i> apabila <i>r</i> = 4 dan <i>s</i> = 3.', qe: 'Given 5<i>u</i> − <i>s</i> = 3<i>r</i>.<br>(i) Express <i>u</i> as the subject of the formula.<br>(ii) Calculate the value of <i>u</i> when <i>r</i> = 4 and <i>s</i> = 3.',
      sk: '(i) <i>u</i> = FR(3<i>r</i> + <i>s</i>|5) <b>P1</b><br>(ii) FR(12 + 3|5) <b>K1</b> = 3 <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: '<i>L</i> dan <i>k</i> masing-masing mewakili luas dan panjang sisi sebuah segi empat sama.<br>(i) Tulis rumus yang menghubungkan <i>L</i> dan <i>k</i>.<br>(ii) Jika <i>k</i> = 5, cari jumlah luas bagi 4 buah segi empat sama yang sama itu.',
      qe: '<i>L</i> and <i>k</i> represent the area and side length of a square respectively.<br>(i) Write a formula relating <i>L</i> and <i>k</i>.<br>(ii) If <i>k</i> = 5, find the total area of 4 such squares.',
      sk: '(i) <i>L</i> = <i>k</i>² <b>P1</b><br>(ii) 4 × 25 <b>K1</b> = 100 <b>N1</b>' }] },
  { id: 'T2S12-C04', bhg: 'C', bab: 4, parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah poligon sekata ialah 144°.<br>(i) Cari bilangan sisi poligon itu.<br>(ii) Cari hasil tambah sudut pedalamannya.<br>(iii) Namakan poligon itu.',
      qe: 'The interior angle of a regular polygon is 144°.<br>(i) Find the number of sides of the polygon.<br>(ii) Find the sum of its interior angles.<br>(iii) Name the polygon.',
      sk: '(i) FR(360°|36°) <b>K1</b> = 10 <b>N1</b><br>(ii) 1 440° <b>N1</b><br>(iii) Dekagon <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah pentagon tidak sekata ialah 2<i>x</i>, 3<i>x</i>, (<i>x</i> + 10°), 110° dan 120°. Cari nilai <i>x</i>.', qe: 'The interior angles of an irregular pentagon are 2<i>x</i>, 3<i>x</i>, (<i>x</i> + 10°), 110° and 120°. Find the value of <i>x</i>.',
      sk: '6<i>x</i> + 240° = 540° <b>K1 K1</b>; <i>x</i> = 50° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Pentagon <i>CDFGH</i> mempunyai satu paksi simetri yang melalui <i>H</i>. Diberi ∠<i>C</i> = ∠<i>G</i> = 105°, ∠<i>D</i> = ∠<i>F</i> = <i>x</i> dan ∠<i>H</i> = 130°. Cari nilai <i>x</i>.',
      qe: 'Pentagon <i>CDFGH</i> has an axis of symmetry passing through <i>H</i>. Given ∠<i>C</i> = ∠<i>G</i> = 105°, ∠<i>D</i> = ∠<i>F</i> = <i>x</i> and ∠<i>H</i> = 130°. Find the value of <i>x</i>.',
      sk: '2<i>x</i> + 210° + 130° = 540° <b>K1 K1</b>; <i>x</i> = 100° <b>N1</b>' }] },
  { id: 'T2S12-C05', bhg: 'C', bab: 5, parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung lilitan, dalam cm, bagi bulatan berikut. (Guna π = FR(22|7))<br>(i) Jejari = 3.5 cm<br>(ii) Diameter = 35 cm', qe: 'Calculate the circumference, in cm, of each circle. (Use π = FR(22|7))<br>(i) Radius = 3.5 cm<br>(ii) Diameter = 35 cm',
      sk: '(i) 2 × FR(22|7) × 3.5 <b>K1</b> = 22 <b>N1</b><br>(ii) 110 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Luas sebuah bulatan ialah 50.27 cm². Hitung jejarinya, dalam cm. (Guna π = 3.142)', qe: 'The area of a circle is 50.27 cm². Calculate its radius, in cm. (Use π = 3.142)',
      sk: '<i>j</i>² = FR(50.27|3.142) <b>K1</b> = 16.0 <b>K1</b>; <i>j</i> = 4 cm <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Lilitan sebuah bulatan ialah 88 cm. Hitung luas bulatan itu, dalam cm². (Guna π = FR(22|7))', qe: 'The circumference of a circle is 88 cm. Calculate the area of the circle, in cm². (Use π = FR(22|7))',
      sk: '2 × FR(22|7) × <i>j</i> = 88 <b>K1</b>; <i>j</i> = 14 <b>N1</b><br>FR(22|7) × 14² <b>K1</b> = 616 cm² <b>N1</b>' }] },
  { id: 'T2S12-C06', bhg: 'C', bab: 5, kbat: true, parts: [
    { l: '(a)', m: 6, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah bulatan berpusat <i>O</i>. Panjang lengkok minor <i>PQ</i> ialah 27.5 cm dan ∠<i>POQ</i> = 75°. (Guna π = FR(22|7))<br>(i) Cari panjang <i>OP</i>, dalam cm.<br>(ii) Hitung luas sektor minor <i>POQ</i>, dalam cm².',
      qe: 'A circle has centre <i>O</i>. The minor arc <i>PQ</i> is 27.5 cm long and ∠<i>POQ</i> = 75°. (Use π = FR(22|7))<br>(i) Find the length of <i>OP</i>, in cm.<br>(ii) Calculate the area of the minor sector <i>POQ</i>, in cm².',
      sk: '(i) FR(75°|360°) × 2 × FR(22|7) × <i>j</i> = 27.5 <b>K1 K1</b>; <i>j</i> = 21 cm <b>N1</b><br>(ii) FR(75°|360°) × FR(22|7) × 21² <b>K1 K1</b> = 288.75 cm² <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Dua perentas, masing-masing sepanjang 8 cm, dilukis dalam sebuah bulatan berjejari 5 cm.<br>(i) Hitung jarak setiap perentas dari pusat bulatan.<br>(ii) Nyatakan sifat simetri perentas yang ditunjukkan.',
      qe: 'Two chords, each 8 cm long, are drawn in a circle of radius 5 cm.<br>(i) Calculate the distance of each chord from the centre of the circle.<br>(ii) State the symmetry property of chords shown.',
      sk: '(i) RT(5² − 4²) <b>K1</b> = 3 cm <b>N1</b><br>(ii) Perentas yang sama panjang adalah sama jarak dari pusat bulatan <b>P2</b>' }] }
);
