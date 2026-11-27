"""Bab 5 T5 Kekongruenan, Pembesaran dan Gabungan Transformasi. Nota ikut buku teks Matematik T5 KSSM
(ayat buku, nombor, nama dan rajah ditukar; semua transformasi disemak dengan kiraan). CONTOH 1–22 ikut buku.
SUBS folder kekongruenan dikekalkan (5.1–5.4)."""
import os, sys, math
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "5.1", "name": "Kekongruenan", "col": "#38BDF8"}, {"no": "5.2", "name": "Pembesaran", "col": "#F472B6"}, {"no": "5.3", "name": "Gabungan Transformasi", "col": "#34D399"}, {"no": "5.4", "name": "Teselasi", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
T_, L_ = GF.T, GF.L
GRID, GRID2 = GF.GRID, GF.GRID2


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def f1(v):
    return f'{v:.1f}'


# ---------- transformasi (disemak dengan Fraction) ----------
def tr(v):
    return lambda p: (p[0] + v[0], p[1] + v[1])


def rot(c, deg):  # deg > 0 lawan arah jam
    k = {90: (0, -1, 1, 0), -90: (0, 1, -1, 0), 180: (-1, 0, 0, -1)}[deg]
    return lambda p: (c[0] + k[0] * (p[0] - c[0]) + k[1] * (p[1] - c[1]), c[1] + k[2] * (p[0] - c[0]) + k[3] * (p[1] - c[1]))


def ref(kind, a=0):
    return {'x': lambda p: (2 * a - p[0], p[1]), 'y': lambda p: (p[0], 2 * a - p[1]), 'yx': lambda p: (p[1], p[0])}[kind]


def enl(c, k):
    k = Fr(k)
    return lambda p: (c[0] + k * (p[0] - c[0]), c[1] + k * (p[1] - c[1]))


def ap(f, pts):
    return [f(q) for q in pts]


def area(pts):
    return abs(sum(Fr(pts[i][0]) * pts[(i + 1) % len(pts)][1] - Fr(pts[(i + 1) % len(pts)][0]) * pts[i][1] for i in range(len(pts)))) / 2


def cs(q):
    def n(v):
        v = Fr(v)
        return mn(v) if v.denominator == 1 else f'{float(v):g}'.replace('-', '−')
    return f'({n(q[0])}, {n(q[1])})'


mn = GF.mn


# ---------- lukisan ----------
def poly(g, pts, col, lab='', dash=None, fill=True, ls=17, lo=(0, 0)):
    P = [g.P(*q) for q in pts]
    d = f' stroke-dasharray="{dash}"' if dash else ''
    s = f'<polygon points="{" ".join(f"{f1(a)},{f1(b)}" for a, b in P)}" fill="{col + "33" if fill else "none"}" stroke="{col}" stroke-width="3" stroke-linejoin="round"{d}/>'
    if lab:
        cx = sum(a for a, _ in P) / len(P) + lo[0]; cy = sum(b for _, b in P) / len(P) + lo[1]
        s += T_(cx, cy, lab, col, ls)
    g.add(s)
    return g


def gsvg(g, aria, pad=34):
    xs = [g.L - pad, g.R + pad]
    return f'<svg class="sl-svg" viewBox="0 {f1(g.T_ - 40)} 500 {f1(g.B - g.T_ + 70)}" role="img" aria-label="{aria}">{g.svg()}</svg>'


def plain(bx, xr, yr):
    """grid tanpa paksi (untuk pembesaran pada pusat P)."""
    g = GF.Gr(bx, xr, yr, labels=False, equal=True)
    L0, T0, R0, B0 = g.L, g.T_, g.R, g.B
    g.out = []
    for x in range(xr[0], xr[1] + 1):
        g.out.append(L_((g.X(x), g.T_), (g.X(x), g.B), GRID2, 1.2))
    for y in range(yr[0], yr[1] + 1):
        g.out.append(L_((g.L, g.Y(y)), (g.R, g.Y(y)), GRID2, 1.2))
    return g


def shape(pts, names, col, sides=(), angs=(), ra=(), fill=True):
    """bentuk dalam koordinat skrin; label bucu ke luar; sides = [(i, j, teks)], angs = [(i, teks)], ra = [i] sudut tegak."""
    cx = sum(a for a, _ in pts) / len(pts); cy = sum(b for _, b in pts) / len(pts)
    s = f'<polygon points="{" ".join(f"{f1(a)},{f1(b)}" for a, b in pts)}" fill="{col + "26" if fill else "none"}" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>'
    for (a, b), nm in zip(pts, names):
        dx, dy = a - cx, b - cy; r = math.hypot(dx, dy) or 1
        s += T_(a + 17 * dx / r, b + 17 * dy / r, nm, TX, 17)
    for i, j, t in sides:
        (a, b), (c_, d) = pts[i], pts[j]
        mx, my = (a + c_) / 2, (b + d) / 2
        nx, ny = mx - cx, my - cy; r = math.hypot(nx, ny) or 1
        s += T_(mx + 22 * nx / r, my + 20 * ny / r, t, MU3, 15, w=600)
    n = len(pts)
    for i, t in angs:
        a, b = pts[i]
        s += T_(a + 0.3 * (cx - a), b + 0.3 * (cy - b), t, AM, 14, w=600)
    for i in ra:
        a, b = pts[i]; p1, p2 = pts[i - 1], pts[(i + 1) % n]
        u = ((p1[0] - a), (p1[1] - b)); v = ((p2[0] - a), (p2[1] - b))
        lu, lv = math.hypot(*u), math.hypot(*v); u = (12 * u[0] / lu, 12 * u[1] / lu); v = (12 * v[0] / lv, 12 * v[1] / lv)
        s += f'<path d="M{f1(a + u[0])} {f1(b + u[1])} L{f1(a + u[0] + v[0])} {f1(b + u[1] + v[1])} L{f1(a + v[0])} {f1(b + v[1])}" fill="none" stroke="{MU3}" stroke-width="2"/>'
    return s


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Membuat kesimpulan', d)], s, 2, fs)


# =====================================================================
# 5.1 KEKONGRUENAN
# =====================================================================
s = '5.1'
c = COL[s]
f0 = shape([(40, 250), (200, 250), (200, 120), (60, 110)], 'ABCD', TR, angs=[]) + shape([(300, 250), (460, 250), (440, 110), (300, 120)], 'RQPS', PK)
S(s, 'DEFINISI', 'Membezakan bentuk kongruen dan bukan kongruen',
  p('Pasangan objek yang mempunyai saiz dan bentuk yang sama walaupun kedudukan atau susunannya berlainan dikatakan <b>kongruen</b>.')
  + de(s, 'Dua poligon yang kongruen mempunyai ukuran yang sama pada <b>panjang sisi sepadan</b> dan <b>sudut sepadan</b>.')
  + table(['Panjang sisi sepadan', 'Sudut sepadan'], [['AB = RQ', '∠BAD = ∠QRS'], ['BC = QP', '∠ABC = ∠RQP'], ['CD = PS', '∠BCD = ∠QPS'], ['AD = RS', '∠ADC = ∠RSP']], c, 16),
  stack(SVh(f0, 'Sisi empat ABCD dan PQRS yang kongruen', 190, 90),
        note('Jika terdapat satu daripada panjang sisi sepadan atau sudut sepadan yang tidak sama antara dua bentuk, maka kedua-dua bentuk itu bukan kongruen.', 'Ingat:')))

assert math.isclose(math.degrees(math.atan(15 / 8)), 61.93, abs_tol=0.01) and 8 ** 2 + 15 ** 2 == 17 ** 2
fa = shape([(40, 230), (120, 230), (40, 80)], 'ABC', TR, sides=[(0, 1, '8 cm'), (0, 2, '15 cm')], angs=[(2, '28.1°')], ra=[0]) \
    + shape([(330, 230), (330, 80), (250, 80)], 'PRQ', PK, sides=[(0, 1, '15 cm'), (0, 2, '17 cm')], angs=[(2, '61.9°')], ra=[1])
fb = shape([(40, 400), (190, 400), (115, 300)], 'ABC', TR, angs=[(0, '65°'), (1, '65°')]) + shape([(260, 400), (410, 400), (335, 300)], 'PQR', PK, angs=[(2, '55°')])
assert 180 - 65 - 65 == 50
S(s, 'CONTOH 1', 'Menentukan pasangan rajah kongruen',
  p('Tentukan sama ada setiap pasangan rajah yang berikut adalah kongruen.')
  + work([('(a)', [f'BC = {sq("8² + 15²")} = 17 cm = QP dan ∠ABC = 180° − 90° − 28.1° = 61.9° = ∠PQR', 'Ukuran semua panjang sisi sepadan dan sudut sepadan adalah sama. Maka, kedua-dua rajah itu adalah kongruen.']),
          ('(b)', ['∠ACB = 180° − 65° − 65° = 50° ≠ ∠PRQ', 'Maka, kedua-dua rajah itu bukan kongruen.'])], s, 1, 17),
  SVh(T_(20, 50, '(a)', MU, 16) + fa + T_(20, 290, '(b)', MU, 16) + fb, 'Dua pasangan segi tiga', 400, 30))

S(s, 'KONSEP', 'Sifat kekongruenan segi tiga',
  table(['Sifat', 'Syarat'], [['Sisi-Sisi-Sisi (SSS)', 'Setiap sisi sepadan adalah sama panjang.'], ['Sisi-Sudut-Sisi (SAS)', 'Dua sisi sepadan adalah sama panjang dan sudut sepadan yang tercangkum antara dua sisi itu adalah sama saiz.'],
                              ['Sudut-Sisi-Sudut (ASA)', 'Dua sudut sepadan adalah sama saiz dan satu sisi sepadan di antara kedua-dua sudut itu adalah sama panjang.'],
                              ['Sudut-Sudut-Sisi (AAS)', 'Dua sudut sepadan adalah sama saiz dan satu daripada sisi sepadan yang bukan terletak di antara dua sudut itu adalah sama panjang.']], c, 15, False),
  stack(table(['Sifat', 'Syarat'], [['Sudut-Sudut-Sudut (AAA)', 'Ketiga-tiga sudut sepadan adalah sama saiz; luas pasangan segi tiga mestilah sama.'],
                                    ['Sisi-Sisi-Sudut (SSA)', 'Dua sisi sepadan sama panjang dan satu sudut sepadan yang bukan tercangkum sama saiz; luas pasangan segi tiga mestilah sama.']], c, 15, False),
        note('Sudut Tegak-Hipotenus-Sisi (RHS) ialah sifat kekongruenan khas untuk segi tiga bersudut tegak: hipotenus dan satu sisi sepadan bukan hipotenus yang sama.', 'Info:')))

f3 = shape([(40, 200), (190, 200), (150, 90)], 'ABC', TR) + shape([(270, 200), (420, 200), (380, 90)], 'DEF', PK)
S(s, 'CONTOH 2 – 4', 'Mengenal pasti sifat kekongruenan segi tiga',
  work([('CONTOH 2', ['Dua segi tiga mempunyai dua sisi sepadan dan satu sudut sepadan (bukan tercangkum) yang sama, tetapi luasnya tidak sama. Adakah kedua-duanya kongruen?', 'Tidak. Ukuran sisi dan sudut yang lain adalah berbeza. Luas adalah tidak sama.']),
        ('CONTOH 3', ['Segi tiga ABC dan DEF adalah kongruen dengan sifat Sudut-Sisi-Sudut (ASA). Diberi ∠ACB = ∠DFE. Lengkapkan ciri-ciri lain.', 'Sisi: BC = EF; Sudut: ∠ABC = ∠DEF', 'atau Sisi: AC = DF; Sudut: ∠BAC = ∠EDF'])], s, 1, 16),
  stack(SVh(f3, 'Segi tiga ABC dan DEF', 160, 65),
        work([('CONTOH 4', ['Segi tiga XYZ dan KLM mempunyai bentuk dan saiz yang sama. Nyatakan sifat kekongruenan jika', '(a) ∠XZY = ∠KML, ∠XYZ = ∠KLM, XY = KL → AAS', '(b) XZ = KM, YZ = LM, XY = KL → SSS', '(c) XY = KL, ∠YXZ = ∠LKM, XZ = KM → SAS'])], s, 1, 16)))

f5 = shape([(60, 330), (440, 330), (250, 60)], 'KLM', TR, sides=[]) + GF.L((250, 60), (345, 195), PK, 2.5) + GF.L((250, 60), (155, 195), PK, 2.5) \
    + GF.L((60, 330), (345, 195), AM, 3) + GF.L((440, 330), (155, 195), GR, 3) + T_(130, 190, 'A', TX, 17) + T_(370, 190, 'B', TX, 17)
S(s, 'CONTOH 5', 'Membuktikan dua segi tiga kongruen',
  p('Rajah menunjukkan satu segi tiga sama kaki KLM dengan keadaan KM = LM. A dan B masing-masing ialah titik tengah bagi sisi KM dan LM. Tunjukkan bahawa segi tiga KBM dan LAM adalah kongruen.')
  + work([('Penyelesaian', ['KM = LM (diberi)', '∠KMB = ∠LMA (sudut sepunya)', f'BM = {F("1", "2")}LM = {F("1", "2")}KM = AM', 'Segi tiga KBM dan LAM memenuhi sifat Sisi-Sudut-Sisi (SAS). Maka, segi tiga KBM dan LAM adalah kongruen.'])], s, 1, 17)
  + note('Dalam bidang kejuruteraan, konsep kekongruenan segi tiga digunakan untuk membina penyokong jambatan supaya jambatan itu dapat disokong dalam keadaan yang seimbang.', 'Info:'),
  SVh(f5, 'Segi tiga sama kaki KLM', 330, 30))

DC, AD, h6 = 16, 17, 15
x6 = int(math.isqrt(AD ** 2 - h6 ** 2))
CS = 96 - DC - AD - DC - AD
AB6 = DC + x6
assert x6 == 8 and CS == 30 and CS == 2 * h6 and 2 * Fr(1, 2) * (DC + AB6) * h6 == 600 and CS * DC + Fr(1, 2) * CS * x6 == 600
f6 = '<g transform="translate(60 10) scale(0.85)">' + shape([(100, 40), (260, 40), (260, 190), (20, 190)], ['D', 'C', 'B/P', 'A/Q'], TR, sides=[(0, 1, '16 cm'), (0, 3, '17 cm')], ra=[1]) \
    + shape([(260, 190), (260, 340), (100, 340), (20, 190)], ['', 'S', 'R', ''], PK, sides=[(1, 2, '16 cm'), (2, 3, '17 cm')], ra=[1]) + '</g>'
S(s, 'CONTOH 6', 'Menyelesaikan masalah kekongruenan',
  p('Aiman menyediakan dua keping kad berbentuk trapezium ABCD dan QPSR yang kongruen dengan DC = SR = 16 cm dan AD = QR = 17 cm. Dia mencantumkan dua keping kad itu untuk membentuk satu pentagon. Jika perimeter pentagon itu ialah 96 cm, hitung luas dalam cm² pentagon itu.')
  + work([('Memahami masalah', ['Trapezium ABCD dan QPSR kongruen; perimeter pentagon = 96 cm; hitung luas pentagon.']),
          ('Merancang strategi', ['CS = 96 − AD − DC − QR − RS; hitung AB; luas pentagon = 2 × luas trapezium.'])], s, 1, 16),
  stack(SVh(f6, 'Pentagon daripada dua trapezium', 320, 5),
        work([('Melaksanakan strategi', ['CS = 96 − 17 − 16 − 17 − 16 = 30 cm, maka CB = 15 cm', f'<i>x</i> = {sq("17² − 15²")} = 8 cm; AB = 16 + 8 = 24 cm', f'Luas pentagon = 2 × {F("1", "2")}(16 + 24)(15) = 600 cm²']),
              ('Membuat kesimpulan', ['Maka, luas pentagon itu ialah 600 cm².'])], s, 1, 14)))

# =====================================================================
# 5.2 PEMBESARAN
# =====================================================================
s = '5.2'
c = COL[s]
f7 = shape([(40, 200), (170, 200), (70, 110)], 'ABC', TR, angs=[(0, '52°'), (1, '71°')]) + shape([(240, 200), (460, 200), (290, 50)], 'EFG', PK, angs=[(0, '52°'), (2, '57°')])
assert 180 - 52 - 71 == 57
S(s, 'KONSEP', 'Keserupaan objek geometri',
  p('Dua objek geometri adalah <b>serupa</b> apabila')
  + bul(s, ['semua sudut sepadan adalah sama, iaitu ∠A = ∠P, ∠B = ∠Q dan ∠C = ∠R;', f'semua nisbah sisi sepadan adalah sama, iaitu {F("PQ", "AB")} = {F("QR", "BC")} = {F("RP", "CA")}.'])
  + note('Jika semua sisi sepadan bagi sepasang segi tiga berkadaran, maka semua sudut sepadan adalah sama saiz dan sebaliknya.', 'Ingat:')
  + work([('CONTOH 7 (a)', ['∠C = 180° − 52° − 71° = 57° = ∠G; ∠A = ∠E = 52°; ∠B = ∠F = 71°', 'Semua sudut sepadan adalah sama, maka segi tiga ABC dan EFG adalah serupa.'])], s, 1, 16),
  stack(SVh(f7, 'Segi tiga ABC dan EFG', 200, 30),
        work([('CONTOH 7 (b)', ['Sisi empat ABCD dan PQRS mempunyai semua sudut sepadan yang sama. AB = 8 cm, BC = 6 cm, PQ = 12 cm, QR = 12 cm.', f'{F("PQ", "AB")} = {F("12", "8")} = {F("3", "2")}, {F("QR", "BC")} = {F("12", "6")} = 2', 'Nisbah sisi sepadan tidak sama. Maka, ABCD dan PQRS tidak serupa.'])], s, 1, 15)))

S(s, 'DEFINISI', 'Pembesaran dan faktor skala',
  p('Objek dan imej di bawah suatu pembesaran adalah serupa.')
  + de(s, '<b>Pembesaran</b> ialah suatu transformasi dengan semua titik objek bergerak dari satu titik tetap dengan satu nisbah malar. Titik tetap itu dikenali sebagai <b>pusat pembesaran</b> dan nisbah malar itu dikenali sebagai <b>faktor skala</b>.')
  + formula(f'<i>k</i> = {F("jarak titik sepadan imej dari P", "jarak titik objek dari P")} = {F("panjang sisi sepadan imej", "panjang sisi objek")}', c)
  + note('Apabila memerihalkan suatu pembesaran, kita perlu menyatakan pusat pembesaran dan faktor skala.', 'Ingat:'),
  table(['Faktor skala, <i>k</i>', 'Saiz imej', 'Kedudukan imej terhadap P'], [['<i>k</i> &gt; 1', 'Lebih besar', 'Sebelah yang sama dengan objek'], ['<i>k</i> = 1', 'Sama saiz', 'Sebelah yang sama dengan objek'],
                                                                         ['0 &lt; <i>k</i> &lt; 1', 'Lebih kecil', 'Sebelah yang sama dengan objek'], ['−1 &lt; <i>k</i> &lt; 0', 'Lebih kecil', 'Sebelah bertentangan'],
                                                                         ['<i>k</i> = −1', 'Sama saiz', 'Sebelah bertentangan'], ['<i>k</i> &lt; −1', 'Lebih besar', 'Sebelah bertentangan']], c, 15))

A8 = [(1, 2), (3, 2), (1, 4)]
c8a = (-1, 1)
A8i = ap(enl(c8a, 2), A8)
L8 = [(1, -1), (2, -1), (1, -2)]
c8b = (3, -1)
L8i = ap(enl(c8b, -2), L8)
assert A8i == [(3, 3), (7, 3), (3, 7)] and L8i == [(7, -1), (5, -1), (7, 1)]
g8 = GF.Gr((40, 20, 470, 330), (-4, 8), (-5, 8), equal=True)
poly(g8, A8, TR, 'A', ls=14); poly(g8, A8i, TR, "A′", dash='6 4', ls=14); poly(g8, L8, PK, 'L', ls=14); poly(g8, L8i, PK, "L′", dash='6 4', ls=14)
for a, b in zip(A8, A8i):
    g8.seg(c8a, b, MU, 1.5, '4 4')
for a, b in zip(L8, L8i):
    g8.seg(a, b, MU, 1.5, '4 4')
g8.pt(*c8a, '(−1, 1)', AM, dx=-8, dy=-14, anchor='end', size=14); g8.pt(*c8b, '(3, −1)', AM, dx=8, dy=16, anchor='start', size=14)
S(s, 'CONTOH 8', 'Memerihalkan pembesaran',
  p('Rajah menunjukkan dua objek dan imejnya di bawah transformasi pembesaran. Perihalkan pembesaran dengan menentukan faktor skala dan pusat pembesaran.')
  + work([('(a) Objek A', [f'Faktor skala = {F("panjang sisi imej", "panjang sisi objek")} = {F("4", "2")} = 2', 'A′ ialah imej bagi A di bawah pembesaran pada pusat (−1, 1) dengan faktor skala 2.']),
          ('(b) Objek L', [f'Faktor skala = −{F("jarak L′ dari pusat", "jarak L dari pusat")} = −{F("4", "2")} = −2', 'L′ ialah imej bagi L di bawah pembesaran pada pusat (3, −1) dengan faktor skala −2.'])], s, 1, 15),
  stack(gsvg(g8, 'Pembesaran pada satah Cartes'), note('Pusat pembesaran ialah titik persilangan garis yang menyambungkan setiap pasangan titik sepadan. Tanda negatif <i>k</i>: imej di sebelah bertentangan dan songsang.', 'Info:')))

O10 = [(1, 1), (2, 1), (1, 3)]
P10 = (0, 0)
I10a = ap(enl(P10, 2), O10)
I10b = ap(enl(P10, Fr(-1, 2)), [(2, 2), (4, 2), (2, 4)])
g10 = plain((30, 30, 470, 360), (-3, 5), (-3, 6))
poly(g10, O10, TR, '', ls=13); poly(g10, I10a, TR, '', dash='6 4')
for q in I10a:
    g10.seg(P10, q, MU, 1.5, '4 4')
g10.pt(0, 0, 'P', AM, dx=-8, dy=12, anchor='end')
g10.text(1.3, 1.6, 'objek', TR, 13); g10.text(2.8, 3.2, 'imej', TR, 13)
S(s, 'CONTOH 9', 'Menentukan imej dan objek bagi pembesaran',
  p('Carta alir di bawah menunjukkan langkah-langkah untuk menentukan imej atau objek bagi suatu pembesaran.')
  + steps(s, ['Kenal pasti pusat pembesaran.', 'Kenal pasti faktor skala.', 'Lukis unjuran garis dari pusat pembesaran ke setiap bucu.', 'Lukis imej atau objek yang mempunyai bentuk yang serupa mengikut faktor skala.']),
  work([('CONTOH 9', ['Berdasarkan faktor skala yang diberi, tentukan objek dan imej bagi setiap pembesaran.', f'(a) <i>k</i> = {F("3", "4")}: saiz imej lebih kecil daripada objek, maka bentuk yang lebih besar ialah objek.', '(b) <i>k</i> = −2: saiz imej lebih besar daripada objek, maka bentuk yang lebih kecil ialah objek.'])], s, 1, 18))

S(s, 'CONTOH 10 – 11', 'Melukis imej dan objek bagi pembesaran',
  work([('CONTOH 10', ['<i>k</i> = 2: jarak setiap bucu imej dari P ialah 2 kali jarak bucu sepadan objek dari P pada arah yang sama (rajah).', f'<i>k</i> = −{F("1", "2")}: jarak bucu imej ialah {F("1", "2")} daripada jarak bucu objek pada arah yang bertentangan.']),
          ('CONTOH 11', [f'Diberi imej, <i>k</i> = {F("1", "3")}: jarak setiap bucu objek dari P ialah 3 kali jarak bucu sepadan imej pada arah yang sama.', '<i>k</i> = −3: jarak setiap bucu objek dari P ialah ⅓ daripada jarak bucu sepadan imej pada arah yang bertentangan.'])], s, 1, 17),
  SVh(g10.svg(), 'Pembesaran pada pusat P dengan faktor skala 2', 360, 20))

assert Fr(54, 6) == 9 and Fr(5, 2) ** 2 * 12 == 75 and Fr(81, 9) == 9
S(s, 'RUMUS', 'Luas imej bagi suatu pembesaran',
  p('Semasa pembesaran, panjang setiap sisi yang sepadan berkadaran secara tetap. Nisbah luas imej kepada luas objek ialah kuasa dua faktor skala.')
  + formula(f'{F("luas imej", "luas objek")} = <i>k</i>²', c) + formula('Luas imej = <i>k</i>² × Luas objek', c)
  + table(['', 'Luas objek', 'Luas imej', 'Faktor skala, <i>k</i>'], [['(a)', '6 cm²', '54 cm²', '?'], ['(b)', '12 unit²', '?', F('5', '2')], ['(c)', '?', '81 m²', '−3']], c, 16),
  work([('CONTOH 12', [f'(a) <i>k</i>² = {F("54", "6")} = 9, maka <i>k</i> = 3 atau −3', f'(b) Luas imej = ({F("5", "2")})² × 12 = {F("25", "4")} × 12 = 75 unit²', f'(c) (−3)² = {F("81", "luas objek")}, maka luas objek = {F("81", "9")} = 9 m²'])], s, 1, 18))

k13 = Fr(25, 15)
L2 = Fr(160) / (1 - 1 / k13 ** 2)
assert k13 == Fr(5, 3) and L2 == 250
A13 = (60, 330)
f13 = shape([A13, (450, 330), (330, 80), (60, 80)], 'AEFG', PK, fill=True) + shape([A13, (294, 330), (222, 180), (60, 180)], 'ABCD', TR) \
    + T_(177, 350, '15 cm', MU3, 14, w=600) + T_(372, 350, '10 cm', MU3, 14, w=600)
S(s, 'CONTOH 13', 'Menyelesaikan masalah pembesaran',
  p('Dalam rajah, trapezium AEFG ialah imej bagi trapezium ABCD di bawah suatu pembesaran pada pusat A. Diberi AB = 15 cm, BE = 10 cm dan luas kawasan berwarna ialah 160 cm², hitung (a) faktor skala, (b) luas dalam cm² trapezium AEFG.')
  + work([('Penyelesaian', [f'(a) <i>k</i> = {F("AE", "AB")} = {F("15 + 10", "15")} = {F("5", "3")}', '(b) Katakan luas ABCD = <i>L</i>₁ dan luas AEFG = <i>L</i>₂.', f'<i>L</i>₂ = ({F("5", "3")})² × <i>L</i>₁, maka <i>L</i>₁ = {F("9", "25")}<i>L</i>₂',
                                         f'<i>L</i>₂ − {F("9", "25")}<i>L</i>₂ = 160 → {F("16", "25")}<i>L</i>₂ = 160 → <i>L</i>₂ = 250', 'Maka, luas trapezium AEFG = 250 cm².'])], s, 1, 16),
  SVh(f13, 'Trapezium ABCD dan imejnya AEFG', 330, 40))

k14 = Fr(4800, 108)
assert k14 == Fr(400, 9) and 12 * Fr(20, 3) == 80 and 9 * Fr(20, 3) == 60 and 80 * 60 == 4800
S(s, 'CONTOH 14', 'Pembesaran logo kepada sepanduk',
  p('Logo berbentuk segi empat tepat berukuran 12 cm × 9 cm dilukis oleh seorang ahli Kelab Usahawan Muda. Sepanduk gerai jualan direka berdasarkan pembesaran ke atas logo itu. Jika luas sepanduk ialah 0.48 m², berapakah ukuran panjang dan lebar sepanduk itu dalam cm?'),
  work([('Penyelesaian', ['Luas logo = 12 × 9 = 108 cm² dan luas sepanduk = 0.48 m² = 4 800 cm²', f'<i>k</i>² = {F("4 800", "108")} = {F("400", "9")}, maka <i>k</i> = {F("20", "3")}', f'Panjang = 12 × {F("20", "3")} = 80 cm', f'Lebar = {F("4 800", "80")} = 60 cm',
                          'Ukuran sepanduk itu ialah 80 cm panjang dan 60 cm lebar.'])], s, 1, 18))

# =====================================================================
# 5.3 GABUNGAN TRANSFORMASI
# =====================================================================
s = '5.3'
c = COL[s]
S(s, 'KONSEP', 'Gabungan transformasi',
  table(['Transformasi', 'Huraian yang perlu dinyatakan'], [['Translasi', 'Vektor translasi, contoh (4, −3) ditulis secara menegak'], ['Pantulan', 'Paksi pantulan, contoh garis <i>x</i> = 5'],
                                                            ['Putaran', 'Pusat, sudut dan arah putaran'], ['Pembesaran', 'Pusat pembesaran dan faktor skala']], c, 15, False)
  + p('Untuk menentukan objek apabila imej diberi: translasi dilakukan pada arah bertentangan, putaran ikut arah jam menjadi lawan arah jam, dan pembesaran dengan <i>k</i> = 2 menjadi <i>k</i> = ½.'),
  stack(de(s, 'Gabungan transformasi <b>AB</b> bermaksud transformasi <b>B diikuti dengan transformasi A</b>.'),
        steps(s, ['Objek → lakukan transformasi B → imej pertama.', 'Imej pertama → lakukan transformasi A → imej.', 'Untuk mencari objek: tentukan objek di bawah A dahulu, kemudian objek di bawah B.']),
        note('Gabungan transformasi A² bermaksud transformasi A berlaku 2 kali secara berturutan.', 'Ingat:')))

A15 = [(-6, 2), (-4, 2), (-6, 5)]
P15, Q15, R15 = tr((6, -4)), rot((-3, 1), 90), enl((-8, -4), 2)
A15p = ap(P15, A15); A15pp = ap(P15, A15p)
B15p = ap(Q15, A15); B15pp = ap(R15, B15p)
assert A15pp == [(6, -6), (8, -6), (6, -3)] and B15p == [(-4, -2), (-4, 0), (-7, -2)] and B15pp == [(0, 0), (0, 4), (-6, 0)]
g15 = GF.Gr((40, 20, 470, 400), (-9, 9), (-7, 6), xs=2, ys=2, gx=1, gy=1, equal=True, fs=12)
poly(g15, A15, TR, 'A', ls=14); poly(g15, A15p, GR, "P(A)", dash='6 4', ls=12, lo=(0, 22)); poly(g15, A15pp, GR, "P²(A)", ls=12, lo=(20, -22))
poly(g15, B15p, PK, "Q(A)", dash='6 4', ls=12, lo=(-6, 22)); poly(g15, B15pp, PK, "RQ(A)", ls=12, lo=(-10, -6))
g15.pt(-3, 1, '(−3, 1)', AM, dx=-6, dy=-14, anchor='end', size=12); g15.pt(-8, -4, '(−8, −4)', AM, dx=4, dy=-12, size=12)
S(s, 'CONTOH 15', 'Menentukan imej di bawah gabungan transformasi',
  p(f'Segi tiga A mempunyai bucu (−6, 2), (−4, 2) dan (−6, 5). Diberi P = translasi ({F("6", "−4")}), Q = putaran 90° lawan arah jam pada pusat (−3, 1) dan R = pembesaran pada pusat (−8, −4) dengan faktor skala 2. Tentukan imej bagi A di bawah (a) P², (b) RQ.')
  + work([('(a)', ['A″ ialah imej bagi A′ = P(A) di bawah P.', f'Bucu A″: {cs(A15pp[0])}, {cs(A15pp[1])}, {cs(A15pp[2])}']),
          ('(b)', ['RQ bermaksud transformasi Q diikuti transformasi R.', f'Imej di bawah Q: {", ".join(cs(q) for q in B15p)}', f'Imej di bawah RQ: {", ".join(cs(q) for q in B15pp)}'])], s, 1, 14),
  gsvg(g15, 'Imej segi tiga A di bawah P kuasa dua dan RQ'))

G16 = [(1, -8), (5, -8), (5, -4), (3, -4)]
W16, V16 = ref('y', -1), rot((0, 0), 180)
T16inv = enl((1, 4), Fr(-1, 2))
G16a1 = ap(W16, G16); G16a = ap(V16, G16a1)
G16b1 = ap(V16, G16); G16b = ap(T16inv, G16b1)
assert G16a == [(-1, -6), (-5, -6), (-5, -2), (-3, -2)] and G16b == [(2, 2), (4, 2), (4, 4), (3, 4)]
assert ap(V16, ap(W16, G16a)) and ap(W16, ap(V16, G16a)) == G16
assert ap(enl((1, 4), -2), ap(V16, G16b)) == G16 or ap(V16, ap(enl((1, 4), -2), G16b)) == G16
g16 = GF.Gr((40, 20, 470, 420), (-6, 7), (-9, 7), xs=2, ys=2, gx=1, gy=1, equal=True, fs=12)
poly(g16, G16, AM, "G″", ls=14); poly(g16, G16a1, MU3, '', dash='5 4', fill=False); poly(g16, G16a, TR, '(a)', ls=13)
poly(g16, G16b1, MU3, '', dash='5 4', fill=False); poly(g16, G16b, PK, '(b)', ls=13)
g16.seg((-6, -1), (7, -1), GR, 2, '8 5'); g16.text(6.2, -0.4, '<i>y</i> = −1', GR, 13)
S(s, 'CONTOH 16', 'Menentukan objek di bawah gabungan transformasi',
  p(f'Trapezium G″ ialah imej bagi suatu objek di bawah gabungan transformasi. Diberi T = pembesaran pada pusat (1, 4) dengan faktor skala −2, V = putaran 180° pada asalan dan W = pantulan pada garis <i>y</i> = −1. Tentukan objek bagi G″ di bawah (a) WV, (b) VT.')
  + note('Tertib transformasi untuk mencari objek adalah songsang.', 'Ingat:')
  + work([('(a)', ['Diberi imej untuk mencari objek, maka transformasi W diikuti transformasi V.', f'Objek: {", ".join(cs(q) for q in G16a)}']),
          ('(b)', ['Transformasi V diikuti transformasi T. Untuk T, lakukan pembesaran dengan <i>k</i> = −½ pada pusat (1, 4).', f'Objek: {", ".join(cs(q) for q in G16b)}'])], s, 1, 15),
  gsvg(g16, 'Objek bagi trapezium G dua kali'))

A17, B17, C17 = tr((-4, 3)), ref('yx'), rot((4, 6), -90)
P17 = (6, 2)
i1 = A17(B17(P17)); i2 = B17(C17(P17))
Q17 = (2, 8)
K1 = rot((4, 6), 90)(Q17); K = tr((4, -3))(K1)
assert i1 == (-2, 9) and i2 == (4, 0) and K1 == (2, 4) and K == (6, 1) and C17(A17(K)) == Q17
S(s, 'CONTOH 17', 'Gabungan transformasi ke atas titik',
  p(f'Diberi titik P(6, 2) dan titik Q(2, 8) pada satah Cartes. Diberi A = translasi ({F("−4", "3")}), B = pantulan pada garis <i>y</i> = <i>x</i> dan C = putaran 90° ikut arah jam pada pusat (4, 6). (a) Tentukan imej bagi titik P di bawah gabungan transformasi (i) AB, (ii) BC. (b) Titik Q ialah imej bagi titik K di bawah transformasi CA. Tentukan titik K.'),
  work([('(a)(i)', ['P′ = B(P) = (2, 6)', f'P″ = A(P′) = (2 − 4, 6 + 3) = {cs(i1)}']), ('(a)(ii)', ['P′ = C(P) = (0, 4)', f'P″ = B(P′) = {cs(i2)}']),
        ('(b)', ['Diberi imej untuk mencari objek, maka transformasi C diikuti transformasi A.', 'Untuk C, lakukan putaran 90° lawan arah jam pada pusat (4, 6) ke atas Q: K′ = (2, 4)',
                 f'Untuk A, lakukan translasi ({F("4", "−3")}) ke atas K′: K = {cs(K)}'])], s, 1, 16))
assert C17(P17) == (0, 4) and B17(P17) == (2, 6)

R18 = [(1, 1), (3, 1), (1, 4)]
A18, B18, C18 = tr((2, -1)), ref('x', 0), rot((0, 0), 180)
AB = ap(A18, ap(B18, R18)); BA = ap(B18, ap(A18, R18)); BC = ap(B18, ap(C18, R18)); CB = ap(C18, ap(B18, R18))
assert AB != BA and BC == CB
ga = GF.Gr((30, 20, 240, 230), (-5, 5), (-2, 5), xs=2, ys=2, gx=1, gy=1, equal=True, fs=11)
poly(ga, R18, TR, 'R', ls=13); poly(ga, AB, GR, 'AB', ls=11); poly(ga, BA, PK, 'BA', ls=11)
gb = GF.Gr((270, 20, 480, 230), (-5, 5), (-5, 5), xs=2, ys=2, gx=1, gy=1, equal=True, fs=11)
poly(gb, R18, TR, 'R', ls=13); poly(gb, BC, AM, 'BC = CB', ls=11, lo=(0, 18))
S(s, 'CONTOH 18', 'Sifat kalis tukar tertib',
  bul(s, ['Gabungan transformasi AB mematuhi sifat kalis tukar tertib jika imej di bawah AB dan BA adalah sama.', 'Gabungan transformasi AB tidak mematuhi sifat kalis tukar tertib jika imej di bawah AB dan BA adalah tidak sama.'])
  + p(f'<b>CONTOH 18</b> Diberi A = translasi ({F("2", "−1")}), B = pantulan pada paksi-<i>y</i> dan C = putaran 180° pada asalan. Tentukan sama ada gabungan (a) AB, (b) BC mematuhi sifat kalis tukar tertib.')
  + work([('(a)', ['Imej di bawah AB dan BA adalah tidak sama, maka AB tidak mematuhi sifat kalis tukar tertib.']), ('(b)', ['Imej di bawah BC dan CB adalah sama, maka BC mematuhi sifat kalis tukar tertib.'])], s, 1, 16),
  f'<svg class="sl-svg" viewBox="0 -30 500 290" role="img" aria-label="Imej AB, BA, BC dan CB">{ga.svg()}{gb.svg()}{T_(135, 255, "(a)", MU, 14)}{T_(375, 255, "(b)", MU, 14)}</svg>')

E19 = [(1, 6), (2, 6), (1, 7)]
T19, S19 = rot((0, 5), 180), enl((3, 2), 2)
E19p = ap(T19, E19); E19pp = ap(S19, E19p)
assert E19pp == ap(enl((-1, 6), -2), E19) and E19pp == [(-5, 6), (-7, 6), (-5, 4)]
g19 = GF.Gr((40, 20, 470, 330), (-8, 4), (0, 9), xs=2, ys=2, gx=1, gy=1, equal=True, fs=12)
poly(g19, E19, TR, 'E', ls=13, lo=(14, 0)); poly(g19, E19p, MU3, "E′", dash='5 4', ls=12, lo=(-18, 0)); poly(g19, E19pp, PK, "E″", ls=13)
g19.pt(0, 5, '(0, 5)', AM, size=12); g19.pt(3, 2, '(3, 2)', AM, size=12); g19.pt(-1, 6, '(−1, 6)', GR, dy=-14, size=12)
S(s, 'CONTOH 19', 'Memerihalkan gabungan transformasi',
  table(['Sifat imej', 'Transformasi'], [['Kongruen, orientasi sama, jarak antara titik sepadan sama', 'Translasi'], ['Kongruen, orientasi sama, jarak antara titik sepadan berbeza', 'Putaran'],
                                         ['Kongruen, orientasi songsang', 'Pantulan'], ['Bukan kongruen: serupa dan saiz berbeza', 'Pembesaran']], c, 14, False)
  + p('<b>CONTOH 19</b> E″ ialah imej bagi E di bawah gabungan transformasi ST. (a) Perihalkan transformasi (i) T, (ii) S. (b) Perihalkan satu transformasi tunggal yang setara dengan ST.')
  + work([('', ['(a)(i) T ialah putaran 180° pada pusat (0, 5).', '(ii) S ialah pembesaran pada pusat (3, 2) dengan faktor skala 2.', '(b) Pembesaran pada pusat (−1, 6) dengan faktor skala −2.'])], s, 1, 15),
  stack(gsvg(g19, 'Gabungan transformasi ST'), note('Bukan semua gabungan transformasi dapat diperihalkan dalam suatu transformasi tunggal.', 'Info:')))

PRTU = [(-6, -3), (-2, -3), (-2, 1), (-6, 3)]
V20, U20 = enl((0, 1), Fr(1, 2)), rot((3, 6), 90)
ABCD1 = ap(V20, PRTU); ABCD = ap(U20, ABCD1)
assert ABCD1 == [(-3, -1), (-1, -1), (-1, 1), (-3, 2)] and ABCD == [(10, 0), (10, 2), (8, 2), (7, 0)]
assert area(ABCD) * 4 == area(PRTU) and 5 * 4 - 5 == 15
QRSV = ap(tr((-12, -1)), ABCD)
g20 = GF.Gr((30, 20, 480, 330), (-7, 11), (-4, 7), xs=2, ys=2, gx=1, gy=1, equal=True, fs=11)
poly(g20, PRTU, GR, '', ls=13); poly(g20, QRSV, TX, '', fill=False); poly(g20, ABCD, AM, 'ABCD', ls=12, lo=(0, -26))
for q, n in zip(PRTU, 'PRTU'):
    g20.text(q[0] - 0.5 if q[0] < -4 else q[0] + 0.5, q[1] + (-0.5 if q[1] < 0 else 0.5), n, TX, 13)
g20.pt(0, 1, '(0, 1)', MU3, size=12); g20.pt(3, 6, '(3, 6)', MU3, size=12)
S(s, 'CONTOH 20', 'Menyelesaikan masalah gabungan transformasi',
  p('Rajah menunjukkan peta suatu kawasan hutan lipur. Kawasan berwarna PRTU ialah habitat hidupan liar dan di dalamnya terdapat pondok pemerhatian QRSV yang kongruen dengan pondok ABCD. ABCD ialah imej bagi PRTU di bawah gabungan transformasi UV. (a) Perihalkan transformasi (i) V, (ii) U. (b) Diberi luas pondok ABCD ialah 5 m², hitung luas dalam m² kawasan berwarna.')
  ,
  SVh(g20.svg(), 'Peta hutan lipur', 330, -10))

S(s, 'CONTOH 20 (sambungan)', 'Penyelesaian masalah hutan lipur',
  SVh(g20.svg(), 'Peta hutan lipur', 330, -10),
  ps4(['ABCD ialah imej bagi PRTU di bawah UV.', 'Luas ABCD = 5 m²'], ['UV ialah pembesaran diikuti putaran. Maka, V ialah pembesaran dan U ialah putaran.', 'Guna luas imej = <i>k</i>² × luas objek.'],
      ['(a)(i) V: pembesaran pada pusat (0, 1) dengan faktor skala ½', '(ii) U: putaran 90° lawan arah jam pada pusat (3, 6)', '(b) 5 = (½)² × luas PRTU', 'Luas PRTU = 5 × 4 = 20 m²', 'Luas berwarna = 20 − 5 = 15 m²'],
      ['(a) V dan U seperti di sebelah.', '(b) Luas kawasan berwarna ialah 15 m².'], s, 15))

# =====================================================================
# 5.4 TESELASI
# =====================================================================
s = '5.4'
c = COL[s]


def tri_tess(x0, y0, a, nx, ny, cols, lab=None):
    out = ''
    h = a * math.sqrt(3) / 2
    for j in range(ny):
        for i in range(nx):
            X = x0 + i * a / 2 + (j % 2) * 0; Y = y0 + j * h
            up = (i + j) % 2 == 0
            pts = [(X, Y + h), (X + a, Y + h), (X + a / 2, Y)] if up else [(X, Y), (X + a, Y), (X + a / 2, Y + h)]
            col = cols[(i + j) % len(cols)]
            out += f'<polygon points="{" ".join(f"{f1(p_)},{f1(q_)}" for p_, q_ in pts)}" fill="{col}33" stroke="{col}" stroke-width="2.5"/>'
            if lab and (i, j) in lab:
                out += T_(X + a / 2, Y + (2 * h / 3 if up else h / 3), lab[(i, j)], TX, 16)
    return out


def hex_tess(x0, y0, r, nx, ny, col):
    out = ''
    w = math.sqrt(3) * r
    for j in range(ny):
        for i in range(nx):
            cx = x0 + i * w + (j % 2) * w / 2; cy = y0 + j * 1.5 * r
            pts = [(cx + r * math.cos(math.radians(60 * k + 30)), cy + r * math.sin(math.radians(60 * k + 30))) for k in range(6)]
            out += f'<polygon points="{" ".join(f"{f1(p_)},{f1(q_)}" for p_, q_ in pts)}" fill="{col}33" stroke="{col}" stroke-width="2.5"/>'
    return out


def rh_tess(x0, y0, a, nx, ny, col):
    out = ''
    for j in range(ny):
        for i in range(nx):
            X = x0 + i * a + j * a / 2; Y = y0 + j * a * 0.7
            pts = [(X, Y + a * 0.7), (X + a, Y + a * 0.7), (X + a * 1.5, Y), (X + a / 2, Y)]
            out += f'<polygon points="{" ".join(f"{f1(p_)},{f1(q_)}" for p_, q_ in pts)}" fill="{col}33" stroke="{col}" stroke-width="2.5"/>'
    return out


tt = tri_tess(20, 30, 70, 6, 2, [AM, TR]) + hex_tess(290, 50, 34, 3, 3, PK)
S(s, 'DEFINISI', 'Maksud teselasi',
  de(s, '<b>Teselasi</b> ialah pola bagi bentuk berulang yang memenuhi suatu satah tanpa ruang kosong atau pertindihan.')
  + p('Struktur sarang lebah merupakan suatu bentuk teselasi. Struktur ini dapat menyediakan ruang yang maksimum untuk menyimpan madu lebah.')
  + note('Johannes Kepler (1571–1630) menggunakan konsep teselasi untuk meneroka serta menjelaskan struktur emping salji.', 'Info:'),
  SVh(tt + T_(140, 200, 'Segi tiga sama sisi', MU, 14) + T_(370, 200, 'Heksagon sekata', MU, 14) + rh_tess(60, 240, 70, 4, 2, GR) + T_(250, 370, 'Rombus', MU, 14), 'Contoh teselasi', 360, 20))

circ = ''.join(f'<circle cx="{300 + 50 * i}" cy="{80 + 50 * j}" r="24" fill="{TR}33" stroke="{TR}" stroke-width="2.5"/>' for i in range(4) for j in range(3))
S(s, 'CONTOH 21', 'Menentukan teselasi',
  p('Tentukan sama ada setiap bentuk yang berikut merupakan suatu teselasi.')
  + work([('(a)', ['Merupakan teselasi yang terdiri daripada rombus sahaja. Bentuk berulang memenuhi satah tanpa ruang kosong atau pertindihan.']),
          ('(b)', ['Bukan teselasi kerana terdapat ruang kosong antara bulatan-bulatan.'])], s, 1, 17)
  + note('Teselasi boleh terdiri daripada satu jenis bentuk atau gabungan beberapa bentuk, contohnya segi empat sama dan oktagon sekata.', 'Info:'),
  SVh(rh_tess(20, 70, 52, 3, 3, GR) + T_(110, 210, '(a)', MU, 15) + circ + T_(375, 210, '(b)', MU, 15), 'Teselasi rombus dan susunan bulatan', 200, 40))

S(s, 'CONTOH 22', 'Mereka bentuk teselasi dengan transformasi isometri',
  p('Teselasi dapat direka bentuk dengan transformasi isometri (translasi, pantulan dan putaran) yang menghasilkan imej kongruen dengan objek.')
  + p('<b>CONTOH 22</b> Rajah menunjukkan teselasi segi tiga sama sisi. Nyatakan transformasi yang terlibat untuk menghasilkan (a) Q daripada P, (b) R daripada P.')
  + work([('(a)', ['Q ialah imej bagi P di bawah pantulan pada garis BC atau putaran 60° ikut arah jam pada pusat B.']), ('(b)', ['R ialah imej bagi P di bawah translasi sejauh AB ke kanan.'])], s, 1, 17)
  ,
  stack(SVh(tri_tess(40, 60, 140, 4, 1, [TR, AM], {(0, 0): 'P', (1, 0): 'Q', (2, 0): 'R'}) + T_(40, 200, 'A', TX, 17) + T_(180, 200, 'B', TX, 17) + T_(110, 45, 'C', TX, 17), 'Teselasi segi tiga P, Q, R', 200, 20), note('Teselasi jenis Escher (M. C. Escher, 1898–1972) ialah teselasi yang bentuknya boleh dikenal pasti dalam kehidupan sebenar.', 'Info:')))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'kekongruenan', 'slides.js')
HEAD = '/* Nota Bab 5 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
