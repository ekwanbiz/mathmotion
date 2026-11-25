# Penjana slaid NOTA TRIGONOMETRI (Tingkatan 3 Bab 5 Nisbah Trigonometri) -> trigonometri/slides.js
# Jalankan:  python3 tools/trigonometri/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, math, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fxsvg import fx_svg, has_fx, fx_html   # pecahan bertingkat & punca (25 Nov)
import mathfmt
from fractions import Fraction as F

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'trigonometri', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM bab ini hanya ada SK 5.1 (SP 5.1.1 - 5.1.7). Subtopik app ikut SP:
# 5.1.1 | 5.1.2 (+ SP 5.1.3) | 5.1.4 (+ SP 5.1.5, 5.1.6) | 5.1.7
SUB = {
    '5.1.1': ('Sisi Segi Tiga Bersudut Tegak', C['pa']),
    '5.1.2': ('Sinus, Kosinus dan Tangen', C['pu']),
    '5.1.4': ('Nilai dan Sudut Khas', C['tr']),
    '5.1.7': ('Penyelesaian Masalah', C['gr']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
HY, OP, AD, TH = AM, PK, TR, PA   # warna tetap: hipotenus, bertentangan, bersebelahan, sudut θ

# ---------- semakan matematik ----------
def sin(a): return math.sin(math.radians(a))
def cos(a): return math.cos(math.radians(a))
def tan(a): return math.tan(math.radians(a))
def d4(x): return f'{x:.4f}'
def d2(x): return f'{x:.2f}'
def dm(deg):
    """Darjah perpuluhan -> 'D°M′' (minit dibundarkan)."""
    D = int(deg); M = round((deg - D) * 60)
    if M == 60: D, M = D + 1, 0
    return f'{D}°{M}′'

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
    """Pecahan bertingkat dalam teks slaid (gaya .fr dalam teras.css)."""
    return mathfmt.FR(a, b)
def B(t, col):
    return f'<b style="color: {col}">{t}</b>'
def TABLE(head, rows, col, rv=False):
    th = ''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
HYP, OPP, ADJ = B('hipotenus', HY), B('sisi bertentangan', OP), B('sisi bersebelahan', AD)
SINF = FR(B('bertentangan', OP), B('hipotenus', HY))
COSF = FR(B('bersebelahan', AD), B('hipotenus', HY))
TANF = FR(B('bertentangan', OP), B('bersebelahan', AD))
TH_ = '<i>θ</i>'

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'

def r1(v): return round(v, 1)

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    if has_fx(t):
        return fx_svg(x, y, t, col, size, anchor, f' {FONT} font-weight="{weight}"{it}{ha}')
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'

def POLY(pts, fill, stroke='none', sw=0):
    pp = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
    return f'<polygon points="{pp}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'

def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'

def unit(p, q):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    return (dx / L, dy / L)

def right_angle(M, P1, P2, col=TX, k=15):
    """Tanda sudut tegak di M (antara arah M->P1 dan M->P2)."""
    u, v = unit(M, P1), unit(M, P2)
    a = (M[0] + u[0] * k, M[1] + u[1] * k)
    b = (a[0] + v[0] * k, a[1] + v[1] * k)
    c = (M[0] + v[0] * k, M[1] + v[1] * k)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(b[0])} {r1(b[1])} L{r1(c[0])} {r1(c[1])}" fill="none" stroke="{col}" stroke-width="2.5"/>'

def ARC(V, P1, P2, r, col=TH, sw=4, lab=None, lsize=21, loff=20):
    """Lengkok sudut di V antara arah V->P1 dan V->P2 (sudut kecil)."""
    u, v = unit(V, P1), unit(V, P2)
    a = (V[0] + u[0] * r, V[1] + u[1] * r); b = (V[0] + v[0] * r, V[1] + v[1] * r)
    cr = u[0] * v[1] - u[1] * v[0]
    s = f'<path d="M{r1(a[0])} {r1(a[1])} A{r} {r} 0 0 {1 if cr > 0 else 0} {r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'
    if lab:
        bx, by = u[0] + v[0], u[1] + v[1]; L = math.hypot(bx, by) or 1
        s += T(V[0] + bx / L * (r + loff), V[1] + by / L * (r + loff), lab, col, lsize, italic=(lab == 'θ'))
    return s

def ARROW(p, q, col, sw=3.5, head=12):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (q[0] - ux * head - uy * head * 0.6, q[1] - uy * head + ux * head * 0.6)
    b = (q[0] - ux * head + uy * head * 0.6, q[1] - uy * head - ux * head * 0.6)
    return (LINE(p, q, col, sw) +
            f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(q[0])} {r1(q[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')

def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

def side_lab(p, q, cen, t, col, size=20, off=16):
    """Label sisi pq di sebelah luar segi tiga (jauh dari pusat cen)."""
    mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
    dx, dy = q[0] - p[0], q[1] - p[1]; L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L, dx / L
    if (mx - cen[0]) * nx + (my - cen[1]) * ny < 0: nx, ny = -nx, -ny
    if abs(nx) > 0.9 and len(t) > 5:   # sisi tegak + label panjang: tulis menegak
        x, y = mx + nx * (off + 2), my
        return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="middle" '
                f'dominant-baseline="middle" transform="rotate({90 if nx > 0 else -90} {r1(x)} {r1(y)})" paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round">{t}</text>')
    anchor = 'middle' if abs(nx) < 0.35 else ('start' if nx > 0 else 'end')
    return T(mx + nx * off, my + ny * (off + 2), t, col, size, anchor)

def TRI(A, R, Cv, names=None, labs=None, colored=True, th='θ', arc_r=44, fill=True, sw=5, vsize=21, lsize=19, thcol=TH):
    """Segi tiga bersudut tegak: A = bucu sudut θ, R = bucu sudut tegak, Cv = bucu ketiga.
    hipotenus = A-Cv, bersebelahan = A-R, bertentangan = R-Cv.  labs = (hyp, opp, adj)."""
    cen = ((A[0] + R[0] + Cv[0]) / 3, (A[1] + R[1] + Cv[1]) / 3)
    ch, co, ca = (HY, OP, AD) if colored else (MU3, MU3, MU3)
    s = POLY([A, R, Cv], f'{PU}14') if fill else ''
    s += LINE(A, Cv, ch, sw + 1) + LINE(R, Cv, co, sw) + LINE(A, R, ca, sw)
    s += right_angle(R, A, Cv, TX, 15)
    if th: s += ARC(A, R, Cv, arc_r, thcol, 4, th, 22)
    if labs:
        hl, ol, al = labs
        if hl: s += side_lab(A, Cv, cen, hl, ch, lsize)
        if ol: s += side_lab(R, Cv, cen, ol, co, lsize)
        if al: s += side_lab(A, R, cen, al, ca, lsize)
    if names:
        for p, n in zip((A, R, Cv), names):
            dx, dy = p[0] - cen[0], p[1] - cen[1]; L = math.hypot(dx, dy) or 1
            s += T(p[0] + dx / L * 22, p[1] + dy / L * 22, n, TX, vsize)
    return s

# ---------- slaid ----------
S = []
_RTRE = re.compile(r'√(\((?:[^()<>]|\([^()<>]*\))*\)|\d+(?:\.\d+)?|[A-Za-z](?![A-Za-z]))')
_GLY = {'½': (1, 2), '⅓': (1, 3), '⅔': (2, 3), '¼': (1, 4), '¾': (3, 4)}
def HRT(t):
    """Teks slaid (HTML): √x / √(..) -> punca bergaris atas; ½ ¼ ¾ … -> pecahan bertingkat (25 Nov)."""
    if not t: return t
    t = _RTRE.sub(lambda m: mathfmt.RT(m.group(1)[1:-1] if m.group(1).startswith('(') else m.group(1)), t)
    return ''.join(mathfmt.FR(*_GLY[c]) if c in _GLY else c for c in t)
def add(sub, kicker, title, body, fig='', full=''):
    body, full = HRT(body), HRT(full)
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 5.1.1 SISI SEGI TIGA BERSUDUT TEGAK =====================
col = SUB['5.1.1'][1]

# 5.1.1-1 Definisi
A_, R_, C_ = (70, 380), (420, 380), (420, 110)
fig = TRI(A_, R_, C_, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=20)
fig += T(250, 440, 'Sisi dinamakan berdasarkan sudut θ', MU3, 18, halo=False)
fig += T(250, 40, 'Hipotenus: sisi terpanjang', MU, 17, halo=False)
add('5.1.1', 'DEFINISI', 'Tiga sisi segi tiga bersudut tegak',
    DEF(f'Dalam segi tiga bersudut tegak, setiap sisi diberi nama berdasarkan <b>sudut tirus</b> {TH_} yang dirujuk.', col)
    + BUL([f'{HYP}: sisi terpanjang, bertentangan dengan sudut tegak.',
           f'{OPP}: sisi yang <b>bertentangan</b> (berhadapan) dengan {TH_}.',
           f'{ADJ}: sisi yang <b>bersebelahan</b> dengan {TH_}, selain hipotenus.'], col)
    + NOTE('Sudut tirus ialah sudut yang kurang daripada 90°.'),
    svg(fig, 'Segi tiga bersudut tegak dengan hipotenus, sisi bertentangan dan sisi bersebelahan bagi sudut theta'))

# 5.1.1-2 Sisi bertukar apabila sudut bertukar
fig = RECT(14, 14, 472, 214) + RECT(14, 242, 472, 214)
A1, R1, C1 = (60, 196), (300, 196), (300, 50)
fig += TRI(A1, R1, C1, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=17, arc_r=36, sw=4)
fig += T(400, 120, 'Rujuk ∠θ', TH, 20)
# panel 2: sudut di bucu atas
A2, R2, C2 = (300, 278), (300, 424), (60, 424)
fig += TRI(A2, R2, C2, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=17, th='α', arc_r=36, sw=4, thcol=GR)
fig += T(400, 350, 'Rujuk ∠α', GR, 20)
assert True
add('5.1.1', 'KONSEP', 'Sisi bergantung pada sudut',
    P('Segi tiga yang sama mempunyai <b>dua</b> sudut tirus. Sisi bertentangan dan sisi bersebelahan <b>bertukar</b> apabila sudut yang dirujuk bertukar.')
    + TABLE(['Sisi', f'Bagi ∠{TH_}', 'Bagi ∠<i>α</i>'],
            [['Tegak', B('bertentangan', OP), B('bersebelahan', AD)],
             ['Mendatar', B('bersebelahan', AD), B('bertentangan', OP)],
             ['Condong', B('hipotenus', HY), B('hipotenus', HY)]], col, rv=True)
    + NOTE('Hipotenus <b>tidak berubah</b>: ia sentiasa bertentangan dengan sudut tegak.'),
    svg(fig, 'Segi tiga yang sama dilihat dari sudut theta dan sudut alfa'))

# 5.1.1-3 Contoh berlangkah PQR
P_, Q_, R3 = (80, 370), (410, 370), (410, 110)
fig = TRI(P_, Q_, R3, names=('P', 'Q', 'R'), labs=('PR', 'QR', 'PQ'), th='', lsize=22)
fig += ARC(P_, Q_, R3, 46, TH, 4, '∠P', 20, 26)
fig += T(250, 440, '∠PQR = 90°', MU3, 19, halo=False)
add('5.1.1', 'CONTOH BERLANGKAH', 'Namakan sisi bagi ∠P',
    P('Dalam ∆PQR, ∠PQR = 90°. Namakan hipotenus, sisi bertentangan dan sisi bersebelahan bagi ∠QPR.', True)
    + STEPS([f'Sudut tegak di Q, maka sisi bertentangan dengan Q ialah {B("hipotenus = PR", HY)}.',
             f'Sisi yang berhadapan dengan P (tidak menyentuh P): {B("bertentangan = QR", OP)}.',
             f'Sisi yang menyentuh P selain hipotenus: {B("bersebelahan = PQ", AD)}.'], col)
    + ANS(f'Hipotenus PR, bertentangan QR, bersebelahan PQ'),
    svg(fig, 'Segi tiga PQR bersudut tegak di Q'))

# 5.1.1-4 Orientasi berbeza
K_, M_ = (60, 330), (440, 330)
cx, rr = 250, 190
L_ = (cx + rr * math.cos(math.radians(120)), 330 - rr * math.sin(math.radians(120)))
# semak sudut tegak di L
uL, vL = (K_[0] - L_[0], K_[1] - L_[1]), (M_[0] - L_[0], M_[1] - L_[1])
assert abs(uL[0] * vL[0] + uL[1] * vL[1]) < 1e-6
fig = TRI(M_, L_, K_, names=('M', 'L', 'K'), labs=('KM', 'KL', 'LM'), lsize=22, arc_r=52)
fig += T(250, 410, 'Hipotenus tidak semestinya di bawah', MU3, 18, halo=False)
fig += T(250, 440, 'atau di sebelah kanan.', MU3, 18, halo=False)
add('5.1.1', 'CONTOH', 'Segi tiga dalam kedudukan lain',
    P('Rajah menunjukkan ∆KLM dengan ∠KLM = 90°. Namakan sisi-sisi bagi sudut <i>θ</i> di M.', True)
    + STEPS([f'Cari sudut tegak dahulu (di L). Sisi di hadapannya: {B("hipotenus = KM", HY)}.',
             f'Sisi berhadapan dengan M: {B("bertentangan = KL", OP)}.',
             f'Sisi yang menyentuh M (bukan hipotenus): {B("bersebelahan = LM", AD)}.'], col)
    + NOTE('Tidak perlu memusingkan buku: mulakan dengan <b>sudut tegak</b>, kemudian cari sudut <i>θ</i>.', 'Petua:'),
    svg(fig, 'Segi tiga KLM bersudut tegak di L dengan hipotenus KM di bawah'))

# 5.1.1-5 Kesilapan biasa
A5, R5, C5 = (70, 230), (330, 230), (330, 60)
fig = TRI(A5, R5, C5, names=('A', 'B', 'C'), lsize=19, arc_r=38)
rows5 = [(296, False, 'Bersebelahan ∠A = AC', 'itu hipotenus'), (346, False, 'Bertentangan ∠A = AB', 'menyentuh A'),
         (396, True, 'Bertentangan ∠A = BC', 'betul'), (446, True, 'Bersebelahan ∠A = AB', 'betul')]
for y, ok, a, why in rows5:
    fig += RECT(30, y - 21, 440, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(56, y) if ok else CROSS(56, y))
    fig += T(82, y, a, GR if ok else RD, 19, 'start') + T(452, y, why, MU, 16, 'end')
add('5.1.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Memilih hipotenus sebagai sisi bersebelahan", RD)} ✗: hipotenus juga menyentuh {TH_}, tetapi ia bukan sisi bersebelahan.',
         f'{B("Menamakan sisi tanpa melihat sudut", RD)} ✗: tanya dahulu, "sudut yang mana?"',
         f'{B("Menganggap sisi tegak sentiasa bertentangan", RD)} ✗: bergantung pada kedudukan {TH_}.'], col)
    + NOTE('Hipotenus ialah sisi <b>bertentangan dengan sudut tegak</b>, dan sentiasa sisi terpanjang.'),
    svg(fig, 'Contoh penamaan sisi yang betul dan salah bagi sudut A'))

# 5.1.1-6 Ringkasan
A6, R6, C6 = (80, 330), (420, 330), (420, 90)
fig = TRI(A6, R6, C6, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=20)
fig += RECT(40, 380, 420, 70, SURF, BD, 16, 2)
fig += T(250, 404, '1. Cari sudut tegak → hipotenus', MU3, 17, halo=False)
fig += T(250, 430, '2. Cari θ → bertentangan, bersebelahan', MU3, 17, halo=False)
add('5.1.1', 'RINGKASAN', 'Ringkasan 5.1.1',
    TABLE(['Sisi', 'Cara mengenal pasti'],
          [[B('Hipotenus', HY), 'Bertentangan dengan sudut tegak (terpanjang)'],
           [B('Bertentangan', OP), f'Berhadapan dengan {TH_}, tidak menyentuh {TH_}'],
           [B('Bersebelahan', AD), f'Menyentuh {TH_}, bukan hipotenus']], col, rv=True)
    + NOTE('Nama sisi bertentangan dan bersebelahan bergantung pada sudut yang dirujuk.'),
    svg(fig, 'Ringkasan nama sisi segi tiga bersudut tegak'))

# ===================== 5.1.2 SINUS, KOSINUS DAN TANGEN =====================
col = SUB['5.1.2'][1]

# 5.1.2-1 Konjektur: nisbah tetap bagi sudut sama
A0 = (50, 410); u = 30
fig = ''
TRS = [(1, PK), (2, PU), (3, TR)]
rows = []
for k, cl in reversed(TRS):
    R0, C0 = (A0[0] + 4 * k * u, A0[1]), (A0[0] + 4 * k * u, A0[1] - 3 * k * u)
    fig += POLY([A0, R0, C0], f'{cl}14', cl, 3)
    fig += right_angle(R0, A0, C0, cl, 11)
    fig += T(R0[0] + 8, (R0[1] + C0[1]) / 2, f'{3 * k}', cl, 18, 'start')
    fig += T((A0[0] + C0[0]) / 2 - 14, (A0[1] + C0[1]) / 2 - 12, f'{5 * k}', cl, 18, 'end')
for k, cl in TRS:
    assert F(3 * k, 5 * k) == F(3, 5) and F(4 * k, 5 * k) == F(4, 5) and F(3 * k, 4 * k) == F(3, 4)
    rows.append([B(f'Segi tiga {k}', cl), f'{FR(3 * k, 5 * k)} = 0.6', f'{FR(4 * k, 5 * k)} = 0.8', f'{FR(3 * k, 4 * k)} = 0.75'])
fig += ARC(A0, (400, 410), (400, 147.5), 50, TH, 4, 'θ', 22)
fig += T(250, 40, 'Sudut θ sama, saiz berbeza', MU3, 18, halo=False)
add('5.1.2', 'KONJEKTUR', 'Sudut sama, nisbah sama',
    P(f'Tiga segi tiga bersudut tegak mempunyai sudut {TH_} yang sama. Bandingkan nisbah sisi-sisinya.', True)
    + TABLE(['', FR('bertentangan', 'hipotenus'), FR('bersebelahan', 'hipotenus'), FR('bertentangan', 'bersebelahan')], rows, col, rv=True)
    + NOTE(f'Bagi sudut {TH_} yang sama, nisbah sisi adalah <b>tetap</b> walaupun saiz segi tiga berbeza.', 'Kesimpulan:'),
    svg(fig, 'Tiga segi tiga serupa bersisi 3-4-5, 6-8-10 dan 9-12-15 berkongsi sudut theta'))

# 5.1.2-2 Takrif
A_, R_, C_ = (60, 360), (420, 360), (420, 110)
fig = TRI(A_, R_, C_, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=19)
fig += RECT(20, 396, 460, 62, SURF, BD, 16, 2)
fig += T(250, 427, 'sin · kos · tan', MU3, 22, halo=False)
add('5.1.2', 'DEFINISI', 'Sinus, kosinus dan tangen',
    DEF(f'Nisbah tetap ini dinamakan <b>sinus</b> (sin), <b>kosinus</b> (kos) dan <b>tangen</b> (tan) bagi sudut {TH_}.', col)
    + TABLE(['Nisbah', 'Takrif'],
            [[f'sin {TH_}', SINF], [f'kos {TH_}', COSF], [f'tan {TH_}', TANF]], col, rv=True)
    + NOTE('Ketiga-tiga nisbah ini dipanggil <b>nisbah trigonometri</b>. Ia tiada unit.'),
    svg(fig, 'Segi tiga bersudut tegak untuk takrif sinus, kosinus dan tangen'))

# 5.1.2-3 Contoh berlangkah 5-12-13
assert 5 ** 2 + 12 ** 2 == 13 ** 2
sc = 26
A_ = (70, 360); R_ = (A_[0] + 12 * sc, 360); C_ = (R_[0], 360 - 5 * sc)
fig = TRI(A_, R_, C_, names=('A', 'B', 'C'), labs=('13 cm', '5 cm', '12 cm'), lsize=21, arc_r=60)
fig += T(250, 440, 'Bagi ∠θ: bert. 5, bers. 12, hip. 13', MU3, 18, halo=False)
add('5.1.2', 'CONTOH BERLANGKAH', 'Tulis sin θ, kos θ dan tan θ',
    P('Berdasarkan rajah, tulis nilai sin <i>θ</i>, kos <i>θ</i> dan tan <i>θ</i> sebagai pecahan.', True)
    + STEPS([f'Kenal pasti: {B("hipotenus AC = 13", HY)}, {B("bertentangan BC = 5", OP)}, {B("bersebelahan AB = 12", AD)}.',
             f'sin <i>θ</i> = {FR(5, 13)} &nbsp;·&nbsp; kos <i>θ</i> = {FR(12, 13)}',
             f'tan <i>θ</i> = {FR(5, 12)}'], col)
    + ANS(f'sin <i>θ</i> = {FR(5, 13)}, kos <i>θ</i> = {FR(12, 13)}, tan <i>θ</i> = {FR(5, 12)}'),
    svg(fig, 'Segi tiga ABC bersisi 5 cm, 12 cm dan 13 cm'))

# 5.1.2-4 Contoh: sisi ketiga dengan Pythagoras
assert 17 ** 2 - 8 ** 2 == 15 ** 2
sc = 22
P_ = (70, 360); Q_ = (P_[0] + 15 * sc, 360); R_ = (Q_[0], 360 - 8 * sc)
fig = TRI(P_, Q_, R_, names=('P', 'Q', 'R'), labs=('17 cm', '8 cm', '?'), lsize=21, arc_r=56)
fig += T(250, 70, 'PQ² = 17² − 8² = 225', AD, 20)
fig += T(250, 440, 'PQ = √225 = 15 cm', AD, 20, halo=False)
add('5.1.2', 'CONTOH BERLANGKAH', 'Cari sisi ketiga dahulu',
    P('Dalam ∆PQR, ∠PQR = 90°, PR = 17 cm dan QR = 8 cm. Cari kos <i>θ</i> dan tan <i>θ</i>, dengan <i>θ</i> = ∠QPR.', True)
    + STEPS([f'Teorem Pythagoras: PQ = √(17² − 8²) = √225 = {B("15 cm", AD)}',
             f'kos <i>θ</i> = {FR(B("PQ", AD), B("PR", HY))} = {FR(15, 17)}',
             f'tan <i>θ</i> = {FR(B("QR", OP), B("PQ", AD))} = {FR(8, 15)}'], col)
    + ANS(f'kos <i>θ</i> = {FR(15, 17)}, tan <i>θ</i> = {FR(8, 15)}'),
    svg(fig, 'Segi tiga PQR dengan hipotenus 17 cm dan sisi QR 8 cm'))

# 5.1.2-5 Kesan perubahan sudut (SP 5.1.3)
ANG = [10, 30, 45, 60, 80]
vals = [(a, sin(a), cos(a), tan(a)) for a in ANG]
assert all(vals[i][1] < vals[i + 1][1] and vals[i][2] > vals[i + 1][2] and vals[i][3] < vals[i + 1][3] for i in range(len(vals) - 1))
assert d4(tan(45)) == '1.0000' and d4(sin(30)) == '0.5000'
rows = [[f'{a}°', d4(s_), d4(c_), d4(t_)] for a, s_, c_, t_ in vals]
O_ = (60, 400); Rr = 330
fig = f'<path d="M{O_[0] + Rr} {O_[1]} A{Rr} {Rr} 0 0 0 {O_[0]} {O_[1] - Rr}" fill="none" stroke="{DIM}" stroke-width="2.5" stroke-dasharray="6 6"/>'
fig += LINE(O_, (O_[0] + Rr + 20, O_[1]), MU2, 3)
for a, cl in [(20, TR), (45, PU), (70, PK)]:
    Pt = (O_[0] + Rr * cos(a), O_[1] - Rr * sin(a)); Ft = (Pt[0], O_[1])
    fig += LINE(O_, Pt, cl, 4) + LINE(Pt, Ft, cl, 4, '7 5') + DOT(Pt, cl, 6)
    fig += T(Pt[0] + (10 if a < 60 else 12), Pt[1] - 16, f'{a}°', cl, 19, 'start')
fig += T(250, 440, 'Hipotenus tetap: θ ↑ → sisi bertentangan ↑', MU3, 17, halo=False)
fig += T(80, 40, 'hipotenus = 1 unit', MU, 17, 'start', halo=False)
add('5.1.2', 'KESAN PERUBAHAN SUDUT', 'Apabila θ bertambah',
    TABLE([TH_, f'sin {TH_}', f'kos {TH_}', f'tan {TH_}'], rows, col)
    + BUL([f'{TH_} bertambah → sin {TH_} <b>bertambah</b>, kos {TH_} <b>berkurang</b>, tan {TH_} <b>bertambah</b>.',
           f'Bagi sudut tirus, 0 &lt; sin {TH_} &lt; 1 dan 0 &lt; kos {TH_} &lt; 1. tan {TH_} boleh melebihi 1 (tan 45° = 1).'], col),
    svg(fig, 'Tiga jejari pada sukuan bulatan menunjukkan sisi bertentangan bertambah apabila sudut bertambah'))

# 5.1.2-6 Kesilapan biasa
A_, R_, C_ = (70, 230), (360, 230), (360, 60)
fig = TRI(A_, R_, C_, labs=('10', '6', '8'), lsize=20, arc_r=46)
assert 6 ** 2 + 8 ** 2 == 10 ** 2
rows6 = [(292, False, 'sin θ = 6/8', 'guna bersebelahan'), (342, False, 'tan θ = 8/6', 'terbalik'),
         (392, False, 'kos θ = 10/8', 'terbalik, > 1'), (442, True, 'sin θ = 6/10 = 3/5', 'betul')]
for y, ok, a, why in rows6:
    fig += RECT(30, y - 21, 440, 42, SURF, GR if ok else RD, 12, 2)
    fig += (TICK(56, y) if ok else CROSS(56, y))
    fig += T(82, y, a, GR if ok else RD, 19, 'start') + T(452, y, why, MU, 16, 'end')
add('5.1.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Tersalah sisi", RD)} ✗: sin dan kos menggunakan <b>hipotenus</b> sebagai penyebut.',
         f'{B("Menterbalikkan nisbah", RD)} ✗: tan {TH_} = bertentangan ÷ bersebelahan, bukan sebaliknya.',
         f'{B("sin atau kos lebih daripada 1", RD)} ✗: mustahil bagi sudut tirus, kerana hipotenus sisi terpanjang.',
         f'{B("Lupa permudahkan", RD)}: {FR(6, 10)} ditulis {FR(3, 5)}.'], col),
    svg(fig, 'Contoh jawapan betul dan salah bagi segi tiga 6-8-10'))

# 5.1.2-7 Ringkasan
A_, R_, C_ = (70, 300), (420, 300), (420, 80)
fig = TRI(A_, R_, C_, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=19)
fig += RECT(30, 350, 440, 100, SURF, BD, 16, 2)
fig += T(250, 380, 'sin θ = bert. ÷ hip.', OP, 19, halo=False)
fig += T(250, 407, 'kos θ = bers. ÷ hip.', AD, 19, halo=False)
fig += T(250, 434, 'tan θ = bert. ÷ bers.', HY, 19, halo=False)
add('5.1.2', 'RINGKASAN', 'Ringkasan 5.1.2',
    BUL([f'sin {TH_} = {SINF}', f'kos {TH_} = {COSF}', f'tan {TH_} = {TANF}',
         f'Sudut sama → nisbah sama, walaupun saiz segi tiga berbeza.',
         f'{TH_} bertambah: sin ↑, kos ↓, tan ↑.'], col)
    + NOTE('Jika satu sisi tidak diberi, cari dahulu dengan Teorem Pythagoras.'),
    svg(fig, 'Ringkasan nisbah sinus, kosinus dan tangen'))

# ===================== 5.1.4 NILAI DAN SUDUT KHAS =====================
col = SUB['5.1.4'][1]

def CALC(lines, res, x=110, y=40):
    """Rajah kalkulator ringkas: lines = teks skrin, res = jawapan."""
    s = RECT(x, y, 280, 390, SURF, MU2, 28, 3)
    s += RECT(x + 22, y + 22, 236, 104, NAV, BD, 12, 2)
    s += T(x + 36, y + 50, lines, MU3, 19, 'start', halo=False)
    s += T(x + 244, y + 98, res, TX, 28, 'end', halo=False)
    s += T(x + 252, y + 36, 'D', AM, 14, 'end', halo=False)
    keys = [['SHIFT', 'sin', 'kos', 'tan'], ['7', '8', '9', '°′″'], ['4', '5', '6', '×'], ['1', '2', '3', '=']]
    for i, row in enumerate(keys):
        for j, k in enumerate(row):
            kx, ky = x + 22 + j * 60, y + 146 + i * 58
            hl = k in ('sin', 'kos', 'tan', '°′″', 'SHIFT')
            s += RECT(kx, ky, 50, 44, DIM if not hl else NAV, PU if k in ('sin', 'kos', 'tan') else BD, 10, 2)
            s += T(kx + 25, ky + 22, 'cos' if k == 'kos' else k, PU if k in ('sin', 'kos', 'tan') else TX, 15 if len(k) > 3 else 18, halo=False)
    return s

# 5.1.4-1 Kalkulator
assert (d4(sin(35)), d4(cos(62)), d4(tan(48))) == ('0.5736', '0.4695', '1.1106')
fig = CALC('sin(35)', '0.573576…')
add('5.1.4', 'KALKULATOR', 'Nilai sin, kos dan tan',
    DEF('Nilai sin, kos dan tan bagi sebarang sudut tirus boleh ditentukan dengan <b>kalkulator saintifik</b>.', col)
    + STEPS(['Pastikan kalkulator dalam mod <b>darjah</b> (D atau Deg).',
             'Tekan <b>sin</b> 35 <b>=</b> → 0.573576… ≈ <b>0.5736</b>',
             f'kos 62° = {d4(cos(62))} &nbsp;·&nbsp; tan 48° = {d4(tan(48))}'], col)
    + NOTE('Bundarkan kepada <b>4 tempat perpuluhan</b>. Pada kalkulator, kos ditulis <b>cos</b>.'),
    svg(fig, 'Kalkulator saintifik memaparkan sin 35 darjah'))

# 5.1.4-2 Darjah dan minit
assert dm(35.4) == '35°24′' and 52 + F(15, 60) == F(209, 4) and d4(tan(52.25)) == '1.2915'
fig = RECT(20, 30, 460, 190, SURF, BD, 18, 2)
fig += T(250, 70, '1° = 60′  (60 minit)', AM, 26)
fig += T(250, 122, '35.4° = 35° + 0.4 × 60′', TX, 21)
fig += T(250, 160, '= 35°24′', GR, 24)
fig += T(250, 196, 'Kekunci °′″ menukar secara terus', MU, 16, halo=False)
fig += RECT(20, 240, 460, 200, SURF, BD, 18, 2)
fig += T(250, 280, '52°15′ = 52 + 15/60', TX, 21)
fig += T(250, 318, '= 52.25°', GR, 24)
fig += T(250, 370, 'tan 52°15′ = 1.2915', PU, 24)
fig += T(250, 410, 'tan 52 °′″ 15 °′″ =', MU, 17, halo=False)
add('5.1.4', 'DARJAH DAN MINIT', 'Sudut dalam darjah dan minit',
    P('Sudut boleh ditulis dalam <b>darjah dan minit</b>, dengan 1° = 60′.')
    + STEPS([f'Perpuluhan → minit: 35.4° = 35° + (0.4 × 60)′ = <b>35°24′</b>',
             f'Minit → perpuluhan: 52°15′ = 52 + {FR(15, 60)} = <b>52.25°</b>',
             'tan 52°15′ = tan 52.25° = <b>1.2915</b>'], col)
    + NOTE('35°24′ <b>bukan</b> 35.24°. Minit ialah per 60, bukan per 100.', 'Awas:'),
    svg(fig, 'Penukaran darjah perpuluhan kepada darjah dan minit'))

# 5.1.4-3 Cari sudut daripada nilai
th = math.degrees(math.asin(0.6))
assert d2(th) == '36.87' and dm(th) == '36°52′'
fig = CALC('sin⁻¹(0.6)', '36.869…')
add('5.1.4', 'CARI SUDUT', 'Mencari sudut daripada nilai',
    P('Diberi sin <i>θ</i> = 0.6, cari <i>θ</i> dalam darjah dan minit.', True)
    + STEPS(['<i>θ</i> = sin⁻¹ 0.6 → tekan <b>SHIFT sin</b> 0.6 <b>=</b>',
             f'<i>θ</i> = 36.869…° ≈ <b>{d2(th)}°</b>',
             f'Tekan °′″ atau kira 0.869… × 60 ≈ 52′ → <b>{dm(th)}</b>'], col)
    + ANS(f'<i>θ</i> = {dm(th)}')
    + NOTE('Begitu juga: kos⁻¹ (SHIFT cos) dan tan⁻¹ (SHIFT tan).'),
    svg(fig, 'Kalkulator memaparkan sin songsang 0.6'))

# 5.1.4-4 Sudut 45°
assert abs(sin(45) - 1 / math.sqrt(2)) < 1e-12 and abs(tan(45) - 1) < 1e-12
A_, R_, C_ = (90, 390), (390, 390), (390, 90)
fig = TRI(A_, R_, C_, labs=('√2', '1', '1'), lsize=24, th='45°', arc_r=56)
fig += ARC(C_, R_, A_, 46, GR, 4, '45°', 19, 22)
fig += T(250, 40, 'Segi tiga sama kaki bersudut tegak', MU3, 18, halo=False)
add('5.1.4', 'SUDUT KHAS', 'Nilai bagi 45°',
    P('Segi tiga sama kaki bersudut tegak dengan dua sisi 1 unit. Hipotenus = √(1² + 1²) = √2.', True)
    + STEPS([f'sin 45° = {FR(B("1", OP), B("√2", HY))}',
             f'kos 45° = {FR(B("1", AD), B("√2", HY))}',
             f'tan 45° = {FR(B("1", OP), B("1", AD))} = 1'], col)
    + NOTE(f'{FR(1, "√2")} juga boleh ditulis {FR("√2", 2)} ≈ 0.7071.'),
    svg(fig, 'Segi tiga sama kaki bersudut tegak dengan sisi 1, 1 dan punca kuasa dua 2'))

# 5.1.4-5 Sudut 30° dan 60°
assert abs(sin(30) - 0.5) < 1e-12 and abs(cos(30) - math.sqrt(3) / 2) < 1e-12 and abs(tan(60) - math.sqrt(3)) < 1e-12
Ap, Lb, Rb = (250, 60), (70, 372), (430, 372)
Mm = (250, 372)
fig = POLY([Ap, Lb, Rb], f'{PU}0F', DIM, 2.5) + LINE(Ap, Lb, DIM, 3, '7 6')
fig += TRI(Rb, Mm, Ap, labs=('2', '√3', '1'), lsize=24, th='60°', arc_r=44)
fig += ARC(Ap, Mm, Rb, 50, GR, 4, '30°', 19, 22)
fig += T(250, 420, 'Separuh segi tiga sama sisi bersisi 2', MU3, 18, halo=False)
assert 1 + 3 == 4
SPEC = [['sin', FR(1, 2), FR(1, '√2'), FR('√3', 2)], ['kos', FR('√3', 2), FR(1, '√2'), FR(1, 2)], ['tan', FR(1, '√3'), '1', '√3']]
add('5.1.4', 'SUDUT KHAS', 'Nilai bagi 30° dan 60°',
    P('Bahagi dua segi tiga sama sisi bersisi 2 unit: sisi 1, √3 dan 2.', True)
    + TABLE(['', '30°', '45°', '60°'], SPEC, col, rv=True)
    + NOTE('sin 30° = kos 60° dan sin 60° = kos 30°. Nilai ini ditentukan <b>tanpa kalkulator</b>.'),
    svg(fig, 'Segi tiga sama sisi dibahagi dua untuk sudut 30 dan 60 darjah'))

# 5.1.4-6 Operasi
assert F(1, 2) + F(1, 2) == 1 and 1 - 2 * F(1, 2) == 0
assert abs(2 * sin(60) * cos(30) - 1.5) < 1e-12 and abs(tan(60) * tan(30) - 1) < 1e-12
fig = RECT(20, 30, 460, 120, SURF, BD, 18, 2)
fig += T(250, 70, 'sin 30° + kos 60°', TX, 23) + T(250, 115, '= ½ + ½ = 1', GR, 24)
fig += RECT(20, 172, 460, 120, SURF, BD, 18, 2)
fig += T(250, 212, 'tan 45° − 2 sin 30°', TX, 23) + T(250, 257, '= 1 − 2(½) = 0', GR, 24)
fig += RECT(20, 314, 460, 130, SURF, BD, 18, 2)
fig += T(250, 354, '2 sin 60° × kos 30°', TX, 23) + T(250, 402, '= 2 × √3/2 × √3/2 = 3/2', GR, 22)
add('5.1.4', 'OPERASI', 'Operasi dengan sudut khas',
    P(f'Hitung nilai 2 sin 60° × kos 30° tanpa menggunakan kalkulator.', True)
    + STEPS([f'Gantikan nilai: sin 60° = {FR("√3", 2)}, kos 30° = {FR("√3", 2)}',
             f'= 2 × {FR("√3", 2)} × {FR("√3", 2)} = 2 × {FR(3, 4)}',
             f'= {FR(3, 2)}'], col)
    + ANS(f'{FR(3, 2)}')
    + NOTE('Ganti setiap nisbah dengan nilainya dahulu, kemudian ikut tertib operasi.'),
    svg(fig, 'Tiga contoh operasi melibatkan nilai sudut khas'))

# 5.1.4-7 Kesilapan biasa & ringkasan
assert abs(sin(30) + sin(60) - sin(90)) > 0.3
fig = ''
CASES = [(48, 'Mod RAD: sin 30 = −0.988', False), (124, 'Mod DEG: sin 30° = 0.5', True),
         (210, 'sin 30° + sin 60° = sin 90°', False), (286, '35°24′ = 35.24°', False), (362, '35°24′ = 35.4°', True)]
for y, t, ok in CASES:
    fig += RECT(20, y - 30, 460, 60, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(50, y) if ok else CROSS(50, y)) + T(80, y, t, GR if ok else RD, 20, 'start')
fig += T(250, 438, 'sin 30° + sin 60° ≈ 1.366, bukan 1', MU3, 18, halo=False)
add('5.1.4', 'KESILAPAN &amp; RINGKASAN', 'Perkara penting 5.1.4',
    BUL([f'{B("Mod kalkulator salah", RD)} ✗: pastikan mod darjah (D), bukan radian (R).',
         f'{B("sin A + sin B = sin (A + B)", RD)} ✗: kira setiap nilai secara berasingan.',
         f'{B("Minit dianggap perpuluhan", RD)} ✗: 24′ = 0.4°, bukan 0.24°.'], col)
    + TABLE(['', '30°', '45°', '60°'], SPEC, col),
    svg(fig, 'Contoh kesilapan dan penggunaan betul kalkulator'))

# ===================== 5.1.7 PENYELESAIAN MASALAH =====================
col = SUB['5.1.7'][1]

# 5.1.7-1 Strategi
A_, R_, C_ = (70, 300), (420, 300), (420, 90)
fig = TRI(A_, R_, C_, labs=('hip.', 'bert.', 'bers.'), lsize=20)
fig += RECT(30, 346, 440, 104, SURF, BD, 16, 2)
fig += T(250, 376, 'Dua sisi + satu sudut terlibat?', MU3, 18, halo=False)
fig += T(250, 406, 'Pilih nisbah yang mengandungi', MU3, 18, halo=False)
fig += T(250, 432, 'kedua-dua sisi itu.', MU3, 18, halo=False)
add('5.1.7', 'STRATEGI', 'Nisbah yang mana satu?',
    P('Lihat sisi yang <b>diberi</b> dan sisi yang <b>dicari</b>, kemudian pilih nisbah yang sesuai.', True)
    + TABLE(['Sisi terlibat', 'Guna'],
            [[f'{B("bertentangan", OP)} &amp; {B("hipotenus", HY)}', f'sin {TH_}'],
             [f'{B("bersebelahan", AD)} &amp; {B("hipotenus", HY)}', f'kos {TH_}'],
             [f'{B("bertentangan", OP)} &amp; {B("bersebelahan", AD)}', f'tan {TH_}']], col, rv=True)
    + NOTE('Lukis dan labelkan rajah dahulu. Tandakan sisi yang diberi dan yang dicari.', 'Langkah 1:'),
    svg(fig, 'Segi tiga bersudut tegak untuk memilih nisbah trigonometri'))

# 5.1.7-2 Cari sisi (pengangka): tangga
h2 = 6 * sin(70); assert d2(h2) == '5.64'
G0 = (90, 400); top = (G0[0] + 300 * cos(70) * 1.0, 400 - 300 * sin(70))
WX = top[0]
fig = RECT(WX, 40, 40, 360, DIM, MU2, 0, 2) + LINE((30, 400), (470, 400), MU2, 4)
fig += TRI(G0, (WX, 400), top, labs=('6 m', 'h', ''), lsize=22, th='70°', arc_r=46, fill=True)
fig += T(WX + 60, 30, 'dinding', MU, 17, halo=False)
fig += T(250, 440, 'h = 6 sin 70°', OP, 20, halo=False)
add('5.1.7', 'CONTOH BERLANGKAH', 'Mencari sisi: tangga',
    P('Sebatang tangga sepanjang 6 m disandarkan pada dinding dan membuat sudut 70° dengan lantai. Cari tinggi <i>h</i> hujung atas tangga.', True)
    + STEPS([f'Diberi {B("hipotenus = 6 m", HY)}, dicari {B("bertentangan = h", OP)} → guna <b>sin</b>.',
             f'sin 70° = {FR("<i>h</i>", 6)} → <i>h</i> = 6 × sin 70°',
             f'<i>h</i> = {d2(h2)} m (2 tempat perpuluhan)'], col)
    + ANS(f'Tinggi = {d2(h2)} m'),
    svg(fig, 'Tangga 6 m membuat sudut 70 darjah dengan lantai'))

# 5.1.7-3 Cari sisi (penyebut): tanjakan
L3 = 1.2 / sin(8); assert d2(L3) == '8.62'
fig = LINE((20, 380), (480, 380), MU2, 4)
A3, R3, C3 = (40, 360), (400, 360), (400, 360 - 360 * tan(8) * 2.4)
fig += TRI(A3, R3, C3, labs=('x', '1.2 m', ''), lsize=22, th='8°', arc_r=90, fill=True)
fig += T(250, 110, 'Tanjakan ke pintu masuk', MU3, 19, halo=False)
fig += T(250, 430, 'x = 1.2 ÷ sin 8°', HY, 20, halo=False)
fig += T(250, 455, '(rajah tidak mengikut skala)', MU2, 15, halo=False)
add('5.1.7', 'CONTOH BERLANGKAH', 'Sisi yang dicari di penyebut',
    P('Sebuah tanjakan setinggi 1.2 m membuat sudut 8° dengan tanah. Hitung panjang permukaan tanjakan, <i>x</i>.', True)
    + STEPS([f'Diberi {B("bertentangan = 1.2 m", OP)}, dicari {B("hipotenus = x", HY)} → guna <b>sin</b>.',
             f'sin 8° = {FR("1.2", "<i>x</i>")} → <i>x</i> = {FR("1.2", "sin 8°")}',
             f'<i>x</i> = {d2(L3)} m'], col)
    + ANS(f'Panjang tanjakan = {d2(L3)} m')
    + NOTE('Jika sisi yang dicari berada di <b>penyebut</b>, bahagikan (bukan darab).'),
    svg(fig, 'Tanjakan setinggi 1.2 meter dengan sudut 8 darjah'))

# 5.1.7-4 Cari sudut: tiang bendera
th4 = math.degrees(math.atan(9 / 5)); assert dm(th4) == '60°57′' and d2(th4) == '60.95'
sc = 34
G4 = (100, 400); F4 = (G4[0] + 5 * sc * 1.6, 400); T4 = (F4[0], 400 - 9 * sc)
fig = LINE((30, 400), (470, 400), MU2, 4)
fig += TRI(G4, F4, T4, labs=('tali', '9 m', '5 m'), lsize=21, arc_r=40)
fig += f'<path d="M{r1(T4[0])} {r1(T4[1])} h70 v40 h-70 Z" fill="{RD}55" stroke="{RD}" stroke-width="2"/>'
fig += T(250, 444, 'tan θ = 9 ÷ 5', TH, 20, halo=False)
add('5.1.7', 'CONTOH BERLANGKAH', 'Mencari sudut: tiang bendera',
    P('Tiang bendera setinggi 9 m diikat dengan tali dari puncaknya ke satu titik di tanah 5 m dari kaki tiang. Cari sudut <i>θ</i> antara tali dengan tanah.', True)
    + STEPS([f'Diberi {B("bertentangan = 9 m", OP)} dan {B("bersebelahan = 5 m", AD)} → guna <b>tan</b>.',
             f'tan <i>θ</i> = {FR(9, 5)} = 1.8',
             f'<i>θ</i> = tan⁻¹ 1.8 = {d2(th4)}° = {dm(th4)}'], col)
    + ANS(f'<i>θ</i> = {dm(th4)}'),
    svg(fig, 'Tiang bendera 9 meter dengan tali ke tanah 5 meter dari kaki tiang'))

# 5.1.7-5 Ukur tinggi pokok dengan klinometer
hp = 15 * tan(40); tot = hp + 1.5
assert d2(hp) == '12.59' and d2(tot) == '14.09'
E5 = (80, 330); Tp = (420, 330 - 340 * tan(40) * 0.86)
fig = LINE((20, 400), (480, 400), MU2, 4)
fig += RECT(70, 330, 20, 70, DIM, MU2, 6, 2) + f'<circle cx="80" cy="318" r="13" fill="{DIM}" stroke="{MU2}" stroke-width="2"/>'
fig += LINE((420, 400), (420, Tp[1] + 30), MU3, 10)
fig += f'<circle cx="420" cy="{r1(Tp[1] + 40)}" r="46" fill="{GR}33" stroke="{GR}" stroke-width="3"/>'
fig += TRI(E5, (420, 330), Tp, labs=('', 'x', '15 m'), lsize=21, th='40°', arc_r=56)
fig += LINE((440, 330), (440, 400), PU, 3, '6 5') + T(450, 366, '1.5 m', PU, 17, 'start')
fig += T(250, 432, 'Tinggi = x + 1.5 m', MU3, 19, halo=False) + T(250, 458, '(rajah tidak mengikut skala)', MU2, 15, halo=False)
add('5.1.7', 'CONTOH BERLANGKAH', 'Mengukur tinggi pokok',
    P('Amir berdiri 15 m dari sebatang pokok. Dengan klinometer pada paras mata 1.5 m, sudut ke puncak pokok ialah 40°. Hitung tinggi pokok.', True)
    + STEPS([f'Bersebelahan = 15 m, bertentangan = <i>x</i> → tan 40° = {FR("<i>x</i>", 15)}',
             f'<i>x</i> = 15 × tan 40° = {d2(hp)} m',
             f'Tinggi pokok = {d2(hp)} + 1.5 = {d2(tot)} m'], col)
    + ANS(f'Tinggi pokok ≈ {d2(tot)} m')
    + NOTE('Jangan lupa tambah <b>tinggi paras mata</b>.'),
    svg(fig, 'Murid mengukur tinggi pokok dengan klinometer pada sudut 40 darjah'))

# 5.1.7-6 Kesilapan biasa
fig = ''
CASES = [(50, 'x = 6 ÷ sin 70° (sisi di pengangka)', False), (126, 'x = 6 × sin 70°', True),
         (216, 'x = 1.2 × sin 8° (sisi di penyebut)', False), (292, 'x = 1.2 ÷ sin 8°', True),
         (382, 'Bundar awal: tan 40° ≈ 0.8 → 12 m', False)]
for y, t, ok in CASES:
    fig += RECT(20, y - 30, 460, 60, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(48, y) if ok else CROSS(48, y)) + T(74, y, t, GR if ok else RD, 18, 'start')
fig += T(250, 446, 'Bundarkan hanya pada jawapan akhir', MU3, 18, halo=False)
add('5.1.7', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Darab atau bahagi tersilap", RD)} ✗: susun semula persamaan dengan berhati-hati.',
         f'{B("Bundarkan terlalu awal", RD)} ✗: guna nilai penuh kalkulator hingga langkah akhir.',
         f'{B("Lupa tinggi paras mata", RD)} atau unit dalam jawapan ✗',
         f'{B("Pilih nisbah salah", RD)} ✗: semak dua sisi yang terlibat.'], col),
    svg(fig, 'Contoh langkah yang betul dan salah semasa menyelesaikan masalah'))

# 5.1.7-7 Ringkasan bab
A_, R_, C_ = (70, 270), (420, 270), (420, 70)
fig = TRI(A_, R_, C_, labs=('hipotenus', 'bertentangan', 'bersebelahan'), lsize=19)
fig += RECT(20, 298, 460, 160, SURF, BD, 16, 2)
for yy, a, b in [(322, 'sin 30° = ½', 'kos 60° = ½'), (360, 'sin 45° = kos 45° = 1/√2', 'tan 45° = 1'),
                 (398, 'tan 30° = 1/√3', 'tan 60° = √3')]:
    fig += T(160, yy, a, MU3, 17, halo=False) + T(380, yy, b, MU3, 17, halo=False)
fig += T(250, 436, 'sin 60° = kos 30° = √3/2', MU3, 17, halo=False)
add('5.1.7', 'RINGKASAN', 'Ringkasan bab',
    TABLE(['Langkah', 'Tindakan'],
          [['1', 'Lukis rajah, kenal pasti sudut, sisi diberi dan dicari'],
           ['2', 'Pilih sin, kos atau tan'],
           ['3', 'Bentuk persamaan dan selesaikan (× atau ÷)'],
           ['4', 'Sudut: guna sin⁻¹, kos⁻¹ atau tan⁻¹']], col, rv=True)
    + NOTE('Beri jawapan dengan unit dan bundarkan seperti yang diminta.'),
    svg(fig, 'Ringkasan bab nisbah trigonometri'))

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
assert 'NaN' not in js_body and 'None' not in js_body and not re.search(r'\bnan\b', js_body)
assert counts == {'5.1.1': 6, '5.1.2': 7, '5.1.4': 7, '5.1.7': 7}, counts

js = ('/* Dijana oleh tools/trigonometri/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
