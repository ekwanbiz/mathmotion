'use strict';
/* =================== BANK SOALAN · TINGKATAN 1 · SET 3 (format UASA, bab KP2027) ===================
   Set 3 (27 Nov 2026): 20 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras UASA T1 2023/2024 (S50)
   (rujukan: Downloads/Bank Soalan/T1_UASA-2023-24_KPM.pdf). Topik Set dan sudut tunduk (tiada dalam KP2027 T1) diganti.
   Dimuat selepas t1.js. */

Object.assign(BS_FIG, {
  T1S3A13: `<svg viewBox="0 0 260 50" width="250" role="img" aria-label="Garis nombor dengan bulatan penuh di −4 dan anak panah ke kanan">
    <g stroke="currentColor" stroke-width="1.6"><line x1="10" y1="22" x2="250" y2="22"/>${[-6, -5, -4, -3, -2, -1, 0].map((v, i) => `<line x1="${30 + i * 34}" y1="17" x2="${30 + i * 34}" y2="27"/>`).join('')}</g>
    <line x1="98" y1="12" x2="240" y2="12" stroke="currentColor" stroke-width="2.4"/><path d="M240 7 L250 12 L240 17Z" fill="currentColor"/><circle cx="98" cy="12" r="5" fill="currentColor"/>
    <g font-family="Inter,sans-serif" font-size="11" fill="currentColor" text-anchor="middle">${[-6, -5, -4, -3, -2, -1, 0].map((v, i) => `<text x="${30 + i * 34}" y="42">${v < 0 ? '−' + (-v) : v}</text>`).join('')}</g></svg>`,
  T1S3A20: `<svg viewBox="0 0 240 150" width="220" role="img" aria-label="C di atas B dengan CB tegak lurus BD; E pada BD; CB 12 cm, EB 4 cm">
    <g fill="none" stroke="currentColor" stroke-width="2"><polyline points="30,20 30,130 210,130"/><line x1="30" y1="20" x2="75" y2="130"/><line x1="30" y1="20" x2="210" y2="130"/></g>
    <rect x="30" y="120" width="10" height="10" fill="none" stroke="currentColor"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="18" y="18" font-style="italic">C</text><text x="18" y="144" font-style="italic">B</text><text x="71" y="144" font-style="italic">E</text><text x="212" y="144" font-style="italic">D</text><text x="0" y="80">12 cm</text><text x="40" y="146">4 cm</text></g></svg>`,
  T1S3C06: `<svg viewBox="0 0 240 170" width="220" role="img" aria-label="Dua garis selari dipotong oleh satu garis rentas lintang; sudut a, b, c, d di persilangan atas dan e, f, g, h di persilangan bawah">
    <g stroke="currentColor" stroke-width="2"><line x1="10" y1="50" x2="230" y2="50"/><line x1="10" y1="120" x2="230" y2="120"/><line x1="70" y1="10" x2="170" y2="160"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13" font-style="italic"><text x="72" y="44">a</text><text x="104" y="44">b</text><text x="76" y="66">c</text><text x="106" y="66">d</text>
    <text x="119" y="114">e</text><text x="151" y="114">f</text><text x="123" y="136">g</text><text x="153" y="136">h</text></g></svg>`
});

BS_T1.push(
  // ---------------- SET 3 · BAHAGIAN A ----------------
  { id: 'T1S3-A01', bhg: 'A', bab: 1, kon: 'Memahami', aras: 'R', why: 'Kenal pasti hukum operasi', m: 1,
    q: 'Pernyataan berikut merujuk kepada satu hukum operasi aritmetik.<br>(4 + 7) + 2 = 4 + (7 + 2)<br>Nyatakan hukum itu.', qe: 'The following statement refers to a law of arithmetic operations.<br>(4 + 7) + 2 = 4 + (7 + 2)<br>State the law.',
    pil: ['Hukum Kalis Tukar Tertib', 'Hukum Kalis Sekutuan', 'Hukum Kalis Agihan', 'Hukum Identiti'], pe: ['Commutative Law', 'Associative Law', 'Distributive Law', 'Identity Law'], jaw: 'B' },
  { id: 'T1S3-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Integer dalam situasi simpanan', m: 1,
    q: 'Baki akaun simpanan Mei ialah RM2 350. Dia menyimpan RM450 pada bulan April dan mengeluarkan RM680 pada bulan Ogos. Berapakah baki simpanannya sekarang?', qe: 'Mei\'s savings balance is RM2 350. She deposits RM450 in April and withdraws RM680 in August. What is her savings balance now?',
    pil: ['RM1 220', 'RM2 120', 'RM2 580', 'RM3 480'], jaw: 'B', sk: '2 350 + 450 − 680 = 2 120' },
  { id: 'T1S3-A03', bhg: 'A', bab: 2, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti faktor', m: 1,
    q: 'Antara berikut, yang manakah faktor bagi 18?', qe: 'Which of the following is a factor of 18?', pil: ['4', '5', '6', '7'], jaw: 'C' },
  { id: 'T1S3-A04', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Punca kuasa dua dan kuasa tiga dalam konteks kubus', m: 1,
    q: 'Jumlah luas permukaan sebuah kotak hadiah berbentuk kubus ialah 486 cm². Hitung isi padu kotak itu, dalam cm³.', qe: 'The total surface area of a cube-shaped gift box is 486 cm². Calculate the volume of the box, in cm³.',
    pil: ['9', '81', '486', '729'], jaw: 'D', sk: '486 ÷ 6 = 81 → sisi 9 cm → 9³ = 729' },
  { id: 'T1S3-A05', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'R', why: 'Luas daripada perimeter segi empat sama', m: 1,
    q: 'Perimeter sekeping kad berbentuk segi empat sama ialah 52 cm. Cari luas kad itu, dalam cm².', qe: 'The perimeter of a square card is 52 cm. Find the area of the card, in cm².',
    pil: ['26', '52', '156', '169'], jaw: 'D', sk: 'Sisi = 13 cm → 169 cm²' },
  { id: 'T1S3-A06', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Nisbah tiga kuantiti dengan penukaran unit', m: 1,
    q: 'Wakilkan nisbah 2 minggu kepada 21 hari kepada 5 minggu dalam bentuk termudah <i>a</i> : <i>b</i> : <i>c</i>.', qe: 'Express the ratio of 2 weeks to 21 days to 5 weeks in its simplest form <i>a</i> : <i>b</i> : <i>c</i>.',
    pil: ['2 : 3 : 5', '2 : 21 : 5', '1 : 3 : 5', '4 : 3 : 10'], jaw: 'A', sk: '14 : 21 : 35 = 2 : 3 : 5' },
  { id: 'T1S3-A07', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'R', why: 'Peratusan daripada bahagian', m: 1,
    q: 'Sebuah bas membawa 40 orang penumpang. 14 orang ialah penumpang lelaki dan selebihnya penumpang perempuan. Berapakah peratusan penumpang perempuan?', qe: 'A bus carries 40 passengers. 14 are male and the rest are female. What is the percentage of female passengers?',
    pil: ['35%', '54%', '65%', '74%'], jaw: 'C', sk: 'FR(26|40) × 100% = 65%' },
  { id: 'T1S3-A08', bhg: 'A', bab: 4, kon: 'Memahami', aras: 'R', why: 'Bilangan sebutan', m: 1,
    q: 'Nyatakan bilangan sebutan dalam ungkapan algebra 4<i>a</i> − <i>b</i> + 3<i>c</i> − 7 + <i>d</i>.', qe: 'State the number of terms in the algebraic expression 4<i>a</i> − <i>b</i> + 3<i>c</i> − 7 + <i>d</i>.', pil: ['3', '4', '5', '6'], jaw: 'C' },
  { id: 'T1S3-A09', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Darab sebutan algebra', m: 1,
    q: 'Permudahkan 4 × <i>p</i> × 3<i>p</i> × <i>q</i>.', qe: 'Simplify 4 × <i>p</i> × 3<i>p</i> × <i>q</i>.', pil: ['7<i>p</i>²<i>q</i>', '12<i>pq</i>', '12<i>p</i>²<i>q</i>', '4<i>p</i>²<i>q</i>'], jaw: 'C' },
  { id: 'T1S3-A10', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Bentuk ungkapan luas', m: 1,
    q: 'Sebuah taman mempunyai dua kolam ikan berbentuk segi empat tepat yang sama besar. Setiap kolam berukuran <i>x</i> m × (<i>y</i> − 3) m. Cari ungkapan bagi jumlah luas kedua-dua kolam, dalam m².',
    qe: 'A garden has two identical rectangular fish ponds. Each pond measures <i>x</i> m × (<i>y</i> − 3) m. Find an expression for the total area of both ponds, in m².',
    pil: ['2<i>xy</i> − 6<i>x</i>', '<i>xy</i> − 3<i>x</i>', '2<i>xy</i> − 3', '2<i>x</i> + 2<i>y</i> − 6'], jaw: 'A' },
  { id: 'T1S3-A11', bhg: 'A', bab: 5, kon: 'Memahami', aras: 'R', why: 'Ciri persamaan linear satu pemboleh ubah', m: 1,
    q: 'Antara berikut, yang manakah persamaan linear dalam satu pemboleh ubah?', qe: 'Which of the following is a linear equation in one variable?',
    pil: ['FR(3|<i>m</i>) + 1 = 4', '<i>k</i>² − 2 = 7', '4<i>h</i> − 5 = 2<i>h</i> + 9', '<i>p</i> + <i>q</i> = 10'], jaw: 'C' },
  { id: 'T1S3-A12', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Gantian satu persamaan ke dalam persamaan lain', m: 1,
    q: 'Diberi 2<i>x</i> + <i>y</i> = 17 dan <i>y</i> = <i>x</i> + 2. Hitung nilai <i>y</i>.', qe: 'Given 2<i>x</i> + <i>y</i> = 17 and <i>y</i> = <i>x</i> + 2. Calculate the value of <i>y</i>.',
    pil: ['5', '7', '9', '12'], jaw: 'B', sk: '3<i>x</i> + 2 = 17 → <i>x</i> = 5 → <i>y</i> = 7' },
  { id: 'T1S3-A13', bhg: 'A', bab: 5, kon: 'Memahami', aras: 'R', why: 'Ketaksamaan daripada garis nombor', m: 1, fig: 'T1S3A13',
    q: 'Tentukan ketaksamaan yang diwakili oleh garis nombor itu.', qe: 'Determine the inequality represented by the number line.',
    pil: ['<i>m</i> < −4', '<i>m</i> ≤ −4', '<i>m</i> > −4', '<i>m</i> ≥ −4'], jaw: 'D', sk: 'Bulatan penuh = termasuk −4; arah ke kanan' },
  { id: 'T1S3-A14', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'R', why: 'Sudut pelengkap', m: 1,
    q: 'Cari sudut pelengkap bagi 37°.', qe: 'Find the complementary angle of 37°.', pil: ['53°', '63°', '143°', '323°'], jaw: 'A' },
  { id: 'T1S3-A15', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'R', why: 'Sudut konjugat', m: 1,
    q: 'Cari sudut konjugat bagi 125°.', qe: 'Find the conjugate angle of 125°.', pil: ['55°', '65°', '235°', '245°'], jaw: 'C' },
  { id: 'T1S3-A16', bhg: 'A', bab: 7, kon: 'Mengingat', aras: 'R', why: 'Jenis segi tiga', m: 1,
    q: 'Sebuah segi tiga yang mempunyai dua sisi yang sama panjang dinamakan segi tiga', qe: 'A triangle with two sides of equal length is called',
    pil: ['sama sisi', 'sama kaki', 'tak sama kaki', 'bersudut tegak'], pe: ['an equilateral triangle', 'an isosceles triangle', 'a scalene triangle', 'a right-angled triangle'], jaw: 'B' },
  { id: 'T1S3-A17', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Perimeter bentuk L sama dengan segi empat tepat yang melingkunginya', m: 1,
    q: 'Pelan sebuah bilik berbentuk huruf L. Semua sudutnya tegak. Panjang keseluruhan bilik ialah 5.2 m dan lebar keseluruhannya ialah 3.8 m. Berapakah perimeter bilik itu?',
    qe: 'The plan of a room is L-shaped. All its corners are right angles. The overall length of the room is 5.2 m and its overall width is 3.8 m. What is the perimeter of the room?',
    pil: ['9.0 m', '15.4 m', '18.0 m', '19.6 m'], jaw: 'C', sk: 'Sisi-sisi mengufuk berjumlah 2 × 5.2, sisi-sisi mencancang berjumlah 2 × 3.8 → 18.0 m' },
  { id: 'T1S3-A18', bhg: 'A', bab: 2, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti gandaan', m: 1,
    q: 'Antara berikut, yang manakah gandaan 7?', qe: 'Which of the following is a multiple of 7?', pil: ['27', '47', '63', '76'], jaw: 'C' },
  { id: 'T1S3-A19', bhg: 'A', bab: 8, kon: 'Memahami', aras: 'R', why: 'Kaedah pengumpulan data', m: 1,
    q: 'Kaedah pengumpulan data yang manakah paling sesuai untuk menentukan jenis burung yang hinggap di taman sekolah pada waktu pagi?', qe: 'Which data collection method is most suitable to determine the types of birds that land in the school garden in the morning?',
    pil: ['Tinjauan', 'Temu bual', 'Eksperimen', 'Pemerhatian'], pe: ['Survey', 'Interview', 'Experiment', 'Observation'], jaw: 'D' },
  { id: 'T1S3-A20', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Nisbah panjang dan teorem Pythagoras', m: 1, fig: 'T1S3A20',
    q: 'Dalam rajah, <i>B</i>, <i>E</i> dan <i>D</i> terletak pada satu garis lurus dengan <i>DE</i> = 3<i>EB</i>. Cari panjang <i>CD</i>, dalam cm.', qe: 'In the diagram, <i>B</i>, <i>E</i> and <i>D</i> lie on a straight line with <i>DE</i> = 3<i>EB</i>. Find the length of <i>CD</i>, in cm.',
    pil: ['16', '20', '24', '28'], jaw: 'B', sk: '<i>DE</i> = 12 → <i>BD</i> = 16<br><i>CD</i> = RT(12² + 16²) = 20' },

  // ---------------- SET 3 · BAHAGIAN B ----------------
  { id: 'T1S3-B01', bhg: 'B', bab: 1, babs: [1, 2, 5], parts: [
    { l: '(a)', jenis: 'bulat', m: 1, aras: 'R', kon: 'Memahami', q: 'Sebuah kapal selam berada 45 m di bawah paras laut. Bulatkan integer yang mewakili kedudukannya.', qe: 'A submarine is 45 m below sea level. Circle the integer that represents its position.',
      items: [{ t: 'CH(45|−45|0.45)', a: '−45' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Faktor perdana bagi 60: __________', te: 'The prime factors of 60: __________', a: '2, 3, 5' }, { t: '60 dalam bentuk pemfaktoran perdana: __________', te: '60 in prime factorisation form: __________', a: '2 × 2 × 3 × 5' }] },
    { l: '(c)', jenis: 'bulat', m: 1, aras: 'R', kon: 'Memahami', q: 'Berat bagasi, <i>w</i> kg, mestilah tidak melebihi 20 kg. Bulatkan ketaksamaan yang betul.', qe: 'The mass of luggage, <i>w</i> kg, must not exceed 20 kg. Circle the correct inequality.',
      items: [{ t: 'CH(<i>w</i> < 20|<i>w</i> ≤ 20|<i>w</i> ≥ 20)', a: '<i>w</i> ≤ 20' }] }] },
  { id: 'T1S3-B02', bhg: 'B', bab: 3, babs: [1, 3, 7], parts: [
    { l: '(a)', jenis: 'bulat', m: 1, aras: 'R', kon: 'Memahami', q: 'Bulatkan kuasa tiga sempurna.', qe: 'Circle the perfect cube.', items: [{ t: 'CH(36|64|100)', a: '64' }] },
    { l: '(b)', jenis: 'pad', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Padankan setiap nisbah dengan nisbah setaranya.', qe: 'Match each ratio with its equivalent ratio.',
      items: [{ t: '4 : 10', a: '2 : 5' }, { t: '12 : 8', a: '3 : 2' }, { t: '0.5 : 2', a: '1 : 4' }], kanan: ['1 : 4', '2 : 5', '3 : 2'] },
    { l: '(c)', jenis: 'bulat', m: 1, aras: 'S', kon: 'Menganalisis', q: '<i>EFGH</i> ialah sebuah segi empat tepat. Panjang <i>EF</i> ialah 15 cm dan luasnya ialah 120 cm². Bulatkan panjang pepenjuru <i>FH</i>.', qe: '<i>EFGH</i> is a rectangle. The length of <i>EF</i> is 15 cm and its area is 120 cm². Circle the length of the diagonal <i>FH</i>.',
      items: [{ t: 'CH(15 cm|17 cm|23 cm)', a: '17 cm' }], sk: 'Lebar = 8 cm; RT(15² + 8²) = 17' }] },
  { id: 'T1S3-B03', bhg: 'B', bab: 4, babs: [3, 4, 8], parts: [
    { l: '(a)', jenis: 'pad', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Padankan setiap situasi dengan ungkapan algebra yang betul.', qe: 'Match each situation with the correct algebraic expression.',
      items: [{ t: 'Jumlah bayaran bagi 3 kg beras berharga RM<i>a</i> sekilogram dan 5 kg tepung berharga RM<i>b</i> sekilogram', te: 'Total payment for 3 kg of rice at RM<i>a</i> per kg and 5 kg of flour at RM<i>b</i> per kg', a: '3<i>a</i> + 5<i>b</i>' },
        { t: 'Perimeter segi empat tepat dengan panjang 2<i>x</i> cm dan lebar (5 − <i>y</i>) cm', te: 'Perimeter of a rectangle with length 2<i>x</i> cm and width (5 − <i>y</i>) cm', a: '4<i>x</i> + 10 − 2<i>y</i>' }],
      kanan: ['4<i>x</i> + 10 − 2<i>y</i>', '3<i>a</i> + 5<i>b</i>'] },
    { l: '(b)', jenis: 'bp', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Jadual menunjukkan pendapatan Encik Ramli bagi empat bulan. Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'The table shows Encik Ramli\'s income for four months. Write <b>True</b> or <b>False</b>.',
      jadual: { r: [['Bulan', 'Mac', 'April', 'Mei', 'Jun'], ['Pendapatan (RM)', '4 000', '2 200', '2 400', '3 000']], re: ['Month', 'Income (RM)'] },
      items: [{ t: 'Pendapatan bulan Mei kurang daripada pendapatan bulan Jun.', te: 'The income in May is less than the income in June.', a: 'Benar' },
        { t: 'Pendapatan bulan April menurun sebanyak 50% daripada pendapatan bulan Mac.', te: 'The income in April decreases by 50% from the income in March.', a: 'Palsu' }], sk: 'Penurunan = FR(1 800|4 000) × 100% = 45%' }] },
  { id: 'T1S3-B04', bhg: 'B', bab: 6, parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Memahami', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Hasil tambah sudut pada satu garis lurus ialah __________', te: 'The sum of angles on a straight line is __________', a: '180°' }, { t: 'Dua sudut pada satu garis lurus ialah 3<i>x</i> dan 2<i>x</i>. <i>x</i> = __________', te: 'Two angles on a straight line are 3<i>x</i> and 2<i>x</i>. <i>x</i> = __________', a: '36°' }] },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Garis lurus <i>PQ</i> dan <i>RS</i> bersilang di <i>O</i>. ∠<i>POR</i> = 64°, ∠<i>QOS</i> = <i>v</i> dan ∠<i>ROQ</i> = <i>w</i>. Bulatkan jawapan yang betul.', qe: 'The straight lines <i>PQ</i> and <i>RS</i> intersect at <i>O</i>. ∠<i>POR</i> = 64°, ∠<i>QOS</i> = <i>v</i> and ∠<i>ROQ</i> = <i>w</i>. Circle the correct answers.',
      items: [{ t: '<i>v</i> = CH(54°|64°|116°)', a: '64°' }, { t: '<i>w</i> = CH(64°|116°|126°)', a: '116°' }] }] },
  { id: 'T1S3-B05', bhg: 'B', bab: 7, babs: [2, 7], parts: [
    { l: '(a)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Menganalisis', q: '<i>EFG</i> ialah sebuah segi tiga dan <i>DEF</i> ialah garis lurus. ∠<i>GED</i> = <i>p</i>, ∠<i>EFG</i> = <i>q</i>, ∠<i>FGE</i> = <i>r</i> dan ∠<i>GEF</i> = <i>s</i>. Tandakan (✓) bagi <b>dua</b> pernyataan yang benar.',
      qe: '<i>EFG</i> is a triangle and <i>DEF</i> is a straight line. ∠<i>GED</i> = <i>p</i>, ∠<i>EFG</i> = <i>q</i>, ∠<i>FGE</i> = <i>r</i> and ∠<i>GEF</i> = <i>s</i>. Tick (✓) the <b>two</b> true statements.',
      items: [{ t: '<i>p</i> = <i>q</i> + <i>r</i>', a: '✓' }, { t: '<i>s</i> = <i>p</i>', a: '' }, { t: '<i>p</i> + <i>s</i> = 180°', a: '✓' }, { t: '<i>q</i> + <i>r</i> + <i>s</i> = 360°', a: '' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Gandaan sepunya bagi 4 dan 6 yang kurang daripada 50 ialah 12, 24, ____, ____.', qe: 'The common multiples of 4 and 6 that are less than 50 are 12, 24, ____, ____.',
      items: [{ t: 'Nombor ketiga: ____', te: 'Third number: ____', a: '36' }, { t: 'Nombor keempat: ____', te: 'Fourth number: ____', a: '48' }] }] },

  // ---------------- SET 3 · BAHAGIAN C ----------------
  { id: 'T1S3-C01', bhg: 'C', bab: 8, babs: [3, 5, 8], parts: [
    { l: '(a)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Jadual menunjukkan pekerjaan yang diminati oleh 60 orang murid. Wakilkan hubungan berikut dalam bentuk termudah <i>a</i> : <i>b</i> : <i>c</i>.<br>(i) Guru kepada polis kepada doktor.<br>(ii) Jurutera kepada doktor kepada guru.',
      qe: 'The table shows the favourite occupations of 60 pupils. Express the following relationships in the simplest form <i>a</i> : <i>b</i> : <i>c</i>.<br>(i) Teacher to police to doctor.<br>(ii) Engineer to doctor to teacher.',
      jadual: { r: [['Pekerjaan', 'Guru', 'Polis', 'Doktor', 'Jurutera', 'Lain-lain'], ['Bilangan murid', '18', '9', '12', '15', '6']], re: ['Occupation', 'Number of pupils'] },
      sk: '(i) 18 : 9 : 12 <b>K1</b> = 6 : 3 : 4 <b>N1</b><br>(ii) 15 : 12 : 18 <b>K1</b> = 5 : 4 : 6 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Data dalam jadual di (a) diwakili dengan carta pai.<br>(i) Hitung sudut sektor bagi Jurutera.<br>(ii) Nyatakan pekerjaan yang paling diminati.', qe: 'The data in the table in (a) is represented by a pie chart.<br>(i) Calculate the sector angle for Engineer.<br>(ii) State the most popular occupation.',
      sk: '(i) FR(15|60) × 360° <b>K1</b> = 90° <b>N1</b><br>(ii) Guru <b>P1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Selesaikan ketaksamaan linear serentak 3<i>x</i> − 4 > 11 dan 2<i>x</i> − 1 ≤ 15.', qe: 'Solve the simultaneous linear inequalities 3<i>x</i> − 4 > 11 and 2<i>x</i> − 1 ≤ 15.',
      sk: '<i>x</i> > 5 <b>K1</b>; <i>x</i> ≤ 8 <b>K1</b><br>5 < <i>x</i> ≤ 8 <b>N1</b>' }] },
  { id: 'T1S3-C02', bhg: 'C', bab: 7, kbat: true, parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Sebuah segi tiga bersudut tegak mempunyai dua sisi yang membentuk sudut tegak, 9 cm dan 12 cm. Hitung panjang hipotenus.', qe: 'A right-angled triangle has two sides forming the right angle, 9 cm and 12 cm. Calculate the length of the hypotenuse.',
      sk: 'RT(9² + 12²) <b>K1</b> = 15 cm <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'T', kon: 'Menilai', q: 'Sekeping papan sepanjang 2.5 m disandarkan pada sebuah dinding. Kaki papan berada 0.7 m dari dinding dan hujung atas papan menyentuh dinding pada ketinggian 2.4 m dari lantai. Tentukan sama ada dinding itu tegak. Terangkan.',
      qe: 'A 2.5 m plank leans against a wall. The foot of the plank is 0.7 m from the wall and the top of the plank touches the wall at a height of 2.4 m from the floor. Determine whether the wall is vertical. Explain.',
      sk: '0.7² + 2.4² = 0.49 + 5.76 = 6.25 <b>K1</b>; 2.5² = 6.25 <b>K1</b><br>Akas teorem Pythagoras dipenuhi <b>K1</b>; dinding itu tegak <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah segi empat selari <i>TQUV</i> dengan tapak <i>TQ</i> = 6 m dan tinggi 9 m terletak di dalam sebuah segi empat tepat <i>PQRS</i> berukuran 16 m × 10 m. Kawasan di luar segi empat selari itu berlorek. Cari luas kawasan berlorek, dalam m².',
      qe: 'A parallelogram <i>TQUV</i> with base <i>TQ</i> = 6 m and height 9 m lies inside a rectangle <i>PQRS</i> measuring 16 m × 10 m. The region outside the parallelogram is shaded. Find the area of the shaded region, in m².',
      sk: '16 × 10 = 160 <b>K1</b>; 6 × 9 = 54 <b>K1</b><br>160 − 54 <b>K1</b> = 106 m² <b>N1</b>' }] },
  { id: 'T1S3-C03', bhg: 'C', bab: 1, babs: [1, 2, 4], parts: [
    { l: '(a)', m: 1, aras: 'R', kon: 'Mengaplikasi', q: 'Nyatakan GSTK bagi 4 dan 15.', qe: 'State the LCM of 4 and 15.', sk: '60 <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Senaraikan semua gandaan 3 antara 30 dan 50.', qe: 'List all the multiples of 3 between 30 and 50.', sk: '33, 36, 39, 42, 45, 48 <b>P2</b>' },
    { l: '(c)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bagi satu adunan donut, <i>x</i> g tepung diperlukan dan berat yogurt ialah 50 g lebih daripada berat tepung. Bentukkan ungkapan algebra bagi jumlah berat bahan dalam satu adunan.',
      qe: 'For one batch of donuts, <i>x</i> g of flour is needed and the mass of yogurt is 50 g more than the mass of flour. Form an algebraic expression for the total mass of ingredients in one batch.',
      sk: '<i>x</i> + (<i>x</i> + 50) <b>K1</b> = 2<i>x</i> + 50 <b>N1</b>' },
    { l: '(d)', m: 5, aras: 'T', kon: 'Menganalisis', q: 'Kakak Hanif menambah nilai e-dompet Hanif sebanyak RM150. Hanif kemudian berbelanja RM32.40, RM58.90 dan RM104.70 di tiga buah kedai. Baki e-dompetnya ialah RM25.50. Berapakah nilai awal e-dompet Hanif sebelum ditambah nilai?',
      qe: 'Hanif\'s sister tops up his e-wallet by RM150. Hanif then spends RM32.40, RM58.90 and RM104.70 at three shops. The balance of his e-wallet is RM25.50. What was the initial value of Hanif\'s e-wallet before the top-up?',
      sk: 'Jumlah belanja = 32.40 + 58.90 + 104.70 = 196.00 <b>K1 K1</b><br><i>x</i> + 150 − 196 = 25.50 <b>K1</b><br><i>x</i> = 25.50 + 196 − 150 <b>K1</b> = RM71.50 <b>N1</b>' }] },
  { id: 'T1S3-C04', bhg: 'C', bab: 7, babs: [2, 3, 7], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Memahami', q: 'Sebuah sisi empat mempunyai dua pasang sisi bersebelahan yang sama panjang. Namakan sisi empat itu dan nyatakan bilangan paksi simetrinya.', qe: 'A quadrilateral has two pairs of equal adjacent sides. Name the quadrilateral and state its number of axes of symmetry.',
      sk: 'Lelayang <b>P1</b>; 1 paksi simetri <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Memahami', q: 'Ali membeli 6 biji mangga dengan harga RM9 manakala Bala membeli 18 biji mangga dengan harga RM27. Tulis satu kadaran bagi situasi itu dan nyatakan dua kuantiti yang terlibat.',
      qe: 'Ali buys 6 mangoes for RM9 while Bala buys 18 mangoes for RM27. Write a proportion for the situation and state the two quantities involved.',
      sk: '6 : 9 = 18 : 27 <b>P1</b>; bilangan mangga dan harga <b>P1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Menganalisis', q: 'Sebuah segi empat tepat berukuran 10 cm × 6 cm dan sebuah segi tiga sama sisi bersisi 6 cm dicantumkan pada sisi 6 cm. Hitung perimeter seluruh gabungan bentuk itu.',
      qe: 'A rectangle measuring 10 cm × 6 cm and an equilateral triangle with sides of 6 cm are joined along a 6 cm side. Calculate the perimeter of the whole combined shape.',
      sk: '10 + 6 + 10 <b>K1</b> + 6 + 6 <b>K1</b> = 38 cm <b>N1</b>' },
    { l: '(d)', m: 3, aras: 'R', kon: 'Menilai', q: '(i) Senaraikan semua faktor bagi 28.<br>(ii) Adakah 8 faktor bagi 56? Berikan justifikasi.', qe: '(i) List all the factors of 28.<br>(ii) Is 8 a factor of 56? Give a justification.',
      sk: '(i) 1, 2, 4, 7, 14, 28 <b>P1</b><br>(ii) Ya <b>P1</b>; 56 ÷ 8 = 7 tanpa baki <b>P1</b>' }] },
  { id: 'T1S3-C05', bhg: 'C', bab: 5, babs: [2, 5, 7], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Senaraikan semua faktor perdana bagi 210. Seterusnya, ungkapkan 210 dalam bentuk pemfaktoran perdana.', qe: 'List all the prime factors of 210. Hence, express 210 in prime factorisation form.',
      sk: '2, 3, 5, 7 <b>P2</b><br>210 = 2 × 3 × 5 × 7 <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Memahami', q: 'Segi tiga <i>PQR</i> bersudut tegak di <i>Q</i> dan segi tiga <i>PRS</i> bersudut tegak di <i>R</i>. Namakan hipotenus bagi setiap segi tiga.', qe: 'Triangle <i>PQR</i> is right-angled at <i>Q</i> and triangle <i>PRS</i> is right-angled at <i>R</i>. Name the hypotenuse of each triangle.',
      sk: '<i>PR</i> <b>P1</b>; <i>PS</i> <b>P1</b>' },
    { l: '(c)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Selesaikan.<br>(i) <i>x</i> − 8 = 5<br>(ii) 4<i>y</i> = 28<br>(iii) <i>z</i> + 9 = 3', qe: 'Solve.<br>(i) <i>x</i> − 8 = 5<br>(ii) 4<i>y</i> = 28<br>(iii) <i>z</i> + 9 = 3',
      sk: '(i) 13 <b>N1</b> (ii) 7 <b>N1</b> (iii) −6 <b>N1</b>' },
    { l: '(d)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Selesaikan ketaksamaan linear serentak <i>x</i> ≥ −2 dan 3<i>x</i> + 2 < 14.', qe: 'Solve the simultaneous linear inequalities <i>x</i> ≥ −2 and 3<i>x</i> + 2 < 14.',
      sk: '<i>x</i> < 4 <b>K1</b>; −2 ≤ <i>x</i> < 4 <b>N1</b>' }] },
  { id: 'T1S3-C06', bhg: 'C', bab: 6, babs: [5, 6, 7, 8], parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Memahami', fig: 'T1S3C06', q: 'Rajah menunjukkan dua garis selari yang dipotong oleh satu garis rentas lintang. Namakan sudut yang<br>(i) sepadan dengan <i>b</i>,<br>(ii) selang-seli dengan <i>d</i>,<br>(iii) pedalaman dengan <i>c</i>.',
      qe: 'The diagram shows two parallel lines cut by a transversal. Name the angle that is<br>(i) corresponding to <i>b</i>,<br>(ii) alternate to <i>d</i>,<br>(iii) interior to <i>c</i>.',
      sk: '(i) <i>f</i> <b>P1</b> (ii) <i>e</i> <b>P1</b> (iii) <i>e</i> <b>P1</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: '<i>BCDE</i> ialah sebuah segi empat selari dan <i>ABC</i> ialah garis lurus. Diberi ∠<i>ABE</i> = 115°. Hitung ∠<i>BED</i>.', qe: '<i>BCDE</i> is a parallelogram and <i>ABC</i> is a straight line. Given ∠<i>ABE</i> = 115°. Calculate ∠<i>BED</i>.',
      sk: '∠<i>EBC</i> = 65° <b>K1</b>; ∠<i>BED</i> = 180° − 65° = 115° <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Data menunjukkan bilangan telur yang dikutip oleh Pak Hasan setiap hari selama 30 hari.<br>3 4 2 5 3 4 4 3 2 5 4 3 4 5 3<br>2 4 4 3 5 4 3 2 4 5 3 4 4 3 5<br>Lengkapkan jadual kekerapan.',
      qe: 'The data shows the number of eggs collected by Pak Hasan every day for 30 days.<br>Complete the frequency table.',
      jadual: { r: [['Bilangan telur', '2', '3', '4', '5'], ['Gundalan', '?', '?', '?', '?'], ['Kekerapan', '?', '?', '?', '?']], re: ['Number of eggs', 'Tally', 'Frequency'] },
      sk: 'Kekerapan: 4, 9, 11, 6 <b>P3</b>' },
    { l: '(d)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Dalam sebuah kelas, bilangan murid lelaki adalah 7 orang kurang daripada bilangan murid perempuan. Jumlah murid ialah 41 orang. Hitung bilangan murid perempuan.', qe: 'In a class, the number of boys is 7 fewer than the number of girls. There are 41 pupils altogether. Calculate the number of girls.',
      sk: '<i>p</i> + (<i>p</i> − 7) = 41 <b>K1</b>; <i>p</i> = 24 <b>N1</b>' }] }
);
