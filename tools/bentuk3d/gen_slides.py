# Penjana slaid NOTA BENTUK3D (Tingkatan 2 Bab 6 Bentuk Geometri Tiga Dimensi) -> bentuk3d/slides.js
# Jalankan:  python3 tools/bentuk3d/gen_slides.py
# Rajah guna HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'bentuk3d', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
TEAL = '#2DD4BF'   # warna subtopik 6.1 (ditetapkan Manager); rajah guna warna palet
SUB = {
    '6.1': ('Sifat Geometri Bentuk Tiga Dimensi', TEAL),
    '6.2': ('Bentangan Bentuk Geometri Tiga Dimensi', C['pu']),
    '6.3': ('Luas Permukaan Bentuk Geometri Tiga Dimensi', C['pa']),
    '6.4': ('Isi Padu Bentuk Geometri Tiga Dimensi', C['tr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
FACE, EDGE, VERT = TR, AM, PK      # warna tetap: muka (biru), tepi (kuning), bucu (merah jambu)
PI = F(22, 7)

# ---------- semakan matematik ----------
def fnum(x):
    """Nombor -> teks (ruang ribuan ala buku teks, titik perpuluhan)."""
    x = F(x)
    if x.denominator == 1:
        n = abs(x.numerator); t = f'{n:,}'.replace(',', ' ') if n >= 10000 else str(n)
    else:
        v = float(x); t = f'{abs(v):.2f}'.rstrip('0').rstrip('.')
    return ('−' if x < 0 else '') + t
def isint(x): return F(x).denominator == 1

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
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
PIs = 'π'
J, Tt, S_, L_, Pp, Ll, Ss = '<i>j</i>', '<i>t</i>', '<i>s</i>', '<i>l</i>', '<i>p</i>', '<i>l</i>', '<i>s</i>'
SEPERTIGA = FR(1, 3); EMPAT3 = FR(4, 3); PI7 = FR(22, 7)

import sys as _s; _s.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from mathfmt import mathW, SFR as _MSFR, SRT as _MSRT
def SMIX(x, y, parts, col, size=20, anchor='middle', halo=None):
    # baris campuran teks + pecahan bertingkat/punca (SVG). y = garis tengah. parts: 'teks' | ('f', a, b) | ('r', t[, n])
    fs = size * .85; ws = []
    for p in parts:
        if isinstance(p, str): ws.append(mathW(p, size) * .92)
        elif p[0] == 'f': ws.append(max(mathW(p[1], fs), mathW(p[2], fs)) + 10)
        else: ws.append(size * .62 + mathW(p[1], size) + 6 + (size * .3 if len(p) > 2 and p[2] else 0))
    tot = sum(ws); x0 = x if anchor == 'start' else (x - tot if anchor == 'end' else x - tot / 2); o = ''
    for p, w in zip(parts, ws):
        if isinstance(p, str): o += f'<text x="{x0:.1f}" y="{y:.1f}" fill="{col}" font-size="{size}" font-weight="700" text-anchor="start" dominant-baseline="middle" xml:space="preserve">{p}</text>'
        elif p[0] == 'f': o += _MSFR(x0, y, p[1], p[2], col, fs, 'start')
        else:
            n = p[2] if len(p) > 2 else None
            o += _MSRT(x0 + (size * .3 if n else 0), y + size * .35, p[1], col, size, 'start', n)
        x0 += w
    if halo: o = o.replace('<text ', f'<text paint-order="stroke" stroke="{halo}" stroke-width="6" stroke-linejoin="round" ')
    return o

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
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def CIRC(c, r, fill='none', stroke=TX, sw=4, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(c[0])}" cy="{r1(c[1])}" r="{r1(r)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def ELL(c, rx, ry, fill='none', stroke=TX, sw=4, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<ellipse cx="{r1(c[0])}" cy="{r1(c[1])}" rx="{r1(rx)}" ry="{r1(ry)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def ARC(c, rx, ry, a0, a1, col=TX, sw=4, dash=None):
    """Lengkok elips dari sudut a0 ke a1 (darjah, 0 = kanan, 90 = bawah skrin)."""
    pts = [(c[0] + rx * math.cos(math.radians(a0 + (a1 - a0) * i / 40)), c[1] + ry * math.sin(math.radians(a0 + (a1 - a0) * i / 40))) for i in range(41)]
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="M{" L".join(f"{r1(x)} {r1(y)}" for x, y in pts)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def PATH(d, fill='none', stroke=TX, sw=4, dash=None):
    dd = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"{dd}/>'
def right_angle(M, u, v, col=TX, k=14):
    a = (M[0] + u[0] * k, M[1] + u[1] * k); b = (a[0] + v[0] * k, a[1] + v[1] * k); c = (M[0] + v[0] * k, M[1] + v[1] * k)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} L{r1(c[0])} {r1(c[1])}" fill="none" stroke="{col}" stroke-width="2.5"/>'
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
def DIMLINE(p, q, lab, col=MU3, off=22, size=18, side=1):
    """Garis ukuran selari p-q dengan label, dianjak ke sisi."""
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L * off * side, dx / L * off * side
    a, b = (p[0] + nx, p[1] + ny), (q[0] + nx, q[1] + ny)
    m = ((a[0] + b[0]) / 2 + nx * 0.9, (a[1] + b[1]) / 2 + ny * 0.9)
    return LINE(a, b, col, 2, '5 5') + T(m[0], m[1], lab, col, size)

# ---------- pelukis polihedron 3D (unjuran ortografik) ----------
class Cam:
    def __init__(self, yaw=-32, pitch=22):
        self.cy, self.sy = math.cos(math.radians(yaw)), math.sin(math.radians(yaw))
        self.cp, self.sp = math.cos(math.radians(pitch)), math.sin(math.radians(pitch))
    def rot(self, p):
        x, y, z = p
        x, z = x * self.cy + z * self.sy, -x * self.sy + z * self.cy     # putar paksi-y
        y, z = y * self.cp - z * self.sp, y * self.sp + z * self.cp      # dongak paksi-x (atas kelihatan)
        return (x, y, z)

class Solid:
    """Polihedron: V = bucu 3D, Fc = muka (indeks bucu). Dilukis dalam kotak (L,T,R,B) atau dengan skala/pusat diberi."""
    def __init__(self, V, Fc, cam=None, box=None, scale=None, at=None):
        self.V, self.Fc, self.cam = V, Fc, cam or Cam()
        R = [self.cam.rot(p) for p in V]
        cen = [sum(p[i] for p in V) / len(V) for i in range(3)]
        self.vis = []
        for f in Fc:
            a, b, c = (V[f[0]], V[f[1]], V[f[2]])
            u = [b[i] - a[i] for i in range(3)]; w = [c[i] - a[i] for i in range(3)]
            n = (u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0])
            fc = [sum(V[k][i] for k in f) / len(f) for i in range(3)]
            if sum(n[i] * (fc[i] - cen[i]) for i in range(3)) < 0: n = tuple(-x for x in n)
            self.vis.append(self.cam.rot((n[0] + 0, n[1], n[2]))[2] - self.cam.rot((0, 0, 0))[2] > 1e-9)
        xs = [p[0] for p in R]; ys = [p[1] for p in R]
        if scale is None:
            L, Tp, Rr, Bm = box
            scale = min((Rr - L) / (max(xs) - min(xs)), (Bm - Tp) / (max(ys) - min(ys)))
            at = ((L + Rr) / 2, (Tp + Bm) / 2)
        mx, my = (max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2
        self.P = [(at[0] + scale * (p[0] - mx), at[1] - scale * (p[1] - my)) for p in R]
        self.s = scale
        self.ctr = (sum(p[0] for p in self.P) / len(self.P), sum(p[1] for p in self.P) / len(self.P))
        E = {}
        for fi, f in enumerate(Fc):
            for k in range(len(f)):
                e = tuple(sorted((f[k], f[(k + 1) % len(f)])))
                E.setdefault(e, []).append(fi)
        self.E = E
    def counts(self):
        return len(self.Fc), len(self.E), len(self.V)
    def draw(self, fill=FACE, edge=EDGE, sw=4.5, hl=None, hlcol=PA, verts=False, fillop='26', hidden=True):
        s = ''
        for fi, f in enumerate(self.Fc):
            if self.vis[fi]:
                c = hlcol if hl and fi in hl else fill
                s += POLY([self.P[k] for k in f], f'{c}{"55" if hl and fi in hl else fillop}')
        for e, fs_ in self.E.items():
            v = any(self.vis[k] for k in fs_)
            if v: s += LINE(self.P[e[0]], self.P[e[1]], edge, sw)
            elif hidden: s += LINE(self.P[e[0]], self.P[e[1]], edge, 2.5, '7 7')
        if verts:
            for p in self.P: s += DOT(p, VERT, 7)
        return s
    def lab(self, i, j, t, col=TX, size=19, off=24):
        """Label tepi i-j, dianjak menjauhi pusat rajah."""
        a, b = self.P[i], self.P[j]; m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        if nx * (m[0] - self.ctr[0]) + ny * (m[1] - self.ctr[1]) < 0: nx, ny = -nx, -ny
        return T(m[0] + nx * off, m[1] + ny * off, t, col, size)

def prism(base, h):
    """Prisma tegak: tapak poligon (x,z) pada y=0, tinggi h (paksi-y)."""
    n = len(base)
    V = [(x, 0, z) for x, z in base] + [(x, h, z) for x, z in base]
    Fc = [list(range(n)), list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    return V, Fc
def prism_x(sec, L):
    """Prisma berbaring: keratan rentas (y,z) dipanjangkan sepanjang paksi-x."""
    n = len(sec)
    V = [(0, y, z) for y, z in sec] + [(L, y, z) for y, z in sec]
    Fc = [list(range(n)), list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    return V, Fc
def pyramid(base, h, apex=None):
    n = len(base)
    ax, az = apex if apex else (sum(x for x, _ in base) / n, sum(z for _, z in base) / n)
    V = [(x, 0, z) for x, z in base] + [(ax, h, az)]
    Fc = [list(range(n))] + [[i, (i + 1) % n, n] for i in range(n)]
    return V, Fc
def cuboid(p, l, t):   # p sepanjang x, l sepanjang z, t tinggi
    return prism([(0, 0), (p, 0), (p, l), (0, l)], t)
def ngon(n, r, rot=0):
    return [(r * math.cos(math.radians(rot + 360 * i / n)), r * math.sin(math.radians(rot + 360 * i / n))) for i in range(n)]

# ---------- bentuk melengkung (2D, tapak elips) ----------
def ellipse_tangent(P0, c, rx, ry, right=True):
    """Titik tangen dari P0 ke elips (pusat c). Pilih sisi kanan/kiri."""
    best = None
    for i in range(3600):
        t = 2 * math.pi * i / 3600
        e = (c[0] + rx * math.cos(t), c[1] + ry * math.sin(t))
        tg = (-rx * math.sin(t), ry * math.cos(t))
        d = (e[0] - P0[0], e[1] - P0[1])
        cr = abs(d[0] * tg[1] - d[1] * tg[0]) / (math.hypot(*d) * math.hypot(*tg))
        if (e[0] > c[0]) == right and (best is None or cr < best[0]): best = (cr, e, t)
    return best[1], math.degrees(best[2])

def cylinder(c, r, h, ry=None, col=FACE, edge=EDGE, sw=4.5, top_hl=None):
    """Silinder tegak; c = pusat tapak bawah (skrin). Pulangkan svg."""
    ry = ry or r * 0.32
    top = (c[0], c[1] - h)
    s = f'<path d="M{r1(c[0] - r)} {r1(top[1])} L{r1(c[0] - r)} {r1(c[1])} A{r1(r)} {r1(ry)} 0 0 0 {r1(c[0] + r)} {r1(c[1])} L{r1(c[0] + r)} {r1(top[1])} Z" fill="{col}26"/>'
    s += ELL(top, r, ry, f'{top_hl or col}{"55" if top_hl else "40"}', edge, sw)
    s += ARC(c, r, ry, 180, 360, edge, 2.5, '7 7') + ARC(c, r, ry, 0, 180, edge, sw)
    s += LINE((c[0] - r, top[1]), (c[0] - r, c[1]), edge, sw) + LINE((c[0] + r, top[1]), (c[0] + r, c[1]), edge, sw)
    return s

def cone(c, r, h, ry=None, col=FACE, edge=EDGE, sw=4.5):
    ry = ry or r * 0.32
    A = (c[0], c[1] - h)
    eR, aR = ellipse_tangent(A, c, r, ry, True); eL, aL = ellipse_tangent(A, c, r, ry, False)
    # aR ~ sedikit di bawah 0 (hadapan) / atas; lengkok hadapan dari aR ke aL melalui 90
    aR = aR % 360; aL = aL % 360
    if aR > 180: aR -= 360
    s = f'<path d="M{r1(A[0])} {r1(A[1])} L{r1(eR[0])} {r1(eR[1])} A{r1(r)} {r1(ry)} 0 0 1 {r1(eL[0])} {r1(eL[1])} Z" fill="{col}2E"/>'
    s += ARC(c, r, ry, aL, aR + 360, edge, 2.5, '7 7') + ARC(c, r, ry, aR, aL, edge, sw)
    s += LINE(A, eR, edge, sw) + LINE(A, eL, edge, sw)
    return s, A

def sphere(c, r, col=FACE, edge=EDGE, sw=4.5):
    ry = r * 0.3
    return (CIRC(c, r, f'{col}26', edge, sw) + ARC(c, r, ry, 180, 360, edge, 2.5, '7 7') + ARC(c, r, ry, 0, 180, edge, 3))

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 6.1 SIFAT GEOMETRI =====================
col = SUB['6.1'][1]

# 6.1-1 Definisi: muka, tepi, bucu
V, Fc = cuboid(6, 4, 3.5)
sd = Solid(V, Fc, Cam(-30, 24), box=(70, 70, 430, 390))
assert sd.counts() == (6, 12, 8)
fig = sd.draw()
# serlah satu muka, satu tepi dan satu bucu
front = [fi for fi, f in enumerate(Fc) if sd.vis[fi]]
topf = 1  # muka atas
fig += POLY([sd.P[k] for k in Fc[topf]], f'{FACE}66')
# tepi kelihatan yang bukan sebahagian muka atas: tepi tegak hadapan
e_hl = next(e for e, fs_ in sd.E.items() if all(sd.vis[k] for k in fs_) and topf not in fs_)
fig += LINE(sd.P[e_hl[0]], sd.P[e_hl[1]], EDGE, 9)
fig += DOT(sd.P[5], VERT, 11)
tc = [sum(sd.P[k][i] for k in Fc[topf]) / 4 for i in range(2)]
fig += T(tc[0], tc[1], 'muka', TX, 22)
em = ((sd.P[e_hl[0]][0] + sd.P[e_hl[1]][0]) / 2, (sd.P[e_hl[0]][1] + sd.P[e_hl[1]][1]) / 2 + 30)
fig += T(em[0] - 18, em[1], 'tepi', EDGE, 22, 'end')
fig += T(sd.P[5][0] + 16, sd.P[5][1] - 22, 'bucu', VERT, 22, 'start')
fig += T(250, 440, 'Garis putus-putus = tepi tersembunyi', MU, 17, halo=False)
add('6.1', 'DEFINISI', 'Muka, tepi dan bucu',
    DEF('<b>Bentuk geometri tiga dimensi (3D)</b> ialah bentuk pepejal yang mempunyai <b>panjang</b>, <b>lebar</b> dan <b>tinggi</b>.', col)
    + BUL([f'{B("Muka", FACE)}: permukaan rata atau melengkung.',
           f'{B("Tepi", EDGE)}: garis pertemuan dua muka.',
           f'{B("Bucu", VERT)}: titik pertemuan tiga atau lebih tepi.'], col)
    + NOTE('Kuboid ada <b>6 muka</b>, <b>12 tepi</b> dan <b>8 bucu</b>. Kira juga yang tersembunyi di belakang.'),
    svg(fig, 'Kuboid dengan satu muka, satu tepi dan satu bucu dilabelkan'))

# 6.1-2 Prisma
tri = [(0, 0), (0, 4), (3.2, 2)]     # (y, z): tapak di lantai, puncak di atas
V, Fc = prism_x(tri, 7)
sd = Solid(V, Fc, Cam(-55, 18), box=(60, 60, 440, 320))
assert sd.counts() == (5, 9, 6)
fig = sd.draw(hl=[0, 1], hlcol=PA)
# keratan rentas di tengah (seragam)
for fr_ in (0.35, 0.65):
    Vm = [(7 * fr_, y, z) for y, z in tri]
    pm = Solid(V + Vm, Fc, Cam(-55, 18), box=(60, 60, 440, 320))
    fig += POLY([pm.P[6], pm.P[7], pm.P[8]], f'{PA}40', PA, 2.5)
fig += T(250, 32, 'Keratan rentas sama di sepanjang prisma', MU3, 18, halo=False)
# kubus & kuboid juga prisma
Vc, Fcc = cuboid(1, 1, 1); c1 = Solid(Vc, Fcc, Cam(-30, 24), box=(60, 350, 170, 440))
Vk, Fck = cuboid(2.2, 1, 1); c2 = Solid(Vk, Fck, Cam(-30, 24), box=(200, 350, 330, 440))
fig += c1.draw(hl=[2], hlcol=PA, sw=3.5) + c2.draw(hl=[2], hlcol=PA, sw=3.5)
fig += T(420, 380, 'Kubus &amp;', TX, 18) + T(420, 406, 'kuboid juga', TX, 18) + T(420, 432, 'prisma', TX, 18)
add('6.1', 'KONSEP', 'Prisma',
    DEF('<b>Prisma</b> ialah bentuk 3D yang mempunyai dua muka <b>tapak</b> yang <b>sama dan selari</b>, dengan <b>keratan rentas yang seragam</b>.', col)
    + BUL(['Bentuk tapak memberi nama prisma: prisma segi tiga, prisma segi empat, prisma pentagon.',
           'Muka sisi prisma berbentuk <b>segi empat</b>.',
           f'{B("Kubus", PA)} dan {B("kuboid", PA)} ialah prisma dengan tapak segi empat.'], col)
    + NOTE('Potong prisma selari dengan tapaknya: setiap keratan rentas sama bentuk dan saiz.'),
    svg(fig, 'Prisma segi tiga dengan keratan rentas seragam, serta kubus dan kuboid'))

# 6.1-3 Piramid
sq = [(0, 0), (4, 0), (4, 4), (0, 4)]
V, Fc = pyramid(sq, 4.2)
sd = Solid(V, Fc, Cam(-28, 18), box=(40, 70, 260, 330))
assert sd.counts() == (5, 8, 5)
V3, Fc3 = pyramid([(0, 0), (4, 0), (2, 3.4)], 4)
s3 = Solid(V3, Fc3, Cam(-24, 18), box=(290, 110, 470, 330))
assert s3.counts() == (4, 6, 4)
fig = sd.draw(hl=[0], hlcol=PA) + s3.draw(hl=[0], hlcol=PA)
fig += DOT(sd.P[4], VERT, 9) + DOT(s3.P[3], VERT, 9)
fig += T(sd.P[4][0], sd.P[4][1] - 26, 'puncak', VERT, 19) + T(s3.P[3][0], s3.P[3][1] - 26, 'puncak', VERT, 19)
fig += T(150, 372, 'Tapak segi empat', PA, 18) + T(150, 398, '5 muka · 8 tepi · 5 bucu', MU3, 17)
fig += T(380, 372, 'Tapak segi tiga', PA, 18) + T(380, 398, '4 muka · 6 tepi · 4 bucu', MU3, 17)
fig += T(250, 446, 'Muka sisi segi tiga bertemu di puncak', MU, 17, halo=False)
add('6.1', 'KONSEP', 'Piramid',
    DEF('<b>Piramid</b> mempunyai satu <b>tapak</b> berbentuk poligon dan muka sisi <b>segi tiga</b> yang bertemu di satu bucu, iaitu <b>puncak</b>.', col)
    + BUL(['Bentuk tapak memberi nama piramid: piramid tapak segi empat, piramid tapak segi tiga.',
           'Piramid <b>tiada</b> keratan rentas seragam: semakin ke atas, keratan rentas semakin kecil.',
           'Bilangan muka sisi segi tiga = bilangan sisi tapak.'], col),
    svg(fig, 'Piramid tapak segi empat dan piramid tapak segi tiga dengan puncak ditanda'))

# 6.1-4 Silinder, kon, sfera
fig = ''
fig += RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
fig += cylinder((89, 270), 50, 140, 15, top_hl=PA)
fig += ELL((89, 270), 50, 15, 'none', PA, 0)
cs, A = cone((250, 270), 52, 160, 16)
fig += cs + DOT(A, VERT, 8)
fig += sphere((411, 200), 58)
fig += T(89, 50, 'Silinder', TX, 21) + T(250, 50, 'Kon', TX, 21) + T(411, 50, 'Sfera', TX, 21)
for x, ls in ((89, ['2 muka rata', '1 muka', 'melengkung', '2 tepi · 0 bucu']), (250, ['1 muka rata', '1 muka', 'melengkung', '1 tepi · 1 bucu']), (411, ['1 muka', 'melengkung', '', '0 tepi · 0 bucu'])):
    for i, t in enumerate(ls):
        fig += T(x, 330 + i * 27, t, MU3 if i < 3 else AM, 16)
add('6.1', 'KONSEP', 'Bentuk dengan permukaan melengkung',
    BUL([f'{B("Silinder", TX)}: dua tapak <b>bulatan</b> yang sama dan selari, disambung oleh satu muka melengkung. Keratan rentasnya seragam.',
         f'{B("Kon", TX)}: satu tapak bulatan dan satu muka melengkung yang bertemu di <b>puncak</b>.',
         f'{B("Sfera", TX)}: satu muka melengkung; setiap titik pada permukaannya sama jarak dari <b>pusat</b>.'], col)
    + NOTE('Silinder, kon dan sfera <b>bukan</b> prisma atau piramid kerana ada muka melengkung.'),
    svg(fig, 'Silinder, kon dan sfera dengan bilangan muka, tepi dan bucu'))

# 6.1-5 Contoh: prisma pentagon
n = 5
V, Fc = prism(ngon(n, 2, -90 + 18), 3.6)
sd = Solid(V, Fc, Cam(-20, 24), box=(80, 50, 420, 380))
mk, tp, bc = sd.counts()
assert (mk, tp, bc) == (n + 2, 3 * n, 2 * n) == (7, 15, 10)
assert mk + bc - tp == 2          # rumus Euler: semakan
fig = sd.draw(hl=[0, 1], hlcol=PA, verts=True)
fig += T(250, 412, 'Tapak pentagon · 5 muka sisi segi empat', MU3, 18, halo=False)
fig += T(250, 444, 'Bucu: 5 atas + 5 bawah', VERT, 18, halo=False)
add('6.1', 'CONTOH BERLANGKAH', 'Sifat prisma pentagon',
    P('Nyatakan bilangan muka, tepi dan bucu bagi sebuah prisma pentagon.', True)
    + STEPS([f'{B("Muka", FACE)}: 2 tapak pentagon + 5 muka sisi = <b>7</b>',
             f'{B("Tepi", EDGE)}: 5 (tapak atas) + 5 (tapak bawah) + 5 (tegak) = <b>15</b>',
             f'{B("Bucu", VERT)}: 5 (atas) + 5 (bawah) = <b>10</b>'], col)
    + ANS('7 muka, 15 tepi, 10 bucu')
    + NOTE('muka + bucu − tepi = 7 + 10 − 15 = 2 bagi setiap prisma dan piramid.', 'Semak:'),
    svg(fig, 'Prisma pentagon dengan semua bucu ditanda'))

# 6.1-6 Kesilapan biasa
fig = ''
CASES = [(44, 'Kubus ada 8 tepi', False), (108, 'Kubus ada 12 tepi', True),
         (196, 'Silinder ialah prisma', False), (260, 'Silinder ada muka melengkung', True),
         (348, 'Kon ialah piramid', False), (412, 'Kon ada 1 tapak bulatan', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(52, y) if ok else CROSS(52, y)) + T(84, y, t, GR if ok else RD, 19, 'start')
add('6.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lupa yang tersembunyi", RD)}: kira juga muka, tepi dan bucu di belakang (garis putus-putus).',
         f'{B("Keliru prisma dengan piramid", RD)}: prisma ada 2 tapak selari; piramid ada 1 tapak dan puncak.',
         f'{B("Anggap silinder dan kon tiada muka", RD)}: muka boleh <b>rata</b> atau <b>melengkung</b>.'], col),
    svg(fig, 'Kenyataan salah dan betul tentang sifat bentuk 3D'))

# 6.1-7 Ringkasan
ROWS = [('Kubus', cuboid(1, 1, 1)), ('Kuboid', cuboid(2, 1, 1)), ('Prisma segi tiga', prism_x(tri, 5)),
        ('Piramid tapak segi empat', pyramid(sq, 4)), ('Piramid tapak segi tiga', pyramid([(0, 0), (4, 0), (2, 3.4)], 4))]
rows = []
for nm, (V, Fc) in ROWS:
    m_, t_, b_ = Solid(V, Fc, box=(0, 0, 10, 10)).counts()
    assert m_ + b_ - t_ == 2
    rows.append([nm, str(m_), str(t_), str(b_)])
assert [r[1:] for r in rows] == [['6', '12', '8'], ['6', '12', '8'], ['5', '9', '6'], ['5', '8', '5'], ['4', '6', '4']]
rows += [['Silinder', '3 (2 rata)', '2', '0'], ['Kon', '2 (1 rata)', '1', '1'], ['Sfera', '1', '0', '0']]
fig = ''
GAL = [('Kubus', cuboid(1, 1, 1)), ('Kuboid', cuboid(2, 1, 1)), ('Prisma', prism_x(tri, 4)),
       ('Piramid', pyramid(sq, 4)), ('Piramid', pyramid([(0, 0), (4, 0), (2, 3.4)], 4))]
for i, (nm, (V, Fc)) in enumerate(GAL + [('Silinder', (None, None)), ('Kon', (None, None)), ('Sfera', (None, None))]):
    cx_, cy_ = 14 + (i % 3) * 159, 14 + (i // 3) * 150
    fig += RECT(cx_, cy_, 148, 140, SURF, BD, 14, 2)
    if V is not None:
        fig += Solid(V, Fc, Cam(-24, 18) if i == 4 else Cam(-30, 22), box=(cx_ + 24, cy_ + 14, cx_ + 124, cy_ + 100)).draw(sw=3)
    elif nm == 'Silinder': fig += cylinder((cx_ + 74, cy_ + 92), 34, 66, 11, sw=3)
    elif nm == 'Kon': fig += cone((cx_ + 74, cy_ + 92), 36, 80, 11, sw=3)[0]
    else: fig += sphere((cx_ + 74, cy_ + 58), 42, sw=3)
    fig += T(cx_ + 74, cy_ + 122, nm, TX, 17)
add('6.1', 'RINGKASAN', 'Sifat bentuk 3D',
    TABLE(['Bentuk', 'Muka', 'Tepi', 'Bucu'], rows, col, fs=17)
    + NOTE('Prisma <i>n</i> sisi: <i>n</i> + 2 muka, 3<i>n</i> tepi, 2<i>n</i> bucu.', 'Corak:'),
    svg(fig, 'Galeri bentuk 3D: kubus, kuboid, prisma, piramid, silinder, kon dan sfera'))

# ===================== 6.2 BENTANGAN =====================
col = SUB['6.2'][1]

# --- semakan bentangan kubus: golek kubus atas petak ---
def cube_net_ok(cells):
    cells = set(cells); start = min(cells)
    # orientasi: muka di bawah, atas, U, S, T, B (label 0-5)
    seen = {start: (0, 1, 2, 3, 4, 5)}   # (bawah, atas, utara, selatan, timur, barat)
    st = [start]
    while st:
        c = st.pop(); b, a, u, s, t, w = seen[c]
        for d, (dx, dy) in (('T', (1, 0)), ('B', (-1, 0)), ('S', (0, 1)), ('U', (0, -1))):
            nb = (c[0] + dx, c[1] + dy)
            if nb in cells and nb not in seen:
                if d == 'T': o = (t, w, u, s, a, b)
                elif d == 'B': o = (w, t, u, s, b, a)
                elif d == 'S': o = (s, u, b, a, t, w)
                else: o = (u, s, a, b, t, w)
                seen[nb] = o; st.append(nb)
    return len(cells) == 6 and len(seen) == 6 and len({o[0] for o in seen.values()}) == 6

def NET(cells, x0, y0, k, col_=PU, fill=None, sw=3, base=None):
    s = ''
    for (cx, cy) in cells:
        f = fill or f'{col_}33'
        if base and (cx, cy) == base: f = f'{PA}66'
        s += f'<rect x="{r1(x0 + cx * k)}" y="{r1(y0 + cy * k)}" width="{k}" height="{k}" fill="{f}" stroke="{col_}" stroke-width="{sw}" stroke-linejoin="round"/>'
    return s

# 6.2-1 Definisi
CROSSNET = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
assert cube_net_ok(CROSSNET)
V, Fc = cuboid(1, 1, 1); cb = Solid(V, Fc, Cam(-30, 24), box=(30, 150, 160, 290))
fig = cb.draw(fill=PU, edge=PU)
fig += T(95, 120, 'Kubus', TX, 20)
fig += PATH('M170 220 C 190 200, 210 200, 228 220', 'none', MU3, 3) + PATH('M220 210 L230 222 L216 226', 'none', MU3, 3)
fig += T(200, 186, 'buka', MU3, 17)
k = 56; x0, y0 = 252, 148
fig += NET(CROSSNET, x0, y0, k, PU, base=(1, 1))
fig += T(x0 + 1.5 * k, y0 + 1.5 * k, 'tapak', TX, 16)
fig += T(250, 68, 'Bentangan kubus = 6 segi empat sama', MU3, 19, halo=False)
fig += T(250, 380, 'Garis lipatan → tepi kubus', PU, 18, halo=False)
fig += T(250, 412, 'Setiap segi empat → satu muka', PU, 18, halo=False)
add('6.2', 'DEFINISI', 'Apa itu bentangan?',
    DEF('<b>Bentangan</b> ialah bentuk <b>dua dimensi (2D)</b> yang terhasil apabila permukaan sesuatu bentuk 3D dibuka dan diratakan.', col)
    + BUL(['Setiap <b>muka</b> bentuk 3D menjadi satu bentuk 2D dalam bentangan.',
           'Bentangan boleh <b>dilipat semula</b> untuk membentuk pepejal itu.',
           'Satu bentuk 3D boleh mempunyai <b>lebih daripada satu</b> bentangan.'], col)
    + NOTE('Sfera <b>tiada</b> bentangan kerana permukaannya tidak boleh diratakan tanpa dikoyak.'),
    svg(fig, 'Kubus dibuka menjadi bentangan enam segi empat sama'))

# 6.2-2 Bentangan prisma & piramid (rajah grid 2x2)
fig = RECT(14, 14, 230, 216) + RECT(256, 14, 230, 216) + RECT(14, 242, 230, 214) + RECT(256, 242, 230, 214)
def LAB2(x, y, a, b):
    return T(x, y, a, TX, 17) + T(x, y + 22, b, MU3, 15)
NF, BF = f'{PU}33', f'{PA}66'
# kuboid (p = 3, l = 2, t = 1.4 unit): jalur muka sisi + atas & tapak
u = 20; px, lx, tx_ = 3 * u, 2 * u, 1.4 * u
ox, oy = 129 - (2 * px + 2 * lx) / 2, 32
xs = [ox, ox + lx, ox + lx + px, ox + 2 * lx + px]
for x, w in zip(xs, [lx, px, lx, px]): fig += RECT(x, oy + lx, w, tx_, NF, PU, 0, 2.5)
fig += RECT(xs[1], oy, px, lx, NF, PU, 0, 2.5) + RECT(xs[1], oy + lx + tx_, px, lx, BF, PU, 0, 2.5)
fig += LAB2(129, 182, 'Kuboid', '6 segi empat tepat')
# prisma segi tiga: 3 segi empat + 2 segi tiga
bw, bh = 46, 46; bx, by = 371 - 1.5 * bw, 74
for i in range(3): fig += RECT(bx + i * bw, by, bw, bh, NF, PU, 0, 2.5)
fig += POLY([(bx + bw, by), (bx + 2 * bw, by), (bx + 1.5 * bw, by - 40)], BF, PU, 2.5)
fig += POLY([(bx + bw, by + bh), (bx + 2 * bw, by + bh), (bx + 1.5 * bw, by + bh + 40)], BF, PU, 2.5)
fig += LAB2(371, 182, 'Prisma segi tiga', '3 segi empat + 2 segi tiga')
# piramid tapak segi empat: segi empat + 4 segi tiga
cx, cy, a = 129, 322, 46; hh = 40
fig += RECT(cx - a / 2, cy - a / 2, a, a, BF, PU, 0, 2.5)
for (p, q, apx) in [((cx - a / 2, cy - a / 2), (cx + a / 2, cy - a / 2), (cx, cy - a / 2 - hh)), ((cx - a / 2, cy + a / 2), (cx + a / 2, cy + a / 2), (cx, cy + a / 2 + hh)),
                    ((cx - a / 2, cy - a / 2), (cx - a / 2, cy + a / 2), (cx - a / 2 - hh, cy)), ((cx + a / 2, cy - a / 2), (cx + a / 2, cy + a / 2), (cx + a / 2 + hh, cy))]:
    fig += POLY([p, q, apx], NF, PU, 2.5)
fig += LAB2(129, 410, 'Piramid tapak segi empat', '1 segi empat + 4 segi tiga')
# piramid tapak segi tiga: 4 segi tiga
big = [(311, 384), (431, 384), (371, 280)]
mids = [((big[i][0] + big[(i + 1) % 3][0]) / 2, (big[i][1] + big[(i + 1) % 3][1]) / 2) for i in range(3)]
fig += POLY(big, NF, PU, 2.5) + POLY(mids, BF, PU, 2.5)
fig += LAB2(371, 410, 'Piramid tapak segi tiga', '4 segi tiga')
add('6.2', 'KONSEP', 'Bentangan prisma dan piramid',
    TABLE(['Bentuk 3D', 'Bentangan terdiri daripada'],
          [['Kubus', '6 segi empat sama'], ['Kuboid', '6 segi empat tepat (3 pasang)'],
           ['Prisma segi tiga', '2 segi tiga + 3 segi empat'], ['Piramid tapak segi empat', '1 segi empat + 4 segi tiga'],
           ['Piramid tapak segi tiga', '4 segi tiga']], col, rv=True, fs=18)
    + NOTE('Muka berwarna oren ialah <b>tapak</b>.', 'Rajah:'),
    svg(fig, 'Bentangan kuboid, prisma segi tiga, piramid tapak segi empat dan piramid tapak segi tiga'))

# 6.2-3 Bentangan silinder & kon
j7 = 7; lil = 2 * PI * j7; assert lil == 44
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
# silinder: skala sebenar, lebar segi empat = 2πr (r = 24 px)
rc = 24; wc = 2 * math.pi * rc; hc = 170; yc = 100
fig += CIRC((129, yc - rc), rc, f'{PA}66', PU, 3) + RECT(129 - wc / 2, yc, wc, hc, f'{PU}33', PU, 0, 3) + CIRC((129, yc + hc + rc), rc, f'{PA}66', PU, 3)
fig += LINE((129, yc - rc), (129 + rc, yc - rc), TX, 2) + DOT((129, yc - rc), TX, 3) + T(129 + rc + 8, yc - rc - 12, 'j', TX, 18, 'start', italic=True)
fig += T(129, yc + hc / 2 - 14, 'panjang =', AM, 16) + T(129, yc + hc / 2 + 12, 'lilitan 2πj', AM, 17)
fig += T(129 + wc / 2 - 12, yc + hc / 2, 't', MU3, 18, italic=True, anchor='end')
fig += T(129, 412, 'Silinder:', TX, 17) + T(129, 436, '2 bulatan + 1 segi empat', TX, 15)
# kon: panjang lengkok sektor = lilitan tapak (R = 130, r = 34)
R, rk = 130, 34; th = 360 * rk / R; assert abs(2 * math.pi * R * th / 360 - 2 * math.pi * rk) < 1e-9
sc_c = (371, 44); ang0, ang1 = 90 - th / 2, 90 + th / 2
pa_ = (sc_c[0] + R * math.cos(math.radians(ang0)), sc_c[1] + R * math.sin(math.radians(ang0)))
pb_ = (sc_c[0] + R * math.cos(math.radians(ang1)), sc_c[1] + R * math.sin(math.radians(ang1)))
fig += f'<path d="M{sc_c[0]} {sc_c[1]} L{r1(pa_[0])} {r1(pa_[1])} A{R} {R} 0 0 1 {r1(pb_[0])} {r1(pb_[1])} Z" fill="{PU}33" stroke="{PU}" stroke-width="3" stroke-linejoin="round"/>'
fig += CIRC((371, sc_c[1] + R + rk), rk, f'{PA}66', PU, 3)
fig += T((sc_c[0] + pa_[0]) / 2 + 14, (sc_c[1] + pa_[1]) / 2 - 4, 's', AM, 19, 'start', italic=True)
fig += T(371, 130, 'sektor', TX, 15)
fig += T(371, 300, 'panjang lengkok', MU3, 15) + T(371, 322, '= lilitan tapak', MU3, 15)
fig += T(371, 412, 'Kon:', TX, 17) + T(371, 436, '1 bulatan + 1 sektor', TX, 15)
add('6.2', 'KONSEP', 'Bentangan silinder dan kon',
    BUL([f'{B("Silinder", TX)}: 2 bulatan + 1 segi empat tepat. Panjang segi empat tepat = <b>lilitan bulatan</b> = 2π{J}; lebarnya = tinggi {Tt}.',
         f'{B("Kon", TX)}: 1 bulatan + 1 <b>sektor</b> bulatan. Jejari sektor = tinggi sendeng {S_} kon.'], col)
    + P(f'Silinder dengan {J} = 7 cm dan {Tt} = 10 cm. Berapakah panjang segi empat tepat dalam bentangannya? (π = {PI7})', True)
    + STEPS([f'Panjang = 2π{J} = 2 × {PI7} × 7 = 44 cm'], col)
    + ANS('Segi empat tepat 44 cm × 10 cm'),
    svg(fig, 'Bentangan silinder dan bentangan kon'))

# 6.2-4 Contoh: lukis bentangan kuboid
pK, lK, tK = 4, 3, 2
u = 36
gx, gy = 250 - (2 * tK + pK) * u / 2, 30
fig = ''
# grid petak 1 cm sejajar dengan bentangan
x = gx - math.floor((gx - 14) / u) * u
while x <= 486: fig += LINE((x, 14), (x, 456), GRID, 1.5, cap='butt'); x += u
y = gy - math.floor((gy - 14) / u) * u
while y <= 456: fig += LINE((14, y), (486, y), GRID, 1.5, cap='butt'); y += u
pieces = [  # (x sel, y sel, lebar, tinggi, label)
    (tK, 0, pK, lK, 'atas'), (tK, lK, pK, tK, 'depan'), (tK, lK + tK, pK, lK, 'bawah'), (tK, 2 * lK + tK, pK, tK, 'belakang'),
    (0, lK, tK, lK * 0 + tK, ''), (tK + pK, lK, tK, tK, '')]
# sisi kiri/kanan bersaiz l × t, lekat pada muka atas
pieces[4] = (0, 0, tK, lK, 'sisi'); pieces[5] = (tK + pK, 0, tK, lK, 'sisi')
area = 0
for (cx, cy, w, h, lb) in pieces:
    fig += RECT(gx + cx * u, gy + cy * u, w * u, h * u, f'{PU}33' if lb != 'bawah' else f'{PA}55', PU, 0, 3)
    fig += T(gx + (cx + w / 2) * u, gy + (cy + h / 2) * u, lb, TX, 15)
    area += w * h
assert area == 2 * (pK * lK + pK * tK + lK * tK) == 52
fig += T(gx + (tK + pK / 2) * u, gy + (2 * lK + 2 * tK) * u + 20, '4 cm', AM, 17)
fig += T(gx + (tK + pK) * u + 8, gy + (lK + tK / 2) * u, '2 cm', AM, 17, 'start')
fig += T(gx + (tK + pK) * u + 8, gy + (lK + tK + lK / 2) * u, '3 cm', AM, 17, 'start')
fig += T(250, 446, '1 petak = 1 cm', MU, 16, halo=False)
add('6.2', 'CONTOH BERLANGKAH', 'Lukis bentangan kuboid',
    P('Lukis bentangan bagi kuboid berukuran 4 cm × 3 cm × 2 cm pada kertas grid.', True)
    + STEPS(['Lukis tapak 4 cm × 3 cm.',
             'Lukis muka depan dan belakang 4 cm × 2 cm pada tepi tapak.',
             'Lukis muka atas 4 cm × 3 cm, kemudian dua muka sisi 3 cm × 2 cm.',
             'Semak: 6 muka, setiap pasang muka bertentangan sama saiz.'], col)
    + NOTE('Tepi yang akan bercantum apabila dilipat mesti <b>sama panjang</b>.'),
    svg(fig, 'Bentangan kuboid 4 cm × 3 cm × 2 cm pada kertas grid'))

# 6.2-5 Boleh / tidak membentuk kubus
NETS = [([(0, 0), (0, 1), (1, 1), (2, 1), (3, 1), (3, 2)], True),   # "Z" panjang
        ([(0, 0), (1, 0), (1, 1), (2, 1), (2, 2), (3, 2)], True),   # tangga
        ([(0, 0), (1, 0), (2, 0), (3, 0), (4, 0), (2, 1)], False),  # 5 sebaris
        ([(0, 0), (1, 0), (0, 1), (1, 1), (2, 1), (3, 1)], False)]  # blok 2x2
for cells, ok in NETS: assert cube_net_ok(cells) == ok, cells
assert cube_net_ok([(0, 1), (1, 1), (2, 1), (3, 1), (1, 0), (2, 2)])
fig = ''
k = 34
for i, (cells, ok) in enumerate(NETS):
    bx_, by_ = 14 + (i % 2) * 242, 14 + (i // 2) * 228
    fig += RECT(bx_, by_, 230, 216, SURF, GR if ok else RD, 16, 2.5)
    wc = max(c[0] for c in cells) + 1; hc = max(c[1] for c in cells) + 1
    fig += NET(cells, bx_ + 115 - wc * k / 2, by_ + 92 - hc * k / 2, k, GR if ok else RD, sw=2.5)
    fig += (TICK(bx_ + 70, by_ + 182) if ok else CROSS(bx_ + 70, by_ + 182))
    fig += T(bx_ + 90, by_ + 182, 'Boleh' if ok else 'Tidak boleh', GR if ok else RD, 19, 'start')
add('6.2', 'KONSEP', 'Bentangan yang boleh membentuk kubus',
    P('Bayangkan setiap petak dilipat. Bentangan <b>boleh</b> membentuk kubus jika 6 petak menjadi 6 muka yang <b>tidak bertindih</b>.', True)
    + BUL(['Ada <b>11</b> bentangan berlainan bagi kubus.',
           f'Contoh {B("tidak boleh", RD)}: 5 petak sebaris, atau ada blok 2 × 2 petak (muka bertindih).',
           'Uji dengan memilih satu tapak, kemudian lipat petak lain ke atas.'], col)
    + NOTE('Gunting kertas grid dan lipat sendiri untuk menyemak.', 'Cuba:'),
    svg(fig, 'Empat bentangan enam petak: dua boleh dan dua tidak boleh membentuk kubus'))

# 6.2-6 Kesilapan biasa + ringkasan
fig = ''
# silinder: panjang = diameter (salah) vs lilitan (betul)
fig += RECT(14, 14, 472, 210, SURF, RD, 16, 2) + RECT(14, 240, 472, 216, SURF, GR, 16, 2)
fig += CIRC((80, 120), 34, f'{PA}55', PU, 3) + RECT(130, 86, 68, 68, f'{PU}33', PU, 0, 3)
fig += T(164, 170, '14 cm', RD, 16) + CROSS(240, 120) + T(266, 106, 'Panjang = diameter', RD, 18, 'start') + T(266, 136, '= 14 cm', RD, 18, 'start')
fig += CIRC((76, 348), 34, f'{PA}55', PU, 3) + RECT(114, 314, 68 * math.pi, 68, f'{PU}33', PU, 0, 3)
fig += T(114 + 34 * math.pi, 398, '44 cm', GR, 16) + TICK(358, 334) + T(376, 334, 'Panjang', GR, 18, 'start') + T(376, 362, '= lilitan', GR, 18, 'start')
fig += T(250, 42, 'Silinder j = 7 cm', MU3, 17, halo=False) + T(250, 268, 'Silinder j = 7 cm', MU3, 17, halo=False)
add('6.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Muka bertindih", RD)} apabila dilipat: bentangan itu tidak membentuk pepejal.',
         f'{B("Panjang segi empat silinder = diameter", RD)} ✗ → panjangnya = lilitan 2π{J}.',
         f'{B("Bentangan kon guna segi tiga", RD)} ✗ → muka melengkung kon menjadi <b>sektor</b>.',
         f'{B("Kurang muka", RD)}: kira semula, contohnya kubus mesti ada 6 petak.'], col)
    + NOTE('Bentangan = semua muka bentuk 3D yang diratakan, dengan tepi bercantum sama panjang.', 'Ringkasan:'),
    svg(fig, 'Bentangan silinder salah dan betul: panjang segi empat tepat ialah lilitan'))

# ===================== 6.3 LUAS PERMUKAAN =====================
col = SUB['6.3'][1]

# 6.3-1 Definisi + rumus
fig = ''
V, Fc = cuboid(3, 2, 1.6); cb = Solid(V, Fc, Cam(-30, 24), box=(40, 40, 210, 170))
fig += cb.draw(fill=PA, edge=PA)
fig += PATH('M230 105 L 270 105', 'none', MU3, 3) + PATH('M262 97 L272 105 L262 113', 'none', MU3, 3)
u = 24; gx, gy = 290, 40; pp_, ll_, tt_ = 3, 2, 1.6
# bentangan kecil kuboid
cols_ = [(0, ll_), (ll_, pp_), (ll_ + pp_, ll_), (2 * ll_ + pp_, pp_)]
for x, w in cols_: fig += RECT(gx + x * u * 0.55, gy + ll_ * u * 0.55, w * u * 0.55, tt_ * u * 0.55, f'{PA}33', PA, 0, 2)
fig += RECT(gx + ll_ * u * 0.55, gy, pp_ * u * 0.55, ll_ * u * 0.55, f'{PA}33', PA, 0, 2) + RECT(gx + ll_ * u * 0.55, gy + (ll_ + tt_) * u * 0.55, pp_ * u * 0.55, ll_ * u * 0.55, f'{PA}33', PA, 0, 2)
fig += T(250, 210, 'Luas permukaan = jumlah luas bentangan', MU3, 18, halo=False)
fig += RECT(30, 238, 440, 208, SURF, BD, 16, 2)
FORM = [('Kubus', '6<tspan font-style="italic">s</tspan>²'), ('Kuboid', '2(pl + pt + lt)'), ('Silinder', '2πj² + 2πjt'),
        ('Kon', 'πj² + πjs'), ('Sfera', '4πj²')]
for i, (a, b) in enumerate(FORM):
    fig += T(56, 266 + i * 38, a, PA, 19, 'start') + T(444, 266 + i * 38, b, TX, 19, 'end')
add('6.3', 'DEFINISI', 'Apa itu luas permukaan?',
    DEF('<b>Luas permukaan</b> bentuk 3D ialah <b>jumlah luas semua muka</b>, iaitu jumlah luas bentangannya.', col)
    + BUL(['Lukis atau bayangkan bentangan, kira luas setiap muka, kemudian tambah.',
           'Unit luas: <b>cm²</b> atau <b>m²</b>.',
           f'Prisma dan piramid: tambah luas tapak dan semua muka sisi.'], col)
    + NOTE(f'<i>j</i> = jejari, <i>t</i> = tinggi, <i>s</i> = tinggi sendeng kon. Guna π = {PI7} atau 3.142.', 'Simbol:'),
    svg(fig, 'Kuboid dan bentangannya, serta rumus luas permukaan'))

# 6.3-2 Kuboid & kubus
pK, lK, tK = 6, 4, 3
LP = 2 * (pK * lK + pK * tK + lK * tK); assert LP == 108
sK = 5; assert 6 * sK ** 2 == 150
V, Fc = cuboid(pK, lK, tK); cb = Solid(V, Fc, Cam(-30, 22), box=(60, 50, 440, 330))
fig = cb.draw(fill=PA, edge=PA)
fig += cb.lab(3, 2, '6 cm', AM, 20) + cb.lab(2, 1, '4 cm', AM, 20) + cb.lab(3, 7, '3 cm', AM, 20, 34)
fig += RECT(40, 370, 420, 80, SURF, BD, 14, 2)
fig += T(250, 396, '2(6×4) + 2(6×3) + 2(4×3)', TX, 19) + T(250, 428, '= 48 + 36 + 24 = 108 cm²', PA, 20)
assert 2 * 6 * 4 + 2 * 6 * 3 + 2 * 4 * 3 == 108
add('6.3', 'CONTOH BERLANGKAH', 'Luas permukaan kuboid',
    P('Cari luas permukaan kuboid berukuran 6 cm × 4 cm × 3 cm.', True)
    + STEPS(['Kuboid ada 3 pasang muka yang sama.',
             'Luas = 2(6 × 4) + 2(6 × 3) + 2(4 × 3)',
             '= 48 + 36 + 24'], col)
    + ANS('108 cm²')
    + NOTE('Kubus bersisi 5 cm: luas permukaan = 6 × 5² = 6 × 25 = 150 cm².', 'Kubus:'),
    svg(fig, 'Kuboid 6 cm × 4 cm × 3 cm'))

# 6.3-3 Prisma segi tiga
a3, b3, c3, Lp = 3, 4, 5, 10
assert a3 ** 2 + b3 ** 2 == c3 ** 2
Ltri = F(1, 2) * a3 * b3; Lsisi = (a3 + b3 + c3) * Lp
LPp = 2 * Ltri + Lsisi; assert (Ltri, Lsisi, LPp) == (6, 120, 132)
V, Fc = prism_x([(0, 0), (0, 4), (3, 0)], 10)
sd = Solid(V, Fc, Cam(-58, 20), box=(50, 50, 410, 320))
fig = sd.draw(fill=PA, edge=PA, hl=[0, 1], hlcol=AM)
assert math.dist(V[3], V[4]) == 4 and math.dist(V[3], V[5]) == 3 and math.dist(V[4], V[5]) == 5 and math.dist(V[1], V[4]) == 10
fig += sd.lab(1, 4, '10 cm', AM, 20) + sd.lab(4, 5, '5 cm', TX, 19)
fig += sd.lab(3, 4, '4 cm', TX, 19, 26) + sd.lab(3, 5, '3 cm', TX, 19, 30)
fig += RECT(30, 352, 440, 114, SURF, BD, 14, 2)
fig += SMIX(250, 376, ['2 segi tiga: 2 × ', ('f', '1', '2'), ' × 3 × 4 = 12'], AM, 18, halo=NAV) + T(250, 413, '3 segi empat: (3 + 4 + 5) × 10 = 120', PA, 18)
fig += T(250, 446, 'Jumlah = 132 cm²', TX, 20)
add('6.3', 'CONTOH BERLANGKAH', 'Luas permukaan prisma',
    P('Sebuah prisma segi tiga bersudut tegak mempunyai sisi 3 cm, 4 cm dan 5 cm, dan panjang 10 cm. Cari luas permukaannya.', True)
    + STEPS([f'Luas 2 segi tiga = 2 × {FR(1, 2)} × 3 × 4 = 12 cm²',
             'Luas 3 segi empat tepat = 3 × 10 + 4 × 10 + 5 × 10 = 120 cm²',
             'Luas permukaan = 12 + 120'], col)
    + ANS('132 cm²'),
    svg(fig, 'Prisma segi tiga bersisi 3 cm, 4 cm, 5 cm dan panjang 10 cm'))

# 6.3-4 Piramid
aP, hS = 6, 5
hT = math.sqrt(hS ** 2 - (aP / 2) ** 2); assert hT == 4
LPy = aP * aP + 4 * F(1, 2) * aP * hS; assert LPy == 96
V, Fc = pyramid([(0, 0), (6, 0), (6, 6), (0, 6)], 4)
sd = Solid(V, Fc, Cam(-25, 16), box=(70, 40, 430, 320))
fig = sd.draw(fill=PA, edge=PA, hl=[0], hlcol=AM)
front = [(i, (i + 1) % 4) for i in range(4) if sd.vis[i + 1]]     # tepi tapak dengan muka sisi kelihatan
front.sort(key=lambda e: -math.dist(sd.P[e[0]], sd.P[e[1]]))
(e1, e2) = front[0], front[1]
fig += sd.lab(e1[0], e1[1], '6 cm', AM, 20) + sd.lab(e2[0], e2[1], '6 cm', AM, 20)
mid = ((sd.P[e1[0]][0] + sd.P[e1[1]][0]) / 2, (sd.P[e1[0]][1] + sd.P[e1[1]][1]) / 2)
fig += LINE(sd.P[4], mid, PK, 3.5, '8 6') + T((sd.P[4][0] + mid[0]) / 2 - 14, (sd.P[4][1] + mid[1]) / 2, '5 cm', PK, 19, 'end')
fig += RECT(30, 352, 440, 114, SURF, BD, 14, 2)
fig += T(250, 374, 'Tapak: 6 × 6 = 36', AM, 18) + SMIX(250, 406, ['4 segi tiga: 4 × ', ('f', '1', '2'), ' × 6 × 5 = 60'], PA, 18, halo=NAV)
fig += T(250, 446, 'Jumlah = 96 cm²', TX, 20)
add('6.3', 'CONTOH BERLANGKAH', 'Luas permukaan piramid',
    P('Piramid tegak bertapak segi empat sama bersisi 6 cm. Tinggi sendeng setiap muka segi tiga ialah 5 cm. Cari luas permukaannya.', True)
    + STEPS(['Luas tapak = 6 × 6 = 36 cm²',
             f'Luas 4 segi tiga = 4 × {FR(1, 2)} × 6 × 5 = 60 cm²',
             'Luas permukaan = 36 + 60'], col)
    + ANS('96 cm²')
    + NOTE(f'Guna tinggi {B("sendeng", PK)} muka segi tiga (5 cm), bukan tinggi tegak piramid (4 cm).'),
    svg(fig, 'Piramid tapak segi empat sama 6 cm dengan tinggi sendeng 5 cm'))

# 6.3-5 Silinder, kon, sfera (π = 22/7)
jc, tc = 7, 10
Lcyl = 2 * PI * jc ** 2 + 2 * PI * jc * tc; assert (2 * PI * jc ** 2, 2 * PI * jc * tc, Lcyl) == (308, 440, 748)
jk, tk = 7, 24; sk = math.isqrt(jk ** 2 + tk ** 2); assert sk ** 2 == jk ** 2 + tk ** 2 and sk == 25
Lcon = PI * jk ** 2 + PI * jk * sk; assert (PI * jk ** 2, PI * jk * sk, Lcon) == (154, 550, 704)
js = 7; Lsf = 4 * PI * js ** 2; assert Lsf == 616
fig = RECT(14, 14, 150, 442) + RECT(175, 14, 150, 442) + RECT(336, 14, 150, 442)
fig += cylinder((89, 230), 46, 120, 14, col=PA, edge=PA)
fig += LINE((89, 110), (135, 110), TX, 2.5) + T(141, 110, '7', TX, 17, 'start') + T(150, 170, '10', TX, 17, 'start')
cs, A = cone((250, 240), 48, 150, 15, col=PA, edge=PA)
fig += cs + LINE((250, 240), (298, 240), TX, 2.5) + T(274, 266, '7', TX, 17) + LINE(A, (250, 240), MU3, 2, '5 5') + T(258, 175, '24', MU3, 16, 'start')
fig += T(285, 150, '25', PK, 17, 'start')
fig += sphere((411, 190), 56, col=PA, edge=PA) + LINE((411, 190), (467, 190), TX, 2.5) + DOT((411, 190), TX, 3) + T(439, 160, '7', TX, 17)
fig += T(89, 46, 'Silinder', TX, 20) + T(250, 46, 'Kon', TX, 20) + T(411, 46, 'Sfera', TX, 20)
fig += T(89, 300, '308 + 440', MU3, 17) + T(250, 300, '154 + 550', MU3, 17) + T(411, 300, '4 × 154', MU3, 17)
fig += T(89, 340, '748 cm²', PA, 21) + T(250, 340, '704 cm²', PA, 21) + T(411, 340, '616 cm²', PA, 21)
fig += T(89, 400, 'ukuran dalam cm', MU, 14, halo=False) + T(250, 400, 'ukuran dalam cm', MU, 14, halo=False) + T(411, 400, 'ukuran dalam cm', MU, 14, halo=False)
add('6.3', 'CONTOH BERLANGKAH', 'Silinder, kon dan sfera',
    P(f'Cari luas permukaan setiap pepejal. (π = {PI7})', True)
    + STEPS([f'Silinder {J} = 7, {Tt} = 10: 2π{J}² + 2π{J}{Tt} = 308 + 440 = <b>748 cm²</b>',
             f'Kon {J} = 7, {S_} = 25: π{J}² + π{J}{S_} = 154 + 550 = <b>704 cm²</b>',
             f'Sfera {J} = 7: 4π{J}² = 4 × 154 = <b>616 cm²</b>'], col)
    + NOTE(f'Tinggi sendeng kon dicari dengan teorem Pythagoras: {S_}² = {J}² + {Tt}² = 49 + 576 = 625, maka {S_} = 25.'),
    svg(fig, 'Silinder, kon dan sfera berjejari 7 cm dengan luas permukaan masing-masing'))

# 6.3-6 Cari dimensi tidak diketahui
LPc = 880; jx = 7
tx = (F(LPc) - 2 * PI * jx ** 2) / (2 * PI * jx); assert tx == 13
assert 2 * PI * 7 * 7 + 2 * PI * 7 * 13 == 880
assert 6 * 4 ** 2 == 96
fig = cylinder((250, 330), 110, 220, 34, col=PA, edge=PA)
fig += LINE((250, 110), (360, 110), TX, 3) + DOT((250, 110), TX, 4) + T(305, 94, '7 cm', TX, 19)
fig += LINE((388, 110), (388, 330), MU3, 2.5, '6 5') + T(400, 220, 't = ?', AM, 22, 'start')
fig += T(250, 410, 'Luas permukaan = 880 cm²', PA, 20) + SMIX(250, 440, ['π = ', ('f', '22', '7')], MU, 16)
add('6.3', 'CONTOH BERLANGKAH', 'Cari dimensi yang tidak diketahui',
    P(f'Luas permukaan sebuah silinder tertutup ialah 880 cm² dan jejarinya 7 cm. Cari tinggi silinder itu. (π = {PI7})', True)
    + STEPS([f'2π{J}² + 2π{J}{Tt} = 880',
             f'308 + 44{Tt} = 880',
             f'44{Tt} = 572 &nbsp;→&nbsp; {Tt} = 572 ÷ 44'], col)
    + ANS('Tinggi = 13 cm')
    + NOTE('Kubus berluas permukaan 96 cm²: 6<i>s</i>² = 96 → <i>s</i>² = 16 → <i>s</i> = 4 cm.', 'Contoh lain:'),
    svg(fig, 'Silinder berjejari 7 cm dengan tinggi tidak diketahui'))
assert F(572, 44) == 13 and 880 - 308 == 572 and 2 * PI * 7 == 44

# 6.3-7 Kesilapan biasa + ringkasan
fig = ''
CASES = [(44, 'Kon: πj² + πjt (tinggi tegak)', False), (108, 'Kon: πj² + πjs (tinggi sendeng)', True),
         (196, 'Tin tanpa penutup: 2πj² + 2πjt', False), (260, 'Tin tanpa penutup: πj² + 2πjt', True),
         (348, 'Luas permukaan = 108 cm³', False), (412, 'Luas permukaan = 108 cm²', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(52, y) if ok else CROSS(52, y)) + (T(84, y, t, GR if ok else RD, 18, 'start') if isinstance(t, str) else SMIX(84, y, t, GR if ok else RD, 18, 'start'))
add('6.3', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Tinggi tegak vs tinggi sendeng", RD)}: piramid dan kon guna tinggi <b>sendeng</b>.',
         f'{B("Kira muka yang tiada", RD)}: baca soalan, contohnya tin tanpa penutup atau kotak terbuka.',
         f'{B("Diameter sebagai jejari", RD)}: bahagi diameter dengan 2 dahulu.',
         f'{B("Unit salah", RD)}: luas dalam unit <b>persegi</b> (cm², m²).'], col)
    + NOTE('Luas permukaan = jumlah luas semua muka. Lukis bentangan jika keliru.', 'Ringkasan:'),
    svg(fig, 'Kenyataan salah dan betul tentang luas permukaan'))

# ===================== 6.4 ISI PADU =====================
col = SUB['6.4'][1]

# 6.4-1 Definisi: prisma
V, Fc = prism_x([(0, 0), (3, 0), (4.5, 2.5), (3, 5), (0, 5)], 7)
sd = Solid(V, Fc, Cam(-40, 20), box=(40, 60, 460, 330))
endf = 0 if sd.vis[0] else 1      # muka hujung yang kelihatan
fig = sd.draw(fill=TR, edge=TR, hl=[endf], hlcol=AM)
c0 = [sum(sd.P[k][i] for k in Fc[endf]) / 5 for i in range(2)]
fig += T(c0[0], c0[1], 'A', AM, 26, italic=True)
fig += sd.lab(4, 9, 'panjang', TX, 19, 28)
fig += T(250, 34, 'A = luas keratan rentas', AM, 18, halo=False)
fig += RECT(40, 362, 420, 84, SURF, BD, 14, 2)
fig += T(250, 388, 'Isi padu prisma = A × panjang', TX, 20) + T(250, 422, 'Kubus s³ · Kuboid p × l × t', MU3, 18)
add('6.4', 'DEFINISI', 'Isi padu prisma',
    DEF('<b>Isi padu</b> ialah ruang yang dipenuhi oleh sesuatu bentuk 3D. Unitnya <b>unit padu</b>: cm³, m³.', col)
    + P('Isi padu prisma = luas keratan rentas × panjang')
    + BUL([f'Kubus: {S_} × {S_} × {S_} = {S_}³', f'Kuboid: {Pp} × {Ll} × {Tt}',
           'Prisma segi tiga 3 cm, 4 cm (sudut tegak), panjang 10 cm: ' + f'{FR(1, 2)} × 3 × 4 × 10 = <b>60 cm³</b>'], col),
    svg(fig, 'Prisma dengan keratan rentas A dan panjang'))
assert F(1, 2) * 3 * 4 * 10 == 60

# 6.4-2 Silinder
Vc = PI * 7 ** 2 * 10; assert PI * 49 == 154 and Vc == 1540
fig = cylinder((250, 350), 120, 230, 36, col=TR, edge=TR, top_hl=AM)
fig += LINE((250, 120), (370, 120), TX, 3) + DOT((250, 120), TX, 4) + T(310, 104, 'j = 7 cm', TX, 19)
fig += LINE((398, 120), (398, 350), MU3, 2.5, '6 5') + T(406, 220, 't =', TX, 19, 'start') + T(406, 248, '10 cm', TX, 19, 'start')
fig += T(250, 196, 'A = πj²', AM, 20)
fig += T(250, 430, 'Isi padu = πj² × t', TR, 21)
add('6.4', 'CONTOH BERLANGKAH', 'Isi padu silinder',
    P(f'Silinder ialah "prisma bulat": keratan rentasnya bulatan dengan luas π{J}².')
    + P(f'Cari isi padu silinder dengan {J} = 7 cm dan {Tt} = 10 cm. (π = {PI7})', True)
    + STEPS([f'Luas tapak = π{J}² = {PI7} × 7 × 7 = 154 cm²',
             'Isi padu = 154 × 10'], col)
    + ANS('1 540 cm³'),
    svg(fig, 'Silinder berjejari 7 cm dan tinggi 10 cm'))

# 6.4-3 Piramid & kon = 1/3
Vpy = F(1, 3) * 6 * 6 * 4; assert Vpy == 48
Vkon = F(1, 3) * PI * 7 ** 2 * 24; assert Vkon == 1232
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
V, Fc = pyramid([(0, 0), (6, 0), (6, 6), (0, 6)], 4)
py = Solid(V, Fc, Cam(-25, 16), box=(40, 80, 218, 290))
fig += py.draw(fill=TR, edge=TR, hl=[0], hlcol=AM)
# tinggi tegak: dari puncak ke pusat tapak (unjur)
Vb = V + [(3, 0, 3)]; pyb = Solid(Vb, Fc, Cam(-25, 16), box=(40, 80, 218, 290))
fig += LINE(pyb.P[4], pyb.P[5], PK, 3, '6 5') + DOT(pyb.P[5], PK, 4)
fig += T(pyb.P[4][0] - 10, (pyb.P[4][1] + pyb.P[5][1]) / 2 - 10, '4', PK, 18, 'end')
front = sorted([(i, (i + 1) % 4) for i in range(4) if py.vis[i + 1]], key=lambda e: -math.dist(py.P[e[0]], py.P[e[1]]))
fig += py.lab(front[0][0], front[0][1], '6', AM, 18) + py.lab(front[1][0], front[1][1], '6', AM, 18)
fig += T(129, 48, 'Piramid', TX, 20)
fig += SMIX(129, 326, [('f', '1', '3'), ' × 36 × 4'], MU3, 18, halo=NAV) + T(129, 372, '= 48 cm³', TR, 21)
cs, A = cone((371, 260), 66, 180, 20, col=TR, edge=TR)
fig += cs + LINE(A, (371, 260), PK, 3, '6 5') + T(379, 170, '24', PK, 18, 'start') + LINE((371, 260), (437, 260), TX, 2.5) + T(404, 276, '7', TX, 17)
fig += T(371, 48, 'Kon', TX, 20)
fig += SMIX(371, 326, [('f', '1', '3'), ' × 154 × 24'], MU3, 18, halo=NAV) + T(371, 372, '= 1 232 cm³', TR, 21)
fig += T(129, 420, 'ukuran dalam cm', MU, 15, halo=False) + T(371, 420, 'ukuran dalam cm', MU, 15, halo=False)
add('6.4', 'CONTOH BERLANGKAH', 'Isi padu piramid dan kon',
    DEF(f'Isi padu piramid = {SEPERTIGA} × luas tapak × tinggi &nbsp;·&nbsp; Isi padu kon = {SEPERTIGA}π{J}²{Tt}', col)
    + STEPS([f'Piramid tapak 6 cm × 6 cm, tinggi 4 cm: {SEPERTIGA} × 36 × 4 = <b>48 cm³</b>',
             f'Kon {J} = 7 cm, {Tt} = 24 cm: {SEPERTIGA} × 154 × 24 = <b>1 232 cm³</b>'], col)
    + NOTE(f'Isi padu piramid (kon) = {SEPERTIGA} isi padu prisma (silinder) yang sama tapak dan tinggi. Guna tinggi <b>tegak</b>.'),
    svg(fig, 'Piramid dan kon dengan tinggi tegak ditanda'))

# 6.4-4 Sfera
jsf = 21; Vsf = F(4, 3) * PI * jsf ** 3; assert Vsf == 38808
assert F(4, 3) * PI * 7 ** 3 == F(4312, 3)
fig = sphere((250, 210), 150, col=TR, edge=TR)
fig += LINE((250, 210), (400, 210), TX, 3) + DOT((250, 210), TX, 5) + T(325, 192, 'j = 21 cm', TX, 20)
fig += T(250, 400, 'Isi padu sfera = ⁴⁄₃ × π × j³', TR, 21)
fig += T(250, 436, '21³ = 21 × 21 × 21 = 9 261', MU3, 18)
assert 21 ** 3 == 9261
add('6.4', 'CONTOH BERLANGKAH', 'Isi padu sfera',
    DEF(f'Isi padu sfera = {EMPAT3}π{J}³', col)
    + P(f'Cari isi padu sebiji bola berjejari 21 cm. (π = {PI7})', True)
    + STEPS([f'Isi padu = {EMPAT3} × {PI7} × 21 × 21 × 21',
             '= 4 × 22 × 441 &nbsp;(21 ÷ 7 = 3, kemudian 3 ÷ 3 = 1)'], col)
    + ANS('38 808 cm³')
    + NOTE(f'<b>{J}³</b> = {J} × {J} × {J}, bukan {J}² seperti dalam luas permukaan sfera.'),
    svg(fig, 'Sfera berjejari 21 cm'))
assert F(4, 3) * 22 * 3 * 441 == 4 * 22 * 441 == 38808

# 6.4-5 Tukar unit
assert 100 ** 3 == 1_000_000
pT, lT, tT = F(2), F(3, 2), F(1)
VT = pT * lT * tT; assert VT == 3 and VT * 1000 == 3000
fig = ''
# kubus 1 cm³ = 1 ml ; 1 liter = 1000 cm³ ; 1 m³ = 1000 liter
fig += RECT(14, 14, 472, 132) + RECT(14, 160, 472, 132) + RECT(14, 306, 472, 150)
V, Fc = cuboid(1, 1, 1)
c1 = Solid(V, Fc, Cam(-30, 24), box=(40, 40, 120, 120)); fig += c1.draw(fill=TR, edge=TR, sw=3)
fig += T(150, 66, '1 cm³ = 1 ml', TX, 22, 'start') + T(150, 104, 'kubus bersisi 1 cm', MU, 16, 'start', halo=False)
c2 = Solid(V, Fc, Cam(-30, 24), box=(36, 182, 124, 270)); fig += c2.draw(fill=AM, edge=AM, sw=3)
fig += T(150, 210, '1 liter = 1 000 cm³', TX, 22, 'start') + T(150, 248, 'kubus bersisi 10 cm', MU, 16, 'start', halo=False)
c3 = Solid(V, Fc, Cam(-30, 24), box=(32, 330, 128, 426)); fig += c3.draw(fill=PK, edge=PK, sw=3)
fig += T(150, 352, '1 m³ = 1 000 000 cm³', TX, 22, 'start') + T(150, 390, '= 1 000 liter', TX, 22, 'start') + T(150, 426, 'kubus bersisi 100 cm', MU, 16, 'start', halo=False)
add('6.4', 'TUKAR UNIT', 'Unit isi padu dan cecair',
    TABLE(['Daripada', 'Kepada', 'Cara'],
          [['cm³', 'ml', '× 1 (sama)'], ['liter', 'cm³ / ml', '× 1 000'], ['m³', 'cm³', '× 1 000 000'], ['m³', 'liter', '× 1 000']], col, fs=18)
    + P('Tangki air kuboid 2 m × 1.5 m × 1 m. Berapa liter air dapat diisi?', True)
    + STEPS(['Isi padu = 2 × 1.5 × 1 = 3 m³', '3 m³ = 3 × 1 000 liter'], col)
    + ANS('3 000 liter'),
    svg(fig, 'Kubus 1 cm³, 1 liter dan 1 m³'))

# 6.4-6 Gabungan & dimensi
Vg = PI * 7 ** 2 * 10 + F(1, 3) * PI * 7 ** 2 * 6; assert (PI * 49 * 10, F(1, 3) * PI * 49 * 6, Vg) == (1540, 308, 1848)
tk_ = F(240) / (10 * 6); assert tk_ == 4
# kon di atas silinder: tapak kon = penutup silinder
fig = ''
c_ = (250, 400); r_, h_, ry_ = 92, 170, 27
top = (250, 400 - h_)
fig += f'<path d="M{c_[0] - r_} {top[1]} L{c_[0] - r_} {c_[1]} A{r_} {ry_} 0 0 0 {c_[0] + r_} {c_[1]} L{c_[0] + r_} {top[1]} Z" fill="{TR}26"/>'
fig += ARC(c_, r_, ry_, 180, 360, TR, 2.5, '7 7') + ARC(c_, r_, ry_, 0, 180, TR, 4.5)
fig += LINE((c_[0] - r_, top[1]), (c_[0] - r_, c_[1]), TR, 4.5) + LINE((c_[0] + r_, top[1]), (c_[0] + r_, c_[1]), TR, 4.5)
Ap = (250, top[1] - 130)
eR, _ = ellipse_tangent(Ap, top, r_, ry_, True); eL, _ = ellipse_tangent(Ap, top, r_, ry_, False)
fig += f'<path d="M{Ap[0]} {Ap[1]} L{r1(eR[0])} {r1(eR[1])} A{r_} {ry_} 0 0 1 {r1(eL[0])} {r1(eL[1])} Z" fill="{PK}2E"/>'
fig += ARC(top, r_, ry_, 180, 360, PK, 2.5, '7 7') + ARC(top, r_, ry_, 0, 180, TX, 3, '4 5')
fig += LINE(Ap, eR, PK, 4.5) + LINE(Ap, eL, PK, 4.5)
fig += LINE(top, (top[0] + r_, top[1]), TX, 2.5) + T(top[0] + r_ / 2, top[1] - 14, '7 cm', TX, 17)
fig += LINE((370, Ap[1]), (370, top[1]), MU3, 2.5, '6 5') + T(380, (Ap[1] + top[1]) / 2, '6 cm', PK, 19, 'start')
fig += LINE((370, top[1]), (370, c_[1]), MU3, 2.5, '6 5') + T(380, (top[1] + c_[1]) / 2, '10 cm', TR, 19, 'start')
fig += T(124, 140, 'Kon', PK, 20, 'end') + T(124, 330, 'Silinder', TR, 20, 'end')
assert eR[1] <= top[1] + ry_
add('6.4', 'PENYELESAIAN MASALAH', 'Gabungan pepejal',
    P(f'Sebuah pepejal terdiri daripada kon di atas silinder. Jejari 7 cm, tinggi silinder 10 cm dan tinggi kon 6 cm. Cari isi padunya. (π = {PI7})', True)
    + STEPS(['Isi padu silinder = 154 × 10 = 1 540 cm³',
             f'Isi padu kon = {SEPERTIGA} × 154 × 6 = 308 cm³',
             'Jumlah = 1 540 + 308'], col)
    + ANS('1 848 cm³')
    + NOTE('Kuboid 240 cm³ dengan panjang 10 cm dan lebar 6 cm: tinggi = 240 ÷ (10 × 6) = 4 cm.', 'Cari dimensi:'),
    svg(fig, 'Pepejal gabungan kon di atas silinder'))

# 6.4-7 Kesilapan biasa + ringkasan
fig = ''
CASES = [(44, ['Kon: πj²t (lupa ', ('f', '1', '3'), ')'], False), (108, ['Kon: ', ('f', '1', '3'), 'πj²t'], True),
         (196, 'd = 14 cm, guna 14 dalam πj²t', False), (260, 'd = 14 cm → j = 7 cm', True),
         (348, '2 liter = 200 cm³', False), (412, '2 liter = 2 000 cm³', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 28, 460, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(52, y) if ok else CROSS(52, y)) + (T(84, y, t, GR if ok else RD, 18, 'start') if isinstance(t, str) else SMIX(84, y, t, GR if ok else RD, 18, 'start'))
add('6.4', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Lupa " + SEPERTIGA, RD)} bagi piramid dan kon.',
         f'{B("Guna diameter", RD)} dalam π{J}²{Tt} atau {EMPAT3}π{J}³.',
         f'{B("Guna tinggi sendeng", RD)} untuk isi padu kon ✗ → guna tinggi <b>tegak</b>.',
         f'{B("Unit", RD)}: isi padu dalam cm³ / m³; 1 liter = 1 000 cm³.'], col)
    + NOTE(f'Prisma, silinder: A × {Tt}. Piramid, kon: {SEPERTIGA} × A × {Tt}. Sfera: {EMPAT3}π{J}³.', 'Ringkasan:'),
    svg(fig, 'Kenyataan salah dan betul tentang isi padu'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3, TEAL] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body
assert all(4 <= v <= 7 for v in counts.values()), counts
assert counts == {'6.1': 7, '6.2': 6, '6.3': 7, '6.4': 7}, counts

js = ('/* Dijana oleh tools/bentuk3d/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
