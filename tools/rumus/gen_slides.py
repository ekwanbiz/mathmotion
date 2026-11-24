# Penjana slaid NOTA RUMUS (Tingkatan 2 Bab 3 Rumus Algebra) -> rumus/slides.js
# Jalankan:  python3 tools/rumus/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'rumus', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 3.1, jadi subtopik app = Standard Pembelajaran 3.1.1 - 3.1.3
SUB = {
    '3.1.1': ('Menulis Rumus', C['tr']),
    '3.1.2': ('Perkara Rumus', C['pu']),
    '3.1.3': ('Menyelesaikan Masalah', C['gr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- semakan matematik ----------
SAMPLE = [F(2), F(3), F(5), F(7, 2), F(11), F(-4), F(13, 3)]
def same(f, g, n=2, pos=False):
    """Semak dua fungsi beri nilai sama bagi beberapa nilai sampel (n pemboleh ubah)."""
    import itertools
    vals = [v for v in SAMPLE if (v > 0 or not pos)]
    for combo in itertools.product(vals, repeat=n):
        try:
            a, b = f(*combo), g(*combo)
        except (ZeroDivisionError, ValueError):
            continue
        assert abs(float(a) - float(b)) < 1e-9, (combo, a, b)
    return True

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
def SQ(x):
    """Punca kuasa dua dengan garis atas."""
    return f'<span style="white-space: nowrap">√<span style="border-top: 2px solid currentColor; padding: 0 3px">{x}</span></span>'
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def V(t):
    return f'<i>{t}</i>'
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

def tw(t, size):
    """Anggaran lebar teks (piksel)."""
    t = re.sub(r'<[^>]+>', '', str(t))
    return len(t) * size * 0.56

def EX(x, y, e, col=TX, size=22):
    """Lukis ungkapan berpusat di (x, y). e = teks | ('fr', a, b) | ('sq', a, b) punca kuasa dua pecahan
       | ('sqt', teks) punca kuasa dua teks | ('cat', [e1, e2, ...]) cantuman. Pulangkan (svg, lebar)."""
    if isinstance(e, str):
        w = tw(e, size)
        return T(x, y, e, col, size, halo=False), w
    k = e[0]
    if k == 'fr':
        w = max(tw(e[1], size), tw(e[2], size)) + 10
        s = T(x, y - size * 0.62, e[1], col, size, halo=False) + T(x, y + size * 0.7, e[2], col, size, halo=False)
        s += LINE((x - w / 2, y), (x + w / 2, y), col, 2.5)
        return s, w
    if k in ('sq', 'sqt'):
        inner = ('fr', e[1], e[2]) if k == 'sq' else e[1]
        _, wi = EX(0, 0, inner, col, size)
        tot = wi + size * 0.9
        x0 = x - tot / 2
        hh = size * 1.35 if k == 'sq' else size * 0.75
        s = (f'<path d="M{r1(x0)} {r1(y + 2)} L{r1(x0 + size * 0.22)} {r1(y - 2)} L{r1(x0 + size * 0.45)} {r1(y + hh)} '
             f'L{r1(x0 + size * 0.75)} {r1(y - hh)} L{r1(x + tot / 2)} {r1(y - hh)}" fill="none" stroke="{col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>')
        si, _ = EX(x0 + size * 0.85 + wi / 2, y, inner, col, size)
        return s + si, tot
    if k == 'cat':
        parts = [EX(0, 0, p, col, size)[1] for p in e[1]]
        tot = sum(parts) + 6 * (len(parts) - 1)
        cx = x - tot / 2; s = ''
        for p, w in zip(e[1], parts):
            s += EX(cx + w / 2, y, p, col, size)[0]; cx += w + 6
        return s, tot
    raise ValueError(e)

def bh(row):
    return 76 if any(not isinstance(e, str) for e in row[:2]) else 60

def STAGE(rows, col, x0=20, x1=480, y0=40, gap=104, size=23, hl=None):
    """Baris langkah seperti neraca: [kiri, kanan, operasi-ke-baris-ini]. Operasi dilukis pada kedua-dua belah."""
    s = ''
    mid = (x0 + x1) / 2
    bw = (x1 - x0 - 46) / 2
    for i, (L, R, op) in enumerate(rows):
        y = y0 + i * gap
        last = i == len(rows) - 1
        if op:
            # anak panah operasi pada kedua-dua belah
            for cx in (x0 + bw / 2, x1 - bw / 2):
                s += ARROW((cx, y - gap + bh(rows[i - 1]) / 2 + 4), (cx, y - bh(rows[i]) / 2 - 6), MU2, 2.5, 9)
            cw_ = tw(op, 17) + 22
            ym = (y - gap + bh(rows[i - 1]) / 2 + y - bh(rows[i]) / 2) / 2
            s += LINE((x0 + bw / 2 + 8, ym), (x1 - bw / 2 - 8, ym), col, 2, '4 5')
            s += RECT(mid - cw_ / 2, ym - 16, cw_, 32, NAV, col, 16, 2.5)
            s += T(mid, ym, op, col, 17, halo=False)
        hlc = GR if last else BD
        hh = bh(rows[i])
        s += RECT(x0, y - hh / 2, bw, hh, SURF, hlc, 14, 2.5 if last else 2)
        s += RECT(x1 - bw, y - hh / 2, bw, hh, SURF, hlc, 14, 2.5 if last else 2)
        s += T(mid, y, '=', MU3, 26, halo=False)
        s += EX(x0 + bw / 2, y, L, TX if not last else GR, size)[0]
        s += EX(x1 - bw / 2, y, R, TX if not last else GR, size)[0]
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 3.1.1 MENULIS RUMUS =====================
col = SUB['3.1.1'][1]

# 3.1.1-1 Definisi
fig = (RECT(14, 14, 472, 200)
       + T(250, 112, 'P  =  4 s', TX, 56)
       + ARROW((150, 66), (172, 92), PK, 3, 10) + T(140, 50, 'perkara rumus', PK, 17)
       + ARROW((262, 160), (252, 138), AM, 3, 10) + T(262, 182, 'pemalar', AM, 17)
       + ARROW((356, 66), (322, 92), TR, 3, 10) + T(380, 50, 'pemboleh ubah', TR, 17)
       + RECT(14, 228, 472, 228))
# segi empat sama sisi s
sq0, sl = (60, 262), 160
fig += (RECT(sq0[0], sq0[1], sl, sl, f'{TR}1A', TR, 4, 4)
        + T(sq0[0] + sl / 2, sq0[1] + sl + 18, 's', TR, 20, italic=True)
        + T(sq0[0] - 16, sq0[1] + sl / 2, 's', TR, 20, italic=True)
        + T(360, 300, 'Perimeter, P', PK, 20) + T(360, 336, '= s + s + s + s', MU3, 19, halo=False)
        + T(360, 372, '= 4s', GR, 24))
assert all(4 * s_ == s_ + s_ + s_ + s_ for s_ in SAMPLE)
add('3.1.1', 'DEFINISI', 'Pemboleh ubah, pemalar dan rumus',
    DEF(f'<b>Rumus</b> ialah persamaan yang menghubungkan satu pemboleh ubah dengan pemboleh ubah lain. Contoh: <span style="white-space: nowrap">{V("P")} = 4{V("s")}</span>.', col)
    + BUL([f'{B("Pemboleh ubah", TR)}: kuantiti yang nilainya boleh berubah, diwakili huruf seperti {V("P")} dan {V("s")}.',
           f'{B("Pemalar", AM)}: nilai yang tetap, contohnya 4.',
           f'{B("Perkara rumus", PK)}: pemboleh ubah yang bersendirian di sebelah kiri tanda =.'], col)
    + NOTE(f'4{V("s")} ialah <b>ungkapan</b>. {V("P")} = 4{V("s")} ialah <b>rumus</b> kerana ada tanda = dan perkara rumus.'),
    svg(fig, 'Rumus P = 4s bagi perimeter segi empat sama bersisi s'))

# 3.1.1-2 Membentuk rumus daripada situasi
x_, y_ = 3, 2
assert 2 * x_ + 5 * y_ == 16
fig = (RECT(14, 14, 226, 190) + RECT(260, 14, 226, 190)
       # pen
       + f'<rect x="60" y="70" width="130" height="22" rx="8" fill="{TR}"/>' + POLY([(190, 70), (214, 81), (190, 92)], AM)
       + f'<rect x="50" y="70" width="18" height="22" rx="4" fill="{DIM}"/>'
       + T(127, 40, 'Pen', TX, 20) + T(127, 130, 'RM2 sebatang', MU3, 18, halo=False) + T(127, 170, 'beli x batang', TR, 19)
       # buku
       + f'<rect x="330" y="52" width="86" height="60" rx="6" fill="{PA}40" stroke="{PA}" stroke-width="3"/>'
       + LINE((373, 52), (373, 112), PA, 3)
       + T(373, 30, 'Buku', TX, 20) + T(373, 130, 'RM5 sebuah', MU3, 18, halo=False) + T(373, 170, 'beli y buah', PA, 19)
       + ARROW((127, 210), (200, 262), MU2, 3, 10) + ARROW((373, 210), (300, 262), MU2, 3, 10)
       + RECT(60, 270, 380, 90, SURF, GR, 18, 3)
       + T(250, 302, 'Jumlah bayaran (RM)', MU3, 18, halo=False)
       + T(250, 336, 'T = 2x + 5y', GR, 30)
       + T(250, 410, 'Semak: x = 3, y = 2 → T = 6 + 10 = 16', MU3, 18, halo=False))
add('3.1.1', 'MEMBENTUK RUMUS', 'Rumus daripada situasi',
    P('Sebatang pen berharga RM2 dan sebuah buku berharga RM5. Tulis rumus bagi jumlah bayaran, RM<i>T</i>, untuk <i>x</i> batang pen dan <i>y</i> buah buku.', True)
    + STEPS([f'Harga {V("x")} batang pen = 2 × {V("x")} = 2{V("x")}',
             f'Harga {V("y")} buah buku = 5 × {V("y")} = 5{V("y")}',
             f'Jumlah bayaran = harga pen + harga buku'], col)
    + ANS(f'{V("T")} = 2{V("x")} + 5{V("y")}')
    + NOTE('Nyatakan maksud setiap huruf dan unitnya (RM, cm, kg …).'),
    svg(fig, 'Pen RM2 dan buku RM5 membentuk rumus T = 2x + 5y'))

# 3.1.1-3 Contoh: baki wang (model bar)
n_ = 5
assert 50 - 4 * n_ == 30
fig = (RECT(14, 14, 472, 442)
       + T(250, 50, 'Wang asal: RM50', TX, 22))
bx0, bx1, by = 40, 460, 90
fig += RECT(bx0, by, bx1 - bx0, 56, f'{AM}1A', AM, 10, 3) + T((bx0 + bx1) / 2, by + 28, 'RM50', AM, 22, halo=False)
cw = 46
for i in range(4):
    x0 = bx0 + i * cw
    fig += RECT(x0, by + 70, cw, 56, f'{TR}33', TR, 6, 2.5) + T(x0 + cw / 2, by + 98, '4', TR, 19, halo=False)
fig += T(bx0 + 4 * cw + 26, by + 98, '…', TR, 22, halo=False)
fig += RECT(bx0 + 4 * cw + 52, by + 70, cw, 56, f'{TR}33', TR, 6, 2.5) + T(bx0 + 4 * cw + 52 + cw / 2, by + 98, '4', TR, 19, halo=False)
ex = bx0 + 5 * cw + 52
fig += RECT(ex, by + 70, bx1 - ex, 56, f'{GR}26', GR, 6, 2.5) + T((ex + bx1) / 2, by + 98, 'B', GR, 24, italic=True)
fig += LINE((bx0, by + 146), (ex - 2, by + 146), TR, 3) + T((bx0 + ex) / 2, by + 168, 'n buku × RM4 = 4n', TR, 19)
fig += T((ex + bx1) / 2, by + 168, 'baki', GR, 19)
fig += (RECT(60, 320, 380, 110, SURF, GR, 18, 3)
        + T(250, 350, 'Baki = wang asal − jumlah harga', MU3, 18, halo=False)
        + T(250, 392, 'B = 50 − 4n', GR, 32))
add('3.1.1', 'CONTOH BERLANGKAH', 'Rumus baki wang',
    P(f'Aina mempunyai RM50. Dia membeli {V("n")} buah buku yang berharga RM4 sebuah. Tulis rumus bagi baki wangnya, RM{V("B")}.', True)
    + STEPS([f'Jumlah harga {V("n")} buah buku = 4{V("n")}',
             'Baki = wang asal − jumlah harga',
             f'{V("B")} = 50 − 4{V("n")}'], col)
    + ANS(f'{V("B")} = 50 − 4{V("n")}')
    + NOTE(f'Jika {V("n")} = 5, {V("B")} = 50 − 20 = 30. Masuk akal!', 'Semak:'),
    svg(fig, 'Model bar: RM50 dibahagi kepada n buku berharga RM4 dan baki B'))

# 3.1.1-4 Rumus daripada rajah
assert all(2 * p + 2 * l == 2 * (p + l) for p in SAMPLE for l in SAMPLE)
fig = RECT(14, 14, 472, 442)
rx0, ry0, rw, rh = 50, 70, 240, 140
fig += (RECT(rx0, ry0, rw, rh, f'{TR}1A', TR, 4, 4)
        + T(rx0 + rw / 2, ry0 - 20, 'p', TR, 22, italic=True) + T(rx0 + rw + 20, ry0 + rh / 2, 'l', PA, 22, italic=True)
        + LINE((rx0 + rw, ry0), (rx0 + rw, ry0 + rh), PA, 5)
        + T(rx0 + rw / 2, ry0 + rh / 2, 'segi empat tepat', MU3, 17, halo=False))
fig += (T(400, 92, 'P = 2p + 2l', TX, 21) + T(400, 128, '= 2(p + l)', TX, 21) + T(400, 178, 'L = pl', GR, 23))
# segi tiga
tA, tB, tC = (60, 420), (280, 420), (200, 270)
fig += (POLY([tA, tB, tC], f'{PU}26', PU, 4) + LINE(tC, (200, 420), AM, 3, '7 6')
        + f'<path d="M200 406 h14 v14" fill="none" stroke="{TX}" stroke-width="2.5"/>'
        + T(170, 442, 'a', PU, 22, italic=True) + T(214, 350, 't', AM, 22, 'start', italic=True))
fig += T(392, 330, 'L = ½ × a × t', TX, 21) + T(392, 372, 'L = ½at', GR, 23)
add('3.1.1', 'RUMUS DARIPADA RAJAH', 'Rumus perimeter dan luas',
    P('Rumus boleh dibentuk daripada ukuran pada rajah.', True)
    + TABLE(['Bentuk', 'Perimeter', 'Luas'],
            [['Segi empat tepat', f'{V("P")} = 2{V("p")} + 2{V("l")}', f'{V("L")} = {V("pl")}'],
             ['Segi empat sama', f'{V("P")} = 4{V("s")}', f'{V("L")} = {V("s")}²'],
             ['Segi tiga', '–', f'{V("L")} = {FR(1, 2)}{V("at")}']], col, rv=True)
    + NOTE(f'{V("pl")} bermaksud {V("p")} × {V("l")}. Tanda darab biasanya tidak ditulis antara huruf.'),
    svg(fig, 'Segi empat tepat p kali l dan segi tiga dengan tapak a dan tinggi t'))

# 3.1.1-5 Kesilapan biasa
g_ = 15
assert F(20 * g_, 100) == F(g_, 5) == 3
fig = RECT(14, 14, 472, 442)
rowsY = [
    (60, None, 'Gula-gula 20 sen sebiji. Jumlah RM J bagi g biji:', ''),
    (110, False, 'J = 20g', 'unit sen, bukan RM'),
    (160, True, 'J = 0.2g', '20 sen = RM0.20'),
    (232, None, 'Ali y tahun, adiknya 3 tahun lebih muda (A):', ''),
    (282, False, 'A = 3 − y', 'tertib tolak salah'),
    (332, True, 'A = y − 3', 'umur Ali tolak 3'),
    (404, False, '2x + 5y', 'tiada perkara rumus'),
]
for y, ok, a, why in rowsY:
    if ok is None:
        fig += T(36, y, a, MU3, 17, 'start', halo=False)
        continue
    fig += RECT(36, y - 21, 428, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(62, y) if ok else CROSS(62, y))
    fig += T(88, y, a, GR if ok else RD, 21, 'start') + T(448, y, why, MU, 16, 'end')
add('3.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Unit tidak sama", RD)}: tukar sen kepada RM (atau cm kepada m) dahulu.',
           f'{B("Tertib tolak", RD)}: "3 tahun lebih muda daripada {V("y")}" ialah {V("y")} − 3, bukan 3 − {V("y")}.',
           f'{B("Tiada perkara rumus", RD)}: 2{V("x")} + 5{V("y")} hanya ungkapan. Tulis {V("T")} = 2{V("x")} + 5{V("y")}.'], col)
    + NOTE('Uji rumus anda dengan nombor yang mudah. Jika jawapan tidak masuk akal, semak semula.', 'Petua:'),
    svg(fig, 'Contoh rumus betul dan salah'))

# 3.1.1-6 Ringkasan
fig = ''
FLOW = [('1', 'Baca situasi', 'Apakah kuantiti yang terlibat?', TR),
        ('2', 'Pilih huruf', 'Pemboleh ubah: x, y, n … dan unitnya', PU),
        ('3', 'Tulis hubungan', 'Guna +, −, ×, ÷, kuasa dua', AM),
        ('4', 'Lengkapkan rumus', 'perkara rumus = ungkapan', GR)]
for i, (n, t1, t2, cl) in enumerate(FLOW):
    y0 = 18 + i * 112
    fig += RECT(14, y0, 472, 94, SURF, cl, 18, 2.5)
    fig += f'<circle cx="62" cy="{y0 + 47}" r="24" fill="{cl}"/>' + T(62, y0 + 48, n, NAV, 22, halo=False)
    fig += T(104, y0 + 32, t1, cl, 22, 'start') + T(104, y0 + 64, t2, MU3, 17, 'start', halo=False)
    if i < 3:
        fig += ARROW((62, y0 + 74), (62, y0 + 128), cl, 3, 8)
add('3.1.1', 'RINGKASAN', 'Ringkasan: menulis rumus',
    TABLE(['Situasi', 'Rumus'],
          [[f'{V("x")} pen RM2 + {V("y")} buku RM5', f'{V("T")} = 2{V("x")} + 5{V("y")}'],
           [f'RM50 tolak {V("n")} buku RM4', f'{V("B")} = 50 − 4{V("n")}'],
           [f'Luas segi empat sama bersisi {V("s")}', f'{V("L")} = {V("s")}²']], col, rv=True)
    + BUL(['Rumus mesti ada <b>perkara rumus</b>, tanda = dan ungkapan.',
           'Semua kuantiti mesti dalam <b>unit yang sama</b>.'], col),
    svg(fig, 'Empat langkah menulis rumus'))

# ===================== 3.1.2 PERKARA RUMUS =====================
col = SUB['3.1.2'][1]

# 3.1.2-1 Definisi
fig = RECT(14, 14, 472, 442)
# neraca
cx, by_ = 250, 150
fig += (LINE((cx, by_), (cx, 360), MU2, 7) + LINE((180, 366), (320, 366), MU2, 9)
        + LINE((70, by_), (430, by_), PU, 8) + f'<circle cx="{cx}" cy="{by_}" r="11" fill="{AM}"/>')
for px in (110, 390):
    fig += LINE((px, by_), (px - 46, 250), MU2, 2.5) + LINE((px, by_), (px + 46, 250), MU2, 2.5)
    fig += f'<path d="M{px - 64} 250 H{px + 64} A64 26 0 0 1 {px - 64} 250 Z" fill="{PU}26" stroke="{PU}" stroke-width="3"/>'
fig += T(110, 226, 'v', PK, 40, italic=True) + T(390, 226, 'u + at', TX, 30)
fig += T(110, 60, 'perkara rumus', PK, 19) + ARROW((110, 76), (110, 196), PK, 3, 10)
fig += T(390, 60, 'ungkapan', MU3, 19) + T(250, 410, 'Kedua-dua belah sentiasa seimbang', MU3, 18, halo=False)
add('3.1.2', 'DEFINISI', 'Apa itu perkara rumus?',
    DEF(f'<b>Perkara rumus</b> ialah pemboleh ubah yang ditulis <b>bersendirian</b> di sebelah kiri tanda = (pekali 1) dan dinyatakan dalam sebutan pemboleh ubah lain.', col)
    + P(f'Dalam {V("v")} = {V("u")} + {V("at")}, perkara rumus ialah {B("<i>v</i>", PK)}.', True)
    + BUL([f'<b>Menukar perkara rumus</b> bermaksud menyusun semula rumus supaya pemboleh ubah lain menjadi perkara rumus.',
           'Rumus seperti <b>neraca</b>: apa-apa operasi mesti dibuat pada <b>kedua-dua belah</b>.'], col)
    + NOTE(f'2{V("v")} = {V("u")} + {V("at")}: {V("v")} belum perkara rumus kerana pekalinya 2.'),
    svg(fig, 'Neraca: v di sebelah kiri, u + at di sebelah kanan'))

# 3.1.2-2 Operasi songsang
fig = ''
OPS = [('+ 5', '− 5', 'tambah', 'tolak', TR), ('× 3', '÷ 3', 'darab', 'bahagi', AM), ('x²', '√x', 'kuasa dua', 'punca kuasa dua', GR)]
for i, (a, b, na, nb, cl) in enumerate(OPS):
    y0 = 18 + i * 150
    fig += RECT(14, y0, 472, 136, SURF, BD, 18, 2)
    fig += RECT(40, y0 + 26, 140, 64, NAV, cl, 16, 3) + T(110, y0 + 58, a, cl, 30)
    fig += RECT(320, y0 + 26, 140, 64, NAV, cl, 16, 3) + T(390, y0 + 58, b, cl, 30)
    fig += ARROW((196, y0 + 46), (304, y0 + 46), MU3, 3, 10) + ARROW((304, y0 + 72), (196, y0 + 72), MU3, 3, 10)
    fig += T(110, y0 + 112, na, MU3, 17, halo=False) + T(390, y0 + 112, nb, MU3, 17, halo=False)
assert all(math.isclose(math.sqrt(v * v), v) for v in (2.0, 3.5, 11.0))
add('3.1.2', 'KONSEP', 'Operasi songsang',
    P('Untuk mengasingkan sesuatu pemboleh ubah, gunakan <b>operasi songsang</b>.')
    + TABLE(['Operasi', 'Operasi songsang'],
            [['Tambah (+)', 'Tolak (−)'], ['Tolak (−)', 'Tambah (+)'], ['Darab (×)', 'Bahagi (÷)'],
             ['Bahagi (÷)', 'Darab (×)'], ['Kuasa dua ( )²', 'Punca kuasa dua (√)']], col, rv=True)
    + NOTE('Buat operasi yang <b>sama</b> pada <b>kedua-dua belah</b> rumus supaya ia kekal seimbang.'),
    svg(fig, 'Pasangan operasi songsang: tambah dan tolak, darab dan bahagi, kuasa dua dan punca kuasa dua'))

# 3.1.2-3 Contoh linear
same(lambda x, y: x, lambda x, y: (3 * x + 5 - 5) / 3)
same(lambda y, _: (y - 5) / 3 * 3 + 5, lambda y, _: y)
fig = STAGE([('y', '3x + 5', ''), ('y − 5', '3x', '− 5'), (('fr', 'y − 5', '3'), 'x', '÷ 3')], col, y0=60, gap=150)
fig += T(250, 448, 'Perkara rumus baharu: x = (y − 5) ÷ 3', MU3, 18, halo=False)
add('3.1.2', 'CONTOH BERLANGKAH', 'Menukar perkara rumus (1)',
    P(f'Jadikan {V("x")} perkara rumus bagi {V("y")} = 3{V("x")} + 5.')
    + STEPS([f'Tolak 5 pada kedua-dua belah: {V("y")} − 5 = 3{V("x")}',
             f'Bahagi 3 pada kedua-dua belah: {FR(V("y") + " − 5", 3)} = {V("x")}',
             f'Tukar sisi supaya {V("x")} di sebelah kiri.'], col)
    + ANS(f'{V("x")} = {FR(V("y") + " − 5", 3)}')
    + NOTE(f'Songsangkan mengikut tertib <b>terbalik</b>: {V("x")} didarab 3 dahulu, kemudian ditambah 5. Maka tolak 5 dahulu, kemudian bahagi 3.'),
    svg(fig, 'Langkah: y = 3x + 5, tolak 5, bahagi 3, maka x = (y − 5)/3'))

# 3.1.2-4 Contoh pecahan
same(lambda p, r: 4 * p - r, lambda p, r: 4 * p - r)
same(lambda q, r: ((q + r) / 4) * 4 - r, lambda q, r: q)
fig = STAGE([(('fr', 'q + r', '4'), 'p', ''), ('q + r', '4p', '× 4'), ('q', '4p − r', '− r')], col, y0=64, gap=150)
fig += T(250, 448, 'Semak: q = 6, r = 2 → p = 2 → 4(2) − 2 = 6 ✓', MU3, 18, halo=False)
assert F(6 + 2, 4) == 2 and 4 * 2 - 2 == 6
add('3.1.2', 'CONTOH BERLANGKAH', 'Menukar perkara rumus (2)',
    P(f'Jadikan {V("q")} perkara rumus bagi {V("p")} = {FR(V("q") + " + " + V("r"), 4)}.')
    + STEPS([f'Tukar sisi: {FR(V("q") + " + " + V("r"), 4)} = {V("p")}',
             f'Darab 4 pada kedua-dua belah: {V("q")} + {V("r")} = 4{V("p")}',
             f'Tolak {V("r")} pada kedua-dua belah: {V("q")} = 4{V("p")} − {V("r")}'], col)
    + ANS(f'{V("q")} = 4{V("p")} − {V("r")}')
    + NOTE(f'Pemboleh ubah juga boleh "berpindah" menggunakan operasi songsang, seperti {V("r")} di atas.'),
    svg(fig, 'Langkah: (q + r)/4 = p, darab 4, tolak r, maka q = 4p − r'))

# 3.1.2-5 Kuasa dua & punca kuasa dua
same(lambda A, _: math.sqrt(float(A) / math.pi), lambda A, _: math.sqrt(float(A) / math.pi), pos=True)
assert all(math.isclose(math.sqrt((math.pi * float(j) ** 2) / math.pi), float(j)) for j in SAMPLE if j > 0)
assert all(5 * float(t) ** 2 / 5 == float(t) ** 2 for t in SAMPLE)
assert all(math.isclose(math.sqrt(5 * float(t) ** 2 / 5), float(t)) for t in SAMPLE if t > 0)
fig = (T(130, 30, '(a)', PU, 20) + T(370, 30, '(b)', PU, 20)
       + STAGE([('πj²', 'A', ''), ('j²', ('fr', 'A', 'π'), '÷ π'), ('j', ('sq', 'A', 'π'), '√')], col, 14, 240, 78, 148, 21)
       + STAGE([(('sq', 'h', '5'), 't', ''), (('fr', 'h', '5'), 't²', '( )²'), ('h', '5t²', '× 5')], col, 260, 486, 78, 148, 21))
fig += T(250, 448, 'Panjang dan masa ialah nilai positif', MU3, 17, halo=False)
add('3.1.2', 'KUASA DUA & PUNCA KUASA DUA', 'Menukar perkara rumus (3)',
    P(f'(a) Jadikan {V("j")} perkara rumus bagi {V("A")} = π{V("j")}². &nbsp; (b) Jadikan {V("h")} perkara rumus bagi <span style="white-space: nowrap">{V("t")} = {SQ(FR(V("h"), 5))}</span>.', True)
    + STEPS([f'(a) Bahagi π: {V("j")}² = {FR(V("A"), "π")}, kemudian punca kuasa dua: {V("j")} = {SQ(FR(V("A"), "π"))}',
             f'(b) Kuasa duakan: {V("t")}² = {FR(V("h"), 5)}, kemudian darab 5: {V("h")} = 5{V("t")}²'], col)
    + ANS(f'(a) {V("j")} = {SQ(FR(V("A"), "π"))} &nbsp; (b) {V("h")} = 5{V("t")}²')
    + NOTE('Kuasa dua dan punca kuasa dua ialah operasi songsang. Buat pada <b>seluruh</b> sisi rumus.'),
    svg(fig, 'Langkah menukar perkara rumus bagi A = πj² dan t = punca kuasa dua h/5'))

# 3.1.2-6 Kesilapan biasa
yv = 11
assert F(yv - 5, 3) == 2 and F(yv, 3) - 5 != 2
assert math.sqrt(9 + 16) == 5 and math.sqrt(9) + math.sqrt(16) == 7
fig = RECT(14, 14, 472, 442) + T(36, 46, 'Jadikan x perkara rumus bagi y = 3x + 5:', MU3, 17, 'start', halo=False)
fig += T(36, 250, 'Jadikan a perkara rumus bagi a² = b² + c²:', MU3, 17, 'start', halo=False)
rowsY = [(96, True, ('cat', ['x =', ('fr', 'y − 5', '3')]), 'betul'),
         (164, False, ('cat', ['x =', ('fr', 'y', '3'), '− 5']), 'tertib salah'),
         (300, True, ('cat', ['a =', ('sqt', 'b² + c²')]), 'betul'),
         (370, False, 'a = b + c', '√ tidak dipecah'),
         (428, False, 'y − 5 = x', 'lupa ÷ 3')]
for y, ok, e, why in rowsY:
    hgt = 56 if not isinstance(e, str) else 42
    fig += RECT(36, y - hgt / 2, 428, hgt, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(62, y) if ok else CROSS(62, y))
    s_, w_ = EX(0, 0, e, GR if ok else RD, 21)
    fig += EX(92 + w_ / 2, y, e, GR if ok else RD, 21)[0] + T(448, y, why, MU, 16, 'end')
add('3.1.2', 'KESILAPAN BIASA', 'Semak langkah anda',
    BUL([f'{B("Tertib songsang salah", RD)}: {V("x")} = {FR(V("y"), 3)} − 5 ✗. Tolak 5 dahulu, kemudian bahagi seluruh sisi dengan 3.',
           f'{B("Memecahkan punca kuasa dua", RD)}: {SQ(V("b") + "² + " + V("c") + "²")} ≠ {V("b")} + {V("c")}. Contoh: {SQ("9 + 16")} = 5, bukan 3 + 4 = 7.',
           f'{B("Operasi pada satu belah sahaja", RD)}: neraca menjadi tidak seimbang.'], col)
    + NOTE('Gantikan satu nombor ke dalam rumus asal dan rumus baharu. Jawapan mesti sepadan.', 'Semak:'),
    svg(fig, 'Contoh langkah betul dan salah menukar perkara rumus'))

# 3.1.2-7 Ringkasan: rantai operasi
fig = RECT(14, 14, 472, 200) + RECT(14, 232, 472, 224)
fig += T(250, 44, 'Bina y daripada x', MU3, 18, halo=False)
chain = [(60, 'x', PK), (250, '3x', TX), (440, 'y', TX)]
for xx, t, cl in chain:
    fig += f'<circle cx="{xx}" cy="128" r="36" fill="{NAV}" stroke="{cl}" stroke-width="3"/>' + T(xx, 128, t, cl, 26)
fig += ARROW((100, 128), (210, 128), AM, 3.5, 11) + T(155, 102, '× 3', AM, 20)
fig += ARROW((290, 128), (400, 128), AM, 3.5, 11) + T(345, 102, '+ 5', AM, 20)
fig += T(250, 262, 'Songsangkan: tertib terbalik', MU3, 18, halo=False)
chain2 = [(440, 'y', TX), (250, 'y − 5', TX), (60, 'x', GR)]
for xx, t, cl in chain2:
    fig += f'<circle cx="{xx}" cy="346" r="40" fill="{NAV}" stroke="{cl}" stroke-width="3"/>' + T(xx, 346, t, cl, 22 if len(t) > 2 else 26)
fig += ARROW((396, 346), (294, 346), PU, 3.5, 11) + T(345, 320, '− 5', PU, 20)
fig += ARROW((206, 346), (104, 346), PU, 3.5, 11) + T(155, 320, '÷ 3', PU, 20)
fig += T(250, 424, 'x = (y − 5) ÷ 3', GR, 22)
add('3.1.2', 'RINGKASAN', 'Ringkasan: perkara rumus',
    STEPS(['Kenal pasti operasi yang dikenakan pada pemboleh ubah itu, mengikut tertib.',
           'Lakukan operasi songsang mengikut tertib <b>terbalik</b>, pada kedua-dua belah.',
           'Tulis pemboleh ubah itu bersendirian di sebelah kiri.'], col)
    + TABLE(['Rumus', 'Perkara rumus baharu'],
            [[f'{V("y")} = 3{V("x")} + 5', f'{V("x")} = {FR(V("y") + " − 5", 3)}'],
             [f'{V("A")} = π{V("j")}²', f'{V("j")} = {SQ(FR(V("A"), "π"))}']], col),
    svg(fig, 'Rantai operasi x darab 3 tambah 5 dan songsangnya tolak 5 bahagi 3'))

# ===================== 3.1.3 MENYELESAIKAN MASALAH =====================
col = SUB['3.1.3'][1]
wf = lambda t, u: 7 * t - 5 * u

# 3.1.3-1 Gantian
assert wf(3, -2) == 31
fig = RECT(14, 14, 472, 442)
fig += T(250, 70, 'w = 7t − 5u', TX, 40)
fig += RECT(110, 150, 120, 64, NAV, AM, 16, 3) + T(170, 182, 't = 3', AM, 26)
fig += RECT(270, 150, 120, 64, NAV, PK, 16, 3) + T(330, 182, 'u = −2', PK, 26)
fig += ARROW((170, 146), (208, 96), AM, 3, 10) + ARROW((330, 146), (310, 96), PK, 3, 10)
fig += T(250, 270, 'w = 7(3) − 5(−2)', TX, 30)
fig += T(250, 326, '= 21 + 10', TX, 30)
fig += RECT(150, 362, 200, 64, SURF, GR, 16, 3) + T(250, 394, 'w = 31', GR, 32)
add('3.1.3', 'GANTIAN', 'Menentukan nilai perkara rumus',
    DEF('<b>Gantikan</b> nilai yang diberi ke dalam rumus, kemudian kira.', col)
    + P(f'Diberi {V("w")} = 7{V("t")} − 5{V("u")}. Cari nilai {V("w")} apabila {V("t")} = 3 dan {V("u")} = −2.', True)
    + STEPS([f'{V("w")} = 7(3) − 5(−2)', '= 21 + 10 = 31'], col)
    + ANS(f'{V("w")} = 31')
    + NOTE('Letakkan nombor dalam <b>kurungan</b> semasa menggantikan, terutamanya nombor negatif.'),
    svg(fig, 'Gantian t = 3 dan u = −2 ke dalam w = 7t − 5u memberi w = 31'))

# 3.1.3-2 Cari pemboleh ubah yang bukan perkara rumus
assert wf(5, 4) == 15 and F(15 + 5 * 4, 7) == 5
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
fig += T(129, 46, 'Kaedah 1', AM, 21) + T(129, 74, 'ganti dahulu', MU3, 16, halo=False)
fig += T(371, 46, 'Kaedah 2', PU, 21) + T(371, 74, 'tukar perkara rumus', MU3, 16, halo=False)
L1 = ['15 = 7t − 5(4)', '15 = 7t − 20', '15 + 20 = 7t', '35 = 7t']
for i, t in enumerate(L1):
    fig += T(129, 128 + i * 60, t, TX, 21)
fig += RECT(54, 352, 150, 56, NAV, GR, 14, 3) + T(129, 380, 't = 5', GR, 26)
fig += T(371, 128, 'w + 5u = 7t', TX, 21)
fig += EX(371, 200, ('cat', ['t =', ('fr', 'w + 5u', '7')]), TX, 21)[0]
fig += EX(371, 276, ('cat', ['t =', ('fr', '15 + 20', '7')]), TX, 21)[0]
fig += RECT(296, 352, 150, 56, NAV, GR, 14, 3) + T(371, 380, 't = 5', GR, 26)
fig += T(250, 438, 'Jawapan sama!', MU3, 17, halo=False)
add('3.1.3', 'CONTOH BERLANGKAH', 'Mencari pemboleh ubah lain',
    P(f'Diberi {V("w")} = 7{V("t")} − 5{V("u")}. Cari nilai {V("t")} apabila {V("w")} = 15 dan {V("u")} = 4.', True)
    + STEPS([f'Gantikan: 15 = 7{V("t")} − 5(4) = 7{V("t")} − 20',
             f'Tambah 20 pada kedua-dua belah: 35 = 7{V("t")}',
             f'Bahagi 7: {V("t")} = 5'], col)
    + ANS(f'{V("t")} = 5')
    + NOTE(f'Kaedah lain: jadikan {V("t")} perkara rumus dahulu, {V("t")} = {FR(V("w") + " + 5" + V("u"), 7)}, kemudian gantikan.', 'Cara lain:'),
    svg(fig, 'Dua kaedah mencari t: ganti dahulu atau tukar perkara rumus dahulu'))

# 3.1.3-3 Kuasa dua: tenaga kinetik
Ek, mk = 100, 8
v2 = F(2 * Ek, mk); assert v2 == 25 and math.isqrt(25) == 5 and F(1, 2) * mk * 5 ** 2 == Ek
fig = RECT(14, 14, 472, 200)
fig += LINE((40, 170), (460, 170), MU2, 4)
fig += RECT(130, 92, 140, 64, f'{PA}40', PA, 10, 3) + f'<circle cx="160" cy="160" r="12" fill="{DIM}" stroke="{MU3}" stroke-width="3"/><circle cx="240" cy="160" r="12" fill="{DIM}" stroke="{MU3}" stroke-width="3"/>'
fig += T(200, 124, 'm = 8 kg', TX, 19) + ARROW((290, 120), (400, 120), GR, 4, 12) + T(345, 96, 'v = ?', GR, 21)
fig += T(250, 46, 'Tenaga kinetik E = 100 J', AM, 20)
fig += RECT(14, 226, 472, 230)
for i_, (e_, op_) in enumerate([(('cat', ['100 =', ('fr', '1', '2'), '(8)v²']), ''), ('100 = 4v²', 'permudahkan'), ('v² = 25', '÷ 4'), ('v = 5', '√')]):
    yy = 262 + i_ * 52
    fig += EX(170, yy, e_, GR if i_ == 3 else TX, 23)[0]
    if op_: fig += T(344, yy - 26, op_, col, 17, 'start', halo=False) + ARROW((330, yy - 40), (330, yy - 12), MU2, 2.5, 8)
add('3.1.3', 'KUASA DUA', 'Rumus dengan kuasa dua',
    P(f'Tenaga kinetik, {V("E")} = {FR(1, 2)}{V("mv")}². Cari laju {V("v")} (m/s) bagi troli berjisim {V("m")} = 8 kg yang mempunyai {V("E")} = 100 J.', True)
    + STEPS([f'100 = {FR(1, 2)}(8){V("v")}² = 4{V("v")}²',
             f'{V("v")}² = 100 ÷ 4 = 25',
             f'{V("v")} = {SQ("25")} = 5'], col)
    + ANS(f'{V("v")} = 5 m/s')
    + NOTE(f'Laju ialah nilai positif, jadi ambil {SQ("25")} = 5. Jangan berhenti pada {V("v")}² = 25.'),
    svg(fig, 'Troli 8 kg dengan tenaga kinetik 100 J, mencari laju v'))

# 3.1.3-4 Masalah harian: tambang teksi
Tf = lambda j: 4 + F(3, 2) * j
assert Tf(12) == 22 and Tf(20) == 34 and F(34 - 4) / F(3, 2) == 20
fig = RECT(14, 14, 472, 442)
fig += LINE((40, 150), (460, 150), DIM, 30, cap='butt') + LINE((40, 150), (460, 150), MU3, 2.5, '16 12', 'butt')
fig += RECT(70, 92, 96, 40, AM, NAV, 10, 2) + RECT(96, 74, 46, 24, AM, NAV, 6, 2) + T(118, 112, 'TEKSI', NAV, 13, halo=False)
fig += f'<circle cx="92" cy="134" r="9" fill="{MU2}"/><circle cx="146" cy="134" r="9" fill="{MU2}"/>'
fig += T(250, 46, 'T = 4 + 1.5j', AM, 30)
fig += T(250, 196, 'RM4 caj asas + RM1.50 setiap km', MU3, 17, halo=False)
fig += RECT(36, 228, 206, 214, SURF, TR, 16, 2.5) + RECT(258, 228, 206, 214, SURF, PU, 16, 2.5)
fig += T(139, 254, '(a) j = 12', TR, 20) + T(139, 300, 'T = 4 + 1.5(12)', TX, 18) + T(139, 340, '= 4 + 18', TX, 18) + T(139, 396, 'T = 22', GR, 26)
fig += T(361, 254, '(b) T = 34', PU, 20) + T(361, 300, '34 = 4 + 1.5j', TX, 18) + T(361, 340, '30 = 1.5j', TX, 18) + T(361, 396, 'j = 20', GR, 26)
add('3.1.3', 'MASALAH HARIAN', 'Tambang teksi',
    P(f'Tambang teksi, RM{V("T")}, bagi perjalanan sejauh {V("j")} km diberi oleh {V("T")} = 4 + 1.5{V("j")}.', True)
    + STEPS([f'(a) Jika {V("j")} = 12: {V("T")} = 4 + 1.5(12) = 4 + 18 = 22',
             f'(b) Jika {V("T")} = 34: 34 = 4 + 1.5{V("j")} → 1.5{V("j")} = 30',
             f'{V("j")} = 30 ÷ 1.5 = 20'], col)
    + ANS('(a) RM22 &nbsp; (b) 20 km')
    + NOTE('Tulis jawapan akhir dengan <b>unit</b> yang betul (RM, km).'),
    svg(fig, 'Teksi dengan rumus tambang T = 4 + 1.5j'))

# 3.1.3-5 Masalah harian: suhu
Ff = lambda c: F(9, 5) * c + 32
assert Ff(30) == 86 and Ff(100) == 212 and F(5, 9) * (212 - 32) == 100 and Ff(0) == 32
fig = RECT(14, 14, 472, 442)
# dua termometer
def thermo(x, lo, hi, marks, col_, unit, level):
    s = RECT(x - 16, 60, 32, 300, NAV, MU2, 16, 3) + f'<circle cx="{x}" cy="384" r="30" fill="{RD}" stroke="{MU2}" stroke-width="3"/>'
    top = 340 - (level - lo) / (hi - lo) * 260
    s += RECT(x - 8, top, 16, 384 - top, RD, RD, 6, 0)
    for v, lab in marks:
        y = 340 - (v - lo) / (hi - lo) * 260
        s += LINE((x + 18, y), (x + 34, y), MU3, 2.5) + T(x + 40, y, lab, col_, 18, 'start')
    s += T(x, 36, unit, col_, 22)
    return s
fig += thermo(120, 0, 100, [(0, '0'), (30, '30'), (100, '100')], TR, '°C', 30)
fig += thermo(300, 32, 212, [(32, '32'), (86, '86'), (212, '212')], PA, '°F', 86)
fig += LINE((190, 340 - 30 / 100 * 260), (282, 340 - (86 - 32) / 180 * 260), AM, 2.5, '6 6')
fig += T(420, 130, 'F =', TX, 22) + EX(420, 186, ('cat', [('fr', '9C', '5'), '+ 32']), TX, 22)[0]
fig += T(420, 270, '30 °C', TR, 20) + T(420, 300, '= 86 °F', PA, 20)
assert abs((340 - 30 / 100 * 260) - (340 - (86 - 32) / 180 * 260)) < 1e-9
add('3.1.3', 'MASALAH HARIAN', 'Penukaran suhu',
    P(f'Suhu dalam darjah Fahrenheit, {V("F")}, diberi oleh {V("F")} = {FR("9" + V("C"), 5)} + 32, dengan {V("C")} ialah suhu dalam darjah Celsius.', True)
    + STEPS([f'(a) {V("C")} = 30: {V("F")} = {FR("9(30)", 5)} + 32 = 54 + 32 = 86',
             f'(b) {V("F")} = 212: 212 − 32 = {FR("9" + V("C"), 5)} → 180 × 5 = 9{V("C")}',
             f'{V("C")} = 900 ÷ 9 = 100'], col)
    + ANS('(a) 86 °F &nbsp; (b) 100 °C')
    + NOTE('Air mendidih pada 100 °C, iaitu 212 °F.', 'Fakta:'),
    svg(fig, 'Termometer Celsius dan Fahrenheit: 30 darjah Celsius sama dengan 86 darjah Fahrenheit'))

# 3.1.3-6 Kesilapan biasa
assert -5 * -2 == 10 and (-3) ** 2 == 9 and -(3 ** 2) == -9
fig = RECT(14, 14, 472, 442)
rowsY = [(46, None, 'w = 7t − 5u, u = −2:', ''),
         (92, True, '−5(−2) = +10', 'negatif × negatif'),
         (142, False, '−5 − 2 = −7', 'tiada kurungan'),
         (200, None, 'y = x², x = −3:', ''),
         (246, True, 'y = (−3)² = 9', 'guna kurungan'),
         (296, False, 'y = −3² = −9', 'tanda hilang'),
         (354, None, '4v² = 100:', ''),
         (400, True, 'v² = 25, v = 5', 'punca kuasa dua'),
         ]
for y, ok, a, why in rowsY:
    if ok is None:
        fig += T(36, y, a, MU3, 17, 'start', halo=False)
        continue
    fig += RECT(36, y - 21, 428, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(62, y) if ok else CROSS(62, y))
    fig += T(88, y, a, GR if ok else RD, 21, 'start') + T(448, y, why, MU, 16, 'end')
fig += T(250, 446, 'Ingat: v = 25 ✗ (belum punca kuasa dua)', RD, 16, halo=False)
add('3.1.3', 'KESILAPAN BIASA', 'Elakkan kesilapan gantian',
    BUL([f'{B("Tanpa kurungan", RD)}: −5{V("u")} dengan {V("u")} = −2 ialah −5(−2) = 10, bukan −7.',
           f'{B("Kuasa dua nombor negatif", RD)}: (−3)² = 9, tetapi −3² = −9.',
           f'{B("Berhenti terlalu awal", RD)}: daripada {V("v")}² = 25, teruskan hingga {V("v")} = 5.'], col)
    + NOTE('Gantikan semula jawapan ke dalam rumus asal untuk menyemaknya.', 'Semak:'),
    svg(fig, 'Contoh gantian yang betul dan salah'))

# 3.1.3-7 Ringkasan bab
fig = ''
SUMM = [('Menulis rumus', 'T = 2x + 5y', 'situasi → huruf → hubungan', TR),
        ('Perkara rumus', 'x = (y − 5) ÷ 3', 'operasi songsang, tertib terbalik', PU),
        ('Gantian', 'w = 7(3) − 5(−2) = 31', 'ganti nilai dalam kurungan', GR)]
for i, (t1, t2, t3, cl) in enumerate(SUMM):
    y0 = 18 + i * 150
    fig += RECT(14, y0, 472, 136, SURF, cl, 18, 2.5)
    fig += T(36, y0 + 30, f'{i + 1}. {t1}', cl, 22, 'start') + T(250, y0 + 74, t2, TX, 26) + T(250, y0 + 112, t3, MU3, 17, halo=False)
add('3.1.3', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Kemahiran', 'Ingat'],
          [['Menulis rumus', 'Perkara rumus = ungkapan, unit sama'],
           ['Menukar perkara rumus', 'Operasi songsang pada kedua-dua belah'],
           ['Mencari nilai', 'Ganti nilai, kemudian selesaikan persamaan']], col, rv=True)
    + BUL(['Semak jawapan dengan menggantikannya semula ke dalam rumus asal.',
           'Nyatakan unit dalam jawapan masalah harian.'], col),
    svg(fig, 'Ringkasan tiga kemahiran rumus algebra'))

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
assert counts == {'3.1.1': 6, '3.1.2': 7, '3.1.3': 7}, counts

js = ('/* Dijana oleh tools/rumus/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
