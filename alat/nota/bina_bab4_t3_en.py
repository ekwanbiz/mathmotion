"""Bab 4 T3 Scale Drawings (ENGLISH / DLP): ayat ikut buku teks English (DLP Form 3), nombor sama dengan versi BM.
Subtopik folder berskala dikekalkan (4.1.1 hingga 4.1.4) kerana bab.js dan soalan.js bergantung padanya
(dipaparkan sebagai satu subtopik 4.1 melalui BAB.gabung):
4.1.1 = buku SP 4.1.1, 4.1.2 = buku SP 4.1.2 + 4.1.3, 4.1.3 = buku SP 4.1.4, 4.1.4 = buku SP 4.1.5."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, GRID2, NAV

SUBS = [{"no": "4.1.1", "name": "Meaning of Scale Drawing", "col": "#38BDF8"}, {"no": "4.1.2", "name": "Interpreting the Scale", "col": "#FBBF24"},
        {"no": "4.1.3", "name": "Drawing Scale Drawings", "col": "#34D399"}, {"no": "4.1.4", "name": "Problem Solving", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


def i(s):
    return f'<i>{s}</i>'


# ---------- pembantu grid ----------
def grid(x0, y0, cols, rows, u, w=1.3, col=GRID2):
    """grid bermula (x0, y0) = penjuru kiri atas, cols x rows petak bersaiz u px."""
    o = ''.join(GF.L((x0 + k * u, y0), (x0 + k * u, y0 + rows * u), col, w) for k in range(cols + 1))
    o += ''.join(GF.L((x0, y0 + k * u), (x0 + cols * u, y0 + k * u), col, w) for k in range(rows + 1))
    return o


def gp(x0, yb, u):
    """penukar koordinat grid (gx, gy; gy ke atas dari garis bawah yb) → skrin."""
    return lambda q: (x0 + q[0] * u, yb - q[1] * u)


def shape(pts, col, labels=None, size=16, off=15, w=3):
    """poligon + label bucu (di luar, menjauhi pusat)."""
    o = '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{col}2E" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>'
    if labels:
        cx = sum(x for x, _ in pts) / len(pts); cy = sum(y for _, y in pts) / len(pts)
        for (x, y), lb in zip(pts, labels):
            if not lb:
                continue
            dx, dy = x - cx, y - cy; d = math.hypot(dx, dy) or 1
            o += GF.T(x + dx / d * off, y + dy / d * off, lb, TX, size)
    return o


def brace(x1, x2, y, lb, col=MU3, up=True):
    """penanda saiz petak di atas grid."""
    s = -1 if up else 1
    return (GF.L((x1, y), (x1, y + 6 * s), col, 2) + GF.L((x2, y), (x2, y + 6 * s), col, 2) + GF.L((x1, y + 6 * s), (x2, y + 6 * s), col, 2)
            + GF.T((x1 + x2) / 2, y + 18 * s, lb, col, 14, halo=False))


def flower(cx, cy, u, col):
    """bunga ringkas dalam kotak 4 x 4 petak (u px)."""
    o = GF.L((cx, cy + 0.3 * u), (cx, cy + 2 * u), GR, max(1.5, u * 0.08))
    o += f'<ellipse cx="{cx + 0.45 * u:.1f}" cy="{cy + 1.35 * u:.1f}" rx="{0.42 * u:.1f}" ry="{0.18 * u:.1f}" fill="{GR}55" stroke="{GR}" stroke-width="{max(1, u * 0.05):.1f}" transform="rotate(-30 {cx + 0.45 * u:.1f} {cy + 1.35 * u:.1f})"/>'
    for k in range(5):
        a = math.radians(-90 + 72 * k)
        o += f'<circle cx="{cx + 0.55 * u * math.cos(a):.1f}" cy="{cy - 0.3 * u + 0.55 * u * math.sin(a):.1f}" r="{0.42 * u:.1f}" fill="{col}44" stroke="{col}" stroke-width="{max(1, u * 0.06):.1f}"/>'
    o += f'<circle cx="{cx:.1f}" cy="{cy - 0.3 * u:.1f}" r="{0.3 * u:.1f}" fill="{AM}" stroke="{AM}"/>'
    return o


# =====================================================================
# 4.1.1 MAKSUD LUKISAN BERSKALA (buku SP 4.1.1)
# =====================================================================
s = '4.1.1'
c = COL[s]
o = GF.box(14, 14, 472, 442)
kl, jb = (150, 110), (360, 360)
o += f'<path d="M150 110 C 210 170, 170 230, 250 260 S 330 300, 360 360" fill="none" stroke="{PA}" stroke-width="4" stroke-dasharray="8 6"/>'
o += f'<circle cx="{kl[0]}" cy="{kl[1]}" r="9" fill="{TR}"/><circle cx="{jb[0]}" cy="{jb[1]}" r="9" fill="{TR}"/>'
o += GF.T(150, 82, 'Kuala Lumpur', TX, 18) + GF.T(360, 392, 'Johor Bahru', TX, 18)
o += GF.L((60, 420), (120, 420), AM, 4) + GF.L((60, 412), (60, 428), AM, 3) + GF.L((120, 412), (120, 428), AM, 3)
o += GF.T(90, 400, '1 cm', AM, 15) + GF.T(130, 421, ': 50 km', AM, 17, 'start')
S(s, 'DEFINITION', 'Scale drawing',
  p('Do you know that the maps found in navigation software are drawn to a certain scale? The distance between two towns shown in the software is proportional to the actual distance.')
  + p('For example, the distance between Johor Bahru and Kuala Lumpur is shown using a scale of 1 cm : 50 km.')
  + de(s, '<b>Scale drawing</b> is the drawing of an object with all measurements in the drawing proportional to the measurements of the object.'),
  SV(o, 'Simple map of the distance from Kuala Lumpur to Johor Bahru with a scale of 1 cm to 50 km'))

# Contoh 1: objek PQRST dan tiga lukisan
U = 26
base = [(0, 0), (0, 4), (2, 2), (6, 2), (6, 0)]
o = ''
def draw1(x0, yb, k, col, title, lab=True):
    t = gp(x0, yb, U)
    pts = [t((a * k, b * k)) for a, b in base]
    r = grid(x0 - U, yb - (int(4 * k) + 1) * U, int(6 * k) + 2, int(4 * k) + 1, U)
    r += shape(pts, col, ['P', 'Q', 'R', 'S', 'T'] if lab else None, 14, 13)
    r += GF.T(pts[1][0] + 9, pts[1][1] + 2.2 * U * k + 4, '45°', TX, 12, 'start')
    r += GF.T(x0 + 3 * k * U, yb + 22, title, MU3, 15)
    return r
o += draw1(40, 150, 1, TR, 'Object')
o += GF.rv(draw1(270, 150, 1, GR, 'Diagram 1', False))
o += GF.rv(draw1(40, 420, 0.5, AM, 'Diagram 2', False))
o += GF.rv(draw1(170, 420, 1.5, PK, 'Diagram 3', False))
S(s, 'EXAMPLE 1', 'Comparing drawings with the object',
  p(f'The diagram shows the drawings representing object {i("PQRST")} drawn to different sizes. What can you say about the size of Diagram 1, Diagram 2 and Diagram 3 compared to object {i("PQRST")}?')
  + pen(s, ['<b>Diagram 1:</b> Lengths of all sides and sizes of all angles are the same as object.',
            '<b>Diagram 2:</b> Lengths of all sides reduced by a certain proportion compared to object but sizes of all angles unchanged.',
            '<b>Diagram 3:</b> Lengths of all sides increased by a certain proportion compared to object but sizes of all angles unchanged.'], False),
  SV(o, 'Object PQRST and its three drawings on a grid: same size, reduced and enlarged'))
S(s, 'EXAMPLE 1 (continued)', 'Conclusion',
  p(f'In conclusion, all sides of Diagram 1, Diagram 2 and Diagram 3 follow a certain scale that is proportional to the object whereas angle size remains unchanged. Therefore, Diagram 1, Diagram 2 and Diagram 3 are scale drawings of object {i("PQRST")}.')
  + de(s, '<b>Scale drawing</b> is the drawing of an object with all measurements in the drawing proportional to the measurements of the object.'),
  SV(o.replace('<g class="rv">', '<g>'), 'Object PQRST and its three scale drawings on a grid'))

# =====================================================================
# 4.1.2 MENTAFSIR SKALA (buku SP 4.1.2 dan 4.1.3)
# =====================================================================
s = '4.1.2'
c = COL[s]
S(s, 'DEFINITION', 'The scale of a scale drawing',
  p('The scale used to draw a scale drawing depends on the ratio of measurement of scale drawing to measurement of object, which is')
  + formula(f'Scale = {fr("Measurement of scale drawing", "Measurement of object")}', c)
  + p('This ratio can also be written in the form; <b>Measurement of scale drawing : Measurement of object</b>'),
  stack(p(f'Usually, for scale drawings, we use scale in the form of ratio <b>1 : {i("n")}</b> where {i("n")} is a positive integer or fraction.')
        + de(s, f'1 : {i("n")} means one unit on the scale drawing will represent {i("n")} units on the object.')))

# konsep nilai n: objek PQ 4 unit, lukisan 1 : 1/2, 1 : 1, 1 : 2
o = ''
t0 = gp(30, 200, 22)
o += grid(30, 200 - 4 * 22, 6, 4, 22) + shape([t0(q) for q in [(1, 0), (5, 0), (1, 3)]], TR, ["P", "Q", "R"], 14, 13) + GF.T(96, 222, 'Object', TR, 15)
o += GF.rv(grid(220, 200 - 7 * 22, 10, 7, 22) + shape([gp(220, 200, 22)(q) for q in [(1, 0), (9, 0), (1, 6)]], PK, None)
           + GF.T(330, 222, 'Bigger (<i>n</i> &lt; 1)', PK, 15))
o += GF.rv(grid(30, 400 - 4 * 22, 6, 4, 22) + shape([gp(30, 400, 22)(q) for q in [(1, 0), (5, 0), (1, 3)]], GR, None)
           + GF.T(96, 422, 'Same size (<i>n</i> = 1)', GR, 15))
o += GF.rv(grid(270, 400 - 3 * 22, 4, 3, 22) + shape([gp(270, 400, 22)(q) for q in [(1, 0), (3, 0), (1, 1.5)]], AM, None)
           + GF.T(318, 422, 'Smaller (<i>n</i> &gt; 1)', AM, 15))
S(s, 'CONCEPT', f'The value of {i("n")} in the scale 1 : {i("n")}',
  p('Compare the sides of the scale drawing with the corresponding sides of the object.')
  + table(['Scale drawing', 'Object', 'Scale'], [["P'Q' = 8 units", 'PQ = 4 units', f'8 : 4 = 1 : {fr(1, 2)}'], ["P'Q' = 4 units", 'PQ = 4 units', '4 : 4 = 1 : 1'],
                                                    ["P'Q' = 2 units", 'PQ = 4 units', '2 : 4 = 1 : 2']], c, 17, rvrows=(0, 1, 2))
  + p('It is found that;')
  + bul(s, [f'If {i("n")} &lt; 1, the scale drawing is <b>bigger</b> than the object.', f'If {i("n")} &gt; 1, the scale drawing is <b>smaller</b> than the object.',
            f'If {i("n")} = 1, the scale drawing is <b>the same size as</b> the object.']),
  SV(o, 'A triangle object and scale drawings that are bigger, the same size and smaller'))

# Contoh 2: PQRS objek, skala 1 : 3
U = 34
t = gp(40, 280, U)
o = grid(20, 280 - 7 * U, 13, 7, U)
o += shape([t(q) for q in [(0, 6), (3, 6), (6, 0), (0, 0)]], TR, ['P', 'Q', 'R', 'S'], 16)
t2 = gp(40 + 9 * U, 280, U)
o += shape([t2(q) for q in [(0, 2), (1, 2), (2, 0), (0, 0)]], AM, ["P'", "Q'", "R'", "S'"], 15, 14)
o += GF.T(250, 320, 'Object PQRS and scale drawing P\'Q\'R\'S\'', MU3, 15, halo=False)
S(s, 'EXAMPLE 2', 'Stating the scale',
  p(f'The diagram shows object {i("PQRS")} and scale drawing {i("P′Q′R′S′")} drawn on a grid of equal squares. State the scale used in the form 1 : {i("n")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'Scale = {fr(i("P′Q′"), i("PQ"))} = {fr(1, 3)} &nbsp; or &nbsp; Scale = {fr(i("P′S′"), i("PS"))} = {fr(2, 6)} = {fr(1, 3)}', 'Thus, scale = 1 : 3'])], s, 1, 20)
  + formula(f'Scale = {fr("Measurement of scale drawing", "Measurement of object")} = {fr(1, i("n"))}', c),
  SV(o, 'Trapezium PQRS on a grid and a smaller scale drawing P prime Q prime R prime S prime'))

# Contoh 3: KLM, skala 4 : 1
U = 25
o = grid(12, 420 - 9 * U, 19, 9, U)
t = gp(37, 395, U)
o += shape([t(q) for q in [(0, 2), (0, 0), (3, 0)]], TR, ['K', 'L', 'M'], 15, 13)
t2 = gp(37 + 5 * U, 395, U)
o += shape([t2(q) for q in [(0, 8), (0, 0), (12, 0)]], AM, ["K'", "L'", "M'"], 15, 14)
S(s, 'EXAMPLE 3', 'Scale of an enlarged drawing',
  p(f'The diagram shows object {i("KLM")} and scale drawing {i("K′L′M′")} drawn on a grid of equal squares. State the scale used in the form 1 : {i("n")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'Scale = {fr(i("K′L′"), i("KL"))} = {fr(8, 2)} = {fr(4, 1)} &nbsp; or &nbsp; Scale = {fr(i("L′M′"), i("LM"))} = {fr(12, 3)} = {fr(4, 1)}',
                f'Thus, scale = 4 : 1 = {fr(4, 4)} : {fr(1, 4)} = 1 : {fr(1, 4)}'])], s, 1, 20)
  + note('4 divided by 4 will give 1.', 'Tips:'),
  SV(o, 'Triangle KLM on a grid and a bigger scale drawing K prime L prime M prime'))

# Contoh 4: grid berlainan saiz 1 cm dan 3 cm
o = ''
uo, ul = 26, 84
o += GF.T(59, 60 + 4 * uo + 44, 'Object', TR, 17) + grid(20, 60, 3, 4, uo)
t = gp(20, 60 + 4 * uo, uo)
o += shape([t(q) for q in [(1, 3), (0, 0), (2, 0)]], TR, ['P', 'Q', 'R'], 14, 12)
o += brace(20 + 2 * uo, 20 + 3 * uo, 56, '1 cm')
o += GF.T(356, 70 + 4 * ul + 44, 'Scale drawing', AM, 17) + grid(230, 70, 3, 4, ul)
t2 = gp(230, 70 + 4 * ul, ul)
o += shape([t2(q) for q in [(1, 3), (0, 0), (2, 0)]], AM, ["P'", "Q'", "R'"], 16, 16)
o += brace(230 + 2 * ul, 230 + 3 * ul, 64, '3 cm')
S(s, 'EXAMPLE 4', 'Grids of different sizes',
  p(f'The diagram shows object {i("PQR")} and scale drawing {i("P′Q′R′")} drawn on a grid of equal squares of different sizes. Determine the scale used in the form 1 : {i("n")}.')
  + p('<b>Solution:</b>')
  + work([('Method 1', [f'Scale = {fr(i("Q′R′"), i("QR"))} = {fr("6 cm", "2 cm")} = {fr(3, 1)}', 'Scale = 3 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(1, 3)}']),
          ('Method 2', [f'Scale = {fr("Grid size of scale drawing", "Grid size of object")}', f'&emsp;&emsp;&ensp;= {fr("3 cm", "1 cm")} = {fr(3, 1)}', 'Scale = 3 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(1, 3)}'])], s, 2, 18)
  + note('Grid size is used because number of units of sides of object and sides of scale drawing is the same.', 'Tips:'),
  SV(o, 'Triangle PQR on a 1 cm grid and its scale drawing on a 3 cm grid'))

# Contoh 5: KLMN, grid 2 cm → 0.5 cm, skala 1 : 4
assert math.isclose(math.hypot(4 * 0.5, 3 * 0.5), 2.5) and math.isclose(math.hypot(4 * 2, 3 * 2), 10)
o = ''
uo, ul = 40, 10
o += GF.T(160, 30, 'Object', TR, 17) + grid(20, 60, 7, 7, uo)
t = gp(20, 60 + 7 * uo, uo)
kq = [(3, 7), (0, 3), (4, 0), (7, 4)]
o += shape([t(q) for q in kq], TR, ['K', 'L', 'M', 'N'], 15, 13)
o += brace(20 + 6 * uo, 20 + 7 * uo, 56, '2 cm')
o += GF.T(380, 330, 'Scale drawing', AM, 16) + grid(345, 355, 7, 7, ul)
t2 = gp(345, 355 + 7 * ul, ul)
o += shape([t2(q) for q in kq], AM, ["K'", "L'", "M'", "N'"], 12, 10, 2)
o += GF.T(440, 400, '0.5 cm', MU3, 13, 'start', halo=False)
S(s, 'EXAMPLE 5', 'Grids of different sizes',
  p(f'The diagram shows object {i("KLMN")} and scale drawing {i("K′L′M′N′")} drawn on a grid of equal squares of different sizes. Determine the scale used.')
  + work([('Method 1', [f'Scale = {fr(i("K′N′"), i("KN"))} = {fr("2.5 cm", "10 cm")} = {fr(1, 4)}', f'Scale = {fr(1, 4)} : 1',
                        f'&emsp;&emsp;&ensp;= {fr(1, 4)} × 4 : 1 × 4', '&emsp;&emsp;&ensp;= 1 : 4', f'({fr(1, 4)} multiplied by 4 to get 1.)']),
          ('Method 2', [f'Scale = {fr("Grid size of scale drawing", "Grid size of object")}', f'&emsp;&emsp;&ensp;= {fr("0.5 cm", "2 cm")} = {fr(1, 4)}', f'Scale = {fr(1, 4)} : 1',
                        '&emsp;&emsp;&ensp;= 1 : 4'])], s, 2, 18)
  + note(f'{i("K′N′")} = {sq("1.5² + 2²")} = 2.5 cm &nbsp; and &nbsp; {i("KN")} = {sq("6² + 8²")} = 10 cm', 'Flashback:'),
  SV(o, 'Quadrilateral KLMN on a 2 cm grid and its scale drawing on a 0.5 cm grid'))

# Contoh 6: peta 1 : 250 000, 4 cm → 10 km
assert 4 * 250000 == 1000000
S(s, 'EXAMPLE 6', 'Actual distance from a map',
  p(f'A map is drawn to a scale of 1 : 250 000. Calculate the actual length, in km, of a river that is 4 cm long on the map.')
  + p('<b>Solution:</b>')
  + work([('Method 1', [f'{fr("1 cm", "250 000 cm")} = {fr("4 cm", "Actual distance")}', f'Actual distance = {fr("4 × 250 000 cm", "1 cm")}', '&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;= 1 000 000 cm', '&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;= 10 km'])], s, 1, 20)
  + note('1 km = 1 000 m, 1 m = 100 cm, thus 1 km = 100 000 cm.', 'Flashback:'),
  stack(work([('Method 2', ['Scale drawing : Object', '1 : 250 000', '1 cm : 250 000 cm', '1 cm : 2.5 km &emsp;(× 4)', '4 cm : 10 km', 'Thus, the actual length of the river is 10 km.'])], s, 1, 20)))

# Contoh 7: peta Pahang 1 cm : 15 km, 3 cm → 45 km
S(s, 'EXAMPLE 7', 'Scale in different units',
  p('The map of Pahang is drawn to a scale of 1 cm to 15 km. Calculate the actual distance between Kuantan and Pekan if the distance on the map is 3 cm.')
  + p('<b>Solution:</b>')
  + work([('Method 1', [f'Scale = {fr("Distance on drawing", "Actual distance")}', f'{fr("1 cm", "15 km")} = {fr("3 cm", "Actual distance")}',
                        f'Actual distance = {fr("3 cm (15 km)", "1 cm")}', 'Actual distance = 45 km'])], s, 1, 20),
  stack(work([('Method 2', ['Scale drawing : Object', '1 cm : 15 km &emsp;(× 3)', '3 cm : 45 km', 'Thus, the actual distance is 45 km.'])], s, 1, 20)))

# Contoh 8: Haikal, skala 1 : 1/4, sisi sebenar 5 cm → 20 cm
S(s, 'EXAMPLE 8', 'Measurement of a scale drawing',
  p(f'Haikal draws a square to a scale of 1 : {fr(1, 4)}. If the actual length of sides of the square is 5 cm, what is the length of sides, in cm, of the scale drawing?')
  + p('<b>Solution:</b>')
  + work([('Method 1', [f'Scale = {fr("Side of scale drawing", "Corresponding side of object")}', f'{fr(1, fr(1, 4))} = {fr("Side of scale drawing", "5 cm")}',
                        'Side of scale drawing = 4 × 5 cm', 'Length of side of scale drawing = 20 cm'])], s, 1, 20),
  stack(work([('Method 2', ['Scale drawing : Object', f'1 : {fr(1, 4)} &emsp;(× 20)', '20 cm : 5 cm', 'Thus, the length of side of scale drawing is 20 cm.'])], s, 1, 20)))

# =====================================================================
# 4.1.3 MELUKIS LUKISAN BERSKALA (buku SP 4.1.4)
# =====================================================================
s = '4.1.3'
c = COL[s]
o = ''
sh = [(0, 0), (3, 0), (3, 2), (1, 2)]
o += GF.T(130, 34, '(a) Same grid size, different scales', MU3, 15, halo=False) + grid(40, 52, 12, 5, 20)
o += shape([gp(60, 132, 20)(q) for q in sh], TR, None) + shape([gp(160, 152, 20)(q) for q in [(a * 2, b * 2) for a, b in sh]], GR, None)
o += GF.T(140, 200, '(b) Grids of different sizes', MU3, 15, halo=False) + grid(40, 218, 4, 3, 20) + grid(160, 218, 4, 3, 40)
o += shape([gp(40, 278, 20)(q) for q in sh], TR, None) + shape([gp(160, 338, 40)(q) for q in sh], GR, None)
o += GF.T(150, 372, '(c) Blank paper to scale', MU3, 15, halo=False)
o += shape([(60, 450), (240, 450), (240, 400), (120, 400)], GR, None) + GF.T(150, 462, '9 cm', GR, 13) + GF.T(252, 425, '3 cm', GR, 13, 'start')
S(s, 'CONCEPT', 'Drawing the scale drawing of an object',
  p('There are three ways to draw the scale drawing of an object.')
  + bul(s, ['(a) Use grid paper of the same size for different scales.', '(b) Use grid paper of different sizes.',
            '(c) Draw on a blank paper according to the given scale.']),
  SV(o, 'Three ways to draw a scale drawing: same grid size, different grid sizes and blank paper'))

# Contoh 9: PQRS skala 1 : 1/3
U = 32
o = grid(20, 60, 4, 4, U)
t = gp(20 + U, 60 + 3 * U, U)
o += shape([t(q) for q in [(0, 0), (2, 0), (2, 2), (0, 1)]], TR, ['P', 'Q', 'R', 'S'], 14, 12)
o += GF.T(84, 40, 'Object', TR, 16)
t2 = gp(170 + U, 60 + 8 * U - U, U)
o += GF.rv(grid(170, 60, 9, 8, U) + shape([t2(q) for q in [(0, 0), (6, 0), (6, 6), (0, 3)]], GR, ["P'", "Q'", "R'", "S'"], 15, 14))
S(s, 'EXAMPLE 9', 'Drawing on a grid of equal squares',
  p(f'Draw the scale drawing of shape {i("PQRS")} on a grid of equal squares using a scale of 1 : {fr(1, 3)}.')
  + pen(s, [f'The scale given is 1 : {fr(1, 3)}. Therefore, every side of the scale drawing is three times longer than the length of sides of object {i("PQRS")}.',
            f'{i("P′Q′")} = 3 × 2 = 6 units, &nbsp;{i("Q′R′")} = 3 × 2 = 6 units, &nbsp;{i("P′S′")} = 3 × 1 = 3 units.'])
  + note('If you have to draw the scale drawing of your school field, what is a suitable scale to be used? Why?', 'Quiz:'),
  SV(o, 'Shape PQRS on a grid and its scale drawing three times bigger'))

# Contoh 10: ΔPQR grid 1 cm → 2.5 cm dan 0.5 cm
o = ''
tri = [(0, 0), (1, 3), (4, 0)]
u1 = 26
o += GF.T(70, 44 + 3 * u1 + 22, 'Object (1 cm)', TR, 15) + grid(18, 44, 4, 3, u1) + shape([gp(18, 44 + 3 * u1, u1)(q) for q in tri], TR, ['P', 'Q', 'R'], 13, 11)
o += GF.rv(GF.T(380, 50 + 39 + 24, '(a)(ii) 0.5 cm', AM, 15) + grid(354, 50, 4, 3, 13) + shape([gp(354, 50 + 39, 13)(q) for q in tri], AM, ["P'", "Q'", "R'"], 12, 10, 2))
o += GF.rv(GF.T(250, 194 + 195 + 26, '(a)(i) 2.5 cm', GR, 15) + grid(120, 194, 4, 3, 65) + shape([gp(120, 194 + 195, 65)(q) for q in tri], GR, ["P'", "Q'", "R'"], 15, 15))
S(s, 'EXAMPLE 10', 'Drawing on grids of different sizes',
  p(f'(a) Diagram ∆{i("PQR")} is drawn on a grid of 1 cm × 1 cm. Redraw ∆{i("PQR")} on grid paper with dimensions (i) 2.5 cm × 2.5 cm (ii) 0.5 cm × 0.5 cm')
  + p(f'(b) Calculate the scale used in (a)(i) and (a)(ii) in the form 1 : {i("n")}.')
  + work([('(b)(i)', [f'Scale = {fr("Grid size of scale drawing", "Grid size of object")}', f'&emsp;&emsp;&ensp;= {fr("2.5 cm", "1 cm")}', 'Scale = 2.5 : 1', f'&emsp;&emsp;&ensp;= 1 : {fr(2, 5)}']),
          ('(b)(ii)', [f'Scale = {fr("Grid size of scale drawing", "Grid size of object")}', f'&emsp;&emsp;&ensp;= {fr("0.5 cm", "1 cm")}', 'Scale = 0.5 : 1', '&emsp;&emsp;&ensp;= 1 : 2'])], s, 2, 17),
  SV(o, 'Triangle PQR on a 1 cm grid redrawn on 2.5 cm and 0.5 cm grids'))

# Contoh 11: bina segi tiga, PQ = 8 cm, QR = 5 cm, sudut P = 30°, skala 1 : 2
a30 = math.radians(30)
pr_o = 8 * math.cos(a30) + math.sqrt(25 - (8 * math.sin(a30)) ** 2)   # sisi PR objek (penyelesaian yang lebih panjang)
assert math.isclose(math.dist((pr_o * math.cos(a30), pr_o * math.sin(a30)), (8, 0)), 5)
k = 26  # px per cm
P0 = (40, 190); Q0 = (P0[0] + 8 * k, P0[1]); R0 = (P0[0] + pr_o * k * math.cos(a30), P0[1] - pr_o * k * math.sin(a30))
o = shape([P0, Q0, R0], TR, ['P', 'Q', 'R'], 15, 14)
o += GF.T((P0[0] + Q0[0]) / 2, P0[1] + 22, '8 cm', TR, 15) + GF.T((Q0[0] + R0[0]) / 2 + 12, (Q0[1] + R0[1]) / 2, '5 cm', TR, 15, 'start')
o += GF.T(P0[0] + 54, P0[1] - 12, '30°', TX, 14) + GF.T(150, 34, 'Object', TR, 16)
P1 = (60, 410); Q1 = (P1[0] + 4 * k, P1[1]); R1 = (P1[0] + pr_o / 2 * k * math.cos(a30), P1[1] - pr_o / 2 * k * math.sin(a30))
o += GF.rv(GF.L(P1, Q1, GR, 3.5) + GF.T((P1[0] + Q1[0]) / 2, P1[1] + 22, '4 cm', GR, 15) + GF.T(P1[0] - 14, P1[1], "P'", TX, 15) + GF.T(Q1[0] + 14, Q1[1] + 4, "Q'", TX, 15))
ray = (P1[0] + 170 * math.cos(a30), P1[1] - 170 * math.sin(a30))
o += GF.rv(GF.L(P1, ray, MU3, 2, '6 5') + arc(P1[0], P1[1], 40, 0, 30, AM, True, 2.5) + GF.T(P1[0] + 64, P1[1] - 14, '30°', AM, 14))
o += GF.rv(f'<path d="M{R1[0] - 22:.1f} {R1[1] - 10:.1f} A {2.5 * k:.1f} {2.5 * k:.1f} 0 0 1 {R1[0] + 18:.1f} {R1[1] + 14:.1f}" fill="none" stroke="{PU}" stroke-width="2.5"/>'
           + GF.L(Q1, R1, GR, 3.5) + GF.L(P1, R1, GR, 3.5) + GF.T(R1[0] + 8, R1[1] - 16, "R'", TX, 15) + GF.T((Q1[0] + R1[0]) / 2 + 12, (Q1[1] + R1[1]) / 2 + 4, '2.5 cm', GR, 14, 'start'))
o += GF.T(330, 300, 'Scale drawing', GR, 16)
S(s, 'EXAMPLE 11', 'Constructing a scale drawing',
  p(f'Construct the scale drawing of triangle {i("PQR")} using a scale of 1 : 2.')
  + pen(s, [f'Scale 1 : 2, thus every side of the scale drawing is half of the side of the object: {i("P′Q′")} = 8 cm ÷ 2 = 4 cm and {i("Q′R′")} = 5 cm ÷ 2 = 2.5 cm.',
            f'Draw line {i("P′Q′")} = 4 cm and construct ∠{i("R′P′Q′")} = 30° at {i("P′")}.',
            f'With {i("Q′")} as the centre, draw an arc of radius 2.5 cm that intersects the line of the angle at {i("R′")}. Join {i("Q′R′")}.'])
  + note('For objects with given angles, the angles of the scale drawing must be accurately drawn and the lengths of sides are drawn to scale.'),
  SV(o, 'Triangle PQR with PQ 8 cm, QR 5 cm and angle P 30 degrees, and the construction of its 1 : 2 scale drawing'))

# Contoh 12: lukisan berskala skala 1 : 2 → objek
U = 30
lk = [(0, 0), (5, 0), (5, 3), (3, 1), (1, 1)]
o = GF.T(110, 26, 'Scale drawing', AM, 15) + grid(20, 40, 7, 5, U)
o += shape([gp(20 + U, 40 + 4 * U, U)(q) for q in lk], AM, ["P'", "Q'", "R'", "S'", "T'"], 13, 12, 2.5)
o += GF.rv(grid(70, 205, 12, 8, U) + shape([gp(70 + U, 205 + 7 * U, U)(q) for q in [(a * 2, b * 2) for a, b in lk]], TR, ['P', 'Q', 'R', 'S', 'T'], 15, 14)
           + GF.T(250, 460, 'Actual object', TR, 15))
S(s, 'EXAMPLE 12', 'Drawing the object for a scale drawing',
  p(f'The diagram shows a scale drawing drawn on a grid of equal squares to a scale of 1 : 2. Draw the actual object for {i("P′Q′R′S′T′")}.')
  + pen(s, ['The scale used is 1 : 2, that is the size of scale drawing is two times smaller than the object. Therefore, every side of actual object is two times longer than the sides of the scale drawing.',
            f'{i("PQ")} = 2 × 5 = 10 units, &nbsp;{i("QR")} = 2 × 3 = 6 units.']),
  SV(o, 'Scale drawing P prime Q prime R prime S prime T prime and the actual object two times bigger'))

# Contoh 13: lukisan bunga grid 1 cm → objek pada grid 0.5 cm dan 2 cm
o = ''
u1 = 24
o += GF.T(68, 40 + 4 * u1 + 18, 'Drawing (1 cm)', MU3, 14, halo=False)
o += grid(20, 40, 4, 4, u1) + flower(20 + 2 * u1, 40 + 1.6 * u1, u1, PK)
o += GF.rv(GF.T(204, 40 + 2 * u1 + 18, '(a) 0.5 cm', AM, 14) + grid(180, 40, 4, 4, u1 / 2) + flower(180 + u1, 40 + 0.8 * u1, u1 / 2, PK))
o += GF.rv(GF.T(250, 178 + 8 * u1 + 22, '(b) 2 cm', GR, 15) + grid(154, 178, 4, 4, u1 * 2) + flower(154 + 4 * u1, 178 + 3.2 * u1, u1 * 2, PK))
S(s, 'EXAMPLE 13', 'Objects on grids of different sizes',
  p('The diagram shows the scale drawing of a flower drawn on 1 cm × 1 cm grids. Draw the actual object on grids of (a) 0.5 cm × 0.5 cm (b) 2 cm × 2 cm')
  + pen(s, ['Object must be drawn on grids of different sizes. Thus, the number of units of sides of object is the same as the number of units of sides of scale drawing.',
            'Draw every part of the flower in the squares at the same positions on the grids of (a) 0.5 cm × 0.5 cm and (b) 2 cm × 2 cm.']),
  SV(o, 'Drawing of a flower on a 1 cm grid redrawn on 0.5 cm and 2 cm grids'))

# =====================================================================
# 4.1.4 PENYELESAIAN MASALAH (buku SP 4.1.5)
# =====================================================================
s = '4.1.4'
c = COL[s]
assert 3.5 * 60 == 210 and 210 * 100000 / 3000000 == 7 and 210 / 90 * 60 == 140
S(s, 'EXAMPLE 14', 'Solving problems involving scale drawings',
  p('The distance on a map between Kuantan and Kuala Terengganu is 3.5 cm.')
  + p('(a) If the scale used to draw the map is 1 cm : 60 km, calculate the actual distance, in km, between Kuantan and Kuala Terengganu.')
  + p('(b) If the map is redrawn to a scale of 1 : 3 000 000, calculate the distance between Kuantan and Kuala Terengganu on the new map.')
  + p('(c) Encik Faizal and his family want to visit Kuala Terengganu. If he plans to drive to Kuala Terengganu at a speed of 90 km h<sup>−1</sup>, calculate the time taken to drive from Kuantan to Kuala Terengganu in hours and minutes.'),
  stack(work([('Understanding the problem', ['• Actual distance for 3.5 cm drawn to a scale of 1 cm : 60 km.', '• Distance on scale drawing drawn to a scale of 1 : 3 000 000.',
                                    '• Time in hours and minutes for the journey from Kuantan to Kuala Terengganu at a speed of 90 km h<sup>−1</sup>.']),
              ('Planning a strategy', [f'Scale = {fr("Distance on drawing", "Actual distance")} &emsp; Time = {fr("Distance", "Speed")}'])], s, 1, 18),
        note('If the scale of scale drawing and the requirement of the question are in the same unit, the scale need not be changed to cm.', 'Tips:')))

S(s, 'EXAMPLE 14 (continued)', 'Implementing the strategy',
  work([('(a)', [f'Scale = {fr("Distance on drawing", "Actual distance")}', f'{fr("1 cm", "60 km")} = {fr("3.5 cm", "Actual distance")}', f'Actual distance = {fr("3.5 cm (60 km)", "1 cm")} = 210 km']),
        ('(b)', [f'{fr(1, "3 000 000")} = {fr("Distance on drawing", "210 km")}', f'Distance on drawing = {fr("(210 × 100 000) cm", "(3 000 000) cm")} = 7 cm']),
        ('(c)', [f'Time = {fr("210 km", "90 km h<sup>−1</sup>")} = 2{fr(1, 3)} hours', 'Time taken = 2 hours 20 minutes'])], s, 1, 19),
  stack(work([('Making a conclusion', ['• Actual distance between Kuantan and Kuala Terengganu is 210 km.',
                                      '• Distance between Kuantan and Kuala Terengganu on the map of scale 1 : 3 000 000 is 7 cm.',
                                      '• Time taken for Encik Faizal to drive from Kuantan to Kuala Terengganu at a speed of 90 km h<sup>−1</sup> is 2 hours 20 minutes.'])], s, 1, 18),
        note(f'Speed = {fr("Distance", "Time")}', 'Flashback:')))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'berskala', 'slides_en.js')
HEAD = '/* Nota Bab 4 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip bina_bab4_t3_en.py; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
