# Penjana slaid NOTA OPERASI SET (Tingkatan 4 Bab 4) -> operasiset/slides.js
# Jalankan:  python3 tools/operasiset/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'operasiset', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
SUB = {
    '4.1': ('Persilangan Set', GR),
    '4.2': ('Kesatuan Set', PA),
    '4.3': ('Gabungan Operasi Set', PU),
}
SETCOL = [TR, PK, AM]          # warna tetap: set pertama biru, kedua merah jambu, ketiga kuning
SHADE = GR + '5C'               # lorek: hijau lut sinar
CAP, CUP, PR, XI, EMP = '∩', '∪', '′', 'ξ', '∅'

# =================== ungkapan set (penghurai kecil) ===================
def tokens(s):
    return [c for c in s if c not in ' ']

def parse(s):
    """'(A ∪ B)′ ∩ C' -> pokok: ('s','A') | ('n',x) | ('i',x,y) | ('u',x,y)"""
    t = tokens(s); pos = [0]
    def peek(): return t[pos[0]] if pos[0] < len(t) else None
    def eat(): pos[0] += 1; return t[pos[0] - 1]
    def unary():
        c = eat()
        if c == '(':
            x = expr(); assert eat() == ')'
        else:
            assert c.isalpha(), s; x = ('s', c)
        while peek() == PR: eat(); x = ('n', x)
        return x
    def expr():
        x = unary(); op = None
        while peek() in (CAP, CUP):
            o = eat(); assert op in (None, o), 'campur operasi tanpa kurungan: ' + s; op = o
            x = ('i' if o == CAP else 'u', x, unary())
        return x
    x = expr(); assert pos[0] == len(t), s
    return x

def ev(tree, U, S):
    """Nilai ungkapan dengan set Python. U = set semesta, S = {'A': set ...}"""
    k = tree[0]
    if k == 's': return set(S[tree[1]])
    if k == 'n': return set(U) - ev(tree[1], U, S)
    a, b = ev(tree[1], U, S), ev(tree[2], U, S)
    return a & b if k == 'i' else a | b

def region(expr, n, names='ABC'):
    """Topeng atom (atom a = bit set ahli) bagi ungkapan, n set."""
    U = set(range(1 << n)); S = {names[k]: {a for a in U if a >> k & 1} for k in range(n)}
    return sum(1 << a for a in ev(parse(expr), U, S))

def fset(s):
    s = sorted(s, key=lambda v: (isinstance(v, str), v))
    return '{' + ', '.join(str(v) for v in s) + '}' if s else EMP

# =================== pembantu teks ===================
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

# =================== pembantu rajah ===================
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470
def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="5" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def LINE(p, q, col=TX, sw=4, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

# ---------- susun atur Venn (sama seperti soalan.js & simulasi) ----------
LAYOUT = {
    'L2':  dict(w=340, h=230, c=[(128, 118, 80), (212, 118, 80)], lab=[(58, 40), (282, 40)]),
    'L2s': dict(w=340, h=230, c=[(160, 118, 95), (188, 128, 46)], lab=[(70, 40), (188, 70)]),
    'L2d': dict(w=340, h=230, c=[(96, 118, 64), (244, 118, 64)], lab=[(40, 50), (300, 50)]),
    'L3':  dict(w=340, h=286, c=[(128, 110, 82), (212, 110, 82), (170, 183, 82)], lab=[(60, 32), (280, 32), (272, 262)]),
    'L3r': dict(w=340, h=230, c=[(88, 118, 62), (170, 118, 62), (252, 118, 62)], lab=[(40, 56), (170, 40), (300, 56)]),
    'L3s': dict(w=340, h=230, c=[(150, 118, 92), (254, 118, 60), (120, 130, 40)], lab=[(56, 40), (300, 52), (120, 78)]),
}

class Venn:
    """Rajah Venn: kotak (x0,y0,x1,y1) dalam piksel slaid; susun atur diskala sama rata."""
    def __init__(self, kind, box, names='ABC', fs=1.0, top=False):
        L = LAYOUT[kind]; x0, y0, x1, y1 = box
        s = min((x1 - x0) / L['w'], (y1 - y0) / L['h'])
        ox = (x0 + x1) / 2 - s * L['w'] / 2; oy = y0 if top else (y0 + y1) / 2 - s * L['h'] / 2
        self.s, self.ox, self.oy = s, ox, oy
        f = lambda x, y: (ox + s * x, oy + s * y)
        self.rect = (*f(12, 12), *f(L['w'] - 12, L['h'] - 12))
        self.c = [(*f(cx, cy), r * s) for cx, cy, r in L['c']]
        self.lab = [f(*p) for p in L['lab']]
        self.xi = f(26, 30)
        self.n = len(self.c); self.names = names[:self.n]; self.fs = fs
    def atom(self, x, y):
        return sum(1 << k for k, (cx, cy, r) in enumerate(self.c) if (x - cx) ** 2 + (y - cy) ** 2 < r * r)
    def region(self, expr):
        return region(expr, self.n, self.names)
    def path(self, mask):
        """Laluan SVG (evenodd) bagi kesatuan atom dalam mask."""
        cs, V, cuts = self.c, [], [[] for _ in self.c]
        for i in range(len(cs)):
            for j in range(i + 1, len(cs)):
                (x1, y1, r1_), (x2, y2, r2) = cs[i], cs[j]
                d = math.hypot(x2 - x1, y2 - y1)
                if d >= r1_ + r2 or d <= abs(r1_ - r2): continue
                a = (r1_ * r1_ - r2 * r2 + d * d) / (2 * d); h = math.sqrt(r1_ * r1_ - a * a)
                mx, my = x1 + a * (x2 - x1) / d, y1 + a * (y2 - y1) / d
                for sg in (1, -1):
                    p = (mx + sg * h * (y2 - y1) / d, my - sg * h * (x2 - x1) / d)
                    V.append(p); k = len(V) - 1
                    cuts[i].append((math.atan2(p[1] - y1, p[0] - x1), k))
                    cuts[j].append((math.atan2(p[1] - y2, p[0] - x2), k))
        inR = lambda a: mask >> a & 1
        def others(i, x, y):
            return sum(1 << k for k, (cx, cy, r) in enumerate(cs) if k != i and (x - cx) ** 2 + (y - cy) ** 2 < r * r)
        edges, loops = [], []
        for i, (cx, cy, r) in enumerate(cs):
            cu = sorted(cuts[i])
            if not cu:
                m = others(i, cx + r, cy)
                if inR(m | 1 << i) != inR(m):
                    loops.append(f'M{r1(cx + r)} {r1(cy)}A{r1(r)} {r1(r)} 0 1 1 {r1(cx - r)} {r1(cy)}A{r1(r)} {r1(r)} 0 1 1 {r1(cx + r)} {r1(cy)}Z')
                continue
            for k in range(len(cu)):
                t0, a = cu[k]; t1, b = cu[(k + 1) % len(cu)]
                if k + 1 == len(cu): t1 += 2 * math.pi
                tm = (t0 + t1) / 2; m = others(i, cx + r * math.cos(tm), cy + r * math.sin(tm))
                if inR(m | 1 << i) != inR(m):
                    edges.append(dict(i=i, a=a, b=b, big=1 if t1 - t0 > math.pi else 0))
        used = [False] * len(edges)
        for s0 in range(len(edges)):
            if used[s0]: continue
            start = cur = edges[s0]['a']; d = f'M{r1(V[start][0])} {r1(V[start][1])}'; e = s0
            while True:
                used[e] = True; E = edges[e]; fwd = E['a'] == cur; nxt = E['b'] if fwd else E['a']; r = cs[E['i']][2]
                d += f'A{r1(r)} {r1(r)} 0 {E["big"]} {1 if fwd else 0} {r1(V[nxt][0])} {r1(V[nxt][1])}'
                cur = nxt
                if cur == start: break
                e = next(k for k in range(len(edges)) if not used[k] and cur in (edges[k]['a'], edges[k]['b']))
            loops.append(d + 'Z')
        if inR(0):
            x0, y0, x1, y1 = self.rect
            loops.append(f'M{r1(x0)} {r1(y0)}H{r1(x1)}V{r1(y1)}H{r1(x0)}Z')
        return ''.join(loops)
    def slots(self, a, sp=(24, 19), clear=9):
        """Kedudukan untuk menulis unsur dalam atom a (terdalam dahulu)."""
        x0, y0, x1, y1 = self.rect; st = 3 * self.s; pts = []
        avoid = self.lab + [self.xi]
        y = y0 + st
        while y < y1:
            x = x0 + st
            while x < x1:
                if self.atom(x, y) == a:
                    cl = min([abs(math.hypot(x - cx, y - cy) - r) for cx, cy, r in self.c] + [x - x0, x1 - x, y - y0, y1 - y])
                    if cl >= clear * self.s and all(math.hypot(x - p[0], y - p[1]) > 28 * self.s for p in avoid):
                        pts.append((cl, x, y))
                x += st
            y += st
        pts.sort(key=lambda p: -p[0]); out = []
        for cl, x, y in pts:
            if all(abs(x - u) >= sp[0] * self.s or abs(y - v) >= sp[1] * self.s for u, v in out): out.append((x, y))
        return out
    def draw(self, mask=None, els=None, cnt=None, shade=SHADE, xi=True, names=True, sz=None):
        x0, y0, x1, y1 = self.rect; fs = sz or max(15, 17 * self.s * self.fs)
        s = f'<rect x="{r1(x0)}" y="{r1(y0)}" width="{r1(x1 - x0)}" height="{r1(y1 - y0)}" rx="{r1(8 * self.s)}" fill="{SURF}" stroke="{MU}" stroke-width="2.5"/>'
        if mask: s += f'<path d="{self.path(mask)}" fill="{shade}" fill-rule="evenodd"/>'
        for k, (cx, cy, r) in enumerate(self.c):
            s += f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{r1(r)}" fill="none" stroke="{SETCOL[k]}" stroke-width="3.5"/>'
        if names:
            for k, (x, y) in enumerate(self.lab):
                s += T(x, y, self.names[k], SETCOL[k], fs * 1.2, italic=False)
        if xi: s += T(*self.xi, XI, MU3, fs * 1.15)
        if els:
            for a, items in els.items():
                sl = self.slots(a)
                assert len(sl) >= len(items), f'unsur tidak muat dalam atom {a}: {items}'
                sl = sorted(sl[:len(items)], key=lambda p: (round(p[1] / (19 * self.s)), p[0]))
                for (x, y), v in zip(sl, items):
                    s += T(x, y, v, TX, fs, weight=600, halo=False)
        if cnt:
            for a, v in cnt.items():
                x, y = self.slots(a)[0]
                s += T(x, y, v, TX, fs * 1.05)
        return s

def atoms_of(names, U, S):
    """Bahagikan unsur U kepada atom Venn."""
    out = {}
    for v in U:
        a = sum(1 << k for k, nm in enumerate(names) if v in S[nm])
        out.setdefault(a, []).append(v)
    return {a: [str(x) for x in sorted(vs)] for a, vs in out.items()}

def panel(kind, box, expr, title, names='ABC', col=TX):
    """Venn kecil berlabel tajuk di atas."""
    x0, y0, x1, y1 = box
    v = Venn(kind, (x0, y0 + 32, x1, y1), names, top=True)
    return T((x0 + x1) / 2, y0 + 16, title, col, 20) + v.draw(v.region(expr), xi=False, sz=15)

# =================== slaid ===================
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# data contoh bersama (subtopik 4.1 & 4.2)
U10 = set(range(1, 11)); A10 = {x for x in U10 if x % 2 == 0}; B10 = {x for x in U10 if x % 3 == 0}
S10 = {'A': A10, 'B': B10}
assert A10 == {2, 4, 6, 8, 10} and B10 == {3, 6, 9}
assert ev(parse('A ∩ B'), U10, S10) == {6}
assert ev(parse('(A ∩ B)′'), U10, S10) == {1, 2, 3, 4, 5, 7, 8, 9, 10}
assert ev(parse('A ∪ B'), U10, S10) == {2, 3, 4, 6, 8, 9, 10}
assert ev(parse('(A ∪ B)′'), U10, S10) == {1, 5, 7}
E10 = atoms_of('AB', U10, S10)
XI10 = f'{XI} = {{<i>x</i> : <i>x</i> ialah integer, 1 ≤ <i>x</i> ≤ 10}}'

# ===================== 4.1 PERSILANGAN SET =====================
col = SUB['4.1'][1]

# 4.1-1 Definisi
v = Venn('L2', (14, 60, 486, 420))
fig = v.draw(v.region('A ∩ B'), E10) + T(250, 30, 'A ∩ B = {6}', GR, 24) + T(250, 446, 'Rantau bertindih = unsur sepunya', MU3, 18, halo=False)
add('4.1', 'DEFINISI', 'Persilangan set',
    DEF(f'<b>Persilangan</b> set A dan set B, ditulis {B("A ∩ B", col)}, ialah set yang mengandungi <b>unsur sepunya</b>, iaitu unsur yang ada dalam set A <b>dan</b> dalam set B.', col)
    + BUL([f'Simbol {B("∩", col)} dibaca "persilangan".',
           f'Dalam gambar rajah Venn, A ∩ B ialah {B("rantau bertindih", col)} antara dua bulatan.'], col)
    + P(f'{XI10}, A = {{nombor genap}}, B = {{gandaan 3}}.', True)
    + P(f'A ∩ B = {B("{6}", col)} dan <i>n</i>(A ∩ B) = 1.', True),
    svg(fig, 'Gambar rajah Venn dua set dengan rantau persilangan A ∩ B berlorek'))

# 4.1-2 Contoh berlangkah
U12 = set(range(1, 13)); P12 = {x for x in U12 if 12 % x == 0}; Q12 = {x for x in U12 if x % 2 == 0}
I12 = P12 & Q12
assert P12 == {1, 2, 3, 4, 6, 12} and Q12 == {2, 4, 6, 8, 10, 12} and I12 == {2, 4, 6, 12}
v = Venn('L2', (14, 60, 486, 420), 'PQ')
fig = v.draw(v.region('P ∩ Q'), atoms_of('PQ', U12, {'P': P12, 'Q': Q12})) + T(250, 30, 'P ∩ Q = {2, 4, 6, 12}', GR, 24)
add('4.1', 'CONTOH BERLANGKAH', 'Menyenaraikan unsur P ∩ Q',
    P(f'{XI} = {{<i>x</i> : <i>x</i> ialah integer, 1 ≤ <i>x</i> ≤ 12}}, P = {{faktor bagi 12}}, Q = {{nombor genap}}. Senaraikan unsur P ∩ Q dan nyatakan <i>n</i>(P ∩ Q).', True)
    + STEPS([f'P = {fset(P12)}',
             f'Q = {fset(Q12)}',
             f'Pilih unsur yang ada dalam <b>kedua-dua</b> set: P ∩ Q = {fset(I12)}'], col)
    + ANS(f'P ∩ Q = {fset(I12)}, <i>n</i>(P ∩ Q) = {len(I12)}'),
    svg(fig, 'Gambar rajah Venn bagi set P dan Q dengan unsur-unsurnya'))

# 4.1-3 Tiga set
U3 = set(range(1, 11)); A3 = {1, 2, 3, 4, 5, 6}; B3 = {2, 4, 6, 8, 10}; C3 = {1, 2, 3, 6, 9}
S3 = {'A': A3, 'B': B3, 'C': C3}
assert ev(parse('A ∩ B'), U3, S3) == {2, 4, 6} and ev(parse('A ∩ B ∩ C'), U3, S3) == {2, 6}
v = Venn('L3', (14, 50, 486, 430))
fig = v.draw(v.region('A ∩ B ∩ C')) + T(250, 26, 'A ∩ B ∩ C', GR, 24) + T(250, 452, 'Rantau yang dikongsi oleh KETIGA-TIGA bulatan', MU3, 17, halo=False)
add('4.1', 'TIGA SET', 'Persilangan tiga set',
    DEF(f'{B("A ∩ B ∩ C", col)} ialah set unsur yang ada dalam set A, set B <b>dan</b> set C.', col)
    + P(f'A = {fset(A3)}, B = {fset(B3)}, C = {fset(C3)}. Cari A ∩ B ∩ C.', True)
    + STEPS([f'A ∩ B = {fset(A3 & B3)}',
             f'(A ∩ B) ∩ C = {fset(A3 & B3 & C3)}'], col)
    + ANS(f'A ∩ B ∩ C = {fset(A3 & B3 & C3)}')
    + NOTE('Cari persilangan dua set dahulu, kemudian silangkan hasilnya dengan set ketiga.'),
    svg(fig, 'Gambar rajah Venn tiga set dengan rantau tengah A ∩ B ∩ C berlorek'))

# 4.1-4 Pelengkap persilangan
assert region('(A ∩ B)′', 2) == 0b0111 and region('A′ ∩ B', 2) == 0b0100 and region('A ∩ B′', 2) == 0b0010 and region('A′ ∩ B′', 2) == 0b0001
fig = (panel('L2', (6, 4, 246, 232), '(A ∩ B)′', '(A ∩ B)′', col=GR) + panel('L2', (254, 4, 494, 232), 'A′ ∩ B', 'A′ ∩ B', col=GR)
       + panel('L2', (6, 238, 246, 466), 'A ∩ B′', 'A ∩ B′', col=GR) + panel('L2', (254, 238, 494, 466), 'A′ ∩ B′', 'A′ ∩ B′', col=GR))
NB = ev(parse('(A ∩ B)′'), U10, S10)
add('4.1', 'PELENGKAP', 'Pelengkap bagi persilangan set',
    DEF(f'{B("(A ∩ B)′", col)} ialah set semua unsur dalam {XI} yang <b>bukan</b> unsur A ∩ B.', col)
    + P(f'Dengan {XI} = {{1, 2, …, 10}}, A ∩ B = {{6}}:', True)
    + STEPS([f'(A ∩ B)′ = {fset(NB)}',
             f'<i>n</i>((A ∩ B)′) = <i>n</i>({XI}) − <i>n</i>(A ∩ B) = 10 − 1 = {len(NB)}'], col)
    + BUL(['A′ ∩ B: dalam B tetapi <b>bukan</b> dalam A.', 'A ∩ B′: dalam A tetapi <b>bukan</b> dalam B.'], col),
    svg(fig, 'Empat gambar rajah Venn berlorek: (A ∩ B)′, A′ ∩ B, A ∩ B′ dan A′ ∩ B′'))

# 4.1-5 Penyelesaian masalah
nU, nS, nM, nNone = 40, 18, 15, 12
x = nS + nM + nNone - nU
assert x == 5 and (nS - x) + x + (nM - x) + nNone == nU
v = Venn('L2', (14, 40, 486, 400), 'SM')
fig = (v.draw(None, cnt={1: '18 − x', 3: 'x', 2: '15 − x', 0: '12'}, sz=22)
       + RECT(40, 410, 420, 50, SURF, BD, 14) + T(250, 435, '(18 − x) + x + (15 − x) + 12 = 40', AM, 20))
add('4.1', 'PENYELESAIAN MASALAH', 'Berapa murid menyertai kedua-dua kelab?',
    P(f'Dalam sebuah kelas {nU} murid, {nS} murid menyertai Kelab Sains (S), {nM} murid menyertai Kelab Matematik (M) dan {nNone} murid tidak menyertai kedua-dua kelab. Cari <i>n</i>(S ∩ M).', True)
    + STEPS([f'Katakan <i>n</i>(S ∩ M) = <i>x</i>. Isi rajah Venn dari tengah ke luar.',
             f'(18 − <i>x</i>) + <i>x</i> + (15 − <i>x</i>) + 12 = 40 → 45 − <i>x</i> = 40',
             f'<i>x</i> = {x}'], col)
    + ANS(f'<i>n</i>(S ∩ M) = {x} murid'),
    svg(fig, 'Gambar rajah Venn kelab sains dan kelab matematik dengan bilangan murid'))

# 4.1-6 Kesilapan biasa
assert region('(A ∩ B)′', 2) != region('A′ ∩ B′', 2) and region('(A ∩ B)′', 2) == region('A′ ∪ B′', 2)
fig = (panel('L2', (6, 4, 246, 220), '(A ∩ B)′', '(A ∩ B)′', col=GR) + panel('L2', (254, 4, 494, 220), 'A′ ∩ B′', 'A′ ∩ B′', col=RD)
       + T(250, 120, '≠', RD, 40))
rows = [(266, True, 'A ∩ B = ∅ (tiada unsur sepunya)'), (318, False, 'A ∩ B = {0}'),
        (378, True, '{2, 4} ∩ {4, 6} = {4}'), (430, False, '{2, 4} ∩ {4, 6} = {4, 4}')]
for y, ok, t in rows:
    fig += RECT(30, y - 22, 440, 44, SURF, GR if ok else RD, 12, 2) + (TICK(56, y) if ok else CROSS(56, y)) + T(84, y, t, GR if ok else RD, 19, 'start')
add('4.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("(A ∩ B)′ bukan A′ ∩ B′", RD)}: lorek semua rantau <b>kecuali</b> rantau bertindih.',
         f'{B("Set kosong", RD)}: jika tiada unsur sepunya, tulis A ∩ B = ∅ atau {{ }}, bukan {{0}}.',
         f'{B("Unsur berulang", RD)}: unsur sepunya ditulis <b>sekali</b> sahaja.'], col)
    + NOTE('Semak jawapan dengan rajah Venn: setiap unsur A ∩ B mesti berada dalam kedua-dua bulatan.'),
    svg(fig, 'Perbandingan (A ∩ B)′ dengan A′ ∩ B′ serta contoh jawapan betul dan salah'))

# 4.1-7 Ringkasan
fig = (panel('L2', (6, 4, 246, 232), 'A ∩ B', 'A ∩ B', col=GR) + panel('L2', (254, 4, 494, 232), '(A ∩ B)′', '(A ∩ B)′', col=GR)
       + panel('L3', (6, 238, 246, 466), 'A ∩ B ∩ C', 'A ∩ B ∩ C', col=GR) + panel('L2', (254, 238, 494, 466), 'A′ ∩ B', 'A′ ∩ B', col=GR))
add('4.1', 'RINGKASAN', 'Ringkasan persilangan set',
    TABLE(['Tatatanda', 'Maksud'],
          [['A ∩ B', 'unsur dalam A <b>dan</b> B'],
           ['A ∩ B ∩ C', 'unsur dalam ketiga-tiga set'],
           ['(A ∩ B)′', 'unsur dalam ξ, bukan dalam A ∩ B'],
           ['<i>n</i>(A ∩ B)', 'bilangan unsur sepunya']], col, rv=True)
    + NOTE('Persilangan = rantau <b>bertindih</b> dalam rajah Venn.'),
    svg(fig, 'Ringkasan rantau persilangan dalam gambar rajah Venn'))

# ===================== 4.2 KESATUAN SET =====================
col = SUB['4.2'][1]

# 4.2-1 Definisi
v = Venn('L2', (14, 60, 486, 420))
fig = v.draw(v.region('A ∪ B'), E10) + T(250, 30, 'A ∪ B = {2, 3, 4, 6, 8, 9, 10}', GR, 22) + T(250, 446, 'Semua rantau di dalam bulatan A atau B', MU3, 18, halo=False)
U_AB = ev(parse('A ∪ B'), U10, S10)
add('4.2', 'DEFINISI', 'Kesatuan set',
    DEF(f'<b>Kesatuan</b> set A dan set B, ditulis {B("A ∪ B", col)}, ialah set yang mengandungi <b>semua</b> unsur set A <b>atau</b> set B <b>atau</b> kedua-duanya.', col)
    + BUL([f'Simbol {B("∪", col)} dibaca "kesatuan".',
           'Dalam gambar rajah Venn, A ∪ B ialah <b>seluruh</b> kawasan kedua-dua bulatan.'], col)
    + P(f'{XI10}, A = {{nombor genap}}, B = {{gandaan 3}}.', True)
    + P(f'A ∪ B = {B(fset(U_AB), col)}, <i>n</i>(A ∪ B) = {len(U_AB)}.', True),
    svg(fig, 'Gambar rajah Venn dua set dengan A ∪ B berlorek'))

# 4.2-2 Contoh berlangkah
U15 = set(range(1, 16)); J = {x for x in U15 if x % 4 == 0}; K = {x for x in U15 if x % 6 == 0}
assert J == {4, 8, 12} and K == {6, 12} and J | K == {4, 6, 8, 12}
v = Venn('L2', (14, 60, 486, 420), 'JK')
fig = v.draw(v.region('J ∪ K'), atoms_of('JK', U15, {'J': J, 'K': K})) + T(250, 30, 'J ∪ K = {4, 6, 8, 12}', GR, 24)
add('4.2', 'CONTOH BERLANGKAH', 'Menyenaraikan unsur J ∪ K',
    P(f'{XI} = {{<i>x</i> : <i>x</i> ialah integer, 1 ≤ <i>x</i> ≤ 15}}, J = {{gandaan 4}}, K = {{gandaan 6}}. Senaraikan unsur J ∪ K.', True)
    + STEPS([f'J = {fset(J)}, K = {fset(K)}',
             'Gabungkan semua unsur J dan K.',
             'Unsur sepunya 12 ditulis <b>sekali</b> sahaja.'], col)
    + ANS(f'J ∪ K = {fset(J | K)}, <i>n</i>(J ∪ K) = {len(J | K)}'),
    svg(fig, 'Gambar rajah Venn bagi set J dan K dengan unsur-unsurnya'))

# 4.2-3 Tiga set & pelengkap
A3b, B3b, C3b = {1, 3, 5}, {3, 4}, {5, 6, 7}
assert A3b | B3b | C3b == {1, 3, 4, 5, 6, 7}
assert region('(A ∪ B)′', 2) == 0b0001 and region('A′ ∪ B', 2) == 0b1101
fig = (panel('L3', (6, 4, 246, 232), 'A ∪ B ∪ C', 'A ∪ B ∪ C', col=GR) + panel('L3', (254, 4, 494, 232), '(A ∪ B ∪ C)′', '(A ∪ B ∪ C)′', col=GR)
       + panel('L2', (6, 238, 246, 466), '(A ∪ B)′', '(A ∪ B)′', col=GR) + panel('L2', (254, 238, 494, 466), 'A′ ∪ B', 'A′ ∪ B', col=GR))
NU = ev(parse('(A ∪ B)′'), U10, S10)
add('4.2', 'TIGA SET & PELENGKAP', 'Kesatuan tiga set dan pelengkapnya',
    BUL([f'{B("A ∪ B ∪ C", col)}: unsur dalam sekurang-kurangnya satu daripada set A, B atau C.',
         f'{B("(A ∪ B)′", col)}: unsur dalam {XI} yang <b>tiada</b> dalam A dan tiada dalam B.'], col)
    + P(f'A = {fset(A3b)}, B = {fset(B3b)}, C = {fset(C3b)} → A ∪ B ∪ C = {fset(A3b | B3b | C3b)}', True)
    + STEPS([f'Contoh slaid 1: A ∪ B = {fset(U_AB)}',
             f'(A ∪ B)′ = {fset(NU)}, <i>n</i>((A ∪ B)′) = 10 − 7 = {len(NU)}'], col),
    svg(fig, 'Gambar rajah Venn berlorek: A ∪ B ∪ C, (A ∪ B ∪ C)′, (A ∪ B)′ dan A′ ∪ B'))

# 4.2-4 Rumus bilangan unsur
nA, nB, nAB = len(A10), len(B10), len(A10 & B10)
assert (nA, nB, nAB) == (5, 3, 1) and nA + nB - nAB == len(U_AB) == 7
v = Venn('L2', (14, 50, 486, 380))
fig = (v.draw(v.region('A ∪ B'), cnt={1: '4', 3: '1', 2: '2'}, sz=26)
       + T(250, 26, 'n(A) = 5,  n(B) = 3,  n(A ∩ B) = 1', MU3, 19)
       + RECT(30, 392, 440, 62, SURF, BD, 14) + T(250, 423, 'n(A ∪ B) = 5 + 3 − 1 = 7', AM, 22))
add('4.2', 'RUMUS', 'Bilangan unsur kesatuan',
    DEF(f'<i>n</i>(A ∪ B) = <i>n</i>(A) + <i>n</i>(B) − <i>n</i>(A ∩ B)', col)
    + BUL(['Unsur dalam A ∩ B dikira <b>dua kali</b> apabila <i>n</i>(A) dan <i>n</i>(B) dicampurkan.',
           'Maka tolak <i>n</i>(A ∩ B) <b>sekali</b>.'], col)
    + STEPS([f'<i>n</i>(A ∪ B) = {nA} + {nB} − {nAB}', f'= {nA + nB - nAB}'], col)
    + NOTE(f'Jika A ∩ B = ∅, maka <i>n</i>(A ∪ B) = <i>n</i>(A) + <i>n</i>(B).'),
    svg(fig, 'Gambar rajah Venn bilangan unsur bagi rumus n(A ∪ B)'))

# 4.2-5 Penyelesaian masalah
nU, nT, nK, nTK = 50, 28, 22, 9
uni = nT + nK - nTK; nei = nU - uni
assert uni == 41 and nei == 9 and (nT - nTK) + nTK + (nK - nTK) + nei == nU
v = Venn('L2', (14, 40, 486, 400), 'TK')
fig = v.draw(v.region('T ∪ K'), cnt={1: str(nT - nTK), 3: str(nTK), 2: str(nK - nTK), 0: str(nei)}, sz=26) + T(250, 432, f'n(T ∪ K) = {nT - nTK} + {nTK} + {nK - nTK} = {uni}', AM, 21)
add('4.2', 'PENYELESAIAN MASALAH', 'Tinjauan minuman kegemaran',
    P(f'Seramai {nU} orang ditinjau: {nT} orang suka teh (T), {nK} orang suka kopi (K) dan {nTK} orang suka kedua-duanya. (a) Berapa orang suka sekurang-kurangnya satu minuman? (b) Berapa orang tidak suka kedua-duanya?', True)
    + STEPS([f'(a) <i>n</i>(T ∪ K) = {nT} + {nK} − {nTK} = {uni}',
             f'(b) <i>n</i>((T ∪ K)′) = {nU} − {uni} = {nei}'], col)
    + ANS(f'(a) {uni} orang &nbsp;(b) {nei} orang')
    + NOTE('"Sekurang-kurangnya satu" bermaksud kesatuan.'),
    svg(fig, 'Gambar rajah Venn tinjauan teh dan kopi'))

# 4.2-6 Kesilapan biasa
fig = ''
CASES = [(44, '{1, 2} ∪ {2, 3} = {1, 2, 2, 3}', False), (110, '{1, 2} ∪ {2, 3} = {1, 2, 3}', True),
         (196, 'n(A ∪ B) = n(A) + n(B)', False), (262, 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)', True),
         (348, '(A ∪ B)′ = A′ ∪ B′', False), (414, '(A ∪ B)′ = A′ ∩ B′', True)]
assert region('(A ∪ B)′', 2) == region('A′ ∩ B′', 2) != region('A′ ∪ B′', 2)
for y, t, ok in CASES:
    fig += RECT(20, y - 27, 460, 54, SURF, GR if ok else RD, 14, 2) + (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 19, 'start')
add('4.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Tulis unsur sepunya dua kali", RD)} ✗ → setiap unsur ditulis sekali sahaja.',
         f'{B("Lupa tolak n(A ∩ B)", RD)} ✗ → unsur sepunya terkira dua kali.',
         f'{B("Tertukar ∩ dengan ∪", RD)} ✗ → ∩ = "dan" (sepunya), ∪ = "atau" (semua).',
         f'{B("(A ∪ B)′ bukan A′ ∪ B′", RD)} ✗ → (A ∪ B)′ ialah rantau di luar kedua-dua bulatan.'], col),
    svg(fig, 'Contoh jawapan salah dan betul tentang kesatuan set'))

# 4.2-7 Ringkasan
fig = (panel('L2', (6, 4, 246, 232), 'A ∪ B', 'A ∪ B', col=GR) + panel('L2', (254, 4, 494, 232), '(A ∪ B)′', '(A ∪ B)′', col=GR)
       + panel('L3', (6, 238, 246, 466), 'A ∪ B ∪ C', 'A ∪ B ∪ C', col=GR) + panel('L2s', (254, 238, 494, 466), 'A ∪ B', 'B ⊂ A: A ∪ B = A', col=GR))
assert Venn('L2s', (0, 0, 340, 230)).atom(188, 128) == 3   # B di dalam A
add('4.2', 'RINGKASAN', 'Ringkasan kesatuan set',
    TABLE(['Tatatanda', 'Maksud'],
          [['A ∪ B', 'unsur dalam A <b>atau</b> B (atau kedua-duanya)'],
           ['A ∪ B ∪ C', 'unsur dalam sekurang-kurangnya satu set'],
           ['(A ∪ B)′', 'unsur di luar A dan di luar B'],
           ['<i>n</i>(A ∪ B)', '<i>n</i>(A) + <i>n</i>(B) − <i>n</i>(A ∩ B)']], col, rv=True)
    + NOTE('Jika B ⊂ A, maka A ∪ B = A dan A ∩ B = B.'),
    svg(fig, 'Ringkasan rantau kesatuan dalam gambar rajah Venn'))

# ===================== 4.3 GABUNGAN OPERASI SET =====================
col = SUB['4.3'][1]

# 4.3-1 Konsep
assert region('(A ∩ B) ∪ C', 3) != region('A ∩ (B ∪ C)', 3)
fig = (panel('L3', (10, 4, 490, 230), '(A ∩ B) ∪ C', '(A ∩ B) ∪ C', col=GR)
       + panel('L3', (10, 238, 490, 466), 'A ∩ (B ∪ C)', 'A ∩ (B ∪ C)', col=GR))
add('4.3', 'KONSEP', 'Gabungan operasi set',
    DEF('<b>Gabungan operasi set</b> melibatkan lebih daripada satu operasi (∩, ∪ dan ′) dalam satu ungkapan.', col)
    + BUL([f'Lakukan operasi dalam {B("kurungan", col)} dahulu.',
           'Kedudukan kurungan mengubah rantau yang dilorek.'], col)
    + STEPS(['(A ∩ B) ∪ C: rantau bertindih A dan B, <b>tambah</b> seluruh C.',
             'A ∩ (B ∪ C): bahagian A yang berada dalam B <b>atau</b> C.'], col),
    svg(fig, 'Perbandingan rantau (A ∩ B) ∪ C dengan A ∩ (B ∪ C)'))

# 4.3-2 Contoh melorek berlangkah
assert region('(A ∪ B) ∩ C', 3) == region('A ∪ B', 3) & region('C', 3)
fig = (panel('L3', (6, 4, 246, 230), 'A ∪ B', '① A ∪ B', col=TX) + panel('L3', (254, 4, 494, 230), 'C', '② C', col=TX)
       + panel('L3', (110, 238, 390, 466), '(A ∪ B) ∩ C', '③ Rantau sepunya', col=GR))
add('4.3', 'CONTOH BERLANGKAH', 'Melorek (A ∪ B) ∩ C',
    P('Lorek rantau yang mewakili set (A ∪ B) ∩ C pada gambar rajah Venn.', True)
    + STEPS(['Kenal pasti A ∪ B (dalam kurungan): seluruh bulatan A dan B.',
             'Kenal pasti set C: seluruh bulatan C.',
             'Operasi ∩: lorek rantau yang berada dalam <b>kedua-dua</b> langkah 1 dan 2.'], col)
    + ANS('Bahagian bulatan C yang bertindih dengan A atau B')
    + NOTE('Lorek dengan pensel ringan untuk setiap langkah, kemudian tebalkan jawapan akhir.', 'Petua:'),
    svg(fig, 'Langkah melorek (A ∪ B) ∩ C'))

# 4.3-3 Contoh senarai unsur
Pg, Qg, Rg = {1, 2, 3, 4, 5}, {2, 4, 6, 8, 10}, {3, 6, 9}
Sg = {'P': Pg, 'Q': Qg, 'R': Rg}
res = ev(parse('(P ∩ Q) ∪ R'), U10, Sg)
assert Pg & Qg == {2, 4} and res == {2, 3, 4, 6, 9}
v = Venn('L3', (14, 50, 486, 430), 'PQR')
fig = v.draw(v.region('(P ∩ Q) ∪ R'), atoms_of('PQR', U10, Sg)) + T(250, 24, '(P ∩ Q) ∪ R = {2, 3, 4, 6, 9}', GR, 22)
add('4.3', 'CONTOH BERLANGKAH', 'Menyenaraikan unsur gabungan',
    P(f'{XI10}, P = {fset(Pg)}, Q = {{nombor genap}}, R = {{gandaan 3}}. Senaraikan unsur (P ∩ Q) ∪ R.', True)
    + STEPS([f'Q = {fset(Qg)}, R = {fset(Rg)}',
             f'Dalam kurungan: P ∩ Q = {fset(Pg & Qg)}',
             f'(P ∩ Q) ∪ R = {fset(Pg & Qg)} ∪ {fset(Rg)}'], col)
    + ANS(f'(P ∩ Q) ∪ R = {fset(res)}, <i>n</i> = {len(res)}'),
    svg(fig, 'Gambar rajah Venn tiga set P, Q dan R dengan unsur'))

# 4.3-4 Pelengkap gabungan & menamakan rantau
assert region('(A ∪ B)′ ∩ C', 3) == 0b00010000 and region('A ∩ (B ∪ C)', 3) == sum(1 << a for a in (3, 5, 7))
fig = (panel('L3', (6, 4, 246, 230), '(A ∪ B)′ ∩ C', '(A ∪ B)′ ∩ C', col=GR) + panel('L3', (254, 4, 494, 230), 'A′ ∩ (B ∪ C)', 'A′ ∩ (B ∪ C)', col=GR)
       + panel('L3', (110, 238, 390, 466), 'A ∩ (B ∪ C)', 'Namakan rantau ini?', col=AM))
add('4.3', 'PELENGKAP & MENAMAKAN', 'Pelengkap dalam gabungan operasi',
    BUL([f'{B("(A ∪ B)′ ∩ C", col)}: dalam C tetapi di luar A dan B, iaitu "C sahaja".',
         f'{B("A′ ∩ (B ∪ C)", col)}: dalam B atau C tetapi bukan dalam A.'], col)
    + P('Menamakan rantau berlorek (rajah bawah):', True)
    + STEPS(['Semua rantau berlorek berada dalam bulatan <b>A</b>.',
             'Setiap rantau itu juga dalam <b>B atau C</b>, iaitu B ∪ C.',
             'Gabungkan dengan ∩.'], col)
    + ANS('A ∩ (B ∪ C)'),
    svg(fig, 'Rantau (A ∪ B)′ ∩ C, A′ ∩ (B ∪ C) dan A ∩ (B ∪ C)'))

# 4.3-5 Penyelesaian masalah tiga set
cnt = {1: '7', 2: '5', 4: '2x', 3: '4', 5: 'x', 6: '3', 7: '2', 0: '6'}
x = 4
tot = 7 + 5 + 2 * x + 4 + x + 3 + 2 + 6
assert tot == 39 and 27 + 3 * x == 39
nBC = 5 + 4 + 2 + 3 + x + 2 * x
assert region('B ∪ C', 3) == sum(1 << a for a in range(8) if a & 2 or a & 4) and nBC == 26
v = Venn('L3', (14, 40, 486, 400), 'BSK')
fig = v.draw(v.region('S ∪ K'), cnt=cnt, sz=24) + RECT(40, 404, 420, 54, SURF, BD, 14) + T(250, 431, 'n(S ∪ K) = 5 + 4 + 2 + 3 + x + 2x', AM, 20)
add('4.3', 'PENYELESAIAN MASALAH', 'Tiga jenis sukan',
    P('Rajah Venn menunjukkan bilangan murid yang bermain bola sepak (B), sepak takraw (S) dan hoki (K). Diberi <i>n</i>(ξ) = 39. (a) Cari nilai <i>x</i>. (b) Cari <i>n</i>(S ∪ K).', True)
    + STEPS(['(a) 7 + 5 + 2<i>x</i> + 4 + <i>x</i> + 3 + 2 + 6 = 39',
             f'27 + 3<i>x</i> = 39 → <i>x</i> = {x}',
             f'(b) <i>n</i>(S ∪ K) = 5 + 4 + 2 + 3 + {x} + {2 * x} = {nBC}'], col)
    + ANS(f'(a) <i>x</i> = {x} &nbsp;(b) <i>n</i>(S ∪ K) = {nBC}'),
    svg(fig, 'Gambar rajah Venn tiga sukan dengan bilangan murid'))

# 4.3-6 Kesilapan biasa
assert region('(A ∩ B) ∪ C', 3) != region('A ∩ (B ∪ C)', 3) and region('A′ ∪ B', 2) != region('(A ∪ B)′', 2)
fig = (panel('L2', (6, 4, 246, 220), 'A′ ∪ B', 'A′ ∪ B', col=GR) + panel('L2', (254, 4, 494, 220), '(A ∪ B)′', '(A ∪ B)′', col=GR)
       + T(250, 120, '≠', RD, 40))
rows = [(266, False, 'A ∩ B ∪ C (tiada kurungan)'), (318, True, '(A ∩ B) ∪ C  atau  A ∩ (B ∪ C)'),
        (378, False, 'A′ ∪ B = (A ∪ B)′'), (430, True, '(A ∪ B)′ = A′ ∩ B′')]
for y, ok, t in rows:
    fig += RECT(20, y - 22, 460, 44, SURF, GR if ok else RD, 12, 2) + (TICK(46, y) if ok else CROSS(46, y)) + T(72, y, t, GR if ok else RD, 18, 'start')
add('4.3', 'KESILAPAN BIASA', 'Perhatikan kurungan',
    BUL([f'{B("Tiada kurungan", RD)}: A ∩ B ∪ C tidak jelas. Tulis kurungan supaya tertib operasi diketahui.',
         f'{B("Abaikan tertib", RD)}: (A ∩ B) ∪ C ≠ A ∩ (B ∪ C).',
         f'{B("Salah letak pelengkap", RD)}: A′ ∪ B ≠ (A ∪ B)′.'], col)
    + NOTE('Selesaikan kurungan dahulu, kemudian pelengkap (′), kemudian operasi di luar kurungan.'),
    svg(fig, 'Perbandingan A′ ∪ B dengan (A ∪ B)′ serta penulisan ungkapan yang betul'))

# 4.3-7 Ringkasan bab
fig = (panel('L2', (6, 4, 246, 232), 'A ∩ B', 'A ∩ B', col=GR) + panel('L2', (254, 4, 494, 232), 'A ∪ B', 'A ∪ B', col=GR)
       + panel('L3', (6, 238, 246, 466), '(A ∩ B) ∪ C', '(A ∩ B) ∪ C', col=GR) + panel('L3', (254, 238, 494, 466), '(A ∪ B)′ ∩ C', '(A ∪ B)′ ∩ C', col=GR))
add('4.3', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Operasi', 'Maksud'],
          [['∩ persilangan', '"dan": rantau bertindih'],
           ['∪ kesatuan', '"atau": seluruh bulatan'],
           ['′ pelengkap', '"bukan": di luar set'],
           ['gabungan', 'kurungan dahulu, lorek berlangkah']], col, rv=True)
    + DEF('<i>n</i>(A ∪ B) = <i>n</i>(A) + <i>n</i>(B) − <i>n</i>(A ∩ B)', col),
    svg(fig, 'Ringkasan rantau operasi set dalam gambar rajah Venn'))

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
assert 'NaN' not in js_body and 'None' not in js_body and 'nan ' not in js_body
assert counts == {'4.1': 7, '4.2': 7, '4.3': 7}, counts

js = ('/* Dijana oleh tools/operasiset/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
