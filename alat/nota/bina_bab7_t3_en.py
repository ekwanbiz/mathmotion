"""Bab 7 T3 Pelan dan Dongakan: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik ikut buku: 7.1 Unjuran Ortogon, 7.2 Pelan dan Dongakan (sama dengan folder pelan).
Pelan dan dongakan dijana automatik daripada model prisma (unjuran.py) supaya sentiasa sepadan dengan objek."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX
from unjuran import Prism, dimline

SUBS = [{"no": "7.1", "name": "Orthogonal Projections", "col": "#38BDF8"}, {"no": "7.2", "name": "Plans and Elevations", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


F = fr


def i(s):
    return f'<i>{s}</i>'


def arrow_lbl(p, q, lb, col=PK):
    return GF.arrow(p, q, col, 3) + GF.T(p[0] + (p[0] - q[0]) * 0.35, p[1] + (p[1] - q[1]) * 0.35, lb, col, 17)


def plane_h(x, y, w, h, sk=60, col=MU):
    """satah mengufuk (segi empat selari)."""
    pts = [(x, y + h), (x + w, y + h), (x + w + sk, y), (x + sk, y)]
    return '<polygon points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) + f'" fill="{col}22" stroke="{col}" stroke-width="2"/>'


def plane_v(x, y, w, h, sk=40, col=MU):
    pts = [(x, y + h), (x + w, y + h - sk), (x + w, y - sk), (x, y)]
    return '<polygon points="' + ' '.join(f'{a:.1f},{b:.1f}' for a, b in pts) + f'" fill="{col}22" stroke="{col}" stroke-width="2"/>'


def cap(x, y, t, col=MU3, size=15):
    return GF.T(x, y, t, col, size, halo=False)


def quad(P, s, cx, cy, method=1, gx=46, gy=30, dims=None):
    """lukisan empat sukuan: kaedah 1 (dongakan sisi di kiri) atau kaedah 2 (dongakan sisi di kanan)."""
    W = P.xmax - P.xmin; d = P.d
    o = GF.L((14, cy), (486, cy), MU, 1.6) + GF.L((cx, 14), (cx, 456), MU, 1.6)
    if method == 1:
        o += P.front(cx + gx, cy - gy, s, TR, 12) + P.plan(cx + gx, cy + gy + s * d, s, AM, 12) + P.side(cx - gx - s * d, cy - gy, s, 'kanan', PK, 12)
        o += GF.L((cx, cy), (cx - s * d - 30, cy + s * d + 30), MU, 1.4) + GF.T(cx - 26, cy + 14, '45°', MU3, 12)
        o += cap(cx + gx + s * W / 2, 30, 'Front elevation', TR, 13) + cap(cx - gx - s * d / 2, 30, 'Side elevation', PK, 13) + cap(cx + gx + s * W / 2, cy + gy + s * d + 36, 'Plan', AM, 13)
    else:
        x0 = cx - gx - s * W
        o += P.front(x0, cy - gy, s, TR, 12) + P.plan(x0, cy + gy + s * d, s, AM, 12) + P.side(cx + gx, cy - gy, s, 'kiri', PK, 12)
        o += GF.L((cx, cy), (cx + s * d + 30, cy + s * d + 30), MU, 1.4) + GF.T(cx + 26, cy + 14, '45°', MU3, 12)
        o += cap(x0 + s * W / 2, 30, 'Front elevation', TR, 13) + cap(cx + gx + s * d / 2, 30, 'Side elevation', PK, 13) + cap(x0 + s * W / 2, cy + gy + s * d + 36, 'Plan', AM, 13)
    return o


# =====================================================================
# 7.1 UNJURAN ORTOGON
# =====================================================================
s = '7.1'
c = COL[s]
P0 = Prism([(0, 0), (4, 0), (2, 2.4)], ['A', 'B', 'F'], ['D', 'C', 'E'], 4)
Pf, Pb, _ = P0.pts3d(110, 330, 62)
o = P0.draw3d(110, 330, 62, c)
o += cap(250, 440, 'ABCD: horizontal plane · ABF, CDE: vertical planes', MU3, 14)
S(s, 'DEFINITION', 'Planes',
  p('You have learnt about two-dimensional and three-dimensional objects. Each object consists of flat surfaces or curved surfaces or both.')
  + de(s, 'A <b>plane</b> is a <b>flat surface</b> on an object. There are three types of planes, namely <b>horizontal plane, vertical plane</b> and <b>inclined plane</b>.')
  + p(f'The diagram on the right shows a right prism where {i("ABCD")} is a horizontal plane. {i("ABF")} and {i("CDE")} are vertical planes. {i("BCEF")} and {i("ADEF")} are inclined planes.'),
  SV(o, 'A right prism with horizontal plane ABCD, vertical planes ABF and CDE, inclined planes BCEF and ADEF'))

M_ = ((Pf[0][0] + Pf[1][0]) / 2, (Pf[0][1] + Pf[1][1]) / 2); N_ = ((Pb[0][0] + Pb[1][0]) / 2, (Pb[0][1] + Pb[1][1]) / 2)
o = P0.draw3d(110, 330, 62, c) + GF.L(Pf[2], M_, AM, 3) + GF.L(Pb[2], N_, AM, 2.4, '6 5') + GF.T(M_[0], M_[1] + 18, 'M', TX, 15) + GF.T(N_[0] + 4, N_[1] + 16, 'N', TX, 15)
o += f'<path d="M{M_[0] + 12:.1f} {M_[1]:.1f} L{M_[0] + 12:.1f} {M_[1] - 12:.1f} L{M_[0]:.1f} {M_[1] - 12:.1f}" fill="none" stroke="{TX}" stroke-width="2"/>'
S(s, 'DEFINITION', 'Normal to the plane',
  p(f'The lines {i("FM")} and {i("EN")} are perpendicular to the lines {i("AB")} and {i("CD")} respectively. The lines {i("FM")} and {i("EN")} are also known as the <b>normal</b> to the plane {i("ABCD")}.')
  + de(s, 'A <b>normal to a plane</b> is a straight line that is <b>perpendicular</b> or that forms a right angle to any <b>line on the plane</b>.'),
  SV(o, 'A right prism with lines FM and EN perpendicular to plane ABCD'))

# Contoh 1: kubus
P1 = Prism([(0, 0), (3, 0), (3, 3), (0, 3)], ['P', 'Q', 'V', 'U'], ['S', 'R', 'W', 'T'], 3)
o = P1.draw3d(120, 380, 78, c)
S(s, 'EXAMPLE 1', 'Normal to the planes of a cube',
  p(f'The diagram on the right shows a cube. State the normal to the following planes. (a) {i("PQRS")} (b) {i("PSTU")} (c) {i("RSTW")} (d) {i("QRTU")}')
  + pen(s, [f'(a) {i("UP")}, {i("VQ")}, {i("WR")}, {i("TS")}', f'(b) {i("QP")}, {i("RS")}, {i("WT")}, {i("VU")}', f'(c) {i("QR")}, {i("PS")}, {i("UT")}, {i("VW")}', f'(d) {i("PV")}, {i("SW")}'], False)
  + note(f'The order of the letters to state a normal is important. {i("TS")} means the line {i("TS")} is perpendicular to the plane {i("PQRS")} at point {i("S")}.', 'Tips:'),
  SV(o, 'Cube PQRSTUVW'))

# Contoh 2: prisma dengan M, N titik tengah
P2 = Prism([(0, 0), (4, 0), (2, 2.6), (0, 2.6)], ['A', 'B', 'G', 'F'], ['D', 'C', 'H', 'E'], 3.6)
Pf, Pb, _ = P2.pts3d(110, 360, 66)
M_ = ((Pf[0][0] + Pf[1][0]) / 2, Pf[0][1]); N_ = ((Pb[0][0] + Pb[1][0]) / 2, Pb[0][1])
o = P2.draw3d(110, 360, 66, c) + GF.L(Pf[2], M_, AM, 2.2, '5 4') + GF.L(Pb[2], N_, AM, 2.2, '5 4') + GF.T(M_[0], M_[1] + 18, 'M', TX, 15) + GF.T(N_[0] + 6, N_[1] + 16, 'N', TX, 15)
S(s, 'EXAMPLE 2', 'Normal to the planes of a prism',
  p(f'The diagram on the right shows a right prism with a rectangular base {i("ABCD")}. {i("M")} and {i("N")} are the midpoints of {i("AB")} and {i("CD")} respectively. Given {i("FG")} = {i("EH")} = {i("DN")} = {i("NC")} = {i("AM")} = {i("MB")}, state the normal to the following planes. (a) {i("ABCD")} (b) {i("ADEF")}')
  + pen(s, [f'(a) {i("FA")}, {i("GM")}, {i("HN")}, {i("ED")}', f'(b) {i("BA")}, {i("CD")}, {i("GF")}, {i("HE")}']),
  SV(o, 'Right prism ABCDEFGH with M and N the midpoints of AB and CD'))

# unjuran ortogon: Rajah 1 dan Rajah 2
o = plane_h(40, 150, 300, 70, 80) + cap(70, 140, 'Diagram 1', MU3, 14)
Q1, R1, P1_ = (150, 200), (250, 190), (250, 70)
o += GF.L(Q1, P1_, AM, 3.5) + GF.L(P1_, R1, PK, 2.4, '6 5') + GF.L(Q1, R1, GR, 4) + GF.T(Q1[0] - 12, Q1[1] + 4, 'Q', TX, 15) + GF.T(P1_[0] + 12, P1_[1] - 4, 'P', TX, 15) + GF.T(R1[0] + 12, R1[1] + 6, 'R', TX, 15)
o += cap(300, 100, 'normal', PK, 14) + cap(330, 200, 'plane ABCD', MU3, 13)
o += plane_h(40, 360, 300, 70, 80) + cap(70, 350, 'Diagram 2', MU3, 14)
S2, R2, P2_, Q2 = (140, 405), (260, 395), (140, 290), (260, 260)
o += GF.L(P2_, Q2, AM, 3.5) + GF.L(P2_, S2, PK, 2.4, '6 5') + GF.L(Q2, R2, PK, 2.4, '6 5') + GF.L(S2, R2, GR, 4)
o += GF.T(P2_[0] - 12, P2_[1], 'P', TX, 15) + GF.T(Q2[0] + 12, Q2[1], 'Q', TX, 15) + GF.T(S2[0] - 12, S2[1] + 6, 'S', TX, 15) + GF.T(R2[0] + 12, R2[1] + 6, 'R', TX, 15)
o += cap(420, 395, 'orthogonal projection', GR, 14) + cap(420, 270, 'object', AM, 14)
S(s, 'DEFINITION', 'Orthogonal projection',
  bul(s, [f'In Diagram 1, {i("PQ")} is a straight line where point {i("Q")} is on the horizontal plane {i("ABCD")}. {i("PR")} is the normal to the plane {i("ABCD")}. The straight line {i("RQ")} on the plane {i("ABCD")} is the orthogonal projection of the straight line {i("PQ")} on the plane {i("ABCD")}.',
            f'In Diagram 2, the lines {i("PS")} and {i("QR")} are normal to the plane {i("ABCD")}. {i("SR")} is the orthogonal projection of the straight line {i("PQ")} on the plane {i("ABCD")}.'])
  + de(s, 'An <b>orthogonal projection</b> is the <b>image</b> formed on a plane when the <b>projection lines</b> from the object are <b>perpendicular</b> to the plane.'),
  SV(o, 'Line PQ and its orthogonal projection on a horizontal plane'))

# unjuran satah 2D dan objek 3D
o = plane_h(20, 330, 200, 80, 70)
sq_ = [(60, 130), (160, 130), (210, 90), (110, 90)]; pr_ = [(60, 400), (160, 400), (210, 360), (110, 360)]
o += '<polygon points="' + ' '.join(f'{a},{b}' for a, b in sq_) + f'" fill="{c}33" stroke="{c}" stroke-width="2.6"/>'
o += '<polygon points="' + ' '.join(f'{a},{b}' for a, b in pr_) + f'" fill="{GR}33" stroke="{GR}" stroke-width="2.6"/>'
for (a, b), (e, f_), lb, lb2 in zip(sq_, pr_, 'EFGH', 'RSTU'):
    o += GF.L((a, b), (e, f_), MU3, 1.6, '6 5') + GF.T(a - 10, b - 10, lb, TX, 14) + GF.T(e - 10, f_ + 14, lb2, TX, 14)
o += cap(130, 446, 'Diagram 4: horizontal plane', MU3, 13)
Pk = Prism([(0, 0), (2.4, 0), (2.4, 1.8), (0, 1.8)], ['P', 'Q', 'V', 'U'], ['S', 'R', 'W', 'T'], 2.2)
o += plane_h(270, 360, 180, 70, 70) + Pk.draw3d(300, 220, 48, c, fs=13)
for x_, y_ in [(300, 220), (415, 220)]:
    o += GF.L((x_, y_), (x_, y_ + 175), MU3, 1.4, '6 5')
o += cap(370, 446, 'Diagram 5: horizontal plane', MU3, 13)
S(s, 'CONCEPT', 'Orthogonal projections of planes and objects',
  p(f'In Diagram 4, object {i("EFGH")} is projected on a horizontal plane and in Diagram 5, a cuboid is projected on a horizontal plane.')
  + table(['Diagram', 'Object', 'Normal to the plane', 'Orthogonal projection'], [['Diagram 4', i('EFGH'), f'{i("ER")}, {i("FS")}, {i("GT")}, {i("HU")}', i('RSTU')],
                                                                         ['Diagram 5', 'Cuboid', 'vertical lines from each vertex of the base', 'rectangle']], c, 17),
  SV(o, 'Plane EFGH and a cuboid projected on a horizontal plane'))

# Contoh 3
o = ''
o += plane_v(20, 70, 70, 120, 30) + f'<rect x="120" y="85" width="60" height="45" fill="{c}33" stroke="{c}" stroke-width="2.4"/>'
o += ''.join(GF.L((120, yy), (60, yy - 8), MU3, 1.4, '5 4') for yy in (85, 130)) + f'<rect x="38" y="70" width="28" height="44" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((230, 108), (190, 108), PK, 3) + cap(100, 230, '(a)', MU3, 15)
o += plane_h(260, 200, 170, 50, 50) + f'<rect x="320" y="70" width="70" height="50" fill="{c}33" stroke="{c}" stroke-width="2.4"/>'
o += ''.join(GF.L((xx, 120), (xx, 225), MU3, 1.4, '5 4') for xx in (320, 390)) + f'<rect x="320" y="212" width="70" height="18" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((355, 30), (355, 62), PK, 3) + cap(355, 280, '(b)', MU3, 15)
o += plane_h(140, 380, 220, 60, 60)
o += f'<path d="M250 300 L215 360 L285 360 Z" fill="{c}33" stroke="{c}" stroke-width="2.4"/>' + GF.L((250, 300), (190, 410), MU3, 1.4, '5 4') + GF.L((250, 300), (330, 410), MU3, 1.4, '5 4')
o += f'<ellipse cx="260" cy="410" rx="70" ry="16" fill="{GR}55" stroke="{GR}" stroke-width="2"/>' + GF.arrow((250, 262), (250, 292), PK, 3) + cap(250, 455, '(c)', MU3, 15)
S(s, 'EXAMPLE 3', 'Orthogonal projection or not',
  p('Each diagram on the right shows a projection of an object on a vertical plane or a horizontal plane. Determine whether the projection formed is an orthogonal projection or not.')
  + pen(s, ['(a) Ya', '(b) Ya', '(c) No, because the lines projected from the object to the plane are <b>not normal</b>.']),
  SV(o, 'Three projections of objects on planes: two with normal lines, one with inclined lines'))

S(s, 'STEPS', 'How to draw an orthogonal projection',
  steps(s, ['Identify the type of plane and the direction in which the object is to be projected.', 'Draw the normal lines from all the vertices of the object to the plane. Make sure the normal lines are straight and perpendicular so that the lengths of the sides of the projection are the same as the lengths of the sides of the object.',
              'Connect the points of intersection of the normal with the plane to draw the shape of the orthogonal projection.', 'Redraw the orthogonal projection with the actual measurements. Label all the vertices and the lengths of the sides.']))

# Contoh 4
P4 = Prism([(0, 0), (7, 0), (7, 2), (5, 2), (3, 5), (0, 5)], ['A', 'B', 'K', 'L', 'G', 'F'], ['D', 'C', 'J', 'I', 'H', 'E'], 4)
s4 = 40
o = P4.draw3d(70, 390, s4, c, fs=15)
Pf, Pb, _ = P4.pts3d(70, 390, s4)
o += dimline(Pf[0], Pf[1], '7 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[0], '5 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[4], '3 cm', MU3, 16, 14, 1)
o += dimline(Pf[3], Pf[2], '2 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '4 cm', MU3, 16, 13, -1) + GF.T(Pf[1][0] + 28, (Pf[1][1] + Pf[2][1]) / 2, '2 cm', MU3, 13, 'start')
o += arrow_lbl((Pf[4][0] + 30, 40), (Pf[4][0] + 30, 80), 'Z') + arrow_lbl((470, 300), (440, 300), 'X') + arrow_lbl((Pf[0][0] + 120, 455), (Pf[0][0] + 120, 430), 'Y')
S(s, 'EXAMPLE 4', 'Drawing orthogonal projections',
  p(f'The diagram on the right shows a right prism with a rectangular base {i("ABCD")} on a horizontal plane. The surface {i("ABKLGF")} is the uniform cross section of the prism. The sides {i("AF")} and {i("BK")} are vertical.')
  + p('Draw the orthogonal projection of the object on')
  + bul(s, [f'(a) a horizontal plane as viewed from direction {i("Z")}.', f'(b) a vertical plane as viewed from direction {i("X")}.', f'(c) a vertical plane as viewed from direction {i("Y")}.']),
  SV(o, 'Right prism with cross section ABKLGF and viewing directions X, Y, Z'))
s4b = 24
o = cap(110, 30, '(a) Direction Z: horizontal plane', AM, 14) + P4.plan(30, 150, s4b, AM, 12) + dimline((30, 150), (30 + 7 * s4b, 150), '7 cm', MU3, 30, 12, -1) + dimline((30 + 7 * s4b, 150), (30 + 7 * s4b, 150 - 4 * s4b), '4 cm', MU3, 30, 12, -1)
o += cap(380, 30, '(b) Direction X: vertical plane', PK, 14) + P4.side(330, 200, s4b, 'kanan', PK, 12) + dimline((330, 200), (330 + 4 * s4b, 200), '4 cm', MU3, 18, 12, -1)
o += cap(200, 270, '(c) Direction Y: vertical plane', TR, 14) + P4.front(110, 440, s4b, TR, 12) + dimline((110, 440), (110 + 7 * s4b, 440), '7 cm', MU3, 14, 12, -1)
S(s, 'EXAMPLE 4 (continued)', 'Orthogonal projections of a prism',
  p('<b>Solution:</b>')
  + bul(s, [f'(a) The order of the letters follows the viewing direction. Point {i("D")} is below point {i("E")} when viewed from direction {i("Z")}, thus it is written as {i("E")}/{i("D")}.',
            f'(b) Point {i("A")} is behind point {i("B")} when viewed from direction {i("X")}, thus it is written as {i("B")}/{i("A")}.',
            f'(c) Point {i("D")} is behind point {i("A")} when viewed from direction {i("Y")}, thus it is written as {i("A")}/{i("D")}.']),
  SV(o, 'Orthogonal projections of a prism from directions Z, X and Y'))

# Contoh 5: silinder diameter 5, tinggi 7
o = ''
cx_, top, bot, rx, ry = 110, 110, 330, 62, 18
o += f'<ellipse cx="{cx_}" cy="{bot}" rx="{rx}" ry="{ry}" fill="{c}22" stroke="{c}" stroke-width="2.6"/>'
o += f'<rect x="{cx_ - rx}" y="{top}" width="{2 * rx}" height="{bot - top}" fill="{c}22" stroke="none"/>' + GF.L((cx_ - rx, top), (cx_ - rx, bot), c, 2.6) + GF.L((cx_ + rx, top), (cx_ + rx, bot), c, 2.6)
o += f'<ellipse cx="{cx_}" cy="{top}" rx="{rx}" ry="{ry}" fill="#1B2A44" stroke="{c}" stroke-width="2.6"/>'
o += GF.T(cx_ - rx - 10, top - 10, 'D', TX, 14) + GF.T(cx_ + rx + 10, top - 10, 'C', TX, 14) + GF.T(cx_ - rx - 10, bot + 6, 'A', TX, 14) + GF.T(cx_ + rx + 10, bot + 6, 'B', TX, 14)
o += GF.T(cx_ - rx - 14, (top + bot) / 2, '7 cm', MU3, 14, 'end') + GF.T(cx_, bot + 36, '5 cm', MU3, 14) + arrow_lbl((cx_, 40), (cx_, 78), 'Z') + arrow_lbl((cx_, 430), (cx_, 395), 'Y')
o += cap(360, 36, '(a) Direction Z', AM, 14) + f'<circle cx="360" cy="125" r="70" fill="{AM}22" stroke="{AM}" stroke-width="2.6"/>' + GF.T(286, 132, 'A', TX, 14) + GF.T(436, 132, 'B', TX, 14) + dimline((290, 200), (430, 200), '5 cm', MU3, 4, 13, -1)
o += cap(360, 240, '(b) Direction Y', PK, 14) + f'<rect x="325" y="260" width="70" height="98" fill="{PK}22" stroke="{PK}" stroke-width="2.6"/>'
o += GF.T(316, 262, 'D', TX, 14) + GF.T(404, 262, 'C', TX, 14) + GF.T(316, 360, 'A', TX, 14) + GF.T(404, 360, 'B', TX, 14) + GF.T(405, 309, '7 cm', MU3, 13, 'start') + GF.T(360, 380, '5 cm', MU3, 13)
o += GF.T(360, 440, 'Scale: 1 cm represents 14 px', MU, 12, halo=False)
S(s, 'EXAMPLE 5', 'Orthogonal projections of a cylinder',
  p(f'The diagram on the right shows a cylinder on a horizontal plane. Given that the diameter of the cylinder is 5 cm and its height is 7 cm, draw the orthogonal projection of the cylinder on')
  + bul(s, [f'(a) a horizontal plane as viewed from direction {i("Z")}.', f'(b) a vertical plane as viewed from direction {i("Y")}.'])
  + pen(s, ['(a) The orthogonal projection is a circle of diameter 5 cm.', '(b) The orthogonal projection is a rectangle 5 cm × 7 cm.']),
  SV(o.replace(GF.T(360, 440, 'Scale: 1 cm represents 14 px', MU, 12, halo=False), ''), 'A cylinder and its orthogonal projections: a circle from above and a rectangle from the front'))

# Contoh 6: keratan rentas segi tiga URQ, QR 8, UR 6, PQ 3
assert math.hypot(8, 6) == 10
P6 = Prism([(0, 0), (8, 0), (8, 6)], ['Q', 'R', 'U'], ['P', 'S', 'T'], 3)
o = P6.draw3d(50, 330, 38, c)
Pf, Pb, _ = P6.pts3d(50, 330, 38)
o += dimline(Pf[0], Pf[1], '8 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pf[2], '6 cm', MU3, 16, 14, -1) + dimline(Pf[0], Pb[0], '3 cm', MU3, 14, 13, 1)
o += arrow_lbl((Pf[2][0] + 22, 40), (Pf[2][0] + 22, 80), 'Z') + arrow_lbl((Pf[0][0] + 150, 440), (Pf[0][0] + 150, 405), 'X')
S(s, 'EXAMPLE 6', 'Lengths of sides and sizes of angles of projections',
  p(f'The diagram on the right shows a right prism with a rectangular base {i("PQRS")} on a horizontal plane. The plane {i("URQ")} is the uniform cross section of the object.')
  + p(f'(a) Draw to full scale the orthogonal projection of the prism on (i) a horizontal plane as viewed from direction {i("Z")}. (ii) a vertical plane as viewed from direction {i("X")}.')
  + p('(b) State your conclusion about the lengths of sides and the sizes of angles of the object and its respective orthogonal projections. Explain your conclusion.'),
  SV(o, 'Right prism with a right-angled triangle cross section URQ'))
s6 = 30
o = cap(140, 40, '(a)(i) Direction Z', AM, 14) + P6.plan(40, 170, s6, AM, 12) + dimline((40, 170), (40 + 8 * s6, 170), '8 cm', MU3, 30, 12, -1) + dimline((40 + 8 * s6, 170), (40 + 8 * s6, 170 - 3 * s6), '3 cm', MU3, 36, 12, -1)
o += cap(140, 225, '(a)(ii) Direction X', TR, 14) + P6.front(50, 430, s6, TR, 12) + GF.T(50 + 8 * s6 + 30, 430 - 3 * s6, '6 cm', MU3, 13, 'start') + GF.T(50 + 4 * s6, 456, '8 cm', MU3, 13) + GF.T(50 + 4 * s6 - 20, 430 - 3 * s6 - 18, '10 cm', MU3, 13)
o += f'<path d="M{50 + 8 * s6 - 12} 430 L{50 + 8 * s6 - 12} 418 L{50 + 8 * s6} 418" fill="none" stroke="{TX}" stroke-width="2"/>'
S(s, 'EXAMPLE 6 (continued)', 'Conclusion',
  work([('(b)(i)', [f'The lengths of sides {i("TU")}, {i("SR")}, {i("PQ")}, {i("PS")} and {i("QR")} and the size of the right angles do not change in the orthogonal projection as viewed from direction {i("Z")}. The lengths of sides {i("TP")} and {i("UQ")} change.']),
        ('(b)(ii)', [f'The lengths of sides {i("TP")}, {i("UQ")}, {i("PS")}, {i("QR")}, {i("TS")} and {i("UR")} and the sizes of all the angles do not change in the orthogonal projection as viewed from direction {i("X")}.'])], s, 1, 18)
  + de(s, 'In general, the lengths of sides and the sizes of angles in the orthogonal projection of an object differ according to the viewing direction.'),
  SV(o, 'Plan of the prism from direction Z and the projection of the triangle from direction X'))

# =====================================================================
# 7.2 PELAN DAN DONGAKAN
# =====================================================================
s = '7.2'
c = COL[s]
PP = Prism([(0, 0), (4, 0), (4, 4), (3, 4), (3, 2), (1, 2), (1, 3), (0, 3)], list('ABCDEFGH'), list('JKLMNOPI'), 4)
o = PP.draw3d(70, 380, 44, TR, fs=14)
Pf, Pb, _ = PP.pts3d(70, 380, 44)
o += arrow_lbl((Pf[3][0] + 40, 40), (Pf[3][0] + 40, 78), 'Z') + arrow_lbl((Pf[0][0] + 88, 455), (Pf[0][0] + 88, 425), 'X') + arrow_lbl((475, 290), (445, 290), 'Y')
S(s, 'DEFINITION', 'Plans and elevations',
  p('You have learnt that the orthogonal projection of an object or a solid can be drawn on a horizontal plane and a vertical plane.')
  + de(s, 'The <b>orthogonal projection</b> on a <b>horizontal plane</b> viewed from the top is known as the <b>plan</b>. The <b>orthogonal projection</b> on a <b>vertical plane</b> viewed from the side or the front is known as the <b>elevation</b>.')
  + p('Orthogonal projection drawings give accurate information about the design and the size of an object.')
  + note('Full scale means the actual measurements.', 'Tips:'),
  SV(o, 'Right prism with viewing directions X, Y and Z'))
s0 = 26
o = cap(90, 30, 'Plan (direction Z)', AM, 14) + PP.plan(30, 160, s0, AM, 12)
o += cap(360, 30, 'Front elevation (direction X)', TR, 14) + PP.front(300, 170, s0, TR, 12)
o += cap(140, 250, 'Side elevation (direction Y)', PK, 14) + PP.side(80, 400, s0, 'kanan', PK, 12)
o += cap(370, 300, 'Solid line: visible side', MU3, 13) + cap(370, 325, 'Dashed line: hidden side', MU3, 13)
S(s, 'CONCEPT', 'Drawing plans and elevations to scale',
  p(f'The previous diagram shows a right prism with a rectangular base {i("ABKJ")} on a horizontal plane. {i("ABCDEFGH")} is the uniform cross section of the prism. The plan can be drawn as viewed from direction {i("Z")} and the elevations can be drawn as viewed from direction {i("X")} and direction {i("Y")}.')
  + bul(s, [f'<b>Plan</b>: all sides are drawn with <b>solid lines</b> because they can be seen from the top view.', f'<b>Front elevation</b>: all sides are drawn with solid lines because they can be seen from direction {i("X")}.',
            f'<b>Side elevation</b>: the lines {i("GP")}, {i("HI")}, {i("EN")} and {i("FO")} are drawn with <b>dashed lines</b> because the sides are hidden from view as viewed from direction {i("Y")}.']),
  SV(o, 'Plan, front elevation and side elevation of a right prism'))

# kaedah empat sukuan
o = ''
for k, (x0, ttl, tl, tr_, bl, br) in enumerate([(20, 'Method 1', 'Side elevation', 'Front elevation', '45°', 'Plan'), (260, 'Method 2', 'Front elevation', 'Side elevation', 'Plan', '45°')]):
    cx_, cy_ = x0 + 110, 230
    o += cap(cx_, 70, ttl, c, 16) + GF.L((x0, cy_), (x0 + 220, cy_), MU, 1.6) + GF.L((cx_, 100), (cx_, 360), MU, 1.6)
    o += cap(cx_ - 55, 130, 'Second Quadrant', MU3, 12) + cap(cx_ + 55, 130, 'First Quadrant', MU3, 12) + cap(cx_ - 55, 330, 'Third Quadrant', MU3, 12) + cap(cx_ + 55, 330, 'Fourth Quadrant', MU3, 12)
    o += cap(cx_ - 55, 185, tl, PK if 'Side' in tl else TR, 14) + cap(cx_ + 55, 185, tr_, PK if 'Side' in tr_ else TR, 14)
    o += cap(cx_ - 55, 280, bl, AM, 14) + cap(cx_ + 55, 280, br, AM, 14)
    o += GF.L((cx_, cy_), (cx_ - 70, cy_ + 70), MU3, 1.4) if k == 0 else GF.L((cx_, cy_), (cx_ + 70, cy_ + 70), MU3, 1.4)
S(s, 'CONCEPT', 'Plans and elevations in four quadrants',
  p('The drawings of a plan, a front elevation and a side elevation of an object can also be combined on a piece of paper divided into four quadrants.')
  + bul(s, ['The position of the front elevation is at the top of the plan. The side elevation is drawn on the left or the right of the front elevation, according to the viewing direction.',
            'In method 1, the side view is from right to left. Thus, the position of this elevation is on the left of the front elevation.',
            'In method 2, the side view is from left to right. Thus, the position of this elevation is on the right of the front elevation.']),
  SV(o, 'Method 1 and method 2 arrangements of the plan and elevations in four quadrants'))

# Contoh 7
P7 = Prism([(0, 0), (5, 0), (5, 6), (3, 4), (0, 4)], ['A', 'B', 'H', 'G', 'F'], ['D', 'C', 'I', 'J', 'E'], 4)
o = P7.draw3d(60, 390, 40, TR, fs=15)
Pf, Pb, _ = P7.pts3d(60, 390, 40)
o += dimline(Pf[0], Pf[1], '5 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[0], '4 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '3 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '4 cm', MU3, 16, 13, -1)
o += GF.T(Pf[1][0] + 30, (Pf[1][1] + Pf[2][1]) / 2, '6 cm', MU3, 13, 'start')
o += arrow_lbl((Pf[0][0] + 100, 455), (Pf[0][0] + 100, 425), 'X') + arrow_lbl((475, 250), (445, 250), 'Y')
S(s, 'EXAMPLE 7', 'Drawing plans and elevations',
  p(f'The diagram on the right shows a right prism with a rectangular base {i("ABCD")} on a horizontal plane. {i("ABHGF")} is the uniform cross section of the prism. The sides {i("AF")} and {i("BH")} are vertical. Draw to full scale')
  + bul(s, ['(a) the plan of the prism.', f'(b) the elevation of the prism as viewed from {i("X")}.', f'(c) the elevation of the prism as viewed from {i("Y")}.']),
  SV(o, 'Right prism with cross section ABHGF'))
o = quad(P7, 24, 180, 230, 1)
S(s, 'EXAMPLE 7 (continued)', 'Solution',
  steps(s, [f'The direction of the side elevation (direction {i("Y")}) is to the left, thus the side elevation is in the second quadrant.', 'Draw the plan to full scale in the fourth quadrant.',
            f'Project the sides of the plan with thin lines to the first quadrant as a guide to draw the front elevation (direction {i("X")}).', 'Project the sides of the front elevation and the plan to the second quadrant to draw the side elevation.'])
  + note(f'In the side elevation, the line at level {i("G")}/{i("F")} is drawn with a dashed line because it is hidden by the surface {i("BHIC")}.', 'Reminder:'),
  SV(o, 'Plan, front elevation and side elevation of a prism in four quadrants, method 1'))

# Contoh 8
P8 = Prism([(0, 0), (6, 0), (6, 3), (4, 5), (0, 5), (0, 3)], ['A', 'B', 'G', 'H', 'I', 'F'], ['D', 'C', 'L', 'K', 'J', 'E'], 5)
o = P8.draw3d(70, 395, 36, TR, fs=15)
Pf, Pb, _ = P8.pts3d(70, 395, 36)
o += dimline(Pf[0], Pf[1], '6 cm', MU3, 18, 14, -1) + dimline(Pf[5], Pf[0], '3 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '4 cm', MU3, 14, 13, 1) + dimline(Pf[1], Pb[1], '5 cm', MU3, 16, 13, -1)
o += GF.T(Pf[5][0] - 14, (Pf[4][1] + Pf[5][1]) / 2, '2 cm', MU3, 13, 'end')
o += arrow_lbl((Pf[0][0] + 108, 455), (Pf[0][0] + 108, 425), 'X') + arrow_lbl((22, 400), (52, 400), 'Y')
S(s, 'EXAMPLE 8', 'Combination of a cuboid and a right prism',
  p(f'The diagram on the right shows a combination of a cuboid and a right prism with a rectangular base {i("ABCD")} on a horizontal plane. {i("ABGHIF")} is the uniform cross section of the object. The sides {i("AF")}, {i("FI")} and {i("BG")} are vertical. Draw to full scale')
  + bul(s, ['(a) the plan of the object.', f'(b) the elevation of the object as viewed from {i("X")}.', f'(c) the elevation of the object as viewed from {i("Y")}.']),
  SV(o, 'Combination of a cuboid and a right prism with cross section ABGHIF'))
o = quad(P8, 24, 230, 205, 2)
S(s, 'EXAMPLE 8 (continued)', 'Solution',
  p(f'The direction of the side elevation (direction {i("Y")}) is from left to right, thus the side elevation is in the first quadrant.')
  + steps(s, ['Draw the plan to full scale in the third quadrant.', 'Project the sides of the plan upwards to draw the front elevation in the second quadrant.',
              'Project the sides of the plan through the 45° line and the sides of the front elevation to the first quadrant to draw the side elevation.'])
  + note('Thick solid lines for visible sides. Dashed lines for hidden sides. Thin solid lines for construction lines.', 'Tips:'),
  SV(o, 'Plan, front elevation and side elevation in four quadrants, method 2'))

# Contoh 9: mensintesis
P9 = Prism([(0, 0), (4, 0), (4, 3), (2.5, 3), (2.5, 2), (1.5, 2), (1.5, 3), (0, 3)], list('ABCDEFGH'), list('JKLMNPQR'), 3)
o = quad(P9, 26, 220, 175, 1)
S(s, 'EXAMPLE 9', 'Synthesising plans and elevations',
  p('The drawings of plans and elevations on four quadrants that are connected to one another can be used to sketch the three-dimensional shape of the object easily.')
  + p('The diagram on the right shows the plan, front elevation and side elevation of a right prism with a rectangular base. A cuboid block has been removed from the prism. Sketch the three-dimensional shape of the prism.')
  + note('Actual measurements: width 4 cm, depth 3 cm, height 3 cm. The cuboid block removed measures 1 cm × 1 cm × 3 cm.', 'Given:'),
  SV(o, 'Plan and elevations of a right prism with a cuboid block removed'))
o = P9.draw3d(70, 360, 62, TR, fs=15)
Pf, Pb, _ = P9.pts3d(70, 360, 62)
o += dimline(Pf[0], Pf[1], '4 cm', MU3, 18, 14, -1) + dimline(Pf[7], Pf[0], '3 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pb[1], '3 cm', MU3, 16, 13, -1) + dimline(Pf[5], Pf[4], '1 cm', MU3, 12, 13, -1)
S(s, 'EXAMPLE 9 (continued)', 'Sketching the three-dimensional shape',
  p('The side elevation is in the second quadrant. Thus, the side elevation is viewed from the right.')
  + steps(s, ['Sketch the three given orthogonal projections on the related planes using the actual measurements.', 'Project the surfaces so that they meet.',
              'Sketch the object and label the related vertices with the letters in the projections.', 'Complete the sketch of the object by labelling the lengths of the sides.']),
  SV(o, 'Three-dimensional sketch of a right prism with a groove at the top'))

# Contoh 10: gabungan kuboid dan prisma, sudut 60°
hJ = 1.5 + 4 * math.sin(math.radians(60))
P10 = Prism([(0, 0), (7, 0), (7, 1.5), (2, hJ), (0, 1.5)], ['A', 'B', 'G', 'J', 'F'], ['D', 'C', 'H', 'I', 'E'], 4.5)
o = quad(P10, 22, 240, 195, 2)
S(s, 'EXAMPLE 10', 'Sketching combined objects',
  p('The diagram on the right shows the plan, front elevation and side elevation of a combination of a cuboid and a right prism. Sketch the three-dimensional shape of the combined object.')
  + note(f'{i("AB")} = 7 cm, {i("AF")} = 1.5 cm, {i("BC")} = 4.5 cm, {i("FJ")} = 4 cm and ∠{i("JFG")} = 60°.', 'Given:')
  + p('The side elevation is in the first quadrant. Thus, the side elevation is viewed from left to right.'),
  SV(o, 'Plan and elevations of a combination of a cuboid and a right prism'))
o = P10.draw3d(60, 380, 40, TR, fs=15)
Pf, Pb, _ = P10.pts3d(60, 380, 40)
o += dimline(Pf[0], Pf[1], '7 cm', MU3, 18, 14, -1) + dimline(Pf[4], Pf[3], '4 cm', MU3, 16, 14, 1) + dimline(Pf[1], Pb[1], '4.5 cm', MU3, 16, 13, -1)
o += GF.T(Pf[0][0] - 14, (Pf[0][1] + Pf[4][1]) / 2, '1.5 cm', MU3, 13, 'end')
o += f'<path d="M{Pf[4][0] + 30:.1f} {Pf[4][1]:.1f} A30 30 0 0 0 {Pf[4][0] + 15:.1f} {Pf[4][1] - 26:.1f}" fill="none" stroke="{AM}" stroke-width="2"/>' + GF.T(Pf[4][0] + 44, Pf[4][1] - 16, '60°', AM, 14)
S(s, 'EXAMPLE 10 (continued)', 'Sketching combined objects',
  steps(s, ['Sketch the three given orthogonal projections on the related planes using the actual measurements. This question contains a 60° angle on a triangular surface. Thus, the 60° angle must be constructed with the correct method.',
            'Connect the vertices to produce the combined object. Label the vertices according to the projections.', 'Draw the combined object with accurate measurements and label the vertices and the lengths of the sides.']),
  SV(o, 'Three-dimensional sketch of a combination of a cuboid and a right prism with a 60 degree angle'))

# Contoh 11: kuboid 9 × 5 × 4, prisma trapezium dikeluarkan
FG = math.hypot(1, 2); Vk, Vr = 9 * 5 * 4, (5 + 4) / 2 * 2 * 5
assert f'{FG:.1f}' == '2.2' and Vk == 180 and Vr == 45 and (Vk - Vr) == 135
P11 = Prism([(0, 0), (9, 0), (9, 4), (5, 4), (5, 2), (1, 2), (0, 4)], ['A', 'B', 'N', 'K', 'J', 'G', 'F'], ['D', 'C', 'M', 'L', 'I', 'H', 'E'], 5)
o = quad(P11, 20, 215, 170, 1) + cap(350, 432, 'FK = 5 cm, GJ = 4 cm,', MU3, 13) + cap(350, 452, 'groove depth 2 cm, BC = 5 cm', MU3, 13)
S(s, 'EXAMPLE 11', 'Solving problems involving plans and elevations',
  p('The diagram on the right shows the plan, front elevation and side elevation of a right prism.')
  + bul(s, ['(a) Draw the right prism to full scale.', f'(b) State the length of side {i("FG")}, in cm, correct to one decimal place.',
            f'(c) Originally, the prism was a cuboid measuring 9 cm × 5 cm × 4 cm. Calculate the volume of the right prism {i("EFGHIJKL")}, in cm<sup>3</sup>, that has been removed from the cuboid.',
            '(d) State the ratio of the volume of the right prism removed to the right prism that you drew in question (a).'])
  ,
  SV(o, 'Plan and elevations of a right prism produced from a cuboid'))
o = P11.draw3d(75, 380, 31, TR, fs=14)
Pf, Pb, _ = P11.pts3d(75, 380, 31)
o += dimline(Pf[0], Pf[1], '9 cm', MU3, 18, 14, -1) + dimline(Pf[6], Pf[0], '4 cm', MU3, 18, 14, -1) + dimline(Pf[1], Pb[1], '5 cm', MU3, 16, 13, -1)
S(s, 'EXAMPLE 11 (continued)', 'Solution',
  work([('(b)', [f'{i("FG")} = 2.2 cm']),
        ('(c)', ['Volume of the prism removed', f'= {F(1, 2)}(2 cm)(4 + 5) cm × 5 cm', '= 45 cm<sup>3</sup>']),
        ('(d)', ['Volume of the right prism drawn', f'= Volume of the cuboid − volume of prism {i("EFGHIJKL")}', '= (9 cm × 5 cm × 4 cm) − 45 cm<sup>3</sup>', '= 180 cm<sup>3</sup> − 45 cm<sup>3</sup>',
                 '= 135 cm<sup>3</sup>', 'Thus, the ratio 45 : 135 = 1 : 3'])], s, 1, 17),
  SV(o, 'Three-dimensional sketch of the right prism (a)'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pelan', 'slides_en.js')
HEAD = '/* Nota Bab 7 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
