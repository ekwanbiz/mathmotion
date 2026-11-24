# Penjana slaid NOTA POLA (Tingkatan 2 Bab 1 Pola dan Jujukan) -> pola/slides.js
# Jalankan:  python3 tools/pola/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'pola', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '1.1': ('Pola', C['am']),
    '1.2': ('Jujukan', C['tr']),
    '1.3': ('Pola dan Jujukan', C['gr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- semakan matematik ----------
def arit(a, d, n):
    return [a + d * i for i in range(n)]
def geom(a, r, n):
    return [a * r ** i for i in range(n)]
def fib(n):
    s = [0, 1]
    while len(s) < n: s.append(s[-1] + s[-2])
    return s[:n]
def pascal(rows):
    out = [[1]]
    for _ in range(rows - 1):
        p = out[-1]; out.append([1] + [p[i] + p[i + 1] for i in range(len(p) - 1)] + [1])
    return out
def diffs(s):
    return [s[i + 1] - s[i] for i in range(len(s) - 1)]
def mstick_sq(n): return 3 * n + 1        # petak sebaris
def mstick_tri(n): return 2 * n + 1       # segi tiga sebaris (atas-bawah)
def fm(n): return ('−' if n < 0 else '') + str(abs(n))

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
def LS(vals, dots=True):
    return ', '.join(fm(v) if isinstance(v, int) else v for v in vals) + (', …' if dots else '')
TN = '<i>T</i><sub><i>n</i></sub>'
def Tk(k): return f'<i>T</i><sub>{k}</sub>'

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
def DOT(p, col=TX, r=6.5, st=NAV):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{st}" stroke-width="2.5"/>'
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

def ROW(y, vals, col, w=62, gap=20, ops=None, opcol=PU, hi=(), blank=(), subs=None, size=24, bh=54, x0=None):
    """Sebaris kotak nombor dengan lengkung operasi di atasnya."""
    n = len(vals); total = n * w + (n - 1) * gap
    x0 = (W - total) / 2 if x0 is None else x0
    s = ''
    cx = [x0 + i * (w + gap) + w / 2 for i in range(n)]
    for i, v in enumerate(vals):
        x = x0 + i * (w + gap)
        if i in blank:
            s += RECT(x, y - bh / 2, w, bh, f'{col}1A', col, 12, 2.5)
        elif i in hi:
            s += RECT(x, y - bh / 2, w, bh, f'{col}33', col, 12, 2.5)
        else:
            s += RECT(x, y - bh / 2, w, bh, SURF, BD, 12, 2)
        s += T(cx[i], y + 1, v if isinstance(v, str) else fm(v), col if (i in hi or i in blank) else TX, size)
        if subs: s += T(cx[i], y + bh / 2 + 20, subs[i], MU, 20, halo=False)
    if ops:
        for i, o in enumerate(ops):
            if o is None: continue
            a, b = cx[i] + 6, cx[i + 1] - 6; m = (a + b) / 2; top = y - bh / 2 - 4
            oc = opcol[i] if isinstance(opcol, list) else opcol
            s += f'<path d="M{r1(a)} {r1(top)} Q{r1(m)} {r1(top - 34)} {r1(b)} {r1(top)}" fill="none" stroke="{oc}" stroke-width="3" stroke-linecap="round"/>'
            s += f'<path d="M{r1(b - 9)} {r1(top - 7)} L{r1(b)} {r1(top)} L{r1(b - 1)} {r1(top - 11)}" fill="none" stroke="{oc}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
            s += T(m, top - 30, o, oc, 17)
    return s

def STICK(p, q, col=AM, head=RD, sw=6):
    """Batang mancis: batang + kepala bulat."""
    return LINE(p, q, col, sw) + f'<circle cx="{r1(q[0])}" cy="{r1(q[1])}" r="5.5" fill="{head}"/>'
def SQ_ROW(x0, y0, n, s=34):
    """n petak sebaris daripada batang mancis. Pulangkan (svg, bilangan batang)."""
    out, cnt = '', 0
    for i in range(n):
        x = x0 + i * s
        out += STICK((x + 4, y0), (x + s - 4, y0)); cnt += 1          # atas
        out += STICK((x + 4, y0 + s), (x + s - 4, y0 + s)); cnt += 1  # bawah
    for i in range(n + 1):
        x = x0 + i * s
        out += STICK((x, y0 + s - 4), (x, y0 + 4)); cnt += 1          # tegak
    return out, cnt
def TRI_ROW(x0, y0, n, s=40):
    """n segi tiga berselang atas-bawah sebaris (berkongsi sisi). Pulangkan (svg, bilangan batang)."""
    h = s * math.sqrt(3) / 2
    Bv = lambda j: (x0 + j * s, y0 + h)
    Tv = lambda j: (x0 + s / 2 + j * s, y0)
    edges = []
    for i in range(n):
        if i % 2 == 0: tri_ = [Bv(i // 2), Bv(i // 2 + 1), Tv(i // 2)]
        else: tri_ = [Tv((i - 1) // 2), Tv((i + 1) // 2), Bv((i + 1) // 2)]
        for a_, b_ in [(0, 1), (1, 2), (2, 0)]:
            e = tuple(sorted([tri_[a_], tri_[b_]]))
            if e not in edges: edges.append(e)
    out = ''
    for p_, q_ in edges:
        dx, dy = q_[0] - p_[0], q_[1] - p_[1]; L = math.hypot(dx, dy)
        out += STICK((p_[0] + dx / L * 4, p_[1] + dy / L * 4), (q_[0] - dx / L * 4, q_[1] - dy / L * 4))
    return out, len(edges)

def CARDS(cases, y0=48, step=80, foot=None):
    fig = ''
    for i, (t, ok) in enumerate(cases):
        y = y0 + i * step
        fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
        fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
    if foot: fig += T(250, 452, foot, MU3, 18, halo=False)
    return fig

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 1.1 POLA =====================
col = SUB['1.1'][1]

# 1.1-1 Definisi
s1 = arit(3, 4, 5); assert s1 == [3, 7, 11, 15, 19]
fig = T(250, 34, 'Pola nombor', MU3, 19, halo=False)
fig += ROW(128, s1, AM, ops=['+4'] * 4)
fig += T(250, 196, 'Pola objek (bilangan titik)', MU3, 19, halo=False)
tri = [1, 3, 6, 10]; assert [sum(range(1, k + 1)) for k in range(1, 5)] == tri
for k in range(4):
    cx = 70 + k * 118
    for r in range(k + 1):
        for j in range(r + 1):
            fig += DOT((cx + (j - r / 2) * 22, 250 + r * 22), TR, 8)
    fig += T(cx, 362, str(tri[k]), TR, 22)
fig += T(250, 404, '1, 3, 6, 10, …   (+2, +3, +4)', PU, 19)
fig += T(250, 446, 'Setiap pola mempunyai peraturan yang tetap', MU, 17, halo=False)
add('1.1', 'DEFINISI', 'Apa itu pola?',
    DEF('<b>Pola</b> ialah satu senarai nombor atau objek yang disusun mengikut suatu <b>peraturan</b> tertentu.', col)
    + BUL([f'Pola nombor: {B(LS(s1), AM)} → tambah 4 kepada nombor sebelumnya.',
           f'Pola objek: bilangan titik {B("1, 3, 6, 10, …", TR)} → tambah 2, 3, 4, …',
           'Pola juga terdapat dalam kehidupan: jubin lantai, corak batik, susunan kerusi.'], col)
    + NOTE('Untuk mengenal pola, bandingkan setiap nombor dengan nombor <b>sebelumnya</b>.'),
    svg(fig, 'Pola nombor 3, 7, 11, 15, 19 dan pola objek titik 1, 3, 6, 10'))

# 1.1-2 Menghuraikan pola nombor
EX = [(arit(5, 5, 5), 'Tambah 5 kepada nombor sebelumnya', ['+5'] * 4, GR),
      (arit(50, -7, 5), 'Tolak 7 daripada nombor sebelumnya', ['−7'] * 4, RD),
      (geom(1, 3, 5), 'Darab nombor sebelumnya dengan 3', ['×3'] * 4, PU),
      ([64, 32, 16, 8, 4], 'Bahagi nombor sebelumnya dengan 2', ['÷2'] * 4, PA)]
assert EX[1][0] == [50, 43, 36, 29, 22] and EX[2][0] == [1, 3, 9, 27, 81]
assert all(EX[3][0][i] == EX[3][0][i + 1] * 2 for i in range(4))
fig = ''
for i, (seq, d, ops, cl) in enumerate(EX):
    y = 72 + i * 116
    fig += ROW(y, seq, cl, w=60, gap=24, ops=ops, opcol=cl, size=22, bh=46)
    fig += T(250, y + 36, d, MU3, 15, halo=False)
add('1.1', 'CONTOH', 'Menghuraikan pola nombor',
    STEPS(['Cari perbezaan atau hubungan antara dua nombor berturutan.',
           'Semak hubungan itu sama bagi <b>semua</b> pasangan nombor.',
           'Huraikan pola dengan perkataan: tambah, tolak, darab atau bahagi.'], col)
    + TABLE(['Pola', 'Huraian'], [[LS(s, True), d] for s, d, _, _ in EX], col),
    svg(fig, 'Empat pola nombor: tambah 5, tolak 7, darab 3 dan bahagi 2'))

# 1.1-3 Pola objek (mancis)
fig = ''
cnts = []
for k in range(1, 4):
    y = 34 + (k - 1) * 132
    g, c = SQ_ROW(36, y, k, 66); fig += g; cnts.append(c)
    fig += T(36, y + 88, f'Rajah {k}', MU, 16, 'start', halo=False)
    fig += T(474, y + 33, f'{c} batang', AM, 22, 'end')
assert cnts == [4, 7, 10] == [mstick_sq(n) for n in (1, 2, 3)]
fig += T(250, 446, '4, 7, 10, …   tambah 3 setiap kali', PU, 20)
add('1.1', 'POLA OBJEK', 'Pola batang mancis',
    P('Rajah menunjukkan petak yang dibina daripada batang mancis.')
    + STEPS(['Kira batang mancis: Rajah 1 = 4, Rajah 2 = 7, Rajah 3 = 10.',
             'Perbezaan: 7 − 4 = 3, 10 − 7 = 3.',
             'Setiap petak baharu memerlukan <b>3</b> batang lagi (satu sisi dikongsi).'], col)
    + ANS('Pola: tambah 3 kepada nombor sebelumnya. Rajah 4 = 13 batang.'),
    svg(fig, 'Petak batang mancis: 4, 7 dan 10 batang'))
assert mstick_sq(4) == 13

# 1.1-4 Nombor genap & ganjil
gen, gan = arit(2, 2, 5), arit(1, 2, 5)
assert all(v % 2 == 0 for v in gen) and all(v % 2 == 1 for v in gan)
fig = T(250, 30, 'Nombor genap: titik berpasangan', GR, 19)
for k, v in enumerate(gen[:4]):
    cx = 62 + k * 118
    for j in range(v):
        fig += DOT((cx - 11 + (j % 2) * 22, 70 + (j // 2) * 24), GR, 8)
    fig += T(cx, 190, str(v), GR, 22)
fig += T(250, 238, 'Nombor ganjil: ada satu titik berlebihan', PK, 19)
for k, v in enumerate(gan[:4]):
    cx = 62 + k * 118
    for j in range(v):
        last = (j == v - 1)
        fig += DOT((cx - 11 + (j % 2) * 22, 278 + (j // 2) * 24), RD if last else PK, 8)
    fig += T(cx, 398, str(v), PK, 22)
fig += T(250, 446, 'Kedua-dua pola: tambah 2', PU, 19)
add('1.1', 'NOMBOR ISTIMEWA', 'Nombor genap dan ganjil',
    BUL([f'{B("Nombor genap", GR)}: boleh dibahagi tepat dengan 2 → {LS(gen)}',
         f'{B("Nombor ganjil", PK)}: tidak boleh dibahagi tepat dengan 2 → {LS(gan)}',
         'Pola kedua-duanya: <b>tambah 2</b> kepada nombor sebelumnya.'], col)
    + NOTE('Lihat digit terakhir: 0, 2, 4, 6, 8 → genap; 1, 3, 5, 7, 9 → ganjil. Contoh: 358 genap, 471 ganjil.'),
    svg(fig, 'Titik berpasangan bagi nombor genap dan ganjil'))
assert 358 % 2 == 0 and 471 % 2 == 1

# 1.1-5 Segi tiga Pascal
PS = pascal(6)
assert PS[5] == [1, 5, 10, 10, 5, 1] and [sum(r) for r in PS] == [1, 2, 4, 8, 16, 32]
fig = ''
pos = {}
for r, row in enumerate(PS):
    for k, v in enumerate(row):
        x, y = 210 + (k - r / 2) * 64, 50 + r * 66
        pos[(r, k)] = (x, y)
for (r, k), (x, y) in pos.items():
    if r > 0 and 0 < k < r:
        if (r, k) == (4, 2):
            for pk in [(r - 1, k - 1), (r - 1, k)]:
                fig += ARROW(pos[pk], (x + (pos[pk][0] - x) * .45, y - 22), PU, 3, 9)
for (r, k), (x, y) in pos.items():
    v = PS[r][k]
    on = (r, k) == (4, 2); src = (r, k) in [(3, 1), (3, 2)]; edge = k == 0 or k == r
    fig += f'<circle cx="{r1(x)}" cy="{y}" r="23" fill="{PU + "40" if on else (TR + "26" if src else SURF)}" stroke="{PU if on else (TR if src else (AM if edge else BD))}" stroke-width="2.5"/>'
    fig += T(x, y + 1, str(v), PU if on else (TR if src else (AM if edge else TX)), 20 if v < 10 else 18, halo=False)
fig += T(462, 22, 'Jumlah', MU, 15, halo=False)
for r, row in enumerate(PS):
    fig += T(462, 50 + r * 66, str(sum(row)), GR, 20)
fig += T(210, 446, '3 + 3 = 6', PU, 20)
add('1.1', 'NOMBOR ISTIMEWA', 'Segi tiga Pascal',
    BUL([f'Setiap baris bermula dan berakhir dengan {B("1", AM)}.',
         f'Nombor lain = <b>hasil tambah dua nombor</b> di atasnya: {B("3", TR)} + {B("3", TR)} = {B("6", PU)}.',
         f'Jumlah setiap baris: {B("1, 2, 4, 8, 16, 32", GR)} → darab 2.'], col)
    + NOTE('Masyarakat Cina mengenali susunan ini sebagai <b>Segi Tiga Yang Hui</b>.', 'Tahukah anda?')
    + ANS('Baris seterusnya: 1, 6, 15, 20, 15, 6, 1'),
    svg(fig, 'Segi tiga Pascal enam baris dengan jumlah setiap baris'))
assert pascal(7)[6] == [1, 6, 15, 20, 15, 6, 1]

# 1.1-6 Nombor Fibonacci
FB = fib(9); assert FB == [0, 1, 1, 2, 3, 5, 8, 13, 21]
fig = ''
# petak Fibonacci 1,1,2,3,5,8
sz = [1, 1, 2, 3, 5, 8]; sq = [(0, 0, 1)]; x0, y0, x1, y1 = 0, 0, 1, 1
for i, s_ in enumerate(sz[1:], 1):
    d = (i - 1) % 4
    if d == 0: p = (x1, y0); x1 += s_
    elif d == 1: p = (x0, y1); y1 += s_
    elif d == 2: p = (x0 - s_, y0); x0 -= s_
    else: p = (x0, y0 - s_); y0 -= s_
    sq.append((p[0], p[1], s_))
assert (x1 - x0, y1 - y0) == (13, 8)
U = 24; ox = 250 - (x0 + x1) / 2 * U; oy = 128 - (y0 + y1) / 2 * U
cl6 = [AM, AM, TR, GR, PK, PU]
for (x, y, s_), cl in zip(sq, cl6):
    fig += RECT(ox + x * U, oy + y * U, s_ * U, s_ * U, f'{cl}26', cl, 4, 2.5)
    fig += T(ox + (x + s_ / 2) * U, oy + (y + s_ / 2) * U, str(s_), cl, 14 + 2 * min(s_, 5), halo=False)
fig += ROW(330, FB[:7], AM, w=50, gap=14, ops=[None, '0+1', '1+1', '1+2', '2+3', '3+5'], opcol=PU, size=22, bh=46, hi={6})
fig += T(250, 410, 'Sebutan seterusnya = 5 + 8 = 13', AM, 20)
fig += T(250, 448, 'Sisi petak juga mengikut pola Fibonacci', MU, 16, halo=False)
add('1.1', 'NOMBOR ISTIMEWA', 'Nombor Fibonacci',
    DEF(f'<b>Nombor Fibonacci</b>: {LS(FB)} Setiap nombor (selepas 0 dan 1) ialah <b>hasil tambah dua nombor sebelumnya</b>.', col)
    + STEPS(['Mula dengan 0 dan 1.', '0 + 1 = 1, 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, …', 'Nombor selepas 21: 13 + 21 = <b>34</b>.'], col)
    + NOTE('Pola Fibonacci terdapat dalam alam: bilangan kelopak bunga, susunan biji bunga matahari dan cengkerang.', 'Tahukah anda?'),
    svg(fig, 'Petak Fibonacci dan jujukan 0, 1, 1, 2, 3, 5, 8'))
assert fib(10)[9] == 34

# 1.1-7 Kesilapan biasa
assert geom(1, 2, 4) == [1, 2, 4, 8] and [1, 2, 4, 7] == [1, 1 + 1, 2 + 2, 4 + 3]
fig = CARDS([('1, 2, 4, … → mesti 8', False), ('Nyatakan peraturan dahulu: ×2 → 8', True),
             ('Fibonacci: 3 + 5 = 8, lalu 8 + 8', False), ('Fibonacci: 5 + 8 = 13', True),
             ('Pascal baris 1 4 6 4 1: 4 + 6 = 10', True)], foot='Semak peraturan pada SEMUA pasangan')
add('1.1', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Melihat dua nombor sahaja", RD)} ✗ → 1, 2, 4 boleh jadi ×2 (8) atau +1, +2, +3 (7). Nyatakan peraturan.',
         f'{B("Fibonacci: tambah nombor sendiri", RD)} ✗ → tambah <b>dua nombor sebelumnya</b>.',
         f'{B("Pascal: lupa nombor 1 di hujung", RD)} ✗ → setiap baris bermula dan berakhir dengan 1.',
         f'{B("Tertukar genap dan ganjil", RD)} ✗ → semak digit terakhir.'], col)
    + NOTE('Pola nombor, segi tiga Pascal dan Fibonacci semuanya mengikut <b>peraturan</b> yang tetap.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang pola'))

# ===================== 1.2 JUJUKAN =====================
col = SUB['1.2'][1]

# 1.2-1 Definisi
ja, jb = arit(2, 3, 5), [3, 7, 4, 10, 6]
assert diffs(ja) == [3, 3, 3, 3] and len(set(diffs(jb))) > 1
fig = ROW(110, ja, GR, ops=['+3'] * 4, opcol=GR)
fig += TICK(250, 178, GR, 12) + T(250, 212, 'Jujukan: pola sama (+3)', GR, 19)
fig += ROW(330, jb, RD, ops=[('+' if d > 0 else '−') + str(abs(d)) for d in diffs(jb)], opcol=RD)
fig += CROSS(250, 398, RD, 11) + T(250, 434, 'Bukan jujukan: tiada pola tetap', RD, 19)
add('1.2', 'DEFINISI', 'Apa itu jujukan?',
    DEF('<b>Jujukan</b> ialah satu set nombor atau objek yang disusun mengikut suatu <b>pola</b> tertentu.', col)
    + BUL([f'Setiap nombor dalam jujukan dipanggil <b>sebutan</b>.',
           f'{B(LS(ja), GR)} ialah jujukan (tambah 3).',
           f'{B(LS(jb, False), RD)} bukan jujukan kerana tiada pola yang tetap.'], col)
    + NOTE('Tanda <b>…</b> bermaksud jujukan itu berterusan.'),
    svg(fig, 'Contoh jujukan dan bukan jujukan'))

# 1.2-2 Kenal pasti jujukan
q1, q2 = arit(4, 5, 4), [2, 5, 7, 12]
assert diffs(q1) == [5, 5, 5] and diffs(q2) == [3, 2, 5]
q3 = geom(3, 2, 4); assert q3 == [3, 6, 12, 24]
fig = T(250, 30, 'Contoh 1', MU3, 18, halo=False) + ROW(112, q1, GR, ops=['+5'] * 3, opcol=GR) + TICK(470, 112, GR)
fig += T(250, 176, 'Contoh 2', MU3, 18, halo=False) + ROW(258, q2, RD, ops=['+3', '+2', '+5'], opcol=RD) + CROSS(470, 258, RD)
fig += T(250, 322, 'Contoh 3', MU3, 18, halo=False) + ROW(404, q3, GR, ops=['×2'] * 3, opcol=GR) + TICK(470, 404, GR)
add('1.2', 'CONTOH', 'Mengenal pasti jujukan',
    P('Tentukan sama ada setiap set nombor ialah jujukan.')
    + STEPS([f'{LS(q1, False)}: beza 5, 5, 5 → sama → <b>jujukan</b>.',
             f'{LS(q2, False)}: beza 3, 2, 5 → tidak sama → <b>bukan jujukan</b>.',
             f'{LS(q3, False)}: darab 2 setiap kali → <b>jujukan</b>.'], col)
    + NOTE('Jika beza tidak sama, cuba semak sama ada ia <b>darab</b> atau <b>bahagi</b> dengan nombor yang sama.'),
    svg(fig, 'Tiga contoh: jujukan atau bukan jujukan'))

# 1.2-3 Lengkapkan jujukan
L1 = arit(7, 4, 6); assert L1 == [7, 11, 15, 19, 23, 27]
L2 = [96, 48, 24, 12, 6]; assert all(L2[i] == 2 * L2[i + 1] for i in range(4))
fig = T(250, 34, 'Tambah 4', GR, 19)
fig += ROW(126, [7, 11, 15, 19, 23, 27], TR, w=56, gap=18, ops=['+4'] * 5, opcol=GR, blank={2, 5})
fig += T(250, 202, 'Kotak biru: sebutan yang dicari', MU, 16, halo=False)
fig += T(250, 258, 'Bahagi 2', PA, 19)
fig += ROW(350, L2, TR, w=62, gap=22, ops=['÷2'] * 4, opcol=PA, blank={1, 4})
fig += T(250, 430, 'Semak: 96 ÷ 2 = 48 ✓', MU3, 18, halo=False)
add('1.2', 'CONTOH', 'Melengkapkan jujukan',
    P('Lengkapkan: <b>7, 11, ___, 19, 23, ___</b>')
    + STEPS(['Cari pola menggunakan sebutan yang diberi: 11 − 7 = 4, 23 − 19 = 4.',
             'Pola: tambah 4 kepada nombor sebelumnya.',
             '11 + 4 = <b>15</b>, 23 + 4 = <b>27</b>.'], col)
    + ANS('15 dan 27')
    + P(f'Begitu juga: <b>96, ___, 24, 12, ___</b> → bahagi 2 → <b>48</b> dan <b>6</b>.', True),
    svg(fig, 'Melengkapkan dua jujukan'))

# 1.2-4 Huraikan dengan perkataan
HW = [(arit(6, 6, 4), 'Tambah 6 kepada nombor sebelumnya'),
      (arit(40, -5, 4), 'Tolak 5 daripada nombor sebelumnya'),
      (geom(2, 4, 4), 'Darab nombor sebelumnya dengan 4'),
      ([243, 81, 27, 9], 'Bahagi nombor sebelumnya dengan 3'),
      (arit(-9, 3, 4), 'Tambah 3 kepada nombor sebelumnya')]
assert HW[1][0] == [40, 35, 30, 25] and HW[2][0] == [2, 8, 32, 128] and HW[4][0] == [-9, -6, -3, 0]
assert all(HW[3][0][i] == 3 * HW[3][0][i + 1] for i in range(3))
fig = ''
icons = [('+', GR), ('−', RD), ('×', PU), ('÷', PA)]
for i, (sym, cl) in enumerate(icons):
    x, y = 70 + (i % 2) * 240, 40 + (i // 2) * 210
    fig += RECT(x - 50, y, 220, 180, f'{cl}1A', cl, 20, 2.5)
    fig += T(x + 60, y + 62, sym, cl, 64)
    fig += T(x + 60, y + 128, ['Tambah', 'Tolak', 'Darab', 'Bahagi'][i], cl, 22)
    fig += T(x + 60, y + 156, ['makin besar', 'makin kecil', 'makin besar (pantas)', 'makin kecil'][i], MU, 15, halo=False)
fig += T(250, 448, 'Gunakan perkataan "nombor sebelumnya"', MU3, 17, halo=False)
add('1.2', 'PERKATAAN', 'Menghuraikan pola jujukan dengan perkataan',
    TABLE(['Jujukan', 'Pola (perkataan)'], [[LS(s), d] for s, d in HW], col, rv=True)
    + NOTE('Jujukan boleh mengandungi nombor negatif: −9, −6, −3, 0 ialah tambah 3.'),
    svg(fig, 'Empat jenis operasi pola: tambah, tolak, darab, bahagi'))

# 1.2-5 Jujukan objek
fig = ''; tc = []
for k, n in enumerate([1, 2, 3]):
    y = 34 + k * 120
    g, c = TRI_ROW(46, y, n, 70); fig += g; tc.append(c)
    fig += T(470, y + 32, f'{c} batang', AM, 22, 'end')
assert tc == [3, 5, 7] == [mstick_tri(n) for n in (1, 2, 3)]
fig += ROW(420, [3, 5, 7, '?'], TR, w=58, gap=30, ops=['+2'] * 3, opcol=GR, blank={3}, size=22, bh=44)
add('1.2', 'JUJUKAN OBJEK', 'Jujukan segi tiga batang mancis',
    P('Segi tiga dibina sebaris menggunakan batang mancis.')
    + STEPS(['Kira: 1 segi tiga = 3 batang, 2 segi tiga = 5 batang, 3 segi tiga = 7 batang.',
             'Jujukan: 3, 5, 7, … → tambah 2 kepada nombor sebelumnya.',
             'Sebutan seterusnya: 7 + 2 = <b>9</b> batang.'], col)
    + ANS('9 batang mancis untuk 4 segi tiga'),
    svg(fig, 'Segi tiga batang mancis: 3, 5, 7 batang'))
assert mstick_tri(4) == 9

# 1.2-6 Kesilapan biasa
assert arit(10, -3, 4) == [10, 7, 4, 1] and geom(5, 2, 3) == [5, 10, 20]
fig = CARDS([('10, 7, 4, … : "tambah 3"', False), ('10, 7, 4, … : "tolak 3" → 1', True),
             ('5, 10, 20, … : tambah 5 → 25', False), ('5, 10, 20, … : darab 2 → 40', True),
             ('"Tambah 4 kepada nombor sebelumnya"', True)], foot='Semak sekurang-kurangnya tiga sebutan')
add('1.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Arah salah", RD)} ✗ → jujukan menurun ialah <b>tolak</b> atau <b>bahagi</b>, bukan tambah.',
         f'{B("Semak satu pasangan sahaja", RD)} ✗ → 5, 10, 20: beza 5 kemudian 10, jadi pola ialah darab 2.',
         f'{B("Huraian tidak lengkap", RD)} ✗ "tambah 4" → tulis "tambah 4 kepada nombor sebelumnya".'], col)
    + NOTE('Jujukan = nombor atau objek mengikut pola. Lengkapkan jujukan dengan peraturan pola itu.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang jujukan'))

# ===================== 1.3 POLA DAN JUJUKAN =====================
col = SUB['1.3'][1]

# 1.3-1 Sebutan ke-n
J = arit(4, 4, 5); assert J == [4, 8, 12, 16, 20]
fig = ROW(150, J, GR, w=64, gap=22, ops=['+4'] * 4, opcol=PU, subs=['T₁', 'T₂', 'T₃', 'T₄', 'T₅'])
fig += T(250, 40, 'Kedudukan sebutan → nombor kecil di bawah T', MU3, 17, halo=False)
fig += RECT(60, 250, 380, 160, SURF, BD, 20)
fig += T(250, 290, 'T₁ = 4  (sebutan pertama)', TX, 20)
fig += T(250, 330, 'T₃ = 12  (sebutan ketiga)', TX, 20)
fig += T(250, 370, 'Tₙ = sebutan ke-n', GR, 22)
fig += T(250, 446, 'n = 1, 2, 3, … (nombor bulat positif)', MU, 17, halo=False)
add('1.3', 'DEFINISI', 'Sebutan ke-n',
    DEF(f'Setiap nombor dalam jujukan ialah <b>sebutan</b>. {TN} mewakili <b>sebutan ke-<i>n</i></b>, dengan <i>n</i> ialah kedudukan sebutan itu.', col)
    + BUL([f'Jujukan {LS(J)}: {Tk(1)} = 4, {Tk(2)} = 8, {Tk(5)} = 20.',
           f'{TN} dibaca "T n" atau "sebutan ke-<i>n</i>".',
           '<i>n</i> ialah nombor bulat positif: 1, 2, 3, …'], col)
    + NOTE(f'{Tk(3)} ialah sebutan <b>ketiga</b> (nilainya 12), bukan 3 × T.'),
    svg(fig, 'Jujukan 4, 8, 12, 16, 20 dengan label T1 hingga T5'))

# 1.3-2 Tiga cara menghuraikan pola
J2 = arit(5, 3, 4); assert J2 == [5, 8, 11, 14] == [3 * n + 2 for n in range(1, 5)]
fig = ''
rows3 = [('NOMBOR', '5, 8, 11, 14, …', AM), ('PERKATAAN', 'Tambah 3 kepada nombor sebelumnya', TR), ('ALGEBRA', 'Tₙ = 3n + 2', GR)]
for i, (lab, t, cl) in enumerate(rows3):
    y = 30 + i * 140
    fig += RECT(24, y, 452, 118, f'{cl}14', cl, 18, 2.5)
    fig += T(48, y + 32, lab, cl, 17, 'start')
    fig += T(250, y + 76, t, TX, 22 if i != 1 else 19)
add('1.3', 'GENERALISASI', 'Pola dalam tiga cara',
    P('Pola suatu jujukan boleh dinyatakan menggunakan nombor, perkataan dan ungkapan algebra.')
    + TABLE(['Cara', 'Contoh'], [['Nombor', LS(J2)], ['Perkataan', 'Tambah 3 kepada nombor sebelumnya'], ['Ungkapan algebra', f'{TN} = 3<i>n</i> + 2']], col, rv=True)
    + NOTE(f'Semak: {Tk(1)} = 3(1) + 2 = 5 ✓, {Tk(4)} = 3(4) + 2 = 14 ✓'),
    svg(fig, 'Pola 5, 8, 11, 14 dalam bentuk nombor, perkataan dan algebra'))

# 1.3-3 Mencari ungkapan Tn
J3 = arit(5, 3, 4)
fig = ''
cols = [('n', [1, 2, 3, 4], MU3), ('3n', [3 * n for n in range(1, 5)], PU), ('Tₙ', J3, GR)]
for i, (lab, vals, cl) in enumerate(cols):
    y = 40 + i * 110
    fig += RECT(20, y, 90, 70, f'{cl}26', cl, 14, 2.5) + T(65, y + 36, lab, cl, 24, italic=(i < 2))
    for j, v in enumerate(vals):
        fig += RECT(128 + j * 88, y, 74, 70, SURF, BD, 14) + T(165 + j * 88, y + 36, str(v), cl, 24)
for j in range(4):
    fig += T(165 + j * 88, 240, '+2', AM, 17)
fig += T(250, 410, 'Setiap sebutan = 3n + 2', AM, 22)
fig += T(250, 448, 'Tₙ = 3n + 2', GR, 22)
assert all(J3[j] - 3 * (j + 1) == 2 for j in range(4))
add('1.3', 'CONTOH', f'Mencari ungkapan algebra {TN}',
    P(f'Cari {TN} bagi jujukan <b>5, 8, 11, 14, …</b>')
    + STEPS(['Beza sepunya: 8 − 5 = 3. Jadi pola ada <b>3<i>n</i></b>.',
             'Bandingkan: 3<i>n</i> = 3, 6, 9, 12. Setiap sebutan lebih 2 daripada 3<i>n</i>.',
             f'Maka {TN} = 3<i>n</i> + 2. Semak: {Tk(2)} = 3(2) + 2 = 8 ✓'], col)
    + ANS(f'{TN} = 3<i>n</i> + 2'),
    svg(fig, 'Jadual n, 3n dan Tn bagi jujukan 5, 8, 11, 14'))

# 1.3-4 Sebutan tertentu
t20 = 3 * 20 + 2; assert t20 == 62
fig = ''
nodes = [(60, '20', TR), (250, '60', PU), (440, '62', GR)]
for x, v, cl in nodes:
    fig += f'<circle cx="{x}" cy="130" r="40" fill="{cl}26" stroke="{cl}" stroke-width="3"/>' + T(x, 131, v, cl, 26)
fig += ARROW((104, 130), (206, 130), AM, 4) + T(155, 106, '× 3', AM, 22)
fig += ARROW((294, 130), (396, 130), AM, 4) + T(345, 106, '+ 2', AM, 22)
fig += T(60, 192, 'n', MU, 18, italic=True) + T(440, 192, 'T₂₀', GR, 18)
fig += T(250, 40, 'Mesin Tₙ = 3n + 2', MU3, 20, halo=False)
fig += RECT(40, 250, 420, 150, SURF, BD, 18)
for i, n in enumerate([1, 5, 10]):
    fig += T(250, 290 + i * 38, f'T{"₁" if n == 1 else ("₅" if n == 5 else "₁₀")} = 3({n}) + 2 = {3 * n + 2}', TX, 20)
assert [3 * n + 2 for n in (1, 5, 10)] == [5, 17, 32]
fig += T(250, 446, 'Ganti n dengan kedudukan sebutan', MU, 17, halo=False)
add('1.3', 'CONTOH', 'Menentukan sebutan tertentu',
    P(f'Diberi {TN} = 3<i>n</i> + 2. Cari sebutan ke-20.')
    + STEPS([f'Ganti <i>n</i> = 20 dalam {TN} = 3<i>n</i> + 2.',
             f'{Tk(20)} = 3(20) + 2',
             f'{Tk(20)} = 60 + 2 = <b>62</b>'], col)
    + ANS(f'{Tk(20)} = 62')
    + NOTE('Ungkapan algebra lebih cepat daripada menyenaraikan 20 sebutan satu demi satu.'),
    svg(fig, 'Mesin Tn = 3n + 2: input 20, output 62'))

# 1.3-5 Mencari kedudukan n
n50 = F(50 - 2, 3); assert n50 == 16
n70 = F(70 - 2, 3); assert n70.denominator != 1
fig = ''
nodes = [(60, '50', GR), (250, '48', PU), (440, '16', TR)]
for x, v, cl in nodes:
    fig += f'<circle cx="{x}" cy="130" r="40" fill="{cl}26" stroke="{cl}" stroke-width="3"/>' + T(x, 131, v, cl, 26)
fig += ARROW((104, 130), (206, 130), PK, 4) + T(155, 106, '− 2', PK, 22)
fig += ARROW((294, 130), (396, 130), PK, 4) + T(345, 106, '÷ 3', PK, 22)
fig += T(60, 192, 'Tₙ', GR, 18) + T(440, 192, 'n', MU, 18, italic=True)
fig += T(250, 40, 'Songsangkan mesin: tolak 2, bahagi 3', MU3, 19, halo=False)
fig += RECT(40, 250, 420, 150, SURF, BD, 18)
fig += T(250, 288, 'Adakah 70 satu sebutan?', TX, 20)
fig += T(250, 326, '3n + 2 = 70 → n = 68 ÷ 3 = 22⅔', PK, 20)
fig += T(250, 364, 'Bukan nombor bulat → BUKAN sebutan', RD, 19)
fig += T(250, 446, 'n mesti nombor bulat positif', MU, 17, halo=False)
add('1.3', 'CONTOH', 'Mencari kedudukan sebutan',
    P(f'Bagi {TN} = 3<i>n</i> + 2, sebutan keberapakah bernilai 50?')
    + STEPS(['Bentuk persamaan: 3<i>n</i> + 2 = 50.',
             '3<i>n</i> = 48',
             '<i>n</i> = 48 ÷ 3 = <b>16</b>'], col)
    + ANS('50 ialah sebutan ke-16')
    + NOTE('Jika <i>n</i> bukan nombor bulat, nombor itu <b>bukan</b> sebutan jujukan tersebut.'),
    svg(fig, 'Mencari n apabila Tn = 50 dan menyemak sama ada 70 ialah sebutan'))

# 1.3-6 Penyelesaian masalah
fig = ''
for k in range(1, 4):
    y = 24 + (k - 1) * 98
    g, c = SQ_ROW(40, y, k, 58); fig += g
    assert c == mstick_sq(k)
    fig += T(474, y + 29, f'{c} batang', AM, 21, 'end')
fig += RECT(30, 322, 440, 130, SURF, BD, 18)
fig += T(250, 354, 'Tₙ = 3n + 1', GR, 24)
fig += T(250, 394, 'T₂₅ = 3(25) + 1 = 76', TX, 21)
fig += T(250, 430, '3n + 1 = 61 → n = 20', TX, 21)
assert mstick_sq(25) == 76 and F(61 - 1, 3) == 20
add('1.3', 'PENYELESAIAN MASALAH', 'Masalah batang mancis',
    P('Aiman membina petak sebaris daripada batang mancis: 4, 7, 10, …')
    + STEPS([f'Beza sepunya 3, dan 3(1) = 3 → lebih 1. Maka {TN} = 3<i>n</i> + 1.',
             f'(a) Batang bagi 25 petak: {Tk(25)} = 3(25) + 1 = <b>76</b>.',
             '(b) Dia ada 61 batang: 3<i>n</i> + 1 = 61 → <i>n</i> = <b>20</b> petak.'], col)
    + ANS('(a) 76 batang (b) 20 petak'),
    svg(fig, 'Petak batang mancis dan penyelesaian Tn = 3n + 1'))

# 1.3-7 Kesilapan biasa
assert 3 * 20 + 2 != 20 * 5 and 4 * 1 + 1 == 5
fig = CARDS([('5, 8, 11, … : Tₙ = 3n', False), ('5, 8, 11, … : Tₙ = 3n + 2', True),
             ('T₂₀ = 20 × T₁ = 100', False), ('T₂₀ = 3(20) + 2 = 62', True),
             ('n = 22⅔ → sebutan ke-22⅔', False)], foot='n mesti nombor bulat positif')
add('1.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Tulis beza sahaja", RD)} ✗ → selepas 3<i>n</i>, semak dengan {Tk(1)} untuk cari pemalar (+2).',
         f'{B(f"Darab T₁ dengan n", RD)} ✗ → {Tk(20)} bukan 20 × {Tk(1)}. Ganti <i>n</i> dalam ungkapan.',
         f'{B("Terima n pecahan", RD)} ✗ → <i>n</i> mesti nombor bulat positif.'], col)
    + TABLE(['Perkara', 'Langkah'],
            [[f'Cari {TN}', 'beza × <i>n</i> ± pemalar'], ['Sebutan ke-<i>k</i>', f'ganti <i>n</i> = <i>k</i>'], ['Cari <i>n</i>', f'selesaikan {TN} = nilai']], col),
    svg(fig, 'Contoh kenyataan salah dan betul tentang sebutan ke-n'))

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
assert counts == {'1.1': 7, '1.2': 6, '1.3': 7}, counts

js = ('/* Dijana oleh tools/pola/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
