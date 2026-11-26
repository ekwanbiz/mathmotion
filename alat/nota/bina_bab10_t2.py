"""Bab 10 T2 Kecerunan Garis Lurus: nota ikut buku teks (ayat buku, nombor ditukar).
Subtopik folder gradien dikekalkan (10.1.1, 10.1.2, 10.1.3) kerana bab.js dan soalan.js bergantung padanya."""
import os, math, sys
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import Gr, mn, TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "10.1.1", "name": "Kecerunan & Jarak", "col": "#FBBF24"}, {"no": "10.1.2", "name": "Rumus Dua Titik", "col": "#38BDF8"},
        {"no": "10.1.3", "name": "Arah & Pintasan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def sub(v, k):
    return f'<i>{v}</i><sub>{k}</sub>'


X1, X2, Y1, Y2 = sub('x', 1), sub('x', 2), sub('y', 1), sub('y', 2)
MRUM = fr(f'{Y2} − {Y1}', f'{X2} − {X1}')
MPIN = '−' + fr('pintasan-<i>y</i>', 'pintasan-<i>x</i>')


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
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def tri(a, b, c_, col, op='22', w=3.5):
    return f'<polygon points="{a[0]:.1f},{a[1]:.1f} {b[0]:.1f},{b[1]:.1f} {c_[0]:.1f},{c_[1]:.1f}" fill="{col}{op}" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>'


def ra(x, y, sx, sy, k=14, col=MU3):
    return f'<path d="M{x + sx * k:.1f} {y:.1f} L{x + sx * k:.1f} {y + sy * k:.1f} L{x:.1f} {y + sy * k:.1f}" fill="none" stroke="{col}" stroke-width="2"/>'


def frs(q):
    q = Fr(q)
    return mn(q.numerator) if q.denominator == 1 else fr(mn(q.numerator), q.denominator)


# =====================================================================
# 10.1.1 KECURAMAN DAN ARAH KECONDONGAN
# =====================================================================
s = '10.1.1'
c = COL[s]
o = f'<path d="M30 400 L120 330 L200 160 L260 110 L320 180 L470 400 Z" fill="{GR}22" stroke="{GR}" stroke-width="3.5" stroke-linejoin="round"/>'
for (x, y, lb) in ((75, 365, 'A'), (160, 245, 'C'), (230, 135, 'D'), (395, 290, 'E')):
    o += GF.T(x - 14, y - 6, lb, TX, 18, 'end' if lb != 'E' else 'start') if lb != 'E' else GF.T(x + 14, y - 6, lb, TX, 18, 'start')
o += GF.T(120, 230, 'curam', AM, 16, 'end') + GF.T(420, 330, 'menurun', AM, 16, 'start')
o += GF.T(250, 440, 'Laluan C lebih curam daripada laluan A', MU3, 16, halo=False)
S(s, 'KONSEP', 'Kecuraman dan arah kecondongan',
  p('Rajah menunjukkan kawasan berbukit yang dilalui oleh Amin dan Badrul semasa berbasikal. Ketika mereka mendaki di laluan <i>C</i>, mereka berasa sangat sukar untuk meneruskan kayuhan. Apabila mereka menuruni bukit di laluan <i>E</i>, keadaan basikal sangat laju. Mengapakah situasi ini berlaku?')
  + de(s, 'Kecuraman suatu garis lurus dapat dilihat dari nilai kecerunan, semakin besar nilai mutlak kecerunan, semakin curam garis lurus tersebut. Tanda positif atau negatif pada nilai kecerunan menunjukkan arah kecondongan garis lurus.')
  + note('Garisan yang mempunyai kecerunan tinggi mempunyai sudut yang lebih besar.', 'Tahukah anda:'),
  SV(o, 'Kawasan berbukit dengan laluan A, C, D dan E'))

# CONTOH 1
o = GF.box(14, 14, 230, 442) + GF.box(256, 14, 230, 442)
a1 = math.radians(25); a2 = math.radians(40)
N_, P_ = (40, 360), (220, 360); M_ = (220, 360 - 180 * math.tan(a1))
o += tri(N_, P_, M_, TR) + ra(220, 360, -1, -1) + GF.T(N_[0], N_[1] + 24, 'N', TX, 17) + GF.T(P_[0], P_[1] + 24, 'P', TX, 17) + GF.T(M_[0], M_[1] - 16, 'M', TX, 17)
o += GF.T(80, 348, '25°', AM, 16) + GF.T(129, 420, 'Tangga', MU3, 16)
S_, L_ = (282, 360), (462, 360); K_ = (462, 360 - 180 * math.tan(a2))
o += tri(S_, L_, K_, PK) + ra(462, 360, -1, -1) + GF.T(S_[0], S_[1] + 24, 'S', TX, 17) + GF.T(L_[0], L_[1] + 24, 'L', TX, 17) + GF.T(K_[0], K_[1] - 16, 'K', TX, 17)
o += GF.T(324, 348, '40°', AM, 16) + GF.T(371, 420, 'Eskalator', MU3, 16)
S(s, 'CONTOH 1', 'Membandingkan kecuraman',
  p('Perhatikan rajah di sebelah. Bandingkan arah kecondongan dan kecuraman antara garisan <i>MN</i> dengan <i>KL</i>. Buat kesimpulan daripada kedua-dua rajah tersebut.')
  + pen(s, ['Garisan <i>KL</i> mempunyai kecondongan yang lebih tinggi berbanding dengan garisan <i>MN</i>.', 'Semakin besar nilai sudut, semakin tinggi nilai kecerunan.',
            'Maka, garisan <i>KL</i> lebih curam berbanding dengan garisan <i>MN</i>.']),
  SV(o, 'Tangga bersudut 25 darjah dan eskalator bersudut 40 darjah'))

# Kecerunan = nisbah
o = tri((80, 380), (400, 380), (400, 140), AM) + ra(400, 380, -1, -1)
o += GF.T(400, 122, 'A', TX, 19) + GF.T(410, 395, 'B', TX, 19, 'start') + GF.T(66, 394, 'C', TX, 19, 'end')
o += GF.T(418, 260, '3 m', TX, 18, 'start') + GF.T(240, 404, '4 m', TX, 18)
o += GF.T(418, 285, 'jarak mencancang', AM, 14, 'start') + GF.T(240, 428, 'jarak mengufuk', AM, 14)
S(s, 'DEFINISI', 'Kecerunan',
  de(s, 'Kecerunan ialah nisbah jarak mencancang kepada jarak mengufuk.')
  + p('Rajah di sebelah menunjukkan kanak-kanak sedang menuruni papan gelongsor di taman permainan. Panjang garis lurus yang menyambungkan titik <i>A</i> dan titik <i>B</i> adalah setinggi 3 m. Panjang garis lurus yang menyambungkan titik <i>C</i> dan titik <i>B</i> ialah 4 m. <i>CB</i> ialah <b>jarak mengufuk</b> dan <i>AB</i> ialah <b>jarak mencancang</b>.')
  + formula(f'Kecerunan, <i>m</i> = {fr("Jarak mencancang", "Jarak mengufuk")}', c)
  + note('<i>m</i> mewakili kecerunan garis lurus.', 'Tip:'),
  SV(o, 'Papan gelongsor ABC dengan jarak mencancang 3 m dan jarak mengufuk 4 m'))

# CONTOH 2
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214) + GF.T(30, 36, '(a)', c, 16, 'start') + GF.T(30, 264, '(b)', c, 16, 'start')
o += tri((140, 60), (140, 200), (380, 200), TR) + ra(140, 200, 1, -1) + GF.T(128, 56, 'P', TX, 17, 'end') + GF.T(128, 204, 'Q', TX, 17, 'end') + GF.T(392, 204, 'R', TX, 17, 'start')
o += GF.T(128, 130, '3 m', MU3, 16, 'end') + GF.T(260, 220, '5 m', MU3, 16)
gb = Gr((110, 270, 400, 440), (0, 8), (0, 5), labels=False, equal=True)
gb.add(tri(gb.P(1, 1), gb.P(7, 1), gb.P(7, 4), PK)).add(ra(gb.X(7), gb.Y(1), -1, -1, 12))
gb.text(0.7, 1, '<i>P</i>', TX, 16, 'end').text(7.3, 4.2, '<i>R</i>', TX, 16, 'start').text(7.3, 0.8, '<i>S</i>', TX, 16, 'start')
o += gb.svg()
S(s, 'CONTOH 2', 'Jarak mencancang dan jarak mengufuk',
  p('Daripada setiap rajah di sebelah, nyatakan jarak mencancang dan jarak mengufuk di antara titik <i>P</i> dengan titik <i>R</i>.')
  + pen(s, ['(a) Jarak mencancang, <i>PQ</i> = 3 m. Jarak mengufuk, <i>QR</i> = 5 m', '(b) Jarak mencancang, <i>RS</i> = 3 unit. Jarak mengufuk, <i>PS</i> = 6 unit'])
  + note('Pada satah Cartes, kira bilangan petak untuk mendapatkan jarak mencancang dan jarak mengufuk.', 'Tip:'),
  SV(o, 'Dua segi tiga bersudut tegak bagi jarak mencancang dan mengufuk'))

# CONTOH 3
o = GF.box(14, 14, 230, 442) + GF.box(256, 14, 230, 442) + GF.T(30, 36, '(a)', c, 16, 'start') + GF.T(272, 36, '(b)', c, 16, 'start')
ga = Gr((50, 70, 220, 420), (0, 4), (0, 7), labels=False, equal=True)
ga.add(tri(ga.P(1, 1), ga.P(3, 1), ga.P(3, 6), PU)).text(0.7, 1, '<i>Q</i>', TX, 16, 'end').text(3.3, 6.1, '<i>P</i>', TX, 16, 'start')
gc = Gr((280, 70, 470, 420), (0, 6), (0, 5), labels=False, equal=True)
gc.add(tri(gc.P(1, 1), gc.P(5, 1), gc.P(5, 3), PU)).text(0.7, 1, '<i>C</i>', TX, 16, 'end').text(5.3, 3.2, '<i>B</i>', TX, 16, 'start')
o += ga.svg() + gc.svg()
S(s, 'CONTOH 3', 'Menentukan kecerunan',
  p('Daripada rajah di sebelah, tentukan kecerunan garis lurus bagi <i>PQ</i> dan <i>BC</i>. Perihalkan kecuraman garis <i>PQ</i> dan <i>BC</i>.')
  + work([('(a)', ['Jarak mencancang ialah 5 unit. Jarak mengufuk ialah 2 unit.', f'{fr("Jarak mencancang", "Jarak mengufuk")} = {fr(5, 2)}', f'Maka, kecerunan <i>PQ</i> ialah {fr(5, 2)}.']),
          ('(b)', ['Jarak mencancang ialah 2 unit. Jarak mengufuk ialah 4 unit.', f'{fr("Jarak mencancang", "Jarak mengufuk")} = {fr(2, 4)} = {fr(1, 2)}', f'Maka, kecerunan <i>BC</i> ialah {fr(1, 2)}.'])], s, 2, 18)
  + note('Garis <i>PQ</i> lebih curam daripada garis <i>BC</i> kerana nilai kecerunannya lebih besar.', 'Ingat:'),
  SV(o, 'Segi tiga PQ dan BC pada grid'))

# =====================================================================
# 10.1.2 RUMUS KECERUNAN DUA TITIK
# =====================================================================
s = '10.1.2'
c = COL[s]
g = Gr((80, 50, 450, 400), (0, 8), (0, 7), labels=False, equal=True)
g.seg((1.5, 1.5), (6.5, 5.5), PK, 4).seg((1.5, 1.5), (6.5, 1.5), AM, 2.5, '7 6').seg((6.5, 1.5), (6.5, 5.5), AM, 2.5, '7 6')
g.seg((0, 5.5), (6.5, 5.5), MU3, 1.5, '4 4').seg((0, 1.5), (1.5, 1.5), MU3, 1.5, '4 4').seg((1.5, 0), (1.5, 1.5), MU3, 1.5, '4 4').seg((6.5, 0), (6.5, 1.5), MU3, 1.5, '4 4')
g.pt(1.5, 1.5, f'<i>A</i> ({X1}, {Y1})', TX, -6, -18, 'middle').pt(6.5, 5.5, f'<i>B</i> ({X2}, {Y2})', TX, -8, -16, 'end')
g.text(4, 1.1, f'{X2} − {X1}', AM, 16).text(6.75, 3.5, f'{Y2} − {Y1}', AM, 16, 'start')
g.text(1.5, -0.45, X1, MU3, 15).text(6.5, -0.45, X2, MU3, 15).text(-0.2, 1.5, Y1, MU3, 15, 'end').text(-0.2, 5.5, Y2, MU3, 15, 'end')
S(s, 'RUMUS', 'Rumus kecerunan garis lurus pada satah Cartes',
  p(f'Dalam sistem koordinat Cartesan, <b>kecerunan garis lurus</b> yang melalui dua titik <i>A</i> ({X1}, {Y1}) dan <i>B</i> ({X2}, {Y2}) dapat dikira menggunakan nisbah jarak mencancang kepada jarak mengufuk.')
  + bul(s, [f'Perubahan <i>y</i> = Jarak mencancang = {Y2} − {Y1}', f'Perubahan <i>x</i> = Jarak mengufuk = {X2} − {X1}'])
  + formula(f'Kecerunan, <i>m</i> = {fr("Jarak mencancang", "Jarak mengufuk")} = {MRUM}', c),
  SV(g.svg(), 'Garis AB dengan jarak mencancang y2 − y1 dan jarak mengufuk x2 − x1'))

assert Fr(7 - 1, 5 - 2) == 2 and Fr(4 - (-2), 3 - 5) == -3
g = Gr((70, 40, 460, 430), (-1, 7), (-3, 8), 1, 1, fs=11, equal=True)
g.seg((2, 1), (5, 7), PK, 3.5).pt(2, 1, '<i>A</i> (2, 1)', PK, 10, 8).pt(5, 7, '<i>B</i> (5, 7)', PK, 10, 0)
g.seg((5, -2), (3, 4), TR, 3.5).pt(5, -2, '<i>P</i> (5, −2)', TR, 10, 0).pt(3, 4, '<i>Q</i> (3, 4)', TR, -10, -6, 'end')
S(s, 'CONTOH 4', 'Kecerunan melalui dua titik',
  p('Tentukan kecerunan bagi pasangan koordinat berikut. (a) <i>A</i> (2, 1) dan <i>B</i> (5, 7) (b) <i>P</i> (5, −2) dan <i>Q</i> (3, 4)')
  + work([('(a)', [f'<i>A</i> (2, 1) ialah ({X1}, {Y1}), <i>B</i> (5, 7) ialah ({X2}, {Y2})', f'Kecerunan = {MRUM}', f'= {fr("7 − 1", "5 − 2")}', f'= {fr(6, 3)}', '= 2']),
          ('(b)', [f'<i>P</i> (5, −2) ialah ({X1}, {Y1}), <i>Q</i> (3, 4) ialah ({X2}, {Y2})', f'Kecerunan = {MRUM}', f'= {fr("4 − (−2)", "3 − 5")}', f'= {fr(6, "−2")}', '= −3'])], s, 2, 18)
  + note('Titik yang mana satu dipilih sebagai (<i>x</i><sub>1</sub>, <i>y</i><sub>1</sub>) tidak mengubah nilai kecerunan, asalkan susunannya sama pada pengangka dan penyebut.', 'Ingat:'),
  SV(g.svg(), 'Garis AB dan garis PQ pada satah Cartes'))

# =====================================================================
# 10.1.3 ARAH, PINTASAN DAN PENYELESAIAN MASALAH
# =====================================================================
s = '10.1.3'
c = COL[s]
o = GF.box(14, 14, 472, 214) + GF.box(14, 242, 472, 214)
g1 = Gr((70, 40, 440, 180), (0, 8), (0, 6), labels=False)
g1.seg((1.5, 1), (6, 5), PK, 4).pt(1.5, 1, f'<i>A</i> ({X1}, {Y1})', TX, 10, 10).pt(6, 5, f'<i>B</i> ({X2}, {Y2})', TX, -10, -12, 'end')
o += g1.svg() + GF.T(250, 212, f'Kecerunan, <i>m</i> = (<i>y</i><sub>2</sub> − <i>y</i><sub>1</sub>) ÷ (<i>x</i><sub>2</sub> − <i>x</i><sub>1</sub>)', TX, 15)
g2 = Gr((70, 268, 440, 410), (0, 8), (0, 6), labels=False)
g2.seg((0, 5), (5, 0), PK, 4).pt(0, 5, '(0, <i>y</i>) pintasan-<i>y</i>', TR, 10, -6).pt(5, 0, '(<i>x</i>, 0) pintasan-<i>x</i>', AM, 0, -16, 'middle')
o += g2.svg() + GF.T(250, 440, 'Kecerunan, <i>m</i> = −pintasan-<i>y</i> ÷ pintasan-<i>x</i>', TX, 15)
S(s, 'RUMUS', 'Pintasan-x dan pintasan-y',
  de(s, 'Titik persilangan antara garis lurus dengan paksi-<i>x</i> dinamakan <b>pintasan-<i>x</i></b>, manakala titik persilangan antara garis lurus dengan paksi-<i>y</i> dinamakan <b>pintasan-<i>y</i></b>.')
  + formula(f'<i>m</i> = {MRUM} &nbsp; dan &nbsp; <i>m</i> = {MPIN}', c)
  + note('Koordinat pada pintasan-<i>y</i> ialah (0, <i>y</i>). Koordinat pada pintasan-<i>x</i> ialah (<i>x</i>, 0).', 'Tip:'),
  SV(o, 'Kecerunan menggunakan dua titik dan menggunakan pintasan'))

# CONTOH 5 & 6
o = GF.box(14, 14, 230, 300) + GF.box(256, 14, 230, 300) + GF.T(30, 36, '(a)', c, 16, 'start') + GF.T(272, 36, '(b)', c, 16, 'start')
ga = Gr((40, 60, 220, 290), (-5, 2), (-1, 7), labels=False)
ga.seg((-4.6, -0.9), (0.4, 6.6), PK, 3.5).pt(-4, 0, '−4', TX, 0, 18, 'middle').pt(0, 6, '6', TX, 10, 0)
gb = Gr((282, 60, 462, 290), (-1, 4), (-1, 6), labels=False)
gb.seg((-0.3, 5.75), (2.3, -0.75), PK, 3.5).pt(0, 5, '5', TX, -10, 0, 'end').pt(2, 0, '2', TX, 6, 18, 'start')
o += ga.svg() + gb.svg()
o += GF.box(14, 328, 472, 128) + GF.T(30, 352, 'CONTOH 6', c, 15, 'start')
o += GF.T(250, 388, '(a) <i>L</i> (3, 0) dan <i>M</i> (0, 9)', TX, 17) + GF.T(250, 422, '(b) <i>G</i> (−2, 0) dan <i>K</i> (0, 8)', TX, 17)
assert Fr(-6, -4) == Fr(3, 2) and Fr(-5, 2) == Fr(-5, 2) and Fr(-9, 3) == -3 and Fr(-8, -2) == 4
S(s, 'CONTOH 5', 'Kecerunan menggunakan pintasan',
  p('Tentukan kecerunan bagi garis lurus berikut.')
  + work([('(a)', ['Pintasan-<i>y</i> = 6, Pintasan-<i>x</i> = −4', f'Kecerunan = −{fr(6, "(−4)")} = {fr(3, 2)}']), ('(b)', ['Pintasan-<i>y</i> = 5, Pintasan-<i>x</i> = 2', f'Kecerunan = −{fr(5, 2)}'])], s, 2, 17)
  + p('<b>CONTOH 6</b> Tentukan kecerunan apabila diberi pasangan koordinat.')
  + work([('(a)', ['Pintasan-<i>y</i> = 9, Pintasan-<i>x</i> = 3', f'Kecerunan = −{fr(9, 3)} = −3']), ('(b)', ['Pintasan-<i>y</i> = 8, Pintasan-<i>x</i> = −2', f'Kecerunan = −{fr(8, "(−2)")} = 4'])], s, 2, 17),
  SV(o, 'Dua garis lurus dengan pintasan yang ditanda'))

# CONTOH 7
g = Gr((60, 50, 460, 400), (-5, 4), (-1, 5), 1, 1, fs=12, equal=True)
g.seg((-4, 0), (0, 2), PK, 3.5).seg((0, 2), (0.6, 2.3), PK, 2, '5 4').pt(-4, 0, '<i>A</i>', PK, 0, -16, 'middle').pt(0, 2, '<i>B</i>', PK, -10, -12, 'end')
g.seg((0, 4), (2, 0), TR, 3.5).pt(0, 4, '<i>P</i>', TR, 10, -8).pt(2, 0, '<i>Q</i>', TR, 8, -14)
assert Fr(-2, -4) == Fr(1, 2) and Fr(-4, 2) == -2
S(s, 'CONTOH 7', 'Kecerunan daripada graf',
  p('Hitung kecerunan garis lurus <i>AB</i> dan <i>PQ</i> berdasarkan rajah di sebelah.')
  + pen(s, [f'Kecerunan, <i>m</i> = {MPIN}', f'(i) Kecerunan <i>AB</i> = −{fr(2, "(−4)")} = {fr(2, 4)} = {fr(1, 2)}. Maka, kecerunan <i>AB</i> ialah {fr(1, 2)}.',
            f'(ii) Kecerunan <i>PQ</i> = −{fr(4, 2)} = −2. Maka, kecerunan <i>PQ</i> ialah −2.']),
  SV(g.svg(), 'Garis AB dan PQ dengan pintasan pada paksi'))

# generalisasi
o = GF.box(14, 14, 230, 214) + GF.box(256, 14, 230, 214) + GF.box(14, 242, 230, 214) + GF.box(256, 242, 230, 214)
specs = [(14, 14, 'Positif', 'condong ke kanan', ((50, 190), (210, 60))), (256, 14, 'Negatif', 'condong ke kiri', ((292, 60), (452, 190))),
         (14, 242, 'Sifar', 'selari dengan paksi-x', ((40, 360), (220, 360))), (256, 242, 'Tidak tertakrif (∞)', 'selari dengan paksi-y', ((371, 290), (371, 430)))]
for x0, y0, t1, t2, (a, b) in specs:
    o += GF.L(a, b, PK, 4) + GF.T(x0 + 115, y0 + 26, t1, c, 17) + GF.T(x0 + 115, y0 + 200, t2, MU3, 14)
S(s, 'KONSEP', 'Kecerunan garis lurus',
  bul(s, ['Garis lurus yang condong ke kanan mempunyai kecerunan positif.', 'Garis lurus yang condong ke kiri mempunyai kecerunan negatif.',
          'Koordinat-<i>y</i> bagi mana-mana titik dalam suatu garis lurus yang selari dengan paksi-<i>x</i> adalah sama. Oleh itu, kecerunannya ialah sifar.',
          'Koordinat-<i>x</i> bagi mana-mana dua titik dalam satu garis lurus yang selari dengan paksi-<i>y</i> adalah sama. Ini akan memberikan kecerunan yang tidak tertakrif.'])
  + de(s, 'Semakin garis lurus <i>AB</i> menghampiri keadaan mencancang, semakin besar nilai kecerunan dan sebaliknya. Maka, semakin besar nilai mutlak kecerunan, semakin curam garis lurus.'),
  SV(o, 'Empat jenis kecerunan: positif, negatif, sifar dan tidak tertakrif'))

# CONTOH 8
g = Gr((50, 50, 460, 420), (-5, 5), (-4, 4), labels=False)
lines = [((-4.5, 3), (-3, 1), 'E', 'F'), ((-2.5, -2.5), (-1, 1.5), 'G', 'H'), ((0.3, 3.3), (2, 3.3), 'A', 'B'), ((3.5, 2.5), (3.5, -1), 'P', 'Q'), ((1, -3), (4, -1.5), 'M', 'N')]
for a, b, la, lb in lines:
    g.seg(a, b, PK, 3.5).pt(*a, f'<i>{la}</i>', TX, -10, -10, 'end').pt(*b, f'<i>{lb}</i>', TX, 10, -10)
S(s, 'CONTOH 8', 'Jenis kecerunan',
  p('Kenal pasti garis lurus yang mempunyai nilai kecerunan sama ada positif, negatif, sifar atau tidak tertakrif dalam rajah di sebelah. Berikan justifikasi.')
  + pen(s, ['Kecerunan garis lurus <i>EF</i> ialah negatif kerana condong ke kiri', 'Kecerunan garis lurus <i>GH</i> dan <i>MN</i> ialah positif kerana condong ke kanan', 'Kecerunan garis lurus <i>AB</i> ialah sifar kerana garisnya mengufuk',
            'Kecerunan garis lurus <i>PQ</i> ialah tidak tertakrif kerana garisnya mencancang'], False),
  SV(g.svg(), 'Lima garis lurus dengan arah kecondongan berbeza'))

# CONTOH 9 + menentukan kecerunan
g = Gr((50, 50, 460, 420), (0, 8), (-2, 6), labels=False)
g.seg((1.5, -1.5), (2.7, 5.5), PK, 3.5).pt(1.5, -1.5, '<i>M</i>', PK, -10, 0, 'end').pt(2.7, 5.5, '<i>N</i>', PK, 10, 0)
g.seg((0, 0), (7, 2.2), GR, 3.5).pt(7, 2.2, '<i>J</i>', GR, 10, 0)
g.seg((3, -1), (6.5, 5.5), TR, 3.5).pt(3, -1, '<i>K</i>', TR, 10, 6).pt(6.5, 5.5, '<i>L</i>', TR, 10, 0)
g.text(-0.25, -0.35, '<i>O</i>', MU3, 15, 'end')
S(s, 'CONTOH 9', 'Kecerunan terbesar dan terkecil',
  p('Kenal pasti garis lurus dalam rajah di sebelah yang mempunyai nilai kecerunan terbesar dan terkecil serta nyatakan alasannya.')
  + pen(s, ['Garis lurus <i>MN</i> merupakan garis lurus yang mempunyai kecerunan paling besar kerana menghampiri keadaan mencancang.',
            'Garis lurus <i>OJ</i> merupakan garis lurus yang mempunyai kecerunan paling kecil kerana menghampiri keadaan mengufuk.'], False)
  + de(s, 'Nisbah \'jarak mencancang kepada jarak mengufuk\' digunakan untuk menentukan kecerunan suatu garis lurus. Semakin besar nilai kecerunan, semakin curam garis lurus tersebut.'),
  SV(g.svg(), 'Garis MN curam, KL sederhana dan OJ landai'))

# CONTOH 10
o = GF.box(14, 14, 230, 300) + GF.box(256, 14, 230, 300) + GF.T(30, 36, '(a)', c, 16, 'start') + GF.T(272, 36, '(b)', c, 16, 'start')
o += tri((70, 260), (150, 260), (150, 60), PK) + ra(150, 260, -1, -1) + GF.T(60, 268, 'Rumah', TX, 14, 'end') + GF.T(150, 50, 'Hutan', TX, 14)
o += GF.T(160, 160, '60 − 24 m', MU3, 14, 'start') + GF.T(110, 282, '12 m', MU3, 14)
o += tri((290, 260), (460, 260), (460, 147), PK) + ra(460, 260, -1, -1) + GF.T(290, 300, 'Tepi sungai', TX, 14, 'start') + GF.T(460, 135, 'Rumah', TX, 14)
o += GF.T(452, 205, '24 m', MU3, 14, 'end') + GF.T(375, 282, '36 m', MU3, 14)
o += GF.box(14, 328, 472, 128) + GF.T(250, 360, 'Hutan: 60 m dari paras sungai', MU3, 16) + GF.T(250, 390, 'Rumah: 24 m dari paras sungai', MU3, 16) + GF.T(250, 420, 'Sungai → rumah: 36 m; rumah → hutan: 12 m (mengufuk)', MU3, 15)
assert Fr(36, 12) == 3 and Fr(24, 36) == Fr(2, 3)
S(s, 'CONTOH 10', 'Menentukan kecerunan dalam situasi',
  p('Setiap hari Danial akan mengambil air di sungai yang berdekatan dengan rumahnya dan ke hutan untuk mencari cendawan busut. Hitung kecerunan yang dilalui olehnya dari (a) rumah ke hutan. (b) tepi sungai ke rumahnya.')
  + work([('(a)', [f'Kecerunan = {fr("Jarak mencancang", "Jarak mengufuk")}', f'= {fr("60 − 24", 12)} = {fr(36, 12)} = 3', 'Maka, kecerunan dari rumah Danial ke hutan ialah 3.']),
          ('(b)', [f'Kecerunan = {fr("Jarak mencancang", "Jarak mengufuk")}', f'= {fr(24, 36)} = {fr(2, 3)}', f'Maka, kecerunan dari tepi sungai ke rumah ialah {fr(2, 3)}.'])], s, 2, 18),
  SV(o, 'Segi tiga laluan rumah ke hutan dan tepi sungai ke rumah'))

# CONTOH 11 & 12
assert Fr(-(-6), -2) == -3 and -Fr(1, 3) * 9 == -3 and -Fr(-9, 3) == 3
ga = Gr((60, 50, 450, 400), (-5, 3), (-7, 2), 1, 1, fs=11)
ga.seg((-4, 2), (0.4, -6.8), PK, 3.5).pt(0, -6, '<i>P</i> (0, −6)', TX, 10, 0).pt(-3, 0, 'pintasan-<i>x</i>', AM, -10, -14, 'end')
ga.text(-1.6, -3.2, '<i>m</i> = −2', AM, 15, 'end')
S(s, 'CONTOH 11', 'Penyelesaian masalah: pintasan',
  p('(a) Tentukan pintasan-<i>x</i> dalam suatu garis lurus yang melalui titik <i>P</i> (0, −6) dengan kecerunan −2.')
  + p('(b) Tentukan koordinat bagi pintasan pada paksi-<i>y</i> yang melalui titik <i>Q</i> (9, 0) dan kecerunan ' + fr(1, 3) + '.')
  + work([('(a)', ['Memahami masalah: Tentukan pintasan-<i>x</i>.', f'Merancang strategi: pintasan-<i>x</i> = −{fr("(pintasan-<i>y</i>)", "<i>m</i>")}, pintasan-<i>y</i> = −6',
                   f'Melaksanakan strategi: pintasan-<i>x</i> = −{fr("(−6)", "−2")} = −3', 'Membuat kesimpulan: Maka pintasan-<i>x</i> ialah −3 dan koordinat (−3, 0).']),
          ('(b)', ['Memahami masalah: Tentukan kedudukan pintasan-<i>y</i>.', 'Merancang strategi: pintasan-<i>y</i> = −<i>m</i> × (pintasan-<i>x</i>), pintasan-<i>x</i> = 9',
                   f'Melaksanakan strategi: pintasan-<i>y</i> = −{fr(1, 3)} × 9 = −3', 'Membuat kesimpulan: pintasan-<i>y</i> = −3. Maka koordinat bagi pintasan-<i>y</i> ialah (0, −3).'])], s, 2, 16),
  SV(ga.svg(), 'Garis dengan kecerunan −2 melalui P(0, −6)'))

gb = Gr((80, 50, 450, 400), (-2, 5), (-10, 2), 1, 2, fs=11)
gb.seg((-0.3, -9.9), (3.6, 1.8), PK, 3.5).pt(0, -9, '−9', TX, -10, 0, 'end').pt(3, 0, '<i>v</i>', TX, 10, -14)
gb.text(2.2, -5, '<i>m</i> = 3', AM, 15, 'start')
S(s, 'CONTOH 12', 'Mencari nilai yang tidak diketahui',
  p('Hitung nilai <i>v</i> dalam rajah di sebelah.')
  + work([('Memahami masalah', ['Tentukan kedudukan <i>v</i>. <i>v</i> = pintasan-<i>x</i>']), ('Merancang strategi', [f'Menggunakan rumus: Pintasan-<i>x</i> = −{fr("(pintasan-<i>y</i>)", "<i>m</i>")}']),
          ('Melaksanakan strategi', [f'Pintasan-<i>x</i> = −({fr("−9", 3)}) = 3']), ('Membuat kesimpulan', ['Maka, <i>v</i> ialah 3.'])], s, 1, 19),
  SV(gb.svg(), 'Garis berkecerunan 3 dengan pintasan-y −9 dan pintasan-x v'))

# CONTOH 13
A13, B13, C13, D13 = (-8, -3), (-6, 1), (-1, 2), (-3, -2)
g = Gr((60, 50, 460, 400), (-9, 1), (-4, 3), 1, 1, fs=11, equal=True)
g.add(f'<polygon points="{" ".join(f"{g.X(a):.1f},{g.Y(b):.1f}" for a, b in (A13, B13, C13, D13))}" fill="{TR}22" stroke="{TR}" stroke-width="3.5"/>')
g.pt(*A13, '<i>A</i> (−8, −3)', TX, 0, 18, 'middle').pt(*B13, '<i>B</i> (−6, 1)', TX, -10, -12, 'end').pt(*C13, '<i>C</i> (−1, 2)', TX, 0, -16, 'middle').pt(*D13, '<i>D</i> (−3, −2)', TX, 10, 14)
m = lambda P, Q: Fr(Q[1] - P[1], Q[0] - P[0])
assert m(A13, D13) == m(B13, C13) == Fr(1, 5) and m(D13, C13) == m(A13, B13) == 2
S(s, 'CONTOH 13', 'Penyelesaian masalah: jenis sisi empat',
  p('Diberi <i>A</i> (−8, −3), <i>B</i> (−6, 1), <i>C</i> (−1, 2), <i>D</i> (−3, −2) ialah bucu sebuah sisi empat. Tentukan jenis sisi empat tersebut.')
  + work([('Memahami masalah', ['Menentukan jenis sisi empat.']),
          ('Merancang strategi', [f'Menentukan kecerunan garis lurus <i>AD</i>, <i>BC</i>, <i>AB</i> dan <i>DC</i> dengan menggunakan rumus <i>m</i> = {MRUM}. Melukis sisi empat.']),
          ('Membuat kesimpulan', ['<i>m</i><sub>1</sub> = <i>m</i><sub>2</sub>, maka garis lurus <i>AD</i> selari dengan garis lurus <i>BC</i>.', '<i>m</i><sub>3</sub> = <i>m</i><sub>4</sub>, maka garis lurus <i>AB</i> selari dengan garis lurus <i>DC</i>.',
                                  'Dengan itu segi empat <i>ABCD</i> ialah segi empat selari.'])], s, 1, 17),
  SV(g.svg(), 'Sisi empat ABCD pada satah Cartes'))

S(s, 'CONTOH 13 (sambungan)', 'Melaksanakan strategi',
  work([('Kecerunan garis <i>AD</i>', [f'<i>m</i><sub>1</sub> = {MRUM}', f'= {fr("−2 − (−3)", "−3 − (−8)")}', f'= {fr(1, 5)}']),
        ('Kecerunan garis <i>DC</i>', [f'<i>m</i><sub>3</sub> = {MRUM}', f'= {fr("2 − (−2)", "−1 − (−3)")}', f'= {fr(4, 2)} = 2']),
        ('Kecerunan garis <i>BC</i>', [f'<i>m</i><sub>2</sub> = {MRUM}', f'= {fr("2 − 1", "−1 − (−6)")}', f'= {fr(1, 5)}']),
        ('Kecerunan garis <i>AB</i>', [f'<i>m</i><sub>4</sub> = {MRUM}', f'= {fr("1 − (−3)", "−6 − (−8)")}', f'= {fr(4, 2)} = 2'])], s, 2, 19),
  SV(g.svg(), 'Sisi empat ABCD'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'gradien', 'slides.js')
HEAD = '/* Nota Bab 10 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
