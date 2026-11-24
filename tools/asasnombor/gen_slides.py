# Penjana slaid NOTA ASAS NOMBOR (Tingkatan 4 Bab 2 Asas Nombor) -> asasnombor/slides.js
# Jalankan:  python3 tools/asasnombor/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'asasnombor', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM: SK 2.1 Asas Nombor (SP 2.1.1 - 2.1.4). Satu SK sahaja, jadi subtopik app = Standard Pembelajaran.
SUB = {
    '2.1.1': ('Nombor dalam Pelbagai Asas', C['tr']),
    '2.1.2': ('Penukaran Asas', C['pa']),
    '2.1.3': ('Tambah dan Tolak', C['gr']),
    '2.1.4': ('Penyelesaian Masalah', C['pu']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- matematik untuk semakan ----------
def to_base(n, b):
    assert n >= 0 and 2 <= b <= 10
    if n == 0: return '0'
    s = ''
    while n: s = str(n % b) + s; n //= b
    return s
def from_base(s, b):
    assert all(int(c) < b for c in s), (s, b)
    return int(s, b)
SUPS = {0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶'}

# ---------- pembantu teks ----------
def N(num, b):
    return f'{num}<sub>{b}</sub>'
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
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: 18px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
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
def SN(seq, size):
    """Teks SVG dengan subskrip asas. seq: senarai rentetan atau (nombor, asas)."""
    out, sh = '', 0
    d = r1(size * 0.32); fs = r1(size * 0.6)
    for it in seq:
        if isinstance(it, tuple):
            num, b = it
            out += (f'<tspan dy="{-sh}">{num}</tspan>' if sh else f'<tspan>{num}</tspan>')
            out += f'<tspan dy="{d}" font-size="{fs}">{b}</tspan>'
            sh = d
        else:
            out += (f'<tspan dy="{-sh}">{it}</tspan>' if sh else f'<tspan>{it}</tspan>')
            sh = 0
    return out
def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def CIRC(x, y, r, fill, stroke, sw=3, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{r1(r)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def ARROW(p, q, col, sw=3.5, head=12, dash=None):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (q[0] - ux * head - uy * head * 0.6, q[1] - uy * head + ux * head * 0.6)
    b = (q[0] - ux * head + uy * head * 0.6, q[1] - uy * head - ux * head * 0.6)
    return (LINE(p, q, col, sw, dash) +
            f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(q[0])} {r1(q[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
def PILL(x, y, w, h, t, col, size=18, fill=None, tcol=None):
    return RECT(x - w / 2, y - h / 2, w, h, fill or f'{col}1A', col, h / 2 if h < 50 else 16, 2.5) + T(x, y, t, tcol or col, size, halo=False)

def PVT(x0, y0, digits, b, col, cw=96, hl=None, show_val=True, rh=56, head_pow=True, digit_cols=None):
    """Jadual nilai tempat: baris kuasa, baris nilai tempat, baris digit."""
    n = len(digits); s = ''
    tw = cw * n
    rows = 3 if show_val else 2
    s += RECT(x0, y0, tw, rh * rows, SURF, BD, 14, 2)
    for i in range(n):
        p = n - 1 - i
        x = x0 + i * cw
        if hl is not None and i == hl:
            s += RECT(x + 4, y0 + 4, cw - 8, rh * rows - 8, f'{AM}1A', AM, 10, 2.5)
        if i: s += LINE((x, y0 + 6), (x, y0 + rh * rows - 6), BD, 2, cap='butt')
        s += T(x + cw / 2, y0 + rh / 2, f'{b}{SUPS[p]}', MU3, 21, halo=False)
        if show_val:
            s += T(x + cw / 2, y0 + rh * 1.5, str(b ** p), col, 21, halo=False)
        dc = digit_cols[i] if digit_cols else TX
        s += T(x + cw / 2, y0 + rh * (rows - 0.5), str(digits[i]), dc, 30)
    for r in range(1, rows):
        s += LINE((x0, y0 + rh * r), (x0 + tw, y0 + rh * r), BD, 2, cap='butt')
    return s

def LADDER(x0, y0, n, b, col, rh=50):
    """Pembahagian berulang (bahagi pendek). Pulangkan (svg, digit)."""
    s = ''; rows = []
    m = n
    while m:
        rows.append((m, m // b, m % b)); m //= b
    y = y0
    for k, (m, q, r) in enumerate(rows):
        s += T(x0, y, str(b), col, 24)
        s += LINE((x0 + 20, y - 22), (x0 + 20, y + 22), MU, 3)
        s += T(x0 + 34, y, str(m), TX, 24, 'start')
        s += LINE((x0 + 20, y + 22), (x0 + 140, y + 22), MU, 3)
        y += rh
    s += T(x0 + 34, y, '0', MU3, 24, 'start')
    # baki
    y = y0 + rh
    for k, (m, q, r) in enumerate(rows):
        s += T(x0 + 170, y - rh / 2 + rh / 2, f'baki {r}', AM, 20, 'start')
        y += rh
    top, bot = y0 + rh - 10, y0 + rh * len(rows) + 10
    s += ARROW((x0 + 262, bot), (x0 + 262, top), GR, 4, 13)
    digits = ''.join(str(r) for _, _, r in reversed(rows))
    return s, digits

def COLARITH(x0, y0, a, b, res, base, op, col, carries=None, borrow=None, cw=56, rh=62):
    """Susunan lajur tambah/tolak. carries: senarai (indeks lajur dari kiri, teks)."""
    n = max(len(a), len(b), len(res))
    A, Bs, R = a.rjust(n), b.rjust(n), res.rjust(n)
    s = ''
    x1 = x0 + 40
    for i in range(n):
        cx = x1 + i * cw + cw / 2
        if A[i] != ' ': s += T(cx, y0 + rh, A[i], TX, 32)
        if Bs[i] != ' ': s += T(cx, y0 + 2 * rh, Bs[i], TX, 32)
        if R[i] != ' ': s += T(cx, y0 + 3 * rh + 14, R[i], col, 32)
    s += T(x0 + 14, y0 + 2 * rh, op, PA, 32)
    xe = x1 + n * cw
    s += T(xe + 8, y0 + rh + 10, str(base), MU3, 18, 'start', halo=False)
    s += T(xe + 8, y0 + 2 * rh + 10, str(base), MU3, 18, 'start', halo=False)
    s += T(xe + 8, y0 + 3 * rh + 24, str(base), col, 18, 'start', halo=False)
    s += LINE((x0, y0 + 2 * rh + 34), (xe + 24, y0 + 2 * rh + 34), MU, 3)
    s += LINE((x0, y0 + 3 * rh + 48), (xe + 24, y0 + 3 * rh + 48), MU, 3)
    for i, t in (carries or []):
        cx = x1 + i * cw + cw / 2
        s += PILL(cx, y0 + rh * 0.28, 40, 28, t, AM, 17, f'{AM}22')
    for i, t in (borrow or []):
        cx = x1 + i * cw + cw / 2
        s += T(cx, y0 + rh * 0.28, t, PK, 18)
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 2.1.1 NOMBOR DALAM PELBAGAI ASAS =====================
col = SUB['2.1.1'][1]

# 1 Definisi asas
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
fig += T(110, 44, 'Asas', MU3, 18, halo=False) + T(320, 44, 'Digit yang digunakan', MU3, 18, halo=False)
fig += LINE((30, 64), (470, 64), BD, 2)
for k, b in enumerate(range(2, 11)):
    y = 92 + k * 40
    c = [TR, PA, GR, PU, AM, PK, TR, PA, GR][k]
    fig += T(110, y, f'asas {b}', c, 19)
    digs = '  '.join(str(d) for d in range(b))
    fig += T(200, y, digs, TX, 19, 'start', 700, halo=False)
assert [len(range(b)) for b in range(2, 11)] == list(range(2, 11))
add('2.1.1', 'DEFINISI', 'Apa itu asas nombor?',
    DEF('Nombor dalam <b>asas <i>n</i></b> ditulis menggunakan <b><i>n</i> digit</b> sahaja, iaitu 0, 1, 2, ..., <i>n</i> − 1.', col)
    + BUL([f'Asas ditulis sebagai subskrip: {N(213, 4)} dibaca "dua satu tiga asas empat".',
           f'Nombor tanpa subskrip ialah nombor dalam <b>asas sepuluh</b>: 25 = {N(25, 10)}.',
           f'Dalam asas lima, digit 5, 6, 7, 8 dan 9 {B("tidak wujud", RD)}.'], col)
    + NOTE('Digit terbesar dalam asas <i>n</i> ialah <i>n</i> − 1. Contohnya, digit terbesar dalam asas lapan ialah 7.'),
    svg(fig, 'Jadual asas dua hingga sepuluh dan digit yang digunakan'))

# 2 Konsep pengumpulan
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
for g in range(2):
    gx = 40 + g * 150
    fig += RECT(gx, 56, 130, 150, f'{TR}14', TR, 20, 3)
    for x, y in [(gx + 35, 92), (gx + 95, 92), (gx + 35, 136), (gx + 95, 136), (gx + 65, 178)]:
        fig += CIRC(x, y, 15, PA, NAV, 2.5)
for x, y in [(368, 100), (424, 100), (396, 150)]:
    fig += CIRC(x, y, 15, PA, NAV, 2.5)
fig += T(105, 230, '1 kumpulan lima', TR, 16, halo=False) + T(255, 230, '1 kumpulan lima', TR, 16, halo=False)
fig += T(395, 230, '3 biji', AM, 16, halo=False)
fig += RECT(60, 274, 380, 80, NAV, BD, 16, 2)
fig += T(150, 300, 'kumpulan 5', TR, 17, halo=False) + T(350, 300, 'sa', AM, 17, halo=False)
fig += T(150, 334, '2', TR, 30) + T(350, 334, '3', AM, 30)
fig += T(250, 410, SN(['13 biji = ', ('23', 5)], 30), TX, 30)
assert 2 * 5 + 3 == 13 and to_base(13, 5) == '23'
add('2.1.1', 'KONSEP PENGUMPULAN', 'Mengumpul mengikut asas',
    P('13 biji guli dikumpulkan dalam kumpulan <b>lima</b>.', True)
    + STEPS(['Bentuk kumpulan lima sebanyak mungkin: 2 kumpulan lima.', 'Baki yang tidak cukup untuk satu kumpulan: 3 biji.',
             f'Tulis bilangan kumpulan, kemudian baki: 13 = {N(23, 5)}.'], col)
    + ANS(f'13 = {N(23, 5)}')
    + NOTE(f'Apabila terdapat lima kumpulan lima, kumpulan itu dikumpulkan sekali lagi menjadi satu kumpulan 5 × 5 = 25. Contohnya, 25 = {N(100, 5)}.'),
    svg(fig, '13 biji guli dikumpul kepada 2 kumpulan lima dan 3 biji'))
assert to_base(25, 5) == '100'

# 3 Nilai tempat
fig = (T(250, 40, SN(['Nombor ', ('2341', 5)], 24), TX, 24)
       + PVT(58, 70, [2, 3, 4, 1], 5, col)
       + T(250, 270, 'Nilai tempat bertambah', MU3, 18, halo=False)
       + T(250, 296, '× 5 setiap kali ke kiri', MU3, 18, halo=False))
for i in range(3):
    x = 58 + 96 * (3 - i) + 48
    fig += ARROW((x - 14, 340), (x - 82, 340), AM, 3.5, 11) + T(x - 48, 368, '× 5', AM, 17)
fig += T(250, 430, 'asas n: ..., n³, n², n¹, n⁰', TX, 20)
add('2.1.1', 'NILAI TEMPAT', 'Nilai tempat ialah kuasa asas',
    DEF('Dalam asas <i>n</i>, nilai tempat dari kanan ke kiri ialah <i>n</i><sup>0</sup>, <i>n</i><sup>1</sup>, <i>n</i><sup>2</sup>, <i>n</i><sup>3</sup>, ...', col)
    + TABLE(['Asas', '<i>n</i><sup>3</sup>', '<i>n</i><sup>2</sup>', '<i>n</i><sup>1</sup>', '<i>n</i><sup>0</sup>'],
            [[str(b), str(b ** 3), str(b ** 2), str(b), '1'] for b in (2, 5, 8, 10)], col, rv=True)
    + NOTE('Nilai tempat paling kanan sentiasa <i>n</i><sup>0</sup> = 1 bagi semua asas.'),
    svg(fig, 'Jadual nilai tempat bagi nombor 2341 asas lima'))

# 4 Nilai digit
assert 3 * 5 ** 2 == 75
fig = (T(250, 40, SN(['Nilai digit 3 dalam ', ('2341', 5)], 24), TX, 24)
       + PVT(58, 70, [2, 3, 4, 1], 5, col, hl=1)
       + ARROW((202, 246), (202, 300), AM, 4, 12)
       + PILL(250, 340, 300, 64, '3 × 5² = 3 × 25', AM, 24, SURF, TX)
       + PILL(250, 420, 220, 56, '= 75', GR, 28, SURF, GR))
add('2.1.1', 'NILAI DIGIT', 'Nilai digit = digit × nilai tempat',
    DEF('<b>Nilai digit</b> = digit × nilai tempat digit itu.', col)
    + P(f'Cari nilai digit 3 dalam {N(2341, 5)}.', True)
    + STEPS(['Digit 3 berada pada tempat kedua dari kiri, iaitu tempat 5<sup>2</sup>.', 'Nilai tempat = 5<sup>2</sup> = 25.', 'Nilai digit = 3 × 25 = 75.'], col)
    + ANS('Nilai digit 3 ialah 75'),
    svg(fig, 'Digit 3 diserlahkan pada tempat lima kuasa dua'))

# 5 Nilai nombor
dv = [2 * 125, 3 * 25, 4 * 5, 1 * 1]
assert sum(dv) == 346 == from_base('2341', 5)
fig = T(250, 40, SN([('2341', 5), ' dalam asas sepuluh'], 24), TX, 24)
cols4 = [TR, PA, GR, PU]
for i, (d, pv, v) in enumerate(zip([2, 3, 4, 1], [125, 25, 5, 1], dv)):
    y = 96 + i * 66
    fig += RECT(40, y - 26, 420, 52, SURF, cols4[i], 14, 2.5)
    fig += T(70, y, str(d), cols4[i], 28) + T(170, y, f'× {pv}', TX, 24) + T(300, y, '=', MU3, 24, halo=False) + T(420, y, str(v), cols4[i], 26, 'end')
fig += LINE((260, 370), (460, 370), MU, 3)
fig += T(250, 420, SN([('2341', 5), ' = 346'], 30), GR, 30)
add('2.1.1', 'NILAI NOMBOR', 'Nilai nombor = hasil tambah nilai digit',
    DEF('<b>Nilai nombor</b> dalam asas sepuluh = hasil tambah nilai semua digit.', col)
    + P(f'Cari nilai nombor {N(2341, 5)}.', True)
    + STEPS(['Nilai digit: 2 × 5<sup>3</sup> = 250, 3 × 5<sup>2</sup> = 75', '4 × 5<sup>1</sup> = 20, 1 × 5<sup>0</sup> = 1',
             '250 + 75 + 20 + 1 = 346'], col)
    + ANS(f'{N(2341, 5)} = 346 (atau {N(346, 10)})'),
    svg(fig, 'Nilai digit 250, 75, 20 dan 1 dijumlahkan menjadi 346'))

# 6 Kesilapan biasa
CS = [(68, '263₅ ialah nombor asas lima', False), (128, 'Digit 6 ≥ 5, maka 263₅ tidak wujud', True),
      (208, 'Nilai tempat digit paling kanan = n', False), (268, 'Nilai tempat paling kanan = n⁰ = 1', True),
      (348, 'Nilai digit 4 dalam 403₅ ialah 4', False), (408, 'Nilai digit 4 dalam 403₅ = 4 × 25 = 100', True)]
assert 4 * 25 == 100
fig = ''
for y, t, ok in CS:
    fig += RECT(14, y - 28, 472, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 17, 'start')
add('2.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Digit mesti kurang daripada asas", RD)}: {N(263, 5)} tidak wujud kerana 6 ≥ 5.',
         f'{B("Nilai tempat bermula dengan n⁰ = 1", RD)} pada digit paling kanan, bukan <i>n</i>.',
         f'{B("Nilai digit ≠ digit", RD)}: nilai digit 4 dalam {N(403, 5)} ialah 4 × 25 = 100.'], col)
    + NOTE('nilai tempat → nilai digit (digit × nilai tempat) → nilai nombor (hasil tambah nilai digit).', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang nilai tempat dan nilai digit'))

# ===================== 2.1.2 PENUKARAN ASAS =====================
col = SUB['2.1.2'][1]

# 1 asas n -> asas 10
assert from_base('11011', 2) == 27 == 16 + 8 + 2 + 1
fig = (T(250, 36, SN([('11011', 2), ' → asas sepuluh'], 24), TX, 24)
       + PVT(30, 62, [1, 1, 0, 1, 1], 2, col, cw=88))
vals = [16, 8, 0, 2, 1]
for i, v in enumerate(vals):
    x = 30 + i * 88 + 44
    fig += ARROW((x, 238), (x, 270), MU, 3, 9) + T(x, 296, str(v), GR if v else MU2, 24)
    if i < 4: fig += T(x + 44, 296, '+', MU3, 22, halo=False)
fig += LINE((40, 334), (460, 334), MU, 3)
fig += T(250, 384, SN([('11011', 2), ' = 27'], 32), GR, 32)
fig += T(250, 436, 'digit 0 menyumbang 0', MU3, 17, halo=False)
add('2.1.2', 'ASAS n → ASAS SEPULUH', 'Tukar kepada asas sepuluh',
    DEF('Darab setiap digit dengan nilai tempatnya, kemudian <b>tambah</b> semua nilai digit.', col)
    + P(f'Tukar {N(11011, 2)} kepada nombor dalam asas sepuluh.', True)
    + STEPS(['Nilai tempat asas dua: 16, 8, 4, 2, 1', '1(16) + 1(8) + 0(4) + 1(2) + 1(1)', '= 16 + 8 + 0 + 2 + 1 = 27'], col)
    + ANS(f'{N(11011, 2)} = {N(27, 10)}'),
    svg(fig, 'Jadual nilai tempat 11011 asas dua dan hasil tambah 27'))

# 2 asas 10 -> asas n (pembahagian berulang)
lad, dg = LADDER(110, 90, 45, 3, col)
assert dg == '1200' == to_base(45, 3) and from_base('1200', 3) == 45
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2) + T(250, 46, '45 → asas tiga', TX, 24) + lad
       + T(432, 200, 'baca', GR, 18) + T(432, 224, 'dari', GR, 18) + T(432, 248, 'bawah', GR, 18)
       + T(250, 418, SN(['45 = ', ('1200', 3)], 32), GR, 32))
add('2.1.2', 'ASAS SEPULUH → ASAS n', 'Pembahagian berulang',
    DEF('Bahagi nombor itu dengan <i>n</i> berulang kali sehingga hasil bahagi 0. <b>Baki</b> dibaca <b>dari bawah ke atas</b>.', col)
    + P('Tukar 45 kepada nombor dalam asas tiga.', True)
    + STEPS(['45 ÷ 3 = 15 baki 0; &nbsp;15 ÷ 3 = 5 baki 0', '5 ÷ 3 = 1 baki 2; &nbsp;1 ÷ 3 = 0 baki 1', 'Baca baki dari bawah: 1, 2, 0, 0'], col)
    + ANS(f'45 = {N(1200, 3)}'),
    svg(fig, 'Pembahagian berulang 45 dengan 3, baki dibaca dari bawah ke atas'))

# 3 kaedah nilai tempat
assert to_base(100, 4) == '1210' and 1 * 64 + 2 * 16 + 1 * 4 + 0 == 100
fig = (T(250, 36, '100 → asas empat', TX, 24)
       + PVT(58, 62, [1, 2, 1, 0], 4, col))
steps = [('100 − 1 × 64 = 36', TR), ('36 − 2 × 16 = 4', PA), ('4 − 1 × 4 = 0', GR), ('0 − 0 × 1 = 0', PU)]
for i, (t, c) in enumerate(steps):
    fig += T(250, 266 + i * 38, t, c, 21)
fig += T(250, 430, SN(['100 = ', ('1210', 4)], 30), GR, 30)
add('2.1.2', 'KAEDAH NILAI TEMPAT', 'Tukar dengan menolak nilai tempat',
    P('Tukar 100 kepada nombor dalam asas empat.', True)
    + STEPS(['Nilai tempat asas empat: 64, 16, 4, 1. Nilai terbesar ≤ 100 ialah 64.', '100 = 1 × 64 + 36; &nbsp;36 = 2 × 16 + 4', '4 = 1 × 4 + 0; &nbsp;digit sa = 0'], col)
    + ANS(f'100 = {N(1210, 4)}')
    + NOTE('Setiap digit ialah bilangan kali nilai tempat itu "muat" dalam baki. Digit mesti kurang daripada 4.'),
    svg(fig, 'Kaedah nilai tempat menukar 100 kepada 1210 asas empat'))

# 4 asas m -> asas n
assert from_base('213', 4) == 39 and to_base(39, 6) == '103'
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + PILL(250, 70, 220, 64, '', TR, 26, SURF) + T(250, 70, SN([('213', 4)], 30), TR, 30)
       + ARROW((250, 104), (250, 170), MU, 3.5, 12) + T(268, 136, 'nilai tempat', MU3, 16, 'start', halo=False)
       + PILL(250, 206, 220, 64, '', AM, 26, SURF) + T(250, 206, SN([('39', 10)], 30), AM, 30)
       + ARROW((250, 240), (250, 306), MU, 3.5, 12) + T(268, 272, 'bahagi dengan 6', MU3, 16, 'start', halo=False)
       + PILL(250, 342, 220, 64, '', GR, 26, SURF) + T(250, 342, SN([('103', 6)], 30), GR, 30)
       + T(250, 424, 'asas sepuluh ialah "jambatan"', MU3, 18, halo=False))
add('2.1.2', 'ASAS m → ASAS n', 'Tukar melalui asas sepuluh',
    P(f'Tukar {N(213, 4)} kepada nombor dalam asas enam.', True)
    + STEPS([f'{N(213, 4)} = 2(16) + 1(4) + 3(1) = 39', '39 ÷ 6 = 6 baki 3; &nbsp;6 ÷ 6 = 1 baki 0; &nbsp;1 ÷ 6 = 0 baki 1',
             'Baca baki dari bawah: 1, 0, 3'], col)
    + ANS(f'{N(213, 4)} = {N(103, 6)}')
    + NOTE(f'Semak: {N(103, 6)} = 1(36) + 0(6) + 3 = 39 ✓'),
    svg(fig, '213 asas empat ditukar kepada 39 asas sepuluh, kemudian 103 asas enam'))

# 5 asas 2 <-> asas 8
assert from_base('110101', 2) == 53 and to_base(53, 8) == '65'
assert from_base('47', 8) == 39 and to_base(39, 2) == '100111'
fig = T(250, 36, SN([('110101', 2), ' → asas lapan'], 22), TX, 22)
for g, (bits, d) in enumerate([('110', 6), ('101', 5)]):
    gx = 60 + g * 200
    fig += RECT(gx, 62, 180, 64, f'{PA}14', PA, 14, 2.5)
    for k, ch in enumerate(bits):
        fig += T(gx + 34 + k * 56, 94, ch, TX, 30)
    fig += T(gx + 90, 146, '4 2 1', MU3, 16, halo=False)
    fig += ARROW((gx + 90, 162), (gx + 90, 196), MU, 3, 9) + T(gx + 90, 222, str(d), GR, 32)
fig += T(250, 260, SN(['= ', ('65', 8)], 28), GR, 28)
fig += LINE((30, 292), (470, 292), BD, 2)
fig += T(250, 324, SN([('47', 8), ' → asas dua'], 22), TX, 22)
for g, (d, bits) in enumerate([(4, '100'), (7, '111')]):
    gx = 60 + g * 200
    fig += T(gx + 90, 362, str(d), AM, 30) + ARROW((gx + 90, 380), (gx + 90, 404), MU, 3, 9)
    fig += RECT(gx, 408, 180, 48, f'{AM}14', AM, 12, 2.5) + T(gx + 90, 432, bits, TX, 26)
add('2.1.2', 'ASAS DUA ↔ ASAS LAPAN', 'Kumpulan tiga digit',
    DEF('Oleh sebab 8 = 2<sup>3</sup>, setiap digit asas lapan bersamaan dengan <b>tiga digit</b> asas dua.', col)
    + BUL([f'Asas dua → asas lapan: kumpulkan tiga digit <b>dari kanan</b>, tukar setiap kumpulan (nilai tempat 4, 2, 1). {N(110101, 2)} → 110 | 101 → {N(65, 8)}.',
           f'Asas lapan → asas dua: tukar setiap digit kepada tiga digit asas dua. {N(47, 8)} → 100 | 111 → {N(100111, 2)}.'], col)
    + NOTE('Tambah sifar di sebelah kiri jika kumpulan paling kiri kurang daripada tiga digit: 1011<sub>2</sub> → 001 | 011 → 13<sub>8</sub>.'),
    svg(fig, 'Penukaran asas dua kepada asas lapan dengan kumpulan tiga digit'))
assert to_base(from_base('1011', 2), 8) == '13'

# 6 kesilapan biasa
CS = [(68, 'Baca baki dari atas: 45 = 0021₃', False), (128, 'Baca baki dari bawah: 45 = 1200₃', True),
      (208, '213₄ → asas 6 = 213₆ (digit sama)', False), (268, '213₄ = 39 = 103₆', True),
      (348, '1011₂ → kumpul dari kiri: 101|1', False), (408, 'Kumpul dari kanan: 001|011 = 13₈', True)]
fig = ''
for y, t, ok in CS:
    fig += RECT(14, y - 28, 472, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 17, 'start')
add('2.1.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Baki dibaca dari bawah ke atas", RD)}: baki terakhir ialah digit paling kiri.',
         f'{B("Digit tidak kekal sama", RD)} apabila asas bertukar. Tukar ke asas sepuluh dahulu.',
         f'{B("Kumpulan tiga digit bermula dari kanan", RD)} bagi asas dua → asas lapan.'], col)
    + NOTE(f'Sentiasa semak jawapan dengan menukar semula ke asas sepuluh: {N(1200, 3)} = 27 + 18 = 45 ✓', 'Tip:'),
    svg(fig, 'Contoh kesilapan dan cara betul dalam penukaran asas'))
assert 27 + 18 == 45

# 7 Ringkasan
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + PILL(120, 90, 180, 70, 'asas m', TR, 26, SURF) + PILL(380, 90, 180, 70, 'asas n', GR, 26, SURF)
       + PILL(250, 300, 220, 80, 'asas sepuluh', AM, 26, SURF)
       + ARROW((140, 128), (208, 256), TR, 4, 13) + T(110, 200, 'darab nilai', TR, 16, halo=False) + T(110, 222, 'tempat & tambah', TR, 16, halo=False)
       + ARROW((290, 256), (360, 128), GR, 4, 13) + T(396, 200, 'bahagi', GR, 16, halo=False) + T(396, 222, 'berulang', GR, 16, halo=False)
       + ARROW((214, 90), (286, 90), PA, 3, 10, dash='7 6') + T(250, 60, 'asas 2 ↔ 8:', PA, 15, halo=False)
       + T(250, 130, 'kumpul 3 digit', PA, 15, halo=False)
       + T(250, 410, 'Semak jawapan dengan menukar balik', MU3, 17, halo=False))
add('2.1.2', 'RINGKASAN', 'Peta penukaran asas',
    TABLE(['Penukaran', 'Kaedah'],
          [['Asas <i>n</i> → asas 10', 'Darab digit dengan nilai tempat, kemudian tambah'],
           ['Asas 10 → asas <i>n</i>', 'Bahagi berulang dengan <i>n</i> (baca baki dari bawah) atau tolak nilai tempat'],
           ['Asas <i>m</i> → asas <i>n</i>', 'Asas <i>m</i> → asas 10 → asas <i>n</i>'],
           ['Asas 2 ↔ asas 8', 'Kumpulan tiga digit dari kanan']], col, rv=True),
    svg(fig, 'Peta penukaran antara asas m, asas sepuluh dan asas n'))

# ===================== 2.1.3 TAMBAH DAN TOLAK =====================
col = SUB['2.1.3'][1]

# 1 tambah asas n
assert from_base('342', 5) + from_base('213', 5) == from_base('1110', 5) == 155
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + COLARITH(80, 24, '342', '213', '1110', 5, '+', col, carries=[(0, '1'), (1, '1'), (2, '1')])
       + T(250, 330, '2 + 3 = 5 = 10₅ → tulis 0, bawa 1', MU3, 17, halo=False)
       + T(250, 362, '4 + 1 + 1 = 6 = 11₅ → tulis 1, bawa 1', MU3, 17, halo=False)
       + T(250, 394, '3 + 2 + 1 = 6 = 11₅ → tulis 11', MU3, 17, halo=False)
       + T(250, 434, 'bawa 1 setiap kali hasil ≥ 5', AM, 18))
add('2.1.3', 'TAMBAH', 'Tambah dalam asas n',
    DEF('Tambah lajur demi lajur dari kanan. Jika hasil tambah satu lajur <b>≥ <i>n</i></b>, tulis (hasil − <i>n</i>) dan <b>bawa 1</b> ke lajur sebelah kiri.', col)
    + P(f'Hitung {N(342, 5)} + {N(213, 5)}.', True)
    + STEPS(['Lajur sa: 2 + 3 = 5 = 1(5) + 0 → tulis 0, bawa 1', 'Lajur kedua: 4 + 1 + 1 = 6 = 1(5) + 1 → tulis 1, bawa 1', 'Lajur ketiga: 3 + 2 + 1 = 6 → tulis 11'], col)
    + ANS(f'{N(342, 5)} + {N(213, 5)} = {N(1110, 5)}'),
    svg(fig, 'Penambahan lajur 342 asas lima tambah 213 asas lima dengan bawa'))

# 2 tambah asas 2
assert from_base('1011', 2) + from_base('111', 2) == from_base('10010', 2) == 18
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + COLARITH(70, 24, '1011', '111', '10010', 2, '+', col, carries=[(0, '1'), (1, '1'), (2, '1'), (3, '1')], cw=60)
       + T(250, 340, '1 + 1 = 10₂ → tulis 0, bawa 1', MU3, 18, halo=False)
       + T(250, 374, '1 + 1 + 1 = 11₂ → tulis 1, bawa 1', MU3, 18, halo=False)
       + T(250, 426, 'Semak: 11 + 7 = 18 ✓', GR, 20))
add('2.1.3', 'TAMBAH ASAS DUA', 'Tambah dalam asas dua',
    DEF('Dalam asas dua: 1 + 1 = 10<sub>2</sub> (tulis 0, bawa 1) dan 1 + 1 + 1 = 11<sub>2</sub> (tulis 1, bawa 1).', col)
    + P(f'Hitung {N(1011, 2)} + {N(111, 2)}.', True)
    + STEPS(['Lajur sa: 1 + 1 → tulis 0, bawa 1', 'Lajur kedua: 1 + 1 + 1 → tulis 1, bawa 1', 'Lajur ketiga: 0 + 1 + 1 → tulis 0, bawa 1; lajur keempat: 1 + 1 → tulis 10'], col)
    + ANS(f'{N(10010, 2)}'),
    svg(fig, 'Penambahan 1011 asas dua tambah 111 asas dua'))

# 3 tolak asas n
assert from_base('402', 5) - from_base('143', 5) == from_base('204', 5) == 54
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + COLARITH(80, 24, '402', '143', '204', 5, '−', col, borrow=[(0, '3'), (1, '4'), (2, '7')])
       + T(250, 330, 'sa: 2 &lt; 3 → pinjam 5: 7 − 3 = 4', MU3, 17, halo=False)
       + T(250, 362, 'kedua: 0 → pinjam: 5 − 1 = 4, 4 − 4 = 0', MU3, 17, halo=False)
       + T(250, 394, 'ketiga: 4 − 1 = 3, 3 − 1 = 2', MU3, 17, halo=False)
       + T(250, 434, 'pinjam 1 = pinjam 5 dalam asas lima', PK, 18))
add('2.1.3', 'TOLAK', 'Tolak dalam asas n',
    DEF('Jika digit atas lebih kecil, <b>pinjam 1</b> daripada lajur kiri. Dalam asas <i>n</i>, 1 yang dipinjam bernilai <b><i>n</i></b>.', col)
    + P(f'Hitung {N(402, 5)} − {N(143, 5)}.', True)
    + STEPS(['Lajur sa: 2 &lt; 3 dan lajur kedua 0, jadi pinjam dari lajur ketiga (4 → 3); lajur kedua menjadi 5.', 'Lajur kedua beri 1 kepada lajur sa (5 → 4): 2 + 5 − 3 = 4.',
             'Lajur kedua: 4 − 4 = 0; lajur ketiga: 3 − 1 = 2.'], col)
    + ANS(f'{N(402, 5)} − {N(143, 5)} = {N(204, 5)}'),
    svg(fig, 'Penolakan 402 asas lima tolak 143 asas lima dengan pinjam'))

# 4 tolak asas 2
assert from_base('11010', 2) - from_base('1011', 2) == from_base('1111', 2) == 15
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + COLARITH(70, 24, '11010', '1011', '1111', 2, '−', col, cw=60)
       + T(250, 340, '0 − 1 → pinjam: 10₂ − 1 = 1', MU3, 18, halo=False)
       + T(250, 374, 'pinjam 1 dalam asas dua = 2', PK, 18)
       + T(250, 426, 'Semak: 26 − 11 = 15 ✓', GR, 20))
add('2.1.3', 'TOLAK ASAS DUA', 'Tolak dalam asas dua',
    P(f'Hitung {N(11010, 2)} − {N(1011, 2)}.', True)
    + STEPS(['Lajur sa: 0 − 1, pinjam daripada lajur kedua (1 → 0): 10<sub>2</sub> − 1 = 1.',
             'Lajur kedua: 0 − 1, pinjam melalui lajur ketiga daripada lajur keempat (1 → 0): 10<sub>2</sub> − 1 = 1. Lajur ketiga tinggal 1: 1 − 0 = 1.',
             'Lajur keempat: 0 − 1, pinjam daripada lajur kelima (1 → 0): 10<sub>2</sub> − 1 = 1. Lajur kelima: 0 − 0 = 0.'], col)
    + ANS(f'{N(1111, 2)}')
    + NOTE('Dalam asas dua, 10<sub>2</sub> − 1 = 1. Semak jawapan: hasil + nombor yang ditolak = nombor asal.'),
    svg(fig, 'Penolakan 11010 asas dua tolak 1011 asas dua'))

# 5 kaedah melalui asas 10
assert from_base('156', 8) == 110 and from_base('37', 8) == 31 and to_base(141, 8) == '215'
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + T(250, 56, SN([('156', 8), ' + ', ('37', 8)], 28), TX, 28)
       + ARROW((250, 84), (250, 130), MU, 3, 10)
       + T(250, 160, '110 + 31', AM, 28) + ARROW((250, 186), (250, 226), MU, 3, 10)
       + T(250, 256, '= 141', AM, 30) + ARROW((250, 284), (250, 326), MU, 3, 10)
       + T(250, 360, SN(['= ', ('215', 8)], 32), GR, 32)
       + T(250, 424, 'tukar → kira → tukar balik', MU3, 18, halo=False))
add('2.1.3', 'KAEDAH LAIN', 'Kira melalui asas sepuluh',
    P(f'Hitung {N(156, 8)} + {N(37, 8)}. Beri jawapan dalam asas lapan.', True)
    + STEPS([f'Tukar ke asas sepuluh: {N(156, 8)} = 64 + 40 + 6 = 110; {N(37, 8)} = 24 + 7 = 31', 'Tambah: 110 + 31 = 141',
             '141 ÷ 8 = 17 baki 5; 17 ÷ 8 = 2 baki 1; 2 ÷ 8 = 0 baki 2'], col)
    + ANS(f'{N(215, 8)}')
    + NOTE('Kaedah ini sesuai untuk menyemak jawapan kaedah lajur, atau apabila nombor dalam <b>asas berbeza</b> perlu ditambah.'),
    svg(fig, 'Penambahan 156 dan 37 asas lapan melalui asas sepuluh'))

# 6 kesilapan biasa
assert from_base('34', 5) + from_base('23', 5) == from_base('112', 5)
CS = [(68, '34₅ + 23₅ = 57₅', False), (128, '4 + 3 = 7 = 12₅: tulis 2, bawa 1 → 112₅', True),
      (208, 'Pinjam 1 = pinjam 10 dalam asas 5', False), (268, 'Pinjam 1 = pinjam 5 dalam asas 5', True),
      (348, '12₃ + 12₄ = 24 (tambah terus)', False), (408, 'Tukar dahulu: 5 + 6 = 11', True)]
assert from_base('12', 3) + from_base('12', 4) == 11
fig = ''
for y, t, ok in CS:
    fig += RECT(14, y - 28, 472, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 17, 'start')
add('2.1.3', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Bawa apabila hasil ≥ n", RD)}, bukan ≥ 10. Dalam asas lima, {N(57, 5)} tidak wujud.',
         f'{B("Pinjam 1 bernilai n", RD)}, bukan 10.',
         f'{B("Asas mesti sama", RD)} sebelum tambah atau tolak lajur. Jika berbeza, tukar ke asas sepuluh dahulu.'], col)
    + NOTE('Jawapan mesti mengandungi digit 0 hingga <i>n</i> − 1 sahaja.', 'Semak:'),
    svg(fig, 'Contoh kesilapan dan cara betul dalam tambah dan tolak asas'))

# ===================== 2.1.4 PENYELESAIAN MASALAH =====================
col = SUB['2.1.4'][1]

# 1 banding dan susun
vv = [('120', 3), ('23', 5), ('1110', 2)]
dec = [from_base(s, b) for s, b in vv]
assert dec == [15, 13, 14]
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
for i, ((s, b), d, c) in enumerate(zip(vv, dec, [TR, PA, GR])):
    y = 66 + i * 70
    fig += RECT(40, y - 28, 420, 56, NAV, c, 14, 2.5) + T(70, y, SN([(s, b)], 26), c, 26, 'start') + ARROW((250, y), (330, y), MU, 3, 10) + T(420, y, str(d), TX, 28, 'end')
fig += LINE((60, 330), (440, 330), MU, 3)
for k, v in enumerate(range(12, 17)):
    x = 80 + k * 85
    fig += LINE((x, 322), (x, 338), MU, 3) + T(x, 360, str(v), MU3, 17, halo=False)
for (s, b), d, c in zip(vv, dec, [TR, PA, GR]):
    x = 80 + (d - 12) * 85
    fig += CIRC(x, 330, 11, c, NAV, 2.5) + T(x, 296, SN([(s, b)], 18), c, 18)
fig += T(250, 422, SN([('23', 5), ' &lt; ', ('1110', 2), ' &lt; ', ('120', 3)], 24), GR, 24)
add('2.1.4', 'BANDING DAN SUSUN', 'Membanding nombor dalam asas berbeza',
    P(f'Susun {N(120, 3)}, {N(23, 5)} dan {N(1110, 2)} mengikut tertib menaik.', True)
    + STEPS([f'{N(120, 3)} = 9 + 6 + 0 = 15', f'{N(23, 5)} = 10 + 3 = 13; &nbsp;{N(1110, 2)} = 8 + 4 + 2 = 14', '13 &lt; 14 &lt; 15'], col)
    + ANS(f'{N(23, 5)}, {N(1110, 2)}, {N(120, 3)}')
    + NOTE('Nombor dalam asas berbeza tidak boleh dibanding dengan melihat digit. Tukar semua kepada asas sepuluh dahulu.'),
    svg(fig, 'Tiga nombor ditukar ke asas sepuluh dan ditanda pada garis nombor'))

# 2 cari digit
assert from_base('233', 5) == 68 and 50 + 5 * 3 + 3 == 68
fig = (T(250, 40, SN([('2p3', 5), ' = 68'], 28), TX, 28)
       + PVT(106, 70, ['2', 'p', '3'], 5, col, hl=1)
       + T(250, 280, '2(25) + p(5) + 3(1) = 68', TX, 22)
       + T(250, 324, '5p + 53 = 68', TX, 22) + T(250, 366, '5p = 15', TX, 22)
       + PILL(250, 420, 160, 56, 'p = 3', GR, 28, SURF, GR))
add('2.1.4', 'DIGIT TIDAK DIKETAHUI', 'Mencari digit yang tidak diketahui',
    P(f'Diberi {N("2<i>p</i>3", 5)} = 68. Cari nilai <i>p</i>.', True)
    + STEPS(['Tulis nilai nombor dengan nilai tempat: 2(5<sup>2</sup>) + <i>p</i>(5) + 3 = 68', '50 + 5<i>p</i> + 3 = 68 → 5<i>p</i> = 15', '<i>p</i> = 3. Semak: 3 &lt; 5, maka digit 3 sah dalam asas lima.'], col)
    + ANS('<i>p</i> = 3'),
    svg(fig, 'Jadual nilai tempat 2p3 asas lima untuk mencari p'))

# 3 cari asas
assert 3 * 5 + 2 == 17 and from_base('32', 5) == 17 and from_base('121', 6) == 49
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + T(250, 56, SN([('32', 'n'), ' = 17'], 30), TX, 30)
       + T(250, 120, '3n + 2 = 17', AM, 26) + T(250, 170, '3n = 15', AM, 26) + PILL(250, 230, 160, 56, 'n = 5', GR, 28, SURF, GR)
       + LINE((40, 280), (460, 280), BD, 2)
       + T(250, 316, SN([('121', 'n'), ' = 49'], 26), TX, 26)
       + T(250, 362, 'n² + 2n + 1 = 49', AM, 22) + T(250, 398, '(n + 1)² = 49', AM, 22)
       + T(250, 436, 'n + 1 = 7 → n = 6', GR, 22))
add('2.1.4', 'ASAS TIDAK DIKETAHUI', 'Mencari asas',
    P(f'Diberi {N(32, "<i>n</i>")} = 17. Cari nilai <i>n</i>.', True)
    + STEPS(['Nilai tempat asas <i>n</i>: <i>n</i>, 1. Maka 3<i>n</i> + 2 = 17.', '3<i>n</i> = 15 → <i>n</i> = 5', 'Semak: semua digit (3 dan 2) mesti kurang daripada asas. 3 &lt; 5 ✓'], col)
    + ANS('<i>n</i> = 5')
    + NOTE(f'Asas mesti lebih besar daripada digit terbesar. Contoh lain: {N(121, "<i>n</i>")} = 49 → (<i>n</i> + 1)<sup>2</sup> = 49 → <i>n</i> = 6.'),
    svg(fig, 'Persamaan untuk mencari asas n'))

# 4 lampu perduaan
bits = '101101'
assert from_base(bits, 2) == 45 and from_base('111111', 2) == 63
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2) + T(250, 50, 'Papan lampu: menyala = 1, padam = 0', MU3, 18, halo=False)
for i, ch in enumerate(bits):
    x = 75 + i * 70
    on = ch == '1'
    fig += CIRC(x, 130, 26, AM if on else DIM, AM if on else MU2, 3)
    if on: fig += CIRC(x, 130, 36, 'none', AM, 2, dash='4 5')
    fig += T(x, 192, ch, AM if on else MU2, 28) + T(x, 232, str(2 ** (5 - i)), MU3, 17, halo=False)
fig += T(250, 300, '32 + 8 + 4 + 1', TX, 26) + T(250, 350, SN([('101101', 2), ' = 45'], 30), GR, 30)
fig += T(250, 420, 'Paling besar: 111111₂ = 63', PU, 20)
add('2.1.4', 'MASALAH HARIAN', 'Lampu perduaan',
    P('Sebuah papan tanda menggunakan 6 lampu. Lampu menyala mewakili 1 dan lampu padam mewakili 0. (a) Nombor apakah yang dipaparkan? (b) Berapakah nombor terbesar yang boleh dipaparkan?', True)
    + STEPS([f'Corak lampu: {N(101101, 2)}', '(a) 32 + 8 + 4 + 1 = 45', f'(b) Semua lampu menyala: {N(111111, 2)} = 32 + 16 + 8 + 4 + 2 + 1 = 63'], col)
    + ANS('(a) 45 &nbsp; (b) 63')
    + NOTE('Komputer menyimpan semua data dalam asas dua kerana setiap suis hanya ada dua keadaan: hidup (1) atau mati (0).', 'Tahukah anda?'),
    svg(fig, 'Enam lampu mewakili nombor 101101 asas dua'))

# 5 masalah tambah (Polya)
a5, b5 = from_base('1324', 5), from_base('213', 5)
assert (a5, b5) == (214, 58) and to_base(a5 + b5, 5) == '2042' and a5 + b5 == 272
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + COLARITH(80, 20, '1324', '213', '2042', 5, '+', col, carries=[(0, '1'), (2, '1')])
       + T(250, 330, SN(['Semak: 214 + 58 = 272 = ', ('2042', 5)], 20), GR, 20)
       + T(250, 380, '272 = 2(125) + 0(25) + 4(5) + 2', MU3, 18, halo=False)
       + T(250, 428, 'Faham → Rancang → Laksana → Semak', AM, 18))
add('2.1.4', 'LANGKAH PENYELESAIAN', 'Menyelesaikan masalah',
    P(f'Aina mempunyai {N(1324, 5)} keping setem dan Mei Ling mempunyai {N(213, 5)} keping setem. Berapakah jumlah setem mereka dalam asas lima dan dalam asas sepuluh?', True)
    + STEPS(['<b>Faham</b>: cari jumlah dua nombor dalam asas lima.', '<b>Rancang &amp; laksana</b>: tambah lajur dengan bawa apabila hasil ≥ 5.',
             f'<b>Semak</b>: {N(1324, 5)} = 214, {N(213, 5)} = 58; 214 + 58 = 272 = {N(2042, 5)} ✓'], col)
    + ANS(f'{N(2042, 5)} keping = 272 keping'),
    svg(fig, 'Penambahan 1324 dan 213 asas lima serta semakan'))

# 6 Ringkasan bab
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
items = [('Nilai tempat', 'n⁰, n¹, n², ...', TR), ('Nilai digit', 'digit × nilai tempat', TR), ('Asas n → 10', 'darab & tambah', PA),
         ('10 → asas n', 'bahagi berulang', PA), ('Tambah', 'bawa 1 jika ≥ n', GR), ('Tolak', 'pinjam 1 = n', GR), ('Cari p atau n', 'bentuk persamaan', PU)]
for i, (a, b_, c) in enumerate(items):
    y = 54 + i * 58
    fig += RECT(34, y - 24, 432, 48, NAV, c, 14, 2) + T(54, y, a, c, 18, 'start') + T(446, y, b_, TX, 17, 'end', 600, halo=False)
add('2.1.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Konsep', 'Ingat'],
          [['Asas <i>n</i>', 'digit 0 hingga <i>n</i> − 1'],
           ['Nilai nombor', 'hasil tambah (digit × nilai tempat)'],
           ['Penukaran', 'asas <i>m</i> → asas 10 → asas <i>n</i>'],
           ['Tambah / tolak', 'asas sama; bawa atau pinjam <i>n</i>'],
           ['Masalah', 'tukar ke asas 10, bentuk persamaan, semak']], col, rv=True),
    svg(fig, 'Ringkasan konsep asas nombor'))

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
assert all(5 <= c <= 7 for c in counts.values()), counts
assert list(counts) == list(SUB), counts

js = ('/* Dijana oleh tools/asasnombor/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid', counts, len(js), 'bait ->', OUTFILE)
