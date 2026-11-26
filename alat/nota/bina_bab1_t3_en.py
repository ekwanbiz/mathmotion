"""Bab 1 T3 Indeks (ENGLISH / DLP): terjemahan nota BM (bina_bab1_t3.py). Nombor, contoh dan rajah sama dengan versi BM."""
import os, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
from graf import TR, PA, PU, AM, PK, GR, MU3, TX, mn

SUBS = [{"no": "1.1", "name": "Index Notation", "col": "#FBBF24"}, {"no": "1.2", "name": "Law of Indices", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Remember:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'
P = pw
i = lambda v: f'<i>{v}</i>'

# =====================================================================
# 1.1 INDEX NOTATION
# =====================================================================
s = '1.1'
c = COL[s]
big = (f'<div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:18px;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:30px">'
       f'<div style="font-size:72px;font-weight:800">{i("a")}<sup style="color:{PK}">{i("n")}</sup></div>'
       f'<div style="display:flex;gap:40px;font-size:20px"><span><b style="color:{TR}">{i("a")}</b> : base</span><span><b style="color:{PK}">{i("n")}</b> : index</span></div>'
       f'<div style="font-size:22px;font-weight:700">{P(5, 4)} = 5 × 5 × 5 × 5</div><div style="font-size:16px;color:{MU3}">read as "5 to the power of 4"</div></div>')
S(s, 'DEFINITION', 'Index form',
  p('A number that is multiplied repeatedly can be written in index form.')
  + de(s, f'The value of the index in an index form is equal to the number of times the base is multiplied repeatedly. In general, {P(i("a"), i("n"))} = {i("a")} × {i("a")} × {i("a")} × … × {i("a")} ({i("n")} factors); {i("a")} ≠ 0')
  + note(f'{i("a")} is the base and {i("n")} is the index.', 'Remember:'),
  big)

S(s, 'EXAMPLE 1', 'Writing in index form',
  p('Write the following repeated multiplications in index form.')
  + bul(s, ['(a) 6 × 6 × 6 × 6', '(b) (−3) × (−3) × (−3) × (−3) × (−3)', '(c) 0.2 × 0.2 × 0.2',
            f'(d) {fr(2, 5)} × {fr(2, 5)} × {fr(2, 5)} × {fr(2, 5)}', f'(e) {i("p")} × {i("p")} × {i("p")} × {i("p")} × {i("p")} × {i("p")}', f'(f) {i("k")} × {i("k")} × … × {i("k")} (repeated {i("n")} times)']),
  work([('', [f'(a) {P(6, 4)} &nbsp; (repeated four times)', f'(b) {P("(−3)", 5)} &nbsp; (repeated five times)', f'(c) {P("(0.2)", 3)} &nbsp; (repeated three times)',
              f'(d) {P(f"({fr(2, 5)})", 4)} &nbsp; (repeated four times)', f'(e) {P(i("p"), 6)} &nbsp; (repeated six times)', f'(f) {P(i("k"), i("n"))}'])], s, 1, 20))

assert 3 ** 4 == 81 and 9 ** 2 == 81
S(s, 'EXAMPLE 2', 'Converting a number into index form',
  p('A number can be written in index form if a suitable base is chosen. You can use the repeated division method or the repeated multiplication method to convert a number into a number in index form.')
  + p('<b>EXAMPLE 2</b> Write 81 in index form using base 3 and base 9.')
  + note('The division is continued until the value 1 is obtained.', 'Tip:'),
  work([('Repeated division method (base 3)', ['81 ÷ 3 = 27, 27 ÷ 3 = 9, 9 ÷ 3 = 3, 3 ÷ 3 = 1', '81 is divided repeatedly by 3 four times.', f'Hence, 81 = {P(3, 4)}']),
        ('Repeated multiplication method (base 3)', ['3 × 3 = 9, 9 × 3 = 27, 27 × 3 = 81', f'Hence, 81 = {P(3, 4)}']),
        ('Base 9', ['81 ÷ 9 = 9, 9 ÷ 9 = 1  or  9 × 9 = 81', f'Hence, 81 = {P(9, 2)}'])], s, 1, 19))

assert Fr(27, 125) == Fr(3, 5) ** 3
S(s, 'EXAMPLE 3', 'Fractions in index form',
  p(f'Write {fr(27, 125)} in index form using base {fr(3, 5)}.')
  + work([('Repeated division method', ['27 ÷ 3 = 9, 9 ÷ 3 = 3, 3 ÷ 3 = 1 (3 times)', '125 ÷ 5 = 25, 25 ÷ 5 = 5, 5 ÷ 5 = 1 (3 times)', f'Hence, {fr(27, 125)} = {P(f"({fr(3, 5)})", 3)}']),
          ('Repeated multiplication method', [f'{fr(3, 5)} × {fr(3, 5)} = {fr(9, 25)}', f'{fr(9, 25)} × {fr(3, 5)} = {fr(27, 125)}', f'Hence, {fr(27, 125)} = {P(f"({fr(3, 5)})", 3)}'])], s, 2, 19)
  + note('For fractions, the numerator and the denominator are divided or multiplied repeatedly the same number of times.', 'Remember:'))

assert 3 ** 4 == 81 and round(0.4 ** 3, 3) == 0.064 and 4 ** 5 == 1024 and (-2) ** 7 == -128 and Fr(3, 4) ** 3 == Fr(27, 64) and Fr(3, 2) ** 4 == Fr(81, 16) and round(0.3 ** 4, 4) == 0.0081
S(s, 'EXAMPLE 4', 'Value of a number in index form',
  p(f'The value of {P(i("a"), i("n"))} can be determined by the repeated multiplication method or by using a scientific calculator.')
  + p(f'<b>EXAMPLE 4</b> Calculate the value of each given number in index form. (a) {P(3, 4)} (b) {P("(0.4)", 3)}')
  + work([('(a)', [f'{P(3, 4)} = 3 × 3 × 3 × 3', '= 9 × 9', f'Hence, {P(3, 4)} = 81']), ('(b)', [f'{P("(0.4)", 3)} = 0.4 × 0.4 × 0.4', '= 0.16 × 0.4', f'Hence, {P("(0.4)", 3)} = 0.064'])], s, 2, 19)
  + note('Negative bases and fractional bases are written with brackets when using a calculator to determine the value of the number.', 'Reminder:'),
  work([('EXAMPLE 5', ['Calculate the value of each number in index form using a calculator.']),
        ('', [f'(a) {P(4, 5)} = 1 024', f'(b) {P("(−2)", 7)} = −128', f'(c) {P(f"({fr(3, 4)})", 3)} = {fr(27, 64)}', f'(d) {P(f"(1{fr(1, 2)})", 4)} = {fr(81, 16)}', f'(e) {P("(−0.3)", 4)} = 0.0081'])], s, 1, 20))

# =====================================================================
# 1.2 LAW OF INDICES
# =====================================================================
s = '1.2'
c = COL[s]
S(s, 'LAW', 'Multiplication of numbers in index form',
  p('What is the relationship between the multiplication of numbers in index form with the same base and repeated multiplication?')
  + p('In general,')
  + formula(f'{P(i("a"), i("m"))} × {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} + {i("n")}")}', c)
  + note('Group the numbers or algebraic terms with the same base first. Then, add the indices of the same base.', 'Tip:'),
  table(['Multiplication of numbers in index form', 'Repeated multiplication'],
          [[f'{P(2, 3)} × {P(2, 4)}', f'(2 × 2 × 2) × (2 × 2 × 2 × 2) = {P(2, 7)} = {P(2, "3 + 4")}'],
           [f'{P(3, 2)} × {P(3, 3)}', f'(3 × 3) × (3 × 3 × 3) = {P(3, 5)} = {P(3, "2 + 3")}'],
           [f'{P(5, 4)} × {P(5, 2)}', f'(5 × 5 × 5 × 5) × (5 × 5) = {P(5, 6)} = {P(5, "4 + 2")}']], c, 18, rvrows=(1, 2)))

S(s, 'EXAMPLE 6', 'Law of multiplication',
  p(f'Simplify each of the following. (a) {P(5, 3)} × {P(5, 4)} (b) {P("(0.3)", 2)} × {P("(0.3)", 5)} × (0.3) (c) 3{P(i("k"), 2)} × 4{P(i("k"), 3)} (d) 2{P(i("m"), 4)} × {fr(1, 4)}{P(i("m"), 2)} × 6{i("m")}')
  + work([('(a)', [f'{P(5, 3)} × {P(5, 4)} = {P(5, "3 + 4")}', f'= {P(5, 7)}']), ('(b)', [f'{P("(0.3)", 2)} × {P("(0.3)", 5)} × {P("(0.3)", 1)} = {P("(0.3)", "2 + 5 + 1")}', f'= {P("(0.3)", 8)}']),
          ('(c)', [f'3{P(i("k"), 2)} × 4{P(i("k"), 3)} = (3 × 4){P(i("k"), "2 + 3")}', f'= 12{P(i("k"), 5)}']), ('(d)', [f'(2 × {fr(1, 4)} × 6){P(i("m"), "4 + 2 + 1")}', f'= 3{P(i("m"), 7)}'])], s, 2, 18)
  + note(f'{i("a")} = {P(i("a"), 1)}', 'Reminder:'),
  work([('EXAMPLE 7', [f'Simplify each of the following. (a) {P(i("m"), 3)} × {P(i("n"), 2)} × {P(i("m"), 4)} × {i("n")} (b) {P("(0.2)", 3)} × {P("(0.5)", 2)} × (0.2) × {P("(0.5)", 4)}']),
        ('(a)', [f'= {P(i("m"), 3)} × {P(i("m"), 4)} × {P(i("n"), 2)} × {P(i("n"), 1)}', f'= {P(i("m"), "3 + 4")} × {P(i("n"), "2 + 1")}', f'= {P(i("m"), 7)}{P(i("n"), 3)}']),
        ('(b)', [f'= {P("(0.2)", 3)} × {P("(0.2)", 1)} × {P("(0.5)", 2)} × {P("(0.5)", 4)}', f'= {P("(0.2)", "3 + 1")} × {P("(0.5)", "2 + 4")}', f'= {P("(0.2)", 4)} × {P("(0.5)", 6)}'])], s, 1, 18))

assert (-2) ** 3 == -8
S(s, 'LAW', 'Division of numbers in index form',
  p('What is the relationship between the division of numbers in index form with the same base and repeated multiplication?')
  + table(['Division', 'Repeated multiplication'], [[f'{P(4, 5)} ÷ {P(4, 2)}', f'{fr("4 × 4 × 4 × 4 × 4", "4 × 4")} = {P(4, 3)} = {P(4, "5 − 2")}'],
                                                    [f'{P(2, 6)} ÷ {P(2, 2)}', f'{fr("2 × 2 × 2 × 2 × 2 × 2", "2 × 2")} = {P(2, 4)} = {P(2, "6 − 2")}']], c, 17, rvrows=(1,))
  + p('In general,')
  + formula(f'{P(i("a"), i("m"))} ÷ {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} − {i("n")}")}', c),
  work([('EXAMPLE 8', [f'Simplify each of the following. (a) {P(6, 7)} ÷ {P(6, 3)} (b) {P("(−2)", 8)} ÷ {P("(−2)", 5)} (c) {P(i("p"), 9)} ÷ {P(i("p"), 4)} (d) 20{P(i("x"), 6)}{P(i("y"), 5)} ÷ 4{P(i("x"), 2)}{P(i("y"), 3)}']),
        ('(a)', [f'= {P(6, "7 − 3")} = {P(6, 4)}']), ('(b)', [f'= {P("(−2)", "8 − 5")} = {P("(−2)", 3)} = −8']), ('(c)', [f'= {P(i("p"), "9 − 4")} = {P(i("p"), 5)}']),
        ('(d)', [f'= {fr(20, 4)} × {P(i("x"), "6 − 2")} × {P(i("y"), "5 − 3")}', f'= 5{P(i("x"), 4)}{P(i("y"), 2)}'])], s, 1, 19))

S(s, 'LAW', 'Power of a number in index form',
  table(['Index form raised to a power', 'Repeated multiplication', 'Conclusion'],
        [[P(f'({P(3, 2)})', 4), f'{P(3, 2)} × {P(3, 2)} × {P(3, 2)} × {P(3, 2)} = {P(3, "2 + 2 + 2 + 2")} = {P(3, 8)}', f'{P(f"({P(3, 2)})", 4)} = {P(3, "2(4)")}'],
         [P(f'({P(5, 4)})', 3), f'{P(5, 4)} × {P(5, 4)} × {P(5, 4)} = {P(5, "4 + 4 + 4")} = {P(5, 12)}', f'{P(f"({P(5, 4)})", 3)} = {P(5, "4(3)")}']], c, 17, rvrows=(1,))
  + p('In general,')
  + formula(f'{P(f"({P(i("a"), i("m"))})", i("n"))} = {P(i("a"), f"{i("mn")}")}', c)
  + formula(f'{P(f"({P(i("a"), i("m"))}{P(i("b"), i("n"))})", i("p"))} = {P(i("a"), i("mp"))}{P(i("b"), i("np"))} &nbsp; ; &nbsp; {P(f"({fr(P(i("a"), i("m")), P(i("b"), i("n")))})", i("p"))} = {fr(P(i("a"), i("mp")), P(i("b"), i("np")))}', c),
  work([('EXAMPLE 9', [f'1. Simplify: (a) {P(f"({P(3, 4)})", 2)} (b) {P(f"({P(i("k"), 5)})", 3)} (c) {P(f"(({P("(−"+i("y")+")", 2)})", 4)}'.replace(f'(({P("(−"+i("y")+")", 2)})', f'({P("(−"+i("y")+")", 2)})')]),
        ('Solution:', [f'(a) {P(3, "4(2)")} = {P(3, 8)} &nbsp; (b) {P(i("k"), "5(3)")} = {P(i("k"), 15)} &nbsp; (c) {P("(−"+i("y")+")", "2(4)")} = {P("(−"+i("y")+")", 8)} = {P(i("y"), 8)}']),
        ('', [f'2. Determine whether the equation {P(f"({P(2, 3)})", 4)} = {P(f"({P(2, 4)})", 3)} is true or false.']),
        ('Solution:', [f'Left: {P(f"({P(2, 3)})", 4)} = {P(2, 12)}. Right: {P(f"({P(2, 4)})", 3)} = {P(2, 12)}', f'Hence, {P(f"({P(2, 3)})", 4)} = {P(f"({P(2, 4)})", 3)} is true.'])], s, 1, 18))

assert Fr(2 ** 12 * 3 ** 8, 6 ** 4) == Fr(2 ** 8 * 3 ** 4)
S(s, 'EXAMPLE 10', 'Laws of indices in multiplication and division',
  p(f'Simplify each of the following. (a) {P(f"({P(5, 3)} × {P(7, 2)})", 4)} (b) {P(f"({P(2, 3)} × {P(3, 2)} × {P(11, 5)})", 2)} (c) {P(f"({fr(f"2{P(i("x"), 3)}", f"3{P(i("y"), 2)}")})", 4)} (d) {fr(f"{P(f"(4{P(i("m"), 3)}{P(i("n"), 2)})", 2)}", f"8{P(i("m"), 4)}{i("n")}")}')
  + note(f'{P(f"({P(i("a"), i("m"))} × {P(i("b"), i("n"))})", i("p"))} = {P(i("a"), i("mp"))} × {P(i("b"), i("np"))}', 'Recall:'),
  work([('(a)', [f'= {P(5, "3(4)")} × {P(7, "2(4)")}', f'= {P(5, 12)} × {P(7, 8)}']), ('(b)', [f'= {P(2, "3(2)")} × {P(3, "2(2)")} × {P(11, "5(2)")}', f'= {P(2, 6)} × {P(3, 4)} × {P(11, 10)}']),
        ('(c)', [f'= {fr(f"{P(2, 4)}{P(i("x"), "3(4)")}", f"{P(3, 4)}{P(i("y"), "2(4)")}")}', f'= {fr(f"16{P(i("x"), 12)}", f"81{P(i("y"), 8)}")}']),
        ('(d)', [f'= {fr(f"{P(4, 2)}{P(i("m"), "3(2)")}{P(i("n"), "2(2)")}", f"8{P(i("m"), 4)}{i("n")}")} = {fr(f"16{P(i("m"), 6)}{P(i("n"), 4)}", f"8{P(i("m"), 4)}{P(i("n"), 1)}")}', f'= 2{P(i("m"), "6 − 4")}{P(i("n"), "4 − 1")} = 2{P(i("m"), 2)}{P(i("n"), 3)}'])], s, 2, 18))

S(s, 'LAW', 'Zero index and negative index',
  table(['Division', 'Law of indices', 'Repeated multiplication', 'Conclusion'],
        [[f'{P(2, 3)} ÷ {P(2, 3)}', f'{P(2, "3 − 3")} = {P(2, 0)}', f'{fr("2 × 2 × 2", "2 × 2 × 2")} = 1', f'{P(2, 0)} = 1'],
         [f'{P(2, 3)} ÷ {P(2, 5)}', f'{P(2, "3 − 5")} = {P(2, "−2")}', f'{fr("2 × 2 × 2", "2 × 2 × 2 × 2 × 2")} = {fr(1, P(2, 2))}', f'{P(2, "−2")} = {fr(1, P(2, 2))}']], c, 17, rvrows=(1,))
  + de(s, 'Any number or algebraic term with a zero index has a value of 1.')
  + formula(f'{P(i("a"), 0)} = 1 ; {i("a")} ≠ 0 &nbsp;&nbsp;&nbsp; {P(i("a"), "−"+i("n"))} = {fr(1, P(i("a"), i("n")))} ; {i("a")} ≠ 0', c)
  + note(f'A negative index is the index of a number or algebraic term that has a negative value. {P(f"({fr(i("a"), i("b"))})", "−"+i("n"))} = {P(f"({fr(i("b"), i("a"))})", i("n"))}', 'Tip:'))

S(s, 'EXAMPLE 11', 'Negative indices',
  p(f'1. State each of the following terms in positive index form. (a) {P(i("a"), "−3")} (b) {P(i("x"), "−5")} (c) {fr(1, P(9, "−2"))} (d) 4{P(i("m"), "−6")} (e) {P(f"({fr(3, 7)})", "−4")}')
  + work([('', [f'(a) {P(i("a"), "−3")} = {fr(1, P(i("a"), 3))}', f'(b) {P(i("x"), "−5")} = {fr(1, P(i("x"), 5))}', f'(c) {fr(1, P(9, "−2"))} = {P(9, 2)}', f'(d) 4{P(i("m"), "−6")} = {fr(4, P(i("m"), 6))}', f'(e) {P(f"({fr(3, 7)})", "−4")} = {P(f"({fr(7, 3)})", 4)}'])], s, 1, 19)
  + p(f'2. Simplify {fr(f"{P(5, 2)} × {P(5, 3)}", P(5, 8))}.'),
  stack(work([('Solution 2:', [f'= {P(5, "2 + 3 − 8")}', f'= {P(5, "−3")}', f'= {fr(1, P(5, 3))}'])], s, 1, 20),
        note(f'2{P(i("a"), "−1")} ≠ {fr(1, f"2{i("a")}")}', 'Reminder:')))

S(s, 'LAW', 'Fractional indices',
  p(f'In Form 1, you learned about squares and square roots as well as cubes and cube roots. Did you know that the value of {i("x")} in {P(i("x"), 2)} = 9 and {P(i("x"), 3)} = 64 can be determined by raising the index to the power of its reciprocal?')
  + p('In general,')
  + formula(f'{sq(i("a"), i("n"))} = {P(i("a"), fr(1, i("n")))} ; {i("a")} ≠ 0', c)
  + formula(f'{P(i("a"), fr(i("m"), i("n")))} = {P(f"({P(i("a"), i("m"))})", fr(1, i("n")))} = {P(f"({P(i("a"), fr(1, i("n")))})", i("m"))} = {sq(P(i("a"), i("m")), i("n"))} = {P(f"({sq(i("a"), i("n"))})", i("m"))}', c),
  work([('(a)', [f'{P(i("x"), 2)} = 9', f'{P(f"({P(i("x"), 2)})", fr(1, 2))} = {P(9, fr(1, 2))}', f'{i("x")} = {P(f"({P(3, 2)})", fr(1, 2))} = 3']), ('(b)', [f'{P(i("x"), 3)} = 64', f'{P(f"({P(i("x"), 3)})", fr(1, 3))} = {P(64, fr(1, 3))}', f'{i("x")} = {P(f"({P(4, 3)})", fr(1, 3))} = 4'])], s, 1, 20))

assert 6 ** 2 == 36 and (-3) ** 3 == -27 and 4 ** 5 == 1024 and 2 ** 5 == 32 and 4 ** 3 == 64
S(s, 'EXAMPLE 12', 'Converting between fractional indices and roots',
  p(f'1. Convert each of the following terms into the form {P(i("a"), fr(1, i("n")))}. (a) {sq(36, 2)} (b) {sq("−27", 3)} (c) {sq(i("m"), 5)}')
  + work([('', [f'(a) {sq(36, 2)} = {P(36, fr(1, 2))} &nbsp; (b) {sq("−27", 3)} = {P("(−27)", fr(1, 3))} &nbsp; (c) {sq(i("m"), 5)} = {P(i("m"), fr(1, 5))}'])], s, 1, 18)
  + p(f'2. Convert each of the following terms into the form {sq(i("a"), i("n"))}. (a) {P(1024, fr(1, 5))} (b) {P(64, fr(1, 3))} (c) {P(i("k"), fr(1, 7))}')
  + work([('', [f'(a) {P(1024, fr(1, 5))} = {sq("1 024", 5)} &nbsp; (b) {P(64, fr(1, 3))} = {sq(64, 3)} &nbsp; (c) {P(i("k"), fr(1, 7))} = {sq(i("k"), 7)}'])], s, 1, 18),
  work([('3. Calculate the value of each of the following.', [f'(a) {sq(32, 5)} = {P(f"({P(2, 5)})", fr(1, 5))} = {P(2, 1)} = 2', f'(b) {sq(64, 3)} = {P(f"({P(4, 3)})", fr(1, 3))} = 4', f'(c) {P(36, fr(1, 2))} = {P(f"({P(6, 2)})", fr(1, 2))} = 6',
                                                f'(d) {P("(−27)", fr(1, 3))} = {P(f"({P("(−3)", 3)})", fr(1, 3))} = −3'])], s, 1, 20))

assert 16 ** 0.75 == 8 and round(125 ** (2 / 3)) == 25
S(s, 'EXAMPLE 13', 'Fractional indices in other forms',
  p(f'1. Convert each of the following terms into the forms {P(f"({P(i("a"), i("m"))})", fr(1, i("n")))} and {P(f"({P(i("a"), fr(1, i("n")))})", i("m"))}. (a) {P(16, fr(3, 4))} (b) {P(125, fr(2, 3))}')
  + work([('', [f'(a) {P(16, fr(3, 4))} = {P(f"({P(16, 3)})", fr(1, 4))} = {P(f"({P(16, fr(1, 4))})", 3)}', f'(b) {P(125, fr(2, 3))} = {P(f"({P(125, 2)})", fr(1, 3))} = {P(f"({P(125, fr(1, 3))})", 2)}'])], s, 1, 18)
  + p(f'2. Convert each of the following terms into the forms {sq(P(i("a"), i("m")), i("n"))} and {P(f"({sq(i("a"), i("n"))})", i("m"))}. (a) {P(16, fr(3, 4))} (b) {P(i("p"), fr(2, 5))}')
  + work([('', [f'(a) {P(16, fr(3, 4))} = {sq(P(16, 3), 4)} = {P(f"({sq(16, 4)})", 3)}', f'(b) {P(i("p"), fr(2, 5))} = {sq(P(i("p"), 2), 5)} = {P(f"({sq(i("p"), 5)})", 2)}'])], s, 1, 18),
  work([('EXAMPLE 14', [f'Calculate the value of each of the following terms. (a) {P(16, fr(3, 4))} (b) {P(125, fr(2, 3))}']),
        ('(a)', [f'Method 1: {P(16, fr(3, 4))} = {P(f"({sq(16, 4)})", 3)} = {P(2, 3)} = 8', f'Method 2: {P(16, fr(3, 4))} = {sq(P(16, 3), 4)} = {sq("4 096", 4)} = 8']),
        ('(b)', [f'Method 1: {P(125, fr(2, 3))} = {P(f"({sq(125, 3)})", 2)} = {P(5, 2)} = 25', f'Method 2: {P(125, fr(2, 3))} = {sq(P(125, 2), 3)} = {sq("15 625", 3)} = 25'])], s, 1, 18))

S(s, 'EXAMPLE 15', 'Operations involving the laws of indices',
  table(['Laws of indices'], [[f'{P(i("a"), i("m"))} × {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} + {i("n")}")} &nbsp; {P(i("a"), i("m"))} ÷ {P(i("a"), i("n"))} = {P(i("a"), f"{i("m")} − {i("n")}")} &nbsp; {P(f"({P(i("a"), i("m"))})", i("n"))} = {P(i("a"), i("mn"))}'],
                           [f'{P(i("a"), 0)} = 1 &nbsp; {P(i("a"), "−"+i("n"))} = {fr(1, P(i("a"), i("n")))} &nbsp; {P(i("a"), fr(1, i("n")))} = {sq(i("a"), i("n"))} &nbsp; {P(i("a"), fr(i("m"), i("n")))} = {sq(P(i("a"), i("m")), i("n"))} = {P(f"({sq(i("a"), i("n"))})", i("m"))}']], c, 17)
  + p(f'Simplify each of the following. (a) {fr(f"{P(f"(2{P(i("x"), 3)})", 2)} × (3{P(i("x"), "−1")})", f"6{P(i("x"), 2)}")} (b) {fr(f"{sq(P(i("m"), 2), 3)} × {P(i("m"), fr(1, 3))}", P(i("m"), "−1"))}'),
  work([('(a)', [f'= {fr(f"4{P(i("x"), 6)} × 3{P(i("x"), "−1")}", f"6{P(i("x"), 2)}")}', f'= {fr(12, 6)} {P(i("x"), "6 + (−1) − 2")}', f'= 2{P(i("x"), 3)}']),
        ('(b)', [f'= {fr(f"{P(i("m"), fr(2, 3))} × {P(i("m"), fr(1, 3))}", P(i("m"), "−1"))}', f'= {P(i("m"), f"{fr(2, 3)} + {fr(1, 3)} − (−1)")}', f'= {P(i("m"), 2)}'])], s, 1, 20))

assert 3 * 125 / (3 * 25) == 5 and abs(4 * 3 / (8 / 3) - 4.5) < 1e-9
S(s, 'EXAMPLE 16', 'Calculating values',
  p(f'Calculate the value of each of the following. (a) {fr(f"{P(81, fr(1, 4))} × {P(25, fr(3, 2))}", f"{sq(9, 2)} × {P(5, 2)}")} (b) {fr(f"{P(8, fr(2, 3))} × {P(27, fr(1, 3))}", f"{P(2, 3)} × {P(9, "−" + fr(1, 2))}")}')
  + note('Convert each base into its prime factors first.', 'Tip:'),
  work([('(a)', [f'= {fr(f"{P(f"({P(3, 4)})", fr(1, 4))} × {P(f"({P(5, 2)})", fr(3, 2))}", f"{P(f"({P(3, 2)})", fr(1, 2))} × {P(5, 2)}")}', f'= {fr(f"{P(3, 1)} × {P(5, 3)}", f"{P(3, 1)} × {P(5, 2)}")}', f'= {P(3, "1 − 1")} × {P(5, "3 − 2")}', '= 1 × 5 = 5']),
        ('(b)', [f'= {fr(f"{P(f"({P(2, 3)})", fr(2, 3))} × {P(f"({P(3, 3)})", fr(1, 3))}", f"{P(2, 3)} × {P(f"({P(3, 2)})", "−" + fr(1, 2))}")}', f'= {fr(f"{P(2, 2)} × {P(3, 1)}", f"{P(2, 3)} × {P(3, "−1")}")}', f'= {P(2, "2 − 3")} × {P(3, "1 − (−1)")}', f'= {P(2, "−1")} × {P(3, 2)} = {fr(9, 2)} = 4{fr(1, 2)}'])], s, 1, 19))

assert abs(2 ** 0.5 * 18 ** 1.5 / 6 - 18) < 1e-9
S(s, 'EXAMPLE 17', 'Problem solving',
  p(f'Calculate the value of {sq(2)} × {P(18, fr(3, 2))} ÷ 6 without using a calculator.')
  + work([('Understanding the problem', ['Calculate the value of numbers in index form given in different bases.']),
          ('Planning a strategy', ['Convert each base into prime factors and calculate the value by applying the laws of indices.'])], s, 1, 18)
  + note('The common prime factors of 6 and 18 are 2 and 3.', 'Recall:'),
  work([('Implementing the strategy', [f'{sq(2)} × {P(18, fr(3, 2))} ÷ 6', f'= {P(2, fr(1, 2))} × {P("(2 × 3 × 3)", fr(3, 2))} ÷ (2 × 3)', f'= {P(2, fr(1, 2))} × {P(2, fr(3, 2))} × {P(3, 3)} ÷ ({P(2, 1)} × {P(3, 1)})',
                                   f'= {P(2, f"{fr(1, 2)} + {fr(3, 2)} − 1")} × {P(3, "3 − 1")}', f'= {P(2, 1)} × {P(3, 2)} = 18']),
        ('Making a conclusion', [f'{sq(2)} × {P(18, fr(3, 2))} ÷ 6 = 18'])], s, 1, 19))

S(s, 'EXAMPLE 18', 'Equations in index form',
  p(f'Calculate the value of {i("x")} for the equation {P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1.')
  + work([('Understanding the problem', [f'Calculate the value of the variable {i("x")}, which is part of the index.']),
          ('Planning a strategy', ['This question is an equation. Hence, the value on the left side of the equation is equal to the value on the right side. Convert all the terms into index form with base 2.'])], s, 1, 18)
  + note(f'If {P(i("a"), i("m"))} = {P(i("a"), i("n"))}, then {i("m")} = {i("n")}. If {P(i("a"), i("m"))} = {P(i("b"), i("m"))}, then {i("a")} = {i("b")}.', 'Reminder:'),
  work([('Implementing the strategy', [f'{P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1', f'{P(2, i("x"))} × {P(2, f"2({i("x")} + 2)")} ÷ {P(2, 7)} = {P(2, 0)}', f'{P(2, f"{i("x")} + 2{i("x")} + 4 − 7")} = {P(2, 0)}',
                                   f'3{i("x")} − 3 = 0', f'{i("x")} = 1']),
        ('Making a conclusion', [f'If {P(2, i("x"))} × {P(4, f"{i("x")} + 2")} ÷ {P(2, 7)} = 1, then {i("x")} = 1.']),
        ('Checking the answer', [f'Substitute {i("x")} = 1: {P(2, 1)} × {P(4, 3)} ÷ {P(2, 7)} = {P(2, "1 + 6 − 7")} = {P(2, 0)} = 1'])], s, 1, 18))

assert all(2 ** (x * x) * 2 ** x == 2 ** 12 for x in (3, -4))
S(s, 'EXAMPLE 19', 'Quadratic equations in index form',
  p(f'Calculate the possible values of {i("x")} for the equation {P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)}.')
  + work([('Understanding the problem', [f'Calculate the values of {i("x")}, which is part of the index.']), ('Planning a strategy', ['All the bases involved in the equation are the same.'])], s, 1, 18)
  + note(f'Solve quadratic equations using the factorisation method.', 'Recall:'),
  work([('Implementing the strategy', [f'{P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)}', f'{P(2, f"{P(i("x"), 2)} + {i("x")}")} = {P(2, 12)}', f'{P(i("x"), 2)} + {i("x")} = 12', f'{P(i("x"), 2)} + {i("x")} − 12 = 0',
                                   f'({i("x")} − 3)({i("x")} + 4) = 0', f'{i("x")} − 3 = 0 or {i("x")} + 4 = 0', f'{i("x")} = 3 or {i("x")} = −4']),
        ('Making a conclusion', [f'The possible values of {i("x")} for the equation {P(2, P(i("x"), 2))} × {P(2, i("x"))} = {P(2, 12)} are 3 and −4.'])], s, 1, 18))

assert 2 * 4 + 2 == 10 and 4 - 2 == 2
S(s, 'EXAMPLE 20', 'Simultaneous equations',
  p(f'Solve the following simultaneous equations. {P(9, i("m"))} × {P(3, i("n"))} = {P(3, 10)} and {P(2, i("m"))} ÷ {P(2, i("n"))} = 4')
  + note('Simultaneous linear equations in two variables can be solved using the substitution method or the elimination method.', 'Recall:'),
  work([('', [f'{P(9, i("m"))} × {P(3, i("n"))} = {P(3, 10)}', f'{P(3, f"2{i("m")}")} × {P(3, i("n"))} = {P(3, 10)}', f'2{i("m")} + {i("n")} = 10 ........ (1)',
              f'{P(2, i("m"))} ÷ {P(2, i("n"))} = {P(2, 2)}', f'{i("m")} − {i("n")} = 2 ........ (2)', 'Equations (1) and (2) can be solved using the elimination method.',
              f'(1) + (2): 3{i("m")} = 12, {i("m")} = 4', f'Substitute {i("m")} = 4 into (2): 4 − {i("n")} = 2, {i("n")} = 2', f'Hence, {i("m")} = 4 and {i("n")} = 2'])], s, 1, 19))

x21, y21 = 7, 5
assert 8 * 2 ** x21 == 4 ** y21 and 5 * 25 ** x21 == 125 ** y21
S(s, 'EXAMPLE 21', 'Problem solving',
  p(f'Danish and Ravi carried out two experiments to determine the values of the variables {i("x")} and {i("y")}. The equation obtained by Danish is 8({P(2, i("x"))}) = {P(4, i("y"))} while Ravi obtained the equation 5({P(25, i("x"))}) = {P(125, i("y"))} as the results of the experiments. Calculate the values of {i("x")} and {i("y")} that satisfy both experiments carried out by Danish and Ravi.')
  + note(f'The values of the variables {i("x")} and {i("y")} can be determined if you can solve both equations.', 'Tip:'),
  work([('', [f'8({P(2, i("x"))}) = {P(4, i("y"))}: {P(2, 3)}({P(2, i("x"))}) = {P(2, f"2{i("y")}")}, hence 3 + {i("x")} = 2{i("y")} ........ (1)',
              f'5({P(25, i("x"))}) = {P(125, i("y"))}: {P(5, 1)}({P(5, f"2{i("x")}")}) = {P(5, f"3{i("y")}")}, hence 1 + 2{i("x")} = 3{i("y")} ........ (2)',
              f'From (1): {i("x")} = 2{i("y")} − 3 ........ (3)', f'Substitute (3) into (2): 1 + 2(2{i("y")} − 3) = 3{i("y")}', f'1 + 4{i("y")} − 6 = 3{i("y")}, {i("y")} = 5',
              f'Substitute {i("y")} = 5 into (3): {i("x")} = 2(5) − 3 = 7', f'Hence, {i("x")} = 7, {i("y")} = 5'])], s, 1, 18))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'indeks', 'slides_en.js')
HEAD = '/* Nota Bab 1 T3 (ENGLISH / DLP), terjemahan nota BM. Dijana skrip bina_bab1_t3_en.py; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
