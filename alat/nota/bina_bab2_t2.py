"""Bab 2 T2 Pemfaktoran dan Pecahan Algebra: nota ikut buku teks (ayat buku, nombor ditukar)."""
import re
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())
SUBS = [{"no": "2.1", "name": "Kembangan", "col": "#38BDF8"}, {"no": "2.2", "name": "Pemfaktoran", "col": "#34D399"},
        {"no": "2.3", "name": "Ungkapan Algebra dan Hukum Operasi Asas Aritmetik", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def E(s):
    """ungkapan matematik: huruf condong, tolak tipografi, kuasa."""
    s = s.replace('^2', '²').replace('^3', '³').replace('*', ' × ').replace(' - ', ' − ').replace('(-', '(−').replace('= -', '= −')
    s = re.sub(r'^-', '−', s)
    return re.sub(r'([a-z]+)', r'<i>\1</i>', s)


def SV(s):
    """ungkapan untuk teks SVG (tspan condong)."""
    return E(s).replace('<i>', '<tspan font-style="italic">').replace('</i>', '</tspan>')


def F(a, b):
    return f'<span class="fr"><span>{E(a)}</span><span>{E(b)}</span></span>'


def work(blocks, sub):
    c = COL[sub]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            'display:flex;flex-direction:column;gap:10px;font-size:19px;line-height:1.45">' + ''.join(out) + '</div>')


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def cross(a1, a2, c1, c2, mid1, mid2, sumtxt, xv='x'):
    """rajah pendaraban silang dalam SVG."""
    k = []
    for (x, y, t) in [(90, 110, a1), (90, 250, a2), (260, 110, c1), (260, 250, c2), (400, 110, mid1), (400, 250, mid2)]:
        k.append(T(x, y, t, TX, 24, fam=HEAD))
    k.append(f'<line x1="115" y1="115" x2="235" y2="240" stroke="{OBJ}" stroke-width="3"/><line x1="115" y1="240" x2="235" y2="115" stroke="{OBJ}" stroke-width="3"/>')
    k.append(f'<line x1="320" y1="70" x2="320" y2="330" stroke="{AX}" stroke-width="2"/><line x1="40" y1="290" x2="470" y2="290" stroke="{AX}" stroke-width="2"/>')
    k.append(T(250, 186, '(×)', AX, 18)); k.append(T(445, 186, '(+)', AX, 18))
    k.append(f'<g class="rv">{T(400, 330, sumtxt, GR, 24, fam=HEAD)}</g>')
    return box(''.join(k), 'Rajah pendaraban silang')


# =====================================================================
# 2.1 KEMBANGAN
# =====================================================================
s = '2.1'
k = [f'<rect x="60" y="110" width="250" height="230" fill="{OBJ}33" stroke="{OBJ}" stroke-width="3"/>',
     f'<rect x="310" y="110" width="120" height="230" fill="{AM}33" stroke="{AM}" stroke-width="3"/>',
     T(185, 95, SV('x'), OBJ, 22), T(370, 95, '3', AM, 22), T(40, 232, SV('x'), TX, 22),
     T(185, 235, SV('x^2'), TX, 26), T(370, 235, SV('3x'), TX, 26),
     f'<g class="rv">{T(245, 400, SV("x(x + 3) = x^2 + 3x"), GR, 24)}</g>']
S(s, 'DEFINISI', 'Kembangan ungkapan algebra',
  de(s, '<b>Kembangan ungkapan algebra</b> bermaksud hasil pendaraban satu atau dua ungkapan dalam kurungan.')
  + bul(s, ['Apabila melakukan kembangan ungkapan algebra, setiap sebutan dalam tanda kurungan mesti didarabkan dengan sebutan di luar kurungan.',
            f'Ungkapan algebra ialah ungkapan yang menggabungkan nombor, pemboleh ubah atau simbol matematik lain dengan operasi. Misalnya, {E("2a + 5")}.']),
  box(''.join(k), 'Luas segi empat tepat x darab (x + 3)'))

S(s, 'CONTOH 1', 'Kembangan satu ungkapan',
  p('Kembangkan setiap ungkapan berikut.')
  + bul(s, [f'(a) {E("4(2 + 5w)")}', f'(b) {E("2p(p - 3q)")}', f'(c) {E("-3k(m + 4)")}', f'(d) −{F("3y", "4")}{E("(8y - 4z + 12x)")}'])
  + note('(+) × (+) = + &nbsp; (+) × (−) = − &nbsp; (−) × (+) = − &nbsp; (−) × (−) = +', 'Imbas kembali:'),
  work([('(a)', [E('4(2 + 5w)'), E('= (4 × 2) + (4 × 5w)'), E('= 8 + 20w')]),
        ('(b)', [E('2p(p - 3q)'), E('= (2p × p) + [2p × (−3q)]'), E('= 2p^2 − 6pq')]),
        ('(c)', [E('-3k(m + 4)'), E('= (−3k × m) + (−3k × 4)'), E('= −3km − 12k')]),
        ('(d)', [f'= (−{F("3y", "4")} × {E("8y")}) + [−{F("3y", "4")} × (−{E("4z")})] + (−{F("3y", "4")} × {E("12x")})', E('= −6y^2 + 3yz − 9xy')])], s))

k = [f'<rect x="70" y="60" width="230" height="230" fill="{OBJ}33" stroke="{OBJ}" stroke-width="3"/>', f'<rect x="300" y="60" width="120" height="230" fill="{PU}33" stroke="{PU}" stroke-width="3"/>',
     f'<rect x="70" y="290" width="230" height="120" fill="{AM}33" stroke="{AM}" stroke-width="3"/>', f'<rect x="300" y="290" width="120" height="120" fill="{GR}33" stroke="{GR}" stroke-width="3"/>',
     T(185, 50, SV('a'), TX, 22), T(360, 50, SV('b'), TX, 22), T(52, 182, SV('a'), TX, 22), T(52, 357, SV('b'), TX, 22),
     T(185, 183, SV('a^2'), TX, 26), T(360, 183, SV('ab'), TX, 26), T(185, 358, SV('ab'), TX, 26), T(360, 358, SV('b^2'), TX, 26),
     f'<g class="rv">{T(245, 450, SV("(a + b)^2 = a^2 + 2ab + b^2"), GR, 22)}</g>']
S(s, 'KONSEP', 'Kembangan dua ungkapan algebra',
  de(s, 'Apabila melakukan kembangan dua ungkapan algebra dalam dua tanda kurungan, setiap sebutan dalam tanda kurungan pertama mesti didarabkan dengan setiap sebutan dalam tanda kurungan kedua.')
  + p(f'Misalnya, {E("(a + 3)(a + 2) = a(a + 2) + 3(a + 2) = a^2 + 2a + 3a + 6 = a^2 + 5a + 6")}')
  + note(f'{E("(a + b)(a + b) = (a + b)^2")}, {E("(a - b)(a - b) = (a - b)^2")}, {E("(a + b)(a - b) = a^2 - b^2")}', 'Tip:')
  + note(f'{E("(a + b)(a + b) ≠ a^2 + b^2")} dan {E("(a - b)(a - b) ≠ a^2 - b^2")}', 'Perhatian:'),
  box(''.join(k), 'Segi empat sama (a + b) kali (a + b)'))

S(s, 'CONTOH 2', 'Kembangan dua ungkapan',
  p('Kembangkan setiap ungkapan berikut.')
  + bul(s, [f'(a) {E("(y + 2)(y - 5)")}', f'(b) {E("(3 + 2r)(4 + r)")}', f'(c) {E("(2r + 5s)(r - 3s)")}', f'(d) {E("(2p + 3)^2")}'])
  + note('Sebutan algebra disusun daripada kuasa tertinggi kepada kuasa terendah.', 'Tip:'),
  work([('(a)', [E('= y(y - 5) + 2(y - 5)'), E('= y^2 − 5y + 2y − 10'), E('= y^2 − 3y − 10')]),
        ('(b)', [E('= 12 + 3r + 8r + 2r^2'), E('= 2r^2 + 11r + 12')]),
        ('(c)', [E('= 2r(r - 3s) + 5s(r - 3s)'), E('= 2r^2 − 6rs + 5rs − 15s^2'), E('= 2r^2 − rs − 15s^2')]),
        ('(d)', [E('= (2p + 3)(2p + 3)'), E('= 4p^2 + 6p + 6p + 9'), E('= 4p^2 + 12p + 9')])], s))

S(s, 'KONSEP', 'Gabungan operasi termasuk kembangan',
  de(s, 'Penyelesaian gabungan operasi bagi ungkapan algebra mahupun sebutan algebra mestilah mematuhi hukum \'BODMAS\'.')
  + bul(s, ['<b>B</b> = Brackets (kurungan)', '<b>O</b> = Order (kuasa)', '<b>D</b> = Division (bahagi)', '<b>M</b> = Multiplication (darab)', '<b>A</b> = Addition (tambah)', '<b>S</b> = Subtraction (tolak)'])
  + note(f'Hukum Kalis Agihan digunakan apabila melakukan kembangan: {E("a × (b + c) = a × b + a × c")}', 'Ingat:'), '')

S(s, 'CONTOH 3', 'Permudahkan',
  p('Permudah.')
  + bul(s, [f'(a) {E("(2w - 3)(3w - 1) - 5w")}', f'(b) {E("(r - 2t)^2 + 3rt")}', f'(c) {E("(x + y)(x - y) + x(x - 3y)")}']),
  work([('(a)', [E('= 2w(3w − 1) − 3(3w − 1) − 5w'), E('= 6w^2 − 2w − 9w + 3 − 5w'), E('= 6w^2 − 16w + 3')]),
        ('(b)', [E('= (r − 2t)(r − 2t) + 3rt'), E('= r^2 − 2rt − 2rt + 4t^2 + 3rt'), E('= r^2 − rt + 4t^2')]),
        ('(c)', [E('= x^2 − xy + xy − y^2 + x^2 − 3xy'), E('= 2x^2 − 3xy − y^2')])], s))

k = [f'<rect x="60" y="120" width="380" height="200" rx="10" fill="{AM}22" stroke="{AM}" stroke-width="3"/>',
     T(250, 100, SV('(2r − 1)') + ' m', TX, 22), T(475, 225, SV('(r + 3)') + ' m', TX, 20, anchor='end')]
S(s, 'CONTOH 4', 'Penyelesaian masalah',
  p(f'Puan Maria mempunyai sebidang permaidani yang panjangnya {E("(2r − 1)")} meter dan lebarnya ialah {E("(r + 3)")} meter. Hitung luas permaidani Puan Maria.')
  + p('<b>Penyelesaian:</b>')
  + steps(s, [f'Luas = panjang × lebar = {E("(2r − 1)(r + 3)")}', f'{E("= 2r^2 + 6r − r − 3")} {E("= 2r^2 + 5r − 3")}', f'Maka, luas permaidani ialah {E("(2r^2 + 5r − 3)")} meter persegi.']),
  box(''.join(k), 'Permaidani segi empat tepat'))

S(s, 'CONTOH 5', 'Penyelesaian masalah',
  p(f'Ramesh menerima wang saku sebanyak RM40 untuk {E("(y − 5)")} hari. Setiap hari dia membelanjakan sebanyak RM{E("(x − 2)")} untuk secawan kopi dan RM{E("(x + 3)")} untuk mi rebus. Hitung baki wang Ramesh.')
  + four(s, 'Kenal pasti jumlah harga kopi dan mi rebus.', f'Tentukan jumlah perbelanjaan dalam masa {E("(y − 5)")} hari dengan kaedah kembangan.',
         'Menghitung baki dengan proses kembangan.', f'Baki wang saku. RM{E("(45 − 2xy − y + 10x)")}'),
  work([('Memahami masalah', [E('(x − 2) + (x + 3) = 2x + 1')]), ('Merancang strategi', ['Hari × Harga', E('= (y − 5)(2x + 1)'), E('= 2xy + y − 10x − 5')]),
        ('Melaksanakan strategi', ['Wang saku − Jumlah perbelanjaan', E('= 40 − (2xy + y − 10x − 5)'), E('= 45 − 2xy − y + 10x')])], s))

# =====================================================================
# 2.2 PEMFAKTORAN
# =====================================================================
s = '2.2'
k = [T(250, 120, SV('a(b + c)'), OBJ, 30, fam=HEAD), T(250, 330, SV('ab + ac'), IMG, 30, fam=HEAD),
     arc(250, 225, 95, 140, 220, GR, True, 4), arc(250, 225, 95, 320, 40, PU, True, 4),
     T(90, 230, 'Kembangan', GR, 18), T(410, 230, 'Pemfaktoran', PU, 18)]
S(s, 'DEFINISI', 'Konsep faktor dan pemfaktoran',
  de(s, '<b>Pemfaktoran</b> ialah proses mengenal pasti faktor sebutan dan ungkapan algebra dan apabila didarabkan akan menghasilkan ungkapan asal. Pemfaktoran merupakan proses songsangan kepada kembangan.')
  + p(f'Misalnya, faktor bagi {E("5q")}: {E("1 × 5q")} dan {E("5 × q")}. Maka, faktor bagi {E("5q")} ialah 1, 5, {E("q")} dan {E("5q")}.'),
  box(''.join(k), 'Kembangan dan pemfaktoran ialah proses songsang'))

S(s, 'DEFINISI', 'Faktor sepunya dan FSTB',
  de(s, '<b>Faktor sepunya</b> ialah faktor bagi sebutan algebra yang membahagi dengan tepat dua atau lebih sebutan lain. <b>Faktor Sepunya Terbesar (FSTB)</b> ialah faktor yang terbesar antara semua faktor sepunya.')
  + p(f'Perhatikan ungkapan, {E("6x + 3 = 3(2x + 1)")}. 3 ialah faktor sepunya bagi {E("6x")} dan 3.')
  + note('\'1\' ialah faktor bagi semua sebutan algebra.', 'Perhatian:'), '')

S(s, 'CONTOH 6', 'Faktor sepunya',
  p('Senaraikan semua faktor sepunya bagi setiap sebutan berikut.') + bul(s, [f'(a) {E("4m, 6mn")}', f'(b) {E("8p^2q, 4q^2r, 12pqr")}']),
  work([('(a)', [E('4m = 1 × 4m = 2 × 2m = 4 × m'), E('6mn = 1 × 6mn = 2 × 3mn = 3 × 2mn = m × 6n = 2m × 3n'),
                 f'Maka, faktor sepunya bagi {E("4m")} dan {E("6mn")} ialah 1, 2, {E("m")} dan {E("2m")}.']),
        ('(b)', [E('8p^2q = 1 × 2 × 2 × 2 × p × p × q'), E('4q^2r = 1 × 2 × 2 × q × q × r'), E('12pqr = 1 × 2 × 2 × 3 × p × q × r'),
                 f'Faktor sepunya ialah 1, 2, 4, {E("q")}, {E("2q")} dan {E("4q")} kerana boleh membahagi semua sebutan di atas dengan tepat.'])], s))

S(s, 'CONTOH 7', 'FSTB dan pemfaktoran',
  p(f'Ungkapan algebra boleh difaktorkan dengan mencari Faktor Sepunya Terbesar (FSTB). Misalnya, {E("4x")} ialah FSTB bagi {E("8x")} dan {E("12x^2")}. Maka, {E("8x + 12x^2")} boleh ditulis sebagai hasil darab dua faktor, iaitu {E("4x(2 + 3x)")}. Ini dinamakan <b>pemfaktoran</b>.')
  + bul(s, [f'1. Tentukan FSTB bagi setiap sebutan berikut. (a) {E("8k, 12km")} (b) {E("6x^2y, 9xy^2, 3xyz")}', f'2. Faktorkan setiap ungkapan berikut. (a) {E("5x + 20")} (b) {E("9m + 15m^2")}']),
  work([('1. (a)', [f'FSTB = {E("4k")}']), ('1. (b)', [f'FSTB = {E("3xy")}']),
        ('2. (a)', [f'FSTB = 5. Maka, {E("5(x + 4)")}']), ('2. (b)', [f'FSTB = {E("3m")}. Maka, {E("3m(3 + 5m)")}'])], s))

S(s, 'CONTOH 8', 'Beza dua kuasa dua',
  de(s, f'{E("x^2 − y^2")} ialah sebutan beza kuasa dua. {E("x^2 − y^2")} boleh difaktorkan dengan beza kuasa dua sempurna. Kaedah ini hanya boleh digunakan jika kedua-dua sebutan algebra tersebut ialah kuasa dua sempurna.')
  + p('Faktorkan setiap ungkapan berikut.') + bul(s, [f'(a) {E("c^2 − 1")}', f'(b) {E("16n^2 − 25")}', f'(c) {E("2y^2 − 50")}', f'(d) {E("3k^2 − 27")}']),
  work([('(a)', [E('= c^2 − 1^2'), E('= (c + 1)(c − 1)')]), ('(b)', [E('= (4n)^2 − 5^2'), E('= (4n + 5)(4n − 5)')]),
        ('(c)', [E('= 2(y^2 − 25)'), E('= 2(y^2 − 5^2)'), E('= 2(y + 5)(y − 5)')]), ('(d)', [E('= 3(k^2 − 9)'), E('= 3(k + 3)(k − 3)')])], s))

S(s, 'KONSEP', 'Pendaraban silang',
  de(s, f'Bagi ungkapan algebra berbentuk {E("ax^2 + bx + c")} dengan {E("a ≠ 0")} dan {E("a")}, {E("b")}, {E("c")} ialah suatu integer boleh difaktorkan dengan kaedah pendaraban silang.')
  + steps(s, [f'Langkah 1: Bandingkan pekali {E("x^2 + 7x + 10")}. Maka, {E("a")} = 1, {E("b")} = 7 dan {E("c")} = 10.', f'Langkah 2 dan 3: Faktor bagi 10 ialah 1, 2, 5, 10. 2 dan 5 dipilih kerana menepati {E("c")}, iaitu 2 × 5 = 10, dan menepati {E("b")}, iaitu 2 + 5 = 7.',
              f'Langkah 4 dan 5: Lakukan darab silang. Faktor {E("x^2 + 7x + 10")} ialah {E("(x + 2)(x + 5)")}.']),
  cross(SV('x'), SV('x'), '+2', '+5', SV('2x'), SV('5x'), SV('7x')))

S(s, 'CONTOH 9', 'Pendaraban silang',
  p('Faktorkan setiap ungkapan berikut.') + bul(s, [f'(a) {E("x^2 − 8x + 16")}', f'(b) {E("m^2 − 3m − 10")}'])
  + p('<b>Penyelesaian:</b>')
  + steps(s, [f'(a) Pendaraban faktor 16: (−4) × (−4). (−4) + (−4) = −8. Maka, {E("x^2 − 8x + 16 = (x − 4)(x − 4)")}.',
              f'(b) Pendaraban faktor 10: 2 × (−5). 2 + (−5) = −3. Maka, {E("m^2 − 3m − 10 = (m + 2)(m − 5)")}.']),
  cross(SV('m'), SV('m'), '+2', '−5', SV('2m'), SV('−5m'), SV('−3m')))

S(s, 'CONTOH 10', 'Pendaraban silang (a ≠ 1)',
  p(f'Faktorkan ungkapan berikut. {E("3m^2 + 10m + 8")}')
  + p('<b>Penyelesaian:</b>')
  + steps(s, [f'Pendaraban faktor 8: 1 × 8, 2 × 4', f'Cubaan pertama: {E("(3m + 2)(m + 4)")} memberikan {E("12m + 2m = 14m")} ✗', f'Cubaan kedua: {E("(3m + 4)(m + 2)")} memberikan {E("6m + 4m = 10m")} ✓',
              f'Maka, {E("3m^2 + 10m + 8 = (3m + 4)(m + 2)")}.'])
  + note('Semak jawapan dengan kaedah kembangan.', 'Tip:'),
  cross(SV('3m'), SV('m'), '+4', '+2', SV('4m'), SV('6m'), SV('10m')))

S(s, 'CONTOH 11', 'Pekali negatif',
  p('Faktorkan ungkapan berikut.') + bul(s, [f'(a) {E("−3y^2 − 7y + 6")}', f'(b) {E("−2x^2 + 5x + 3")}'])
  + p('<b>Penyelesaian:</b>')
  + steps(s, [f'(a) Maka, {E("−3y^2 − 7y + 6 = (3y − 2)(−y − 3)")}.', f'(b) Maka, {E("−2x^2 + 5x + 3 = (2x + 1)(−x + 3)")}.']),
  cross(SV('3y'), SV('−y'), '−2', '−3', SV('2y'), SV('−9y'), SV('−7y')))

S(s, 'CONTOH 12', 'Faktor sepunya dalam empat sebutan',
  p(f'Menggunakan faktor sepunya dalam empat sebutan algebra: {E("ab + ac + bd + cd = (ab + ac) + (bd + cd) = a(b + c) + d(b + c) = (b + c)(a + d)")}')
  + note('Gabungkan sebutan yang ada faktor sepunya di dalam satu kurungan.', 'Tip:')
  + p('Faktorkan setiap ungkapan berikut.') + bul(s, [f'(a) {E("mn + 2n + 3m + 6")}', f'(b) {E("3px + 10qy − 6py − 5qx")}']),
  work([('(a)', [E('= (mn + 2n) + (3m + 6)'), E('= n(m + 2) + 3(m + 2)'), E('= (n + 3)(m + 2)')]),
        ('(b)', [E('= (3px − 6py) − (5qx − 10qy)'), E('= 3p(x − 2y) − 5q(x − 2y)'), E('= (x − 2y)(3p − 5q)')])], s))

mini = (f'<svg viewBox="0 0 500 250" width="100%" role="img" aria-label="Padang dengan dua kawasan segi tiga ditenggelami air">'
        f'<rect x="50" y="20" width="400" height="190" fill="{GR}22" stroke="{GR}" stroke-width="3"/>' + P([(50, 20), (250, 20), (50, 210)], OBJ) + P([(250, 20), (450, 20), (450, 210)], OBJ)
        + T(250, 240, SV('6x'), TX, 22) + '</svg>')
S(s, 'CONTOH 13', 'Penyelesaian masalah',
  p(f'Luas sebuah padang bola sepak berbentuk segi empat tepat ialah {E("(6x^2 + 18x)")} meter persegi. Padang itu telah ditenggelami air seperti dalam rajah. Jika lebar padang itu ialah {E("6x")} meter dan dua kawasan yang ditenggelami air ialah segi tiga bersudut tegak yang sama saiz, berapakah luas kawasan yang tidak ditenggelami air?')
  + four(s, 'Kenal pasti panjang padang.', 'Tentukan tapak dan luas dua segi tiga.', 'Luas padang − Luas dua segi tiga', f'{E("(3x^2 + 9x)")} m²'),
  '<div style="width:100%;display:flex;flex-direction:column;gap:10px">' + mini + work([('', [f'Panjang = {F("6x^2 + 18x", "6x")} = {F("6x(x + 3)", "6x")} = {E("x + 3")}',
        f'Tapak = {E("6x ÷ 2 = 3x")}. Luas dua segi tiga = 2 × ({F("1", "2")} × {E("3x")} × {E("(x + 3)")}) = {E("3x^2 + 9x")}',
        E('6x^2 + 18x − (3x^2 + 9x) = 3x^2 + 9x')])], s) + '</div>')

# =====================================================================
# 2.3 UNGKAPAN ALGEBRA DAN HUKUM OPERASI ASAS ARITMETIK
# =====================================================================
s = '2.3'
S(s, 'CONTOH 14', 'Penambahan dan penolakan ungkapan algebra',
  p('Anda telah mempelajari kembangan, pemfaktoran dan penyelesaian masalah. Cuba selesaikan gabungan operasi berikut yang melibatkan kembangan dan pemfaktoran.')
  + p('Permudah.') + bul(s, [f'(a) {E("3x^2 − 3(x + 6)")}', f'(b) {E("2w(w + 3) − 8")}']),
  work([('(a)', [E('= 3x^2 − 3x − 18'), E('= 3(x^2 − x − 6)'), E('= 3(x − 3)(x + 2)')]), ('(b)', [E('= 2w^2 + 6w − 8'), E('= 2(w^2 + 3w − 4)'), E('= 2(w + 4)(w − 1)')])], s))

S(s, 'CONTOH 15', 'Pecahan algebra dengan penyebut yang sama',
  p('Permudah setiap yang berikut.') + bul(s, [f'(a) {F("3a", "7")} + {F("2a", "7")}', f'(b) {F("m", "3n")} − {F("4m", "3n")}', f'(c) {F("x + 3", "4y")} − {F("x − 2", "4y")}'])
  + note('Tanda negatif tidak boleh berada di bahagian penyebut. (−) × (−) = +', 'Ingat:'),
  work([('(a)', [f'= {F("5a", "7")}']), ('(b)', [f'= {F("m − 4m", "3n")}', f'= {F("−3m", "3n")}', f'= −{F("m", "n")}']),
        ('(c)', [f'= {F("x + 3 − (x − 2)", "4y")}', f'= {F("x + 3 − x + 2", "4y")}', f'= {F("5", "4y")}'])], s))

S(s, 'CONTOH 16', 'Penyebut ialah gandaan penyebut yang lain',
  p('Salah satu daripada penyebutnya ialah gandaan bagi penyebut yang lain. Permudah setiap ungkapan berikut.')
  + bul(s, [f'(a) {F("5", "6p")} − {F("1", "3p")}', f'(b) {F("3", "mn")} − {F("2k", "n")}']) + note('Samakan penyebutnya.', 'Tip:'),
  work([('(a)', [f'= {F("5", "6p")} − {F("1 × 2", "3p × 2")}', f'= {F("5 − 2", "6p")}', f'= {F("3", "6p")}', f'= {F("1", "2p")}']),
        ('(b)', [f'= {F("3", "mn")} − {F("2k × m", "n × m")}', f'= {F("3 − 2km", "mn")}'])], s))

S(s, 'CONTOH 17', 'Penyebut tidak mempunyai faktor sepunya',
  p('Penyebut pecahan tersebut tidak mempunyai faktor sepunya. Permudah setiap ungkapan berikut.')
  + bul(s, [f'(a) {F("4x", "5")} − {F("2x", "3")}', f'(b) {F("3a", "4")} + {F("b", "5c")}']),
  work([('(a)', [f'= {F("4x × 3", "5 × 3")} − {F("2x × 5", "3 × 5")}', f'= {F("12x − 10x", "15")}', f'= {F("2x", "15")}']),
        ('(b)', [f'= {F("3a × 5c", "4 × 5c")} + {F("b × 4", "5c × 4")}', f'= {F("15ac + 4b", "20c")}'])], s))

S(s, 'CONTOH 18', 'Penyebut mempunyai faktor sepunya',
  p('Penyebut pecahan mempunyai faktor sepunya. Gunakan Gandaan Sepunya Terkecil (GSTK). Permudah setiap ungkapan berikut.')
  + bul(s, [f'(a) {F("1", "6p")} + {F("3", "4p")}', f'(b) {F("n", "2r")} − {F("3n", "10rs")}']),
  work([('(a)', [f'GSTK = {E("2p × 2 × 3 = 12p")}', f'= {F("1 × 2", "6p × 2")} + {F("3 × 3", "4p × 3")}', f'= {F("2", "12p")} + {F("9", "12p")}', f'= {F("11", "12p")}']),
        ('(b)', [f'GSTK = {E("2r × 5s = 10rs")}', f'= {F("n × 5s", "2r × 5s")} − {F("3n", "10rs")}', f'= {F("5ns − 3n", "10rs")}'])], s))

S(s, 'KONSEP', 'Pendaraban dan pembahagian ungkapan algebra',
  de(s, 'Untuk mendarab dan membahagi ungkapan algebra, anda perlu memfaktorkan ungkapan tersebut, kemudian memansuhkannya sekiranya terdapat faktor sepunya bagi pengangka dan penyebut.')
  + p(f'Misalnya, {E("(2p + 6) ÷ (p^2 − 9)")} boleh ditulis sebagai {F("2p + 6", "p^2 − 9")}.')
  + note('Proses ini memerlukan kemahiran pemfaktoran yang telah anda pelajari.'),
  work([('', [f'{F("2p + 6", "p^2 − 9")} = {F("2(p + 3)", "(p + 3)(p − 3)")}', '(Faktorkan pengangka dan penyebut)', f'= {F("2", "p − 3")}', '(Permudah ungkapan atau sebutan yang sama jika ada)'])], s))

S(s, 'CONTOH 19', 'Pendaraban ungkapan algebra',
  p('Permudah.') + bul(s, [f'(a) {F("a^2 − 4", "3ab")} × {F("b^2", "a + 2")}', f'(b) {F("(h + k)^2", "3h − 3k")} × {F("2h − 2k", "h^2 − k^2")}']),
  work([('(a)', [f'= {F("(a + 2)(a − 2)", "3ab")} × {F("b × b", "a + 2")}', f'= {F("b(a − 2)", "3a")}']),
        ('(b)', [f'= {F("(h + k)(h + k)", "3(h − k)")} × {F("2(h − k)", "(h + k)(h − k)")}', f'= {F("2(h + k)", "3(h − k)")}'])], s))

S(s, 'CONTOH 19', 'Pembahagian ungkapan algebra',
  p('Permudah.') + bul(s, [f'(c) {F("4a", "a + 3b")} ÷ {F("2ab", "5a + 15b")}', f'(d) {F("m^2 − n^2", "6m − 3n")} ÷ {F("(m − n)^2", "4m − 2n")}'])
  + note(f'{F("1", "x")} ÷ {F("1", "x")}: salingan {F("1", "x")} adalah {F("x", "1")} dan tukarkan operasi ÷ kepada ×.', 'Ingat:'),
  work([('(c)', [f'= {F("4a", "a + 3b")} × {F("5(a + 3b)", "2ab")}', f'= {F("20a", "2ab")}', f'= {F("10", "b")}']),
        ('(d)', [f'= {F("(m + n)(m − n)", "3(2m − n)")} × {F("2(2m − n)", "(m − n)(m − n)")}', f'= {F("2(m + n)", "3(m − n)")}'])], s))

S(s, 'CONTOH 20', 'Gabungan operasi ungkapan algebra',
  p('Selesaikan gabungan operasi berikut.') + bul(s, [f'(a) {F("3", "4b")}{E("(8a + 12b)")} + {F("a", "b")}', f'(b) {F("4k^2 − 4k + 1", "(2k + 1)(2k − 1)")}']),
  work([('(a)', [f'= {F("3", "4b")} × {E("4(2a + 3b)")} + {F("a", "b")}', f'= {F("6a + 9b", "b")} + {F("a", "b")}', f'= {F("7a + 9b", "b")}']),
        ('(b)', [f'= {F("(2k − 1)(2k − 1)", "(2k + 1)(2k − 1)")}', f'= {F("2k − 1", "2k + 1")}'])], s))

S(s, 'CONTOH 20', 'Gabungan operasi ungkapan algebra (sambungan)',
  p('Selesaikan gabungan operasi berikut.') + bul(s, [f'(c) {F("10m − 15m^2", "6n^2 − 18n")} × {F("n", "m")}', f'(d) {F("p − q", "2p + q")} ÷ {F("(p − q)^2", "6p + 3q")}'])
  + note(f'Faktorkan dua, tiga dan empat sebutan. Contoh: {E("x^2 − 16 = (x + 4)(x − 4)")}, {E("x^2 − 4x − 21 = (x − 7)(x + 3)")}', 'Perhatian:'),
  work([('(c)', [f'= {F("5m(2 − 3m)", "6n(n − 3)")} × {F("n", "m")}', f'= {F("5(2 − 3m)", "6(n − 3)")}']),
        ('(d)', [f'= {F("p − q", "2p + q")} × {F("3(2p + q)", "(p − q)(p − q)")}', f'= {F("3", "p − q")}'])], s))

OUTFILE = os.path.join(HERE, '..', '..', 'pemfaktoran', 'slides.js')
HEAD = '/* Nota Bab 2 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
