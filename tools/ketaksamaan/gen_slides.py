# Penjana slaid NOTA KETAKSAMAAN (Tingkatan 4 Bab 6 Ketaksamaan Linear dalam Dua Pemboleh Ubah) -> ketaksamaan/slides.js
# Jalankan:  python3 tools/ketaksamaan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'ketaksamaan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM T4 Bab 6 ada dua SK: 6.1 dan 6.2
SUB = {
    '6.1': ('Ketaksamaan Linear dalam Dua Pemboleh Ubah', C['tr']),
    '6.2': ('Sistem Ketaksamaan Linear dalam Dua Pemboleh Ubah', C['pk']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
LT, GT, LE, GE = '&lt;', '&gt;', '≤', '≥'
OPS = {'<': LT, '>': GT, '<=': LE, '>=': GE}

# ---------- semakan matematik ----------
def holds(A, B, Cc, op, x, y):
    """Adakah (x, y) memuaskan A x + B y op C?"""
    v = F(A) * x + F(B) * y
    return {'<': v < Cc, '>': v > Cc, '<=': v <= Cc, '>=': v >= Cc}[op]

def fs(v):
    v = F(v)
    t = str(abs(v.numerator)) if v.denominator == 1 else f'{abs(v.numerator)}/{v.denominator}'
    return ('−' if v < 0 else '') + t

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
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: 18px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
def I(v):
    return f'<i>{v}</i>'
X_, Y_ = I('x'), I('y')

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'

def r1(v): return round(float(v), 1)

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def DOT(p, col=TX, r=7):
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

def clip(poly, A, B, Cc, op):
    """Sutherland-Hodgman: kekalkan bahagian poligon yang memuaskan A x + B y op C (sempadan disertakan)."""
    le = op in ('<', '<=')
    f = lambda p: (A * p[0] + B * p[1] - Cc) * (1 if le else -1)   # <= 0 di dalam
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        fp, fq = f(p), f(q)
        if fp <= 1e-9: out.append(p)
        if (fp < -1e-9 and fq > 1e-9) or (fp > 1e-9 and fq < -1e-9):
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out

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
    def draw(self, nums=True, step=1, fs_=15, labels=True):
        s = ''
        for i in range(math.ceil(self.x0), math.floor(self.x1) + 1):
            s += LINE(self.p(i, self.y0), self.p(i, self.y1), GRID, 1.5, cap='butt')
        for j in range(math.ceil(self.y0), math.floor(self.y1) + 1):
            s += LINE(self.p(self.x0, j), self.p(self.x1, j), GRID, 1.5, cap='butt')
        s += ARROW(self.p(self.x0, 0), (self.X(self.x1) + 6, self.Y(0)), MU, 2.5, 10)
        s += ARROW(self.p(0, self.y0), (self.X(0), self.Y(self.y1) - 6), MU, 2.5, 10)
        if labels:
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
    def boxpoly(self):
        return [(self.x0, self.y0), (self.x1, self.y0), (self.x1, self.y1), (self.x0, self.y1)]
    def region(self, hs, col, alpha='38'):
        """Lorek rantau sepunya bagi senarai (A, B, C, op)."""
        poly = self.boxpoly()
        for A, B_, Cc, op in hs:
            poly = clip(poly, A, B_, Cc, op)
        assert len(poly) >= 3, 'rantau kosong'
        return POLY([self.p(*q) for q in poly], f'{col}{alpha}'), poly
    def hline(self, A, B_, Cc, op, col, sw=4.5):
        """Garis A x + B y = C: padu bagi <= / >=, putus-putus bagi < / >."""
        dash = None if op in ('<=', '>=') else '12 9'
        pts = []
        if B_ == 0:
            x = F(Cc, A); pts = [(x, self.y0), (x, self.y1)]
        else:
            for x in (self.x0, self.x1):
                y = (Cc - A * x) / B_
                if self.y0 - 1e-9 <= y <= self.y1 + 1e-9: pts.append((x, y))
            if A != 0:
                for y in (self.y0, self.y1):
                    x = (Cc - B_ * y) / A
                    if self.x0 - 1e-9 <= x <= self.x1 + 1e-9: pts.append((x, y))
            pts = sorted(set((round(float(x), 6), round(float(y), 6)) for x, y in pts))
        return LINE(self.p(*pts[0]), self.p(*pts[-1]), col, sw, dash, 'butt' if dash else 'round')
    def pt(self, x, y, lab, col=TX, dx=12, dy=-18, anchor='start', size=18):
        return DOT(self.p(x, y), col) + (T(self.X(x) + dx, self.Y(y) + dy, lab, col, size, anchor) if lab else '')

def poly_eq(poly, verts):
    """Bandingkan bucu poligon dengan senarai jangkaan (tanpa tertib)."""
    got = sorted({(round(float(x), 6), round(float(y), 6)) for x, y in poly})
    want = sorted({(float(x), float(y)) for x, y in verts})
    return got == want

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 6.1 KETAKSAMAAN LINEAR =====================
col = SUB['6.1'][1]

# 6.1-1 Definisi
pl = Plane(-2, 6, -2, 7)
above = (-1, 1, 1, '>=')     # -x + y >= 1  <=>  y >= x + 1
below = (-1, 1, 1, '<=')
assert holds(*above, 1, 4) and not holds(*above, 4, 2)
fig = pl.draw()
fig += pl.region([above], TR, '30')[0] + pl.region([below], PK, '24')[0]
fig += pl.hline(-1, 1, 1, '<=', AM)
fig += T(pl.X(0.6), pl.Y(5.3), f'y {GT} x + 1', TR, 22, italic=True)
fig += T(pl.X(4.2), pl.Y(1.4), f'y {LT} x + 1', PK, 22, italic=True)
fig += T(pl.X(5.0), pl.Y(6.4), 'y = x + 1', AM, 19, 'end', italic=True)
fig += T(pl.X(0.6), pl.Y(4.4), 'rantau di atas garis', MU3, 15)
fig += T(pl.X(4.2), pl.Y(0.5), 'rantau di bawah garis', MU3, 15)
add('6.1', 'DEFINISI', 'Apa itu ketaksamaan linear dalam dua pemboleh ubah?',
    DEF(f'<b>Ketaksamaan linear dalam dua pemboleh ubah</b> ialah hubungan tidak sama yang melibatkan dua pemboleh ubah, {X_} dan {Y_}, berkuasa satu.', col)
    + TABLE(['Simbol', 'Maksud'], [[LT, 'kurang daripada'], [GT, 'lebih daripada'], [LE, 'kurang daripada atau sama dengan'], [GE, 'lebih daripada atau sama dengan']], col)
    + NOTE(f'2{X_} + 3{Y_} {LE} 12 dan {Y_} {GT} {X_} − 1 ialah ketaksamaan linear; {X_}² + {Y_} {GT} 4 dan {X_}{Y_} {LE} 6 <b>bukan</b>.', 'Contoh:'),
    svg(fig, 'Garis y = x + 1 membahagikan satah kepada rantau y > x + 1 di atas dan y < x + 1 di bawah'))

# 6.1-2 Membentuk ketaksamaan daripada situasi
assert 2 * 5 + 5 * 4 == 30 and 2 * 5 + 5 * 4 <= 30
FRASA = [('tidak melebihi', LE), ('selebih-lebihnya / paling banyak', LE), ('sekurang-kurangnya', GE), ('tidak kurang daripada', GE),
         ('kurang daripada', LT), ('lebih daripada / melebihi', GT)]
fig = T(250, 30, 'Frasa → simbol', MU3, 20, halo=False)
for i, (fr, sy) in enumerate(FRASA):
    y = 78 + i * 62
    cl = [TR, TR, GR, GR, PK, PA][i]
    fig += RECT(24, y - 24, 452, 48, SURF, BD, 14, 2)
    fig += T(48, y, fr, TX, 19, 'start') + RECT(400, y - 18, 60, 36, f'{cl}26', cl, 10, 2) + T(430, y + 1, sy, cl, 24)
fig += T(250, 448, '2x + 5y ≤ 30', AM, 24, italic=True)
add('6.1', 'MEMBENTUK KETAKSAMAAN', 'Daripada situasi kepada ketaksamaan',
    P(f'Harga sebatang pen ialah RM2 dan harga sebuah buku ialah RM5. Lina membeli {X_} batang pen dan {Y_} buah buku dengan jumlah wang <b>tidak melebihi</b> RM30. Bentukkan satu ketaksamaan linear.', True)
    + STEPS([f'Kos pen = 2{X_}, kos buku = 5{Y_}',
             f'Jumlah kos = 2{X_} + 5{Y_}',
             f'“tidak melebihi” → {LE}'], col)
    + ANS(f'2{X_} + 5{Y_} {LE} 30')
    + NOTE(f'5 pen dan 4 buku → 2(5) + 5(4) = 30 {LE} 30, maka Lina mampu membelinya.', 'Semak:'),
    svg(fig, 'Jadual frasa dan simbol ketaksamaan'))

# 6.1-3 Titik memuaskan ketaksamaan
hs = (-1, 1, 1, '>')   # y > x + 1
PTS = [('A', 1, 4, True), ('B', 3, 2, False), ('C', 2, 3, False)]
for nm, x, y, ok in PTS: assert holds(*hs, x, y) == ok
assert 3 == 2 + 1   # C pada garis
pl = Plane(-1, 6, -1, 7)
fig = pl.draw() + pl.region([hs], TR, '30')[0] + pl.hline(*hs, AM)
fig += pl.pt(1, 4, 'A(1, 4)', GR, -12, -18, 'end') + pl.pt(3, 2, 'B(3, 2)', RD, 12, 18) + pl.pt(2, 3, 'C(2, 3)', AM, 14, 4)
fig += T(pl.X(5.6), pl.Y(6.4), f'y {GT} x + 1', TR, 21, 'end', italic=True)
add('6.1', 'CONTOH BERLANGKAH', 'Adakah titik memuaskan ketaksamaan?',
    P(f'Tentukan sama ada titik A(1, 4), B(3, 2) dan C(2, 3) memuaskan ketaksamaan {Y_} {GT} {X_} + 1.', True)
    + STEPS([f'A: {Y_} = 4, {X_} + 1 = 2 → 4 {GT} 2 {B("✓", GR)}',
             f'B: {Y_} = 2, {X_} + 1 = 4 → 2 {GT} 4 {B("✗", RD)}',
             f'C: {Y_} = 3, {X_} + 1 = 3 → 3 {GT} 3 {B("✗", RD)} (C terletak pada garis)'], col)
    + ANS('Hanya titik A memuaskan ketaksamaan')
    + NOTE(f'Titik pada garis hanya memuaskan ketaksamaan {LE} atau {GE}.'),
    svg(fig, 'Rantau y > x + 1 dengan titik A di dalam rantau, B di luar dan C pada garis putus-putus'))

# 6.1-4 Rantau dan jenis garis
PAN = [(f'y ≥ x + 1', (-1, 1, 1, '>='), 'garis padu · atas'),
       (f'y {LT} −x + 2', (1, 1, 2, '<'), 'putus-putus · bawah'),
       (f'x {GT} 1', (1, 0, 1, '>'), 'putus-putus · kanan'),
       (f'y ≤ 1', (0, 1, 1, '<='), 'garis padu · bawah')]
assert holds(1, 1, 2, '<', 0, 0) and holds(1, 0, 1, '>', 2, 0) and holds(0, 1, 1, '<=', 0, 0) and holds(-1, 1, 1, '>=', 0, 3)
fig = ''
for i, (nm, h_, d) in enumerate(PAN):
    x0, y0 = 12 + (i % 2) * 242, 10 + (i // 2) * 228
    fig += RECT(x0, y0, 234, 220, SURF, BD, 16, 2)
    pp = Plane(-3, 3, -3, 3, (x0 + 52, y0 + 40, x0 + 182, y0 + 170))
    fig += pp.region([h_], TR, '38')[0]
    fig += LINE(pp.p(-3, 0), pp.p(3, 0), MU2, 2) + LINE(pp.p(0, -3), pp.p(0, 3), MU2, 2)
    fig += pp.hline(*h_, AM, 4)
    fig += T(x0 + 117, y0 + 22, nm, TR, 19, italic=True) + T(x0 + 117, y0 + 198, d, MU3, 15, halo=False)
add('6.1', 'KONSEP', 'Rantau dan jenis garis',
    TABLE(['Ketaksamaan', 'Rantau'],
          [[f'{Y_} {GT} m{X_} + c atau {Y_} {GE} m{X_} + c', 'di atas garis'],
           [f'{Y_} {LT} m{X_} + c atau {Y_} {LE} m{X_} + c', 'di bawah garis'],
           [f'{X_} {GT} a atau {X_} {GE} a', 'di sebelah kanan garis'],
           [f'{X_} {LT} a atau {X_} {LE} a', 'di sebelah kiri garis']], col, rv=True)
    + BUL([f'{B("Garis putus-putus", AM)} bagi {LT} atau {GT}: titik pada garis <b>tidak</b> termasuk.',
           f'{B("Garis padu", AM)} bagi {LE} atau {GE}: titik pada garis termasuk.'], col),
    svg(fig, 'Empat contoh rantau: y ≥ x + 1, y < −x + 2, x > 1 dan y ≤ 1'))

# 6.1-5 Melorek rantau 2x + y <= 6
hs = (2, 1, 6, '<=')
assert holds(*hs, 0, 0) and 2 * 0 + 6 == 6 and 2 * 3 + 0 == 6
pl = Plane(-1, 5, -1, 8, (40, 22, 470, 448))
reg, poly = pl.region([hs], TR, '38')
fig = pl.draw() + reg + pl.hline(*hs, AM)
fig += pl.pt(0, 6, '(0, 6)', AM, 12, -4) + pl.pt(3, 0, '(3, 0)', AM, 10, -18)
fig += DOT(pl.p(0, 0), GR) + T(pl.X(0) + 14, pl.Y(0) - 16, 'O', GR, 18, 'start')
fig += T(pl.X(3.4), pl.Y(5.2), '2x + y = 6', AM, 20, 'start', italic=True)
fig += T(pl.X(1.1), pl.Y(1.6), '2x + y ≤ 6', TR, 20, italic=True)
add('6.1', 'CONTOH BERLANGKAH', 'Melorek rantau 2x + y ≤ 6',
    P(f'Lorek rantau yang memuaskan 2{X_} + {Y_} {LE} 6.', True)
    + STEPS([f'Garis 2{X_} + {Y_} = 6: {X_} = 0 → {Y_} = 6; {Y_} = 0 → {X_} = 3. Plot (0, 6) dan (3, 0).',
             f'Simbol {LE} → lukis {B("garis padu", AM)}.',
             f'Uji titik O(0, 0): 2(0) + 0 = 0 {LE} 6 {B("benar", GR)}.',
             'Lorek rantau yang mengandungi O, iaitu di bawah garis.'], col)
    + ANS('Rantau di bawah garis padu 2<i>x</i> + <i>y</i> = 6')
    + NOTE(f'Bentuk lain: {Y_} {LE} −2{X_} + 6 → simbol {LE}, maka rantau di bawah garis.', 'Semak:'),
    svg(fig, 'Rantau 2x + y ≤ 6 berlorek di bawah garis padu melalui (0, 6) dan (3, 0)'))

# 6.1-6 Kesilapan biasa: pekali y negatif
hs = (1, -1, 2, '>')   # x - y > 2  <=>  y < x - 2
assert not holds(*hs, 0, 0) and holds(*hs, 4, 0) and holds(1, -1, 2, '>', 5, 1)
fig = ''
for i, (ok, h2) in enumerate([(False, (-1, 1, -2, '>')), (True, hs)]):   # salah: y > x - 2
    x0 = 12 + i * 242
    cl = GR if ok else RD
    fig += RECT(x0, 12, 234, 330, SURF, cl, 16, 2)
    pp = Plane(-1, 5, -4, 3, (x0 + 22, 64, x0 + 214, 300))
    fig += pp.region([h2], cl, '38')[0]
    fig += LINE(pp.p(-1, 0), pp.p(5, 0), MU2, 2) + LINE(pp.p(0, -4), pp.p(0, 3), MU2, 2)
    fig += pp.hline(1, -1, 2, '>', AM, 4)
    fig += (TICK(x0 + 30, 38) if ok else CROSS(x0 + 30, 38)) + T(x0 + 52, 38, 'Lorek di bawah' if ok else 'Lorek di atas', cl, 18, 'start')
    fig += T(x0 + 117, 322, 'y < x − 2'.replace('<', LT) if ok else 'y > x − 2'.replace('>', GT), cl, 18, italic=True)
fig += RECT(12, 356, 476, 100, SURF, BD, 16, 2)
fig += T(250, 384, 'x − y > 2'.replace('>', GT), TX, 20, italic=True)
fig += T(250, 424, '−y > −x + 2 → y < x − 2'.replace('>', GT).replace('<', LT), AM, 20, italic=True)
add('6.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    P(f'Lorek rantau {X_} − {Y_} {GT} 2.', True)
    + BUL([f'{B("Lupa menukar simbol", RD)}: apabila darab atau bahagi dengan nombor <b>negatif</b>, simbol mesti diterbalikkan. −{Y_} {GT} −{X_} + 2 menjadi {Y_} {LT} {X_} − 2.',
           f'{B("Salah jenis garis", RD)}: {GT} memerlukan garis <b>putus-putus</b>, bukan garis padu.',
           f'{B("Tidak menyemak", RD)}: uji titik (0, 0): 0 − 0 = 0 {GT} 2 palsu, maka (0, 0) <b>tidak</b> dalam rantau.'], col)
    + NOTE(f'Jika garis tidak melalui (0, 0), gunakan (0, 0) sebagai titik ujian.', 'Tip:'),
    svg(fig, 'Perbandingan rantau salah di atas garis dan rantau betul di bawah garis y = x − 2'))

# 6.1-7 Ringkasan
LANG = [('1', 'Bentuk ketaksamaan', 'frasa → simbol', TR),
        ('2', 'Lukis garis', '= : cari dua titik', AM),
        ('3', 'Jenis garis', f'{LE} {GE} padu · {LT} {GT} putus-putus', PA),
        ('4', 'Tentukan rantau', 'atas/bawah · kiri/kanan', PK),
        ('5', 'Semak', 'uji satu titik', GR)]
fig = ''
for i, (n, a, b, cl) in enumerate(LANG):
    y0 = 14 + i * 90
    fig += RECT(14, y0, 472, 78, SURF, BD, 16, 2)
    fig += f'<circle cx="54" cy="{y0 + 39}" r="22" fill="{cl}"/>' + T(54, y0 + 40, n, NAV, 22, halo=False)
    fig += T(92, y0 + 26, a, cl, 20, 'start') + T(92, y0 + 56, b, MU3, 17, 'start', halo=False)
add('6.1', 'RINGKASAN', 'Ringkasan 6.1',
    TABLE(['Bentuk', 'Garis', 'Rantau'],
          [[f'{Y_} {GT} m{X_} + c', 'putus-putus', 'atas'],
           [f'{Y_} {GE} m{X_} + c', 'padu', 'atas'],
           [f'{Y_} {LT} m{X_} + c', 'putus-putus', 'bawah'],
           [f'{Y_} {LE} m{X_} + c', 'padu', 'bawah']], col, rv=True)
    + BUL([f'{X_} {GT} a: kanan &nbsp;·&nbsp; {X_} {LT} a: kiri &nbsp;·&nbsp; {Y_} {GT} a: atas &nbsp;·&nbsp; {Y_} {LT} a: bawah',
           'Darab atau bahagi dengan nombor negatif → terbalikkan simbol.'], col),
    svg(fig, 'Lima langkah melorek rantau ketaksamaan linear'))

# ===================== 6.2 SISTEM KETAKSAMAAN =====================
col = SUB['6.2'][1]

# 6.2-1 Definisi
SYS1 = [(-1, 1, 2, '<='), (0, 1, 1, '>='), (1, 0, 4, '<')]   # y <= x + 2, y >= 1, x < 4
pl = Plane(-2, 6, -1, 7)
reg, poly = pl.region(SYS1, PK, '4D')
assert poly_eq(poly, [(-1, 1), (4, 1), (4, 6)])
assert all(holds(*h_, 2, 2) for h_ in SYS1)
fig = pl.draw() + reg
fig += pl.hline(*SYS1[0], TR) + pl.hline(*SYS1[1], GR) + pl.hline(*SYS1[2], AM)
fig += T(pl.X(0.2), pl.Y(5.6), 'y ≤ x + 2', TR, 19, italic=True)
fig += T(pl.X(-1.8), pl.Y(0.5), 'y ≥ 1', GR, 19, 'start', italic=True)
fig += T(pl.X(4.2), pl.Y(6.5), f'x {LT} 4', AM, 19, 'start', italic=True)
fig += T(pl.X(2.9), pl.Y(2.2), 'rantau', PK, 18) + T(pl.X(2.9), pl.Y(1.6), 'sepunya', PK, 18)
add('6.2', 'DEFINISI', 'Sistem ketaksamaan linear',
    DEF(f'<b>Sistem ketaksamaan linear</b> ialah gabungan dua atau lebih ketaksamaan linear. <b>Rantau sepunya</b> ialah rantau yang memuaskan <b>semua</b> ketaksamaan secara serentak.', col)
    + P(f'Contoh: {Y_} {LE} {X_} + 2, &nbsp;{Y_} {GE} 1, &nbsp;{X_} {LT} 4', True)
    + BUL(['Lukis setiap garis dan tentukan rantau bagi setiap ketaksamaan.',
           'Rantau sepunya ialah kawasan yang bertindih bagi semua rantau.'], col)
    + NOTE('Setiap titik dalam rantau sepunya ialah satu penyelesaian bagi sistem itu.'),
    svg(fig, 'Rantau sepunya bagi y ≤ x + 2, y ≥ 1 dan x < 4 berbentuk segi tiga'))

# 6.2-2 Membentuk sistem
assert 2 * 7 >= 12 and not (2 * 5 >= 12)          # x >= 2y contoh
REL = [('x sekurang-kurangnya dua kali y', 'x ≥ 2y', TR),
       ('y selebih-lebihnya tiga kali x', 'y ≤ 3x', GR),
       ('x melebihi y sekurang-kurangnya 5', 'x − y ≥ 5', AM),
       ('jumlah x dan y kurang daripada 40', f'x + y {LT} 40', PA),
       ('nisbah x kepada y sekurang-kurangnya 1 : 2', '2x ≥ y', PU)]
fig = T(250, 30, 'Frasa hubungan → ketaksamaan', MU3, 19, halo=False)
for i, (fr, ek, cl) in enumerate(REL):
    y = 82 + i * 76
    fig += RECT(18, y - 30, 464, 60, SURF, BD, 14, 2)
    fig += T(36, y - 10, fr, TX, 17, 'start') + T(464, y + 14, ek, cl, 20, 'end', italic=True)
add('6.2', 'MEMBENTUK SISTEM', 'Membentuk sistem ketaksamaan',
    P(f'Sebuah kedai menjual {X_} biji kek dan {Y_} buku roti sehari. Jumlah kek dan roti <b>sekurang-kurangnya</b> 20. Bilangan kek <b>selebih-lebihnya</b> dua kali bilangan roti. Bilangan roti <b>kurang daripada</b> 15.', True)
    + STEPS([f'Jumlah sekurang-kurangnya 20 → {X_} + {Y_} {GE} 20',
             f'Kek selebih-lebihnya dua kali roti → {X_} {LE} 2{Y_}',
             f'Roti kurang daripada 15 → {Y_} {LT} 15'], col)
    + ANS(f'{X_} + {Y_} {GE} 20, &nbsp;{X_} {LE} 2{Y_}, &nbsp;{Y_} {LT} 15')
    + NOTE(f'“{X_} sekurang-kurangnya dua kali {Y_}” bermaksud {X_} {GE} 2{Y_}, <b>bukan</b> 2{X_} {GE} {Y_}.'),
    svg(fig, 'Jadual frasa hubungan dua pemboleh ubah dan ketaksamaan'))

# 6.2-3 Melorek rantau sepunya
SYS3 = [(-1, 1, 0, '>='), (1, 1, 6, '<='), (1, 0, 1, '>')]   # y >= x, x + y <= 6, x > 1
pl = Plane(-1, 7, -1, 7)
reg, poly = pl.region(SYS3, PK, '4D')
assert poly_eq(poly, [(1, 1), (1, 5), (3, 3)])
fig = pl.draw() + reg + pl.hline(*SYS3[0], TR) + pl.hline(*SYS3[1], GR) + pl.hline(*SYS3[2], AM)
fig += T(pl.X(5.6), pl.Y(6.5), 'y = x', TR, 19, 'end', italic=True)
fig += T(pl.X(5.4), pl.Y(1.2), 'x + y = 6', GR, 19, 'start', italic=True)
fig += T(pl.X(1.2), pl.Y(6.6), 'x = 1', AM, 19, 'start', italic=True)
fig += T(pl.X(1.75), pl.Y(3.0), 'R', PK, 24)
add('6.2', 'CONTOH BERLANGKAH', 'Melorek rantau sepunya',
    P(f'Lorek rantau R yang memuaskan {Y_} {GE} {X_}, {X_} + {Y_} {LE} 6 dan {X_} {GT} 1.', True)
    + STEPS([f'Lukis {B("y = x", TR)} dan {B("x + y = 6", GR)} sebagai garis padu ({GE}, {LE}), dan {B("x = 1", AM)} sebagai garis putus-putus ({GT}).',
             f'{Y_} {GE} {X_}: atas {Y_} = {X_}; atas {Y_} = {X_} · {X_} + {Y_} {LE} 6: bawah (uji (0, 0): 0 {LE} 6) · {X_} {GT} 1: kanan {X_} = 1nbsp;{X_} + {Y_} {LE} 6: bawah (uji (0, 0): 0 {LE} 6 benar); &nbsp;{X_} {GT} 1: kanan {X_} = 1',
             'Lorek kawasan yang bertindih bagi ketiga-tiga rantau.'], col)
    + ANS('R ialah segi tiga dengan bucu (1, 1), (1, 5) dan (3, 3)'),
    svg(fig, 'Rantau sepunya R bagi y ≥ x, x + y ≤ 6 dan x > 1'))

# 6.2-4 Titik dalam rantau sepunya
CHK = [('P', 2, 3), ('Q', 1, 3), ('R', 4, 1)]
res = {n: [holds(*h_, x, y) for h_ in SYS3] for n, x, y in CHK}
assert res == {'P': [True, True, True], 'Q': [True, True, False], 'R': [False, True, True]}
mk = lambda b: B('✓', GR) if b else B('✗', RD)
fig = pl.draw() + reg + pl.hline(*SYS3[0], TR) + pl.hline(*SYS3[1], GR) + pl.hline(*SYS3[2], AM)
fig += pl.pt(2, 3, 'P(2, 3)', GR, 12, -14) + pl.pt(1, 3, 'Q(1, 3)', RD, -12, -14, 'end') + pl.pt(4, 1, 'R(4, 1)', RD, 12, 16)
add('6.2', 'KONSEP', 'Titik dalam rantau sepunya',
    P(f'Sistem: {Y_} {GE} {X_}, {X_} + {Y_} {LE} 6, {X_} {GT} 1. Titik manakah dalam rantau sepunya?', True)
    + TABLE(['Titik', f'{Y_} {GE} {X_}', f'{X_} + {Y_} {LE} 6', f'{X_} {GT} 1', 'Dalam?'],
            [[n] + [mk(b) for b in res[n]] + [mk(all(res[n]))] for n, _, _ in CHK], col, rv=True)
    + BUL(['Titik mesti memuaskan <b>setiap</b> ketaksamaan dalam sistem.',
           f'Q(1, 3) terletak pada garis putus-putus {X_} = 1, maka Q <b>tidak</b> termasuk.'], col),
    svg(fig, 'Titik P di dalam rantau sepunya, Q pada garis putus-putus dan R di luar rantau'))

# 6.2-5 Tulis sistem daripada rajah
SYS5 = [(1, 1, 6, '<='), (0, 1, 1, '>'), (-1, 1, 0, '<=')]   # x + y <= 6, y > 1, y <= x
pl = Plane(-1, 7, -1, 7)
reg, poly = pl.region(SYS5, PK, '4D')
assert poly_eq(poly, [(1, 1), (5, 1), (3, 3)])
assert all(holds(*h_, 3, 2) for h_ in SYS5)
fig = pl.draw() + reg + pl.hline(*SYS5[0], GR) + pl.hline(*SYS5[1], AM) + pl.hline(*SYS5[2], TR)
fig += T(pl.X(5.6), pl.Y(6.5), 'y = x', TR, 19, 'end', italic=True)
fig += T(pl.X(0.3), pl.Y(6.4), 'x + y = 6', GR, 19, 'start', italic=True)
fig += T(pl.X(6.8), pl.Y(1.45), 'y = 1', AM, 19, 'end', italic=True)
add('6.2', 'CONTOH BERLANGKAH', 'Menulis sistem daripada rantau berlorek',
    P('Tulis tiga ketaksamaan yang mentakrifkan rantau berlorek dalam rajah.', True)
    + STEPS([f'Garis {B("x + y = 6", GR)} padu, rantau di bawah → {X_} + {Y_} {LE} 6',
             f'Garis {B("y = 1", AM)} putus-putus, rantau di atas → {Y_} {GT} 1',
             f'Garis {B("y = x", TR)} padu, rantau di bawah → {Y_} {LE} {X_}'], col)
    + ANS(f'{X_} + {Y_} {LE} 6, &nbsp;{Y_} {GT} 1, &nbsp;{Y_} {LE} {X_}')
    + NOTE(f'Semak dengan titik (3, 2) dalam rantau: 5 {LE} 6, 2 {GT} 1, 2 {LE} 3. Semua benar.', 'Semak:'),
    svg(fig, 'Rantau berlorek dibatasi oleh garis x + y = 6, y = 1 dan y = x'))

# 6.2-6 Penyelesaian masalah
SYS6 = [(1, 1, 10, '<='), (1, -1, 0, '>='), (0, 1, 2, '>=')]   # x + y <= 10, x >= y, y >= 2
pl = Plane(-1, 11, -1, 11, (36, 22, 476, 448))
reg, poly = pl.region(SYS6, PK, '4D')
assert poly_eq(poly, [(2, 2), (8, 2), (5, 5)])
okA = [holds(*h_, 4, 5) for h_ in SYS6]; assert okA == [True, False, True]
ymax = max(y for x in range(0, 11) for y in range(0, 11) if all(holds(*h_, x, y) for h_ in SYS6))
assert ymax == 5 and all(holds(*h_, 5, 5) for h_ in SYS6)
fig = pl.draw() + reg + pl.hline(*SYS6[0], GR) + pl.hline(*SYS6[1], TR) + pl.hline(*SYS6[2], AM)
fig += pl.pt(4, 5, '(4, 5)', RD, -12, -14, 'end') + pl.pt(5, 5, '(5, 5)', GR, 12, -14)
fig += T(pl.X(10.6), pl.Y(10.4), 'x = y', TR, 18, 'end', italic=True)
fig += T(pl.X(0.4), pl.Y(9.4), 'x + y = 10', GR, 18, 'start', italic=True)
fig += T(pl.X(10.6), pl.Y(2.5), 'y = 2', AM, 18, 'end', italic=True)
add('6.2', 'PENYELESAIAN MASALAH', 'Membeli bola untuk kelab',
    P(f'Kelab sukan membeli {X_} bola sepak dan {Y_} bola jaring. Jumlah bola tidak melebihi 10, bilangan bola sepak sekurang-kurangnya bilangan bola jaring dan sekurang-kurangnya 2 bola jaring dibeli.', True)
    + STEPS([f'Sistem: {X_} + {Y_} {LE} 10, &nbsp;{X_} {GE} {Y_}, &nbsp;{Y_} {GE} 2',
             f'(a) 4 bola sepak, 5 bola jaring: 4 {GE} 5 {B("✗", RD)} → tidak boleh.',
             f'(b) Titik tertinggi dalam rantau ialah (5, 5) → maksimum 5 bola jaring.'], col)
    + ANS('(a) Tidak boleh &nbsp;(b) 5 bola jaring'),
    svg(fig, 'Rantau sepunya bagi x + y ≤ 10, x ≥ y dan y ≥ 2 dengan titik (5, 5) paling tinggi'))

# 6.2-7 Kesilapan biasa & ringkasan
fig = ''
CASES = [(46, 'Lorek rantau setiap ketaksamaan sahaja', False), (116, 'Lorek kawasan bertindih (rantau sepunya)', True),
         (196, 'x sekurang-kurangnya 2 kali y: 2x ≥ y', False), (266, 'x sekurang-kurangnya 2 kali y: x ≥ 2y', True),
         (346, 'Titik pada garis putus-putus termasuk', False), (416, 'Titik pada garis putus-putus tidak termasuk', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(46, y) if ok else CROSS(46, y)) + T(74, y, t, GR if ok else RD, 17, 'start')
add('6.2', 'RINGKASAN', 'Kesilapan biasa dan ringkasan',
    BUL([f'{B("Bentuk", TR)} setiap ketaksamaan daripada frasa dalam situasi.',
         f'{B("Lukis", AM)} setiap garis: padu ({LE}, {GE}) atau putus-putus ({LT}, {GT}).',
         f'{B("Lorek", PK)} rantau sepunya, iaitu kawasan yang memuaskan semua ketaksamaan.',
         f'{B("Semak", GR)} dengan satu titik dalam rantau, kemudian jawab soalan masalah.'], col)
    + NOTE('Dalam masalah harian, bilangan barang ialah nombor bulat, jadi pilih titik dengan koordinat integer.'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang sistem ketaksamaan linear'))

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
# simbol < > mentah dalam teks SVG/HTML mesti ditulis sebagai entiti
for s in out:
    for k in ('body', 'fig'):
        txt = re.sub(r'<[^>]*>', '', s[k])
        assert '<' not in txt and '>' not in txt, (s['title'], k)
assert counts == {'6.1': 7, '6.2': 7}, counts

js = ('/* Dijana oleh tools/ketaksamaan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
