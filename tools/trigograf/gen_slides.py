# Penjana slaid NOTA GRAF TRIGO (Tingkatan 5 Bab 6 Nisbah dan Graf Fungsi Trigonometri)
#   -> trigograf/slides.js
# Jalankan:  python3 tools/trigograf/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'trigograf', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# KSSM T5 Bab 6: SK 6.1 Nilai Sinus, Kosinus dan Tangen bagi Sudut θ, 0° ≤ θ ≤ 360°; SK 6.2 Graf Fungsi Sinus, Kosinus dan Tangen
SUB = {
    '6.1': ('Nilai Sinus, Kosinus dan Tangen bagi Sudut θ, 0° ≤ θ ≤ 360°', PU),
    '6.2': ('Graf Fungsi Sinus, Kosinus dan Tangen', TR),
}
CA, CB, CC = PK, TR, PU   # warna tetap pekali: a merah jambu, b biru, c ungu
SYM = PU                  # paksi simetri
ROOT = PK                 # punca / pintasan-x
VTX = AM                  # titik maksimum / minimum

# ---------- semakan matematik ----------
def quad(a, b, c):
    return lambda x: a * x * x + b * x + c
def axis(a, b):
    return F(-b, 2 * a)
def vertex(a, b, c):
    h = axis(a, b)
    return h, a * h * h + b * h + c
def roots(a, b, c):
    """Punca nyata (Fraction) jika diskriminan kuasa dua sempurna."""
    d = b * b - 4 * a * c
    s = math.isqrt(d)
    assert s * s == d, 'bukan kuasa dua sempurna'
    return sorted({F(-b - s, 2 * a), F(-b + s, 2 * a)})
def fs(fr):
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
    return ('<span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; '
            'line-height: 1.1; font-size: 0.85em; margin: 0 2px; white-space: nowrap"><span style="padding: 0 4px; border-bottom: 2px solid currentColor">'
            f'{a}</span><span>{b}</span></span>')
def FRV(fr):
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
X = '<i>x</i>'
X2 = '<i>x</i>²'
FX = '<i>f</i>(<i>x</i>)'
AXF = '<i>x</i> = −' + FR('<i>b</i>', '2<i>a</i>')

def poly_html(a, b, c, v='<i>x</i>'):
    """ax² + bx + c sebagai HTML dengan tanda tolak sebenar."""
    out = []
    for k, (coef, pw) in enumerate([(a, 2), (b, 1), (c, 0)]):
        if coef == 0: continue
        sgn = '−' if coef < 0 else '+'
        m = abs(coef)
        body = (v + ('²' if pw == 2 else '')) if pw else str(m)
        if pw and m != 1: body = f'{m}{body}'
        if not out: out.append(('−' if coef < 0 else '') + body)
        else: out.append(f' {sgn} {body}')
    return ''.join(out) if out else '0'
def poly_txt(a, b, c):
    return re.sub(r'</?i>', '', poly_html(a, b, c))

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

class Plane:
    """Satah Cartes [x0,x1] x [y0,y1] dalam kotak (L, T, R, B) piksel. sy = skala-y relatif (boleh mampat)."""
    def __init__(self, x0, x1, y0, y1, box=(28, 22, 480, 448), same=True):
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1
        L, Tp, R, Bm = box
        sx = (R - L) / (x1 - x0); sy = (Bm - Tp) / (y1 - y0)
        if same: sx = sy = min(sx, sy)
        self.sx, self.sy = sx, sy
        self.ox = (L + R) / 2 - sx * (x0 + x1) / 2
        self.oy = (Tp + Bm) / 2 + sy * (y0 + y1) / 2
    def X(self, x): return self.ox + self.sx * x
    def Y(self, y): return self.oy - self.sy * y
    def p(self, x, y): return (self.X(x), self.Y(y))
    def draw(self, nums=True, xstep=1, ystep=1, fs_=15, grid=True):
        s = ''
        if grid:
            for i in range(math.ceil(self.x0), math.floor(self.x1) + 1):
                s += LINE(self.p(i, self.y0), self.p(i, self.y1), GRID, 1.5, cap='butt')
            for j in range(math.ceil(self.y0), math.floor(self.y1) + 1):
                if j % ystep == 0 or ystep == 1:
                    s += LINE(self.p(self.x0, j), self.p(self.x1, j), GRID, 1.5, cap='butt')
        s += ARROW(self.p(self.x0, 0), (self.X(self.x1) + 6, self.Y(0)), MU, 2.5, 10)
        s += ARROW(self.p(0, self.y0), (self.X(0), self.Y(self.y1) - 6), MU, 2.5, 10)
        s += T(self.X(self.x1) - 4, self.Y(0) - 16, 'x', MU, 18, italic=True)
        s += T(self.X(0) + 16, self.Y(self.y1) + 4, 'y', MU, 18, italic=True)
        if nums:
            for i in range(math.ceil(self.x0), math.floor(self.x1) + 1):
                if i != 0 and i % xstep == 0:
                    s += T(self.X(i), self.Y(0) + 15, fs(i), MU2, fs_, weight=600)
            for j in range(math.ceil(self.y0), math.floor(self.y1) + 1):
                if j != 0 and j % ystep == 0:
                    s += T(self.X(0) - 9, self.Y(j), fs(j), MU2, fs_, 'end', weight=600)
            s += T(self.X(0) - 9, self.Y(0) + 14, '0', MU2, fs_, 'end', weight=600)
        return s
    def curve(self, f, col=TR, sw=5, dash=None, lo=None, hi=None):
        """Lengkung y = f(x) disampel, dipotong pada sempadan satah."""
        lo = self.x0 if lo is None else lo; hi = self.x1 if hi is None else hi
        n = 240; segs = []; cur = []
        for k in range(n + 1):
            x = lo + (hi - lo) * k / n; y = f(x)
            if self.y0 - 0.05 <= y <= self.y1 + 0.05:
                cur.append(self.p(x, max(self.y0, min(self.y1, y))))
            elif cur:
                segs.append(cur); cur = []
        if cur: segs.append(cur)
        d = f' stroke-dasharray="{dash}"' if dash else ''
        return ''.join(f'<path d="M{" L".join(f"{r1(x)} {r1(y)}" for x, y in sg)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{d}/>' for sg in segs if len(sg) > 1)
    def vline(self, x, col=SYM, sw=3, dash='8 7'):
        return LINE(self.p(x, self.y0), self.p(x, self.y1), col, sw, dash)
    def pt(self, x, y, lab, col=TX, dx=0, dy=-22, anchor='middle', size=18):
        return DOT(self.p(x, y), col) + (T(self.X(x) + dx, self.Y(y) + dy, lab, col, size, anchor) if lab else '')

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== pembantu trigo =====================
def sd(d): return math.sin(math.radians(d))
def cd(d): return math.cos(math.radians(d))
def td(d): return math.tan(math.radians(d))
def ref(t):
    t %= 360
    return t if t <= 90 else 180 - t if t <= 180 else t - 180 if t <= 270 else 360 - t
def quad_of(t):
    return 1 if 0 < t < 90 else 2 if 90 < t < 180 else 3 if 180 < t < 270 else 4
def n4(v):
    s = f'{v:.4f}'.rstrip('0').rstrip('.')
    if s in ('-0', '−0'): s = '0'
    return s.replace('-', '−')

def UC(theta, cx=250, cy=235, R=165, lab=True, alpha=True, col=PU, extra=''):
    """Bulatan unit dengan titik P pada sudut theta."""
    s = LINE((cx - R - 30, cy), (cx + R + 30, cy), MU, 2.5) + LINE((cx, cy + R + 30), (cx, cy - R - 30), MU, 2.5)
    s += T(cx + R + 22, cy - 16, 'x', MU, 18, italic=True) + T(cx + 16, cy - R - 24, 'y', MU, 18, italic=True)
    s += f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{DIM}" stroke-width="3"/>'
    px, py = cx + R * cd(theta), cy - R * sd(theta)
    # lengkok sudut
    r = 38; n = max(2, int(theta / 4))
    pts = ' L'.join(f'{r1(cx + r * cd(theta * k / n))} {r1(cy - r * sd(theta * k / n))}' for k in range(n + 1))
    s += f'<path d="M{pts}" fill="none" stroke="{AM}" stroke-width="3"/>'
    s += LINE((px, py), (px, cy), PK, 3.5, '7 6') + LINE((cx, cy), (px, cy), GR, 4)
    s += LINE((cx, cy), (px, py), col, 4.5) + DOT((px, py), AM, 8)
    if lab:
        mid = theta / 2
        s += T(cx + 62 * cd(mid), cy - 62 * sd(mid), f'{theta}°', AM, 18)
        s += T(px + (22 if px >= cx else -22), py + (-20 if py <= cy else 20), f'P(kos {theta}°, sin {theta}°)', TX, 15, 'start' if px >= cx else 'end')
    if alpha and theta % 90:
        a = ref(theta)
        s += T((cx + px) / 2, cy + (22 if py <= cy else -22), f'α = {a}°', GR, 16)
    s += T(cx + R + 4, cy + 18, '1', MU2, 15) + T(cx - R - 4, cy + 18, '−1', MU2, 15)
    s += T(cx - 14, cy - R - 6, '1', MU2, 15) + T(cx - 18, cy + R + 8, '−1', MU2, 15)
    return s + extra

def TP(x0, x1, y0, y1, box=(46, 30, 484, 440)):
    L, Tp, R, Bm = box
    X = lambda x: L + (x - x0) * (R - L) / (x1 - x0)
    Y = lambda y: Bm - (y - y0) * (Bm - Tp) / (y1 - y0)
    return X, Y

def TRIGAX(X, Y, x0, x1, y0, y1, xt=(90, 180, 270, 360), yt=(-1, 1)):
    s = ''
    for x in xt: s += LINE((X(x), Y(y0)), (X(x), Y(y1)), GRID, 1.5, cap='butt')
    for y in yt: s += LINE((X(x0), Y(y)), (X(x1), Y(y)), GRID, 1.5, cap='butt')
    s += ARROW((X(x0), Y(0)), (X(x1) + 10, Y(0)), MU, 2.5, 10) + ARROW((X(0), Y(y0)), (X(0), Y(y1) - 8), MU, 2.5, 10)
    s += T(X(x1) + 4, Y(0) - 18, 'x', MU, 18, italic=True) + T(X(0) + 16, Y(y1) - 2, 'y', MU, 18, italic=True)
    for x in xt: s += T(X(x), Y(0) + 17, f'{x}°', MU2, 14, weight=600)
    for y in yt: s += T(X(0) - 9, Y(y), fs(y), MU2, 15, 'end', weight=600)
    s += T(X(0) - 9, Y(0) + 14, '0', MU2, 14, 'end', weight=600)
    return s

def TCURVE(X, Y, f, x0, x1, y0, y1, col=TR, sw=5, dash=None):
    segs, cur = [], []
    for k in range(361):
        x = x0 + (x1 - x0) * k / 360; y = f(x)
        if y is not None and y0 - 0.05 <= y <= y1 + 0.05: cur.append((X(x), Y(y)))
        elif cur: segs.append(cur); cur = []
    if cur: segs.append(cur)
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return ''.join(f'<path d="M{" L".join(f"{r1(a)} {r1(b)}" for a, b in sg)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{d}/>' for sg in segs if len(sg) > 1)

TH = '<i>θ</i>'
# ===================== 6.1 =====================
col = SUB['6.1'][1]

# 6.1-1 Bulatan unit
assert abs(cd(50) ** 2 + sd(50) ** 2 - 1) < 1e-12
add('6.1', 'DEFINISI', 'Bulatan unit',
    DEF(f'<b>Bulatan unit</b> ialah bulatan berpusat di asalan O dengan jejari <b>1 unit</b>. Jika titik P(<i>x</i>, <i>y</i>) pada bulatan unit dan OP membuat sudut {TH} dengan paksi-<i>x</i> positif (lawan arah jam), maka:', col)
    + BUL([f'{B("sin " + TH + " = <i>y</i>", PK)} (koordinat-<i>y</i> bagi P)',
           f'{B("kos " + TH + " = <i>x</i>", GR)} (koordinat-<i>x</i> bagi P)',
           f'{B("tan " + TH + " = " + FR("<i>y</i>", "<i>x</i>") + " = " + FR("sin " + TH, "kos " + TH), AM)}'], col)
    + NOTE('Nilai sin θ dan kos θ sentiasa antara −1 dan 1.'),
    svg(UC(50, alpha=False) + T(250 + 165 * cd(50) / 2 - 6, 235 + 20, 'x', GR, 17, italic=True) + T(250 + 165 * cd(50) + 14, 235 - 165 * sd(50) / 2 + 20, 'y', PK, 17, 'start', italic=True), 'Bulatan unit dengan titik P pada sudut 50 darjah'))

# 6.1-2 Sukuan & tanda
fig = UC(0, lab=False, alpha=False, extra='')
fig = LINE((60, 235), (440, 235), MU, 2.5) + LINE((250, 425), (250, 45), MU, 2.5) + f'<circle cx="250" cy="235" r="165" fill="none" stroke="{DIM}" stroke-width="3"/>'
for (qx, qy, q, txt, cc, rng) in [(355, 140, 'Sukuan I', 'Semua +', GR, '0° < θ < 90°'), (145, 140, 'Sukuan II', 'sin +', PK, '90° < θ < 180°'),
                                  (145, 330, 'Sukuan III', 'tan +', AM, '180° < θ < 270°'), (355, 330, 'Sukuan IV', 'kos +', TR, '270° < θ < 360°')]:
    fig += T(qx, qy - 28, q, MU3, 17) + T(qx, qy + 2, txt, cc, 26) + T(qx, qy + 32, rng, MU2, 14, weight=600)
fig += T(462, 222, '0°', MU2, 14) + T(250, 32, '90°', MU2, 14) + T(36, 222, '180°', MU2, 14) + T(250, 446, '270°', MU2, 14)
assert sd(120) > 0 and cd(120) < 0 and td(220) > 0 and cd(300) > 0 and sd(300) < 0
add('6.1', 'SUKUAN & TANDA', 'Tanda sin, kos dan tan dalam setiap sukuan',
    P('Paksi-<i>x</i> dan paksi-<i>y</i> membahagikan bulatan kepada <b>empat sukuan</b>. Tanda koordinat P menentukan tanda nisbah:')
    + TABLE(['Sukuan', 'sin θ', 'kos θ', 'tan θ'], [['I', '+', '+', '+'], ['II', '+', '−', '−'], ['III', '−', '−', '+'], ['IV', '−', '+', '−']], col)
    + NOTE('Ingat urutan “<b>S</b>emua – <b>S</b>in – <b>T</b>an – <b>K</b>os” bermula dari Sukuan I, lawan arah jam.', 'Petua:'),
    svg(fig, 'Empat sukuan dengan nisbah yang positif dalam setiap sukuan'))

# 6.1-3 Sudut rujukan
assert ref(150) == 30 and ref(210) == 30 and ref(330) == 30 and ref(45) == 45
add('6.1', 'SUDUT RUJUKAN', 'Sudut rujukan α',
    DEF('<b>Sudut rujukan α</b> ialah sudut tirus di antara sisi OP dengan <b>paksi-<i>x</i></b>. Nilai nisbah bagi θ sama dengan nilai nisbah bagi α, dengan tanda mengikut sukuan.', col)
    + TABLE(['Sukuan', 'Julat θ', 'Sudut rujukan α'], [['I', '0° < θ < 90°', 'α = θ'], ['II', '90° < θ < 180°', 'α = 180° − θ'], ['III', '180° < θ < 270°', 'α = θ − 180°'], ['IV', '270° < θ < 360°', 'α = 360° − θ']], col, rv=True)
    + NOTE('Sudut rujukan sentiasa diukur dari paksi-<i>x</i>, bukan dari paksi-<i>y</i>.'),
    svg(UC(150), 'Sudut 150 darjah dengan sudut rujukan 30 darjah'))

# 6.1-4 Contoh: sin 210°, kos 210°, tan 210°
assert abs(sd(210) + 0.5) < 1e-12 and abs(cd(210) + math.sqrt(3) / 2) < 1e-12 and abs(td(210) - 1 / math.sqrt(3)) < 1e-12
add('6.1', 'CONTOH 1', 'Cari sin 210°, kos 210° dan tan 210°',
    STEPS(['210° berada dalam <b>Sukuan III</b> (180° < 210° < 270°).',
           'Sudut rujukan: α = 210° − 180° = <b>30°</b>.',
           'Dalam Sukuan III, hanya <b>tan positif</b>; sin dan kos negatif.',
           f'sin 210° = −sin 30° = <b>−0.5</b>; kos 210° = −kos 30° = <b>−0.8660</b>',
           'tan 210° = +tan 30° = <b>0.5774</b>'], col)
    + ANS('sin 210° = −0.5, kos 210° = −0.8660, tan 210° = 0.5774'),
    svg(UC(210), 'Sudut 210 darjah dalam Sukuan III dengan sudut rujukan 30 darjah'))

# 6.1-5 Sudut khas
rows = []
SP = {0: ('0', '1', '0'), 30: ('½', '√3/2', '1/√3'), 45: ('1/√2', '1/√2', '1'), 60: ('√3/2', '½', '√3'), 90: ('1', '0', 'tidak tertakrif'),
      180: ('0', '−1', '0'), 270: ('−1', '0', 'tidak tertakrif'), 360: ('0', '1', '0')}
for a, (s_, c_, t_) in SP.items():
    if a in (90, 270): assert abs(cd(a)) < 1e-12
    rows.append([f'{a}°', s_, c_, t_])
assert abs(sd(30) - 0.5) < 1e-12 and abs(cd(60) - 0.5) < 1e-12 and abs(td(45) - 1) < 1e-12 and abs(td(60) - math.sqrt(3)) < 1e-12
fig = ''
# segi tiga 45°
fig += f'<path d="M40 400 L220 400 L220 220 Z" fill="none" stroke="{PU}" stroke-width="4" stroke-linejoin="round"/>'
fig += T(130, 424, '1', TX, 18) + T(238, 310, '1', TX, 18, 'start') + T(112, 296, '√2', AM, 18) + T(76, 384, '45°', GR, 16) + T(204, 240, '45°', GR, 16, 'end')
fig += f'<path d="M270 400 L470 400 L470 54 Z" fill="none" stroke="{TR}" stroke-width="4" stroke-linejoin="round"/>'
fig += T(370, 424, '1', TX, 18) + T(486, 228, '√3', TX, 18, 'start') + T(350, 210, '2', AM, 18) + T(310, 386, '60°', GR, 16) + T(456, 100, '30°', GR, 16, 'end')
fig += T(250, 36, 'Segi tiga sudut khas', MU3, 19, halo=False)
add('6.1', 'SUDUT KHAS', 'Nilai tepat bagi sudut khas',
    TABLE(['θ', 'sin θ', 'kos θ', 'tan θ'], rows, col)
    + NOTE('Bagi 90° dan 270°, kos θ = 0, maka tan θ = sin θ ÷ kos θ <b>tidak tertakrif</b>.'),
    svg(fig, 'Segi tiga bersudut 45 darjah dan segi tiga bersudut 30 dan 60 darjah'))

# 6.1-6 Contoh: cari θ
sols = [t for t in range(0, 361) if abs(sd(t) + 0.5) < 1e-9]
assert sols == [210, 330], sols
cx, cy, R = 250, 235, 165
fig = LINE((cx - R - 30, cy), (cx + R + 30, cy), MU, 2.5) + LINE((cx, cy + R + 30), (cx, cy - R - 30), MU, 2.5) + f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{DIM}" stroke-width="3"/>'
fig += LINE((cx - R - 20, cy + R / 2), (cx + R + 20, cy + R / 2), PK, 2.5, '7 6') + T(cx + R + 22, cy + R / 2 - 18, 'y = −0.5', PK, 15, 'end')
for t in sols:
    p = (cx + R * cd(t), cy - R * sd(t)); fig += LINE((cx, cy), p, PU, 4) + DOT(p, AM, 8) + T(p[0] + (-16 if t == 210 else 16), p[1] + 24, f'{t}°', AM, 18, 'end' if t == 210 else 'start')
fig += T(cx - 70, cy + 26, '30°', GR, 15) + T(cx + 70, cy + 26, '30°', GR, 15)
add('6.1', 'CONTOH 2', 'Cari θ apabila sin θ = −0.5',
    P('Diberi sin θ = −0.5 dan 0° ≤ θ ≤ 360°. Cari nilai θ.')
    + STEPS(['Sudut rujukan: sin α = 0.5 → <b>α = 30°</b> (guna nilai positif).',
             'sin negatif dalam <b>Sukuan III</b> dan <b>Sukuan IV</b>.',
             'Sukuan III: θ = 180° + 30° = <b>210°</b>',
             'Sukuan IV: θ = 360° − 30° = <b>330°</b>'], col)
    + ANS('θ = 210° atau θ = 330°'),
    svg(fig, 'Dua titik pada bulatan unit dengan sin theta sama dengan negatif 0.5'))

# 6.1-7 Kesilapan biasa
assert abs(sd(150) - 0.5) < 1e-12 and abs(cd(120) + 0.5) < 1e-12
fig = ''
CASES = [(60, 'α bagi 150° = 150° − 90° = 60°', False), (126, 'α bagi 150° = 180° − 150° = 30°', True),
         (210, 'kos 120° = kos 60° = 0.5', False), (276, 'kos 120° = −kos 60° = −0.5', True),
         (360, 'sin θ = 0.5 → θ = 30° sahaja', False), (426, 'sin θ = 0.5 → θ = 30°, 150°', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('6.1', 'KESILAPAN BIASA', 'Semak jawapan anda',
    BUL([f'{B("Ukur α dari paksi-y", RD)}: sudut rujukan mesti diukur dari <b>paksi-<i>x</i></b>.',
         f'{B("Lupa tanda", RD)}: tentukan sukuan dahulu, kemudian tanda (Semua – Sin – Tan – Kos).',
         f'{B("Satu jawapan sahaja", RD)}: bagi 0° ≤ θ ≤ 360°, biasanya ada <b>dua</b> nilai θ.'], col)
    + NOTE('Sukuan → sudut rujukan α → tanda → nilai.', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi sudut rujukan dan tanda'))

# ===================== 6.2 =====================
col = SUB['6.2'][1]
def graf(fns, y0=-1.5, y1=1.5, yt=(-1, 1), extra='', x1=360, xt=(90, 180, 270, 360)):
    X, Y = TP(0, x1 + 20, y0, y1, (50, 40, 470, 430))
    s = TRIGAX(X, Y, 0, x1 + 20, y0, y1, xt, yt)
    for f, c, *rest in fns: s += TCURVE(X, Y, f, 0, x1, y0, y1, c, 5, rest[0] if rest else None)
    return s, X, Y

# 6.2-1 sin
vals = [0, 90, 180, 270, 360]
assert [round(sd(v), 9) + 0 for v in vals] == [0, 1, 0, -1, 0]
fig, X, Y = graf([(sd, TR)])
fig += DOT((X(90), Y(1)), AM) + T(X(90), Y(1) - 22, 'maks (90°, 1)', AM, 15) + DOT((X(270), Y(-1)), PK) + T(X(270), Y(-1) + 24, 'min (270°, −1)', PK, 15)
add('6.2', 'GRAF SINUS', 'Graf y = sin x',
    TABLE(['x', '0°', '90°', '180°', '270°', '360°'], [['sin x', '0', '1', '0', '−1', '0']], col)
    + BUL(['Nilai maksimum <b>1</b> (x = 90°), nilai minimum <b>−1</b> (x = 270°).',
           '<b>Amplitud</b> = 1; <b>kala</b> = 360° (bentuk berulang setiap 360°).',
           'Memotong paksi-<i>x</i> pada 0°, 180° dan 360°.'], col),
    svg(fig, 'Graf y sama dengan sin x dari 0 hingga 360 darjah'))

# 6.2-2 kos
assert [round(cd(v), 9) + 0 for v in vals] == [1, 0, -1, 0, 1]
fig, X, Y = graf([(cd, GR)])
fig += DOT((X(0), Y(1)), AM) + T(X(0) + 12, Y(1) - 20, '(0°, 1)', AM, 15, 'start') + DOT((X(180), Y(-1)), PK) + T(X(180), Y(-1) + 24, 'min (180°, −1)', PK, 15) + DOT((X(360), Y(1)), AM)
add('6.2', 'GRAF KOSINUS', 'Graf y = kos x',
    TABLE(['x', '0°', '90°', '180°', '270°', '360°'], [['kos x', '1', '0', '−1', '0', '1']], col)
    + BUL(['Nilai maksimum <b>1</b> (x = 0°, 360°), nilai minimum <b>−1</b> (x = 180°).',
           '<b>Amplitud</b> = 1; <b>kala</b> = 360°.',
           'Memotong paksi-<i>x</i> pada 90° dan 270°.'], col)
    + NOTE('Graf kos x ialah graf sin x yang dianjak 90° ke kiri.'),
    svg(fig, 'Graf y sama dengan kos x dari 0 hingga 360 darjah'))

# 6.2-3 tan
assert abs(td(45) - 1) < 1e-12 and abs(td(135) + 1) < 1e-12 and abs(td(180)) < 1e-12
tf_ = lambda x: None if abs(cd(x)) < 0.06 else td(x)
fig, X, Y = graf([(tf_, AM)], -4, 4, (-1, 1))
for a in (90, 270): fig += LINE((X(a), Y(-4)), (X(a), Y(4)), RD, 2.5, '8 7')
fig += T(X(90) + 8, Y(3.6), 'asimptot', RD, 14, 'start') + T(X(270) + 8, Y(3.6), 'x = 270°', RD, 14, 'start') + T(X(90) + 8, Y(3.1), 'x = 90°', RD, 14, 'start')
add('6.2', 'GRAF TANGEN', 'Graf y = tan x',
    TABLE(['x', '0°', '45°', '90°', '135°', '180°', '225°', '270°', '315°', '360°'], [['tan x', '0', '1', '—', '−1', '0', '1', '—', '−1', '0']], col)
    + BUL(['tan x <b>tidak tertakrif</b> pada 90° dan 270° (garis putus-putus = <b>asimptot</b>).',
           '<b>Kala</b> = 180°; graf tan <b>tiada amplitud</b> (tiada nilai maksimum atau minimum).'], col),
    svg(fig, 'Graf y sama dengan tan x dengan asimptot pada 90 dan 270 darjah'))

# 6.2-4 bentuk am
fig, X, Y = graf([(sd, DIM, '8 7'), (lambda x: 2 * sd(x), PK)], -2.6, 2.6, (-2, -1, 1, 2))
fig += T(X(90), Y(2) - 20, 'y = 2 sin x', PK, 16) + T(X(90) + 10, Y(1) + 22, 'y = sin x', MU, 14, 'start')
add('6.2', 'KESAN a, b, c', 'Graf y = a sin bx + c',
    DEF(f'Bagi y = {B("<i>a</i>", PK)} sin {B("<i>b</i>", TR)}x + {B("<i>c</i>", PU)} atau y = <i>a</i> kos <i>bx</i> + <i>c</i> (<i>b</i> > 0):', col)
    + BUL([f'{B("Amplitud", PK)} = |<i>a</i>| (separuh jarak menegak dari maksimum ke minimum)',
           f'{B("Kala", TR)} = 360° ÷ <i>b</i> &nbsp;(bagi tan: 180° ÷ <i>b</i>)',
           f'{B("c", PU)} menganjak graf <i>c</i> unit ke atas (<i>c</i> > 0) atau ke bawah (<i>c</i> < 0)',
           'Nilai maksimum = |<i>a</i>| + <i>c</i>; nilai minimum = −|<i>a</i>| + <i>c</i>'], col),
    svg(fig, 'Perbandingan graf y sama dengan sin x dan y sama dengan 2 sin x'))

# 6.2-5 Contoh y = 2 kos 2x + 1
f5 = lambda x: 2 * cd(2 * x) + 1
assert abs(max(f5(x) for x in range(361)) - 3) < 1e-9 and abs(min(f5(x) for x in range(361)) + 1) < 1e-9 and abs(f5(180) - 3) < 1e-9
fig, X, Y = graf([(f5, PU)], -1.6, 3.6, (-1, 1, 2, 3), xt=(45, 90, 135, 180, 270, 360))
fig += LINE((X(0), Y(1)), (X(360), Y(1)), MU2, 2, '6 6') + DOT((X(0), Y(3)), AM) + DOT((X(180), Y(3)), AM) + DOT((X(90), Y(-1)), PK)
fig += T(X(180), Y(3) - 20, '(180°, 3)', AM, 14) + T(X(90), Y(-1) + 22, '(90°, −1)', PK, 14)
add('6.2', 'CONTOH', 'Lakar y = 2 kos 2x + 1, 0° ≤ x ≤ 360°',
    STEPS(['<i>a</i> = 2 → amplitud = <b>2</b>.',
           '<i>b</i> = 2 → kala = 360° ÷ 2 = <b>180°</b> (dua kitaran dalam 0° hingga 360°).',
           '<i>c</i> = 1 → garis tengah <i>y</i> = 1.',
           'Maksimum = 2 + 1 = <b>3</b>; minimum = −2 + 1 = <b>−1</b>.',
           'Plot titik: (0°, 3), (45°, 1), (90°, −1), (135°, 1), (180°, 3), … dan lukis lengkung licin.'], col)
    + ANS('Amplitud 2, kala 180°, maksimum 3, minimum −1'),
    svg(fig, 'Graf y sama dengan 2 kos 2x tambah 1'))

# 6.2-6 Kesan b dan c
fig, X, Y = graf([(sd, DIM, '8 7'), (lambda x: sd(2 * x), TR), (lambda x: sd(x) + 1, PU)], -1.6, 2.6, (-1, 1, 2))
fig += T(X(45), Y(1) - 18, 'sin 2x', TR, 15) + T(X(90) + 30, Y(2) - 12, 'sin x + 1', PU, 15, 'start')
add('6.2', 'BANDING GRAF', 'Kesan b dan c pada graf',
    TABLE(['Fungsi', 'Amplitud', 'Kala', 'Maks', 'Min'],
          [['y = sin x', '1', '360°', '1', '−1'], ['y = sin 2x', '1', '180°', '1', '−1'], ['y = sin x + 1', '1', '360°', '2', '0'], ['y = 3 sin ½x', '3', '720°', '3', '−3']], col, rv=True)
    + NOTE('<i>b</i> bertambah → kala <b>berkurang</b> (graf dimampatkan secara mengufuk). <i>c</i> tidak mengubah amplitud atau kala.'),
    svg(fig, 'Graf y sama dengan sin x, sin 2x dan sin x tambah 1'))

# 6.2-7 Kesilapan
fig = ''
CASES = [(60, 'y = 3 sin 2x: kala = 360° × 2 = 720°', False), (126, 'kala = 360° ÷ 2 = 180°', True),
         (210, 'y = −2 kos x: amplitud = −2', False), (276, 'amplitud = |−2| = 2', True),
         (360, 'y = sin x + 2: maksimum = 1', False), (426, 'maksimum = 1 + 2 = 3', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 18, 'start')
add('6.2', 'KESILAPAN BIASA', 'Amplitud, kala dan nilai maksimum',
    BUL([f'{B("Kala didarab", RD)}: kala = 360° <b>dibahagi</b> dengan <i>b</i>.',
         f'{B("Amplitud negatif", RD)}: amplitud sentiasa positif, iaitu |<i>a</i>|.',
         f'{B("Lupa c", RD)}: nilai maksimum dan minimum dianjak sebanyak <i>c</i>.'], col)
    + NOTE('Amplitud = |a| · Kala = 360° ÷ b · Maks = |a| + c · Min = −|a| + c', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi amplitud, kala dan nilai maksimum'))

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
assert counts == {'6.1': 7, '6.2': 7}, counts
js = ('/* Dijana oleh tools/trigograf/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
