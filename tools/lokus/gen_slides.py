# Penjana slaid NOTA LOKUS (Tingkatan 3 Bab 8 Lokus dalam Dua Dimensi) -> lokus/slides.js
# Jalankan:  python3 tools/lokus/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'lokus', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM Bab 8: SK 8.1 Lokus, SK 8.2 Lokus dalam Dua Dimensi
SUB = {
    '8.1': ('Lokus', C['am']),
    '8.2': ('Lokus dalam Dua Dimensi', C['gr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
LC = PK   # warna tetap lokus (merah jambu)

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

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'

def CIRC(c, r, col, sw=4, dash=None, fill='none'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(c[0])}" cy="{r1(c[1])}" r="{r1(r)}" fill="{fill}" stroke="{col}" stroke-width="{sw}"{d}/>'

def ARC(c, r, a0, a1, col, sw=3, dash=None):
    """Lengkok berpusat c (piksel), sudut a0 -> a1 darjah (lawan arah jam, paksi y ke atas)."""
    p0 = (c[0] + r * math.cos(math.radians(a0)), c[1] - r * math.sin(math.radians(a0)))
    p1 = (c[0] + r * math.cos(math.radians(a1)), c[1] - r * math.sin(math.radians(a1)))
    large = 1 if abs(a1 - a0) > 180 else 0
    sweep = 0 if a1 > a0 else 1
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<path d="M{r1(p0[0])} {r1(p0[1])} A{r1(r)} {r1(r)} 0 {large} {sweep} {r1(p1[0])} {r1(p1[1])}" '
            f'fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>')

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

def TICKS(p, q, col, n=1):
    """Tanda sama panjang pada tengah segmen p-q."""
    mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
    L = math.hypot(q[0] - p[0], q[1] - p[1]) or 1
    ux, uy = (q[0] - p[0]) / L, (q[1] - p[1]) / L; nx, ny = -uy, ux
    s = ''
    for i in range(n):
        o = (i - (n - 1) / 2) * 7
        x, y = mx + ux * o, my + uy * o
        s += LINE((x - nx * 9, y - ny * 9), (x + nx * 9, y + ny * 9), col, 3)
    return s

def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

class Grid:
    """Grid segi empat sama [0,nx] x [0,ny] (unit) dalam kotak piksel; paksi y ke atas."""
    def __init__(self, nx, ny, box=(40, 30, 470, 440)):
        self.nx, self.ny = nx, ny
        L, Tp, R, Bm = box
        self.s = min((R - L) / nx, (Bm - Tp) / ny)
        self.ox = (L + R) / 2 - self.s * nx / 2
        self.oy = (Tp + Bm) / 2 + self.s * ny / 2
    def X(self, x): return self.ox + self.s * x
    def Y(self, y): return self.oy - self.s * y
    def p(self, x, y): return (self.X(x), self.Y(y))
    def draw(self):
        s = ''
        for i in range(self.nx + 1):
            s += LINE(self.p(i, 0), self.p(i, self.ny), GRID, 1.5, cap='butt')
        for j in range(self.ny + 1):
            s += LINE(self.p(0, j), self.p(self.nx, j), GRID, 1.5, cap='butt')
        return s
    def pt(self, x, y, lab, col=TX, dx=0, dy=-22, anchor='middle', size=19):
        return DOT(self.p(x, y), col) + (T(self.X(x) + dx, self.Y(y) + dy, lab, col, size, anchor) if lab else '')

def dist(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 8.1 LOKUS =====================
col = SUB['8.1'][1]

# 8.1-1 Definisi: titik X sentiasa 3 unit dari P
g = Grid(10, 10, (30, 20, 470, 440))
Pc = (5, 5); R0 = 3
fig = g.draw() + CIRC(g.p(*Pc), R0 * g.s, LC, 4, '10 8')
# titik-titik X yang memenuhi syarat (kedudukan berbeza)
XS = [(8, 5), (5, 8), (2, 5), (5, 2)]
XS_ang = [30, 135, 210, 300]
for x, y in XS:
    assert dist((x, y), Pc) == R0
for a in XS_ang:
    q = (Pc[0] + R0 * math.cos(math.radians(a)), Pc[1] + R0 * math.sin(math.radians(a)))
    assert abs(dist(q, Pc) - R0) < 1e-9
    fig += DOT(g.p(*q), PK, 6)
for x, y in XS:
    fig += DOT(g.p(x, y), PK, 7)
fig += LINE(g.p(*Pc), g.p(8, 5), AM, 4) + T(g.X(6.5), g.Y(5) + 18, '3 unit', AM, 18)
fig += g.pt(*Pc, 'P', TX, -14, -16) + T(g.X(8) + 14, g.Y(5) - 18, 'X', PK, 20, 'start')
fig += T(250, 455, 'Semua titik X dengan XP = 3 unit membentuk bulatan', MU3, 16, halo=False)
add('8.1', 'DEFINISI', 'Apa itu lokus?',
    DEF('<b>Lokus</b> ialah surihan atau laluan bagi satu set titik yang memenuhi <b>syarat tertentu</b>.', col)
    + BUL([f'Contoh: titik {B("X", PK)} bergerak dengan keadaan jaraknya dari titik P sentiasa 3 unit.',
           'Semua kedudukan X yang mungkin membentuk sebuah <b>bulatan</b> berpusat P dengan jejari 3 unit.',
           'Lokus boleh berbentuk garis lurus, lengkok, bulatan atau gabungannya.'], col)
    + NOTE('Lokus ialah set <b>semua</b> titik yang memenuhi syarat, bukan satu titik sahaja.'),
    svg(fig, 'Titik X bergerak 3 unit dari P membentuk lokus berbentuk bulatan'))

# 8.1-2 Situasi harian (2D)
fig = ''
# panel 1: jam
fig += RECT(14, 14, 230, 214)
cJ = (129, 112); rJ = 70
fig += CIRC(cJ, rJ + 12, MU2, 3) + CIRC(cJ, rJ, LC, 4, '8 7')
fig += LINE(cJ, (cJ[0] + rJ * math.cos(math.radians(60)), cJ[1] - rJ * math.sin(math.radians(60))), AM, 5)
fig += LINE(cJ, (cJ[0] - 30, cJ[1] - 10), MU3, 5) + DOT(cJ, TX, 5)
fig += DOT((cJ[0] + rJ * math.cos(math.radians(60)), cJ[1] - rJ * math.sin(math.radians(60))), PK, 7)
fig += T(129, 210, 'Hujung jarum jam', TX, 17)
# panel 2: buaian / bandul
fig += RECT(256, 14, 230, 214)
cB = (371, 40); rB = 130
fig += LINE((300, 40), (442, 40), MU2, 5)
fig += ARC(cB, rB, 235, 305, LC, 4, '8 7')
bob = (cB[0] + rB * math.cos(math.radians(250)), cB[1] - rB * math.sin(math.radians(250)))
fig += LINE(cB, bob, MU3, 3) + DOT(bob, PK, 10) + DOT(cB, TX, 5)
fig += T(371, 210, 'Bandul / buaian', TX, 17)
# panel 3: pintu dari atas
fig += RECT(14, 240, 230, 216)
hinge = (50, 400); rD = 150
fig += LINE((24, 400), (hinge[0], 400), MU2, 8) + LINE((hinge[0] + rD, 400), (236, 400), MU2, 8)
fig += ARC(hinge, rD, 0, 90, LC, 4, '8 7')
dEnd = (hinge[0] + rD * math.cos(math.radians(40)), hinge[1] - rD * math.sin(math.radians(40)))
fig += LINE(hinge, dEnd, AM, 7) + DOT(dEnd, PK, 7) + DOT(hinge, TX, 5)
fig += T(150, 430, 'Pintu (pandangan atas)', TX, 17)
# panel 4: lif
fig += RECT(256, 240, 230, 216)
fig += RECT(330, 256, 82, 168, 'none', MU2, 6, 3)
fig += LINE((371, 264), (371, 416), LC, 4, '8 7')
fig += RECT(345, 330, 52, 46, DIM, MU3, 6, 2) + DOT((371, 353), PK, 7)
fig += T(371, 440, 'Lif', TX, 17)
add('8.1', 'SITUASI HARIAN', 'Lokus di sekeliling kita',
    P('Perhatikan laluan <b>satu titik</b> pada objek yang bergerak.', True)
    + TABLE(['Situasi', 'Lokus titik'],
            [['Hujung jarum jam', 'Bulatan'],
             ['Bandul jam / buaian berayun', 'Lengkok bulatan'],
             ['Hujung pintu dibuka 90°', 'Sukuan bulatan (lengkok)'],
             ['Lif bergerak naik dan turun', 'Garis lurus mencancang']], col, rv=True)
    + NOTE('Lokus bergantung pada <b>titik yang dipilih</b>: engsel pintu tidak bergerak langsung.'),
    svg(fig, 'Empat situasi harian: jarum jam, bandul, pintu dan lif'))

# (slaid dibuang 25 Nov: tiada dalam DSKP)
# 8.1-4 Contoh berlangkah: titik pada lokus (XP = 5 unit)
g = Grid(10, 10, (30, 20, 470, 440))
Pc = (5, 5)
CAND = {'A': (8, 9), 'B': (1, 2), 'C': (5, 0), 'D': (9, 7), 'E': (2, 2), 'F': (10, 5)}
assert round(dist(CAND['D'], Pc) ** 2) == 20 and round(dist(CAND['E'], Pc) ** 2) == 18
ON = sorted(k for k, v in CAND.items() if abs(dist(v, Pc) - 5) < 1e-9)
assert ON == ['A', 'B', 'C', 'F'], ON
fig = g.draw() + CIRC(g.p(*Pc), 5 * g.s, LC, 3.5, '10 8')
fig += g.pt(*Pc, 'P', TX, -14, -16)
for k, (x, y) in CAND.items():
    c_ = GR if k in ON else MU3
    dx = 16 if x < 9 else -16
    fig += DOT(g.p(x, y), c_, 7) + T(g.X(x) + dx, g.Y(y) - 16, k, c_, 19, 'start' if dx > 0 else 'end')
fig += LINE(g.p(*Pc), g.p(8, 5), AM, 3, '6 5') + LINE(g.p(8, 5), g.p(8, 9), AM, 3, '6 5') + LINE(g.p(*Pc), g.p(8, 9), GR, 3.5)
fig += T(g.X(6.5), g.Y(5) + 16, '3', AM, 17) + T(g.X(8) - 12, g.Y(7), '4', AM, 17, 'end')
add('8.1', 'CONTOH BERLANGKAH', 'Titik manakah pada lokus?',
    P('Titik X bergerak dengan keadaan jaraknya dari P sentiasa <b>5 unit</b>. Antara titik A hingga F, yang manakah terletak pada lokus X?', True)
    + STEPS(['Lokus X ialah bulatan berpusat P dengan jejari 5 unit.',
             f'Kira jarak setiap titik dari P. Contoh: PA = {RT('3² + 4²')} = {RT(25)} = {B("5", GR)} ✓',
             f'PB = {RT("4² + 3²")} = 5 ✓, PC = 5 ✓, PF = 5 ✓; PD = {RT("4² + 2²")} = {RT(20)} {B("✗", RD)}, PE = {RT("3² + 3²")} = {RT(18)} {B("✗", RD)}'], col)
    + ANS('A, B, C dan F'),
    svg(fig, 'Bulatan berjejari 5 unit berpusat P dengan titik A hingga F'))

# 8.1-5 Memerihalkan lokus: kambing & roda
TALI = 4; assert 2 * TALI == 8
JR = 30
fig = RECT(14, 14, 472, 236)
cK = (150, 132); rK = 92
fig += f'<circle cx="{cK[0]}" cy="{cK[1]}" r="{rK}" fill="{GR}14" stroke="{LC}" stroke-width="4" stroke-dasharray="10 8"/>'
kam = (cK[0] + rK * math.cos(math.radians(35)), cK[1] - rK * math.sin(math.radians(35)))
fig += LINE(cK, kam, AM, 3.5) + RECT(cK[0] - 6, cK[1] - 6, 12, 12, MU3, NAV, 3, 2)
fig += f'<ellipse cx="{r1(kam[0] + 6)}" cy="{r1(kam[1])}" rx="18" ry="11" fill="{TX}" stroke="{NAV}" stroke-width="2"/>' + DOT((kam[0] + 24, kam[1] - 8), TX, 7)
fig += T(cK[0] + 30, cK[1] + 2, '4 m', AM, 18, 'start') + T(cK[0] - 14, cK[1] + 22, 'T', TX, 18)
fig += T(300, 60, 'Kambing ditambat', TX, 18, 'start') + T(300, 86, 'pada tiang T', TX, 18, 'start')
fig += T(300, 130, 'Tali tegang →', MU3, 17, 'start') + T(300, 156, 'bulatan, jejari 4 m', PK, 18, 'start')
# roda
fig += RECT(14, 262, 472, 194)
road = 420; rw = 46
fig += LINE((30, road), (470, road), MU2, 5)
for cxw in (110, 300):
    fig += CIRC((cxw, road - rw), rw, MU3, 4) + DOT((cxw, road - rw), PK, 7)
fig += LINE((40, road - rw), (460, road - rw), LC, 4, '10 8')
fig += LINE((300, road - rw), (300, road), AM, 3, '5 4') + T(310, road - rw / 2, '30 cm', AM, 16, 'start')
fig += T(250, 290, 'Lokus pusat roda: garis lurus selari dengan jalan', MU3, 16, halo=False)
add('8.1', 'CONTOH BERLANGKAH', 'Memerihalkan lokus',
    P('Seekor kambing ditambat pada tiang T dengan tali sepanjang 4 m di padang yang rata. Huraikan lokus kedudukan kambing apabila talinya sentiasa tegang.', True)
    + STEPS(['Syarat: jarak kambing dari T sentiasa 4 m.',
             'Lokus: <b>bulatan</b> berpusat T dengan jejari 4 m.',
             'Jarak terjauh antara dua kedudukan kambing = diameter = 2 × 4 = 8 m.'], col)
    + ANS('Bulatan berpusat T, jejari 4 m')
    + NOTE(f'Pusat roda berjejari {JR} cm yang bergolek di atas jalan rata bergerak pada garis lurus selari dengan jalan, {JR} cm di atasnya.', 'Contoh lain:'),
    svg(fig, 'Kambing ditambat pada tiang dan pusat roda bergolek di atas jalan'))

# 8.1-6 Kesilapan biasa
fig = ''
CASES = [(52, 'Lokus = satu titik sahaja', False), (128, 'Lokus = set semua titik', True),
         (216, 'Hujung pintu 90° → bulatan penuh', False), (292, 'Hujung pintu 90° → sukuan bulatan', True),
         (380, 'Engsel pintu → lengkok', False)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 446, '✓ Engsel tidak bergerak (satu titik tetap)', GR, 17, halo=False)
add('8.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lokus bukan satu titik", RD)}: lokus ialah set <b>semua</b> titik yang memenuhi syarat.',
         f'{B("Lihat sudut pergerakan", RD)}: pintu dibuka 90° menghasilkan sukuan bulatan, bukan bulatan penuh.',
         f'{B("Pilih titik yang betul", RD)}: lokus hujung pintu, pemegang pintu dan engsel adalah berbeza.'], col)
    + NOTE('Tanya dua soalan: <b>Titik mana</b> yang bergerak? <b>Apakah syaratnya</b>?', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan betul dan salah tentang lokus'))

# ===================== 8.2 LOKUS DALAM DUA DIMENSI =====================
col = SUB['8.2'][1]

def compass(gp, c, r, a_mid, span=28, col_=AM):
    """Lengkok jangka lukis kecil berpusat c (unit) jejari r (unit) sekitar sudut a_mid."""
    return ARC(gp.p(*c), r * gp.s, a_mid - span, a_mid + span, col_, 3)

# 8.2-1 Jarak tetap dari satu titik -> bulatan
g = Grid(10, 10, (30, 20, 470, 440))
Pc = (5, 5); R0 = 3
fig = g.draw() + CIRC(g.p(*Pc), R0 * g.s, LC, 4.5)
xa = 55
Xp = (Pc[0] + R0 * math.cos(math.radians(xa)), Pc[1] + R0 * math.sin(math.radians(xa)))
assert abs(dist(Xp, Pc) - 3) < 1e-9
fig += LINE(g.p(*Pc), g.p(*Xp), AM, 4) + DOT(g.p(*Xp), PK, 8) + T(g.X(Xp[0]) + 14, g.Y(Xp[1]) - 14, 'X', PK, 20, 'start')
fig += T(g.X(5.5) - 26, g.Y(6.6), '3 unit', AM, 17, 'end')
fig += g.pt(*Pc, 'P', TX, 0, 22)
fig += T(250, 455, 'Lokus X: bulatan berpusat P, jejari 3 unit', MU3, 16, halo=False)
add('8.2', 'LOKUS 1', 'Jarak tetap dari satu titik',
    DEF('Lokus titik yang <b>jaraknya tetap</b> dari satu titik tetap P ialah sebuah <b>bulatan</b> berpusat P dengan jejari jarak itu.', col)
    + P('Bina lokus X dengan keadaan XP = 3 cm:', True)
    + STEPS(['Buka jangka lukis sebanyak 3 cm (gunakan pembaris).',
             'Letakkan mata jangka lukis di titik P.',
             'Lukis bulatan penuh. Bulatan itu ialah lokus X.'], col),
    svg(fig, 'Bulatan berpusat P dengan jejari 3 unit sebagai lokus X'))

# 8.2-2 Sama jarak dari dua titik -> pembahagi dua sama serenjang
g = Grid(10, 10, (30, 20, 470, 440))
Pp, Qp = (2, 4), (8, 4)
M = ((Pp[0] + Qp[0]) / 2, (Pp[1] + Qp[1]) / 2); assert M == (5, 4)
Xb = (5, 8); assert dist(Xb, Pp) == dist(Xb, Qp)
fig = g.draw()
ra = 4   # jejari lengkok (> separuh PQ = 3)
assert ra > dist(Pp, Qp) / 2
hy = math.sqrt(ra ** 2 - 3 ** 2)    # titik silang lengkok: (5, 4 ± √7)
for c_, base in ((Pp, 0), (Qp, 180)):
    ang = math.degrees(math.atan2(hy, 3))
    fig += compass(g, c_, ra, base + ang if base == 0 else 180 - ang, 16) + compass(g, c_, ra, -ang if base == 0 else 180 + ang, 16)
fig += LINE(g.p(*Pp), g.p(*Qp), TR, 4) + TICKS(g.p(*Pp), g.p(*M), TR) + TICKS(g.p(*M), g.p(*Qp), TR)
fig += LINE(g.p(5, 0.3), g.p(5, 9.7), LC, 4.5)
fig += right_angle(g.p(*M), (1, 0), (0, -1), TX, 14)
fig += LINE(g.p(*Xb), g.p(*Pp), MU3, 2.5, '6 5') + LINE(g.p(*Xb), g.p(*Qp), MU3, 2.5, '6 5')
fig += TICKS(g.p(*Xb), g.p(*Pp), AM, 2) + TICKS(g.p(*Xb), g.p(*Qp), AM, 2)
fig += DOT(g.p(*Xb), PK, 8) + T(g.X(5) + 14, g.Y(8) - 14, 'X', PK, 20, 'start')
fig += g.pt(*Pp, 'P', TX, -16, 0, 'end') + g.pt(*Qp, 'Q', TX, 16, 0, 'start') + T(g.X(5) + 16, g.Y(4) + 20, 'M', TR, 17, 'start')
add('8.2', 'LOKUS 2', 'Sama jarak dari dua titik',
    DEF('Lokus titik yang <b>sama jarak</b> dari dua titik tetap P dan Q ialah <b>pembahagi dua sama serenjang</b> bagi garis PQ.', col)
    + STEPS(['Buka jangka lukis lebih daripada separuh panjang PQ.',
             'Dengan mata di P, lukis lengkok di atas dan di bawah PQ. Ulang dari Q dengan bukaan yang sama.',
             'Sambungkan dua titik persilangan lengkok. Garis itu melalui titik tengah M dan berserenjang dengan PQ.'], col)
    + NOTE('Setiap titik X pada garis ini memenuhi XP = XQ.'),
    svg(fig, 'Pembahagi dua sama serenjang bagi PQ dengan lengkok pembinaan'))

# 8.2-3 Jarak tetap dari garis & sama jarak dari dua garis selari
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214)
# atas: garis AB, lokus 2 unit (60 px) di kedua-dua belah
yA = 121; dd = 58
fig += LINE((70, yA), (430, yA), TR, 5) + DOT((70, yA), TR) + DOT((430, yA), TR)
fig += T(56, yA, 'A', TR, 18, 'end') + T(444, yA, 'B', TR, 18, 'start')
fig += LINE((34, yA - dd), (466, yA - dd), LC, 4.5) + LINE((34, yA + dd), (466, yA + dd), LC, 4.5)
fig += LINE((250, yA), (250, yA - dd), AM, 3, '5 4') + LINE((300, yA), (300, yA + dd), AM, 3, '5 4')
fig += T(258, yA - dd / 2, '2 cm', AM, 16, 'start') + T(308, yA + dd / 2, '2 cm', AM, 16, 'start')
fig += right_angle((250, yA), (1, 0), (0, -1), TX, 11)
# bawah: dua garis selari, lokus garis tengah
y1, y2 = 290, 410; ym = (y1 + y2) / 2; assert ym == 350
fig += LINE((34, y1), (466, y1), TR, 5) + LINE((34, y2), (466, y2), TR, 5)
fig += T(40, y1 - 16, 'garis 1', TR, 15, 'start') + T(40, y2 + 18, 'garis 2', TR, 15, 'start')
fig += LINE((34, ym), (466, ym), LC, 4.5)
fig += LINE((360, y1), (360, ym), AM, 3, '5 4') + LINE((360, ym), (360, y2), AM, 3, '5 4')
fig += TICKS((360, y1), (360, ym), AM) + TICKS((360, ym), (360, y2), AM)
fig += DOT((200, ym), PK, 8) + T(200, ym - 18, 'X', PK, 19)
add('8.2', 'LOKUS 3 & 4', 'Jarak dari garis lurus',
    BUL([f'{B("Lokus 3", col)}: lokus titik yang berjarak tetap <i>d</i> dari garis lurus AB ialah <b>sepasang garis lurus</b> yang selari dengan AB, sejauh <i>d</i> di kedua-dua belah AB.',
         f'{B("Lokus 4", col)}: lokus titik yang sama jarak dari dua garis selari ialah <b>garis lurus selari di tengah-tengah</b> kedua-dua garis itu.'], col)
    + NOTE('Jarak dari garis diukur secara <b>serenjang</b> (sudut tegak) dengan garis itu.'),
    svg(fig, 'Sepasang garis selari 2 cm dari AB, dan garis tengah antara dua garis selari'))

# 8.2-4 Sama jarak dari dua garis bersilang -> pembahagi dua sama sudut
O = (90, 380); L1 = 0; L2 = 60; half = (L1 + L2) / 2; assert half == 30
def ray(a, L): return (O[0] + L * math.cos(math.radians(a)), O[1] - L * math.sin(math.radians(a)))
fig = LINE(O, ray(L1, 380), TR, 5) + LINE(O, ray(L2, 380), TR, 5)
fig += T(*ray(L1, 392), '', TX)
ra = 110; rb = 120
fig += ARC(O, ra, -8, 68, AM, 3)
Pa, Pb = ray(L1, ra), ray(L2, ra)
# lengkok dari Pa dan Pb (jejari sama) bersilang pada garis pembahagi
ang = math.radians(half)
# titik silang pada pembahagi: |K - Pa| = rb
# K = O + t(u); selesaikan |O + t u - Pa| = rb
ux, uy = math.cos(ang), -math.sin(ang)
dx0, dy0 = O[0] - Pa[0], O[1] - Pa[1]
bq = 2 * (ux * dx0 + uy * dy0); cq_ = dx0 ** 2 + dy0 ** 2 - rb ** 2
t = (-bq + math.sqrt(bq ** 2 - 4 * cq_)) / 2
K = (O[0] + t * ux, O[1] + t * uy)
assert abs(dist(K, Pa) - rb) < 1e-6 and abs(dist(K, Pb) - rb) < 1e-6
for Pq in (Pa, Pb):
    a_ = math.degrees(math.atan2(-(K[1] - Pq[1]), K[0] - Pq[0]))
    fig += ARC(Pq, rb, a_ - 12, a_ + 12, AM, 3)
fig += DOT(Pa, AM, 5) + DOT(Pb, AM, 5)
fig += LINE(O, ray(half, 400), LC, 4.5)
Xs = ray(half, 300)
# kaki serenjang ke dua garis
f1 = (Xs[0], O[1])
tt = (Xs[0] - O[0]) * math.cos(math.radians(L2)) + (O[1] - Xs[1]) * math.sin(math.radians(L2))
f2 = ray(L2, tt)
assert abs(dist(Xs, f1) - dist(Xs, f2)) < 1e-6
fig += LINE(Xs, f1, MU3, 2.5, '6 5') + LINE(Xs, f2, MU3, 2.5, '6 5')
fig += TICKS(Xs, f1, AM, 2) + TICKS(Xs, f2, AM, 2)
fig += DOT(Xs, PK, 8) + T(Xs[0] + 16, Xs[1] - 6, 'X', PK, 20, 'start') + DOT(O, TX, 6) + T(O[0] - 14, O[1] + 14, 'O', TX, 19, 'end')
fig += T(O[0] + 150, O[1] - 30, '30°', MU3, 16) + T(O[0] + 120, O[1] - 92, '30°', MU3, 16)
fig += T(250, 40, 'Lokus X membahagi dua sama sudut', MU3, 16, halo=False)
add('8.2', 'LOKUS 5', 'Sama jarak dari dua garis bersilang',
    DEF('Lokus titik yang <b>sama jarak</b> dari dua garis bersilang ialah <b>pembahagi dua sama sudut</b> antara garis itu.', col)
    + STEPS(['Dengan mata jangka lukis di O, lukis lengkok yang memotong kedua-dua garis.',
             'Dari setiap titik potong, lukis lengkok dengan bukaan yang sama sehingga bersilang.',
             'Sambungkan O dengan titik silang itu.'], col)
    + NOTE('Bagi dua garis bersilang yang penuh, lokusnya ialah <b>sepasang garis</b> yang berserenjang.'),
    svg(fig, 'Pembahagi dua sama sudut dengan lengkok pembinaan'))

# 8.2-5 Ringkasan lima lokus
ROWS = [('Jarak tetap dari satu titik', 'Bulatan'), ('Sama jarak dari dua titik', 'Pembahagi dua sama serenjang'),
        ('Jarak tetap dari satu garis', 'Sepasang garis selari'), ('Sama jarak dari dua garis selari', 'Garis selari di tengah'),
        ('Sama jarak dari dua garis bersilang', 'Pembahagi dua sama sudut')]
fig = ''
for i in range(5):
    y0 = 10 + i * 90
    fig += RECT(14, y0, 472, 82, SURF, BD, 14, 2)
    cx_, cy_ = 62, y0 + 41
    if i == 0:
        fig += CIRC((cx_, cy_), 28, LC, 3.5) + DOT((cx_, cy_), TX, 4)
    elif i == 1:
        fig += DOT((cx_ - 26, cy_), TX, 4) + DOT((cx_ + 26, cy_), TX, 4) + LINE((cx_, cy_ - 32), (cx_, cy_ + 32), LC, 3.5)
    elif i == 2:
        fig += LINE((cx_ - 32, cy_), (cx_ + 32, cy_), TR, 3.5) + LINE((cx_ - 32, cy_ - 20), (cx_ + 32, cy_ - 20), LC, 3.5) + LINE((cx_ - 32, cy_ + 20), (cx_ + 32, cy_ + 20), LC, 3.5)
    elif i == 3:
        fig += LINE((cx_ - 32, cy_ - 24), (cx_ + 32, cy_ - 24), TR, 3.5) + LINE((cx_ - 32, cy_ + 24), (cx_ + 32, cy_ + 24), TR, 3.5) + LINE((cx_ - 32, cy_), (cx_ + 32, cy_), LC, 3.5)
    else:
        o_ = (cx_ - 30, cy_ + 26)
        fig += LINE(o_, (cx_ + 34, cy_ + 26), TR, 3.5) + LINE(o_, (cx_ + 4, cy_ - 32), TR, 3.5) + LINE(o_, (cx_ + 34, cy_ - 12), LC, 3.5)
    fig += T(112, y0 + 28, ROWS[i][0], TX, 17, 'start') + T(112, y0 + 56, '→ ' + ROWS[i][1], LC, 17, 'start')
add('8.2', 'RINGKASAN', 'Lima lokus asas',
    TABLE(['Syarat titik X', 'Lokus X'], [[a, b] for a, b in ROWS], col, rv=True)
    + NOTE('Gunakan <b>jangka lukis</b> dan <b>pembaris</b> untuk membina setiap lokus dengan tepat.'),
    svg(fig, 'Ringkasan lima lokus asas'))

# 8.2-6 Persilangan dua lokus (contoh berlangkah)
g = Grid(8, 8, (40, 24, 470, 440))
A_, B_, C_, D_ = (1, 1), (7, 1), (7, 7), (1, 7)      # segi empat sama sisi 6 unit (sudut grid)
# X: sama jarak dari A dan B -> garis x = 4 ; Y: jarak 5 unit dari A -> bulatan
xb = (A_[0] + B_[0]) / 2; assert xb == 4
yint = A_[1] + math.sqrt(25 - (xb - A_[0]) ** 2); assert yint == 5
INT = (xb, yint); assert dist(INT, A_) == 5 and dist(INT, A_) == 5 and dist(INT, A_) - dist(INT, B_) == 0
fig = g.draw() + POLY([g.p(*A_), g.p(*B_), g.p(*C_), g.p(*D_)], f'{TR}10', TR, 4)
fig += f'<clipPath id="lk-sq"><rect x="{r1(g.X(1))}" y="{r1(g.Y(7))}" width="{r1(6 * g.s)}" height="{r1(6 * g.s)}"/></clipPath>'
fig += f'<g clip-path="url(#lk-sq)">' + CIRC(g.p(*A_), 5 * g.s, PU, 4.5, '10 7') + '</g>'
fig += LINE(g.p(4, 1), g.p(4, 7), LC, 4.5, '10 7')
fig += LINE(g.p(*A_), g.p(*INT), AM, 3) + T(g.X(2.2), g.Y(3.4), '5', AM, 18)
fig += f'<circle cx="{r1(g.X(4))}" cy="{r1(g.Y(5))}" r="15" fill="none" stroke="{GR}" stroke-width="3.5"/>' + DOT(g.p(*INT), GR, 7)
fig += T(g.X(4) + 20, g.Y(5) - 18, 'T', GR, 20, 'start')
for nm, p_, dx, dy, an in (('A', A_, -12, 14, 'end'), ('B', B_, 12, 14, 'start'), ('C', C_, 12, -14, 'start'), ('D', D_, -12, -14, 'end')):
    fig += DOT(g.p(*p_), TR, 6) + T(g.X(p_[0]) + dx, g.Y(p_[1]) + dy, nm, TR, 20, an)
fig += T(g.X(4) + 10, g.Y(1.5), 'X', LC, 18, 'start') + T(g.X(5.9), g.Y(2.9), 'Y', PU, 18)
fig += T(250, 455, 'Sisi segi empat sama = 6 unit', MU3, 16, halo=False)
add('8.2', 'PERSILANGAN LOKUS', 'Titik yang memenuhi dua syarat',
    P('ABCD ialah segi empat sama bersisi 6 unit. Di dalam ABCD, X sama jarak dari A dan B, manakala Y berjarak 5 unit dari A. Cari titik persilangan lokus X dan lokus Y.', True)
    + STEPS([f'Lokus {B("X", LC)}: pembahagi dua sama serenjang AB, iaitu garis mencancang melalui titik tengah AB (3 unit dari A).',
             f'Lokus {B("Y", PU)}: lengkok bulatan berpusat A dengan jejari 5 unit.',
             'Pada garis X: jarak mengufuk dari A = 3, jadi tinggi = ' + RT('5² − 3²') + ' = ' + RT(16) + ' = 4 unit dari AB.'], col)
    + ANS('Titik T: 3 unit dari AD dan 4 unit dari AB'),
    svg(fig, 'Persilangan pembahagi dua sama serenjang AB dengan lengkok berpusat A'))

# 8.2-7 Kesilapan biasa
fig = ''
CASES = [(48, '2 cm dari garis AB → satu garis', False), (124, '2 cm dari garis AB → dua garis', True),
         (212, 'XP = XQ → garis melalui P dan Q', False), (288, 'XP = XQ → ⊥ PQ di titik tengah', True),
         (376, 'Lengkok jangka lukis berbeza saiz', False)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 446, '✓ Kekalkan bukaan jangka lukis yang sama', GR, 17, halo=False)
add('8.2', 'KESILAPAN BIASA', 'Semak lokus anda',
    BUL([f'{B("Lupa sebelah lagi", RD)}: jarak tetap dari garis menghasilkan <b>dua</b> garis selari (kecuali dihadkan dalam satu rantau).',
         f'{B("Pembahagi salah", RD)}: lokus sama jarak dari P dan Q mesti <b>berserenjang</b> dengan PQ dan melalui titik tengahnya.',
         f'{B("Persilangan", RD)}: titik yang memenuhi dua syarat ialah titik <b>persilangan</b> dua lokus. Mungkin ada 0, 1, 2 atau lebih titik.'], col)
    + NOTE('Lukis setiap lokus dengan jelas, kemudian tandakan titik persilangan.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan betul dan salah tentang membina lokus'))

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
assert 'NaN' not in js_body and 'None' not in js_body and not re.search(r'\bnan\b', js_body)
assert counts == {'8.1': 5, '8.2': 7}, counts

js = ('/* Dijana oleh tools/lokus/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
