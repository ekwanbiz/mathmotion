# Penjana slaid NOTA ISOMOVE (Bab 11) untuk kanvas reka bentuk
import json, os, html

OUT = '/home/claude/isodesign/project'
os.makedirs(OUT, exist_ok=True)

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '11.1': ('Transformasi', C['gr']),
    '11.2': ('Translasi', C['tr']),
    '11.3': ('Pantulan', C['pa']),
    '11.4': ('Putaran', C['pu']),
    '11.5': ('Translasi, Pantulan dan Putaran sebagai Isometri', C['am']),
    '11.6': ('Simetri Putaran', C['pk']),
}

# ---------- pembantu teks ----------
def vec(a, b, col=None, size=24):
    col = col or C['tr']
    return (f'<span style="display: inline-flex; flex-direction: column; align-items: center; vertical-align: middle; '
            f'padding: 0 10px; line-height: 1.05; border-left: 3px solid {col}; border-right: 3px solid {col}; '
            f'border-radius: 12px; font-size: {size}px; font-weight: 700; color: {col}">{a}<br>{b}</span>')

def P(t, size=24):
    return f'<p style="margin: 0; font-size: {size}px; line-height: 1.5">{t}</p>'

def DEF(t, col):
    return (f'<div style="padding: 18px 22px; border-radius: 18px; background: {col}1A; border: 2px solid {col}">'
            f'<p style="margin: 0; font-size: 25px; line-height: 1.5">{t}</p></div>')

def BUL(items, col):
    lis = ''.join(f'<li style="display: flex; gap: 14px; align-items: flex-start"><span style="flex: none; width: 12px; height: 12px; margin-top: 13px; border-radius: 6px; background: {col}"></span><span>{i}</span></li>' for i in items)
    return f'<ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 23px; line-height: 1.45">{lis}</ul>'

def STEPS(items, col):
    lis = ''.join(
        f'<li style="display: flex; gap: 14px; align-items: flex-start; padding: 12px 16px; border-radius: 16px; background: {SURF}; border: 1px solid {BD}">'
        f'<span style="flex: none; width: 36px; height: 36px; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: {col}; color: {BG}; font-weight: 800; font-size: 18px">{n}</span>'
        f'<span style="font-size: 21px; line-height: 1.45">{t}</span></li>' for n, t in enumerate(items, 1))
    return f'<ol style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px">{lis}</ol>'

def ANS(t):
    return (f'<div style="padding: 12px 18px; border-radius: 14px; background: {C["gr"]}1A; border: 2px solid {C["gr"]}; font-size: 22px; font-weight: 700">'
            f'<span style="color: {C["gr"]}; letter-spacing: 0.08em; font-size: 15px; margin-right: 10px">JAWAPAN</span>{t}</div>')

def NOTE(t):
    return (f'<div style="padding: 12px 16px; border-radius: 14px; background: {C["am"]}14; border: 1px solid {C["am"]}66; font-size: 19px; line-height: 1.45">'
            f'<b style="color: {C["am"]}">Ingat:</b> {t}</div>')

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
HFONT = 'font-family="Space Grotesk, sans-serif"'

class Grid:
    """Satah Cartes. x0..x1, y0..y1 dalam unit; u = piksel seunit."""
    def __init__(self, x0, x1, y0, y1, u, W=500, H=470, axes=True, labels=True, step=1):
        self.x0, self.x1, self.y0, self.y1, self.u = x0, x1, y0, y1, u
        gw, gh = (x1 - x0) * u, (y1 - y0) * u
        self.ox = (W - gw) / 2 - x0 * u + 8
        self.oy = (H - gh) / 2 + y1 * u - 6
        self.W, self.H, self.axes, self.labels, self.step = W, H, axes, labels, step
    def X(self, x): return round(self.ox + x * self.u, 1)
    def Y(self, y): return round(self.oy - y * self.u, 1)
    def base(self):
        s = []
        for x in range(self.x0, self.x1 + 1):
            s.append(f'<line x1="{self.X(x)}" y1="{self.Y(self.y0)}" x2="{self.X(x)}" y2="{self.Y(self.y1)}" stroke="#1E2A40" stroke-width="1.5"/>')
        for y in range(self.y0, self.y1 + 1):
            s.append(f'<line x1="{self.X(self.x0)}" y1="{self.Y(y)}" x2="{self.X(self.x1)}" y2="{self.Y(y)}" stroke="#1E2A40" stroke-width="1.5"/>')
        if self.axes:
            ax = 0 if self.x0 <= 0 <= self.x1 else self.x0
            ay = 0 if self.y0 <= 0 <= self.y1 else self.y0
            s.append(f'<line x1="{self.X(self.x0)}" y1="{self.Y(ay)}" x2="{self.X(self.x1) + 10}" y2="{self.Y(ay)}" stroke="{MU}" stroke-width="2.5"/>')
            s.append(f'<line x1="{self.X(ax)}" y1="{self.Y(self.y0)}" x2="{self.X(ax)}" y2="{self.Y(self.y1) - 10}" stroke="{MU}" stroke-width="2.5"/>')
            s.append(f'<text x="{self.X(self.x1) + 14}" y="{self.Y(ay) + 5}" fill="{MU}" {FONT} font-size="16" font-style="italic" font-weight="600">x</text>')
            s.append(f'<text x="{self.X(ax) - 5}" y="{self.Y(self.y1) - 16}" fill="{MU}" {FONT} font-size="16" font-style="italic" font-weight="600">y</text>')
            if self.labels:
                for x in range(self.x0, self.x1 + 1, self.step):
                    if x == ax and self.x0 < 0: continue
                    s.append(f'<text x="{self.X(x)}" y="{self.Y(ay) + 22}" fill="{MU}" {FONT} font-size="14" font-weight="600" text-anchor="middle">{x if x >= 0 else "−" + str(-x)}</text>')
                for y in range(self.y0, self.y1 + 1, self.step):
                    if y == ay: continue
                    s.append(f'<text x="{self.X(ax) - 10}" y="{self.Y(y) + 5}" fill="{MU}" {FONT} font-size="14" font-weight="600" text-anchor="end">{y if y >= 0 else "−" + str(-y)}</text>')
        return ''.join(s)
    def poly(self, pts, col, dash=False, fill=True):
        p = ' '.join(f'{self.X(x)},{self.Y(y)}' for x, y in pts)
        d = ' stroke-dasharray="10 7"' if dash else ''
        f = f'{col}33' if fill else 'none'
        return f'<polygon points="{p}" fill="{f}" stroke="{col}" stroke-width="3.5" stroke-linejoin="round"{d}/>'
    def pt(self, x, y, col, lab=None, dx=-26, dy=26, r=7):
        s = f'<circle cx="{self.X(x)}" cy="{self.Y(y)}" r="{r}" fill="{col}"/>'
        if lab: s += f'<text x="{self.X(x) + dx}" y="{self.Y(y) + dy}" fill="{col}" {HFONT} font-size="20" font-weight="700">{lab}</text>'
        return s
    def line(self, a, b, col=TX, dash=True, w=3, op=1):
        d = ' stroke-dasharray="7 6"' if dash else ''
        return f'<line x1="{self.X(a[0])}" y1="{self.Y(a[1])}" x2="{self.X(b[0])}" y2="{self.Y(b[1])}" stroke="{col}" stroke-width="{w}"{d} opacity="{op}"/>'
    def arrow(self, a, b, col=TX, w=3, dash=False):
        x1, y1, x2, y2 = self.X(a[0]), self.Y(a[1]), self.X(b[0]), self.Y(b[1])
        return arrow_px(x1, y1, x2, y2, col, w, dash)
    def text(self, x, y, t, col=TX, size=16, anchor='middle', dx=0, dy=0):
        return f'<text x="{self.X(x) + dx}" y="{self.Y(y) + dy}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="{anchor}">{t}</text>'

def arrow_px(x1, y1, x2, y2, col=TX, w=3, dash=False):
    import math
    ang = math.atan2(y2 - y1, x2 - x1); L = 14
    ex, ey = x2 - 4 * math.cos(ang), y2 - 4 * math.sin(ang)
    a1 = (round(x2 - L * math.cos(ang - 0.45), 1), round(y2 - L * math.sin(ang - 0.45), 1))
    a2 = (round(x2 - L * math.cos(ang + 0.45), 1), round(y2 - L * math.sin(ang + 0.45), 1))
    d = ' stroke-dasharray="7 6"' if dash else ''
    return (f'<line x1="{x1}" y1="{y1}" x2="{round(ex,1)}" y2="{round(ey,1)}" stroke="{col}" stroke-width="{w}" stroke-linecap="round"{d}/>'
            f'<path d="M{a1[0]} {a1[1]} L{x2} {y2} L{a2[0]} {a2[1]}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def svg(inner, label, W=500, H=470):
    return (f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}" '
            f'style="flex: none; background: {NAV}; border-radius: 22px; border: 1px solid {BD}">{inner}</svg>')

def T(x, y, t, col=TX, size=18, anchor='middle', weight=700, font=FONT):
    return f'<text x="{x}" y="{y}" fill="{col}" {font} font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{t}</text>'

def tick(x, y, col=C['gr']):
    return f'<circle cx="{x}" cy="{y}" r="16" fill="{col}"/><path d="M{x-7} {y} l5 5 9-10" fill="none" stroke="{BG}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'

def cross(x, y, col=C['rd']):
    return f'<circle cx="{x}" cy="{y}" r="16" fill="{col}"/><path d="M{x-6} {y-6} l12 12 M{x+6} {y-6} l-12 12" stroke="{BG}" stroke-width="3.5" stroke-linecap="round"/>'

# ---------- rajah setiap slaid ----------
def d_111():
    s = (f'<polygon points="70,330 190,330 70,170" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="4" stroke-linejoin="round"/>'
         + arrow_px(215, 250, 290, 250, TX, 4)
         + f'<polygon points="320,330 440,330 320,170" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="4" stroke-linejoin="round" stroke-dasharray="10 7"/>'
         + T(120, 380, 'Objek', C['tr'], 22) + T(370, 380, 'Imej', C['pa'], 22)
         + T(252, 230, 'transformasi', MU, 15))
    return svg(s, 'Objek berwarna biru dipetakan kepada imej berwarna oren')

def d_112():
    g = Grid(0, 9, 0, 7, 48)
    A, B, Cc = (1, 1), (4, 1), (1, 4)
    A2, B2, C2 = (5, 3), (8, 3), (5, 6)
    s = g.base() + g.poly([A, B, Cc], C['tr']) + g.poly([A2, B2, C2], C['pa'], dash=True)
    s += g.pt(*A, C['tr'], 'A', -26, 26) + g.pt(*B, C['tr'], 'B', 4, 26) + g.pt(*Cc, C['tr'], 'C', -26, -6)
    s += g.pt(*A2, C['pa'], 'A′', -30, 26) + g.pt(*B2, C['pa'], 'B′', 4, 26) + g.pt(*C2, C['pa'], 'C′', -30, -6)
    return svg(s, 'Segi tiga ABC dan imejnya A′B′C′')

def d_113():
    s = ''
    # (a) kongruen: segi tiga sama, diputar
    s += f'<polygon points="40,110 120,110 40,50" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<polygon points="200,50 200,130 260,50" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += T(330, 96, 'Kongruen', C['gr'], 18, 'start') + tick(310, 90)
    # (b) tidak kongruen: saiz berbeza
    s += f'<rect x="40" y="195" width="60" height="60" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5"/>'
    s += f'<rect x="170" y="175" width="100" height="100" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5"/>'
    s += T(330, 236, 'Tidak', C['rd'], 18, 'start') + cross(310, 230)
    # (c) kongruen: bentuk L terbalik
    s += f'<path d="M40 330 h30 v60 h40 v30 h-70 z" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<path d="M270 330 h-30 v60 h-40 v30 h70 z" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += T(330, 386, 'Kongruen', C['gr'], 18, 'start') + tick(310, 380)
    s += f'<line x1="20" y1="155" x2="480" y2="155" stroke="{BD}" stroke-width="2"/><line x1="20" y1="300" x2="480" y2="300" stroke="{BD}" stroke-width="2"/>'
    return svg(s, 'Tiga pasangan bentuk: dua kongruen, satu tidak kongruen')

def d_114():
    s = T(125, 44, 'Isometri', C['gr'], 20) + T(375, 44, 'Bukan isometri', C['rd'], 20)
    s += f'<line x1="250" y1="20" x2="250" y2="450" stroke="{BD}" stroke-width="2"/>'
    s += f'<polygon points="40,230 110,230 40,130" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<polygon points="210,230 140,230 210,130" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5" stroke-linejoin="round" stroke-dasharray="9 6"/>'
    s += T(125, 290, 'Saiz sama', TX, 17)
    s += f'<polygon points="280,230 320,230 280,175" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" stroke-linejoin="round"/>'
    s += f'<polygon points="340,330 460,330 340,165" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5" stroke-linejoin="round" stroke-dasharray="9 6"/>'
    s += T(375, 380, 'Saiz berubah', TX, 17)
    return svg(s, 'Kiri: imej sama saiz, isometri. Kanan: imej lebih besar, bukan isometri')

def d_121():
    g = Grid(0, 9, 0, 7, 48, axes=False, labels=False)
    O = [(1, 1), (3, 1), (1, 4)]; I = [(x + 5, y + 2) for x, y in O]
    s = g.base() + g.poly(O, C['tr']) + g.poly(I, C['pa'], dash=True)
    for a, b in zip(O, I): s += g.arrow(a, b, TX, 3)
    s += g.text(4.5, 0.3, 'sama panjang, sama arah', MU, 15)
    return svg(s, 'Setiap bucu bergerak dengan anak panah yang sama panjang dan sama arah')

def d_122():
    g = Grid(0, 8, 0, 6, 52)
    a, b = (2, 5), (5, 3)
    s = g.base() + g.line(a, (5, 5), C['tr'], False, 4) + g.arrow((5, 5), b, C['pa'], 4)
    s += g.arrow(a, b, TX, 3, True)
    s += g.pt(*a, TX, 'P', -26, -8) + g.pt(*b, TX, 'P′', 8, 24)
    s += g.text(3.5, 5, '3 ke kanan', C['tr'], 17, dy=-12) + g.text(5, 4, '2 ke bawah', C['pa'], 17, 'start', dx=12)
    return svg(s, 'Vektor translasi 3 ke kanan dan 2 ke bawah')

def d_123():
    g = Grid(0, 8, 0, 6, 52)
    a, b = (1, 5), (5, 2)
    s = g.base() + g.line(a, (5, 5), C['tr'], False, 4) + g.arrow((5, 5), b, C['pa'], 4)
    s += g.pt(*a, C['tr'], 'A', -26, -8) + g.pt(*b, C['pa'], 'A′', 10, 26)
    s += g.text(3, 5, '4 unit kanan', C['tr'], 16, dy=-12) + g.text(5, 3.5, '3 unit bawah', C['pa'], 16, 'start', dx=12)
    return svg(s, 'A ke A′: 4 unit ke kanan dan 3 unit ke bawah')

def d_124():
    g = Grid(0, 8, 0, 7, 52)
    O = [(1, 2), (3, 2), (1, 4)]; I = [(5, 4), (7, 4), (5, 6)]
    s = g.base() + g.poly(O, C['tr']) + g.poly(I, C['am'], dash=True)
    s += g.line((1, 2), (5, 2), TX, True, 2.5, 0.8) + g.arrow((5, 2), (5, 4), TX, 2.5, True)
    s += g.pt(1, 2, C['tr'], 'P', -26, 24) + g.pt(3, 2, C['tr'], 'Q', 6, 24) + g.pt(1, 4, C['tr'], 'R', -26, -6)
    s += g.pt(5, 4, C['am'], 'P′', -32, 24) + g.pt(7, 4, C['am'], 'Q′', 6, 24) + g.pt(5, 6, C['am'], 'R′', -32, -6)
    return svg(s, 'Segi tiga PQR dan imejnya P′Q′R′ selepas translasi 4 ke kanan dan 2 ke atas')

def d_125():
    g = Grid(0, 8, 0, 6, 52)
    s = g.base() + g.arrow((6, 5), (3, 4), C['pk'], 3.5, True)
    s += g.pt(3, 4, C['tr'], 'Q(3, 4)', -40, 30) + g.pt(6, 5, C['am'], 'Q′(6, 5)', -20, -14)
    s += g.text(4.5, 4.5, 'arah songsang', C['pk'], 15, dy=-14)
    return svg(s, 'Dari imej Q′(6, 5) bergerak songsang ke objek Q(3, 4)')

def d_131():
    g = Grid(0, 9, 0, 7, 48, labels=False)
    O = [(1, 1), (3, 1), (1, 5)]; I = [(9 - x, y) for x, y in O]
    s = g.base() + f'<line x1="{g.X(4.5)}" y1="{g.Y(-0.2)}" x2="{g.X(4.5)}" y2="{g.Y(7.2)}" stroke="{C["pa"]}" stroke-width="4"/>'
    s += g.poly(O, C['tr']) + g.poly(I, C['pa'], dash=True)
    s += g.line((1, 5), (8, 5), TX, True, 2.5, 0.75)
    s += g.text(2.75, 5, '3.5 unit', TX, 15, dy=-10) + g.text(6.25, 5, '3.5 unit', TX, 15, dy=-10)
    s += g.text(4.5, 7, 'paksi pantulan', C['pa'], 15, dy=-10)
    return svg(s, 'Segi tiga dan imejnya pada jarak yang sama dari paksi pantulan')

def d_132():
    F = 'h70 v18 h-52 v26 h40 v18 h-40 v58 h-18 z'
    s = f'<line x1="250" y1="40" x2="250" y2="420" stroke="{C["pa"]}" stroke-width="4"/>'
    s += f'<path d="M110 120 {F}" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" stroke-linejoin="round" transform="translate(0 40) scale(1.4) translate(-40 -60)"/>'
    s += f'<g transform="translate(500 0) scale(-1 1)"><path d="M110 120 {F}" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3.5" stroke-linejoin="round" stroke-dasharray="9 6" transform="translate(0 40) scale(1.4) translate(-40 -60)"/></g>'
    s += f'<circle cx="250" cy="370" r="9" fill="{C["am"]}"/>' + T(262, 400, 'titik pada paksi tidak berubah', C['am'], 15, 'start')
    s += T(130, 360, 'Objek', C['tr'], 20) + T(370, 360, 'Imej (terbalik)', C['pa'], 20)
    return svg(s, 'Huruf F dan pantulannya yang terbalik')

def d_133():
    g = Grid(-5, 5, -4, 4, 44)
    s = g.base()
    s += g.line((3, 2), (3, -2), C['pa'], True, 2.5) + g.line((3, 2), (-3, 2), C['pu'], True, 2.5)
    s += g.pt(3, 2, C['tr'], 'P(3, 2)', 8, -10) + g.pt(3, -2, C['pa'], '(3, −2)', 8, 26) + g.pt(-3, 2, C['pu'], '(−3, 2)', -74, -10)
    s += g.text(3, -3.4, 'paksi-x', C['pa'], 15) + g.text(-3, 3.2, 'paksi-y', C['pu'], 15)
    return svg(s, 'P(3, 2) dipantulkan pada paksi-x menjadi (3, −2) dan pada paksi-y menjadi (−3, 2)')

def d_134():
    g = Grid(0, 9, 0, 5, 48)
    s = g.base() + f'<line x1="{g.X(5)}" y1="{g.Y(-0.3)}" x2="{g.X(5)}" y2="{g.Y(5.3)}" stroke="{C["pa"]}" stroke-width="4"/>'
    s += g.text(5, 5.3, 'x = 5', C['pa'], 16, 'start', dx=8, dy=4)
    s += g.line((2, 3), (8, 3), TX, True, 2.5, 0.75)
    s += g.text(3.5, 3, '3 unit', TX, 15, dy=-10) + g.text(6.5, 3, '3 unit', TX, 15, dy=-10)
    s += g.pt(2, 3, C['tr'], 'P', -10, 30, 8) + g.pt(8, 3, C['gr'], 'P′', -10, 30, 8)
    return svg(s, 'P(2, 3) dipantulkan pada garis x = 5 menjadi P′(8, 3)')

def d_135():
    g = Grid(0, 9, 0, 7, 48, labels=False)
    A, A2 = (2, 2), (6, 6)
    s = g.base() + g.line(A, A2, TX, True, 2.5, 0.8)
    s += f'<line x1="{g.X(1)}" y1="{g.Y(7)}" x2="{g.X(8)}" y2="{g.Y(0)}" stroke="{C["pa"]}" stroke-width="4"/>'
    mx, my = g.X(4), g.Y(4)
    s += f'<path d="M{mx + 12} {my - 12} l12 12 l-12 12" fill="none" stroke="{TX}" stroke-width="2.5" transform="rotate(-45 {mx} {my}) translate(-12 0)"/>'
    s += f'<circle cx="{mx}" cy="{my}" r="6" fill="{TX}"/>'
    s += g.pt(*A, C['tr'], 'A', -26, 24, 8) + g.pt(*A2, C['pa'], 'A′', 10, -8, 8)
    s += g.text(7.6, 1, 'paksi pantulan', C['pa'], 15, 'end')
    return svg(s, 'Paksi pantulan ialah pembahagi dua sama serenjang bagi garis AA′')

def d_141():
    cx, cy = 250, 270
    s = f'<polygon points="290,270 400,270 290,190" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="4" stroke-linejoin="round"/>'
    s += f'<polygon points="250,230 250,120 170,230" fill="{C["pu"]}33" stroke="{C["pu"]}" stroke-width="4" stroke-linejoin="round" stroke-dasharray="10 7" transform="translate(0 0)"/>'
    s += f'<path d="M380 250 A130 130 0 0 0 270 140" fill="none" stroke="{TX}" stroke-width="3" stroke-dasharray="7 6"/>'
    s += arrow_px(285, 143, 268, 140, TX, 3)
    s += f'<circle cx="{cx}" cy="{cy}" r="9" fill="{C["am"]}"/>' + T(cx, cy + 36, 'pusat putaran', C['am'], 16)
    s += T(360, 320, 'Objek', C['tr'], 20) + T(150, 110, 'Imej', C['pu'], 20)
    return svg(s, 'Segi tiga diputar 90 darjah lawan arah jam pada pusat putaran')

def d_142():
    s = T(125, 60, 'Ikut arah jam', TX, 19) + T(375, 60, 'Lawan arah jam', TX, 19)
    s += f'<circle cx="125" cy="180" r="70" fill="none" stroke="{BD}" stroke-width="3"/><circle cx="375" cy="180" r="70" fill="none" stroke="{BD}" stroke-width="3"/>'
    s += f'<path d="M125 110 A70 70 0 0 1 195 180" fill="none" stroke="{C["pu"]}" stroke-width="6" stroke-linecap="round"/>' + arrow_px(190, 160, 195, 182, C['pu'], 6)
    s += f'<path d="M375 110 A70 70 0 0 0 305 180" fill="none" stroke="{C["am"]}" stroke-width="6" stroke-linecap="round"/>' + arrow_px(310, 160, 305, 182, C['am'], 6)
    s += f'<circle cx="125" cy="180" r="7" fill="{TX}"/><circle cx="375" cy="180" r="7" fill="{TX}"/>'
    s += T(250, 315, 'Sudut biasa:', MU, 17)
    for i, (t, x) in enumerate([('90°', 130), ('180°', 250), ('270°', 370)]):
        s += f'<rect x="{x-50}" y="340" width="100" height="56" rx="14" fill="{SURF}" stroke="{BD}" stroke-width="2"/>' + T(x, 377, t, TX, 24, font=HFONT)
    return svg(s, 'Arah ikut jam dan lawan arah jam, serta sudut 90, 180 dan 270 darjah')

def d_143():
    cx, cy = 230, 260
    s = ''.join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{BD}" stroke-width="2" stroke-dasharray="6 6"/>' for r in (90, 170))
    s += f'<line x1="{cx}" y1="{cy}" x2="{cx+170}" y2="{cy}" stroke="{C["tr"]}" stroke-width="3"/>'
    s += f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy-170}" stroke="{C["pu"]}" stroke-width="3"/>'
    s += f'<circle cx="{cx+170}" cy="{cy}" r="8" fill="{C["tr"]}"/>' + T(cx + 170, cy + 32, 'A', C['tr'], 22, font=HFONT)
    s += f'<circle cx="{cx}" cy="{cy-170}" r="8" fill="{C["pu"]}"/>' + T(cx + 26, cy - 172, 'A′', C['pu'], 22, font=HFONT)
    s += f'<circle cx="{cx}" cy="{cy}" r="9" fill="{C["am"]}"/>' + T(cx - 18, cy + 30, 'O', C['am'], 22, font=HFONT)
    s += T(cx + 85, cy - 10, 'OA', TX, 16) + T(cx - 30, cy - 85, 'OA′', TX, 16)
    s += T(250, 455, 'OA = OA′', C['am'], 20, font=HFONT)
    return svg(s, 'A dan A′ berada pada jarak yang sama dari pusat O')

def d_144():
    g = Grid(-4, 4, -4, 4, 46)
    s = g.base()
    ox, oy = g.X(0), g.Y(0)
    s += g.line((0, 0), (3, 1), C['tr'], False, 3) + g.line((0, 0), (1, -3), C['pu'], False, 3)
    s += f'<path d="M{g.X(1.9)} {g.Y(0.63)} A{round(g.u*2,1)} {round(g.u*2,1)} 0 0 1 {g.X(0.63)} {g.Y(-1.9)}" fill="none" stroke="{TX}" stroke-width="2.5" stroke-dasharray="6 5"/>'
    s += g.text(2.2, -1.5, '90°', TX, 17)
    s += g.pt(3, 1, C['tr'], 'A(3, 1)', 8, -10) + g.pt(1, -3, C['pu'], 'A′(1, −3)', 10, 8) + g.pt(0, 0, C['am'], 'O', -24, -10)
    return svg(s, 'A(3, 1) diputar 90 darjah ikut arah jam pada asalan menjadi A′(1, −3)')

def d_145():
    g = Grid(0, 9, 0, 7, 48, labels=False)
    # pusat (4,3), putaran 90 ikut arah jam: (x,y)->(4+(y-3), 3-(x-4))
    A, B = (2, 6), (7, 6)
    rot = lambda p: (4 + (p[1] - 3), 3 - (p[0] - 4))
    A2, B2 = rot(A), rot(B)  # (7,5) (7,0)
    s = g.base() + g.line(A, A2, TX, True, 2.5, 0.8) + g.line(B, B2, TX, True, 2.5, 0.8)
    # pembahagi dua sama serenjang: lalu (4,3)
    s += f'<line x1="{g.X(1)}" y1="{g.Y(-2.5 + 3)}" x2="{g.X(8)}" y2="{g.Y(3 + 2.5*0 + 2*1.25)}" stroke="none"/>'
    m1 = ((A[0] + A2[0]) / 2, (A[1] + A2[1]) / 2)
    m2 = ((B[0] + B2[0]) / 2, (B[1] + B2[1]) / 2)
    import math
    def ext(m, c, k=1.9):
        dx, dy = c[0] - m[0], c[1] - m[1]
        return (m[0] - (k - 1) * dx * 0.6, m[1] - (k - 1) * dy * 0.6), (c[0] + dx * 0.8, c[1] + dy * 0.8)
    for m in (m1, m2):
        p, q = ext(m, (4, 3))
        s += g.line(p, q, C['pu'], False, 3.5)
    s += g.pt(*A, C['tr'], 'A', -24, -8, 8) + g.pt(*B, C['tr'], 'B', 8, -8, 8)
    s += g.pt(*A2, C['pa'], 'A′', 10, 6, 8) + g.pt(*B2, C['pa'], 'B′', 10, -6, 8)
    s += f'<circle cx="{g.X(4)}" cy="{g.Y(3)}" r="11" fill="{C["am"]}" stroke="{BG}" stroke-width="3"/>'
    s += g.text(4, 3, 'pusat', C['am'], 16, 'end', dx=-16, dy=26)
    return svg(s, 'Pembahagi dua sama serenjang bagi AA′ dan BB′ bersilang di pusat putaran')

def d_151():
    s = f'<line x1="70" y1="150" x2="230" y2="150" stroke="{C["tr"]}" stroke-width="6" stroke-linecap="round"/>'
    s += f'<circle cx="70" cy="150" r="9" fill="{C["tr"]}"/><circle cx="230" cy="150" r="9" fill="{C["tr"]}"/>'
    s += T(70, 128, 'A', C['tr'], 22, font=HFONT) + T(230, 128, 'B', C['tr'], 22, font=HFONT) + T(150, 186, '4 unit', TX, 19)
    s += f'<line x1="300" y1="380" x2="420" y2="270" stroke="{C["pu"]}" stroke-width="6" stroke-linecap="round" stroke-dasharray="12 8"/>'
    s += f'<circle cx="300" cy="380" r="9" fill="{C["pu"]}"/><circle cx="420" cy="270" r="9" fill="{C["pu"]}"/>'
    s += T(284, 412, 'A′', C['pu'], 22, font=HFONT) + T(444, 266, 'B′', C['pu'], 22, font=HFONT) + T(395, 350, '4 unit', TX, 19)
    s += arrow_px(240, 200, 290, 260, MU, 3, True)
    s += T(250, 450, 'AB = A′B′', C['am'], 24, font=HFONT)
    return svg(s, 'Panjang AB sama dengan panjang A′B′ selepas transformasi')

def d_153():
    s = ''
    for r in range(4):
        for c in range(5):
            x, y = 40 + c * 88, 40 + r * 100
            col = [C['tr'], C['pa'], C['pu'], C['am']][(r + c) % 4]
            s += f'<path d="M{x} {y+60} l30 -50 l30 50 l-15 0 l0 25 l-30 0 l0 -25 z" fill="{col}33" stroke="{col}" stroke-width="3" stroke-linejoin="round"/>'
    return svg(s, 'Corak jubin daripada bentuk yang ditranslasikan berulang kali')

def d_161():
    cx, cy = 250, 240
    def sq(rot, col, dash):
        d = ' stroke-dasharray="9 6"' if dash else ''
        return f'<rect x="{cx-90}" y="{cy-90}" width="180" height="180" rx="6" fill="{col}22" stroke="{col}" stroke-width="4"{d} transform="rotate({rot} {cx} {cy})"/>'
    s = sq(30, C['pu'], True) + sq(0, C['pk'], False)
    s += f'<circle cx="{cx-90}" cy="{cy-90}" r="9" fill="{C["am"]}"/><circle cx="{cx}" cy="{cy}" r="7" fill="{TX}"/>'
    s += f'<path d="M{cx+120} {cy-60} A135 135 0 0 1 {cx+130} {cy+40}" fill="none" stroke="{TX}" stroke-width="3" stroke-dasharray="7 6"/>'
    s += T(250, 440, 'Selepas diputar 90°, kelihatan sama', TX, 19)
    return svg(s, 'Segi empat sama kelihatan sama selepas diputar 90 darjah')

def d_162():
    s = ''
    cells = [(125, 120, 'sq', '4'), (375, 120, 'tri', '3'), (125, 330, 'rect', '2'), (375, 330, 'z', '2')]
    for x, y, k, n in cells:
        if k == 'sq': s += f'<rect x="{x-50}" y="{y-60}" width="100" height="100" fill="{C["pk"]}33" stroke="{C["pk"]}" stroke-width="4"/>'
        if k == 'tri': s += f'<polygon points="{x},{y-68} {x+60},{y+36} {x-60},{y+36}" fill="{C["pk"]}33" stroke="{C["pk"]}" stroke-width="4" stroke-linejoin="round"/>'
        if k == 'rect': s += f'<rect x="{x-75}" y="{y-45}" width="150" height="72" fill="{C["pk"]}33" stroke="{C["pk"]}" stroke-width="4"/>'
        if k == 'z': s += f'<path d="M{x-50} {y-55} h100 v18 l-72 74 h72 v18 h-100 v-18 l72 -74 h-72 z" fill="{C["pk"]}33" stroke="{C["pk"]}" stroke-width="4" stroke-linejoin="round"/>'
        s += f'<rect x="{x-52}" y="{y+58}" width="104" height="38" rx="19" fill="{SURF}" stroke="{BD}" stroke-width="2"/>' + T(x, y + 84, f'Peringkat {n}', TX, 17)
    return svg(s, 'Segi empat sama peringkat 4, segi tiga sama sisi peringkat 3, segi empat tepat peringkat 2, huruf Z peringkat 2')

def d_163():
    s = ''
    # kipas 3 bilah
    x, y = 125, 125
    for a in (0, 120, 240):
        s += f'<ellipse cx="{x}" cy="{y-45}" rx="20" ry="45" fill="{C["tr"]}33" stroke="{C["tr"]}" stroke-width="3.5" transform="rotate({a} {x} {y})"/>'
    s += f'<circle cx="{x}" cy="{y}" r="12" fill="{C["tr"]}"/>' + T(x, 230, 'Kipas → 3', TX, 18)
    # bintang 5 bucu
    import math
    x, y = 375, 120
    pts = []
    for i in range(10):
        r = 70 if i % 2 == 0 else 30
        a = math.radians(-90 + i * 36)
        pts.append(f'{round(x + r * math.cos(a), 1)},{round(y + r * math.sin(a), 1)}')
    s += f'<polygon points="{" ".join(pts)}" fill="{C["am"]}33" stroke="{C["am"]}" stroke-width="3.5" stroke-linejoin="round"/>' + T(x, 230, 'Bintang → 5', TX, 18)
    # huruf S
    s += f'<text x="125" y="390" fill="{C["pa"]}33" stroke="{C["pa"]}" stroke-width="3" {HFONT} font-size="140" font-weight="700" text-anchor="middle">S</text>' + T(125, 440, 'Huruf S → 2', TX, 18)
    # huruf L
    s += f'<path d="M345 270 h26 v96 h60 v26 h-86 z" fill="{C["gr"]}33" stroke="{C["gr"]}" stroke-width="3.5" stroke-linejoin="round"/>' + T(385, 440, 'Huruf L → 1', TX, 18)
    s += f'<line x1="20" y1="262" x2="480" y2="262" stroke="{BD}" stroke-width="2"/>'
    return svg(s, 'Kipas peringkat 3, bintang peringkat 5, huruf S peringkat 2, huruf L peringkat 1')

# ---------- jadual 11.5 ----------
def table_152():
    rows = [
        ('Bentuk dan saiz', 'Sama', 'Sama', 'Sama'),
        ('Orientasi', 'Sama', 'Terbalik (songsang sisi)', 'Berubah mengikut sudut putaran (tidak terbalik)'),
        ('Titik tidak berubah', 'Tiada', 'Titik pada paksi pantulan', 'Pusat putaran'),
        ('Maklumat diperlukan', 'Vektor translasi', 'Paksi pantulan', 'Pusat, sudut dan arah'),
    ]
    hd = ''.join(f'<th style="padding: 16px 18px; text-align: left; font-size: 22px; color: {c}; border-bottom: 2px solid {BD}">{t}</th>'
                 for t, c in [('Sifat', MU), ('Translasi', C['tr']), ('Pantulan', C['pa']), ('Putaran', C['pu'])])
    body = ''
    for r in rows:
        body += '<tr>' + f'<th style="padding: 16px 18px; text-align: left; font-size: 20px; color: {MU}; border-bottom: 1px solid {BD}">{r[0]}</th>' + \
                ''.join(f'<td style="padding: 16px 18px; font-size: 22px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r[1:]) + '</tr>'
    return (f'<table style="width: 100%; border-collapse: collapse; background: {SURF}; border-radius: 20px; overflow: hidden">'
            f'<thead><tr>{hd}</tr></thead><tbody>{body}</tbody></table>')

# ---------- senarai slaid ----------
S = []
def add(sub, kicker, title, body, diagram=None, full=None):
    S.append(dict(sub=sub, kicker=kicker, title=title, body=body, diagram=diagram, full=full))

g, b, o, p, a, k = C['gr'], C['tr'], C['pa'], C['pu'], C['am'], C['pk']

# 11.1
add('11.1', 'DEFINISI', 'Apa itu transformasi?',
    DEF('<b>Transformasi</b> ialah pemetaan satu-satu setiap titik pada <b>objek</b> kepada <b>imej</b>.', g)
    + BUL(['Bentuk asal dipanggil <b>objek</b>.', 'Bentuk selepas transformasi dipanggil <b>imej</b>.', 'Transformasi boleh mengubah kedudukan, orientasi atau saiz.'], g), d_111())
add('11.1', 'KONSEP', 'Objek dan imej',
    BUL(['Titik pada objek dilabel A, B, C.', 'Titik sepadan pada imej dilabel <b>A′, B′, C′</b> (dibaca "A aksen").', 'A dipetakan kepada A′, B kepada B′, C kepada C′.'], g)
    + NOTE('Setiap titik objek mempunyai <b>satu</b> titik imej sahaja.'), d_112())
add('11.1', 'KONSEP', 'Kekongruenan',
    DEF('Dua bentuk adalah <b>kongruen</b> jika <b>bentuk dan saiznya sama</b>.', g)
    + BUL(['Kedudukan boleh berbeza.', 'Orientasi boleh berbeza (diputar atau terbalik).', 'Jika saiz berbeza, bentuk itu <b>tidak</b> kongruen.'], g)
    + P('<span style="color: #94A3B8">Tanya kelas: pasangan mana yang kongruen?</span>', 20), d_113())
add('11.1', 'DEFINISI', 'Isometri',
    DEF('<b>Isometri</b> ialah transformasi yang <b>mengekalkan bentuk dan saiz</b> objek.', g)
    + P('Translasi, pantulan dan putaran ialah isometri.')
    + NOTE('Imej yang dihasilkan oleh isometri sentiasa <b>kongruen</b> dengan objek.'), d_114())

# 11.2
add('11.2', 'DEFINISI', 'Maksud translasi',
    DEF('<b>Translasi</b> ialah transformasi yang menggerakkan setiap titik pada objek dengan <b>jarak dan arah yang sama</b>.', b)
    + BUL(['Objek "menggelongsor" tanpa berputar atau terbalik.', 'Semua anak panah dari objek ke imej selari dan sama panjang.'], b), d_121())
add('11.2', 'KONSEP', 'Vektor translasi',
    P('Translasi diwakili oleh <b>vektor translasi</b> ' + vec('a', 'b') + '.')
    + BUL([f'<b style="color: {b}">a</b> : gerakan mengufuk. Positif ke <b>kanan</b>, negatif ke <b>kiri</b>.',
           f'<b style="color: {b}">b</b> : gerakan mencancang. Positif ke <b>atas</b>, negatif ke <b>bawah</b>.'], b)
    + P('Contoh: ' + vec('3', '−2') + ' bermaksud 3 unit ke kanan, 2 unit ke bawah.'), d_122())
add('11.2', 'CONTOH BERLANGKAH', 'Menentukan vektor translasi',
    P('Titik A dipetakan kepada A′. Tentukan vektor translasi.', 23)
    + STEPS(['Kira gerakan mengufuk dari A ke A′: <b>4 unit ke kanan</b> → +4.', 'Kira gerakan mencancang: <b>3 unit ke bawah</b> → −3.', 'Tulis dalam bentuk vektor.'], b)
    + ANS('Vektor translasi = ' + vec('4', '−3', g, 20)), d_123())
add('11.2', 'CONTOH BERLANGKAH', 'Mencari imej',
    P('Segi tiga PQR ditranslasikan oleh ' + vec('4', '2') + '. Cari koordinat imej.', 23)
    + STEPS(['Tambah 4 pada koordinat-<i>x</i> (4 unit ke kanan).', 'Tambah 2 pada koordinat-<i>y</i> (2 unit ke atas).', 'P(1, 2) → P′(5, 4), Q(3, 2) → Q′(7, 4), R(1, 4) → R′(5, 6).'], b), d_124())
add('11.2', 'SIFAT', 'Sifat translasi',
    BUL(['Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Orientasi imej <b>sama</b> dengan objek.', 'Setiap titik bergerak dengan jarak dan arah yang sama.'], b)
    + P('<b>Mencari objek:</b> Q′(6, 5) ialah imej bagi Q di bawah translasi ' + vec('3', '1', b, 20) + '.', 22)
    + ANS('Q = (6 − 3, 5 − 1) = (3, 4)'), d_125())

# 11.3
add('11.3', 'DEFINISI', 'Maksud pantulan',
    DEF('<b>Pantulan</b> ialah transformasi yang memantulkan setiap titik pada objek pada satu garis yang dipanggil <b>paksi pantulan</b>.', o)
    + BUL(['Jarak objek ke paksi = jarak imej ke paksi.', 'Objek dan imej berada pada sisi bertentangan paksi.'], o), d_131())
add('11.3', 'SIFAT', 'Sifat pantulan',
    BUL(['Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Orientasi imej <b>terbalik</b> (songsang sisi).', 'Titik pada paksi pantulan <b>tidak berubah</b> kedudukan.', 'Garis yang menyambung titik objek dan imej <b>berserenjang</b> dengan paksi pantulan.'], o), d_132())
add('11.3', 'KONSEP', 'Pantulan pada paksi-x dan paksi-y',
    f'<div style="display: flex; flex-direction: column; gap: 14px">'
    f'<div style="padding: 16px 20px; border-radius: 18px; background: {SURF}; border: 2px solid {o}"><p style="margin: 0 0 6px; font-size: 17px; font-weight: 800; letter-spacing: 0.08em; color: {o}">PAKSI-X</p><p style="margin: 0; font-size: 28px; font-weight: 700">(x, y) → (x, −y)</p><p style="margin: 6px 0 0; font-size: 19px; color: {MU}">Koordinat-<i>y</i> bertukar tanda.</p></div>'
    f'<div style="padding: 16px 20px; border-radius: 18px; background: {SURF}; border: 2px solid {p}"><p style="margin: 0 0 6px; font-size: 17px; font-weight: 800; letter-spacing: 0.08em; color: {p}">PAKSI-Y</p><p style="margin: 0; font-size: 28px; font-weight: 700">(x, y) → (−x, y)</p><p style="margin: 6px 0 0; font-size: 19px; color: {MU}">Koordinat-<i>x</i> bertukar tanda.</p></div></div>', d_133())
add('11.3', 'CONTOH BERLANGKAH', 'Pantulan pada garis x = 5',
    P('Titik P(2, 3) dipantulkan pada garis x = 5. Cari koordinat imej P′.', 23)
    + STEPS(['Jarak P ke garis x = 5 ialah 5 − 2 = <b>3 unit</b>.', 'Imej berada 3 unit di sebelah lain garis: 5 + 3 = <b>8</b>.', 'Koordinat-<i>y</i> tidak berubah: <b>3</b>.'], o)
    + ANS('P′(8, 3)'), d_134())
add('11.3', 'CONTOH BERLANGKAH', 'Menentukan paksi pantulan',
    P('A′ ialah imej bagi A di bawah satu pantulan. Lukis paksi pantulan.', 23)
    + STEPS(['Sambungkan titik A dan A′.', 'Tandakan titik tengah AA′.', 'Lukis garis yang melalui titik tengah dan <b>berserenjang</b> dengan AA′.'], o)
    + NOTE('Paksi pantulan ialah <b>pembahagi dua sama serenjang</b> bagi AA′.'), d_135())

# 11.4
add('11.4', 'DEFINISI', 'Maksud putaran',
    DEF('<b>Putaran</b> ialah transformasi yang memutarkan setiap titik pada objek melalui satu sudut tertentu pada satu titik tetap yang dipanggil <b>pusat putaran</b>.', p)
    + BUL(['Semua titik diputar dengan sudut yang sama.', 'Semua titik diputar dalam arah yang sama.'], p), d_141())
add('11.4', 'KONSEP', 'Tiga maklumat putaran',
    STEPS(['<b>Pusat putaran</b>: titik tetap tempat objek diputar.', '<b>Sudut putaran</b>: contohnya 90°, 180° atau 270°.', '<b>Arah putaran</b>: ikut arah jam atau lawan arah jam.'], p)
    + NOTE('Putaran 180° tidak perlu dinyatakan arahnya kerana hasilnya sama.'), d_142())
add('11.4', 'SIFAT', 'Sifat putaran',
    BUL(['Bentuk dan saiz imej <b>sama</b> dengan objek.', 'Pusat putaran <b>tidak berubah</b> kedudukan.', 'Jarak setiap titik imej dari pusat <b>sama</b> dengan jarak titik objek sepadan dari pusat.'], p), d_143())
add('11.4', 'CONTOH BERLANGKAH', 'Putaran 90° ikut arah jam',
    P('Titik A(3, 1) diputar 90° ikut arah jam pada asalan O. Cari koordinat imej A′.', 23)
    + STEPS(['Surih titik A dan asalan O pada kertas surih.', 'Letak pensel di O, putar kertas surih 90° ikut arah jam.', 'Tandakan kedudukan baharu A dan baca koordinatnya.'], p)
    + ANS('A′(1, −3)'), d_144())
add('11.4', 'CONTOH BERLANGKAH', 'Mencari pusat putaran',
    P('A′B′ ialah imej bagi AB di bawah satu putaran. Cari pusat putaran.', 23)
    + STEPS(['Sambungkan A dan A′. Lukis pembahagi dua sama serenjang bagi AA′.', 'Sambungkan B dan B′. Lukis pembahagi dua sama serenjang bagi BB′.', 'Titik persilangan kedua-dua garis ialah <b>pusat putaran</b>.'], p), d_145())

# 11.5
add('11.5', 'KONSEP', 'Mengapa dipanggil isometri?',
    DEF('Dalam isometri, <b>jarak antara dua titik</b> pada objek sama dengan jarak antara dua titik sepadan pada imej.', a)
    + P('Translasi, pantulan dan putaran mengekalkan jarak, jadi ketiga-tiganya ialah isometri.'), d_151())
add('11.5', 'PERBANDINGAN', 'Perbandingan sifat', '', None, table_152())
add('11.5', 'KONSEP', 'Isometri dan kekongruenan',
    BUL(['Imej yang dihasilkan oleh isometri sentiasa <b>kongruen</b> dengan objek.', 'Gabungan isometri juga menghasilkan imej yang kongruen.', 'Dalam kehidupan: corak jubin lantai, batik dan hiasan dinding.'], a), d_153())

# 11.6
add('11.6', 'DEFINISI', 'Maksud simetri putaran',
    DEF('Sesuatu bentuk mempunyai <b>simetri putaran</b> jika bentuk itu kelihatan <b>sama seperti asal</b> apabila diputar kurang daripada satu putaran lengkap (360°).', k), d_161())
add('11.6', 'KONSEP', 'Peringkat simetri putaran',
    DEF('<b>Peringkat simetri putaran</b> ialah bilangan kali bentuk kelihatan sama seperti asal dalam satu putaran lengkap.', k)
    + P('<span style="color: #94A3B8">Putar bersama kelas dan kira berapa kali bentuk kelihatan sama.</span>', 20), d_162())
add('11.6', 'APLIKASI', 'Simetri putaran dalam kehidupan',
    BUL(['Kipas, roda kereta dan logo sering mempunyai simetri putaran.', 'Bentuk yang hanya kelihatan sama selepas satu putaran lengkap mempunyai <b>peringkat 1</b>.'], k)
    + P('<span style="color: #94A3B8">Tanya kelas: teka peringkat setiap bentuk sebelum jawapan ditunjukkan.</span>', 20), d_163())

# ---------- tulis fail ----------
HEAD = '''<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&amp;family=Space+Grotesk:wght@500;700&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0}}
a{{color:#38BDF8}}a:hover{{color:#7DD3FC}}
</style>
</helmet>
'''
TAIL = '''</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1280,"height":720}}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
'''

counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
idx = {}
files = []
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1; n = idx[sub]; N = counts[sub]
    name, col = SUB[sub]
    dots = ''.join(f'<span style="width: {30 if i == n else 12}px; height: 12px; border-radius: 6px; background: {col if i == n else "#334155"}"></span>' for i in range(1, N + 1))
    if s['full']:
        main = (f'<main style="flex: 1; min-height: 0; padding: 26px 48px 0; display: flex; flex-direction: column; gap: 22px">'
                f'<div><p style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; color: {col}">{s["kicker"]}</p>'
                f'<h1 style="margin: 6px 0 0; font-family: \'Space Grotesk\', sans-serif; font-size: 40px; font-weight: 700">{s["title"]}</h1></div>'
                f'{s["full"]}</main>')
    else:
        main = (f'<main style="flex: 1; min-height: 0; padding: 26px 44px 0; display: flex; gap: 36px">'
                f'<section style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px">'
                f'<p style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; color: {col}">{s["kicker"]}</p>'
                f'<h1 style="margin: 0; font-family: \'Space Grotesk\', sans-serif; font-size: 40px; line-height: 1.15; font-weight: 700">{s["title"]}</h1>'
                f'{s["body"]}</section>{s["diagram"]}</main>')
    page = (f'<div style="width: 1280px; height: 720px; box-sizing: border-box; background: {BG}; color: {TX}; font-family: Inter, system-ui, sans-serif; display: flex; flex-direction: column">'
            f'<header style="height: 64px; flex: none; display: flex; align-items: center; gap: 14px; padding: 0 28px; background: {NAV}; border-bottom: 1px solid {BD}">'
            f'<span style="font-family: \'Space Grotesk\', sans-serif; font-weight: 700; font-size: 20px; letter-spacing: 0.03em">ISO<span style="color: {C["tr"]}">MOVE</span></span>'
            f'<span style="width: 1px; height: 28px; background: {BD}"></span>'
            f'<span style="height: 34px; padding: 0 12px; border-radius: 10px; display: flex; align-items: center; background: {col}; color: {BG}; font-weight: 800; font-size: 15px">{sub}</span>'
            f'<span style="font-family: \'Space Grotesk\', sans-serif; font-weight: 700; font-size: 20px">{name}</span>'
            f'<span style="margin-left: auto; font-weight: 700; font-size: 17px; color: {MU}">Slaid {n} / {N}</span></header>'
            f'{main}'
            f'<footer style="height: 64px; flex: none; display: flex; align-items: center; justify-content: center; gap: 8px" aria-label="Slaid {n} daripada {N}">{dots}</footer>'
            f'</div>')
    fn = f's{sub.replace(".", "-")}-{n}.dc.html'
    with open(os.path.join(OUT, fn), 'w') as f:
        f.write(HEAD.format(title=html.escape(f'{sub} {name} – {s["title"]}')) + page + '\n' + TAIL)
    files.append((sub, n, fn, s['title']))

json.dump(files, open('/home/claude/isodesign/slides.json', 'w'), ensure_ascii=False)
print(len(files), 'slaid')
