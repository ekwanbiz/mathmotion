# Penjana slaid NOTA CIRCMOTION (Tingkatan 2 Bab 5 Bulatan) -> circmotion/slides.js
# Jalankan:  python3 tools/circmotion/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'circmotion', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '5.1': ('Sifat Bulatan', C['pa']),
    '5.2': ('Sifat Simetri Perentas', C['tr']),
    '5.3': ('Lilitan dan Luas Bulatan', C['gr']),
}

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
def NOTE(t):
    return f'<div class="sl-note"><b>Ingat:</b> {t}</div>'
def FR(a, b):
    """Pecahan bertingkat dalam teks slaid."""
    return ('<span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; '
            'line-height: 1.1; font-size: 0.85em; margin: 0 2px"><span style="padding: 0 4px; border-bottom: 2px solid currentColor">'
            f'{a}</span><span>{b}</span></span>')
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')

PI7 = FR(22, 7)

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'

def r1(v): return round(v, 1)

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')

def CIRC(cx, cy, r, col=MU, sw=3.5, fill='none', dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{r1(r)}" fill="{fill}" stroke="{col}" stroke-width="{sw}"{d}/>'

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'

class Bul:
    """Bulatan dengan pusat (cx, cy) dan jejari r piksel. Sudut dalam darjah, arah lawan jam (paksi-y ke atas)."""
    def __init__(self, cx=250, cy=235, r=170):
        self.cx, self.cy, self.r = cx, cy, r
    @property
    def O(self): return (self.cx, self.cy)
    def at(self, a, r=None):
        r = self.r if r is None else r
        t = math.radians(a)
        return (self.cx + r * math.cos(t), self.cy - r * math.sin(t))
    def arc_d(self, a1, a2, r=None):
        r = self.r if r is None else r
        p, q = self.at(a1, r), self.at(a2, r)
        large = 1 if (a2 - a1) % 360 > 180 else 0
        return f'M{r1(p[0])} {r1(p[1])} A{r1(r)} {r1(r)} 0 {large} 0 {r1(q[0])} {r1(q[1])}'
    def arc(self, a1, a2, col, sw=7, r=None):
        return f'<path d="{self.arc_d(a1, a2, r)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'
    def sector(self, a1, a2, col, op='40', sw=3):
        p, q = self.at(a1), self.at(a2)
        large = 1 if (a2 - a1) % 360 > 180 else 0
        return (f'<path d="M{r1(self.cx)} {r1(self.cy)} L{r1(p[0])} {r1(p[1])} A{self.r} {self.r} 0 {large} 0 {r1(q[0])} {r1(q[1])} Z" '
                f'fill="{col}{op}" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>')
    def segment(self, a1, a2, col, op='40', sw=3):
        return f'<path d="{self.arc_d(a1, a2)} Z" fill="{col}{op}" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>'
    def outline(self, col=MU, sw=3.5, fill='none'):
        return CIRC(self.cx, self.cy, self.r, col, sw, fill)
    def centre(self, col=TX, lab='O', dx=-20, dy=18):
        return DOT(self.O, col, 6) + (T(self.cx + dx, self.cy + dy, lab, col, 20, italic=False) if lab else '')
    def lab(self, a, t, col=TX, k=28, size=21):
        p = self.at(a, self.r + k)
        return T(p[0], p[1], t, col, size)

def mid(p, q): return ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
def unit(p, q):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    return (dx / L, dy / L)

def right_angle(M, u, v, col=TX, k=15):
    """Tanda sudut tegak di M; u, v = vektor unit sepanjang dua garis."""
    a = (M[0] + u[0] * k, M[1] + u[1] * k)
    b = (a[0] + v[0] * k, a[1] + v[1] * k)
    c = (M[0] + v[0] * k, M[1] + v[1] * k)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} L{r1(c[0])} {r1(c[1])}" fill="none" stroke="{col}" stroke-width="2.5"/>'

def ticks(p, q, col=C['am'], n=1, k=10, gap=7):
    """Tanda sama panjang (n garis kecil) di tengah ruas pq."""
    m = mid(p, q); u = unit(p, q); nx, ny = -u[1], u[0]
    s = ''
    for i in range(n):
        o = (i - (n - 1) / 2) * gap
        c = (m[0] + u[0] * o, m[1] + u[1] * o)
        s += LINE((c[0] - nx * k, c[1] - ny * k), (c[0] + nx * k, c[1] + ny * k), col, 3)
    return s

def side_label(p, q, t, col, off=24, size=20, toward=None):
    """Label di tengah ruas pq, dianjak secara normal. toward = titik; label dianjak MENJAUHI titik itu."""
    m = mid(p, q); u = unit(p, q); nx, ny = -u[1], u[0]
    if toward is not None:
        if (toward[0] - m[0]) * nx + (toward[1] - m[1]) * ny > 0: nx, ny = -nx, -ny
    return T(m[0] + nx * off, m[1] + ny * off, t, col, size)

def angle_arc(O, a1, a2, r, col, sw=3):
    b = Bul(O[0], O[1], r)
    return b.arc(a1, a2, col, sw)

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ===================== 5.1 SIFAT BULATAN =====================
col = SUB['5.1'][1]

# 5.1-1 Apa itu bulatan
b = Bul()
A, Bp, Cp = b.at(40), b.at(160), b.at(340)
fig = (b.outline(MU, 3.5, f'{col}12') + LINE(Bp, Cp, TR, 5) + LINE(b.O, A, AM, 5) + b.centre(TX, 'O', 0, 26)
       + DOT(A, AM) + DOT(Bp, TR) + DOT(Cp, TR)
       + b.lab(40, 'A', AM) + b.lab(160, 'B', TR) + b.lab(340, 'C', TR)
       + side_label(b.O, A, 'jejari', AM, 24, 20, toward=b.at(200))
       + side_label(Bp, b.O, 'diameter', TR, 24, 20, toward=b.at(250))
       + b.lab(110, 'lilitan', MU, 30, 19)
       + T(250, 448, 'Pusat O · jejari OA · diameter BC', MU, 17, halo=False))
add('5.1', 'DEFINISI', 'Apa itu bulatan?',
    DEF('<b>Bulatan</b> ialah set titik yang <b>sama jarak</b> dari satu titik tetap. Titik tetap itu dinamakan <b>pusat</b>.', col)
    + BUL([f'{B("Pusat", TX)} (O): titik tetap di tengah-tengah bulatan.',
           f'{B("Jejari", AM)}: garis lurus dari pusat ke satu titik pada lilitan.',
           f'{B("Diameter", TR)}: garis lurus yang melalui pusat dan menyambungkan dua titik pada lilitan.'], col)
    + NOTE('Semua jejari bagi satu bulatan adalah <b>sama panjang</b>.'),
    svg(fig, 'Bulatan berpusat O dengan jejari OA dan diameter BC'))

# 5.1-2 Bahagian bulatan
b = Bul(250, 228, 165)
fig = (b.outline(MU, 3.5)
       + b.sector(25, 95, PU, '40')
       + b.segment(215, 320, PK, '40')
       + b.arc(125, 190, GR, 9)
       + LINE(b.at(215), b.at(320), PA, 5)
       + b.centre(TX, 'O', -24, 12)
       + T(*b.at(60, 105), 'sektor', PU, 20)
       + T(b.cx + 2, b.at(268, 140)[1], 'tembereng', PK, 19)
       + side_label(b.at(215), b.at(320), 'perentas', PA, 22, 19, toward=b.at(268, 150))
       + b.lab(157, 'lengkok', GR, 48, 20)
       + b.lab(345, 'lilitan', MU, 40, 19))
add('5.1', 'KONSEP', 'Bahagian bulatan',
    BUL([f'{B("Perentas", PA)}: garis lurus yang menyambungkan dua titik pada lilitan.',
         f'{B("Lengkok", GR)}: sebahagian daripada lilitan.',
         f'{B("Sektor", PU)}: kawasan yang dibatasi oleh dua jejari dan satu lengkok.',
         f'{B("Tembereng", PK)}: kawasan yang dibatasi oleh satu perentas dan satu lengkok.',
         f'{B("Lilitan", MU3)}: sempadan bulatan, iaitu panjang keliling bulatan.'], col)
    + NOTE('Lengkok, sektor dan tembereng boleh jadi <b>minor</b> (lebih kecil) atau <b>major</b> (lebih besar).'),
    svg(fig, 'Bulatan yang menunjukkan perentas, lengkok, sektor, tembereng dan lilitan'))

# 5.1-3 Diameter = 2 x jejari
b = Bul(250, 215, 170)
L, R_ = b.at(180), b.at(0)
fig = (b.outline(MU, 3.5, f'{col}10')
       + LINE(L, b.O, AM, 5) + LINE(b.O, R_, PK, 5)
       + DOT(L, TX) + DOT(R_, TX) + b.centre(TX, 'O', 0, 26)
       + T(b.cx - 85, b.cy - 24, 'j', AM, 26, italic=True) + T(b.cx + 85, b.cy - 24, 'j', PK, 26, italic=True)
       + b.lab(180, 'A', TX, 24) + b.lab(0, 'B', TX, 24)
       # garis ukuran diameter
       + LINE((L[0], 420), (R_[0], 420), TR, 3) + LINE((L[0], 408), (L[0], 432), TR, 3) + LINE((R_[0], 408), (R_[0], 432), TR, 3)
       + f'<rect x="205" y="405" width="90" height="30" fill="{NAV}"/>' + T(250, 420, 'd = 2j', TR, 22, italic=True, halo=False)
       + LINE((L[0], 222), (L[0], 400), DIM, 2, '4 6') + LINE((R_[0], 222), (R_[0], 400), DIM, 2, '4 6'))
add('5.1', 'RUMUS', 'Diameter = 2 × jejari',
    DEF('<b>Diameter</b> = 2 × <b>jejari</b> &nbsp;&nbsp; <i>d</i> = 2<i>j</i><br><b>Jejari</b> = diameter ÷ 2 &nbsp;&nbsp; <i>j</i> = <i>d</i> ÷ 2', col)
    + P('Diameter AB terdiri daripada dua jejari: OA dan OB.')
    + STEPS(['Jejari = 7 cm → diameter = 2 × 7 = <b>14 cm</b>',
             'Diameter = 18 cm → jejari = 18 ÷ 2 = <b>9 cm</b>',
             'Jejari = 4.5 cm → diameter = 2 × 4.5 = <b>9 cm</b>'], col)
    + NOTE('Diameter ialah <b>perentas yang paling panjang</b> dalam bulatan.'),
    svg(fig, 'Diameter AB sama dengan dua kali jejari'))

# 5.1-4 Contoh: kenal pasti bahagian
b = Bul(250, 230, 165)
Pp, Q, Rr, Sp, Tp = b.at(60), b.at(150), b.at(330), b.at(215), b.at(295)
fig = (b.outline(MU, 3.5)
       + b.sector(60, 150, PU, '33', 0)
       + b.segment(215, 295, PK, '33', 0)
       + LINE(Q, Rr, TX, 4) + LINE(b.O, Pp, TX, 4) + LINE(Sp, Tp, TX, 4)
       + b.centre(TX, 'O', -14, 22)
       + ''.join(DOT(p) for p in (Pp, Q, Rr, Sp, Tp))
       + b.lab(60, 'P') + b.lab(150, 'Q') + b.lab(330, 'R') + b.lab(215, 'S') + b.lab(295, 'T')
       + T(*b.at(108, 100), 'X', PU, 26) + T(*b.at(255, 147), 'Y', PK, 22))
add('5.1', 'CONTOH BERLANGKAH', 'Kenal pasti bahagian bulatan',
    P('Bulatan berpusat O. Namakan setiap bahagian.')
    + STEPS([f'<b>OP</b> → {B("jejari", TX)} (dari pusat ke lilitan)',
             f'<b>QR</b> → {B("diameter", TX)} (melalui pusat O)',
             f'<b>ST</b> → {B("perentas", TX)} (tidak melalui pusat)',
             f'Kawasan <b style="color: {PU}">X</b> → {B("sektor", PU)} · kawasan <b style="color: {PK}">Y</b> → {B("tembereng", PK)}'], col)
    + ANS('jejari, diameter, perentas, sektor, tembereng'),
    svg(fig, 'Bulatan berpusat O dengan jejari OP, diameter QR, perentas ST, sektor X dan tembereng Y'))

# ===================== 5.2 SIFAT SIMETRI PERENTAS =====================
col = SUB['5.2'][1]

def chord_fig(b, a1, a2, n1, n2, mlab, colc=TR, cold=AM, tick_n=1, show_line=True, extend=False):
    """Perentas a1-a2 dengan garis serenjang dari pusat ke titik tengah."""
    A, Bq = b.at(a1), b.at(a2)
    M = mid(A, Bq); u = unit(A, Bq); v = unit(M, b.O)
    s = LINE(A, Bq, colc, 5)
    if show_line:
        if extend:  # garis penuh melalui pusat (paksi simetri)
            am = (a1 + a2) / 2
            s += LINE(b.at(am + 180, b.r + 18), b.at(am, b.r + 18), cold, 3, '10 7')
        else:
            s += LINE(b.O, M, cold, 3.5, '9 6')
        s += right_angle(M, u, v, TX)
    s += ticks(A, M, AM if colc != AM else PK, tick_n) + ticks(M, Bq, AM if colc != AM else PK, tick_n)
    s += DOT(A, colc) + DOT(Bq, colc) + DOT(M, cold, 6)
    am = (a1 + a2) / 2
    s += b.lab(a1, n1, TX, 26) + b.lab(a2, n2, TX, 26)
    mp = (M[0] - v[0] * 26, M[1] - v[1] * 26) if not extend else (M[0] + u[0] * 26 - v[0] * 24, M[1] + u[1] * 26 - v[1] * 24)
    s += T(mp[0], mp[1], mlab, cold, 20)
    return s

# 5.2-1 Pembahagi dua sama serenjang melalui pusat
b = Bul(250, 225, 170)
fig = (b.outline(MU, 3.5) + chord_fig(b, 215, 325, 'A', 'B', 'M', extend=True) + b.centre(TX, 'O', -22, 0)
       + T(250, 455, 'AM = MB · OM ⊥ AB', MU, 18, halo=False))
add('5.2', 'SIFAT', 'Pembahagi dua sama serenjang perentas',
    DEF('<b>Pembahagi dua sama serenjang</b> bagi sebarang perentas akan <b>melalui pusat</b> bulatan.', col)
    + BUL(['Garis dari pusat O yang <b>berserenjang</b> dengan perentas AB membahagi dua sama AB, iaitu <b>AM = MB</b>.',
           'Sebaliknya, garis dari pusat O ke titik tengah M adalah serenjang dengan perentas: <b>OM ⊥ AB</b>.',
           'Garis itu ialah <b>paksi simetri</b> bulatan. Diameter yang berserenjang dengan perentas membahagi dua sama perentas itu.'], col),
    svg(fig, 'Perentas AB dengan pembahagi dua sama serenjang yang melalui pusat O'))

# 5.2-2 Perentas sama panjang, sama jarak dari pusat
b = Bul(250, 230, 170)
def eq_chord(a1, a2, n1, n2, ml):
    A, Bq = b.at(a1), b.at(a2); M = mid(A, Bq); u = unit(A, Bq); v = unit(M, b.O)
    s = LINE(A, Bq, TR, 5) + LINE(b.O, M, AM, 3.5, '9 6') + right_angle(M, u, v, TX)
    s += ticks(A, M, PK, 1, 11) + ticks(M, Bq, PK, 1, 11) + ticks(b.O, M, AM, 2, 9, 7)
    s += DOT(A, TR) + DOT(Bq, TR) + DOT(M, AM, 6)
    s += b.lab(a1, n1, TX, 26) + b.lab(a2, n2, TX, 26)
    s += T(M[0] - v[0] * 24, M[1] - v[1] * 24, ml, AM, 20)
    return s
fig = (b.outline(MU, 3.5) + eq_chord(25, 125, 'B', 'A', 'M') + eq_chord(165, 265, 'C', 'D', 'N') + b.centre(TX, 'O', 22, 14)
       + T(250, 455, 'Jika AB = CD, maka OM = ON', MU, 18, halo=False))
add('5.2', 'SIFAT', 'Perentas sama panjang',
    DEF('Perentas yang <b>sama panjang</b> adalah <b>sama jarak</b> dari pusat bulatan.', col)
    + BUL(['Jika AB = CD, maka OM = ON.',
           'Sebaliknya, perentas yang sama jarak dari pusat adalah sama panjang: jika OM = ON, maka AB = CD.',
           'Jarak perentas dari pusat diukur secara <b>serenjang</b> (garis terpendek dari O ke perentas).'], col)
    + NOTE('Perentas yang lebih <b>dekat</b> dengan pusat adalah lebih <b>panjang</b>.'),
    svg(fig, 'Dua perentas sama panjang AB dan CD yang sama jarak dari pusat O'))

# 5.2-3 Mencari pusat dengan dua perentas
b = Bul(250, 228, 160)
def bisector(a1, a2, n1, n2, colc, colb):
    A, Bq = b.at(a1), b.at(a2); M = mid(A, Bq); u = unit(A, Bq); v = unit(M, b.O)
    far = (M[0] + v[0] * (2 * b.r + 10), M[1] + v[1] * (2 * b.r + 10))
    near = (M[0] - v[0] * 26, M[1] - v[1] * 26)
    s = LINE(near, far, colb, 3, '10 7') + LINE(A, Bq, colc, 5) + right_angle(M, u, v, TX, 13)
    s += ticks(A, M, colb, 1, 9) + ticks(M, Bq, colb, 1, 9)
    s += DOT(A, colc) + DOT(Bq, colc)
    s += b.lab(a1, n1, TX, 24) + b.lab(a2, n2, TX, 24)
    return s
fig = CIRC(b.cx, b.cy, b.r, MU2, 3, 'none', '8 7')
fig += bisector(200, 285, 'A', 'B', TR, AM) + bisector(345, 60, 'C', 'D', PA, PK)
fig += f'<circle cx="{b.cx}" cy="{b.cy}" r="12" fill="none" stroke="{GR}" stroke-width="3"/>' + DOT(b.O, GR, 6.5) + T(b.cx - 24, b.cy - 26, 'O', GR, 22)
fig += T(250, 455, 'Titik persilangan = pusat bulatan', MU, 18, halo=False)
add('5.2', 'KONSEP', 'Mencari pusat bulatan',
    P('Gunakan <b>dua perentas</b> dan sifat pembahagi dua sama serenjang.')
    + STEPS(['Lukis dua perentas AB dan CD yang <b>tidak selari</b>.',
             'Bina <b>pembahagi dua sama serenjang</b> bagi perentas AB.',
             'Bina pembahagi dua sama serenjang bagi perentas CD.',
             'Titik <b>persilangan</b> kedua-dua garis itu ialah <b>pusat O</b>.'], col)
    + NOTE('Kedua-dua pembahagi dua sama serenjang melalui pusat, jadi ia bersilang di pusat.'),
    svg(fig, 'Pembahagi dua sama serenjang bagi perentas AB dan CD bersilang di pusat O'))

# 5.2-4 Contoh: cari panjang perentas (5, 3, 4)
SC = 34  # piksel per cm (jejari 5 cm = 170 px)
b = Bul(250, 205, 5 * SC)
dM = 3 * SC; hM = 4 * SC
A, Bq, M = (b.cx - hM, b.cy + dM), (b.cx + hM, b.cy + dM), (b.cx, b.cy + dM)
fig = (b.outline(MU, 3.5)
       + f'<polygon points="{b.cx},{b.cy} {r1(A[0])},{r1(A[1])} {M[0]},{M[1]}" fill="{TR}26" stroke="none"/>'
       + LINE(A, Bq, TR, 5) + LINE(b.O, M, AM, 4) + LINE(b.O, A, PK, 4)
       + right_angle(M, (-1, 0), (0, -1), TX)
       + DOT(A, TR) + DOT(Bq, TR) + DOT(M, AM, 6) + b.centre(TX, 'O', 0, -24)
       + T(A[0] - 20, A[1] + 14, 'A', TX) + T(Bq[0] + 20, Bq[1] + 14, 'B', TX) + T(M[0], M[1] + 26, 'M', AM)
       + T(b.cx + 24, b.cy + dM / 2, '3 cm', AM, 19, 'start')
       + side_label(b.O, A, '5 cm', PK, 24, 19, toward=M)
       + T((A[0] + M[0]) / 2, M[1] + 28, '?', TR, 22))
add('5.2', 'CONTOH BERLANGKAH', 'Mencari panjang perentas',
    P('Jejari bulatan ialah 5 cm. Jarak perentas AB dari pusat O ialah 3 cm. Cari panjang AB.')
    + STEPS(['OM ⊥ AB, maka M ialah titik tengah AB dan ∆OMA bersudut tegak di M.',
             'Teorem Pythagoras: AM² = OA² − OM² = 5² − 3² = 25 − 9 = 16',
             'AM = √16 = 4 cm, maka AB = 2 × 4 = 8 cm'], col)
    + ANS('AB = 8 cm'),
    svg(fig, 'Bulatan berjejari 5 cm, perentas AB berjarak 3 cm dari pusat O'))

# 5.2-5 Contoh: cari jarak perentas dari pusat (10, 8, 6)
SC = 17  # jejari 10 cm = 170 px
b = Bul(250, 215, 10 * SC)
dM = 6 * SC; hM = 8 * SC
# perentas PQ di atas pusat
Pq, Qq, M = (b.cx - hM, b.cy - dM), (b.cx + hM, b.cy - dM), (b.cx, b.cy - dM)
fig = (b.outline(MU, 3.5)
       + f'<polygon points="{b.cx},{b.cy} {r1(Qq[0])},{r1(Qq[1])} {M[0]},{M[1]}" fill="{TR}26" stroke="none"/>'
       + LINE(Pq, Qq, TR, 5) + LINE(b.O, M, AM, 4) + LINE(b.O, Qq, PK, 4)
       + right_angle(M, (1, 0), (0, 1), TX)
       + DOT(Pq, TR) + DOT(Qq, TR) + DOT(M, AM, 6) + b.centre(TX, 'O', 0, 26)
       + T(Pq[0] - 22, Pq[1] - 10, 'P', TX) + T(Qq[0] + 22, Qq[1] - 10, 'Q', TX) + T(M[0], M[1] - 26, 'M', AM)
       + T(b.cx - 22, b.cy - dM / 2, '?', AM, 22, 'end')
       + side_label(b.O, Qq, '10 cm', PK, 26, 19, toward=M)
       + T(250, 455, 'PQ = 16 cm', TR, 19, halo=False))
add('5.2', 'CONTOH BERLANGKAH', 'Mencari jarak perentas dari pusat',
    P('Jejari bulatan ialah 10 cm dan panjang perentas PQ ialah 16 cm. Cari jarak PQ dari pusat O.')
    + STEPS(['OM ⊥ PQ, maka PM = MQ = 16 ÷ 2 = 8 cm.',
             'Dalam ∆OMQ: OM² = OQ² − MQ² = 10² − 8² = 100 − 64 = 36',
             'OM = √36 = 6 cm'], col)
    + ANS('Jarak PQ dari pusat O = 6 cm')
    + NOTE('Untuk mencari <b>jejari</b>, guna OQ² = OM² + MQ².'),
    svg(fig, 'Bulatan berjejari 10 cm, perentas PQ sepanjang 16 cm'))

# ===================== 5.3 LILITAN DAN LUAS BULATAN =====================
col = SUB['5.3'][1]

# 5.3-1 Nilai pi: lilitan digolek
d = 104; r = d / 2
cx, cy = 102, 150
gy = 290
x0 = 60
Lpx = math.pi * d
fig = (CIRC(cx, cy, r, GR, 5, f'{GR}1A') + LINE((cx - r, cy), (cx + r, cy), TR, 4) + DOT((cx, cy), TX, 5)
       + T(cx, cy - 18, 'd', TR, 22, italic=True)
       + T(cx + r + 18, cy - r + 6, 'lilitan', GR, 19, 'start')
       + f'<path d="M{cx + r + 20} {cy - 24} q 70 10 110 120" fill="none" stroke="{MU2}" stroke-width="2.5" stroke-dasharray="6 6"/>'
       + f'<path d="M{cx + r + 122} {cy + 84} l 8 16 l 8 -16" fill="none" stroke="{MU2}" stroke-width="2.5"/>'
       + T(cx + r + 150, cy + 50, 'golek', MU, 17, 'start')
       + LINE((x0, gy), (x0 + Lpx, gy), GR, 7))
for i in range(4):
    xx = x0 + i * d
    fig += LINE((xx, gy - 16), (xx, gy + 16), TX, 3)
for i in range(3):
    xx = x0 + i * d
    fig += LINE((xx + 4, gy + 40), (xx + d - 4, gy + 40), TR, 4) + T(xx + d / 2, gy + 64, 'd', TR, 21, italic=True)
fig += LINE((x0 + 3 * d + 3, gy + 40), (x0 + Lpx, gy + 40), AM, 4) + LINE((x0 + Lpx, gy - 16), (x0 + Lpx, gy + 16), TX, 3)
fig += T(x0 + 3 * d + 7, gy + 64, '0.14d', AM, 15, 'start')
fig += T(250, gy - 36, 'lilitan', GR, 20)
fig += T(250, 440, 'lilitan ≈ 3.14 × diameter', MU3, 20, halo=False)
add('5.3', 'KONSEP', 'Nilai π (pi)',
    DEF(f'Bagi <b>semua</b> bulatan, <b>lilitan ÷ diameter</b> memberi nilai yang sama. Nilai ini dinamakan <b>pi (π)</b>.', col)
    + TABLE(['Objek', 'Lilitan', 'Diameter', 'Lilitan ÷ diameter'],
            [['Tin', '22.0 cm', '7.0 cm', '3.14'], ['Pinggan', '75.4 cm', '24.0 cm', '3.14'], ['Jam dinding', '94.2 cm', '30.0 cm', '3.14']], col)
    + BUL([f'π ≈ <b>3.142</b> atau π ≈ <b>{PI7}</b>', 'π = 3.14159… ialah nombor perpuluhan yang tidak berakhir.'], col),
    svg(fig, 'Lilitan bulatan yang digolek adalah kira-kira 3.14 kali diameter'))

# 5.3-2 Lilitan
b = Bul(250, 225, 160)
fig = (b.outline(GR, 9, f'{GR}10') + LINE(b.O, b.at(30), AM, 5) + b.centre(TX, 'O', -8, 24)
       + side_label(b.O, b.at(30), 'j = 7 cm', AM, 24, 20, toward=b.at(300))
       + b.lab(115, 'lilitan', GR, 34, 21)
       + T(250, 450, 'Lilitan = πd = 2πj', GR, 21, halo=False))
add('5.3', 'RUMUS', 'Lilitan bulatan',
    DEF('<b>Lilitan</b> = π × diameter = <b>π<i>d</i></b> &nbsp;atau&nbsp; <b>2π<i>j</i></b>', col)
    + P(f'Hitung lilitan bulatan berjejari 7 cm. (Guna π = {PI7})')
    + STEPS([f'Lilitan = 2π<i>j</i> = 2 × {PI7} × 7',
             '= 44 cm'], col)
    + ANS('Lilitan = 44 cm')
    + NOTE('Jika lilitan diberi, cari diameter dengan <i>d</i> = lilitan ÷ π.'),
    svg(fig, 'Bulatan berjejari 7 cm dengan lilitan diserlahkan'))

# 5.3-3 Panjang lengkok
b = Bul(250, 250, 160)
a1, a2 = 30, 150
fig = (b.outline(DIM, 3.5) + b.sector(a1, a2, GR, '1A', 0) + b.arc(a1, a2, GR, 9)
       + LINE(b.O, b.at(a1), AM, 4.5) + LINE(b.O, b.at(a2), AM, 4.5)
       + angle_arc(b.O, a1, a2, 38, PK, 3) + T(b.cx, b.cy - 58, '120°', PK, 20)
       + b.centre(TX, 'O', 0, 24)
       + side_label(b.O, b.at(a1), '21 cm', AM, 22, 19, toward=b.at(90))
       + b.lab(90, 'lengkok', GR, 30, 21)
       + DOT(b.at(a1), GR) + DOT(b.at(a2), GR) + b.lab(a1, 'B', TX, 24) + b.lab(a2, 'A', TX, 24)
       + T(250, 452, 'θ = sudut di pusat', MU, 18, halo=False))
add('5.3', 'RUMUS', 'Panjang lengkok',
    DEF(f'<b>Panjang lengkok</b> = {FR("θ", "360°")} × 2π<i>j</i> &nbsp;&nbsp;(θ = sudut di pusat)', col)
    + P(f'Jejari = 21 cm, sudut di pusat = 120°. Hitung panjang lengkok AB. (Guna π = {PI7})')
    + STEPS([f'Panjang lengkok = {FR("120°", "360°")} × 2 × {PI7} × 21',
             f'= {FR(1, 3)} × 132 = 44 cm'], col)
    + ANS('Panjang lengkok AB = 44 cm'),
    svg(fig, 'Lengkok AB dengan sudut 120 darjah di pusat dan jejari 21 cm'))

# 5.3-4 Luas bulatan
b = Bul(250, 225, 160)
fig = (b.outline(GR, 4, f'{GR}33') + LINE(b.at(180), b.at(0), TR, 3, '9 6') + LINE(b.O, b.at(0), AM, 5)
       + b.centre(TX, 'O', -8, 24)
       + T(b.cx + 80, b.cy - 22, 'j = 7 cm', AM, 20) + T(b.cx - 80, b.cy - 22, 'd = 14 cm', TR, 19)
       + T(b.cx, b.cy + 92, 'luas', GR, 24)
       + T(250, 450, 'Luas = πj²', GR, 21, halo=False))
add('5.3', 'RUMUS', 'Luas bulatan',
    DEF('<b>Luas bulatan</b> = π × jejari × jejari = <b>π<i>j</i>²</b>', col)
    + P(f'Hitung luas bulatan berdiameter 14 cm. (Guna π = {PI7})')
    + STEPS(['Cari jejari dahulu: <i>j</i> = 14 ÷ 2 = 7 cm',
             f'Luas = π<i>j</i>² = {PI7} × 7 × 7 = 154 cm²'], col)
    + ANS('Luas = 154 cm²')
    + NOTE('Unit luas ialah unit persegi, contohnya cm² dan m².'),
    svg(fig, 'Bulatan berdiameter 14 cm dengan luas berlorek'))

# 5.3-5 Luas sektor
b = Bul(250, 230, 165)
a1, a2 = 10, 90
fig = (b.outline(DIM, 3.5) + b.sector(a1, a2, GR, '4D', 3.5)
       + LINE(b.O, b.at(a1), AM, 4.5) + LINE(b.O, b.at(a2), AM, 4.5)
       + angle_arc(b.O, a1, a2, 36, PK, 3) + T(*b.at(50, 58), '80°', PK, 19)
       + b.centre(TX, 'O', -20, 18)
       + side_label(b.O, b.at(a2), '6 cm', AM, 38, 19, toward=b.at(50))
       + T(*b.at(50, 112), 'sektor', TX, 20)
       + T(250, 452, 'Luas sektor = θ/360° × πj²', GR, 20, halo=False))
add('5.3', 'RUMUS', 'Luas sektor',
    DEF(f'<b>Luas sektor</b> = {FR("θ", "360°")} × π<i>j</i>²', col)
    + P('Jejari = 6 cm, sudut di pusat = 80°. Hitung luas sektor. (Guna π = 3.142, jawapan betul kepada 2 tempat perpuluhan.)', True)
    + STEPS([f'Luas sektor = {FR("80°", "360°")} × 3.142 × 6²',
             f'= {FR(2, 9)} × 113.112 = 25.136 cm²'], col)
    + ANS('Luas sektor ≈ 25.14 cm²')
    + NOTE(f'{FR("θ", "360°")} = {FR("panjang lengkok", "lilitan")} = {FR("luas sektor", "luas bulatan")}'),
    svg(fig, 'Sektor berjejari 6 cm dengan sudut 80 darjah di pusat'))

# 5.3-6 Masalah harian
fig = ''
# panel roda
fig += f'<rect x="16" y="16" width="468" height="200" rx="18" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
wc = (112, 112); wr = 70
fig += CIRC(wc[0], wc[1], wr, TX, 9) + CIRC(wc[0], wc[1], wr - 12, DIM, 2)
for k in range(8):
    t = math.radians(k * 45)
    fig += LINE(wc, (wc[0] + (wr - 10) * math.cos(t), wc[1] + (wr - 10) * math.sin(t)), MU2, 2)
fig += DOT(wc, AM, 6) + LINE(wc, (wc[0] + wr, wc[1]), AM, 4)
fig += T(wc[0] + 36, wc[1] - 14, '35 cm', AM, 16)
fig += LINE((30, 196), (470, 196), MU2, 3)
fig += f'<path d="M210 166 L440 166" stroke="{GR}" stroke-width="5" stroke-linecap="round"/><path d="M428 156 L442 166 L428 176" fill="none" stroke="{GR}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
fig += T(325, 70, 'Roda', TX, 22) + T(325, 106, '1 putaran = lilitan', GR, 19) + T(325, 138, '= 220 cm', GR, 19)
# panel piza
fig += f'<rect x="16" y="232" width="226" height="222" rx="18" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
pz = Bul(129, 330, 72)
fig += pz.outline(AM, 6, f'{AM}26')
for k in range(8):
    fig += LINE(pz.O, pz.at(k * 45), AM, 2)
fig += pz.sector(45, 90, PA, '99', 3)
for (aa, rr_) in [(20, 40), (150, 45), (210, 35), (300, 48), (250, 55), (110, 30)]:
    fig += f'<circle cx="{r1(pz.at(aa, rr_)[0])}" cy="{r1(pz.at(aa, rr_)[1])}" r="6" fill="{RD}"/>'
fig += T(129, 428, 'Piza: sepotong = sektor', TX, 16)
# panel padang
fig += f'<rect x="258" y="232" width="226" height="222" rx="18" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
pd = Bul(371, 330, 72)
fig += pd.outline(PK, 6, f'{GR}40') + CIRC(371, 330, 22, TX, 2.5) + LINE((299, 330), (443, 330), TX, 2.5)
fig += T(371, 418, 'Padang: pagar = lilitan', TX, 16) + T(371, 440, 'rumput = luas', GR, 16)
add('5.3', 'APLIKASI', 'Masalah harian',
    P(f'Jejari roda sebuah basikal ialah 35 cm. Berapakah putaran lengkap roda itu untuk bergerak sejauh 440 m? (Guna π = {PI7})')
    + STEPS([f'Jarak satu putaran = lilitan = 2 × {PI7} × 35 = 220 cm',
             'Tukar unit: 440 m = 440 × 100 = 44 000 cm',
             'Bilangan putaran = 44 000 ÷ 220 = 200'], col)
    + ANS('200 putaran')
    + NOTE('Tentukan dahulu: soalan perlukan <b>lilitan</b> atau <b>luas</b>?'),
    svg(fig, 'Contoh bulatan dalam kehidupan: roda, piza dan padang'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

# semakan palet: hanya warna palet gelap dibenarkan
import re
ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert counts == {'5.1': 4, '5.2': 5, '5.3': 6}, counts

js = ('/* Dijana oleh tools/circmotion/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
