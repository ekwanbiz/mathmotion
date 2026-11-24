# Penjana slaid NOTA PEMFAKTORAN (Tingkatan 2 Bab 2 Pemfaktoran dan Pecahan Algebra) -> pemfaktoran/slides.js
# Jalankan:  python3 tools/pemfaktoran/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, re, random
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'pemfaktoran', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '2.1': ('Kembangan', C['tr']),
    '2.2': ('Pemfaktoran', C['gr']),
    '2.3': ('Ungkapan Algebra dan Hukum Operasi Asas Aritmetik', C['pu']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# warna jubin algebra (sama dengan simulasi): x² biru, x hijau, 1 kuning
TX2, TX1, T1 = TR, GR, AM

# ---------- semakan matematik ----------
# py('2x² − 3(x + 1)') -> ungkapan Python; EQ(a, b) semak identiti pada banyak nilai rawak (pecahan)
VARS = 'abmnpqrstuvwxyz'
def py(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = s.replace('²', '**2').replace('³', '**3').replace('−', '-').replace('×', '*').replace('÷', '/').replace('[', '(').replace(']', ')')
    s = s.replace(' ', '')
    s = re.sub(r'(?<=[0-9a-z)])(?=[a-z(])', '*', s)
    return s
RNG = random.Random(2)
def ev(s, env):
    return eval(py(s), {'__builtins__': {}}, env)
def EQ(a, b):
    for _ in range(8):
        env = {v: F(RNG.randint(-40, 40), RNG.randint(1, 9)) + F(1, 97) for v in VARS}
        try:
            A, B = ev(a, env), ev(b, env)
        except ZeroDivisionError:
            continue
        assert A == B, f'TIDAK SAMA: {a}  ≠  {b}'
    return True
def NE(a, b):
    env = {v: F(RNG.randint(2, 40), RNG.randint(1, 9)) + F(1, 97) for v in VARS}
    assert ev(a, env) != ev(b, env), f'sepatutnya berbeza: {a} / {b}'

# ---------- pembantu teks ----------
STOP = {'dan'}
def M(s):
    """Ungkapan matematik: huruf pemboleh ubah (1-3 huruf, cth x, xy, ab) condong."""
    return re.sub(r'(?<![A-Za-z</])([a-z]{1,3})(?![A-Za-z>])', lambda m: m.group(1) if m.group(1) in STOP else f'<i>{m.group(1)}</i>', s)
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
def FM(a, b):
    return FR(M(a), M(b))
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
def SM(s):
    """Huruf pemboleh ubah condong dalam teks SVG."""
    return re.sub(r'(?<![A-Za-z])([a-z]{1,3})(?![A-Za-z])', lambda m: m.group(1) if m.group(1) in STOP else f'<tspan font-style="italic">{m.group(1)}</tspan>', s)
def vis(s): return re.sub(r'<[^>]+>', '', s)
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, halo=True, math=True):
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{SM(t) if math else t}</text>')
def TW(t, size): return len(vis(t)) * size * 0.56
def SFR(x, y, a, b, col=TX, size=20):
    """Pecahan bertingkat dalam SVG (berpusat di x)."""
    w = max(TW(a, size), TW(b, size)) + 10
    return T(x, y - size * 0.66, a, col, size) + T(x, y + size * 0.72, b, col, size) + LINE((x - w / 2, y), (x + w / 2, y), col, 2.5)
def SFRW(a, b, size=20): return max(TW(a, size), TW(b, size)) + 10
def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def TILE(x, y, w, h, col, lab=None, size=22, tcol=TX):
    s = RECT(x, y, w, h, col + '33', col, 6, 3)
    if lab: s += T(x + w / 2, y + h / 2, lab, tcol, size)
    return s
def ARROW(p, q, col, sw=3.5, head=12):
    import math
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (q[0] - ux * head - uy * head * 0.6, q[1] - uy * head + ux * head * 0.6)
    b = (q[0] - ux * head + uy * head * 0.6, q[1] - uy * head - ux * head * 0.6)
    return (LINE(p, q, col, sw) +
            f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(q[0])} {r1(q[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')
def ARC(p, q, h, col, sw=3):
    """Lengkung 'pelangi' dari p ke q (ke atas sejauh h) dengan kepala anak panah."""
    mx = (p[0] + q[0]) / 2
    s = f'<path d="M{r1(p[0])} {r1(p[1])} Q{r1(mx)} {r1(p[1] - h)} {r1(q[0])} {r1(q[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'
    s += f'<path d="M{r1(q[0] - 9)} {r1(q[1] - 10)} L{r1(q[0])} {r1(q[1])} L{r1(q[0] + 4)} {r1(q[1] - 13)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
    return s
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
def STRIKE(x, y, w, col=RD):
    return LINE((x - w / 2, y + 9), (x + w / 2, y - 9), col, 3)
def RING(x, y, rx, ry, col):
    return f'<ellipse cx="{r1(x)}" cy="{r1(y)}" rx="{r1(rx)}" ry="{r1(ry)}" fill="{col}22" stroke="{col}" stroke-width="2.5"/>'
def WRONGRIGHT(rows, y0=30, gap=70, size=21):
    """Senarai kotak ✗ / ✓ untuk slaid kesilapan biasa: rows = [(teks, betul?, nota)]."""
    s = ''
    for i, (t, ok, why) in enumerate(rows):
        y = y0 + i * gap
        s += RECT(20, y - 27, 460, 54, SURF, GR if ok else RD, 14, 2)
        s += (TICK(48, y) if ok else CROSS(48, y)) + T(74, y - (8 if why else 0), t, GR if ok else RD, size, 'start')
        if why: s += T(74, y + 15, why, MU, 14, 'start', 600, False, False)
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 2.1 KEMBANGAN =====================
col = SUB['2.1'][1]

# 2.1-1 Definisi: 3(x + 2) sebagai luas
EQ('3(x + 2)', '3x + 6')
x0, y0, ux, h3 = 60, 120, 200, 150; u2 = 120
fig = (TILE(x0, y0, ux, h3, TX1, '3x', 30) + TILE(x0 + ux, y0, u2, h3, T1, '6', 30)
       + T(x0 + ux / 2, y0 - 26, 'x', TX1, 24) + T(x0 + ux + u2 / 2, y0 - 26, '2', T1, 24)
       + T(x0 - 22, y0 + h3 / 2, '3', PA, 24)
       + ARROW((x0, y0 - 52), (x0 + ux + u2, y0 - 52), MU, 2.5, 9) + ARROW((x0 + ux + u2, y0 - 52), (x0, y0 - 52), MU, 2.5, 9)
       + T(x0 + (ux + u2) / 2, y0 - 70, 'panjang = x + 2', MU3, 18)
       + T(250, 340, 'Luas = 3(x + 2)', TX, 24) + T(250, 380, '= 3x + 6', col, 26)
       + T(250, 432, 'Satu segi empat tepat, dua cara menulis luasnya', MU, 16, halo=False, math=False))
add('2.1', 'DEFINISI', 'Apa itu kembangan?',
    DEF('<b>Kembangan</b> ialah hasil darab suatu ungkapan algebra dengan ungkapan algebra dalam kurungan. Selepas dikembangkan, <b>kurungan dihapuskan</b>.', col)
    + P(f'Contoh: {M("3(x + 2)")} &nbsp;→&nbsp; {M("3 × x + 3 × 2")} = {B(M("3x + 6"), col)}')
    + BUL([f'Setiap sebutan dalam kurungan <b>didarab</b> dengan sebutan di luar kurungan.',
           f'Kembangan boleh digambarkan sebagai <b>luas</b> segi empat tepat: lebar × panjang.'], col)
    + NOTE('Ungkapan sebelum dan selepas kembangan adalah <b>setara</b> (nilainya sama bagi semua nilai pemboleh ubah).'),
    svg(fig, 'Segi empat tepat 3 darab x tambah 2 dibahagi kepada 3x dan 6'))

# 2.1-2 Sebutan tunggal × dua sebutan
EQ('−2x(3x − 5y)', '−6x² + 10xy')
EQ('(−2x)(3x)', '−6x²'); EQ('(−2x)(−5y)', '10xy')
fig = (T(80, 150, '−2x', PA, 40) + T(165, 150, '(', MU3, 44) + T(230, 150, '3x', TX1, 40) + T(330, 150, '− 5y', PK, 40) + T(395, 150, ')', MU3, 44)
       + ARC((92, 122), (226, 122), 70, TX1) + ARC((92, 122), (338, 122), 130, PK)
       + RECT(30, 236, 440, 70, SURF, BD, 16) + T(250, 271, '(−2x)(3x) = −6x²', TX1, 25)
       + RECT(30, 318, 440, 70, SURF, BD, 16) + T(250, 353, '(−2x)(−5y) = +10xy', PK, 25)
       + T(250, 430, '−2x(3x − 5y) = −6x² + 10xy', col, 25))
add('2.1', 'CONTOH BERLANGKAH', 'Sebutan tunggal × ungkapan dua sebutan',
    P(f'Hukum taburan: {B(M("a(b + c) = ab + ac"), col)}')
    + P(f'Kembangkan {M("−2x(3x − 5y)")}.', True)
    + STEPS([f'Darab −2<i>x</i> dengan sebutan pertama: {M("(−2x)(3x) = −6x²")}',
             f'Darab −2<i>x</i> dengan sebutan kedua: {M("(−2x)(−5y) = +10xy")} &nbsp;(negatif × negatif = positif)',
             'Tulis semua hasil darab bersama tandanya'], col)
    + ANS(M('−2x(3x − 5y) = −6x² + 10xy')),
    svg(fig, 'Anak panah pelangi dari −2x kepada setiap sebutan dalam kurungan'))

# 2.1-3 Dua sebutan × dua sebutan
EQ('(x + 3)(x + 5)', 'x² + 5x + 3x + 15'); EQ('(x + 3)(x + 5)', 'x² + 8x + 15')
gx, gy, a_, b_ = 110, 90, 190, 120   # lajur x | 5, baris x | 3
fig = (TILE(gx, gy, a_, a_, TX2, 'x²', 30) + TILE(gx + a_, gy, b_, a_, TX1, '5x', 28)
       + TILE(gx, gy + a_, a_, 90, TX1, '3x', 28) + TILE(gx + a_, gy + a_, b_, 90, T1, '15', 28)
       + T(gx + a_ / 2, gy - 24, 'x', TR, 24) + T(gx + a_ + b_ / 2, gy - 24, '+ 5', T1, 24)
       + T(gx - 24, gy + a_ / 2, 'x', TR, 24) + T(gx - 30, gy + a_ + 45, '+ 3', T1, 24)
       + T(250, 420, '= x² + 5x + 3x + 15 = x² + 8x + 15', col, 22))
add('2.1', 'CONTOH BERLANGKAH', 'Dua sebutan × dua sebutan',
    P(f'Setiap sebutan dalam kurungan pertama didarab dengan <b>setiap</b> sebutan dalam kurungan kedua: {B(M("(a + b)(c + d) = ac + ad + bc + bd"), col)}', True)
    + P(f'Kembangkan {M("(x + 3)(x + 5)")}.', True)
    + STEPS([f'{M("x × x = x²")} &nbsp;dan&nbsp; {M("x × 5 = 5x")}',
             f'{M("3 × x = 3x")} &nbsp;dan&nbsp; {M("3 × 5 = 15")}',
             f'Gabungkan sebutan serupa: {M("5x + 3x = 8x")}'], col)
    + ANS(M('(x + 3)(x + 5) = x² + 8x + 15')),
    svg(fig, 'Model luas (x + 3)(x + 5): jubin x², 5x, 3x dan 15'))

# 2.1-4 Kembangan khas
EQ('(a + b)²', 'a² + 2ab + b²'); EQ('(a − b)²', 'a² − 2ab + b²'); EQ('(a + b)(a − b)', 'a² − b²')
EQ('(2x + 3)²', '4x² + 12x + 9')
sx, sy, A_, B_ = 120, 60, 210, 110
fig = (TILE(sx, sy, A_, A_, TX2, 'a²', 32) + TILE(sx + A_, sy, B_, A_, TX1, 'ab', 28)
       + TILE(sx, sy + A_, A_, B_, TX1, 'ab', 28) + TILE(sx + A_, sy + A_, B_, B_, T1, 'b²', 28)
       + T(sx + A_ / 2, sy - 24, 'a', TR, 24) + T(sx + A_ + B_ / 2, sy - 24, 'b', T1, 24)
       + T(sx - 24, sy + A_ / 2, 'a', TR, 24) + T(sx - 24, sy + A_ + B_ / 2, 'b', T1, 24)
       + T(250, 430, '(a + b)² = a² + 2ab + b²', col, 25))
add('2.1', 'KONSEP', 'Kembangan khas',
    TABLE(['Bentuk', 'Kembangan'],
          [[M('(a + b)²'), M('a² + 2ab + b²')],
           [M('(a − b)²'), M('a² − 2ab + b²')],
           [M('(a + b)(a − b)'), M('a² − b²')]], col, rv=True)
    + P(f'Contoh: {M("(2x + 3)²")} = {M("(2x)² + 2(2x)(3) + 3²")} = {B(M("4x² + 12x + 9"), col)}', True)
    + NOTE(f'{M("(a + b)²")} bermaksud {M("(a + b)(a + b)")}. Jangan lupa sebutan tengah {M("2ab")}!'),
    svg(fig, 'Segi empat sama bersisi a tambah b dibahagi kepada a², dua ab dan b²'))

# 2.1-5 Permudahkan ungkapan melibatkan kembangan
EQ('(2x − 1)(x + 4)', '2x² + 7x − 4'); EQ('−3x(x − 2)', '−3x² + 6x')
EQ('(2x − 1)(x + 4) − 3x(x − 2)', '−x² + 13x − 4')
tx, ty, cw, ch = 140, 70, 150, 80
cells = [['2x²', '8x'], ['−x', '−4']]
fig = RECT(tx, ty, cw * 2, ch * 2, SURF, BD, 10)
for i in range(2):
    for j in range(2):
        cc = TX2 if (i, j) == (0, 0) else (T1 if (i, j) == (1, 1) else TX1)
        fig += TILE(tx + j * cw + 4, ty + i * ch + 4, cw - 8, ch - 8, cc, cells[i][j], 26)
fig += (T(tx + cw / 2, ty - 24, 'x', TR, 24) + T(tx + cw * 1.5, ty - 24, '+ 4', T1, 24)
        + T(tx - 30, ty + ch / 2, '2x', TR, 24) + T(tx - 30, ty + ch * 1.5, '− 1', T1, 24)
        + T(250, 268, '(2x − 1)(x + 4) = 2x² + 7x − 4', TX, 21)
        + T(250, 308, '−3x(x − 2) = −3x² + 6x', PK, 21)
        + LINE((60, 338), (440, 338), BD, 2)
        + T(250, 372, 'Jumlah: −x² + 13x − 4', col, 24)
        + T(250, 430, 'Kaedah jadual: darab baris × lajur', MU, 16, halo=False, math=False))
add('2.1', 'CONTOH BERLANGKAH', 'Permudahkan ungkapan',
    P(f'Permudahkan {M("(2x − 1)(x + 4) − 3x(x − 2)")}.', True)
    + STEPS([f'Kembangkan: {M("(2x − 1)(x + 4) = 2x² + 8x − x − 4 = 2x² + 7x − 4")}',
             f'Kembangkan: {M("−3x(x − 2) = −3x² + 6x")} &nbsp;(tanda − ikut didarab)',
             f'Kumpul sebutan serupa: {M("(2x² − 3x²) + (7x + 6x) − 4")}'], col)
    + ANS(M('−x² + 13x − 4'))
    + NOTE('Sebutan serupa mempunyai pemboleh ubah <b>dan</b> kuasa yang sama, contohnya 7<i>x</i> dan 6<i>x</i>, tetapi bukan <i>x</i>² dan <i>x</i>.'),
    svg(fig, 'Jadual pendaraban bagi (2x − 1)(x + 4) dan hasil permudahan'))

# 2.1-6 Kesilapan biasa
NE('(x + 3)²', 'x² + 9'); EQ('(x + 3)²', 'x² + 6x + 9')
NE('−2(x − 4)', '−2x − 8'); EQ('−2(x − 4)', '−2x + 8')
NE('3(x + 2)', '3x + 2'); EQ('3(x + 2)', '3x + 6')
fig = WRONGRIGHT([('(x + 3)² = x² + 9', False, 'tertinggal sebutan tengah'), ('(x + 3)² = x² + 6x + 9', True, ''),
                  ('−2(x − 4) = −2x − 8', False, 'tanda salah'), ('−2(x − 4) = −2x + 8', True, ''),
                  ('3(x + 2) = 3x + 2', False, 'tidak darab semua sebutan'), ('3(x + 2) = 3x + 6', True, '')], 46, 72)
add('2.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lupa sebutan tengah", RD)}: {M("(x + 3)² ≠ x² + 9")}. Tulis {M("(x + 3)(x + 3)")} dahulu.',
         f'{B("Tanda negatif", RD)}: negatif × negatif = <b>positif</b>, jadi {M("−2 × (−4) = +8")}.',
         f'{B("Darab sebutan pertama sahaja", RD)}: sebutan di luar kurungan mesti didarab dengan <b>setiap</b> sebutan di dalam kurungan.'], col)
    + NOTE('Semak jawapan dengan menggantikan satu nilai, contohnya <i>x</i> = 1: (1 + 3)² = 16 dan 1 + 6 + 9 = 16 ✓'),
    svg(fig, 'Contoh kembangan yang salah dan betul'))

# 2.1-7 Ringkasan
fig = ''
CARDS = [('a(b + c) = ab + ac', TX1, 'sebutan tunggal × dua sebutan'),
         ('(a + b)(c + d) = ac + ad + bc + bd', TR, 'setiap sebutan × setiap sebutan'),
         ('(a ± b)² = a² ± 2ab + b²', PA, 'kuasa dua: ada sebutan tengah'),
         ('(a + b)(a − b) = a² − b²', PK, 'sebutan tengah hapus')]
for i, (t, cc, d) in enumerate(CARDS):
    y = 22 + i * 110
    fig += RECT(18, y, 464, 96, SURF, BD, 16) + RECT(18, y, 10, 96, cc, cc, 4, 0)
    fig += T(46, y + 38, t, cc, 22, 'start') + T(46, y + 70, d, MU, 16, 'start', 600, False, False)
add('2.1', 'RINGKASAN', 'Ringkasan kembangan',
    BUL(['Darab <b>setiap</b> sebutan dalam kurungan, kemudian gabungkan sebutan serupa.',
         f'Kembangan khas: {M("(a + b)²")}, {M("(a − b)²")} dan {M("(a + b)(a − b)")}.',
         'Berhati-hati dengan tanda: (−) × (−) = (+) dan (−) × (+) = (−).',
         'Kembangan boleh digambarkan sebagai luas segi empat tepat.'], col),
    svg(fig, 'Ringkasan empat bentuk kembangan'))

# ===================== 2.2 PEMFAKTORAN =====================
col = SUB['2.2'][1]

# 2.2-1 Definisi
EQ('3(x + 2)', '3x + 6')
fig = (RECT(30, 150, 170, 90, SURF, TR, 18, 3) + T(115, 195, '3(x + 2)', TR, 30)
       + RECT(300, 150, 170, 90, SURF, GR, 18, 3) + T(385, 195, '3x + 6', GR, 30)
       + ARROW((210, 168), (290, 168), TR, 3.5) + T(250, 138, 'kembangan', TR, 18, math=False)
       + ARROW((290, 222), (210, 222), GR, 3.5) + T(250, 266, 'pemfaktoran', GR, 18, math=False)
       + T(115, 96, 'hasil darab faktor', MU3, 16, halo=False, math=False) + T(385, 96, 'hasil tambah sebutan', MU3, 16, halo=False, math=False)
       + RECT(30, 320, 440, 110, SURF, BD, 16)
       + T(250, 350, 'Faktor bagi 6x:', MU3, 18) + T(250, 392, '1, 2, 3, 6, x, 2x, 3x, 6x', AM, 22))
add('2.2', 'DEFINISI', 'Faktor dan pemfaktoran',
    DEF('<b>Pemfaktoran</b> ialah proses menulis suatu ungkapan algebra sebagai <b>hasil darab faktor-faktornya</b>. Pemfaktoran ialah proses <b>songsang</b> bagi kembangan.', col)
    + BUL([f'Faktor ialah ungkapan yang membahagi suatu ungkapan dengan tepat. Contoh: 3 dan {M("(x + 2)")} ialah faktor bagi {M("3x + 6")}.',
           'Kaedah pemfaktoran: <b>FSTB</b>, <b>beza dua kuasa dua</b>, <b>kaedah pendaraban silang</b> dan <b>mengumpul sebutan</b>.'], col)
    + NOTE('Semak jawapan pemfaktoran dengan mengembangkannya semula.'),
    svg(fig, 'Kembangan dan pemfaktoran ialah proses songsang'))

# 2.2-2 FSTB
EQ('6x²y + 9xy²', '3xy(2x + 3y)')
fig = (RECT(20, 30, 460, 110, SURF, BD, 16) + RECT(20, 156, 460, 110, SURF, BD, 16)
       + T(40, 85, '6x²y =', TX, 24, 'start') + T(40, 211, '9xy² =', TX, 24, 'start'))
rowA = ['2', '3', 'x', 'x', 'y']; comA = [False, True, True, False, True]
rowB = ['3', '3', 'x', 'y', 'y']; comB = [False, True, True, False, True]
for row, com, yy in ((rowA, comA, 85), (rowB, comB, 211)):
    for k, (t, c_) in enumerate(zip(row, com)):
        xx = 180 + k * 64
        if c_: fig += RING(xx, yy, 20, 20, AM)
        fig += T(xx, yy, t, AM if c_ else TX, 26)
        if k < 4: fig += T(xx + 32, yy, '×', MU2, 18, math=False)
fig += (T(250, 316, 'Faktor sepunya: 3 × x × y', AM, 22) + T(250, 356, 'FSTB = 3xy', AM, 26)
        + T(250, 418, '6x²y + 9xy² = 3xy(2x + 3y)', col, 24))
add('2.2', 'CONTOH BERLANGKAH', 'Faktor sepunya terbesar (FSTB)',
    P(f'Faktorkan {M("6x²y + 9xy²")}.', True)
    + STEPS(['Tulis setiap sebutan sebagai hasil darab faktor perdana dan pemboleh ubah.',
             f'Pilih faktor yang ada dalam <b>semua</b> sebutan: FSTB = {B(M("3xy"), AM)}',
             f'Bahagi setiap sebutan dengan FSTB: {M("6x²y ÷ 3xy = 2x")}, {M("9xy² ÷ 3xy = 3y")}'], col)
    + ANS(M('6x²y + 9xy² = 3xy(2x + 3y)'))
    + NOTE('Pemfaktoran lengkap: tiada lagi faktor sepunya di dalam kurungan.'),
    svg(fig, 'Faktor perdana bagi 6x²y dan 9xy² dengan faktor sepunya dibulatkan'))

# 2.2-3 Beza dua kuasa dua
EQ('a² − b²', '(a + b)(a − b)'); EQ('9x² − 16', '(3x + 4)(3x − 4)'); EQ('(3x)² − 4²', '9x² − 16')
qa, qb, X0, Y0 = 150, 60, 34, 70
LP = [(X0, Y0), (X0 + qa, Y0), (X0 + qa, Y0 + qa - qb), (X0 + qa - qb, Y0 + qa - qb), (X0 + qa - qb, Y0 + qa), (X0, Y0 + qa)]
pts = ' '.join(f'{x},{y}' for x, y in LP)
fig = (f'<polygon points="{pts}" fill="{TR}33" stroke="{TR}" stroke-width="3" stroke-linejoin="round"/>'
       + RECT(X0 + qa - qb, Y0 + qa - qb, qb, qb, 'none', RD, 4, 2.5).replace('stroke-width="2.5"', 'stroke-width="2.5" stroke-dasharray="6 5"')
       + T(X0 + qa / 2, Y0 - 20, 'a', TR, 22) + T(X0 - 16, Y0 + qa / 2, 'a', TR, 22)
       + T(X0 + qa - qb / 2, Y0 + qa - qb / 2, 'b²', RD, 20)
       + T(X0 + qa / 2, Y0 + qa + 30, 'a² − b²', TR, 22))
# segi empat tepat (a + b) × (a − b)
RX, RY, Lw, Lh = 222, 112, qa + qb, qa - qb
fig += (TILE(RX, RY, qa, Lh, TR) + TILE(RX + qa, RY, qb, Lh, TR)
        + T(RX + Lw / 2, RY - 20, 'a + b', GR, 22) + T(RX + Lw + 6, RY + Lh / 2, 'a − b', PK, 18, 'start')
        + T(RX + Lw / 2, RY + Lh + 30, '(a + b)(a − b)', GR, 22)
        + ARROW((190, 150), (214, 150), MU3, 3, 8))
fig += (RECT(20, 330, 460, 110, SURF, BD, 16) + T(250, 362, '9x² − 16 = (3x)² − 4²', TX, 22) + T(250, 404, '= (3x + 4)(3x − 4)', col, 24))
add('2.2', 'KONSEP', 'Beza dua kuasa dua',
    P(f'{B(M("a² − b² = (a + b)(a − b)"), col)}')
    + P(f'Faktorkan {M("9x² − 16")}.', True)
    + STEPS([f'Kenal pasti dua kuasa dua: {M("9x² = (3x)²")} dan {M("16 = 4²")}',
             f'Jadi {M("a = 3x")} dan {M("b = 4")}',
             f'Tulis {M("(a + b)(a − b)")}'], col)
    + ANS(M('9x² − 16 = (3x + 4)(3x − 4)'))
    + NOTE('Mesti ada <b>tanda tolak</b> antara dua kuasa dua. Hasil tambah seperti <i>x</i>² + 9 tidak boleh difaktorkan dengan cara ini.'),
    svg(fig, 'Segi empat sama a² ditolak b² disusun semula menjadi segi empat tepat (a + b)(a − b)'))

# 2.2-4 Kaedah pendaraban silang
EQ('3x² − 10x − 8', '(3x + 2)(x − 4)'); EQ('(3x)(−4) + (x)(2)', '−10x')
LX, RX2, Y1, Y2 = 120, 290, 110, 230
fig = (T(LX, 50, 'faktor 3x²', MU3, 17) + T(RX2, 50, 'faktor −8', MU3, 17)
       + RECT(LX - 55, Y1 - 32, 110, 64, SURF, TR, 14, 3) + T(LX, Y1, '3x', TR, 30)
       + RECT(LX - 55, Y2 - 32, 110, 64, SURF, TR, 14, 3) + T(LX, Y2, 'x', TR, 30)
       + RECT(RX2 - 55, Y1 - 32, 110, 64, SURF, AM, 14, 3) + T(RX2, Y1, '+2', AM, 30)
       + RECT(RX2 - 55, Y2 - 32, 110, 64, SURF, AM, 14, 3) + T(RX2, Y2, '−4', AM, 30)
       + LINE((LX + 58, Y1 + 18), (RX2 - 58, Y2 - 18), PK, 3.5) + LINE((LX + 58, Y2 - 18), (RX2 - 58, Y1 + 18), PK, 3.5)
       + T(430, Y1, '+2x', PK, 26) + T(430, Y2, '−12x', PK, 26)
       + LINE((385, Y2 + 36), (475, Y2 + 36), PK, 2.5) + T(430, Y2 + 64, '−10x ✓', GR, 26)
       + T(250, 372, 'Hasil tambah silang = sebutan tengah', MU3, 18, halo=False, math=False)
       + T(250, 420, '3x² − 10x − 8 = (3x + 2)(x − 4)', col, 24))
add('2.2', 'CONTOH BERLANGKAH', 'Kaedah pendaraban silang',
    P(f'Faktorkan {M("3x² − 10x − 8")} (bentuk {M("ax² + bx + c")}).', True)
    + STEPS([f'Pilih faktor bagi {M("3x²")}: {M("3x")} dan {M("x")}. Pilih faktor bagi −8: +2 dan −4.',
             f'Darab secara silang: {M("3x × (−4) = −12x")} dan {M("x × 2 = 2x")}',
             f'Semak: {M("−12x + 2x = −10x")} ✓ (jika tidak sama, cuba pasangan lain)',
             'Baca faktor secara <b>mengufuk</b> (baris demi baris)'], col)
    + ANS(M('3x² − 10x − 8 = (3x + 2)(x − 4)')),
    svg(fig, 'Rajah kaedah pendaraban silang bagi 3x² − 10x − 8'))

# 2.2-5 Mengumpul sebutan
EQ('2xy − 6x + 5y − 15', '2x(y − 3) + 5(y − 3)'); EQ('2x(y − 3) + 5(y − 3)', '(2x + 5)(y − 3)')
fig = (T(250, 60, '2xy − 6x + 5y − 15', TX, 30)
       + f'<path d="M64 88 V100 H246 V88" fill="none" stroke="{TR}" stroke-width="3"/>'
       + f'<path d="M262 88 V100 H436 V88" fill="none" stroke="{PA}" stroke-width="3"/>'
       + T(155, 128, 'FSTB = 2x', TR, 19) + T(349, 128, 'FSTB = 5', PA, 19)
       + T(250, 196, '2x(y − 3) + 5(y − 3)', TX, 28)
       + RING(178, 196, 50, 24, GR) + RING(344, 196, 50, 24, GR)
       + T(250, 246, 'faktor sepunya (y − 3)', GR, 18)
       + ARROW((250, 270), (250, 316), MU3, 3, 10)
       + RECT(40, 330, 420, 76, SURF, GR, 16, 3) + T(250, 368, '(2x + 5)(y − 3)', col, 32)
       + T(250, 440, 'Semak: kembangkan semula → 4 sebutan asal', MU, 16, halo=False, math=False))
add('2.2', 'CONTOH BERLANGKAH', 'Pemfaktoran dengan mengumpul sebutan',
    P(f'Faktorkan {M("2xy − 6x + 5y − 15")}.', True)
    + STEPS([f'Kumpul dua pasangan sebutan: {M("(2xy − 6x) + (5y − 15)")}',
             f'Faktorkan setiap pasangan: {M("2x(y − 3) + 5(y − 3)")}',
             f'Keluarkan faktor sepunya {M("(y − 3)")}: {M("(y − 3)(2x + 5)")}'], col)
    + ANS(M('2xy − 6x + 5y − 15 = (2x + 5)(y − 3)'))
    + NOTE('Ungkapan di dalam kedua-dua kurungan mesti <b>sama</b>. Jika tidak, susun semula sebutan dan cuba lagi.'),
    svg(fig, 'Empat sebutan dikumpul menjadi dua pasangan yang berkongsi faktor y − 3'))

# 2.2-6 Kesilapan biasa
NE('(4x + 3)(4x − 3)', '4x² − 9'); EQ('(2x + 3)(2x − 3)', '4x² − 9')
NE('(x + 3)(x − 3)', 'x² + 9')
EQ('2(x² + 2x)', '2x² + 4x'); EQ('2x(x + 2)', '2x² + 4x')
NE('3(2x)', '6x + 3'); EQ('3(2x + 1)', '6x + 3')
fig = WRONGRIGHT([('4x² − 9 = (4x + 3)(4x − 3)', False, '√(4x²) = 2x, bukan 4x'), ('4x² − 9 = (2x + 3)(2x − 3)', True, ''),
                  ('x² + 9 = (x + 3)(x − 3)', False, '(x + 3)(x − 3) = x² − 9'),
                  ('2x² + 4x = 2(x² + 2x)', False, 'belum lengkap: x masih sepunya'), ('2x² + 4x = 2x(x + 2)', True, ''),
                  ('6x + 3 = 3(2x + 1)', True, 'jangan lupa sebutan 1')], 46, 72, 20)
add('2.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Punca kuasa dua salah", RD)}: {M("4x² = (2x)²")}, bukan {M("(4x)²")}.',
         f'{B("Hasil tambah dua kuasa dua", RD)} seperti {M("x² + 9")} tidak boleh difaktorkan sebagai {M("(x + 3)(x − 3)")}.',
         f'{B("Pemfaktoran tidak lengkap", RD)}: keluarkan <b>FSTB</b>, bukan faktor sepunya yang kecil sahaja.',
         f'{B("Hilang sebutan 1", RD)}: {M("6x + 3 = 3(2x + 1)")}, bukan {M("3(2x)")}.'], col),
    svg(fig, 'Contoh pemfaktoran yang salah dan betul'))

# 2.2-7 Ringkasan: carta alir
fig = ''
FLOW = [('1', 'Keluarkan FSTB dahulu', 'ab + ac = a(b + c)', AM),
        ('2', 'Dua sebutan, a² − b²?', '(a + b)(a − b)', TR),
        ('3', 'Tiga sebutan?', 'kaedah pendaraban silang', PK),
        ('4', 'Empat sebutan?', 'kumpul sebutan', PA)]
for i, (n, t, d, cc) in enumerate(FLOW):
    y = 20 + i * 104
    fig += RECT(18, y, 464, 84, SURF, cc, 16, 2.5)
    fig += f'<circle cx="56" cy="{y + 42}" r="22" fill="{cc}"/>' + T(56, y + 43, n, NAV, 22, halo=False, math=False)
    fig += T(94, y + 28, t, TX, 20, 'start', math=False) + T(94, y + 60, d, cc, 19, 'start')
    if i < 3: fig += ARROW((56, y + 66), (56, y + 100), MU2, 2.5, 8)
fig += T(250, 446, 'Akhir sekali: semak dengan kembangan', GR, 18, halo=False, math=False)
add('2.2', 'RINGKASAN', 'Ringkasan pemfaktoran',
    TABLE(['Kaedah', 'Bentuk'],
          [['FSTB', M('ab + ac = a(b + c)')],
           ['Beza dua kuasa dua', M('a² − b² = (a + b)(a − b)')],
           ['Kuasa dua sempurna', M('a² + 2ab + b² = (a + b)²')],
           ['Kaedah silang', M('ax² + bx + c')],
           ['Kumpul sebutan', M('ax + ay + bx + by = (a + b)(x + y)')]], col, rv=True),
    svg(fig, 'Carta alir memilih kaedah pemfaktoran'))
EQ('a² + 2ab + b²', '(a + b)²'); EQ('ax + ay + bx + by', '(a + b)(x + y)')

# ===================== 2.3 UNGKAPAN ALGEBRA & PECAHAN =====================
col = SUB['2.3'][1]

# 2.3-1 Definisi
assert F(6, 8) == F(3, 4)
EQ('(6x)/(8xy)', '3/(4y)')
fig = (RECT(20, 30, 460, 170, SURF, BD, 16) + T(250, 56, 'Pecahan nombor', MU3, 17, math=False)
       + SFR(110, 128, '6', '8', TX, 30) + T(170, 128, '=', MU3, 28) + SFR(230, 128, '6 ÷ 2', '8 ÷ 2', TX, 24) + T(296, 128, '=', MU3, 28) + SFR(350, 128, '3', '4', col, 30)
       + RECT(20, 220, 460, 200, SURF, BD, 16) + T(250, 246, 'Pecahan algebra', MU3, 17, math=False)
       + SFR(100, 322, '6x', '8xy', TX, 28) + T(162, 322, '=', MU3, 28) + SFR(240, 322, '6x ÷ 2x', '8xy ÷ 2x', TX, 22) + T(318, 322, '=', MU3, 28) + SFR(380, 322, '3', '4y', col, 30)
       + T(250, 396, 'bahagi dengan faktor sepunya 2x', AM, 17))
add('2.3', 'DEFINISI', 'Pecahan algebra',
    DEF(f'<b>Pecahan algebra</b> ialah pecahan yang pengangka atau penyebutnya (atau kedua-duanya) ialah ungkapan algebra, contohnya {FM("3", "4y")} dan {FM("x + 1", "x − 2")}.', col)
    + BUL(['Hukum operasi asas aritmetik (+, −, ×, ÷) bagi pecahan nombor juga digunakan untuk pecahan algebra.',
           'Pecahan dalam <b>bentuk termudah</b> jika pengangka dan penyebut tiada faktor sepunya selain 1.',
           'Penyebut tidak boleh bernilai <b>sifar</b>.'], col)
    + NOTE('Hanya <b>faktor</b> sepunya boleh dibatalkan, bukan sebutan.'),
    svg(fig, 'Permudahkan 6/8 dan 6x/8xy dengan membahagi faktor sepunya'))

# 2.3-2 Permudahkan dengan pemfaktoran
EQ('(x² − 9)/(2x + 6)', '(x − 3)/2'); EQ('x² − 9', '(x + 3)(x − 3)'); EQ('2x + 6', '2(x + 3)')
fig = (SFR(250, 80, 'x² − 9', '2x + 6', TX, 30)
       + T(250, 158, '↓ faktorkan', MU3, 17, math=False)
       + SFR(250, 230, '(x + 3)(x − 3)', '2(x + 3)', TX, 28)
       + STRIKE(203, 210, 80) + STRIKE(263, 250, 80)
       + T(250, 312, 'batalkan faktor sepunya (x + 3)', AM, 18)
       + RECT(150, 340, 200, 100, SURF, GR, 16, 3) + SFR(250, 390, 'x − 3', '2', col, 30))
add('2.3', 'CONTOH BERLANGKAH', 'Permudahkan pecahan algebra',
    P(f'Permudahkan {FM("x² − 9", "2x + 6")}.', True)
    + STEPS([f'Faktorkan pengangka: {M("x² − 9 = (x + 3)(x − 3)")}',
             f'Faktorkan penyebut: {M("2x + 6 = 2(x + 3)")}',
             f'Batalkan faktor sepunya {M("(x + 3)")}'], col)
    + ANS(f'{FM("x² − 9", "2x + 6")} = {FM("x − 3", "2")}')
    + NOTE('Faktorkan <b>dahulu</b>, kemudian batalkan. Jangan batalkan <i>x</i>² dengan <i>x</i> secara terus.'),
    svg(fig, 'Pengangka dan penyebut difaktorkan dan faktor x + 3 dibatalkan'))

# 2.3-3 Tambah & tolak
EQ('(2x + 1)/5 + (x − 3)/5', '(3x − 2)/5')
EQ('3/(4p) − 1/(6p)', '7/(12p)'); EQ('9/(12p) − 2/(12p)', '7/(12p)')
fig = (RECT(20, 24, 460, 160, SURF, BD, 16) + T(250, 48, 'Penyebut sama: tambah pengangka', MU3, 17, math=False)
       + SFR(80, 116, '2x + 1', '5', TX, 24) + T(140, 116, '+', MU3, 26) + SFR(200, 116, 'x − 3', '5', TX, 24)
       + T(256, 116, '=', MU3, 26) + SFR(370, 116, '3x − 2', '5', col, 26)
       + RECT(20, 200, 460, 250, SURF, BD, 16) + T(250, 224, 'Penyebut berbeza: cari GSTK', MU3, 17, math=False)
       + T(250, 262, 'GSTK bagi 4p dan 6p = 12p', AM, 20)
       + SFR(70, 330, '3', '4p', TX, 24) + T(112, 330, '−', MU3, 26) + SFR(154, 330, '1', '6p', TX, 24) + T(196, 330, '=', MU3, 26)
       + SFR(250, 330, '9', '12p', TX, 24) + T(296, 330, '−', MU3, 26) + SFR(342, 330, '2', '12p', TX, 24) + T(390, 330, '=', MU3, 26) + SFR(440, 330, '7', '12p', col, 26)
       + T(250, 404, '×3 atas dan bawah  ·  ×2 atas dan bawah', MU, 16, halo=False, math=False))
add('2.3', 'CONTOH BERLANGKAH', 'Tambah dan tolak pecahan algebra',
    BUL([f'<b>Penyebut sama</b>: tambah atau tolak pengangka sahaja; penyebut kekal.',
         '<b>Penyebut berbeza</b>: tukar kepada penyebut sepunya menggunakan <b>GSTK</b> (gandaan sepunya terkecil).'], col)
    + P(f'Hitung {FM("3", "4p")} − {FM("1", "6p")}.', True)
    + STEPS([f'GSTK bagi {M("4p")} dan {M("6p")} ialah {M("12p")}',
             f'{FM("3", "4p")} = {FM("3 × 3", "4p × 3")} = {FM("9", "12p")} &nbsp;dan&nbsp; {FM("1", "6p")} = {FM("2", "12p")}',
             f'{FM("9 − 2", "12p")} = {FM("7", "12p")}'], col)
    + ANS(FM('7', '12p')),
    svg(fig, 'Tambah pecahan algebra berpenyebut sama dan tolak pecahan berpenyebut berbeza menggunakan GSTK'))

# 2.3-4 Tolak dengan kurungan
EQ('(x + 2)/3 − (x − 1)/2', '(2(x + 2) − 3(x − 1))/6'); EQ('2(x + 2) − 3(x − 1)', '7 − x')
EQ('(x + 2)/3 − (x − 1)/2', '(7 − x)/6')
fig = (SFR(180, 52, 'x + 2', '3', TX, 26) + T(250, 52, '−', MU3, 28) + SFR(320, 52, 'x − 1', '2', TX, 26)
       + T(110, 140, '=', MU3, 28) + SFR(280, 140, '2(x + 2) − 3(x − 1)', '6', TX, 24)
       + RECT(30, 196, 440, 130, SURF, RD, 16, 2.5)
       + T(250, 222, 'Tanda − didarab dengan setiap sebutan', RD, 18, math=False)
       + T(250, 264, '−3(x − 1) = −3x + 3', TX, 26) + RING(372, 264, 30, 22, GR)
       + T(250, 304, '(−3) × (−1) = +3', GR, 20)
       + T(250, 352, '= (2x + 4 − 3x + 3) ÷ 6', MU3, 20)
       + RECT(160, 374, 180, 84, SURF, GR, 16, 3) + SFR(250, 416, '7 − x', '6', col, 28))
add('2.3', 'CONTOH BERLANGKAH', 'Tolak pecahan: jaga tanda!',
    P(f'Permudahkan {FM("x + 2", "3")} − {FM("x − 1", "2")}.', True)
    + STEPS([f'GSTK bagi 3 dan 2 ialah 6: {FM("2(x + 2)", "6")} − {FM("3(x − 1)", "6")}',
             f'Gabungkan dengan <b>kurungan</b>: {FM("2(x + 2) − 3(x − 1)", "6")}',
             f'Kembangkan: {M("2x + 4 − 3x + 3 = 7 − x")}'], col)
    + ANS(f'{FM("7 − x", "6")}')
    + NOTE(f'Tanda tolak di hadapan pecahan kedua berubah tanda <b>setiap</b> sebutan pengangkanya: {M("−3(x − 1) = −3x + 3")}.'),
    svg(fig, 'Tolak dua pecahan algebra dengan kurungan dan perubahan tanda'))

# 2.3-5 Darab & bahagi
EQ('(4m)/(3n) × (9n²)/(8m²)', '(3n)/(2m)')
EQ('((5x)/6) / ((10x²)/9)', '3/(4x)'); EQ('((5x)/6) * (9/(10x²))', '3/(4x)')
fig = (RECT(20, 24, 460, 196, SURF, BD, 16) + T(250, 48, 'Darab: atas × atas, bawah × bawah', MU3, 17, math=False)
       + SFR(70, 120, '4m', '3n', TX, 26) + T(112, 120, '×', MU3, 26) + SFR(160, 120, '9n²', '8m²', TX, 26) + T(206, 120, '=', MU3, 26)
       + SFR(282, 120, '36mn²', '24m²n', TX, 24) + T(352, 120, '=', MU3, 26) + SFR(410, 120, '3n', '2m', col, 28)
       + T(250, 192, 'bahagi dengan faktor sepunya 12mn', AM, 16)
       + RECT(20, 236, 460, 210, SURF, BD, 16) + T(250, 260, 'Bahagi: darab dengan salingan', MU3, 17, math=False)
       + SFR(72, 330, '5x', '6', TX, 24) + T(110, 330, '÷', PK, 26) + SFR(156, 330, '10x²', '9', TX, 24) + T(204, 330, '=', MU3, 26)
       + SFR(244, 330, '5x', '6', TX, 24) + T(282, 330, '×', PK, 26) + SFR(328, 330, '9', '10x²', PK, 24) + T(378, 330, '=', MU3, 26) + SFR(424, 330, '3', '4x', col, 26)
       + T(250, 404, 'salingan bagi 10x²/9 ialah 9/(10x²)', PK, 16))
add('2.3', 'CONTOH BERLANGKAH', 'Darab dan bahagi pecahan algebra',
    BUL([f'<b>Darab</b>: darab pengangka dengan pengangka, penyebut dengan penyebut, kemudian permudahkan.',
         f'<b>Bahagi</b>: tukar ÷ kepada × dan terbalikkan pecahan kedua (<b>salingan</b>).'], col)
    + P(f'Hitung {FM("5x", "6")} ÷ {FM("10x²", "9")}.', True)
    + STEPS([f'Darab dengan salingan: {FM("5x", "6")} × {FM("9", "10x²")}',
             f'{FM("45x", "60x²")}',
             f'Bahagi dengan faktor sepunya {M("15x")}: {FM("3", "4x")}'], col)
    + ANS(FM('3', '4x')),
    svg(fig, 'Contoh pendaraban dan pembahagian pecahan algebra'))
EQ('(45x)/(60x²)', '3/(4x)')

# 2.3-6 Kesilapan biasa
NE('(x + 3)/3', 'x'); EQ('(x + 3)/3', 'x/3 + 1')
NE('1/x + 1/y', '2/(x + y)'); EQ('1/x + 1/y', '(x + y)/(xy)')
NE('−(x − 1)', '−x − 1'); EQ('−(x − 1)', '−x + 1')
fig = ''
CASES = [(60, ['(x + 3)', '3'], 'x', False, '3 ialah sebutan, bukan faktor'),
         (180, ['1', 'x'], None, False, ''),
         (300, None, None, False, '')]
# kes 1
fig += RECT(20, 20, 460, 120, SURF, RD, 14, 2) + CROSS(48, 80)
fig += SFR(140, 80, 'x + 3', '3', RD, 26) + STRIKE(160, 62, 30) + STRIKE(140, 98, 30) + T(196, 80, '= x', RD, 26, 'start')
fig += T(300, 64, 'sebutan 3', MU, 15, 'start', 600, False, False) + T(300, 88, 'bukan faktor', MU, 15, 'start', 600, False, False)
# kes 2
fig += RECT(20, 156, 460, 130, SURF, BD, 14, 2)
fig += CROSS(48, 190) + SFR(110, 190, '1', 'x', RD, 22) + T(140, 190, '+', RD, 22) + SFR(170, 190, '1', 'y', RD, 22) + T(196, 190, '=', RD, 22) + SFR(250, 190, '2', 'x + y', RD, 22)
fig += TICK(48, 254) + SFR(110, 254, '1', 'x', GR, 22) + T(140, 254, '+', GR, 22) + SFR(170, 254, '1', 'y', GR, 22) + T(196, 254, '=', GR, 22) + SFR(250, 254, 'x + y', 'xy', GR, 22)
# kes 3
fig += RECT(20, 302, 460, 146, SURF, BD, 14, 2)
fig += CROSS(48, 340) + T(74, 340, '5 − (x − 1) = 4 − x', RD, 22, 'start')
fig += TICK(48, 400) + T(74, 400, '5 − (x − 1) = 6 − x', GR, 22, 'start')
EQ('5 − (x − 1)', '6 − x'); NE('5 − (x − 1)', '4 − x')
add('2.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Batal sebutan", RD)}: dalam {FM("x + 3", "3")}, nombor 3 di atas ialah <b>sebutan</b>, jadi tidak boleh dibatalkan.',
         f'{B("Tambah penyebut", RD)}: {FM("1", "x")} + {FM("1", "y")} ≠ {FM("2", "x + y")}. Samakan penyebut dahulu.',
         f'{B("Lupa kurungan", RD)}: tanda − mengubah tanda <b>setiap</b> sebutan dalam kurungan.',
         f'{B("Bahagi tanpa salingan", RD)}: hanya pecahan <b>kedua</b> diterbalikkan.'], col),
    svg(fig, 'Contoh kesilapan biasa dalam pecahan algebra'))

# 2.3-7 Ringkasan
fig = ''
OPS = [('+  −', 'Samakan penyebut (GSTK)', 'kemudian tambah/tolak pengangka', TR),
       ('×', 'Atas × atas, bawah × bawah', 'batalkan faktor sepunya', GR),
       ('÷', 'Darab dengan salingan', 'terbalikkan pecahan kedua', PK),
       ('✓', 'Faktorkan dahulu', 'jawapan dalam bentuk termudah', AM)]
for i, (op, t, d, cc) in enumerate(OPS):
    y = 20 + i * 108
    fig += RECT(18, y, 464, 92, SURF, BD, 16) + f'<rect x="34" y="{y + 16}" width="60" height="60" rx="14" fill="{cc}33" stroke="{cc}" stroke-width="2.5"/>'
    fig += T(64, y + 47, op, cc, 26, math=False) + T(112, y + 32, t, TX, 20, 'start', math=False) + T(112, y + 64, d, MU, 16, 'start', 600, False, False)
add('2.3', 'RINGKASAN', 'Ringkasan pecahan algebra',
    TABLE(['Operasi', 'Langkah'],
          [['Tambah / tolak', 'Samakan penyebut dengan GSTK, gunakan kurungan'],
           ['Darab', 'Darab pengangka dan penyebut, batalkan faktor sepunya'],
           ['Bahagi', 'Darab dengan salingan pembahagi'],
           ['Permudah', 'Faktorkan pengangka dan penyebut, batalkan faktor sepunya']], col, rv=True)
    + NOTE('Tulis jawapan akhir dalam <b>bentuk termudah</b>.'),
    svg(fig, 'Ringkasan empat operasi pecahan algebra'))

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
assert counts == {'2.1': 7, '2.2': 7, '2.3': 7}, counts

js = ('/* Dijana oleh tools/pemfaktoran/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
