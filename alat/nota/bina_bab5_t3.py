"""Bab 5 T3 Nisbah Trigonometri: nota ikut buku teks (ayat buku, nombor dan nama ditukar).
Subtopik folder trigonometri dikekalkan (5.1.1, 5.1.2, 5.1.4, 5.1.7) kerana bab.js dan soalan.js bergantung padanya
(dipaparkan sebagai satu subtopik 5.1 melalui BAB.gabung):
5.1.1 = buku SP 5.1.1, 5.1.2 = buku SP 5.1.2 + 5.1.3, 5.1.4 = buku SP 5.1.4 + 5.1.5 + 5.1.6, 5.1.7 = buku SP 5.1.7."""
import os, sys, math
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX, NAV

SUBS = [{"no": "5.1.1", "name": "Sisi Segi Tiga Bersudut Tegak", "col": "#FB923C"}, {"no": "5.1.2", "name": "Sinus, Kosinus dan Tangen", "col": "#A78BFA"},
        {"no": "5.1.4", "name": "Nilai dan Sudut Khas", "col": "#38BDF8"}, {"no": "5.1.7", "name": "Penyelesaian Masalah", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def i(s):
    return f'<i>{s}</i>'


def an(s):
    return f'∠{i(s)}'


def key(t):
    return f'<span style="display:inline-block;min-width:22px;text-align:center;padding:0 7px;margin:2px 2px;border:1.5px solid #64748B;border-radius:7px;font-size:16px;font-weight:700;line-height:1.6">{t}</span>'


def keys(seq, res):
    return '<span style="white-space:normal">' + ''.join(key(k) for k in seq.split()) + f' <b>= {res}</b></span>'


DMS = "°′″"


# ---------- pembantu rajah ----------
def tri(pts, col, labels=None, size=17, off=16, w=3.5, fill=True):
    o = '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{col + "2E" if fill else "none"}" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>'
    if labels:
        cx = sum(x for x, _ in pts) / len(pts); cy = sum(y for _, y in pts) / len(pts)
        for (x, y), lb in zip(pts, labels):
            if lb:
                dx, dy = x - cx, y - cy; d = math.hypot(dx, dy) or 1
                o += GF.T(x + dx / d * off, y + dy / d * off, lb, TX, size)
    return o


def rt(B, A, C, s=14, col=TX):
    """penanda sudut tegak di B (antara BA dan BC)."""
    ux, uy = (A[0] - B[0]), (A[1] - B[1]); d = math.hypot(ux, uy); ux, uy = ux / d * s, uy / d * s
    vx, vy = (C[0] - B[0]), (C[1] - B[1]); d = math.hypot(vx, vy); vx, vy = vx / d * s, vy / d * s
    return f'<path d="M{B[0] + ux:.1f} {B[1] + uy:.1f} L{B[0] + ux + vx:.1f} {B[1] + uy + vy:.1f} L{B[0] + vx:.1f} {B[1] + vy:.1f}" fill="none" stroke="{col}" stroke-width="2"/>'


def side(A, B, lb, col=TX, off=16, size=16, ref=None):
    """label sisi AB di luar (menjauhi titik ref)."""
    mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
    nx, ny = -(B[1] - A[1]), B[0] - A[0]; d = math.hypot(nx, ny); nx, ny = nx / d, ny / d
    if ref and (ref[0] - mx) * nx + (ref[1] - my) * ny > 0:
        nx, ny = -nx, -ny
    anc = 'middle' if abs(nx) < 0.5 else ('start' if nx > 0 else 'end')
    return GF.T(mx + nx * off, my + ny * off, lb, col, size, anc)


def ang(V, A, B, lb, col=AM, r=30, size=15, lr=None):
    """lengkok sudut di V antara VA dan VB + label."""
    a1 = math.atan2(A[1] - V[1], A[0] - V[0]); a2 = math.atan2(B[1] - V[1], B[0] - V[0])
    da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    p1 = (V[0] + r * math.cos(a1), V[1] + r * math.sin(a1)); p2 = (V[0] + r * math.cos(a1 + da), V[1] + r * math.sin(a1 + da))
    o = f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r} {r} 0 0 {1 if da > 0 else 0} {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="2.2"/>'
    am = a1 + da / 2; R = lr or r + 14
    return o + GF.T(V[0] + R * math.cos(am), V[1] + R * math.sin(am), lb, col, size)


def tick(A, B, n=1, col=TX):
    mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
    dx, dy = B[0] - A[0], B[1] - A[1]; d = math.hypot(dx, dy); ux, uy = dx / d, dy / d; nx, ny = -uy * 8, ux * 8
    return ''.join(GF.L((mx + ux * 5 * (k - (n - 1) / 2) - nx, my + uy * 5 * (k - (n - 1) / 2) - ny), (mx + ux * 5 * (k - (n - 1) / 2) + nx, my + uy * 5 * (k - (n - 1) / 2) + ny), col, 2) for k in range(n))


def surd(x, y, n, col=TX, size=16, anchor='start', tail=''):
    """teks surd dalam SVG dengan bar meliputi seluruh nombor."""
    cw = size * 0.6; wr = cw * 0.95; wn = cw * len(n); wt = cw * 0.55 * len(tail)
    tot = wr + wn + wt
    x0 = x if anchor == 'start' else (x - tot / 2 if anchor == 'middle' else x - tot)
    o = GF.T(x0, y, '√', col, size, 'start') + GF.T(x0 + wr, y, n, col, size, 'start')
    o += GF.L((x0 + wr - 1, y - size * 0.62), (x0 + wr + wn + 1, y - size * 0.62), col, 1.6)
    if tail:
        o += GF.T(x0 + wr + wn, y, tail, col, size, 'start')
    return o


def F(a, b):
    return fr(a, b)


# =====================================================================
# 5.1.1 SISI SEGI TIGA BERSUDUT TEGAK (buku SP 5.1.1)
# =====================================================================
s = '5.1.1'
c = COL[s]
o = GF.box(14, 14, 472, 442)
o += f'<rect x="300" y="70" width="90" height="330" fill="{TR}22" stroke="{TR}" stroke-width="3"/>'
for yy in range(95, 390, 30):
    o += f'<rect x="315" y="{yy}" width="20" height="14" fill="{TR}55"/><rect x="355" y="{yy}" width="20" height="14" fill="{TR}55"/>'
o += GF.L((60, 400), (300, 70), AM, 3, '8 6') + GF.L((40, 400), (450, 400), MU3, 3)
o += ang((60, 400), (300, 400), (300, 70), 'Sudut dongak', AM, 46, 15, 100)
o += GF.L((404, 70), (404, 400), PK, 2.5) + GF.head((404, 120), (404, 70), PK, 2.5) + GF.head((404, 350), (404, 400), PK, 2.5) + GF.T(420, 235, f'{i("t")}', PK, 20, 'start')
o += GF.L((60, 425), (300, 425), GR, 2.5) + GF.T(180, 442, f'Jarak, {i("s")}', GR, 16)
S(s, 'PENGENALAN', 'Nisbah trigonometri dalam kehidupan',
  p('Tahukah anda bagaimana ketinggian suatu objek yang sukar diukur seperti bangunan dan gunung dihitung?')
  + p(f'Misalnya dalam rajah di sebelah, jika jarak, {i("s")} dan sudut dongak diketahui maka, ketinggian, {i("t")} bangunan tersebut boleh dihitung dengan menggunakan konsep <b>trigonometri</b>.')
  + note('Trigonometri berasal dari bahasa Yunani iaitu, Trigonon = tiga sudut dan Metron = mengukur.', 'Buletin:'),
  SV(o, 'Bangunan dengan tinggi t, jarak s dan sudut dongak'))


fig12 = ''
for x0, w in [(0, 1), (250, 2)]:
    P, Q, R = (x0 + 105, 70), (x0 + 105, 320), (x0 + 215, 320)
    g = tri([P, Q, R], c, ['P', 'Q', 'R'], 17, 16) + rt(Q, P, R)
    if w == 1:
        g += ang(R, Q, P, '', AM, 30) + GF.T(x0 + 95, 186, 'sisi', PK, 14, 'end') + GF.T(x0 + 95, 204, 'bertentangan', PK, 14, 'end') + GF.T(x0 + 160, 345, 'sisi bersebelahan', GR, 14)
    else:
        g += ang(P, Q, R, '', AM, 30) + GF.T(x0 + 95, 186, 'sisi', GR, 14, 'end') + GF.T(x0 + 95, 204, 'bersebelahan', GR, 14, 'end') + GF.T(x0 + 160, 345, 'sisi bertentangan', PK, 14)
    g += GF.T(x0 + 168, 186, 'hipotenus', TR, 14, 'start') + GF.T(x0 + 160, 390, f'Rajah {w}', MU3, 16)
    fig12 += g
S(s, 'KONSEP', 'Sisi bertentangan, sisi bersebelahan dan hipotenus',
  p(f'Sisi {i("PR")} dikenali sebagai <b>hipotenus</b>, iaitu sisi terpanjang dalam segi tiga bersudut tegak {i("PQR")}.')
  + bul(s, [f'Berdasarkan {an("PRQ")} dalam Rajah 1, sisi {i("QR")} dikenali sebagai <b>sisi bersebelahan</b> manakala sisi {i("PQ")} dikenali sebagai <b>sisi bertentangan</b>.',
            f'Berdasarkan {an("QPR")} dalam Rajah 2, sisi {i("PQ")} ialah sisi bersebelahan dan sisi {i("QR")} ialah sisi bertentangan.']),
  SV(fig12, 'Rajah 1 dan Rajah 2: segi tiga PQR dengan nama sisi berdasarkan sudut di R dan sudut di P'))
P, Q, R = (110, 70), (110, 380), (400, 380)
o = tri([P, Q, R], c, ['P', 'Q', 'R'], 18, 18) + rt(Q, P, R) + ang(P, Q, R, i('y'), AM, 40) + ang(R, Q, P, i('x'), AM, 50)
o += GF.T(255, 425, f'{i("x")} + {i("y")} = 90°', AM, 19) + GF.T(275, 205, 'hipotenus', TR, 16, 'start')
S(s, 'DEFINISI', 'Hipotenus dan sudut tirus',
  p(f'Perhatikan juga dalam kedua-dua Rajah 1 dan Rajah 2 hipotenus {i("PR")} adalah tetap kedudukannya iaitu bertentangan dengan sudut 90°.')
  + de(s, 'Bagi suatu segi tiga bersudut tegak;<br>(a) hipotenus ialah sisi terpanjang yang bertentangan dengan sudut 90°.<br>(b) sisi bersebelahan dan sisi bertentangan berubah mengikut kedudukan sudut tirus yang dirujuk.')
  + note(f'Sudut tirus: 0° &lt; θ &lt; 90°. {an("x")} dan {an("y")} ialah sudut tirus, dan {i("x")} + {i("y")} = 90°.', 'Tip:'),
  SV(o, 'Segi tiga bersudut tegak PQR dengan dua sudut tirus x dan y'))

# Contoh 1
A, B, C_ = (60, 220), (60, 60), (230, 60)
o = tri([B, C_, A], PA, ['B', 'C', 'A'], 16, 15) + rt(B, A, C_) + GF.T(30, 34, '(a)', MU3, 15)
L_ = (360, 210); K = (L_[0] - 80, L_[1] - 110); M = (L_[0] + 0.85 * 110, L_[1] - 0.85 * 80)
o += tri([K, L_, M], PU, ['K', 'L', 'M'], 16, 15) + rt(L_, K, M) + GF.T(270, 34, '(b)', MU3, 15)
P, Q, R, S_, T_ = (110, 430), (200, 430), (420, 430), (200, 250), (200, 330)
o += tri([P, Q, T_], AM, None) + tri([Q, R, S_], TR, None, fill=False) + rt(Q, S_, R)
o += GF.T(P[0] - 12, P[1] + 4, 'P', TX, 16) + GF.T(Q[0], Q[1] + 18, 'Q', TX, 16) + GF.T(R[0] + 14, R[1] + 4, 'R', TX, 16) + GF.T(S_[0], S_[1] - 16, 'S', TX, 16) + GF.T(T_[0] - 14, T_[1] - 6, 'T', TX, 16)
o += GF.T(90, 280, '(c)', MU3, 15)
rows = [['∆<i>ABC</i>', an('BAC'), i('AC'), i('BC'), i('AB')], ['∆<i>ABC</i>', an('BCA'), i('AC'), i('AB'), i('BC')],
        ['∆<i>KLM</i>', an('LKM'), i('KM'), i('LM'), i('KL')], ['∆<i>KLM</i>', an('LMK'), i('KM'), i('KL'), i('LM')],
        ['∆<i>PQT</i>', an('TPQ'), i('PT'), i('QT'), i('PQ')], ['∆<i>RQS</i>', an('QRS'), i('RS'), i('QS'), i('QR')]]
S(s, 'CONTOH 1', 'Mengenal pasti sisi',
  p('Kenal pasti sisi bertentangan, sisi bersebelahan dan hipotenus berdasarkan sudut yang diberi dalam jadual di bawah untuk semua segi tiga bersudut tegak di sebelah.')
  + table(['Segi tiga', 'Sudut', 'Hipotenus', 'Sisi bertentangan', 'Sisi bersebelahan'], rows, c, 17, rvrows=tuple(range(6))),
  SV(o, 'Segi tiga bersudut tegak ABC, KLM serta PQT dan RQS'))

# =====================================================================
# 5.1.2 SINUS, KOSINUS DAN TANGEN (buku SP 5.1.2 dan 5.1.3)
# =====================================================================
s = '5.1.2'
c = COL[s]
k = 32
P0 = (50, 410)
o = ''
for q, col in [(4, PA), (8, AM), (12, TR)]:
    Qx = P0[0] + q * k; Rh = 0.75 * q * k
    o += GF.L((Qx, P0[1]), (Qx, P0[1] - Rh), col, 3) + GF.L(P0, (Qx, P0[1] - Rh), col, 3) + rt((Qx, P0[1]), (Qx, P0[1] - 10), (Qx - 10, P0[1]), 12)
o += GF.L(P0, (P0[0] + 12 * k, P0[1]), TX, 3) + ang(P0, (P0[0] + 100, P0[1]), (P0[0] + 100, P0[1] - 75), '', PK, 40)
for q, lb, lr in [(4, '₁', ''), (8, '₂', ''), (12, '', '')]:
    Qx = P0[0] + q * k
    o += GF.T(Qx, P0[1] + 18, f'Q{lb}', TX, 15) + GF.T(Qx + 6, P0[1] - 0.75 * q * k - 14, f'R{lb}', TX, 15)
o += GF.T(P0[0] - 14, P0[1] + 4, 'P', TX, 16)
o += GF.T(140, 60, '3 : 4 : 5', PA, 15) + GF.T(140, 82, '6 : 8 : 10', AM, 15) + GF.T(140, 104, '9 : 12 : 15', TR, 15)
o += GF.T(140, 36, 'bertentangan : bersebelahan : hipotenus', MU3, 13, halo=False)
S(s, 'KONJEKTUR', 'Hubungan sudut tirus dengan nisbah sisi',
  p(f'Teliti segi tiga bersudut tegak {i("PQ₁R₁")}, {i("PQ₂R₂")} dan {i("PQR")} yang berkongsi sudut {an("QPR")}.')
  + table(['', F('Sisi bertentangan', 'Hipotenus'), F('Sisi bersebelahan', 'Hipotenus'), F('Sisi bertentangan', 'Sisi bersebelahan')],
          [[f'∆{i("PQ₁R₁")}', F(3, 5), F(4, 5), F(3, 4)], [f'∆{i("PQ₂R₂")}', f'{F(6, 10)} = {F(3, 5)}', f'{F(8, 10)} = {F(4, 5)}', f'{F(6, 8)} = {F(3, 4)}'],
           [f'∆{i("PQR")}', f'{F(9, 15)} = {F(3, 5)}', f'{F(12, 15)} = {F(4, 5)}', f'{F(9, 12)} = {F(3, 4)}']], c, 16, rvrows=(0, 1, 2))
  ,
  SV(o, 'Tiga segi tiga bersudut tegak bersaiz berbeza yang berkongsi sudut di P'))
S(s, 'KONSEP', 'Nisbah sisi ialah nilai pemalar',
  p('Didapati bahawa;')
  + de(s, 'Bagi suatu sudut tirus yang ditetapkan dalam pelbagai saiz segi tiga bersudut tegak;<br>(a) Nisbah panjang sisi bertentangan kepada hipotenus ialah suatu nilai pemalar.<br>(b) Nisbah panjang sisi bersebelahan kepada hipotenus ialah suatu nilai pemalar.<br>(c) Nisbah panjang sisi bertentangan kepada panjang sisi bersebelahan ialah suatu nilai pemalar.'),
  SV(o, 'Tiga segi tiga bersudut tegak bersaiz berbeza yang berkongsi sudut di P'))

P, Q, R = (50, 360), (350, 360), (350, 120)
o = tri([P, Q, R], c, None) + rt(Q, P, R) + ang(P, Q, R, 'θ', AM, 50)
o += GF.T(200, 384, 'sisi bersebelahan', GR, 17) + GF.T(362, 230, 'sisi', PK, 17, 'start') + GF.T(362, 252, 'bertentangan', PK, 17, 'start') + GF.T(180, 215, 'hipotenus', TR, 17)
S(s, 'DEFINISI', 'Sinus, kosinus dan tangen',
  p('Hubungan nisbah yang didapati ialah nisbah trigonometri yang dikenali sebagai <b>sinus</b>, <b>kosinus</b> dan <b>tangen</b> iaitu:')
  + work([('', [f'sinus = {F("panjang sisi bertentangan", "hipotenus")}', f'kosinus = {F("panjang sisi bersebelahan", "hipotenus")}', f'tangen = {F("panjang sisi bertentangan", "panjang sisi bersebelahan")}'])], s, 1, 20)
  + note('sin = sinus, kos = kosinus, tan = tangen', 'Peringatan:'),
  SV(o, 'Segi tiga bersudut tegak dengan sudut θ, sisi bertentangan, sisi bersebelahan dan hipotenus'))

# Contoh 2
P, Q, R = (420, 330), (110, 330), (110, 100)
o = tri([R, Q, P], c, ['R', 'Q', 'P'], 18, 18) + rt(Q, P, R) + ang(P, Q, R, i('x'), AM, 44) + ang(R, Q, P, i('y'), AM, 40)
S(s, 'CONTOH 2', 'Menulis nisbah trigonometri',
  p('Lengkapkan jadual berdasarkan rajah di sebelah.')
  + table([f'sin {i("x")}', f'kos {i("x")}', f'tan {i("x")}', f'sin {i("y")}', f'kos {i("y")}', f'tan {i("y")}'], [['', '', '', '', '', '']], c, 18)
  + p('<b>Penyelesaian:</b>')
  + table([f'sin {i("x")}', f'kos {i("x")}', f'tan {i("x")}', f'sin {i("y")}', f'kos {i("y")}', f'tan {i("y")}'],
          [[F(i('QR'), i('PR')), F(i('PQ'), i('PR')), F(i('QR'), i('PQ')), F(i('PQ'), i('PR')), F(i('QR'), i('PR')), F(i('PQ'), i('QR'))]], c, 20, rvrows=(0,)),
  SV(o, 'Segi tiga bersudut tegak PQR dengan sudut x di P dan sudut y di R'))

# kesan perubahan sudut
vals = [10, 30, 50, 70, 80]
trows = [[f'{a}°', f'{math.sin(math.radians(a)):.4f}', f'{math.cos(math.radians(a)):.4f}', f'{math.tan(math.radians(a)):.4f}'] for a in vals]
S(s, 'KONJEKTUR', 'Kesan perubahan saiz sudut',
  p('Nilai sinus, kosinus dan tangen bagi beberapa sudut tirus ditunjukkan dalam jadual di sebelah. Didapati bahawa;')
  + de(s, '<b>Semakin besar saiz sudut tirus</b><br>(a) semakin <b>besar</b> nilai sinus dan nilainya menghampiri 1.<br>(b) semakin <b>kecil</b> nilai kosinus dan nilainya menghampiri sifar.<br>(c) semakin <b>besar</b> nilai tangen.')
  + note('sin 0° = 0, kos 0° = 1, tan 0° = 0 &nbsp;·&nbsp; sin 90° = 1, kos 90° = 0', 'Tip:')
  + note('tan 90° tidak tertakrif. Nilai tangen menjadi semakin besar tanpa had apabila sudut menghampiri 90°.', 'Nota:'),
  stack(table(['θ', 'sin θ', 'kos θ', 'tan θ'], trows, c, 19, rvrows=tuple(range(len(vals))))))

# Contoh 3: 5-12-13 dan 2.5-6-6.5
assert Fr(25, 10) / Fr(65, 10) == Fr(5, 13) and Fr(6) / Fr(65, 10) == Fr(12, 13)
k = 17
B1 = (90, 230); A1 = (90, 230 - 5 * k); C1 = (90 + 12 * k, 230)
o = tri([A1, B1, C1], c, None) + rt(B1, A1, C1) + ang(C1, B1, A1, i('x'), AM, 40)
o += side(A1, B1, '5 cm', TX, 14, 15, C1) + side(B1, C1, '12 cm', TX, 16, 15, A1) + side(A1, C1, '13 cm', TX, 14, 15, B1)
B2 = (240, 390); A2 = (240, 390 - 2.5 * k); C2 = (240 + 6 * k, 390)
o += tri([A2, B2, C2], PA, None) + rt(B2, A2, C2, 10) + ang(C2, B2, A2, i('y'), AM, 34)
o += side(A2, B2, '2.5 cm', TX, 12, 15, C2) + side(B2, C2, '6 cm', TX, 16, 15, A2) + side(A2, C2, '6.5 cm', TX, 14, 15, B2)
S(s, 'CONTOH 3', 'Nisbah bagi segi tiga yang berkadaran',
  p(f'Rajah di sebelah menunjukkan dua segi tiga bersudut tegak. Tentukan sama ada semua nisbah trigonometri bagi sudut {i("x")} dan sudut {i("y")} bernilai sama atau tidak. Nyatakan alasan untuk jawapan anda.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'sin {i("x")} = {F(5, 13)} &emsp; kos {i("x")} = {F(12, 13)} &emsp; tan {i("x")} = {F(5, 12)}',
                f'sin {i("y")} = {F(2.5, 6.5)} = {F(5, 13)} &emsp; kos {i("y")} = {F(6, 6.5)} = {F(12, 13)} &emsp; tan {i("y")} = {F(2.5, 6)} = {F(5, 12)}',
                f'Nisbah trigonometri bagi sudut {i("x")} dan sudut {i("y")} adalah sama kerana panjang setiap sisi untuk kedua-dua rajah adalah berkadaran.'])], s, 1, 19),
  SV(o, 'Dua segi tiga bersudut tegak 5, 12, 13 cm dan 2.5, 6, 6.5 cm'))

# =====================================================================
# 5.1.4 NILAI DAN SUDUT KHAS (buku SP 5.1.4, 5.1.5, 5.1.6)
# =====================================================================
s = '5.1.4'
c = COL[s]
# Contoh 4: QP = 24, QR = 7, PR = 25
assert 24 ** 2 + 7 ** 2 == 25 ** 2
Q, P, R = (80, 120), (420, 120), (80, 220)
o = tri([Q, P, R], c, ['Q', 'P', 'R'], 18, 18) + rt(Q, P, R) + side(Q, P, '24 cm', TX, 16, 16, R) + side(Q, R, '7 cm', TX, 16, 16, P)
o += GF.box(60, 290, 380, 150) + GF.T(250, 316, 'Teorem Pythagoras', AM, 17)
o += GF.T(250, 350, f'{i("c")}² = {i("a")}² + {i("b")}²', TX, 18) + GF.T(250, 380, f'{i("a")}² = {i("c")}² − {i("b")}²', TX, 18) + GF.T(250, 410, f'{i("b")}² = {i("c")}² − {i("a")}²', TX, 18)
S(s, 'CONTOH 4', 'Menentukan nilai sinus, kosinus dan tangen',
  p(f'Rajah di sebelah menunjukkan segi tiga bersudut tegak {i("PQR")}. Hitung nilai (a) panjang {i("PR")} (b) sin {an("PRQ")} (c) kos {an("PRQ")} (d) tan {an("QPR")}')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'{i("PR")} = {sq("24² + 7²")}', f'&emsp;&ensp;= {sq("625")}', '&emsp;&ensp;= 25 cm']),
          ('(b)', [f'sin {an("PRQ")} = {F(24, 25)}']), ('(c)', [f'kos {an("PRQ")} = {F(7, 25)}']), ('(d)', [f'tan {an("QPR")} = {F(7, 24)}'])], s, 2, 19),
  SV(o, 'Segi tiga bersudut tegak PQR dengan QP 24 cm dan QR 7 cm'))

# Contoh 5: SQ = 10, SR = 26, PQ = 12, T titik tengah SQ
assert 26 ** 2 - 10 ** 2 == 24 ** 2 and 12 ** 2 + 5 ** 2 == 13 ** 2
P, Q, R, S_, T_ = (40, 400), (172, 400), (436, 400), (172, 130), (172, 265)
o = tri([Q, R, S_], TR, None) + tri([P, Q, T_], PA, None) + rt(Q, S_, R)
o += GF.T(P[0] - 4, P[1] + 20, 'P', TX, 17) + GF.T(Q[0], Q[1] + 20, 'Q', TX, 17) + GF.T(R[0] + 4, R[1] + 20, 'R', TX, 17) + GF.T(S_[0], S_[1] - 18, 'S', TX, 17) + GF.T(T_[0] - 18, T_[1] - 8, 'T', TX, 17)
o += tick(S_, T_) + tick(T_, Q) + GF.T(106, 420, '12 cm', TX, 15) + side(S_, R, '26 cm', TX, 16, 16, Q) + GF.T(250, 448, 'Rajah tidak mengikut skala', MU, 14, halo=False) + GF.T(250, 40, 'Peringatan: Nilai nisbah harus diberi', AM, 15, halo=False) + GF.T(250, 62, 'dalam sebutan terendah.', AM, 15, halo=False)
S(s, 'CONTOH 5', 'Dua segi tiga bersudut tegak',
  p(f'Rajah di sebelah menunjukkan segi tiga bersudut tegak {i("PQT")} dan {i("RQS")}. {i("PQR")} ialah garis lurus. Diberi bahawa panjang {i("SQ")} ialah 10 cm. Hitung nilai (a) panjang {i("QR")} (b) panjang {i("PT")} (c) sin {an("QRS")} (d) kos {an("TPQ")} (e) tan {an("PTQ")} (f) tan {an("QSR")}')
  + work([('(a)', [f'{i("QR")} = {sq("26² − 10²")} = {sq("576")}', '&emsp;&ensp;&nbsp;= 24 cm']), ('(b)', [f'{i("PT")} = {sq("12² + 5²")} = {sq("169")}', '&emsp;&ensp;&nbsp;= 13 cm']),
          ('(c)', [f'sin {an("QRS")} = {F(10, 26)} = {F(5, 13)}']), ('(d)', [f'kos {an("TPQ")} = {F(12, 13)}']),
          ('(e)', [f'tan {an("PTQ")} = {F(12, 5)}']), ('(f)', [f'tan {an("QSR")} = {F(24, 10)} = {F(12, 5)}'])], s, 2, 18),
  SV(o, 'Segi tiga PQT dan RQS dengan PQR garis lurus, T titik tengah SQ'))

# hubungan sin, kos, tan
P, Q, R = (90, 380), (400, 380), (90, 150)
o = tri([R, P, Q], c, ['R', 'P', 'Q'], 18, 18) + rt(P, R, Q) + ang(Q, P, R, 'θ', AM, 50)
o += side(R, Q, '1', TX, 16, 20, P) + side(P, R, i('x'), TX, 16, 20, Q) + side(P, Q, i('y'), TX, 18, 20, R)
S(s, 'KONSEP', 'Hubungan antara sinus, kosinus dan tangen',
  p('Tahukah anda ketiga-tiga nisbah trigonometri berkaitan antara satu sama lain? <b>Tangen ialah nisbah sinus kepada kosinus.</b> Teliti rajah di sebelah. Diketahui,')
  + work([('', [f'(a) sin θ = {F(i("x"), 1)}, maka {i("x")} = sin θ', f'(b) kos θ = {F(i("y"), 1)}, maka {i("y")} = kos θ', f'(c) tan θ = {F(i("x"), i("y"))}'])], s, 1, 20)
  + p('Maka,') + formula(f'tan θ = {F("sin θ", "kos θ")}', c),
  SV(o, 'Segi tiga bersudut tegak PQR dengan hipotenus 1, sisi x dan y, sudut θ di Q'))

# Contoh 6: sin 0.8, kos 0.6
assert Fr(8, 10) / Fr(6, 10) == Fr(4, 3)
S(s, 'CONTOH 6', 'Menghitung tan θ',
  p('Jika nilai sin θ = 0.8 dan kos θ = 0.6, hitung nilai tan θ.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'tan θ = {F("sin θ", "kos θ")}', f'&emsp;&ensp;&nbsp;= {F("0.8", "0.6")}', f'&emsp;&ensp;&nbsp;= {F(4, 3)}'])], s, 1, 21),
  stack(note(f'Jika tan θ = {F(1, 2)}, nyatakan nilai sin θ dan kos θ yang mungkin.', 'Kuiz:'), note('Diberi sin θ = <i>x</i>. Tentukan kos θ dan tan θ yang mungkin.', 'Bijak minda:')))

# Contoh 7: sin 4/9, tan 4/√65 → kos √65/9
assert Fr(16, 81) + Fr(65, 81) == 1
S(s, 'CONTOH 7', 'Menghitung kos θ',
  p(f'Jika nilai sin θ = {F(4, 9)} dan nilai tan θ = {F(4, sq("65"))}, hitung nilai kos θ.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'tan θ = {F("sin θ", "kos θ")}', f'{F(4, sq("65"))} = {F(F(4, 9), "kos θ")}', f'kos θ = {F(F(4, 9), F(4, sq("65")))}', f'kos θ = {F(sq("65"), 9)}'])], s, 1, 21),
  stack(note('Jika tan θ = 1, apakah jenis segi tiga yang diwakili oleh sudut θ tersebut?', 'Sudut diskusi:')))

# Contoh 8: PR = 26, sin QPR = 5/13
a = math.asin(5 / 13); k = 13
P = (50, 330); R = (50 + 26 * k, 330); Q = (P[0] + 24 * k * math.cos(a), P[1] - 24 * k * math.sin(a))
o = tri([P, Q, R], c, ['P', 'Q', 'R'], 18, 18) + rt(Q, P, R) + side(P, R, '26 cm', TX, 18, 16, Q)
S(s, 'CONTOH 8', 'Panjang sisi daripada nisbah',
  p(f'Rajah di sebelah menunjukkan segi tiga bersudut tegak {i("PQR")}. Diberi bahawa {i("PR")} = 26 cm dan sin {an("QPR")} = {F(5, 13)}. Hitung (a) panjang {i("QR")} (b) kos {an("QPR")}')
  + p('<b>Penyelesaian:</b>')
  + work([('(a)', [f'sin {an("QPR")} = {F(5, 13)}', f'{F(i("QR"), i("PR"))} = {F(5, 13)}', f'{F(i("QR"), 26)} = {F(5, 13)}', f'{i("QR")} = {F("5(26)", 13)}', f'{i("QR")} = 10 cm']),
          ('(b)', [f'{i("PQ")} = {sq("26² − 10²")}', f'&emsp;&ensp;= {sq("576")}', f'{i("PQ")} = 24 cm', f'Maka, kos {an("QPR")} = {F(i("PQ"), i("PR"))}', f'&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;= {F(24, 26)} = {F(12, 13)}'])], s, 2, 18),
  SV(o, 'Segi tiga bersudut tegak PQR dengan hipotenus PR 26 cm'))

# Contoh 9: PT = 10, PQ = 8, SR = 20, ST = TQ
assert 10 ** 2 - 8 ** 2 == 6 ** 2 and 20 ** 2 - 12 ** 2 == 16 ** 2
k = 17
P, Q = (40, 400), (40 + 8 * k, 400); R = (Q[0] + 16 * k, 400); S_ = (Q[0], 400 - 12 * k); T_ = (Q[0], 400 - 6 * k)
o = tri([Q, R, S_], TR, None) + tri([P, Q, T_], PA, None) + rt(Q, S_, R)
o += GF.T(P[0] - 4, P[1] + 20, 'P', TX, 17) + GF.T(Q[0], Q[1] + 20, 'Q', TX, 17) + GF.T(R[0] + 4, R[1] + 20, 'R', TX, 17) + GF.T(S_[0], S_[1] - 18, 'S', TX, 17) + GF.T(T_[0] + 16, T_[1] - 10, 'T', TX, 17)
o += tick(S_, T_) + tick(T_, Q) + side(P, Q, '8 cm', TX, 18, 15, T_) + side(P, T_, '10 cm', TX, 18, 15, Q) + side(S_, R, '20 cm', TX, 18, 15, Q) + ang(R, Q, S_, i('x'), AM, 46)
S(s, 'CONTOH 9', 'Nilai kosinus dalam dua segi tiga',
  p(f'Rajah di sebelah menunjukkan segi tiga bersudut tegak {i("PQT")} dan {i("RQS")}. Diberi bahawa {i("PQR")} dan {i("STQ")} ialah garis lurus. Hitung nilai kos {i("x")}.')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'kos {i("x")} = {F(i("RQ"), i("SR"))} &emsp;(Tentukan nilai {i("RQ")} terlebih dahulu)',
                f'{i("TQ")} = {sq("10² − 8²")} = {sq("36")} = 6 cm',
                f'{i("SQ")} = 2{i("TQ")} = 2(6) = 12 cm',
                f'{i("RQ")} = {sq("20² − 12²")} = {sq("256")} = 16 cm',
                f'Maka, kos {i("x")} = {F(i("RQ"), i("SR"))} = {F(16, 20)} = {F(4, 5)}'])], s, 1, 19),
  SV(o, 'Segi tiga PQT dan RQS dengan PT 10 cm, PQ 8 cm, SR 20 cm dan ST sama dengan TQ'))

# Contoh 10: PQ = QS = 12, sudut P = 30°
QR_ = 12 * 0.5; SR2 = 12 ** 2 - QR_ ** 2; PR_ = 12 + QR_; PS = math.sqrt(SR2 + PR_ ** 2)
assert QR_ == 6 and SR2 == 108 and PR_ == 18 and f'{PS:.2f}' == '20.78'
k = 22
P = (40, 390); Q = (40 + 12 * k, 390); R = (40 + 18 * k, 390); S_ = (R[0], 390 - math.sqrt(108) * k)
fig10 = tri([P, R, S_], AM, None) + GF.L(Q, S_, AM, 3) + rt(R, S_, P)
fig10 += GF.T(P[0] - 4, P[1] + 20, 'P', TX, 17) + GF.T(Q[0], Q[1] + 20, 'Q', TX, 17) + GF.T(R[0] + 4, R[1] + 20, 'R', TX, 17) + GF.T(S_[0] + 4, S_[1] - 18, 'S', TX, 17)
fig10 += tick(P, Q) + tick(Q, S_) + GF.T((P[0] + Q[0]) / 2, 420, '12 cm', TX, 15) + ang(P, R, S_, '30°', AM, 56, 15, 76)
o = fig10
S(s, 'CONTOH 10', 'Penyelesaian masalah',
  p(f'Rajah di sebelah menunjukkan segi tiga bersudut tegak {i("PRS")}. Diberi bahawa {i("PQR")} ialah garis lurus dan kos 60° = 0.5. Hitung panjang {i("PS")}. Nyatakan jawapan betul kepada dua tempat perpuluhan.')
  + work([('Memahami masalah', [f'Menghitung panjang {i("PS")} iaitu hipotenus bagi ∆{i("PRS")}.']),
          ('Merancang strategi', [f'• {i("PS")} = {sq(i("PR") + "² + " + i("SR") + "²")}', f'• {i("SR")} dan {i("QR")} boleh dihitung jika {an("SQR")} atau {an("QSR")} diketahui.', '• Mengenal pasti kedudukan kos 60°.'])], s, 1, 18),
  SV(o, 'Segi tiga PRS bersudut tegak di R, PQ sama dengan QS 12 cm, sudut P 30 darjah'))
S(s, 'CONTOH 10 (sambungan)', 'Melaksanakan strategi',
  work([('Melaksanakan strategi', [f'• {an("QSP")} = {an("QPS")} = 30°, maka {an("PQS")} = 180° − 30° − 30° = 120°', f'• {an("SQR")} = 180° − {an("PQS")} = 180° − 120° = 60°',
                                   f'• Diberi bahawa kos 60° = 0.5, iaitu kos 60° = {F(1, 2)}', f'{F(i("QR"), 12)} = {F(1, 2)} &emsp; {i("QR")} = {F("12(1)", 2)} = 6 cm',
                                   f'{i("SR")} = {sq("12² − 6²")} = {sq("108")} cm',
                                   f'{i("PR")} = 12 + 6 = 18 cm', f'Maka, {i("PS")} = {sq(i("SR") + "² + " + i("PR") + "²")} = {sq("108 + 18²")} = {sq(432)}', f'{i("PS")} = 20.78 cm'])], s, 1, 18)
  + work([('Membuat kesimpulan', [f'{i("PS")} = 20.78 cm (2 t.p.)'])], s, 1, 19),
  SV(fig10, 'Segi tiga PRS bersudut tegak di R'))

# sudut khas
k = 120
P = (40, 400); Q = (40 + k, 400); S_ = (Q[0], 400 - math.sqrt(3) * k)
o = tri([P, Q, S_], c, ['P', 'Q', 'S'], 17, 16) + rt(Q, P, S_) + side(P, Q, '1', TX, 16, 16, S_) + side(P, S_, '2', TX, 16, 16, Q) + surd(Q[0] - 14, (Q[1] + S_[1]) / 2, '3', TX, 16, 'end')
o += ang(P, Q, S_, '60°', AM, 28, 14, 46) + ang(S_, P, Q, '30°', AM, 34, 14, 52) + GF.T(100, 445, 'Rajah 1', MU3, 16, halo=False)
L_ = (290, 400); M = (290 + 1.4 * k, 400); K = (290, 400 - 1.4 * k)
o += tri([K, L_, M], PA, ['K', 'L', 'M'], 17, 16) + rt(L_, K, M) + side(K, L_, '1', TX, 16, 16, M) + side(L_, M, '1', TX, 16, 16, K) + surd((K[0] + M[0]) / 2 + 14, (K[1] + M[1]) / 2 - 12, '2', TX, 16, 'start')
o += ang(M, L_, K, '45°', AM, 34, 14, 54) + GF.T(374, 445, 'Rajah 2', MU3, 16, halo=False)
S(s, 'KONSEP', 'Nilai bagi sudut 30°, 45° dan 60°',
  p(f'Rajah 1 merupakan separuh daripada segi tiga sama sisi dengan panjang sisi 2 unit. Rajah 2 menunjukkan segi tiga sama kaki {i("KLM")}.')
  + work([('', [f'{i("QS")} = {sq("2² − 1²")} = {sq(3)} &emsp;&emsp; {i("KM")} = {sq("1² + 1²")} = {sq(2)}'])], s, 1, 19)
  + p('Nilai nisbah trigonometri bagi sudut 30°, 45° dan 60° boleh dihitung tanpa menggunakan kalkulator:')
  + table(['Nisbah', '30°', '45°', '60°'], [['sin θ', F(1, 2), F(1, sq(2)), F(sq(3), 2)], ['kos θ', F(sq(3), 2), F(1, sq(2)), F(1, 2)], ['tan θ', F(1, sq(3)), '1', sq(3)]], c, 20),
  SV(o, 'Separuh segi tiga sama sisi dengan sudut 30 dan 60 darjah, dan segi tiga sama kaki dengan sudut 45 darjah'))

# Contoh 11 (nilai disemak dengan perpuluhan)
s2, s3 = math.sqrt(2), math.sqrt(3)
r = math.radians
assert math.isclose(2 * math.sin(r(45)) + math.cos(r(45)), 3 * s2 / 2)
assert math.isclose(4 * math.cos(r(30)) - 2 * math.sin(r(60)), s3)
assert math.isclose(3 * math.tan(r(45)) - 4 * math.cos(r(60)), 1)
assert math.isclose(2 * math.sin(r(60)) * 2 * math.cos(r(30)) - 2 * math.tan(r(60)), 3 - 2 * s3)
assert math.isclose(6 * math.tan(r(30)) * 2 * math.sin(r(60)) + 2 * math.sin(r(45)), 6 + s2)
S(s, 'CONTOH 11', 'Menghitung tanpa kalkulator',
  p('Hitung nilai berikut tanpa menggunakan kalkulator. (a) 2 sin 45° + kos 45° (b) 4 kos 30° − 2 sin 60° (c) 3 tan 45° − 4 kos 60° (d) (2 sin 60°)(2 kos 30°) − 2 tan 60° (e) (6 tan 30°)(2 sin 60°) + 2 sin 45°')
  + work([('(a)', ['2 sin 45° + kos 45°', f'= 2({F(1, sq(2))}) + {F(1, sq(2))}', f'= {F(3, sq(2))} × {F(sq(2), sq(2))}', f'= {F("3" + sq(2), 2)}']),
          ('(b)', ['4 kos 30° − 2 sin 60°', f'= 4({F(sq(3), 2)}) − 2({F(sq(3), 2)})', f'= 2{sq(3)} − {sq(3)}', f'= {sq(3)}']),
          ('(c)', ['3 tan 45° − 4 kos 60°', f'= 3(1) − 4({F(1, 2)})', '= 3 − 2', '= 1'])], s, 3, 18),
  stack(note(f'{sq(2)} × {sq(2)} = {sq("2 × 2")} = {sq(4)} = 2', 'Tip:')))
S(s, 'CONTOH 11 (sambungan)', 'Menghitung tanpa kalkulator',
  work([('(d)', ['(2 sin 60°)(2 kos 30°) − 2 tan 60°', f'= 2({F(sq(3), 2)}) × 2({F(sq(3), 2)}) − 2{sq(3)}', f'= ({sq(3)})({sq(3)}) − 2{sq(3)}', f'= 3 − 2{sq(3)}']),
        ('(e)', ['(6 tan 30°)(2 sin 60°) + 2 sin 45°', f'= 6({F(1, sq(3))}) × 2({F(sq(3), 2)}) + 2({F(1, sq(2))})', f'= {F(6, sq(3))} × {sq(3)} + {F(2, sq(2))}',
                 f'= 6 + {F(2, sq(2))} × {F(sq(2), sq(2))}', f'= 6 + {F("2" + sq(2), 2)}', f'= 6 + {sq(2)}'])], s, 2, 19))

# darjah dan minit, Contoh 12
S(s, 'CONTOH 12', 'Darjah dan minit',
  p('Sudut diukur dalam unit darjah ( ° ). Sudut juga boleh dinyatakan dalam unit darjah ( ° ), minit ( ′ ) dan saat ( ″ ) iaitu,')
  + formula('1° = 60′ &emsp;&emsp; 1′ = 60″', c)
  + p('(a) Tukarkan 52.4° kepada unit darjah dan minit. (b) Tukarkan nilai sudut 27° 45′ kepada darjah.')
  + work([('(a)', ['52.4° = 52° + 0.4°', '&emsp;&emsp;&ensp;= 52° + (0.4 × 60)′', '&emsp;&emsp;&ensp;= 52° + 24′', '&emsp;&emsp;&ensp;= 52° 24′']),
          ('(b)', ['27° 45′ = 27° + 45′', f'&emsp;&emsp;&emsp;&ensp;= 27° + ({F(45, 60)})°', '&emsp;&emsp;&emsp;&ensp;= 27° + 0.75°', '&emsp;&emsp;&emsp;&ensp;= 27.75°'])], s, 2, 19))

# Contoh 13 kalkulator
v13 = [math.sin(r(38 + 24 / 60)), math.cos(r(56.3)), math.tan(r(71 + 36 / 60))]
assert [f'{x:.4f}' for x in v13] == ['0.6211', '0.5548', '3.0061']
S(s, 'CONTOH 13', 'Menggunakan kalkulator saintifik',
  p('Tahukah anda kalkulator saintifik boleh digunakan untuk menentukan nilai suatu sudut bagi nisbah trigonometri?')
  + p("Gunakan kalkulator saintifik untuk menentukan nilai-nilai berikut kepada empat tempat perpuluhan. (a) sin 38° 24′ (b) kos 56.3° (c) tan 71° 36′")
  + work([('', ['(a) sin 38° 24′ = 0.6211', '(b) kos 56.3° = 0.5548', '(c) tan 71° 36′ = 3.0061'])], s, 1, 20),
  stack(work([('(a)', [keys("sin 3 8 " + DMS + " 2 4 " + DMS, f"{v13[0]:.10f}"[:12])]), ('(b)', [keys("kos 5 6 . 3", f"{v13[1]:.10f}"[:12])]),
              ('(c)', [keys("tan 7 1 " + DMS + " 3 6 " + DMS, f"{v13[2]:.9f}"[:11])])], s, 1, 18),
        note(f'Butang {key(DMS)} hanya perlu ditekan apabila soalan diberikan dalam unit darjah dan minit.', 'Buletin:')))


def dms(d):
    D = int(d); m = (d - D) * 60; M = int(m); sx = (m - M) * 60
    return D, M, sx


d14 = [math.degrees(math.asin(0.6543)), math.degrees(math.acos(0.4118)), math.degrees(math.atan(2.3172))]
D = [dms(x) for x in d14]
assert [(a, b, f'{x:.2f}') for a, b, x in D] == [(40, 51, '59.74'), (65, 40, '55.35'), (66, 39, '25.67')]
S(s, 'CONTOH 14', 'Mengira saiz sudut',
  p('Jika nilai nisbah trigonometri diberi, anda boleh menggunakan kalkulator saintifik untuk menentukan saiz sudut yang berkaitan.')
  + p(f'Gunakan kalkulator saintifik untuk mengira nilai-nilai {i("x")} berikut. (a) sin {i("x")} = 0.6543 (b) kos {i("x")} = 0.4118 (c) tan {i("x")} = 2.3172')
  + work([('(a)', [f'sin {i("x")} = 0.6543', f'{i("x")} = sin<sup>−1</sup> 0.6543', f'{i("x")} = 40.87°', f'{i("x")} = 40° 52′']),
          ('(b)', [f'kos {i("x")} = 0.4118', f'{i("x")} = kos<sup>−1</sup> 0.4118', f'{i("x")} = 65.68°', f'{i("x")} = 65° 41′']),
          ('(c)', [f'tan {i("x")} = 2.3172', f'{i("x")} = tan<sup>−1</sup> 2.3172', f'{i("x")} = 66.66°', f'{i("x")} = 66° 39′'])], s, 3, 18),
  stack(work([('Kalkulator bagi (a)', [keys(f'shift sin 0 . 6 5 4 3', f'{d14[0]:.8f}'), f'Tekan {key(DMS)}: 40° 51′ 59.74″',
                                       '59.74″ menunjukkan nilai dalam unit saat. 59.74″ &gt; 30″, maka tambah 1′:', '40° 51′ 59.74″ = 40° 52′'])], s, 1, 17),
        note('Jika unit saat bernilai 30″ atau lebih, unit minit akan ditambah 1′. Bagi (c), 66° 39′ 25.67″ = 66° 39′ kerana 25.67″ &lt; 30″.', 'Peringatan:')))

# =====================================================================
# 5.1.7 PENYELESAIAN MASALAH (buku SP 5.1.7)
# =====================================================================
s = '5.1.7'
c = COL[s]
PR15 = 3.2 / math.sin(r(65))
assert f'{PR15:.2f}' == '3.53'
k = 110
Q = (330, 410); P = (Q[0] - 3.2 / math.tan(r(65)) * k, 410); R = (330, 410 - 3.2 * k)
o = f'<rect x="330" y="40" width="40" height="370" fill="{MU}33" stroke="{MU}" stroke-width="2"/>' + GF.T(380, 120, 'Dinding', MU3, 15, 'start')
o += tri([P, Q, R], c, ['P', 'Q', 'R'], 18, 18) + rt(Q, P, R) + GF.T(380, 240, '3.2 m', TX, 16, 'start') + ang(P, Q, R, '65°', AM, 40, 15, 60)
o += GF.L((60, 410), (460, 410), MU3, 2.5) + GF.T(180, 200, 'Tangga', c, 16)
S(s, 'CONTOH 15', 'Panjang tangga',
  p(f'Gambar rajah di sebelah menunjukkan satu tangga yang disandarkan pada dinding. Ia membentuk suatu segi tiga bersudut tegak {i("PQR")}. Jika tinggi {i("QR")} ialah 3.2 m, hitungkan panjang tangga, {i("PR")} dalam meter. (Nyatakan jawapan betul kepada dua tempat perpuluhan).')
  + p('<b>Penyelesaian:</b>')
  + work([('', [f'sin 65° = {F(i("QR"), i("PR"))}', f'sin 65° = {F(3.2, i("PR"))}', f'{i("PR")} = {F(3.2, "sin 65°")}', f'{i("PR")} = 3.53 m (2 t.p.)'])], s, 1, 20),
  SV(o, 'Tangga PR bersandar pada dinding dengan QR 3.2 m dan sudut P 65 darjah'))

# Contoh 16: kuboid BC = 9, CH = 4, HE = 6
ang16 = math.degrees(math.atan(6 / math.sqrt(97)))
assert f'{ang16:.2f}' == '31.35' and dms(ang16)[:2] == (31, 21)
k = 32; dx, dy = 66, -52
B = (50, 400); C_ = (50 + 9 * k, 400); A = (50, 400 - 6 * k); D_ = (C_[0], A[1])
G = (B[0] + dx, B[1] + dy); H = (C_[0] + dx, C_[1] + dy); Fp = (G[0], A[1] + dy); E = (H[0], A[1] + dy)
cub = f'<polygon points="{Fp[0]},{Fp[1]} {G[0]},{G[1]} {C_[0]},{C_[1]}" fill="{AM}44" stroke="{AM}" stroke-width="3"/>'
for a_, b_ in [(A, B), (B, C_), (C_, D_), (D_, A), (A, Fp), (Fp, E), (E, D_), (C_, H), (H, E)]:
    cub += GF.L(a_, b_, TR, 3)
for a_, b_ in [(B, G), (G, H), (G, Fp)]:
    cub += GF.L(a_, b_, TR, 2.2, '7 6')
for pt, lb, ddx, ddy in [(A, 'A', -14, -4), (B, 'B', -14, 10), (C_, 'C', 8, 16), (D_, 'D', 8, 14), (E, 'E', 10, -10), (Fp, 'F', -6, -14), (G, 'G', -16, -4), (H, 'H', 14, 4)]:
    cub += GF.T(pt[0] + ddx, pt[1] + ddy, lb, TX, 17)
cub += GF.T((B[0] + C_[0]) / 2, 424, '9 cm', TX, 15) + GF.T(C_[0] + dx / 2 + 16, C_[1] + dy / 2 + 12, '4 cm', TX, 15, 'start') + GF.T(H[0] + 12, (H[1] + E[1]) / 2, '6 cm', TX, 15, 'start')
S(s, 'CONTOH 16', 'Sudut dalam kuboid',
  p(f'Rajah di sebelah menunjukkan kuboid {i("ABCDEFGH")}. Diberi bahawa {i("BC")} = 9 cm, {i("CH")} = 4 cm dan tinggi {i("HE")} = 6 cm. Jika segi tiga bersudut tegak {i("FGC")} dibentuk dalam kuboid, hitung nilai {an("FCG")}.')
  + work([('Memahami masalah', [f'{an("FCG")} boleh dihitung jika dua daripada mana-mana sisi {i("CG")}, {i("CF")} atau {i("FG")} diketahui.']),
          ('Merancang strategi', [f'• {i("FG")} = {i("EH")}', f'• Panjang {i("CG")} lebih mudah dihitung berbanding panjang {i("CF")}.', f'• tan {an("FCG")} = {F(i("FG"), i("CG"))}'])], s, 1, 18),
  SV(cub, 'Kuboid ABCDEFGH dengan segi tiga FGC berlorek'))
o = ''
B2, C2, G2 = (90, 200), (90 + 9 * 26, 200), (90, 200 - 4 * 26)
o += tri([G2, B2, C2], PA, ['G', 'B', 'C'], 16, 16) + rt(B2, G2, C2) + side(B2, C2, '9 cm', TX, 16, 15, G2) + side(G2, B2, '4 cm', TX, 14, 15, C2) + surd((G2[0] + C2[0]) / 2 + 10, (G2[1] + C2[1]) / 2 - 14, '97', TX, 15, 'start', '\u00a0cm')
G3, C3, F3 = (90, 420), (90 + math.sqrt(97) * 26, 420), (90, 420 - 6 * 26)
o += tri([F3, G3, C3], AM, ['F', 'G', 'C'], 16, 16) + rt(G3, F3, C3) + side(F3, G3, '6 cm', TX, 14, 15, C3) + surd((G3[0] + C3[0]) / 2, G3[1] + 20, '97', TX, 15, 'middle', '\u00a0cm') + ang(C3, G3, F3, '', PK, 46)
S(s, 'CONTOH 16 (sambungan)', 'Melaksanakan strategi',
  work([('Melaksanakan strategi', [f'• {i("FG")} = {i("EH")}, maka {i("FG")} = 6 cm', f'• {i("CG")} = {sq(i("BC") + "² + " + i("BG") + "²")}', f'&emsp;&ensp;&nbsp;= {sq("9² + 4²")}', f'{i("CG")} = {sq(97)} cm',
                                   f'• tan {an("FCG")} = {F(6, sq(97))}', f'{an("FCG")} = tan<sup>−1</sup> {F(6, sq(97))}', f'{an("FCG")} = 31.35°'])], s, 1, 19)
  + work([('Membuat kesimpulan', [f'{an("FCG")} = 31.35° atau {an("FCG")} = 31° 21′'])], s, 1, 19),
  SV(o, 'Segi tiga BCG dan segi tiga FGC daripada kuboid'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'trigonometri', 'slides.js')
HEAD = '/* Nota Bab 5 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
