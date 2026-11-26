"""Bab 5 T2 Bulatan: nota ikut buku teks (ayat buku, nombor ditukar)."""
import math
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())
SUBS = [{"no": "5.1", "name": "Sifat Bulatan", "col": "#FB923C"}, {"no": "5.2", "name": "Sifat Simetri Perentas", "col": "#38BDF8"},
        {"no": "5.3", "name": "Lilitan dan Luas Bulatan", "col": "#34D399"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def sq(x):
    return f'√<span style="display:inline-block;border-top:2px solid currentColor;padding:2px 3px 0;line-height:1.15">{x}</span>'


PI = fr('22', '7')
J = '<i>j</i>'


def pen(sub, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(sub, items)


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def work(blocks, sub):
    c = COL[sub]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            'display:flex;flex-direction:column;gap:12px;font-size:20px;line-height:1.5">' + ''.join(out) + '</div>')


CX, CY, R = 250, 225, 160


def pt(a, r=R):
    return (CX + r * math.cos(math.radians(a)), CY - r * math.sin(math.radians(a)))


def circ(col=OBJ, fill=True):
    return f'<circle cx="{CX}" cy="{CY}" r="{R}" fill="{col + "18" if fill else "none"}" stroke="{col}" stroke-width="3.5"/>'


def ln(a, b, col=TX, w=3, dash=False):
    d = ' stroke-dasharray="8 6"' if dash else ''
    return f'<line x1="{f(a[0])}" y1="{f(a[1])}" x2="{f(b[0])}" y2="{f(b[1])}" stroke="{col}" stroke-width="{w}"{d}/>'


def dot(p_, col=TX, r=5):
    return f'<circle cx="{f(p_[0])}" cy="{f(p_[1])}" r="{r}" fill="{col}"/>'


def lbl(p_, t, dx=0, dy=0, col=TX, s=19):
    return T(p_[0] + dx, p_[1] + dy + 6, t, col, s, fam=HEAD)


def sector(a1, a2, col, r=R):
    p1, p2 = pt(a1, r), pt(a2, r)
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f'<path d="M{CX} {CY} L{f(p1[0])} {f(p1[1])} A{r} {r} 0 {large} 0 {f(p2[0])} {f(p2[1])} Z" fill="{col}44" stroke="{col}" stroke-width="3"/>'


def segment(a1, a2, col, r=R):
    p1, p2 = pt(a1, r), pt(a2, r)
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f'<path d="M{f(p1[0])} {f(p1[1])} A{r} {r} 0 {large} 0 {f(p2[0])} {f(p2[1])} Z" fill="{col}44" stroke="{col}" stroke-width="3"/>'


def arcpath(a1, a2, col, r=R, w=6):
    p1, p2 = pt(a1, r), pt(a2, r)
    large = 1 if (a2 - a1) % 360 > 180 else 0
    return f'<path d="M{f(p1[0])} {f(p1[1])} A{r} {r} 0 {large} 0 {f(p2[0])} {f(p2[1])}" fill="none" stroke="{col}" stroke-width="{w}"/>'


def rmark(p_, ux, uy, vx, vy, s=14):
    a = (p_[0] + ux * s, p_[1] + uy * s); b = (a[0] + vx * s, a[1] + vy * s); c = (p_[0] + vx * s, p_[1] + vy * s)
    return f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])} L{f(c[0])} {f(c[1])}" fill="none" stroke="{TX}" stroke-width="2"/>'


O = (CX, CY)
# =====================================================================
# 5.1 SIFAT BULATAN
# =====================================================================
s = '5.1'
k = [circ(), dot(O), lbl(O, 'O', -16, 6), ln(O, pt(30), IMG, 3.5), lbl(pt(32, R * .55), 'jejari', 0, -14, IMG, 16),
     ln(pt(200), pt(20), GR, 3.5), lbl(pt(200, R * .5), 'diameter', 0, 22, GR, 16), lbl(pt(110, R + 28), 'lilitan', 0, 0, OBJ, 16)]
S(s, 'DEFINISI', 'Bulatan dan bahagiannya',
  de(s, '<b>Bulatan</b> ialah lingkaran bagi satu titik yang bergerak sama jarak dari satu titik tetap.')
  + bul(s, ['<b>Pusat:</b> Satu titik tetap yang berjarak sama dari semua titik pada lilitan bulatan.', '<b>Jejari:</b> Garis lurus dari pusat bulatan ke sebarang titik pada lilitan bulatan.',
            '<b>Lilitan:</b> Perimeter sebuah bulatan.', '<b>Diameter:</b> Garis lurus yang menyentuh lilitan dan melalui pusat bulatan.']),
  box(''.join(k), 'Bulatan dengan pusat, jejari, diameter dan lilitan'))

k = [circ(OBJ, False), sector(20, 80, PU), segment(200, 290, AM), ln(pt(135), pt(170), IMG, 3.5), dot(O), lbl(O, 'O', 14, 18),
     lbl(pt(50, R * .55), 'sektor', 0, 0, PU, 15), lbl(pt(245, R * .78), 'tembereng', -10, 0, AM, 15), lbl(pt(152, R - 30), 'perentas', 30, 0, IMG, 15),
     arcpath(100, 125, GR, R, 7), lbl(pt(112, R + 26), 'lengkok', 0, 0, GR, 15)]
S(s, 'DEFINISI', 'Perentas, lengkok, sektor dan tembereng',
  bul(s, ['<b>Perentas:</b> Garis lurus yang menyambung sebarang dua titik pada lilitan.', '<b>Lengkok:</b> Lengkok adalah sebahagian daripada lilitan.',
          '<b>Sektor:</b> Rantau yang dibatasi oleh satu lengkok dan dua jejari.', '<b>Tembereng:</b> Rantau yang dibatasi oleh satu lengkok dan satu perentas.'])
  + note('Diameter ialah perentas yang paling panjang bagi sesuatu bulatan. Sektor dan tembereng boleh jadi minor atau major.', 'Ingat:'),
  box(''.join(k), 'Bulatan dengan perentas, lengkok, sektor dan tembereng'))

k = [circ(OBJ, False), sector(-40, 10, PU), dot(O), lbl(O, 'O', -16, 6), ln(pt(140), pt(220), IMG, 3.5), ln(pt(100), pt(280), GR, 3.5), ln(O, pt(60), AM, 3.5),
     arcpath(150, 200, TX, R, 2)]
for p_, t in [(pt(180, R - 22), 'a'), (pt(95, R * .62), 'b'), (pt(70, R * .45), 'c'), (pt(240, R + 24), 'd'), (pt(-15, R * .6), 'e'), (pt(30, R + 24), 'f')]:
    k.append(lbl(p_, t, 0, 0, TX, 20))
k.append(arcpath(15, 45, OBJ, R, 7))
S(s, 'CONTOH 1', 'Mengenal pasti bahagian bulatan',
  p('Dalam rajah, O ialah pusat bulatan. Kenal pasti bahagian bulatan berikut.')
  + pen(s, ['<i>a</i>, Perentas &nbsp;&nbsp; <i>b</i>, Diameter', '<i>c</i>, Jejari &nbsp;&nbsp; <i>d</i>, Lilitan', '<i>e</i>, Sektor &nbsp;&nbsp; <i>f</i>, Lengkok']),
  box(''.join(k), 'Bulatan dengan bahagian berlabel a hingga f'))

Qp = pt(150, R * .45)
k = [f'<g class="rv">{circ(OBJ, False)}</g>', dot(O), lbl(O, 'O', 16, -10), dot(Qp, AM), lbl(Qp, 'Q', -14, -12, AM),
     f'<g class="rv">{ln(O, pt(0), IMG, 3)}{lbl(pt(0, R * .5), "4 cm", 0, -14, IMG, 16)}</g>', f'<g class="rv">{ln(pt(150), pt(330), GR, 3.5)}{lbl(pt(330, R * .6), "diameter", 10, 18, GR, 16)}</g>']
S(s, 'KONSEP', 'Membina bulatan dan diameter',
  p('(a) Bina bulatan apabila diberi jejari 4 cm dan berpusat O. (b) Bina diameter yang melalui titik Q dalam bulatan yang berpusat di titik O.')
  + steps(s, ['(a) 1. Tandakan satu titik O. 2. Ukur jangka lukis berjarak 4 cm pada pembaris.', '3. Letakkan hujung tajam jangka lukis pada titik O dan lukis sebuah bulatan berjejari 4 cm.',
              '(b) 1. Sambungkan titik O dan Q dengan garis lurus menggunakan pembaris.', '2. Lanjutkan garis itu sehingga menyentuh lilitan. Maka, garis lurus yang melalui Q dan pusat yang menyentuh lilitan ialah <b>diameter</b>.']),
  box(''.join(k), 'Pembinaan bulatan berjejari 4 cm dan diameter melalui Q'))

Pp, Ap = pt(120), pt(60)
k = [circ(OBJ, False), dot(O), lbl(O, 'O', -16, 6), dot(Pp, AM), lbl(Pp, 'P', -14, -14, AM),
     f'<g class="rv">{dot(Ap, AM)}{lbl(Ap, "A", 14, -14, AM)}</g>', f'<g class="rv">{ln(Pp, Ap, IMG, 3.5)}{lbl(pt(90, R + 18), "4 cm", 0, 0, IMG, 16)}</g>']
S(s, 'KONSEP', 'Membina perentas',
  p('(c) Bina perentas dengan panjang 4 cm dari titik P pada bulatan.')
  + steps(s, ['1. Buka jangka lukis pada pembaris dan ukur selebar 4 cm.', '2. Letakkan hujung tajam jangka lukis pada titik P.', '3. Lukis lengkok yang memotong lilitan dan labelkan titik A.',
              '4. Sambungkan titik P ke titik A yang telah ditanda pada lilitan.', '5. Maka, garisan PA ialah <b>perentas</b>.']),
  box(''.join(k), 'Pembinaan perentas PA sepanjang 4 cm'))

k = [f'<g class="rv">{circ(OBJ, False)}{dot(O)}{lbl(O, "O", -16, 6)}{ln(O, pt(270), TX, 3)}{lbl(pt(270), "A", 0, 22)}</g>',
     f'<g class="rv">{dot(pt(320), AM)}{lbl(pt(322, R * .5), "50°", 0, 0, PU, 16)}</g>', f'<g class="rv">{sector(270, 320, PU)}{lbl(pt(320), "B", 16, 10)}</g>']
S(s, 'KONSEP', 'Membina sektor bulatan',
  p('(d) Bina sektor bulatan bersudut 50° pada pusat bulatan yang berjejari 3 cm.')
  + steps(s, ['1. Lukis sebuah bulatan berpusat O dengan panjang jejari OA ialah 3 cm.', '2. Dengan menggunakan protraktor, tandakan satu titik pada sudut 50° dari jejari OA.',
              '3. Lukis jejari OB dengan menyambung pusat O dari titik itu dengan garis lurus. Maka, AOB ialah <b>sektor bulatan</b>.']),
  box(''.join(k), 'Pembinaan sektor AOB bersudut 50 darjah'))

# =====================================================================
# 5.2 SIFAT SIMETRI PERENTAS
# =====================================================================
s = '5.2'
M_, N_ = pt(135), pt(225)
K_ = ((M_[0] + N_[0]) / 2, (M_[1] + N_[1]) / 2)
k = [circ(), ln(pt(180), pt(0), AM, 2.5, True), ln(M_, N_, IMG, 3.5), dot(O), lbl(O, 'O', 16, -12), lbl(M_, 'M', -16, -10), lbl(N_, 'N', -16, 16),
     ln(K_, O, TX, 2), rmark(K_, 1, 0, 0, -1), T(250, 430, 'Jejari yang berserenjang dengan perentas', TX, 15), T(250, 450, 'membahagi dua sama perentas itu', TX, 15)]
S(s, 'KONSEP', 'Ciri-ciri bulatan',
  bul(s, ['Diameter sebuah bulatan merupakan suatu paksi simetri bulatan tersebut.', 'Jejari yang berserenjang dengan perentas membahagi dua sama perentas itu.',
          'Pembahagi dua sama serenjang dua perentas bertemu di pusat bulatan.', 'Perentas yang sama panjang menghasilkan lengkok yang sama panjang.',
          'Dua perentas yang sama panjang adalah sama jarak dari pusat bulatan dan sebaliknya.'])
  + note('Diameter ialah perentas yang melalui pusat bulatan.', 'Tip:'), box(''.join(k), 'Jejari serenjang dengan perentas MN'))

M_, N_ = pt(127), pt(233)
K_ = (M_[0], CY)
k = [circ(), ln(pt(90), pt(270), TX, 2.5), ln(pt(180), pt(0), TX, 2.5), ln(M_, N_, IMG, 3.5), ln(O, N_, GR, 3), dot(O),
     lbl(O, 'O', 16, -12), lbl(pt(90), 'A', 0, -16), lbl(pt(270), 'B', 0, 22), lbl(pt(180), 'P', -18, 0), lbl(pt(0), 'Q', 18, 0), lbl(M_, 'M', -14, -12), lbl(N_, 'N', -14, 18),
     lbl(K_, 'K', -18, -14), rmark(K_, 1, 0, 0, -1)]
S(s, 'CONTOH 2', 'Paksi simetri dan Teorem Pythagoras',
  p('Rajah di sebelah menunjukkan sebuah bulatan dengan pusat O dan garis MN ialah perentas. (a) Namakan paksi simetri bagi rajah ini. (b) Diberi OK = 6 cm dan NK = 8 cm, hitung panjang ON. (c) Namakan sudut yang sama saiz dengan ∠ONK.')
  + pen(s, ['(a) AOB dan POQ', f'(b) ON² = 8² + 6², ON = {sq("64 + 36")} = {sq("100")}, ON = 10. Maka, panjang ON ialah 10 cm.', '(c) ∠OMK']), box(''.join(k), 'Bulatan berpusat O dengan perentas MN'))

M_, N_ = pt(205), pt(335)
S_ = (CX, M_[1]); P_ = pt(270)
k = [circ(), ln(M_, N_, IMG, 3.5), ln(O, P_, TX, 3), ln(O, M_, GR, 2.5, True), dot(O), lbl(O, 'O', 0, -18), lbl(M_, 'M', -18, 6), lbl(N_, 'N', 18, 6), lbl(S_, 'S', -14, -14), lbl(P_, 'P', 0, 22),
     rmark(S_, 1, 0, 0, -1), lbl(((O[0] + M_[0]) / 2, (O[1] + M_[1]) / 2), '13 cm', -30, -8, GR, 15), lbl((CX, (CY + S_[1]) / 2), '5 cm', 30, 0, TX, 15)]
S(s, 'CONTOH 3', 'Jejari serenjang dengan perentas',
  p('Rajah di sebelah menunjukkan sebuah bulatan dengan perentas MN yang berserenjang dengan jejari OP. (a) Adakah panjang MS sama dengan panjang SN? Jelaskan. (b) Jika jejari bulatan ialah 13 cm dan OS = 5 cm, hitung panjang perentas MN.')
  + pen(s, ['(a) Ya, MS = SN. Jejari OP yang berserenjang dengan perentas membahagi dua sama perentas.', f'(b) MS = {sq("13² − 5²")} = {sq("169 − 25")} = {sq("144")}',
            'MS = SN = 12. Maka, MN = 24 cm.']), box(''.join(k), 'Bulatan dengan perentas MN dan jejari OP'))

R2, S2, T2, U2 = pt(152), pt(28), pt(208), pt(332)
P2, Q2 = (CX, R2[1]), (CX, T2[1])
k = [circ(), ln(R2, S2, IMG, 3.5), ln(T2, U2, IMG, 3.5), ln(pt(90), pt(270), TX, 2.5), ln(O, R2, GR, 2.5, True), dot(O),
     lbl(O, 'O', 16, 4), lbl(R2, 'R', -16, -8), lbl(S2, 'S', 16, -8), lbl(T2, 'T', -16, 14), lbl(U2, 'U', 16, 14), lbl(P2, 'P', 14, -16), lbl(Q2, 'Q', 14, 22),
     lbl(pt(90), 'M', 0, -16), lbl(pt(270), 'N', 0, 22), rmark(P2, 1, 0, 0, 1), rmark(Q2, 1, 0, 0, -1)]
S(s, 'CONTOH 4', 'Perentas yang sama panjang',
  p('Rajah di sebelah menunjukkan dua perentas yang sama panjang RS dan TU. POQ ialah garis lurus yang melalui pusat bulatan O. Diberi OP = 8 cm dan RS = 30 cm. (a) Hitung panjang PR. (b) Adakah lengkok minor RMS dan TNU sama panjang? Jelaskan. (c) Hitung jejari bulatan itu.')
  + pen(s, ['(a) Jejari yang berserenjang dengan perentas, membahagi perentas itu kepada dua bahagian yang sama panjang. PR = 30 ÷ 2 = 15 cm',
            '(b) Ya, perentas yang sama panjang menghasilkan lengkok yang sama panjang.', f'(c) OR = {sq("PR² + OP²")} = {sq("15² + 8²")} = {sq("289")} = 17 cm'], False),
  box(''.join(k), 'Bulatan dengan dua perentas sama panjang RS dan TU'))

P3, Q3, R3 = pt(110), pt(20), pt(200)
k = [circ(OBJ, False), ln(P3, Q3, IMG, 3), ln(P3, R3, IMG, 3), lbl(P3, 'P', -10, -16), lbl(Q3, 'Q', 16, -6), lbl(R3, 'R', -16, 10)]
for a_, b_ in [(P3, Q3), (P3, R3)]:
    mx, my = (a_[0] + b_[0]) / 2, (a_[1] + b_[1]) / 2; dx, dy = b_[0] - a_[0], b_[1] - a_[1]; L = (dx * dx + dy * dy) ** .5
    nx, ny = -dy / L, dx / L
    k.append(f'<g class="rv">{ln((mx - nx * 60, my - ny * 60), (mx + nx * 240, my + ny * 240), AM, 2.5, True)}</g>')
k.append(f'<g class="rv">{dot(O, GR, 7)}{lbl(O, "O", 18, 14, GR)}</g>')
S(s, 'KONSEP', 'Pusat dan jejari bulatan',
  de(s, 'Pembahagi dua sama serenjang bagi sebarang perentas akan sentiasa bersilang di pusat bulatan.')
  + steps(s, ['Surih bentuk bulat pada sehelai kertas.', 'Bina dua perentas, PQ dan PR dari titik P bulatan itu.', 'Bina garisan pembahagi dua sama serenjang bagi perentas PQ dan PR.',
              'Titik persilangan dua garisan pembahagi dua sama serenjang ditandakan dengan O. Lukis satu garisan dari O ke lilitan bulatan dan namakannya sebagai OT.']),
  box(''.join(k), 'Pembahagi dua sama serenjang dua perentas bertemu di pusat O'))

U4, S4 = pt(68), pt(292)
T4 = (U4[0], CY)
P4, R4 = pt(157.4), pt(202.6)
Q4 = (P4[0], CY)
k = [circ(), ln(P4, R4, IMG, 3.5), ln(U4, S4, IMG, 3.5), ln(Q4, T4, AM, 3.5), dot(O), lbl(O, 'O', 0, -16), lbl(P4, 'P', -12, -14), lbl(R4, 'R', -12, 18), lbl(Q4, 'Q', -16, -12),
     lbl(U4, 'U', 12, -14), lbl(S4, 'S', 12, 18), lbl(T4, 'T', 16, -12), T(250, 450, 'Diameter = 26 cm, QT = 17 cm, US = 24 cm', TX, 16)]
S(s, 'CONTOH 5', 'Penyelesaian masalah',
  p('Seorang tukang besi diminta membina sebuah kerangka tingkap berbentuk bulatan. Tingkap berbentuk bulatan itu berdiameter 26 cm. Tiga batang besi, PR, US dan QT yang tidak sama panjang digunakan untuk menyokong tingkap tersebut. Hitung panjang PR.')
  + four(s, 'Jejari = 26 ÷ 2 = 13 cm. Hitung PR.', f'OT = {sq("OU² − UT²")}, OQ = QT − OT, PQ = {sq("OP² − OQ²")}, PR = PQ × 2',
         f'OT = {sq("13² − 12²")} = {sq("25")} = 5 cm. OQ = 17 − 5 = 12 cm. PQ = {sq("13² − 12²")} = 5 cm. PR = 5 + 5 = 10 cm', 'Maka, PR ialah 10 cm.'),
  box(''.join(k), 'Kerangka tingkap bulat dengan batang besi PR, US dan QT'))

# =====================================================================
# 5.3 LILITAN DAN LUAS BULATAN
# =====================================================================
s = '5.3'
k = [circ(GR), dot(O), ln(pt(180), pt(0), AM, 3.5), lbl(O, 'd', 0, -18, AM, 22),
     T(250, 430, 'Lilitan ÷ Diameter = π', GR, 22)]
S(s, 'KONSEP', 'Hubungan lilitan bulatan dengan diameter',
  de(s, '<b>Lilitan bulatan</b> ialah ukuran sekeliling bagi satu bulatan.')
  + p(f'Nilai nisbah lilitan kepada diameter, iaitu π suatu bulatan ialah 3.142 atau {PI}. &nbsp; {fr("Lilitan", "Diameter")} = π')
  + cards(card('LILITAN', 'lilitan = π × diameter = π<i>d</i>', '', GR), card('LILITAN', f'lilitan = π × 2 × jejari = 2π{J}', '', OBJ))
  + note('Diameter = 2 × Jejari. π dibaca sebagai "pai".', 'Ingat:'), box(''.join(k), 'Bulatan dengan diameter d'))

k = []
n = 8
for i in range(n):
    x0 = 70 + i * 45
    up = i % 2 == 0
    tip = (x0 + 22, 120) if not up else (x0 + 22, 300)
    base = [(x0, 300), (x0 + 45, 300)] if not up else [(x0, 120), (x0 + 45, 120)]
    k.append(f'<path d="M{tip[0]} {tip[1]} L{base[0][0]} {base[0][1]} Q{x0 + 22} {base[0][1] + (12 if not up else -12)} {base[1][0]} {base[1][1]} Z" fill="{GR}44" stroke="{GR}" stroke-width="2"/>')
k += [T(250, 345, 'tapak = ½ × lilitan = π' + 'j', TX, 18), T(40, 215, 'j', TX, 20), T(250, 420, 'luas bulatan = πj²', AM, 24)]
k = [x.replace('π' + 'j', 'π<tspan font-style="italic">j</tspan>').replace('πj²', 'π<tspan font-style="italic">j</tspan>²') for x in k]
S(s, 'KONSEP', 'Rumus luas bulatan',
  p('Semakin banyak sektor bulatan itu dibahagikan, semakin jelas bentuk segi empat tepat yang dihasilkan. Didapati bahawa luas bulatan = luas segi empat tepat')
  + steps(s, ['= tapak × tinggi', f'= {fr("1", "2")} × lilitan bulatan × tinggi', f'= {fr("1", "2")} × 2π{J} × {J} = π{J}²', f'<b>Maka, luas bulatan = π{J}²</b>']), box(''.join(k), 'Sektor bulatan disusun menjadi segi empat tepat'))

S(s, 'CONTOH 6', 'Menentukan lilitan bulatan',
  p(f'Hitung lilitan sebuah bulatan jika (a) diameter, <i>d</i> = 21 cm. (Guna π = {PI}) (b) jejari, {J} = 12.5 cm. (Guna π = 3.142)'),
  work([('(a)', ['Lilitan = π<i>d</i>', f'= {PI} × 21', '= 66 cm']), ('(b)', [f'Lilitan = 2π{J}', '= 2 × 3.142 × 12.5', '= 78.55 cm'])], s))

S(s, 'CONTOH 7', 'Menentukan diameter dan jejari',
  p(f'(a) Diberi lilitan sebuah bulatan ialah 132 cm. Hitung diameter, dalam cm, bulatan tersebut. (Guna π = {PI})')
  + p('(b) Diberi lilitan sebuah bulatan ialah 40.5 cm. Hitung jejari bulatan, dalam cm dan bundarkan kepada dua tempat perpuluhan. (Guna π = 3.142)'),
  work([('(a)', ['Lilitan = π<i>d</i>', f'132 = {PI} × <i>d</i>', f'<i>d</i> = 132 × {fr("7", "22")}', '<i>d</i> = 42 cm']),
        ('(b)', [f'Lilitan = 2π{J}', f'2 × 3.142 × {J} = 40.5', f'{J} = {fr("40.5", "6.284")}', f'{J} = 6.44 cm'])], s))

S(s, 'CONTOH 8', 'Menentukan luas bulatan',
  p(f'Hitung luas bulatan yang mempunyai (a) diameter 12 cm. (Guna π = {PI}) (b) jejari 14 cm. (Guna π = {PI})')
  + note(f'jejari, {J} = {fr("diameter", "2")}, diameter, <i>d</i> = 2{J}', 'Ingat:'),
  work([('(a)', [f'Luas = π{J}²', f'= {PI} × ({fr("12", "2")})²', '= 113.14 cm²']), ('(b)', [f'Luas = π{J}²', f'= {PI} × 14²', '= 616 cm²'])], s))

S(s, 'CONTOH 9', 'Jejari dan diameter daripada luas',
  p(f'Diberi luas bulatan ialah 154 cm². Hitung jejari dan diameter. (Guna π = {PI})'),
  work([('', [f'Luas = π{J}²', f'{PI} × {J}² = 154', f'{J}² = 154 × {fr("7", "22")}', f'{J}² = 49', f'{J} = {sq("49")}', f'{J} = 7 cm', 'Diameter = 2 × 7 = 14 cm'])], s))

S(s, 'CONTOH 10', 'Luas daripada lilitan',
  p(f'Diberi lilitan bulatan ialah 88 cm. Hitung luas bulatan. (Guna π = {PI})'),
  work([('', ['Lilitan = 88 cm', f'2π{J} = 88', f'2 × {PI} × {J} = 88', f'{J} = 88 × {fr("7", "44")}', f'{J} = 14 cm', f'Luas = π{J}² = {PI} × 14²', '= 616 cm²'])], s))

S(s, 'CONTOH 11', 'Lilitan daripada luas',
  p(f'Diberi luas bulatan ialah 38.5 cm². Hitung lilitan bulatan. (Guna π = {PI})'),
  work([('', [f'Luas = π{J}²', f'{PI} × {J}² = 38.5', f'{J}² = 38.5 × {fr("7", "22")}', f'{J}² = 12.25', f'{J} = {sq("12.25")} = 3.5 cm', f'Lilitan = 2π{J} = 2 × {PI} × 3.5', '= 22 cm'])], s))

k = [circ(GR, False), sector(50, 110, GR), dot(O), lbl(O, 'O', 0, 20), lbl(pt(80, R * .55), 'θ', 0, 0, AM, 22), arcpath(50, 110, AM, R, 7), lbl(pt(112), 'A', -14, -10), lbl(pt(48), 'B', 14, -10)]
S(s, 'KONSEP', 'Panjang lengkok suatu bulatan',
  de(s, 'Lengkok bulatan merupakan sebahagian daripada lilitan bulatan. Lengkok bulatan berkadaran dengan sudut pada pusat bulatan.')
  + cards(card('PANJANG LENGKOK', f'{fr("Panjang lengkok", "Lilitan bulatan")} = {fr("Sudut pada pusat", "360°")}', '', GR), card('MAKA', f'{fr("Panjang lengkok", f"2π{J}")} = {fr("θ", "360°")}', '', AM))
, box(''.join(k + [T(250, 425, 'Simbol θ dibaca "theta", ialah huruf Yunani', AX, 15), T(250, 447, 'yang digunakan untuk mewakili sudut.', AX, 15)]), 'Sektor dengan sudut θ dan lengkok AB'))

k = [circ(GR, False), sector(50, 130, GR), dot(O), lbl(O, 'O', 0, 20), lbl(pt(90, R * .45), '80°', 0, 0, AM, 18), arcpath(50, 130, AM, R, 7),
     lbl(pt(132), 'P', -14, -10), lbl(pt(48), 'Q', 14, -10), ln(O, pt(-60), TX, 2.5), lbl(pt(-60, R * .6), '21 cm', 34, 0, TX, 16)]
S(s, 'CONTOH 12', 'Panjang lengkok minor',
  p('Rajah di sebelah menunjukkan sebuah bulatan dengan jejari 21 cm dan berpusat di O. Hitung panjang lengkok minor PQ yang mencangkum 80° pada pusat. Tulis jawapan dalam dua tempat perpuluhan.')
  + pen(s, [f'{fr("Panjang lengkok", f"2π{J}")} = {fr("θ", "360°")}', f'Panjang lengkok = {fr("θ", "360°")} × 2π{J}', f'Panjang lengkok = {fr("80°", "360°")} × 2 × {PI} × 21', '= 29.33 cm'], False),
  box(''.join(k), 'Bulatan berjejari 21 cm dengan lengkok minor PQ'))

k = [circ(GR, False), sector(225, 315, OBJ), arcpath(-45, 225, AM, R, 7), dot(O), lbl(O, 'O', 0, -18), lbl(pt(270, R * .45), '90°', 0, 0, TX, 18),
     lbl(pt(225), 'R', -16, 14), lbl(pt(315), 'S', 16, 14)]
S(s, 'CONTOH 13', 'Panjang lengkok major',
  p('Rajah di sebelah menunjukkan sebuah bulatan dengan jejari 14 cm dan berpusat di O. ∠ROS ialah 90°. Hitung panjang lengkok major RS.')
  + pen(s, ['Sudut pada pusat = 360° − 90° = 270°', f'{fr("Panjang lengkok", f"2π{J}")} = {fr("θ", "360°")}', f'Panjang lengkok = {fr("270°", "360°")} × 2 × {PI} × 14', '= 66 cm']),
  box(''.join(k), 'Bulatan dengan lengkok major RS'))

S(s, 'CONTOH 14', 'Jejari daripada panjang lengkok',
  p('Diberi panjang lengkok suatu bulatan ialah 22 cm dan sudut pada pusat bulatan ialah 60°. Hitung panjang, dalam cm, jejari bulatan itu.'),
  work([('', [f'{fr("θ", "360°")} = {fr("Panjang lengkok", f"2π{J}")}', f'2π{J} = Panjang lengkok × {fr("360°", "θ")}', f'2 × {PI} × {J} = 22 × {fr("360°", "60°")}',
               f'{J} = 22 × 6 × {fr("7", "22")} × {fr("1", "2")}', f'{J} = 21 cm'])], s))

k = [circ(GR, False), sector(30, 100, GR), dot(O), lbl(O, 'O', 0, 20), lbl(pt(65, R * .55), 'θ', 0, 0, AM, 22), lbl(pt(102), 'A', -14, -10), lbl(pt(28), 'B', 14, -10)]
S(s, 'KONSEP', 'Luas sektor bulatan',
  de(s, 'Luas sektor bulatan merupakan rantau yang dibatasi oleh satu lengkok dan dua jejari. Luas sektor bulatan adalah berkadaran dengan luas bulatan.')
  + cards(card('LUAS SEKTOR', f'{fr("Luas sektor bulatan", "Luas bulatan")} = {fr("Sudut pada pusat", "360°")}', '', GR), card('MAKA', f'{fr("Luas sektor AOB", f"π{J}²")} = {fr("θ", "360°")}', '', AM)),
  box(''.join(k), 'Sektor AOB dengan sudut θ'))

k = [circ(GR, False), sector(110, 245, GR), dot(O), lbl(O, 'O', 16, 4), lbl(pt(178, R * .5), '135°', 0, 0, AM, 18), lbl(pt(112), 'M', -14, -10), lbl(pt(245), 'N', -14, 16),
     ln(O, pt(0), TX, 2.5), lbl(pt(0, R * .55), '14 mm', 0, -14, TX, 16)]
S(s, 'CONTOH 15', 'Luas sektor minor',
  p('Rajah di sebelah menunjukkan sebuah bulatan dengan pusat O dan jejari 14 mm. Hitung luas sektor minor MON.')
  + pen(s, [f'{fr("Luas sektor", f"π{J}²")} = {fr("θ", "360°")}', f'Luas sektor MON = {fr("135°", "360°")} × {PI} × 14²', '= 231 mm²']),
  box(''.join(k), 'Bulatan berjejari 14 mm dengan sektor minor MON'))

S(s, 'CONTOH 16', 'Sudut daripada luas sektor',
  p('Diberi luas sektor QOP ialah 77 cm² dan jejari 14 cm. Hitung nilai θ.'),
  work([('', [f'{fr("Luas sektor", f"π{J}²")} = {fr("θ", "360°")}', f'{fr("θ", "360°")} = {fr("77", f"{PI} × 14²")}', f'θ = {fr("77", f"{PI} × 14 × 14")} × 360°', 'θ = 45°'])], s))

k = [f'<rect x="60" y="80" width="380" height="270" fill="{GR}22" stroke="{GR}" stroke-width="3"/>']
for (x, y, a1) in [(60, 80, 270), (440, 80, 180), (440, 350, 90), (60, 350, 0)]:
    r_ = 55
    p1 = (x + r_ * math.cos(math.radians(a1)), y - r_ * math.sin(math.radians(a1))); p2 = (x + r_ * math.cos(math.radians(a1 + 90)), y - r_ * math.sin(math.radians(a1 + 90)))
    k.append(f'<path d="M{x} {y} L{f(p1[0])} {f(p1[1])} A{r_} {r_} 0 0 0 {f(p2[0])} {f(p2[1])} Z" fill="{PK}55" stroke="{PK}" stroke-width="2.5"/>')
k += [f'<circle cx="250" cy="215" r="75" fill="{OBJ}44" stroke="{OBJ}" stroke-width="2.5"/>', T(250, 385, '70 m', TX, 18), T(30, 220, '50 m', TX, 18), T(250, 222, 'kolam', OBJ, 16)]
Q17 = p(f'Sebuah taman rekreasi berbentuk segi empat tepat dengan panjangnya 70 m dan lebarnya 50 m. Setiap penjuru taman yang berbentuk sukuan bulatan berjejari 7 m akan ditanam dengan pokok bunga dan di tengah-tengah taman akan dibina sebuah kolam ikan yang berbentuk bulat dengan diameter 28 m. Kawasan yang lain akan ditanam dengan rumput karpet. Hitung luas kawasan yang ditanam dengan rumput karpet. (Guna π = {PI})')
S(s, 'CONTOH 17', 'Penyelesaian masalah', Q17, box(''.join(k), 'Taman segi empat tepat dengan empat sukuan bulatan dan kolam'))
S(s, 'CONTOH 17', 'Penyelesaian masalah (sambungan)',
  four(s, 'Jejari sukuan bulatan = 7 m. Taman berbentuk segi empat tepat, panjang = 70 m, lebar = 50 m. Diameter kolam ikan = 28 m. Hitung luas kawasan yang ditanam dengan rumput karpet.',
       f'Luas taman rekreasi = panjang × lebar. Luas tanaman bunga = 4 × {fr("1", "4")} × π{J}². Luas kolam ikan = π{J}². Kawasan rumput karpet = luas taman − luas tanaman bunga − luas kolam ikan',
       'Lihat pengiraan di sebelah.', 'Maka, kawasan yang ditanam dengan rumput karpet ialah 2 730 m².'),
  work([('(i)', ['Luas taman rekreasi = 70 × 50 = 3 500 m²']), ('(ii)', [f'Luas tanaman bunga = 4 × {fr("1", "4")} × {PI} × 7²', '= 154 m²']),
        ('(iii)', [f'Luas kolam ikan = {PI} × 14²', '= 616 m²']), ('', ['3 500 m² − 154 m² − 616 m² = 2 730 m²'])], s))

OUTFILE = os.path.join(HERE, '..', '..', 'circmotion', 'slides.js')
HEAD = '/* Nota Bab 5 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
