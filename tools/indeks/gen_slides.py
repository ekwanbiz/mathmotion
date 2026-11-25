# Penjana slaid NOTA INDEKS (Tingkatan 3 Bab 1 Indeks) -> indeks/slides.js
# Jalankan:  python3 tools/indeks/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
# Tatatanda dalam teks: '^{...}' = superskrip (ditukar kepada <sup> dalam HTML dan <tspan> dalam SVG).
import json, os, html, math, re, sys
from fractions import Fraction as F
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fxsvg import fx_html, fx_svg, has_fx   # pecahan bertingkat & punca bergaris atas (25 Nov)
import mathfmt

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'indeks', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '1.1': ('Tatatanda Indeks', C['am']),
    '1.2': ('Hukum Indeks', C['pu']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
AS, IN = TR, PK   # warna tetap: asas (biru), indeks (merah jambu)

# ---------- semakan matematik ----------
def fs(fr):
    fr = F(fr)
    t = str(abs(fr.numerator)) if fr.denominator == 1 else f'{abs(fr.numerator)}/{fr.denominator}'
    return ('−' if fr < 0 else '') + t
def iroot(v, n):
    r = round(v ** (1 / n))
    for c in (r - 1, r, r + 1):
        if c ** n == v: return c
    raise AssertionError(f'{v} bukan kuasa ke-{n} sempurna')

# ---------- pembantu teks ----------
def H(t):
    """'^{..}' -> <sup>..</sup>; a/b -> pecahan bertingkat; √x, ^{n}√x -> punca bergaris atas"""
    return fx_html(t)
def P(t, sm=False):
    return f'<p class="sl-p{" sm" if sm else ""}">{H(t)}</p>'
def DEF(t, col):
    return f'<div class="sl-def" style="--c:{col}"><p>{H(t)}</p></div>'
def BUL(items, col):
    return f'<ul class="sl-bul" style="--c:{col}">' + ''.join(f'<li><span>{H(i)}</span></li>' for i in items) + '</ul>'
def STEPS(items, col):
    return f'<ol class="sl-steps" style="--c:{col}">' + ''.join(
        f'<li class="rv"><span class="n">{n}</span><span>{H(t)}</span></li>' for n, t in enumerate(items, 1)) + '</ol>'
def ANS(t):
    return f'<div class="sl-ans rv"><span>JAWAPAN</span> {H(t)}</div>'
def NOTE(t, lab='Ingat:'):
    return f'<div class="sl-note"><b>{lab}</b> {H(t)}</div>'
def FR(a, b):
    return mathfmt.FR(H(str(a)), H(str(b)))
def FRV(fr):
    fr = F(fr)
    if fr.denominator == 1: return fs(fr)
    return ('−' if fr < 0 else '') + FR(abs(fr.numerator), fr.denominator)
def B(t, col):
    return f'<b style="color: {col}">{H(t)}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{H(h)}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{H(c)}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
def ASI(a, n):
    """a^n berwarna: asas biru, indeks merah jambu."""
    return f'<b style="color: {AS}">{a}</b><sup style="color: {IN}; font-weight: 700">{n}</sup>'

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H_ = 500, 470

def svg(inner, label, h=H_):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True, supcol=None):
    """Teks SVG; '^{..}' menjadi superskrip (tspan naik, saiz kecil)."""
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    if has_fx(t):
        return fx_svg(x, y, t, col, size, anchor, f' {FONT} font-weight="{weight}"{it}{ha}', supcol)
    up, small = r1(size * 0.42), r1(size * 0.64)
    parts = re.split(r'(\^\{[^}]*\})', t)
    out, raised = '', False
    for p in parts:
        if not p: continue
        if p.startswith('^{'):
            sc = f' fill="{supcol}"' if supcol else ''
            out += f'<tspan dy="{-up}" font-size="{small}"{sc}>{p[2:-1]}</tspan>'
            raised = True
        else:
            if raised:
                out += f'<tspan dy="{up}" font-size="{size}">{p}</tspan>'; raised = False
            else:
                out += p
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{out}</text>')

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'
def POLY(pts, fill, stroke='none', sw=0):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    return f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def ARROW(p, q, col, sw=3.5, head=12):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (q[0] - ux * head - uy * head * 0.6, q[1] - uy * head + ux * head * 0.6)
    b = (q[0] - ux * head + uy * head * 0.6, q[1] - uy * head - ux * head * 0.6)
    return (LINE(p, q, col, sw) +
            f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(q[0])} {r1(q[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
def TILE(x, y, t, col, s=44, fs_=20, op='33'):
    return RECT(x, y, s, s, f'{col}{op}', col, 9, 2.5) + T(x + s / 2, y + s / 2 + 1, t, TX, fs_, halo=False)
def BRACE(x0, x1, y, col, down=True, h=10):
    """Kurungan dakap mengufuk dari x0 ke x1 (bukaan ke atas jika down)."""
    s = 1 if down else -1; m = (x0 + x1) / 2
    d = f'M{r1(x0)} {r1(y)} Q{r1(x0)} {r1(y + s * h)} {r1(x0 + 12)} {r1(y + s * h)} L{r1(m - 10)} {r1(y + s * h)} Q{r1(m)} {r1(y + s * h)} {r1(m)} {r1(y + s * 2 * h)} Q{r1(m)} {r1(y + s * h)} {r1(m + 10)} {r1(y + s * h)} L{r1(x1 - 12)} {r1(y + s * h)} Q{r1(x1)} {r1(y + s * h)} {r1(x1)} {r1(y)}'
    return f'<path d="{d}" fill="none" stroke="{col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
def CASES(rows, y0=40, gap=84, hh=64, x0=20, w=460, size=21):
    """Kotak betul/salah: rows = [(teks, ok, nota)]"""
    s = ''
    for i, (t, ok, nt) in enumerate(rows):
        y = y0 + i * gap
        s += RECT(x0, y - hh / 2, w, hh, SURF, GR if ok else RD, 14, 2)
        s += (TICK(x0 + 30, y) if ok else CROSS(x0 + 30, y))
        s += T(x0 + 60, y, t, GR if ok else RD, size, 'start')
        if nt: s += T(x0 + w - 16, y, nt, MU, 15, 'end', halo=False)
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 1.1 TATATANDA INDEKS =====================
col = SUB['1.1'][1]

# 1.1-1 Definisi
assert 5 ** 4 == 625
fig = (T(250, 92, '5', AS, 96, halo=False) + T(296, 52, '4', IN, 58, halo=False)
       + ARROW((150, 150), (214, 112), AS, 3.5) + T(124, 168, 'asas', AS, 24)
       + ARROW((380, 66), (322, 52), IN, 3.5) + T(412, 76, 'indeks', IN, 24)
       + RECT(30, 214, 440, 84, SURF, BD, 16)
       + T(250, 256, '= 5 × 5 × 5 × 5', TX, 32)
       + BRACE(130, 400, 304, MU3, True, 11) + T(265, 348, '4 faktor yang sama', MU3, 20, halo=False)
       + RECT(150, 380, 200, 64, f'{GR}1A', GR, 16)
       + T(250, 412, '= 625', GR, 32))
add('1.1', 'DEFINISI', 'Apa itu bentuk indeks?',
    DEF('<b>Bentuk indeks</b> ialah cara ringkas menulis <b>pendaraban berulang</b> suatu nombor dengan dirinya sendiri.', col)
    + P(f'{ASI("a", "n")} = <b style="color: {AS}">a</b> × <b style="color: {AS}">a</b> × … × <b style="color: {AS}">a</b> &nbsp;(<b style="color: {IN}">n</b> faktor)')
    + BUL([f'{B("Asas", AS)} (<i>a</i>): nombor yang didarab berulang kali.',
           f'{B("Indeks", IN)} (<i>n</i>): bilangan kali asas itu didarab.'], col)
    + NOTE('5^{4} dibaca “5 kuasa 4”. Indeks juga dikenali sebagai <b>kuasa</b> atau <b>eksponen</b>.'),
    svg(fig, 'Lima kuasa empat: asas 5, indeks 4, sama dengan 5 darab 5 darab 5 darab 5 iaitu 625'))

# 1.1-2 Menulis bentuk indeks
assert 3 ** 2 == 9 and 3 ** 3 == 27
fig = RECT(14, 14, 472, 442)
# kuasa dua 3x3
s0, ox, oy = 40, 46, 120
for i in range(3):
    for j in range(3):
        fig += RECT(ox + j * s0, oy + i * s0, s0 - 4, s0 - 4, f'{TR}40', TR, 6, 2)
fig += T(ox + 58, 78, 'Kuasa dua', TR, 21) + T(ox + 58, 270, '3^{2} = 9', TX, 30)
fig += T(ox + 58, 306, '3 × 3', MU3, 19, halo=False)
# kuasa tiga 3x3x3 (isometri)
cx0, cy0, e = 330, 205, 26
def iso(i, j, k):
    return (cx0 + (i - j) * e * 0.866, cy0 + (i + j) * e * 0.5 - k * e)
def face(pts, fill):
    return POLY(pts, fill, PA, 2)
for i in range(3):          # muka atas (k = 3)
    for j in range(3):
        fig += face([iso(i, j, 3), iso(i + 1, j, 3), iso(i + 1, j + 1, 3), iso(i, j + 1, 3)], f'{PA}66')
for i in range(3):          # muka kanan (j = 3)
    for k in range(3):
        fig += face([iso(i, 3, k), iso(i + 1, 3, k), iso(i + 1, 3, k + 1), iso(i, 3, k + 1)], f'{PA}33')
for j in range(3):          # muka kiri (i = 3)
    for k in range(3):
        fig += face([iso(3, j, k), iso(3, j + 1, k), iso(3, j + 1, k + 1), iso(3, j, k + 1)], f'{PA}4D')
fig += T(cx0, 78, 'Kuasa tiga', PA, 21) + T(cx0, 306, '3^{3} = 27', TX, 30)
fig += T(cx0, 342, '3 × 3 × 3', MU3, 19, halo=False)
fig += LINE((40, 384), (460, 384), BD, 2) + T(250, 418, 'Indeks = bilangan faktor yang sama', MU3, 19, halo=False)
add('1.1', 'CONTOH', 'Menulis dalam bentuk indeks',
    P('Kira bilangan faktor yang sama, kemudian tulis sebagai indeks.', True)
    + TABLE(['Pendaraban berulang', 'Bentuk indeks'],
            [['3 × 3 × 3 × 3 × 3', ASI('3', 5)],
             ['(−2) × (−2) × (−2)', f'{ASI("(−2)", 3)}'],
             [f'{FR(2, 5)} × {FR(2, 5)} × {FR(2, 5)} × {FR(2, 5)}', f'<b style="color: {AS}">(</b>{FR(2, 5)}<b style="color: {AS}">)</b><sup style="color: {IN}; font-weight: 700">4</sup>'],
             ['0.7 × 0.7', ASI('0.7', 2)],
             ['<i>m</i> × <i>m</i> × <i>m</i> × <i>n</i> × <i>n</i>', f'{ASI("<i>m</i>", 3)}{ASI("<i>n</i>", 2)}']], col, rv=True)
    + NOTE('Asas <b>negatif</b> atau <b>pecahan</b> mesti ditulis dalam <b>kurungan</b>.'),
    svg(fig, 'Tiga kuasa dua ialah 9 petak; tiga kuasa tiga ialah kubus 27 kubus kecil'))

# 1.1-3 Mengira nilai
assert (-3) ** 4 == 81 and -(3 ** 4) == -81 and F(2, 3) ** 3 == F(8, 27)
vals = [(-2) ** n for n in range(1, 7)]
assert vals == [-2, 4, -8, 16, -32, 64]
fig = RECT(14, 14, 472, 442) + T(250, 50, 'Asas negatif: tanda berselang-seli', MU3, 20, halo=False)
for i, n in enumerate(range(1, 7)):
    y = 104 + i * 58; v = (-2) ** n; pos = v > 0; cl = GR if pos else RD
    fig += RECT(40, y - 23, 420, 46, f'{cl}14', cl, 12, 2)
    fig += T(64, y, f'(−2)^{{{n}}}', TX, 23, 'start')
    fig += T(250, y, 'indeks genap' if n % 2 == 0 else 'indeks ganjil', MU, 17, halo=False)
    fig += T(440, y, fs(v), cl, 25, 'end')
fig += T(250, 440, 'genap → positif · ganjil → negatif', MU3, 18, halo=False)
add('1.1', 'CONTOH BERLANGKAH', 'Mengira nilai nombor dalam bentuk indeks',
    P(f'Hitung nilai (a) (−3)^{{4}} &nbsp;(b) −3^{{4}} &nbsp;(c) ({FR(2, 3)})^{{3}}', True)
    + STEPS(['(a) (−3)^{4} = (−3) × (−3) × (−3) × (−3) = <b>81</b>',
             '(b) −3^{4} = −(3 × 3 × 3 × 3) = <b>−81</b> &nbsp;(asasnya 3, bukan −3)',
             f'(c) ({FR(2, 3)})^{{3}} = {FR("2 × 2 × 2", "3 × 3 × 3")} = <b>{FRV(F(8, 27))}</b>'], col)
    + ANS(f'(a) 81 &nbsp;(b) −81 &nbsp;(c) {FRV(F(8, 27))}')
    + NOTE('Bagi pecahan, indeks dikenakan pada <b>pengangka</b> dan <b>penyebut</b>.'),
    svg(fig, 'Nilai negatif dua kuasa 1 hingga 6: tanda bertukar ganti antara negatif dan positif'))

# 1.1-4 Pembahagian berulang
assert 2 ** 6 == 64 == 4 ** 3 == 8 ** 2 and 3 ** 4 == 81
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Kaedah pembahagian berulang', MU3, 20, halo=False)
v, y = 64, 92
rows = []
while v > 1:
    rows.append(v); v //= 2
rows.append(1)
assert len(rows) - 1 == 6
for i, val in enumerate(rows):
    yy = y + i * 50
    if i < len(rows) - 1:
        fig += T(150, yy, '2', AS, 26) + LINE((172, yy - 22), (172, yy + 24), MU2, 3) + LINE((172, yy + 24), (290, yy + 24), MU2, 3)
    fig += T(230, yy, str(val), GR if val == 1 else TX, 26)
fig += f'<path d="M110 {y - 20} Q96 {y - 20} 96 {y} L96 {y + 125} Q96 {y + 140} 84 {y + 140} Q96 {y + 140} 96 {y + 155} L96 {y + 280} Q96 {y + 300} 110 {y + 300}" fill="none" stroke="{IN}" stroke-width="3" stroke-linecap="round"/>'
fig += T(60, y + 140, '6 kali', IN, 18)
fig += RECT(320, 170, 150, 120, f'{GR}1A', GR, 16) + T(395, 212, '64 =', TX, 26) + T(395, 252, '2^{6}', GR, 34, supcol=IN)
fig += T(395, 390, 'berhenti apabila', MU, 16, halo=False) + T(395, 412, 'hasil = 1', MU, 16, halo=False)
add('1.1', 'CONTOH BERLANGKAH', 'Menukar nombor kepada bentuk indeks',
    P('Tulis 64 dalam bentuk indeks dengan asas 2.', True)
    + STEPS(['Bahagi 64 dengan asas 2 berulang kali sehingga hasilnya 1.',
             '64 → 32 → 16 → 8 → 4 → 2 → 1: sebanyak <b>6</b> kali.',
             f'Maka 64 = {ASI("2", 6)}.'], col)
    + ANS('64 = 2^{6}')
    + NOTE('Satu nombor boleh ditulis dengan asas berbeza: 64 = 2^{6} = 4^{3} = 8^{2}. Cuba: 81 = 3^{4} = 9^{2}.', 'Tahukah anda?'),
    svg(fig, 'Enam puluh empat dibahagi dua sebanyak enam kali sehingga menjadi 1, maka 64 = 2 kuasa 6'))

# 1.1-5 Situasi harian: bakteria
cnt = [2 ** h for h in range(5)]
assert cnt == [1, 2, 4, 8, 16] and 2 ** 5 == 32
fig = RECT(14, 14, 472, 442)
lv_y = [70, 150, 230, 310, 390]
prev = []
for h, yy in enumerate(lv_y):
    n = 2 ** h; xs = [28 + (k + 0.5) * 330 / n for k in range(n)]
    for k, x in enumerate(xs):
        if prev:
            fig += LINE(prev[k // 2], (x, yy), DIM, 2)
    cur = [(x, yy) for x in xs]
    prev = cur
for h, yy in enumerate(lv_y):
    n = 2 ** h; xs = [28 + (k + 0.5) * 330 / n for k in range(n)]
    rr = [15, 13, 11, 9.5, 8][h]
    for x in xs:
        fig += f'<circle cx="{r1(x)}" cy="{yy}" r="{rr}" fill="{GR}55" stroke="{GR}" stroke-width="2.5"/>'
for h, yy in enumerate(lv_y):
    if h: fig += T(470, yy - 26, f'jam {h}: 2^{{{h}}} = {2 ** h}', MU3, 15, 'end')
fig += T(470, 44, 'mula: 1 bakteria', MU3, 15, 'end')
fig += T(250, 438, 'Setiap jam: bilangan × 2', AM, 19, halo=False)
add('1.1', 'SITUASI HARIAN', 'Bakteria membahagi dua',
    P('Satu bakteria membahagi kepada dua setiap jam. Berapakah bilangan bakteria selepas 5 jam?', True)
    + TABLE(['Masa (jam)', '1', '2', '3', '4', '5'],
            [['Bilangan', '2', '4', '8', '16', '32'],
             ['Bentuk indeks', '2^{1}', '2^{2}', '2^{3}', '2^{4}', B('2^{5}', GR)]], col)
    + STEPS(['Bilangan didarab 2 setiap jam, maka selepas 5 jam: 2 × 2 × 2 × 2 × 2.',
             f'= {ASI("2", 5)} = 32'], col)
    + ANS('32 bakteria'),
    svg(fig, 'Rajah pokok: satu bakteria menjadi 2, 4, 8 dan 16 bakteria selepas 4 jam'))

# 1.1-6 Kesilapan biasa
assert 2 ** 5 == 32 and 2 * 5 == 10 and -(3 ** 2) == -9 and (-3) ** 2 == 9 and F(2, 3) ** 2 == F(4, 9) and 2 ** 3 == 8 and 3 ** 2 == 9
fig = CASES([('2^{5} = 2 × 5 = 10', False, 'darab asas dengan indeks'),
             ('2^{5} = 2 × 2 × 2 × 2 × 2 = 32', True, ''),
             ('(−3)^{2} = −9', False, 'tanda kurungan diabaikan'),
             ('(−3)^{2} = (−3) × (−3) = 9', True, ''),
             ('(2/3)^{2} = 4/3', False, 'penyebut tidak dikuasakan')], 44, 82, 62, 20, 460, 21)
fig += T(250, 446, '✓  (2/3)^{2} = 4/9', GR, 21, halo=False)
add('1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Darab asas dengan indeks", RD)} ✗ → 2^{{5}} ialah 2 × 2 × 2 × 2 × 2 = 32, bukan 10.',
         f'{B("Abaikan kurungan", RD)} ✗ → −3^{{2}} = −9 tetapi (−3)^{{2}} = 9.',
         f'{B("Kuasakan pengangka sahaja", RD)} ✗ → ({FR(2, 3)})^{{2}} = {FR(4, 9)}.',
         f'{B("Tertukar asas dengan indeks", RD)} ✗ → 2^{{3}} = 8 tetapi 3^{{2}} = 9.'], col)
    + NOTE(f'{ASI("a", "n")} = a × a × … × a (n faktor). Asas negatif atau pecahan ditulis dalam kurungan.', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan salah dan betul bagi tatatanda indeks'))

# ===================== 1.2 HUKUM INDEKS =====================
col = SUB['1.2'][1]

# 1.2-1 Hukum pendaraban
assert 2 ** 3 * 2 ** 4 == 2 ** 7 == 128 and 3 * 4 == 12
fig = RECT(14, 14, 472, 442)
fig += T(250, 50, '2^{3} × 2^{4}', TX, 30)
for k in range(3): fig += TILE(40 + k * 52, 92, '2', TR)
fig += T(214, 114, '×', MU3, 30)
for k in range(4): fig += TILE(244 + k * 52, 92, '2', PK)
fig += BRACE(40, 188, 146, TR, True, 9) + T(114, 186, '3 faktor', TR, 18)
fig += BRACE(244, 444, 146, PK, True, 9) + T(344, 186, '4 faktor', PK, 18)
fig += ARROW((250, 214), (250, 262), MU3, 3.5)
for k in range(7): fig += TILE(68 + k * 52, 280, '2', TR if k < 3 else PK)
fig += BRACE(68, 432, 334, AM, True, 9) + T(250, 374, '3 + 4 = 7 faktor', AM, 20)
fig += RECT(140, 396, 220, 50, f'{GR}1A', GR, 14) + T(250, 422, '= 2^{7} = 128', GR, 26)
add('1.2', 'HUKUM 1', 'Hukum pendaraban',
    DEF(f'a^{{m}} × a^{{n}} = a^{{<b style="color: {AM}">m + n</b>}} &nbsp;— asas sama, <b>tambah</b> indeks.', col)
    + STEPS(['2^{3} × 2^{4} = (2 × 2 × 2) × (2 × 2 × 2 × 2) = 2^{3 + 4} = <b>2^{7}</b>',
             '3<i>x</i>^{2} × 4<i>x</i>^{5} = (3 × 4)<i>x</i>^{2 + 5} = <b>12<i>x</i>^{7}</b>',
             '<i>m</i>^{4} × <i>n</i>^{2} × <i>m</i>^{3} × <i>n</i> = <i>m</i>^{4 + 3}<i>n</i>^{2 + 1} = <b><i>m</i>^{7}<i>n</i>^{3}</b>'], col)
    + NOTE('Pekali <b>didarab</b>, indeks <b>ditambah</b>. Hukum ini hanya untuk asas yang <b>sama</b>: 2^{3} × 5^{4} tidak boleh digabungkan. Ingat, <i>n</i> = <i>n</i>^{1}.'),
    svg(fig, 'Tiga petak dua darab empat petak dua menjadi tujuh petak dua, iaitu 2 kuasa 7'))

# 1.2-2 Hukum pembahagian
assert F(5 ** 6, 5 ** 2) == 5 ** 4 and 12 // 3 == 4
fig = RECT(14, 14, 472, 442) + T(250, 48, '5^{6} ÷ 5^{2}', TX, 30)
for k in range(6):
    x = 94 + k * 52
    fig += TILE(x, 92, '5', TR)
    if k < 2: fig += LINE((x - 4, 140), (x + 48, 88), RD, 4)
fig += LINE((70, 162), (430, 162), TX, 3)
for k in range(2):
    x = 198 + k * 52
    fig += TILE(x, 182, '5', TR)
    fig += LINE((x - 4, 230), (x + 48, 178), RD, 4)
fig += T(250, 268, 'Batalkan faktor sepunya', RD, 19, halo=False)
fig += ARROW((250, 290), (250, 324), MU3, 3.5)
for k in range(4): fig += TILE(146 + k * 52, 338, '5', TR)
fig += RECT(130, 398, 240, 48, f'{GR}1A', GR, 14) + T(250, 423, '= 5^{6 − 2} = 5^{4}', GR, 25)
add('1.2', 'HUKUM 2', 'Hukum pembahagian',
    DEF(f'a^{{m}} ÷ a^{{n}} = a^{{<b style="color: {AM}">m − n</b>}} &nbsp;— asas sama, <b>tolak</b> indeks.', col)
    + STEPS([f'5^{{6}} ÷ 5^{{2}} = {FR("5 × 5 × 5 × 5 × 5 × 5", "5 × 5")} = 5^{{6 − 2}} = <b>5^{{4}}</b>',
             '12<i>y</i>^{7} ÷ 3<i>y</i>^{2} = (12 ÷ 3)<i>y</i>^{7 − 2} = <b>4<i>y</i>^{5}</b>',
             f'{FR("<i>p</i>^{8}<i>q</i>^{5}", "<i>p</i>^{3}<i>q</i>")} = <i>p</i>^{{8 − 3}}<i>q</i>^{{5 − 1}} = <b><i>p</i>^{{5}}<i>q</i>^{{4}}</b>'], col)
    + NOTE('Pekali <b>dibahagi</b>, indeks <b>ditolak</b> (indeks pengangka − indeks penyebut).'),
    svg(fig, 'Enam petak lima dibahagi dua petak lima: dua pasang dibatalkan, tinggal 5 kuasa 4'))

# 1.2-3 Hukum kuasa
assert (3 ** 2) ** 3 == 3 ** 6 and (2 ** 4) == 16 and 3 * 4 == 12
fig = RECT(14, 14, 472, 442) + T(250, 48, '(3^{2})^{3}', TX, 30)
for r in range(3):
    y = 92 + r * 64
    fig += RECT(98, y - 6, 128, 60, f'{PU}14', PU, 12, 2)
    for k in range(2): fig += TILE(106 + k * 60, y, '3', TR)
    fig += T(250, y + 22, f'3^{{2}}', PU, 22, 'start')
    if r < 2: fig += T(330, y + 22, '×', MU3, 24)
fig += T(392, 156, '3 kumpulan', PU, 18) + T(392, 182, '× 2 faktor', TR, 18)
fig += ARROW((250, 292), (250, 326), MU3, 3.5)
for k in range(6): fig += TILE(94 + k * 52, 340, '3', TR)
fig += RECT(140, 398, 220, 48, f'{GR}1A', GR, 14) + T(250, 423, '= 3^{2 × 3} = 3^{6}', GR, 25)
add('1.2', 'HUKUM 3', 'Hukum kuasa',
    DEF(f'(a^{{m}})^{{n}} = a^{{<b style="color: {AM}">m × n</b>}} &nbsp;·&nbsp; (a^{{m}}b^{{n}})^{{p}} = a^{{mp}}b^{{np}} &nbsp;·&nbsp; ({FR("a^{m}", "b^{n}")})^{{p}} = {FR("a^{mp}", "b^{np}")}', col)
    + STEPS(['(3^{2})^{3} = 3^{2} × 3^{2} × 3^{2} = 3^{2 + 2 + 2} = <b>3^{6}</b>',
             '(2<i>x</i>^{3})^{4} = 2^{4} × <i>x</i>^{3 × 4} = <b>16<i>x</i>^{12}</b>',
             f'({FR("<i>p</i>^{2}", "<i>q</i>")})^{{3}} = {FR("<i>p</i>^{2 × 3}", "<i>q</i>^{1 × 3}")} = <b>{FR("<i>p</i>^{6}", "<i>q</i>^{3}")}</b>'], col)
    + NOTE('Setiap faktor di dalam kurungan, termasuk <b>pekali</b>, mesti dikuasakan: (2<i>x</i>^{3})^{4} ≠ 2<i>x</i>^{12}.'),
    svg(fig, 'Tiga kumpulan tiga kuasa dua menjadi enam petak tiga, iaitu 3 kuasa 6'))

# 1.2-4 Indeks sifar & negatif
pat = [(n, F(2) ** n) for n in range(3, -3, -1)]
assert [v for _, v in pat] == [8, 4, 2, 1, F(1, 2), F(1, 4)]
assert F(5) ** -2 == F(1, 25) and F(2, 3) ** -2 == F(9, 4) and F(2 ** 3, 2 ** 3) == 1
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Setiap langkah ke kanan: ÷ 2', AM, 20, halo=False)
base_y, sc = 330, 28
for i, (n, v) in enumerate(pat):
    x = 52 + i * 72; hh = float(v) * sc
    cl = TR if n > 0 else (GR if n == 0 else PK)
    fig += RECT(x, base_y - hh, 50, hh, f'{cl}55', cl, 6, 2.5)
    fig += T(x + 25, base_y - hh - 22, fs(v), cl, 21)
    fig += T(x + 25, base_y + 30, f'2^{{{fs(n)}}}', TX, 24)
    if i < len(pat) - 1:
        fig += f'<path d="M{x + 32} {base_y + 58} Q{x + 61} {base_y + 80} {x + 90} {base_y + 58}" fill="none" stroke="{AM}" stroke-width="2.5"/>'
fig += LINE((36, base_y), (466, base_y), MU2, 3)
fig += T(250, 428, '2^{0} = 1 · 2^{−1} = 1/2 · 2^{−2} = 1/4', MU3, 19, halo=False)
add('1.2', 'HUKUM 4', 'Indeks sifar dan indeks negatif',
    DEF(f'a^{{0}} = 1 &nbsp;&nbsp;·&nbsp;&nbsp; a^{{−n}} = {FR(1, "a^{n}")} &nbsp;&nbsp;(a ≠ 0)', col)
    + STEPS([f'Mengapa a^{{0}} = 1? &nbsp;2^{{3}} ÷ 2^{{3}} = 2^{{3 − 3}} = 2^{{0}}, tetapi juga = {FR(8, 8)} = 1.',
             f'5^{{−2}} = {FR(1, "5^{2}")} = <b>{FRV(F(1, 25))}</b>',
             f'({FR(2, 3)})^{{−2}} = ({FR(3, 2)})^{{2}} = <b>{FRV(F(9, 4))}</b> &nbsp;(songsangkan pecahan)'], col)
    + NOTE('Indeks negatif <b>tidak</b> menjadikan nilai negatif: 2^{−3} = ' + FR(1, 8) + ', bukan −8.'),
    svg(fig, 'Corak 2 kuasa 3 hingga 2 kuasa negatif 2: nilai separuh setiap langkah, 8, 4, 2, 1, setengah, suku'))

# 1.2-5 Indeks pecahan
assert iroot(8, 3) == 2 and 2 ** 2 == 4 and 8 ** 2 == 64 and iroot(64, 3) == 4
assert iroot(16, 4) == 2 and 2 ** 3 == 8 and iroot(27, 3) == 3
fig = RECT(14, 14, 472, 442)
fig += RECT(170, 34, 160, 66, f'{PU}22', PU, 16) + T(250, 76, '8^{2/3}', TX, 34)
# laluan kiri: punca dahulu
fig += ARROW((200, 104), (120, 170), TR, 3.5) + T(84, 132, 'punca kuasa', TR, 15) + T(84, 150, 'tiga dahulu', TR, 15)
fig += RECT(60, 176, 120, 60, SURF, TR, 14) + T(120, 207, '∛8 = 2', TX, 24)
fig += ARROW((120, 240), (120, 300), TR, 3.5) + T(64, 270, 'kuasa 2', TR, 15)
fig += RECT(60, 306, 120, 60, SURF, TR, 14) + T(120, 337, '2^{2} = 4', TX, 24)
# laluan kanan: kuasa dahulu
fig += ARROW((300, 104), (380, 170), PK, 3.5) + T(418, 132, 'kuasa 2', PK, 15) + T(418, 150, 'dahulu', PK, 15)
fig += RECT(320, 176, 120, 60, SURF, PK, 14) + T(380, 207, '8^{2} = 64', TX, 24)
fig += ARROW((380, 240), (380, 300), PK, 3.5) + T(440, 262, 'punca', PK, 15) + T(440, 280, 'kuasa tiga', PK, 15)
fig += RECT(320, 306, 120, 60, SURF, PK, 14) + T(380, 337, '∛64 = 4', TX, 24)
fig += ARROW((180, 368), (220, 400), GR, 3) + ARROW((320, 368), (280, 400), GR, 3)
fig += RECT(190, 402, 120, 48, f'{GR}1A', GR, 14) + T(250, 427, '4', GR, 28)
add('1.2', 'HUKUM 5', 'Indeks pecahan',
    DEF(f'a^{{1/n}} = ^{{n}}√a &nbsp;&nbsp;·&nbsp;&nbsp; a^{{m/n}} = (^{{n}}√a)^{{m}} = ^{{n}}√(a^{{m}})', col)
    + STEPS(['8^{1/3} = ∛8 = <b>2</b> &nbsp;(kerana 2^{3} = 8)',
             '8^{2/3} = (∛8)^{2} = 2^{2} = <b>4</b>',
             '16^{3/4} = (^{4}√16)^{3} = 2^{3} = <b>8</b>'], col)
    + NOTE(f'Penyebut indeks = <b>punca kuasa</b>, pengangka = <b>kuasa</b>. Cari punca kuasa dahulu supaya nombor kecil. Cuba: 27^{{−1/3}} = {FR(1, "∛27")} = {FR(1, 3)}.'),
    svg(fig, 'Lapan kuasa dua per tiga: dua laluan, punca kuasa tiga dahulu atau kuasa dua dahulu, kedua-duanya memberi 4'))

# 1.2-6 Persamaan indeks & penyelesaian masalah
assert 3 ** 4 == 81 and 3 ** (3 + 1) == 81
assert 2 ** (2 * F(3, 2)) == 8 and F(4) ** F(3, 2) == 8
assert 2 ** (2 + 3) == 32
fig = RECT(14, 14, 472, 442) + T(250, 48, 'Jika a^{m} = a^{n}, maka m = n', AM, 21, halo=False)
fig += RECT(40, 86, 180, 64, SURF, BD, 14) + T(130, 118, '3^{x + 1}', TX, 30, supcol=IN) + T(250, 118, '=', MU3, 30)
fig += RECT(280, 86, 180, 64, SURF, BD, 14) + T(370, 118, '81', TX, 30)
fig += ARROW((370, 156), (370, 196), MU3, 3) + T(462, 176, 'tulis 81 = 3^{4}', MU, 15, 'end', halo=False)
fig += RECT(40, 204, 180, 64, f'{TR}14', TR, 14) + T(130, 236, '3^{x + 1}', AS, 30, supcol=IN) + T(250, 236, '=', MU3, 30)
fig += RECT(280, 204, 180, 64, f'{TR}14', TR, 14) + T(370, 236, '3^{4}', AS, 30, supcol=IN)
fig += T(250, 294, 'asas sama → samakan indeks', TR, 17, halo=False)
fig += RECT(110, 318, 280, 60, f'{PK}14', PK, 14) + T(250, 348, 'x + 1 = 4', PK, 28)
fig += RECT(160, 396, 180, 50, f'{GR}1A', GR, 14) + T(250, 421, 'x = 3', GR, 28)
add('1.2', 'PENYELESAIAN MASALAH', 'Persamaan indeks',
    P('Selesaikan (a) 3^{<i>x</i> + 1} = 81 &nbsp;(b) 4^{<i>x</i>} = 8', True)
    + STEPS(['(a) 3^{<i>x</i> + 1} = 3^{4} → <i>x</i> + 1 = 4 → <b><i>x</i> = 3</b>',
             '(b) Tulis dengan asas 2: (2^{2})^{<i>x</i>} = 2^{3} → 2^{2<i>x</i>} = 2^{3}',
             f'2<i>x</i> = 3 → <b><i>x</i> = {FR(3, 2)}</b>'], col)
    + ANS(f'(a) <i>x</i> = 3 &nbsp;(b) <i>x</i> = {FR(3, 2)}')
    + NOTE('Bakteria berganda setiap jam: 4 bakteria × 2^{<i>t</i>} = 128 → 2^{2} × 2^{<i>t</i>} = 2^{7} → <i>t</i> = 5 jam.', 'Aplikasi:'),
    svg(fig, 'Langkah menyelesaikan 3 kuasa x tambah 1 sama dengan 81: tulis 81 sebagai 3 kuasa 4, samakan indeks, x = 3'))
assert 4 * 2 ** 5 == 128

# 1.2-7 Ringkasan & kesilapan biasa
assert 2 ** 3 * 2 ** 4 != 4 ** 7 and 5 ** 0 == 1 and F(2) ** -3 == F(1, 8) and 3 * 1 == 3
fig = CASES([('2^{3} × 2^{4} = 4^{7}', False, 'asas tidak didarab'),
             ('(x^{3})^{2} = x^{5}', False, 'indeks didarab: x^{6}'),
             ('5^{0} = 0', False, 'betul: 5^{0} = 1'),
             ('2^{−3} = −8', False, 'betul: 1/8'),
             ('3x^{0} = 3 × 1 = 3', True, 'hanya x^{0} = 1')], 44, 82, 62, 20, 460, 21)
fig += T(250, 446, '✓  2^{3} × 2^{4} = 2^{7}', GR, 21, halo=False)
add('1.2', 'RINGKASAN', 'Ringkasan hukum indeks',
    TABLE(['Hukum', 'Rumus'],
          [['Darab', 'a^{m} × a^{n} = a^{m + n}'],
           ['Bahagi', 'a^{m} ÷ a^{n} = a^{m − n}'],
           ['Kuasa', '(a^{m})^{n} = a^{mn} · (a^{m}b^{n})^{p} = a^{mp}b^{np}'],
           ['Sifar & negatif', f'a^{{0}} = 1 · a^{{−n}} = {FR(1, "a^{n}")}'],
           ['Pecahan', 'a^{m/n} = (^{n}√a)^{m} = ^{n}√(a^{m})']], col, rv=True)
    + NOTE('Semua hukum hanya untuk asas yang <b>sama</b> (a ≠ 0). Semak jawapan dengan mengira nilai nombor.', 'Ingat:'),
    svg(fig, 'Kesilapan biasa hukum indeks dan pembetulannya'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and '^{' not in js_body, 'tatatanda ^{ } tertinggal'
assert counts == {'1.1': 6, '1.2': 7}, counts

js = ('/* Dijana oleh tools/indeks/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
