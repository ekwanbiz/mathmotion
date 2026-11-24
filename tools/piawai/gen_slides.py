# Penjana slaid NOTA PIAWAI (Tingkatan 3 Bab 2 Bentuk Piawai) -> piawai/slides.js
# Jalankan:  python3 tools/piawai/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
import json, os, html, re, math
from decimal import Decimal as D, ROUND_HALF_UP

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'piawai', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM Tingkatan 3 Bab 2: SK 2.1 Angka Bererti, SK 2.2 Bentuk Piawai
SUB = {
    '2.1': ('Angka Bererti', C['tr']),
    '2.2': ('Bentuk Piawai', C['pu']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
NB = ' '   # ruang tidak putus untuk kumpulan digit

# =================== semakan matematik ===================
def sf_count(s, place=None):
    """Bilangan angka bererti bagi rentetan nombor. place = kuasa 10 kejituan bagi nombor bulat bersifar di hujung."""
    s = s.replace(' ', '').replace(NB, '')
    if '.' in s:
        d = s.replace('.', '').lstrip('0')
        return len(d)
    d = s.lstrip('0')
    if place is None:
        return len(d.rstrip('0'))
    assert d.endswith('0' * place)
    return len(d) - place

def round_sf(x, n):
    """Bundarkan Decimal x kepada n angka bererti (separuh ke atas)."""
    x = D(x)
    e = x.adjusted()               # kuasa 10 digit pertama
    q = D(1).scaleb(e - n + 1)
    return x.quantize(q, rounding=ROUND_HALF_UP)

def show(x):
    """Decimal -> teks biasa (tiada notasi E), kekalkan sifar bererti."""
    x = D(x)
    if x == x.to_integral_value() and x.as_tuple().exponent > 0:
        return str(int(x))
    return format(x, 'f')

def grp(s):
    """Kumpulkan digit tiga-tiga (cara KSSM): 47 826, 0.000 305."""
    if '.' in s:
        a, b = s.split('.')
    else:
        a, b = s, None
    if len(a) >= 4:
        r = []
        while len(a) > 3:
            r.insert(0, a[-3:]); a = a[:-3]
        r.insert(0, a); a = NB.join(r)
    if b is not None and len(b) >= 5:
        b = NB.join(b[i:i + 3] for i in range(0, len(b), 3))
    return a if b is None else a + '.' + b

def std(x):
    """Decimal -> (A, n) bentuk piawai tepat (tanpa sifar berlebihan)."""
    x = D(x).normalize()
    n = x.adjusted()
    A = (x.scaleb(-n)).normalize()
    assert 1 <= A < 10
    return A, n

SUPM = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')
def sup(n): return str(n).translate(SUPM)
def pw(A, n, html_=True):
    a = format(D(A), 'f')
    if html_:
        return f'<span style="white-space: nowrap">{a} × 10<sup>{"−" if n < 0 else ""}{abs(n)}</sup></span>'
    return f'{a} × 10{sup(n)}'

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

SUPBACK = dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿᵃᵇ', '0123456789−+nab'))
def supify(t, size):
    """Aksara superskrip Unicode -> tspan kecil yang dinaikkan (fon latin tidak mempunyai glif superskrip)."""
    if not any(ch in SUPBACK for ch in t): return t
    out, i, up = '', 0, round(size * 0.42, 1)
    while i < len(t):
        j = i
        if t[i] in SUPBACK:
            while j < len(t) and t[j] in SUPBACK: j += 1
            seg = ''.join(SUPBACK[c] for c in t[i:j])
            out += f'<tspan dy="{-up}" font-size="{round(size * 0.68, 1)}">{seg}</tspan>'
            if j < len(t): out += f'<tspan dy="{up}">'; close = True
            else: close = False
            i = j
            # baki teks dalam tspan yang turun semula
            k = i
            while k < len(t) and t[k] not in SUPBACK: k += 1
            out += t[i:k] + ('</tspan>' if close else ''); i = k
        else:
            while j < len(t) and t[j] not in SUPBACK: j += 1
            out += t[i:j]; i = j
    return out

def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, halo=True):
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{supify(t, size)}</text>')

def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'

def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'

def CIRC(x, y, r, fill, stroke='none', sw=0, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'

def CROSS(x, y, col=RD, k=9):
    return LINE((x - k, y - k), (x + k, y + k), col, 4) + LINE((x - k, y + k), (x + k, y - k), col, 4)
def TICK(x, y, col=GR, k=9):
    return f'<path d="M{x - k} {y} L{x - k / 3} {y + k * 0.7} L{x + k} {y - k * 0.8}" fill="none" stroke="{col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'

def ARROWHEAD(p, ux, uy, col, k=10):
    a = (p[0] - ux * k - uy * k * 0.6, p[1] - uy * k + ux * k * 0.6)
    b = (p[0] - ux * k + uy * k * 0.6, p[1] - uy * k - ux * k * 0.6)
    return f'<path d="M{r1(a[0])} {r1(a[1])} L{r1(p[0])} {r1(p[1])} L{r1(b[0])} {r1(b[1])}" fill="none" stroke="{col}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'

def ARROW(p, q, col, sw=3.5, head=11):
    dx, dy = q[0] - p[0], q[1] - p[1]; L = (dx * dx + dy * dy) ** .5 or 1
    return LINE(p, q, col, sw) + ARROWHEAD(q, dx / L, dy / L, col, head)

def HOP(x1, x2, y, col, h=26):
    """Lengkung lompatan titik perpuluhan dari x1 ke x2 (di atas jubin)."""
    mx = (x1 + x2) / 2
    s = f'<path d="M{r1(x1)} {r1(y)} Q{r1(mx)} {r1(y - h)} {r1(x2)} {r1(y)}" fill="none" stroke="{col}" stroke-width="3" stroke-linecap="round"/>'
    ux = 1 if x2 > x1 else -1
    # arah tangen di hujung lengkung kuadratik: (x2 - mx, y - (y-h)) = (±d/2, h)
    tx, ty = x2 - mx, h; L = (tx * tx + ty * ty) ** .5
    return s + ARROWHEAD((x2, y), tx / L, ty / L, col, 9)

# ---------- jubin digit ----------
TW, TH, TG, PW_ = 44, 56, 6, 18      # lebar jubin, tinggi, jarak, lebar titik perpuluhan
def tiles_w(s, tw=TW, tg=TG, pw_=PW_):
    w = 0
    for ch in s:
        w += pw_ if ch == '.' else (12 if ch == ' ' else tw + tg)
    return w - tg

def TILES(cx, y, s, cols, tw=TW, th=TH, tg=TG, pw_=PW_, fs=30, point=None):
    """Lukis nombor s sebagai jubin digit berpusat di cx. cols: warna setiap digit (ikut tertib digit).
    Pulangkan (svg, senarai pusat-x digit, senarai x jurang [sebelum digit 0 .. selepas digit akhir])."""
    x = cx - tiles_w(s, tw, tg, pw_) / 2
    out, xs, gaps, di = '', [], [], 0
    gaps.append(x - tg / 2)
    for ch in s:
        if ch == '.':
            out += CIRC(x + pw_ / 2 - tg / 2, y + th - 8, 5.5, point or AM)
            x += pw_
            continue
        if ch == ' ':
            x += 12; continue
        col = cols[di] if di < len(cols) else TX
        fill = f'{col}22' if col not in (DIM, MU2) else SURF
        tcol = col if col not in (DIM, MU2) else MU2
        out += RECT(x, y, tw, th, fill, col if col != MU2 else DIM, 10, 2.5)
        out += T(x + tw / 2, y + th / 2 + 1, ch, tcol, fs, halo=False)
        xs.append(x + tw / 2)
        x += tw + tg
        gaps.append(x - tg / 2)
        di += 1
    return out, xs, gaps

def ndig(s): return sum(ch.isdigit() for ch in s)

def sig_cols(s, place=None, yes=GR, no=MU2, maybe=AM, maybe_on=False):
    """Warna jubin: bererti (hijau), tidak bererti (kelabu), sifar hujung nombor bulat (kuning)."""
    digs = [ch for ch in s if ch.isdigit()]
    if '.' in s:
        first = next(i for i, d in enumerate(digs) if d != '0')
        return [no if i < first else yes for i in range(len(digs))]
    first = next(i for i, d in enumerate(digs) if d != '0')
    last = max(i for i, d in enumerate(digs) if d != '0')
    cols = []
    for i in range(len(digs)):
        if i < first: cols.append(no)
        elif i <= last: cols.append(yes)
        else:
            if place is not None:
                cols.append(yes if i < len(digs) - place else no)
            else:
                cols.append(maybe)
    return cols

# =================== slaid ===================
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 2.1 ANGKA BERERTI =====================
col = SUB['2.1'][1]

# 2.1-1 Definisi: pembaris
assert sf_count('12') == 2 and sf_count('12.4') == 3 and sf_count('12.40') == 4
fig = RECT(14, 14, 472, 442)
x0, sc = 50, 100          # 10 cm .. 14 cm  -> 50 .. 450 px
fig += RECT(36, 236, 428, 70, f'{AM}26', AM, 8, 2.5)
for i in range(0, 41):
    x = x0 + i * 10
    hgt = 30 if i % 10 == 0 else (20 if i % 5 == 0 else 12)
    fig += LINE((x, 236), (x, 236 + hgt), AM, 2 if i % 10 else 3, cap='butt')
    if i % 10 == 0:
        fig += T(x, 288, str(10 + i // 10), AM, 17, halo=False)
# pensel 12.4 cm (bermula pada 10 cm untuk paparan; hujung pada 12.4)
xe = x0 + 2.4 * sc
fig += f'<path d="M{x0} 176 H{xe - 26} L{xe} 196 L{xe - 26} 216 H{x0} Z" fill="{PA}40" stroke="{PA}" stroke-width="3" stroke-linejoin="round"/>'
fig += LINE((xe, 150), (xe, 236), TX, 2.5, '5 5')
fig += T(xe, 136, 'hujung pensel', MU, 16, halo=False)
fig += RECT(36, 330, 428, 54, SURF, BD, 14, 2) + T(56, 357, 'Anggaran: 12 cm', MU3, 20, 'start') + T(444, 357, '2 a.b.', TR, 20, 'end')
fig += RECT(36, 392, 428, 54, SURF, GR, 14, 2) + T(56, 419, 'Lebih jitu: 12.4 cm', GR, 20, 'start') + T(444, 419, '3 a.b.', GR, 20, 'end')
fig += T(250, 60, 'Panjang pensel diukur dengan pembaris', MU3, 18, halo=False)
fig += T(250, 92, 'Bacaan bermula pada 10 cm', MU, 16, halo=False)
add('2.1', 'DEFINISI', 'Apa itu angka bererti?',
    DEF('<b>Angka bererti</b> ialah digit dalam suatu nombor yang menunjukkan <b>tahap kejituan</b> nombor itu.', col)
    + BUL(['Semakin banyak angka bererti, semakin <b>jitu</b> nilai itu.',
           f'Panjang 12 cm mempunyai {B("2 angka bererti", TR)}, manakala 12.4 cm mempunyai {B("3 angka bererti", GR)}.',
           'Angka bererti digunakan untuk ukuran, anggaran dan pembundaran.'], col)
    + NOTE('<b>a.b.</b> ialah singkatan bagi <b>angka bererti</b>.', 'Singkatan:'),
    svg(fig, 'Pembaris mengukur pensel: 12 cm (2 a.b.) dan 12.4 cm (3 a.b.)'))

# 2.1-2 Peraturan
RULES = [('2006', None, 4), ('6.30', None, 3), ('0.0047', None, 2), ('7200', None, None)]
assert sf_count('3452') == 4 and sf_count('2006') == 4 and sf_count('5.08') == 3 and sf_count('6.30') == 3
assert sf_count('0.0047') == 2 and sf_count('7200') == 2 and sf_count('7200', 1) == 3 and sf_count('7200', 0) == 4
fig = ''
labs = ['sifar di antara digit bukan sifar', 'sifar di hujung nombor perpuluhan', 'sifar di hadapan: tidak bererti', 'sifar di hujung nombor bulat']
for i, (s, pl, n) in enumerate(RULES):
    y = 18 + i * 104
    fig += RECT(14, y, 472, 96, SURF, BD, 16, 2)
    g, xs, _ = TILES(178, y + 10, s, sig_cols(s, pl), tw=40, th=48, fs=26)
    fig += g
    fig += T(330, y + 34, f'{n} a.b.' if n else '2, 3 atau 4', GR if n else AM, 20, 'start')
    fig += T(250, y + 78, labs[i], MU3, 16, halo=False)
add('2.1', 'PERATURAN', 'Menentukan angka bererti',
    TABLE(['Peraturan', 'Contoh', 'a.b.'],
          [['Semua digit <b>bukan sifar</b> adalah bererti', grp('3452'), '4'],
           ['Sifar <b>di antara</b> digit bukan sifar adalah bererti', f'{grp("2006")}, 5.08', '4, 3'],
           ['Sifar <b>di hujung</b> nombor perpuluhan adalah bererti', '6.30', '3'],
           ['Sifar <b>di hadapan</b> digit bukan sifar pertama <b>tidak</b> bererti', '0.0047', '2'],
           ['Sifar di hujung <b>nombor bulat</b>: bergantung pada kejituan', grp('7200'), '2, 3, 4']], col, rv=True)
    + NOTE(f'{B("Hijau", GR)}: bererti · {B("Kelabu", MU)}: tidak bererti · {B("Kuning", AM)}: bergantung pada kejituan.', 'Rajah:'),
    svg(fig, 'Jubin digit menunjukkan digit bererti dan tidak bererti'))

# 2.1-3 Contoh: tentukan bilangan a.b.
EX = [('40109', None, 'Sifar di antara digit bukan sifar'), ('0.0805', None, 'Sifar di hadapan tidak bererti'),
      ('15.00', None, 'Sifar di hujung perpuluhan bererti'), ('3600', 2, 'Tepat kepada ratus terdekat'), ('3600', 1, 'Tepat kepada puluh terdekat')]
ANSN = [sf_count(s, p) for s, p, _ in EX]
assert ANSN == [5, 3, 4, 2, 3], ANSN
fig = ''
for i, (s, pl, why) in enumerate(EX):
    y = 14 + i * 90
    fig += RECT(14, y, 472, 82, SURF, BD, 16, 2)
    g, xs, _ = TILES(150, y + 9, s, sig_cols(s, pl), tw=34, th=42, fs=23, pw_=14)
    fig += g + T(300, y + 30, f'{ANSN[i]} a.b.', GR, 21, 'start')
    fig += T(250, y + 66, why, MU3, 15, halo=False)
rows = []
for i, (s, pl, why) in enumerate(EX):
    ctx = '' if pl is None else (' (tepat kepada ratus terdekat)' if pl == 2 else ' (tepat kepada puluh terdekat)')
    rows.append([f'({"abcde"[i]}) {grp(s)}{ctx}', f'<b>{ANSN[i]}</b>'])
add('2.1', 'CONTOH', 'Berapa angka bererti?',
    P('Tentukan bilangan angka bererti bagi setiap nombor berikut.', True)
    + TABLE(['Nombor', 'a.b.'], rows, col, rv=True)
    + NOTE('Bagi nombor bulat seperti 3 600, kejituan mesti dinyatakan. Jika tiada maklumat, kira digit hingga digit bukan sifar terakhir: <b>2 a.b.</b>'),
    svg(fig, 'Lima contoh nombor dengan digit bererti diwarnakan hijau'))

# 2.1-4 Membundarkan nombor bulat
x = D(47826); r = round_sf(x, 3)
assert show(r) == '47800' and sf_count('47800', 2) == 3
fig = RECT(14, 14, 472, 442)
s0 = '47826'
g, xs, gaps = TILES(250, 120, s0, [GR, GR, PU, PK, PK], fs=30)
fig += g
fig += T(xs[2], 92, 'digit ke-3', PU, 17)
fig += ARROW((xs[2], 100), (xs[2], 116), PU, 3, 8)
fig += T(xs[3], 200, '2 < 5', PK, 18)
fig += T(250, 238, '8 kekal, digit selepasnya → 0', MU3, 18, halo=False)
fig += ARROW((250, 256), (250, 296), MU3, 3, 10)
g, xs2, _ = TILES(250, 308, show(r), [GR, GR, PU, DIM, DIM], fs=30)
fig += g
fig += T(250, 392, f'{grp("47826")} ≈ {grp(show(r))}', GR, 24)
fig += T(250, 428, 'betul kepada 3 angka bererti', MU, 17, halo=False)
fig += T(250, 54, 'Bundarkan 47 826 kepada 3 a.b.', TX, 20, halo=False)
add('2.1', 'MEMBUNDARKAN', 'Membundarkan kepada n a.b.',
    BUL([f'Kenal pasti {B("digit ke-n", PU)} (digit bukan sifar pertama ialah digit ke-1).',
         f'Lihat {B("digit selepasnya", PK)}: jika <b>≥ 5</b>, tambah 1 pada digit ke-n; jika <b>&lt; 5</b>, digit ke-n kekal.',
         'Nombor bulat: digit selepas digit ke-n diganti dengan <b>sifar</b>. Nombor perpuluhan: digit itu <b>digugurkan</b>.'], col)
    + STEPS([f'Digit ke-3 ialah {B("8", PU)}; digit selepasnya ialah {B("2", PK)}.',
             '2 &lt; 5, maka 8 kekal. Gantikan 2 dan 6 dengan sifar.'], col)
    + ANS(f'{grp("47826")} = {grp(show(r))} (3 a.b.)'),
    svg(fig, 'Jubin digit 47 826 dibundarkan kepada 47 800'))

# 2.1-5 Contoh perpuluhan
x = D('0.06397')
r2, r3 = round_sf(x, 2), round_sf(x, 3)
assert show(r2) == '0.064' and show(r3) == '0.0640' and sf_count(show(r3)) == 3 and sf_count(show(r2)) == 2
fig = RECT(14, 14, 472, 442)
s0 = '0.06397'
g, xs, gaps = TILES(250, 96, s0, [MU2, MU2, GR, GR, GR, PK], fs=28, tw=42)
fig += g
for k, lab in ((2, 'ke-1'), (3, 'ke-2'), (4, 'ke-3')):
    fig += T(xs[k], 80, lab, GR, 15)
fig += T((xs[0] + xs[1]) / 2, 174, 'tidak bererti', MU, 15, halo=False)
fig += RECT(30, 214, 440, 100, SURF, TR, 16, 2)
fig += T(50, 240, '(a) 2 a.b.: digit ke-3 ialah 9 ≥ 5', MU3, 17, 'start', halo=False)
fig += T(50, 280, '0.06|397 → 0.064', TR, 24, 'start')
fig += RECT(30, 330, 440, 110, SURF, GR, 16, 2)
fig += T(50, 356, '(b) 3 a.b.: digit ke-4 ialah 7 ≥ 5', MU3, 17, 'start', halo=False)
fig += T(50, 396, '0.063|97 → 0.0640', GR, 24, 'start')
fig += T(50, 424, '9 + 1 = 10: tulis 0, bawa 1 ke 3 → 4', MU, 15, 'start', halo=False)
add('2.1', 'CONTOH BERLANGKAH', 'Membundarkan nombor perpuluhan',
    P('Bundarkan 0.063 97 kepada (a) 2 angka bererti (b) 3 angka bererti.', True)
    + STEPS(['Abaikan sifar di hadapan. Digit bererti pertama ialah <b>6</b>.',
             f'(a) 6, 3 | 9: 9 ≥ 5, maka 3 menjadi 4 → {B(show(r2), TR)}',
             f'(b) 6, 3, 9 | 7: 7 ≥ 5, maka 9 menjadi 10 → {B(show(r3), GR)}'], col)
    + ANS(f'(a) {show(r2)} &nbsp; (b) {show(r3)}')
    + NOTE('Dalam (b), sifar terakhir <b>mesti ditulis</b>. 0.0640 mempunyai 3 a.b., tetapi 0.064 hanya 2 a.b.'),
    svg(fig, 'Jubin digit 0.06397 dibundarkan kepada 2 dan 3 angka bererti'))

# 2.1-6 Penyelesaian masalah: luas segi empat tepat
L_, W_ = D('4.6'), D('3.25')
luas = L_ * W_; rl = round_sf(luas, 3)
assert luas == D('14.950') and show(rl) == '15.0' and sf_count('15.0') == 3
fig = RECT(14, 14, 472, 442)
fig += RECT(80, 90, 340, 240, f'{TR}22', TR, 6, 4)
fig += T(250, 350, '4.6 cm', PK, 22) + T(430, 198, '3.25', AM, 22, 'start') + T(430, 226, 'cm', AM, 18, 'start')
fig += T(250, 200, 'Luas = ?', TX, 26)
fig += RECT(40, 376, 420, 64, SURF, GR, 14, 2)
fig += T(250, 408, '14.95 cm² ≈ 15.0 cm² (3 a.b.)', GR, 22)
add('2.1', 'PENYELESAIAN MASALAH', 'Luas sekeping kad',
    P('Sekeping kad berbentuk segi empat tepat berukuran 4.6 cm × 3.25 cm. Hitung luas kad itu, betul kepada 3 angka bererti.', True)
    + STEPS(['Luas = 4.6 × 3.25 = 14.95 cm²',
             '3 a.b.: 1, 4, 9 | 5 → 5 ≥ 5, maka 9 menjadi 10',
             '14.9 → 15.0 (bawa 1 ke digit 4)'], col)
    + ANS('Luas ≈ 15.0 cm²')
    + NOTE('Bundarkan pada langkah <b>terakhir</b> sahaja. Jawapan 15 hanya mempunyai 2 a.b.'),
    svg(fig, 'Segi empat tepat 4.6 cm kali 3.25 cm dengan luas 15.0 cm persegi'))

# 2.1-7 Kesilapan biasa
assert show(round_sf(D('2.3456'), 2)) == '2.3'
assert show(round_sf(D('2.3456'), 4)) == '2.346' and show(round_sf(D('2.346'), 3)) == '2.35' and show(round_sf(D('2.35'), 2)) == '2.4'
CASES = [('47 826 ≈ 478 (3 a.b.)', False, 'sifar pemegang tempat hilang'), ('47 826 ≈ 47 800 (3 a.b.)', True, ''),
         ('0.0047 ada 4 a.b.', False, 'sifar di hadapan dikira'), ('0.0047 ada 2 a.b.', True, ''),
         ('2.3456 → 2.346 → 2.35 → 2.4', False, 'bundar berperingkat'), ('2.3456 ≈ 2.3 (2 a.b.)', True, '')]
fig = ''
for i, (t, ok, why) in enumerate(CASES):
    y = 44 + i * 74
    fig += RECT(18, y - 30, 464, 60, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(48, y) if ok else CROSS(48, y)) + T(76, y - (8 if why else 0), t, GR if ok else RD, 19, 'start')
    if why: fig += T(76, y + 16, why, MU, 14, 'start', halo=False)
add('2.1', 'KESILAPAN BIASA', 'Elakkan kesilapan ini',
    BUL([f'{B("Lupa sifar pemegang tempat", RD)}: 47 826 ≈ 478 ✗ → nilai mesti hampir sama, iaitu 47 800.',
         f'{B("Mengira sifar di hadapan", RD)}: sifar di hadapan digit bukan sifar pertama (seperti dalam 0.0047) <b>tidak</b> bererti.',
         f'{B("Membuang sifar bererti", RD)}: 0.063 97 ≈ 0.0640 (3 a.b.), bukan 0.064.',
         f'{B("Membundar berperingkat", RD)}: bundarkan <b>terus</b> daripada nombor asal.'], col)
    + NOTE('Selepas membundar, semak: adakah nilai baharu hampir dengan nilai asal?', 'Semak:'),
    svg(fig, 'Contoh jawapan salah dan betul bagi angka bererti'))

# ===================== 2.2 BENTUK PIAWAI =====================
col = SUB['2.2'][1]

# 2.2-1 Definisi
assert std(D('384000')) == (D('3.84'), 5)
fig = RECT(14, 14, 472, 200)
fig += T(250, 104, 'A × 10ⁿ', TX, 58)
fig += ARROW((150, 160), (172, 132), AM, 3, 9) + T(120, 182, '1 ≤ A < 10', AM, 20)
fig += ARROW((380, 142), (342, 92), PU, 3, 9) + T(400, 162, 'n: integer', PU, 20)
CK = [('3.84 × 10⁵', True, ''), ('1 × 10⁻⁶', True, ''), ('45 × 10³', False, 'A ≥ 10'), ('0.8 × 10⁻²', False, 'A < 1')]
for i, (t, ok, why) in enumerate(CK):
    x = 14 + (i % 2) * 240; y = 232 + (i // 2) * 116
    fig += RECT(x, y, 232, 104, SURF, GR if ok else RD, 16, 2)
    fig += (TICK(x + 30, y + 40) if ok else CROSS(x + 30, y + 40)) + T(x + 132, y + 40, t, GR if ok else RD, 23)
    fig += T(x + 116, y + 80, 'bentuk piawai' if ok else f'bukan: {why}', MU3, 15, halo=False)
add('2.2', 'DEFINISI', 'Apa itu bentuk piawai?',
    DEF('<b>Bentuk piawai</b> ialah cara menulis nombor sebagai <b>A × 10<sup><i>n</i></sup></b>, dengan <b>1 ≤ A &lt; 10</b> dan <i>n</i> ialah <b>integer</b>.', col)
    + BUL(['Digunakan untuk menulis nombor yang <b>sangat besar</b> atau <b>sangat kecil</b> secara ringkas.',
           f'Jarak Bumi ke Bulan ≈ 384 000 km = {B(pw(D("3.84"), 5), PU)} km.',
           f'Diameter sel darah merah ≈ 0.000 008 m = {B(pw(8, -6), PU)} m.'], col)
    + NOTE('Nilai A mesti <b>sekurang-kurangnya 1</b> tetapi <b>kurang daripada 10</b>.'),
    svg(fig, 'Bentuk A darab 10 kuasa n dengan contoh betul dan salah'))
assert std(D('0.000008')) == (D(8), -6)

# 2.2-2 Nombor >= 10
v = D('52000'); A, n = std(v); assert (A, n) == (D('5.2'), 4)
fig = RECT(14, 14, 472, 442)
fig += T(250, 54, 'Tulis 52 000 dalam bentuk piawai', TX, 20, halo=False)
g, xs, gaps = TILES(250, 150, '52000', [PU, PU, MU2, MU2, MU2], fs=30, tw=50)
fig += g
fig += CIRC(gaps[5] + 2, 150 + TH - 8, 6, 'none', AM, 2.5, '3 3')
fig += CIRC(gaps[1], 150 + TH - 8, 6.5, AM)
for k in range(5, 1, -1):
    fig += HOP(gaps[k], gaps[k - 1], 140, AM, 26)
fig += T(250, 104, '4 lompatan ke kiri', AM, 18)
fig += T(250, 250, 'titik bergerak 4 tempat ke kiri → n = 4', MU3, 18, halo=False)
fig += RECT(40, 290, 420, 74, SURF, PU, 16, 2)
fig += T(250, 328, f'52 000 = {pw(A, n, False)}', PU, 30)
fig += T(250, 404, 'Nombor ≥ 10 → n positif', GR, 20)
fig += T(250, 434, 'Semak: 5.2 × 10 000 = 52 000 ✓', MU, 16, halo=False)
add('2.2', 'MENULIS BENTUK PIAWAI', 'Nombor besar → bentuk piawai',
    P('Tulis 52 000 dalam bentuk piawai.', True)
    + STEPS(['Letakkan titik perpuluhan selepas <b>digit bukan sifar pertama</b>: A = 5.2',
             'Kira bilangan tempat titik perpuluhan bergerak ke kiri: <b>4 tempat</b>',
             f'Maka <i>n</i> = 4: 52 000 = {pw(A, n)}'], col)
    + ANS(f'52 000 = {pw(A, n)}')
    + NOTE('Sifar di hujung tidak ditulis dalam A: 5.2, bukan 5.2000 (kecuali diminta dalam angka bererti tertentu).'),
    svg(fig, 'Titik perpuluhan 52 000 melompat 4 tempat ke kiri menjadi 5.2 darab 10 kuasa 4'))

# 2.2-3 Nombor < 1 dan menukar balik
v = D('0.000305'); A, n = std(v); assert (A, n) == (D('3.05'), -4)
assert D('7.1').scaleb(-3) == D('0.0071') and D('2.06').scaleb(5) == D('206000')
fig = RECT(14, 14, 472, 442)
fig += T(250, 54, 'Tulis 0.000 305 dalam bentuk piawai', TX, 20, halo=False)
s0 = '0000305'          # jubin tanpa titik; titik asal selepas digit pertama
g, xs, gaps = TILES(250, 150, s0, [MU2, MU2, MU2, MU2, PU, PU, PU], fs=28, tw=46)
fig += g
fig += CIRC(gaps[1], 150 + TH - 8, 6, 'none', AM, 2.5, '3 3')
fig += CIRC(gaps[5], 150 + TH - 8, 6.5, AM)
for k in range(1, 5):
    fig += HOP(gaps[k], gaps[k + 1], 140, AM, 26)
fig += T(250, 104, '4 lompatan ke kanan', AM, 18)
fig += T(250, 250, 'titik bergerak 4 tempat ke kanan → n = −4', MU3, 18, halo=False)
fig += RECT(40, 290, 420, 74, SURF, PU, 16, 2)
fig += T(250, 328, f'0.000 305 = {pw(A, n, False)}', PU, 28)
fig += T(250, 404, 'Nombor antara 0 dan 1 → n negatif', GR, 20)
fig += T(250, 434, 'Semak: 3.05 ÷ 10 000 = 0.000 305 ✓', MU, 16, halo=False)
add('2.2', 'MENULIS BENTUK PIAWAI', 'Nombor kecil ↔ bentuk piawai',
    P('Tulis 0.000 305 dalam bentuk piawai.', True)
    + STEPS(['Letakkan titik perpuluhan selepas digit bukan sifar pertama: A = 3.05',
             f'Titik bergerak <b>4 tempat ke kanan</b>, maka <i>n</i> = −4: {pw(A, n)}'], col)
    + TABLE(['Tukar balik', 'Gerak titik', 'Nombor tunggal'],
            [[pw(D('2.06'), 5), '5 tempat ke kanan', grp('206000')],
             [pw(D('7.1'), -3), '3 tempat ke kiri', '0.0071']], col, rv=True)
    + NOTE('<i>n</i> positif: nombor ≥ 10 · <i>n</i> negatif: nombor antara 0 dan 1 · <i>n</i> = 0: 1 ≤ nombor &lt; 10.'),
    svg(fig, 'Titik perpuluhan 0.000305 melompat 4 tempat ke kanan menjadi 3.05 darab 10 kuasa negatif 4'))

# 2.2-4 Tambah & tolak
a1 = D('3.2').scaleb(4) + D('5.1').scaleb(4); assert std(a1) == (D('8.3'), 4)
a2 = D('4.5').scaleb(5) - D(3).scaleb(4); assert std(a2) == (D('4.2'), 5) and a2 == D(420000)
fig = RECT(14, 14, 472, 442)
fig += T(250, 50, 'Samakan indeks: 3 × 10⁴ = 0.3 × 10⁵', TX, 19, halo=False)
heads = ['10⁵', '10⁴', '10³', '10²', '10¹', '1']
rowsP = [('4', '5', '0', '0', '0', '0'), ('0', '3', '0', '0', '0', '0'), ('4', '2', '0', '0', '0', '0')]
cx0 = 110; cw = 56
for j, h_ in enumerate(heads):
    fig += T(cx0 + j * cw, 96, h_, PU if j == 0 else MU, 17)
for i, rr in enumerate(rowsP):
    y = 120 + i * 82 + (14 if i == 2 else 0)
    colr = [TR, PK, GR][i]
    for j, dch in enumerate(rr):
        lead = (i == 1 and j == 0)
        fig += RECT(cx0 + j * cw - 23, y, 46, 56, SURF if lead else f'{colr}22', DIM if lead else colr, 10, 2.5)
        fig += T(cx0 + j * cw, y + 29, dch, MU2 if lead else colr, 28, halo=False)
fig += T(60, 120 + 82 + 29, '−', PK, 36)
fig += LINE((80, 120 + 2 * 82 + 4), (440, 120 + 2 * 82 + 4), MU3, 3)
fig += T(250, 418, f'{pw(D("4.5"), 5, False)} − {pw(3, 4, False)} = {pw(D("4.2"), 5, False)}', GR, 22)
add('2.2', 'OPERASI', 'Tambah dan tolak',
    BUL(['Jika indeks <b>sama</b>: tambah/tolak nilai A, kekalkan 10<sup><i>n</i></sup>.',
         'Jika indeks <b>berbeza</b>: samakan indeks dahulu.'], col)
    + STEPS([f'(a) {pw(D("3.2"), 4)} + {pw(D("5.1"), 4)} = (3.2 + 5.1) × 10<sup>4</sup> = {B(pw(D("8.3"), 4), GR)}',
             f'(b) {pw(D("4.5"), 5)} − {pw(3, 4)}',
             f'= {pw(D("4.5"), 5)} − {pw(D("0.3"), 5)} = {B(pw(D("4.2"), 5), GR)}'], col)
    + ANS(f'(a) {pw(D("8.3"), 4)} &nbsp; (b) {pw(D("4.2"), 5)}')
    + NOTE('Tukar indeks yang <b>lebih kecil</b> kepada indeks yang lebih besar supaya mudah.'),
    svg(fig, 'Jadual nilai tempat 450 000 tolak 30 000 sama dengan 420 000'))

# 2.2-5 Darab & bahagi
m1 = D('2.5').scaleb(3) * D(4).scaleb(-5); assert m1 == D('0.1') and std(m1) == (D(1), -1)
d1 = D('6.3').scaleb(8) / D(9).scaleb(3); assert d1 == D(70000) and std(d1) == (D(7), 4)
fig = RECT(14, 14, 472, 150, SURF, PU, 16, 2)
fig += T(250, 46, 'Hukum indeks', PU, 19)
fig += T(250, 90, '10ᵃ × 10ᵇ = 10ᵃ⁺ᵇ', TX, 27)
fig += T(250, 134, '10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ', TX, 27)
fig += RECT(14, 180, 472, 134)
fig += T(34, 208, '(a) 2.5 × 4 = 10 → bukan 1 ≤ A < 10', MU3, 17, 'start', halo=False)
fig += T(250, 250, '10 × 10⁻² = 1 × 10⁻¹', GR, 27)
fig += T(250, 290, '10 = 1 × 10¹ → indeks −2 + 1 = −1', MU, 16, halo=False)
fig += RECT(14, 324, 472, 132)
fig += T(34, 352, '(b) 6.3 ÷ 9 = 0.7 → bukan 1 ≤ A < 10', MU3, 17, 'start', halo=False)
fig += T(250, 394, '0.7 × 10⁵ = 7 × 10⁴', GR, 27)
fig += T(250, 432, '0.7 = 7 × 10⁻¹ → indeks 5 − 1 = 4', MU, 16, halo=False)
add('2.2', 'OPERASI', 'Darab dan bahagi',
    P('Darab/bahagi nilai A, kemudian guna hukum indeks bagi 10<sup><i>n</i></sup>.', True)
    + STEPS([f'(a) ({pw(D("2.5"), 3)}) × ({pw(4, -5)}) = (2.5 × 4) × 10<sup>3 + (−5)</sup> = 10 × 10<sup>−2</sup> = {B(pw(1, -1), GR)}',
             f'(b) ({pw(D("6.3"), 8)}) ÷ ({pw(9, 3)}) = (6.3 ÷ 9) × 10<sup>8 − 3</sup> = 0.7 × 10<sup>5</sup> = {B(pw(7, 4), GR)}'], col)
    + ANS(f'(a) {pw(1, -1)} &nbsp; (b) {pw(7, 4)}')
    + NOTE('Selepas mengira, <b>semak nilai A</b>. Jika A ≥ 10 atau A &lt; 1, laraskan semula ke bentuk piawai.'),
    svg(fig, 'Hukum indeks dan pelarasan jawapan ke bentuk piawai'))

# 2.2-6 Penyelesaian masalah: cahaya Matahari
dist = D('1.5').scaleb(8); c_ = D(3).scaleb(5)
t_ = dist / c_; assert t_ == D(500) and std(t_) == (D(5), 2) and divmod(int(t_), 60) == (8, 20)
fig = RECT(14, 14, 472, 442)
for k in range(12):
    a = k * math.pi / 6
    fig += LINE((90 + 62 * math.cos(a), 170 + 62 * math.sin(a)), (90 + 78 * math.cos(a), 170 + 78 * math.sin(a)), AM, 4)
fig += CIRC(90, 170, 52, f'{AM}', AM, 0)
fig += T(90, 268, 'Matahari', AM, 18)
fig += CIRC(414, 170, 24, f'{TR}', GR, 4) + T(414, 222, 'Bumi', TR, 18)
fig += ARROW((174, 170), (380, 170), PA, 4, 12)
fig += T(278, 146, 'cahaya', PA, 18)
fig += T(250, 304, 'jarak = 1.5 × 10⁸ km', PK, 21)
fig += T(250, 336, 'laju cahaya = 3 × 10⁵ km/s', TR, 21)
fig += RECT(40, 366, 420, 70, SURF, GR, 14, 2)
fig += T(250, 401, 'masa = 5 × 10² s = 500 s', GR, 24)
add('2.2', 'PENYELESAIAN MASALAH', 'Berapa lama cahaya Matahari sampai?',
    P(f'Jarak Matahari ke Bumi ialah {pw(D("1.5"), 8)} km. Laju cahaya ialah {pw(3, 5)} km sesaat. Berapakah masa yang diambil oleh cahaya untuk sampai ke Bumi?', True)
    + STEPS(['Masa = jarak ÷ laju',
             f'= ({pw(D("1.5"), 8)}) ÷ ({pw(3, 5)}) = 0.5 × 10<sup>3</sup>',
             f'= {pw(5, 2)} s = 500 s'], col)
    + ANS(f'{pw(5, 2)} saat (kira-kira 8 minit 20 saat)')
    + NOTE('Kenal pasti operasi yang sesuai dahulu, kemudian kira dalam bentuk piawai.'),
    svg(fig, 'Cahaya bergerak dari Matahari ke Bumi sejauh 1.5 kali 10 kuasa 8 km'))

# 2.2-7 Kesilapan biasa & ringkasan
assert std(D('0.0036')) == (D('3.6'), -3)
assert D(3).scaleb(4) + D(2).scaleb(3) == D('3.2').scaleb(4)
assert D(2).scaleb(3) * D(3).scaleb(4) == D(6).scaleb(7)
CASES = [('52 000 = 52 × 10³', '5.2 × 10⁴', 'A mesti kurang daripada 10'),
         ('0.0036 = 3.6 × 10³', '3.6 × 10⁻³', 'nombor kecil: n negatif'),
         ('3 × 10⁴ + 2 × 10³ = 5 × 10⁷', '3.2 × 10⁴', 'samakan indeks dahulu'),
         ('2 × 10³ × 3 × 10⁴ = 6 × 10¹²', '6 × 10⁷', 'indeks ditambah, bukan didarab')]
fig = ''
for i, (wrong, right, why) in enumerate(CASES):
    y = 14 + i * 112
    fig += RECT(14, y, 472, 104, SURF, BD, 16, 2)
    fig += CROSS(42, y + 28) + T(68, y + 28, wrong, RD, 19, 'start')
    fig += TICK(42, y + 62) + T(68, y + 62, right, GR, 21, 'start')
    fig += T(68, y + 88, why, MU, 14, 'start', halo=False)
add('2.2', 'KESILAPAN BIASA', 'Kesilapan biasa & ringkasan',
    TABLE(['Perkara', 'Ingat'],
          [['Bentuk piawai', 'A × 10<sup><i>n</i></sup>, 1 ≤ A &lt; 10, <i>n</i> integer'],
           ['Nombor besar / kecil', '<i>n</i> positif / <i>n</i> negatif'],
           ['Tambah, tolak', 'Samakan indeks dahulu'],
           ['Darab, bahagi', 'Tambah / tolak indeks, kemudian laraskan A']], col, rv=True)
    + NOTE('Selalu semak jawapan akhir: adakah 1 ≤ A &lt; 10?', 'Semak:'),
    svg(fig, 'Empat kesilapan biasa dalam bentuk piawai dan pembetulannya'))

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
assert 'NaN' not in js_body and 'None' not in js_body
assert counts == {'2.1': 7, '2.2': 7}, counts

js = ('/* Dijana oleh tools/piawai/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
