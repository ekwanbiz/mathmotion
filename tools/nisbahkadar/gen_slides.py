# Penjana slaid NOTA Bab 3 Nisbah, Kadar dan Perkadaran (Tingkatan 1, KP2027) -> nisbahkadar/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
from mathfmt import FR, RT, SFR, SRT
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'nisbahkadar', 'slides.js'))
SUB = {'3.1': ('Nisbah', PU), '3.2': ('Kadar dan Perkadaran', TR)}

def beads():
    s = BOX(); s += T(250, 36, 'Kek lapis: tepung, gula, mentega', TX, 18)
    rows = [('Tepung', 4, AM), ('Gula', 2, PK), ('Mentega', 3, GR)]
    y = 80
    for nm, n, col in rows:
        s += T(120, y + 18, nm, col, 18, 'end')
        for k in range(n): s += CIRC((160 + k * 54, y + 18), 20, col, NAV, 3) + T(160 + k * 54, y + 18, '1', col, 15)
        s += T(400, y + 18, f'{n} cawan', col, 18)
        y += 70
    s += T(250, 330, 'tepung : gula : mentega', TX, 20) + T(250, 370, '4 : 2 : 3', AM, 30)
    return svg(s, 'Bahan kek: 4 cawan tepung, 2 cawan gula, 3 cawan mentega')

def eqratios():
    s = BOX(); s += T(250, 36, 'Nisbah setara', TX, 20)
    for i, (a, b) in enumerate([(2, 3), (4, 6), (6, 9)]):
        y = 80 + i * 100
        for k in range(a): s += RECT(70 + k * 22, y, 18, 40, PU, NAV, 2, 4)
        for k in range(b): s += RECT(70 + (a + k) * 22 + 10, y, 18, 40, TR, NAV, 2, 4)
        s += T(440, y + 20, f'{a} : {b}', AM, 24)
    s += T(250, 400, '2 : 3 = 4 : 6 = 6 : 9', GR, 22)
    return svg(s, 'Tiga pasangan blok menunjukkan nisbah setara 2:3, 4:6 dan 6:9')

def speedfig():
    s = BOX(); s += T(250, 36, 'Kereta bergerak 180 km dalam 2 jam', TX, 18)
    x0, x1, y = 50, 450, 200
    s += LINE((x0, y), (x1, y), MU, 4)
    for k in range(3):
        x = x0 + k * (x1 - x0) / 2
        s += LINE((x, y - 10), (x, y + 10), MU, 3) + T(x, y + 36, f'{k} j', MU, 17) + T(x, y - 30, f'{90 * k} km', TR, 18)
    s += T(250, 310, 'Kadar (laju) = 180 km ÷ 2 j', TX, 20) + T(250, 350, '= 90 km/j', AM, 28)
    return svg(s, 'Garis jarak masa: 0, 90 dan 180 km pada 0, 1 dan 2 jam')

def crossmul(a, b, c, label):
    s = BOX()
    s += T(160, 150, f'{a}', TX, 34) + LINE((130, 175), (190, 175), TX, 3) + T(160, 205, f'{b}', TX, 34)
    s += T(250, 178, '=', TX, 34)
    s += T(340, 150, f'{c}', TX, 34) + LINE((310, 175), (370, 175), TX, 3) + T(340, 205, 'x', AM, 34)
    s += LINE((180, 140), (320, 205), PK, 3, '6 5') + LINE((180, 205), (320, 140), PK, 3, '6 5')
    s += T(250, 300, f'{a} × x = {b} × {c}', PK, 24) + T(250, 345, f'x = {b * c // a if (b * c) % a == 0 else round(b * c / a, 2)}', AM, 28)
    return svg(s, label)

# ===== 3.1 =====
c = PU
add('3.1', '3.1 Nisbah', 'Apakah nisbah?',
    DEF('<b>Nisbah</b> membanding dua atau lebih kuantiti yang sama unit. Ditulis <b>a : b</b> atau <b>a : b : c</b>.', c)
    + BUL(['4 cawan tepung kepada 2 cawan gula → 4 : 2', 'Susunan penting: tepung : gula = 4 : 2, gula : tepung = 2 : 4', 'Nisbah tiga kuantiti: tepung : gula : mentega = 4 : 2 : 3'], c), beads())
assert math.gcd(math.gcd(12, 18), 24) == 6
add('3.1', '3.1 Nisbah', 'Nisbah setara dan bentuk termudah',
    DEF('<b>Nisbah setara</b> diperoleh dengan mendarab atau membahagi <b>semua</b> sebutan dengan nombor yang sama.', c)
    + BUL(['2 : 3 = 4 : 6 = 6 : 9', '<b>Bentuk termudah</b>: bahagi semua sebutan dengan FSTB.', '12 : 18 : 24 → bahagi dengan 6 → <b>2 : 3 : 4</b>'], c), eqratios())
add('3.1', 'Contoh 1', 'Nisbah dengan unit berlainan',
    P('Ungkapkan 45 minit : 2 jam dalam bentuk termudah.')
    + STEPS(['Tukar kepada unit yang sama: 2 jam = 120 minit', '45 : 120', 'Bahagi dengan FSTB 15'], c) + ANS('3 : 8')
    + NOTE('Nisbah tidak mempunyai unit selepas ditukar kepada unit yang sama.'), '')
assert (F(1, 2) * 12, F(3, 4) * 12) == (6, 9) and math.gcd(6, 9) == 3
add('3.1', 'Contoh 2', 'Nisbah pecahan, perpuluhan dan peratusan',
    TABLE(['Nisbah', 'Langkah', 'Termudah'], [[f'{FR(1, 2)} : {FR(3, 4)}', 'darab 4 → 2 : 3', '2 : 3'], ['0.6 : 1.5', 'darab 10 → 6 : 15, bahagi 3', '2 : 5'], ['40% : 25%', '40 : 25, bahagi 5', '8 : 5']], c)
    + NOTE('Pecahan: darab dengan GSTK penyebut. Perpuluhan: darab dengan 10, 100, … dahulu.'), '')
add('3.1', 'Contoh 3', 'Mewakilkan nisbah dengan model bar',
    P('Dalam sebuah kelas, nisbah murid lelaki kepada murid perempuan ialah 3 : 5. Lukis model bar dan nyatakan pecahan murid lelaki dalam kelas.')
    + STEPS(['Lelaki 3 unit, perempuan 5 unit', 'Jumlah = 3 + 5 = 8 unit', f'Pecahan lelaki = {FR(3, 8)}'], c) + ANS(f'{FR(3, 8)} daripada kelas ialah lelaki'),
    barmodel([('Lelaki', 3, PU, ''), ('Perempuan', 5, PK, '')], 'Jumlah = 8 unit', '', label='Model bar lelaki 3 unit dan perempuan 5 unit').replace('</svg>', T(236, 262, 'Lelaki =', GR, 19, 'end') + SFR(266, 262, 3, 8, GR, 19) + T(296, 262, 'kelas', GR, 19, 'start') + '</svg>'))

# ===== 3.2 =====
c = TR
add('3.2', '3.2 Kadar', 'Kadar: nisbah dua kuantiti berlainan unit',
    DEF('<b>Kadar</b> ialah nisbah dua kuantiti yang <b>berlainan unit</b>. Biasanya ditulis “per satu unit”.', c)
    + TABLE(['Situasi', 'Kadar'], [['180 km dalam 2 jam', '90 km/j (laju)'], ['RM12 untuk 3 kg', 'RM4 sekilogram (harga)'], ['laju bertambah 20 m/s dalam 4 s', '5 m/s² (pecutan)']], c), speedfig())
assert 3 * 8 == 24 and 24 / 1.5 == 16
add('3.2', '3.2 Perkadaran', 'Perkadaran',
    DEF(f'<b>Perkadaran</b> ialah persamaan dua nisbah yang setara: <b>a : b = c : d</b> atau {FR("a", "b")} = {FR("c", "d")}.', c)
    + BUL(['1 : 4 = 3 : 12 ialah perkadaran.', 'Tukar unit dahulu: 1.5 kg : 500 g = 1500 : 500 = 3 : 1', 'Dalam perkadaran, hasil darab silang adalah sama: a × d = b × c.'], c), crossmul(3, 12, 5, 'Kaedah darab silang 3 per 12 sama dengan 5 per x'))
assert 12 * 5 // 3 == 20
add('3.2', 'Contoh 1', 'Mencari nilai tidak diketahui: tiga kaedah',
    P('3 biji tembikai berharga RM12. Berapakah harga 5 biji tembikai?')
    + TABLE(['Kaedah', 'Pengiraan'], [['Darab silang', f'{FR(3, 12)} = {FR(5, "x")} → 3x = 60 → x = 20'], ['Unitari', '1 biji = RM12 ÷ 3 = RM4; 5 biji = RM20'], ['Model bar', '3 unit = RM12, 1 unit = RM4, 5 unit = RM20']], c) + ANS('RM20'),
    barmodel([('3 biji', 3, TR, 'RM4'), ('5 biji', 5, AM, 'RM4')], '1 unit = RM12 ÷ 3 = RM4', '5 unit = RM20', label='Model bar harga tembikai'))
tot = 24 * 9 // 3; assert tot == 72 and 72 * 2 // 9 == 16
add('3.2', 'Contoh 2', 'Diberi nisbah tiga kuantiti dan satu nilai',
    P('Wang Ali, Bala dan Chong dalam nisbah 2 : 3 : 4. Wang Bala ialah RM24. Hitung jumlah wang mereka dan wang Ali.')
    + STEPS(['3 unit = RM24, maka 1 unit = RM8', 'Jumlah = 2 + 3 + 4 = 9 unit = 9 × RM8', 'Ali = 2 unit = 2 × RM8'], c) + ANS('Jumlah RM72; Ali RM16'),
    barmodel([('Ali', 2, PU, 'RM8'), ('Bala', 3, TR, 'RM8'), ('Chong', 4, GR, 'RM8')], 'Bala: 3 unit = RM24 → 1 unit = RM8', 'Jumlah 9 unit = RM72', label='Model bar wang Ali, Bala dan Chong'))
assert 150 * 4 == 600 and 600 / 150 == 4
add('3.2', 'Contoh 3', 'Masalah harian: penggunaan air',
    P('Taman A (200 orang) menggunakan 30 000 liter air sehari. Taman B (150 orang) menggunakan 24 000 liter sehari. Taman manakah menggunakan air dengan lebih cekap?')
    + STEPS(['Kadar per kapita A = 30 000 ÷ 200 = 150 liter/orang', 'Kadar per kapita B = 24 000 ÷ 150 = 160 liter/orang', 'Kadar lebih rendah = lebih cekap'], c) + ANS('Taman A (150 liter seorang sehari)')
    + NOTE('Bandingkan menggunakan kadar “per satu orang”, bukan jumlah.'), '')

finish(SUB, OUT, {'3.1': 5, '3.2': 5})
