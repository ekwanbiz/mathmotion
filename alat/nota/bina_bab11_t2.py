"""Bab 11 versi 4: maksud, sifat, rumus DAN contoh soalan ikut ayat buku teks T2 (nombor ditukar)."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, 'helpers.py')).read())


def pen(items):
    """Penyelesaian gaya buku: senarai baris yang muncul satu demi satu."""
    return p('<b>Penyelesaian:</b>') + steps(CUR[0], items)


CUR = ['11.1']


def four(sub, a, b, c, d):
    return steps(sub, [f'<b>Memahami masalah:</b> {a}', f'<b>Merancang strategi:</b> {b}', f'<b>Melaksanakan strategi:</b> {c}', f'<b>Membuat kesimpulan:</b> {d}'])


def panels(n, labels, marks=None):
    """kotak panel (a)(b)(c) dalam 500x470."""
    out = []
    w = 460 / n
    for i in range(n):
        x = 20 + i * w
        out.append(f'<rect x="{f(x + 4)}" y="60" width="{f(w - 8)}" height="330" rx="16" fill="none" stroke="{GRID}" stroke-width="2"/>')
        out.append(T(x + 22, 88, f'({labels[i]})', AX, 18))
        if marks:
            ok = marks[i]
            out.append(f'<g class="rv">{T(x + w / 2, 425, "Ya" if ok else "Tidak", GR if ok else "#F87171", 20)}</g>')
    return out


# =====================================================================
# 11.1 TRANSFORMASI
# =====================================================================
s = CUR[0] = '11.1'
g = Plane(0, 8, 0, 7, aria='Sisi empat ABCD digerakkan 4 unit ke kanan dan 3 unit ke atas menjadi A′B′C′D′')
O_ = [(1, 1), (3, 1), (3, 3), (1, 4)]; I_ = [(x + 4, y + 3) for x, y in O_]
g.poly(O_, OBJ, labels=['A', 'B', 'C', 'D']); g.poly(I_, IMG, dash=True, labels=['A′', 'B′', 'C′', 'D′'])
g.line((2.1, 2.3), (5.7, 5.0), TX, 3, dash=True, arrow=True)
S(s, 'DEFINISI', 'Transformasi',
  de(s, '<b>Transformasi</b> merupakan proses mengubah kedudukan, orientasi atau saiz imej suatu objek melalui translasi, pantulan dan putaran.')
  + bul(s, ['Sebelum transformasi berlaku, bentuk rajah asal dinamakan <b>objek</b>. Selepas transformasi, bentuk itu dinamakan <b>imej</b>.',
            'Transformasi merupakan padanan suatu titik pada suatu satah. Apabila objek bergerak dalam suatu transformasi, setiap titik objek itu mengikut corak pergerakan yang sama.',
            'Rajah di sebelah merupakan pergerakan objek ABCD ke imej A′B′C′D′ dengan pergerakan empat unit ke kanan dan tiga unit ke atas.']), g.svg())

pan = []
boxes = [(20, 30), (260, 30), (20, 250), (260, 250)]
for (bx, by), lb in zip(boxes, 'abcd'):
    pan.append(f'<rect x="{bx}" y="{by}" width="220" height="190" rx="16" fill="none" stroke="{GRID}" stroke-width="2"/>')
    pan.append(T(bx + 18, by + 28, f'({lb})', AX, 18))
pan.append(P([(50, 190), (110, 190), (50, 110)], OBJ)); pan.append(P([(140, 160), (200, 160), (140, 80)], IMG, True))
pan.append(P([(300, 200), (300, 100), (350, 125), (300, 150)], OBJ)); pan.append(P([(420, 200), (420, 100), (370, 125), (420, 150)], IMG, True))
pan.append(P([(50, 400), (100, 400), (100, 350), (50, 350)], OBJ)); pan.append(P([(130, 400), (225, 400), (225, 370), (130, 370)], IMG, True))
pan.append(P([(290, 410), (350, 410), (290, 340)], OBJ)); pan.append(P([(380, 410), (450, 410), (440, 340), (390, 350)], IMG, True))
S(s, 'CONTOH 1', 'Mengenal pasti transformasi',
  p('Antara berikut, yang manakah menunjukkan transformasi dan mengapa?')
  + pen(['(a) Transformasi kerana tidak mengubah rupa bentuk.', '(b) Transformasi kerana hanya berubah kedudukan dan tidak berubah bentuk.',
         '(c) Bukan transformasi kerana berubah rupa bentuk.', '(d) Bukan transformasi kerana berubah rupa bentuk.']),
  box(''.join(pan), 'Empat pasang objek dan imej (a) hingga (d)'))

k = []
k.append(P([(40, 330), (170, 330), (40, 170)], OBJ)); k.append(T(90, 370, 'A', OBJ, 20, fam=HEAD))
k.append(P([(230, 200), (390, 200), (230, 330)], IMG, True)); k.append(T(290, 370, 'B', IMG, 20, fam=HEAD))
k.append(P([(330, 120), (395, 120), (330, 40)], PK, True)); k.append(T(420, 90, 'C', PK, 20, fam=HEAD))
S(s, 'DEFINISI', 'Kekongruenan',
  de(s, '<b>Kongruen</b> ialah perihal sama bentuk dan sama saiz.')
  + bul(s, ['Dua objek adalah kongruen jika kedua-duanya mempunyai bentuk dan saiz yang sama, tanpa mengambil kira orientasi pergerakannya.',
            '<b>Orientasi</b> ialah hala sesuatu. Contohnya, arah jam, lawan arah jam, sebelah kiri dan sebelah kanan.',
            'Semua duit syiling 10 sen adalah kongruen manakala duit syiling 20 sen dan 10 sen adalah serupa tetapi bukan kongruen.']),
  box(''.join(k), 'Segi tiga A dan B kongruen, segi tiga C lebih kecil'))

g = Plane(0, 10, 0, 7, label=False, aria='Sisi empat ABCD ialah objek dan PQRS ialah imej')
g.poly([(1, 1), (4, 1), (4, 3), (2, 5)], OBJ, labels=['A', 'B', 'C', 'D'])
g.poly([(9, 1), (6, 1), (6, 3), (8, 5)], IMG, dash=True, labels=['P', 'Q', 'R', 'S'])
S(s, 'CONTOH 2', 'Imej bagi titik, garisan dan sudut',
  p('Rajah di sebelah menunjukkan ABCD ialah objek, manakala PQRS ialah imej. Nyatakan imej bagi (a) titik C (b) garisan AB (c) ∠BCD')
  + pen(['(a) Imej bagi titik C ialah R kerana bentuk yang sama, tetapi kedudukan yang berlainan.', '(b) Imej bagi garisan AB ialah PQ kerana imej itu mempunyai ukuran yang sama panjang.',
         '(c) Imej bagi ∠BCD ialah ∠QRS kerana ∠BCD mempunyai saiz yang sama dengan ∠QRS.']), g.svg())

k = panels(2, 'ab')
k.append(P([(50, 300), (120, 300), (50, 200)], OBJ)); k.append(P([(140, 300), (230, 300), (140, 170)], IMG, True))
k.append(P([(270, 300), (340, 300), (270, 200)], OBJ)); k.append(P([(370, 200), (440, 200), (440, 300)], IMG, True))
k.append(f'<g class="rv">{T(135, 425, "Tidak kongruen", "#F87171", 18)}{T(365, 425, "Kongruen", GR, 18)}</g>')
S(s, 'CONTOH 3', 'Pasangan yang kongruen',
  p('Antara dua pasangan rajah di bawah, yang manakah kongruen? Nyatakan sebabnya.')
  + pen(['(a) Tidak kongruen kerana saiz yang tidak sama.', '(b) Kongruen kerana saiz sama walaupun kedudukan dan orientasi tidak sama.']),
  box(''.join(k), 'Dua pasangan segi tiga (a) dan (b)'))

# =====================================================================
# 11.2 TRANSLASI
# =====================================================================
s = CUR[0] = '11.2'
g = Plane(0, 9, 0, 7, aria='Segi tiga digerakkan 5 unit ke kanan dan 2 unit ke atas')
O_ = [(1, 1), (3, 1), (1, 4)]; I_ = [(x + 5, y + 2) for x, y in O_]
g.poly(O_, OBJ); g.poly(I_, IMG, dash=True)
for a, b in zip(O_, I_):
    g.line(a, b, TX, 2.5, dash=True, arrow=True)
S(s, 'DEFINISI', 'Translasi',
  de(s, '<b>Translasi</b> merupakan pemindahan semua titik pada suatu satah mengikut arah yang sama dan melalui jarak yang sama.')
  + bul(s, ['Di bawah suatu translasi, objek dan imej mempunyai bentuk, saiz dan orientasi yang sama.']), g.svg())

k = panels(2, 'ab')
k.append(P([(50, 300), (110, 300), (110, 260), (80, 260), (80, 200), (50, 200)], OBJ))
k.append(P([(140, 220), (200, 220), (200, 180), (170, 180), (170, 120), (140, 120)], IMG, True))
k.append(P([(270, 300), (330, 300), (330, 260), (300, 260), (300, 200), (270, 200)], OBJ))
k.append(P([(440, 160), (380, 160), (380, 200), (410, 200), (410, 260), (440, 260)], IMG, True))
k.append(f'<g class="rv">{T(135, 425, "Translasi", GR, 18)}{T(365, 425, "Bukan translasi", "#F87171", 18)}</g>')
S(s, 'CONTOH 4', 'Mengenal pasti translasi',
  p('Kenal pasti rajah yang menunjukkan translasi. Berikan justifikasi.')
  + pen(['(a) Translasi kerana bentuk, saiz dan orientasi sama.', '(b) Bukan translasi kerana orientasi tidak sama.']),
  box(''.join(k), 'Dua pasangan bentuk L (a) dan (b)'))

g = Plane(0, 7, 0, 6, aria='Titik P bergerak 3 unit ke kanan dan 2 unit ke bawah ke P′')
g.pt(1, 5, 'P', OBJ, -26, -8); g.line((1, 5), (4, 5), OBJ, 4, arrow=True); g.line((4, 5), (4, 3), IMG, 4, arrow=True); g.pt(4, 3, 'P′', IMG, 12, 24)
g.text(2.5, 5.45, '+3', OBJ, 18); g.text(4.5, 4, '−2', IMG, 18)
S(s, 'KONSEP', 'Vektor translasi',
  de(s, '<b>Vektor translasi</b> merupakan pergerakan yang mempunyai arah dan magnitud. Vektor ini juga diwakili dengan anak panah.')
  + bul(s, [f'Bentuk vektor translasi {vec("<i>a</i>", "<i>b</i>", "#38BDF8")}. Translasi bagi rajah di sebelah ialah {vec("3", "−2")}.',
            '<i>a</i> mewakili pergerakan yang selari dengan paksi-<i>x</i>. <i>a</i> bernilai positif jika objek bergerak ke kanan dan bernilai negatif jika objek bergerak ke kiri.',
            '<i>b</i> mewakili pergerakan yang selari dengan paksi-<i>y</i>. <i>b</i> bernilai positif jika objek bergerak ke atas dan bernilai negatif jika objek bergerak ke bawah.']), g.svg())

g = Plane(-3, 6, -2, 4, aria='Titik P dan kedudukan selepas dua translasi')
g.pt(1, 1, 'P', OBJ, -24, -8)
g.line((1, 1), (-2, 1), IMG, 3, dash=True, arrow=True, rv=True); g.line((-2, 1), (-2, -1), IMG, 3, dash=True, arrow=True, rv=True)
g.pt(-2, -1, '(a)', IMG, -34, 24, rv=True)
g.line((1, 1), (5, 1), PU, 3, dash=True, arrow=True, rv=True); g.line((5, 1), (5, 2), PU, 3, dash=True, arrow=True, rv=True)
g.pt(5, 2, '(b)', PU, 8, -10, rv=True)
S(s, 'CONTOH 5', 'Menentukan kedudukan titik',
  p('Tentukan kedudukan titik P dalam rajah yang diberikan bagi huraian translasi dan lukis vektor translasi tersebut.')
  + bul(s, ['(a) Titik P bergerak 3 unit ke kiri dan 2 unit ke bawah.', '(b) Titik P bergerak 4 unit ke kanan dan 1 unit ke atas.'])
  + pen([f'(a) P′(−2, −1), vektor translasi {vec("−3", "−2")}', f'(b) P′(5, 2), vektor translasi {vec("4", "1")}']), g.svg())

g = Plane(-4, 4, -4, 3, aria='Q(−2, 1) dipetakan kepada Q′(2, −2)')
g.pt(-2, 1, 'Q', OBJ, -26, -8); g.pt(2, -2, 'Q′', IMG, 12, 22)
g.line((-2, 1), (2, 1), OBJ, 3.5, dash=True, arrow=True, rv=True); g.line((2, 1), (2, -2), IMG, 3.5, dash=True, arrow=True, rv=True)
S(s, 'CONTOH 6', 'Menentukan translasi daripada rajah',
  p('Tentukan translasi bagi rajah berikut.')
  + note('Pergerakan translasi sentiasa bermula dengan ke kiri atau ke kanan, kemudian baru ke atas atau ke bawah.', 'Tip:')
  + pen(['Titik Q bergerak 4 unit ke kanan dan 3 unit ke bawah.', f'Maka, translasi bagi rajah ialah {vec("4", "−3")}.']), g.svg())

g = Plane(-3, 5, -1, 6, aria='T(4, 2) ditranslasikan menjadi T′(−2, 5)')
g.pt(4, 2, 'T', OBJ, 10, 22); g.line((4, 2), (-2, 2), OBJ, 3.5, dash=True, arrow=True, rv=True); g.line((-2, 2), (-2, 5), IMG, 3.5, dash=True, arrow=True, rv=True)
g.pt(-2, 5, 'T′', IMG, 12, -8, rv=True)
S(s, 'CONTOH 7', 'Menentukan koordinat imej',
  note(f'Untuk menentukan imej di bawah translasi {vec("<i>a</i>", "<i>b</i>", "#38BDF8")}, koordinat objek P(<i>x</i>, <i>y</i>) akan dipetakan P′(<i>x</i> + <i>a</i>, <i>y</i> + <i>b</i>).', 'Rumus:')
  + p(f'Tentukan koordinat bagi imej titik T (4, 2) di bawah translasi {vec("−6", "3", "#38BDF8")}.')
  + pen(['Kaedah 1: Melukis satah Cartes (lihat rajah).', 'Kaedah 2: Mengira. T (4, 2) → T′ (4 + (−6), 2 + 3) = (−2, 5)', 'Maka, imej titik T (4, 2) ialah (−2, 5).']), g.svg())

g = Plane(-6, 2, -1, 6, aria='Mencari objek A apabila imej A′(−1, 3) diberi')
g.pt(-1, 3, 'A′', IMG, 10, 24)
g.line((-1, 3), (-5, 3), AX, 3, dash=True, arrow=True, rv=True); g.line((-5, 3), (-5, 5), AX, 3, dash=True, arrow=True, rv=True)
g.pt(-5, 5, 'A', OBJ, -24, -8, rv=True)
S(s, 'CONTOH 8', 'Menentukan koordinat objek',
  note(f'Untuk menentukan objek di bawah translasi {vec("<i>a</i>", "<i>b</i>", "#38BDF8")}, koordinat objek R′(<i>x</i>′, <i>y</i>′) akan dipetakan R(<i>x</i>′ − <i>a</i>, <i>y</i>′ − <i>b</i>).', 'Rumus:')
  + p(f'Tentukan koordinat bagi objek titik A jika koordinat imejnya, A′ di bawah translasi {vec("4", "−2", "#38BDF8")} adalah seperti yang berikut. (a) (−1, 3) (b) (6, 0)')
  + pen(['(a) Koordinat A = [−1 − 4, 3 − (−2)] = (−5, 5)', '(b) Koordinat A = [6 − 4, 0 − (−2)] = (2, 2)']), g.svg())

g = Plane(0, 6, 0, 8, aria='P(1, 7) dan P′(4, 3)')
g.pt(1, 7, 'P', OBJ, -24, -6); g.pt(4, 3, 'P′', IMG, 12, 22)
g.line((1, 7), (4, 7), AX, 3, dash=True, arrow=True, rv=True); g.line((4, 7), (4, 3), AX, 3, dash=True, arrow=True, rv=True)
nw = lambda t: f'<span style="white-space:nowrap">{t}</span>'
S(s, 'CONTOH 9', 'Vektor daripada koordinat',
  note(f'Diberi objek (<i>x</i>, <i>y</i>) dan imej (<i>x</i>′, <i>y</i>′). Vektor translasi ialah {vec(nw("<i>x</i>′ − <i>x</i>"), nw("<i>y</i>′ − <i>y</i>"), "#38BDF8")}.', 'Tip:')
  + p('Diberi P′ (4, 3) ialah imej kepada P (1, 7). Tentukan translasi tersebut.')
  + pen([f'Vektor translasi = {vec(nw("<i>x</i>′ − <i>x</i>"), nw("<i>y</i>′ − <i>y</i>"))} = {vec(nw("4 − 1"), nw("3 − 7"))} = {vec("3", "−4")}']), g.svg())

k = []
X0, Y0, C = 50, 25, 50
for r in range(8):
    for c in range(8):
        k.append(f'<rect x="{X0 + c * C}" y="{Y0 + r * C}" width="{C}" height="{C}" fill="{"#E6EDF7" if (r + c) % 2 == 0 else "#1E2A40"}"/>')
for (c, r), lb, col in [((1, 1), 'A', OBJ), ((4, 3), 'B', PU), ((2, 6), 'C', IMG)]:
    cx, cy = X0 + c * C + C / 2, Y0 + r * C + C / 2
    k.append(f'<circle cx="{cx}" cy="{cy}" r="19" fill="{AM}" stroke="#0B1220" stroke-width="3"/>' + T(cx, cy + 7, lb, '#0B1220', 20, fam=HEAD))
S(s, 'CONTOH 10', 'Penyelesaian masalah',
  p('Agnes menggerakkan buah damnya dari A ke B dan kemudian ke C. Nyatakan pergerakannya dalam bentuk vektor translasi buah dam bertanda (a) A ke B. (b) B ke C.')
  + four(s, 'Pergerakan translasi ke kiri atau ke kanan, ke atas atau ke bawah.', '(a) 3 unit ke kanan, 2 unit ke bawah. (b) 2 unit ke kiri, 3 unit ke bawah.',
         f'(a) {vec("3", "−2")} (b) {vec("−2", "−3")}',
         f'(a) Maka, vektor translasi A ke B ialah {vec("3", "−2")}. (b) Maka, vektor translasi B ke C ialah {vec("−2", "−3")}.'),
  box(''.join(k), 'Papan dam dengan buah dam A, B dan C'))

# =====================================================================
# 11.3 PANTULAN
# =====================================================================
s = CUR[0] = '11.3'
g = Plane(0, 8, 0, 6, label=False, aria='Bendera dipantulkan pada garis menegak')
g.line((4, 0), (4, 6), AM, 3.5, dash=True); g.text(4, 5.7, 'paksi pantulan', AM, 15)
g.poly([(3, 1), (3, 4), (1, 3.4), (3, 2.8)], OBJ); g.poly([(5, 1), (5, 4), (7, 3.4), (5, 2.8)], IMG, dash=True)
S(s, 'DEFINISI', 'Pantulan',
  de(s, '<b>Pantulan</b> ialah transformasi yang berlaku apabila semua titik pada satah dibalikkan dalam satah yang sama pada suatu garis. Garis tersebut dinamakan <b>paksi pantulan</b>.')
  + bul(s, ['Garis simetri ialah garisan yang membahagikan suatu bentuk kepada dua bahagian yang kongruen.',
            'Garis ini ialah pembahagi dua sama serenjang bagi garis yang menyambungkan objek dan imej.', 'Garis simetri ialah paksi pantulan bagi imej dan objek.']), g.svg())

g = Plane(0, 6, 0, 6, label=False, aria='Titik A dan imej A′ sama jarak dari paksi; titik B pada paksi tidak berubah')
g.line((3, 0), (3, 6), AM, 3.5, dash=True)
g.pt(1, 3, 'A', OBJ, -24, -8); g.pt(5, 3, 'A′', IMG, 12, -8); g.line((1, 3), (5, 3), AX, 2, dash=True)
g.text(2, 2.55, '2 unit', OBJ, 15); g.text(4, 2.55, '2 unit', IMG, 15)
g.pt(3, 5, 'B = B′', GR, 12, -8)
S(s, 'SIFAT', 'Sifat pantulan',
  p('Di bawah suatu pantulan,')
  + bul(s, ['objek dan imej berada pada sebelah yang bertentangan dengan paksi pantulan.', 'objek dan imejnya mempunyai jarak serenjang yang sama dari paksi pantulan.',
            'bentuk dan saiz imej adalah sama dengan objek, tetapi orientasinya songsang.', 'imej bagi suatu titik yang ada pada paksi pantulan ialah titik itu sendiri.']), g.svg())

k = panels(3, 'abc', [1, 0, 1])
k.append(f'<line x1="98" y1="110" x2="98" y2="360" stroke="{AM}" stroke-width="3" stroke-dasharray="8 6"/>')
k.append(P([(85, 300), (85, 180), (45, 200), (85, 225)], OBJ)); k.append(P([(111, 300), (111, 180), (151, 200), (111, 225)], IMG, True))
k.append(P([(195, 300), (195, 200), (235, 220), (195, 240)], OBJ)); k.append(P([(250, 260), (250, 160), (290, 180), (250, 200)], IMG, True))
k.append(f'<line x1="335" y1="235" x2="475" y2="235" stroke="{AM}" stroke-width="3" stroke-dasharray="8 6"/>')
k.append(P([(355, 220), (455, 220), (355, 150)], OBJ)); k.append(P([(355, 250), (455, 250), (355, 320)], IMG, True))
S(s, 'CONTOH 11', 'Orientasi pantulan',
  p('Antara corak yang berikut, yang manakah menunjukkan orientasi pantulan?')
  + note('Sifat imej bagi pantulan ialah sama bentuk dan sama saiz dengan objek, dan imej mempunyai orientasi berbeza, bersongsang sisi dan membentuk imej cermin antara satu sama lain.')
  + pen(['(a) Ya', '(b) Tidak', '(c) Ya']), box(''.join(k), 'Tiga corak (a), (b) dan (c)'))

g = Plane(-4, 4, -3, 3, aria='Titik (3, 2) dipantulkan pada paksi-x dan paksi-y')
g.pt(3, 2, '(3, 2)', OBJ, -20, -12); g.pt(3, -2, '(3, −2)', IMG, -24, 26); g.pt(-3, 2, '(−3, 2)', PU, -28, -12)
S(s, 'KONSEP', 'Pantulan pada paksi-x dan paksi-y',
  cards(card('PAKSI-X', '(<i>x</i>, <i>y</i>) → (<i>x</i>, −<i>y</i>)', 'Pantulan titik (<i>x</i>, <i>y</i>) pada paksi-<i>x</i> ialah titik (<i>x</i>, −<i>y</i>).', IMG),
        card('PAKSI-Y', '(<i>x</i>, <i>y</i>) → (−<i>x</i>, <i>y</i>)', 'Pantulan titik (<i>x</i>, <i>y</i>) pada paksi-<i>y</i> ialah titik (−<i>x</i>, <i>y</i>).', PU)), g.svg())

th = 'padding: 12px 14px; text-align: left; font-size: 20px; border-bottom: 2px solid #22304A; color: #94A3B8'
td = 'padding: 12px 14px; font-size: 20px; font-weight: 600; border-bottom: 1px solid #22304A'
rows = [('(2, 5)', 'Pantulan pada paksi-<i>x</i>', '(2, −5)'), ('(−4, −1)', 'Pantulan pada paksi-<i>x</i>', '(−4, 1)'),
        ('(2, 5)', 'Pantulan pada paksi-<i>y</i>', '(−2, 5)'), ('(−4, −1)', 'Pantulan pada paksi-<i>y</i>', '(4, −1)')]
tab = (f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: #131C2E"><thead><tr><th style="{th}">Objek</th><th style="{th}">Transformasi</th><th style="{th}">Imej</th></tr></thead><tbody>'
       + ''.join(f'<tr><td style="{td}">{a}</td><td style="{td}">{b}</td><td class="rv" style="{td}; color: {GR}">{c}</td></tr>' for a, b, c in rows) + '</tbody></table></div>')
g = Plane(-5, 5, -5, 5, aria='Titik (2, 5) dan (−4, −1) serta imejnya')
g.pt(2, 5, '(2, 5)', OBJ, 10, 4); g.pt(-4, -1, '(−4, −1)', OBJ, -30, 24)
g.pt(2, -5, '', IMG, rv=True); g.pt(-4, 1, '', IMG, rv=True); g.pt(-2, 5, '', PU, rv=True); g.pt(4, -1, '', PU, rv=True)
S(s, 'CONTOH 12', 'Melengkapkan jadual pantulan',
  p('Lengkapkan jadual di bawah.') + tab, g.svg())

g = Plane(-4, 4, -1, 4, aria='Segi tiga M dan imejnya M′ di bawah pantulan pada paksi-y')
g.poly([(1, 1), (3, 1), (1, 3)], OBJ); g.text(1.65, 1.6, 'M', OBJ, 18)
g.poly([(-1, 1), (-3, 1), (-1, 3)], IMG, dash=True); g.text(-1.65, 1.6, 'M′', IMG, 18)
S(s, 'CONTOH 13', 'Menghuraikan pantulan',
  p('Dalam rajah berikut, segi tiga M′ ialah imej kepada segi tiga M di bawah suatu pantulan. Huraikan pantulan tersebut.')
  + pen(['Objek M dipantulkan pada paksi-<i>y</i>.']), g.svg())

g = Plane(-3, 7, 0, 5, aria='Segi tiga ABC dipantulkan pada garis LM')
g.line((2, 0), (2, 5), AM, 3.5, dash=True); g.text(2.4, 4.8, 'L', AM, 18); g.text(2.4, 0.3, 'M', AM, 18)
g.poly([(-2, 1), (0, 1), (-2, 4)], OBJ, labels=['A', 'B', 'C'])
for y in (1, 4):
    g.line((-2, y), (6, y), AX, 2, dash=True, rv=True)
g.poly([(6, 1), (4, 1), (6, 4)], IMG, dash=True, labels=['A′', 'B′', 'C′'], rv=True)
S(s, 'CONTOH 14', 'Melukis imej pantulan',
  p('Lukis imej bagi segi tiga ABC di bawah pantulan pada garis LM.')
  + pen(['Langkah 1: Pilih mana-mana bucu dan bina garis serenjang dari bucu tersebut ke garisan LM dan panjangkan melebihi paksi pantulan tersebut.',
         'Langkah 2: Selarikan garisan tersebut kepada semua bucu yang lain.',
         'Langkah 3: Tentukan jarak bucu masing-masing dari paksi pantulan dan tandakan jarak yang sama dari paksi di atas garisan yang sama. Lakukan perkara yang sama pada semua bucu.']), g.svg())

g = Plane(-4, 6, -1, 7, aria='M dan imejnya M′; mencari imej P di bawah paksi yang sama')
g.poly([(2, 0), (4, 0), (2, 1)], OBJ); g.text(2.6, 0.6, 'M', OBJ, 16)
g.poly([(2, 6), (4, 6), (2, 5)], IMG, dash=True); g.text(2.65, 5.4, 'M′', IMG, 16)
g.line((-4, 3), (6, 3), AM, 3.5, dash=True, rv=True); g.text(5, 3.4, 'y = 3', AM, 15, rv=True)
g.pt(-2, 0, 'P', OBJ, 10, -8); g.pt(-2, 6, 'P′', IMG, 10, -8, rv=True)
S(s, 'CONTOH 15', 'Penyelesaian masalah',
  p('Dalam rajah di sebelah, M′ ialah imej bagi M di bawah suatu pantulan. Tentukan koordinat P′ di bawah paksi pantulan yang sama.')
  + four(s, 'Tentukan paksi pantulan.',
         'Tentukan pasangan bucu bagi imej dan objek. Lukis garis serenjang bagi kedua-dua pasangan bucu. Bina atau tentukan pembahagi dua bagi garis serenjang tersebut.',
         'Paksi pantulan ditentukan pada <i>y</i> = 3.', 'Dengan paksi pantulan <i>y</i> = 3, koordinat P′ ialah (−2, 6).'), g.svg())

# =====================================================================
# 11.4 PUTARAN
# =====================================================================
s = CUR[0] = '11.4'
g = Plane(0, 8, 0, 7, label=False, aria='Segi tiga diputar 90 darjah lawan arah jam pada titik M')
Mx, My = 4, 3
O_ = [(5, 3), (7, 3), (5, 4)]; I_ = [(Mx - (y - My), My + (x - Mx)) for x, y in O_]
g.poly(O_, OBJ); g.poly(I_, IMG, dash=True); g.pt(Mx, My, 'M', AM, -26, 22)
g.line((Mx, My), (7, 3), AX, 2, dash=True); g.line((Mx, My), (4, 6), AX, 2, dash=True)
g.raw(arc(g.X(Mx), g.Y(My), 62, 8, 82, TX, True, 3)); g.text(5.6, 4.9, '90°', TX, 16)
S(s, 'DEFINISI', 'Putaran',
  p('Dapatkah anda mengenal pasti pergerakan objek yang berputar di sekeliling anda seperti jarum jam, kipas siling dan pergerakan tayar? Semua pergerakan tersebut mempunyai pusat putarannya.')
  + de(s, '<b>Pusat putaran</b>: titik tetap yang padanya setiap titik pada satah berputar melalui sudut dan arah tertentu.')
  + bul(s, ['<b>Ikut arah jam</b>: arah pergerakan atau putaran seperti arah jarum jam bergerak.', '<b>Lawan arah jam</b>: arah pergerakan bertentangan jarum jam dari kanan ke kiri.']), g.svg())

g = Plane(0, 7, 0, 6, label=False, aria='Jarak A ke pusat O sama dengan jarak A′ ke pusat O')
g.pt(3, 2, 'O', AM, -26, 22); g.pt(6, 2, 'A', OBJ, 10, 22); g.pt(3, 5, 'A′', IMG, 12, -6)
g.line((3, 2), (6, 2), OBJ, 3); g.line((3, 2), (3, 5), IMG, 3, dash=True)
g.text(4.5, 1.55, '3 unit', OBJ, 15); g.text(2.25, 3.5, '3 unit', IMG, 15)
S(s, 'SIFAT', 'Sifat putaran',
  p('Sifat imej bagi putaran:')
  + bul(s, ['Imej yang dihasilkan mempunyai bentuk, saiz dan orientasi yang sama dengan objek.', 'Pusat putaran ialah satu titik pegun.',
            'Jarak semua titik imej ke pusat putaran adalah sama dengan jarak objek ke pusat putaran.'])
  + note('Orientasi imej putaran berubah mengikut sudut putaran, contohnya imej menjadi terbalik selepas putaran 180°. Namun, imej putaran bukan imej cermin seperti dalam pantulan.', 'Nota:'), g.svg())

g = Plane(-1, 6, -3, 4, aria='Segi tiga diputar 90 darjah ikut arah jam pada titik T')
Tx, Ty = 2, 1
O_ = [(3, 1), (5, 1), (3, 2)]; I_ = [(Tx + (y - Ty), Ty - (x - Tx)) for x, y in O_]
g.poly(O_, OBJ, labels=['A', 'B', 'C']); g.poly(I_, IMG, dash=True, labels=['A′', 'B′', 'C′']); g.pt(Tx, Ty, 'T', AM, -24, -8)
S(s, 'CONTOH 16', 'Memerihalkan putaran',
  de(s, 'Apabila kita memerihalkan suatu putaran, kita perlu menyatakan pusat, sudut dan arah putaran yang memetakan objek kepada imej.')
  + p('Perihalkan putaran bagi rajah di sebelah.')
  + pen(['Putaran 90° ikut arah jam pada titik T.'])
  + note('Imej yang dihasilkan melalui putaran 180° ikut arah jam adalah sama dengan putaran 180° lawan arah jam.'), g.svg())

g = Plane(-1, 7, 0, 6, aria='Segi tiga PQR diputar 90 darjah lawan arah jam pada M')
Mx, My = 2, 1
O_ = [(4, 1), (6, 1), (4, 3)]; I_ = [(Mx - (y - My), My + (x - Mx)) for x, y in O_]
g.poly(O_, OBJ, labels=['P', 'Q', 'R']); g.pt(Mx, My, 'M', AM, -26, 24)
g.line((Mx, My), (4, 1), AX, 2, dash=True, rv=True); g.line((Mx, My), (2, 3), AX, 2, dash=True, rv=True)
g.poly(I_, IMG, dash=True, labels=['P′', 'Q′', 'R′'], rv=True)
S(s, 'CONTOH 17', 'Menentukan imej putaran',
  p('Tentukan imej bagi △PQR apabila diputarkan 90° lawan arah jam pada titik M.')
  + pen(['Langkah 1: Lukiskan garisan pada titik M ke titik P.', 'Langkah 2: Tentukan sudut 90° lawan arah jam.',
         'Langkah 3: Lukis semula bentuk segi tiga PQR di atas kertas surih.', 'Langkah 4: Tekan dengan mata pensel pada titik M, putarkan kertas surih 90° lawan arah jam.']), g.svg())

g = Plane(0, 6, 0, 6, label=False, aria='Mencari objek Q bagi titik Q′ di bawah putaran 180 darjah pada M')
g.pt(3, 3, 'M', AM, -26, -8); g.pt(5, 4, 'Q′', IMG, 10, -8)
g.line((5, 4), (3, 3), AX, 2.5); g.line((3, 3), (1, 2), AX, 2.5, dash=True, rv=True); g.pt(1, 2, 'Q', OBJ, -24, 22, rv=True)
S(s, 'CONTOH 18', 'Menentukan objek putaran',
  p('Tentukan objek bagi titik Q′ apabila diputarkan 180° ikut arah jam pada titik M.')
  + pen(['Langkah 1: Lukis garisan yang menyambungkan titik M dan Q′ serta panjangkannya dengan jarak yang sama dengan MQ′ di arah yang bertentangan.',
         'Langkah 2: Tandakan titik Q pada garisan yang dipanjangkan dengan MQ = MQ′.']), g.svg())

g = Plane(0, 9, 0, 7, label=False, aria='Mencari pusat putaran dengan pembahagi dua sama serenjang')
g.poly([(1, 2), (1, 4), (2, 4)], OBJ, labels=['A', 'B', 'C']); g.poly([(5, 6), (7, 6), (7, 5)], IMG, dash=True, labels=['A′', 'B′', 'C′'])
g.line((1, 2), (5, 6), AX, 2, rv=True); g.line((1, 6), (6.3, 0.7), GR, 3, dash=True, rv=True)
g.line((1, 4), (7, 6), AX, 2, rv=True); g.line((3.6, 6.2), (5.3, 1.1), PU, 3, dash=True, rv=True)
g.pt(5, 2, 'D', AM, 12, 22, rv=True)
S(s, 'CONTOH 19', 'Pusat, sudut dan arah putaran',
  p('A′B′C′ ialah imej bagi ABC di bawah suatu putaran. Tentukan pusat, sudut dan arah putaran itu.')
  + steps(s, ['Langkah 1: Sambungkan titik A ke A′. Bina pembahagi dua sama serenjang bagi tembereng garis AA′.', 'Langkah 2: Ulangi langkah 1 bagi garis BB′ atau CC′.',
         'Langkah 3: Titik persilangan dua garisan pembahagi dua serenjang itu ialah pusat putaran. Tandakan pusat putaran itu sebagai D.',
         'Langkah 4: Ukur sudut ADA′ menggunakan protraktor. Maka, imej di bawah putaran 90° ikut arah jam pada pusat D.']), g.svg())

g = Plane(-4, 4, -4, 4, aria='Titik A(3, 1) dan imejnya di bawah tiga putaran pada asalan')
g.pt(3, 1, 'A', OBJ, 10, -8); g.pt(1, -3, '90° ikut', IMG, 10, 6); g.pt(-1, 3, '90° lawan', PU, 10, -8); g.pt(-3, -1, '180°', GR, -10, 24)
S(s, 'KONSEP', 'Putaran pada asalan',
  cards(card('PUTARAN 90° LAWAN ARAH JAM PADA ASALAN', '(<i>x</i>, <i>y</i>) → (−<i>y</i>, <i>x</i>)', '', PU),
        card('PUTARAN 180° PADA ASALAN', '(<i>x</i>, <i>y</i>) → (−<i>x</i>, −<i>y</i>)', '', GR),
        card('PUTARAN 270° LAWAN ARAH JAM PADA ASALAN', '(<i>x</i>, <i>y</i>) → (<i>y</i>, −<i>x</i>)', 'Sama dengan putaran 90° ikut arah jam.', IMG))
  + note('Jika soalan menggunakan grid segi empat sama, maka putaran 90°, 180° dan 270° tidak perlu menggunakan protraktor.', 'Tip:'), g.svg())

g = Plane(-4, 4, -4, 4, aria='A(3, 1) diputar 90 darjah ikut arah jam pada asalan menjadi A′(1, −3)')
g.pt(3, 1, 'A', OBJ, 10, -8); g.line((0, 0), (3, 1), OBJ, 3, rv=True)
g.line((0, 0), (1, -3), IMG, 3, dash=True, rv=True); g.pt(1, -3, 'A′', IMG, 10, 22, rv=True)
S(s, 'CONTOH 20', 'Menentukan koordinat imej',
  p('Tentukan koordinat imej bagi titik A (3, 1) di bawah suatu putaran 90° ikut arah jam pada asalan O.')
  + pen(['Langkah 1: Sambung garis OA.', 'Langkah 2: Putar garis OA pada asalan O menggunakan protraktor ikut arah jam dengan sudut 90°.',
         'Daripada rajah, koordinat bagi imej A′ ialah (1, −3).']), g.svg())

g = Plane(-3, 5, -2, 4, aria='K′(3, 2) ialah imej K di bawah putaran 90 darjah ikut arah jam pada L(1, 0)')
g.pt(1, 0, 'L', AM, 8, 24); g.pt(3, 2, 'K′', IMG, 10, -8); g.line((1, 0), (3, 2), IMG, 3)
g.line((1, 0), (-1, 2), OBJ, 3, dash=True, rv=True); g.pt(-1, 2, 'K', OBJ, -24, -8, rv=True)
S(s, 'CONTOH 21', 'Menentukan koordinat objek',
  p('Sekiranya K′ (3, 2) ialah imej bagi K di bawah putaran 90° ikut arah jam pada titik L (1, 0), tentukan koordinat K.')
  + pen(['Langkah 1: Terbalikkan arah putaran untuk mencari koordinat objek, iaitu titik K.', 'Langkah 2: Dengan menggunakan protraktor, putar garis K′L pada titik L, 90° lawan arah jam.',
         'Daripada rajah, koordinat bagi titik K ialah (−1, 2).']), g.svg())

# =====================================================================
# 11.5 ISOMETRI
# =====================================================================
s = CUR[0] = '11.5'
g = Plane(-5, 5, -4, 5, aria='Objek dan tiga imej: translasi, pantulan dan putaran')
O_ = [(-4, 1), (-2, 1), (-4, 3)]
g.poly(O_, OBJ); g.text(-3.3, 3.7, 'objek', OBJ, 15)
g.poly([(x + 5, y + 1) for x, y in O_], IMG, dash=True); g.text(2.2, 4.7, 'translasi', IMG, 15)
g.poly([(x, -y) for x, y in O_], PU, dash=True); g.text(-3.2, -3.6, 'pantulan', PU, 15)
g.poly([(-x, -y) for x, y in O_], GR, dash=True); g.text(3.2, -3.6, 'putaran', GR, 15)
S(s, 'DEFINISI', 'Isometri',
  de(s, '<b>Isometri</b> ialah suatu transformasi yang mengekalkan jarak di antara sebarang dua titik pada objek asal. Transformasi isometri akan mengekalkan bentuk dan saiz asal objek.')
  + bul(s, ['Jika objek dipetakan kepada suatu imej yang sentiasa kongruen, maka itu merupakan suatu isometri.', 'Anda dapat mengenal pasti translasi, pantulan dan putaran ialah isometri.']), g.svg())

k = []
L_ = lambda ox, oy, sc=1: [(ox, oy), (ox + 60 * sc, oy), (ox + 60 * sc, oy - 25 * sc), (ox + 25 * sc, oy - 25 * sc), (ox + 25 * sc, oy - 70 * sc), (ox, oy - 70 * sc)]
k.append(P(L_(40, 200), OBJ)); k.append(T(70, 230, 'Objek', OBJ, 16))
k.append(P([(300, 110), (300, 170), (275, 170), (275, 135), (230, 135), (230, 110)], IMG, True)); k.append(T(265, 230, 'A', IMG, 20, fam=HEAD))
k.append(P(L_(360, 230, 1.5), PU, True)); k.append(T(405, 260, 'B', PU, 20, fam=HEAD))
k.append(P([(130, 420), (220, 420), (220, 395), (155, 395), (155, 350), (130, 350)], GR, True)); k.append(T(175, 445, 'C', GR, 20, fam=HEAD))
S(s, 'CONTOH 22', 'Mengenal pasti imej isometri',
  p('Antara rajah A, B dan C, yang manakah merupakan imej isometri bagi objek yang berlorek di bawah suatu isometri?')
  + pen(['Rajah A ialah imej isometri kerana bentuk dan saiznya sama.', 'Rajah B bukan imej isometri kerana saiznya tidak sama.', 'Rajah C bukan isometri kerana bentuk dan saiznya tidak sama.']),
  box(''.join(k), 'Objek bentuk L dan rajah A, B dan C'))

g = Plane(0, 10, 0, 5, label=False, aria='Sisi empat ABCD kongruen dengan sisi empat SRQP')
g.poly([(1, 1), (4, 1), (4, 3), (2, 4)], OBJ, labels=['A', 'B', 'C', 'D']); g.poly([(9, 1), (6, 1), (6, 3), (8, 4)], IMG, dash=True, labels=['S', 'R', 'Q', 'P'])
S(s, 'KONSEP', 'Isometri dan kekongruenan',
  de(s, 'Di bawah suatu isometri, objek dan imej adalah sama bentuk dan sama saiz. Oleh itu, objek dan imej adalah kongruen. <b>Isometri ialah transformasi yang imejnya kongruen dengan objek.</b>')
  + note('Apabila menamakan poligon yang kongruen, tertib huruf mesti berdasarkan bucu atau sudut yang sepadan. Sisi empat ABCD dan sisi empat SRQP adalah kongruen.'), g.svg())

g = Plane(-4, 5, -4, 5, aria='Bentuk A, B, C dan D yang kongruen')
A_ = [(-3, 1), (-1, 1), (-3, 3)]
g.poly(A_, OBJ); g.text(-2.4, 1.6, 'A', OBJ, 18)
g.poly([(-x, -y) for x, y in A_], PU, dash=True); g.text(2.4, -1.6, 'B', PU, 18)
g.poly([(x + 5, y + 1) for x, y in A_], IMG, dash=True); g.text(2.6, 2.6, 'C', IMG, 18)
g.poly([(x, -y) for x, y in A_], GR, dash=True); g.text(-2.4, -1.6, 'D', GR, 18)
S(s, 'CONTOH 23', 'Menyatakan isometri',
  p('Objek A, B, C dan D adalah kongruen. Nyatakan isometri yang memetakan (a) objek A kepada objek B. (b) objek A kepada objek C. (c) objek A kepada objek D.')
  + pen(['(a) Putaran', '(b) Translasi', '(c) Pantulan']), g.svg())

k = []
Cx, Cy = 250, 90
D_, S_, A_, P_ = (40, 90), (460, 90), (40, 340), (460, 340)
Q_ = (Cx + 250 * math.cos(math.radians(70)) / math.sin(math.radians(70)), 340); B_ = (2 * Cx - Q_[0], 340)
k.append(P([A_, B_, (Cx, Cy), D_], OBJ)); k.append(P([P_, Q_, (Cx, Cy), S_], IMG))
rm = lambda x, y, dx, dy: f'<path d="M{f(x + dx)} {f(y)} L{f(x + dx)} {f(y + dy)} L{f(x)} {f(y + dy)}" fill="none" stroke="{TX}" stroke-width="2"/>'
k += [rm(40, 90, 18, 18), rm(40, 340, 18, -18), rm(460, 90, -18, 18), rm(460, 340, -18, -18)]
for (x, y), lb, dx, dy in [(D_, 'D', -4, -12), ((Cx, Cy), 'C', 0, -14), (S_, 'S', 4, -12), (A_, 'A', -4, 28), (B_, 'B', 0, 28), (Q_, 'Q', 0, 28), (P_, 'P', 4, 28)]:
    k.append(T(x + dx, y + dy, lb, TX, 20, fam=HEAD))
k.append(T(Cx, Cy + 62, '40°', AM, 17))
S(s, 'CONTOH 24', 'Penyelesaian masalah',
  p('Dalam rajah di sebelah, ABCD ialah imej bagi PQCS di bawah suatu isometri. Diberi DCS ialah garis lurus, hitung ∠PQC.')
  + four(s, 'ABCD ialah imej bagi PQCS. DCS ialah garis lurus. ∠PQC sebahagian daripada sudut segi empat PQCS.',
         'Tentukan ∠QCS = (180° − 40°) ÷ 2 = 140° ÷ 2 = 70°', '∠PQC = 360° − 90° − 90° − 70° = 110°', 'Oleh itu, ∠PQC ialah 110°.'),
  box(''.join(k), 'Sisi empat ABCD dan PQCS bertemu di C dengan sudut 40 darjah'))

th = 'padding: 14px 16px; text-align: left; font-size: 21px; border-bottom: 2px solid #22304A'
td = 'padding: 14px 16px; font-size: 21px; font-weight: 600; border-bottom: 1px solid #22304A'
rows = [('Bentuk dan saiz', 'Sama', 'Sama', 'Sama'), ('Orientasi', 'Sama', 'Songsang (imej cermin)', 'Berubah mengikut sudut putaran'),
        ('Titik yang tidak berubah', 'Tiada', 'Titik pada paksi pantulan', 'Pusat putaran'), ('Cara memerihal', 'Vektor translasi', 'Paksi pantulan', 'Pusat, sudut dan arah'),
        ('Isometri?', 'Ya', 'Ya', 'Ya')]
tab = (f'<div class="sl-table"><table style="width: 100%; min-width: 640px; border-collapse: collapse; background: #131C2E; border-radius: 20px; overflow: hidden"><thead><tr>'
       f'<th style="{th}; color: #94A3B8">Sifat</th><th style="{th}; color: {OBJ}">Translasi</th><th style="{th}; color: {IMG}">Pantulan</th><th style="{th}; color: {PU}">Putaran</th></tr></thead><tbody>'
       + ''.join(f'<tr><th style="{td}; text-align: left; color: #94A3B8">{r[0]}</th>' + ''.join(f'<td style="{td}">{c}</td>' for c in r[1:]) + '</tr>' for r in rows) + '</tbody></table></div>')
S(s, 'RUMUSAN', 'Translasi, pantulan dan putaran', '', '', tab)

# =====================================================================
# 11.6 SIMETRI PUTARAN
# =====================================================================
s = CUR[0] = '11.6'
k = []
tri = reg(250, 230, 150, 3)
k.append(P(tri, PK)); k.append(f'<circle cx="250" cy="230" r="7" fill="{AM}"/>')
k.append(arc(250, 230, 60, 90, 210, TX, True, 3)); k.append(T(195, 175, '120°', TX, 17))
S(s, 'DEFINISI', 'Simetri putaran',
  de(s, 'Suatu bentuk mempunyai <b>simetri putaran</b> jika bentuk tersebut tidak berubah selepas putaran walaupun kurang daripada satu putaran.')
  + bul(s, ['Simetri merupakan padanan tepat dari segi saiz dan bentuk antara satu bahagian atau sisi suatu arah atau objek.',
            'Bagi simetri putaran, bentuk atau imej yang diputarkan kurang daripada 360° pada satu titik tetap, bentuknya masih kelihatan sama.', 'Simbol kitar semula merupakan contoh simetri putaran.']),
  box(''.join(k), 'Segi tiga sama sisi diputar 120 darjah pada pusatnya'))

k = panels(3, 'abc', [0, 1, 0])
k.append(P([(60, 300), (130, 300), (60, 170)], PK))
k.append(P([(230, 180), (250, 180), (250, 220), (290, 220), (290, 240), (250, 240), (250, 280), (230, 280), (230, 240), (190, 240), (190, 220), (230, 220)], PK))
k.append(P([(345, 290), (445, 290), (445, 260), (375, 260), (375, 180), (345, 180)], PK))
S(s, 'CONTOH 25', 'Mengenal pasti simetri putaran',
  p('Kenal pasti objek berikut, yang manakah mempunyai simetri putaran?') + pen(['(a) Tidak', '(b) Ya', '(c) Tidak']),
  box(''.join(k), 'Tiga objek (a), (b) dan (c)'))

k = []
for i, (ang, lab) in enumerate([(0, 'Asal'), (120, '120°'), (240, '240°'), (360, '360°')]):
    cx = 70 + i * 120
    pts = reg(cx, 200, 48, 3, -90 + ang)
    k.append(P(pts, PK, dash=i > 0)); tx, ty = pts[0]
    k.append(f'<circle cx="{f(tx)}" cy="{f(ty)}" r="6" fill="{AM}"/>'); k.append(T(cx, 290, lab, TX, 17))
k.append(T(250, 400, 'Peringkat simetri putaran = 3', AM, 22))
S(s, 'KONSEP', 'Peringkat simetri putaran',
  de(s, '<b>Peringkat simetri putaran</b> ialah bilangan kali sesuatu bentuk menepati dirinya sendiri dalam satu putaran lengkap.')
  + bul(s, ['Bilangan imej yang boleh dihasilkan dalam suatu pusat putaran yang sama dan menjadi seperti objek asal adalah dinamakan peringkat simetri putaran.',
            'Bilangan paksi simetri adalah sama dengan peringkat simetri putaran.'])
  + note('Ayat kedua benar bagi poligon sekata. Bagi bentuk lain, hal ini tidak semestinya benar. Contohnya, segi empat selari mempunyai peringkat 2 tetapi tiada paksi simetri.', 'Nota:'),
  box(''.join(k), 'Segi tiga sama sisi pada putaran 0, 120, 240 dan 360 darjah'))

k = []
hexa = reg(250, 170, 120, 6)
k.append(P(hexa, AM))
for (x, y), lb in zip(hexa, 'ABCDEF'):
    dx, dy = (x - 250) * .2, (y - 170) * .2
    k.append(T(x + dx, y + dy + 7, lb, TX, 20, fam=HEAD))
chain = 'A → B → C → D → E'
k.append(f'<g class="rv">{T(250, 360, chain, TX, 22, fam=HEAD)}{T(250, 400, "pertama · kedua · ketiga · keempat", AX, 16)}</g>')
k.append(f'<g class="rv">{T(250, 440, "Peringkat keempat", GR, 20)}</g>')
S(s, 'CONTOH 26', 'Menentukan peringkat simetri putaran',
  p('Tentukan peringkat simetri putaran apabila kedudukan A berada di kedudukan E dalam rajah di sebelah.')
  + pen(['Dengan menggunakan kertas surih, lukis dan tentukan pergerakan peringkat putaran A kepada E.', 'A → B → C → D → E: peringkat pertama, kedua, ketiga dan keempat.']),
  box(''.join(k), 'Heksagon sekata ABCDEF'))

k = []
shapes = [(reg(90, 120, 55, 4, -45), '4'), ([(195, 90), (305, 90), (305, 150), (195, 150)], '2'), (reg(410, 120, 55, 6, 0), '6'),
          ([(60, 340), (160, 340), (190, 280), (90, 280)], '2'), ([(210, 350), (310, 350), (240, 260)], '1'), (reg(410, 305, 55, 5), '5')]
names = ['Segi empat sama', 'Segi empat tepat', 'Heksagon sekata', 'Segi empat selari', 'Segi tiga tak sekata', 'Pentagon sekata']
pos = [(90, 210), (250, 210), (410, 210), (125, 395), (260, 395), (410, 395)]
for (pts, n), nm, (x, y) in zip(shapes, names, pos):
    k.append(P(pts, PK)); k.append(T(x, y, nm, TX, 14)); k.append(f'<g class="rv">{T(x, y + 24, "Peringkat " + n, AM, 16)}</g>')
S(s, 'LATIHAN', 'Peringkat simetri putaran',
  p('Tentukan peringkat simetri putaran bagi objek berikut.'), box(''.join(k), 'Enam bentuk untuk ditentukan peringkat simetri putarannya'))

OUTFILE = os.path.join(HERE, '..', '..', 'isomove', 'slides.js'); HEAD='/* Nota Bab 11 ikut buku teks Matematik T2 KSSM (v4, diluluskan guru 26 Nov 2026). Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
