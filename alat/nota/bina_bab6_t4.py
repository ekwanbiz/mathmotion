"""Bab 6 T4 Ketaksamaan Linear dalam Dua Pemboleh Ubah: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder ketaksamaan dikekalkan (6.1, 6.2)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "6.1", "name": "Ketaksamaan Linear dalam Dua Pemboleh Ubah", "col": "#38BDF8"}, {"no": "6.2", "name": "Sistem Ketaksamaan Linear dalam Dua Pemboleh Ubah", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def i(s):
    return f'<i>{s}</i>'


X, Y = i('x'), i('y')
LE, GE = '≤', '≥'


def clip(poly, a, b, c, op):
    """simpan bahagian poligon yang memuaskan a x + b y (op) c."""
    sg = 1 if op in ('<', '<=') else -1
    f = lambda P: sg * (a * P[0] + b * P[1] - c)
    out = []
    for k in range(len(poly)):
        P, Q = poly[k], poly[(k + 1) % len(poly)]
        fp, fq = f(P), f(Q)
        if fp <= 1e-9:
            out.append(P)
        if (fp < -1e-9 and fq > 1e-9) or (fp > 1e-9 and fq < -1e-9):
            t = fp / (fp - fq)
            out.append((P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])))
    return out


def plane(bx, xr, yr, lines=(), shade=(), pts=(), col=None, xs=1, ys=1, fs=12, txt=(), labels=True, rv=True):
    """lines: (a, b, c, putus, label, (lx, ly)); shade: senarai (a, b, c, op) → rantau sepunya dilorek."""
    g = GF.Gr(bx, xr, yr, xs, ys, fs=fs, labels=labels)
    sc = col or TR
    if shade:
        poly = [(xr[0], yr[0]), (xr[1], yr[0]), (xr[1], yr[1]), (xr[0], yr[1])]
        for h in shade:
            poly = clip(poly, *h)
        if len(poly) > 2:
            d = ' '.join(f'{g.X(x):.1f},{g.Y(y):.1f}' for x, y in poly)
            g.add(f'<polygon points="{d}" fill="{sc}" fill-opacity="0.28" stroke="none"/>', rv)
    for ln in lines:
        a, b, c, dash, lab, lp = (list(ln) + [None, None, None])[:6]
        box = [(xr[0], yr[0]), (xr[1], yr[0]), (xr[1], yr[1]), (xr[0], yr[1])]
        P = []
        for k in range(4):
            (x1, y1), (x2, y2) = box[k], box[(k + 1) % 4]
            f1_, f2_ = a * x1 + b * y1 - c, a * x2 + b * y2 - c
            if abs(f1_ - f2_) > 1e-12 and f1_ * f2_ <= 0:
                t = f1_ / (f1_ - f2_)
                q = (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
                if all(abs(q[0] - r[0]) + abs(q[1] - r[1]) > 1e-6 for r in P):
                    P.append(q)
        if len(P) >= 2:
            g.seg(P[0], P[1], AM, 3.5, '9 7' if dash else None)
        if lab:
            g.text(lp[0], lp[1], lab, AM, 15)
    for p_ in pts:
        x, y, lab = p_[:3]
        kw = p_[3] if len(p_) > 3 else {}
        g.pt(x, y, lab, kw.get('c', TX), kw.get('dx', 10), kw.get('dy', -14), kw.get('anchor', 'start'), 15)
    for x, y, s_, cc in txt:
        g.text(x, y, s_, cc, 15)
    return g.svg()


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def frs(a, b):
    return f'<tspan>{a}/{b}</tspan>'


# =====================================================================
# 6.1 KETAKSAMAAN LINEAR DALAM DUA PEMBOLEH UBAH
# =====================================================================
s = '6.1'
c = COL[s]
assert 7000 - 3200 == 3800
S(s, 'KONSEP', 'Mewakili situasi dalam bentuk ketaksamaan linear',
  p('Ketaksamaan digunakan untuk menerangkan hubungan antara dua kuantiti yang tidak sama.')
  + work([('Situasi 1', [f'Tanda amaran ketinggian pada terowong ialah 4.5 m. Katakan ketinggian keseluruhan suatu kenderaan ialah {i("h")}, maka {i("h")} &lt; 4.5 m.', 'Hanya satu kuantiti yang terlibat, iaitu ketinggian dalam meter.']),
          ('Situasi 2', [f'Berat lori dengan muatan (BDM) ialah 7 000 kg dan berat tanpa muatan (BTM) ialah 3 200 kg.', 'Nilai muatan = BDM − BTM = (7 000 − 3 200) kg = 3 800 kg',
                         f'Katakan {Y} = BDM dan {X} = BTM, maka {Y} {LE} {X} + 3 800.'])], s, 1, 18),
  stack(table(['Simbol', 'Maksud'], [['&gt;', 'lebih besar daripada'], ['&lt;', 'kurang daripada'], [GE, 'lebih besar daripada atau sama dengan'], [LE, 'kurang daripada atau sama dengan']], c, 17),
        note(f'Persamaan linear dalam dua pemboleh ubah: {i("a")}{X} + {i("b")}{Y} = {i("c")}. Kuasa tertinggi pemboleh ubah ialah 1.', 'Ingat:'), p(f'{X} dan {Y} ialah dua pemboleh ubah yang mewakili dua kuantiti dengan unit yang sama.')))

assert 12 * 2 + 8 * 8 <= 90
S(s, 'CONTOH 1', 'Membentuk ketaksamaan linear',
  p('<b>CONTOH 1</b> Harga sebuah buku rujukan ialah RM12 dan harga sebuah buku latihan ialah RM8. Amaun maksimum yang boleh dibelanjakan oleh Faris ialah RM90. Wakilkan situasi ini dalam bentuk ketaksamaan linear.')
  + work([('Penyelesaian', [f'Katakan {X} = buku rujukan dan {Y} = buku latihan.', f'Maka, 12{X} + 8{Y} {LE} 90', f'Juga boleh ditulis sebagai 12{X} {LE} 90 − 8{Y} atau 8{Y} {LE} 90 − 12{X}'])], s, 1, 18)
  + note('Jumlah harga buku rujukan dan buku latihan kurang daripada atau sama dengan RM90.', 'Info:'),
  stack(p('<b>CONTOH 2</b> Harga sekeping poster kecil ialah RM10.50 dan sekeping poster besar ialah RM16.50. Peruntukan sekolah ialah RM120. Wakilkan pembelian kedua-dua jenis poster dalam bentuk ketaksamaan linear.'),
        work([('Penyelesaian', [f'Katakan {i("k")} = poster kecil dan {i("b")} = poster besar.', f'10.50{i("k")} + 16.50{i("b")} {LE} 120',
                                'Darabkan kedua-dua bahagian dengan 2:', f'21{i("k")} + 33{i("b")} {LE} 240'])], s, 1, 18)))

g = plane((60, 40, 450, 400), (-3, 4), (-2, 6), [(-1, 1, 1, False, f'y = x + 1', (2.9, 5.2))], txt=[(-1.4, 3.6, 'Rantau atas', PK), (-1.4, 3.0, 'y &gt; x + 1', PK), (2.6, 0.9, 'Rantau bawah', GR), (2.6, 0.3, 'y &lt; x + 1', GR)])
S(s, 'KONSEP', 'Titik dalam rantau dan ketaksamaan linear',
  p(f'Jika satu garis lurus yang mewakili persamaan linear {Y} = {i("m")}{X} + {i("c")} dilukis pada satah Cartes, semua titik pada satah Cartes boleh dikategorikan dalam tiga kumpulan:')
  + bul(s, [f'Titik pada garis lurus memuaskan persamaan {Y} = {i("m")}{X} + {i("c")}.', f'Titik di rantau atas garis lurus memuaskan ketaksamaan {Y} &gt; {i("m")}{X} + {i("c")}.', f'Titik di rantau bawah garis lurus memuaskan ketaksamaan {Y} &lt; {i("m")}{X} + {i("c")}.'])
  + table(['Garis', 'Rantau atas / kanan', 'Rantau bawah / kiri'], [[f'{Y} = {i("h")}', f'{Y} &gt; {i("h")}', f'{Y} &lt; {i("h")}'], [f'{X} = {i("k")}', f'{X} &gt; {i("k")} (kanan)', f'{X} &lt; {i("k")} (kiri)']], c, 17),
  SVh(g, 'Rantau atas dan rantau bawah garis y = x + 1', 440))

P3 = [(1, 3), (4, 0), (3, 4), (2, 5), (0, 1), (2, -1)]
cls = {pt: ('=' if pt[1] == -pt[0] + 4 else '>' if pt[1] > -pt[0] + 4 else '<') for pt in P3}
assert [cls[q] for q in P3] == ['=', '=', '>', '>', '<', '<']
g = plane((60, 40, 450, 400), (-1, 5), (-2, 6), [(1, 1, 4, False, 'y = −x + 4', (3.9, 1.3))], pts=[(x, y, f'({x}, {GF.mn(y)})') for x, y in P3])
S(s, 'CONTOH 3', 'Menentukan kedudukan titik daripada graf',
  p(f'Lukis garis lurus {Y} = −{X} + 4 untuk −1 {LE} {X} {LE} 5. Plotkan titik (1, 3), (4, 0), (3, 4), (2, 5), (0, 1) dan (2, −1). Tentukan sama ada titik itu memenuhi {Y} = −{X} + 4, {Y} &gt; −{X} + 4 atau {Y} &lt; −{X} + 4.')
  + work([('Penyelesaian', [f'Apabila {X} = −1, {Y} = −(−1) + 4 = 5; apabila {X} = 5, {Y} = −5 + 4 = −1', f'(1, 3) dan (4, 0) memuaskan persamaan {Y} = −{X} + 4.',
                            f'(3, 4) dan (2, 5) memuaskan ketaksamaan {Y} &gt; −{X} + 4.', f'(0, 1) dan (2, −1) memuaskan ketaksamaan {Y} &lt; −{X} + 4.'])], s, 1, 17),
  SVh(g, 'Garis y = −x + 4 dan enam titik', 440))

rows = []
for (x, y) in [(2, 4), (1, 1), (-1, 7), (0, 9)]:
    v = -2 * x + 5
    op = '=' if y == v else '&gt;' if y > v else '&lt;'
    rows.append([f'({x}, {y})'.replace('-', '−'), f'−2({x}) + 5 = {v}'.replace('(-', '(−'), f'{y} {op} {v}', f'{Y} {op} −2{X} + 5'])
assert [r[2].split()[1] for r in rows] == ['&gt;', '&lt;', '=', '&gt;']
S(s, 'CONTOH 4', 'Menentukan kedudukan titik tanpa melukis graf',
  p(f'Diberi persamaan linear {Y} = −2{X} + 5. Tanpa melukis graf garis lurus, tentukan sama ada titik yang diberikan memuaskan {Y} = −2{X} + 5, {Y} &gt; −2{X} + 5 atau {Y} &lt; −2{X} + 5.')
  + p('(a) (2, 4) (b) (1, 1) (c) (−1, 7) (d) (0, 9)')
  + note(f'Gantikan nilai {X} ke dalam −2{X} + 5, kemudian bandingkan hasilnya dengan nilai {Y}.', 'Tip:'),
  table(['Titik', f'−2{X} + 5', 'Banding', 'Titik memuaskan'], rows, c, 17))

g1 = plane((40, 40, 225, 230), (-3, 3), (-3, 3), [(-1, 1, 0, True)], [(-1, 1, 0, '>')], labels=False) + GF.T(132, 262, 'y &gt; x', TX, 16)
g2 = plane((285, 40, 470, 230), (-3, 3), (-3, 3), [(-1, 1, 0, False)], [(-1, 1, 0, '<=')], labels=False) + GF.T(377, 262, 'y ≤ x', TX, 16)
S(s, 'KONSEP', 'Garis sempang dan garis padu',
  table(['Tanda ketaksamaan', 'Jenis garis', 'Maksud'], [['&gt;, &lt;', 'Garis sempang', 'Rantau tidak termasuk titik pada garis lurus.'], [f'{GE}, {LE}', 'Garis padu', 'Rantau termasuk titik pada garis lurus.']], c, 17, False)
  + bul(s, [f'{Y} &gt; {i("m")}{X} + {i("c")} atau {Y} {GE} {i("m")}{X} + {i("c")}: lorek rantau atas.', f'{Y} &lt; {i("m")}{X} + {i("c")} atau {Y} {LE} {i("m")}{X} + {i("c")}: lorek rantau bawah.'])
  + note('Tukarkan ketaksamaan linear kepada bentuk persamaan linear untuk melukis graf garis lurus.', 'Tip:'),
  SVh(g1 + g2, 'Garis sempang dan garis padu', 280, 20))


def trio(specs):
    o = ''
    for k, (lab, ln, sh) in enumerate(specs):
        x0 = 8 + k * 166
        o += plane((x0 + 18, 30, x0 + 150, 180), (-4, 4), (-4, 4), [ln], [sh], xs=2, ys=2, fs=10) + GF.T(x0 + 84, 212, lab, TX, 15)
    return o


ga = trio([('(a) y &gt; ½x + 1', (-0.5, 1, 1, True), (-0.5, 1, 1, '>')), ('(b) y ≤ x − 2', (-1, 1, -2, False), (-1, 1, -2, '<=')), ('(c) y &lt; 2', (0, 1, 2, True), (0, 1, 2, '<'))])
gb = trio([('(d) y ≥ −x − 1', (1, 1, -1, False), (1, 1, -1, '>=')), ('(e) x &gt; −2', (1, 0, -2, True), (1, 0, -2, '>')), ('(f) y &gt; −3', (0, 1, -3, True), (0, 1, -3, '>'))])
S(s, 'CONTOH 5', 'Melorek rantau satu ketaksamaan linear',
  p('Lorekkan rantau yang mewakili ketaksamaan yang diberikan.')
  + work([('Penyelesaian', ['(a), (c), (e), (f): tanda &gt; atau &lt;, maka garis sempang.', '(b), (d): tanda ≥ atau ≤, maka garis padu.', '(a), (d), (f): lorek rantau atas. (b), (c): lorek rantau bawah.', '(e): lorek rantau kanan garis x = −2.'])], s, 1, 18),
  SVh(ga + f'<g transform="translate(0,230)">{gb}</g>', 'Enam rantau ketaksamaan', 450, 10))

ca = plane((50, 40, 230, 260), (-3, 3), (-3, 5), [(-2, 1, 2, False, 'y = 2x + 2', (-0.2, 4.4))], [(-2, 1, 2, '<=')], fs=10) + GF.T(140, 295, '(a) y ≤ 2x + 2', TX, 16)
cb = plane((300, 40, 480, 260), (-2, 5), (-5, 3), [(-1, 1, -3, True, 'y = x − 3', (2.6, 1.6))], [(-1, 1, -3, '<')], fs=10) + GF.T(390, 295, '(b) y &lt; x − 3', TX, 16)
S(s, 'CONTOH 6', 'Melukis graf dan melorek rantau',
  p('Lukis graf dan lorek rantau yang mewakili ketaksamaan berikut. (a) <i>y</i> ≤ 2<i>x</i> + 2 (b) <i>x</i> − <i>y</i> &gt; 3')
  + work([('(a)', [f'Lukis {Y} = 2{X} + 2 dengan garis padu: ({X} = 0, {Y} = 2), ({X} = −1, {Y} = 0).', 'Lorek rantau bawah garis lurus.']),
          ('(b)', [f'{X} − {Y} &gt; 3', f'Darab dengan −1: −{X} + {Y} &lt; −3, maka {Y} &lt; {X} − 3', f'Lukis {Y} = {X} − 3 dengan garis sempang dan lorek rantau bawah.'])], s, 1, 18)
  + note(f'Tukarkan pekali {Y} kepada nilai positif untuk memudahkan pemilihan rantau. Tanda ketaksamaan berubah apabila didarab dengan nombor negatif.', 'Tip:'),
  SVh(ca + cb, 'Graf y ≤ 2x + 2 dan y < x − 3', 320, 20))

# =====================================================================
# 6.2 SISTEM KETAKSAMAAN LINEAR
# =====================================================================
s = '6.2'
c = COL[s]
S(s, 'DEFINISI', 'Sistem ketaksamaan linear',
  de(s, 'Gabungan dua atau lebih ketaksamaan linear dikenali sebagai sistem ketaksamaan linear.')
  + p('Masalah harian seperti menentukan bilangan bas dan van dengan kos yang minimum boleh diselesaikan dengan membina beberapa ketaksamaan linear yang berkaitan dan menentukan rantau yang memuaskan kesemua ketaksamaan linear tersebut.'),
  table(['Situasi', 'Ketaksamaan'], [[f'{Y} lebih besar daripada {X}', f'{Y} &gt; {X}'], [f'{Y} kurang daripada {X}', f'{Y} &lt; {X}'], [f'{Y} tidak kurang daripada {X}', f'{Y} {GE} {X}'], [f'{Y} tidak melebihi {X}', f'{Y} {LE} {X}'],
                                      [f'{Y} sekurang-kurangnya {i("k")} kali {X}', f'{Y} {GE} {i("k")}{X}'], [f'{Y} selebih-lebihnya {i("k")} kali {X}', f'{Y} {LE} {i("k")}{X}'], [f'Hasil tambah {X} dan {Y} lebih besar daripada {i("k")}', f'{X} + {Y} &gt; {i("k")}'],
                                      [f'Beza {Y} dan {X} kurang daripada {i("k")}', f'{Y} − {X} &lt; {i("k")}'], [f'{Y} melebihi {X} sekurang-kurangnya {i("k")}', f'{Y} − {X} {GE} {i("k")}']], c, 16))

S(s, 'CONTOH 7', 'Membina sistem ketaksamaan linear',
  p(f'<b>CONTOH 7</b> {Y} orang murid Tingkatan 4 dan {X} orang murid Tingkatan 5 akan menyertai Kem Kepimpinan. Syarat: (a) jumlah peserta selebih-lebihnya 45 orang, (b) bilangan murid Tingkatan 5 tidak kurang daripada bilangan murid Tingkatan 4, (c) sekurang-kurangnya 12 orang murid Tingkatan 4 menyertai kem.')
  + work([('Penyelesaian', [f'(a) {X} + {Y} {LE} 45', f'(b) {X} {GE} {Y}', f'(c) {Y} {GE} 12'])], s, 3, 19),
  stack(p(f'<b>CONTOH 8</b> Sebuah kedai menempah dakwat jenama {X} berharga RM15 dan jenama {Y} berharga RM20. Syarat: (a) jumlah dakwat tidak melebihi 30 unit, (b) dakwat jenama {Y} sekurang-kurangnya dua kali jenama {X}, (c) jumlah pembelian tidak melebihi RM500.'),
        work([('Penyelesaian', [f'(a) {X} + {Y} {LE} 30', f'(b) {Y} {GE} 2{X}', f'(c) 15{X} + 20{Y} {LE} 500, iaitu 3{X} + 4{Y} {LE} 100'])], s, 1, 18)))

tp = {'A': (5, 4), 'B': (1, 4), 'C': (1, 1), 'D': (6, 1)}
res = {k: (x + y <= 6, y >= 2) for k, (x, y) in tp.items()}
assert [k for k, v in res.items() if all(v)] == ['B']
g = plane((60, 40, 450, 400), (0, 8), (0, 7), [(1, 1, 6, False, 'x + y = 6', (6.6, 0.6)), (0, 1, 2, False, 'y = 2', (7.3, 2.4))], txt=[(6, 5, 'A', TX), (1.6, 3.4, 'B', TX), (1.8, 0.9, 'C', TX), (6.6, 1.2, 'D', TX)])
tk = lambda b: '✓' if b else '✗'
S(s, 'CONTOH 9', 'Titik dalam rantau suatu sistem ketaksamaan',
  p(f'<b>CONTOH 9</b> Hanya satu rantau daripada rantau A, B, C dan D memuaskan kedua-dua ketaksamaan linear {X} + {Y} {LE} 6 dan {Y} {GE} 2. Tentukan rantau tersebut dengan menggantikan sekurang-kurangnya satu titik daripada setiap rantau ke dalam ketaksamaan.')
  + table(['Rantau', 'Titik', f'{X} + {Y} {LE} 6', f'{Y} {GE} 2'], [[k, f'{tp[k]}'.replace(' ', ' '), f'{sum(tp[k])} {LE} 6 {tk(res[k][0])}', f'{tp[k][1]} {GE} 2 {tk(res[k][1])}'] for k in 'ABCD'], c, 16, rvrows=(1,))
  + note(f'Hanya titik daripada rantau B memuaskan kedua-dua ketaksamaan. Maka rantau B memuaskan {X} + {Y} {LE} 6 dan {Y} {GE} 2.', 'Kesimpulan:'),
  SVh(g, 'Empat rantau A B C D', 440))

g = plane((60, 30, 450, 400), (-4, 4), (-2, 7), [(-1, 1, 3, False, 'y = x + 3', (2.4, 6.4)), (1, 0, 2, True, 'x = 2', (2.7, -1.3))], [(-1, 1, 3, '<='), (1, 0, 2, '<')], col=PK)
S(s, 'CONTOH 10', 'Melorek rantau sepunya',
  p('Rantau yang memuaskan satu sistem ketaksamaan linear dapat ditentukan dengan langkah-langkah berikut.')
  + steps(s, ['Tanda rantau yang terlibat bagi setiap ketaksamaan linear dengan penandaan yang berlainan.', 'Kenal pasti rantau sepunya yang ditanda dengan kesemua penandaan.', 'Lorek rantau sepunya sepenuhnya. Pastikan lorekan tidak terkeluar daripada rantau sepunya.'])
  + p(f'<b>CONTOH 10</b> Lorek rantau yang memuaskan {Y} {LE} {X} + 3 dan {X} &lt; 2.'),
  stack(SVh(g, 'Rantau sepunya y ≤ x + 3 dan x < 2', 400, 15), work([('Penyelesaian', [f'{Y} {LE} {X} + 3: rantau bawah garis padu.', f'{X} &lt; 2: rantau kiri garis sempang {X} = 2.'])], s, 1, 17)))

assert abs(4 / 2 - 2) < 1e-9
g = plane((60, 30, 450, 400), (-1, 7), (-1, 7), [(-1, 2, 0, False, '2y = x', (6.2, 3.6)), (1, 1, 6, True, 'x + y = 6', (5.6, 1.4))], [(-1, 2, 0, '>='), (1, 1, 6, '<'), (-1, 0, 0, '<=')], col=PK)
S(s, 'CONTOH 11', 'Melukis dan melorek rantau sistem ketaksamaan',
  p(f'Lukis dan lorek rantau yang memuaskan sistem ketaksamaan linear 2{Y} {GE} {X}, {X} + {Y} &lt; 6 dan {X} {GE} 0.')
  + work([('(a) Tukar kepada persamaan linear', [f'2{Y} = {X}: titik (0, 0) dan (6, 3), garis padu', f'{X} + {Y} = 6: titik (0, 6) dan (6, 0), garis sempang', f'{X} = 0: paksi-{Y}']),
          ('(b) Lukis graf', ['Lukis ketiga-tiga garis lurus pada satah Cartes yang sama.']),
          ('(c) Lorek rantau sepunya', [f'Atas garis 2{Y} = {X}, bawah garis {X} + {Y} = 6 dan kanan paksi-{Y}.'])], s, 1, 17),
  SVh(g, 'Rantau sepunya 2y ≥ x, x + y < 6, x ≥ 0', 430))

ga = plane((40, 30, 230, 230), (-1, 7), (-1, 7), [(1, 1, 6, True, 'x + y = 6', (4.6, 3.2))], [(1, 1, 6, '<'), (0, -1, 0, '<='), (-1, 0, 0, '<=')], col=PK, xs=2, ys=2, fs=10) + GF.T(135, 268, '(a)', TX, 17)
gb = plane((290, 30, 480, 230), (-7, 1), (-7, 1), [(1, 1, -5, False, 'x + y = −5', (-5.2, -5)), (0, 1, -1, True, 'y = −1', (-5.4, -1.6))], [(1, 1, -5, '>='), (0, 1, -1, '<'), (1, 0, 0, '<=')], col=PK, xs=2, ys=2, fs=10) + GF.T(385, 268, '(b)', TX, 17)
S(s, 'CONTOH 12 – 13', 'Menulis ketaksamaan bagi rantau berlorek',
  p('Nyatakan tiga ketaksamaan linear yang mentakrifkan rantau berlorek dalam setiap rajah berikut.')
  + work([('(a)', [f'Garis yang terlibat: {X} + {Y} = 6, paksi-{X} dan paksi-{Y}.', f'Rantau di bawah garis sempang {X} + {Y} = 6, maka {X} + {Y} &lt; 6.', f'Atas paksi-{X}, maka {Y} {GE} 0. Kanan paksi-{Y}, maka {X} {GE} 0.']),
          ('(b)', [f'Garis yang terlibat: {X} + {Y} = −5, {Y} = −1 dan paksi-{Y}.', f'Atas garis padu {X} + {Y} = −5, maka {X} + {Y} {GE} −5.', f'Bawah garis sempang {Y} = −1, maka {Y} &lt; −1. Kiri paksi-{Y}, maka {X} {LE} 0.'])], s, 1, 17),
  SVh(ga + gb, 'Dua rantau berlorek', 290, 10))

assert 16 + 8 == 24 and 16 / 2 == 8
g = plane((70, 30, 460, 380), (0, 26), (0, 14), [(1, 1, 24, False, 'x + y = 24', (23.3, 4.5)), (-0.5, 1, 0, False, 'y = ½x', (23, 12.8)), (0, 1, 6, True, 'y = 6', (3.5, 6.8))],
          [(1, 1, 24, '<='), (-0.5, 1, 0, '<='), (0, -1, 0, '<=')], pts=[(12, 6, '12', {'dy': 20, 'anchor': 'middle', 'dx': 0}), (18, 6, '18', {'dy': 20, 'anchor': 'middle', 'dx': 0}), (16, 8, '(16, 8)')], col=PK, xs=4, ys=2, fs=11)
S(s, 'CONTOH 14', 'Menyelesaikan masalah sistem ketaksamaan',
  p('Puan Aishah perlu memilih selebih-lebihnya 24 orang murid untuk pertandingan koir. Bilangan peserta perempuan sekurang-kurangnya dua kali peserta lelaki. (a) Tulis dua ketaksamaan linear selain <i>x</i> ≥ 0 dan <i>y</i> ≥ 0. (b) Lukis dan lorek rantau. (c) (i) Tentukan bilangan minimum dan maksimum peserta perempuan apabila terdapat 6 orang peserta lelaki. (ii) Adakah syarat dipatuhi jika 9 orang murid lelaki ingin menyertai?')
  + work([('Penyelesaian', [f'(a) Katakan {X} = peserta perempuan, {Y} = peserta lelaki. {X} + {Y} {LE} 24, {X} {GE} 2{Y} iaitu {Y} {LE} ½{X}',
                            '(c)(i) Garis y = 6 dalam rantau: minimum 12 orang, maksimum 18 orang', '(ii) Tidak, kerana nilai y = 9 berada di luar rantau berlorek.'])], s, 1, 16),
  SVh(g, 'Rantau pemilihan peserta koir', 420, 10))

assert 18 + 18 == 36
g = plane((70, 30, 460, 380), (0, 40), (0, 40), [(1, 1, 36, False, 'x + y = 36', (33, 8)), (-1, 1, 0, False, 'y = x', (33, 37)), (1, 0, 20, True, 'x = 20', (23.5, 34))],
          [(1, 1, 36, '<='), (1, -1, 0, '<='), (-1, 0, 0, '<=')], pts=[(18, 18, '(18, 18)')], col=PK, xs=4, ys=4, fs=11)
S(s, 'CONTOH 15', 'Penyelesaian masalah harian',
  p('Jumlah maksimum penumpang kereta api di sebuah taman tema ialah 36 orang. Bilangan penumpang dewasa mesti melebihi atau sama dengan bilangan penumpang kanak-kanak. (a) Tulis dua ketaksamaan linear selain <i>x</i> ≥ 0 dan <i>y</i> ≥ 0. (b) Lukis dan lorek rantau. (c) Tentukan bilangan maksimum kanak-kanak. (d) Jika terdapat 20 orang kanak-kanak, bolehkah mereka menaiki kereta api secara serentak?')
  + work([('Memahami masalah', ['(a) Menentukan dua ketaksamaan linear mengikut syarat. (b) Melukis dan melorek rantau. (c) Menentukan nilai daripada graf.']),
          ('Merancang strategi', [f'Katakan {X} = penumpang kanak-kanak dan {Y} = penumpang dewasa. Graf dilukis pada sukuan pertama; nilai ditentukan daripada rantau sepunya.'])], s, 1, 15),
  SVh(g, 'Rantau penumpang kereta api', 420, 10))

S(s, 'CONTOH 15 (sambungan)', 'Melaksanakan strategi dan kesimpulan',
  work([('Melaksanakan strategi', [f'(a) {X} + {Y} {LE} 36 dan {Y} {GE} {X}', '(b) Lukis garis x + y = 36 dan y = x; lorek rantau sepunya.', '(c) Bilangan maksimum kanak-kanak ialah 18 orang.', '(d) Tidak, kerana nilai x = 20 berada di luar rantau berlorek.']),
              ('Kesimpulan', ['Semua titik dalam rantau sepunya memuaskan sistem ketaksamaan linear yang dibina berdasarkan syarat-syarat situasi.'])], s, 1, 18),
  SVh(g, 'Rantau penumpang kereta api', 420, 10))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'ketaksamaan', 'slides.js')
HEAD = '/* Nota Bab 6 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
