# Penjana slaid NOTA TEORI GRAF (Tingkatan 4 Bab 5 Rangkaian dalam Teori Graf) -> teorigraf/slides.js
# Jalankan:  python3 tools/teorigraf/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, itertools

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'teorigraf', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 5.1 Rangkaian, jadi subtopik app = Standard Pembelajaran.
# SP 5.1.4 (mewakilkan maklumat) dan 5.1.5 (menyelesaikan masalah) digabung dalam '5.1.4'.
SUB = {
    '5.1.1': ('Graf & Darjah', C['tr']),
    '5.1.2': ('Terarah & Pemberat', C['pa']),
    '5.1.3': ('Subgraf & Pokok', C['gr']),
    '5.1.4': ('Rangkaian & Masalah', C['pu']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

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
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
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

def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'

def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

# ---------- graf ----------
class Graph:
    """Graf: V = {nama: (x, y)}, E = [(a, b, opsyen)]. opsyen: c (warna), w (pemberat), bend (lengkung),
    dash, ang (arah gelung, darjah), dir (terarah a -> b), sw (tebal)."""
    def __init__(self, V, E, directed=False):
        self.V = dict(V); self.E = [(a, b, dict(o[0]) if o else {}) for a, b, *o in E]; self.directed = directed
        for a, b, _ in self.E: assert a in self.V and b in self.V, (a, b)
    def deg(self, v):
        return sum((2 if a == b else 1) for a, b, _ in self.E if v in (a, b) and (a == v or b == v))
    def deg_all(self):
        d = {v: 0 for v in self.V}
        for a, b, _ in self.E:
            if a == b: d[a] += 2
            else: d[a] += 1; d[b] += 1
        return d
    def nE(self): return len(self.E)
    def outdeg(self, v): return sum(1 for a, b, _ in self.E if a == v)
    def indeg(self, v): return sum(1 for a, b, _ in self.E if b == v)
    def connected(self):
        vs = list(self.V); seen = {vs[0]}; st = [vs[0]]
        while st:
            u = st.pop()
            for a, b, _ in self.E:
                for x, y in ((a, b), (b, a)):
                    if x == u and y not in seen: seen.add(y); st.append(y)
        return len(seen) == len(vs)
    def simple(self):
        pairs = [frozenset((a, b)) for a, b, _ in self.E]
        return all(a != b for a, b, _ in self.E) and len(pairs) == len(set(pairs))
    def is_tree(self):
        return self.simple() and self.connected() and self.nE() == len(self.V) - 1
    def draw(self, col=TR, vr=19, vfill=SURF, vcol=None, lab=True, fsz=19, wcol=AM, hide=(), vlabel=None, vextra=None):
        s = ''
        vcol = vcol or col
        for a, b, o in self.E:
            c = o.get('c', col); sw = o.get('sw', 4.5); dash = o.get('dash')
            dd = f' stroke-dasharray="{dash}"' if dash else ''
            if a == b:
                x, y = self.V[a]; ang = math.radians(o.get('ang', -90)); R = 17
                cx, cy = x + math.cos(ang) * (vr + R - 4), y + math.sin(ang) * (vr + R - 4)
                s += f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{R}" fill="none" stroke="{c}" stroke-width="{sw}"{dd}/>'
                if 'w' in o:
                    s += WLAB(x + math.cos(ang) * (vr + 2 * R + 12), y + math.sin(ang) * (vr + 2 * R + 12), o['w'], wcol)
                continue
            p, q = self.V[a], self.V[b]
            dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy); ux, uy = dx / L, dy / L; nx, ny = -uy, ux
            bend = o.get('bend', 0)
            mx, my = (p[0] + q[0]) / 2 + nx * bend, (p[1] + q[1]) / 2 + ny * bend   # titik kawalan / tengah
            cx_, cy_ = (p[0] + q[0]) / 2 + nx * bend * 2, (p[1] + q[1]) / 2 + ny * bend * 2
            if bend:
                s += f'<path d="M{r1(p[0])} {r1(p[1])} Q{r1(cx_)} {r1(cy_)} {r1(q[0])} {r1(q[1])}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round"{dd}/>'
            else:
                s += LINE(p, q, c, sw, dash)
            if o.get('dir') or self.directed:
                # anak panah di hujung b (atau di tengah jika 'mid')
                if bend:
                    tx_, ty_ = q[0] - cx_, q[1] - cy_; tl = math.hypot(tx_, ty_); tx_, ty_ = tx_ / tl, ty_ / tl
                    # titik pada lengkung berhampiran bucu (anggaran)
                    tip = (q[0] - tx_ * (vr + 3), q[1] - ty_ * (vr + 3))
                else:
                    tx_, ty_ = ux, uy; tip = (q[0] - ux * (vr + 3), q[1] - uy * (vr + 3))
                s += HEAD(tip, (tx_, ty_), c)
            if 'w' in o:
                wo = o.get('wo', 0)
                s += WLAB(mx + nx * wo, my + ny * wo, o['w'], wcol)
        for v, (x, y) in self.V.items():
            if v in hide: continue
            vc = (vextra or {}).get(v, vcol)
            s += f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{vr}" fill="{vfill}" stroke="{vc}" stroke-width="4"/>'
            if lab: s += T(x, y + 1, (vlabel or {}).get(v, v), TX, fsz, halo=False)
        return s

def HEAD(tip, u, col, k=15):
    ux, uy = u; nx, ny = -uy, ux
    a = (tip[0] - ux * k + nx * k * 0.55, tip[1] - uy * k + ny * k * 0.55)
    b = (tip[0] - ux * k - nx * k * 0.55, tip[1] - uy * k - ny * k * 0.55)
    return f'<polygon points="{r1(tip[0])},{r1(tip[1])} {r1(a[0])},{r1(a[1])} {r1(b[0])},{r1(b[1])}" fill="{col}" stroke="{col}" stroke-width="2" stroke-linejoin="round"/>'

def WLAB(x, y, t, col=AM, size=17):
    w = len(str(t)) * size * 0.6 + 14
    return (f'<rect x="{r1(x - w / 2)}" y="{r1(y - 14)}" width="{r1(w)}" height="28" rx="9" fill="{NAV}" stroke="{col}" stroke-width="2"/>'
            + T(x, y + 1, t, col, size, halo=False))

def BADGE(x, y, t, col):
    return f'<circle cx="{r1(x)}" cy="{r1(y)}" r="14" fill="{col}"/>' + T(x, y + 1, t, NAV, 16, halo=False)

def shift(V, dx, dy, k=1.0):
    return {n: (dx + x * k, dy + y * k) for n, (x, y) in V.items()}

def path_weight(G, path):
    tot = 0
    for a, b in zip(path, path[1:]):
        ws = [o['w'] for x, y, o in G.E if {x, y} == {a, b} and (not G.directed or (x, y) == (a, b))]
        assert ws, (a, b)
        tot += min(ws)
    return tot

def all_paths(G, s, t):
    adj = {v: [] for v in G.V}
    for a, b, o in G.E:
        adj[a].append(b)
        if not G.directed: adj[b].append(a)
    out = []
    def go(u, seen):
        if u == t: out.append(list(seen)); return
        for v in adj[u]:
            if v not in seen: seen.append(v); go(v, seen); seen.pop()
    go(s, [s])
    return out

def dijkstra(G, s):
    dist = {v: math.inf for v in G.V}; dist[s] = 0; done = set()
    while len(done) < len(G.V):
        u = min((v for v in G.V if v not in done), key=lambda v: dist[v]); done.add(u)
        for a, b, o in G.E:
            for x, y in ((a, b), (b, a)) if not G.directed else ((a, b),):
                if x == u and dist[u] + o['w'] < dist[y]: dist[y] = dist[u] + o['w']
    return dist

def setstr(xs): return '{' + ', '.join(xs) + '}'
def edgestr(E): return '{' + ', '.join(f'({a}, {b})' for a, b, _ in E) + '}'

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 5.1.1 GRAF & DARJAH =====================
col = SUB['5.1.1'][1]

# 5.1.1-1 Definisi graf
G1 = Graph({'A': (90, 130), 'B': (260, 80), 'C': (410, 170), 'D': (330, 340), 'E': (130, 330)},
           [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('E', 'A'), ('B', 'D')])
assert G1.nE() == 6 and len(G1.V) == 5
fig = G1.draw(TR, vcol=AM)
fig += T(90, 82, 'bucu', AM, 18) + LINE((90, 94), (90, 108), AM, 2.5)
fig += T(372, 102, 'tepi', TR, 18, 'start')
fig += T(250, 420, 'V = {A, B, C, D, E}', AM, 20, halo=False) + T(250, 450, 'n(V) = 5 bucu, n(E) = 6 tepi', MU3, 18, halo=False)
add('5.1.1', 'DEFINISI', 'Apa itu graf?',
    DEF('<b>Graf</b> ialah satu set titik yang dipanggil <b>bucu</b>, dengan sebahagian bucu itu disambungkan oleh garis yang dipanggil <b>tepi</b>.', col)
    + BUL([f'{B("Bucu", AM)} (V): titik dalam graf, ditanda dengan huruf.',
           f'{B("Tepi", TR)} (E): garis yang menyambungkan dua bucu, ditulis sebagai pasangan seperti (A, B).',
           f'{B("Rangkaian", col)}: graf yang mempunyai sekurang-kurangnya sepasang bucu yang disambungkan.'], col)
    + NOTE('Graf ditulis sebagai G = (V, E), iaitu set bucu dan set tepi.'),
    svg(fig, 'Graf dengan lima bucu A hingga E dan enam tepi'))

# 5.1.1-2 Darjah
d1 = G1.deg_all()
assert d1 == {'A': 2, 'B': 3, 'C': 2, 'D': 3, 'E': 2} and sum(d1.values()) == 12
fig = G1.draw(TR, vcol=AM)
off = {'A': (-30, -30), 'B': (0, -36), 'C': (34, -26), 'D': (34, 26), 'E': (-30, 30)}
for v, (x, y) in G1.V.items():
    fig += BADGE(x + off[v][0], y + off[v][1], d1[v], PK)
fig += T(250, 420, 'Nombor merah jambu = darjah bucu', PK, 19, halo=False)
fig += T(250, 450, 'Jumlah darjah = 2 + 3 + 2 + 3 + 2 = 12', MU3, 18, halo=False)
add('5.1.1', 'DEFINISI', 'Darjah sesuatu bucu',
    DEF('<b>Darjah</b> sesuatu bucu ialah <b>bilangan tepi</b> yang bersambung dengan bucu itu. Darjah bucu A ditulis d(A).', col)
    + TABLE(['Bucu', 'A', 'B', 'C', 'D', 'E'], [['Darjah'] + [str(d1[v]) for v in 'ABCDE']], col)
    + STEPS(['Kira tepi yang menyentuh setiap bucu.', f'Jumlah darjah = {sum(d1.values())}, bilangan tepi = {G1.nE()}.'], col)
    + NOTE(f'Jumlah darjah ({sum(d1.values())}) ialah <b>dua kali</b> bilangan tepi ({G1.nE()}).'),
    svg(fig, 'Graf yang sama dengan darjah setiap bucu'))

# 5.1.1-3 Gelung, berbilang tepi, graf mudah
fig = ''
panels = [(14, 'Graf mudah', GR), (178, 'Berbilang tepi', PA), (342, 'Gelung', PK)]
for x0, nm, cl in panels:
    fig += RECT(x0, 14, 144, 300, SURF, BD, 16, 2)
    fig += T(x0 + 72, 44, nm, cl, 17)
Gs = Graph({'P': (50, 120), 'Q': (122, 120), 'R': (86, 250)}, [('P', 'Q'), ('Q', 'R'), ('R', 'P')])
Gm = Graph({'P': (214, 120), 'Q': (286, 250)}, [('P', 'Q', {'bend': 22, 'c': PA}), ('P', 'Q', {'bend': -22, 'c': PA}), ('P', 'Q')])
Gl = Graph({'P': (412, 250)}, [('P', 'P', {'ang': -90, 'c': PK})])
assert Gs.simple() and not Gm.simple() and not Gl.simple() and Gl.deg('P') == 2 and Gm.deg('P') == 3
fig += Gs.draw(GR, 17, fsz=17) + Gm.draw(TR, 17, fsz=17) + Gl.draw(TR, 17, fsz=17)
fig += T(412, 150, 'd(P) = 2', PK, 17)
fig += RECT(14, 330, 472, 126, SURF, BD, 16, 2)
fig += T(250, 362, 'Graf mudah: tidak terarah, tiada gelung,', MU3, 18, halo=False)
fig += T(250, 390, 'tiada berbilang tepi', MU3, 18, halo=False)
fig += T(250, 428, 'Gelung menambah 2 kepada darjah', PK, 18, halo=False)
add('5.1.1', 'KONSEP', 'Gelung, berbilang tepi dan graf mudah',
    BUL([f'{B("Gelung", PK)}: tepi yang bermula dan berakhir pada bucu yang <b>sama</b>. Satu gelung menyumbang <b>2</b> kepada darjah bucu itu.',
         f'{B("Berbilang tepi", PA)}: dua atau lebih tepi yang menyambungkan <b>pasangan bucu yang sama</b>.',
         f'{B("Graf mudah", GR)}: graf tidak terarah yang <b>tiada gelung</b> dan <b>tiada berbilang tepi</b>.'], col)
    + NOTE('Gelung disentuh oleh bucu itu pada <b>dua hujung</b>, sebab itu ia dikira 2.'),
    svg(fig, 'Tiga graf: graf mudah, graf dengan berbilang tepi dan graf dengan gelung'))

# 5.1.1-4 Contoh berlangkah: jumlah darjah = 2 x tepi
G4 = Graph({'P': (110, 110), 'Q': (380, 110), 'R': (380, 330), 'S': (110, 330)},
           [('P', 'Q'), ('Q', 'R', {'bend': 26}), ('Q', 'R', {'bend': -26}), ('R', 'S'), ('S', 'P'), ('P', 'R'), ('S', 'S', {'ang': 135})])
d4 = G4.deg_all()
assert d4 == {'P': 3, 'Q': 3, 'R': 4, 'S': 4} and G4.nE() == 7 and sum(d4.values()) == 2 * G4.nE() == 14
fig = G4.draw(TR, vcol=AM)
off = {'P': (-34, -30), 'Q': (34, -30), 'R': (44, 30), 'S': (30, 34)}
for v, (x, y) in G4.V.items(): fig += BADGE(x + off[v][0], y + off[v][1], d4[v], PK)
fig += T(250, 420, 'Σ darjah = 3 + 3 + 4 + 4 = 14', PK, 20, halo=False) + T(250, 450, '2 × 7 tepi = 14 ✓', GR, 19, halo=False)
add('5.1.1', 'CONTOH BERLANGKAH', 'Jumlah darjah = 2 × bilangan tepi',
    P('Bagi graf di sebelah, cari darjah setiap bucu dan sahkan hubungan jumlah darjah dengan bilangan tepi.', True)
    + STEPS(['d(P) = 3, d(Q) = 3, d(R) = 4, d(S) = 4 (gelung pada S dikira 2).',
             'Jumlah darjah = 3 + 3 + 4 + 4 = 14',
             'Bilangan tepi = 7 (termasuk 2 tepi Q–R dan 1 gelung) → 2 × 7 = 14'], col)
    + ANS('Σ d(v) = 2E: 14 = 2 × 7')
    + NOTE('Setiap tepi mempunyai dua hujung, jadi setiap tepi menambah 2 kepada jumlah darjah.'),
    svg(fig, 'Graf P, Q, R, S dengan dua tepi Q ke R dan satu gelung pada S'))

# 5.1.1-5 Daripada V dan E kepada graf
G5 = Graph({'K': (100, 100), 'L': (400, 100), 'M': (400, 300), 'N': (100, 300)},
           [('K', 'L'), ('L', 'M'), ('M', 'N'), ('N', 'K'), ('K', 'M'), ('M', 'M', {'ang': 30})])
d5 = G5.deg_all()
assert d5 == {'K': 3, 'L': 2, 'M': 5, 'N': 2} and sum(d5.values()) == 12 == 2 * G5.nE()
fig = G5.draw(TR, vcol=AM)
for v, (x, y) in G5.V.items():
    ox = -36 if x < 250 else 36; oy = -30 if y < 200 else 32
    if v == 'M': ox, oy = -8, 44
    fig += BADGE(x + ox, y + oy, d5[v], PK)
fig += T(250, 400, 'n(V) = 4, n(E) = 6', MU3, 19, halo=False) + T(250, 436, 'Σ darjah = 3 + 2 + 5 + 2 = 12', PK, 19, halo=False)
add('5.1.1', 'CONTOH BERLANGKAH', 'Melukis graf daripada set V dan E',
    P(f'Diberi V = {setstr("KLMN")} dan E = {edgestr(G5.E)}. Lukis graf itu dan cari jumlah darjah.', True)
    + STEPS(['Tanda 4 bucu K, L, M dan N.',
             'Sambungkan setiap pasangan dalam E. (M, M) ialah gelung pada M.',
             'd(K) = 3, d(L) = 2, d(M) = 5, d(N) = 2'], col)
    + ANS('Jumlah darjah = 12 = 2 × 6 tepi'),
    svg(fig, 'Graf K, L, M, N dengan gelung pada M'))

# 5.1.1-6 Kesilapan biasa
fig = ''
CASES = [(48, 'Gelung pada A dikira darjah 1', False), (108, 'Gelung pada A dikira darjah 2', True),
         (188, 'Titik silang dua tepi ialah bucu', False), (248, 'Bucu mesti ditanda dengan titik', True),
         (328, 'Jumlah darjah boleh jadi 15', False), (388, 'Jumlah darjah sentiasa genap', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 26, 460, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 448, 'Σ darjah = 2 × bilangan tepi', AM, 19, halo=False)
add('5.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Gelung dikira 1", RD)} ✗ → gelung menyumbang <b>2</b> kepada darjah.',
         f'{B("Titik persilangan dianggap bucu", RD)} ✗ → dua tepi yang bersilang tidak semestinya bertemu di bucu.',
         f'{B("Terlepas berbilang tepi", RD)} ✗ → kira setiap tepi antara dua bucu yang sama.',
         f'{B("Jumlah darjah ganjil", RD)} ✗ → jumlah darjah = 2 × bilangan tepi, jadi sentiasa <b>genap</b>.'], col)
    + NOTE('Semak jawapan anda: jumlah darjah ÷ 2 mesti sama dengan bilangan tepi.', 'Petua:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang darjah'))

# ===================== 5.1.2 TERARAH & PEMBERAT =====================
col = SUB['5.1.2'][1]

# 5.1.2-1 Terarah vs tidak terarah
fig = RECT(14, 14, 230, 300) + RECT(256, 14, 230, 300)
fig += T(129, 44, 'Tidak terarah', TR, 19) + T(371, 44, 'Terarah', PA, 19)
Gu = Graph({'A': (60, 110), 'B': (200, 110), 'C': (130, 250)}, [('A', 'B'), ('B', 'C'), ('C', 'A')])
Gd = Graph({'A': (302, 110), 'B': (442, 110), 'C': (372, 250)}, [('A', 'B'), ('B', 'C'), ('A', 'C')], directed=True)
fig += Gu.draw(TR, 18, fsz=18) + Gd.draw(PA, 18, fsz=18)
fig += T(129, 292, '(A, B) = (B, A)', MU3, 16, halo=False) + T(371, 292, '(A, B) ≠ (B, A)', MU3, 16, halo=False)
fig += RECT(14, 330, 472, 126, SURF, BD, 16, 2)
fig += T(250, 364, 'Jalan dua hala → tidak terarah', TR, 18, halo=False)
fig += T(250, 398, 'Jalan sehala → terarah', PA, 18, halo=False)
fig += T(250, 432, 'Anak panah menunjukkan arah', MU3, 17, halo=False)
add('5.1.2', 'KONSEP', 'Graf terarah dan graf tidak terarah',
    BUL([f'{B("Graf tidak terarah", TR)}: tepi tiada arah. Tepi (A, B) sama dengan (B, A).',
         f'{B("Graf terarah", PA)}: setiap tepi ada arah, ditunjukkan dengan <b>anak panah</b>. Tepi (A, B) bermaksud dari A <b>ke</b> B.'], col)
    + TABLE(['Situasi', 'Jenis graf'], [['Rakan Facebook (saling berkawan)', 'Tidak terarah'], ['Pengikut Instagram (ikut sehala)', 'Terarah'], ['Jalan sehala di bandar', 'Terarah']], col, rv=True),
    svg(fig, 'Graf tidak terarah dan graf terarah dengan tiga bucu'))

# 5.1.2-2 Berpemberat
fig = RECT(14, 14, 230, 300) + RECT(256, 14, 230, 300)
fig += T(129, 44, 'Tidak berpemberat', TR, 18) + T(371, 44, 'Berpemberat', PA, 18)
Gu2 = Graph({'A': (60, 110), 'B': (200, 110), 'C': (130, 250)}, [('A', 'B'), ('B', 'C'), ('C', 'A')])
Gw2 = Graph({'A': (302, 110), 'B': (442, 110), 'C': (372, 250)}, [('A', 'B', {'w': 12, 'wo': -18}), ('B', 'C', {'w': 8, 'wo': -22}), ('C', 'A', {'w': 15, 'wo': -22})])
fig += Gu2.draw(TR, 18, fsz=18) + Gw2.draw(PA, 18, fsz=18)
fig += T(371, 292, 'km', MU3, 16, halo=False)
fig += RECT(14, 330, 472, 126, SURF, BD, 16, 2)
fig += T(250, 364, 'Pemberat = nilai pada tepi', AM, 19, halo=False)
fig += T(250, 398, 'jarak · masa · kos', MU3, 18, halo=False)
fig += T(250, 432, 'Jarak A → B → C = 12 + 8 = 20 km', PA, 18, halo=False)
assert path_weight(Gw2, ['A', 'B', 'C']) == 20
add('5.1.2', 'KONSEP', 'Graf berpemberat dan tidak berpemberat',
    DEF('<b>Graf berpemberat</b> ialah graf yang setiap tepinya mempunyai nilai yang dipanggil <b>pemberat</b>.', col)
    + BUL([f'Pemberat boleh mewakili {B("jarak", AM)}, {B("masa", AM)} atau {B("kos", AM)}.',
           f'{B("Graf tidak berpemberat", TR)} hanya menunjukkan sama ada dua bucu bersambung.'], col)
    + NOTE('Panjang tepi dalam rajah <b>tidak</b> perlu mengikut nilai pemberat.'),
    svg(fig, 'Graf tidak berpemberat dan graf berpemberat dengan jarak dalam km'))

# 5.1.2-3 Contoh: graf terarah, senarai tepi dan darjah masuk/keluar
G3 = Graph({'P': (100, 100), 'Q': (400, 100), 'R': (400, 320), 'S': (100, 320)},
           [('P', 'Q'), ('Q', 'R'), ('R', 'S'), ('S', 'P'), ('P', 'R'), ('R', 'Q', {'bend': 30})], directed=True)
outs = {v: G3.outdeg(v) for v in 'PQRS'}; ins = {v: G3.indeg(v) for v in 'PQRS'}
assert outs == {'P': 2, 'Q': 1, 'R': 2, 'S': 1} and ins == {'P': 1, 'Q': 2, 'R': 2, 'S': 1}
assert sum(outs.values()) == sum(ins.values()) == G3.nE() == 6
fig = G3.draw(PA, vcol=AM)
fig += T(250, 410, 'Q ⇄ R: dua tepi berlainan arah', MU3, 18, halo=False)
fig += T(250, 444, '6 tepi terarah', PA, 19, halo=False)
add('5.1.2', 'CONTOH BERLANGKAH', 'Membaca graf terarah',
    P('Senaraikan tepi graf terarah di sebelah. Bagi setiap bucu, kira tepi yang keluar dan tepi yang masuk.', True)
    + STEPS([f'E = {edgestr(G3.E)}',
             'Tepi (Q, R) dan (R, Q) ialah dua tepi yang <b>berbeza</b>.'], col)
    + TABLE(['Bucu', 'P', 'Q', 'R', 'S'], [['Tepi keluar'] + [str(outs[v]) for v in 'PQRS'], ['Tepi masuk'] + [str(ins[v]) for v in 'PQRS']], col, rv=True)
    + NOTE('Jumlah tepi keluar = jumlah tepi masuk = bilangan tepi = 6.'),
    svg(fig, 'Graf terarah P, Q, R, S dengan enam tepi'))

# 5.1.2-4 Contoh: graf terarah berpemberat (laluan)
G6 = Graph({'Rumah': (80, 220), 'Kedai': (250, 80), 'Sekolah': (420, 220), 'Taman': (250, 360)},
           [('Rumah', 'Kedai', {'w': 4, 'wo': -20}), ('Kedai', 'Sekolah', {'w': 3, 'wo': -20}), ('Rumah', 'Taman', {'w': 2, 'wo': 20}),
            ('Taman', 'Sekolah', {'w': 6, 'wo': 20}), ('Taman', 'Kedai', {'w': 1, 'wo': 14})], directed=True)
paths = all_paths(G6, 'Rumah', 'Sekolah'); pw = {'→'.join(p): path_weight(G6, p) for p in paths}
assert pw == {'Rumah→Kedai→Sekolah': 7, 'Rumah→Taman→Sekolah': 8, 'Rumah→Taman→Kedai→Sekolah': 6}, pw
VL = {'Rumah': 'R', 'Kedai': 'K', 'Sekolah': 'S', 'Taman': 'T'}
fig = Graph(G6.V, [(a, b, o) for a, b, o in G6.E], directed=True).draw(PA, 22, vcol=AM, vlabel=VL)
fig += T(80, 180, 'Rumah', MU3, 16) + T(250, 40, 'Kedai', MU3, 16) + T(420, 180, 'Sekolah', MU3, 16) + T(250, 400, 'Taman', MU3, 16)
fig += T(250, 446, 'pemberat = masa (minit), jalan sehala', MU3, 17, halo=False)
add('5.1.2', 'CONTOH BERLANGKAH', 'Graf terarah berpemberat',
    P('Graf menunjukkan jalan sehala dan masa berbasikal (minit). Cari laluan yang paling cepat dari rumah (R) ke sekolah (S).', True)
    + TABLE(['Laluan', 'Masa (minit)'], [['R → K → S', '4 + 3 = 7'], ['R → T → S', '2 + 6 = 8'], ['R → T → K → S', '2 + 1 + 3 = <b>6</b>']], col, rv=True)
    + ANS('R → T → K → S, 6 minit')
    + NOTE('Ikut arah anak panah sahaja. K → T tidak dibenarkan kerana tepi itu dari T ke K.'),
    svg(fig, 'Graf terarah berpemberat antara rumah, kedai, taman dan sekolah'))

# 5.1.2-5 Banding beza
fig = ''
quad = [(14, 14, 'Tidak terarah', 'Tidak berpemberat', TR, False, False), (256, 14, 'Terarah', 'Tidak berpemberat', PA, True, False),
        (14, 242, 'Tidak terarah', 'Berpemberat', GR, False, True), (256, 242, 'Terarah', 'Berpemberat', PK, True, True)]
for x0, y0, a1, a2, cl, dr, wt in quad:
    fig += RECT(x0, y0, 230, 214, SURF, BD, 16, 2)
    fig += T(x0 + 115, y0 + 26, a1, cl, 17) + T(x0 + 115, y0 + 50, a2, cl, 15)
    E = [('X', 'Y', {'w': 5, 'wo': -16}), ('Y', 'Z', {'w': 3, 'wo': -16}), ('X', 'Z', {'w': 4, 'wo': 16})] if wt else [('X', 'Y'), ('Y', 'Z'), ('X', 'Z')]
    g = Graph({'X': (x0 + 40, y0 + 110), 'Y': (x0 + 190, y0 + 110), 'Z': (x0 + 115, y0 + 186)}, E, directed=dr)
    fig += g.draw(cl, 16, fsz=16)
add('5.1.2', 'BANDING & BEZA', 'Empat jenis graf',
    TABLE(['Ciri', 'Persamaan', 'Perbezaan'],
          [['Terarah / tidak terarah', 'Ada bucu dan tepi', 'Terarah: tepi ada arah (anak panah)'],
           ['Berpemberat / tidak berpemberat', 'Ada bucu dan tepi', 'Berpemberat: tepi ada nilai']], col, rv=True)
    + BUL(['Satu graf boleh <b>terarah dan berpemberat</b> sekali gus, contohnya peta jalan sehala dengan jarak.'], col)
    + NOTE('Semua jenis graf ini ialah rangkaian, asalkan ada bucu yang bersambung.'),
    svg(fig, 'Empat graf: tidak terarah, terarah, berpemberat, terarah dan berpemberat'))

# 5.1.2-6 Kesilapan biasa
fig = ''
CASES = [(48, '(A, B) sama dengan (B, A) dalam graf terarah', False), (108, 'Terarah: (A, B) ialah dari A ke B', True),
         (188, 'Tepi lebih panjang = pemberat lebih besar', False), (248, 'Baca pemberat pada tepi', True),
         (328, 'Laluan melawan arah anak panah', False), (388, 'Ikut arah anak panah', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 26, 460, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 17, 'start')
add('5.1.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Abaikan arah", RD)} ✗ → dalam graf terarah, tepi hanya boleh dilalui mengikut arah anak panah.',
         f'{B("Ukur panjang tepi", RD)} ✗ → nilai pemberat ditulis pada tepi; panjang lukisan tidak penting.',
         f'{B("Pilih laluan paling sedikit tepi", RD)} ✗ → laluan terbaik ialah yang jumlah pemberatnya paling kecil.'], col)
    + NOTE('Graf terarah: tulis tepi mengikut tertib (dari, ke).', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang graf terarah dan berpemberat'))

# ===================== 5.1.3 SUBGRAF & POKOK =====================
col = SUB['5.1.3'][1]

# 5.1.3-1 Subgraf
GV = {'A': (60, 70), 'B': (180, 70), 'C': (180, 190), 'D': (60, 190)}
GE = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'A'), ('A', 'C')]
def sub_of(V, E, GV, GE):
    ge = {frozenset((a, b)) for a, b, *_ in GE}
    return set(V) <= set(GV) and all(frozenset((a, b)) in ge for a, b, *_ in E) and all(a in V and b in V for a, b, *_ in E)
Gbig = Graph(shift(GV, 0, 20), GE)
H1 = (['A', 'B', 'C'], [('A', 'B'), ('B', 'C'), ('A', 'C')])
H2 = (['A', 'B', 'C', 'D'], [('A', 'B'), ('C', 'D')])
H3 = (['A', 'B', 'D'], [('A', 'B'), ('B', 'D')])
assert sub_of(*H1, GV, GE) and sub_of(*H2, GV, GE) and not sub_of(*H3, GV, GE)
fig = RECT(14, 14, 230, 250) + T(129, 40, 'Graf G', TR, 19)
fig += Graph(shift(GV, 14, 30), GE).draw(TR, 17, fsz=17)
cards = [(256, 14, 'H₁', H1, True), (14, 278, 'H₂', H2, True), (256, 278, 'H₃', H3, False)]
for x0, y0, nm, (V, E), ok in cards:
    h = 250 if y0 == 14 else 178
    fig += RECT(x0, y0, 230, h, SURF, GR if ok else RD, 16, 2)
    k = 0.62 if y0 > 14 else 1
    pos = {v: (x0 + 50 + (GV[v][0] - 60) * k, y0 + (36 if y0 > 14 else 60) + (GV[v][1] - 70) * k) for v in V}
    fig += Graph(pos, E).draw(GR if ok else RD, 15 if k < 1 else 17, fsz=15 if k < 1 else 17)
    tx = x0 + (185 if k < 1 else 115); ty = y0 + (80 if k < 1 else 228)
    fig += T(tx, ty - (14 if k < 1 else 0), nm, GR if ok else RD, 19)
    fig += (TICK(tx, ty + 16) if ok else CROSS(tx, ty + 16)) if k < 1 else (TICK(tx + 30, ty) if ok else CROSS(tx + 30, ty))
add('5.1.3', 'DEFINISI', 'Subgraf',
    DEF('Graf H ialah <b>subgraf</b> bagi graf G jika <b>semua bucu</b> dan <b>semua tepi</b> H ialah bucu dan tepi G.', col)
    + BUL([f'{B("H₁", GR)}: bucu A, B, C dan tepinya semua ada dalam G ✓',
           f'{B("H₂", GR)}: semua bucu, tetapi hanya 2 tepi G ✓',
           f'{B("H₃", RD)}: tepi (B, D) <b>tiada</b> dalam G ✗'], col)
    + NOTE('Subgraf dibina dengan <b>membuang</b> bucu atau tepi daripada G, bukan menambah.'),
    svg(fig, 'Graf G dan tiga graf H1, H2, H3; H3 bukan subgraf'))

# 5.1.3-2 Contoh: melukis subgraf
GV2 = {'P': (250, 70), 'Q': (420, 190), 'R': (350, 360), 'S': (150, 360), 'T': (80, 190)}
GE2 = [('P', 'Q'), ('Q', 'R'), ('R', 'S'), ('S', 'T'), ('T', 'P'), ('P', 'R'), ('P', 'S')]
SubE = [('P', 'Q'), ('Q', 'R'), ('P', 'R')]
assert sub_of(['P', 'Q', 'R'], SubE, GV2, GE2)
fig = Graph(GV2, [(a, b, {'c': DIM, 'dash': '8 7', 'sw': 3}) for a, b in GE2]).draw(MU2, 20, vcol=MU2)
fig += Graph({k: GV2[k] for k in 'PQR'}, SubE).draw(GR, 20, vcol=GR)
fig += T(250, 440, 'Subgraf: V = {P, Q, R}, E = {(P, Q), (Q, R), (P, R)}', GR, 17, halo=False)
add('5.1.3', 'CONTOH BERLANGKAH', 'Melukis subgraf',
    P(f'Graf G mempunyai V = {setstr("PQRST")} dan E = {edgestr([(a, b, {}) for a, b in GE2])}. Lukis satu subgraf dengan bucu P, Q dan R sahaja.', True)
    + STEPS(['Pilih bucu P, Q dan R.',
             'Ambil tepi G yang <b>kedua-dua hujungnya</b> dalam {P, Q, R}: (P, Q), (Q, R), (P, R).',
             'Boleh juga ambil sebahagian tepi itu sahaja: itu pun subgraf.'], col)
    + ANS('Segi tiga PQR (garis hijau)'),
    svg(fig, 'Graf G dengan subgraf PQR diserlahkan'))

# 5.1.3-3 Pokok: definisi
Tr = Graph({'A': (80, 90), 'B': (200, 90), 'C': (140, 200), 'D': (60, 290), 'E': (220, 290)},
           [('A', 'C'), ('B', 'C'), ('C', 'D'), ('C', 'E')])
Nt = Graph({'A': (300, 90), 'B': (420, 90), 'C': (360, 200), 'D': (280, 290), 'E': (440, 290)},
           [('A', 'B'), ('A', 'C'), ('B', 'C'), ('C', 'D'), ('C', 'E')])
assert Tr.is_tree() and not Nt.is_tree() and Tr.nE() == len(Tr.V) - 1
fig = RECT(14, 14, 230, 330, SURF, GR, 16, 2) + RECT(256, 14, 230, 330, SURF, RD, 16, 2)
fig += T(129, 40, 'Pokok ✓', GR, 19) + T(371, 40, 'Bukan pokok ✗', RD, 19)
fig += Tr.draw(GR, 18, fsz=17) + Nt.draw(RD, 18, fsz=17)
fig += T(129, 326, '5 bucu, 4 tepi', GR, 16, halo=False) + T(371, 326, 'ada litar A–B–C', RD, 16, halo=False)
fig += RECT(14, 358, 472, 98, SURF, BD, 16, 2)
fig += T(250, 392, 'Pokok: bilangan tepi = bilangan bucu − 1', AM, 19, halo=False)
fig += T(250, 426, 'E = V − 1', AM, 20, halo=False)
add('5.1.3', 'DEFINISI', 'Pokok',
    DEF('<b>Pokok</b> ialah graf mudah yang <b>terkait</b> (semua bucu bersambung) dan <b>tiada litar</b> (laluan tertutup).', col)
    + BUL(['Tiada gelung dan tiada berbilang tepi.',
           'Hanya ada <b>satu laluan</b> antara mana-mana dua bucu.',
           f'Bilangan tepi = bilangan bucu − 1, iaitu {B("E = V − 1", AM)}.'], col)
    + NOTE('Pokok bagi graf G ialah subgraf G yang merangkumi <b>semua bucu</b> G dan merupakan pokok.'),
    svg(fig, 'Contoh pokok dengan lima bucu dan empat tepi, dan graf yang bukan pokok kerana ada litar'))

# 5.1.3-4 Contoh: melukis pokok daripada graf
GV4 = {'A': (90, 80), 'B': (250, 60), 'C': (410, 80), 'D': (410, 260), 'E': (250, 300), 'F': (90, 260)}
GE4 = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('E', 'F'), ('F', 'A'), ('B', 'E'), ('A', 'E'), ('C', 'E')]
TreeE = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('B', 'E'), ('E', 'F')]
assert Graph(GV4, TreeE).is_tree() and len(GE4) - len(TreeE) == 4 and sub_of(list(GV4), TreeE, GV4, GE4)
tk = {frozenset(e) for e in TreeE}
fig = Graph(GV4, [(a, b, {'c': GR} if frozenset((a, b)) in tk else {'c': RD, 'dash': '7 7', 'sw': 3}) for a, b in GE4]).draw(GR, 20, vcol=AM)
fig += T(250, 380, '6 bucu → pokok perlu 5 tepi', AM, 19, halo=False)
fig += T(250, 414, '9 tepi − 5 tepi = buang 4 tepi', RD, 18, halo=False)
fig += T(250, 448, 'Hijau: tepi pokok · Merah putus: dibuang', MU3, 16, halo=False)
add('5.1.3', 'CONTOH BERLANGKAH', 'Melukis pokok daripada graf',
    P('Graf di sebelah mempunyai 6 bucu dan 9 tepi. Lukis satu pokok yang merangkumi semua bucu graf itu.', True)
    + STEPS(['Bilangan tepi pokok = 6 − 1 = 5.',
             'Buang 9 − 5 = 4 tepi supaya tiada litar.',
             'Pastikan semua bucu masih bersambung.'], col)
    + ANS('Contoh: tepi (A, B), (B, C), (C, D), (B, E), (E, F)')
    + NOTE('Ada lebih daripada satu pokok yang betul bagi sesuatu graf.'),
    svg(fig, 'Graf enam bucu dengan lima tepi pokok berwarna hijau dan empat tepi dibuang'))

# 5.1.3-5 Mengenal pasti pokok
cands = [
    ('W', Graph({'1': (0, 0), '2': (1, 0), '3': (0, 1), '4': (1, 1)}, [('1', '2'), ('2', '4'), ('4', '3')])),
    ('X', Graph({'1': (0, 0), '2': (1, 0), '3': (0, 1), '4': (1, 1)}, [('1', '2'), ('2', '4'), ('4', '3'), ('3', '1')])),
    ('Y', Graph({'1': (0, 0), '2': (1, 0), '3': (0, 1), '4': (1, 1)}, [('1', '2'), ('3', '4')])),
    ('Z', Graph({'1': (0, 0), '2': (1, 0), '3': (0, 1), '4': (1, 1)}, [('1', '2'), ('1', '3'), ('1', '4')])),
]
why = {'W': '3 tepi, terkait', 'X': 'ada litar', 'Y': 'tidak terkait', 'Z': '3 tepi, terkait'}
res = {n: g.is_tree() for n, g in cands}
assert res == {'W': True, 'X': False, 'Y': False, 'Z': True}
fig = ''
for i, (n, g) in enumerate(cands):
    x0, y0 = 14 + (i % 2) * 242, 14 + (i // 2) * 222
    ok = res[n]; cl = GR if ok else RD
    fig += RECT(x0, y0, 230, 210, SURF, cl, 16, 2)
    pos = {v: (x0 + 50 + x * 110, y0 + 50 + y * 100) for v, (x, y) in g.V.items()}
    fig += Graph(pos, [(a, b) for a, b, _ in g.E]).draw(cl, 13, lab=False)
    fig += T(x0 + 200, y0 + 30, n, cl, 22) + T(x0 + 115, y0 + 190, why[n], cl, 16, halo=False)
add('5.1.3', 'CONTOH', 'Adakah graf ini pokok?',
    P('Setiap graf di sebelah mempunyai 4 bucu. Graf manakah ialah pokok?', True)
    + STEPS(['Pokok dengan 4 bucu mesti ada 4 − 1 = <b>3 tepi</b>.',
             'X ada 4 tepi dan satu litar → bukan pokok.',
             'Y ada 2 tepi dan tidak terkait → bukan pokok.'], col)
    + ANS('W dan Z ialah pokok'),
    svg(fig, 'Empat graf W, X, Y, Z; W dan Z ialah pokok'))

# 5.1.3-6 Kesilapan biasa
fig = ''
CASES = [(48, 'Subgraf boleh ada tepi baharu', False), (108, 'Subgraf: buang bucu atau tepi sahaja', True),
         (188, 'E = V − 1 sudah cukup untuk pokok', False), (248, 'Pokok: terkait dan tiada litar', True),
         (328, 'Buang bucu tetapi kekalkan tepinya', False), (388, 'Buang bucu → buang tepinya juga', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 26, 460, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 17, 'start')
add('5.1.3', 'KESILAPAN BIASA', 'Semak subgraf dan pokok',
    BUL([f'{B("Menambah tepi", RD)} yang tiada dalam graf asal ✗ → subgraf hanya guna tepi graf asal.',
         f'{B("Hanya kira tepi", RD)} ✗ → graf dengan E = V − 1 tetapi tidak terkait bukan pokok.',
         f'{B("Tepi tergantung", RD)} ✗ → jika satu bucu dibuang, semua tepi pada bucu itu turut dibuang.'], col)
    + NOTE('Pokok: (1) terkait, (2) tiada litar, (3) E = V − 1.', 'Ringkasan:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang subgraf dan pokok'))

# ===================== 5.1.4 RANGKAIAN & MASALAH =====================
col = SUB['5.1.4'][1]

# 5.1.4-1 Rangkaian sosial
SOS = Graph({'Aina': (110, 90), 'Ben': (390, 90), 'Chong': (430, 270), 'Devi': (250, 370), 'Emir': (70, 270), 'Farah': (250, 210)},
            [('Aina', 'Ben'), ('Aina', 'Farah'), ('Ben', 'Farah'), ('Ben', 'Chong'), ('Chong', 'Devi'), ('Devi', 'Farah'), ('Emir', 'Aina'), ('Emir', 'Farah'), ('Chong', 'Farah')])
ds = SOS.deg_all()
assert ds['Farah'] == 5 and max(ds.values()) == 5 and sum(ds.values()) == 2 * SOS.nE() == 18 and sorted(ds.values()) == [2, 2, 3, 3, 3, 5]
fig = SOS.draw(PU, 26, vcol=AM, vlabel={k: k[0] for k in SOS.V})
for v, (x, y) in SOS.V.items():
    fig += T(x, y + (40 if y > 200 else -40), v, MU3, 16)
fig += T(250, 446, 'Farah mempunyai paling ramai kawan (darjah 5)', PU, 17, halo=False)
add('5.1.4', 'KONSEP', 'Rangkaian sosial',
    P('Maklumat dalam kehidupan boleh diwakilkan sebagai rangkaian.', True)
    + BUL([f'{B("Bucu", AM)}: individu (cth. murid dalam kelas).',
           f'{B("Tepi", PU)}: hubungan (cth. berkawan).',
           f'{B("Darjah", PK)}: bilangan kawan seseorang.'], col)
    + STEPS(['d(Farah) = 5 ialah darjah paling besar.', 'Farah ialah individu yang paling banyak berhubung.'], col)
    + NOTE('Rangkaian sosial yang saling berkawan ialah graf <b>tidak terarah</b>.'),
    svg(fig, 'Rangkaian sosial enam murid; Farah mempunyai lima kawan'))

# 5.1.4-2 Daripada jadual kepada rangkaian pengangkutan
TOWN = {'Ipoh': (100, 90), 'Kuala Lumpur': (250, 250), 'Kuantan': (420, 150), 'Seremban': (330, 390), 'Melaka': (130, 380)}
TE = [('Ipoh', 'Kuala Lumpur', 205), ('Kuala Lumpur', 'Kuantan', 250), ('Kuala Lumpur', 'Seremban', 65), ('Seremban', 'Melaka', 85), ('Kuala Lumpur', 'Melaka', 145), ('Ipoh', 'Kuantan', 320)]
GT = Graph(TOWN, [(a, b, {'w': w, 'wo': 0}) for a, b, w in TE])
assert GT.nE() == 6 and GT.deg('Kuala Lumpur') == 4
VLT = {'Ipoh': 'I', 'Kuala Lumpur': 'K', 'Kuantan': 'N', 'Seremban': 'S', 'Melaka': 'M'}
fig = GT.draw(PU, 22, vcol=AM, vlabel=VLT)
fig += T(100, 50, 'Ipoh', MU3, 16) + T(250, 292, 'Kuala Lumpur', MU3, 16) + T(420, 110, 'Kuantan', MU3, 16) + T(400, 412, 'Seremban', MU3, 16, 'start') + T(130, 422, 'Melaka', MU3, 16)
fig += T(250, 454, 'pemberat = jarak jalan raya (km, anggaran)', MU3, 15, halo=False)
add('5.1.4', 'CONTOH BERLANGKAH', 'Mewakilkan jadual sebagai rangkaian',
    P('Jadual menunjukkan jalan raya yang menghubungkan beberapa bandar. Wakilkan maklumat itu sebagai graf berpemberat.', True)
    + TABLE(['Jalan', 'Jarak (km)'], [[f'{a} – {b}', str(w)] for a, b, w in TE], col)
    + STEPS(['Setiap bandar ialah satu bucu; setiap jalan ialah satu tepi.', 'Tulis jarak sebagai pemberat pada tepi.'], col),
    svg(fig, 'Rangkaian jalan raya antara lima bandar dengan jarak sebagai pemberat'))


# 5.1.4-3 Laluan terpendek
GS = Graph({'A': (60, 220), 'B': (190, 90), 'C': (190, 350), 'D': (330, 90), 'E': (330, 350), 'F': (450, 220)},
           [('A', 'B', {'w': 4, 'wo': -18}), ('A', 'C', {'w': 2, 'wo': 18}), ('B', 'C', {'w': 1, 'wo': -18}), ('B', 'D', {'w': 5, 'wo': -18}),
            ('C', 'E', {'w': 10, 'wo': 18}), ('D', 'E', {'w': 3, 'wo': -18}), ('D', 'F', {'w': 6, 'wo': -18}), ('E', 'F', {'w': 2, 'wo': 18}), ('C', 'D', {'w': 10, 'wo': 14})])
allp = all_paths(GS, 'A', 'F'); mn = min(path_weight(GS, p) for p in allp)
best = [p for p in allp if path_weight(GS, p) == mn]
assert mn == 13 == dijkstra(GS, 'A')['F'] and best == [['A', 'C', 'B', 'D', 'E', 'F']], best
pairs = {frozenset(x) for x in zip(best[0], best[0][1:])}
fig = Graph(GS.V, [(a, b, dict(o, c=GR, sw=6) if frozenset((a, b)) in pairs else o) for a, b, o in GS.E]).draw(PU, 21, vcol=AM)
fig += T(250, 428, 'Terpendek: A → C → B → D → E → F', GR, 19, halo=False) + T(250, 456, '2 + 1 + 5 + 3 + 2 = 13 km', GR, 18, halo=False)
cmp = [['A', 'B', 'D', 'F'], ['A', 'C', 'E', 'F'], ['A', 'B', 'D', 'E', 'F'], ['A', 'C', 'B', 'D', 'E', 'F']]
cw = [path_weight(GS, p) for p in cmp]
assert cw == [15, 14, 14, 13], cw
add('5.1.4', 'CONTOH BERLANGKAH', 'Laluan terpendek',
    P('Pemberat ialah jarak (km). Cari laluan terpendek dari A ke F.', True)
    + TABLE(['Laluan', 'Jarak (km)'], [[' → '.join(p), ' + '.join(str(path_weight(GS, [a, b])) for a, b in zip(p, p[1:])) + f' = {w}'] for p, w in zip(cmp, cw)], col, rv=True)
    + ANS('A → C → B → D → E → F, 13 km')
    + NOTE('Laluan dengan paling sedikit tepi <b>tidak semestinya</b> paling pendek. Bandingkan jumlah pemberat.'),
    svg(fig, 'Graf berpemberat enam bucu; laluan terpendek dari A ke F diserlahkan'))

# 5.1.4-4 Kos optimum: masa dan tol
KO = {('R', 'X'): (15, 3), ('X', 'L'): (20, 5), ('R', 'Y'): (25, 0), ('Y', 'L'): (22, 0), ('X', 'Y'): (10, 0)}
GK = Graph({'R': (70, 230), 'X': (250, 90), 'Y': (250, 370), 'L': (430, 230)},
           [(a, b, {'w': f'{m} min · RM{k}', 'wo': (-26 if b != 'Y' or a == 'X' else 26) if (a, b) != ('X', 'Y') else 0}) for (a, b), (m, k) in KO.items()])
def cost(p):
    m = k = 0
    for a, b in zip(p, p[1:]):
        mm, kk = KO.get((a, b)) or KO[(b, a)]; m += mm; k += kk
    return m, k
rts = [['R', 'X', 'L'], ['R', 'Y', 'L'], ['R', 'X', 'Y', 'L'], ['R', 'Y', 'X', 'L']]
cs = [cost(p) for p in rts]
assert cs == [(35, 8), (47, 0), (47, 3), (55, 5)], cs
ok50 = [p for p, (m, k) in zip(rts, cs) if m <= 50]; cheapest = min(ok50, key=lambda p: cost(p)[1])
assert cheapest == ['R', 'Y', 'L'] and min(rts, key=lambda p: cost(p)[0]) == ['R', 'X', 'L']
fig = GK.draw(PU, 22, vcol=AM, wcol=AM)
fig += T(70, 190, 'Rumah', MU3, 16) + T(430, 190, 'Lapangan', MU3, 16)
fig += T(250, 430, 'Pemberat: masa (minit) · tol (RM)', MU3, 17, halo=False)
add('5.1.4', 'PENYELESAIAN MASALAH', 'Kos optimum: masa atau wang?',
    P('Encik Hadi memandu dari rumah (R) ke lapangan terbang (L). Dia mesti tiba dalam masa <b>50 minit</b> dengan bayaran tol paling rendah. Laluan manakah sesuai?', True)
    + TABLE(['Laluan', 'Masa', 'Tol'], [[' → '.join(p), f'{m} min', f'RM{k}'] for p, (m, k) in zip(rts, cs)], col, rv=True)
    + ANS('R → Y → L (47 minit, RM0)')
    + NOTE('Kos boleh bermaksud <b>masa, jarak atau perbelanjaan</b>. Baca syarat soalan dengan teliti.'),
    svg(fig, 'Rangkaian rumah ke lapangan terbang dengan masa dan bayaran tol'))

# 5.1.4-5 Rangkaian berbanding peta
fig = RECT(14, 14, 230, 300) + RECT(256, 14, 230, 300)
fig += T(129, 40, 'Peta', MU3, 19) + T(371, 40, 'Rangkaian', PU, 19)
# peta: jalan berliku
fig += f'<path d="M50 120 C90 80 120 160 160 110 S220 90 210 150" fill="none" stroke="{MU2}" stroke-width="7" stroke-linecap="round"/>'
fig += f'<path d="M50 120 C60 190 100 230 130 270" fill="none" stroke="{MU2}" stroke-width="7" stroke-linecap="round"/>'
fig += f'<path d="M210 150 C230 210 170 240 130 270" fill="none" stroke="{MU2}" stroke-width="7" stroke-linecap="round"/>'
fig += f'<path d="M60 70 C110 60 150 70 220 70" fill="none" stroke="{TR}" stroke-width="5" stroke-opacity="0.6"/>'
for x, y, n, dx, dy in [(50, 120, 'P', -2, -24), (210, 150, 'Q', 22, 0), (130, 270, 'R', -24, 6)]:
    fig += f'<circle cx="{x}" cy="{y}" r="11" fill="{AM}"/>' + T(x + dx, y + dy, n, AM, 17)
fig += Graph({'P': (300, 110), 'Q': (440, 110), 'R': (370, 250)},
             [('P', 'Q', {'w': '18 km', 'wo': -18}), ('Q', 'R', {'w': '12 km', 'wo': -26}), ('P', 'R', {'w': '15 km', 'wo': 26})]).draw(PU, 18, vcol=AM, fsz=17)
fig += RECT(14, 330, 472, 126, SURF, BD, 16, 2)
fig += T(250, 362, 'Peta: kedudukan & bentuk jalan sebenar', MU3, 17, halo=False)
fig += T(250, 396, 'Rangkaian: hanya hubungan & pemberat', PU, 17, halo=False)
fig += T(250, 430, 'Rangkaian lebih ringkas untuk kira laluan', GR, 17, halo=False)
add('5.1.4', 'BANDING & BEZA', 'Rangkaian pengangkutan dan peta',
    TABLE(['', 'Rangkaian', 'Peta'],
          [['Kelebihan', 'Ringkas; mudah lihat sambungan dan kira jumlah pemberat', 'Tunjuk kedudukan, arah dan bentuk jalan sebenar'],
           ['Kekurangan', 'Tiada skala; kedudukan bucu tidak tepat', 'Terlalu banyak butiran; sukar membanding laluan']], col, rv=True)
    + BUL(['Peta laluan LRT dan MRT ialah contoh rangkaian pengangkutan: stesen = bucu, landasan = tepi.'], col),
    svg(fig, 'Perbandingan peta jalan dengan rangkaian berpemberat bagi tiga tempat'))

# 5.1.4-6 Kesilapan biasa
fig = ''
CASES = [(48, 'Pilih laluan paling sedikit tepi', False), (108, 'Pilih jumlah pemberat paling kecil', True),
         (188, 'Lalu bucu yang sama dua kali', False), (248, 'Laluan tidak mengulang bucu', True),
         (328, 'Abaikan syarat (masa / bajet)', False), (388, 'Tapis laluan ikut syarat dahulu', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 26, 460, 52, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 18, 'start')
add('5.1.4', 'KESILAPAN BIASA', 'Semasa menyelesaikan masalah',
    BUL([f'{B("Kira bilangan tepi", RD)} sebagai jarak ✗ → jumlahkan <b>pemberat</b>.',
         f'{B("Terlepas laluan", RD)} ✗ → senaraikan laluan secara sistematik dari bucu permulaan.',
         f'{B("Abaikan syarat", RD)} ✗ → laluan termurah mungkin terlalu lama; semak syarat soalan.'], col)
    + NOTE('Lukis rangkaian, labelkan pemberat, senaraikan laluan, kemudian bandingkan.', 'Strategi:'),
    svg(fig, 'Contoh kenyataan salah dan betul tentang penyelesaian masalah rangkaian'))

# 5.1.4-7 Ringkasan bab
fig = ''
SUMM = [('Graf mudah', GR, Graph({'a': (0, 0), 'b': (1, 0), 'c': (.5, 1)}, [('a', 'b'), ('b', 'c'), ('c', 'a')])),
        ('Terarah', PA, Graph({'a': (0, 0), 'b': (1, 0), 'c': (.5, 1)}, [('a', 'b'), ('b', 'c'), ('c', 'a')], directed=True)),
        ('Berpemberat', AM, Graph({'a': (0, 0), 'b': (1, 0), 'c': (.5, 1)}, [('a', 'b', {'w': 3}), ('b', 'c'), ('c', 'a')])),
        ('Pokok', TR, Graph({'a': (0, 0), 'b': (1, 0), 'c': (.5, 1)}, [('a', 'b'), ('b', 'c')]))]
for i, (nm, cl, g) in enumerate(SUMM):
    y0 = 14 + i * 112
    fig += RECT(14, y0, 472, 100, SURF, BD, 16, 2)
    pos = {v: (44 + x * 90, y0 + 78 - y * 56) for v, (x, y) in g.V.items()}
    fig += Graph(pos, [(a, b, dict(o, wo=-16) if 'w' in o else o) for a, b, o in g.E], directed=g.directed).draw(cl, 10, lab=False, wcol=AM)
    fig += T(170, y0 + 50, nm, cl, 22, 'start')
add('5.1.4', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Istilah', 'Maksud'],
          [['Darjah', 'Bilangan tepi pada bucu (gelung = 2)'],
           ['Σ darjah', '2 × bilangan tepi'],
           ['Graf terarah', 'Tepi ada arah (anak panah)'],
           ['Graf berpemberat', 'Tepi ada nilai: jarak, masa, kos'],
           ['Subgraf', 'Bucu dan tepi semuanya daripada graf asal'],
           ['Pokok', 'Terkait, tiada litar, E = V − 1']], col, rv=True),
    svg(fig, 'Ringkasan jenis graf: graf mudah, terarah, berpemberat dan pokok'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': s['full'] or ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and 'inf' not in js_body.replace('info', '')
assert counts == {'5.1.1': 6, '5.1.2': 6, '5.1.3': 6, '5.1.4': 7}, counts

js = ('/* Dijana oleh tools/teorigraf/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
