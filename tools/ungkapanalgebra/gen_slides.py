# Penjana slaid NOTA Bab 4 Ungkapan Algebra (Tingkatan 1, KP2027) -> ungkapanalgebra/slides.js
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'ungkapanalgebra', 'slides.js'))
SUB = {'4.1': ('Pemboleh Ubah dan Ungkapan Algebra', GR)}
I = lambda t: f'<i>{t}</i>'

def tiles(groups, label, title=''):
    """groups: [(jenis, bil, positif)] jenis 'x' atau '1'"""
    s = BOX(); x, y = 30, 70
    if title: s += T(250, 36, title, TX, 20)
    for kind, n, pos in groups:
        for k in range(n):
            col = GR if pos else RD
            if kind == 'x':
                s += RECT(x, y, 30, 90, col, NAV, 3, 5) + T(x + 15, y + 45, ('' if pos else '−') + 'x', col, 16); x += 38
            else:
                s += RECT(x, y + 60, 30, 30, col if kind == '1' else col, NAV, 3, 5) + T(x + 15, y + 75, '+1' if pos else '−1', col, 13); x += 38
            if x > 450: x, y = 30, y + 120
        x += 14
    return svg(s, label)

def distfig():
    s = BOX(); s += T(250, 36, '3(3x + 9): tiga kumpulan yang sama', TX, 18)
    for g in range(3):
        y = 70 + g * 95
        s += RECT(40, y, 210, 70, GR, NAV, 3, 10) + T(145, y + 35, '3x', GR, 26)
        s += RECT(250, y, 180, 70, AM, NAV, 3, 10) + T(340, y + 35, '9', AM, 26)
    s += T(250, 395, '3 × 3x + 3 × 9 = 9x + 27', TR, 22)
    return svg(s, 'Tiga baris segi empat 3x dan 9 menunjukkan 3(3x + 9) = 9x + 27')

def ages():
    s = BOX(); s += T(250, 36, 'Umur Aiman ialah x tahun', TX, 19)
    rows = [('Umur Aiman', 'x', GR), ('5 tahun lagi', 'x + 5', TR), ('Umur bapa (3 kali)', '3x', AM), ('3 tahun dahulu', 'x − 3', PK)]
    for i, (a, b, c) in enumerate(rows):
        y = 90 + i * 75
        s += T(60, y, a, MU, 18, 'start') + RECT(330, y - 24, 130, 48, c, NAV, 3, 10) + T(395, y, b, c, 22)
    return svg(s, 'Jadual umur dalam sebutan x')

# ===== 4.1 =====
c = GR
add('4.1', '4.1 Pemboleh ubah', 'Pemboleh ubah dan pemalar',
    DEF(f'<b>Pemboleh ubah</b> ialah huruf atau simbol (cth. {I("x")}, {I("y")}, {I("n")}) yang mewakili kuantiti yang <b>tidak diketahui</b> atau <b>berubah-ubah</b> nilainya.', c)
    + BUL(['<b>Pemalar</b>: nilai yang tetap, cth. bilangan hari dalam seminggu = 7.', f'Suhu harian berubah-ubah → wakilkan dengan {I("t")}.', f'Umur seseorang berubah setiap tahun → wakilkan dengan {I("x")}.'], c), ages())
add('4.1', '4.1 Membentuk ungkapan', 'Membentuk ungkapan algebra',
    TABLE(['Pernyataan', 'Ungkapan algebra'], [[f'5 lebih daripada {I("x")}', f'{I("x")} + 5'], [f'7 kurang daripada {I("y")}', f'{I("y")} − 7'], [f'dua kali {I("p")}', f'2{I("p")}'], [f'{I("k")} dibahagi dengan 4', f'{I("k")}/4'], [f'harga 3 batang pen jika sebatang RM{I("m")}', f'3{I("m")}'], [f'beza antara {I("a")} dan {I("b")}', f'{I("a")} − {I("b")}']], c)
    + NOTE(f'Sebaliknya juga boleh: 2{I("n")} + 1 bermaksud “1 lebih daripada dua kali {I("n")}”.'), ages())
add('4.1', '4.1 Sebutan', 'Sebutan, pekali dan sebutan serupa',
    BUL([f'Ungkapan 4{I("x")} − 3{I("y")} + 7 mempunyai <b>3 sebutan</b>: 4{I("x")}, −3{I("y")} dan 7.', f'<b>Pekali</b> ialah nombor di hadapan pemboleh ubah: pekali {I("x")} ialah 4, pekali {I("y")} ialah −3.', f'<b>Sebutan serupa</b>: pemboleh ubah dan kuasa yang sama, cth. 3{I("x")} dan −5{I("x")}; 2{I("ab")} dan 7{I("ab")}.', f'<b>Sebutan tak serupa</b>: 3{I("x")} dan 3{I("y")}; {I("x")} dan {I("x")}².'], c)
    + NOTE(f'Pekali bagi {I("x")} ialah 1, pekali bagi −{I("x")} ialah −1.'), '')
add('4.1', '4.1 Tambah dan tolak', 'Tambah dan tolak sebutan serupa',
    P(f'Permudahkan 3{I("x")} + 2 + 2{I("x")} − 5.')
    + STEPS([f'Kumpulkan sebutan serupa: (3{I("x")} + 2{I("x")}) + (2 − 5)', f'= 5{I("x")} + (−3)', f'= 5{I("x")} − 3'], c) + ANS(f'5{I("x")} − 3')
    + NOTE('Jubin +1 dan −1 yang berpasangan membatalkan satu sama lain (pasangan sifar).'),
    tiles([('x', 3, True), ('1', 2, True), ('x', 2, True), ('1', 5, False)], 'Jubin algebra 3x tambah 2 tambah 2x tolak 5', 'Jubin algebra'))
add('4.1', 'Contoh 1', 'Tambah dan tolak ungkapan algebra',
    P(f'Permudahkan (4{I("a")} + 3{I("b")}) − ({I("a")} − 2{I("b")}).')
    + STEPS([f'Buka kurungan; tanda − mengubah tanda setiap sebutan di dalam: 4{I("a")} + 3{I("b")} − {I("a")} + 2{I("b")}', f'Kumpulkan: (4{I("a")} − {I("a")}) + (3{I("b")} + 2{I("b")})'], c) + ANS(f'3{I("a")} + 5{I("b")}')
    + NOTE(f'Kesilapan biasa: menulis −2{I("b")} selepas membuka kurungan. Betulnya +2{I("b")}.', 'Awas:'), '')
add('4.1', '4.1 Darab dan bahagi', 'Darab dan bahagi sebutan algebra',
    TABLE(['Operasi', 'Langkah', 'Jawapan'], [[f'3{I("x")} × 4{I("y")}', '3 × 4 dan x × y', f'12{I("xy")}'], [f'2{I("x")} × 5{I("x")}', f'2 × 5 dan {I("x")} × {I("x")} = {I("x")}²', f'10{I("x")}²'], [f'12{I("ab")} ÷ 4{I("b")}', f'12 ÷ 4 dan {I("ab")} ÷ {I("b")}', f'3{I("a")}'], [f'−18{I("pq")} ÷ 6{I("q")}', '−18 ÷ 6', f'−3{I("p")}']], c)
    + NOTE('Darab atau bahagi nombor dengan nombor, huruf dengan huruf.'), '')
add('4.1', 'Contoh 2', 'Darab dan bahagi ungkapan dengan pemalar',
    P(f'(a) Permudahkan 3(3{I("x")} + 9). (b) Permudahkan (3{I("x")} + 9)/3.')
    + STEPS([f'(a) Darab setiap sebutan dengan 3: 3 × 3{I("x")} + 3 × 9', f'= 9{I("x")} + 27', f'(b) Bahagi setiap sebutan dengan 3: 3{I("x")}/3 + 9/3 = {I("x")} + 3'], c) + ANS(f'(a) 9{I("x")} + 27 (b) {I("x")} + 3'), distfig())
assert 3 * 2 - 5 == 1 and 4 * 3 + 2 * 3 == 18
add('4.1', 'Contoh 3', 'Masalah harian',
    P(f'Harga sebuah buku ialah RM{I("x")} dan harga sebatang pen ialah RM3 kurang daripada harga buku. Siti membeli 4 buah buku dan 2 batang pen. (a) Ungkapkan jumlah bayaran dalam sebutan {I("x")}. (b) Hitung jumlah bayaran jika {I("x")} = 8.')
    + STEPS([f'Harga pen = RM({I("x")} − 3)', f'Jumlah = 4{I("x")} + 2({I("x")} − 3) = 4{I("x")} + 2{I("x")} − 6 = 6{I("x")} − 6', f'Gantikan {I("x")} = 8: 6(8) − 6 = 42'], c) + ANS(f'(a) RM(6{I("x")} − 6) (b) RM42'), '')

finish(SUB, OUT, {'4.1': 8})
