"""Pembantu rajah geometri 2D untuk nota (bulatan, segi tiga, label sudut dan sisi).
Guna: import rajah2d as RJ.  Koordinat skrin dalam viewBox 500x470 (y ke bawah).
Sudut 'math' dalam darjah: 0 = kanan, 90 = atas (lawan arah jam)."""
import math
import graf as GF
from graf import TX, MU, MU3, AM, TR, PK, GR, PU, PA, NAV


def P(c, deg, r=None):
    """titik pada bulatan c=(cx,cy,r) pada sudut math deg (atau jejari r)."""
    cx, cy, R = c
    r = R if r is None else r
    return (cx + r * math.cos(math.radians(deg)), cy - r * math.sin(math.radians(deg)))


def circle(c, col=TX, w=3, fill='none', dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{c[0]:.1f}" cy="{c[1]:.1f}" r="{c[2]:.1f}" fill="{fill}" stroke="{col}" stroke-width="{w}"{d}/>'


def dot(p, col=TX, r=4.5):
    return f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="{r}" fill="{col}"/>'


def lab(c, deg, s, off=20, col=TX, size=17):
    """label bucu di luar bulatan pada sudut deg."""
    x, y = P(c, deg, c[2] + off)
    return GF.T(x, y, s, col, size)


def labp(p, ref, s, off=16, col=TX, size=17):
    """label titik p, ditolak menjauhi ref."""
    dx, dy = p[0] - ref[0], p[1] - ref[1]; d = math.hypot(dx, dy) or 1
    return GF.T(p[0] + dx / d * off, p[1] + dy / d * off, s, col, size)


def seg(a, b, col=TX, w=3, dash=None):
    return GF.L(a, b, col, w, dash)


def ext(a, b, k):
    """titik pada garis ab dipanjangkan melepasi b sejauh k px."""
    dx, dy = b[0] - a[0], b[1] - a[1]; d = math.hypot(dx, dy)
    return (b[0] + dx / d * k, b[1] + dy / d * k)


def poly(pts, col, fill=True, w=3):
    return '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts) + f'" fill="{col + "26" if fill else "none"}" stroke="{col}" stroke-width="{w}" stroke-linejoin="round"/>'


def rt(B, A, C, s=13, col=TX):
    ux, uy = (A[0] - B[0]), (A[1] - B[1]); d = math.hypot(ux, uy); ux, uy = ux / d * s, uy / d * s
    vx, vy = (C[0] - B[0]), (C[1] - B[1]); d = math.hypot(vx, vy); vx, vy = vx / d * s, vy / d * s
    return f'<path d="M{B[0] + ux:.1f} {B[1] + uy:.1f} L{B[0] + ux + vx:.1f} {B[1] + uy + vy:.1f} L{B[0] + vx:.1f} {B[1] + vy:.1f}" fill="none" stroke="{col}" stroke-width="2"/>'


def ang(V, A, B, lb, col=AM, r=28, size=15, lr=None, w=2.2):
    """lengkok sudut di V antara VA dan VB (sudut kecil) + label."""
    a1 = math.atan2(A[1] - V[1], A[0] - V[0]); a2 = math.atan2(B[1] - V[1], B[0] - V[0])
    da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    p1 = (V[0] + r * math.cos(a1), V[1] + r * math.sin(a1)); p2 = (V[0] + r * math.cos(a1 + da), V[1] + r * math.sin(a1 + da))
    o = f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r} {r} 0 0 {1 if da > 0 else 0} {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="{w}"/>'
    if lb:
        am = a1 + da / 2; R = lr or r + 14
        o += GF.T(V[0] + R * math.cos(am), V[1] + R * math.sin(am), lb, col, size)
    return o


def angbig(V, A, B, lb, col=AM, r=26, size=15, lr=None):
    """lengkok sudut refleks di V (sudut besar antara VA dan VB)."""
    a1 = math.atan2(A[1] - V[1], A[0] - V[0]); a2 = math.atan2(B[1] - V[1], B[0] - V[0])
    da = (a2 - a1 + math.pi) % (2 * math.pi) - math.pi
    db = da - 2 * math.pi if da > 0 else da + 2 * math.pi
    p1 = (V[0] + r * math.cos(a1), V[1] + r * math.sin(a1)); p2 = (V[0] + r * math.cos(a2), V[1] + r * math.sin(a2))
    o = f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r} {r} 0 1 {1 if db > 0 else 0} {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="2.2"/>'
    am = a1 + db / 2; R = lr or r + 14
    return o + GF.T(V[0] + R * math.cos(am), V[1] + R * math.sin(am), lb, col, size)


def arc(c, d1, d2, col=PK, w=5, off=0):
    """lengkok bulatan dari d1 ke d2 (lawan arah jam, darjah math)."""
    r = c[2] + off
    p1 = P(c, d1, r); p2 = P(c, d2, r)
    span = (d2 - d1) % 360
    return f'<path d="M{p1[0]:.1f} {p1[1]:.1f} A{r:.1f} {r:.1f} 0 {1 if span > 180 else 0} 0 {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round"/>'


def tick(A, B, n=1, col=TX):
    mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
    dx, dy = B[0] - A[0], B[1] - A[1]; d = math.hypot(dx, dy); ux, uy = dx / d, dy / d; nx, ny = -uy * 8, ux * 8
    return ''.join(GF.L((mx + ux * 5 * (k - (n - 1) / 2) - nx, my + uy * 5 * (k - (n - 1) / 2) - ny), (mx + ux * 5 * (k - (n - 1) / 2) + nx, my + uy * 5 * (k - (n - 1) / 2) + ny), col, 2) for k in range(n))


def side(A, B, lb, col=TX, off=16, size=16, ref=None):
    mx, my = (A[0] + B[0]) / 2, (A[1] + B[1]) / 2
    nx, ny = -(B[1] - A[1]), B[0] - A[0]; d = math.hypot(nx, ny); nx, ny = nx / d, ny / d
    if ref and (ref[0] - mx) * nx + (ref[1] - my) * ny > 0:
        nx, ny = -nx, -ny
    anc = 'middle' if abs(nx) < 0.5 else ('start' if nx > 0 else 'end')
    return GF.T(mx + nx * off, my + ny * off, lb, col, size, anc)


def tangent(c, deg, L1, L2):
    """dua hujung garis tangen pada titik sudut deg; L1 ke arah lawan jam, L2 ke arah jam."""
    T = P(c, deg); t = math.radians(deg)
    ux, uy = -math.sin(t), -math.cos(t)   # arah lawan jam dalam koordinat skrin
    return (T[0] + ux * L1, T[1] + uy * L1), (T[0] - ux * L2, T[1] - uy * L2)


def surd(x, y, n, col=TX, size=16, anchor='start', tail=''):
    cw = size * 0.6; wr = cw * 0.95; wn = cw * len(n); wt = cw * 0.55 * len(tail)
    tot = wr + wn + wt
    x0 = x if anchor == 'start' else (x - tot / 2 if anchor == 'middle' else x - tot)
    o = GF.T(x0, y, '√', col, size, 'start') + GF.T(x0 + wr, y, n, col, size, 'start')
    o += GF.L((x0 + wr - 1, y - size * 0.62), (x0 + wr + wn + 1, y - size * 0.62), col, 1.6)
    if tail:
        o += GF.T(x0 + wr + wn, y, tail, col, size, 'start')
    return o
