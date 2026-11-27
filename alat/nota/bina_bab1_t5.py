"""Bab 1 T5 Ubahan: nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan nama ditukar).
CONTOH 1–24 ikut buku. Subtopik folder ubahan dikekalkan (1.1, 1.2, 1.3). Penyelesaian masalah guna 4 kotak."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "1.1", "name": "Ubahan Langsung", "col": "#38BDF8"}, {"no": "1.2", "name": "Ubahan Songsang", "col": "#F472B6"}, {"no": "1.3", "name": "Ubahan Bergabung", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


x, y, z, k = i('x'), i('y'), i('z'), i('k')
PR = '∝'


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def near(a, b):
    return abs(a - b) < 1e-9


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Membuat kesimpulan', d)], s, 2, fs)


# =====================================================================
# 1.1 UBAHAN LANGSUNG
# =====================================================================
s = '1.1'
c = COL[s]
g = GF.Gr((70, 30, 450, 300), (0, 5), (0, 5), 1, 1, xl=x, yl=y, labels=False)
g.seg((0, 0), (4.6, 4.6), TR, 4).text(3.3, 4.4, 'y = kx', AM, 16)
S(s, 'DEFINISI', 'Maksud ubahan langsung',
  p('Seorang tukang masak perlu menentukan bahan yang digunakan mengikut bilangan hidangan. Jika bahan yang digunakan bertambah, maka bilangan hidangan turut bertambah. Sebaliknya, jika bahan yang digunakan berkurang, maka bilangan hidangan turut berkurang.')
  + de(s, f'Ubahan langsung menerangkan perkaitan antara dua pemboleh ubah, dengan keadaan apabila satu pemboleh ubah {y} bertambah maka pemboleh ubah {x} juga bertambah pada kadar yang sama dan sebaliknya. Hubungan ini juga ditulis sebagai {y} berubah secara langsung dengan {x}.'),
  SVh(g.svg(), 'Graf y melawan x bagi ubahan langsung', 320, 10))

S(s, 'CONTOH 1', 'Perubahan dalam ubahan langsung',
  p('Dalam kehidupan seharian, kita sering berdepan dengan situasi yang melibatkan hubungan perubahan kuantiti. Contohnya, jarak perjalanan dengan tambang teksi.'),
  stack(work([('CONTOH 1', ['Jumlah gaji seorang jurujual sambilan berubah secara langsung dengan bilangan jam dia bekerja. Nyatakan perubahan pada (a) jumlah gaji jika bilangan jam bertambah tiga kali ganda, (b) jumlah gaji jika bilangan jam berkurang sebanyak 25%, (c) bilangan jam bekerja jika jumlah gaji adalah separuh daripada gaji asal.']),
              ('Penyelesaian', ['(a) Jumlah gaji bertambah tiga kali ganda.', '(b) Jumlah gaji berkurang sebanyak 25%.', '(c) Bilangan jam bekerja adalah separuh daripada bilangan jam asal.'])], s, 1, 15)))

S(s, 'KONSEP', 'Hubungan antara dua pemboleh ubah bagi ubahan langsung',
  p(f'Dalam ubahan langsung, kuantiti {y} dikatakan berubah secara langsung dengan {x} jika dan hanya jika {F(y, x)} ialah satu pemalar, dikenali sebagai pemalar perkadaran, {k}.')
  + bul(s, [f'Graf {y} melawan {x} ialah satu garis lurus yang melalui asalan.', f'{k} = {F(f"{y}₁", f"{x}₁")} = {F(f"{y}₂", f"{x}₂")} = {F(f"{y}₃", f"{x}₃")} = kecerunan garis lurus'])
  + formula(f'{y} {PR} {x}<sup>{i("n")}</sup> (hubungan ubahan) &nbsp;&nbsp; {y} = {k}{x}<sup>{i("n")}</sup> (bentuk persamaan)', c)
  + p(f'dengan keadaan {i("n")} = 1, 2, 3, {F(1, 2)}, {F(1, 3)} dan {k} ialah pemalar. Graf {y} melawan {x}<sup>{i("n")}</sup> ialah satu garis lurus yang melalui asalan dengan {k} ialah kecerunan garis lurus.'),
  stack(table(['Ayat', 'Hubungan'], [[f'{y} berubah secara langsung dengan {x}', f'{y} {PR} {x}'], [f'{y} berubah secara langsung dengan kuasa dua {x}', f'{y} {PR} {x}²'], [f'{y} berubah secara langsung dengan kuasa tiga {x}', f'{y} {PR} {x}³'],
                                    [f'{y} berubah secara langsung dengan punca kuasa dua {x}', f'{y} {PR} {sq(x)}'], [f'{y} berubah secara langsung dengan punca kuasa tiga {x}', f'{y} {PR} {sq(x, 3)}']], c, 15, False),
        note('Simbol ∝ merujuk kepada "adalah berkadaran dengan". Pemalar ialah nilai sesuatu kuantiti yang tetap atau tidak berubah.', 'Info:')))

T2 = [2, 4, 6, 8, 10, 12]
Y2 = [9 * t for t in T2]
assert all(near(a / b, 9) for a, b in zip(Y2, T2))
S(s, 'CONTOH 2', 'Menentukan ubahan langsung daripada jadual',
  p(f'Sebuah kereta mainan bergerak daripada keadaan pegun. Jarak yang dilalui oleh kereta mainan itu, {y}, berubah dengan masa, {i("t")}, seperti yang ditunjukkan dalam jadual di bawah. Tentukan sama ada {y} berubah secara langsung dengan {i("t")} atau {i("t")}². Seterusnya, tuliskan hubungan tersebut dalam bentuk ubahan.')
  + table([f'Masa, {i("t")} (s)'] + [str(t) for t in T2], [[f'Jarak, {y} (cm)'] + [str(v) for v in Y2]], c, 17),
  stack(table([f'{i("t")}'] + [str(t) for t in T2], [[F(y, i('t'))] + [str(v // t) for v, t in zip(Y2, T2)], [F(y, f'{i("t")}²')] + [f'{v / t ** 2:.2f}' for v, t in zip(Y2, T2)]], c, 16, rvrows=(0, 1)),
        work([('Penyelesaian', [f'{y} berubah secara langsung dengan {i("t")} kerana nilai {F(y, i("t"))} ialah pemalar. Maka, {y} {PR} {i("t")}.', f'{y} tidak berubah secara langsung dengan {i("t")}² kerana nilai {F(y, f"{i("t")}²")} bukan pemalar.'])], s, 1, 16)))

X3 = [1.0, 1.5, 2.0, 2.5]
Y3 = [6 * v * v for v in X3]
ga = GF.Gr((55, 30, 230, 240), (0, 3), (0, 40), 1, 10, xl=x, yl=y, fs=11)
for a, b in zip(X3, Y3):
    ga.pt(a, b, '', TR, r=5)
ga.curve(lambda t: 6 * t * t, 0.9, 2.55, TR, 3)
gb = GF.Gr((305, 30, 480, 240), (0, 7), (0, 40), 2, 10, xl=f'{x}²', yl=y, fs=11)
for a, b in zip(X3, Y3):
    gb.pt(a * a, b, '', GR, r=5)
gb.seg((0, 0), (6.6, 39.6), GR, 3)
S(s, 'CONTOH 3', 'Menentukan ubahan langsung dengan melukis graf',
  p(f'(a) Dengan melukis graf {y} melawan {x}, tentukan sama ada {y} berubah secara langsung dengan {x} atau tidak. (b) Dengan melukis graf {y} melawan {x}², tentukan sama ada {y} berubah secara langsung dengan {x}² atau tidak.')
  + table([x] + [str(v) for v in X3], [[f'{x}²'] + [str(v * v) for v in X3], [y] + [str(v).rstrip('0').rstrip('.') for v in Y3]], c, 17)
  + work([('Penyelesaian', [f'(a) Graf {y} melawan {x} bukan garis lurus yang melalui asalan. Maka, {y} tidak berubah secara langsung dengan {x}.', f'(b) Graf {y} melawan {x}² ialah garis lurus yang melalui asalan. Maka, {y} berubah secara langsung dengan {x}².'])], s, 1, 17),
  SVh(ga.svg() + gb.svg() + GF.T(140, 285, '(a)', TX, 16) + GF.T(392, 285, '(b)', TX, 16), 'Graf y melawan x dan y melawan x kuasa dua', 300, 0))

assert near(1.2 / 0.064, 18.75) and near(1.2 / 0.4, 3) and near(4 / 250, 0.016)
S(s, 'CONTOH 4', 'Mengungkapkan hubungan dalam bentuk persamaan',
  p(f'<b>CONTOH 4</b> Diberi {i("m")} = 1.2 apabila {i("n")} = 0.064. Ungkapkan {i("m")} dalam sebutan {i("n")} jika (a) {i("m")} berubah secara langsung dengan {i("n")}, (b) {i("m")} berubah secara langsung dengan punca kuasa tiga {i("n")}.')
  + work([('(a)', [f'{i("m")} {PR} {i("n")}', f'{i("m")} = {k}{i("n")}', f'1.2 = {k}(0.064)', f'{k} = {F("1.2", "0.064")} = 18.75', f'Maka, {i("m")} = 18.75{i("n")}']),
          ('(b)', [f'{i("m")} {PR} {sq(i("n"), 3)}', f'{i("m")} = {k}{sq(i("n"), 3)}', f'1.2 = {k}({sq("0.064", 3)})', f'{k} = {F("1.2", "0.4")} = 3', f'Maka, {i("m")} = 3{sq(i("n"), 3)}'])], s, 2, 17)
  + note(f'Tuliskan hubungan dalam bentuk persamaan, kemudian gantikan nilai yang diberi untuk mendapatkan nilai {k}.', 'Tip:'),
  work([('CONTOH 5', [f'Pemanjangan spring, {x} cm, berubah secara langsung dengan jisim pemberat, {i("w")} g, yang ditanggungnya. Diberi bahawa pemanjangan spring ialah 4 cm apabila diletakkan pemberat sebanyak 250 g. Ungkapkan {x} dalam sebutan {i("w")}.']),
        ('Penyelesaian', [f'{x} {PR} {i("w")}', f'{x} = {k}{i("w")}', f'4 = {k}(250)', f'{k} = {F(4, 250)} = 0.016', f'Maka, {x} = 0.016{i("w")}'])], s, 1, 17))

assert near(0.36 / 0.4, 0.9) and near(0.9 * 6, 5.4) and near(1.125 / 0.9, 1.25)
k7 = 6.93 / 4.2 ** 2
assert near(k7, 11 / 28) and near(math.sqrt(27.72 * 28 / 11), 8.4)
S(s, 'CONTOH 6', 'Menghitung nilai pemboleh ubah',
  p(f'<b>CONTOH 6</b> Diberi {y} berubah secara langsung dengan {x}. Jika {y} = 0.36 apabila {x} = 0.4, hitung nilai (a) {y} apabila {x} = 6, (b) {x} apabila {y} = 1.125.')
  + work([('Penyelesaian', [f'{y} = {k}{x}; 0.36 = {k}(0.4); {k} = 0.9. Maka, {y} = 0.9{x}', f'(a) Apabila {x} = 6, {y} = 0.9(6) = 5.4', f'(b) Apabila {y} = 1.125, 1.125 = 0.9{x}, {x} = {F("1.125", "0.9")} = 1.25'])], s, 1, 17),
  work([('CONTOH 7', [f'Luas, {i("L")} cm², satu semi bulatan berubah secara langsung dengan kuasa dua diameternya, {i("d")} cm. Diberi luas semi bulatan itu ialah 6.93 cm² apabila diameternya ialah 4.2 cm. Hitung nilai {i("d")} apabila {i("L")} = 27.72.']),
        ('Penyelesaian', [f'{i("L")} = {k}{i("d")}²; 6.93 = {k}(4.2)²; {k} = {F("6.93", "(4.2)²")} = {F(11, 28)}', f'Maka, {i("L")} = {F(11, 28)}{i("d")}²', f'Apabila {i("L")} = 27.72, {i("d")}² = {F("27.72 × 28", 11)} = 70.56', f'{i("d")} = {sq("70.56")} = 8.4 cm']),
        ('Langkah alternatif (konsep perkadaran)', [f'{F(f"{i("L")}₁", f"{i("L")}₂")} = {F(f"({i("d")}₁)²", f"({i("d")}₂)²")}; {F("6.93", "27.72")} = {F("4.2²", f"({i("d")}₂)²")}; {i("d")}₂ = 8.4 cm'])], s, 1, 15))

assert near(1.6 / math.sqrt(16), 0.4) and near(0.4 * math.sqrt(36), 2.4)
S(s, 'CONTOH 8', 'Ubahan langsung dengan punca kuasa dua',
  p(f'Tempoh ayunan, {i("A")} saat, bagi satu bandul ringkas berubah secara langsung dengan punca kuasa dua panjang benang, {i("p")} cm. Diberi bahawa satu bandul ringkas dengan panjang benang 16 cm mempunyai tempoh ayunan sebanyak 1.6 saat. Hitung tempoh ayunan dalam saat, jika panjang benang ialah 36 cm.')
  + note('Robert Hooke memperkenalkan Hukum Hooke yang menyatakan bahawa pemanjangan suatu bahan kenyal adalah berkadar langsung dengan daya regangan yang bertindak, selagi tidak melepasi had kenyal.', 'Info:'),
  work([('Penyelesaian', [f'{i("A")} {PR} {sq(i("p"))}', f'{i("A")} = {k}{sq(i("p"))}', f'1.6 = {k}{sq(16)}', f'{k} = {F("1.6", 4)} = 0.4', f'Maka, {i("A")} = 0.4{sq(i("p"))}', f'Apabila {i("p")} = 36, {i("A")} = 0.4{sq(36)} = 2.4 saat']),
        ('Langkah alternatif', [f'{F(f"{i("A")}₁", f"{i("A")}₂")} = {F(sq(f"{i("p")}₁"), sq(f"{i("p")}₂"))}', f'{F("1.6", f"{i("A")}₂")} = {F(sq(16), sq(36))}', f'{i("A")}₂ = {F(f"1.6 × {sq(36)}", sq(16))} = 2.4 saat'])], s, 1, 18))

S(s, 'DEFINISI', 'Ubahan tercantum',
  p(f'Semasa di Tingkatan 3, anda telah mempelajari pengiraan faedah mudah, {i("I")} = {i("Prt")}. Situasi ini merujuk kepada satu daripada contoh hubungan bagi ubahan tercantum.')
  + de(s, 'Ubahan tercantum ialah ubahan langsung dengan keadaan satu pemboleh ubah berubah sebagai hasil darab dua atau lebih pemboleh ubah yang lain.')
  + formula(f'{y} {PR} {x}<sup>{i("m")}</sup>{z}<sup>{i("n")}</sup> &nbsp;&nbsp; {y} = {k}{x}<sup>{i("m")}</sup>{z}<sup>{i("n")}</sup>', c)
  + p(f'dengan keadaan {i("m")}, {i("n")} = 1, 2, 3, {F(1, 2)}, {F(1, 3)} dan {k} ialah pemalar.'),
  stack(work([('CONTOH 9', ['Tuliskan hubungan dengan menggunakan simbol ∝ dan persamaan bagi setiap yang berikut.', f'(a) {i("a")} berubah secara langsung dengan {i("b")} dan punca kuasa dua {i("c")}.', f'(b) {y} berubah secara langsung dengan kuasa tiga {i("m")} dan kuasa dua {i("n")}.',
                                  f'(c) Isi padu prisma, {i("V")} berubah secara langsung dengan luas keratan rentas, {i("A")} dan tingginya, {i("h")}.', f'(d) Jisim, {i("w")} bagi sebatang besi berbentuk silinder berubah secara langsung dengan panjang, {i("p")} dan kuasa dua diameter tapaknya, {i("d")}.']),
              ('Penyelesaian', [f'(a) {i("a")} {PR} {i("b")}{sq(i("c"))}, {i("a")} = {k}{i("b")}{sq(i("c"))}', f'(b) {y} {PR} {i("m")}³{i("n")}², {y} = {k}{i("m")}³{i("n")}²', f'(c) {i("V")} {PR} {i("Ah")}, {i("V")} = {k}{i("Ah")}', f'(d) {i("w")} {PR} {i("pd")}², {i("w")} = {k}{i("pd")}²'])], s, 1, 15),
        note(f'{y} {PR} {x}{z} ialah cantuman dua hubungan {y} {PR} {x} dan {y} {PR} {z}.', 'Info:')))

assert near(8 / (2 ** 2 * 5), 0.4) and near(294.3 / (6 * 9.81 * 5), 1)
S(s, 'CONTOH 10', 'Ubahan tercantum dalam bentuk persamaan',
  p(f'<b>CONTOH 10</b> Diberi bahawa {x} {PR} {y}²{z}, ungkapkan {x} dalam sebutan {y} dan {z} jika {x} = 8 apabila {y} = 2 dan {z} = 5.')
  + work([('Penyelesaian', [f'{x} = {k}{y}²{z}', f'8 = {k}(2)²(5)', f'{k} = {F(8, 20)} = {F(2, 5)}', f'Maka, {x} = {F(f"2{y}²{z}", 5)}'])], s, 1, 18),
  stack(p(f'<b>CONTOH 11</b> Tenaga keupayaan graviti, {i("E")} Joule, bagi suatu objek berubah secara langsung dengan jisimnya, {i("m")} kg, pecutan graviti, {i("g")} m s<sup>−2</sup> dan kedudukannya pada ketinggian, {i("h")} m. Diberi bahawa {i("E")} = 294.3 Joule apabila {i("m")} = 6 kg, {i("g")} = 9.81 m s<sup>−2</sup> dan {i("h")} = 5 m, tuliskan satu persamaan yang menghubungkan {i("E")}, {i("m")}, {i("g")} dan {i("h")}.'),
        work([('Penyelesaian', [f'{i("E")} {PR} {i("mgh")}', f'{i("E")} = {k}{i("mgh")}', f'294.3 = {k}(6)(9.81)(5)', f'{k} = {F("294.3", "(6)(9.81)(5)")} = 1', f'Maka, {i("E")} = {i("mgh")}'])], s, 1, 17)))

k12 = 9 / (1.2 * 2)
assert near(k12, 3.75) and near(k12 * 2 * 3, 22.5) and near((30 / (k12 * 4)) ** 3, 8)
S(s, 'CONTOH 12', 'Menghitung nilai dalam ubahan tercantum',
  p(f'Tiga kuantiti, {i("S")}, {i("T")} dan {i("U")} berubah seperti yang ditunjukkan dalam jadual di bawah. Diberi bahawa {i("S")} berubah secara langsung dengan {i("T")} dan punca kuasa tiga {i("U")}. Hitung nilai {x} dan nilai {y}.')
  + table([i('S'), i('T'), i('U')], [['9', '1.2', '8'], [x, '2', '27'], ['30', '4', y]], c, 18),
  work([('Penyelesaian', [f'{i("S")} = {k}{i("T")}{sq(i("U"), 3)}', f'9 = {k}(1.2)({sq(8, 3)}); {k} = {F(9, "(1.2)(2)")} = 3.75', f'Maka, {i("S")} = 3.75{i("T")}{sq(i("U"), 3)}',
                          f'Apabila {i("T")} = 2 dan {i("U")} = 27: {x} = 3.75(2)({sq(27, 3)}) = 22.5', f'Apabila {i("S")} = 30 dan {i("T")} = 4: 30 = 3.75(4){sq(y, 3)}', f'{sq(y, 3)} = {F(30, 15)} = 2, {y} = 2³ = 8'])], s, 1, 18))

k13 = 40 / 300
assert near(k13 * 270, 36)
S(s, 'CONTOH 13', 'Menyelesaikan masalah ubahan langsung',
  p(f'Hukum Charles menyatakan bahawa bagi satu jisim gas yang tetap, isi padu, {i("V")} cm³, gas itu berkadar langsung dengan suhu mutlaknya, {i("T")} Kelvin, jika tekanan gas itu adalah tetap. Diberi bahawa sebuah bekas mengandungi 40 cm³ gas pada suhu 27°C. (a) Ungkapkan {i("V")} dalam sebutan {i("T")}. (b) Hitung isi padu dalam cm³, gas itu jika suhu berubah kepada −3°C.')
  + note(f'Rumus penukaran suhu dalam darjah Celsius kepada Kelvin: {x}°C = (273 + {x}) K', 'Info:'),
  ps4([f'{i("V")} {PR} {i("T")}', f'{i("V")} = 40 apabila {i("T")} = (273 + 27) K'], ['(a) Tuliskan ubahan langsung dalam bentuk persamaan.', f'(b) Gantikan nilai {i("T")} ke dalam persamaan dan hitung isi padu gas itu.'],
      [f'(a) {i("V")} = {k}{i("T")}; 40 = {k}(273 + 27); {k} = {F(40, 300)} = {F(2, 15)}', f'(b) {i("V")} = {F(2, 15)}(273 − 3) = {F(2, 15)}(270) = 36 cm³'], [f'(a) {i("V")} = {F(2, 15)}{i("T")}', '(b) 36 cm³'], s, 15))

k14 = 360 / (6000 * 3)
assert near(k14, 0.02) and near(640 / (k14 * 8000), 4)
S(s, 'CONTOH 14', 'Masalah ubahan tercantum',
  p(f'Puan Lina menyimpan wangnya dalam akaun simpanan. Diberi bahawa faedah, {i("I")} yang diterima berubah secara langsung dengan jumlah prinsipal, {i("p")} dan tempoh dalam tahun, {i("t")} wang yang disimpan. Puan Lina menerima faedah sebanyak RM360 apabila dia menyimpan RM6 000 selama tiga tahun.')
  + p('(a) Hitung tempoh simpanan yang diperlukan supaya Puan Lina dapat menerima faedah RM640 dengan prinsipal RM8 000. (b) Puan Lina ingin mendapatkan jumlah faedah yang sama tetapi mengurangkan tempoh simpanan di (a). Adakah dia perlu menambahkan atau mengurangkan nilai prinsipalnya? Jelaskan jawapan anda.'),
  ps4([f'{i("I")} {PR} {i("pt")}', f'{i("I")} = 360 apabila {i("p")} = 6 000 dan {i("t")} = 3'], [f'(a) Tulis ubahan dalam bentuk persamaan dan hitung nilai {i("t")} apabila {i("I")} = 640 dan {i("p")} = 8 000.', '(b) Memahami perubahan bagi setiap pemboleh ubah dalam persamaan.'],
      [f'(a) 360 = {k}(6 000)(3); {k} = 0.02; {i("I")} = 0.02{i("pt")}', f'640 = (0.02)(8 000){i("t")}; {i("t")} = {F(640, 160)} = 4 tahun', f'(b) Untuk mengekalkan nilai {i("I")}: apabila {i("p")} bertambah, {i("t")} berkurang.'],
      ['(a) 4 tahun', '(b) Prinsipal perlu ditambahkan kerana jumlah faedah berkadar langsung dengan hasil darab prinsipal dan tempoh.'], s, 15))

# =====================================================================
# 1.2 UBAHAN SONGSANG
# =====================================================================
s = '1.2'
c = COL[s]
V15 = [4, 6, 8, 9, 12]
T15 = [36 / v for v in V15]
assert T15 == [9, 6, 4.5, 4, 3]
g = GF.Gr((70, 30, 450, 300), (0, 5), (0, 5), 1, 1, xl=x, yl=y, labels=False)
g.curve(lambda t: 2 / t, 0.42, 4.8, PK, 4).text(3.4, 1.2, 'y = k/x', AM, 16)
S(s, 'DEFINISI', 'Maksud ubahan songsang',
  p('Bagi menyeimbangkan sebuah jongkang-jongket, seseorang yang lebih berat perlu duduk lebih dekat dengan fulkrum, atau seseorang yang lebih ringan perlu duduk lebih jauh dari fulkrum. Apabila jisim bertambah, jarak dari fulkrum berkurang dan sebaliknya.')
  + de(s, f'Dalam ubahan songsang, pemboleh ubah {y} bertambah apabila pemboleh ubah {x} berkurang pada kadar yang sama dan sebaliknya. Hubungan ini juga ditulis sebagai {y} berubah secara songsang dengan {x}.')
,
  SVh(g.svg(), 'Graf hiperbola ubahan songsang', 320, 10))

S(s, 'CONTOH 15', 'Perubahan dalam ubahan songsang',
  p(f'Chia Ming berlari sejauh 36 km. Jadual menunjukkan hubungan antara masa yang diambil dengan laju puratanya. Nyatakan perubahan pada laju purata jika masa yang diambil (a) bertambah dua kali ganda, (b) berkurang 1.5 kali ganda.'),
  stack(table([f'Masa, {i("t")} (jam)'] + [str(t).rstrip('0').rstrip('.') for t in T15], [[f'Laju purata, {i("v")} (km/j)'] + [str(v) for v in V15]], c, 16),
        work([('Penyelesaian', ['(a) Masa 4.5 jam → 9 jam (×2), laju 8 → 4 (÷2). Apabila masa bertambah dua kali ganda, maka laju purata berkurang dua kali ganda.',
                                '(b) Masa 9 jam → 6 jam (÷1.5), laju 4 → 6 (×1.5). Apabila masa berkurang 1.5 kali ganda, maka laju purata bertambah 1.5 kali ganda.'])], s, 1, 16)))

S(s, 'KONSEP', 'Hubungan antara dua pemboleh ubah bagi ubahan songsang',
  bul(s, [f'Nilai {x}{y} ialah satu pemalar yang diwakili dengan {k}.', f'Graf {y} melawan {x} ialah hiperbola.', f'Graf {y} melawan {F(1, x)} ialah graf garis lurus yang bermula daripada asalan ({x} ≠ 0).', f'{k} = {x}₁{y}₁ = {x}₂{y}₂ = {x}₃{y}₃ = kecerunan graf {y} melawan {F(1, x)}'])
  + formula(f'{y} {PR} {F(1, f"{x}<sup>{i("n")}</sup>")} (hubungan ubahan) &nbsp;&nbsp; {y} = {F(k, f"{x}<sup>{i("n")}</sup>")} (bentuk persamaan)', c)
  + p(f'dengan keadaan {i("n")} = 1, 2, 3, {F(1, 2)}, {F(1, 3)} dan {k} ialah pemalar.'),
  stack(table(['Ayat', 'Hubungan'], [[f'{y} berubah secara songsang dengan {x}', f'{y} {PR} {F(1, x)}'], [f'{y} berubah secara songsang dengan kuasa dua {x}', f'{y} {PR} {F(1, f"{x}²")}'], [f'{y} berubah secara songsang dengan kuasa tiga {x}', f'{y} {PR} {F(1, f"{x}³")}'],
                                    [f'{y} berubah secara songsang dengan punca kuasa dua {x}', f'{y} {PR} {F(1, sq(x))}'], [f'{y} berubah secara songsang dengan punca kuasa tiga {x}', f'{y} {PR} {F(1, sq(x, 3))}']], c, 15, False)))

X16 = [2, 3, 4, 5, 6]
T16 = [480 // v for v in X16]
assert all(a * b == 480 for a, b in zip(X16, T16))
X17 = [2, 4, 5, 10]
Y17 = [4 / v for v in X17]
g = GF.Gr((80, 30, 450, 330), (0, 0.6), (0, 2.4), 0.1, 0.4, xl=F(1, x).replace('class="fr"', 'class="fr"') if False else '1/x', yl=y, fs=12)
for a, b in zip(X17, Y17):
    g.pt(1 / a, b, '', PK, r=5.5)
g.seg((0, 0), (0.55, 2.2), PK, 3)
S(s, 'CONTOH 16', 'Menentukan ubahan songsang',
  p(f'Masa, {i("t")} minit, yang diperlukan untuk menyiapkan kerja pemasangan perabot berubah secara songsang dengan bilangan pekerja, {x}. Dengan mengira nilai {x}{i("t")} dan {x}²{i("t")}, tentukan sama ada {i("t")} berubah secara songsang dengan {x} atau {x}².')
  + table([x] + [str(v) for v in X16], [[i('t')] + [str(v) for v in T16], [f'{x}{i("t")}'] + [str(a * b) for a, b in zip(X16, T16)], [f'{x}²{i("t")}'] + [str(a * a * b) for a, b in zip(X16, T16)]], c, 16, rvrows=(1, 2))
,
  work([('Penyelesaian', [f'Nilai {x}{i("t")} ialah pemalar, manakala nilai {x}²{i("t")} bukan pemalar.', f'Maka, {i("t")} berubah secara songsang dengan {x}, iaitu {i("t")} {PR} {F(1, x)}.'])], s, 1, 19))

S(s, 'CONTOH 17', 'Menunjukkan ubahan songsang dengan graf',
  p(f'Dua kuantiti, {x} dan {y}, berubah mengikut jadual. Lukis graf {y} melawan {F(1, x)} dan tunjukkan bahawa {y} berubah secara songsang dengan {x}.')
  + table([x] + [str(v) for v in X17], [[F(1, x)] + [str(1 / v) for v in X17], [y] + [str(v).rstrip('0').rstrip('.') for v in Y17]], c, 17, rvrows=(0,))
  + p(f'Graf {y} melawan {F(1, x)} ialah garis lurus yang bermula daripada asalan. Maka, {y} berubah secara songsang dengan {x}.'),
  SVh(g.svg(), 'Graf y melawan 1/x', 360, 10))

assert near(5 * 0.16, 0.8) and near(5 * 0.4, 2) and near(20 * 1.5 ** 2, 45) and 3 * 8 / 1.5 == 16
S(s, 'CONTOH 18', 'Mengungkapkan ubahan songsang dalam bentuk persamaan',
  p(f'<b>CONTOH 18</b> Diberi {x} = 0.16 apabila {y} = 5. Ungkapkan {y} dalam sebutan {x} jika (a) {y} berubah secara songsang dengan {x}, (b) {y} berubah secara songsang dengan punca kuasa dua {x}.')
  + work([('(a)', [f'{y} = {F(k, x)}', f'5 = {F(k, "0.16")}', f'{k} = 5(0.16) = 0.8', f'Maka, {y} = {F("0.8", x)}']), ('(b)', [f'{y} = {F(k, sq(x))}', f'5 = {F(k, sq("0.16"))}', f'{k} = 5(0.4) = 2', f'Maka, {y} = {F(2, sq(x))}'])], s, 2, 17),
  stack(p(f'<b>CONTOH 19</b> Tarikan graviti, {i("F")}, berubah secara songsang dengan kuasa dua jarak di antara dua buah objek, {i("d")}. Diberi tarikan graviti ialah 20 N apabila jaraknya ialah 1.5 cm. Tuliskan satu ungkapan {i("F")} dalam sebutan {i("d")}.'), work([('Penyelesaian Contoh 19', [f'{i("F")} {PR} {F(1, f"{i("d")}²")}', f'{i("F")} = {F(k, f"{i("d")}²")}', f'20 = {F(k, "(1.5)²")}', f'{k} = 20(1.5)² = 45', f'Maka, {i("F")} = {F(45, f"{i("d")}²")}'])], s, 1, 17)))

S(s, 'CONTOH 20', 'Menghitung nilai dalam ubahan songsang',
  p(f'Diberi {i("p")} berubah secara songsang dengan {i("q")}. Jika {i("p")} = 3 apabila {i("q")} = 8, hitung nilai {i("p")} apabila {i("q")} = 1.5.'),
  work([('Penyelesaian', [f'{i("p")} {PR} {F(1, i("q"))}', f'{i("p")} = {F(k, i("q"))}', f'3 = {F(k, 8)}; {k} = 3(8) = 24', f'Maka, {i("p")} = {F(24, i("q"))}', f'Apabila {i("q")} = 1.5, {i("p")} = {F(24, "1.5")} = 16']),
        ('Langkah alternatif (konsep perkadaran)', [f'{i("p")}₁{i("q")}₁ = {i("p")}₂{i("q")}₂', f'3 × 8 = {i("p")}₂ × 1.5', f'{i("p")}₂ = {F("3 × 8", "1.5")} = 16'])], s, 1, 18))

assert 200 * 60 == 12000 and 12000 / 150 == 80
S(s, 'CONTOH 21', 'Menyelesaikan masalah ubahan songsang',
  p(f'Berdasarkan Hukum Boyle, tekanan gas, {i("p")}, bagi satu jisim gas berkadar songsang dengan isi padu gas, {i("V")}, jika suhu gas itu adalah tetap. Apabila isi padu gas di dalam sebuah silinder ialah 60 cm³, tekanan gas ialah 200 kPa. Hitung isi padu gas dalam cm³, apabila tekanan gas di dalam silinder itu ialah 150 kPa.'),
  ps4([f'{i("p")} berkadaran songsang dengan {i("V")}', f'Apabila {i("V")} = 60 cm³, {i("p")} = 200 kPa'], [f'Tentukan hubungan antara {i("p")} dengan {i("V")} dalam bentuk persamaan. Kemudian, hitung nilai {i("V")} apabila {i("p")} = 150 kPa.'],
      [f'{i("p")} = {F(k, i("V"))}; 200 = {F(k, 60)}; {k} = 12 000', f'Maka, {i("p")} = {F("12 000", i("V"))}', f'Apabila {i("p")} = 150, {i("V")} = {F("12 000", 150)} = 80 cm³'], [f'Apabila {i("p")} = 150 kPa, {i("V")} = 80 cm³'], s, 16))

# =====================================================================
# 1.3 UBAHAN BERGABUNG
# =====================================================================
s = '1.3'
c = COL[s]
k22 = 6 * 4 / 9
assert near(k22, 8 / 3)
S(s, 'DEFINISI', 'Ubahan bergabung',
  de(s, 'Ubahan bergabung melibatkan gabungan ubahan langsung atau ubahan tercantum, dan ubahan songsang.')
  + p(f'Bagi suatu ubahan bergabung, {y} berubah secara langsung dengan {x}<sup>{i("m")}</sup> dan secara songsang dengan {z}<sup>{i("n")}</sup>, boleh ditulis sebagai')
  + formula(f'{y} {PR} {F(f"{x}<sup>{i("m")}</sup>", f"{z}<sup>{i("n")}</sup>")} &nbsp;&nbsp; {y} = {F(f"{k}{x}<sup>{i("m")}</sup>", f"{z}<sup>{i("n")}</sup>")}', c)
  + p(f'dengan keadaan {i("m")}, {i("n")} = 1, 2, 3, {F(1, 2)}, {F(1, 3)} dan {k} ialah pemalar.'),
  work([('CONTOH 22', [f'Diberi bahawa {y} berubah secara langsung dengan kuasa dua {x} dan secara songsang dengan punca kuasa dua {z}. Jika {y} = 6 apabila {x} = 3 dan {z} = 16, ungkapkan {y} dalam sebutan {x} dan {z}.']),
        ('Penyelesaian', [f'{y} {PR} {F(f"{x}²", sq(z))}', f'{y} = {F(f"{k}{x}²", sq(z))}', f'6 = {F(f"{k}(3)²", sq(16))}', f'{k} = {F("6(4)", 9)} = {F(8, 3)}', f'Maka, {y} = {F(f"8{x}²", f"3{sq(z)}")}'])], s, 1, 18))

k23 = 5 * 0.8 / 8
assert near(k23, 0.5) and near(27 / (2 * 13.5), 1) and near(0.4 * 2 * 1.25, 1)
S(s, 'CONTOH 23', 'Menghitung nilai dalam ubahan bergabung',
  p(f'Jadual di bawah menunjukkan hubungan antara {i("P")}, {i("Q")} dan {i("R")}. Diberi {i("P")} berubah secara langsung dengan kuasa tiga {i("Q")} dan secara songsang dengan {i("R")}. Hitung nilai {x} dan nilai {y}.')
  + table([i('P'), i('Q'), i('R')], [['5', '2', '0.8'], ['13.5', '3', x], ['0.4', y, '1.25']], c, 18),
  work([('Penyelesaian', [f'{i("P")} = {F(f"{k}{i("Q")}³", i("R"))}', f'5 = {F(f"{k}(2)³", "0.8")}; {k} = {F("5(0.8)", 8)} = 0.5', f'Maka, {i("P")} = {F(f"{i("Q")}³", f"2{i("R")}")}',
                          f'Apabila {i("P")} = 13.5, {i("Q")} = 3: 13.5 = {F("3³", f"2{x}")}; {x} = {F(27, 27)} = 1', f'Apabila {i("P")} = 0.4, {i("R")} = 1.25: 0.4 = {F(f"{y}³", "2(1.25)")}; {y}³ = 1; {y} = 1'])], s, 1, 18))

k24 = 40000 * 0.025 / 80
assert near(k24, 12.5) and near(k24 * 100 / 0.4, 3125)
S(s, 'CONTOH 24', 'Menyelesaikan masalah ubahan bergabung',
  p(f'Tekanan, {i("p")} N m<sup>−2</sup>, pada roda kereta sorong berubah secara langsung dengan jisim kereta sorong, {i("m")} kg, dan secara songsang dengan luas permukaan sentuhan roda dengan tanah, {i("l")} m². Diberi bahawa tekanan roda ialah 40 000 N m<sup>−2</sup> apabila jisim kereta sorong ialah 80 kg dan luas permukaan sentuhan ialah 0.025 m².')
  + p(f'(a) Hitung nilai {i("p")} apabila {i("m")} = 100 dan {i("l")} = 0.4. (b) Apakah yang boleh dilakukan supaya tekanan pada roda berkurangan jika jisim kereta sorong adalah tetap?'),
  ps4([f'{i("p")} berubah secara langsung dengan {i("m")} dan secara songsang dengan {i("l")}', f'Apabila {i("m")} = 80 dan {i("l")} = 0.025, {i("p")} = 40 000'],
      [f'(a) Tentukan hubungan dalam bentuk persamaan, kemudian gantikan {i("m")} = 100 dan {i("l")} = 0.4.', '(b) Memahami perubahan bagi setiap pemboleh ubah dalam persamaan.'],
      [f'(a) {i("p")} = {F(f"{k}{i("m")}", i("l"))}; 40 000 = {F(f"{k}(80)", "0.025")}; {k} = 12.5', f'{i("p")} = {F("(12.5)(100)", "0.4")} = 3 125 N m<sup>−2</sup>', f'(b) Jika {i("m")} tetap, {i("p")} berkurang apabila {i("l")} bertambah.'],
      ['(a) 3 125 N m<sup>−2</sup>', '(b) Gunakan roda yang lebih lebar kerana tekanan berkurangan apabila luas permukaan sentuhan bertambah.'], s, 15))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'ubahan', 'slides.js')
HEAD = '/* Nota Bab 1 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
