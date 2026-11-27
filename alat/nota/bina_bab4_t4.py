"""Bab 4 T4 Operasi Set: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder operasiset dikekalkan (4.1 Persilangan, 4.2 Kesatuan, 4.3 Gabungan; sama dengan buku)."""
import os, sys, itertools
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "4.1", "name": "Persilangan Set", "col": "#34D399"}, {"no": "4.2", "name": "Kesatuan Set", "col": "#FB923C"}, {"no": "4.3", "name": "Gabungan Operasi Set", "col": "#A78BFA"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
CI, CU = '∩', '∪'


def i(s):
    return f'<i>{s}</i>'


def st(xs):
    return '{' + ', '.join(str(x) for x in xs) + '}' if xs else '{ }'


def srt(xs):
    return sorted(xs, key=lambda v: (isinstance(v, str), v))


# ---------------- gambar rajah Venn dengan kawasan berlorek ----------------
VID = [0]
CIRC2 = [(185, 240, 118), (315, 240, 118)]
CIRC3 = [(195, 185, 112), (305, 185, 112), (250, 290, 112)]
ANC2 = {(1, 0): (130, 240), (1, 1): (250, 240), (0, 1): (370, 240), (0, 0): (58, 415)}
ANC3 = {(1, 0, 0): (150, 140), (0, 1, 0): (350, 140), (0, 0, 1): (250, 360), (1, 1, 0): (250, 135), (1, 0, 1): (188, 262), (0, 1, 1): (312, 262),
        (1, 1, 1): (250, 222), (0, 0, 0): (60, 420)}
SETCOL = [TR, PK, GR]


def venn(names, circles=None, shade=None, elems=None, labs=None, col=AM, box=(18, 22, 482, 452), univ=True, fs=16, lab_pos=None, rv_shade=True, nums=None):
    """names: nama set; shade(*b) -> True bagi kawasan berlorek; elems: {bits: [unsur]}; nums: {bits: nombor}."""
    VID[0] += 1
    k = VID[0]
    n = len(names)
    circles = circles or (CIRC2 if n == 2 else CIRC3)
    L_, T_, R_, B_ = box
    defs = ''.join(f'<clipPath id="vc{k}_{j}"><circle cx="{x}" cy="{y}" r="{r}"/></clipPath>' for j, (x, y, r) in enumerate(circles))
    defs += f'<clipPath id="vu{k}"><rect x="{L_}" y="{T_}" width="{R_ - L_}" height="{B_ - T_}" rx="8"/></clipPath>'
    sh = ''
    if shade:
        for bits in itertools.product((0, 1), repeat=n):
            if not shade(*bits):
                continue
            mid = f'vm{k}_{"".join(map(str, bits))}'
            outs = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="black"/>' for (x, y, r), b in zip(circles, bits) if not b)
            defs += f'<mask id="{mid}"><rect x="0" y="0" width="500" height="470" fill="white"/>{outs}</mask>'
            inner = f'<rect x="{L_}" y="{T_}" width="{R_ - L_}" height="{B_ - T_}" fill="{col}" fill-opacity=".42" mask="url(#{mid})"/>'
            g = f'<g clip-path="url(#vu{k})">{inner}</g>'
            for j, b in enumerate(bits):
                if b:
                    g = f'<g clip-path="url(#vc{k}_{j})">{g}</g>'
            sh += g
    o = f'<defs>{defs}</defs>'
    o += GF.rv(sh) if (sh and rv_shade) else sh
    if univ:
        o += f'<rect x="{L_}" y="{T_}" width="{R_ - L_}" height="{B_ - T_}" fill="none" stroke="{MU3}" stroke-width="2.5" rx="8"/>' + GF.T(L_ + 18, T_ + 22, 'ξ', TX, 22)
    for j, ((x, y, r), nm) in enumerate(zip(circles, names)):
        c = SETCOL[j % 3]
        o += f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{c}" stroke-width="3.2"/>'
        lx, ly = (lab_pos[j] if lab_pos else (x + (-0.78 if j == 0 else 0.78 if j == 1 else 0.0) * r, y - 0.86 * r if j < 2 else y + r + 22))
        o += GF.T(lx, ly, nm, c, 22)
    anc = ANC2 if n == 2 else ANC3
    for bits, lst in (elems or {}).items():
        ax, ay = anc[bits] if bits in anc else bits
        m = len(lst)
        cols = 1 if m <= 3 else 2
        rows = (m + cols - 1) // cols
        for q, e in enumerate(lst):
            cx = ax + ((q % cols) - (cols - 1) / 2) * 62
            cy = ay + ((q // cols) - (rows - 1) / 2) * 26
            o += f'<circle cx="{cx - len(str(e)) * 4.3 - 7:.1f}" cy="{cy:.1f}" r="3.2" fill="{TX}"/>' + GF.T(cx, cy, str(e), TX, fs)
    for bits, v in (nums or {}).items():
        ax, ay = anc[bits] if bits in anc else bits
        o += GF.rv(GF.T(ax, ay, str(v), AM, 22))
    return o


def mini_row(items, n=3, w=500):
    """deretan venn kecil: items = [(label, shade, names)]"""
    o = ''
    k = len(items)
    sc = 0.95 / k if k > 2 else 0.47
    for j, (lab, sh, names) in enumerate(items):
        inner = venn(names, shade=sh, rv_shade=False)
        x0 = j * (w / k) + (w / k - 500 * sc) / 2
        o += f'<g transform="translate({x0:.1f},10) scale({sc:.3f})">{inner}</g>' + GF.T(j * (w / k) + w / k / 2, 470 * sc + 38, lab, TX, 16)
    return o, 470 * sc + 60


def SVh(inner, aria, h):
    return f'<svg class="sl-svg" viewBox="0 0 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


# =====================================================================
# 4.1 PERSILANGAN SET
# =====================================================================
s = '4.1'
c = COL[s]
S(s, 'DEFINISI', 'Persilangan set',
  p('Gerhana matahari berlaku apabila bulan berada di antara matahari dengan bumi pada satu garis lurus. Persilangan antara bulan dengan matahari dapat dilihat apabila bahagian bulan dan matahari berada pada kedudukan yang sama.')
  + de(s, f'Persilangan set wujud apabila terdapat lebih daripada satu set. Persilangan set {i("P")} dan set {i("Q")} ditulis menggunakan simbol {CI}. {i("P")} {CI} {i("Q")} ialah set yang mengandungi unsur-unsur sepunya bagi kedua-dua set {i("P")} dan set {i("Q")}.')
  + note(f'{i("P")} {CI} {i("Q")} dibaca sebagai "persilangan set {i("P")} dan set {i("Q")}".', 'Info:'),
  SV(venn([i('P'), i('Q')], shade=lambda a, b: a and b) + GF.rv(GF.T(250, 425, f'{i("P")} {CI} {i("Q")}', AM, 22)), 'Kawasan berlorek ialah persilangan set P dan set Q'))

murid = {'Nabil': 'M', 'Afiq': 'MR', 'Hani': 'M', 'Amirul': 'R', 'Navin': 'R', 'Meena': 'M', 'Raj': 'MR', 'Jenny': 'M', 'Khairi': 'R', 'Benjamin': 'MR'}
A_ = [k for k, v in murid.items() if 'M' in v]
B_ = [k for k, v in murid.items() if 'R' in v]
AB = [k for k in A_ if k in B_]
S(s, 'KONSEP', 'Menentukan persilangan set',
  p('Sekumpulan murid ditanya buah tempatan yang mereka suka, iaitu manggis atau rambutan. Gambar rajah Venn di sebelah menunjukkan jawapan mereka.')
  + bul(s, [f'{i("A")} = {{murid yang suka makan manggis}} = {st(A_)}', f'{i("B")} = {{murid yang suka makan rambutan}} = {st(B_)}',
            f'{i("A")} {CI} {i("B")} = {{murid yang suka makan kedua-dua buah manggis dan rambutan}} = {st(AB)}'])
  + de(s, f'Persilangan set {i("A")} dan set {i("B")} mempunyai unsur-unsur sepunya iaitu {", ".join(AB[:-1])} dan {AB[-1]} yang suka makan manggis dan rambutan.'),
  SV(venn([i('A'), i('B')], shade=lambda a, b: a and b, elems={(1, 0): [k for k in A_ if k not in AB], (1, 1): AB, (0, 1): [k for k in B_ if k not in AB]}, fs=14, univ=False), 'Gambar rajah Venn murid yang suka manggis dan rambutan'))

xi = list(range(1, 13))
P = [x for x in xi if x % 2]
Q = [2, 3, 5, 7, 11]
R = [x for x in xi if x % 3 == 0]
I = lambda *ss: [x for x in xi if all(x in t for t in ss)]
assert I(P, Q) == [3, 5, 7, 11] and I(P, R) == [3, 9] and I(Q, R) == [3] and I(P, Q, R) == [3]
S(s, 'CONTOH 1', 'Menyenaraikan unsur persilangan set',
  p(f'Diberi set semesta, ξ = {{{i("x")} : {i("x")} ialah integer, 1 ≤ {i("x")} ≤ 12}}, set {i("P")} = {{{i("x")} : {i("x")} ialah nombor ganjil}}, set {i("Q")} = {{{i("x")} : {i("x")} ialah nombor perdana}} dan set {i("R")} = {{{i("x")} : {i("x")} ialah gandaan 3}}.')
  + p(f'(a) Senaraikan semua unsur bagi persilangan set yang berikut. (i) {i("P")} {CI} {i("Q")} (ii) {i("P")} {CI} {i("R")} (iii) {i("Q")} {CI} {i("R")} (iv) {i("P")} {CI} {i("Q")} {CI} {i("R")}')
  + p(f'(b) Nyatakan bilangan unsur bagi set di (a).')
  + note(f'Set {i("B")} ialah subset kepada set {i("A")}, {i("B")} ⊂ {i("A")}, apabila semua unsur set {i("B")} terdapat dalam set {i("A")}.', 'Imbas kembali:'),
  work([('', [f'{i("P")} = {st(P)}', f'{i("Q")} = {st(Q)}', f'{i("R")} = {st(R)}']),
        ('(a)', [f'(i) {i("P")} {CI} {i("Q")} = {st(I(P, Q))}', f'(ii) {i("P")} {CI} {i("R")} = {st(I(P, R))}', f'(iii) {i("Q")} {CI} {i("R")} = {st(I(Q, R))}', f'(iv) {i("P")} {CI} {i("Q")} {CI} {i("R")} = {st(I(P, Q, R))}']),
        ('(b)', [f'(i) {i("n")}({i("P")} {CI} {i("Q")}) = 4 &nbsp; (ii) {i("n")}({i("P")} {CI} {i("R")}) = 2', f'(iii) {i("n")}({i("Q")} {CI} {i("R")}) = 1 &nbsp; (iv) {i("n")}({i("P")} {CI} {i("Q")} {CI} {i("R")}) = 1'])], s, 1, 18))

subQ = [(250, 245, 175), (285, 270, 85)]
o, h = mini_row([(f'{i("P")} {CI} {i("Q")}', lambda a, b: a and b, [i('P'), i('Q')]), (f'{i("P")} {CI} {i("R")}', lambda a, b, cc: a and cc, [i('P'), i('Q'), i('R')]),
                 (f'{i("P")} {CI} {i("Q")} {CI} {i("R")}', lambda a, b, cc: a and b and cc, [i('P'), i('Q'), i('R')])])
sub_svg = venn([i('P'), i('Q')], circles=subQ, shade=lambda a, b: a and b, lab_pos=[(110, 120), (285, 160)], rv_shade=False)
S(s, 'KONSEP', 'Persilangan set dengan gambar rajah Venn',
  p('Persilangan antara dua atau lebih set boleh diwakilkan oleh kawasan berlorek seperti dalam gambar rajah Venn di sebelah.')
  + bul(s, [f'Kawasan berlorek ialah kawasan yang sepunya bagi semua set yang terlibat.', f'Jika {i("Q")} ⊂ {i("P")}, maka {i("P")} {CI} {i("Q")} = {i("Q")}.',
            f'Jika dua set tidak mempunyai unsur sepunya, persilangannya ialah set kosong.'])
  + note('Set kosong ialah set yang tidak mengandungi sebarang unsur dan boleh diwakili oleh simbol φ atau { }.', 'Imbas kembali:'),
  stack(SVh(o, 'Kawasan berlorek bagi persilangan dua dan tiga set', h),
        SVh(f'<g transform="translate(130,0) scale(0.48)">{sub_svg}</g>' + GF.T(250, 250, f'{i("Q")} ⊂ {i("P")}: {i("P")} {CI} {i("Q")} = {i("Q")}', TX, 16), 'Q subset kepada P', 265)))

J = [2, 4, 5, 7, 8]
K = [4, 5, 6]
Lx = [5, 7, 8, 9]
xi9 = list(range(1, 10))
def reg(sets, xs):
    d = {}
    for x in xs:
        d.setdefault(tuple(int(x in t) for t in sets), []).append(x)
    return d
ej = reg([J, K, Lx], xi9)
IJ = lambda *ss: [x for x in xi9 if all(x in t for t in ss)]
assert IJ(J, K) == [4, 5] and IJ(J, Lx) == [5, 7, 8] and IJ(K, Lx) == [5] and IJ(J, K, Lx) == [5]
S(s, 'CONTOH 2', 'Persilangan set daripada gambar rajah Venn',
  p(f'Gambar rajah Venn di sebelah menunjukkan set {i("J")}, set {i("K")} dan set {i("L")} dengan keadaan set semesta, ξ = {st(xi9)}.')
  + p(f'Senaraikan semua unsur bagi persilangan set yang berikut. (a) {i("J")} {CI} {i("K")} (b) {i("J")} {CI} {i("L")} (c) {i("K")} {CI} {i("L")} (d) {i("J")} {CI} {i("K")} {CI} {i("L")}')
  + work([('Penyelesaian', [f'(a) {i("J")} {CI} {i("K")} = {st(IJ(J, K))}', f'(b) {i("J")} {CI} {i("L")} = {st(IJ(J, Lx))}', f'(c) {i("K")} {CI} {i("L")} = {st(IJ(K, Lx))}', f'(d) {i("J")} {CI} {i("K")} {CI} {i("L")} = {st(IJ(J, K, Lx))}'])], s, 1, 19),
  SV(venn([i('J'), i('K'), i('L')], elems=ej), 'Gambar rajah Venn set J, K dan L'))

A3 = [1, 2, 3, 4, 6, 12]
B3 = [1, 2, 3, 6]
C3 = [13, 14, 15]
assert all(x in A3 for x in B3)
c3 = [(195, 235, 160), (210, 255, 80), (420, 235, 50)]
lp3 = [(75, 110), (210, 162), (420, 170)]
e3 = {(150, 160): [4], (110, 300): [12], (210, 255): [1, 2, 3, 6], (420, 235): [13, 14, 15]}
va = venn([i('A'), i('B'), i('C')], circles=c3, shade=lambda a, b, cc: a and b, elems=e3, lab_pos=lp3, rv_shade=False, box=(18, 52, 482, 420))
S(s, 'CONTOH 3', 'Persilangan yang merupakan subset atau set kosong',
  p(f'Diberi set {i("A")} = {{faktor bagi 12}}, set {i("B")} = {{faktor bagi 6}} dan set {i("C")} = {{13, 14, 15}}.')
  + p(f'(a) Senaraikan semua unsur bagi persilangan set yang berikut. (i) {i("A")} {CI} {i("B")} (ii) {i("B")} {CI} {i("C")} (iii) {i("A")} {CI} {i("C")}')
  + p(f'(b) Lukis gambar rajah Venn dan lorekkan kawasan {i("A")} {CI} {i("B")}.')
  + work([('(a)', [f'{i("A")} = {st(A3)}, {i("B")} = {st(B3)}, {i("C")} = {st(C3)}', f'(i) {i("A")} {CI} {i("B")} = {st(B3)}', f'(ii) {i("B")} {CI} {i("C")} = {{ }}', f'(iii) {i("A")} {CI} {i("C")} = φ'])], s, 1, 18),
  stack(f'<svg class="sl-svg" viewBox="0 45 500 380" role="img" aria-label="Set B di dalam set A, set C terpisah">{GF.rv(va)}</svg>',
        note(f'Semua unsur set {i("B")} terdapat dalam set {i("A")}, maka {i("A")} {CI} {i("B")} = {i("B")}. Set {i("B")} dan set {i("C")} tidak mempunyai unsur sepunya.', 'Info:')))

xi4 = list(range(1, 10))
A4, B4, C4 = [2, 3, 4, 5, 6, 7], [3, 5, 7], [2, 3, 4, 5]
comp = lambda xs: [x for x in xi4 if x not in xs]
I4 = lambda *ss: [x for x in xi4 if all(x in t for t in ss)]
assert comp(I4(A4, B4)) == [1, 2, 4, 6, 8, 9] and comp(I4(A4, C4)) == [1, 6, 7, 8, 9] and comp(I4(A4, B4, C4)) == [1, 2, 4, 6, 7, 8, 9]
o, h = mini_row([(f'({i("P")} {CI} {i("Q")})′', lambda a, b: not (a and b), [i('P'), i('Q')]), (f'({i("P")} {CI} {i("R")})′', lambda a, b, cc: not (a and cc), [i('P'), i('Q'), i('R')]),
                 (f'({i("P")} {CI} {i("Q")} {CI} {i("R")})′', lambda a, b, cc: not (a and b and cc), [i('P'), i('Q'), i('R')])])
S(s, 'CONTOH 4', 'Pelengkap bagi persilangan set',
  de(s, f'Pelengkap bagi persilangan set ditulis menggunakan tanda " ′ ". ({i("A")} {CI} {i("B")})′ dibaca sebagai "pelengkap bagi persilangan set {i("A")} dan set {i("B")}". Pelengkap bagi persilangan set {i("A")} dan set {i("B")} bermaksud semua unsur yang bukan dalam persilangan set {i("A")} dan set {i("B")}.')
  + p(f'<b>CONTOH 4</b> Diberi ξ = {{{i("x")} : {i("x")} ialah integer, 1 ≤ {i("x")} ≤ 9}}, {i("A")} = {st(A4)}, {i("B")} = {st(B4)} dan {i("C")} = {st(C4)}. Senaraikan semua unsur dan nyatakan bilangan unsur bagi (a) ({i("A")} {CI} {i("B")})′ (b) ({i("A")} {CI} {i("C")})′ (c) ({i("A")} {CI} {i("B")} {CI} {i("C")})′'),
  stack(work([('', [f'ξ = {st(xi4)}', f'(a) {i("A")} {CI} {i("B")} = {st(I4(A4, B4))}; ({i("A")} {CI} {i("B")})′ = {st(comp(I4(A4, B4)))}; {i("n")}({i("A")} {CI} {i("B")})′ = 6',
                     f'(b) {i("A")} {CI} {i("C")} = {st(I4(A4, C4))}; ({i("A")} {CI} {i("C")})′ = {st(comp(I4(A4, C4)))}; {i("n")}({i("A")} {CI} {i("C")})′ = 5',
                     f'(c) {i("A")} {CI} {i("B")} {CI} {i("C")} = {st(I4(A4, B4, C4))}; ({i("A")} {CI} {i("B")} {CI} {i("C")})′ = {st(comp(I4(A4, B4, C4)))}; {i("n")} = 7'])], s, 1, 17),
        SVh(o, 'Kawasan berlorek bagi pelengkap persilangan set', h)))

xk = ['Pengakap', 'Catur', 'Robotik', 'Silat', 'Sejarah', 'Bola Jaring', 'Kadet Remaja']
Pk, Qk, Rk = ['Pengakap', 'Catur', 'Robotik'], ['Silat', 'Sejarah', 'Bola Jaring'], ['Pengakap', 'Sejarah', 'Kadet Remaja']
ek = reg([Pk, Qk, Rk], xk)
compk = lambda xs: [x for x in xk if x not in xs]
Ik = lambda *ss: [x for x in xk if all(x in t for t in ss)]
assert Ik(Pk, Rk) == ['Pengakap'] and Ik(Rk, Qk) == ['Sejarah'] and Ik(Pk, Qk, Rk) == []
ek_pos = {(1, 0, 0): (140, 150), (0, 1, 0): (360, 150), (0, 0, 1): (250, 375), (1, 0, 1): (175, 268), (0, 1, 1): (325, 268)}
ekx = {ek_pos[b]: v for b, v in ek.items()}
S(s, 'CONTOH 5', 'Pelengkap persilangan set dengan gambar rajah Venn',
  p(f'Diberi aktiviti kokurikulum yang disertai oleh tiga orang murid seperti dalam set {i("P")}, set {i("Q")} dan set {i("R")} dengan keadaan ξ = {st(xk)}.')
  + p(f'{i("P")} = {st(Pk)}, {i("Q")} = {st(Qk)}, {i("R")} = {st(Rk)}. Senaraikan semua unsur bagi set (i) ({i("P")} {CI} {i("R")})′ (ii) ({i("R")} {CI} {i("Q")})′ (iii) ({i("P")} {CI} {i("Q")} {CI} {i("R")})′')
  + work([('Penyelesaian', [f'(i) {i("P")} {CI} {i("R")} = {{Pengakap}}; ({i("P")} {CI} {i("R")})′ = {st(compk(['Pengakap']))}',
                            f'(ii) {i("R")} {CI} {i("Q")} = {{Sejarah}}; ({i("R")} {CI} {i("Q")})′ = {st(compk(['Sejarah']))}',
                            f'(iii) {i("P")} {CI} {i("Q")} {CI} {i("R")} = {{ }}; ({i("P")} {CI} {i("Q")} {CI} {i("R")})′ = ξ'])], s, 1, 15),
  SV(venn([i('P'), i('Q'), i('R')], shade=lambda a, b, cc: not (a and cc), elems=ekx, fs=13) + GF.T(410, 440, f'({i("P")} {CI} {i("R")})′', AM, 18), 'Kawasan berlorek (P ∩ R)′'))

tot, sn, mt, bo = 150, 70, 60, 45
assert sn - bo == 25 and mt - bo == 15 and 25 + 45 + 15 == 85 and tot - 85 == 65
S(s, 'CONTOH 6', 'Menyelesaikan masalah yang melibatkan persilangan set',
  p(f'Sebanyak {tot} orang murid tingkatan lima diberi peluang untuk menyertai kelas intensif untuk mata pelajaran Sains dan Matematik. Sebanyak {sn} orang murid memilih kelas Sains, {mt} orang murid memilih kelas Matematik manakala {bo} orang murid memilih kelas Sains dan Matematik. Hitung (a) jumlah murid yang dapat menyertai kelas intensif, (b) jumlah murid yang tidak menyertai sebarang kelas.'),
  SV(venn([i('S'), i('M')], nums={(1, 0): 25, (1, 1): 45, (0, 1): 15, (0, 0): 65}), 'Gambar rajah Venn bilangan murid kelas Sains dan Matematik'))

S(s, 'CONTOH 6', 'Menyelesaikan masalah (sambungan)',
  work([('Memahami masalah', [f'ξ = {{150 murid}}, {i("S")} = {{kelas Sains}}, {i("M")} = {{kelas Matematik}}, {i("n")}({i("S")} {CI} {i("M")}) = 45.']),
          ('Merancang strategi', ['Lukis gambar rajah Venn dan isikan maklumat yang diberi.']),
          ('Melaksanakan strategi', ['Sains sahaja = 70 − 45 = 25', 'Matematik sahaja = 60 − 45 = 15', '25 + 45 + 15 = 85; 150 − 85 = 65']),
          ('Kesimpulan', ['(a) 85 orang murid menyertai kelas intensif. (b) 65 orang murid tidak menyertai sebarang kelas.'])], s, 2, 16),
  SV(venn([i('S'), i('M')], nums={(1, 0): 25, (1, 1): 45, (0, 1): 15, (0, 0): 65}), 'Gambar rajah Venn bilangan murid kelas Sains dan Matematik'))

T7 = dict(tot=200, ph=160, lp=95, tb=40, lt=6, pl=48, pt=7, po=85)
x7 = T7['ph'] - T7['po'] - T7['pl'] - T7['pt']
y7 = T7['lp'] - T7['pl'] - T7['lt'] - x7
p7 = T7['tb'] - T7['pt'] - x7 - T7['lt']
q7 = T7['tot'] - T7['po'] - T7['pl'] - T7['pt'] - T7['lt'] - x7 - y7 - p7
assert (x7, y7, p7, q7) == (20, 21, 7, 6)
nums7 = {(1, 0, 0): 85, (1, 1, 0): 48, (1, 0, 1): 7, (0, 1, 1): 6, (1, 1, 1): f'x = {x7}', (0, 1, 0): f'y = {y7}', (0, 0, 1): f'p = {p7}', (0, 0, 0): f'q = {q7}'}
S(s, 'CONTOH 7', 'Masalah persilangan tiga set',
  p(f'Sebanyak 200 orang pelajar universiti disoal selidik tentang penggunaan alat teknologi. Hasil kajian menunjukkan 160 orang memiliki telefon bimbit, 95 orang memiliki komputer riba, 40 orang memiliki tablet, 6 orang memiliki komputer riba dan tablet sahaja, 48 orang memiliki telefon bimbit dan komputer riba sahaja, 7 orang memiliki telefon bimbit dan tablet sahaja dan 85 orang memiliki telefon bimbit sahaja. Hitung (a) jumlah pelajar yang memiliki ketiga-tiga alat, (b) jumlah pelajar yang tidak memiliki ketiga-tiga alat tersebut.')
  + note(f'ξ = {{200 orang pelajar}}, {i("B")} = {{telefon bimbit}}, {i("K")} = {{komputer riba}}, {i("T")} = {{tablet}}. Lukis gambar rajah Venn dan isikan maklumat yang diberi.', 'Merancang strategi:'),
  SV(venn([i('B'), i('K'), i('T')], nums={(1, 0, 0): 85, (1, 1, 0): 48, (1, 0, 1): 7, (0, 1, 1): 6, (1, 1, 1): 'x', (0, 1, 0): 'y', (0, 0, 1): 'p', (0, 0, 0): 'q'}), 'Gambar rajah Venn pemilikan alat teknologi'))

S(s, 'CONTOH 7', 'Masalah persilangan tiga set (sambungan)',
  work([('Memahami masalah', ['Hitung bilangan pelajar yang memiliki ketiga-tiga alat teknologi dan yang tidak memiliki sebarang alat.']),
        ('Merancang strategi', ['Lukis gambar rajah Venn dan isikan maklumat yang diberi, bermula dengan persilangan ketiga-tiga set.']),
        ('Melaksanakan strategi', [f'<i>x</i> = 160 − 85 − 48 − 7 = {x7}', f'<i>y</i> = 95 − 48 − 6 − {x7} = {y7}', f'<i>p</i> = 40 − 7 − {x7} − 6 = {p7}', f'<i>q</i> = 200 − 85 − 48 − 7 − 6 − {x7} − {y7} − {p7} = {q7}']),
        ('Kesimpulan', [f'(a) {x7} orang pelajar memiliki ketiga-tiga alat teknologi.', f'(b) {q7} orang pelajar tidak memiliki ketiga-tiga alat teknologi tersebut.'])], s, 2, 16),
  SV(venn([i('B'), i('K'), i('T')], nums=nums7), 'Gambar rajah Venn lengkap'))

# =====================================================================
# 4.2 KESATUAN SET
# =====================================================================
s = '4.2'
c = COL[s]
o, h = mini_row([(f'{i("P")} {CU} {i("Q")}', lambda a, b: a or b, [i('P'), i('Q')]), (f'{i("Q")} {CU} {i("R")}', lambda a, b, cc: b or cc, [i('P'), i('Q'), i('R')]),
                 (f'{i("P")} {CU} {i("Q")} {CU} {i("R")}', lambda a, b, cc: a or b or cc, [i('P'), i('Q'), i('R')])])
S(s, 'DEFINISI', 'Kesatuan set',
  p('Negara Malaysia terdiri daripada pelbagai kaum. Namun rakyat Malaysia pelbagai kaum disatukan sebagai warganegara Malaysia.')
  + de(s, f'Kesatuan set {i("P")} dan set {i("Q")} ditulis menggunakan simbol {CU}. {i("P")} {CU} {i("Q")} mewakili semua unsur dalam set {i("P")} atau set {i("Q")} atau kedua-dua set {i("P")} dan set {i("Q")}.')
  + p('Kesatuan antara dua atau lebih set boleh diwakili oleh rantau berlorek seperti dalam gambar rajah Venn di sebelah.')
  + note('Unsur yang sama hanya ditulis sekali dalam kesatuan set.', 'Ingat:'),
  SVh(o, 'Kesatuan dua dan tiga set', h))

xi8 = list(range(1, 25))
P8 = [x for x in xi8 if 18 % x == 0]
Q8 = [x for x in xi8 if x % 3 == 0 and x < 20]
R8 = [x for x in xi8 if x % 4 == 0 and x < 20]
U = lambda *ss: sorted(set().union(*ss))
assert U(P8, Q8) == [1, 2, 3, 6, 9, 12, 15, 18] and U(Q8, R8) == [3, 4, 6, 8, 9, 12, 15, 16, 18]
e8 = reg([P8, Q8, R8], U(P8, Q8, R8))
assert (1, 0, 1) not in e8 and (1, 1, 1) not in e8
pos8 = {(1, 0, 0): (140, 150), (1, 1, 0): (250, 150), (0, 1, 0): (360, 150), (0, 1, 1): (318, 268), (0, 0, 1): (250, 370)}
S(s, 'CONTOH 8', 'Menyenaraikan unsur kesatuan set',
  p(f'Diberi set {i("P")} = {{faktor bagi 18}}, set {i("Q")} = {{gandaan 3 yang kurang daripada 20}} dan set {i("R")} = {{gandaan 4 yang kurang daripada 20}}.')
  + p(f'(a) Senaraikan semua unsur bagi set (i) {i("P")} {CU} {i("Q")} (ii) {i("P")} {CU} {i("R")} (iii) {i("Q")} {CU} {i("R")} (iv) {i("P")} {CU} {i("Q")} {CU} {i("R")}')
  + work([('', [f'{i("P")} = {st(P8)}', f'{i("Q")} = {st(Q8)}', f'{i("R")} = {st(R8)}']),
          ('(a)', [f'(i) {i("P")} {CU} {i("Q")} = {st(U(P8, Q8))}', f'(ii) {i("P")} {CU} {i("R")} = {st(U(P8, R8))}', f'(iii) {i("Q")} {CU} {i("R")} = {st(U(Q8, R8))}', f'(iv) {i("P")} {CU} {i("Q")} {CU} {i("R")} = {st(U(P8, Q8, R8))}'])], s, 1, 17),
  stack(SV(venn([i('P'), i('Q'), i('R')], shade=lambda a, b, cc: a or b, elems={pos8[b]: v for b, v in e8.items()}, univ=False) + GF.T(250, 445, f'(b) {i("P")} {CU} {i("Q")}', AM, 18), 'Kawasan berlorek P ∪ Q')))

xi9b = list(range(40, 51))
G9 = [41, 43, 47]
H9 = [x for x in xi9b if x % 4 == 0]
I9 = [x for x in xi9b if x % 5 == 0]
cm9 = lambda xs: [x for x in xi9b if x not in xs]
assert cm9(U(G9, H9)) == [42, 45, 46, 49, 50] and cm9(U(G9, I9)) == [42, 44, 46, 48, 49] and cm9(U(H9, I9)) == [41, 42, 43, 46, 47, 49] and cm9(U(G9, H9, I9)) == [42, 46, 49]
o, h = mini_row([(f'({i("P")} {CU} {i("Q")})′', lambda a, b: not (a or b), [i('P'), i('Q')]), (f'({i("P")} {CU} {i("R")})′', lambda a, b, cc: not (a or cc), [i('P'), i('Q'), i('R')]),
                 (f'({i("P")} {CU} {i("Q")} {CU} {i("R")})′', lambda a, b, cc: not (a or b or cc), [i('P'), i('Q'), i('R')])])
S(s, 'CONTOH 9', 'Pelengkap bagi kesatuan set',
  de(s, f'Pelengkap bagi kesatuan set ditulis sebagai ({i("A")} {CU} {i("B")})′, dibaca sebagai "pelengkap bagi kesatuan set {i("A")} atau set {i("B")}". Pelengkap bagi kesatuan set {i("A")} atau set {i("B")} bermaksud semua unsur yang bukan dalam set {i("A")} atau set {i("B")}.')
  + p(f'<b>CONTOH 9</b> Diberi ξ = {{{i("x")} : {i("x")} ialah integer, 40 ≤ {i("x")} ≤ 50}}, set {i("G")} = {{nombor perdana}}, set {i("H")} = {{gandaan 4}} dan set {i("I")} = {{gandaan 5}}. Senaraikan semua unsur dan nyatakan bilangan unsur bagi (a) ({i("G")} {CU} {i("H")})′ (b) ({i("G")} {CU} {i("I")})′ (c) ({i("H")} {CU} {i("I")})′ (d) ({i("G")} {CU} {i("H")} {CU} {i("I")})′'),
  stack(work([('', [f'{i("G")} = {st(G9)}, {i("H")} = {st(H9)}, {i("I")} = {st(I9)}', f'(a) ({i("G")} {CU} {i("H")})′ = {st(cm9(U(G9, H9)))}; {i("n")} = 5', f'(b) ({i("G")} {CU} {i("I")})′ = {st(cm9(U(G9, I9)))}; {i("n")} = 5',
                     f'(c) ({i("H")} {CU} {i("I")})′ = {st(cm9(U(H9, I9)))}; {i("n")} = 6', f'(d) ({i("G")} {CU} {i("H")} {CU} {i("I")})′ = {st(cm9(U(G9, H9, I9)))}; {i("n")} = 3'])], s, 1, 17),
        SVh(o, 'Kawasan berlorek bagi pelengkap kesatuan set', h)))

xs = ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Kudat', 'Keningau', 'Lahad Datu', 'Semporna', 'Ranau']
As, Bs, Cs = ['Sandakan', 'Tawau', 'Kota Kinabalu', 'Ranau'], ['Sandakan', 'Tawau', 'Kudat', 'Keningau'], ['Sandakan', 'Ranau', 'Kudat', 'Semporna']
cms = lambda xx: [x for x in xs if x not in xx]
assert cms(U(As, Bs)) == ['Lahad Datu', 'Semporna'] and cms(U(Bs, Cs)) == ['Kota Kinabalu', 'Lahad Datu'] and cms(U(As, Bs, Cs)) == ['Lahad Datu']
es = reg([As, Bs, Cs], xs)
S(s, 'CONTOH 10', 'Pelengkap kesatuan set dengan gambar rajah Venn',
  p(f'Tiga buah agensi pelancongan, {i("A")}, {i("B")} dan {i("C")}, dipilih untuk mengadakan pameran pelancongan di negeri Sabah.')
  + bul(s, [f'ξ = {st(xs)}', f'{i("A")} = {st(As)}', f'{i("B")} = {st(Bs)}', f'{i("C")} = {st(Cs)}'])
  + work([('Senaraikan semua unsur', [f'(i) ({i("A")} {CU} {i("B")})′ = {st(cms(U(As, Bs)))}', f'(ii) ({i("B")} {CU} {i("C")})′ = {st(cms(U(Bs, Cs)))}', f'(iii) ({i("A")} {CU} {i("B")} {CU} {i("C")})′ = {st(cms(U(As, Bs, Cs)))}'])], s, 1, 16),
  SV(venn([i('A'), i('B'), i('C')], shade=lambda a, b, cc: not (a or b or cc), elems={ANC3[b] if b != (0, 0, 0) else (90, 430): v for b, v in es.items()}, fs=12) + GF.T(410, 445, f'(iii) ({i("A")} {CU} {i("B")} {CU} {i("C")})′', AM, 15), 'Kawasan berlorek (A ∪ B ∪ C)′'))

assert 20 - 8 == 12 and 14 - 8 == 6 and 30 - 12 - 8 - 6 == 4 and 12 + 8 + 6 == 26
S(s, 'CONTOH 11', 'Menyelesaikan masalah yang melibatkan kesatuan set',
  p('Sebanyak 30 orang murid telah menyertai program perkhemahan di tepi sungai. Aktiviti yang dilakukan ialah berkayak dan memancing ikan. 20 orang murid berkayak dan 14 orang murid memancing ikan manakala 8 orang murid terlibat dengan kedua-dua aktiviti. Berapakah jumlah murid yang terlibat dalam aktiviti program tersebut?'),
  SV(venn([i('A'), i('B')], nums={(1, 0): 12, (1, 1): 8, (0, 1): 6, (0, 0): 4}, shade=lambda a, b: a or b), 'Gambar rajah Venn murid berkayak dan memancing'))

S(s, 'CONTOH 11', 'Menyelesaikan masalah (sambungan)',
  work([('Memahami masalah', [f'ξ = {{30 murid}}, {i("A")} = {{berkayak}}, {i("B")} = {{memancing ikan}}, {i("n")}({i("A")} {CI} {i("B")}) = 8.']),
          ('Merancang strategi', ['Lukis gambar rajah Venn dan isikan maklumat yang diberi.']),
          ('Melaksanakan strategi', ['Berkayak sahaja = 20 − 8 = 12', 'Memancing ikan sahaja = 14 − 8 = 6', 'Tidak terlibat = 30 − 12 − 8 − 6 = 4', f'{i("n")}({i("A")} {CU} {i("B")}) = 30 − 4 = 26 (Semak: 12 + 8 + 6 = 26)']),
          ('Kesimpulan', ['26 orang murid terlibat dalam aktiviti program tersebut.'])], s, 2, 16),
  SV(venn([i('A'), i('B')], nums={(1, 0): 12, (1, 1): 8, (0, 1): 6, (0, 0): 4}, shade=lambda a, b: a or b), 'Gambar rajah Venn murid berkayak dan memancing'))

d12 = dict(tot=120, sk=45, mj=30, bc=20, skm=10, mb=8, skb=6, all=4)
skm, mb, skb = 10 - 4, 8 - 4, 6 - 4
sko, mjo, bco = 45 - skm - skb - 4, 30 - skm - mb - 4, 20 - skb - mb - 4
none = 120 - (sko + mjo + bco + skm + mb + skb + 4)
assert (sko, mjo, bco, none) == (33, 16, 10, 45)
S(s, 'CONTOH 12', 'Masalah kesatuan tiga set',
  p('Sebanyak 120 orang dewasa terlibat dalam kajian mengenai bahan bacaan pilihan utama mereka. 45 orang memilih surat khabar, 30 orang memilih majalah, 20 orang memilih buku cerita, 10 orang memilih kedua-dua surat khabar dan majalah, 8 orang memilih kedua-dua majalah dan buku cerita, 6 orang memilih kedua-dua surat khabar dan buku cerita dan 4 orang memilih ketiga-tiga bahan bacaan. Berapakah bilangan yang tidak memilih sebarang bahan bacaan?')
  + note(f'ξ = {{orang dewasa}}, {i("P")} = {{surat khabar}}, {i("Q")} = {{majalah}}, {i("R")} = {{buku cerita}}. Isikan kawasan tengah dahulu, iaitu 4.', 'Merancang strategi:'),
  SV(venn([i('P'), i('Q'), i('R')], nums={(1, 1, 1): 4, (1, 1, 0): skm, (0, 1, 1): mb, (1, 0, 1): skb}), 'Gambar rajah Venn bahan bacaan: kawasan persilangan'))

S(s, 'CONTOH 12', 'Masalah kesatuan tiga set (sambungan)',
  work([('Memahami masalah', ['Hitung bilangan orang yang tidak memilih sebarang bahan bacaan.']),
        ('Merancang strategi', ['Lukis gambar rajah Venn dan isikan maklumat yang diberi, bermula dengan persilangan ketiga-tiga set.']),
        ('Melaksanakan strategi', ['10 − 4 = 6, 8 − 4 = 4, 6 − 4 = 2', f'Surat khabar sahaja = 45 − 6 − 2 − 4 = {sko}', f'Majalah sahaja = 30 − 6 − 4 − 4 = {mjo}', f'Buku cerita sahaja = 20 − 2 − 4 − 4 = {bco}',
                                         f'{i("n")}({i("P")} {CU} {i("Q")} {CU} {i("R")})′ = 120 − 33 − 16 − 10 − 6 − 4 − 2 − 4 = {none}']),
        ('Kesimpulan', [f'{none} orang tidak memilih sebarang bahan bacaan tersebut.'])], s, 2, 16),
  SV(venn([i('P'), i('Q'), i('R')], nums={(1, 1, 1): 4, (1, 1, 0): skm, (0, 1, 1): mb, (1, 0, 1): skb, (1, 0, 0): sko, (0, 1, 0): mjo, (0, 0, 1): bco, (0, 0, 0): none}), 'Gambar rajah Venn bahan bacaan lengkap'))

# =====================================================================
# 4.3 GABUNGAN OPERASI SET
# =====================================================================
s = '4.3'
c = COL[s]
hobi = [('Aina', 'menyanyi'), ('Zul', 'melukis'), ('Lina', 'menari'), ('Emi', 'menari dan menyanyi'), ('Gopal', 'melukis'), ('Ira', 'melukis, menyanyi dan menari'),
        ('Adam', 'menyanyi dan menari'), ('Mira', 'menari dan melukis'), ('Jun', 'menyanyi dan melukis'), ('Nadia', 'menari')]
P13 = [n for n, h in hobi if 'menyanyi' in h]
Q13 = [n for n, h in hobi if 'menari' in h]
R13 = [n for n, h in hobi if 'melukis' in h]
a1 = [n for n, _ in hobi if (n in P13 or n in Q13) and n in R13]
a2 = [n for n, _ in hobi if n in Q13 or (n in P13 and n in R13)]
assert a1 == ['Ira', 'Mira', 'Jun'] and a2 == ['Lina', 'Emi', 'Ira', 'Adam', 'Mira', 'Jun', 'Nadia']
S(s, 'CONTOH 13', 'Gabungan operasi set',
  de(s, f'Gabungan operasi set melibatkan kedua-dua persilangan set ({CI}) dan kesatuan set ({CU}) pada masa yang sama. Gabungan operasi set perlu diselesaikan dari kiri ke kanan, namun jika terdapat operasi dalam kurungan, operasi dalam kurungan mesti diselesaikan dahulu.')
  + p('<b>CONTOH 13</b> Jadual di sebelah menunjukkan hobi sekumpulan murid. ' + f'{i("P")} = {{murid yang menyanyi}}, {i("Q")} = {{murid yang menari}} dan {i("R")} = {{murid yang melukis}}. Senaraikan semua unsur bagi (i) ({i("P")} {CU} {i("Q")}) {CI} {i("R")} (ii) {i("Q")} {CU} ({i("P")} {CI} {i("R")})'),
  stack(table(['Murid', 'Hobi'], [[n, h] for n, h in hobi[:5]], c, 15).replace('</table>', '</table>') + table(['Murid', 'Hobi'], [[n, h] for n, h in hobi[5:]], c, 15) if False else
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' + table(['Murid', 'Hobi'], [[n, h] for n, h in hobi[:5]], c, 15) + table(['Murid', 'Hobi'], [[n, h] for n, h in hobi[5:]], c, 15) + '</div>',
        work([('', [f'{i("P")} = {st(P13)}', f'{i("Q")} = {st(Q13)}', f'{i("R")} = {st(R13)}',
                f'(i) {i("P")} {CU} {i("Q")} = {st([n for n, _ in hobi if n in P13 or n in Q13])}; ({i("P")} {CU} {i("Q")}) {CI} {i("R")} = {st(a1)}',
                f'(ii) {i("P")} {CI} {i("R")} = {{Ira, Jun}}; {i("Q")} {CU} ({i("P")} {CI} {i("R")}) = {st(a2)}'])], s, 1, 15)))

e13 = reg([P13, Q13, R13], [n for n, _ in hobi])
pos13 = {(1, 0, 0): (140, 150), (0, 1, 0): (360, 150), (0, 0, 1): (250, 370), (1, 1, 0): (250, 140), (1, 0, 1): (186, 262), (0, 1, 1): (314, 262), (1, 1, 1): (250, 222)}
el13 = {pos13[b]: v for b, v in e13.items()}
va = venn([i('P'), i('Q'), i('R')], shade=lambda a, b, cc: (a or b) and cc, elems=el13, fs=13)
vb = venn([i('P'), i('Q'), i('R')], shade=lambda a, b, cc: b or (a and cc), elems=el13, fs=13)
S(s, 'CONTOH 13', 'Gabungan operasi set dengan gambar rajah Venn',
  p(f'(b) Lukis gambar rajah Venn serta lorekkan kawasan yang mewakili setiap set (i) ({i("P")} {CU} {i("Q")}) {CI} {i("R")} (ii) {i("Q")} {CU} ({i("P")} {CI} {i("R")}).')
  + steps(s, [f'(i) Lorekkan kawasan bagi set ({i("P")} {CU} {i("Q")}).', f'Lorekkan kawasan bagi set {i("R")}.', f'Set ({i("P")} {CU} {i("Q")}) {CI} {i("R")} ialah kawasan yang sama meliputi kedua-dua set ({i("P")} {CU} {i("Q")}) dan set {i("R")}.']),
  SV(va + GF.T(410, 440, f'({i("P")} {CU} {i("Q")}) {CI} {i("R")}', AM, 16), 'Kawasan berlorek (P ∪ Q) ∩ R'))

S(s, 'CONTOH 13', 'Gabungan operasi set dengan gambar rajah Venn (sambungan)',
  steps(s, [f'(ii) Lorekkan kawasan bagi set {i("Q")}.', f'Lorekkan kawasan bagi set ({i("P")} {CI} {i("R")}).', f'Set {i("Q")} {CU} ({i("P")} {CI} {i("R")}) ialah semua kawasan yang meliputi kedua-dua set {i("Q")} dan set ({i("P")} {CI} {i("R")}).'])
  + note('Persilangan: kawasan yang sama bagi kedua-dua set. Kesatuan: semua kawasan bagi kedua-dua set.', 'Ingat:'),
  SV(vb + GF.T(410, 440, f'{i("Q")} {CU} ({i("P")} {CI} {i("R")})', AM, 16), 'Kawasan berlorek Q ∪ (P ∩ R)'))

xi14 = list(range(20, 31))
A14 = [x for x in xi14 if x % 3 == 0]
B14 = [x for x in xi14 if sum(map(int, str(x))) % 2]
C14 = [20, 23, 26, 29, 30]
cm14 = lambda xx: [x for x in xi14 if x not in xx]
i14 = lambda a, b: [x for x in xi14 if x in a and x in b]
u14 = lambda a, b: [x for x in xi14 if x in a or x in b]
r1 = i14(cm14(u14(A14, B14)), C14)
r2 = i14(cm14(A14), u14(B14, C14))
r3 = u14(cm14(i14(A14, C14)), i14(B14, C14))
assert A14 == [21, 24, 27, 30] and B14 == [21, 23, 25, 27, 29, 30] and r1 == [20, 26] and r2 == [20, 23, 25, 26, 29] and r3 == xi14
e14 = reg([A14, B14, C14], xi14)
S(s, 'CONTOH 14', 'Pelengkap bagi gabungan operasi set',
  p(f'Pelengkap bagi gabungan operasi set perlu diselesaikan dari kiri ke kanan, namun jika terdapat operasi dalam kurungan, operasi dalam kurungan mesti diselesaikan dahulu.')
  + p(f'<b>CONTOH 14</b> Diberi ξ = {{{i("x")} : {i("x")} ialah integer, 20 ≤ {i("x")} ≤ 30}}, set {i("A")} = {{{i("x")} : {i("x")} ialah gandaan 3}}, set {i("B")} = {{{i("x")} : hasil tambah dua digit {i("x")} ialah nombor ganjil}} dan {i("C")} = {st(C14)}. Senaraikan semua unsur bagi (i) ({i("A")} {CU} {i("B")})′ {CI} {i("C")} (ii) {i("A")}′ {CI} ({i("B")} {CU} {i("C")}) (iii) ({i("A")} {CI} {i("C")})′ {CU} ({i("B")} {CI} {i("C")})')
  + work([('', [f'{i("A")} = {st(A14)}, {i("B")} = {st(B14)}', f'(i) ({i("A")} {CU} {i("B")})′ = {st(cm14(u14(A14, B14)))}; ({i("A")} {CU} {i("B")})′ {CI} {i("C")} = {st(r1)}',
                f'(ii) {i("A")}′ = {st(cm14(A14))}; {i("B")} {CU} {i("C")} = {st(u14(B14, C14))}; {i("A")}′ {CI} ({i("B")} {CU} {i("C")}) = {st(r2)}',
                f'(iii) ({i("A")} {CI} {i("C")})′ = ξ − {{30}}; {i("B")} {CI} {i("C")} = {st(i14(B14, C14))}; gabungan = ξ'])], s, 1, 15),
  SV(venn([i('A'), i('B'), i('C')], shade=lambda a, b, cc: (not (a or b)) and cc, elems={(ANC3[b] if b != (0, 0, 0) else (75, 405)): v for b, v in e14.items()}, fs=14) + GF.T(400, 445, f'(i) ({i("A")} {CU} {i("B")})′ {CI} {i("C")}', AM, 15), 'Kawasan berlorek (A ∪ B)′ ∩ C'))

bs, pp, bm, bspp, ppbm, al = 30, 22, 15, 5, 7, 3
ab, bc = bspp - al, ppbm - al
ao, bo_, co = bs - ab - al, pp - ab - al - bc, bm - bc - al
assert (ao, bo_, co) == (25, 13, 8) and ao + bo_ + co == 46
S(s, 'CONTOH 15', 'Menyelesaikan masalah yang melibatkan gabungan operasi set',
  p(f'Persatuan Penduduk Taman Harmoni menganjurkan beberapa pertandingan sukan. Sebanyak {bs} orang menyertai bola sepak, {pp} orang menyertai pingpong, {bm} orang menyertai badminton. {bspp} orang menyertai bola sepak dan pingpong, {ppbm} orang menyertai pingpong dan badminton dan {al} orang menyertai ketiga-tiga pertandingan. Tiada peserta menyertai badminton dan bola sepak sahaja. Hitung jumlah peserta yang hanya menyertai satu pertandingan sahaja.')
  + note(f'ξ = {{peserta}}, {i("A")} = {{bola sepak}}, {i("B")} = {{pingpong}}, {i("C")} = {{badminton}}.', 'Merancang strategi:'),
  SV(venn([i('A'), i('B'), i('C')], nums={(1, 1, 1): al, (1, 1, 0): ab, (0, 1, 1): bc, (1, 0, 1): 0}, univ=False), 'Gambar rajah Venn peserta sukan: kawasan persilangan'))

S(s, 'CONTOH 15', 'Menyelesaikan masalah gabungan operasi set (sambungan)',
  work([('Memahami masalah', ['Hitung bilangan peserta yang menyertai satu pertandingan sahaja.']),
        ('Merancang strategi', ['Lukis gambar rajah Venn dan isikan maklumat yang diberi, bermula dengan persilangan ketiga-tiga set.']),
        ('Melaksanakan strategi', [f'{bspp} − {al} = {ab}, {ppbm} − {al} = {bc}', f'Bola sepak sahaja = {bs} − {ab} − {al} = {ao}', f'Pingpong sahaja = {pp} − {ab} − {al} − {bc} = {bo_}', f'Badminton sahaja = {bm} − {bc} − {al} = {co}', f'{ao} + {bo_} + {co} = 46']),
        ('Kesimpulan', ['46 orang peserta menyertai satu pertandingan sahaja.'])], s, 2, 16),
  SV(venn([i('A'), i('B'), i('C')], nums={(1, 1, 1): al, (1, 1, 0): ab, (0, 1, 1): bc, (1, 0, 1): 0, (1, 0, 0): ao, (0, 1, 0): bo_, (0, 0, 1): co}, univ=False), 'Gambar rajah Venn peserta sukan lengkap'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'operasiset', 'slides.js')
HEAD = '/* Nota Bab 4 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
