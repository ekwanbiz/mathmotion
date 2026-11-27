'use strict';
/* =================== BANK SOALAN · TINGKATAN 1 · SET 4 (tambahan: 8 A · 2 B · 2 C) ===================
   Set 4 (27 Nov 2026). Diolah semula oleh Mat berdasarkan Kertas Model UASA T1 2023/24 Set 1
   (rujukan: Downloads/Bank Soalan/T1_UASA-2023-24_Set1.docx). Kertas itu banyak sama dengan UASA 2024 SMKRP (Set 1),
   jadi hanya soalan yang konsepnya baharu dimasukkan. Topik Set tidak dimasukkan. Dimuat selepas t1.js. */

BS_T1.push(
  { id: 'T1S4-A01', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Tiga gandaan sepunya pertama', m: 1,
    q: 'Tentukan tiga gandaan sepunya yang pertama bagi 6 dan 9.', qe: 'Determine the first three common multiples of 6 and 9.',
    pil: ['18, 36, 54', '3, 6, 9', '9, 18, 27', '54, 108, 162'], jaw: 'A' },
  { id: 'T1S4-A02', bhg: 'A', bab: 5, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Bentuk dan selesaikan persamaan umur', m: 1,
    q: 'Beza umur antara Aiman dengan abangnya ialah 6 tahun. Dalam masa 4 tahun lagi, jumlah umur mereka ialah 40 tahun. Berapakah umur Aiman sekarang?',
    qe: 'The age difference between Aiman and his elder brother is 6 years. In 4 years\' time, the sum of their ages will be 40 years. How old is Aiman now?',
    pil: ['13', '16', '19', '22'], jaw: 'A', sk: 'Jumlah umur sekarang = 40 − 8 = 32<br><i>a</i> + (<i>a</i> + 6) = 32 → <i>a</i> = 13' },
  { id: 'T1S4-A03', bhg: 'A', bab: 5, kon: 'Menilai', aras: 'R', why: 'Banding nombor negatif dan pecahan', m: 1,
    q: 'Antara berikut, yang manakah ketaksamaan yang betul?', qe: 'Which of the following is a correct inequality?',
    pil: ['−8 > −3', '−2.5 < −2.05', 'FR(2|3) < FR(3|5)', '0 < −1'], jaw: 'B' },
  { id: 'T1S4-A04', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'S', why: 'Pythagoras kemudian luas', m: 1,
    q: 'Sebuah segi tiga bersudut tegak mempunyai hipotenus 17 cm dan satu sisi 8 cm. Hitung luas segi tiga itu, dalam cm².', qe: 'A right-angled triangle has a hypotenuse of 17 cm and a side of 8 cm. Calculate the area of the triangle, in cm².',
    pil: ['60', '68', '120', '136'], jaw: 'A', sk: 'Sisi lain = 15 cm → FR(1|2) × 8 × 15 = 60' },
  { id: 'T1S4-A05', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'S', why: 'Lebar daripada luas, kemudian perimeter', m: 1,
    q: 'Panjang sebuah halaman rumah berbentuk segi empat tepat ialah 18 m dan luasnya 216 m². Cari perimeter halaman itu, dalam m.', qe: 'The length of a rectangular yard is 18 m and its area is 216 m². Find the perimeter of the yard, in m.',
    pil: ['30', '60', '108', '234'], jaw: 'B', sk: 'Lebar = 12 m → 2(18 + 12) = 60' },
  { id: 'T1S4-A06', bhg: 'A', bab: 8, kon: 'Mengaplikasi', aras: 'S', why: 'Tafsir sudut carta pai', m: 1,
    q: 'Sebuah carta pai mewakili jus kegemaran 36 orang murid. Sektor jus mangga bersudut 120°. Berapakah bilangan murid yang menyukai jus mangga?', qe: 'A pie chart represents the favourite juices of 36 pupils. The mango juice sector has an angle of 120°. How many pupils like mango juice?',
    pil: ['10', '12', '18', '24'], jaw: 'B', sk: 'FR(120°|360°) × 36 = 12' },
  { id: 'T1S4-A07', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Teorem Pythagoras dalam situasi berperingkat', m: 1,
    q: 'Sebuah dron terbang secara condong sejauh 50 m dari tanah sehingga ketinggian 30 m, kemudian terbang mendatar sejauh 25 m, lalu turun secara condong sejauh 34 m hingga mendarat di tanah. Cari jarak mengufuk, dalam m, dari kedudukan mula ke kedudukan mendarat.',
    qe: 'A drone flies diagonally 50 m from the ground up to a height of 30 m, then flies horizontally 25 m, then descends diagonally 34 m until it lands. Find the horizontal distance, in m, from the starting position to the landing position.',
    pil: ['65', '81', '109', '134'], jaw: 'B', sk: 'RT(50² − 30²) = 40; RT(34² − 30²) = 16<br>40 + 25 + 16 = 81' },
  { id: 'T1S4-A08', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Sudut penggenap dengan ungkapan', m: 1,
    q: 'Sudut <i>x</i> dan (2<i>x</i> + 15°) ialah sudut penggenap. Cari nilai <i>x</i>.', qe: 'Angles <i>x</i> and (2<i>x</i> + 15°) are supplementary angles. Find the value of <i>x</i>.',
    pil: ['45°', '55°', '65°', '75°'], jaw: 'B', sk: '3<i>x</i> + 15° = 180°' },

  { id: 'T1S4-B01', bhg: 'B', bab: 5, babs: [5, 7], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi ketaksamaan serentak 2<i>x</i> + 1 > 7 dan <i>x</i> − 4 ≤ 2. Isi tempat kosong.', qe: 'Given the simultaneous inequalities 2<i>x</i> + 1 > 7 and <i>x</i> − 4 ≤ 2. Fill in the blanks.',
      items: [{ t: 'Penyelesaian: __________', te: 'Solution: __________', a: '3 < <i>x</i> ≤ 6' }, { t: 'Integer yang memuaskan: __________', te: 'Integers that satisfy: __________', a: '4, 5, 6' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Perimeter sebuah kolam renang berbentuk segi empat tepat ialah 70 m dan panjangnya 22 m. Isi tempat kosong.', qe: 'The perimeter of a rectangular swimming pool is 70 m and its length is 22 m. Fill in the blanks.',
      items: [{ t: 'Lebar kolam = __________', te: 'Width of the pool = __________', a: '13 m' }, { t: 'Luas kolam = __________', te: 'Area of the pool = __________', a: '286 m²' }] }] },
  { id: 'T1S4-B02', bhg: 'B', bab: 7, babs: [6, 7], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'T', kon: 'Menganalisis', q: '<i>PQR</i> ialah segi tiga sama kaki dengan <i>PQ</i> = <i>PR</i> dan ∠<i>QPR</i> = 40°. Garis <i>SPT</i> melalui <i>P</i> dan selari dengan <i>QR</i>, dengan <i>S</i> di sebelah <i>Q</i>. Isi tempat kosong.',
      qe: '<i>PQR</i> is an isosceles triangle with <i>PQ</i> = <i>PR</i> and ∠<i>QPR</i> = 40°. The line <i>SPT</i> passes through <i>P</i> and is parallel to <i>QR</i>, with <i>S</i> on the side of <i>Q</i>. Fill in the blanks.',
      items: [{ t: '∠<i>PQR</i> = __________', a: '70°' }, { t: '∠<i>SPQ</i> = __________', a: '70°' }], sk: '∠<i>SPQ</i> dan ∠<i>PQR</i> ialah sudut selang-seli' },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Panjang pepenjuru sebuah segi empat sama ialah 10 cm. Bulatkan jawapan yang betul.', qe: 'The length of the diagonal of a square is 10 cm. Circle the correct answers.',
      items: [{ t: '(Sisi)² = CH(25|50|100) cm²', te: '(Side)²', a: '50' }, { t: 'Luas segi empat sama = CH(25 cm²|50 cm²|100 cm²)', te: 'Area of the square', a: '50 cm²' }], sk: '2<i>s</i>² = 10² → <i>s</i>² = 50' }] },

  { id: 'T1S4-C01', bhg: 'C', bab: 8, babs: [3, 8], parts: [
    { l: '(a)', m: 5, aras: 'S', kon: 'Mengaplikasi', q: 'Terdapat 120 orang penumpang di dalam sebuah tren. Di stesen berikutnya, 30 orang turun dan 18 orang naik.<br>(i) Hitung peratusan penumpang yang turun berbanding jumlah penumpang asal.<br>(ii) Ungkapkan nisbah penumpang yang naik kepada jumlah baharu penumpang sebagai pecahan termudah, perpuluhan (2 tempat perpuluhan) dan peratusan.',
      qe: 'There are 120 passengers on a train. At the next station, 30 get off and 18 get on.<br>(i) Calculate the percentage of passengers who got off compared with the original number.<br>(ii) Express the ratio of passengers who got on to the new total as a fraction in simplest form, a decimal (2 decimal places) and a percentage.',
      sk: '(i) FR(30|120) × 100% <b>K1</b> = 25% <b>N1</b><br>(ii) Jumlah baharu = 108 <b>K1</b>; FR(18|108) = FR(1|6) <b>N1</b>; 0.17, 16.7% <b>N1</b>' },
    { l: '(b)', m: 5, aras: 'S', kon: 'Menganalisis', q: 'Plot batang-dan-daun menunjukkan markah 12 orang murid dalam suatu ujian.<br>4 | 2 5 8<br>5 | 0 3 3 7<br>6 | 1 4 9<br>7 | 2 6<br>Kekunci: 4 | 2 bermaksud 42<br>(i) Senaraikan semua markah.<br>(ii) Berapakah bilangan murid yang mendapat sekurang-kurangnya 60 markah?<br>(iii) Nyatakan markah tertinggi dan mod.',
      qe: 'The stem-and-leaf plot shows the marks of 12 pupils in a test.<br>(i) List all the marks.<br>(ii) How many pupils scored at least 60 marks?<br>(iii) State the highest mark and the mode.',
      sk: '(i) 42, 45, 48, 50, 53, 53, 57, 61, 64, 69, 72, 76 <b>P2</b><br>(ii) 5 <b>P1</b><br>(iii) 76 <b>P1</b>; mod 53 <b>P1</b>' }] },
  { id: 'T1S4-C02', bhg: 'C', bab: 6, babs: [6, 7], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Menganalisis', q: '<i>p</i> dan <i>q</i> ialah sudut pelengkap dengan <i>p</i> = 2<i>q</i>. <i>r</i> ialah sudut penggenap bagi <i>p</i> dan <i>s</i> ialah sudut konjugat bagi <i>r</i>. Hitung nilai <i>p</i>, <i>q</i>, <i>r</i> dan <i>s</i>.',
      qe: '<i>p</i> and <i>q</i> are complementary angles with <i>p</i> = 2<i>q</i>. <i>r</i> is the supplementary angle of <i>p</i> and <i>s</i> is the conjugate angle of <i>r</i>. Calculate the values of <i>p</i>, <i>q</i>, <i>r</i> and <i>s</i>.',
      sk: '<i>q</i> = 30° <b>N1</b>; <i>p</i> = 60° <b>N1</b>; <i>r</i> = 120° <b>N1</b>; <i>s</i> = 240° <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: '<i>ABCD</i> ialah sebuah trapezium dengan <i>AB</i> selari dengan <i>DC</i>. ∠<i>ABC</i> = 3<i>y</i> dan ∠<i>BCD</i> = (2<i>y</i> + 30°). Cari nilai <i>y</i>.',
      qe: '<i>ABCD</i> is a trapezium with <i>AB</i> parallel to <i>DC</i>. ∠<i>ABC</i> = 3<i>y</i> and ∠<i>BCD</i> = (2<i>y</i> + 30°). Find the value of <i>y</i>.',
      sk: 'Sudut pedalaman: 3<i>y</i> + 2<i>y</i> + 30° = 180° <b>K1 K1</b>; <i>y</i> = 30° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Ahmad berjalan 15 m ke arah timur dari titik <i>A</i> ke titik <i>B</i>, kemudian 20 m ke arah utara dari titik <i>B</i> ke titik <i>C</i>. Cari beza antara jarak yang dilalui dengan jarak terus dari <i>A</i> ke <i>C</i>.',
      qe: 'Ahmad walks 15 m due east from point <i>A</i> to point <i>B</i>, then 20 m due north from point <i>B</i> to point <i>C</i>. Find the difference between the distance walked and the direct distance from <i>A</i> to <i>C</i>.',
      sk: '<i>AC</i> = RT(15² + 20²) <b>K1</b> = 25 m <b>K1</b>; 35 − 25 = 10 m <b>N1</b>' }] }
);
