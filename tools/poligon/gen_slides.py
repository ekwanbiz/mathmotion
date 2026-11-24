# Penjana slaid NOTA POLIGON (Tingkatan 2 Bab 4 Poligon) -> poligon/slides.js
# Jalankan:  python3 tools/poligon/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, random

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'poligon', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '4.1': ('Poligon Sekata', C['tr']),
    '4.2': ('Sudut Pedalaman & Peluaran', C['pa']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
INC, EXC = AM, PK      # warna tetap: sudut pedalaman (kuning), sudut peluaran (merah jambu)

# ---------- semakan matematik ----------
NAMA = {3: 'Segi tiga', 4: 'Sisi empat', 5: 'Pentagon', 6: 'Heksagon', 7: 'Heptagon', 8: 'Oktagon', 9: 'Nonagon', 10: 'Dekagon'}
def jum(n): return (n - 2) * 180
def ped(n):
    v = jum(n) / n; assert v == int(v), n; return int(v)
def pel(n):
    v = 360 / n; assert v == int(v), n; return int(v)
for n in (3, 4, 5, 6, 8, 9, 10, 12):
    assert ped(n) + pel(n) == 180 and pel(n) * n == 360 and ped(n) * n == jum(n)

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
def TABLE(head, rows, col, rv=False, fs=19):
    th = ''.join(f'<th style="padding: 8px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 7px 12px; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
SUMF = '(<i>n</i> − 2) × 180°'

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
def POLY(pts, fill, stroke='none', sw=0, dash=None):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"{d}/>'
def CIRC(c, r, col=MU, sw=2.5, fill='none', dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(c[0])}" cy="{r1(c[1])}" r="{r1(r)}" fill="{fill}" stroke="{col}" stroke-width="{sw}"{d}/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

def reg(cx, cy, r, n, rot=-90):
    """Bucu poligon sekata (koordinat skrin, y ke bawah)."""
    return [(cx + r * math.cos(math.radians(rot + 360 * i / n)), cy + r * math.sin(math.radians(rot + 360 * i / n))) for i in range(n)]
def unit(p, q):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    return (dx / L, dy / L)
def add(p, v, k=1): return (p[0] + v[0] * k, p[1] + v[1] * k)
def ARC(V, A, Bp, r, col, sw=3, fill=None, rect=False):
    """Lengkok sudut di V antara arah VA dan VB (sudut < 180°)."""
    u1, u2 = unit(V, A), unit(V, Bp)
    a1, a2 = math.atan2(u1[1], u1[0]), math.atan2(u2[1], u2[0])
    d = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    sweep = 1 if d > 0 else 0
    p1, p2 = add(V, u1, r), add(V, u2, r)
    if rect:
        c = add(p1, u2, r)
        return f'<path d="M{r1(p1[0])} {r1(p1[1])} L{r1(c[0])} {r1(c[1])} L{r1(p2[0])} {r1(p2[1])}" fill="none" stroke="{col}" stroke-width="{sw}"/>'
    fl = f'{col}33' if fill else 'none'
    pre = f'M{r1(V[0])} {r1(V[1])} L' if fill else 'M'
    post = ' Z' if fill else ''
    return f'<path d="{pre}{r1(p1[0])} {r1(p1[1])} A{r} {r} 0 0 {sweep} {r1(p2[0])} {r1(p2[1])}{post}" fill="{fl}" stroke="{col}" stroke-width="{sw}"/>'
def bis(V, A, Bp):
    u1, u2 = unit(V, A), unit(V, Bp); b = (u1[0] + u2[0], u1[1] + u2[1]); L = math.hypot(*b) or 1
    return (b[0] / L, b[1] / L)
def ALAB(V, A, Bp, t, col, k=40, size=18):
    b = bis(V, A, Bp); return T(V[0] + b[0] * k, V[1] + b[1] * k, t, col, size)
def SIDETICK(p, q, col=TX, n=1, k=8):
    m = ((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); u = unit(p, q); nv = (-u[1], u[0]); s = ''
    for i in range(n):
        o = (i - (n - 1) / 2) * 6; c = add(m, u, o)
        s += LINE(add(c, nv, -k), add(c, nv, k), col, 2.5)
    return s
def angle_at(V, A, Bp):
    u1, u2 = unit(V, A), unit(V, Bp)
    return math.degrees(math.acos(max(-1, min(1, u1[0] * u2[0] + u1[1] * u2[1]))))

def poly_angles(angles, box, seed=1):
    """Poligon cembung dengan sudut pedalaman yang diberi (darjah), dimuatkan dalam kotak (L, T, R, B)."""
    n = len(angles); assert sum(angles) == jum(n)
    rnd = random.Random(seed)
    ext = [180 - a for a in angles]
    th = [math.radians(sum(ext[1:k + 1])) for k in range(n)]
    u = [(math.cos(t), math.sin(t)) for t in th]
    for _ in range(2000):
        L = [rnd.uniform(0.75, 1.25) for _ in range(n - 2)]
        sx = sum(L[k] * u[k][0] for k in range(n - 2)); sy = sum(L[k] * u[k][1] for k in range(n - 2))
        a, b, c, d = u[n - 2][0], u[n - 1][0], u[n - 2][1], u[n - 1][1]
        det = a * d - b * c
        if abs(det) < 1e-9: continue
        x = (-sx * d + sy * b) / det; y = (-a * sy + c * sx) / det
        if 0.6 < x < 1.5 and 0.6 < y < 1.5:
            L += [x, y]; break
    else:
        raise ValueError('tiada poligon')
    pts = [(0.0, 0.0)]
    for k in range(n - 1):
        pts.append((pts[-1][0] + L[k] * u[k][0], pts[-1][1] - L[k] * u[k][1]))   # y skrin
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    l, t, r, bm = box
    s = min((r - l) / (max(xs) - min(xs)), (bm - t) / (max(ys) - min(ys)))
    ox = (l + r) / 2 - s * (max(xs) + min(xs)) / 2; oy = (t + bm) / 2 - s * (max(ys) + min(ys)) / 2
    pts = [(ox + s * x, oy + s * y) for x, y in pts]
    for i in range(n):   # semak sudut sebenar
        got = angle_at(pts[i], pts[i - 1], pts[(i + 1) % n])
        assert abs(got - angles[i]) < 0.01, (got, angles[i])
    return pts

# ---------- slaid ----------
S = []
def slide(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 4.1 POLIGON SEKATA =====================
col = SUB['4.1'][1]

# 4.1-1 Definisi
fig = RECT(14, 14, 472, 442)
pr = reg(135, 210, 100, 5)
fig += POLY(pr, f'{TR}26', TR, 5)
for i in range(5):
    fig += SIDETICK(pr[i], pr[(i + 1) % 5], TX)
    fig += ARC(pr[i], pr[i - 1], pr[(i + 1) % 5], 20, AM, 3)
pi_ = [(300, 300), (330, 150), (420, 118), (470, 230), (430, 320)]
fig += POLY(pi_, f'{PA}26', PA, 5)
fig += T(135, 355, 'Poligon sekata', TR, 21) + T(135, 385, 'sisi sama · sudut sama', MU, 17, halo=False)
fig += T(385, 355, 'Poligon tak sekata', PA, 21) + T(385, 385, 'sisi & sudut berbeza', MU, 17, halo=False)
fig += TICK(135, 425, GR) + CROSS(385, 425)
fig += T(250, 52, 'Garis kecil = sisi sama panjang · lengkok = sudut sama', MU3, 16, halo=False)
slide('4.1', 'DEFINISI', 'Apa itu poligon sekata?',
      DEF('<b>Poligon</b> ialah bentuk dua dimensi yang tertutup dan dibatasi oleh tiga atau lebih <b>garis lurus</b> (sisi).', col)
      + DEF('<b>Poligon sekata</b> ialah poligon yang <b>semua sisinya sama panjang</b> dan <b>semua sudut pedalamannya sama besar</b>.', col)
      + BUL(['Bucu: titik pertemuan dua sisi.', 'Poligon <i>n</i> sisi mempunyai <i>n</i> bucu dan <i>n</i> sudut pedalaman.'], col)
      + NOTE('Kedua-dua syarat (sisi sama <b>dan</b> sudut sama) mesti dipenuhi.'),
      svg(fig, 'Pentagon sekata berbanding pentagon tak sekata'))

# 4.1-2 Nama poligon
rows = [[str(n), NAMA[n], ('Segi tiga sama sisi' if n == 3 else 'Segi empat sama' if n == 4 else f'{NAMA[n]} sekata')] for n in range(3, 11)]
fig = ''
cols4 = [TR, PA, PU, AM, GR, PK, RD, TR]
for k, n in enumerate(range(3, 11)):
    cx = 70 + (k % 4) * 120; cy = 110 + (k // 4) * 230
    fig += RECT(cx - 56, cy - 92, 112, 200, SURF, BD, 16, 2)
    pts = reg(cx, cy - 8, 44, n, -90 if n % 2 else -90 + 180 / n)
    fig += POLY(pts, f'{cols4[k]}33', cols4[k], 4)
    fig += T(cx, cy + 62, NAMA[n] if n > 4 else ('Segi tiga' if n == 3 else 'Segi empat sama'), TX, 15 if n == 4 else 17)
    fig += T(cx, cy + 88, f'{n} sisi', MU, 15, halo=False)
slide('4.1', 'NAMA POLIGON', 'Nama poligon mengikut bilangan sisi',
      TABLE(['Sisi', 'Nama poligon', 'Poligon sekata'], rows, col, fs=17)
      + NOTE('Nama poligon ditentukan oleh <b>bilangan sisi</b>, bukan saiznya.'),
      svg(fig, 'Poligon sekata 3 hingga 10 sisi'))

# 4.1-3 Paksi simetri
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
p5 = reg(129, 220, 90, 5)
for i in range(5):
    opp = ((p5[(i + 2) % 5][0] + p5[(i + 3) % 5][0]) / 2, (p5[(i + 2) % 5][1] + p5[(i + 3) % 5][1]) / 2)
    u = unit(p5[i], opp)
    fig += LINE(add(p5[i], u, -14), add(opp, u, 14), PU, 2.5, '7 6')
fig += POLY(p5, f'{TR}22', TR, 4.5)
fig += T(129, 360, 'Pentagon sekata', TX, 19) + T(129, 392, '5 paksi simetri', PU, 20)
fig += T(129, 425, 'bucu → tengah sisi', MU, 15, halo=False)
p6 = reg(371, 220, 88, 6)
for i in range(3):
    fig += LINE(add(p6[i], unit(p6[i], p6[i + 3]), -14), add(p6[i + 3], unit(p6[i], p6[i + 3]), 14), PU, 2.5, '7 6')
    m1 = ((p6[i][0] + p6[i + 1][0]) / 2, (p6[i][1] + p6[i + 1][1]) / 2)
    m2 = ((p6[i + 3][0] + p6[(i + 4) % 6][0]) / 2, (p6[i + 3][1] + p6[(i + 4) % 6][1]) / 2)
    fig += LINE(add(m1, unit(m1, m2), -16), add(m2, unit(m1, m2), 16), GR, 2.5, '7 6')
fig += POLY(p6, f'{TR}22', TR, 4.5)
fig += T(371, 360, 'Heksagon sekata', TX, 19) + T(371, 392, '6 paksi simetri', PU, 20)
fig += T(371, 425, 'bucu–bucu · sisi–sisi', MU, 15, halo=False)
assert len(p5) == 5 and len(p6) == 6
slide('4.1', 'SIFAT GEOMETRI', 'Paksi simetri poligon sekata',
      DEF('Poligon sekata dengan <i>n</i> sisi mempunyai <b><i>n</i> paksi simetri</b>.', col)
      + BUL([f'{B("n ganjil", PU)}: setiap paksi melalui satu bucu dan titik tengah sisi bertentangan.',
             f'{B("n genap", GR)}: paksi melalui dua bucu bertentangan <b>atau</b> titik tengah dua sisi bertentangan.'], col)
      + TABLE(['Poligon sekata', 'Paksi simetri'], [['Segi tiga sama sisi', '3'], ['Segi empat sama', '4'], ['Oktagon sekata', '8']], col, fs=17)
      + NOTE('Poligon tak sekata biasanya mempunyai <b>kurang</b> paksi simetri, atau tiada langsung.'),
      svg(fig, 'Paksi simetri pentagon sekata dan heksagon sekata'))

# 4.1-4 Membina dengan protraktor (sudut pusat)
n = 5; sp = 360 // n; assert sp == 72 and sp * n == 360
O = (250, 240); R = 165
pts = reg(O[0], O[1], R, n, -90)
fig = CIRC(O, R, MU2, 2.5, dash='8 7')
for i, p in enumerate(pts):
    fig += LINE(O, p, MU, 2.5)
fig += ARC(O, pts[0], pts[1], 46, AM, 4, fill=True)
fig += ALAB(O, pts[0], pts[1], '72°', AM, 70, 21)
fig += POLY(pts, f'{TR}1F', TR, 5)
for i, p in enumerate(pts):
    fig += DOT(p, TR)
    v = unit(O, p); fig += T(p[0] + v[0] * 24, p[1] + v[1] * 24, 'ABCDE'[i], TX, 19)
fig += DOT(O, TX, 5) + T(O[0] - 4, O[1] + 24, 'O', MU3, 18)
fig += T(250, 448, 'Sudut pusat = 360° ÷ 5 = 72°', AM, 20, halo=False)
slide('4.1', 'MEMBINA', 'Membina pentagon sekata (protraktor)',
      P('Bina pentagon sekata dalam bulatan berpusat O.', True)
      + STEPS(['Lukis sebuah bulatan berpusat O dan satu jejari OA.',
               f'Hitung sudut pusat: 360° ÷ 5 = <b>{sp}°</b>.',
               f'Guna protraktor, ukur {sp}° dari OA untuk mendapat B. Ulang untuk C, D dan E.',
               'Sambungkan A, B, C, D dan E dengan pembaris.'], col)
      + NOTE(f'Sudut pusat poligon sekata <i>n</i> sisi = 360° ÷ <i>n</i>. Semua jejari sama panjang, jadi semua sisi sama panjang.'),
      svg(fig, 'Pembinaan pentagon sekata dengan sudut pusat 72 darjah'))

# 4.1-5 Membina heksagon dengan jangka lukis
O = (250, 225); R = 150
h6 = reg(O[0], O[1], R, 6, 180)
fig = CIRC(O, R, MU2, 2.5, dash='8 7')
for i in range(6):
    a = math.atan2(h6[i][1] - O[1], h6[i][0] - O[0])
    nx = h6[(i + 1) % 6]
    # lengkok kecil jangka lukis berpusat di bucu i, melalui bucu i+1
    ang = math.atan2(nx[1] - h6[i][1], nx[0] - h6[i][0])
    p1 = (h6[i][0] + R * math.cos(ang - 0.16), h6[i][1] + R * math.sin(ang - 0.16))
    p2 = (h6[i][0] + R * math.cos(ang + 0.16), h6[i][1] + R * math.sin(ang + 0.16))
    fig += f'<path d="M{r1(p1[0])} {r1(p1[1])} A{R} {R} 0 0 1 {r1(p2[0])} {r1(p2[1])}" fill="none" stroke="{PK}" stroke-width="3"/>'
fig += POLY([O, h6[0], h6[1]], f'{AM}2E', AM, 3)
fig += POLY(h6, 'none', TR, 5)
for i, p in enumerate(h6):
    fig += DOT(p, TR); v = unit(O, p); fig += T(p[0] + v[0] * 26, p[1] + v[1] * 26, 'ABCDEF'[i], TX, 19)
fig += DOT(O, TX, 5) + T(O[0] + 2, O[1] + 24, 'O', MU3, 18)
fig += T(250, 420, 'OA = OB = AB = jejari', AM, 19, halo=False)
fig += T(250, 448, '∆OAB sama sisi → sudut pusat 60°', MU3, 18, halo=False)
assert abs(math.dist(h6[0], h6[1]) - R) < 1e-6 and 6 * 60 == 360
slide('4.1', 'MEMBINA', 'Membina heksagon sekata (jangka lukis)',
      STEPS(['Lukis bulatan berpusat O dengan jejari <i>j</i>. Tandakan titik A pada bulatan.',
             'Tanpa mengubah bukaan jangka lukis, letakkan jarumnya di A dan buat lengkok yang memotong bulatan di B.',
             'Ulang dari B, C, D dan E untuk mendapat C, D, E dan F.',
             'Sambungkan A, B, C, D, E dan F.'], col)
      + BUL(['Sebab: OA = OB = AB = <i>j</i>, jadi ∆OAB sama sisi dan ∠AOB = 60°. 6 × 60° = 360°.',
             'Sambungkan bucu <b>berselang</b> (A, C, E) untuk mendapat segi tiga sama sisi.'], col),
      svg(fig, 'Pembinaan heksagon sekata dengan jangka lukis'))

# 4.1-6 Kesilapan biasa
fig = ''
# rombus
rh = [(40, 130), (110, 60), (210, 60), (140, 130)]
fig += RECT(14, 14, 230, 210) + POLY(rh, f'{PA}26', PA, 4)
for i in range(4): fig += SIDETICK(rh[i], rh[(i + 1) % 4], TX)
fig += T(129, 165, 'Rombus', TX, 19) + T(129, 195, 'sisi sama, sudut tidak', RD, 15, halo=False) + CROSS(222, 40)
# segi empat tepat
fig += RECT(256, 14, 230, 210) + POLY([(286, 60), (456, 60), (456, 130), (286, 130)], f'{PA}26', PA, 4)
for V, A_, B_ in [((286, 60), (456, 60), (286, 130)), ((456, 60), (286, 60), (456, 130)), ((456, 130), (456, 60), (286, 130)), ((286, 130), (286, 60), (456, 130))]:
    fig += ARC(V, A_, B_, 13, TX, 2.5, rect=True)
fig += T(371, 165, 'Segi empat tepat', TX, 19) + T(371, 195, 'sudut sama, sisi tidak', RD, 15, halo=False) + CROSS(464, 40)
# segi empat sama
sq = [(70, 262), (180, 262), (180, 372), (70, 372)]
fig += RECT(14, 240, 230, 216) + POLY(sq, f'{TR}26', TR, 4)
for i in range(4): fig += SIDETICK(sq[i], sq[(i + 1) % 4], TX)
fig += T(129, 400, 'Segi empat sama', TX, 19) + T(129, 428, 'sisi sama DAN sudut sama', GR, 15, halo=False) + TICK(220, 266)
# sudut pusat vs pedalaman
O = (371, 330); hx = reg(371, 330, 70, 6, 180)
fig += RECT(256, 240, 230, 216) + POLY(hx, f'{TR}1A', TR, 3.5) + LINE(O, hx[0], MU, 2.5) + LINE(O, hx[1], MU, 2.5)
fig += ARC(O, hx[0], hx[1], 22, PU, 3) + T(371, 290, '60°', PU, 16)
fig += ARC(hx[0], hx[5], hx[1], 20, AM, 3) + T(hx[0][0] + 34, hx[0][1], '120°', AM, 16, 'start')
fig += T(371, 428, 'pusat ≠ pedalaman', RD, 16, halo=False)
slide('4.1', 'KESILAPAN BIASA', 'Jangan terkeliru',
      BUL([f'{B("Rombus", RD)} sisinya sama panjang tetapi sudutnya tidak sama ✗ → <b>bukan</b> poligon sekata.',
           f'{B("Segi empat tepat", RD)} sudutnya sama (90°) tetapi sisinya tidak sama ✗ → <b>bukan</b> poligon sekata.',
           f'{B("Tertukar sudut", RD)}: sudut pusat (360° ÷ <i>n</i>) <b>bukan</b> sudut pedalaman ✗.',
           f'{B("Paksi simetri", RD)}: segi empat sama ada <b>4</b> paksi, bukan 2 ✗.'], col),
      svg(fig, 'Rombus, segi empat tepat, segi empat sama dan sudut pusat heksagon'))

# 4.1-7 Ringkasan
O = (250, 215); h6 = reg(O[0], O[1], 150, 6, -90)
fig = ''
for i in range(3):
    u = unit(h6[i], h6[i + 3]); fig += LINE(add(h6[i], u, -16), add(h6[i + 3], u, 16), PU, 2, '6 6')
fig += POLY(h6, f'{TR}1F', TR, 5)
for i in range(6): fig += SIDETICK(h6[i], h6[(i + 1) % 6], TX)
fig += LINE(O, h6[1], MU, 2.5) + LINE(O, h6[2], MU, 2.5) + ARC(O, h6[1], h6[2], 34, PU, 3) + ALAB(O, h6[1], h6[2], '60°', PU, 56, 17)
fig += ARC(h6[4], h6[3], h6[5], 24, AM, 3.5) + ALAB(h6[4], h6[3], h6[5], '120°', AM, 50, 17)
fig += T(250, 405, '6 sisi sama · 6 sudut sama', TX, 19, halo=False)
fig += T(250, 438, '6 paksi simetri · sudut pusat 60°', MU3, 18, halo=False)
slide('4.1', 'RINGKASAN', 'Ringkasan poligon sekata',
      TABLE(['Sifat', 'Poligon sekata <i>n</i> sisi'],
            [['Sisi', 'semua sama panjang'], ['Sudut pedalaman', 'semua sama besar'],
             ['Paksi simetri', '<i>n</i>'], ['Sudut pusat (untuk bina)', '360° ÷ <i>n</i>']], col, rv=True, fs=18)
      + BUL(['Bina dengan protraktor (sudut pusat) atau jangka lukis (heksagon, segi tiga sama sisi).'], col),
      svg(fig, 'Ringkasan sifat heksagon sekata'))

# ===================== 4.2 SUDUT PEDALAMAN & PELUARAN =====================
col = SUB['4.2'][1]

# 4.2-1 Definisi
ang = [110, 95, 120, 100, 115]
pp = poly_angles(ang, (60, 70, 380, 400), seed=3)
k = 2   # bucu ditunjukkan
V, Pv, Nx = pp[k], pp[k - 1], pp[(k + 1) % 5]
ext_end = add(V, unit(Pv, V), 110)
fig = POLY(pp, f'{TR}1A', TR, 5) + LINE(V, ext_end, MU, 3, '8 6')
fig += ARC(V, Pv, Nx, 34, INC, 4, fill=True) + ARC(V, ext_end, Nx, 30, EXC, 4, fill=True)
fig += ALAB(V, Pv, Nx, f'{ang[k]}°', INC, 62, 20) + ALAB(V, ext_end, Nx, f'{180 - ang[k]}°', EXC, 58, 20)
fig += T(ext_end[0], ext_end[1] + (22 if ext_end[1] > V[1] else -18), 'sisi dipanjangkan', MU, 15, halo=False)
fig += T(250, 438, f'{ang[k]}° + {180 - ang[k]}° = 180°', TX, 21, halo=False)
assert ang[k] + (180 - ang[k]) == 180
slide('4.2', 'DEFINISI', 'Sudut pedalaman dan sudut peluaran',
      DEF(f'{B("Sudut pedalaman", INC)}: sudut di <b>dalam</b> poligon yang dibentuk oleh dua sisi bersebelahan.', col)
      + DEF(f'{B("Sudut peluaran", EXC)}: sudut di <b>luar</b> poligon antara satu sisi dengan sisi bersebelahan yang <b>dipanjangkan</b>.', col)
      + P('Pada setiap bucu, kedua-dua sudut terletak pada satu garis lurus:')
      + ANS('sudut pedalaman + sudut peluaran = 180°'),
      svg(fig, 'Sudut pedalaman 120 darjah dan sudut peluaran 60 darjah pada satu bucu pentagon'))

# 4.2-2 Hasil tambah sudut pedalaman
h6 = poly_angles([130, 110, 125, 120, 115, 120], (40, 40, 460, 350), seed=7)
fig = ''
tc = [TR, PA, GR, PU]
for i in range(1, 5):
    fig += POLY([h6[0], h6[i], h6[i + 1]], f'{tc[i - 1]}38', tc[i - 1], 2.5)
    c = ((h6[0][0] + h6[i][0] + h6[i + 1][0]) / 3, (h6[0][1] + h6[i][1] + h6[i + 1][1]) / 3)
    fig += T(c[0], c[1], '180°', tc[i - 1], 18)
fig += POLY(h6, 'none', TX, 4.5) + DOT(h6[0], AM, 8)
fig += T(250, 400, '6 sisi → 4 segi tiga', TX, 20, halo=False)
fig += T(250, 436, '4 × 180° = 720°', AM, 22, halo=False)
assert jum(6) == 720
rows = [[str(n), str(n - 2), f'{n - 2} × 180° = {jum(n)}°'] for n in (3, 4, 5, 6)] + [['<i>n</i>', '<i>n</i> − 2', SUMF]]
slide('4.2', 'RUMUS', 'Hasil tambah sudut pedalaman',
      P('Lukis pepenjuru dari <b>satu bucu</b>. Poligon terbahagi kepada segi tiga, dan setiap segi tiga ada 180°.', True)
      + TABLE(['Sisi', 'Segi tiga', 'Hasil tambah sudut'], rows, col, rv=True, fs=17)
      + DEF(f'Hasil tambah sudut pedalaman = {SUMF}', col),
      svg(fig, 'Heksagon dibahagi kepada empat segi tiga dari satu bucu'))

# 4.2-3 Contoh cari sudut
ang = [120, 135, 110, 125, 100, 130]
assert sum(ang) == jum(6) and jum(6) - sum(ang[:5]) == 130
hp = poly_angles(ang, (40, 30, 460, 420), seed=11)
fig = POLY(hp, f'{TR}1A', TR, 5)
for i, a in enumerate(ang):
    fig += ARC(hp[i], hp[i - 1], hp[(i + 1) % 6], 26, INC if i < 5 else PK, 3)
    fig += ALAB(hp[i], hp[i - 1], hp[(i + 1) % 6], f'{a}°' if i < 5 else '<tspan font-style="italic">x</tspan>', INC if i < 5 else PK, 54, 19)
slide('4.2', 'CONTOH BERLANGKAH', 'Mencari sudut yang tidak diketahui',
      P('Rajah menunjukkan sebuah heksagon. Cari nilai <i>x</i>.', True)
      + STEPS(['Hasil tambah sudut pedalaman heksagon = (6 − 2) × 180° = 720°',
               '120° + 135° + 110° + 125° + 100° = 590°',
               '<i>x</i> = 720° − 590° = 130°'], col)
      + ANS('<i>x</i> = 130°')
      + NOTE('Kira bilangan sisi dahulu, kemudian guna (<i>n</i> − 2) × 180°.'),
      svg(fig, 'Heksagon dengan lima sudut diberi dan satu sudut x'))

# 4.2-4 Hasil tambah sudut peluaran
ext = [80, 65, 70, 75, 70]
assert sum(ext) == 360 and 360 - sum(ext[:4]) == 70
ang = [180 - e for e in ext]
pp = poly_angles(ang, (90, 70, 380, 360), seed=5)
fig = POLY(pp, f'{TR}1A', TR, 4.5)
for i in range(5):
    V, Pv, Nx = pp[i], pp[i - 1], pp[(i + 1) % 5]
    e = add(V, unit(Pv, V), 70)
    fig += LINE(V, e, MU, 2.5, '7 6') + ARC(V, e, Nx, 26, EXC, 3.5, fill=True)
    fig += ALAB(V, e, Nx, f'{ext[i]}°' if i < 4 else '<tspan font-style="italic">y</tspan>', EXC if i < 4 else AM, 48, 18)
fig += T(250, 446, 'Jumlah semua sudut peluaran = 360°', TX, 19, halo=False)
slide('4.2', 'RUMUS', 'Hasil tambah sudut peluaran',
      DEF('Hasil tambah sudut peluaran bagi <b>semua</b> poligon = <b>360°</b>', col)
      + P(f'Sebab: {B("n", TX)} × 180° − {SUMF} = 360°. Berjalan mengelilingi poligon, anda berpusing satu pusingan lengkap.', True)
      + STEPS(['80° + 65° + 70° + 75° + <i>y</i> = 360°', '290° + <i>y</i> = 360°', '<i>y</i> = 70°'], col)
      + ANS('<i>y</i> = 70°'),
      svg(fig, 'Pentagon dengan semua sudut peluaran'))

# 4.2-5 Poligon sekata + cari bilangan sisi
O = (250, 205); o8 = reg(O[0], O[1], 150, 8, -90 + 22.5)
fig = POLY(o8, f'{TR}1F', TR, 5)
V, Pv, Nx = o8[2], o8[1], o8[3]
e = add(V, unit(Pv, V), 90)
fig += LINE(V, e, MU, 3, '8 6') + ARC(V, Pv, Nx, 30, INC, 4, fill=True) + ARC(V, e, Nx, 28, EXC, 4, fill=True)
fig += ALAB(V, Pv, Nx, f'{ped(8)}°', INC, 58, 19) + ALAB(V, e, Nx, f'{pel(8)}°', EXC, 50, 19)
fig += T(250, 405, f'Oktagon sekata: 360° ÷ 8 = {pel(8)}°', EXC, 19, halo=False)
fig += T(250, 438, f'180° − {pel(8)}° = {ped(8)}°', INC, 19, halo=False)
assert pel(8) == 45 and ped(8) == 135 and 360 // 24 == 15 and 180 - 156 == 24
slide('4.2', 'POLIGON SEKATA', 'Sudut poligon sekata dan bilangan sisi',
      TABLE(['Sudut', 'Rumus poligon sekata'],
            [[B('Peluaran', EXC), f'360° ÷ <i>n</i>'], [B('Pedalaman', INC), f'{SUMF} ÷ <i>n</i>  atau  180° − peluaran'],
             ['Bilangan sisi', '<i>n</i> = 360° ÷ sudut peluaran']], col, fs=17)
      + P('Sudut pedalaman poligon sekata ialah 156°. Cari bilangan sisinya.', True)
      + STEPS(['Sudut peluaran = 180° − 156° = 24°', '<i>n</i> = 360° ÷ 24° = 15'], col)
      + ANS('15 sisi'),
      svg(fig, 'Oktagon sekata dengan sudut pedalaman 135 dan peluaran 45 darjah'))

# 4.2-6 Penyelesaian masalah: pentagon + heksagon berkongsi sisi
assert ped(5) == 108 and ped(6) == 120 and 360 - 108 - 120 == 132
A_ = (238, 120); B_ = (238, 245)   # sisi kongsi AB (menegak), panjang 125
s = 125
def build(Ap, Bp, n, side):
    """Poligon sekata pada sisi AB (side = +1 kanan, -1 kiri), bucu mengikut tertib dari B."""
    pts = [Ap, Bp]; d = unit(Ap, Bp); ext_ = 360 / n
    for _ in range(n - 2):
        a = math.atan2(d[1], d[0]) + side * math.radians(ext_)
        d = (math.cos(a), math.sin(a)); pts.append(add(pts[-1], d, s))
    return pts
pen = build(A_, B_, 5, -1)
hexa = build(A_, B_, 6, 1)
fig = POLY(pen, f'{PU}26', PU, 4.5) + POLY(hexa, f'{GR}22', GR, 4.5)
# sudut di B: antara sisi B->pen[2] dan B->hexa[2] (di luar kedua-dua poligon, di bawah)
fig += ARC(B_, pen[2], hexa[2], 30, PK, 4, fill=True)
fig += ALAB(B_, pen[2], hexa[2], '<tspan font-style="italic">x</tspan>', PK, 54, 22)
fig += ARC(B_, A_, pen[2], 24, AM, 3) + ALAB(B_, A_, pen[2], '108°', AM, 52, 16)
fig += ARC(B_, A_, hexa[2], 24, AM, 3) + ALAB(B_, A_, hexa[2], '120°', AM, 52, 16)
fig += DOT(A_, TX) + DOT(B_, TX) + T(A_[0], A_[1] - 22, 'A', TX, 19)
cp = (sum(x for x, _ in pen) / 5, sum(y for _, y in pen) / 5); ch = (sum(x for x, _ in hexa) / 6, sum(y for _, y in hexa) / 6)
fig += T(cp[0], cp[1], 'P', PU, 24) + T(ch[0], ch[1], 'Q', GR, 24)
fig += T(B_[0] + 14, B_[1] - 16, 'B', TX, 19, 'start')
fig += T(250, 440, 'Sudut pada titik B = 360°', MU3, 18, halo=False)
xs = [p[0] for p in pen + hexa]; ys = [p[1] for p in pen + hexa]
assert min(xs) > 14 and max(xs) < 486 and min(ys) > 14 and max(ys) < 456, (min(xs), max(xs), min(ys), max(ys))
assert abs(angle_at(B_, pen[2], hexa[2]) - 132) < 0.01
slide('4.2', 'PENYELESAIAN MASALAH', 'Dua poligon sekata berkongsi sisi',
      P('Rajah menunjukkan pentagon sekata P dan heksagon sekata Q yang berkongsi sisi AB. Cari nilai <i>x</i>.', True)
      + STEPS([f'Sudut pedalaman pentagon sekata = 540° ÷ 5 = 108°',
               f'Sudut pedalaman heksagon sekata = 720° ÷ 6 = 120°',
               'Sudut pada satu titik = 360°: <i>x</i> = 360° − 108° − 120° = 132°'], col)
      + ANS('<i>x</i> = 132°')
      + NOTE('Kenal pasti sudut pedalaman setiap poligon sekata dahulu, kemudian guna sifat sudut pada satu titik atau garis lurus.', 'Tip:'),
      svg(fig, 'Pentagon sekata dan heksagon sekata berkongsi sisi AB'))

# 4.2-7 Kesilapan biasa & ringkasan
fig = ''
CASES = [(48, 'Pentagon: 5 × 180° = 900°', False), (118, '(5 − 2) × 180° = 540°', True),
         (198, 'Sudut peluaran heksagon = 720°', False), (268, 'Peluaran semua poligon = 360°', True),
         (348, 'Pedalaman 140° → n = 360 ÷ 140', False), (418, 'Peluaran 40° → n = 360 ÷ 40 = 9', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
assert 180 - 140 == 40 and 360 // 40 == 9 and jum(5) == 540
slide('4.2', 'RINGKASAN', 'Kesilapan biasa & ringkasan',
      TABLE(['Perkara', 'Rumus'],
            [['Hasil tambah pedalaman', SUMF], ['Hasil tambah peluaran', '360°'],
             ['Pedalaman + peluaran', '180°'], ['Poligon sekata', 'peluaran = 360° ÷ <i>n</i>']], col, rv=True, fs=17)
      + BUL([f'{B("Jangan", RD)} darab <i>n</i> × 180°; tolak 2 dahulu.',
             f'{B("Jangan", RD)} bahagi 360° dengan sudut <b>pedalaman</b> untuk cari <i>n</i>.'], col),
      svg(fig, 'Contoh pengiraan salah dan betul'))

# ---------- tulis fail ----------
counts = {}
for s_ in S: counts[s_['sub']] = counts.get(s_['sub'], 0) + 1
out, idx = [], {}
for s_ in S:
    sub = s_['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s_['kicker'], 'title': s_['title'],
                'body': s_['body'], 'fig': s_['fig'] or '', 'full': s_['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and 'nan' not in re.sub(r'[a-z]nan|nan[a-z]', '', js_body)
assert counts == {'4.1': 7, '4.2': 7}, counts

js = ('/* Dijana oleh tools/poligon/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
