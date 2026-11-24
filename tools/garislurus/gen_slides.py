# Penjana slaid NOTA GARIS LURUS (Tingkatan 3 Bab 9 Garis Lurus) -> garislurus/slides.js
# Jalankan:  python3 tools/garislurus/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'garislurus', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 9.1 Garis Lurus, jadi subtopik app = Standard Pembelajaran 9.1.1 - 9.1.7
SUB = {
    '9.1.1': ('Persamaan y = mx + c', C['tr']),
    '9.1.2': ('Bentuk Lain Persamaan', C['pu']),
    '9.1.3': ('Titik pada Garis Lurus', C['gr']),
    '9.1.4': ('Garis Selari', C['am']),
    '9.1.5': ('Persamaan Garis Lurus', C['pa']),
    '9.1.6': ('Titik Persilangan', C['pk']),
    '9.1.7': ('Penyelesaian Masalah', C['rd']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
VC, HC = TR, PK   # warna tetap: jarak mencancang (biru), jarak mengufuk (merah jambu)

# ---------- semakan matematik ----------
def slope(p, q):
    return F(q[1] - p[1], q[0] - p[0])
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
MV = FR('jarak mencancang', 'jarak mengufuk')
MF = FR('<i>y</i>₂ − <i>y</i>₁', '<i>x</i>₂ − <i>x</i>₁')
MI = '−' + FR('pintasan-<i>y</i>', 'pintasan-<i>x</i>')

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


# ---------- pembantu persamaan ----------
VULG = {(1, 2): '½', (1, 3): '⅓', (2, 3): '⅔', (1, 4): '¼', (3, 4): '¾', (1, 5): '⅕', (2, 5): '⅖', (3, 5): '⅗', (4, 5): '⅘', (1, 6): '⅙', (5, 6): '⅚', (1, 8): '⅛'}
X_, Y_ = '<i>x</i>', '<i>y</i>'
def _coef(m, var, html_=True):
    m = F(m)
    v = var
    if m == 1: return v
    if m == -1: return '−' + v
    sg = '−' if m < 0 else ''
    a = abs(m)
    if a.denominator == 1: return f'{sg}{a.numerator}{v}'
    if html_: return sg + FR(a.numerator, a.denominator) + v
    k = (a.numerator, a.denominator)
    return sg + (VULG[k] if k in VULG else f'({a.numerator}/{a.denominator})') + v
def _const(c, html_=True, lead=False):
    c = F(c)
    if c == 0: return ''
    a = abs(c)
    t = str(a.numerator) if a.denominator == 1 else (FR(a.numerator, a.denominator) if html_ else
        (VULG.get((a.numerator, a.denominator)) or f'{a.numerator}/{a.denominator}'))
    if lead: return ('−' if c < 0 else '') + t
    return (' − ' if c < 0 else ' + ') + t
def EQ(m, c, html_=True):
    """y = mx + c (HTML bila html_, teks biasa untuk SVG)."""
    x, y = (X_, Y_) if html_ else ('x', 'y')
    m, c = F(m), F(c)
    if m == 0: return f'{y} = {_const(c, html_, True) or "0"}'
    return f'{y} = {_coef(m, x, html_)}{_const(c, html_)}'
def AMF(a, b, c, html_=True):
    """ax + by = c"""
    x, y = (X_, Y_) if html_ else ('x', 'y')
    s = ''
    if a: s = _coef(a, x, html_)
    if b:
        t = _coef(abs(b), y, html_)
        s = (s + (' − ' if b < 0 else ' + ') + t) if s else _coef(b, y, html_)
    return f'{s} = {fs(c)}'
def LN(pl, m, c, col, sw=4.5):
    return pl.line((0, float(c)), (1, float(c + m)), col, sw)
def on(m, c, x):
    return F(m) * x + F(c)

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})
def CARDS(rows, y0=48, gap=80, h=56, size=18, foot=''):
    """Kad betul/salah: rows = [(teks, betul?)]"""
    s = ''
    for i, (t, ok) in enumerate(rows):
        y = y0 + i * gap
        s += RECT(20, y - h / 2, 460, h, SURF, GR if ok else RD, 14, 2)
        s += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, size, 'start')
    if foot: s += T(250, 454, foot, MU3, 18, halo=False)
    return s

# ===================== 9.1.1 PERSAMAAN y = mx + c =====================
sb = '9.1.1'; col = SUB[sb][1]

# 1 Definisi
m, c = F(2), F(1)
assert on(m, c, 0) == 1 and on(m, c, 1) == 3 and on(m, c, 2) == 5
pl = Plane(-4, 4, -3, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM)
       + pl.rise_run((1, 3), (2, 5), 'naik 2', 'kanan 1', 1, 1, 17)
       + pl.pt(0, 1, '', PU) + T(pl.X(0) - 12, pl.Y(1) + 2, 'c = 1', PU, 19, 'end')
       + T(pl.X(-2.2), pl.Y(5.6), 'y = 2x + 1', AM, 22, italic=True)
       + T(pl.X(3.0), pl.Y(1.6), 'm = 2', TR, 20, italic=True))
add(sb, 'DEFINISI', 'Persamaan garis lurus',
    DEF(f"Persamaan garis lurus boleh ditulis dalam bentuk {B('<i>y</i> = <i>mx</i> + <i>c</i>', col)}", col)
    + BUL([f'<i>m</i> ialah {B("kecerunan", TR)} garis lurus itu.',
           f'<i>c</i> ialah {B("pintasan-<i>y</i>", PU)}, iaitu nilai <i>y</i> apabila garis menyilang paksi-<i>y</i> di (0, <i>c</i>).'], col)
    + P(f'Contoh: {EQ(2, 1)} mempunyai <i>m</i> = 2 dan <i>c</i> = 1.', True)
    + NOTE('Bentuk <i>y</i> = <i>mx</i> + <i>c</i> dipanggil <b>bentuk kecerunan-pintasan</b>. <i>y</i> mesti berada di sebelah kiri dengan pekali 1.'),
    svg(fig, 'Garis y = 2x + 1 dengan pintasan-y 1 dan kecerunan 2'))

# 2 Kesan m dan c
pl = Plane(-4, 4, -4, 6, (30, 22, 480, 448))
fam = [(F(2), F(1), TR, 'y = 2x + 1'), (F(-1), F(1), RD, 'y = −x + 1'), (F(1, 2), F(1), GR, 'y = ½x + 1')]
for mm, cc, _, t in fam: assert EQ(mm, cc, False) == t
fig = pl.draw()
for mm, cc, cl, t in fam: fig += LN(pl, mm, cc, cl)
fig += pl.pt(0, 1, '', PU)
fig += T(pl.X(2.5) + 6, pl.Y(6) + 16, 'y = 2x + 1', TR, 19, 'start')
fig += T(pl.X(-3.9), pl.Y(4.9) + 2, 'y = −x + 1', RD, 19, 'start')
fig += T(pl.X(4) - 4, pl.Y(3) + 26, 'y = ½x + 1', GR, 19, 'end')
fig += T(pl.X(0) + 14, pl.Y(1) + 22, '(0, 1)', PU, 18, 'start')
add(sb, 'KONSEP', 'Maksud nilai m dan c',
    BUL([f'Ketiga-tiga garis mempunyai <i>c</i> = 1, jadi semuanya menyilang paksi-<i>y</i> di {B("(0, 1)", PU)}.',
         f'Nilai <i>m</i> menentukan arah dan kecuraman: {B("m = 2", TR)} naik curam, {B("m = ½", GR)} naik landai, {B("m = −1", RD)} turun ke kanan.',
         'Jika <i>m</i> sama tetapi <i>c</i> berbeza, garis-garis itu <b>selari</b>.'], col)
    + TABLE(['Persamaan', '<i>m</i>', '<i>c</i>'], [[EQ(mm, cc), FRV(mm), fs(cc)] for mm, cc, _, _ in fam], col, rv=True),
    svg(fig, 'Tiga garis melalui (0, 1) dengan kecerunan 2, −1 dan ½'))

# 3 Contoh: kenal pasti m dan c
ex = [('<i>y</i> = 3<i>x</i> − 5', '—', F(3), F(-5)),
      (f'<i>y</i> = 4 − {FR("<i>x</i>", 2)}', f'{Y_} = −{FR(1, 2)}{X_} + 4', F(-1, 2), F(4)),
      ('2<i>y</i> = 6<i>x</i> + 8', f'{Y_} = 3{X_} + 4', F(3), F(4))]
assert F(6, 2) == 3 and F(8, 2) == 4
mm, cc = F(-1, 2), F(4)
pl = Plane(-2, 9, -2, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, mm, cc, AM) + pl.pt(0, 4, '', PU) + pl.pt(8, 0, '', GR)
       + T(pl.X(0) + 14, pl.Y(4) - 20, 'pintasan-y = 4', PU, 18, 'start')
       + pl.rise_run((2, 3), (4, 2), 'turun 1', 'kanan 2', 1, 1, 17)
       + T(pl.X(5.2), pl.Y(4.4), 'y = 4 − x/2', AM, 21, italic=True))
assert on(mm, cc, 8) == 0 and on(mm, cc, 2) == 3 and on(mm, cc, 4) == 2
add(sb, 'CONTOH BERLANGKAH', 'Mengenal pasti m dan c',
    P('Tentukan kecerunan dan pintasan-<i>y</i> bagi setiap garis lurus.', True)
    + TABLE(['Persamaan', 'Susun semula', '<i>m</i>', '<i>c</i>'], [[a, b, FRV(p), fs(q)] for a, b, p, q in ex], col, rv=True)
    + BUL(['Susun semula supaya <i>y</i> berada di kiri: tulis sebutan <i>x</i> dahulu, kemudian pemalar.',
           'Jika pekali <i>y</i> bukan 1, bahagikan <b>setiap sebutan</b> dengan pekali itu.'], col)
    + NOTE('Bagi <i>y</i> = 4 − <i>x</i>/2: <i>m</i> = −½ (bukan 4). Kecerunan ialah pekali <i>x</i>.'),
    svg(fig, 'Garis y = 4 − x/2 dengan pintasan-y 4 dan turun 1 unit bagi setiap 2 unit ke kanan'))

# 4 Contoh: tulis persamaan dari graf
A1, B1 = (0, -2), (3, 4)
m = slope(A1, B1); c = F(A1[1]); assert m == 2 and on(m, c, 3) == 4
pl = Plane(-3, 5, -4, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.rise_run(A1, B1, 'naik 6', 'kanan 3', 1, 1, 18)
       + pl.pt(*A1, '(0, −2)', PU, -12, 0, 'end') + pl.pt(*B1, '(3, 4)', AM, -12, -10, 'end')
       + T(pl.X(-1.3), pl.Y(5.2), 'y = 2x − 2', AM, 22, italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Menulis persamaan daripada graf',
    P('Rajah menunjukkan garis lurus yang melalui (0, −2) dan (3, 4). Tulis persamaannya dalam bentuk <i>y</i> = <i>mx</i> + <i>c</i>.', True)
    + STEPS([f'Pintasan-<i>y</i>: garis menyilang paksi-<i>y</i> di (0, −2), maka <i>c</i> = −2.',
             f'Kecerunan: <i>m</i> = {FR("4 − (−2)", "3 − 0")} = {FR(6, 3)} = 2',
             f'Gantikan: {EQ(m, c)}'], col)
    + ANS(EQ(m, c)),
    svg(fig, 'Garis lurus melalui (0, −2) dan (3, 4)'))

# 5 Kes khas: mengufuk dan mencancang
pl = Plane(-5, 5, -4, 5, (30, 22, 480, 448))
fig = (pl.draw() + pl.line((-5, 3), (5, 3), TR, 5) + pl.line((-2, -4), (-2, 5), PK, 5)
       + T(pl.X(4.8), pl.Y(3) - 18, 'y = 3', TR, 21, 'end', italic=True)
       + T(pl.X(-2) - 12, pl.Y(-3.4), 'x = −2', PK, 21, 'end', italic=True)
       + pl.pt(1, 3, '(1, 3)', TR, 0, 22) + pl.pt(4, 3, '(4, 3)', TR, 0, 22)
       + pl.pt(-2, -1, '(−2, −1)', PK, 12, 0, 'start'))
add(sb, 'KES KHAS', 'Garis mengufuk dan mencancang',
    TABLE(['Garis', 'Persamaan', 'Kecerunan'],
          [['Selari dengan paksi-<i>x</i> (mengufuk)', f'{Y_} = <i>a</i>', '<i>m</i> = 0'],
           ['Selari dengan paksi-<i>y</i> (mencancang)', f'{X_} = <i>h</i>', 'tidak tertakrif']], col, rv=True)
    + BUL([f'Setiap titik pada garis {B("<i>y</i> = 3", TR)} mempunyai koordinat-<i>y</i> = 3, contohnya (1, 3) dan (4, 3).',
           f'Setiap titik pada garis {B("<i>x</i> = −2", PK)} mempunyai koordinat-<i>x</i> = −2.'], col)
    + NOTE('<i>y</i> = 3 ialah <i>y</i> = 0<i>x</i> + 3. Garis mencancang <b>tidak boleh</b> ditulis dalam bentuk <i>y</i> = <i>mx</i> + <i>c</i>.'),
    svg(fig, 'Garis mengufuk y = 3 dan garis mencancang x = −2'))

# 6 Kesilapan biasa
assert F(4, 2) == 2 and F(6, 2) == 3
fig = CARDS([('y = 5 − 2x  →  m = 5', False), ('y = 5 − 2x  →  m = −2, c = 5', True),
             ('2y = 4x + 6  →  y = 2x + 6', False), ('2y = 4x + 6  →  y = 2x + 3', True),
             ('y = 3x − 4  →  c = 4', False)], 50, 84, 58, 19, '✓  y = 3x − 4  →  c = −4')
add(sb, 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Ambil nombor pertama sebagai m", RD)} ✗ → <i>m</i> ialah <b>pekali <i>x</i></b>, di mana-mana kedudukannya.',
         f'{B("Bahagi sebahagian sahaja", RD)} ✗ → bahagikan <b>setiap</b> sebutan dengan pekali <i>y</i>.',
         f'{B("Lupa tanda", RD)} ✗ → bagi <i>y</i> = 3<i>x</i> − 4, <i>c</i> = −4 (pintasan-<i>y</i> di bawah paksi-<i>x</i>).'], col)
    + NOTE('Tulis semula persamaan dalam bentuk <i>y</i> = <i>mx</i> + <i>c</i> <b>sebelum</b> membaca nilai <i>m</i> dan <i>c</i>.', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah semasa membaca m dan c'))

# ===================== 9.1.2 BENTUK LAIN PERSAMAAN =====================
sb = '9.1.2'; col = SUB[sb][1]

# 1 Tiga bentuk
a_, b_, c_ = 2, 3, 6
m, c = F(-a_, b_), F(c_, b_); xi, yi = F(c_, a_), F(c_, b_)
assert (m, c, xi, yi) == (F(-2, 3), 2, 3, 2) and on(m, c, 3) == 0
pl = Plane(-2, 6, -2, 5, (30, 150, 480, 448))
fig = (RECT(14, 10, 472, 128, SURF, BD, 16, 2)
       + T(250, 38, 'y = −⅔x + 2', TR, 21, italic=True)
       + T(250, 74, '2x + 3y = 6', PU, 21, italic=True)
       + T(250, 110, 'x/3 + y/2 = 1', GR, 21, italic=True)
       + pl.draw() + pl.line((3, 0), (0, 2), AM, 5)
       + pl.pt(3, 0, '(3, 0)', GR, 8, -20, 'start') + pl.pt(0, 2, '(0, 2)', GR, 12, -14, 'start'))
add(sb, 'DEFINISI', 'Tiga bentuk persamaan garis lurus',
    TABLE(['Bentuk', 'Persamaan', 'Maklumat'],
          [['Kecerunan-pintasan', '<i>y</i> = <i>mx</i> + <i>c</i>', '<i>m</i> = kecerunan, <i>c</i> = pintasan-<i>y</i>'],
           ['Am', '<i>ax</i> + <i>by</i> = <i>c</i>', '<i>a</i>, <i>b</i>, <i>c</i> pemalar'],
           ['Pintasan', f'{FR("<i>x</i>", "<i>a</i>")} + {FR("<i>y</i>", "<i>b</i>")} = 1', '<i>a</i> = pintasan-<i>x</i>, <i>b</i> = pintasan-<i>y</i>']], col, rv=True)
    + P(f'Ketiga-tiga persamaan dalam rajah mewakili <b>garis lurus yang sama</b>.', True)
    + NOTE('Bentuk pintasan mesti bersamaan <b>1</b> di sebelah kanan.'),
    svg(fig, 'Garis yang sama ditulis dalam tiga bentuk: y = −2/3 x + 2, 2x + 3y = 6 dan x/3 + y/2 = 1'))

# 2 ax + by = c -> y = mx + c
pl = Plane(-2, 7, -3, 5, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.rise_run((0, 2), (3, 0), 'turun 2', 'kanan 3', 1, -1, 18)
       + pl.pt(0, 2, '', PU) + T(pl.X(0) + 12, pl.Y(2) - 18, 'c = 2', PU, 19, 'start')
       + T(pl.X(4.6), pl.Y(-1.9), 'm = −⅔', TR, 20, italic=True)
       + T(pl.X(3.3), pl.Y(3.6), '2x + 3y = 6', AM, 21, italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Daripada ax + by = c kepada y = mx + c',
    P(f'Tukar {AMF(2, 3, 6)} kepada bentuk <i>y</i> = <i>mx</i> + <i>c</i>. Seterusnya nyatakan kecerunan dan pintasan-<i>y</i>.', True)
    + STEPS([f'Kekalkan sebutan <i>y</i> di kiri: 3{Y_} = −2{X_} + 6',
             f'Bahagi setiap sebutan dengan 3: {Y_} = −{FR(2, 3)}{X_} + {FR(6, 3)}',
             f'{EQ(m, c)}'], col)
    + ANS(f'<i>m</i> = {FRV(m)}, <i>c</i> = 2')
    + NOTE(f'Jalan pintas: bagi <i>ax</i> + <i>by</i> = <i>c</i>, kecerunan <i>m</i> = −{FR("<i>a</i>", "<i>b</i>")}.'),
    svg(fig, 'Garis 2x + 3y = 6 dengan kecerunan −2/3 dan pintasan-y 2'))

# 3 Bentuk pintasan
xa, yb = 4, -2
m = F(-yb, xa); c = F(yb); assert m == F(1, 2) and on(m, c, 4) == 0
pl = Plane(-2, 7, -4, 4, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM)
       + pl.pt(4, 0, '', GR) + pl.pt(0, -2, '', PU)
       + T(pl.X(4) + 4, pl.Y(0) + 22, 'pintasan-x = 4', GR, 18, 'start')
       + T(pl.X(0) + 14, pl.Y(-2) + 20, 'pintasan-y = −2', PU, 18, 'start')
       + T(pl.X(1.2), pl.Y(2.6), 'x/4 + y/(−2) = 1', AM, 21, italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Bentuk pintasan x/a + y/b = 1',
    P(f'Garis lurus {FR("<i>x</i>", 4)} − {FR("<i>y</i>", 2)} = 1. Nyatakan pintasan-<i>x</i> dan pintasan-<i>y</i>, kemudian tulis persamaan dalam bentuk <i>y</i> = <i>mx</i> + <i>c</i>.', True)
    + STEPS([f'Tulis sebagai {FR("<i>x</i>", 4)} + {FR("<i>y</i>", "−2")} = 1: pintasan-<i>x</i> = 4, pintasan-<i>y</i> = −2',
             f'Darab setiap sebutan dengan 4: {AMF(1, -2, 4)}',
             f'2{Y_} = {X_} − 4 → {EQ(m, c)}'], col)
    + ANS(f'{EQ(m, c)}'),
    svg(fig, 'Garis dengan pintasan-x 4 dan pintasan-y −2'))

# 4 y = mx + c -> bentuk lain
m, c = F(-3), F(6); xi = -c / m
assert xi == 2 and on(m, c, 2) == 0
pl = Plane(-2, 5, -2, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.pt(2, 0, '(2, 0)', GR, 10, -20, 'start') + pl.pt(0, 6, '(0, 6)', PU, 12, -4, 'start')
       + T(pl.X(2.4), pl.Y(4.4), 'y = −3x + 6', AM, 21, 'start', italic=True)
       + T(pl.X(2.4), pl.Y(3.6), '3x + y = 6', PU, 20, 'start', italic=True)
       + T(pl.X(2.4), pl.Y(2.8), 'x/2 + y/6 = 1', GR, 20, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Menukar kepada bentuk am dan bentuk pintasan',
    P(f'Tulis {EQ(m, c)} dalam bentuk am dan dalam bentuk pintasan.', True)
    + STEPS([f'Bentuk am: pindahkan sebutan <i>x</i> ke kiri → {AMF(3, 1, 6)}',
             f'Bentuk pintasan: bahagi setiap sebutan dengan 6 → {FR("3<i>x</i>", 6)} + {FR("<i>y</i>", 6)} = 1',
             f'Permudahkan: {FR("<i>x</i>", 2)} + {FR("<i>y</i>", 6)} = 1'], col)
    + ANS(f'{AMF(3, 1, 6)} &nbsp;·&nbsp; {FR("<i>x</i>", 2)} + {FR("<i>y</i>", 6)} = 1')
    + NOTE('Semak: pintasan-<i>x</i> = 2 dan pintasan-<i>y</i> = 6 sepadan dengan graf.'),
    svg(fig, 'Garis y = −3x + 6 dengan pintasan-x 2 dan pintasan-y 6'))

# 5 Pintasan daripada ax + by = c
a_, b_, c_ = 3, -4, 12
xi, yi = F(c_, a_), F(c_, b_); m = F(-a_, b_)
assert (xi, yi, m) == (4, -3, F(3, 4)) and m == -yi / xi
pl = Plane(-2, 7, -5, 3, (30, 22, 480, 448))
fig = (pl.draw() + pl.line((4, 0), (0, -3), AM, 5) + pl.pt(4, 0, '', GR) + pl.pt(0, -3, '', PU)
       + T(pl.X(4) - 8, pl.Y(0) - 20, '(4, 0)', GR, 19, 'end') + T(pl.X(0) - 12, pl.Y(-3), '(0, −3)', PU, 19, 'end')
       + T(pl.X(4.4), pl.Y(1.9), '3x − 4y = 12', AM, 21, italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Mencari pintasan daripada ax + by = c',
    P(f'Cari pintasan-<i>x</i>, pintasan-<i>y</i> dan kecerunan garis {AMF(3, -4, 12)}.', True)
    + STEPS([f'Pintasan-<i>x</i>: gantikan <i>y</i> = 0 → 3<i>x</i> = 12 → <i>x</i> = 4',
             f'Pintasan-<i>y</i>: gantikan <i>x</i> = 0 → −4<i>y</i> = 12 → <i>y</i> = −3',
             f'<i>m</i> = −{FR("pintasan-<i>y</i>", "pintasan-<i>x</i>")} = −{FR("−3", 4)} = {FRV(m)}'], col)
    + ANS(f'Pintasan-<i>x</i> = 4, pintasan-<i>y</i> = −3, <i>m</i> = {FRV(m)}'),
    svg(fig, 'Garis 3x − 4y = 12 dengan pintasan-x 4 dan pintasan-y −3'))

# 6 Kesilapan biasa
assert F(12, 2) == 6 and F(12, 3) == 4 and F(-2, 3) == -F(2, 3)
fig = CARDS([('2x + 3y = 12  →  x/2 + y/3 = 1', False), ('2x + 3y = 12  →  x/6 + y/4 = 1', True),
             ('2x + 3y = 6  →  m = 2/3', False), ('2x + 3y = 6  →  m = −2/3', True),
             ('x/5 + y/3 = 2  →  pintasan-x = 5', False)], 50, 84, 58, 19, '✓  sebelah kanan mesti 1 dahulu')
add(sb, 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Pekali sebagai penyebut", RD)} ✗ → bahagi kedua-dua belah dengan <i>c</i> dahulu supaya kanan = 1.',
         f'{B("Lupa tanda negatif", RD)} ✗ → bagi <i>ax</i> + <i>by</i> = <i>c</i>, <i>m</i> = −<i>a</i>/<i>b</i>.',
         f'{B("Baca pintasan sebelum kanan = 1", RD)} ✗ → {FR("<i>x</i>", 5)} + {FR("<i>y</i>", 3)} = 2 ialah {FR("<i>x</i>", 10)} + {FR("<i>y</i>", 6)} = 1.'], col)
    + NOTE('Semak jawapan dengan menggantikan <i>x</i> = 0 dan <i>y</i> = 0 ke dalam persamaan asal.', 'Petua:'),
    svg(fig, 'Contoh jawapan betul dan salah semasa menukar bentuk persamaan'))
assert F(5 * 2) == 10 and F(3 * 2) == 6

# ===================== 9.1.3 TITIK PADA GARIS LURUS =====================
sb = '9.1.3'; col = SUB[sb][1]

# 1 Konsep
m, c = F(-1), F(3)
assert on(m, c, 1) == 2 and on(m, c, 2) != 3 and on(m, c, -1) == 4
pl = Plane(-3, 5, -2, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM)
       + pl.pt(1, 2, '', GR) + pl.pt(-1, 4, '', GR) + pl.pt(2, 3, '', RD)
       + T(pl.X(1) - 12, pl.Y(2) + 2, '(1, 2)', GR, 19, 'end') + T(pl.X(-1) - 12, pl.Y(4) + 2, '(−1, 4)', GR, 19, 'end')
       + T(pl.X(2) + 12, pl.Y(3) - 16, '(2, 3)', RD, 19, 'start')
       + TICK(pl.X(1) + 22, pl.Y(2) - 6) + CROSS(pl.X(2) + 22, pl.Y(3) + 18, RD, 7)
       + T(pl.X(3.3), pl.Y(-1.2), 'y = −x + 3', AM, 21, italic=True))
add(sb, 'KONSEP', 'Bilakah titik terletak pada garis?',
    DEF('Suatu titik terletak pada garis lurus jika koordinatnya <b>memuaskan</b> persamaan garis itu.', col)
    + BUL([f'(1, 2): gantikan <i>x</i> = 1 → <i>y</i> = −1 + 3 = 2 ✓ {B("pada garis", GR)}',
           f'(2, 3): gantikan <i>x</i> = 2 → <i>y</i> = −2 + 3 = 1 ≠ 3 ✗ {B("bukan pada garis", RD)}'], col)
    + NOTE('Sebaliknya, setiap titik pada garis itu memuaskan persamaannya. Persamaan ialah "peraturan" yang dipatuhi oleh semua titik pada garis.'),
    svg(fig, 'Garis y = −x + 3 dengan titik (1, 2) dan (−1, 4) pada garis, dan (2, 3) di luar garis'))

# 2 Contoh semak
m, c = F(2), F(-1)
assert on(m, c, 3) == 5 and on(m, c, -1) == -3
pl = Plane(-3, 5, -4, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.pt(3, 5, '', GR) + pl.pt(-1, 2, '', RD) + pl.pt(-1, -3, '', MU, )
       + LINE(pl.p(-1, 2), pl.p(-1, -3), MU2, 2.5, '6 6')
       + T(pl.X(3) - 12, pl.Y(5) - 4, 'A(3, 5)', GR, 19, 'end') + T(pl.X(-1) + 12, pl.Y(2) - 16, 'B(−1, 2)', RD, 19, 'start')
       + T(pl.X(-1) + 12, pl.Y(-3) + 16, '(−1, −3)', MU, 17, 'start')
       + T(pl.X(2.6), pl.Y(1.2), 'y = 2x − 1', AM, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Menyemak titik pada garis',
    P(f'Tentukan sama ada titik A(3, 5) dan B(−1, 2) terletak pada garis lurus {EQ(m, c)}.', True)
    + STEPS(['A(3, 5): sebelah kanan = 2(3) − 1 = 5 = <i>y</i> ✓',
             'B(−1, 2): sebelah kanan = 2(−1) − 1 = −3 ≠ 2 ✗'], col)
    + ANS('A terletak pada garis; B tidak terletak pada garis')
    + NOTE('Gantikan <b>kedua-dua</b> koordinat. Bandingkan sebelah kiri dan sebelah kanan persamaan.'),
    svg(fig, 'Garis y = 2x − 1 melalui A(3, 5) tetapi tidak melalui B(−1, 2)'))

# 3 Cari koordinat yang tidak diketahui
m, c = F(3), F(-2)
k = (7 - c) / m; assert k == 3 and on(m, c, k) == 7
h = 5 - 2 * (-2); assert 2 * (-2) + h == 5 and h == 9
pl = Plane(-2, 5, -3, 8, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.pt(3, 7, '', GR)
       + LINE(pl.p(3, 0), pl.p(3, 7), DIM, 2.5, '6 6') + LINE(pl.p(0, 7), pl.p(3, 7), DIM, 2.5, '6 6')
       + T(pl.X(3) - 14, pl.Y(7) - 2, 'P(k, 7)', GR, 19, 'end') + T(pl.X(3), pl.Y(0) + 22, 'k = 3', GR, 19)
       + T(pl.X(1.3) + 12, pl.Y(-1.6), 'y = 3x − 2', AM, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Mencari koordinat yang tidak diketahui',
    P(f'(a) Titik P(<i>k</i>, 7) terletak pada garis {EQ(m, c)}. Cari nilai <i>k</i>.<br>(b) Titik Q(−2, <i>h</i>) terletak pada garis {AMF(2, 1, 5)}. Cari nilai <i>h</i>.', True)
    + STEPS(['(a) Gantikan <i>x</i> = <i>k</i>, <i>y</i> = 7: 7 = 3<i>k</i> − 2 → 3<i>k</i> = 9 → <i>k</i> = 3',
             '(b) Gantikan <i>x</i> = −2, <i>y</i> = <i>h</i>: 2(−2) + <i>h</i> = 5 → <i>h</i> = 9'], col)
    + ANS('(a) <i>k</i> = 3 &nbsp; (b) <i>h</i> = 9'),
    svg(fig, 'Garis y = 3x − 2 melalui P(3, 7)'))

# 4 Cari pemalar dalam persamaan
p_ = F(-2 - 4, 2); assert p_ == -3 and on(p_, 4, 2) == -2
pl = Plane(-2, 4, -4, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, p_, 4, AM) + pl.pt(2, -2, '', GR) + pl.pt(0, 4, '', PU)
       + T(pl.X(2) + 12, pl.Y(-2) + 4, '(2, −2)', GR, 19, 'start') + T(pl.X(0) + 12, pl.Y(4) - 14, '(0, 4)', PU, 19, 'start')
       + T(pl.X(1.4) + 14, pl.Y(3.2), 'y = px + 4', AM, 21, 'start', italic=True)
       + T(pl.X(1.4) + 14, pl.Y(2.3), 'p = −3', TR, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Mencari pemalar dalam persamaan',
    P('Garis lurus <i>y</i> = <i>px</i> + 4 melalui titik (2, −2). Cari nilai <i>p</i> dan nyatakan kecerunan garis itu.', True)
    + STEPS(['Gantikan <i>x</i> = 2, <i>y</i> = −2: −2 = <i>p</i>(2) + 4',
             '2<i>p</i> = −2 − 4 = −6',
             '<i>p</i> = −3'], col)
    + ANS(f'<i>p</i> = −3, maka kecerunan = −3 dan {EQ(-3, 4)}'),
    svg(fig, 'Garis y = px + 4 melalui (2, −2), dengan p = −3'))

# 5 Kesilapan biasa
assert on(2, 1, 3) == 7 and on(2, 1, 7) != 3 and 3 * (-2) == -6
fig = CARDS([('(3, 7) pada y = 2x + 1?  7 = 2(3) + 1 ✓', True), ('(3, 7): ganti x = 7  →  2(7) + 1', False),
             ('y = 3x, x = −2  →  y = 3 − 2', False), ('y = 3x, x = −2  →  y = 3(−2) = −6', True),
             ('Satu koordinat sepadan sudah cukup', False)], 50, 84, 58, 18, 'Gantikan x dan y, kemudian bandingkan')
add(sb, 'KESILAPAN BIASA', 'Semak penggantian anda',
    BUL([f'{B("Tertukar x dan y", RD)} ✗ → bagi titik (<i>x</i>, <i>y</i>), nombor pertama ialah <i>x</i>.',
         f'{B("Lupa kurungan bagi nombor negatif", RD)} ✗ → tulis 3(−2), bukan 3 − 2.',
         f'{B("Semak sebelah sahaja", RD)} ✗ → titik pada garis hanya jika sebelah kiri <b>sama</b> dengan sebelah kanan.'], col)
    + NOTE('Titik pada garis ⇔ koordinatnya memuaskan persamaan garis.', 'Ringkasan:'),
    svg(fig, 'Contoh penggantian betul dan salah'))

# ===================== 9.1.4 GARIS SELARI =====================
sb = '9.1.4'; col = SUB[sb][1]

# 1 Inferens
pl = Plane(-4, 4, -5, 6, (30, 22, 480, 448))
fig = pl.draw()
for cc, cl in [(3, TR), (0, AM), (-3, PK)]:
    fig += LN(pl, 2, cc, cl)
    x0 = -2 if cc == 3 else (0.5 if cc == 0 else 2)
    p0, p1 = (x0, float(on(2, cc, x0))), (x0 + 1, float(on(2, cc, x0 + 1)))
    fig += POLY([pl.p(*p0), pl.p(p1[0], p0[1]), pl.p(*p1)], f'{cl}26') + LINE(pl.p(*p0), pl.p(p1[0], p0[1]), cl, 3) + LINE(pl.p(p1[0], p0[1]), pl.p(*p1), cl, 3)
fig += T(pl.X(1.4), pl.Y(-2.4), 'y = 2x + 3', TR, 19, 'start') + T(pl.X(1.4), pl.Y(-3.3), 'y = 2x', AM, 19, 'start') + T(pl.X(1.4), pl.Y(-4.2), 'y = 2x − 3', PK, 19, 'start')
add(sb, 'INFERENS', 'Kecerunan garis selari',
    DEF('Garis-garis lurus yang <b>selari</b> mempunyai <b>kecerunan yang sama</b>. Sebaliknya, garis lurus yang mempunyai kecerunan yang sama adalah selari.', col)
    + P('Ketiga-tiga garis dalam rajah mempunyai <i>m</i> = 2: setiap garis naik 2 unit bagi setiap 1 unit ke kanan.', True)
    + BUL(['<i>m</i>₁ = <i>m</i>₂ ⇔ garis selari.', 'Pintasan-<i>y</i> berbeza ⇒ garis tidak bertindih.'], col)
    + NOTE('Garis selari tidak akan bersilang walaupun dipanjangkan.'),
    svg(fig, 'Tiga garis selari dengan kecerunan 2'))

# 2 Tentukan selari
assert F(-6, -2) == 3 and F(-7, -2) == F(7, 2) and F(-1, -2) == F(1, 2)
pl = Plane(-3, 4, -5, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 3, 1, TR) + LN(pl, 3, F(-7, 2), PK)
       + T(pl.X(1.4) - 12, pl.Y(5.2), 'y = 3x + 1', TR, 19, 'end') + T(pl.X(2.7) + 12, pl.Y(3.4), '6x − 2y = 7', PK, 19, 'start'))
add(sb, 'CONTOH BERLANGKAH', 'Menentukan garis selari',
    P(f'Tentukan sama ada pasangan garis berikut selari.<br>(a) {EQ(3, 1)} dan {AMF(6, -2, 7)} &nbsp; (b) {EQ(2, 4)} dan {AMF(1, -2, 6)}', True)
    + STEPS([f'(a) −2<i>y</i> = −6<i>x</i> + 7 → {EQ(3, F(-7, 2))}. <i>m</i>₁ = 3, <i>m</i>₂ = 3 → <b>selari</b>',
             f'(b) −2<i>y</i> = −<i>x</i> + 6 → {EQ(F(1, 2), -3)}. <i>m</i>₁ = 2, <i>m</i>₂ = {FR(1, 2)} → <b>tidak selari</b>'], col)
    + ANS('(a) Selari &nbsp; (b) Tidak selari')
    + NOTE('Tukar kedua-dua persamaan kepada bentuk <i>y</i> = <i>mx</i> + <i>c</i> dahulu, kemudian bandingkan <i>m</i>.'),
    svg(fig, 'Dua garis selari y = 3x + 1 dan 6x − 2y = 7'))

# 3 Cari pemalar k
kk = -8; assert F(-kk, 2) == 4
pl = Plane(-3, 3, -5, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 4, -1, TR) + LN(pl, 4, F(5, 2), PU)
       + T(pl.X(1.5) + 12, pl.Y(4.4), 'y = 4x − 1', TR, 19, 'start') + T(pl.X(0.6) - 12, pl.Y(5.6), 'kx + 2y = 5', PU, 19, 'end'))
add(sb, 'CONTOH BERLANGKAH', 'Mencari pemalar bagi garis selari',
    P(f'Garis lurus <i>kx</i> + 2<i>y</i> = 5 selari dengan garis {EQ(4, -1)}. Cari nilai <i>k</i>.', True)
    + STEPS([f'Susun semula: 2{Y_} = −<i>kx</i> + 5 → {Y_} = −{FR("<i>k</i>", 2)}{X_} + {FR(5, 2)}',
             f'Garis selari, maka kecerunan sama: −{FR("<i>k</i>", 2)} = 4',
             '<i>k</i> = −8'], col)
    + ANS('<i>k</i> = −8'),
    svg(fig, 'Garis y = 4x − 1 dan garis selari kx + 2y = 5'))

# 4 Persamaan garis selari melalui titik
m = F(-2); pt_ = (3, 1); c = pt_[1] - m * pt_[0]; assert c == 7 and on(m, c, 3) == 1
pl = Plane(-2, 6, -3, 8, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, 5, MU3, 4) + LN(pl, m, c, AM) + pl.pt(*pt_, '', GR) + pl.pt(0, 7, '', PU)
       + T(pl.X(3) + 12, pl.Y(1) - 4, '(3, 1)', GR, 19, 'start') + T(pl.X(0) + 12, pl.Y(7) - 4, '(0, 7)', PU, 19, 'start')
       + T(pl.X(-0.5) - 6, pl.Y(4.4), 'y = −2x + 5', MU3, 18, 'end') + T(pl.X(3.2) + 12, pl.Y(6.6), 'y = −2x + 7', AM, 20, 'start'))
add(sb, 'CONTOH BERLANGKAH', 'Persamaan garis selari yang melalui satu titik',
    P(f'Cari persamaan garis lurus yang selari dengan {EQ(m, 5)} dan melalui titik (3, 1).', True)
    + STEPS(['Garis selari, maka <i>m</i> = −2.',
             'Gantikan (3, 1) ke dalam <i>y</i> = −2<i>x</i> + <i>c</i>: 1 = −2(3) + <i>c</i>',
             '<i>c</i> = 1 + 6 = 7'], col)
    + ANS(EQ(m, c)),
    svg(fig, 'Garis y = −2x + 7 melalui (3, 1), selari dengan y = −2x + 5'))

# 5 Selari dengan paksi
pl = Plane(-4, 5, -3, 5, (30, 22, 480, 448))
fig = (pl.draw() + pl.line((-4, 2), (5, 2), TR, 5) + pl.line((-4, -2), (5, -2), TR, 3.5) + pl.line((3, -3), (3, 5), PK, 5)
       + pl.pt(-2, 2, '', GR) + T(pl.X(-2), pl.Y(2) - 22, '(−2, 2)', GR, 18)
       + pl.pt(3, 4, '', GR) + T(pl.X(3) - 12, pl.Y(4), '(3, 4)', GR, 18, 'end')
       + T(pl.X(4.9), pl.Y(2) + 20, 'y = 2', TR, 20, 'end') + T(pl.X(-3.9), pl.Y(-2) + 20, 'y = −2', TR, 18, 'start') + T(pl.X(3) + 12, pl.Y(-2.6), 'x = 3', PK, 20, 'start'))
add(sb, 'KES KHAS', 'Garis selari dengan paksi',
    TABLE(['Garis melalui (<i>h</i>, <i>k</i>) dan selari dengan', 'Persamaan'],
          [['paksi-<i>x</i> (atau garis <i>y</i> = <i>a</i>)', '<i>y</i> = <i>k</i>'],
           ['paksi-<i>y</i> (atau garis <i>x</i> = <i>a</i>)', '<i>x</i> = <i>h</i>']], col, rv=True)
    + BUL(['Garis melalui (−2, 2) dan selari dengan paksi-<i>x</i>: <i>y</i> = 2.',
           'Garis melalui (3, 4) dan selari dengan paksi-<i>y</i>: <i>x</i> = 3.'], col)
    + NOTE('Semua garis mengufuk selari antara satu sama lain (<i>m</i> = 0). Semua garis mencancang juga selari.'),
    svg(fig, 'Garis y = 2 dan y = −2 selari dengan paksi-x; garis x = 3 selari dengan paksi-y'))

# 6 Kesilapan biasa
fig = CARDS([('y = 2x + 5 ∥ y = 5x + 2 kerana ada 5', False), ('Banding m sahaja: 2 ≠ 5, tidak selari', True),
             ('4x + 2y = 1: m = 4', False), ('4x + 2y = 1: y = −2x + ½, m = −2', True),
             ('Selari paksi-x melalui (3, 4): x = 3', False)], 50, 84, 58, 17, '✓  selari paksi-x melalui (3, 4): y = 4')
add(sb, 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Bandingkan c", RD)} ✗ → garis selari ditentukan oleh <b>kecerunan</b> sahaja.',
         f'{B("Baca m terus daripada ax + by = c", RD)} ✗ → tukar kepada <i>y</i> = <i>mx</i> + <i>c</i> dahulu.',
         f'{B("Tertukar x = h dengan y = k", RD)} ✗ → selari paksi-<i>x</i> ialah garis mengufuk, <i>y</i> = <i>k</i>.'], col)
    + NOTE('Garis selari: <i>m</i>₁ = <i>m</i>₂.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan betul dan salah tentang garis selari'))

# ===================== 9.1.5 PERSAMAAN GARIS LURUS =====================
sb = '9.1.5'; col = SUB[sb][1]

# 1 Kaedah
fig = ''
BOX = [('Diberi', 'kecerunan & satu titik', TR), ('Diberi', 'dua titik', PU), ('Diberi', 'pintasan-x & pintasan-y', GR)]
for i, (a, b, cl) in enumerate(BOX):
    y0 = 14 + i * 88
    fig += RECT(14, y0, 472, 74, SURF, cl, 16, 2.5) + T(36, y0 + 25, a, MU, 16, 'start', halo=False) + T(36, y0 + 51, b, cl, 21, 'start')
fig += ARROW((250, 280), (250, 312), MU, 3, 10)
fig += RECT(14, 318, 472, 138, SURF, PA, 16, 2.5)
fig += T(40, 348, '1  Cari m', PA, 20, 'start') + T(40, 386, '2  Gantikan satu titik → cari c', PA, 20, 'start') + T(40, 424, '3  Tulis y = mx + c', PA, 20, 'start')
add(sb, 'KAEDAH', 'Menentukan persamaan garis lurus',
    P('Untuk menulis persamaan <i>y</i> = <i>mx</i> + <i>c</i>, kita perlukan nilai <i>m</i> dan <i>c</i>.', True)
    + STEPS([f'Cari kecerunan, <i>m</i>: diberi, atau guna <i>m</i> = {FR("<i>y</i>₂ − <i>y</i>₁", "<i>x</i>₂ − <i>x</i>₁")} atau <i>m</i> = −{FR("pintasan-<i>y</i>", "pintasan-<i>x</i>")}.',
             'Gantikan nilai <i>m</i> dan koordinat satu titik ke dalam <i>y</i> = <i>mx</i> + <i>c</i> untuk mencari <i>c</i>.',
             'Tulis persamaan lengkap dengan nilai <i>m</i> dan <i>c</i>.'], col)
    + NOTE('Jika pintasan-<i>y</i> diberi, <i>c</i> terus diketahui.'),
    svg(fig, 'Tiga jenis maklumat dan tiga langkah menentukan persamaan garis lurus'))

# 2 Contoh m dan titik
m = F(3); pt_ = (2, 1); c = pt_[1] - m * pt_[0]; assert c == -5 and on(m, c, 2) == 1
pl = Plane(-2, 4, -6, 5, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.pt(*pt_, '', GR) + pl.pt(0, -5, '', PU)
       + T(pl.X(2) - 12, pl.Y(1) - 4, '(2, 1)', GR, 19, 'end') + T(pl.X(0) + 12, pl.Y(-5) + 4, '(0, −5)', PU, 19, 'start')
       + T(pl.X(2.4) + 10, pl.Y(3.6), 'y = 3x − 5', AM, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Diberi kecerunan dan satu titik',
    P('Cari persamaan garis lurus yang mempunyai kecerunan 3 dan melalui titik (2, 1).', True)
    + STEPS(['<i>m</i> = 3, maka <i>y</i> = 3<i>x</i> + <i>c</i>',
             'Gantikan (2, 1): 1 = 3(2) + <i>c</i>',
             '<i>c</i> = 1 − 6 = −5'], col)
    + ANS(EQ(m, c)),
    svg(fig, 'Garis y = 3x − 5 melalui (2, 1)'))

# 3 Contoh dua titik
A1, B1 = (-1, 4), (3, -4)
m = slope(A1, B1); c = A1[1] - m * A1[0]
assert m == -2 and c == 2 and on(m, c, 3) == -4
pl = Plane(-3, 7, -5, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.rise_run(A1, B1, 'turun 8', 'kanan 4', 1, -1, 18)
       + pl.pt(*A1, 'A(−1, 4)', GR, -12, 0, 'end') + pl.pt(*B1, 'B(3, −4)', GR, -12, 6, 'end')
       + T(pl.X(-2.8), pl.Y(-4.2), 'y = −2x + 2', AM, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Diberi dua titik',
    P('Cari persamaan garis lurus yang melalui A(−1, 4) dan B(3, −4).', True)
    + STEPS([f'<i>m</i> = {FR("−4 − 4", "3 − (−1)")} = {FR("−8", 4)} = −2',
             'Gantikan A(−1, 4): 4 = −2(−1) + <i>c</i> → <i>c</i> = 2',
             f'Semak dengan B: −2(3) + 2 = −4 ✓'], col)
    + ANS(EQ(m, c)),
    svg(fig, 'Garis melalui A(−1, 4) dan B(3, −4)'))

# 4 Contoh pintasan
xi, yi = 6, -3
m = F(-yi, xi); c = F(yi); assert m == F(1, 2) and on(m, c, 6) == 0
pl = Plane(-2, 8, -5, 3, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, m, c, AM) + pl.pt(6, 0, '', GR) + pl.pt(0, -3, '', PU)
       + T(pl.X(6) + 2, pl.Y(0) + 24, '(6, 0)', GR, 19, 'start') + T(pl.X(0) - 12, pl.Y(-3), '(0, −3)', PU, 19, 'end')
       + T(pl.X(1), pl.Y(1.8), 'y = ½x − 3', AM, 21, 'start', italic=True))
add(sb, 'CONTOH BERLANGKAH', 'Diberi pintasan-x dan pintasan-y',
    P('Garis lurus mempunyai pintasan-<i>x</i> 6 dan pintasan-<i>y</i> −3. Cari persamaannya.', True)
    + STEPS([f'<i>m</i> = −{FR("pintasan-<i>y</i>", "pintasan-<i>x</i>")} = −{FR("−3", 6)} = {FRV(m)}',
             'Pintasan-<i>y</i> = −3, maka <i>c</i> = −3',
             f'Bentuk pintasan: {FR("<i>x</i>", 6)} + {FR("<i>y</i>", "−3")} = 1'], col)
    + ANS(EQ(m, c)),
    svg(fig, 'Garis dengan pintasan-x 6 dan pintasan-y −3'))

# 5 Kesilapan biasa
assert on(3, -5, 2) == 1 and 2 * 3 + (-5) == 1
fig = CARDS([('1 = 3(2) + c  →  c = 7', False), ('1 = 3(2) + c  →  c = 1 − 6 = −5', True),
             ('Ganti (2, 1) sebagai x = 1, y = 2', False), ('Jawapan akhir: c = −5', False),
             ('Jawapan akhir: y = 3x − 5', True)], 50, 84, 58, 19, 'Semak: gantikan titik kedua ke dalam jawapan')
add(sb, 'KESILAPAN BIASA', 'Lengkapkan dan semak jawapan',
    BUL([f'{B("Salah pindah sebutan", RD)} ✗ → 1 = 6 + <i>c</i> memberi <i>c</i> = 1 − 6.',
         f'{B("Tertukar koordinat", RD)} ✗ → (2, 1) bermaksud <i>x</i> = 2, <i>y</i> = 1.',
         f'{B("Berhenti pada nilai c", RD)} ✗ → jawapan akhir mesti ialah <b>persamaan</b>.'], col)
    + NOTE('Gantikan titik yang diberi ke dalam persamaan akhir. Jika kedua-dua belah sama, jawapan betul.', 'Petua:'),
    svg(fig, 'Contoh jalan kerja betul dan salah'))

# ===================== 9.1.6 TITIK PERSILANGAN =====================
sb = '9.1.6'; col = SUB[sb][1]

# 1 Konsep
assert on(1, 1, 2) == 3 and on(-2, 7, 2) == 3
pl = Plane(-3, 5, -2, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 1, 1, TR) + LN(pl, -2, 7, PK) + pl.pt(2, 3, '', AM)
       + T(pl.X(2) + 14, pl.Y(3) + 4, '(2, 3)', AM, 21, 'start')
       + T(pl.X(4.9), pl.Y(5.2), 'y = x + 1', TR, 19, 'end') + T(pl.X(0.6) + 14, pl.Y(6.6), 'y = −2x + 7', PK, 19, 'start'))
add(sb, 'KONSEP', 'Titik persilangan dua garis lurus',
    DEF('Titik persilangan ialah titik yang terletak pada <b>kedua-dua</b> garis lurus, maka koordinatnya memuaskan kedua-dua persamaan.', col)
    + P('Semak (2, 3): <i>y</i> = 2 + 1 = 3 ✓ dan <i>y</i> = −2(2) + 7 = 3 ✓', True)
    + BUL(['<b>Kaedah graf</b>: lukis kedua-dua garis dan baca koordinat titik persilangan.',
           '<b>Kaedah penggantian</b> atau <b>kaedah penghapusan</b>: selesaikan persamaan linear serentak.'], col),
    svg(fig, 'Garis y = x + 1 dan y = −2x + 7 bersilang di (2, 3)'))

# 2 Kaedah graf
assert on(1, 3, -1) == 2 and on(-1, 1, -1) == 2
pl = Plane(-5, 4, -3, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 1, 3, TR) + LN(pl, -1, 1, PK) + pl.pt(-1, 2, '', AM)
       + LINE(pl.p(-1, 0), pl.p(-1, 2), DIM, 2.5, '6 6') + LINE(pl.p(0, 2), pl.p(-1, 2), DIM, 2.5, '6 6')
       + T(pl.X(-1) - 14, pl.Y(2) - 14, '(−1, 2)', AM, 21, 'end')
       + T(pl.X(2.8) - 14, pl.Y(5.8), 'y = x + 3', TR, 19, 'end') + T(pl.X(3.9), pl.Y(-0.4), 'y = −x + 1', PK, 19, 'end'))
add(sb, 'CONTOH BERLANGKAH', 'Kaedah graf',
    P(f'Lukis garis {EQ(1, 3)} dan {EQ(-1, 1)} pada satah yang sama. Tentukan titik persilangan.', True)
    + TABLE(['<i>x</i>', '−2', '0', '2'], [['<i>y</i> = <i>x</i> + 3', '1', '3', '5'], ['<i>y</i> = −<i>x</i> + 1', '3', '1', '−1']], col, rv=True)
    + STEPS(['Plot titik-titik dan sambungkan setiap garis.', 'Baca titik persilangan daripada graf.'], col)
    + ANS('(−1, 2)'),
    svg(fig, 'Garis y = x + 3 dan y = −x + 1 bersilang di (−1, 2)'))
assert [on(1, 3, x) for x in (-2, 0, 2)] == [1, 3, 5] and [on(-1, 1, x) for x in (-2, 0, 2)] == [3, 1, -1]

# 3 Kaedah penggantian
assert 2 * 2 - 1 == 3 and 2 + 3 == 5
pl = Plane(-2, 6, -3, 7, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 2, -1, TR) + LN(pl, -1, 5, PK) + pl.pt(2, 3, '', AM)
       + T(pl.X(2) + 14, pl.Y(3) + 6, '(2, 3)', AM, 21, 'start')
       + T(pl.X(3.5) + 10, pl.Y(6.2), 'y = 2x − 1', TR, 19, 'start') + T(pl.X(5.8), pl.Y(-1.6), 'x + y = 5', PK, 19, 'end'))
add(sb, 'CONTOH BERLANGKAH', 'Kaedah penggantian',
    P(f'Cari titik persilangan garis {EQ(2, -1)} dan {AMF(1, 1, 5)}.', True)
    + STEPS(['Gantikan <i>y</i> = 2<i>x</i> − 1 ke dalam <i>x</i> + <i>y</i> = 5: <i>x</i> + (2<i>x</i> − 1) = 5',
             '3<i>x</i> = 6 → <i>x</i> = 2',
             'Gantikan <i>x</i> = 2: <i>y</i> = 2(2) − 1 = 3'], col)
    + ANS('Titik persilangan ialah (2, 3)'),
    svg(fig, 'Garis y = 2x − 1 dan x + y = 5 bersilang di (2, 3)'))

# 4 Kaedah penghapusan
assert 2 * 3 + 3 * 2 == 12 and 2 * 3 - 2 == 4
pl = Plane(-2, 7, -3, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, F(-2, 3), 4, TR) + LN(pl, 2, -4, PK) + pl.pt(3, 2, '', AM)
       + T(pl.X(3) + 14, pl.Y(2) + 14, '(3, 2)', AM, 21, 'start')
       + T(pl.X(-1.6), pl.Y(5.6) + 6, '2x + 3y = 12', TR, 19, 'start') + T(pl.X(4.5) + 10, pl.Y(5.5), '2x − y = 4', PK, 19, 'start'))
add(sb, 'CONTOH BERLANGKAH', 'Kaedah penghapusan',
    P(f'Cari titik persilangan garis {AMF(2, 3, 12)} dan {AMF(2, -1, 4)}.', True)
    + STEPS(['Pekali <i>x</i> sama. Tolak: (2<i>x</i> + 3<i>y</i>) − (2<i>x</i> − <i>y</i>) = 12 − 4',
             '4<i>y</i> = 8 → <i>y</i> = 2',
             'Gantikan <i>y</i> = 2 ke dalam 2<i>x</i> − <i>y</i> = 4: 2<i>x</i> = 6 → <i>x</i> = 3'], col)
    + ANS('Titik persilangan ialah (3, 2)'),
    svg(fig, 'Garis 2x + 3y = 12 dan 2x − y = 4 bersilang di (3, 2)'))

# 5 Kes khas
assert on(3, -6, 2) == 0
pl = Plane(-3, 4, -6, 6, (30, 22, 480, 448))
fig = (pl.draw() + LN(pl, 2, 1, TR) + LN(pl, 2, -3, TR, 3.5) + LN(pl, 3, -6, PK, 4) + pl.pt(2, 0, '', AM)
       + T(pl.X(2) + 14, pl.Y(0) + 18, '(2, 0)', AM, 20, 'start')
       + T(pl.X(-2.8), pl.Y(-2.4), 'y = 2x + 1', TR, 18, 'start') + T(pl.X(0.2) + 8, pl.Y(-4.6), 'y = 2x − 3', TR, 18, 'start')
       + T(pl.X(3.6) - 8, pl.Y(5.4), 'y = 3x − 6', PK, 18, 'end'))
add(sb, 'KES KHAS', 'Garis selari dan paksi',
    BUL([f'Garis {B("selari", TR)} (<i>m</i> sama, <i>c</i> berbeza) <b>tidak bersilang</b>: tiada titik persilangan.',
         'Garis yang <b>bertindih</b> (persamaan setara) mempunyai titik sepunya yang tidak terhingga.',
         f'Persilangan dengan paksi-<i>x</i>: gantikan <i>y</i> = 0. Contoh: 0 = 3<i>x</i> − 6 → {B("(2, 0)", AM)}.'], col)
    + NOTE('Persilangan dengan paksi-<i>y</i> ialah (0, <i>c</i>), iaitu pintasan-<i>y</i>.'),
    svg(fig, 'Dua garis selari tidak bersilang; garis y = 3x − 6 menyilang paksi-x di (2, 0)'))

# 6 Kesilapan biasa
fig = CARDS([('Jawapan: x = 2 sahaja', False), ('Jawapan: titik (2, 3)', True),
             ('(x + y) − (x − y) = 2x', False), ('(x + y) − (x − y) = 2y', True),
             ('y = 2x + 1 dan y = 2x − 3 bersilang', False)], 50, 84, 58, 19, 'Semak titik dalam kedua-dua persamaan')
add(sb, 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Beri x sahaja", RD)} ✗ → titik persilangan mesti ditulis sebagai (<i>x</i>, <i>y</i>).',
         f'{B("Salah tanda ketika menolak", RD)} ✗ → −(<i>x</i> − <i>y</i>) = −<i>x</i> + <i>y</i>.',
         f'{B("Cari persilangan garis selari", RD)} ✗ → bandingkan <i>m</i> dahulu.'], col)
    + NOTE('Gantikan titik yang diperoleh ke dalam <b>kedua-dua</b> persamaan.', 'Petua:'),
    svg(fig, 'Contoh jalan kerja betul dan salah bagi titik persilangan'))

# ===================== 9.1.7 PENYELESAIAN MASALAH =====================
sb = '9.1.7'; col = SUB[sb][1]

def AXES(xl, yl, xmax, ymax, xs, ys, box=(70, 24, 470, 410)):
    """Paksi kuadran pertama berlabel: pulangkan (svg, X, Y)."""
    L, Tp, R, Bm = box
    X = lambda v: L + (R - L) * v / xmax
    Y = lambda v: Bm - (Bm - Tp) * v / ymax
    s = ''
    for v in xs: s += LINE((X(v), Tp), (X(v), Bm), GRID, 1.5, cap='butt') + T(X(v), Bm + 18, str(v), MU2, 15, weight=600)
    for v in ys: s += LINE((L, Y(v)), (R, Y(v)), GRID, 1.5, cap='butt') + T(L - 9, Y(v), str(v), MU2, 15, 'end', weight=600)
    s += ARROW((L, Bm), (R + 10, Bm), MU, 2.5, 10) + ARROW((L, Bm), (L, Tp - 10), MU, 2.5, 10)
    s += T((L + R) / 2, Bm + 44, xl, MU, 17, halo=False) + T(L + 8, Tp - 12, yl, MU, 17, 'start', halo=False)
    s += T(L - 9, Bm + 16, '0', MU2, 15, 'end', weight=600)
    return s, X, Y

# 1 Langkah & tafsiran
fig, X, Y = AXES('t (jam)', 'C (RM)', 10, 40, [2, 4, 6, 8, 10], [10, 20, 30, 40])
assert 3 * 4 + 5 == 17 and (29 - 5) / 3 == 8
fig += LINE((X(0), Y(5)), (X(10), Y(35)), AM, 5) + DOT((X(0), Y(5)), PU) + DOT((X(4), Y(17)), GR) + DOT((X(8), Y(29)), GR)
fig += T(X(0) + 14, Y(5) - 16, 'c = 5', PU, 19, 'start') + T(X(4) + 12, Y(17) + 18, '(4, 17)', GR, 18, 'start') + T(X(8) - 12, Y(29) - 12, '(8, 29)', GR, 18, 'end')
fig += T(X(5.2), Y(36), 'C = 3t + 5', AM, 22, italic=True)
add(sb, 'TAFSIRAN', 'Maksud m dan c dalam situasi sebenar',
    P('Kos menyewa sebuah basikal, RM<i>C</i>, untuk <i>t</i> jam diberi oleh <i>C</i> = 3<i>t</i> + 5.', True)
    + BUL([f'{B("c = 5", PU)}: nilai awal, iaitu caj asas RM5 (apabila <i>t</i> = 0).',
           f'{B("m = 3", TR)}: kadar perubahan, iaitu kos bertambah RM3 bagi setiap jam.'], col)
    + STEPS(['Kos 4 jam: <i>C</i> = 3(4) + 5 = RM17',
             'Jika kos RM29: 29 = 3<i>t</i> + 5 → 3<i>t</i> = 24 → <i>t</i> = 8 jam'], col)
    + NOTE('Kecerunan = <b>kadar</b>; pintasan-<i>y</i> = <b>nilai awal</b>.'),
    svg(fig, 'Graf kos sewa basikal C = 3t + 5'))

# 2 Bentuk persamaan daripada dua data
t1, v1, t2, v2 = 2, 50, 6, 30
m = F(v2 - v1, t2 - t1); c = v1 - m * t1; T0 = -c / m
assert m == -5 and c == 60 and T0 == 12 and on(m, c, 6) == 30
fig, X, Y = AXES('t (minit)', 'V (liter)', 14, 70, [2, 4, 6, 8, 10, 12, 14], [10, 20, 30, 40, 50, 60, 70])
fig += LINE((X(0), Y(60)), (X(12), Y(0)), AM, 5) + DOT((X(2), Y(50)), GR) + DOT((X(6), Y(30)), GR) + DOT((X(0), Y(60)), PU) + DOT((X(12), Y(0)), RD)
fig += T(X(2) + 12, Y(50) - 14, '(2, 50)', GR, 18, 'start') + T(X(6) + 12, Y(30) - 14, '(6, 30)', GR, 18, 'start')
fig += T(X(0) + 14, Y(60) - 14, '60', PU, 18, 'start') + T(X(12), Y(0) - 22, '12', RD, 19)
fig += T(X(9.5), Y(46), 'V = −5t + 60', AM, 21, italic=True)
add(sb, 'CONTOH BERLANGKAH', 'Membentuk persamaan daripada data',
    P('Air dialirkan keluar daripada sebuah tangki pada kadar tetap. Selepas 2 minit, isi padu air ialah 50 liter. Selepas 6 minit, isi padu ialah 30 liter. Bilakah tangki itu kosong?', True)
    + STEPS([f'<i>m</i> = {FR("30 − 50", "6 − 2")} = −5 (berkurang 5 liter seminit)',
             '50 = −5(2) + <i>c</i> → <i>c</i> = 60, maka <i>V</i> = −5<i>t</i> + 60',
             'Kosong apabila <i>V</i> = 0: 5<i>t</i> = 60 → <i>t</i> = 12'], col)
    + ANS('Tangki kosong selepas 12 minit'),
    svg(fig, 'Graf isi padu air V = −5t + 60 melawan masa'))

# 3 Membanding dua pelan (persilangan)
n_ = F(40, 10 - 5); assert n_ == 8 and 5 * 8 + 40 == 80 == 10 * 8
fig, X, Y = AXES('n (kali)', 'K (RM)', 12, 120, [2, 4, 6, 8, 10, 12], [20, 40, 60, 80, 100, 120])
fig += LINE((X(0), Y(40)), (X(12), Y(100)), TR, 5) + LINE((X(0), Y(0)), (X(12), Y(120)), PK, 5) + DOT((X(8), Y(80)), AM)
fig += LINE((X(8), Y(0)), (X(8), Y(80)), DIM, 2.5, '6 6')
fig += T(X(8) + 14, Y(80) + 18, '(8, 80)', AM, 20, 'start')
fig += T(X(7.2), Y(50), 'A: K = 5n + 40', TR, 19, 'start') + T(X(6.3), Y(100), 'B: K = 10n', PK, 19, 'end')
add(sb, 'CONTOH BERLANGKAH', 'Membanding dua pilihan',
    P('Gim A mengenakan yuran RM40 dan RM5 bagi setiap kunjungan. Gim B mengenakan RM10 bagi setiap kunjungan. Selepas berapa kunjungan kosnya sama? Gim manakah lebih murah untuk 12 kunjungan?', True)
    + STEPS(['A: <i>K</i> = 5<i>n</i> + 40 &nbsp;·&nbsp; B: <i>K</i> = 10<i>n</i>',
             'Sama kos: 10<i>n</i> = 5<i>n</i> + 40 → <i>n</i> = 8, <i>K</i> = RM80',
             '<i>n</i> = 12: A = RM100, B = RM120'], col)
    + ANS('Kos sama pada 8 kunjungan; Gim A lebih murah untuk 12 kunjungan'),
    svg(fig, 'Graf kos Gim A dan Gim B bersilang di (8, 80)'))
assert 5 * 12 + 40 == 100 and 10 * 12 == 120

# 4 Strategi
fig = ''
ST = [('1', 'Fahami', 'Kenal pasti pemboleh ubah & maklumat', TR), ('2', 'Rancang', 'Bentuk persamaan y = mx + c', PU),
      ('3', 'Laksana', 'Cari nilai atau titik persilangan', AM), ('4', 'Semak', 'Adakah jawapan munasabah?', GR)]
for i, (n, a, b, cl) in enumerate(ST):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 98, SURF, cl, 16, 2.5)
    fig += f'<circle cx="62" cy="{y0 + 49}" r="26" fill="{cl}"/>' + T(62, y0 + 50, n, BG, 24, halo=False)
    fig += T(104, y0 + 34, a, cl, 22, 'start') + T(104, y0 + 66, b, MU3, 17, 'start', halo=False)
add(sb, 'STRATEGI', 'Langkah menyelesaikan masalah',
    TABLE(['Situasi', '<i>m</i> (kadar)', '<i>c</i> (nilai awal)'],
          [['Tambang teksi', 'RM sekilometer', 'caj asas'], ['Isi padu tangki', 'liter seminit', 'isi padu awal'],
           ['Simpanan', 'RM sebulan', 'simpanan awal']], col, rv=True)
    + BUL(['Pilih huruf yang bermakna (cth: <i>t</i> untuk masa, <i>K</i> untuk kos).',
           'Nyatakan jawapan dengan unit dan dalam ayat.'], col),
    svg(fig, 'Empat langkah penyelesaian masalah'))

# 5 Ringkasan bab
add(sb, 'RINGKASAN', 'Ringkasan bab Garis Lurus', '', '',
    TABLE(['Perkara', 'Rumus / Kaedah'],
          [['Bentuk kecerunan-pintasan', '<i>y</i> = <i>mx</i> + <i>c</i> &nbsp;(<i>m</i> = kecerunan, <i>c</i> = pintasan-<i>y</i>)'],
           ['Bentuk am', '<i>ax</i> + <i>by</i> = <i>c</i> &nbsp;→&nbsp; <i>m</i> = −<i>a</i>/<i>b</i>'],
           ['Bentuk pintasan', f'{FR("<i>x</i>", "<i>a</i>")} + {FR("<i>y</i>", "<i>b</i>")} = 1 &nbsp;(<i>a</i> = pintasan-<i>x</i>, <i>b</i> = pintasan-<i>y</i>)'],
           ['Titik pada garis', 'koordinat memuaskan persamaan'],
           ['Garis selari', '<i>m</i>₁ = <i>m</i>₂'],
           ['Persamaan garis', 'cari <i>m</i> → gantikan satu titik → cari <i>c</i>'],
           ['Titik persilangan', 'selesaikan dua persamaan serentak']], col, rv=True))

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
assert counts == {'9.1.1': 6, '9.1.2': 6, '9.1.3': 5, '9.1.4': 6, '9.1.5': 5, '9.1.6': 6, '9.1.7': 5}, counts

js = ('/* Dijana oleh tools/garislurus/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
