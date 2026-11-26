"""Bab 1 T3 Indeks: nota ikut buku teks (ayat buku, nombor dan nama ditukar)."""
import os, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
from graf import TR, PA, PU, AM, PK, GR, MU3, TX, mn

SUBS = [{"no": "1.1", "name": "Tatatanda Indeks", "col": "#FBBF24"}, {"no": "1.2", "name": "Hukum Indeks", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
P = pw
i = lambda v: f'<i>{v}</i>'

# =====================================================================
# 1.1 TATATANDA INDEKS
# =====================================================================
s = '1.1'
c = COL[s]
big = (f'<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:18px;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:30px">'
       f'<div style="font-size:72px;font-weight:800">{i("a")}<sup style="color:{PK}">{i("n")}</sup></div>'
       f'<div style="display:flex;gap:40px;font-size:20px"><span><b style="color:{TR}">{i("a")}</b> : asas</span><span><b style="color:{PK}">{i("n")}</b> : indeks</span></div>'
       f'<div style="font-size:22px;font-weight:700">{P(5, 4)} = 5 × 5 × 5 × 5</div><div style="font-size:16px;color:{MU3}">dibaca "5 kuasa 4"</div></div>')
S(s, 'DEFINISI', 'Bentuk indeks',
  p('Suatu nombor yang didarab secara berulang boleh ditulis dalam bentuk indeks.')
  + de(s, f'Nilai indeks dalam suatu bentuk indeks adalah sama dengan bilangan kali asas didarab secara berulang. Secara generalisasi, {P(i("a"), i("n"))} = {i("a")} × {i("a")} × {i("a")} × … × {i("a")} ({i("n")} faktor); {i("a")} ≠ 0')
  + note(f'{i("a")} ialah asas dan {i("n")} ialah indeks.', 'Ingat:'),
  big)

S(s, 'CONTOH 1', 'Menulis dalam bentuk indeks',
  p('Tulis pendaraban berulang berikut dalam bentuk indeks.')
  + bul(s, ['(a) 6 × 6 × 6 × 6', '(b) (−3) × (−3) × (−3) × (−3) × (−3)', '(c) 0.2 × 0.2 × 0.2',
            f'(d) {fr(2, 5)} × {fr(2, 5)} × {fr(2, 5)} × {fr(2, 5)}', f'(e) {i("p")} × {i("p")} × {i("p")} × {i("p")} × {i("p")} × {i("p")}', f'(f) {i("k")} × {i("k")} × … × {i("k")} (berulang {i("n")} kali)']),
  work([('', [f'(a) {P(6, 4)} &nbsp; (berulang empat kali)', f'(b) {P("(−3)", 5)} &nbsp; (berulang lima kali)', f'(c) {P("(0.2)", 3)} &nbsp; (berulang tiga kali)',
              f'(d) {P(f"({fr(2, 5)})", 4)} &nbsp; (berulang empat kali)', f'(e) {P(i("p"), 6)} &nbsp; (berulang enam kali)', f'(f) {P(i("k"), i("n"))}'])], s, 1, 20))

assert 3 ** 4 == 81 and 9 ** 2 == 81
S(s, 'CONTOH 2', 'Menukar nombor kepada bentuk indeks',
  p('Suatu nombor boleh ditulis dalam bentuk indeks jika suatu asas yang sesuai dipilih. Anda boleh menggunakan kaedah pembahagian berulang atau kaedah pendaraban berulang untuk menukar suatu nombor kepada nombor dalam bentuk indeks.')
  + p('<b>CONTOH 2</b> Tuliskan 81 dalam bentuk indeks dengan menggunakan asas 3 dan asas 9.')
  + note('Pembahagian diteruskan sehingga mendapat nilai 1.', 'Tip:'),
  work([('Kaedah pembahagian berulang (asas 3)', ['81 ÷ 3 = 27, 27 ÷ 3 = 9, 9 ÷ 3 = 3, 3 ÷ 3 = 1', '81 dibahagi secara berulang dengan 3 sebanyak 4 kali.', f'Maka, 81 = {P(3, 4)}']),
        ('Kaedah pendaraban berulang (asas 3)', ['3 × 3 = 9, 9 × 3 = 27, 27 × 3 = 81', f'Maka, 81 = {P(3, 4)}']),
        ('Asas 9', ['81 ÷ 9 = 9, 9 ÷ 9 = 1  atau  9 × 9 = 81', f'Maka, 81 = {P(9, 2)}'])], s, 1, 19))

assert Fr(27, 125) == Fr(3, 5) ** 3
S(s, 'CONTOH 3', 'Pecahan dalam bentuk indeks',
  p(f'Tuliskan {fr(27, 125)} dalam bentuk indeks dengan menggunakan asas {fr(3, 5)}.')
  + work([('Kaedah pembahagian berulang', ['27 ÷ 3 = 9, 9 ÷ 3 = 3, 3 ÷ 3 = 1 (3 kali)', '125 ÷ 5 = 25, 25 ÷ 5 = 5, 5 ÷ 5 = 1 (3 kali)', f'Maka, {fr(27, 125)} = {P(f"({fr(3, 5)})", 3)}']),
          ('Kaedah pendaraban berulang', [f'{fr(3, 5)} × {fr(3, 5)} = {fr(9, 25)}', f'{fr(9, 25)} × {fr(3, 5)} = {fr(27, 125)}', f'Maka, {fr(27, 125)} = {P(f"({fr(3, 5)})", 3)}'])], s, 2, 19)
  + note('Bagi pecahan, pengangka dan penyebut dibahagi atau didarab secara berulang dengan bilangan kali yang sama.', 'Ingat:'))

assert 3 ** 4 == 81 and round(0.4 ** 3, 3) == 0.064 and 4 ** 5 == 1024 and (-2) ** 7 == -128 and Fr(3, 4) ** 3 == Fr(27, 64) and Fr(3, 2) ** 4 == Fr(81, 16) and round(0.3 ** 4, 4) == 0.0081
S(s, 'CONTOH 4', 'Nilai nombor dalam bentuk indeks',
  p(f'Nilai {P(i("a"), i("n"))} boleh ditentukan dengan kaedah pendaraban berulang atau dengan menggunakan kalkulator saintifik.')
  + p(f'<b>CONTOH 4</b> Hitung nilai bagi nombor dalam bentuk indeks yang diberi. (a) {P(3, 4)} (b) {P("(0.4)", 3)}')
  + work([('(a)', [f'{P(3, 4)} = 3 × 3 × 3 × 3', '= 9 × 9', f'Maka, {P(3, 4)} = 81']), ('(b)', [f'{P("(0.4)", 3)} = 0.4 × 0.4 × 0.4', '= 0.16 × 0.4', f'Maka, {P("(0.4)", 3)} = 0.064'])], s, 2, 19)
  + note('Asas bernilai negatif dan pecahan ditulis bersama tanda kurung semasa menggunakan kalkulator untuk menentukan nilai nombor tersebut.', 'Peringatan:'),
  work([('CONTOH 5', ['Hitung nilai bagi nombor dalam bentuk indeks dengan menggunakan kalkulator.']),
        ('', [f'(a) {P(4, 5)} = 1 024', f'(b) {P("(−2)", 7)} = −128', f'(c) {P(f"({fr(3, 4)})", 3)} = {fr(27, 64)}', f'(d) {P(f"(1{fr(1, 2)})", 4)} = {fr(81, 16)}', f'(e) {P("(−0.3)", 4)} = 0.0081'])], s, 1, 20))

# =====================================================================
# 1.2 HUKUM INDEKS
# =====================================================================
s = '1.2'
c = COL[s]
S(s, 'HUKUM', 'Pendaraban nombor dalam bentuk indeks',
  p('Apakah kaitan antara pendaraban nombor dalam bentuk indeks yang mempunyai asas yang sama dengan pendaraban berulang?')
  + p('Secara generalisasi,')
  + formula(f'{P(i("a"), i("m"))} × {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} + {i("n")}")}', c)
  + note('Kumpulkan nombor atau sebutan algebra dengan asas yang sama terlebih dahulu. Kemudian, tambahkan indeks bagi asas yang sama.', 'Tip:'),
  table(['Pendaraban nombor dalam bentuk indeks', 'Pendaraban berulang'],
          [[f'{P(2, 3)} × {P(2, 4)}', f'(2 × 2 × 2) × (2 × 2 × 2 × 2) = {P(2, 7)} = {P(2, "3 + 4")}'],
           [f'{P(3, 2)} × {P(3, 3)}', f'(3 × 3) × (3 × 3 × 3) = {P(3, 5)} = {P(3, "2 + 3")}'],
           [f'{P(5, 4)} × {P(5, 2)}', f'(5 × 5 × 5 × 5) × (5 × 5) = {P(5, 6)} = {P(5, "4 + 2")}']], c, 18, rvrows=(1, 2)))

S(s, 'CONTOH 6', 'Hukum pendaraban',
  p(f'Ringkaskan setiap yang berikut. (a) {P(5, 3)} × {P(5, 4)} (b) {P("(0.3)", 2)} × {P("(0.3)", 5)} × (0.3) (c) 3{P(i("k"), 2)} × 4{P(i("k"), 3)} (d) 2{P(i("m"), 4)} × {fr(1, 4)}{P(i("m"), 2)} × 6{i("m")}')
  + work([('(a)', [f'{P(5, 3)} × {P(5, 4)} = {P(5, "3 + 4")}', f'= {P(5, 7)}']), ('(b)', [f'{P("(0.3)", 2)} × {P("(0.3)", 5)} × {P("(0.3)", 1)} = {P("(0.3)", "2 + 5 + 1")}', f'= {P("(0.3)", 8)}']),
          ('(c)', [f'3{P(i("k"), 2)} × 4{P(i("k"), 3)} = (3 × 4){P(i("k"), "2 + 3")}', f'= 12{P(i("k"), 5)}']), ('(d)', [f'(2 × {fr(1, 4)} × 6){P(i("m"), "4 + 2 + 1")}', f'= 3{P(i("m"), 7)}'])], s, 2, 18)
  + note(f'{i("a")} = {P(i("a"), 1)}', 'Peringatan:'),
  work([('CONTOH 7', [f'Ringkaskan setiap yang berikut. (a) {P(i("m"), 3)} × {P(i("n"), 2)} × {P(i("m"), 4)} × {i("n")} (b) {P("(0.2)", 3)} × {P("(0.5)", 2)} × (0.2) × {P("(0.5)", 4)}']),
        ('(a)', [f'= {P(i("m"), 3)} × {P(i("m"), 4)} × {P(i("n"), 2)} × {P(i("n"), 1)}', f'= {P(i("m"), "3 + 4")} × {P(i("n"), "2 + 1")}', f'= {P(i("m"), 7)}{P(i("n"), 3)}']),
        ('(b)', [f'= {P("(0.2)", 3)} × {P("(0.2)", 1)} × {P("(0.5)", 2)} × {P("(0.5)", 4)}', f'= {P("(0.2)", "3 + 1")} × {P("(0.5)", "2 + 4")}', f'= {P("(0.2)", 4)} × {P("(0.5)", 6)}'])], s, 1, 18))

assert (-2) ** 3 == -8
S(s, 'HUKUM', 'Pembahagian nombor dalam bentuk indeks',
  p('Apakah kaitan antara pembahagian nombor dalam bentuk indeks yang mempunyai asas yang sama dengan pendaraban berulang?')
  + table(['Pembahagian', 'Pendaraban berulang'], [[f'{P(4, 5)} ÷ {P(4, 2)}', f'{fr("4 × 4 × 4 × 4 × 4", "4 × 4")} = {P(4, 3)} = {P(4, "5 − 2")}'],
                                                    [f'{P(2, 6)} ÷ {P(2, 2)}', f'{fr("2 × 2 × 2 × 2 × 2 × 2", "2 × 2")} = {P(2, 4)} = {P(2, "6 − 2")}']], c, 17, rvrows=(1,))
  + p('Secara generalisasi,')
  + formula(f'{P(i("a"), i("m"))} ÷ {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} − {i("n")}")}', c),
  work([('CONTOH 8', [f'Ringkaskan setiap yang berikut. (a) {P(6, 7)} ÷ {P(6, 3)} (b) {P("(−2)", 8)} ÷ {P("(−2)", 5)} (c) {P(i("p"), 9)} ÷ {P(i("p"), 4)} (d) 20{P(i("x"), 6)}{P(i("y"), 5)} ÷ 4{P(i("x"), 2)}{P(i("y"), 3)}']),
        ('(a)', [f'= {P(6, "7 − 3")} = {P(6, 4)}']), ('(b)', [f'= {P("(−2)", "8 − 5")} = {P("(−2)", 3)} = −8']), ('(c)', [f'= {P(i("p"), "9 − 4")} = {P(i("p"), 5)}']),
        ('(d)', [f'= {fr(20, 4)} × {P(i("x"), "6 − 2")} × {P(i("y"), "5 − 3")}', f'= 5{P(i("x"), 4)}{P(i("y"), 2)}'])], s, 1, 19))

S(s, 'HUKUM', 'Nombor dalam bentuk indeks yang dikuasakan',
  table(['Bentuk indeks yang dikuasakan', 'Pendaraban berulang', 'Kesimpulan'],
        [[P(f'({P(3, 2)})', 4), f'{P(3, 2)} × {P(3, 2)} × {P(3, 2)} × {P(3, 2)} = {P(3, "2 + 2 + 2 + 2")} = {P(3, 8)}', f'{P(f"({P(3, 2)})", 4)} = {P(3, "2(4)")}'],
         [P(f'({P(5, 4)})', 3), f'{P(5, 4)} × {P(5, 4)} × {P(5, 4)} = {P(5, "4 + 4 + 4")} = {P(5, 12)}', f'{P(f"({P(5, 4)})", 3)} = {P(5, "4(3)")}']], c, 17, rvrows=(1,))
  + p('Secara generalisasi,')
  + formula(f'{P(f"({P(i("a"), i("m"))})", i("n"))} = {P(i("a"), f"{i("mn")}")}', c)
  + formula(f'{P(f"({P(i("a"), i("m"))}{P(i("b"), i("n"))})", i("p"))} = {P(i("a"), i("mp"))}{P(i("b"), i("np"))} &nbsp; ; &nbsp; {P(f"({fr(P(i("a"), i("m")), P(i("b"), i("n")))})", i("p"))} = {fr(P(i("a"), i("mp")), P(i("b"), i("np")))}', c),
  work([('CONTOH 9', [f'1. Permudahkan: (a) {P(f"({P(3, 4)})", 2)} (b) {P(f"({P(i("k"), 5)})", 3)} (c) {P(f"(({P("(−"+i("y")+")", 2)})", 4)}'.replace(f'(({P("(−"+i("y")+")", 2)})', f'({P("(−"+i("y")+")", 2)})')]),
        ('Penyelesaian:', [f'(a) {P(3, "4(2)")} = {P(3, 8)} &nbsp; (b) {P(i("k"), "5(3)")} = {P(i("k"), 15)} &nbsp; (c) {P("(−"+i("y")+")", "2(4)")} = {P("(−"+i("y")+")", 8)} = {P(i("y"), 8)}']),
        ('', [f'2. Tentukan sama ada persamaan {P(f"({P(2, 3)})", 4)} = {P(f"({P(2, 4)})", 3)} benar atau palsu.']),
        ('Penyelesaian:', [f'Kiri: {P(f"({P(2, 3)})", 4)} = {P(2, 12)}. Kanan: {P(f"({P(2, 4)})", 3)} = {P(2, 12)}', f'Maka, {P(f"({P(2, 3)})", 4)} = {P(f"({P(2, 4)})", 3)} adalah benar.'])], s, 1, 18))

assert Fr(2 ** 12 * 3 ** 8, 6 ** 4) == Fr(2 ** 8 * 3 ** 4)
S(s, 'CONTOH 10', 'Hukum indeks dalam operasi pendaraban dan pembahagian',
  p(f'Permudahkan setiap yang berikut. (a) {P(f"({P(5, 3)} × {P(7, 2)})", 4)} (b) {P(f"({P(2, 3)} × {P(3, 2)} × {P(11, 5)})", 2)} (c) {P(f"({fr(f"2{P(i("x"), 3)}", f"3{P(i("y"), 2)}")})", 4)} (d) {fr(f"{P(f"(4{P(i("m"), 3)}{P(i("n"), 2)})", 2)}", f"8{P(i("m"), 4)}{i("n")}")}')
  + note(f'{P(f"({P(i("a"), i("m"))} × {P(i("b"), i("n"))})", i("p"))} = {P(i("a"), i("mp"))} × {P(i("b"), i("np"))}', 'Imbas kembali:'),
  work([('(a)', [f'= {P(5, "3(4)")} × {P(7, "2(4)")}', f'= {P(5, 12)} × {P(7, 8)}']), ('(b)', [f'= {P(2, "3(2)")} × {P(3, "2(2)")} × {P(11, "5(2)")}', f'= {P(2, 6)} × {P(3, 4)} × {P(11, 10)}']),
        ('(c)', [f'= {fr(f"{P(2, 4)}{P(i("x"), "3(4)")}", f"{P(3, 4)}{P(i("y"), "2(4)")}")}', f'= {fr(f"16{P(i("x"), 12)}", f"81{P(i("y"), 8)}")}']),
        ('(d)', [f'= {fr(f"{P(4, 2)}{P(i("m"), "3(2)")}{P(i("n"), "2(2)")}", f"8{P(i("m"), 4)}{i("n")}")} = {fr(f"16{P(i("m"), 6)}{P(i("n"), 4)}", f"8{P(i("m"), 4)}{P(i("n"), 1)}")}', f'= 2{P(i("m"), "6 − 4")}{P(i("n"), "4 − 1")} = 2{P(i("m"), 2)}{P(i("n"), 3)}'])], s, 2, 18))

S(s, 'HUKUM', 'Indeks sifar dan indeks negatif',
  table(['Pembahagian', 'Hukum indeks', 'Pendaraban berulang', 'Kesimpulan'],
        [[f'{P(2, 3)} ÷ {P(2, 3)}', f'{P(2, "3 − 3")} = {P(2, 0)}', f'{fr("2 × 2 × 2", "2 × 2 × 2")} = 1', f'{P(2, 0)} = 1'],
         [f'{P(2, 3)} ÷ {P(2, 5)}', f'{P(2, "3 − 5")} = {P(2, "−2")}', f'{fr("2 × 2 × 2", "2 × 2 × 2 × 2 × 2")} = {fr(1, P(2, 2))}', f'{P(2, "−2")} = {fr(1, P(2, 2))}']], c, 17, rvrows=(1,))
  + de(s, 'Suatu nombor atau sebutan algebra yang mempunyai indeks sifar akan memberi nilai 1.')
  + formula(f'{P(i("a"), 0)} = 1 ; {i("a")} ≠ 0 &nbsp;&nbsp;&nbsp; {P(i("a"), "−"+i("n"))} = {fr(1, P(i("a"), i("n")))} ; {i("a")} ≠ 0', c)
  + note(f'Indeks negatif ialah suatu nombor atau sebutan algebra yang mempunyai indeks negatif. {P(f"({fr(i("a"), i("b"))})", "−"+i("n"))} = {P(f"({fr(i("b"), i("a"))})", i("n"))}', 'Tip:'))

S(s, 'CONTOH 11', 'Indeks negatif',
  p(f'1. Nyatakan setiap sebutan berikut dalam bentuk indeks positif. (a) {P(i("a"), "−3")} (b) {P(i("x"), "−5")} (c) {fr(1, P(9, "−2"))} (d) 4{P(i("m"), "−6")} (e) {P(f"({fr(3, 7)})", "−4")}')
  + work([('', [f'(a) {P(i("a"), "−3")} = {fr(1, P(i("a"), 3))}', f'(b) {P(i("x"), "−5")} = {fr(1, P(i("x"), 5))}', f'(c) {fr(1, P(9, "−2"))} = {P(9, 2)}', f'(d) 4{P(i("m"), "−6")} = {fr(4, P(i("m"), 6))}', f'(e) {P(f"({fr(3, 7)})", "−4")} = {P(f"({fr(7, 3)})", 4)}'])], s, 1, 19)
  + p(f'2. Permudahkan {fr(f"{P(5, 2)} × {P(5, 3)}", P(5, 8))}.'),
  stack(work([('Penyelesaian 2:', [f'= {P(5, "2 + 3 − 8")}', f'= {P(5, "−3")}', f'= {fr(1, P(5, 3))}'])], s, 1, 20),
        note(f'2{P(i("a"), "−1")} ≠ {fr(1, f"2{i("a")}")}', 'Peringatan:')))

S(s, 'HUKUM', 'Indeks pecahan',
  p(f'Di Tingkatan 1, anda telah belajar tentang kuasa dua dan punca kuasa dua serta kuasa tiga dan punca kuasa tiga. Tahukah anda, nilai bagi {i("x")} dalam {P(i("x"), 2)} = 9 dan {P(i("x"), 3)} = 64 boleh ditentukan dengan indeks yang dikuasakan dengan nilai salingannya?')
  + p('Secara generalisasi,')
  + formula(f'{sq(i("a"), i("n"))} = {P(i("a"), fr(1, i("n")))} ; {i("a")} ≠ 0', c)
  + formula(f'{P(i("a"), fr(i("m"), i("n")))} = {P(f"({P(i("a"), i("m"))})", fr(1, i("n")))} = {P(f"({P(i("a"), fr(1, i("n")))})", i("m"))} = {sq(P(i("a"), i("m")), i("n"))} = {P(f"({sq(i("a"), i("n"))})", i("m"))}', c),
  work([('(a)', [f'{P(i("x"), 2)} = 9', f'{P(f"({P(i("x"), 2)})", fr(1, 2))} = {P(9, fr(1, 2))}', f'{i("x")} = {P(f"({P(3, 2)})", fr(1, 2))} = 3']), ('(b)', [f'{P(i("x"), 3)} = 64', f'{P(f"({P(i("x"), 3)})", fr(1, 3))} = {P(64, fr(1, 3))}', f'{i("x")} = {P(f"({P(4, 3)})", fr(1, 3))} = 4'])], s, 1, 20))

assert 6 ** 2 == 36 and (-3) ** 3 == -27 and 4 ** 5 == 1024 and 2 ** 5 == 32 and 4 ** 3 == 64
S(s, 'CONTOH 12', 'Menukar antara indeks pecahan dan punca kuasa',
  p(f'1. Tukarkan setiap sebutan berikut kepada bentuk {P(i("a"), fr(1, i("n")))}. (a) {sq(36, 2)} (b) {sq("−27", 3)} (c) {sq(i("m"), 5)}')
  + work([('', [f'(a) {sq(36, 2)} = {P(36, fr(1, 2))} &nbsp; (b) {sq("−27", 3)} = {P("(−27)", fr(1, 3))} &nbsp; (c) {sq(i("m"), 5)} = {P(i("m"), fr(1, 5))}'])], s, 1, 18)
  + p(f'2. Tukarkan setiap sebutan berikut kepada bentuk {sq(i("a"), i("n"))}. (a) {P(1024, fr(1, 5))} (b) {P(64, fr(1, 3))} (c) {P(i("k"), fr(1, 7))}')
  + work([('', [f'(a) {P(1024, fr(1, 5))} = {sq("1 024", 5)} &nbsp; (b) {P(64, fr(1, 3))} = {sq(64, 3)} &nbsp; (c) {P(i("k"), fr(1, 7))} = {sq(i("k"), 7)}'])], s, 1, 18),
  work([('3. Hitung nilai setiap yang berikut.', [f'(a) {sq(32, 5)} = {P(f"({P(2, 5)})", fr(1, 5))} = {P(2, 1)} = 2', f'(b) {sq(64, 3)} = {P(f"({P(4, 3)})", fr(1, 3))} = 4', f'(c) {P(36, fr(1, 2))} = {P(f"({P(6, 2)})", fr(1, 2))} = 6',
                                                f'(d) {P("(−27)", fr(1, 3))} = {P(f"({P("(−3)", 3)})", fr(1, 3))} = −3'])], s, 1, 20))

assert 16 ** 0.75 == 8 and round(125 ** (2 / 3)) == 25
S(s, 'CONTOH 13', 'Indeks pecahan dalam bentuk lain',
  p(f'1. Tukarkan setiap sebutan berikut kepada bentuk {P(f"({P(i("a"), i("m"))})", fr(1, i("n")))} dan {P(f"({P(i("a"), fr(1, i("n")))})", i("m"))}. (a) {P(16, fr(3, 4))} (b) {P(125, fr(2, 3))}')
  + work([('', [f'(a) {P(16, fr(3, 4))} = {P(f"({P(16, 3)})", fr(1, 4))} = {P(f"({P(16, fr(1, 4))})", 3)}', f'(b) {P(125, fr(2, 3))} = {P(f"({P(125, 2)})", fr(1, 3))} = {P(f"({P(125, fr(1, 3))})", 2)}'])], s, 1, 18)
  + p(f'2. Tukarkan setiap sebutan berikut kepada bentuk {sq(P(i("a"), i("m")), i("n"))} dan {P(f"({sq(i("a"), i("n"))})", i("m"))}. (a) {P(16, fr(3, 4))} (b) {P(i("p"), fr(2, 5))}')
  + work([('', [f'(a) {P(16, fr(3, 4))} = {sq(P(16, 3), 4)} = {P(f"({sq(16, 4)})", 3)}', f'(b) {P(i("p"), fr(2, 5))} = {sq(P(i("p"), 2), 5)} = {P(f"({sq(i("p"), 5)})", 2)}'])], s, 1, 18),
  work([('CONTOH 14', [f'Hitung nilai setiap sebutan berikut. (a) {P(16, fr(3, 4))} (b) {P(125, fr(2, 3))}']),
        ('(a)', [f'Kaedah 1: {P(16, fr(3, 4))} = {P(f"({sq(16, 4)})", 3)} = {P(2, 3)} = 8', f'Kaedah 2: {P(16, fr(3, 4))} = {sq(P(16, 3), 4)} = {sq("4 096", 4)} = 8']),
        ('(b)', [f'Kaedah 1: {P(125, fr(2, 3))} = {P(f"({sq(125, 3)})", 2)} = {P(5, 2)} = 25', f'Kaedah 2: {P(125, fr(2, 3))} = {sq(P(125, 2), 3)} = {sq("15 625", 3)} = 25'])], s, 1, 18))

S(s, 'CONTOH 15', 'Operasi yang melibatkan hukum indeks',
  table(['Hukum indeks'], [[f'{P(i("a"), i("m"))} × {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} + {i("n")}")} &nbsp; {P(i("a"), i("m"))} ÷ {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} − {i("n")}")} &nbsp; {P(f"({P(i("a"), i("m"))})", i("n"))} = {P(i("a"), i("mn"))}'],
                           [f'{P(i("a"), 0)} = 1 &nbsp; {P(i("a"), "−"+i("n"))} = {fr(1, P(i("a"), i("n")))} &nbsp; {P(i("a"), fr(1, i("n")))} = {sq(i("a"), i("n"))} &nbsp; {P(i("a"), fr(i("m"), i("n")))} = {sq(P(i("a"), i("m")), i("n"))} = {P(f"({sq(i("a"), i("n"))})", i("m"))}']], c, 17)
  + p(f'Permudahkan setiap yang berikut. (a) {fr(f"{P(f"(2{P(i("x"), 3)})", 2)} × (3{P(i("x"), "−1")})", f"6{P(i("x"), 2)}")} (b) {fr(f"{sq(P(i("m"), 2), 3)} × {P(i("m"), fr(1, 3))}", P(i("m"), "−1"))}'),
  work([('(a)', [f'= {fr(f"4{P(i("x"), 6)} × 3{P(i("x"), "−1")}", f"6{P(i("x"), 2)}")}', f'= {fr(12, 6)} {P(i("x"), "6 + (−1) − 2")}', f'= 2{P(i("x"), 3)}']),
        ('(b)', [f'= {fr(f"{P(i("m"), fr(2, 3))} × {P(i("m"), fr(1, 3))}", P(i("m"), "−1"))}', f'= {P(i("m"), f"{fr(2, 3)} + {fr(1, 3)} − (−1)")}', f'= {P(i("m"), 2)}'])], s, 1, 20))

assert 3 * 125 / (3 * 25) == 5 and abs(4 * 3 / (8 / 3) - 4.5) < 1e-9
S(s, 'CONTOH 16', 'Hitung nilai',
  p(f'Hitung nilai setiap yang berikut. (a) {fr(f"{P(81, fr(1, 4))} × {P(25, fr(3, 2))}", f"{sq(9, 2)} × {P(5, 2)}")} (b) {fr(f"{P(8, fr(2, 3))} × {P(27, fr(1, 3))}", f"{P(2, 3)} × {P(9, "−" + fr(1, 2))}")}')
  + note('Tukar setiap asas kepada faktor perdana terlebih dahulu.', 'Tip:'),
  work([('(a)', [f'= {fr(f"{P(f"({P(3, 4)})", fr(1, 4))} × {P(f"({P(5, 2)})", fr(3, 2))}", f"{P(f"({P(3, 2)})", fr(1, 2))} × {P(5, 2)}")}', f'= {fr(f"{P(3, 1)} × {P(5, 3)}", f"{P(3, 1)} × {P(5, 2)}")}', f'= {P(3, "1 − 1")} × {P(5, "3 − 2")}', '= 1 × 5 = 5']),
        ('(b)', [f'= {fr(f"{P(f"({P(2, 3)})", fr(2, 3))} × {P(f"({P(3, 3)})", fr(1, 3))}", f"{P(2, 3)} × {P(f"({P(3, 2)})", "−" + fr(1, 2))}")}', f'= {fr(f"{P(2, 2)} × {P(3, 1)}", f"{P(2, 3)} × {P(3, "−1")}")}', f'= {P(2, "2 − 3")} × {P(3, "1 − (−1)")}', f'= {P(2, "−1")} × {P(3, 2)} = {fr(9, 2)} = 4{fr(1, 2)}'])], s, 1, 19))

assert abs(2 ** 0.5 * 18 ** 1.5 / 6 - 18) < 1e-9
S(s, 'CONTOH 17', 'Penyelesaian masalah',
  p(f'Hitung nilai bagi {sq(2)} × {P(18, fr(3, 2))} ÷ 6 tanpa menggunakan kalkulator.')
  + work([('Memahami masalah', ['Menghitung nilai bagi nombor dalam bentuk indeks yang diberi dalam asas yang berlainan.']),
          ('Merancang strategi', ['Tukar setiap asas kepada faktor perdana dan hitung nilai dengan mengaplikasi hukum indeks.'])], s, 1, 18)
  + note('Faktor perdana sepunya 6 dan 18 ialah 2 dan 3.', 'Imbas kembali:'),
  work([('Melaksanakan strategi', [f'{sq(2)} × {P(18, fr(3, 2))} ÷ 6', f'= {P(2, fr(1, 2))} × {P("(2 × 3 × 3)", fr(3, 2))} ÷ (2 × 3)', f'= {P(2, fr(1, 2))} × {P(2, fr(3, 2))} × {P(3, 3)} ÷ ({P(2, 1)} × {P(3, 1)})',
                                   f'= {P(2, f"{fr(1, 2)} + {fr(3, 2)} − 1")} × {P(3, "3 − 1")}', f'= {P(2, 1)} × {P(3, 2)} = 18']),
        ('Membuat kesimpulan', [f'{sq(2)} × {P(18, fr(3, 2))} ÷ 6 = 18'])], s, 1, 19))

S(s, 'CONTOH 18', 'Persamaan indeks',
  p(f'Hitung nilai {i("x")} bagi persamaan {P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1.')
  + work([('Memahami masalah', [f'Menghitung nilai bagi pemboleh ubah {i("x")} yang merupakan sebahagian daripada indeks.']),
          ('Merancang strategi', ['Soalan ini merupakan satu persamaan. Maka, nilai di kiri persamaan akan sama dengan nilai di kanan persamaan. Tukarkan semua sebutan kepada bentuk indeks dengan asas 2.'])], s, 1, 18)
  + note(f'Jika {P(i("a"), i("m"))} = {P(i("a"), i("n"))}, maka {i("m")} = {i("n")}. Jika {P(i("a"), i("m"))} = {P(i("b"), i("m"))}, maka {i("a")} = {i("b")}.', 'Peringatan:'),
  work([('Melaksanakan strategi', [f'{P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1', f'{P(2, i("x"))} × {P(2, f"2({i("x")} + 2)")} ÷ {P(2, 7)} = {P(2, 0)}', f'{P(2, f"{i("x")} + 2{i("x")} + 4 − 7")} = {P(2, 0)}',
                                   f'3{i("x")} − 3 = 0', f'{i("x")} = 1']),
        ('Membuat kesimpulan', [f'Jika {P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1, maka, {i("x")} = 1.']),
        ('Semak jawapan', [f'Gantikan {i("x")} = 1: {P(2, 1)} × {P(4, 3)} ÷ {P(2, 7)} = {P(2, "1 + 6 − 7")} = {P(2, 0)} = 1'])], s, 1, 18))

assert all(2 ** (x * x) * 2 ** x == 2 ** 12 for x in (3, -4))
S(s, 'CONTOH 19', 'Persamaan indeks kuadratik',
  p(f'Hitung nilai-nilai {i("x")} yang mungkin bagi persamaan {P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)}.')
  + work([('Memahami masalah', [f'Menghitung nilai {i("x")} yang merupakan sebahagian daripada indeks.']), ('Merancang strategi', ['Semua asas yang terlibat dalam persamaan adalah sama.'])], s, 1, 18)
  + note(f'Selesaikan persamaan kuadratik dengan kaedah pemfaktoran.', 'Imbas kembali:'),
  work([('Melaksanakan strategi', [f'{P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)}', f'{P(2, f"{P(i("x"), 2)} + {i("x")}")} = {P(2, 12)}', f'{P(i("x"), 2)} + {i("x")} = 12', f'{P(i("x"), 2)} + {i("x")} − 12 = 0',
                                   f'({i("x")} − 3)({i("x")} + 4) = 0', f'{i("x")} − 3 = 0 atau {i("x")} + 4 = 0', f'{i("x")} = 3 atau {i("x")} = −4']),
        ('Membuat kesimpulan', [f'Nilai-nilai {i("x")} yang mungkin bagi persamaan {P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)} ialah 3 dan −4.'])], s, 1, 18))

assert 2 * 4 + 2 == 10 and 4 - 2 == 2
S(s, 'CONTOH 20', 'Persamaan serentak',
  p(f'Selesaikan persamaan serentak berikut. {P(9, i("m"))} × {P(3, i("n"))} = {P(3, 10)} dan {P(2, i("m"))} ÷ {P(2, i("n"))} = 4')
  + note('Persamaan linear serentak dalam dua pemboleh ubah boleh diselesaikan dengan menggunakan kaedah penggantian atau kaedah penghapusan.', 'Imbas kembali:'),
  work([('', [f'{P(9, i("m"))} × {P(3, i("n"))} = {P(3, 10)}', f'{P(3, f"2{i("m")}")} × {P(3, i("n"))} = {P(3, 10)}', f'2{i("m")} + {i("n")} = 10 ........ (1)',
              f'{P(2, i("m"))} ÷ {P(2, i("n"))} = {P(2, 2)}', f'{i("m")} − {i("n")} = 2 ........ (2)', 'Persamaan (1) dan (2) boleh diselesaikan melalui kaedah penghapusan.',
              f'(1) + (2): 3{i("m")} = 12, {i("m")} = 4', f'Gantikan {i("m")} = 4 ke dalam (2): 4 − {i("n")} = 2, {i("n")} = 2', f'Maka, {i("m")} = 4 dan {i("n")} = 2'])], s, 1, 19))

x21, y21 = 7, 5
assert 8 * 2 ** x21 == 4 ** y21 and 5 * 25 ** x21 == 125 ** y21
S(s, 'CONTOH 21', 'Penyelesaian masalah',
  p(f'Danish dan Ravi menjalankan dua uji kaji untuk menentukan nilai pemboleh ubah {i("x")} dan {i("y")}. Persamaan yang diperoleh Danish ialah 8({P(2, i("x"))}) = {P(4, i("y"))} sementara Ravi mendapat persamaan 5({P(25, i("x"))}) = {P(125, i("y"))} sebagai dapatan uji kaji yang telah dijalankan. Hitung nilai {i("x")} dan nilai {i("y")} yang dapat memuaskan kedua-dua uji kaji yang telah dijalankan oleh Danish dan Ravi.')
  + note(f'Nilai pemboleh ubah {i("x")} dan {i("y")} boleh ditentukan jika anda dapat menyelesaikan kedua-dua persamaan tersebut.', 'Tip:'),
  work([('', [f'8({P(2, i("x"))}) = {P(4, i("y"))}: {P(2, 3)}({P(2, i("x"))}) = {P(2, f"2{i("y")}")}, maka 3 + {i("x")} = 2{i("y")} ........ (1)',
              f'5({P(25, i("x"))}) = {P(125, i("y"))}: {P(5, 1)}({P(5, f"2{i("x")}")}) = {P(5, f"3{i("y")}")}, maka 1 + 2{i("x")} = 3{i("y")} ........ (2)',
              f'Daripada (1): {i("x")} = 2{i("y")} − 3 ........ (3)', f'Gantikan (3) ke dalam (2): 1 + 2(2{i("y")} − 3) = 3{i("y")}', f'1 + 4{i("y")} − 6 = 3{i("y")}, {i("y")} = 5',
              f'Gantikan {i("y")} = 5 ke dalam (3): {i("x")} = 2(5) − 3 = 7', f'Maka, {i("x")} = 7, {i("y")} = 5'])], s, 1, 18))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'indeks', 'slides.js')
HEAD = '/* Nota Bab 1 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
