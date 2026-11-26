# Penjana slaid NOTA PECUT (Tingkatan 2 Bab 9 Laju dan Pecutan) -> pecut/slides.js
# Jalankan:  python3 tools/pecut/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
raise SystemExit('Dipersarakan: nota Bab 9 kini dijana oleh alat/nota/bina_bab9_t2.py (ikut buku teks).')
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'pecut', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '9.1': ('Laju', C['rd']),
    '9.2': ('Pecutan', C['am']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# warna tetap: jarak (biru), masa (merah jambu), laju (hijau); laju awal (biru), laju akhir (hijau)
JC, MC, LC = TR, PK, GR
V0C, V1C = TR, GR

# ---------- semakan matematik ----------
def fs(v):
    """Nombor -> teks: tanpa .0 berlebihan, tanda tolak sebenar."""
    v = F(v).limit_denominator(1000) if not isinstance(v, F) else v
    if v.denominator == 1:
        t = str(abs(v.numerator))
    else:
        t = f'{abs(float(v)):.4f}'.rstrip('0').rstrip('.')
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


def CAR(x, y, col, s=1.0):
    """Kereta kecil menghadap ke kanan; (x, y) = tengah bawah roda."""
    b = (f'<rect x="{r1(x - 30 * s)}" y="{r1(y - 26 * s)}" width="{r1(60 * s)}" height="{r1(16 * s)}" rx="{r1(6 * s)}" fill="{col}"/>'
         f'<path d="M{r1(x - 18 * s)} {r1(y - 26 * s)} L{r1(x - 10 * s)} {r1(y - 38 * s)} L{r1(x + 10 * s)} {r1(y - 38 * s)} L{r1(x + 18 * s)} {r1(y - 26 * s)} Z" fill="{col}"/>')
    for dx in (-17, 17):
        b += f'<circle cx="{r1(x + dx * s)}" cy="{r1(y - 8 * s)}" r="{r1(7 * s)}" fill="{NAV}" stroke="{MU3}" stroke-width="2.5"/>'
    return b

def GAUGE(cx, cy, R, v, vmax, col, lab, unit='m/s'):
    """Meter laju: lengkok 240° dari 0 hingga vmax."""
    ang = lambda x: math.radians(210 - 240 * x / vmax)
    P_ = lambda x, r: (cx + r * math.cos(ang(x)), cy - r * math.sin(ang(x)))
    sx, sy = P_(0, R); ex, ey = P_(vmax, R); vx, vy = P_(v, R)
    g = f'<circle cx="{cx}" cy="{cy}" r="{R + 12}" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
    g += f'<path d="M{r1(sx)} {r1(sy)} A{R} {R} 0 1 1 {r1(ex)} {r1(ey)}" fill="none" stroke="{DIM}" stroke-width="{r1(R * .1)}" stroke-linecap="round"/>'
    if v > 0:
        g += (f'<path d="M{r1(sx)} {r1(sy)} A{R} {R} 0 {1 if 240 * v / vmax > 180 else 0} 1 {r1(vx)} {r1(vy)}" fill="none" '
              f'stroke="{col}" stroke-width="{r1(R * .1)}" stroke-linecap="round"/>')
    for x in range(0, vmax + 1, 10):
        g += T(*P_(x, R * .7), str(x), MU2, 14, weight=600, halo=False)
    nx, ny = P_(v, R * .78)
    g += LINE((cx, cy), (nx, ny), TX, 4) + DOT((cx, cy), TX, 6)
    g += T(cx, cy + R * .45, f'{fs(v)} {unit}', col, 21)
    g += T(cx, cy + R + 34, lab, MU3, 18, halo=False)
    return g

class Graph:
    """Graf (contoh jarak-masa, laju-masa) dalam kotak (L, T, R, B) piksel."""
    def __init__(s, box, xmax, ymax, xstep, ystep, xt, yt, xlab=1, ylab=1, fsz=15):
        s.L, s.T_, s.R, s.B = box
        s.xmax, s.ymax, s.xstep, s.ystep, s.xt, s.yt, s.xlab, s.ylab, s.fsz = xmax, ymax, xstep, ystep, xt, yt, xlab, ylab, fsz
    def X(s, t): return s.L + (s.R - s.L) * t / s.xmax
    def Y(s, v): return s.B - (s.B - s.T_) * v / s.ymax
    def p(s, t, v): return (s.X(t), s.Y(v))
    def draw(s):
        g = ''
        nx, ny = round(s.xmax / s.xstep), round(s.ymax / s.ystep)
        for i in range(1, nx + 1):
            g += LINE(s.p(i * s.xstep, 0), s.p(i * s.xstep, s.ymax), GRID, 1.5, cap='butt')
        for j in range(1, ny + 1):
            g += LINE(s.p(0, j * s.ystep), s.p(s.xmax, j * s.ystep), GRID, 1.5, cap='butt')
        g += ARROW((s.L, s.B), (s.R + 14, s.B), MU, 2.5, 10) + ARROW((s.L, s.B), (s.L, s.T_ - 14), MU, 2.5, 10)
        for i in range(1, nx + 1):
            if i % s.xlab == 0:
                g += T(s.X(i * s.xstep), s.B + 17, fs(F(i) * F(s.xstep)), MU2, s.fsz, weight=600)
        for j in range(1, ny + 1):
            if j % s.ylab == 0:
                g += T(s.L - 9, s.Y(j * s.ystep), fs(F(j) * F(s.ystep)), MU2, s.fsz, 'end', weight=600)
        g += T(s.L - 9, s.B + 15, '0', MU2, s.fsz, 'end', weight=600)
        g += T(s.L - 30, s.T_ - 24, s.yt, MU, 16, 'start', halo=False)
        g += T(s.R + 16, s.B + 38, s.xt, MU, 16, 'end', halo=False)
        return g
    def path(s, pts, col, sw=5, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ''
        pp = ' L'.join(f'{r1(s.X(a))} {r1(s.Y(b))}' for a, b in pts)
        return f'<path d="M{pp}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{d}/>'

def MINI(box, pts, col):
    """Graf laju-masa kecil tanpa nombor; pts dalam [0,4] x [0,4]."""
    L, Tp, R, Bm = box
    X = lambda a: L + (R - L) * a / 4
    Y = lambda b: Bm - (Bm - Tp) * b / 4
    g = ARROW((L, Bm), (R + 8, Bm), MU2, 2.5, 8) + ARROW((L, Bm), (L, Tp - 8), MU2, 2.5, 8)
    pp = ' L'.join(f'{r1(X(a))} {r1(Y(b))}' for a, b in pts)
    g += f'<path d="M{pp}" fill="none" stroke="{col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    return g

def ROW(y, ok, t, why, x0=20, w=460, h=46, size=19):
    """Kotak jawapan betul / salah."""
    c = GR if ok else RD
    return (RECT(x0, y - h / 2, w, h, SURF, c, 12, 2) + (TICK(x0 + 26, y) if ok else CROSS(x0 + 26, y))
            + T(x0 + 52, y, t, c, size, 'start') + (T(x0 + w - 16, y, why, MU, 15, 'end', halo=False) if why else ''))

LAJU = FR('jarak', 'masa')
LPUR = FR('jumlah jarak', 'jumlah masa')
PEC = FR('laju akhir − laju awal', 'masa')

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 9.1 LAJU =====================
col = SUB['9.1'][1]

# 9.1-1 Definisi
assert F(200, 10) == 20
fig = (RECT(14, 14, 472, 196)
       + T(250, 42, 'Aida berjalan 200 m dalam 10 minit', MU3, 17, halo=False)
       + LINE((40, 150), (460, 150), MU2, 4)
       + ARROW((60, 112), (440, 112), JC, 3.5, 11) + ARROW((440, 112), (60, 112), JC, 3.5, 11)
       + T(250, 88, 'jarak = 200 m', JC, 20)
       + DOT((60, 150), TX, 8) + DOT((440, 150), TX, 8)
       + T(60, 180, 'mula', MU, 16, halo=False) + T(440, 180, 'tamat', MU, 16, halo=False)
       + T(250, 182, 'masa = 10 min', MC, 20))
A_, BL, BR = (250, 236), (86, 452), (414, 452)
ym = 360; k_ = (ym - A_[1]) / (BL[1] - A_[1])
xl, xr = A_[0] + (BL[0] - A_[0]) * k_, A_[0] + (BR[0] - A_[0]) * k_
fig += (POLY([A_, BL, BR], SURF, col, 4) + LINE((xl, ym), (xr, ym), col, 3) + LINE((250, ym), (250, 452), col, 3)
        + T(250, 318, 'Jarak', JC, 26) + T(190, 408, 'Laju', LC, 24) + T(310, 408, 'Masa', MC, 24)
        + T(250, 408, '×', MU, 22, halo=False))
add('9.1', 'DEFINISI', 'Apa itu laju?',
    DEF('<b>Laju</b> ialah <b>kadar</b> perubahan jarak terhadap masa, iaitu jarak yang dilalui dalam satu unit masa.', col)
    + P(f'Laju = {LAJU}')
    + BUL([f'Unit laju: <b>km/j</b>, <b>m/s</b>, <b>m/min</b> (unit jarak ÷ unit masa).',
           f'Aida: laju = 200 m ÷ 10 min = <b>20 m/min</b>.'], col)
    + NOTE(f'Tutup kuantiti yang dicari dalam segi tiga: {B("Jarak", JC)} = {B("Laju", LC)} × {B("Masa", MC)}, '
           f'{B("Masa", MC)} = {B("Jarak", JC)} ÷ {B("Laju", LC)}.', 'Segi tiga rumus:'),
    svg(fig, 'Aida berjalan 200 m dalam 10 minit dan segi tiga rumus jarak, laju dan masa'))

# 9.1-2 Laju seragam dan tak seragam
GA, GB = [20] * 5, [10, 20, 15, 30, 25]
assert sum(GA) == sum(GB) == 100 and F(sum(GA), 5) == 20
fig = ''
for k, (nm, gaps, cl, note) in enumerate([('A · laju seragam', GA, TR, 'Jarak sama setiap saat'),
                                          ('B · laju tak seragam', GB, PA, 'Jarak berbeza setiap saat')]):
    y0 = 14 + k * 226
    fig += RECT(14, y0, 472, 210)
    fig += T(34, y0 + 30, nm, cl, 20, 'start')
    X = lambda m: 44 + 4.12 * m
    ty = y0 + 118
    fig += LINE((X(0), ty), (X(100), ty), DIM, 4)
    pos = [0]
    for g_ in gaps: pos.append(pos[-1] + g_)
    for i in range(len(gaps)):
        fig += LINE((X(pos[i]), ty), (X(pos[i + 1]), ty), cl, 5)
        fig += T((X(pos[i]) + X(pos[i + 1])) / 2, ty - 24, f'{gaps[i]} m', TX, 15)
    for i, m in enumerate(pos):
        fig += DOT((X(m), ty), cl, 7) + T(X(m), ty + 26, f'{i} s', MU2, 14, weight=600)
    fig += T(250, y0 + 186, note, MU3, 16, halo=False)
fig += T(250, 476, 'Kedua-dua: 100 m dalam 5 s → laju purata 20 m/s', AM, 17, halo=False)
add('9.1', 'KONSEP', 'Laju seragam dan laju tak seragam',
    BUL([f'{B("Laju seragam", TR)}: jarak yang <b>sama</b> dilalui dalam setiap selang masa yang sama.',
         f'{B("Laju tak seragam", PA)}: jarak yang <b>berbeza</b> dilalui dalam selang masa yang sama.'], col)
    + TABLE(['Saat', '1', '2', '3', '4', '5'],
            [[B('A', TR)] + [f'{g_}&nbsp;m' for g_ in GA], [B('B', PA)] + [f'{g_}&nbsp;m' for g_ in GB]], col)
    + NOTE('Bagi laju tak seragam, kita mengira <b>laju purata</b>.'),
    svg(fig, 'Dua kereta: A bergerak 20 m setiap saat, B bergerak jarak berbeza setiap saat', 496))

# 9.1-3 Cari laju, jarak dan masa
E1, E2, E3 = (400, 50), (80, F(5, 2)), (135, 90)
assert F(*E1) == 8 and E2[0] * E2[1] == 200 and F(*E3) == F(3, 2)
fig = ''
CASES = [('Laju', 'Hakim: 400 m dalam 50 s', 'Laju = 400 ÷ 50', '= 8 m/s', LC),
         ('Jarak', 'Kereta: 80 km/j selama 2.5 j', 'Jarak = 80 × 2.5', '= 200 km', JC),
         ('Masa', 'Bas: 135 km pada 90 km/j', 'Masa = 135 ÷ 90', '= 1.5 j', MC)]
for i, (cari, sit, f1, f2, cl) in enumerate(CASES):
    y0 = 14 + i * 152
    fig += RECT(14, y0, 472, 140)
    a, bl, br = (92, y0 + 16), (24, y0 + 124), (160, y0 + 124)
    ym = y0 + 72; k_ = (ym - a[1]) / (bl[1] - a[1])
    fig += POLY([a, bl, br], NAV, DIM, 3) + LINE((a[0] + (bl[0] - a[0]) * k_, ym), (a[0] + (br[0] - a[0]) * k_, ym), DIM, 2.5)
    fig += LINE((92, ym), (92, y0 + 124), DIM, 2.5)
    for nm_, x_, y_ in (('Jarak', 92, y0 + 54), ('Laju', 64, y0 + 102), ('Masa', 120, y0 + 102)):
        fig += T(x_, y_, nm_, cl if nm_ == cari else MU2, 15 if nm_ == cari else 13, halo=False)
    fig += T(184, y0 + 34, sit, MU3, 16, 'start', halo=False)
    fig += T(184, y0 + 74, f1, TX, 21, 'start') + T(184, y0 + 110, f2, cl, 22, 'start')
add('9.1', 'CONTOH BERLANGKAH', 'Mencari laju, jarak dan masa',
    STEPS([f'Hakim berlari 400 m dalam 50 s. {B("Laju", LC)} = {FR("400 m", "50 s")} = <b>8 m/s</b>',
           f'Kereta bergerak 80 km/j selama 2.5 j. {B("Jarak", JC)} = 80 × 2.5 = <b>200 km</b>',
           f'Bas bergerak 135 km pada laju 90 km/j. {B("Masa", MC)} = {FR("135 km", "90 km/j")} = <b>1.5 j</b> (1&nbsp;j&nbsp;30&nbsp;min)'], col)
    + NOTE('Pastikan unit sepadan: km dengan km/j dan jam; m dengan m/s dan saat.'),
    svg(fig, 'Segi tiga rumus untuk mencari laju, jarak dan masa'))

# 9.1-4 Tukar unit
assert F(72 * 1000, 3600) == 20 and F(72) / F(36, 10) == 20
assert F(90 * 1000, 3600) == 25 and 25 * 60 == 1500 and F(90 * 1000, 60) == 1500 and F(25 * 3600, 1000) == 90
fig = (RECT(14, 14, 472, 76) + T(250, 52, '1 km = 1000 m  ·  1 j = 60 min = 3600 s', TX, 19))
for y_, t_, cl in ((116, '90 km/j', TR), (256, '25 m/s', GR), (396, '1500 m/min', PA)):
    fig += RECT(130, y_, 240, 62, SURF, cl, 16, 3) + T(250, y_ + 31, t_, cl, 26)
for ya, yb, dn, up in ((184, 250, '× 1000 ÷ 3600', '× 3600 ÷ 1000'), (324, 390, '× 60', '÷ 60')):
    fig += ARROW((200, ya), (200, yb), AM, 3.5, 10) + T(186, (ya + yb) / 2, dn, AM, 17, 'end')
    fig += ARROW((300, yb), (300, ya), PU, 3.5, 10) + T(314, (ya + yb) / 2, up, PU, 17, 'start')
add('9.1', 'TUKAR UNIT', 'Menukar unit laju',
    BUL([f'{B("km/j → m/s", AM)}: × 1000 (km → m), kemudian ÷ 3600 (j → s).',
         f'{B("m/s → km/j", PU)}: × 3600, kemudian ÷ 1000.',
         f'{B("m/s ↔ m/min", AM)}: × 60 atau ÷ 60.'], col)
    + P('Tukarkan 72 km/j kepada m/s.', True)
    + STEPS([f'72 km/j = {FR("72 × 1000 m", "3600 s")} = {FR("72 000", "3600")}'], col)
    + ANS('72 km/j = 20 m/s')
    + NOTE('km/j ÷ 3.6 = m/s dan m/s × 3.6 = km/j.', 'Jalan pintas:'),
    svg(fig, '90 km/j sama dengan 25 m/s dan 1500 m/min'))

# 9.1-5 Laju purata
d1, t1, rest, d2, t2 = 120, F(2), F(1, 2), 90, F(3, 2)
Dt, Tt = d1 + d2, t1 + rest + t2
vp = Dt / Tt
assert Dt == 210 and Tt == 4 and vp == F(105, 2)
xA, xC = 50, 450
xB = xA + (xC - xA) * d1 / Dt
fig = (RECT(14, 14, 472, 226)
       + LINE((xA, 150), (xB, 150), JC, 6) + LINE((xB, 150), (xC, 150), JC, 6)
       + T((xA + xB) / 2, 124, '120 km', JC, 20) + T((xB + xC) / 2, 124, '90 km', JC, 20)
       + T((xA + xB) / 2, 178, '2 j', MC, 19) + T((xB + xC) / 2, 178, '1.5 j', MC, 19)
       + RECT(xB - 62, 50, 124, 38, NAV, MC, 12, 2) + T(xB, 69, 'rehat 30 min', MC, 15)
       + LINE((xB, 90), (xB, 136), MC, 2.5, '5 5'))
for x_, l_ in ((xA, 'A'), (xB, 'B'), (xC, 'C')):
    fig += DOT((x_, 150), TX, 9) + T(x_, 214, l_, TX, 20)
fig += (RECT(14, 256, 472, 200)
        + T(250, 294, 'Jumlah jarak = 120 + 90 = 210 km', JC, 19)
        + T(250, 340, 'Jumlah masa = 2 + 0.5 + 1.5 = 4 j', MC, 19)
        + LINE((60, 372), (440, 372), BD, 2)
        + T(250, 412, f'Laju purata = 210 ÷ 4 = {fs(vp)} km/j', AM, 21))
add('9.1', 'CONTOH BERLANGKAH', 'Laju purata',
    DEF(f'<b>Laju purata</b> = {LPUR}', col)
    + P('Kereta bergerak 120 km dari A ke B dalam 2 jam, berehat 30 minit, kemudian bergerak 90 km ke C dalam 1.5 jam. Hitung laju purata kereta itu.', True)
    + STEPS([f'Jumlah jarak = 120 + 90 = {B("210 km", JC)}',
             f'Jumlah masa = 2 + 0.5 + 1.5 = {B("4 j", MC)} (30 min = 0.5 j)',
             f'Laju purata = {FR("210 km", "4 j")} = {fs(vp)} km/j'], col)
    + ANS(f'Laju purata = {fs(vp)} km/j'),
    svg(fig, 'Perjalanan A ke B ke C dengan rehat 30 minit di B'))

# 9.1-6 Graf dan jadual perjalanan
PTS = [(0, 0), (2, 100), (3, 100), (4, 160)]
sp = [F(PTS[i + 1][1] - PTS[i][1], PTS[i + 1][0] - PTS[i][0]) for i in range(3)]
assert sp == [50, 0, 60] and F(160, 4) == 40
gr_ = Graph((80, 52, 452, 400), 4, 160, 1, 20, 'Masa (j)', 'Jarak (km)', 1, 2)
fig = gr_.draw()
fig += LINE(gr_.p(2, 0), gr_.p(2, 100), DIM, 2, '6 6') + LINE(gr_.p(0, 100), gr_.p(2, 100), DIM, 2, '6 6')
fig += gr_.path(PTS[0:2], TR) + gr_.path(PTS[1:3], MU3) + gr_.path(PTS[2:4], GR)
for p_ in PTS: fig += DOT(gr_.p(*p_), TX, 6.5)
fig += T(gr_.X(1) - 12, gr_.Y(64), '50 km/j', TR, 18, 'end')
fig += T(gr_.X(2.5), gr_.Y(100) - 24, 'pegun', MU3, 17)
fig += T(gr_.X(3.5) - 12, gr_.Y(130) - 6, '60 km/j', GR, 18, 'end')
add('9.1', 'GRAF & JADUAL', 'Graf dan jadual perjalanan',
    TABLE(['Masa (j)', '0', '2', '3', '4'], [['Jarak (km)', '0', '100', '100', '160']], col)
    + BUL([f'Laju setiap bahagian = perubahan jarak ÷ perubahan masa: {B("100 ÷ 2 = 50 km/j", TR)}, {B("60 ÷ 1 = 60 km/j", GR)}.',
           'Garis <b>mendatar</b>: jarak tidak berubah, objek <b>pegun</b> (laju 0).',
           'Garis lebih <b>curam</b>: laju lebih tinggi.'], col)
    + NOTE('Laju purata = 160 km ÷ 4 j = <b>40 km/j</b>.'),
    svg(fig, 'Graf jarak-masa sebuah bas: 100 km dalam 2 jam, pegun 1 jam, kemudian 60 km dalam 1 jam'))

# 9.1-7 Kesilapan biasa
assert F(120, 60) == 2 and F(120, 40) == 3 and F(240, 5) == 48 and F(60 + 40, 2) == 50
assert 2 + F(30, 60) == F(5, 2)
fig = (RECT(14, 14, 472, 160)
       + T(250, 38, 'Pergi dan balik sejauh 120 km', MU3, 17, halo=False)
       + ARROW((60, 94), (440, 94), TR, 4, 12) + T(250, 70, 'pergi: 60 km/j · 2 j', TR, 17)
       + ARROW((440, 126), (60, 126), PA, 4, 12) + T(250, 152, 'balik: 40 km/j · 3 j', PA, 17))
fig += T(250, 198, 'Laju purata?', TX, 18, halo=False)
fig += ROW(236, False, '(60 + 40) ÷ 2 = 50 km/j', 'purata dua laju')
fig += ROW(290, True, '240 ÷ 5 = 48 km/j', 'jumlah ÷ jumlah')
fig += T(250, 344, '2 j 30 min dalam jam?', TX, 18, halo=False)
fig += ROW(384, False, '2 j 30 min = 2.3 j', '30 min ≠ 0.3 j')
fig += ROW(438, True, '2 j 30 min = 2.5 j', '30 ÷ 60 = 0.5')
add('9.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Mengambil purata dua laju", RD)} ✗ → laju purata = jumlah jarak ÷ jumlah masa.',
         f'{B("Lupa masa rehat", RD)} ✗ → masa berhenti termasuk dalam jumlah masa.',
         f'{B("Unit tidak sepadan", RD)} ✗ → tukar minit kepada jam (÷ 60) dahulu.',
         f'{B("Darab jarak dengan masa", RD)} ✗ → laju = jarak ÷ masa.'], col)
    + NOTE('Sentiasa tulis <b>unit</b> laju dalam jawapan (km/j, m/s, m/min).', 'Ingat:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi laju purata dan penukaran masa'))

# ===================== 9.2 PECUTAN =====================
col = SUB['9.2'][1]

# 9.2-1 Definisi
u, v, t = 5, 20, 5
a = F(v - u, t); assert a == 3
fig = (T(250, 34, 'Laju motosikal bertambah dalam 5 s', MU3, 17, halo=False)
       + GAUGE(128, 168, 92, u, 30, V0C, 'laju awal') + GAUGE(372, 168, 92, v, 30, V1C, 'laju akhir')
       + ARROW((234, 168), (268, 168), MC, 4, 10) + T(250, 140, '5 s', MC, 20)
       + RECT(14, 330, 472, 126)
       + T(250, 368, 'Pecutan = (20 − 5) ÷ 5', TX, 21) + T(250, 416, f'= 15 ÷ 5 = {fs(a)} m/s²', AM, 24))
add('9.2', 'DEFINISI', 'Apa itu pecutan?',
    DEF('<b>Pecutan</b> ialah <b>kadar perubahan laju</b> terhadap masa.', col)
    + P(f'Pecutan = {PEC}')
    + BUL([f'Unit: <b>m/s²</b> (laju dalam m/s, masa dalam s) atau <b>km/j²</b> (laju dalam km/j, masa dalam j).'], col)
    + P(f'Laju motosikal bertambah daripada {B("5 m/s", V0C)} kepada {B("20 m/s", V1C)} dalam {B("5 s", MC)}. Cari pecutannya.', True)
    + STEPS([f'Pecutan = {FR("20 − 5", "5")} = {FR(15, 5)} = 3'], col)
    + ANS('Pecutan = 3 m/s²'),
    svg(fig, 'Meter laju menunjukkan laju bertambah daripada 5 m/s kepada 20 m/s dalam 5 saat'))

# 9.2-2 Tiga jenis
JENIS = [('Pecutan (positif)', GR, [(0, 1), (4, 3.6)], 'laju bertambah', 'pecutan > 0'),
         ('Nyahpecutan (negatif)', RD, [(0, 3.6), (4, 1)], 'laju berkurang', 'pecutan < 0'),
         ('Pecutan sifar', AM, [(0, 2.4), (4, 2.4)], 'laju seragam (tidak berubah)', 'pecutan = 0')]
fig = ''
for i, (nm, cl, pts, d, sgn) in enumerate(JENIS):
    y0 = 14 + i * 152
    fig += RECT(14, y0, 472, 140)
    fig += MINI((44, y0 + 26, 160, y0 + 112), pts, cl)
    fig += T(36, y0 + 16, 'laju', MU2, 12, 'start', halo=False) + T(176, y0 + 128, 'masa', MU2, 12, 'end', halo=False)
    fig += T(196, y0 + 40, nm, cl, 20, 'start') + T(196, y0 + 76, d, MU3, 16, 'start', halo=False)
    fig += T(196, y0 + 110, sgn, TX, 19, 'start')
add('9.2', 'KONSEP', 'Pecutan, nyahpecutan dan pecutan sifar',
    BUL([f'{B("Pecutan positif", GR)}: laju <b>bertambah</b> (laju akhir &gt; laju awal).',
         f'{B("Nyahpecutan", RD)}: laju <b>berkurang</b>, nilai pecutan <b>negatif</b>.',
         f'{B("Pecutan sifar", AM)}: laju tidak berubah, iaitu <b>laju seragam</b>.'], col)
    + NOTE('Objek <b>pegun</b> mempunyai laju 0 dan pecutan 0.')
    + NOTE('Graf di sebelah ialah graf <b>laju–masa</b>: garis naik = pecutan, garis turun = nyahpecutan, garis mendatar = laju seragam.', 'Graf:'),
    svg(fig, 'Graf laju-masa bagi pecutan, nyahpecutan dan pecutan sifar'))

# 9.2-3 Nyahpecutan
u, v, t = 20, 5, 5
a = F(v - u, t); assert a == -3
gr_ = Graph((80, 52, 452, 380), 5, 25, 1, 5, 'Masa (s)', 'Laju (m/s)')
fig = gr_.draw()
fig += LINE(gr_.p(0, 5), gr_.p(5, 5), DIM, 2, '6 6') + LINE(gr_.p(5, 0), gr_.p(5, 5), DIM, 2, '6 6')
fig += gr_.path([(0, 20), (5, 5)], RD)
fig += DOT(gr_.p(0, 20), V0C, 8) + DOT(gr_.p(5, 5), V1C, 8)
fig += T(gr_.X(0) + 16, gr_.Y(20) - 22, 'laju awal 20 m/s', V0C, 17, 'start')
fig += T(gr_.X(5) - 12, gr_.Y(5) + 26, 'laju akhir 5 m/s', V1C, 17, 'end')
fig += T(gr_.X(2.4), gr_.Y(9.5), 'turun 15 m/s', RD, 18, 'end')
fig += T(250, 452, 'Laju berkurang → nyahpecutan', MU3, 18, halo=False)
add('9.2', 'CONTOH BERLANGKAH', 'Mengira nyahpecutan',
    P(f'Sebuah kereta membrek. Lajunya berkurang daripada {B("20 m/s", V0C)} kepada {B("5 m/s", V1C)} dalam 5 s. Cari nyahpecutan kereta itu.', True)
    + STEPS([f'Pecutan = {FR("5 − 20", "5")}',
             f'= {FR("−15", "5")} = −3 m/s²',
             'Tanda negatif bermaksud laju berkurang, iaitu <b>nyahpecutan</b>.'], col)
    + ANS('Nyahpecutan = 3 m/s²')
    + NOTE('Tulis <b>pecutan = −3 m/s²</b> atau <b>nyahpecutan = 3 m/s²</b>. Jangan tulis "nyahpecutan −3 m/s²".'),
    svg(fig, 'Graf laju-masa: laju turun daripada 20 m/s kepada 5 m/s dalam 5 saat'))

# 9.2-4 Tukar unit
aA = F(F(72 * 1000, 3600) - 0, 10); assert F(72 * 1000, 3600) == 20 and aA == 2
tB = F(15, 60); aB = F(100 - 40) / tB; assert tB == F(1, 4) and aB == 240
fig = ''
PAN = [('A · laju dalam km/j, masa dalam saat', '72 km/j ÷ 3.6 = 20 m/s', TR, '(20 − 0) ÷ 10', f'= {fs(aA)} m/s²'),
       ('B · masa dalam minit', '15 min = 15 ÷ 60 = 0.25 j', MC, '(100 − 40) ÷ 0.25', f'= {fs(aB)} km/j²')]
for i, (h_, c1, cl, f1, f2) in enumerate(PAN):
    y0 = 14 + i * 226
    fig += RECT(14, y0, 472, 210)
    fig += T(34, y0 + 30, h_, MU3, 16, 'start', halo=False)
    fig += RECT(40, y0 + 52, 420, 50, NAV, cl, 12, 2) + T(250, y0 + 77, c1, cl, 20)
    fig += T(250, y0 + 132, f1, TX, 21) + T(250, y0 + 176, f2, AM, 25)
add('9.2', 'TUKAR UNIT', 'Unit laju dan masa mesti sepadan',
    BUL([f'm/s dengan s → {B("m/s²", AM)} &nbsp;·&nbsp; km/j dengan j → {B("km/j²", AM)}'], col)
    + P('<b>A:</b> Laju kereta bertambah daripada 0 kepada 72 km/j dalam 10 s. Cari pecutan dalam m/s².', True)
    + P('<b>B:</b> Laju bas bertambah daripada 40 km/j kepada 100 km/j dalam 15 minit. Cari pecutan dalam km/j².', True)
    + STEPS([f'A: 72 km/j = 20 m/s → pecutan = {FR("20 − 0", "10")} = 2 m/s²',
             f'B: 15 min = 0.25 j → pecutan = {FR("100 − 40", "0.25")} = 240 km/j²'], col)
    + ANS('A: 2 m/s² &nbsp;·&nbsp; B: 240 km/j²'),
    svg(fig, 'Dua contoh menukar unit sebelum mengira pecutan'))

# 9.2-5 Penyelesaian masalah
u1, a1, t1 = 10, 2, 6; v1 = u1 + a1 * t1; assert v1 == 22
u2, d2 = 24, 4; t2 = F(u2 - 0, d2); assert t2 == 6 and u2 - d2 * t2 == 0
fig = ''
for i, (lab, pts, cl, l0, l1) in enumerate([('(a) memecut 2 m/s²', [(0, 10), (6, 22)], GR, '10 m/s', '22 m/s'),
                                             ('(b) nyahpecutan 4 m/s²', [(0, 24), (6, 0)], RD, '24 m/s', 'berhenti')]):
    y0 = 14 + i * 228
    fig += RECT(14, y0, 472, 214)
    g_ = Graph((80, y0 + 50, 440, y0 + 168), 6, 25, 1, 5, 'Masa (s)', 'Laju (m/s)', 1, 2, fsz=14)
    fig += g_.draw() + g_.path(pts, cl)
    fig += DOT(g_.p(*pts[0]), cl, 7) + DOT(g_.p(*pts[1]), cl, 7)
    fig += T(476, y0 + 26, lab, cl, 17, 'end')
    fig += T(g_.X(0) + 14, g_.Y(pts[0][1]) - 18 if i == 0 else g_.Y(17), l0, TX, 15, 'start')
    fig += T(g_.X(6) - 10, g_.Y(pts[1][1]) - 18, l1, TX, 15, 'end')
add('9.2', 'PENYELESAIAN MASALAH', 'Mencari laju akhir dan masa',
    P('(a) Sebuah kereta bergerak pada 10 m/s, kemudian memecut 2 m/s² selama 6 s. Cari laju akhirnya.', True)
    + P('(b) Sebuah lori bergerak pada 24 m/s, kemudian membrek dengan nyahpecutan 4 m/s² hingga berhenti. Berapa lamakah masa yang diambil?', True)
    + STEPS(['(a) Perubahan laju = 2 × 6 = 12 m/s → laju akhir = 10 + 12 = <b>22 m/s</b>',
             f'(b) Laju berkurang 24 − 0 = 24 m/s → masa = {FR("24", "4")} = <b>6 s</b>'], col)
    + NOTE('Perubahan laju = pecutan × masa.', 'Ingat:'),
    svg(fig, 'Graf laju-masa: (a) laju naik daripada 10 kepada 22 m/s, (b) laju turun daripada 24 m/s hingga berhenti'))

# 9.2-6 Kesilapan biasa
assert F(20 - 8, 4) == 3 and F(8 - 20, 4) == -3 and F(20, 4) == 5
fig = (RECT(14, 14, 472, 92)
       + T(250, 44, 'Laju basikal bertambah', MU3, 17, halo=False)
       + T(250, 78, '8 m/s → 20 m/s dalam 4 s', TX, 20))
fig += ROW(160, True, '(20 − 8) ÷ 4 = 3 m/s²', 'betul')
fig += ROW(232, False, '(8 − 20) ÷ 4 = −3 m/s²', 'tertib terbalik')
fig += ROW(304, False, '20 ÷ 4 = 5 m/s²', 'lupa laju awal')
fig += ROW(376, False, '(20 − 8) ÷ 4 = 3 m/s', 'unit salah')
fig += T(250, 440, 'Laju akhir − laju awal, bukan sebaliknya', MU3, 17, halo=False)
add('9.2', 'KESILAPAN BIASA', 'Semak jawapan anda',
    BUL([f'{B("Menterbalikkan tertib", RD)}: (laju awal − laju akhir) ✗',
         f'{B("Menggunakan jarak", RD)}, bukan laju, dalam rumus pecutan ✗',
         f'{B("Unit salah", RD)}: unit pecutan ialah m/s² atau km/j², bukan m/s ✗',
         f'{B("Unit masa tidak sepadan", RD)}: laju km/j dengan masa dalam minit ✗'], col)
    + NOTE(f'Pecutan = {PEC}', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi pecutan basikal'))

# 9.2-7 Ringkasan bab
fig = ''
RK = [('Laju seragam', AM, [(0, 2.4), (4, 2.4)], 'laju tetap', 'pecutan 0'),
      ('Laju tak seragam', PA, [(0, 1), (1, 2.6), (2, 1.8), (3, 3.4), (4, 2.6)], 'laju berubah-ubah', 'laju purata'),
      ('Pecutan', GR, [(0, 1), (4, 3.6)], 'laju bertambah', 'pecutan +'),
      ('Nyahpecutan', RD, [(0, 3.6), (4, 1)], 'laju berkurang', 'pecutan −')]
for i, (nm, cl, pts, d, vv) in enumerate(RK):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100)
    fig += MINI((40, y0 + 20, 104, y0 + 80), pts, cl)
    fig += T(128, y0 + 36, nm, cl, 21, 'start') + T(128, y0 + 68, d, MU, 17, 'start', halo=False)
    fig += T(466, y0 + 50, vv, TX, 19, 'end')
add('9.2', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus'],
          [['Laju', LAJU],
           ['Laju purata', LPUR],
           ['Pecutan', PEC],
           ['Tukar unit', 'km/j ÷ 3.6 = m/s']], col, rv=True)
    + BUL(['Pecutan negatif = <b>nyahpecutan</b>; pecutan sifar = <b>laju seragam</b>.'], col),
    svg(fig, 'Ringkasan: laju seragam, laju tak seragam, pecutan dan nyahpecutan'))

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
assert counts == {'9.1': 7, '9.2': 7}, counts

js = ('/* Dijana oleh tools/pecut/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
