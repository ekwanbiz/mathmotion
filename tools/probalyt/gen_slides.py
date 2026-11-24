# Penjana slaid NOTA PROBALYT (Tingkatan 2 Bab 13 Kebarangkalian Mudah) -> probalyt/slides.js
# Jalankan:  python3 tools/probalyt/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'probalyt', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '13.1': ('Eksperimen Kebarangkalian', '#818CF8'),
    '13.2': ('Kebarangkalian Teori', '#34D399'),
    '13.3': ('Peristiwa Pelengkap', '#F472B6'),
    '13.4': ('Kebarangkalian Mudah', '#FBBF24'),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- semakan matematik ----------
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
def SETL(xs):
    return '{' + ', '.join(str(x) for x in xs) + '}'
PFORM = FR('<i>n</i>(A)', '<i>n</i>(S)')
PEKS = FR('kekerapan peristiwa', 'bilangan cubaan')

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
def SFR(x, y, a, b, col=TX, size=20, pre=''):
    w = max(len(str(a)), len(str(b))) * size * 0.62 + 8
    s = ''
    if pre:
        s += T(x - w / 2 - 6, y, pre, col, size, 'end')
    s += T(x, y - size * 0.62, a, col, size) + T(x, y + size * 0.68, b, col, size)
    s += LINE((x - w / 2, y), (x + w / 2, y), col, 2.5)
    return s
def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'
def CIRC(c, r, fill='none', stroke=TX, sw=3, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(c[0])}" cy="{r1(c[1])}" r="{r1(r)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
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
def CHECKS(rows, x=20, w=460, h=50):
    """Kotak kenyataan betul/salah: rows = [(y, teks, ok, nota)]."""
    s = ''
    for y, t, ok, why in rows:
        s += RECT(x, y - h / 2, w, h, SURF, GR if ok else RD, 12, 2)
        s += (TICK(x + 26, y) if ok else CROSS(x + 26, y))
        s += T(x + 52, y, t, GR if ok else RD, 19, 'start')
        if why: s += T(x + w - 14, y, why, MU, 15, 'end', halo=False)
    return s

PIPS = {1: [(.5, .5)], 2: [(.27, .27), (.73, .73)], 3: [(.27, .27), (.5, .5), (.73, .73)],
        4: [(.27, .27), (.73, .27), (.27, .73), (.73, .73)], 5: [(.27, .27), (.73, .27), (.5, .5), (.27, .73), (.73, .73)],
        6: [(.27, .25), (.73, .25), (.27, .5), (.73, .5), (.27, .75), (.73, .75)]}
def DIE(cx, cy, s, f, hl=None):
    st = hl or MU3
    g = RECT(cx - s / 2, cy - s / 2, s, s, SURF if not hl else f'{hl}22', st, s * 0.18, 4 if hl else 3)
    for x, y in PIPS[f]:
        g += CIRC((cx - s / 2 + x * s, cy - s / 2 + y * s), s * 0.085, TX, 'none', 0)
    return g
def COIN(cx, cy, r, lab, col=AM):
    return CIRC((cx, cy), r, f'{col}33', col, 4) + CIRC((cx, cy), r - 8, 'none', col, 2, '4 4') + T(cx, cy + 1, lab, col, r * 0.8)
def CARD(x, y, w, h, t, hl=None):
    return RECT(x, y, w, h, f'{hl}22' if hl else SURF, hl or MU2, 10, 3 if hl else 2) + T(x + w / 2, y + h / 2 + 1, t, hl or TX, 24)
def MARBLE(cx, cy, r, col):
    return (CIRC((cx, cy), r, col, NAV, 2.5)
            + f'<circle cx="{r1(cx - r * 0.32)}" cy="{r1(cy - r * 0.32)}" r="{r1(r * 0.28)}" fill="{TX}" opacity="0.45"/>')
def BAG(cx, top, bw, bh, marbles, r=15, cols=5):
    """Beg guli: marbles = senarai warna."""
    by = top + bh
    g = (f'<path d="M{r1(cx - bw * .42)} {r1(top + bh * .16)} C{r1(cx - bw * .62)} {r1(top + bh * .55)},{r1(cx - bw * .5)} {r1(by)},{r1(cx)} {r1(by)} '
         f'C{r1(cx + bw * .5)} {r1(by)},{r1(cx + bw * .62)} {r1(top + bh * .55)},{r1(cx + bw * .42)} {r1(top + bh * .16)} Z" fill="{SURF}" stroke="{MU2}" stroke-width="4"/>')
    g += f'<path d="M{r1(cx - bw * .44)} {r1(top + bh * .16)} Q{r1(cx)} {r1(top + bh * .02)} {r1(cx + bw * .44)} {r1(top + bh * .16)}" fill="none" stroke="{MU3}" stroke-width="5" stroke-linecap="round"/>'
    n = len(marbles); rows = math.ceil(n / cols)
    y0 = top + bh * 0.58 - (rows - 1) * r * 1.15
    for i, c in enumerate(marbles):
        row, col_ = divmod(i, cols)
        inrow = min(cols, n - row * cols)
        g += MARBLE(cx + (col_ - (inrow - 1) / 2) * r * 2.3, y0 + row * r * 2.3, r, c)
    return g
def VENN(box, circ, r, inside, outside, shade_out=False, shade_in=True, cin=PU, cout=PK, lab='A', size=22):
    """Gambar rajah Venn: kotak S (x,y,w,h), bulatan A (pusat, r). inside/outside = [(x,y,teks)]."""
    x, y, w, h = box
    g = RECT(x, y, w, h, f'{cout}1F' if shade_out else SURF, MU3, 14, 3)
    g += T(x + 22, y + 24, 'S', TX, 22, italic=True)
    g += CIRC(circ, r, f'{cin}2E' if shade_in else SURF, cin, 4)
    if shade_out and not shade_in:
        g += CIRC(circ, r, NAV, cin, 4)
    g += T(circ[0] - r * 0.71 - 16, circ[1] - r * 0.71 - 16, lab, cin, 24, italic=True)
    for px, py, t in inside: g += T(px, py, t, TX, size)
    for px, py, t in outside: g += T(px, py, t, TX, size)
    return g

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 13.1 EKSPERIMEN KEBARANGKALIAN =====================
col = SUB['13.1'][1]

# 13.1-1 Istilah
fig = RECT(14, 14, 472, 200)
fig += T(250, 44, 'Melambung syiling', TX, 20)
fig += COIN(170, 120, 44, 'K', AM) + COIN(330, 120, 44, 'E', TR)
fig += T(170, 186, 'Kepala', AM, 17) + T(330, 186, 'Ekor', TR, 17)
fig += RECT(14, 228, 472, 228)
fig += T(250, 258, 'Melambung dadu', TX, 20)
for i in range(6):
    fig += DIE(68 + i * 73, 322, 56, i + 1)
fig += T(250, 384, 'S = {1, 2, 3, 4, 5, 6}', PU, 21)
fig += T(250, 422, '6 kesudahan yang mungkin', MU, 17, halo=False)
add('13.1', 'DEFINISI', 'Eksperimen, kesudahan dan ruang sampel',
    BUL([f'{B("Eksperimen", PU)}: proses yang menghasilkan kesudahan, contohnya melambung syiling.',
         f'{B("Kesudahan", PU)}: hasil yang mungkin diperoleh daripada eksperimen.',
         f'{B("Ruang sampel, S", PU)}: set <b>semua</b> kesudahan yang mungkin.',
         f'{B("Peristiwa", PU)}: satu atau beberapa kesudahan yang dipilih daripada S.'], col)
    + NOTE('Melambung syiling: S = {Kepala, Ekor}. Melambung dadu: S = {1, 2, 3, 4, 5, 6}.', 'Contoh:'),
    svg(fig, 'Syiling dengan kesudahan kepala dan ekor, dan dadu dengan enam kesudahan'))

# 13.1-2 Kebarangkalian eksperimen (konsep + jadual kekerapan)
FREQ = [9, 11, 8, 12, 10, 10]
assert sum(FREQ) == 60
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'Dadu dilambung 60 kali', TX, 20)
bx0, by0, bw, bh = 70, 390, 62, 26  # tapak carta
ymax = 14
for v in range(0, ymax + 1, 2):
    yy = by0 - v * 300 / ymax
    fig += LINE((56, yy), (460, yy), GRID, 1.5, cap='butt') + T(46, yy, str(v), MU2, 14, 'end', 600)
for i, fq in enumerate(FREQ):
    x = bx0 + i * 66
    hh = fq * 300 / ymax
    cl = PU if i == 3 else DIM
    fig += RECT(x, by0 - hh, 46, hh, cl, 'none', 6, 0)
    fig += T(x + 23, by0 - hh - 14, str(fq), PU if i == 3 else MU3, 17)
    fig += T(x + 23, by0 + 20, str(i + 1), TX, 18)
fig += LINE((56, by0), (460, by0), MU, 2.5)
fig += T(250, 436, 'Nombor pada dadu', MU, 16, halo=False)
add('13.1', 'KONSEP', 'Kebarangkalian eksperimen',
    DEF(f'<b>Kebarangkalian eksperimen</b> ialah kebarangkalian yang diperoleh daripada hasil sebenar sesuatu eksperimen.<br>'
        f'Kebarangkalian eksperimen = {PEKS}', col)
    + BUL(['Jalankan eksperimen dan <b>catat kekerapan</b> setiap kesudahan.',
           'Bahagikan kekerapan peristiwa dengan <b>jumlah cubaan</b>.'], col)
    + NOTE('Jumlah semua kekerapan = bilangan cubaan (9 + 11 + 8 + 12 + 10 + 10 = 60).'),
    svg(fig, 'Carta palang kekerapan dadu yang dilambung 60 kali; nombor 4 muncul 12 kali'))

# 13.1-3 Contoh dadu
p4 = F(12, 60); assert p4 == F(1, 5)
fig = RECT(14, 14, 472, 442)
fig += DIE(250, 120, 120, 4, PU)
fig += T(250, 220, 'Nombor 4 muncul 12 kali', PU, 21)
fig += T(250, 254, 'daripada 60 cubaan', MU3, 19)
fig += LINE((60, 290), (440, 290), BD, 2)
fig += SFR(250, 362, '12', '60', TX, 26, 'P(4) =') + T(300, 362, '=', TX, 26) + SFR(340, 362, '1', '5', GR, 26)
fig += T(250, 430, 'kekerapan ÷ bilangan cubaan', MU, 17, halo=False)
add('13.1', 'CONTOH BERLANGKAH', 'Mengira kebarangkalian eksperimen',
    P('Sebiji dadu dilambung 60 kali. Nombor 4 muncul sebanyak 12 kali. Cari kebarangkalian eksperimen mendapat nombor 4.', True)
    + STEPS(['Kekerapan peristiwa (nombor 4) = 12',
             'Bilangan cubaan = 60',
             f'Kebarangkalian eksperimen = {FR(12, 60)} = {FRV(p4)}'], col)
    + ANS(f'{FRV(p4)}')
    + NOTE(f'Bahagi dengan bilangan <b>cubaan</b> (60), bukan dengan bilangan kesudahan dadu (6).'),
    svg(fig, 'Dadu menunjukkan nombor 4; kebarangkalian eksperimen 12 per 60 sama dengan 1 per 5'))

# 13.1-4 Contoh syiling + ramal kekerapan
nK, nT = 28, 50
pK = F(nK, nT); pE = F(nT - nK, nT)
assert pK == F(14, 25) and pE == F(11, 25) and pK + pE == 1
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'Syiling dilambung 50 kali', TX, 20)
for i in range(50):
    r_, c_ = divmod(i, 10)
    lab, cl = ('K', AM) if i < nK else ('E', TR)
    cx, cy = 52 + c_ * 44, 90 + r_ * 46
    fig += CIRC((cx, cy), 18, f'{cl}33', cl, 2.5) + T(cx, cy + 1, lab, cl, 15, halo=False)
fig += T(140, 340, 'Kepala: 28', AM, 21) + T(360, 340, 'Ekor: 22', TR, 21)
fig += SFR(150, 402, '28', '50', AM, 22, 'P(K) =') + SFR(370, 402, '22', '50', TR, 22, 'P(E) =')
add('13.1', 'CONTOH BERLANGKAH', 'Eksperimen melambung syiling',
    P('Ali melambung sekeping syiling sebanyak 50 kali dan mendapat kepala sebanyak 28 kali.', True)
    + STEPS([f'Kebarangkalian eksperimen mendapat kepala = {FR(28, 50)} = {FRV(pK)}',
             f'Kekerapan ekor = 50 − 28 = 22, jadi kebarangkalian mendapat ekor = {FR(22, 50)} = {FRV(pE)}'], col)
    + ANS(f'P(kepala) = {FRV(pK)}, P(ekor) = {FRV(pE)}')
    + NOTE(f'Jumlah kebarangkalian semua kesudahan = 1: {FR(14, 25)} + {FR(11, 25)} = 1.', 'Semak:'),
    svg(fig, 'Keputusan 50 lambungan syiling: 28 kepala dan 22 ekor'))

# 13.1-5 Kesan bilangan cubaan besar
CONV = [(10, 7), (50, 22), (100, 54), (500, 241), (1000, 503)]
vals = [F(k, n) for n, k in CONV]
assert [float(v) for v in vals] == [0.7, 0.44, 0.54, 0.482, 0.503]
assert all(abs(vals[i + 1] - F(1, 2)) < abs(vals[i] - F(1, 2)) for i in range(1, 4))
fig = RECT(14, 14, 472, 442)
gx0, gx1, gy0, gy1 = 80, 460, 380, 110   # kotak graf
Yp = lambda p: gy0 - float(p) * (gy0 - gy1)
for p in [0, 0.25, 0.5, 0.75, 1]:
    fig += LINE((gx0, Yp(p)), (gx1, Yp(p)), GRID, 1.5, cap='butt') + T(gx0 - 10, Yp(p), f'{p:g}', MU2, 14, 'end', 600)
fig += LINE((gx0, Yp(0.5)), (gx1, Yp(0.5)), AM, 3, '9 7')
fig += LINE((150, 76), (190, 76), AM, 3, '9 7') + T(198, 76, 'teori = 0.5', AM, 16, 'start') + LINE((300, 76), (340, 76), PU, 4) + DOT((320, 76), PU, 6) + T(348, 76, 'eksperimen', PU, 16, 'start')
pts = []
for i, (n, k) in enumerate(CONV):
    x = gx0 + 30 + i * 80
    pts.append((x, Yp(F(k, n))))
    fig += T(x, gy0 + 20, str(n), TX, 16)
fig += f'<polyline points="{" ".join(f"{r1(x)},{r1(y)}" for x, y in pts)}" fill="none" stroke="{PU}" stroke-width="4" stroke-linejoin="round"/>'
for (x, y), v in zip(pts, vals):
    fig += DOT((x, y), PU, 7) + T(x, y + (-20 if float(v) >= 0.5 else 22), f'{float(v):g}', PU, 15)
fig += LINE((gx0, gy0), (gx1, gy0), MU, 2.5)
fig += T(270, gy0 + 48, 'Bilangan cubaan', MU, 16, halo=False)
fig += T(250, 44, 'P(kepala) eksperimen', TX, 19)
add('13.1', 'KONSEP', 'Kesan bilangan cubaan yang besar',
    BUL([f'Apabila bilangan cubaan <b>bertambah</b>, kebarangkalian eksperimen semakin <b>menghampiri</b> kebarangkalian teori ({FR(1, 2)} = 0.5 bagi kepala).'], col)
    + TABLE(['Cubaan', 'Kepala', 'Kebarangkalian eksperimen'],
            [[str(n), str(k), f'{float(F(k, n)):g}'] for n, k in CONV], col, rv=True)
    + NOTE('Dengan cubaan yang sedikit, nilai eksperimen boleh jauh berbeza daripada nilai teori.'),
    svg(fig, 'Graf kebarangkalian eksperimen mendapat kepala menghampiri 0.5 apabila bilangan cubaan bertambah'))

# 13.1-6 Kesilapan biasa
assert F(12, 6) == 2 and F(60, 12) == 5
fig = RECT(14, 14, 472, 130)
fig += DIE(80, 79, 70, 4, PU)
fig += T(140, 62, 'Dadu dilambung 60 kali,', TX, 18, 'start')
fig += T(140, 96, 'nombor 4 muncul 12 kali.', TX, 18, 'start')
fig += CHECKS([(196, '12 ÷ 60 = 1/5', True, 'betul'),
               (266, '12 ÷ 6 = 2', False, 'bahagi dengan 6'),
               (336, '60 ÷ 12 = 5', False, 'terbalik'),
               (406, 'Jawapan 2 atau 5?', False, 'mesti ≤ 1')], 20, 460, 54)
add('13.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Bahagi dengan bilangan kesudahan", RD)} (6) dan bukan bilangan cubaan (60) ✗',
         f'{B("Terbalikkan pecahan", RD)}: bilangan cubaan ÷ kekerapan ✗',
         f'{B("Jawapan lebih daripada 1", RD)} ✗ → kebarangkalian sentiasa antara 0 dengan 1.',
         f'{B("Kekerapan tidak dijumlahkan", RD)}: pastikan jumlah kekerapan = bilangan cubaan.'], col)
    + NOTE(f'Kebarangkalian eksperimen = {PEKS}', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi kebarangkalian eksperimen'))

# ===================== 13.2 KEBARANGKALIAN TEORI =====================
col = SUB['13.2'][1]

# 13.2-1 Kesudahan sama boleh jadi, S dan A
S6 = set(range(1, 7)); PR6 = {n for n in S6 if n > 1 and all(n % k for k in range(2, n))}
assert PR6 == {2, 3, 5}
fig = VENN((24, 24, 452, 300), (190, 176), 106,
           [(150, 150, '2'), (230, 150, '3'), (190, 220, '5')],
           [(380, 100, '1'), (400, 190, '4'), (360, 270, '6')], cin=GR, size=26)
fig += RECT(24, 344, 452, 110)
fig += T(250, 378, 'S = {1, 2, 3, 4, 5, 6} · n(S) = 6', TX, 19)
fig += T(250, 420, 'A = {2, 3, 5} · n(A) = 3', GR, 19)
add('13.2', 'DEFINISI', 'Ruang sampel dan peristiwa',
    DEF('Jika setiap kesudahan mempunyai peluang yang sama untuk berlaku, kesudahan itu <b>sama boleh jadi</b>. Contoh: dadu yang adil.', col)
    + BUL([f'Ruang sampel, {B("S", TX)}: set semua kesudahan. <i>n</i>(S) = bilangan unsur S.',
           f'Peristiwa {B("A", GR)} ialah <b>subset</b> bagi S, iaitu A ⊂ S. <i>n</i>(A) = bilangan unsur A.'], col)
    + P('Dadu dilambung. A ialah peristiwa mendapat <b>nombor perdana</b>: A = {2, 3, 5}.', True),
    svg(fig, 'Gambar rajah Venn: ruang sampel dadu dengan peristiwa A nombor perdana 2, 3, 5'))

# 13.2-2 Rumus P(A) = n(A)/n(S)
pA = F(len(PR6), len(S6)); assert pA == F(1, 2)
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'A = nombor perdana', GR, 20)
for i in range(6):
    r_, c_ = divmod(i, 3)
    f = i + 1
    fig += DIE(130 + c_ * 120, 120 + r_ * 116, 88, f, GR if f in PR6 else None)
fig += T(250, 304, 'n(A) = 3 · n(S) = 6', TX, 20)
fig += SFR(250, 382, '3', '6', TX, 28, 'P(A) =') + T(292, 382, '=', TX, 28) + SFR(330, 382, '1', '2', GR, 28)
add('13.2', 'RUMUS', 'Kebarangkalian teori',
    DEF(f'Bagi kesudahan yang sama boleh jadi:<br>P(A) = {PFORM}', col)
    + P('Sebiji dadu adil dilambung. Cari kebarangkalian mendapat nombor perdana.', True)
    + STEPS(['S = {1, 2, 3, 4, 5, 6}, <i>n</i>(S) = 6',
             'A = {2, 3, 5}, <i>n</i>(A) = 3',
             f'P(A) = {FR(3, 6)} = {FRV(pA)}'], col)
    + ANS(f'{FRV(pA)}'),
    svg(fig, 'Enam muka dadu; muka 2, 3 dan 5 diserlahkan sebagai nombor perdana'))

# 13.2-3 Contoh kad
S12 = list(range(1, 13)); M3 = [n for n in S12 if n % 3 == 0]
pM = F(len(M3), len(S12)); assert M3 == [3, 6, 9, 12] and pM == F(1, 3)
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, '12 kad bernombor', TX, 20)
for i, n in enumerate(S12):
    r_, c_ = divmod(i, 4)
    fig += CARD(52 + c_ * 104, 74 + r_ * 96, 84, 80, str(n), GR if n in M3 else None)
fig += T(250, 380, 'A = {3, 6, 9, 12}', GR, 21)
fig += T(250, 420, 'n(A) = 4 · n(S) = 12', TX, 19)
add('13.2', 'CONTOH BERLANGKAH', 'Memilih kad secara rawak',
    P('Sekeping kad dipilih secara rawak daripada 12 keping kad bernombor 1 hingga 12. Cari kebarangkalian kad itu ialah <b>gandaan 3</b>.', True)
    + STEPS(['S = {1, 2, 3, …, 12}, <i>n</i>(S) = 12',
             f'A = {SETL(M3)}, <i>n</i>(A) = 4',
             f'P(A) = {FR(4, 12)} = {FRV(pM)}'], col)
    + ANS(f'{FRV(pM)}')
    + NOTE('<b>Senaraikan</b> unsur peristiwa dahulu supaya tiada unsur yang tertinggal.', 'Tip:'),
    svg(fig, 'Dua belas kad bernombor 1 hingga 12; kad 3, 6, 9 dan 12 diserlahkan'))

# 13.2-4 Julat 0 hingga 1
EXS = [(F(0), 'nombor 7', RD, 0), (F(2, 3), 'nombor > 2', TR, 0), (F(1, 2), 'kepala', AM, 1), (F(1), 'nombor ≤ 6', GR, 1)]
assert F(len([n for n in S6 if n == 7]), 6) == 0 and F(len([n for n in S6 if n > 2]), 6) == F(2, 3) and F(len([n for n in S6 if n <= 6]), 6) == 1
fig = RECT(14, 14, 472, 442)
lx0, lx1, ly = 60, 440, 236
X = lambda p: lx0 + float(p) * (lx1 - lx0)
fig += f'<rect x="{lx0}" y="{ly - 9}" width="{lx1 - lx0}" height="18" rx="9" fill="{DIM}"/>'
fig += f'<rect x="{lx0}" y="{ly - 9}" width="{(lx1 - lx0) / 2}" height="18" rx="9" fill="{RD}" opacity="0.35"/>'
fig += f'<rect x="{(lx0 + lx1) / 2}" y="{ly - 9}" width="{(lx1 - lx0) / 2}" height="18" rx="9" fill="{GR}" opacity="0.35"/>'
for p, t in [(0, '0'), (F(1, 2), '1/2'), (1, '1')]:
    fig += LINE((X(p), ly - 20), (X(p), ly + 20), TX, 3) + T(X(p), ly + 42, t, TX, 20)
fig += T(X(0), ly + 72, 'mustahil', RD, 17) + T(X(F(1, 2)), ly + 72, 'sama boleh jadi', AM, 17) + T(X(1), ly + 72, 'pasti', GR, 17)
fig += T(X(F(1, 4)) - 10, ly + 112, '← kurang mungkin', MU3, 15, halo=False) + T(X(F(3, 4)) + 10, ly + 112, 'lebih mungkin →', MU3, 15, halo=False)
fig += T(250, 44, 'Contoh: dadu dan syiling', TX, 19)
for p, t, cl, row in EXS:
    x = X(p); cy_ = 96 + row * 56
    left = min(max(x - 56, 22), 366)
    fig += LINE((x, ly - 12), (x, cy_ + 18), cl, 2.5, '5 5') + RECT(left, cy_ - 18, 112, 36, SURF, cl, 10, 2) + T(left + 56, cy_ + 1, t, cl, 15)
for p, t, cl, row in EXS:
    fig += DOT((X(p), ly), cl, 8)
fig += T(250, 420, '0 ≤ P(A) ≤ 1', GR, 22)
add('13.2', 'KONSEP', 'Julat nilai kebarangkalian',
    DEF('Bagi sebarang peristiwa A: <b style="white-space: nowrap">0 ≤ P(A) ≤ 1</b>', col)
    + BUL([f'{B("Mustahil", RD)}: P(A) = 0. Contoh: dadu menunjukkan nombor 7, A = {{ }}.',
           f'{B("Pasti", GR)}: P(A) = 1. Contoh: dadu menunjukkan nombor ≤ 6, A = S.',
           f'Semakin hampir P(A) kepada 1, semakin <b>besar peluang</b> A berlaku.'], col)
    + NOTE('Kebarangkalian tidak boleh negatif dan tidak boleh melebihi 1.'),
    svg(fig, 'Garis nombor kebarangkalian dari 0 mustahil hingga 1 pasti dengan contoh peristiwa'))

# 13.2-5 Ramal kekerapan (pemutar 8 sektor)
SECT = [RD, RD, RD, TR, TR, AM, AM, AM]
pR = F(SECT.count(RD), len(SECT)); ram = pR * 80
assert pR == F(3, 8) and ram == 30
fig = RECT(14, 14, 472, 442)
cx, cy, rr = 250, 180, 130
for i, cl in enumerate(SECT):
    a0, a1 = math.radians(-90 + i * 45), math.radians(-90 + (i + 1) * 45)
    p0 = (cx + rr * math.cos(a0), cy + rr * math.sin(a0)); p1 = (cx + rr * math.cos(a1), cy + rr * math.sin(a1))
    fig += f'<path d="M{cx} {cy} L{r1(p0[0])} {r1(p0[1])} A{rr} {rr} 0 0 1 {r1(p1[0])} {r1(p1[1])} Z" fill="{cl}" fill-opacity="0.55" stroke="{NAV}" stroke-width="3"/>'
fig += CIRC((cx, cy), rr, 'none', MU3, 3)
fig += f'<path d="M{cx - 12} {cy} L{cx} {cy - 92} L{cx + 12} {cy} Z" fill="{TX}" stroke="{NAV}" stroke-width="2"/>' + CIRC((cx, cy), 12, TX, NAV, 2)
fig += T(250, 342, '8 sektor sama besar: 3 merah', TX, 18)
fig += SFR(190, 400, '3', '8', RD, 24, 'P(M) =') + T(214, 400, '× 80 = 30 kali', TX, 22, 'start')
add('13.2', 'APLIKASI', 'Meramal kekerapan sesuatu peristiwa',
    DEF('Kekerapan dijangka = P(A) × bilangan cubaan', col)
    + P('Sebuah pemutar dengan 8 sektor sama besar (3 merah, 2 biru, 3 kuning) diputar 80 kali. Ramalkan berapa kali jarum berhenti pada sektor merah.', True)
    + STEPS([f'P(merah) = {FR(3, 8)}',
             f'Kekerapan dijangka = {FR(3, 8)} × 80 = 30'], col)
    + ANS('Kira-kira 30 kali')
    + NOTE('Ini <b>ramalan</b>. Keputusan sebenar mungkin berbeza sedikit.'),
    svg(fig, 'Pemutar lapan sektor sama besar dengan tiga sektor merah'))

# 13.2-6 Kesilapan biasa: huruf berulang
WORD = 'MATEMATIK'
pT = F(WORD.count('T'), len(WORD)); assert len(WORD) == 9 and pT == F(2, 9) and len(set(WORD)) == 6
fig = RECT(14, 14, 472, 172)
fig += T(250, 42, 'Sekeping kad huruf dipilih', TX, 18)
for i, ch in enumerate(WORD):
    fig += CARD(30 + i * 50, 74, 42, 56, ch, GR if ch == 'T' else None)
fig += T(250, 160, 'n(S) = 9 kad, bukan 6 huruf berbeza', MU3, 16, halo=False)
fig += CHECKS([(232, 'P(T) = 2/9', True, 'betul'),
               (300, 'P(T) = 1/6', False, 'kira huruf berbeza'),
               (368, 'P(T) = 1/9', False, 'lupa T kedua'),
               (436, 'P(T) = 9/2', False, 'terbalik')], 20, 460, 54)
add('13.2', 'KESILAPAN BIASA', 'Kira semua unsur ruang sampel',
    P(f'Setiap huruf perkataan {B("MATEMATIK", TX)} ditulis pada sekeping kad. Sekeping kad dipilih secara rawak. Cari P(T).', True)
    + BUL([f'{B("Lupa unsur berulang", RD)}: ada <b>2</b> kad T dan <b>9</b> kad semuanya ✗ 1/6',
           f'{B("Lupa mengira semua unsur S", RD)}: senaraikan S dengan lengkap.',
           f'{B("Terbalikkan rumus", RD)}: P(A) = <i>n</i>(A) ÷ <i>n</i>(S), bukan sebaliknya.'], col)
    + ANS(f'P(T) = {FRV(pT)}'),
    svg(fig, 'Sembilan kad huruf MATEMATIK dengan dua kad T diserlahkan, dan contoh jawapan betul dan salah'))

# ===================== 13.3 PERISTIWA PELENGKAP =====================
col = SUB['13.3'][1]

# 13.3-1 Definisi A'
S10 = list(range(1, 11)); EV = [n for n in S10 if n % 2 == 0]; ODD = [n for n in S10 if n not in EV]
assert ODD == [1, 3, 5, 7, 9]
inside = [(140, 140, '2'), (220, 140, '4'), (120, 210, '6'), (240, 210, '8'), (180, 266, '10')]
outside = [(370, 80, '1'), (420, 150, '3'), (340, 196, '5'), (420, 250, '7'), (350, 300, '9')]
assert sorted(int(t) for _, _, t in inside) == EV and sorted(int(t) for _, _, t in outside) == ODD
fig = VENN((24, 24, 452, 310), (180, 190), 120, inside, outside, shade_out=True, shade_in=False, cin=PU, cout=PK, size=24)
fig += T(450, 312, 'A′', PK, 24, 'end', italic=True)
fig += RECT(24, 352, 452, 104)
fig += T(250, 384, 'A = {2, 4, 6, 8, 10}', PU, 19)
fig += T(250, 424, 'A′ = {1, 3, 5, 7, 9}', PK, 19)
add('13.3', 'DEFINISI', 'Peristiwa pelengkap, A′',
    DEF('<b>Pelengkap</b> bagi peristiwa A, ditulis <b>A′</b>, ialah set semua kesudahan dalam S yang <b>bukan</b> unsur A.', col)
    + P('S = {1, 2, 3, …, 10}. A ialah peristiwa mendapat nombor genap.', True)
    + BUL([f'A = {SETL(EV)}', f'A′ = peristiwa mendapat nombor <b>bukan genap</b> = {SETL(ODD)}'], col)
    + NOTE('Dalam gambar rajah Venn, A′ ialah kawasan <b>di luar</b> bulatan A tetapi di dalam S.'),
    svg(fig, 'Gambar rajah Venn: A nombor genap di dalam bulatan, A pelengkap nombor ganjil di luar bulatan berlorek'))

# 13.3-2 Rumus P(A') = 1 - P(A)
ph = F(3, 10); pnh = 1 - ph; assert pnh == F(7, 10)
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, '10 bahagian sama besar', TX, 19)
for i in range(10):
    cl = TR if i < 3 else PK
    fig += RECT(40 + i * 42.5, 80, 38, 90, f'{cl}55', cl, 8, 2)
fig += T(40 + 3 * 42.5 / 2 + 0, 196, 'hujan', TR, 17) + T(40 + 3 * 42.5 + 7 * 42.5 / 2, 196, 'tidak hujan', PK, 17)
fig += SFR(140, 262, '3', '10', TR, 24, 'P(A) =') + SFR(380, 262, '7', '10', PK, 24, "P(A′) =")
fig += LINE((40, 314), (460, 314), BD, 2)
fig += T(250, 356, 'P(A) + P(A′) = 1', GR, 24)
fig += T(250, 410, 'P(A′) = 1 − P(A)', AM, 24)
add('13.3', 'RUMUS', 'Kebarangkalian peristiwa pelengkap',
    DEF("P(A) + P(A′) = 1, &nbsp;maka&nbsp; <b>P(A′) = 1 − P(A)</b>", col)
    + P(f'Kebarangkalian hujan esok ialah {FR(3, 10)}. Cari kebarangkalian esok tidak hujan.', True)
    + STEPS([f'P(tidak hujan) = 1 − P(hujan)',
             f'= 1 − {FR(3, 10)} = {FRV(pnh)}'], col)
    + ANS(f'{FRV(pnh)}')
    + NOTE('Sesuatu peristiwa sama ada berlaku atau tidak berlaku, jadi jumlah kedua-dua kebarangkalian ialah 1.'),
    svg(fig, 'Sepuluh bahagian: tiga untuk hujan dan tujuh untuk tidak hujan'))

# 13.3-3 Contoh dengan Venn: nombor perdana 1..12
PR12 = [n for n in S12 if n > 1 and all(n % k for k in range(2, n))]
NP12 = [n for n in S12 if n not in PR12]
pP = F(len(PR12), 12); pNP = 1 - pP
assert PR12 == [2, 3, 5, 7, 11] and len(NP12) == 7 and pNP == F(7, 12) == F(len(NP12), 12)
inside = [(130, 140, '2'), (210, 130, '3'), (110, 210, '5'), (200, 210, '7'), (160, 270, '11')]
outside = [(350, 70, '1'), (420, 110, '4'), (340, 150, '6'), (420, 196, '8'), (340, 236, '9'), (420, 280, '10'), (340, 306, '12')]
assert sorted(int(t) for _, _, t in inside) == PR12 and sorted(int(t) for _, _, t in outside) == NP12
fig = VENN((24, 24, 452, 310), (165, 190), 118, inside, outside, shade_out=True, shade_in=False, cin=PU, cout=PK, size=23)
fig += RECT(24, 352, 452, 104)
fig += T(250, 384, 'n(A) = 5 · n(A′) = 7', TX, 19)
fig += T(250, 424, 'P(A′) = 1 − 5/12 = 7/12', PK, 19)
add('13.3', 'CONTOH BERLANGKAH', 'Mencari P(A′)',
    P('Satu nombor dipilih secara rawak daripada S = {1, 2, 3, …, 12}. A ialah peristiwa mendapat nombor perdana. Cari P(A′).', True)
    + STEPS([f'A = {SETL(PR12)}, <i>n</i>(A) = 5, maka P(A) = {FR(5, 12)}',
             f'P(A′) = 1 − {FR(5, 12)} = {FRV(pNP)}',
             f'Semak: A′ = {SETL(NP12)}, <i>n</i>(A′) = 7 → {FR(7, 12)} ✓'], col)
    + ANS(f'P(A′) = {FRV(pNP)}'),
    svg(fig, 'Gambar rajah Venn: nombor perdana hingga 12 dalam A, tujuh nombor lain dalam A pelengkap'))

# 13.3-4 Pelbagai bentuk + masalah kelas
NM, LL = 32, 14
pPr = 1 - F(LL, NM); assert pPr == F(18, 32) == F(9, 16)
assert round(1 - 0.85, 2) == 0.15 and 100 - 35 == 65 and 1 - F(5, 8) == F(3, 8)
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'Kelas 32 murid', TX, 20)
def person(cx, cy, cl):
    return CIRC((cx, cy - 16), 9, cl, 'none', 0) + f'<path d="M{cx - 14} {cy + 14} Q{cx - 14} {cy - 4} {cx} {cy - 4} Q{cx + 14} {cy - 4} {cx + 14} {cy + 14} Z" fill="{cl}"/>'
for i in range(NM):
    r_, c_ = divmod(i, 8)
    fig += person(66 + c_ * 52, 104 + r_ * 62, TR if i < LL else PK)
fig += T(140, 370, 'lelaki: 14', TR, 20) + T(360, 370, 'perempuan: ?', PK, 20)
fig += T(250, 418, 'P(perempuan) = 1 − 14/32 = 9/16', PK, 19)
add('13.3', 'CONTOH BERLANGKAH', 'Pelengkap dalam situasi harian',
    P('Sebuah kelas mempunyai 32 murid dan 14 orang ialah lelaki. Seorang murid dipilih secara rawak. Cari kebarangkalian murid perempuan dipilih.', True)
    + STEPS([f'P(lelaki) = {FR(14, 32)}',
             f'P(perempuan) = 1 − {FR(14, 32)} = {FR(18, 32)} = {FRV(pPr)}'], col)
    + ANS(f'{FRV(pPr)}')
    + TABLE(['P(A)', '0.85', '35%', FR(5, 8)], [['P(A′)', '0.15', '65%', FR(3, 8)]], col, rv=True),
    svg(fig, 'Tiga puluh dua murid: empat belas lelaki dan lapan belas perempuan'))

# 13.3-5 Kesilapan biasa
assert 1 - F(2, 7) == F(5, 7)
fig = RECT(14, 14, 472, 110)
fig += T(250, 50, 'P(A) = 2/7. Cari P(A′).', TX, 20)
fig += T(250, 90, 'A′ = peristiwa A tidak berlaku', MU3, 17, halo=False)
fig += CHECKS([(180, 'P(A′) = 1 − 2/7 = 5/7', True, 'betul'),
               (250, 'P(A′) = 2/7 − 1 = −5/7', False, 'negatif'),
               (320, 'P(A′) = 1 − 2/7 = 1/7', False, 'tolak pengangka'),
               (390, 'P(A′) = 7/2', False, 'pelengkap ≠ terbalik')], 20, 460, 54)
add('13.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Menolak terbalik", RD)}: P(A) − 1 memberi nilai negatif ✗',
         f'{B("Salah menolak pecahan", RD)}: 1 = {FR(7, 7)}, jadi 1 − {FR(2, 7)} = {FR(5, 7)}.',
         f'{B("Menyangka pelengkap = pecahan terbalik", RD)} ✗',
         f'{B("Lupa unsur di luar A", RD)}: A′ ialah <b>semua</b> unsur S yang tiada dalam A.'], col)
    + NOTE('Semak: P(A) + P(A′) mesti sama dengan 1.', 'Ringkasan:'),
    svg(fig, 'Contoh jawapan betul dan salah bagi kebarangkalian peristiwa pelengkap'))

# ===================== 13.4 KEBARANGKALIAN MUDAH =====================
col = SUB['13.4'][1]

# 13.4-1 Strategi + contoh beg guli
MB = [RD] * 5 + [TR] * 3 + [AM] * 4
pB = F(MB.count(TR), len(MB)); pNK = 1 - F(MB.count(AM), len(MB))
assert len(MB) == 12 and pB == F(1, 4) and pNK == F(2, 3)
fig = RECT(14, 14, 472, 442)
fig += BAG(250, 40, 330, 270, MB, 20, 4)
fig += T(140, 346, '5 merah', RD, 19) + T(250, 346, '3 biru', TR, 19) + T(360, 346, '4 kuning', AM, 19)
fig += T(250, 384, 'n(S) = 5 + 3 + 4 = 12', TX, 19)
fig += T(250, 424, 'P(biru) = 3/12 = 1/4', TR, 19)
add('13.4', 'PENYELESAIAN MASALAH', 'Langkah menyelesaikan masalah',
    BUL(['Kenal pasti ruang sampel S dan cari <i>n</i>(S).',
         'Kenal pasti peristiwa A dan cari <i>n</i>(A).',
         f'Gunakan P(A) = {PFORM} atau P(A′) = 1 − P(A).'], col)
    + P('Sebuah beg mengandungi 5 guli merah, 3 guli biru dan 4 guli kuning. Sebiji guli dipilih secara rawak.', True)
    + STEPS([f'P(biru) = {FR(3, 12)} = {FRV(pB)}',
             f'P(bukan kuning) = 1 − {FR(4, 12)} = {FR(8, 12)} = {FRV(pNK)}'], col),
    svg(fig, 'Beg mengandungi 5 guli merah, 3 guli biru dan 4 guli kuning'))

# 13.4-2 Cabutan bertuah
TIK, BEL = 200, 8
pW = F(BEL, TIK); pL = 1 - pW; assert pW == F(1, 25) and pL == F(24, 25)
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'Cabutan bertuah: 200 tiket', TX, 20)
# kotak cabutan
fig += RECT(120, 150, 260, 150, SURF, MU3, 16, 3) + RECT(200, 140, 100, 18, DIM, MU3, 6, 2)
fig += T(250, 250, '?', MU2, 64, halo=False)
def ticket(x, y, cl, rot):
    return f'<g transform="rotate({rot} {x} {y})">' + RECT(x - 38, y - 16, 76, 32, f'{cl}33', cl, 6, 2.5) + LINE((x - 20, y - 14), (x - 20, y + 14), cl, 2, '3 3') + T(x + 8, y + 1, 'No.', cl, 13, halo=False) + '</g>'
for i, (x, y, rt) in enumerate([(90, 100, -14), (170, 84, 8), (330, 84, -6), (410, 100, 12)]):
    fig += ticket(x, y, PU, rt)
for i in range(8):
    fig += ticket(76 + (i % 4) * 116, 336 + (i // 4) * 44, AM, 0)
fig += T(250, 434, '8 tiket milik Aminah', AM, 18)
add('13.4', 'CONTOH BERLANGKAH', 'Cabutan bertuah',
    P('Sebanyak 200 keping tiket cabutan bertuah telah dijual. Aminah membeli 8 keping tiket. Satu tiket dicabut secara rawak untuk hadiah utama.', True)
    + STEPS([f'<i>n</i>(S) = 200, <i>n</i>(A) = 8',
             f'P(Aminah menang) = {FR(8, 200)} = {FRV(pW)}',
             f'P(Aminah tidak menang) = 1 − {FR(1, 25)} = {FRV(pL)}'], col)
    + ANS(f'{FRV(pW)} dan {FRV(pL)}'),
    svg(fig, 'Kotak cabutan bertuah dengan 200 tiket; 8 tiket milik Aminah'))

# 13.4-3 Cari bilangan unsur
TOT, pRm = 24, F(3, 8)
nR = pRm * TOT; assert nR == 9 and F(int(nR), TOT) == pRm
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, '24 guli · P(merah) = 3/8', TX, 20)
for i in range(TOT):
    r_, c_ = divmod(i, 8)
    fig += MARBLE(68 + c_ * 52, 104 + r_ * 60, 19, RD if i < nR else MU2)
fig += LINE((40, 300), (460, 300), BD, 2)
fig += SFR(220, 362, '3', '8', RD, 24, 'n(A) =') + T(244, 362, '× 24 = 9', TX, 24, 'start')
fig += T(250, 428, 'n(A) = P(A) × n(S)', AM, 20)
add('13.4', 'CONTOH BERLANGKAH', 'Mencari bilangan unsur',
    P(f'Sebuah kotak mengandungi 24 biji guli. Kebarangkalian memilih guli merah ialah {FR(3, 8)}. Berapakah bilangan guli merah?', True)
    + STEPS([f'P(merah) = {FR("<i>n</i>(merah)", 24)} = {FR(3, 8)}',
             f'<i>n</i>(merah) = {FR(3, 8)} × 24 = 9'], col)
    + ANS('9 biji guli merah')
    + NOTE(f'Daripada P(A) = {PFORM}, kita dapat <i>n</i>(A) = P(A) × <i>n</i>(S).', 'Ingat:'),
    svg(fig, 'Dua puluh empat guli; sembilan daripadanya merah'))

# 13.4-4 Tambah guli
R0, B0 = 6, 10
x = B0 - R0; assert F(R0 + x, R0 + B0 + x) == F(1, 2) and x == 4
fig = RECT(14, 14, 472, 442)
fig += T(130, 44, 'Asal', TX, 20) + T(370, 44, 'Selepas tambah', TX, 20)
fig += BAG(130, 64, 200, 230, [RD] * R0 + [TR] * B0, 13, 4)
fig += BAG(370, 64, 200, 230, [RD] * (R0 + x) + [TR] * B0, 13, 5)
fig += ARROW((228, 190), (272, 190), AM, 4, 12)
fig += T(130, 322, '6 merah, 10 biru', MU3, 17) + T(370, 322, '10 merah, 10 biru', MU3, 17)
fig += T(130, 360, 'P(M) = 6/16', RD, 19) + T(370, 360, 'P(M) = 10/20', RD, 19)
fig += T(250, 420, 'Tambah 4 guli merah', AM, 22)
add('13.4', 'CONTOH BERLANGKAH', 'Menambah unsur',
    P(f'Sebuah beg mengandungi 6 guli merah dan 10 guli biru. Berapakah guli merah yang perlu ditambah supaya kebarangkalian memilih guli merah menjadi {FR(1, 2)}?', True)
    + STEPS([f'Katakan <i>x</i> guli merah ditambah: {FR("6 + <i>x</i>", "16 + <i>x</i>")} = {FR(1, 2)}',
             '2(6 + <i>x</i>) = 16 + <i>x</i> → 12 + 2<i>x</i> = 16 + <i>x</i>',
             '<i>x</i> = 4'], col)
    + ANS('4 guli merah')
    + NOTE('Apabila guli ditambah, <b>jumlah guli</b> (<i>n</i>(S)) juga bertambah.'),
    svg(fig, 'Beg asal dengan 6 guli merah dan 10 biru, kemudian 4 guli merah ditambah'))

# 13.4-5 Kesilapan biasa
assert F(4, 6) != F(4, 10) and F(R0, R0 + B0) == F(3, 8)
fig = RECT(14, 14, 472, 110)
fig += T(250, 50, '4 guli hijau, 6 guli kuning', TX, 20)
fig += T(250, 90, 'Cari P(hijau)', MU3, 17, halo=False)
fig += CHECKS([(180, 'P(hijau) = 4/10 = 2/5', True, 'betul'),
               (250, 'P(hijau) = 4/6 = 2/3', False, 'nisbah, bukan jumlah'),
               (320, 'P(hijau) = 1/2', False, '2 warna ≠ sama peluang'),
               (390, 'n(S) tidak dikemas kini', False, 'selepas tambah')], 20, 460, 54)
add('13.4', 'KESILAPAN BIASA', 'Semak sebelum menjawab',
    BUL([f'{B("Bahagi dengan bahagian lain", RD)}: 4 ÷ 6 ✗. Jumlah guli, <i>n</i>(S) = 4 + 6 = 10.',
         f'{B("Anggap semua warna sama peluang", RD)}: 2 warna tidak bermaksud {FR(1, 2)}.',
         f'{B("Lupa kemas kini jumlah", RD)} apabila unsur ditambah atau dikeluarkan.',
         f'{B("Tidak permudahkan", RD)}: tulis {FR(4, 10)} sebagai {FR(2, 5)}.'], col),
    svg(fig, 'Contoh jawapan betul dan salah bagi masalah kebarangkalian guli'))

# 13.4-6 Ringkasan bab
fig = ''
SUMM = [('Eksperimen', 'kekerapan ÷ cubaan', PU), ('Teori', 'P(A) = n(A) ÷ n(S)', GR),
        ('Pelengkap', "P(A′) = 1 − P(A)", PK), ('Julat', '0 ≤ P(A) ≤ 1', AM)]
for i, (nm, f_, cl) in enumerate(SUMM):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, cl, 16, 2)
    fig += T(36, y0 + 34, nm, cl, 21, 'start') + T(36, y0 + 70, f_, TX, 21, 'start')
fig += DIE(424, 70, 64, 5) + COIN(424, 182, 32, 'K', AM)
fig += CIRC((424, 294), 34, 'none', PK, 3) + f'<path d="M{424 - 34} 294 A34 34 0 0 1 {424 + 34} 294 Z" fill="{PK}" fill-opacity="0.4"/>'
fig += MARBLE(404, 406, 17, RD) + MARBLE(442, 406, 17, TR)
add('13.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus'],
          [['Kebarangkalian eksperimen', PEKS],
           ['Kebarangkalian teori', f'P(A) = {PFORM}'],
           ['Peristiwa pelengkap', 'P(A′) = 1 − P(A)'],
           ['Ramal kekerapan', 'P(A) × bilangan cubaan']], col, rv=True)
    + BUL(['0 ≤ P(A) ≤ 1: mustahil = 0, pasti = 1.',
           '<i>n</i>(A) = P(A) × <i>n</i>(S). Permudahkan pecahan dalam jawapan.'], col),
    svg(fig, 'Ringkasan rumus kebarangkalian bab ini'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values()) + [v[1] for v in SUB.values()]}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body
assert counts == {'13.1': 6, '13.2': 6, '13.3': 5, '13.4': 6}, counts
assert all(4 <= v <= 7 for v in counts.values())

js = ('/* Dijana oleh tools/probalyt/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
