# Penjana slaid NOTA Bab 8 Sukatan Serakan Data Tak Terkumpul (Tingkatan 4) -> serakan/slides.js
# Jalankan:  python3 tools/serakan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
import statistics as st
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'serakan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# KSSM Bab 8 ada SK 8.1 (satu SP) dan SK 8.2 (SP 8.2.1 - 8.2.6). Subtopik app:
# 8.1.1 = SP 8.1.1 · 8.2.1 = SP 8.2.1 (julat, kuartil, JAK) · 8.2.2 = SP 8.2.1 (varians, sisihan piawai) + SP 8.2.2
# 8.2.3 = SP 8.2.3 (plot kotak) · 8.2.4 = SP 8.2.4 - 8.2.6 (kesan perubahan, pencilan, banding, penyelesaian masalah)
SUB = {
    '8.1.1': ('Serakan', TR),
    '8.2.1': ('Julat dan Julat Antara Kuartil', PA),
    '8.2.2': ('Varians dan Sisihan Piawai', PK),
    '8.2.3': ('Plot Kotak', PU),
    '8.2.4': ('Kesan Perubahan dan Perbandingan', GR),
}
JC, QC, MEDC, MINC, SDC = PA, PU, AM, GR, PK   # julat oren, kuartil ungu, median kuning, min hijau, sisihan piawai merah jambu

# ---------- semakan matematik ----------
def mod(d):
    m = st.multimode(d)
    return m if len(m) < len(set(d)) or len(set(d)) == 1 else []
def med(d): return F(sorted(d)[(len(d) - 1) // 2] + sorted(d)[len(d) // 2], 2)
def mean(d): return F(sum(d), len(d))
def num(v):
    """Nombor -> teks (titik perpuluhan, tolak sebenar, tanpa .0)."""
    v = F(v)
    if v.denominator == 1: t = str(abs(v.numerator))
    else:
        x = round(float(abs(v)), 2); t = f'{x:.2f}'.rstrip('0').rstrip('.')
    return ('−' if v < 0 else '') + t
def nl(d): return ', '.join(num(x) for x in d)

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
def TABLE(head, rows, col, rv=False, last_bold=False):
    th = ''.join(f'<th style="padding: 8px 12px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''
    for i, r in enumerate(rows):
        bold = last_bold and i == len(rows) - 1
        st_ = f' style="background: {NAV}"' if bold else ''
        tb += f'<tr{" class=\"rv\"" if rv else ""}{st_}>' + ''.join(
            f'<td style="padding: 7px 12px; font-size: 19px; font-weight: {800 if bold else 600}; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>'
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
SIG = 'Σ'

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
def CIRC(p, col, r=10, stroke=NAV, sw=2.5, fill=None):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{fill or col}" stroke="{stroke}" stroke-width="{sw}"/>'
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
def FULC(x, y, col=GR, s=16):
    """Segi tiga titik imbang (puncak di (x, y))."""
    return POLY([(x, y), (x - s, y + s * 1.5), (x + s, y + s * 1.5)], col, NAV, 2)

def DOTPLOT(data, lo, hi, L=40, R=460, base=330, r=11, gap=25, cols=None, step=1, fs_=16, lab_step=None):
    """Plot titik: paksi mengufuk lo..hi, titik bertindan di atas setiap nilai."""
    X = lambda v: L + (v - lo) / (hi - lo) * (R - L)
    s = LINE((L - 14, base), (R + 14, base), MU, 3)
    lab_step = lab_step or step
    v = lo
    while v <= hi + 1e-9:
        s += LINE((X(v), base - 6), (X(v), base + 6), MU, 2.5)
        if round((v - lo) / lab_step, 6) % 1 == 0:
            s += T(X(v), base + 22, num(F(v)), MU3, fs_, weight=600, halo=False)
        v += step
    cnt = {}
    for x in data:
        k = cnt.get(x, 0); cnt[x] = k + 1
        col = (cols or {}).get(x, TR)
        s += CIRC((X(x), base - 18 - k * gap), col, r)
    return s, X

def BARS(labels, vals, box, ymax, ystep, cols=None, ylab='', xlab='', bw=0.62, hist=False, vlab=False, fs_=16):
    """Carta palang / histogram dalam kotak (L, T, R, Bm)."""
    L, Tp, R, Bm = box
    n = len(vals); cw = (R - L) / n
    Y = lambda v: Bm - v / ymax * (Bm - Tp)
    s = ''
    v = 0
    while v <= ymax + 1e-9:
        s += LINE((L, Y(v)), (R, Y(v)), GRID, 1.5, cap='butt') + T(L - 8, Y(v), num(F(v)), MU2, 14, 'end', 600, halo=False)
        v += ystep
    for i, (lb, val) in enumerate(zip(labels, vals)):
        col = (cols or {}).get(i, TR)
        w = cw if hist else cw * bw
        x = L + i * cw + (cw - w) / 2
        if val > 0:
            s += f'<rect x="{r1(x)}" y="{r1(Y(val))}" width="{r1(w)}" height="{r1(Y(0) - Y(val))}" fill="{col}" fill-opacity="0.85" stroke="{NAV if hist else col}" stroke-width="{2 if hist else 0}"/>'
        if vlab: s += T(L + i * cw + cw / 2, Y(val) - 14, num(F(val)), col, 16)
        s += T(L + i * cw + cw / 2, Bm + 18, lb, MU3, fs_, weight=600, halo=False)
    s += LINE((L, Bm), (R, Bm), MU, 3) + LINE((L, Bm), (L, Tp - 6), MU, 3)
    if ylab: s += T(L - 6, Tp - 22, ylab, MU, 15, 'start', halo=False)
    if xlab: s += T((L + R) / 2, Bm + 44, xlab, MU, 15, halo=False)
    return s, Y

def CHIPS(vals, x0, y, w=52, h=46, gap=10, cols=None, fs_=20):
    s = ''
    for i, v in enumerate(vals):
        col = (cols or {}).get(i, BD)
        x = x0 + i * (w + gap)
        s += RECT(x, y, w, h, SURF if col == BD else f'{col}33', col, 10, 2.5)
        s += T(x + w / 2, y + h / 2 + 1, v, TX, fs_, halo=False)
    return s

def LEGEND(y, items, x0=30, x1=470, h=54):
    """Kotak ringkasan nilai: items = [(label, nilai, warna)]."""
    s = RECT(x0, y, x1 - x0, h, SURF, BD, 14, 2)
    cw = (x1 - x0) / len(items)
    for i, (lb, v, col) in enumerate(items):
        cx = x0 + cw * i + cw / 2
        s += T(cx, y + h / 2, f'{lb} = {v}', col, 19, halo=False)
    return s


# ---------- semakan statistik serakan ----------
def halves(d):
    """Bahagian sebelum dan selepas median (median dikecualikan jika n ganjil) - kaedah buku teks."""
    s = sorted(d); n = len(s)
    return s[:n // 2], s[(n + 1) // 2:]
def q1(d): return med(halves(d)[0])
def q3(d): return med(halves(d)[1])
def jak(d): return q3(d) - q1(d)
def julat(d): return max(d) - min(d)
def var(d):
    m = mean(d); return sum((F(x) - m) ** 2 for x in d) / len(d)
def sd(d): return math.sqrt(var(d))
def r2(x): return num(F(round(x, 2)).limit_denominator(100))
def five(d): return (min(d), q1(d), med(d), q3(d), max(d))

# ---------- pembantu rajah tambahan ----------
def AXIS(lo, hi, L, R, y, step=1, lab_step=None, fs_=15, col=MU):
    X = lambda v: L + (v - lo) / (hi - lo) * (R - L)
    s = LINE((L - 12, y), (R + 12, y), col, 3)
    lab_step = lab_step or step
    v = lo
    while v <= hi + 1e-9:
        s += LINE((X(v), y - 6), (X(v), y + 6), col, 2.5)
        if round((v - lo) / lab_step, 6) % 1 == 0:
            s += T(X(v), y + 22, num(F(v)), MU3, fs_, weight=600, halo=False)
        v += step
    return s, X

def BOXP(v5, X, y, col, h=46, lab=True, fs_=15, sw=3.5):
    """Plot kotak: v5 = (min, Q1, median, Q3, maks)."""
    a, b, c, d, e = [float(t) for t in v5]
    s = LINE((X(a), y), (X(b), y), col, sw) + LINE((X(d), y), (X(e), y), col, sw)
    s += LINE((X(a), y - h * .32), (X(a), y + h * .32), col, sw) + LINE((X(e), y - h * .32), (X(e), y + h * .32), col, sw)
    s += f'<rect x="{r1(X(b))}" y="{r1(y - h / 2)}" width="{r1(X(d) - X(b))}" height="{h}" rx="5" fill="{col}33" stroke="{col}" stroke-width="{sw}"/>'
    s += LINE((X(c), y - h / 2), (X(c), y + h / 2), MEDC, sw + .5, cap='butt')
    return s

def CHIPROW(vals, y, cols=None, w=36, gap=6, h=42, fs_=18, cx=250):
    n = len(vals); x0 = cx - (n * (w + gap) - gap) / 2
    s = ''
    for i, v in enumerate(vals):
        col = (cols or {}).get(i, BD)
        x = x0 + i * (w + gap)
        s += RECT(x, y, w, h, SURF if col == BD else f'{col}33', col, 9, 2.5)
        s += T(x + w / 2, y + h / 2 + 1, v, TX, fs_, halo=False)
    return s, (lambda i: x0 + i * (w + gap) + w / 2)

def STEM(rows, x_st, y0, dy=44, fs_=21, cols=None, left=None, x_lf=None):
    """rows = [(batang, [daun...])]; cols = {(batang, j): warna}."""
    s = ''
    for i, (st_, lv) in enumerate(rows):
        y = y0 + i * dy
        s += T(x_st, y, str(st_), TX, fs_, halo=False)
        for j, lf in enumerate(lv):
            s += T((x_lf or x_st + 50) + j * 30, y, str(lf), (cols or {}).get((st_, j), TX), fs_, halo=False)
    return s

def stems(d):
    out = {}
    for v in sorted(d): out.setdefault(v // 10, []).append(v % 10)
    return [(k, out.get(k, [])) for k in range(min(out), max(out) + 1)]

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})
JUL_, JAK_, Q1_, Q3_ = B('Julat', JC), B('Julat antara kuartil', QC), B('Q<sub>1</sub>', QC), B('Q<sub>3</sub>', QC)
VAR_, SD_ = B('Varians', SDC), B('Sisihan piawai', SDC)
XB = '<i>x̄</i>'
SG2 = 'σ<sup>2</sup>'

# ===================== 8.1.1 SERAKAN =====================
col = SUB['8.1.1'][1]

# 1 Definisi
A = [4, 5, 5, 6, 6, 6, 7, 7, 8]; Bd = [1, 2, 4, 5, 6, 7, 8, 10, 11]
assert mean(A) == 6 and mean(Bd) == 6 and julat(A) == 4 and julat(Bd) == 10
fig = T(250, 34, 'Dua set data, min sama = 6', MU3, 18, halo=False)
f1, X = DOTPLOT(A, 0, 12, L=40, R=460, base=190, r=10, gap=23)
f2, _ = DOTPLOT(Bd, 0, 12, L=40, R=460, base=380, r=10, gap=23, cols={v: PA for v in Bd})
fig += f1 + f2
fig += T(40, 92, 'Set A: tertumpu', TR, 18, 'start') + T(40, 290, 'Set B: terserak', PA, 18, 'start')
fig += LINE((X(4), 232), (X(8), 232), TR, 4) + T(X(6), 252, 'julat 4', TR, 16)
fig += LINE((X(1), 422), (X(11), 422), PA, 4) + T(X(6), 444, 'julat 10', PA, 16)
add('8.1.1', 'DEFINISI', 'Apakah serakan?',
    DEF('<b>Serakan</b> ialah sukatan yang menunjukkan sejauh mana nilai-nilai dalam suatu set data <b>tersebar</b> atau <b>tertumpu</b>.', col)
    + BUL(['Serakan <b>kecil</b>: data tertumpu berhampiran antara satu sama lain.',
           'Serakan <b>besar</b>: data tersebar luas.',
           'Serakan dapat dilihat daripada <b>plot titik</b> dan <b>plot batang-dan-daun</b>.'], col)
    + NOTE('Set A dan Set B mempunyai min yang sama, tetapi serakannya berbeza.'),
    svg(fig, 'Dua plot titik: Set A tertumpu dengan julat 4, Set B terserak dengan julat 10'))

# 2 Plot titik
G = [2, 0, 1, 3, 2, 1, 2, 4, 1, 2, 3, 6]
assert len(G) == 12 and min(G) == 0 and max(G) == 6 and G.count(2) == 4
fig, X = DOTPLOT(G, 0, 6, L=60, R=440, base=330, r=13, gap=31)
fig += T(250, 40, 'Bilangan gol dalam 12 perlawanan', MU3, 18, halo=False)
fig += RECT(X(1) - 26, 190, X(3) - X(1) + 52, 158, 'none', TR, 14, 2.5) + T(X(2), 172, 'tertumpu 1 – 3', TR, 17)
fig += ARROW((X(6), 250), (X(6), 302), PA, 3.5) + T(X(6), 234, 'jauh', PA, 17)
fig += LINE((X(0), 400), (X(6), 400), JC, 4) + T(250, 428, 'nilai terkecil 0 · nilai terbesar 6', JC, 17)
add('8.1.1', 'PLOT TITIK', 'Membina plot titik',
    P(f'Bilangan gol dalam 12 perlawanan: {nl(G)}', True)
    + STEPS(['Lukis garis nombor daripada nilai terkecil (0) hingga nilai terbesar (6).',
             'Tandakan satu ● di atas nilai bagi setiap data.',
             'Perhatikan taburan: kebanyakan data tertumpu antara 1 dan 3.'], col)
    + NOTE('Nilai 6 jauh daripada data lain. Nilai sebegini dipanggil <b>pencilan</b>.'),
    svg(fig, 'Plot titik bilangan gol dengan data tertumpu antara 1 hingga 3 dan satu nilai 6'))

# 3 Plot batang-dan-daun
M3 = [63, 45, 70, 52, 88, 61, 75, 58, 63, 81, 67, 72]
assert julat(M3) == 43 and len(M3) == 12
rows = stems(M3)
assert rows == [(4, [5]), (5, [2, 8]), (6, [1, 3, 3, 7]), (7, [0, 2, 5]), (8, [1, 8])]
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Markah ujian 12 orang murid', MU3, 18, halo=False)
fig += T(150, 92, 'Batang', MU, 17, halo=False) + T(300, 92, 'Daun', MU, 17, halo=False)
fig += LINE((200, 110), (200, 110 + 5 * 50), MU, 3) + LINE((100, 110), (440, 110), BD, 2)
fig += STEM(rows, 150, 136, 50, 22, {(4, 0): JC, (8, 1): JC}, x_lf=232)
fig += T(250, 412, 'Kekunci: 4 | 5 bermaksud 45 markah', MU3, 17, halo=False)
add('8.1.1', 'PLOT BATANG-DAN-DAUN', 'Membina plot batang-dan-daun',
    P(f'Markah: {nl(M3)}', True)
    + STEPS(['<b>Batang</b> = digit puluh (4 hingga 8). <b>Daun</b> = digit sa.',
             'Tulis daun bagi setiap data di sebelah batangnya, disusun menaik.',
             'Tulis <b>kekunci</b>, contohnya 4 | 5 bermaksud 45.'], col)
    + ANS(f'Nilai terkecil 45, nilai terbesar 88, maka {JUL_} = 88 − 45 = 43'),
    svg(fig, 'Plot batang-dan-daun markah 45 hingga 88'))

# 4 Membanding dua plot titik
Pd = [5, 6, 6, 7, 7, 7, 7, 8, 8, 9]; Qd = [2, 3, 5, 6, 7, 7, 8, 10, 11, 11]
assert mean(Pd) == 7 and mean(Qd) == 7 and julat(Pd) == 4 and julat(Qd) == 9
fig = T(250, 30, 'Masa ke sekolah (minit)', MU3, 18, halo=False)
f1, X = DOTPLOT(Pd, 0, 12, L=40, R=460, base=200, r=10, gap=23)
f2, _ = DOTPLOT(Qd, 0, 12, L=40, R=460, base=390, r=10, gap=23, cols={v: PA for v in Qd})
fig += f1 + f2 + T(40, 70, 'Kelas P', TR, 19, 'start') + T(40, 272, 'Kelas Q', PA, 19, 'start')
fig += T(460, 70, 'julat = 9 − 5 = 4', TR, 17, 'end') + T(460, 272, 'julat = 11 − 2 = 9', PA, 17, 'end')
add('8.1.1', 'MEMBANDING', 'Membanding serakan dua set data',
    P('Plot titik menunjukkan masa ke sekolah bagi 10 orang murid Kelas P dan 10 orang murid Kelas Q.', True)
    + STEPS(['Kedua-dua kelas mempunyai min yang sama, iaitu 7 minit.',
             'Julat Kelas P = 4, julat Kelas Q = 9.',
             'Data Kelas P lebih tertumpu di sekitar 7 minit.'], col)
    + ANS('Masa Kelas Q lebih <b>terserak</b> berbanding Kelas P.'),
    svg(fig, 'Dua plot titik: Kelas P julat 4 dan Kelas Q julat 9'))

# 5 Plot batang-dan-daun berganda
PA_ = [52, 55, 61, 63, 64, 66, 68, 70, 72]; PB_ = [38, 45, 49, 57, 62, 66, 74, 81, 89]
assert julat(PA_) == 20 and julat(PB_) == 51
fig = RECT(14, 14, 472, 442) + T(250, 42, 'Skor dua pasukan', MU3, 18, halo=False)
fig += T(120, 84, 'Daun (A)', TR, 17) + T(250, 84, 'Batang', MU, 17, halo=False) + T(380, 84, 'Daun (B)', PA, 17)
fig += LINE((215, 102), (215, 102 + 6 * 44), MU, 3) + LINE((285, 102), (285, 102 + 6 * 44), MU, 3)
ra, rb = dict(stems(PA_)), dict(stems(PB_))
for i, st_ in enumerate(range(3, 9)):
    y = 126 + i * 44
    fig += T(250, y, str(st_), TX, 21, halo=False)
    for j, lf in enumerate(reversed(ra.get(st_, []))): fig += T(190 - j * 28, y, str(lf), TR, 21, halo=False)
    for j, lf in enumerate(rb.get(st_, [])): fig += T(310 + j * 28, y, str(lf), PA, 21, halo=False)
fig += T(250, 400, 'Kekunci: 2 | 5 | bermaksud 52 (A)', MU3, 16, halo=False)
fig += T(250, 428, '| 3 | 8 bermaksud 38 (B)', MU3, 16, halo=False)
add('8.1.1', 'MEMBANDING', 'Plot batang-dan-daun berganda',
    P('Skor 9 orang ahli Pasukan A (daun kiri) dan Pasukan B (daun kanan) dipaparkan berkongsi batang yang sama.', True)
    + STEPS(['Julat A = 72 − 52 = 20.', 'Julat B = 89 − 38 = 51.',
             'Skor A tertumpu pada batang 5 hingga 7; skor B tersebar dari 38 hingga 89.'], col)
    + ANS('Skor Pasukan A kurang terserak, maka lebih <b>konsisten</b>.')
    + NOTE('Daun di sebelah kiri dibaca dari kanan ke kiri, bermula di sebelah batang.'),
    svg(fig, 'Plot batang-dan-daun berganda skor Pasukan A dan Pasukan B'))

# 6 Kesilapan biasa
fig = ''
CASES = [(52, 'Kekunci tidak ditulis', False), (122, 'Kekunci: 4 | 5 bermaksud 45', True),
         (212, 'Min sama → serakan sama', False), (282, 'Min sama, julat boleh berbeza', True),
         (372, 'Daun tidak disusun: 6 | 7 1 3', False), (442, 'Susun daun menaik: 6 | 1 3 7', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 18, 'start')
add('8.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lupa menulis kekunci", RD)} ✗ → pembaca tidak tahu nilai sebenar data.',
         f'{B("Menganggap min yang sama bermakna serakan sama", RD)} ✗ → bandingkan julat atau taburan.',
         f'{B("Daun tidak disusun", RD)} ✗ → susun daun mengikut tertib menaik.',
         f'{B("Skala garis nombor tidak seragam", RD)} ✗ → jarak antara nilai mesti sama.'], col),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi plot titik dan plot batang-dan-daun'))

# 7 Ringkasan
fig = ''
RS = [('Serakan', TR, 'sejauh mana data tersebar', 'kecil = tertumpu'),
      ('Plot titik', PA, '● di atas garis nombor', 'nampak tumpuan & pencilan'),
      ('Batang-dan-daun', PU, 'batang = puluh, daun = sa', 'wajib ada kekunci'),
      ('Membanding', GR, 'julat lebih kecil', '→ lebih konsisten')]
for i, (nm, cl, a_, b_) in enumerate(RS):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, cl, 16, 2)
    fig += T(36, y0 + 32, nm, cl, 21, 'start', halo=False)
    fig += T(36, y0 + 68, a_, TX, 17, 'start', 600, halo=False)
    fig += T(466, y0 + 32, b_, MU, 15, 'end', 600, halo=False)
add('8.1.1', 'RINGKASAN', 'Ringkasan serakan',
    TABLE(['Perkara', 'Maksud'],
          [['Serakan', 'sejauh mana data tersebar'],
           ['Plot titik', 'setiap ● mewakili satu data'],
           ['Plot batang-dan-daun', 'data tersusun; kekunci menerangkan nilai'],
           ['Julat (awal)', 'nilai terbesar − nilai terkecil']], col, rv=True)
    + BUL(['Serakan kecil → data lebih konsisten.'], col),
    svg(fig, 'Ringkasan serakan, plot titik dan plot batang-dan-daun'))

# ===================== 8.2.1 JULAT DAN JULAT ANTARA KUARTIL =====================
col = SUB['8.2.1'][1]

# 1 Julat
Tm = [31, 29, 33, 30, 34, 28, 32]
assert julat(Tm) == 6
fig = T(250, 40, 'Suhu tengah hari 7 hari (°C)', MU3, 18, halo=False)
s_, cx = CHIPROW([num(v) for v in Tm], 80, {5: TR, 4: JC}, w=50, gap=10)
fig += s_
f_, X = DOTPLOT(Tm, 27, 35, L=50, R=450, base=290, r=13, cols={28: TR, 34: JC})
fig += f_
fig += T(X(28), 226, 'terkecil', TR, 16) + T(X(34), 226, 'terbesar', JC, 16)
fig += ARROW((X(28), 340), (X(34), 340), JC, 4) + ARROW((X(34), 340), (X(28), 340), JC, 4)
fig += LEGEND(380, [('Julat', '34 − 28 = 6', JC)], 90, 410)
add('8.2.1', 'DEFINISI', 'Sukatan serakan: julat',
    DEF(f'<b>Sukatan serakan</b> ialah nilai yang mengukur serakan data: {JUL_}, {JAK_}, {VAR_} dan {SD_}.', col)
    + DEF(f'{JUL_} = nilai terbesar − nilai terkecil', JC)
    + P(f'Suhu (°C): {nl(Tm)}', True)
    + ANS(f'{JUL_} = 34 − 28 = <b>6°C</b>'),
    svg(fig, 'Suhu 7 hari dengan nilai terkecil 28 dan terbesar 34, julat 6'))

# 2 Kuartil (n ganjil)
D11 = [12, 5, 17, 9, 3, 14, 8, 20, 6, 15, 11]
s11 = sorted(D11)
assert s11 == [3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 20] and med(D11) == 11 and q1(D11) == 6 and q3(D11) == 15
fig = T(250, 36, 'Data tersusun (n = 11)', MU3, 18, halo=False)
s_, cx = CHIPROW([num(v) for v in s11], 120, {2: QC, 5: MEDC, 8: QC}, w=36, gap=6)
fig += s_
fig += RECT(cx(0) - 22, 102, cx(4) - cx(0) + 44, 78, 'none', MU2, 12, 2) + RECT(cx(6) - 22, 102, cx(10) - cx(0) - (cx(6) - cx(0)) + 44, 78, 'none', MU2, 12, 2)
fig += T((cx(0) + cx(4)) / 2, 82, 'sebelum median', MU, 15, halo=False) + T((cx(6) + cx(10)) / 2, 82, 'selepas median', MU, 15, halo=False)
fig += T(cx(2), 204, 'Q₁ = 6', QC, 19) + T(cx(5), 236, 'median = 11', MEDC, 19) + T(cx(8), 204, 'Q₃ = 15', QC, 19)
fig += RECT(40, 290, 420, 150, SURF, BD, 16)
fig += T(250, 326, 'Kuartil membahagi data tersusun', TX, 18, halo=False)
fig += T(250, 360, 'kepada 4 bahagian yang sama', TX, 18, halo=False)
fig += T(250, 404, '25% | 25% | 25% | 25%', QC, 20, halo=False)
add('8.2.1', 'KUARTIL', 'Kuartil pertama dan ketiga',
    DEF(f'{Q1_} ialah nilai di tengah-tengah bahagian data <b>sebelum</b> median. {Q3_} ialah nilai di tengah-tengah bahagian data <b>selepas</b> median.', col)
    + P(f'Cari Q<sub>1</sub> dan Q<sub>3</sub> bagi: {nl(D11)}', True)
    + STEPS([f'Susun: {nl(s11)}', 'Median = nilai ke-6 = 11.',
             'Sebelum median: 3, 5, <b>6</b>, 8, 9 → Q<sub>1</sub> = 6',
             'Selepas median: 12, 14, <b>15</b>, 17, 20 → Q<sub>3</sub> = 15'], col),
    svg(fig, 'Sebelas data tersusun dengan Q1 = 6, median = 11 dan Q3 = 15'))

# 3 Kuartil (n genap)
D8 = [15, 21, 9, 12, 18, 25, 11, 16]
s8 = sorted(D8)
assert s8 == [9, 11, 12, 15, 16, 18, 21, 25] and med(D8) == F(31, 2) and q1(D8) == F(23, 2) and q3(D8) == F(39, 2) and jak(D8) == 8
fig = T(250, 36, 'Data tersusun (n = 8)', MU3, 18, halo=False)
s_, cx = CHIPROW([num(v) for v in s8], 120, {1: QC, 2: QC, 3: MEDC, 4: MEDC, 5: QC, 6: QC}, w=46, gap=10)
fig += s_
fig += LINE((cx(3) + 28, 96), (cx(3) + 28, 190), MEDC, 3, '6 5')
fig += T(cx(3) + 28, 82, 'median 15.5', MEDC, 16)
fig += T((cx(1) + cx(2)) / 2, 202, 'Q₁', QC, 19) + T((cx(5) + cx(6)) / 2, 202, 'Q₃', QC, 19)
fig += RECT(30, 250, 440, 190, SURF, BD, 16)
fig += T(250, 288, 'Q₁ = (11 + 12) ÷ 2 = 11.5', QC, 19, halo=False)
fig += T(250, 330, 'Q₃ = (18 + 21) ÷ 2 = 19.5', QC, 19, halo=False)
fig += T(250, 384, 'JAK = 19.5 − 11.5 = 8', JC, 21, halo=False)
add('8.2.1', 'CONTOH BERLANGKAH', 'Kuartil bagi bilangan data genap',
    P(f'Cari Q<sub>1</sub>, Q<sub>3</sub> dan julat antara kuartil bagi: {nl(D8)}', True)
    + STEPS([f'Susun: {nl(s8)}. Median = (15 + 16) ÷ 2 = 15.5',
             'Sebelum median: 9, 11, 12, 15 → Q<sub>1</sub> = (11 + 12) ÷ 2 = 11.5',
             'Selepas median: 16, 18, 21, 25 → Q<sub>3</sub> = (18 + 21) ÷ 2 = 19.5',
             'JAK = Q<sub>3</sub> − Q<sub>1</sub> = 19.5 − 11.5 = 8'], col)
    + ANS('Julat antara kuartil = <b>8</b>'),
    svg(fig, 'Lapan data tersusun dengan Q1 = 11.5, Q3 = 19.5 dan julat antara kuartil 8'))

# 4 JAK: maksud
D10 = [4, 7, 8, 10, 12, 13, 15, 18, 19, 22]
assert q1(D10) == 8 and q3(D10) == 18 and jak(D10) == 10 and julat(D10) == 18 and med(D10) == F(25, 2)
fig = T(250, 36, 'Data: 4, 7, 8, 10, 12, 13, 15, 18, 19, 22', MU3, 16, halo=False)
ax, X = AXIS(0, 24, 40, 460, 300, 2, 4)
fig += ax
for v in D10: fig += CIRC((X(v), 282), TR, 7)
fig += f'<rect x="{r1(X(8))}" y="230" width="{r1(X(18) - X(8))}" height="36" rx="8" fill="{QC}33" stroke="{QC}" stroke-width="3"/>'
fig += T((X(8) + X(18)) / 2, 248, '50% data di tengah', TX, 15, halo=False)
fig += T(X(8), 208, 'Q₁ = 8', QC, 17) + T(X(18), 208, 'Q₃ = 18', QC, 17)
fig += ARROW((X(8), 160), (X(18), 160), QC, 3.5) + ARROW((X(18), 160), (X(8), 160), QC, 3.5) + T(X(13), 138, 'JAK = 10', QC, 19)
fig += ARROW((X(4), 372), (X(22), 372), JC, 3.5) + ARROW((X(22), 372), (X(4), 372), JC, 3.5) + T(X(13), 400, 'julat = 18', JC, 19)
add('8.2.1', 'JULAT ANTARA KUARTIL', 'Julat antara kuartil (JAK)',
    DEF(f'{JAK_} = Q<sub>3</sub> − Q<sub>1</sub>', QC)
    + BUL(['JAK mengukur serakan <b>50% data di tengah</b>.',
           'JAK <b>tidak terjejas</b> oleh pencilan kerana nilai terkecil dan terbesar tidak digunakan.',
           'Julat menggunakan nilai terbesar dan terkecil sahaja.'], col)
    + P('Bagi data di sebelah: Q<sub>1</sub> = 8, Q<sub>3</sub> = 18, maka JAK = 10, manakala julat = 22 − 4 = 18.', True),
    svg(fig, 'Garis nombor menunjukkan julat antara kuartil 10 dan julat 18'))

# 5 Dari plot batang-dan-daun
D15 = [21, 24, 27, 30, 32, 33, 35, 38, 41, 42, 44, 47, 50, 53, 58]
assert len(D15) == 15 and med(D15) == 38 and q1(D15) == 30 and q3(D15) == 47 and jak(D15) == 17 and julat(D15) == 37
rows = stems(D15)
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Jisim 15 bungkusan (kg)', MU3, 18, halo=False)
fig += T(150, 92, 'Batang', MU, 17, halo=False) + T(300, 92, 'Daun', MU, 17, halo=False)
fig += LINE((200, 110), (200, 110 + 4 * 56), MU, 3) + LINE((100, 110), (440, 110), BD, 2)
fig += STEM(rows, 150, 140, 56, 23, {(3, 0): QC, (3, 3): MEDC, (4, 3): QC, (2, 0): JC, (5, 2): JC}, x_lf=236)
fig += T(250, 372, 'Q₁ = 30 · median = 38 · Q₃ = 47', TX, 17, halo=False)
fig += T(250, 412, 'Kekunci: 2 | 1 bermaksud 21 kg', MU3, 16, halo=False)
add('8.2.1', 'PLOT BATANG-DAN-DAUN', 'Julat dan JAK daripada plot',
    P('Plot batang-dan-daun menunjukkan jisim 15 bungkusan. Cari julat dan julat antara kuartil.', True)
    + STEPS(['Julat = 58 − 21 = 37 kg',
             'n = 15: median = nilai ke-8 = 38',
             'Q<sub>1</sub> = nilai ke-4 = 30; Q<sub>3</sub> = nilai ke-12 = 47',
             'JAK = 47 − 30 = 17 kg'], col)
    + NOTE('Data dalam plot batang-dan-daun sudah tersusun, jadi kira kedudukan terus.'),
    svg(fig, 'Plot batang-dan-daun 15 data dengan Q1 30, median 38 dan Q3 47'))

# 6 Kesilapan biasa
fig = ''
CASES = [(52, 'Julat 9, 4, 12, 7 = 7 − 9', False), (122, 'Julat = 12 − 4 = 8', True),
         (212, 'JAK = Q₃ + Q₁', False), (282, 'JAK = Q₃ − Q₁', True),
         (372, 'Q₁ tanpa menyusun data', False), (442, 'Susun dahulu, kemudian cari Q₁', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 18, 'start')
add('8.2.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Julat = data terakhir − data pertama", RD)} ✗ → guna nilai <b>terbesar</b> dan <b>terkecil</b>.',
         f'{B("Menambah Q₁ dan Q₃", RD)} ✗ → JAK ialah <b>beza</b> Q<sub>3</sub> − Q<sub>1</sub>.',
         f'{B("Tidak menyusun data", RD)} ✗ → kuartil hanya bermakna bagi data tersusun.',
         f'{B("Memasukkan median ke dalam separuh data", RD)} ✗ apabila n ganjil.'], col),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi julat dan kuartil'))

# ===================== 8.2.2 VARIANS DAN SISIHAN PIAWAI =====================
col = SUB['8.2.2'][1]

# 1 Definisi
DV = [3, 4, 7, 10]
assert mean(DV) == 6 and var(DV) == F(15, 2) and r2(sd(DV)) == '2.74'
fig = T(250, 36, 'Data 3, 4, 7, 10 (min = 6)', MU3, 18, halo=False)
ax, X = AXIS(0, 12, 50, 450, 400, 1, 2)
fig += ax
fig += LINE((X(6), 70), (X(6), 392), MINC, 3.5, '9 6') + T(X(6) + 8, 64, 'x̄ = 6', MINC, 18, 'start')
for i, v in enumerate(DV):
    y = 110 + i * 70
    fig += ARROW((X(6), y), (X(v), y), SDC, 3.5) + CIRC((X(v), y), TR, 11)
    dv = v - 6
    fig += T((X(6) + X(v)) / 2, y - 20, ('+' if dv > 0 else '−') + str(abs(dv)), SDC, 17)
add('8.2.2', 'DEFINISI', 'Varians dan sisihan piawai',
    DEF(f'{VAR_}, {SG2}, ialah purata kuasa dua beza setiap data dengan min: {SG2} = {FR("Σ(<i>x</i> − <i>x̄</i>)²", "<i>N</i>")}', col)
    + DEF(f'{SD_}, σ, ialah punca kuasa dua varians: σ = √{SG2}', col)
    + BUL(['<i>x̄</i> = min, <i>N</i> = bilangan data.',
           'Kuasa dua digunakan supaya beza positif dan negatif tidak saling membatalkan.'], col),
    svg(fig, 'Beza setiap data 3, 4, 7, 10 daripada min 6'))

# 2 Contoh rumus definisi
D2 = [2, 4, 4, 4, 5, 5, 7, 9]
assert mean(D2) == 5 and sum((x - 5) ** 2 for x in D2) == 32 and var(D2) == 4 and sd(D2) == 2
fig = RECT(14, 14, 472, 442)
cw = [150, 150, 150]
fig += T(100, 46, '<tspan font-style="italic">x</tspan>', TR, 19, halo=False) + T(250, 46, 'x − x̄', SDC, 19, halo=False) + T(400, 46, '(x − x̄)²', PU, 19, halo=False)
fig += LINE((30, 66), (470, 66), BD, 2) + LINE((175, 28), (175, 400), BD, 2) + LINE((325, 28), (325, 400), BD, 2)
for i, v in enumerate(D2):
    y = 88 + i * 37
    fig += T(100, y, str(v), TX, 18, halo=False) + T(250, y, ('−' if v < 5 else '') + str(abs(v - 5)), TX, 18, halo=False) + T(400, y, str((v - 5) ** 2), TX, 18, halo=False)
fig += LINE((30, 384), (470, 384), BD, 2)
fig += T(100, 420, 'Σx = 40', TR, 18, halo=False) + T(400, 420, 'Σ = 32', PU, 18, halo=False)
add('8.2.2', 'CONTOH BERLANGKAH', 'Mengira varians dengan jadual',
    P(f'Cari varians dan sisihan piawai bagi: {nl(D2)}', True)
    + STEPS(['Min, <i>x̄</i> = 40 ÷ 8 = 5',
             'Hitung (<i>x</i> − <i>x̄</i>)² bagi setiap data; hasil tambahnya = 32',
             f'{SG2} = 32 ÷ 8 = 4',
             'σ = √4 = 2'], col)
    + ANS(f'Varians = <b>4</b>, sisihan piawai = <b>2</b>'),
    svg(fig, 'Jadual x, x tolak min dan kuasa duanya dengan hasil tambah 32'))

# 3 Rumus alternatif
D3 = [3, 7, 8, 10, 12]
sx, sx2 = sum(D3), sum(x * x for x in D3)
assert sx == 40 and sx2 == 366 and var(D3) == F(46, 5) and F(sx2, 5) - 64 == F(46, 5) and r2(sd(D3)) == '3.03'
fig = RECT(14, 14, 472, 442)
fig += T(250, 50, 'Data: 3, 7, 8, 10, 12', MU3, 19, halo=False)
fig += RECT(40, 84, 420, 70, f'{TR}22', TR, 14, 2.5) + T(250, 119, 'Σx = 40 → x̄ = 40 ÷ 5 = 8', TX, 19, halo=False)
fig += RECT(40, 170, 420, 70, f'{PU}22', PU, 14, 2.5) + T(250, 205, 'Σx² = 9 + 49 + 64 + 100 + 144 = 366', TX, 17, halo=False)
fig += RECT(40, 256, 420, 70, f'{SDC}22', SDC, 14, 2.5) + T(250, 291, 'σ² = 366 ÷ 5 − 8² = 9.2', TX, 19, halo=False)
fig += RECT(40, 342, 420, 70, f'{GR}22', GR, 14, 2.5) + T(250, 377, 'σ = √9.2 = 3.03 (2 t.p.)', TX, 19, halo=False)
add('8.2.2', 'RUMUS', 'Rumus alternatif varians',
    DEF(f'{SG2} = {FR("Σ<i>x</i>²", "<i>N</i>")} − <i>x̄</i>²', col)
    + P('Cari varians dan sisihan piawai bagi data 3, 7, 8, 10, 12.', True)
    + STEPS(['Σ<i>x</i> = 40, <i>x̄</i> = 8', 'Σ<i>x</i>² = 366',
             f'{SG2} = 366 ÷ 5 − 8² = 73.2 − 64 = 9.2', 'σ = √9.2 = 3.03'], col)
    + NOTE('Σ<i>x</i>² ialah hasil tambah kuasa dua setiap data, <b>bukan</b> (Σ<i>x</i>)².'),
    svg(fig, 'Langkah rumus alternatif: varians 9.2 dan sisihan piawai 3.03'))

# 4 Jadual kekerapan
XS, FS = [1, 2, 3, 4, 5], [3, 5, 4, 5, 3]
sf = sum(FS); sfx = sum(x * f for x, f in zip(XS, FS)); sfx2 = sum(x * x * f for x, f in zip(XS, FS))
data4 = [x for x, f in zip(XS, FS) for _ in range(f)]
assert sf == 20 and sfx == 60 and sfx2 == 214 and var(data4) == F(17, 10) and r2(sd(data4)) == '1.3'
fig = RECT(14, 14, 472, 442) + T(250, 44, 'Bilangan adik-beradik 20 orang murid', MU3, 17, halo=False)
heads = ['x', 'f', 'fx', 'fx²']; cxs = [90, 190, 300, 410]
for h_, x_ in zip(heads, cxs): fig += T(x_, 86, h_, [TR, PA, GR, PU][cxs.index(x_)], 19, halo=False)
fig += LINE((30, 106), (470, 106), BD, 2)
for i, (x, f) in enumerate(zip(XS, FS)):
    y = 132 + i * 44
    for v, x_ in zip([x, f, x * f, x * x * f], cxs): fig += T(x_, y, str(v), TX, 19, halo=False)
fig += LINE((30, 350), (470, 350), BD, 2)
fig += T(90, 378, 'Σ', MU, 19, halo=False) + T(190, 378, '20', PA, 19, halo=False) + T(300, 378, '60', GR, 19, halo=False) + T(410, 378, '214', PU, 19, halo=False)
fig += T(250, 426, 'σ² = 214 ÷ 20 − 3² = 1.7', SDC, 19, halo=False)
add('8.2.2', 'JADUAL KEKERAPAN', 'Varians daripada jadual kekerapan',
    DEF(f'{SG2} = {FR("Σ<i>fx</i>²", "Σ<i>f</i>")} − <i>x̄</i>², dengan <i>x̄</i> = {FR("Σ<i>fx</i>", "Σ<i>f</i>")}', col)
    + STEPS(['<i>x̄</i> = 60 ÷ 20 = 3',
             'Σ<i>fx</i>² = 3 + 20 + 36 + 80 + 75 = 214',
             f'{SG2} = 214 ÷ 20 − 3² = 10.7 − 9 = 1.7',
             'σ = √1.7 = 1.30 (2 t.p.)'], col)
    + NOTE('<i>fx</i>² bermaksud <i>f</i> × <i>x</i>², bukan (<i>fx</i>)².'),
    svg(fig, 'Jadual x, f, fx dan fx kuasa dua dengan varians 1.7'))

# 5 Tafsiran
AL, BL = [7, 8, 8, 9, 8], [5, 10, 9, 6, 10]
assert mean(AL) == 8 and mean(BL) == 8 and var(AL) == F(2, 5) and var(BL) == F(22, 5)
assert r2(sd(AL)) == '0.63' and r2(sd(BL)) == '2.1'
fig = T(250, 34, 'Skor 5 tembakan (min sama = 8)', MU3, 18, halo=False)
f1, X = DOTPLOT(AL, 4, 11, L=50, R=450, base=200, r=11, gap=25)
f2, _ = DOTPLOT(BL, 4, 11, L=50, R=450, base=400, r=11, gap=25, cols={v: PA for v in BL})
fig += f1 + f2 + T(40, 80, 'Ali: σ = 0.63', TR, 19, 'start') + T(40, 284, 'Bala: σ = 2.10', PA, 19, 'start')
s1, s2 = sd(AL), sd(BL)
fig += f'<rect x="{r1(X(8 - s1))}" y="120" width="{r1(X(8 + s1) - X(8 - s1))}" height="64" rx="8" fill="{SDC}22" stroke="none"/>'
fig += f'<rect x="{r1(X(8 - s2))}" y="320" width="{r1(X(8 + s2) - X(8 - s2))}" height="64" rx="8" fill="{SDC}22" stroke="none"/>'
fig += LINE((X(8), 110), (X(8), 196), MINC, 3, '6 5') + LINE((X(8), 310), (X(8), 396), MINC, 3, '6 5')
add('8.2.2', 'TAFSIRAN', 'Maksud sisihan piawai',
    BUL(['Sisihan piawai <b>kecil</b>: data tertumpu dekat dengan min.',
         'Sisihan piawai <b>besar</b>: data terserak jauh daripada min.'], col)
    + P('Skor Ali: 7, 8, 8, 9, 8. Skor Bala: 5, 10, 9, 6, 10. Kedua-duanya bermin 8.', True)
    + STEPS(['Ali: σ² = 2 ÷ 5 = 0.4, σ = 0.63', 'Bala: σ² = 22 ÷ 5 = 4.4, σ = 2.10'], col)
    + ANS('Ali lebih <b>konsisten</b> kerana sisihan piawainya lebih kecil.'),
    svg(fig, 'Plot titik skor Ali dan Bala dengan jalur sisihan piawai'))

# 6 Kelebihan & kekurangan
fig = ''
RS = [('Julat', JC, 'mudah dikira', 'guna 2 nilai sahaja'),
      ('Julat antara kuartil', QC, 'tidak terjejas pencilan', 'abaikan 50% data'),
      ('Varians', SDC, 'guna semua data', 'unit kuasa dua'),
      ('Sisihan piawai', PU, 'guna semua data, unit sama', 'terjejas pencilan')]
for i, (nm, cl, a_, b_) in enumerate(RS):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, cl, 16, 2)
    fig += T(36, y0 + 30, nm, cl, 21, 'start', halo=False)
    fig += TICK(48, y0 + 70, GR, 8) + T(66, y0 + 70, a_, TX, 16, 'start', 600, halo=False)
    fig += T(290, y0 + 70, '✗ ' + b_, RD, 15, 'start', 600, halo=False)
add('8.2.2', 'KELEBIHAN & KEKURANGAN', 'Memilih sukatan serakan',
    TABLE(['Sukatan', 'Kelebihan', 'Kekurangan'],
          [['Julat', 'paling mudah dikira', 'hanya guna dua nilai; terjejas pencilan'],
           ['JAK', 'tidak terjejas pencilan', 'tidak guna semua data'],
           ['Varians', 'guna semua data', 'unitnya kuasa dua unit data'],
           ['Sisihan piawai', 'guna semua data; unit sama dengan data', 'terjejas pencilan']], col, rv=True)
    + NOTE('Ada pencilan → pilih JAK. Tiada pencilan → sisihan piawai lebih tepat.'),
    svg(fig, 'Kelebihan dan kekurangan julat, julat antara kuartil, varians dan sisihan piawai'))

# 7 Kesilapan biasa
assert F(366, 5) - 8 != F(46, 5) and 40 ** 2 == 1600
fig = ''
CASES = [(52, 'σ = σ² (lupa punca kuasa dua)', False), (122, 'σ = √σ²', True),
         (212, 'σ² = Σx² ÷ N − x̄', False), (282, 'σ² = Σx² ÷ N − x̄²', True),
         (372, 'Σx² = (Σx)² = 40² = 1600', False), (442, 'Σx² = 3² + 7² + … = 366', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 18, 'start')
add('8.2.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lupa punca kuasa dua", RD)} ✗ → sisihan piawai = √varians.',
         f'{B("Tidak mengkuasaduakan min", RD)} ✗ → tolak <i>x̄</i>², bukan <i>x̄</i>.',
         f'{B("Mengelirukan Σx² dengan (Σx)²", RD)} ✗',
         f'{B("Varians negatif", RD)} ✗ → varians tidak mungkin negatif; semak semula kiraan.'], col),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi varians dan sisihan piawai'))

# ===================== 8.2.3 PLOT KOTAK =====================
col = SUB['8.2.3'][1]

# 1 Definisi
v5 = five(D11)
assert v5 == (3, 6, 11, 15, 20)
fig = T(250, 40, 'Plot kotak bagi 11 data', MU3, 18, halo=False)
ax, X = AXIS(0, 22, 40, 460, 330, 1, 2)
fig += ax + BOXP(v5, X, 220, QC, 70)
for v, t, cl, yy in [(3, 'minimum', TR, 140), (6, 'Q₁', QC, 110), (11, 'median', MEDC, 140), (15, 'Q₃', QC, 110), (20, 'maksimum', JC, 140)]:
    fig += T(X(v), yy, t, cl, 16)
    fig += LINE((X(v), yy + 12), (X(v), 180), cl, 2, '4 4')
fig += T(250, 400, 'Nilai: 3, 6, 11, 15, 20', TX, 18, halo=False)
add('8.2.3', 'DEFINISI', 'Plot kotak',
    DEF('<b>Plot kotak</b> mewakili data menggunakan <b>lima nilai</b>: nilai minimum, Q<sub>1</sub>, median, Q<sub>3</sub> dan nilai maksimum.', col)
    + BUL(['Kotak dilukis dari Q<sub>1</sub> hingga Q<sub>3</sub>; garis di dalam kotak ialah median.',
           'Garis (misai) dilanjutkan dari kotak ke nilai minimum dan nilai maksimum.',
           'Panjang kotak = JAK; panjang keseluruhan = julat.'], col),
    svg(fig, 'Plot kotak dengan minimum 3, Q1 6, median 11, Q3 15 dan maksimum 20'))

# 2 Membina
D12 = [12, 15, 18, 20, 22, 24, 25, 27, 30, 32, 35, 40]
assert five(D12) == (12, 19, F(49, 2), 31, 40)
fig = T(250, 36, 'Masa (minit) 12 orang murid', MU3, 18, halo=False)
s_, cx = CHIPROW([num(v) for v in D12], 72, {2: QC, 3: QC, 5: MEDC, 6: MEDC, 8: QC, 9: QC, 0: TR, 11: JC}, w=34, gap=5, fs_=16)
fig += s_
ax, X = AXIS(10, 40, 40, 460, 360, 2, 4)
fig += ax + BOXP((12, 19, 24.5, 31, 40), X, 260, QC, 70)
fig += T(X(19), 200, '19', QC, 17) + T(X(24.5), 200, '24.5', MEDC, 17) + T(X(31), 200, '31', QC, 17) + T(X(12), 222, '12', TR, 17) + T(X(40), 222, '40', JC, 17)
add('8.2.3', 'CONTOH BERLANGKAH', 'Membina plot kotak',
    P(f'Bina plot kotak bagi data: {nl(D12)}', True)
    + STEPS(['Nilai minimum = 12, nilai maksimum = 40',
             'Median = (24 + 25) ÷ 2 = 24.5',
             'Q<sub>1</sub> = (18 + 20) ÷ 2 = 19; Q<sub>3</sub> = (30 + 32) ÷ 2 = 31',
             'Lukis garis nombor berskala, kotak dari 19 hingga 31, garis median di 24.5, misai ke 12 dan 40.'], col),
    svg(fig, 'Plot kotak masa murid dengan Q1 19, median 24.5 dan Q3 31'))

# 3 Membaca
v5b = (40, 52, 60, 68, 85)
assert v5b[4] - v5b[0] == 45 and v5b[3] - v5b[1] == 16
fig = T(250, 40, 'Markah ujian sekumpulan murid', MU3, 18, halo=False)
ax, X = AXIS(30, 90, 40, 460, 320, 5, 10)
fig += ax + BOXP(v5b, X, 200, QC, 76)
for v, cl in zip(v5b, [TR, QC, MEDC, QC, JC]): fig += LINE((X(v), 250), (X(v), 312), cl, 2, '4 4')
fig += ARROW((X(40), 390), (X(85), 390), JC, 3.5) + ARROW((X(85), 390), (X(40), 390), JC, 3.5) + T(X(62.5), 416, 'julat = 85 − 40 = 45', JC, 17)
fig += ARROW((X(52), 130), (X(68), 130), QC, 3.5) + ARROW((X(68), 130), (X(52), 130), QC, 3.5) + T(X(60), 106, 'JAK = 68 − 52 = 16', QC, 17)
add('8.2.3', 'MEMBACA PLOT KOTAK', 'Membaca nilai daripada plot kotak',
    P('Plot kotak menunjukkan markah ujian sekumpulan murid. Nyatakan median dan hitung julat serta JAK.', True)
    + STEPS(['Baca lima nilai: 40, 52, 60, 68, 85',
             'Median = 60',
             'Julat = 85 − 40 = 45',
             'JAK = 68 − 52 = 16'], col)
    + NOTE('Turunkan garis menegak dari setiap bahagian plot ke garis nombor untuk membaca nilai dengan tepat.'),
    svg(fig, 'Plot kotak markah dengan julat 45 dan julat antara kuartil 16'))

# 4 Tafsiran 25%
fig = T(250, 36, '40 orang murid', MU3, 18, halo=False)
ax, X = AXIS(30, 90, 40, 460, 330, 5, 10)
fig += ax + BOXP(v5b, X, 220, QC, 76)
for a_, b_ in [(40, 52), (52, 60), (60, 68), (68, 85)]:
    fig += T(X((a_ + b_) / 2), 150, '25%', PU, 16)
fig += T(250, 104, 'Setiap bahagian ≈ 10 orang murid', MU3, 16, halo=False)
fig += RECT(30, 380, 440, 70, SURF, BD, 14) + T(250, 404, 'Bahagian Q₁ – median lebih pendek', TX, 15, halo=False) + T(250, 428, '→ data di situ lebih tertumpu', TX, 15, halo=False)
assert 40 // 4 == 10 and 40 * 3 // 4 == 30
add('8.2.3', 'TAFSIRAN', 'Mentafsir plot kotak',
    BUL(['Setiap bahagian plot kotak mengandungi kira-kira <b>25%</b> data.',
         'Kotak (Q<sub>1</sub> hingga Q<sub>3</sub>) mengandungi <b>50%</b> data di tengah.',
         'Bahagian yang <b>lebih panjang</b> bermakna data dalam bahagian itu lebih terserak.'], col)
    + P('Jika 40 orang murid mengambil ujian ini, kira-kira 10 orang mendapat markah melebihi 68, dan 30 orang mendapat 52 markah atau lebih.', True),
    svg(fig, 'Plot kotak dibahagi kepada empat bahagian 25 peratus'))

# 5 Membanding dua plot kotak
KA, KB = (30, 45, 55, 62, 80), (40, 50, 58, 64, 70)
assert KA[4] - KA[0] == 50 and KA[3] - KA[1] == 17 and KB[4] - KB[0] == 30 and KB[3] - KB[1] == 14
fig = T(250, 36, 'Markah dua kelas', MU3, 18, halo=False)
ax, X = AXIS(20, 90, 50, 460, 380, 5, 10)
fig += ax + BOXP(KA, X, 140, TR, 58) + BOXP(KB, X, 270, PA, 58)
fig += T(30, 140, 'A', TR, 22, 'start') + T(30, 270, 'B', PA, 22, 'start')
fig += T(X(55), 92, 'median 55', MEDC, 15) + T(X(58), 222, 'median 58', MEDC, 15)
add('8.2.3', 'MEMBANDING', 'Membanding dua plot kotak',
    P('Plot kotak menunjukkan markah Kelas A dan Kelas B.', True)
    + TABLE(['', 'Kelas A', 'Kelas B'],
            [['Median', '55', '58'], ['Julat', '80 − 30 = 50', '70 − 40 = 30'], ['JAK', '62 − 45 = 17', '64 − 50 = 14']], col)
    + ANS('Kelas B mempunyai median lebih tinggi dan serakan lebih kecil, maka prestasi Kelas B lebih baik dan lebih konsisten.'),
    svg(fig, 'Dua plot kotak: Kelas A lebih terserak, Kelas B median lebih tinggi'))

# 6 Kesilapan biasa
fig = ''
CASES = [(52, 'Median sentiasa di tengah kotak', False), (122, 'Median boleh lebih dekat Q₁ atau Q₃', True),
         (212, 'Misai panjang → lebih banyak data', False), (282, 'Setiap bahagian ≈ 25% data', True),
         (372, 'Garis nombor tanpa skala', False), (442, 'Lukis di atas garis nombor berskala', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 18, 'start')
add('8.2.3', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Menganggap median sentiasa di tengah kotak", RD)} ✗',
         f'{B("Menganggap bahagian panjang ada lebih banyak data", RD)} ✗ → setiap bahagian ada ≈ 25% data; bahagian panjang bermakna lebih terserak.',
         f'{B("Lupa skala", RD)} ✗ → plot kotak mesti dilukis di atas garis nombor berskala seragam.'], col),
    svg(fig, 'Contoh kesilapan dan pembetulan bagi plot kotak'))

# ===================== 8.2.4 KESAN PERUBAHAN DAN PERBANDINGAN =====================
col = SUB['8.2.4'][1]

# 1 Tambah / tolak
DK = [2, 4, 5, 7, 7]
DK2 = [x + 10 for x in DK]
assert julat(DK) == julat(DK2) == 5 and jak(DK) == jak(DK2) == 4 and var(DK) == var(DK2) == F(18, 5)
fig = T(250, 34, 'Setiap nilai + 10', MU3, 18, halo=False)
f1, X = DOTPLOT(DK, 0, 18, L=40, R=460, base=180, r=10, gap=23, step=1, lab_step=2)
f2, _ = DOTPLOT(DK2, 0, 18, L=40, R=460, base=360, r=10, gap=23, cols={v: GR for v in DK2}, step=1, lab_step=2)
fig += f1 + f2 + T(40, 80, 'Asal', TR, 18, 'start') + T(40, 262, 'Baharu', GR, 18, 'start')
fig += ARROW((X(4.5), 222), (X(14.5), 282), MU, 3)
fig += T(250, 430, 'julat = 5, JAK = 4, σ² = 3.6 (kedua-dua set)', TX, 16, halo=False)
add('8.2.4', 'KESAN PERUBAHAN', 'Tambah atau tolak pemalar',
    DEF('Jika setiap nilai <b>ditambah</b> atau <b>ditolak</b> dengan pemalar <i>k</i>, julat, JAK, varians dan sisihan piawai <b>tidak berubah</b>.', col)
    + P('Data 2, 4, 5, 7, 7 menjadi 12, 14, 15, 17, 17 selepas setiap nilai ditambah 10.', True)
    + BUL(['Semua data beralih ke kanan sejauh 10 unit.', 'Jarak antara data kekal, maka serakan sama.'], col)
    + NOTE('Min, median dan kuartil <b>berubah</b> sebanyak <i>k</i>.'),
    svg(fig, 'Plot titik asal dan plot titik selepas setiap nilai ditambah 10'))

# 2 Darab / bahagi
DK3 = [x * 2 for x in DK]
assert julat(DK3) == 10 and jak(DK3) == 8 and var(DK3) == F(72, 5) and var(DK3) == 4 * var(DK)
add('8.2.4', 'KESAN PERUBAHAN', 'Darab atau bahagi dengan pemalar',
    DEF('Jika setiap nilai <b>didarab</b> dengan <i>k</i>: julat, JAK dan sisihan piawai menjadi <i>k</i> kali; varians menjadi <i>k</i>² kali. Jika <b>dibahagi</b> dengan <i>k</i>: julat, JAK dan σ dibahagi <i>k</i>; varians dibahagi <i>k</i>².', col)
    + P('Data 2, 4, 5, 7, 7 didarab 2 menjadi 4, 8, 10, 14, 14.', True)
    + TABLE(['Sukatan', 'Asal', '× 2'],
            [['Julat', '5', '10'], ['JAK', '4', '8'], ['Varians', '3.6', '14.4 = 2² × 3.6'], ['Sisihan piawai', '1.90', '2 × 1.897 = 3.79']], col, rv=True),
    svg(T(250, 34, 'Setiap nilai × 2', MU3, 18, halo=False) + DOTPLOT(DK, 0, 16, L=40, R=460, base=180, r=10, gap=23, lab_step=2)[0]
        + DOTPLOT(DK3, 0, 16, L=40, R=460, base=360, r=10, gap=23, cols={v: GR for v in DK3}, lab_step=2)[0]
        + T(40, 80, 'Asal: julat 5', TR, 18, 'start') + T(40, 262, 'Baharu: julat 10', GR, 18, 'start')
        + T(250, 430, 'Data menjadi lebih terserak', TX, 17, halo=False),
        'Plot titik asal dan selepas setiap nilai didarab 2'))
assert r2(sd(DK)) == '1.9' and r2(sd(DK3)) == '3.79'

# 3 Contoh berlangkah gabungan
assert 8 * 3 == 24 and 5 * 3 == 15 and 3 * 3 == 9 and 9 ** 2 == 81
fig = RECT(14, 14, 472, 442)
fig += T(250, 50, 'Setiap nilai × 3, kemudian − 4', MU3, 18, halo=False)
rowsT = [('Julat', '8', '8 × 3 = 24', JC), ('JAK', '5', '5 × 3 = 15', QC), ('Sisihan piawai', '3', '3 × 3 = 9', SDC), ('Varians', '9', '9 × 3² = 81', PU)]
for i, (nm, a_, b_, cl) in enumerate(rowsT):
    y = 104 + i * 82
    fig += RECT(34, y - 30, 432, 62, SURF, cl, 14, 2)
    fig += T(54, y, nm, cl, 18, 'start') + T(270, y, a_, MU3, 18, halo=False) + T(450, y, b_, TX, 18, 'end', halo=False)
fig += T(250, 434, '− 4 tidak mengubah sukatan serakan', GR, 17, halo=False)
add('8.2.4', 'CONTOH BERLANGKAH', 'Dua perubahan berturut-turut',
    P('Suatu set data mempunyai julat 8, JAK 5 dan sisihan piawai 3. Setiap nilai didarab 3, kemudian ditolak 4. Cari julat, JAK, sisihan piawai dan varians yang baharu.', True)
    + STEPS(['Darab 3: julat, JAK dan σ didarab 3.', 'Tolak 4: tiada kesan pada sukatan serakan.',
             'Julat = 24, JAK = 15, σ = 9', 'Varians = 9² = 81'], col)
    + ANS('Julat 24, JAK 15, sisihan piawai 9, varians 81'),
    svg(fig, 'Jadual kesan darab 3 dan tolak 4 ke atas julat, JAK, sisihan piawai dan varians'))

# 4 Pencilan
DP = [11, 12, 14, 15, 16, 16]; DP2 = DP + [42]
assert julat(DP) == 5 and julat(DP2) == 31 and jak(DP) == 4 and jak(DP2) == 4
assert mean(DP) == 14 and mean(DP2) == 18 and r2(sd(DP)) == '1.91' and r2(sd(DP2)) == '9.96'
fig = T(250, 34, 'Pencilan 42 ditambah', MU3, 18, halo=False)
f1, X = DOTPLOT(DP, 10, 44, L=40, R=460, base=170, r=6, gap=14, step=2, lab_step=4)
f2, _ = DOTPLOT(DP2, 10, 44, L=40, R=460, base=340, r=6, gap=14, cols={42: RD}, step=2, lab_step=4)
fig += f1 + f2 + T(40, 90, 'Sebelum', TR, 18, 'start') + T(40, 256, 'Selepas', PA, 18, 'start')
fig += T(X(42), 280, 'pencilan', RD, 16)
fig += LEGEND(400, [('julat', '5 → 31', JC), ('JAK', '4 → 4', QC), ('σ', '1.91 → 9.96', SDC)], 14, 486)
add('8.2.4', 'PENCILAN', 'Kesan pencilan',
    DEF('<b>Pencilan</b> ialah nilai yang jauh lebih besar atau jauh lebih kecil daripada nilai-nilai lain dalam set data.', col)
    + P('Data 11, 12, 14, 15, 16, 16 ditambah satu nilai 42.', True)
    + BUL([f'{JUL_} berubah dengan mendadak: 5 → 31.', f'{JAK_} tidak terjejas: 4 → 4.',
           f'{SD_} bertambah dengan banyak: 1.91 → 9.96.'], col)
    + NOTE('Jika ada pencilan, JAK ialah sukatan serakan yang lebih sesuai.'),
    svg(fig, 'Plot titik sebelum dan selepas pencilan 42 ditambah'))

# 5 Membanding dan mentafsir
PAd, PBd = [43, 45, 44, 47, 46], [38, 52, 41, 55, 44]
assert mean(PAd) == 45 and mean(PBd) == 46 and var(PAd) == 2 and var(PBd) == 42 and r2(sd(PAd)) == '1.41' and r2(sd(PBd)) == '6.48'
fig = T(250, 34, 'Skor 5 pusingan dua pemain golf', MU3, 17, halo=False)
f1, X = DOTPLOT(PAd, 36, 56, L=40, R=460, base=180, r=9, step=1, lab_step=4)
f2, _ = DOTPLOT(PBd, 36, 56, L=40, R=460, base=350, r=9, step=1, lab_step=4, cols={v: PA for v in PBd})
fig += f1 + f2 + T(40, 92, 'Pemain A', TR, 18, 'start') + T(40, 262, 'Pemain B', PA, 18, 'start')
fig += T(460, 92, 'x̄ = 45, σ = 1.41', TR, 17, 'end') + T(460, 262, 'x̄ = 46, σ = 6.48', PA, 17, 'end')
fig += RECT(40, 400, 420, 56, SURF, BD, 14) + T(250, 428, 'σ kecil → lebih konsisten', GR, 18, halo=False)
add('8.2.4', 'MEMBANDING', 'Membanding dan mentafsir',
    P('Skor Pemain A: 43, 45, 44, 47, 46. Skor Pemain B: 38, 52, 41, 55, 44. Pemain manakah lebih konsisten?', True)
    + STEPS(['A: <i>x̄</i> = 45, σ² = 10 ÷ 5 = 2, σ = 1.41',
             'B: <i>x̄</i> = 46, σ² = 210 ÷ 5 = 42, σ = 6.48',
             'Min hampir sama, tetapi σ A jauh lebih kecil.'], col)
    + ANS('Pemain A lebih <b>konsisten</b>.')
    + NOTE('Bandingkan min untuk tahap prestasi, dan sisihan piawai untuk kekonsistenan.'),
    svg(fig, 'Plot titik skor Pemain A tertumpu dan Pemain B terserak'))

# 6 Penyelesaian masalah
N6, SX, SX2 = 6, 48, 420
assert F(SX, N6) == 8 and F(SX2, N6) - 64 == 6 and r2(math.sqrt(6)) == '2.45'
assert F(SX2 + 64, 7) - 64 == F(36, 7) and r2(36 / 7) == '5.14' and r2(math.sqrt(36 / 7)) == '2.27'
fig = RECT(14, 14, 472, 442)
fig += T(250, 52, 'N = 6, Σx = 48, Σx² = 420', TX, 20, halo=False)
fig += RECT(40, 86, 420, 150, f'{TR}1A', TR, 16, 2.5) + T(250, 116, '(a) Sebelum', TR, 19)
fig += T(250, 156, 'x̄ = 48 ÷ 6 = 8', TX, 18, halo=False) + T(250, 196, 'σ² = 420 ÷ 6 − 8² = 6', TX, 18, halo=False)
fig += RECT(40, 256, 420, 180, f'{GR}1A', GR, 16, 2.5) + T(250, 286, '(b) Tambah nombor 8', GR, 19)
fig += T(250, 326, 'Σx = 56, Σx² = 484, N = 7', TX, 18, halo=False) + T(250, 366, 'x̄ = 8', TX, 18, halo=False)
fig += T(250, 406, 'σ² = 484 ÷ 7 − 64 = 5.14', TX, 18, halo=False)
add('8.2.4', 'PENYELESAIAN MASALAH', 'Menggunakan Σx dan Σx²',
    P('Bagi 6 nombor, Σ<i>x</i> = 48 dan Σ<i>x</i>² = 420. (a) Cari min dan sisihan piawai. (b) Nombor 8 ditambah ke dalam set itu. Cari varians baharu.', True)
    + STEPS(['(a) <i>x̄</i> = 8; σ² = 70 − 64 = 6; σ = √6 = 2.45',
             '(b) Σ<i>x</i> = 48 + 8 = 56; Σ<i>x</i>² = 420 + 8² = 484',
             '<i>x̄</i> = 56 ÷ 7 = 8; σ² = 484 ÷ 7 − 8² = 5.14'], col)
    + NOTE('Menambah nilai yang <b>sama dengan min</b> mengurangkan varians kerana data lebih tertumpu.'),
    svg(fig, 'Langkah mengira varians sebelum dan selepas nombor 8 ditambah'))

# 7 Ringkasan bab
fig = ''
RS = [('+ k atau − k', GR, 'julat, JAK, σ, σ² kekal', 'data beralih sahaja'),
      ('× k atau ÷ k', PA, 'julat, JAK, σ: × k atau ÷ k', 'varians: × k² atau ÷ k²'),
      ('Pencilan', RD, 'julat & σ berubah banyak', 'JAK hampir tidak berubah'),
      ('Membanding', TR, 'σ kecil = lebih konsisten', 'min = tahap prestasi')]
for i, (nm, cl, a_, b_) in enumerate(RS):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, cl, 16, 2)
    fig += T(36, y0 + 32, nm, cl, 21, 'start', halo=False)
    fig += T(36, y0 + 68, a_, TX, 17, 'start', 600, halo=False)
    fig += T(466, y0 + 32, b_, MU, 15, 'end', 600, halo=False)
add('8.2.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Sukatan', 'Rumus'],
          [['Julat', 'nilai terbesar − nilai terkecil'],
           ['JAK', 'Q<sub>3</sub> − Q<sub>1</sub>'],
           ['Varians', f'{FR("Σ(<i>x</i> − <i>x̄</i>)²", "<i>N</i>")} = {FR("Σ<i>x</i>²", "<i>N</i>")} − <i>x̄</i>²'],
           ['Sisihan piawai', 'σ = √varians']], col, rv=True),
    svg(fig, 'Ringkasan kesan perubahan seragam, pencilan dan perbandingan'))

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
assert counts == {'8.1.1': 7, '8.2.1': 6, '8.2.2': 7, '8.2.3': 6, '8.2.4': 7}, counts

js = ('/* Dijana oleh tools/serakan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
