"""Bab 2 T3 Bentuk Piawai: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "2.1", "name": "Angka Bererti", "col": "#38BDF8"}, {"no": "2.2", "name": "Bentuk Piawai", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def E(a, n):
    return f'{a} × 10<sup>{str(n).replace("-", "−")}</sup>'


def hl(digits, c, mark):
    """Tandakan digit: mark = senarai indeks yang ialah angka bererti."""
    return ''.join(f'<span style="color:{c};text-decoration:underline">{d}</span>' if k in mark else f'<span style="color:#64748B">{d}</span>' for k, d in enumerate(digits))


def ab(x):
    """bilangan angka bererti bagi rentetan perpuluhan (sifar hujung bererti)."""
    t = x.replace(' ', '').replace('.', '').lstrip('0')
    return len(t)


# =====================================================================
# 2.1 ANGKA BERERTI
# =====================================================================
s = '2.1'
c = COL[s]
o = GF.box(14, 14, 472, 442)
o += f'<circle cx="110" cy="200" r="62" fill="{TR}33" stroke="{TR}" stroke-width="3"/><circle cx="410" cy="200" r="22" fill="{MU3}33" stroke="{MU3}" stroke-width="3"/>'
o += GF.T(110, 290, 'Bumi', TX, 18) + GF.T(410, 250, 'Bulan', TX, 18)
o += GF.L((180, 200), (380, 200), AM, 2.5, '7 6') + GF.head((380, 200), (180, 200), AM) + GF.head((180, 200), (380, 200), AM) + GF.T(280, 180, '384 400 km', AM, 20)
o += GF.T(250, 370, 'Nilai jarak ini merupakan satu anggaran', MU3, 16, halo=False) + GF.T(250, 394, 'yang diberi dalam bentuk penghampiran.', MU3, 16, halo=False)
S(s, 'DEFINISI', 'Angka bererti',
  p('Dalam kehidupan seharian, kita menggunakan ukuran dalam pelbagai situasi. <b>Anggaran</b> suatu ukuran boleh dibuat dengan menggunakan <b>penghampiran</b>. Misalnya jarak di antara bumi dengan bulan ialah 384 400 km.')
  + p('<b>Darjah penghampiran</b> suatu ukuran kepada <b>nilai sebenar</b> menunjukkan tahap ketepatan atau <b>kejituan</b> ukuran tersebut.')
  + de(s, 'Angka bererti suatu integer atau perpuluhan merujuk kepada digit-digit dalam nombor tersebut yang dinyatakan tepat kepada suatu darjah ketepatan yang dikehendaki. Bilangan angka bererti dihitung bermula daripada suatu digit bukan sifar.'),
  SV(o, 'Jarak bumi ke bulan 384 400 km'))

S(s, 'PERATURAN', 'Menentukan bilangan angka bererti',
  p('Secara generalisasi,')
  + bul(s, ['Semua digit bukan sifar ialah angka bererti.', 'Digit sifar antara digit bukan sifar ialah angka bererti.',
            'Digit sifar di bahagian akhir suatu integer ialah angka bererti mengikut tahap kejituan yang dikehendaki.',
            'Digit sifar di bahagian akhir suatu perpuluhan ialah angka bererti kerana menentukan tahap kejituan perpuluhan tersebut.',
            'Digit sifar sebelum digit bukan sifar yang pertama bukan angka bererti.'])
  + note('Sifar yang berada di antara digit-digit bukan sifar ialah angka bererti. Misalnya, 40 009 (5 angka bererti).', 'Tip:'),
  stack(work([('Perpuluhan', [f'<span style="font-size:30px;letter-spacing:4px">{hl("0.0070320", PK, [4, 5, 6, 7, 8])}</span>',
                              'Sifar sebelum digit 7: bukan angka bererti, hanya digunakan untuk menentukan nilai tempat bagi digit 7.', 'Sifar di antara atau di bahagian akhir perpuluhan: angka bererti.', 'Maka, 0.0070320 mempunyai 5 angka bererti.']),
              ('Integer', [f'<span style="font-size:30px;letter-spacing:4px">{hl("605000", PK, [0, 1, 2])}</span>', 'Semua digit bukan sifar dan sifar di antaranya ialah angka bererti.',
                           'Sifar di hujung integer: angka bererti mengikut tahap kejituan yang dikehendaki.'])], s, 1, 18)))

c1a = [('(a) 4 352', 4, ''), ('(b) 6 007', 4, 'Digit sifar antara digit bukan sifar ialah angka bererti.'), ('(c) 8 102', 4, '')]
c1b = [('(e) 0.6205', 4, 'Digit sifar sebelum digit bukan sifar yang pertama bukan angka bererti.'), ('(f) 0.0702', 3, ''), ('(g) 15.031', 5, ''),
       ('(h) 2.3400', 5, 'Digit sifar di bahagian akhir perpuluhan ialah angka bererti.')]
assert [ab(x.split(') ')[1]) for x, _, _ in c1b] == [4, 3, 5, 5]


def lines(xs):
    return [f'{x} &nbsp; [{n} a.b.]' + (f' — {t}' if t else '') for x, n, t in xs]


S(s, 'CONTOH 1', 'Bilangan angka bererti',
  p('Tentukan bilangan angka bererti bagi nombor-nombor berikut. (a) 4 352 (b) 6 007 (c) 8 102 (d) 27 000 (e) 0.6205 (f) 0.0702 (g) 15.031 (h) 2.3400')
  + work([('', lines(c1a))], s, 1, 18)
  + work([('(d) 27 000', ['(i) 27 000 [2 a.b.] jika tahap kejituan ialah ribu terhampir.', '(ii) 27 000 [3 a.b.] jika tahap kejituan ialah ratus terhampir.',
                          '(iii) 27 000 [4 a.b.] jika tahap kejituan ialah puluh terhampir.', '(iv) 27 000 [5 a.b.] jika tahap kejituan ialah sa terhampir.'])], s, 1, 17),
  work([('', lines(c1b))], s, 1, 18))

def rnd_sig(x, n):
    from decimal import Decimal, ROUND_HALF_UP
    d = Decimal(str(x))
    e = d.adjusted() - n + 1
    return float(d.quantize(Decimal(f'1e{e}'), rounding=ROUND_HALF_UP))


assert rnd_sig(57384, 2) == 57000 and rnd_sig(3692, 2) == 3700 and rnd_sig(8951, 2) == 9000
S(s, 'CONTOH 2', 'Membundarkan integer',
  p('Masihkah anda ingat bagaimana untuk membundarkan suatu nombor kepada nilai tempat tertentu? Konsep dan kaedah yang sama digunakan untuk membundarkan suatu nombor kepada bilangan angka bererti yang tertentu.')
  + p('<b>CONTOH 2</b> Bundarkan setiap nombor yang berikut kepada 2 angka bererti. (a) 57 384 (b) 3 692 (c) 8 951')
  + note('Bagi integer, titik perpuluhan terletak di belakang digit terakhir.', 'Tip:'),
  work([('(a) 57 384', ['3 < 5, maka digit 7 tidak berubah.', '3, 8 dan 4 terletak sebelum titik perpuluhan. Maka, gantikan 3, 8 dan 4 dengan sifar.', 'Maka, 57 384 = 57 000 (2 a.b.)']),
        ('(b) 3 692', ['9 > 5, maka tambah 1 kepada 6.', '9 dan 2 terletak sebelum titik perpuluhan. Oleh itu, gantikan 9 dan 2 dengan sifar.', 'Maka, 3 692 = 3 700 (2 a.b.)']),
        ('(c) 8 951', ['5 = 5, maka tambah 1 kepada 9.', '5 dan 1 terletak sebelum titik perpuluhan. Oleh itu, gantikan 5 dan 1 dengan sifar.', 'Maka, 8 951 = 9 000 (2 a.b.)'])], s, 1, 18))

assert rnd_sig(47.86, 3) == 47.9 and rnd_sig(47.86, 1) == 50 and rnd_sig(0.006047, 3) == 0.00605 and rnd_sig(0.006047, 2) == 0.0060
S(s, 'CONTOH 3', 'Membundarkan perpuluhan',
  p('Bundarkan 47.86 kepada (a) 3 angka bererti (b) 1 angka bererti')
  + work([('(a)', ['6 > 5, maka tambah 1 kepada 8.', 'Digit 6 terletak selepas titik perpuluhan. Maka, 6 digugurkan.', 'Maka, 47.86 = 47.9 (3 a.b.)']),
          ('(b)', ['7 > 5, maka tambah 1 kepada 4.', 'Digit 7 terletak sebelum titik perpuluhan. Maka, 7 digantikan dengan sifar. Digit 8 dan 6 terletak selepas titik perpuluhan, maka digit-digit itu digugurkan.', 'Maka, 47.86 = 50 (1 a.b.)'])], s, 1, 17),
  stack(work([('CONTOH 4', ['Bundarkan 0.006047 kepada (a) 3 angka bererti (b) 2 angka bererti']),
        ('(a)', ['7 > 5, maka tambah 1 kepada 4.', 'Digit 7 digugurkan kerana terletak selepas titik perpuluhan.', 'Maka, 0.006047 = 0.00605 (3 a.b.)']),
        ('(b)', ['4 < 5, maka digit 0 tidak berubah.', 'Digit 4 dan 7 digugurkan kerana terletak selepas titik perpuluhan.', 'Maka, 0.006047 = 0.0060 (2 a.b.)'])], s, 1, 17),
  note('Digit-digit yang selepas digit yang dibundarkan dalam perpuluhan harus digugurkan.', 'Tip:')))

# =====================================================================
# 2.2 BENTUK PIAWAI
# =====================================================================
s = '2.2'
c = COL[s]
S(s, 'DEFINISI', 'Bentuk piawai',
  p('Pelbagai bidang sains seperti astronomi, biologi, fizik dan kejuruteraan sering menggunakan nombor bernilai terlalu besar atau terlalu kecil dalam kajian mereka. Nombor-nombor tersebut ditulis dalam bentuk piawai untuk memudahkan cara penulisan.')
  + de(s, f'<b>Bentuk piawai</b> ialah cara menulis suatu nombor tunggal dalam bentuk {E("<i>A</i>", "<i>n</i>")} dengan keadaan 1 ≤ <i>A</i> &lt; 10 dan <i>n</i> ialah integer.')
  + p(f'Misalnya, keluasan negara Malaysia ialah 330 803 000 000 m². Nilai ini boleh ditulis sebagai {E("3.308", 11)} m² atau {E("3.30803", 11)} m² atau mengikut bilangan angka bererti yang dikehendaki.'),
  stack(table(['Nombor tunggal', 'Bentuk piawai'], [['1 000', E(1, 3)], ['100', E(1, 2)], ['10', E(1, 1)], ['1', E(1, 0)], ['0.1', E(1, -1)], ['0.01', E(1, -2)]], c, 19),
        note('Nombor bernilai lebih daripada 1 akan memberi indeks positif. Nombor bernilai kurang daripada 1 akan memberi indeks negatif.', 'Ingat:')))

S(s, 'CONTOH 5', 'Menulis nombor tunggal dalam bentuk piawai',
  p('Apabila suatu nombor tunggal ditukar kepada bentuk piawai;')
  + bul(s, ['Nombor bernilai lebih daripada 1 akan memberi indeks positif.', 'Nombor bernilai kurang daripada 1 akan memberi indeks negatif.'])
  + p('<b>CONTOH 5</b> Tuliskan nombor tunggal berikut dalam bentuk piawai. (a) 47 (b) 470 (c) 3 906.2')
  + work([('(a)', ['47 = 4.7 × 10', E('= 4.7', 1)]), ('(b)', ['470 = 4.7 × 100', E('= 4.7', 2)]), ('(c)', ['3 906.2 = 3.9062 × 1 000', E('= 3.9062', 3)])], s, 3, 18),
  stack(work([('CONTOH 6', ['Tuliskan perpuluhan berikut dalam bentuk piawai. (a) 0.682 (b) 0.00491 (c) 0.05207 (d) 0.006012']),
        ('(a)', [f'0.682 = 6.82 × {fr(1, 10)} = {E("6.82", -1)}']), ('(b)', [f'0.00491 = 4.91 × {fr(1, "1 000")} = 4.91 × {fr(1, "10<sup>3</sup>")} = {E("4.91", -3)}']),
        ('(c)', [f'0.05207 = 5.207 × {fr(1, 100)} = {E("5.207", -2)}']), ('(d)', [f'0.006012 = 6.012 × {fr(1, "1 000")} = {E("6.012", -3)}'])], s, 1, 18),
  note(f'{fr(1, "<i>a</i><sup><i>n</i></sup>")} = <i>a</i><sup>−<i>n</i></sup>', 'Imbas kembali:')))

assert 5.32e4 == 53200 and abs(6.105e-5 - 0.00006105) < 1e-15
S(s, 'CONTOH 7', 'Menukar bentuk piawai kepada nombor tunggal',
  p('Apabila suatu nombor dalam bentuk piawai ditukar kepada nombor tunggal; nombor itu bernilai sama atau lebih daripada 10 jika indeksnya positif, dan bernilai kurang daripada 1 jika indeksnya negatif.')
  + p(f'<b>CONTOH 7</b> Tuliskan {E("5.32", 4)} sebagai nombor tunggal.')
  + work([('', [f'{E("5.32", 4)} = 5.32 × 10 000 = 53 200'])], s, 1, 19)
  + p(f'<b>CONTOH 8</b> Tuliskan {E("6.105", -5)} sebagai nombor tunggal.')
  + work([('', [f'{E("6.105", -5)} = 6.105 × {fr(1, "100 000")} = 0.00006105'])], s, 1, 19),
  stack(table(['Awalan', 'Simbol', 'Nilai'], [['tera', 'T', E(1, 12)], ['giga', 'G', E(1, 9)], ['mega', 'M', E(1, 6)], ['kilo', 'k', E(1, 3)], ['mili', 'm', E(1, -3)], ['mikro', 'μ', E(1, -6)], ['nano', 'n', E(1, -9)]], c, 17),
        note('Bentuk piawai memudahkan penulisan nombor yang bernilai besar dan nombor yang bernilai kecil dalam bentuk yang ringkas dan mudah difahami.', 'Ingat:')))

S(s, 'CONTOH 9', 'Unit metrik dalam bentuk piawai',
  p('Tentukan 4 120 terabait dalam bait. Nyatakan jawapan dalam bentuk piawai.')
  + work([('', [f'4 120 terabait = 4 120 × 10<sup>12</sup> bait', f'= ({E("4.12", 3)}) × 10<sup>12</sup> bait', f'= {E("4.12", "3 + 12")} bait', f'= {E("4.12", 15)} bait'])], s, 1, 20)
  + note('Gunakan hukum indeks <i>a</i><sup><i>m</i></sup> × <i>a</i><sup><i>n</i></sup> = <i>a</i><sup><i>m</i> + <i>n</i></sup>.', 'Tip:'),
  work([('CONTOH 10', ['Tentukan 0.0068 nanometer dalam meter. Nyatakan jawapan dalam bentuk piawai.']),
        ('Penyelesaian:', [f'0.0068 nanometer = 0.0068 × 10<sup>−9</sup> meter', f'= ({E("6.8", -3)}) × 10<sup>−9</sup> meter', f'= {E("6.8", "−3 + (−9)")} meter', f'= {E("6.8", -12)} meter'])], s, 1, 20))

assert abs(3.14e3 + 6.28e3 - 9.42e3) < 1e-6 and abs(5.36e5 + 8.91e5 - 1.427e6) < 1e-3 and abs(6.04e4 + 2.53e3 - 6.293e4) < 1e-6 and abs(8.27e5 - 2.15e4 - 8.055e5) < 1e-6
S(s, 'CONTOH 11', 'Operasi tambah dan tolak',
  p('Hitung nilai setiap operasi berikut. Nyatakan jawapan dalam bentuk piawai. (a) ' + E('3.14', 3) + ' + ' + E('6.28', 3) + ' (b) ' + E('5.36', 5) + ' + ' + E('8.91', 5)
    + ' (c) ' + E('6.04', 4) + ' + ' + E('2.53', 3) + ' (d) ' + E('8.27', 5) + ' − ' + E('2.15', 4))
  + work([('(a)', [f'= (3.14 + 6.28) × 10<sup>3</sup>', f'= {E("9.42", 3)}']), ('(b)', [f'= (5.36 + 8.91) × 10<sup>5</sup>', f'= {E("14.27", 5)}', f'= {E("1.427", 1)} × 10<sup>5</sup>', f'= {E("1.427", 6)}'])], s, 2, 18)
  + note('Bagi operasi tambah dan tolak, tukarkan indeks bernilai kecil kepada indeks bernilai besar seperti Kaedah 1.', 'Tip:'),
  work([('(c) Kaedah 1', [f'= {E("6.04", 4)} + {E("2.53", "−1")} × 10<sup>4</sup>', f'= {E("6.04", 4)} + {E("0.253", 4)}', f'= (6.04 + 0.253) × 10<sup>4</sup>', f'= {E("6.293", 4)}']),
        ('(c) Kaedah 2', [f'= {E("60.4", 3)} + {E("2.53", 3)}', f'= (60.4 + 2.53) × 10<sup>3</sup> = {E("62.93", 3)}', f'= {E("6.293", 4)}']),
        ('(d) Kaedah 1', [f'= {E("8.27", 5)} − {E("0.215", 5)}', f'= (8.27 − 0.215) × 10<sup>5</sup>', f'= {E("8.055", 5)}'])], s, 1, 18))

assert abs(4.62e-3 + 8.15e-3 - 1.277e-2) < 1e-12 and abs(7.36e-4 + 2.18e-5 - 7.578e-4) < 1e-12 and abs(3.4e-5 - 5.2e-6 - 2.88e-5) < 1e-13
S(s, 'CONTOH 12', 'Tambah dan tolak dengan indeks negatif',
  p('Hitung nilai setiap operasi berikut. Nyatakan jawapan dalam bentuk piawai. (a) ' + E('4.62', -3) + ' + ' + E('8.15', -3) + ' (b) ' + E('7.36', -4) + ' + ' + E('2.18', -5) + ' (c) ' + E('3.4', -5) + ' − ' + E('5.2', -6))
  + work([('(a)', [f'= (4.62 + 8.15) × 10<sup>−3</sup>', f'= {E("12.77", -3)}', f'= {E("1.277", 1)} × 10<sup>−3</sup>', f'= {E("1.277", "1 + (−3)")}', f'= {E("1.277", -2)}'])], s, 1, 18),
  work([('(b) Kaedah 1', [f'= {E("7.36", -4)} + {E("2.18", -1)} × 10<sup>−4</sup>', f'= {E("7.36", -4)} + {E("0.218", -4)}', f'= (7.36 + 0.218) × 10<sup>−4</sup>', f'= {E("7.578", -4)}']),
        ('(c) Kaedah 1', [f'= {E("3.4", -5)} − {E("5.2", -1)} × 10<sup>−5</sup>', f'= {E("3.4", -5)} − {E("0.52", -5)}', f'= (3.4 − 0.52) × 10<sup>−5</sup>', f'= {E("2.88", -5)}'])], s, 1, 18))

assert abs(4e3 * 2.6e5 - 1.04e9) < 1 and abs(8.4e-3 * 5e-4 - 4.2e-6) < 1e-15 and abs(7.2e6 / 3e2 - 2.4e4) < 1e-6 and abs(3.6e-5 / 9e-2 - 4e-4) < 1e-15
S(s, 'CONTOH 13', 'Operasi darab dan bahagi',
  p('Selesaikan setiap operasi berikut. Nyatakan jawapan dalam bentuk piawai. (a) ' + E(4, 3) + ' × ' + E('2.6', 5) + ' (b) ' + E('8.4', -3) + ' × ' + E(5, -4)
    + f' (c) {fr(E("7.2", 6), E(3, 2))} (d) {fr(E("3.6", -5), E(9, -2))}')
  + note('Hukum indeks: (<i>A</i> × 10<sup><i>m</i></sup>) × (<i>B</i> × 10<sup><i>n</i></sup>) = (<i>A</i> × <i>B</i>) × 10<sup><i>m</i> + <i>n</i></sup>; (<i>A</i> × 10<sup><i>m</i></sup>) ÷ (<i>B</i> × 10<sup><i>n</i></sup>) = (<i>A</i> ÷ <i>B</i>) × 10<sup><i>m</i> − <i>n</i></sup>', 'Tip:'),
  work([('(a)', [f'= (4 × 2.6) × 10<sup>3 + 5</sup>', f'= {E("10.4", 8)}', f'= {E("1.04", 9)}']), ('(b)', [f'= (8.4 × 5) × 10<sup>−3 + (−4)</sup>', f'= {E(42, -7)}', f'= {E("4.2", -6)}']),
        ('(c)', [f'= {fr("7.2", 3)} × 10<sup>6 − 2</sup>', f'= {E("2.4", 4)}']), ('(d)', [f'= {fr("3.6", 9)} × 10<sup>−5 − (−2)</sup>', f'= {E("0.4", -3)}', f'= {E(4, -4)}'])], s, 2, 18))

assert abs(600 * 8.5e-3 - 5.1) < 1e-9 and abs(25.5 / 5.1 - 5) < 1e-9
S(s, 'CONTOH 14', 'Penyelesaian masalah',
  p(f'Satu rim kertas mengandungi 600 helai kertas. Ketebalan sehelai kertas ialah {E("8.5", -3)} cm. Diberi ketebalan bagi <i>n</i> rim kertas yang sama ialah 25.5 cm. Hitung nilai <i>n</i>.')
  + work([('Memahami masalah', ['Bilangan kertas dalam 1 rim = 600', f'Ketebalan sehelai kertas = {E("8.5", -3)} cm', 'Ketebalan <i>n</i> rim kertas = 25.5 cm']),
          ('Merancang strategi', ['Tentukan ketebalan satu rim kertas.', f'<i>n</i> = {fr("ketebalan <i>n</i> rim", "ketebalan 1 rim")}'])], s, 1, 18),
  work([('Melaksanakan strategi', [f'Ketebalan 1 rim kertas = 600 × {E("8.5", -3)} cm', '= 5.1 cm', f'Maka, <i>n</i> = {fr("ketebalan <i>n</i> rim kertas", "ketebalan 1 rim kertas")} = {fr("25.5 cm", "5.1 cm")}', '<i>n</i> = 5']),
        ('Membuat kesimpulan', ['Bilangan rim ialah 5.'])], s, 1, 19))

Pp, Rr, Qq = (110, 380), (400, 380), (110, 150)
o = f'<polygon points="{Pp[0]},{Pp[1]} {Rr[0]},{Rr[1]} {Qq[0]},{Qq[1]}" fill="{GR}22" stroke="{GR}" stroke-width="4" stroke-linejoin="round"/>'
o += f'<path d="M124 380 L124 366 L110 366" fill="none" stroke="{MU3}" stroke-width="2"/>'
o += GF.T(96, 392, 'P', TX, 20, 'end') + GF.T(412, 392, 'R', TX, 20, 'start') + GF.T(96, 146, 'Q', TX, 20, 'end')
o += GF.T(255, 410, '3.9 × 10² m', TX, 17) + GF.T(270, 250, '6.5 × 10² m', TX, 17, 'start')
assert abs((6.5e2 ** 2 - 3.9e2 ** 2) ** 0.5 - 5.2e2) < 1e-6 and abs(0.5 * 3.9e2 * 5.2e2 - 1.014e5) < 1e-6 and abs(1.014e5 * 30 - 3042000) < 1e-3
S(s, 'CONTOH 15', 'Penyelesaian masalah',
  p('Sebuah syarikat hartanah telah membeli sebidang tanah berbentuk segi tiga bersudut tegak <i>PQR</i> seperti dalam rajah di sebelah.')
  + bul(s, ['(a) Hitung nilai <i>PQ</i>, dalam meter dan nyatakan jawapan dalam bentuk piawai.', '(b) Jika kos bagi satu meter persegi tanah ialah RM30, hitung jumlah kos tanah tersebut dalam RM.'])
  + work([('Memahami masalah', ['∆<i>PQR</i> ialah segi tiga bersudut tegak. <i>QR</i> ialah hipotenus.']),
          ('Merancang strategi', ['(a) Menghitung <i>PQ</i> dengan menggunakan teorem Pythagoras. (b) Menghitung luas tanah bentuk ∆<i>PQR</i>. Darabkan jumlah luas tanah dengan kos 1 m² tanah.'])], s, 1, 17),
  SV(o, 'Tanah segi tiga bersudut tegak PQR'))

S(s, 'CONTOH 15 (sambungan)', 'Penyelesaian',
  work([('Melaksanakan strategi', [f'(a) <i>PQ</i>² = [({E("6.5", 2)})² − ({E("3.9", 2)})²] m²', f'= [{E("4.225", 5)} − {E("1.521", 5)}] m²', f'= ({E("2.704", 5)}) m²',
                                   f'<i>PQ</i> = {sq(f"{E("2.704", 5)}")} m = {E("5.2", 2)} m',
                                   f'(b) Luas ∆<i>PQR</i> = {fr(1, 2)} × ({E("3.9", 2)} m) × ({E("5.2", 2)} m) = {E("1.014", 5)} m²', f'Kos tanah = {E("1.014", 5)} × RM30 = RM3 042 000.00']),
        ('Membuat kesimpulan', [f'(a) Jarak <i>PQ</i> = {E("5.2", 2)} m', '(b) Jumlah kos tanah = RM3 042 000.00'])], s, 1, 19),
  SV(o, 'Tanah segi tiga bersudut tegak PQR'))

S(s, 'CONTOH 16', 'Penyelesaian masalah',
  p(f'Gambar rajah menunjukkan bulan dengan diameter {E("3.4748", 3)} km. Hitung luas permukaan bulan, dalam km². Nyatakan jawapan anda dalam bentuk piawai, betul kepada empat angka bererti. [Luas permukaan sfera = 4π<i>j</i>² dan π = 3.142]')
  + work([('Memahami masalah', ['Bulan berbentuk sfera.', f'Diameter bulan ialah {E("3.4748", 3)} km.', 'Jawapan dalam bentuk piawai betul kepada empat angka bererti.']),
          ('Merancang strategi', [f'Jejari = {fr("diameter", 2)}.', 'Menggunakan rumus luas permukaan sfera untuk menghitung luas permukaan bulan.'])], s, 1, 18),
  work([('Melaksanakan strategi', [f'Jejari bulan = ({fr(E("3.4748", 3), 2)}) km = {E("1.7374", 3)} km', 'Luas permukaan bulan = 4π<i>j</i>²', f'= [4(3.142)({E("1.7374", 3)})²] km²', f'= 37 937 246.5 km²', f'= {E("3.794", 7)} km² (4 a.b.)']),
        ('Membuat kesimpulan', [f'Luas permukaan bulan ialah {E("3.794", 7)} km².'])], s, 1, 19))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'piawai', 'slides.js')
HEAD = '/* Nota Bab 2 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
