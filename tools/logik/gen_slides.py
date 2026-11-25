# Penjana slaid NOTA LOGIK (Tingkatan 4 Bab 3 Penaakulan Logik) -> logik/slides.js
# Jalankan:  python3 tools/logik/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT, mathW

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'logik', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM: SK 3.1 Pernyataan (SP 3.1.1-3.1.6) dan SK 3.2 Hujah (SP 3.2.1-3.2.6).
# Subtopik app mengikut Standard Pembelajaran (id = SP pertama dalam kumpulan):
# 3.1.1 (+3.1.2) · 3.1.3 · 3.1.4 (+3.1.5, 3.1.6) · 3.2.1 (+3.2.2, 3.2.3) · 3.2.4 (+3.2.5, 3.2.6)
SUB = {
    '3.1.1': ('Pernyataan & Penafian', C['tr']),
    '3.1.3': ('Pernyataan Majmuk', C['pa']),
    '3.1.4': ('Implikasi', C['pu']),
    '3.2.1': ('Hujah Deduktif', C['gr']),
    '3.2.4': ('Hujah Induktif', C['pk']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
BC, PC = GR, RD   # warna tetap: Benar (hijau), Palsu (merah)

# ---------- logik untuk semakan ----------
DAN = lambda p, q: p and q
ATAU = lambda p, q: p or q
IMP = lambda p, q: (not p) or q
BP = lambda v: 'B' if v else 'P'
def is_prime(n):
    return n > 1 and all(n % d for d in range(2, int(n ** 0.5) + 1))

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
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: 18px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
VB = B('Benar', BC); VP = B('Palsu', PC)
def VV(v): return VB if v else VP

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
def MIX(x, y, parts, col=TX, size=20, anchor='middle'):
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
        if k == 's' and v and i == 0 and len(segs) > 1 and anchor != 'start': out += T(cx + w, y, v, col, size, 'end', halo=False)  # rapat dengan pecahan/punca selepasnya
        elif k == 's' and v: out += T(cx, y, v, col, size, 'start', halo=False)
        elif k == 'f': out += SFR(cx, y, v[1], v[2], col, size, 'start')
        elif k == 'r': out += SRT(cx, y + size * .35, v[1], col, size, 'start', v[2] if len(v) > 2 else None)
        cx += w + b
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
def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'
def POLY(pts, fill, stroke='none', sw=0):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    return f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
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
    """Kotak berlabel (tengah pada x, y)."""
    return RECT(x - w / 2, y - h / 2, w, h, fill or f'{col}1A', col, h / 2 if h < 50 else 16, 2.5) + (MIX(x, y, t, tcol or col, size) if isinstance(t, list) else T(x, y, t, tcol or col, size, halo=False))

def TT(x0, y0, head, rows, cw, rh=46, hl=None, hl_rows=(), head_cols=None):
    """Jadual kebenaran SVG. rows: senarai baris; nilai True/False dipapar B/P berwarna.
    hl = indeks lajur yang diserlahkan; hl_rows = baris yang diserlahkan."""
    s = ''
    tw = sum(cw)
    s += RECT(x0, y0, tw, rh * (len(rows) + 1), SURF, BD, 14, 2)
    if hl is not None:
        xh = x0 + sum(cw[:hl])
        s += RECT(xh + 3, y0 + 3, cw[hl] - 6, rh * (len(rows) + 1) - 6, f'{AM}14', AM, 10, 2)
    for r in hl_rows:
        s += RECT(x0 + 3, y0 + rh * (r + 1) + 3, tw - 6, rh - 6, f'{TR}1A', 'none', 10, 0)
    s += LINE((x0, y0 + rh), (x0 + tw, y0 + rh), BD, 2.5, cap='butt')
    x = x0
    for i, h in enumerate(head):
        if i: s += LINE((x, y0 + 6), (x, y0 + rh * (len(rows) + 1) - 6), BD, 2, cap='butt')
        hc = (head_cols[i] if head_cols else TX)
        s += T(x + cw[i] / 2, y0 + rh / 2, h, hc, 18 if len(h) < 12 else 15)
        x += cw[i]
    for j, row in enumerate(rows):
        x = x0
        for i, v in enumerate(row):
            yy = y0 + rh * (j + 1.5)
            if isinstance(v, bool):
                s += T(x + cw[i] / 2, yy, 'B' if v else 'P', BC if v else PC, 21)
            else:
                s += T(x + cw[i] / 2, yy, v, TX, 18)
            x += cw[i]
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})
FOUR = [(True, True), (True, False), (False, True), (False, False)]

# ===================== 3.1.1 PERNYATAAN & PENAFIAN =====================
col = SUB['3.1.1'][1]

# 1 Definisi pernyataan
AYAT = [('7 ialah nombor perdana.', True, 'pernyataan benar'),
        ('3 + 4 = 9', True, 'pernyataan palsu'),
        ('Adakah 9 nombor genap?', False, 'soalan'),
        ('Tutup pintu itu.', False, 'arahan'),
        ('x + 2 = 5', False, 'bergantung pada x')]
assert is_prime(7) and 3 + 4 != 9
fig = ''
for i, (a, ok, why) in enumerate(AYAT):
    y = 50 + i * 84
    fig += RECT(20, y - 32, 460, 64, SURF, GR if ok else RD, 16, 2.5)
    fig += (TICK(52, y) if ok else CROSS(52, y))
    fig += T(84, y - 10, a, TX, 20, 'start', halo=False) + T(84, y + 16, why, GR if ok else RD, 15, 'start', 600, halo=False)
fig += T(250, 452, '✓ pernyataan   ✗ bukan pernyataan', MU3, 17, halo=False)
add('3.1.1', 'DEFINISI', 'Apa itu pernyataan?',
    DEF('<b>Pernyataan</b> ialah ayat yang <b>benar</b> atau <b>palsu</b>, tetapi bukan kedua-duanya.', col)
    + BUL(['Ayat yang palsu juga ialah pernyataan, contohnya "3 + 4 = 9".',
           f'{B("Bukan pernyataan", RD)}: soalan, arahan, seruan dan ayat yang nilainya bergantung pada pemboleh ubah, contohnya <i>x</i> + 2 = 5.'], col)
    + NOTE('Tanya diri sendiri: "Bolehkah saya kata ayat ini benar atau palsu?" Jika ya, ia ialah pernyataan.'),
    svg(fig, 'Contoh ayat yang merupakan pernyataan dan yang bukan pernyataan'))

# 2 Nilai kebenaran
NK = [([('r', '49'), ' = 7'], 7 * 7 == 49), ('12 ialah gandaan 5', 12 % 5 == 0), ('−8 &lt; −3', -8 < -3),
      ('7 × 8 = 54', 7 * 8 == 54), (['0.5 = ', ('f', '1', '2')], True), ('2³ = 6', 2 ** 3 == 6)]
assert [v for _, v in NK] == [True, False, True, False, True, False]
fig = RECT(14, 14, 230, 442, f'{GR}10', GR, 18, 2.5) + RECT(256, 14, 230, 442, f'{RD}10', RD, 18, 2.5)
fig += T(129, 48, 'BENAR', GR, 24) + T(371, 48, 'PALSU', RD, 24)
yb = yp = 112
for s_, v in NK:
    if v:
        fig += PILL(129, yb, 200, 52, s_, GR, 19, SURF, TX); yb += 78
    else:
        fig += PILL(371, yp, 200, 52, s_, RD, 17 if len(s_) > 18 else 19, SURF, TX); yp += 78
fig += T(129, 400, 'B', GR, 40) + T(371, 400, 'P', RD, 40)
add('3.1.1', 'NILAI KEBENARAN', 'Benar atau palsu?',
    DEF('<b>Nilai kebenaran</b> sesuatu pernyataan ialah sama ada ia <b>benar (B)</b> atau <b>palsu (P)</b>.', col)
    + TABLE(['Pernyataan', 'Nilai kebenaran'], [[RT(49) + ' = 7', VB], ['12 ialah gandaan 5', VP], ['−8 &lt; −3', VB]], col, rv=True)
    + NOTE('Semak fakta matematik dahulu: 7 × 7 = 49, 12 ÷ 5 tidak tepat, −8 berada di kiri −3 pada garis nombor.'),
    svg(fig, 'Pernyataan diasingkan kepada kumpulan benar dan palsu'))

# 3 Semua dan sebilangan
fig = (RECT(14, 14, 472, 300, SURF, BD, 18, 2)
       + CIRC(250, 170, 135, f'{TR}14', TR, 3) + CIRC(250, 200, 72, f'{PA}26', PA, 3)
       + T(250, 62, 'segi empat tepat', TR, 19) + T(250, 200, 'segi empat sama', PA, 17)
       + RECT(14, 326, 472, 130, SURF, BD, 18, 2))
QS = [('Semua segi empat sama ialah segi empat tepat', True),
      ('Semua segi empat tepat ialah segi empat sama', False),
      ('Sebilangan segi empat tepat ialah segi empat sama', True)]
for i, (t, v) in enumerate(QS):
    y = 358 + i * 36
    fig += T(34, y, t, TX, 15.5, 'start', 600, halo=False) + T(470, y, 'B' if v else 'P', GR if v else RD, 20, 'end')
add('3.1.1', 'PENGKUANTITI', '"Semua" dan "sebilangan"',
    BUL([f'{B("Semua", col)}: benar hanya jika <b>setiap</b> objek memenuhi syarat.',
         f'{B("Sebilangan", col)}: benar jika <b>sekurang-kurangnya satu</b> objek memenuhi syarat, tetapi bukan semua.'], col)
    + P('Contoh:', True)
    + TABLE(['Pernyataan', 'Nilai'], [['Semua nombor perdana ialah nombor ganjil', f'{VP} (2 genap)'],
                                      ['Sebilangan nombor genap ialah gandaan 4', VB]], col, rv=True)
    + NOTE('Satu contoh yang tidak memenuhi syarat sudah cukup untuk menjadikan pernyataan "semua" palsu.'),
    svg(fig, 'Gambar rajah: set segi empat sama berada di dalam set segi empat tepat'))
assert not all(p % 2 for p in [2, 3, 5, 7]) and any(n % 4 == 0 for n in [2, 4, 6]) and not all(n % 4 == 0 for n in [2, 4, 6])

# 4 Penafian
fig = (RECT(14, 14, 472, 212, SURF, BD, 18, 2)
       + PILL(250, 58, 420, 52, 'p : 15 ialah gandaan 3', TR, 20, SURF, TX)
       + ARROW((250, 90), (250, 132), AM, 3.5, 11) + T(262, 111, 'tambah "bukan"', AM, 16, 'start')
       + PILL(250, 172, 420, 52, '~p : 15 bukan gandaan 3', PK, 20, SURF, TX)
       + T(444, 58, 'B', GR, 22, 'end') + T(444, 172, 'P', RD, 22, 'end')
       + TT(120, 248, ['p', '~p'], [[True, False], [False, True]], [130, 130], 54, hl=1)
       + T(250, 438, 'Penafian menterbalikkan nilai kebenaran', MU3, 17, halo=False))
assert 15 % 3 == 0
add('3.1.1', 'PENAFIAN', 'Penafian ~p',
    DEF('<b>Penafian</b> bagi pernyataan <i>p</i> ditulis <b>~<i>p</i></b> (dibaca "bukan <i>p</i>"). Ia dibentuk dengan menambah perkataan <b>"bukan"</b> atau <b>"tidak"</b>.', col)
    + BUL([f'Jika <i>p</i> {VB}, maka ~<i>p</i> {VP}.', f'Jika <i>p</i> {VP}, maka ~<i>p</i> {VB}.'], col)
    + TABLE(['<i>p</i>', '~<i>p</i>'], [['9 &gt; 4 (B)', '9 tidak lebih besar daripada 4 (P)'],
                                        ['π ialah integer (P)', 'π bukan integer (B)']], col, rv=True),
    svg(fig, 'Penafian p kepada bukan p dan jadual kebenarannya'))

# 5 Contoh berlangkah
add('3.1.1', 'CONTOH BERLANGKAH', 'Menafikan pernyataan "semua"',
    P('<i>p</i>: Semua nombor perdana ialah nombor ganjil.', True)
    + P('Tulis penafian ~<i>p</i> dan tentukan nilai kebenaran <i>p</i> dan ~<i>p</i>.', True)
    + STEPS(['Cari contoh: 2 ialah nombor perdana tetapi 2 ialah nombor genap. Maka <i>p</i> ' + VP + '.',
             '~<i>p</i>: <b>Bukan semua</b> nombor perdana ialah nombor ganjil.',
             'Penafian menterbalikkan nilai: ~<i>p</i> ' + VB + '.'], col)
    + ANS('~<i>p</i>: Bukan semua nombor perdana ialah nombor ganjil (benar)'),
    svg(RECT(14, 14, 472, 442, SURF, BD, 18, 2)
        + T(250, 48, 'Nombor perdana', TR, 21)
        + ''.join(PILL(70 + i * 90, 110, 70, 56, str(n), RD if n % 2 == 0 else TR, 24, SURF, TX) for i, n in enumerate([2, 3, 5, 7, 11]))
        + ARROW((70, 146), (70, 220), RD, 3.5, 11)
        + PILL(250, 260, 420, 66, '2 ialah nombor genap!', RD, 22, SURF, RD)
        + T(250, 330, 'Satu contoh cukup →', MU3, 18, halo=False)
        + T(250, 364, '"Semua ... ganjil" palsu', RD, 20)
        + T(250, 414, '"Bukan semua ... ganjil" benar', GR, 20),
        'Nombor perdana 2, 3, 5, 7, 11; nombor 2 ialah genap'))
assert [n for n in [2, 3, 5, 7, 11] if is_prime(n)] == [2, 3, 5, 7, 11]

# 6 Kesilapan biasa
CS = [(50, '"x + 2 = 5" ialah pernyataan', False), (124, 'Bergantung pada x → bukan pernyataan', True),
      (210, '~(Semua A ialah B): Semua A bukan B', False), (284, '~(Semua A ialah B): Bukan semua A ialah B', True),
      (370, '"3 + 4 = 9" bukan pernyataan', False), (444, 'Palsu pun pernyataan: nilainya P', True)]
fig = ''
for y, t, ok in CS:
    fig += RECT(14, y - 28, 472, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 16.5, 'start')
add('3.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Ayat terbuka", RD)} seperti <i>x</i> + 2 = 5 bukan pernyataan kerana nilainya bergantung pada <i>x</i>.',
         f'{B("Penafian \"semua\"", RD)} ialah "bukan semua", <b>bukan</b> "semua ... bukan".',
         f'{B("Pernyataan palsu", RD)} tetap pernyataan.'], col)
    + NOTE('Pernyataan mesti ada satu nilai kebenaran sahaja. ~<i>p</i> sentiasa mempunyai nilai yang bertentangan dengan <i>p</i>.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang pernyataan dan penafian'))

# ===================== 3.1.3 PERNYATAAN MAJMUK =====================
col = SUB['3.1.3'][1]

# 1 Definisi
fig = (PILL(130, 70, 220, 56, 'p: 5 ialah ganjil', TR, 18, SURF, TX) + PILL(370, 70, 220, 56, 'q: 5 ialah perdana', PU, 18, SURF, TX)
       + ARROW((130, 100), (200, 170), MU, 3, 10) + ARROW((370, 100), (300, 170), MU, 3, 10)
       + PILL(250, 200, 140, 52, 'dan', PA, 22) + PILL(250, 290, 140, 52, 'atau', PA, 22)
       + RECT(14, 340, 472, 116, SURF, BD, 16, 2)
       + T(30, 372, 'p dan q: 5 ialah nombor ganjil', TX, 17, 'start', 600, halo=False) + T(48, 398, 'dan 5 ialah nombor perdana', TX, 17, 'start', 600, halo=False)
       + T(30, 430, 'p atau q: 5 ialah ganjil atau perdana', TX, 17, 'start', 600, halo=False))
assert 5 % 2 == 1 and is_prime(5)
add('3.1.3', 'DEFINISI', 'Pernyataan majmuk',
    DEF('<b>Pernyataan majmuk</b> ialah gabungan dua atau lebih pernyataan menggunakan perkataan <b>"dan"</b> atau <b>"atau"</b>.', col)
    + BUL(['<i>p</i> dan <i>q</i>: kedua-dua syarat dinyatakan bersama.', '<i>p</i> atau <i>q</i>: sekurang-kurangnya satu syarat.'], col)
    + P('<b>Memecahkan</b>: "Heksagon mempunyai 6 sisi dan 9 pepenjuru."', True)
    + STEPS(['<i>p</i>: Heksagon mempunyai 6 sisi.', '<i>q</i>: Heksagon mempunyai 9 pepenjuru.'], col),
    svg(fig, 'Dua pernyataan p dan q digabungkan dengan dan atau atau'))
assert 6 * (6 - 3) // 2 == 9

# 2 'dan'
def series(y0):
    s = RECT(14, y0, 472, 170, SURF, BD, 18, 2)
    s += LINE((60, y0 + 110), (440, y0 + 110), MU, 4) + LINE((60, y0 + 110), (60, y0 + 60), MU, 4) + LINE((440, y0 + 110), (440, y0 + 60), MU, 4)
    s += LINE((60, y0 + 60), (140, y0 + 60), MU, 4) + LINE((360, y0 + 60), (440, y0 + 60), MU, 4)
    s += DOT((140, y0 + 60), TR, 6) + LINE((140, y0 + 60), (196, y0 + 60), TR, 5) + DOT((196, y0 + 60), TR, 6)
    s += DOT((250, y0 + 60), PU, 6) + LINE((250, y0 + 60), (300, y0 + 40), PU, 5) + DOT((306, y0 + 60), PU, 6)
    s += LINE((196, y0 + 60), (250, y0 + 60), MU, 4) + LINE((306, y0 + 60), (360, y0 + 60), MU, 4)
    s += T(168, y0 + 36, 'p', TR, 20, italic=True) + T(278, y0 + 24, 'q', PU, 20, italic=True)
    s += CIRC(250, y0 + 110, 18, f'{DIM}', MU2, 3) + T(250, y0 + 148, 'Lampu padam: q terbuka', MU3, 16, halo=False)
    return s
rows = [[p, q, DAN(p, q)] for p, q in FOUR]
assert [r[2] for r in rows] == [True, False, False, False]
fig = TT(70, 14, ['p', 'q', 'p dan q'], rows, [100, 100, 160], 50, hl=2, hl_rows=(0,)) + series(282)
add('3.1.3', 'PERKATAAN "DAN"', 'Nilai kebenaran "p dan q"',
    DEF(f'"<i>p</i> dan <i>q</i>" {VB} <b>hanya jika</b> kedua-dua <i>p</i> dan <i>q</i> benar.', col)
    + BUL(['Jika salah satu palsu, "<i>p</i> dan <i>q</i>" palsu.', 'Analogi: dua suis bersiri. Lampu menyala hanya jika <b>kedua-dua</b> suis ditutup.'], col)
    + TABLE(['Contoh', 'Nilai'], [['4 ialah genap <b>dan</b> 4 ialah kuasa dua sempurna (B dan B)', VB],
                                  ['4 ialah genap <b>dan</b> 4 ialah perdana (B dan P)', VP]], col, rv=True),
    svg(fig, 'Jadual kebenaran p dan q serta litar dua suis bersiri'))
assert 4 % 2 == 0 and not is_prime(4)

# 3 'atau'
def parallel(y0):
    s = RECT(14, y0, 472, 170, SURF, BD, 18, 2)
    s += LINE((60, y0 + 130), (440, y0 + 130), MU, 4) + LINE((60, y0 + 130), (60, y0 + 40), MU, 4) + LINE((440, y0 + 130), (440, y0 + 40), MU, 4)
    for yy, cl, lab, closed in [(y0 + 40, TR, 'p', True), (y0 + 86, PU, 'q', False)]:
        s += LINE((60, yy), (200, yy), MU, 4) + LINE((300, yy), (440, yy), MU, 4)
        s += DOT((200, yy), cl, 6) + DOT((300, yy), cl, 6)
        s += LINE((200, yy), (300, yy), cl, 5) if closed else LINE((200, yy), (290, yy - 22), cl, 5)
        s += T(250, yy - 18 if closed else yy - 26, lab, cl, 20, italic=True)
    s += LINE((60, y0 + 86), (60, y0 + 86), MU, 4)
    s += CIRC(250, y0 + 130, 18, f'{AM}', AM, 3) + T(250, y0 + 160, 'Lampu menyala: p ditutup', AM, 16, halo=False)
    return s
rows = [[p, q, ATAU(p, q)] for p, q in FOUR]
assert [r[2] for r in rows] == [True, True, True, False]
fig = TT(70, 14, ['p', 'q', 'p atau q'], rows, [100, 100, 160], 50, hl=2, hl_rows=(3,)) + parallel(282)
add('3.1.3', 'PERKATAAN "ATAU"', 'Nilai kebenaran "p atau q"',
    DEF(f'"<i>p</i> atau <i>q</i>" {VP} <b>hanya jika</b> kedua-dua <i>p</i> dan <i>q</i> palsu.', col)
    + BUL(['Jika sekurang-kurangnya satu benar, "<i>p</i> atau <i>q</i>" benar (termasuk apabila kedua-duanya benar).',
           'Analogi: dua suis selari. Lampu menyala jika <b>mana-mana</b> suis ditutup.'], col)
    + TABLE(['Contoh', 'Nilai'], [['7 &gt; 3 <b>atau</b> 7 ialah genap (B atau P)', VB],
                                  ['2 + 2 = 5 <b>atau</b> 9 ialah perdana (P atau P)', VP]], col, rv=True),
    svg(fig, 'Jadual kebenaran p atau q serta litar dua suis selari'))
assert 7 > 3 and 7 % 2 and 2 + 2 != 5 and not is_prime(9)

# 4 Contoh berlangkah
pa_, qa_ = is_prime(9), 9 % 2 == 1
pb_, qb_ = 4 ** 0.5 == 2, 2 ** 3 == 6
assert (pa_, qa_, DAN(pa_, qa_)) == (False, True, False) and (pb_, qb_, ATAU(pb_, qb_)) == (True, False, True)
fig = (RECT(14, 14, 472, 206, SURF, BD, 18, 2) + T(34, 44, '(a)', PA, 20, 'start')
       + PILL(145, 96, 180, 50, '9 ialah perdana', RD, 17, SURF, TX) + PILL(375, 96, 180, 50, '9 ialah ganjil', GR, 17, SURF, TX)
       + T(260, 96, 'dan', PA, 18) + T(145, 140, 'P', RD, 22) + T(375, 140, 'B', GR, 22)
       + PILL(250, 186, 220, 44, 'P dan B = P', RD, 20)
       + RECT(14, 236, 472, 220, SURF, BD, 18, 2) + T(34, 266, '(b)', PA, 20, 'start')
       + PILL(145, 318, 180, 50, [('r', '4'), ' = 2'], GR, 19, SURF, TX) + PILL(375, 318, 180, 50, '2³ = 6', RD, 19, SURF, TX)
       + T(260, 318, 'atau', PA, 18) + T(145, 362, 'B', GR, 22) + T(375, 362, 'P', RD, 22)
       + PILL(250, 414, 220, 44, 'B atau P = B', GR, 20))
add('3.1.3', 'CONTOH BERLANGKAH', 'Menentukan nilai kebenaran',
    P('Tentukan nilai kebenaran: (a) 9 ialah nombor perdana dan 9 ialah nombor ganjil. (b) ' + RT(4) + ' = 2 atau 2³ = 6.', True)
    + STEPS(['(a) <i>p</i>: 9 ialah perdana ' + VP + ' (9 = 3 × 3); <i>q</i>: 9 ialah ganjil ' + VB + '.',
             '"dan" memerlukan kedua-duanya benar → ' + VP + '.',
             '(b) ' + RT(4) + ' = 2 ' + VB + '; 2³ = 8, bukan 6 ' + VP + '. "atau" memerlukan satu benar → ' + VB + '.'], col)
    + ANS('(a) Palsu &nbsp; (b) Benar'),
    svg(fig, 'Penyelesaian nilai kebenaran pernyataan majmuk'))

# 5 Membina pernyataan majmuk benar/palsu
add('3.1.3', 'MEMBINA', 'Membina pernyataan majmuk',
    P('<i>p</i>: 3 ialah faktor bagi 12. &nbsp; <i>q</i>: 12 ialah nombor perdana.', True)
    + STEPS(['Nilai: <i>p</i> ' + VB + ' (12 = 3 × 4), <i>q</i> ' + VP + ' (12 ada faktor 2, 3, 4, 6).',
             'Untuk pernyataan majmuk yang <b>benar</b>, guna "atau": 3 ialah faktor bagi 12 <b>atau</b> 12 ialah nombor perdana.',
             'Untuk pernyataan majmuk yang <b>palsu</b>, guna "dan": 3 ialah faktor bagi 12 <b>dan</b> 12 ialah nombor perdana.'], col)
    + NOTE('Dengan satu B dan satu P: "atau" memberi B, "dan" memberi P.'),
    svg(TT(40, 20, ['p', 'q', 'p dan q', 'p atau q'], [[True, False, False, True]], [80, 80, 130, 130], 60, hl_rows=(0,))
        + RECT(14, 168, 472, 288, SURF, BD, 18, 2)
        + T(250, 202, 'Pilih penghubung', MU3, 18, halo=False)
        + PILL(140, 262, 200, 58, 'atau → Benar', GR, 20) + PILL(360, 262, 200, 58, 'dan → Palsu', RD, 20)
        + T(250, 340, 'p: 3 ialah faktor bagi 12  (B)', TX, 17, halo=False)
        + T(250, 376, 'q: 12 ialah nombor perdana  (P)', TX, 17, halo=False)
        + T(250, 424, 'Satu B + satu P', AM, 19),
        'Memilih dan atau atau untuk membina pernyataan majmuk benar atau palsu'))
assert 12 % 3 == 0 and not is_prime(12)

# 6 Kesilapan biasa + ringkasan
rows = [[p, q, DAN(p, q), ATAU(p, q)] for p, q in FOUR]
fig = TT(30, 14, ['p', 'q', 'p dan q', 'p atau q'], rows, [90, 90, 130, 130], 52)
fig += RECT(14, 300, 472, 156, SURF, BD, 18, 2)
fig += T(250, 334, '"dan": benar hanya jika B dan B', GR, 18, halo=False)
fig += T(250, 376, '"atau": palsu hanya jika P atau P', RD, 18, halo=False)
fig += T(250, 418, '"atau" benar walaupun kedua-duanya B', AM, 17, halo=False)
add('3.1.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("\"atau\" bukan \"salah satu sahaja\"", RD)}: jika kedua-dua <i>p</i> dan <i>q</i> benar, "<i>p</i> atau <i>q</i>" tetap {VB}.',
         f'{B("Satu P menjadikan \"dan\" palsu", RD)}: jangan nilai bahagian pertama sahaja.',
         f'{B("Nilai setiap pernyataan dahulu", RD)}, kemudian baru gabungkan.'], col)
    + NOTE('Tuliskan B atau P di bawah setiap pernyataan sebelum menentukan nilai pernyataan majmuk.', 'Petua:'),
    svg(fig, 'Jadual kebenaran lengkap bagi dan serta atau'))

# ===================== 3.1.4 IMPLIKASI =====================
col = SUB['3.1.4'][1]

# 1 Definisi
fig = (PILL(130, 90, 200, 62, 'p', TR, 30, SURF, TR) + PILL(370, 90, 200, 62, 'q', PK, 30, SURF, PK)
       + ARROW((236, 90), (264, 90), AM, 5, 12)
       + T(130, 146, 'antejadian', TR, 18) + T(370, 146, 'akibat', PK, 18)
       + RECT(14, 190, 472, 266, SURF, BD, 18, 2)
       + T(250, 224, 'Jika p, maka q', AM, 24)
       + T(36, 278, 'Jika', MU3, 18, 'start', halo=False) + T(96, 278, 'x = 3', TR, 20, 'start')
       + T(36, 318, 'maka', MU3, 18, 'start', halo=False) + T(96, 318, 'x + 4 = 7', PK, 20, 'start')
       + LINE((34, 350), (466, 350), BD, 2)
       + T(36, 388, 'p: x = 3', TR, 18, 'start') + T(36, 426, 'q: x + 4 = 7', PK, 18, 'start'))
add('3.1.4', 'DEFINISI', 'Implikasi "jika p, maka q"',
    DEF('<b>Implikasi</b> ialah pernyataan berbentuk <b>"Jika <i>p</i>, maka <i>q</i>"</b>.', col)
    + BUL([f'{B("<i>p</i>", TR)} ialah <b>antejadian</b> (syarat).', f'{B("<i>q</i>", PK)} ialah <b>akibat</b> (hasil).'], col)
    + P('Contoh: <i>p</i>: <i>m</i> ialah gandaan 6; <i>q</i>: <i>m</i> ialah gandaan 3.', True)
    + STEPS(['Implikasi: Jika <i>m</i> ialah gandaan 6, maka <i>m</i> ialah gandaan 3.'], col)
    + NOTE('Antejadian ditulis selepas "jika", akibat ditulis selepas "maka".'),
    svg(fig, 'Implikasi jika p maka q dengan antejadian dan akibat'))

# 2 Jika dan hanya jika
fig = (PILL(110, 90, 170, 60, 'p', TR, 28, SURF, TR) + PILL(390, 90, 170, 60, 'q', PK, 28, SURF, PK)
       + ARROW((200, 76), (300, 76), AM, 4, 11) + ARROW((300, 104), (200, 104), AM, 4, 11)
       + T(250, 140, 'p jika dan hanya jika q', AM, 20)
       + RECT(14, 180, 472, 276, SURF, BD, 18, 2)
       + T(250, 214, 'p: x + 2 = 6     q: x = 4', TX, 19, halo=False)
       + PILL(250, 280, 440, 56, 'Jika x + 2 = 6, maka x = 4', TR, 19, SURF, TX)
       + PILL(250, 350, 440, 56, 'Jika x = 4, maka x + 2 = 6', PK, 19, SURF, TX)
       + T(250, 418, 'Dua implikasi digabung dengan "dan"', MU3, 17, halo=False))
add('3.1.4', 'DWISYARAT', '"p jika dan hanya jika q"',
    DEF('"<i>p</i> jika dan hanya jika <i>q</i>" ialah gabungan dua implikasi: <b>Jika <i>p</i>, maka <i>q</i></b> dan <b>Jika <i>q</i>, maka <i>p</i></b>.', col)
    + P('Tulis dua implikasi daripada: "Sebuah poligon ialah pentagon jika dan hanya jika poligon itu mempunyai 5 sisi."', True)
    + STEPS(['Implikasi 1: Jika sebuah poligon ialah pentagon, maka poligon itu mempunyai 5 sisi.',
             'Implikasi 2: Jika sebuah poligon mempunyai 5 sisi, maka poligon itu ialah pentagon.'], col),
    svg(fig, 'Dwisyarat p jika dan hanya jika q sebagai dua implikasi'))

# 3 Nilai kebenaran implikasi
rows = [[p, q, IMP(p, q)] for p, q in FOUR]
assert [r[2] for r in rows] == [True, False, True, True]
fig = TT(40, 14, ['p', 'q', 'Jika p, maka q'], rows, [100, 100, 220], 54, hl=2, hl_rows=(1,))
fig += RECT(14, 304, 472, 152, SURF, BD, 18, 2)
fig += T(250, 338, 'Jika 4 ialah genap, maka 4 ialah perdana', TX, 16.5, halo=False)
fig += T(150, 378, 'B', GR, 24) + T(350, 378, 'P', RD, 24) + ARROW((180, 378), (320, 378), AM, 3.5, 10)
fig += T(250, 424, 'Implikasi ini palsu', RD, 20)
add('3.1.4', 'NILAI KEBENARAN', 'Bilakah implikasi palsu?',
    DEF(f'"Jika <i>p</i>, maka <i>q</i>" {VP} <b>hanya apabila</b> <i>p</i> benar dan <i>q</i> palsu. Dalam kes lain, implikasi itu {VB}.', col)
    + TABLE(['Implikasi', '<i>p</i>', '<i>q</i>', 'Nilai'],
            [['Jika 4 ialah genap, maka 4 ialah perdana', 'B', 'P', VP],
             ['Jika 2 &gt; 5, maka 2 + 1 &gt; 5', 'P', 'P', VB]], col, rv=True)
    + NOTE('Antejadian yang palsu tidak dapat "dilanggar", jadi implikasi itu dianggap benar.'),
    svg(fig, 'Jadual kebenaran implikasi jika p maka q'))
assert 4 % 2 == 0 and not is_prime(4) and not (2 > 5) and not (3 > 5)

# 4 Akas, songsangan, kontrapositif
# contoh: Jika x = 3, maka x² = 9
dom = range(-6, 7)
imp_ = all(IMP(x == 3, x * x == 9) for x in dom)
akas_ = all(IMP(x * x == 9, x == 3) for x in dom)
song_ = all(IMP(x != 3, x * x != 9) for x in dom)
kont_ = all(IMP(x * x != 9, x != 3) for x in dom)
assert (imp_, akas_, song_, kont_) == (True, False, False, True)
BX = [((130, 122), 'Implikasi', 'Jika p, maka q', TR, imp_), ((370, 122), 'Akas', 'Jika q, maka p', PA, akas_),
      ((130, 318), 'Songsangan', 'Jika ~p, maka ~q', PK, song_), ((370, 318), 'Kontrapositif', 'Jika ~q, maka ~p', GR, kont_)]
fig = ''
for (x, y), nm, f, cl, v in BX:
    fig += RECT(x - 112, y - 66, 224, 132, SURF, cl, 18, 3)
    fig += T(x, y - 34, nm, cl, 20) + T(x, y + 4, f, TX, 17, halo=False) + T(x, y + 40, 'Benar' if v else 'Palsu', GR if v else RD, 18)
fig += ARROW((150, 36), (350, 36), MU, 3, 9) + ARROW((350, 36), (150, 36), MU, 3, 9) + T(250, 22, 'tukar tempat p dan q', MU3, 15, halo=False)
fig += ARROW((130, 192), (130, 248), MU, 3, 9) + T(140, 220, 'nafi', MU3, 15, 'start', halo=False)
fig += ARROW((370, 192), (370, 248), MU, 3, 9) + T(380, 220, 'nafi', MU3, 15, 'start', halo=False)
fig += T(250, 418, 'Contoh: Jika x = 3, maka x² = 9', AM, 18) + T(250, 448, 'x = −3 menyangkal akas dan songsangan', MU3, 16, halo=False)
add('3.1.4', 'AKAS · SONGSANGAN · KONTRAPOSITIF', 'Tiga implikasi berkaitan',
    TABLE(['Nama', 'Bentuk', 'Cara'],
          [['Akas', 'Jika <i>q</i>, maka <i>p</i>', 'tukar tempat <i>p</i> dan <i>q</i>'],
           ['Songsangan', 'Jika ~<i>p</i>, maka ~<i>q</i>', 'nafikan <i>p</i> dan <i>q</i>'],
           ['Kontrapositif', 'Jika ~<i>q</i>, maka ~<i>p</i>', 'tukar tempat dan nafikan']], col, rv=True)
    + BUL(['Implikasi dan kontrapositifnya sentiasa mempunyai <b>nilai kebenaran yang sama</b>.',
           'Akas dan songsangan juga sentiasa sama nilai antara satu sama lain.'], col),
    svg(fig, 'Implikasi, akas, songsangan dan kontrapositif bagi jika x = 3 maka x kuasa dua = 9'))

# 5 Contoh berlangkah
dom = range(1, 201)
v1 = all(IMP(k % 4 == 0, k % 2 == 0) for k in dom)
v2 = all(IMP(k % 2 == 0, k % 4 == 0) for k in dom)
v3 = all(IMP(k % 4 != 0, k % 2 != 0) for k in dom)
v4 = all(IMP(k % 2 != 0, k % 4 != 0) for k in dom)
assert (v1, v2, v3, v4) == (True, False, False, True) and 6 % 2 == 0 and 6 % 4 != 0
add('3.1.4', 'CONTOH BERLANGKAH', 'Membina dan menilai',
    P('Implikasi: Jika <i>k</i> ialah gandaan 4, maka <i>k</i> ialah nombor genap. Tulis akas, songsangan dan kontrapositif, dan nyatakan nilai kebenarannya.', True)
    + STEPS([f'Akas: Jika <i>k</i> ialah nombor genap, maka <i>k</i> ialah gandaan 4. {VP} (<i>k</i> = 6)',
             f'Songsangan: Jika <i>k</i> bukan gandaan 4, maka <i>k</i> bukan nombor genap. {VP} (<i>k</i> = 6)',
             f'Kontrapositif: Jika <i>k</i> bukan nombor genap, maka <i>k</i> bukan gandaan 4. {VB}'], col)
    + NOTE('Implikasi asal benar, jadi kontrapositifnya juga benar.'),
    svg(RECT(14, 14, 472, 442, SURF, BD, 18, 2)
        + CIRC(250, 220, 170, f'{TR}12', TR, 3) + CIRC(250, 262, 92, f'{PU}26', PU, 3)
        + T(250, 84, 'nombor genap', TR, 20) + T(250, 222, 'gandaan 4', PU, 19)
        + T(250, 266, '4, 8, 12, ...', TX, 17, halo=False)
        + DOT((150, 160), AM, 9) + T(150, 136, '6', AM, 22)
        + T(250, 428, '6 genap tetapi bukan gandaan 4', AM, 18),
        'Gambar rajah: gandaan 4 berada di dalam set nombor genap; 6 genap tetapi bukan gandaan 4'))

# 6 Contoh penyangkal
assert (-2) ** 2 > 0 and not (-2 > 0) and is_prime(2) and 2 % 2 == 0
fig = (RECT(14, 14, 472, 200, SURF, BD, 18, 2)
       + T(250, 46, 'Jika x² > 0, maka x > 0', TX, 21, halo=False)
       + LINE((50, 140), (450, 140), MU, 3)
       + ''.join(LINE((250 + k * 40, 132), (250 + k * 40, 148), MU, 2.5) + T(250 + k * 40, 170, ('−' if k < 0 else '') + str(abs(k)), MU2, 15) for k in range(-4, 5))
       + DOT((170, 140), RD, 10) + T(170, 108, 'x = −2', RD, 19)
       + T(250, 200, '(−2)² = 4 > 0 tetapi −2 < 0', RD, 16, halo=False)
       + RECT(14, 232, 472, 224, SURF, BD, 18, 2)
       + T(250, 266, 'Semua nombor perdana ialah ganjil', TX, 18.5, halo=False)
       + PILL(250, 334, 220, 64, '2', RD, 34, SURF, RD)
       + T(250, 400, 'perdana tetapi genap', RD, 18) + T(250, 434, 'Satu contoh penyangkal sudah cukup', MU3, 16, halo=False))
add('3.1.4', 'CONTOH PENYANGKAL', 'Membuktikan pernyataan palsu',
    DEF('<b>Contoh penyangkal</b> ialah satu contoh yang menunjukkan sesuatu pernyataan atau implikasi itu <b>palsu</b>.', col)
    + BUL(['Bagi "Jika <i>p</i>, maka <i>q</i>": cari kes yang <i>p</i> benar tetapi <i>q</i> palsu.',
           'Bagi "Semua A ialah B": cari satu A yang bukan B.'], col)
    + P('Contoh penyangkal bagi "Jika <i>x</i>² &gt; 0, maka <i>x</i> &gt; 0":', True)
    + STEPS(['Pilih <i>x</i> = −2: (−2)² = 4 &gt; 0, tetapi −2 &lt; 0.'], col)
    + ANS('<i>x</i> = −2 (mana-mana nombor negatif)'),
    svg(fig, 'Contoh penyangkal x = −2 dan nombor perdana 2'))

# 7 Kesilapan biasa
CS = [(46, 'Akas: Jika ~p, maka ~q', False), (110, 'Akas: Jika q, maka p', True),
      (190, 'Implikasi benar → akas juga benar', False), (254, 'Implikasi benar → kontrapositif benar', True),
      (334, 'Implikasi palsu jika p palsu', False), (398, 'Palsu hanya apabila p B dan q P', True)]
fig = ''
for y, t, ok in CS:
    fig += RECT(14, y - 28, 472, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(42, y) if ok else CROSS(42, y)) + T(68, y, t, GR if ok else RD, 17, 'start')
fig += T(250, 448, 'Implikasi ≡ kontrapositif · akas ≡ songsangan', AM, 16, halo=False)
add('3.1.4', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Tertukar akas dengan songsangan", RD)}: akas <b>menukar tempat</b>, songsangan <b>menafikan</b>.',
         f'{B("Menganggap akas sentiasa benar", RD)}: "Jika <i>x</i> = 3, maka <i>x</i>² = 9" benar, tetapi akasnya palsu.',
         f'{B("Implikasi dengan antejadian palsu", RD)} tetap benar.'], col)
    + NOTE('Kontrapositif = tukar tempat <b>dan</b> nafikan kedua-dua bahagian.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang implikasi'))

# ===================== 3.2.1 HUJAH DEDUKTIF =====================
col = SUB['3.2.1'][1]

# 1 Hujah: deduktif vs induktif
fig = (RECT(14, 14, 230, 442, SURF, GR, 18, 2.5) + RECT(256, 14, 230, 442, SURF, PK, 18, 2.5)
       + T(129, 46, 'DEDUKTIF', GR, 21) + T(371, 46, 'INDUKTIF', PK, 21)
       + POLY([(34, 90), (224, 90), (149, 380), (109, 380)], f'{GR}1A', GR, 2.5)
       + T(129, 120, 'UMUM', GR, 20) + T(129, 166, 'Semua ...', TX, 16, halo=False)
       + T(129, 340, 'KHUSUS', GR, 17) + ARROW((129, 200), (129, 300), GR, 4, 12)
       + POLY([(351, 90), (391, 90), (466, 380), (276, 380)], f'{PK}1A', PK, 2.5)
       + T(371, 120, 'KHUSUS', PK, 17) + T(371, 350, 'UMUM', PK, 20) + T(371, 310, 'Semua ...', TX, 16, halo=False)
       + ARROW((371, 160), (371, 270), PK, 4, 12)
       + T(129, 420, 'pasti benar', MU3, 17, halo=False) + T(371, 420, 'berkemungkinan', MU3, 17, halo=False))
add('3.2.1', 'DEFINISI', 'Hujah deduktif dan induktif',
    DEF('<b>Hujah</b> terdiri daripada beberapa <b>premis</b> dan satu <b>kesimpulan</b>.', col)
    + BUL([f'{B("Hujah deduktif", GR)}: daripada premis <b>umum</b> kepada kesimpulan <b>khusus</b>.',
           f'{B("Hujah induktif", PK)}: daripada premis <b>khusus</b> kepada kesimpulan <b>umum</b>.'], col)
    + TABLE(['Hujah', 'Jenis'], [['Semua gandaan 10 boleh dibahagi tepat dengan 5. 70 ialah gandaan 10. Maka 70 boleh dibahagi tepat dengan 5.', B('Deduktif', GR)],
                                 ['4 = 2(2), 6 = 2(3), 8 = 2(4). Maka semua nombor genap boleh ditulis sebagai 2<i>n</i>.', B('Induktif', PK)]], col, rv=True),
    svg(fig, 'Hujah deduktif dari umum ke khusus, hujah induktif dari khusus ke umum'))
assert 70 % 10 == 0 and 70 % 5 == 0

# 2 Tiga bentuk hujah deduktif sah
FORMS = [('Bentuk I', 'Semua A ialah B.', 'C ialah A.', 'C ialah B.', TR),
         ('Bentuk II', 'Jika p, maka q.', 'p benar.', 'q benar.', PA),
         ('Bentuk III', 'Jika p, maka q.', 'Bukan q benar.', 'Bukan p benar.', PU)]
fig = ''
for i, (nm, a, b, c, cl) in enumerate(FORMS):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, cl, 18, 2.5)
    fig += T(34, y0 + 30, nm, cl, 21, 'start')
    fig += T(34, y0 + 66, 'Premis 1: ' + a, TX, 17, 'start', 600, halo=False)
    fig += T(34, y0 + 92, 'Premis 2: ' + b, TX, 17, 'start', 600, halo=False)
    fig += T(34, y0 + 120, 'Kesimpulan: ' + c, AM, 17, 'start')
add('3.2.1', 'BENTUK HUJAH', 'Tiga bentuk hujah deduktif yang sah',
    BUL([f'{B("Bentuk I", TR)}: menggunakan pernyataan "semua".',
         f'{B("Bentuk II", PA)}: premis 2 mengesahkan <b>antejadian</b> <i>p</i>, maka akibat <i>q</i> benar.',
         f'{B("Bentuk III", PU)}: premis 2 menafikan <b>akibat</b> <i>q</i>, maka antejadian <i>p</i> juga dinafikan.'], col)
    + NOTE('Hujah yang mengikut salah satu bentuk ini ialah hujah yang <b>sah</b>.'),
    svg(fig, 'Bentuk I, Bentuk II dan Bentuk III hujah deduktif'))

# 3 Contoh Bentuk I (gambar rajah)
assert 70 % 10 == 0 and all(k % 5 == 0 for k in range(10, 200, 10))
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2)
       + CIRC(250, 236, 196, f'{GR}10', GR, 3) + CIRC(250, 270, 112, f'{TR}22', TR, 3)
       + T(250, 70, 'gandaan 5', GR, 21) + T(250, 196, 'gandaan 10', TR, 20)
       + DOT((250, 290), AM, 10) + T(250, 322, '70', AM, 24)
       + T(120, 276, '15', MU3, 18) + DOT((120, 300), MU3, 6)
       + T(250, 440, 'A ⊂ B, C dalam A → C dalam B', MU3, 17, halo=False))
add('3.2.1', 'CONTOH BERLANGKAH', 'Melengkapkan hujah Bentuk I',
    P('Lengkapkan hujah berikut:', True)
    + P('Premis 1: Semua gandaan 10 ialah gandaan 5.<br>Premis 2: 70 ialah gandaan 10.<br>Kesimpulan: ______', True)
    + STEPS(['Kenal pasti bentuk: "Semua A ialah B" → <b>Bentuk I</b> (A = gandaan 10, B = gandaan 5).',
             'C = 70 berada di dalam set A, maka C juga di dalam set B.'], col)
    + ANS('Kesimpulan: 70 ialah gandaan 5'),
    svg(fig, 'Gambar rajah: set gandaan 10 di dalam set gandaan 5; 70 berada dalam kedua-duanya'))

# 4 Contoh Bentuk II & III
add('3.2.1', 'CONTOH BERLANGKAH', 'Bentuk II dan Bentuk III',
    P('Premis 1: Jika sebuah segi empat ialah segi empat sama, maka segi empat itu mempunyai 4 paksi simetri.', True)
    + STEPS([f'{B("Bentuk II", PA)} · Premis 2: PQRS ialah segi empat sama. <br>Kesimpulan: PQRS mempunyai 4 paksi simetri.',
             f'{B("Bentuk III", PU)} · Premis 2: KLMN tidak mempunyai 4 paksi simetri. <br>Kesimpulan: KLMN bukan segi empat sama.'], col)
    + NOTE('Bentuk II: sahkan <i>p</i> → dapat <i>q</i>. Bentuk III: nafikan <i>q</i> → dapat ~<i>p</i>.'),
    svg(RECT(14, 14, 230, 300, SURF, PA, 18, 2.5) + RECT(256, 14, 230, 300, SURF, PU, 18, 2.5)
        + T(129, 44, 'Bentuk II', PA, 20) + T(371, 44, 'Bentuk III', PU, 20)
        + RECT(69, 90, 120, 120, f'{PA}22', PA, 4, 3)
        + LINE((129, 76), (129, 224), AM, 2.5, '6 5') + LINE((55, 150), (203, 150), AM, 2.5, '6 5')
        + LINE((55, 76), (203, 224), AM, 2.5, '6 5') + LINE((203, 76), (55, 224), AM, 2.5, '6 5')
        + T(129, 256, 'PQRS: 4 paksi', AM, 18) + T(129, 286, 'simetri ✓', AM, 18)
        + POLY([(311, 200), (431, 200), (401, 100), (341, 100)], f'{PU}22', PU, 3)
        + LINE((371, 80), (371, 220), AM, 2.5, '6 5')
        + T(371, 256, 'KLMN: 1 paksi', AM, 18) + T(371, 286, 'bukan segi empat sama', PU, 15)
        + RECT(14, 330, 472, 126, SURF, BD, 18, 2)
        + T(250, 364, 'p: segi empat sama', TR, 18, halo=False) + T(250, 396, 'q: mempunyai 4 paksi simetri', PK, 18, halo=False)
        + T(250, 430, 'II: p ⇒ q  ·  III: ~q ⇒ ~p', AM, 18),
        'Segi empat sama dengan 4 paksi simetri dan trapezium sama kaki dengan 1 paksi simetri'))

# 5 Sah & munasabah
fig = (PILL(250, 50, 300, 56, 'Hujah deduktif', GR, 20, SURF, TX)
       + ARROW((250, 80), (250, 118), MU, 3, 10)
       + PILL(250, 148, 360, 56, 'Ikut Bentuk I, II atau III?', AM, 18, SURF, TX)
       + ARROW((150, 178), (100, 226), RD, 3, 10) + T(110, 196, 'Tidak', RD, 16, 'end')
       + ARROW((350, 178), (380, 226), GR, 3, 10) + T(380, 196, 'Ya', GR, 16, 'start')
       + PILL(100, 256, 160, 54, 'Tidak sah', RD, 19)
       + PILL(380, 256, 160, 54, 'Sah', GR, 19)
       + ARROW((380, 284), (380, 318), MU, 3, 10)
       + PILL(380, 348, 200, 56, 'Semua premis benar?', AM, 16, SURF, TX)
       + ARROW((330, 376), (300, 412), GR, 3, 10) + T(310, 390, 'Ya', GR, 15, 'end')
       + ARROW((430, 376), (450, 412), RD, 3, 10) + T(450, 390, 'Tidak', RD, 15, 'start')
       + PILL(240, 440, 170, 44, 'Munasabah', GR, 18)
       + PILL(420, 440, 150, 44, 'Tidak', RD, 16))
add('3.2.1', 'SAH & MUNASABAH', 'Adakah hujah itu sah dan munasabah?',
    BUL([f'{B("Sah", GR)}: kesimpulan <b>pasti benar</b> jika semua premis benar (mengikut Bentuk I, II atau III).',
         f'{B("Munasabah", GR)}: hujah itu <b>sah</b> dan <b>semua premisnya benar</b>.'], col)
    + P('Semua nombor perdana ialah nombor ganjil. 2 ialah nombor perdana. Maka 2 ialah nombor ganjil.', True)
    + STEPS(['Ikut Bentuk I → hujah <b>sah</b>.', 'Premis 1 palsu (2 ialah perdana tetapi genap) → <b>tidak munasabah</b>.'], col)
    + ANS('Sah tetapi tidak munasabah'),
    svg(fig, 'Carta alir menentukan sama ada hujah deduktif sah dan munasabah'))

# 6 Hujah tidak sah
assert (-3) ** 2 == 9
CS = [('Jika p, maka q.', 'q benar.', '∴ p benar.', 'mengesahkan akibat'),
      ('Jika p, maka q.', 'Bukan p benar.', '∴ Bukan q benar.', 'menafikan antejadian'),
      ('Semua A ialah B.', 'C ialah B.', '∴ C ialah A.', 'terbalik')]
fig = ''
for i, (a, b, c, why) in enumerate(CS):
    y0 = 14 + i * 150
    fig += RECT(14, y0, 472, 138, SURF, RD, 18, 2)
    fig += CROSS(452, y0 + 30) + T(34, y0 + 30, why, RD, 18, 'start')
    fig += T(34, y0 + 64, a, TX, 17, 'start', 600, halo=False) + T(34, y0 + 92, b, TX, 17, 'start', 600, halo=False)
    fig += T(34, y0 + 120, c, AM, 17, 'start')
add('3.2.1', 'KESILAPAN BIASA', 'Hujah yang tidak sah',
    P('Premis 1: Jika <i>x</i> = 3, maka <i>x</i>² = 9. Premis 2: <i>x</i>² = 9. Kesimpulan: <i>x</i> = 3.', True)
    + STEPS(['Premis 2 mengesahkan <b>akibat</b>, bukan antejadian. Ini bukan Bentuk II.',
             '<i>x</i> = −3 juga memberi <i>x</i>² = 9, jadi kesimpulan tidak pasti benar.'], col)
    + ANS('Hujah tidak sah')
    + NOTE('Bentuk II mesti bermula dengan <i>p</i>; Bentuk III mesti bermula dengan ~<i>q</i>.'),
    svg(fig, 'Tiga corak hujah yang tidak sah'))

# 7 Penyelesaian masalah (deduktif)
n_ = 8; S8 = (n_ - 2) * 180
assert S8 == 1080
pts = [(250 + 150 * math.cos(math.radians(22.5 + 45 * k)), 210 + 150 * math.sin(math.radians(22.5 + 45 * k))) for k in range(8)]
fig = (RECT(14, 14, 472, 442, SURF, BD, 18, 2) + POLY(pts, f'{GR}22', GR, 4)
       + ''.join(DOT(p, AM, 6) for p in pts)
       + T(250, 196, 'oktagon', GR, 22) + T(250, 230, 'n = 8', TX, 20)
       + T(250, 400, '(8 − 2) × 180° = 1080°', AM, 22))
add('3.2.1', 'PENYELESAIAN MASALAH', 'Membuat kesimpulan secara deduktif',
    P('Premis 1: Hasil tambah sudut pedalaman sebuah poligon <i>n</i> sisi ialah (<i>n</i> − 2) × 180°.<br>Premis 2: Oktagon mempunyai 8 sisi.', True)
    + STEPS(['Premis 1 ialah pernyataan umum; premis 2 ialah kes khusus (<i>n</i> = 8).',
             'Gantikan: (8 − 2) × 180° = 6 × 180° = 1080°.'], col)
    + ANS('Kesimpulan: Hasil tambah sudut pedalaman oktagon ialah 1080°'),
    svg(fig, 'Oktagon dengan hasil tambah sudut pedalaman 1080 darjah'))

# ===================== 3.2.4 HUJAH INDUKTIF =====================
col = SUB['3.2.4'][1]

# 1 Kuat dan lemah
fig = (RECT(14, 14, 472, 206, SURF, GR, 18, 2.5) + T(34, 44, 'KUAT', GR, 21, 'start')
       + ''.join(RECT(40 + i * 42, 72, 34, 84 - (i % 3) * 8, f'{TR}40', TR, 6, 2) for i in range(10))
       + T(250, 186, '10 tahun berturut-turut: hujan lebat Disember', TX, 15.5, halo=False)
       + RECT(14, 236, 472, 220, SURF, RD, 18, 2.5) + T(34, 266, 'LEMAH', RD, 21, 'start')
       + CIRC(200, 336, 30, f'{PK}40', PK, 3) + CIRC(290, 336, 30, f'{PK}40', PK, 3)
       + T(250, 400, 'Dua murid suka bola sepak →', TX, 16, halo=False)
       + T(250, 428, '"semua murid suka bola sepak"', TX, 16, halo=False))
add('3.2.4', 'KEKUATAN HUJAH', 'Hujah induktif: kuat atau lemah?',
    BUL([f'{B("Kuat", GR)}: kesimpulan <b>berkemungkinan besar benar</b> berdasarkan premis.',
         f'{B("Lemah", RD)}: kesimpulan <b>berkemungkinan tidak benar</b> walaupun premis benar (contohnya bukti terlalu sedikit).',
         f'{B("Meyakinkan", GR)}: hujah itu <b>kuat</b> dan <b>semua premisnya benar</b>.'], col)
    + NOTE('Hujah induktif tidak dinilai sebagai "sah". Ia dinilai sebagai kuat atau lemah.'),
    svg(fig, 'Contoh hujah induktif yang kuat dan yang lemah'))

# 2 Membentuk kesimpulan umum
seq = [2 * n + 1 for n in range(1, 5)]
assert seq == [3, 5, 7, 9]
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
for i, v in enumerate(seq):
    y = 70 + i * 74
    fig += T(48, y, f'{v}', PK, 26, 'start') + T(110, y, f'= 2({i + 1}) + 1', TX, 22, 'start', halo=False)
    for k in range(v):
        cx = 290 + (k // 2) * 26; cy = y - 11 + (k % 2) * 22
        fig += CIRC(cx, cy, 9, TR if k < v - 1 else AM, NAV, 1.5)
fig += LINE((34, 360), (466, 360), BD, 2)
fig += T(250, 398, '2n + 1,  n = 1, 2, 3, 4, ...', AM, 24)
fig += T(250, 434, 'pasangan + satu lebihan', MU3, 16, halo=False)
add('3.2.4', 'KESIMPULAN UMUM', 'Daripada pola kepada rumus',
    P('Buat kesimpulan umum secara induktif bagi senarai nombor 3, 5, 7, 9, ... yang mengikut pola berikut:', True)
    + P('3 = 2(1) + 1 &nbsp; 5 = 2(2) + 1 &nbsp; 7 = 2(3) + 1 &nbsp; 9 = 2(4) + 1', True)
    + STEPS(['Bahagian yang berubah: 1, 2, 3, 4 → gantikan dengan <i>n</i>.',
             'Bahagian yang tetap: "2( ) + 1".'], col)
    + ANS('2<i>n</i> + 1, &nbsp;<i>n</i> = 1, 2, 3, 4, ...'),
    svg(fig, 'Pola nombor ganjil 3, 5, 7, 9 sebagai 2n + 1'))

# 3 Contoh berlangkah (n² + c)
seq = [n * n + 4 for n in range(1, 5)]
assert seq == [5, 8, 13, 20] and 10 * 10 + 4 == 104
add('3.2.4', 'CONTOH BERLANGKAH', 'Membentuk kesimpulan umum',
    P('Diberi 5 = 1² + 4, &nbsp;8 = 2² + 4, &nbsp;13 = 3² + 4, &nbsp;20 = 4² + 4.<br>(a) Buat kesimpulan umum secara induktif. (b) Cari sebutan ke-10.', True)
    + STEPS(['Nombor yang dikuasaduakan ialah 1, 2, 3, 4 → <i>n</i>.',
             '(a) Kesimpulan: <i>n</i>² + 4, <i>n</i> = 1, 2, 3, 4, ...',
             '(b) <i>n</i> = 10: 10² + 4 = 100 + 4 = 104'], col)
    + ANS('(a) <i>n</i>² + 4 &nbsp; (b) 104'),
    svg(TT(40, 20, ['n', 'sebutan', 'bentuk'], [[str(n), str(n * n + 4), f'{n}² + 4'] for n in range(1, 5)], [100, 140, 180], 56)
        + ARROW((250, 312), (250, 352), AM, 4, 12)
        + PILL(250, 400, 300, 66, 'n² + 4', AM, 30, SURF, AM),
        'Jadual sebutan 5, 8, 13, 20 dan rumus n kuasa dua tambah 4'))

# 4 Contoh berlangkah (gandaan kuasa)
seq = [3 * 2 ** n for n in range(1, 5)]
assert seq == [6, 12, 24, 48] and 3 * 2 ** 6 == 192
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2)
for i, v in enumerate(seq):
    h = v * 5.4
    x = 70 + i * 104
    fig += RECT(x, 340 - h, 70, h, f'{PK}40', PK, 8, 2.5) + T(x + 35, 340 - h - 18, str(v), PK, 20) + T(x + 35, 362, f'3(2^{i + 1})'.replace('^1', '¹').replace('^2', '²').replace('^3', '³').replace('^4', '⁴'), TX, 16, halo=False)
fig += T(250, 420, 'setiap sebutan × 2', AM, 20)
add('3.2.4', 'CONTOH BERLANGKAH', 'Pola gandaan',
    P('Bilangan bakteria: 6, 12, 24, 48, ... dengan 6 = 3(2¹), 12 = 3(2²), 24 = 3(2³), 48 = 3(2⁴). Buat kesimpulan umum dan cari sebutan ke-6.', True)
    + STEPS(['Kuasa bagi 2 berubah: 1, 2, 3, 4 → <i>n</i>.',
             'Kesimpulan umum: 3(2<sup><i>n</i></sup>), <i>n</i> = 1, 2, 3, 4, ...',
             '<i>n</i> = 6: 3(2⁶) = 3 × 64 = 192'], col)
    + ANS('3(2<sup><i>n</i></sup>); sebutan ke-6 = 192'),
    svg(fig, 'Carta bar pola 6, 12, 24, 48'))

# 5 Penyelesaian masalah
tinggi = [3 * n + 9 for n in range(1, 5)]
assert tinggi == [12, 15, 18, 21] and 3 * 10 + 9 == 39
fig = RECT(14, 14, 472, 442, SURF, BD, 18, 2) + LINE((60, 380), (460, 380), MU, 3) + LINE((60, 380), (60, 50), MU, 3)
for i, v in enumerate(tinggi):
    x = 100 + i * 90; h = v * 12
    fig += RECT(x, 380 - h, 56, h, f'{GR}40', GR, 6, 2.5) + T(x + 28, 380 - h - 18, f'{v}', GR, 19) + T(x + 28, 404, f'M{i + 1}', MU3, 16, halo=False)
fig += T(250, 440, 'naik 3 cm setiap minggu', AM, 18) + T(76, 40, 'tinggi (cm)', MU, 15, 'start', halo=False)
add('3.2.4', 'PENYELESAIAN MASALAH', 'Meramal menggunakan hujah induktif',
    P('Tinggi sebatang anak pokok pada minggu ke-1 hingga ke-4 ialah 12 cm, 15 cm, 18 cm dan 21 cm. Buat kesimpulan umum dan ramalkan tinggi pada minggu ke-10.', True)
    + STEPS(['12 = 3(1) + 9, 15 = 3(2) + 9, 18 = 3(3) + 9, 21 = 3(4) + 9',
             'Kesimpulan umum: tinggi = 3<i>n</i> + 9 cm, <i>n</i> = 1, 2, 3, ...',
             '<i>n</i> = 10: 3(10) + 9 = 39 cm'], col)
    + ANS('39 cm (jika pola itu berterusan)'),
    svg(fig, 'Carta bar tinggi anak pokok 12, 15, 18, 21 cm'))

# 6 Ringkasan deduktif vs induktif
fig = (RECT(14, 14, 230, 442, SURF, GR, 18, 2.5) + RECT(256, 14, 230, 442, SURF, PK, 18, 2.5)
       + T(129, 48, 'Deduktif', GR, 22) + T(371, 48, 'Induktif', PK, 22)
       + T(129, 100, 'umum → khusus', TX, 17, halo=False) + T(371, 100, 'khusus → umum', TX, 17, halo=False)
       + PILL(129, 170, 170, 50, 'sah?', GR, 20) + PILL(371, 170, 170, 50, 'kuat?', PK, 20)
       + ARROW((129, 200), (129, 240), MU, 3, 10) + ARROW((371, 200), (371, 240), MU, 3, 10)
       + PILL(129, 272, 190, 50, 'munasabah?', GR, 19) + PILL(371, 272, 190, 50, 'meyakinkan?', PK, 19)
       + T(129, 340, '+ semua premis', MU3, 16, halo=False) + T(371, 340, '+ semua premis', MU3, 16, halo=False)
       + T(129, 364, 'benar', MU3, 16, halo=False) + T(371, 364, 'benar', MU3, 16, halo=False)
       + T(129, 420, 'pasti benar', GR, 18) + T(371, 420, 'berkemungkinan', PK, 18))
add('3.2.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['', 'Deduktif', 'Induktif'],
          [['Arah', 'umum → khusus', 'khusus → umum'],
           ['Dinilai', 'sah / tidak sah', 'kuat / lemah'],
           ['+ premis benar', 'munasabah', 'meyakinkan']], col, rv=True)
    + BUL(['Kesimpulan umum daripada pola: kenal pasti bahagian yang berubah (<i>n</i>) dan bahagian yang tetap.',
           'Kesimpulan induktif boleh digunakan untuk meramal, tetapi tidak pasti benar.'], col),
    svg(fig, 'Perbandingan hujah deduktif dan induktif'))

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

js = ('/* Dijana oleh tools/logik/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid', counts, len(js), 'bait ->', OUTFILE)
