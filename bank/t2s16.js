'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 16 (Bab 1–4: 20 A · 3 B · 2 C) ===================
   Set 16 (27 Nov 2026). Diolah semula oleh Mat berdasarkan bentuk soalan PPT T2 2025 (Bahagian A) dan Latihan Ulangkaji UPSA T2.
   Soalan bergantung pada rajah diganti dengan maklumat bertulis. Dimuat selepas t2.js. */

BS_T2.push(
  { id: 'T2S16-A01', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Sebutan hilang', m: 1,
    q: 'Diberi jujukan 13, 18, 23, <i>y</i>, 33, 38, … Tentukan nilai <i>y</i>.', qe: 'Given the sequence 13, 18, 23, <i>y</i>, 33, 38, … Determine the value of <i>y</i>.', pil: ['26', '27', '28', '29'], jaw: 'C' },
  { id: 'T2S16-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Kedudukan sebutan', m: 1,
    q: 'Diberi jujukan 6, 12, 18, 24, … Jika sebutan ke-<i>n</i> ialah 72, tentukan nilai <i>n</i>.', qe: 'Given the sequence 6, 12, 18, 24, … If the <i>n</i>th term is 72, determine the value of <i>n</i>.', pil: ['10', '11', '12', '13'], jaw: 'C' },
  { id: 'T2S16-A03', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'Kembangan kuasa dua', m: 1,
    q: 'Kembangkan (3<i>x</i> − 4<i>y</i>)².', qe: 'Expand (3<i>x</i> − 4<i>y</i>)².',
    pil: ['9<i>x</i>² − 24<i>xy</i> + 16<i>y</i>²', '9<i>x</i>² + 24<i>xy</i> − 16<i>y</i>²', '3<i>x</i>² − 12<i>xy</i> + 4<i>y</i>²', '9<i>x</i>² − 12<i>xy</i> + 16<i>y</i>²'], jaw: 'A' },
  { id: 'T2S16-A04', bhg: 'A', bab: 4, kon: 'Mengingat', aras: 'R', why: 'Nama poligon', m: 1,
    q: 'Poligon yang mempunyai 7 sisi dikenali sebagai', qe: 'A polygon with 7 sides is known as', pil: ['heksagon', 'heptagon', 'oktagon', 'nonagon'], pe: ['a hexagon', 'a heptagon', 'an octagon', 'a nonagon'], jaw: 'B' },
  { id: 'T2S16-A05', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'R', why: 'Kenal pasti jujukan', m: 1,
    q: 'Antara berikut, yang manakah suatu jujukan?', qe: 'Which of the following is a sequence?', pil: ['2, 5, 8, 11, 14, …', '100, 60, 30, 12, …', '0.2, 0.4, 0.5, 0.9, …', '3, 6, 8, 12, 15, …'], jaw: 'A' },
  { id: 'T2S16-A06', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Faktorkan selengkapnya', m: 1,
    q: 'Faktorkan selengkapnya 6<i>y</i> + 9<i>ay</i>.', qe: 'Factorise completely 6<i>y</i> + 9<i>ay</i>.', pil: ['3(2<i>y</i> + 3<i>ay</i>)', '3<i>y</i>(2 + 3<i>a</i>)', '<i>y</i>(6 + 9<i>ay</i>)', '3<i>y</i>(2 + 9<i>a</i>)'], jaw: 'B' },
  { id: 'T2S16-A07', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan satu kurungan', m: 1,
    q: 'Kembangkan <i>p</i>(3<i>q</i> − 2<i>r</i>).', qe: 'Expand <i>p</i>(3<i>q</i> − 2<i>r</i>).', pil: ['3<i>pq</i> − 2<i>r</i>', '3<i>pq</i> − 2<i>pr</i>', '3<i>pq</i> + 2<i>pr</i>', '3<i>q</i> − 2<i>pr</i>'], jaw: 'B' },
  { id: 'T2S16-A08', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Tukar perkara rumus', m: 1,
    q: 'Diberi <i>m</i> − 4 = 3<i>n</i>. Ungkapkan <i>m</i> sebagai perkara rumus.', qe: 'Given <i>m</i> − 4 = 3<i>n</i>. Express <i>m</i> as the subject of the formula.', pil: ['<i>m</i> = 3<i>n</i> − 4', '<i>m</i> = 3<i>n</i> + 4', '<i>m</i> = FR(<i>n</i> + 4|3)', '<i>m</i> = 4 − 3<i>n</i>'], jaw: 'B' },
  { id: 'T2S16-A09', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Tambah pecahan algebra sama penyebut', m: 1,
    q: 'FR(7<i>k</i>|4) + FR(9<i>k</i>|4) =', qe: 'FR(7<i>k</i>|4) + FR(9<i>k</i>|4) =', pil: ['4<i>k</i>', 'FR(16<i>k</i>|8)', '2<i>k</i>', '4<i>k</i>²'], jaw: 'A' },
  { id: 'T2S16-A10', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Gantian nilai', m: 1,
    q: 'Diberi <i>p</i> = 5<i>q</i> − 7. Cari nilai <i>p</i> apabila <i>q</i> = 3.', qe: 'Given <i>p</i> = 5<i>q</i> − 7. Find the value of <i>p</i> when <i>q</i> = 3.', pil: ['8', '15', '22', '−2'], jaw: 'A' },
  { id: 'T2S16-A11', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'FSTB sebutan algebra', m: 1,
    q: 'Cari FSTB bagi 12<i>pq</i> dan 18<i>p</i>²<i>q</i>.', qe: 'Find the HCF of 12<i>pq</i> and 18<i>p</i>²<i>q</i>.', pil: ['6<i>p</i>', '6<i>pq</i>', '6<i>p</i>²<i>q</i>', '36<i>p</i>²<i>q</i>'], jaw: 'B' },
  { id: 'T2S16-A12', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'S', why: 'Banding pekali selepas faktor', m: 1,
    q: 'Diberi <i>a</i>(8 + 2<i>x</i>) = 32 + 8<i>x</i>. Apakah nilai <i>a</i>?', qe: 'Given <i>a</i>(8 + 2<i>x</i>) = 32 + 8<i>x</i>. What is the value of <i>a</i>?', pil: ['2', '4', '6', '8'], jaw: 'B' },
  { id: 'T2S16-A13', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Sebutan seterusnya jujukan darab', m: 1,
    q: 'Diberi jujukan 2, 6, 18, 54, <i>m</i>, <i>n</i>, … Cari nilai <i>m</i> + <i>n</i>.', qe: 'Given the sequence 2, 6, 18, 54, <i>m</i>, <i>n</i>, … Find the value of <i>m</i> + <i>n</i>.', pil: ['216', '486', '648', '702'], jaw: 'C', sk: '162 + 486' },
  { id: 'T2S16-A14', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dua kurungan', m: 1,
    q: 'Kembangkan (<i>a</i> + 4)(<i>b</i> + 3).', qe: 'Expand (<i>a</i> + 4)(<i>b</i> + 3).', pil: ['<i>ab</i> + 7<i>ab</i> + 12', '<i>ab</i> + 3<i>a</i> + 4<i>b</i> + 12', '<i>ab</i> + 4<i>a</i> + 3<i>b</i> + 12', '<i>ab</i> + 12'], jaw: 'B' },
  { id: 'T2S16-A15', bhg: 'A', bab: 4, kon: 'Memahami', aras: 'R', why: 'Sudut oktagon sekata', m: 1,
    q: 'Antara berikut, yang manakah benar bagi sebuah oktagon sekata?', qe: 'Which of the following is true for a regular octagon?',
    pil: ['Sudut pedalaman 140°, sudut peluaran 40°', 'Sudut pedalaman 120°, sudut peluaran 60°', 'Sudut pedalaman 135°, sudut peluaran 45°', 'Sudut pedalaman 108°, sudut peluaran 72°'],
    pe: ['Interior angle 140°, exterior angle 40°', 'Interior angle 120°, exterior angle 60°', 'Interior angle 135°, exterior angle 45°', 'Interior angle 108°, exterior angle 72°'], jaw: 'C' },
  { id: 'T2S16-A16', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Sudut tidak diketahui dalam pentagon', m: 1,
    q: 'Sudut pedalaman sebuah pentagon ialah <i>x</i>, <i>x</i>, 100°, 110° dan 120°. Cari nilai <i>x</i>.', qe: 'The interior angles of a pentagon are <i>x</i>, <i>x</i>, 100°, 110° and 120°. Find the value of <i>x</i>.', pil: ['95°', '100°', '105°', '110°'], jaw: 'C' },
  { id: 'T2S16-A17', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Sudut pedalaman heksagon sekata', m: 1,
    q: 'Setiap sudut pedalaman sebuah heksagon sekata ialah 4<i>y</i>. Hitung nilai <i>y</i>.', qe: 'Each interior angle of a regular hexagon is 4<i>y</i>. Calculate the value of <i>y</i>.', pil: ['20°', '25°', '30°', '40°'], jaw: 'C' },
  { id: 'T2S16-A18', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Bilangan sisi daripada hasil tambah sudut', m: 1,
    q: 'Antara berikut, yang manakah mempunyai hasil tambah sudut pedalaman 1 440°?', qe: 'Which of the following has a sum of interior angles of 1 440°?', pil: ['Oktagon', 'Nonagon', 'Dekagon', 'Dodekagon'], pe: ['Octagon', 'Nonagon', 'Decagon', 'Dodecagon'], jaw: 'C' },
  { id: 'T2S16-A19', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Bilangan titik dalam corak', m: 1,
    q: 'Bilangan titik dalam corak pertama, kedua dan ketiga ialah 6, 10 dan 14. Berapakah bilangan titik dalam corak ke-7?', qe: 'The numbers of dots in the first, second and third patterns are 6, 10 and 14. How many dots are there in the 7th pattern?', pil: ['26', '28', '30', '34'], jaw: 'C' },
  { id: 'T2S16-A20', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Poligon daripada sudut peluaran', m: 1,
    q: 'Poligon sekata manakah mempunyai sudut peluaran 40°?', qe: 'Which regular polygon has an exterior angle of 40°?', pil: ['Heptagon', 'Oktagon', 'Nonagon', 'Dekagon'], pe: ['Heptagon', 'Octagon', 'Nonagon', 'Decagon'], jaw: 'C' },

  { id: 'T2S16-B01', bhg: 'B', bab: 1, parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Tentukan sama ada setiap senarai nombor mempunyai pola atau tidak.', qe: 'Determine whether each list of numbers has a pattern or not.',
      items: [{ t: '7, 11, 15, 19, …: CH(Pola|Bukan pola)', te: '7, 11, 15, 19, …: CH(Pattern|Not a pattern)', a: 'Pola' }, { t: '2, 9, 4, 1, …: CH(Pola|Bukan pola)', te: '2, 9, 4, 1, …: CH(Pattern|Not a pattern)', a: 'Bukan pola' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bilangan jam Zuhal bekerja pada minggu 1 hingga 4 ialah 6, 7.5, 9 dan 10.5.', qe: 'The numbers of hours Zuhal works in weeks 1 to 4 are 6, 7.5, 9 and 10.5.',
      items: [{ t: 'Pola: tambah ____ jam setiap minggu', te: 'Pattern: add ____ hours every week', a: '1.5' }, { t: 'Bilangan jam pada minggu ke-7: ____', te: 'Number of hours in week 7: ____', a: '15' }] }] },
  { id: 'T2S16-B02', bhg: 'B', bab: 2, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan pemfaktorannya.', qe: 'Match each expression with its factorisation.',
      items: [{ t: '6<i>gh</i> − 9<i>h</i>²', a: '3<i>h</i>(2<i>g</i> − 3<i>h</i>)' }, { t: '6<i>gh</i> − 9<i>gh</i>²', a: '3<i>gh</i>(2 − 3<i>h</i>)' }, { t: '2<i>s</i>² + 2<i>s</i> + <i>st</i> + <i>t</i>', a: '(2<i>s</i> + <i>t</i>)(<i>s</i> + 1)' }, { t: '12 − 3<i>t</i> − 4<i>s</i> + <i>st</i>', a: '(4 − <i>t</i>)(3 − <i>s</i>)' }],
      kanan: ['(4 − <i>t</i>)(3 − <i>s</i>)', '3<i>gh</i>(2 − 3<i>h</i>)', '(2<i>s</i> + <i>t</i>)(<i>s</i> + 1)', '3<i>h</i>(2<i>g</i> − 3<i>h</i>)'] }] },
  { id: 'T2S16-B03', bhg: 'B', bab: 4, parts: [
    { l: '', jenis: 'isi', m: 4, aras: 'R', kon: 'Memahami', q: 'Lengkapkan maklumat tentang poligon sekata dan bilangan paksi simetrinya.', qe: 'Complete the information about regular polygons and their numbers of axes of symmetry.',
      items: [{ t: 'Oktagon sekata: ____ paksi simetri', te: 'Regular octagon: ____ axes of symmetry', a: '8' }, { t: 'Heptagon sekata: ____ paksi simetri', te: 'Regular heptagon: ____ axes of symmetry', a: '7' },
        { t: '____ sekata: 9 paksi simetri', te: 'Regular ____: 9 axes of symmetry', a: 'Nonagon' }, { t: '____ sekata: 6 paksi simetri', te: 'Regular ____: 6 axes of symmetry', a: 'Heksagon' }] }] },

  { id: 'T2S16-C01', bhg: 'C', bab: 4, babs: [1, 4], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Senarai berikut ialah sebahagian daripada nombor Fibonacci yang berturutan.<br>…, <i>a</i>, 8, 13, <i>b</i>, 34, 55, <i>c</i>, 144, …<br>Cari nilai <i>a</i> − <i>b</i> + <i>c</i>.', qe: 'The following list is part of consecutive Fibonacci numbers.<br>…, <i>a</i>, 8, 13, <i>b</i>, 34, 55, <i>c</i>, 144, …<br>Find the value of <i>a</i> − <i>b</i> + <i>c</i>.',
      sk: '<i>a</i> = 5, <i>b</i> = 21, <i>c</i> = 89 <b>K2</b>; 5 − 21 + 89 = 73 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: '<i>ABCDE</i> ialah sebuah pentagon sekata. Sisi <i>AE</i> dipanjangkan ke <i>F</i> supaya <i>AEF</i> ialah garis lurus. Cari<br>(i) ∠<i>AED</i>,<br>(ii) ∠<i>DEF</i>.', qe: '<i>ABCDE</i> is a regular pentagon. Side <i>AE</i> is extended to <i>F</i> so that <i>AEF</i> is a straight line. Find<br>(i) ∠<i>AED</i>,<br>(ii) ∠<i>DEF</i>.',
      sk: '(i) FR(540°|5) <b>K1</b> = 108° <b>N1</b><br>(ii) 180° − 108° = 72° <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut peluaran sebuah poligon sekata ialah 24°. Hitung<br>(i) bilangan sisi poligon itu,<br>(ii) hasil tambah sudut pedalamannya.', qe: 'The exterior angle of a regular polygon is 24°. Calculate<br>(i) the number of sides of the polygon,<br>(ii) the sum of its interior angles.',
      sk: '(i) FR(360°|24°) <b>K1</b> = 15 <b>N1</b><br>(ii) (15 − 2) × 180° <b>K1</b> = 2 340° <b>N1</b>' }] },
  { id: 'T2S16-C02', bhg: 'C', bab: 3, babs: [1, 2, 3], parts: [
    { l: '(a)', m: 4, aras: 'T', kon: 'Mengaplikasi', q: 'Diberi FR(3<i>m</i>²|<i>n</i>) = <i>k</i>.<br>(i) Ungkapkan <i>m</i> dalam sebutan <i>k</i> dan <i>n</i>.<br>(ii) Hitung nilai positif <i>m</i> apabila <i>k</i> = 12 dan <i>n</i> = 4.', qe: 'Given FR(3<i>m</i>²|<i>n</i>) = <i>k</i>.<br>(i) Express <i>m</i> in terms of <i>k</i> and <i>n</i>.<br>(ii) Calculate the positive value of <i>m</i> when <i>k</i> = 12 and <i>n</i> = 4.',
      sk: '(i) <i>m</i>² = FR(<i>kn</i>|3) <b>K1</b>; <i>m</i> = RT(FR(<i>kn</i>|3)) <b>N1</b><br>(ii) RT(FR(48|3)) <b>K1</b> = 4 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Kembangkan dan permudahkan (2<i>x</i> − 3)² − <i>x</i>(<i>x</i> − 12).', qe: 'Expand and simplify (2<i>x</i> − 3)² − <i>x</i>(<i>x</i> − 12).',
      sk: '4<i>x</i>² − 12<i>x</i> + 9 <b>K1</b>; − <i>x</i>² + 12<i>x</i> <b>K1</b>; 3<i>x</i>² + 9 <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi jujukan −6, 3, 12, 21, …<br>(i) Sebutan yang keberapakah bernilai 66?<br>(ii) Cari sebutan ke-15.', qe: 'Given the sequence −6, 3, 12, 21, …<br>(i) Which term has the value 66?<br>(ii) Find the 15th term.',
      sk: '(i) −6 + 9(<i>n</i> − 1) = 66 <b>K1</b>; <i>n</i> = 9 <b>N1</b><br>(ii) −6 + 9(14) = 120 <b>N1</b>' }] }
);
