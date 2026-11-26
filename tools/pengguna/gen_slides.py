# Penjana slaid NOTA WANGKU (Tingkatan 3 Bab 3 Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang)
#   -> pengguna/slides.js
# Jalankan:  python3 tools/pengguna/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
raise SystemExit('Dipersarakan: nota Bab 3 T3 kini dijana oleh alat/nota/bina_bab3_t3.py (ikut buku teks).')
import json, os, html, math, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fxsvg import fx_svg, has_fx, fx_html   # pecahan bertingkat & punca (25 Nov)
import mathfmt
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'pengguna', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
# KSSM: SK 3.1 Simpanan dan Pelaburan, SK 3.2 Pengurusan Kredit dan Hutang
SUB = {
    '3.1': ('Simpanan & Pelaburan', C['gr']),
    '3.2': ('Kredit & Hutang', C['pa']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']

# ---------- nombor & wang ----------
def r2(x):
    """Bundar kepada 2 t.p. (separuh ke atas)."""
    return D(str(x)).quantize(D('0.01'), rounding=ROUND_HALF_UP)
def grp(s):
    """Pemisah ribuan = ruang tak putus (gaya buku teks KSSM)."""
    neg = s.startswith('-'); s = s.lstrip('-')
    a, _, b = s.partition('.')
    out = ''
    while len(a) > 3: out = ' ' + a[-3:] + out; a = a[:-3]
    return ('−' if neg else '') + a + out + ('.' + b if b else '')
def rm(x, dp=None):
    """RM: nombor bulat tanpa perpuluhan, jika tidak 2 t.p.; dp=2 paksa 2 t.p."""
    v = r2(x)
    if dp is None and v == v.to_integral_value(): return 'RM' + grp(str(int(v)))
    return 'RM' + grp(f'{v:.2f}')
def num(x):
    v = r2(x)
    return grp(str(int(v))) if v == v.to_integral_value() else grp(f'{v.normalize():f}')

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
def TABLE(head, rows, col, rv=False, fs=19):
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')
def I(t): return f'<i>{t}</i>'
SUP = lambda t: f'<sup>{t}</sup>'

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, italic=False, halo=True, fx=True):
    it = ' font-style="italic"' if italic else ''
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    if fx and has_fx(t):   # fx=False: tarikh (cth 12/29) kekal
        return fx_svg(x, y, t, col, size, anchor, f' {FONT} font-weight="{weight}"{it}{ha}')
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}"{it} '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')
def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def DOT(p, col=TX, r=6.5):
    return f'<circle cx="{r1(p[0])}" cy="{r1(p[1])}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2.5"/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def PATH(d, col, sw=4, fill='none', dash=None):
    ds = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<path d="{d}" fill="{fill}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"{ds}/>'
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
def COIN(x, y, r=14, col=AM):
    return (f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{r}" fill="{col}33" stroke="{col}" stroke-width="3"/>'
            + T(x, y + 1, 'RM', col, r * 0.72, weight=800, halo=False))
def AXES(x0, y0, x1, y1, xl, yl):
    """Paksi: asalan (x0, y0) piksel, hujung x1 (kanan) dan y1 (atas)."""
    return (ARROW((x0, y0), (x1, y0), MU, 2.5, 10) + ARROW((x0, y0), (x0, y1), MU, 2.5, 10)
            + T(x1 - 2, y0 + 46, xl, MU, 16, 'end') + T(x0 + 10, y1 + 2, yl, MU, 16, 'start'))
def BAR(x, base, w, h, col, op='40'):
    return RECT(x, base - h, w, h, f'{col}{op}', col, 6, 2.5)

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig='', full=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig, 'full': full})

# ===================== 3.1 SIMPANAN & PELABURAN =====================
col = SUB['3.1'][1]

# 3.1-1 Definisi
fig = RECT(14, 14, 230, 442) + RECT(256, 14, 230, 442)
fig += T(129, 48, 'SIMPANAN', GR, 22) + T(371, 48, 'PELABURAN', AM, 22)
# tabung
fig += f'<ellipse cx="129" cy="150" rx="70" ry="52" fill="{GR}26" stroke="{GR}" stroke-width="4"/>'
fig += RECT(104, 92, 50, 9, GR, GR, 4, 0) + LINE((80, 196), (80, 212), GR, 8) + LINE((178, 196), (178, 212), GR, 8)
fig += f'<circle cx="168" cy="138" r="5" fill="{GR}"/>' + COIN(129, 72, 13, AM)
for i, t in enumerate(['Akaun simpanan', 'Simpanan tetap', 'Akaun semasa']):
    fig += RECT(32, 246 + i * 64, 194, 50, NAV, f'{GR}88', 12, 2) + T(129, 271 + i * 64, t, TX, 17)
# carta
for i, h in enumerate([40, 70, 55, 100]):
    fig += BAR(300 + i * 38, 210, 26, h, AM)
fig += PATH('M300 180 L338 150 L376 162 L430 98', PK, 4) + ARROW((420, 106), (442, 88), PK, 4, 10)
for i, t in enumerate(['Saham', 'Amanah saham', 'Hartanah']):
    fig += RECT(274, 246 + i * 64, 194, 50, NAV, f'{AM}88', 12, 2) + T(371, 271 + i * 64, t, TX, 17)
add('3.1', 'DEFINISI', 'Simpanan dan pelaburan',
    DEF(f'{B("Simpanan", GR)} ialah wang lebihan yang disimpan di institusi kewangan untuk kegunaan masa hadapan. '
        f'{B("Pelaburan", AM)} ialah penggunaan wang untuk membeli aset dengan harapan mendapat pulangan.', col)
    + BUL([f'Simpanan: <b>selamat</b> dan mudah dikeluarkan, pulangan (faedah) kecil.',
           f'Pelaburan: <b>berisiko</b> (nilai boleh naik atau turun), tetapi potensi pulangan lebih tinggi.'], col)
    + NOTE('Simpanan untuk keperluan jangka pendek dan kecemasan; pelaburan untuk menambah kekayaan jangka panjang.'),
    svg(fig, 'Jenis simpanan: akaun simpanan, simpanan tetap, akaun semasa. Jenis pelaburan: saham, amanah saham, hartanah'))

# 3.1-2 Risiko, pulangan, kecairan
JENIS = [  # nama, risiko(0-2), pulangan(0-2), kecairan
    ('Akaun simpanan', 0.15, 0.2, 'Tinggi', GR),
    ('Simpanan tetap', 0.45, 0.65, 'Sederhana', AM),
    ('Amanah saham', 1.05, 1.1, 'Sederhana', AM),
    ('Saham', 1.8, 1.8, 'Sederhana', AM),
    ('Hartanah', 1.25, 1.6, 'Rendah', RD),
]
LV = ['Rendah', 'Sederhana', 'Tinggi']
fig = AXES(70, 390, 470, 40, '', 'Potensi pulangan ↑') + T(270, 410, 'Risiko: rendah → tinggi', MU, 16)
X = lambda v: 80 + v / 2 * 370; Y = lambda v: 380 - v / 2 * 320
for nm, rk, pl, kc, cl in JENIS:
    fig += DOT((X(rk), Y(pl)), cl, 11)
anch = {'Akaun simpanan': (16, -22, 'start'), 'Simpanan tetap': (16, -20, 'start'), 'Amanah saham': (16, 22, 'start'),
        'Saham': (0, -26, 'middle'), 'Hartanah': (-16, 0, 'end')}
for nm, rk, pl, kc, cl in JENIS:
    dx, dy, a = anch[nm]; fig += T(X(rk) + dx, Y(pl) + dy, nm, TX, 17, a)
fig += RECT(70, 428, 400, 34, SURF, BD, 10, 1.5) + T(84, 445, 'Kecairan:', MU, 15, 'start', halo=False)
for x, (t, cl) in zip((176, 262, 376), [('tinggi', GR), ('sederhana', AM), ('rendah', RD)]):
    fig += DOT((x, 445), cl, 7) + T(x + 12, 445, t, cl, 15, 'start', halo=False)
add('3.1', 'KONSEP', 'Risiko, pulangan dan kecairan',
    BUL([f'{B("Risiko", RD)}: kemungkinan kehilangan wang.',
         f'{B("Pulangan", GR)}: keuntungan yang diperoleh.',
         f'{B("Kecairan", TR)}: kemudahan aset ditukar kepada tunai tanpa hilang nilai.'], col)
    + TABLE(['Jenis', 'Risiko', 'Pulangan', 'Kecairan'],
            [[nm, LV[min(2, int(rk / 0.67))], LV[min(2, int(pl / 0.67))], kc] for nm, rk, pl, kc, cl in JENIS], col, fs=17)
    + NOTE('Biasanya, <b>pulangan tinggi</b> datang bersama <b>risiko tinggi</b>.'),
    svg(fig, 'Graf risiko melawan potensi pulangan bagi lima jenis simpanan dan pelaburan'))
assert [LV[min(2, int(rk / 0.67))] for _, rk, _, _, _ in JENIS] == ['Rendah', 'Rendah', 'Sederhana', 'Tinggi', 'Sederhana']
assert [LV[min(2, int(pl / 0.67))] for _, _, pl, _, _ in JENIS] == ['Rendah', 'Rendah', 'Sederhana', 'Tinggi', 'Tinggi']

# 3.1-3 Faedah mudah
Pp, rr, tt = 5000, F(4, 100), 3
Ii = Pp * rr * tt; assert Ii == 600 and Pp + Ii == 5600
fig = AXES(70, 400, 470, 40, '', 'Nilai (RM)') + T(470, 424, 'tahun', MU, 15, 'end')
for k in range(4):
    x = 100 + k * 92; base = 400; hp = 170
    fig += BAR(x, base, 60, hp, TR, '30')
    for j in range(k):
        fig += RECT(x, base - hp - (j + 1) * 40, 60, 40, f'{GR}55', GR, 4, 2) + T(x + 30, base - hp - j * 40 - 20, '+200', GR, 14, halo=False)
    fig += T(x + 30, base - hp - k * 40 - 18, num(Pp + 200 * k), TX, 17)
    fig += T(x + 30, base + 18, str(k), MU, 16)
fig += T(130, 318, 'P', TR, 18) + T(130, 342, '5 000', TR, 15)
fig += T(290, 452, 'Faedah RM200 sama setiap tahun (tidak ikut skala)', GR, 15)
add('3.1', 'RUMUS', 'Faedah mudah',
    DEF(f'Faedah mudah, {I("I")} = {I("Prt")}<br><span style="font-size: 0.85em">{I("P")} = prinsipal, {I("r")} = kadar faedah setahun, {I("t")} = tempoh (tahun)</span>', col)
    + P('Puan Aina menyimpan RM5 000 dalam akaun simpanan tetap dengan kadar faedah mudah 4% setahun selama 3 tahun. Hitung faedah dan nilai matang.', True)
    + STEPS([f'{I("I")} = 5 000 × {FR(4, 100)} × 3 = {rm(Ii)}',
             f'Nilai matang = {I("P")} + {I("I")} = 5 000 + 600 = {rm(Pp + Ii)}'], col)
    + ANS(f'Faedah = {rm(Ii)}, nilai matang = {rm(Pp + Ii)}')
    + NOTE(f'Tempoh dalam bulan? Tukar kepada tahun: 6 bulan = {FR(6, 12)} tahun.'),
    svg(fig, 'Carta bar nilai simpanan RM5 000 bertambah RM200 setiap tahun selama 3 tahun'))

# 3.1-4 Faedah kompaun
Pc, rc, nc, tc = 10000, D('0.06'), 4, 2
MVc = r2(D(Pc) * (1 + rc / nc) ** (nc * tc)); assert MVc == D('11264.93'), MVc
MVs = Pc + Pc * F(6, 100) * tc; assert MVs == 11200
fig = AXES(80, 400, 470, 40, 't (tahun)', 'MV (RM)')
gx = lambda t: 80 + t * 36; gy = lambda v: 400 - (v - 8000) * 0.032
for v in (10000, 14000, 18000):
    fig += LINE((80, gy(v)), (460, gy(v)), GRID, 1.5) + T(72, gy(v), grp(str(v)), MU2, 14, 'end', weight=600)
for t in (2, 4, 6, 8, 10): fig += T(gx(t), 420, str(t), MU2, 14, weight=600)
ptsC = ' '.join(f'{r1(gx(t / 4))},{r1(gy(float(Pc * (1.015) ** t)))}' for t in range(0, 41))
fig += LINE((gx(0), gy(Pc)), (gx(10), gy(Pc * 1.6)), TR, 4.5)
fig += f'<polyline points="{ptsC}" fill="none" stroke="{GR}" stroke-width="5" stroke-linejoin="round"/>'
v10 = float(r2(Pc * D('1.015') ** 40)); assert abs(v10 - 18140.18) < 0.01
fig += DOT((gx(10), gy(v10)), GR) + DOT((gx(10), gy(16000)), TR)
fig += T(gx(10) - 8, gy(v10) - 20, 'kompaun', GR, 17, 'end') + T(gx(10) - 8, gy(16000) + 24, 'mudah', TR, 17, 'end')
fig += DOT((gx(2), gy(float(MVc))), AM) + T(gx(2) + 12, gy(float(MVc)) - 22, rm(MVc, 2), AM, 16, 'start')
add('3.1', 'RUMUS', 'Faedah kompaun',
    DEF(f'Nilai matang, {I("MV")} = {I("P")}(1 + {FR(I("r"), I("n"))}){SUP(I("nt"))}<br><span style="font-size: 0.85em">{I("n")} = bilangan kali faedah dikompaun dalam setahun</span>', col)
    + TABLE(['Dikompaun setiap', 'tahun', '6 bulan', 'suku tahun', 'bulan'], [[I('n'), '1', '2', '4', '12']], col, fs=18)
    + P('RM10 000 pada 6% setahun dikompaun setiap suku tahun selama 2 tahun:', True)
    + STEPS([f'{I("MV")} = 10 000(1 + {FR("0.06", 4)}){SUP("4 × 2")} = 10 000(1.015){SUP(8)} = {rm(MVc, 2)}'], col)
    + ANS(f'{I("MV")} = {rm(MVc, 2)} (faedah mudah: {rm(MVs)})'),
    svg(fig, 'Graf nilai matang faedah mudah (garis lurus) dan faedah kompaun (lengkung) bagi RM10 000 pada 6% setahun'))

# 3.1-5 Pulangan pelaburan
un, beli, jual, div = 2000, D('1.50'), D('1.80'), D('0.09')
modal = un * beli; dv = un * div; um = un * (jual - beli); tot = dv + um
roi = tot / modal * 100
assert modal == 3000 and dv == 180 and um == 600 and tot == 780 and roi == 26
sc = 0.08; X0, W0, BASE = 70, 130, 345
fig = LINE((40, BASE), (460, BASE), MU, 2.5)
fig += BAR(X0, BASE, W0, 3000 * sc, TR, '30') + T(X0 + W0 / 2, BASE - 3000 * sc / 2, 'Modal', TR, 18) + T(X0 + W0 / 2, BASE - 3000 * sc / 2 + 24, '3 000', TR, 17)
y1 = BASE - 3000 * sc; y2 = y1 - 600 * sc; y3 = y2 - 180 * sc
fig += RECT(X0, y2, W0, 600 * sc, f'{GR}55', GR, 4, 2.5) + RECT(X0, y3, W0, 180 * sc, f'{AM}66', AM, 4, 2.5)
fig += LINE((X0 + W0 + 6, (y1 + y2) / 2), (230, 92), GR, 2) + T(236, 92, '+ untung modal RM600', GR, 17, 'start')
fig += LINE((X0 + W0 + 6, (y2 + y3) / 2), (230, 52), AM, 2) + T(236, 52, '+ dividen RM180', AM, 17, 'start')
fig += T(236, 170, 'Selepas setahun:', MU3, 16, 'start', halo=False) + T(236, 196, '3 000 + 780 = 3 780', TX, 17, 'start')
fig += RECT(30, 368, 440, 90, SURF, GR, 16, 2.5)
fig += T(250, 396, 'Jumlah pulangan = 180 + 600 = 780', TX, 18) + T(250, 430, 'ROI = 780 ÷ 3 000 × 100% = 26%', GR, 19)
add('3.1', 'RUMUS', 'Pulangan pelaburan',
    DEF(f'Pulangan pelaburan (ROI) = {FR("jumlah pulangan", "modal pelaburan awal")} × 100%', col)
    + P('En. Ravi membeli 2 000 unit saham pada RM1.50 seunit, menerima dividen 9 sen seunit, lalu menjual semuanya pada RM1.80 seunit.', True)
    + STEPS([f'Modal = 2 000 × 1.50 = {rm(modal)}',
             f'Dividen = 2 000 × 0.09 = {rm(dv)}; untung modal = 2 000 × 0.30 = {rm(um)}',
             f'ROI = {FR("180 + 600", "3 000")} × 100% = {num(roi)}%'], col),
    svg(fig, 'Carta bar: modal RM3 000 bertambah keuntungan modal RM600 dan dividen RM180'))

# 3.1-6 Purata kos seunit
AMT = 300; HARGA = [D('1.00'), D('0.75'), D('0.60')]
UNIT = [D(AMT) / h for h in HARGA]; assert UNIT == [300, 400, 500]
pk_ = D(AMT * 3) / sum(UNIT); assert pk_ == D('0.75')
ph = r2(sum(HARGA) / 3); assert ph == D('0.78') and ph > pk_
BULAN = ['Jan', 'Feb', 'Mac']
fig = AXES(70, 390, 470, 40, '', 'Unit')
for i, (b, h, u) in enumerate(zip(BULAN, HARGA, UNIT)):
    x = 110 + i * 120; hh = float(u) * 0.5
    fig += BAR(x, 390, 80, hh, PU, '40') + T(x + 40, 390 - hh - 18, f'{int(u)} unit', PU, 17)
    fig += T(x + 40, 412, b, MU, 16) + T(x + 40, 436, rm(h, 2), AM, 16)
fig += T(66, 436, 'Harga:', AM, 15, 'end')
fig += T(280, 66, 'Harga turun → lebih banyak unit', MU3, 17, halo=False)
add('3.1', 'CONTOH BERLANGKAH', 'Purata kos seunit',
    DEF(f'<b>Purata kos seringgit</b>: melabur jumlah wang yang <b>sama</b> secara berkala.<br>Purata kos seunit = {FR("jumlah wang dilaburkan", "jumlah unit dibeli")}', col)
    + TABLE(['Bulan', 'Pelaburan', 'Harga seunit', 'Unit'],
            [[b, rm(AMT), rm(h, 2), str(int(u))] for b, h, u in zip(BULAN, HARGA, UNIT)], col, fs=17)
    + STEPS([f'Purata kos seunit = {FR("900", "1 200")} = {rm(pk_, 2)}, lebih rendah daripada purata harga ≈ {rm(ph, 2)} (kelebihan strategi ini)'], col),
    svg(fig, 'Carta bar unit dibeli setiap bulan: 300, 400 dan 500 unit apabila harga turun'))

# 3.1-7 Kesilapan biasa & ringkasan
fig = ''
CASES = [(52, 'r = 4', 'r = 0.04', 'peratus → perpuluhan'),
         (160, 't = 6', 't = 6/12', '6 bulan → tahun'),
         (268, 'suku tahun: n = 3', 'n = 4', '4 suku setahun'),
         (376, 'faedah = MV', 'faedah = MV − P', 'tolak prinsipal')]
for y, bad, good, why in CASES:
    fig += RECT(16, y - 40, 468, 92, SURF, BD, 16, 2)
    fig += CROSS(44, y - 14) + T(66, y - 14, bad, RD, 19, 'start')
    fig += TICK(44, y + 20) + T(66, y + 20, good, GR, 19, 'start')
    fig += T(470, y + 3, why, MU, 15, 'end', halo=False)
add('3.1', 'RINGKASAN', 'Ringkasan & kesilapan biasa',
    TABLE(['Perkara', 'Rumus'],
          [['Faedah mudah', f'{I("I")} = {I("Prt")}, {I("MV")} = {I("P")} + {I("I")}'],
           ['Faedah kompaun', f'{I("MV")} = {I("P")}(1 + {FR(I("r"), I("n"))}){SUP(I("nt"))}'],
           ['Pulangan pelaburan', f'{FR("jumlah pulangan", "modal awal")} × 100%'],
           ['Purata kos seunit', FR('jumlah pelaburan', 'jumlah unit')]], col, rv=True, fs=18)
    + BUL(['Tukar kadar peratus kepada perpuluhan dan tempoh kepada <b>tahun</b>.',
           f'Tentukan {I("n")} mengikut kekerapan pengkompaunan.'], col),
    svg(fig, 'Contoh kesilapan biasa dan pembetulannya dalam pengiraan faedah'))

# ===================== 3.2 KREDIT & HUTANG =====================
col = SUB['3.2'][1]

# 3.2-1 Definisi
fig = RECT(20, 60, 180, 150, SURF, TR, 18, 3) + RECT(300, 60, 180, 150, SURF, PA, 18, 3)
fig += PATH('M60 120 L110 92 L160 120 Z', TR, 4) + RECT(68, 120, 84, 52, f'{TR}26', TR, 4, 3)
for xx in (82, 104, 126): fig += LINE((xx + 4, 128), (xx + 4, 164), TR, 4)
fig += T(110, 192, 'Bank', TR, 19)
fig += f'<circle cx="390" cy="108" r="20" fill="{PA}33" stroke="{PA}" stroke-width="4"/>' + PATH('M354 176 Q390 126 426 176', PA, 4)
fig += T(390, 194, 'Pengguna', PA, 19)
fig += ARROW((208, 104), (292, 104), GR, 5, 14) + T(250, 80, 'kredit', GR, 18)
fig += ARROW((292, 172), (208, 172), RD, 5, 14) + T(250, 196, 'hutang', RD, 18)
fig += RECT(20, 250, 460, 200, SURF, BD, 18, 2) + T(250, 280, 'Contoh kredit', MU3, 18, halo=False)
for i, (t, cl) in enumerate([('Kad kredit', PA), ('Pinjaman peribadi', TR), ('Pinjaman kereta', AM), ('Pinjaman perumahan', GR)]):
    x0 = 40 + (i % 2) * 220; y0 = 304 + (i // 2) * 70
    fig += RECT(x0, y0, 200, 54, NAV, cl, 12, 2) + T(x0 + 100, y0 + 27, t, cl, 17)
add('3.2', 'DEFINISI', 'Kredit dan hutang',
    DEF(f'{B("Kredit", GR)} ialah kemudahan untuk mendapatkan barang, perkhidmatan atau wang <b>sekarang</b> dan membayarnya <b>kemudian</b>. '
        f'{B("Hutang", RD)} ialah jumlah wang yang wajib dibayar balik kepada pemberi kredit, biasanya bersama faedah.', col)
    + BUL(['Berbelanja mengikut kemampuan; buat bajet sebelum berhutang.',
           'Bayar ansuran dan bil <b>tepat pada masanya</b>.',
           'Elakkan berhutang untuk barang kehendak yang tidak perlu.'], col)
    + NOTE('Rekod pembayaran yang baik memudahkan anda mendapat pinjaman pada masa hadapan.', 'Bijak:'),
    svg(fig, 'Bank memberi kredit kepada pengguna; pengguna membayar balik hutang. Contoh kredit: kad kredit dan pinjaman'))

# 3.2-2 Kad kredit
fig = (f'<rect x="70" y="30" width="360" height="220" rx="22" fill="{PA}2e" stroke="{PA}" stroke-width="4"/>'
       + RECT(100, 90, 58, 44, f'{AM}55', AM, 8, 2.5)
       + LINE((115, 90), (115, 134), AM, 2) + LINE((143, 90), (143, 134), AM, 2) + LINE((100, 112), (158, 112), AM, 2)
       + T(100, 178, '1234  5678  9012  3456', TX, 22, 'start')
       + T(100, 220, 'TAMAT 12/29', MU3, 15, 'start', halo=False, fx=False)
       + f'<circle cx="370" cy="214" r="20" fill="{RD}88"/><circle cx="392" cy="214" r="20" fill="{AM}88"/>')
for i, (t, ok) in enumerate([('Bayar penuh: tiada faedah', True), ('Mata ganjaran', True), ('Caj kewangan tinggi', False), ('Mudah boros', False)]):
    x0 = 20 + (i % 2) * 236; y0 = 280 + (i // 2) * 88
    fig += RECT(x0, y0, 224, 72, SURF, GR if ok else RD, 14, 2) + (TICK(x0 + 26, y0 + 36) if ok else CROSS(x0 + 26, y0 + 36))
    fig += T(x0 + 48, y0 + 36, t, GR if ok else RD, 15, 'start')
add('3.2', 'KONSEP', 'Kad kredit',
    P('Kad kredit membolehkan pengguna membeli dahulu dan membayar kemudian, sehingga <b>had kredit</b> yang ditetapkan oleh bank.', True)
    + TABLE(['Kelebihan', 'Kekurangan'],
            [['Tidak perlu membawa tunai', 'Caj kewangan tinggi jika tidak bayar penuh'],
             ['Tiada faedah jika bayar penuh sebelum tarikh akhir', 'Caj lewat bayaran jika lewat'],
             ['Mata ganjaran, kegunaan kecemasan', 'Mudah berbelanja melebihi kemampuan']], col, fs=17)
    + NOTE('Bayar <b>baki penuh</b> setiap bulan sebelum tarikh akhir bayaran, dan jangan guna sehingga had kredit.', 'Bijak:'),
    svg(fig, 'Kad kredit dengan kelebihan dan kekurangannya'))

# 3.2-3 Bayaran minimum & caj kewangan
bk = D(2400)
bmin = max(bk * D('0.05'), D(50)); assert bmin == 120
sisa = bk - bmin; ck = r2(sisa * D('0.18') / 12); assert sisa == 2280 and ck == D('34.20')
fig = RECT(40, 20, 420, 250, SURF, BD, 18, 2) + T(250, 52, 'PENYATA KAD KREDIT', MU3, 18, halo=False) + LINE((60, 72), (440, 72), BD, 2)
for i, (k, v, cl) in enumerate([('Baki tertunggak', rm(bk, 2), TX), ('Bayaran minimum', rm(bmin, 2), PA), ('Tarikh akhir bayaran', '25 Mac', MU3), ('Kadar caj kewangan', '18% setahun', RD)]):
    fig += T(64, 102 + i * 44, k, MU, 17, 'start', halo=False) + T(436, 102 + i * 44, v, cl, 18, 'end')
# bar
fig += RECT(40, 300, 420, 50, f'{PA}22', PA, 10, 2)
w1 = 420 * float(bmin / bk)
fig += RECT(40, 300, w1, 50, f'{GR}88', GR, 10, 2) + T(40 + w1 + 8, 325, 'baki belum dibayar RM2 280', PA, 16, 'start')
fig += T(40, 376, '↑ bayar minimum RM120', GR, 16, 'start')
fig += RECT(40, 400, 420, 56, SURF, RD, 14, 2) + T(250, 428, f'Caj kewangan ≈ {rm(ck, 2)} sebulan', RD, 19)
add('3.2', 'RUMUS', 'Bayaran minimum dan caj kewangan',
    DEF(f'{B("Bayaran minimum", PA)} = 5% baki tertunggak <b>atau</b> RM50 (yang lebih tinggi).<br>'
        f'{B("Caj kewangan", RD)} dikenakan ke atas baki yang <b>tidak dibayar</b>.', col)
    + P('Baki Cik Mei RM2 400. Dia hanya membuat bayaran minimum. Caj kewangan 18% setahun.', True)
    + STEPS([f'Minimum = 5% × 2 400 = RM120 (&gt; RM50) → {rm(bmin)}',
             f'Baki belum dibayar = 2 400 − 120 = {rm(sisa)}',
             f'Caj kewangan = 2 280 × {FR("18%", 12)} = {rm(ck, 2)} sebulan'], col),
    svg(fig, 'Penyata kad kredit dengan baki tertunggak RM2 400 dan bayaran minimum RM120'))

# 3.2-4 Kesan bayaran: penuh, minimum, lewat
lw = min(max(bk * D('0.01'), D(10)), D(100)); assert lw == 24
ckL = r2(bk * D('0.015')); assert ckL == 36
nxt = [D(0), sisa + ck, bk + lw + ckL]; assert nxt == [0, D('2314.20'), D('2460')]
fig = AXES(60, 400, 470, 40, '', 'Baki bulan depan')
for i, (nm, v, cl) in enumerate(zip(['Bayar penuh', 'Bayar minimum', 'Tidak bayar'], nxt, [GR, AM, RD])):
    x = 100 + i * 125; hh = max(6, float(v) * 0.11)
    fig += BAR(x, 400, 90, hh, cl, '40') + T(x + 45, 400 - hh - 20, rm(v, 2) if v else 'RM0', cl, 17)
    fig += T(x + 45, 422, nm, MU, 15)
fig += T(270, 64, 'Baki asal RM2 400', MU3, 18, halo=False)
add('3.2', 'CONTOH BERLANGKAH', 'Kesan bayaran minimum dan lewat',
    DEF(f'{B("Caj lewat bayaran", RD)} = 1% baki tertunggak (RM10 hingga RM100) jika bayaran minimum lewat.', col)
    + TABLE(['Pilihan (baki RM2 400)', 'Caj', 'Baki bulan depan'],
            [['Bayar penuh', 'tiada', 'RM0'],
             ['Bayar minimum RM120', f'kewangan {rm(ck, 2)}', rm(nxt[1], 2)],
             ['Tidak bayar', f'lewat {rm(lw)} + kewangan {rm(ckL)}', rm(nxt[2], 2)]], col, rv=True, fs=17)
    + STEPS([f'Tidak bayar: caj lewat = 1% × 2 400 = {rm(lw)}; caj kewangan = 2 400 × 1.5% = {rm(ckL)}'], col)
    + NOTE('Bayar minimum mengelakkan caj lewat, tetapi baki masih dikenakan caj kewangan.'),
    svg(fig, 'Carta bar baki bulan depan: bayar penuh RM0, bayar minimum RM2 314.20, tidak bayar RM2 460'))

# 3.2-5 Pinjaman: jumlah bayaran balik & ansuran
Pl, rl, tl = 20000, F(5, 100), 4
Il = Pl * rl * tl; Al = Pl + Il; ans_ = F(Al, 12 * tl)
assert Il == 4000 and Al == 24000 and ans_ == 500
fig = RECT(30, 30, 440, 70, f'{TR}30', TR, 12, 2.5) + T(30 + 440 * 20 / 24 / 2, 65, 'Prinsipal RM20 000', TR, 18)
fig += RECT(30 + 440 * 20 / 24, 30, 440 * 4 / 24, 70, f'{PA}55', PA, 12, 2.5) + T(30 + 440 * 22 / 24, 65, '+4 000', PA, 16)
fig += T(250, 126, 'A = 24 000 ÷ 48 bulan', MU3, 19, halo=False)
for k in range(48):
    cx, cy = 30 + (k % 12) * 37, 150 + (k // 12) * 66
    fig += RECT(cx, cy, 32, 54, f'{GR}26', GR, 8, 2)
fig += T(250, 434, 'setiap kotak = RM500 sebulan', GR, 18)
add('3.2', 'RUMUS', 'Jumlah bayaran balik dan ansuran',
    DEF(f'Jumlah bayaran balik, {I("A")} = {I("P")} + {I("Prt")}<br>Ansuran bulanan = {FR(I("A"), "bilangan bulan")}', col)
    + P('Encik Daniel meminjam RM20 000 pada kadar 5% setahun selama 4 tahun. Hitung ansuran bulanannya.', True)
    + STEPS([f'Faedah = 20 000 × {FR(5, 100)} × 4 = {rm(Il)}',
             f'{I("A")} = 20 000 + 4 000 = {rm(Al)}',
             f'Ansuran = {FR("24 000", "4 × 12")} = {FR("24 000", 48)} = {rm(ans_)}'], col)
    + NOTE(f'<b>Kadar rata</b>: faedah dikira atas prinsipal asal sepanjang tempoh.'),
    svg(fig, 'Prinsipal RM20 000 ditambah faedah RM4 000 dibahagi kepada 48 ansuran RM500'))

# 3.2-6 Pinjaman kereta: tempoh berbeza
harga = 60000; pend = harga * F(10, 100); Pk = harga - pend; assert Pk == 54000
TEM = []
for th in (5, 9):
    fa = Pk * F(3, 100) * th; Ak = Pk + fa; an = Ak / (12 * th)
    TEM.append((th, fa, Ak, an))
assert TEM == [(5, 8100, 62100, 1035), (9, 14580, 68580, 635)]
fig = AXES(60, 400, 470, 40, '', 'RM')
for i, (th, fa, Ak, an) in enumerate(TEM):
    x = 110 + i * 190
    h1 = float(an) * 0.2; h2 = float(fa) * 0.02
    fig += BAR(x, 400, 60, h1, TR, '40') + T(x + 30, 400 - h1 - 18, rm(an), TR, 16)
    fig += BAR(x + 70, 400, 60, h2, PA, '40') + T(x + 100, 400 - h2 - 18, rm(fa), PA, 16)
    fig += T(x + 65, 424, f'{th} tahun', MU, 17)
fig += DOT((120, 56), TR, 8) + T(134, 56, 'ansuran bulanan', TR, 16, 'start') + DOT((300, 56), PA, 8) + T(314, 56, 'jumlah faedah', PA, 16, 'start')
add('3.2', 'CONTOH BERLANGKAH', 'Pinjaman kereta',
    P('Harga sebuah kereta RM60 000. Puan Siti membayar wang pendahuluan 10% dan meminjam bakinya pada kadar 3% setahun.', True)
    + STEPS([f'Pinjaman = 60 000 − 10% × 60 000 = {rm(Pk)}'], col)
    + TABLE(['Tempoh', 'Faedah', f'{I("A")}', 'Ansuran'],
            [[f'{th} tahun', rm(fa), rm(Ak), rm(an)] for th, fa, Ak, an in TEM], col, rv=True, fs=18)
    + NOTE('Tempoh lebih panjang → ansuran bulanan <b>lebih rendah</b>, tetapi jumlah faedah <b>lebih tinggi</b>. Kadar faedah lebih tinggi → ansuran dan faedah lebih tinggi.'),
    svg(fig, 'Perbandingan ansuran dan jumlah faedah bagi pinjaman 5 tahun dan 9 tahun'))

# 3.2-7 Ringkasan & kesilapan biasa
fig = ''
CASES = [(52, 'min = 5% × 800 = RM40', 'min = RM50', '5% atau RM50, ambil lebih tinggi'),
         (160, 'ansuran = A ÷ 4', 'ansuran = A ÷ 48', '4 tahun = 48 bulan'),
         (268, 'pinjaman = harga kereta', 'pinjaman = harga − pendahuluan', 'tolak pendahuluan'),
         (376, 'caj lewat = 1% × 20 000 = 200', 'caj lewat = RM100', 'had maksimum RM100')]
for y, bad, good, why in CASES:
    fig += RECT(16, y - 44, 468, 100, SURF, BD, 16, 2)
    fig += CROSS(42, y - 18) + T(62, y - 18, bad, RD, 17, 'start')
    fig += TICK(42, y + 14) + T(62, y + 14, good, GR, 17, 'start')
    fig += T(470, y + 40, why, MU, 14, 'end', halo=False)
add('3.2', 'RINGKASAN', 'Ringkasan & kesilapan biasa',
    TABLE(['Perkara', 'Rumus'],
          [['Bayaran minimum', '5% × baki atau RM50 (lebih tinggi)'],
           ['Caj kewangan sebulan', f'baki belum dibayar × {FR("kadar setahun", 12)}'],
           ['Caj lewat bayaran', '1% × baki (RM10 hingga RM100)'],
           ['Pinjaman', f'{I("A")} = {I("P")} + {I("Prt")}, ansuran = {FR(I("A"), "bulan")}']], col, rv=True, fs=17)
    + BUL(['Bayar baki penuh setiap bulan untuk mengelakkan caj kewangan.'], col),
    svg(fig, 'Contoh kesilapan biasa dan pembetulannya dalam pengiraan kad kredit dan pinjaman'))

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
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body
assert counts == {'3.1': 7, '3.2': 7}, counts

js = ('/* Dijana oleh tools/pengguna/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
