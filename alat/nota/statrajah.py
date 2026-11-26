"""Rajah statistik dan kebarangkalian (plot titik, carta palang, carta pai, gambar rajah Venn, gambar rajah pokok, gundalan).
Guna: import statrajah as SR. Koordinat skrin dalam viewBox 500x470."""
import math
from graf import T, L, head, arrow, TX, MU, MU3, AX, NAV, SURF, BD, TR, PA, PU, AM, PK, GR, RD, mn, it

PAL = [TR, PK, GR, AM, PU, PA, RD]


def dotplot(x0, x1, y, counts, labels=None, col=TR, gap=None, r=7, title=''):
    """Plot titik: counts = senarai bilangan bagi setiap nilai berturutan. Pulang svg."""
    n = len(counts)
    gap = gap or (x1 - x0) / max(n - 1, 1)
    o = L((x0 - 20, y), (x0 + gap * (n - 1) + 20, y), AX, 2.5)
    for i, c in enumerate(counts):
        X = x0 + gap * i
        o += L((X, y - 5), (X, y + 5), AX, 2) + T(X, y + 20, labels[i] if labels else mn(i), MU, 15, 'middle', 600)
        for k in range(c):
            o += f'<circle cx="{X:.1f}" cy="{y - 16 - k * (2 * r + 4):.1f}" r="{r}" fill="{col}"/>'
    if title:
        o += T((x0 + x0 + gap * (n - 1)) / 2, y + 46, title, MU3, 15)
    return o


def barchart(bx, labels, values, ymax, ystep, ylab='Kekerapan', xlab='', cols=None, horizontal=False, fs=13, vlabels=False):
    L_, T_, R_, B_ = bx
    o = ''
    n = len(values)
    if not horizontal:
        sy = (B_ - T_) / ymax
        k = 0
        while k <= ymax + 1e-9:
            Y = B_ - k * sy
            o += L((L_, Y), (R_, Y), '#1E2A40', 1.2) + T(L_ - 8, Y, mn(k), MU, fs, 'end', 600)
            k += ystep
        w = (R_ - L_) / n
        for i, (lb, v) in enumerate(zip(labels, values)):
            c = (cols or PAL)[i % len(cols or PAL)]
            x = L_ + w * i + w * .18
            o += f'<rect x="{x:.1f}" y="{B_ - v * sy:.1f}" width="{w * .64:.1f}" height="{v * sy:.1f}" fill="{c}" rx="3"/>'
            o += T(L_ + w * (i + .5), B_ + 16, lb, MU3, fs, 'middle', 600)
            if vlabels:
                o += T(L_ + w * (i + .5), B_ - v * sy - 12, mn(v), TX, fs)
        o += L((L_, B_), (R_ + 8, B_), AX, 2.5) + L((L_, B_), (L_, T_ - 10), AX, 2.5)
        o += T(L_ - 4, T_ - 24, ylab, MU3, 14, 'start') + (T((L_ + R_) / 2, B_ + 38, xlab, MU3, 14) if xlab else '')
    else:
        sx = (R_ - L_) / ymax
        k = 0
        while k <= ymax + 1e-9:
            X = L_ + k * sx
            o += L((X, T_), (X, B_), '#1E2A40', 1.2) + T(X, B_ + 16, mn(k), MU, fs, 'middle', 600)
            k += ystep
        h = (B_ - T_) / n
        for i, (lb, v) in enumerate(zip(labels, values)):
            c = (cols or PAL)[i % len(cols or PAL)]
            y = T_ + h * i + h * .2
            o += f'<rect x="{L_:.1f}" y="{y:.1f}" width="{v * sx:.1f}" height="{h * .6:.1f}" fill="{c}" rx="3"/>'
            o += T(L_ - 8, T_ + h * (i + .5), lb, MU3, fs, 'end', 600)
        o += L((L_, B_), (R_ + 8, B_), AX, 2.5) + L((L_, B_), (L_, T_ - 6), AX, 2.5)
        o += (T((L_ + R_) / 2, B_ + 38, xlab, MU3, 14) if xlab else '')
    return o


def pie(cx, cy, r, items, fs=14):
    """items = [(label, darjah)]; mula dari atas, ikut arah jam."""
    o = ''
    a = -90
    for i, (lb, d) in enumerate(items):
        c = PAL[i % len(PAL)]
        a2 = a + d
        x1, y1 = cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a))
        x2, y2 = cx + r * math.cos(math.radians(a2)), cy + r * math.sin(math.radians(a2))
        lg = 1 if d > 180 else 0
        o += f'<path d="M{cx} {cy} L{x1:.1f} {y1:.1f} A{r} {r} 0 {lg} 1 {x2:.1f} {y2:.1f} Z" fill="{c}" fill-opacity=".75" stroke="{NAV}" stroke-width="2"/>'
        am = math.radians(a + d / 2)
        o += T(cx + r * .62 * math.cos(am), cy + r * .62 * math.sin(am) - 8, lb, TX, fs) + T(cx + r * .62 * math.cos(am), cy + r * .62 * math.sin(am) + 10, f'{d}°', TX, fs - 1)
        a = a2
    return o


def venn(bx, univ, inA, labA='A', col=PK):
    """Gambar rajah Venn satu set. univ = semua unsur, inA = unsur dalam A."""
    L_, T_, R_, B_ = bx
    o = f'<rect x="{L_}" y="{T_}" width="{R_ - L_}" height="{B_ - T_}" fill="none" stroke="{TX}" stroke-width="2.5" rx="6"/>' + T(L_ - 12, T_ + 6, 'ξ', TX, 20)
    cx, cy = L_ + (R_ - L_) * .6, (T_ + B_) / 2
    rx, ry = (R_ - L_) * .28, (B_ - T_) * .36
    o += f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{col}22" stroke="{col}" stroke-width="3"/>' + T(cx - rx * .75, cy - ry * .95, labA, col, 18)
    ins = [u for u in univ if u in inA]
    outs = [u for u in univ if u not in inA]
    for i, u in enumerate(ins):
        ang = 2 * math.pi * i / max(len(ins), 1)
        rr = .45 if len(ins) > 1 else 0
        o += f'<circle cx="{cx + rx * rr * math.cos(ang) - 12:.1f}" cy="{cy + ry * rr * math.sin(ang):.1f}" r="3.5" fill="{TX}"/>' + T(cx + rx * rr * math.cos(ang) + 4, cy + ry * rr * math.sin(ang), mn(u), TX, 15, 'start')
    # unsur luar di sepanjang tepi kiri dan bawah
    spots = []
    for k in range(len(outs)):
        if k % 2 == 0:
            spots.append((L_ + 30, T_ + 40 + (k // 2) * ((B_ - T_ - 70) / max((len(outs) + 1) // 2 - 1, 1))))
        else:
            spots.append((L_ + 30 + (R_ - L_) * .17, T_ + 55 + (k // 2) * ((B_ - T_ - 80) / max(len(outs) // 2 - 1, 1))))
    for (x, y), u in zip(spots, outs):
        o += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.5" fill="{TX}"/>' + T(x + 8, y, mn(u), TX, 15, 'start')
    return o


def tree(x0, y0, root, leaves, dy=60, col=TR, lab_a='', lab_b='', pairs=True, w=110):
    """Gambar rajah pokok satu cabang: root → leaves. Pulang svg."""
    n = len(leaves)
    ys = [y0 + (i - (n - 1) / 2) * dy for i in range(n)]
    o = f'<rect x="{x0 - 24}" y="{y0 - 20}" width="48" height="40" rx="6" fill="{SURF}" stroke="{col}" stroke-width="2.5"/>' + T(x0, y0, root, TX, 18)
    for y, lf in zip(ys, leaves):
        o += arrow((x0 + 26, y0), (x0 + w - 26, y), col, 2.5)
        o += f'<rect x="{x0 + w - 24}" y="{y - 20}" width="48" height="40" rx="6" fill="{SURF}" stroke="{col}" stroke-width="2.5"/>' + T(x0 + w, y, lf, TX, 18)
        if pairs:
            o += T(x0 + w + 46, y, f'({root}, {lf})', TX, 17, 'start')
    if lab_a:
        o += T(x0, ys[-1] + 50, lab_a, MU3, 14)
    if lab_b:
        o += T(x0 + w, ys[-1] + 50, lab_b, MU3, 14)
    return o


def tally(n):
    """Gundalan dalam HTML: kumpulan lima dengan garis silang."""
    g5, r = divmod(n, 5)
    five = '<span style="display:inline-block;position:relative;letter-spacing:1px;margin-right:6px">||||<span style="position:absolute;left:-2px;right:-2px;top:50%;border-top:2px solid currentColor;transform:rotate(-20deg)"></span></span>'
    return five * g5 + ('|' * r)
