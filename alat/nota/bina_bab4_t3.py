"""Bab 4 T3 Lukisan Berskala: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder berskala dikekalkan (4.1.1 hingga 4.1.4) kerana bab.js dan soalan.js bergantung padanya
(dipaparkan sebagai satu subtopik 4.1 melalui BAB.gabung):
4.1.1 = buku SP 4.1.1, 4.1.2 = buku SP 4.1.2 + 4.1.3, 4.1.3 = buku SP 4.1.4, 4.1.4 = buku SP 4.1.5."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, GRID2, NAV

SUBS = [{"no": "4.1.1", "name": "Maksud Lukisan Berskala", "col": "#38BDF8"}, {"no": "4.1.2", "name": "Mentafsir Skala", "col": "#FBBF24"},
        {"no": "4.1.3", "name": "Melukis Lukisan Berskala", "col": "#34D399"}, {"no": "4.1.4", "name": "Penyelesaian Masalah", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def i(s):
    return f'<i>{s}</i>'


# ---------- pembantu grid ----------
def grid(x0, y0, cols, rows, u, w=1.3, col=GRID2):
    """grid bermula (x0, y0) = penjuru kiri atas, cols x rows petak bersaiz u px."""
    o = ''.join(GF.L((x0 + k * u, y0), (x0 + k * u, y0 + rows * u), col, w) for k in range(cols + 1))
    o += ''.join(GF.L((x0, y0 + k * u), (x0 + cols * u, y0 + k * u), col, w) for k in range(rows + 1))
    return o


def gp(x0, yb, u):
    """penukar koordinat grid (gx, gy; gy ke atas dari garis bawah yb) → skrin."""
    return lambda q: (x0 + q[0] * u, yb - q[1] * u)


def shape(pts, col, labels=None, size=16, off=15, w=3):
    """poligon + label bucu (di luar, menjauhi pusat)."""
    o = '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{col}2E" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>'
    if labels:
        cx = sum(x for x, _ in pts) / len(pts); cy = sum(y for _, y in pts) / len(pts)
        for (x, y), lb in zip(pts, labels):
            if not lb:
                continue
            dx, dy = x - cx, y - cy; d = math.hypot(dx, dy) or 1
            o += GF.T(x + dx / d * off, y + dy / d * off, lb, TX, size)
    return o


def brace(x1, x2, y, lb, col=MU3, up=True):
    """penanda saiz petak di atas grid."""
    s = -1 if up else 1
    return (GF.L((x1, y), (x1, y + 6 * s), col, 2) + GF.L((x2, y), (x2, y + 6 * s), col, 2) + GF.L((x1, y + 6 * s), (x2, y + 6 * s), col, 2)
            + GF.T((x1 + x2) / 2, y + 18 * s, lb, col, 14, halo=False))


def flower(cx, cy, u, col):
    """bunga ringkas dalam kotak 4 x 4 petak (u px)."""
    o = GF.L((cx, cy + 0.3 * u), (cx, cy + 2 * u), GR, max(1.5, u * 0.08))
    o += f'<ellipse cx="{cx + 0.45 * u:.1f}" cy="{cy + 1.35 * u:.1f}" rx="{0.42 * u:.1f}" ry="{0.18 * u:.1f}" fill="{GR}55" stroke="{GR}" stroke-width="{max(1, u * 0.05):.1f}" transform="rotate(-30 {cx + 0.45 * u:.1f} {cy + 1.35 * u:.1f})"/>'
    for k in range(5):
        a = math.radians(-90 + 72 * k)
        o += f'<circle cx="{cx + 0.55 * u * math.cos(a):.1f}" cy="{cy - 0.3 * u + 0.55 * u * math.sin(a):.1f}" r="{0.42 * u:.1f}" fill="{col}44" stroke="{col}" stroke-width="{max(1, u * 0.06):.1f}"/>'
    o += f'<circle cx="{cx:.1f}" cy="{cy - 0.3 * u:.1f}" r="{0.3 * u:.1f}" fill="{AM}" stroke="{AM}"/>'
    return o


# =====================================================================
# 4.1.1 MAKSUD LUKISAN BERSKALA (buku SP 4.1.1)
# =====================================================================
s = '4.1.1'
c = COL[s]
o = GF.box(14, 14, 472, 442)
kl, jb = (150, 110), (360, 360)
o += f'<path d="M150 110 C 210 170, 170 230, 250 260 S 330 300, 360 360" fill="none" stroke="{PA}" stroke-width="4" stroke-dasharray="8 6"/>'
o += f'<circle cx="{kl[0]}" cy="{kl[1]}" r="9" fill="{TR}"/><circle cx="{jb[0]}" cy="{jb[1]}" r="9" fill="{TR}"/>'
o += GF.T(150, 82, 'Kuala Lumpur', TX, 18) + GF.T(360, 392, 'Johor Bahru', TX, 18)
o += GF.L((60, 420), (120, 420), AM, 4) + GF.L((60, 412), (60, 428), AM, 3) + GF.L((120, 412), (120, 428), AM, 3)
o += GF.T(90, 400, '1 cm', AM, 15) + GF.T(130, 421, ': 50 km', AM, 17, 'start')
S(s, 'DEFINISI', 'Lukisan berskala',
  p('Tahukah anda, peta yang terdapat dalam perisian yang dicipta untuk memudahkan perjalanan adalah dilukis mengikut suatu skala tertentu? Gambaran jarak yang ditunjukkan di antara dua buah bandar dalam perisian tersebut adalah berkadaran dengan jarak sebenar.')
  + p('Contohnya, jarak di antara Johor Bahru dengan Kuala Lumpur digambarkan dengan menggunakan skala 1 cm : 50 km.')
  + de(s, '<b>Lukisan Berskala</b> ialah lukisan suatu objek dengan keadaan semua ukuran dalam lukisan adalah berkadaran dengan ukuran pada objek.'),
  SV(o, 'Peta ringkas jarak Kuala Lumpur ke Johor Bahru dengan skala 1 cm kepada 50 km'))

# Contoh 1: objek PQRST dan tiga lukisan
U = 26
base = [(0, 0), (0, 4), (2, 2), (6, 2), (6, 0)]
o = ''
def draw1(x0, yb, k, col, title, lab=True):
    t = gp(x0, yb, U)
    pts = [t((a * k, b * k)) for a, b in base]
    r = grid(x0 - U, yb - (int(4 * k) + 1) * U, int(6 * k) + 2, int(4 * k) + 1, U)
    r += shape(pts, col, ['P', 'Q', 'R', 'S', 'T'] if lab else None, 14, 13)
    r += GF.T(pts[1][0] + 9, pts[1][1] + 2.2 * U * k + 4, '45°', TX, 12, 'start')
    r += GF.T(x0 + 3 * k * U, yb + 22, title, MU3, 15)
    return r
o += draw1(40, 150, 1, TR, 'Objek')
o += GF.rv(draw1(270, 150, 1, GR, 'Rajah 1', False))
o += GF.rv(draw1(40, 420, 0.5, AM, 'Rajah 2', False))
o += GF.rv(draw1(170, 420, 1.5, PK, 'Rajah 3', False))
S(s, 'CONTOH 1', 'Membandingkan lukisan dengan objek',
  p(f'Rajah di sebelah menunjukkan lukisan yang mewakili objek {i("PQRST")} yang dilukis dengan saiz yang berbeza. Apakah yang anda boleh nyatakan tentang saiz lukisan Rajah 1, Rajah 2 dan Rajah 3 berbanding objek {i("PQRST")}?')
  + pen(s, ['<b>Rajah 1:</b> Panjang semua sisi dan saiz semua sudut adalah sama dengan objek.',
            '<b>Rajah 2:</b> Panjang semua sisi berkurangan dengan suatu kadaran tertentu berbanding objek tetapi saiz semua sudut tidak berubah.',
            '<b>Rajah 3:</b> Panjang semua sisi bertambah dengan suatu kadaran tertentu berbanding objek tetapi saiz semua sudut tidak berubah.'], False),
  SV(o, 'Objek PQRST dan tiga lukisannya pada grid: saiz sama, dikecilkan dan dibesarkan'))
S(s, 'CONTOH 1 (sambungan)', 'Kesimpulan',
  p(f'Kesimpulannya, semua sisi lukisan pada Rajah 1, Rajah 2 dan Rajah 3 adalah mengikut suatu skala yang berkadaran dengan objek manakala saiz sudut tidak berubah. Maka, Rajah 1, Rajah 2 dan Rajah 3 ialah lukisan berskala bagi objek {i("PQRST")}.')
  + de(s, '<b>Lukisan Berskala</b> ialah lukisan suatu objek dengan keadaan semua ukuran dalam lukisan adalah berkadaran dengan ukuran pada objek.'),
  SV(o.replace('<g class="rv">', '<g>'), 'Objek PQRST dan tiga lukisan berskalanya pada grid'))

# =====================================================================
# 4.1.2 MENTAFSIR SKALA (buku SP 4.1.2 dan 4.1.3)
# =====================================================================
s = '4.1.2'
c = COL[s]
S(s, 'DEFINISI', 'Skala suatu lukisan berskala',
  p('Skala yang digunakan untuk melukis suatu lukisan berskala adalah mengikut nisbah ukuran lukisan berskala kepada ukuran objek, iaitu')
  + formula(f'Skala = {fr("Ukuran lukisan berskala", "Ukuran objek")}', c)
  + p('Nisbah ini juga boleh ditulis dalam bentuk; <b>Ukuran lukisan berskala : Ukuran objek</b>'),
  stack(p(f'Secara lazimnya, untuk lukisan berskala, kita menggunakan skala dalam bentuk nisbah <b>1 : {i("n")}</b> dengan keadaan {i("n")} ialah integer positif atau pecahan.')
        + de(s, f'1 : {i("n")} bermaksud satu unit pada lukisan berskala akan mewakili {i("n")} unit pada objek.')))

# konsep nilai n: objek PQ 4 unit, lukisan 1 : 1/2, 1 : 1, 1 : 2
o = ''
t0 = gp(30, 200, 22)
o += grid(30, 200 - 4 * 22, 6, 4, 22) + shape([t0(q) for q in [(1, 0), (5, 0), (1, 3)]], TR, ["P", "Q", "R"], 14, 13) + GF.T(96, 222, 'Objek', TR, 15)
o += GF.rv(grid(220, 200 - 7 * 22, 10, 7, 22) + shape([gp(220, 200, 22)(q) for q in [(1, 0), (9, 0), (1, 6)]], PK, None)
           + GF.T(330, 222, 'Lebih besar (<i>n</i> &lt; 1)', PK, 15))
o += GF.rv(grid(30, 400 - 4 * 22, 6, 4, 22) + shape([gp(30, 400, 22)(q) for q in [(1, 0), (5, 0), (1, 3)]], GR, None)
           + GF.T(96, 422, 'Sama saiz (<i>n</i> = 1)', GR, 15))
o += GF.rv(grid(270, 400 - 3 * 22, 4, 3, 22) + shape([gp(270, 400, 22)(q) for q in [(1, 0), (3, 0), (1, 1.5)]], AM, None)
           + GF.T(318, 422, 'Lebih kecil (<i>n</i> &gt; 1)', AM, 15))
S(s, 'KONSEP', f'Nilai {i("n")} dalam skala 1 : {i("n")}',
  p('Bandingkan panjang sisi lukisan berskala dengan panjang sisi objek yang sepadan.')
  + table(['Lukisan berskala', 'Objek', 'Skala'], [["P'Q' = 8 unit", 'PQ = 4 unit', f'8 : 4 = 1 : {fr(1, 2)}'], ["P'Q' = 4 unit", 'PQ = 4 unit', '4 : 4 = 1 : 1'],
                                                    ["P'Q' = 2 unit", 'PQ = 4 unit', '2 : 4 = 1 : 2']], c, 17, rvrows=(0, 1, 2))
  + p('Didapati bahawa;')
  + bul(s, [f'Jika {i("n")} &lt; 1, maka saiz lukisan berskala <b>lebih besar</b> daripada saiz objek.', f'Jika {i("n")} &gt; 1, maka saiz lukisan berskala <b>lebih kecil</b> daripada saiz objek.',
            f'Jika {i("n")} = 1, maka saiz lukisan berskala <b>sama</b> dengan saiz objek.']),
  SV(o, 'Objek segi tiga dan lukisan berskala yang lebih besar, sama saiz dan lebih kecil'))

# Contoh 2: PQRS objek, skala 1 : 3
U = 34
t = gp(40, 280, U)
o = grid(20, 280 - 7 * U, 13, 7, U)
o += shape([t(q) for q in [(0, 6), (3, 6), (6, 0), (0, 0)]], TR, ['P', 'Q', 'R', 'S'], 16)
t2 = gp(40 + 9 * U, 280, U)
o += shape([t2(q) for q in [(0, 2), (1, 2), (2, 0), (0, 0)]], AM, ["P'", "Q'", "R'", "S'"], 15, 14)
o += GF.T(250, 320, 'Objek PQRS dan lukisan berskala P\'Q\'R\'S\'', MU3, 15, halo=False)
S(s, 'CONTOH 2', 'Menyatakan skala',
  p(f'Rajah di sebelah menunjukkan objek {i("PQRS")} dan lukisan berskala {i("P′Q′R′S′")} yang dilukis pada grid segi empat sama. Nyatakan skala yang digunakan dalam bentuk 1 : {i("n")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'Skala = {fr(i("P′Q′"), i("PQ"))} = {fr(1, 3)} &nbsp; atau &nbsp; Skala = {fr(i("P′S′"), i("PS"))} = {fr(2, 6)} = {fr(1, 3)}', 'Maka, skala = 1 : 3'])], s, 1, 20)
  + formula(f'Skala = {fr("Ukuran lukisan berskala", "Ukuran objek")} = {fr(1, i("n"))}', c),
  SV(o, 'Trapezium PQRS pada grid dan lukisan berskala P aksen Q aksen R aksen S aksen yang lebih kecil'))

# Contoh 3: KLM, skala 4 : 1
U = 25
o = grid(12, 420 - 9 * U, 19, 9, U)
t = gp(37, 395, U)
o += shape([t(q) for q in [(0, 2), (0, 0), (3, 0)]], TR, ['K', 'L', 'M'], 15, 13)
t2 = gp(37 + 5 * U, 395, U)
o += shape([t2(q) for q in [(0, 8), (0, 0), (12, 0)]], AM, ["K'", "L'", "M'"], 15, 14)
S(s, 'CONTOH 3', 'Skala bagi lukisan yang dibesarkan',
  p(f'Rajah di sebelah menunjukkan objek {i("KLM")} dan lukisan berskala {i("K′L′M′")} yang dilukis pada grid segi empat sama. Nyatakan skala yang digunakan dalam bentuk 1 : {i("n")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'Skala = {fr(i("K′L′"), i("KL"))} = {fr(8, 2)} = {fr(4, 1)} &nbsp; atau &nbsp; Skala = {fr(i("L′M′"), i("LM"))} = {fr(12, 3)} = {fr(4, 1)}',
                f'Maka, skala = 4 : 1 = {fr(4, 4)} : {fr(1, 4)} = 1 : {fr(1, 4)}'])], s, 1, 20)
  + note('4 dibahagi dengan 4 untuk mendapatkan nilai 1.', 'Tip:'),
  SV(o, 'Segi tiga KLM pada grid dan lukisan berskala K aksen L aksen M aksen yang lebih besar'))

# Contoh 4: grid berlainan saiz 1 cm dan 3 cm
o = ''
uo, ul = 26, 84
o += GF.T(59, 60 + 4 * uo + 44, 'Objek', TR, 17) + grid(20, 60, 3, 4, uo)
t = gp(20, 60 + 4 * uo, uo)
o += shape([t(q) for q in [(1, 3), (0, 0), (2, 0)]], TR, ['P', 'Q', 'R'], 14, 12)
o += brace(20 + 2 * uo, 20 + 3 * uo, 56, '1 cm')
o += GF.T(356, 70 + 4 * ul + 44, 'Lukisan berskala', AM, 17) + grid(230, 70, 3, 4, ul)
t2 = gp(230, 70 + 4 * ul, ul)
o += shape([t2(q) for q in [(1, 3), (0, 0), (2, 0)]], AM, ["P'", "Q'", "R'"], 16, 16)
o += brace(230 + 2 * ul, 230 + 3 * ul, 64, '3 cm')
S(s, 'CONTOH 4', 'Grid yang berlainan saiz',
  p(f'Rajah di sebelah menunjukkan objek {i("PQR")} dan lukisan berskala {i("P′Q′R′")} yang dilukis pada grid segi empat sama yang berlainan saiz. Tentukan skala yang digunakan dalam bentuk 1 : {i("n")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('Kaedah 1', [f'Skala = {fr(i("Q′R′"), i("QR"))} = {fr("6 cm", "2 cm")} = {fr(3, 1)}', 'Skala = 3 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(1, 3)}']),
          ('Kaedah 2', [f'Skala = {fr("Saiz grid lukisan berskala", "Saiz grid objek")}', f'&emsp;&emsp;&ensp;= {fr("3 cm", "1 cm")} = {fr(3, 1)}', 'Skala = 3 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(1, 3)}'])], s, 2, 18)
  + note('Saiz grid digunakan kerana bilangan unit sisi objek dan sisi lukisan berskala sama.', 'Tip:'),
  SV(o, 'Segi tiga PQR pada grid 1 cm dan lukisan berskala pada grid 3 cm'))

# Contoh 5: KLMN, grid 2 cm → 0.5 cm, skala 1 : 4
assert math.isclose(math.hypot(4 * 0.5, 3 * 0.5), 2.5) and math.isclose(math.hypot(4 * 2, 3 * 2), 10)
o = ''
uo, ul = 40, 10
o += GF.T(160, 30, 'Objek', TR, 17) + grid(20, 60, 7, 7, uo)
t = gp(20, 60 + 7 * uo, uo)
kq = [(3, 7), (0, 3), (4, 0), (7, 4)]
o += shape([t(q) for q in kq], TR, ['K', 'L', 'M', 'N'], 15, 13)
o += brace(20 + 6 * uo, 20 + 7 * uo, 56, '2 cm')
o += GF.T(380, 330, 'Lukisan berskala', AM, 16) + grid(345, 355, 7, 7, ul)
t2 = gp(345, 355 + 7 * ul, ul)
o += shape([t2(q) for q in kq], AM, ["K'", "L'", "M'", "N'"], 12, 10, 2)
o += GF.T(440, 400, '0.5 cm', MU3, 13, 'start', halo=False)
S(s, 'CONTOH 5', 'Grid yang berlainan saiz',
  p(f'Rajah di sebelah menunjukkan objek {i("KLMN")} dan lukisan berskala {i("K′L′M′N′")} yang dilukis pada grid segi empat sama yang berlainan saiz. Tentukan skala yang digunakan.')
  + work([('Kaedah 1', [f'Skala = {fr(i("K′N′"), i("KN"))} = {fr("2.5 cm", "10 cm")} = {fr(1, 4)}', f'Skala = {fr(1, 4)} : 1',
                        f'&emsp;&emsp;&ensp;= {fr(1, 4)} × 4 : 1 × 4', '&emsp;&emsp;&ensp;= 1 : 4', f'({fr(1, 4)} didarab dengan 4 untuk mendapatkan nilai 1.)']),
          ('Kaedah 2', [f'Skala = {fr("Saiz grid lukisan berskala", "Saiz grid objek")}', f'&emsp;&emsp;&ensp;= {fr("0.5 cm", "2 cm")} = {fr(1, 4)}', f'Skala = {fr(1, 4)} : 1',
                        '&emsp;&emsp;&ensp;= 1 : 4'])], s, 2, 18)
  + note(f'{i("K′N′")} = {sq("1.5² + 2²")} = 2.5 cm &nbsp; dan &nbsp; {i("KN")} = {sq("6² + 8²")} = 10 cm', 'Imbas kembali:'),
  SV(o, 'Sisi empat KLMN pada grid 2 cm dan lukisan berskala pada grid 0.5 cm'))

# Contoh 6: peta 1 : 250 000, 4 cm → 10 km
assert 4 * 250000 == 1000000
S(s, 'CONTOH 6', 'Jarak sebenar daripada peta',
  p(f'Sebuah peta dilukis dengan skala 1 : 250 000. Hitung jarak sebenar, dalam km, sebatang sungai yang panjangnya 4 cm pada peta tersebut.')
  + p('<b>Penyelesaian:</b>')
  + work([('Kaedah 1', [f'{fr("1 cm", "250 000 cm")} = {fr("4 cm", "Jarak sebenar")}', f'Jarak sebenar = {fr("4 × 250 000 cm", "1 cm")}', '&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;= 1 000 000 cm', '&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;= 10 km'])], s, 1, 20)
  + note('1 km = 1 000 m, 1 m = 100 cm, maka 1 km = 100 000 cm.', 'Imbas kembali:'),
  stack(work([('Kaedah 2', ['Lukisan berskala : Objek', '1 : 250 000', '1 cm : 250 000 cm', '1 cm : 2.5 km &emsp;(× 4)', '4 cm : 10 km', 'Maka, jarak sebenar sungai ialah 10 km.'])], s, 1, 20)))

# Contoh 7: peta Pahang 1 cm : 15 km, 3 cm → 45 km
S(s, 'CONTOH 7', 'Skala dalam unit berlainan',
  p('Peta negeri Pahang dilukis dengan skala 1 cm kepada 15 km. Hitung jarak sebenar di antara Kuantan dengan Pekan jika jarak di atas peta ialah 3 cm.')
  + p('<b>Penyelesaian:</b>')
  + work([('Kaedah 1', [f'Skala = {fr("Jarak pada lukisan", "Jarak sebenar")}', f'{fr("1 cm", "15 km")} = {fr("3 cm", "Jarak sebenar")}',
                        f'Jarak sebenar = {fr("3 cm (15 km)", "1 cm")}', 'Jarak sebenar = 45 km'])], s, 1, 20),
  stack(work([('Kaedah 2', ['Lukisan berskala : Objek', '1 cm : 15 km &emsp;(× 3)', '3 cm : 45 km', 'Maka, jarak sebenar ialah 45 km.'])], s, 1, 20)))

# Contoh 8: Haikal, skala 1 : 1/4, sisi sebenar 5 cm → 20 cm
S(s, 'CONTOH 8', 'Ukuran lukisan berskala',
  p(f'Haikal melukis segi empat sama dengan skala 1 : {fr(1, 4)}. Jika panjang sebenar sisi segi empat sama tersebut ialah 5 cm, berapakah panjang sisi, dalam cm, lukisan berskala?')
  + p('<b>Penyelesaian:</b>')
  + work([('Kaedah 1', [f'Skala = {fr("Sisi lukisan berskala", "Sisi objek yang sepadan")}', f'{fr(1, fr(1, 4))} = {fr("Sisi lukisan berskala", "5 cm")}',
                        'Sisi lukisan berskala = 4 × 5 cm', 'Panjang sisi lukisan berskala = 20 cm'])], s, 1, 20),
  stack(work([('Kaedah 2', ['Lukisan berskala : Objek', f'1 : {fr(1, 4)} &emsp;(× 20)', '20 cm : 5 cm', 'Maka, panjang sisi dalam lukisan berskala ialah 20 cm.'])], s, 1, 20)))

# =====================================================================
# 4.1.3 MELUKIS LUKISAN BERSKALA (buku SP 4.1.4)
# =====================================================================
s = '4.1.3'
c = COL[s]
o = ''
sh = [(0, 0), (3, 0), (3, 2), (1, 2)]
o += GF.T(130, 34, '(a) Grid sama saiz, skala berlainan', MU3, 15, halo=False) + grid(40, 52, 12, 5, 20)
o += shape([gp(60, 132, 20)(q) for q in sh], TR, None) + shape([gp(160, 152, 20)(q) for q in [(a * 2, b * 2) for a, b in sh]], GR, None)
o += GF.T(140, 200, '(b) Grid berlainan saiz', MU3, 15, halo=False) + grid(40, 218, 4, 3, 20) + grid(160, 218, 4, 3, 40)
o += shape([gp(40, 278, 20)(q) for q in sh], TR, None) + shape([gp(160, 338, 40)(q) for q in sh], GR, None)
o += GF.T(150, 372, '(c) Kertas kosong ikut skala', MU3, 15, halo=False)
o += shape([(60, 450), (240, 450), (240, 400), (120, 400)], GR, None) + GF.T(150, 462, '9 cm', GR, 13) + GF.T(252, 425, '3 cm', GR, 13, 'start')
S(s, 'KONSEP', 'Melukis lukisan berskala bagi suatu objek',
  p('Lukisan berskala suatu objek boleh dilukis dengan tiga cara.')
  + bul(s, ['(a) Menggunakan kertas grid yang sama saiz bagi skala yang berlainan atau;', '(b) Menggunakan kertas grid yang berlainan saiz atau;',
            '(c) Melukis di atas kertas kosong mengikut skala yang diberi.']),
  SV(o, 'Tiga cara melukis lukisan berskala: grid sama saiz, grid berlainan saiz dan kertas kosong'))

# Contoh 9: PQRS skala 1 : 1/3
U = 32
o = grid(20, 60, 4, 4, U)
t = gp(20 + U, 60 + 3 * U, U)
o += shape([t(q) for q in [(0, 0), (2, 0), (2, 2), (0, 1)]], TR, ['P', 'Q', 'R', 'S'], 14, 12)
o += GF.T(84, 40, 'Objek', TR, 16)
t2 = gp(170 + U, 60 + 8 * U - U, U)
o += GF.rv(grid(170, 60, 9, 8, U) + shape([t2(q) for q in [(0, 0), (6, 0), (6, 6), (0, 3)]], GR, ["P'", "Q'", "R'", "S'"], 15, 14))
S(s, 'CONTOH 9', 'Melukis pada grid sama saiz',
  p(f'Lukiskan lukisan berskala bagi bentuk {i("PQRS")} di sebelah pada grid segi empat sama dengan skala 1 : {fr(1, 3)}.')
  + pen(s, [f'Skala yang diberi ialah 1 : {fr(1, 3)}. Maka, setiap sisi lukisan berskala ialah tiga kali lebih panjang berbanding panjang sisi objek {i("PQRS")}.',
            f'{i("P′Q′")} = 3 × 2 = 6 unit, &nbsp;{i("Q′R′")} = 3 × 2 = 6 unit, &nbsp;{i("P′S′")} = 3 × 1 = 3 unit.'])
  + note('Jika anda perlu melukis lukisan berskala bagi padang sekolah anda, apakah skala yang sesuai dipilih? Kenapa?', 'Kuiz:'),
  SV(o, 'Bentuk PQRS pada grid dan lukisan berskala tiga kali lebih besar'))

# Contoh 10: ΔPQR grid 1 cm → 2.5 cm dan 0.5 cm
o = ''
tri = [(0, 0), (1, 3), (4, 0)]
u1 = 26
o += GF.T(70, 44 + 3 * u1 + 22, 'Objek (1 cm)', TR, 15) + grid(18, 44, 4, 3, u1) + shape([gp(18, 44 + 3 * u1, u1)(q) for q in tri], TR, ['P', 'Q', 'R'], 13, 11)
o += GF.rv(GF.T(380, 50 + 39 + 24, '(a)(ii) 0.5 cm', AM, 15) + grid(354, 50, 4, 3, 13) + shape([gp(354, 50 + 39, 13)(q) for q in tri], AM, ["P'", "Q'", "R'"], 12, 10, 2))
o += GF.rv(GF.T(250, 194 + 195 + 26, '(a)(i) 2.5 cm', GR, 15) + grid(120, 194, 4, 3, 65) + shape([gp(120, 194 + 195, 65)(q) for q in tri], GR, ["P'", "Q'", "R'"], 15, 15))
S(s, 'CONTOH 10', 'Melukis pada grid berlainan saiz',
  p(f'(a) Rajah ∆{i("PQR")} di sebelah dilukis pada grid 1 cm × 1 cm. Lukiskan semula ∆{i("PQR")} di atas kertas grid berukuran (i) 2.5 cm × 2.5 cm (ii) 0.5 cm × 0.5 cm')
  + p(f'(b) Hitung skala yang digunakan dalam soalan (a)(i) dan (a)(ii) dalam bentuk 1 : {i("n")}.')
  + work([('(b)(i)', [f'Skala = {fr("Saiz grid lukisan berskala", "Saiz grid objek")}', f'&emsp;&emsp;&ensp;= {fr("2.5 cm", "1 cm")}', 'Skala = 2.5 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(2, 5)}']),
          ('(b)(ii)', [f'Skala = {fr("Saiz grid lukisan berskala", "Saiz grid objek")}', f'&emsp;&emsp;&ensp;= {fr("0.5 cm", "1 cm")}', 'Skala = 0.5 : 1', '&emsp;&emsp;&ensp;= 1 : 2'])], s, 2, 17),
  SV(o, 'Segi tiga PQR pada grid 1 cm dilukis semula pada grid 2.5 cm dan 0.5 cm'))

# Contoh 11: bina segi tiga, PQ = 8 cm, QR = 5 cm, sudut P = 30°, skala 1 : 2
a30 = math.radians(30)
pr_o = 8 * math.cos(a30) + math.sqrt(25 - (8 * math.sin(a30)) ** 2)   # sisi PR objek (penyelesaian yang lebih panjang)
assert math.isclose(math.dist((pr_o * math.cos(a30), pr_o * math.sin(a30)), (8, 0)), 5)
k = 26  # px per cm
P0 = (40, 190); Q0 = (P0[0] + 8 * k, P0[1]); R0 = (P0[0] + pr_o * k * math.cos(a30), P0[1] - pr_o * k * math.sin(a30))
o = shape([P0, Q0, R0], TR, ['P', 'Q', 'R'], 15, 14)
o += GF.T((P0[0] + Q0[0]) / 2, P0[1] + 22, '8 cm', TR, 15) + GF.T((Q0[0] + R0[0]) / 2 + 12, (Q0[1] + R0[1]) / 2, '5 cm', TR, 15, 'start')
o += GF.T(P0[0] + 54, P0[1] - 12, '30°', TX, 14) + GF.T(150, 34, 'Objek', TR, 16)
P1 = (60, 410); Q1 = (P1[0] + 4 * k, P1[1]); R1 = (P1[0] + pr_o / 2 * k * math.cos(a30), P1[1] - pr_o / 2 * k * math.sin(a30))
o += GF.rv(GF.L(P1, Q1, GR, 3.5) + GF.T((P1[0] + Q1[0]) / 2, P1[1] + 22, '4 cm', GR, 15) + GF.T(P1[0] - 14, P1[1], "P'", TX, 15) + GF.T(Q1[0] + 14, Q1[1] + 4, "Q'", TX, 15))
ray = (P1[0] + 170 * math.cos(a30), P1[1] - 170 * math.sin(a30))
o += GF.rv(GF.L(P1, ray, MU3, 2, '6 5') + arc(P1[0], P1[1], 40, 0, 30, AM, True, 2.5) + GF.T(P1[0] + 64, P1[1] - 14, '30°', AM, 14))
o += GF.rv(f'<path d="M{R1[0] - 22:.1f} {R1[1] - 10:.1f} A {2.5 * k:.1f} {2.5 * k:.1f} 0 0 1 {R1[0] + 18:.1f} {R1[1] + 14:.1f}" fill="none" stroke="{PU}" stroke-width="2.5"/>'
           + GF.L(Q1, R1, GR, 3.5) + GF.L(P1, R1, GR, 3.5) + GF.T(R1[0] + 8, R1[1] - 16, "R'", TX, 15) + GF.T((Q1[0] + R1[0]) / 2 + 12, (Q1[1] + R1[1]) / 2 + 4, '2.5 cm', GR, 14, 'start'))
o += GF.T(330, 300, 'Lukisan berskala', GR, 16)
S(s, 'CONTOH 11', 'Membina lukisan berskala',
  p(f'Bina lukisan berskala bagi segi tiga {i("PQR")} dengan skala 1 : 2.')
  + pen(s, [f'Skala 1 : 2, maka setiap sisi lukisan berskala ialah separuh daripada sisi objek: {i("P′Q′")} = 8 cm ÷ 2 = 4 cm dan {i("Q′R′")} = 5 cm ÷ 2 = 2.5 cm.',
            f'Lukis garis {i("P′Q′")} = 4 cm dan bina ∠{i("R′P′Q′")} = 30° di {i("P′")}.',
            f'Dengan {i("Q′")} sebagai pusat, lukis lengkok berjejari 2.5 cm yang menyilang garis sudut itu di {i("R′")}. Sambungkan {i("Q′R′")}.'])
  + note('Bagi objek yang diberi nilai sudut tertentu, sudut lukisan berskala perlu dibina dengan tepat dan panjang sisi dilukis mengikut skala.'),
  SV(o, 'Segi tiga PQR dengan PQ 8 cm, QR 5 cm dan sudut P 30 darjah, serta pembinaan lukisan berskala 1 : 2'))

# Contoh 12: lukisan berskala skala 1 : 2 → objek
U = 30
lk = [(0, 0), (5, 0), (5, 3), (3, 1), (1, 1)]
o = GF.T(110, 26, 'Lukisan berskala', AM, 15) + grid(20, 40, 7, 5, U)
o += shape([gp(20 + U, 40 + 4 * U, U)(q) for q in lk], AM, ["P'", "Q'", "R'", "S'", "T'"], 13, 12, 2.5)
o += GF.rv(grid(70, 205, 12, 8, U) + shape([gp(70 + U, 205 + 7 * U, U)(q) for q in [(a * 2, b * 2) for a, b in lk]], TR, ['P', 'Q', 'R', 'S', 'T'], 15, 14)
           + GF.T(250, 460, 'Objek sebenar', TR, 15))
S(s, 'CONTOH 12', 'Melukis objek bagi suatu lukisan berskala',
  p(f'Rajah di sebelah menunjukkan lukisan berskala yang dilukis pada grid segi empat sama mengikut skala 1 : 2. Lukiskan objek sebenar bagi {i("P′Q′R′S′T′")}.')
  + pen(s, ['Skala yang digunakan ialah 1 : 2 iaitu saiz lukisan berskala dua kali lebih kecil daripada objek. Maka, setiap sisi objek sebenar ialah dua kali lebih panjang daripada sisi lukisan berskala.',
            f'{i("PQ")} = 2 × 5 = 10 unit, &nbsp;{i("QR")} = 2 × 3 = 6 unit.']),
  SV(o, 'Lukisan berskala P aksen Q aksen R aksen S aksen T aksen dan objek sebenar dua kali lebih besar'))

# Contoh 13: lukisan bunga grid 1 cm → objek pada grid 0.5 cm dan 2 cm
o = ''
u1 = 24
o += GF.T(68, 40 + 4 * u1 + 18, 'Lukisan (1 cm)', MU3, 14, halo=False)
o += grid(20, 40, 4, 4, u1) + flower(20 + 2 * u1, 40 + 1.6 * u1, u1, PK)
o += GF.rv(GF.T(204, 40 + 2 * u1 + 18, '(a) 0.5 cm', AM, 14) + grid(180, 40, 4, 4, u1 / 2) + flower(180 + u1, 40 + 0.8 * u1, u1 / 2, PK))
o += GF.rv(GF.T(250, 178 + 8 * u1 + 22, '(b) 2 cm', GR, 15) + grid(154, 178, 4, 4, u1 * 2) + flower(154 + 4 * u1, 178 + 3.2 * u1, u1 * 2, PK))
S(s, 'CONTOH 13', 'Objek pada grid berlainan saiz',
  p('Rajah di sebelah menunjukkan lukisan berskala sekuntum bunga yang dilukis pada grid berukuran 1 cm × 1 cm. Lukiskan objek sebenar bunga tersebut pada grid berukuran (a) 0.5 cm × 0.5 cm (b) 2 cm × 2 cm')
  + pen(s, ['Objek perlu dilukis pada grid berlainan saiz. Maka, bilangan unit bagi sisi objek adalah sama dengan bilangan unit sisi lukisan berskala.',
            'Lukis setiap bahagian bunga dalam petak yang sama kedudukannya pada grid (a) 0.5 cm × 0.5 cm dan (b) 2 cm × 2 cm.']),
  SV(o, 'Lukisan bunga pada grid 1 cm dilukis semula pada grid 0.5 cm dan 2 cm'))

# =====================================================================
# 4.1.4 PENYELESAIAN MASALAH (buku SP 4.1.5)
# =====================================================================
s = '4.1.4'
c = COL[s]
assert 3.5 * 60 == 210 and 210 * 100000 / 3000000 == 7 and 210 / 90 * 60 == 140
S(s, 'CONTOH 14', 'Menyelesaikan masalah lukisan berskala',
  p('Jarak di antara Kuantan dengan Kuala Terengganu di atas suatu peta ialah 3.5 cm.')
  + p('(a) Jika skala yang digunakan untuk melukis peta itu ialah 1 cm : 60 km, hitung jarak sebenar, dalam km, di antara Kuantan dengan Kuala Terengganu.')
  + p('(b) Jika peta dilukis semula dengan skala 1 : 3 000 000, hitung jarak di antara Kuantan dengan Kuala Terengganu di atas peta baru.')
  + p('(c) Encik Faizal bersama keluarganya ingin melawat bandar Kuala Terengganu. Jika beliau bercadang untuk memandu ke Kuala Terengganu dengan kelajuan 90 km j<sup>−1</sup>, hitung masa yang diperlukan untuk perjalanan dari Kuantan ke Kuala Terengganu dalam jam dan minit.'),
  stack(work([('Memahami masalah', ['• Jarak sebenar bagi jarak 3.5 cm yang dilukis dengan skala 1 cm : 60 km.', '• Jarak pada lukisan berskala yang dilukis dengan skala 1 : 3 000 000.',
                                    '• Tempoh masa dalam jam dan minit bagi perjalanan dari Kuantan ke Kuala Terengganu dengan kelajuan 90 km j<sup>−1</sup>.']),
              ('Merancang strategi', [f'Skala = {fr("Jarak pada lukisan", "Jarak sebenar")} &emsp; Masa = {fr("Jarak", "Laju")}'])], s, 1, 18),
        note('Jika skala lukisan berskala dan kehendak soalan dalam unit yang sama, misalnya km maka, skala tidak perlu ditukar kepada unit cm.', 'Tip:')))

S(s, 'CONTOH 14 (sambungan)', 'Melaksanakan strategi',
  work([('(a)', [f'Skala = {fr("Jarak pada lukisan", "Jarak sebenar")}', f'{fr("1 cm", "60 km")} = {fr("3.5 cm", "Jarak sebenar")}', f'Jarak sebenar = {fr("3.5 cm (60 km)", "1 cm")} = 210 km']),
        ('(b)', [f'{fr(1, "3 000 000")} = {fr("Jarak pada lukisan", "210 km")}', f'Jarak pada lukisan = {fr("(210 × 100 000) cm", "(3 000 000) cm")} = 7 cm']),
        ('(c)', [f'Masa = {fr("210 km", "90 km j<sup>−1</sup>")} = 2{fr(1, 3)} jam', 'Tempoh masa = 2 jam 20 minit'])], s, 1, 19),
  stack(work([('Membuat kesimpulan', ['• Jarak sebenar di antara Kuantan dengan Kuala Terengganu ialah 210 km.',
                                      '• Jarak di antara Kuantan dengan Kuala Terengganu pada peta dengan skala 1 : 3 000 000 ialah 7 cm.',
                                      '• Tempoh masa yang diperlukan oleh Encik Faizal untuk memandu dari Kuantan ke Kuala Terengganu dengan kelajuan 90 km j<sup>−1</sup> ialah 2 jam dan 20 minit.'])], s, 1, 18),
        note(f'Laju = {fr("Jarak", "Masa")}', 'Imbas kembali:')))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'berskala', 'slides.js')
HEAD = '/* Nota Bab 4 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
