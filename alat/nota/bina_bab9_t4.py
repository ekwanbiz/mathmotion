"""Bab 9 T4 Kebarangkalian Peristiwa Bergabung: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Nombor CONTOH 1–13 ikut buku. Subtopik folder peristiwa dikekalkan (9.1–9.4)."""
import os, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "9.1", "name": "Peristiwa Bergabung", "col": "#38BDF8"}, {"no": "9.2", "name": "Bersandar dan Tak Bersandar", "col": "#FB923C"},
        {"no": "9.3", "name": "Peristiwa Saling Eksklusif", "col": "#A78BFA"}, {"no": "9.4", "name": "Aplikasi Peristiwa Bergabung", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


def Ff(q):
    q = Fr(q)
    return str(q.numerator) if q.denominator == 1 else F(q.numerator, q.denominator)


def P(s):
    return f'{i("P")}({s})'


U, N_ = '∪', '∩'


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def sf(x, y, q, col=AM, fs=15):
    """pecahan bertindan dalam SVG."""
    q = Fr(q)
    if q.denominator == 1:
        return GF.T(x, y, str(q.numerator), col, fs)
    w = max(len(str(q.numerator)), len(str(q.denominator))) * fs * 0.62 + 6
    return GF.T(x, y - fs * 0.62, str(q.numerator), col, fs) + GF.L((x - w / 2, y), (x + w / 2, y), col, 1.6) + GF.T(x, y + fs * 0.68, str(q.denominator), col, fs)


def tree(first, second, h1='Pertama', h2='Kedua', y0=60, H=400, fs=15, outc=True, hl=()):
    """first: [(label, prob)], second: {label: [(label, prob)]}. Pulang svg dalam."""
    o = GF.T(70, 24, h1, MU, 14) + GF.T(250, 24, h2, MU, 14) + (GF.T(420, 24, 'Kesudahan', MU, 14) if outc else '')
    leaves = sum(len(second[a]) for a, _ in first)
    step = (H - y0) / leaves
    k = 0
    for a, pa in first:
        ys = [y0 + (k + j + 0.5) * step for j in range(len(second[a]))]
        ya = sum(ys) / len(ys)
        x0, y_0 = 20, (y0 + H) / 2
        o += GF.L((x0, y_0), (128, ya), MU3, 2.2) + sf(70, (y_0 + ya) / 2 - (14 if ya < y_0 else -14) - (4 if ya < y_0 else -10), pa, AM, fs)
        o += f'<circle cx="146" cy="{ya:.1f}" r="16" fill="#0E1626" stroke="{TR}" stroke-width="2.5"/>' + GF.T(146, ya, a, TX, 15)
        for (b, pb), yb in zip(second[a], ys):
            on = (a, b) in hl
            o += GF.L((164, ya), (300, yb), GR if on else MU3, 2.2) + sf(262, ya + 0.72 * (yb - ya) - 13, pb, AM, fs - 1)
            o += f'<circle cx="318" cy="{yb:.1f}" r="16" fill="#0E1626" stroke="{GR if on else TR}" stroke-width="2.5"/>' + GF.T(318, yb, b, TX, 15)
            if outc:
                o += GF.T(420, yb, f'({a}, {b})', GR if on else TX, 15)
        k += len(second[a])
    return o


def vennbox(circles, elems, x0=20, y0=20, w=460, h=300, lab='ξ'):
    """circles: [(nama, cx, cy, r, warna)], elems: [(teks, x, y)]."""
    o = f'<rect x="{x0}" y="{y0}" width="{w}" height="{h}" rx="10" fill="none" stroke="{MU3}" stroke-width="2"/>' + GF.T(x0 + 18, y0 + 20, lab, TX, 17)
    for nm_, cx, cy, r, col, lx, ly in circles:
        o += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{col}" fill-opacity="0.12" stroke="{col}" stroke-width="2.5"/>' + GF.T(lx, ly, nm_, col, 18)
    for t, x, y in elems:
        o += GF.T(x, y, t, TX, 16)
    return o


# =====================================================================
# 9.1 PERISTIWA BERGABUNG
# =====================================================================
s = '9.1'
c = COL[s]
S(s, 'DEFINISI', 'Peristiwa bergabung',
  p('Dalam kehidupan seharian kita perlu membuat banyak keputusan berdasarkan ketidakpastian. Kebarangkalian digunakan untuk menilai ketidakpastian yang terlibat dalam proses membuat keputusan.')
  + de(s, 'Peristiwa bergabung ialah gabungan dua atau lebih peristiwa dalam satu kesudahan.')
  + p('Sebagai contoh, kesudahan yang mungkin bagi dua orang murid bermain "Gunting-Batu-Kertas" adalah (Gunting, Batu), (Gunting, Kertas), (Gunting, Gunting), (Batu, Gunting), (Batu, Kertas), (Batu, Batu), (Kertas, Gunting), (Kertas, Batu) dan (Kertas, Kertas).')
  + p('Peristiwa bergabung boleh terhasil daripada satu atau lebih eksperimen.'),
  stack(formula(f'{i("n")}({i("S")}) = {i("n")}({i("A")}) × {i("n")}({i("B")})', c),
        p(f'{i("n")}({i("S")}) ialah jumlah bilangan kesudahan yang mungkin, {i("n")}({i("A")}) dan {i("n")}({i("B")}) masing-masing mewakili bilangan kesudahan peristiwa {i("A")} dan peristiwa {i("B")}.'),
        note('Ruang sampel ialah set yang mengandungi semua kesudahan yang mungkin bagi sesuatu eksperimen. Kesudahan suatu peristiwa bergabung boleh diwakilkan dengan pasangan bertertib.', 'Ingat:')))

K1 = 'SUKA'
ss = [f'({a}, {b})' for x, a in enumerate(K1) for y, b in enumerate(K1) if x != y]
assert len(ss) == 12
S(s, 'CONTOH 1', 'Ruang sampel peristiwa bergabung',
  p('Tulis ruang sampel bagi peristiwa bergabung di bawah.')
  + p('(a) Empat keping kad berlabel dengan huruf "S, U, K, A" dimasukkan dalam sebuah kotak. Dua keping kad dikeluarkan dari kotak secara rawak satu demi satu tanpa pemulangan.')
  + p('(b) Sekeping syiling dilambung dan sebiji dadu empat muka berlabel "1, 2, 3, 4" dilambung (A dan G mewakili angka dan gambar masing-masing).'),
  work([('Penyelesaian', ['(a) {' + ', '.join(ss[:6]) + ',', ', '.join(ss[6:]) + '}', f'{i("n")}({i("S")}) = 4 × 3 = 12',
                          '(b) {(A, 1), (A, 2), (A, 3), (A, 4), (G, 1), (G, 2), (G, 3), (G, 4)}', f'{i("n")}({i("S")}) = 2 × 4 = 8'])], s, 1, 18))

# =====================================================================
# 9.2 BERSANDAR DAN TAK BERSANDAR
# =====================================================================
s = '9.2'
c = COL[s]
S(s, 'DEFINISI', 'Peristiwa bersandar dan peristiwa tak bersandar',
  p('Peristiwa bergabung boleh dikategorikan kepada peristiwa bersandar dan peristiwa tak bersandar.')
  + de(s, f'Dua peristiwa {i("A")} dan {i("B")} ialah peristiwa tak bersandar jika peristiwa {i("A")} tidak mempengaruhi kejadian peristiwa {i("B")} dan sebaliknya. Peristiwa {i("A")} dan {i("B")} ialah peristiwa bersandar sekiranya peristiwa {i("A")} mempengaruhi kejadian peristiwa {i("B")}.')
  + p('Kotak P mengandungi lima keping kad berlabel dengan huruf "M, E, J, A, R". Dua keping kad dipilih secara rawak satu demi satu.'),
  table(['Kes', 'Pemilihan', 'Kesimpulan'],
        [['I', 'Tanpa pemulangan. Kekurangan kad berhuruf konsonan yang pertama mempengaruhi kebarangkalian untuk memilih kad berhuruf konsonan yang kedua.', 'Peristiwa bersandar'],
         ['II', 'Dengan pemulangan. Kebarangkalian memilih kad berhuruf konsonan yang kedua sama dengan kebarangkalian pemilihan kad berhuruf konsonan yang pertama.', 'Peristiwa tak bersandar']], c, 16, False))

Q2 = ['(a) Mendapat gambar sebanyak dua kali apabila sekeping syiling adil dilambung dua kali.', '(b) Mendapat gambar dalam lambungan syiling adil dan nombor 5 dalam lambungan dadu adil.',
      '(c) Mendapat dua batang pensel yang berwarna sama apabila dua batang pensel dikeluarkan satu demi satu dari bekas yang mengandungi empat batang pensel hitam dan tiga batang pensel biru tanpa pemulangan.',
      '(d) Mendapat dua keping kad yang berhuruf sama apabila dua keping kad dipilih secara rawak daripada kad berlabel dengan huruf "D, U, I, T" satu demi satu dengan pemulangan.']
A2 = ['(a) Peristiwa tak bersandar kerana kebarangkalian mendapat gambar dalam lambungan syiling pertama tidak mempengaruhi kebarangkalian mendapat gambar dalam lambungan syiling kedua.',
      '(b) Peristiwa tak bersandar kerana kebarangkalian mendapat gambar dalam lambungan syiling adil tidak mempengaruhi kebarangkalian mendapat nombor 5 dalam lambungan dadu adil.',
      '(c) Peristiwa bersandar kerana kebarangkalian mendapat pensel hitam yang pertama akan mempengaruhi kebarangkalian mendapat pensel hitam yang kedua.',
      '(d) Peristiwa tak bersandar kerana kebarangkalian kad pertama yang dipilih tidak mempengaruhi kebarangkalian kad kedua dipilih.']
for k, (kk, tt) in enumerate([('CONTOH 2', 'Mengenal pasti peristiwa bersandar dan tak bersandar'), ('CONTOH 2 (sambungan)', 'Mengenal pasti peristiwa bersandar dan tak bersandar')]):
    S(s, kk, tt,
      p('Kenal pasti sama ada peristiwa bergabung di bawah ialah peristiwa bersandar atau peristiwa tak bersandar dan berikan justifikasi anda.') + bul(s, Q2[2 * k:2 * k + 2]),
      work([('Penyelesaian', A2[2 * k:2 * k + 2])], s, 1, 18))

pK, pG = Fr(1, 6), Fr(2, 5)
assert pK * pG == Fr(2, 30) == Fr(1, 15)
S(s, 'CONTOH 3', 'Hukum Pendaraban Kebarangkalian',
  p('Kebarangkalian persilangan dua peristiwa A dan B yang tak bersandar adalah sama dengan hasil darab kebarangkalian A dan kebarangkalian B.')
  + formula(f'{P(f"{i("A")} dan {i("B")}")} = {P(f"{i("A")} {N_} {i("B")}")} = {P(i("A"))} × {P(i("B"))}', c)
  + p('<b>CONTOH 3</b> Sebuah kotak F mengandungi enam keping kad berlabel dengan huruf "K, E, R, U, S, I" dan sebuah kotak G mengandungi lima keping kad berlabel dengan nombor "3, 6, 7, 9, 10". Sekeping kad dipilih secara rawak dari kotak F dan kotak G masing-masing. Tentu sahkan konjektur rumus kebarangkalian untuk mendapat huruf K dan nombor genap dengan menyenaraikan semua kesudahan yang mungkin.'),
  work([('(a) Hukum pendaraban', [f'P(mendapat huruf K) = {F(1, 6)}', f'P(mendapat nombor genap) = {F(2, 5)}', f'P(mendapat huruf K dan nombor genap) = {F(1, 6)} × {F(2, 5)} = {F(2, 30)} = {F(1, 15)}']),
        ('(b) Menyenaraikan semua kesudahan yang mungkin', ['Kesudahan yang mungkin = {(K, 6), (K, 10)}', f'{i("n")}({i("S")}) = 6 × 5 = 30', f'P(mendapat huruf K dan nombor genap) = {F(2, 30)} = {F(1, 15)}']),
        ('', ['Maka terbuktilah bahawa kedua-dua kaedah menghasilkan jawapan yang sama.'])], s, 1, 17))

assert Fr(3, 4) * Fr(1, 3) == Fr(3, 12) == Fr(1, 4)
S(s, 'CONTOH 4', 'Kebarangkalian peristiwa tak bersandar',
  p('Kotak A dan kotak B masing-masing mengandungi kad berlabel dengan nombor "1, 3, 5, 7" dan kad berlabel dengan huruf "P, Q, R". Sekeping kad dipilih secara rawak masing-masing dari kotak A dan kotak B.')
  + p('Hitung kebarangkalian mendapat faktor bagi 15 dan huruf R.'),
  work([('Penyelesaian', [f'Faktor bagi 15 = 1, 3, 5', f'P(faktor bagi 15) = {F(3, 4)}', f'P(huruf "R") = {F(1, 3)}', f'P(faktor bagi 15 dan huruf "R") = {F(3, 4)} × {F(1, 3)} = {F(1, 4)}']),
        ('Kaedah alternatif', ['Faktor bagi 15 dan huruf "R" = {(1, R), (3, R), (5, R)}', f'{i("n")}({i("S")}) = 4 × 3 = 12', f'P(faktor bagi 15 dan huruf "R") = {F(3, 12)} = {F(1, 4)}'])], s, 1, 18))

H, M = 'H', 'M'
t5 = {H: [(H, Fr(5, 7)), (M, Fr(2, 7))], M: [(H, Fr(6, 7)), (M, Fr(1, 7))]}
p_i = Fr(6, 8) * Fr(2, 7) + Fr(2, 8) * Fr(1, 7)
p_ii = Fr(6, 8) * Fr(5, 7)
assert p_i == Fr(1, 4) and p_ii == Fr(15, 28)
S(s, 'CONTOH 5', 'Gambar rajah pokok bagi peristiwa bersandar',
  p('Sebuah beg mengandungi enam biji guli hijau dan dua biji guli merah. Dua biji guli dipilih secara rawak dari beg tersebut satu demi satu tanpa pemulangan. Warna guli dicatat.')
  + p('(a) Wakilkan situasi di atas dengan gambar rajah pokok. (b) Hitung kebarangkalian (i) mendapat guli kedua berwarna merah, (ii) mendapat kedua-dua biji guli berwarna hijau.')
  + note('Gambar rajah pokok memaparkan semua kesudahan yang berkemungkinan bagi sesuatu peristiwa. Setiap cabang mewakili satu kesudahan yang mungkin.', 'Ingat:'),
  stack(SVh(tree([(H, Fr(6, 8)), (M, Fr(2, 8))], t5, 'Guli pertama', 'Guli kedua', H=290), 'Gambar rajah pokok guli', 300, 0),
        work([('Penyelesaian', [f'(b)(i) P(guli kedua berwarna merah) = P(H, M) + P(M, M) = ({F(6, 8)} × {F(2, 7)}) + ({F(2, 8)} × {F(1, 7)}) = {F(14, 56)} = {F(1, 4)}',
                                f'(ii) P(kedua-dua biji guli berwarna hijau) = {F(6, 8)} × {F(5, 7)} = {F(15, 28)}'])], s, 1, 15)))

# =====================================================================
# 9.3 PERISTIWA SALING EKSKLUSIF
# =====================================================================
s = '9.3'
c = COL[s]
v = vennbox([('T', 150, 170, 105, TR, 70, 80), ('U', 300, 170, 80, PA, 320, 80), ('V', 400, 210, 60, PU, 455, 140)],
            [('2', 105, 130), ('6', 95, 200), ('8', 150, 240), ('4', 230, 170), ('1', 340, 220), ('9', 355, 175), ('3', 420, 230), ('5', 60, 290), ('7', 250, 290)])
v = vennbox([('T', 140, 170, 100, TR, 60, 80), ('U', 270, 170, 80, PA, 270, 75), ('V', 360, 190, 70, PU, 440, 120)],
            [('2', 95, 130), ('6', 85, 200), ('8', 140, 240), ('4', 215, 170), ('1', 315, 200), ('9', 320, 150), ('3', 395, 230), ('5', 60, 300), ('7', 450, 300)])
S(s, 'DEFINISI', 'Peristiwa saling eksklusif',
  p('Bola pingpong yang berlabel dari 1 hingga 9 dimasukkan ke dalam satu bakul kosong. Seorang murid memilih sebiji bola pingpong secara rawak. Katakan T ialah peristiwa mendapat nombor genap, U ialah peristiwa mendapat nombor kuasa dua sempurna dan V ialah peristiwa mendapat faktor bagi 9.')
  + bul(s, ['Peristiwa T dan V tidak boleh berlaku pada masa yang sama. Maka, peristiwa T dan V dikatakan peristiwa saling eksklusif.', 'Peristiwa T dan U ialah peristiwa tidak saling eksklusif kerana 4 ialah kesudahan sepunya bagi T dan U.'])
  + de(s, f'Peristiwa gabungan {i("A")} dan {i("B")} dikenali sebagai peristiwa saling eksklusif sekiranya tidak ada persilangan antara peristiwa {i("A")} dengan peristiwa {i("B")}, {i("A")} {N_} {i("B")} = ∅.'),
  SVh(v, 'Gambar rajah Venn peristiwa T, U dan V', 310, 15))

S(s, 'CONTOH 6', 'Mengenal pasti peristiwa saling eksklusif',
  p('Seorang pekerja dalam sebuah kilang dipilih secara rawak. Diberi')
  + bul(s, ['A = Pekerja bergaji kurang daripada RM2 000.', 'B = Pekerja perlu membayar cukai pendapatan.', 'C = Pekerja pergi bekerja dengan menunggang motosikal.'])
  + p('Tentukan sama ada pasangan peristiwa berikut ialah peristiwa saling eksklusif atau peristiwa tidak saling eksklusif. (a) A dan B (b) A dan C (c) B dan C')
  + note('Pekerja yang bergaji rendah tidak perlu membayar cukai pendapatan.', 'Info:'),
  work([('Penyelesaian', ['(a) Peristiwa A dan B tidak boleh berlaku bersama, maka A dan B ialah peristiwa saling eksklusif.', '(b) Peristiwa A dan C boleh berlaku bersama, maka A dan C ialah peristiwa tidak saling eksklusif.',
                          '(c) Peristiwa B dan C boleh berlaku bersama, maka B dan C ialah peristiwa tidak saling eksklusif.'])], s, 1, 18))

m1 = vennbox([('A', 90, 110, 55, TR, 90, 110), ('B', 220, 110, 55, PA, 220, 110)], [], 20, 30, 260, 160, '') + GF.T(150, 220, 'saling eksklusif', TX, 15)
m2 = vennbox([('A', 330, 110, 60, TR, 310, 110), ('B', 410, 110, 60, PA, 430, 110)], [], 290, 30, 190, 160, '')
m2 = f'<g transform="translate(0,0)">{vennbox([("A", 340, 110, 55, TR, 320, 110), ("B", 415, 110, 55, PA, 435, 110)], [], 290, 30, 190, 160, "")}</g>' + GF.T(385, 220, 'tidak saling eksklusif', TX, 15)
m1 = vennbox([('A', 80, 110, 50, TR, 80, 110), ('B', 200, 110, 50, PA, 200, 110)], [], 20, 30, 240, 160, '') + GF.T(140, 220, 'saling eksklusif', TX, 15)
S(s, 'RUMUS', 'Rumus Penambahan Kebarangkalian',
  p(f'{P(f"{i("A")} dan {i("B")}")}, {P(f"{i("A")} dan {i("C")}")} dan {P(f"{i("B")} dan {i("C")}")} dikenal pasti dahulu supaya kita dapat menentukan sama ada peristiwa bergabung itu saling eksklusif atau tidak saling eksklusif.')
  + formula(f'{P(f"{i("A")} {U} {i("B")}")} = {P(i("A"))} + {P(i("B"))}', c)
  + p(f'bagi peristiwa saling eksklusif, kerana {P(f"{i("A")} {N_} {i("B")}")} = 0.')
  + formula(f'{P(f"{i("A")} {U} {i("B")}")} = {P(i("A"))} + {P(i("B"))} − {P(f"{i("A")} {N_} {i("B")}")}', c)
  + p(f'bagi peristiwa tidak saling eksklusif, kerana {P(f"{i("A")} {N_} {i("B")}")} ≠ 0.'),
  stack(SVh(m1 + m2, 'Peristiwa saling eksklusif dan tidak saling eksklusif', 240, 20),
        note(f'{P(f"{i("A")} dan {i("B")}")} = {P(f"{i("A")} {N_} {i("B")}")}; {P(f"{i("A")} atau {i("B")}")} = {P(f"{i("A")} {U} {i("B")}")}', 'Ingat:')))

A7, B7, C7 = {2, 4, 6, 8, 10}, {7}, {2, 3, 5, 7}
assert Fr(len(A7 | B7), 10) == Fr(5, 10) + Fr(1, 10) and Fr(len(A7 | C7), 10) == Fr(5, 10) + Fr(4, 10) - Fr(1, 10)
v7 = vennbox([('A', 150, 170, 105, TR, 70, 70), ('C', 300, 170, 95, PA, 330, 70), ('B', 330, 210, 34, PU, 365, 182)],
             [('4', 100, 120), ('6', 90, 200), ('8', 150, 240), ('10', 130, 160), ('2', 225, 170), ('3', 300, 120), ('5', 270, 230), ('7', 330, 215), ('1', 440, 300), ('9', 60, 300)])
S(s, 'CONTOH 7', 'Mengesahkan rumus penambahan kebarangkalian',
  p('Gambar rajah Venn di sebelah menunjukkan hubungan antara set semesta, ξ, A, B dan C. Satu nombor dipilih secara rawak daripada set semesta, ξ. Tentu sahkan rumus penambahan kebarangkalian bagi setiap peristiwa bergabung berikut: (a) Mendapat satu nombor genap atau nombor gandaan 7. (b) Mendapat satu nombor genap atau nombor perdana.')
  + work([('(a)', [f'{P(f"A {U} B")} = {F(f"{i("n")}(A {U} B)", f"{i("n")}({i("S")})")} = {F(6, 10)}', f'{P("A")} + {P("B")} = {F(5, 10)} + {F(1, 10)} = {F(6, 10)}', f'Maka, terbukti {P(f"A {U} B")} = {P("A")} + {P("B")}.']),
          ('(b)', [f'{P(f"A {U} C")} = {F(f"{i("n")}(A {U} C)", f"{i("n")}({i("S")})")} = {F(8, 10)}', f'{P("A")} + {P("C")} − {P(f"A {N_} C")} = {F(5, 10)} + {F(4, 10)} − {F(1, 10)} = {F(8, 10)}',
                   f'Maka, terbukti {P(f"A {U} C")} = {P("A")} + {P("C")} − {P(f"A {N_} C")}.'])], s, 2, 15),
  SVh(v7, 'Gambar rajah Venn A, B, C', 340))

K8 = list(range(5, 13))
A8, B8, C8 = {10, 11, 12}, {5, 7, 11}, {6, 8, 10, 12}
assert len(A8 | B8) == 5 and len(A8 | C8) == 5 and len(B8 | C8) == 7 and not (B8 & C8)


def st(x):
    return '{' + ', '.join(map(str, sorted(x))) + '}' if x else '{ }'


S(s, 'CONTOH 8', 'Mengesahkan rumus dengan menyenaraikan kesudahan',
  p('Lapan keping kad berlabel dengan nombor "5, 6, 7, 8, 9, 10, 11, 12" diletakkan ke dalam sebuah kotak. Sekeping kad dipilih secara rawak dari kotak itu. A ialah peristiwa mendapat satu nombor yang lebih besar daripada 9. B ialah peristiwa mendapat satu nombor perdana. C ialah peristiwa mendapat satu nombor genap.')
  + p('Tentu sahkan rumus penambahan kebarangkalian bagi setiap peristiwa bergabung berikut dengan menyenaraikan semua kesudahan yang mungkin. (a) P(A atau B) (b) P(A atau C) (c) P(B atau C)'),
  work([('(a)', [f'A = {st(A8)}, B = {st(B8)}, A {N_} B = {st(A8 & B8)}', f'A {U} B = {st(A8 | B8)}, {P(f"A {U} B")} = {F(5, 8)}', f'{P("A")} + {P("B")} − {P(f"A {N_} B")} = {F(3, 8)} + {F(3, 8)} − {F(1, 8)} = {F(5, 8)}']),
        ('(b)', [f'C = {st(C8)}, A {N_} C = {st(A8 & C8)}', f'A {U} C = {st(A8 | C8)}, {P(f"A {U} C")} = {F(5, 8)}', f'{P("A")} + {P("C")} − {P(f"A {N_} C")} = {F(3, 8)} + {F(4, 8)} − {F(2, 8)} = {F(5, 8)}']),
        ('(c)', [f'B {N_} C = {{ }}, B {U} C = {st(B8 | C8)}', f'{P(f"B {U} C")} = {F(7, 8)}', f'{P("B")} + {P("C")} = {F(3, 8)} + {F(4, 8)} = {F(7, 8)}', 'Maka, terbukti bagi (a), (b) dan (c).'])], s, 1, 15))

assert Fr(3, 5) + Fr(1, 5) == Fr(4, 5)
pa, pm = Fr(4, 7), Fr(2, 3)
both, oa, om = pa * pm, pa - pa * pm, pm - pa * pm
assert both == Fr(8, 21) and oa == Fr(4, 21) and om == Fr(6, 21) and pa + pm - both == Fr(6, 7) == oa + om + both
v10 = vennbox([('A', 180, 160, 95, TR, 120, 80), ('M', 300, 160, 95, PA, 360, 80)], []) + sf(140, 165, oa, TX, 16) + sf(240, 165, both, TX, 16) + sf(345, 165, om, TX, 16) + sf(430, 285, 1 - pa - pm + both, TX, 16)
S(s, 'CONTOH 9', 'Kebarangkalian peristiwa saling eksklusif',
  p('Lima keping kad yang berlabel dengan huruf "B, U, L, A, N" dimasukkan ke dalam sebuah kotak. Sekeping kad dipilih secara rawak. Hitung kebarangkalian kad itu berlabel huruf konsonan atau "U".')
  + note(f'Bagi dua peristiwa saling eksklusif, {P(f"{i('A')} {U} {i('B')}")} = {P(i('A'))} + {P(i('B'))}', 'Tip:'),
  work([('Penyelesaian', ['Kad yang berlabel huruf konsonan = {B, L, N}', 'Kad yang berlabel huruf "U" = {U}', 'Kedua-dua peristiwa tidak boleh berlaku bersama.', f'P(kad yang berlabel huruf konsonan atau "U") = {F(3, 5)} + {F(1, 5)} = {F(4, 5)}'])], s, 1, 19))

S(s, 'CONTOH 10', 'Kebarangkalian peristiwa tidak saling eksklusif',
  p(f'Dalam satu jamuan, kebarangkalian Aina (A) dan Mei Ling (M) makan rojak masing-masing ialah {F(4, 7)} dan {F(2, 3)}. (a) Wakilkan kebarangkalian itu dengan gambar rajah Venn. (b) Hitung kebarangkalian Aina atau Mei Ling makan rojak dalam jamuan itu.')
  + work([('(a)', [f'P(kedua-dua Aina dan Mei Ling makan rojak) = {F(4, 7)} × {F(2, 3)} = {F(8, 21)}', f'P(hanya Aina makan rojak) = {F(4, 7)} − {F(8, 21)} = {F(4, 21)}', f'P(hanya Mei Ling makan rojak) = {F(2, 3)} − {F(8, 21)} = {F(6, 21)}'])], s, 1, 16),
  stack(SVh(v10, 'Gambar rajah Venn Aina dan Mei Ling', 300, 30),
        work([('(b)', [f'{P("A")} + {P("M")} − {P(f"A {N_} M")} = {F(4, 7)} + {F(2, 3)} − {F(8, 21)} = {F(6, 7)}', f'Kaedah alternatif: {F(4, 21)} + {F(8, 21)} + {F(6, 21)} = {F(18, 21)} = {F(6, 7)}'])], s, 1, 16)))

pd = Fr(2, 11)
t11 = {'M': [('M', pd), ("M'", 1 - pd)], "M'": [('M', pd), ("M'", 1 - pd)]}
ans11 = pd * pd + pd * (1 - pd) + (1 - pd) * pd
assert ans11 == Fr(40, 121) == 1 - (1 - pd) ** 2
S(s, 'CONTOH 11', 'Gambar rajah pokok dan sekurang-kurangnya',
  p(f'Kebarangkalian sebuah telefon pintar yang dihasilkan oleh Kilang Maju mengalami masalah paparan ialah {F(2, 11)}. Dua buah telefon pintar dipilih secara rawak. Lakar satu gambar rajah pokok untuk menunjukkan semua kesudahan yang mungkin. Seterusnya, hitung kebarangkalian bahawa sekurang-kurangnya sebuah telefon pintar yang dipilih mengalami masalah paparan.')
  + p("M = Masalah paparan, M' = Tiada masalah paparan")
  + work([('Penyelesaian', ["P(sekurang-kurangnya sebuah telefon pintar mengalami masalah paparan) = P(M, M) + P(M, M') + P(M', M)",
                            f'= ({F(2, 11)} × {F(2, 11)}) + ({F(2, 11)} × {F(9, 11)}) + ({F(9, 11)} × {F(2, 11)}) = {F(40, 121)}'])], s, 1, 17),
  SVh(tree([('M', pd), ("M'", 1 - pd)], t11, 'Telefon pintar 1', 'Telefon pintar 2', hl={('M', 'M'), ('M', "M'"), ("M'", 'M')}), 'Gambar rajah pokok telefon pintar', 420, 0))

# =====================================================================
# 9.4 APLIKASI
# =====================================================================
s = '9.4'
c = COL[s]
p6 = Fr(1, 6)
ans12 = p6 * p6 + p6 * (1 - p6) + (1 - p6) * p6
assert ans12 == Fr(11, 36) and ans12 * 720 == 220 and (1 - (1 - p6) ** 2) * 720 == 220
t12 = {'E': [('E', p6), ("E'", 1 - p6)], "E'": [('E', p6), ("E'", 1 - p6)]}
S(s, 'CONTOH 12', 'Menyelesaikan masalah kebarangkalian peristiwa bergabung',
  p('Sebiji dadu adil dilambung dua kali berturut-turut. Jika uji kaji ini dijalankan sebanyak 720 kali, berapa kalikah sekurang-kurangnya satu nombor 6 akan diperoleh?')
  + p("E = mendapat nombor 6, E' = bukan nombor 6")
  + work([('Memahami masalah', ['Peristiwa bergabung tak bersandar.', f'P(nombor 6) = {F(1, 6)}', "Sekurang-kurangnya satu nombor 6 = (E, E), (E, E') atau (E', E)"]),
          ('Merancang strategi', ['Lukis gambar rajah pokok.', "Hitung P[(E, E) ∪ (E, E') ∪ (E', E)] × 720 kali"]),
          ], s, 2, 15),
  stack(SVh(tree([('E', p6), ("E'", 1 - p6)], t12, 'Lambungan pertama', 'Lambungan kedua', H=250, hl={('E', 'E'), ('E', "E'"), ("E'", 'E')}), 'Gambar rajah pokok lambungan dadu', 260, 0),
        work([('Melaksanakan strategi', [f"P[(E, E) ∪ (E, E') ∪ (E', E)] = ({F(1, 6)} × {F(1, 6)}) + ({F(1, 6)} × {F(5, 6)}) + ({F(5, 6)} × {F(1, 6)}) = {F(11, 36)}", f'{F(11, 36)} × 720 = 220 kali',
                                     f'Semak jawapan: [1 − ({F(5, 6)} × {F(5, 6)})] × 720 = 220']),
          ('Membuat kesimpulan', ['Sebanyak 220 kali untuk memperoleh sekurang-kurangnya satu nombor 6.'])], s, 1, 14)))

R, Kn, B = 'M', 'K', 'B'
t13 = {R: [(R, Fr(5, 11)), (Kn, Fr(4, 11)), (B, Fr(2, 11))], Kn: [(R, Fr(6, 11)), (Kn, Fr(3, 11)), (B, Fr(2, 11))], B: [(R, Fr(6, 12)), (Kn, Fr(4, 12)), (B, Fr(2, 12))]}
first13 = [(R, Fr(6, 12)), (Kn, Fr(4, 12)), (B, Fr(2, 12))]
pr = dict(first13)
diff = sum(pr[a] * q for a, _ in first13 for b, q in t13[a] if a != b)
same = sum(pr[a] * q for a, _ in first13 for b, q in t13[a] if a == b)
assert diff + same == 1
assert diff == Fr(6, 12) * Fr(4, 11) + Fr(6, 12) * Fr(2, 11) + Fr(4, 12) * Fr(6, 11) + Fr(4, 12) * Fr(2, 11) + Fr(2, 12) * Fr(6, 12) + Fr(2, 12) * Fr(4, 12)
DN, DD = diff.numerator, diff.denominator
hl13 = {(a, b) for a in 'MKB' for b in 'MKB' if a != b}
S(s, 'CONTOH 13', 'Peristiwa bergabung bersandar',
  p('Sebuah kotak mengandungi enam biji guli merah, empat biji guli kuning dan dua biji guli biru. Dua biji guli dipilih secara rawak dari kotak satu demi satu. Sekiranya guli pertama berwarna biru, maka guli biru itu akan dipulangkan ke dalam kotak sebelum guli kedua dipilih. Sekiranya guli pertama bukan berwarna biru, maka guli itu tidak dipulangkan ke dalam kotak dan guli kedua dipilih.')
  + p('Hitung kebarangkalian mendapat kedua-dua guli yang berlainan warna.')
  + work([('Memahami masalah', ['Peristiwa bergabung bersandar.', 'Jumlah guli = 12 biji', 'Kedua-dua guli berlainan warna = {(M, K), (M, B), (K, M), (K, B), (B, M), (B, K)}']),
          ('Merancang strategi', ['Lukis gambar rajah pokok.', 'Hitung P[(M, K) ∪ (M, B) ∪ (K, M) ∪ (K, B) ∪ (B, M) ∪ (B, K)]'])], s, 2, 15),
  SVh(tree(first13, t13, 'Guli pertama', 'Guli kedua', hl=hl13, fs=13, H=470, y0=50), 'Gambar rajah pokok guli tiga warna', 480, 0))

S(s, 'CONTOH 13 (sambungan)', 'Melaksanakan strategi dan kesimpulan',
  work([('Melaksanakan strategi', ['P(guli yang berlainan warna) = P(M, K) + P(M, B) + P(K, M) + P(K, B) + P(B, M) + P(B, K)',
                                   f'= ({F(6, 12)} × {F(4, 11)}) + ({F(6, 12)} × {F(2, 11)}) + ({F(4, 12)} × {F(6, 11)}) + ({F(4, 12)} × {F(2, 11)}) + ({F(2, 12)} × {F(6, 12)}) + ({F(2, 12)} × {F(4, 12)})', f'= {F(DN, DD)}']),
        ('Membuat kesimpulan', [f'Kebarangkalian mendapat kedua-dua guli yang berlainan warna ialah {F(DN, DD)}.'])], s, 1, 17),
  work([('Semak jawapan (kaedah pelengkap)', ['P(kedua-dua guli yang berlainan warna) = 1 − [P(M, M) + P(K, K) + P(B, B)]',
                                             f'= 1 − [({F(6, 12)} × {F(5, 11)}) + ({F(4, 12)} × {F(3, 11)}) + ({F(2, 12)} × {F(2, 12)})]', f'= {F(DN, DD)}'])], s, 1, 17))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'peristiwa', 'slides.js')
HEAD = '/* Nota Bab 9 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
