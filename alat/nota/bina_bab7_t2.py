"""Bab 7 T2 Koordinat: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os, math, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import Gr, mn, rv, TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "7.1", "name": "Jarak dalam Sistem Koordinat Cartes", "col": "#38BDF8"},
        {"no": "7.2", "name": "Titik Tengah dalam Sistem Koordinat Cartes", "col": "#34D399"},
        {"no": "7.3", "name": "Sistem Koordinat Cartes", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()

x_, y_ = '<i>x</i>', '<i>y</i>'


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def sq(x):
    return f'<span style="white-space:nowrap">√<span style="display:inline-block;white-space:nowrap;border-top:2px solid currentColor;padding:2px 3px 0;line-height:1.15">{x}</span></span>'


def co(a, b):
    return f'({mn(a)}, {mn(b)})'


def sub(v, k):
    return f'<i>{v}</i><sub>{k}</sub>'


X1, X2, Y1, Y2 = sub('x', 1), sub('x', 2), sub('y', 1), sub('y', 2)


def pen(s, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(s, items)


def work(blocks, s, cols=1, fs=19):
    c = COL[s]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            + ('display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;' if cols == 2 else 'display:flex;flex-direction:column;gap:10px;')
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def dist(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def right_mark(g, x, y, sx, sy, k=0.35):
    """tanda sudut tegak di (x, y); sx, sy = arah (±1) ke kaki."""
    a = g.P(x + sx * k, y); b = g.P(x + sx * k, y + sy * k); c_ = g.P(x, y + sy * k)
    return f'<path d="M{a[0]:.1f} {a[1]:.1f} L{b[0]:.1f} {b[1]:.1f} L{c_[0]:.1f} {c_[1]:.1f}" fill="none" stroke="{MU3}" stroke-width="2"/>'


# =====================================================================
# 7.1 JARAK
# =====================================================================
s = '7.1'
c = COL[s]
g0 = Gr((60, 40, 460, 420), (-4, 4), (-4, 4), equal=True, fs=12)
g0.seg((3, 0), (3, 2), AM, 2.5, '6 5').seg((0, 2), (3, 2), AM, 2.5, '6 5').pt(3, 2, '<i>P</i> (3, 2)', PK, 10, -14)
g0.pt(0, 0, '', TX).text(-0.25, -0.75, 'asalan (0, 0)', MU3, 15, 'end')
g0.text(0, -3.4, 'Koordinat (<i>x</i>, <i>y</i>): nilai <i>x</i> ditulis dahulu', TX, 16).text(1.5, 2.4, '3 unit dari paksi-<i>y</i>', AM, 14).text(3.2, 1, '2 unit', AM, 14, 'start')
S(s, 'KONSEP', 'Koordinat dan satah Cartes',
  p('Koordinat merupakan pasangan nombor yang dapat menentukan kedudukan suatu titik pada satah Cartes. Koordinat suatu titik ditentukan berdasarkan jarak dari paksi-<i>x</i>, jarak dari paksi-<i>y</i> dan asalan.')
  + bul(s, ['Satah Cartes mempunyai dua paksi. Garis mengufuk ialah paksi-<i>x</i> dan garis mencancang ialah paksi-<i>y</i>.',
            'Kedua-dua paksi tersebut akan bersilang antara satu sama lain secara serenjang. Titik persilangan tersebut ialah asalan yang merupakan permulaan nombor pada kedua-dua paksi-<i>x</i> dan paksi-<i>y</i>.',
            'Nilai nombor akan semakin besar apabila ke kanan dan ke atas, manakala nilai nombor akan semakin mengecil apabila ke kiri dan ke bawah.']),
  SV(g0.svg(), 'Satah Cartes dengan titik P(3, 2) dan asalan'))

g = Gr((50, 40, 470, 420), (0, 7), (0, 6), equal=True)
A, C, B = (1, 1), (5, 1), (5, 4)
g.seg(A, C, AM, 3, '7 6').seg(C, B, AM, 3, '7 6').add(right_mark(g, 5, 1, -1, 1))
g.seg(A, B, PK, 4)
g.pt(*A, 'A', TX, -14, -14, 'end').pt(*B, 'B', TX, 10, -12).pt(*C, 'C', TX, 10, 14)
g.text(3, 0.55, 'jarak mengufuk', AM, 15).text(5.35, 2.5, 'jarak', AM, 15, 'start').text(5.35, 2.15, 'mencancang', AM, 15, 'start')
assert dist(A, B) == 5
S(s, 'KONSEP', 'Jarak dua titik pada satah Cartes',
  de(s, 'Untuk menentukan jarak di antara dua titik pada satah Cartes, kaedah perwakilan segi tiga bersudut tegak digunakan. Kaedah ini dapat mengenal pasti jarak mengufuk dan jarak mencancang bagi dua titik pada satah Cartes.')
  + p('Perjalanan terus dari <i>A</i> ke <i>B</i> tanpa melalui <i>C</i> ialah jarak yang terpendek. Kaedah teorem Pythagoras digunakan untuk menghitung jarak <i>AB</i>, iaitu')
  + formula(f'<i>AB</i>² = <i>AC</i>² + <i>CB</i>² , <i>AB</i> = {sq("<i>AC</i>² + <i>CB</i>²")}', c)
  + note('Jarak ini dapat ditentukan daripada skala pada paksi-<i>x</i> dan paksi-<i>y</i>.', 'Ingat:'),
  SV(g.svg(), 'Titik A dan B dengan jarak mengufuk AC dan jarak mencancang CB'))

# CONTOH 1: skala
o = GF.box(14, 14, 230, 214) + GF.box(256, 14, 230, 214) + GF.box(14, 242, 230, 214) + GF.box(256, 242, 230, 214)
o += GF.T(32, 34, '(a)', c, 17, 'start') + GF.T(274, 34, '(b)', c, 17, 'start') + GF.T(32, 262, '(c)', c, 17, 'start') + GF.T(274, 262, '(d)', c, 17, 'start')
ga = Gr((60, 52, 220, 212), (-3, 3), (-3, 4), 1, 1, fs=11, equal=True); ga.pt(-1, 3, 'A', TX, -10, 0, 'end').pt(-1, -2, 'B', TX, -10, 0, 'end').seg((-1, 3), (-1, -2), PK, 3)
gb = Gr((290, 60, 466, 212), (-15, 20), (-3, 4), 5, 1, fs=11); gb.pt(-10, 2, 'P', TX, 0, -14, 'middle').pt(15, 2, 'Q', TX, 0, -14, 'middle').seg((-10, 2), (15, 2), PK, 3)
gc = Gr((50, 288, 226, 440), (-30, 30), (-3, 3), 10, 1, fs=11); gc.pt(-10, -2, 'D', TX, 0, -14, 'middle').pt(20, -2, 'E', TX, 0, -14, 'middle').seg((-10, -2), (20, -2), PK, 3)
gd = Gr((300, 288, 466, 440), (-4, 4), (-4, 10), 1, 2, fs=11); gd.pt(2, 8, 'F', TX, 10, 0).pt(2, -2, 'G', TX, 10, 0).seg((2, 8), (2, -2), PK, 3)
o += ga.svg() + gb.svg() + gc.svg() + gd.svg()
S(s, 'CONTOH 1', 'Jarak berdasarkan skala',
  p('Tentukan jarak di antara dua titik pada satah Cartes berikut.')
  + work([('(a)', ['Skala pada paksi-<i>x</i> dan paksi-<i>y</i> ialah 1 unit.', 'Jarak <i>AB</i> = 5 × 1', '= 5 unit']),
          ('(b)', ['Skala pada paksi-<i>x</i> ialah 5 unit dan paksi-<i>y</i> ialah 1 unit.', 'Jarak <i>PQ</i> = 5 × 5', '= 25 unit']),
          ('(c)', ['Skala pada paksi-<i>x</i> ialah 10 unit dan paksi-<i>y</i> ialah 1 unit.', 'Jarak <i>DE</i> = 3 × 10', '= 30 unit']),
          ('(d)', ['Skala pada paksi-<i>x</i> ialah 1 unit dan paksi-<i>y</i> ialah 2 unit.', 'Jarak <i>FG</i> = 5 × 2', '= 10 unit'])], s, 2, 16)
  + note('Skala perlu ditentukan dalam sistem koordinat Cartes. Setiap kotak diwakili suatu unit. Skala juga boleh ditulis dalam jujukan seperti 2, 4, 6, 8, ... atau 5, 10, 15, ...', 'Tahukah anda:'),
  SV(o, 'Empat satah Cartes dengan skala berlainan'))

# 7.1.2 rumus garis mengufuk/mencancang
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214)
o += GF.T(32, 36, '(i)', c, 17, 'start') + GF.T(32, 264, '(ii)', c, 17, 'start')
o += GF.arrow((80, 200), (440, 200), GF.AX, 2.5) + GF.arrow((100, 215), (100, 40), GF.AX, 2.5) + GF.T(92, 214, 'O', MU3, 15, 'end')
o += GF.L((180, 120), (380, 120), PK, 4) + '<circle cx="180" cy="120" r="6" fill="#E6EDF7"/><circle cx="380" cy="120" r="6" fill="#E6EDF7"/>'
o += GF.T(180, 95, 'A', TX, 17) + GF.T(380, 95, 'B', TX, 17) + GF.T(180, 148, f'({X1}, {Y1})', TX, 16) + GF.T(380, 148, f'({X2}, {Y1})', TX, 16)
o += GF.arrow((80, 428), (440, 428), GF.AX, 2.5) + GF.arrow((100, 443), (100, 268), GF.AX, 2.5) + GF.T(92, 442, 'O', MU3, 15, 'end')
o += GF.L((260, 300), (260, 400), PK, 4) + '<circle cx="260" cy="300" r="6" fill="#E6EDF7"/><circle cx="260" cy="400" r="6" fill="#E6EDF7"/>'
o += GF.T(245, 300, 'C', TX, 17, 'end') + GF.T(245, 400, 'D', TX, 17, 'end') + GF.T(276, 300, f'({X1}, {Y2})', TX, 16, 'start') + GF.T(276, 400, f'({X1}, {Y1})', TX, 16, 'start')
S(s, 'RUMUS', 'Rumus jarak: garis selari paksi',
  p('Jarak dapat ditentukan sekiranya,')
  + bul(s, [f'(i) dua titik mempunyai koordinat-<i>y</i> yang sama. Jarak <i>AB</i> = ({X2} − {X1}) unit',
            f'(ii) dua titik mempunyai koordinat-<i>x</i> yang sama. Jarak <i>CD</i> = ({Y2} − {Y1}) unit'])
  + note('Garis yang mempunyai koordinat-<i>y</i> yang sama selari dengan paksi-<i>x</i>. Garis yang mempunyai koordinat-<i>x</i> yang sama selari dengan paksi-<i>y</i>.', 'Ingat:'),
  SV(o, 'Garis AB mengufuk dan garis CD mencancang'))

# CONTOH 2 & 3
g = Gr((150, 40, 470, 420), (0, 8), (0, 8), equal=True, fs=12)
Aa, Cc, Bb = (2, 7), (2, 1), (7, 1)
g.seg(Aa, Cc, AM, 3).seg(Cc, Bb, AM, 3).seg(Aa, Bb, PK, 3.5).add(right_mark(g, 2, 1, 1, 1))
g.pt(*Aa, '<i>A</i> (2, <i>y</i>)', TX, 10, -12).pt(*Cc, '<i>C</i> (2, 1)', TX, -8, 18, 'middle').pt(*Bb, '<i>B</i> (<i>x</i>, 1)', TX, 0, 18, 'middle')
g.text(1.6, 4, '6 unit', AM, 15, 'end').text(4.5, 0.6, '5 unit', AM, 15)
S(s, 'CONTOH 2', 'Jarak garis mengufuk dan mencancang',
  p('Hitung jarak di antara pasangan titik berikut. (a) (−1, −3) dan (5, −3) (b) (0, 4) dan (0, −3)')
  + work([('(a)', ['Jarak di antara titik itu ialah', '= 5 − (−1)', '= 6 unit']), ('(b)', ['Jarak di antara titik itu ialah', '= 4 − (−3)', '= 7 unit'])], s, 2, 18)
  + p('<b>CONTOH 3</b> Rajah menunjukkan jarak di antara dua titik <i>A</i> dan <i>B</i>. Lengkapkan koordinat <i>A</i> dan <i>B</i>.')
  + work([('', ['<i>y</i> − 1 = 6 unit', '<i>y</i> = 6 + 1 = 7 unit', 'Maka, koordinat <i>A</i> ialah (2, 7).']), ('', ['<i>x</i> − 2 = 5 unit', '<i>x</i> = 5 + 2 = 7 unit', 'Maka, koordinat <i>B</i> ialah (7, 1).'])], s, 2, 18),
  SV(g.svg(), 'Segi tiga bersudut tegak ACB dengan AC 6 unit dan CB 5 unit'))

# 7.1.3 rumus
o = ''
g = Gr((60, 40, 470, 420), (0, 8), (0, 7), labels=False, equal=True)
P1, P2 = (1.5, 5.5), (6.5, 1.5)
g.seg(P1, (1.5, 1.5), AM, 3, '7 6').seg((1.5, 1.5), P2, AM, 3, '7 6').seg(P1, P2, PK, 4).add(right_mark(g, 1.5, 1.5, 1, 1))
g.pt(*P1, f'<i>A</i> ({X1}, {Y1})', TX, 10, -14).pt(*P2, f'<i>B</i> ({X2}, {Y2})', TX, -8, -18, 'middle')
g.text(4, 1.05, f'{X2} − {X1}', AM, 16).text(1.25, 3.5, f'{Y2} − {Y1}', AM, 16, 'end')
S(s, 'RUMUS', 'Jarak di antara dua titik pada satah',
  p('Jika garis lurus yang menyambungkan dua titik pada satah Cartes tidak selari dengan paksi-<i>x</i> atau paksi-<i>y</i>, maka jarak di antara dua titik itu dapat ditentukan dengan menggunakan teorem Pythagoras.')
  + p('Jarak <i>AB</i> merupakan jarak hipotenus. Rumus teorem Pythagoras digunakan untuk menentukan jarak di antara dua titik pada satah Cartes.')
  + formula(f'Jarak di antara dua titik pada satah Cartes = {sq(f"({X2} − {X1})² + ({Y2} − {Y1})²")}', c)
  + note(f'Teorem Pythagoras menyatakan bahawa bagi sebarang segi tiga bersudut 90° dan kuasa dua hipotenusnya adalah bersamaan dengan jumlah kuasa dua sisi yang lain: <i>c</i> = {sq("<i>a</i>² + <i>b</i>²")}', 'Imbas kembali:'),
  SV(g.svg(), 'Garis AB condong dengan jarak mengufuk x2 − x1 dan jarak mencancang y2 − y1'))

# CONTOH 4
g = Gr((80, 40, 470, 420), (0, 8), (0, 7), equal=True, fs=12)
A4, B4, C4 = (2, 6), (7, 2), (2, 2)
g.seg(A4, C4, AM, 3, '7 6').seg(C4, B4, AM, 3, '7 6').seg(A4, B4, PK, 4).add(right_mark(g, 2, 2, 1, 1))
g.pt(*A4, '<i>A</i> (2, 6)', TX, 10, -12).pt(*B4, '<i>B</i> (7, 2)', TX, 0, -18, 'middle').pt(*C4, '<i>C</i>', TX, -12, 14, 'end')
g.text(1.7, 4, '4 unit', AM, 15, 'end').text(4.5, 1.55, '5 unit', AM, 15)
assert 5 ** 2 + 4 ** 2 == 41 and f'{math.sqrt(41):.2f}' == '6.40'
S(s, 'CONTOH 4', 'Jarak di antara dua titik',
  p('Hitung jarak di antara titik <i>A</i> dengan titik <i>B</i> pada satah Cartes dalam rajah.')
  + work([('Kaedah 1', ['Lukis sebuah segi tiga bersudut tegak <i>ACB</i>. <i>AC</i> = 4 unit, <i>BC</i> = 5 unit', 'Dengan menggunakan teorem Pythagoras,', '<i>AB</i>² = <i>BC</i>² + <i>AC</i>²', '<i>AB</i>² = 5² + 4² = 25 + 16', f'<i>AB</i> = {sq("41")} = 6.40 unit']),
          ('Kaedah 2', [f'Jarak = {sq(f"({X2} − {X1})² + ({Y2} − {Y1})²")}', f'Jarak <i>AB</i> = {sq("(7 − 2)² + (2 − 6)²")}', f'= {sq("5² + (−4)²")}', f'= {sq("25 + 16")} = {sq("41")}', '= 6.40 unit',
                        'Maka, jarak <i>AB</i> ialah 6.40 unit.'])], s, 2, 17),
  SV(g.svg(), 'Titik A(2, 6) dan B(7, 2) dengan segi tiga bersudut tegak ACB'))

# CONTOH 5
o = GF.box(14, 14, 472, 200) + GF.box(14, 228, 472, 228) + GF.T(32, 34, '(a)', c, 17, 'start') + GF.T(32, 248, '(b)', c, 17, 'start')
Q_, R_, P_ = (110, 170), (390, 170), (390, 70)
o += f'<polygon points="{Q_[0]},{Q_[1]} {R_[0]},{R_[1]} {P_[0]},{P_[1]}" fill="{TR}22" stroke="{TR}" stroke-width="3.5"/>'
o += f'<path d="M376 170 L376 156 L390 156" fill="none" stroke="{MU3}" stroke-width="2"/>'
o += GF.T(96, 172, 'Q', TX, 17, 'end') + GF.T(400, 64, 'P', TX, 17, 'start') + GF.T(250, 192, '6 cm', MU3, 16) + GF.T(400, 122, '4 cm', MU3, 16, 'start')
gb = Gr((110, 262, 380, 440), (-4, 5), (-2, 6), fs=11, equal=True)
gb.seg((-3, 5), (3, -1), PK, 3.5).pt(-3, 5, '<i>P</i> (−3, 5)', TX, 8, -12).pt(3, -1, '<i>Q</i> (3, −1)', TX, 10, 0)
o += gb.svg()
assert f'{math.sqrt(52):.2f}' == '7.21' and f'{math.sqrt(72):.2f}' == '8.49'
S(s, 'CONTOH 5', 'Jarak di antara titik P dengan titik Q',
  p('Hitung jarak di antara titik <i>P</i> dengan titik <i>Q</i>.')
  + work([('(a)', ['<i>PQ</i>² = 6² + 4²', '= 36 + 16', f'<i>PQ</i> = {sq("52")}', '= 7.21 cm', 'Maka, jarak <i>PQ</i> ialah 7.21 cm.']),
          ('(b)', [f'<i>PQ</i> = {sq("[3 − (−3)]² + (−1 − 5)²")}', f'= {sq("6² + (−6)²")}', f'= {sq("36 + 36")}', f'= {sq("72")}', '= 8.49 unit', 'Maka, jarak <i>PQ</i> ialah 8.49 unit.'])], s, 2, 18),
  SV(o, 'Segi tiga bersudut tegak PQ dan titik P(−3, 5), Q(3, −1)'))

# CONTOH 6 penyelesaian masalah
g = Gr((70, 60, 470, 400), (-1, 8), (-1, 6), equal=True, fs=12)
A6, B6, C6 = (1, 1), (4, 5), (7, 1)
g.add(f'<polygon points="{" ".join(f"{g.X(a):.1f},{g.Y(b):.1f}" for a, b in (A6, B6, C6))}" fill="{TR}22" stroke="{TR}" stroke-width="3.5"/>')
g.pt(*A6, '<i>A</i> (1, 1)', TX, -6, 18, 'middle').pt(*B6, '<i>B</i> (4, 5)', TX, 0, -16, 'middle').pt(*C6, '<i>C</i> (7, 1)', TX, 6, 18, 'middle')
assert dist(A6, B6) == 5 and dist(B6, C6) == 5 and dist(A6, C6) == 6
S(s, 'CONTOH 6', 'Penyelesaian masalah',
  p('Hitung perimeter bagi sebuah segi tiga sama kaki jika bucu-bucu bagi segi tiga tersebut ialah <i>A</i> (1, 1), <i>B</i> (4, 5) dan <i>C</i> (7, 1).')
  + work([('Memahami masalah', ['<i>ABC</i> adalah segi tiga sama kaki dengan bucu-bucu <i>A</i> (1, 1), <i>B</i> (4, 5) dan <i>C</i> (7, 1).']),
          ('Merancang strategi', ['Lukis segi tiga dan tentukan titik-titik tersebut pada satah Cartes.', 'Perimeter ∆<i>ABC</i> = <i>AB</i> + <i>BC</i> + <i>AC</i>', 'Tentukan jarak <i>AC</i> dan <i>AB</i>.']),
          ('Melaksanakan strategi', [f'Jarak <i>AB</i> = {sq("3² + 4²")} = {sq("9 + 16")} = {sq("25")} = 5 unit', '<i>AB</i> = <i>BC</i> = 5 unit, <i>AC</i> = 7 − 1 = 6 unit']),
          ('Membuat kesimpulan', ['Maka, perimeter segi tiga <i>ABC</i> ialah 5 + 5 + 6 = 16 unit.'])], s, 1, 17),
  SV(g.svg(), 'Segi tiga sama kaki A(1, 1), B(4, 5), C(7, 1)'))

# CONTOH 7
g = Gr((70, 40, 470, 420), (0, 9), (0, 15), 1, 2, equal=True, fs=12)
A7, B7 = (2, 2), (7, 14)
g.seg(A7, (7, 2), AM, 3, '7 6').seg((7, 2), B7, AM, 3, '7 6').seg(A7, B7, PK, 4).add(right_mark(g, 7, 2, -1, 1, .4))
g.pt(*A7, '<i>A</i> (<i>v</i>, 2)', TX, -10, 16, 'end').pt(*B7, '<i>B</i> (7, 14)', TX, -10, -4, 'end').pt(7, 2, '<i>C</i>', TX, 10, 14)
g.text(4.1, 8.8, '13 unit', PK, 16, 'end')
assert (7 - 2) ** 2 + 12 ** 2 == 169
S(s, 'CONTOH 7', 'Mencari koordinat yang tidak diketahui',
  p('Diberi bahawa jarak <i>AB</i> = 13 unit. Hitung nilai <i>v</i>.')
  + work([('Memahami masalah', ['Menghitung nilai <i>v</i>.']),
          ('Merancang strategi', ['Jarak <i>AB</i> = 13', f'Rumus jarak = {sq(f"({X2} − {X1})² + ({Y2} − {Y1})²")}']),
          ('Melaksanakan strategi', [f'<i>AB</i> = {sq("(7 − <i>v</i>)² + (14 − 2)²")}', f'13 = {sq("(7 − <i>v</i>)² + 12²")} = {sq("(7 − <i>v</i>)² + 144")}',
                                     f'13² = (7 − <i>v</i>)² + 144, 169 − 144 = (7 − <i>v</i>)²', f'{sq("25")} = 7 − <i>v</i>, 5 = 7 − <i>v</i>, <i>v</i> = 7 − 5 = 2']),
          ('Membuat kesimpulan', ['Maka, nilai <i>v</i> ialah 2.'])], s, 1, 17),
  SV(g.svg(), 'Garis AB sepanjang 13 unit dengan A(v, 2) dan B(7, 14)'))

# =====================================================================
# 7.2 TITIK TENGAH
# =====================================================================
s = '7.2'
c = COL[s]
o = GF.L((70, 200), (430, 200), TR, 4) + '<circle cx="70" cy="200" r="7" fill="#E6EDF7"/><circle cx="430" cy="200" r="7" fill="#E6EDF7"/>'
o += f'<circle cx="250" cy="200" r="8" fill="{c}"/>' + GF.T(70, 170, '<i>A</i>', TX, 20) + GF.T(430, 170, '<i>B</i>', TX, 20) + GF.T(250, 170, '<i>M</i>', c, 20)
for xm in (160, 340):
    o += GF.L((xm - 4, 188), (xm - 4, 212), MU3, 3) + GF.L((xm + 4, 188), (xm + 4, 212), MU3, 3)
o += GF.T(160, 236, 'sama panjang', MU3, 15) + GF.T(340, 236, 'sama panjang', MU3, 15)
o += GF.L((250, 90), (250, 320), c, 2.5, '7 6') + GF.T(250, 340, 'pembahagi dua sama serenjang', c, 15)
o += GF.T(250, 400, '<i>AM</i> = <i>MB</i>', TX, 20)
S(s, 'DEFINISI', 'Titik tengah',
  p('Anda telah mempelajari cara menentukan jejari bagi suatu diameter bulatan. Adakah anda fahami konsep titik tengah?')
  + de(s, 'Titik tengah ialah titik yang membahagi dua sama suatu tembereng garis.')
  + note('Titik tengah suatu garisan boleh dikenal pasti dengan membina pembahagi dua sama serenjang bagi garisan tersebut.', 'Ingat:'),
  SV(o, 'Titik tengah M membahagi dua sama tembereng garis AB'))

# CONTOH 8
def ruler(y, pts, mid_lab=None, ticks=()):
    x0, w = 70, 360
    r = GF.L((x0, y), (x0 + w, y), PK, 3)
    for v, lb in pts:
        X = x0 + w * v / pts[-1][0]
        r += GF.L((X, y - 8), (X, y + 8), PK, 3) + GF.T(X, y - 24, f'<i>{lb}</i>', TX, 18)
    return r


o = GF.box(14, 14, 472, 200) + GF.box(14, 228, 472, 228) + GF.T(32, 34, '(a)', c, 17, 'start') + GF.T(32, 248, '(b)', c, 17, 'start')
pa = [(0, 'A'), (2, 'K'), (4, 'M'), (5, 'N'), (8, 'B')]
o += ruler(110, pa)
o += GF.rv(GF.L((70, 150), (250, 150), AM, 2) + GF.L((250, 150), (430, 150), AM, 2) + GF.T(160, 168, '4 unit', AM, 15) + GF.T(340, 168, '4 unit', AM, 15) + f'<circle cx="250" cy="110" r="8" fill="{c}"/>')
pb = [(0, 'A'), (3, 'D'), (6, 'B'), (9, 'C')]
o += ruler(330, pb)
for xm in (70 + 360 * 1.5 / 9, 70 + 360 * 4.5 / 9):
    o += GF.L((xm - 4, 320), (xm - 4, 340), MU3, 2.5) + GF.L((xm + 4, 320), (xm + 4, 340), MU3, 2.5)
o += GF.rv(f'<circle cx="{70 + 360 * 3 / 9:.1f}" cy="330" r="8" fill="{c}"/>' + GF.T(190, 380, '<i>AD</i> = <i>DB</i>', AM, 17))
S(s, 'CONTOH 8', 'Titik tengah bagi garis lurus',
  p('Tentukan titik tengah bagi garis lurus <i>AB</i>.')
  + pen(s, ['(a) Titik tengah bagi garis lurus <i>AB</i> ialah <i>M</i>.', '(b) Titik tengah bagi garis lurus <i>AB</i> ialah <i>D</i>.'])
  + note('Garis lurus <i>AB</i> dalam (b) dibahagikan oleh titik <i>D</i> kepada dua bahagian yang sama panjang.', 'Nota:'),
  SV(o, 'Dua garis lurus AB dengan titik-titik di atasnya'))

# CONTOH 9
g = Gr((60, 40, 470, 420), (0, 8), (0, 7), equal=True, fs=12)
A9, B9, C9 = (1, 6), (7, 2), (1, 2)
g.seg(A9, C9, TR, 3).seg(C9, B9, TR, 3).seg(A9, B9, PK, 3.5).add(right_mark(g, 1, 2, 1, 1))
g.pt(*A9, '<i>A</i>', TX, 10, -10).pt(*B9, '<i>B</i>', TX, 10, -10).pt(*C9, '<i>C</i>', TX, -10, 14, 'end')
g.seg((-0.4 + 0, 4), (1.8, 4), GR, 2.5, reveal=True)
g.seg((4, 0.4), (4, 6.6), GR, 2.5, reveal=True)
g.pt(4, 4, '<i>P</i> (4, 4)', c, 10, -14, reveal=True)
assert ((1 + 7) / 2, (6 + 2) / 2) == (4, 4)
S(s, 'CONTOH 9', 'Membina titik tengah',
  p('<i>P</i> ialah titik tengah bagi garis lurus <i>AB</i>. Tentukan koordinat <i>P</i>.')
  + pen(s, ['Langkah 1: Tentukan titik tengah bagi garis lurus <i>AC</i> dan <i>BC</i>.', 'Langkah 2: Lukis pembahagi dua sama serenjang bagi <i>AC</i> dan <i>BC</i>.',
            'Langkah 3: Persilangan di antara pembahagi dua sama serenjang <i>AC</i> dan pembahagi dua sama serenjang <i>BC</i> merupakan titik tengah bagi garis <i>AB</i>.',
            'Langkah 4: Maka, titik <i>P</i> ialah (4, 4).']),
  SV(g.svg(), 'Garis AB dengan A(1, 6), B(7, 2) dan pembahagi dua sama serenjang'))

# rumus titik tengah
g = Gr((60, 40, 470, 420), (0, 8), (0, 6), equal=True, fs=12)
A_, B_ = (1, 1), (7, 5)
g.seg(A_, B_, PK, 4).seg(A_, (7, 1), AM, 2.5, '7 6').seg((7, 1), B_, AM, 2.5, '7 6')
g.seg((4, 1), (4, 3), GR, 2.5, '5 5').seg((7, 3), (4, 3), GR, 2.5, '5 5')
g.pt(*A_, '<i>A</i> (1, 1)', TX, 0, 18, 'middle').pt(*B_, '<i>B</i> (7, 5)', TX, -10, -14, 'end').pt(4, 3, '<i>M</i> (4, 3)', c, -10, -14, 'end')
assert ((1 + 7) / 2, (1 + 5) / 2) == (4, 3)
S(s, 'RUMUS', 'Rumus titik tengah',
  p('Titik tengah bagi suatu garis yang condong dapat ditentukan dengan mengenal pasti jarak mengufuk dan jarak mencancang yang masing-masing dibahagikan kepada dua.')
  + formula(f'Titik tengah = ({fr(f"{X1} + {X2}", 2)}, {fr(f"{Y1} + {Y2}", 2)})', c)
  + p('Kedudukan titik tengah dapat ditunjukkan dengan pembinaan pembahagi dua sama serenjang. Persilangan di antara pembahagi dua sama serenjang dengan tembereng garis dapat menentukan koordinat titik tengah pada satah Cartes.')
  + p(f'<i>M</i> = ({fr("1 + 7", 2)}, {fr("1 + 5", 2)}) = (4, 3)'),
  SV(g.svg(), 'Titik tengah M(4, 3) bagi garis A(1, 1) dan B(7, 5)'))

# CONTOH 10 & 11
o = GF.box(14, 14, 230, 442) + GF.box(256, 14, 230, 442) + GF.T(32, 36, '(10)', c, 16, 'start') + GF.T(274, 36, '(11)', c, 16, 'start')
ga = Gr((50, 70, 226, 420), (0, 5), (0, 7), fs=11, equal=True)
ga.seg((3, 6), (3, 2), PK, 3.5).pt(3, 6, '<i>A</i> (3, 6)', TX, 8, -12).pt(3, 2, '<i>B</i> (3, 2)', TX, 8, 12).pt(3, 4, '(3, 4)', c, 8, 0, reveal=True)
gb = Gr((290, 70, 470, 420), (0, 13), (0, 9), 4, 2, fs=11)
gb.seg((12, 8), (2, 2), PK, 3.5).seg((2, 2), (12, 2), TR, 2.5, '6 5').seg((12, 2), (12, 8), TR, 2.5, '6 5')
gb.pt(12, 8, '<i>M</i>', TX, -10, -12, 'end').pt(2, 2, '<i>N</i>', TX, -4, -16, 'end').pt(7, 5, '(7, 5)', c, -8, -14, 'end', reveal=True)
gb.add(GF.T(gb.X(2), gb.B + 16, '2', GF.MU, 11) + GF.T(gb.X(12), gb.B + 16, '12', GF.MU, 11) + GF.T(gb.L - 7, gb.Y(8), '8', GF.MU, 11, 'end') + GF.L((gb.L, gb.Y(8)), (gb.X(12), gb.Y(8)), GF.MU, 1.5, '4 4'))
o += ga.svg() + gb.svg()
S(s, 'CONTOH 10', 'Koordinat titik tengah',
  p('<b>10.</b> Hitung koordinat titik tengah bagi garis lurus <i>AB</i> dengan <i>A</i>(3, 6) dan <i>B</i>(3, 2). <b>11.</b> Hitung koordinat titik tengah bagi garis lurus <i>MN</i> dengan <i>M</i>(12, 8) dan <i>N</i>(2, 2).')
  + work([('10.', [f'<i>A</i> (3, 6) ialah ({X1}, {Y1}) dan <i>B</i> (3, 2) ialah ({X2}, {Y2})', f'Titik tengah <i>AB</i> = ({fr(f"{X1} + {X2}", 2)}, {fr(f"{Y1} + {Y2}", 2)})',
                  f'= ({fr("3 + 3", 2)}, {fr("6 + 2", 2)}) = ({fr(6, 2)}, {fr(8, 2)})', '= (3, 4)', 'Maka, titik tengah <i>AB</i> ialah (3, 4).']),
          ('11.', [f'<i>M</i> (12, 8) ialah ({X1}, {Y1}) dan <i>N</i> (2, 2) ialah ({X2}, {Y2})', f'Titik tengah <i>MN</i> = ({fr("12 + 2", 2)}, {fr("8 + 2", 2)})',
                  f'= ({fr(14, 2)}, {fr(10, 2)})', '= (7, 5)', 'Maka, titik tengah <i>MN</i> ialah (7, 5).'])], s, 2, 17),
  SV(o, 'Garis AB mencancang dan garis MN condong'))

# CONTOH 12
g = Gr((80, 40, 470, 420), (-5, 5), (-1, 7), equal=True, fs=12)
P12, A12, Q12 = (-4, 6), (0, 3), (4, 0)
g.seg(P12, Q12, TR, 3.5).pt(*P12, '<i>P</i> (<i>x</i>, <i>y</i>)', TX, -4, -16, 'middle').pt(*A12, '<i>A</i> (0, 3)', TX, -10, 14, 'end').pt(*Q12, '<i>Q</i> (4, 0)', TX, -4, -16)
g.seg((0, 3), (4, 3), AM, 2.5, '6 5').seg((4, 3), Q12, AM, 2.5, '6 5').seg((-4, 6), (0, 6), AM, 2.5, '6 5').seg((0, 6), (0, 3), AM, 2.5, '6 5')
g.text(2.4, 2.65, '4 unit', AM, 14).text(4.2, 1.5, '3 unit', AM, 14, 'start').text(-2, 5.65, '4 unit', AM, 14).text(0.2, 4.5, '3 unit', AM, 14, 'start')
S(s, 'CONTOH 12', 'Penyelesaian masalah',
  p('Rajah menunjukkan garis <i>PAQ</i> pada suatu satah Cartes. <i>A</i> ialah titik tengah bagi garis lurus <i>PQ</i>. Tentukan koordinat <i>P</i>.')
  + work([('Memahami masalah', ['Diketahui jarak <i>AP</i> = <i>AQ</i>. Katakan <i>P</i> = (<i>x</i>, <i>y</i>).']),
          ('Merancang strategi', ['Jarak <i>AP</i> = <i>AQ</i>, maka jarak mengufuk dan mencancang adalah sama.']),
          ('Melaksanakan strategi', ['Hitung kedudukan mengufuk dan mencancang bermula dengan titik <i>A</i> yang masing-masing 4 unit dan 3 unit.',
                                     f'Titik tengah, <i>A</i> (0, 3): {fr("<i>x</i> + 4", 2)} = 0, {fr("<i>y</i> + 0", 2)} = 3', '<i>x</i> + 4 = 0, <i>x</i> = −4 ; <i>y</i> = 6']),
          ('Membuat kesimpulan', ['Maka koordinat <i>P</i> ialah (−4, 6).'])], s, 1, 17),
  SV(g.svg(), 'Garis PAQ dengan A(0, 3) titik tengah dan Q(4, 0)'))

# CONTOH 13
g = Gr((80, 40, 470, 420), (-5, 7), (0, 11), 1, 1, equal=True, fs=12)
K13, P13, L13 = (-4, 10), (1, 7), (6, 4)
g.seg(K13, L13, TR, 3.5).pt(*K13, '<i>K</i> (−4, 10)', TX, 10, -12).pt(*P13, '<i>P</i> (1, 7)', c, 10, -12).pt(*L13, '<i>L</i> (6, 4)', TX, -6, 18, 'middle', reveal=True)
assert ((-4 + 6) / 2, (10 + 4) / 2) == (1, 7)
S(s, 'CONTOH 13', 'Mencari titik hujung',
  p('Titik <i>P</i> ialah titik tengah bagi garis lurus <i>KL</i>. Diberi koordinat <i>K</i> ialah (−4, 10) dan koordinat <i>P</i> ialah (1, 7). Hitung koordinat <i>L</i>.')
  + work([('', [f'<i>K</i> (−4, 10) ialah ({X1}, {Y1}) dan <i>L</i> ({X2}, {Y2})', f'Titik tengah, <i>P</i> = ({fr(f"−4 + {X2}", 2)}, {fr(f"10 + {Y2}", 2)})',
                f'(1, 7) = ({fr(f"−4 + {X2}", 2)}, {fr(f"10 + {Y2}", 2)})', f'{fr(f"−4 + {X2}", 2)} = 1 , {fr(f"10 + {Y2}", 2)} = 7',
                f'−4 + {X2} = 2 , 10 + {Y2} = 14', f'{X2} = 6 , {Y2} = 4', 'Maka, koordinat <i>L</i> ialah (6, 4).'])], s, 1, 19),
  SV(g.svg(), 'Garis KL dengan titik tengah P(1, 7)'))

# =====================================================================
# 7.3 SISTEM KOORDINAT CARTES
# =====================================================================
s = '7.3'
c = COL[s]
g = Gr((60, 40, 470, 420), (0, 15), (0, 9), 2, 1, gx=1, equal=True, fs=12)
D14, B14, A14, C14 = (2, 3), (14, 8), (8, 8), (8, 3)
g.add(f'<polygon points="{" ".join(f"{g.X(a):.1f},{g.Y(b):.1f}" for a, b in (A14, B14, C14, D14))}" fill="{TR}22" stroke="{TR}" stroke-width="3.5"/>')
g.seg(A14, C14, AM, 2.5, '7 6')
g.pt(*D14, '<i>D</i>', TX, -10, -10, 'end').pt(*B14, '<i>B</i> (14, 8)', TX, -10, -16, 'end').pt(*A14, '<i>A</i>', TX, 0, -16, 'middle').pt(*C14, '<i>C</i>', TX, 6, 18, 'start')
g.add(GF.T(g.L - 7, g.Y(3), '', TX))
assert B14[0] - D14[0] == 2 * 6 and ((8 + 8) / 2, (8 + 3) / 2) == (8, 5.5)
S(s, 'CONTOH 14', 'Menyelesaikan masalah koordinat',
  p('Rajah menunjukkan sebuah segi empat selari <i>ABCD</i> dengan <i>D</i> (2, 3). Diberi jarak di antara titik <i>A</i> dengan <i>B</i> ialah 6 unit. Hitung')
  + bul(s, ['(a) koordinat <i>A</i>.', '(b) titik tengah garis lurus <i>AC</i>.'])
  + note('<i>AB</i> selari dengan paksi-<i>x</i> dan <i>AC</i> selari dengan paksi-<i>y</i>.', 'Nota:'),
  SV(g.svg(), 'Segi empat selari ABCD dengan B(14, 8) dan D(2, 3)'))

S(s, 'CONTOH 14 (sambungan)', 'Penyelesaian',
  work([('(a) Memahami masalah', ['Tentukan titik <i>A</i> apabila <i>AB</i> selari dengan <i>DC</i>.']),
        ('Merancang strategi', ['Garis lurus <i>AB</i> selari dengan paksi-<i>x</i>. Koordinat-<i>y</i> bagi titik <i>A</i> ialah 8.']),
        ('Melaksanakan strategi', ['Jarak <i>AB</i> = 6 unit.', 'Koordinat-<i>x</i> = 14 − 6 = 8']),
        ('Membuat kesimpulan', ['Maka, koordinat <i>A</i> ialah (8, 8).'])], s),
  work([('(b) Memahami masalah', ['Garis lurus <i>AC</i> selari dengan paksi-<i>y</i>. Titik <i>A</i> dan titik <i>C</i> mempunyai koordinat-<i>x</i> yang sama, iaitu 8.']),
        ('Merancang strategi', [f'Rumus titik tengah = ({fr(f"{X1} + {X2}", 2)}, {fr(f"{Y1} + {Y2}", 2)})']),
        ('Melaksanakan strategi', ['<i>A</i> (8, 8) <i>C</i> (8, 3)', f'({fr("8 + 8", 2)}, {fr("8 + 3", 2)}) = (8, 5.5)']),
        ('Membuat kesimpulan', ['Maka, titik tengah garis lurus <i>AC</i> ialah (8, 5.5).'])], s))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'koordinat', 'slides.js')
HEAD = '/* Nota Bab 7 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
