"""Bab 9 T3 Straight Lines (ENGLISH / DLP): ayat ikut buku teks English, nombor sama dengan versi BM."""
import os, sys, math
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, mn

SUBS = [{"no": "9.1.1", "name": "Equation y = mx + c", "col": "#38BDF8"}, {"no": "9.1.2", "name": "Other Forms of Equations", "col": "#A78BFA"},
        {"no": "9.1.3", "name": "Points on a Straight Line", "col": "#34D399"}, {"no": "9.1.4", "name": "Parallel Lines", "col": "#FBBF24"},
        {"no": "9.1.5", "name": "Equation of a Straight Line", "col": "#FB923C"}, {"no": "9.1.6", "name": "Point of Intersection", "col": "#F472B6"},
        {"no": "9.1.7", "name": "Problem Solving", "col": "#F87171"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'
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
S(s, 'GENERALISATION', 'Equation of a straight line',
  p('In Form 2, you have learnt how to draw graphs of linear functions and non-linear functions by constructing tables of values of the related functions.')
  + bul(s, [f'For a linear function, {y_} = {i("m")}{x_} + {i("c")}, {i("m")} is the <b>gradient</b> and {i("c")} is the <b>{y_}-intercept</b> of the straight line.',
            f'The graph of the linear function, {y_} = {i("m")}{x_} + {i("c")} is a straight line.'])
  + p('In general,')
  + formula(f'Equation of a straight line: {y_} = {i("m")}{x_} + {i("c")} &emsp; ({i("m")} = gradient, {i("c")} = {y_}-intercept)', c),
  SV(G.svg(), 'Graph of y = 2x + 1 with a gradient of 2 and a y-intercept of 1'))

G = plane((-4.5, 4.5), (-4.5, 4.5), xs=2, ys=2)
line(G, 0, 3, TR, -4.3, 4.3, f'{y_} = 3', 2.2, 3.4, 'start')
G.seg((-2, -4.3), (-2, 4.3), PK, 3.5).text(-1.8, -3.6, f'{x_} = −2', PK, 15, 'start')
S(s, 'CONCEPT', 'Lines parallel to the axes',
  p('It is found that;')
  + bul(s, [f'(a) The graph of the linear function {y_} = {i("m")}{x_} + {i("c")} is a straight line.', f'(b) The graph of the function {y_} = {i("h")} is a straight line <b>parallel to the {x_}-axis</b>.',
            f'(c) The graph of the function {x_} = {i("h")} is a straight line <b>parallel to the {y_}-axis</b>.'])
  + note(f'In the equation {y_} = {i("m")}{x_} + {i("c")}, the coefficient of {y_} is +1.', 'Bulletin:'),
  SV(G.svg(), 'Line y = 3 parallel to the x-axis and line x = -2 parallel to the y-axis'))

# Contoh 1
assert Fr(-3, 4) * 4 == -3
S(s, 'EXAMPLE 1', 'Gradient and y-intercept',
  p(f'Determine the gradient and the {y_}-intercept of the straight line (a) {y_} = 5{x_} + 7 (b) 4{y_} = −3{x_} + 20')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'Compare {y_} = 5{x_} + 7 with {y_} = {i("m")}{x_} + {i("c")}; {i("m")} = 5 and {i("c")} = 7', f'Thus, gradient = 5 and {y_}-intercept = 7']),
          ('(b)', [f'Given 4{y_} = −3{x_} + 20', f'{F(f"4{y_}", 4)} = −{F(f"3{x_}", 4)} + {F(20, 4)} &emsp;(divide by 4 so that the coefficient of {y_} is +1)', f'{y_} = −{F(3, 4)}{x_} + 5',
                   f'Thus, gradient = −{F(3, 4)} and {y_}-intercept = 5'])], s, 1, 18),
  stack(note(f'What is the value of the {y_}-intercept of a straight line that passes through the origin?', 'Smart mind:'), note(f'What is the value of the gradient of the straight line (a) {y_} = {x_} (b) {y_} = −{x_}?', 'Quiz:')))

# Contoh 2
G = plane((-3.5, 6.5), (-1.5, 9.5), box=(30, 40, 240, 430), xs=2, ys=2)
G.seg((-3.3, 7), (6.3, 7), TR, 3.5).pt(-2, 7, '(−2, 7)', AM, -4, -14, 'end').pt(0, 7, '(0, 7)', AM, 6, 22).pt(4, 7, f'P(4, 7)', AM, -2, -14, 'end')
G.text(5.4, 8.1, f'{y_} = {i("h")}', TR, 14)
G2 = plane((-1.5, 7.5), (-1.5, 9.5), box=(260, 40, 480, 430), xs=2, ys=2)
G2.seg((5, -1.3), (5, 9.3), PK, 3.5).pt(5, 8, f'P(5, 8)', AM, -8, -14, 'end').pt(5, 3, f'Q(5, 3)', AM, -8, -14, 'end').pt(5, 0, f'(5, 0)', AM, 8, 14)
G2.text(6.2, 9.0, f'{x_} = {i("h")}', PK, 14)
S(s, 'EXAMPLE 2', 'Lines y = h and x = h',
  p(f'State the value of {i("h")} for the straight line graphs on the right. State the reason for your answer.')
  + pen(s, [f'(a) {i("h")} = 7 because the straight line {y_} = 7 is always 7 units from the {x_}-axis.', f'(b) {i("h")} = 5 because the straight line {x_} = 5 is always 5 units from the {y_}-axis.']),
  SV(G.svg() + G2.svg() + GF.T(30, 26, '(a)', MU3, 15, 'start', halo=False) + GF.T(265, 26, '(b)', MU3, 15, 'start', halo=False), 'Line y = h through y = 7 and line x = h through x = 5'))

# =====================================================================
# 9.1.2 BENTUK LAIN PERSAMAAN
# =====================================================================
s = '9.1.2'
c = COL[s]
G = plane((-1.5, 7.5), (-1.5, 5.5), xs=1, ys=1)
G.seg((-0.6, 4.4), (7.3, -0.9), c, 3.5).pt(6, 0, f'{i("a")}', AM, 6, 18).pt(0, 4, f'{i("b")}', AM, -12, -6, 'end')
G.add(svgfrac(G.X(2.6), G.Y(3.2), '', 'x', 'a', ' + ', c, 16) + svgfrac(G.X(3.6), G.Y(3.2), '', 'y', 'b', ' = 1', c, 16))
S(s, 'GENERALISATION', 'Other forms of the equation of a straight line',
  p(f'The equations of straight lines in the forms {i("a")}{x_} + {i("b")}{y_} = {i("c")}, {F(x_, i("a"))} + {F(y_, i("b"))} = 1 and {y_} = {i("m")}{x_} + {i("c")} produce the same straight line graph if the values of the {x_}-intercept and the {y_}-intercept are the same.')
  + p('In general,')
  + de(s, f'The equation of a straight line {y_} = {i("m")}{x_} + {i("c")} can also be written in the forms {i("a")}{x_} + {i("b")}{y_} = {i("c")} and {F(x_, i("a"))} + {F(y_, i("b"))} = 1; {i("a")} ≠ 0 and {i("b")} ≠ 0')
  + note(f'For the equation of a straight line {F(x_, i("a"))} + {F(y_, i("b"))} = 1, {i("a")} = {x_}-intercept and {i("b")} = {y_}-intercept.', 'Tips:'),
  SV(G.svg(), 'A straight line with x-intercept a and y-intercept b'))

# Contoh 3: 3x + 4y = 24, 2x − 5y = 10
assert Fr(24, 3) == 8 and Fr(24, 4) == 6 and Fr(10, 2) == 5 and Fr(10, -5) == -2
S(s, 'EXAMPLE 3', f'Changing the form {i("a")}{x_} + {i("b")}{y_} = {i("c")}',
  p(f'Convert the equations of the straight lines below to the forms {F(x_, i("a"))} + {F(y_, i("b"))} = 1 and {y_} = {i("m")}{x_} + {i("c")}. (a) 3{x_} + 4{y_} = 24 (b) 2{x_} − 5{y_} = 10')
  + work([('(a)(i)', [f'3{x_} + 4{y_} = 24', f'{F(f"3{x_}", 24)} + {F(f"4{y_}", 24)} = {F(24, 24)} &emsp;(divide by 24 to obtain the value 1)', f'{F(x_, 8)} + {F(y_, 6)} = 1']),
          ('(a)(ii)', [f'3{x_} + 4{y_} = 24', f'4{y_} = −3{x_} + 24', f'{F(f"4{y_}", 4)} = {F(f"−3{x_}", 4)} + {F(24, 4)} &emsp;(divide by 4 so that the coefficient of {y_} is +1)', f'{y_} = −{F(3, 4)}{x_} + 6'])], s, 2, 17),
  stack(work([('(b)(i)', [f'2{x_} − 5{y_} = 10', f'{F(f"2{x_}", 10)} − {F(f"5{y_}", 10)} = {F(10, 10)}', f'{F(x_, 5)} − {F(y_, 2)} = 1']),
              ('(b)(ii)', [f'2{x_} − 5{y_} = 10', f'−5{y_} = −2{x_} + 10', f'{F(f"−5{y_}", "(−5)")} = {F(f"−2{x_}", "(−5)")} + {F(10, "(−5)")}', f'{y_} = {F(2, 5)}{x_} − 2'])], s, 1, 17)))

# Contoh 4: x/4 + y/2 = 1 ; −x/3 + y/6 = 1
S(s, 'EXAMPLE 4', f'Changing the form {F(x_, i("a"))} + {F(y_, i("b"))} = 1',
  p(f'Convert the equations of the straight lines below to the forms {i("a")}{x_} + {i("b")}{y_} = {i("c")} and {y_} = {i("m")}{x_} + {i("c")}. (a) {F(x_, 4)} + {F(y_, 2)} = 1 (b) −{F(x_, 3)} + {F(y_, 6)} = 1')
  + work([('(a)(i)', [f'{F(x_, 4)} + {F(y_, 2)} = 1', f'{F(f"2{x_} + 4{y_}", "4(2)")} = 1 &emsp;(method of equating the denominators)', f'2{x_} + 4{y_} = 8', f'{x_} + 2{y_} = 4']),
          ('(a)(ii)', [f'{F(y_, 2)} = −{F(x_, 4)} + 1', f'× 2: {y_} = −{F(1, 2)}{x_} + 2'])], s, 2, 17),
  stack(work([('(b)(i)', [f'−{F(x_, 3)} + {F(y_, 6)} = 1', f'{F(f"−6{x_} + 3{y_}", "3(6)")} = 1', f'−6{x_} + 3{y_} = 18', f'−2{x_} + {y_} = 6']),
              ('(b)(ii)', [f'{F(y_, 6)} = {F(x_, 3)} + 1', f'× 6: {y_} = 2{x_} + 6'])], s, 1, 17),
        note(f'−2{x_} + {y_} = 6 can also be written as 2{x_} − {y_} = −6.', 'Tips:')))

# Contoh 5: y = −3x + 12 ; y = 2x + 8
S(s, 'EXAMPLE 5', f'Changing the form {y_} = {i("m")}{x_} + {i("c")}',
  p(f'Convert the following equations of straight lines to the forms {i("a")}{x_} + {i("b")}{y_} = {i("c")} and {F(x_, i("a"))} + {F(y_, i("b"))} = 1. (a) {y_} = −3{x_} + 12 (b) {y_} = 2{x_} + 8')
  + p('<b>Solution:</b>')
  + work([('(a)', [f'(i) {y_} = −3{x_} + 12', f'3{x_} + {y_} = 12', f'(ii) {F(f"3{x_}", 12)} + {F(y_, 12)} = {F(12, 12)}', f'{F(x_, 4)} + {F(y_, 12)} = 1']),
          ('(b)', [f'(i) {y_} = 2{x_} + 8', f'−2{x_} + {y_} = 8', f'(ii) {F(f"−2{x_}", 8)} + {F(y_, 8)} = {F(8, 8)}', f'−{F(x_, 4)} + {F(y_, 8)} = 1'])], s, 2, 19)
  + note(f'Among the three forms of the equation of a straight line that you have learnt, which form is the easiest to obtain the values of the gradient, the {y_}-intercept and the {x_}-intercept of a straight line? Discuss.', 'Discussion corner:'))

# =====================================================================
# 9.1.3 TITIK PADA GARIS LURUS
# =====================================================================
s = '9.1.3'
c = COL[s]
G = plane((-1.5, 6.5), (-1.5, 4.5), xs=1, ys=1)
line(G, Fr(-1, 2), 3, c, -0.8, 6.4, f'{x_} + 2{y_} = 6', 3.3, 2.3, 'start')
G.pt(6, 0, f'P(6, 0)', AM, -2, -16, 'end').pt(2, 2, f'Q(2, 2)', AM, -2, -16, 'end').pt(2, 3, f'R(2, 3)', PK, 8, -12)
S(s, 'CONCEPT', 'Points on a straight line',
  p(f'The diagram on the right shows the straight line {x_} + 2{y_} = 6. Substitute the coordinates of points {i("P")}, {i("Q")} and {i("R")} into the equation.')
  + table(['Point', f'Left: {x_} + 2{y_}', 'Right', ''], [[f'P(6, 0)', '6 + 2(0) = 6', '6', 'Equal'], [f'Q(2, 2)', '2 + 2(2) = 6', '6', 'Equal'], [f'R(2, 3)', '2 + 2(3) = 8', '6', 'Not equal']], c, 17, rvrows=(0, 1, 2))
  + p('From the activity above, it is found that;')
  + bul(s, ['(a) the points on the straight line or the points through which the straight line passes will <b>satisfy</b> the equation of the straight line.', '(b) the points that do not lie on the straight line <b>will not satisfy</b> the equation of the straight line.']),
  SV(G.svg(), 'Line x + 2y = 6 passes through P and Q but not through R'))

# Contoh 6
assert 4 * 3 - 1 == 11 and 2 * (-3) - 3 * 2 != 12 and Fr(8, 4) + Fr(-3, 3) == 1 and 3 * 2 != -4 * 1 - 9
S(s, 'EXAMPLE 6', 'Determining points on a straight line',
  p(f'Determine whether point {i("P")} lies on the given straight line. (a) {y_} = 4{x_} − 1, {i("P")}(3, 11) (b) 2{x_} − 3{y_} = 12, {i("P")}(−3, 2) (c) {F(x_, 4)} + {F(y_, 3)} = 1, {i("P")}(8, −3) (d) 3{y_} = −4{x_} − 9, {i("P")}(1, 2)')
  + work([('(a)', ['Left: = 11', f'Right: 4{x_} − 1 = 4(3) − 1 = 11', 'Equal', f'Thus, {i("P")}(3, 11) lies on the straight line {y_} = 4{x_} − 1.']),
          ('(b)', [f'Left: 2{x_} − 3{y_} = 2(−3) − 3(2) = −12', 'Right: = 12', 'Not equal', f'Thus, {i("P")}(−3, 2) does not lie on the straight line 2{x_} − 3{y_} = 12.'])], s, 1, 17),
  stack(work([('(c)', [f'Left: {F(8, 4)} + {F("(−3)", 3)} = 2 − 1 = 1', 'Right: = 1', 'Equal', f'Thus, {i("P")}(8, −3) lies on the straight line {F(x_, 4)} + {F(y_, 3)} = 1.']),
          ('(d)', [f'Left: 3{y_} = 3(2) = 6', f'Right: −4{x_} − 9 = −4(1) − 9 = −13', 'Not equal', f'Thus, {i("P")}(1, 2) does not lie on the straight line 3{y_} = −4{x_} − 9.'])], s, 1, 17)))

# Contoh 7: 4x + 3y = 24, P(3, q)
assert Fr(24, 4) == 6 and Fr(24, 3) == 8 and Fr(24 - 12, 3) == 4
G = plane((-1.5, 7.5), (-1.5, 9.5), xs=1, ys=1)
line(G, Fr(-4, 3), 8, c, -0.6, 6.8, f'4{x_} + 3{y_} = 24', 4.2, 4.6, 'start')
G.pt(6, 0, i('h'), AM, 4, 18).pt(0, 8, i('k'), AM, -12, 0, 'end').pt(3, 4, f'P(3, {i("q")})', PK, 10, -10)
S(s, 'EXAMPLE 7', 'Intercepts and gradient from an equation',
  p(f'The diagram on the right shows the straight line 4{x_} + 3{y_} = 24. Given that {i("O")} is the origin, determine the value of (a) {i("h")} (b) {i("k")} (c) {i("q")} (d) the gradient of the straight line')
  + work([('(a)', [f'{i("h")} is the {x_}-intercept. Thus, {y_} = 0', f'4({i("h")}) + 3(0) = 24', f'{i("h")} = {F(24, 4)} = 6']),
          ('(b)', [f'{i("k")} is the {y_}-intercept. Thus, {x_} = 0', f'4(0) + 3({i("k")}) = 24', f'{i("k")} = {F(24, 3)} = 8']),
          ('(c)', [f'P(3, {i("q")}) is on the straight line.', f'4(3) + 3({i("q")}) = 24', f'3{i("q")} = 12', f'{i("q")} = 4']),
          ('(d)', [f'{i("m")} = −{F(f"{y_}-intercept", f"{x_}-intercept")}', f'= −{F(8, 6)} = −{F(4, 3)}'])], s, 2, 16),
  SV(G.svg(), 'Line 4x + 3y = 24 with intercepts h and k and point P(3, q)'))

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
S(s, 'GENERALISATION', 'Gradients of parallel lines',
  p('You have learnt that the gradient of a straight line is the ratio of the vertical distance to the horizontal distance and the corresponding angles of parallel lines are equal.')
  + p(f'The straight lines {y_} = 2{x_} + 4, {y_} = 2{x_} + 2, {y_} = 2{x_}, {y_} = 2{x_} − 2 and {y_} = 2{x_} − 4 are parallel because they have the same gradient, that is {i("m")} = 2 and the same corresponding angle, that is 63.43°.')
  + p('In general,') + de(s, 'Straight lines that have the same gradient are <b>parallel</b>.')
  + note(f'To determine the gradient of a straight line, convert the given equation of the straight line to the form {y_} = {i("m")}{x_} + {i("c")}.', 'Tips:'),
  SV(G.svg(), 'Five parallel lines y = 2x + c'))

# Contoh 8 & 9
S(s, 'EXAMPLE 8', 'Parallel lines',
  p(f'Determine whether the straight line {y_} = 4{x_} + 3 is parallel to the straight line 8{x_} − 2{y_} = 5.')
  + p('<b>Solution:</b>')
  + work([('', [f'{y_} = 4{x_} + 3', f'Compare with {y_} = {i("m")}{x_} + {i("c")}', 'Gradient = 4']),
          ('', [f'8{x_} − 2{y_} = 5', f'−2{y_} = −8{x_} + 5', f'{F(f"−2{y_}", "(−2)")} = {F(f"−8{x_}", "(−2)")} + {F(5, "(−2)")}', f'{y_} = 4{x_} − {F(5, 2)}', 'Gradient = 4'])], s, 2, 19)
  + p(f'The gradients of both straight lines are <b>equal</b>, thus {y_} = 4{x_} + 3 is parallel to 8{x_} − 2{y_} = 5.'))
S(s, 'EXAMPLE 9', 'Lines that are not parallel',
  p(f'Determine whether the straight line {y_} = 4{x_} + 7 is parallel to the straight line 8{y_} = 4{x_} − 16.')
  + p('<b>Solution:</b>')
  + work([('', [f'{y_} = 4{x_} + 7', f'Compare with {y_} = {i("m")}{x_} + {i("c")}', 'Gradient = 4']),
          ('', [f'8{y_} = 4{x_} − 16', f'{y_} = {F(f"4{x_}", 8)} − {F(16, 8)}', f'{y_} = {F(1, 2)}{x_} − 2', f'Gradient = {F(1, 2)}'])], s, 2, 19)
  + p(f'The gradients of both straight lines are <b>not equal</b>. Thus, {y_} = 4{x_} + 7 is not parallel to 8{y_} = 4{x_} − 16.')
  + note('Will two parallel lines intersect? Discuss.', 'Discussion corner:'))

# Contoh 10: 6x + 4y = 20 selari dengan 3x + hy = 15 → h = 2
assert Fr(-6, 4) == Fr(-3, 2)
S(s, 'EXAMPLE 10', 'Finding a coefficient from parallel lines',
  p(f'Given that the straight line 6{x_} + 4{y_} = 20 is parallel to the straight line 3{x_} + {i("h")}{y_} = 15, calculate the value of {i("h")}.')
  + p('<b>Solution:</b> If both straight lines are parallel, then the gradients are equal.')
  + work([(f'For 6{x_} + 4{y_} = 20', [f'4{y_} = −6{x_} + 20', f'{y_} = −{F(3, 2)}{x_} + 5', f'Gradient = −{F(3, 2)}']),
          (f'For 3{x_} + {i("h")}{y_} = 15', [f'{i("h")}{y_} = −3{x_} + 15', f'{y_} = −{F(3, i("h"))}{x_} + {F(15, i("h"))}', f'Gradient = −{F(3, i("h"))}']),
          ('Thus,', [f'−{F(3, 2)} = −{F(3, i("h"))}', f'{i("h")} = 3 × {F(2, 3)}', f'{i("h")} = 2'])], s, 3, 18))

# =====================================================================
# 9.1.5 PERSAMAAN GARIS LURUS
# =====================================================================
s = '9.1.5'
c = COL[s]
S(s, 'STEPS', 'Determining the equation of a straight line',
  steps(s, [f'Determine the value of the gradient, {i("m")}.', 'Determine a point through which the straight line passes or a point on the straight line.',
              f'Substitute the value of the gradient, {i("m")}, the value of the {x_}-coordinate and the value of the {y_}-coordinate of the point into the equation of the straight line {y_} = {i("m")}{x_} + {i("c")} to determine the value of {i("c")}, that is the value of the {y_}-intercept.',
              f'Substitute the values of the gradient and the {y_}-intercept determined into the equation of the straight line {y_} = {i("m")}{x_} + {i("c")}.']))

# Contoh 11: m = 2/3, P(9, 4)
assert 4 - Fr(2, 3) * 9 == -2
S(s, 'EXAMPLE 11', 'The gradient and a point are given',
  p(f'Determine the equation of the straight line with a gradient of {F(2, 3)} that passes through point {i("P")}(9, 4).')
  + p('<b>Solution:</b>')
  + work([('', [f'{i("m")} = {F(2, 3)}, {x_} = 9, {y_} = 4', f'Substitute the values of {i("m")}, {x_} and {y_} into {y_} = {i("m")}{x_} + {i("c")} to determine the value of {i("c")}.', f'4 = {F(2, 3)}(9) + {i("c")}', f'4 = 6 + {i("c")}',
                f'{i("c")} = 4 − 6', f'{i("c")} = −2', f'Thus, the equation of the straight line is {y_} = {F(2, 3)}{x_} − 2.'])], s, 1, 19),
  stack(note(f'Determine the equation of the straight line with a gradient of 0 that passes through point {i("P")}(1, 5).', 'Quiz:')))

# Contoh 12: P(−2, 7), Q(1, −8)
m12 = Fr(-8 - 7, 1 - (-2)); c12 = 7 - m12 * (-2)
assert m12 == -5 and c12 == -3 and -8 == m12 * 1 + c12
S(s, 'EXAMPLE 12', 'Two points are given',
  p(f'Determine the equation of the straight line that passes through points {i("P")}(−2, 7) and {i("Q")}(1, −8).')
  + p('<b>Solution:</b>')
  + work([('', [f'{i("m")} = {F("−8 − 7", "1 − (−2)")} = {F(-15, 3)} = −5', f'For point {i("P")}(−2, 7), {x_} = −2, {y_} = 7.', f'Substitute the values of {i("m")}, {x_} and {y_} into {y_} = {i("m")}{x_} + {i("c")} to determine the value of {i("c")}.',
                f'7 = (−5)(−2) + {i("c")}', f'7 = 10 + {i("c")}', f'{i("c")} = 7 − 10', f'{i("c")} = −3', f'Thus, the equation of the straight line is {y_} = −5{x_} − 3.'])], s, 1, 19),
  stack(note(f'You can also substitute the values of point {i("Q")}, that is {x_} = 1 and {y_} = −8 as well as {i("m")} = −5 into {y_} = {i("m")}{x_} + {i("c")} to calculate the value of {i("c")}.', 'Tips:')))

# Contoh 13: A(3, 5), M(0, 5), N(3, 0)
G = plane((-1.5, 5.5), (-1.5, 6.5), xs=1, ys=1)
G.seg((-1.3, 5), (5.3, 5), c, 3.5).seg((3, -1.3), (3, 6.3), PK, 3.5)
G.pt(0, 5, f'M(0, 5)', AM, 8, -14).pt(3, 5, f'A(3, 5)', AM, 8, -14).pt(3, 0, f'N(3, 0)', AM, 8, 16)
G.text(-1.2, 5.4, 'P', TX, 15).text(5.2, 5.4, 'Q', TX, 15).text(3.3, 6.2, 'S', TX, 15, 'start').text(3.3, -1.1, 'R', TX, 15, 'start')
S(s, 'EXAMPLE 13', 'Lines parallel to the axes',
  p(f'The diagram on the right shows the straight lines {i("PQ")} and {i("RS")}. Given that the straight line {i("PQ")} is parallel to the {x_}-axis and the straight line {i("RS")} is parallel to the {y_}-axis, determine (a) the equation of the straight line {i("PQ")} (b) the equation of the straight line {i("RS")}')
  + work([('(a)', [f'Gradient of the straight line {i("PQ")} with {i("A")}(3, 5) and {i("M")}(0, 5):', f'{i("m")} = {F("5 − 5", "3 − 0")} = {F(0, 3)} = 0', f'{y_}-intercept = 5', f'Thus, the equation of the straight line {i("PQ")} is {y_} = 0({x_}) + 5', f'{y_} = 5']),
          ('(b)', [f'Gradient of the straight line {i("RS")} with {i("A")}(3, 5) and {i("N")}(3, 0):', f'{i("m")} = {F("5 − 0", "3 − 3")} = {F(5, 0)} = Undefined', f'The straight line {i("RS")} is always 3 units from the {y_}-axis.', f'Thus, the equation of the straight line {i("RS")} is {x_} = 3'])], s, 2, 16),
  SV(G.svg(), 'Line PQ parallel to the x-axis through y = 5 and line RS parallel to the y-axis through x = 3'))

# Contoh 14: AB y = −3x + 4, P(4, 2)
c14 = 2 - (-3) * 4
assert c14 == 14
G = plane((-1.5, 6.5), (-2.5, 8.5), box=(60, 30, 460, 440), xs=1, ys=2, gy=1)
line(G, -3, 4, c, -0.5, 2.1, f'{y_} = −3{x_} + 4', 1.1, 6.5, 'start')
line(G, -3, 14, PK, 3.5, 4.8, reveal=True)
G.pt(4, 2, f'P(4, 2)', AM, 10, -8).text(-0.4, 6.0, 'A', TX, 15).text(2.2, -2.2, 'B', TX, 15)
S(s, 'EXAMPLE 14', 'A parallel line through a point',
  p(f'The diagram on the right shows the straight line {i("AB")} with the equation {y_} = −3{x_} + 4. Determine the equation of the straight line that is parallel to {i("AB")} and passes through point {i("P")}(4, 2).')
  + p('<b>Solution:</b>')
  + work([('', [f'The equation of the straight line {i("AB")} is {y_} = −3{x_} + 4, thus the gradient of {i("AB")} is −3.', f'The required straight line is parallel to {i("AB")}, thus the gradient, {i("m")} of the straight line is −3.',
                f'Given {i("P")}(4, 2), thus, {x_} = 4 and {y_} = 2.', f'2 = (−3)(4) + {i("c")}', f'2 = −12 + {i("c")}', f'{i("c")} = 14',
                f'Thus, the equation of the straight line that is parallel to {i("AB")} and passes through point {i("P")} is {y_} = −3{x_} + 14.'])], s, 1, 18),
  SV(G.svg(), 'Line AB y = -3x + 4 and point P(4, 2)'))

# Contoh 15: 3x + 2y = 10, G(4, 7)
c15 = 7 - Fr(-3, 2) * 4
assert c15 == 13
S(s, 'EXAMPLE 15', 'Parallel lines in the form ax + by = c',
  p(f'Determine the equation of the straight line that is parallel to the straight line 3{x_} + 2{y_} = 10 and passes through point {i("G")}(4, 7).')
  + p('<b>Solution:</b>')
  + work([('', [f'Given the equation of the straight line 3{x_} + 2{y_} = 10.', f'Thus, 2{y_} = −3{x_} + 10', f'{y_} = −{F(3, 2)}{x_} + 5', f'Gradient of the straight line = −{F(3, 2)}.']),
          ('', [f'The required straight line is parallel, thus its gradient is −{F(3, 2)}.', f'{x_} = 4 and {y_} = 7: 7 = (−{F(3, 2)})(4) + {i("c")}', f'7 = −6 + {i("c")}', f'{i("c")} = 13'])], s, 2, 18)
  + p(f'Thus, the equation of the straight line that is parallel to 3{x_} + 2{y_} = 10 and passes through point {i("G")} is {y_} = −{F(3, 2)}{x_} + 13.'))

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
S(s, 'EXAMPLE 16', 'Point of intersection: graphical method',
  p('The point of intersection of two straight lines can be determined by the following methods: (1) drawing both straight line graphs on the same Cartesian plane and determining the point of intersection from the graph. (2) solving simultaneous equations using (a) the substitution method (b) the elimination method.')
  + p(f'Determine the point of intersection of the straight line 3{x_} + {y_} = 7 and the straight line {x_} + 2{y_} = −1.')
  + table([x_] + t1[0], [[y_] + t1[1]], TR, 16)
  + table([x_] + t2[0], [[y_] + t2[1]], PK, 16)
  + p(f'From the graph, the point of intersection is (3, −2).'),
  SV(G.svg(), 'Graphs of 3x + y = 7 and x + 2y = -1 intersect at (3, -2)'))
S(s, 'EXAMPLE 16 (continued)', 'Substitution and elimination methods',
  work([('Substitution Method', [f'3{x_} + {y_} = 7 ......①', f'{x_} + 2{y_} = −1 ......②', f'From ①, {y_} = 7 − 3{x_} ......③', f'Substitute ③ into ②:', f'{x_} + 2(7 − 3{x_}) = −1', f'{x_} + 14 − 6{x_} = −1', f'−5{x_} = −15', f'{x_} = 3',
                                f'Substitute {x_} = 3 into ③:', f'{y_} = 7 − 3(3) = −2']),
        ('Elimination Method', [f'① × 2: 6{x_} + 2{y_} = 14 ......④', f'④ − ②: 5{x_} = 15', f'{x_} = 3', f'Substitute {x_} = 3 into ①:', f'3(3) + {y_} = 7', f'{y_} = 7 − 9', f'{y_} = −2'])], s, 2, 18)
  + p('Thus, the point of intersection is (3, −2).')
  + note('Calculators are only allowed to check answers.', 'Reminder:'))

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
S(s, 'EXAMPLE 17', 'Solving problems involving straight lines',
  p(f'The diagram on the right shows a parallelogram {i("PQRS")}. Given that the gradient of {i("SR")} is {F(1, 3)} and the {y_}-intercept of the straight line {i("PS")} is −8, determine (a) the value of {i("h")} (b) the equation of the straight line {i("PS")} (c) the {x_}-intercept of the straight line {i("PS")}')
  + work([('Understanding the problem', [f'• {i("PQRS")} is a parallelogram.', f'• Gradient of {i("PQ")} = gradient of {i("SR")} = {F(1, 3)}.', f'• The {y_}-intercept of {i("PS")} is −8.']),
          ('Planning a strategy', [f'• The value of {i("h")} can be determined by using the value of the gradient, that is gradient of {i("PQ")} = gradient of {i("SR")} = {F(1, 3)}.', f'• The {y_}-intercept of the straight line {i("PS")} is −8, thus the coordinates of {i("T")} are (0, −8).',
                                  f'• The {x_}-intercept of the straight line {i("PS")} can be determined by substituting {y_} = 0 into the equation of {i("PS")}.'])], s, 1, 15),
  SV(G.svg(), 'Parallelogram PQRS with P(-6, 4) and Q(0, h)'))
S(s, 'EXAMPLE 17 (continued)', 'Implementing the strategy',
  work([('(a)', [f'Gradient of {i("PQ")} = Gradient of {i("SR")} = {F(1, 3)}', f'{F(f"{i("h")} − 4", "0 − (−6)")} = {F(1, 3)}', f'{F(f"{i("h")} − 4", 6)} = {F(1, 3)}', f'{i("h")} − 4 = 2', f'{i("h")} = 6']),
        ('(b)', [f'The straight line {i("PS")} passes through point {i("T")}(0, −8)', f'Gradient of {i("PS")} = {F("−8 − 4", "0 − (−6)")} = {F(-12, 6)} = −2', f'The {y_}-intercept of the straight line {i("PS")} is −8', f'Thus, the equation of the straight line {i("PS")} is {y_} = −2{x_} − 8.']),
        ('(c)', [f'{y_} = −2{x_} − 8', f'When {y_} = 0,', f'0 = −2{x_} − 8', f'2{x_} = −8', f'{x_} = −4'])], s, 3, 17)
  + work([('Making a conclusion', [f'(a) The value of {i("h")} is 6. (b) The equation of the straight line {i("PS")} is {y_} = −2{x_} − 8. (c) The {x_}-intercept of the straight line {i("PS")} is −4.'])], s, 1, 17))

# Contoh 18: y = −x/2 + 4 dan 3x − y = 10 → A(4, 2)
assert -Fr(1, 2) * 4 + 4 == 2 and 3 * 4 - 2 == 10
G = plane((-1.5, 8.5), (-5.5, 5.5), box=(60, 40, 450, 440), xs=1, ys=1, gy=1)
line(G, Fr(-1, 2), 4, TR, -1, 8.4, reveal=True)
G.add(svgfrac(G.X(4.9), G.Y(2.6), 'y = −', '1', '2', 'x + 4', TR, 15), True)
line(G, 3, -10, PK, 1.6, 5.0, f'3{x_} − {y_} = 10', 5.2, 4.8, 'start', reveal=True)
G.pt(4, 2, f'A(4, 2)', AM, -10, -14, 'end', reveal=True)
S(s, 'EXAMPLE 18', 'Point of intersection by the graphical method',
  p(f'Given that the straight lines {y_} = −{F(1, 2)}{x_} + 4 and 3{x_} − {y_} = 10 intersect at point {i("A")}, determine the coordinates of point {i("A")} by using the graphical method.')
  + work([(f'For {y_} = −{F(1, 2)}{x_} + 4', [f'{x_} = 0: {y_}-intercept = 4', f'{y_} = 0: {F(1, 2)}{x_} = 4, {x_}-intercept = 8']),
          (f'For 3{x_} − {y_} = 10', [f'{x_} = 0: {y_}-intercept = −10', f'{y_} = 0: {x_}-intercept = {F(10, 3)}'])], s, 2, 17)
  + p(f'From the graph, the coordinates of {i("A")} are (4, 2).')
  + note(f'A straight line can be drawn if the {x_}-intercept and the {y_}-intercept of the straight line are known.', 'Tips:'),
  SV(G.svg(), 'Graph of two straight lines intersecting at A(4, 2)'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'garislurus', 'slides_en.js')
HEAD = '/* Nota Bab 9 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
