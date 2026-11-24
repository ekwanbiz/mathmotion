# Penjana slaid NOTA GRAF GERAKAN (Tingkatan 4 Bab 7 Graf Gerakan) -> grafgerakan/slides.js
# Jalankan:  python3 tools/grafgerakan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'grafgerakan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM T4 Bab 7: SK 7.1 Graf Jarak-Masa, SK 7.2 Graf Laju-Masa
SUB = {
    '7.1': ('Graf Jarak-Masa', C['tr']),
    '7.2': ('Graf Laju-Masa', C['pa']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']


def num(x):
    """Nombor kemas (tanpa .0, tanda tolak sebenar)."""
    x = F(x)
    if x.denominator == 1:
        s = str(abs(x.numerator))
    else:
        v = float(abs(x))
        s = f'{v:.2f}'.rstrip('0').rstrip('.')
        assert abs(float(s) - v) < 1e-9, f'nombor tidak tamat: {x}'
    return ('−' if x < 0 else '') + s


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
    return ('<span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; '
            'line-height: 1.1; font-size: 0.85em; margin: 0 2px; white-space: nowrap"><span style="padding: 0 4px; border-bottom: 2px solid currentColor">'
            f'{a}</span><span>{b}</span></span>')
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
LAJU = FR('jarak', 'masa')
PECUT = FR('perubahan laju', 'masa')

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

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'

def POLY(pts, fill, stroke='none', sw=0):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    return f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'

def PLINE(pts, col, sw=5):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    return f'<polyline points="{pp}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'

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


class Graph:
    """Graf gerakan: paksi masa (mengufuk) [0, tmax] dan paksi y (jarak / laju) [0, ymax] dalam kotak (L, T, R, B)."""
    def __init__(self, tmax, ymax, xt, yt, xlab, ylab, box=(78, 52, 462, 400)):
        self.tmax, self.ymax, self.xt, self.yt, self.xlab, self.ylab = tmax, ymax, xt, yt, xlab, ylab
        self.L, self.T_, self.R, self.B = box
    def X(self, t): return self.L + (self.R - self.L) * t / self.tmax
    def Y(self, v): return self.B - (self.B - self.T_) * v / self.ymax
    def p(self, t, v): return (self.X(t), self.Y(v))
    def draw(self, size=16):
        s = ''
        for t in self.xt:
            if t: s += LINE(self.p(t, 0), self.p(t, self.ymax), GRID, 1.5, cap='butt')
        for v in self.yt:
            if v: s += LINE(self.p(0, v), self.p(self.tmax, v), GRID, 1.5, cap='butt')
        s += ARROW((self.L, self.B), (self.R + 20, self.B), MU, 2.5, 10)
        s += ARROW((self.L, self.B), (self.L, self.T_ - 22), MU, 2.5, 10)
        for t in self.xt:
            s += T(self.X(t), self.B + 18, num(t), MU2, size, weight=600)
        for v in self.yt:
            if v: s += T(self.L - 10, self.Y(v), num(v), MU2, size, 'end', weight=600)
        s += T(self.L - 8, self.T_ - 34, self.ylab, MU3, 17, 'start', halo=False)
        s += T(self.R + 22, self.B + 44, self.xlab, MU3, 17, 'end', halo=False)
        return s
    def path(self, pts, col=AM, sw=5):
        return PLINE([self.p(*q) for q in pts], col, sw)
    def seg(self, a, b, col, sw=6):
        return LINE(self.p(*a), self.p(*b), col, sw)
    def guide(self, t, v, col=DIM):
        return LINE(self.p(t, 0), self.p(t, v), col, 2.5, '6 6') + LINE(self.p(0, v), self.p(t, v), col, 2.5, '6 6')
    def area(self, pts, fill):
        poly = [self.p(pts[0][0], 0)] + [self.p(*q) for q in pts] + [self.p(pts[-1][0], 0)]
        return POLY(poly, fill)
    def dots(self, pts, col=TX):
        return ''.join(DOT(self.p(*q), col, 6) for q in pts)
    def lab(self, t, v, txt, col=TX, dx=0, dy=-22, anchor='middle', size=18):
        return T(self.X(t) + dx, self.Y(v) + dy, txt, col, size, anchor)


def speed(a, b):
    return F(b[1] - a[1], b[0] - a[0])

def area_under(pts):
    """Luas di bawah graf poligon (trapezium demi trapezium)."""
    return sum(F(b[0] - a[0]) * F(a[1] + b[1], 2) for a, b in zip(pts, pts[1:]))


# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 7.1 GRAF JARAK-MASA =====================
col = SUB['7.1'][1]

# 7.1-1 Definisi
pts = [(0, 0), (2, 160)]
assert speed(*pts) == 80
g = Graph(2.5, 200, [0, 0.5, 1, 1.5, 2, 2.5], [0, 40, 80, 120, 160, 200], 'Masa (jam)', 'Jarak (km)')
fig = (g.draw() + g.guide(1, 80, PK) + g.path(pts, AM, 6) + g.dots(pts, AM) + DOT(g.p(1, 80), PK, 7)
       + g.lab(1, 80, 'selepas 1 jam: 80 km', PK, 16, 20, 'start', 18)
       + g.lab(2, 160, 'B', AM, 16, 0, 'start') + g.lab(0, 0, 'A', AM, 16, -16, 'start'))
add('7.1', 'DEFINISI', 'Apa itu graf jarak-masa?',
    DEF('<b>Graf jarak-masa</b> menunjukkan perubahan <b>jarak</b> sesuatu objek dari satu titik tetap mengikut <b>masa</b>.', col)
    + BUL([f'Paksi mengufuk: {B("masa", PK)} &nbsp;·&nbsp; Paksi mencancang: {B("jarak", TR)}.',
           'Setiap titik pada graf memberitahu kedudukan objek pada satu masa tertentu.',
           'Kereta bergerak dari A ke B sejauh 160 km dalam 2 jam. Selepas 1 jam, ia berada 80 km dari A.'], col)
    + NOTE('Baca graf dari <b>kiri ke kanan</b> kerana masa sentiasa bertambah.'),
    svg(fig, 'Graf jarak-masa sebuah kereta: 160 km dalam 2 jam, 80 km selepas 1 jam'))

# 7.1-2 Kecerunan = laju
pts = [(0, 0), (2, 60), (3, 60), (5, 0)]
s1, s2, s3 = speed(pts[0], pts[1]), speed(pts[1], pts[2]), speed(pts[2], pts[3])
assert (s1, s2, s3) == (30, 0, -30)
g = Graph(5.5, 80, [0, 1, 2, 3, 4, 5], [0, 20, 40, 60, 80], 'Masa (jam)', 'Jarak (km)')
fig = (g.draw() + g.seg(pts[0], pts[1], TR) + g.seg(pts[1], pts[2], AM) + g.seg(pts[2], pts[3], PK) + g.dots(pts)
       + g.lab(0.75, 30, 'laju 30 km/j', TR, -6, -16, 'end', 17)
       + g.lab(2.5, 60, 'pegun', AM, 0, -20, 'middle', 18)
       + g.lab(4.2, 28, 'kembali', PK, 8, -14, 'start', 17) + g.lab(4.2, 28, '30 km/j', PK, 8, 8, 'start', 17))
add('7.1', 'KONSEP', 'Kecerunan graf = laju',
    DEF(f'Laju = {LAJU} = <b>kecerunan</b> graf jarak-masa', col)
    + TABLE(['Bentuk garis', 'Maksud'],
            [[B('Naik ↗', TR), 'Bergerak menjauhi titik mula'],
             [B('Mengufuk →', AM), '<b>Pegun</b> (berhenti), laju = 0'],
             [B('Turun ↘', PK), 'Bergerak <b>kembali</b> ke titik mula']], col, rv=True)
    + NOTE('Garis lebih <b>curam</b> bermaksud laju lebih <b>tinggi</b>. Kecerunan negatif hanya menunjukkan arah; laju tetap positif.'),
    svg(fig, 'Graf jarak-masa: naik, mengufuk (pegun) dan turun (kembali)'))

# 7.1-3 Melukis graf
TBL = [(0, 0), (20, 8), (30, 8), (50, 0)]
assert speed(TBL[0], TBL[1]) == F(2, 5) and speed(TBL[1], TBL[2]) == 0 and speed(TBL[2], TBL[3]) == F(-2, 5)
g = Graph(55, 10, [0, 10, 20, 30, 40, 50], [0, 2, 4, 6, 8, 10], 'Masa (minit)', 'Jarak (km)')
fig = g.draw() + g.path(TBL, AM, 5) + g.dots(TBL, PK)
for (t, d), (dx, dy, an) in zip(TBL, [(14, -16, 'start'), (-8, -22, 'end'), (8, -22, 'start'), (-30, -16, 'end')]):
    fig += g.lab(t, d, f'({t}, {d})', PK, dx, dy, an, 16)
add('7.1', 'MELUKIS', 'Melukis graf jarak-masa',
    P('Aina berbasikal dari rumah ke kedai sejauh 8 km dalam 20 minit, singgah 10 minit, kemudian pulang ke rumah dalam 20 minit.', True)
    + TABLE(['Masa (minit)'] + [str(t) for t, _ in TBL], [['Jarak (km)'] + [str(d) for _, d in TBL]], col)
    + STEPS(['Lukis paksi: <b>masa</b> pada paksi mengufuk, <b>jarak</b> pada paksi mencancang. Pilih skala yang sesuai.',
             'Plot titik (0, 0), (20, 8), (30, 8) dan (50, 0).',
             'Sambungkan titik-titik itu dengan garis lurus.'], col),
    svg(fig, 'Graf jarak-masa perjalanan Aina ke kedai dan pulang'))

# 7.1-4 Contoh berlangkah: mentafsir
pts = [(0, 0), (2, 150), (3, 150), (5, 270)]
v1, v3 = speed(pts[0], pts[1]), speed(pts[2], pts[3]); avg = F(270, 5)
assert v1 == 75 and v3 == 60 and avg == 54
g = Graph(5.5, 300, [0, 1, 2, 3, 4, 5], [0, 50, 100, 150, 200, 250, 300], 'Masa (jam)', 'Jarak (km)')
fig = (g.draw() + g.guide(2, 150) + g.guide(5, 270) + g.path(pts, AM, 5) + g.dots(pts, AM)
       + g.lab(0, 0, 'O', MU3, 14, -14, 'start', 17) + g.lab(2, 150, 'P', AM, -6, -20, 'end')
       + g.lab(3, 150, 'Q', AM, 6, 22, 'start') + g.lab(5, 270, 'R', AM, -12, -14, 'end')
       + g.lab(2.5, 150, '1 jam', PK, 0, 24, 'middle', 16))
add('7.1', 'CONTOH BERLANGKAH', 'Mentafsir graf jarak-masa',
    P('Graf menunjukkan perjalanan sebuah bas. Cari (a) laju bas dalam 2 jam pertama, (b) tempoh bas berhenti, (c) laju purata bas bagi seluruh perjalanan.', True)
    + STEPS([f'(a) Laju = {FR("150 km", "2 jam")} = 75 km/j',
             '(b) PQ mengufuk: bas pegun dari jam ke-2 hingga ke-3, iaitu <b>1 jam</b>.',
             f'(c) Laju purata = {FR("jumlah jarak", "jumlah masa")} = {FR("270 km", "5 jam")} = 54 km/j'], col)
    + ANS('(a) 75 km/j &nbsp;(b) 1 jam &nbsp;(c) 54 km/j')
    + NOTE('Jumlah masa <b>termasuk</b> masa berhenti.'),
    svg(fig, 'Graf jarak-masa sebuah bas: O ke P, berhenti P ke Q, Q ke R'))

# 7.1-5 Pergi-balik dan laju purata
pts = [(0, 0), (30, 12), (45, 12), (75, 0)]
v_go = speed(pts[0], pts[1]); v_back = -speed(pts[2], pts[3])
tot = 24; avg_min = F(tot, 75); avg_j = avg_min * 60
assert v_go == F(2, 5) and v_back == F(2, 5) and v_go * 60 == 24 and avg_j == F(96, 5) and float(avg_j) == 19.2
g = Graph(80, 15, [0, 15, 30, 45, 60, 75], [0, 3, 6, 9, 12, 15], 'Masa (minit)', 'Jarak dari rumah (km)')
fig = (g.draw() + g.guide(30, 12) + g.seg(pts[0], pts[1], TR) + g.seg(pts[1], pts[2], AM) + g.seg(pts[2], pts[3], PK) + g.dots(pts)
       + g.lab(15, 6, 'pergi 12 km', TR, 14, 0, 'start', 17)
       + g.lab(62, 6, 'balik 12 km', PK, 10, -12, 'start', 17)
       + g.lab(37.5, 12, 'singgah', AM, 0, -20, 'middle', 17))
add('7.1', 'CONTOH BERLANGKAH', 'Laju purata perjalanan pergi-balik',
    P('Encik Lim memandu ke pasar, singgah, lalu pulang ke rumah. Hitung laju purata seluruh perjalanan dalam km/j.', True)
    + STEPS(['Jumlah jarak = 12 km + 12 km = <b>24 km</b> (pergi dan balik)',
             'Jumlah masa = 75 minit = 1.25 jam',
             f'Laju purata = {FR("24 km", "1.25 jam")} = 19.2 km/j'], col)
    + ANS('Laju purata = 19.2 km/j')
    + NOTE('Graf kembali ke paksi masa, tetapi jarak yang dilalui <b>bukan</b> 0. Kira jarak pergi <b>dan</b> balik.'),
    svg(fig, 'Graf jarak-masa pergi 12 km, singgah, dan balik 12 km dalam 75 minit'))

# 7.1-6 Kesilapan biasa
assert F(24 + 24, 2) == 24 and avg_j != 24
fig = ''
CASES = [(52, 'Garis mengufuk = laju seragam', False), (128, 'Garis mengufuk = pegun (laju 0)', True),
         (222, 'Garis turun = laju negatif', False), (298, 'Garis turun = bergerak kembali', True),
         (392, 'Laju purata = (24 + 24) ÷ 2 = 24', False)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 450, '✓ Laju purata = 24 km ÷ 1.25 jam = 19.2 km/j', GR, 18, halo=False)
add('7.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Garis mengufuk = laju seragam", RD)} ✗ → jarak tidak berubah, jadi objek <b>pegun</b>.',
         f'{B("Laju negatif", RD)} ✗ → kecerunan negatif bermaksud objek bergerak <b>kembali</b>; laju ialah nilainya tanpa tanda.',
         f'{B("Purata bagi laju-laju", RD)} ✗ → laju purata = jumlah jarak ÷ jumlah masa (termasuk masa pegun).',
         f'{B("Unit bercampur", RD)} ✗ → tukar minit kepada jam (÷ 60) jika laju dalam km/j.'], col),
    svg(fig, 'Contoh kenyataan salah dan betul tentang graf jarak-masa'))

# 7.1-7 Ringkasan
fig = ''
MINI = [('Naik', TR, [(0, 0), (4, 3)], 'bergerak, laju = kecerunan'),
        ('Mengufuk', AM, [(0, 1.8), (4, 1.8)], 'pegun, laju = 0'),
        ('Turun', PK, [(0, 3), (4, 0)], 'bergerak kembali ke titik mula')]
for i, (nm, cl, pp, d) in enumerate(MINI):
    y0 = 16 + i * 148
    fig += RECT(14, y0, 472, 136, SURF, BD, 16, 2)
    gg = Graph(4, 3, [], [], '', '', (46, y0 + 26, 150, y0 + 112))
    fig += LINE((46, y0 + 112), (160, y0 + 112), MU2, 2.5) + LINE((46, y0 + 112), (46, y0 + 18), MU2, 2.5)
    fig += gg.path(pp, cl, 6)
    fig += T(178, y0 + 50, nm, cl, 23, 'start') + T(178, y0 + 88, d, MU3, 18, 'start', halo=False)
add('7.1', 'RINGKASAN', 'Ringkasan graf jarak-masa',
    TABLE(['Perkara', 'Cara'],
          [['Laju', f'kecerunan = {LAJU}'],
           ['Tempoh pegun', 'panjang garis mengufuk'],
           ['Laju purata', FR('jumlah jarak', 'jumlah masa')]], col, rv=True)
    + BUL(['Pastikan unit jarak dan masa sepadan sebelum mengira.',
           'Jumlah jarak termasuk perjalanan pergi dan balik.'], col),
    svg(fig, 'Ringkasan tiga bentuk garis dalam graf jarak-masa'))

# ===================== 7.2 GRAF LAJU-MASA =====================
col = SUB['7.2'][1]

# 7.2-1 Definisi
pts = [(0, 0), (4, 20), (10, 20), (14, 0)]
g = Graph(15, 25, [0, 2, 4, 6, 8, 10, 12, 14], [0, 5, 10, 15, 20, 25], 'Masa (s)', 'Laju (m/s)')
fig = (g.draw() + g.seg(pts[0], pts[1], GR) + g.seg(pts[1], pts[2], AM) + g.seg(pts[2], pts[3], RD) + g.dots(pts)
       + g.lab(2, 10, 'laju', GR, -8, -24, 'end', 17) + g.lab(2, 10, 'bertambah', GR, -8, -4, 'end', 17)
       + g.lab(7, 20, 'laju seragam', AM, 0, -20, 'middle', 17)
       + g.lab(12, 10, 'laju', RD, 10, -24, 'start', 17) + g.lab(12, 10, 'berkurang', RD, 10, -4, 'start', 17))
add('7.2', 'DEFINISI', 'Apa itu graf laju-masa?',
    DEF('<b>Graf laju-masa</b> menunjukkan perubahan <b>laju</b> sesuatu objek mengikut <b>masa</b>.', col)
    + BUL([f'Paksi mengufuk: {B("masa", PK)} &nbsp;·&nbsp; Paksi mencancang: {B("laju", TR)}.',
           f'{B("Naik", GR)}: laju bertambah (memecut).',
           f'{B("Mengufuk", AM)}: laju seragam (laju tidak berubah).',
           f'{B("Turun", RD)}: laju berkurang (nyahpecutan).'], col)
    + NOTE('Dalam graf laju-masa, garis mengufuk <b>bukan</b> pegun. Objek pegun apabila laju = 0 (garis pada paksi masa).'),
    svg(fig, 'Graf laju-masa: laju bertambah, laju seragam dan laju berkurang'))

# 7.2-2 Kecerunan = pecutan
a1, a3 = speed(pts[0], pts[1]), speed(pts[2], pts[3])
assert a1 == 5 and a3 == -5 and speed(pts[1], pts[2]) == 0
fig = (g.draw() + POLY([g.p(0, 0), g.p(4, 0), g.p(4, 20)], f'{GR}22') + POLY([g.p(10, 20), g.p(10, 0), g.p(14, 0)], f'{RD}22')
       + LINE(g.p(4, 0), g.p(4, 20), MU2, 2.5, '6 6') + LINE(g.p(10, 0), g.p(10, 20), MU2, 2.5, '6 6')
       + g.seg(pts[0], pts[1], GR) + g.seg(pts[1], pts[2], AM) + g.seg(pts[2], pts[3], RD) + g.dots(pts)
       + g.lab(2.75, 5, '+5 m/s²', GR, 0, 0, 'middle', 18)
       + g.lab(7, 20, '0 m/s²', AM, 0, -20, 'middle', 18)
       + g.lab(11.25, 5, '−5 m/s²', RD, 0, 0, 'middle', 18))
add('7.2', 'KONSEP', 'Kecerunan graf = pecutan',
    DEF(f'Pecutan = {PECUT} = <b>kecerunan</b> graf laju-masa', col)
    + TABLE(['Kecerunan', 'Maksud', 'Contoh'],
            [[B('Positif', GR), 'pecutan', f'{FR("20 − 0", "4")} = 5 m/s²'],
             [B('Sifar', AM), 'laju seragam', '0 m/s²'],
             [B('Negatif', RD), 'nyahpecutan', f'{FR("0 − 20", "4")} = −5 m/s²']], col, rv=True)
    + NOTE('Pecutan −5 m/s² disebut <b>nyahpecutan 5 m/s²</b>. Unit pecutan: m/s² (laju ÷ masa).'),
    svg(fig, 'Graf laju-masa dengan pecutan 5, 0 dan −5 meter sesaat per saat'))

# 7.2-3 Jarak = luas
A1, A2, A3 = F(1, 2) * 4 * 20, 6 * 20, F(1, 2) * 4 * 20
assert (A1, A2, A3) == (40, 120, 40) and area_under(pts) == 200 and F(1, 2) * (6 + 14) * 20 == 200
fig = (g.draw() + POLY([g.p(0, 0), g.p(4, 20), g.p(4, 0)], f'{GR}40') + POLY([g.p(4, 0), g.p(4, 20), g.p(10, 20), g.p(10, 0)], f'{AM}40')
       + POLY([g.p(10, 0), g.p(10, 20), g.p(14, 0)], f'{RD}40')
       + g.path(pts, TX, 4) + LINE(g.p(4, 0), g.p(4, 20), TX, 2, '5 5') + LINE(g.p(10, 0), g.p(10, 20), TX, 2, '5 5')
       + g.lab(2.9, 6, '40', GR, 0, 0, 'middle', 22) + g.lab(7, 10, '120', AM, 0, 0, 'middle', 24)
       + g.lab(11.1, 6, '40', RD, 0, 0, 'middle', 22)
       + T(250, 452, 'Jarak = 40 + 120 + 40 = 200 m', MU3, 19, halo=False))
add('7.2', 'RUMUS', 'Jarak = luas di bawah graf',
    DEF('<b>Jarak</b> yang dilalui = <b>luas di bawah graf</b> laju-masa.', col)
    + STEPS([f'Segi tiga: {FR(1, 2)} × 4 × 20 = 40 m',
             'Segi empat tepat: 6 × 20 = 120 m',
             f'Segi tiga: {FR(1, 2)} × 4 × 20 = 40 m',
             'Jumlah jarak = 40 + 120 + 40 = 200 m'], col)
    + NOTE(f'Seluruh kawasan ialah trapezium: {FR(1, 2)} × (6 + 14) × 20 = 200 m. Luas trapezium = {FR(1, 2)} × (hasil tambah sisi selari) × tinggi.', 'Cara pantas:'),
    svg(fig, 'Luas di bawah graf laju-masa dibahagi kepada segi tiga, segi empat tepat dan segi tiga'))

# 7.2-4 Contoh berlangkah
pts = [(0, 10), (4, 30), (14, 30), (20, 0)]
acc = speed(pts[0], pts[1]); dec = -speed(pts[2], pts[3])
D1 = F(1, 2) * (10 + 30) * 4; D2 = 10 * 30; D3 = F(1, 2) * 6 * 30; Dt = D1 + D2 + D3
assert acc == 5 and dec == 5 and (D1, D2, D3, Dt) == (80, 300, 90, 470) and area_under(pts) == 470 and F(Dt, 20) == F(47, 2)
g = Graph(21, 35, [0, 4, 14, 20], [0, 10, 20, 30], 'Masa (s)', 'Laju (m/s)')
fig = (g.draw() + POLY([g.p(0, 0), g.p(0, 10), g.p(4, 30), g.p(4, 0)], f'{GR}33') + POLY([g.p(4, 0), g.p(4, 30), g.p(14, 30), g.p(14, 0)], f'{AM}33')
       + POLY([g.p(14, 0), g.p(14, 30), g.p(20, 0)], f'{RD}33') + g.path(pts, TX, 4.5) + g.dots(pts, TX)
       + LINE(g.p(4, 0), g.p(4, 30), MU2, 2, '5 5') + LINE(g.p(14, 0), g.p(14, 30), MU2, 2, '5 5')
       + g.lab(2, 9, '80', GR, 0, 0, 'middle', 21) + g.lab(9, 15, '300', AM, 0, 0, 'middle', 23) + g.lab(15.8, 9, '90', RD, 0, 0, 'middle', 21))
add('7.2', 'CONTOH BERLANGKAH', 'Pecutan, jarak dan laju purata',
    P('Graf laju-masa sebuah motosikal. Cari (a) pecutan dalam 4 s pertama, (b) nyahpecutan dalam 6 s terakhir, (c) jumlah jarak, (d) laju purata.', True)
    + STEPS([f'(a) {FR("30 − 10", "4 − 0")} = 5 m/s² &nbsp;(b) {FR("0 − 30", "20 − 14")} = −5 → nyahpecutan 5 m/s²',
             f'(c) {FR(1, 2)}(10 + 30)(4) + 10 × 30 + {FR(1, 2)}(6)(30) = 80 + 300 + 90 = 470 m',
             f'(d) Laju purata = {FR("470 m", "20 s")} = 23.5 m/s'], col)
    + ANS('(a) 5 m/s² (b) 5 m/s² (c) 470 m (d) 23.5 m/s'),
    svg(fig, 'Graf laju-masa motosikal dari 10 m/s ke 30 m/s, seragam, kemudian berhenti pada saat ke-20'))

# 7.2-5 Cari nilai tidak diketahui
v = F(280, F(1, 2) * (8 + 20))
assert v == 20 and F(1, 2) * (8 + 20) * v == 280 and speed((0, 0), (6, v)) == F(10, 3)
g = Graph(21, 25, [0, 6, 14, 20], [0], 'Masa (s)', 'Laju (m/s)')
fig = (g.draw() + POLY([g.p(0, 0), g.p(6, 20), g.p(14, 20), g.p(20, 0)], f'{PA}2E')
       + g.path([(0, 0), (6, 20), (14, 20), (20, 0)], AM, 5) + g.dots([(6, 20), (14, 20)], AM)
       + LINE(g.p(0, 20), g.p(6, 20), PK, 2.5, '6 6') + T(g.L - 10, g.Y(20), 'v', PK, 21, 'end', italic=True)
       + LINE(g.p(6, 0), g.p(6, 20), MU2, 2, '5 5') + LINE(g.p(14, 0), g.p(14, 20), MU2, 2, '5 5')
       + g.lab(10, 9, 'jarak = 280 m', TX, 0, 0, 'middle', 20)
       + LINE((g.X(6), g.Y(20) - 26), (g.X(14), g.Y(20) - 26), TR, 2.5) + g.lab(10, 20, '8 s', TR, 0, -42, 'middle', 17))
add('7.2', 'CONTOH BERLANGKAH', 'Mencari laju yang tidak diketahui',
    P('Sebuah kereta bergerak sejauh 280 m dalam 20 s seperti graf. Cari nilai <i>v</i>.', True)
    + STEPS(['Kawasan di bawah graf ialah trapezium: sisi selari 8 s dan 20 s, tinggi <i>v</i>.',
             f'{FR(1, 2)} × (8 + 20) × <i>v</i> = 280',
             '14<i>v</i> = 280 → <i>v</i> = 20'], col)
    + ANS('<i>v</i> = 20 m/s')
    + NOTE('Bentuk persamaan: <b>luas di bawah graf = jarak</b> yang diberi, kemudian selesaikan.', 'Strategi:'),
    svg(fig, 'Graf laju-masa berbentuk trapezium dengan laju v dan jarak 280 m'))

# 7.2-6 Kesilapan biasa: banding dua jenis graf
fig = ''
for i, (ttl, ylab, cl, desc) in enumerate([('Graf jarak-masa', 'jarak', TR, 'PEGUN'), ('Graf laju-masa', 'laju', PA, 'LAJU SERAGAM')]):
    x0 = 14 + i * 240
    fig += RECT(x0, 14, 232, 250, SURF, BD, 16, 2)
    fig += T(x0 + 116, 42, ttl, cl, 19)
    fig += LINE((x0 + 36, 220), (x0 + 210, 220), MU2, 2.5) + LINE((x0 + 36, 220), (x0 + 36, 70), MU2, 2.5)
    fig += T(x0 + 42, 78, ylab, MU3, 15, 'start', halo=False) + T(x0 + 208, 238, 'masa', MU3, 15, 'end', halo=False)
    fig += LINE((x0 + 40, 140), (x0 + 200, 140), AM, 6)
    fig += T(x0 + 120, 172, 'mengufuk =', AM, 15) + T(x0 + 120, 196, desc, AM, 16)
ROWS = [(304, 'Luas di bawah graf jarak-masa = jarak', False), (360, 'Luas di bawah graf laju-masa = jarak', True),
        (416, 'Nyahpecutan 5 m/s² = pecutan −5 m/s²', True)]
for y, t, ok in ROWS:
    fig += RECT(14, y - 24, 472, 48, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 17, 'start')
add('7.2', 'KESILAPAN BIASA', 'Jangan tertukar jenis graf',
    TABLE(['', 'Jarak-masa', 'Laju-masa'],
          [['Kecerunan', 'laju', 'pecutan'],
           ['Garis mengufuk', 'pegun', 'laju seragam'],
           ['Luas di bawah graf', '(tiada makna)', 'jarak']], col)
    + BUL([f'{B("Baca label paksi mencancang dahulu", RD)}: jarak atau laju?',
           f'{B("Unit", RD)}: laju dalam m/s dan masa dalam s memberi jarak dalam m.'], col),
    svg(fig, 'Perbandingan garis mengufuk dalam graf jarak-masa dan graf laju-masa'))

# 7.2-7 Ringkasan bab
fig = ''
SUMM = [('Kecerunan graf jarak-masa', 'laju', TR), ('Kecerunan graf laju-masa', 'pecutan', PA),
        ('Luas di bawah graf laju-masa', 'jarak', GR), ('Jumlah jarak ÷ jumlah masa', 'laju purata', AM)]
for i, (a, b, cl) in enumerate(SUMM):
    y0 = 16 + i * 110
    fig += RECT(14, y0, 472, 98, SURF, BD, 16, 2)
    fig += T(36, y0 + 34, a, MU3, 19, 'start', halo=False)
    fig += T(36, y0 + 70, '= ' + b, cl, 25, 'start')
add('7.2', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus'],
          [['Laju', f'{LAJU}'],
           ['Pecutan', f'{PECUT}'],
           ['Jarak', 'luas di bawah graf laju-masa'],
           ['Laju purata', FR('jumlah jarak', 'jumlah masa')]], col, rv=True)
    + BUL(['Pecutan negatif = nyahpecutan.',
           'Pecahkan luas kepada segi tiga, segi empat tepat dan trapezium.'], col),
    svg(fig, 'Ringkasan maksud kecerunan dan luas bagi graf gerakan'))

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
assert counts == {'7.1': 7, '7.2': 7}, counts

js = ('/* Dijana oleh tools/grafgerakan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
