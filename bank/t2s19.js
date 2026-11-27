'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 · SET 19 (konsep tambahan: 16 A · 3 B · 4 C) ===================
   Set 19 (27 Nov 2026). Soalan baharu oleh Mat. Hanya konsep yang belum ada dalam Set 1–18 diambil daripada buku latihan UASA
   dan modul ulang kaji T2 (rujukan gaya sahaja; tiada soalan disalin). Dimuat selepas t2.js. */

BS_T2.push(
  { id: 'T2S19-A01', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Jujukan nombor perdana', m: 1,
    q: 'Jujukan berikut ialah nombor perdana berturutan: 29, <i>x</i>, 37, 41, <i>y</i>, 47. Hitung nilai 2<i>x</i> − <i>y</i>.', qe: 'The following sequence consists of consecutive prime numbers: 29, <i>x</i>, 37, 41, <i>y</i>, 47. Calculate the value of 2<i>x</i> − <i>y</i>.', pil: ['17', '18', '19', '20'], jaw: 'C', sk: '<i>x</i> = 31, <i>y</i> = 43' },
  { id: 'T2S19-A02', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'T', why: 'Perkara rumus dengan pecahan', m: 1,
    q: 'Diberi <i>p</i> = FR(<i>r</i>|1 + <i>q</i>). Ungkapkan <i>q</i> dalam sebutan <i>p</i> dan <i>r</i>.', qe: 'Given <i>p</i> = FR(<i>r</i>|1 + <i>q</i>). Express <i>q</i> in terms of <i>p</i> and <i>r</i>.', pil: ['<i>q</i> = FR(<i>r</i>|<i>p</i>) + 1', '<i>q</i> = FR(<i>p</i>|<i>r</i>) − 1', '<i>q</i> = FR(<i>r</i>|<i>p</i>) − 1', '<i>q</i> = FR(<i>r</i> − 1|<i>p</i>)'], jaw: 'C' },
  { id: 'T2S19-A03', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Sisi daripada sudut pedalaman', m: 1,
    q: 'Setiap sudut pedalaman sebuah poligon sekata ialah 150°. Hitung bilangan sisi poligon itu.', qe: 'Each interior angle of a regular polygon is 150°. Calculate the number of sides of the polygon.', pil: ['10', '11', '12', '14'], jaw: 'C' },
  { id: 'T2S19-A04', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'R', why: 'Luas sektor', m: 1,
    q: 'Hitung luas sektor minor yang berjejari 21 cm dengan sudut 60° di pusat. (Guna π = FR(22|7))', qe: 'Calculate the area of a minor sector with a radius of 21 cm and an angle of 60° at the centre. (Use π = FR(22|7))', pil: ['22 cm²', '231 cm²', '462 cm²', '1 386 cm²'], jaw: 'B' },
  { id: 'T2S19-A05', bhg: 'A', bab: 8, kon: 'Memahami', aras: 'S', why: 'Fungsi satu kepada satu', m: 1,
    q: 'Antara set pasangan bertertib berikut, yang manakah fungsi satu kepada satu?', qe: 'Which of the following sets of ordered pairs is a one-to-one function?',
    pil: ['{(2, 3), (2, 5), (4, 7)}', '{(1, 4), (2, 8), (3, 12)}', '{(5, 1), (6, 1), (7, 1)}', '{(3, 2), (3, 4), (3, 6)}'], jaw: 'B' },
  { id: 'T2S19-A06', bhg: 'A', bab: 10, kon: 'Mengaplikasi', aras: 'R', why: 'Kecerunan', m: 1,
    q: 'Kecerunan garis lurus yang melalui <i>K</i>(−2, −7) dan <i>L</i>(0, 5) ialah', qe: 'The gradient of the straight line passing through <i>K</i>(−2, −7) and <i>L</i>(0, 5) is', pil: ['−6', '6', 'FR(1|6)', '2'], jaw: 'B' },
  { id: 'T2S19-A07', bhg: 'A', bab: 12, kon: 'Mengaplikasi', aras: 'T', why: 'Min data terkumpul', m: 1,
    q: 'Markah 20 orang murid: 40 – 49 (4 orang), 50 – 59 (10 orang), 60 – 69 (4 orang), 70 – 79 (2 orang). Hitung min markah.', qe: 'The marks of 20 pupils: 40 – 49 (4 pupils), 50 – 59 (10 pupils), 60 – 69 (4 pupils), 70 – 79 (2 pupils). Calculate the mean mark.', pil: ['54.5', '56.5', '58.5', '60.5'], jaw: 'B', sk: 'Guna titik tengah 44.5, 54.5, 64.5, 74.5 → FR(1 130|20)' },
  { id: 'T2S19-A08', bhg: 'A', bab: 13, kon: 'Mengaplikasi', aras: 'S', why: 'Kebarangkalian pelengkap', m: 1,
    q: 'Sebuah beg mengandungi kad bernombor 20 hingga 31. Sekeping kad dipilih secara rawak. Cari kebarangkalian memilih kad yang <b>bukan</b> gandaan 4.', qe: 'A bag contains cards numbered 20 to 31. A card is chosen at random. Find the probability of choosing a card that is <b>not</b> a multiple of 4.', pil: ['FR(1|4)', 'FR(1|3)', 'FR(2|3)', 'FR(3|4)'], jaw: 'D' },
  { id: 'T2S19-A09', bhg: 'A', bab: 13, kon: 'Menganalisis', aras: 'T', why: 'Bilangan unsur daripada kebarangkalian', m: 1,
    q: 'Sebuah bekas mengandungi 18 biji guli merah dan beberapa biji guli hijau. Kebarangkalian memilih guli merah ialah FR(3|5). Berapakah bilangan guli hijau?', qe: 'A container has 18 red marbles and some green marbles. The probability of picking a red marble is FR(3|5). How many green marbles are there?', pil: ['10', '12', '18', '30'], jaw: 'B' },
  { id: 'T2S19-A10', bhg: 'A', bab: 9, kon: 'Mengaplikasi', aras: 'S', why: 'Jarak daripada waktu bertolak dan tiba', m: 1,
    q: 'Sebuah kereta api bertolak dari stesen <i>S</i> pada pukul 9.45 a.m. dan tiba di stesen <i>T</i> pada pukul 11.15 a.m. dengan laju purata 120 km/j. Hitung jarak antara dua stesen itu.', qe: 'A train leaves station <i>S</i> at 9.45 a.m. and arrives at station <i>T</i> at 11.15 a.m. at an average speed of 120 km/h. Calculate the distance between the two stations.', pil: ['150 km', '180 km', '210 km', '240 km'], jaw: 'B' },
  { id: 'T2S19-A11', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'Kembangan dan permudahkan', m: 1,
    q: 'Permudahkan (2<i>k</i> + 3)² − (4<i>k</i>² + 9).', qe: 'Simplify (2<i>k</i> + 3)² − (4<i>k</i>² + 9).', pil: ['0', '6<i>k</i>', '12<i>k</i>', '4<i>k</i>² + 12<i>k</i>'], jaw: 'C' },
  { id: 'T2S19-A12', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'R', why: 'Jarak dua titik', m: 1,
    q: 'Cari jarak di antara <i>A</i>(10, 4) dan <i>B</i>(7, 8).', qe: 'Find the distance between <i>A</i>(10, 4) and <i>B</i>(7, 8).', pil: ['3 unit', '4 unit', '5 unit', '7 unit'], pe: ['3 units', '4 units', '5 units', '7 units'], jaw: 'C' },
  { id: 'T2S19-A13', bhg: 'A', bab: 11, kon: 'Mengaplikasi', aras: 'R', why: 'Imej translasi', m: 1,
    q: 'Cari imej bagi titik <i>L</i>(4, 6) di bawah translasi VC(−3|−2).', qe: 'Find the image of point <i>L</i>(4, 6) under the translation VC(−3|−2).', pil: ['(1, 4)', '(7, 8)', '(1, 8)', '(7, 4)'], jaw: 'A' },
  { id: 'T2S19-A14', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Luas permukaan melengkung kon', m: 1,
    q: 'Sebuah kon mempunyai jejari 7 cm dan tinggi sendeng 10 cm. Hitung luas permukaan melengkungnya. (Guna π = FR(22|7))', qe: 'A cone has a radius of 7 cm and a slant height of 10 cm. Calculate its curved surface area. (Use π = FR(22|7))', pil: ['154 cm²', '220 cm²', '374 cm²', '440 cm²'], jaw: 'B' },
  { id: 'T2S19-A15', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Sudut sisi empat', m: 1,
    q: 'Sudut pedalaman sebuah sisi empat ialah (80 + 2<i>x</i>)°, (70 + <i>x</i>)°, (40 + <i>x</i>)° dan (50 + <i>x</i>)°. Cari nilai <i>x</i>.', qe: 'The interior angles of a quadrilateral are (80 + 2<i>x</i>)°, (70 + <i>x</i>)°, (40 + <i>x</i>)° and (50 + <i>x</i>)°. Find the value of <i>x</i>.', pil: ['20', '24', '28', '30'], jaw: 'B' },
  { id: 'T2S19-A16', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'S', why: 'Faktor sepunya tiga sebutan', m: 1,
    q: 'Antara berikut, yang manakah <b>bukan</b> faktor sepunya bagi 12<i>de</i>, 18<i>e</i>²<i>f</i> dan 24<i>def</i>?', qe: 'Which of the following is <b>not</b> a common factor of 12<i>de</i>, 18<i>e</i>²<i>f</i> and 24<i>def</i>?', pil: ['2', '3<i>e</i>', '6<i>e</i>', '6<i>d</i>'], jaw: 'D' },

  { id: 'T2S19-B01', bhg: 'B', bab: 1, parts: [
    { l: '', jenis: 'bp', m: 4, aras: 'S', kon: 'Menganalisis', q: 'Tentukan sama ada setiap jujukan mengikut pola nombor Fibonacci (setiap sebutan ialah hasil tambah dua sebutan sebelumnya). Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'Determine whether each sequence follows the Fibonacci number pattern (each term is the sum of the two previous terms). Write <b>True</b> or <b>False</b>.',
      items: [{ t: '2, 3, 5, 8, 13, …', a: 'Benar' }, { t: '1, 3, 4, 7, 11, 18, …', a: 'Benar' }, { t: '1, 2, 4, 7, 11, …', a: 'Palsu' }, { t: '10, 11, 21, 32, 53, …', a: 'Benar' }] }] },
  { id: 'T2S19-B02', bhg: 'B', bab: 7, babs: [2, 7], parts: [
    { l: '(a)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Memahami', q: 'Titik <i>K</i> ialah (−3, 5). Tandakan (✓) bagi <b>dua</b> pernyataan yang betul.', qe: 'Point <i>K</i> is (−3, 5). Tick (✓) the <b>two</b> correct statements.',
      items: [{ t: '<i>K</i> terletak 3 unit di kiri paksi-<i>y</i>.', te: '<i>K</i> lies 3 units to the left of the <i>y</i>-axis.', a: '✓' }, { t: '<i>K</i> terletak 5 unit di bawah paksi-<i>x</i>.', te: '<i>K</i> lies 5 units below the <i>x</i>-axis.', a: '' },
        { t: 'Titik tengah <i>K</i> dan (5, 1) ialah (1, 3).', te: 'The midpoint of <i>K</i> and (5, 1) is (1, 3).', a: '✓' }, { t: 'Jarak <i>K</i> dari asalan ialah 8 unit.', te: 'The distance of <i>K</i> from the origin is 8 units.', a: '' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Kembangkan −7(2<i>m</i> − 3<i>n</i>) = ____<i>m</i> + ____<i>n</i>', qe: 'Expand −7(2<i>m</i> − 3<i>n</i>) = ____<i>m</i> + ____<i>n</i>',
      items: [{ t: 'Pekali <i>m</i>: ____', te: 'Coefficient of <i>m</i>: ____', a: '−14' }, { t: 'Pekali <i>n</i>: ____', te: 'Coefficient of <i>n</i>: ____', a: '21' }] }] },
  { id: 'T2S19-B03', bhg: 'B', bab: 6, parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Lengkapkan pengiraan isi padu kon berjejari 6 cm dan tinggi 14 cm.<br>Isi padu = FR(1|3) × FR(22|7) × <i>j</i>² × <i>t</i>', qe: 'Complete the calculation of the volume of a cone with a radius of 6 cm and a height of 14 cm.<br>Volume = FR(1|3) × FR(22|7) × <i>r</i>² × <i>h</i>',
      items: [{ t: '<i>j</i>² = ____', te: '<i>r</i>² = ____', a: '36' }, { t: 'Isi padu = ____ cm³', te: 'Volume = ____ cm³', a: '528' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan nama pepejal berdasarkan ciri.', qe: 'Circle the name of the solid based on its features.',
      items: [{ t: 'Satu permukaan melengkung dan dua muka rata berbentuk bulatan: CH(Silinder|Kon|Sfera|Prisma)', te: 'One curved surface and two flat circular faces: CH(Cylinder|Cone|Sphere|Prism)', a: 'Silinder' },
        { t: 'Satu permukaan melengkung sahaja, tiada bucu: CH(Silinder|Kon|Sfera|Prisma)', te: 'Only one curved surface, no vertex: CH(Cylinder|Cone|Sphere|Prism)', a: 'Sfera' }] }] },

  { id: 'T2S19-C01', bhg: 'C', bab: 3, babs: [3, 10, 12], kbat: true, parts: [
    { l: '(a)', m: 4, aras: 'T', kon: 'Mengaplikasi', q: 'Diberi 3<i>m</i> ÷ FR(<i>m</i>|2<i>n</i>) = 2<i>m</i> − 8.<br>(i) Ungkapkan <i>m</i> dalam sebutan <i>n</i>.<br>(ii) Hitung nilai <i>m</i> apabila <i>n</i> = 5.', qe: 'Given 3<i>m</i> ÷ FR(<i>m</i>|2<i>n</i>) = 2<i>m</i> − 8.<br>(i) Express <i>m</i> in terms of <i>n</i>.<br>(ii) Calculate the value of <i>m</i> when <i>n</i> = 5.',
      sk: '(i) 3<i>m</i> × FR(2<i>n</i>|<i>m</i>) = 6<i>n</i> <b>K1</b>; 6<i>n</i> = 2<i>m</i> − 8 → <i>m</i> = 3<i>n</i> + 4 <b>N1</b><br>(ii) 3(5) + 4 <b>K1</b> = 19 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Menilai', q: 'Sebuah tangga naik 9 m bagi jarak mengufuk 4 m. Sebuah eskalator naik 6 m bagi jarak mengufuk 8 m.<br>(i) Cari kecerunan setiap satu.<br>(ii) Yang manakah lebih curam?', qe: 'A ladder rises 9 m over a horizontal distance of 4 m. An escalator rises 6 m over a horizontal distance of 8 m.<br>(i) Find the gradient of each.<br>(ii) Which one is steeper?',
      sk: '(i) Tangga FR(9|4) <b>N1</b>; eskalator FR(6|8) = FR(3|4) <b>N1</b><br>(ii) Tangga <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Bilangan pesakit mengikut umur di sebuah hospital ialah:<br>1 – 10: 6, 11 – 20: 8, 21 – 30: 12, 31 – 40: 9, 41 – 50: 5.<br>(i) Tentukan kelas mod.<br>(ii) Tentukan kelas yang mengandungi median.', qe: 'The numbers of patients by age at a hospital are:<br>1 – 10: 6, 11 – 20: 8, 21 – 30: 12, 31 – 40: 9, 41 – 50: 5.<br>(i) Determine the modal class.<br>(ii) Determine the class that contains the median.',
      sk: '(i) 21 – 30 <b>P1</b><br>(ii) Jumlah 40; kekerapan longgokan 6, 14, 26 <b>K1</b>; 21 – 30 <b>N1</b>' }] },
  { id: 'T2S19-C02', bhg: 'C', bab: 5, babs: [4, 5], parts: [
    { l: '(a)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Diameter <i>AB</i> sebuah bulatan berpusat <i>O</i> ialah 26 cm. Perentas <i>CE</i> berserenjang dengan <i>AB</i> di <i>D</i>, dengan <i>D</i> di antara <i>O</i> dan <i>B</i>. Diberi <i>DE</i> = 12 cm, hitung panjang <i>BD</i>.', qe: 'The diameter <i>AB</i> of a circle with centre <i>O</i> is 26 cm. Chord <i>CE</i> is perpendicular to <i>AB</i> at <i>D</i>, with <i>D</i> between <i>O</i> and <i>B</i>. Given <i>DE</i> = 12 cm, calculate the length of <i>BD</i>.',
      sk: '<i>OE</i> = 13 <b>K1</b>; <i>OD</i> = RT(13² − 12²) = 5 <b>K1</b>; <i>BD</i> = 13 − 5 = 8 cm <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sebiji piza berbentuk bulatan berdiameter 28 cm dipotong kepada 8 potongan yang sama besar. Hitung luas sepotong piza. (Guna π = FR(22|7))', qe: 'A circular pizza with a diameter of 28 cm is cut into 8 equal slices. Calculate the area of one slice. (Use π = FR(22|7))',
      sk: 'FR(22|7) × 14² = 616 <b>K1</b>; FR(616|8) <b>K1</b> = 77 cm² <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sudut pedalaman sebuah sisi empat <i>PQRS</i> ialah (90 + 2<i>x</i>)°, (75 + <i>x</i>)°, (41 + <i>x</i>)° dan (64 + <i>x</i>)°.<br>(i) Cari nilai <i>x</i>.<br>(ii) Nyatakan sudut terbesar.', qe: 'The interior angles of a quadrilateral <i>PQRS</i> are (90 + 2<i>x</i>)°, (75 + <i>x</i>)°, (41 + <i>x</i>)° and (64 + <i>x</i>)°.<br>(i) Find the value of <i>x</i>.<br>(ii) State the largest angle.',
      sk: '(i) 270 + 5<i>x</i> = 360 <b>K1</b>; <i>x</i> = 18 <b>N1</b><br>(ii) 90 + 36 <b>K1</b> = 126° <b>N1</b>' }] },
  { id: 'T2S19-C03', bhg: 'C', bab: 6, babs: [6, 9], kbat: true, parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Bentangan sebuah silinder terdiri daripada dua bulatan berjejari 7 cm dan sebuah segi empat tepat dengan tinggi 10 cm. Hitung jumlah luas permukaan silinder itu. (Guna π = FR(22|7))', qe: 'The net of a cylinder consists of two circles of radius 7 cm and a rectangle of height 10 cm. Calculate the total surface area of the cylinder. (Use π = FR(22|7))',
      sk: '2 × 154 = 308 <b>K1</b>; 2 × FR(22|7) × 7 × 10 = 440 <b>K1</b>; 748 cm² <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Sebuah pepejal gabungan terdiri daripada sebuah silinder setinggi 10 cm dan sebuah kon setinggi 6 cm yang berjejari sama. Isi padu pepejal itu ialah 1 848 cm³. Hitung jejarinya. (Guna π = FR(22|7))', qe: 'A combined solid consists of a cylinder of height 10 cm and a cone of height 6 cm with the same radius. The volume of the solid is 1 848 cm³. Calculate its radius. (Use π = FR(22|7))',
      sk: 'FR(22|7)<i>j</i>²(10) + FR(1|3) × FR(22|7)<i>j</i>²(6) = 1 848 <b>K1</b>; FR(22|7)<i>j</i>² × 12 = 1 848 <b>K1</b>; <i>j</i>² = 49 <b>K1</b>; <i>j</i> = 7 cm <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'T', kon: 'Menganalisis', q: 'Sebuah lori bertolak dari kilang <i>A</i> pada pukul 8.00 a.m. dengan laju 90 km/j dan tiba di kedai makan pada pukul 12.30 p.m. Pemandu berehat 30 minit, kemudian meneruskan perjalanan dengan laju FR(2|3) daripada laju asal dan tiba di kilang <i>B</i> pada pukul 2.30 p.m. Hitung jumlah jarak perjalanan.', qe: 'A lorry leaves factory <i>A</i> at 8.00 a.m. at 90 km/h and arrives at a restaurant at 12.30 p.m. The driver rests for 30 minutes, then continues at FR(2|3) of the original speed and arrives at factory <i>B</i> at 2.30 p.m. Calculate the total distance travelled.',
      sk: '90 × 4.5 = 405 km <b>K1</b>; 60 × 1.5 = 90 km <b>K1</b>; 495 km <b>N1</b>' }] },
  { id: 'T2S19-C04', bhg: 'C', bab: 9, babs: [1, 4, 9], parts: [
    { l: '(a)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Sebuah bas bergerak dari <i>X</i> ke <i>Y</i> sejauh 90 km dengan laju purata 60 km/j. Bas berhenti di <i>Y</i> selama 30 minit, kemudian bergerak ke <i>Z</i> dalam masa 1 jam. Laju purata bagi seluruh perjalanan dari <i>X</i> ke <i>Z</i> ialah 50 km/j. Hitung jarak <i>YZ</i>.', qe: 'A bus travels 90 km from <i>X</i> to <i>Y</i> at an average speed of 60 km/h. It stops at <i>Y</i> for 30 minutes, then travels to <i>Z</i> in 1 hour. The average speed for the whole journey from <i>X</i> to <i>Z</i> is 50 km/h. Calculate the distance <i>YZ</i>.',
      sk: 'Masa <i>XY</i> = 1.5 j <b>K1</b>; jumlah masa 3 j <b>K1</b>; jumlah jarak 150 km <b>K1</b>; <i>YZ</i> = 60 km <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'T', kon: 'Menganalisis', q: '<i>ABCDEFGH</i> ialah sebuah oktagon sekata. Pepenjuru <i>AC</i> dilukis. Hitung ∠<i>ACD</i>.', qe: '<i>ABCDEFGH</i> is a regular octagon. The diagonal <i>AC</i> is drawn. Calculate ∠<i>ACD</i>.',
      sk: 'Sudut pedalaman 135° <b>K1</b>; ∠<i>BCA</i> = FR(180° − 135°|2) = 22.5° <b>K1</b>; ∠<i>ACD</i> = 112.5° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Jujukan 3, 4, 7, 11, 18, … mengikut pola nombor Fibonacci. Cari sebutan ke-8.', qe: 'The sequence 3, 4, 7, 11, 18, … follows the Fibonacci number pattern. Find the 8th term.',
      sk: '29 <b>K1</b>, 47 <b>K1</b>, 76 <b>N1</b>' }] }
);
