"""Bab 8 T3 Loci in Two Dimensions (ENGLISH / DLP): ayat ikut buku teks English, nombor sama dengan versi BM."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX
from rajah2d import circle, dot, seg, ang, rt, tick, ext

SUBS = [{"no": "8.1", "name": "Loci", "col": "#FBBF24"}, {"no": "8.2", "name": "Loci in Two Dimensions", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


def i(s):
    return f'<i>{s}</i>'


def cap(x, y, t, col=MU3, size=15, anchor='middle'):
    return GF.T(x, y, t, col, size, anchor, halo=False)


def grid(x0, y0, cols, rows, u, col='#26344F'):
    o = ''.join(GF.L((x0 + k * u, y0), (x0 + k * u, y0 + rows * u), col, 1.2) for k in range(cols + 1))
    return o + ''.join(GF.L((x0, y0 + k * u), (x0 + cols * u, y0 + k * u), col, 1.2) for k in range(rows + 1))


def lokus(p, q, col=PK, w=3.5, dash=None):
    return GF.L(p, q, col, w, dash)


def arcmark(c, r, a1, a2, col=MU3, w=1.8):
    """lengkok kecil jangka lukis berpusat c (darjah math a1→a2)."""
    p1 = (c[0] + r * math.cos(math.radians(a1)), c[1] - r * math.sin(math.radians(a1)))
    p2 = (c[0] + r * math.cos(math.radians(a2)), c[1] - r * math.sin(math.radians(a2)))
    return f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r:.1f} {r:.1f} 0 0 0 {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="{w}"/>'


def otimes(p, col=PK):
    return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="8" fill="none" stroke="{col}" stroke-width="2.4"/>' + GF.L((p[0] - 5.7, p[1] - 5.7), (p[0] + 5.7, p[1] + 5.7), col, 2.2) + GF.L((p[0] - 5.7, p[1] + 5.7), (p[0] + 5.7, p[1] - 5.7), col, 2.2)


# =====================================================================
# 8.1 LOKUS
# =====================================================================
s = '8.1'
c = COL[s]
o = f'<circle cx="120" cy="140" r="70" fill="none" stroke="{MU3}" stroke-width="10"/>' + f'<circle cx="120" cy="140" r="70" fill="none" stroke="{c}" stroke-width="2.5" stroke-dasharray="6 6"/>'
o += f'<circle cx="120" cy="70" r="8" fill="{PK}"/>' + cap(120, 240, 'Sticker on a tyre: circle', MU3, 14)
o += f'<path d="M260 230 Q 350 40 460 200" fill="none" stroke="{c}" stroke-width="3" stroke-dasharray="7 6"/>' + f'<circle cx="260" cy="230" r="12" fill="{TX}"/>' + cap(360, 240, 'Ball kicked: curve', MU3, 14)
o += f'<path d="M240 430 L240 300" stroke="{c}" stroke-width="3" stroke-dasharray="7 6"/>' + f'<path d="M240 290 L228 330 L252 330 Z" fill="{TR}"/>' + cap(240, 455, 'Rocket launched: straight line', MU3, 14)
S(s, 'DEFINITION', 'Locus',
  p('A coloured sticker is stuck on a bicycle tyre. The shape produced by the sticker when the bicycle is ridden is a circle.')
  + p('The movement of a point on a ball that is kicked produces a curve. The movement of a point on a rocket that is being launched produces a straight line.')
  + de(s, 'A <b>locus</b> is a trace or a path traced by a set of points in a plane or a three-dimensional space that satisfies certain conditions.')
  + note('The shape of a locus in two dimensions can be seen as a straight line, an arc or a curve.'),
  SV(o, 'Loci of points on a tyre, a ball and a rocket'))

# Contoh 1: kipas
o = ''
for k in range(3):
    a = math.radians(90 + 120 * k)
    tip = (130 + 95 * math.cos(a), 220 - 95 * math.sin(a))
    o += f'<path d="M130 220 L{130 + 30 * math.cos(a - 0.4):.1f} {220 - 30 * math.sin(a - 0.4):.1f} L{tip[0]:.1f} {tip[1]:.1f} L{130 + 30 * math.cos(a + 0.4):.1f} {220 - 30 * math.sin(a + 0.4):.1f} Z" fill="{MU}66" stroke="{MU3}" stroke-width="2"/>'
o += f'<circle cx="130" cy="220" r="12" fill="{MU3}"/>' + dot((130, 125), PK, 7) + GF.T(146, 118, 'C', TX, 16)
o += GF.L((250, 220), (290, 220), MU3, 2) + GF.head((250, 220), (292, 220), MU3, 2)
o += circle((380, 220, 95), c, 3.5) + dot((380, 125), PK, 7) + GF.T(396, 118, 'C', TX, 16) + cap(380, 350, 'Locus of point C: circle', c, 15)
S(s, 'EXAMPLE 1', 'Locus of a point on a fan',
  p(f'A point {i("C")} is drawn on a blade of a rotating fan as shown in the diagram. Describe and sketch the locus of point {i("C")}.')
  + pen(s, ['The locus is a circle.']),
  SV(o, 'Point C on a blade of the fan and its locus in the shape of a circle'))

# Contoh 2: papan segi empat tepat → silinder
o = GF.L((110, 70), (110, 400), TX, 5) + GF.T(96, 66, 'N', TX, 16) + GF.T(96, 404, 'M', TX, 16)
o += f'<rect x="110" y="140" width="80" height="190" fill="{PA}55" stroke="{PA}" stroke-width="2.5"/>' + GF.T(204, 134, 'Q', TX, 15) + GF.T(204, 340, 'P', TX, 15) + GF.T(96, 134, 'R', TX, 15) + GF.T(96, 340, 'S', TX, 15)
o += GF.L((330, 70), (330, 400), TX, 4)
o += f'<ellipse cx="330" cy="140" rx="80" ry="20" fill="none" stroke="{c}" stroke-width="3"/>' + f'<path d="M250 330 A80 20 0 0 0 410 330" fill="none" stroke="{c}" stroke-width="3"/>' + f'<path d="M250 330 A80 20 0 0 1 410 330" fill="none" stroke="{c}" stroke-width="2" stroke-dasharray="6 5"/>'
o += GF.L((250, 140), (250, 330), c, 3) + GF.L((410, 140), (410, 330), c, 3) + cap(330, 440, 'Right cylinder', c, 15) + cap(150, 440, 'Board PQRS', PA, 15)
S(s, 'EXAMPLE 2', 'Locus of the side of a rotated board',
  p(f'The diagram on the right shows a pole {i("MN")}. A rectangular board {i("PQRS")} is attached to the pole such that the board {i("PQRS")} can be moved. If side {i("PQ")} is rotated 360° around the pole {i("MN")}, what three-dimensional shape will be formed?')
  + pen(s, [f'The shape formed when side {i("PQ")} is rotated 360° around the pole {i("MN")} is a <b>right cylinder</b>.'])
  + note('Cylinders, spheres, cones, prisms and pyramids are some examples of three-dimensional shapes.', 'Flashback:'),
  SV(o, 'A rectangular board on a pole and the cylinder formed'))

# Contoh 3: semi bulatan → sfera
o = GF.L((110, 70), (110, 400), TX, 5) + GF.T(96, 66, 'N', TX, 16) + GF.T(96, 404, 'M', TX, 16)
o += f'<path d="M110 145 A90 90 0 0 1 110 325 Z" fill="{PA}55" stroke="{PA}" stroke-width="2.5"/>' + GF.T(96, 140, 'R', TX, 15) + GF.T(96, 330, 'P', TX, 15) + GF.T(214, 236, 'Q', TX, 15)
o += GF.L((340, 70), (340, 400), TX, 4) + circle((340, 235, 92), c, 3) + f'<ellipse cx="340" cy="235" rx="92" ry="22" fill="none" stroke="{c}" stroke-width="2" stroke-dasharray="6 5"/>'
o += cap(340, 440, 'Sphere', c, 15) + cap(150, 440, 'Semicircular board PQR', PA, 15)
S(s, 'EXAMPLE 3', 'Locus of a rotated semicircular board',
  p(f'The diagram on the right shows a pole {i("MN")}. A semicircular board {i("PQR")} is attached to the pole such that the board {i("PQR")} can be moved. If the board {i("PQR")} is rotated 360° around the pole {i("MN")}, what three-dimensional shape will be formed?')
  + pen(s, ['The shape formed when the semicircular board is rotated 360° around the pole <i>MN</i> is a <b>sphere</b>.']),
  SV(o, 'A semicircular board on a pole and the sphere formed'))

# =====================================================================
# 8.2 LOKUS DALAM DUA DIMENSI
# =====================================================================
s = '8.2'
c = COL[s]
# (1) jarak tetap dari satu titik
O_ = (250, 230)
o = circle((250, 230, 150), c, 3.5) + dot(O_) + GF.T(264, 244, 'O', TX, 17)
for k in range(12):
    a = math.radians(30 * k + 8)
    q = (250 + 150 * math.cos(a), 230 - 150 * math.sin(a))
    o += GF.T(q[0], q[1], '×', AM, 20)
o += GF.L(O_, (400, 230), MU3, 2, '6 5') + cap(325, 218, '5 cm', MU3, 15)
S(s, 'PROPERTIES', 'Locus of points at a constant distance from a fixed point',
  p(f'The points marked at the same distance from the fixed point {i("O")} form a circle. In general,')
  + de(s, 'The locus of a point that is at a constant distance from a fixed point is a <b>circle</b> centred at the fixed point.'),
  SV(o, 'Points 5 cm from O form a circle'))

# Contoh 4: 2.5 cm
o = dot((250, 230)) + GF.T(236, 244, 'O', TX, 17) + GF.rv(circle((250, 230, 100), PK, 3.5) + GF.L((250, 230), (350, 230), MU3, 2, '6 5') + cap(300, 218, '2.5 cm', MU3, 15) + GF.T(340, 140, 'Locus of P', PK, 16))
S(s, 'EXAMPLE 4', 'Constructing a locus at a constant distance from a point',
  p(f'Construct the locus of point {i("P")} which is always 2.5 cm from a fixed point {i("O")}.')
  + pen(s, [f'Mark point {i("O")}.', 'Measure 2.5 cm for the opening of the compasses.', f'Construct a circle of radius 2.5 cm centred at point {i("O")}.']),
  SV(o, 'The circle of radius 2.5 cm centred at O is the locus of P'))

# (2) sama jarak dari dua titik
P_, Q_ = (130, 260), (370, 260)
o = dot(P_) + dot(Q_) + GF.T(P_[0] - 14, P_[1] + 4, 'P', TX, 17) + GF.T(Q_[0] + 14, Q_[1] + 4, 'Q', TX, 17) + GF.L(P_, Q_, MU3, 2, '6 5')
for d_ in (60, 110, 160):
    h = math.sqrt(max(0, (120 + d_ * 0.4) ** 2 - 120 ** 2)) if False else d_
    for sg in (1, -1):
        X = (250, 260 - sg * h)
        o += GF.T(X[0], X[1], '×', AM, 20)
o += lokus((250, 60), (250, 440), PK) + rt((250, 260), (250, 200), (310, 260), 14) + tick(P_, (250, 260)) + tick((250, 260), Q_) + cap(320, 80, 'Locus', PK, 15)
S(s, 'PROPERTIES', 'Locus of points that are equidistant from two fixed points',
  p(f'The positions of the intersection marks that are equidistant from the fixed points {i("P")} and {i("Q")} form a straight line that passes through the midpoint of {i("PQ")}. In general,')
  + de(s, 'The locus of a point that is equidistant from two fixed points is the <b>perpendicular bisector</b> of the straight line connecting the two fixed points.'),
  SV(o, 'The perpendicular bisector of PQ is the locus equidistant from P and Q'))

# Contoh 5: membina pembahagi dua sama serenjang
M_, N_ = (130, 250), (370, 250); r_ = 160
h = math.sqrt(r_ ** 2 - 120 ** 2)
X1, X2 = (250, 250 - h), (250, 250 + h)
o = dot(M_) + dot(N_) + GF.T(M_[0] - 14, M_[1] + 4, 'M', TX, 17) + GF.T(N_[0] + 14, N_[1] + 4, 'N', TX, 17) + GF.L(M_, N_, MU3, 2, '6 5')
o += GF.rv(arcmark(M_, r_, 32, 52) + arcmark(M_, r_, -52, -32))
o += GF.rv(arcmark(N_, r_, 128, 148) + arcmark(N_, r_, 212, 232))
o += GF.rv(lokus(ext(X2, X1, 40), ext(X1, X2, 40), PK) + rt((250, 250), (250, 200), (300, 250), 14) + GF.T(300, 70, 'Locus of P', PK, 16))
S(s, 'EXAMPLE 5', 'Constructing a locus equidistant from two points',
  p(f'Construct the locus of point {i("P")} which is equidistant from two fixed points {i("M")} and {i("N")}.')
  + pen(s, [f'Mark two small arcs using compasses with an opening of more than half the length of {i("MN")} from point {i("M")}.',
            f'With the same opening of the compasses, mark the intersecting arcs from point {i("N")}.', 'Connect both points of intersection with a straight line.']),
  SV(o, 'Construction of the perpendicular bisector of MN with compasses'))
OUT[-1]['fig'] = OUT[-1]['fig']  # susunan langkah: urutan.json

# Contoh 6: segi tiga sama sisi
P_, R_ = (110, 380), (390, 380); Q_ = (250, 380 - 280 * math.sqrt(3) / 2)
o = '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in (P_, Q_, R_)) + f'" fill="{TR}22" stroke="{TR}" stroke-width="3"/>'
o += GF.T(P_[0] - 14, P_[1] + 6, 'P', TX, 17) + GF.T(R_[0] + 14, R_[1] + 6, 'R', TX, 17) + GF.T(Q_[0], Q_[1] - 16, 'Q', TX, 17)
o += GF.rv(lokus((250, 60), (250, 440), PK) + rt((250, 380), (250, 330), (300, 380), 14) + GF.T(306, 80, 'Locus of X', PK, 16))
S(s, 'EXAMPLE 6', 'Locus in an equilateral triangle',
  p(f'The diagram on the right shows an equilateral triangle {i("PQR")}. Determine the locus of point {i("X")} which is equidistant from point {i("P")} and point {i("R")}.')
  + pen(s, [f'The locus of point {i("X")} which is equidistant from point {i("P")} and point {i("R")} is the perpendicular bisector of the line connecting point {i("P")} and point {i("R")}.']),
  SV(o, 'Equilateral triangle PQR and the locus of X through Q'))

# (3) jarak tetap dari satu garis
u = 30
o = grid(25, 85, 15, 10, u) + GF.L((25, 235), (475, 235), TX, 3.5) + GF.T(16, 235, 'M', TX, 16, 'end') + GF.T(484, 235, 'N', TX, 16, 'start')
for k in range(1, 15):
    o += GF.T(25 + k * u, 235 - 3 * u, '×', AM, 18) + GF.T(25 + k * u, 235 + 3 * u, '×', AM, 18)
o += lokus((25, 145), (475, 145), PK, 2.5) + lokus((25, 325), (475, 325), PK, 2.5) + GF.L((60, 235), (60, 145), MU3, 2) + GF.T(66, 190, '3 units', MU3, 13, 'start')
S(s, 'PROPERTIES', 'Locus of points at a constant distance from a straight line',
  p(f'The locus of a point that is always at the same distance from a straight line, {i("MN")}, is a pair of straight lines parallel to {i("MN")}. In general,')
  + de(s, 'The locus of points that are at a constant distance from a straight line is the <b>straight lines parallel</b> to the straight line.'),
  SV(o, 'Points 3 units from MN form two parallel lines'))

# Contoh 7: 2 unit
o = grid(85, 85, 11, 10, u) + GF.L((85 + u, 235), (85 + 10 * u, 235), TX, 3.5) + dot((85 + u, 235)) + dot((85 + 10 * u, 235))
o += GF.T(85 + u - 12, 235, 'A', TX, 16, 'end') + GF.T(85 + 10 * u + 12, 235, 'B', TX, 16, 'start')
o += GF.rv(lokus((85, 235 - 2 * u), (85 + 11 * u, 235 - 2 * u), PK) + lokus((85, 235 + 2 * u), (85 + 11 * u, 235 + 2 * u), PK) + GF.T(430, 235 - 2 * u, 'Locus of X', PK, 15, 'start') + GF.T(430, 235 + 2 * u, 'Locus of X', PK, 15, 'start'))
S(s, 'EXAMPLE 7', 'Locus at a constant distance from a straight line',
  p(f'The diagram on the right shows a line {i("AB")} drawn on a grid of squares with sides of 1 unit. On the diagram, draw the locus of point {i("X")} which always moves 2 units from the line {i("AB")}.')
  + pen(s, [f'The locus of point {i("X")} which moves 2 units from the line {i("AB")} is a pair of lines parallel to {i("AB")} and 2 units from the line {i("AB")}.']),
  SV(o, 'Line AB on a grid and two parallel lines 2 units away'))

# (4) sama jarak dari dua garis selari
o = GF.L((40, 140), (460, 140), TX, 3.5) + GF.L((40, 340), (460, 340), TX, 3.5) + GF.T(30, 140, 'P', TX, 16, 'end') + GF.T(470, 140, 'Q', TX, 16, 'start') + GF.T(30, 340, 'M', TX, 16, 'end') + GF.T(470, 340, 'N', TX, 16, 'start')
for x_ in (100, 250, 400):
    o += GF.T(x_, 240, '×', AM, 22) + tick((x_, 140), (x_, 240)) + tick((x_, 240), (x_, 340)) + GF.L((x_, 140), (x_, 340), MU, 1.4, '5 5')
o += lokus((40, 240), (460, 240), PK) + cap(250, 225, 'Locus', PK, 15)
S(s, 'PROPERTIES', 'Locus of points that are equidistant from two parallel lines',
  p('It is found that;')
  + bul(s, [f'(a) The locus of points that are equidistant from two parallel lines {i("PQ")} and {i("MN")} is a straight line.', f'(b) The locus is parallel to the straight lines {i("PQ")} and {i("MN")} and it passes through the midpoints of the lines {i("PQ")} and {i("MN")}.'])
  + p('In general,')
  + de(s, 'The locus of points that are <b>equidistant from two parallel straight lines</b> is <b>a straight line that is parallel to and passes through the midpoint</b> of the pair of parallel straight lines.'),
  SV(o, 'The line in the middle of two parallel lines PQ and MN'))

# Contoh 8: AB dan DC 8 unit
u = 34
o = grid(80, 80, 10, 8, u) + f'<rect x="{80 + u}" y="80" width="{8 * u}" height="{8 * u}" fill="none" stroke="{TR}" stroke-width="3"/>'
o += GF.T(80 + u - 8, 66, 'A', TX, 16) + GF.T(80 + 9 * u + 8, 66, 'B', TX, 16) + GF.T(80 + u - 8, 80 + 8 * u + 16, 'D', TX, 16) + GF.T(80 + 9 * u + 8, 80 + 8 * u + 16, 'C', TX, 16)
o += GF.rv(lokus((80 + u, 80 + 4 * u), (80 + 9 * u, 80 + 4 * u), PK) + GF.T(80 + 9 * u + 12, 80 + 4 * u, 'Locus of X', PK, 15, 'start'))
S(s, 'EXAMPLE 8', 'Locus equidistant from two parallel lines',
  p(f'The diagram on the right shows a square {i("ABCD")} drawn on a grid of squares with sides of 1 unit. Describe and draw the locus of {i("X")} which is equidistant from the lines {i("AB")} and {i("DC")}.')
  + pen(s, [f'The locus of point {i("X")} which is equidistant from the lines {i("AB")} and {i("DC")} is the line parallel to {i("AB")} and {i("DC")} and 4 units from the lines {i("AB")} and {i("DC")}.']),
  SV(o, 'Square ABCD with the locus of X in the middle of AB and DC'))

# (5) sama jarak dari dua garis bersilang
Gr = GF.Gr((60, 50, 440, 430), (-4.5, 4.5), (-4.5, 4.5), 2, 2, 1, 1, equal=True)
for v in (-4, -2, 0, 2, 4):
    Gr.add(GF.T(Gr.X(v), Gr.Y(v), '×', AM, 20))
Gr.add(lokus(Gr.P(-4.4, -4.4), Gr.P(4.4, 4.4), PK, 3))
Gr.add(ang(Gr.P(0, 0), Gr.P(3, 0), Gr.P(3, 3), i('a'), GR, 40, 15, 56) + ang(Gr.P(0, 0), Gr.P(0, 3), Gr.P(3, 3), i('b'), GR, 46, 15, 62))
S(s, 'PROPERTIES', 'Locus of points that are equidistant from two intersecting lines',
  p('It is found that;')
  + bul(s, [f'(a) ∠{i("a")} = ∠{i("b")} = 45°.', f'(b) The straight line connecting the pairs of coordinates with equal values bisects the angle of intersection between the {i("x")}-axis and the {i("y")}-axis.'])
  + p('In general,')
  + de(s, 'The locus of a point that is equidistant from two intersecting straight lines is the <b>angle bisector</b> of the angles formed by the intersecting lines.'),
  SV(Gr.svg(), 'Points with equal coordinates form the angle bisector between the axes'))

# Contoh 9: pembahagi dua sama sudut
Pp = (90, 330); Qd = (440, 120); Nd = (460, 360)
uq = ((Qd[0] - Pp[0]), (Qd[1] - Pp[1])); lq = math.hypot(*uq); uq = (uq[0] / lq, uq[1] / lq)
un = ((Nd[0] - Pp[0]), (Nd[1] - Pp[1])); ln = math.hypot(*un); un = (un[0] / ln, un[1] / ln)
A1 = (Pp[0] + 120 * uq[0], Pp[1] + 120 * uq[1]); A2 = (Pp[0] + 120 * un[0], Pp[1] + 120 * un[1])
bis = ((uq[0] + un[0]), (uq[1] + un[1])); lb = math.hypot(*bis); bis = (bis[0] / lb, bis[1] / lb)
Xp = (Pp[0] + 230 * bis[0], Pp[1] + 230 * bis[1])
a_ = lambda p_: math.degrees(math.atan2(-(p_[1] - Pp[1]), p_[0] - Pp[0]))
o = GF.L(Pp, Qd, TX, 3.5) + GF.L(Pp, Nd, TX, 3.5) + GF.T(Pp[0] - 14, Pp[1], 'P', TX, 17) + GF.T(Qd[0] + 12, Qd[1] - 4, 'Q', TX, 17) + GF.T(Nd[0] + 6, Nd[1] + 16, 'N', TX, 17)
o += GF.rv(arcmark(Pp, 120, a_(Nd) - 6, a_(Qd) + 6, MU3) + dot(A1, AM, 4) + dot(A2, AM, 4) + GF.T(A1[0] - 6, A1[1] - 16, 'A₁', AM, 15) + GF.T(A2[0] + 4, A2[1] + 18, 'A₂', AM, 15))
dA = math.dist(A1, Xp)
o += GF.rv(arcmark(A1, dA, math.degrees(math.atan2(-(Xp[1] - A1[1]), Xp[0] - A1[0])) - 12, math.degrees(math.atan2(-(Xp[1] - A1[1]), Xp[0] - A1[0])) + 12) + arcmark(A2, dA, math.degrees(math.atan2(-(Xp[1] - A2[1]), Xp[0] - A2[0])) - 12, math.degrees(math.atan2(-(Xp[1] - A2[1]), Xp[0] - A2[0])) + 12))
o += GF.rv(lokus(Pp, (Pp[0] + 380 * bis[0], Pp[1] + 380 * bis[1]), PK) + GF.T(Pp[0] + 380 * bis[0] - 6, Pp[1] + 380 * bis[1] - 18, 'Locus of X', PK, 15))
S(s, 'EXAMPLE 9', 'Constructing an angle bisector',
  p(f'Construct the locus of point {i("X")} which is equidistant from two straight lines, {i("PQ")} and {i("PN")} intersecting at {i("P")}.')
  + pen(s, [f'Using compasses, mark an arc from point {i("P")} that cuts the straight lines {i("PQ")} and {i("PN")}.',
            f'Mark the points of intersection between the arc and the straight lines {i("PQ")} and {i("PN")} as {i("A")}<sub>1</sub> and {i("A")}<sub>2</sub> respectively.',
            f'Construct the intersecting arcs from points {i("A")}<sub>1</sub> and {i("A")}<sub>2</sub>.', f'Draw a straight line connecting the point of intersection constructed in step 3 and point {i("P")}.']),
  SV(o, 'Construction of the angle bisector of QPN with compasses'))

# Contoh 10: segi empat sama
A_, B_, C_, D_ = (110, 90), (390, 90), (390, 370), (110, 370)
o = '<polygon points="' + ' '.join(f'{x},{y}' for x, y in (A_, B_, C_, D_)) + f'" fill="{TR}18" stroke="{TR}" stroke-width="3"/>'
o += GF.T(96, 80, 'A', TX, 17) + GF.T(404, 80, 'B', TX, 17) + GF.T(404, 384, 'C', TX, 17) + GF.T(96, 384, 'D', TX, 17)
o += GF.rv(lokus(A_, C_, PK) + ang(A_, B_, C_, '', AM, 40) + ang(A_, C_, D_, '', AM, 46) + GF.T(300, 300, 'Locus of Y', PK, 15))
S(s, 'EXAMPLE 10', 'Locus equidistant from two intersecting sides',
  p(f'The diagram on the right shows a square {i("ABCD")}. Describe and draw the locus of point {i("Y")} which moves equidistantly from the line {i("AB")} and the line {i("AD")}.')
  + pen(s, [f'The locus of point {i("Y")} which moves equidistantly from the line {i("AB")} and the line {i("AD")} is the straight line that bisects angle {i("BAD")}.']),
  SV(o, 'Square ABCD and the locus of Y along the diagonal AC'))

# Contoh 11: dua syarat
u = 38; x0, y0 = 95, 70
A_, B_, C_, D_ = (x0, y0), (x0 + 8 * u, y0), (x0 + 8 * u, y0 + 8 * u), (x0, y0 + 8 * u)
o = grid(x0, y0, 8, 8, u) + '<polygon points="' + ' '.join(f'{x},{y}' for x, y in (A_, B_, C_, D_)) + f'" fill="none" stroke="{TR}" stroke-width="3"/>'
o += GF.T(x0 - 12, y0 - 10, 'A', TX, 16) + GF.T(x0 + 8 * u + 12, y0 - 10, 'B', TX, 16) + GF.T(x0 + 8 * u + 12, y0 + 8 * u + 16, 'C', TX, 16) + GF.T(x0 - 12, y0 + 8 * u + 16, 'D', TX, 16)
o += GF.rv(f'<path d="M{x0 + 6 * u} {y0} A{6 * u} {6 * u} 0 0 1 {x0} {y0 + 6 * u}" fill="none" stroke="{PK}" stroke-width="3.5"/>' + GF.T(x0 + 6 * u + 10, y0 + 40, 'Locus of X', PK, 14, 'start'))
o += GF.rv(lokus((x0, y0 + 4 * u), (x0 + 8 * u, y0 + 4 * u), GR) + GF.T(x0 + 8 * u + 8, y0 + 4 * u - 14, 'Locus of Y', GR, 14, 'start'))
xi = math.sqrt(36 - 16)
o += GF.rv(otimes((x0 + xi * u, y0 + 4 * u), AM))
S(s, 'EXAMPLE 11', 'Loci that satisfy two conditions',
  p('The intersection of two or more loci can be determined by constructing each locus stated on the same diagram.')
  + p(f'The diagram on the right shows a square {i("ABCD")} drawn on a grid of squares with sides of 1 unit. Point {i("X")} and point {i("Y")} are two points moving inside the square {i("ABCD")}. On the diagram, draw')
  + bul(s, [f'(a) the locus of point {i("X")} which moves such that its distance is always 6 units from {i("A")}.', f'(b) the locus of point {i("Y")} which moves such that it is always equidistant from the line {i("AB")} and the line {i("CD")}.',
            f'(c) Mark the positions of all the points of intersection of the locus of {i("X")} and the locus of {i("Y")} with the symbol ⊗.']),
  SV(o, 'Square ABCD with the locus of X an arc of radius 6 units and the locus of Y the middle line'))

# Contoh 12: empat segi empat sama 2.5 cm
k = 72; x0, y0 = 110, 85
pts = {'P': (x0, y0), 'Q': (x0 + k, y0), 'R': (x0 + 2 * k, y0), 'S': (x0 + 2 * k, y0 + k), 'T': (x0 + 2 * k, y0 + 2 * k), 'U': (x0 + k, y0 + 2 * k), 'V': (x0, y0 + 2 * k), 'W': (x0, y0 + k), 'M': (x0 + k, y0 + k)}
o = f'<rect x="{x0}" y="{y0}" width="{2 * k}" height="{2 * k}" fill="none" stroke="{TR}" stroke-width="3"/>' + GF.L(pts['Q'], pts['U'], TR, 2.4) + GF.L(pts['W'], pts['S'], TR, 2.4)
for n_, (x, y) in pts.items():
    dx, dy = (x - pts['M'][0]), (y - pts['M'][1]); dd = math.hypot(dx, dy) or 1
    o += GF.T(x + dx / dd * 18 if n_ != 'M' else x + 12, y + dy / dd * 18 if n_ != 'M' else y + 16, n_, TX, 16)
o += GF.T(x0 + k / 2, y0 - 14, '2.5 cm', MU3, 13)
o += GF.rv(circle((pts['M'][0], pts['M'][1], k), PK, 3.5) + GF.T(x0 + 2 * k + 30, y0 + 20, 'Locus of X', PK, 14, 'start'))
o += GF.rv(lokus(pts['P'], pts['T'], GR) + GF.T(x0 + 2 * k + 30, y0 + 2 * k - 10, 'Locus of Y', GR, 14, 'start'))
d_ = k / math.sqrt(2)
o += GF.rv(otimes((pts['M'][0] - d_, pts['M'][1] - d_), AM) + otimes((pts['M'][0] + d_, pts['M'][1] + d_), AM))
S(s, 'EXAMPLE 12', 'Intersection of two loci',
  p(f'The diagram on the right shows four squares with sides of 2.5 cm combined. Point {i("X")} and point {i("Y")} are two points moving in the square {i("PRTV")}. On the diagram, draw')
  + bul(s, [f'(a) the locus of point {i("X")} which moves such that its distance is always 2.5 cm from {i("M")}.', f'(b) the locus of point {i("Y")} which moves such that it is always equidistant from the line {i("PR")} and the line {i("PV")}.',
            f'(c) Mark the positions of all the points of intersection of the locus of {i("X")} and the locus of {i("Y")} with the symbol ⊗.']),
  SV(o, 'Four squares with the locus of X a circle centred at M and the locus of Y the diagonal PT'))

# Contoh 13: klinik (skala 1 cm = 500 m)
k = 60   # px per cm
Ap, Bp = (60, 330), (440, 330); Pq, Qq = (170, 170), (330, 110)
mid = ((Pq[0] + Qq[0]) / 2, (Pq[1] + Qq[1]) / 2); dv = (Qq[0] - Pq[0], Qq[1] - Pq[1]); nb = (-dv[1], dv[0]); ln_ = math.hypot(*nb); nb = (nb[0] / ln_, nb[1] / ln_)
fig13 = GF.L(Ap, Bp, TX, 4) + dot(Ap) + dot(Bp) + GF.T(Ap[0] - 4, Ap[1] + 20, 'A', TX, 16) + GF.T(Bp[0] + 4, Bp[1] + 20, 'B', TX, 16) + cap(250, 352, 'Road', MU3, 14)
fig13 += dot(Pq, AM, 6) + dot(Qq, AM, 6) + GF.T(Pq[0] - 14, Pq[1] - 6, 'P', TX, 16) + GF.T(Qq[0] + 14, Qq[1] - 6, 'Q', TX, 16) + cap(250, 440, 'Scale 1 cm = 500 metres', MU3, 14)
o = fig13
S(s, 'EXAMPLE 13', 'Solving problems involving loci',
  p(f'A clinic will be built in a village. The clinic must be equidistant from house {i("P")} and house {i("Q")}, and 500 metres from a road {i("AB")}. Determine the possible positions of the clinic. (scale 1 cm = 500 metres)')
  + work([('Understanding the problem', [f'The clinic is equidistant from {i("P")} and {i("Q")}, that is the perpendicular bisector of {i("P")} and {i("Q")}.', f'The clinic is 500 metres from the road {i("AB")}. There are two parallel straight lines.']),
          ('Planning a strategy', ['Draw using compasses and a ruler.'])], s, 1, 18),
  SV(o, 'Houses P and Q and road AB'))
L1, L2 = 330 - k, 330 + k
def on_line(yv):
    t = (yv - mid[1]) / nb[1]
    return (mid[0] + nb[0] * t, yv)
o = fig13 + lokus(on_line(105), on_line(430), PK, 3) + tick(Pq, mid) + tick(mid, Qq) + GF.L(Pq, Qq, MU3, 1.6, '5 5') + GF.L((30, L1), (470, L1), GR, 3) + GF.L((30, L2), (470, L2), GR, 3)
o += GF.L((150, 330), (150, L1), MU3, 2) + GF.T(156, (330 + L1) / 2, '500 m', MU3, 13, 'start') + GF.L((150, 330), (150, L2), MU3, 2) + GF.T(156, (330 + L2) / 2, '500 m', MU3, 13, 'start')
o += otimes(on_line(L1), AM) + otimes(on_line(L2), AM) + GF.T(on_line(L1)[0] + 14, L1 - 14, 'Clinic', AM, 14, 'start') + GF.T(on_line(L2)[0] + 14, L2 + 18, 'Clinic', AM, 14, 'start')
S(s, 'EXAMPLE 13 (continued)', 'Implementing the strategy',
  work([('Implementing the strategy', [f'Construct the perpendicular bisector of the line {i("PQ")}.', f'Construct two straight lines parallel to {i("AB")} and 1 cm (500 metres) from {i("AB")}.', 'Mark the points of intersection with the symbol ⊗.']),
        ('Making a conclusion', ['The two positions marked with the symbol ⊗ satisfy the conditions to build the clinic.'])], s, 1, 19),
  SV(o, 'The perpendicular bisector of PQ and two lines parallel to the road, two positions of the clinic'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'lokus', 'slides_en.js')
HEAD = '/* Nota Bab 8 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
