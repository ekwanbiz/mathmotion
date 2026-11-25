# Penjana slaid NOTA PELAN (Tingkatan 3 Bab 7 Pelan dan Dongakan) -> pelan/slides.js
# Jalankan:  python3 tools/pelan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import FR, RT, SFR, SRT

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'pelan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
# KSSM T3 Bab 7: SK 7.1 Unjuran Ortogon, SK 7.2 Pelan dan Dongakan
SUB = {
    '7.1': ('Unjuran Ortogon', TR),
    '7.2': ('Pelan dan Dongakan', PA),
}
# warna tetap pandangan: pelan (hijau), dongakan depan (biru), dongakan sisi (merah jambu)
VCOL = {'pelan': GR, 'depan': TR, 'sisi': PK}
VNAME = {'pelan': 'Pelan', 'depan': 'Dongakan depan', 'sisi': 'Dongakan sisi'}

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
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 18px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
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
def POLY(pts, fill, stroke='none', sw=0, op=None):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    o = f' fill-opacity="{op}"' if op is not None else ''
    return f'<polygon points="{pp}" fill="{fill}"{o} stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
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

# ================= enjin pepejal kiub (voxel) =================
# Koordinat: x ke kanan (panjang), y ke belakang (lebar/dalam), z ke atas (tinggi). Kiub (x,y,z) mengisi [x,x+1]×[y,y+1]×[z,z+1].
# Peta tinggi H: senarai baris dari BELAKANG (atas pelan) ke DEPAN (bawah pelan).
def vox_from_h(Hm):
    n = len(Hm); S = set()
    for r, row in enumerate(Hm):
        y = n - 1 - r
        for x, h in enumerate(row):
            for z in range(h): S.add((x, y, z))
    return S

def view_grid(S, kind):
    """Pulangkan {sel (u,v): set kedalaman} bagi pandangan. u ke kanan, v ke atas, kedalaman kecil = dekat pemerhati."""
    g = {}
    for (x, y, z) in S:
        if kind == 'pelan': u, v, d = x, y, -z          # dilihat dari atas: depan di bawah
        elif kind == 'depan': u, v, d = x, z, y          # dilihat dari depan
        else: u, v, d = y, z, -x                         # dongakan sisi: dilihat dari KANAN, depan di sebelah kiri
        g.setdefault((u, v), set()).add(d)
    return g

def merge(segs):
    """Cantum segmen unit segaris kepada segmen panjang."""
    hs, vs, out = {}, {}, []
    for (a, b) in segs:
        if a[1] == b[1]: hs.setdefault(a[1], []).append(tuple(sorted((a[0], b[0]))))
        else: vs.setdefault(a[0], []).append(tuple(sorted((a[1], b[1]))))
    for y, L in hs.items():
        L.sort(); s, e = L[0]
        for a, b in L[1:]:
            if a == e: e = b
            else: out.append(((s, y), (e, y))); s, e = a, b
        out.append(((s, y), (e, y)))
    for x, L in vs.items():
        L.sort(); s, e = L[0]
        for a, b in L[1:]:
            if a == e: e = b
            else: out.append(((x, s), (x, e))); s, e = a, b
        out.append(((x, s), (x, e)))
    return sorted(out)

def view_lines(S, kind):
    """Garis pandangan: (lebar, tinggi, garis_penuh, garis_tersembunyi). Garis penuh jika muka hadapan berbeza kedalaman;
    putus-putus jika muka hadapan sama tetapi ada tepi di belakang."""
    g = view_grid(S, kind)
    us = [u for u, v in g]; vs_ = [v for u, v in g]
    W_, H_ = max(us) + 1, max(vs_) + 1
    vis, hid = [], []
    def edge(a, b, seg):
        A, Bc = g.get(a, set()), g.get(b, set())
        if not A and not Bc: return
        fa = min(A) if A else None; fb = min(Bc) if Bc else None
        if fa != fb: vis.append(seg)
        elif A ^ Bc: hid.append(seg)
    for u in range(W_ + 1):
        for v in range(H_):
            edge((u - 1, v), (u, v), ((u, v), (u, v + 1)))
    for v in range(H_ + 1):
        for u in range(W_):
            edge((u, v - 1), (u, v), ((u, v), (u + 1, v)))
    return W_, H_, merge(vis), merge(hid)

# ---------- unjuran isometri (pemerhati di depan-kanan-atas) ----------
C30 = math.cos(math.radians(30)); S30 = 0.5
def iso(p):
    x, y, z = p
    return ((x + y) * C30, (x - y) * S30 - z)      # skrin: x ke kanan-bawah, y ke kanan-atas, z ke atas

class Iso:
    def __init__(self, pts3, box):
        P2 = [iso(p) for p in pts3]
        xs = [p[0] for p in P2]; ys = [p[1] for p in P2]
        L, Tp, R, Bm = box
        self.k = min((R - L) / (max(xs) - min(xs)), (Bm - Tp) / (max(ys) - min(ys)))
        self.ox = (L + R) / 2 - self.k * (max(xs) + min(xs)) / 2
        self.oy = (Tp + Bm) / 2 - self.k * (max(ys) + min(ys)) / 2
    def __call__(self, p):
        a, b = iso(p); return (self.ox + self.k * a, self.oy + self.k * b)

def vox_pts(S):
    return [(x + dx, y + dy, z + dz) for (x, y, z) in S for dx in (0, 1) for dy in (0, 1) for dz in (0, 1)]

def draw_vox(S, pr, col=PA, cubes=True, sw=3):
    """Lukis pepejal kiub (algoritma pelukis). cubes=False: cantum muka sesatah (pepejal licin)."""
    s = ''
    for (x, y, z) in sorted(S, key=lambda c: (c[0] - c[1] + c[2], c[2])):
        faces = []
        if (x, y, z + 1) not in S:
            faces.append(('t', [(x, y, z + 1), (x + 1, y, z + 1), (x + 1, y + 1, z + 1), (x, y + 1, z + 1)], 0.55))
        if (x, y - 1, z) not in S:
            faces.append(('f', [(x, y, z), (x + 1, y, z), (x + 1, y, z + 1), (x, y, z + 1)], 0.34))
        if (x + 1, y, z) not in S:
            faces.append(('r', [(x + 1, y, z), (x + 1, y + 1, z), (x + 1, y + 1, z + 1), (x + 1, y, z + 1)], 0.18))
        for kind, q, op in faces:
            pts = [pr(p) for p in q]
            s += POLY(pts, SURF) + POLY(pts, col, op=op)
            for i in range(4):
                a, b = q[i], q[(i + 1) % 4]
                if not cubes and continues(S, kind, (x, y, z), a, b): continue
                s += LINE(pr(a), pr(b), TX, sw)
    return s

def continues(S, kind, c, a, b):
    """Benar jika muka bersebelahan merentasi tepi a-b adalah sesatah dan terdedah (tepi dalaman)."""
    x, y, z = c
    d = [b[i] - a[i] for i in range(3)]
    mid = [(a[i] + b[i]) / 2 for i in range(3)]
    ctr = {'t': (x + .5, y + .5, z + 1), 'f': (x + .5, y, z + .5), 'r': (x + 1, y + .5, z + .5)}[kind]
    off = [int(math.copysign(1, mid[i] - ctr[i])) if abs(mid[i] - ctr[i]) > .25 else 0 for i in range(3)]
    n = (x + off[0], y + off[1], z + off[2])
    if n not in S: return False
    cov = {'t': (n[0], n[1], n[2] + 1), 'f': (n[0], n[1] - 1, n[2]), 'r': (n[0] + 1, n[1], n[2])}[kind]
    return cov not in S

def draw_view(S, kind, x0, y0, k, col=None, grid=True, title=None, dims=None, unit='cm', u=1, tsz=18):
    """Lukis satu pandangan pada grid. (x0, y0) = sudut kiri-bawah."""
    col = col or VCOL[kind]
    Wv, Hv, vis, hid = view_lines(S, kind)
    X = lambda a: x0 + a * k; Y = lambda b: y0 - b * k
    s = ''
    if grid:
        for i in range(Wv + 1): s += LINE((X(i), Y(0)), (X(i), Y(Hv)), GRID, 1.5, cap='butt')
        for j in range(Hv + 1): s += LINE((X(0), Y(j)), (X(Wv), Y(j)), GRID, 1.5, cap='butt')
    g = view_grid(S, kind)
    for (a, b) in g: s += POLY([(X(a), Y(b)), (X(a + 1), Y(b)), (X(a + 1), Y(b + 1)), (X(a), Y(b + 1))], col, op=0.13)
    for (p, q) in hid: s += LINE((X(p[0]), Y(p[1])), (X(q[0]), Y(q[1])), col, 3, '8 6', 'butt')
    for (p, q) in vis: s += LINE((X(p[0]), Y(p[1])), (X(q[0]), Y(q[1])), col, 4.5)
    if title: s += T(X(Wv / 2), Y(Hv) - 18, title, col, tsz)
    if dims:
        s += T(X(Wv / 2), y0 + 18, f'{Wv * u} {unit}', MU3, 16)
        s += T(X(Wv) + 8, Y(Hv / 2), f'{Hv * u} {unit}', MU3, 16, 'start')
    return s

# ---------- pepejal umum (polihedron cembung, untuk baji/rumah) ----------
def draw_poly(V, Fc, pr, col=TR, sw=3.5, ops=None):
    """Muka cembung; muka kelihatan jika normal menghala ke pemerhati (1, −1, 1). Lukis dari jauh ke dekat."""
    view = (1, -1, 1)
    cen = [sum(p[i] for p in V) / len(V) for i in range(3)]
    items = []
    for fi, f in enumerate(Fc):
        a, b, c = V[f[0]], V[f[1]], V[f[2]]
        u = [b[i] - a[i] for i in range(3)]; w = [c[i] - a[i] for i in range(3)]
        n = (u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0])
        fc = [sum(V[k][i] for k in f) / len(f) for i in range(3)]
        if sum(n[i] * (fc[i] - cen[i]) for i in range(3)) < 0: n = tuple(-t for t in n)
        if sum(n[i] * view[i] for i in range(3)) > 1e-9:
            items.append((sum(fc[i] * view[i] for i in range(3)), fi, n))
    s = ''
    for _, fi, n in sorted(items):
        pts = [pr(V[k]) for k in Fc[fi]]
        op = (ops or {}).get(fi, 0.5 if n[2] > 0 and abs(n[2]) >= max(abs(n[0]), abs(n[1])) else 0.32 if n[1] < 0 else 0.18)
        s += POLY(pts, SURF) + POLY(pts, col, TX, sw, op)
    return s

# ---------- slaid ----------
S_ = []
def add(sub, kicker, title, body, fig='', full=''):
    S_.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# Pepejal contoh utama: blok L bertingkat (peta tinggi, baris belakang dahulu)
HL = [[2, 1, 1],
      [2, 1, 1]]
SL = vox_from_h(HL)
assert len(SL) == 8
wv = view_lines(SL, 'pelan'); assert wv[:2] == (3, 2) and wv[3] == []
assert view_lines(SL, 'depan')[:2] == (3, 2) and view_lines(SL, 'sisi')[:2] == (2, 2)

# ===================== 7.1 UNJURAN ORTOGON =====================
col = SUB['7.1'][1]

# 7.1-1 Definisi: objek di atas satah mengufuk dengan garis unjuran
ZP = -2.6                                       # aras satah unjuran
pts = vox_pts(SL) + [(-0.8, -0.8, ZP), (3.8, 2.8, ZP), (-0.8, 2.8, ZP), (3.8, -0.8, ZP)]
pr = Iso(pts, (40, 40, 460, 440))
plane = [(-0.8, -0.8, ZP), (3.8, -0.8, ZP), (3.8, 2.8, ZP), (-0.8, 2.8, ZP)]
fig = POLY([pr(p) for p in plane], DIM, MU2, 2, 0.55)
Wp, Hp, vis, hid = view_lines(SL, 'pelan')
fig += POLY([pr((0, 0, ZP)), pr((3, 0, ZP)), pr((3, 2, ZP)), pr((0, 2, ZP))], GR, op=0.25)
for (p, q) in vis: fig += LINE(pr((p[0], p[1], ZP)), pr((q[0], q[1], ZP)), GR, 4)
# garis unjuran dari bucu atas objek (berserenjang dengan satah)
for (x, y, z) in [(0, 0, 2), (3, 0, 1), (3, 2, 1), (1, 0, 1), (1, 0, 2)]:
    fig += LINE(pr((x, y, z)), pr((x, y, ZP)), AM, 2.5, '7 6')
fig += draw_vox(SL, pr, PA, cubes=False)
for (x, y, z) in [(0, 2, 2)]:
    fig += LINE(pr((x, y, z)), pr((x, y, ZP)), AM, 2.5, '7 6')
fig += T(pr((3.8, -0.8, ZP))[0] - 10, pr((3.8, -0.8, ZP))[1] + 20, 'satah unjuran', MU3, 18, 'end')
fig += T(pr((2.2, 1.6, ZP))[0], pr((2.2, 1.6, ZP))[1] + 2, 'imej', GR, 18)
fig += T(pr((3, 0, 1))[0] + 14, (pr((3, 0, 1))[1] + pr((3, 0, ZP))[1]) / 2, 'garis unjuran', AM, 17, 'start')
fig += T(pr((0, 2, 2))[0], pr((0, 2, 2))[1] - 20, 'objek', PA, 19)
add('7.1', 'DEFINISI', 'Apakah unjuran ortogon?',
    DEF('<b>Unjuran ortogon</b> ialah imej sesuatu objek yang terbentuk pada satu <b>satah</b> apabila objek itu diunjurkan dengan garis unjuran yang <b>berserenjang</b> dengan satah itu.', col)
    + BUL([f'{B("Objek", PA)}: bentuk tiga dimensi yang hendak diunjurkan.',
           f'{B("Satah unjuran", MU3)}: permukaan rata tempat imej terbentuk.',
           f'{B("Garis unjuran", AM)}: garis selari yang berserenjang (90°) dengan satah.',
           f'{B("Imej", GR)}: bentuk dua dimensi yang terhasil pada satah.'], col)
    + NOTE('Ortogon bermaksud <b>bersudut tegak</b>. Bayangkan cahaya yang jatuh tegak di atas objek: bayangnya ialah unjuran ortogon.'),
    svg(fig, 'Objek di atas satah mengufuk dengan garis unjuran tegak dan imej pada satah'))

# 7.1-2 Satah mengufuk dan mencancang (tiga satah)
g = 1.6
Dd, Ww, Hh = 2, 3, 2
corner = [(-g, -0.4, -g), (Ww + 0.4, Dd + g, Hh + 0.6)]
pts = vox_pts(SL) + [(-g, -0.4, -g), (Ww + 0.4, -0.4, -g), (Ww + 0.4, Dd + g, -g), (-g, Dd + g, Hh + 0.6), (-g, -0.4, Hh + 0.6), (Ww + 0.4, Dd + g, Hh + 0.6)]
pr = Iso(pts, (24, 22, 476, 446))
floor = [(-g, -0.4, -g), (Ww + 0.4, -0.4, -g), (Ww + 0.4, Dd + g, -g), (-g, Dd + g, -g)]
back = [(-g, Dd + g, -g), (Ww + 0.4, Dd + g, -g), (Ww + 0.4, Dd + g, Hh + 0.6), (-g, Dd + g, Hh + 0.6)]
left = [(-g, -0.4, -g), (-g, Dd + g, -g), (-g, Dd + g, Hh + 0.6), (-g, -0.4, Hh + 0.6)]
fig = POLY([pr(p) for p in back], DIM, MU2, 2, 0.45) + POLY([pr(p) for p in left], DIM, MU2, 2, 0.3) + POLY([pr(p) for p in floor], DIM, MU2, 2, 0.6)
maps = {'pelan': lambda u, v: (u, v, -g), 'depan': lambda u, v: (u, Dd + g, v), 'sisi': lambda u, v: (-g, u, v)}
for kind, mp in maps.items():
    Wv, Hv, vis, hid = view_lines(SL, kind)
    cl = VCOL[kind]
    fig += POLY([pr(mp(0, 0)), pr(mp(Wv, 0)), pr(mp(Wv, Hv)), pr(mp(0, Hv))], cl, op=0.22)
    for (p, q) in hid: fig += LINE(pr(mp(*p)), pr(mp(*q)), cl, 2.5, '6 5')
    for (p, q) in vis: fig += LINE(pr(mp(*p)), pr(mp(*q)), cl, 3.5)
fig += draw_vox(SL, pr, PA, cubes=False)
fig += T(pr((1.5, 1, -g))[0], pr((1.5, 1, -g))[1] + 46, 'pelan', GR, 18)
fig += T(pr((1.5, Dd + g, 2))[0], pr((1.5, Dd + g, 2))[1] - 24, 'dongakan depan', TR, 18)
fig += T(pr((-g, 0, 2.3))[0] - 4, pr((-g, 0, 2.3))[1] - 16, 'dongakan sisi', PK, 18, 'start')
add('7.1', 'KONSEP', 'Satah mengufuk dan satah mencancang',
    P('Objek boleh diunjurkan pada tiga satah yang saling berserenjang:', True)
    + TABLE(['Satah unjuran', 'Dilihat dari', 'Imej'],
            [[f'{B("Satah mengufuk", GR)}', 'atas', 'Pelan'],
             [f'{B("Satah mencancang", TR)} (depan)', 'depan', 'Dongakan depan'],
             [f'{B("Satah mencancang", PK)} (sisi)', 'sisi', 'Dongakan sisi']], col, rv=True)
    + NOTE('Satah <b>mengufuk</b> selari dengan lantai. Satah <b>mencancang</b> tegak seperti dinding.'),
    svg(fig, 'Blok L di tengah tiga satah unjuran dengan imej pelan, dongakan depan dan dongakan sisi'))

# 7.1-3 Ciri-ciri unjuran ortogon (kuboid: tepi berserenjang menjadi titik)
SC = vox_from_h([[2, 2, 2]])                         # kuboid 3 × 1 × 2
assert view_lines(SC, 'depan')[:2] == (3, 2) and view_lines(SC, 'depan')[2] == [((0, 0), (0, 2)), ((0, 0), (3, 0)), ((0, 2), (3, 2)), ((3, 0), (3, 2))]
YP0 = -2.4
pts = vox_pts(SC) + [(-0.2, -2.4, 0), (3.2, -2.4, 2)]
pr = Iso(pts + [(-0.4, YP0, -0.4), (3.4, YP0, 2.4)], (30, 30, 470, 410))
fig = draw_vox(SC, pr, PA, cubes=False)
# satah mencancang di hadapan & garis unjuran mendatar
YP = -2.4
fig = POLY([pr((-0.4, YP, -0.4)), pr((3.4, YP, -0.4)), pr((3.4, YP, 2.4)), pr((-0.4, YP, 2.4))], DIM, MU2, 2, 0.45) \
    + POLY([pr((0, YP, 0)), pr((3, YP, 0)), pr((3, YP, 2)), pr((0, YP, 2))], TR, TR, 3.5, 0.25) + fig
for (x, z) in [(0, 2), (3, 2), (3, 0)]:
    fig += LINE(pr((x, 0, z)), pr((x, YP, z)), AM, 2.5, '7 6')
fig += T(pr((1.5, YP, 1))[0], pr((1.5, YP, 1))[1], 'saiz sebenar', TR, 17)
fig += T(250, 440, 'Kuboid diunjurkan pada satah mencancang di depannya', MU3, 16, halo=False)
add('7.1', 'CIRI-CIRI', 'Ciri-ciri unjuran ortogon',
    BUL(['Semua garis unjuran <b>selari</b> dan <b>berserenjang</b> dengan satah unjuran.',
         'Muka objek yang <b>selari</b> dengan satah menghasilkan imej yang <b>sama bentuk dan sama saiz</b>.',
         'Tepi yang <b>berserenjang</b> dengan satah kelihatan sebagai <b>satu titik</b>.',
         'Tepi yang tidak kelihatan dilukis dengan <b>garis putus-putus</b>.'], col)
    + NOTE('Tepi yang <b>condong</b> kepada satah kelihatan <b>lebih pendek</b> dalam imejnya.'),
    svg(fig, 'Kuboid diunjurkan pada satah mencancang di hadapannya; imej segi empat tepat bersaiz sebenar'))

# 7.1-4 Contoh berlangkah: melukis unjuran ortogon (pelan blok L) pada grid 1 cm
pts = vox_pts(SL)
pr = Iso(pts, (40, 30, 300, 220))
fig = draw_vox(SL, pr, PA, cubes=True)
# anak panah dari atas
top = pr((1.5, 1, 2))
fig += ARROW((top[0], top[1] - 70), (top[0], top[1] - 14), GR, 4)
fig += T(top[0] + 14, top[1] - 64, 'atas', GR, 18, 'start')
fig += T(pr((1.5, 0, 0))[0] - 30, pr((1.5, 0, 0))[1] + 26, 'sisi kiub = 1 cm', MU3, 16)
fig += RECT(300, 40, 186, 190, SURF, BD, 16, 2) + T(393, 70, 'Lihat dari atas:', MU, 16, halo=False)
fig += T(393, 98, 'aras 2 cm di kiri,', MU3, 15, halo=False) + T(393, 120, 'aras 1 cm di kanan', MU3, 15, halo=False)
fig += T(393, 160, 'Garis pada', AM, 16, halo=False) + T(393, 182, 'perubahan aras', AM, 16, halo=False)
fig += draw_view(SL, 'pelan', 130, 430, 64, title='Pelan', dims=True)
assert view_lines(SL, 'pelan')[2] == [((0, 0), (0, 2)), ((0, 0), (3, 0)), ((0, 2), (3, 2)), ((1, 0), (1, 2)), ((3, 0), (3, 2))]
add('7.1', 'CONTOH BERLANGKAH', 'Melukis unjuran ortogon',
    P('Lukis unjuran ortogon blok di bawah pada satah mengufuk (dilihat dari atas) dengan skala penuh.', True)
    + STEPS(['Tentukan arah pandangan: dari <b>atas</b>, berserenjang dengan satah mengufuk.',
             'Ukur panjang dan lebar sebenar: <b>3 cm</b> × <b>2 cm</b>.',
             'Lukis garis sempadan, kemudian garis di tempat <b>aras berubah</b> (1 cm dari kiri).',
             'Semak: ada tepi tersembunyi? Tiada, jadi semua garis penuh.'], col)
    + ANS('Segi empat tepat 3 cm × 2 cm dengan satu garis pemisah'),
    svg(fig, 'Blok L dan unjuran ortogonnya pada satah mengufuk, 3 cm kali 2 cm'))

# 7.1-5 Membanding objek dengan imej (baji: muka condong)
a_, h_, l_ = 4, 3, 6
c_ = math.hypot(a_, h_); assert c_ == 5
V = [(0, 0, 0), (a_, 0, 0), (0, 0, h_), (0, l_, 0), (a_, l_, 0), (0, l_, h_)]
Fc = [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [0, 2, 5, 3], [1, 2, 5, 4]]
ZP = -2.2
pts = V + [(-0.6, -0.6, ZP), (a_ + 0.6, l_ + 0.6, ZP), (a_ + 0.6, -0.6, ZP), (-0.6, l_ + 0.6, ZP)]
pr = Iso(pts, (30, 20, 470, 440))
fig = POLY([pr(p) for p in [(-0.6, -0.6, ZP), (a_ + 0.6, -0.6, ZP), (a_ + 0.6, l_ + 0.6, ZP), (-0.6, l_ + 0.6, ZP)]], DIM, MU2, 2, 0.55)
fig += POLY([pr((0, 0, ZP)), pr((a_, 0, ZP)), pr((a_, l_, ZP)), pr((0, l_, ZP))], GR, GR, 3.5, 0.25)
for p in [(0, 0, h_), (a_, 0, 0), (0, l_, h_)]:
    fig += LINE(pr(p), pr((p[0], p[1], ZP)), AM, 2.5, '7 6')
fig += draw_poly(V, Fc, pr, TR)
fig += LINE(pr((a_, 0, 0)), pr((0, 0, h_)), PK, 6) + LINE(pr((a_, 0, ZP)), pr((0, 0, ZP)), PK, 6)
mA = pr((a_ / 2, 0, h_ / 2)); mB = pr((a_ / 2, 0, ZP))
fig += T(mA[0] - 30, mA[1] - 4, 'AB = 5 cm', PK, 18, 'end') + T(mB[0] - 16, mB[1] + 22, 'A′B′ = 4 cm', PK, 18, 'end')
fig += T(pr((0, 0, h_))[0] - 10, pr((0, 0, h_))[1] - 14, 'A', TX, 19) + T(pr((a_, 0, 0))[0] + 4, pr((a_, 0, 0))[1] + 22, 'B', TX, 19)
fig += T(pr((0, 0, h_ / 2))[0] - 14, pr((0, 0, h_ / 2))[1], '3 cm', MU3, 16, 'end')
assert a_ * l_ == 24 and c_ * l_ == 30
add('7.1', 'MEMBANDING', 'Objek berbanding imejnya',
    P('Baji di bawah diunjurkan pada satah mengufuk. Muka condong AB berukuran 5 cm × 6 cm.', True)
    + TABLE(['Perkara', 'Objek', 'Imej (pelan)'],
            [['Panjang AB', '5 cm', '4 cm'],
             ['Panjang tepi 6 cm', '6 cm', '6 cm'],
             ['Luas muka condong', '30 cm²', '24 cm²'],
             ['Sudut di bucu muka', '90°', '90°']], col, rv=True)
    + NOTE('Tepi yang <b>selari</b> dengan satah kekal sama panjang. Tepi <b>condong</b> menjadi lebih pendek: A′B′ = ' + RT('5² − 3²') + ' = 4 cm.'),
    svg(fig, 'Baji dengan muka condong AB 5 cm; imejnya pada satah mengufuk 4 cm'))

# 7.1-6 Kesilapan biasa
SK = vox_from_h([[1, 2], [2, 2]])      # depan penuh 2 tinggi, belakang kiri 1 tinggi -> garis tersembunyi pada dongakan depan
Wv, Hv, vis, hid = view_lines(SK, 'depan')
assert hid == [((0, 1), (1, 1)), ((1, 1), (1, 2))] and (Wv, Hv) == (2, 2), hid
pts = vox_pts(SK)
pr = Iso(pts, (90, 26, 236, 190))
fig = draw_vox(SK, pr, PU, cubes=False)
fp = pr((1, 0, 0.6))
fig += ARROW((fp[0] - 56, fp[1] + 46), (fp[0] - 14, fp[1] + 12), TR, 4) + T(fp[0] - 58, fp[1] + 60, 'depan', TR, 17, 'end')
fig += T(130, 222, 'Ada takuk di belakang kiri', MU3, 16, halo=False)
fig += RECT(250, 24, 236, 200, SURF, GR, 16, 2) + TICK(276, 50) + T(296, 50, 'Betul', GR, 18, 'start')
fig += draw_view(SK, 'depan', 316, 200, 58, TR)
# salah: tiada garis tersembunyi
fig += RECT(14, 250, 230, 206, SURF, RD, 16, 2) + CROSS(40, 276) + T(60, 276, 'Tiada garis', RD, 17, 'start') + T(60, 298, 'tersembunyi', RD, 17, 'start')
fig += POLY([(70, 430), (186, 430), (186, 314), (70, 314)], TR, TR, 4.5, 0.13)
# salah: garis penuh untuk tepi tersembunyi
fig += RECT(256, 250, 230, 206, SURF, RD, 16, 2) + CROSS(282, 276) + T(302, 276, 'Garis tersembunyi', RD, 17, 'start') + T(302, 298, 'dilukis penuh', RD, 17, 'start')
fig += POLY([(312, 430), (428, 430), (428, 314), (312, 314)], TR, TR, 4.5, 0.13) + LINE((312, 372), (370, 372), TR, 4.5) + LINE((370, 372), (370, 314), TR, 4.5)
add('7.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Mengabaikan tepi tersembunyi", RD)}: tepi di belakang tetap dilukis, tetapi dengan garis putus-putus.',
         f'{B("Melukis tepi tersembunyi dengan garis penuh", RD)}: garis penuh hanya untuk tepi yang kelihatan.',
         f'{B("Menyangka tepi condong sama panjang", RD)}: imej tepi condong lebih pendek.',
         f'{B("Tersalah arah pandangan", RD)}: pastikan garis unjuran berserenjang dengan satah.'], col)
    + NOTE('Bandingkan setiap imej dengan objek: ukuran yang selari dengan satah mesti <b>sama</b>.', 'Semak:'),
    svg(fig, 'Dongakan depan yang betul dengan garis putus-putus berbanding dua lukisan yang salah'))

# ===================== 7.2 PELAN DAN DONGAKAN =====================
col = SUB['7.2'][1]

# 7.2-1 Definisi: tiga pandangan
pts = vox_pts(SL)
pr = Iso(pts, (130, 18, 370, 190))
fig = draw_vox(SL, pr, PA, cubes=False)
fA = pr((1.5, 0, 0.5)); sA = pr((3, 1, 0.5)); tA = pr((1.5, 1, 2))
fig += ARROW((fA[0] - 70, fA[1] + 46), (fA[0] - 14, fA[1] + 10), TR, 4) + T(fA[0] - 76, fA[1] + 58, 'depan', TR, 17, 'end')
fig += ARROW((sA[0] + 70, sA[1] + 40), (sA[0] + 14, sA[1] + 8), PK, 4) + T(sA[0] + 76, sA[1] + 52, 'sisi', PK, 17, 'start')
fig += ARROW((tA[0], tA[1] - 50), (tA[0], tA[1] - 10), GR, 4) + T(tA[0] + 12, tA[1] - 44, 'atas', GR, 17, 'start')
k = 44
fig += draw_view(SL, 'depan', 40, 330, k, title='Dongakan depan', tsz=16)
fig += draw_view(SL, 'sisi', 330, 330, k, title='Dongakan sisi', tsz=16)
fig += draw_view(SL, 'pelan', 40, 446, k, title=None)
fig += T(200, 410, 'Pelan', GR, 16, 'start')
add('7.2', 'DEFINISI', 'Pelan, dongakan depan dan dongakan sisi',
    BUL([f'{B("Pelan", GR)}: unjuran ortogon pada satah mengufuk, dilihat dari <b>atas</b>.',
         f'{B("Dongakan depan", TR)}: unjuran ortogon pada satah mencancang, dilihat dari <b>depan</b>.',
         f'{B("Dongakan sisi", PK)}: unjuran ortogon pada satah mencancang, dilihat dari <b>sisi</b> (kiri atau kanan).'], col)
    + NOTE('Arah pandangan biasanya ditunjukkan dengan anak panah berlabel, contohnya “dilihat dari X”. Dalam app ini, dongakan sisi dilihat dari <b>kanan</b> kecuali dinyatakan.'),
    svg(fig, 'Blok L dengan anak panah depan, sisi dan atas serta tiga pandangannya'))

# 7.2-2 Ukuran sepadan & susunan
k = 56
x0, yF = 60, 200            # dongakan depan: kiri-bawah
fig = draw_view(SL, 'depan', x0, yF, k, title='Dongakan depan', tsz=16)
xs = x0 + 3 * k + 60
fig += draw_view(SL, 'sisi', xs, yF, k, title='Dongakan sisi', tsz=16)
yP = yF + 60 + 2 * k
fig += draw_view(SL, 'pelan', x0, yP, k)
fig += T(x0 + 1.5 * k, yP + 22, 'Pelan', GR, 16)
# garis unjuran (penyambung) menegak antara depan & pelan, mendatar antara depan & sisi
for i in range(4):
    fig += LINE((x0 + i * k, yF + 8), (x0 + i * k, yP - 2 * k - 8), MU2, 1.8, '4 5')
for j in range(3):
    fig += LINE((x0 + 3 * k + 8, yF - j * k), (xs - 8, yF - j * k), MU2, 1.8, '4 5')
fig += T(x0 + 1.5 * k, yF + 30, 'panjang 3 cm sama', AM, 15)
fig += T(xs + k, yF + 24, 'lebar 2 cm', AM, 15)
fig += RECT(262, yP - 2 * k - 4, 222, 118, SURF, BD, 14, 2)
fig += T(373, yP - 2 * k + 22, 'Lebar pelan = lebar', AM, 15, halo=False) + T(373, yP - 2 * k + 44, 'dongakan sisi (2 cm)', AM, 15, halo=False)
fig += T(373, yP - 2 * k + 74, 'Tinggi depan = tinggi', MU3, 15, halo=False) + T(373, yP - 2 * k + 96, 'sisi (2 cm)', MU3, 15, halo=False)
add('7.2', 'KONSEP', 'Ukuran yang sepadan',
    P('Ketiga-tiga pandangan menunjukkan ukuran yang sama bagi objek yang sama:', True)
    + TABLE(['Pandangan', 'Ukuran yang ditunjukkan'],
            [[B('Pelan', GR), 'panjang × lebar'],
             [B('Dongakan depan', TR), 'panjang × tinggi'],
             [B('Dongakan sisi', PK), 'lebar × tinggi']], col, rv=True)
    + BUL(['Pelan dilukis <b>di bawah</b> dongakan depan; dongakan sisi <b>di sebelah</b> dongakan depan.',
           'Garis unjuran (putus-putus halus) membantu menjajarkan ukuran.'], col),
    svg(fig, 'Susunan dongakan depan, dongakan sisi dan pelan dengan garis penjajaran'))

# 7.2-3 Contoh berlangkah: pepejal bertingkat (sisi kiub 2 cm)
HS = [[3, 2, 1],
      [2, 1, 1]]
SS = vox_from_h(HS)
assert len(SS) == 10
vP = view_lines(SS, 'pelan'); vD = view_lines(SS, 'depan'); vS = view_lines(SS, 'sisi')
assert vP[:2] == (3, 2) and vD[:2] == (3, 3) and vS[:2] == (2, 3)
assert vD[3] == [] and vS[3] == []
pts = vox_pts(SS)
pr = Iso(pts, (70, 20, 250, 200))
fig = draw_vox(SS, pr, PA, cubes=True)
fA = pr((1.5, 0, 0.5))
fig += ARROW((fA[0] - 50, fA[1] + 40), (fA[0] - 12, fA[1] + 10), TR, 4) + T(fA[0] - 52, fA[1] + 54, 'depan', TR, 16, 'end')
sA = pr((3, 1, 1))
fig += ARROW((sA[0] + 56, sA[1] + 34), (sA[0] + 12, sA[1] + 6), PK, 4) + T(sA[0] + 58, sA[1] + 48, 'sisi', PK, 16, 'start')
k = 40
fig += draw_view(SS, 'pelan', 310, 150, k, title='Pelan', dims=True, u=2, tsz=16)
fig += draw_view(SS, 'depan', 40, 430, k, title='Dongakan depan', dims=True, u=2, tsz=16)
fig += draw_view(SS, 'sisi', 300, 430, k, title='Dongakan sisi', dims=True, u=2, tsz=16)
add('7.2', 'CONTOH BERLANGKAH', 'Melukis pelan dan dongakan',
    P('Pepejal dibina daripada kiub bersisi 2 cm. Lukis pelan, dongakan depan dan dongakan sisinya.', True)
    + STEPS(['<b>Pelan</b> (atas): 3 × 2 petak = 6 cm × 4 cm. Lukis garis di setiap perubahan aras.',
             '<b>Dongakan depan</b>: tinggi lajur dari kiri = 3, 2, 1 kiub → bertingkat, 6 cm × 6 cm.',
             '<b>Dongakan sisi</b> (dari kanan): baris depan 2 kiub (kiri), baris belakang 3 kiub (kanan) → 4 cm × 6 cm.'], col)
    + NOTE('Gunakan ukuran yang sama: lebar pelan = lebar dongakan sisi = 4 cm.'),
    svg(fig, 'Pepejal bertingkat kiub 2 cm serta pelan, dongakan depan dan dongakan sisinya'))

# 7.2-4 Garis tersembunyi
HT = [[2, 2, 2],
      [1, 2, 1]]
ST = vox_from_h(HT)
vS = view_lines(ST, 'sisi'); vD = view_lines(ST, 'depan')
assert vD[3] == [] and vS[3] == []
HT = [[1, 2, 1],
      [2, 2, 2]]
ST = vox_from_h(HT)
vD = view_lines(ST, 'depan')
assert vD[3] == [((0, 1), (1, 1)), ((1, 1), (1, 2)), ((2, 1), (2, 2)), ((2, 1), (3, 1))], vD[3]
pts = vox_pts(ST)
pr = Iso(pts, (40, 20, 300, 230))
fig = draw_vox(ST, pr, PU, cubes=False)
fA = pr((1.5, 0, 0.6))
fig += ARROW((fA[0] - 66, fA[1] + 48), (fA[0] - 14, fA[1] + 10), TR, 4) + T(fA[0] - 70, fA[1] + 60, 'depan', TR, 17, 'end')
k = 62
fig += draw_view(ST, 'depan', 90, 440, k, title='Dongakan depan', tsz=17)
fig += T(330, 372, '← tepi di belakang', PK, 16, 'start', halo=False) + T(330, 396, 'tersembunyi', PK, 16, 'start', halo=False)
fig += T(330, 420, '(garis putus-putus)', PK, 16, 'start', halo=False)
fig += RECT(318, 40, 168, 150, SURF, BD, 14, 2) + T(402, 66, 'Dari depan:', MU, 15, halo=False)
fig += T(402, 94, 'baris depan 2 kiub', MU3, 15, halo=False) + T(402, 116, 'tinggi menutup', MU3, 15, halo=False) + T(402, 138, 'aras 1 kiub', MU3, 15, halo=False) + T(402, 160, 'di belakang', MU3, 15, halo=False)
add('7.2', 'GARIS TERSEMBUNYI', 'Tepi yang tidak kelihatan',
    P('Bahagian belakang pepejal ini lebih rendah di kiri dan di kanan. Dari depan, tepi itu terlindung oleh baris depan.', True)
    + STEPS(['Lukis garis sempadan dongakan depan: 3 × 2 petak.',
             'Tepi aras 1 kiub di belakang tidak kelihatan dari depan.',
             'Lukis tepi itu dengan <b>garis putus-putus</b>.'], col)
    + NOTE('Garis putus-putus menunjukkan tepi yang <b>wujud</b> tetapi <b>terlindung</b> dari arah pandangan.'),
    svg(fig, 'Pepejal dengan bahagian belakang lebih rendah dan dongakan depannya dengan garis putus-putus'))

# 7.2-5 Membina pepejal daripada pelan bernombor
HN = [[3, 1, 0],
      [2, 1, 1]]
SN = vox_from_h(HN)
assert len(SN) == sum(map(sum, HN)) == 8
k = 66
x0, y0 = 40, 60
fig = T(x0 + 1.5 * k, y0 - 26, 'Pelan (nombor = tinggi lajur)', GR, 16)
for r, row in enumerate(HN):
    for c, h in enumerate(row):
        if h:
            fig += POLY([(x0 + c * k, y0 + r * k), (x0 + (c + 1) * k, y0 + r * k), (x0 + (c + 1) * k, y0 + (r + 1) * k), (x0 + c * k, y0 + (r + 1) * k)], GR, GR, 3.5, 0.15)
            fig += T(x0 + c * k + k / 2, y0 + r * k + k / 2, str(h), TX, 26)
fig += T(x0 + 1.5 * k, y0 + 2 * k + 20, 'depan ↓', TR, 15)
pts = vox_pts(SN)
pr = Iso(pts, (260, 24, 480, 230))
fig += draw_vox(SN, pr, PA, cubes=True)
k2 = 42
fig += draw_view(SN, 'depan', 60, 430, k2, title='Dongakan depan', tsz=16)
fig += draw_view(SN, 'sisi', 300, 430, k2, title='Dongakan sisi', tsz=16)
assert view_lines(SN, 'depan')[:2] == (3, 3) and view_lines(SN, 'sisi')[:2] == (2, 3)
add('7.2', 'MEMBINA PEPEJAL', 'Daripada pelan kepada pepejal',
    P('Pelan bernombor menunjukkan bilangan kiub dalam setiap lajur. Bina pepejal dan lukis dongakannya.', True)
    + STEPS(['Bilangan kiub = 3 + 1 + 2 + 1 + 1 = <b>8</b>.',
             'Dongakan depan: ambil lajur <b>paling tinggi</b> bagi setiap lajur dari kiri: 3, 1, 1.',
             'Dongakan sisi (dari kanan): baris depan 2 kiub, baris belakang 3 kiub.'], col)
    + ANS('8 kiub; dongakan depan bertinggi 3, 1, 1')
    + NOTE('Lajur yang lebih rendah di belakang tidak kelihatan jika ada lajur yang lebih tinggi di depannya.'),
    svg(fig, 'Pelan bernombor, pepejal kiub yang dibina dan dongakan depan serta sisinya'))

# 7.2-6 Kesilapan biasa: dongakan sisi dicerminkan / dari arah salah
SM = vox_from_h([[1, 1],
                 [2, 1]])
vS = view_lines(SM, 'sisi'); assert vS[:2] == (2, 2)
gS = view_grid(SM, 'sisi'); assert (0, 1) in gS and (1, 1) not in gS   # dari kanan: bahagian tinggi (depan) di kiri
pts = vox_pts(SM)
pr = Iso(pts, (40, 24, 180, 190))
fig = draw_vox(SM, pr, PA, cubes=False)
sA = pr((2, 1, 0.6))
fig += ARROW((sA[0] + 48, sA[1] + 34), (sA[0] + 12, sA[1] + 8), PK, 4) + T(sA[0] + 44, sA[1] + 50, 'kanan', PK, 16, 'start')
fA = pr((1, 0, 0.6))
fig += T(fA[0] - 24, fA[1] + 46, 'depan', TR, 16, 'start')
fig += RECT(250, 24, 236, 200, SURF, GR, 16, 2) + TICK(276, 50) + T(296, 50, 'Dari kanan', GR, 17, 'start')
fig += draw_view(SM, 'sisi', 318, 200, 60, PK)
fig += T(318 + 30, 214, 'depan', MU, 13, halo=False) + T(318 + 90, 214, 'belakang', MU, 13, halo=False)
# salah: dicerminkan
SMm = {(x, 1 - y, z) for (x, y, z) in SM}
fig += RECT(14, 250, 230, 206, SURF, RD, 16, 2) + CROSS(40, 276) + T(60, 276, 'Tercermin', RD, 17, 'start') + T(60, 298, '(dilihat dari kiri)', RD, 15, 'start')
fig += draw_view(SMm, 'sisi', 70, 430, 58, PK, grid=False)
fig += RECT(256, 250, 230, 206, SURF, RD, 16, 2) + CROSS(282, 276) + T(302, 276, 'Ukuran tidak', RD, 17, 'start') + T(302, 298, 'sepadan', RD, 17, 'start')
fig += POLY([(330, 430), (420, 430), (420, 385), (375, 385), (375, 318), (330, 318)], PK, PK, 4.5, 0.13)
fig += T(432, 360, 'tinggi', RD, 14, 'start', halo=False) + T(432, 378, '3 ≠ 2', RD, 14, 'start', halo=False)
add('7.2', 'KESILAPAN BIASA', 'Semak arah dan ukuran',
    BUL([f'{B("Dongakan sisi tercermin", RD)}: dilihat dari kanan, bahagian <b>depan</b> objek berada di sebelah <b>kiri</b> lukisan.',
         f'{B("Ukuran tidak sepadan", RD)}: tinggi dongakan sisi mesti sama dengan tinggi dongakan depan.',
         f'{B("Tertinggal garis perubahan aras", RD)}: setiap aras yang berbeza dipisahkan oleh satu garis.',
         f'{B("Tidak ikut skala", RD)}: lukis dengan skala penuh seperti yang diminta.'], col)
    + NOTE('Bayangkan anda berdiri di arah anak panah, kemudian lukis apa yang <b>dilihat</b>.', 'Petua:'),
    svg(fig, 'Dongakan sisi yang betul dilihat dari kanan berbanding lukisan tercermin'))

# 7.2-7 Ringkasan
fig = ''
SR = vox_from_h([[2, 1], [1, 1]])
pts = vox_pts(SR)
pr = Iso(pts, (170, 16, 330, 150))
fig += draw_vox(SR, pr, PA, cubes=False)
fig += T(250, 168, 'Objek', PA, 18)
items = [('pelan', 'Pelan', 'atas', 'panjang × lebar'), ('depan', 'Dongakan depan', 'depan', 'panjang × tinggi'), ('sisi', 'Dongakan sisi', 'sisi', 'lebar × tinggi')]
for i, (kd, nm, arah, uk) in enumerate(items):
    y0 = 190 + i * 92
    fig += RECT(14, y0, 472, 82, SURF, BD, 16, 2)
    fig += draw_view(SR, kd, 34, y0 + 72, 30, grid=False)
    fig += T(112, y0 + 28, nm, VCOL[kd], 20, 'start') + T(112, y0 + 56, f'dilihat dari {arah}', MU, 16, 'start', halo=False)
    fig += T(466, y0 + 42, uk, TX, 18, 'end')
add('7.2', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Perkara', 'Isi penting'],
          [['Unjuran ortogon', 'garis unjuran ⊥ satah'],
           ['Pelan', 'satah mengufuk, dari atas'],
           ['Dongakan', 'satah mencancang, dari depan / sisi'],
           ['Tepi tersembunyi', 'garis putus-putus']], col, rv=True)
    + BUL(['Ukuran yang selari dengan satah kekal sama; tepi condong menjadi lebih pendek.',
           'Lukis dengan skala penuh dan pastikan ukuran ketiga-tiga pandangan sepadan.'], col),
    svg(fig, 'Ringkasan tiga pandangan sebuah objek'))

# ---------- tulis fail ----------
counts = {}
for s in S_: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S_:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body
assert counts == {'7.1': 6, '7.2': 7}, counts

js = ('/* Dijana oleh tools/pelan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
