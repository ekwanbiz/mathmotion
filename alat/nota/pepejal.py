"""Pelukis bentuk 3D (diambil daripada tools/bentuk3d/gen_slides.py) untuk nota Bab 6. Guna: import pepejal as G."""
import json, os, html, math, re
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))

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

import sys as _s; _s.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools'))
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

