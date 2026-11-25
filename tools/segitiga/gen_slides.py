# Penjana slaid NOTA Bab 7 Segi Tiga dan Sisi Empat (Tingkatan 1, KP2027) -> segitiga/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
from mathfmt import FR, RT, SFR, SRT
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'segitiga', 'slides.js'))
SUB = {'7.1': ('Segi Tiga', AM), '7.2': ('Teorem Pythagoras', TR), '7.3': ('Sisi Empat', PU)}

def tri_types():
    s = BOX(); items = [([(0, 60), (35, 0), (70, 60)], 'Sama sisi', '3 paksi', AM), ([(0, 60), (35, 0), (70, 60)], '', '', AM), ([(0, 60), (35, -10), (70, 60)], 'Sama kaki', '1 paksi', GR), ([(0, 60), (55, 5), (80, 60)], 'Tak sama kaki', '0 paksi', PK)]
    shapes = [([(0, 60), (35, 0), (70, 60)], 'Sama sisi', '3 paksi simetri', AM), ([(5, 60), (35, -15), (65, 60)], 'Sama kaki', '1 paksi simetri', GR), ([(0, 60), (55, 0), (85, 60)], 'Tak sama kaki', 'tiada paksi', PK),
              ([(0, 60), (25, 5), (75, 60)], 'Bersudut tirus', 'semua < 90°', TR), ([(0, 60), (0, 0), (70, 60)], 'Bersudut tegak', 'satu = 90°', PU), ([(0, 60), (95, 20), (75, 60)], 'Bersudut cakah', 'satu > 90°', RD)]
    for i, (pts, nm, d, col) in enumerate(shapes):
        ox, oy = 40 + (i % 3) * 150, 60 + (i // 3) * 190
        s += POLY([(ox + x, oy + y) for x, y in pts], col, NAV, 3) + T(ox + 40, oy + 95, nm, col, 16) + T(ox + 40, oy + 118, d, MU, 13)
    return svg(s, 'Enam jenis segi tiga mengikut sisi dan sudut')

def tri_angles(a, b, label, ext=False):
    s = BOX(); A, B = (90, 330), (390, 330)
    # puncak C daripada sudut a (di A) dan b (di B)
    ta, tb = math.tan(math.radians(a)), math.tan(math.radians(b)); x = (B[0] * tb + A[0] * ta) / (ta + tb); h = (x - A[0]) * ta
    C = (x, 330 - h)
    if ext: s += LINE(B, (470, 330), MU, 3, '6 5')
    s += POLY([A, B, C], TX, NAV, 4)
    G = ((A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3)
    def at(P, d):
        dx, dy = G[0] - P[0], G[1] - P[1]; n = math.hypot(dx, dy); return (P[0] + dx / n * d, P[1] + dy / n * d)
    la, lb, lc = at(A, 55), at(B, 55), at(C, 50)
    s += T(la[0], la[1], f'{a}°', AM, 20) + T(lb[0], lb[1], f'{b}°', TR, 20) + T(lc[0], lc[1], f'{180 - a - b}°', GR, 20)
    if ext: s += T(B[0] + 45, 312, f'{180 - b}°', PK, 20)
    return svg(s, label)

def right_tri(a, b, labels, label):
    s = BOX(); k = min(300 / a, 260 / b); A = (100, 360); B = (100 + a * k, 360); C = (100, 360 - b * k)
    s += POLY([A, B, C], TX, NAV, 4) + f'<path d="M{A[0]+20} {A[1]} L{A[0]+20} {A[1]-20} L{A[0]} {A[1]-20}" fill="none" stroke="{MU}" stroke-width="3"/>'
    s += T((A[0] + B[0]) / 2, 390, labels[0], AM, 22) + T(70, (A[1] + C[1]) / 2, labels[1], TR, 22) + T((B[0] + C[0]) / 2 + 28, (B[1] + C[1]) / 2 - 18, labels[2], PK, 22)
    return svg(s, label)

def pyth_squares():
    s = BOX(); A = (190, 300); B = (310, 300); C = (190, 210)  # 4:3
    s += RECT(190, 300, 120, 120 * 0 + 1, TX, NAV, 1)
    s += POLY([A, B, (310, 420), (190, 420)], AM, NAV, 3) + T(250, 362, '16', AM, 20)
    s += POLY([A, C, (100, 210), (100, 300)], TR, NAV, 3) + T(145, 255, '9', TR, 20)
    d = (C[0] - B[0], C[1] - B[1]); n = (-d[1], d[0])
    s += POLY([B, C, (C[0] - d[1], C[1] + d[0]), (B[0] - d[1], B[1] + d[0])], PK, NAV, 3) + T(300, 175, '25', PK, 22)
    s += POLY([A, B, C], TX, NAV, 4) + T(250, 40, '9 + 16 = 25', GR, 22)
    return svg(s, 'Segi empat sama pada sisi segi tiga bersudut tegak 3, 4, 5')

def quads():
    s = BOX(); shapes = [([(0, 0), (90, 0), (90, 55), (0, 55)], 'Segi empat tepat', '2 paksi', AM), ([(0, 0), (60, 0), (60, 60), (0, 60)], 'Segi empat sama', '4 paksi', GR), ([(20, 0), (100, 0), (80, 55), (0, 55)], 'Segi empat selari', '0 paksi', TR),
              ([(40, 0), (80, 35), (40, 70), (0, 35)], 'Rombus', '2 paksi', PU), ([(25, 0), (75, 0), (100, 55), (0, 55)], 'Trapezium', '0 atau 1 paksi', PK), ([(40, 0), (75, 25), (40, 80), (5, 25)], 'Lelayang', '1 paksi', RD)]
    for i, (pts, nm, d, col) in enumerate(shapes):
        ox, oy = 30 + (i % 3) * 155, 50 + (i // 3) * 190
        s += POLY([(ox + x, oy + y) for x, y in pts], col, NAV, 3) + T(ox + 48, oy + 108, nm, col, 15) + T(ox + 48, oy + 130, d + ' simetri', MU, 13)
    return svg(s, 'Enam jenis sisi empat dengan bilangan paksi simetri')

def house():
    s = BOX()
    s += RECT(120, 200, 260, 160, PU, NAV, 4, 2) + POLY([(120, 200), (250, 100), (380, 200)], AM, NAV, 4)
    s += T(250, 385, '12 m', TX, 18) + T(95, 280, '6 m', TX, 18) + T(170, 140, '10 m', AM, 18) + T(330, 140, '10 m', AM, 18)
    s += LINE((250, 100), (250, 200), MU, 2, '6 5') + T(268, 160, 't', MU, 18)
    return svg(s, 'Gabungan segi empat tepat dan segi tiga sama kaki seperti rumah')

# ===== 7.1 =====
c = AM
add('7.1', '7.1 Segi tiga', 'Mengelaskan segi tiga',
    TABLE(['Ikut sisi', 'Sifat', 'Paksi simetri'], [['Sama sisi', '3 sisi sama, 3 sudut 60°', '3'], ['Sama kaki', '2 sisi sama, 2 sudut tapak sama', '1'], ['Tak sama kaki', 'semua sisi berbeza', '0']], c)
    + BUL(['Ikut sudut: <b>bersudut tirus</b> (semua &lt; 90°), <b>bersudut tegak</b> (satu 90°), <b>bersudut cakah</b> (satu &gt; 90°).'], c), tri_types())
add('7.1', '7.1 Kongruen dan serupa', 'Kekongruenan dan keserupaan',
    BUL(['<b>Kongruen</b>: bentuk dan saiz sama (semua sisi dan sudut sepadan sama).', '<b>Serupa</b>: bentuk sama, saiz berbeza (sudut sepadan sama, sisi berkadar).', 'Tembereng dan sudut yang kongruen ditanda dengan tanda yang sama pada rajah.'], c)
    + NOTE('Contoh: dua jubin segi tiga yang sama saiz adalah kongruen; segi tiga pada peta dan segi tiga sebenar adalah serupa.'), tri_types())
assert 180 - 50 - 70 == 60
add('7.1', '7.1 Sudut pedalaman', 'Sudut pedalaman dan sudut peluaran',
    BUL(['Hasil tambah sudut pedalaman segi tiga = <b>180°</b>.', 'Sudut peluaran + sudut pedalaman bersebelahan = <b>180°</b> (garis lurus).', 'Sudut peluaran = <b>hasil tambah dua sudut pedalaman bertentangan</b>: 50° + 60° = 110°.'], c)
    + NOTE('Segi tiga sama kaki: dua sudut tapak adalah sama.'), tri_angles(50, 70, 'Segi tiga dengan sudut 50, 70, 60 dan sudut peluaran 110', True))
assert 0.5 * 12 * 5 == 30 and 12 + 5 + 13 == 30
add('7.1', '7.1 Perimeter dan luas', 'Perimeter dan luas segi tiga',
    BUL(['<b>Perimeter</b> = hasil tambah panjang tiga sisi.', '<b>Luas</b> = ' + FR(1, 2) + ' × tapak × tinggi (tinggi berserenjang dengan tapak).'], c)
    + P('Segi tiga bersisi 5 cm, 12 cm, 13 cm (bersudut tegak): perimeter = 30 cm, luas = ' + FR(1, 2) + ' × 12 × 5 = 30 cm².'),
    right_tri(12, 5, ['12 cm', '5 cm', '13 cm'], 'Segi tiga bersudut tegak 5, 12, 13'))
assert 0.5 * 8 * 6 * 4 * 2.5 == 240
add('7.1', 'Contoh 1', 'Masalah harian: kos bendera segi tiga',
    P('Sebuah kelab menempah 4 helai panji segi tiga, setiap satu bertapak 8 m dan tinggi 6 m. Kos kain ialah RM2.50 semeter persegi. Hitung kos kain.')
    + STEPS(['Luas sehelai = ' + FR(1, 2) + ' × 8 × 6 = 24 m²', 'Luas 4 helai = 96 m²', 'Kos = 96 × RM2.50'], c) + ANS('RM240'), '')

# ===== 7.2 =====
c = TR
add('7.2', '7.2 Hipotenus', 'Hipotenus dan teorem Pythagoras',
    DEF('Dalam segi tiga bersudut tegak, <b>hipotenus</b> ialah sisi terpanjang, bertentangan dengan sudut tegak. <b>Teorem Pythagoras</b>: c² = a² + b², dengan c hipotenus.', c)
    + BUL(['3² + 4² = 9 + 16 = 25 = 5²', 'Luas segi empat sama pada hipotenus = jumlah luas dua segi empat sama yang lain.'], c), pyth_squares())
add('7.2', '7.2 Trirangkap', 'Trirangkap Pythagoras dan akas',
    TABLE(['Trirangkap', 'Semakan'], [['3, 4, 5', '9 + 16 = 25'], ['5, 12, 13', '25 + 144 = 169'], ['8, 15, 17', '64 + 225 = 289'], ['6, 8, 10', 'gandaan 3, 4, 5']], c)
    + NOTE('<b>Akas</b>: jika c² = a² + b², maka segi tiga itu bersudut tegak. Sisi 7, 9, 12: 49 + 81 = 130 ≠ 144 → bukan segi tiga bersudut tegak.'), '')
assert math.isqrt(15 ** 2 - 9 ** 2) == 12 and 12 ** 2 + 9 ** 2 == 225
add('7.2', 'Contoh 1', 'Mencari sisi yang tidak diketahui',
    TABLE(['Diberi', 'Cari', 'Pengiraan'], [['a = 6, b = 8', 'hipotenus c', 'c² = 36 + 64 = 100 → c = 10'], ['c = 15, a = 9', 'sisi b', 'b² = 225 − 81 = 144 → b = 12']], c)
    + NOTE('Mencari hipotenus: <b>tambah</b> kuasa dua. Mencari sisi lain: <b>tolak</b> kuasa dua.'), right_tri(9, 12, ['9 cm', 'b', '15 cm'], 'Segi tiga bersudut tegak 9, b, 15'))
assert math.isqrt(10 ** 2 - 6 ** 2) == 8
add('7.2', 'Contoh 2', 'Masalah harian: tangga',
    P('Sebatang tangga sepanjang 10 m disandarkan pada dinding. Kaki tangga berada 6 m dari dinding. Berapakah tinggi dinding yang dicapai oleh hujung tangga?')
    + STEPS(['Tangga ialah hipotenus: 10 m', 'tinggi² = 10² − 6² = 100 − 36 = 64', 'tinggi = ' + RT(64)], c) + ANS('8 m'), right_tri(6, 8, ['6 m', '?', '10 m'], 'Tangga 10 m dengan kaki 6 m dari dinding'))
assert 3 ** 2 + 4 ** 2 == 25 and 5 ** 2 + 12 ** 2 == 169
add('7.2', 'Contoh 3', 'Gabungan dua segi tiga',
    P('Dalam rajah, ABD dan BCD ialah segi tiga bersudut tegak. AB = 3 cm, AD = 4 cm dan BC = 12 cm. Cari panjang CD.')
    + STEPS(['Segi tiga ABD: BD² = 3² + 4² = 25, BD = 5 cm', 'Segi tiga BCD: CD² = 5² + 12² = 169', 'CD = 13 cm'], c) + ANS('CD = 13 cm')
    + NOTE('Hitung sisi yang dikongsi (BD) dahulu, kemudian gunakannya dalam segi tiga kedua.'), '')

# ===== 7.3 =====
c = PU
add('7.3', '7.3 Sisi empat', 'Sifat sisi empat',
    TABLE(['Sisi empat', 'Sifat utama'], [['Segi empat tepat', 'sisi bertentangan sama, 4 sudut tegak'], ['Segi empat sama', '4 sisi sama, 4 sudut tegak'], ['Segi empat selari', 'sisi bertentangan sama dan selari'], ['Rombus', '4 sisi sama, pepenjuru bersilang serenjang'], ['Trapezium', 'sepasang sisi selari'], ['Lelayang', '2 pasang sisi bersebelahan sama']], c), quads())
assert 360 - 95 - 80 - 110 == 75
add('7.3', '7.3 Sudut', 'Sudut pedalaman dan peluaran sisi empat',
    BUL(['Hasil tambah sudut pedalaman sisi empat = <b>360°</b> (dua segi tiga).', 'Sudut 95°, 80°, 110° → sudut keempat = 360° − 285° = 75°.', '<b>Segi empat selari</b>: sudut bertentangan sama; sudut bersebelahan berjumlah 180°.', 'Sudut peluaran + sudut pedalaman bersebelahan = 180°.'], c), quads())
add('7.3', '7.3 Perimeter dan luas', 'Rumus luas sisi empat',
    TABLE(['Sisi empat', 'Luas'], [['Segi empat tepat', 'panjang × lebar'], ['Segi empat selari', 'tapak × tinggi'], ['Trapezium', '' + FR(1, 2) + ' × (jumlah sisi selari) × tinggi'], ['Rombus / lelayang', '' + FR(1, 2) + ' × pepenjuru 1 × pepenjuru 2']], c)
    + NOTE('Segi empat tepat dengan perimeter sama boleh mempunyai luas berbeza: 6 × 4 (24 cm²) dan 9 × 1 (9 cm²) kedua-duanya berperimeter 20 cm.'), '')
assert math.isqrt(10 ** 2 - 6 ** 2) == 8 and 12 * 6 + 0.5 * 12 * 8 == 120 and 12 + 6 + 6 + 10 + 10 == 44
add('7.3', 'Contoh 1', 'Gabungan segi tiga dan sisi empat',
    P('Rajah menunjukkan dinding hadapan sebuah rumah: segi empat tepat 12 m × 6 m dan bumbung segi tiga sama kaki dengan sisi 10 m. Cari (a) perimeter dinding, (b) luas dinding.')
    + STEPS(['Tinggi bumbung t: t² = 10² − 6² = 64, t = 8 m', 'Perimeter = 12 + 6 + 6 + 10 + 10 = 44 m', 'Luas = 12 × 6 + ' + FR(1, 2) + ' × 12 × 8 = 72 + 48'], c) + ANS('(a) 44 m (b) 120 m²'), house())
assert 0.5 * (8 + 14) * 5 == 55 and 55 * 30 == 1650
add('7.3', 'Contoh 2', 'Masalah harian: kos jubin trapezium',
    P('Sebuah laman berbentuk trapezium dengan sisi selari 8 m dan 14 m serta tinggi 5 m. Kos memasang jubin ialah RM30 semeter persegi. Hitung kos.')
    + STEPS(['Luas = ' + FR(1, 2) + ' × (8 + 14) × 5 = 55 m²', 'Kos = 55 × RM30'], c) + ANS('RM1 650'), '')

finish(SUB, OUT, {'7.1': 5, '7.2': 5, '7.3': 5})
