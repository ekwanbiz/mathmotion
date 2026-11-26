# Penjana slaid NOTA GRAPHX (Tingkatan 2 Bab 8 Graf Fungsi) -> graphx/slides.js
# Jalankan:  python3 tools/graphx/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
raise SystemExit('Dipersarakan: nota Bab 8 kini dijana oleh alat/nota/bina_bab8_t2.py (ikut buku teks).')
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'graphx', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '8.1': ('Fungsi', C['pu']),
    '8.2': ('Graf Fungsi', C['tr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- pembantu nombor ----------
def N(v):
    """Nombor dengan tanda tolak sebenar (−) dan tanpa .0 berlebihan."""
    if isinstance(v, float) and abs(v - round(v)) < 1e-9: v = int(round(v))
    s = f'{v}' if isinstance(v, int) else f'{v:g}'
    return s.replace('-', '−')
def PB(v):
    """Nombor dalam kurungan jika negatif, untuk penggantian: (−2)."""
    return f'({N(v)})' if v < 0 else N(v)

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
def I(t):
    return f'<i>{t}</i>'
def TABLE(head, rows, col, center=False, fs=19):
    al = 'center' if center else 'left'
    th = ''.join(f'<th style="padding: 9px 12px; text-align: {al}; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td style="padding: 8px 12px; text-align: {al}; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
def XYTABLE(xs, ys, col):
    """Jadual nilai mendatar: baris x dan baris y."""
    return TABLE([I('x')] + [N(x) for x in xs], [[f'<i style="color: {col}">y</i>'] + [N(y) for y in ys]], col, True)

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
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
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=16, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def RV(inner):
    """Kumpulan rajah yang keluar satu demi satu (▶)."""
    return f'<g class="rv">{inner}</g>'
def HEAD(p, u, col, k=13, w=7):
    """Kepala anak panah di titik p, menghala ke arah vektor unit u."""
    bx, by = p[0] - u[0] * k, p[1] - u[1] * k
    nx, ny = -u[1], u[0]
    return (f'<polygon points="{r1(p[0])},{r1(p[1])} {r1(bx + nx * w)},{r1(by + ny * w)} {r1(bx - nx * w)},{r1(by - ny * w)}" '
            f'fill="{col}"/>')
def ARROW(p, q, col=TX, sw=3, k=13, w=7, dash=None):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    u = (dx / L, dy / L)
    q2 = (q[0] - u[0] * (k - 2), q[1] - u[1] * (k - 2))
    return LINE(p, q2, col, sw, dash) + HEAD(q, u, col, k, w)

# ---------- gambar rajah anak panah ----------
def adiag(lx, rx, cy, left, right, pairs, gap=58, col=TX, acol=PU, ocol=MU, size=22, ew=46,
          ltitle=None, rtitle=None, tcol=MU, hl=(), hcol=RD, lfill=None, rfill=None, pad=24):
    """Dua set (bujur) dengan anak panah. pairs = [(i, j)] indeks unsur kiri -> kanan.
    hl = pasangan yang diserlahkan dengan warna hcol."""
    s = ''
    def col_ys(n):
        top = cy - (n - 1) * gap / 2
        return [top + i * gap for i in range(n)]
    ly, ry = col_ys(len(left)), col_ys(len(right))
    eh = max(len(left), len(right)) * gap / 2 + pad
    s += f'<ellipse cx="{lx}" cy="{cy}" rx="{ew}" ry="{r1(eh)}" fill="{lfill or (PU + "14")}" stroke="{ocol}" stroke-width="3"/>'
    s += f'<ellipse cx="{rx}" cy="{cy}" rx="{ew}" ry="{r1(eh)}" fill="{rfill or (AM + "14")}" stroke="{ocol}" stroke-width="3"/>'
    for (i, j) in pairs:
        c = hcol if (i, j) in hl else acol
        s += ARROW((lx + 24, ly[i]), (rx - 26, ry[j]), c, 3)
    for i, t in enumerate(left): s += T(lx, ly[i], t, col, size)
    for j, t in enumerate(right): s += T(rx, ry[j], t, col, size)
    if ltitle: s += T(lx, cy - eh - 20, ltitle, tcol, 18)
    if rtitle: s += T(rx, cy - eh - 20, rtitle, tcol, 18)
    return s

# ---------- satah Cartes ----------
class G:
    """Satah Cartes. (ox, oy) = piksel asalan; sx, sy = piksel per unit; xr, yr = julat (unit)."""
    def __init__(self, ox, oy, sx, sy, xr, yr, xstep=1, ystep=1):
        self.ox, self.oy, self.sx, self.sy = ox, oy, sx, sy
        self.xr, self.yr, self.xstep, self.ystep = xr, yr, xstep, ystep
        self.cid = f'gc{abs(hash((ox, oy, sx, sy, xr, yr))) % 100000}'
    def px(self, x): return self.ox + x * self.sx
    def py(self, y): return self.oy - y * self.sy
    def p(self, x, y): return (self.px(x), self.py(y))
    def steps(self, r, st):
        k = math.ceil(r[0] / st - 1e-9); out = []
        while k * st <= r[1] + 1e-9:
            out.append(round(k * st, 6)); k += 1
        return out
    def grid(self, labels=True, minor=False, xname='x', yname='y', lsize=16):
        s = ''
        x0, x1 = self.px(self.xr[0]), self.px(self.xr[1])
        y0, y1 = self.py(self.yr[1]), self.py(self.yr[0])
        if minor:
            for x in self.steps(self.xr, self.xstep / 2):
                s += LINE((self.px(x), y0), (self.px(x), y1), GRID, 1, cap='butt')
            for y in self.steps(self.yr, self.ystep / 2):
                s += LINE((x0, self.py(y)), (x1, self.py(y)), GRID, 1, cap='butt')
        for x in self.steps(self.xr, self.xstep):
            s += LINE((self.px(x), y0), (self.px(x), y1), DIM if not minor else BD, 1.5, cap='butt')
        for y in self.steps(self.yr, self.ystep):
            s += LINE((x0, self.py(y)), (x1, self.py(y)), DIM if not minor else BD, 1.5, cap='butt')
        # paksi dengan anak panah
        s += ARROW((x0 - 6, self.oy), (x1 + 16, self.oy), MU3, 2.5, 12, 6)
        s += ARROW((self.ox, y1 + 6), (self.ox, y0 - 16), MU3, 2.5, 12, 6)
        s += T(x1 + 14, self.oy - 18, xname, MU3, 20, italic=True)
        s += T(self.ox + 18, y0 - 12, yname, MU3, 20, italic=True)
        if labels:
            for x in self.steps(self.xr, self.xstep):
                if abs(x) < 1e-9: continue
                s += T(self.px(x), self.oy + 18, N(x), MU, lsize, weight=600)
            for y in self.steps(self.yr, self.ystep):
                if abs(y) < 1e-9: continue
                s += T(self.ox - 9, self.py(y), N(y), MU, lsize, 'end', weight=600)
            s += T(self.ox - 12, self.oy + 17, 'O', MU, lsize, weight=600)
        return s
    def clip(self):
        x0, y0 = self.px(self.xr[0]), self.py(self.yr[1])
        return (f'<clipPath id="{self.cid}"><rect x="{r1(x0)}" y="{r1(y0)}" width="{r1(self.px(self.xr[1]) - x0)}" '
                f'height="{r1(self.py(self.yr[0]) - y0)}"/></clipPath>')
    def curve(self, f, a, b, col, sw=4.5, n=160, dash=None):
        pts = []
        for k in range(n + 1):
            x = a + (b - a) * k / n
            y = max(self.yr[0] - 3, min(self.yr[1] + 3, f(x)))
            pts.append(f'{"L" if k else "M"}{r1(self.px(x))} {r1(self.py(y))}')
        d = f' stroke-dasharray="{dash}"' if dash else ''
        return (self.clip() + f'<path d="{"".join(pts)}" fill="none" stroke="{col}" stroke-width="{sw}" '
                f'stroke-linecap="round" stroke-linejoin="round"{d} clip-path="url(#{self.cid})"/>')
    def dot(self, x, y, col=AM, r=6.5): return DOT(self.p(x, y), col, r)
    def seg(self, a, b, col, sw=4, dash=None): return LINE(self.p(*a), self.p(*b), col, sw, dash)

def mini_graph(ox, oy, w, h, f, col, title, eq, pieces=None, f2=None, col2=None, eq2=None):
    """Panel kecil bentuk graf (untuk slaid bentuk graf)."""
    s = RECT(ox, oy, w, h, SURF, BD, 16)
    s += T(ox + w / 2, oy + 22, title, col, 19)
    g = G(ox + w / 2, oy + 38 + (h - 84) / 2, (w - 30) / 6.4, (h - 84) / 6.4, (-3.2, 3.2), (-3.2, 3.2))
    s += LINE((g.px(-3.2), g.oy), (g.px(3.2), g.oy), MU2, 2) + LINE((g.ox, g.py(3.2)), (g.ox, g.py(-3.2)), MU2, 2)
    for fn, cc, dash in ((f2, col2, '7 6'), (f, col, None)):
        if fn is None: continue
        for (a, b) in (pieces or [(-3.2, 3.2)]):
            s += g.curve(fn, a, b, cc, 4, 120, dash)
    s += T(ox + w / 2, oy + h - 26, eq, MU3, 15, weight=600) if not eq2 else (
        T(ox + w / 4 + 4, oy + h - 26, eq, col, 15, weight=700) + T(ox + 3 * w / 4 - 4, oy + h - 26, eq2, col2, 15, weight=700))
    return s

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 8.1 FUNGSI =====================
col = SUB['8.1'][1]

# 8.1-1 Hubungan
pairs = [(1, 2), (2, 4), (3, 6)]
assert all(b == 2 * a for a, b in pairs)
fig = (T(250, 26, 'dua kali ganda', PU, 20)
       + adiag(130, 370, 128, ['1', '2', '3'], ['2', '4', '6'], [(0, 0), (1, 1), (2, 2)], gap=46, ew=44,
               ltitle=None, rtitle=None, size=21, pad=14)
       + T(130, 226, 'Set A', MU, 17) + T(370, 226, 'Set B', MU, 17))
fig += RECT(40, 252, 420, 208, NAV, BD, 16, 1.5)
g = G(110, 434, 64, 22, (0, 4.6), (0, 6.9), 1, 2)
fig += g.grid(lsize=14) + ''.join(g.dot(a, b, AM, 6) for a, b in pairs)
fig += T(390, 290, 'graf', MU, 17)
add('8.1', 'DEFINISI', 'Apa itu hubungan?',
    DEF('<b>Hubungan</b> ialah padanan antara unsur dalam <b>set pertama</b> dengan unsur dalam <b>set kedua</b>.', col)
    + P('Hubungan “dua kali ganda” daripada set A = {1, 2, 3} kepada set B = {2, 4, 6} boleh diwakilkan dengan:')
    + BUL([f'{B("Gambar rajah anak panah", PU)}: anak panah dari setiap unsur set A ke padanannya dalam set B.',
           f'{B("Pasangan bertertib", AM)}: (1, 2), (2, 4), (3, 6)',
           f'{B("Graf", TR)}: titik (1, 2), (2, 4) dan (3, 6) pada satah Cartes.'], col)
    + NOTE('Dalam pasangan bertertib (<i>a</i>, <i>b</i>), unsur set pertama ditulis <b>dahulu</b>.'),
    svg(fig, 'Hubungan dua kali ganda dalam gambar rajah anak panah dan graf'))

# 8.1-2 Fungsi, objek, imej
f = lambda x: 2 * x + 1
assert [f(x) for x in (1, 2, 3)] == [3, 5, 7]
fig = (adiag(120, 380, 230, ['1', '2', '3'], ['3', '5', '7', '9'], [(0, 0), (1, 1), (2, 2)], gap=66, ew=50, size=24,
             ltitle='OBJEK', rtitle='IMEJ', tcol=PU)
       + T(250, 40, 'f : x → 2x + 1', PU, 22, italic=True)
       + T(250, 415, 'Imej bagi 2 ialah 5', AM, 20)
       + T(250, 445, '9 tiada objek – dibenarkan', MU, 17, halo=False))
add('8.1', 'DEFINISI', 'Fungsi: objek dan imej',
    DEF('<b>Fungsi</b> ialah hubungan khas yang mana <b>setiap objek</b> mempunyai <b>tepat satu imej</b>.', col)
    + BUL([f'{B("Objek", PU)}: unsur dalam set pertama (input).',
           f'{B("Imej", AM)}: unsur dalam set kedua yang dipadankan dengan objek (output).',
           'Setiap objek mesti ada <b>satu</b> anak panah sahaja yang keluar daripadanya.',
           'Unsur dalam set kedua boleh tidak dipadankan dengan mana-mana objek (contoh: 9).'], col),
    svg(fig, 'Fungsi f memetakan objek 1, 2, 3 kepada imej 3, 5, 7'))

# 8.1-3 Jenis hubungan
def panel(x, y, title, left, right, pairs, ok, w=226, h=208):
    s = RECT(x, y, w, h, SURF, GR if ok else RD, 16, 2.5)
    s += T(x + w / 2, y + 22, title, TX, 16)
    s += adiag(x + 62, x + w - 62, y + 108, left, right, pairs, gap=36, ew=30, size=18, acol=PU, ocol=MU2, pad=10,
               lfill=f'{PU}10', rfill=f'{AM}10')
    s += T(x + w / 2, y + h - 18, '✓ Fungsi' if ok else '✗ Bukan fungsi', GR if ok else RD, 17)
    return s
fig = (panel(16, 16, 'Satu kepada satu', ['a', 'b', 'c'], ['1', '2', '3'], [(0, 0), (1, 1), (2, 2)], True)
       + panel(258, 16, 'Banyak kepada satu', ['a', 'b', 'c'], ['1', '2'], [(0, 0), (1, 0), (2, 1)], True)
       + panel(16, 246, 'Satu kepada banyak', ['a', 'b'], ['1', '2', '3'], [(0, 0), (0, 1), (1, 2)], False)
       + panel(258, 246, 'Banyak kepada banyak', ['a', 'b', 'c'], ['1', '2', '3'], [(0, 0), (0, 1), (1, 1), (2, 2)], False))
add('8.1', 'KONSEP', 'Jenis hubungan',
    P('Terdapat empat jenis hubungan. Hanya <b>dua</b> jenis ialah fungsi.')
    + BUL([f'{B("Satu kepada satu", GR)}: setiap objek ada satu imej yang berbeza. → fungsi',
           f'{B("Banyak kepada satu", GR)}: beberapa objek berkongsi imej yang sama. → fungsi',
           f'{B("Satu kepada banyak", RD)}: satu objek ada lebih daripada satu imej. → bukan fungsi',
           f'{B("Banyak kepada banyak", RD)}: gabungan kedua-duanya. → bukan fungsi'], col)
    + NOTE('Soalan penentu: adakah <b>setiap objek</b> ada <b>tepat satu</b> imej?'),
    svg(fig, 'Empat jenis hubungan: satu kepada satu, banyak kepada satu, satu kepada banyak dan banyak kepada banyak'))

# 8.1-4 Contoh: fungsi atau bukan
fig = (RECT(16, 16, 468, 210, SURF, BD, 16) + T(40, 42, '(a)', PU, 20, 'start')
       + adiag(150, 350, 118, ['1', '2', '3'], ['4', '6'], [(0, 0), (1, 0), (2, 1)], gap=40, ew=36, size=20, pad=10)
       + RECT(16, 244, 468, 210, SURF, BD, 16) + T(40, 270, '(b)', PU, 20, 'start')
       + adiag(150, 350, 346, ['2', '5'], ['1', '3', '7'], [(0, 0), (0, 1), (1, 2)], gap=40, ew=36, size=20, pad=10,
               hl=[(0, 0), (0, 1)])
       + RV(T(250, 206, '✓ Fungsi (banyak kepada satu)', GR, 18))
       + RV(T(250, 434, '✗ Objek 2 ada dua imej', RD, 18)))
add('8.1', 'CONTOH BERLANGKAH', 'Fungsi atau bukan?',
    P('Tentukan sama ada setiap hubungan ialah fungsi.')
    + P('(a) {(1, 4), (2, 4), (3, 6)} &nbsp;&nbsp; (b) {(2, 1), (2, 3), (5, 7)}', True)
    + STEPS(['Senaraikan objek: (a) 1, 2, 3 &nbsp;·&nbsp; (b) 2, 5',
             '(a) Setiap objek ada tepat satu imej. Objek 1 dan 2 berkongsi imej 4.',
             '(b) Objek 2 dipadankan dengan <b>dua</b> imej, iaitu 1 dan 3.'], col)
    + ANS('(a) fungsi &nbsp;·&nbsp; (b) bukan fungsi'),
    svg(fig, 'Gambar rajah anak panah bagi hubungan (a) dan (b)'))

# 8.1-5 Tatatanda fungsi & mesin fungsi
assert f(3) == 7
fig = (T(250, 36, 'MESIN FUNGSI', MU, 17)
       + f'<circle cx="62" cy="150" r="36" fill="{PU}" stroke="{NAV}" stroke-width="3"/>' + T(62, 151, '3', NAV, 30, halo=False, weight=800)
       + ARROW((102, 150), (146, 150), MU3, 4, 14, 8)
       + RECT(150, 76, 200, 148, f'{PU}1A', PU, 22, 3.5)
       + T(250, 108, 'f(x)', MU3, 20, italic=True) + T(250, 148, '2x + 1', PU, 30, italic=True, weight=800)
       + T(250, 192, '× 2 → + 1', AM, 19)
       + ARROW((354, 150), (398, 150), MU3, 4, 14, 8)
       + RV(f'<circle cx="438" cy="150" r="36" fill="{AM}" stroke="{NAV}" stroke-width="3"/>' + T(438, 151, '7', NAV, 30, halo=False, weight=800))
       + T(62, 206, 'objek', PU, 18) + T(62, 228, '(input)', MU, 15) + T(438, 206, 'imej', AM, 18) + T(438, 228, '(output)', MU, 15)
       + RECT(40, 262, 420, 186, SURF, BD, 16)
       + T(250, 298, 'f : x → 2x + 1', TX, 22, italic=True)
       + T(250, 334, 'atau  f(x) = 2x + 1', TX, 22, italic=True)
       + RV(T(250, 380, 'f(3) = 2(3) + 1 = 7', AM, 24))
       + RV(T(250, 418, '“imej bagi 3 ialah 7”', MU3, 18)))
add('8.1', 'TATATANDA', 'Tatatanda fungsi f(x)',
    DEF('Fungsi <i>f</i> yang memetakan <i>x</i> kepada 2<i>x</i> + 1 ditulis <b><i>f</i> : <i>x</i> → 2<i>x</i> + 1</b> atau <b><i>f</i>(<i>x</i>) = 2<i>x</i> + 1</b>.', col)
    + BUL([f'{I("f")}(3) dibaca “{I("f")} bagi 3”, iaitu <b>imej</b> bagi objek 3.',
           'Untuk mencari <i>f</i>(3), <b>gantikan</b> <i>x</i> = 3 ke dalam fungsi.',
           f'{B("x", PU)} ialah pemboleh ubah <b>tak bersandar</b>; {B("y = f(x)", AM)} ialah pemboleh ubah <b>bersandar</b> (nilainya bergantung pada <i>x</i>).'], col)
    + NOTE('Mesin fungsi: objek masuk → ikut <b>semua</b> operasi → imej keluar.'),
    svg(fig, 'Mesin fungsi f(x) = 2x + 1: objek 3 masuk, imej 7 keluar'))

# 8.1-6 Contoh: cari imej dan objek
f = lambda x: 4 * x - 3
assert f(2) == 5 and f(-1) == -7 and f(3) == 9
fig = (T(250, 34, 'f(x) = 4x − 3', PU, 24, italic=True)
       + adiag(130, 370, 240, ['2', '−1', '?'], ['5', '−7', '9'], [(0, 0), (1, 1), (2, 2)], gap=92, ew=54, size=28,
               ltitle='OBJEK', rtitle='IMEJ', tcol=MU)
       + RV(f'<circle cx="130" cy="332" r="24" fill="{GR}" stroke="{NAV}" stroke-width="3"/>' + T(130, 333, '3', NAV, 26, halo=False, weight=800))
       + T(250, 450, 'cari imej → gantikan x · cari objek → selesaikan', MU, 15, halo=False))
add('8.1', 'CONTOH BERLANGKAH', 'Mencari imej dan objek',
    P('Diberi <i>f</i>(<i>x</i>) = 4<i>x</i> − 3. Cari (a) <i>f</i>(2), (b) <i>f</i>(−1), (c) objek <i>x</i> jika <i>f</i>(<i>x</i>) = 9.')
    + STEPS(['(a) <i>f</i>(2) = 4(2) − 3 = 8 − 3 = <b>5</b>',
             '(b) <i>f</i>(−1) = 4(−1) − 3 = −4 − 3 = <b>−7</b>',
             '(c) 4<i>x</i> − 3 = 9 → 4<i>x</i> = 12 → <i>x</i> = <b>3</b>'], col)
    + ANS('<i>f</i>(2) = 5, &nbsp;<i>f</i>(−1) = −7, &nbsp;<i>x</i> = 3')
    + NOTE('Nombor negatif ditulis dalam <b>kurungan</b> semasa menggantikan: 4(−1), bukan 4 − 1.'),
    svg(fig, 'Objek 2, negatif 1 dan 3 dipetakan kepada imej 5, negatif 7 dan 9'))

# 8.1-7 Kesilapan biasa
g2 = lambda x: x * x
assert g2(3) == 9 and g2(-3) == 9
fig = (RECT(16, 16, 468, 200, SURF, BD, 16)
       + T(250, 42, 'f(x) = 4x − 3, cari f(2)', TX, 19, italic=True)
       + T(40, 88, '✗', RD, 26, 'start') + T(80, 88, 'f(2) = 4 × 2 = 8', RD, 21, 'start')
       + T(80, 116, 'lupa operasi − 3', MU, 15, 'start', weight=600)
       + T(40, 162, '✓', GR, 26, 'start') + T(80, 162, 'f(2) = 4(2) − 3 = 5', GR, 21, 'start')
       + RECT(16, 234, 468, 220, SURF, BD, 16)
       + T(250, 260, 'g(x) = x², cari x jika g(x) = 9', TX, 19, italic=True)
       + adiag(170, 330, 350, ['3', '−3'], ['9'], [(0, 0), (1, 0)], gap=56, ew=36, size=22, acol=GR, pad=10)
       + T(250, 436, 'dua objek, satu imej', GR, 17))
add('8.1', 'AWAS', 'Kesilapan biasa',
    BUL([f'{B("✗", RD)} Menganggap hubungan <b>satu kepada banyak</b> sebagai fungsi. Satu objek dengan dua imej → <b>bukan</b> fungsi.',
         f'{B("✗", RD)} Menganggap <b>banyak kepada satu</b> bukan fungsi. Objek boleh berkongsi imej → <b>masih</b> fungsi.',
         f'{B("✗", RD)} Berhenti di tengah pengiraan: ikut <b>semua</b> operasi dalam fungsi.',
         f'{B("✗", RD)} Keliru objek dengan imej. Dalam <i>f</i>(2) = 5, <b>2 ialah objek</b> dan <b>5 ialah imej</b>.',
         f'{B("✗", RD)} Bagi <i>g</i>(<i>x</i>) = <i>x</i>², jika <i>g</i>(<i>x</i>) = 9 maka <i>x</i> = 3 <b>atau</b> <i>x</i> = −3, bukan 3 sahaja.'], col),
    svg(fig, 'Contoh kesilapan biasa: lupa operasi dan terlepas objek negatif'))

# 8.1-8 Ringkasan
fig = (RECT(150, 18, 200, 56, f'{MU}1A', MU, 16, 2.5) + T(250, 47, 'Hubungan', TX, 22))
boxes = [('Satu kepada satu', GR), ('Banyak kepada satu', GR), ('Satu kepada banyak', RD), ('Banyak kepada banyak', RD)]
bx = [16, 133, 250, 367]
for (t, c), x in zip(boxes, bx):
    fig += LINE((250, 74), (x + 58, 128), MU2, 2.5)
    fig += RECT(x + 3, 128, 111, 92, f'{c}1A', c, 14, 2.5)
    w1, w2 = t.split(' kepada ')
    fig += T(x + 58, 152, w1, TX, 15) + T(x + 58, 174, 'kepada', MU, 13, weight=600) + T(x + 58, 196, w2, TX, 15)
fig += (f'<path d="M24 236 L24 252 L234 252 L234 236" fill="none" stroke="{GR}" stroke-width="3"/>' + T(129, 272, 'FUNGSI', GR, 20)
        + f'<path d="M258 236 L258 252 L476 252 L476 236" fill="none" stroke="{RD}" stroke-width="3"/>' + T(367, 272, 'BUKAN FUNGSI', RD, 18)
        + RECT(16, 300, 468, 154, SURF, BD, 16)
        + T(250, 334, 'f(x) = 2x + 1', PU, 24, italic=True)
        + T(130, 384, 'objek x = 4', TX, 19) + ARROW((206, 384), (290, 384), MU3, 3) + T(372, 384, 'imej 9', AM, 19)
        + T(250, 426, 'f(4) = 2(4) + 1 = 9', MU3, 18))
assert 2 * 4 + 1 == 9
add('8.1', 'RINGKASAN', 'Ringkasan: fungsi',
    TABLE(['Istilah', 'Maksud'],
          [['Hubungan', 'padanan unsur set pertama dengan set kedua'],
           ['Fungsi', 'setiap objek ada <b>tepat satu</b> imej'],
           ['Objek', 'input, unsur set pertama (<i>x</i>)'],
           ['Imej', 'output, <i>f</i>(<i>x</i>) atau <i>y</i>'],
           ['<i>f</i>(<i>a</i>)', 'imej bagi <i>a</i>: gantikan <i>x</i> = <i>a</i>']], col, fs=18)
    + NOTE('Cari <b>imej</b> → gantikan nilai <i>x</i>. Cari <b>objek</b> → samakan <i>f</i>(<i>x</i>) dengan imej, kemudian selesaikan persamaan.'),
    svg(fig, 'Ringkasan jenis hubungan dan contoh fungsi'))

# ===================== 8.2 GRAF FUNGSI =====================
col = SUB['8.2'][1]
fq = lambda x: x * x - 3            # fungsi kuadratik contoh
XS = [-3, -2, -1, 0, 1, 2, 3]
YQ = [fq(x) for x in XS]
assert YQ == [6, 1, -2, -3, -2, 1, 6], YQ

# 8.2-1 Jadual nilai
fig = T(250, 32, 'y = x² − 3', TR, 24, italic=True)
for k, x in enumerate(XS):
    y = 68 + k * 52
    hl = (x == -2)
    row = (RECT(30, y - 21, 440, 42, f'{AM}1F' if hl else SURF, AM if hl else BD, 12, 2 if hl else 1.5)
           + T(52, y, 'x =', MU, 17, 'start', weight=600) + T(112, y, N(x), PU, 20, 'end')
           + T(132, y, f'y = {PB(x)}² − 3 = {N(x * x)} − 3 =', MU3, 18, 'start', weight=600)
           + T(452, y, N(fq(x)), AM, 22, 'end'))
    fig += RV(row) if k else row
fig += T(250, 440, '(−2)² = (−2) × (−2) = 4', AM, 18, halo=False)
add('8.2', 'KONSEP', 'Jadual nilai',
    DEF('<b>Jadual nilai</b> menyenaraikan nilai <i>x</i> yang dipilih dan nilai <i>y</i> yang sepadan. Setiap pasangan memberi satu titik (<i>x</i>, <i>y</i>).', col)
    + P('Lengkapkan jadual nilai bagi <i>y</i> = <i>x</i>² − 3 untuk −3 ≤ <i>x</i> ≤ 3.')
    + XYTABLE(XS, YQ, col)
    + STEPS(['Gantikan setiap nilai <i>x</i> ke dalam fungsi.',
             'Contoh <i>x</i> = −2: <i>y</i> = (−2)² − 3 = 4 − 3 = <b>1</b>'], col)
    + NOTE('Kuasa dua nombor negatif adalah <b>positif</b>: (−3)² = 9.'),
    svg(fig, 'Pengiraan jadual nilai bagi y = x kuasa dua tolak 3'))

# 8.2-2 Paksi dan skala
g = G(250, 280, 56, 30, (-3.6, 3.6), (-4.4, 7.4), 1, 2)
fig = (g.grid()
       + RV(g.seg((2, 0), (2, 6), AM, 3, '7 6') + g.seg((0, 6), (2, 6), AM, 3, '7 6') + g.dot(2, 6, AM, 8)
            + T(g.px(2) + 12, g.py(6) - 20, '(2, 6)', AM, 20, 'start'))
       + T(g.px(2.5), g.py(-4) + 22, '1 petak = 1 unit', PU, 16)
       + T(g.px(-2.5), g.py(7), '1 petak = 2 unit', PK, 16)
       + f'<rect x="{r1(g.px(-3))}" y="{r1(g.py(6))}" width="{g.sx}" height="{r1(2 * g.sy)}" fill="{PK}33" stroke="{PK}" stroke-width="2"/>'
       + f'<rect x="{r1(g.px(2))}" y="{r1(g.py(-2))}" width="{g.sx}" height="{r1(2 * g.sy)}" fill="{PU}33" stroke="{PU}" stroke-width="2"/>')
add('8.2', 'KONSEP', 'Paksi dan skala',
    BUL([f'{B("Paksi-x", PU)} (mengufuk) untuk pemboleh ubah tak bersandar <i>x</i>; {B("paksi-y", PK)} (mencancang) untuk <i>y</i>.',
         'Skala biasanya diberi dalam soalan, contohnya <b>2 cm kepada 1 unit</b> pada paksi-<i>x</i> dan <b>2 cm kepada 2 unit</b> pada paksi-<i>y</i>.',
         'Skala mesti <b>seragam</b>: setiap petak mewakili nilai yang sama sepanjang paksi itu.',
         'Labelkan paksi, asalan O dan nombor pada setiap garis grid utama.'], col)
    + STEPS(['Plot (2, 6): gerak 2 unit ke kanan pada paksi-<i>x</i>, kemudian 6 unit ke atas.'], col)
    + NOTE('Skala paksi-<i>x</i> dan paksi-<i>y</i> <b>boleh berbeza</b>. Semak skala sebelum membaca atau memplot.'),
    svg(fig, 'Satah Cartes dengan skala 1 unit sepetak pada paksi-x dan 2 unit sepetak pada paksi-y'))

# 8.2-3 Lukis graf linear
fl = lambda x: 2 * x + 1
XL = [-2, -1, 0, 1, 2]
YL = [fl(x) for x in XL]
assert YL == [-3, -1, 1, 3, 5]
g = G(250, 262, 58, 29, (-3.4, 3.4), (-4.6, 7.4), 1, 2)
fig = (g.grid()
       + RV(''.join(g.dot(x, y, AM, 7) for x, y in zip(XL, YL)))
       + RV(g.curve(fl, -2.6, 2.95, TR, 5) + ''.join(g.dot(x, y, AM, 7) for x, y in zip(XL, YL))
            + T(g.px(2.1) - 14, g.py(6.6), 'y = 2x + 1', TR, 20, 'end')))
add('8.2', 'CONTOH BERLANGKAH', 'Melukis graf fungsi linear',
    P('Lukis graf <i>y</i> = 2<i>x</i> + 1 untuk −2 ≤ <i>x</i> ≤ 2.')
    + XYTABLE(XL, YL, col)
    + STEPS(['Bina jadual nilai: contoh <i>x</i> = −2 → <i>y</i> = 2(−2) + 1 = −3.',
             'Lukis paksi ikut skala, kemudian plot titik (−2, −3), (−1, −1), (0, 1), (1, 3) dan (2, 5).',
             'Sambung titik-titik dengan <b>pembaris</b> untuk mendapat <b>garis lurus</b>.'], col)
    + NOTE('Graf linear cukup dengan 2 titik, tetapi plot titik ketiga untuk <b>menyemak</b>.'),
    svg(fig, 'Graf garis lurus y = 2x + 1 melalui lima titik'))

# 8.2-4 Lukis graf kuadratik
g = G(250, 270, 58, 29, (-3.4, 3.4), (-4.6, 7.6), 1, 2)
fig = (g.grid()
       + RV(''.join(g.dot(x, y, AM, 7) for x, y in zip(XS, YQ)))
       + RV(g.curve(fq, -3.15, 3.15, TR, 5) + ''.join(g.dot(x, y, AM, 7) for x, y in zip(XS, YQ))
            + T(g.px(1.25), g.py(5.2), 'y = x² − 3', TR, 20, 'end'))
       + RV(T(g.px(0) + 16, g.py(-3) + 22, 'titik minimum (0, −3)', GR, 16, 'start')))
add('8.2', 'CONTOH BERLANGKAH', 'Melukis graf fungsi kuadratik',
    P('Lukis graf <i>y</i> = <i>x</i>² − 3 untuk −3 ≤ <i>x</i> ≤ 3.')
    + XYTABLE(XS, YQ, col)
    + STEPS(['Plot ketujuh-tujuh titik (<i>x</i>, <i>y</i>) daripada jadual.',
             'Sambung titik-titik dengan <b>lengkung licin</b>, bukan garis lurus.',
             'Graf berbentuk ∪, simetri pada paksi-<i>y</i>, dengan titik minimum (0, −3).'], col)
    + NOTE('Lengkung mesti melalui <b>semua</b> titik.'),
    svg(fig, 'Graf lengkung y = x kuasa dua tolak 3 melalui tujuh titik'))

# 8.2-5 Baca nilai dari graf
xa = 2.5; ya = fq(xa)
assert abs(ya - 3.25) < 1e-9
yb = -1; xb = math.sqrt(2)
assert abs(fq(xb) - yb) < 1e-9 and round(xb, 1) == 1.4
g = G(250, 270, 58, 29, (-3.4, 3.4), (-4.6, 7.6), 1, 2)
fig = (g.grid(minor=True) + g.curve(fq, -3.15, 3.15, TR, 5)
       + RV(g.seg((xa, 0), (xa, ya), AM, 3, '7 6') + g.seg((xa, ya), (0, ya), AM, 3, '7 6') + g.dot(xa, ya, AM, 7)
            + T(g.px(0) - 10, g.py(ya) - 16, '3.2', AM, 17, 'end'))
       + RV(g.seg((-3.4, yb), (3.4, yb), PK, 3, '7 6') + g.seg((-xb, yb), (-xb, 0), PK, 3, '7 6') + g.seg((xb, yb), (xb, 0), PK, 3, '7 6')
            + g.dot(-xb, yb, PK, 7) + g.dot(xb, yb, PK, 7)
            + T(g.px(-xb) - 4, g.py(yb) + 20, '−1.4', PK, 17, 'end') + T(g.px(xb) + 4, g.py(yb) + 20, '1.4', PK, 17, 'start')))
add('8.2', 'CONTOH BERLANGKAH', 'Membaca nilai daripada graf',
    P('Daripada graf <i>y</i> = <i>x</i>² − 3, cari (a) nilai <i>y</i> apabila <i>x</i> = 2.5, (b) nilai <i>x</i> apabila <i>y</i> = −1.')
    + STEPS(['(a) Dari <i>x</i> = 2.5, lukis garis <b>mencancang</b> ke graf, kemudian garis <b>mengufuk</b> ke paksi-<i>y</i>. Baca <i>y</i> ≈ 3.2.',
             '(b) Dari <i>y</i> = −1, lukis garis mengufuk. Ia memotong graf di <b>dua</b> titik. Naik ke paksi-<i>x</i>: <i>x</i> ≈ −1.4 dan <i>x</i> ≈ 1.4.'], col)
    + ANS('(a) <i>y</i> ≈ 3.2 &nbsp;·&nbsp; (b) <i>x</i> ≈ −1.4, 1.4')
    + NOTE('Nilai daripada graf ialah <b>anggaran</b>. Semak: 2.5² − 3 = 3.25.'),
    svg(fig, 'Membaca nilai pada graf y = x kuasa dua tolak 3 dengan garis putus-putus'))

# 8.2-6 Bentuk graf
fig = (mini_graph(14, 14, 230, 214, lambda x: 0.8 * x + 0.4, PU, 'Linear', 'a > 0', None, lambda x: -0.8 * x + 0.4, MU, 'a < 0')
       + mini_graph(256, 14, 230, 214, lambda x: 0.55 * x * x - 1.8, AM, 'Kuadratik', 'a > 0 ∪', None, lambda x: -0.55 * x * x + 1.8, MU, 'a < 0 ∩')
       + mini_graph(14, 242, 230, 214, lambda x: 0.11 * x ** 3, GR, 'Kubik', 'a > 0', None, lambda x: -0.11 * x ** 3, MU, 'a < 0')
       + mini_graph(256, 242, 230, 214, lambda x: 1.4 / x, PK, 'Salingan', 'a > 0', [(-3.2, -0.05), (0.05, 3.2)], lambda x: -1.4 / x, MU, 'a < 0'))
add('8.2', 'KONSEP', 'Bentuk graf fungsi',
    P('Bentuk graf bergantung pada <b>kuasa tertinggi</b> <i>x</i> dalam fungsi.')
    + BUL([f'{B("Linear", PU)} <i>y</i> = <i>ax</i> + <i>b</i> (kuasa 1): <b>garis lurus</b>.',
           f'{B("Kuadratik", AM)} <i>y</i> = <i>ax</i>² + <i>bx</i> + <i>c</i> (kuasa 2): bentuk <b>∪</b> jika <i>a</i> &gt; 0, <b>∩</b> jika <i>a</i> &lt; 0.',
           f'{B("Kubik", GR)} <i>y</i> = <i>ax</i>³ + <i>c</i> (kuasa 3): lengkung berbentuk <b>S</b>.',
           f'{B("Salingan", PK)} <i>y</i> = {FR(I("a"), I("x"))} (<i>x</i> di penyebut): <b>dua lengkung</b> yang tidak menyentuh paksi.'], col)
    + NOTE('Tanda <i>a</i> menentukan arah graf. Garis putus-putus dalam rajah menunjukkan <i>a</i> &lt; 0.'),
    svg(fig, 'Empat bentuk graf: linear, kuadratik, kubik dan salingan'))

# 8.2-7 Kesilapan biasa
fig = RECT(14, 14, 230, 250, SURF, RD, 16, 2.5) + RECT(256, 14, 230, 250, SURF, GR, 16, 2.5)
gl = G(129, 172, 30, 11, (-3.3, 3.3), (-4, 7), 1, 2)
gr_ = G(371, 172, 30, 11, (-3.3, 3.3), (-4, 7), 1, 2)
pts_l = ' '.join(f'{r1(gl.px(x))},{r1(gl.py(y))}' for x, y in zip(XS, YQ))
for gg in (gl, gr_):
    fig += LINE((gg.px(-3.3), gg.oy), (gg.px(3.3), gg.oy), MU2, 2) + LINE((gg.ox, gg.py(7)), (gg.ox, gg.py(-4)), MU2, 2)
fig += f'<polyline points="{pts_l}" fill="none" stroke="{RD}" stroke-width="3.5" stroke-linejoin="miter"/>'
fig += gr_.curve(fq, -3.05, 3.05, GR, 3.5)
fig += ''.join(gl.dot(x, y, AM, 5) for x, y in zip(XS, YQ)) + ''.join(gr_.dot(x, y, AM, 5) for x, y in zip(XS, YQ))
fig += T(129, 38, '✗ garis bersegi', RD, 17) + T(371, 38, '✓ lengkung licin', GR, 17)
fig += (RECT(14, 280, 472, 176, SURF, BD, 16)
        + T(40, 316, '✗', RD, 24, 'start') + T(76, 316, '(−2)² = −4', RD, 21, 'start')
        + T(260, 316, '✓', GR, 24, 'start') + T(296, 316, '(−2)² = 4', GR, 21, 'start')
        + T(40, 368, '✗', RD, 24, 'start') + T(76, 368, 'y =', RD, 19, 'start') + SFR(110, 367, '3', 'x', RD, 19, 'start') + T(140, 368, 'linear', RD, 19, 'start')
        + T(260, 368, '✓', GR, 24, 'start') + T(296, 368, 'salingan', GR, 19, 'start')
        + T(40, 420, '✗', RD, 24, 'start') + T(76, 420, 'plot (2, 5) di (5, 2)', RD, 19, 'start')
        + T(260, 420, '✓', GR, 24, 'start') + T(296, 420, 'x dahulu', GR, 19, 'start'))
add('8.2', 'AWAS', 'Kesilapan biasa',
    BUL([f'{B("✗", RD)} Mengira (−2)² = −4. Sebenarnya (−2)² = (−2) × (−2) = <b>4</b>.',
         f'{B("✗", RD)} Menyambung titik graf kuadratik atau kubik dengan garis lurus bersegi. Mesti <b>lengkung licin</b>.',
         f'{B("✗", RD)} Salah membaca skala, contohnya menganggap 1 petak = 1 unit sedangkan 1 petak = 2 unit.',
         f'{B("✗", RD)} Memplot (<i>x</i>, <i>y</i>) secara terbalik. Nilai <i>x</i> (mengufuk) dahulu, kemudian <i>y</i>.',
         f'{B("✗", RD)} Menganggap <i>y</i> = {FR(3, "<i>x</i>")} linear, atau graf salingan menyentuh paksi.'], col),
    svg(fig, 'Perbandingan graf bersegi yang salah dengan lengkung licin yang betul'))

# 8.2-8 Ringkasan
fig = ''
flow = [('Jadual nilai', 'pilih x, kira y', PU), ('Skala & paksi', 'ikut soalan', PK), ('Plot titik', '(x, y)', AM),
        ('Sambung', 'garis lurus / lengkung licin', TR), ('Kenal bentuk', 'kuasa tertinggi x', GR)]
for k, (t, d, c) in enumerate(flow):
    y = 20 + k * 90
    fig += RECT(70, y, 360, 66, f'{c}1A', c, 16, 2.5)
    fig += f'<circle cx="104" cy="{y + 33}" r="20" fill="{c}"/>' + T(104, y + 34, str(k + 1), NAV, 20, halo=False, weight=800)
    fig += T(140, y + 22, t, TX, 20, 'start') + T(140, y + 47, d, MU3, 16, 'start', weight=600)
    if k < len(flow) - 1:
        fig += ARROW((250, y + 68), (250, y + 88), MU2, 3, 10, 6)
add('8.2', 'RINGKASAN', 'Ringkasan: graf fungsi',
    TABLE(['Fungsi', 'Kuasa tertinggi <i>x</i>', 'Jenis', 'Bentuk'],
          [['<i>y</i> = 4 − 3<i>x</i>', '1', 'Linear', 'garis lurus'],
           ['<i>y</i> = 5 − 2<i>x</i>²', '2', 'Kuadratik', '∩ (<i>a</i> = −2)'],
           ['<i>y</i> = <i>x</i>³ − 4', '3', 'Kubik', 'bentuk S'],
           ['<i>y</i> = ' + FR(6, '<i>x</i>'), '<i>x</i> di penyebut', 'Salingan', 'dua lengkung']], col, fs=18)
    + NOTE('Melukis graf: <b>jadual nilai → skala → plot → sambung</b>. Baca graf dengan garis mencancang dan mengufuk.'),
    svg(fig, 'Langkah melukis dan mengenal graf fungsi'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

# semakan palet: hanya warna palet gelap dibenarkan
ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert counts == {'8.1': 8, '8.2': 8}, counts
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body

js = ('/* Dijana oleh tools/graphx/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
