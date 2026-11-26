"""Prisma tegak (keratan rentas seragam) untuk Bab 7 Pelan dan Dongakan.
Keratan rentas (x, y) di muka depan z = 0, dipanjangkan ke belakang hingga z = d.
x ke kanan, y ke atas, z ke belakang (masuk halaman).
Menjana: lakaran 3D (oblik), pelan (dari atas), dongakan depan, dongakan sisi (dari kanan atau kiri),
lengkap dengan label bucu gaya buku teks (cth 'B/C') dan garis sempang bagi sisi terlindung."""
import math
import graf as GF
from graf import TX, MU, MU3, AM, TR, PK, GR, PU, PA

EPS = 1e-5


def _area(poly):
    return sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1] for i in range(len(poly))) / 2


def dimline(a, b, lb, col=MU3, off=16, size=14, side=1):
    """garis dimensi selari ab, dianjak off px ke sisi (side = ±1)."""
    dx, dy = b[0] - a[0], b[1] - a[1]; L = math.hypot(dx, dy) or 1
    nx, ny = dy / L * side, -dx / L * side
    p, q = (a[0] + nx * off, a[1] + ny * off), (b[0] + nx * off, b[1] + ny * off)
    o = GF.L(p, q, col, 1.4) + GF.L((p[0] - nx * 5, p[1] - ny * 5), (p[0] + nx * 5, p[1] + ny * 5), col, 1.4) + GF.L((q[0] - nx * 5, q[1] - ny * 5), (q[0] + nx * 5, q[1] + ny * 5), col, 1.4)
    m = ((p[0] + q[0]) / 2 + nx * 11, (p[1] + q[1]) / 2 + ny * 11)
    anc = 'middle' if abs(nx) < 0.6 else ('start' if nx > 0 else 'end')
    return o + GF.T(m[0], m[1], lb, col, size, anc)


class Prism:
    def __init__(self, sec, front, back, d):
        if _area(sec) < 0:
            sec = sec[::-1]; front = front[::-1]; back = back[::-1]
        self.sec, self.F, self.B, self.d = sec, front, back, d
        self.n = len(sec)
        self.ymax = max(y for _, y in sec); self.ymin = min(y for _, y in sec)
        self.xmax = max(x for x, _ in sec); self.xmin = min(x for x, _ in sec)

    # ---------- keratan rentas ----------
    def _xs_at(self, h):
        """titik x keratan rentas pada aras y = h (termasuk sisi mendatar)."""
        xs = []
        for i in range(self.n):
            (x1, y1), (x2, y2) = self.sec[i], self.sec[(i + 1) % self.n]
            if abs(y1 - h) < EPS and abs(y2 - h) < EPS:
                xs += [x1, x2]
            elif min(y1, y2) - EPS <= h <= max(y1, y2) + EPS and abs(y2 - y1) > EPS:
                xs.append(x1 + (h - y1) * (x2 - x1) / (y2 - y1))
        return xs

    def _ys_at(self, x):
        ys = []
        for i in range(self.n):
            (x1, y1), (x2, y2) = self.sec[i], self.sec[(i + 1) % self.n]
            if abs(x1 - x) < EPS and abs(x2 - x) < EPS:
                ys += [y1, y2]
            elif min(x1, x2) - EPS <= x <= max(x1, x2) + EPS and abs(x2 - x1) > EPS:
                ys.append(y1 + (x - x1) * (y2 - y1) / (x2 - x1))
        return ys

    # ---------- lakaran 3D oblik ----------
    def pts3d(self, ox, oy, s, k=0.55, a=38):
        ca, sa = math.cos(math.radians(a)) * k, math.sin(math.radians(a)) * k
        f = lambda x, y, z: (ox + s * (x + z * ca), oy - s * (y + z * sa))
        return [f(x, y, 0) for x, y in self.sec], [f(x, y, self.d) for x, y in self.sec], (ca, sa)

    def draw3d(self, ox, oy, s, col=TR, k=0.55, a=38, labels=True, fs=15, hide=(), extra_hidden=(), solid_ok=()):
        Pf, Pb, (ca, sa) = self.pts3d(ox, oy, s, k, a)
        out_hidden, faces = [], []
        n = self.n
        for i in range(n):
            j = (i + 1) % n
            (x1, y1), (x2, y2) = self.sec[i], self.sec[j]
            nx, ny = (y2 - y1), -(x2 - x1)            # normal luar (keratan rentas lawan jam)
            vis = nx * ca + ny * sa > EPS
            poly = [Pf[i], Pf[j], Pb[j], Pb[i]]
            key = -((x1 + x2) / 2 * ca + (y1 + y2) / 2 * sa)
            faces.append((vis, key, poly, (i, j)))
        o = ''
        # sisi belakang tersembunyi (sempang)
        hid = set()
        for i in range(n):
            j = (i + 1) % n
            vf = [f for f in faces if f[3][0] == i or f[3][1] == i]
            if not any(f[0] for f in vf) and i not in solid_ok:
                hid.add(('d', i))
        for i in range(n):
            j = (i + 1) % n
            if not faces[i][0]:
                hid.add(('b', i))
        # lukis muka kelihatan (jauh → dekat), kemudian muka depan
        for vis, key, poly, _ in sorted([f for f in faces if f[0]], key=lambda f: f[1]):
            o += '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in poly) + f'" fill="#1B2A44" fill-opacity="0.92" stroke="{col}" stroke-width="2.6" stroke-linejoin="round"/>'
        o += '<polygon points="' + ' '.join(f'{x:.1f},{y:.1f}' for x, y in Pf) + f'" fill="{col}" fill-opacity="0.22" stroke="{col}" stroke-width="2.6" stroke-linejoin="round"/>'
        # garis sempang: sisi belakang dan sisi kedalaman yang terlindung
        for typ, i in hid:
            j = (i + 1) % n
            if typ == 'b':
                o += GF.L(Pb[i], Pb[j], col, 1.8, '6 5')
            else:
                o += GF.L(Pf[i], Pb[i], col, 1.8, '6 5')
        for i, j in extra_hidden:
            o += GF.L(i, j, col, 1.8, '6 5')
        if labels:
            allp = Pf + Pb; cx = sum(p[0] for p in allp) / len(allp); cy = sum(p[1] for p in allp) / len(allp)
            for P_, nm in list(zip(Pf, self.F)) + list(zip(Pb, self.B)):
                if nm and nm not in hide:
                    dx, dy = P_[0] - cx, P_[1] - cy; dd = math.hypot(dx, dy) or 1
                    o += GF.T(P_[0] + dx / dd * 14, P_[1] + dy / dd * 14, nm, TX, fs)
        return o

    # ---------- pelan (dari atas) ----------
    def plan(self, x0, yb, s, col=AM, fs=13, labels=True):
        """x0 = kiri, yb = garis depan (z = 0) di bawah; belakang di atas."""
        X = lambda x: x0 + s * (x - self.xmin)
        Y = lambda z: yb - s * z
        o = f'<rect x="{X(self.xmin):.1f}" y="{Y(self.d):.1f}" width="{s * (self.xmax - self.xmin):.1f}" height="{s * self.d:.1f}" fill="{col}22" stroke="{col}" stroke-width="2.6"/>'
        xs = sorted(set(round(x, 6) for x, _ in self.sec))
        for x in xs:
            top = max(self._ys_at(x))
            vis = any(abs(vx - x) < EPS and abs(vy - top) < EPS for vx, vy in self.sec)
            # garis ada jika sisi berubah arah di x ini
            if self.xmin + EPS < x < self.xmax - EPS:
                o += GF.L((X(x), Y(0)), (X(x), Y(self.d)), col, 2.4 if vis else 1.8, None if vis else '6 5')
        if labels:
            for x in xs:
                idx = sorted([k for k, (vx, vy) in enumerate(self.sec) if abs(vx - x) < EPS], key=lambda k: -self.sec[k][1])
                o += GF.T(X(x), Y(0) + 15, '/'.join(self.F[k] for k in idx), TX, fs)
                o += GF.T(X(x), Y(self.d) - 12, '/'.join(self.B[k] for k in idx), TX, fs)
        return o

    # ---------- dongakan depan ----------
    def front(self, x0, yb, s, col=TR, fs=13, labels=True):
        X = lambda x: x0 + s * (x - self.xmin)
        Y = lambda y: yb - s * (y - self.ymin)
        o = '<polygon points="' + ' '.join(f'{X(x):.1f},{Y(y):.1f}' for x, y in self.sec) + f'" fill="{col}22" stroke="{col}" stroke-width="2.6" stroke-linejoin="round"/>'
        if labels:
            cx = sum(X(x) for x, _ in self.sec) / self.n; cy = sum(Y(y) for _, y in self.sec) / self.n
            for (x, y), a, b in zip(self.sec, self.F, self.B):
                px, py = X(x), Y(y); dx, dy = px - cx, py - cy; dd = math.hypot(dx, dy) or 1
                o += GF.T(px + dx / dd * 18, py + dy / dd * 14, f'{a}/{b}', TX, fs)
        return o

    # ---------- dongakan sisi ----------
    def side(self, x0, yb, s, frm='kanan', col=PK, fs=13, labels=True):
        """frm='kanan': depan (z=0) di kiri; frm='kiri': depan di kanan."""
        U = (lambda z: x0 + s * z) if frm == 'kanan' else (lambda z: x0 + s * (self.d - z))
        Y = lambda y: yb - s * (y - self.ymin)
        o = f'<rect x="{x0:.1f}" y="{Y(self.ymax):.1f}" width="{s * self.d:.1f}" height="{s * (self.ymax - self.ymin):.1f}" fill="{col}22" stroke="{col}" stroke-width="2.6"/>'
        hs = sorted(set(round(y, 6) for _, y in self.sec))
        for h in hs:
            xs = self._xs_at(h)
            ext_ = max(xs) if frm == 'kanan' else min(xs)
            vids = [k for k, (vx, vy) in enumerate(self.sec) if abs(vy - h) < EPS]
            vis = any(abs(self.sec[k][0] - ext_) < EPS for k in vids)
            if self.ymin + EPS < h < self.ymax - EPS:
                o += GF.L((U(0), Y(h)), (U(self.d), Y(h)), col, 2.4 if vis else 1.8, None if vis else '6 5')
            if labels:
                order = sorted(vids, key=lambda k: -self.sec[k][0] if frm == 'kanan' else self.sec[k][0])
                o += GF.T(U(0) + (-8 if frm == 'kanan' else 8), Y(h), '/'.join(self.F[k] for k in order), TX, fs, 'end' if frm == 'kanan' else 'start')
                o += GF.T(U(self.d) + (8 if frm == 'kanan' else -8), Y(h), '/'.join(self.B[k] for k in order), TX, fs, 'start' if frm == 'kanan' else 'end')
        return o
