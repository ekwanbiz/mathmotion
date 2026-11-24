# Penjana slaid NOTA SUDUT BULAT (Tingkatan 3 Bab 6 Sudut dan Tangen bagi Bulatan) -> sudutbulatan/slides.js
# Jalankan:  python3 tools/sudutbulatan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
# Setiap rajah dibina daripada geometri sebenar dan sudut yang dilabel disemak dengan assert.
import json, os, html, math, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'sudutbulatan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
SUB = {
    '6.1': ('Sudut Lilitan & Sudut Pusat', TR),
    '6.2': ('Sisi Empat Kitaran', PU),
    '6.3': ('Tangen kepada Bulatan', GR),
    '6.4': ('Sudut dan Tangen', PA),
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
def NOTE(t, lab='Ingat:'):
    return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
ANG = '∠'

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

def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

def sub_(p, q): return (p[0] - q[0], p[1] - q[1])
def unit(v):
    L = math.hypot(*v) or 1
    return (v[0] / L, v[1] / L)
def dist(p, q): return math.hypot(p[0] - q[0], p[1] - q[1])

def angle_at(V, Pp, Q):
    """Sudut PVQ (darjah, 0-180)."""
    u, w = unit(sub_(Pp, V)), unit(sub_(Q, V))
    return math.degrees(math.acos(max(-1, min(1, u[0] * w[0] + u[1] * w[1]))))

def ARC(V, Pp, Q, r, col, lab='', lsize=19, loff=16, fill=True, reflex=False):
    """Tanda sudut PVQ (bukan refleks) dengan label di pembahagi dua sudut."""
    u, w = unit(sub_(Pp, V)), unit(sub_(Q, V))
    a = (V[0] + u[0] * r, V[1] + u[1] * r); b = (V[0] + w[0] * r, V[1] + w[1] * r)
    cr = u[0] * w[1] - u[1] * w[0]
    sweep = 1 if cr > 0 else 0
    large = 0
    if reflex: sweep, large = 1 - sweep, 1
    d = f'M{r1(a[0])} {r1(a[1])} A{r} {r} 0 {large} {sweep} {r1(b[0])} {r1(b[1])}'
    s = ''
    if fill:
        s += f'<path d="M{r1(V[0])} {r1(V[1])} L{d[1:]} Z" fill="{col}" fill-opacity="0.22" stroke="none"/>'
    s += f'<path d="{d}" fill="none" stroke="{col}" stroke-width="3"/>'
    if lab:
        bis = unit((u[0] + w[0], u[1] + w[1]))
        if reflex: bis = (-bis[0], -bis[1])
        s += T(V[0] + bis[0] * (r + loff), V[1] + bis[1] * (r + loff), lab, col, lsize)
    return s

def RIGHT(V, Pp, Q, col=TX, k=15):
    u, w = unit(sub_(Pp, V)), unit(sub_(Q, V))
    a = (V[0] + u[0] * k, V[1] + u[1] * k); c = (V[0] + w[0] * k, V[1] + w[1] * k)
    b = (a[0] + w[0] * k, a[1] + w[1] * k)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} L{r1(c[0])} {r1(c[1])}" fill="none" stroke="{col}" stroke-width="2.5"/>'

def EXT(p, q, k):
    """Titik pada garis pq, k piksel melepasi q."""
    u = unit(sub_(q, p)); return (q[0] + u[0] * k, q[1] + u[1] * k)

class Circ:
    def __init__(self, cx, cy, R):
        self.cx, self.cy, self.R = cx, cy, R
        self.O = (cx, cy)
    def p(self, deg, k=0):
        a = math.radians(deg)
        return (self.cx + (self.R + k) * math.cos(a), self.cy - (self.R + k) * math.sin(a))
    def draw(self, col=MU3, sw=3.5, centre=True, olab='O'):
        s = f'<circle cx="{r1(self.cx)}" cy="{r1(self.cy)}" r="{self.R}" fill="{SURF}" stroke="{col}" stroke-width="{sw}"/>'
        if centre:
            s += DOT(self.O, MU3, 5.5)
            if olab: s += T(self.cx + 14, self.cy + 16, olab, MU3, 18)
        return s
    def lab(self, deg, t, col=TX, k=24, size=21):
        x, y = self.p(deg, k); return T(x, y, t, col, size)
    def arc(self, d1, d2, col, sw=7):
        """Lengkok lawan arah jam dari d1 ke d2 (darjah)."""
        a, b = self.p(d1), self.p(d2)
        span = (d2 - d1) % 360
        return (f'<path d="M{r1(a[0])} {r1(a[1])} A{self.R} {self.R} 0 {1 if span > 180 else 0} 0 {r1(b[0])} {r1(b[1])}" '
                f'fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>')
    def tangent(self, deg, k1, k2, col=GR, sw=4.5):
        """Garis tangen di titik deg; k1 ke arah lawan jam (+), k2 ke arah ikut jam (−)."""
        A = self.p(deg); a = math.radians(deg)
        t = (-math.sin(a), -math.cos(a))   # arah lawan jam di skrin
        return LINE((A[0] - t[0] * k2, A[1] - t[1] * k2), (A[0] + t[0] * k1, A[1] + t[1] * k1), col, sw), t

def close(a, b, tol=0.6):
    return abs(a - b) < tol

def common_tangents(c1, r1_, c2, r2_):
    """Senarai tangen sepunya: [(titik pada bulatan 1, titik pada bulatan 2)]."""
    D = sub_(c2, c1); L = math.hypot(*D); Dh = (D[0] / L, D[1] / L); Dp = (-Dh[1], Dh[0])
    out = []
    for e1, e2 in ((1, 1), (1, -1)):
        k = (r2_ * e2 - r1_ * e1) / L
        if abs(k) > 1 + 1e-9: continue
        sq = math.sqrt(max(0, 1 - k * k))
        sols = [1] if sq < 1e-9 else [1, -1]
        for sg in sols:
            n = (k * Dh[0] + sg * sq * Dp[0], k * Dh[1] + sg * sq * Dp[1])
            # n·x = d ; n·c1 − d = r1·e1  =>  titik ketangenan = c − e·r·n ... (tanda mengikut takrifan)
            d = n[0] * c1[0] + n[1] * c1[1] - r1_ * e1
            t1 = (c1[0] - (n[0] * c1[0] + n[1] * c1[1] - d) * n[0], c1[1] - (n[0] * c1[0] + n[1] * c1[1] - d) * n[1])
            t2 = (c2[0] - (n[0] * c2[0] + n[1] * c2[1] - d) * n[0], c2[1] - (n[0] * c2[0] + n[1] * c2[1] - d) * n[1])
            assert close(dist(t1, c1), r1_, 0.01) and close(dist(t2, c2), r2_, 0.01)
            out.append((t1, t2, n))
    return out

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# =====================================================================
# 6.1 SUDUT PADA LILITAN DAN SUDUT PUSAT
# =====================================================================
col = SUB['6.1'][1]

# 6.1-1 Definisi
c = Circ(250, 245, 175)
A, Bp, Cp = c.p(212), c.p(328), c.p(95)
assert close(angle_at(Cp, A, Bp), 58) and close(angle_at(c.O, A, Bp), 116)
fig = (c.draw(olab='') + c.arc(212, 328, AM, 8)
       + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(c.O, A, Bp, 30, PA, '', fill=True) + ARC(Cp, A, Bp, 38, TR, '', fill=True)
       + DOT(c.O, MU3, 5.5) + T(c.cx, c.cy - 20, 'O', MU3, 19)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX)
       + c.lab(212, 'A') + c.lab(328, 'B') + c.lab(95, 'C')
       + T(250, 448, 'lengkok AB', AM, 20)
       + T(c.cx, c.cy + 54, 'sudut pusat', PA, 17) + T(Cp[0] + 34, Cp[1] + 44, 'sudut pada lilitan', TR, 17, 'start'))
add('6.1', 'DEFINISI', 'Sudut pada lilitan dan sudut pusat',
    DEF(f'{B("Sudut pada lilitan", TR)}: sudut yang bucunya terletak pada lilitan, dibentuk oleh dua perentas, contohnya {ANG}ACB.', col)
    + DEF(f'{B("Sudut pusat", PA)}: sudut yang bucunya di pusat O, dibentuk oleh dua jejari, contohnya {ANG}AOB.', col)
    + BUL([f'Kedua-dua sudut ini <b>dicangkum</b> oleh {B("lengkok AB", AM)}.',
           'Lengkok AB "berdiri" di hadapan sudut itu, iaitu hujung sudut memandang ke arah lengkok.'], col)
    + NOTE('Untuk mengenal pasti lengkok yang mencangkum sudut, ikut kedua-dua kaki sudut hingga ke lilitan.'),
    svg(fig, 'Bulatan berpusat O dengan sudut pusat AOB dan sudut pada lilitan ACB yang dicangkum oleh lengkok AB'))

# 6.1-2 Lengkok yang sama -> sudut sama
c = Circ(250, 240, 180)
A, Bp = c.p(200), c.p(340)
pts = {'C': 55, 'D': 100, 'E': 145}
fig = c.draw(centre=False) + c.arc(200, 340, AM, 8)
cols = {'C': TR, 'D': PK, 'E': GR}
for k, d in pts.items():
    V = c.p(d)
    assert close(angle_at(V, A, Bp), 70)
    fig += LINE(V, A, cols[k], 3.5) + LINE(V, Bp, cols[k], 3.5)
for k, d in pts.items():
    V = c.p(d)
    fig += ARC(V, A, Bp, 30, cols[k], 'x', 18, 13) + DOT(V, TX) + c.lab(d, k)
fig += DOT(A, TX) + DOT(Bp, TX) + c.lab(200, 'A') + c.lab(340, 'B') + T(250, 448, 'lengkok AB', AM, 20)
add('6.1', 'SIFAT 1', 'Sudut yang dicangkum oleh lengkok yang sama',
    DEF(f'Sudut pada lilitan yang dicangkum oleh <b>lengkok yang sama</b> adalah <b>sama</b>.', col)
    + P(f'{ANG}ACB = {ANG}ADB = {ANG}AEB = <i>x</i>')
    + BUL(['Lengkok yang <b>sama panjang</b> juga mencangkum sudut yang sama.'], col)
    + STEPS([f'Jika {ANG}ADB = 70°, maka {ANG}ACB = {ANG}AEB = 70°.'], col)
    + NOTE('C, D dan E mesti berada dalam tembereng yang <b>sama</b>.'),
    svg(fig, 'Tiga sudut ACB, ADB dan AEB dicangkum oleh lengkok AB yang sama, semuanya bernilai x'))

# 6.1-3 Sudut pusat = 2 x sudut lilitan
x = 38
c = Circ(250, 235, 180)
A, Bp, Cp = c.p(270 - x), c.p(270 + x), c.p(100)
assert close(angle_at(Cp, A, Bp), x) and close(angle_at(c.O, A, Bp), 2 * x)
fig = (c.draw(olab='') + c.arc(270 - x, 270 + x, AM, 8)
       + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(c.O, A, Bp, 34, PA, '?', 20, 16) + ARC(Cp, A, Bp, 46, TR, f'{x}°', 19, 16)
       + DOT(c.O, MU3, 5.5) + T(c.cx + 22, c.cy - 8, 'O', MU3, 19)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX) + c.lab(270 - x, 'A') + c.lab(270 + x, 'B') + c.lab(100, 'C'))
add('6.1', 'SIFAT 2', 'Sudut pusat = 2 × sudut pada lilitan',
    DEF(f'Sudut pusat = <b>2 ×</b> sudut pada lilitan yang dicangkum oleh lengkok yang sama.<br>{ANG}AOB = 2 × {ANG}ACB', col)
    + P(f'Diberi {ANG}ACB = {x}°. Cari {ANG}AOB.', True)
    + STEPS([f'{ANG}AOB dan {ANG}ACB dicangkum oleh lengkok AB.',
             f'{ANG}AOB = 2 × {ANG}ACB = 2 × {x}°'], col)
    + ANS(f'{ANG}AOB = {2 * x}°')
    + NOTE('Songsangnya: sudut pada lilitan = ½ × sudut pusat.'),
    svg(fig, f'Sudut ACB = {x} darjah pada lilitan dan sudut pusat AOB yang perlu dicari'))

# 6.1-4 Sudut dalam semibulatan
x = 34
c = Circ(250, 250, 185)
A, Bp, Cp = c.p(180), c.p(0), c.p(2 * x)
assert close(angle_at(Cp, A, Bp), 90) and close(angle_at(A, Cp, Bp), x) and close(angle_at(Bp, A, Cp), 90 - x)
fig = (c.draw(olab='') + LINE(A, Bp, AM, 5) + POLY([A, Bp, Cp], f'{TR}1A')
       + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4) + RIGHT(Cp, A, Bp, TX, 17)
       + ARC(A, Cp, Bp, 58, PK, f'{x}°', 18, 18) + ARC(Bp, A, Cp, 44, GR, '?', 20, 16)
       + DOT(c.O, MU3, 5.5) + T(c.cx, c.cy + 22, 'O', MU3, 19)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX) + c.lab(180, 'A') + c.lab(0, 'B') + c.lab(2 * x, 'C')
       + T(250, c.cy + 108, 'AB ialah diameter', AM, 19))
add('6.1', 'SIFAT 3', 'Sudut dalam semibulatan',
    DEF(f'Sudut pada lilitan yang dicangkum oleh <b>diameter</b> ialah <b>90°</b>.', col)
    + BUL([f'Sudut pusat bagi diameter = 180°, maka sudut pada lilitan = ½ × 180° = 90°.'], col)
    + P(f'AB ialah diameter dan {ANG}CAB = {x}°. Cari {ANG}ABC.', True)
    + STEPS([f'{ANG}ACB = 90° (sudut dalam semibulatan)',
             f'{ANG}ABC = 180° − 90° − {x}°'], col)
    + ANS(f'{ANG}ABC = {90 - x}°'),
    svg(fig, f'AB diameter, sudut ACB 90 darjah, sudut CAB {x} darjah'))

# 6.1-5 Contoh berlangkah (segi tiga sama kaki)
oab = 28; aob = 180 - 2 * oab; acb = aob // 2
assert (aob, acb) == (124, 62)
c = Circ(250, 225, 180)
A, Bp, Cp = c.p(270 - aob / 2), c.p(270 + aob / 2), c.p(105)
assert close(angle_at(A, c.O, Bp), oab) and close(angle_at(c.O, A, Bp), aob) and close(angle_at(Cp, A, Bp), acb)
fig = (c.draw(olab='') + POLY([c.O, A, Bp], f'{PA}1A') + LINE(A, Bp, MU3, 4)
       + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(A, c.O, Bp, 48, PK, f'{oab}°', 17, 18) + ARC(Bp, A, c.O, 48, PK, '', 17)
       + ARC(Cp, A, Bp, 44, TR, '?', 20, 15)
       + DOT(c.O, MU3, 5.5) + T(c.cx, c.cy - 20, 'O', MU3, 19)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX) + c.lab(270 - aob / 2, 'A') + c.lab(270 + aob / 2, 'B') + c.lab(105, 'C'))
add('6.1', 'CONTOH BERLANGKAH', 'Gabungkan dengan segi tiga sama kaki',
    P(f'O ialah pusat bulatan. Diberi {ANG}OAB = {oab}°. Cari {ANG}ACB.', True)
    + STEPS([f'OA = OB (jejari), maka ∆OAB sama kaki: {ANG}OBA = {oab}°',
             f'{ANG}AOB = 180° − {oab}° − {oab}° = {aob}°',
             f'{ANG}ACB = ½ × {ANG}AOB = ½ × {aob}°'], col)
    + ANS(f'{ANG}ACB = {acb}°')
    + NOTE('Dua jejari dan satu perentas sentiasa membentuk segi tiga <b>sama kaki</b>.'),
    svg(fig, f'Pusat O, sudut OAB {oab} darjah, cari sudut ACB'))

# 6.1-6 Kesilapan biasa (C pada lengkok minor -> guna sudut refleks)
c = Circ(250, 160, 130)
A, Bp, Cp = c.p(210), c.p(330), c.p(270)
assert close(angle_at(c.O, A, Bp), 120) and close(angle_at(Cp, A, Bp), 120)
fig = (c.draw(olab='') + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(c.O, A, Bp, 30, PA, '240°', 17, 20, reflex=True) + ARC(Cp, A, Bp, 26, TR, '120°', 16, 16)
       + DOT(c.O, MU3, 5.5) + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX)
       + c.lab(210, 'A') + c.lab(330, 'B') + c.lab(270, 'C', k=22))
rows = [(342, True, '∠ACB = ½ × refleks ∠AOB = 120°'), (392, False, '∠ACB = ½ × 120° = 60°'), (442, False, '∠AOB = ½ × ∠ACB')]
for y, ok, t in rows:
    fig += RECT(30, y - 21, 440, 42, SURF, GR if ok else RD, 12, 2) + (TICK(56, y) if ok else CROSS(56, y))
    fig += T(82, y, t, GR if ok else RD, 18, 'start')
assert 360 - 120 == 240 and 240 / 2 == 120
add('6.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Terbalik", RD)}: sudut <b>pusat</b> yang dua kali ganda, bukan sudut pada lilitan.',
         f'{B("Lengkok berbeza", RD)}: kedua-dua sudut mesti dicangkum oleh lengkok yang <b>sama</b>.',
         f'{B("Bucu pada lengkok minor", RD)}: jika C pada lengkok minor AB, gunakan sudut <b>refleks</b> AOB.'], col)
    + NOTE(f'Dalam rajah, {ANG}AOB = 120°. C pada lengkok minor, jadi {ANG}ACB = ½ × (360° − 120°) = 120°.', 'Contoh:'),
    svg(fig, 'C pada lengkok minor AB: sudut ACB ialah separuh sudut refleks AOB'))

# 6.1-7 Ringkasan
fig = ''
for i, (t1, t2, cl) in enumerate([('Lengkok sama', 'sudut lilitan sama', TR), ('Sudut pusat', '= 2 × sudut lilitan', PA), ('Semibulatan', 'sudut = 90°', GR)]):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 140, SURF, BD, 16, 2)
    cc = Circ(84, y0 + 70, 52)
    fig += f'<circle cx="{cc.cx}" cy="{r1(cc.cy)}" r="52" fill="none" stroke="{MU3}" stroke-width="2.5"/>'
    if i == 0:
        a_, b_ = cc.p(210), cc.p(330)
        for d, cl2 in ((70, TR), (120, PK)):
            V = cc.p(d); fig += LINE(V, a_, cl2, 2.5) + LINE(V, b_, cl2, 2.5) + ARC(V, a_, b_, 14, cl2, '', fill=True)
    elif i == 1:
        a_, b_, V = cc.p(230), cc.p(310), cc.p(90)
        fig += LINE(cc.O, a_, PA, 2.5) + LINE(cc.O, b_, PA, 2.5) + LINE(V, a_, TR, 2.5) + LINE(V, b_, TR, 2.5)
        fig += ARC(cc.O, a_, b_, 12, PA, '') + ARC(V, a_, b_, 16, TR, '')
    else:
        a_, b_, V = cc.p(180), cc.p(0), cc.p(60)
        fig += LINE(a_, b_, AM, 2.5) + LINE(V, a_, GR, 2.5) + LINE(V, b_, GR, 2.5) + RIGHT(V, a_, b_, TX, 10)
    fig += T(162, y0 + 50, t1, cl, 22, 'start') + T(162, y0 + 90, t2, MU3, 20, 'start', halo=False)
add('6.1', 'RINGKASAN', 'Ringkasan 6.1',
    TABLE(['Sifat', 'Hubungan'],
          [['Dicangkum lengkok yang sama', 'Sudut pada lilitan adalah sama'],
           ['Sudut pusat', f'{ANG}AOB = 2 × {ANG}ACB'],
           ['Sudut dalam semibulatan', '90°']], col, rv=True)
    + BUL(['Kenal pasti lengkok yang mencangkum sudut dahulu.',
           'Jejari yang sama → segi tiga sama kaki.'], col),
    svg(fig, 'Ringkasan tiga sifat sudut pada lilitan'))

# =====================================================================
# 6.2 SISI EMPAT KITARAN
# =====================================================================
col = SUB['6.2'][1]

# 6.2-1 Definisi
fig = RECT(10, 40, 236, 330, SURF, GR, 18, 2) + RECT(254, 40, 236, 330, SURF, RD, 18, 2)
c1, c2 = Circ(128, 200, 92), Circ(372, 200, 92)
fig += c1.draw(centre=False) + c2.draw(centre=False)
q1 = [c1.p(d) for d in (115, 200, 290, 20)]
fig += POLY(q1, f'{PU}33', PU, 4) + ''.join(DOT(p, TX, 5.5) for p in q1)
fig += ''.join(c1.lab(d, t, TX, 20, 18) for d, t in zip((115, 200, 290, 20), 'ABCD'))
q2 = [c2.p(115), c2.p(200), c2.p(290), (c2.cx + 42, c2.cy - 14)]
fig += POLY(q2, f'{RD}22', RD, 4) + ''.join(DOT(p, TX, 5.5) for p in q2)
fig += ''.join(c2.lab(d, t, TX, 20, 18) for d, t in zip((115, 200, 290), 'PQR')) + T(q2[3][0] + 16, q2[3][1] - 4, 'S', TX, 18)
fig += TICK(70, 340) + T(128, 340, 'Kitaran', GR, 20) + CROSS(300, 340) + T(390, 340, 'Bukan kitaran', RD, 19)
fig += T(250, 420, 'Keempat-empat bucu mesti pada lilitan', MU3, 18, halo=False)
add('6.2', 'DEFINISI', 'Apa itu sisi empat kitaran?',
    DEF('<b>Sisi empat kitaran</b> ialah sisi empat yang <b>keempat-empat bucunya</b> terletak pada lilitan sebuah bulatan.', col)
    + BUL(['ABCD ialah sisi empat kitaran: A, B, C dan D pada lilitan.',
           'PQRS <b>bukan</b> sisi empat kitaran: bucu S berada di dalam bulatan.',
           'Sisi-sisi sisi empat kitaran ialah <b>perentas</b> bulatan itu.'], col)
    + NOTE('Namakan bucu mengikut tertib di sekeliling bulatan, contohnya ABCD.'),
    svg(fig, 'Sisi empat kitaran ABCD dan sisi empat PQRS yang bukan kitaran'))

# 6.2-2 Sudut bertentangan = 180
c = Circ(250, 240, 180)
dA, dB, dC, dD = 120, 196, 290, 30
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
aA, aB, aC, aD = (angle_at(v, p, q) for v, p, q in ((A, Dp, Bp), (Bp, A, Cp), (Cp, Bp, Dp), (Dp, Cp, A)))
assert close(aA, 97) and close(aC, 83) and close(aB, 95) and close(aD, 85)
fig = (c.draw(centre=False) + POLY([A, Bp, Cp, Dp], f'{PU}1A', PU, 4)
       + ARC(A, Dp, Bp, 36, AM, '97°', 18, 18) + ARC(Cp, Bp, Dp, 36, AM, '83°', 18, 18)
       + ARC(Bp, A, Cp, 36, TR, '95°', 18, 18) + ARC(Dp, Cp, A, 36, TR, '85°', 18, 18)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp))
       + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD'))
       + T(250, 452, '97° + 83° = 180° · 95° + 85° = 180°', MU3, 18, halo=False))
add('6.2', 'SIFAT 1', 'Sudut pedalaman bertentangan',
    DEF('Hasil tambah sudut pedalaman yang <b>bertentangan</b> dalam sisi empat kitaran ialah <b>180°</b>.', col)
    + P(f'{B("∠A + ∠C = 180°", AM)} &nbsp; dan &nbsp; {B("∠B + ∠D = 180°", TR)}')
    + STEPS([f'Diberi ∠A = 97°, maka ∠C = 180° − 97° = 83°.',
             f'Diberi ∠B = 95°, maka ∠D = 180° − 95° = 85°.'], col)
    + NOTE('Hasil tambah keempat-empat sudut tetap 360°: 97° + 95° + 83° + 85° = 360°.'),
    svg(fig, 'Sisi empat kitaran ABCD dengan sudut 97, 95, 83 dan 85 darjah'))
assert 97 + 95 + 83 + 85 == 360

# 6.2-3 Sudut peluaran = sudut pedalaman bertentangan (BC dipanjangkan ke E)
bad = 100
c = Circ(225, 225, 170)
# lengkok BCD (tidak mengandungi A) = 2 x 100 = 200
dB, dD = 200, 40
dA, dC = 115, 330
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
assert close(angle_at(A, Bp, Dp), bad)
E = EXT(Bp, Cp, 95)
assert close(angle_at(Cp, Dp, E), bad) and close(angle_at(Cp, Bp, Dp), 180 - bad) and E[0] < 490 and E[1] < 460
fig = (c.draw(centre=False) + POLY([A, Bp, Cp, Dp], f'{PU}1A', PU, 4) + LINE(Cp, E, PU, 4, '8 6')
       + ARC(A, Bp, Dp, 36, AM, f'{bad}°', 18, 18) + ARC(Cp, Dp, E, 40, AM, '?', 20, 16)
       + ARC(Cp, Bp, Dp, 28, TR, '', fill=True)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp, E))
       + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD')) + T(E[0] + 4, E[1] + 22, 'E', TX, 21))
add('6.2', 'SIFAT 2', 'Sudut peluaran sisi empat kitaran',
    DEF('Sudut <b>peluaran</b> sisi empat kitaran = sudut <b>pedalaman bertentangan</b>.', col)
    + P(f'BC dipanjangkan ke E. Diberi {ANG}BAD = {bad}°. Cari {ANG}DCE.', True)
    + STEPS([f'{ANG}BCD = 180° − {bad}° = {180 - bad}° (sudut bertentangan)',
             f'{ANG}DCE = 180° − {180 - bad}° = {bad}° (sudut pada garis lurus)'], col)
    + ANS(f'{ANG}DCE = {ANG}BAD = {bad}°')
    + NOTE('Sudut pedalaman bertentangan bagi sudut peluaran di C ialah sudut di A, bukan sudut di B atau D.'),
    svg(fig, f'Sisi empat kitaran ABCD, sudut BAD {bad} darjah, sudut peluaran DCE'))

# 6.2-4 Contoh algebra
xv = 35
assert (2 * xv + 10) + (3 * xv - 5) == 180
c = Circ(250, 240, 180)
dA, dB, dC, dD = 130, 225, 315, 25
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
assert close(angle_at(A, Bp, Dp), 2 * xv + 10) and close(angle_at(Cp, Bp, Dp), 3 * xv - 5)
fig = (c.draw(centre=False) + POLY([A, Bp, Cp, Dp], f'{PU}1A', PU, 4)
       + ARC(A, Dp, Bp, 40, AM, '(2x + 10)°', 17, 46) + ARC(Cp, Bp, Dp, 38, TR, '(3x − 5)°', 17, 42)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp))
       + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD')))
add('6.2', 'CONTOH BERLANGKAH', 'Mencari nilai x',
    P(f'ABCD ialah sisi empat kitaran. {ANG}DAB = (2<i>x</i> + 10)° dan {ANG}BCD = (3<i>x</i> − 5)°. Cari nilai <i>x</i> dan {ANG}DAB.', True)
    + STEPS(['∠DAB dan ∠BCD bertentangan: (2<i>x</i> + 10) + (3<i>x</i> − 5) = 180',
             '5<i>x</i> + 5 = 180 → 5<i>x</i> = 175',
             f'<i>x</i> = {xv}, maka {ANG}DAB = 2({xv}) + 10 = {2 * xv + 10}°'], col)
    + ANS(f'<i>x</i> = {xv}, {ANG}DAB = {2 * xv + 10}°')
    + NOTE(f'{ANG}BCD = 3({xv}) − 5 = {3 * xv - 5}°, dan {2 * xv + 10}° + {3 * xv - 5}° = 180° ✓', 'Semak:'),
    svg(fig, 'Sisi empat kitaran ABCD dengan sudut DAB (2x + 10) darjah dan BCD (3x − 5) darjah'))
assert 5 * xv + 5 == 180

# 6.2-5 Sisi empat kitaran + sudut pusat
bod = 140
c = Circ(250, 240, 180)
dB, dD = 270 - bod / 2, 270 + bod / 2       # lengkok minor BD di bawah
dA, dC = 100, 270
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
assert close(angle_at(c.O, Bp, Dp), bod) and close(angle_at(A, Bp, Dp), bod / 2) and close(angle_at(Cp, Bp, Dp), 180 - bod / 2)
fig = (c.draw(olab='') + POLY([A, Bp, Cp, Dp], f'{PU}14', PU, 4) + LINE(c.O, Bp, PA, 4) + LINE(c.O, Dp, PA, 4)
       + ARC(c.O, Bp, Dp, 30, PA, f'{bod}°', 17, 18) + ARC(A, Bp, Dp, 44, AM, '?', 20, 16) + ARC(Cp, Bp, Dp, 22, TR, '?', 18, 14)
       + DOT(c.O, MU3, 5.5) + T(c.cx, c.cy - 20, 'O', MU3, 19)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp))
       + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD')))
add('6.2', 'CONTOH BERLANGKAH', 'Sisi empat kitaran dan sudut pusat',
    P(f'O ialah pusat bulatan dan {ANG}BOD = {bod}°. Cari {ANG}BAD dan {ANG}BCD.', True)
    + STEPS([f'{ANG}BAD = ½ × {ANG}BOD = ½ × {bod}° = {bod // 2}°',
             f'{ANG}BCD = 180° − {bod // 2}° (sudut bertentangan)'], col)
    + ANS(f'{ANG}BAD = {bod // 2}°, {ANG}BCD = {180 - bod // 2}°')
    + NOTE(f'Cara lain: {ANG}BCD = ½ × refleks {ANG}BOD = ½ × {360 - bod}° = {(360 - bod) // 2}°.', 'Semak:'),
    svg(fig, f'Sisi empat kitaran ABCD dengan sudut pusat BOD {bod} darjah'))
assert (360 - bod) // 2 == 180 - bod // 2

# 6.2-6 Kesilapan biasa
c = Circ(250, 170, 130)
dA, dB, dC, dD = 125, 215, 300, 35
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
fig = (c.draw(centre=False) + POLY([A, Bp, Cp, Dp], f'{PU}1A', PU, 4)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp)) + ''.join(c.lab(d, t, TX, 20, 19) for d, t in zip((dA, dB, dC, dD), 'ABCD')))
rows = [(350, True, '∠A + ∠C = 180°'), (400, False, '∠A + ∠B = 180°'), (450, False, '∠A = ∠C')]
for y, ok, t in rows:
    fig += RECT(60, y - 21, 380, 42, SURF, GR if ok else RD, 12, 2) + (TICK(86, y) if ok else CROSS(86, y))
    fig += T(112, y, t, GR if ok else RD, 19, 'start') + T(424, y, 'bertentangan' if ok else ('bersebelahan' if 'B' in t else 'bukan sama'), MU, 15, 'end')
add('6.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Sudut bersebelahan", RD)} (contohnya ∠A dan ∠B) <b>tidak</b> semestinya berjumlah 180°.',
         f'{B("Sudut bertentangan bukan sama", RD)}: ∠A + ∠C = 180°, bukan ∠A = ∠C.',
         f'{B("Bukan kitaran", RD)}: jika satu bucu tidak pada lilitan, sifat ini tidak boleh digunakan.',
         f'{B("Sudut peluaran", RD)} disamakan dengan sudut pedalaman yang <b>bertentangan</b>, bukan yang bersebelahan.'], col),
    svg(fig, 'Contoh pasangan sudut betul dan salah dalam sisi empat kitaran'))

# 6.2-7 Ringkasan
c = Circ(230, 210, 165)
dA, dB, dC, dD = 115, 200, 330, 35
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
E = EXT(Bp, Cp, 90)
assert E[0] < 490
fig = (c.draw(centre=False) + POLY([A, Bp, Cp, Dp], f'{PU}1A', PU, 4) + LINE(Cp, E, PU, 4, '8 6')
       + ARC(A, Dp, Bp, 34, AM, 'a', 20, 15) + ARC(Cp, Bp, Dp, 30, TR, 'b', 20, 14) + ARC(Cp, Dp, E, 38, AM, 'a', 20, 15)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp)) + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD'))
       + T(250, 438, 'a + b = 180°', MU3, 22, halo=False))
assert close(angle_at(Cp, Dp, E), angle_at(A, Bp, Dp))
add('6.2', 'RINGKASAN', 'Ringkasan 6.2',
    TABLE(['Sifat', 'Hubungan'],
          [['Sudut bertentangan', '∠A + ∠C = 180°, ∠B + ∠D = 180°'],
           ['Sudut peluaran', 'Sudut peluaran = sudut pedalaman bertentangan'],
           ['Dengan pusat O', 'Gunakan sudut pusat = 2 × sudut pada lilitan']], col, rv=True)
    + BUL(['Pastikan keempat-empat bucu pada lilitan.'], col),
    svg(fig, 'Ringkasan sifat sisi empat kitaran: a + b = 180 darjah dan sudut peluaran a'))

# =====================================================================
# 6.3 TANGEN KEPADA BULATAN
# =====================================================================
col = SUB['6.3'][1]

# 6.3-1 Definisi
c = Circ(240, 245, 150)
A = c.p(90)
tl, _ = c.tangent(90, 200, 200, GR, 5)
s1, s2 = c.p(205), c.p(330)
fig = (c.draw(olab='O') + tl
       + LINE(EXT(s2, s1, 50), EXT(s1, s2, 50), PU, 4.5) + DOT(s1, PU) + DOT(s2, PU)
       + LINE((30, 440), (470, 400), MU2, 4.5)
       + DOT(A, AM, 8) + T(A[0] + 8, A[1] - 22, 'titik ketangenan', AM, 17)
       + T(445, A[1] - 18, 'tangen', GR, 19, 'end') + T(420, 238, 'sekan', PU, 19)
       + T(130, 448, 'tidak menyentuh', MU, 16, halo=False))
add('6.3', 'DEFINISI', 'Apa itu tangen kepada bulatan?',
    DEF('<b>Tangen</b> kepada bulatan ialah garis lurus yang menyentuh bulatan pada <b>satu titik sahaja</b>.', col)
    + BUL([f'Titik sentuhan itu dipanggil {B("titik ketangenan", AM)}.',
           f'Garis yang memotong bulatan pada dua titik ialah {B("sekan", PU)}.',
           'Pada setiap titik pada lilitan, hanya <b>satu</b> tangen boleh dilukis.'], col)
    + NOTE('Tangen dibina dengan melukis garis yang berserenjang dengan jejari di titik ketangenan.'),
    svg(fig, 'Bulatan dengan tangen, sekan dan garis yang tidak menyentuh bulatan'))

# 6.3-2 Tangen berserenjang dengan jejari
r, t, h = 5, 12, 13
assert r * r + t * t == h * h
sc = 22
O = (122, 290); P_ = (O[0] + h * sc, O[1])
ang = math.degrees(math.acos(r / h))
c = Circ(O[0], O[1], r * sc)
A = c.p(ang)
assert close(dist(A, P_), t * sc, 0.1) and close(angle_at(A, O, P_), 90)
fig = (c.draw(olab='') + LINE(EXT(P_, A, 70), P_, GR, 5) + POLY([O, A, P_], f'{GR}14')
       + LINE(O, A, PA, 4) + LINE(O, P_, MU3, 3.5, '8 6') + RIGHT(A, O, P_, TX, 15)
       + DOT(O, MU3, 5.5) + DOT(A, TX) + DOT(P_, TX)
       + T(O[0] - 18, O[1] + 4, 'O', MU3, 20) + T(A[0] - 6, A[1] - 24, 'A', TX, 21) + T(P_[0] + 18, P_[1] + 4, 'P', TX, 21)
       + T((O[0] + A[0]) / 2 - 22, (O[1] + A[1]) / 2, '5 cm', PA, 18) + T((O[0] + P_[0]) / 2, O[1] + 24, '13 cm', MU3, 18)
       + T((A[0] + P_[0]) / 2 + 14, (A[1] + P_[1]) / 2 - 18, '?', GR, 22))
add('6.3', 'SIFAT 1', 'Tangen berserenjang dengan jejari',
    DEF('Tangen kepada bulatan <b>berserenjang</b> dengan jejari di titik ketangenan: ∠OAP = 90°.', col)
    + P(f'PA ialah tangen di A. OA = {r} cm dan OP = {h} cm. Cari panjang PA.', True)
    + STEPS(['∠OAP = 90°, maka guna Teorem Pythagoras dalam ∆OAP.',
             f'PA² = OP² − OA² = {h}² − {r}² = {h * h} − {r * r} = {t * t}',
             f'PA = √{t * t}'], col)
    + ANS(f'PA = {t} cm'),
    svg(fig, 'Tangen PA berserenjang dengan jejari OA, OA 5 cm, OP 13 cm'))

# 6.3-3 Dua tangen dari titik luar
apb = 50; aob = 180 - apb
c = Circ(150, 235, 105)
d = c.R / math.sin(math.radians(apb / 2))
P_ = (c.cx + d, c.cy)
A, Bp = c.p(aob / 2), c.p(-aob / 2)
assert close(angle_at(A, c.O, P_), 90) and close(angle_at(P_, A, Bp), apb) and close(angle_at(c.O, A, Bp), aob)
assert close(dist(P_, A), dist(P_, Bp), 0.01)
fig = (c.draw(olab='') + POLY([c.O, A, P_, Bp], f'{GR}12')
       + LINE(EXT(P_, A, 50), P_, GR, 5) + LINE(EXT(P_, Bp, 50), P_, GR, 5)
       + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(c.O, P_, MU3, 3, '8 6')
       + RIGHT(A, c.O, P_, TX, 13) + RIGHT(Bp, c.O, P_, TX, 13)
       + ARC(P_, A, Bp, 58, AM, f'{apb}°', 18, 20) + ARC(c.O, A, Bp, 30, PK, '?', 20, 14)
       + DOT(c.O, MU3, 5.5) + DOT(A, TX) + DOT(Bp, TX) + DOT(P_, TX)
       + T(c.cx - 18, c.cy + 4, 'O', MU3, 20) + T(A[0] - 6, A[1] - 24, 'A', TX, 21) + T(Bp[0] - 6, Bp[1] + 26, 'B', TX, 21) + T(P_[0] + 18, P_[1] + 4, 'P', TX, 21))
add('6.3', 'SIFAT 2', 'Dua tangen dari satu titik luar',
    DEF('Jika PA dan PB ialah tangen dari titik luar P, maka:', col)
    + BUL(['<b>PA = PB</b> (panjang tangen sama)',
           '∠APO = ∠BPO dan ∠AOP = ∠BOP (OP pembahagi dua sudut)',
           '∆OAP dan ∆OBP kongruen'], col)
    + P(f'Diberi ∠APB = {apb}°. Cari ∠AOB.', True)
    + STEPS([f'∠OAP = ∠OBP = 90° (tangen ⊥ jejari)',
             f'∠AOB = 360° − 90° − 90° − {apb}° (sisi empat OAPB)'], col)
    + ANS(f'∠AOB = {aob}°'),
    svg(fig, f'Dua tangen PA dan PB dari titik P, sudut APB {apb} darjah'))
assert 360 - 90 - 90 - apb == aob

# 6.3-4 Sudut dalam tembereng selang-seli
tab = 65
c = Circ(250, 215, 170)
dA = 270; dB = (270 + 2 * tab) % 360; dC = 150
A, Bp, Cp = c.p(dA), c.p(dB), c.p(dC)
tl, tv = c.tangent(dA, 200, 200, GR, 5)
Tt = (A[0] + 160, A[1])
assert close(angle_at(A, Tt, Bp), tab) and close(angle_at(Cp, A, Bp), tab)
fig = (c.draw(centre=False) + tl + POLY([A, Bp, Cp], f'{TR}14')
       + LINE(A, Bp, PA, 4.5) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(A, Tt, Bp, 52, AM, f'{tab}°', 18, 18) + ARC(Cp, A, Bp, 44, AM, '?', 20, 16)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX)
       + T(A[0], A[1] + 24, 'A', TX, 21) + c.lab(dB, 'B') + c.lab(dC, 'C')
       + T(Tt[0] + 60, A[1] - 18, 'T', GR, 21) + T(A[0] - 190, A[1] - 18, 'S', GR, 21))
add('6.3', 'SIFAT 3', 'Sudut dalam tembereng selang-seli',
    DEF('Sudut di antara <b>tangen</b> dan <b>perentas</b> = sudut pada lilitan dalam <b>tembereng selang-seli</b>.', col)
    + P(f'SAT ialah tangen di A. Diberi ∠TAB = {tab}°. Cari ∠ACB.', True)
    + STEPS(['∠TAB ialah sudut di antara tangen AT dan perentas AB.',
             '∠ACB berada dalam tembereng di sebelah lain perentas AB (selang-seli).'], col)
    + ANS(f'∠ACB = ∠TAB = {tab}°')
    + NOTE(f'Begitu juga, ∠SAC = ∠ABC.'),
    svg(fig, f'Tangen SAT di A, sudut TAB {tab} darjah sama dengan sudut ACB'))
assert close(angle_at(A, (A[0] - 160, A[1]), Cp), angle_at(Bp, A, Cp))

# 6.3-5 Tangen sepunya
fig = ''
cases = [('Berasingan', 4, (110, 75), 50, (300, 75), 38), ('Bersentuhan di luar', 3, (130, 228), 46, (130 + 46 + 36, 228), 36),
         ('Bersilang', 2, (120, 378), 50, (185, 378), 40)]
for i, (nm, n, c1, ra, c2, rb) in enumerate(cases):
    y0 = 8 + i * 152
    fig += RECT(8, y0, 484, 144, SURF, BD, 16, 2)
    tg = common_tangents(c1, ra, c2, rb)
    assert len(tg) == n, (nm, len(tg))
    for t1, t2, nn in tg:
        if dist(t1, t2) < 1:      # tangen pada titik sentuhan
            v = (-nn[1], nn[0]); t1 = (t1[0] - v[0] * 55, t1[1] - v[1] * 55); t2 = (t2[0] + v[0] * 55, t2[1] + v[1] * 55)
        else:
            t1, t2 = EXT(t2, t1, 26), EXT(t1, t2, 26)
        fig += LINE(t1, t2, GR, 3)
    fig += f'<circle cx="{c1[0]}" cy="{c1[1]}" r="{ra}" fill="none" stroke="{MU3}" stroke-width="3"/>'
    fig += f'<circle cx="{r1(c2[0])}" cy="{c2[1]}" r="{rb}" fill="none" stroke="{MU3}" stroke-width="3"/>'
    fig += T(474, y0 + 52, nm, TX, 18, 'end') + T(474, y0 + 90, f'{n} tangen sepunya', GR, 18, 'end')
# klip rajah supaya tangen tidak keluar dari kad
fig = f'<clipPath id="tsclip"><rect x="8" y="8" width="484" height="452" rx="16"/></clipPath><g clip-path="url(#tsclip)">{fig}</g>'
add('6.3', 'KONSEP', 'Tangen sepunya',
    DEF('<b>Tangen sepunya</b> ialah garis lurus yang menjadi tangen kepada <b>dua</b> bulatan.', col)
    + TABLE(['Kedudukan dua bulatan', 'Bilangan'],
            [['Berasingan', '4'], ['Bersentuhan di luar', '3'], ['Bersilang pada dua titik', '2'],
             ['Bersentuhan di dalam', '1'], ['Satu di dalam yang lain (tidak bersentuh)', '0']], col)
    + NOTE('Contoh harian: tali sawat yang melilit dua takal atau rantai basikal.'),
    svg(fig, 'Bilangan tangen sepunya bagi dua bulatan berasingan, bersentuhan di luar dan bersilang'))

# 6.3-6 Contoh berlangkah: dua tangen + tembereng selang-seli
apb = 48; pab = (180 - apb) // 2
assert pab == 66
c = Circ(170, 235, 120)
d = c.R / math.sin(math.radians(apb / 2))
P_ = (c.cx + d, c.cy)
A, Bp = c.p(90 - apb / 2), c.p(-(90 - apb / 2))
dC = 180
Cp = c.p(dC)
assert close(angle_at(A, P_, Bp), pab) and close(angle_at(Cp, A, Bp), pab) and close(angle_at(P_, A, Bp), apb)
fig = (c.draw(centre=False) + LINE(EXT(P_, A, 40), P_, GR, 5) + LINE(EXT(P_, Bp, 40), P_, GR, 5)
       + POLY([A, Bp, P_], f'{GR}14') + LINE(A, Bp, PA, 4) + LINE(Cp, A, TR, 4) + LINE(Cp, Bp, TR, 4)
       + ARC(P_, A, Bp, 50, AM, f'{apb}°', 17, 18) + ARC(A, P_, Bp, 34, PK, '', 18) + ARC(Bp, A, P_, 34, PK, '', 18)
       + ARC(Cp, A, Bp, 46, TR, '?', 20, 15)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(P_, TX) + DOT(Cp, TX)
       + T(A[0] - 4, A[1] - 24, 'A', TX, 21) + T(Bp[0] - 4, Bp[1] + 26, 'B', TX, 21) + T(P_[0] + 18, P_[1] + 4, 'P', TX, 21) + c.lab(dC, 'C'))
add('6.3', 'CONTOH BERLANGKAH', 'Gabungan sifat tangen',
    P(f'PA dan PB ialah tangen kepada bulatan di A dan B. Diberi ∠APB = {apb}°. Cari ∠PAB dan ∠ACB.', True)
    + STEPS(['PA = PB, maka ∆PAB sama kaki.',
             f'∠PAB = (180° − {apb}°) ÷ 2 = {pab}°',
             f'∠ACB = ∠PAB = {pab}° (sudut dalam tembereng selang-seli)'], col)
    + ANS(f'∠PAB = {pab}°, ∠ACB = {pab}°')
    + NOTE('Tulis sebab bagi setiap langkah: "tangen dari titik luar" dan "tembereng selang-seli".'),
    svg(fig, f'Dua tangen PA dan PB, sudut APB {apb} darjah, cari sudut ACB'))

# 6.3-7 Kesilapan biasa & ringkasan
c = Circ(250, 170, 120)
dA = 270; dB = 30; dC = 150
A, Bp, Cp = c.p(dA), c.p(dB), c.p(dC)
tl, _ = c.tangent(dA, 170, 170, GR, 5)
Tt = (A[0] + 150, A[1])
fig = (c.draw(centre=True, olab='') + tl + LINE(c.O, A, PA, 3.5) + RIGHT(A, c.O, Tt, TX, 13)
       + LINE(A, Bp, PA, 4) + LINE(Cp, A, TR, 3.5) + LINE(Cp, Bp, TR, 3.5)
       + ARC(A, Tt, Bp, 40, AM, 'x', 19, 14) + ARC(Cp, A, Bp, 36, AM, 'x', 19, 14)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX) + T(A[0] - 14, A[1] + 22, 'A', TX, 20) + c.lab(dB, 'B', TX, 22, 20) + c.lab(dC, 'C', TX, 22, 20))
assert close(angle_at(A, Tt, Bp), angle_at(Cp, A, Bp))
rows = [(350, False, 'Sekan dianggap tangen'), (398, False, 'PA ≠ PB untuk tangen dari P'), (446, False, 'Tembereng yang salah')]
for y, ok, tt in rows:
    fig += RECT(60, y - 21, 380, 42, SURF, RD, 12, 2) + CROSS(86, y) + T(112, y, tt, RD, 18, 'start')
add('6.3', 'KESILAPAN BIASA', 'Kesilapan biasa dan ringkasan',
    BUL([f'{B("Sekan", RD)} (memotong di dua titik) bukan tangen.',
         f'{B("Panjang tangen", RD)}: dua tangen dari titik luar yang <b>sama</b> sentiasa sama panjang.',
         f'{B("Tembereng salah", RD)}: sudut tangen-perentas sama dengan sudut di tembereng <b>bertentangan</b>, bukan tembereng yang sama.'], col)
    + TABLE(['Sifat', 'Hubungan'],
            [['Tangen dan jejari', '∠OAP = 90°'],
             ['Dua tangen dari P', 'PA = PB'],
             ['Tembereng selang-seli', '∠ tangen-perentas = ∠ dalam tembereng selang-seli']], col),
    svg(fig, 'Ringkasan sifat tangen dan kesilapan biasa'))

# =====================================================================
# 6.4 SUDUT DAN TANGEN BAGI BULATAN (penyelesaian masalah)
# =====================================================================
col = SUB['6.4'][1]

# 6.4-1 Strategi
fig = ''
items = [('Sudut lilitan & pusat', 'lengkok sama, × 2, 90°', TR), ('Sisi empat kitaran', 'bertentangan = 180°', PU),
         ('Tangen', '⊥ jejari, PA = PB', GR), ('Tembereng selang-seli', '∠ tangen-perentas', AM)]
for i, (t1, t2, cl) in enumerate(items):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, BD, 16, 2)
    cc = Circ(66, y0 + 50, 34)
    fig += f'<circle cx="{cc.cx}" cy="{r1(cc.cy)}" r="34" fill="none" stroke="{MU3}" stroke-width="2.5"/>'
    if i == 0:
        a_, b_, V = cc.p(230), cc.p(310), cc.p(90)
        fig += LINE(cc.O, a_, PA, 2.5) + LINE(cc.O, b_, PA, 2.5) + LINE(V, a_, TR, 2.5) + LINE(V, b_, TR, 2.5)
    elif i == 1:
        fig += POLY([cc.p(d) for d in (120, 210, 300, 30)], f'{PU}33', PU, 2.5)
    elif i == 2:
        a_ = cc.p(90); fig += LINE(cc.O, a_, PA, 2.5) + LINE((a_[0] - 34, a_[1]), (a_[0] + 34, a_[1]), GR, 3)
    else:
        a_, b_, V = cc.p(270), cc.p(30), cc.p(150)
        fig += LINE((a_[0] - 34, a_[1]), (a_[0] + 34, a_[1]), GR, 3) + LINE(a_, b_, PA, 2.5) + LINE(V, a_, AM, 2.5) + LINE(V, b_, AM, 2.5)
    fig += T(122, y0 + 36, t1, cl, 21, 'start') + T(122, y0 + 68, t2, MU3, 18, 'start', halo=False)
add('6.4', 'STRATEGI', 'Menyelesaikan masalah sudut dan tangen',
    STEPS(['Tandakan semua maklumat yang diberi pada rajah.',
           'Cari <b>jejari</b> (segi tiga sama kaki), <b>diameter</b> (90°), <b>tangen</b> (90° dengan jejari) dan <b>sisi empat kitaran</b>.',
           'Pilih sifat yang menghubungkan sudut yang diketahui dengan sudut yang dicari.',
           'Tulis <b>sebab</b> bagi setiap langkah.'], col)
    + NOTE('Selalunya perlu menggunakan <b>dua atau lebih</b> sifat dalam satu soalan.'),
    svg(fig, 'Empat kumpulan sifat: sudut lilitan dan pusat, sisi empat kitaran, tangen, tembereng selang-seli'))

# 6.4-2 Contoh 1: tangen + diameter
qac = 52; abc = qac; bac = 90 - qac
c = Circ(230, 210, 170)
dA, dB = 270, 90
dC = 270 + 2 * qac      # lengkok AC (sebelah Q) = 2 × 52
A, Bp, Cp = c.p(dA), c.p(dB), c.p(dC)
tl, _ = c.tangent(dA, 200, 200, GR, 5)
Q = (A[0] + 160, A[1])
assert close(angle_at(A, Q, Cp), qac) and close(angle_at(Bp, A, Cp), abc) and close(angle_at(A, Bp, Cp), bac) and close(angle_at(Cp, A, Bp), 90)
fig = (c.draw(olab='') + tl + LINE(A, Bp, AM, 4.5) + POLY([A, Bp, Cp], f'{PA}14')
       + LINE(A, Cp, PA, 4) + LINE(Bp, Cp, PA, 4) + RIGHT(Cp, A, Bp, TX, 14)
       + ARC(A, Q, Cp, 52, GR, f'{qac}°', 17, 18) + ARC(Bp, A, Cp, 52, TR, '?', 20, 14) + ARC(A, Cp, Bp, 36, PK, '?', 18, 14)
       + DOT(c.O, MU3, 5.5) + T(c.cx - 18, c.cy, 'O', MU3, 19)
       + DOT(A, TX) + DOT(Bp, TX) + DOT(Cp, TX)
       + T(A[0], A[1] + 24, 'A', TX, 21) + c.lab(dB, 'B') + c.lab(dC, 'C')
       + T(Q[0] + 60, A[1] - 18, 'Q', GR, 21) + T(A[0] - 190, A[1] - 18, 'P', GR, 21))
add('6.4', 'CONTOH BERLANGKAH', 'Tangen dan diameter',
    P(f'PAQ ialah tangen di A dan AB ialah diameter. Diberi ∠QAC = {qac}°. Cari ∠ABC dan ∠BAC.', True)
    + STEPS([f'∠ABC = ∠QAC = {qac}° (tembereng selang-seli)',
             '∠ACB = 90° (sudut dalam semibulatan)',
             f'∠BAC = 180° − 90° − {qac}° = {bac}°'], col)
    + ANS(f'∠ABC = {abc}°, ∠BAC = {bac}°')
    + NOTE(f'∠QAB = 90° (tangen ⊥ jejari), maka ∠BAC = 90° − {qac}° = {bac}° ✓', 'Semak:'),
    svg(fig, f'Tangen PAQ, diameter AB, sudut QAC {qac} darjah'))

# 6.4-3 Contoh 2: sisi empat kitaran + sudut pusat + peluaran
bod = 130; bad = bod // 2; bcd = 180 - bad; dce = bad
assert (bad, bcd, dce) == (65, 115, 65)
c = Circ(230, 225, 170)
dB, dD = 270 - bod / 2, 270 + bod / 2
dA, dC = 110, 300
A, Bp, Cp, Dp = c.p(dA), c.p(dB), c.p(dC), c.p(dD)
E = EXT(Bp, Cp, 120)
assert close(angle_at(c.O, Bp, Dp), bod) and close(angle_at(A, Bp, Dp), bad) and close(angle_at(Cp, Bp, Dp), bcd) and close(angle_at(Cp, Dp, E), dce)
fig = (c.draw(olab='') + POLY([A, Bp, Cp, Dp], f'{PU}14', PU, 4) + LINE(c.O, Bp, PA, 3.5) + LINE(c.O, Dp, PA, 3.5) + LINE(Cp, E, PU, 4, '8 6')
       + ARC(c.O, Bp, Dp, 28, PA, f'{bod}°', 16, 18) + ARC(A, Bp, Dp, 42, AM, '', 18)
       + ARC(Cp, Dp, E, 34, TR, '?', 20, 14)
       + DOT(c.O, MU3, 5.5) + T(c.cx, c.cy - 20, 'O', MU3, 19)
       + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp)) + ''.join(c.lab(d, t) for d, t in zip((dA, dB, dC, dD), 'ABCD'))
       + T(E[0] + 6, E[1] + 22, 'E', TX, 21))
add('6.4', 'CONTOH BERLANGKAH', 'Sudut pusat dan sisi empat kitaran',
    P(f'O ialah pusat bulatan. BC dipanjangkan ke E dan {ANG}BOD = {bod}°. Cari {ANG}DCE.', True)
    + STEPS([f'{ANG}BAD = ½ × {bod}° = {bad}° (sudut pusat = 2 × sudut pada lilitan)',
             f'{ANG}BCD = 180° − {bad}° = {bcd}° (sudut bertentangan sisi empat kitaran)',
             f'{ANG}DCE = 180° − {bcd}° = {dce}° (sudut pada garis lurus)'], col)
    + ANS(f'{ANG}DCE = {dce}°')
    + NOTE(f'Jalan pintas: sudut peluaran {ANG}DCE = sudut pedalaman bertentangan {ANG}BAD = {bad}°.', 'Semak:'),
    svg(fig, f'Sisi empat kitaran ABCD dengan sudut pusat BOD {bod} darjah dan sudut peluaran DCE'))

# 6.4-4 Contoh 3: masalah harian
r, tt, h = 30, 40, 50
assert r * r + tt * tt == h * h
per = 2 * (r + tt); luas = 2 * (r * tt // 2)
assert (per, luas) == (140, 1200)
sc = 4
c = Circ(140, 220, r * sc)
d = h * sc; P_ = (c.cx + d, c.cy)
ang = math.degrees(math.acos(r / h))
A, Bp = c.p(ang), c.p(-ang)
assert close(dist(A, P_), tt * sc, 0.1)
fig = (c.draw(olab='') + POLY([c.O, A, P_, Bp], f'{PA}14')
       + LINE(A, P_, GR, 5) + LINE(Bp, P_, GR, 5) + LINE(c.O, A, PA, 4) + LINE(c.O, Bp, PA, 4) + LINE(c.O, P_, MU3, 3, '8 6')
       + RIGHT(A, c.O, P_, TX, 13) + RIGHT(Bp, c.O, P_, TX, 13)
       + DOT(c.O, MU3, 5.5) + DOT(A, TX) + DOT(Bp, TX) + DOT(P_, AM, 8)
       + T(c.cx - 18, c.cy + 4, 'O', MU3, 20) + T(A[0] - 4, A[1] - 24, 'A', TX, 21) + T(Bp[0] - 4, Bp[1] + 26, 'B', TX, 21) + T(P_[0] + 4, P_[1] - 22, 'P', AM, 21)
       + T((c.cx + A[0]) / 2 - 26, (c.cy + A[1]) / 2, '30 cm', PA, 17) + T((c.cx + P_[0]) / 2 + 30, c.cy + 20, '50 cm', MU3, 17)
       + T(250, 446, 'Roda berpusat O, paku di P', MU3, 18, halo=False))
add('6.4', 'PENYELESAIAN MASALAH', 'Tali tangen pada roda',
    P('Sebuah roda berjejari 30 cm berpusat O. Dua utas tali, PA dan PB, menyentuh roda di A dan B, dan diikat pada paku P yang berada 50 cm dari O. Hitung panjang PA dan perimeter OAPB.', True)
    + STEPS(['∠OAP = 90° (tangen ⊥ jejari)',
             f'PA = √(50² − 30²) = √{h * h - r * r} = {tt} cm, dan PB = PA = {tt} cm',
             f'Perimeter OAPB = 30 + {tt} + {tt} + 30 = {per} cm'], col)
    + ANS(f'PA = {tt} cm, perimeter = {per} cm')
    + NOTE(f'Luas OAPB = 2 × luas ∆OAP = 2 × ½ × 30 × {tt} = {luas} cm².', 'Cuba:'),
    svg(fig, 'Roda berjejari 30 cm dengan dua tali tangen PA dan PB dari paku P sejauh 50 cm'))

# 6.4-5 Kesilapan biasa & ringkasan bab
add('6.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Sifat', 'Hubungan'],
          [['Lengkok yang sama', 'Sudut pada lilitan sama'],
           ['Sudut pusat', '= 2 × sudut pada lilitan'],
           ['Semibulatan', 'Sudut = 90°'],
           ['Sisi empat kitaran', 'Bertentangan = 180°; peluaran = pedalaman bertentangan'],
           ['Tangen', 'Tangen ⊥ jejari; PA = PB'],
           ['Tembereng selang-seli', 'Sudut tangen-perentas = sudut dalam tembereng selang-seli']], col, rv=True)
    + NOTE('Kesilapan biasa: lupa menulis sebab, menggunakan lengkok yang salah, dan menganggap sisi empat bukan kitaran sebagai kitaran.', 'Awas:'),
    svg(''.join([
        Circ(250, 235, 180).draw(centre=True, olab='O'),
    ]) + (lambda c: (
        lambda A, Bp, Cp, Dp: POLY([A, Bp, Cp, Dp], f'{PU}14', PU, 3.5)
        + c.tangent(270, 200, 200, GR, 4.5)[0] + LINE(c.O, c.p(270), PA, 3.5) + RIGHT(c.p(270), c.O, (c.p(270)[0] + 100, c.p(270)[1]), TX, 13)
        + LINE(c.O, Bp, PA, 3.5) + LINE(c.O, Dp, PA, 3.5)
        + ''.join(DOT(p, TX) for p in (A, Bp, Cp, Dp, c.p(270)))
        + ''.join(c.lab(d, t) for d, t in zip((95, 195, 270, 345), 'ABCD'))
    )(c.p(95), c.p(195), c.p(270), c.p(345)))(Circ(250, 235, 180)), 'Rajah ringkasan bab: bulatan dengan sisi empat kitaran, sudut pusat dan tangen'))

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
assert 'NaN' not in js_body and 'None' not in js_body and 'nan' not in re.sub(r'[a-z]nan|nan[a-z]', '', js_body)
assert counts == {'6.1': 7, '6.2': 7, '6.3': 7, '6.4': 5}, counts

js = ('/* Dijana oleh tools/sudutbulatan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
