"""Bab 4 T2 Poligon: nota ikut buku teks (ayat buku, nombor ditukar)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())
SUBS = [{"no": "4.1", "name": "Poligon Sekata", "col": "#38BDF8"}, {"no": "4.2", "name": "Sudut Pedalaman & Peluaran", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def pen(sub, items):
    return p('<b>Penyelesaian:</b>') + steps(sub, items)


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def work(blocks, sub):
    c = COL[sub]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:18px 22px;'
            'display:flex;flex-direction:column;gap:10px;font-size:19px;line-height:1.45">' + ''.join(out) + '</div>')


def ticks(pts, col=TX, n=1):
    """tanda sisi sama pada titik tengah setiap sisi."""
    out = []
    for i in range(len(pts)):
        (x1, y1), (x2, y2) = pts[i], pts[(i + 1) % len(pts)]
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dx, dy = x2 - x1, y2 - y1; L = (dx * dx + dy * dy) ** .5
        nx, ny = -dy / L * 7, dx / L * 7
        for j in range(n):
            ox, oy = dx / L * (j - (n - 1) / 2) * 5, dy / L * (j - (n - 1) / 2) * 5
            out.append(f'<line x1="{f(mx + ox - nx)}" y1="{f(my + oy - ny)}" x2="{f(mx + ox + nx)}" y2="{f(my + oy + ny)}" stroke="{col}" stroke-width="2.5"/>')
    return ''.join(out)


def lab(x, y, t, col=TX, s=17):
    return T(x, y, t, col, s)


# =====================================================================
# 4.1 POLIGON SEKATA
# =====================================================================
s = '4.1'
k = [T(130, 50, 'Poligon sekata', OBJ, 18), T(370, 50, 'Poligon tak sekata', IMG, 18)]
for pts in [reg(80, 140, 50, 3), reg(190, 140, 50, 4, -45), reg(80, 290, 50, 5), reg(190, 290, 50, 6)]:
    k.append(P(pts, OBJ) + ticks(pts))
k.append(P([(300, 180), (410, 180), (330, 100)], IMG)); k.append(P([(300, 320), (440, 320), (440, 260), (300, 260)], IMG))
k.append(P([(330, 420), (430, 420), (450, 370), (380, 340), (320, 370)], IMG))
S(s, 'DEFINISI', 'Poligon sekata',
  de(s, '<b>Poligon sekata</b> ialah poligon yang semua sisinya sama panjang dan semua sudut pedalamannya sama saiz.')
  + bul(s, ['Poligon sekata mempunyai sudut pedalaman yang kongruen.', '<b>Poligon tak sekata</b> pula ialah poligon yang tidak semua sisinya sama panjang.'])
  + note('Poligon ialah bentuk tertutup pada satu satah yang dibatasi tiga atau lebih garis lurus sebagai sisi-sisinya.', 'Imbas kembali:'),
  box(''.join(k), 'Contoh poligon sekata dan poligon tak sekata'))

k = []
cells = [(90, 120), (250, 120), (410, 120), (90, 320), (250, 320), (410, 320)]
shapes = [[(40, 160), (140, 160), (60, 80)], [(195, 155), (305, 155), (305, 90), (195, 90)], reg(410, 120, 52, 6, 0),
          reg(90, 320, 52, 4, -45), [(205, 360), (295, 360), (295, 310), (250, 270), (205, 310)], reg(410, 320, 52, 5)]
reg_ = [0, 0, 1, 1, 0, 1]
for (cx, cy), pts, r, lb in zip(cells, shapes, reg_, 'abcdef'):
    k.append(T(cx - 70, cy - 75, f'({lb})', AX, 16)); k.append(P(pts, PK) + (ticks(pts) if r else ''))
    k.append(f'<g class="rv">{T(cx, cy + 85, "Sekata" if r else "Tak sekata", GR if r else IMG, 16)}</g>')
S(s, 'CONTOH 1', 'Poligon sekata atau tak sekata?',
  p('Antara rajah berikut, yang manakah merupakan sebuah poligon sekata atau poligon tak sekata?')
  + pen(s, ['(a) Poligon tak sekata &nbsp; (b) Poligon tak sekata', '(c) Poligon sekata &nbsp; (d) Poligon sekata', '(e) Poligon tak sekata &nbsp; (f) Poligon sekata']),
  box(''.join(k), 'Enam poligon (a) hingga (f)'))

k = []
pent = reg(130, 190, 95, 5)
k.append(P(pent, OBJ))
for i, (x, y) in enumerate(pent):
    ox, oy = 2 * 130 - x, 2 * 190 - y
    k.append(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(130 + (ox - 130) * .85)}" y2="{f(190 + (oy - 190) * .85)}" stroke="{AM}" stroke-width="2" stroke-dasharray="7 5"/>')
sq = reg(370, 190, 95, 4, -45)
k.append(P(sq, OBJ))
for (x1, y1, x2, y2) in [(370, 100, 370, 280), (280, 190, 460, 190), (303, 123, 437, 257), (437, 123, 303, 257)]:
    k.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{AM}" stroke-width="2" stroke-dasharray="7 5"/>')
k += [T(130, 330, '5 sisi, 5 paksi', TX, 17), T(370, 330, '4 sisi, 4 paksi', TX, 17)]
S(s, 'KONSEP', 'Menentukan paksi simetri',
  de(s, 'Bilangan paksi simetri bagi sebuah poligon sekata adalah sama dengan bilangan sisi poligon tersebut.')
  + bul(s, ['Bagi poligon tak sekata bilangan paksi simetri harus diterokai dengan kaedah lipatan.']),
  box(''.join(k), 'Pentagon sekata dengan 5 paksi simetri dan segi empat sama dengan 4 paksi simetri'))

k = [f'<line x1="90" y1="330" x2="410" y2="330" stroke="{OBJ}" stroke-width="4"/>', T(80, 360, 'A', TX, 20, fam=HEAD), T(420, 360, 'B', TX, 20, fam=HEAD), T(250, 360, '6 cm', AX, 16),
     f'<g class="rv"><path d="M 410 330 A 320 320 0 0 0 216 36" fill="none" stroke="{AM}" stroke-width="2.5"/></g>',
     f'<g class="rv"><path d="M 90 330 A 320 320 0 0 1 284 36" fill="none" stroke="{AM}" stroke-width="2.5"/></g>',
     f'<g class="rv"><line x1="90" y1="330" x2="250" y2="53" stroke="{GR}" stroke-width="4"/><line x1="410" y1="330" x2="250" y2="53" stroke="{GR}" stroke-width="4"/>{T(250, 40, "C", TX, 20, fam=HEAD)}</g>']
S(s, 'KONSEP', 'Membina segi tiga sama sisi',
  p('Poligon sekata boleh dibina dengan menggunakan pelbagai kaedah. Bina <b>segi tiga sama sisi</b> dengan panjang sisi 6 cm.')
  + steps(s, ['(a) Bina tembereng garis AB dengan panjang 6 cm.', '(b) Bina lengkok dengan jejari 6 cm dari titik A.',
              '(c) Bina lengkok dengan jejari 6 cm dari titik B supaya bersilang dengan lengkok pertama tadi. Titik persilangan dilabel C.', '(d) Lukiskan garisan dari A ke C dan B ke C. Terhasillah segi tiga sama sisi.']),
  box(''.join(k), 'Pembinaan segi tiga sama sisi dengan jangka lukis'))

k = [f'<line x1="110" y1="360" x2="390" y2="360" stroke="{OBJ}" stroke-width="4"/>', T(100, 390, 'A', TX, 20, fam=HEAD), T(400, 390, 'B', TX, 20, fam=HEAD), T(250, 390, '5 cm', AX, 16),
     f'<g class="rv"><line x1="110" y1="380" x2="110" y2="40" stroke="{AX}" stroke-width="2.5"/></g>',
     f'<g class="rv"><path d="M 150 80 A 280 280 0 0 0 70 80" fill="none" stroke="{AM}" stroke-width="2.5"/>{T(90, 70, "D", TX, 20, fam=HEAD)}</g>',
     f'<g class="rv"><path d="M 330 60 A 280 280 0 0 1 430 120" fill="none" stroke="{AM}" stroke-width="2.5"/><path d="M 350 120 A 280 280 0 0 0 420 40" fill="none" stroke="{AM}" stroke-width="2.5"/>{T(410, 70, "C", TX, 20, fam=HEAD)}</g>',
     f'<g class="rv"><path d="M 110 80 L 390 80 L 390 360" fill="none" stroke="{GR}" stroke-width="4"/></g>']
S(s, 'KONSEP', 'Membina segi empat sama',
  p('Bina <b>segi empat sama</b> bersisi 5 cm.')
  + steps(s, ['(a) Bina tembereng garis AB dengan panjang 5 cm.', '(b) Bina satu garis serenjang dengan AB yang melalui titik A.',
              '(c) Bina satu lengkok berjarak 5 cm dari A supaya bersilang dengan garis serenjang itu. Titik persilangan dilabel D.',
              '(d) Bina dua lengkok berjarak 5 cm dari B dan D supaya kedua-dua lengkok itu bersilang. Titik persilangan dilabel C.']),
  box(''.join(k), 'Pembinaan segi empat sama dengan jangka lukis'))

hexa = reg(250, 220, 150, 6, 180)
k = [f'<circle cx="250" cy="220" r="150" fill="none" stroke="{OBJ}" stroke-width="3"/>', f'<circle cx="250" cy="220" r="4" fill="{TX}"/>']
for i, ((x, y), lb) in enumerate(zip(hexa, 'ABCDEF')):
    dx, dy = (x - 250) * .16, (y - 220) * .16
    item = f'<circle cx="{f(x)}" cy="{f(y)}" r="5" fill="{AM}"/>' + T(x + dx, y + dy + 7, lb, TX, 20, fam=HEAD)
    k.append(item if i == 0 else f'<g class="rv">{item}</g>')
k.append(f'<g class="rv">{P(hexa, GR)}</g>')
k.append(T(250, 410, 'Tip: Poligon sekata juga boleh dibina dengan kaedah membahagi', AM, 14)); k.append(T(250, 430, 'sudut sama saiz di pusat bulatan mengikut bilangan sisi.', AM, 14))
S(s, 'KONSEP', 'Membina heksagon sekata',
  p('Bina sebuah <b>heksagon</b> sekata bersisi 3 cm.')
  + steps(s, ['(a) Bina sebuah bulatan berjejari 3 cm. Tandakan satu titik pada lilitan dan label sebagai A.', '(b) Bina satu lengkok berjarak 3 cm dari A dan tandakannya sebagai B.',
              '(c) Bina lengkok berjarak 3 cm dari B dan tandakannya sebagai C dan ulang langkah tersebut sehingga F.', '(d) Lukiskan garisan AB, BC, CD, DE, EF dan FA untuk membentuk sebuah heksagon sekata.']),
  box(''.join(k), 'Pembinaan heksagon sekata dalam bulatan'))

# =====================================================================
# 4.2 SUDUT PEDALAMAN DAN SUDUT PELUARAN
# =====================================================================
s = '4.2'
A_, B_, C_ = (110, 330), (390, 330), (230, 110)
k = [P([A_, B_, C_], OBJ),
     f'<line x1="390" y1="330" x2="470" y2="330" stroke="{IMG}" stroke-width="3" stroke-dasharray="8 6"/>',
     f'<line x1="230" y1="110" x2="270" y2="37" stroke="{IMG}" stroke-width="3" stroke-dasharray="8 6"/>',
     f'<line x1="110" y1="330" x2="30" y2="330" stroke="{IMG}" stroke-width="3" stroke-dasharray="8 6"/>',
     T(150, 318, 'b', OBJ, 20), T(352, 318, 'c', OBJ, 20), T(232, 150, 'a', OBJ, 20),
     T(70, 318, 'y', IMG, 20), T(430, 318, 'z', IMG, 20), T(270, 95, 'x', IMG, 20)]
S(s, 'DEFINISI', 'Sudut pedalaman dan sudut peluaran',
  de(s, '<b>Sudut pedalaman</b> ialah sudut yang terbentuk oleh dua sisi bersebelahan di dalam sesuatu poligon.')
  + de(s, '<b>Sudut peluaran</b> ialah sudut yang terbentuk apabila satu sisi poligon dipanjangkan. Penggenap kepada sudut pedalaman.')
  + bul(s, ['Sudut <i>a</i>, <i>b</i> dan <i>c</i> ialah sudut pedalaman. Sudut <i>x</i>, <i>y</i> dan <i>z</i> ialah sudut peluaran.', 'Sudut peluaran + Sudut pedalaman = 180°']),
  box(''.join(k), 'Segi tiga dengan sudut pedalaman a, b, c dan sudut peluaran x, y, z'))

th = 'padding: 9px 12px; text-align: left; font-size: 18px; border-bottom: 2px solid #22304A; color: #94A3B8'
td = 'padding: 8px 12px; font-size: 18px; font-weight: 600; border-bottom: 1px solid #22304A'
rows = [('Segi tiga', 3, 1, '1 × 180° = 180°'), ('Segi empat', 4, 2, '2 × 180° = 360°'), ('Pentagon', 5, 3, '3 × 180° = 540°'), ('Heksagon', 6, 4, '4 × 180° = 720°')]
tab = (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: #131C2E"><thead><tr><th style="{th}">Poligon</th><th style="{th}">Bilangan sisi (<i>n</i>)</th><th style="{th}">Bilangan segi tiga</th><th style="{th}">Hasil tambah sudut pedalaman</th></tr></thead><tbody>'
       + ''.join(f'<tr><td style="{td}">{a}</td><td style="{td}">{b}</td><td style="{td}">{c}</td><td class="rv" style="{td}; color: #34D399">{d}</td></tr>' for a, b, c, d in rows) + '</tbody></table></div>')
S(s, 'KONSEP', 'Hasil tambah sudut pedalaman',
  p('Terdapat perkaitan antara bilangan sisi sebuah poligon dengan hasil tambah sudut pedalamannya.') + tab
  + de(s, 'Hasil tambah sudut pedalaman suatu poligon = (<i>n</i> – 2) × 180°.'), '')

S(s, 'CONTOH 2', 'Bilangan segi tiga dalam poligon',
  p('Nyatakan bilangan segi tiga yang terbentuk bagi setiap poligon yang berikut. (a) Poligon 15 sisi (b) Poligon 20 sisi')
  + pen(s, ['(a) Bilangan segi tiga = 15 – 2 = 13', '(b) Bilangan segi tiga = 20 – 2 = 18'])
  + note('Poligon 15 sisi dinamakan pentadekagon dan poligon 20 sisi dinamakan ikosagon.', 'Tahukah anda?'),
  box(''.join([P(reg(250, 220, 170, 15), OBJ)] + [f'<line x1="{f(reg(250, 220, 170, 15)[0][0])}" y1="{f(reg(250, 220, 170, 15)[0][1])}" x2="{f(x)}" y2="{f(y)}" stroke="{AM}" stroke-width="1.5"/>' for x, y in reg(250, 220, 170, 15)[2:-1]]),
      'Poligon 15 sisi dibahagi kepada segi tiga dari satu bucu'))

k = [T(30, 40, '(a)', AX, 17), T(270, 40, '(b)', AX, 17)]
pa = [(40, 330), (200, 330), (230, 200), (140, 100), (30, 190)]
k.append(P(pa, OBJ)); k += [lab(62, 315, '90°'), lab(180, 315, '70°'), lab(205, 210, '125°'), lab(140, 135, '105°'), lab(55, 200, 'x', AM, 20)]
pb = [(280, 330), (460, 330), (430, 130), (300, 170)]
k.append(P(pb, IMG)); k += [lab(302, 315, '90°'), lab(437, 315, '65°'), lab(418, 160, '120°'), lab(312, 195, 'x', AM, 20)]
k.append(T(250, 410, 'Rajah tidak mengikut skala', AX, 15))
S(s, 'CONTOH 3', 'Mencari sudut pedalaman',
  p('Hitung nilai <i>x</i> bagi poligon berikut.')
  + pen(s, ['(a) Hasil tambah sudut pedalaman = (<i>n</i> – 2) × 180° = (5 – 2) × 180° = 540°', 'Maka, <i>x</i> + 105° + 125° + 70° + 90° = 540°, <i>x</i> + 390° = 540°, <i>x</i> = 150°',
            '(b) Hasil tambah sudut pedalaman = (4 – 2) × 180° = 360°', 'Maka, <i>x</i> + 120° + 65° + 90° = 360°, <i>x</i> + 275° = 360°, <i>x</i> = 85°']),
  box(''.join(k), 'Pentagon dan sisi empat dengan sudut pedalaman'))

k = []
hexa = reg(250, 215, 140, 6)
k.append(P(hexa, OBJ))
for i in range(6):
    (x1, y1), (x2, y2) = hexa[i], hexa[(i + 1) % 6]
    k.append(f'<line x1="{f(x2)}" y1="{f(y2)}" x2="{f(x2 + (x2 - x1) * .45)}" y2="{f(y2 + (y2 - y1) * .45)}" stroke="{IMG}" stroke-width="3" stroke-dasharray="8 6"/>')
k.append(T(250, 225, '60° × 6 = 360°', IMG, 20))
S(s, 'KONSEP', 'Hasil tambah sudut peluaran',
  de(s, 'Hasil tambah sudut peluaran sebuah poligon ialah 360°.')
  + note('Konjektur ialah proposisi atau teorem yang kelihatan benar. Keputusan konjektur tidak dibuktikan secara formal.', 'Tip:'),
  box(''.join(k), 'Heksagon dengan sudut peluaran'))

k = [T(20, 40, '(a)', AX, 16), P([(40, 300), (220, 300), (120, 150)], OBJ), f'<line x1="220" y1="300" x2="262" y2="300" stroke="{IMG}" stroke-width="3" stroke-dasharray="7 5"/>',
     f'<line x1="120" y1="150" x2="146" y2="111" stroke="{IMG}" stroke-width="3" stroke-dasharray="7 5"/>', f'<line x1="40" y1="300" x2="5" y2="300" stroke="{IMG}" stroke-width="3" stroke-dasharray="7 5"/>',
     lab(240, 288, '150°', IMG, 15), lab(22, 288, '125°', IMG, 15), lab(150, 135, 'x', AM, 18), T(270, 40, '(b)', AX, 16)]
pg = reg(375, 150, 85, 5)
A5, B5, C5, D5, E5 = pg
def meet(p1, p2, p3, p4):
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p1, p2, p3, p4
    d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
    t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d
    return (x1 + t * (x2 - x1), y1 + t * (y2 - y1))
F5 = meet(B5, C5, E5, D5)
k += [P(pg, AM), f'<line x1="{f(C5[0])}" y1="{f(C5[1])}" x2="{f(F5[0])}" y2="{f(F5[1])}" stroke="{AM}" stroke-width="3"/>', f'<line x1="{f(D5[0])}" y1="{f(D5[1])}" x2="{f(F5[0])}" y2="{f(F5[1])}" stroke="{AM}" stroke-width="3"/>']
for (x, y), lb in zip(pg + [F5], 'ABCDEF'):
    k.append(T(375 + (x - 375) * 1.18, 150 + (y - 150) * 1.18 + 6 if lb != 'F' else y + 26, lb, TX, 17, fam=HEAD))
k += [lab(F5[0], F5[1] - 18, 'x', GR, 16), T(250, 440, 'Rajah tidak mengikut skala', AX, 14)]
S(s, 'CONTOH 4', 'Mencari sudut peluaran',
  p('(a) Hitung nilai <i>x</i> bagi rajah di sebelah. (b) ABCDE ialah sebuah pentagon sekata. BCF dan EDF ialah garis lurus. Hitung nilai <i>x</i> pada titik F.')
  + pen(s, ['(a) Hasil tambah sudut peluaran = 360°. <i>x</i> + 150° + 125° = 360°, <i>x</i> + 275° = 360°, <i>x</i> = 85°', f'(b) ∠FCD = {fr("360°", "5")} = 72°, <i>x</i> = 180° − 72° − 72° = 36°'])
  + note(f'Sudut peluaran poligon sekata = {fr("360°", "<i>n</i>")}', 'Tip:'),
  box(''.join(k), 'Segi tiga dengan dua sudut peluaran'))

S(s, 'KONSEP', 'Sudut pedalaman, sudut peluaran dan bilangan sisi',
  cards(card('JUMLAH SUDUT PEDALAMAN', '(<i>n</i> − 2) × 180°', 'Bilangan segi tiga × 180°', OBJ),
          card('SUDUT PEDALAMAN', f'{fr("jumlah sudut pedalaman", "bilangan sisi")} atau 180° − sudut peluaran', '', IMG),
          card('SUDUT PELUARAN', f'{fr("360°", "bilangan sisi")} atau 180° − sudut pedalaman', '', GR)), '')

S(s, 'CONTOH 5', 'Sudut pedalaman poligon sekata',
  p('Hitung nilai sudut pedalaman bagi sebuah oktagon sekata.'),
  work([('', ['Bilangan sisi oktagon sekata, <i>n</i> = 8', 'Hasil tambah sudut pedalaman = (<i>n</i> − 2) × 180°', '= (8 − 2) × 180°', '= 6 × 180°', '= 1 080°',
               f'Maka, sudut pedalaman = {fr("Hasil tambah sudut pedalaman", "Bilangan sisi")}', f'= {fr("1 080°", "8")}', '= 135°'])], s))

hp = reg(250, 230, 150, 7)
k = [P(hp, OBJ)]
labs = ['35° + b', 'b', '55°', '40°', '20°', '50°', '40°']
for i in range(7):
    (x1, y1), (x2, y2) = hp[i], hp[(i + 1) % 7]
    ex, ey = x2 + (x2 - x1) * .38, y2 + (y2 - y1) * .38
    k.append(f'<line x1="{f(x2)}" y1="{f(y2)}" x2="{f(ex)}" y2="{f(ey)}" stroke="{IMG}" stroke-width="2.5" stroke-dasharray="7 5"/>')
    vx, vy = (x2 - 250) * 1.22 + 250, (y2 - 230) * 1.22 + 230
    k.append(T(vx, vy + 6, labs[(i + 1) % 7].replace('b', '𝑏'), AM, 16))
k.append(T(250, 455, 'Rajah tidak mengikut skala', AX, 14))
S(s, 'CONTOH 6', 'Sudut peluaran dengan ungkapan',
  p('Hitung nilai <i>b</i> bagi rajah di sebelah.')
  + pen(s, ['360° = (35° + <i>b</i> + <i>b</i> + 55° + 40° + 20° + 50° + 40°)', '360° = 240° + 2<i>b</i>', '2<i>b</i> = 360° − 240° = 120°', '<i>b</i> = 60°']),
  box(''.join(k), 'Heptagon dengan tujuh sudut peluaran'))

S(s, 'CONTOH 7', 'Sudut peluaran poligon sekata',
  p('Hitung nilai sudut peluaran bagi sebuah dekagon sekata.'),
  work([('', ['Bilangan sisi sebuah dekagon sekata, <i>n</i> = 10', 'Hasil tambah sudut peluaran = 360°', f'Maka, sudut peluaran = {fr("360°", "10")}', '= 36°'])], s))

S(s, 'CONTOH 8', 'Bilangan sisi poligon sekata',
  p('Hitung bilangan sisi sebuah poligon sekata berikut apabila diberi nilai sudut pedalaman. (a) 120° (b) 160°'),
  work([('(a)', ['Sudut peluaran = 180° − 120° = 60°', f'Bilangan sisi, <i>n</i> = {fr("360°", "sudut peluaran")} = {fr("360°", "60°")}', '<i>n</i> = 6']),
        ('(b)', ['Sudut peluaran = 180° − 160° = 20°', f'Bilangan sisi, <i>n</i> = {fr("360°", "20°")}', '<i>n</i> = 18'])], s))

hx = reg(250, 220, 160, 6)
Q, R_, S_, T_, U, P_ = hx[0], hx[1], hx[2], hx[3], hx[4], hx[5]
k = [P(hx, OBJ), f'<line x1="{f(U[0])}" y1="{f(U[1])}" x2="{f(Q[0])}" y2="{f(Q[1])}" stroke="{AM}" stroke-width="2.5"/>',
     f'<line x1="{f(R_[0])}" y1="{f(R_[1])}" x2="{f(T_[0])}" y2="{f(T_[1])}" stroke="{AM}" stroke-width="2.5"/>']
for (x, y), lb in zip(hx, 'QRSTUP'):
    k.append(T(250 + (x - 250) * 1.14, 220 + (y - 220) * 1.14 + 7, lb, TX, 20, fam=HEAD))
k += [T(P_[0] + 26, P_[1] + 8, 'y', IMG, 20), T(Q[0] - 40, Q[1] + 42, 'x', GR, 20), T(R_[0] - 12, R_[1] + 52, 'z', GR, 20)]
S(s, 'CONTOH 9', 'Penyelesaian masalah',
  p('Rajah di sebelah ialah heksagon sekata daripada corak pada sebiji bola sepak. (a) Hitung sudut <i>y</i>. (b) Hitung perbezaan antara <i>y</i> dengan (<i>x</i> + <i>z</i>).')
  + four(s, 'Menghitung sudut <i>y</i> menggunakan rumus (<i>n</i> − 2) × 180° ÷ <i>n</i>.',
         f'(a) <i>y</i> = {fr("(6 − 2) × 180°", "6")} = 120° (b) <i>x</i> = <i>z</i> = {fr("180° − 120°", "2")} = 30°',
         '(b) <i>y</i> − (<i>x</i> + <i>z</i>) = 120° − (30° + 30°) = 60°', '(a) <i>y</i> = 120° (b) 60°'),
  box(''.join(k), 'Heksagon sekata PQRSTU dengan pepenjuru UQ dan RT'))

OUTFILE = os.path.join(HERE, '..', '..', 'poligon', 'slides.js')
HEAD = '/* Nota Bab 4 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
