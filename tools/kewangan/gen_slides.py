# Penjana slaid NOTA KEWANGAN (Tingkatan 4 Bab 10 Matematik Pengguna: Pengurusan Kewangan)
#   -> kewangan/slides.js
# Jalankan:  python3 tools/kewangan/gen_slides.py
# Gunakan HANYA warna palet gelap di bawah supaya mod cerah ditukar automatik oleh themed().
#
# KSSM (DSKP T4): SK 10.1 Perancangan dan Pengurusan Kewangan, dua SP:
#   10.1.1 Menghuraikan proses pengurusan kewangan yang berkesan.
#   10.1.2 Membina dan membentangkan pelan kewangan peribadi untuk mencapai matlamat kewangan
#          jangka pendek dan jangka panjang, dan seterusnya menilai kebolehlaksanaan pelan tersebut.
# Subtopik app: 10.1.1 = SP 10.1.1; 10.1.2 = SP 10.1.2 (bina pelan); 10.1.3 = SP 10.1.2 (menilai kebolehlaksanaan).
import json, os, html, math, re

HERE = os.path.dirname(os.path.abspath(__file__))
OUTFILE = os.path.normpath(os.path.join(HERE, '..', '..', 'kewangan', 'slides.js'))

BG = '#0B1220'; SURF = '#131C2E'; NAV = '#0E1626'; BD = '#22304A'; TX = '#E6EDF7'; MU = '#94A3B8'
GRID = '#1E2A40'; DIM = '#334155'; MU2 = '#64748B'; MU3 = '#B6C2D3'
C = {'tr': '#38BDF8', 'pa': '#FB923C', 'pu': '#A78BFA', 'am': '#FBBF24', 'gr': '#34D399', 'pk': '#F472B6', 'rd': '#F87171'}
SUB = {
    '10.1.1': ('Proses Kewangan', C['tr']),
    '10.1.2': ('Pelan & Aliran Tunai', C['gr']),
    '10.1.3': ('Menilai Pelan', C['am']),
}
PA, TR, GR, PU, AM, PK, RD = C['pa'], C['tr'], C['gr'], C['pu'], C['am'], C['pk'], C['rd']
INC, EXP = GR, PK          # warna tetap: pendapatan (hijau), perbelanjaan (merah jambu)

# ---------- nombor & wang ----------
def grp(n):
    """Pemisah ribuan = ruang (gaya buku teks KSSM)."""
    s = str(abs(int(n)))
    out = ''
    while len(s) > 3: out = ' ' + s[-3:] + out; s = s[:-3]
    return ('−' if n < 0 else '') + s + out
def rm(n):
    assert n == int(n), n
    return ('−' if n < 0 else '') + 'RM' + grp(abs(n))

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
def TABLE(head, rows, col, rv=False, fs=19):
    th = ''.join(f'<th style="padding: 9px 12px; text-align: left; font-size: 17px; color: {col}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb = ''.join(f'<tr{" class=\"rv\"" if rv else ""}>' + ''.join(f'<td style="padding: 8px 12px; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{c}</td>' for c in r) + '</tr>' for r in rows)
    return (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}">'
            f'<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>')

# ---------- pembantu rajah ----------
FONT = 'font-family="Inter, sans-serif"'
W, H = 500, 470

def svg(inner, label, h=H):
    return f'<svg class="sl-svg" viewBox="0 0 {W} {h}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def r1(v): return round(v, 1)
def T(x, y, t, col=TX, size=20, anchor='middle', weight=700, halo=True):
    ha = f' paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round"' if halo else ''
    return (f'<text x="{r1(x)}" y="{r1(y)}" fill="{col}" {FONT} font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}" dominant-baseline="middle"{ha}>{t}</text>')
def LINE(p, q, col=TX, sw=4, dash=None, cap='round'):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{r1(p[0])}" y1="{r1(p[1])}" x2="{r1(q[0])}" y2="{r1(q[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="{cap}"{d}/>'
def RECT(x, y, w, h, fill=SURF, stroke=BD, rx=18, sw=2):
    return f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def CIRC(x, y, r, fill, stroke, sw=3):
    return f'<circle cx="{r1(x)}" cy="{r1(y)}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
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
    return CIRC(x, y, r, f'{col}33', col, 3) + T(x, y + 1, 'RM', col, r * 0.72, weight=800, halo=False)
def JAR(x, y, w, h, frac, col=GR):
    """Balang simpanan: kotak (x, y) lebar w tinggi h, diisi frac (0..1)."""
    fh = h * max(0, min(1, frac))
    s = RECT(x + 6, y + h - fh, w - 12, fh, f'{col}55', 'none', 10, 0) if fh > 0 else ''
    s += PATH(f'M{x} {y} V{y + h - 14} Q{x} {y + h} {x + 14} {y + h} H{x + w - 14} Q{x + w} {y + h} {x + w} {y + h - 14} V{y}', col, 4)
    s += RECT(x - 6, y - 12, w + 12, 14, f'{col}44', col, 6, 3)
    return s
def CARD_ROWS(x, y, w, rows, title=None, tcol=TX, rh=34, fs=17):
    """Kad senarai: rows = [(label, nilai, warna)]; pulangkan (svg, y_bawah)."""
    h = (44 if title else 12) + rh * len(rows) + 6
    s = RECT(x, y, w, h, SURF, BD, 16, 2)
    yy = y + 12
    if title:
        s += T(x + 16, y + 24, title, tcol, 18, 'start'); yy = y + 44
    for lab, val, c in rows:
        s += T(x + 16, yy + rh / 2, lab, c or TX, fs, 'start', 600, False) + T(x + w - 16, yy + rh / 2, val, c or TX, fs, 'end', 800, False)
        yy += rh
    return s, y + h

# ---------- slaid ----------
S = []
def add(sub, kicker, title, body, fig=''):
    S.append({'sub': sub, 'kicker': kicker, 'title': title, 'body': body, 'fig': fig})

LANGKAH = [('Menetapkan matlamat kewangan', 'Matlamat'),
           ('Menilai status kewangan', 'Status'),
           ('Mewujudkan pelan kewangan', 'Pelan'),
           ('Melaksanakan pelan kewangan', 'Laksana'),
           ('Mengkaji semula dan menyemak kemajuan', 'Semak')]

# ===================== 10.1.1 PROSES PENGURUSAN KEWANGAN =====================
col = SUB['10.1.1'][1]

# 10.1.1-1 Definisi + kitaran
cx, cy, R = 250, 238, 158
fig = ''
angs = [-90 + 72 * i for i in range(5)]
pts = [(cx + R * math.cos(math.radians(a)), cy + R * math.sin(math.radians(a))) for a in angs]
cols5 = [TR, PU, GR, AM, PK]
for i in range(5):
    a0, a1 = math.radians(angs[i] + 17), math.radians(angs[i] + 72 - 17)
    p = (cx + R * math.cos(a0), cy + R * math.sin(a0)); q = (cx + R * math.cos(a1), cy + R * math.sin(a1))
    fig += ARROW(p, q, MU2, 3, 11)
for i, (x, y) in enumerate(pts):
    fig += CIRC(x, y, 33, f'{cols5[i]}30', cols5[i], 4) + T(x, y + 1, str(i + 1), cols5[i], 28, weight=800, halo=False)
    a = math.radians(angs[i]); lx, ly = x + 58 * math.cos(a), y + 54 * math.sin(a)
    if abs(math.cos(a)) >= 0.5: lx, ly = x, y + 52
    fig += T(lx, ly, LANGKAH[i][1], cols5[i], 19)
fig += T(cx, cy - 14, 'Pengurusan', TX, 22) + T(cx, cy + 14, 'kewangan', TX, 22) + T(cx, cy + 44, 'kitaran berterusan', MU, 15, halo=False)
add('10.1.1', 'DEFINISI', 'Apa itu pengurusan kewangan?',
    DEF('<b>Pengurusan kewangan</b> ialah proses merancang, mengurus dan mengawal pendapatan, perbelanjaan dan simpanan supaya <b>matlamat kewangan</b> tercapai.', col)
    + BUL(['Membantu kita hidup mengikut kemampuan dan mengelakkan hutang berlebihan.',
           'Pengurusan kewangan yang berkesan melalui <b>lima langkah</b> yang berulang (kitaran).',
           'Ia bermula dengan <b>matlamat</b> yang jelas.'], col)
    + NOTE('Wang yang sedikit pun perlu diurus. Tabiat baik bermula sejak di bangku sekolah.'),
    svg(fig, 'Kitaran lima langkah proses pengurusan kewangan'))

# 10.1.1-2 Lima langkah
fig = ''
for i in range(5):
    x, hh = 30 + i * 88, (i + 1) * 66
    y = 440 - hh
    fig += RECT(x, y, 86, hh, f'{cols5[i]}26', cols5[i], 10, 3)
    fig += T(x + 43, y + 24, str(i + 1), cols5[i], 26, weight=800) + T(x + 43, y + 54, LANGKAH[i][1], TX, 15)
fig += LINE((446, 110), (446, 40), MU3, 4) + f'<polygon points="446,40 486,52 446,64" fill="{AM}" stroke="{AM}" stroke-width="2"/>'
fig += T(30, 60, 'Matlamat tercapai!', AM, 22, 'start')
add('10.1.1', 'LIMA LANGKAH', 'Proses pengurusan kewangan',
    STEPS([f'{B("Menetapkan matlamat", TR)}: tentukan apa yang hendak dicapai, utamakan keperluan.',
           f'{B("Menilai status kewangan", PU)}: kenal pasti pendapatan, perbelanjaan, aset dan liabiliti.',
           f'{B("Mewujudkan pelan kewangan", GR)}: rancang belanjawan, simpanan dan dana kecemasan.',
           f'{B("Melaksanakan pelan", AM)}: ikut pelan; bandingkan perbelanjaan sebenar dengan pelan.',
           f'{B("Mengkaji semula & menyemak kemajuan", PK)}: ubah suai pelan jika perlu.'], col),
    svg(fig, 'Tangga lima langkah menuju matlamat kewangan'))

# 10.1.1-3 Keperluan vs kehendak, jangka pendek vs panjang
fig = RECT(14, 14, 230, 222) + RECT(256, 14, 230, 222)
fig += T(129, 44, 'KEPERLUAN', GR, 21) + T(371, 44, 'KEHENDAK', PA, 21)
for i, t in enumerate(['Makanan asas', 'Tempat tinggal', 'Tambang ke sekolah', 'Bil air & elektrik']):
    fig += TICK(40, 82 + i * 40, GR, 7) + T(58, 82 + i * 40, t, TX, 16, 'start', 600, False)
for i, t in enumerate(['Telefon terbaharu', 'Kasut berjenama', 'Makan di restoran', 'Permainan video']):
    fig += T(282, 82 + i * 40, '★', PA, 16, halo=False) + T(298, 82 + i * 40, t, TX, 16, 'start', 600, False)
# garis masa
y0 = 330
fig += RECT(14, 250, 472, 206)
fig += ARROW((40, y0), (468, y0), MU, 3, 11)
for x, t in [(40, 'Sekarang'), (160, '1 tahun'), (330, '5 tahun')]:
    fig += LINE((x, y0 - 10), (x, y0 + 10), MU, 3) + T(x, y0 + 26, t, MU, 15, halo=False)
fig += RECT(40, 268, 120, 40, f'{TR}30', TR, 10, 2) + T(100, 288, 'Jangka pendek', TR, 15)
fig += RECT(330, 268, 140, 40, f'{PU}30', PU, 10, 2) + T(400, 288, 'Jangka panjang', PU, 15)
fig += T(100, 384, 'Telefon', TX, 15, halo=False) + T(100, 406, 'Basikal', TX, 15, halo=False)
fig += T(400, 384, 'Rumah', TX, 15, halo=False) + T(400, 406, 'Persaraan', TX, 15, halo=False) + T(400, 428, 'Pengajian', TX, 15, halo=False)
add('10.1.1', 'MATLAMAT KEWANGAN', 'Keperluan, kehendak dan tempoh',
    BUL([f'{B("Keperluan", GR)}: perkara yang mesti ada untuk hidup (makanan, tempat tinggal, pengangkutan).',
         f'{B("Kehendak", PA)}: perkara yang diingini tetapi boleh hidup tanpanya.',
         f'{B("Matlamat jangka pendek", TR)}: dicapai dalam tempoh <b>setahun atau kurang</b>, jumlah wang kecil.',
         f'{B("Matlamat jangka panjang", PU)}: memerlukan tempoh <b>lebih daripada 5 tahun</b>, jumlah wang besar.'], col)
    + NOTE('Utamakan <b>keperluan</b> sebelum kehendak semasa menetapkan matlamat kewangan.'),
    svg(fig, 'Contoh keperluan dan kehendak serta garis masa matlamat jangka pendek dan jangka panjang'))

# 10.1.1-4 SMART
SMART = [('S', 'Spesifik', 'matlamat yang jelas dan khusus', TR),
         ('M', 'Boleh diukur', 'jumlah wang yang tepat', GR),
         ('A', 'Boleh dicapai', 'mampu dengan pendapatan sendiri', AM),
         ('R', 'Realistik', 'simpanan bulanan munasabah', PA),
         ('T', 'Tempoh masa', 'ada tarikh akhir', PK)]
fig = ''
for i, (L, nm, d, c) in enumerate(SMART):
    y = 16 + i * 90
    fig += RECT(14, y, 472, 78, SURF, c, 16, 2)
    fig += RECT(26, y + 12, 54, 54, f'{c}33', c, 12, 3) + T(53, y + 40, L, c, 32, weight=800, halo=False)
    fig += T(98, y + 26, nm, c, 21, 'start') + T(98, y + 54, d, MU3, 16, 'start', 600, False)
add('10.1.1', 'MATLAMAT SMART', 'Matlamat kewangan SMART',
    DEF('Matlamat kewangan yang baik ialah matlamat <b>SMART</b>.', col)
    + TABLE(['', 'Maksud', 'Contoh'],
            [[B('S', TR), 'Spesifik', 'membeli komputer riba'],
             [B('M', GR), 'Boleh diukur', 'RM2 400'],
             [B('A', AM), 'Boleh dicapai', 'gaji bersih RM2 000 sebulan'],
             [B('R', PA), 'Realistik', 'simpan RM200 sebulan'],
             [B('T', PK), 'Tempoh masa', 'dalam 12 bulan']], col, rv=True, fs=18)
    + NOTE('Sebagai panduan, simpan sekurang-kurangnya <b>10%</b> daripada pendapatan setiap bulan.'),
    svg(fig, 'Lima ciri matlamat SMART'))
assert 2400 / 12 == 200 and 200 / 2000 == 0.10

# 10.1.1-5 Contoh langkah demi langkah
gaji, harga, bulan = 1500, 1800, 12
sim = harga // bulan
assert harga % bulan == 0 and sim == 150 and sim * 100 // gaji == 10
fig = ''
rows = [('S', 'Telefon pintar', TR), ('M', rm(harga), GR), ('T', f'{bulan} bulan', PK),
        ('A', f'Gaji bersih {rm(gaji)}', AM), ('R', f'{rm(sim)} = 10% gaji', PA)]
for i, (L, t, c) in enumerate(rows):
    y = 20 + i * 66
    fig += RECT(20, y, 460, 54, SURF, BD, 14, 2) + T(48, y + 27, L, c, 26, weight=800) + T(80, y + 27, t, TX, 19, 'start')
    fig += TICK(450, y + 27, GR)
fig += JAR(200, 372, 100, 76, 0.55, GR) + COIN(250, 352, 13) + T(320, 420, f'{rm(sim)} sebulan', GR, 19, 'start')
add('10.1.1', 'CONTOH', 'Adakah matlamat ini SMART?',
    P(f'Amir bekerja dengan gaji bersih <b>{rm(gaji)}</b> sebulan. Matlamatnya: <i>"Saya mahu membeli telefon pintar berharga {rm(harga)} dalam tempoh {bulan} bulan."</i>', True)
    + STEPS([f'Spesifik: telefon pintar ✓ &nbsp; Boleh diukur: {rm(harga)} ✓ &nbsp; Tempoh: {bulan} bulan ✓',
             f'Simpanan bulanan = {rm(harga)} ÷ {bulan} = <b>{rm(sim)}</b>',
             f'{rm(sim)} ÷ {rm(gaji)} × 100% = <b>10%</b> daripada gaji, maka realistik dan boleh dicapai ✓',
             f'Tempoh {bulan} bulan (setahun) → matlamat <b>jangka pendek</b>.'], col)
    + ANS('Ya, matlamat Amir ialah matlamat SMART.'),
    svg(fig, 'Semakan lima ciri SMART bagi matlamat Amir'))

# 10.1.1-6 Kesilapan biasa
CASES = [(46, '"Saya mahu kaya."', False), (122, 'Simpan RM50 000 untuk rumah dalam 15 tahun', True),
         (210, 'Beli kasut berjenama dahulu, makanan kemudian', False), (286, 'Utamakan keperluan, kemudian kehendak', True),
         (374, 'Simpan 90% gaji setiap bulan', False)]
fig = ''
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(46, y) if ok else CROSS(46, y)) + T(74, y, t, GR if ok else RD, 16.5, 'start')
fig += T(250, 446, '✓ Matlamat mesti SMART dan realistik', GR, 18, halo=False)
add('10.1.1', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Matlamat kabur", RD)} ✗ seperti "Saya mahu kaya" → tiada jumlah wang dan tiada tempoh.',
         f'{B("Kehendak didahulukan", RD)} ✗ → keperluan mesti diutamakan.',
         f'{B("Matlamat tidak realistik", RD)} ✗ → simpanan bulanan terlalu besar berbanding pendapatan.',
         f'{B("Langkah 5 dilupakan", RD)} ✗ → pelan perlu dikaji semula dan disemak kemajuannya.'], col),
    svg(fig, 'Contoh matlamat yang salah dan betul'))

# 10.1.1-7 Ringkasan
fig = ''
for i, (nm, s) in enumerate(LANGKAH):
    y = 16 + i * 64
    fig += RECT(14, y, 472, 54, SURF, cols5[i], 14, 2) + T(42, y + 27, str(i + 1), cols5[i], 24, weight=800) + T(70, y + 27, nm, TX, 17, 'start')
fig += RECT(14, 344, 472, 112, f'{TR}18', TR, 16, 2) + T(250, 376, 'S · M · A · R · T', TR, 30, weight=800)
fig += T(250, 418, 'Spesifik · Boleh diukur · Boleh dicapai', MU3, 16, halo=False) + T(250, 440, 'Realistik · Tempoh masa', MU3, 16, halo=False)
add('10.1.1', 'RINGKASAN', 'Ringkasan 10.1.1',
    TABLE(['Perkara', 'Isi penting'],
          [['Proses', '5 langkah berulang'],
           ['Matlamat', 'SMART; utamakan keperluan'],
           ['Jangka pendek', 'setahun atau kurang'],
           ['Jangka panjang', 'lebih daripada 5 tahun'],
           ['Simpanan bulanan', 'nilai matlamat ÷ bilangan bulan']], col, rv=True)
    + NOTE('Simpan sekurang-kurangnya 10% daripada pendapatan.'),
    svg(fig, 'Ringkasan lima langkah dan matlamat SMART'))

# ===================== 10.1.2 PELAN KEWANGAN & ALIRAN TUNAI =====================
col = SUB['10.1.2'][1]

# 10.1.2-1 Pendapatan aktif & pasif
fig = RECT(14, 14, 230, 300) + RECT(256, 14, 230, 300)
fig += T(129, 44, 'AKTIF', GR, 22) + T(129, 70, 'perlu bekerja', MU, 15, halo=False)
fig += T(371, 44, 'PASIF', TR, 22) + T(371, 70, 'tanpa bekerja aktif', MU, 15, halo=False)
for i, t in enumerate(['Gaji', 'Elaun', 'Komisen', 'Upah kerja sambilan']):
    fig += RECT(30, 92 + i * 52, 198, 40, NAV, f'{GR}88', 10, 2) + T(129, 112 + i * 52, t, TX, 16)
for i, t in enumerate(['Sewa rumah', 'Dividen', 'Faedah simpanan', 'Royalti']):
    fig += RECT(272, 92 + i * 52, 198, 40, NAV, f'{TR}88', 10, 2) + T(371, 112 + i * 52, t, TX, 16)
fig += ARROW((129, 318), (210, 372), GR, 4) + ARROW((371, 318), (290, 372), TR, 4)
fig += RECT(120, 380, 260, 70, f'{GR}22', GR, 16, 3) + T(250, 404, 'Jumlah pendapatan', GR, 19) + T(250, 430, '(aliran tunai masuk)', MU3, 15, halo=False)
add('10.1.2', 'PENDAPATAN', 'Pendapatan aktif dan pasif',
    DEF(f'{B("Pendapatan", GR)} ialah wang yang diterima, iaitu <b>aliran tunai masuk</b>.', col)
    + BUL([f'{B("Pendapatan aktif", GR)}: diperoleh dengan bekerja, contohnya gaji, elaun, komisen dan upah.',
           f'{B("Pendapatan pasif", TR)}: diperoleh tanpa bekerja secara aktif, contohnya sewa, dividen dan faedah simpanan.'], col)
    + NOTE('Dalam pelan kewangan, gunakan <b>gaji bersih</b> (selepas potongan seperti KWSP dan PERKESO).'),
    svg(fig, 'Contoh pendapatan aktif dan pasif'))

# 10.1.2-2 Perbelanjaan tetap & tidak tetap
fig = RECT(14, 14, 472, 442)
base, bw = 360, 52
months = ['Jan', 'Feb', 'Mac']
tetap = [120, 120, 120]; ttetap = [70, 135, 95]
for i, m in enumerate(months):
    x = 60 + i * 140
    fig += RECT(x, base - tetap[i], bw, tetap[i], f'{PU}55', PU, 6, 2.5)
    fig += RECT(x + bw + 8, base - ttetap[i], bw, ttetap[i], f'{PK}55', PK, 6, 2.5)
    fig += T(x + bw + 4, base + 24, m, MU, 17, halo=False)
fig += LINE((40, base), (460, base), MU, 2.5)
fig += LINE((50, base - 120), (450, base - 120), PU, 2, '6 6')
fig += T(250, 46, 'Perbelanjaan bulanan', TX, 20)
fig += RECT(60, 412, 20, 20, f'{PU}55', PU, 4, 2) + T(88, 422, 'Tetap (sama)', PU, 16, 'start')
fig += RECT(260, 412, 20, 20, f'{PK}55', PK, 4, 2) + T(288, 422, 'Tidak tetap (berubah)', PK, 16, 'start')
add('10.1.2', 'PERBELANJAAN', 'Perbelanjaan tetap dan tidak tetap',
    DEF(f'{B("Perbelanjaan", PK)} ialah wang yang dibelanjakan, iaitu <b>aliran tunai keluar</b>.', col)
    + TABLE(['Tetap (jumlah sama)', 'Tidak tetap (berubah)'],
            [['Sewa rumah', 'Makanan & barang dapur'],
             ['Ansuran kereta / pinjaman', 'Bil elektrik & air'],
             ['Premium insurans', 'Petrol / tambang'],
             ['Bayaran PTPTN', 'Hiburan & makan di luar']], col, fs=18)
    + NOTE('Perbelanjaan <b>tidak tetap</b> lebih mudah dikurangkan apabila wang tidak mencukupi.'),
    svg(fig, 'Carta perbelanjaan tetap yang sama dan perbelanjaan tidak tetap yang berubah setiap bulan'))

# 10.1.2-3 Aliran tunai
def cf_bars(x0, inc, exp, lab):
    sc = 0.06; b = 400
    s = RECT(x0, b - inc * sc, 70, inc * sc, f'{INC}55', INC, 6, 2.5) + RECT(x0 + 84, b - exp * sc, 70, exp * sc, f'{EXP}55', EXP, 6, 2.5)
    s += T(x0 + 35, b - inc * sc - 16, rm(inc), INC, 15) + T(x0 + 119, b - exp * sc - 16, rm(exp), EXP, 15)
    s += T(x0 + 35, b + 18, 'Masuk', MU, 14, halo=False) + T(x0 + 119, b + 18, 'Keluar', MU, 14, halo=False)
    d = inc - exp; c = GR if d >= 0 else RD
    s += T(x0 + 77, 446, f'{lab}: {"+" if d > 0 else ""}{rm(d)}', c, 17)
    return s
assert 4000 - 3200 == 800 and 3000 - 3600 == -600
fig = RECT(14, 14, 472, 442) + T(250, 44, 'Aliran tunai = masuk − keluar', TX, 19)
fig += cf_bars(50, 4000, 3200, 'Positif') + cf_bars(296, 3000, 3600, 'Negatif')
fig += LINE((250, 80), (250, 420), BD, 2, '6 6')
add('10.1.2', 'ALIRAN TUNAI', 'Aliran tunai positif dan negatif',
    DEF('<b>Aliran tunai</b> = jumlah pendapatan − jumlah perbelanjaan', col)
    + BUL([f'{B("Aliran tunai positif", GR)}: pendapatan > perbelanjaan → ada <b>lebihan</b> untuk simpanan dan pelaburan.',
           f'{B("Aliran tunai negatif", RD)}: perbelanjaan > pendapatan → <b>defisit</b>, mungkin perlu berhutang.',
           'Aliran tunai sifar: pendapatan = perbelanjaan, tiada lebihan.'], col)
    + NOTE('Matlamat kita ialah sentiasa mempunyai aliran tunai <b>positif</b>.'),
    svg(fig, 'Carta bar aliran tunai positif dan negatif'))

# 10.1.2-4 Contoh: hitung aliran tunai
inc = [('Gaji bersih', 3800), ('Sewa bilik (pasif)', 400)]
fix = [('Sewa rumah', 900), ('Ansuran kereta', 550), ('Premium insurans', 150)]
var = [('Makanan', 800), ('Utiliti', 250), ('Petrol', 300), ('Hiburan', 200)]
TI, TF, TV = sum(v for _, v in inc), sum(v for _, v in fix), sum(v for _, v in var)
CF = TI - TF - TV
assert (TI, TF, TV, CF) == (4200, 1600, 1550, 1050)
fig, yb = CARD_ROWS(14, 14, 472, [(a, rm(b), GR) for a, b in inc] + [('Jumlah pendapatan', rm(TI), TX)], 'Pendapatan', GR, 30, 16)
f2, yb = CARD_ROWS(14, yb + 10, 472, [(a, rm(b), PU) for a, b in fix] + [(a, rm(b), PK) for a, b in var] + [('Jumlah perbelanjaan', rm(TF + TV), TX)], 'Perbelanjaan (tetap · tidak tetap)', PK, 27, 16)
fig += f2
add('10.1.2', 'CONTOH', 'Hitung aliran tunai',
    P('Berdasarkan maklumat kewangan bulanan Encik Hafiz dalam rajah, hitung aliran tunainya.', True)
    + STEPS([f'Jumlah pendapatan = {grp(3800)} + 400 = <b>{rm(TI)}</b>',
             f'Perbelanjaan tetap = 900 + 550 + 150 = <b>{rm(TF)}</b>',
             f'Perbelanjaan tidak tetap = 800 + 250 + 300 + 200 = <b>{rm(TV)}</b>',
             f'Aliran tunai = {grp(TI)} − ({grp(TF)} + {grp(TV)}) = <b>{rm(CF)}</b>'], col)
    + ANS(f'{rm(CF)}, iaitu aliran tunai positif'),
    svg(fig, 'Penyata pendapatan dan perbelanjaan bulanan Encik Hafiz'))
assert fig.count('<rect') >= 2

# 10.1.2-5 Pelan kewangan peribadi
g2, pas = 4000, 500
TI2 = g2 + pas; sv = TI2 // 10; dk = 200; baki = TI2 - sv - dk
tf2, tv2 = 1800, 1450; leb = baki - tf2 - tv2
assert (TI2, sv, baki, leb) == (4500, 450, 3850, 600)
rows = [('Gaji bersih', rm(g2), GR), ('Pendapatan pasif', rm(pas), GR), ('Jumlah pendapatan', rm(TI2), TX),
        ('Tolak: simpanan tetap 10%', rm(sv), TR), ('Tolak: dana kecemasan', rm(dk), TR), ('Baki pendapatan', rm(baki), TX),
        ('Tolak: perbelanjaan tetap', rm(tf2), PU), ('Tolak: perbelanjaan tidak tetap', rm(tv2), PK), ('Lebihan pendapatan', rm(leb), AM)]
fig, _ = CARD_ROWS(14, 14, 472, rows, 'Pelan kewangan bulanan Puan Lina', GR, 42, 17)
for k in (3, 6, 9):
    yl = 14 + 44 + 42 * k - 2
    if k < 9: fig += LINE((30, yl), (470, yl), BD, 2)
add('10.1.2', 'PELAN KEWANGAN', 'Pelan kewangan peribadi',
    P('Pelan kewangan (belanjawan) menyenaraikan pendapatan, simpanan dan perbelanjaan bulanan.', True)
    + STEPS(['Senaraikan semua pendapatan (aktif + pasif).',
             '<b>Bayar diri sendiri dahulu</b>: asingkan simpanan tetap (sekurang-kurangnya 10%) dan dana kecemasan.',
             'Tolak perbelanjaan tetap dan perbelanjaan tidak tetap.',
             f'Baki ialah <b>lebihan pendapatan</b>: {grp(baki)} − {grp(tf2)} − {grp(tv2)} = {rm(leb)}'], col)
    + NOTE('<b>Dana kecemasan</b> digunakan untuk perkara tidak dijangka seperti sakit atau kehilangan kerja.'),
    svg(fig, 'Contoh pelan kewangan bulanan Puan Lina'))

# 10.1.2-6 Kesilapan biasa
CASES = [(46, 'Guna gaji kasar dalam pelan', False), (122, 'Guna gaji bersih (selepas potongan)', True),
         (210, 'Bil elektrik ialah perbelanjaan tetap', False), (286, 'Bil elektrik berubah: tidak tetap', True),
         (374, 'Simpan baki yang tinggal di akhir bulan', False)]
fig = ''
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(46, y) if ok else CROSS(46, y)) + T(74, y, t, GR if ok else RD, 17, 'start')
fig += T(250, 446, '✓ Asingkan simpanan pada awal bulan', GR, 18, halo=False)
add('10.1.2', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Gaji kasar", RD)} ✗ → gunakan gaji bersih yang sebenarnya diterima.',
         f'{B("Salah kelas", RD)} ✗ → bil utiliti, makanan dan petrol ialah perbelanjaan tidak tetap.',
         f'{B("Terlupa pendapatan pasif", RD)} ✗ → sewa, dividen dan faedah juga pendapatan.',
         f'{B("Tertukar tanda", RD)} ✗ → aliran tunai = pendapatan − perbelanjaan, bukan sebaliknya.'], col),
    svg(fig, 'Contoh kesilapan biasa dalam pelan kewangan'))

# 10.1.2-7 Ringkasan
fig = ''
blocks = [('Pendapatan', 'aktif + pasif', GR), ('− Simpanan', '≥ 10% + dana kecemasan', TR),
          ('− Perbelanjaan tetap', 'jumlah sama setiap bulan', PU), ('− Perbelanjaan tidak tetap', 'berubah setiap bulan', PK),
          ('= Lebihan / defisit', 'aliran tunai', AM)]
for i, (a, b, c) in enumerate(blocks):
    y = 16 + i * 90
    fig += RECT(14, y, 472, 74, SURF, c, 16, 2) + T(34, y + 26, a, c, 21, 'start') + T(34, y + 54, b, MU3, 16, 'start', 600, False)
    if i < 4: fig += ARROW((450, y + 74), (450, y + 90), MU2, 3, 7)
add('10.1.2', 'RINGKASAN', 'Ringkasan 10.1.2',
    TABLE(['Perkara', 'Isi penting'],
          [['Pendapatan aktif', 'gaji, elaun, komisen, upah'],
           ['Pendapatan pasif', 'sewa, dividen, faedah'],
           ['Perbelanjaan tetap', 'sewa, ansuran, insurans'],
           ['Perbelanjaan tidak tetap', 'makanan, utiliti, petrol'],
           ['Aliran tunai', 'pendapatan − perbelanjaan']], col, rv=True)
    + NOTE('Positif = lebihan; negatif = defisit.'),
    svg(fig, 'Aliran pelan kewangan peribadi daripada pendapatan hingga lebihan'))

# ===================== 10.1.3 MENILAI PELAN KEWANGAN =====================
col = SUB['10.1.3'][1]

# 10.1.3-1 Definisi kebolehlaksanaan
fig = RECT(14, 14, 472, 442)
fig += T(250, 46, 'Simpanan perlu vs lebihan', TX, 20)
def gauge(x, need, have, lab):
    sc = 0.5; b = 360
    s = RECT(x, b - need * sc, 76, need * sc, f'{AM}55', AM, 6, 2.5) + RECT(x + 90, b - have * sc, 76, have * sc, f'{GR}55', GR, 6, 2.5)
    s += T(x + 38, b - need * sc - 16, rm(need), AM, 16) + T(x + 128, b - have * sc - 16, rm(have), GR, 16)
    s += T(x + 38, b + 18, 'Perlu', MU, 14, halo=False) + T(x + 128, b + 18, 'Lebihan', MU, 14, halo=False)
    ok = have >= need
    s += (TICK(x + 30, 414) if ok else CROSS(x + 30, 414)) + T(x + 50, 414, lab, GR if ok else RD, 17, 'start')
    return s
fig += gauge(40, 200, 350, 'Boleh') + gauge(270, 375, 300, 'Tidak boleh')
fig += LINE((250, 80), (250, 430), BD, 2, '6 6')
add('10.1.3', 'DEFINISI', 'Menilai kebolehlaksanaan pelan',
    DEF('Pelan kewangan <b>boleh dilaksanakan</b> jika simpanan bulanan yang diperlukan untuk mencapai matlamat <b>tidak melebihi</b> lebihan pendapatan bulanan.', col)
    + P(f'Simpanan bulanan = {B("nilai matlamat", AM)} ÷ {B("tempoh (bulan)", TR)}')
    + BUL(['Simpanan perlu ≤ lebihan → pelan <b>boleh</b> dilaksanakan.',
           'Simpanan perlu > lebihan → pelan <b>tidak boleh</b> dilaksanakan; pelan perlu diubah suai.'], col)
    + NOTE('Tukar tempoh dalam tahun kepada <b>bulan</b> dahulu: 1 tahun = 12 bulan.'),
    svg(fig, 'Perbandingan simpanan diperlukan dengan lebihan pendapatan'))

# 10.1.3-2 Contoh 1 (boleh)
goal, yrs, leb1 = 7200, 3, 350
need = goal // (yrs * 12)
assert goal % (yrs * 12) == 0 and need == 200 and leb1 - need == 150
fig = RECT(14, 14, 472, 442)
fig += JAR(60, 150, 150, 240, 0.0, AM)
for k in range(6):
    fig += RECT(72, 362 - k * 38, 126, 30, f'{AM}44', AM, 6, 2)
fig += T(135, 120, rm(goal), AM, 24) + T(135, 420, '36 bulan', TR, 19)
fig += T(260, 150, 'Perlu sebulan', MU, 17, 'start', 600, False) + T(260, 180, rm(need), AM, 26, 'start')
fig += T(260, 230, 'Lebihan sebulan', MU, 17, 'start', 600, False) + T(260, 260, rm(leb1), GR, 26, 'start')
fig += TICK(270, 320) + T(290, 320, 'Boleh!', GR, 22, 'start') + T(260, 360, f'Baki {rm(leb1 - need)}', MU3, 17, 'start')
add('10.1.3', 'CONTOH 1', 'Adakah pelan boleh dilaksanakan?',
    P(f'Daniel mahu membeli motosikal berharga <b>{rm(goal)}</b> dalam masa <b>{yrs} tahun</b>. Lebihan pendapatannya ialah <b>{rm(leb1)}</b> sebulan.', True)
    + STEPS([f'Tempoh = {yrs} × 12 = <b>36 bulan</b>',
             f'Simpanan bulanan = {grp(goal)} ÷ 36 = <b>{rm(need)}</b>',
             f'Bandingkan: {rm(need)} &lt; {rm(leb1)}'], col)
    + ANS(f'Boleh dilaksanakan. Daniel masih ada baki {rm(leb1 - need)} sebulan.'),
    svg(fig, 'Balang simpanan motosikal Daniel'))

# 10.1.3-3 Contoh 2 (tidak boleh) & ubah suai
goal2, mon2, leb2 = 9000, 24, 300
need2 = goal2 / mon2
assert need2 == 375 and need2 - leb2 == 75 and goal2 / leb2 == 30
fig = RECT(14, 14, 472, 442) + T(250, 46, f'Matlamat {rm(goal2)} · lebihan {rm(leb2)}', TX, 18)
opts = [('A', 'Kurangkan belanja tidak tetap', f'sebanyak {rm(75)} sebulan', GR),
        ('B', 'Panjangkan tempoh', f'{grp(goal2)} ÷ 300 = 30 bulan', TR),
        ('C', 'Tambah pendapatan', f'kerja sambilan ≥ {rm(75)}', PU)]
for i, (L, a, b, c) in enumerate(opts):
    y = 80 + i * 120
    fig += RECT(30, y, 440, 100, SURF, c, 16, 2) + RECT(44, y + 22, 54, 54, f'{c}33', c, 12, 3) + T(71, y + 50, L, c, 28, weight=800, halo=False)
    fig += T(116, y + 36, a, c, 19, 'start') + T(116, y + 68, b, MU3, 17, 'start', 600, False)
add('10.1.3', 'CONTOH 2', 'Pelan yang perlu diubah suai',
    P(f'Mei Ling mahu menyimpan <b>{rm(goal2)}</b> dalam <b>{mon2} bulan</b>. Lebihan pendapatannya <b>{rm(leb2)}</b> sebulan.', True)
    + STEPS([f'Simpanan bulanan = {grp(goal2)} ÷ {mon2} = <b>{rm(int(need2))}</b>',
             f'{rm(int(need2))} &gt; {rm(leb2)} → kurang <b>{rm(75)}</b> sebulan; pelan tidak boleh dilaksanakan.',
             f'Cadangan: kurangkan perbelanjaan tidak tetap {rm(75)}, <b>atau</b> panjangkan tempoh kepada {grp(goal2)} ÷ 300 = <b>30 bulan</b>, <b>atau</b> tambah pendapatan.'], col)
    + ANS('Ubah suai pelan supaya simpanan perlu ≤ lebihan'),
    svg(fig, 'Tiga cara mengubah suai pelan kewangan Mei Ling'))

# 10.1.3-4 Cari tempoh (bundar ke atas)
goal3, s3 = 5000, 300
m3 = math.ceil(goal3 / s3)
assert m3 == 17 and s3 * 16 < goal3 <= s3 * 17
fig = RECT(14, 14, 472, 442) + T(250, 46, f'Simpan {rm(s3)} sebulan', TX, 20)
for k in range(17):
    r_, c_ = divmod(k, 6)
    x, y = 46 + c_ * 70, 86 + r_ * 92
    full = k < 16
    fig += RECT(x, y, 58, 70, f'{GR}44' if full else f'{AM}44', GR if full else AM, 10, 2.5) + T(x + 29, y + 35, str(k + 1), TX, 19)
fig += T(250, 372, f'16 bulan → {rm(s3 * 16)} (belum cukup)', RD, 18) + T(250, 406, f'17 bulan → {rm(s3 * 17)} ✓', GR, 18)
fig += T(250, 440, f'{grp(goal3)} ÷ 300 = 16.67 → 17 bulan', AM, 18)
add('10.1.3', 'MENCARI TEMPOH', 'Berapa bulan diperlukan?',
    P(f'Aisyah menyimpan <b>{rm(s3)}</b> sebulan untuk mengumpul <b>{rm(goal3)}</b>. Berapakah tempoh minimum?', True)
    + STEPS([f'Tempoh = nilai matlamat ÷ simpanan bulanan',
             f'= {grp(goal3)} ÷ 300 = 16.67 bulan',
             'Bilangan bulan mesti nombor bulat. Bundarkan <b>ke atas</b> kerana 16 bulan belum cukup.'], col)
    + ANS(f'{m3} bulan'),
    svg(fig, 'Tujuh belas bulan simpanan RM300 untuk mencapai RM5 000'))

# 10.1.3-5 Cara menambah baik pelan
fig = RECT(14, 14, 472, 442)
fig += T(250, 44, 'Lebihan = pendapatan − perbelanjaan', TX, 18)
LEV = [('↑', 'Tambah pendapatan', 'kerja sambilan, jual barang terpakai', GR),
       ('↓', 'Kurangkan perbelanjaan', 'kurangkan kehendak, bandingkan harga', PK),
       ('⏱', 'Panjangkan tempoh', 'simpanan bulanan menjadi lebih kecil', TR),
       ('◎', 'Semak semula matlamat', 'pilih barang yang lebih murah', AM)]
for i, (ic, a, b, c) in enumerate(LEV):
    y = 74 + i * 94
    fig += RECT(30, y, 440, 80, SURF, c, 16, 2) + CIRC(70, y + 40, 24, f'{c}33', c, 3) + T(70, y + 41, ic, c, 22, weight=800, halo=False)
    fig += T(108, y + 28, a, c, 19, 'start') + T(108, y + 56, b, MU3, 15.5, 'start', 600, False)
add('10.1.3', 'CADANGAN', 'Cara menambah baik pelan kewangan',
    BUL([f'{B("Tambah pendapatan", GR)}: pendapatan aktif (kerja sambilan) atau pasif (sewa, dividen).',
         f'{B("Kurangkan perbelanjaan tidak tetap", PK)}: utamakan keperluan, kurangkan kehendak.',
         f'{B("Panjangkan tempoh", TR)} supaya simpanan bulanan lebih kecil.',
         f'{B("Semak semula matlamat", AM)}: pilih sasaran yang lebih realistik.'], col)
    + NOTE('Perbelanjaan <b>tetap</b> seperti ansuran dan sewa sukar dikurangkan dalam masa singkat.'),
    svg(fig, 'Empat cara menambah baik pelan kewangan'))

# 10.1.3-6 Kesilapan biasa
assert 3600 / 2 == 1800 and 3600 / 24 == 150 and math.ceil(1000 / 300) == 4
CASES = [(46, f'{rm(3600)} dalam 2 tahun: {rm(3600)} ÷ 2', False), (122, f'{rm(3600)} ÷ 24 bulan = {rm(150)} sebulan', True),
         (210, f'{rm(1000)} ÷ {rm(300)} = 3.33 → 3 bulan', False), (286, f'3.33 → bundar ke atas: 4 bulan', True),
         (374, 'Banding dengan jumlah pendapatan', False)]
fig = ''
for y, t, ok in CASES:
    fig += RECT(16, y - 28, 468, 56, SURF, GR if ok else RD, 14, 2)
    fig += (TICK(46, y) if ok else CROSS(46, y)) + T(74, y, t, GR if ok else RD, 17, 'start')
fig += T(250, 446, '✓ Banding dengan lebihan pendapatan', GR, 18, halo=False)
add('10.1.3', 'KESILAPAN BIASA', 'Jangan terkeliru',
    BUL([f'{B("Tidak tukar tahun kepada bulan", RD)} ✗ → 2 tahun = 24 bulan.',
         f'{B("Bundar ke bawah", RD)} ✗ → tempoh simpanan mesti dibundarkan ke atas.',
         f'{B("Banding dengan jumlah pendapatan", RD)} ✗ → bandingkan dengan <b>lebihan</b> selepas perbelanjaan.',
         f'{B("Kurangkan keperluan", RD)} ✗ → kurangkan kehendak dahulu.'], col),
    svg(fig, 'Contoh kesilapan biasa semasa menilai pelan kewangan'))

# 10.1.3-7 Ringkasan
fig = ''
flow = [('1', 'Tukar tempoh kepada bulan', TR), ('2', 'Simpanan perlu = matlamat ÷ bulan', AM),
        ('3', 'Banding dengan lebihan pendapatan', GR), ('4', 'Perlu ≤ lebihan → boleh', GR), ('5', 'Jika tidak → ubah suai pelan', PK)]
for i, (n, t, c) in enumerate(flow):
    y = 16 + i * 90
    fig += RECT(14, y, 472, 74, SURF, c, 16, 2) + CIRC(50, y + 37, 20, f'{c}33', c, 3) + T(50, y + 38, n, c, 20, weight=800, halo=False) + T(84, y + 37, t, TX, 18, 'start')
    if i < 4: fig += ARROW((250, y + 74), (250, y + 90), MU2, 3, 7)
add('10.1.3', 'RINGKASAN', 'Ringkasan 10.1.3',
    TABLE(['Perkara', 'Rumus / tindakan'],
          [['Simpanan bulanan', 'nilai matlamat ÷ bilangan bulan'],
           ['Tempoh', 'nilai matlamat ÷ simpanan bulanan (bundar ke atas)'],
           ['Boleh dilaksanakan', 'simpanan perlu ≤ lebihan'],
           ['Tidak boleh', 'tambah pendapatan, kurangkan belanja, panjangkan tempoh']], col, rv=True, fs=18),
    svg(fig, 'Carta alir menilai kebolehlaksanaan pelan kewangan'))

# ---------- tulis fail ----------
counts = {}
for s in S: counts[s['sub']] = counts.get(s['sub'], 0) + 1
out, idx = [], {}
for s in S:
    sub = s['sub']; idx[sub] = idx.get(sub, 0) + 1
    out.append({'sub': sub, 'n': idx[sub], 'N': counts[sub], 'kicker': s['kicker'], 'title': s['title'],
                'body': s['body'], 'fig': s['fig'] or '', 'full': ''})
subs = [{'no': k, 'name': v[0], 'col': v[1]} for k, v in SUB.items()]

ALLOWED = {x.lower() for x in [BG, SURF, NAV, BD, TX, MU, GRID, DIM, MU2, MU3] + list(C.values())}
js_body = json.dumps(out, ensure_ascii=False)
bad = {h for h in re.findall(r'#[0-9a-fA-F]{6}', js_body) if h.lower() not in ALLOWED}
assert not bad, f'warna luar palet: {bad}'
assert 'NaN' not in js_body and 'None' not in js_body and 'undefined' not in js_body
assert counts == {'10.1.1': 7, '10.1.2': 7, '10.1.3': 7}, counts

js = ('/* Dijana oleh tools/kewangan/gen_slides.py. Jangan sunting dengan tangan. */\n'
      'window.SUBS=' + json.dumps(subs, ensure_ascii=False) + ';\nwindow.SLIDES=' + js_body + ';\n')
open(OUTFILE, 'w').write(js)
print(len(out), 'slaid,', len(js), 'bait ->', OUTFILE)
