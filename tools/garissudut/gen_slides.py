# Penjana slaid NOTA Bab 6 Garis dan Sudut (Tingkatan 1, KP2027) -> garissudut/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'garissudut', 'slides.js'))
SUB = {'6.1': ('Garis dan Jenis Sudut', AM), '6.2': ('Sudut yang Berkaitan dengan Garis Selari dan Garis Rentas Lintang', TR)}

def pt(c, r, deg): return (c[0] + r * math.cos(math.radians(deg)), c[1] - r * math.sin(math.radians(deg)))
def arc(c, r, a0, a1, col, lab='', lr=None, size=18):
    p0, p1 = pt(c, r, a0), pt(c, r, a1); large = 1 if (a1 - a0) % 360 > 180 else 0
    s = f'<path d="M{p0[0]:.1f} {p0[1]:.1f} A{r} {r} 0 {large} 0 {p1[0]:.1f} {p1[1]:.1f}" fill="none" stroke="{col}" stroke-width="3"/>'
    if lab:
        m = (a0 + ((a1 - a0) % 360) / 2); q = pt(c, lr or r + 22, m); s += T(q[0], q[1], lab, col, size)
    return s
def ray(c, deg, L, col=TX, sw=4): return LINE(c, pt(c, L, deg), col, sw)

def types():
    s = BOX(); items = [(40, 'Tirus', '< 90°', TR), (90, 'Tegak', '= 90°', GR), (130, 'Cakah', '90° – 180°', AM), (180, 'Garis lurus', '= 180°', PU), (250, 'Refleks', '180° – 360°', PK), (360, 'Putaran lengkap', '= 360°', RD)]
    for i, (a, nm, rg, col) in enumerate(items):
        cx, cy = 90 + (i % 3) * 160, 140 + (i // 3) * 190
        s += ray((cx, cy), 0, 55, MU, 3)
        if a < 360: s += ray((cx, cy), a, 55, MU, 3)
        if a == 90: s += f'<path d="M{cx+14} {cy} L{cx+14} {cy-14} L{cx} {cy-14}" fill="none" stroke="{col}" stroke-width="3"/>'
        elif a == 360: s += f'<circle cx="{cx}" cy="{cy}" r="22" fill="none" stroke="{col}" stroke-width="3"/>'
        else: s += arc((cx, cy), 22, 0, a, col)
        s += T(cx, cy + 45, nm, col, 17) + T(cx, cy + 68, rg, MU, 14)
    return svg(s, 'Enam jenis sudut: tirus, tegak, cakah, garis lurus, refleks dan putaran lengkap')

def pairs():
    s = BOX()
    c1 = (120, 150); s += ray(c1, 0, 100, MU) + ray(c1, 90, 100, MU) + ray(c1, 35, 100, TX) + arc(c1, 30, 0, 35, TR, '35°', 50) + arc(c1, 40, 35, 90, AM, '55°', 60)
    s += T(120, 210, 'Pelengkap: 35° + 55° = 90°', GR, 16)
    c2 = (370, 150); s += ray(c2, 0, 100, MU) + ray(c2, 180, 100, MU) + ray(c2, 70, 100, TX) + arc(c2, 30, 0, 70, TR, '70°', 50) + arc(c2, 38, 70, 180, AM, '110°', 62)
    s += T(370, 210, 'Penggenap: 70° + 110° = 180°', GR, 16)
    c3 = (250, 330); s += ray(c3, 0, 100, MU) + ray(c3, 120, 90, MU) + arc(c3, 26, 0, 120, TR, '120°', 46) + arc(c3, 40, 120, 360, PK, '240°', 60)
    s += T(250, 410, 'Konjugat: 120° + 240° = 360°', GR, 16)
    return svg(s, 'Sudut pelengkap, penggenap dan konjugat')

def cross(a, label, labs=True):
    s = BOX(); c = (250, 210)
    s += LINE(pt(c, 200, 0), pt(c, 200, 180), TX, 4) + LINE(pt(c, 190, a), pt(c, 190, a + 180), TX, 4)
    s += arc(c, 40, 0, a, TR, f'{a}°' if labs else 'a', 62) + arc(c, 40, 180, 180 + a, TR, f'{a}°' if labs else 'a', 62)
    s += arc(c, 52, a, 180, AM, f'{180 - a}°' if labs else 'b', 76) + arc(c, 52, 180 + a, 360, AM, f'{180 - a}°' if labs else 'b', 76)
    s += DOT(c, TX, 6)
    return svg(s, label)

def parallel(t, label, mode='semua'):
    s = BOX(); y1, y2 = 150, 290
    s += LINE((40, y1), (460, y1), TX, 4) + LINE((40, y2), (460, y2), TX, 4)
    for y in (y1, y2): s += POLY([(400, y - 8), (414, y), (400, y + 8)], MU, MU, 2)
    dx = (y2 - y1) / math.tan(math.radians(t)); P = (250 - dx / 2, y2); Q = (250 + dx / 2, y1)
    s += LINE(pt(P, 80, t + 180), pt(Q, 80, t), PK, 4)
    if mode in ('sepadan', 'semua'): s += arc(Q, 32, 0, t, AM, 'a', 52) + arc(P, 32, 0, t, AM, 'a', 52)
    if mode in ('selang', 'semua'): s += arc(Q, 26, 180, 180 + t, GR, 'b', 46)
    if mode == 'selang': s += arc(P, 26, 0, t, GR, 'b', 46)
    if mode == 'pedalaman': s += arc(Q, 30, 180, 180 + t, GR, 'p', 50) + arc(P, 30, t, 180, PU, 'q', 50)
    s += T(470, y1 - 14, 'PQ', MU, 14, 'end') + T(470, y2 - 14, 'RS', MU, 14, 'end')
    return svg(s, label)

def bisector():
    s = BOX(); A, B = (110, 260), (390, 260)
    s += LINE(A, B, TX, 4) + DOT(A, TX, 6) + DOT(B, TX, 6) + T(A[0], A[1] + 26, 'A', TX, 18) + T(B[0], B[1] + 26, 'B', TX, 18)
    r = 180; h = math.sqrt(r * r - 140 * 140)
    s += arc(A, r, 30, 75, AM) + arc(A, r, -75, -30, AM) + arc(B, r, 105, 150, PU) + arc(B, r, 210, 255, PU)
    P1, P2 = (250, 260 - h), (250, 260 + h)
    s += LINE((250, 260 - h - 20), (250, min(410, 260 + h + 10)), GR, 4, '8 6') + DOT(P1, GR, 6)
    s += T(250, 40, 'Pembahagi dua sama serenjang AB', GR, 18)
    return svg(s, 'Pembinaan pembahagi dua sama serenjang tembereng AB')

# ===== 6.1 =====
c = AM
add('6.1', '6.1 Garis', 'Titik, garis, tembereng dan kekongruenan',
    BUL(['<b>Titik</b>: kedudukan, tiada saiz (A).', '<b>Garis</b>: lurus dan memanjang tanpa hujung.', '<b>Tembereng garis</b> AB: sebahagian garis dengan dua titik hujung.', '<b>Kongruen</b>: dua tembereng sama panjang, atau dua sudut sama saiz.'], c)
    + NOTE('Anggar dahulu (cth. “lebih kurang 5 cm” atau “hampir 90°”), kemudian ukur dengan pembaris atau protraktor untuk semak.'), bisector())
add('6.1', '6.1 Pembinaan', 'Membina pembahagi dua sama serenjang',
    STEPS(['Buka jangka lukis lebih daripada separuh AB.', 'Dari A, lukis lengkok di atas dan di bawah AB.', 'Dengan bukaan yang sama, ulang dari B.', 'Sambungkan dua titik persilangan lengkok.'], c)
    + NOTE('Garis ini membahagi AB kepada dua bahagian sama panjang dan bersudut 90° dengan AB. Bina juga sudut 60° (segi tiga sama sisi), kemudian 30°, 90° dan 45° dengan membahagi dua sama.'), bisector())
add('6.1', '6.1 Jenis sudut', 'Sifat pelbagai jenis sudut',
    TABLE(['Jenis', 'Saiz'], [['Tirus', 'kurang daripada 90°'], ['Tegak', 'tepat 90°'], ['Cakah', 'antara 90° dan 180°'], ['Pada garis lurus', '180°'], ['Refleks', 'antara 180° dan 360°'], ['Putaran lengkap', '360°']], c), types())
add('6.1', '6.1 Pasangan sudut', 'Sudut pelengkap, penggenap dan konjugat',
    TABLE(['Pasangan', 'Hasil tambah', 'Contoh'], [['Pelengkap', '90°', '35° dan 55°'], ['Penggenap', '180°', '70° dan 110°'], ['Konjugat', '360°', '120° dan 240°']], c)
    + NOTE('Pelengkap bagi 28° ialah 62°. Penggenap bagi 28° ialah 152°. Konjugat bagi 28° ialah 332°.'), pairs())
add('6.1', '6.1 Garis bersilang', 'Sudut pada garis bersilang',
    BUL(['<b>Sudut bertentang bucu</b> adalah sama: a = a, b = b.', '<b>Sudut bersebelahan</b> pada garis lurus: a + b = 180°.', 'Jika garis bersilang secara <b>serenjang</b>, semua sudut ialah 90°.'], c)
    + P('Jika satu sudut ialah 65°, tiga sudut lain ialah 115°, 65° dan 115°.'), cross(65, 'Dua garis bersilang dengan sudut 65 dan 115 darjah'))
assert 180 - 2 * 40 == 100 and (180 - 50) / 2 == 65
add('6.1', 'Contoh 1', 'Mencari nilai sudut',
    P('Tiga garis lurus bertemu di satu titik pada garis lurus. Sudut-sudutnya ialah 2<i>x</i>, 50° dan <i>x</i> + 10°. Cari <i>x</i>.')
    + STEPS(['Sudut pada garis lurus: 2x + 50 + x + 10 = 180', '3x + 60 = 180', '3x = 120'], c) + ANS('x = 40°')
    + NOTE('Masalah harian: tukang kayu memotong kayu bersilang untuk kekuda bumbung — sudut bertentang bucu mesti sama.'), cross(50, 'Garis bersilang', False))

# ===== 6.2 =====
c = TR
add('6.2', '6.2 Garis selari', 'Garis selari dan garis rentas lintang',
    BUL(['<b>Garis selari</b> tidak bertemu dan jaraknya sentiasa sama (tanda anak panah sama).', '<b>Garis rentas lintang</b> ialah garis yang menyilang dua atau lebih garis lurus.', 'Bina garis selari dengan pembaris dan sesiku, atau dengan menyalin sudut sepadan.'], c), parallel(60, 'Dua garis selari dan satu garis rentas lintang'))
add('6.2', '6.2 Sudut sepadan', 'Sudut sepadan',
    DEF('Apabila garis rentas lintang menyilang dua garis selari, <b>sudut sepadan adalah sama</b> (bentuk F).', c)
    + BUL(['Kedua-dua sudut a berada pada kedudukan yang sama di setiap persilangan.', 'Jika sudut sepadan sama, maka dua garis itu selari.'], c), parallel(60, 'Sudut sepadan a sama', 'sepadan'))
add('6.2', '6.2 Sudut selang-seli', 'Sudut selang-seli dan sudut pedalaman',
    BUL(['<b>Sudut selang-seli</b> adalah sama (bentuk Z): b = b.', '<b>Sudut pedalaman</b> berada di antara dua garis selari, pada sebelah yang sama: p + q = 180° (bentuk C).'], c)
    + NOTE('Hanya sudut sepadan, selang-seli dan pedalaman dibincangkan dalam bab ini.'), parallel(60, 'Sudut selang-seli b sama', 'selang'))
assert 180 - 68 == 112
add('6.2', 'Contoh 1', 'Mencari sudut pada garis selari',
    P('PQ selari dengan RS. Garis rentas lintang membentuk sudut 68° dengan PQ. Cari sudut sepadan, sudut selang-seli dan sudut pedalaman di RS.')
    + STEPS(['Sudut sepadan = 68° (sama)', 'Sudut selang-seli = 68° (sama)', 'Sudut pedalaman = 180° − 68° = 112°'], c) + ANS('68°, 68° dan 112°'), parallel(68, 'Garis selari dengan sudut pedalaman p dan q', 'pedalaman'))
assert 180 - 75 == 105
add('6.2', 'Contoh 2', 'Masalah harian: jalan raya dan lintasan',
    P('Dua lorong jalan raya adalah selari. Sebatang jalan masuk menyilang kedua-dua lorong pada sudut 75° dengan lorong pertama. Berapakah sudut pedalaman di lorong kedua yang perlu dipastikan oleh jurutera semasa menanda garisan jalan?')
    + STEPS(['Lorong selari, jalan masuk ialah garis rentas lintang', 'Sudut pedalaman = 180° − 75°'], c) + ANS('105°')
    + NOTE('Garis selari dan garis rentas lintang menjadi asas reka bentuk sistem pengangkutan yang selamat.'), parallel(75, 'Jalan selari dengan jalan masuk', 'pedalaman'))

finish(SUB, OUT, {'6.1': 6, '6.2': 5})
