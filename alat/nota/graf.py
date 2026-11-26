"""Pembantu rajah satah Cartes berskala bebas dan rajah anak panah (nota Bab 7, Bab 8 dan bab graf lain).
Guna: import graf as GF.  Semua koordinat skrin dalam viewBox 500x470."""
import math

TX = '#E6EDF7'; MU = '#94A3B8'; MU3 = '#B6C2D3'; GRID = '#1E2A40'; GRID2 = '#26344F'; AX = '#94A3B8'; NAV = '#0E1626'; SURF = '#131C2E'; BD = '#22304A'
TR = '#38BDF8'; PA = '#FB923C'; PU = '#A78BFA'; AM = '#FBBF24'; PK = '#F472B6'; GR = '#34D399'; RD = '#F87171'
FONT = 'Inter, sans-serif'


def f1(v):
    return f'{v:.1f}'


def mn(v):
    """nombor → teks (tanda tolak tipografi, buang .0)."""
    if isinstance(v, float) and abs(v - round(v)) < 1e-9:
        v = int(round(v))
    return str(v).replace('-', '−')


def it(s):
    s = str(s)
    s = s.replace('<i>', '<tspan font-style="italic">').replace('</i>', '</tspan>')
    return s.replace('<sub>', '<tspan baseline-shift="sub" font-size="70%">').replace('</sub>', '</tspan>')


def T(x, y, s, col=TX, size=17, anchor='middle', w=700, halo=True):
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="5" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{f1(x)}" y="{f1(y)}" fill="{col}" font-family="{FONT}" font-size="{size}" font-weight="{w}" '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{it(s)}</text>')


def L(a, b, col=TX, w=3, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{f1(a[0])}" y1="{f1(a[1])}" x2="{f1(b[0])}" y2="{f1(b[1])}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"{d}/>'


def head(a, b, col, w=3, Lh=12):
    an = math.atan2(b[1] - a[1], b[0] - a[0])
    p1 = (b[0] - Lh * math.cos(an - .45), b[1] - Lh * math.sin(an - .45)); p2 = (b[0] - Lh * math.cos(an + .45), b[1] - Lh * math.sin(an + .45))
    return f'<path d="M{f1(p1[0])} {f1(p1[1])} L{f1(b[0])} {f1(b[1])} L{f1(p2[0])} {f1(p2[1])}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def arrow(a, b, col=MU3, w=3):
    return L(a, b, col, w) + head(a, b, col, w)


def box(x, y, w, h, rx=18):
    return f'<rect x="{f1(x)}" y="{f1(y)}" width="{f1(w)}" height="{f1(h)}" rx="{rx}" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'


def svg(inner, aria):
    return f'<svg class="sl-svg" viewBox="0 0 500 470" role="img" aria-label="{aria}">{inner}</svg>'


def rv(x):
    return f'<g class="rv">{x}</g>'


class Gr:
    """Satah Cartes dalam kotak (L, T, R, B) skrin. xr, yr = julat; xs, ys = sela label; gx, gy = sela garis grid."""

    def __init__(self, bx, xr, yr, xs=1, ys=1, gx=None, gy=None, xl='<i>x</i>', yl='<i>y</i>', fs=13, labels=True, origin='O', equal=False, skipx=(), skipy=()):
        self.L, self.T_, self.R, self.B = bx
        self.x0, self.x1 = xr; self.y0, self.y1 = yr
        self.sx = (self.R - self.L) / (self.x1 - self.x0); self.sy = (self.B - self.T_) / (self.y1 - self.y0)
        if equal:
            s = min(self.sx, self.sy); self.sx = self.sy = s
            w, h = s * (self.x1 - self.x0), s * (self.y1 - self.y0)
            cx, cy = (self.L + self.R) / 2, (self.T_ + self.B) / 2
            self.L, self.R, self.T_, self.B = cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2
        self.out = []
        gx = gx or xs; gy = gy or ys
        o = self.out
        k = math.ceil(self.x0 / gx - 1e-9)
        while k * gx <= self.x1 + 1e-9:
            X = self.X(k * gx); o.append(L((X, self.T_), (X, self.B), GRID2 if abs(k * gx / xs - round(k * gx / xs)) < 1e-9 else GRID, 1.2)); k += 1
        k = math.ceil(self.y0 / gy - 1e-9)
        while k * gy <= self.y1 + 1e-9:
            Y = self.Y(k * gy); o.append(L((self.L, Y), (self.R, Y), GRID2 if abs(k * gy / ys - round(k * gy / ys)) < 1e-9 else GRID, 1.2)); k += 1
        ax_y = self.Y(0) if self.y0 <= 0 <= self.y1 else self.B
        ax_x = self.X(0) if self.x0 <= 0 <= self.x1 else self.L
        o.append(L((self.L - 6, ax_y), (self.R + 14, ax_y), AX, 2.5) + head((self.L, ax_y), (self.R + 16, ax_y), AX, 2.5))
        o.append(L((ax_x, self.B + 6), (ax_x, self.T_ - 14), AX, 2.5) + head((ax_x, self.B), (ax_x, self.T_ - 16), AX, 2.5))
        import re as _re
        if len(_re.sub('<[^>]+>', '', xl)) > 3:
            o.append(T((self.L + self.R) / 2, self.B + 36, xl, AX, 15))
        else:
            o.append(T(self.R + 22, ax_y + 2, xl, AX, 16, 'start'))
        o.append(T(ax_x, self.T_ - 26, yl, AX, 16, 'start' if len(_re.sub('<[^>]+>', '', yl)) > 3 else 'middle'))
        if labels:
            k = math.ceil(self.x0 / xs - 1e-9)
            while k * xs <= self.x1 + 1e-9:
                v = round(k * xs, 6)
                if abs(v) > 1e-9 and v not in skipx:
                    o.append(L((self.X(v), ax_y - 4), (self.X(v), ax_y + 4), AX, 2) + T(self.X(v), ax_y + 15, mn(v), MU, fs, 'middle', 600))
                k += 1
            k = math.ceil(self.y0 / ys - 1e-9)
            while k * ys <= self.y1 + 1e-9:
                v = round(k * ys, 6)
                if abs(v) > 1e-9 and v not in skipy:
                    o.append(L((ax_x - 4, self.Y(v)), (ax_x + 4, self.Y(v)), AX, 2) + T(ax_x - 7, self.Y(v), mn(v), MU, fs, 'end', 600))
                k += 1
            if origin:
                o.append(T(ax_x - 7, ax_y + 14, origin, MU, fs, 'end', 600))

    def X(self, x):
        return self.L + (x - self.x0) * self.sx

    def Y(self, y):
        return self.B - (y - self.y0) * self.sy

    def P(self, x, y):
        return (self.X(x), self.Y(y))

    def add(self, s, reveal=False):
        self.out.append(f'<g class="rv">{s}</g>' if reveal else s)
        return self

    def pt(self, x, y, lab='', col=TX, dx=10, dy=-14, anchor='start', size=16, r=5.5, reveal=False):
        s = f'<circle cx="{f1(self.X(x))}" cy="{f1(self.Y(y))}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2"/>'
        if lab:
            s += T(self.X(x) + dx, self.Y(y) + dy, lab, col, size, anchor)
        return self.add(s, reveal)

    def seg(self, a, b, col=TR, w=3.5, dash=None, reveal=False):
        return self.add(L(self.P(*a), self.P(*b), col, w, dash), reveal)

    def curve(self, fn, xa, xb, col=PK, w=3.5, n=200, reveal=False, clip=True):
        pts = []
        segs = []
        for i in range(n + 1):
            x = xa + (xb - xa) * i / n
            try:
                y = fn(x)
            except ZeroDivisionError:
                y = None
            if y is None or (clip and not (self.y0 - 1e-9 <= y <= self.y1 + 1e-9)):
                if len(pts) > 1:
                    segs.append(pts)
                pts = []
                continue
            pts.append(self.P(x, y))
        if len(pts) > 1:
            segs.append(pts)
        s = ''.join(f'<polyline points="{" ".join(f"{f1(a)},{f1(b)}" for a, b in sg)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round"/>' for sg in segs)
        return self.add(s, reveal)

    def text(self, x, y, s, col=TX, size=16, anchor='middle', reveal=False):
        return self.add(T(self.X(x), self.Y(y), s, col, size, anchor), reveal)

    def svg(self):
        return ''.join(self.out)


def arrow_diagram(cx, top, h, A, B, pairs, ta='', tb='', rel='', col=PU, colB=PK, w=300, la='', lb='', fs=16, reveal=False):
    """Rajah anak panah: set A (kiri) → set B (kanan). pairs = [(iA, iB), ...]. Pulang svg."""
    ax, bx = cx - w / 2 + 40, cx + w / 2 - 40
    rx = 38
    n = max(len(A), len(B))
    cy = top + h / 2
    ry = h / 2
    o = f'<ellipse cx="{f1(ax)}" cy="{f1(cy)}" rx="{rx}" ry="{f1(ry)}" fill="{col}1A" stroke="{col}" stroke-width="3"/>'
    o += f'<ellipse cx="{f1(bx)}" cy="{f1(cy)}" rx="{rx}" ry="{f1(ry)}" fill="{colB}1A" stroke="{colB}" stroke-width="3"/>'

    def ys(k):
        g = (h - 30) / max(k, 1)
        return [top + 15 + g * (i + .5) for i in range(k)]
    ya, yb = ys(len(A)), ys(len(B))
    for i, a in enumerate(A):
        o += T(ax - 6, ya[i], mn(a), TX, fs, 'end') + f'<circle cx="{f1(ax + 6)}" cy="{f1(ya[i])}" r="3.5" fill="{TX}"/>'
    for i, b in enumerate(B):
        o += T(bx + 6, yb[i], mn(b), TX, fs, 'start') + f'<circle cx="{f1(bx - 6)}" cy="{f1(yb[i])}" r="3.5" fill="{TX}"/>'
    ar = ''
    for i, k in pairs:
        ar += L((ax + 9, ya[i]), (bx - 10, yb[k]), TR, 2.2) + head((ax + 9, ya[i]), (bx - 9, yb[k]), TR, 2.2, 9)
    o += f'<g class="rv">{ar}</g>' if reveal else ar
    if ta:
        o += T(ax, top - 16, ta, MU3, 16)
    if tb:
        o += T(bx, top - 16, tb, MU3, 16)
    if rel:
        o += T(cx, top - 4, rel, AM, 15)
    if la:
        o += T(ax, top + h + 18, la, MU3, 15)
    if lb:
        o += T(bx, top + h + 18, lb, MU3, 15)
    return o
