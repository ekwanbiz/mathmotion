# Penjana slaid NOTA Bab 1 Nombor Nyata (Tingkatan 1, KP2027) -> nombornyata/slides.js
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from t1lib import *
from mathfmt import FR, RT, SFR, SRT, mathW
OUT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'nombornyata', 'slides.js'))
SUB = {'1.1': ('Nombor Nisbah dan Nombor Tak Nisbah', TR), '1.2': ('Operasi Asas Aritmetik yang Melibatkan Nombor Nisbah', PK), '1.3': ('Kuasa Dua, Punca Kuasa Dua, Kuasa Tiga dan Punca Kuasa Tiga', AM)}
I = lambda t: f'<i>{t}</i>'

def EQRT(cx, y, rad, rest, col, size, n=None):
    """'√rad rest' berpusat di cx; y = tengah teks (seperti T)"""
    w1 = size * .62 + mathW(rad, size) + 4; w2 = mathW(rest, size); x0 = cx - (w1 + 8 + w2) / 2
    return SRT(x0, y + size * .35, rad, col, size, 'start', n) + T(x0 + w1 + 8, y, rest, col, size, 'start')

def numline2(vals, lo, hi, step=1, col=TR, label=''):
    """seperti numline (t1lib) tetapi teks label boleh berupa fungsi f(x, y, warna) -> SVG (pecahan/punca)"""
    s = BOX(); x0, x1, y = 40, 460, 230
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    s += LINE((x0 - 10, y), (x1 + 10, y), MU, 3)
    v = lo
    while v <= hi + 1e-9:
        s += LINE((X(v), y - 8), (X(v), y + 8), MU, 2) + T(X(v), y + 30, ('%g' % v).replace('-', '−'), MU, 16); v += step
    for i, (v, t, c) in enumerate(vals):
        yy = y - 58 - (i % 2) * 58
        if callable(t): s += LINE((X(v), y), (X(v), yy + 26), c, 2, '4 4') + DOT((X(v), y), c, 8) + t(X(v), yy, c)
        else: s += LINE((X(v), y), (X(v), yy + 14), c, 2, '4 4') + DOT((X(v), y), c, 8) + T(X(v), yy, t, c, 18)
    return svg(s, label or 'Garis nombor')
LF = lambda a, b: (lambda x, y, c: SFR(x, y, a, b, c, 17))
LR = lambda r, rest='': (lambda x, y, c: EQRT(x, y, r, rest, c, 18) if rest else SRT(x, y + 6, r, c, 18))

def venn():
    s = BOX()
    s += RECT(20, 40, 460, 380, MU, NAV, 3, 18) + T(250, 66, 'Nombor nyata', MU, 20)
    s += f'<ellipse cx="190" cy="240" rx="160" ry="150" fill="none" stroke="{TR}" stroke-width="4"/>' + T(190, 104, 'Nombor nisbah', TR, 18)
    s += f'<ellipse cx="170" cy="260" rx="110" ry="100" fill="none" stroke="{GR}" stroke-width="4"/>' + T(170, 185, 'Integer', GR, 17)
    s += f'<ellipse cx="160" cy="285" rx="62" ry="55" fill="none" stroke="{AM}" stroke-width="4"/>' + T(160, 262, 'Nombor bulat', AM, 15)
    s += T(160, 300, '0, 1, 7', TX, 17) + T(108, 222, '−3', TX, 17) + SFR(302, 192, 1, 2, TX, 18) + T(292, 300, '0.444…', TX, 16) + T(255, 345, '−2.5', TX, 17)
    s += f'<ellipse cx="410" cy="240" rx="58" ry="130" fill="none" stroke="{PK}" stroke-width="4"/>' + T(410, 96, 'Tak nisbah', PK, 16)
    s += T(410, 200, 'π', TX, 22) + SRT(410, 257, 2, TX, 20) + SRT(410, 307, 5, TX, 20)
    return svg(s, 'Gambar rajah Venn nombor nyata: nombor nisbah mengandungi integer dan nombor bulat; nombor tak nisbah di luar')

def bars(parts, labels, cols, total_lab, label):
    s = BOX(); x, w = 40, 420; tot = sum(parts)
    s += T(250, 70, total_lab, TX, 20)
    s += LINE((40, 95), (460, 95), MU, 2) + LINE((40, 88), (40, 102), MU, 2) + LINE((460, 88), (460, 102), MU, 2)
    for p, l, c in zip(parts, labels, cols):
        ww = w * p / tot
        for j in range(p):
            s += RECT(x + j * w / tot, 130, w / tot, 90, c, NAV, 3, 4)
        s += T(x + ww / 2, 260, l, c, 17)
        x += ww
    return svg(s, label)

def squares(n, label):
    s = BOX(); cell = min(300 / n, 44); x0 = 250 - cell * n / 2; y0 = 60
    for i in range(n):
        for j in range(n):
            s += RECT(x0 + j * cell, y0 + i * cell, cell, cell, AM, NAV, 2, 3)
    s += T(250, y0 + cell * n + 34, f'{n} × {n} = {n*n}', AM, 26)
    s += EQRT(250, y0 + cell * n + 70, n * n, f'= {n}', TR, 24)
    return svg(s, label)

def cube(n, label):
    s = BOX(); a = 170; ox, oy, d = 140, 150, 80
    P1 = [(ox, oy), (ox + a, oy), (ox + a, oy + a), (ox, oy + a)]
    s += POLY([(ox, oy), (ox + d, oy - d * 0.6), (ox + a + d, oy - d * 0.6), (ox + a, oy)], PU, NAV)
    s += POLY([(ox + a, oy), (ox + a + d, oy - d * 0.6), (ox + a + d, oy + a - d * 0.6), (ox + a, oy + a)], PU, NAV)
    s += POLY(P1, PU, NAV)
    for k in range(1, n):
        s += LINE((ox + a * k / n, oy), (ox + a * k / n, oy + a), PU, 2) + LINE((ox, oy + a * k / n), (ox + a, oy + a * k / n), PU, 2)
    s += T(ox + a / 2, oy + a + 26, f'{n} cm', TX, 18)
    s += T(250, 390, f'{n} × {n} × {n} = {n**3}', PU, 26) + EQRT(250, 422, n ** 3, f'= {n}', TR, 22, 3)
    return svg(s, label)

# ===== 1.1 =====
c = TR
add('1.1', '1.1 Nombor Nisbah dan Tak Nisbah', 'Apakah nombor nisbah?',
    DEF(f'<b>Nombor nisbah</b> ialah nombor yang boleh ditulis dalam bentuk {FR(I("a"), I("b"))}, dengan {I("a")} dan {I("b")} ialah integer dan {I("b")} ≠ 0.', c)
    + BUL(['Nombor bulat: 0, 1, 2, 3, …', 'Integer: …, −2, −1, 0, 1, 2, …', 'Pecahan dan perpuluhan terhingga: ' + FR(3, 4) + ', −2.5', 'Perpuluhan berulang: 0.333… = ' + FR(1, 3)], c), venn())
assert abs(1 / 3 - 0.3333333) < 1e-6 and abs(5 / 11 - 0.454545) < 1e-6
add('1.1', '1.1 Nombor Nisbah dan Tak Nisbah', 'Perpuluhan berulang dan tak berulang',
    TABLE(['Perpuluhan', 'Jenis', 'Nisbah?'], [['0.75', 'terhingga', 'Ya: ' + FR(3, 4)], ['0.333… = 0.<span style="text-decoration:overline">3</span>', 'berulang', 'Ya: ' + FR(1, 3)], ['0.4545… = 0.<span style="text-decoration:overline">45</span>', 'berulang', 'Ya: ' + FR(5, 11)], ['3.14159…', 'tak terhingga, tak berulang', 'Tidak (π)'], ['1.41421…', 'tak terhingga, tak berulang', 'Tidak (' + RT(2) + ')']], c)
    + NOTE('Garis di atas digit (0.<span style="text-decoration:overline">3</span>) menunjukkan digit yang berulang.'), venn())
add('1.1', '1.1 Nombor Nisbah dan Tak Nisbah', 'Nombor tak nisbah',
    DEF('<b>Nombor tak nisbah</b> ialah nombor yang <b>tidak boleh</b> ditulis sebagai pecahan ' + FR('<i>a</i>', '<i>b</i>') + '. Perpuluhannya tak terhingga dan tidak berulang.', PK)
    + BUL(['π = 3.14159…', 'Surd: ' + RT(2) + ', ' + RT(3) + ', ' + RT(5) + ', ' + RT(4, 3) + ' (punca bagi nombor yang bukan kuasa sempurna)', 'Contoh lain: 0.101001000100001…'], PK)
    + NOTE(RT(9) + ' = 3 ialah nombor <b>nisbah</b>, kerana 9 ialah kuasa dua sempurna.', 'Awas:'), venn())
add('1.1', '1.1 Nombor Nisbah dan Tak Nisbah', 'Membanding nombor pada garis nombor',
    BUL(['Nombor di <b>kanan</b> lebih besar daripada nombor di kiri.', '<b>&lt;</b> bermaksud “kurang daripada”: −2 &lt; 1', '<b>&gt;</b> bermaksud “lebih daripada”: ' + RT(2) + ' &gt; 1.4', 'Tukar semua nombor kepada perpuluhan untuk membanding.'], c),
    numline2([(-1.5, '−1.5', PK), (0.5, LF(1, 2), GR), (math.sqrt(2), LR(2), AM), (math.pi, 'π', TR)], -2, 4, 1, c, 'Garis nombor dari −2 hingga 4 dengan −1.5, ½, √2 dan π'))
vals = [('−1.5', -1.5), ('½', 0.5), ('√2', math.sqrt(2)), ('π', math.pi), ('−2', -2)]
srt = sorted(vals, key=lambda v: v[1])
assert [v[0] for v in srt] == ['−2', '−1.5', '½', '√2', 'π']
add('1.1', 'Contoh 1', 'Menyusun nombor nyata',
    P('Susun nombor berikut mengikut <b>tertib menaik</b>: π, −1.5, ' + RT(2) + ', −2, ' + FR(1, 2))
    + STEPS(['Tukar kepada perpuluhan: π ≈ 3.14, ' + RT(2) + ' ≈ 1.41, ' + FR(1, 2) + ' = 0.5', 'Nombor negatif paling kecil: −2 &lt; −1.5', 'Kemudian 0.5 &lt; 1.41 &lt; 3.14'], c)
    + ANS('−2, −1.5, ' + FR(1, 2) + ', ' + RT(2) + ', π') + NOTE('Tertib menurun = susunan terbalik: π, ' + RT(2) + ', ' + FR(1, 2) + ', −1.5, −2'),
    numline2([(-2, '−2', PK), (-1.5, '−1.5', PK), (0.5, LF(1, 2), GR), (math.sqrt(2), LR(2), AM), (math.pi, 'π', TR)], -2, 4, 1, c, 'Nombor disusun pada garis nombor'))

# ===== 1.2 =====
c = PK
assert 20 - 3 * (4 + 2) == 2 and 18 / 3 * 2 == 12
add('1.2', '1.2 Operasi Asas Aritmetik', 'Tertib operasi',
    STEPS(['<b>Kurungan</b> ( ) dahulu', '<b>Darab dan bahagi</b>: dari kiri ke kanan', '<b>Tambah dan tolak</b>: dari kiri ke kanan'], c)
    + P('Contoh: 20 − 3 × (4 + 2) = 20 − 3 × 6 = 20 − 18 = <b>2</b>')
    + NOTE('18 ÷ 3 × 2 = 6 × 2 = 12 (bukan 18 ÷ 6 = 3).', 'Awas:'), '')
add('1.2', '1.2 Operasi Asas Aritmetik', 'Hukum operasi',
    TABLE(['Hukum', 'Bentuk', 'Contoh'], [['Kalis tukar tambah', 'a + b = b + a', '3.5 + 2 = 2 + 3.5'], ['Kalis sekutuan tambah', 'a + (b + c) = (a + b) + c', FR(1, 4) + ' + (' + FR(3, 4) + ' + 5) = (' + FR(1, 4) + ' + ' + FR(3, 4) + ') + 5'], ['Kalis tukar darab', 'a × b = b × a', '4 × 2.5 = 2.5 × 4'], ['Kalis sekutuan darab', 'a × (b × c) = (a × b) × c', '25 × (4 × 7) = 100 × 7'], ['Kalis agihan', 'a × (b ± c) = a × b ± a × c', '8 × 102 = 800 + 16']], c)
    + NOTE('Hukum ini membantu mengira dengan <b>cepat tanpa kalkulator</b>.'), '')
assert F(2, 3) + F(1, 4) * F(-2, 1) == F(1, 6)
add('1.2', 'Contoh 1', 'Gabungan operasi pecahan',
    P('Hitung: ' + FR(2, 3) + ' + ' + FR(1, 4) + ' × (−2)')
    + STEPS(['Darab dahulu: ' + FR(1, 4) + ' × (−2) = ' + '−' + FR(1, 2), FR(2, 3) + ' + (' + '−' + FR(1, 2) + ') = ' + FR(2, 3) + ' − ' + FR(1, 2), 'Samakan penyebut: ' + FR(4, 6) + ' − ' + FR(3, 6)], c) + ANS(FR(1, 6))
    + NOTE('Positif × negatif = negatif; negatif × negatif = positif.'), '')
assert 1.2 * (-3) + 0.5 == -3.1 or abs(1.2 * (-3) + 0.5 + 3.1) < 1e-9
add('1.2', 'Contoh 2', 'Gabungan operasi perpuluhan dan integer',
    P('Hitung: −4.8 ÷ 0.6 + 2.5 × (−2)')
    + STEPS(['Bahagi: −4.8 ÷ 0.6 = −8', 'Darab: 2.5 × (−2) = −5', '−8 + (−5) = −13'], c) + ANS('−13'), '')
g = F(750) / (1 - F(1, 5)) / (1 - F(3, 4)); assert g == 3750
add('1.2', 'Contoh 3', 'Masalah harian: model bar',
    P('Mahmud memberikan ' + FR(1, 5) + ' daripada gajinya kepada ibunya. Dia memberikan ' + FR(3, 4) + ' daripada baki gaji kepada isterinya dan menyimpan selebihnya, iaitu RM750. Berapakah gaji Mahmud?')
    + STEPS(['Baki selepas ibu = ' + FR(4, 5) + ' gaji. Simpanan = ' + FR(1, 4) + ' daripada baki.', 'Simpanan = ' + FR(1, 4) + ' × ' + FR(4, 5) + ' = ' + FR(1, 5) + ' gaji', 'Gaji = RM750 × 5'], c) + ANS('RM3 750'),
    bars([1, 3, 1], ['ibu', 'isteri', 'simpan RM750'], [PU, PK, GR], 'Gaji Mahmud (5 bahagian sama)', 'Model bar gaji Mahmud dibahagi lima bahagian'))

# ===== 1.3 =====
c = AM
add('1.3', '1.3 Kuasa dan Punca Kuasa', 'Kuasa dua dan punca kuasa dua',
    DEF('<b>Kuasa dua</b> suatu nombor ialah nombor itu didarab dengan dirinya sendiri: 13² = 13 × 13 = 169.', c)
    + BUL(['<b>Punca kuasa dua</b> ialah songsangan kuasa dua: ' + RT(169) + ' = 13 kerana 13 × 13 = 169.', 'Juga ditulis 169<sup>' + FR(1, 2) + '</sup> = 13.', '<b>Kuasa dua sempurna</b>: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, …'], c), squares(5, 'Petak 5 kali 5 membentuk 25'))
add('1.3', '1.3 Kuasa dan Punca Kuasa', 'Kuasa tiga dan punca kuasa tiga',
    DEF('<b>Kuasa tiga</b>: 2³ = 2 × 2 × 2 = 8. <b>Punca kuasa tiga</b>: ' + RT(8, 3) + ' = 2 kerana 2 × 2 × 2 = 8.', PU)
    + BUL(['Juga ditulis 8<sup>' + FR(1, 3) + '</sup> = 2.', '<b>Kuasa tiga sempurna</b>: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, …', RT('−8', 3) + ' = −2 kerana (−2)³ = −8.'], PU), cube(3, 'Kubus 3 kali 3 kali 3 membentuk 27'))
assert -2 ** 2 == -4 and (-2) ** 2 == 4 and (-3) ** 3 == -27
add('1.3', '1.3 Kuasa dan Punca Kuasa', 'Penggunaan tanda kurung',
    TABLE(['Ungkapan', 'Maksud', 'Nilai'], [['(−2)²', '(−2) × (−2)', '4'], ['−2²', '−(2 × 2)', '−4'], ['(−3)³', '(−3) × (−3) × (−3)', '−27'], ['−3³', '−(3 × 3 × 3)', '−27']], c)
    + NOTE('Kuasa dua nombor negatif sentiasa positif. Kuasa tiga nombor negatif sentiasa negatif.'), '')
assert 6 < math.sqrt(40) < 7 and 3 < 40 ** (1 / 3) < 4
add('1.3', '1.3 Kuasa dan Punca Kuasa', 'Menganggar punca kuasa',
    P('Anggar ' + RT(40) + ' tanpa kalkulator:')
    + STEPS(['Cari dua kuasa dua sempurna terdekat: 36 &lt; 40 &lt; 49', RT(36) + ' &lt; ' + RT(40) + ' &lt; ' + RT(49) + ' → 6 &lt; ' + RT(40) + ' &lt; 7', '40 lebih hampir kepada 36, maka ' + RT(40) + ' ≈ 6.3'], c)
    + NOTE('Cara yang sama untuk punca kuasa tiga: 27 &lt; 40 &lt; 64, maka 3 &lt; ' + RT(40, 3) + ' &lt; 4.'),
    numline2([(6, LR(36, '= 6'), GR), (math.sqrt(40), LR(40), AM), (7, LR(49, '= 7'), GR)], 5, 8, 1, c, 'Garis nombor menunjukkan punca kuasa dua 40 antara 6 dan 7'))
assert 3 * 4 ** 2 - math.isqrt(81) + round(64 ** (1 / 3)) == 43
add('1.3', 'Contoh 1', 'Gabungan operasi',
    P('Hitung: 3 × 4² − ' + RT(81) + ' + ' + RT(64, 3))
    + STEPS(['Kuasa dan punca dahulu: 4² = 16, ' + RT(81) + ' = 9, ' + RT(64, 3) + ' = 4', 'Darab: 3 × 16 = 48', '48 − 9 + 4'], c) + ANS('43'), '')
assert math.isqrt(144) == 12 and 12 * 4 == 48 and round(343 ** (1 / 3)) == 7
add('1.3', 'Contoh 2', 'Masalah harian',
    P('Sebuah taman berbentuk segi empat sama mempunyai luas 144 m². Encik Ali mahu memagar sekeliling taman itu. Berapakah panjang pagar yang diperlukan?')
    + STEPS(['Panjang sisi = ' + RT(144) + ' = 12 m', 'Perimeter = 4 × 12'], c) + ANS('48 m')
    + NOTE('Isi padu kubus 343 cm³ → sisi = ' + RT(343, 3) + ' = 7 cm.', 'Kubus:'), squares(4, 'Segi empat sama'))

finish(SUB, OUT, {'1.1': 5, '1.2': 5, '1.3': 6})
