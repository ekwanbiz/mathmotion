# Penjana slaid NOTA KUADRATIK (Tingkatan 4 Bab 1 Fungsi dan Persamaan Kuadratik dalam Satu Pemboleh Ubah)
#   -> kuadratik/slides.js
# Jalankan:  python3 tools/kuadratik/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'kuadratik', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# KSSM bab ini hanya ada SK 1.1 (SP 1.1.1 - 1.1.8). Subtopik app = kumpulan Standard Pembelajaran:
# 1.1.1 (+1.1.2) · 1.1.3 · 1.1.4 (+1.1.5) · 1.1.6 (+1.1.7, 1.1.8)
SUB = {
    '1.1.1': ('Ungkapan dan Fungsi Kuadratik', TR),
    '1.1.3': ('Kesan Perubahan a, b dan c', PU),
    '1.1.4': ('Persamaan Kuadratik dan Punca', GR),
    '1.1.6': ('Pemfaktoran, Lakaran Graf dan Penyelesaian Masalah', PA),
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

# ===================== 1.1.1 UNGKAPAN DAN FUNGSI KUADRATIK =====================
col = SUB['1.1.1'][1]

# 1.1.1-1 Ungkapan kuadratik
CONTOH = [('2x² + 3x − 5', True, 'kuasa tertinggi 2'), ('x² − 9', True, 'b = 0 boleh'),
          ('4x − 7', False, 'tiada sebutan x²'), ('x³ + 2x²', False, 'ada kuasa 3'),
          ('x² + 1/x', False, 'ada x pada penyebut'), ('x² + y + 1', False, 'dua pemboleh ubah')]
fig = T(250, 34, 'Ungkapan kuadratik atau bukan?', MU3, 20, halo=False)
for i, (e, ok, why) in enumerate(CONTOH):
    y = 88 + i * 64
    fig += RECT(24, y - 26, 452, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(52, y) if ok else CROSS(52, y))
    fig += T(80, y, e, GR if ok else RD, 21, 'start') + T(456, y, why, MU, 16, 'end', halo=False)
add('1.1.1', 'DEFINISI', 'Ungkapan kuadratik',
    DEF(f'<b>Ungkapan kuadratik</b> dalam satu pemboleh ubah ialah ungkapan berbentuk <b>{B("<i>a</i>", CA)}{X2} + {B("<i>b</i>", CB)}{X} + {B("<i>c</i>", CC)}</b>, dengan <i>a</i>, <i>b</i> dan <i>c</i> pemalar dan <b><i>a</i> ≠ 0</b>.', col)
    + BUL(['Ada <b>satu</b> pemboleh ubah sahaja.',
           'Kuasa <b>tertinggi</b> pemboleh ubah ialah <b>2</b>.',
           'Kuasa pemboleh ubah ialah nombor bulat (tiada punca kuasa atau pemboleh ubah pada penyebut).'], col)
    + NOTE('<i>b</i> atau <i>c</i> boleh bernilai 0, tetapi <i>a</i> tidak boleh 0.'),
    svg(fig, 'Contoh ungkapan kuadratik dan bukan ungkapan kuadratik'))

# 1.1.1-2 Kenal pasti a, b, c
EX = [(3, -5, 2), (-1, 0, 4), (F(1, 2), 6, 0)]
assert poly_txt(3, -5, 2) == '3x² − 5x + 2' and poly_txt(-1, 0, 4) == '−x² + 4'
fig = ''
for i, (e, a, b, c) in enumerate([('3x² − 5x + 2', '3', '−5', '2'), ('4 − x²', '−1', '0', '4'), ('6x + ½x²', '½', '6', '0')]):
    y0 = 18 + i * 148
    fig += RECT(18, y0, 464, 134, SURF, BD, 16, 2)
    fig += T(250, y0 + 34, e, TX, 26)
    for j, (lab, v, cl) in enumerate([('a', a, CA), ('b', b, CB), ('c', c, CC)]):
        x = 100 + j * 150
        fig += RECT(x - 58, y0 + 66, 116, 50, f'{NAV}', cl, 12, 2.5)
        fig += T(x, y0 + 92, f'{lab} = {v}', cl, 22, italic=False)
add('1.1.1', 'CONTOH BERLANGKAH', 'Mengenal pasti nilai a, b dan c',
    P(f'Bandingkan dengan bentuk {B("<i>a</i>", CA)}{X2} + {B("<i>b</i>", CB)}{X} + {B("<i>c</i>", CC)}. Susun sebutan dahulu jika perlu.', True)
    + STEPS([f'3{X2} − 5{X} + 2: {B("<i>a</i> = 3", CA)}, {B("<i>b</i> = −5", CB)}, {B("<i>c</i> = 2", CC)}',
             f'4 − {X2} = −{X2} + 0{X} + 4: {B("<i>a</i> = −1", CA)}, {B("<i>b</i> = 0", CB)}, {B("<i>c</i> = 4", CC)}',
             f'6{X} + {FR(1, 2)}{X2} = {FR(1, 2)}{X2} + 6{X}: {B("<i>a</i> = " + FR(1, 2), CA)}, {B("<i>b</i> = 6", CB)}, {B("<i>c</i> = 0", CC)}'], col)
    + NOTE('Tanda di hadapan sebutan ikut sekali: dalam 3<i>x</i>² − 5<i>x</i>, nilai <i>b</i> = −5, bukan 5.'),
    svg(fig, 'Nilai a, b dan c bagi tiga ungkapan kuadratik'))

# 1.1.1-3 Hubungan banyak kepada satu
f = quad(1, 0, 0)
dom = [-2, -1, 0, 1, 2]
assert [f(x) for x in dom] == [4, 1, 0, 1, 4]
fig = T(250, 30, 'f(x) = x²', AM, 24)
fig += f'<ellipse cx="120" cy="250" rx="80" ry="170" fill="{SURF}" stroke="{TR}" stroke-width="3"/>'
fig += f'<ellipse cx="380" cy="250" rx="80" ry="130" fill="{SURF}" stroke="{PK}" stroke-width="3"/>'
fig += T(120, 446, 'x', TR, 20, italic=True) + T(380, 446, 'f(x)', PK, 20, italic=True)
ys = {x: 120 + i * 65 for i, x in enumerate(dom)}
yo = {4: 170, 1: 250, 0: 330}
for x in dom:
    fig += ARROW((150, ys[x]), (348, yo[f(x)]), MU3, 2.5, 10)
for x in dom:
    fig += T(120, ys[x], fs(x), TX, 22)
for v, y in yo.items():
    fig += T(380, y, str(v), TX, 22)
add('1.1.1', 'KONSEP', 'Fungsi kuadratik: hubungan banyak kepada satu',
    DEF(f'<b>Fungsi kuadratik</b> ditulis sebagai {FX} = <i>a</i>{X2} + <i>b</i>{X} + <i>c</i>, dengan <i>a</i> ≠ 0. Ia ialah hubungan <b>banyak kepada satu</b>.', col)
    + BUL([f'Bagi {FX} = {X2}: <i>f</i>(−2) = 4 dan <i>f</i>(2) = 4.',
           'Dua nilai <i>x</i> yang berbeza boleh memberi nilai <i>f</i>(<i>x</i>) yang <b>sama</b>.',
           'Setiap nilai <i>x</i> mempunyai <b>satu</b> imej sahaja.'], col)
    + NOTE('Sebab itu graf fungsi kuadratik bersimetri: titik (−2, 4) dan (2, 4) berada pada aras yang sama.'),
    svg(fig, 'Gambar rajah anak panah f(x) = x²: −2 dan 2 dipetakan kepada 4'))

# 1.1.1-4 Bentuk graf
fig = ''
for i, (a, cl, nm, tip) in enumerate([(1, TR, 'a > 0', 'titik minimum'), (-1, PK, 'a < 0', 'titik maksimum')]):
    x0 = 14 + i * 242
    fig += RECT(x0, 14, 230, 442, SURF, BD, 16, 2)
    pl = Plane(-3, 3, -4, 4, (x0 + 16, 80, x0 + 214, 360))
    fig += LINE(pl.p(-3, 0), pl.p(3, 0), MU2, 2) + LINE(pl.p(0, -4), pl.p(0, 4), MU2, 2)
    fig += pl.curve(lambda x, a=a: a * (x * x - 2), cl, 5)
    vy = -2 * a
    fig += pl.pt(0, vy, '', VTX)
    fig += T(x0 + 115, 46, nm, cl, 26, italic=True)
    fig += T(x0 + 115, 396, 'bentuk ' + ('∪' if a > 0 else '∩'), TX, 20)
    fig += T(x0 + 115, 428, tip, VTX, 19)
add('1.1.1', 'KONSEP', 'Bentuk graf fungsi kuadratik',
    P(f'Graf fungsi kuadratik ialah lengkung licin yang dipanggil <b>parabola</b>. Bentuknya ditentukan oleh tanda <i>a</i>.', True)
    + TABLE(['Nilai <i>a</i>', 'Bentuk graf', 'Titik pusingan'],
            [[B('<i>a</i> &gt; 0', TR), '∪ (terbuka ke atas)', B('titik minimum', VTX)],
             [B('<i>a</i> &lt; 0', PK), '∩ (terbuka ke bawah)', B('titik maksimum', VTX)]], col, rv=True)
    + BUL(['Graf bersimetri pada satu garis mencancang, iaitu <b>paksi simetri</b>.',
           'Titik maksimum atau minimum terletak <b>pada</b> paksi simetri.'], col),
    svg(fig, 'Graf berbentuk ∪ apabila a > 0 dan berbentuk ∩ apabila a < 0'))

# 1.1.1-5 Paksi simetri & titik minimum
a, b, c = 1, -4, 3
h, k = vertex(a, b, c); assert (h, k) == (2, -1) and roots(a, b, c) == [1, 3]
pl = Plane(-2, 6, -2, 6)
fig = (pl.draw() + pl.vline(2) + pl.curve(quad(a, b, c), TR, 5)
       + pl.pt(2, -1, '(2, −1)', VTX, 14, 14, 'start', 19)
       + pl.pt(0, 3, '', CC) + pl.pt(4, 3, '', CC)
       + T(pl.X(2) + 8, pl.Y(5.6), 'x = 2', SYM, 19, 'start', italic=True)
       + LINE(pl.p(0, 3), pl.p(4, 3), MU3, 2, '5 6')
       + T(pl.X(4) + 12, pl.Y(3), '(4, 3)', CC, 17, 'start') + T(pl.X(0) + 12, pl.Y(3) - 16, '(0, 3)', CC, 17, 'start'))
add('1.1.1', 'CONTOH BERLANGKAH', 'Paksi simetri dan titik minimum',
    DEF(f'Paksi simetri graf {FX} = <i>a</i>{X2} + <i>b</i>{X} + <i>c</i> ialah {AXF}.', col)
    + P(f'Cari paksi simetri dan titik minimum bagi {FX} = {poly_html(a, b, c)}.', True)
    + STEPS([f'<i>a</i> = 1, <i>b</i> = −4 → {X} = −{FR("(−4)", "2(1)")} = 2',
             f'<i>f</i>(2) = 2² − 4(2) + 3 = −1',
             f'<i>a</i> = 1 &gt; 0, graf berbentuk ∪, jadi (2, −1) ialah titik minimum.'], col)
    + ANS(f'Paksi simetri {X} = 2; titik minimum (2, −1); nilai minimum −1'),
    svg(fig, 'Graf f(x) = x² − 4x + 3 dengan paksi simetri x = 2 dan titik minimum (2, −1)'))

# 1.1.1-6 Kesilapan biasa
assert vertex(-1, 6, -5) == (3, 4)
fig = ''
CASES = [(52, '4x³ − x² ialah ungkapan kuadratik', False), (122, 'Kuasa tertinggi 3: bukan kuadratik', True),
         (206, 'f(x) = 2x² − 8x: b = 8', False), (276, 'b = −8, paksi simetri x = 2', True),
         (360, 'Titik maksimum f(x) = −x² + 6x − 5 ialah 4', False), (430, 'Titik maksimum (3, 4); nilai maksimum 4', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 17, 'start')
add('1.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Kuasa tertinggi bukan 2", RD)}: <i>x</i>³ atau {FR(1, "<i>x</i>")} menjadikan ungkapan itu <b>bukan</b> kuadratik.',
         f'{B("Tertinggal tanda", RD)}: bagi 2{X2} − 8{X}, nilai <i>b</i> = −8, jadi {X} = −{FR("(−8)", "2(2)")} = 2.',
         f'{B("Titik vs nilai", RD)}: <b>titik</b> maksimum ialah koordinat (3, 4); <b>nilai</b> maksimum ialah 4.'], col)
    + NOTE('Graf berbentuk ∪ (<i>a</i> &gt; 0) ada titik <b>minimum</b>; ∩ (<i>a</i> &lt; 0) ada titik <b>maksimum</b>.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang ungkapan dan fungsi kuadratik'))

# ===================== 1.1.3 KESAN a, b, c =====================
col = SUB['1.1.3'][1]

# 1.1.3-1 Kesan nilai a (kelebaran)
pl = Plane(-4, 4, -1, 8)
LNS = [(F(1, 2), GR, 'y = ½x²'), (1, TR, 'y = x²'), (3, PK, 'y = 3x²')]
fig = pl.draw()
for a, cl, lab in LNS:
    fig += pl.curve(lambda x, a=a: float(a) * x * x, cl, 5)
fig += (T(pl.X(2.3), pl.Y(2.0), 'y = ½x²', GR, 18, 'start') + T(pl.X(2.3), pl.Y(1.3), 'y = x²', TR, 18, 'start')
        + T(pl.X(2.3), pl.Y(0.6), 'y = 3x²', PK, 18, 'start'))
add('1.1.3', 'KONSEP', 'Kesan nilai a: lebar atau sempit',
    P(f'Bandingkan graf <i>y</i> = {FR(1, 2)}{X2}, <i>y</i> = {X2} dan <i>y</i> = 3{X2}.', True)
    + BUL([f'Semakin <b>besar</b> nilai <i>a</i> (abaikan tanda), graf semakin <b>sempit</b>.',
           f'Semakin <b>kecil</b> nilai <i>a</i> (abaikan tanda), graf semakin <b>lebar</b>.',
           'Paksi simetri dan pintasan-<i>y</i> tidak berubah jika <i>b</i> dan <i>c</i> kekal.'], col)
    + NOTE('Contoh: graf <i>y</i> = −4<i>x</i>² lebih sempit daripada <i>y</i> = 2<i>x</i>² kerana 4 &gt; 2.'),
    svg(fig, 'Graf y = ½x², y = x² dan y = 3x²: semakin besar a, semakin sempit graf'))

# 1.1.3-2 Kesan tanda a
pl = Plane(-4, 4, -5, 5)
fig = pl.draw() + pl.curve(lambda x: x * x - 1, TR, 5) + pl.curve(lambda x: -x * x + 1, PK, 5)
fig += T(pl.X(2.45) + 8, pl.Y(4.2), 'y = x² − 1', TR, 19, 'start') + T(pl.X(2.45) + 8, pl.Y(-4.2), 'y = −x² + 1', PK, 19, 'start')
fig += pl.pt(0, -1, '', VTX) + pl.pt(0, 1, '', VTX)
fig += T(pl.X(0) - 12, pl.Y(-1) + 18, 'minimum', VTX, 16, 'end') + T(pl.X(0) - 12, pl.Y(1) - 18, 'maksimum', VTX, 16, 'end')
add('1.1.3', 'KONSEP', 'Kesan tanda a: bentuk graf',
    BUL([f'Jika <i>a</i> bertukar daripada <b>positif</b> kepada <b>negatif</b>, graf bertukar daripada bentuk ∪ kepada ∩.',
         'Titik minimum bertukar menjadi titik maksimum.',
         f'Graf <i>y</i> = −{X2} + 1 ialah <b>pantulan</b> graf <i>y</i> = {X2} − 1 pada paksi-<i>x</i>.'], col)
    + TABLE(['Fungsi', '<i>a</i>', 'Bentuk'],
            [[f'<i>y</i> = {X2} − 1', B('1', TR), '∪, titik minimum (0, −1)'],
             [f'<i>y</i> = −{X2} + 1', B('−1', PK), '∩, titik maksimum (0, 1)']], col, rv=True),
    svg(fig, 'Graf y = x² − 1 berbentuk ∪ dan graf y = −x² + 1 berbentuk ∩'))

# 1.1.3-3 Kesan nilai b
BS = [(2, TR), (0, GR), (-2, PK)]
for b, _ in BS:
    h, _k = vertex(1, b, 1); assert h == -F(b, 2)
pl = Plane(-4, 4, -1, 7)
fig = pl.draw()
for b, cl in BS:
    fig += pl.curve(quad(1, b, 1), cl, 5)
    h, k = vertex(1, b, 1)
    fig += LINE(pl.p(float(h), -1), pl.p(float(h), 7), cl, 2.5, '7 7') + pl.pt(float(h), float(k), '', cl)
fig += pl.pt(0, 1, '', CC)
fig += (T(pl.X(-1) - 6, pl.Y(-0.55) , 'x = −1', TR, 16, 'end') + T(pl.X(1) + 6, pl.Y(-0.55), 'x = 1', PK, 16, 'start')
        + T(pl.X(-3.9), pl.Y(6.6), 'b = 2', TR, 19, 'start') + T(pl.X(3.9), pl.Y(6.6), 'b = −2', PK, 19, 'end')
        + T(pl.X(0) + 8, pl.Y(5.9), 'b = 0', GR, 19, 'start'))
add('1.1.3', 'KONSEP', 'Kesan nilai b: kedudukan paksi simetri',
    P(f'Graf <i>y</i> = {X2} + <i>b</i>{X} + 1 bagi <i>b</i> = 2, 0, −2 (<i>a</i> dan <i>c</i> tetap).', True)
    + BUL([f'Perubahan <i>b</i> mengubah <b>kedudukan paksi simetri</b>, {AXF}.',
           f'{B("<i>a</i> dan <i>b</i> sama tanda", TR)}: paksi simetri di <b>kiri</b> paksi-<i>y</i>.',
           f'{B("<i>a</i> dan <i>b</i> berlainan tanda", PK)}: paksi simetri di <b>kanan</b> paksi-<i>y</i>.',
           f'{B("<i>b</i> = 0", GR)}: paksi simetri ialah paksi-<i>y</i> (<i>x</i> = 0).'], col)
    + NOTE('Bentuk graf dan pintasan-<i>y</i> (0, 1) kekal sama.'),
    svg(fig, 'Graf y = x² + bx + 1 bagi b = 2, 0 dan −2 dengan paksi simetri x = −1, 0 dan 1'))

# 1.1.3-4 Kesan nilai c
pl = Plane(-4, 4, -3, 7)
CS = [(3, TR), (0, GR), (-2, PK)]
fig = pl.draw()
for c, cl in CS:
    fig += pl.curve(quad(1, 0, c), cl, 5) + pl.pt(0, c, '', cl)
fig += (T(pl.X(0) + 14, pl.Y(3) + 2, '(0, 3)', TR, 17, 'start') + T(pl.X(0) + 14, pl.Y(0) + 16, '(0, 0)', GR, 17, 'start')
        + T(pl.X(0) + 14, pl.Y(-2) + 4, '(0, −2)', PK, 17, 'start')
        + T(pl.X(-3.9), pl.Y(6.5), 'c = 3', TR, 19, 'start') + T(pl.X(3.9), pl.Y(6.5), 'c = −2', PK, 19, 'end'))
add('1.1.3', 'KONSEP', 'Kesan nilai c: pintasan-y',
    P(f'Graf <i>y</i> = {X2} + <i>c</i> bagi <i>c</i> = 3, 0, −2.', True)
    + BUL([f'Nilai <i>c</i> ialah <b>pintasan-<i>y</i></b>: graf memotong paksi-<i>y</i> di (0, <i>c</i>).',
           'Jika <i>c</i> bertambah, graf bergerak <b>ke atas</b>; jika <i>c</i> berkurang, graf bergerak <b>ke bawah</b>.',
           'Bentuk, kelebaran dan paksi simetri tidak berubah.'], col)
    + NOTE(f'Bagi {FX} = <i>a</i>{X2} + <i>b</i>{X} + <i>c</i>: <i>f</i>(0) = <i>c</i>.'),
    svg(fig, 'Graf y = x² + c bagi c = 3, 0 dan −2 memotong paksi-y pada (0, c)'))

# 1.1.3-5 Contoh berlangkah
a, b, c1, c2 = 1, -4, 3, -5
assert vertex(a, b, c1) == (2, -1) and vertex(a, b, c2) == (2, -9) and roots(a, b, c2) == [-1, 5]
pl = Plane(-2, 6, -10, 6, (40, 22, 470, 448), same=False)
fig = pl.draw(ystep=2) + pl.vline(2) + pl.curve(quad(a, b, c1), TR, 5) + pl.curve(quad(a, b, c2), PK, 5)
fig += pl.pt(0, 3, '', TR) + pl.pt(0, -5, '', PK) + pl.pt(2, -1, '', VTX) + pl.pt(2, -9, '', VTX)
fig += T(pl.X(0) - 10, pl.Y(3), '3', TR, 18, 'end') + T(pl.X(0) - 10, pl.Y(-5) + 2, '−5', PK, 18, 'end')
fig += T(pl.X(5.3), pl.Y(5.4), 'f', TR, 22, italic=True) + T(pl.X(-1.6) - 12, pl.Y(3.96), 'g', PK, 22, 'end', italic=True)
fig += ARROW(pl.p(3.1, -1.2), pl.p(3.1, -8.4), MU3, 3, 11) + T(pl.X(3.25), pl.Y(-4.8), '8 unit', MU3, 17, 'start')
add('1.1.3', 'CONTOH BERLANGKAH', 'Menghuraikan perubahan graf',
    P(f'Graf <i>f</i>(<i>x</i>) = {poly_html(a, b, c1)} berubah menjadi <i>g</i>(<i>x</i>) = {poly_html(a, b, c2)}. Huraikan perubahan itu.', True)
    + STEPS(['Hanya <i>c</i> berubah: 3 → −5, berkurang 8.',
             'Pintasan-<i>y</i> berubah daripada 3 kepada −5; graf bergerak 8 unit ke bawah.',
             f'<i>a</i> dan <i>b</i> sama, jadi bentuk dan paksi simetri {X} = 2 kekal. Titik minimum (2, −1) → (2, −9).'], col)
    + ANS('Graf bergerak 8 unit ke bawah; bentuk dan paksi simetri tidak berubah'),
    svg(fig, 'Graf f(x) = x² − 4x + 3 dan g(x) = x² − 4x − 5: g ialah f yang bergerak 8 unit ke bawah'))

# 1.1.3-6 Ringkasan
fig = ''
ROWS = [('a', CA, 'bentuk ∪ / ∩ dan kelebaran'), ('b', CB, 'kedudukan paksi simetri'), ('c', CC, 'pintasan-y (naik / turun)')]
for i, (v, cl, t) in enumerate(ROWS):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, BD, 16, 2)
    pl = Plane(-2.5, 2.5, -1.5, 3.5, (30, y0 + 12, 150, y0 + 126))
    fig += LINE(pl.p(-2.5, 0), pl.p(2.5, 0), MU2, 2) + LINE(pl.p(0, -1.5), pl.p(0, 3.5), MU2, 2)
    if v == 'a':
        fig += pl.curve(lambda x: 2 * x * x - 1, cl, 4) + pl.curve(lambda x: 0.4 * x * x - 1, MU3, 3, '6 5')
    elif v == 'b':
        fig += pl.curve(lambda x: (x + 1) ** 2 - 0.5, cl, 4) + pl.curve(lambda x: (x - 1) ** 2 - 0.5, MU3, 3, '6 5')
    else:
        fig += pl.curve(lambda x: x * x + 1.2, cl, 4) + pl.curve(lambda x: x * x - 1, MU3, 3, '6 5')
    fig += T(176, y0 + 50, f'Ubah {v}', cl, 26, 'start', italic=False) + T(176, y0 + 94, t, TX, 19, 'start')
add('1.1.3', 'RINGKASAN', 'Kesan a, b dan c',
    TABLE(['Pekali', 'Kesan pada graf <i>f</i>(<i>x</i>) = <i>a</i><i>x</i>² + <i>b</i><i>x</i> + <i>c</i>'],
          [[B('<i>a</i>', CA), 'Tanda: bentuk ∪ (<i>a</i> &gt; 0) atau ∩ (<i>a</i> &lt; 0). Nilai besar: graf sempit.'],
           [B('<i>b</i>', CB), f'Kedudukan paksi simetri, {AXF}.'],
           [B('<i>c</i>', CC), 'Pintasan-<i>y</i>; graf bergerak ke atas atau ke bawah.']], col, rv=True)
    + NOTE('Ubah <b>satu</b> pekali sahaja pada satu masa untuk melihat kesannya. Cuba di TEROKA: <b>Main a, b, c</b>.', 'Tip:'),
    svg(fig, 'Ringkasan kesan perubahan a, b dan c pada graf'))

# ===================== 1.1.4 PERSAMAAN KUADRATIK DAN PUNCA =====================
col = SUB['1.1.4'][1]

# 1.1.4-1 Membentuk fungsi daripada situasi
assert all(x * (x + 5) == x * x + 5 * x for x in range(-5, 6))
fig = (RECT(90, 120, 320, 200, f'{GR}26', GR, 4, 4)
       + T(250, 220, 'L = x(x + 5)', GR, 26)
       + ARROW((96, 346), (404, 346), PA, 3, 10) + ARROW((404, 346), (96, 346), PA, 3, 10)
       + T(250, 374, '(x + 5) cm', PA, 22)
       + ARROW((436, 126), (436, 314), TR, 3, 10) + ARROW((436, 314), (436, 126), TR, 3, 10)
       + T(450, 220, 'x cm', TR, 22, 'start')
       + T(250, 60, 'Panjang 5 cm lebih daripada lebar', MU3, 19, halo=False)
       + RECT(60, 404, 380, 50, SURF, BD, 14, 2) + T(250, 429, 'L(x) = x² + 5x', AM, 24))
add('1.1.4', 'CONTOH BERLANGKAH', 'Membentuk fungsi kuadratik',
    P('Panjang sebuah segi empat tepat ialah 5 cm lebih daripada lebarnya. Bentukkan fungsi bagi luas, <i>L</i>, segi empat tepat itu.', True)
    + STEPS([f'Katakan lebar = {X} cm, maka panjang = ({X} + 5) cm.',
             f'Luas = panjang × lebar → <i>L</i>({X}) = {X}({X} + 5)',
             f'Kembangkan: <i>L</i>({X}) = {X2} + 5{X}'], col)
    + ANS(f'<i>L</i>({X}) = {X2} + 5{X}')
    + NOTE('Pilih pemboleh ubah untuk kuantiti yang tidak diketahui dan nyatakan unitnya.'),
    svg(fig, 'Segi empat tepat dengan lebar x cm dan panjang (x + 5) cm'))

# 1.1.4-2 Persamaan kuadratik bentuk am
assert all(x * (x + 5) - 24 == x * x + 5 * x - 24 for x in range(-9, 9))
assert all((2 * x * x - (3 * x + 5)) == 2 * x * x - 3 * x - 5 for x in range(-5, 6))
assert all((x - 1) ** 2 - 9 == x * x - 2 * x - 8 for x in range(-5, 6))
fig = T(250, 36, 'Tukar kepada bentuk am', MU3, 20, halo=False)
for i, (q, r) in enumerate([('x(x + 5) = 24', 'x² + 5x − 24 = 0'), ('2x² = 3x + 5', '2x² − 3x − 5 = 0'), ('(x − 1)² = 9', 'x² − 2x − 8 = 0')]):
    y0 = 70 + i * 132
    fig += RECT(20, y0, 460, 110, SURF, BD, 16, 2)
    fig += T(250, y0 + 30, q, TX, 23) + ARROW((250, y0 + 48), (250, y0 + 68), MU3, 3, 8) + T(250, y0 + 88, r, AM, 24)
add('1.1.4', 'DEFINISI', 'Persamaan kuadratik',
    DEF(f'<b>Persamaan kuadratik</b> ialah persamaan yang boleh ditulis dalam <b>bentuk am</b> <i>a</i>{X2} + <i>b</i>{X} + <i>c</i> = 0, dengan <i>a</i> ≠ 0.', col)
    + P(f'Jika luas segi empat tepat tadi ialah 24 cm², maka <i>L</i>({X}) = 24 memberi persamaan kuadratik:', True)
    + STEPS([f'{X2} + 5{X} = 24', f'{X2} + 5{X} − 24 = 0 (bawa semua sebutan ke sebelah kiri)'], col)
    + NOTE('Fungsi kuadratik <i>f</i>(<i>x</i>) ialah satu hubungan; persamaan kuadratik <i>f</i>(<i>x</i>) = 0 mencari nilai <i>x</i> tertentu.'),
    svg(fig, 'Tiga persamaan ditukar kepada bentuk am'))

# 1.1.4-3 Maksud punca
a, b, c = 1, -2, -3
assert roots(a, b, c) == [-1, 3] and vertex(a, b, c) == (1, -4)
pl = Plane(-3, 5, -5, 4)
fig = pl.draw() + pl.curve(quad(a, b, c), TR, 5)
fig += pl.pt(-1, 0, '', ROOT) + pl.pt(3, 0, '', ROOT)
fig += T(pl.X(-1) - 6, pl.Y(0) + 40, 'x = −1', ROOT, 19, 'end') + T(pl.X(3) + 6, pl.Y(0) + 40, 'x = 3', ROOT, 19, 'start')
fig += T(pl.X(1), pl.Y(3.4), 'y = x² − 2x − 3', TR, 20)
add('1.1.4', 'DEFINISI', 'Maksud punca persamaan kuadratik',
    DEF(f'<b>Punca</b> persamaan kuadratik ialah nilai {X} yang <b>memuaskan</b> persamaan itu, iaitu menjadikan <i>a</i>{X2} + <i>b</i>{X} + <i>c</i> = 0.', col)
    + BUL([f'Secara graf, punca ialah <b>pintasan-<i>x</i></b> graf <i>y</i> = <i>a</i>{X2} + <i>b</i>{X} + <i>c</i>.',
           f'Punca bagi {X2} − 2{X} − 3 = 0 ialah {B("−1", ROOT)} dan {B("3", ROOT)}.',
           'Persamaan kuadratik mempunyai paling banyak <b>dua</b> punca.'], col)
    + NOTE('Graf yang hanya menyentuh paksi-<i>x</i> memberi dua punca yang sama; graf yang tidak menyilang paksi-<i>x</i> tiada punca nyata.'),
    svg(fig, 'Graf y = x² − 2x − 3 memotong paksi-x pada x = −1 dan x = 3'))

# 1.1.4-4 Menentusahkan punca
g = quad(1, 5, -24)
assert g(3) == 0 and g(-3) == -30 and g(-8) == 0
fig = ''
for i, (xv, calc, res, ok) in enumerate([('3', '3² + 5(3) − 24', '9 + 15 − 24 = 0', True),
                                          ('−3', '(−3)² + 5(−3) − 24', '9 − 15 − 24 = −30', False),
                                          ('−8', '(−8)² + 5(−8) − 24', '64 − 40 − 24 = 0', True)]):
    y0 = 16 + i * 150
    fig += RECT(16, y0, 468, 136, SURF, GR if ok else RD, 16, 2.5)
    fig += T(40, y0 + 30, f'x = {xv}', TX, 22, 'start') + T(40, y0 + 68, calc, MU3, 19, 'start')
    fig += T(40, y0 + 104, res, GR if ok else RD, 21, 'start')
    fig += (TICK(448, y0 + 30) if ok else CROSS(448, y0 + 30))
    fig += T(420, y0 + 104, 'punca' if ok else 'bukan punca', GR if ok else RD, 18, 'end')
add('1.1.4', 'CONTOH BERLANGKAH', 'Menentusahkan punca',
    P(f'Tentukan sama ada 3 dan −3 ialah punca bagi {X2} + 5{X} − 24 = 0.', True)
    + STEPS([f'Gantikan {X} = 3: 3² + 5(3) − 24 = 0 ✓, maka 3 ialah punca.',
             f'Gantikan {X} = −3: (−3)² + 5(−3) − 24 = −30 ≠ 0, maka −3 bukan punca.'], col)
    + ANS('3 ialah punca; −3 bukan punca')
    + NOTE('Kembali ke situasi segi empat tepat: lebar = 3 cm. Punca −8 ditolak kerana panjang tidak boleh negatif.'),
    svg(fig, 'Menggantikan x = 3, −3 dan −8 ke dalam x² + 5x − 24'))

# 1.1.4-5 Cari pemalar
kv = F(-(2 * 2 - 10), 2); assert kv == 3 and quad(1, 3, -10)(2) == 0 and roots(1, 3, -10) == [-5, 2]
pl = Plane(-6, 3, -13, 4, (40, 22, 470, 448), same=False)
fig = pl.draw(ystep=2) + pl.curve(quad(1, 3, -10), TR, 5) + pl.pt(2, 0, '', ROOT) + pl.pt(-5, 0, '', ROOT)
fig += T(pl.X(2) + 10, pl.Y(0) - 22, 'x = 2', ROOT, 19, 'start') + T(pl.X(-5) - 4, pl.Y(0) - 22, 'x = −5', ROOT, 19, 'end')
fig += T(pl.X(-1.5), pl.Y(2.6), 'y = x² + 3x − 10', TR, 20)
add('1.1.4', 'CONTOH BERLANGKAH', 'Mencari pemalar daripada punca',
    P(f'Diberi 2 ialah punca bagi persamaan {X2} + <i>k</i>{X} − 10 = 0. Cari nilai <i>k</i>.', True)
    + STEPS([f'Punca memuaskan persamaan, jadi gantikan {X} = 2:',
             '2² + <i>k</i>(2) − 10 = 0 → 4 + 2<i>k</i> − 10 = 0',
             '2<i>k</i> = 6 → <i>k</i> = 3'], col)
    + ANS('<i>k</i> = 3')
    + NOTE(f'{X2} + 3{X} − 10 = 0 mempunyai punca 2 dan −5.', 'Semak:'),
    svg(fig, 'Graf y = x² + 3x − 10 memotong paksi-x pada x = 2 dan x = −5'))

# 1.1.4-6 Kesilapan biasa
fig = ''
CASES = [(52, 'x² + 5x = 24 → a = 1, b = 5, c = 24', False), (122, 'Bentuk am dahulu: c = −24', True),
         (206, 'Punca ialah pintasan-y graf', False), (276, 'Punca ialah pintasan-x graf', True),
         (360, '−3 punca kerana 9 − 15 − 24 kecil', False), (430, 'Punca jika hasil gantian tepat 0', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 17, 'start')
add('1.1.4', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Tidak menyamakan dengan sifar", RD)}: tulis dalam bentuk <i>a</i>{X2} + <i>b</i>{X} + <i>c</i> = 0 dahulu sebelum membaca <i>c</i>.',
         f'{B("Punca bukan pintasan-<i>y</i>", RD)}: punca ialah nilai {X} apabila <i>y</i> = 0.',
         f'{B("Lupa menyemak situasi", RD)}: panjang, masa dan luas tidak boleh negatif.'], col)
    + NOTE('Gantikan punca ke dalam persamaan asal untuk menyemak jawapan.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang persamaan kuadratik dan punca'))

# ===================== 1.1.6 PEMFAKTORAN, LAKARAN GRAF, MASALAH =====================
col = SUB['1.1.6'][1]

# 1.1.6-1 Pemfaktoran asas
assert roots(1, -5, 6) == [2, 3] and all((x - 2) * (x - 3) == x * x - 5 * x + 6 for x in range(-5, 6))
fig = (RECT(16, 16, 468, 438, SURF, BD, 18, 2)
       + T(250, 62, 'x² − 5x + 6 = 0', TX, 28)
       + T(250, 112, 'Cari dua nombor:', MU3, 19, halo=False)
       + T(250, 146, 'hasil darab = +6, hasil tambah = −5', MU3, 19, halo=False)
       + RECT(150, 172, 200, 52, NAV, AM, 12, 2.5) + T(250, 198, '−2 dan −3', AM, 24)
       + T(250, 264, '(x − 2)(x − 3) = 0', TX, 26)
       + LINE((140, 290), (110, 330), MU3, 3) + LINE((360, 290), (390, 330), MU3, 3)
       + T(110, 356, 'x − 2 = 0', PK, 22) + T(390, 356, 'x − 3 = 0', PK, 22)
       + T(110, 410, 'x = 2', PK, 26) + T(390, 410, 'x = 3', PK, 26))
add('1.1.6', 'CONTOH BERLANGKAH', 'Menyelesaikan dengan pemfaktoran',
    P(f'Selesaikan {X2} − 5{X} + 6 = 0.', True)
    + STEPS([f'Pastikan persamaan dalam bentuk am (sebelah kanan = 0).',
             f'Faktorkan: ({X} − 2)({X} − 3) = 0',
             f'Jika hasil darab dua faktor ialah 0, salah satu faktor mesti 0: {X} − 2 = 0 atau {X} − 3 = 0.'], col)
    + ANS(f'{X} = 2 atau {X} = 3')
    + NOTE(f'Semak: 2² − 5(2) + 6 = 0 ✓ dan 3² − 5(3) + 6 = 0 ✓'),
    svg(fig, 'Langkah memfaktorkan x² − 5x + 6 = 0 kepada (x − 2)(x − 3) = 0'))

# 1.1.6-2 Faktor sepunya & beza kuasa dua
assert roots(2, -6, 0) == [0, 3] and roots(1, 0, -16) == [-4, 4]
fig = ''
for i, (t, steps, ans, cl) in enumerate([('Faktor sepunya', ['2x² − 6x = 0', '2x(x − 3) = 0'], 'x = 0 atau x = 3', TR),
                                         ('Beza kuasa dua', ['x² − 16 = 0', '(x − 4)(x + 4) = 0'], 'x = 4 atau x = −4', PU)]):
    y0 = 16 + i * 224
    fig += RECT(16, y0, 468, 208, SURF, cl, 18, 2.5)
    fig += T(40, y0 + 32, t, cl, 21, 'start')
    fig += T(250, y0 + 78, steps[0], TX, 24) + T(250, y0 + 122, steps[1], TX, 24) + T(250, y0 + 172, ans, AM, 24)
add('1.1.6', 'CONTOH BERLANGKAH', 'Faktor sepunya dan beza kuasa dua',
    P(f'(a) Selesaikan 2{X2} − 6{X} = 0. &nbsp; (b) Selesaikan {X2} − 16 = 0.', True)
    + STEPS([f'(a) Faktor sepunya 2{X}: 2{X}({X} − 3) = 0 → 2{X} = 0 atau {X} − 3 = 0',
             f'(b) <i>a</i>² − <i>b</i>² = (<i>a</i> − <i>b</i>)(<i>a</i> + <i>b</i>): ({X} − 4)({X} + 4) = 0'], col)
    + ANS(f'(a) {X} = 0 atau {X} = 3 &nbsp; (b) {X} = 4 atau {X} = −4')
    + NOTE(f'Jangan bahagi kedua-dua belah dengan {X}: punca {X} = 0 akan hilang.'),
    svg(fig, 'Penyelesaian 2x² − 6x = 0 dan x² − 16 = 0'))

# 1.1.6-3 a ≠ 1 dan susun semula
assert roots(2, 1, -6) == [-2, F(3, 2)] and all((2 * x - 3) * (x + 2) == 2 * x * x + x - 6 for x in range(-5, 6))
assert 2 * F(3, 2) ** 2 + F(3, 2) == 6
fig = (RECT(16, 16, 468, 438, SURF, BD, 18, 2)
       + T(250, 56, '2x² + x = 6', TX, 26) + T(250, 100, '2x² + x − 6 = 0', AM, 26)
       + T(250, 140, 'Kaedah silang', MU3, 18, halo=False)
       + T(160, 186, '2x', TX, 24) + T(340, 186, '−3', TX, 24)
       + T(160, 246, 'x', TX, 24) + T(340, 246, '+2', TX, 24)
       + LINE((192, 194), (308, 240), MU3, 2.5) + LINE((192, 240), (308, 194), MU3, 2.5)
       + T(250, 288, '(2x)(+2) + (x)(−3) = 4x − 3x = x ✓', GR, 18)
       + T(250, 340, '(2x − 3)(x + 2) = 0', TX, 26)
       + T(250, 400, 'x = 3/2 atau x = −2', PK, 26))
add('1.1.6', 'CONTOH BERLANGKAH', 'Apabila a ≠ 1',
    P(f'Selesaikan 2{X2} + {X} = 6.', True)
    + STEPS([f'Bentuk am: 2{X2} + {X} − 6 = 0',
             f'Faktorkan (kaedah silang): (2{X} − 3)({X} + 2) = 0',
             f'2{X} − 3 = 0 → {X} = {FR(3, 2)} &nbsp;atau&nbsp; {X} + 2 = 0 → {X} = −2'], col)
    + ANS(f'{X} = {FR(3, 2)} atau {X} = −2')
    + NOTE(f'Semak: 2({FR(3, 2)})² + {FR(3, 2)} = {FR(9, 2)} + {FR(3, 2)} = 6 ✓'),
    svg(fig, 'Kaedah silang untuk memfaktorkan 2x² + x − 6'))

# 1.1.6-4 Melakar graf
a, b, c = 1, -2, -8
assert roots(a, b, c) == [-2, 4] and vertex(a, b, c) == (1, -9) and (F(-2) + 4) / 2 == 1
pl = Plane(-4, 6, -11, 8, (40, 22, 470, 448), same=False)
fig = pl.draw(ystep=2, nums=False, grid=False)
fig += pl.vline(1) + pl.curve(quad(a, b, c), TR, 5)
fig += pl.pt(-2, 0, '', ROOT) + pl.pt(4, 0, '', ROOT) + pl.pt(0, -8, '', CC) + pl.pt(1, -9, '', VTX)
fig += (T(pl.X(-2) - 6, pl.Y(0) - 20, '−2', ROOT, 19, 'end') + T(pl.X(4) + 6, pl.Y(0) - 20, '4', ROOT, 19, 'start')
        + T(pl.X(0) - 14, pl.Y(-8) + 14, '−8', CC, 19, 'end') + T(pl.X(1) + 14, pl.Y(-9) + 16, '(1, −9)', VTX, 19, 'start')
        + T(pl.X(1) + 8, pl.Y(7.4), 'x = 1', SYM, 18, 'start', italic=True)
        + T(pl.X(0) - 10, pl.Y(0) + 16, 'O', MU2, 16, 'end'))
add('1.1.6', 'LAKARAN GRAF', 'Melakar graf fungsi kuadratik',
    P(f'Lakar graf {FX} = {poly_html(a, b, c)}.', True)
    + STEPS([f'<i>a</i> = 1 &gt; 0 → bentuk ∪; pintasan-<i>y</i> = {B("−8", CC)}',
             f'{X2} − 2{X} − 8 = 0 → ({X} + 2)({X} − 4) = 0 → pintasan-<i>x</i>: {B("−2", ROOT)}, {B("4", ROOT)}',
             f'Paksi simetri di tengah-tengah punca: {X} = {FR("−2 + 4", 2)} = 1',
             f'<i>f</i>(1) = 1 − 2 − 8 = −9 → titik minimum {B("(1, −9)", VTX)}'], col)
    + NOTE('Lakaran tidak perlu berskala, tetapi bentuk dan semua titik penting mesti dilabel.'),
    svg(fig, 'Lakaran graf f(x) = x² − 2x − 8 dengan pintasan dan titik minimum (1, −9)'))

# 1.1.6-5 Masalah: luas
assert roots(1, 3, -40) == [-8, 5] and 5 * 8 == 40
fig = (RECT(80, 100, 300, 190, f'{GR}26', GR, 4, 4) + T(230, 196, '40 m²', GR, 28)
       + ARROW((86, 316), (374, 316), PA, 3, 10) + ARROW((374, 316), (86, 316), PA, 3, 10) + T(230, 342, '(x + 3) m', PA, 22)
       + ARROW((406, 106), (406, 284), TR, 3, 10) + ARROW((406, 284), (406, 106), TR, 3, 10) + T(420, 196, 'x m', TR, 22, 'start')
       + T(250, 50, 'Taman sayur berbentuk segi empat tepat', MU3, 18, halo=False)
       + RECT(40, 380, 420, 70, SURF, BD, 14, 2) + T(250, 404, 'x = 5 ✓   x = −8 ✗', AM, 22)
       + T(250, 432, 'lebar tidak boleh negatif', MU, 16, halo=False))
add('1.1.6', 'PENYELESAIAN MASALAH', 'Taman sayur sekolah',
    P('Panjang sebuah taman sayur 3 m lebih daripada lebarnya. Luas taman itu ialah 40 m². Cari ukuran taman itu.', True)
    + STEPS([f'Katakan lebar = {X} m: {X}({X} + 3) = 40',
             f'{X2} + 3{X} − 40 = 0 → ({X} + 8)({X} − 5) = 0',
             f'{X} = 5 atau {X} = −8 (ditolak kerana lebar mesti positif)'], col)
    + ANS('Lebar = 5 m, panjang = 8 m')
    + NOTE('Semak: 5 × 8 = 40 m² ✓'),
    svg(fig, 'Taman segi empat tepat dengan lebar x m, panjang (x + 3) m dan luas 40 m²'))

# 1.1.6-6 Masalah: lontaran bola
hb = lambda t: -5 * t * t + 20 * t
assert roots(1, -4, 3) == [1, 3] and hb(1) == 15 and hb(3) == 15 and hb(2) == 20 and roots(-5, 20, 0) == [0, 4]
pl = Plane(0, 4.5, 0, 22, (60, 30, 470, 410), same=False)
fig = ''
for i in range(0, 5):
    fig += LINE(pl.p(i, 0), pl.p(i, 22), GRID, 1.5, cap='butt') + T(pl.X(i), pl.Y(0) + 16, str(i), MU2, 15, weight=600)
for j in range(0, 23, 5):
    fig += LINE(pl.p(0, j), pl.p(4.5, j), GRID, 1.5, cap='butt') + T(pl.X(0) - 9, pl.Y(j), str(j), MU2, 15, 'end', weight=600)
fig += LINE(pl.p(0, 0), pl.p(4.6, 0), MU, 2.5) + LINE(pl.p(0, 0), pl.p(0, 22.5), MU, 2.5)
fig += T(pl.X(4.5), pl.Y(0) + 40, 't (saat)', MU, 17, 'end') + T(pl.X(0) + 8, pl.Y(22) - 2, 'h (m)', MU, 17, 'start')
fig += LINE(pl.p(0, 15), pl.p(4.5, 15), PK, 2.5, '7 6') + pl.curve(hb, TR, 5, lo=0, hi=4)
fig += pl.pt(1, 15, '', PK) + pl.pt(3, 15, '', PK) + pl.pt(2, 20, '', VTX)
fig += T(pl.X(1) - 8, pl.Y(15) - 18, 't = 1', PK, 17, 'end') + T(pl.X(3) + 8, pl.Y(15) - 18, 't = 3', PK, 17, 'start')
fig += T(pl.X(2), pl.Y(20) - 20, '(2, 20)', VTX, 18)
add('1.1.6', 'PENYELESAIAN MASALAH', 'Lontaran bola',
    P('Tinggi sebiji bola, <i>h</i> m, selepas <i>t</i> saat diberi oleh <i>h</i>(<i>t</i>) = −5<i>t</i>² + 20<i>t</i>. Bilakah bola berada 15 m dari tanah?', True)
    + STEPS(['−5<i>t</i>² + 20<i>t</i> = 15 → −5<i>t</i>² + 20<i>t</i> − 15 = 0',
             'Bahagi dengan −5: <i>t</i>² − 4<i>t</i> + 3 = 0 → (<i>t</i> − 1)(<i>t</i> − 3) = 0',
             '<i>t</i> = 1 (bola naik) atau <i>t</i> = 3 (bola turun)'], col)
    + ANS('Selepas 1 saat dan selepas 3 saat')
    + NOTE('Tinggi maksimum pada paksi simetri <i>t</i> = 2: <i>h</i>(2) = −20 + 40 = 20 m.', 'Lanjutan:'),
    svg(fig, 'Graf h(t) = −5t² + 20t dengan tinggi 15 m pada t = 1 dan t = 3, maksimum 20 m pada t = 2'))

# 1.1.6-7 Kesilapan biasa
assert roots(1, -3, 0) == [0, 3] and roots(1, -5, 0) == [0, 5]
fig = ''
CASES = [(52, 'x² = 3x → x = 3 sahaja', False), (122, 'x² − 3x = 0 → x(x − 3) = 0 → x = 0, 3', True),
         (206, '(x − 2)(x − 3) = 6 → x − 2 = 6', False), (276, 'Kembangkan dahulu: x² − 5x = 0', True),
         (360, 'Panjang = −8 m diterima', False), (430, 'Tolak punca yang tidak munasabah', True)]
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 17, 'start')
add('1.1.6', 'KESILAPAN BIASA', 'Semak penyelesaian anda',
    BUL([f'{B("Membahagi dengan " + X, RD)}: punca {X} = 0 hilang. Faktorkan sebagai {X}({X} − 3) = 0.',
         f'{B("Sebelah kanan bukan 0", RD)}: sifat “hasil darab = 0” hanya berlaku jika sebelah kanan ialah <b>0</b>.',
         f'{B("Tidak menyemak konteks", RD)}: tolak nilai negatif bagi panjang, luas atau masa.'], col)
    + NOTE('Bentuk am → faktorkan → setiap faktor = 0 → semak dengan gantian dan konteks.', 'Ringkasan:'),
    svg(fig, 'Contoh kesilapan dan pembetulan semasa menyelesaikan persamaan kuadratik'))

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
assert counts == {'1.1.1': 6, '1.1.3': 6, '1.1.4': 6, '1.1.6': 7}, counts

js = ('/* Dijana oleh tools/kuadratik/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
