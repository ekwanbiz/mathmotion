"""Bab 6 T3 Angles and Tangents of Circles (ENGLISH / DLP): ayat ikut buku teks English, nombor sama dengan versi BM."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
import rajah2d as RJ
from rajah2d import P as Pc, circle, lab, seg, ang, angbig, arc, rt, tick, side, labp, ext, dot, poly, tangent
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, RD

SUBS = [{"no": "6.1", "name": "Angles at the Circumference & Central Angles", "col": "#38BDF8"}, {"no": "6.2", "name": "Cyclic Quadrilaterals", "col": "#A78BFA"},
        {"no": "6.3", "name": "Tangents to Circles", "col": "#34D399"}, {"no": "6.4", "name": "Angles and Tangents", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


def i(s):
    return f'<i>{s}</i>'


def an(s):
    return f'∠{i(s)}'


F = fr
C0 = (250, 240, 165)       # bulatan utama rajah
NTS = GF.T(250, 456, 'Diagram not drawn to scale', MU, 14, halo=False)


def chords(c, pairs, col=TX, w=3):
    return ''.join(seg(Pc(c, a), Pc(c, b), col, w) for a, b in pairs)


def labs(c, d, off=20, size=17):
    return ''.join(lab(c, a, s, off, TX, size) for s, a in d.items())


# =====================================================================
# 6.1 SUDUT PADA LILITAN DAN SUDUT PUSAT
# =====================================================================
s = '6.1'
c = COL[s]
cA = (130, 190, 95)
o = circle(cA) + chords(cA, [(200, 95), (95, -20)], c) + arc(cA, 200, 340, PK, 5) + labs(cA, {'P': 200, 'Q': 95, 'R': -20})
o += ang(Pc(cA, 95), Pc(cA, 200), Pc(cA, -20), '', AM, 26) + GF.T(130, 312, 'Arc PR', PK, 15) + GF.T(130, 40, 'Diagram 1', MU3, 15)
cB = (370, 250, 100)
o += circle(cB) + chords(cB, [(200, 150), (150, 60), (200, 110), (110, 60)], c) + arc(cB, 200, 60, AM, 5) + arc(cB, 110, 150, GR, 5)
o += labs(cB, {'P': 200, 'Q': 150, 'R': 110, 'S': 60}) + GF.T(370, 392, 'major arc PS', AM, 14) + GF.T(370, 412, 'minor arc RQ', GR, 14) + GF.T(370, 440, 'Diagram 2', MU3, 15)
S(s, 'DEFINITION', 'Angles at the circumference of a circle',
  p(f'Diagram 1 shows two chords, {i("PQ")} and {i("QR")} that meet at point {i("Q")} on the circumference of the circle.')
  + de(s, f'{an("PQR")} is an <b>angle at the circumference of the circle</b> <b>subtended</b> by arc {i("PR")}.')
  + p('In Diagram 2,')
  + bul(s, [f'(a) {an("PQS")} and {an("PRS")} are angles at the circumference of the circle subtended by <b>major arc</b> {i("PS")}.',
            f'(b) {an("QPR")} and {an("QSR")} are angles at the circumference of the circle subtended by <b>minor arc</b> {i("RQ")}.']),
  SV(o, 'Diagram 1 angle PQR subtended by arc PR, Diagram 2 angles subtended by the major arc and the minor arc'))

o = circle(C0) + arc(C0, 235, 305, PK, 6)
Pp, Qp = Pc(C0, 235), Pc(C0, 305)
for d, col in [(150, TR), (95, AM), (40, GR)]:
    V = Pc(C0, d); o += seg(Pp, V, col) + seg(Qp, V, col) + ang(V, Pp, Qp, '', col, 30)
o += labs(C0, {'P': 235, 'Q': 305, 'S': 150, 'R': 40, 'T': 95})
o += GF.T(250, 456, '∠PRQ = ∠PSQ = ∠PTQ', AM, 18)
S(s, 'PROPERTIES', 'Angles subtended by the same arc',
  p('In general,')
  + de(s, 'Angles at the circumference of a circle subtended by the same arc are equal.')
  + formula(f'{an("PRQ")} = {an("PSQ")} = {an("PTQ")}', c),
  SV(o, 'Three angles at the circumference at R, S and T subtended by the same arc PQ'))

# Contoh 1
A, B, Cc, E = Pc(C0, 140), Pc(C0, 70), Pc(C0, 5), Pc(C0, 205)
D = Pc(C0, 295, C0[2] * 1.32)
o = circle(C0) + seg(A, B, c) + seg(B, E, c) + seg(A, Cc, AM) + seg(Cc, E, AM) + seg(A, D, MU3, 2.5) + seg(E, D, MU3, 2.5)
o += ang(B, A, E, '35°', TX, 34, 15, 54) + ang(Cc, A, E, i('y'), AM, 34, 16, 54) + ang(D, A, E, '28°', MU3, 30, 14, 48)
o += labs(C0, {'A': 140, 'B': 70, 'C': 5, 'E': 205}) + labp(D, (250, 240), 'D', 14)
S(s, 'EXAMPLE 1', 'Angles subtended by the same arc',
  p(f'Based on the diagram on the right, calculate the value of {i("y")}.')
  + pen(s, [f'{i("y")} = {an("ABE")} = 35°'])
  + note(f'{i("y")} = {an("ABE")} = 35°. {an("ADE")} ≠ 35° because {an("ADE")} is not an angle at the circumference of the circle subtended by arc {i("AE")}.', 'Bulletin:'),
  SV(o, 'Circle with an angle of 35 degrees at B and y at C subtended by arc AE, point D outside the circle'))

# lengkok sama panjang / berkadaran
c1 = (130, 200, 100)
o = circle(c1) + arc(c1, 95, 135, PK, 6) + arc(c1, 275, 315, PK, 6)
o += seg(Pc(c1, 95), Pc(c1, 205), c) + seg(Pc(c1, 135), Pc(c1, 205), c) + seg(Pc(c1, 275), Pc(c1, 40), c) + seg(Pc(c1, 315), Pc(c1, 40), c)
o += labs(c1, {'P': 95, 'Q': 135, 'S': 275, 'U': 315, 'R': 205, 'T': 40}, 16, 15)
c2 = (370, 260, 100)
o += circle(c2) + arc(c2, 260, 290, GR, 6) + arc(c2, 80, 170, AM, 6)
V1, V2 = Pc(c2, 200), Pc(c2, 20)
o += seg(Pc(c2, 260), Pc(c2, 120), c) + seg(Pc(c2, 290), Pc(c2, 120), c) + seg(Pc(c2, 80), Pc(c2, 330), c) + seg(Pc(c2, 170), Pc(c2, 330), c)
o += ang(Pc(c2, 120), Pc(c2, 260), Pc(c2, 290), i('x'), GR, 34, 14, 50) + ang(Pc(c2, 330), Pc(c2, 80), Pc(c2, 170), f'3{i("x")}', AM, 34, 14, 52)
o += GF.T(370, 385, f'{i("y")} cm', GR, 15) + GF.T(298, 160, f'3{i("y")} cm', AM, 15)
S(s, 'PROPERTIES', 'Arcs of the same length and proportional arcs',
  p('In general,')
  + de(s, f'Angles at the circumference of a circle subtended by arcs of the same length are equal. If the length of arc {i("PQ")} = the length of arc {i("SU")}, then {an("PRQ")} = {an("STU")}.')
  + de(s, 'The size of an angle at the circumference subtended by an arc is proportional to the length of the arc.'),
  SV(o, 'Arcs of the same length give equal angles, an arc three times as long gives an angle three times as large'))

# Contoh 2: lengkok PR = QS, sudut 52
pP, pR, pQ, pS = 100, -4, 75, -29
T_, U_ = Pc(C0, 195), Pc(C0, 235)
o = circle(C0) + arc(C0, pR, pP, PK, 6, 12) + arc(C0, pS, pQ, GR, 6, 24)
o += seg(T_, Pc(C0, pP), c) + seg(T_, Pc(C0, pR), c) + seg(U_, Pc(C0, pQ), AM) + seg(U_, Pc(C0, pS), AM)
o += ang(T_, Pc(C0, pP), Pc(C0, pR), '52°', TX, 40, 15, 60) + ang(U_, Pc(C0, pQ), Pc(C0, pS), i('x'), AM, 46, 16, 66)
o += labs(C0, {'P': pP, 'R': pR, 'Q': pQ, 'S': pS}, 36) + NTS
S(s, 'EXAMPLE 2', 'Arcs of the same length',
  p(f'The diagram on the right shows a circle where the length of arc {i("PR")} = {i("QS")}. Determine the value of {i("x")}. Give the reason for your answer.')
  + pen(s, [f'{i("x")} = 52° because ∠{i("x")} and ∠52° are at the circumference of the circle and the length of arc {i("PR")} = {i("QS")}.']),
  SV(o, 'Circle with arc PR of the same length as arc QS'))

# Contoh 3: 20° pada lengkok 2 cm, x pada lengkok 8 cm
V = Pc(C0, 110); pP, pQ, pR = 230, 270, 70
o = circle(C0) + arc(C0, pP, pQ, GR, 6) + arc(C0, pQ, pR + 360, AM, 6)
o += seg(V, Pc(C0, pP), c) + seg(V, Pc(C0, pQ), c) + seg(V, Pc(C0, pR), c)
o += ang(V, Pc(C0, pP), Pc(C0, pQ), '20°', GR, 60, 15, 80) + ang(V, Pc(C0, pQ), Pc(C0, pR), i('x'), AM, 40, 16, 58)
o += labs(C0, {'P': pP, 'Q': pQ, 'R': pR}) + lab(C0, 250, '2 cm', 40, GR, 15) + lab(C0, 345, '8 cm', 36, AM, 15)
S(s, 'EXAMPLE 3', 'Angles proportional to the arc length',
  p(f'Based on the diagram on the right, determine the value of {i("x")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'{F(i("x"), "20°")} = {F("8 cm", "2 cm")}', f'{i("x")} = 4 (20°)', f'{i("x")} = 80°'])], s, 1, 21),
  SV(o, 'An angle of 20 degrees subtended by an arc of 2 cm and angle x subtended by an arc of 8 cm'))

# Contoh 4: lengkok PS = 2 lengkok QR, segi tiga TPS sama kaki 50°
pT, pP, pS, pQ, pR = 180, 80, 280, 50, -30
T_ = Pc(C0, pT)
o = circle(C0) + arc(C0, pS, pP + 360, PK, 5, 12) + seg(T_, Pc(C0, pP), c) + seg(T_, Pc(C0, pS), c) + seg(Pc(C0, pP), Pc(C0, pS), c)
o += seg(T_, Pc(C0, pQ), AM) + seg(T_, Pc(C0, pR), AM)
o += ang(Pc(C0, pP), T_, Pc(C0, pS), '50°', TX, 28, 14, 46) + ang(Pc(C0, pS), T_, Pc(C0, pP), '50°', TX, 28, 14, 46) + ang(T_, Pc(C0, pQ), Pc(C0, pR), i('x'), AM, 70, 16, 88)
o += labs(C0, {'T': pT, 'P': pP, 'S': pS, 'Q': pQ, 'R': pR}) + NTS
S(s, 'EXAMPLE 4', 'Arc length twice as long',
  p(f'Given that the length of minor arc {i("PS")} is twice the length of arc {i("QR")}, determine the value of {i("x")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'{an("PTS")} = 180° − 2 (50°) &emsp;(The sum of the interior angles of a triangle is 180°.)', f'{an("PTS")} = 80°',
                f'Thus, {i("x")} = {F("80°", 2)} &emsp;({i("QR")} = {F(i("PS"), 2)})', f'{i("x")} = 40°'])], s, 1, 20),
  SV(o, 'Triangle TPS with angles of 50 degrees at P and S, angle x at T subtended by arc QR'))

# sudut pusat = 2 × sudut lilitan
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] + 14, C0[1] + 14, 'O', TX, 16)
pP, pR, pQ = 220, 320, 95
o += seg(Pc(C0, pP), Pc(C0, pQ), c) + seg(Pc(C0, pR), Pc(C0, pQ), c) + seg(Pc(C0, pP), C0[:2], AM) + seg(Pc(C0, pR), C0[:2], AM)
o += ang(Pc(C0, pQ), Pc(C0, pP), Pc(C0, pR), i('x'), c, 36, 16, 54) + ang(C0[:2], Pc(C0, pP), Pc(C0, pR), f'2{i("x")}', AM, 30, 16, 50)
o += labs(C0, {'P': pP, 'R': pR, 'Q': pQ})
S(s, 'PROPERTIES', 'Angle at the centre of a circle',
  p('In general,')
  + de(s, 'The size of the <b>angle at the centre of a circle</b> subtended by the same arc is <b>twice</b> the size of the angle at the <b>circumference</b>.')
  + formula(f'{an("POR")} = 2 × {an("PQR")}', c)
  + p(f'The value of {an("PQR")} remains the same although point {i("Q")} is moved along the circumference of the circle.'),
  SV(o, 'Central angle 2x and angle at the circumference x subtended by arc PR'))

# Contoh 5
o = ''
for k, (cx, lbl) in enumerate([(85, '(a)'), (250, '(b)'), (415, '(c)')]):
    cc = (cx, 230, 72); O_ = cc[:2]
    o += circle(cc) + dot(O_, TX, 3.5) + GF.T(cx, 120, lbl, MU3, 15)
    if k == 0:
        A_, B_, X_, Y_ = Pc(cc, 225), Pc(cc, 315), Pc(cc, 110), Pc(cc, 60)
        o += seg(A_, O_, AM) + seg(B_, O_, AM) + seg(A_, X_, c) + seg(B_, X_, c) + seg(A_, Y_, PU) + seg(B_, Y_, PU)
        o += ang(O_, A_, B_, '96°', AM, 18, 13, 32) + ang(X_, A_, B_, i('x'), c, 24, 14, 38) + ang(Y_, A_, B_, i('y'), PU, 24, 14, 38)
    elif k == 1:
        A_, B_, X_, Y_ = Pc(cc, 230), Pc(cc, 310), Pc(cc, 115), Pc(cc, 65)
        o += seg(A_, X_, c) + seg(B_, X_, c) + seg(A_, Y_, PU) + seg(B_, Y_, PU) + seg(A_, O_, AM) + seg(B_, O_, AM)
        o += ang(X_, A_, B_, '32°', c, 24, 13, 40) + ang(Y_, A_, B_, i('x'), PU, 24, 14, 38) + ang(O_, A_, B_, i('y'), AM, 16, 14, 30)
    else:
        A_, B_, Y_ = Pc(cc, 15), Pc(cc, 165), Pc(cc, 270)
        o += seg(A_, O_, AM) + seg(B_, O_, AM) + seg(A_, Y_, c) + seg(B_, Y_, c)
        o += ang(O_, A_, B_, '150°', TX, 14, 13, 28) + angbig(O_, A_, B_, i('x'), AM, 20, 14, 34) + ang(Y_, A_, B_, i('y'), c, 22, 14, 36)
S(s, 'EXAMPLE 5', 'Central angles and angles at the circumference',
  p(f'Determine the values of {i("x")} and {i("y")} for each of the following.')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'{i("x")} = {F(1, 2)} (96°)', f'{i("x")} = 48°', f'{i("y")} = 48°']), ('(b)', [f'{i("x")} = 32°', f'{i("y")} = 2 (32°)', f'{i("y")} = 64°']),
          ('(c)', [f'{i("x")} = 360° − 150°', f'{i("x")} = 210°', f'{i("y")} = {F(1, 2)} (210°)', f'{i("y")} = 105°'])], s, 3, 19),
  SV(o, 'Three circles with centre O with central angles and angles at the circumference'))

# sudut pusat berkadaran
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] - 4, C0[1] + 22, 'O', TX, 16)
o += arc(C0, 280, 320, GR, 6) + arc(C0, 40, 120, AM, 6)
O_ = C0[:2]
o += seg(O_, Pc(C0, 280), GR) + seg(O_, Pc(C0, 320), GR) + seg(O_, Pc(C0, 40), AM) + seg(O_, Pc(C0, 120), AM)
o += ang(O_, Pc(C0, 280), Pc(C0, 320), i('x'), GR, 34, 16, 52) + ang(O_, Pc(C0, 40), Pc(C0, 120), f'2{i("x")}', AM, 30, 16, 50)
o += lab(C0, 300, f'{i("y")} cm', 24, GR, 16) + lab(C0, 80, f'2{i("y")} cm', 24, AM, 16)
S(s, 'PROPERTIES', 'Central angles and arc length',
  p('You have learnt that angles at the circumference of a circle subtended by arcs of the same length are equal, and the size of an angle at the circumference subtended by an arc is proportional to the length of the arc.')
  + p('Both concepts above can also be applied to the angles at the centre of a circle. In general,')
  + de(s, 'For central angles of a circle subtended by an arc;<br>(a) the sizes of the angles are equal if the arc lengths are equal.<br>(b) the change in size of an angle is proportional to the change in arc length.'),
  SV(o, 'Central angle x subtended by an arc of y cm and central angle 2x subtended by an arc of 2y cm'))

# semibulatan 90°
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0], C0[1] + 22, 'O', TX, 16)
Pp, Rp = Pc(C0, 180), Pc(C0, 0)
o += seg(Pp, Rp, AM) + GF.T(250, 228, 'Diameter', AM, 15)
for d, col in [(120, c), (70, GR)]:
    Q_ = Pc(C0, d); o += seg(Pp, Q_, col) + seg(Rp, Q_, col) + rt(Q_, Pp, Rp, 14)
o += labs(C0, {'P': 180, 'R': 0}) + lab(C0, 120, 'Q', 20) + lab(C0, 70, "Q'", 20)
S(s, 'PROPERTIES', 'Angles in a semicircle',
  p(f'For all positions of point {i("Q")} on the circumference of the circle subtended by diameter {i("PR")}, the value of {an("PQR")} is 90°. In general,')
  + de(s, f'The angle at the circumference of a circle subtended by the diameter is 90°. If {i("PQR")} is a semicircle, then {an("PQR")} = 90°.')
  + note('Is a diameter a chord? Discuss.', 'Discussion corner:'),
  SV(o, 'Angles at Q and Q prime subtended by diameter PR are 90 degrees'))

# Contoh 6
Q_, R_, S_, P_ = Pc(C0, 90), Pc(C0, 0), Pc(C0, 270), Pc(C0, 180)
o = circle(C0) + dot(C0[:2]) + GF.T(C0[0] + 16, C0[1] + 4, 'O', TX, 16) + poly([P_, Q_, R_, S_], c, False) + seg(P_, R_, MU3, 2.5) + seg(Q_, S_, AM)
o += ang(Q_, P_, S_, i('x'), AM, 40, 15, 56) + ang(Q_, S_, R_, i('x'), AM, 46, 15, 62) + ang(S_, Q_, R_, i('y'), c, 46, 16, 64)
o += labs(C0, {'Q': 90, 'R': 0, 'S': 270, 'P': 180})
S(s, 'EXAMPLE 6', 'Angles subtended by the diameter',
  p(f'The diagram on the right shows a circle with centre {i("O")} and points {i("P")}, {i("Q")}, {i("R")} and {i("S")} on the circumference of the circle. Given that {i("PR")} and {i("QS")} are diameters, calculate the value of {i("y")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'{i("PR")} = {i("QS")}', f'Thus, 2{i("x")} = 90°', f'{i("x")} = 45°']), ('', [f'{i("y")} + {i("x")} + {an("QRS")} = 180°', f'{i("y")} + 45° + 90° = 180°',
                f'{i("y")} = 180° − 45° − 90°', f'{i("y")} = 45°'])], s, 2, 19)
  + note(f'2{i("x")} = 90° because {an("PQR")} = 90° (subtended by diameter {i("PR")}).', 'Note:'),
  SV(o, 'Circle with centre O with diameters PR and QS'))

# Contoh 7: arca
pQ, pR, pP, pS = 40, -24, 104, 220
O_ = C0[:2]
o = circle(C0) + dot(O_) + GF.T(O_[0] - 18, O_[1] + 6, 'O', TX, 16)
o += seg(Pc(C0, pS), Pc(C0, pQ), c) + seg(Pc(C0, pS), Pc(C0, pR), c) + seg(Pc(C0, pS), Pc(C0, pP), c) + seg(Pc(C0, pP), Pc(C0, pQ), c) + seg(O_, Pc(C0, pR), AM)
o += ang(O_, Pc(C0, pQ), Pc(C0, pR), '64°', AM, 30, 15, 50) + arc(C0, pR, pQ, GR, 5, 12) + arc(C0, pQ, pP, GR, 5, 12)
o += labs(C0, {'Q': pQ, 'R': pR, 'P': pP, 'S': pS}, 30)
o += f'<rect x="160" y="420" width="180" height="20" rx="4" fill="{MU}55" stroke="{MU}" stroke-width="2"/>'
S(s, 'EXAMPLE 7', 'Solving problems involving angles in circles',
  p(f'A sculpture is built in the shape of a circle with centre {i("O")} as shown in the diagram on the right. The points on the circumference form arc {i("PQ")} which has the same length as arc {i("QR")}. Line {i("SQ")} passes through {i("O")}. Determine the value of (a) {an("QSR")} (b) {an("PQS")}')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'{an("QSR")} = {F(1, 2)} {an("QOR")}', f'&emsp;&emsp;&ensp;&nbsp;= {F(1, 2)} (64°)', '&emsp;&emsp;&ensp;&nbsp;= 32°']),
          ('(b)', [f'{an("PSQ")} = {an("QSR")} = 32°', f'{an("PQS")} + 90° + 32° = 180°', f'{an("PQS")} = 180° − 90° − 32°', '&emsp;&emsp;&ensp;&nbsp;= 58°'])], s, 2, 19),
  SV(o, 'Circular sculpture with centre O, angle QOR 64 degrees'))

# =====================================================================
# 6.2 SISI EMPAT KITARAN
# =====================================================================
s = '6.2'
c = COL[s]
pts = {'P': 115, 'Q': 30, 'R': 280, 'S': 200}
o = circle(C0) + poly([Pc(C0, a) for a in pts.values()], c) + labs(C0, pts)
S(s, 'DEFINITION', 'Cyclic quadrilaterals',
  de(s, 'A <b>cyclic quadrilateral</b> is a quadrilateral in a circle where all four vertices of the quadrilateral lie on the circumference of the circle.')
  + p(f'{i("PQRS")} in the diagram on the right is a cyclic quadrilateral. ∠{i("P")} and ∠{i("R")} as well as ∠{i("S")} and ∠{i("Q")} are known as <b>opposite angles</b> in the cyclic quadrilateral.'),
  SV(o, 'Cyclic quadrilateral PQRS in a circle'))

# Contoh 8
o = ''
spec = [((85, 110), ['A', 'B', 'C', 'D'], [120, 200, 300, None], (1.35, 25)),
        ((250, 110), ['D', 'E', 'F', 'G'], [125, 220, 300, 50], None),
        ((415, 110), ['K', 'L', 'O', 'N'], [100, 230, 'O', 310], None),
        ((150, 330), ['P', 'Q', 'R', 'S'], [150, 230, 320, 60], None),
        ((350, 330), ['O', 'T', 'U', 'V'], ['O', 190, 270, 350], None)]
for k, (cen, nm, ds, outp) in enumerate(spec):
    cc = (cen[0], cen[1], 62)
    o += circle(cc) + dot(cen, MU3, 3) + GF.T(cen[0] - 72, cen[1] - 70, f'({["i", "ii", "iii", "iv", "v"][k]})', MU3, 14)
    ptsx = []
    for n_, d in zip(nm, ds):
        if d == 'O':
            q = cen
        elif d is None:
            q = Pc(cc, outp[1], cc[2] * outp[0])
        else:
            q = Pc(cc, d)
        ptsx.append(q)
    o += poly(ptsx, c, w=2.5)
    for n_, q in zip(nm, ptsx):
        o += labp(q, cen, n_, 13, TX, 14) if q != cen else GF.T(cen[0] + 4, cen[1] + 16, n_, TX, 14)
S(s, 'EXAMPLE 8', 'Identifying cyclic quadrilaterals',
  p(f'For each circle on the right, {i("O")} is the centre. (a) Identify the cyclic quadrilaterals and explain your answer. (b) State the opposite angles in each cyclic quadrilateral identified.')
  + work([('(a)', [f'(i) {i("D")} is not on the circumference: {i("ABCD")} is not cyclic.', f'(ii) All vertices are on the circumference: {i("DEFG")} is cyclic.',
                   f'(iii) {i("O")} is not on the circumference: {i("KLON")} is not cyclic.', f'(iv) All vertices are on the circumference: {i("PQRS")} is cyclic.',
                   f'(v) {i("O")} is not on the circumference: {i("OTUV")} is not cyclic.']),
          ('(b)', [f'(i) None (ii) ∠{i("D")} and ∠{i("F")}, ∠{i("E")} and ∠{i("G")} (iii) None (iv) ∠{i("P")} and ∠{i("R")}, ∠{i("Q")} and ∠{i("S")} (v) None'])], s, 1, 17),
  SV(o, 'Five circles with quadrilaterals, only DEFG and PQRS have their vertices on the circumference'))

# sudut bertentangan 180°
d4 = [120, 40, 290, 210]
Q4 = [Pc(C0, a) for a in d4]
o = circle(C0) + poly(Q4, c)
o += ang(Q4[0], Q4[3], Q4[1], i('x'), AM, 30, 16, 48) + ang(Q4[2], Q4[1], Q4[3], i('y'), AM, 30, 16, 48)
o += ang(Q4[1], Q4[0], Q4[2], i('p'), GR, 30, 16, 48) + ang(Q4[3], Q4[2], Q4[0], i('q'), GR, 30, 16, 48)
o += labs(C0, dict(zip('ABCD', [120, 40, 290, 210])))
S(s, 'PROPERTIES', 'Opposite angles in cyclic quadrilaterals',
  p('It is found that;')
  + bul(s, [f'{an("DAB")} + {an("BCD")} = 180° and {an("ABC")} + {an("ADC")} = 180°', 'The sum of the opposite interior angles in a cyclic quadrilateral is 180°.'])
  + p('In general,')
  + de(s, 'The sum of the opposite angles in a cyclic quadrilateral is 180°.')
  + formula(f'∠{i("x")} + ∠{i("y")} = 180° &emsp; and &emsp; ∠{i("p")} + ∠{i("q")} = 180°', c),
  SV(o, 'Cyclic quadrilateral ABCD with opposite angles x and y, p and q'))

# Contoh 9: KLMN, 108, 96, 8x, 4y
d9 = {'K': 120, 'L': 68, 'M': -48, 'N': 212}
K9, L9, M9, N9 = [Pc(C0, a) for a in d9.values()]
o = circle(C0) + poly([K9, L9, M9, N9], c)
o += ang(K9, N9, L9, '108°', TX, 30, 14, 52) + ang(L9, K9, M9, '96°', TX, 30, 14, 50) + ang(M9, L9, N9, f'8{i("x")}', AM, 30, 15, 50) + ang(N9, M9, K9, f'4{i("y")}', AM, 30, 15, 50)
o += labs(C0, d9)
assert (180 - 108) / 8 == 9 and (180 - 96) / 4 == 21
S(s, 'EXAMPLE 9', 'Opposite angles',
  p(f'The diagram on the right shows a cyclic quadrilateral {i("KLMN")}. Calculate the value of (a) {i("x")} (b) {i("y")}')
  + work([('(a)', [f'The interior angles {an("LKN")} and {an("LMN")} are opposite angles in the cyclic quadrilateral.', f'Thus, {an("LKN")} + {an("LMN")} = 180°',
                   f'108° + 8{i("x")} = 180°', f'8{i("x")} = 72°', f'{i("x")} = {F("72°", 8)} = 9°']),
          ('(b)', [f'The interior angles {an("KNM")} and {an("KLM")} are opposite angles in the cyclic quadrilateral.', f'Thus, {an("KNM")} + {an("KLM")} = 180°',
                   f'4{i("y")} + 96° = 180°', f'4{i("y")} = 84°', f'{i("y")} = {F("84°", 4)} = 21°'])], s, 2, 17),
  SV(o, 'Cyclic quadrilateral KLMN with angles 108, 96, 8x and 4y'))

# sudut peluaran
dP, dQ, dR, dS = 120, 45, 300, 215
P2, Q2, R2, S2 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
T2 = ext(P2, S2, 95)
o = circle(C0) + poly([P2, Q2, R2, S2], c) + seg(S2, T2, c)
o += ang(S2, T2, R2, i('a'), AM, 34, 16, 52) + ang(Q2, P2, R2, 'θ', AM, 32, 16, 50)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}) + labp(T2, S2, 'T', 14)
S(s, 'CONCEPT', 'Exterior angles of cyclic quadrilaterals',
  p(f'The diagram on the right shows a cyclic quadrilateral {i("PQRS")}. Chord {i("PS")} is extended to {i("T")}. {an("TSR")}, {i("a")}, is the <b>exterior angle</b> of the cyclic quadrilateral {i("PQRS")}. {an("PQR")}, θ, is known as the <b>corresponding interior opposite angle</b> of {i("a")}.')
  + de(s, f'The exterior angle of a cyclic quadrilateral is equal to the corresponding interior opposite angle, that is {i("a")} = θ.')
  + work([('', [f'{i("a")} + {an("PSR")} = 180° &emsp;(angles on a straight line)', f'θ + {an("PSR")} = 180° &emsp;(opposite angles)', f'Thus, {i("a")} = θ'])], s, 1, 18),
  SV(o, 'Cyclic quadrilateral PQRS with PS extended to T, exterior angle a and angle theta at Q'))

# Contoh 10
dP, dQ, dR, dS = 135, 50, 315, 225
P3, Q3, R3, S3 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
o = circle(C0) + poly([P3, Q3, R3, S3], c) + seg(Q3, ext(P3, Q3, 80), c) + seg(S3, ext(R3, S3, 80), c)
o += ang(Q3, ext(P3, Q3, 80), R3, i('m'), AM, 30, 16, 48) + ang(Q3, P3, R3, i('n'), GR, 30, 16, 48) + ang(R3, Q3, S3, i('x'), GR, 30, 16, 48)
o += ang(S3, ext(R3, S3, 80), P3, i('z'), AM, 30, 16, 48) + ang(S3, R3, P3, i('y'), GR, 30, 16, 48)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}, 22)
S(s, 'EXAMPLE 10', 'Exterior angles and interior angles',
  p(f'In the diagram on the right, {i("PQRS")} is a cyclic quadrilateral. Given that {i("m")} and {i("z")} are exterior angles, state the corresponding interior opposite angles of {i("m")} and {i("z")}.')
  + pen(s, [f'{i("y")} is the corresponding interior opposite angle of {i("m")}.', f'{i("n")} is the corresponding interior opposite angle of {i("z")}.']),
  SV(o, 'Cyclic quadrilateral PQRS with exterior angles m at Q and z at S'))

# Contoh 11: ABCD, CDE, 52
dB, dA, dC, dD = 270, 166, 14, 95
A4, B4, C4, D4 = [Pc(C0, a) for a in (dA, dB, dC, dD)]
E4 = ext(C4, D4, 90)
o = circle(C0) + poly([A4, B4, C4, D4], c) + seg(A4, C4, c) + seg(D4, E4, c) + tick(A4, B4) + tick(B4, C4)
o += ang(C4, A4, B4, '52°', TX, 46, 14, 64) + ang(A4, C4, B4, '52°', TX, 46, 14, 64) + ang(B4, A4, C4, i('a'), AM, 30, 16, 48) + ang(D4, E4, A4, i('b'), AM, 30, 16, 48)
o += labs(C0, {'A': dA, 'B': dB, 'C': dC, 'D': dD}) + labp(E4, D4, 'E', 14)
S(s, 'EXAMPLE 11', 'Solving problems involving cyclic quadrilaterals',
  p(f'The diagram on the right shows a cyclic quadrilateral {i("ABCD")} and a straight line {i("CDE")}. Calculate the value of (a) {i("a")} (b) {i("b")}')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'{an("ACB")} = {an("CAB")} = 52°', f'{an("ACB")} + {an("CAB")} + {i("a")} = 180°', f'52° + 52° + {i("a")} = 180°', f'{i("a")} = 180° − 52° − 52°', f'{i("a")} = 76°']),
          ('(b)', [f'{i("b")} = {i("a")}', f'Thus, {i("b")} = 76°'])], s, 2, 19),
  SV(o, 'Cyclic quadrilateral ABCD with CDE a straight line and AB equal to BC'))

# Contoh 12: 7y dan 3y
dP, dQ, dR, dS = 100, 50, -8, 210
P5, Q5, R5, S5 = [Pc(C0, a) for a in (dP, dQ, dR, dS)]
T5 = ext(R5, S5, 90)
o = circle(C0) + poly([P5, Q5, R5, S5], c) + seg(S5, T5, c)
o += ang(Q5, P5, R5, f'7{i("y")}', AM, 30, 15, 50) + ang(S5, R5, P5, f'3{i("y")}', AM, 30, 15, 50) + ang(S5, T5, P5, '', PK, 40)
o += labs(C0, {'P': dP, 'Q': dQ, 'R': dR, 'S': dS}) + labp(T5, S5, 'T', 14)
assert 180 / 10 == 18 and 7 * 18 == 126
S(s, 'EXAMPLE 12', 'Exterior angles',
  p(f'The diagram on the right shows a cyclic quadrilateral {i("PQRS")} and a straight line {i("RST")}. Calculate the value of {an("PST")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'{an("PQR")} + {an("PSR")} = 180°', f'7{i("y")} + 3{i("y")} = 180°', f'10{i("y")} = 180°', f'{i("y")} = 18°']),
          ('', [f'{an("PST")} = {an("PQR")}', f'&emsp;&emsp;&ensp;&nbsp;= 7{i("y")}', '&emsp;&emsp;&ensp;&nbsp;= 7(18°)', f'{an("PST")} = 126°'])], s, 2, 20),
  SV(o, 'Cyclic quadrilateral PQRS with RST a straight line'))

# Contoh 13: KLMN, MNP, 82, 71
d13 = {'N': 100, 'M': 40, 'K': 204, 'L': 242}
N6, M6, K6, L6 = [Pc(C0, a) for a in d13.values()]
P6 = ext(M6, N6, 100)
o = circle(C0) + poly([K6, L6, M6, N6], c) + seg(N6, P6, c)
o += ang(N6, P6, K6, '82°', TX, 30, 14, 50) + ang(M6, N6, L6, '71°', TX, 30, 14, 50) + ang(L6, K6, M6, i('x'), AM, 30, 16, 48) + ang(K6, L6, N6, i('y'), AM, 30, 16, 48)
o += labs(C0, d13) + labp(P6, N6, 'P', 14)
S(s, 'EXAMPLE 13', 'Exterior angles and opposite angles',
  p(f'The diagram on the right shows a cyclic quadrilateral {i("KLMN")} and a straight line {i("MNP")}. Calculate the value of (a) {i("x")} (b) {i("y")}')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'{an("PNK")} is an exterior angle. Its corresponding interior opposite angle is angle {i("x")}.', f'Thus, {i("x")} = 82°']),
          ('(b)', [f'{i("y")} and {an("NML")} are opposite interior angles in the cyclic quadrilateral {i("KLMN")}.', f'Thus, {i("y")} = 180° − {an("NML")}', f'{i("y")} = 180° − 71°', f'{i("y")} = 109°'])], s, 2, 18),
  SV(o, 'Cyclic quadrilateral KLMN with MNP a straight line'))

# =====================================================================
# 6.3 TANGEN KEPADA BULATAN
# =====================================================================
s = '6.3'
c = COL[s]
cT = (250, 230, 130)
X1, X2 = tangent(cT, 120, 120, 120)
Y1, Y2 = tangent(cT, 300, 120, 120)
Ap, Bp = Pc(cT, 200), Pc(cT, 250)
U_, V_ = ext(Bp, Ap, 70), ext(Ap, Bp, 70)
o = circle(cT) + seg(X1, X2, c) + seg(Y1, Y2, c) + seg(U_, V_, PK)
o += dot(Pc(cT, 120), AM, 6) + dot(Pc(cT, 300), AM, 6) + dot(Ap, PK, 5) + dot(Bp, PK, 5)
o += lab(cT, 120, 'X', 22) + lab(cT, 300, 'Y', 22) + labp(Ap, cT[:2], 'A', 16) + labp(Bp, cT[:2], 'B', 16)
o += labp(X1, X2, 'P', 14) + labp(X2, X1, 'Q', 14) + labp(Y1, Y2, 'S', 14) + labp(Y2, Y1, 'R', 14) + labp(U_, V_, 'U', 14) + labp(V_, U_, 'V', 14)
S(s, 'DEFINITION', 'Tangents to circles',
  p(f'In the diagram on the right, the straight lines {i("PQ")} and {i("RS")} touch the circle at point {i("X")} and point {i("Y")} respectively. Meanwhile, the straight line {i("UV")} passes through point {i("A")} and point {i("B")} on the circle. Thus,')
  + bul(s, [f'(a) {i("PQ")} and {i("RS")}: Tangents to the circle.', f'(b) {i("X")} and {i("Y")}: Points of tangency of {i("PQ")} and {i("RS")} respectively.', f'(c) {i("UV")}: Not a tangent.', f'(d) {i("A")} and {i("B")}: Not points of tangency of {i("UV")}.'])
  + de(s, 'A <b>tangent</b> to a circle is a <b>straight line</b> that <b>touches the circle</b> at <b>only one point</b>. <b>The point of contact between the tangent and the circle</b> is the <b>point of tangency</b>.'),
  SV(o, 'Lines PQ and RS touch the circle at X and Y, line UV cuts the circle at A and B'))

# Contoh 14
E1, E2 = tangent(cT, 90, 150, 150)
U1, U2 = tangent(cT, 270, 140, 140)
F_, G_ = Pc(cT, 150), Pc(cT, 30)
R_, S_ = ext(G_, F_, 60), ext(F_, G_, 60)
M_ = Pc(cT, 330); N_ = ext(Pc(cT, 160), M_, 110)
o = circle(cT) + seg(E1, E2, c) + seg(U2, U1, c) + seg(R_, S_, PK) + seg(M_, N_, AM)
o += dot(Pc(cT, 90), c, 5) + dot(Pc(cT, 270), c, 5) + dot(F_, PK, 5) + dot(G_, PK, 5) + dot(M_, AM, 5)
o += lab(cT, 90, 'E', 20) + lab(cT, 270, 'U', 20) + labp(F_, cT[:2], 'F', 16) + labp(G_, cT[:2], 'G', 16) + GF.T(M_[0] - 14, M_[1] - 12, 'M', TX, 16)
o += labp(E1, E2, 'P', 14) + labp(E2, E1, 'Q', 14) + labp(R_, S_, 'R', 14) + labp(S_, R_, 'S', 14) + labp(U2, U1, 'T', 14) + labp(N_, M_, 'N', 14)
S(s, 'EXAMPLE 14', 'Identifying tangents',
  p('Are all the straight lines and points shown in the diagram on the right tangents to the circle and points of tangency? State the reasons for your answer.')
  + pen(s, [f'{i("PQ")} and {i("TU")} are tangents to the circle because they touch the circle at only one point. Point {i("E")} and point {i("U")} are the points of tangency of {i("PQ")} and {i("TU")} respectively.',
            f'{i("RS")} is not a tangent to the circle because it passes through two points on the circle. Hence, point {i("F")} and point {i("G")} are not points of tangency of {i("RS")}.',
            f'{i("MN")} is not a tangent to the circle because it will touch two points on the circle if it is extended. Hence, point {i("M")} is not a point of tangency.'], False),
  SV(o, 'Circle with tangent PQ at E, TU at U, line RS through F and G, and line MN'))

# jejari ⟂ tangen
O_ = cT[:2]; Qt = Pc(cT, 270)
t1, t2 = tangent(cT, 270, 170, 170)
o = circle(cT) + seg(t1, t2, c) + seg(O_, Qt, AM) + rt(Qt, O_, t2, 16) + dot(O_) + GF.T(O_[0] + 16, O_[1], 'O', TX, 16)
o += GF.T(O_[0] - 14, (O_[1] + Qt[1]) / 2, 'Radius', AM, 15, 'end') + GF.T(Qt[0], Qt[1] + 24, 'Point of tangency', TX, 15) + GF.T(t2[0] - 10, t2[1] - 16, 'Tangent', c, 15, 'end')
o += GF.T(Qt[0] + 30, Qt[1] - 26, '90°', AM, 16)
S(s, 'PROPERTIES', 'Angle between a tangent and a radius',
  p('The angle between the tangent and the radius that intersect at the point of tangency is a right angle. In general,')
  + de(s, 'The radius of a circle that intersects the tangent to the circle at the point of tangency forms 90°.'),
  SV(o, 'The radius meets the tangent at the point of tangency forming 90 degrees'))

# Contoh 15: 146°
cc = (240, 290, 115); O_ = cc[:2]
Bq = Pc(cc, 110); A_ = Pc(cc, 110 + 34, cc[2] / math.cos(math.radians(34))); D_ = Pc(cc, 110 + 34 + 180)
t1, t2 = tangent(cc, 110, 0, 140)
o = circle(cc) + seg(A_, t2, c) + seg(A_, D_, MU3, 2.5) + seg(O_, Bq, AM) + rt(Bq, O_, t2, 14) + dot(O_)
o += ang(O_, Bq, D_, '146°', TX, 30, 14, 52) + ang(A_, Bq, O_, i('x'), AM, 40, 16, 58)
o += labp(A_, O_, 'A', 16) + labp(Bq, O_, 'B', 18) + labp(t2, A_, 'C', 14) + GF.T(O_[0] + 16, O_[1] + 16, 'O', TX, 16)
assert 180 - 146 == 34 and 90 - 34 == 56
S(s, 'EXAMPLE 15', 'Tangents and radii',
  p(f'The diagram on the right shows a circle with centre {i("O")} which meets the straight line {i("ABC")} at point {i("B")} only. Calculate the value of {i("x")}.')
  + p('<b>Solution:</b>')
  + p(f'Line {i("ABC")} is a tangent to the circle and meets the radius of the circle at point {i("B")}. Thus, angle {an("OBA")} = 90°.')
  + work([('', [f'{an("AOB")} + 146° = 180°', f'{an("AOB")} = 180° − 146°', '&emsp;&emsp;&ensp;&nbsp;= 34°']),
          ('', [f'{i("x")} + {an("AOB")} = 90°', f'{i("x")} = 90° − {an("AOB")}', f'{i("x")} = 90° − 34°', f'{i("x")} = 56°'])], s, 2, 19),
  SV(o, 'Tangent ABC touches the circle at B, angle of 146 degrees at O'))

# dua tangen
cc = (150, 235, 95); O_ = cc[:2]; a = 58
Bq, Cq = Pc(cc, a), Pc(cc, -a); A_ = (O_[0] + cc[2] / math.cos(math.radians(a)), O_[1])
o = circle(cc) + seg(Bq, A_, c) + seg(Cq, A_, c) + seg(O_, Bq, AM) + seg(O_, Cq, AM) + seg(O_, A_, MU3, 2.5) + dot(O_)
o += rt(Bq, O_, A_, 12) + rt(Cq, O_, A_, 12) + ang(O_, Bq, A_, i('x'), AM, 26, 15, 42) + ang(O_, A_, Cq, i('x'), AM, 32, 15, 48)
o += ang(A_, O_, Bq, i('y'), GR, 44, 15, 62) + ang(A_, Cq, O_, i('y'), GR, 52, 15, 70)
o += labp(Bq, O_, 'B', 16) + labp(Cq, O_, 'C', 16) + GF.T(A_[0] + 14, A_[1] + 4, 'A', TX, 17) + GF.T(O_[0] - 16, O_[1] + 4, 'O', TX, 16) + tick(Bq, A_) + tick(Cq, A_)
S(s, 'PROPERTIES', 'Two tangents to a circle',
  p('In general,')
  + de(s, f'If two tangents to a circle with centre {i("O")} with points of tangency {i("B")} and {i("C")} respectively meet at point {i("A")}, then,')
  + bul(s, [f'{i("BA")} = {i("CA")}', f'{an("BOA")} = {an("COA")}', f'{an("OAB")} = {an("OAC")}']),
  SV(o, 'Two tangents from A touch the circle at B and C'))

# Contoh 16: 58°, PQ 15 cm
a = 58; r16 = 15 * math.tan(math.radians(32))
assert f'{r16:.3f}' == '9.373'
cc = (140, 235, 92); O_ = cc[:2]
Pq, Rq = Pc(cc, a), Pc(cc, -a); Q_ = (O_[0] + cc[2] / math.cos(math.radians(a)), O_[1])
o = circle(cc) + seg(Pq, Q_, c) + seg(Rq, Q_, c) + seg(O_, Pq, AM) + seg(O_, Q_, MU3, 2.5) + dot(O_) + rt(Pq, O_, Q_, 12)
o += ang(O_, Pq, Q_, '58°', AM, 24, 14, 42) + ang(Q_, O_, Pq, i('x'), GR, 50, 15, 68)
o += labp(Pq, O_, 'P', 16) + labp(Rq, O_, 'R', 16) + GF.T(Q_[0] + 16, Q_[1] + 4, 'Q', TX, 17) + GF.T(O_[0] - 16, O_[1] + 4, 'O', TX, 16)
o += side(Pq, Q_, '15 cm', TX, 18, 15, O_) + side(Rq, Q_, f'{i("y")} cm', TX, 18, 15, O_)
S(s, 'EXAMPLE 16', 'Two tangents',
  p(f'The diagram on the right shows a circle with centre {i("O")}. Tangents {i("PQ")} and {i("RQ")} meet at point {i("Q")}. Calculate (a) the value of {i("x")} (b) the value of {i("y")} (c) the length of the radius of the circle')
  + work([('(a)', [f'Triangle ∆{i("OPQ")} is a right-angled triangle and {an("OPQ")} = 90°.', f'Thus, {i("x")} + 58° = 90°', f'{i("x")} = 90° − 58°', f'{i("x")} = 32°']),
          ('(b)', [f'Length of {i("PQ")} = {i("QR")} = {i("y")}', f'Thus, {i("y")} = 15 cm']),
          ('(c)', [f'tan 32° = {F(i("OP"), 15)}', f'{i("OP")} = 15 × tan 32°', f'Radius, {i("OP")} = 9.373 cm'])], s, 3, 17),
  SV(o, 'Circle with centre O with tangents PQ 15 cm and RQ y cm'))

# sudut tangen-perentas
cc = (250, 215, 150); O_ = cc[:2]
Qq = Pc(cc, 270); Sq = Pc(cc, 30); Tq = Pc(cc, 120)
t1, t2 = tangent(cc, 270, 200, 200)
o = circle(cc) + seg(t2, t1, c) + seg(Qq, Sq, AM) + seg(Qq, Tq, PU) + seg(Tq, Sq, PU)
o += ang(Qq, t1, Sq, i('x'), AM, 40, 16, 58) + ang(Tq, Qq, Sq, i('y'), PU, 40, 16, 58)
o += labp(Qq, O_, 'Q', 18) + labp(Sq, O_, 'S', 18) + labp(Tq, O_, 'T', 18) + labp(t2, t1, 'P', 14) + labp(t1, t2, 'R', 14)
o += GF.T(330, 340, 'minor segment', MU3, 14) + GF.T(200, 160, 'major segment', MU3, 14)
S(s, 'CONCEPT', 'Angle between a tangent and a chord',
  p(f'In the diagram on the right, {i("PQR")} is a tangent to the circle.')
  + bul(s, [f'∠{i("x")} is the angle between chord {i("QS")} and tangent {i("PQR")} in the minor segment.', f'∠{i("y")} is the angle in the major segment or the <b>alternate segment</b> subtended by chord {i("QS")}.'])
  + de(s, f'∠{i("x")} = ∠{i("y")} because the angle between the chord and the tangent is equal to the angle in the alternate segment which is subtended by the chord.'),
  SV(o, 'Tangent PQR at Q, chord QS, angle x between the tangent and the chord equals angle y at T'))

Gq = Qq
o = circle(cc) + seg(t2, t1, c) + seg(Qq, Sq, AM) + seg(Qq, Tq, PU) + seg(Tq, Sq, PU) + seg(O_, Qq, GR) + seg(O_, Sq, GR) + dot(O_)
o += ang(Qq, t1, Sq, i('x'), AM, 40, 16, 58) + ang(Tq, Qq, Sq, i('y'), PU, 40, 16, 58) + ang(Qq, O_, Sq, i('g'), GR, 34, 15, 50)
o += ang(Sq, Qq, O_, i('e'), GR, 34, 15, 50) + ang(O_, Qq, Sq, i('f'), GR, 30, 15, 48) + rt(Qq, O_, t1, 12)
o += labp(Qq, O_, 'Q', 18) + labp(Sq, O_, 'S', 18) + labp(Tq, O_, 'T', 18) + labp(t2, t1, 'P', 14) + labp(t1, t2, 'R', 14) + GF.T(O_[0] - 16, O_[1] - 6, 'O', TX, 16)
S(s, 'CONCEPT', 'Why is ∠x = ∠y?',
  p(f'In the diagram on the right, {i("O")} is the centre of the circle. {i("OQ")} and {i("OS")} are radii of the circle and {i("PQR")} is a tangent to the circle. Thus,')
  + work([('(a)', [f'{i("x")} + {i("g")} = 90°', f'{i("g")} = 90° − {i("x")}', f'{i("e")} = {i("g")}']),
          ('(b)', [f'{i("f")} = 180° − 2{i("g")}', f'{i("f")} = 180° − 2(90° − {i("x")})', f'{i("f")} = 2{i("x")} &emsp;①']),
          ('(c)', [f'{i("y")} = {F(i("f"), 2)} &emsp;②', 'Substitute ① into ②:', f'{i("y")} = {F("2" + i("x"), 2)}', f'{i("y")} = {i("x")}'])], s, 3, 18),
  SV(o, 'Circle with centre O with radii OQ and OS, tangent PQR'))

# Contoh 17
cc = (250, 210, 140)
L_, K_, M_ = Pc(cc, 95), Pc(cc, 215), Pc(cc, 325)
t1, t2 = tangent(cc, 325, 150, 150)
o = circle(cc) + poly([K_, L_, M_], c) + seg(t2, t1, AM)
o += labp(L_, cc[:2], 'L', 18) + labp(K_, cc[:2], 'K', 18) + labp(M_, cc[:2], 'M', 18) + labp(t1, t2, 'N', 14) + labp(t2, t1, 'P', 14)
S(s, 'EXAMPLE 17', 'Angles in the alternate segment',
  p(f'The diagram on the right shows a triangle {i("KLM")} and {i("PMN")} is a tangent to the circle. Determine the angle in the alternate segment for (a) {an("PMK")} (b) {an("NML")}')
  + pen(s, [f'(a) {an("KLM")}', f'(b) {an("LKM")}']),
  SV(o, 'Triangle KLM in a circle with tangent PMN at M'))

# Contoh 18: 48°, 72°
cc = (250, 205, 150)
L_, A_, B_ = Pc(cc, 270), Pc(cc, 126), Pc(cc, 6)
t1, t2 = tangent(cc, 270, 190, 190)
o = circle(cc) + poly([A_, B_, L_], c) + seg(t2, t1, AM)
o += ang(L_, t2, A_, '72°', TX, 40, 14, 60) + ang(A_, B_, L_, '48°', TX, 40, 14, 60) + ang(B_, L_, A_, i('x'), AM, 40, 16, 58) + ang(L_, B_, t1, i('y'), AM, 40, 16, 58)
o += labp(L_, cc[:2], 'L', 18) + labp(A_, cc[:2], 'A', 18) + labp(B_, cc[:2], 'B', 18) + labp(t2, t1, 'K', 14) + labp(t1, t2, 'M', 14)
S(s, 'EXAMPLE 18', 'Determining angles with tangents',
  p(f'The diagram on the right shows a triangle ∆{i("ABL")} in a circle. Given that {i("KLM")} is a tangent to the circle, determine the value of (a) {i("x")} (b) {i("y")}')
  + pen(s, [f'(a) {i("x")} = 72° because {i("x")} is the angle in the alternate segment of {an("KLA")} which is subtended by chord {i("AL")}.',
            f'(b) {i("y")} = 48° because {an("LAB")} is the angle in the alternate segment of {i("y")} which is subtended by chord {i("BL")}.']),
  SV(o, 'Triangle ABL in a circle with tangent KLM at L'))


# tangen sepunya
def ctan(c1, c2, inner=False):
    """garis tangen sepunya (luar atau dalam) bagi dua bulatan; pulangkan senarai pasangan titik ketangenan."""
    (x1, y1, r1), (x2, y2, r2) = c1, c2
    dx, dy = x2 - x1, y2 - y1; d = math.hypot(dx, dy)
    out = []
    R2 = -r2 if inner else r2
    cc_ = (r1 - R2) / d
    if abs(cc_) > 1 + 1e-9:
        return out
    cc_ = max(-1, min(1, cc_))
    base = math.atan2(dy, dx)
    for sg in (1, -1):
        t = base + sg * math.acos(cc_)
        nx, ny = math.cos(t), math.sin(t)
        p1 = (x1 + r1 * nx, y1 + r1 * ny); p2 = (x2 + R2 * nx, y2 + R2 * ny)
        if math.dist(p1, p2) < 1e-6:
            p2 = (p1[0] - ny * 40, p1[1] + nx * 40); p1 = (p1[0] + ny * 40, p1[1] - nx * 40)
        out.append((p1, p2))
    return out


def tline(p1, p2, ext_=34, col=GR):
    return seg(ext(p2, p1, ext_), ext(p1, p2, ext_), col, 2.2)


o = ''
cases = [((70, 120, 40), (170, 120, 28), '(a) not touching: 4'), ((330, 120, 38), (398, 120, 30), '(b) touching externally: 3'),
         ((90, 330, 42), (145, 330, 34), '(c) intersecting: 2'), ((360, 330, 55), (380, 330, 35), '(d) touching internally: 1')]
for c1, c2, t in cases:
    o += circle(c1, TX, 2.5) + circle(c2, TX, 2.5)
    for p1, p2 in ctan(c1, c2) + ctan(c1, c2, True):
        o += tline(p1, p2)
    o += GF.T((c1[0] + c2[0]) / 2, c1[1] + 92, t, MU3, 14, halo=False)
S(s, 'CONCEPT', 'Common tangents',
  de(s, 'A <b>common tangent</b> to two circles is a straight line that is a tangent to both circles.')
  + p('It is found that if two circles of the same size or different sizes')
  + bul(s, ['(a) do not touch, there will be <b>four</b> common tangents.', '(b) touch externally, there will be <b>three</b> common tangents.',
            '(c) intersect, there will be <b>two</b> common tangents.', '(d) touch internally, there will be only <b>one</b> common tangent.']),
  SV(o, 'Four pairs of circles with 4, 3, 2 and 1 common tangents'))

# Contoh 19: jejari 6 dan 4, AB 8
x19 = math.degrees(math.acos(2 / 8))
assert f'{x19:.2f}' == '75.52'
k = 17
Qx = 120; QR = math.sqrt(64 - 4)
A_ = (Qx, 390 - 6 * k); B_ = (Qx + QR * k, 390 - 4 * k)
Q_, R_ = (Qx, 390), (Qx + QR * k, 390)
o = circle((A_[0], A_[1], 6 * k)) + circle((B_[0], B_[1], 4 * k)) + seg((40, 390), (460, 390), c) + seg(A_, B_, AM) + seg(A_, Q_, MU3, 2.5) + seg(B_, R_, MU3, 2.5)
o += rt(Q_, A_, R_, 12) + rt(R_, B_, Q_, 12) + ang(A_, Q_, B_, i('x'), AM, 30, 16, 48) + dot(A_) + dot(B_)
o += GF.T(A_[0] - 14, A_[1] - 6, 'A', TX, 16) + GF.T(B_[0] + 12, B_[1] - 10, 'B', TX, 16) + GF.T(Q_[0], 412, 'Q', TX, 16) + GF.T(R_[0], 412, 'R', TX, 16)
o += GF.T(50, 380, 'P', TX, 16) + GF.T(452, 380, 'S', TX, 16) + side(A_, Q_, '6 cm', TX, 14, 15, B_) + side(B_, R_, '4 cm', TX, 14, 15, A_) + side(A_, B_, '8 cm', AM, 14, 15, Q_)
S(s, 'EXAMPLE 19', 'Common tangents',
  p(f'The diagram on the right shows two circles with centres {i("A")} and {i("B")} with radii 6 cm and 4 cm respectively. Given that {i("PQRS")} is a common tangent to both circles and {i("AB")} = 8 cm, calculate the value of {i("x")}.')
  + p('<b>Solution:</b>')
  + work([('', [f'Draw a line from {i("B")} parallel to {i("QR")} to form a right-angled triangle.', 'Adjacent side of angle <i>x</i> = 6 cm − 4 cm = 2 cm',
                f'cos {i("x")} = {F(2, 8)}', f'{i("x")} = cos<sup>−1</sup> ({F(2, 8)})', f'{i("x")} = 75.52°'])], s, 1, 19),
  SV(o, 'Two circles with centres A and B with common tangent PQRS'))

# Contoh 20: diameter 60 cm, WY 1.6 m
OY = math.sqrt(1.6 ** 2 + 0.3 ** 2)
assert f'{OY:.2f}' == '1.63'
k = 190
O_ = (120, 390 - 0.3 * k); Y_ = (120 + 1.6 * k, 390)
ang_ = math.atan2(0.3, 1.6)
W_ = (Y_[0] + 1.6 * k * math.cos(math.pi - 2 * ang_), Y_[1] - 1.6 * k * math.sin(math.pi - 2 * ang_))
V_ = (120, 390)
fig20 = circle((O_[0], O_[1], 0.3 * k), TX, 3, '#64748B33') + dot(O_) + seg((30, 390), (470, 390), MU3) + seg(Y_, ext(Y_, W_, 30), PA, 5)
fig20 += GF.T(O_[0] - 14, O_[1] - 8, 'O', TX, 16) + GF.T(V_[0], 410, 'V', TX, 16) + GF.T(Y_[0] + 4, 410, 'Y', TX, 16) + labp(W_, O_, 'W', 16)
fig20 += GF.T(60, 300, 'Tyre', MU3, 15) + GF.T(330, 280, 'Stick', PA, 15) + GF.T(440, 410, 'Road', MU3, 15)
S(s, 'EXAMPLE 20', 'Solving problems involving tangents',
  p(f'A stick leans against a tyre as shown in the diagram on the right. Given that {i("V")} is the point of contact between the tyre and the road. {i("W")} is the point of contact between the stick and the tyre while {i("Y")} is the point of contact between the stick and the road. The diameter of the tyre is 60 cm and the distance {i("WY")} is 1.6 metres. Assuming that the road is a straight line, calculate')
  + p(f'(a) the distance {i("VY")}<br>(b) the distance between the centre of the tyre and point {i("Y")} in metres. State your answer correct to two decimal places.'),
  SV(fig20, 'A stick leaning against a tyre, points of contact V, W and Y'))
o = circle((O_[0], O_[1], 0.3 * k), TX, 3) + seg((30, 390), (470, 390), MU3) + seg(Y_, W_, PA, 4) + seg(O_, W_, AM) + seg(O_, V_, AM) + seg(O_, Y_, GR, 2.5, '7 5') + dot(O_)
o += rt(W_, O_, Y_, 11) + rt(V_, O_, Y_, 11) + GF.T(O_[0] - 14, O_[1] - 8, 'O', TX, 16) + GF.T(V_[0], 410, 'V', TX, 16) + GF.T(Y_[0] + 4, 410, 'Y', TX, 16) + labp(W_, O_, 'W', 16)
o += side(W_, Y_, '1.6 m', TX, 16, 15, O_) + side(O_, V_, '0.3 m', TX, 14, 14, Y_)
S(s, 'EXAMPLE 20 (continued)', 'Understanding the problem and planning a strategy',
  work([('Understanding the problem', [f'(a) {i("VY")} and {i("WY")} are tangents to the circle. The diameter of the tyre is 60 cm and the distance {i("WY")} is 1.6 metres.', f'(b) The distance between the centre of the tyre and point {i("Y")}.']),
        ('Planning a strategy', ['Sketch a diagram and label it with the given values.', 'Diameter = 60 cm = 0.6 metre', 'Radius = 30 cm = 0.3 metre', f'{i("WY")} = 1.6 metres'])], s, 1, 18),
  SV(o, 'Sketch of the tyre with centre O, radius 0.3 m and tangent WY 1.6 m'))
S(s, 'EXAMPLE 20 (continued)', 'Implementing the strategy',
  work([('Implementing the strategy', [f'(a) {i("VY")} = {i("WY")} = 1.6 m', f'(b) {i("OY")} = {sq("1.6² + 0.3²")}', f'&emsp;&emsp;&ensp;= {sq("2.65")}', f'{i("OY")} = 1.63 m (2 t.p.)'])], s, 1, 19)
  + work([('Making a conclusion', [f'(a) ∆{i("OWY")} and ∆{i("OVY")} are congruent. Thus, {i("VY")} = {i("WY")} = 1.6 metres.', f'(b) The distance between the centre of the tyre and point {i("Y")}, {i("OY")} = 1.63 m.'])], s, 1, 19),
  SV(o, 'Sketch of the tyre with centre O, radius 0.3 m and tangent WY 1.6 m'))

# =====================================================================
# 6.4 SUDUT DAN TANGEN BAGI BULATAN
# =====================================================================
s = '6.4'
c = COL[s]
Rs, d21 = 34, 255
O_ = (110, 80 + Rs)
A_ = (O_[0] + d21 * math.sin(math.radians(116)), O_[1] - d21 * math.cos(math.radians(116)))
rA = A_[1] - 80
Cq, Bq = (O_[0], 80), (A_[0], 80)
u = ((O_[0] - A_[0]) / d21, (O_[1] - A_[1]) / d21); D_ = (A_[0] + u[0] * rA, A_[1] + u[1] * rA)
assert abs(math.dist(O_, A_) - d21) < 1e-6 and (360 - 90 - 90 - 116) == 64 and (180 - 64) / 2 == 58
fig21 = seg((30, 80), (470, 80), MU3, 4) + circle((O_[0], O_[1], Rs), TX, 3) + circle((A_[0], A_[1], rA), TX, 3) + dot(O_) + dot(A_)
fig21 += seg(Cq, O_, AM, 2.5) + seg(Bq, A_, AM, 2.5) + seg(O_, A_, PA, 3) + seg(Bq, D_, GR, 2.5)
fig21 += ang(O_, Cq, A_, '116°', TX, 22, 14, 42) + ang(Bq, A_, D_, i('x'), GR, 34, 16, 50) + ang(D_, Bq, A_, i('x'), GR, 30, 16, 46)
fig21 += GF.T(Cq[0], 62, 'C', TX, 16) + GF.T(Bq[0], 62, 'B', TX, 16) + GF.T(O_[0] - 14, O_[1] + 8, 'O', TX, 16) + GF.T(A_[0] + 14, A_[1] + 8, 'A', TX, 16) + labp(D_, A_, 'D', 16)
S(s, 'EXAMPLE 21', 'Problems involving angles and tangents',
  p('We always see circular shapes in various daily uses, such as bicycle wheels and pulleys.')
  + p(f'The diagram on the right shows two pulleys with centres {i("O")} and {i("A")} respectively, hung from a flat ceiling {i("BC")}. A rope {i("ADO")} connects both pulleys. Calculate the value of {i("x")}.')
  + work([('Understanding the problem', [f'{i("BC")} is a tangent to the circles at points {i("C")} and {i("B")}.', f'{an("OCB")} = {an("ABC")} = 90°', f'{an("AOC")} = 116°', f'Identify {an("ABD")}, {i("x")}']),
          ('Planning a strategy', [f'{an("OCB")} + {an("ABC")} + {an("AOC")} + {an("OAB")} = 360°', f'{an("ABD")} = {an("ADB")} = {i("x")}'])], s, 1, 17),
  SV(fig21, 'Two pulleys with centres O and A hung from ceiling BC'))
S(s, 'EXAMPLE 21 (continued)', 'Implementing the strategy',
  work([('Implementing the strategy', [f'{an("OAB")} + 90° + 90° + 116° = 360°', f'{an("OAB")} = 360° − 90° − 90° − 116°', '&emsp;&emsp;&ensp;&nbsp;= 64°',
                                   f'{i("AB")} and {i("AD")} are radii. Thus, {an("ABD")} = {an("ADB")} = {i("x")}', f'{i("x")} = {F("180° − 64°", 2)}', f'{i("x")} = 58°'])], s, 1, 19)
  + work([('Making a conclusion', [f'The value of {i("x")} = 58°'])], s, 1, 19),
  SV(fig21, 'Two pulleys with centres O and A hung from ceiling BC'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'sudutbulatan', 'slides_en.js')
HEAD = '/* Nota Bab 6 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
