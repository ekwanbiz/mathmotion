"""Bab 2 T3 Standard Form (ENGLISH / DLP): ayat ikut buku teks English (T3_Chapter2.pdf), nombor sama dengan versi BM."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "2.1", "name": "Significant Figures", "col": "#38BDF8"}, {"no": "2.2", "name": "Standard Form", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


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
o += GF.T(110, 290, 'Earth', TX, 18) + GF.T(410, 250, 'Moon', TX, 18)
o += GF.L((180, 200), (380, 200), AM, 2.5, '7 6') + GF.head((380, 200), (180, 200), AM) + GF.head((180, 200), (380, 200), AM) + GF.T(280, 180, '384 400 km', AM, 20)
o += GF.T(250, 370, 'This value is an estimation', MU3, 16, halo=False) + GF.T(250, 394, 'stated as an approximation.', MU3, 16, halo=False)
S(s, 'DEFINITION', 'Significant figures',
  p('We use measurement in many situations in our daily life. The <b>estimation</b> of a measurement can be done using <b>approximation</b>. For example, the distance between the Earth and the Moon is 384 400 km.')
  + p('The <b>degree of approximation</b> of a measurement to the <b>actual value</b> shows the level of <b>accuracy</b> of the measurement.')
  + de(s, 'The significant figures of an integer or decimal refer to the digits in the number stated accurately to a certain degree of accuracy as required. The number of significant figures is counted starting from a non-zero digit.'),
  SV(o, 'Distance between the Earth and the Moon 384 400 km'))

S(s, 'RULES', 'Determining the number of significant figures',
  p('In general,')
  + bul(s, ['All non-zero digits are significant figures.', 'The digit zero between non-zero digits is a significant figure.',
            'The digit zero at the end of an integer is a significant figure according to the level of accuracy required.',
            'The digit zero at the end of a decimal is a significant figure because it determines the level of accuracy of the decimal.',
            'The digit zero before the first non-zero digit is not a significant figure.'])
  + note('Zeros between non-zero digits are significant figures. For example, 40 009 (5 significant figures).', 'Tips:'),
  stack(work([('Decimal', [f'<span style="font-size:30px;letter-spacing:4px">{hl("0.0070320", PK, [4, 5, 6, 7, 8])}</span>',
                              'Zeros before digit 7: not significant figures, used only to determine place value of digit 7.', 'The digit zero between or at end of decimal is a significant figure.', 'Thus, 0.0070320 has 5 significant figures.']),
              ('Integer', [f'<span style="font-size:30px;letter-spacing:4px">{hl("605000", PK, [0, 1, 2])}</span>', 'All non-zero digits and the zeros between them are significant figures.',
                           'Zeros at the end of the integer: significant figures depending on level of accuracy required.'])], s, 1, 18)))

c1a = [('(a) 4 352', 4, ''), ('(b) 6 007', 4, 'The digit zero between non-zero digits is a significant figure.'), ('(c) 8 102', 4, '')]
c1b = [('(e) 0.6205', 4, 'The digit zero before first non-zero digit is not a significant figure.'), ('(f) 0.0702', 3, ''), ('(g) 15.031', 5, ''),
       ('(h) 2.3400', 5, 'All zeros after non-zero digit at end of decimal are significant figures.')]
assert [ab(x.split(') ')[1]) for x, _, _ in c1b] == [4, 3, 5, 5]


def lines(xs):
    return [f'{x} &nbsp; [{n} s.f.]' + (f' — {t}' if t else '') for x, n, t in xs]


S(s, 'EXAMPLE 1', 'Number of significant figures',
  p('Determine the number of significant figures for the numbers below. (a) 4 352 (b) 6 007 (c) 8 102 (d) 27 000 (e) 0.6205 (f) 0.0702 (g) 15.031 (h) 2.3400')
  + work([('', lines(c1a))], s, 1, 18)
  + work([('(d) 27 000', ['(i) 27 000 [2 s.f.] if level of accuracy is to the nearest thousand.', '(ii) 27 000 [3 s.f.] if level of accuracy is to the nearest hundred.',
                          '(iii) 27 000 [4 s.f.] if level of accuracy is to the nearest ten.', '(iv) 27 000 [5 s.f.] if level of accuracy is to the nearest one.'])], s, 1, 17),
  work([('', lines(c1b))], s, 1, 18))

def rnd_sig(x, n):
    from decimal import Decimal, ROUND_HALF_UP
    d = Decimal(str(x))
    e = d.adjusted() - n + 1
    return float(d.quantize(Decimal(f'1e{e}'), rounding=ROUND_HALF_UP))


assert rnd_sig(57384, 2) == 57000 and rnd_sig(3692, 2) == 3700 and rnd_sig(8951, 2) == 9000
S(s, 'EXAMPLE 2', 'Rounding off integers',
  p('Do you still remember how to round off a number to a certain place value? The same concept and method are used to round off a number to a certain number of significant figures.')
  + p('<b>EXAMPLE 2</b> Round off each of the following numbers to 2 significant figures. (a) 57 384 (b) 3 692 (c) 8 951')
  + note('For integers, the decimal point is placed behind the last digit.', 'Tips:'),
  work([('(a) 57 384', ['3 < 5, thus digit 7 remains unchanged.', '3, 8 and 4 are placed before decimal point. Thus, replace 3, 8 and 4 with zero.', 'Thus, 57 384 = 57 000 (2 s.f.)']),
        ('(b) 3 692', ['9 > 5, thus add 1 to 6.', '9 and 2 are placed before decimal point. Thus, replace 9 and 2 with zero.', 'Thus, 3 692 = 3 700 (2 s.f.)']),
        ('(c) 8 951', ['5 = 5, thus add 1 to 9.', '5 and 1 are placed before decimal point. Thus, replace 5 and 1 with zero.', 'Thus, 8 951 = 9 000 (2 s.f.)'])], s, 1, 18))

assert rnd_sig(47.86, 3) == 47.9 and rnd_sig(47.86, 1) == 50 and rnd_sig(0.006047, 3) == 0.00605 and rnd_sig(0.006047, 2) == 0.0060
S(s, 'EXAMPLE 3', 'Rounding off decimals',
  p('Round off 47.86 to (a) 3 significant figures (b) 1 significant figure')
  + work([('(a)', ['6 > 5, thus add 1 to 8.', 'Digit 6 is placed after decimal point. Thus, 6 is dropped.', 'Thus, 47.86 = 47.9 (3 s.f.)']),
          ('(b)', ['7 > 5, thus add 1 to 4.', 'Digit 7 is placed before decimal point. Thus, 7 is replaced with zero. 8 and 6 are dropped.', 'Thus, 47.86 = 50 (1 s.f.)'])], s, 1, 17),
  stack(work([('EXAMPLE 4', ['Round off 0.006047 to (a) 3 significant figures (b) 2 significant figures']),
        ('(a)', ['7 > 5, thus add 1 to 4.', 'Digit 7 is dropped because it is placed after the decimal point.', 'Thus, 0.006047 = 0.00605 (3 s.f.)']),
        ('(b)', ['4 < 5, thus digit 0 remains unchanged.', 'Digits 4 and 7 are dropped because they are placed after the decimal point.', 'Thus, 0.006047 = 0.0060 (2 s.f.)'])], s, 1, 17),
  note('The digits after the digit that is rounded off in a decimal are dropped.', 'Tips:')))

# =====================================================================
# 2.2 BENTUK PIAWAI
# =====================================================================
s = '2.2'
c = COL[s]
S(s, 'DEFINITION', 'Standard form',
  p('Many scientific fields such as astronomy, biology, physics and engineering frequently use numbers that are too big or too small in their research. These numbers are written in standard form to make writing easier.')
  + de(s, f'<b>Standard form</b> is a way to write a single number in the form {E("<i>A</i>", "<i>n</i>")} where 1 ≤ <i>A</i> &lt; 10 and <i>n</i> is an integer.')
  + p(f'For example, the land area of Malaysia is 330 803 000 000 m². This value can be written as {E("3.308", 11)} m² or {E("3.30803", 11)} m² depending on the number of significant figures required.'),
  stack(table(['Single number', 'Standard form'], [['1 000', E(1, 3)], ['100', E(1, 2)], ['10', E(1, 1)], ['1', E(1, 0)], ['0.1', E(1, -1)], ['0.01', E(1, -2)]], c, 19),
        note('Numbers with value more than 1 will be given positive index. Numbers with value less than 1 will be given negative index.', 'Reminder:')))

S(s, 'EXAMPLE 5', 'Changing a single number to standard form',
  p('When a single number is changed to standard form;')
  + bul(s, ['Numbers with value more than 1 will be given positive index.', 'Numbers with value less than 1 will be given negative index.'])
  + p('<b>EXAMPLE 5</b> Write the following single numbers in standard form. (a) 47 (b) 470 (c) 3 906.2')
  + work([('(a)', ['47 = 4.7 × 10', E('= 4.7', 1)]), ('(b)', ['470 = 4.7 × 100', E('= 4.7', 2)]), ('(c)', ['3 906.2 = 3.9062 × 1 000', E('= 3.9062', 3)])], s, 3, 18),
  stack(work([('EXAMPLE 6', ['Write the following decimals in standard form. (a) 0.682 (b) 0.00491 (c) 0.05207 (d) 0.006012']),
        ('(a)', [f'0.682 = 6.82 × {fr(1, 10)} = {E("6.82", -1)}']), ('(b)', [f'0.00491 = 4.91 × {fr(1, "1 000")} = 4.91 × {fr(1, "10<sup>3</sup>")} = {E("4.91", -3)}']),
        ('(c)', [f'0.05207 = 5.207 × {fr(1, 100)} = {E("5.207", -2)}']), ('(d)', [f'0.006012 = 6.012 × {fr(1, "1 000")} = {E("6.012", -3)}'])], s, 1, 18),
  note(f'{fr(1, "<i>a</i><sup><i>n</i></sup>")} = <i>a</i><sup>−<i>n</i></sup>', 'Flashback:')))

assert 5.32e4 == 53200 and abs(6.105e-5 - 0.00006105) < 1e-15
S(s, 'EXAMPLE 7', 'Changing a number in standard form to a single number',
  p('When a number in standard form is changed to a single number; the number will be equal to 10 or more if the index is positive, and the number will be less than 1 if the index is negative.')
  + p(f'<b>EXAMPLE 7</b> Write {E("5.32", 4)} as a single number.')
  + work([('', [f'{E("5.32", 4)} = 5.32 × 10 000 = 53 200'])], s, 1, 19)
  + p(f'<b>EXAMPLE 8</b> Write {E("6.105", -5)} as a single number.')
  + work([('', [f'{E("6.105", -5)} = 6.105 × {fr(1, "100 000")} = 0.00006105'])], s, 1, 19),
  stack(table(['Prefix', 'Symbol', 'Value'], [['tera', 'T', E(1, 12)], ['giga', 'G', E(1, 9)], ['mega', 'M', E(1, 6)], ['kilo', 'k', E(1, 3)], ['milli', 'm', E(1, -3)], ['micro', 'μ', E(1, -6)], ['nano', 'n', E(1, -9)]], c, 17),
        note('Standard form makes it easier to write very big and very small numbers in a form that is simple and easy to understand.', 'Reminder:')))

S(s, 'EXAMPLE 9', 'Metric units in standard form',
  p('Determine 4 120 terabytes in bytes. State the answer in standard form.')
  + work([('', [f'4 120 terabytes = 4 120 × 10<sup>12</sup> bytes', f'= ({E("4.12", 3)}) × 10<sup>12</sup> bytes', f'= {E("4.12", "3 + 12")} bytes', f'= {E("4.12", 15)} bytes'])], s, 1, 20)
  + note('Use index law <i>a</i><sup><i>m</i></sup> × <i>a</i><sup><i>n</i></sup> = <i>a</i><sup><i>m</i> + <i>n</i></sup>.', 'Tips:'),
  work([('EXAMPLE 10', ['Determine 0.0068 nanometre in metre. State your answer in standard form.']),
        ('Solution:', [f'0.0068 nanometre = 0.0068 × 10<sup>−9</sup> metre', f'= ({E("6.8", -3)}) × 10<sup>−9</sup> metre', f'= {E("6.8", "−3 + (−9)")} metre', f'= {E("6.8", -12)} metre'])], s, 1, 20))

assert abs(3.14e3 + 6.28e3 - 9.42e3) < 1e-6 and abs(5.36e5 + 8.91e5 - 1.427e6) < 1e-3 and abs(6.04e4 + 2.53e3 - 6.293e4) < 1e-6 and abs(8.27e5 - 2.15e4 - 8.055e5) < 1e-6
S(s, 'EXAMPLE 11', 'Add and subtract operations',
  p('Calculate the value of each of the following operations. State your answer in standard form. (a) ' + E('3.14', 3) + ' + ' + E('6.28', 3) + ' (b) ' + E('5.36', 5) + ' + ' + E('8.91', 5)
    + ' (c) ' + E('6.04', 4) + ' + ' + E('2.53', 3) + ' (d) ' + E('8.27', 5) + ' − ' + E('2.15', 4))
  + work([('(a)', [f'= (3.14 + 6.28) × 10<sup>3</sup>', f'= {E("9.42", 3)}']), ('(b)', [f'= (5.36 + 8.91) × 10<sup>5</sup>', f'= {E("14.27", 5)}', f'= {E("1.427", 1)} × 10<sup>5</sup>', f'= {E("1.427", 6)}'])], s, 2, 18)
  + note('For operations of addition and subtraction, change index with small value to index with large value as in Method 1.', 'Tips:'),
  work([('(c) Method 1', [f'= {E("6.04", 4)} + {E("2.53", "−1")} × 10<sup>4</sup>', f'= {E("6.04", 4)} + {E("0.253", 4)}', f'= (6.04 + 0.253) × 10<sup>4</sup>', f'= {E("6.293", 4)}']),
        ('(c) Method 2', [f'= {E("60.4", 3)} + {E("2.53", 3)}', f'= (60.4 + 2.53) × 10<sup>3</sup> = {E("62.93", 3)}', f'= {E("6.293", 4)}']),
        ('(d) Method 1', [f'= {E("8.27", 5)} − {E("0.215", 5)}', f'= (8.27 − 0.215) × 10<sup>5</sup>', f'= {E("8.055", 5)}'])], s, 1, 18))

assert abs(4.62e-3 + 8.15e-3 - 1.277e-2) < 1e-12 and abs(7.36e-4 + 2.18e-5 - 7.578e-4) < 1e-12 and abs(3.4e-5 - 5.2e-6 - 2.88e-5) < 1e-13
S(s, 'EXAMPLE 12', 'Add and subtract with negative indices',
  p('Calculate the value of each of the following operations. State the answer in standard form. (a) ' + E('4.62', -3) + ' + ' + E('8.15', -3) + ' (b) ' + E('7.36', -4) + ' + ' + E('2.18', -5) + ' (c) ' + E('3.4', -5) + ' − ' + E('5.2', -6))
  + work([('(a)', [f'= (4.62 + 8.15) × 10<sup>−3</sup>', f'= {E("12.77", -3)}', f'= {E("1.277", 1)} × 10<sup>−3</sup>', f'= {E("1.277", "1 + (−3)")}', f'= {E("1.277", -2)}'])], s, 1, 18),
  work([('(b) Method 1', [f'= {E("7.36", -4)} + {E("2.18", -1)} × 10<sup>−4</sup>', f'= {E("7.36", -4)} + {E("0.218", -4)}', f'= (7.36 + 0.218) × 10<sup>−4</sup>', f'= {E("7.578", -4)}']),
        ('(c) Method 1', [f'= {E("3.4", -5)} − {E("5.2", -1)} × 10<sup>−5</sup>', f'= {E("3.4", -5)} − {E("0.52", -5)}', f'= (3.4 − 0.52) × 10<sup>−5</sup>', f'= {E("2.88", -5)}'])], s, 1, 18))

assert abs(4e3 * 2.6e5 - 1.04e9) < 1 and abs(8.4e-3 * 5e-4 - 4.2e-6) < 1e-15 and abs(7.2e6 / 3e2 - 2.4e4) < 1e-6 and abs(3.6e-5 / 9e-2 - 4e-4) < 1e-15
S(s, 'EXAMPLE 13', 'Operations of multiplication and division',
  p('Solve the following operations. State your answers in standard form. (a) ' + E(4, 3) + ' × ' + E('2.6', 5) + ' (b) ' + E('8.4', -3) + ' × ' + E(5, -4)
    + f' (c) {fr(E("7.2", 6), E(3, 2))} (d) {fr(E("3.6", -5), E(9, -2))}')
  + note('Law of Indices: (<i>A</i> × 10<sup><i>m</i></sup>) × (<i>B</i> × 10<sup><i>n</i></sup>) = (<i>A</i> × <i>B</i>) × 10<sup><i>m</i> + <i>n</i></sup>; (<i>A</i> × 10<sup><i>m</i></sup>) ÷ (<i>B</i> × 10<sup><i>n</i></sup>) = (<i>A</i> ÷ <i>B</i>) × 10<sup><i>m</i> − <i>n</i></sup>', 'Tips:'),
  work([('(a)', [f'= (4 × 2.6) × 10<sup>3 + 5</sup>', f'= {E("10.4", 8)}', f'= {E("1.04", 9)}']), ('(b)', [f'= (8.4 × 5) × 10<sup>−3 + (−4)</sup>', f'= {E(42, -7)}', f'= {E("4.2", -6)}']),
        ('(c)', [f'= {fr("7.2", 3)} × 10<sup>6 − 2</sup>', f'= {E("2.4", 4)}']), ('(d)', [f'= {fr("3.6", 9)} × 10<sup>−5 − (−2)</sup>', f'= {E("0.4", -3)}', f'= {E(4, -4)}'])], s, 2, 18))

assert abs(600 * 8.5e-3 - 5.1) < 1e-9 and abs(25.5 / 5.1 - 5) < 1e-9
S(s, 'EXAMPLE 14', 'Problem solving',
  p(f'A ream of paper contains 600 sheets of paper. The thickness of one sheet of paper is {E("8.5", -3)} cm. Given the total thickness of <i>n</i> reams of paper is 25.5 cm. Calculate the value of <i>n</i>.')
  + work([('Understanding the problem', ['Number of sheets in 1 ream = 600', f'Thickness of 1 sheet = {E("8.5", -3)} cm', 'Thickness of <i>n</i> reams = 25.5 cm']),
          ('Planning a strategy', ['Determine the thickness of 1 ream of paper.', f'<i>n</i> = {fr("thickness of <i>n</i> reams", "thickness of 1 ream")}'])], s, 1, 18),
  work([('Implementing the strategy', [f'Thickness of 1 ream = 600 × {E("8.5", -3)} cm', '= 5.1 cm', f'Thus, <i>n</i> = {fr("thickness of <i>n</i> reams", "thickness of 1 ream")} = {fr("25.5 cm", "5.1 cm")}', '<i>n</i> = 5']),
        ('Making a conclusion', ['Number of reams is 5.'])], s, 1, 19))

Pp, Rr, Qq = (110, 380), (400, 380), (110, 150)
o = f'<polygon points="{Pp[0]},{Pp[1]} {Rr[0]},{Rr[1]} {Qq[0]},{Qq[1]}" fill="{GR}22" stroke="{GR}" stroke-width="4" stroke-linejoin="round"/>'
o += f'<path d="M124 380 L124 366 L110 366" fill="none" stroke="{MU3}" stroke-width="2"/>'
o += GF.T(96, 392, 'P', TX, 20, 'end') + GF.T(412, 392, 'R', TX, 20, 'start') + GF.T(96, 146, 'Q', TX, 20, 'end')
o += GF.T(255, 410, '3.9 × 10² m', TX, 17) + GF.T(270, 250, '6.5 × 10² m', TX, 17, 'start')
assert abs((6.5e2 ** 2 - 3.9e2 ** 2) ** 0.5 - 5.2e2) < 1e-6 and abs(0.5 * 3.9e2 * 5.2e2 - 1.014e5) < 1e-6 and abs(1.014e5 * 30 - 3042000) < 1e-3
S(s, 'EXAMPLE 15', 'Problem solving',
  p('A property firm bought a piece of land in the shape of a right-angled triangle <i>PQR</i> as shown in the diagram.')
  + bul(s, ['(a) Calculate the value of <i>PQ</i>, in metres and state your answer in standard form.', '(b) If the cost of one square metre of the land is RM30, calculate the total cost of the land in RM.'])
  + work([('Understanding the problem', ['∆<i>PQR</i> is a right-angled triangle. <i>QR</i> is the hypotenuse.']),
          ('Planning a strategy', ['(a) Calculate <i>PQ</i> using Pythagoras’ theorem. (b) Calculate the area of land in the shape of ∆<i>PQR</i>. Multiply total land area by cost of 1 m² of land.'])], s, 1, 17),
  SV(o, 'Right-angled triangle PQR land'))

S(s, 'EXAMPLE 15 (continued)', 'Solution',
  work([('Implementing the strategy', [f'(a) <i>PQ</i>² = [({E("6.5", 2)})² − ({E("3.9", 2)})²] m²', f'= [{E("4.225", 5)} − {E("1.521", 5)}] m²', f'= ({E("2.704", 5)}) m²',
                                   f'<i>PQ</i> = {sq(f"{E("2.704", 5)}")} m = {E("5.2", 2)} m',
                                   f'(b) Area of ∆<i>PQR</i> = {fr(1, 2)} × ({E("3.9", 2)} m) × ({E("5.2", 2)} m) = {E("1.014", 5)} m²', f'Cost of land = {E("1.014", 5)} × RM30 = RM3 042 000.00']),
        ('Making a conclusion', [f'(a) Distance <i>PQ</i> = {E("5.2", 2)} m', '(b) Total cost of land = RM3 042 000.00'])], s, 1, 19),
  SV(o, 'Right-angled triangle PQR land'))

S(s, 'EXAMPLE 16', 'Problem solving',
  p(f'The picture shows the Moon with a diameter of {E("3.4748", 3)} km. Calculate the surface area of the Moon, in km². State the answer in standard form correct to four significant figures. [Surface area of sphere = 4π<i>r</i>² and π = 3.142]')
  + work([('Understanding the problem', ['The Moon is a sphere.', f'Diameter of the Moon is {E("3.4748", 3)} km.', 'Answer is in standard form correct to four significant figures.']),
          ('Planning a strategy', [f'Radius = {fr("diameter", 2)}.', 'Use formula for surface area of sphere to calculate surface area of the Moon.'])], s, 1, 18),
  work([('Implementing the strategy', [f'Radius of the Moon = ({fr(E("3.4748", 3), 2)}) km = {E("1.7374", 3)} km', 'Surface area of the Moon = 4π<i>r</i>²', f'= [4(3.142)({E("1.7374", 3)})²] km²', f'= 37 937 246.5 km²', f'= {E("3.794", 7)} km² (4 s.f.)']),
        ('Making a conclusion', [f'Surface area of the Moon is {E("3.794", 7)} km².'])], s, 1, 19))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'piawai', 'slides_en.js')
HEAD = '/* Nota Bab 2 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip bina_bab2_t3_en.py; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
