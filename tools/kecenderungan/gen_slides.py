# Penjana slaid NOTA Bab 12 Sukatan Kecenderungan Memusat (Tingkatan 2) -> kecenderungan/slides.js
# Jalankan:  python3 tools/kecenderungan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
import statistics as st
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'kecenderungan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# KSSM bab ini hanya ada SK 12.1, jadi subtopik app = kumpulan Standard Pembelajaran 12.1.1 - 12.1.7
SUB = {
    '12.1.1': ('Mod, Median dan Min', TR),
    '12.1.2': ('Kesan Perubahan Data', PA),
    '12.1.3': ('Data Terkumpul', PU),
    '12.1.4': ('Memilih Sukatan', GR),
}
MODC, MEDC, MINC = PK, AM, GR      # warna tetap: mod (merah jambu), median (kuning), min (hijau)

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

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})
MOD_, MED_, MIN_ = B('Mod', MODC), B('Median', MEDC), B('Min', MINC)

# ===================== 12.1.1 MOD, MEDIAN DAN MIN =====================
col = SUB['12.1.1'][1]

# 1 Definisi
D1 = [1, 1, 1, 2, 3, 5, 6, 8, 9]
assert mod(D1) == [1] and med(D1) == 3 and mean(D1) == 4
fig, X = DOTPLOT(D1, 0, 10, base=300, cols={1: MODC})
fig += T(250, 40, 'Bilangan buku dibaca oleh 9 murid', MU3, 18, halo=False)
fig += ARROW((X(1), 150), (X(1), 210), MODC, 3.5) + T(X(1), 136, 'mod', MODC, 18)
fig += LINE((X(3), 120), (X(3), 296), MEDC, 3, '7 6') + T(X(3), 106, 'median', MEDC, 18)
fig += FULC(X(4), 334, MINC) + T(X(4) + 26, 352, 'min (titik imbang)', MINC, 16, 'start')
fig += LEGEND(392, [('Mod', '1', MODC), ('Median', '3', MEDC), ('Min', '4', MINC)])
add('12.1.1', 'DEFINISI', 'Sukatan kecenderungan memusat',
    DEF('<b>Sukatan kecenderungan memusat</b> ialah satu nilai yang mewakili <b>pusat</b> atau nilai tipikal bagi suatu set data.', col)
    + BUL([f'{MOD_}: nilai data yang paling kerap muncul.',
           f'{MED_}: nilai di tengah-tengah selepas data disusun.',
           f'{MIN_}: hasil tambah semua nilai data ÷ bilangan data.'], col)
    + NOTE('Ketiga-tiga sukatan memberi gambaran di mana data <b>tertumpu</b>.'),
    svg(fig, 'Plot titik bilangan buku dibaca oleh 9 murid dengan mod 1, median 3 dan min 4'))

# 2 Mod
D2 = [5, 7, 3, 7, 9, 7, 2, 3]
assert mod(D2) == [7] and D2.count(7) == 3 and D2.count(3) == 2
assert mod([2, 4, 4, 6, 6]) == [4, 6] and mod([1, 3, 5, 8]) == []
fig, X = DOTPLOT(D2, 1, 10, L=50, R=450, base=320, r=13, gap=32, cols={7: MODC})
fig += T(250, 40, 'Data: 5, 7, 3, 7, 9, 7, 2, 3', MU3, 19, halo=False)
fig += RECT(X(7) - 24, 196, 48, 140, 'none', MODC, 12, 3)
fig += T(X(7), 176, '3 kali', MODC, 18)
fig += T(X(3), 238, '2 kali', MU3, 16)
fig += LEGEND(392, [('Mod', '7', MODC)], 130, 370)
add('12.1.1', 'MOD', 'Mod: nilai paling kerap',
    DEF('<b>Mod</b> ialah nilai data yang mempunyai <b>kekerapan tertinggi</b>.', col)
    + P(f'Cari mod bagi data: {nl(D2)}', True)
    + STEPS(['Kira kekerapan: 7 muncul <b>3 kali</b>, 3 muncul 2 kali, nilai lain sekali.',
             'Nilai yang paling kerap muncul ialah 7.'], col)
    + ANS(f'Mod = {B("7", MODC)}')
    + NOTE('Data 2, 4, 4, 6, 6 ada <b>dua mod</b> (4 dan 6). Jika semua nilai muncul sama kerap, contohnya 1, 3, 5, 8, set data itu <b>tiada mod</b>.'),
    svg(fig, 'Plot titik data 5, 7, 3, 7, 9, 7, 2, 3 dengan nilai 7 paling kerap'))

# 3 Median
OD, EV = [8, 3, 6, 1, 9], [12, 4, 9, 7, 15, 10]
assert med(OD) == 6 and med(EV) == F(19, 2)
fig = RECT(14, 14, 472, 206) + RECT(14, 236, 472, 220)
fig += T(34, 46, 'Bilangan data ganjil (n = 5)', TX, 18, 'start', halo=False)
fig += T(34, 84, 'Data: 8, 3, 6, 1, 9', MU, 17, 'start', halo=False)
x0 = (500 - (5 * 62 - 10)) / 2
fig += CHIPS([num(v) for v in sorted(OD)], x0, 112, cols={2: MEDC})
fig += T(x0 + 2 * 62 + 26, 184, '▲ median = 6', MEDC, 18)
fig += T(34, 268, 'Bilangan data genap (n = 6)', TX, 18, 'start', halo=False)
fig += T(34, 306, 'Data: 12, 4, 9, 7, 15, 10', MU, 17, 'start', halo=False)
x0 = (500 - (6 * 62 - 10)) / 2
fig += CHIPS([num(v) for v in sorted(EV)], x0, 334, cols={2: MEDC, 3: MEDC})
fig += T(250, 412, 'median = (9 + 10) ÷ 2 = 9.5', MEDC, 18)
add('12.1.1', 'MEDIAN', 'Median: nilai di tengah',
    DEF('<b>Median</b> ialah nilai di <b>tengah-tengah</b> set data yang telah disusun mengikut tertib menaik atau menurun.', col)
    + STEPS(['<b>Susun</b> data mengikut tertib menaik.',
             'Bilangan data <b>ganjil</b>: median ialah nilai di tengah.',
             'Bilangan data <b>genap</b>: median = purata dua nilai di tengah.'], col)
    + NOTE(f'Kedudukan median = {FR("<i>n</i> + 1", 2)}. Bagi <i>n</i> = 5, median ialah nilai ke-3. Bagi <i>n</i> = 6, median di antara nilai ke-3 dan ke-4.'),
    svg(fig, 'Median bagi data ganjil 1, 3, 6, 8, 9 ialah 6 dan data genap 4, 7, 9, 10, 12, 15 ialah 9.5'))

# 4 Min
D4 = [3, 5, 4, 6, 7]
assert mean(D4) == 5 and sum(D4) == 25
fig = T(250, 36, 'Jisim 5 biji tembikai (kg)', MU3, 18, halo=False)
bx0, by, u, bw = 70, 380, 44, 56
for i, v in enumerate(D4):
    x = bx0 + i * 76
    for k in range(v):
        over = k >= 5
        fig += RECT(x, by - (k + 1) * u * 0.9 + 2, bw, u * 0.9 - 4, f'{PA}55' if over else f'{TR}55', PA if over else TR, 6, 2)
    fig += T(x + bw / 2, by + 22, f'{v} kg', MU3, 17, halo=False)
yl = by - 5 * u * 0.9
fig += LINE((50, yl), (450, yl), MINC, 4, '10 7') + T(455, yl - 22, 'min = 5', MINC, 19, 'end')
fig += T(250, 440, 'Ratakan: lebihan (oren) mengisi ruang kosong', MU, 16, halo=False)
add('12.1.1', 'MIN', 'Min: purata data',
    DEF(f'<b>Min</b> = {FR("hasil tambah nilai data", "bilangan data")}', col)
    + P(f'Jisim 5 biji tembikai (kg): {nl(D4)}. Cari min jisim.', True)
    + STEPS([f'Hasil tambah = {" + ".join(map(str, D4))} = {sum(D4)}',
             f'Bilangan data = {len(D4)}',
             f'Min = {sum(D4)} ÷ {len(D4)} = {num(mean(D4))}'], col)
    + ANS(f'Min = {B("5 kg", MINC)}'),
    svg(fig, 'Lajur jisim tembikai 3, 5, 4, 6 dan 7 kg diratakan pada aras min 5 kg'))

# 5 Jadual kekerapan
XS, FS = [1, 2, 3, 4, 5], [4, 7, 5, 3, 1]
data5 = [x for x, f in zip(XS, FS) for _ in range(f)]
sf, sfx = sum(FS), sum(x * f for x, f in zip(XS, FS))
assert sf == 20 and sfx == 50 and mean(data5) == F(5, 2) and mod(data5) == [2] and med(data5) == 2
fig, Y = BARS([str(x) for x in XS], FS, (70, 70, 470, 380), 8, 1, {1: MODC}, 'Kekerapan', 'Bilangan adik-beradik', vlab=True)
fig += T(300, 36, 'Carta palang data jadual', MU3, 17, halo=False)
add('12.1.1', 'JADUAL KEKERAPAN', 'Mod, median dan min daripada jadual',
    TABLE(['Bilangan adik-beradik, <i>x</i>', '1', '2', '3', '4', '5'],
          [['Kekerapan, <i>f</i>'] + [str(f) for f in FS],
           ['<i>fx</i>'] + [str(x * f) for x, f in zip(XS, FS)]], col)
    + STEPS([f'{MOD_} = 2 (kekerapan tertinggi, 7)',
             f'{MIN_} = {FR(f"{SIG}<i>fx</i>", f"{SIG}<i>f</i>")} = {FR(sfx, sf)} = 2.5',
             f'{MED_}: <i>n</i> = 20, purata nilai ke-10 dan ke-11. Kekerapan longgokan 4, 11: kedua-duanya 2, maka median = 2'], col),
    svg(fig, 'Carta palang bilangan adik-beradik dengan kekerapan 4, 7, 5, 3 dan 1'))

# 6 Plot titik
D6 = [2, 4, 4, 4, 4, 5, 6, 7, 8, 9, 9, 10]
assert mod(D6) == [4] and med(D6) == F(11, 2) and mean(D6) == 6 and sum(D6) == 72
fig, X = DOTPLOT(D6, 1, 10, L=46, R=454, base=300, r=12, gap=27, cols={4: MODC})
fig += T(250, 40, 'Markah kuiz 12 orang murid', MU3, 18, halo=False)
fig += LINE((X(5.5), 120), (X(5.5), 296), MEDC, 3, '7 6') + T(X(5.5), 106, 'median 5.5', MEDC, 17)
fig += FULC(X(6), 334, MINC) + T(X(6) + 26, 352, 'min 6', MINC, 17, 'start')
fig += LEGEND(392, [('Mod', '4', MODC), ('Median', '5.5', MEDC), ('Min', '6', MINC)])
add('12.1.1', 'PLOT TITIK', 'Membaca plot titik',
    P('Plot titik menunjukkan markah kuiz 12 orang murid. Setiap ● mewakili seorang murid.', True)
    + STEPS([f'{MOD_}: lajur paling tinggi → markah <b>4</b>.',
             f'{MED_}: data ke-6 dan ke-7 ialah 5 dan 6 → (5 + 6) ÷ 2 = <b>5.5</b>.',
             f'{MIN_}: hasil tambah = {sum(D6)}, maka {sum(D6)} ÷ 12 = <b>6</b>.'], col)
    + NOTE('Plot titik sudah tersusun dari kiri ke kanan, jadi mudah untuk mengira kedudukan median.'),
    svg(fig, 'Plot titik markah kuiz 12 murid dengan mod 4, median 5.5 dan min 6'))

# 7 Kesilapan biasa
assert med([4, 9, 2, 7, 5]) == 5 and [4, 9, 2, 7, 5][2] == 2
fig = ''
CASES = [(52, 'Median 4, 9, 2, 7, 5 = 2 (tanpa susun)', False), (122, 'Susun: 2, 4, 5, 7, 9 → median = 5', True),
         (212, 'Mod = 7 (kekerapan tertinggi)', False), (282, 'Mod = 2 (nilai x dengan f = 7)', True),
         (372, 'Min jadual = 50 ÷ 5 baris = 10', False), (442, 'Min jadual = Σfx ÷ Σf = 50 ÷ 20 = 2.5', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 17, 'start')
add('12.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Tidak menyusun data", RD)} sebelum mencari median ✗',
         f'{B("Menulis kekerapan sebagai mod", RD)} ✗ → mod ialah <b>nilai data</b> yang paling kerap.',
         f'{B("Bahagi dengan bilangan baris jadual", RD)} ✗ → bahagi dengan jumlah kekerapan, {SIG}<i>f</i>.',
         f'{B("Data genap", RD)}: ambil purata <b>dua</b> nilai di tengah, bukan salah satu.'], col),
    svg(fig, 'Contoh jawapan salah dan betul bagi median, mod dan min'))

# ===================== 12.1.2 KESAN PERUBAHAN DATA =====================
col = SUB['12.1.2'][1]

# 1 Tambah / tolak
A1 = [3, 5, 5, 8, 9]; A1k = [x + 4 for x in A1]
assert (mod(A1), med(A1), mean(A1)) == ([5], 5, 6) and (mod(A1k), med(A1k), mean(A1k)) == ([9], 9, 10)
fig = RECT(14, 14, 472, 200) + RECT(14, 230, 472, 226)
f1, X = DOTPLOT(A1, 0, 14, L=40, R=460, base=150, r=11, gap=24, cols={5: MODC}, lab_step=2)
f2, _ = DOTPLOT(A1k, 0, 14, L=40, R=460, base=380, r=11, gap=24, cols={9: MODC}, lab_step=2)
fig += T(34, 44, 'Asal: 3, 5, 5, 8, 9', TX, 18, 'start', halo=False) + f1
fig += FULC(X(6), 168, MINC, 10)
fig += T(34, 262, 'Setiap nilai + 4: 7, 9, 9, 12, 13', TX, 18, 'start', halo=False) + f2
fig += FULC(X(10), 398, MINC, 10)
fig += ARROW((X(6), 200), (X(10), 290), PA, 3) + T(X(8) + 30, 244, '+ 4', PA, 20)
fig += T(250, 436, 'Min 6 → 10, median 5 → 9, mod 5 → 9', MU3, 17, halo=False)
add('12.1.2', 'KONSEP', 'Tambah atau tolak nilai yang sama',
    DEF('Jika <b>setiap</b> nilai data ditambah atau ditolak dengan nombor yang sama, <i>k</i>, maka mod, median dan min juga bertambah atau berkurang sebanyak <i>k</i>.', col)
    + TABLE(['Set data', 'Mod', 'Median', 'Min'],
            [[nl(A1), '5', '5', '6'], [f'{nl(A1k)} (+ 4)', B('9', PA), B('9', PA), B('10', PA)]], col, rv=True)
    + NOTE('Seluruh plot titik beralih ke kanan sejauh 4 unit; bentuknya tidak berubah.'),
    svg(fig, 'Plot titik 3, 5, 5, 8, 9 dan selepas setiap nilai ditambah 4'))

# 2 Darab / bahagi
A2 = [2, 4, 4, 5, 10]
A2m = [x * 3 for x in A2]; A2d = [F(x, 2) for x in A2]
assert (mod(A2), med(A2), mean(A2)) == ([4], 4, 5)
assert (mod(A2m), med(A2m), mean(A2m)) == ([12], 12, 15)
assert (mod(A2d), med(A2d), mean(A2d)) == ([2], 2, F(5, 2))
fig = ''
ROWS = [('Asal', A2, ('4', '4', '5'), TX), ('× 3', A2m, ('12', '12', '15'), PA), ('÷ 2', A2d, ('2', '2', '2.5'), TR)]
for i, (lb, d, (mo, me, mn), cl) in enumerate(ROWS):
    y0 = 16 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, BD, 16, 2)
    fig += T(36, y0 + 28, lb, cl, 21, 'start', halo=False)
    fig += CHIPS([num(v) for v in d], 120, y0 + 8, w=62, h=42, gap=8, cols={1: MODC, 2: MODC}, fs_=19)
    fig += T(36, y0 + 98, f'mod {mo}', MODC, 18, 'start', halo=False) + T(200, y0 + 98, f'median {me}', MEDC, 18, 'start', halo=False) + T(380, y0 + 98, f'min {mn}', MINC, 18, 'start', halo=False)
add('12.1.2', 'KONSEP', 'Darab atau bahagi nilai yang sama',
    DEF('Jika <b>setiap</b> nilai data didarab atau dibahagi dengan nombor yang sama, <i>k</i>, maka mod, median dan min juga didarab atau dibahagi dengan <i>k</i>.', col)
    + P(f'Data: {nl(A2)} → mod 4, median 4, min 5.', True)
    + STEPS(['Setiap nilai × 3: mod = 4 × 3 = 12, median = 12, min = 5 × 3 = 15.',
             'Setiap nilai ÷ 2: mod = 4 ÷ 2 = 2, median = 2, min = 5 ÷ 2 = 2.5.'], col)
    + NOTE('Tidak perlu mengira semula daripada awal: terus darab atau bahagi sukatan asal.'),
    svg(fig, 'Data 2, 4, 4, 5, 10 asal, didarab 3 dan dibahagi 2 bersama mod, median dan min'))

# 3 Contoh berlangkah gabungan
m0, k1, k2 = 12, 3, 2
assert (m0 + k1) * k2 == 30
DS = [8, 10, 12, 12, 13, 17]
assert mean(DS) == 12 and mean([(x + 3) * 2 for x in DS]) == 30 and med(DS) == 12 and med([(x + 3) * 2 for x in DS]) == 30
fig = ''
BOX = [(40, 'min asal', '12', TX), (190, '+ 3', '15', PA), (340, '× 2', '30', GR)]
for x, lb, v, cl in BOX:
    fig += RECT(x, 150, 120, 110, SURF, cl, 18, 3)
    fig += T(x + 60, 186, lb, MU3, 17, halo=False) + T(x + 60, 228, v, cl, 34)
fig += ARROW((164, 205), (186, 205), PA, 3.5, 10) + ARROW((314, 205), (336, 205), GR, 3.5, 10)
fig += T(250, 70, 'Ikut tertib operasi yang sama', MU3, 19, halo=False)
fig += T(250, 104, 'seperti pada setiap nilai data', MU3, 19, halo=False)
fig += RECT(40, 310, 420, 120, SURF, BD, 16, 2)
fig += T(250, 344, 'Semak dengan data 8, 10, 12, 12, 13, 17:', MU, 16, halo=False)
fig += T(250, 378, '(x + 3) × 2 → 22, 26, 30, 30, 32, 40', TX, 17, halo=False)
fig += T(250, 410, 'min = 180 ÷ 6 = 30 ✓', GR, 18, halo=False)
assert sum((x + 3) * 2 for x in DS) == 180
add('12.1.2', 'CONTOH BERLANGKAH', 'Dua perubahan berturut-turut',
    P('Min markah 6 orang murid ialah 12. Setiap markah ditambah 3, kemudian didarab dengan 2. Cari min markah yang baharu.', True)
    + STEPS(['Tambah 3: min = 12 + 3 = 15',
             'Darab 2: min = 15 × 2 = 30'], col)
    + ANS(f'Min baharu = {B("30", MINC)}')
    + NOTE('Tertib penting: (12 + 3) × 2 = 30, tetapi 12 × 2 + 3 = 27. Median berubah dengan cara yang sama.'),
    svg(fig, 'Min 12 ditambah 3 menjadi 15, kemudian didarab 2 menjadi 30'))

# 4 Tambah / buang data
n1, mA, xadd = 4, 7, 12
assert F(n1 * mA + xadd, n1 + 1) == 8
n2, mB, mB2 = 5, 8, 7
assert n2 * mB - (n2 - 1) * mB2 == 12
fig = RECT(14, 14, 472, 210) + RECT(14, 240, 472, 216)
fig += T(34, 44, 'Tambah satu data', PA, 19, 'start', halo=False)
fig += CHIPS(['7', '7', '7', '7'], 40, 70, w=60, h=46, gap=10) + CHIPS(['12'], 330, 70, w=70, h=46, cols={0: PA})
fig += T(310, 93, '+', PA, 26, halo=False)
fig += T(250, 150, 'jumlah = 4 × 7 + 12 = 40', TX, 19, halo=False)
fig += T(250, 190, 'min baharu = 40 ÷ 5 = 8', GR, 20, halo=False)
fig += T(34, 270, 'Buang satu data', TR, 19, 'start', halo=False)
fig += T(250, 316, 'Asal: 5 data, min 8 → jumlah = 40', TX, 18, halo=False)
fig += T(250, 354, 'Baharu: 4 data, min 7 → jumlah = 28', TX, 18, halo=False)
fig += T(250, 408, 'data dibuang = 40 − 28 = 12', GR, 20, halo=False)
add('12.1.2', 'KONSEP', 'Menambah atau membuang data',
    DEF('Apabila data ditambah atau dibuang, kira semula <b>hasil tambah</b> data: <br>hasil tambah = min × bilangan data.', col)
    + P('Min 4 nombor ialah 7. Nombor 12 ditambah ke dalam set itu. Cari min baharu.', True)
    + STEPS(['Hasil tambah asal = 4 × 7 = 28',
             'Hasil tambah baharu = 28 + 12 = 40',
             'Min baharu = 40 ÷ 5 = 8'], col)
    + ANS('Min baharu = 8')
    + NOTE('Data yang lebih besar daripada min menaikkan min; data yang lebih kecil daripada min menurunkan min.'),
    svg(fig, 'Contoh menambah data 12 kepada empat data bermin 7, dan membuang satu data'))

# 5 Nilai ekstrem
E0 = [8, 10, 10, 12, 15]; E1 = E0 + [50]
assert (mod(E0), med(E0), mean(E0)) == ([10], 10, 11)
assert (mod(E1), med(E1), mean(E1)) == ([10], 11, F(35, 2))
fig = RECT(14, 14, 472, 442)
f1, X = DOTPLOT(E1, 0, 50, L=40, R=460, base=210, r=10, gap=22, cols={10: MODC, 50: RD}, step=5, lab_step=10, fs_=15)
fig += T(250, 44, 'Masa berjalan ke sekolah (minit)', MU3, 18, halo=False) + f1
fig += T(X(50), 140, 'nilai', RD, 16) + T(X(50), 158, 'ekstrem', RD, 16)
fig += FULC(X(11), 228, MU2, 10) + FULC(X(17.5), 228, MINC, 10)
fig += T(X(11) - 4, 266, '11', MU2, 15, 'end') + T(X(17.5) + 4, 266, '17.5', MINC, 15, 'start')
rows = [('', 'Tanpa 50', 'Dengan 50', MU3), ('Mod', '10', '10', MODC), ('Median', '10', '11', MEDC), ('Min', '11', '17.5', MINC)]
for i, (a, b, c, cl) in enumerate(rows):
    y = 314 + i * 34
    fig += T(70, y, a, cl, 18, 'start', halo=False) + T(270, y, b, cl if i else MU3, 18, halo=False) + T(400, y, c, cl if i else MU3, 18, halo=False)
fig += LINE((50, 330), (450, 330), BD, 2)
add('12.1.2', 'NILAI EKSTREM', 'Kesan nilai ekstrem',
    DEF('<b>Nilai ekstrem</b> ialah nilai yang terlalu besar atau terlalu kecil berbanding nilai lain dalam set data.', col)
    + P(f'Data: {nl(E0)}. Seorang murid lagi mengambil masa 50 minit.', True)
    + BUL([f'{MIN_} berubah banyak: 11 → 17.5', f'{MED_} berubah sedikit: 10 → 11', f'{MOD_} tidak berubah: 10'], col)
    + NOTE('Min paling terjejas oleh nilai ekstrem kerana min menggunakan <b>semua</b> nilai data.'),
    svg(fig, 'Plot titik masa berjalan dengan nilai ekstrem 50 minit menaikkan min daripada 11 kepada 17.5'))

# 6 Ringkasan
fig = ''
SUMM = [('+ k atau − k', '+k / −k', '+k / −k', '+k / −k', PA), ('× k atau ÷ k', '×k / ÷k', '×k / ÷k', '×k / ÷k', TR),
        ('Nilai ekstrem', 'tidak berubah', 'sedikit', 'banyak', RD)]
fig += T(170, 40, 'Mod', MODC, 18) + T(290, 40, 'Median', MEDC, 18) + T(410, 40, 'Min', MINC, 18)
for i, (lb, a, b, c, cl) in enumerate(SUMM):
    y0 = 64 + i * 128
    fig += RECT(14, y0, 472, 112, SURF, cl, 16, 2)
    fig += T(30, y0 + 26, lb, cl, 19, 'start', halo=False)
    fig += T(170, y0 + 72, a, TX, 16, halo=False) + T(290, y0 + 72, b, TX, 16, halo=False) + T(410, y0 + 72, c, TX, 16, halo=False)
add('12.1.2', 'RINGKASAN', 'Ringkasan kesan perubahan',
    TABLE(['Perubahan pada setiap data', 'Kesan pada mod, median, min'],
          [['Tambah / tolak <i>k</i>', 'Semua bertambah / berkurang <i>k</i>'],
           ['Darab / bahagi <i>k</i>', 'Semua didarab / dibahagi <i>k</i>'],
           ['Tambah nilai ekstrem', 'Min paling berubah'],
           ['Tambah / buang satu data', 'Kira semula hasil tambah']], col, rv=True)
    + NOTE('Jangan cari purata dua min. Gunakan hasil tambah = min × bilangan data.', 'Kesilapan biasa:'),
    svg(fig, 'Jadual ringkasan kesan perubahan data terhadap mod, median dan min'))

# ===================== 12.1.3 DATA TERKUMPUL =====================
col = SUB['12.1.3'][1]

# 1 Definisi selang kelas
assert F(41 + 50, 2) == F(91, 2) and 51 - 41 == 10
fig = RECT(14, 14, 472, 442)
L0, R0 = 50, 450
Xn = lambda v: L0 + (v - 40) / 22 * (R0 - L0)
fig += LINE((L0 - 10, 260), (R0 + 10, 260), MU, 3)
for v in range(40, 63):
    big = v in (41, 50, 51, 60)
    fig += LINE((Xn(v), 254 - (4 if big else 0)), (Xn(v), 266 + (4 if big else 0)), MU if big else MU2, 2.5 if big else 1.5)
    if big: fig += T(Xn(v) + (-3 if v == 50 else 3 if v == 51 else 0), 290, str(v), TX, 16, 'end' if v == 50 else 'start' if v == 51 else 'middle', halo=False)
fig += RECT(Xn(41) - 6, 190, Xn(50) - Xn(41) + 12, 44, f'{PU}33', PU, 10, 2.5) + T((Xn(41) + Xn(50)) / 2, 212, 'kelas 41 – 50', TX, 16)
fig += RECT(Xn(51) - 6, 190, Xn(60) - Xn(51) + 12, 44, f'{TR}22', TR, 10, 2.5) + T((Xn(51) + Xn(60)) / 2, 212, 'kelas 51 – 60', TX, 16)
fig += ARROW((Xn(41), 150), (Xn(41), 184), PU, 3, 9) + T(Xn(41), 136, 'had bawah', PU, 15)
fig += ARROW((Xn(50), 110), (Xn(50), 184), PU, 3, 9) + T(Xn(50), 96, 'had atas', PU, 15)
fig += CIRC((Xn(45.5), 260), AM, 9) + T(Xn(45.5), 326, 'titik tengah 45.5', AM, 17)
fig += LINE((Xn(41), 352), (Xn(51), 352), GR, 3) + LINE((Xn(41), 344), (Xn(41), 360), GR, 3) + LINE((Xn(51), 344), (Xn(51), 360), GR, 3)
fig += T(Xn(46), 382, 'saiz selang kelas = 10', GR, 17)
fig += T(250, 46, 'Markah ujian dalam selang kelas', MU3, 18, halo=False)
add('12.1.3', 'DEFINISI', 'Data terkumpul dan selang kelas',
    DEF('<b>Data terkumpul</b> ialah data yang disusun dalam <b>selang kelas</b>, contohnya 41 – 50, 51 – 60.', col)
    + BUL(['Kelas 41 – 50: <b>had bawah</b> = 41, <b>had atas</b> = 50.',
           '<b>Saiz selang kelas</b> = beza had bawah dua kelas berturutan = 51 − 41 = 10.',
           f'<b>Titik tengah</b> = {FR("had bawah + had atas", 2)} = {FR("41 + 50", 2)} = 45.5'], col)
    + NOTE('Selang kelas mesti <b>sama saiz</b> dan <b>tidak bertindih</b>.'),
    svg(fig, 'Garis nombor kelas 41 hingga 50 dan 51 hingga 60 dengan had bawah, had atas dan titik tengah'))

# 2 Membina jadual kekerapan
J = [42, 35, 47, 38, 44, 51, 40, 36, 43, 46, 41, 33, 45, 49, 52, 44, 38, 47, 42, 43]
CL = [(30, 34), (35, 39), (40, 44), (45, 49), (50, 54)]
FJ = [sum(1 for v in J if a <= v <= b) for a, b in CL]
assert len(J) == 20 and FJ == [1, 4, 8, 5, 2] and sum(FJ) == 20
def tally(n):
    out = []
    while n >= 5: out.append('<s>||||</s>'); n -= 5
    if n: out.append('|' * n)
    return ' '.join(out)
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Jisim 20 orang murid (kg)', MU3, 18, halo=False)
for i, v in enumerate(J):
    r_, c_ = divmod(i, 5)
    x, y = 60 + c_ * 92, 96 + r_ * 62
    cls_ = next(k for k, (a, b) in enumerate(CL) if a <= v <= b)
    cl = PU if cls_ == 2 else BD
    fig += RECT(x - 34, y - 22, 68, 44, f'{PU}33' if cls_ == 2 else SURF, cl, 10, 2) + T(x, y + 1, str(v), TX, 19, halo=False)
fig += T(250, 372, 'Data 40 – 44 ditanda ungu: 8 orang', PU, 17, halo=False)
fig += T(250, 410, 'Setiap data dikira sekali sahaja', MU, 16, halo=False)
add('12.1.3', 'JADUAL KEKERAPAN', 'Membina jadual kekerapan',
    P('Susun data jisim ke dalam kelas yang bersaiz 5 kg. Buat <b>gundalan</b> bagi setiap data.', True)
    + TABLE(['Jisim (kg)', 'Gundalan', 'Kekerapan'],
            [[f'{a} – {b}', tally(f), str(f)] for (a, b), f in zip(CL, FJ)] + [['Jumlah', '', '20']], col, rv=True, last_bold=True)
    + NOTE('Jumlah kekerapan mesti sama dengan bilangan data (20).', 'Semak:'),
    svg(fig, 'Senarai jisim 20 orang murid untuk dikumpulkan dalam kelas'))

# 3 Kelas mod & histogram
assert FJ.index(max(FJ)) == 2
fig, Y = BARS([f'{a}–{b}' for a, b in CL], FJ, (70, 80, 470, 380), 9, 1, {2: MODC}, 'Kekerapan', 'Jisim (kg)', hist=True, vlab=True, fs_=15)
fig += T(300, 36, 'Histogram jisim 20 orang murid', MU3, 17, halo=False)
fig += T(70 + 2.5 * 80, Y(8) - 40, 'kelas mod', MODC, 18)
add('12.1.3', 'KELAS MOD', 'Kelas mod',
    DEF('<b>Kelas mod</b> ialah selang kelas yang mempunyai <b>kekerapan tertinggi</b>.', col)
    + STEPS(['Cari kekerapan tertinggi dalam jadual: <b>8</b>.',
             'Kelas yang sepadan ialah 40 – 44.'], col)
    + ANS(f'Kelas mod = {B("40 – 44 kg", MODC)}')
    + BUL(['Dalam <b>histogram</b>, kelas mod ialah palang yang <b>paling tinggi</b>.',
           'Palang histogram bersentuhan kerana kelas adalah berturutan.'], col)
    + NOTE('Jawapan kelas mod ialah <b>selang kelas</b> (40 – 44), bukan kekerapan (8).'),
    svg(fig, 'Histogram jisim 20 murid dengan kelas mod 40 hingga 44 kg'))

# 4 Min anggaran (jisim)
MX = [F(a + b, 2) for a, b in CL]
FX = [m * f for m, f in zip(MX, FJ)]
SFX = sum(FX)
assert MX == [32, 37, 42, 47, 52] and SFX == 855 and F(SFX, 20) == F(171, 4)
fig, Y = BARS([f'{a}–{b}' for a, b in CL], FJ, (70, 80, 470, 380), 9, 1, {2: MODC}, 'Kekerapan', '', hist=True, fs_=15)
xm = 70 + (float(F(SFX, 20)) - 30) / 25 * 400
fig += LINE((xm, 60), (xm, 380), MINC, 4, '9 6') + T(xm + 8, 52, 'min = 42.75 kg', MINC, 18, 'start')
for i, m in enumerate(MX):
    fig += T(70 + i * 80 + 40, 418, f'x = {num(m)}', AM, 14, halo=False)
fig += T(250, 448, 'Jisim (kg) · titik tengah (x) setiap kelas', AM, 15, halo=False)
add('12.1.3', 'RUMUS', 'Min bagi data terkumpul',
    DEF(f'Min = {FR(f"{SIG}<i>fx</i>", f"{SIG}<i>f</i>")}, dengan <i>x</i> = <b>titik tengah</b> kelas dan <i>f</i> = kekerapan.', col)
    + TABLE(['Jisim (kg)', '<i>f</i>', '<i>x</i>', '<i>fx</i>'],
            [[f'{a} – {b}', str(f), num(m), num(v)] for (a, b), f, m, v in zip(CL, FJ, MX, FX)]
            + [['Jumlah', '20', '', '855']], col, rv=True, last_bold=True)
    + STEPS([f'Min = {FR(855, 20)} = 42.75 kg'], col),
    svg(fig, 'Histogram jisim dengan garis min 42.75 kg dan titik tengah setiap kelas'))

# 5 Contoh berlangkah 2
CL2 = [(10, 19), (20, 29), (30, 39), (40, 49)]; F2 = [3, 8, 6, 3]
M2 = [F(a + b, 2) for a, b in CL2]; FX2 = [m * f for m, f in zip(M2, F2)]
assert sum(F2) == 20 and sum(FX2) == 580 and F(sum(FX2), 20) == 29 and F2.index(max(F2)) == 1
assert [num(x) for x in M2] == ['14.5', '24.5', '34.5', '44.5'] and [num(x) for x in FX2] == ['43.5', '196', '207', '133.5']
fig, Y = BARS([f'{a}–{b}' for a, b in CL2], F2, (70, 80, 470, 380), 9, 1, {1: MODC}, 'Bilangan murid', 'Masa (minit)', hist=True, vlab=True)
xm = 70 + (29 - 10) / 40 * 400
fig += LINE((xm, 60), (xm, 380), MINC, 4, '9 6') + T(xm + 8, 52, 'min = 29 minit', MINC, 18, 'start')
fig += T(70 + 1.5 * 100, Y(8) - 40, 'kelas mod', MODC, 17)
add('12.1.3', 'CONTOH BERLANGKAH', 'Masa menyiapkan kerja rumah',
    TABLE(['Masa (minit)', '<i>f</i>', '<i>x</i>', '<i>fx</i>'],
          [[f'{a} – {b}', str(f), num(m), num(v)] for (a, b), f, m, v in zip(CL2, F2, M2, FX2)]
          + [['Jumlah', '20', '', '580']], col, last_bold=True)
    + STEPS(['Titik tengah 10 – 19 = (10 + 19) ÷ 2 = 14.5, dan seterusnya.',
             f'Min = {FR(f"{SIG}<i>fx</i>", f"{SIG}<i>f</i>")} = {FR(580, 20)} = 29 minit',
             'Kelas mod = 20 – 29 minit (kekerapan 8)'], col),
    svg(fig, 'Histogram masa menyiapkan kerja rumah dengan min 29 minit dan kelas mod 20 hingga 29'))

# 6 Kesilapan biasa
assert F(32 * 1 + 37 * 4 + 42 * 8 + 47 * 5 + 52 * 2, 20) == F(171, 4)
assert num(F(855, 5)) == '171' and num(F(855, 20)) == '42.75'
fig = ''
CASES = [(52, 'Guna had atas (34, 39, ...) sebagai x', False), (122, 'Guna titik tengah (32, 37, ...) sebagai x', True),
         (212, 'Min = 855 ÷ 5 kelas = 171', False), (282, 'Min = 855 ÷ 20 murid = 42.75', True),
         (372, 'Kelas mod = 8', False), (442, 'Kelas mod = 40 – 44', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(78, y, t, GR if ok else RD, 17, 'start')
add('12.1.3', 'KESILAPAN BIASA', 'Semak kiraan anda',
    BUL([f'{B("Guna had kelas", RD)} sebagai <i>x</i> ✗ → guna <b>titik tengah</b> kelas.',
         f'{B("Bahagi dengan bilangan kelas", RD)} ✗ → bahagi dengan {SIG}<i>f</i>.',
         f'{B("Menulis kekerapan", RD)} sebagai kelas mod ✗',
         'Min data terkumpul ialah <b>anggaran</b> kerana nilai sebenar setiap data tidak diketahui.'], col),
    svg(fig, 'Contoh kiraan salah dan betul bagi min dan kelas mod data terkumpul'))

# ===================== 12.1.4 MEMILIH SUKATAN & PENYELESAIAN MASALAH =====================
col = SUB['12.1.4'][1]

# 1 Memilih sukatan
fig = ''
CARD = [('Mod', MODC, ['Data kategori (bukan nombor)', 'Nilai paling popular', 'Cth: saiz baju, warna']),
        ('Median', MEDC, ['Ada nilai ekstrem', 'Nilai tengah tidak terjejas', 'Cth: gaji, harga rumah']),
        ('Min', MINC, ['Data berangka tanpa nilai ekstrem', 'Menggunakan semua data', 'Cth: markah, suhu'])]
for i, (nm, cl, lines) in enumerate(CARD):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, cl, 18, 2.5)
    fig += T(36, y0 + 30, nm, cl, 24, 'start', halo=False)
    for j, t in enumerate(lines):
        fig += T(36, y0 + 66 + j * 26, t, TX if j < 2 else MU, 17, 'start', 600, halo=False)
add('12.1.4', 'KONSEP', 'Memilih sukatan yang paling sesuai',
    TABLE(['Sukatan', 'Paling sesuai apabila'],
          [[MOD_, 'data kategori, atau ingin tahu nilai yang paling popular'],
           [MED_, 'data mempunyai nilai ekstrem'],
           [MIN_, 'data berangka tanpa nilai ekstrem']], col, rv=True)
    + NOTE('Wajarkan pilihan anda: nyatakan <b>sebab</b>, contohnya "median dipilih kerana terdapat nilai ekstrem".'),
    svg(fig, 'Tiga kad: bila menggunakan mod, median dan min'))

# 2 Contoh nilai ekstrem: gaji
GJ = [1800, 2000, 2100, 2300, 11800]
assert mean(GJ) == 4000 and med(GJ) == 2100 and mod(GJ) == [] and sum(1 for g in GJ if g < 4000) == 4
fig, Y = BARS(['A', 'B', 'C', 'D', 'E'], [g / 1000 for g in GJ], (80, 70, 470, 380), 12, 2, {4: RD}, 'RM (ribu)', 'Pekerja', bw=0.6)
fig += LINE((80, Y(4)), (470, Y(4)), MINC, 4, '9 6') + T(165, 56, '- - min RM4000', MINC, 16, 'start')
fig += LINE((80, Y(2.1)), (470, Y(2.1)), MEDC, 3, '5 5') + T(305, 56, '- - median RM2100', MEDC, 16, 'start')
fig += T(300, 32, 'Gaji bulanan 5 orang pekerja', MU3, 17, halo=False)
add('12.1.4', 'CONTOH BERLANGKAH', 'Gaji pekerja: min atau median?',
    P('Gaji bulanan 5 orang pekerja: RM1800, RM2000, RM2100, RM2300, RM11 800. Sukatan manakah paling sesuai untuk mewakili gaji mereka?', True)
    + STEPS(['Min = RM20 000 ÷ 5 = RM4000 (lebih tinggi daripada gaji 4 orang pekerja).',
             'Median = RM2100. Tiada mod kerana semua gaji berbeza.',
             'RM11 800 ialah nilai ekstrem, maka median lebih mewakili.'], col)
    + ANS(f'{B("Median", MEDC)}, kerana terdapat nilai ekstrem'),
    svg(fig, 'Carta palang gaji 5 pekerja dengan garis min RM4000 dan median RM2100'))

# 3 Contoh mod: saiz kasut
SZ = [5, 6, 7, 8, 9]; FZ = [6, 14, 22, 11, 4]
assert FZ.index(max(FZ)) == 2 and sum(FZ) == 57
fig, Y = BARS([str(s) for s in SZ], FZ, (70, 70, 470, 380), 25, 5, {2: MODC}, 'Pasang dijual', 'Saiz kasut', vlab=True)
fig += T(300, 32, 'Jualan kasut sekolah dalam sebulan', MU3, 17, halo=False)
add('12.1.4', 'CONTOH BERLANGKAH', 'Stok kasut: guna mod',
    P('Carta palang menunjukkan jualan kasut sekolah mengikut saiz. Pemilik kedai ingin menambah stok bagi saiz yang paling laris. Sukatan manakah yang sesuai?', True)
    + STEPS(['Pemilik ingin tahu saiz yang paling <b>kerap</b> dibeli.',
             'Saiz 7 mempunyai jualan tertinggi (22 pasang).',
             'Min saiz (kira-kira 6.88) bukan saiz kasut yang wujud.'], col)
    + ANS(f'{B("Mod", MODC)} = saiz 7'),
    svg(fig, 'Carta palang jualan kasut mengikut saiz dengan saiz 7 paling laris'))
assert num(F(sum(s * f for s, f in zip(SZ, FZ)), 57)) == '6.88'

# 4 Plot batang-dan-daun
SL = [42, 47, 51, 55, 56, 58, 63, 63, 63, 82]
assert mod(SL) == [63] and med(SL) == 57 and mean(SL) == 58 and sum(SL) == 580
stems = {}
for v in SL: stems.setdefault(v // 10, []).append(v % 10)
fig = RECT(14, 14, 472, 442) + T(250, 46, 'Markah ujian 10 orang murid', MU3, 18, halo=False)
fig += T(150, 92, 'Batang', MU, 17, halo=False) + T(300, 92, 'Daun', MU, 17, halo=False)
fig += LINE((200, 110), (200, 110 + 5 * 50), MU, 3) + LINE((100, 110), (440, 110), BD, 2)
cnt = 0
for i, s_ in enumerate(range(4, 9)):
    y = 136 + i * 50
    fig += T(150, y, str(s_), TX, 22, halo=False)
    for j, lf in enumerate(stems.get(s_, [])):
        cnt += 1
        v = s_ * 10 + lf
        cl = MODC if v == 63 else (MEDC if cnt in (5, 6) else TX)
        fig += T(232 + j * 36, y, str(lf), cl, 22, halo=False)
fig += T(250, 412, 'Kekunci: 4 | 2 bermaksud 42 markah', MU3, 17, halo=False)
add('12.1.4', 'PERWAKILAN DATA', 'Plot batang-dan-daun',
    P('Plot batang-dan-daun menunjukkan markah ujian 10 orang murid. Data sudah tersusun.', True)
    + STEPS([f'{MOD_} = 63 (daun 3 muncul tiga kali pada batang 6).',
             f'{MED_} = purata data ke-5 dan ke-6 = (56 + 58) ÷ 2 = 57.',
             f'{MIN_} = 580 ÷ 10 = 58.'], col)
    + NOTE('Sentiasa baca <b>kekunci</b>: batang ialah digit puluh, daun ialah digit sa.'),
    svg(fig, 'Plot batang-dan-daun markah 42 hingga 82 dengan mod 63'))

# 5 Penyelesaian masalah: sasaran min
n_, m_, tgt = 4, 70, 74
need = (n_ + 1) * tgt - n_ * m_
assert need == 90
MK = [64, 72, 68, 76]
assert mean(MK) == 70 and mean(MK + [need]) == 74
fig, Y = BARS(['U1', 'U2', 'U3', 'U4', 'U5'], MK + [need], (70, 70, 470, 380), 100, 20, {4: PA}, 'Markah', 'Ujian', vlab=True)
fig += LINE((70, Y(74)), (470, Y(74)), MINC, 4, '9 6')
fig += T(270, 26, 'Markah Aisyah', MU3, 17, halo=False) + T(270, 50, '- - sasaran min 74', MINC, 16, halo=False)
add('12.1.4', 'PENYELESAIAN MASALAH', 'Mencapai sasaran min',
    P('Min markah Aisyah bagi 4 ujian ialah 70. Berapakah markah yang perlu diperolehnya dalam ujian ke-5 supaya min 5 ujian menjadi 74?', True)
    + STEPS(['Jumlah markah 4 ujian = 4 × 70 = 280',
             'Jumlah markah 5 ujian yang diperlukan = 5 × 74 = 370',
             'Markah ujian ke-5 = 370 − 280 = 90'], col)
    + ANS('Aisyah perlu mendapat <b>90 markah</b>')
    + NOTE('Strategi: tukar min kepada <b>jumlah</b> dahulu (jumlah = min × bilangan).'),
    svg(fig, 'Carta palang markah Aisyah 64, 72, 68, 76 dan 90 dengan sasaran min 74'))

# 6 Membuat kesimpulan: min gabungan
na, ma, nb, mb = 30, 65, 20, 70
assert F(na * ma + nb * mb, na + nb) == 67 and na * ma == 1950 and nb * mb == 1400
fig = RECT(14, 14, 472, 442)
fig += RECT(40, 50, 190, 150, f'{TR}22', TR, 16, 2.5) + T(135, 84, 'Kelas A', TR, 21) + T(135, 124, '30 murid', TX, 18, halo=False) + T(135, 160, 'min 65', TX, 20, halo=False)
fig += RECT(270, 50, 190, 150, f'{PA}22', PA, 16, 2.5) + T(365, 84, 'Kelas B', PA, 21) + T(365, 124, '20 murid', TX, 18, halo=False) + T(365, 160, 'min 70', TX, 20, halo=False)
fig += ARROW((135, 208), (220, 262), MU, 3) + ARROW((365, 208), (280, 262), MU, 3)
fig += RECT(90, 270, 320, 160, f'{GR}1A', GR, 16, 2.5)
fig += T(250, 304, 'Gabungan 50 murid', GR, 20)
fig += T(250, 344, '1950 + 1400 = 3350', TX, 18, halo=False)
fig += T(250, 388, 'min = 3350 ÷ 50 = 67', GR, 21)
add('12.1.4', 'MEMBUAT KESIMPULAN', 'Min gabungan dua kumpulan',
    P('Min markah 30 orang murid Kelas A ialah 65. Min markah 20 orang murid Kelas B ialah 70. Cari min markah semua murid.', True)
    + STEPS(['Jumlah A = 30 × 65 = 1950; jumlah B = 20 × 70 = 1400',
             'Min gabungan = (1950 + 1400) ÷ 50 = 67'], col)
    + ANS('Min gabungan = <b>67</b>')
    + NOTE('Min gabungan <b>bukan</b> (65 + 70) ÷ 2 = 67.5, kerana bilangan murid berbeza. Min 67 lebih dekat dengan 65 kerana Kelas A lebih ramai.'),
    svg(fig, 'Kelas A 30 murid min 65 dan Kelas B 20 murid min 70 bergabung menjadi min 67'))

# 7 Ringkasan bab
fig = ''
RS = [('Mod', MODC, 'nilai paling kerap', 'jadual: nilai x dengan f tertinggi'),
      ('Median', MEDC, 'nilai tengah selepas disusun', 'n genap: purata dua nilai tengah'),
      ('Min', MINC, 'hasil tambah ÷ bilangan', 'jadual: Σfx ÷ Σf'),
      ('Kelas mod', PU, 'kelas dengan f tertinggi', 'data terkumpul: x = titik tengah')]
for i, (nm, cl, a, b) in enumerate(RS):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, cl, 16, 2)
    fig += T(36, y0 + 32, nm, cl, 21, 'start', halo=False)
    fig += T(36, y0 + 66, a, TX, 17, 'start', 600, halo=False)
    fig += T(466, y0 + 32, b, MU, 15, 'end', 600, halo=False)
add('12.1.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Rumus / peraturan'],
          [['Min', FR('hasil tambah nilai data', 'bilangan data') + ' atau ' + FR(f'{SIG}<i>fx</i>', f'{SIG}<i>f</i>')],
           ['Median', 'nilai tengah data tersusun'],
           ['Mod', 'nilai paling kerap'],
           ['Jumlah data', 'min × bilangan data']], col, rv=True)
    + BUL(['Nilai ekstrem → pilih median. Data kategori → pilih mod.'], col),
    svg(fig, 'Ringkasan mod, median, min dan kelas mod'))

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
assert counts == {'12.1.1': 7, '12.1.2': 6, '12.1.3': 6, '12.1.4': 7}, counts

js = ('/* Dijana oleh tools/kecenderungan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
