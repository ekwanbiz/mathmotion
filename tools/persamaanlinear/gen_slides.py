# Penjana slaid NOTA Bab 5 Persamaan dan Ketaksamaan Linear (Tingkatan 1, KP2027) -> persamaanlinear/slides.js
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
from mathfmt import FR, RT, SFR, SRT
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'persamaanlinear', 'slides.js'))
SUB = {'5.1': ('Persamaan Linear dalam Satu Pemboleh Ubah', TR), '5.2': ('Ketaksamaan Linear dalam Satu Pemboleh Ubah', PK)}
I = lambda t: f'<i>{t}</i>'

def balance(left, right, label, cap=''):
    """left/right: senarai ('x' atau nombor unit)"""
    s = BOX()
    s += POLY([(250, 330), (225, 380), (275, 380)], MU, NAV, 3) + LINE((60, 330), (440, 330), MU, 6)
    for side, items, cx in [(0, left, 150), (1, right, 350)]:
        s += LINE((cx - 90, 330), (cx - 90, 310), MU, 3) + LINE((cx + 90, 330), (cx + 90, 310), MU, 3)
        x = cx - 80; y = 270
        for it in items:
            if it == 'x':
                s += RECT(x, y - 10, 34, 50, TR, NAV, 3, 6) + T(x + 17, y + 15, 'x', TR, 18); x += 40
            else:
                s += CIRC((x + 14, y + 26), 14, AM, NAV, 3) + T(x + 14, y + 26, '1', AM, 13); x += 32
            if x > cx + 50: x = cx - 80; y -= 58
    if cap: s += T(250, 50, cap, TX, 22)
    return svg(s, label)

def nline(v, closed, right, label, v2=None, closed2=None, right2=None):
    s = BOX(); x0, x1, y = 40, 460, 210
    lo, hi = v - 5, v + 5
    if v2 is not None: lo, hi = min(v, v2) - 3, max(v, v2) + 3
    X = lambda t: x0 + (t - lo) / (hi - lo) * (x1 - x0)
    s += LINE((x0 - 10, y), (x1 + 10, y), MU, 3)
    for t in range(lo, hi + 1):
        s += LINE((X(t), y - 8), (X(t), y + 8), MU, 2) + T(X(t), y + 30, str(t).replace('-', '−'), MU, 15)
    def ray(v, closed, right, yy, col):
        nonlocal s
        end = x1 + 5 if right else x0 - 5
        s += LINE((X(v), yy), (end, yy), col, 5) + POLY([(end, yy), (end - (12 if right else -12), yy - 8), (end - (12 if right else -12), yy + 8)], col, col, 2)
        s += CIRC((X(v), yy), 10, col, col if closed else NAV, 4)
    ray(v, closed, right, y - 60, PK)
    if v2 is not None:
        ray(v2, closed2, right2, y - 110, TR)
        a, b = (v, v2) if v < v2 else (v2, v)
        s += RECT(X(a), y - 20, X(b) - X(a), 40, GR, 'none', 3, 6)
    return svg(s, label)

def sign(lim, label):
    s = BOX(); s += CIRC((150, 200), 100, RD, 'none', 18) + T(150, 205, str(lim), TX, 56)
    s += T(360, 150, 'Had laju', TX, 22) + T(360, 200, f'laju ≤ {lim} km/j', AM, 24) + T(360, 250, f'{I("v")} ≤ {lim}', PK, 30)
    return svg(s, label)

# ===== 5.1 =====
c = TR
add('5.1', '5.1 Persamaan linear', 'Ciri persamaan linear dalam satu pemboleh ubah',
    DEF(f'<b>Persamaan linear dalam satu pemboleh ubah</b> mempunyai tanda “=”, <b>satu</b> pemboleh ubah sahaja, dan kuasa pemboleh ubah itu ialah <b>1</b>.', c)
    + TABLE(['Contoh', 'Persamaan linear satu pemboleh ubah?'], [[f'2{I("x")} + 5 = 11', 'Ya'], [f'{FR(I("y"), 3)} − 1 = 4', 'Ya'], [f'{I("x")}² + 1 = 10', 'Tidak (kuasa 2)'], [f'{I("x")} + {I("y")} = 7', 'Tidak (dua pemboleh ubah)'], [f'3{I("x")} + 4', 'Tidak (tiada “=”, hanya ungkapan)']], c), balance(['x', 'x', 1, 1, 1, 1, 1], [1] * 11, 'Neraca seimbang 2x + 5 = 11', '2x + 5 = 11'))
add('5.1', '5.1 Membentuk persamaan', 'Membentuk persamaan linear',
    TABLE(['Pernyataan / situasi', 'Persamaan'], [[f'Hasil tambah suatu nombor dan 8 ialah 15', f'{I("x")} + 8 = 15'], ['Tiga kali suatu nombor ditolak 4 ialah 20', f'3{I("x")} − 4 = 20'], ['Harga 5 buah buku ialah RM35', f'5{I("b")} = 35'], ['Umur Ali 6 tahun lagi ialah 19 tahun', f'{I("u")} + 6 = 19']], c)
    + NOTE(f'Sebaliknya: 2{I("n")} = 18 boleh bermaksud “dua kali suatu nombor ialah 18”.'), '')
assert (11 - 5) / 2 == 3
add('5.1', '5.1 Menyelesaikan', 'Menyelesaikan persamaan: kekalkan keseimbangan',
    P(f'Selesaikan 2{I("x")} + 5 = 11.')
    + STEPS([f'Tolak 5 pada kedua-dua belah: 2{I("x")} + 5 − 5 = 11 − 5', f'2{I("x")} = 6', f'Bahagi kedua-dua belah dengan 2: {I("x")} = 3'], c) + ANS(f'{I("x")} = 3')
    + NOTE(f'Semak: 2(3) + 5 = 11 ✓. Apa yang dibuat pada sebelah kiri mesti dibuat pada sebelah kanan.'),
    balance(['x', 'x'], [1] * 6, 'Neraca 2x = 6 selepas buang 5 di kedua-dua belah', '2x = 6'))
assert 3 * (4 - 2) == 6 and (2 * 5 + 2) / 3 == 4 and 4 * 2 - 3 == 5
add('5.1', 'Contoh 1', 'Persamaan dengan kurungan dan pecahan',
    TABLE(['Persamaan', 'Langkah', 'Jawapan'], [[f'3({I("x")} − 2) = 6', f'Bahagi 3: {I("x")} − 2 = 2', f'{I("x")} = 4'], [f'{FR(f"{I("y")} + 2", 3)} = 4', f'Darab 3: {I("y")} + 2 = 12', f'{I("y")} = 10'], [f'5{I("k")} − 3 = 2{I("k")} + 9', f'Kumpul: 5{I("k")} − 2{I("k")} = 9 + 3, 3{I("k")} = 12', f'{I("k")} = 4']], c)
    + NOTE('Pindahkan sebutan ke sebelah yang lain dengan operasi songsang (tambah ↔ tolak, darab ↔ bahagi).'), '')
assert (64 - 4) / 3 == 20
add('5.1', 'Contoh 2', 'Masalah harian',
    P('Perimeter sebuah padang segi empat tepat ialah 64 m. Panjangnya 2 m lebih daripada dua kali lebarnya. Cari lebar padang itu.')
    + STEPS([f'Katakan lebar = {I("x")} m, panjang = (2{I("x")} + 2) m', f'2(2{I("x")} + 2) + 2{I("x")} = 64 → 6{I("x")} + 4 = 64', f'6{I("x")} = 60 → {I("x")} = 10'], c) + ANS('Lebar 10 m (panjang 22 m)'), '')

# ===== 5.2 =====
c = PK
add('5.2', '5.2 Ketaksamaan', 'Simbol ketaksamaan dan garis nombor',
    TABLE(['Simbol', 'Maksud', 'Garis nombor'], [['&gt;', 'lebih daripada', 'bulatan kosong ○'], ['&lt;', 'kurang daripada', 'bulatan kosong ○'], ['≥', 'lebih daripada atau sama dengan', 'bulatan penuh ●'], ['≤', 'kurang daripada atau sama dengan', 'bulatan penuh ●']], c)
    + BUL([f'−3 &lt; 1 kerana −3 terletak di sebelah kiri 1.', f'{I("x")} &gt; 2: semua nombor lebih daripada 2 (2 tidak termasuk).'], c),
    nline(2, False, True, 'Garis nombor x lebih daripada 2 dengan bulatan kosong di 2'))
add('5.2', '5.2 Ketaksamaan harian', 'Ketaksamaan dalam kehidupan: PKJR',
    BUL([f'Papan tanda had laju 90 → laju kenderaan {I("v")} ≤ 90 km/j.', f'Had ketinggian 4.5 m → tinggi kenderaan {I("h")} ≤ 4.5 m.', f'Umur layak memohon lesen motosikal: {I("u")} ≥ 16 tahun.', f'Lif: jumlah jisim {I("m")} ≤ 900 kg.'], c)
    + NOTE('Perkataan “tidak melebihi”, “maksimum” → ≤. “Sekurang-kurangnya”, “minimum” → ≥.'), sign(90, 'Papan tanda had laju 90'))
add('5.2', '5.2 Operasi', 'Operasi pada kedua-dua belah ketaksamaan',
    TABLE(['Operasi pada 3 &lt; 7', 'Hasil', 'Simbol'], [['tambah 2', '5 &lt; 9', 'kekal'], ['tolak 4', '−1 &lt; 3', 'kekal'], ['darab 2', '6 &lt; 14', 'kekal'], ['darab −2', '−6 &gt; −14', '<b>bertukar arah</b>'], ['bahagi −1', '−3 &gt; −7', '<b>bertukar arah</b>']], c)
    + NOTE('Darab atau bahagi dengan nombor <b>negatif</b> → simbol ketaksamaan bertukar arah. Jika a &lt; b, maka −a &gt; −b.', 'Penting:'), '')
assert (13 - 1) / 3 == 4 and -2 * -3 == 6
add('5.2', 'Contoh 1', 'Menyelesaikan ketaksamaan linear',
    TABLE(['Ketaksamaan', 'Langkah', 'Penyelesaian'], [[f'3{I("x")} + 1 &lt; 13', f'3{I("x")} &lt; 12', f'{I("x")} &lt; 4'], [f'5 − 2{I("x")} ≤ 11', f'−2{I("x")} ≤ 6, bahagi −2 (tukar arah)', f'{I("x")} ≥ −3'], [f'{FR(I("x"), 4)} + 2 &gt; 3', f'{FR(I("x"), 4)} &gt; 1', f'{I("x")} &gt; 4']], c),
    nline(-3, True, True, 'Garis nombor x lebih daripada atau sama dengan negatif 3'))
add('5.2', 'Contoh 2', 'Ketaksamaan linear serentak',
    P(f'Cari penyelesaian sepunya bagi 2{I("x")} − 1 &gt; 3 dan {I("x")} + 4 ≤ 9. Seterusnya, senaraikan integer yang memuaskan.')
    + STEPS([f'2{I("x")} &gt; 4 → {I("x")} &gt; 2', f'{I("x")} ≤ 5', f'Kawasan sepunya: 2 &lt; {I("x")} ≤ 5'], c) + ANS(f'2 &lt; {I("x")} ≤ 5; integer: 3, 4, 5'),
    nline(2, False, True, 'Garis nombor dua ketaksamaan dengan kawasan sepunya antara 2 dan 5', 5, True, False))
assert 500 + 45 * 20 <= 1500 and 500 + 45 * 23 > 1500
add('5.2', 'Contoh 3', 'Masalah harian',
    P('Sebuah syarikat menyewa dewan dengan bayaran tetap RM500 dan RM45 bagi setiap tetamu. Bajet maksimum ialah RM1 500. Berapakah bilangan tetamu maksimum?')
    + STEPS([f'Katakan bilangan tetamu = {I("t")}', f'500 + 45{I("t")} ≤ 1500 → 45{I("t")} ≤ 1000', f'{I("t")} ≤ 22.2…, maka {I("t")} ialah integer terbesar'], c) + ANS('22 orang tetamu')
    + NOTE('Bilangan orang mesti nombor bulat; bundarkan ke bawah supaya tidak melebihi bajet.'), '')

finish(SUB, OUT, {'5.1': 5, '5.2': 6})
