"""Bab 8 T2 Graf Fungsi: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os, math, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import Gr, mn, TR, PA, PU, AM, PK, GR, MU3, TX, arrow_diagram

SUBS = [{"no": "8.1", "name": "Fungsi", "col": "#A78BFA"}, {"no": "8.2", "name": "Graf Fungsi", "col": "#38BDF8"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
x_, y_ = '<i>x</i>', '<i>y</i>'


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def pen(s, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(s, items)


def work(blocks, s, cols=1, fs=19):
    c = COL[s]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:16px 20px;'
            + (f'display:grid;grid-template-columns:repeat({cols},1fr);gap:10px 18px;' if cols > 1 else 'display:flex;flex-direction:column;gap:8px;')
            + f'font-size:{fs}px;line-height:1.45">' + ''.join(out) + '</div>')


def tv(xs, ys, c, hide=(), rvrow=False, fs=18):
    """jadual nilai dua baris. hide = indeks lajur y yang dikosongkan."""
    td = f'padding:6px 10px;text-align:center;font-size:{fs}px;font-weight:600;border:1px solid #22304A'
    th = f'padding:6px 10px;text-align:center;font-size:{fs}px;font-weight:800;color:{c};border:1px solid #22304A;background:#0E1626'
    r1 = f'<tr><th style="{th}"><i>x</i></th>' + ''.join(f'<td style="{td}">{mn(v)}</td>' for v in xs) + '</tr>'
    r2 = f'<tr{" class=\"rv\"" if rvrow else ""}><th style="{th}"><i>y</i></th>' + ''.join(f'<td style="{td}">{"" if i in hide else mn(v)}</td>' for i, v in enumerate(ys)) + '</tr>'
    return f'<div class="sl-table" style="width:100%;margin:2px 0"><table style="border-collapse:collapse;background:#131C2E;width:100%">{r1}{r2}</table></div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def r2(v):
    return round(v + 1e-12, 2)


def read(g, x, y, col=AM, reveal=True, tox=True, toy=True):
    o = ''
    if toy:
        o += GF.L(g.P(x, y), (g.X(x), g.Y(0) if g.y0 <= 0 <= g.y1 else g.B), col, 2.5, '6 5')
    if tox:
        o += GF.L(g.P(x, y), (g.X(0) if g.x0 <= 0 <= g.x1 else g.L, g.Y(y)), col, 2.5, '6 5')
    o += f'<circle cx="{g.X(x):.1f}" cy="{g.Y(y):.1f}" r="6" fill="{col}"/>'
    return g.add(o, reveal)


# =====================================================================
# 8.1 FUNGSI
# =====================================================================
s = '8.1'
c = COL[s]
o = arrow_diagram(250, 80, 260, [8, 27, 64], [2, 3, 4], [(0, 0), (1, 1), (2, 2)], 'Input', 'Output', '∛', PU, PK, 340, 'Set <i>A</i>', 'Set <i>B</i>', 20)
o += GF.T(250, 410, 'Setiap input mempunyai hanya satu output', MU3, 17, halo=False)
S(s, 'DEFINISI', 'Hubungan dan fungsi',
  de(s, 'Hubungan ialah padanan unsur dari set <i>A</i> kepada set <i>B</i>.')
  + p('Hubungan dapat diwakili dengan menggunakan')
  + bul(s, ['(a) rajah anak panah', '(b) graf', '(c) pasangan tertib'])
  + de(s, 'Fungsi merupakan hubungan setiap input mempunyai hanya satu output.'),
  SV(o, 'Rajah anak panah punca kuasa tiga: 8 ke 2, 27 ke 3, 64 ke 4'))

# CONTOH 1
A1, B1 = [1, 2, 3, 4], [3, 4, 5, 6]
o = arrow_diagram(250, 50, 170, A1, B1, [(i, i) for i in range(4)], 'Set <i>A</i>', 'Set <i>B</i>', '<i>f</i> : tambah 2', PU, PK, 300, '', '', 17)
g = Gr((150, 268, 400, 440), (0, 5), (0, 7), 1, 1, xl='Set <i>A</i>', yl='Set <i>B</i>', fs=11)
for a, b in zip(A1, B1):
    g.pt(a, b, '', PK, r=5)
o += g.svg() + GF.T(30, 40, '(a)', c, 17, 'start') + GF.T(30, 262, '(b)', c, 17, 'start')
S(s, 'CONTOH 1', 'Perwakilan hubungan',
  p('Hubungan <i>f</i> : tambah 2 dari set <i>A</i> = {1, 2, 3, 4} kepada set <i>B</i> = {3, 4, 5, 6} boleh diwakili dengan')
  + bul(s, ['(a) Rajah anak panah', '(b) Graf', '(c) Pasangan tertib <i>P</i> = {(1, 3), (2, 4), (3, 5), (4, 6)}'])
  + note('<i>x</i> memetakan ke <i>f</i>(<i>x</i>). Hubungan di atas ialah fungsi \'tambah 2\', ditulis dengan tatatanda berikut: <i>f</i> : <i>x</i> → <i>x</i> + 2 atau <i>f</i>(<i>x</i>) = <i>x</i> + 2', 'Tahukah anda:'),
  SV(o, 'Rajah anak panah dan graf bagi fungsi tambah 2'))

# CONTOH 2 (a)(b): fungsi
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214)
o += GF.T(32, 36, '(a)', c, 17, 'start') + GF.T(32, 264, '(b)', c, 17, 'start')
o += arrow_diagram(250, 58, 150, [1, 2, 3, 4], [3, 6, 9, 12], [(i, i) for i in range(4)], '<i>P</i>', '<i>Q</i>', '<i>f</i> : darab 3', PU, PK, 260, fs=16)
o += arrow_diagram(250, 286, 150, [10, 15, 25], [5], [(0, 0), (1, 0), (2, 0)], '<i>P</i>', '<i>Q</i>', '<i>f</i> : gandaan', PU, PK, 260, fs=16)
S(s, 'CONTOH 2', 'Hubungan yang menghasilkan fungsi',
  p('Terdapat dua jenis hubungan yang menghasilkan fungsi.')
  + p(f'<b style="color:{c}">(a) Fungsi satu kepada satu</b> ialah hubungan yang mana objek dalam domain mempunyai hanya satu imej.')
  + p('Pasangan tertib, <i>A</i> = {(1, 3), (2, 6), (3, 9), (4, 12)}')
  + p(f'<b style="color:{c}">(b) Fungsi banyak kepada satu</b> ialah hubungan yang lebih dari satu objek dihubungkan dengan imej yang sama.')
  + p('Pasangan tertib, <i>B</i> = {(10, 5), (15, 5), (25, 5)}'),
  SV(o, 'Rajah anak panah fungsi satu kepada satu dan banyak kepada satu'))

# CONTOH 2 (c)(d): bukan fungsi
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214)
o += GF.T(32, 36, '(c)', c, 17, 'start') + GF.T(32, 264, '(d)', c, 17, 'start')
o += arrow_diagram(250, 58, 150, [2, 5], [4, 5, 10, 15], [(0, 0), (0, 2), (1, 1), (1, 2), (1, 3)], '<i>P</i>', '<i>Q</i>', '<i>f</i> : faktor', PU, PK, 260, fs=16)
o += arrow_diagram(250, 286, 150, [12, 20, 30], [2, 5, 6], [(0, 0), (0, 2), (1, 0), (1, 1), (2, 0), (2, 1), (2, 2)], '<i>P</i>', '<i>Q</i>', '<i>f</i> : dibahagi', PU, PK, 260, fs=16)
assert all(b % a == 0 for a, b in [(2, 4), (2, 10), (5, 5), (5, 10), (5, 15)]) and all(a % b == 0 for a, b in [(12, 2), (12, 6), (20, 2), (20, 5), (30, 2), (30, 5), (30, 6)])
S(s, 'CONTOH 2 (sambungan)', 'Hubungan yang bukan fungsi',
  p('Terdapat dua jenis hubungan yang bukan fungsi.')
  + p(f'<b style="color:{c}">(c) Hubungan satu kepada banyak</b> ialah hubungan yang mana objek dalam domain mempunyai lebih dari satu imej.')
  + p('Pasangan tertib, <i>R</i> = {(2, 4), (2, 10), (5, 5), (5, 10), (5, 15)}')
  + p(f'<b style="color:{c}">(d) Hubungan banyak kepada banyak</b> ialah hubungan yang mana sekurang-kurangnya satu objek mempunyai lebih dari satu imej dan lebih dari satu objek mempunyai imej yang sama.')
  + p('Pasangan tertib, <i>S</i> = {(12, 2), (12, 6), (20, 2), (20, 5), (30, 2), (30, 5), (30, 6)}'),
  SV(o, 'Rajah anak panah hubungan satu kepada banyak dan banyak kepada banyak'))

# Perwakilan fungsi
o = arrow_diagram(250, 90, 250, [4, 9, 16, 25], [1, 2, 3, 4, 5], [(0, 1), (1, 2), (2, 3), (3, 4)], '<i>P</i>', '<i>Q</i>', '<i>f</i>', PU, PK, 320, 'Domain', 'Kodomain', 19)
S(s, 'KONSEP', 'Perwakilan fungsi',
  p(f'Rajah menunjukkan fungsi, <i>f</i> yang memetakan <i>x</i> kepada √<i>x</i> yang ditulis sebagai <i>f</i>(<i>x</i>) = √<i>x</i>.')
  + de(s, 'Set <i>P</i> = {4, 9, 16, 25} ialah domain dan unsur-unsurnya dinamakan objek. Set <i>Q</i> = {1, 2, 3, 4, 5} ialah kodomain. Unsur-unsur dalam set <i>Q</i> yang dihubungkan kepada objek dalam set <i>P</i> dinamakan imej. Julat bagi fungsi itu ialah {2, 3, 4, 5}.')
  + note('Fungsi boleh diwakili dalam bentuk pasangan tertib, jadual, graf dan persamaan.', 'Ingat:'),
  SV(o, 'Fungsi punca kuasa dua dari domain P ke kodomain Q'))

# CONTOH 3
g = Gr((150, 60, 400, 400), (0, 4), (0, 7), 1, 1, fs=13)
for a in (1, 2, 3):
    g.pt(a, 2 * a, f'({a}, {2 * a})', PK, 10, -12, reveal=True)
S(s, 'CONTOH 3', 'Mewakilkan fungsi',
  p('Diberi set <i>P</i> = {1, 2, 3} dan set <i>Q</i> = {2, 4, 6}. Fungsi, <i>f</i> yang memetakan set <i>P</i> kepada set <i>Q</i> ialah mendarab 2. Wakilkan hubungan di atas menggunakan (a) pasangan tertib (b) jadual (c) graf (d) persamaan.')
  + work([('(a)', ['{(1, 2), (2, 4), (3, 6)}']),
          ('(b)', ['<i>P</i> : 1, 2, 3 → <i>Q</i> : 2, 4, 6']),
          ('(c)', ['Graf di sebelah.']),
          ('(d)', ['2 = 2 × 1, 4 = 2 × 2, 6 = 2 × 3', '<i>y</i> = 2<i>x</i> atau <i>f</i>(<i>x</i>) = 2<i>x</i>'])], s, 2, 18)
  + p('Fungsi yang memetakan <i>x</i> kepada <i>y</i> boleh ditulis menggunakan tatatanda fungsi iaitu <i>f</i>(<i>x</i>). Maka, fungsi ini boleh ditulis sebagai <i>f</i>(<i>x</i>) = 2<i>x</i>.'),
  SV(g.svg(), 'Graf fungsi darab 2 dengan titik (1, 2), (2, 4), (3, 6)'))

# =====================================================================
# 8.2 GRAF FUNGSI
# =====================================================================
s = '8.2'
c = COL[s]
g = Gr((80, 50, 450, 420), (-2, 3), (-3, 7), 1, 1, fs=12)
for a in range(-2, 4):
    g.pt(a, 2 * a + 1, f'({mn(a)}, {mn(2 * a + 1)})', PK, 10, 0)
S(s, 'KONSEP', 'Graf fungsi dan jadual nilai',
  p('Kita telah mempelajari bahawa perwakilan fungsi boleh dibuat dalam bentuk graf. Graf fungsi ialah perwakilan fungsi pada satah Cartes. Dengan melukis graf, kita dapat menjelaskan hubungan antara pemboleh ubah dalam fungsi tersebut. Graf ini juga akan membantu kita mengenal pasti beberapa maklumat bagi menyelesaikan masalah.')
  + de(s, 'Daripada fungsi yang diberikan, suatu <b>jadual nilai</b> dapat dibina untuk menentukan <b>pasangan tertib</b> (<i>x</i>, <i>y</i>) yang sepadan sebelum graf dilukiskan.')
  + tv(list(range(-2, 4)), [2 * a + 1 for a in range(-2, 4)], c),
  SV(g.svg(), 'Pasangan tertib bagi y = 2x + 1 diplot pada satah Cartes'))

g = Gr((80, 50, 450, 420), (-2, 3), (-3, 7), 1, 1, fs=12)
g.curve(lambda v: 2 * v + 1, -2, 3, PK, 3.5, 2)
for a in range(-2, 4):
    g.pt(a, 2 * a + 1, '', PK)
g.text(1.6, 6.2, '<i>y</i> = 2<i>x</i> + 1', PK, 17, 'end')
S(s, 'KONSEP', 'Langkah-langkah melukis graf',
  p('Seterusnya, pasangan tertib (<i>x</i>, <i>y</i>) tadi boleh diplotkan pada satah Cartes mengikut skala yang diberikan. Kemudian, titik-titik ini disambungkan untuk membentuk graf. Bagi memudahkan graf fungsi dibina, kita boleh mengikuti langkah-langkah ini.')
  + steps(s, ['Bina jadual nilai bagi fungsi yang diberikan.', 'Lukis setiap paksi dengan skala yang diberikan atau dengan skala yang sesuai.',
              'Plotkan titik (<i>x</i>, <i>y</i>) bagi pasangan tertib daripada jadual nilai.', 'Sambung titik-titik itu dengan garis lurus atau lengkung yang licin.']),
  SV(g.svg(), 'Graf garis lurus y = 2x + 1'))

# CONTOH 4
fa = lambda v: 4 - v
fb = lambda v: 2 * v * v - 3
xa, xb = [-2, -1, 0, 1], [-1, 0, 1, 2]
assert [fa(v) for v in xa] == [6, 5, 4, 3] and [fb(v) for v in xb] == [-1, -3, -1, 5]
S(s, 'CONTOH 4', 'Membina jadual nilai',
  p('(a) Bina satu jadual nilai bagi fungsi <i>y</i> = 4 − <i>x</i>, bagi nilai <i>x</i> = −2, −1, 0, 1. (b) Bina satu jadual nilai bagi fungsi <i>y</i> = 2<i>x</i>² − 3, bagi nilai <i>x</i> = −1 hingga 2.')
  + work([('(a)', ['Apabila <i>x</i> = −2<br><i>y</i> = 4 − (−2) = 6', 'Apabila <i>x</i> = −1<br><i>y</i> = 4 − (−1) = 5', 'Apabila <i>x</i> = 0<br><i>y</i> = 4 − 0 = 4', 'Apabila <i>x</i> = 1<br><i>y</i> = 4 − 1 = 3']),
          ('(b)', ['Apabila <i>x</i> = −1<br><i>y</i> = 2(−1)² − 3 = −1', 'Apabila <i>x</i> = 0<br><i>y</i> = 2(0)² − 3 = −3', 'Apabila <i>x</i> = 1<br><i>y</i> = 2(1)² − 3 = −1', 'Apabila <i>x</i> = 2<br><i>y</i> = 2(2)² − 3 = 5'])], s, 2, 17),
  '<div style="width:100%;display:flex;flex-direction:column;gap:10px;align-self:flex-start">'
  + f'<div class="rv"><b style="color:{c}">(a)</b> Maka, jadual nilai bagi fungsi <i>y</i> = 4 − <i>x</i> ialah' + tv(xa, [fa(v) for v in xa], c) + '</div>'
  + f'<div class="rv"><b style="color:{c}">(b)</b> Maka, jadual nilai bagi fungsi <i>y</i> = 2<i>x</i>² − 3 ialah' + tv(xb, [fb(v) for v in xb], c) + '</div>'
  + note('Gunakan kalkulator untuk menghitung nilai bagi jadual nilai.', 'Tip:') + '</div>')


def graph_slide(kick, title, fn, xs, yr, ys, sx, sy, eq, ql, hide, comp, tip, tiplb='Tip:', gx=None, label_pts=True, extra_note=''):
    vals = [fn(v) for v in xs]
    g = Gr((80, 40, 455, 430), (xs[0], xs[-1]), yr, 1, ys, fs=12)
    g.curve(fn, xs[0], xs[-1], PK, 3.5, 400, reveal=True)
    for v, w in zip(xs, vals):
        g.pt(v, w, '', PK)
    g.text(xs[-1], yr[1] - (yr[1] - yr[0]) * 0.04, eq, PK, 17, 'end')
    body = (p(f'(a) Lengkapkan jadual nilai di bawah bagi fungsi {eq}.') + tv(xs, vals, c, hide, fs=16)
            + p(f'(b) Dengan menggunakan skala {sx} pada paksi-<i>x</i> dan {sy} pada paksi-<i>y</i>, lukis graf bagi fungsi itu untuk {ql}.')
            + work([('', [ln]) for ln in comp], s, 3, 15)
            + (note(tip, tiplb) if tip else ''))
    return vals, g, body


# CONTOH 5 linear
f5 = lambda v: 2 * v + 1
x5 = [-2, -1, 0, 1, 2, 3]
v5, g5, b5 = graph_slide('CONTOH 5', '', f5, x5, (-4, 8), 2, '2 cm kepada 1 unit', '2 cm kepada 2 unit', '<i>y</i> = 2<i>x</i> + 1', '−2 ≤ <i>x</i> ≤ 3', (1, 2, 4),
                         ['Apabila <i>x</i> = −1<br><i>y</i> = 2(−1) + 1 = −1', 'Apabila <i>x</i> = 0<br><i>y</i> = 2(0) + 1 = 1', 'Apabila <i>x</i> = 2<br><i>y</i> = 2(2) + 1 = 5'],
                         'Graf ini disebut juga sebagai graf fungsi linear, kuasa tertinggi bagi pemboleh ubah <i>x</i> ialah 1.')
assert v5 == [-3, -1, 1, 3, 5, 7]
S(s, 'CONTOH 5', 'Graf fungsi linear', b5, SV(g5.svg(), 'Graf garis lurus y = 2x + 1 untuk −2 ≤ x ≤ 3'))

# CONTOH 6 kuadratik
f6 = lambda v: v * v - 2 * v - 8
x6 = [-2, -1, 0, 1, 2, 3, 4]
v6, g6, b6 = graph_slide('CONTOH 6', '', f6, x6, (-10, 2), 2, '2 cm kepada 1 unit', '2 cm kepada 2 unit', '<i>y</i> = <i>x</i>² − 2<i>x</i> − 8', '−2 ≤ <i>x</i> ≤ 4', (1, 3, 5),
                         ['Apabila <i>x</i> = −1<br><i>y</i> = (−1)² − 2(−1) − 8 = −5', 'Apabila <i>x</i> = 1<br><i>y</i> = 1² − 2(1) − 8 = −9', 'Apabila <i>x</i> = 3<br><i>y</i> = 3² − 2(3) − 8 = −5'],
                         'Bentuk graf ini dipanggil bentuk parabola. Bagi fungsi kuadratik <i>f</i>(<i>x</i>) = <i>ax</i>² + <i>bx</i> + <i>c</i>, kuasa tertinggi bagi pemboleh ubah <i>x</i> ialah 2, dan <i>a</i> ≠ 0.', 'Tahukah anda:')
assert v6 == [0, -5, -8, -9, -8, -5, 0]
S(s, 'CONTOH 6', 'Graf fungsi kuadratik', b6, SV(g6.svg(), 'Graf parabola y = x² − 2x − 8'))

# CONTOH 7 kubik
f7 = lambda v: 10 - v ** 3
x7 = [-3, -2, -1, 0, 1, 2, 3]
v7, g7, b7 = graph_slide('CONTOH 7', '', f7, x7, (-20, 40), 5, '2 cm kepada 1 unit', '2 cm kepada 5 unit', '<i>y</i> = 10 − <i>x</i>³', '−3 ≤ <i>x</i> ≤ 3', (1, 4, 5),
                         ['Apabila <i>x</i> = −2<br><i>y</i> = 10 − (−2)³ = 18', 'Apabila <i>x</i> = 1<br><i>y</i> = 10 − (1)³ = 9', 'Apabila <i>x</i> = 2<br><i>y</i> = 10 − (2)³ = 2'],
                         'Bagi fungsi kubik <i>ax</i>³ + <i>c</i>, kuasa tertinggi bagi pemboleh ubah <i>x</i> ialah 3, dan <i>a</i> ≠ 0.')
assert v7 == [37, 18, 11, 10, 9, 2, -17]
S(s, 'CONTOH 7', 'Graf fungsi kubik', b7, SV(g7.svg(), 'Graf fungsi kubik y = 10 − x³'))

# CONTOH 8 salingan
f8 = lambda v: 12 / v
x8 = [-4, -3, -2, -1, 1, 2, 3, 4]
v8 = [f8(v) for v in x8]
assert v8 == [-3, -4, -6, -12, 12, 6, 4, 3]
g8 = Gr((80, 40, 455, 430), (-4, 4), (-14, 14), 1, 2, fs=11)
g8.curve(f8, -4, -0.8, PK, 3.5, 300, reveal=True).curve(f8, 0.8, 4, PK, 3.5, 300, reveal=True)
for v, w in zip(x8, v8):
    g8.pt(v, w, '', PK)
g8.text(3.9, 12.5, '<i>y</i> = 12/<i>x</i>', PK, 17, 'end')
S(s, 'CONTOH 8', 'Graf fungsi salingan',
  p(f'(a) Lengkapkan jadual nilai di bawah bagi fungsi <i>y</i> = {fr(12, "<i>x</i>")}.') + tv(x8, v8, c, (1, 4, 6))
  + p('(b) Dengan menggunakan skala 2 cm kepada 1 unit pada paksi-<i>x</i> dan 2 cm kepada 2 unit pada paksi-<i>y</i>, lukis graf bagi fungsi itu untuk −4 ≤ <i>x</i> ≤ 4.')
  + work([('', [f'Apabila <i>x</i> = −3<br><i>y</i> = {fr(12, "−3")} = −4']), ('', [f'Apabila <i>x</i> = 1<br><i>y</i> = {fr(12, 1)} = 12']), ('', [f'Apabila <i>x</i> = 3<br><i>y</i> = {fr(12, 3)} = 4']),
          ], s, 3, 16)
  + note(f'Fungsi salingan <i>y</i> = {fr("<i>a</i>", "<i>x</i>")} tidak tertakrif jika <i>x</i> = 0. Fungsi salingan juga boleh ditulis sebagai <i>y</i> = <i>ax</i><sup>−1</sup>. Bentuk graf ini dipanggil bentuk hiperbola.', 'Tahukah anda:'),
  SV(g8.svg(), 'Graf hiperbola y = 12/x'))

# CONTOH 9 x^-2
f9 = lambda v: 4 / (v * v)
x9 = [-4, -3, -2, -1, -0.5, 0.5, 1, 2, 3, 4]
v9 = [r2(f9(v)) for v in x9]
assert v9 == [0.25, 0.44, 1, 4, 16, 16, 4, 1, 0.44, 0.25]
g9 = Gr((80, 40, 455, 430), (-4, 4), (0, 16), 1, 2, fs=11)
g9.curve(f9, -4, -0.5, PK, 3.5, 300, reveal=True).curve(f9, 0.5, 4, PK, 3.5, 300, reveal=True)
for v, w in zip(x9, v9):
    g9.pt(v, w, '', PK)
g9.text(3.9, 14.5, '<i>y</i> = 4<i>x</i>⁻²', PK, 17, 'end')
S(s, 'CONTOH 9', 'Graf fungsi salingan y = ax⁻²',
  p('(a) Lengkapkan jadual nilai di bawah bagi fungsi <i>y</i> = 4<i>x</i><sup>−2</sup>.') + tv(x9, v9, c, (1, 4, 8), fs=16)
  + p('(b) Dengan menggunakan skala 2 cm kepada 1 unit pada paksi-<i>x</i> dan 2 cm kepada 2 unit pada paksi-<i>y</i>, lukis graf bagi fungsi itu untuk −4 ≤ <i>x</i> ≤ 4.')
  + work([('', ['Apabila <i>x</i> = −3<br><i>y</i> = 4(−3)<sup>−2</sup> = 0.44']), ('', ['Apabila <i>x</i> = −0.5<br><i>y</i> = 4(−0.5)<sup>−2</sup> = 16']), ('', ['Apabila <i>x</i> = 3<br><i>y</i> = 4(3)<sup>−2</sup> = 0.44'])], s, 3, 16)
  + note('Bentuk graf ini juga adalah berbentuk hiperbola. <i>y</i> = <i>ax</i><sup><i>n</i></sup> dengan <i>n</i> = −1, −2 merupakan fungsi salingan.', 'Tip:'),
  SV(g9.svg(), 'Graf y = 4x⁻² bagi −4 ≤ x ≤ 4'))

# 8.2.2 Tafsiran — CONTOH 10
g = Gr((80, 40, 455, 430), (-2, 4), (-3, 9), 1, 1, fs=12)
g.curve(lambda v: 2 * v + 1, -2, 4, PK, 3.5, 2).text(3.9, 8.4, '<i>y</i> = 2<i>x</i> + 1', PK, 16, 'end')
read(g, 2, 5); read(g, 3, 7, GR)
g0 = Gr((80, 40, 455, 430), (-2, 4), (-3, 9), 1, 1, fs=12)
g0.curve(lambda v: 2 * v + 1, -2, 4, PK, 3.5, 2).text(3.9, 8.4, '<i>y</i> = 2<i>x</i> + 1', PK, 16, 'end')
S(s, 'KONSEP', 'Tafsiran graf fungsi',
  de(s, 'Daripada graf fungsi yang telah dibina, kita boleh membuat tafsiran dan ramalan terhadap situasi yang berlaku atau akan berlaku mengikut hubungan yang diperoleh daripada pemboleh ubah.')
  + steps(s, ['Untuk mencari nilai <i>y</i>: pada nilai <i>x</i> yang diberi, lukis satu garis mencancang sehingga bertemu dengan graf. Kemudian, buat satu garis mengufuk sehingga bertemu dengan paksi-<i>y</i>. Baca nilai <i>y</i>.',
              'Untuk mencari nilai <i>x</i>: pada nilai <i>y</i> yang diberi, lukis satu garis mengufuk sehingga bertemu dengan graf. Kemudian, buat satu garis mencancang sehingga bertemu dengan paksi-<i>x</i>. Baca nilai <i>x</i>.']),
  SV(g0.svg(), 'Graf y = 2x + 1'))

S(s, 'CONTOH 10', 'Tafsiran graf fungsi',
  p('Rajah di sebelah menunjukkan graf fungsi <i>y</i> = 2<i>x</i> + 1. Berdasarkan graf, tentukan')
  + bul(s, ['(a) nilai <i>y</i> apabila <i>x</i> = 2.', '(b) nilai <i>x</i> apabila <i>y</i> = 7.'])
  + pen(s, ['Daripada graf:', '(a) Apabila <i>x</i> = 2, maka <i>y</i> = 5', '(b) Apabila <i>y</i> = 7, maka <i>x</i> = 3'])
  ,
  SV(g.svg(), 'Graf y = 2x + 1 dengan bacaan pada x = 2 dan y = 7'))

# CONTOH 11
g = Gr((80, 40, 455, 430), (-4, 4), (-4, 14), 1, 2, fs=12)
g.curve(lambda v: v * v - 3, -4, 4, PK, 3.5).text(3.9, 13, '<i>y</i> = <i>x</i>² − 3', PK, 16, 'end')
read(g, 2, 1)
g.add(GF.L(g.P(-3, 6), g.P(3, 6), GR, 2.5, '6 5') + GF.L(g.P(-3, 6), (g.X(-3), g.Y(0)), GR, 2.5, '6 5') + GF.L(g.P(3, 6), (g.X(3), g.Y(0)), GR, 2.5, '6 5')
      + f'<circle cx="{g.X(-3):.1f}" cy="{g.Y(6):.1f}" r="6" fill="{GR}"/><circle cx="{g.X(3):.1f}" cy="{g.Y(6):.1f}" r="6" fill="{GR}"/>', True)
assert 2 * 2 - 3 == 1 and 3 * 3 - 3 == 6
S(s, 'CONTOH 11', 'Tafsiran graf fungsi kuadratik',
  p('Rajah menunjukkan graf bagi fungsi <i>y</i> = <i>x</i>² − 3. Berdasarkan graf, tentukan')
  + bul(s, ['(a) nilai <i>y</i>, apabila <i>x</i> = 2.', '(b) nilai-nilai <i>x</i>, apabila <i>y</i> = 6.'])
  + pen(s, ['Daripada graf:', '(a) Apabila <i>x</i> = 2, maka <i>y</i> = 1', '(b) Apabila <i>y</i> = 6, maka <i>x</i> = 3 dan −3'])
  ,
  SV(g.svg(), 'Graf parabola y = x² − 3 dengan bacaan'))

# CONTOH 12 bola
g = Gr((80, 50, 440, 420), (0, 4), (0, 7), 1, 1, xl='Masa (minit)', yl='Tinggi (meter)', fs=13)
g.seg((0, 6), (3, 0), PK, 3.5)
read(g, 1, 4); g.pt(3, 0, '', GR, reveal=True)
S(s, 'CONTOH 12', 'Tafsiran graf dalam situasi',
  p('Graf fungsi di sebelah menunjukkan pergerakan sebiji bola yang dijatuhkan dari ketinggian 6 meter. Berdasarkan graf, tentukan')
  + bul(s, ['(a) jarak bola itu dari tanah pada minit pertama.', '(b) masa bola menyentuh tanah.'])
  + pen(s, ['(a) Apabila <i>x</i> = 1, <i>y</i> = 4. Maka, jarak bola dari tanah pada minit pertama ialah 4 meter.',
            '(b) Apabila bola menyentuh tanah, tingginya ialah sifar. Apabila <i>y</i> = 0, <i>x</i> = 3. Maka, bola menyentuh tanah pada minit ke-3.']),
  SV(g.svg(), 'Graf tinggi bola melawan masa dari 6 meter ke 0 pada minit ke-3'))

# CONTOH 13 Kumar
def g13(ext=False):
    g = Gr((90, 50, 440, 410), (0, 70 if ext else 60), (0, 30), 10, 5, xl='Bilangan bungkus', yl='Keuntungan (RM)', fs=12)
    g.seg((0, 0), (50, 20), PK, 3.5)
    for k in range(1, 6):
        g.pt(10 * k, 4 * k, '', PK, r=4.5)
    return g


g = g13()
read(g, 20, 8); read(g, 50, 20, GR); read(g, 30, 12, PA)
S(s, 'CONTOH 13', 'Tafsiran dan ramalan',
  p('Dalam ekspo keusahawanan yang lepas, Kumar telah menjual mi goreng di gerai Persatuan Pengguna. Graf di sebelah menunjukkan bilangan bungkus mi goreng yang dijual dengan keuntungan yang diperoleh Kumar. Berdasarkan graf:')
  + bul(s, ['(a) Berapakah keuntungan yang diperoleh Kumar sekiranya dia berjaya menjual 20 bungkus mi goreng?', '(b) Jika Kumar mendapat keuntungan sebanyak RM20, berapa bungkuskah mi goreng yang telah dijualnya?',
            '(c) Berapakah keuntungan Kumar jika 30 bungkus mi goreng terjual?', '(d) Nyatakan satu inferens yang sesuai bagi graf jualan itu.',
            '(e) Berdasarkan trend graf tersebut, ramalkan keuntungan Kumar jika 60 bungkus mi gorengnya berjaya dijual.']),
  SV(g.svg(), 'Graf keuntungan melawan bilangan bungkus mi goreng'))

g = g13(True)
g.seg((50, 20), (60, 24), PK, 3, '8 6').add(GF.L(g.P(60, 24), (g.X(60), g.Y(0)), AM, 2.5, '6 5') + GF.L(g.P(60, 24), (g.X(0), g.Y(24)), AM, 2.5, '6 5') + f'<circle cx="{g.X(60):.1f}" cy="{g.Y(24):.1f}" r="6" fill="{AM}"/>', True)
assert 0.4 * 20 == 8 and 20 / 0.4 == 50 and 0.4 * 30 == 12 and 0.4 * 60 == 24
S(s, 'CONTOH 13 (sambungan)', 'Penyelesaian',
  pen(s, ['(a) Keuntungan = RM8', '(b) Bilangan mi goreng = 50 bungkus', '(c) Keuntungan = RM12',
          '(d) Jumlah keuntungan Kumar meningkat jika bilangan bungkus mi goreng yang dijual bertambah.', '(e) RM24'], False)
  + note('Graf dipanjangkan mengikut trend yang sama untuk membuat ramalan.', 'Tip:'),
  SV(g.svg(), 'Graf dipanjangkan untuk meramal keuntungan bagi 60 bungkus'))

# CONTOH 14 Johan & Erika
def g14():
    g = Gr((90, 50, 440, 410), (0, 30), (0, 160), 5, 20, xl='Bilangan hari', yl='Wang (RM)', fs=12)
    g.seg((0, 0), (30, 150), PK, 3.5).seg((0, 30), (30, 90), GR, 3.5)
    g.text(29, 160, 'Johan', PK, 16, 'end').text(29, 78, 'Erika', GR, 16, 'end')
    return g


assert 5 * 10 == 30 + 2 * 10 and 5 * 20 - (30 + 2 * 20) == 30 and 5 * 15 == 75 and 30 + 2 * 15 == 60 and 5 * 30 == 150 and 30 + 2 * 30 == 90
S(s, 'CONTOH 14', 'Penyelesaian masalah',
  p('Setiap hari, Johan dan Erika menerima wang belanja daripada bapa mereka. Mereka akan menyimpan sebahagian daripada wang belanja itu di dalam tabung. Graf menunjukkan jumlah wang (RM) yang disimpan mengikut bilangan hari. Berdasarkan graf:')
  + bul(s, ['(a) Berapakah jumlah wang yang disimpan pada hari ke-15 di dalam tabung (i) Johan (ii) Erika', '(b) Bilakah wang Johan dan Erika mempunyai jumlah simpanan yang sama? (c) Bilakah simpanan Johan dan Erika mempunyai perbezaan sebanyak RM30?',
            '(d) Bapa mereka berjanji akan memberikan hadiah kepada seorang daripada mereka yang mempunyai wang paling banyak selepas sebulan. Siapakah yang akan mendapat hadiah itu? Berikan justifikasi anda.']),
  SV(g14().svg(), 'Graf simpanan Johan dan Erika melawan bilangan hari'))

g = g14()
read(g, 15, 75, AM); read(g, 15, 60, AM, tox=True, toy=False); read(g, 10, 50, PA); read(g, 20, 100, TR, toy=False); read(g, 20, 70, TR); read(g, 30, 150, PU, toy=False); read(g, 30, 90, PU)
S(s, 'CONTOH 14 (sambungan)', 'Penyelesaian',
  work([('Memahami masalah', ['(a) Mengenal pasti nilai wang yang disimpan pada hari ke-15. (b) Mengenal pasti bilangan hari bagi jumlah simpanan yang sama. (c) Menghitung perbezaan simpanan sebanyak RM30. (d) Mengenal pasti siapakah yang akan mendapat hadiah.']),
        ('Merancang strategi', ['(a) Baca nilai <i>y</i> apabila <i>x</i> = 15. (b) Baca nilai <i>x</i> bagi titik persilangan dua garis. (c) Hitung perbezaan nilai sebanyak RM30. (d) Baca nilai <i>y</i> apabila <i>x</i> = 30.']),
        ('Melaksanakan strategi', ['(a) Simpanan Johan = RM75, simpanan Erika = RM60', '(b) Titik persilangan ialah (10, 50).', '(c) Pada hari ke-20, RM100 − RM70 = RM30.', '(d) Apabila <i>x</i> = 30, graf Erika, <i>y</i> = RM90; graf Johan, <i>y</i> = RM150.']),
        ('Membuat kesimpulan', ['(a) (i) Johan = RM75 (ii) Erika = RM60 (b) Simpanan Johan dan Erika mempunyai jumlah yang sama pada hari ke-10. (c) Perbezaan simpanan mereka sebanyak RM30 adalah pada hari ke-20. (d) Johan akan mendapat hadiah daripada bapanya kerana pada hari ke-30 tabung Johan mempunyai RM150 manakala tabung Erika cuma mempunyai RM90 sahaja.'])], s, 2, 15),
  SV(g.svg(), 'Bacaan graf simpanan Johan dan Erika'))

# CONTOH 15 Jibam
def g15():
    g = Gr((90, 50, 440, 410), (0, 5), (0, 10), 1, 1, xl='Masa (s)', yl='Tinggi (m)', fs=12)
    g.curve(lambda v: 8 + 2 * v - v * v, 0, 4, PK, 3.5).seg((0, 0), (2.5, 10), GR, 3.5)
    g.text(3.4, 5, '<i>y</i> = 8 + 2<i>x</i> − <i>x</i>²', PK, 15, 'start').text(1.2, 7, '<i>y</i> = 4<i>x</i>', GR, 15, 'end')
    return g


assert 8 + 2 - 1 == 9 and 8 + 4 - 4 == 8 == 4 * 2 and 8 + 8 - 16 == 0
S(s, 'CONTOH 15', 'Penyelesaian masalah',
  p('Dalam permainan animasi, kartun Jibam melompat dari sebuah blok batu. Pada masa yang sama, sebiji batu akan dibaling ke arahnya untuk menjatuhkan Jibam. Graf fungsi <i>y</i> = 8 + 2<i>x</i> − <i>x</i>² mewakili pergerakan Jibam dan graf fungsi <i>y</i> = 4<i>x</i> mewakili pergerakan batu tersebut. <i>y</i> mewakili jarak dalam meter dan <i>x</i> ialah masa dalam saat. Berdasarkan graf:')
  + bul(s, ['(a) Apakah ketinggian maksimum lompatan Jibam?', '(b) Pada saat keberapakah batu itu tepat mengenai Jibam?', '(c) Pada saat keberapakah Jibam menyentuh permukaan tanah?']),
  SV(g15().svg(), 'Graf lompatan Jibam dan balingan batu'))

g = g15()
read(g, 1, 9, AM); read(g, 2, 8, PA); g.pt(4, 0, '(4, 0)', TR, -6, -16, 'end', reveal=True)
S(s, 'CONTOH 15 (sambungan)', 'Penyelesaian',
  work([('Memahami masalah', ['Fungsi <i>y</i> = 8 + 2<i>x</i> − <i>x</i>² mewakili lompatan Jibam. Fungsi <i>y</i> = 4<i>x</i> mewakili balingan batu.',
                              'Mengenal pasti nilai ketinggian maksimum lompatan Jibam, masa batu mengenai Jibam dan masa Jibam sampai ke tanah.']),
        ('Merancang strategi', ['(a) Baca nilai ketinggian maksimum daripada graf <i>y</i> = 8 + 2<i>x</i> − <i>x</i>².', '(b) Baca nilai <i>x</i> bagi titik persilangan dua graf tersebut.', '(c) Baca nilai <i>x</i> jika <i>y</i> = 0.']),
        ('Melaksanakan strategi', ['(a) Titik maksimum ialah (1, 9), maka ketinggian maksimum ialah 9.', '(b) Titik persilangan ialah (2, 8). Maka, batu itu mengenai Jibam pada saat ke-2.', '(c) <i>y</i> = 0, <i>x</i> = 4. Maka, Jibam akan menyentuh tanah pada saat ke-4.']),
        ('Membuat kesimpulan', ['(a) Ketinggian maksimum lompatan Jibam ialah 9 meter. (b) Batu yang dibaling itu mengenai Jibam pada saat ke-2. (c) Jibam akan menyentuh tanah pada saat ke-4.'])], s, 1, 16),
  SV(g.svg(), 'Bacaan titik maksimum, titik persilangan dan titik di paksi-x'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'graphx', 'slides.js')
HEAD = '/* Nota Bab 8 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
