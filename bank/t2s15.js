'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 15 (tambahan: 10 A · 2 B · 3 C) ===================
   Set 15 (27 Nov 2026). Diolah semula oleh Mat berdasarkan UPSA Matematik T2 Set 2 (rujukan: fail PDF UPSA T2 yang sama dengan Set 14).
   Set 2 kertas itu hampir sama dengan Set 1, jadi hanya konsep baharu dimasukkan. Dimuat selepas t2.js. */

BS_T2.push(
  { id: 'T2S15-A01', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Ruang di antara jubin poligon sekata', m: 1,
    q: 'Dua jubin berbentuk pentagon sekata dan satu jubin segi empat sama disusun bertemu di satu titik. Terdapat satu ruang di antara jubin itu. Cari sudut ruang itu.', qe: 'Two regular pentagon tiles and one square tile are placed meeting at a point. There is a gap between the tiles. Find the angle of the gap.',
    pil: ['36°', '54°', '72°', '90°'], jaw: 'B', sk: '360° − 2(108°) − 90° = 54°' },
  { id: 'T2S15-A02', bhg: 'A', bab: 4, kon: 'Menilai', aras: 'R', why: 'Ciri poligon sekata', m: 1,
    q: 'Antara berikut, yang manakah <b>bukan</b> ciri poligon sekata?', qe: 'Which of the following is <b>not</b> a characteristic of a regular polygon?',
    pil: ['Semua sisi sama panjang', 'Semua sudut pedalaman sama besar', 'Poligon sekata dengan <i>n</i> sisi mempunyai <i>n</i> + 1 paksi simetri', 'Semua bucu sama jarak dari pusat poligon'],
    pe: ['All sides are equal in length', 'All interior angles are equal', 'A regular polygon with <i>n</i> sides has <i>n</i> + 1 axes of symmetry', 'All vertices are equidistant from the centre'], jaw: 'C' },
  { id: 'T2S15-A03', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Bilangan sisi daripada hasil tambah, kemudian paksi simetri', m: 1,
    q: 'Hasil tambah sudut pedalaman sebuah poligon sekata ialah 1 260°. Berapakah bilangan paksi simetri poligon itu?', qe: 'The sum of the interior angles of a regular polygon is 1 260°. How many axes of symmetry does the polygon have?',
    pil: ['7', '8', '9', '10'], jaw: 'C' },
  { id: 'T2S15-A04', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Sudut daripada luas sektor', m: 1,
    q: 'Luas sebuah sektor berjejari 14 cm ialah 154 cm². Cari sudut sektor itu. (Guna π = FR(22|7))', qe: 'The area of a sector with a radius of 14 cm is 154 cm². Find the angle of the sector. (Use π = FR(22|7))',
    pil: ['60°', '90°', '120°', '150°'], jaw: 'B' },
  { id: 'T2S15-A05', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Isi padu prisma dan unit', m: 1,
    q: 'Luas keratan rentas sebuah prisma ialah 40 cm² dan panjangnya 25 cm. Hitung isi padu prisma itu.', qe: 'The cross-sectional area of a prism is 40 cm² and its length is 25 cm. Calculate the volume of the prism.',
    pil: ['100 cm³', '1 000 cm³', '0.1 m³', '1 m³'], jaw: 'B' },
  { id: 'T2S15-A06', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Sisi tapak piramid daripada isi padu', m: 1,
    q: 'Sebuah piramid tegak bertapak segi empat sama mempunyai tinggi 9 cm dan isi padu 300 cm³. Hitung panjang sisi tapaknya, dalam cm.', qe: 'A right pyramid with a square base has a height of 9 cm and a volume of 300 cm³. Calculate the side length of its base, in cm.',
    pil: ['5', '10', '20', '100'], jaw: 'B' },
  { id: 'T2S15-A07', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'S', why: 'Banding jarak dari asalan', m: 1,
    q: 'Antara titik berikut, yang manakah paling jauh dari asalan?', qe: 'Which of the following points is the farthest from the origin?', pil: ['(−8, 15)', '(0, 16)', '(12, 5)', '(16, 0)'], jaw: 'A', sk: '17, 16, 13, 16' },
  { id: 'T2S15-A08', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Gantian ke dalam rumus penukaran suhu', m: 1,
    q: 'Rumus penukaran suhu ialah <i>C</i> = FR(5|9)(<i>F</i> − 32). Hitung nilai <i>F</i> apabila <i>C</i> = 37.', qe: 'The temperature conversion formula is <i>C</i> = FR(5|9)(<i>F</i> − 32). Calculate the value of <i>F</i> when <i>C</i> = 37.',
    pil: ['66.6', '98.6', '101.0', '212'], jaw: 'B', sk: '<i>F</i> = FR(9|5)(37) + 32' },
  { id: 'T2S15-A09', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'T', why: 'Bahagi ungkapan kuadratik', m: 1,
    q: 'Cikgu Marizan membeli (4<i>n</i> + 1) kotak pen. Jumlah pen ialah (8<i>n</i>² + 22<i>n</i> + 5) batang. Berapakah bilangan pen dalam setiap kotak?', qe: 'Cikgu Marizan buys (4<i>n</i> + 1) boxes of pens. There are (8<i>n</i>² + 22<i>n</i> + 5) pens altogether. How many pens are there in each box?',
    pil: ['2<i>n</i> + 5', '2<i>n</i> − 5', '4<i>n</i> + 5', '2<i>n</i> + 1'], jaw: 'A', sk: '(4<i>n</i> + 1)(2<i>n</i> + 5)' },
  { id: 'T2S15-A10', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'S', why: 'Nisbah hasil tambah sudut pedalaman dan peluaran', m: 1,
    q: 'Hasil tambah sudut pedalaman sebuah poligon ialah empat kali hasil tambah sudut peluarannya. Berapakah bilangan sisi poligon itu?', qe: 'The sum of the interior angles of a polygon is four times the sum of its exterior angles. How many sides does the polygon have?',
    pil: ['8', '9', '10', '12'], jaw: 'C', sk: '(<i>n</i> − 2) × 180° = 4 × 360°' },

  { id: 'T2S15-B01', bhg: 'B', bab: 2, babs: [2, 3], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bulatkan FSTB bagi setiap pasangan sebutan.', qe: 'Circle the HCF of each pair of terms.',
      items: [{ t: '8<i>a</i>³, 12<i>a</i>²: CH(2<i>a</i>|4<i>a</i>²|4<i>a</i>³)', a: '4<i>a</i>²' }, { t: '15<i>pq</i>², 6<i>p</i>²<i>q</i>: CH(3<i>pq</i>|3<i>p</i>²<i>q</i>²|<i>pq</i>)', a: '3<i>pq</i>' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada setiap yang berikut ialah rumus.', qe: 'Determine whether each of the following is a formula.',
      items: [{ t: '<i>V</i> = 2<i>a</i> + 3<i>b</i> − <i>c</i>: CH(Ya|Tidak)', te: '<i>V</i> = 2<i>a</i> + 3<i>b</i> − <i>c</i>: CH(Yes|No)', a: 'Ya' }, { t: '5<i>x</i> + 2 = 17: CH(Ya|Tidak)', te: '5<i>x</i> + 2 = 17: CH(Yes|No)', a: 'Tidak' }] }] },
  { id: 'T2S15-B02', bhg: 'B', bab: 4, parts: [
    { l: '', jenis: 'bp', m: 4, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada setiap pernyataan tentang poligon sekata <b>Benar</b> atau <b>Palsu</b>.', qe: 'Determine whether each statement about a regular polygon is <b>True</b> or <b>False</b>.',
      items: [{ t: 'Semua sisinya sama panjang.', te: 'All its sides are equal.', a: 'Benar' }, { t: 'Hasil tambah sudut peluaran dan sudut pedalaman yang sepadan ialah 360°.', te: 'The sum of an exterior angle and its corresponding interior angle is 360°.', a: 'Palsu' },
        { t: 'Bilangan paksi simetri sama dengan bilangan sisi.', te: 'The number of axes of symmetry equals the number of sides.', a: 'Benar' }, { t: 'Bilangan segi tiga yang terbentuk dari satu bucu sama dengan bilangan sisi.', te: 'The number of triangles formed from one vertex equals the number of sides.', a: 'Palsu' }] }] },

  { id: 'T2S15-C01', bhg: 'C', bab: 1, babs: [1, 6], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Menganalisis', q: 'Sebuah kotak kuboid bertapak 12 cm × 9 cm diisi penuh dengan 48 biji kubus bersisi 3 cm. Cari tinggi kotak itu, <i>h</i> cm.', qe: 'A cuboid box with a base of 12 cm × 9 cm is completely filled with 48 cubes of side 3 cm. Find the height of the box, <i>h</i> cm.',
      sk: '48 × 27 = 1 296 <b>K1</b>; 108<i>h</i> = 1 296 <b>K1</b>; <i>h</i> = 12 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Bilangan kon dalam susunan pertama hingga keempat ialah 4, 7, 10, 13.<br>(i) Adakah susunan itu suatu jujukan? Berikan sebab.<br>(ii) Cari bilangan kon dalam susunan ke-12.', qe: 'The numbers of cones in the first to fourth arrangements are 4, 7, 10, 13.<br>(i) Is the arrangement a sequence? Give a reason.<br>(ii) Find the number of cones in the 12th arrangement.',
      sk: '(i) Ya, tambah 3 setiap kali <b>P1</b><br>(ii) 4 + 3(11) <b>K1</b> = 37 <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Pengunjung bertuah sebuah karnival dipilih mengikut nombor resit 40, 80, 120, 160, …<br>(i) Nyatakan pola jujukan itu.<br>(ii) Cari nombor resit pengunjung bertuah ke-15 dan ke-30.', qe: 'Lucky visitors to a carnival are chosen by receipt numbers 40, 80, 120, 160, …<br>(i) State the pattern of the sequence.<br>(ii) Find the receipt numbers of the 15th and 30th lucky visitors.',
      sk: '(i) Tambah 40 <b>P1</b><br>(ii) 40 × 15 = 600 <b>K1 N1</b>; 40 × 30 = 1 200 <b>N1</b>' }] },
  { id: 'T2S15-C02', bhg: 'C', bab: 3, babs: [3, 4, 5], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah pentagon ialah <i>x</i>, <i>x</i>, <i>x</i>, 100° dan 122°. Cari<br>(i) hasil tambah sudut pedalaman pentagon,<br>(ii) nilai <i>x</i>.', qe: 'The interior angles of a pentagon are <i>x</i>, <i>x</i>, <i>x</i>, 100° and 122°. Find<br>(i) the sum of the interior angles of the pentagon,<br>(ii) the value of <i>x</i>.',
      sk: '(i) 540° <b>N1</b><br>(ii) 3<i>x</i> + 222° = 540° <b>K1</b>; <i>x</i> = 106° <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Mengaplikasi', q: 'Diberi <i>r</i> = FR(8<i>p</i>|<i>p</i> + 4).<br>(i) Nyatakan sama ada <i>r</i> ialah perkara rumus.<br>(ii) Ungkapkan <i>p</i> dalam sebutan <i>r</i>.', qe: 'Given <i>r</i> = FR(8<i>p</i>|<i>p</i> + 4).<br>(i) State whether <i>r</i> is the subject of the formula.<br>(ii) Express <i>p</i> in terms of <i>r</i>.',
      sk: '(i) Ya <b>P1</b><br>(ii) <i>rp</i> + 4<i>r</i> = 8<i>p</i> <b>K1</b>; <i>p</i>(8 − <i>r</i>) = 4<i>r</i> <b>K1</b>; <i>p</i> = FR(4<i>r</i>|8 − <i>r</i>) <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Sebuah bulatan berpusat <i>O</i>. Diameter <i>RT</i> berserenjang dengan perentas <i>PQ</i> dan bersilang dengannya di <i>S</i>. Diberi <i>RS</i> = 2 cm dan <i>RS</i> : <i>ST</i> = 1 : 4. Cari panjang <i>PS</i>, dalam cm.',
      qe: 'A circle has centre <i>O</i>. The diameter <i>RT</i> is perpendicular to the chord <i>PQ</i> and intersects it at <i>S</i>. Given <i>RS</i> = 2 cm and <i>RS</i> : <i>ST</i> = 1 : 4. Find the length of <i>PS</i>, in cm.',
      sk: '<i>ST</i> = 8 → <i>RT</i> = 10, jejari 5 <b>K1</b>; <i>OS</i> = 3 <b>K1</b>; <i>PS</i> = RT(5² − 3²) = 4 cm <b>N1</b>' }] },
  { id: 'T2S15-C03', bhg: 'C', bab: 7, babs: [2, 3, 7], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: '<i>PQR</i> ialah segi tiga bersudut tegak di <i>R</i> dengan <i>P</i>(1, 3), <i>Q</i>(9, <i>y</i>) dan <i>R</i>(9, 3). <i>M</i>(<i>x</i>, 7) ialah titik tengah <i>PQ</i>.<br>(i) Cari nilai <i>x</i> dan <i>y</i>.<br>(ii) Hitung luas segi tiga <i>PQR</i>.',
      qe: '<i>PQR</i> is a right-angled triangle at <i>R</i> with <i>P</i>(1, 3), <i>Q</i>(9, <i>y</i>) and <i>R</i>(9, 3). <i>M</i>(<i>x</i>, 7) is the midpoint of <i>PQ</i>.<br>(i) Find the values of <i>x</i> and <i>y</i>.<br>(ii) Calculate the area of triangle <i>PQR</i>.',
      sk: '(i) <i>x</i> = 5 <b>N1</b>; FR(3 + <i>y</i>|2) = 7 → <i>y</i> = 11 <b>N1</b><br>(ii) FR(1|2) × 8 × 8 <b>K1</b> = 32 unit² <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Faktorkan 4<i>x</i>² − 4<i>x</i> − 15.', qe: 'Factorise 4<i>x</i>² − 4<i>x</i> − 15.', sk: '(2<i>x</i> − 5)(2<i>x</i> + 3) <b>K2 N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi <i>C</i> = FR(5|9)(<i>F</i> − 32). Ungkapkan <i>F</i> sebagai perkara rumus dan hitung <i>F</i> apabila <i>C</i> = 25.', qe: 'Given <i>C</i> = FR(5|9)(<i>F</i> − 32). Express <i>F</i> as the subject of the formula and calculate <i>F</i> when <i>C</i> = 25.',
      sk: '<i>F</i> = FR(9<i>C</i>|5) + 32 <b>K1 N1</b>; <i>F</i> = 77 <b>N1</b>' }] }
);
