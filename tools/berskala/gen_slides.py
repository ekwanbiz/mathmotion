# Penjana slaid NOTA BERSKALA (Tingkatan 3 Bab 4 Lukisan Berskala) -> berskala/slides.js
# Jalankan:  python3 tools/berskala/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'berskala', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 4.1 Lukisan Berskala, jadi subtopik app = Standard Pembelajaran 4.1.1 - 4.1.4
SUB = {
    '4.1.1': ('Maksud Lukisan Berskala', C['tr']),
    '4.1.2': ('Mentafsir Skala', C['am']),
    '4.1.3': ('Melukis Lukisan Berskala', C['gr']),
    '4.1.4': ('Penyelesaian Masalah', C['pk']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
OBJ, LUK = TR, AM     # warna tetap: objek / ukuran sebenar (biru), lukisan (kuning)

# ---------- nombor ----------
def num(x):
    """Nombor kemas: Fraction/float -> teks; ribuan dipisah ruang (>= 10 000); tolak sebenar."""
    if isinstance(x, F) and x.denominator != 1:
        x = float(x)
    if isinstance(x, float):
        assert abs(x * 1000 - round(x * 1000)) < 1e-9, x
        x = round(x, 3)
        if x == int(x): x = int(x)
    s = str(abs(x))
    if '.' not in s and abs(x) >= 10000:
        s = f'{abs(x):,}'.replace(',', '&nbsp;')
    return ('−' if x < 0 else '') + s
def nfr(fr):
    """Fraction sebagai a/b (untuk skala 1 : 1/4)."""
    fr = F(fr)
    return num(fr.numerator) if fr.denominator == 1 else f'{fr.numerator}/{fr.denominator}'
def scale_of(draw_cm, real_cm):
    """Skala 1 : n daripada ukuran lukisan dan ukuran sebenar (unit sama)."""
    return F(real_cm) / F(draw_cm)

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
SK = lambda n: f'1 : {nfr(n)}'      # teks skala

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
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def ARROW(p, q, col, sw=3.5, head=12):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (q[0] - ux * head - uy * head * 0.6, q[1] - uy * head + ux * head * 0.6)
    b = (q[0] - ux * head + uy * head * 0.6, q[1] - uy * head - ux * head * 0.6)
    return (LINE(p, q, col, sw) +
            f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(q[0])} {r1(q[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')
def DIMLINE(p, q, col, lab, side=1, off=16, size=17, gap=0):
    """Garis ukuran dua hala selari dengan sisi p-q, diofset ke sisi 'side' (normal kiri = +1)."""
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    nx, ny = dy / L * side, -dx / L * side
    a = (p[0] + nx * off, p[1] + ny * off); b = (q[0] + nx * off, q[1] + ny * off)
    s = ARROW(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), a, col, 2.2, 8) + ARROW(((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), b, col, 2.2, 8)
    mx, my = (a[0] + b[0]) / 2 + nx * (14 + gap), (a[1] + b[1]) / 2 + ny * (14 + gap)
    anchor = 'middle'
    if abs(nx) > 0.7: anchor = 'start' if nx > 0 else 'end'; mx -= nx * 8
    return s + T(mx, my, lab, col, size, anchor)
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

class Grid:
    """Grid petak: kiri-atas (x, y) piksel, cols x rows petak, saiz petak 'cell' piksel. Koordinat grid: (i, j), j ke bawah."""
    def __init__(self, x, y, cols, rows, cell):
        self.x, self.y, self.cols, self.rows, self.c = x, y, cols, rows, cell
    def p(self, i, j): return (float(self.x + i * self.c), float(self.y + j * self.c))
    def draw(self, col=DIM, sw=1.4, frame=True):
        s = ''
        for i in range(self.cols + 1):
            s += LINE(self.p(i, 0), self.p(i, self.rows), col, sw, cap='butt')
        for j in range(self.rows + 1):
            s += LINE(self.p(0, j), self.p(self.cols, j), col, sw, cap='butt')
        if frame:
            s += f'<rect x="{r1(self.x)}" y="{r1(self.y)}" width="{r1(self.cols * self.c)}" height="{r1(self.rows * self.c)}" fill="none" stroke="{MU2}" stroke-width="2"/>'
        return s
    def poly(self, pts, col, op='2E', sw=4, ox=0, oy=0):
        return POLY([self.p(i + ox, j + oy) for i, j in pts], f'{col}{op}', col, sw)
    def w(self): return self.cols * self.c
    def h(self): return self.rows * self.c

def scaled(pts, k):
    return [(F(i) * k, F(j) * k) for i, j in pts]
def sides(pts):
    out = []
    for a, b in zip(pts, pts[1:] + pts[:1]):
        out.append(math.hypot(b[0] - a[0], b[1] - a[1]))
    return out

# ---------- ikon objek ----------
def CAR(x, y, w, col=TR):
    """Kereta: kiri-bawah tayar pada (x, y), panjang w piksel."""
    h = w * 0.34; r = w * 0.09
    body = (f'<path d="M{r1(x)} {r1(y - r)} L{r1(x)} {r1(y - h * 0.62)} Q{r1(x + w * 0.04)} {r1(y - h * 0.72)} {r1(x + w * 0.18)} {r1(y - h * 0.72)} '
            f'L{r1(x + w * 0.3)} {r1(y - h)} L{r1(x + w * 0.7)} {r1(y - h)} L{r1(x + w * 0.84)} {r1(y - h * 0.72)} L{r1(x + w * 0.96)} {r1(y - h * 0.66)} '
            f'Q{r1(x + w)} {r1(y - h * 0.6)} {r1(x + w)} {r1(y - h * 0.45)} L{r1(x + w)} {r1(y - r)} Z" fill="{col}3A" stroke="{col}" stroke-width="3.5" stroke-linejoin="round"/>')
    win = (f'<path d="M{r1(x + w * 0.33)} {r1(y - h * 0.92)} L{r1(x + w * 0.48)} {r1(y - h * 0.92)} L{r1(x + w * 0.48)} {r1(y - h * 0.72)} L{r1(x + w * 0.24)} {r1(y - h * 0.72)} Z" fill="{MU3}55"/>'
           f'<path d="M{r1(x + w * 0.52)} {r1(y - h * 0.92)} L{r1(x + w * 0.68)} {r1(y - h * 0.92)} L{r1(x + w * 0.78)} {r1(y - h * 0.72)} L{r1(x + w * 0.52)} {r1(y - h * 0.72)} Z" fill="{MU3}55"/>')
    wh = ''.join(f'<circle cx="{r1(cx)}" cy="{r1(y - r)}" r="{r1(r)}" fill="{DIM}" stroke="{TX}" stroke-width="3"/>' for cx in (x + w * 0.22, x + w * 0.78))
    return body + win + wh
def ANT(cx, cy, s, col=PA):
    """Semut: pusat (cx, cy), panjang badan ~ 6s."""
    e = lambda x, rx, ry: f'<ellipse cx="{r1(cx + x * s)}" cy="{r1(cy)}" rx="{r1(rx * s)}" ry="{r1(ry * s)}" fill="{col}" stroke="{NAV}" stroke-width="2"/>'
    legs = ''
    for dx in (-0.4, 0, 0.4):
        for sg in (-1, 1):
            legs += LINE((cx + dx * s, cy), (cx + (dx * 2.4) * s, cy + sg * 1.5 * s), col, r1(max(2, s * 0.22)))
    ant = LINE((cx + 2.6 * s, cy - 0.3 * s), (cx + 3.4 * s, cy - 1.4 * s), col, r1(max(2, s * 0.18))) + LINE((cx + 2.6 * s, cy - 0.1 * s), (cx + 3.6 * s, cy - 0.7 * s), col, r1(max(2, s * 0.18)))
    return legs + ant + e(-2.0, 1.25, 0.9) + e(0, 0.8, 0.55) + e(1.9, 0.75, 0.65)

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    nb = lambda t: re.sub(r'>([^<]*)<', lambda m: '>' + re.sub(r'(\d) (\d{3})\b', r'\1&nbsp;\2', m.group(1)) + '<', t)
    body, fig = nb(body), nb(fig)
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 4.1.1 MAKSUD LUKISAN BERSKALA =====================
col = SUB['4.1.1'][1]

# 4.1.1-1 Definisi
HOUSE = [(0, 6), (0, 2), (2, 0), (4, 2), (4, 6)]
half = scaled(HOUSE, F(1, 2))
assert all(abs(a / 2 - b) < 1e-9 for a, b in zip(sides(HOUSE), sides(half)))
g1 = Grid(22, 92, 8, 8, 25); g2 = Grid(270, 92, 8, 8, 25)
fig = (T(122, 54, 'Objek', OBJ, 22) + T(370, 54, 'Lukisan berskala', LUK, 22)
       + g1.draw() + g2.draw()
       + g1.poly(HOUSE, OBJ, ox=2, oy=1) + g2.poly(half, LUK, ox=3, oy=3.5)
       + DIMLINE(g1.p(2, 7), g1.p(6, 7), OBJ, '4 cm', side=-1, off=14) + DIMLINE(g1.p(6, 7), g1.p(6, 3), OBJ, '4 cm', side=-1, off=14)
       + DIMLINE(g2.p(3, 5.5), g2.p(5, 5.5), LUK, '2 cm', side=-1, off=14) + DIMLINE(g2.p(5, 5.5), g2.p(5, 4.5), LUK, '2 cm', side=-1, off=14)
       + ARROW((230, 192), (262, 192), MU, 3, 10)
       + T(250, 340, 'Setiap petak = 1 cm', MU, 17, halo=False)
       + T(250, 400, 'Semua ukuran lukisan = ½ × ukuran objek', MU3, 19, halo=False)
       + T(250, 432, 'Bentuk sama · sudut sama', MU, 17, halo=False))
assert sides(HOUSE)[0] == 4 and sides(half)[0] == 2
add('4.1.1', 'DEFINISI', 'Apa itu lukisan berskala?',
    DEF('<b>Lukisan berskala</b> ialah lukisan suatu objek dengan ukuran yang <b>dikecilkan</b>, <b>dibesarkan</b> atau <b>sama</b> dengan ukuran sebenar mengikut <b>nisbah tertentu</b>.', col)
    + BUL([f'{B("Bentuk", OBJ)} lukisan sama dengan bentuk objek, dan semua sudut tidak berubah.',
           f'Setiap ukuran {B("lukisan", LUK)} diperoleh dengan mendarab ukuran objek dengan <b>nombor yang sama</b>.'], col)
    + NOTE('Contoh lukisan berskala: pelan rumah, peta, model kereta dan lukisan serangga dalam buku sains.'),
    svg(fig, 'Objek berbentuk rumah pada grid dan lukisan berskalanya yang separuh saiz'))

# 4.1.1-2 Hubungan ukuran lukisan dengan ukuran objek
LO = [(0, 0), (9, 0), (9, 3), (3, 3), (3, 6), (0, 6)]
LD = scaled(LO, F(1, 3))
so, sd = sides(LO), sides(LD)
assert so == [9, 3, 6, 3, 3, 6] and all(abs(a / 3 - b) < 1e-9 for a, b in zip(so, sd))
g1 = Grid(60, 60, 11, 7, 22); g2 = Grid(310, 300, 5, 4, 22)
fig = (T(181, 32, 'Objek', OBJ, 21) + g1.draw() + g1.poly(LO, OBJ, ox=1, oy=0.5)
       + DIMLINE(g1.p(1, 0.5), g1.p(10, 0.5), OBJ, '9 cm', side=1, off=0, size=16)
       + DIMLINE(g1.p(1, 6.5), g1.p(1, 0.5), OBJ, '6 cm', side=1, off=12, size=16)
       + T(180, 254, 'Setiap petak = 1 cm', MU, 16, halo=False)
       + T(365, 278, 'Lukisan', LUK, 21) + g2.draw() + g2.poly(LD, LUK, ox=1, oy=1)
       + DIMLINE(g2.p(1, 1), g2.p(4, 1), LUK, '3 cm', side=1, off=0, size=16)
       + DIMLINE(g2.p(1, 3), g2.p(1, 1), LUK, '2 cm', side=1, off=10, size=16)
       + T(140, 330, 'Lukisan : Objek', MU3, 19, halo=False) + T(140, 362, '3 : 9 = 1 : 3', LUK, 22, halo=False)
       + T(140, 394, '2 : 6 = 1 : 3', LUK, 22, halo=False) + T(140, 432, 'Nisbah sama → berskala', GR, 18, halo=False))
rows = [['Panjang', '9 cm', '3 cm', '3 : 9 = <b>1 : 3</b>'], ['Lebar', '6 cm', '2 cm', '2 : 6 = <b>1 : 3</b>'], ['Sisi pendek', '3 cm', '1 cm', '1 : 3 = <b>1 : 3</b>']]
add('4.1.1', 'KONSEP', 'Hubungan ukuran lukisan dan objek',
    P('Bandingkan setiap ukuran lukisan dengan ukuran objek yang sepadan.', True)
    + TABLE(['Ukuran', 'Objek', 'Lukisan', 'Lukisan : Objek'], rows, col, rv=True)
    + NOTE(f'Semua nisbah sama, iaitu 1 : 3. Maka setiap ukuran lukisan ialah {FR(1, 3)} daripada ukuran objek.'),
    svg(fig, 'Objek berbentuk L 9 cm kali 6 cm dan lukisan berskalanya 3 cm kali 2 cm'))

# 4.1.1-3 Dikecilkan, sama, dibesarkan
H4 = [(0, 4), (0, 2), (2, 0), (4, 2), (4, 4)]
cases = [(F(1, 2), 'Dikecilkan', '½ × objek', 18, PK), (F(1), 'Sama saiz', '1 × objek', 18, GR), (F(2), 'Dibesarkan', '2 × objek', 18, PU)]
fig = T(250, 30, 'Objek asal: 4 cm × 4 cm (1 petak = 1 cm)', MU3, 17, halo=False)
xs = [52, 150, 300]
for (k, nm, d, c, cl), x in zip(cases, xs):
    n = int(4 * k)
    gy = 380 - n * c
    g = Grid(x, gy, n, n, c)
    fig += g.draw() + g.poly(scaled(H4, k), cl)
    fig += T(x + n * c / 2, 404, nm, cl, 19) + T(x + n * c / 2, 432, d, MU, 16, halo=False)
assert [int(4 * k) for k, *_ in cases] == [2, 4, 8]
add('4.1.1', 'KONSEP', 'Dikecilkan, sama atau dibesarkan',
    BUL([f'{B("Dikecilkan", PK)}: ukuran lukisan lebih kecil daripada objek (cth pelan rumah, peta).',
         f'{B("Sama saiz", GR)}: ukuran lukisan sama dengan objek.',
         f'{B("Dibesarkan", PU)}: ukuran lukisan lebih besar daripada objek (cth lukisan serangga, sel).'], col)
    + NOTE('Dalam ketiga-tiga keadaan, <b>bentuk</b> lukisan tetap sama seperti objek.'),
    svg(fig, 'Objek berbentuk rumah dilukis separuh saiz, sama saiz dan dua kali ganda'))

# 4.1.1-4 Contoh berlangkah
ob = (8, 6); pP = (4, 3); pQ = (4, 2)
assert F(pP[0], ob[0]) == F(pP[1], ob[1]) == F(1, 2)
assert F(pQ[0], ob[0]) != F(pQ[1], ob[1]) and F(pQ[1], ob[1]) == F(1, 3)
g1 = Grid(52, 70, 9, 8, 22)
fig = (T(151, 40, 'Objek', OBJ, 21) + g1.draw() + g1.poly([(0, 0), (8, 0), (8, 6), (0, 6)], OBJ, ox=1, oy=1)
       + DIMLINE(g1.p(1, 1), g1.p(9, 1), OBJ, '8 cm', side=1, off=0, size=16) + DIMLINE(g1.p(1, 7), g1.p(1, 1), OBJ, '6 cm', side=1, off=12, size=16))
gp = Grid(290, 70, 6, 5, 22); gq = Grid(290, 270, 6, 4, 22)
fig += (T(356, 40, 'Lukisan P', LUK, 20) + gp.draw() + gp.poly([(0, 0), (4, 0), (4, 3), (0, 3)], LUK, ox=1, oy=1)
        + DIMLINE(gp.p(1, 1), gp.p(5, 1), LUK, '4 cm', side=1, off=0, size=15) + DIMLINE(gp.p(5, 1), gp.p(5, 4), LUK, '3 cm', side=1, off=8, size=15)
        + T(356, 250, 'Lukisan Q', PK, 20) + gq.draw() + gq.poly([(0, 0), (4, 0), (4, 2), (0, 2)], PK, ox=1, oy=1)
        + DIMLINE(gq.p(1, 1), gq.p(5, 1), PK, '4 cm', side=1, off=0, size=15) + DIMLINE(gq.p(5, 1), gq.p(5, 3), PK, '2 cm', side=1, off=8, size=15)
        + TICK(460, 140) + CROSS(460, 320) + T(151, 300, '1 petak = 1 cm', MU, 16, halo=False))
add('4.1.1', 'CONTOH BERLANGKAH', 'Adakah ini lukisan berskala?',
    P('Sebuah objek berbentuk segi empat tepat berukuran 8 cm × 6 cm. Tentukan sama ada lukisan P dan lukisan Q ialah lukisan berskala bagi objek itu.', True)
    + STEPS([f'P: panjang {FR(4, 8)} = {FR(1, 2)}, lebar {FR(3, 6)} = {FR(1, 2)} → nisbah <b>sama</b>',
             f'Q: panjang {FR(4, 8)} = {FR(1, 2)}, lebar {FR(2, 6)} = {FR(1, 3)} → nisbah <b>berbeza</b>'], col)
    + ANS('P ialah lukisan berskala; Q bukan lukisan berskala'),
    svg(fig, 'Objek 8 cm kali 6 cm, lukisan P 4 cm kali 3 cm dan lukisan Q 4 cm kali 2 cm'))

# 4.1.1-5 Kesilapan biasa
assert (6 + 2, 4 + 2) == (8, 6) and F(8, 6) != F(6, 4) and F(3, 6) == F(2, 4)
fig = ''
g0 = Grid(30, 40, 7, 5, 20)
fig += T(100, 22, 'Objek 6 cm × 4 cm', OBJ, 18) + g0.draw() + g0.poly([(0, 0), (6, 0), (6, 4), (0, 4)], OBJ, ox=0.5, oy=0.5)
CASES = [(160, 'Tambah 2 cm setiap sisi: 8 × 6', False, 'bentuk berubah'), (232, 'Darab panjang sahaja: 12 × 4', False, 'nisbah berbeza'),
         (304, 'Darab semua dengan ½: 3 × 2', True, 'berskala'), (376, 'Darab semua dengan 2: 12 × 8', True, 'berskala')]
for y, t, ok, why in CASES:
    fig += RECT(20, y - 26 + 30, 460, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(48, y + 30) if ok else CROSS(48, y + 30)) + T(76, y + 30, t, GR if ok else RD, 18, 'start') + T(466, y + 30, why, MU, 15, 'end')
fig += T(330, 90, 'Mana satu berskala?', MU3, 18, halo=False)
add('4.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Menambah atau menolak", RD)} nilai yang sama pada setiap sisi ✗ → bentuk berubah.',
         f'{B("Mengubah satu ukuran sahaja", RD)} ✗ → semua ukuran mesti didarab dengan nombor yang sama.',
         f'{B("Membandingkan unit berbeza", RD)} ✗ → tukar ke unit yang sama dahulu (cth cm dengan cm).'], col)
    + NOTE('Lukisan berskala: semua nisbah <b>lukisan : objek</b> mesti sama.', 'Ringkasan:'),
    svg(fig, 'Contoh lukisan yang betul dan salah bagi objek 6 cm kali 4 cm'))

# 4.1.1-6 Ringkasan
fig = ''
for i, (t, d, cl) in enumerate([('Bentuk sama', 'Sudut tidak berubah', TR), ('Nisbah sama', 'Lukisan : objek sama bagi semua ukuran', AM),
                                ('Dikecilkan', 'Ukuran lukisan < ukuran objek', PK), ('Dibesarkan', 'Ukuran lukisan > ukuran objek', PU)]):
    y0 = 16 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, BD, 16, 2) + RECT(30, y0 + 22, 56, 56, f'{cl}2E', cl, 12, 3)
    fig += T(58, y0 + 50, str(i + 1), cl, 26) + T(106, y0 + 36, t, cl, 22, 'start') + T(106, y0 + 68, d, MU, 17, 'start', halo=False)
add('4.1.1', 'RINGKASAN', 'Ringkasan 4.1.1',
    DEF('Lukisan berskala mempunyai bentuk yang sama dengan objek, dan setiap ukurannya berkadar dengan ukuran objek mengikut nisbah yang sama.', col)
    + BUL(['Bandingkan <b>setiap</b> pasangan ukuran sepadan: lukisan ÷ objek.',
           'Jika semua nisbah sama, lukisan itu ialah lukisan berskala.',
           'Nisbah &lt; 1: dikecilkan · nisbah = 1: sama · nisbah &gt; 1: dibesarkan.'], col),
    svg(fig, 'Ringkasan ciri lukisan berskala'))

# ===================== 4.1.2 MENTAFSIR SKALA =====================
col = SUB['4.1.2'][1]

# 4.1.2-1 Definisi skala
fig = (RECT(14, 24, 472, 170) + T(466, 54, 'Lukisan', LUK, 20, 'end')
       + RECT(40, 92, 60, 30, f'{LUK}33', LUK, 4, 3) + T(70, 146, '1 cm', LUK, 19)
       + RECT(14, 216, 472, 170) + T(466, 246, 'Sebenar', OBJ, 20, 'end'))
for i in range(10):
    fig += RECT(40 + i * 42, 286, 42, 30, f'{OBJ}22' if i % 2 else f'{OBJ}44', OBJ, 0, 2)
fig += (T(250, 340, '100 cm = 1 m', OBJ, 19) + ARROW((70, 160), (70, 276), MU, 3, 10) + T(86, 210, 'mewakili', MU, 17, 'start')
        + T(250, 420, 'Skala 1 : 100', AM, 30) + T(250, 452, 'ukuran lukisan : ukuran sebenar', MU, 17, halo=False))
add('4.1.2', 'DEFINISI', 'Apa itu skala?',
    DEF('<b>Skala</b> ialah nisbah <b>ukuran lukisan</b> kepada <b>ukuran sebenar</b> objek dalam unit yang sama, dan ditulis dalam bentuk <b>1 : <i>n</i></b>.', col)
    + P(f'Skala = {B("ukuran lukisan", LUK)} : {B("ukuran sebenar", OBJ)} = 1 : <i>n</i>')
    + BUL(['Skala 1 : 100 bermaksud 1 cm pada lukisan mewakili 100 cm (1 m) pada objek sebenar.',
           'Skala 1 : <i>n</i> juga boleh ditulis sebagai pecahan ' + FR(1, '<i>n</i>') + '.'], col)
    + NOTE('Skala tiada unit kerana kedua-dua ukuran ditulis dalam unit yang sama.'),
    svg(fig, 'Satu sentimeter pada lukisan mewakili seratus sentimeter sebenar bagi skala 1 : 100'))

# 4.1.2-2 Nilai n
fig = ''
CN = [('n > 1', 'Skala 1 : 3', 'Lukisan lebih kecil', 1, 3, PK), ('n = 1', 'Skala 1 : 1', 'Saiz sama', 2, 2, GR), ('0 < n < 1', 'Skala 1 : 1/2', 'Lukisan lebih besar', 2, 1, PU)]
for i, (cond, sk, d, dl, ol, cl) in enumerate(CN):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, BD, 16, 2)
    fig += T(34, y0 + 30, cond, cl, 22, 'start') + T(34, y0 + 62, sk, TX, 19, 'start') + T(34, y0 + 92, d, MU, 17, 'start', halo=False)
    # objek (biru) dan lukisan (kuning): segi empat sama sisi ol dan dl unit
    u = 34
    fig += RECT(250, y0 + 118 - ol * u, ol * u, ol * u, f'{OBJ}22', OBJ, 4, 3) if ol * u < 120 else ''
    fig += RECT(250 + ol * u + 26, y0 + 118 - dl * u, dl * u, dl * u, f'{LUK}33', LUK, 4, 3)
    fig += T(250 + ol * u / 2, y0 + 128, 'objek', OBJ, 13) + T(250 + ol * u + 26 + dl * u / 2, y0 + 128, 'lukisan', LUK, 13)
assert F(1) / 3 < 1 and F(1) / F(1, 2) == 2
add('4.1.2', 'KONSEP', 'Maksud nilai <i>n</i>',
    TABLE(['Skala 1 : <i>n</i>', 'Contoh', 'Lukisan'],
          [['<i>n</i> &gt; 1', '1 : 50', B('dikecilkan', PK)], ['<i>n</i> = 1', '1 : 1', B('sama saiz', GR)], ['0 &lt; <i>n</i> &lt; 1', '1 : ' + FR(1, 4), B('dibesarkan', PU)]], col, rv=True)
    + P(f'Skala 1 : {FR(1, 4)} bermaksud 1 cm pada lukisan mewakili {FR(1, 4)} cm (0.25 cm) sebenar, iaitu lukisan 4 kali lebih besar.', True),
    svg(fig, 'Perbandingan saiz objek dan lukisan bagi n lebih daripada 1, sama dengan 1 dan kurang daripada 1'))

# 4.1.2-3 Contoh: menentukan skala (dikecilkan)
dcm, rm = 8, 4
n = scale_of(dcm, rm * 100); assert n == 50
fig = (CAR(70, 210, 360, OBJ) + DIMLINE((70, 226), (430, 226), OBJ, 'Sebenar: 4 m', side=-1, off=6, size=19)
       + CAR(170, 390, 160, LUK) + DIMLINE((170, 404), (330, 404), LUK, 'Lukisan: 8 cm', side=-1, off=6, size=19)
       + T(250, 44, 'Lukisan sebuah kereta', MU3, 19, halo=False))
add('4.1.2', 'CONTOH BERLANGKAH', 'Menentukan skala',
    P('Sebuah kereta yang panjangnya 4 m dilukis dengan panjang 8 cm. Tentukan skala lukisan itu.', True)
    + STEPS(['Tukar ke unit yang sama: 4 m = 400 cm',
             'Ukuran lukisan : ukuran sebenar = 8 : 400',
             'Bahagi kedua-dua dengan 8: 8 ÷ 8 : 400 ÷ 8 = 1 : 50'], col)
    + ANS('Skala = 1 : 50'),
    svg(fig, 'Kereta sebenar 4 m dan lukisannya 8 cm'))

# 4.1.2-4 Contoh: lukisan dibesarkan
d2, r2 = F(4), F(8, 10)
n2 = scale_of(d2, r2); assert n2 == F(1, 5) and float(r2) == 0.8
fig = (ANT(250, 200, 30, PA) + DIMLINE((190, 268), (370, 268), LUK, 'Lukisan: 4 cm', side=-1, off=0, size=19)
       + RECT(30, 330, 440, 120, SURF, BD, 16, 2) + T(56, 360, 'Saiz sebenar:', OBJ, 18, 'start')
       + ANT(230, 395, 6, PA) + DIMLINE((218, 412), (254, 412), OBJ, '0.8 cm', side=-1, off=2, size=16)
       + T(250, 46, 'Lukisan seekor semut', MU3, 19, halo=False))
add('4.1.2', 'CONTOH BERLANGKAH', 'Skala lukisan yang dibesarkan',
    P('Seekor semut yang panjangnya 0.8 cm dilukis dengan panjang 4 cm. Tentukan skala lukisan itu.', True)
    + STEPS(['Ukuran lukisan : ukuran sebenar = 4 : 0.8',
             'Bahagi kedua-dua dengan 4: 1 : 0.2',
             f'0.2 = {FR(2, 10)} = {FR(1, 5)}, maka skala = 1 : {FR(1, 5)}'], col)
    + ANS(f'Skala = 1 : {FR(1, 5)} (lukisan 5 kali lebih besar)')
    + NOTE('<i>n</i> &lt; 1 bermaksud lukisan itu dibesarkan.'),
    svg(fig, 'Lukisan semut 4 cm dibesarkan daripada saiz sebenar 0.8 cm'))

# 4.1.2-5 Skala peta
n5 = 200000; dmap = F(7, 2)
km_per_cm = F(n5, 100000); assert km_per_cm == 2 and dmap * km_per_cm == 7
fig = (RECT(14, 14, 472, 340, f'{GR}14', BD, 18, 2)
       + f'<path d="M14 250 C 120 220, 200 300, 300 260 S 440 200, 486 230" fill="none" stroke="{TR}" stroke-width="10" stroke-opacity="0.55"/>'
       + f'<path d="M60 60 C 120 120, 220 90, 260 150 S 380 210, 440 300" fill="none" stroke="{MU2}" stroke-width="6" stroke-dasharray="1 0"/>')
A5, B5 = (90, 110), (405, 110)
fig += (LINE(A5, B5, AM, 4, '10 7') + DOT(A5, PK, 10) + DOT(B5, PK, 10) + T(90, 80, 'Bandar P', TX, 18) + T(405, 80, 'Bandar Q', TX, 18)
        + T(248, 136, '3.5 cm pada peta', AM, 18))
for i in range(4):
    fig += RECT(60 + i * 60, 300, 60, 14, TX if i % 2 == 0 else NAV, TX, 0, 1.5)
fig += (T(60, 288, '0', MU3, 14) + T(120, 288, '2', MU3, 14) + T(180, 288, '4', MU3, 14) + T(240, 288, '6', MU3, 14) + T(300, 288, '8 km', MU3, 14, 'start')
        + T(250, 392, 'Skala 1 : 200 000', AM, 26) + T(250, 428, '1 cm mewakili 2 km', MU3, 19, halo=False))
add('4.1.2', 'SKALA PETA', 'Mentafsir skala pada peta',
    P(f'Peta dilukis dengan skala 1 : {num(n5)}. Jarak antara Bandar P dan Bandar Q pada peta ialah 3.5 cm. Cari jarak sebenar dalam km.', True)
    + STEPS([f'1 cm mewakili {num(n5)} cm',
             f'{num(n5)} cm = {num(n5 // 100)} m = 2 km',
             'Jarak sebenar = 3.5 × 2 km = 7 km'], col)
    + ANS('Jarak sebenar = 7 km')
    + NOTE('1 km = 1 000 m = 100 000 cm.'),
    svg(fig, 'Peta dua bandar dengan jarak 3.5 cm pada skala 1 : 200 000'))

# 4.1.2-6 Kesilapan biasa
assert F(8, 4) == 2 and F(400, 8) == 50
fig = ''
CASES = [(44, 'Lukisan 8 cm, sebenar 4 m → 1 : 0.5', False, 'unit berbeza'), (116, '8 cm : 400 cm = 1 : 50', True, 'unit sama'),
         (212, 'Skala ditulis 50 : 1', False, 'terbalik'), (284, 'Skala ditulis 1 : 50', True, 'lukisan : sebenar'),
         (380, '1 : 1/5 → lukisan dikecilkan', False, 'n < 1 = dibesarkan')]
for y, t, ok, why in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 17, 'start') + T(470, y, why, MU, 14, 'end')
add('4.1.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Unit tidak sama", RD)} ✗ → tukar kedua-dua ukuran ke unit yang sama sebelum menulis nisbah.',
         f'{B("Nisbah terbalik", RD)} ✗ → skala sentiasa <b>ukuran lukisan : ukuran sebenar</b>.',
         f'{B("Salah tafsir n", RD)} ✗ → <i>n</i> &gt; 1 dikecilkan; 0 &lt; <i>n</i> &lt; 1 dibesarkan.'], col)
    + NOTE('Permudahkan nisbah sehingga sebutan pertama ialah 1.', 'Ringkasan:'),
    svg(fig, 'Contoh penulisan skala yang betul dan salah'))

# ===================== 4.1.3 MELUKIS LUKISAN BERSKALA =====================
col = SUB['4.1.3'][1]

# 4.1.3-1 Langkah melukis
Lm, Wm, n = 12, 8, 200
dl, dw = F(Lm * 100, n), F(Wm * 100, n); assert (dl, dw) == (6, 4)
g = Grid(40, 80, 8, 6, 52)
fig = (T(250, 40, 'Lukisan taman (skala 1 : 200)', MU3, 19, halo=False) + g.draw()
       + g.poly([(0, 0), (6, 0), (6, 4), (0, 4)], GR, ox=1, oy=1)
       + DIMLINE(g.p(1, 5), g.p(7, 5), GR, '6 cm', side=-1, off=16, size=19) + DIMLINE(g.p(7, 5), g.p(7, 1), GR, '4 cm', side=-1, off=16, size=19)
       + T(g.p(4, 3)[0], g.p(4, 3)[1], 'taman', GR, 20) + T(250, 432, '1 petak = 1 cm', MU, 17, halo=False))
add('4.1.3', 'LANGKAH', 'Cara melukis lukisan berskala',
    P(f'Sebuah taman berbentuk segi empat tepat berukuran {Lm} m × {Wm} m. Lukis taman itu dengan skala 1 : {n}.', True)
    + STEPS([f'Tukar ke cm: {Lm} m = {Lm * 100} cm, {Wm} m = {Wm * 100} cm',
             f'Ukuran lukisan = ukuran sebenar ÷ <i>n</i>: {Lm * 100} ÷ {n} = {num(dl)} cm, {Wm * 100} ÷ {n} = {num(dw)} cm',
             f'Lukis segi empat tepat {num(dl)} cm × {num(dw)} cm pada grid, kemudian labelkan.'], col)
    + NOTE('Semua sudut kekal 90° dan bentuk sama dengan objek.'),
    svg(fig, 'Lukisan taman 6 cm kali 4 cm pada grid sentimeter'))

# 4.1.3-2 Contoh pada grid: dibesarkan
ARW = [(0, 1), (2, 1), (2, 0), (4, 2), (2, 4), (2, 3), (0, 3)]
big = scaled(ARW, 2)
assert all(abs(2 * a - b) < 1e-9 for a, b in zip(sides(ARW), sides(big)))
g1 = Grid(24, 150, 6, 6, 22); g2 = Grid(196, 120, 12, 12, 22)
fig = (T(90, 120, 'Objek', OBJ, 20) + g1.draw() + g1.poly(ARW, OBJ, ox=1, oy=1)
       + T(328, 96, 'Lukisan, skala 1 : 1/2', LUK, 20) + g2.draw() + g2.poly(big, LUK, ox=2, oy=2)
       + DIMLINE(g1.p(1, 2), g1.p(3, 2), OBJ, '2', side=1, off=0, size=14, gap=-4)
       + DIMLINE(g2.p(2, 4), g2.p(6, 4), LUK, '4', side=1, off=0, size=16, gap=-2)
       + T(90, 310, '1 petak = 1 cm', MU, 15, halo=False) + T(330, 420, 'Setiap sisi × 2', GR, 19, halo=False))
add('4.1.3', 'CONTOH BERLANGKAH', 'Melukis pada grid',
    P('Objek di sebelah kiri dilukis pada grid berpetak 1 cm. Lukis semula objek itu dengan skala 1 : ' + FR(1, 2) + '.', True)
    + STEPS([f'Skala 1 : {FR(1, 2)}: ukuran lukisan = ukuran sebenar ÷ {FR(1, 2)} = ukuran sebenar × 2',
             'Sisi 2 cm → 4 cm, sisi 4 cm → 8 cm, sisi 1 cm → 2 cm',
             'Mulakan dari satu bucu, kira petak bagi setiap sisi, dan sambungkan bucu.'], col)
    + ANS('Lukisan dua kali lebih besar dengan bentuk yang sama'),
    svg(fig, 'Objek anak panah pada grid dan lukisannya dua kali lebih besar'))

# 4.1.3-3 Grid berlainan saiz
g1 = Grid(24, 110, 6, 6, 34); g2 = Grid(300, 161, 6, 6, 17)
SH = [(1, 1), (5, 1), (5, 3), (3, 5), (1, 5)]
fig = (T(126, 76, 'Objek: petak 1 cm', OBJ, 19) + g1.draw() + g1.poly(SH, OBJ)
       + T(351, 124, 'Lukisan: petak 0.5 cm', LUK, 19) + g2.draw() + g2.poly(SH, LUK)
       + ARROW((236, 212), (288, 212), MU, 3, 10)
       + T(250, 360, 'Bilangan petak sama, saiz petak ½', MU3, 18, halo=False)
       + T(250, 400, '0.5 : 1 = 1 : 2', AM, 26) + T(250, 436, 'Skala 1 : 2 (dikecilkan)', MU, 17, halo=False))
assert F(1, 2) / 1 == F(1, 2) and scale_of(F(1, 2), 1) == 2
add('4.1.3', 'CONTOH BERLANGKAH', 'Grid yang berlainan saiz',
    P('Objek dilukis pada grid berpetak 1 cm. Lukisannya dilukis pada grid berpetak 0.5 cm dengan bilangan petak yang sama. Apakah skala lukisan itu?', True)
    + STEPS(['Setiap sisi petak lukisan = 0.5 cm, setiap sisi petak objek = 1 cm',
             'Skala = 0.5 : 1',
             'Darab kedua-dua dengan 2: 1 : 2'], col)
    + ANS('Skala = 1 : 2')
    + NOTE('Salin bentuk petak demi petak: bilangan petak setiap sisi mesti sama.'),
    svg(fig, 'Bentuk yang sama pada grid satu sentimeter dan grid setengah sentimeter'))

# 4.1.3-4 Sebaliknya: dari lukisan ke ukuran sebenar
n4 = 300
PL = [(0, 0), (5, 0), (5, 2), (3, 2), (3, 4), (0, 4)]
sd4 = sides(PL); assert sd4 == [5, 2, 2, 2, 3, 4]
real = [int(s * n4 / 100) for s in sd4]; assert real == [15, 6, 6, 6, 9, 12]
g = Grid(40, 60, 7, 6, 56)
fig = (g.draw() + g.poly(PL, GR, ox=1, oy=1)
       + DIMLINE(g.p(1, 1), g.p(6, 1), GR, '5 cm', side=1, off=0, size=18)
       + DIMLINE(g.p(1, 5), g.p(1, 1), GR, '4 cm', side=1, off=12, size=18)
       + DIMLINE(g.p(6, 1), g.p(6, 3), GR, '2 cm', side=-1, off=12, size=18)
       + DIMLINE(g.p(4, 3), g.p(4, 5), GR, '2 cm', side=-1, off=12, size=18)
       + T(250, 430, 'Pelan sebidang tanah · skala 1 : 300', MU3, 18, halo=False))
add('4.1.3', 'CONTOH BERLANGKAH', 'Dari lukisan ke ukuran sebenar',
    P('Rajah menunjukkan pelan sebidang tanah yang dilukis pada grid berpetak 1 cm dengan skala 1 : 300. Cari ukuran sebenar setiap sisi.', True)
    + STEPS(['1 cm pada pelan mewakili 300 cm = 3 m',
             'Ukuran sebenar = ukuran lukisan × <i>n</i>'], col)
    + TABLE(['Sisi pada pelan', '5 cm', '4 cm', '3 cm', '2 cm'], [['Sebenar', '15 m', '12 m', '9 m', '6 m']], col, rv=True),
    svg(fig, 'Pelan tanah berbentuk L pada grid dengan skala 1 : 300'))

# 4.1.3-5 Kesilapan biasa
assert 12 * 200 == 2400 and F(12, 200) == F(3, 50) and 1200 / 200 == 6
fig = ''
CASES = [(48, 'Lukisan = 12 m × 200 = 2 400 m', False, 'darab n'), (128, 'Lukisan = 12 ÷ 200 = 0.06 cm', False, 'unit berbeza'),
         (208, 'Lukisan = 1 200 cm ÷ 200 = 6 cm', True, 'betul'), (304, 'Sudut berubah semasa melukis', False, 'bentuk lain'),
         (384, 'Semua sudut sama seperti objek', True, 'betul')]
for y, t, ok, why in CASES:
    fig += RECT(16, y - 30, 468, 60, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(44, y) if ok else CROSS(44, y)) + T(70, y, t, GR if ok else RD, 17, 'start') + T(470, y, why, MU, 14, 'end')
add('4.1.3', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Mendarab dengan n", RD)} untuk mencari ukuran lukisan ✗ → ukuran lukisan = ukuran sebenar ÷ <i>n</i>.',
         f'{B("Tidak menukar unit", RD)} ✗ → tukar m kepada cm sebelum membahagi dengan <i>n</i>.',
         f'{B("Mengubah sudut", RD)} ✗ → bentuk dan sudut lukisan mesti sama dengan objek.'], col),
    svg(fig, 'Contoh kiraan ukuran lukisan yang betul dan salah'))

# 4.1.3-6 Ringkasan
fig = (RECT(30, 60, 170, 110, f'{OBJ}22', OBJ, 18, 3) + T(115, 100, 'Ukuran', OBJ, 22) + T(115, 132, 'sebenar', OBJ, 22)
       + RECT(300, 60, 170, 110, f'{LUK}26', LUK, 18, 3) + T(385, 100, 'Ukuran', LUK, 22) + T(385, 132, 'lukisan', LUK, 22)
       + ARROW((206, 96), (294, 96), GR, 4, 12) + T(250, 74, '÷ n', GR, 22)
       + ARROW((294, 140), (206, 140), PK, 4, 12) + T(250, 166, '× n', PK, 22)
       + RECT(30, 220, 440, 200, SURF, BD, 18, 2)
       + T(250, 256, 'Contoh: skala 1 : 50', AM, 21)
       + T(250, 300, '3 m = 300 cm → 300 ÷ 50 = 6 cm', GR, 19)
       + T(250, 344, '4.5 cm → 4.5 × 50 = 225 cm = 2.25 m', PK, 19)
       + T(250, 390, 'Tukar unit dahulu!', MU3, 18, halo=False))
assert 300 / 50 == 6 and F(9, 2) * 50 == F(225) and F(225, 100) == F(9, 4)
add('4.1.3', 'RINGKASAN', 'Ringkasan 4.1.3',
    TABLE(['Cari', 'Rumus'], [['Ukuran lukisan', 'ukuran sebenar ÷ <i>n</i>'], ['Ukuran sebenar', 'ukuran lukisan × <i>n</i>'], ['Skala', 'ukuran lukisan : ukuran sebenar']], col, rv=True)
    + BUL(['Gunakan unit yang sama.', 'Pada grid, kira petak bagi setiap sisi dan kekalkan semua sudut.'], col),
    svg(fig, 'Rajah aliran: ukuran sebenar dibahagi n menjadi ukuran lukisan, ukuran lukisan didarab n menjadi ukuran sebenar'))

# ===================== 4.1.4 PENYELESAIAN MASALAH =====================
col = SUB['4.1.4'][1]

# 4.1.4-1 Pelan rumah
n1 = 200
rooms = [('Bilik tidur', F(5, 2), F(2)), ('Ruang tamu', F(3), F(2)), ('Dapur', F(2), F(3, 2))]
act = [(r * n1 / 100, s * n1 / 100) for _, r, s in rooms]
assert act[0] == (5, 4) and act[0][0] * act[0][1] == 20
u = 72
X0, Y0 = 34, 80
fig = (T(250, 40, 'Pelan rumah · skala 1 : 200', MU3, 19, halo=False)
       + RECT(X0, Y0, 2.5 * u, 2 * u, f'{PK}22', PK, 0, 3) + RECT(X0 + 2.5 * u, Y0, 3 * u, 2 * u, f'{TR}18', TR, 0, 3)
       + RECT(X0 + 2.5 * u, Y0 + 2 * u, 2 * u, 1.5 * u, f'{AM}18', AM, 0, 3) + RECT(X0, Y0 + 2 * u, 2.5 * u, 1.5 * u, f'{GR}14', MU2, 0, 2)
       + T(X0 + 1.25 * u, Y0 + u - 12, 'Bilik tidur', PK, 18) + T(X0 + 1.25 * u, Y0 + u + 14, '2.5 cm × 2 cm', MU3, 15)
       + T(X0 + 4 * u, Y0 + u - 12, 'Ruang tamu', TR, 18) + T(X0 + 4 * u, Y0 + u + 14, '3 cm × 2 cm', MU3, 15)
       + T(X0 + 3.5 * u, Y0 + 2.75 * u - 12, 'Dapur', AM, 18) + T(X0 + 3.5 * u, Y0 + 2.75 * u + 14, '2 cm × 1.5 cm', MU3, 15)
       + T(X0 + 1.25 * u, Y0 + 2.75 * u, 'Bilik air', MU, 16))
add('4.1.4', 'PELAN', 'Membaca pelan rumah',
    P('Pelan sebuah rumah dilukis dengan skala 1 : 200. Bilik tidur berukuran 2.5 cm × 2 cm pada pelan. Hitung luas sebenar bilik tidur itu.', True)
    + STEPS(['1 cm pada pelan mewakili 200 cm = 2 m',
             'Panjang sebenar = 2.5 × 2 = 5 m; lebar sebenar = 2 × 2 = 4 m',
             'Luas sebenar = 5 m × 4 m = 20 m²'], col)
    + ANS('Luas sebenar bilik tidur = 20 m²'),
    svg(fig, 'Pelan rumah dengan bilik tidur, ruang tamu, dapur dan bilik air'))

# 4.1.4-2 Luas: n kuasa dua
n2 = 100; Ad = 12
assert n2 * n2 == 10000 and F(Ad * n2 * n2, 10000) == 12
fig = (T(125, 40, 'Pada lukisan', LUK, 20) + RECT(95, 80, 60, 60, f'{LUK}33', LUK, 2, 3) + T(125, 160, '1 cm × 1 cm', LUK, 17)
       + T(125, 190, '= 1 cm²', LUK, 17)
       + T(360, 40, 'Sebenar', OBJ, 20))
gS = Grid(270, 70, 10, 10, 18)
fig += (gS.draw(BD, 1) + f'<rect x="270" y="70" width="180" height="180" fill="{OBJ}1E" stroke="{OBJ}" stroke-width="3"/>'
        + T(360, 270, '100 cm × 100 cm', OBJ, 17) + T(360, 296, '= 10 000 cm² = 1 m²', OBJ, 17)
        + ARROW((170, 110), (258, 140), MU, 3, 10)
        + RECT(30, 336, 440, 108, SURF, BD, 16, 2) + T(250, 370, 'Skala 1 : 100 → luas didarab 100² = 10 000', AM, 18)
        + T(250, 410, '12 cm² pada lukisan → 12 m² sebenar', MU3, 18, halo=False))
add('4.1.4', 'KONSEP', 'Luas pada lukisan berskala',
    BUL(['Bagi skala 1 : <i>n</i>, setiap panjang didarab dengan <i>n</i>, jadi <b>luas</b> didarab dengan <i>n</i>².',
         'Luas sebenar = luas lukisan × <i>n</i>²'], col)
    + P('Contoh: Luas sebuah bilik pada lukisan berskala 1 : 100 ialah 12 cm². Luas sebenar = 12 × 100² = 120 000 cm² = 12 m².', True)
    + NOTE('Cara selamat: cari panjang dan lebar sebenar dahulu, kemudian darab untuk mendapatkan luas.'),
    svg(fig, 'Satu sentimeter persegi pada lukisan berskala 1 : 100 mewakili satu meter persegi'))

# 4.1.4-3 Peta & masa
n3, dm, v = 250000, 6, 60
dist = F(dm * n3, 100000); assert dist == 15
t_min = dist / v * 60; assert t_min == 15
fig = (RECT(14, 14, 472, 300, f'{GR}14', BD, 18, 2)
       + f'<path d="M70 250 C 140 240, 160 120, 250 130 S 380 80, 430 70" fill="none" stroke="{MU2}" stroke-width="9" stroke-linecap="round"/>'
       + f'<path d="M70 250 C 140 240, 160 120, 250 130 S 380 80, 430 70" fill="none" stroke="{AM}" stroke-width="3" stroke-dasharray="10 8"/>'
       + DOT((70, 250), PK, 11) + DOT((430, 70), PK, 11) + T(70, 284, 'Kampung', TX, 17) + T(430, 104, 'Pekan', TX, 17)
       + T(300, 180, 'jalan: 6 cm pada peta', AM, 17)
       + T(250, 352, 'Skala 1 : 250 000 · 60 km/j', AM, 22)
       + T(250, 392, '6 cm × 2.5 km = 15 km', MU3, 19, halo=False) + T(250, 428, 'Masa = 15 ÷ 60 = 0.25 jam = 15 minit', MU3, 19, halo=False))
add('4.1.4', 'PETA', 'Jarak dan masa perjalanan',
    P('Pada peta berskala 1 : 250 000, panjang jalan dari kampung ke pekan ialah 6 cm. Encik Ali memandu pada laju purata 60 km/j. Berapakah masa perjalanannya?', True)
    + STEPS(['1 cm mewakili 250 000 cm = 2.5 km',
             'Jarak sebenar = 6 × 2.5 = 15 km',
             'Masa = jarak ÷ laju = 15 ÷ 60 = 0.25 jam'], col)
    + ANS('Masa perjalanan = 0.25 jam = 15 minit'),
    svg(fig, 'Peta jalan dari kampung ke pekan sepanjang 6 cm'))

# 4.1.4-4 Kos
n4, pl, pw, harga = 200, F(3), F(5, 2), 40
L4, W4 = pl * n4 / 100, pw * n4 / 100
assert (L4, W4) == (6, 5) and L4 * W4 * harga == 1200
g = Grid(55, 70, 6, 5, 64)
fig = (T(250, 40, 'Lantai ruang tamu (sebenar)', MU3, 19, halo=False))
for i in range(6):
    for j in range(5):
        fig += RECT(55 + i * 64 + 3, 70 + j * 64 + 3, 58, 58, f'{PK}{"30" if (i + j) % 2 else "18"}', 'none', 6, 0)
fig += (f'<rect x="55" y="70" width="384" height="320" fill="none" stroke="{PK}" stroke-width="4"/>'
        + DIMLINE((55, 390), (439, 390), PK, '6 m', side=-1, off=14, size=19) + DIMLINE((439, 390), (439, 70), PK, '5 m', side=-1, off=8, size=19)
        + T(247, 230, '30 m²', TX, 34))
add('4.1.4', 'KOS', 'Kos memasang jubin',
    P('Ruang tamu berukuran 3 cm × 2.5 cm pada pelan berskala 1 : 200. Kos jubin ialah RM40 bagi setiap meter persegi. Hitung kos memasang jubin di seluruh ruang tamu.', True)
    + STEPS(['1 cm mewakili 2 m: 3 × 2 = 6 m, 2.5 × 2 = 5 m',
             'Luas sebenar = 6 × 5 = 30 m²',
             'Kos = 30 × RM40 = RM1 200'], col)
    + ANS('Kos memasang jubin = RM1 200'),
    svg(fig, 'Lantai ruang tamu 6 m kali 5 m yang dipasang jubin'))

# 4.1.4-5 Model
ml, rl, rw = 18, F(9, 2), F(7, 4)
nm = scale_of(ml, rl * 100); assert nm == 25 and rw * 100 / nm == 7
fig = (T(250, 40, 'Model kereta mainan', MU3, 19, halo=False)
       + CAR(80, 220, 340, LUK) + DIMLINE((80, 236), (420, 236), LUK, 'Model: 18 cm', side=-1, off=6, size=19)
       + RECT(30, 300, 440, 150, SURF, BD, 16, 2)
       + T(250, 334, 'Kereta sebenar: 4.5 m = 450 cm', OBJ, 19)
       + T(250, 372, '18 : 450 = 1 : 25', AM, 24)
       + T(250, 412, 'Lebar 1.75 m = 175 cm → 175 ÷ 25 = 7 cm', MU3, 17, halo=False))
add('4.1.4', 'MODEL', 'Model berskala',
    P('Sebuah model kereta panjangnya 18 cm. Panjang kereta sebenar ialah 4.5 m. (a) Tentukan skala model itu. (b) Lebar kereta sebenar ialah 1.75 m. Hitung lebar model.', True)
    + STEPS(['(a) 4.5 m = 450 cm; 18 : 450 = 1 : 25',
             '(b) 1.75 m = 175 cm; lebar model = 175 ÷ 25 = 7 cm'], col)
    + ANS('(a) 1 : 25 (b) 7 cm'),
    svg(fig, 'Model kereta 18 cm bagi kereta sebenar 4.5 m'))

# 4.1.4-6 Ringkasan bab
fig = ''
SUMM = [('Skala', '1 : n = lukisan : sebenar', AM), ('Lukisan', 'sebenar ÷ n', GR), ('Sebenar', 'lukisan × n', TR), ('Luas', 'luas lukisan × n²', PK)]
for i, (t, d, cl) in enumerate(SUMM):
    y0 = 16 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, BD, 16, 2) + RECT(30, y0 + 22, 56, 56, f'{cl}2E', cl, 12, 3) + T(58, y0 + 50, str(i + 1), cl, 26)
    fig += T(106, y0 + 36, t, cl, 22, 'start') + T(106, y0 + 70, d, MU3, 19, 'start', halo=False)
add('4.1.4', 'RINGKASAN', 'Ringkasan bab',
    BUL(['Baca soalan: cari ukuran lukisan, ukuran sebenar, skala, luas, kos atau masa?',
         'Tukar semua ukuran ke unit yang sama (1 m = 100 cm, 1 km = 100 000 cm).',
         'Untuk luas dan kos, cari panjang dan lebar sebenar dahulu.',
         'Semak jawapan: lukisan dikecilkan mesti lebih kecil daripada objek.'], col),
    svg(fig, 'Ringkasan rumus lukisan berskala'))

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
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body
assert not re.search(r'\d\.\d{4,}', re.sub(r'(points|d|x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|width|height)="[^"]*"', '', js_body)), 'nombor tidak kemas'
assert counts == {'4.1.1': 6, '4.1.2': 6, '4.1.3': 6, '4.1.4': 6}, counts

js = ('/* Dijana oleh tools/berskala/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
