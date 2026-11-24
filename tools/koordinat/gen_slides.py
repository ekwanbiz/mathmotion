# Penjana slaid NOTA KOORDINAT (Tingkatan 2 Bab 7 Koordinat) -> koordinat/slides.js
# Jalankan:  python3 tools/koordinat/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'koordinat', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# Subtopik ikut buku teks KSSM Matematik Tingkatan 2 Bab 7
SUB = {
    '7.1': ('Jarak dalam Sistem Koordinat Cartes', C['tr']),
    '7.2': ('Titik Tengah dalam Sistem Koordinat Cartes', C['gr']),
    '7.3': ('Sistem Koordinat Cartes', C['pa']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
VC, HC, DC = TR, PK, AM   # warna tetap: jarak mencancang (biru), mengufuk (merah jambu), jarak AB (kuning)

# ---------- semakan matematik ----------
def fs(fr):
    """Pecahan -> teks (tanda tolak sebenar)."""
    fr = F(fr)
    t = str(abs(fr.numerator)) if fr.denominator == 1 else f'{abs(fr.numerator)}/{fr.denominator}'
    return ('−' if fr < 0 else '') + t

# ---------- pembantu teks ----------
def P(t, sm=False):
    return f'<p class="sl-p{" sm" if sm else ""}">{t}</p>'
def DEF(t, col):
    return f'<div class="sl-def" style="--c:{col}"><p>{t}</p></div>'
def BUL(items, col):
    return f'<ul class="sl-bul" style="--c:{col}">' + ''.join(f'<li><span>{i}</span></li>' for i in items) + '</ul>'
def STEPS(items, col):
    return f'<ol class="sl-steps" style="--c:{col}">' + ''.join(
        f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n, t in enumerate(items, 1)) + '</ol>'
def ANS(t):
    return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t, lab='Ingat:'):
    return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def FR(a, b):
    """Pecahan bertingkat dalam teks slaid."""
    return ('<span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; '
            'line-height: 1.1; font-size: 0.85em; margin: 0 2px; white-space: nowrap"><span style="padding: 0 4px; border-bottom: 2px solid currentColor">'
            f'{a}</span><span>{b}</span></span>')
def FRV(fr):
    """Nilai Fraction sebagai pecahan bertingkat (atau nombor bulat)."""
    fr = F(fr)
    if fr.denominator == 1: return fs(fr)
    return ('−' if fr < 0 else '') + FR(abs(fr.numerator), fr.denominator)
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'

def r1(v): return round(v, 1)

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')

def SFR(x, y, a, b, col=TX, size=20, pre=''):
    """Pecahan bertingkat dalam SVG; pre = teks di kiri (cth 'm = ')."""
    w = max(len(str(a)), len(str(b))) * size * 0.62 + 8
    s = ''
    if pre:
        s += T(x - w / 2 - 4, y, pre, col, size, 'end')
    s += T(x, y - size * 0.62, a, col, size) + T(x, y + size * 0.68, b, col, size)
    s += LINE((x - w / 2, y), (x + w / 2, y), col, 2.5)
    return s

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

def right_angle(M, u, v, col=TX, k=15):
    a = (M[0] + u[0] * k, M[1] + u[1] * k)
    b = (a[0] + v[0] * k, a[1] + v[1] * k)
    c = (M[0] + v[0] * k, M[1] + v[1] * k)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} L{r1(c[0])} {r1(c[1])}" fill="none" stroke="{col}" stroke-width="2.5"/>'

def ARROW(p, q, col, sw=3.5, head=12):
    """Anak panah dari p ke q."""
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

class Plane:
    """Satah Cartes [x0,x1] x [y0,y1] dimuatkan dalam kotak (L, T, R, B) piksel, skala sama."""
    def __init__(self, x0, x1, y0, y1, box=(28, 22, 480, 448)):
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1
        L, Tp, R, Bm = box
        self.s = min((R - L) / (x1 - x0), (Bm - Tp) / (y1 - y0))
        self.ox = (L + R) / 2 - self.s * (x0 + x1) / 2
        self.oy = (Tp + Bm) / 2 + self.s * (y0 + y1) / 2
    def X(self, x): return self.ox + self.s * x
    def Y(self, y): return self.oy - self.s * y
    def p(self, x, y): return (self.X(x), self.Y(y))
    def draw(self, nums=True, step=1, fs_=15):
        s = ''
        for i in range(math.ceil(self.x0), math.floor(self.x1) + 1):
            s += LINE(self.p(i, self.y0), self.p(i, self.y1), GRID, 1.5, cap='butt')
        for j in range(math.ceil(self.y0), math.floor(self.y1) + 1):
            s += LINE(self.p(self.x0, j), self.p(self.x1, j), GRID, 1.5, cap='butt')
        s += ARROW(self.p(self.x0, 0), (self.X(self.x1) + 6, self.Y(0)), MU, 2.5, 10)
        s += ARROW(self.p(0, self.y0), (self.X(0), self.Y(self.y1) - 6), MU, 2.5, 10)
        s += T(self.X(self.x1) - 4, self.Y(0) - 16, 'x', MU, 18, italic=True)
        s += T(self.X(0) + 16, self.Y(self.y1) + 4, 'y', MU, 18, italic=True)
        if nums:
            for i in range(math.ceil(self.x0), math.floor(self.x1) + 1):
                if i != 0 and i % step == 0:
                    s += T(self.X(i), self.Y(0) + 15, fs(i), MU2, fs_, weight=600)
            for j in range(math.ceil(self.y0), math.floor(self.y1) + 1):
                if j != 0 and j % step == 0:
                    s += T(self.X(0) - 9, self.Y(j), fs(j), MU2, fs_, 'end', weight=600)
            s += T(self.X(0) - 9, self.Y(0) + 14, '0', MU2, fs_, 'end', weight=600)
        return s
    def line(self, p, q, col=AM, sw=4.5, ext=True):
        """Garis lurus melalui titik p, q (koordinat), dipotong pada sempadan satah."""
        (a, b), (c, d) = p, q
        if not ext: return LINE(self.p(a, b), self.p(c, d), col, sw)
        if a == c:
            return LINE(self.p(a, self.y0), self.p(a, self.y1), col, sw)
        m = (d - b) / (c - a)
        pts = []
        for x in (self.x0, self.x1):
            y = b + m * (x - a)
            if self.y0 - 1e-9 <= y <= self.y1 + 1e-9: pts.append((x, y))
        if m != 0:
            for y in (self.y0, self.y1):
                x = a + (y - b) / m
                if self.x0 - 1e-9 <= x <= self.x1 + 1e-9: pts.append((x, y))
        pts = sorted(set((round(x, 6), round(y, 6)) for x, y in pts))
        return LINE(self.p(*pts[0]), self.p(*pts[-1]), col, sw)
    def rise_run(self, p, q, vlab, hlab, vside=1, hside=1, size=19):
        """Segi tiga kecerunan: mengufuk dari p ke (q.x, p.y), mencancang ke q."""
        c = (q[0], p[1])
        s = POLY([self.p(*p), self.p(*c), self.p(*q)], f'{AM}1A')
        s += LINE(self.p(*p), self.p(*c), HC, 5) + LINE(self.p(*c), self.p(*q), VC, 5)
        ux = -1 if q[0] > p[0] else 1; uy = 1 if q[1] > p[1] else -1
        s += right_angle(self.p(*c), (ux, 0), (0, -uy), TX, 13)
        mx = (p[0] + q[0]) / 2; my = (p[1] + q[1]) / 2
        # label mengufuk: di sisi luar segi tiga
        off = 20 if q[1] > p[1] else -20
        s += T(self.X(mx), self.Y(p[1]) + off * hside, hlab, HC, size)
        s += T(self.X(q[0]) + (14 if q[0] > p[0] else -14) * vside, self.Y(my), vlab, VC, size,
               'start' if (q[0] > p[0]) == (vside > 0) else 'end')
        return s
    def pt(self, x, y, lab, col=TX, dx=0, dy=-22, anchor='middle', size=18):
        return DOT(self.p(x, y), col) + (T(self.X(x) + dx, self.Y(y) + dy, lab, col, size, anchor) if lab else '')


# ---------- pembantu khusus bab ----------
def SQ(t):
    """Punca kuasa dua dengan garis atas (teks slaid)."""
    return f'√<span style="border-top: 2px solid currentColor; padding: 0 3px">{t}</span>'
def pm(v):
    """Nombor dengan kurungan jika negatif (−)."""
    return f'({fs(v)})' if v < 0 else fs(v)
def dist(p, q):
    return math.hypot(q[0] - p[0], q[1] - p[1])
def d2(p, q):
    return (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2
def mid(p, q):
    return (F(p[0] + q[0], 2), F(p[1] + q[1], 2))
def CO(p):
    return f'({fs(p[0])}, {fs(p[1])})'
def f2(v):
    return f'{v:.2f}'
JR = f'{SQ("(<i>x</i>₂ − <i>x</i>₁)² + (<i>y</i>₂ − <i>y</i>₁)²")}'
TT = f'({FR("<i>x</i>₁ + <i>x</i>₂", 2)}, {FR("<i>y</i>₁ + <i>y</i>₂", 2)})'

def ticks(pl, p, q, n, col=TX):
    """Tanda sama panjang (n garis kecil) di tengah segmen p-q."""
    a, b = pl.p(*p), pl.p(*q)
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy)
    ux, uy = dx / L, dy / L; nx, ny = -uy, ux
    s = ''
    for k in range(n):
        o = (k - (n - 1) / 2) * 7
        c = (mx + ux * o, my + uy * o)
        s += LINE((c[0] + nx * 9, c[1] + ny * 9), (c[0] - nx * 9, c[1] - ny * 9), col, 3)
    return s

def legs(pl, p, q, hlab, vlab, dlab=None, fill=True, size=18, hoff=None, voff=None, doff=None):
    """Segi tiga Pythagoras: mengufuk p->(q.x,p.y), mencancang ->q, jarak p-q."""
    c = (q[0], p[1])
    s = POLY([pl.p(*p), pl.p(*c), pl.p(*q)], f'{AM}14') if fill else ''
    s += LINE(pl.p(*p), pl.p(*c), HC, 5) + LINE(pl.p(*c), pl.p(*q), VC, 5) + LINE(pl.p(*p), pl.p(*q), DC, 6)
    ux = -1 if q[0] > p[0] else 1; uy = 1 if q[1] > p[1] else -1
    s += right_angle(pl.p(*c), (ux, 0), (0, -uy), TX, 13)
    mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
    ho = hoff if hoff is not None else (22 if q[1] > p[1] else -22)
    s += T(pl.X(mx), pl.Y(p[1]) + ho, hlab, HC, size)
    vo = voff if voff is not None else (14 if q[0] > p[0] else -14)
    s += T(pl.X(q[0]) + vo, pl.Y(my), vlab, VC, size, 'start' if vo > 0 else 'end')
    if dlab:
        dx, dy = doff if doff else (-18, -18)
        s += T(pl.X(mx) + dx, pl.Y(my) + dy, dlab, DC, size, 'end' if dx < 0 else 'start')
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 7.1 JARAK =====================
col = SUB['7.1'][1]

# 7.1-1 Definisi
A_, B_ = (1, 1), (4, 5)
assert dist(A_, B_) == 5
pl = Plane(-1, 6, -1, 6)
fig = (pl.draw() + LINE(pl.p(*A_), pl.p(*B_), DC, 7)
       + T(pl.X(2.5) - 16, pl.Y(3) - 14, '5 unit', DC, 21, 'end')
       + pl.pt(*A_, 'A(1, 1)', TX, 14, 16, 'start') + pl.pt(*B_, 'B(4, 5)', TX, 14, -6, 'start'))
add('7.1', 'DEFINISI', 'Jarak antara dua titik',
    DEF('<b>Jarak</b> antara dua titik ialah <b>panjang garis lurus</b> yang menyambungkan kedua-dua titik itu.', col)
    + BUL(['Jarak sentiasa bernilai <b>positif</b>.',
           'Unit jarak ialah <b>unit</b>, atau km, m dan sebagainya mengikut skala peta.',
           'Jarak AB = jarak BA.'], col)
    + NOTE('Satah Cartes mempunyai paksi-<i>x</i> (mengufuk) dan paksi-<i>y</i> (mencancang). Titik ditulis (<i>x</i>, <i>y</i>).'),
    svg(fig, 'Garis lurus AB sepanjang 5 unit pada satah Cartes'))

# 7.1-2 Jarak mengufuk & mencancang
P_, Q_, R_, S_ = (-3, 3), (4, 3), (2, -3), (2, 1)
assert Q_[0] - P_[0] == 7 and S_[1] - R_[1] == 4
pl = Plane(-4, 5, -4, 5)
fig = (pl.draw() + LINE(pl.p(*P_), pl.p(*Q_), HC, 6) + LINE(pl.p(*R_), pl.p(*S_), VC, 6)
       + T(pl.X(0.5), pl.Y(3) - 20, '7 unit', HC, 20)
       + T(pl.X(2) + 14, pl.Y(-1), '4 unit', VC, 20, 'start')
       + pl.pt(*P_, 'P(−3, 3)', TX, 0, 24) + pl.pt(*Q_, 'Q(4, 3)', TX, 0, 24)
       + pl.pt(*R_, 'R(2, −3)', TX, -12, 0, 'end') + pl.pt(*S_, 'S(2, 1)', TX, -12, 0, 'end'))
add('7.1', 'KONSEP', 'Jarak mengufuk dan mencancang',
    BUL([f'{B("Garis mengufuk", HC)} (koordinat-<i>y</i> sama): jarak = beza koordinat-<i>x</i>.',
         f'{B("Garis mencancang", VC)} (koordinat-<i>x</i> sama): jarak = beza koordinat-<i>y</i>.'], col)
    + STEPS([f'PQ = 4 − (−3) = {B("7 unit", HC)}',
             f'RS = 1 − (−3) = {B("4 unit", VC)}'], col)
    + NOTE('Tolak nilai yang <b>besar</b> dengan nilai yang <b>kecil</b>, atau kira petak pada grid.'),
    svg(fig, 'Garis mengufuk PQ sepanjang 7 unit dan garis mencancang RS sepanjang 4 unit'))

# 7.1-3 Rumus jarak (Pythagoras)
A_, B_ = (-2, -1), (4, 7)
assert d2(A_, B_) == 100 and dist(A_, B_) == 10
pl = Plane(-3, 5, -2, 8, (40, 22, 470, 448))
fig = (pl.draw() + legs(pl, A_, B_, 'x₂ − x₁ = 6', 'y₂ − y₁ = 8', 'AB = 10', hoff=22, voff=-14, doff=(-18, 0))
       + pl.pt(*A_, 'A(x₁, y₁)', TX, -10, 22, 'end') + pl.pt(*B_, 'B(x₂, y₂)', TX, -12, -6, 'end')
       + pl.pt(4, -1, 'C', TX, 14, 18, 'start'))
add('7.1', 'RUMUS', 'Rumus jarak dan Teorem Pythagoras',
    P('AB ialah hipotenus bagi segi tiga bersudut tegak ABC. Mengikut Teorem Pythagoras, AB² = AC² + BC².', True)
    + DEF(f'Jarak AB = {JR}', col)
    + STEPS([f'AC = 4 − (−2) = {B("6", HC)} &nbsp;·&nbsp; BC = 7 − (−1) = {B("8", VC)}',
             f'AB = {SQ("6² + 8²")} = {SQ("100")} = 10 unit'], col)
    + NOTE('Rumus jarak ialah Teorem Pythagoras yang ditulis dengan koordinat.'),
    svg(fig, 'Segi tiga bersudut tegak ABC dengan sisi 6 dan 8 serta hipotenus AB = 10'))

# 7.1-4 Contoh 1
P_, Q_ = (-2, 3), (4, -5)
assert d2(P_, Q_) == 100
pl = Plane(-3, 5, -6, 4)
fig = (pl.draw() + legs(pl, P_, Q_, '6', '8', '10', hoff=-20, voff=14, doff=(-14, 14))
       + pl.pt(*P_, 'P(−2, 3)', TX, 0, -22) + pl.pt(*Q_, 'Q(4, −5)', TX, -12, 4, 'end'))
add('7.1', 'CONTOH BERLANGKAH', 'Mengira jarak (1)',
    P('Hitung jarak antara titik P(−2, 3) dan titik Q(4, −5).')
    + STEPS(['(<i>x</i>₁, <i>y</i>₁) = (−2, 3), (<i>x</i>₂, <i>y</i>₂) = (4, −5)',
             f'PQ = {SQ("(4 − (−2))² + (−5 − 3)²")}',
             f'= {SQ("6² + (−8)²")} = {SQ("36 + 64")}',
             f'= {SQ("100")} = 10'], col)
    + ANS('PQ = 10 unit'),
    svg(fig, 'Garis PQ dengan jarak mengufuk 6 dan jarak mencancang 8'))

# 7.1-5 Contoh 2 (perpuluhan)
K_, L_ = (-3, -1), (2, 3)
assert d2(K_, L_) == 41 and f2(math.sqrt(41)) == '6.40'
pl = Plane(-4, 3, -2, 4)
fig = (pl.draw() + legs(pl, K_, L_, '5', '4', '√41', hoff=24, voff=-14, doff=(-14, -14))
       + pl.pt(*K_, 'K(−3, −1)', TX, 0, 26) + pl.pt(*L_, 'L(2, 3)', TX, 14, -14, 'start'))
add('7.1', 'CONTOH BERLANGKAH', 'Mengira jarak (2)',
    P('Hitung jarak antara K(−3, −1) dan L(2, 3), betul kepada dua tempat perpuluhan.', True)
    + STEPS([f'KL = {SQ("(2 − (−3))² + (3 − (−1))²")}',
             f'= {SQ("5² + 4²")} = {SQ("25 + 16")} = {SQ("41")}',
             '= 6.403… ≈ 6.40'], col)
    + ANS('KL = 6.40 unit')
    + NOTE('Jika jawapan bukan nombor bulat, guna kalkulator dan bundarkan seperti yang diminta.'),
    svg(fig, 'Garis KL dengan jarak mengufuk 5 dan jarak mencancang 4'))

# 7.1-6 Kesilapan biasa
A_, B_ = (-1, 2), (3, -1)
assert d2(A_, B_) == 25 and 4 + 3 == 7 and 4 ** 2 - 3 ** 2 == 7
pl = Plane(-2, 4, -2, 3, (60, 14, 440, 262))
fig = (legs(pl, A_, B_, '4', '−3', '5', hoff=-20, voff=14, doff=(-12, 14))
       + pl.pt(*A_, 'A(−1, 2)', TX, 0, -22) + pl.pt(*B_, 'B(3, −1)', TX, 0, 24))
rowsY = [(312, True, '√(4² + (−3)²) = 5', 'betul'), (362, False, '4 + 3 = 7', 'tambah terus'),
         (412, False, '√(4² − 3²) = √7', 'tolak kuasa dua'), (462 - 2, False, '(−3)² = −9', 'tanda salah')]
fig2 = ''
for y, ok, a, why in rowsY:
    fig2 += RECT(30, y - 21, 440, 42, SURF, GR if ok else RD, 12, 2)
    fig2 += (TICK(56, y) if ok else CROSS(56, y))
    fig2 += T(82, y, a, GR if ok else RD, 19, 'start') + T(452, y, why, MU, 16, 'end')
add('7.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    P('Jarak antara A(−1, 2) dan B(3, −1):', True)
    + BUL([f'{B("Tambah terus", RD)} jarak mengufuk dan mencancang ✗',
           f'{B("Tolak", RD)} kuasa dua: rumus ialah <b>tambah</b> kuasa dua ✗',
           f'{B("Kuasa dua nombor negatif", RD)}: (−3)² = 9, bukan −9 ✗'], col)
    + NOTE(f'Jarak = {JR}. Kuasa dua dahulu, tambah, kemudian punca kuasa dua.', 'Ringkasan:'),
    svg(fig + fig2, 'Contoh jawapan betul dan salah bagi jarak antara A(−1, 2) dan B(3, −1)', 486))

# ===================== 7.2 TITIK TENGAH =====================
col = SUB['7.2'][1]
MC = GR

# 7.2-1 Definisi
A_, B_ = (-2, -1), (4, 3)
M_ = mid(A_, B_); assert M_ == (1, 1) and d2(A_, M_) == d2(M_, B_) == 13
pl = Plane(-3, 5, -2, 4)
fig = (pl.draw() + LINE(pl.p(*A_), pl.p(*B_), AM, 6) + ticks(pl, A_, M_, 2) + ticks(pl, M_, B_, 2)
       + pl.pt(*A_, 'A', TX, -14, 0, 'end') + pl.pt(*B_, 'B', TX, 14, 0, 'start')
       + DOT(pl.p(*M_), MC, 9) + T(pl.X(1) - 4, pl.Y(1) + 30, 'M (titik tengah)', MC, 19, 'start'))
add('7.2', 'DEFINISI', 'Apa itu titik tengah?',
    DEF('<b>Titik tengah</b> ialah titik yang membahagikan suatu garis lurus kepada <b>dua bahagian yang sama panjang</b>.', col)
    + BUL(['Jika M ialah titik tengah AB, maka <b>AM = MB</b>.',
           'Titik tengah terletak <b>pada</b> garis AB, di tengah-tengahnya.'], col)
    + NOTE('Tanda garis kecil yang sama (∥) pada rajah menunjukkan dua panjang yang sama.'),
    svg(fig, 'Garis AB dengan titik tengah M; AM sama panjang dengan MB'))

# 7.2-2 Mengufuk & mencancang
A_, B_, C_, D_ = (-4, 4), (2, 4), (3, -3), (3, 5)
M1, M2 = mid(A_, B_), mid(C_, D_); assert M1 == (-1, 4) and M2 == (3, 1)
pl = Plane(-5, 5, -4, 6)
fig = (pl.draw() + LINE(pl.p(*A_), pl.p(*B_), HC, 6) + LINE(pl.p(*C_), pl.p(*D_), VC, 6)
       + ticks(pl, A_, M1, 1) + ticks(pl, M1, B_, 1) + ticks(pl, C_, M2, 2) + ticks(pl, M2, D_, 2)
       + pl.pt(*A_, 'A(−4, 4)', TX, 0, -22) + pl.pt(*B_, 'B(2, 4)', TX, 0, -22)
       + pl.pt(*C_, 'C(3, −3)', TX, 14, 4, 'start') + pl.pt(*D_, 'D(3, 5)', TX, 14, 4, 'start')
       + DOT(pl.p(*M1), MC, 9) + T(pl.X(-1), pl.Y(4) + 26, '(−1, 4)', MC, 18)
       + DOT(pl.p(*M2), MC, 9) + T(pl.X(3) - 14, pl.Y(1), '(3, 1)', MC, 18, 'end'))
add('7.2', 'KONSEP', 'Titik tengah garis mengufuk dan mencancang',
    BUL([f'{B("Garis mengufuk", HC)}: koordinat-<i>y</i> kekal. Cari nilai tengah koordinat-<i>x</i>.',
         f'{B("Garis mencancang", VC)}: koordinat-<i>x</i> kekal. Cari nilai tengah koordinat-<i>y</i>.'], col)
    + STEPS([f'AB: <i>x</i> = {FR("−4 + 2", 2)} = −1 → titik tengah {B("(−1, 4)", MC)}',
             f'CD: <i>y</i> = {FR("−3 + 5", 2)} = 1 → titik tengah {B("(3, 1)", MC)}'], col)
    + NOTE('Nilai tengah dua nombor = hasil tambah dua nombor itu ÷ 2.'),
    svg(fig, 'Titik tengah bagi garis mengufuk AB dan garis mencancang CD'))

# 7.2-3 Rumus
P_, Q_ = (-2, -1), (4, 5)
M_ = mid(P_, Q_); assert M_ == (1, 2)
pl = Plane(-3, 5, -2, 6)
fig = pl.draw() + LINE(pl.p(*P_), pl.p(*Q_), AM, 6)
for (x, y), c in ((P_, MU3), (Q_, MU3), (M_, MC)):
    fig += LINE(pl.p(x, y), pl.p(x, 0), c, 2.5, '6 6') + LINE(pl.p(x, y), pl.p(0, y), c, 2.5, '6 6')
fig += (pl.pt(*P_, 'P(x₁, y₁)', TX, 14, 16, 'start') + pl.pt(*Q_, 'Q(x₂, y₂)', TX, -14, -6, 'end')
        + DOT(pl.p(*M_), MC, 9) + T(pl.X(1) + 16, pl.Y(2) + 20, 'M(1, 2)', MC, 20, 'start'))
add('7.2', 'RUMUS', 'Rumus titik tengah',
    P('Titik tengah bagi garis yang menyambungkan P(<i>x</i>₁, <i>y</i>₁) dan Q(<i>x</i>₂, <i>y</i>₂):', True)
    + DEF(f'Titik tengah, M = {TT}', col)
    + BUL(['Koordinat-<i>x</i> titik tengah = purata koordinat-<i>x</i>.',
           'Koordinat-<i>y</i> titik tengah = purata koordinat-<i>y</i>.'], col)
    + STEPS([f'P(−2, −1), Q(4, 5): M = ({FR("−2 + 4", 2)}, {FR("−1 + 5", 2)}) = (1, 2)'], col),
    svg(fig, 'Titik tengah M(1, 2) bagi garis P(−2, −1) ke Q(4, 5)'))

# 7.2-4 Contoh
A_, B_ = (-3, 4), (5, -2)
M_ = mid(A_, B_); assert M_ == (1, 1)
pl = Plane(-4, 6, -3, 5)
fig = (pl.draw() + LINE(pl.p(*A_), pl.p(*B_), AM, 6) + ticks(pl, A_, M_, 2) + ticks(pl, M_, B_, 2)
       + pl.pt(*A_, 'A(−3, 4)', TX, 0, -22) + pl.pt(*B_, 'B(5, −2)', TX, -10, 26)
       + DOT(pl.p(*M_), MC, 9) + T(pl.X(1) + 14, pl.Y(1) - 22, 'M(1, 1)', MC, 20, 'start'))
add('7.2', 'CONTOH BERLANGKAH', 'Mencari titik tengah',
    P('Cari koordinat titik tengah bagi garis lurus yang menyambungkan A(−3, 4) dan B(5, −2).')
    + STEPS([f'M = ({FR("<i>x</i>₁ + <i>x</i>₂", 2)}, {FR("<i>y</i>₁ + <i>y</i>₂", 2)})',
             f'= ({FR("−3 + 5", 2)}, {FR("4 + (−2)", 2)})',
             f'= ({FR(2, 2)}, {FR(2, 2)}) = (1, 1)'], col)
    + ANS('Titik tengah = (1, 1)'),
    svg(fig, 'Titik tengah M(1, 1) bagi garis A(−3, 4) ke B(5, −2)'))

# 7.2-5 Cari hujung
P_, M_ = (-1, 4), (2, 1)
Q_ = (2 * M_[0] - P_[0], 2 * M_[1] - P_[1]); assert Q_ == (5, -2) and mid(P_, Q_) == M_
pl = Plane(-2, 6, -3, 5)
fig = (pl.draw() + LINE(pl.p(*P_), pl.p(*M_), AM, 6) + LINE(pl.p(*M_), pl.p(*Q_), AM, 4, '9 7')
       + ARROW(pl.p(-1, -2.3), (pl.X(2) - 4, pl.Y(-2.3)), PK, 3, 10)
       + T(pl.X(0.5), pl.Y(-2.3) + 18, '+3', PK, 17)
       + pl.pt(*P_, 'P(−1, 4)', TX, 0, -22) + pl.pt(*Q_, 'Q(?, ?)', PU, -12, 2, 'end')
       + DOT(pl.p(*M_), MC, 9) + T(pl.X(2) + 16, pl.Y(1) - 14, 'M(2, 1)', MC, 20, 'start')
       + T(pl.X(5) - 4, pl.Y(-2) + 30, '= (5, −2)', PU, 18, 'end'))
add('7.2', 'CONTOH BERLANGKAH', 'Mencari titik hujung',
    P('M(2, 1) ialah titik tengah PQ. Diberi P(−1, 4), cari koordinat Q.', True)
    + STEPS([f'Katakan Q(<i>x</i>, <i>y</i>): {FR("−1 + <i>x</i>", 2)} = 2 dan {FR("4 + <i>y</i>", 2)} = 1',
             '−1 + <i>x</i> = 4 → <i>x</i> = 5',
             '4 + <i>y</i> = 2 → <i>y</i> = −2'], col)
    + ANS('Q(5, −2)')
    + NOTE('Cara cepat: dari P ke M bergerak (+3, −3). Ulangi dari M: Q = (2 + 3, 1 − 3).'),
    svg(fig, 'Titik tengah M(2, 1) dan hujung P(−1, 4); hujung Q dicari'))

# 7.2-6 Kesilapan biasa
A_, B_ = (2, 7), (8, 3)
assert mid(A_, B_) == (5, 5) and (F(8 - 2, 2), F(3 - 7, 2)) == (3, -2)
pl = Plane(0, 9, 1, 8, (60, 14, 440, 262))
fig = (pl.draw(fs_=13) + LINE(pl.p(*A_), pl.p(*B_), AM, 6) + DOT(pl.p(5, 5), MC, 9)
       + pl.pt(*A_, 'A(2, 7)', TX, 0, -20) + pl.pt(*B_, 'B(8, 3)', TX, 0, 22)
       + T(pl.X(5) + 14, pl.Y(5) - 18, '(5, 5)', MC, 18, 'start'))
rowsY = [(312, True, '((2 + 8)/2, (7 + 3)/2) = (5, 5)', 'betul'), (362, False, '((8 − 2)/2, (3 − 7)/2) = (3, −2)', 'tolak'),
         (412, False, '(2 + 8, 7 + 3) = (10, 10)', 'lupa ÷ 2'), (460, False, '((2 + 7)/2, (8 + 3)/2)', 'campur x, y')]
for y, ok, a, why in rowsY:
    fig += RECT(30, y - 21, 440, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(56, y) if ok else CROSS(56, y))
    fig += T(82, y, a, GR if ok else RD, 17, 'start') + T(456, y, why, MU, 15, 'end')
add('7.2', 'KESILAPAN BIASA', 'Semak kiraan anda',
    P('Titik tengah bagi A(2, 7) dan B(8, 3):', True)
    + BUL([f'{B("Menolak", RD)} koordinat: titik tengah guna <b>tambah</b> ✗',
           f'{B("Lupa bahagi 2", RD)} ✗',
           f'{B("Mencampurkan", RD)} koordinat-<i>x</i> dengan koordinat-<i>y</i> ✗',
           f'Mencari hujung: Q ≠ {FR("A + M", 2)}. Selesaikan persamaan {FR("<i>x</i>₁ + <i>x</i>", 2)} = <i>x</i> titik tengah.'], col)
    + NOTE(f'Titik tengah = {TT}', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi titik tengah A(2, 7) dan B(8, 3)', 486))

# ===================== 7.3 SISTEM KOORDINAT CARTES =====================
col = SUB['7.3'][1]

# 7.3-1 Strategi
pl = Plane(-1, 7, -1, 6, (40, 14, 470, 300))
Aq, Bq, Cq, Dq = (0, 0), (5, 0), (6, 4), (1, 4)
Mq = mid(Aq, Cq); assert Mq == mid(Bq, Dq) == (3, 2)
fig = (pl.draw(fs_=13) + POLY([pl.p(*Aq), pl.p(*Bq), pl.p(*Cq), pl.p(*Dq)], f'{PA}22', PA, 4)
       + LINE(pl.p(*Aq), pl.p(*Cq), MU3, 2.5, '7 6') + LINE(pl.p(*Bq), pl.p(*Dq), MU3, 2.5, '7 6')
       + DOT(pl.p(*Mq), MC, 8)
       + T(pl.X(0) - 8, pl.Y(0) + 18, 'A', TX, 18, 'end') + T(pl.X(5) + 4, pl.Y(0) + 20, 'B', TX, 18, 'start')
       + T(pl.X(6) + 10, pl.Y(4) - 10, 'C', TX, 18, 'start') + T(pl.X(1) - 8, pl.Y(4) - 14, 'D', TX, 18, 'end'))
cards = [('Panjang sisi, perimeter', 'rumus jarak', TR), ('Sama kaki, rombus', 'bandingkan jarak', PU), ('Pusat, pepenjuru', 'rumus titik tengah', GR)]
for i, (a, b, c) in enumerate(cards):
    y = 330 + i * 46
    fig += RECT(20, y - 20, 460, 40, SURF, c, 12, 2) + T(36, y, a, TX, 17, 'start') + T(464, y, '→ ' + b, c, 17, 'end')
add('7.3', 'STRATEGI', 'Menyelesaikan masalah koordinat',
    STEPS(['<b>Fahami</b>: plot titik pada satah Cartes dan kenal pasti bentuknya.',
           '<b>Rancang</b>: pilih rumus jarak atau rumus titik tengah.',
           '<b>Laksana</b>: ganti koordinat dan kira dengan teliti.',
           '<b>Semak</b>: adakah jawapan munasabah dengan rajah?'], col)
    + NOTE('Pepenjuru segi empat selari (termasuk segi empat tepat dan rombus) <b>membahagi dua sama</b> antara satu sama lain, jadi titik tengahnya sama.'),
    svg(fig, 'Segi empat selari ABCD dengan pepenjuru bertemu di titik tengah, dan panduan memilih rumus', 486))

# 7.3-2 Perimeter & luas segi tiga
A_, B_, C_ = (-2, -1), (4, -1), (4, 7)
ab, bc, ac = dist(A_, B_), dist(B_, C_), dist(A_, C_)
assert (ab, bc, ac) == (6, 8, 10) and ab + bc + ac == 24 and ab * bc / 2 == 24
pl = Plane(-3, 5, -2, 8, (40, 22, 470, 448))
fig = (pl.draw() + POLY([pl.p(*A_), pl.p(*B_), pl.p(*C_)], f'{PA}22', PA, 5)
       + right_angle(pl.p(*B_), (-1, 0), (0, -1), TX, 13)
       + T(pl.X(1), pl.Y(-1) + 22, '6', HC, 20) + T(pl.X(4) + 14, pl.Y(3), '8', VC, 20, 'start')
       + T(pl.X(1) - 14, pl.Y(3) - 14, '10', DC, 20, 'end')
       + pl.pt(*A_, 'A(−2, −1)', TX, 0, 26) + pl.pt(*B_, 'B(4, −1)', TX, 0, 26) + pl.pt(*C_, 'C(4, 7)', TX, -14, -4, 'end'))
add('7.3', 'CONTOH BERLANGKAH', 'Perimeter dan luas segi tiga',
    P('Bucu segi tiga ABC ialah A(−2, −1), B(4, −1) dan C(4, 7). Hitung perimeter dan luas segi tiga itu.', True)
    + STEPS([f'AB = 4 − (−2) = 6 unit, BC = 7 − (−1) = 8 unit',
             f'AC = {SQ("6² + 8²")} = {SQ("100")} = 10 unit',
             'Perimeter = 6 + 8 + 10 = 24 unit',
             f'Luas = {FR(1, 2)} × 6 × 8 = 24 unit²'], col)
    + ANS('Perimeter = 24 unit, luas = 24 unit²'),
    svg(fig, 'Segi tiga bersudut tegak ABC dengan sisi 6, 8 dan 10'))

# 7.3-3 Segi tiga sama kaki
P_, Q_, R_ = (-3, 0), (3, 0), (0, 4)
assert dist(P_, R_) == dist(Q_, R_) == 5 and dist(P_, Q_) == 6
pl = Plane(-4, 4, -2, 5)
fig = (pl.draw() + POLY([pl.p(*P_), pl.p(*Q_), pl.p(*R_)], f'{PU}22', PU, 5)
       + ticks(pl, P_, R_, 1) + ticks(pl, Q_, R_, 1)
       + T(pl.X(-1.5) - 20, pl.Y(2) - 8, '5', DC, 22, 'end') + T(pl.X(1.5) + 20, pl.Y(2) - 8, '5', DC, 22, 'start')
       + pl.pt(*P_, 'P(−3, 0)', TX, 0, 26) + pl.pt(*Q_, 'Q(3, 0)', TX, 0, 26) + pl.pt(*R_, 'R(0, 4)', TX, 14, -16, 'start'))
add('7.3', 'CONTOH BERLANGKAH', 'Membuktikan segi tiga sama kaki',
    P('Tunjukkan bahawa segi tiga PQR dengan P(−3, 0), Q(3, 0) dan R(0, 4) ialah segi tiga sama kaki.', True)
    + STEPS([f'PR = {SQ("(0 − (−3))² + (4 − 0)²")} = {SQ("9 + 16")} = 5 unit',
             f'QR = {SQ("(0 − 3)² + (4 − 0)²")} = {SQ("9 + 16")} = 5 unit',
             'PR = QR, iaitu dua sisi sama panjang.'], col)
    + ANS('PQR ialah segi tiga sama kaki')
    + NOTE('Perimeter PQR = 5 + 5 + 6 = 16 unit.'),
    svg(fig, 'Segi tiga sama kaki PQR dengan PR = QR = 5'))

# 7.3-4 Segi empat selari
A_, B_, C_ = (-3, -1), (3, -1), (5, 3)
Mx = mid(A_, C_); D_ = (2 * Mx[0] - B_[0], 2 * Mx[1] - B_[1])
assert Mx == (1, 1) and D_ == (-1, 3) and mid(B_, D_) == Mx
assert (B_[0] - A_[0], B_[1] - A_[1]) == (C_[0] - D_[0], C_[1] - D_[1])
pl = Plane(-4, 6, -2, 4)
fig = (pl.draw() + POLY([pl.p(*A_), pl.p(*B_), pl.p(*C_), pl.p(*D_)], f'{PA}22', PA, 5)
       + LINE(pl.p(*A_), pl.p(*C_), MU3, 2.5, '7 6') + LINE(pl.p(*B_), pl.p(*D_), MU3, 2.5, '7 6')
       + DOT(pl.p(*Mx), MC, 9) + T(pl.X(1), pl.Y(1) + 26, '(1, 1)', MC, 18)
       + pl.pt(*A_, 'A(−3, −1)', TX, 0, 26) + pl.pt(*B_, 'B(3, −1)', TX, 0, 26)
       + pl.pt(*C_, 'C(5, 3)', TX, 0, -22) + pl.pt(*D_, 'D(?, ?)', PU, 0, -22))
add('7.3', 'CONTOH BERLANGKAH', 'Bucu keempat segi empat selari',
    P('ABCD ialah segi empat selari dengan A(−3, −1), B(3, −1) dan C(5, 3). Cari koordinat D.', True)
    + STEPS([f'Titik tengah AC = ({FR("−3 + 5", 2)}, {FR("−1 + 3", 2)}) = (1, 1)',
             'Pepenjuru membahagi dua sama, jadi (1, 1) juga titik tengah BD.',
             f'{FR("3 + <i>x</i>", 2)} = 1 → <i>x</i> = −1 &nbsp;·&nbsp; {FR("−1 + <i>y</i>", 2)} = 1 → <i>y</i> = 3'], col)
    + ANS('D(−1, 3)'),
    svg(fig, 'Segi empat selari ABCD dengan pepenjuru bertemu di (1, 1)'))

# 7.3-5 Peta
R_, S_ = (1, 2), (7, 10)
K_ = mid(R_, S_); assert dist(R_, S_) == 10 and K_ == (4, 6)
pl = Plane(0, 9, 0, 11, (40, 14, 470, 448))
def house(x, y, c):
    X, Y = pl.p(x, y)
    return (POLY([(X - 14, Y - 2), (X, Y - 16), (X + 14, Y - 2)], c) + RECT(X - 10, Y - 2, 20, 14, c, c, 2, 1))
def flag(x, y, c):
    X, Y = pl.p(x, y)
    return LINE((X, Y), (X, Y - 30), TX, 3) + POLY([(X, Y - 30), (X + 18, Y - 24), (X, Y - 18)], c)
fig = (pl.draw(fs_=13) + LINE(pl.p(*R_), pl.p(*S_), DC, 5, '10 7')
       + house(*R_, TR) + flag(*S_, RD) + DOT(pl.p(*K_), MC, 10)
       + T(pl.X(1) + 22, pl.Y(2) + 4, 'Rumah R(1, 2)', TR, 18, 'start')
       + T(pl.X(7) - 10, pl.Y(10) + 22, 'Sekolah S(7, 10)', RD, 18, 'end')
       + T(pl.X(4) + 18, pl.Y(6) + 4, 'Kedai K(4, 6)', MC, 18, 'start')
       + T(pl.X(4.5), pl.Y(0) + 34, '1 unit = 1 km', MU, 15, halo=False))
add('7.3', 'APLIKASI', 'Membaca peta bergrid',
    P('Pada peta, rumah Aina di R(1, 2) dan sekolahnya di S(7, 10). Sebuah kedai terletak di tengah-tengah jalan lurus RS. 1 unit mewakili 1 km.', True)
    + STEPS([f'Jarak RS = {SQ("(7 − 1)² + (10 − 2)²")} = {SQ("36 + 64")} = 10 km',
             f'Kedai = ({FR("1 + 7", 2)}, {FR("2 + 10", 2)}) = (4, 6)',
             'Jarak rumah ke kedai = 10 ÷ 2 = 5 km'], col)
    + ANS('RS = 10 km; kedai di (4, 6)'),
    svg(fig, 'Peta bergrid: rumah R(1, 2), sekolah S(7, 10) dan kedai di titik tengah K(4, 6)'))

# 7.3-6 Cari koordinat diberi jarak
B_ = (5, 2)
ks = [k for k in range(-10, 11) if d2((1, k), B_) == 25]
assert ks == [-1, 5]
pl = Plane(-1, 6, -2, 6)
fig = (pl.draw() + LINE(pl.p(1, -2), pl.p(1, 6), MU2, 2.5, '6 6')
       + legs(pl, (1, 5), B_, '4', '3', '5', fill=False, hoff=-20, voff=14, doff=(-10, -14))
       + LINE(pl.p(1, -1), pl.p(*B_), DC, 6) + LINE(pl.p(1, -1), pl.p(5, -1), HC, 4, '6 6') + LINE(pl.p(5, -1), pl.p(*B_), VC, 4, '6 6')
       + pl.pt(*B_, 'B(5, 2)', TX, 14, 0, 'start')
       + pl.pt(1, 5, 'A(1, 5)', PU, 0, -22) + pl.pt(1, -1, 'A(1, −1)', PU, 0, 24)
       + T(pl.X(1) + 6, pl.Y(6) + 12, 'x = 1', MU, 15, 'start', halo=False))
add('7.3', 'CONTOH SUKAR', 'Mencari koordinat apabila jarak diberi',
    P('Jarak antara A(1, <i>k</i>) dan B(5, 2) ialah 5 unit. Cari nilai-nilai yang mungkin bagi <i>k</i>.', True)
    + STEPS([f'{SQ("(5 − 1)² + (2 − <i>k</i>)²")} = 5',
             '16 + (2 − <i>k</i>)² = 25 → (2 − <i>k</i>)² = 9',
             '2 − <i>k</i> = 3 atau 2 − <i>k</i> = −3'], col)
    + ANS('<i>k</i> = −1 atau <i>k</i> = 5')
    + NOTE('Kuasa duakan kedua-dua belah untuk membuang punca kuasa dua. Ada <b>dua</b> kedudukan A yang mungkin.'),
    svg(fig, 'Dua kedudukan titik A pada garis x = 1 yang berjarak 5 unit dari B(5, 2)'))

# 7.3-7 Ringkasan
pl = Plane(-1, 7, -1, 5, (40, 14, 470, 330))
A_, B_ = (1, 1), (6, 4)
Mr = mid(A_, B_); assert Mr == (F(7, 2), F(5, 2))
fig = (pl.draw(fs_=13) + legs(pl, A_, B_, 'x₂ − x₁', 'y₂ − y₁', None, hoff=20, voff=10)
       + T(pl.X(2.2) - 10, pl.Y(1.72) - 14, 'jarak', DC, 18, 'end')
       + DOT(pl.p(*Mr), MC, 9) + T(pl.X(3.5) - 12, pl.Y(2.5) - 22, 'titik tengah', MC, 18, 'end')
       + pl.pt(*A_, '', TX) + pl.pt(*B_, '', TX))
fig += RECT(20, 356, 460, 48, SURF, DC, 12, 2) + T(250, 380, 'Jarak = √((x₂ − x₁)² + (y₂ − y₁)²)', DC, 18)
fig += RECT(20, 414, 460, 48, SURF, MC, 12, 2) + T(250, 438, 'Titik tengah = ((x₁ + x₂)/2, (y₁ + y₂)/2)', MC, 18)
add('7.3', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus'],
          [['Jarak mengufuk / mencancang', 'beza koordinat-<i>x</i> / koordinat-<i>y</i>'],
           ['Jarak dua titik', JR],
           ['Titik tengah', TT]], col, rv=True)
    + BUL(['Rumus jarak berasal daripada Teorem Pythagoras.',
           'Lukis rajah dahulu untuk menyelesaikan masalah.'], col),
    svg(fig, 'Ringkasan rumus jarak dan titik tengah', 486))

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
assert 'NaN' not in js_body and 'None' not in js_body
assert counts == {'7.1': 6, '7.2': 6, '7.3': 7}, counts

js = ('/* Dijana oleh tools/koordinat/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
