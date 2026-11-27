"""Bab 2 T5 Matriks: nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan nama ditukar).
CONTOH 1–30 ikut buku. SUBS folder matriks dikekalkan (2.1.1, 2.2.1, 2.2.3, 2.2.5; digabung 2.1 dan 2.2 melalui BAB.gabung)."""
import os, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "2.1.1", "name": "Matriks", "col": "#38BDF8"}, {"no": "2.2.1", "name": "Tambah, Tolak dan Pendaraban Skalar", "col": "#34D399"},
        {"no": "2.2.3", "name": "Pendaraban Dua Matriks dan Matriks Identiti", "col": "#FB923C"}, {"no": "2.2.5", "name": "Matriks Songsang dan Persamaan Linear Serentak", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


def fmt(v):
    if isinstance(v, str):
        return v
    v = Fr(v).limit_denominator(1000)
    if v.denominator == 1:
        return str(v.numerator).replace('-', '−')
    if v.denominator in (2, 4, 5, 10) and False:
        return str(float(v))
    return ('−' if v < 0 else '') + F(abs(v.numerator), v.denominator)


def dec(v):
    v = float(v)
    return (str(int(v)) if v == int(v) else str(v)).replace('-', '−')


def M(rows, f=fmt):
    """matriks HTML dengan kurungan siku."""
    br = 'border:2px solid currentColor;width:6px;align-self:stretch;'
    cells = ''.join(f'<span style="padding:1px 7px;text-align:center;line-height:1.35">{f(v)}</span>' for r in rows for v in r)
    grid = f'<span style="display:inline-grid;grid-template-columns:repeat({len(rows[0])},auto);align-items:center;margin:0 1px">{cells}</span>'
    return (f'<span style="display:inline-flex;align-items:stretch;vertical-align:middle;margin:3px 3px"><span style="{br}border-right:none"></span>'
            f'{grid}<span style="{br}border-left:none"></span></span>')


def mul(A, B):
    return [[sum(A[r][k] * B[k][c_] for k in range(len(B))) for c_ in range(len(B[0]))] for r in range(len(A))]


def add(A, B, s_=1):
    return [[a + s_ * b for a, b in zip(ra, rb)] for ra, rb in zip(A, B)]


def sc(k_, A):
    return [[k_ * a for a in r] for r in A]


def det(A):
    return A[0][0] * A[1][1] - A[0][1] * A[1][0]


def inv(A):
    d = Fr(det(A))
    return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]]


I2 = [[1, 0], [0, 1]]


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Membuat kesimpulan', d)], s, 2, fs)


# =====================================================================
# 2.1 MATRIKS
# =====================================================================
s = '2.1.1'
c = COL[s]
K = [[14, 20, 9], [6, 12, 5]]
S(s, 'DEFINISI', 'Mewakilkan maklumat dalam bentuk matriks',
  p('Kedai Elektrik Sinar Jaya mencatatkan jualan tiga jenis kipas angin di kedai dan dalam talian bagi bulan Mac. Data yang diwakilkan dalam bentuk jadual boleh juga diwakilkan dalam bentuk matriks.')
  + de(s, 'Matriks ialah nombor-nombor yang disusun dalam baris dan lajur untuk membentuk satu tatasusun segi empat tepat atau segi empat sama.')
  + note('Matriks lazimnya diwakili dengan huruf besar dan ditulis dalam tanda kurung [ ] atau ( ).', 'Info:'),
  stack(table(['Kipas angin', 'Berdiri', 'Siling', 'Dinding'], [['Di kedai'] + [str(v) for v in K[0]], ['Dalam talian'] + [str(v) for v in K[1]]], c, 17),
        p(f'<b>Bentuk matriks:</b> {M(K)}'), p('Nombor dalam satu baris disusun secara mendatar, manakala nombor dalam satu lajur disusun secara menegak.')))

S(s, 'CONTOH 1', 'Mewakilkan maklumat dalam bentuk matriks',
  p('Wakilkan maklumat berikut dalam bentuk matriks.')
  + p('(a) Keperluan kalori harian (kcal) bagi perempuan: kanak-kanak 1 600, remaja 2 200, dewasa 2 000, warga emas 1 700.')
  + p('(b) Pungutan pingat bagi tiga acara: Terjun (emas 12, perak 4, gangsa 3), Pencak Silat (emas 9, perak 2, gangsa 5), Olahraga (emas 6, perak 8, gangsa 7).')
  + p('(c) Dalam Ujian 1, Aiman mendapat 78 markah untuk Bahasa Melayu, 85 markah untuk Matematik dan 70 markah untuk Sejarah. Daniel pula mendapat 82, 90 dan 74 markah.'),
  table(['', 'Matriks', 'Jenis'], [['(a)', M([[1600, 2200, 2000, 1700]]) + ' atau ' + M([[1600], [2200], [2000], [1700]]), 'Matriks baris mempunyai hanya satu baris. Matriks lajur mempunyai hanya satu lajur.'],
                                   ['(b)', M([[12, 4, 3], [9, 2, 5], [6, 8, 7]]), 'Matriks segi empat sama mempunyai bilangan baris dan bilangan lajur yang sama.'],
                                   ['(c)', M([[78, 85, 70], [82, 90, 74]]), 'Matriks segi empat tepat mempunyai bilangan baris dan bilangan lajur yang berbeza.']], c, 15, False))

P2, Q2 = [[4, -6, 8]], [[2], [7]]
R2 = [[1, 5, -2, 3], [0, 6, 4, -1], [7, 2, 9, 5], [-3, 8, 0, 6]]
D3 = [[-3, 5], [0, 1], [6, 9]]
S(s, 'KONSEP', 'Peringkat matriks dan unsur matriks',
  p(f'Matriks dengan {i("m")} baris dan {i("n")} lajur mempunyai peringkat {i("m")} × {i("n")} dan dibaca sebagai "matriks {i("m")} dengan {i("n")}".')
  + p(f'Setiap nombor dalam matriks dikenali sebagai unsur matriks itu. Unsur pada baris ke-{i("i")} dan lajur ke-{i("j")} dalam matriks {i("A")} boleh diwakili oleh {i("a")}<sub>{i("ij")}</sub>.')
  + work([('CONTOH 2', [f'Diberi {i("P")} = {M(P2)}, {i("Q")} = {M(Q2)} dan {i("R")} = {M(R2)}. Tentukan (a) peringkat setiap matriks, (b) unsur {i("p")}<sub>13</sub>, {i("q")}<sub>21</sub> dan {i("r")}<sub>34</sub>.'])], s, 1, 16),
  stack(work([('Penyelesaian', ['(a) Peringkat matriks P ialah 1 × 3, Q ialah 2 × 1 dan R ialah 4 × 4.', f'(b) {i("p")}<sub>13</sub> = 8, {i("q")}<sub>21</sub> = 7, {i("r")}<sub>34</sub> = 5'])], s, 1, 16),
        work([('CONTOH 3', [f'Diberi matriks {i("D")} = {M(D3)}, tentukan (a) peringkat matriks, (b) unsur {i("d")}<sub>11</sub>, {i("d")}<sub>21</sub> dan {i("d")}<sub>32</sub>.']),
              ('Penyelesaian', ['(a) 3 × 2', f'(b) {i("d")}<sub>11</sub> = −3, {i("d")}<sub>21</sub> = 0, {i("d")}<sub>32</sub> = 9'])], s, 1, 16)))

S(s, 'CONTOH 4', 'Matriks yang sama',
  de(s, f'{i("M")} = {i("N")} jika dan hanya jika kedua-dua matriks mempunyai peringkat yang sama dan setiap unsur sepadannya sama.')
  + p('Tentukan sama ada setiap pasangan matriks berikut adalah sama. Berikan sebab anda.'),
  stack(table(['', 'Pasangan matriks'], [['(a)', f'{M([[3, 8], [-1, 5]])} dan {M([[3, 8], [-1, 5]])}'], ['(b)', f'{M([[4, 9]])} dan {M([[4], [9]])}'], ['(c)', f'{M([[2, 0], [7, -3]])} dan {M([[2, 0], [-7, -3]])}'],
                                   ['(d)', f'{M([["0.5", -2], [6, "0.4"]])} dan {M([[F(1, 2), -2], [6, F(2, 5)]])}']], c, 14),
  work([('Penyelesaian', ['(a) Sama kerana peringkat sama dan setiap unsur sepadannya sama.', '(b) Tidak sama kerana peringkat matriks pertama ialah 1 × 2 manakala matriks kedua ialah 2 × 1.',
                          '(c) Tidak sama kerana unsur sepadannya tidak sama (7 ≠ −7).', f'(d) Sama kerana 0.5 = {F(1, 2)} dan 0.4 = {F(2, 5)}.'])], s, 1, 15)))

S(s, 'CONTOH 5', 'Menentukan nilai pemboleh ubah dalam matriks yang sama',
  p(f'Diberi bahawa matriks {i("P")} = {M([[i("x"), 4], [f"8 − 3{i("z")}", 9]])} dan matriks {i("Q")} = {M([[6, 4], [i("z"), f"{i("y")} + 2"]])}. Tentukan nilai {i("x")}, nilai {i("y")} dan nilai {i("z")} jika {i("P")} = {i("Q")}.'),
  work([('Penyelesaian', [f'{i("P")} = {i("Q")}, maka semua unsur sepadan adalah sama.', f'{i("x")} = 6', f'{i("y")} + 2 = 9, maka {i("y")} = 7', f'8 − 3{i("z")} = {i("z")}', f'8 = 4{i("z")}, maka {i("z")} = 2'])], s, 1, 19))

# =====================================================================
# 2.2.1 TAMBAH, TOLAK, PENDARABAN SKALAR
# =====================================================================
s = '2.2.1'
c = COL[s]
Pm, Qm, Rm = K, [[18, 15, 8], [7, 11, 6]], [[16, 22, 10], [9, 14, 4]]
S(s, 'KONSEP', 'Menambah dan menolak matriks',
  p(f'Jualan kipas angin bulan Mac, April dan Mei masing-masing boleh diwakili oleh matriks {i("P")} = {M(Pm)}, {i("Q")} = {M(Qm)} dan {i("R")} = {M(Rm)}.')
  + de(s, 'Penambahan dan penolakan matriks hanya boleh dilaksanakan pada matriks yang sama peringkat. Unsur yang sepadan ditambah atau ditolak untuk mendapat satu matriks tunggal yang sama peringkat.'),
  work([('Jumlah jualan bulan Mac dan April', [f'{i("P")} + {i("Q")} = {M(Pm)} + {M(Qm)}', f'= {M(add(Pm, Qm))}']),
        ('Perbezaan jualan antara bulan Mei dengan April', [f'{i("R")} − {i("Q")} = {M(Rm)} − {M(Qm)}', f'= {M(add(Rm, Qm, -1))}'])], s, 1, 17))

S(s, 'CONTOH 6', 'Bolehkah matriks ditambah atau ditolak?',
  p('Penambahan dan penolakan matriks hanya boleh dilaksanakan pada matriks yang sama peringkat.'),
  work([('CONTOH 6', ['Tentukan sama ada penambahan dan penolakan boleh dilaksanakan pada pasangan matriks berikut. Berikan sebab anda.', f'(a) {M([[5, 2], [7, 1]])} dan {M([[3], [4]])}',
                      f'(b) {M([[1, -6, 10]])} dan {M([[0, 3, -4]])}']), ('Penyelesaian', ['(a) Tidak boleh kerana peringkat matriks adalah tidak sama (2 × 2 dan 2 × 1).', '(b) Boleh kerana peringkat kedua-dua matriks adalah sama, iaitu 1 × 3.'])], s, 1, 16))

C7, D7 = [[9, -7], [5, -10]], [[12, -3], [-4, 6]]
P7, Q7 = [[3], [6.5], [-12]], [[-2], [2.4], [-5]]
assert add(C7, D7) == [[21, -10], [1, -4]]
S(s, 'CONTOH 7', 'Menambah dan menolak matriks',
  p(f'<b>CONTOH 7</b> Diberi matriks {i("C")} = {M(C7)}, {i("D")} = {M(D7)}, {i("P")} = {M(P7, dec)} dan {i("Q")} = {M(Q7, dec)}. Hitung (a) {i("C")} + {i("D")} (b) {i("P")} − {i("Q")}')
  + work([('Penyelesaian', [f'(a) {M([["9 + 12", "−7 + (−3)"], ["5 + (−4)", "−10 + 6"]])} = {M(add(C7, D7))}', f'(b) {M([["3 − (−2)"], ["6.5 − 2.4"], ["−12 − (−5)"]])} = {M([[5], [4.1], [-7]], dec)}'])], s, 1, 17),
  stack(work([('CONTOH 8', [f'Diberi {M([[f"2{i("x")} − 1", -3], [5, f"{i("y")} + 1"]])} + {M([[i("x"), 2], [-4, i("y")]])} = {M([[8, -1], [1, 9]])}, hitung nilai {i("x")} dan nilai {i("y")}.']),
              ('Penyelesaian', [f'Bandingkan unsur-unsur yang sepadan:', f'3{i("x")} − 1 = 8, maka {i("x")} = 3', f'2{i("y")} + 1 = 9, maka {i("y")} = 4'])], s, 1, 16),
        work([('CONTOH 9', [f'Diberi {i("F")} + {M([[-2], [7]])} = {M([[5], [3]])}, hitung matriks {i("F")}.']), ('Penyelesaian', [f'{i("F")} = {M([[5], [3]])} − {M([[-2], [7]])} = {M([[7], [-4]])}'])], s, 1, 16)))
assert 3 * 3 - 1 == 8 and 2 * 4 + 1 == 9

aw, br_, hl = [310, 340, 90], [50, 45, 12], [28, 30, 8]
ak = [a + b - c_ for a, b, c_ in zip(aw, br_, hl)]
assert ak == [332, 355, 94]
S(s, 'CONTOH 10', 'Masalah penambahan dan penolakan matriks',
  p('Jadual di sebelah menunjukkan catatan stok buku teks Tingkatan 4 bagi mata pelajaran Sains, Matematik dan Ekonomi di SMK Taman Suria. Hitung stok akhir bagi setiap jenis buku teks tersebut.')
  + work([('Penyelesaian', ['Stok akhir = Stok awal + Buku baharu diterima − Buku hilang dan rosak', f'= {M([aw])} + {M([br_])} − {M([hl])}', f'= {M([ak])}',
                            'Maka, stok akhir buku teks Sains, Matematik dan Ekonomi masing-masing ialah 332, 355 dan 94.'])], s, 1, 17)
  ,
  table(['', 'Sains', 'Matematik', 'Ekonomi'], [['Stok awal'] + [str(v) for v in aw], ['Buku baharu diterima'] + [str(v) for v in br_], ['Buku hilang dan rosak'] + [str(v) for v in hl]], c, 16))

D11 = [[-4, 6], [2, 8]]
assert sc(3, D11) == [[-12, 18], [6, 24]] and sc(Fr(-1, 2), D11) == [[2, -3], [-1, -4]]
S(s, 'KONSEP', 'Pendaraban skalar',
  p(f'Pendaraban matriks dengan suatu nombor ialah satu proses penambahan berulang. Jika matriks {i("A")} didarabkan dengan suatu nombor {i("n")}, maka {i("nA")} = {i("A")} + {i("A")} + … + {i("A")} ({i("n")} kali).')
  + p('Untuk mendarab suatu matriks dengan suatu nombor, darabkan setiap unsur dalam matriks itu dengan nombor tersebut.')
  + formula(f'{i("n")}{M([[i("a"), i("b")], [i("c"), i("d")]])} = {M([[i("na"), i("nb")], [i("nc"), i("nd")]])}', c)
  + note(f'Apabila suatu matriks didarab dengan suatu nombor nyata, nombor nyata itu dinamakan skalar. Pendaraban ini dikenali sebagai pendaraban skalar.', 'Info:'),
  work([('CONTOH 11', [f'Diberi {i("D")} = {M(D11)}, hitung (a) 3{i("D")} (b) −{F(1, 2)}{i("D")}']),
        ('Penyelesaian', [f'(a) 3{i("D")} = {M([["3(−4)", "3(6)"], ["3(2)", "3(8)"]])} = {M(sc(3, D11))}', f'(b) −{F(1, 2)}{i("D")} = {M(sc(Fr(-1, 2), D11))}'])], s, 1, 17))

P12, Q12 = [[7, 9], [-3, 8], [6, 12]], [[2, -3], [1, 5], [0, 4]]
assert sc(3, add(P12, Q12, -1)) == add(sc(3, P12), sc(3, Q12), -1) == [[15, 36], [-12, 9], [18, 24]]
A13, B13 = [[-10, 6], [5, 15]], [[2, -2], [-3, 7]]
R13 = sc(Fr(1, 4), add(A13, B13, -1))
assert R13 == [[-3, 2], [2, 2]]
S(s, 'CONTOH 12', 'Operasi gabungan matriks',
  p(f'<b>CONTOH 12</b> Diberi {i("P")} = {M(P12)} dan {i("Q")} = {M(Q12)}, hitung 3({i("P")} − {i("Q")}).')
  + work([('Penyelesaian', [f'3({i("P")} − {i("Q")}) = 3{M(add(P12, Q12, -1))} = {M(sc(3, add(P12, Q12, -1)))}'])], s, 1, 17)
  + note(f'Tunjukkan 3{i("P")} − 3{i("Q")} = 3({i("P")} − {i("Q")}).', 'Cabar minda:'),
  work([('CONTOH 13', [f'Diberi 4{i("R")} + {M(B13)} = {M(A13)}, hitung matriks {i("R")}.']),
        ('Penyelesaian', [f'4{i("R")} = {M(A13)} − {M(B13)} = {M(add(A13, B13, -1))}', f'{i("R")} = {F(1, 4)}{M(add(A13, B13, -1))} = {M(R13)}'])], s, 1, 17))

X14, Y14 = [[40, 18], [22, 10]], [[24, 6], [12, 4]]
T14 = add(sc(5, X14), sc(2, Y14))
assert T14 == [[248, 102], [134, 58]]
S(s, 'CONTOH 14', 'Masalah pendaraban skalar',
  p('Purata bilangan kenderaan di suatu kawasan parkir untuk setiap hari bagi 5 hari bekerja diwakili dengan Jadual X. Jadual Y pula mewakili purata bilangan kenderaan pada hujung minggu. Hitung bilangan kenderaan yang parkir di kawasan tersebut dalam seminggu.')
  + table(['Jadual X', 'Kereta', 'Motosikal'], [['Berbumbung', '40', '18'], ['Tidak berbumbung', '22', '10']], c, 16)
  + table(['Jadual Y', 'Kereta', 'Motosikal'], [['Berbumbung', '24', '6'], ['Tidak berbumbung', '12', '4']], c, 16),
  work([('Penyelesaian', ['5 hari bekerja + 2 hari pada hujung minggu', f'5{i("X")} + 2{i("Y")} = 5{M(X14)} + 2{M(Y14)}', f'= {M(sc(5, X14))} + {M(sc(2, Y14))}', f'= {M(T14)}'])], s, 1, 18))

# =====================================================================
# 2.2.3 PENDARABAN DUA MATRIKS DAN MATRIKS IDENTITI
# =====================================================================
s = '2.2.3'
c = COL[s]
Kc = [[25], [30], [20]]
assert mul(K, Kc) == [[1130], [610]]
S(s, 'KONSEP', 'Pendaraban dua matriks',
  p(f'Jika komisen jualan setiap unit kipas berdiri, siling dan dinding ialah RM25, RM30 dan RM20, jumlah komisen boleh dikira dalam bentuk matriks:')
  + p(f'{M(K)}{M(Kc)} = {M([["14(25) + 20(30) + 9(20)"], ["6(25) + 12(30) + 5(20)"]])} = {M(mul(K, Kc))}')
  + de(s, f'Untuk mendarab dua matriks, {i("A")} dan {i("B")}, bilangan lajur matriks {i("A")} mesti sama dengan bilangan baris matriks {i("B")}. Bilangan baris matriks {i("A")} dan bilangan lajur matriks {i("B")} menjadi peringkat bagi hasil darab {i("AB")}.'),
  stack(formula(f'{i("A")}<sub>{i("m")} × {i("n")}</sub> × {i("B")}<sub>{i("n")} × {i("p")}</sub> = {i("AB")}<sub>{i("m")} × {i("p")}</sub>', c),
        p(f'Jika matriks {i("A")} mempunyai peringkat {i("m")} × {i("n")} dan matriks {i("B")} mempunyai peringkat {i("n")} × {i("p")}, maka pendaraban {i("AB")} boleh dilakukan dan peringkat {i("AB")} ialah {i("m")} × {i("p")}.'),
        note('Sentiasa semak peringkat matriks yang terhasil sebelum pendaraban.', 'Tip:')))

C15, D15 = [[2], [3]], [[-2, 5], [4, 1]]
A16, B16 = [[2, 3], [1, 5]], [[6, -7], [-2, 1]]
assert mul(A16, B16) == [[6, -11], [-4, -2]]
S(s, 'CONTOH 15', 'Menentukan sama ada pendaraban boleh dilakukan',
  p(f'<b>CONTOH 15</b> Diberi matriks {i("C")} = {M(C15)} dan matriks {i("D")} = {M(D15)}. Tentukan sama ada pendaraban {i("CD")} dan {i("DC")} boleh dilakukan atau tidak. Jika boleh, nyatakan peringkat hasil darab matriks itu.')
  + work([('Penyelesaian', [f'Peringkat matriks {i("C")} = 2 × 1, peringkat matriks {i("D")} = 2 × 2.', f'{i("CD")}: 2 × 1 dan 2 × 2. Pendaraban {i("CD")} tidak boleh dilakukan kerana bilangan lajur matriks {i("C")} tidak sama dengan bilangan baris matriks {i("D")}.',
                            f'{i("DC")}: 2 × 2 dan 2 × 1. Pendaraban {i("DC")} boleh dilakukan dan peringkat {i("DC")} ialah 2 × 1.'])], s, 1, 17),
  work([('CONTOH 16', [f'Hitung {M(A16)}{M(B16)}.']),
        ('Penyelesaian', [f'= {M([["(2)(6) + (3)(−2)", "(2)(−7) + (3)(1)"], ["(1)(6) + (5)(−2)", "(1)(−7) + (5)(1)"]])}', f'= {M(mul(A16, B16))}']),
        ('Cara', ['Unsur baris 1 lajur 1 = baris 1 matriks pertama × lajur 1 matriks kedua, dan seterusnya.'])], s, 1, 16))

E17, F17, G17 = [[-4, 8], [-1, 7]], [[-2], [7]], [[4, 3]]
assert mul(G17, E17) == [[-19, 53]] and mul(F17, G17) == [[-8, -6], [28, 21]] and mul(G17, F17) == [[13]]
L18, K18 = [[-4, 2], [0, 1]], [[-1, -2]]
L2 = mul(L18, L18)
assert L2 == [[16, -6], [0, 1]] and mul(K18, L2) == [[-16, 4]] and mul(L2, L18) == [[-64, 26], [0, 1]]
S(s, 'CONTOH 17', 'Mendarab dua matriks',
  p(f'<b>CONTOH 17</b> Diberi matriks {i("E")} = {M(E17)}, {i("F")} = {M(F17)} dan {i("G")} = {M(G17)}. Hitung (a) {i("GE")} (b) {i("FG")} (c) {i("GF")}')
  + work([('Penyelesaian', [f'(a) {i("GE")} = {M(G17)}{M(E17)} = {M([["(4)(−4) + (3)(−1)", "(4)(8) + (3)(7)"]])} = {M(mul(G17, E17))}', f'(b) {i("FG")} = {M(F17)}{M(G17)} = {M(mul(F17, G17))}',
                            f'(c) {i("GF")} = {M(G17)}{M(F17)} = {M(mul(G17, F17))}', 'Hasil darab matriks (c) ialah matriks berperingkat 1 × 1.'])], s, 1, 16),
  work([('CONTOH 18', [f'Diberi matriks {i("K")} = {M(K18)} dan {i("L")} = {M(L18)}. Hitung (a) {i("L")}² (b) {i("KL")}² (c) {i("L")}³']),
        ('Penyelesaian', [f'(a) {i("L")}² = {i("LL")} = {M(L18)}{M(L18)} = {M(L2)}', f'(b) {i("KL")}² = {M(K18)}{M(L2)} = {M(mul(K18, L2))}', f'(c) {i("L")}³ = {i("L")}²{i("L")} = {M(L2)}{M(L18)} = {M(mul(L2, L18))}']),
        ('Ingat', [f'{i("L")}² = {i("LL")} dan {i("L")}³ = {i("L")}²{i("L")} = {i("LL")}². {i("L")}² ≠ kuasa dua setiap unsur.'])], s, 1, 15))

assert 12 * 1 - 5 == 7 and 18 * 1 - 20 == -2
sh = [[4000, 3000], [2500, 6000]]
pr = [[Fr(3, 2)], [Fr(4, 5)]]
tot = mul(sh, pr)
assert tot == [[8400], [8550]]
S(s, 'CONTOH 19', 'Pendaraban matriks dengan pemboleh ubah',
  p(f'<b>CONTOH 19</b> Diberi [6{i("x")} −5]{M([[2, 3], [1, 4]])} = [7 &nbsp;1 − {i("y")}], hitung nilai {i("x")} dan nilai {i("y")}.')
  + work([('Penyelesaian', [f'[(6{i("x")})(2) + (−5)(1) &nbsp; (6{i("x")})(3) + (−5)(4)] = [7 &nbsp;1 − {i("y")}]', f'[12{i("x")} − 5 &nbsp; 18{i("x")} − 20] = [7 &nbsp;1 − {i("y")}]', f'12{i("x")} − 5 = 7, maka {i("x")} = 1',
                            f'18(1) − 20 = 1 − {i("y")}, maka {i("y")} = 3'])], s, 1, 17),
  stack(p('<b>CONTOH 20</b> Jadual menunjukkan unit saham yang dibeli oleh Khairil dan Mahmud. Diberi harga seunit saham A dan seunit saham B ialah RM1.50 dan RM0.80. Hitung jumlah pelaburan Khairil dan jumlah pelaburan Mahmud.'),
        table(['', 'Saham A (unit)', 'Saham B (unit)'], [['Khairil', '4 000', '3 000'], ['Mahmud', '2 500', '6 000']], c, 16),
        work([('Penyelesaian', [f'{M(sh)}{M([[1.5], [0.8]], dec)} = {M([["6 000 + 2 400"], ["3 750 + 4 800"]])} = {M([["8 400"], ["8 550"]])}', 'Jumlah pelaburan Khairil dan Mahmud masing-masing ialah RM8 400 dan RM8 550.'])], s, 1, 16)))

S(s, 'DEFINISI', 'Matriks identiti',
  p(f'Apabila 1 didarabkan dengan sebarang nombor, {i("a")}, hasilnya ialah {i("a")}. Apabila suatu matriks didarabkan dengan matriks {i("A")}, hasilnya ialah matriks {i("A")}. Matriks tersebut merupakan matriks identiti, {i("I")}.')
  + bul(s, [f'{i("AI")} = {i("IA")} = {i("A")}', 'Matriks identiti ialah matriks segi empat sama.', 'Unsur-unsurnya terdiri daripada 0 dan 1 sahaja, dengan unsur 1 terletak di sepanjang pepenjuru dari sudut kiri atas ke sudut kanan bawah dan unsur yang lain adalah sifar.'])
  + note('Matriks identiti ialah matriks pepenjuru.', 'Info:'),
  work([('CONTOH 21', ['Tuliskan matriks identiti berdasarkan peringkat berikut. (a) 1 × 1 (b) 2 × 2 (c) 3 × 3 (d) 4 × 4']),
        ('Penyelesaian', [f'(a) [1] &nbsp; (b) {M(I2)} &nbsp; (c) {M([[1, 0, 0], [0, 1, 0], [0, 0, 1]])}', f'(d) {M([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]])}'])], s, 1, 17))

# =====================================================================
# 2.2.5 MATRIKS SONGSANG DAN PERSAMAAN LINEAR SERENTAK
# =====================================================================
s = '2.2.5'
c = COL[s]
A22 = [[3, 1], [5, 2]]
Xa, Xb = [[2, 1], [-5, 3]], [[2, -1], [-5, 3]]
assert mul(A22, Xa) != I2 and mul(A22, Xb) == I2 == mul(Xb, A22)
S(s, 'DEFINISI', 'Matriks songsang',
  p(f'Jika pendaraban matriks {i("A")} dan matriks {i("B")} menghasilkan matriks identiti, {i("I")}, maka matriks {i("B")} adalah songsangan matriks {i("A")} dan sebaliknya.')
  + formula(f'{i("AA")}<sup>−1</sup> = {i("A")}<sup>−1</sup>{i("A")} = {i("I")}', c)
  + note(f'{i("A")}<sup>−1</sup> dibaca sebagai matriks songsang {i("A")}. {i("A")}<sup>−1</sup> ≠ {F(1, i("A"))}', 'Info:'),
  work([('CONTOH 22', [f'Tentukan sama ada matriks berikut ialah matriks songsang bagi {M(A22)}. Jelaskan jawapan anda. (a) {M(Xa)} (b) {M(Xb)}']),
        ('Penyelesaian', [f'(a) {M(A22)}{M(Xa)} = {M(mul(A22, Xa))}. Hasil darab bukan matriks identiti, maka bukan matriks songsang.',
                          f'(b) {M(A22)}{M(Xb)} = {M(I2)} dan {M(Xb)}{M(A22)} = {M(I2)}. Maka, {M(Xb)} ialah matriks songsang bagi {M(A22)}.'])], s, 1, 16))

A23, B23 = [[2, 3], [4, 6]], [[4, 7], [1, 2]]
C24 = [[3, -4], [1, -2]]
assert det(A23) == 0 and det(B23) == 1 and inv(B23) == [[2, -7], [-1, 4]] and det(C24) == -2 and inv(C24) == [[1, -2], [Fr(1, 2), Fr(-3, 2)]]
S(s, 'RUMUS', 'Matriks songsang bagi matriks 2 × 2',
  formula(f'{i("A")} = {M([[i("a"), i("b")], [i("c"), i("d")]])}, &nbsp; {i("A")}<sup>−1</sup> = {F(1, f"{i("ad")} − {i("bc")}")}{M([[i("d"), f"−{i("b")}"], [f"−{i("c")}", i("a")]])}', c)
  + p(f'dengan keadaan {i("ad")} − {i("bc")} ≠ 0. Kedudukan {i("a")} dan {i("d")} saling bertukar manakala {i("b")} dan {i("c")} didarabkan dengan −1.')
  + p(f'Penentu matriks {i("A")}, |{i("A")}| ialah {i("ad")} − {i("bc")}. Matriks songsang tidak wujud apabila {i("ad")} − {i("bc")} = 0.')
  ,
  work([('CONTOH 23', [f'Tentukan sama ada matriks songsang wujud. Jika wujud, hitung matriks songsang. (a) {i("A")} = {M(A23)} (b) {i("B")} = {M(B23)}']),
          ('Penyelesaian', ['(a) ' + i('ad') + ' − ' + i('bc') + ' = 2(6) − 3(4) = 0. Maka, ' + i('A') + '<sup>−1</sup> tidak wujud.', f'(b) {i("ad")} − {i("bc")} = 4(2) − 7(1) = 1 ≠ 0. Maka, {i("B")}<sup>−1</sup> wujud.',
                            f'{i("B")}<sup>−1</sup> = {F(1, 1)}{M([[2, -7], [-1, 4]])} = {M(inv(B23))}'])], s, 1, 17))

S(s, 'CONTOH 24', 'Menghitung matriks songsang',
  p(f'Diberi matriks {i("C")} = {M(C24)}, hitung matriks songsang bagi {i("C")}.') + note('Saling tukar kedudukan unsur dalam pepenjuru utama dan darabkan unsur pepenjuru yang satu lagi dengan −1.', 'Tip:'),
  work([('Penyelesaian', [f'{i("C")}<sup>−1</sup> = {F(1, "3(−2) − (−4)(1)")}{M([[-2, 4], [-1, 3]])}', f'= −{F(1, 2)}{M([[-2, 4], [-1, 3]])}', f'= {M(inv(C24))}']),
        ('Semak jawapan', [f'{i("CC")}<sup>−1</sup> = {i("I")}'])], s, 1, 16))

D25 = [[4, 2], [5, 3]]
assert inv(D25) == [[Fr(3, 2), -1], [Fr(-5, 2), 2]]
A26 = [[2, 3], [1, 4]]
assert inv(A26) == [[Fr(4, 5), Fr(-3, 5)], [Fr(-1, 5), Fr(2, 5)]]
S(s, 'CONTOH 25', 'Menentukan unsur tidak diketahui',
  p(f'<b>CONTOH 25</b> Diberi matriks {i("D")} = {M([[4, 2], [i("m"), 3]])} dan {i("D")}<sup>−1</sup> = {M([[1.5, -1], [-2.5, 2]], dec)}. Hitung nilai {i("m")}.')
  + work([('Penyelesaian', [f'{i("D")}<sup>−1</sup> = {F(1, f"4(3) − 2{i("m")}")}{M([[3, -2], [f"−{i("m")}", 4]])}', 'Unsur sepadan pada baris 1 lajur 1:', f'{F(3, f"12 − 2{i("m")}")} = 1.5', f'12 − 2{i("m")} = 2, maka {i("m")} = 5'])], s, 1, 17),
  work([('CONTOH 26', [f'Diberi {M(A26)}{i("A")} = {M(I2)} dan matriks {i("A")} berperingkat 2 × 2. Hitung matriks {i("A")}.']),
        ('Penyelesaian', [f'Hasil darab ialah matriks identiti, maka {i("A")} ialah matriks songsang bagi {M(A26)}.', f'{i("A")} = {F(1, "(2)(4) − (3)(1)")}{M([[4, -3], [-1, 2]])} = {F(1, 5)}{M([[4, -3], [-1, 2]])}', f'= {M(inv(A26))}'])], s, 1, 17))

A28 = [[1, -3], [2, -5]]
sol = mul(inv(A28), [[1], [4]])
assert det(A28) == 1 and sol == [[7], [2]]
S(s, 'KONSEP', 'Kaedah matriks untuk menyelesaikan persamaan linear serentak',
  steps(s, [f'Tulis persamaan linear serentak {i("ax")} + {i("by")} = {i("p")} dan {i("cx")} + {i("dy")} = {i("q")} dalam bentuk matriks {i("AX")} = {i("B")}: {M([[i("a"), i("b")], [i("c"), i("d")]])}{M([[i("x")], [i("y")]])} = {M([[i("p")], [i("q")]])}',
            f'Darabkan kedua-dua belah dengan {i("A")}<sup>−1</sup>: {i("X")} = {i("A")}<sup>−1</sup>{i("B")}', f'{M([[i("x")], [i("y")]])} = {F(1, f"{i("ad")} − {i("bc")}")}{M([[i("d"), f"−{i("b")}"], [f"−{i("c")}", i("a")]])}{M([[i("p")], [i("q")]])}'])
  ,
  work([('CONTOH 27', [f'Tuliskan persamaan linear serentak 2{i("x")} + 5{i("y")} = 7 dan 3{i("x")} − {i("y")} = 2 dalam bentuk matriks.', f'Penyelesaian: {M([[2, 5], [3, -1]])}{M([[i("x")], [i("y")]])} = {M([[7], [2]])}']), ('CONTOH 28', [f'Selesaikan persamaan linear serentak di bawah dengan menggunakan kaedah matriks.', f'{i("x")} − 3{i("y")} = 1', f'2{i("x")} − 5{i("y")} = 4']),
        ('Penyelesaian', [f'{M(A28)}{M([[i("x")], [i("y")]])} = {M([[1], [4]])}', f'{M([[i("x")], [i("y")]])} = {F(1, "(1)(−5) − (−3)(2)")}{M([[-5, 3], [-2, 1]])}{M([[1], [4]])}', f'= {M([["−5 + 12"], ["−2 + 4"]])} = {M(sol)}', f'Maka, {i("x")} = 7 dan {i("y")} = 2.'])], s, 1, 16))

A29 = [[3, 1], [4, 3]]
s29 = mul(inv(A29), [[40], [80]])
assert s29 == [[8], [16]]
S(s, 'CONTOH 29', 'Menyelesaikan masalah yang melibatkan matriks',
  p('Puan Mei membeli 3 keping tiket kanak-kanak dan sekeping tiket dewasa dengan bayaran RM40. Encik Rizal membeli 4 keping tiket kanak-kanak dan 3 keping tiket dewasa dengan bayaran RM80. Berapakah harga sekeping tiket kanak-kanak dan sekeping tiket dewasa?'),
  ps4([f'{i("x")} = harga sekeping tiket kanak-kanak', f'{i("y")} = harga sekeping tiket dewasa', 'Harga 3 tiket kanak-kanak dan 1 tiket dewasa ialah RM40; 4 tiket kanak-kanak dan 3 tiket dewasa ialah RM80.'],
      ['(a) Bentukkan dua persamaan linear.', '(b) Ungkapkan persamaan dalam bentuk matriks dan selesaikannya.'],
      [f'3{i("x")} + {i("y")} = 40, 4{i("x")} + 3{i("y")} = 80', f'{M(A29)}{M([[i("x")], [i("y")]])} = {M([[40], [80]])}', f'{M([[i("x")], [i("y")]])} = {F(1, "(3)(3) − (1)(4)")}{M([[3, -1], [-4, 3]])}{M([[40], [80]])} = {F(1, 5)}{M([[40], [80]])} = {M(s29)}'],
      ['Harga sekeping tiket kanak-kanak ialah RM8 dan sekeping tiket dewasa ialah RM16.'], s, 15))

A30 = [[12, 8], [6, 9]]
s30 = mul(inv(A30), [[600], [480]])
assert det(A30) == 60 and s30 == [[26], [36]]
S(s, 'CONTOH 30', 'Masalah matriks dalam pengeluaran',
  p('Syarikat Komunikasi Era Baru menghasilkan dua model kamera, K dan L. Setiap kamera perlu melalui Bahagian Pemasangan dan Bahagian Pembungkusan. Bahagian Pemasangan beroperasi selama 10 jam sehari dan Bahagian Pembungkusan selama 8 jam sehari. Hitung bilangan kamera K dan kamera L yang boleh dihasilkan dalam sehari.')
  + table(['', 'Kamera K', 'Kamera L'], [['Pemasangan', '12 minit', '8 minit'], ['Pembungkusan', '6 minit', '9 minit']], c, 16),
  ps4(['Jumlah masa pemasangan 10 jam = 600 minit; pembungkusan 8 jam = 480 minit.', f'{i("x")} = bilangan kamera K, {i("y")} = bilangan kamera L'],
      ['(a) Bentukkan dua persamaan linear.', '(b) Ungkapkan dalam bentuk matriks dan selesaikannya.'],
      [f'12{i("x")} + 8{i("y")} = 600, 6{i("x")} + 9{i("y")} = 480', f'{M([[i("x")], [i("y")]])} = {F(1, "(12)(9) − (8)(6)")}{M([[9, -8], [-6, 12]])}{M([[600], [480]])}', f'= {F(1, 60)}{M([["1 560"], ["2 160"]])} = {M(s30)}'],
      ['Bilangan kamera K yang dihasilkan ialah 26 unit dan kamera L ialah 36 unit.'], s, 15))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'matriks', 'slides.js')
HEAD = '/* Nota Bab 2 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
