"""Bab 1 T2 Pola dan Jujukan: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())
SUBS = [{"no": "1.1", "name": "Pola", "col": "#FBBF24"}, {"no": "1.2", "name": "Jujukan", "col": "#38BDF8"}, {"no": "1.3", "name": "Pola dan Jujukan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def pen(sub, items):
    return p('<b>Penyelesaian:</b>') + steps(sub, items)


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def qa(sub, pairs):
    return f'<ul class="sl-bul" style="--c:{COL[sub]}">' + ''.join(f'<li><span>{q} <b class="rv" style="color:#34D399">→ {a}</b></span></li>' for q, a in pairs) + '</ul>'


def bx(x, y, s=34, col=AM, fill=True, dash=False):
    d = ' stroke-dasharray="6 5"' if dash else ''
    return f'<rect x="{f(x)}" y="{f(y)}" width="{s}" height="{s}" rx="4" fill="{col}{"44" if fill else "00"}" stroke="{col}" stroke-width="3"{d}/>'


def seq_svg(items, y=235, col=TX, gaps=None, gcol=AM, size=26, aria='Jujukan nombor'):
    """jujukan nombor dengan anak panah lengkung dan label beza di bawah."""
    n = len(items); W = 460 / n
    out = []
    for i, t in enumerate(items):
        cx = 20 + W * (i + .5)
        out.append(T(cx, y, t, col, size, fam=HEAD))
        if gaps and i < n - 1 and gaps[i]:
            x1, x2 = cx + 6, cx + W - 6
            out.append(f'<g class="rv"><path d="M{f(x1)} {y + 18} Q{f((x1 + x2) / 2)} {y + 52} {f(x2)} {y + 18}" fill="none" stroke="{gcol}" stroke-width="2.5"/>'
                       + arrowhead((x1 + x2) / 2 + 20, y + 40, x2, y + 18, gcol, 2.5) + T((x1 + x2) / 2, y + 74, gaps[i], gcol, 18) + '</g>')
    return box(''.join(out), aria)


# =====================================================================
# 1.1 POLA
# =====================================================================
s = '1.1'
k = []
for i, n in enumerate([0, 1, 2]):          # corak bentuk T: 1, 4, 7 petak
    ox, oy, S_ = 40 + i * 150, 250, 30
    cells = [(0, 0)] + [(dx * j, dy * j) for j in range(1, n + 1) for dx, dy in ((-1, 0), (1, 0), (0, -1))]
    for cx, cy in cells:
        k.append(bx(ox + 45 + cx * S_, oy + cy * S_, S_, AM))
    k.append(T(ox + 60, 330, f'Corak {i + 1}', TX, 17)); k.append(T(ox + 60, 360, f'{1 + 3 * n} petak', AM, 17))
k.append(T(250, 420, '1, 4, 7, ...   menambah 3', TX, 20, fam=HEAD))
S(s, 'DEFINISI', 'Pola',
  de(s, '<b>Pola</b> ialah aturan atau corak tertentu dalam senarai nombor atau objek.')
  + bul(s, ['Bilangan segi empat sama yang dibentuk ialah 1, 4, 7, ... iaitu menambah 3 kepada nombor sebelumnya. Penambahan 3 ini dikenali sebagai <b>pola</b>.',
            'Corak yang dilihat berbentuk poligon dan berulang.']), box(''.join(k), 'Corak petak 1, 4 dan 7'))

k = [T(30, 50, '(a)', AX, 18), T(30, 260, '(b)', AX, 18)]
for i, n in enumerate([1, 3, 5, 7]):
    cx = 70 + i * 105
    for j in range(n):
        col_, row_ = j % 2, j // 2
        k.append(f'<circle cx="{cx + col_ * 18}" cy="{170 - row_ * 18}" r="6" fill="{AM}"/>' if i < 3 else f'<g class="rv"><circle cx="{cx + col_ * 18}" cy="{170 - row_ * 18}" r="6" fill="{GR}"/></g>')
for i, n in enumerate([1, 2, 3, 4]):
    x0 = 60 + i * 105
    for j in range(n):
        tri = [(x0 + j * 18, 380), (x0 + j * 18 + 16, 380), (x0 + j * 18 + 8, 352)]
        k.append(P(tri, OBJ) if i < 3 else f'<g class="rv">{P(tri, GR)}</g>')
S(s, 'CONTOH 1', 'Corak seterusnya',
  p('Lukis corak seterusnya bagi gambar rajah di bawah dan nyatakan polanya.')
  + pen(s, ['(a) Pola: Menambah dua titik kepada corak sebelumnya.', '(b) Pola: Menambah satu segi tiga kepada corak sebelumnya.']),
  box(''.join(k), 'Corak titik dan corak segi tiga'))

S(s, 'CONTOH 2', 'Pola bagi set nombor',
  p('Nyatakan pola bagi set nombor berikut.')
  + bul(s, ['(a) −12, −5, 2, 9, ...', '(b) 20, 11, 2, −7, ...', '(c) 3, 12, 48, 192, ...'])
  + pen(s, ['(a) Pola: Menambah 7 kepada nombor sebelumnya.', '(b) Pola: Menolak 9 daripada nombor sebelumnya.', '(c) Pola: Mendarab nombor sebelumnya dengan 4.']),
  seq_svg(['−12', '−5', '2', '9', '...'], 235, TX, ['+7', '+7', '+7', ''], aria='Jujukan −12, −5, 2, 9 dengan beza tambah 7'))

S(s, 'CONTOH 2', 'Pola bagi set nombor (sambungan)',
  p('Nyatakan pola bagi set nombor berikut.')
  + bul(s, ['(d) 128, 32, 8, 2, ...', f'(e) 1, {fr(4, 3)}, {fr(5, 3)}, 2, ...', '(f) −1.5, −1.9, −2.3, −2.7, ...'])
  + pen(s, ['(d) Pola: Membahagi nombor sebelumnya dengan 4.', f'(e) Pola: Menambah {fr(1, 3)} kepada nombor sebelumnya.', '(f) Pola: Menolak 0.4 daripada nombor sebelumnya.']),
  seq_svg(['128', '32', '8', '2', '...'], 235, TX, ['÷4', '÷4', '÷4', ''], aria='Jujukan 128, 32, 8, 2 dengan pola bahagi 4'))

nums = [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58, 63]
k = []
for i, v in enumerate(nums):
    x = 40 + (i % 7) * 70; y = 140 + (i // 7) * 120
    c = IMG if v % 2 else PU
    k.append(f'<g class="rv"><circle cx="{x}" cy="{y - 7}" r="27" fill="{c}22" stroke="{c}" stroke-width="2.5"/></g>' + T(x, y, str(v), TX, 20, fam=HEAD))
k.append(f'<g class="rv">{T(130, 400, "ganjil", IMG, 20)}{T(370, 400, "genap", PU, 20)}</g>')
S(s, 'CONTOH 3', 'Nombor genap dan nombor ganjil',
  bul(s, ['<b>Nombor genap:</b> nombor yang boleh dibahagi tepat dengan 2 seperti 2, 4, 6, 8, ...', '<b>Nombor ganjil:</b> nombor yang tidak boleh dibahagi tepat dengan 2 seperti 1, 3, 5, 7, ...'])
  + p('Diberi urutan nombor 3, 8, 13, 18, 23, ..., 63. Kenal pasti dan nyatakan pola bagi urutan nombor (i) ganjil (ii) genap')
  + pen(s, ['(i) Nombor ganjil: 3, 13, 23, 33, 43, 53 dan 63. Nombor ganjil diperoleh dengan menambah 10 kepada nombor sebelumnya.',
            '(ii) Nombor genap: 8, 18, 28, 38, 48 dan 58. Nombor genap diperoleh dengan menambah 10 kepada nombor sebelumnya.']),
  box(''.join(k), 'Urutan 3 hingga 63, nombor ganjil dan genap'))

PASCAL = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1], [1, 6, 15, 20, 15, 6, 1]]


def pascal(rows_shown, rows_total, y0=60, dy=52, w=60):
    out = []
    for r in range(rows_total):
        for j, v in enumerate(PASCAL[r]):
            x = 250 + (j - r / 2) * w
            cell = f'<rect x="{f(x - 26)}" y="{y0 + r * dy - 20}" width="52" height="40" rx="8" fill="{OBJ if r < rows_shown else GR}33" stroke="{OBJ if r < rows_shown else GR}" stroke-width="2"/>' + T(x, y0 + r * dy + 7, str(v), TX, 19, fam=HEAD)
            out.append(cell if r < rows_shown else f'<g class="rv">{cell}</g>')
    return out


S(s, 'KONSEP', 'Segi Tiga Pascal',
  bul(s, ['Segi Tiga Pascal bermula dengan nombor 1. Manakala baris kedua ialah 1, 1. Semua baris Segi Tiga Pascal akan bermula dan diakhiri dengan nombor 1. Nombor lain diperoleh dengan menjumlahkan dua nombor pada baris sebelumnya.',
            'Nombor 2 dalam baris ketiga diperoleh dengan menjumlahkan nombor 1 dan nombor 1 pada baris sebelumnya. Nombor 6 di baris kelima diperoleh dengan menjumlahkan nombor 3 dan nombor 3 pada baris sebelumnya.'])
  + note('Pola bagi suatu urutan nombor merupakan corak yang mempunyai urutan yang tertib.'), box(''.join(pascal(5, 5, 90, 64, 64)), 'Segi Tiga Pascal lima baris'))

S(s, 'CONTOH 4', 'Melengkapkan Segi Tiga Pascal',
  p('Lengkapkan Segi Tiga Pascal di bawah.')
  + pen(s, ['Baris kelima: 1, 4, 6, 4, 1', 'Baris keenam: 1, 5, 10, 10, 5, 1', 'Baris ketujuh: 1, 6, 15, 20, 15, 6, 1']),
  box(''.join(pascal(4, 7, 50, 60, 66)), 'Segi Tiga Pascal tujuh baris dengan tiga baris terakhir untuk dilengkapkan'))

k = seq_svg(['0', '1', '1', '2', '3', '5', '8', '...'], 200, TX, ['', '0+1', '1+1', '1+2', '2+3', '3+5', ''], aria='Nombor Fibonacci')
S(s, 'KONSEP', 'Nombor Fibonacci',
  de(s, '<b>Nombor Fibonacci</b> merupakan suatu corak nombor yang berurutan.')
  + bul(s, ['Urutan ini bermula dengan 0, 1, 1 dan sebutan seterusnya diperoleh dengan menambah dua sebutan sebelumnya.']), k)

S(s, 'CONTOH 5', 'Melengkapkan urutan nombor',
  p('Lengkapkan urutan nombor di bawah.')
  + bul(s, ['(a) 0, 1, 1, ☐, ☐, ☐, 8, 13, ☐, ...', '(b) 2, 5, ☐, ☐, 19, ...'])
  + pen(s, ['(a) 0, 1, 1, <b>2</b>, <b>3</b>, <b>5</b>, 8, 13, <b>21</b>, ...', '(b) 2, 5, <b>7</b>, <b>12</b>, 19, ...'])
  + note('Pola merupakan suatu corak tertentu dalam sesuatu nombor atau objek. Suatu pola dalam senarai nombor ditentukan dengan menambah, menolak, mendarab atau membahagi nombor sebelumnya manakala suatu pola dalam objek ditentukan dengan memerhati susunan objek sebelumnya.', 'Rumusan:'),
  seq_svg(['2', '5', '7', '12', '19'], 235, TX, ['2+5', '5+7', '7+12', ''], aria='Jujukan 2, 5, 7, 12, 19'))

# =====================================================================
# 1.2 JUJUKAN
# =====================================================================
s = '1.2'
k = []
for i, n in enumerate([1, 2, 3, 4]):
    cx = 75 + i * 115
    for r in range(n):
        for j in range(r + 1):
            k.append(f'<circle cx="{f(cx + (j - r / 2) * 22)}" cy="{f(170 + (r - n) * 22 + 60)}" r="7" fill="{GR}"/>')
    k.append(T(cx, 300, str(n * (n + 1) // 2), TX, 22, fam=HEAD))
k.append(T(250, 380, 'Nombor segi tiga: 1, 3, 6, 10, ...', AM, 18))
S(s, 'DEFINISI', 'Jujukan',
  de(s, '<b>Jujukan</b> ialah suatu set nombor atau objek yang disusun mengikut suatu pola.')
  + bul(s, ['Susunan corak seterusnya boleh ditentukan dengan mengikut corak sebelumnya. Suatu susunan nombor atau objek yang mengikut pola ini disebut sebagai jujukan.',
            'Nombor segi tiga ialah nombor yang dibentuk dengan pola titik segi tiga.']), box(''.join(k), 'Nombor segi tiga 1, 3, 6 dan 10'))

S(s, 'CONTOH 6', 'Jujukan atau bukan?',
  p('Tentukan sama ada urutan nombor berikut suatu jujukan atau bukan.')
  + bul(s, ['(a) −9, −4, 1, 6, 11, ...', '(b) 3, 4, −6, 9, −13, ...'])
  + pen(s, ['(a) Pola: Menambah 5. Maka, urutan nombor ini ialah jujukan.', '(b) Pola: Tiada. Maka, urutan nombor ini bukan jujukan.']),
  seq_svg(['3', '4', '−6', '9', '−13'], 235, TX, ['+1', '−10', '+15', '−22'], aria='Urutan 3, 4, −6, 9, −13 tanpa pola'))

S(s, 'CONTOH 7', 'Melengkapkan jujukan nombor',
  p('Lengkapkan jujukan nombor berikut.')
  + qa(s, [('(a) 5, 12, ☐, 26, ☐, ☐, ...', '19, 33, 40 (+7)'), ('(b) 95, ☐, 75, 65, ☐, ☐, ...', '85, 55, 45 (−10)'),
           ('(c) ☐, 0.2, ☐, 0.008, 0.0016, ☐, ...', '1, 0.04, 0.00032 (×0.2)'), (f'(d) ☐, ☐, {fr(1, 4)}, {fr(2, 4)}, ☐, ...', f'−{fr(1, 4)}, 0, {fr(3, 4)} (+{fr(1, 4)})')]),
  seq_svg(['5', '12', '19', '26', '33', '40'], 235, TX, ['+7', '+7', '+7', '+7', '+7'], aria='Jujukan 5, 12, 19, 26, 33, 40'))

S(s, 'CONTOH 8', 'Jujukan berdasarkan pola',
  p('Lengkapkan jujukan berikut berdasarkan pola yang diberikan.')
  + qa(s, [('(a) Menolak 6 daripada nombor sebelumnya. 80, ...', '74, 68, 62, 56, 50'), ('(b) Mendarab nombor sebelumnya dengan 2. 6, ...', '12, 24, 48, 96, 192'),
           ('(c) Mengurangkan 7 daripada nombor sebelumnya. 15.4, ...', '8.4, 1.4, −5.6, −12.6, −19.6'), ('(d) Membahagi nombor sebelumnya dengan 4. 512, ...', '128, 32, 8, 2, 0.5')]),
  seq_svg(['512', '128', '32', '8', '2', '0.5'], 235, TX, ['÷4', '÷4', '÷4', '÷4', '÷4'], aria='Jujukan 512 dibahagi 4'))

# =====================================================================
# 1.3 POLA DAN JUJUKAN
# =====================================================================
s = '1.3'
S(s, 'CONTOH 9', 'Nombor, perkataan dan ungkapan algebra',
  p('Nyatakan pola bagi jujukan nombor 3, 10, 17, 24, 31, ... menggunakan nombor, perkataan dan ungkapan algebra.')
  + pen(s, ['(i) <b>Nombor:</b> Maka, pola ialah +7.', '(ii) <b>Perkataan:</b> Maka, pola bagi jujukan di atas adalah menambah 7 kepada nombor sebelumnya.',
            '(iii) <b>Ungkapan Algebra:</b> Maka, pola bagi jujukan nombor tersebut boleh ditulis sebagai 3 + 7<i>n</i> dengan keadaan <i>n</i> = 0, 1, 2, 3, 4, ... .']),
  box(''.join([T(250, 60, '3,  10,  17,  24,  31, ...', TX, 26, fam=HEAD)]
              + [f'<g class="rv">{T(250, 110 + 38 * i, f"{3 + 7 * i} = 3 + 7({i})", GR, 22, fam=HEAD)}</g>' for i in range(5)]
              + [T(250, 330, 'Ungkapan Algebra ialah ungkapan yang menggabungkan', AX, 15), T(250, 352, 'nombor, pemboleh ubah atau simbol matematik lain', AX, 15),
                 T(250, 374, 'dengan operasi. Contoh: 2ab + 3c, 5a + 2b − 3c', AX, 15)]), 'Jujukan 3, 10, 17, 24, 31 dalam bentuk 3 + 7n'))

k = []
for i, v in enumerate([5, 10, 15, 20]):
    x = 80 + i * 110
    k.append(T(x, 180, str(v), TX, 30, fam=HEAD)); k.append(T(x, 240, f'T<tspan font-size="14" dy="6">{i + 1}</tspan>', AM, 24, fam=HEAD))
k.append(T(250, 340, 'Tₙ = sebutan ke-n', GR, 24))
S(s, 'KONSEP', 'Sebutan bagi suatu jujukan',
  de(s, 'Sebutan sesuatu jujukan dikenali sebagai <b>sebutan ke-<i>n</i></b> dan ditulis sebagai T<sub><i>n</i></sub> iaitu T ialah sebutan manakala <i>n</i> ialah kedudukan sebutan.')
  + p('Misalnya, 5, 10, 15, 20, ...') + p('Daripada jujukan di atas, T<sub>1</sub> = 5, T<sub>2</sub> = 10, T<sub>3</sub> = 15, T<sub>4</sub> = 20, ...'),
  box(''.join(k), 'Jujukan 5, 10, 15, 20 dengan label T1 hingga T4'))

S(s, 'CONTOH 10', 'Sebutan kelima',
  p('Nyatakan sebutan kelima bagi jujukan nombor berikut. 3, 9, 15, ...')
  + pen(s, ['Langkah 1: Tentukan pola jujukan nombor tersebut. Pola nombor: Menambah 6 kepada nombor sebelumnya.',
            'Langkah 2: Senaraikan semua sebutan hingga sebutan kelima seperti di bawah. T<sub>1</sub> = 3, T<sub>2</sub> = 9, T<sub>3</sub> = 15, T<sub>4</sub> = 21, T<sub>5</sub> = 27',
            'Maka, sebutan kelima ialah 27.']),
  seq_svg(['3', '9', '15', '21', '27'], 235, TX, ['+6', '+6', '+6', '+6'], aria='Jujukan 3, 9, 15, 21, 27'))

S(s, 'CONTOH 11', 'Sebutan yang keberapa?',
  p('Diberi jujukan nombor 72, 66, 60, 54, ... . Tentukan nombor 36 ialah sebutan yang keberapa dalam jujukan itu.')
  + pen(s, ['Langkah 1: Pola: Menolak 6 daripada nombor sebelumnya.',
            'Langkah 2: T<sub>1</sub> = 72, T<sub>2</sub> = 66, T<sub>3</sub> = 60, T<sub>4</sub> = 54, T<sub>5</sub> = 48, T<sub>6</sub> = 42, T<sub>7</sub> = 36',
            'Maka, 36 ialah sebutan ke-7.']),
  seq_svg(['72', '66', '60', '54', '48', '42', '36'], 235, TX, ['−6'] * 6, aria='Jujukan 72 hingga 36'))

k = []
for i, (t, lb) in enumerate([('6:15 pagi', 'T₁'), ('2:15 petang', 'T₂'), ('10:15 malam', 'T₃')]):
    x = 90 + i * 160
    k.append(f'<circle cx="{x}" cy="200" r="14" fill="{GR}"/>' + T(x, 160, lb, AM, 22, fam=HEAD) + T(x, 250, t, TX, 19))
    if i < 2:
        k.append(f'<line x1="{x + 20}" y1="200" x2="{x + 140}" y2="200" stroke="{AX}" stroke-width="3"/>' + arrowhead(x + 100, 200, x + 140, 200, AX, 3) + T(x + 80, 190, '+8 jam', AX, 15))
S(s, 'CONTOH 12', 'Penyelesaian masalah',
  p('Eng Wei menetapkan pemberian makanan ikannya 3 kali sehari. Pemberian makanan yang pertama pada pukul 6:15 pagi. Pada pukul berapakah ikan itu diberi makanan untuk kali yang ketiga?')
  + four(s, 'Waktu memberikan makanan kepada ikan pada kali ketiga.', f'1 hari = 24 jam, 1 kali = {fr(24, 3)} = 8 jam',
         'Pola: 8 jam. T<sub>1</sub> = 6:15 pagi, T<sub>2</sub> = 6:15 pagi + 8 jam = 2:15 petang, T<sub>3</sub> = 2:15 petang + 8 jam = 10:15 malam',
         'Maka, ikan diberi makanan kali ketiga pada pukul 10:15 malam.'),
  box(''.join(k), 'Garis masa pemberian makanan ikan'))

OUTFILE = os.path.join(HERE, '..', '..', 'pola', 'slides.js')
HEAD = '/* Nota Bab 1 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
