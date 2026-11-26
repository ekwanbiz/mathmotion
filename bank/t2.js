'use strict';
/* =================== BANK SOALAN · TINGKATAN 2 (format UASA) ===================
   Set 1 (v135, 26 Nov 2026): 20 A · 5 B · 6 C, gaya kertas UASA/UPSA sebenar. Ditulis baharu oleh Mat.
   Dwibahasa: medan BI berakhir dengan "e" (qe, pe[], te, kanane[], jadual.re[]).
   A  : {bhg:'A', bab, kon, aras, why, kbat?, m:1, q, qe, fig?, pil[4], pe?[4], jaw, sk}
   B/C: {bhg, bab, babs?[], kbat?, q?, qe?, fig?, parts:[{l, q, qe, m, aras, kon, fig?, big?, ruang?, jadual?, sk?, ...}]}
        B part: jenis bp|tanda|bulat|garis|isi|pad|label|jadual, items[{t, te, a}], kanan?[] (padanan)
   Penanda teks: FR(a|b) pecahan · VC(a|b) vektor · RT(x) punca · CH(a|b|c) pilihan untuk bulat/garis.
   Aras ikut markah: R 50 · S 30 · T 20 (A 12/5/3 · B 10/6/4 · C 28/19/13). SP DSKP belum diisi. */

/* ---------- rajah: satah Cartes ringkas ---------- */
function bsGrid(o) {
  const s = o.s || 20, [x0, x1] = o.x, [y0, y1] = o.y, pd = 20, W = (x1 - x0) * s + pd * 2, H = (y1 - y0) * s + pd * 2;
  const X = x => pd + (x - x0) * s, Y = y => pd + (y1 - y) * s, F = 'font-family="Inter,sans-serif" fill="currentColor"';
  let g = '';
  for (let x = x0; x <= x1; x++) g += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}"/>`;
  for (let y = y0; y <= y1; y++) g += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}"/>`;
  let h = `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt || 'Satah Cartes'}"><g stroke="currentColor" stroke-opacity=".22" stroke-width="1">${g}</g>`;
  h += `<g stroke="currentColor" stroke-width="1.6"><line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1) + 10}" y2="${Y(0)}"/><line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1) - 10}"/></g><g ${F} font-size="10">`;
  for (let x = x0; x <= x1; x++) if (x) h += `<text x="${X(x)}" y="${Y(0) + 12}" text-anchor="middle">${x < 0 ? '−' + -x : x}</text>`;
  for (let y = y0; y <= y1; y++) if (y) h += `<text x="${X(0) - 4}" y="${Y(y) + 3.5}" text-anchor="end">${y < 0 ? '−' + -y : y}</text>`;
  h += `<text x="${X(0) - 4}" y="${Y(0) + 12}" text-anchor="end">O</text><text x="${X(x1) + 12}" y="${Y(0) + 4}" font-style="italic" font-size="12">x</text><text x="${X(0) + 5}" y="${Y(y1) - 8}" font-style="italic" font-size="12">y</text></g>`;
  (o.poly || []).forEach(p => {
    h += `<polygon points="${p.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' ')}" fill="currentColor" fill-opacity="${p.f == null ? .16 : p.f}" stroke="currentColor" stroke-width="1.8"${p.d ? ' stroke-dasharray="4 3"' : ''}/>`;
    if (p.l) h += `<text x="${X(p.at[0])}" y="${Y(p.at[1]) + 5}" text-anchor="middle" font-style="italic" font-size="14" ${F}>${p.l}</text>`;
  });
  (o.seg || []).forEach(l => { h += `<line x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(l[2])}" y2="${Y(l[3])}" stroke="currentColor" stroke-width="2"/>`; });
  (o.pt || []).forEach(p => { h += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" fill="currentColor"/>${p[2] ? `<text x="${X(p[0]) + (p[3] || 6)}" y="${Y(p[1]) - 6}" font-size="13" ${F}>${p[2]}</text>` : ''}`; });
  return h + '</svg>';
}
const BS_F = 'font-family="Inter,sans-serif" fill="currentColor"';
const BS_FIG = {
  A01: (() => { // corak titik segi tiga 1, 3, 6
    let h = `<svg viewBox="0 0 250 92" width="250" role="img" aria-label="Tiga corak titik: 1, 3 dan 6 titik"><g fill="currentColor">`;
    [[1, 20], [2, 80], [3, 160]].forEach(([n, x0]) => { for (let r = 0; r < n; r++) for (let c = 0; c <= r; c++) h += `<circle cx="${x0 + (c - r / 2) * 18}" cy="${16 + r * 18}" r="5"/>`; });
    return h + `</g><g ${BS_F} font-size="11" text-anchor="middle"><text x="20" y="86">Corak 1</text><text x="80" y="86">Corak 2</text><text x="160" y="86">Corak 3</text></g></svg>`;
  })(),
  A09: `<svg viewBox="30 0 150 172" width="150" role="img" aria-label="Pentagon sekata dan segi empat sama berkongsi sisi AB">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="80,100 140,100 158.5,42.9 110,7.6 61.5,42.9"/><polygon points="80,100 140,100 140,160 80,160"/>
    <path d="M75.7 86.7 A14 14 0 0 0 80 114" stroke-width="1.5"/></g>
    <g ${BS_F} font-size="13" font-style="italic"><text x="82" y="96">A</text><text x="143" y="96">B</text><text x="52" y="110">x</text></g></svg>`,
  A10: `<svg viewBox="0 0 180 170" width="180" role="img" aria-label="Bulatan berpusat O dengan satu kawasan dibatasi dua jejari dan lengkok berlorek">
    <path d="M90 85 L155 85 A65 65 0 0 1 57.5 141.3 Z" fill="currentColor" fill-opacity=".22"/>
    <g fill="none" stroke="currentColor" stroke-width="2"><circle cx="90" cy="85" r="65"/><line x1="90" y1="85" x2="155" y2="85"/><line x1="90" y1="85" x2="57.5" y2="141.3"/></g>
    <circle cx="90" cy="85" r="3" fill="currentColor"/><text x="78" y="80" font-style="italic" font-size="13" ${BS_F}>O</text></svg>`,
  A12: `<svg viewBox="0 0 170 190" width="150" role="img" aria-label="Bentangan: satu segi empat tepat dengan satu bulatan di atas dan satu di bawah">
    <g fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="2"><rect x="20" y="58" width="130" height="74"/><circle cx="85" cy="33" r="25"/><circle cx="85" cy="157" r="25"/></g></svg>`,
  A14: bsGrid({ x: [-4, 4], y: [-3, 3], pt: [[-3, 2, '<tspan font-style="italic">P</tspan>']], alt: 'Satah Cartes dengan titik P' }),
  A17: bsGrid({ x: [-1, 4], y: [-1, 6], seg: [[-0.5, 0, 2.5, 6]], pt: [[0, 1, '(0, 1)', 8], [2, 5, '(2, 5)', 8]], alt: 'Garis lurus melalui (0, 1) dan (2, 5)' }),
  A18: bsGrid({ x: [-4, 4], y: [-2, 4], poly: [{ p: [[-3, 1], [-1, 1], [-3, 3]], l: 'P', at: [-2.4, 1.5] }, { p: [[1, -1], [3, -1], [1, 1]], l: 'Q', at: [1.6, -0.5] }], alt: 'Segi tiga P dan imejnya Q' }),
  B05: `<div class="kd" role="img" aria-label="Lapan keping kad bernombor 1 hingga 8">${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<span>${n}</span>`).join('')}</div>`,
  C03b: `<svg viewBox="0 0 200 180" width="190" role="img" aria-label="Heksagon sekata ABCDEF dengan garis AC dan AE">
    <g fill="none" stroke="currentColor" stroke-width="2"><polygon points="60,160 140,160 180,90.7 140,21.4 60,21.4 20,90.7"/><line x1="60" y1="160" x2="180" y2="90.7"/></g>
    <g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M80 160 A20 20 0 0 0 77.3 150"/><path d="M79.05 149 A22 22 0 0 0 60 138"/></g>
    <g ${BS_F} font-size="13" font-style="italic"><text x="50" y="174">A</text><text x="142" y="174">B</text><text x="184" y="94">C</text><text x="142" y="16">D</text><text x="46" y="16">E</text><text x="6" y="94">F</text>
    <text x="86" y="154">x</text><text x="67" y="141">y</text></g><line x1="60" y1="160" x2="60" y2="21.4" stroke="currentColor" stroke-width="2"/></svg>`,
  C03c: `<svg viewBox="0 0 300 130" width="280" role="img" aria-label="Trek larian: dua garis lurus 100 m dan dua semibulatan berdiameter 63 m">
    <path d="M90 20 H210 A45 45 0 0 1 210 110 H90 A45 45 0 0 1 90 20 Z" fill="currentColor" fill-opacity=".08" stroke="currentColor" stroke-width="2.4"/>
    <g stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"><line x1="90" y1="20" x2="90" y2="110"/><line x1="210" y1="20" x2="210" y2="110"/></g>
    <g ${BS_F} font-size="12" text-anchor="middle"><text x="150" y="14">100 m</text><text x="150" y="70">63 m</text></g>
    <line x1="96" y1="65" x2="132" y2="65" stroke="currentColor"/><line x1="168" y1="65" x2="204" y2="65" stroke="currentColor"/></svg>`,
  C05b: bsGrid({ x: [-2, 4], y: [-5, 6], s: 22, alt: 'Kertas graf kosong' }),
  C06: bsGrid({ x: [-5, 6], y: [-4, 5], poly: [
    { p: [[1, 1], [3, 1], [1, 3]], l: 'P', at: [1.6, 1.5] },
    { p: [[-4, 2], [-2, 2], [-2, 4]], l: 'Q', at: [-2.6, 2.5] },
    { p: [[-4, 0], [-2, 0], [-2, -2]], l: 'Q′', at: [-2.6, -0.9], f: .05 }], alt: 'Objek P, objek Q dan imej Q′' })
};

const BS_T2 = [
  // ---------------- BAHAGIAN A ----------------
  { id: 'T2-A01', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'R', why: 'Lanjutkan pola daripada rajah, lazim', m: 1, fig: 'A01',
    q: 'Rajah menunjukkan tiga corak pertama bagi satu susunan titik. Berapakah bilangan titik dalam corak ke-5?',
    qe: 'The diagram shows the first three patterns of an arrangement of dots. How many dots are there in the 5th pattern?',
    pil: ['10', '12', '15', '21'], jaw: 'C', sk: '1, 3, 6, 10, <b>15</b> (tambah 2, 3, 4, 5)' },
  { id: 'T2-A02', bhg: 'A', bab: 1, kon: 'Mengaplikasi', aras: 'S', why: 'Kerja songsang daripada sebutan ke-n', m: 1,
    q: 'Sebutan ke-<i>n</i> bagi suatu jujukan ialah 4<i>n</i> − 1. Sebutan yang keberapakah mempunyai nilai 39?',
    qe: 'The <i>n</i>th term of a sequence is 4<i>n</i> − 1. Which term has a value of 39?',
    pil: ['Ke-9', 'Ke-10', 'Ke-11', 'Ke-155'], pe: ['9th', '10th', '11th', '155th'], jaw: 'B', sk: '4<i>n</i> − 1 = 39 → <i>n</i> = 10' },
  { id: 'T2-A03', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Kembangan dua ungkapan, lazim', m: 1,
    q: 'Kembangkan (<i>x</i> + 3)(<i>x</i> − 2).', qe: 'Expand (<i>x</i> + 3)(<i>x</i> − 2).',
    pil: ['<i>x</i>² + <i>x</i> − 6', '<i>x</i>² − <i>x</i> − 6', '<i>x</i>² + 5<i>x</i> − 6', '<i>x</i>² + <i>x</i> + 6'], jaw: 'A',
    sk: '<i>x</i>² − 2<i>x</i> + 3<i>x</i> − 6 = <i>x</i>² + <i>x</i> − 6' },
  { id: 'T2-A04', bhg: 'A', bab: 2, kon: 'Menganalisis', aras: 'S', why: 'Soalan negatif; perlu faktorkan dahulu', m: 1,
    q: 'Antara berikut, yang manakah <b>bukan</b> faktor bagi 6<i>x</i>² − 12<i>x</i>?', qe: 'Which of the following is <b>not</b> a factor of 6<i>x</i>² − 12<i>x</i>?',
    pil: ['6', '<i>x</i>', '<i>x</i> − 2', '<i>x</i> + 2'], jaw: 'D', sk: '6<i>x</i>² − 12<i>x</i> = 6<i>x</i>(<i>x</i> − 2)' },
  { id: 'T2-A05', bhg: 'A', bab: 2, kon: 'Mengaplikasi', aras: 'R', why: 'Permudah pecahan algebra satu sebutan', m: 1,
    q: 'Permudahkan FR(8<i>pq</i>|12<i>p</i>²).', qe: 'Simplify FR(8<i>pq</i>|12<i>p</i>²).',
    pil: ['FR(2<i>q</i>|3<i>p</i>)', 'FR(2<i>q</i>|3)', 'FR(2|3<i>p</i>)', 'FR(<i>q</i>|4<i>p</i>)'], jaw: 'A', sk: 'Bahagi pengangka dan penyebut dengan 4<i>p</i>' },
  { id: 'T2-A06', bhg: 'A', bab: 3, kon: 'Memahami', aras: 'R', why: 'Bina rumus daripada situasi lazim', m: 1,
    q: 'Harga sekeping tiket dewasa ialah RM<i>d</i> dan harga sekeping tiket kanak-kanak ialah RM<i>k</i>. Puan Lim membeli 2 keping tiket dewasa dan 3 keping tiket kanak-kanak. Tulis rumus bagi jumlah bayaran, RM<i>J</i>.',
    qe: 'The price of an adult ticket is RM<i>d</i> and the price of a child ticket is RM<i>k</i>. Puan Lim buys 2 adult tickets and 3 child tickets. Write a formula for the total payment, RM<i>J</i>.',
    pil: ['<i>J</i> = 5<i>dk</i>', '<i>J</i> = 2<i>d</i> + 3<i>k</i>', '<i>J</i> = 3<i>d</i> + 2<i>k</i>', '<i>J</i> = 5(<i>d</i> + <i>k</i>)'], jaw: 'B' },
  { id: 'T2-A07', bhg: 'A', bab: 3, kon: 'Mengaplikasi', aras: 'S', why: 'Dua langkah tukar perkara rumus', m: 1,
    q: 'Diberi FR(2<i>a</i>|<i>b</i>) = <i>c</i>, ungkapkan <i>b</i> dalam sebutan <i>a</i> dan <i>c</i>.', qe: 'Given FR(2<i>a</i>|<i>b</i>) = <i>c</i>, express <i>b</i> in terms of <i>a</i> and <i>c</i>.',
    pil: ['<i>b</i> = 2<i>ac</i>', '<i>b</i> = FR(<i>c</i>|2<i>a</i>)', '<i>b</i> = FR(2<i>a</i>|<i>c</i>)', '<i>b</i> = 2<i>a</i> − <i>c</i>'], jaw: 'C',
    sk: '2<i>a</i> = <i>bc</i> → <i>b</i> = FR(2<i>a</i>|<i>c</i>)' },
  { id: 'T2-A08', bhg: 'A', bab: 4, kon: 'Mengaplikasi', aras: 'R', why: 'Satu langkah, rumus sudut peluaran', m: 1,
    q: 'Setiap sudut peluaran sebuah poligon sekata ialah 40°. Berapakah bilangan sisi poligon itu?', qe: 'Each exterior angle of a regular polygon is 40°. How many sides does the polygon have?',
    pil: ['6', '8', '9', '10'], jaw: 'C', sk: 'FR(360°|40°) = 9' },
  { id: 'T2-A09', bhg: 'A', bab: 4, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Gabung dua poligon, situasi tidak lazim', m: 1, fig: 'A09',
    q: 'Rajah menunjukkan sebuah pentagon sekata dan sebuah segi empat sama yang berkongsi sisi <i>AB</i>. Cari nilai <i>x</i>.',
    qe: 'The diagram shows a regular pentagon and a square sharing the side <i>AB</i>. Find the value of <i>x</i>.',
    pil: ['108°', '126°', '144°', '162°'], jaw: 'D', sk: 'Sudut pedalaman pentagon = 108°<br><i>x</i> = 360° − 108° − 90° = 162°' },
  { id: 'T2-A10', bhg: 'A', bab: 5, kon: 'Mengingat', aras: 'R', why: 'Istilah asas bulatan', m: 1, fig: 'A10',
    q: 'Rajah menunjukkan sebuah bulatan berpusat <i>O</i>. Apakah nama kawasan yang berlorek?', qe: 'The diagram shows a circle with centre <i>O</i>. What is the name of the shaded region?',
    pil: ['Tembereng', 'Sektor', 'Lengkok', 'Perentas'], pe: ['Segment', 'Sector', 'Arc', 'Chord'], jaw: 'B' },
  { id: 'T2-A11', bhg: 'A', bab: 5, kon: 'Mengaplikasi', aras: 'S', why: 'Lilitan dalam konteks, tukar unit', m: 1,
    q: 'Diameter sebuah roda basikal ialah 70 cm. Hitung jarak, dalam m, yang dilalui oleh roda itu apabila ia berputar 50 kali lengkap. (Guna π = FR(22|7))',
    qe: 'The diameter of a bicycle wheel is 70 cm. Calculate the distance, in m, travelled by the wheel when it makes 50 complete turns. (Use π = FR(22|7))',
    pil: ['55 m', '110 m', '220 m', '1 100 m'], jaw: 'B', sk: 'Lilitan = FR(22|7) × 70 = 220 cm<br>220 × 50 = 11 000 cm = 110 m' },
  { id: 'T2-A12', bhg: 'A', bab: 6, kon: 'Memahami', aras: 'R', why: 'Kenal bentangan lazim', m: 1, fig: 'A12',
    q: 'Rajah menunjukkan bentangan bagi sebuah bentuk tiga dimensi. Namakan bentuk itu.', qe: 'The diagram shows the net of a three-dimensional shape. Name the shape.',
    pil: ['Kon', 'Silinder', 'Prisma', 'Sfera'], pe: ['Cone', 'Cylinder', 'Prism', 'Sphere'], jaw: 'B' },
  { id: 'T2-A13', bhg: 'A', bab: 6, kon: 'Mengaplikasi', aras: 'S', why: 'Isi padu dan tukar unit ke liter', m: 1,
    q: 'Sebuah tangki air berbentuk kuboid berukuran 50 cm × 40 cm × 30 cm. Berapakah isi padu tangki itu, dalam liter?',
    qe: 'A cuboid-shaped water tank measures 50 cm × 40 cm × 30 cm. What is the volume of the tank, in litres?',
    pil: ['6', '60', '600', '60 000'], jaw: 'B', sk: '50 × 40 × 30 = 60 000 cm³ = 60 liter' },
  { id: 'T2-A14', bhg: 'A', bab: 7, kon: 'Mengingat', aras: 'R', why: 'Baca koordinat terus', m: 1, fig: 'A14',
    q: 'Rajah menunjukkan titik <i>P</i> pada satah Cartes. Nyatakan koordinat <i>P</i>.', qe: 'The diagram shows point <i>P</i> on a Cartesian plane. State the coordinates of <i>P</i>.',
    pil: ['(2, −3)', '(−3, 2)', '(3, −2)', '(−2, 3)'], jaw: 'B' },
  { id: 'T2-A15', bhg: 'A', bab: 8, kon: 'Mengaplikasi', aras: 'R', why: 'Gantian nilai ke dalam fungsi', m: 1,
    q: 'Antara titik berikut, yang manakah terletak pada graf <i>y</i> = <i>x</i>² − 1?', qe: 'Which of the following points lies on the graph of <i>y</i> = <i>x</i>² − 1?',
    pil: ['(1, 1)', '(2, 3)', '(3, 6)', '(−2, 5)'], jaw: 'B', sk: '2² − 1 = 3' },
  { id: 'T2-A16', bhg: 'A', bab: 9, kon: 'Mengaplikasi', aras: 'R', why: 'Rumus pecutan terus', m: 1,
    q: 'Laju sebuah kereta bertambah daripada 20 m/s kepada 50 m/s dalam masa 6 saat. Hitung pecutan kereta itu.',
    qe: 'The speed of a car increases from 20 m/s to 50 m/s in 6 seconds. Calculate the acceleration of the car.',
    pil: ['3 m/s²', '5 m/s²', '8 m/s²', '30 m/s²'], jaw: 'B', sk: 'FR(50 − 20|6) = 5 m/s²' },
  { id: 'T2-A17', bhg: 'A', bab: 10, kon: 'Mengaplikasi', aras: 'R', why: 'Kecerunan daripada dua titik pada graf', m: 1, fig: 'A17',
    q: 'Rajah menunjukkan garis lurus yang melalui titik (0, 1) dan (2, 5). Apakah kecerunan garis lurus itu?',
    qe: 'The diagram shows a straight line passing through the points (0, 1) and (2, 5). What is the gradient of the straight line?',
    pil: ['−2', 'FR(1|2)', '2', '4'], jaw: 'C', sk: 'FR(5 − 1|2 − 0) = 2' },
  { id: 'T2-A18', bhg: 'A', bab: 11, kon: 'Memahami', aras: 'R', why: 'Baca translasi daripada grid', m: 1, fig: 'A18',
    q: 'Dalam rajah, <i>Q</i> ialah imej bagi <i>P</i> di bawah satu translasi. Nyatakan translasi itu.', qe: 'In the diagram, <i>Q</i> is the image of <i>P</i> under a translation. State the translation.',
    pil: ['VC(4|−2)', 'VC(−4|2)', 'VC(4|2)', 'VC(−2|4)'], jaw: 'A' },
  { id: 'T2-A19', bhg: 'A', bab: 12, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Kerja songsang min, dua set data', m: 1,
    q: 'Min bagi empat nombor ialah 7. Apabila satu nombor <i>x</i> ditambah, min bagi lima nombor itu menjadi 8. Cari nilai <i>x</i>.',
    qe: 'The mean of four numbers is 7. When a number <i>x</i> is added, the mean of the five numbers becomes 8. Find the value of <i>x</i>.',
    pil: ['8', '9', '12', '15'], jaw: 'C', sk: '5 × 8 − 4 × 7 = 40 − 28 = 12' },
  { id: 'T2-A20', bhg: 'A', bab: 13, kon: 'Menganalisis', aras: 'T', kbat: true, why: 'Kerja songsang daripada kebarangkalian', m: 1,
    q: 'Sebuah kotak mengandungi 5 biji bola merah dan beberapa biji bola biru. Sebiji bola dipilih secara rawak. Kebarangkalian memilih bola merah ialah FR(1|3). Berapakah bilangan bola biru?',
    qe: 'A box contains 5 red balls and some blue balls. A ball is chosen at random. The probability of choosing a red ball is FR(1|3). How many blue balls are there?',
    pil: ['5', '10', '12', '15'], jaw: 'B', sk: 'Jumlah = 5 × 3 = 15 → biru = 15 − 5 = 10' },

  // ---------------- BAHAGIAN B ----------------
  { id: 'T2-B01', bhg: 'B', bab: 2, parts: [
    { l: '', jenis: 'pad', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Padankan setiap ungkapan dengan pemfaktorannya yang betul.', qe: 'Match each expression with its correct factorisation.',
      items: [{ t: '<i>x</i>² − 9', a: '(<i>x</i> − 3)(<i>x</i> + 3)' }, { t: '<i>x</i>² + 6<i>x</i> + 9', a: '(<i>x</i> + 3)²' }, { t: '3<i>x</i> − 9', a: '3(<i>x</i> − 3)' }, { t: '<i>x</i>² − 3<i>x</i>', a: '<i>x</i>(<i>x</i> − 3)' }],
      kanan: ['3(<i>x</i> − 3)', '<i>x</i>(<i>x</i> − 3)', '(<i>x</i> − 3)(<i>x</i> + 3)', '(<i>x</i> + 3)²'] }] },
  { id: 'T2-B02', bhg: 'B', bab: 4, babs: [4, 5], parts: [
    { l: '(a)', jenis: 'bulat', m: 2, aras: 'R', kon: 'Mengingat', q: 'Bulatkan nama poligon yang betul.', qe: 'Circle the correct name of the polygon.',
      items: [{ t: 'Poligon dengan 5 sisi: CH(heksagon|pentagon|oktagon)', te: 'A polygon with 5 sides: CH(hexagon|pentagon|octagon)', a: 'pentagon' },
        { t: 'Poligon dengan 10 sisi: CH(nonagon|dekagon|dodekagon)', te: 'A polygon with 10 sides: CH(nonagon|decagon|dodecagon)', a: 'dekagon' }] },
    { l: '(b)', jenis: 'tanda', m: 2, aras: 'S', kon: 'Memahami', q: 'Tandakan (✓) bagi <b>dua</b> pernyataan yang benar tentang bulatan.', qe: 'Tick (✓) the <b>two</b> true statements about a circle.',
      items: [{ t: 'Diameter ialah dua kali panjang jejari.', te: 'The diameter is twice the length of the radius.', a: '✓' },
        { t: 'Perentas yang terpanjang ialah jejari.', te: 'The longest chord is the radius.', a: '' },
        { t: 'Lengkok ialah sebahagian daripada lilitan.', te: 'An arc is part of the circumference.', a: '✓' },
        { t: 'Sektor dibatasi oleh dua perentas.', te: 'A sector is bounded by two chords.', a: '' }] }] },
  { id: 'T2-B03', bhg: 'B', bab: 12,
    q: 'Data menunjukkan bilangan buku yang dibaca oleh 12 orang murid dalam sebulan.<br>2, &nbsp;3, &nbsp;1, &nbsp;2, &nbsp;4, &nbsp;2, &nbsp;3, &nbsp;1, &nbsp;2, &nbsp;3, &nbsp;2, &nbsp;4',
    qe: 'The data shows the number of books read by 12 pupils in a month.', parts: [
    { l: '(a)', jenis: 'jadual', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Lengkapkan jadual kekerapan di bawah.', qe: 'Complete the frequency table below.',
      jadual: { r: [['Bilangan buku', '1', '2', '3', '4'], ['Kekerapan', '?', '?', '?', '?']], re: ['Number of books', 'Frequency'] },
      items: [{ t: 'Kekerapan', a: '2, 5, 3, 2' }], sk: '2 markah: semua betul · 1 markah: dua atau tiga betul' },
    { l: '(b)', jenis: 'bulat', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Bulatkan jawapan yang betul.', qe: 'Circle the correct answer.',
      items: [{ t: 'Mod = CH(2|3|5)', te: 'Mode', a: '2' }, { t: 'Median = CH(2|2.5|3)', te: 'Median', a: '2' }] }] },
  { id: 'T2-B04', bhg: 'B', bab: 10, babs: [8, 10], parts: [
    { l: '(a)', jenis: 'garis', m: 2, aras: 'R', kon: 'Memahami', q: 'Gariskan jawapan yang betul bagi garis lurus <i>y</i> = 3<i>x</i> + 2.', qe: 'Underline the correct answer for the straight line <i>y</i> = 3<i>x</i> + 2.',
      items: [{ t: 'Kecerunan: CH(2|3|−3)', te: 'Gradient', a: '3' }, { t: 'Pintasan-<i>y</i>: CH(−2|2|3)', te: '<i>y</i>-intercept', a: '2' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'T', kon: 'Menganalisis', q: 'Isi tempat kosong dengan jawapan yang betul.', qe: 'Fill in the blanks with the correct answers.',
      items: [{ t: 'Garis lurus yang melalui (1, 4) dan (3, <i>k</i>) mempunyai kecerunan 2. Nilai <i>k</i> = __________', te: 'A straight line passing through (1, 4) and (3, <i>k</i>) has a gradient of 2. The value of <i>k</i> = __________', a: '8' },
        { t: 'Titik (<i>h</i>, 6) terletak pada graf <i>y</i> = <i>x</i>² − 3. Nilai positif <i>h</i> = __________', te: 'The point (<i>h</i>, 6) lies on the graph of <i>y</i> = <i>x</i>² − 3. The positive value of <i>h</i> = __________', a: '3' }] }] },
  { id: 'T2-B05', bhg: 'B', bab: 13, fig: 'B05',
    q: 'Lapan keping kad bernombor 1 hingga 8 dimasukkan ke dalam sebuah kotak. Sekeping kad dipilih secara rawak.',
    qe: 'Eight cards numbered 1 to 8 are put into a box. A card is chosen at random.', parts: [
    { l: '(a)', jenis: 'bp', m: 2, aras: 'S', kon: 'Memahami', q: 'Tulis <b>Benar</b> atau <b>Palsu</b> bagi setiap pernyataan.', qe: 'Write <b>True</b> or <b>False</b> for each statement.',
      items: [{ t: 'Kebarangkalian memilih kad nombor genap ialah FR(1|2).', te: 'The probability of choosing an even-numbered card is FR(1|2).', a: 'Benar' },
        { t: 'Kebarangkalian memilih kad nombor perdana ialah FR(3|8).', te: 'The probability of choosing a prime-numbered card is FR(3|8).', a: 'Palsu' }] },
    { l: '(b)', jenis: 'isi', m: 2, aras: 'T', kon: 'Menganalisis', q: 'Isi tempat kosong.', qe: 'Fill in the blanks.',
      items: [{ t: 'Kebarangkalian memilih kad gandaan 3 ialah __________', te: 'The probability of choosing a card that is a multiple of 3 is __________', a: 'FR(1|4)' },
        { t: 'Kad bernombor 8 dikeluarkan dari kotak itu. Kebarangkalian memilih kad nombor ganjil kini ialah __________', te: 'The card numbered 8 is removed from the box. The probability of choosing an odd-numbered card is now __________', a: 'FR(4|7)' }] }] },

  // ---------------- BAHAGIAN C ----------------
  { id: 'T2-C01', bhg: 'C', bab: 1, babs: [1, 3], kbat: true,
    q: 'Sebuah kedai menyusun kek cawan di atas rak mengikut baris. Baris pertama mempunyai 4 biji kek cawan, baris kedua 7 biji, baris ketiga 10 biji dan seterusnya.',
    qe: 'A shop arranges cupcakes on a shelf in rows. The first row has 4 cupcakes, the second row 7, the third row 10 and so on.', parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Tulis bilangan kek cawan pada baris keempat dan baris kelima.', qe: 'Write the number of cupcakes in the fourth and fifth rows.',
      sk: '13 <b>P1</b>, 16 <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Ungkapkan bilangan kek cawan pada baris ke-<i>n</i>, <i>T<sub>n</sub></i>, dalam sebutan <i>n</i>. Seterusnya, tentukan baris yang mempunyai 40 biji kek cawan.',
      qe: 'Express the number of cupcakes in the <i>n</i>th row, <i>T<sub>n</sub></i>, in terms of <i>n</i>. Hence, determine the row that has 40 cupcakes.',
      sk: '<i>T<sub>n</sub></i> = 3<i>n</i> + 1 <b>P1</b><br>3<i>n</i> + 1 = 40 <b>K1</b><br>Baris ke-13 <b>N1</b>' },
    { l: '(c)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Harga sebiji kek cawan ialah RM1.50. Tulis rumus bagi jumlah harga, RM<i>H</i>, bagi <i>k</i> biji kek cawan. Seterusnya, hitung jumlah harga semua kek cawan pada baris kelima.',
      qe: 'The price of a cupcake is RM1.50. Write a formula for the total price, RM<i>H</i>, of <i>k</i> cupcakes. Hence, calculate the total price of all the cupcakes in the fifth row.',
      sk: '<i>H</i> = 1.5<i>k</i> <b>P1</b><br>1.5 × 16 = RM24 <b>N1</b>' },
    { l: '(d)', m: 3, aras: 'T', kon: 'Menilai', q: 'Kedai itu mempunyai 150 biji kek cawan. Berapakah bilangan maksimum baris yang dapat disusun penuh? Tunjukkan kerja anda.',
      qe: 'The shop has 150 cupcakes. What is the maximum number of complete rows that can be arranged? Show your working.',
      sk: '4 + 7 + 10 + … + 25 = 116 (8 baris) <b>K1</b><br>116 + 28 = 144 ≤ 150 <b>K1</b><br>9 baris <b>N1</b>' }] },
  { id: 'T2-C02', bhg: 'C', bab: 2, babs: [2, 3], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Sebuah taman berbentuk segi empat tepat dengan panjang (<i>x</i> + 5) m dan lebar (<i>x</i> − 2) m. Ungkapkan luas taman itu dalam bentuk kembangan.',
      qe: 'A rectangular garden has a length of (<i>x</i> + 5) m and a width of (<i>x</i> − 2) m. Express the area of the garden in expanded form.',
      sk: '(<i>x</i> + 5)(<i>x</i> − 2) <b>K1</b><br><i>x</i>² + 3<i>x</i> − 10 <b>N1</b>' },
    { l: '(b)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Faktorkan selengkapnya 2<i>x</i>² − 18.', qe: 'Factorise completely 2<i>x</i>² − 18.',
      sk: '2(<i>x</i>² − 9) <b>K1</b><br>2(<i>x</i> − 3)(<i>x</i> + 3) <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Permudahkan FR(<i>x</i>² − 9|2<i>x</i> + 6).', qe: 'Simplify FR(<i>x</i>² − 9|2<i>x</i> + 6).',
      sk: 'FR((<i>x</i> − 3)(<i>x</i> + 3)|2(<i>x</i> + 3)) <b>K1 K1</b><br>FR(<i>x</i> − 3|2) <b>N1</b>' },
    { l: '(d)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Luas sebuah trapezium diberi oleh <i>L</i> = FR(1|2)(<i>a</i> + <i>b</i>)<i>t</i>. Ungkapkan <i>t</i> sebagai perkara rumus. Seterusnya, hitung nilai <i>t</i> apabila <i>L</i> = 60, <i>a</i> = 7 dan <i>b</i> = 5.',
      qe: 'The area of a trapezium is given by <i>L</i> = FR(1|2)(<i>a</i> + <i>b</i>)<i>t</i>. Express <i>t</i> as the subject of the formula. Hence, calculate the value of <i>t</i> when <i>L</i> = 60, <i>a</i> = 7 and <i>b</i> = 5.',
      sk: '2<i>L</i> = (<i>a</i> + <i>b</i>)<i>t</i> <b>K1</b><br><i>t</i> = FR(2<i>L</i>|<i>a</i> + <i>b</i>) <b>N1</b><br><i>t</i> = FR(120|12) = 10 <b>N1</b>' }] },
  { id: 'T2-C03', bhg: 'C', bab: 4, babs: [4, 5], kbat: true, parts: [
    { l: '(a)', m: 3, aras: 'R', kon: 'Mengaplikasi', ruang: 62, q: 'Dengan menggunakan pembaris dan jangka lukis sahaja, bina sebuah heksagon sekata bersisi 4 cm dalam ruang jawapan.',
      qe: 'Using only a ruler and a pair of compasses, construct a regular hexagon with sides of 4 cm in the answer space.',
      sk: 'Lukis bulatan berjejari 4 cm <b>K1</b><br>Tanda 6 titik pada lilitan dengan bukaan jangka lukis 4 cm <b>K1</b><br>Heksagon sekata lengkap <b>N1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', fig: 'C03b', q: 'Rajah menunjukkan sebuah heksagon sekata <i>ABCDEF</i>. Hitung nilai <i>x</i> dan nilai <i>y</i>.',
      qe: 'The diagram shows a regular hexagon <i>ABCDEF</i>. Calculate the values of <i>x</i> and <i>y</i>.',
      sk: 'Sudut pedalaman = 120° <b>K1</b><br><i>x</i> = FR(180° − 120°|2) = 30° <b>N1</b><br>∠<i>FAE</i> = FR(180° − 120°|2) = 30°<br><i>y</i> = 120° − 30° − 30° = 60° <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menilai', fig: 'C03c', q: 'Rajah menunjukkan sebuah trek larian yang terdiri daripada dua garis lurus sepanjang 100 m dan dua semibulatan berdiameter 63 m. Farah berlari 3 pusingan lengkap trek itu. Adakah Farah mencapai sasarannya untuk berlari sekurang-kurangnya 1.2 km? Tunjukkan pengiraan anda. (Guna π = FR(22|7))',
      qe: 'The diagram shows a running track made up of two straight lines of 100 m each and two semicircles with a diameter of 63 m. Farah runs 3 complete laps of the track. Does Farah reach her target of running at least 1.2 km? Show your calculation. (Use π = FR(22|7))',
      sk: 'Dua semibulatan = FR(22|7) × 63 = 198 m <b>K1</b><br>Satu pusingan = 200 + 198 = 398 m <b>K1</b><br>3 × 398 = 1 194 m <b>K1</b><br>Tidak, kurang 6 m daripada 1.2 km <b>N1</b>' }] },
  { id: 'T2-C04', bhg: 'C', bab: 6, babs: [6, 7], kbat: true, parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mencipta', ruang: 50, q: 'Dalam ruang jawapan, lakarkan bentangan bagi sebuah piramid tegak bertapak segi empat sama.',
      qe: 'In the answer space, sketch the net of a right pyramid with a square base.',
      sk: 'Tapak segi empat sama <b>P1</b><br>Empat segi tiga pada setiap sisi tapak <b>P1</b>' },
    { l: '(b)', m: 3, aras: 'S', kon: 'Mengaplikasi', q: 'Sebuah bekas berbentuk silinder dengan jejari 7 cm dan tinggi 20 cm diisi air sehingga FR(3|4) penuh. Hitung isi padu air, dalam cm³. (Guna π = FR(22|7))',
      qe: 'A cylindrical container with a radius of 7 cm and a height of 20 cm is filled with water until it is FR(3|4) full. Calculate the volume of water, in cm³. (Use π = FR(22|7))',
      sk: 'FR(22|7) × 7² × 20 = 3 080 <b>K1</b><br>FR(3|4) × 3 080 <b>K1</b><br>2 310 cm³ <b>N1</b>' },
    { l: '(c)', m: 3, aras: 'R', kon: 'Mengaplikasi', q: 'Hitung jarak di antara titik <i>A</i>(−2, 3) dan <i>B</i>(4, −5).', qe: 'Calculate the distance between the points <i>A</i>(−2, 3) and <i>B</i>(4, −5).',
      sk: 'RT((4 − (−2))² + (−5 − 3)²) <b>K1</b><br>RT(36 + 64) <b>K1</b><br>10 unit <b>N1</b>' },
    { l: '(d)', m: 2, aras: 'T', kon: 'Menilai', q: 'Pada sebuah peta, rumah Ali berada di titik (1, 2) dan sekolah di titik (9, 8). Sebuah kedai terletak di titik tengah antara rumah Ali dan sekolah. Rumah Bala berada di titik (5, −1). Siapakah yang tinggal lebih dekat dengan kedai itu? Tunjukkan pengiraan anda.',
      qe: 'On a map, Ali\'s house is at the point (1, 2) and the school is at the point (9, 8). A shop is located at the midpoint between Ali\'s house and the school. Bala\'s house is at the point (5, −1). Who lives closer to the shop? Show your calculation.',
      sk: 'Kedai (5, 5); jarak ke rumah Ali = 5 unit, ke rumah Bala = 6 unit <b>K1</b><br>Ali <b>N1</b>' }] },
  { id: 'T2-C05', bhg: 'C', bab: 8, babs: [8, 9], kbat: true, parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', q: 'Lengkapkan jadual di bawah bagi fungsi <i>y</i> = <i>x</i>² − 2<i>x</i> − 3.', qe: 'Complete the table below for the function <i>y</i> = <i>x</i>² − 2<i>x</i> − 3.',
      jadual: { r: [['<i>x</i>', '−2', '−1', '0', '1', '2', '3', '4'], ['<i>y</i>', '5', '0', '?', '−4', '−3', '?', '5']] }, ruang: 16,
      sk: '<i>x</i> = 0 → −3 <b>P1</b><br><i>x</i> = 3 → 0 <b>P1</b>' },
    { l: '(b)', m: 4, aras: 'R', kon: 'Mengaplikasi', fig: 'C05b', big: true, q: 'Dengan menggunakan skala 2 cm kepada 1 unit pada paksi-<i>x</i> dan 2 cm kepada 2 unit pada paksi-<i>y</i>, lukis graf <i>y</i> = <i>x</i>² − 2<i>x</i> − 3 bagi −2 ≤ <i>x</i> ≤ 4.',
      qe: 'Using a scale of 2 cm to 1 unit on the <i>x</i>-axis and 2 cm to 2 units on the <i>y</i>-axis, draw the graph of <i>y</i> = <i>x</i>² − 2<i>x</i> − 3 for −2 ≤ <i>x</i> ≤ 4.',
      sk: 'Paksi dengan skala seragam <b>K1</b><br>Plot 7 titik dengan betul <b>K2</b><br>Lengkung licin melalui semua titik <b>N1</b>' },
    { l: '(c)', m: 4, aras: 'T', kon: 'Menganalisis', q: 'Sebuah bas bertolak dari bandar <i>P</i> ke bandar <i>Q</i> yang jaraknya 120 km dalam masa 1 jam 30 minit. Bas itu berhenti selama 30 minit di <i>Q</i>, kemudian meneruskan perjalanan sejauh 60 km ke bandar <i>R</i> dengan laju purata 80 km/j. Hitung laju purata bas itu bagi keseluruhan perjalanan dari <i>P</i> ke <i>R</i>, dalam km/j.',
      qe: 'A bus travels from town <i>P</i> to town <i>Q</i>, 120 km away, in 1 hour 30 minutes. The bus stops for 30 minutes at <i>Q</i>, then continues 60 km to town <i>R</i> at an average speed of 80 km/h. Calculate the average speed of the bus for the whole journey from <i>P</i> to <i>R</i>, in km/h.',
      sk: 'Masa <i>Q</i> ke <i>R</i> = FR(60|80) = 0.75 jam <b>K1</b><br>Jumlah masa = 1.5 + 0.5 + 0.75 = 2.75 jam <b>K1</b><br>FR(180|2.75) <b>K1</b><br>65.45 km/j <b>N1</b>' }] },
  { id: 'T2-C06', bhg: 'C', bab: 11, babs: [11, 12, 13], parts: [
    { l: '(a)', m: 2, aras: 'R', kon: 'Mengaplikasi', fig: 'C06', ruang: 8, q: 'Rajah menunjukkan objek <i>P</i>, objek <i>Q</i> dan imej <i>Q′</i> pada satah Cartes. Pada rajah itu, lukis imej bagi <i>P</i> di bawah translasi VC(3|−4).',
      qe: 'The diagram shows object <i>P</i>, object <i>Q</i> and image <i>Q′</i> on a Cartesian plane. On the diagram, draw the image of <i>P</i> under the translation VC(3|−4).',
      sk: 'Imej dengan bucu (4, −3), (6, −3), (4, −1) <b>P2</b>' },
    { l: '(b)', m: 2, aras: 'S', kon: 'Memahami', q: '<i>Q′</i> ialah imej bagi <i>Q</i> di bawah satu pantulan. Huraikan pantulan itu selengkapnya.', qe: '<i>Q′</i> is the image of <i>Q</i> under a reflection. Describe the reflection in full.',
      sk: 'Pantulan <b>P1</b> pada garis <i>y</i> = 1 <b>P1</b>' },
    { l: '(c)', m: 4, aras: 'R', kon: 'Mengaplikasi', q: 'Markah kuiz bagi 8 orang murid ialah 6, 9, 7, 6, 10, 8, 6, 4. Nyatakan mod, dan hitung min dan median bagi markah itu.',
      qe: 'The quiz marks of 8 pupils are 6, 9, 7, 6, 10, 8, 6, 4. State the mode, and calculate the mean and the median of the marks.',
      sk: 'Mod = 6 <b>P1</b><br>Min = FR(56|8) <b>K1</b> = 7 <b>N1</b><br>Median = FR(6 + 7|2) = 6.5 <b>N1</b>' },
    { l: '(d)', m: 2, aras: 'S', kon: 'Mengaplikasi', q: 'Seorang murid dipilih secara rawak daripada 8 orang murid itu. Hitung kebarangkalian murid yang dipilih mendapat markah lebih daripada 7.',
      qe: 'A pupil is chosen at random from the 8 pupils. Calculate the probability that the chosen pupil scored more than 7 marks.',
      sk: 'Markah 8, 9, 10 → 3 orang <b>K1</b><br>FR(3|8) <b>N1</b>' }] }
];
