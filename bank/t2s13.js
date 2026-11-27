'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 13 (tambahan: 8 A · 3 B) ===================
   Set 13 (27 Nov 2026). Diolah semula oleh Mat berdasarkan Soalan Pecutan T2 (2)
   (rujukan: Downloads/Bank Soalan/T2_Pecutan-2.pdf). Kebanyakan soalan kertas itu sama dengan UASA T2 2026 (Set 7),
   jadi hanya konsep baharu dimasukkan. Persamaan serentak dan kuadratik (di luar T2) tidak dimasukkan. Dimuat selepas t2.js. */

BS_T2.push(
  { id: 'T2S13-A01', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Jujukan dengan beza yang bertambah', m: 1,
    q: 'Apakah nombor seterusnya dalam jujukan 2, 5, 10, 17, …?', qe: 'What is the next number in the sequence 2, 5, 10, 17, …?', pil: ['24', '26', '28', '30'], jaw: 'B', sk: 'Beza 3, 5, 7, 9 → 17 + 9 = 26' },
  { id: 'T2S13-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Sebutan jujukan nombor segi tiga', m: 1,
    q: 'Apakah beza antara sebutan kedua dan sebutan kelima dalam jujukan 1, 3, 6, 10, 15, …?', qe: 'What is the difference between the second and the fifth terms in the sequence 1, 3, 6, 10, 15, …?', pil: ['9', '12', '14', '15'], jaw: 'B' },
  { id: 'T2S13-A03', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Urutan nombor perdana', m: 1,
    q: 'Berikut ialah suatu urutan nombor perdana.<br>23, <i>x</i>, <i>y</i>, 37, 41<br>Hitung nilai 2<i>y</i> − <i>x</i>.', qe: 'The following is a sequence of prime numbers.<br>23, <i>x</i>, <i>y</i>, 37, 41<br>Calculate the value of 2<i>y</i> − <i>x</i>.',
    pil: ['29', '31', '33', '35'], jaw: 'C', sk: '<i>x</i> = 29, <i>y</i> = 31' },
  { id: 'T2S13-A04', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'T', kbat: true, why: 'Perkara rumus apabila pemboleh ubah di pengangka dan penyebut', m: 1,
    q: 'Diberi <i>y</i> = FR(3<i>x</i>|4 + <i>x</i>). Ungkapkan <i>x</i> dalam sebutan <i>y</i>.', qe: 'Given <i>y</i> = FR(3<i>x</i>|4 + <i>x</i>). Express <i>x</i> in terms of <i>y</i>.',
    pil: ['<i>x</i> = FR(4<i>y</i>|3 − <i>y</i>)', '<i>x</i> = FR(4<i>y</i>|3 + <i>y</i>)', '<i>x</i> = FR(3<i>y</i>|4 − <i>y</i>)', '<i>x</i> = FR(3<i>y</i>|4 + <i>y</i>)'], jaw: 'A', sk: '4<i>y</i> + <i>xy</i> = 3<i>x</i> → <i>x</i>(3 − <i>y</i>) = 4<i>y</i>' },
  { id: 'T2S13-A05', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Luas sektor dengan π = 3.142', m: 1,
    q: 'Sebuah bulatan berpusat <i>O</i> mempunyai jejari 6 cm. Cari luas sektor minor yang bersudut 100° di pusat. (Guna π = 3.142)', qe: 'A circle with centre <i>O</i> has a radius of 6 cm. Find the area of the minor sector with an angle of 100° at the centre. (Use π = 3.142)',
    pil: ['10.47 cm²', '31.42 cm²', '62.84 cm²', '113.11 cm²'], jaw: 'B' },
  { id: 'T2S13-A06', bhg: 'A', bab: 9, kon: 'Mengaplikasi', aras: 'R', why: 'Pecutan daripada pegun', m: 1,
    q: 'Sebuah kereta memecut dari keadaan pegun hingga 30 m/s dalam masa 6 saat. Apakah pecutannya?', qe: 'A car accelerates from rest to 30 m/s in 6 seconds. What is its acceleration?', pil: ['3 m/s²', '5 m/s²', '6 m/s²', '180 m/s²'], jaw: 'B' },
  { id: 'T2S13-A07', bhg: 'A', bab: 12, kon: 'Mengaplikasi', aras: 'R', why: 'Median bilangan data genap', m: 1,
    q: 'Nyatakan median bagi set data 3, 9, 5, 11, 7, 13.', qe: 'State the median of the data set 3, 9, 5, 11, 7, 13.', pil: ['7', '8', '9', '10'], jaw: 'B', sk: '3, 5, 7, 9, 11, 13 → FR(7 + 9|2) = 8' },
  { id: 'T2S13-A08', bhg: 'A', bab: 13, kon: 'Mengaplikasi', aras: 'R', why: 'Kebarangkalian nombor ganjil', m: 1,
    q: 'Satu nombor dipilih secara rawak daripada nombor 1 hingga 15. Hitung kebarangkalian memilih nombor ganjil.', qe: 'A number is chosen at random from the numbers 1 to 15. Calculate the probability of choosing an odd number.',
    pil: ['FR(7|15)', 'FR(1|2)', 'FR(8|15)', 'FR(2|3)'], jaw: 'C' },

  { id: 'T2S13-B01', bhg: 'B', bab: 1, parts: [
    { l: '', jenis: 'isi', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Lengkapkan setiap jujukan.', qe: 'Complete each sequence.',
      items: [{ t: '4, 9, ____, 19, …', a: '14' }, { t: '4, 9, 14, 19, ____, …', a: '24' }, { t: '5, 15, ____, 135, …', a: '45' }, { t: '320, 160, ____, 40, …', a: '80' }] }] },
  { id: 'T2S13-B02', bhg: 'B', bab: 10, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap garis lurus dengan kecerunannya.', qe: 'Match each straight line with its gradient.',
      items: [{ t: 'Melalui (2, 1) dan (5, 7)', te: 'Through (2, 1) and (5, 7)', a: '2' }, { t: 'Melalui (1, 4) dan (4, 8)', te: 'Through (1, 4) and (4, 8)', a: 'FR(4|3)' },
        { t: 'Melalui (0, 6) dan (3, 1)', te: 'Through (0, 6) and (3, 1)', a: '−FR(5|3)' }, { t: 'Pintasan-<i>x</i> = 4 dan pintasan-<i>y</i> = 6', te: '<i>x</i>-intercept = 4 and <i>y</i>-intercept = 6', a: '−FR(3|2)' }],
      kanan: ['−FR(3|2)', '2', '−FR(5|3)', 'FR(4|3)'] }] },
  { id: 'T2S13-B03', bhg: 'B', bab: 12, q: 'Jadual menunjukkan markah sekumpulan pelajar dalam satu kuiz.', qe: 'The table shows the marks of a group of students in a quiz.', parts: [
    { l: '', jenis: 'bulat', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Bulatkan jawapan yang betul.', qe: 'Circle the correct answers.',
      jadual: { r: [['Markah', '10', '20', '30', '40', '50'], ['Kekerapan', '2', '5', '8', '3', '2']], re: ['Marks', 'Frequency'] },
      items: [{ t: 'Jumlah pelajar: CH(5|20|25)', te: 'Total number of students', a: '20' }, { t: 'Mod: CH(8|30|50)', te: 'Mode', a: '30' }, { t: 'Median: CH(20|30|40)', te: 'Median', a: '30' }, { t: 'Min: CH(28|29|30)', te: 'Mean', a: '29' }],
      sk: 'Min = FR(20 + 100 + 240 + 120 + 100|20) = 29' }] }
);
