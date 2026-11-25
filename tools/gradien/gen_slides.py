# Penjana slaid NOTA GRADIEN (Tingkatan 2 Bab 10 Kecerunan Garis Lurus) -> gradien/slides.js
# Jalankan:  python3 tools/gradien/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fxsvg import fx_svg, has_fx, fx_html   # pecahan bertingkat & punca (25 Nov)
import mathfmt
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'gradien', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 10.1, jadi subtopik app = Standard Pembelajaran 10.1.1 - 10.1.3
SUB = {
    '10.1.1': ('Kecerunan & Jarak', C['am']),
    '10.1.2': ('Rumus Dua Titik', C['tr']),
    '10.1.3': ('Arah & Pintasan', C['gr']),
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
    """Pecahan bertingkat dalam teks slaid (gaya .fr dalam teras.css)."""
    return mathfmt.FR(a, b)
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
    if has_fx(t):
        return fx_svg(x, y, t, col, size, anchor, f' {FONT} font-weight="{weight}"{it}{ha}')
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

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 10.1.1 KECERUNAN & JARAK =====================
col = SUB['10.1.1'][1]

# 10.1.1-1 Definisi
A_, B_, C_ = (60, 350), (330, 350), (330, 140)
fig = (POLY([A_, B_, C_], f'{AM}1A') + LINE(A_, C_, AM, 7) + LINE(A_, B_, HC, 5) + LINE(B_, C_, VC, 5)
       + right_angle(B_, (-1, 0), (0, -1), TX, 16)
       + ARROW((352, 336), (352, 154), VC, 3, 10)
       + T(370, 232, 'jarak', VC, 20, 'start') + T(370, 258, 'mencancang', VC, 20, 'start')
       + ARROW((74, 378), (316, 378), HC, 3, 10)
       + T(195, 404, 'jarak mengufuk', HC, 20)
       + T(150, 236, 'garis lurus', AM, 20)
       + T(250, 448, 'Kecerunan = mencancang ÷ mengufuk', MU3, 19, halo=False)
       + T(250, 60, 'Mencancang: tegak ↕ · Mengufuk: melintang ↔', MU, 17, halo=False))
add('10.1.1', 'DEFINISI', 'Apa itu kecerunan?',
    DEF('<b>Kecerunan</b> ialah ukuran <b>kecuraman</b> sesuatu garis lurus, iaitu nisbah jarak mencancang kepada jarak mengufuk.', col)
    + P(f'Kecerunan = {MV}')
    + BUL([f'{B("Jarak mencancang", VC)}: jarak tegak (naik atau turun).',
           f'{B("Jarak mengufuk", HC)}: jarak melintang (kiri ke kanan).'], col)
    + NOTE('Kecerunan ialah <b>nisbah</b>, jadi ia tiada unit. Tulis jawapan dalam bentuk termudah.'),
    svg(fig, 'Segi tiga bersudut tegak menunjukkan jarak mencancang, jarak mengufuk dan garis lurus'))

# 10.1.1-2 Situasi harian
HARIAN = [('Tanjakan OKU', 1, 12, 'm'), ('Anak tangga', 18, 24, 'cm'), ('Bumbung rumah', 2, 5, 'm'), ('Jalan bukit', 50, 1000, 'm')]
rows = []
for nm, v, h, u in HARIAN:
    k = F(v, h)
    rows.append([nm, f'{v} {u} ÷ {h:,} {u}'.replace(',', ' '), f'<b>{FRV(k)}</b>'])
assert [F(v, h) for _, v, h, _ in HARIAN] == [F(1, 12), F(3, 4), F(2, 5), F(1, 20)]
fig = ''
# panel tanjakan
fig += RECT(14, 14, 472, 178)
fig += POLY([(60, 160), (420, 160), (420, 80)], f'{AM}26', AM, 4)
fig += LINE((60, 160), (420, 160), HC, 5) + LINE((420, 160), (420, 80), VC, 5) + right_angle((420, 160), (-1, 0), (0, -1), TX, 12)
fig += T(240, 176, '12 m', HC, 17) + T(438, 120, '1 m', VC, 17, 'start') + T(120, 52, 'Tanjakan OKU', TX, 20, 'start')
# panel anak tangga
fig += RECT(14, 206, 230, 250)
st = [(40, 400)]
for i in range(4):
    x, y = st[-1]; st.append((x, y - 36)); st.append((x + 48, y - 36))
fig += f'<path d="M{" L".join(f"{x} {y}" for x, y in st)} L232 400 Z" fill="{DIM}"/>'
fig += f'<path d="M{" L".join(f"{x} {y}" for x, y in st)}" fill="none" stroke="{MU3}" stroke-width="4" stroke-linejoin="round"/>'
fig += LINE((40, 364), (88, 364), HC, 5) + LINE((88, 364), (88, 328), VC, 5)
fig += T(64, 384, '24 cm', HC, 15) + T(98, 350, '18 cm', VC, 15, 'start')
fig += LINE((40, 364), (208, 238), AM, 3, '7 6')
fig += T(129, 432, 'Anak tangga', TX, 19)
# panel bumbung
fig += RECT(256, 206, 230, 250)
fig += POLY([(276, 330), (371, 292), (466, 330)], f'{PA}40', PA, 4)
fig += RECT(296, 330, 150, 80, f'{DIM}', MU2, 4, 2)
fig += LINE((371, 292), (371, 330), VC, 4, '6 5') + LINE((371, 330), (466, 330), HC, 4)
fig += T(362, 312, '2 m', VC, 15, 'end') + T(418, 346, '5 m', HC, 15)
fig += T(371, 432, 'Bumbung rumah', TX, 19)
add('10.1.1', 'SITUASI HARIAN', 'Kecerunan di sekeliling kita',
    P('Kecerunan digunakan untuk membina tanjakan, tangga, bumbung dan jalan raya.')
    + TABLE(['Situasi', 'Mencancang ÷ mengufuk', 'Kecerunan'], rows, col)
    + NOTE('Tanjakan OKU mesti <b>landai</b> (kecerunan kecil) supaya kerusi roda mudah naik.'),
    svg(fig, 'Contoh kecerunan: tanjakan OKU, anak tangga dan bumbung rumah'))

# 10.1.1-3 Contoh: tangga 5 m (3-4-5)
assert 3 ** 2 + 4 ** 2 == 5 ** 2
k = F(4, 3)
sc = 62
G0 = (110, 400)                    # kaki tangga di lantai
WX = G0[0] + 3 * sc                # dinding
top = (WX, G0[1] - 4 * sc)
fig = (RECT(WX, 50, 40, 350, f'{DIM}', MU2, 0, 2) + LINE((40, 400), (470, 400), MU2, 4)
       + POLY([G0, (WX, 400), top], f'{AM}1A')
       + LINE(G0, (WX, 400), HC, 5) + LINE((WX - 1, 400), top, VC, 5)
       + right_angle((WX, 400), (-1, 0), (0, -1), TX, 14))
# tangga: dua rel + anak tangga
ux, uy = (top[0] - G0[0]) / 5, (top[1] - G0[1]) / 5
L = math.hypot(ux, uy); nx, ny = -uy / L * 9, ux / L * 9
fig += LINE((G0[0] + nx, G0[1] + ny), (top[0] + nx, top[1] + ny), AM, 5) + LINE((G0[0] - nx, G0[1] - ny), (top[0] - nx, top[1] - ny), AM, 5)
for i in range(1, 10):
    c = (G0[0] + ux * i / 2, G0[1] + uy * i / 2)
    fig += LINE((c[0] + nx, c[1] + ny), (c[0] - nx, c[1] - ny), AM, 3)
fig += (T(G0[0] + 1.5 * sc, 424, '3 m', HC, 20) + T(WX + 52, G0[1] - 2 * sc, '4 m', VC, 20, 'start')
        + T(G0[0] + 1.5 * sc - 50, G0[1] - 2 * sc - 20, '5 m', AM, 20)
        + T(WX + 62, 30, 'dinding', MU, 17, halo=False))
add('10.1.1', 'CONTOH BERLANGKAH', 'Kecerunan sebatang tangga',
    P('Tangga sepanjang 5 m disandarkan pada dinding. Kaki tangga berada 3 m dari dinding dan hujung atasnya 4 m dari lantai. Cari kecerunan tangga itu.', True)
    + STEPS([f'Jarak mencancang = {B("4 m", VC)} (tinggi hujung tangga dari lantai)',
             f'Jarak mengufuk = {B("3 m", HC)} (bukan 5 m: itu panjang tangga)',
             f'Kecerunan = {MV} = {FRV(k)}'], col)
    + ANS(f'Kecerunan tangga = {FRV(k)}'),
    svg(fig, 'Tangga 5 m disandarkan pada dinding, tinggi 4 m dan 3 m dari dinding'))

# 10.1.1-4 Kecuraman
kA, kB = F(3, 4), F(2, 5)
assert kA > kB and float(kA) == 0.75 and float(kB) == 0.4
O_ = (60, 400); sc = 72
endA = (O_[0] + 5 * sc, O_[1] - float(kA) * 5 * sc)
endB = (O_[0] + 5 * sc, O_[1] - float(kB) * 5 * sc)
fig = (LINE((40, 400), (470, 400), MU2, 3)
       + POLY([O_, (endA[0], 400), endA], f'{RD}14') + POLY([O_, (endB[0], 400), endB], f'{GR}1A')
       + LINE(O_, endA, RD, 6) + LINE(O_, endB, GR, 6)
       + LINE((endA[0], 400), endA, DIM, 2.5, '6 6')
       + T(endA[0] - 12, endA[1] - 4, 'Cerun A', RD, 20, 'end') + T(endA[0] + 12, endA[1], '0.75', RD, 19, 'start')
       + T(endB[0] - 12, endB[1] + 30, 'Cerun B', GR, 20, 'end') + T(endB[0] + 12, endB[1], '0.4', GR, 19, 'start')
       + T(250, 448, 'Nilai kecerunan besar → garis lebih curam', MU3, 18, halo=False)
       + T(250, 60, 'Mengufuk sama, A naik lebih tinggi', MU, 17, halo=False))
add('10.1.1', 'KONSEP', 'Membandingkan kecuraman',
    BUL(['Semakin <b>besar</b> nilai kecerunan, semakin <b>curam</b> garis itu.',
         'Kecerunan kecil bermaksud garis itu <b>landai</b>. Garis mengufuk mempunyai kecerunan <b>0</b>.'], col)
    + P(f'Cerun A naik 3 m sejauh 4 m mengufuk. Cerun B naik 2 m sejauh 5 m mengufuk. Cerun manakah lebih curam?', True)
    + STEPS([f'Cerun A: {FR(3, 4)} = 0.75 &nbsp;·&nbsp; Cerun B: {FR(2, 5)} = 0.4',
             '0.75 &gt; 0.4'], col)
    + ANS('Cerun A lebih curam'),
    svg(fig, 'Dua cerun: A dengan kecerunan 0.75 lebih curam daripada B dengan kecerunan 0.4'))

# 10.1.1-5 Kesilapan biasa
assert F(4, 6) == F(2, 3) and round(math.hypot(4, 6), 1) == 7.2
A_, B_, C_ = (80, 250), (380, 250), (380, 50)
fig = (POLY([A_, B_, C_], f'{AM}1A') + LINE(A_, C_, AM, 6) + LINE(A_, B_, HC, 5) + LINE(B_, C_, VC, 5)
       + right_angle(B_, (-1, 0), (0, -1), TX, 14)
       + T(230, 274, '6 m', HC, 20) + T(398, 150, '4 m', VC, 20, 'start') + T(200, 128, '7.2 m', AM, 20))
rowsY = [(330, True, '4 ÷ 6 = ', '2/3', 'betul'), (378, False, '6 ÷ 4', '', 'terbalik'), (426, False, '4 ÷ 7.2', '', 'guna panjang cerun')]
for y, ok, a, b, why in rowsY:
    fig += RECT(40, y - 21, 420, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(66, y) if ok else CROSS(66, y))
    fig += T(92, y, a + b, GR if ok else RD, 20, 'start') + T(440, y, why, MU, 16, 'end')
add('10.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Menterbalikkan nisbah", RD)}: mengufuk ÷ mencancang ✗',
         f'{B("Guna panjang cerun", RD)} (garis condong 7.2 m) sebagai jarak mengufuk ✗',
         f'{B("Tidak permudahkan", RD)}: {FR(4, 6)} mesti ditulis {FR(2, 3)}'], col)
    + NOTE(f'Kecerunan = {MV}. Jarak mengufuk ialah tapak segi tiga, <b>bukan</b> sisi condong.', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi cerun 4 m mencancang dan 6 m mengufuk'))

# ===================== 10.1.2 RUMUS DUA TITIK =====================
col = SUB['10.1.2'][1]

# 10.1.2-1 Rumus
Pp, Qp = (-2, -1), (4, 3)
m = slope(Pp, Qp); assert m == F(2, 3)
pl = Plane(-4, 6, -3, 5)
fig = (pl.draw() + pl.line(Pp, Qp, AM, 4)
       + pl.rise_run(Pp, Qp, 'y₂ − y₁ = 4', 'x₂ − x₁ = 6', 1, 1, 17)
       + pl.pt(*Pp, 'P(−2, −1)', AM, -8, -22, 'end') + pl.pt(*Qp, 'Q(4, 3)', AM, -10, -22, 'end'))
add('10.1.2', 'RUMUS', 'Kecerunan melalui dua titik',
    DEF(f'Bagi garis lurus yang melalui P(<i>x</i>₁, <i>y</i>₁) dan Q(<i>x</i>₂, <i>y</i>₂):<br>Kecerunan, <i>m</i> = {MF}', col)
    + BUL([f'<i>y</i>₂ − <i>y</i>₁ ialah {B("jarak mencancang", VC)}.',
           f'<i>x</i>₂ − <i>x</i>₁ ialah {B("jarak mengufuk", HC)}.'], col)
    + STEPS([f'<i>m</i> = {FR("3 − (−1)", "4 − (−2)")} = {FR(4, 6)} = {FRV(m)}'], col)
    + NOTE('Huruf <i>m</i> ialah simbol bagi kecerunan.'),
    svg(fig, 'Garis melalui P(−2, −1) dan Q(4, 3) dengan jarak mencancang 4 dan jarak mengufuk 6'))

# 10.1.2-2 Contoh positif
Ap, Bp = (1, 2), (3, 8)
m = slope(Ap, Bp); assert m == 3
pl = Plane(-1, 5, -1, 9, (40, 22, 470, 448))
fig = (pl.draw() + pl.line(Ap, Bp, AM, 4)
       + pl.rise_run(Ap, Bp, '6', '2', 1, 1)
       + pl.pt(*Ap, 'A(1, 2)', AM, -12, -8, 'end') + pl.pt(*Bp, 'B(3, 8)', AM, -12, -8, 'end'))
add('10.1.2', 'CONTOH BERLANGKAH', 'Mengira kecerunan (1)',
    P('Cari kecerunan garis lurus yang melalui A(1, 2) dan B(3, 8).')
    + STEPS(['Tetapkan (<i>x</i>₁, <i>y</i>₁) = (1, 2) dan (<i>x</i>₂, <i>y</i>₂) = (3, 8).',
             f'<i>m</i> = {FR("8 − 2", "3 − 1")}',
             f'= {FR(6, 2)} = 3'], col)
    + ANS('<i>m</i> = 3')
    + NOTE('Semak dengan rajah: naik 6 unit apabila bergerak 2 unit ke kanan.'),
    svg(fig, 'Garis melalui A(1, 2) dan B(3, 8)'))

# 10.1.2-3 Contoh negatif
Cp, Dp = (-3, 4), (3, -2)
m = slope(Cp, Dp); assert m == -1
pl = Plane(-4, 4, -3, 5)
cc = (Dp[0], Cp[1])
fig = (pl.draw() + pl.line(Cp, Dp, AM, 4)
       + POLY([pl.p(*Cp), pl.p(*cc), pl.p(*Dp)], f'{AM}1A')
       + LINE(pl.p(*Cp), pl.p(*cc), HC, 5) + LINE(pl.p(*cc), pl.p(*Dp), VC, 5)
       + right_angle(pl.p(*cc), (-1, 0), (0, 1), TX, 13)
       + T(pl.X(0) + 30, pl.Y(4) - 18, 'mengufuk 6', HC, 17) + T(pl.X(3) + 12, pl.Y(1), 'turun 6', VC, 17, 'start')
       + pl.pt(*Cp, 'C(−3, 4)', AM, 0, -22) + pl.pt(*Dp, 'D(3, −2)', AM, -12, 4, 'end'))
add('10.1.2', 'CONTOH BERLANGKAH', 'Mengira kecerunan (2)',
    P('Cari kecerunan garis lurus yang melalui C(−3, 4) dan D(3, −2).')
    + STEPS([f'<i>m</i> = {FR("−2 − 4", "3 − (−3)")}',
             f'= {FR("−6", 6)} = −1'], col)
    + ANS('<i>m</i> = −1')
    + NOTE('Tolak nombor negatif: 3 − (−3) = 3 + 3 = 6. Gunakan <b>kurungan</b> supaya tanda tidak tertinggal.'),
    svg(fig, 'Garis melalui C(−3, 4) dan D(3, −2) turun 6 unit sejauh 6 unit mengufuk'))

# 10.1.2-4 Tertib titik tidak mengubah jawapan
Rp, Sp = (-1, -2), (3, 4)
m = slope(Rp, Sp); assert m == slope(Sp, Rp) == F(3, 2)
pl = Plane(-3, 5, -3, 5)
fig = pl.draw() + pl.line(Rp, Sp, AM, 4) + pl.rise_run(Rp, Sp, '6 petak', '4 petak', 1, 1, 17)
fig += pl.pt(*Rp, 'R(−1, −2)', AM, -10, 0, 'end') + pl.pt(*Sp, 'S(3, 4)', AM, -10, -14, 'end')
add('10.1.2', 'KONSEP', 'Tertib titik dan kiraan petak',
    P('Garis melalui R(−1, −2) dan S(3, 4). Titik mana yang dipilih dahulu tidak mengubah jawapan.', True)
    + TABLE(['Tertib', 'Kiraan', '<i>m</i>'],
            [['R dahulu', f'{FR("4 − (−2)", "3 − (−1)")} = {FR(6, 4)}', FRV(m)],
             ['S dahulu', f'{FR("−2 − 4", "−1 − 3")} = {FR("−6", "−4")}', FRV(m)]], col, rv=True)
    + BUL(['Pada grid, kira petak: naik <b>6</b> petak, ke kanan <b>4</b> petak → <i>m</i> = ' + FR(6, 4) + ' = ' + FRV(m) + '.'], col)
    + NOTE('Tertib mesti <b>sama</b> di pengangka dan di penyebut.'),
    svg(fig, 'Garis melalui R(−1, −2) dan S(3, 4): naik 6 petak, ke kanan 4 petak'))

# 10.1.2-5 Kesilapan biasa
Ep, Fp = (2, -3), (5, 6)
m = slope(Ep, Fp); assert m == 3
assert F(6 - 3, 5 - 2) == 1 and F(6 - (-3), 2 - 5) == -3 and F(5 - 2, 6 - (-3)) == F(1, 3)
pl = Plane(-1, 6, -4, 7, (40, 22, 470, 448))
fig = pl.draw() + pl.line(Ep, Fp, AM, 4) + pl.rise_run(Ep, Fp, '9', '3', 1, 1)
fig += pl.pt(*Ep, 'E(2, −3)', AM, -12, 0, 'end') + pl.pt(*Fp, 'F(5, 6)', AM, -12, -8, 'end')
add('10.1.2', 'KESILAPAN BIASA', 'Semak kiraan anda',
    P('Kecerunan garis yang melalui E(2, −3) dan F(5, 6):', True)
    + TABLE(['Kiraan', 'Hasil', ''],
            [[f'{FR("6 − (−3)", "5 − 2")}', f'{B("3", GR)}', f'{B("✓ betul", GR)}'],
             [f'{FR("6 − 3", "5 − 2")}', '1', f'{B("✗ hilang tanda negatif", RD)}'],
             [f'{FR("6 − (−3)", "2 − 5")}', '−3', f'{B("✗ tertib berbeza", RD)}'],
             [f'{FR("5 − 2", "6 − (−3)")}', FR(1, 3), f'{B("✗ tertukar x dengan y", RD)}']], col)
    + NOTE(f'<i>m</i> = {MF}: nilai <i>y</i> di <b>atas</b>, nilai <i>x</i> di <b>bawah</b>, tertib yang sama.', 'Ringkasan:'),
    svg(fig, 'Garis melalui E(2, −3) dan F(5, 6) naik 9 unit sejauh 3 unit mengufuk'))

# ===================== 10.1.3 ARAH & PINTASAN =====================
col = SUB['10.1.3'][1]

# 10.1.3-1 Empat arah
ARAH = [('Positif', 'm > 0', TR, (-1.6, -1.2), (1.6, 1.2), 'naik ke kanan ↗'),
        ('Negatif', 'm < 0', RD, (-1.6, 1.2), (1.6, -1.2), 'turun ke kanan ↘'),
        ('Sifar', 'm = 0', AM, (-1.9, 0.7), (1.9, 0.7), 'mengufuk →'),
        ('Tidak tertakrif', 'tiada nilai m', PK, (0.8, -1.9), (0.8, 1.9), 'mencancang ↕')]
fig = ''
for i, (nm, mv, cl, a, b, d) in enumerate(ARAH):
    x0, y0 = 12 + (i % 2) * 242, 10 + (i // 2) * 228
    fig += RECT(x0, y0, 234, 220, SURF, BD, 16, 2)
    pl = Plane(-2, 2, -2, 2, (x0 + 62, y0 + 44, x0 + 172, y0 + 154))
    fig += LINE(pl.p(-2.3, 0), pl.p(2.3, 0), MU2, 2) + LINE(pl.p(0, -2.3), pl.p(0, 2.3), MU2, 2)
    fig += LINE(pl.p(*a), pl.p(*b), cl, 5)
    fig += T(x0 + 117, y0 + 24, nm, cl, 19) + T(x0 + 117, y0 + 176, mv, TX, 18, italic=False)
    fig += T(x0 + 117, y0 + 202, d, MU, 15, halo=False)
add('10.1.3', 'KONSEP', 'Arah kecondongan garis lurus',
    P('Baca garis dari <b>kiri ke kanan</b>.', True)
    + BUL([f'{B("Positif", TR)} (<i>m</i> &gt; 0): garis naik ke kanan.',
           f'{B("Negatif", RD)} (<i>m</i> &lt; 0): garis turun ke kanan.',
           f'{B("Sifar", AM)} (<i>m</i> = 0): garis mengufuk, selari dengan paksi-<i>x</i>.',
           f'{B("Tidak tertakrif", PK)}: garis mencancang, selari dengan paksi-<i>y</i>.'], col)
    + NOTE(f'Garis mencancang: jarak mengufuk = 0, dan pembahagian dengan 0 tidak tertakrif, contohnya {FR(5, 0)}.'),
    svg(fig, 'Empat jenis kecerunan: positif, negatif, sifar dan tidak tertakrif'))

# 10.1.3-2 Kecuraman |m|
pl = Plane(-4, 4, -4, 4)
LNS = [(F(2), TR), (F(-3), RD), (F(1, 2), GR)]
fig = pl.draw()
for mm, cl in LNS:
    fig += pl.line((0, 0), (1, float(mm)), cl, 5)
fig += T(pl.X(2) + 8, pl.Y(4) + 14, 'm = 2', TR, 19, 'start', italic=True)
fig += T(pl.X(-4 / 3) - 8, pl.Y(4) + 14, 'm = −3', RD, 19, 'end', italic=True)
fig += T(pl.X(4) - 4, pl.Y(2) - 18, 'm = 1/2', GR, 19, 'end', italic=True)
assert abs(F(-3)) > abs(F(2)) > abs(F(1, 2))
add('10.1.3', 'KONSEP', 'Garis manakah lebih curam?',
    DEF('Semakin <b>besar nilai</b> <i>m</i> (abaikan tanda), semakin <b>curam</b> garis itu. Tanda hanya menunjukkan <b>arah</b>.', col)
    + P('Garis manakah lebih curam: <i>m</i> = −3 atau <i>m</i> = 2?', True)
    + STEPS(['Abaikan tanda: bandingkan 3 dengan 2.',
             '3 &gt; 2, jadi garis <i>m</i> = −3 lebih curam (turun ke kanan).'], col)
    + ANS('<i>m</i> = −3 lebih curam'),
    svg(fig, 'Tiga garis melalui asalan: m = 2, m = −3 dan m = 1/2'))

# 10.1.3-3 Pintasan
Xi, Yi = 4, 6
m = slope((Xi, 0), (0, Yi)); assert m == -F(Yi, Xi) == F(-3, 2)
pl = Plane(-1, 6, -1, 7, (40, 22, 470, 448))
fig = (pl.draw() + pl.line((Xi, 0), (0, Yi), AM, 5)
       + pl.pt(Xi, 0, '', GR) + pl.pt(0, Yi, '', PU)
       + T(pl.X(Xi) + 4, pl.Y(1), 'pintasan-x = 4', GR, 18, 'start')
       + T(pl.X(0) + 14, pl.Y(Yi) - 2, 'pintasan-y = 6', PU, 18, 'start')
       + T(pl.X(4.2), pl.Y(5.2), 'm = −3/2', AM, 20, italic=True))
add('10.1.3', 'RUMUS', 'Kecerunan dan pintasan',
    BUL([f'{B("Pintasan-<i>x</i>", GR)}: nilai <i>x</i> di titik garis menyilang paksi-<i>x</i>.',
         f'{B("Pintasan-<i>y</i>", PU)}: nilai <i>y</i> di titik garis menyilang paksi-<i>y</i>.'], col)
    + DEF(f'<i>m</i> = {MI}', col)
    + P('Garis lurus mempunyai pintasan-<i>x</i> = 4 dan pintasan-<i>y</i> = 6. Cari kecerunannya.', True)
    + STEPS([f'<i>m</i> = −{FR(6, 4)} = {FRV(m)}'], col)
    + ANS(f'<i>m</i> = {FRV(m)}'),
    svg(fig, 'Garis lurus dengan pintasan-x 4 dan pintasan-y 6'))

# 10.1.3-4 Cari nilai tidak diketahui
Bq = (6, 9); mk = F(3, 2)
kk = Bq[1] - mk * (Bq[0] - 2); assert kk == 3 and slope((2, kk), Bq) == mk
assert -F(8, 4) == -2      # contoh pintasan dalam nota
pl = Plane(-1, 7, -1, 10, (40, 22, 470, 448))
fig = (pl.draw() + pl.line((2, int(kk)), Bq, AM, 4)
       + LINE(pl.p(2, 0), pl.p(2, int(kk)), DIM, 2.5, '6 6')
       + pl.pt(2, int(kk), 'A(2, k)', GR, -12, -10, 'end') + pl.pt(*Bq, 'B(6, 9)', AM, -12, -10, 'end')
       + T(pl.X(2) + 14, pl.Y(kk) + 22, 'k = ?', GR, 19, 'start')
       + T(pl.X(5.4), pl.Y(2.2), 'm = 3/2', AM, 20, italic=True))
add('10.1.3', 'CONTOH BERLANGKAH', 'Mencari nilai yang tidak diketahui',
    P(f'Garis lurus melalui A(2, <i>k</i>) dan B(6, 9) dengan kecerunan {FR(3, 2)}. Cari nilai <i>k</i>.', True)
    + STEPS([f'{FR("9 − <i>k</i>", "6 − 2")} = {FR(3, 2)}',
             f'{FR("9 − <i>k</i>", 4)} = {FR(3, 2)} → 9 − <i>k</i> = {FR(3, 2)} × 4 = 6',
             '<i>k</i> = 9 − 6 = 3'], col)
    + ANS('<i>k</i> = 3')
    + NOTE(f'Jika <i>m</i> = −2 dan pintasan-<i>y</i> = 8: −2 = −{FR(8, "pintasan-<i>x</i>")}, maka pintasan-<i>x</i> = 4.', 'Cuba:'),
    svg(fig, 'Garis melalui A(2, k) dan B(6, 9) dengan kecerunan 3/2'))

# 10.1.3-5 Penyelesaian masalah
kr = F(1, 12); tinggi = F(6, 10)
run = tinggi / kr; assert run == F(36, 5) and float(run) == 7.2
fig = (RECT(14, 14, 472, 300)
       + LINE((30, 250), (470, 250), MU2, 4)
       + POLY([(60, 250), (420, 250), (420, 150)], f'{GR}26', GR, 4)
       + RECT(420, 150, 52, 100, DIM, MU2, 0, 2)
       + LINE((60, 250), (420, 250), HC, 5) + LINE((420, 250), (420, 150), VC, 5)
       + right_angle((420, 250), (-1, 0), (0, -1), TX, 13)
       + T(240, 276, 'jarak mengufuk = ?', HC, 19) + T(408, 200, '0.6 m', VC, 18, 'end')
       + T(200, 160, 'kecerunan 1/12', GR, 19)
       + T(446, 128, 'pintu', MU, 15, halo=False)
              + RECT(30, 334, 440, 120, SURF, BD, 16, 2)
       + SFR(160, 394, '0.6', 'mengufuk', TX, 20) + T(250, 394, '=', TX, 22) + SFR(300, 394, '1', '12', GR, 22)
       + T(400, 394, '→ 7.2 m', AM, 22))
add('10.1.3', 'PENYELESAIAN MASALAH', 'Membina tanjakan OKU',
    P(f'Sebuah tanjakan OKU perlu mempunyai kecerunan {FR(1, 12)}. Pintu bangunan berada 0.6 m dari tanah. Berapakah jarak mengufuk tanjakan itu?', True)
    + STEPS([f'Kecerunan = {MV} → {FR("0.6", "jarak mengufuk")} = {FR(1, 12)}',
             'Jarak mengufuk = 0.6 × 12',
             '= 7.2 m'], col)
    + ANS('Jarak mengufuk = 7.2 m')
    + NOTE('Lukis rajah dahulu, labelkan jarak mencancang dan mengufuk, kemudian bentuk persamaan.'),
    svg(fig, 'Tanjakan OKU setinggi 0.6 m dengan kecerunan 1/12'))

# 10.1.3-6 Kesilapan biasa
assert -F(6, 4) == F(-3, 2)
fig = ''
CASES = [(48, 'm = −3 kurang curam daripada m = 2', False), (128, 'Abaikan tanda: 3 > 2 → m = −3 lebih curam', True),
         (228, 'Garis mengufuk: tidak tertakrif', False), (308, 'Garis mengufuk: m = 0', True),
         (408, 'Pintasan-x 4, pintasan-y 6: m = 6/4', False)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 454, '✓  m = −6/4 = −3/2', GR, 19, halo=False)
add('10.1.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Kecuraman ikut tanda", RD)} ✗ → kecuraman bergantung pada <b>nilai</b> <i>m</i>, bukan tanda.',
         f'{B("Tertukar sifar dengan tidak tertakrif", RD)} ✗ → mengufuk: <i>m</i> = 0; mencancang: tidak tertakrif.',
         f'{B("Lupa tanda negatif", RD)} dalam <i>m</i> = {MI} ✗',
         f'{B("Baca dari kanan ke kiri", RD)} ✗ → sentiasa baca garis dari <b>kiri ke kanan</b>.'], col),
    svg(fig, 'Contoh kenyataan salah dan betul tentang arah kecondongan dan pintasan'))

# 10.1.3-7 Ringkasan bab
fig = ''
for i, (nm, mv, cl, a, b, d) in enumerate(ARAH):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, BD, 16, 2)
    pl = Plane(-2, 2, -2, 2, (40, y0 + 18, 104, y0 + 82))
    fig += LINE(pl.p(-2.3, 0), pl.p(2.3, 0), MU2, 2) + LINE(pl.p(0, -2.3), pl.p(0, 2.3), MU2, 2) + LINE(pl.p(*a), pl.p(*b), cl, 4.5)
    fig += T(128, y0 + 36, nm, cl, 21, 'start') + T(128, y0 + 68, d, MU, 17, 'start', halo=False)
    fig += T(466, y0 + 50, mv, TX, 20, 'end')
add('10.1.3', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus'],
          [['Kecerunan', MV],
           ['Dua titik', f'<i>m</i> = {MF}'],
           ['Pintasan', f'<i>m</i> = {MI}']], col, rv=True)
    + BUL(['Semakin besar nilai <i>m</i> (abaikan tanda), semakin curam garis itu.',
           'Permudahkan pecahan dalam jawapan.'], col),
    svg(fig, 'Ringkasan empat arah kecondongan garis lurus'))

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
assert counts == {'10.1.1': 5, '10.1.2': 5, '10.1.3': 7}, counts

js = ('/* Dijana oleh tools/gradien/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
