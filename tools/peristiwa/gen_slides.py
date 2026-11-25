# Penjana slaid NOTA PERISTIWA (Tingkatan 4 Bab 9 Kebarangkalian Peristiwa Bergabung) -> peristiwa/slides.js
# Jalankan:  python3 tools/peristiwa/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT, mathW
from fractions import Fraction as F
from itertools import product

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'peristiwa', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM Tingkatan 4 Bab 9: SK 9.1 - 9.4
SUB = {
    '9.1': ('Peristiwa Bergabung', C['tr']),
    '9.2': ('Bersandar dan Tak Bersandar', C['gr']),
    '9.3': ('Peristiwa Saling Eksklusif', C['pu']),
    '9.4': ('Aplikasi Peristiwa Bergabung', C['am']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
CA, CB = TR, PK      # warna tetap: peristiwa A (biru), peristiwa B (merah jambu)

# ---------- semakan matematik ----------
def fs(fr):
    """Pecahan -> teks a/b (termudah)."""
    fr = F(fr)
    t = str(abs(fr.numerator)) if fr.denominator == 1 else f'{abs(fr.numerator)}/{fr.denominator}'
    return ('−' if fr < 0 else '') + t
def ds(fr):
    """Pecahan berpenyebut kuasa 10 -> perpuluhan tepat."""
    fr = F(fr)
    for k in range(0, 7):
        v = fr * 10 ** k
        if v.denominator == 1:
            s = str(abs(v.numerator)).rjust(k + 1, '0')
            out = s if k == 0 else s[:-k] + '.' + s[-k:]
            return ('−' if fr < 0 else '') + out
    raise ValueError(fr)
D = lambda s: F(s)   # F('0.3') tepat

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
PI = 'P(<i>A</i> ∩ <i>B</i>)'
PU_ = 'P(<i>A</i> ∪ <i>B</i>)'
PA_ = 'P(<i>A</i>)'
PB_ = 'P(<i>B</i>)'

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T0(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')
def MIX(x, y, parts, col=TX, size=20, anchor='middle', halo=True):
    """Teks rajah bercampur: str, ('f', a, b) pecahan bertingkat, ('r', t[, n]) punca. y = garis tengah (garis pecahan)."""
    segs = []
    for p in parts:
        if isinstance(p, str):
            lead = (len(p) - len(p.lstrip(' '))) * size * .28; core = p.strip(' '); trail = (len(p) - len(p.rstrip(' '))) * size * .28 if core else 0
            segs.append(('s', core, lead, mathW(re.sub('[\u0300-\u036f]', '', core), size) if core else 0, trail))
        elif p[0] == 'f':
            segs.append(('f', p, size * .2, max(mathW(p[1], size), mathW(p[2], size)) + 10, size * .16))
        else:
            segs.append(('r', p, 0, size * .62 + mathW(p[1], size) + 4, size * .1))
    tot = sum(a + w + b for _, _, a, w, b in segs)
    cx = x if anchor == 'start' else (x - tot if anchor == 'end' else x - tot / 2)
    out = ''
    for i, (k, v, a, w, b) in enumerate(segs):
        cx += a
        if k == 's' and v and i == 0 and len(segs) > 1 and anchor != 'start': out += T0(cx + w, y, v, col, size, 'end', halo=halo)  # rapat dengan pecahan/punca selepasnya
        elif k == 's' and v: out += T0(cx, y, v, col, size, 'start', halo=halo)
        elif k == 'f': out += SFR(cx, y, v[1], v[2], col, size, 'start')
        elif k == 'r': out += SRT(cx, y + size * .35, v[1], col, size, 'start', v[2] if len(v) > 2 else None)
        cx += w + b
    return out
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    """Teks rajah; a/b nombor dilukis sebagai pecahan bertingkat."""
    if '<' in str(t) or not re.search(r'\d+/\d+', str(t)):
        return T0(x, y, t, col, size, anchor, weight, italic, halo)
    parts = [p if i % 2 == 0 else ('f',) + tuple(p.split('/')) for i, p in enumerate(re.split(r'(\d+/\d+)', str(t)))]
    return MIX(x, y, [p for p in parts if p != ''], col, size, anchor, halo)
def HASF(t): return bool(re.search(r'\d+/\d+', str(t)))
def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'
def CIRC(cx, cy, r, fill, stroke, sw=3):
    return f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{r1(r)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
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

PIPS = {1: [(0, 0)], 2: [(-1, -1), (1, 1)], 3: [(-1, -1), (0, 0), (1, 1)], 4: [(-1, -1), (1, -1), (-1, 1), (1, 1)],
        5: [(-1, -1), (1, -1), (0, 0), (-1, 1), (1, 1)], 6: [(-1, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (1, 1)]}
def DIE(x, y, s, v, col=TR):
    o = RECT(x, y, s, s, SURF, col, s * 0.18, 3.5)
    for dx, dy in PIPS[v]:
        o += f'<circle cx="{r1(x + s / 2 + dx * s * 0.27)}" cy="{r1(y + s / 2 + dy * s * 0.27)}" r="{r1(s * 0.09)}" fill="{TX}"/>'
    return o
def COIN(cx, cy, r, lab, col=AM):
    return CIRC(cx, cy, r, f'{col}33', col, 4) + CIRC(cx, cy, r - 8, 'none', col, 1.5) + T(cx, cy + 1, lab, col, r * 0.9)
def MARBLE(cx, cy, r, col):
    return CIRC(cx, cy, r, col, NAV, 2) + f'<circle cx="{r1(cx - r * .35)}" cy="{r1(cy - r * .35)}" r="{r1(r * .28)}" fill="{TX}" fill-opacity=".5"/>'

def TREE(x0, y0, w, h, s1, s2, outs=None, hi=(), plab=True, size=18, outcol=None, outw=None, head=None):
    """Gambar rajah pokok dua peringkat.
    s1 = [(label, pLabel, col)], s2 = [[(label, pLabel, col)] ...] satu senarai bagi setiap cabang s1.
    outs = senarai teks kesudahan (ikut tertib daun); hi = indeks daun yang diserlahkan."""
    leaves = sum(len(b) for b in s2)
    longo = outs and max(len(o) for o in outs) > 8
    xr, x1, x2 = x0 + 12, x0 + w * (0.27 if longo else 0.36), x0 + w * (0.54 if longo else 0.70)
    gap = h / leaves
    ly = [y0 + gap * (i + .5) for i in range(leaves)]
    s, k = '', 0
    n1y = []
    for i, br in enumerate(s2):
        ys = ly[k:k + len(br)]; n1y.append(sum(ys) / len(ys)); k += len(br)
    ry = sum(n1y) / len(n1y)
    k = 0
    hiset = set(hi)
    for i, (lab, pl, col) in enumerate(s1):
        on1 = any(k + j in hiset for j in range(len(s2[i])))
        s += LINE((xr, ry), (x1 - 16, n1y[i]), col if on1 or not hiset else DIM, 4.5 if on1 else 3.5)
        for j, (lab2, pl2, col2) in enumerate(s2[i]):
            on = (k + j) in hiset
            s += LINE((x1 + 16, n1y[i]), (x2 - 16, ly[k + j]), col2 if on or not hiset else DIM, 4.5 if on else 3.5)
        k += len(s2[i])
    s += DOT((xr, ry), MU3, 7)
    if head:
        s += T(x1, y0 - 22, head[0], MU, 17, halo=False) + T(x2, y0 - 22, head[1], MU, 17, halo=False)
        if len(head) > 2: s += T(x0 + w - 4, y0 - 22, head[2], MU, 17, 'end', halo=False)
    k = 0
    for i, (lab, pl, col) in enumerate(s1):
        s += T(x1, n1y[i], lab, col, size + 2)
        if plab and pl:
            my = (ry + n1y[i]) / 2; mx = (xr + x1) / 2
            s += T(mx - 6, my + ((-16 if n1y[i] < ry else 18) * (1.45 if HASF(pl) else 1)), pl, MU3, size - 1)
        for j, (lab2, pl2, col2) in enumerate(s2[i]):
            yy = ly[k + j]
            s += T(x2, yy, lab2, col2, size + 2)
            if plab and pl2:
                mx = (x1 + x2) / 2 + 4; my = (n1y[i] + yy) / 2
                dy = (-15 if yy < n1y[i] - 1 else (15 if yy > n1y[i] + 1 else -15)) * (1.45 if HASF(pl2) else 1)
                s += T(mx, my + dy, pl2, MU3, size - 2)
            if outs:
                on = (k + j) in hiset
                ow = outw or (w - (x2 - x0) - 22)
                if on:
                    s += RECT(x2 + 20, yy - (21 if HASF(outs[k + j]) else 16), ow, 42 if HASF(outs[k + j]) else 32, f'{outcol or AM}22', outcol or AM, 10, 2)
                s += T(x2 + 30, yy + 1, outs[k + j], (outcol or AM) if on else TX, size - 1, 'start')
        k += len(s2[i])
    return s

def GRID(x0, y0, cs, rows, cols, hi=None, txt=None, size=15, head='', rh=None):
    """Jadual ruang sampel. hi = {(i, j): warna}; txt(i, j) -> teks sel."""
    hi = hi or {}
    s = ''
    nr, nc = len(rows), len(cols)
    rh = rh or cs
    # kepala
    s += RECT(x0, y0, cs * (nc + 1), rh * (nr + 1), SURF, BD, 10, 2)
    for j, c in enumerate(cols):
        s += T(x0 + cs * (j + 1.5), y0 + rh * .5, c, TR, size + 2)
    for i, r in enumerate(rows):
        s += T(x0 + cs * .5, y0 + rh * (i + 1.5), r, PK, size + 2)
    for i in range(nr):
        for j in range(nc):
            x, y = x0 + cs * (j + 1), y0 + rh * (i + 1)
            col = hi.get((i, j))
            s += RECT(x + 2, y + 2, cs - 4, rh - 4, f'{col}33' if col else NAV, col or BD, 6, 2 if col else 1)
            if txt:
                s += T(x + cs / 2, y + rh / 2 + 1, txt(i, j), col or MU3, size, halo=False, weight=700 if col else 600)
    s += LINE((x0 + cs, y0 + 4), (x0 + cs, y0 + rh * (nr + 1) - 4), BD, 2) + LINE((x0 + 4, y0 + rh), (x0 + cs * (nc + 1) - 4, y0 + rh), BD, 2)
    if head:
        s += T(x0 + cs * .5, y0 + rh * .5, head, MU, size - 1)
    return s

def VENN(cx, cy, r, d, A, B, both, out, la='A', lb='B', box=None, shade=None, fsz=17, colA=CA, colB=CB):
    """Venn dua bulatan: pusat jarak d. A, B = unsur sahaja-A / sahaja-B; both = irisan; out = luar."""
    xa, xb = cx - d / 2, cx + d / 2
    x0, y0, w, h = box or (cx - d / 2 - r - 22, cy - r - 34, d + 2 * r + 44, 2 * r + 68)
    s = RECT(x0, y0, w, h, 'none', MU3, 10, 2.5) + T(x0 + 16, y0 + 18, 'S', TX, 19, italic=True)
    fa = .30 if shade in ('A', 'U') else .1
    fb = .30 if shade in ('B', 'U') else .1
    s += f'<circle cx="{r1(xa)}" cy="{r1(cy)}" r="{r}" fill="{colA}" fill-opacity="{fa}" stroke="{colA}" stroke-width="3"/>'
    s += f'<circle cx="{r1(xb)}" cy="{r1(cy)}" r="{r}" fill="{colB}" fill-opacity="{fb}" stroke="{colB}" stroke-width="3"/>'
    s += T(xa - r * .78, cy - r * .80, la, colA, 22, italic=True) + T(xb + r * .78, cy - r * .80, lb, colB, 22, italic=True)
    def place(items, xc, wid):
        o = ''
        if not items: return o
        per = 2 if len(items) > 3 else 1
        if len(items) > 6: per = 3
        rows = math.ceil(len(items) / per)
        for k, it in enumerate(items):
            rr, cc = divmod(k, per)
            nin = min(per, len(items) - rr * per)
            x = xc + (cc - (nin - 1) / 2) * wid
            y = cy + (rr - (rows - 1) / 2) * (fsz + 10)
            o += T(x, y, it, TX, fsz, weight=700)
        return o
    ov = 2 * r - d
    if ov > 0:
        s += place(A, xa - ov / 4 - r * .2, 34) + place(B, xb + ov / 4 + r * .2, 34) + place(both, cx, 30)
    else:
        s += place(A, xa, 34) + place(B, xb, 34)
    if out:
        s += T(x0 + w - 12, y0 + h - 16, out, MU3, fsz - 1, 'end')
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    body = re.sub(r'\(([\w<>/]+), ([\w<>/]+)\)', r'(\1,&nbsp;\2)', body)   # pasangan tertib tidak dipecah baris
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 9.1 PERISTIWA BERGABUNG =====================
col = SUB['9.1'][1]

# 9.1-1 Definisi
coinS, dieS = ['G', 'A'], list(range(1, 7))
Sx = list(product(coinS, dieS)); assert len(Sx) == 12
fig = (RECT(14, 14, 472, 200) + COIN(110, 100, 48, 'G') + T(110, 176, 'syiling: G atau A', MU3, 16, halo=False)
       + T(250, 100, '+', TX, 44) + DIE(330, 52, 96, 5) + T(378, 176, 'dadu: 1 hingga 6', MU3, 16, halo=False)
       + ARROW((250, 226), (250, 262), MU, 3, 10)
       + RECT(14, 272, 472, 184, SURF, TR, 18, 2.5)
       + T(250, 302, 'Satu kesudahan: (G, 5)', TR, 21))
for i, (a, b) in enumerate(Sx):
    x = 66 + (i % 6) * 74; y = 350 + (i // 6) * 42
    on = (a, b) == ('G', 5)
    fig += T(x, y, f'({a}, {b})', AM if on else MU3, 17, weight=800 if on else 600, halo=False)
fig += T(250, 438, 'n(S) = 2 × 6 = 12 kesudahan', TX, 18)
add('9.1', 'DEFINISI', 'Apa itu peristiwa bergabung?',
    DEF('<b>Peristiwa bergabung</b> ialah gabungan dua atau lebih peristiwa daripada satu atau lebih eksperimen.', col)
    + BUL(['Contoh: melambung sekeping syiling <b>dan</b> sebiji dadu serentak.',
           'Contoh: mencabut dua biji guli, satu demi satu, dari sebuah beg.'], col)
    + NOTE('Setiap kesudahan ditulis sebagai <b>pasangan tertib</b>, contohnya (G, 5): G daripada syiling dan 5 daripada dadu. (G = gambar, A = angka)'),
    svg(fig, 'Sekeping syiling dan sebiji dadu dilambung, 12 kesudahan dalam bentuk pasangan tertib'))

# 9.1-2 Ruang sampel dua syiling (jadual)
S2 = list(product('GA', 'GA')); assert len(S2) == 4
fig = GRID(110, 60, 110, ['G', 'A'], ['G', 'A'], {(0, 0): TR, (0, 1): TR, (1, 0): TR, (1, 1): TR},
           lambda i, j: f'({"GA"[i]}, {"GA"[j]})', 20, head='')
fig += T(165, 40, 'Syiling 2 →', TR, 17, 'start', halo=False) + T(90, 225, 'Syiling 1', PK, 17, 'end', halo=False)
fig += T(250, 420, 'n(S) = 2 × 2 = 4', AM, 22)
add('9.1', 'RUANG SAMPEL', 'Ruang sampel peristiwa bergabung',
    P('Dua keping syiling dilambung serentak. Senaraikan ruang sampel, <i>S</i>.', True)
    + STEPS(['Syiling 1: G atau A. Syiling 2: G atau A.',
             'Gabungkan setiap kesudahan syiling 1 dengan setiap kesudahan syiling 2.',
             '<i>S</i> = {(G, G), (G, A), (A, G), (A, A)}'], col)
    + DEF('n(<i>S</i>) = n(<i>S</i>₁) × n(<i>S</i>₂) = 2 × 2 = 4', col)
    + NOTE('(G, A) dan (A, G) ialah <b>dua kesudahan berbeza</b>. Tertib dalam pasangan penting.'),
    svg(fig, 'Jadual ruang sampel dua syiling dengan empat kesudahan'))

# 9.1-3 Gambar rajah pokok: syiling + pemutar 3 warna
spin = [('M', RD), ('K', AM), ('H', GR)]
outs = [f'({a}, {b})' for a in 'GA' for b, _ in spin]
assert len(outs) == 2 * 3 == 6
fig = (TREE(20, 50, 470, 360, [('G', '', TR), ('A', '', PK)], [[(l, '', c) for l, c in spin]] * 2, outs, plab=False, head=('Syiling', 'Pemutar', 'Kesudahan'))
       + T(250, 440, 'n(S) = 2 × 3 = 6', AM, 22))
add('9.1', 'GAMBAR RAJAH POKOK', 'Melukis gambar rajah pokok',
    P('Sekeping syiling dilambung dan sebuah pemutar tiga warna, merah (M), kuning (K) dan hijau (H), diputar.', True)
    + STEPS(['Cabang pertama: kesudahan syiling, G dan A.',
             'Dari hujung setiap cabang, lukis kesudahan pemutar: M, K dan H.',
             'Ikut setiap laluan dari kiri ke kanan untuk menulis kesudahan, contohnya (G, M).'], col)
    + ANS('<i>S</i> = {(G, M), (G, K), (G, H), (A, M), (A, K), (A, H)}'),
    svg(fig, 'Gambar rajah pokok bagi syiling dan pemutar tiga warna dengan enam kesudahan'))

# 9.1-4 Jadual dua dadu
A7 = [(a, b) for a in dieS for b in dieS if a + b == 7]
assert len(A7) == 6 and F(len(A7), 36) == F(1, 6)
fig = GRID(54, 20, 56, [str(i) for i in dieS], [str(i) for i in dieS], {(a - 1, b - 1): AM for a, b in A7},
           lambda i, j: str(i + j + 2), 18, head='+')
fig += T(250, 448, 'Hasil tambah 7: 6 daripada 36 sel', AM, 19)
add('9.1', 'JADUAL', 'Ruang sampel dua biji dadu',
    P('Dua biji dadu dilambung. Jadual menunjukkan hasil tambah dua nombor bagi setiap kesudahan.', True)
    + BUL(['n(<i>S</i>) = 6 × 6 = <b>36</b> kesudahan.',
           '<i>A</i> = peristiwa hasil tambah 7 = {(1, 6), (2, 5), (3, 4), (4, 3), (5, 2), (6, 1)}'], col)
    + STEPS([f'n(<i>A</i>) = 6 &nbsp;·&nbsp; P(<i>A</i>) = {FR("n(<i>A</i>)", "n(<i>S</i>)")} = {FR(6, 36)} = {FRV(F(6, 36))}'], col)
    + NOTE('Jadual memudahkan kita mengira kesudahan tanpa tertinggal.'),
    svg(fig, 'Jadual 6 kali 6 hasil tambah dua dadu dengan hasil tambah 7 diserlahkan'))

# 9.1-5 Contoh berlangkah: kad nombor dan kad huruf
nums, lets = [1, 2, 3], ['X', 'Y']
S5 = list(product(nums, lets)); A5 = [(n, l) for n, l in S5 if n % 2 == 1 and l == 'X']
assert len(S5) == 6 and A5 == [(1, 'X'), (3, 'X')] and F(len(A5), len(S5)) == F(1, 3)
fig = (RECT(20, 20, 210, 120, SURF, TR, 16, 2.5) + T(125, 42, 'Kotak P', TR, 18)
       + ''.join(RECT(46 + i * 56, 64, 46, 60, NAV, MU3, 8, 2) + T(69 + i * 56, 95, str(n), TX, 24) for i, n in enumerate(nums))
       + RECT(270, 20, 210, 120, SURF, PK, 16, 2.5) + T(375, 42, 'Kotak Q', PK, 18)
       + ''.join(RECT(320 + i * 64, 64, 46, 60, NAV, MU3, 8, 2) + T(343 + i * 64, 95, l, TX, 24) for i, l in enumerate(lets)))
fig += GRID(110, 172, 92, [str(n) for n in nums], lets, {(0, 0): AM, (2, 0): AM},
            lambda i, j: f'({nums[i]}, {lets[j]})', 19, rh=62)
fig += T(250, 450, 'A = nombor ganjil dan huruf X', AM, 19)
add('9.1', 'CONTOH BERLANGKAH', 'Menyenaraikan peristiwa bergabung',
    P('Sekeping kad dicabut secara rawak dari kotak P dan sekeping kad dari kotak Q. <i>A</i> ialah peristiwa mendapat nombor ganjil dan huruf X.', True)
    + STEPS(['<i>S</i> = {(1, X), (1, Y), (2, X), (2, Y), (3, X), (3, Y)}, n(<i>S</i>) = 3 × 2 = 6',
             'Nombor ganjil: 1, 3. Huruf: X. Maka <i>A</i> = {(1, X), (3, X)}, n(<i>A</i>) = 2',
             f'P(<i>A</i>) = {FR(2, 6)} = {FRV(F(2, 6))}'], col)
    + ANS(f'<i>A</i> = {{(1, X), (3, X)}}, P(<i>A</i>) = {FRV(F(1, 3))}'),
    svg(fig, 'Kotak P dengan kad 1, 2, 3 dan kotak Q dengan kad X, Y serta jadual kesudahan'))

# 9.1-6 Kesilapan biasa
assert 2 * 6 == 12 and 2 + 6 == 8
fig = ''
CASES = [(52, 'Syiling dan dadu: n(S) = 2 + 6 = 8', False), (122, 'Syiling dan dadu: n(S) = 2 × 6 = 12', True),
         (212, 'Dua dadu: (1, 2) sama dengan (2, 1)', False), (282, '(1, 2) dan (2, 1) ialah dua kesudahan', True),
         (372, 'Senarai tanpa susunan: mudah tertinggal', False), (442, 'Guna rajah pokok atau jadual', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
add('9.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Menambah", RD)} bilangan kesudahan ✗ → n(<i>S</i>) bagi peristiwa bergabung ialah hasil <b>darab</b>.',
         f'{B("Mengabaikan tertib", RD)} ✗ → (1, 2) dan (2, 1) ialah kesudahan berbeza bagi dua biji dadu.',
         f'{B("Kesudahan tertinggal", RD)} ✗ → senaraikan secara sistematik dengan gambar rajah pokok atau jadual.'], col)
    + NOTE('Ruang sampel peristiwa bergabung = semua pasangan tertib yang mungkin.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang ruang sampel peristiwa bergabung'))

# ===================== 9.2 BERSANDAR & TAK BERSANDAR =====================
col = SUB['9.2'][1]

# 9.2-1 Definisi
def BAG(x, y, red, blue, lab, colb=MU3):
    s = RECT(x, y, 190, 150, SURF, colb, 22, 2.5)
    k = 0
    for c, n in ((RD, red), (TR, blue)):
        for _ in range(n):
            s += MARBLE(x + 38 + (k % 4) * 38, y + 48 + (k // 4) * 42, 15, c); k += 1
    return s + T(x + 95, y + 128, lab, colb, 16, halo=False)
fig = (T(250, 30, 'Beg asal: 3 merah, 2 biru', TX, 19)
       + BAG(30, 60, 3, 2, 'dengan pemulangan', GR) + BAG(280, 60, 2, 2, 'tanpa pemulangan', RD)
       + T(125, 232, 'Cabutan 2: masih 5 guli', GR, 17) + T(375, 232, 'Cabutan 2: tinggal 4 guli', RD, 17)
       + T(125, 271, 'P(merah) = 3/5', GR, 19) + T(375, 271, 'P(merah) = 2/4', RD, 19)
       + RECT(20, 300, 460, 150, SURF, BD, 16, 2)
       + T(250, 334, 'Kesan cabutan pertama (merah) pada cabutan kedua:', MU3, 16, halo=False)
       + T(125, 380, 'Tak bersandar', GR, 22) + T(375, 380, 'Bersandar', RD, 22)
       + T(125, 416, 'peluang tidak berubah', MU, 16, halo=False) + T(375, 416, 'peluang berubah', MU, 16, halo=False))
assert F(3, 5) != F(2, 4)
add('9.2', 'DEFINISI', 'Bersandar atau tak bersandar?',
    DEF('Dua peristiwa adalah <b>tak bersandar</b> jika kesudahan satu peristiwa <b>tidak mempengaruhi</b> kesudahan peristiwa yang lain. Jika mempengaruhi, peristiwa itu <b>bersandar</b>.', col)
    + TABLE(['Situasi', 'Jenis'],
            [['Melambung syiling dua kali', B('Tak bersandar', GR)],
             ['Mencabut guli <b>dengan</b> pemulangan', B('Tak bersandar', GR)],
             ['Mencabut guli <b>tanpa</b> pemulangan', B('Bersandar', RD)],
             ['Hujan lebat dan bas lewat tiba', B('Bersandar', RD)]], col, rv=True),
    svg(fig, 'Beg 3 guli merah dan 2 guli biru: cabutan dengan dan tanpa pemulangan'))

# 9.2-2 Rumus (konjektur)
pA, pB = F(1, 2), F(1, 6)
cells = list(product('GA', dieS)); hitc = [c for c in cells if c == ('G', 6)]
assert F(len(hitc), len(cells)) == pA * pB == F(1, 12)
fig = GRID(40, 40, 60, ['G', 'A'], [str(i) for i in dieS], {(0, 5): GR}, lambda i, j: f'{"GA"[i]}, {j + 1}', 15)
fig += T(250, 24, 'Syiling dan dadu: 12 kesudahan', MU, 17, halo=False)
fig += (RECT(30, 250, 440, 196, SURF, BD, 16, 2)
        + T(250, 282, 'A = gambar, B = nombor 6', TX, 19)
        + T(250, 326, 'Daripada jadual: P(A ∩ B) = 1/12', GR, 20)
        + T(250, 370, 'P(A) × P(B) = 1/2 × 1/6 = 1/12', AM, 20)
        + T(250, 416, 'Sama! A dan B tak bersandar', GR, 20))
add('9.2', 'RUMUS', 'Kebarangkalian peristiwa tak bersandar',
    P('Konjektur: syiling dan dadu dilambung. <i>A</i> = mendapat gambar, <i>B</i> = mendapat nombor 6.', True)
    + STEPS([f'Daripada jadual: {PI} = {FR(1, 12)}',
             f'{PA_} × {PB_} = {FR(1, 2)} × {FR(1, 6)} = {FR(1, 12)}'], col)
    + DEF(f'Bagi peristiwa tak bersandar:<br>{PI} = {PA_} × {PB_}', col)
    + NOTE('Untuk tiga peristiwa tak bersandar: P(<i>A</i> ∩ <i>B</i> ∩ <i>C</i>) = P(<i>A</i>) × P(<i>B</i>) × P(<i>C</i>). Simbol ∩ dibaca "dan".'),
    svg(fig, 'Jadual syiling dan dadu: kesudahan gambar dan 6 diserlahkan'))

# 9.2-3 Dengan pemulangan
r_, b_ = 3, 2; t_ = r_ + b_
pr, pb = F(r_, t_), F(b_, t_)
pMM = pr * pr; assert pMM == F(9, 25)
leafp = [pr * pr, pr * pb, pb * pr, pb * pb]; assert sum(leafp) == 1
fig = (TREE(20, 50, 470, 380, [('M', fs(pr), RD), ('B', fs(pb), TR)],
              [[('M', fs(pr), RD), ('B', fs(pb), TR)], [('M', fs(pr), RD), ('B', fs(pb), TR)]],
              [f'{fs(pr)} × {fs(pr)} = {fs(leafp[0])}', f'{fs(leafp[1])}', f'{fs(leafp[2])}', f'{fs(leafp[3])}'], hi=[0], outcol=GR, head=('Cabutan 1', 'Cabutan 2'))
       + T(250, 452, 'M = merah, B = biru', MU, 16, halo=False))
add('9.2', 'CONTOH BERLANGKAH', 'Cabutan dengan pemulangan',
    P('Sebuah beg mengandungi 3 biji guli merah dan 2 biji guli biru. Sebiji guli diambil, warnanya dicatat dan guli itu <b>dimasukkan semula</b>. Kemudian sebiji guli diambil lagi. Cari kebarangkalian kedua-dua guli berwarna merah.', True)
    + STEPS([f'Peristiwa tak bersandar: P(merah) = {FR(3, 5)} pada kedua-dua cabutan.',
             f'P(merah dan merah) = {FR(3, 5)} × {FR(3, 5)}',
             f'= {FRV(pMM)}'], col)
    + ANS(f'{FRV(pMM)}'),
    svg(fig, 'Gambar rajah pokok cabutan dengan pemulangan, kebarangkalian 3/5 dan 2/5 pada setiap cabutan'))

# 9.2-4 Tanpa pemulangan
pMM2 = F(3, 5) * F(2, 4); assert pMM2 == F(3, 10)
lp = [F(3, 5) * F(2, 4), F(3, 5) * F(2, 4), F(2, 5) * F(3, 4), F(2, 5) * F(1, 4)]; assert sum(lp) == 1
fig = (TREE(20, 50, 470, 380, [('M', '3/5', RD), ('B', '2/5', TR)],
              [[('M', '2/4', RD), ('B', '2/4', TR)], [('M', '3/4', RD), ('B', '1/4', TR)]],
              [f'3/5 × 2/4 = {fs(lp[0])}', fs(lp[1]), fs(lp[2]), fs(lp[3])], hi=[0], outcol=GR, head=('Cabutan 1', 'Cabutan 2'))
       + T(250, 452, 'Selepas cabutan 1, tinggal 4 biji guli', MU, 16, halo=False))
add('9.2', 'CONTOH BERLANGKAH', 'Cabutan tanpa pemulangan',
    P('Beg yang sama: 3 merah, 2 biru. Dua biji guli diambil satu demi satu <b>tanpa pemulangan</b>. Cari kebarangkalian kedua-dua guli berwarna merah.', True)
    + STEPS([f'Cabutan 1: P(merah) = {FR(3, 5)}',
             f'Cabutan 2 (tinggal 2 merah daripada 4 guli): P(merah) = {FR(2, 4)}',
             f'P(merah dan merah) = {FR(3, 5)} × {FR(2, 4)} = {FR(6, 20)} = {FRV(pMM2)}'], col)
    + ANS(f'{FRV(pMM2)}')
    + NOTE('Peristiwa bersandar: kebarangkalian cabutan kedua <b>berubah</b>.'),
    svg(fig, 'Gambar rajah pokok cabutan tanpa pemulangan dengan kebarangkalian berubah pada cabutan kedua'))

# 9.2-5 Tiga peristiwa tak bersandar
pl3 = [D('0.8'), D('0.6'), D('0.5')]
p3 = pl3[0] * pl3[1] * pl3[2]; assert p3 == D('0.24') and ds(p3) == '0.24'
NM3 = ['Aina', 'Kumar', 'Mei Ling']
fig = ''
for i, (nm, p, cl) in enumerate(zip(NM3, pl3, [TR, GR, PU])):
    x = 20 + i * 158
    fig += RECT(x, 40, 144, 150, SURF, cl, 18, 2.5) + T(x + 72, 80, nm, cl, 20) + T(x + 72, 124, 'P(lulus)', MU, 16, halo=False) + T(x + 72, 158, ds(p), TX, 26)
    if i < 2: fig += T(x + 151, 115, '×', AM, 26)
fig += (ARROW((250, 204), (250, 248), MU, 3, 10)
        + RECT(60, 262, 380, 90, SURF, AM, 18, 2.5)
        + T(250, 294, '0.8 × 0.6 × 0.5', TX, 22) + T(250, 330, '= 0.24', AM, 26)
        + T(250, 400, 'Keputusan seorang tidak mempengaruhi', MU3, 17, halo=False)
        + T(250, 428, 'keputusan orang lain: tak bersandar', MU3, 17, halo=False))
add('9.2', 'CONTOH BERLANGKAH', 'Tiga peristiwa tak bersandar',
    P('Kebarangkalian Aina, Kumar dan Mei Ling lulus ujian memandu masing-masing ialah 0.8, 0.6 dan 0.5. Keputusan mereka tidak bersandar antara satu sama lain. Cari kebarangkalian ketiga-tiga mereka lulus.', True)
    + STEPS(['P(<i>A</i> ∩ <i>K</i> ∩ <i>M</i>) = P(<i>A</i>) × P(<i>K</i>) × P(<i>M</i>)',
             '= 0.8 × 0.6 × 0.5',
             '= 0.24'], col)
    + ANS('0.24'),
    svg(fig, 'Kebarangkalian lulus 0.8, 0.6 dan 0.5 didarab menjadi 0.24'))

# 9.2-6 Kesilapan biasa
assert F(3, 5) + F(3, 5) == F(6, 5) and F(3, 5) * F(3, 5) == F(9, 25)
fig = ''
CASES = [(52, 'P(M dan M) = 3/5 + 3/5 = 6/5', False), (122, 'P(M dan M) = 3/5 × 3/5 = 9/25', True),
         (212, 'Tanpa pemulangan: 3/5 × 3/5', False), (282, 'Tanpa pemulangan: 3/5 × 2/4 = 3/10', True),
         (372, 'Semua cabutan tak bersandar', False), (442, 'Semak: guli dikembalikan atau tidak?', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
add('9.2', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Menambah", RD)} kebarangkalian untuk "dan" ✗ → <b>darab</b>. Jawapan lebih daripada 1 pasti salah.',
         f'{B("Penyebut tidak dikurangkan", RD)} ✗ → tanpa pemulangan, jumlah objek berkurang 1 pada cabutan kedua.',
         f'{B("Pengangka tidak dikemas kini", RD)} ✗ → jika guli merah sudah diambil, guli merah juga berkurang 1.'], col)
    + NOTE(f'Tak bersandar: {PI} = {PA_} × {PB_}. Bersandar: darab dengan kebarangkalian yang telah <b>berubah</b>.', 'Ringkasan:'),
    svg(fig, 'Contoh pengiraan salah dan betul bagi peristiwa bersandar dan tak bersandar'))

# ===================== 9.3 SALING EKSKLUSIF =====================
col = SUB['9.3'][1]

# 9.3-1 Definisi
fig = (T(250, 24, 'Saling eksklusif', GR, 20) + VENN(250, 112, 54, 150, [], [], [], '', box=(40, 42, 420, 176))
       + T(250, 196, 'A ∩ B = ∅ (tiada bahagian sepunya)', GR, 17)
       + T(250, 246, 'Tidak saling eksklusif', AM, 20) + VENN(250, 340, 62, 80, [], [], [], '', box=(40, 266, 420, 164))
       + T(250, 340, 'A ∩ B', AM, 16) + T(250, 452, 'bulatan bertindih: boleh berlaku serentak', MU, 16, halo=False))
add('9.3', 'DEFINISI', 'Saling eksklusif atau tidak?',
    DEF('Peristiwa <i>A</i> dan <i>B</i> adalah <b>saling eksklusif</b> jika kedua-duanya <b>tidak boleh berlaku serentak</b>, iaitu <i>A</i> ∩ <i>B</i> = ∅.', col)
    + BUL([f'{B("Saling eksklusif", GR)}: tiada unsur sepunya, {PI} = 0.',
           f'{B("Tidak saling eksklusif", AM)}: ada unsur sepunya, <i>A</i> ∩ <i>B</i> ≠ ∅.'], col)
    + NOTE('Dalam gambar rajah Venn, bulatan peristiwa saling eksklusif <b>tidak bertindih</b>.'),
    svg(fig, 'Gambar rajah Venn peristiwa saling eksklusif dan tidak saling eksklusif'))

# 9.3-2 Mengenal pasti (dadu)
Sd = set(dieS); Ae = {2, 4, 6}; Bf = {5}; Cp = {2, 3, 5}
assert Ae & Bf == set() and Ae & Cp == {2}
fig = (T(250, 22, 'A dan B', GR, 19)
       + VENN(250, 114, 58, 150, ['2', '4', '6'], ['5'], [], '1, 3', box=(30, 42, 440, 160), fsz=19)
       + T(250, 246, 'A dan C', AM, 19)
       + VENN(250, 340, 66, 96, ['4', '6'], ['3', '5'], ['2'], '1', box=(30, 266, 440, 180), la='A', lb='C', fsz=19, colB=PU))
add('9.3', 'CONTOH', 'Mengenal pasti peristiwa saling eksklusif',
    P('Sebiji dadu dilambung. <i>A</i> = nombor genap, <i>B</i> = nombor 5, <i>C</i> = nombor perdana.', True)
    + STEPS(['<i>A</i> = {2, 4, 6}, <i>B</i> = {5}, <i>C</i> = {2, 3, 5}',
             '<i>A</i> ∩ <i>B</i> = ∅ → <i>A</i> dan <i>B</i> <b>saling eksklusif</b>',
             '<i>A</i> ∩ <i>C</i> = {2} → <i>A</i> dan <i>C</i> <b>tidak saling eksklusif</b>'], col)
    + NOTE('Nombor 2 ialah nombor genap <b>dan</b> nombor perdana, jadi <i>A</i> dan <i>C</i> boleh berlaku serentak.'),
    svg(fig, 'Gambar rajah Venn A dan B tidak bertindih; A dan C bertindih pada nombor 2'))

# 9.3-3 Rumus
fig = ''
for i, (lab, sh, cl) in enumerate([('P(A)', 'A', CA), ('+ P(B)', 'B', CB), ('− P(A ∩ B)', 'I', AM)]):
    y = 18 + i * 128
    fig += RECT(20, y, 460, 116, SURF, BD, 14, 2)
    xa, xb, yy, rr = 300, 360, y + 58, 44
    if sh == 'I':
        fig += f'<clipPath id="kp{i}"><circle cx="{xa}" cy="{yy}" r="{rr}"/></clipPath>'
        fig += f'<circle cx="{xb}" cy="{yy}" r="{rr}" fill="{AM}" fill-opacity=".55" clip-path="url(#kp{i})"/>'
    fig += f'<circle cx="{xa}" cy="{yy}" r="{rr}" fill="{CA}" fill-opacity="{.4 if sh == "A" else 0}" stroke="{CA}" stroke-width="3"/>'
    fig += f'<circle cx="{xb}" cy="{yy}" r="{rr}" fill="{CB}" fill-opacity="{.4 if sh == "B" else 0}" stroke="{CB}" stroke-width="3"/>'
    fig += T(46, yy, lab, cl, 22, 'start')
fig += (RECT(20, 402, 460, 56, SURF, PU, 14, 2.5) + T(46, 430, '= P(A ∪ B)', PU, 22, 'start')
        + f'<circle cx="300" cy="430" r="20" fill="{PU}" fill-opacity=".45"/><circle cx="326" cy="430" r="20" fill="{PU}" fill-opacity=".45"/>')
add('9.3', 'RUMUS', 'Kebarangkalian "A atau B"',
    DEF(f'{PU_} = {PA_} + {PB_} − {PI}', col)
    + BUL(['Bahagian bertindih dikira <b>dua kali</b> apabila P(<i>A</i>) dan P(<i>B</i>) ditambah, jadi tolak sekali.',
           f'Jika <i>A</i> dan <i>B</i> saling eksklusif, {PI} = 0, maka {PU_} = {PA_} + {PB_}.'], col)
    + NOTE('Simbol ∪ dibaca "atau": sekurang-kurangnya satu daripada peristiwa itu berlaku.'),
    svg(fig, 'Rumus P(A atau B) ditunjukkan dengan gambar rajah Venn berlorek'))

# 9.3-4 Contoh saling eksklusif
S20 = set(range(1, 21)); A6 = {x for x in S20 if x % 6 == 0}; B7 = {x for x in S20 if x % 7 == 0}
assert A6 == {6, 12, 18} and B7 == {7, 14} and not (A6 & B7)
pU = F(len(A6 | B7), 20); assert pU == F(3, 20) + F(2, 20) == F(1, 4)
fig = (VENN(250, 200, 92, 210, ['6', '12', '18'], ['7', '14'], [], '15 nombor lain', box=(20, 60, 460, 290), fsz=22)
       + T(250, 30, 'Kad bernombor 1 hingga 20', MU, 18, halo=False)
       + RECT(40, 372, 420, 80, SURF, GR, 16, 2.5) + T(296, 412, 'P(A ∪ B) = 3/20 + 2/20', TX, 20, 'end') + T(304, 412, '= 5/20 = 1/4', GR, 22, 'start'))
add('9.3', 'CONTOH BERLANGKAH', 'Peristiwa saling eksklusif',
    P('Sekeping kad dipilih secara rawak daripada 20 keping kad bernombor 1 hingga 20. <i>A</i> = gandaan 6, <i>B</i> = gandaan 7. Cari kebarangkalian mendapat gandaan 6 atau gandaan 7.', True)
    + STEPS(['<i>A</i> = {6, 12, 18}, <i>B</i> = {7, 14}, <i>A</i> ∩ <i>B</i> = ∅ (saling eksklusif)',
             f'{PU_} = {FR(3, 20)} + {FR(2, 20)}',
             f'= {FR(5, 20)} = {FRV(pU)}'], col)
    + ANS(f'{FRV(pU)}'),
    svg(fig, 'Gambar rajah Venn gandaan 6 dan gandaan 7 daripada 1 hingga 20 tanpa unsur sepunya'))

# 9.3-5 Contoh tidak saling eksklusif
Ae2 = {x for x in S20 if x % 2 == 0}; B3 = {x for x in S20 if x % 3 == 0}
I = Ae2 & B3; assert I == {6, 12, 18} and len(Ae2) == 10 and len(B3) == 6
pU2 = F(len(Ae2), 20) + F(len(B3), 20) - F(len(I), 20); assert pU2 == F(len(Ae2 | B3), 20) == F(13, 20)
onlyA = sorted(Ae2 - B3); onlyB = sorted(B3 - Ae2)
assert onlyA == [2, 4, 8, 10, 14, 16, 20] and onlyB == [3, 9, 15] and sorted(S20 - Ae2 - B3) == [1, 5, 7, 11, 13, 17, 19]
fig = (VENN(250, 196, 104, 128, [str(x) for x in onlyA], [str(x) for x in onlyB], [str(x) for x in sorted(I)], ', '.join(str(x) for x in sorted(S20 - Ae2 - B3)),
            box=(14, 54, 472, 300), fsz=19)
       + T(250, 28, 'Kad bernombor 1 hingga 20', MU, 18, halo=False)
       + RECT(30, 372, 440, 84, SURF, AM, 16, 2.5) + T(346, 414, 'P(A ∪ B) = 10/20 + 6/20 − 3/20', TX, 19, 'end') + T(354, 414, '= 13/20', AM, 22, 'start'))
add('9.3', 'CONTOH BERLANGKAH', 'Peristiwa tidak saling eksklusif',
    P('Kad yang sama, 1 hingga 20. <i>A</i> = nombor genap, <i>B</i> = gandaan 3. Cari kebarangkalian mendapat nombor genap atau gandaan 3.', True)
    + STEPS(['n(<i>A</i>) = 10, n(<i>B</i>) = 6, <i>A</i> ∩ <i>B</i> = {6, 12, 18}, n(<i>A</i> ∩ <i>B</i>) = 3',
             f'{PU_} = {FR(10, 20)} + {FR(6, 20)} − {FR(3, 20)}',
             f'= {FRV(pU2)}'], col)
    + ANS(f'{FRV(pU2)}')
    + NOTE('Semak dengan Venn: 7 + 3 + 3 = 13 nombor dalam <i>A</i> ∪ <i>B</i>.', 'Semak:'),
    svg(fig, 'Gambar rajah Venn nombor genap dan gandaan 3 daripada 1 hingga 20 dengan irisan 6, 12, 18'))

# 9.3-6 Kesilapan biasa
assert F(10, 20) + F(6, 20) == F(4, 5)
fig = ''
CASES = [(52, 'P(A ∪ B) = 10/20 + 6/20 = 4/5', False), (122, 'Tolak irisan: 16/20 − 3/20 = 13/20', True),
         (212, 'Saling eksklusif = tak bersandar', False), (282, 'Dua konsep berbeza', True),
         (372, '"atau" → darab', False), (442, '"atau" → tambah, "dan" → darab', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
add('9.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Lupa menolak", RD)} {PI} ✗ → irisan dikira dua kali.',
         f'{B("Saling eksklusif", RD)} bukan tak bersandar ✗ → saling eksklusif: tidak boleh berlaku <b>serentak</b>; tak bersandar: tidak <b>mempengaruhi</b>.',
         f'{B("Rumus tertukar", RD)} ✗ → "atau" (∪) guna tambah, "dan" (∩) guna darab bagi peristiwa tak bersandar.'], col)
    + NOTE(f'{PU_} = {PA_} + {PB_} − {PI}', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang peristiwa saling eksklusif'))

# ===================== 9.4 APLIKASI =====================
col = SUB['9.4'][1]

# 9.4-1 Strategi
fig = (TREE(20, 30, 330, 300, [('X', 'p', TR), ('X′', '1 − p', PK)], [[('Y', 'q', TR), ('Y′', '1 − q', PK)], [('Y', 'q', TR), ('Y′', '1 − q', PK)]], plab=True)
       + RECT(360, 40, 126, 120, SURF, GR, 14, 2.5) + T(423, 74, '×', GR, 30) + T(423, 108, 'sepanjang', MU3, 16, halo=False) + T(423, 132, 'cabang', MU3, 16, halo=False)
       + RECT(360, 200, 126, 120, SURF, PU, 14, 2.5) + T(423, 234, '+', PU, 30) + T(423, 268, 'antara', MU3, 16, halo=False) + T(423, 292, 'laluan', MU3, 16, halo=False)
       + RECT(20, 352, 466, 100, SURF, AM, 16, 2.5)
       + T(253, 384, 'Sekurang-kurangnya satu', AM, 20) + T(253, 420, '= 1 − P(tiada langsung)', TX, 20))
add('9.4', 'STRATEGI', 'Langkah menyelesaikan masalah',
    STEPS(['Kenal pasti jenis peristiwa: bersandar? saling eksklusif?',
           'Lukis gambar rajah pokok atau jadual dan tulis kebarangkalian setiap cabang.',
           '"Dan": <b>darab</b> sepanjang laluan. "Atau": <b>tambah</b> laluan yang berbeza.',
           '"Sekurang-kurangnya satu": 1 − P(tiada langsung).'], col)
    + NOTE('Jumlah kebarangkalian semua laluan ialah <b>1</b>. X′ ialah pelengkap X.'),
    svg(fig, 'Gambar rajah pokok umum: darab sepanjang cabang dan tambah antara laluan'))

# 9.4-2 Tepat satu hari hujan
h1, h2 = D('0.3'), D('0.4')
lv = [h1 * h2, h1 * (1 - h2), (1 - h1) * h2, (1 - h1) * (1 - h2)]
assert [ds(v) for v in lv] == ['0.12', '0.18', '0.28', '0.42'] and sum(lv) == 1
one = lv[1] + lv[2]; assert ds(one) == '0.46'
fig = (TREE(20, 50, 470, 370, [('H', '0.3', TR), ('H′', '0.7', PK)], [[('H', '0.4', TR), ('H′', '0.6', PK)], [('H', '0.4', TR), ('H′', '0.6', PK)]],
              ['0.3 × 0.4 = 0.12', '0.3 × 0.6 = 0.18', '0.7 × 0.4 = 0.28', '0.7 × 0.6 = 0.42'], hi=[1, 2], outcol=AM, head=('Isnin', 'Selasa'))
       + T(250, 450, 'H = hujan, H′ = tidak hujan', MU, 16, halo=False))
add('9.4', 'CONTOH BERLANGKAH', 'Tepat satu hari hujan',
    P('Kebarangkalian hujan pada hari Isnin ialah 0.3 dan pada hari Selasa ialah 0.4. Kedua-dua peristiwa tidak bersandar. Cari kebarangkalian hujan pada <b>tepat satu</b> hari sahaja.', True)
    + STEPS(['Tepat satu hari: (H, H′) atau (H′, H)',
             'P = (0.3 × 0.6) + (0.7 × 0.4)',
             '= 0.18 + 0.28 = 0.46'], col)
    + ANS('0.46'),
    svg(fig, 'Gambar rajah pokok hujan pada Isnin dan Selasa dengan dua laluan tepat satu hari hujan diserlahkan'))

# 9.4-3 Sekurang-kurangnya satu: penggera
a1, a2 = D('0.9'), D('0.8')
none = (1 - a1) * (1 - a2); atl = 1 - none
assert ds(none) == '0.02' and ds(atl) == '0.98'
assert a1 * a2 + a1 * (1 - a2) + (1 - a1) * a2 == atl
fig = (RECT(20, 30, 210, 150, SURF, TR, 18, 2.5) + T(125, 66, 'Penggera A', TR, 20) + T(125, 106, 'berfungsi: 0.9', TX, 18) + T(125, 144, 'gagal: 0.1', RD, 18)
       + RECT(270, 30, 210, 150, SURF, PK, 18, 2.5) + T(375, 66, 'Penggera B', PK, 20) + T(375, 106, 'berfungsi: 0.8', TX, 18) + T(375, 144, 'gagal: 0.2', RD, 18)
       + RECT(20, 210, 460, 96, SURF, RD, 18, 2.5) + T(250, 240, 'Kedua-dua gagal', RD, 19) + T(250, 276, '0.1 × 0.2 = 0.02', TX, 21)
       + ARROW((250, 316), (250, 352), MU, 3, 10)
       + RECT(20, 362, 460, 90, SURF, GR, 18, 2.5) + T(250, 390, 'Sekurang-kurangnya satu berfungsi', GR, 19) + T(250, 426, '1 − 0.02 = 0.98', TX, 22))
add('9.4', 'CONTOH BERLANGKAH', 'Sekurang-kurangnya satu',
    P('Sebuah rumah mempunyai dua penggera kebakaran, A dan B, yang berfungsi secara tak bersandar. Kebarangkalian A berfungsi ialah 0.9 dan B berfungsi ialah 0.8. Cari kebarangkalian sekurang-kurangnya satu penggera berfungsi.', True)
    + STEPS(['P(A gagal) = 1 − 0.9 = 0.1, P(B gagal) = 1 − 0.8 = 0.2',
             'P(kedua-dua gagal) = 0.1 × 0.2 = 0.02',
             'P(sekurang-kurangnya satu berfungsi) = 1 − 0.02 = 0.98'], col)
    + ANS('0.98')
    + NOTE('Cara panjang: 0.72 + 0.18 + 0.08 = 0.98. Cara pelengkap lebih cepat.', 'Semak:'),
    svg(fig, 'Dua penggera: kebarangkalian kedua-dua gagal 0.02, sekurang-kurangnya satu berfungsi 0.98'))
assert ds(a1 * a2) == '0.72' and ds(a1 * (1 - a2)) == '0.18' and ds((1 - a1) * a2) == '0.08'

# 9.4-4 Warna sama tanpa pemulangan
bl, hk = 5, 3; tt = bl + hk
same = F(bl, tt) * F(bl - 1, tt - 1) + F(hk, tt) * F(hk - 1, tt - 1)
assert same == F(20, 56) + F(6, 56) == F(13, 28)
fig = (TREE(20, 50, 470, 370, [('B', '5/8', TR), ('H', '3/8', MU3)], [[('B', '4/7', TR), ('H', '3/7', MU3)], [('B', '5/7', TR), ('H', '2/7', MU3)]],
              ['5/8 × 4/7 = 20/56', '15/56', '15/56', '3/8 × 2/7 = 6/56'], hi=[0, 3], outcol=AM, head=('Pen 1', 'Pen 2'))
       + T(250, 450, 'B = biru, H = hitam', MU, 16, halo=False))
assert F(5, 8) * F(3, 7) == F(15, 56) and F(3, 8) * F(5, 7) == F(15, 56)
add('9.4', 'CONTOH BERLANGKAH', 'Warna sama, tanpa pemulangan',
    P('Sebuah kotak mengandungi 5 batang pen biru dan 3 batang pen hitam. Dua batang pen diambil secara rawak satu demi satu tanpa pemulangan. Cari kebarangkalian kedua-dua pen sama warna.', True)
    + STEPS(['Sama warna: (B, B) atau (H, H)',
             f'P = ({FR(5, 8)} × {FR(4, 7)}) + ({FR(3, 8)} × {FR(2, 7)})',
             f'= {FR(20, 56)} + {FR(6, 56)} = {FR(26, 56)} = {FRV(same)}'], col)
    + ANS(f'{FRV(same)}'),
    svg(fig, 'Gambar rajah pokok dua pen tanpa pemulangan dengan laluan biru-biru dan hitam-hitam diserlahkan'))

# 9.4-5 Dua dadu: atau (tidak saling eksklusif)
six = {(a, b) for a in dieS for b in dieS if a == 6 or b == 6}
dbl = {(a, a) for a in dieS}
assert len(six) == 11 and len(dbl) == 6 and six & dbl == {(6, 6)}
pu_ = F(11, 36) + F(6, 36) - F(1, 36); assert pu_ == F(len(six | dbl), 36) == F(4, 9)
hi = {}
for a, b in six: hi[(a - 1, b - 1)] = TR
for a, b in dbl: hi[(a - 1, b - 1)] = PK
hi[(5, 5)] = AM
fig = GRID(54, 14, 56, [str(i) for i in dieS], [str(i) for i in dieS], hi, lambda i, j: f'{i + 1},{j + 1}', 14, head='')
fig += (T(40, 450, '■', TR, 20, 'start', halo=False) + T(62, 450, 'ada 6', MU3, 16, 'start', halo=False)
        + T(160, 450, '■', PK, 20, 'start', halo=False) + T(182, 450, 'nombor sama', MU3, 16, 'start', halo=False)
        + T(326, 450, '■', AM, 20, 'start', halo=False) + T(348, 450, 'kedua-duanya', MU3, 16, 'start', halo=False))
add('9.4', 'CONTOH BERLANGKAH', 'Dua dadu: "atau"',
    P('Dua biji dadu dilambung. <i>A</i> = sekurang-kurangnya satu nombor 6, <i>B</i> = kedua-dua nombor sama. Cari P(<i>A</i> atau <i>B</i>).', True)
    + STEPS(['n(<i>A</i>) = 11, n(<i>B</i>) = 6, <i>A</i> ∩ <i>B</i> = {(6, 6)}',
             f'{PU_} = {FR(11, 36)} + {FR(6, 36)} − {FR(1, 36)}',
             f'= {FR(16, 36)} = {FRV(pu_)}'], col)
    + ANS(f'{FRV(pu_)}'),
    svg(fig, 'Jadual dua dadu: sel dengan nombor 6, sel nombor sama dan sel (6, 6) diserlahkan'))

# 9.4-6 Ringkasan
fig = ''
SUMM = [('Peristiwa bergabung', 'n(S) = n(S₁) × n(S₂)', TR), ('Tak bersandar ("dan")', 'P(A ∩ B) = P(A) × P(B)', GR),
        ('Saling eksklusif ("atau")', 'P(A ∪ B) = P(A) + P(B)', PU), ('Tidak saling eksklusif', 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', PK),
        ('Sekurang-kurangnya satu', '1 − P(tiada langsung)', AM)]
for i, (nm, fm, cl) in enumerate(SUMM):
    y0 = 12 + i * 90
    fig += RECT(14, y0, 472, 80, SURF, cl, 16, 2.5) + T(34, y0 + 26, nm, cl, 19, 'start') + T(34, y0 + 56, fm, TX, 18, 'start')
add('9.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Kata kunci', 'Tindakan'],
          [['"dan" (∩)', 'darab sepanjang cabang'],
           ['"atau" (∪)', 'tambah laluan; tolak irisan jika bertindih'],
           ['"sekurang-kurangnya satu"', '1 − P(tiada langsung)'],
           ['tanpa pemulangan', 'kurangkan pengangka dan penyebut']], col, rv=True)
    + BUL(['Semak: jumlah kebarangkalian semua kesudahan ialah 1.',
           'Jawapan kebarangkalian sentiasa antara 0 dan 1.'], col),
    svg(fig, 'Ringkasan rumus kebarangkalian peristiwa bergabung'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, '#1E2A40', DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body
assert counts == {'9.1': 6, '9.2': 6, '9.3': 6, '9.4': 6}, counts

js = ('/* Dijana oleh tools/peristiwa/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
