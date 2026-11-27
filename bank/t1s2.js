'use strict';
/* =================== BANK SOALAN · TINGKATAN 1 · SET 2 (format UASA, bab KP2027) ===================
   Set 2 (27 Nov 2026): 20 A · 5 B · 6 C. Diolah semula oleh Mat berdasarkan bentuk dan aras UASA T1 2026 SMKRP
   (rujukan: Downloads/Bank Soalan/T1_UASA-2026.pdf). Soalan topik Set diganti dengan Faktor dan Gandaan.
   Dimuat selepas t1.js (guna BS_T1, BS_FIG). */

const BS_T1L = (cx, cy, r, ang) => ang.map(a => { const t = a * Math.PI / 180; return `<line x1="${(cx - r * Math.cos(t)).toFixed(1)}" y1="${(cy + r * Math.sin(t)).toFixed(1)}" x2="${(cx + r * Math.cos(t)).toFixed(1)}" y2="${(cy - r * Math.sin(t)).toFixed(1)}"/>`; }).join('');
const BS_T1P = (cx, cy, r, a, s) => { const t = a * Math.PI / 180; return `<text x="${(cx + r * Math.cos(t)).toFixed(1)}" y="${(cy - r * Math.sin(t) + 4).toFixed(1)}" text-anchor="middle" font-style="italic">${s}</text>`; };

Object.assign(BS_FIG, {
  T1S2A13: `<svg viewBox="0 0 200 170" width="180" role="img" aria-label="Tiga garis lurus bersilang di satu titik membentuk enam sudut a hingga f">
    <g stroke="currentColor" stroke-width="2">${BS_T1L(100, 85, 85, [0, 55, 120])}</g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="13">${['a', 'b', 'c', 'd', 'e', 'f'].map((s, i) => BS_T1P(100, 85, 26, [27.5, 87.5, 150, 207.5, 267.5, 330][i], s)).join('')}</g></svg>`,
  T1S2A20: `<svg viewBox="0 0 230 170" width="210" role="img" aria-label="Segi tiga bersudut tegak ABC (AB 9 cm, BC 12 cm) dan segi tiga bersudut tegak ACD (CD 8 cm)">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="30,150 30,60 150,150"/><polygon points="30,60 150,150 198,86"/></g>
    <g fill="none" stroke="currentColor" stroke-width="1.2"><rect x="30" y="140" width="10" height="10"/><polyline points="141,143 147,135 155,141"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="18" y="58" font-style="italic">A</text><text x="18" y="162" font-style="italic">B</text><text x="152" y="164" font-style="italic">C</text><text x="202" y="86" font-style="italic">D</text>
    <text x="0" y="110">9 cm</text><text x="78" y="164">12 cm</text><text x="180" y="126">8 cm</text></g></svg>`,
  T1S2C01: `<svg viewBox="-16 0 216 170" width="190" role="img" aria-label="Segi tiga bersudut tegak ABC (AB 12 cm, BC 8 cm) dengan segi empat sama BDEF bersisi y cm di bucu B; kawasan lain berlorek">
    <polygon points="30,20 30,150 150,150" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="2"/>
    <rect x="30" y="110" width="40" height="40" fill="var(--bg,#fff)" stroke="currentColor" stroke-width="2"/>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="20" y="18" font-style="italic">A</text><text x="18" y="162" font-style="italic">B</text><text x="152" y="162" font-style="italic">C</text>
    <text x="66" y="162" font-style="italic">D</text><text x="72" y="108" font-style="italic">E</text><text x="18" y="112" font-style="italic">F</text><text x="-14" y="80">12 cm</text><text x="92" y="166">8 cm</text><text x="40" y="134"><tspan font-style="italic">y</tspan> cm</text></g></svg>`,
  T1S2C04b: `<svg viewBox="0 -12 200 190" width="180" role="img" aria-label="Tiga garis lurus AB, CD dan EF bersilang di O; sudut AOC 50 darjah, COE 70 darjah, sudut p, q dan r">
    <g stroke="currentColor" stroke-width="2">${BS_T1L(100, 85, 85, [0, 50, 120])}</g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12">${BS_T1P(100, 85, 94, 180, 'A')}${BS_T1P(100, 85, 94, 0, 'B')}${BS_T1P(100, 85, 94, 230, 'C')}${BS_T1P(100, 85, 94, 50, 'D')}${BS_T1P(100, 85, 94, 300, 'E')}${BS_T1P(100, 85, 94, 120, 'F')}
    <text x="58" y="104">50°</text><text x="96" y="124">70°</text>${BS_T1P(100, 85, 30, 25, 'p')}${BS_T1P(100, 85, 30, 85, 'q')}${BS_T1P(100, 85, 30, 150, 'r')}<text x="104" y="82" font-style="italic">O</text></g></svg>`,
  T1S2C04c: `<svg viewBox="0 0 240 150" width="220" role="img" aria-label="Segi empat sama ABCD dan BEFG bersebelahan; A, B dan E segaris; AE 16 cm">
    <g fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"><rect x="20" y="62" width="70" height="70"/><rect x="90" y="42" width="90" height="90"/></g>
    <g font-family="Inter,sans-serif" fill="currentColor" font-size="12"><text x="10" y="146" font-style="italic">A</text><text x="84" y="146" font-style="italic">B</text><text x="182" y="146" font-style="italic">E</text>
    <text x="10" y="60" font-style="italic">D</text><text x="78" y="58" font-style="italic">C</text><text x="182" y="40" font-style="italic">F</text><text x="84" y="38" font-style="italic">G</text></g>
    <line x1="20" y1="142" x2="180" y2="142" stroke="currentColor" stroke-dasharray="3 3"/></svg>`
});

BS_T1.push(
  // ---------------- SET 2 · BAHAGIAN A ----------------
  { id: 'T1S2-A01', bhg: 'A', bab: 1, kon: 'Mengingat', aras: 'R', why: 'Kenal pasti hukum kalis agihan', m: 1,
    q: 'Antara pernyataan berikut, yang manakah menunjukkan hukum kalis agihan?', qe: 'Which of the following statements shows the distributive law?',
    pil: ['<i>a</i> + <i>b</i> = <i>b</i> + <i>a</i>', '(<i>a</i> × <i>b</i>) × <i>c</i> = <i>a</i> × (<i>b</i> × <i>c</i>)', '<i>a</i> × (<i>b</i> + <i>c</i>) = <i>a</i> × <i>b</i> + <i>a</i> × <i>c</i>', '<i>a</i> + 0 = <i>a</i>'], jaw: 'C' },
  { id: 'T1S2-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Operasi perpuluhan negatif, kemudian banding', m: 1,
    q: 'Antara berikut, yang manakah memberi nilai yang <b>terkecil</b>?', qe: 'Which of the following gives the <b>smallest</b> value?',
    pil: ['−2.7 + 1.5', '−5.03 − (−1.8)', '4.1 − (−0.6)', '−6.4 + 2.95'], jaw: 'D', sk: '−1.2, −3.23, 4.7, −3.45 → terkecil −3.45' },
  { id: 'T1S2-A03', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Integer dalam situasi kedudukan', m: 1,
    q: 'Seorang penyelam berada 28 m di bawah paras laut. Sebuah helikopter berada 15 m di atas paras laut, tegak di atas penyelam itu. Kemudian penyelam itu naik 9 m. Berapakah jarak terbaharu, dalam m, antara penyelam dan helikopter?',
    qe: 'A diver is 28 m below sea level. A helicopter is 15 m above sea level, directly above the diver. Then the diver rises 9 m. What is the new distance, in m, between the diver and the helicopter?',
    pil: ['24', '34', '43', '52'], jaw: 'B', sk: 'Penyelam di −19 m → 15 − (−19) = 34 m' },
  { id: 'T1S2-A04', bhg: 'A', bab: 2, kon: 'Memahami', aras: 'R', why: 'Kenal pasti faktor', m: 1,
    q: 'Antara berikut, yang manakah faktor bagi 42?', qe: 'Which of the following are factors of 42?',
    pil: ['4 dan 6', '3 dan 14', '5 dan 7', '8 dan 21'], pe: ['4 and 6', '3 and 14', '5 and 7', '8 and 21'], jaw: 'B' },
  { id: 'T1S2-A05', bhg: 'A', bab: 1, kon: 'Menganalisis', aras: 'S', why: 'Kuasa dua dan kuasa tiga sempurna serentak', m: 1,
    q: 'Antara nombor berikut, yang manakah kuasa dua sempurna dan juga kuasa tiga sempurna?', qe: 'Which of the following numbers is both a perfect square and a perfect cube?',
    pil: ['81', '125', '400', '729'], jaw: 'D', sk: '729 = 27² = 9³' },
  { id: 'T1S2-A06', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Punca kuasa tiga dalam konteks kubus', m: 1,
    q: 'Isi padu sebuah bongkah berbentuk kubus ialah 343 cm³. Hitung luas, dalam cm², satu permukaan bongkah itu.', qe: 'The volume of a cube-shaped block is 343 cm³. Calculate the area, in cm², of one face of the block.',
    pil: ['7', '42', '49', '294'], jaw: 'C', sk: 'Sisi = ∛343 = 7 cm → 7² = 49' },
  { id: 'T1S2-A07', bhg: 'A', bab: 3, kon: 'Memahami', aras: 'R', why: 'Nisbah setara', m: 1,
    q: 'Antara berikut, nisbah yang manakah setara dengan 18 : 30?', qe: 'Which of the following ratios is equivalent to 18 : 30?',
    pil: ['6 : 12', '9 : 15', '12 : 15', '27 : 40'], jaw: 'B', sk: '18 : 30 = 3 : 5 = 9 : 15' },
  { id: 'T1S2-A08', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Nisbah tiga kuantiti, cari nilai satu bahagian', m: 1,
    q: 'Nisbah jisim Ali kepada Ben kepada Chong ialah 2 : 7 : 5. Jisim murid yang paling berat ialah 63 kg. Hitung beza jisim, dalam kg, antara Ali dan Chong.',
    qe: 'The ratio of the masses of Ali to Ben to Chong is 2 : 7 : 5. The mass of the heaviest pupil is 63 kg. Calculate the difference in mass, in kg, between Ali and Chong.',
    pil: ['18', '27', '36', '45'], jaw: 'B', sk: '1 bahagian = 63 ÷ 7 = 9 kg → (5 − 2) × 9 = 27' },
  { id: 'T1S2-A09', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'S', why: 'Tambah ungkapan algebra (perimeter)', m: 1,
    q: 'Sebuah segi tiga sama kaki mempunyai dua sisi yang sama panjang, iaitu (3<i>x</i> + <i>y</i>) cm, dan sisi ketiga (2<i>x</i> − 3<i>y</i>) cm. Hitung perimeter segi tiga itu, dalam cm.',
    qe: 'An isosceles triangle has two equal sides of (3<i>x</i> + <i>y</i>) cm and a third side of (2<i>x</i> − 3<i>y</i>) cm. Calculate the perimeter of the triangle, in cm.',
    pil: ['8<i>x</i> − <i>y</i>', '8<i>x</i> + 5<i>y</i>', '5<i>x</i> − 2<i>y</i>', '8<i>x</i> − 3<i>y</i>'], jaw: 'A', sk: '2(3<i>x</i> + <i>y</i>) + 2<i>x</i> − 3<i>y</i> = 8<i>x</i> − <i>y</i>' },
  { id: 'T1S2-A10', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Bahagi sebutan algebra', m: 1,
    q: 'Permudahkan FR(12<i>a</i>³<i>b</i>²|4<i>ab</i>).', qe: 'Simplify FR(12<i>a</i>³<i>b</i>²|4<i>ab</i>).',
    pil: ['3<i>a</i>²<i>b</i>', '3<i>a</i>³<i>b</i>²', '8<i>a</i>²<i>b</i>', '3<i>ab</i>'], jaw: 'A' },
  { id: 'T1S2-A11', bhg: 'A', bab: 5, kon: 'Memahami', aras: 'R', why: 'Ciri persamaan linear dua pemboleh ubah', m: 1,
    q: 'Antara berikut, yang manakah persamaan linear dalam dua pemboleh ubah?', qe: 'Which of the following is a linear equation in two variables?',
    pil: ['<i>m</i>² − <i>n</i> = 3', '2<i>m</i> + 5 = 9', '3<i>m</i> = <i>n</i> − 4', '<i>mn</i> = 6'], jaw: 'C' },
  { id: 'T1S2-A12', bhg: 'A', bab: 5, kon: 'Menilai', aras: 'R', why: 'Semak kebenaran ketaksamaan', m: 1,
    q: 'Antara ketaksamaan berikut, yang manakah <b>tidak benar</b>?', qe: 'Which of the following inequalities is <b>not true</b>?',
    pil: ['−3 > −7', 'FR(1|3) < FR(1|5)', '0 > −0.2', '−1.5 < 1'], jaw: 'B', sk: 'FR(1|3) > FR(1|5)' },
  { id: 'T1S2-A13', bhg: 'A', bab: 6, kon: 'Memahami', aras: 'R', why: 'Kenal pasti sudut bertentang bucu', m: 1, fig: 'T1S2A13',
    q: 'Dalam rajah, tiga garis lurus bersilang di satu titik. Antara pasangan sudut berikut, yang manakah sudut bertentang bucu?', qe: 'In the diagram, three straight lines intersect at a point. Which of the following pairs of angles are vertically opposite angles?',
    pil: ['<i>a</i> dan <i>b</i>', '<i>b</i> dan <i>e</i>', '<i>c</i> dan <i>d</i>', '<i>a</i> dan <i>f</i>'], pe: ['<i>a</i> and <i>b</i>', '<i>b</i> and <i>e</i>', '<i>c</i> and <i>d</i>', '<i>a</i> and <i>f</i>'], jaw: 'B' },
  { id: 'T1S2-A14', bhg: 'A', bab: 6, kon: 'Menganalisis', aras: 'S', why: 'Sudut bertentang bucu sama, kemudian sudut pada garis lurus', m: 1,
    q: 'Garis lurus <i>AB</i> dan <i>CD</i> bersilang di <i>O</i>. Diberi ∠<i>AOC</i> = (2<i>x</i> + 10)° dan ∠<i>BOD</i> = (3<i>x</i> − 25)°. Hitung ∠<i>AOD</i>.',
    qe: 'The straight lines <i>AB</i> and <i>CD</i> intersect at <i>O</i>. Given ∠<i>AOC</i> = (2<i>x</i> + 10)° and ∠<i>BOD</i> = (3<i>x</i> − 25)°. Calculate ∠<i>AOD</i>.',
    pil: ['80°', '90°', '100°', '110°'], jaw: 'C', sk: '2<i>x</i> + 10 = 3<i>x</i> − 25 → <i>x</i> = 35; ∠<i>AOC</i> = 80° → ∠<i>AOD</i> = 100°' },
  { id: 'T1S2-A15', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'S', why: 'Sudut tapak segi tiga sama kaki dan sudut peluaran', m: 1,
    q: '<i>KLM</i> ialah sebuah segi tiga sama kaki dengan <i>KL</i> = <i>KM</i> dan ∠<i>LKM</i> = 48°. <i>LMN</i> ialah garis lurus. Hitung ∠<i>KMN</i>.',
    qe: '<i>KLM</i> is an isosceles triangle with <i>KL</i> = <i>KM</i> and ∠<i>LKM</i> = 48°. <i>LMN</i> is a straight line. Calculate ∠<i>KMN</i>.',
    pil: ['66°', '114°', '124°', '132°'], jaw: 'B', sk: '∠<i>KML</i> = FR(180° − 48°|2) = 66° → 180° − 66° = 114°' },
  { id: 'T1S2-A16', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'S', why: 'Pepenjuru segi empat sama membahagi dua sama sudut', m: 1,
    q: '<i>KLMN</i> ialah sebuah segi empat sama. Pepenjuru <i>LN</i> dilukis. <i>P</i> ialah titik pada <i>KN</i> dengan keadaan ∠<i>KLP</i> = 20°. Hitung ∠<i>PLN</i>.',
    qe: '<i>KLMN</i> is a square. The diagonal <i>LN</i> is drawn. <i>P</i> is a point on <i>KN</i> such that ∠<i>KLP</i> = 20°. Calculate ∠<i>PLN</i>.',
    pil: ['20°', '25°', '45°', '70°'], jaw: 'B', sk: '∠<i>KLN</i> = 45° → 45° − 20° = 25°' },
  { id: 'T1S2-A17', bhg: 'A', bab: 7, kon: 'Mengaplikasi', aras: 'S', why: 'Kerja songsang luas trapezium', m: 1,
    q: 'Sebuah trapezium mempunyai sisi selari <i>x</i> cm dan 12 cm, dengan tinggi 7 cm. Luas trapezium itu ialah 105 cm². Hitung nilai <i>x</i>.',
    qe: 'A trapezium has parallel sides of <i>x</i> cm and 12 cm, with a height of 7 cm. The area of the trapezium is 105 cm². Calculate the value of <i>x</i>.',
    pil: ['15', '16', '18', '21'], jaw: 'C', sk: 'FR(1|2)(<i>x</i> + 12)(7) = 105 → <i>x</i> + 12 = 30 → <i>x</i> = 18' },
  { id: 'T1S2-A18', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'S', why: 'GSTK tiga nombor', m: 1,
    q: 'Cari gandaan sepunya terkecil (GSTK) bagi 6, 8 dan 12.', qe: 'Find the lowest common multiple (LCM) of 6, 8 and 12.',
    pil: ['2', '24', '48', '96'], jaw: 'B' },
  { id: 'T1S2-A19', bhg: 'A', bab: 8, kon: 'Mengaplikasi', aras: 'S', why: 'Tafsir sudut sektor carta pai', m: 1,
    q: 'Dalam sebuah carta pai yang mewakili 300 orang pengunjung sebuah taman tema, sektor bagi kanak-kanak bersudut 132°. Hitung bilangan kanak-kanak yang mengunjungi taman tema itu.',
    qe: 'In a pie chart representing 300 visitors to a theme park, the sector for children has an angle of 132°. Calculate the number of children who visited the theme park.',
    pil: ['100', '110', '132', '150'], jaw: 'B', sk: 'FR(132°|360°) × 300 = 110' },
  { id: 'T1S2-A20', bhg: 'A', bab: 7, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Teorem Pythagoras dua langkah', m: 1, fig: 'T1S2A20',
    q: 'Rajah menunjukkan gabungan dua segi tiga bersudut tegak, <i>ABC</i> dan <i>ACD</i>. Hitung perimeter, dalam cm, seluruh rajah itu.', qe: 'The diagram shows a combination of two right-angled triangles, <i>ABC</i> and <i>ACD</i>. Calculate the perimeter, in cm, of the whole diagram.',
    pil: ['44', '46', '52', '61'], jaw: 'B', sk: '<i>AC</i> = RT(9² + 12²) = 15; <i>AD</i> = RT(15² + 8²) = 17<br>9 + 12 + 8 + 17 = 46' },

  // ---------------- SET 2 · BAHAGIAN B ----------------
  { id: 'T1S2-B01', bhg: 'B', bab: 2, babs: [2, 4], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Memahami', q: 'Bulatkan gandaan sepunya bagi 4 dan 6.', qe: 'Circle the common multiple of 4 and 6.',
      items: [{ t: 'CH(18|24|30)', a: '24' }, { t: 'CH(36|42|52)', a: '36' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'R', kon: 'Memahami', q: 'Nyatakan bilangan sebutan bagi setiap ungkapan algebra.', qe: 'State the number of terms in each algebraic expression.',
      items: [{ t: '3<i>pq</i> − 5 + 2<i>p</i>²: __________', a: '3' }, { t: 'FR(<i>x</i>|2) + 4<i>xy</i> − <i>y</i> + 7: __________', a: '4' }] }] },
  { id: 'T1S2-B02', bhg: 'B', bab: 1, babs: [1, 7], parts: [
    { l: '(a)', jenis: 'isi', m: 2, aras: 'R', kon: 'Memahami', q: 'Tulis simbol ‘<’ atau ‘>’ untuk membentuk pernyataan yang benar.', qe: 'Write the symbol ‘<’ or ‘>’ to form a true statement.',
      items: [{ t: '−6.4 ____ −4.6', a: '<' }, { t: '1.2 m ____ 95 cm', a: '>' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Menganalisis', q: 'Tandakan (✓) bagi segi tiga bersudut tegak berdasarkan panjang sisinya.', qe: 'Tick (✓) the right-angled triangles based on the lengths of their sides.',
      items: [{ t: '6 cm, 8 cm, 10 cm', a: '✓' }, { t: '5 cm, 6 cm, 8 cm', a: '' }, { t: '9 cm, 12 cm, 15 cm', a: '✓' }, { t: '4 cm, 5 cm, 7 cm', a: '' }], sk: 'Semak akas teorem Pythagoras: 6² + 8² = 10², 9² + 12² = 15²' }] },
  { id: 'T1S2-B03', bhg: 'B', bab: 6, parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'R', kon: 'Memahami', q: 'Tulis <b>Benar</b> atau <b>Palsu</b>.', qe: 'Write <b>True</b> or <b>False</b>.',
      items: [{ t: 'Hasil tambah sudut di sekitar satu titik ialah 360°.', te: 'The sum of angles around a point is 360°.', a: 'Benar' }, { t: '35° dan 55° ialah sudut penggenap.', te: '35° and 55° are supplementary angles.', a: 'Palsu' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: '<i>ABC</i> ialah garis lurus. ∠<i>ABD</i> = 3<i>p</i> dan ∠<i>DBC</i> = <i>p</i> + 20°. <i>p</i> = __________', te: '<i>ABC</i> is a straight line. ∠<i>ABD</i> = 3<i>p</i> and ∠<i>DBC</i> = <i>p</i> + 20°. <i>p</i> = __________', a: '40°' },
        { t: 'Sudut di sekitar satu titik ialah 2<i>q</i>, 110° dan 3<i>q</i>. <i>q</i> = __________', te: 'The angles around a point are 2<i>q</i>, 110° and 3<i>q</i>. <i>q</i> = __________', a: '50°' }] }] },
  { id: 'T1S2-B04', bhg: 'B', bab: 5, babs: [5, 6], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Bulatkan nilai <i>x</i> bagi setiap persamaan.', qe: 'Circle the value of <i>x</i> for each equation.',
      items: [{ t: 'FR(<i>x</i> + 3|4) = 6: CH(18|21|27)', a: '21' }, { t: '5<i>x</i> − 7 = 18: CH(3|5|7)', a: '5' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Garis lurus <i>AB</i> dan <i>CD</i> bersilang di <i>O</i>. Diberi ∠<i>AOC</i> = 3<i>p</i>, ∠<i>BOD</i> = 75° dan ∠<i>AOD</i> = <i>q</i>. Isi tempat kosong.',
      qe: 'The straight lines <i>AB</i> and <i>CD</i> intersect at <i>O</i>. Given ∠<i>AOC</i> = 3<i>p</i>, ∠<i>BOD</i> = 75° and ∠<i>AOD</i> = <i>q</i>. Fill in the blanks.',
      items: [{ t: '<i>p</i> = __________', a: '25°' }, { t: '<i>q</i> = __________', a: '105°' }] }] },
  { id: 'T1S2-B05', bhg: 'B', bab: 3, q: 'Amir, Bala dan Chen menderma wang kepada sebuah rumah kebajikan mengikut nisbah 3 : 5 : 8. Chen menderma RM480.',
    qe: 'Amir, Bala and Chen donate money to a welfare home in the ratio 3 : 5 : 8. Chen donates RM480.', parts: [
    { l: '', jenis: 'bp', m: 4, aras: 'S', kon: 'Menganalisis', q: 'Tulis <b>Benar</b> atau <b>Palsu</b> bagi setiap pernyataan.', qe: 'Write <b>True</b> or <b>False</b> for each statement.',
      items: [{ t: 'Amir menderma RM180.', te: 'Amir donates RM180.', a: 'Benar' }, { t: 'Beza antara derma Chen dan Bala ialah RM200.', te: 'The difference between the donations of Chen and Bala is RM200.', a: 'Palsu' },
        { t: 'Derma Chen ialah 50% daripada jumlah derma.', te: 'Chen\'s donation is 50% of the total.', a: 'Benar' }, { t: 'Jumlah derma mereka bertiga ialah RM960.', te: 'The total donation of the three of them is RM960.', a: 'Benar' }],
      sk: '1 bahagian = 480 ÷ 8 = RM60; Amir 180, Bala 300, beza Chen − Bala = 180, jumlah 960' }] },

  // ---------------- SET 2 · BAHAGIAN C ----------------
  { id: 'T1S2-C01', bhg: 'C', bab: 1, babs: [1, 7], parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Lima keping kad nombor ialah: −3.8, 1.25, 0.6, −7.2, 5.9<br>(i) Nyatakan nombor yang terkecil.<br>(ii) Susun nombor-nombor itu dalam tertib menurun.<br>(iii) Hitung hasil tambah nombor terkecil dan nombor terbesar.',
      qe: 'Five number cards are: −3.8, 1.25, 0.6, −7.2, 5.9<br>(i) State the smallest number.<br>(ii) Arrange the numbers in descending order.<br>(iii) Calculate the sum of the smallest and the largest numbers.',
      sk: '(i) −7.2 <b>P1</b><br>(ii) 5.9, 1.25, 0.6, −3.8, −7.2 <b>P1</b><br>(iii) −7.2 + 5.9 <b>K1</b> = −1.3 <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung (−15 + 6) + 9 × (−3).', qe: 'Calculate (−15 + 6) + 9 × (−3).', sk: '−9 + (−27) <b>K1</b> = −36 <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Menganalisis', fig: 'T1S2C01', q: 'Rajah menunjukkan sebuah segi tiga bersudut tegak <i>ABC</i> dan sebuah segi empat sama <i>BDEF</i> bersisi <i>y</i> cm. Luas kawasan berlorek ialah 32 cm². Hitung nilai <i>y</i>.',
      qe: 'The diagram shows a right-angled triangle <i>ABC</i> and a square <i>BDEF</i> with sides of <i>y</i> cm. The area of the shaded region is 32 cm². Calculate the value of <i>y</i>.',
      sk: 'Luas segi tiga = FR(1|2) × 12 × 8 = 48 <b>K1</b><br>48 − <i>y</i>² = 32 <b>K1</b> → <i>y</i>² = 16 <b>K1</b><br><i>y</i> = 4 <b>N1</b>' }] },
  { id: 'T1S2-C02', bhg: 'C', bab: 2, babs: [1, 2, 3], parts: [
    { l: '(a)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: '(i) Senaraikan semua faktor sepunya bagi 18 dan 30.<br>(ii) Nyatakan FSTB bagi 18 dan 30.', qe: '(i) List all the common factors of 18 and 30.<br>(ii) State the HCF of 18 and 30.',
      sk: '(i) 1, 2, 3, 6 <b>P2</b><br>(ii) 6 <b>P2</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Menilai', q: 'Tentukan sama ada 196 ialah kuasa dua sempurna. Tunjukkan jalan kerja.', qe: 'Determine whether 196 is a perfect square. Show your working.',
      sk: '196 = 2 × 2 × 7 × 7 <b>K1</b> = (2 × 7) × (2 × 7) = 14 × 14 <b>K1</b><br>Ya, kuasa dua sempurna <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Diberi <i>a</i> : <i>b</i> = 3 : 2 dan <i>b</i> : <i>c</i> = 5 : 4. Cari <i>a</i> : <i>b</i> : <i>c</i>.', qe: 'Given <i>a</i> : <i>b</i> = 3 : 2 and <i>b</i> : <i>c</i> = 5 : 4. Find <i>a</i> : <i>b</i> : <i>c</i>.',
      sk: '<i>a</i> : <i>b</i> = 15 : 10 <b>K1</b>; <i>b</i> : <i>c</i> = 10 : 8 <b>K1</b><br>15 : 10 : 8 <b>N1</b>' }] },
  { id: 'T1S2-C03', bhg: 'C', bab: 5, babs: [4, 5], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Selesaikan.<br>(i) <i>y</i> − 7 = 15<br>(ii) FR(<i>p</i>|5) = −3', qe: 'Solve.<br>(i) <i>y</i> − 7 = 15<br>(ii) FR(<i>p</i>|5) = −3', sk: '(i) <i>y</i> = 22 <b>N1</b><br>(ii) <i>p</i> = −15 <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: 'Ringkaskan 3(2<i>m</i> − <i>n</i>) − 2(<i>m</i> − 4<i>n</i>).', qe: 'Simplify 3(2<i>m</i> − <i>n</i>) − 2(<i>m</i> − 4<i>n</i>).',
      sk: '6<i>m</i> − 3<i>n</i> <b>K1</b> − 2<i>m</i> + 8<i>n</i> <b>K1</b><br>Kumpul sebutan serupa <b>K1</b>; 4<i>m</i> + 5<i>n</i> <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Hani membeli sebuah buku nota dan 3 batang pensel dengan harga RM7.50. Ivy membeli sebuah buku nota dan 7 batang pensel yang sama jenis dengan harga RM11.50. Berapakah harga sebuah buku nota itu?',
      qe: 'Hani buys a notebook and 3 pencils for RM7.50. Ivy buys a notebook and 7 pencils of the same type for RM11.50. What is the price of one notebook?',
      sk: 'Beza: 4 batang pensel = RM4.00 <b>K1</b> → sebatang = RM1.00 <b>K1</b><br>Buku nota = 7.50 − 3(1.00) <b>K1</b> = RM4.50 <b>N1</b>' }] },
  { id: 'T1S2-C04', bhg: 'C', bab: 6, babs: [5, 6, 7], parts: [
    { l: '(a)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: '(i) Tulis sifat akas bagi −15 < −6.<br>(ii) Selesaikan −3<i>p</i> + 7 ≤ 31.', qe: '(i) Write the converse property of −15 < −6.<br>(ii) Solve −3<i>p</i> + 7 ≤ 31.',
      sk: '(i) −6 > −15 <b>P1</b><br>(ii) −3<i>p</i> ≤ 24 <b>K1</b>; <i>p</i> ≥ −8 <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', fig: 'T1S2C04b', q: 'Dalam rajah, <i>AB</i>, <i>CD</i> dan <i>EF</i> ialah garis lurus yang bersilang di <i>O</i>. Hitung nilai <i>p</i>, <i>q</i> dan <i>r</i>.',
      qe: 'In the diagram, <i>AB</i>, <i>CD</i> and <i>EF</i> are straight lines intersecting at <i>O</i>. Calculate the values of <i>p</i>, <i>q</i> and <i>r</i>.',
      sk: '<i>p</i> = 50° (bertentang bucu dengan ∠<i>AOC</i>) <b>N1</b><br><i>q</i> = 70° (bertentang bucu dengan ∠<i>COE</i>) <b>N1</b><br><i>r</i> = 180° − 50° − 70° = 60° <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', fig: 'T1S2C04c', q: 'Dalam rajah, <i>ABCD</i> dan <i>BEFG</i> ialah segi empat sama. <i>A</i>, <i>B</i> dan <i>E</i> terletak pada satu garis lurus. Perimeter <i>ABCD</i> ialah 28 cm dan <i>AE</i> = 16 cm. Hitung luas, dalam cm², seluruh rajah itu.',
      qe: 'In the diagram, <i>ABCD</i> and <i>BEFG</i> are squares. <i>A</i>, <i>B</i> and <i>E</i> lie on a straight line. The perimeter of <i>ABCD</i> is 28 cm and <i>AE</i> = 16 cm. Calculate the area, in cm², of the whole diagram.',
      sk: '<i>AB</i> = 7 cm <b>K1</b>; <i>BE</i> = 9 cm <b>K1</b><br>7² + 9² <b>K1</b> = 130 cm² <b>N1</b>' }] },
  { id: 'T1S2-C05', bhg: 'C', bab: 7, babs: [1, 2, 7], parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: '(i) Senaraikan semua gandaan 6 antara 40 dan 70.<br>(ii) Adakah semua nombor 1, 4, 9 dan 18 kuasa dua sempurna? Berikan sebab.', qe: '(i) List all the multiples of 6 between 40 and 70.<br>(ii) Are all the numbers 1, 4, 9 and 18 perfect squares? Give a reason.',
      sk: '(i) 42, 48, 54, 60, 66 <b>P1</b><br>(ii) Tidak <b>P1</b>; 18 bukan kuasa dua sempurna kerana tiada nombor bulat yang apabila dikuasaduakan memberi 18 <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'R', kon: 'Memahami', q: '<i>ABC</i> ialah sebuah segi tiga dan <i>BCD</i> ialah garis lurus. ∠<i>BAC</i> = <i>p</i>, ∠<i>ABC</i> = <i>q</i>, ∠<i>ACB</i> = <i>r</i> dan ∠<i>ACD</i> = <i>s</i> = 118°. Cari nilai<br>(i) <i>r</i> + <i>s</i>, &nbsp; (ii) <i>p</i> + <i>q</i> + <i>r</i>, &nbsp; (iii) <i>p</i> + <i>q</i>.',
      qe: '<i>ABC</i> is a triangle and <i>BCD</i> is a straight line. ∠<i>BAC</i> = <i>p</i>, ∠<i>ABC</i> = <i>q</i>, ∠<i>ACB</i> = <i>r</i> and ∠<i>ACD</i> = <i>s</i> = 118°. Find the value of<br>(i) <i>r</i> + <i>s</i>, &nbsp; (ii) <i>p</i> + <i>q</i> + <i>r</i>, &nbsp; (iii) <i>p</i> + <i>q</i>.',
      sk: '(i) 180° <b>P1</b> (ii) 180° <b>P1</b> (iii) 118° <b>P1</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: '<i>KLMN</i> ialah sebuah sisi empat dengan sudut pedalaman <i>x</i>, 2<i>x</i>, 100° dan (3<i>x</i> + 20°). Hitung nilai <i>x</i>.', qe: '<i>KLMN</i> is a quadrilateral with interior angles <i>x</i>, 2<i>x</i>, 100° and (3<i>x</i> + 20°). Calculate the value of <i>x</i>.',
      sk: '<i>x</i> + 2<i>x</i> + 100° + 3<i>x</i> + 20° = 360° <b>K1 K1</b><br>6<i>x</i> = 240° <b>K1</b>; <i>x</i> = 40° <b>N1</b>' }] },
  { id: 'T1S2-C06', bhg: 'C', bab: 8, babs: [7, 8], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Sebuah segi tiga bersudut tegak mempunyai hipotenus 25 cm dan satu sisi 7 cm. Hitung panjang sisi ketiga, <i>x</i> cm.', qe: 'A right-angled triangle has a hypotenuse of 25 cm and a side of 7 cm. Calculate the length of the third side, <i>x</i> cm.',
      sk: 'RT(25² − 7²) <b>K1</b> = 24 <b>N1</b>' },
    { l: '(b)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Data berikut menunjukkan bilangan adik-beradik bagi 21 orang murid.<br>3 &nbsp;1 &nbsp;2 &nbsp;4 &nbsp;2 &nbsp;3 &nbsp;2<br>1 &nbsp;2 &nbsp;3 &nbsp;3 &nbsp;2 &nbsp;4 &nbsp;2<br>2 &nbsp;4 &nbsp;1 &nbsp;2 &nbsp;3 &nbsp;2 &nbsp;3<br>Lengkapkan jadual kekerapan.',
      qe: 'The data shows the number of siblings of 21 pupils.<br>Complete the frequency table.',
      jadual: { r: [['Bilangan adik-beradik', '1', '2', '3', '4'], ['Gundalan', '?', '?', '?', '?'], ['Kekerapan', '?', '?', '?', '?']], re: ['Number of siblings', 'Tally', 'Frequency'] },
      sk: 'Kekerapan: 3, 9, 6, 3 <b>P4</b>' },
    { l: '(c)', m: 4, aras: 'S', kon: 'Mengaplikasi', q: '(i) Jadual menunjukkan wang simpanan seminggu bagi sekumpulan murid. Tentukan peratusan murid yang menyimpan kurang daripada RM20.<br>(ii) Data berikut menunjukkan jisim, dalam kg, 15 orang murid. Bina satu plot batang-dan-daun.<br>37 &nbsp;42 &nbsp;45 &nbsp;38 &nbsp;51 &nbsp;43 &nbsp;49 &nbsp;56 &nbsp;40 &nbsp;47 &nbsp;35 &nbsp;53 &nbsp;44 &nbsp;58 &nbsp;41',
      qe: '(i) The table shows the weekly savings of a group of pupils. Determine the percentage of pupils who save less than RM20.<br>(ii) The data shows the masses, in kg, of 15 pupils. Construct a stem-and-leaf plot.',
      jadual: { r: [['Simpanan (RM)', '10', '20', '30', '40'], ['Bilangan murid', '6', '9', '3', '2']], re: ['Savings (RM)', 'Number of pupils'] },
      sk: '(i) FR(6|20) × 100% <b>K1</b> = 30% <b>N1</b><br>(ii) 3 | 5 7 8; 4 | 0 1 2 3 4 5 7 9; 5 | 1 3 6 8 (kekunci 3 | 5 bermaksud 35 kg) <b>P2</b>' }] }
);
