"""Bab 6 T5 Nisbah dan Graf Fungsi Trigonometri. Nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan rajah ditukar;
semua nilai trigonometri disemak dengan math). CONTOH 1–11 ikut buku. SUBS folder trigograf dikekalkan (6.1, 6.2)."""
import os, sys, math
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "6.1", "name": "Nilai Sinus, Kosinus dan Tangen bagi Sudut θ, 0° ≤ θ ≤ 360°", "col": "#38BDF8"}, {"no": "6.2", "name": "Graf Fungsi Sinus, Kosinus dan Tangen", "col": "#F472B6"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr
T_, L_ = GF.T, GF.L
d2r = math.radians


def SVh(inner, aria, h, y0=0):
    return f'<svg class="sl-svg" viewBox="0 {y0} 500 {h:.0f}" role="img" aria-label="{aria}">{inner}</svg>'


def f1(v):
    return f'{v:.1f}'


def sn(d):
    return math.sin(d2r(d))


def ks(d):
    return math.cos(d2r(d))


def tn(d):
    return math.tan(d2r(d))


def r4(v):
    s_ = f'{v:.4f}'
    return s_.replace('-', '−')


def parc(cx, cy, r, a1, a2, col, w=2.5):
    """lengkok tanpa anak panah, a1 → a2 lawan arah jam (darjah matematik)."""
    x1, y1 = cx + r * math.cos(d2r(a1)), cy - r * math.sin(d2r(a1))
    x2, y2 = cx + r * math.cos(d2r(a2)), cy - r * math.sin(d2r(a2))
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f'<path d="M{f1(x1)} {f1(y1)} A{r} {r} 0 {large} 0 {f1(x2)} {f1(y2)}" fill="none" stroke="{col}" stroke-width="{w}"/>'


def ang_arc(cx, cy, r, th, col=AM):
    x1, y1 = cx + r, cy
    x2, y2 = cx + r * ks(th), cy - r * sn(th)
    large = 1 if th > 180 else 0
    return f'<path d="M{f1(x1)} {f1(y1)} A{r} {r} 0 {large} 0 {f1(x2)} {f1(y2)}" fill="none" stroke="{col}" stroke-width="2.5"/>'


def unit2(cx, cy, R, th, col=TR, alpha=True, pt='', fs=15, lab=''):
    s = f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{MU}" stroke-width="2"/>'
    s += GF.arrow((cx - R - 16, cy), (cx + R + 20, cy), GF.AX, 2) + GF.arrow((cx, cy + R + 16), (cx, cy - R - 20), GF.AX, 2)
    s += T_(cx + R + 28, cy, '<i>x</i>', GF.AX, 14) + T_(cx, cy - R - 30, '<i>y</i>', GF.AX, 14) + T_(cx - 9, cy + 12, 'O', MU, 12)
    px, py = cx + R * ks(th), cy - R * sn(th)
    s += L_((cx, cy), (px, py), col, 3) + f'<circle cx="{f1(px)}" cy="{f1(py)}" r="5" fill="{col}"/>'
    s += ang_arc(cx, cy, 18, th)
    s += T_(cx + 34 * ks(th / 2) + (8 if th > 180 else 0), cy - 30 * sn(th / 2) - (14 if th > 180 else 0), lab or f'{th:g}°', AM, fs)
    q = int(th // 90)
    if alpha and th % 90 and q:
        a0, a1 = {1: (th, 180), 2: (180, th), 3: (th, 360)}[q]
        s += parc(cx, cy, 36, a0, a1, GR) + T_(cx + 54 * ks((a0 + a1) / 2), cy - 54 * sn((a0 + a1) / 2), 'α', GR, fs)
    if pt:
        s += T_(px + (10 if ks(th) >= 0 else -10), py + (-14 if sn(th) >= 0 else 16), pt, col, 13, 'start' if ks(th) >= 0 else 'end')
    return s


# =====================================================================
# 6.1 NILAI SINUS, KOSINUS DAN TANGEN
# =====================================================================
s = '6.1'
c = COL[s]
cx, cy, R = 250, 200, 140
fu = f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{TR}14" stroke="{TR}" stroke-width="2.5"/>' + GF.arrow((cx - R - 30, cy), (cx + R + 30, cy), GF.AX, 2) + GF.arrow((cx, cy + R + 30), (cx, cy - R - 30), GF.AX, 2)
fu += T_(cx + R + 40, cy, '<i>x</i>', GF.AX, 16) + T_(cx, cy - R - 42, '<i>y</i>', GF.AX, 16) + T_(cx + R + 8, cy + 16, '1', MU, 14) + T_(cx - R - 12, cy + 16, '−1', MU, 14) + T_(cx + 12, cy - R - 10, '1', MU, 14, 'start') + T_(cx + 12, cy + R + 10, '−1', MU, 14, 'start')
for (qx, qy), t in zip([(1, -1), (-1, -1), (-1, 1), (1, 1)], ['Sukuan I', 'Sukuan II', 'Sukuan III', 'Sukuan IV']):
    fu += T_(cx + qx * 70, cy + qy * 60, t, AM, 15)
fu += L_((cx, cy), (cx + R * ks(130), cy - R * sn(130)), PK, 3) + f'<circle cx="{f1(cx + R * ks(130))}" cy="{f1(cy - R * sn(130))}" r="6" fill="{PK}"/>' + T_(cx + R * ks(130) - 14, cy - R * sn(130) - 14, 'P', PK, 16) + ang_arc(cx, cy, 26, 130, AM) + T_(cx + 18, cy - 40, 'θ', AM, 16)
S(s, 'KONSEP', 'Bulatan unit dan sukuan',
  p('<b>Bulatan unit</b> ialah bulatan yang berjejari 1 unit dan berpusat di asalan. Paksi-<i>x</i> dan paksi-<i>y</i> membahagikan bulatan unit kepada 4 sukuan yang sama, iaitu sukuan I, II, III dan IV.')
  + p('Diberi P ialah satu titik yang bergerak di sepanjang lilitan bulatan unit dan θ ialah sudut yang dibentuk oleh jejari OP dari paksi-<i>x</i> yang positif mengikut arah lawan jam. Titik P berada dalam')
  + table(['Sukuan', 'Julat θ'], [['I', '0° &lt; θ &lt; 90°'], ['II', '90° &lt; θ &lt; 180°'], ['III', '180° &lt; θ &lt; 270°'], ['IV', '270° &lt; θ &lt; 360°']], c, 16),
  SVh(fu, 'Bulatan unit dengan empat sukuan', 400, 0))

fa = ''
for k, (th, lab) in enumerate([(140, 'II'), (220, 'III'), (320, 'IV')]):
    fa += unit2(90 + 160 * k, 120, 60, th, fs=13)
S(s, 'KONSEP', 'Sudut rujukan sepadan',
  p('Sudut rujukan sepadan, α, sentiasa kurang daripada 90°. Sudut rujukan dalam sukuan II, III dan IV ialah sudut dalam sukuan I yang sepadan dengannya.')
  + table(['Sukuan', 'α', 'sin θ', 'kos θ', 'tan θ'], [['II', '180° − θ', '+ sin α', '− kos α', '− tan α'], ['III', 'θ − 180°', '− sin α', '− kos α', '+ tan α'], ['IV', '360° − θ', '− sin α', '+ kos α', '− tan α']], c, 16)
  + note('Sukuan I: semua positif; sukuan II: sin θ positif; sukuan III: tan θ positif; sukuan IV: kos θ positif.', 'Tip mengingat:'),
  SVh(fa, 'Sudut rujukan dalam sukuan II, III dan IV', 220, 20))

q1 = [(143, 'II', '180° − 143° = 37°', 37), (226, 'III', '226° − 180° = 46°', 46), (307, 'IV', '360° − 307° = 53°', 53)]
for th, _, _, a in q1:
    assert a == {1: 180 - th, 2: th - 180, 3: 360 - th}[th // 90]
fb = ''.join(unit2(90 + 160 * k, 110, 60, th, fs=13) for k, (th, *_r) in enumerate(q1))
S(s, 'CONTOH 1 – 2', 'Sukuan dan sudut rujukan sepadan',
  work([('CONTOH 1', ['Tentukan sukuan dan sudut rujukan sepadan bagi (a) 143°, (b) 226°, (c) 307°.'] + [f'({"abc"[k]}) {th}° terletak dalam sukuan {qq}. α = {t}' for k, (th, qq, t, _) in enumerate(q1)])], s, 1, 16)
  + note('Sudut rujukan sepadan ialah sudut tirus.', 'Ingat:'),
  stack(SVh(fb, 'Sudut 143°, 226° dan 307°', 200, 20),
        work([('CONTOH 2', ['Nyatakan hubungan fungsi trigonometri dengan sudut rujukan sepadan.', '(a) 158° dalam sukuan II: sin 158° = sin (180° − 158°) = sin 22°', '(b) 244° dalam sukuan III: kos 244° = − kos (244° − 180°) = − kos 64°',
                                '(c) 341° dalam sukuan IV: tan 341° = − tan (360° − 341°) = − tan 19°'])], s, 1, 15)))
assert math.isclose(sn(158), sn(22)) and math.isclose(ks(244), -ks(64)) and math.isclose(tn(341), -tn(19))

pa, pb = (round(ks(57), 4), round(sn(57), 4)), (round(ks(236), 4), round(sn(236), 4))
assert pa == (0.5446, 0.8387) and pb == (-0.5592, -0.829)
ta, tb = pa[1] / pa[0], pb[1] / pb[0]
assert f'{ta:.4f}' == '1.5400' and f'{tb:.4f}' == '1.4825'
fc = unit2(120, 140, 85, 57, pt='(0.5446, 0.8387)', fs=13, alpha=False) + unit2(370, 140, 85, 236, pt='(−0.5592, −0.8290)', fs=13, alpha=False, col=PK) + T_(40, 30, '(a)', MU, 15) + T_(290, 30, '(b)', MU, 15)
S(s, 'CONTOH 3', 'Sinus, kosinus dan tangen dalam bulatan unit',
  p('Bagi titik (<i>x</i>, <i>y</i>) pada bulatan unit dengan sudut θ,')
  + formula(f'sin θ = koordinat-<i>y</i> &nbsp; kos θ = koordinat-<i>x</i> &nbsp; tan θ = {F("koordinat-<i>y</i>", "koordinat-<i>x</i>")}', c)
  + p('<b>CONTOH 3</b> Setiap rajah menunjukkan satu bulatan unit dengan sudut θ. Tentukan nilai sin θ, kos θ dan tan θ.')
  + work([('(a)', ['sin θ = 0.8387, kos θ = 0.5446', f'tan θ = {F("0.8387", "0.5446")} = 1.5400']), ('(b)', ['sin θ = −0.8290, kos θ = −0.5592', f'tan θ = {F("−0.8290", "−0.5592")} = 1.4825'])], s, 2, 16),
  SVh(fc, 'Dua bulatan unit dengan titik koordinat', 260, 10))

v4a, v4b = sn(76), -ks(35.4)
t4 = 318 + 25 / 60
a4 = 360 - t4
v4c = -tn(a4)
assert math.isclose(sn(104), v4a) and math.isclose(ks(215.4), v4b) and math.isclose(tn(t4), v4c)
assert (f'{v4a:.4f}', f'{v4b:.4f}', f'{v4c:.4f}') == ('0.9703', '-0.8151', '-0.8873')
S(s, 'CONTOH 4', 'Nilai sinus, kosinus dan tangen berdasarkan sudut rujukan',
  steps(s, ['Tentukan sudut rujukan sepadan.', 'Tentukan tanda positif atau negatif bagi sinus, kosinus dan tangen bagi sudut dalam sukuan II, III dan IV.'])
  + p('<b>CONTOH 4</b> Tentukan nilai bagi setiap berikut berdasarkan sudut rujukan sepadan masing-masing. (a) sin 104° (b) kos 215.4° (c) tan 318°25′')
  + note('Pastikan kalkulator saintifik anda adalah dalam mod “Deg”.', 'Ingat:'),
  work([('(a)', ['sin 104° = + sin (180° − 104°)', '= + sin 76° = 0.9703', '(nilai sinus adalah positif dalam sukuan II)']), ('(b)', ['kos 215.4° = − kos (215.4° − 180°)', '= − kos 35.4° = −0.8151', '(nilai kosinus adalah negatif dalam sukuan III)']),
        ('(c)', ['tan 318°25′ = − tan (360° − 318°25′)', '= − tan 41°35′ = −0.8873', '(nilai tangen adalah negatif dalam sukuan IV)'])], s, 1, 17))

S(s, 'CONTOH 5', 'Sudut 30°, 45° dan 60°',
  table(['Nisbah', '30°', '45°', '60°'], [['sin θ', F('1', '2'), F('1', sq('2')), F(sq('3'), '2')], ['kos θ', F(sq('3'), '2'), F('1', sq('2')), F('1', '2')], ['tan θ', F('1', sq('3')), '1', sq('3')]], c, 19)
  + p('<b>CONTOH 5</b> Tanpa menggunakan kalkulator saintifik, tentukan nilai bagi setiap berikut berdasarkan sudut rujukan sepadan. (a) sin 120° (b) kos 225° (c) tan 330°'),
  work([('(a)', [f'sin 120° = + sin (180° − 120°) = sin 60° = {F(sq("3"), "2")}', '(nilai sinus adalah positif dalam sukuan II)']), ('(b)', [f'kos 225° = − kos (225° − 180°) = − kos 45° = −{F("1", sq("2"))}', '(nilai kosinus adalah negatif dalam sukuan III)']),
        ('(c)', [f'tan 330° = − tan (360° − 330°) = − tan 30° = −{F("1", sq("3"))}', '(nilai tangen adalah negatif dalam sukuan IV)'])], s, 1, 18))
assert math.isclose(sn(120), math.sqrt(3) / 2) and math.isclose(ks(225), -1 / math.sqrt(2)) and math.isclose(tn(330), -1 / math.sqrt(3))

a6 = [round(math.degrees(math.asin(0.4695))), round(math.degrees(math.acos(0.5878))), round(math.degrees(math.atan(2.1445)))]
assert a6 == [28, 54, 65]
for th in (28, 152):
    assert f'{sn(th):.4f}' == '0.4695'
for th in (126, 234):
    assert f'{ks(th):.4f}' == '-0.5878'
for th in (115, 295):
    assert f'{tn(th):.4f}' == '-2.1445'
S(s, 'CONTOH 6', 'Menentukan sudut apabila nilai fungsi diberi',
  steps(s, ['Kenal pasti sukuan berdasarkan tanda positif atau negatif pada nilai fungsi trigonometri.', 'Tentukan sudut rujukan sepadan.', 'Hitung sudut θ berdasarkan sukuan yang dikenal pasti.'])
  + p('<b>CONTOH 6</b> Diberi 0° ≤ θ ≤ 360°, hitung sudut θ jika (a) sin θ = 0.4695, (b) kos θ = −0.5878, (c) tan θ = −2.1445.'),
  work([('(a)', ['Tanda positif. θ berada dalam sukuan I atau II.', 'Sudut rujukan = sin⁻¹ 0.4695 = 28°', 'θ = 28° atau (180° − 28°) = 28° atau 152°']),
        ('(b)', ['Tanda negatif. θ berada dalam sukuan II atau III.', 'Sudut rujukan = kos⁻¹ 0.5878 = 54°', 'θ = (180° − 54°) atau (180° + 54°) = 126° atau 234°']),
        ('(c)', ['Tanda negatif. θ berada dalam sukuan II atau IV.', 'Sudut rujukan = tan⁻¹ 2.1445 = 65°', 'θ = (180° − 65°) atau (360° − 65°) = 115° atau 295°'])], s, 1, 16))

Qp, Rp, Sp = (110, 330), (210, 330), (310, 330)
Pp = (110, 330 - 100 * 12 / 5)
assert 5 ** 2 + 12 ** 2 == 13 ** 2
f7 = f'<polygon points="{Qp[0]},{Qp[1]} {Rp[0]},{Rp[1]} {f1(Pp[0])},{f1(Pp[1])}" fill="{TR}22" stroke="{TR}" stroke-width="3"/>' + L_(Rp, Sp, TR, 3)
f7 += f'<path d="M{Qp[0]} {Qp[1] - 12} h12 v12" fill="none" stroke="{MU3}" stroke-width="2"/>'
aPR = math.degrees(math.atan2(-(Rp[1] - Pp[1]), Rp[0] - Pp[0]))
f7 += parc(Pp[0], Pp[1], 26, -90, aPR, AM) if False else ''
# sudut x: refleks di P, dari PR (arah ke R) lawan arah jam hingga PQ (arah ke bawah) → lengkok besar
f7 += f'<path d="M{f1(Pp[0] + 26 * math.cos(d2r(-aPR)))} {f1(Pp[1] + 26 * math.sin(d2r(-aPR)))} A26 26 0 1 0 {Pp[0]} {f1(Pp[1] + 26)}" fill="none" stroke="{AM}" stroke-width="2.5"/>'
f7 += T_(Pp[0] - 36, Pp[1] - 18, '<i>x</i>', AM, 18)
aRP = 180 - math.degrees(math.atan(12 / 5))
f7 += parc(Rp[0], Rp[1], 28, 0, aRP, PK) + T_(Rp[0] + 34, Rp[1] - 34, '<i>y</i>', PK, 18)
f7 += T_(Qp[0] - 14, Qp[1] + 14, 'Q', TX, 17) + T_(Rp[0], Rp[1] + 20, 'R', TX, 17) + T_(Sp[0] + 12, Sp[1] + 14, 'S', TX, 17) + T_(Pp[0] - 14, Pp[1] - 6, 'P', TX, 17)
f7 += T_(Qp[0] - 30, (Qp[1] + Pp[1]) / 2, '12 cm', MU3, 15)
S(s, 'CONTOH 7', 'Menyelesaikan masalah sinus, kosinus dan tangen',
  p('Dalam rajah, QRS ialah garis lurus. Diberi QS = 10 cm, QR = RS dan PQ = 12 cm, hitung (a) kos <i>x</i>, (b) tan <i>y</i>.')
  + work([('Penyelesaian', ['QR = 10 cm ÷ 2 = 5 cm dan PR = ' + sq('12² + 5²') + ' = 13 cm', '(a) 270° &lt; <i>x</i> &lt; 360°, maka sudut <i>x</i> berada dalam sukuan IV. ∠QPR ialah sudut rujukan sepadan bagi sudut <i>x</i>.',
                                          f'kos <i>x</i> = + kos ∠QPR = {F("12", "13")}', '(b) 90° &lt; <i>y</i> &lt; 180°, maka sudut <i>y</i> berada dalam sukuan II. ∠PRQ ialah sudut rujukan sepadan bagi sudut <i>y</i>.', f'tan <i>y</i> = − tan ∠PRQ = −{F("12", "5")}'])], s, 1, 16),
  SVh(f7, 'Segi tiga PQR dengan sudut x dan y', 300, 55))

th8 = 180 - round(math.degrees(math.acos(0.866)))
QR8, OR8 = 20 * sn(30), 20 * ks(30)
PQ8 = math.hypot(QR8, OR8 + 20)
assert th8 == 150 and math.isclose(QR8, 10) and f'{OR8:.2f}' == '17.32' and f'{PQ8:.2f}' == '38.64'
O8 = (300, 260); sc8 = 6
P8 = (O8[0] + 20 * sc8, O8[1]); Q8 = (O8[0] + 20 * sc8 * ks(150), O8[1] - 20 * sc8 * sn(150)); R8 = (Q8[0], O8[1])
f8 = L_(O8, P8, TR, 4) + L_(O8, Q8, TR, 4) + L_(Q8, R8, MU3, 2, '6 4') + L_(R8, O8, MU3, 2, '6 4') + L_(Q8, P8, PK, 2.5, '8 5') + ang_arc(O8[0], O8[1], 24, 150)
f8 += T_(O8[0] + 4, O8[1] - 40, 'θ', AM, 17) + T_(P8[0] + 12, P8[1] + 14, 'P', TX, 17) + T_(Q8[0] - 12, Q8[1] - 12, 'Q', TX, 17) + T_(R8[0] - 4, R8[1] + 18, 'R', TX, 17) + T_(O8[0], O8[1] + 18, 'O', TX, 17)
f8 += T_((O8[0] + P8[0]) / 2, O8[1] + 18, '20 cm', MU3, 14) + T_((O8[0] + Q8[0]) / 2 + 18, (O8[1] + Q8[1]) / 2 - 10, '20 cm', MU3, 14)
S(s, 'CONTOH 8', 'Lengan robotik',
  p('Sekumpulan murid menghasilkan sebuah lengan robotik dengan panjang 20 cm. Lengan robotik itu diprogramkan untuk memindahkan satu objek dari titik P ke titik Q. Diberi bahawa kos θ = −0.866 dan 0° ≤ θ ≤ 180°, hitung sudut θ dan jarak, dalam cm, di antara titik P dengan titik Q.')
  + SVh(f8, 'Lengan robotik OP dan OQ', 190, 170),
  work([('Penyelesaian', ['kos θ = −0.866. Tanda negatif, θ berada dalam sukuan II (0° ≤ θ ≤ 180°).', 'Sudut rujukan sepadan = kos⁻¹ 0.866 = 30°', 'θ = 180° − 30° = 150°',
                          f'sin 30° = {F("QR", "20")} → QR = 20 sin 30° = 10 cm', f'kos 30° = {F("OR", "20")} → OR = 20 kos 30° = 17.32 cm', f'PQ = {sq("QR² + PR²")} = {sq("10² + 37.32²")} = 38.64 cm'])], s, 1, 17))

# =====================================================================
# 6.2 GRAF FUNGSI
# =====================================================================
s = '6.2'
c = COL[s]


def tg(bx, yr, fns, ys=1, xlab=True, fs=12, xmax=360, xs=90):
    g = GF.Gr(bx, (0, xmax), yr, xs=xs, ys=ys, fs=fs, skipx=tuple(range(0, xmax + 1, xs)))
    for v in range(xs, xmax + 1, xs):
        g.add(T_(g.X(v), g.Y(0) + 15 if yr[0] < 0 else g.B + 15, f'{v}°', MU, fs, 'middle', 600))
    for fn, col in fns:
        g.curve(fn, 0, xmax, col, 3, 600)
    return g


def tsvg(g, aria, extra=''):
    return f'<svg class="sl-svg" viewBox="0 {f1(g.T_ - 34)} 500 {f1(g.B - g.T_ + 60)}" role="img" aria-label="{aria}">{g.svg()}{extra}</svg>'


gs = tg((50, 30, 440, 170), (-1.3, 1.3), [(sn, TR)])
gk = tg((50, 240, 440, 380), (-1.3, 1.3), [(ks, PK)])
S(s, 'KONSEP', 'Graf sinus dan graf kosinus',
  work([('Graf sinus, <i>y</i> = sin <i>x</i>', ['Nilai maksimum 1 apabila <i>x</i> = 90° dan nilai minimum −1 apabila <i>x</i> = 270°', 'Memintas paksi-<i>x</i> pada <i>x</i> = 0°, 180° dan 360°', 'Memintas paksi-<i>y</i> pada <i>y</i> = 0']),
        ('Graf kosinus, <i>y</i> = kos <i>x</i>', ['Nilai maksimum 1 apabila <i>x</i> = 0° dan 360° dan nilai minimum −1 apabila <i>x</i> = 180°', 'Memintas paksi-<i>x</i> pada <i>x</i> = 90° dan 270°', 'Memintas paksi-<i>y</i> pada <i>y</i> = 1'])], s, 1, 17),
  f'<svg class="sl-svg" viewBox="0 0 500 410" role="img" aria-label="Graf y = sin x dan y = kos x">{gs.svg()}{gk.svg()}{T_(400, 40, "<i>y</i> = sin <i>x</i>", TR, 15)}{T_(400, 250, "<i>y</i> = kos <i>x</i>", PK, 15)}</svg>')


def tanf(x):
    if abs((x % 180) - 90) < 0.6:
        return None
    return tn(x)


gt = tg((50, 30, 440, 330), (-3, 3), [(tanf, GR)], ys=1)
for a in (90, 270):
    gt.seg((a, -3), (a, 3), MU, 1.5, '6 5')
S(s, 'KONSEP', 'Graf tangen',
  work([('Graf tangen, <i>y</i> = tan <i>x</i>', ['Nilai maksimum ialah ∞ dan nilai minimum ialah −∞', 'Memintas paksi-<i>x</i> pada <i>x</i> = 0°, 180° dan 360°', 'Memintas paksi-<i>y</i> pada <i>y</i> = 0', 'Nilai tan 90° dan tan 270° tidak tertakrif'])], s, 1, 18)
  + table(['Graf', 'Maksimum', 'Minimum', 'Pintasan-<i>x</i>', 'Pintasan-<i>y</i>'], [['sin <i>x</i>', '1', '−1', '0°, 180°, 360°', '0'], ['kos <i>x</i>', '1', '−1', '90°, 270°', '1'], ['tan <i>x</i>', '∞', '−∞', '0°, 180°, 360°', '0']], c, 15),
  tsvg(gt, 'Graf y = tan x', T_(150, 60, '<i>y</i> = tan <i>x</i>', GR, 15)))

S(s, 'KONSEP', 'Kesan perubahan pemalar <i>a</i>, <i>b</i> dan <i>c</i>',
  p('<b>Tempoh</b> ialah selang satu kitaran lengkap. Fungsi trigonometri ialah fungsi berkala; misalnya <i>y</i> = sin <i>x</i> ialah fungsi berkala dengan tempoh 360°. <b>Amplitud</b> ialah jarak maksimum yang diukur dari garis keseimbangan.')
  + formula(f'Amplitud = {F("nilai maksimum − nilai minimum", "2")}', c)
  + p('Nilai <i>a</i> mempengaruhi amplitud fungsi, nilai <i>b</i> mempengaruhi tempoh fungsi dan nilai <i>c</i> mempengaruhi kedudukan graf fungsi.'),
  stack(table(['', '<i>y</i> = <i>a</i> sin <i>bx</i> + <i>c</i>, <i>y</i> = <i>a</i> kos <i>bx</i> + <i>c</i>', '<i>y</i> = <i>a</i> tan <i>bx</i> + <i>c</i>'],
        [['<i>a</i> berubah', 'Nilai maksimum dan minimum berubah; amplitud = <i>a</i>', 'Lengkung graf berubah; tiada amplitud'], ['<i>b</i> berubah', f'Tempoh = {F("360°", "<i>b</i>")}', f'Tempoh = {F("180°", "<i>b</i>")}'],
         ['<i>c</i> berubah', '<i>c</i> &gt; 0: graf beranjak <i>c</i> unit ke atas; <i>c</i> &lt; 0: graf beranjak ke bawah', 'Sama seperti sinus dan kosinus']], c, 14, False),
  note('Apabila nilai <i>b</i> bertambah, graf kelihatan mampat secara mengufuk dan tempoh fungsi semakin berkurang.', 'Ingat:')))

base = lambda x: sn(x)
gA = tg((40, 30, 230, 140), (-3.3, 3.3), [(base, MU), (lambda x: 3 * sn(x), TR)], ys=3, fs=10)
gB = tg((290, 30, 480, 140), (-1.3, 1.3), [(base, MU), (lambda x: sn(3 * x), PK)], ys=1, fs=10)
gC = tg((40, 220, 230, 330), (-2.3, 1.3), [(base, MU), (lambda x: sn(x) - 1, GR)], ys=1, fs=10)
gD = tg((290, 220, 480, 330), (-2.3, 2.3), [(base, MU), (lambda x: 2 * sn(3 * x), AM)], ys=2, fs=10)
f9 = gA.svg() + gB.svg() + gC.svg() + gD.svg() + T_(60, 10, '(a) <i>y</i> = 3 sin <i>x</i>', TR, 13, 'start') + T_(310, 10, '(b) <i>y</i> = sin 3<i>x</i>', PK, 13, 'start') + T_(60, 200, '(c) <i>y</i> = sin <i>x</i> − 1', GR, 13, 'start') + T_(310, 200, '(d) <i>y</i> = 2 sin 3<i>x</i>', AM, 13, 'start')
S(s, 'CONTOH 9', 'Melakar graf <i>y</i> = <i>a</i> sin <i>bx</i> + <i>c</i>',
  p('Graf fungsi <i>y</i> = sin <i>x</i> (kelabu) bagi 0° ≤ <i>x</i> ≤ 360° diberi. Lakar setiap fungsi trigonometri berikut pada paksi yang sama.')
  + work([('(a) <i>y</i> = 3 sin <i>x</i>', ['<i>a</i> = 3, amplitud menjadi 3; tempoh = 360°']), ('(b) <i>y</i> = sin 3<i>x</i>', [f'<i>b</i> = 3, tempoh menjadi {F("360°", "3")} = 120°; amplitud = 1']),
          ('(c) <i>y</i> = sin <i>x</i> − 1', ['<i>c</i> = −1, graf beranjak 1 unit ke bawah']), ('(d) <i>y</i> = 2 sin 3<i>x</i>', ['Amplitud = 2; tempoh = 120°'])], s, 1, 16),
  SVh(f9, 'Empat graf sinus', 360, -10))

g10a = tg((50, 30, 440, 170), (-2.3, 4.3), [(lambda x: 3 * ks(x) + 1, PK)], ys=2, fs=11)
g10a.seg((0, 1), (360, 1), MU, 1.5, '6 5')


def tan_half(x):
    if abs(x - 180) < 1.2:
        return None
    return tn(x / 2) + 1


g10b = tg((50, 250, 440, 400), (-3, 5), [(tan_half, GR)], ys=2, fs=11)
g10b.seg((180, -3), (180, 5), MU, 1.5, '6 5')
assert 3 * ks(0) + 1 == 4 and math.isclose(3 * ks(180) + 1, -2)
S(s, 'CONTOH 10', 'Melakar graf kosinus dan tangen',
  p('Lakar setiap fungsi trigonometri berikut bagi 0° ≤ <i>x</i> ≤ 360°. (a) <i>y</i> = 3 kos <i>x</i> + 1 (b) <i>y</i> = tan 0.5<i>x</i> + 1')
  + work([('(a)', ['<i>a</i> = 3, amplitud fungsi ialah 3', '<i>b</i> = 1, tempoh fungsi ialah 360°', '<i>c</i> = +1, graf beranjak 1 unit ke atas', 'Nilai maksimum = 3 + 1 = 4; nilai minimum = −3 + 1 = −2']),
          ('(b)', ['Graf tangen tidak mempunyai amplitud', f'<i>b</i> = 0.5, tempoh fungsi ialah {F("180°", "0.5")} = 360°', '<i>c</i> = +1, graf beranjak 1 unit ke atas'])], s, 1, 16),
  f'<svg class="sl-svg" viewBox="0 0 500 430" role="img" aria-label="Graf y = 3 kos x + 1 dan y = tan 0.5x + 1">{g10a.svg()}{g10b.svg()}{T_(330, 40, "(a) <i>y</i> = 3 kos <i>x</i> + 1", PK, 14)}{T_(110, 262, "(b)", GR, 14)}</svg>')

b11 = 360 / 6
y7 = 0.5 * sn(b11 * 7)
assert b11 == 60 and f'{y7:.2f}' == '0.43'
g11 = GF.Gr((60, 30, 450, 200), (0, 12), (-0.7, 0.7), xs=1, ys=0.5, fs=12, xl='Masa (saat)', yl='Halaju (l/s)')
g11.curve(lambda x: 0.5 * sn(60 * x), 0, 6, PK, 3.5, 300)
g11.curve(lambda x: 0.5 * sn(60 * x), 6, 12, PK, 2, 300)
g11.text(1.5, 0.62, 'Menarik nafas', GR, 13); g11.text(4.5, -0.62, 'Menghembus nafas', AM, 13)
S(s, 'CONTOH 11', 'Menyelesaikan masalah graf fungsi trigonometri',
  p('Graf menunjukkan halaju aliran udara (liter per saat) dalam kitaran pernafasan seorang atlet semasa berehat. Satu kitaran lengkap berlaku setiap 6 saat. Halaju positif apabila menarik nafas dan negatif apabila menghembus nafas.')
  + p('(a) Jika <i>y</i> mewakili halaju aliran udara selepas <i>x</i> saat, nyatakan fungsi dalam bentuk <i>y</i> = <i>a</i> sin <i>bx</i> + <i>c</i>. (b) Hitung halaju aliran udara apabila masa ialah 7 saat.'),
  f'<svg class="sl-svg" viewBox="0 -10 500 260" role="img" aria-label="Graf halaju aliran udara">{g11.svg()}</svg>')

S(s, 'CONTOH 11 (sambungan)', 'Memodelkan kitaran pernafasan',
  work([('Penyelesaian', ['(a) Daripada graf, amplitud = 0.5, maka <i>a</i> = 0.5', f'Tempoh = 6 saat, maka {F("360°", "<i>b</i>")} = 6 → <i>b</i> = 60', 'Tiada anjakan ke atas atau ke bawah paksi-<i>x</i>, maka <i>c</i> = 0',
                          'Fungsi: <i>y</i> = 0.5 sin 60<i>x</i>', '(b) Apabila <i>x</i> = 7, <i>y</i> = 0.5 sin (60 × 7) = 0.5 sin 420° = 0.43', 'Maka, halaju aliran udara ialah 0.43 liter per saat pada masa 7 saat.'])], s, 1, 18),
  f'<svg class="sl-svg" viewBox="0 -10 500 260" role="img" aria-label="Graf halaju aliran udara">{g11.svg()}</svg>')

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'trigograf', 'slides.js')
HEAD = '/* Nota Bab 6 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
