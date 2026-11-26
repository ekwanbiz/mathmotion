"""Pembantu SVG untuk slaid TerokaMath (viewBox 500x470, tema gelap seperti slaid sedia ada)."""
GRID = '#1E2A40'; AX = '#94A3B8'; TX = '#E6EDF7'; OBJ = '#38BDF8'; IMG = '#FB923C'; GR = '#34D399'; PU = '#A78BFA'; AM = '#FBBF24'; PK = '#F472B6'
FONT = 'Inter, sans-serif'; HEAD = 'Space Grotesk, sans-serif'


def f(v):
    return f'{v:.1f}'


class Plane:
    """Satah Cartes dalam kotak 500x470."""

    def __init__(self, x0, x1, y0, y1, label=True, aria=''):
        self.x0, self.x1, self.y0, self.y1 = x0, x1, y0, y1
        nx, ny = x1 - x0, y1 - y0
        self.u = min(420 / nx, 360 / ny)
        w, h = nx * self.u, ny * self.u
        self.L = (500 - w) / 2 + 8
        self.T = (470 - h) / 2 + 4
        self.parts = []
        self.aria = aria
        self._grid(label)

    def X(self, x):
        return self.L + (x - self.x0) * self.u

    def Y(self, y):
        return self.T + (self.y1 - y) * self.u

    def _grid(self, label):
        p = self.parts
        for x in range(self.x0, self.x1 + 1):
            p.append(f'<line x1="{f(self.X(x))}" y1="{f(self.Y(self.y0))}" x2="{f(self.X(x))}" y2="{f(self.Y(self.y1))}" stroke="{GRID}" stroke-width="1.5"/>')
        for y in range(self.y0, self.y1 + 1):
            p.append(f'<line x1="{f(self.X(self.x0))}" y1="{f(self.Y(y))}" x2="{f(self.X(self.x1))}" y2="{f(self.Y(y))}" stroke="{GRID}" stroke-width="1.5"/>')
        if self.y0 <= 0 <= self.y1:
            p.append(f'<line x1="{f(self.X(self.x0))}" y1="{f(self.Y(0))}" x2="{f(self.X(self.x1) + 10)}" y2="{f(self.Y(0))}" stroke="{AX}" stroke-width="2.5"/>')
            p.append(f'<text x="{f(self.X(self.x1) + 14)}" y="{f(self.Y(0) + 5)}" fill="{AX}" font-family="{FONT}" font-size="16" font-style="italic" font-weight="600">x</text>')
        if self.x0 <= 0 <= self.x1:
            p.append(f'<line x1="{f(self.X(0))}" y1="{f(self.Y(self.y0))}" x2="{f(self.X(0))}" y2="{f(self.Y(self.y1) - 10)}" stroke="{AX}" stroke-width="2.5"/>')
            p.append(f'<text x="{f(self.X(0) - 5)}" y="{f(self.Y(self.y1) - 16)}" fill="{AX}" font-family="{FONT}" font-size="16" font-style="italic" font-weight="600">y</text>')
        if label and self.y0 <= 0 <= self.y1 and self.x0 <= 0 <= self.x1:
            for x in range(self.x0, self.x1 + 1):
                if x == 0:
                    continue
                p.append(f'<text x="{f(self.X(x))}" y="{f(self.Y(0) + 18)}" fill="{AX}" font-family="{FONT}" font-size="13" font-weight="600" text-anchor="middle">{str(x).replace("-", "−")}</text>')
            for y in range(self.y0, self.y1 + 1):
                if y == 0:
                    continue
                p.append(f'<text x="{f(self.X(0) - 7)}" y="{f(self.Y(y) + 4)}" fill="{AX}" font-family="{FONT}" font-size="13" font-weight="600" text-anchor="end">{str(y).replace("-", "−")}</text>')
            p.append(f'<text x="{f(self.X(0) - 7)}" y="{f(self.Y(0) + 17)}" fill="{AX}" font-family="{FONT}" font-size="13" font-weight="600" text-anchor="end">O</text>')

    def poly(self, pts, col=OBJ, dash=False, labels=None, loff=None, rv=False):
        s = ' '.join(f'{f(self.X(x))},{f(self.Y(y))}' for x, y in pts)
        d = ' stroke-dasharray="10 7"' if dash else ''
        out = [f'<polygon points="{s}" fill="{col}33" stroke="{col}" stroke-width="4" stroke-linejoin="round"{d}/>']
        if labels:
            cx = sum(x for x, _ in pts) / len(pts); cy = sum(y for _, y in pts) / len(pts)
            for (x, y), lb in zip(pts, labels):
                if not lb:
                    continue
                dx, dy = x - cx, y - cy
                n = (dx * dx + dy * dy) ** .5 or 1
                ox, oy = dx / n * 0.42, dy / n * 0.42
                out.append(self._t(x + ox, y + oy, lb, col, 19, HEAD))
        self._add(out, rv)

    def pt(self, x, y, lb='', col=OBJ, dx=12, dy=-10, rv=False):
        out = [f'<circle cx="{f(self.X(x))}" cy="{f(self.Y(y))}" r="7" fill="{col}"/>']
        if lb:
            out.append(f'<text x="{f(self.X(x) + dx)}" y="{f(self.Y(y) + dy)}" fill="{col}" font-family="{HEAD}" font-size="20" font-weight="700">{lb}</text>')
        self._add(out, rv)

    def line(self, a, b, col=TX, w=3, dash=False, rv=False, arrow=False):
        x1, y1, x2, y2 = self.X(a[0]), self.Y(a[1]), self.X(b[0]), self.Y(b[1])
        d = ' stroke-dasharray="9 7"' if dash else ''
        out = [f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"{d}/>']
        if arrow:
            out.append(arrowhead(x1, y1, x2, y2, col, w))
        self._add(out, rv)

    def text(self, x, y, s, col=TX, size=16, anchor='middle', rv=False):
        self._add([self._t(x, y, s, col, size, FONT, anchor)], rv)

    def _t(self, x, y, s, col, size, fam, anchor='middle'):
        return f'<text x="{f(self.X(x))}" y="{f(self.Y(y) + size * .35)}" fill="{col}" font-family="{fam}" font-size="{size}" font-weight="700" text-anchor="{anchor}">{s}</text>'

    def raw(self, s, rv=False):
        self._add([s], rv)

    def _add(self, out, rv):
        if rv:
            self.parts.append('<g class="rv">' + ''.join(out) + '</g>')
        else:
            self.parts.extend(out)

    def svg(self):
        return f'<svg class="sl-svg" viewBox="0 0 500 470" role="img" aria-label="{self.aria}">' + ''.join(self.parts) + '</svg>'


def arrowhead(x1, y1, x2, y2, col, w=3):
    import math
    a = math.atan2(y2 - y1, x2 - x1); L = 13
    p1 = (x2 - L * math.cos(a - .45), y2 - L * math.sin(a - .45))
    p2 = (x2 - L * math.cos(a + .45), y2 - L * math.sin(a + .45))
    return f'<path d="M{f(p1[0])} {f(p1[1])} L{f(x2)} {f(y2)} L{f(p2[0])} {f(p2[1])}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def box(inner, aria=''):
    return f'<svg class="sl-svg" viewBox="0 0 500 470" role="img" aria-label="{aria}">{inner}</svg>'


def T(x, y, s, col=TX, size=18, anchor='middle', fam=FONT, w=700):
    return f'<text x="{f(x)}" y="{f(y)}" fill="{col}" font-family="{fam}" font-size="{size}" font-weight="{w}" text-anchor="{anchor}">{s}</text>'


def P(pts, col=OBJ, dash=False):
    s = ' '.join(f'{f(x)},{f(y)}' for x, y in pts)
    d = ' stroke-dasharray="10 7"' if dash else ''
    return f'<polygon points="{s}" fill="{col}33" stroke="{col}" stroke-width="4" stroke-linejoin="round"{d}/>'
