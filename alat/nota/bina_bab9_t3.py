"""Bab 9 T3 Garis Lurus: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik folder garislurus dikekalkan (9.1.1 hingga 9.1.7) kerana bab.js dan soalan.js bergantung padanya.
Pemetaan ke standard pembelajaran buku: 9.1.1 → SP 9.1.1, 9.1.2 → SP 9.1.2, 9.1.3 → SP 9.1.3, 9.1.4 → SP 9.1.4,
9.1.5 → SP 9.1.5, 9.1.6 → SP 9.1.6, 9.1.7 → SP 9.1.7."""
import os, sys, math
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, mn

SUBS = [{"no": "9.1.1", "name": "Persamaan y = mx + c", "col": "#38BDF8"}, {"no": "9.1.2", "name": "Bentuk Lain Persamaan", "col": "#A78BFA"},
        {"no": "9.1.3", "name": "Titik pada Garis Lurus", "col": "#34D399"}, {"no": "9.1.4", "name": "Garis Selari", "col": "#FBBF24"},
        {"no": "9.1.5", "name": "Persamaan Garis Lurus", "col": "#FB923C"}, {"no": "9.1.6", "name": "Titik Persilangan", "col": "#F472B6"},
        {"no": "9.1.7", "name": "Penyelesaian Masalah", "col": "#F87171"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
x_, y_ = '<i>x</i>', '<i>y</i>'


def i(s):
    return f'<i>{s}</i>'


def sf(v, var=''):
    """pecahan bertindan bagi Fraction v (dengan tanda tolak di luar)."""
    v = Fr(v)
    if v.denominator == 1:
        return mn(int(v)) + var
    sg = '−' if v < 0 else ''
    return f'{sg}{F(abs(v.numerator), v.denominator)}{var}'


def mx_c(m, c):
    """y = mx + c dengan pecahan bertindan."""
    m, c = Fr(m), Fr(c)
    t = '' if m == 0 else ('' if m == 1 else ('−' if m == -1 else sf(m))) + x_
    if c != 0:
        t += (' + ' if c > 0 else ' − ') + sf(abs(c)) if t else sf(c)
    return f'{y_} = {t or "0"}'


def svgfrac(x, y, pre, num, den, post, col, size=15):
    """label SVG: pre + pecahan bertindan + post (bermula di x)."""
    cw = size * 0.56
    o = GF.T(x, y, pre, col, size, 'start')
    xf = x + cw * len(pre) + 2; wf = cw * max(len(num), len(den)) + 4
    o += GF.T(xf + wf / 2, y - size * 0.55, num, col, size * 0.85) + GF.T(xf + wf / 2, y + size * 0.6, den, col, size * 0.85) + GF.L((xf, y), (xf + wf, y), col, 1.6)
    return o + GF.T(xf + wf + 2, y, post, col, size, 'start')


def plane(xr, yr, box=(55, 40, 455, 430), xs=1, ys=1, gx=1, gy=1):
    return GF.Gr(box, xr, yr, xs, ys, gx, gy, equal=True)


def line(G, m, c, col, xa, xb, lab='', lx=None, ly=None, anchor='start', reveal=False):
    G.seg((xa, m * xa + c), (xb, m * xb + c), col, 3.5, reveal=reveal)
    if lab:
        G.text(lx, ly, lab, col, 15, anchor, reveal=reveal)


# =====================================================================
# 9.1.1 PERSAMAAN y = mx + c
# =====================================================================
s = '9.1.1'
c = COL[s]
G = plane((-4.5, 4.5), (-4.5, 6.5), xs=2, ys=2)
line(G, 2, 1, TR, -2.6, 2.6, f'{y_} = 2{x_} + 1', -3.9, 1.6, 'start')
G.pt(0, 1, '(0, 1)', AM, 10, 12)
G.seg((0.5, 2), (1.5, 2), AM, 2.4, '5 4').seg((1.5, 2), (1.5, 4), AM, 2.4, '5 4').text(1.0, 1.55, '1', AM, 14).text(1.85, 3, '2', AM, 14)
S(s, 'GENERALISASI', 'Persamaan garis lurus',
  p('Semasa di Tingkatan 2, anda telah mempelajari cara untuk melukis graf bagi suatu fungsi linear dan fungsi bukan linear dengan membina jadual nilai bagi fungsi berkaitan.')
  + bul(s, [f'Bagi suatu fungsi linear, {y_} = {i("m")}{x_} + {i("c")}, {i("m")} ialah <b>kecerunan</b> dan {i("c")} ialah <b>pintasan-{y_}</b> garis lurus tersebut.',
            f'Graf untuk fungsi linear, {y_} = {i("m")}{x_} + {i("c")} ialah satu garis lurus.'])
  + p('Secara generalisasi,')
  + formula(f'Persamaan garis lurus: {y_} = {i("m")}{x_} + {i("c")} &emsp; ({i("m")} = kecerunan, {i("c")} = pintasan-{y_})', c),
  SV(G.svg(), 'Graf y = 2x + 1 dengan kecerunan 2 dan pintasan-y 1'))

G = plane((-4.5, 4.5), (-4.5, 4.5), xs=2, ys=2)
line(G, 0, 3, TR, -4.3, 4.3, f'{y_} = 3', 2.2, 3.4, 'start')
G.seg((-2, -4.3), (-2, 4.3), PK, 3.5).text(-1.8, -3.6, f'{x_} = −2', PK, 15, 'start')
S(s, 'KONSEP', 'Garis yang selari dengan paksi',
  p('Didapati bahawa;')
  + bul(s, [f'(a) Graf untuk fungsi linear {y_} = {i("m")}{x_} + {i("c")} ialah satu garis lurus.', f'(b) Graf untuk fungsi {y_} = {i("h")} ialah satu garis lurus yang <b>selari dengan paksi-{x_}</b>.',
            f'(c) Graf untuk fungsi {x_} = {i("h")} ialah satu garis lurus yang <b>selari dengan paksi-{y_}</b>.'])
  + note(f'Dalam persamaan {y_} = {i("m")}{x_} + {i("c")}, pekali bagi {y_} ialah +1.', 'Buletin:'),
  SV(G.svg(), 'Garis y = 3 selari dengan paksi-x dan garis x = -2 selari dengan paksi-y'))

# Contoh 1
assert Fr(-3, 4) * 4 == -3
S(s, 'CONTOH 1', 'Kecerunan dan pintasan-y',
  p(f'Tentukan kecerunan dan pintasan-{y_} bagi garis lurus (a) {y_} = 5{x_} + 7 (b) 4{y_} = −3{x_} + 20')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'Bandingkan {y_} = 5{x_} + 7 dengan {y_} = {i("m")}{x_} + {i("c")}; {i("m")} = 5 dan {i("c")} = 7', f'Maka, kecerunan = 5 dan pintasan-{y_} = 7']),
          ('(b)', [f'Diberi 4{y_} = −3{x_} + 20', f'{F(f"4{y_}", 4)} = −{F(f"3{x_}", 4)} + {F(20, 4)} &emsp;(dibahagi dengan 4 supaya pekali {y_} bernilai +1)', f'{y_} = −{F(3, 4)}{x_} + 5',
                   f'Maka, kecerunan = −{F(3, 4)} dan pintasan-{y_} = 5'])], s, 1, 18),
  stack(note(f'Apakah nilai pintasan-{y_} bagi suatu garis lurus yang melalui asalan?', 'Bijak minda:'), note(f'Apakah nilai kecerunan bagi garis lurus (a) {y_} = {x_} (b) {y_} = −{x_}?', 'Kuiz:')))

# Contoh 2
G = plane((-3.5, 6.5), (-1.5, 9.5), box=(30, 40, 240, 430), xs=2, ys=2)
G.seg((-3.3, 7), (6.3, 7), TR, 3.5).pt(-2, 7, '(−2, 7)', AM, -4, -14, 'end').pt(0, 7, '(0, 7)', AM, 6, 22).pt(4, 7, f'P(4, 7)', AM, -2, -14, 'end')
G.text(5.4, 8.1, f'{y_} = {i("h")}', TR, 14)
G2 = plane((-1.5, 7.5), (-1.5, 9.5), box=(260, 40, 480, 430), xs=2, ys=2)
G2.seg((5, -1.3), (5, 9.3), PK, 3.5).pt(5, 8, f'P(5, 8)', AM, -8, -14, 'end').pt(5, 3, f'Q(5, 3)', AM, -8, -14, 'end').pt(5, 0, f'(5, 0)', AM, 8, 14)
G2.text(6.2, 9.0, f'{x_} = {i("h")}', PK, 14)
S(s, 'CONTOH 2', 'Garis y = h dan x = h',
  p(f'Nyatakan nilai {i("h")} bagi graf garis lurus di sebelah. Nyatakan alasan untuk jawapan anda.')
  + pen(s, [f'(a) {i("h")} = 7 kerana garis lurus {y_} = 7 sentiasa berjarak 7 unit dari paksi-{x_}.', f'(b) {i("h")} = 5 kerana garis lurus {x_} = 5 sentiasa berjarak 5 unit dari paksi-{y_}.']),
  SV(G.svg() + G2.svg() + GF.T(30, 26, '(a)', MU3, 15, 'start', halo=False) + GF.T(265, 26, '(b)', MU3, 15, 'start', halo=False), 'Garis y = h melalui y = 7 dan garis x = h melalui x = 5'))

# =====================================================================
# 9.1.2 BENTUK LAIN PERSAMAAN
# =====================================================================
s = '9.1.2'
c = COL[s]
G = plane((-1.5, 7.5), (-1.5, 5.5), xs=1, ys=1)
G.seg((-0.6, 4.4), (7.3, -0.9), c, 3.5).pt(6, 0, f'{i("a")}', AM, 6, 18).pt(0, 4, f'{i("b")}', AM, -12, -6, 'end')
G.add(svgfrac(G.X(2.6), G.Y(3.2), '', 'x', 'a', ' + ', c, 16) + svgfrac(G.X(3.6), G.Y(3.2), '', 'y', 'b', ' = 1', c, 16))
S(s, 'GENERALISASI', 'Bentuk lain persamaan garis lurus',
  p(f'Persamaan garis lurus dalam bentuk {i("a")}{x_} + {i("b")}{y_} = {i("c")}, {F(x_, i("a"))} + {F(y_, i("b"))} = 1 dan {y_} = {i("m")}{x_} + {i("c")} menghasilkan graf garis lurus yang sama jika nilai pintasan-{x_} dan pintasan-{y_} adalah sama.')
  + p('Secara generalisasi,')
  + de(s, f'Persamaan garis lurus {y_} = {i("m")}{x_} + {i("c")} juga boleh ditulis dalam bentuk {i("a")}{x_} + {i("b")}{y_} = {i("c")} dan {F(x_, i("a"))} + {F(y_, i("b"))} = 1; {i("a")} ≠ 0 dan {i("b")} ≠ 0')
  + note(f'Bagi persamaan garis lurus {F(x_, i("a"))} + {F(y_, i("b"))} = 1, {i("a")} = pintasan-{x_} dan {i("b")} = pintasan-{y_}.', 'Tip:'),
  SV(G.svg(), 'Garis lurus dengan pintasan-x a dan pintasan-y b'))

# Contoh 3: 3x + 4y = 24, 2x − 5y = 10
assert Fr(24, 3) == 8 and Fr(24, 4) == 6 and Fr(10, 2) == 5 and Fr(10, -5) == -2
S(s, 'CONTOH 3', f'Menukar bentuk {i("a")}{x_} + {i("b")}{y_} = {i("c")}',
  p(f'Tukarkan persamaan garis lurus di bawah kepada bentuk {F(x_, i("a"))} + {F(y_, i("b"))} = 1 dan {y_} = {i("m")}{x_} + {i("c")}. (a) 3{x_} + 4{y_} = 24 (b) 2{x_} − 5{y_} = 10')
  + work([('(a)(i)', [f'3{x_} + 4{y_} = 24', f'{F(f"3{x_}", 24)} + {F(f"4{y_}", 24)} = {F(24, 24)} &emsp;(dibahagi dengan 24 supaya mendapat nilai 1)', f'{F(x_, 8)} + {F(y_, 6)} = 1']),
          ('(a)(ii)', [f'3{x_} + 4{y_} = 24', f'4{y_} = −3{x_} + 24', f'{F(f"4{y_}", 4)} = {F(f"−3{x_}", 4)} + {F(24, 4)} &emsp;(dibahagi dengan 4 supaya pekali {y_} bernilai +1)', f'{y_} = −{F(3, 4)}{x_} + 6'])], s, 2, 17),
  stack(work([('(b)(i)', [f'2{x_} − 5{y_} = 10', f'{F(f"2{x_}", 10)} − {F(f"5{y_}", 10)} = {F(10, 10)}', f'{F(x_, 5)} − {F(y_, 2)} = 1']),
              ('(b)(ii)', [f'2{x_} − 5{y_} = 10', f'−5{y_} = −2{x_} + 10', f'{F(f"−5{y_}", "(−5)")} = {F(f"−2{x_}", "(−5)")} + {F(10, "(−5)")}', f'{y_} = {F(2, 5)}{x_} − 2'])], s, 1, 17)))

# Contoh 4: x/4 + y/2 = 1 ; −x/3 + y/6 = 1
S(s, 'CONTOH 4', f'Menukar bentuk {F(x_, i("a"))} + {F(y_, i("b"))} = 1',
  p(f'Tukarkan persamaan garis lurus di bawah kepada bentuk {i("a")}{x_} + {i("b")}{y_} = {i("c")} dan {y_} = {i("m")}{x_} + {i("c")}. (a) {F(x_, 4)} + {F(y_, 2)} = 1 (b) −{F(x_, 3)} + {F(y_, 6)} = 1')
  + work([('(a)(i)', [f'{F(x_, 4)} + {F(y_, 2)} = 1', f'{F(f"2{x_} + 4{y_}", "4(2)")} = 1 &emsp;(kaedah menyamakan penyebut)', f'2{x_} + 4{y_} = 8', f'{x_} + 2{y_} = 4']),
          ('(a)(ii)', [f'{F(y_, 2)} = −{F(x_, 4)} + 1', f'× 2: {y_} = −{F(1, 2)}{x_} + 2'])], s, 2, 17),
  stack(work([('(b)(i)', [f'−{F(x_, 3)} + {F(y_, 6)} = 1', f'{F(f"−6{x_} + 3{y_}", "3(6)")} = 1', f'−6{x_} + 3{y_} = 18', f'−2{x_} + {y_} = 6']),
              ('(b)(ii)', [f'{F(y_, 6)} = {F(x_, 3)} + 1', f'× 6: {y_} = 2{x_} + 6'])], s, 1, 17),
        note(f'−2{x_} + {y_} = 6 juga boleh ditulis sebagai 2{x_} − {y_} = −6.', 'Tip:')))

# Contoh 5: y = −3x + 12 ; y = 2x + 8
S(s, 'CONTOH 5', f'Menukar bentuk {y_} = {i("m")}{x_} + {i("c")}',
  p(f'Tukarkan persamaan garis lurus berikut kepada bentuk {i("a")}{x_} + {i("b")}{y_} = {i("c")} dan {F(x_, i("a"))} + {F(y_, i("b"))} = 1. (a) {y_} = −3{x_} + 12 (b) {y_} = 2{x_} + 8')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'(i) {y_} = −3{x_} + 12', f'3{x_} + {y_} = 12', f'(ii) {F(f"3{x_}", 12)} + {F(y_, 12)} = {F(12, 12)}', f'{F(x_, 4)} + {F(y_, 12)} = 1']),
          ('(b)', [f'(i) {y_} = 2{x_} + 8', f'−2{x_} + {y_} = 8', f'(ii) {F(f"−2{x_}", 8)} + {F(y_, 8)} = {F(8, 8)}', f'−{F(x_, 4)} + {F(y_, 8)} = 1'])], s, 2, 19)
  + note(f'Antara tiga bentuk persamaan garis lurus yang anda belajar, bentuk manakah yang paling mudah diketahui nilai kecerunan, nilai pintasan-{y_} dan nilai pintasan-{x_} suatu garis lurus? Bincangkan.', 'Sudut diskusi:'))

# =====================================================================
# 9.1.3 TITIK PADA GARIS LURUS
# =====================================================================
s = '9.1.3'
c = COL[s]
G = plane((-1.5, 6.5), (-1.5, 4.5), xs=1, ys=1)
line(G, Fr(-1, 2), 3, c, -0.8, 6.4, f'{x_} + 2{y_} = 6', 3.3, 2.3, 'start')
G.pt(6, 0, f'P(6, 0)', AM, -2, -16, 'end').pt(2, 2, f'Q(2, 2)', AM, -2, -16, 'end').pt(2, 3, f'R(2, 3)', PK, 8, -12)
S(s, 'KONSEP', 'Titik pada garis lurus',
  p(f'Rajah di sebelah menunjukkan garis lurus {x_} + 2{y_} = 6. Gantikan koordinat titik-titik {i("P")}, {i("Q")} dan {i("R")} ke dalam persamaan.')
  + table(['Titik', f'Kiri: {x_} + 2{y_}', 'Kanan', ''], [[f'P(6, 0)', '6 + 2(0) = 6', '6', 'Sama'], [f'Q(2, 2)', '2 + 2(2) = 6', '6', 'Sama'], [f'R(2, 3)', '2 + 2(3) = 8', '6', 'Tidak sama']], c, 17, rvrows=(0, 1, 2))
  + p('Daripada aktiviti di atas didapati;')
  + bul(s, ['(a) titik-titik pada garis lurus atau titik-titik yang dilalui oleh garis lurus akan <b>memenuhi</b> persamaan garis lurus.', '(b) titik-titik yang tidak terletak pada garis lurus <b>tidak akan memenuhi</b> persamaan garis lurus.']),
  SV(G.svg(), 'Garis x + 2y = 6 melalui P dan Q tetapi tidak melalui R'))

# Contoh 6
assert 4 * 3 - 1 == 11 and 2 * (-3) - 3 * 2 != 12 and Fr(8, 4) + Fr(-3, 3) == 1 and 3 * 2 != -4 * 1 - 9
S(s, 'CONTOH 6', 'Menentukan titik pada garis lurus',
  p(f'Tentukan sama ada titik {i("P")} terletak pada garis lurus yang diberikan atau tidak. (a) {y_} = 4{x_} − 1, {i("P")}(3, 11) (b) 2{x_} − 3{y_} = 12, {i("P")}(−3, 2) (c) {F(x_, 4)} + {F(y_, 3)} = 1, {i("P")}(8, −3) (d) 3{y_} = −4{x_} − 9, {i("P")}(1, 2)')
  + work([('(a)', ['Kiri: = 11', f'Kanan: 4{x_} − 1 = 4(3) − 1 = 11', 'Sama', f'Maka, {i("P")}(3, 11) terletak pada garis lurus {y_} = 4{x_} − 1.']),
          ('(b)', [f'Kiri: 2{x_} − 3{y_} = 2(−3) − 3(2) = −12', 'Kanan: = 12', 'Tidak sama', f'Maka, {i("P")}(−3, 2) tidak terletak pada garis lurus 2{x_} − 3{y_} = 12.'])], s, 1, 17),
  stack(work([('(c)', [f'Kiri: {F(8, 4)} + {F("(−3)", 3)} = 2 − 1 = 1', 'Kanan: = 1', 'Sama', f'Maka, {i("P")}(8, −3) terletak pada garis lurus {F(x_, 4)} + {F(y_, 3)} = 1.']),
          ('(d)', [f'Kiri: 3{y_} = 3(2) = 6', f'Kanan: −4{x_} − 9 = −4(1) − 9 = −13', 'Tidak sama', f'Maka, {i("P")}(1, 2) tidak terletak pada garis lurus 3{y_} = −4{x_} − 9.'])], s, 1, 17)))

# Contoh 7: 4x + 3y = 24, P(3, q)
assert Fr(24, 4) == 6 and Fr(24, 3) == 8 and Fr(24 - 12, 3) == 4
G = plane((-1.5, 7.5), (-1.5, 9.5), xs=1, ys=1)
line(G, Fr(-4, 3), 8, c, -0.6, 6.8, f'4{x_} + 3{y_} = 24', 4.2, 4.6, 'start')
G.pt(6, 0, i('h'), AM, 4, 18).pt(0, 8, i('k'), AM, -12, 0, 'end').pt(3, 4, f'P(3, {i("q")})', PK, 10, -10)
S(s, 'CONTOH 7', 'Pintasan dan kecerunan daripada persamaan',
  p(f'Rajah di sebelah menunjukkan garis lurus 4{x_} + 3{y_} = 24. Diberi bahawa {i("O")} adalah asalan. Tentukan nilai (a) {i("h")} (b) {i("k")} (c) {i("q")} (d) kecerunan garis lurus')
  + work([('(a)', [f'{i("h")} merupakan pintasan-{x_}. Maka, {y_} = 0', f'4({i("h")}) + 3(0) = 24', f'{i("h")} = {F(24, 4)} = 6']),
          ('(b)', [f'{i("k")} merupakan pintasan-{y_}. Maka, {x_} = 0', f'4(0) + 3({i("k")}) = 24', f'{i("k")} = {F(24, 3)} = 8']),
          ('(c)', [f'P(3, {i("q")}) pada garis lurus.', f'4(3) + 3({i("q")}) = 24', f'3{i("q")} = 12', f'{i("q")} = 4']),
          ('(d)', [f'{i("m")} = −{F(f"pintasan-{y_}", f"pintasan-{x_}")}', f'= −{F(8, 6)} = −{F(4, 3)}'])], s, 2, 16),
  SV(G.svg(), 'Garis 4x + 3y = 24 dengan pintasan h dan k serta titik P(3, q)'))

# =====================================================================
# 9.1.4 GARIS SELARI
# =====================================================================
s = '9.1.4'
c = COL[s]
G = plane((-4.5, 4.5), (-5.5, 5.5), xs=2, ys=2)
cols = [TR, GR, AM, PA, PK]
for k, cc in enumerate([4, 2, 0, -2, -4]):
    xa = max(-4.4, (-5.4 - cc) / 2); xb = min(4.4, (5.4 - cc) / 2)
    line(G, 2, cc, cols[k], xa, xb)
G.text(-3.9, 4.6, f'{y_} = 2{x_} + {i("c")}', MU3, 15, 'start')
S(s, 'GENERALISASI', 'Kecerunan garis selari',
  p('Anda telah pelajari bahawa kecerunan suatu garis lurus ialah nisbah jarak mencancang kepada jarak mengufuk dan sudut sepadan garis-garis selari adalah sama.')
  + p(f'Garis lurus {y_} = 2{x_} + 4, {y_} = 2{x_} + 2, {y_} = 2{x_}, {y_} = 2{x_} − 2 dan {y_} = 2{x_} − 4 adalah selari kerana mempunyai kecerunan yang sama, iaitu {i("m")} = 2 dan sudut sepadan yang sama, iaitu 63.43°.')
  + p('Secara generalisasi,') + de(s, 'Garis lurus yang mempunyai kecerunan yang sama adalah <b>selari</b>.')
  + note(f'Bagi menentukan nilai kecerunan garis lurus, tukarkan persamaan garis lurus yang diberi kepada bentuk {y_} = {i("m")}{x_} + {i("c")}.', 'Tip:'),
  SV(G.svg(), 'Lima garis selari y = 2x + c'))

# Contoh 8 & 9
S(s, 'CONTOH 8', 'Garis yang selari',
  p(f'Tentukan sama ada garis lurus {y_} = 4{x_} + 3 adalah selari dengan garis lurus 8{x_} − 2{y_} = 5.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{y_} = 4{x_} + 3', f'Bandingkan dengan {y_} = {i("m")}{x_} + {i("c")}', 'Kecerunan = 4']),
          ('', [f'8{x_} − 2{y_} = 5', f'−2{y_} = −8{x_} + 5', f'{F(f"−2{y_}", "(−2)")} = {F(f"−8{x_}", "(−2)")} + {F(5, "(−2)")}', f'{y_} = 4{x_} − {F(5, 2)}', 'Kecerunan = 4'])], s, 2, 19)
  + p(f'Kecerunan kedua-dua garis lurus adalah <b>sama</b> maka, {y_} = 4{x_} + 3 adalah selari dengan 8{x_} − 2{y_} = 5.'))
S(s, 'CONTOH 9', 'Garis yang tidak selari',
  p(f'Tentukan sama ada garis lurus {y_} = 4{x_} + 7 adalah selari dengan garis lurus 8{y_} = 4{x_} − 16.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{y_} = 4{x_} + 7', f'Bandingkan dengan {y_} = {i("m")}{x_} + {i("c")}', 'Kecerunan = 4']),
          ('', [f'8{y_} = 4{x_} − 16', f'{y_} = {F(f"4{x_}", 8)} − {F(16, 8)}', f'{y_} = {F(1, 2)}{x_} − 2', f'Kecerunan = {F(1, 2)}'])], s, 2, 19)
  + p(f'Kecerunan kedua-dua garis lurus adalah <b>tidak sama</b>. Maka, {y_} = 4{x_} + 7 tidak selari dengan 8{y_} = 4{x_} − 16.')
  + note('Adakah dua garis selari akan bersilang? Bincangkan.', 'Sudut diskusi:'))

# Contoh 10: 6x + 4y = 20 selari dengan 3x + hy = 15 → h = 2
assert Fr(-6, 4) == Fr(-3, 2)
S(s, 'CONTOH 10', 'Mencari pekali daripada garis selari',
  p(f'Diberi bahawa garis lurus 6{x_} + 4{y_} = 20 adalah selari dengan garis lurus 3{x_} + {i("h")}{y_} = 15. Hitung nilai {i("h")}.')
  + p('<b>Penyelesaian:</b> Jika kedua-dua garis lurus adalah selari maka, kecerunan adalah sama.')
  + work([(f'Bagi 6{x_} + 4{y_} = 20', [f'4{y_} = −6{x_} + 20', f'{y_} = −{F(3, 2)}{x_} + 5', f'Kecerunan = −{F(3, 2)}']),
          (f'Bagi 3{x_} + {i("h")}{y_} = 15', [f'{i("h")}{y_} = −3{x_} + 15', f'{y_} = −{F(3, i("h"))}{x_} + {F(15, i("h"))}', f'Kecerunan = −{F(3, i("h"))}']),
          ('Maka,', [f'−{F(3, 2)} = −{F(3, i("h"))}', f'{i("h")} = 3 × {F(2, 3)}', f'{i("h")} = 2'])], s, 3, 18))

# =====================================================================
# 9.1.5 PERSAMAAN GARIS LURUS
# =====================================================================
s = '9.1.5'
c = COL[s]
S(s, 'LANGKAH', 'Menentukan persamaan suatu garis lurus',
  steps(s, [f'Tentukan nilai kecerunan, {i("m")}.', 'Tentukan satu titik yang dilalui oleh garis lurus atau pada garis lurus tersebut.',
              f'Gantikan nilai kecerunan, {i("m")}, nilai koordinat-{x_} dan nilai koordinat-{y_} dari titik ke dalam persamaan garis lurus {y_} = {i("m")}{x_} + {i("c")} untuk menentukan nilai {i("c")} iaitu nilai pintasan-{y_}.',
              f'Gantikan nilai kecerunan dan nilai pintasan-{y_} yang ditentukan ke dalam persamaan garis lurus {y_} = {i("m")}{x_} + {i("c")}.']))

# Contoh 11: m = 2/3, P(9, 4)
assert 4 - Fr(2, 3) * 9 == -2
S(s, 'CONTOH 11', 'Kecerunan dan satu titik diberi',
  p(f'Tentukan persamaan garis lurus dengan kecerunan {F(2, 3)} dan melalui titik {i("P")}(9, 4).')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{i("m")} = {F(2, 3)}, {x_} = 9, {y_} = 4', f'Gantikan nilai {i("m")}, {x_} dan {y_} ke dalam {y_} = {i("m")}{x_} + {i("c")} untuk menentukan nilai {i("c")}.', f'4 = {F(2, 3)}(9) + {i("c")}', f'4 = 6 + {i("c")}',
                f'{i("c")} = 4 − 6', f'{i("c")} = −2', f'Maka, persamaan garis lurus ialah {y_} = {F(2, 3)}{x_} − 2.'])], s, 1, 19),
  stack(note(f'Tentukan persamaan garis lurus dengan kecerunan 0 dan melalui titik {i("P")}(1, 5).', 'Kuiz:')))

# Contoh 12: P(−2, 7), Q(1, −8)
m12 = Fr(-8 - 7, 1 - (-2)); c12 = 7 - m12 * (-2)
assert m12 == -5 and c12 == -3 and -8 == m12 * 1 + c12
S(s, 'CONTOH 12', 'Dua titik diberi',
  p(f'Tentukan persamaan garis lurus yang melalui titik {i("P")}(−2, 7) dan {i("Q")}(1, −8).')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'{i("m")} = {F("−8 − 7", "1 − (−2)")} = {F(-15, 3)} = −5', f'Bagi titik {i("P")}(−2, 7), {x_} = −2, {y_} = 7.', f'Gantikan nilai {i("m")}, {x_} dan {y_} ke dalam {y_} = {i("m")}{x_} + {i("c")} untuk menentukan nilai {i("c")}.',
                f'7 = (−5)(−2) + {i("c")}', f'7 = 10 + {i("c")}', f'{i("c")} = 7 − 10', f'{i("c")} = −3', f'Maka, persamaan garis lurus ialah {y_} = −5{x_} − 3.'])], s, 1, 19),
  stack(note(f'Anda juga boleh gantikan nilai titik {i("Q")}, iaitu {x_} = 1 dan {y_} = −8 serta {i("m")} = −5 dalam {y_} = {i("m")}{x_} + {i("c")} untuk menghitung nilai {i("c")}.', 'Tip:')))

# Contoh 13: A(3, 5), M(0, 5), N(3, 0)
G = plane((-1.5, 5.5), (-1.5, 6.5), xs=1, ys=1)
G.seg((-1.3, 5), (5.3, 5), c, 3.5).seg((3, -1.3), (3, 6.3), PK, 3.5)
G.pt(0, 5, f'M(0, 5)', AM, 8, -14).pt(3, 5, f'A(3, 5)', AM, 8, -14).pt(3, 0, f'N(3, 0)', AM, 8, 16)
G.text(-1.2, 5.4, 'P', TX, 15).text(5.2, 5.4, 'Q', TX, 15).text(3.3, 6.2, 'S', TX, 15, 'start').text(3.3, -1.1, 'R', TX, 15, 'start')
S(s, 'CONTOH 13', 'Garis selari dengan paksi',
  p(f'Rajah di sebelah menunjukkan garis lurus {i("PQ")} dan garis lurus {i("RS")}. Diberi bahawa garis lurus {i("PQ")} adalah selari dengan paksi-{x_} dan garis lurus {i("RS")} adalah selari dengan paksi-{y_}. Tentukan (a) persamaan garis lurus {i("PQ")} (b) persamaan garis lurus {i("RS")}')
  + work([('(a)', [f'Kecerunan garis lurus {i("PQ")} dengan {i("A")}(3, 5) dan {i("M")}(0, 5):', f'{i("m")} = {F("5 − 5", "3 − 0")} = {F(0, 3)} = 0', f'Pintasan-{y_} = 5', f'Maka, persamaan garis lurus {i("PQ")} ialah {y_} = 0({x_}) + 5', f'{y_} = 5']),
          ('(b)', [f'Kecerunan garis lurus {i("RS")} dengan {i("A")}(3, 5) dan {i("N")}(3, 0):', f'{i("m")} = {F("5 − 0", "3 − 3")} = {F(5, 0)} = Tak tertakrif', f'Garis lurus {i("RS")} sentiasa berjarak 3 unit dari paksi-{y_}.', f'Maka, persamaan garis lurus {i("RS")} ialah {x_} = 3'])], s, 2, 16),
  SV(G.svg(), 'Garis PQ selari paksi-x melalui y = 5 dan garis RS selari paksi-y melalui x = 3'))

# Contoh 14: AB y = −3x + 4, P(4, 2)
c14 = 2 - (-3) * 4
assert c14 == 14
G = plane((-1.5, 6.5), (-2.5, 8.5), box=(60, 30, 460, 440), xs=1, ys=2, gy=1)
line(G, -3, 4, c, -0.5, 2.1, f'{y_} = −3{x_} + 4', 1.1, 6.5, 'start')
line(G, -3, 14, PK, 3.5, 4.8, reveal=True)
G.pt(4, 2, f'P(4, 2)', AM, 10, -8).text(-0.4, 6.0, 'A', TX, 15).text(2.2, -2.2, 'B', TX, 15)
S(s, 'CONTOH 14', 'Garis selari melalui satu titik',
  p(f'Rajah di sebelah menunjukkan garis lurus {i("AB")} dengan persamaan {y_} = −3{x_} + 4. Tentukan persamaan garis lurus yang selari dengan {i("AB")} dan melalui titik {i("P")}(4, 2).')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'Persamaan garis lurus {i("AB")} ialah {y_} = −3{x_} + 4, maka kecerunan {i("AB")} ialah −3.', f'Garis lurus yang dikehendaki adalah selari dengan {i("AB")}, maka kecerunan, {i("m")} bagi garis lurus tersebut ialah −3.',
                f'Diberi {i("P")}(4, 2), maka, {x_} = 4 dan {y_} = 2.', f'2 = (−3)(4) + {i("c")}', f'2 = −12 + {i("c")}', f'{i("c")} = 14',
                f'Maka, persamaan garis lurus yang selari dengan {i("AB")} dan melalui titik {i("P")} ialah {y_} = −3{x_} + 14.'])], s, 1, 18),
  SV(G.svg(), 'Garis AB y = -3x + 4 dan titik P(4, 2)'))

# Contoh 15: 3x + 2y = 10, G(4, 7)
c15 = 7 - Fr(-3, 2) * 4
assert c15 == 13
S(s, 'CONTOH 15', 'Garis selari dalam bentuk ax + by = c',
  p(f'Tentukan persamaan garis lurus yang selari dengan garis lurus 3{x_} + 2{y_} = 10 dan melalui titik {i("G")}(4, 7).')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'Diberi persamaan garis lurus 3{x_} + 2{y_} = 10.', f'Maka, 2{y_} = −3{x_} + 10', f'{y_} = −{F(3, 2)}{x_} + 5', f'Kecerunan garis lurus = −{F(3, 2)}.']),
          ('', [f'Garis lurus yang dikehendaki selari, maka kecerunannya ialah −{F(3, 2)}.', f'{x_} = 4 dan {y_} = 7: 7 = (−{F(3, 2)})(4) + {i("c")}', f'7 = −6 + {i("c")}', f'{i("c")} = 13'])], s, 2, 18)
  + p(f'Maka, persamaan garis lurus yang selari dengan 3{x_} + 2{y_} = 10 dan melalui titik {i("G")} ialah {y_} = −{F(3, 2)}{x_} + 13.'))

# =====================================================================
# 9.1.6 TITIK PERSILANGAN
# =====================================================================
s = '9.1.6'
c = COL[s]
# Contoh 16: 3x + y = 7, x + 2y = −1 → (3, −2)
assert 3 * 3 + (-2) == 7 and 3 + 2 * (-2) == -1
xs = [-1, 0, 1, 2, 3, 4]
t1 = [[str(v) for v in xs], [mn(7 - 3 * v) for v in xs]]
t2 = [[str(v) for v in [-1, 1, 3, 5]], [mn(int(Fr(-1 - v, 2))) for v in [-1, 1, 3, 5]]]
G = plane((-2.5, 6.5), (-5.5, 10.5), box=(80, 30, 460, 440), xs=1, ys=2, gy=1)
line(G, -3, 7, TR, -1, 4, f'3{x_} + {y_} = 7', 0.4, 9.0, 'start')
line(G, Fr(-1, 2), Fr(-1, 2), PK, -2, 6, f'{x_} + 2{y_} = −1', 4.3, -2.4, 'start')
G.pt(3, -2, '(3, −2)', AM, -10, 22, 'end')
S(s, 'CONTOH 16', 'Titik persilangan: kaedah graf',
  p('Titik persilangan bagi dua garis lurus boleh ditentukan dengan kaedah-kaedah berikut: (1) melukis kedua-dua graf garis lurus pada satah Cartes yang sama dan tentukan titik persilangan daripada graf. (2) penyelesaian persamaan serentak dengan menggunakan (a) kaedah penggantian (b) kaedah penghapusan.')
  + p(f'Tentukan titik persilangan bagi garis lurus 3{x_} + {y_} = 7 dan garis lurus {x_} + 2{y_} = −1.')
  + table([x_] + t1[0], [[y_] + t1[1]], TR, 16)
  + table([x_] + t2[0], [[y_] + t2[1]], PK, 16)
  + p(f'Daripada graf, didapati titik persilangan ialah (3, −2).'),
  SV(G.svg(), 'Graf 3x + y = 7 dan x + 2y = -1 bersilang di (3, -2)'))
S(s, 'CONTOH 16 (sambungan)', 'Kaedah penggantian dan penghapusan',
  work([('Kaedah Penggantian', [f'3{x_} + {y_} = 7 ......①', f'{x_} + 2{y_} = −1 ......②', f'Dari ①, {y_} = 7 − 3{x_} ......③', f'Gantikan ③ dalam ②:', f'{x_} + 2(7 − 3{x_}) = −1', f'{x_} + 14 − 6{x_} = −1', f'−5{x_} = −15', f'{x_} = 3',
                                f'Gantikan {x_} = 3 dalam ③:', f'{y_} = 7 − 3(3) = −2']),
        ('Kaedah Penghapusan', [f'① × 2: 6{x_} + 2{y_} = 14 ......④', f'④ − ②: 5{x_} = 15', f'{x_} = 3', f'Gantikan {x_} = 3 dalam ①:', f'3(3) + {y_} = 7', f'{y_} = 7 − 9', f'{y_} = −2'])], s, 2, 18)
  + p('Maka, titik persilangan ialah (3, −2).')
  + note('Kalkulator hanya dibenarkan untuk menyemak jawapan.', 'Peringatan:'))

# =====================================================================
# 9.1.7 PENYELESAIAN MASALAH
# =====================================================================
s = '9.1.7'
c = COL[s]
# Contoh 17: P(−6, 4), m(PQ) = m(SR) = 1/3, PS pintasan-y −8
h17 = 4 + Fr(1, 3) * 6; mPS = Fr(-8 - 4, 0 - (-6)); xint = Fr(8, 1) / mPS
assert h17 == 6 and mPS == -2 and xint == -4
G = plane((-7.5, 5.5), (-9.5, 7.5), box=(70, 30, 460, 440), xs=2, ys=2)
Pp, Qp, Tp = (-6, 4), (0, 6), (0, -8)
Sp = (-6 + 1.6 * 1, 4 - 2 * 1.6 * 1 - 0.0)
Sp = (-2.6, 4 - 2 * 3.4)
Rp = (Sp[0] + 6, Sp[1] + 2)
G.seg(Pp, Qp, c, 3.2).seg(Qp, Rp, c, 3.2).seg(Rp, Sp, c, 3.2).seg(Sp, Pp, c, 3.2).seg(Sp, Tp, c, 2, '5 4')
G.pt(*Pp, f'P(−6, 4)', AM, -8, -14, 'end').pt(*Qp, f'Q(0, {i("h")})', AM, 10, -12).pt(*Sp, i('S'), AM, -10, 16, 'end').pt(*Rp, i('R'), AM, 10, 6).pt(*Tp, i('T'), AM, 10, 4)
S(s, 'CONTOH 17', 'Menyelesaikan masalah garis lurus',
  p(f'Rajah di sebelah menunjukkan segi empat selari {i("PQRS")}. Diberi bahawa kecerunan {i("SR")} ialah {F(1, 3)} dan pintasan-{y_} garis lurus {i("PS")} ialah −8. Tentukan (a) nilai {i("h")} (b) persamaan garis lurus {i("PS")} (c) pintasan-{x_} bagi garis lurus {i("PS")}')
  + work([('Memahami masalah', [f'• {i("PQRS")} ialah segi empat selari.', f'• Kecerunan {i("PQ")} = kecerunan {i("SR")} = {F(1, 3)}.', f'• Pintasan-{y_} {i("PS")} ialah −8.']),
          ('Merancang strategi', [f'• Nilai {i("h")} boleh ditentukan dengan menggunakan nilai kecerunan iaitu kecerunan {i("PQ")} = kecerunan {i("SR")} = {F(1, 3)}.', f'• Pintasan-{y_} garis lurus {i("PS")} ialah −8 maka, koordinat {i("T")}(0, −8).',
                                  f'• Pintasan-{x_} bagi garis lurus {i("PS")} boleh ditentukan dengan menggantikan {y_} = 0 ke dalam persamaan {i("PS")}.'])], s, 1, 15),
  SV(G.svg(), 'Segi empat selari PQRS dengan P(-6, 4) dan Q(0, h)'))
S(s, 'CONTOH 17 (sambungan)', 'Melaksanakan strategi',
  work([('(a)', [f'Kecerunan {i("PQ")} = Kecerunan {i("SR")} = {F(1, 3)}', f'{F(f"{i("h")} − 4", "0 − (−6)")} = {F(1, 3)}', f'{F(f"{i("h")} − 4", 6)} = {F(1, 3)}', f'{i("h")} − 4 = 2', f'{i("h")} = 6']),
        ('(b)', [f'Garis lurus {i("PS")} melalui titik {i("T")}(0, −8)', f'Kecerunan {i("PS")} = {F("−8 − 4", "0 − (−6)")} = {F(-12, 6)} = −2', f'Pintasan-{y_} garis lurus {i("PS")} ialah −8', f'Maka, persamaan garis lurus {i("PS")} ialah {y_} = −2{x_} − 8.']),
        ('(c)', [f'{y_} = −2{x_} − 8', f'Apabila {y_} = 0,', f'0 = −2{x_} − 8', f'2{x_} = −8', f'{x_} = −4'])], s, 3, 17)
  + work([('Membuat kesimpulan', [f'(a) Nilai {i("h")} ialah 6. (b) Persamaan garis lurus {i("PS")} ialah {y_} = −2{x_} − 8. (c) Pintasan-{x_} bagi garis lurus {i("PS")} ialah −4.'])], s, 1, 17))

# Contoh 18: y = −x/2 + 4 dan 3x − y = 10 → A(4, 2)
assert -Fr(1, 2) * 4 + 4 == 2 and 3 * 4 - 2 == 10
G = plane((-1.5, 8.5), (-5.5, 5.5), box=(60, 40, 450, 440), xs=1, ys=1, gy=1)
line(G, Fr(-1, 2), 4, TR, -1, 8.4, reveal=True)
G.add(svgfrac(G.X(4.9), G.Y(2.6), 'y = −', '1', '2', 'x + 4', TR, 15), True)
line(G, 3, -10, PK, 1.6, 5.0, f'3{x_} − {y_} = 10', 5.2, 4.8, 'start', reveal=True)
G.pt(4, 2, f'A(4, 2)', AM, -10, -14, 'end', reveal=True)
S(s, 'CONTOH 18', 'Titik persilangan dengan kaedah graf',
  p(f'Diberi garis lurus {y_} = −{F(1, 2)}{x_} + 4 dan 3{x_} − {y_} = 10 bersilang pada titik {i("A")}. Tentukan koordinat bagi titik {i("A")} dengan menggunakan kaedah graf.')
  + work([(f'Bagi {y_} = −{F(1, 2)}{x_} + 4', [f'{x_} = 0: pintasan-{y_} = 4', f'{y_} = 0: {F(1, 2)}{x_} = 4, pintasan-{x_} = 8']),
          (f'Bagi 3{x_} − {y_} = 10', [f'{x_} = 0: pintasan-{y_} = −10', f'{y_} = 0: pintasan-{x_} = {F(10, 3)}'])], s, 2, 17)
  + p(f'Dari graf, didapati koordinat {i("A")} ialah (4, 2).')
  + note(f'Suatu garis lurus boleh dilukis jika pintasan-{x_} dan pintasan-{y_} garis lurus tersebut diketahui.', 'Tip:'),
  SV(G.svg(), 'Graf dua garis lurus bersilang di A(4, 2)'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'garislurus', 'slides.js')
HEAD = '/* Nota Bab 9 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
