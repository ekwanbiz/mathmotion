"""Bab 9 T2 Laju dan Pecutan: nota ikut buku teks (ayat buku, nombor dan nama ditukar)."""
import os, math, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import Gr, mn, TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "9.1", "name": "Laju", "col": "#F87171"}, {"no": "9.2", "name": "Pecutan", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()


def fr(a, b):
    return f'<span class="fr"><span>{a}</span><span>{b}</span></span>'


def pen(s, items, label=True):
    return (p('<b>Penyelesaian:</b>') if label else '') + steps(s, items)


def work(blocks, s, cols=1, fs=19):
    c = COL[s]
    out = []
    for lb, lines in blocks:
        inner = ''.join(f'<div class="rv">{ln}</div>' for ln in lines)
        out.append(f'<div>{f"<b style=\"color:{c}\">{lb}</b> " if lb else ""}{inner}</div>')
    return ('<div style="width:100%;align-self:flex-start;background:#131C2E;border:1px solid #22304A;border-radius:22px;padding:16px 20px;'
            + (f'display:grid;grid-template-columns:repeat({cols},1fr);gap:10px 18px;' if cols > 1 else 'display:flex;flex-direction:column;gap:8px;')
            + f'font-size:{fs}px;line-height:1.5">' + ''.join(out) + '</div>')


def formula(html, c):
    return f'<div style="display:inline-block;margin:6px 0;padding:10px 18px;border:2px solid {c};border-radius:14px;background:#131C2E;font-size:21px;font-weight:700">{html}</div>'


def table(head, rows, c, fs=18):
    th = ''.join(f'<th style="padding:8px 12px;text-align:left;font-size:16px;color:{c};border-bottom:2px solid #22304A">{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td style="padding:7px 12px;font-size:{fs}px;font-weight:600;border-bottom:1px solid #22304A">{x}</td>' for x in r) + '</tr>' for r in rows)
    return f'<div class="sl-table" style="width:100%"><table style="width:100%;border-collapse:collapse;background:#131C2E"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'


def stack(*xs):
    return '<div style="width:100%;display:flex;flex-direction:column;gap:12px;align-self:flex-start">' + ''.join(xs) + '</div>'


def SV(inner, aria):
    return GF.svg(inner, aria)


def r2(v):
    return f'{round(v + 1e-12, 2):.2f}'


# =====================================================================
# 9.1 LAJU
# =====================================================================
s = '9.1'
c = COL[s]
o = f'<polygon points="250,60 400,320 100,320" fill="{c}22" stroke="{c}" stroke-width="4" stroke-linejoin="round"/>'
o += GF.L((165, 205), (335, 205), c, 3) + GF.L((250, 205), (250, 320), c, 3)
o += GF.T(250, 160, 'J', TX, 34) + GF.T(195, 268, 'L', TX, 34) + GF.T(305, 268, 'M', TX, 34)
o += GF.T(250, 370, 'J : Jarak    L : Laju    M : Masa', MU3, 18, halo=False)
o += GF.T(250, 410, 'L = J ÷ M     M = J ÷ L     J = L × M', TX, 19, halo=False)
S(s, 'DEFINISI', 'Laju sebagai suatu kadar',
  p('Murid yang mendapat tempat pertama telah menamatkan larian dalam masa yang paling singkat manakala murid yang terakhir menamatkan larian dengan merekodkan masa yang paling lama.')
  + de(s, 'Ketiga-tiga orang murid itu berlari dalam jarak yang sama, maka laju larian murid ialah hasil bahagi jarak dengan masa larian mereka.')
  + formula(f'Laju = {fr("Jarak", "Masa")}', c)
  + note('Jika saya berjalan 10 kilometer dalam tempoh satu jam, maka laju saya ialah 10 km/jam. Jika sesuatu zarah bergerak 1 meter dalam tempoh satu saat, maka laju zarah tersebut ialah 1 m/s.', 'Tip:'),
  SV(o, 'Segi tiga J, L, M bagi jarak, laju dan masa'))

assert r2(100 / 10.24) == '9.77' and r2(100 / 10.40) == '9.62' and 150 / 6 == 25
S(s, 'CONTOH 1', 'Menghitung laju',
  p('Mei Ling berjalan ke kedai yang jaraknya 150 meter selama 6 minit. Hitung lajunya.')
  + pen(s, [f'Laju = {fr("Jarak", "Masa")} = {fr("150 m", "6 min")}', '= 25 m/min', 'Maka, Mei Ling berjalan sejauh 25 m setiap minit.'], False)
  + p('<b>CONTOH 2</b> Faiz dan Hakim ialah pelari pecut muda negara. Semasa latihan acara 100 meter, Faiz menamatkan larian dalam masa 10.24 saat manakala Hakim menamatkan larian dalam masa 10.40 saat. Hitung laju larian Faiz dan Hakim.'),
  work([('Laju larian Faiz', [f'= {fr("Jarak", "Masa")}', f'= {fr("100 m", "10.24 s")}', '= 9.77 m/s']),
        ('Laju larian Hakim', [f'= {fr("Jarak", "Masa")}', f'= {fr("100 m", "10.40 s")}', '= 9.62 m/s'])], s))

# laju seragam / tak seragam
o = GF.box(14, 14, 230, 442) + GF.box(256, 14, 230, 442)
o += GF.T(129, 40, 'Guli A', c, 18) + GF.T(371, 40, 'Guli B', c, 18)
A_ = [(0, 0), (1, 2), (2, 4), (3, 6), (4, 8)]
B_ = [(0, 0), (1, 1), (2, 2.5), (3, 5), (4, 8)]
for gx0, pts in ((40, A_), (282, B_)):
    g = Gr((gx0 + 30, 90, gx0 + 190, 370), (0, 4), (0, 8), 1, 2, fs=11, xl='Masa (s)', yl='Jarak (cm)')
    g.add(f'<polyline points="{" ".join(f"{g.X(a):.1f},{g.Y(b):.1f}" for a, b in pts)}" fill="none" stroke="{PK}" stroke-width="3.5"/>')
    for a, b in pts:
        g.pt(a, b, '', PK, r=5)
    o += g.svg()
o += GF.T(129, 430, 'jarak sama setiap saat', MU3, 14, halo=False) + GF.T(371, 430, 'jarak berbeza setiap saat', MU3, 14, halo=False)
S(s, 'KONSEP', 'Laju seragam dan laju tak seragam',
  p('Perhatikan pergerakan guli <i>A</i> dan guli <i>B</i> dalam masa 4 saat.')
  + bul(s, ['Guli <i>A</i> bergerak dengan perubahan jarak yang sama. Maka, guli <i>A</i> bergerak dengan laju seragam.', 'Guli <i>B</i> bergerak dengan perubahan jarak yang berbeza. Maka, guli <i>B</i> bergerak dengan laju tak seragam.'])
  + de(s, 'Oleh itu, <b>laju seragam</b> ialah laju yang mempunyai perubahan jarak yang sama dalam selang masa yang sama.')
  + de(s, 'Oleh itu, <b>laju tak seragam</b> ialah laju yang mempunyai perubahan jarak yang tidak sama dalam selang masa yang sama.'),
  SV(o, 'Graf jarak-masa guli A garis lurus dan guli B lengkung'))

assert 150 / 2 == 75 and 200 / 4 == 50 and 45 / 3 == 75 / 5 == 60 / 4 == 15
S(s, 'CONTOH 3', 'Laju seragam atau tak seragam?',
  p('Lim memandu sebuah lori sejauh 150 kilometer dalam masa 2 jam yang pertama dan 200 kilometer dalam 4 jam berikutnya. Adakah Lim memandu lorinya dengan laju seragam? Jelaskan jawapan anda.')
  + work([('', [f'Kelajuan pada 2 jam yang pertama = {fr("150 km", "2 j")} = 75 km/j', f'Kelajuan pada 4 jam berikutnya = {fr("200 km", "4 j")} = 50 km/j', 'Maka, kelajuan lori tersebut adalah tak seragam.'])], s, 1, 18)
  + note(f'km/j boleh juga ditulis sebagai {fr("km", "j")} atau kmj<sup>−1</sup>.', 'Tip:'),
  work([('CONTOH 4', ['Encik Ravi memukul bola golf dari tiang <i>P</i> ke tiang <i>S</i> melalui tiang <i>Q</i> dan tiang <i>R</i>. <i>PQ</i> = 45 m dalam 3 s, <i>QR</i> = 75 m dalam 5 s dan <i>RS</i> = 60 m dalam 4 s. Adakah kelajuan bola golf itu mempunyai laju yang seragam? Jelaskan jawapan anda.']),
        ('Penyelesaian:', [f'Kelajuan bola dari <i>P</i> ke <i>Q</i> = {fr("45 m", "3 s")} = 15 m/s', f'Kelajuan bola dari <i>Q</i> ke <i>R</i> = {fr("75 m", "5 s")} = 15 m/s',
                           f'Kelajuan bola dari <i>R</i> ke <i>S</i> = {fr("60 m", "4 s")} = 15 m/s', 'Maka, kelajuan bola golf itu adalah seragam.'])], s, 1, 18))

# laju purata
g = Gr((90, 60, 440, 380), (0, 6), (0, 60), 1, 10, xl='Masa (s)', yl='Jarak (m)', fs=12)
g.seg((0, 0), (6, 60), PK, 3.5).seg((2, 20), (4, 20), AM, 2.5, '6 5').seg((4, 20), (4, 40), AM, 2.5, '6 5')
g.text(3, 15, 'perubahan <i>x</i> = 2 s', AM, 14).text(4.15, 30, 'perubahan <i>y</i> = 20 m', AM, 14, 'start')
o = g.svg() + GF.T(250, 440, f'Kecerunan = 20 m ÷ 2 s = 10 m/s = laju', MU3, 17, halo=False)
S(s, 'RUMUS', 'Laju purata',
  p('Pertimbangkan perjalanan Perkhidmatan Kereta Api Elektrik (ETS) dari Kuala Lumpur ke Butterworth. Kereta api itu akan bergerak dengan laju tak seragam. Dalam situasi sedemikian, laju purata digunakan untuk memberikan suatu gambaran tentang laju kereta api itu.')
  + formula(f'Laju purata = {fr("Jumlah jarak", "Jumlah masa")}', c)
  + note('Kecerunan garisan graf jarak-masa = laju. Kecerunan = perubahan <i>y</i> ÷ perubahan <i>x</i>.', 'Tip:'),
  SV(o, 'Graf jarak-masa dengan kecerunan sebagai laju'))

assert 42 / 3.5 == 12 and r2(360 / 6.33) == '56.87'
S(s, 'CONTOH 5', 'Menghitung laju purata',
  p('Zul mula berbasikal dari rumahnya ke bandar <i>B</i> pada pukul 8:00 pagi. Dalam perjalanan, dia singgah di restoran untuk berehat dan makan sebelum dia menyambung perjalanannya semula ke bandar <i>B</i>. Dia sampai di bandar <i>B</i> pada pukul 11:30 pagi. Jarak rumah ke restoran ialah 12 km dan restoran ke bandar <i>B</i> ialah 30 km. Hitung laju purata, dalam km/j, perjalanan itu.')
  + work([('', ['Jumlah jarak = 12 km + 30 km = 42 km', 'Jumlah masa = 11:30 − 8:00 = 3 j 30 min', f'3 j 30 min = 3 j + ({fr(30, 60)}) j = 3.5 j', f'Laju purata = {fr("42 km", "3.5 j")} = 12 km/j'])], s, 1, 18),
  work([('CONTOH 6', ['Sebuah bas bertolak dari bandar Kuantan pada jam 0915 dan tiba di Kota Bharu pada jam 1535. Jika jumlah jarak yang dilaluinya ialah 360 kilometer, hitung laju purata bas itu dalam km/j.']),
        ('Penyelesaian:', ['Jarak = 360 km', 'Masa = 1535 − 0915 = 6 jam 20 min', f'6 j + ({fr(20, 60)}) j = 6 j + 0.33 j = 6.33 j', f'Laju purata = {fr("Jumlah jarak", "Jumlah masa")} = {fr("360 km", "6.33 j")}', '= 56.87 km/j'])], s, 1, 18))

# penukaran unit
assert 72 * 1000 / 3600 == 20 and 72 / 60 == 1.2 and 150 * 60 / 1000 == 9
S(s, 'CONTOH 7', 'Penukaran unit laju',
  p('Had laju di sebatang jalan persekutuan ialah 72 km/j. Nyatakan had kelajuan ini dalam unit (a) m/s (b) km/min')
  + work([('(a)', [f'72 km/j = {fr("72 km", "1 j")}', f'= {fr("72 × 1 000 m", "1 × 3 600 s")}', f'= {fr("72 000 m", "3 600 s")}', '= 20 m/s']),
          ('(b)', [f'72 km/j = {fr("72 km", "1 j")}', f'= {fr("72 km", "1 × 60 min")}', f'= {fr("72 km", "60 min")}', '= 1.2 km/min'])], s, 2, 18)
  + note('1 km = 1 000 m, 1 m = 100 cm, 1 jam = 60 minit, 1 minit = 60 saat', 'Imbas kembali:'),
  work([('CONTOH 8', ['Tukarkan 150 m/s kepada km/min.']),
        ('Penyelesaian:', [f'150 m/s = {fr("150 m", "1 s")}', f'= {fr("150 ÷ 1 000 km", "1 ÷ 60 min")}', f'= {fr("0.15 km", "1 min")} × 60', '= 9 km/min'])], s, 1, 19))

assert 15 + 2 + 25 == 42 and 42 / 2.1 == 20
S(s, 'CONTOH 9', 'Laju purata dengan penukaran unit',
  p('Nurul telah memenangi pingat emas dalam acara triatlon wanita. Beliau memulakan acara dengan berlari sejauh 15 kilometer, diikuti dengan acara renang sejauh 2 000 meter dan diakhiri dengan 25 kilometer acara berbasikal. Dengan masa selama 2 jam 6 minit untuk keseluruhan pertandingan itu, hitung laju purata dalam km/j bagi seluruh acara itu.')
  + pen(s, [f'Laju purata = {fr("Jumlah jarak", "Jumlah masa")} = {fr("15 km + 2 000 m + 25 km", "2 j 6 min")}',
            f'= {fr("15 km + 2 km + 25 km", "2.1 j")} = {fr("42 km", "2.1 j")} = 20 km/j'], False),
  work([('Penukaran unit', [f'{fr("2 000", "1 000")} km = 2 km', f'2 j + ({fr(6, 60)}) j = 2 j + 0.1 j = 2.1 j'])], s))

# CONTOH 10 graf
g = Gr((90, 60, 440, 390), (0, 6), (0, 240), 1, 40, xl='Masa (j)', yl='Jarak (km)', fs=12, skipy=(40, 80, 120, 160, 200))
g.add(f'<polyline points="{g.X(0):.1f},{g.Y(0):.1f} {g.X(2):.1f},{g.Y(100):.1f} {g.X(3):.1f},{g.Y(100):.1f} {g.X(5):.1f},{g.Y(220):.1f}" fill="none" stroke="{PK}" stroke-width="3.5"/>')
for (a, b) in ((2, 100), (3, 100), (5, 220)):
    g.add(GF.L(g.P(a, b), (g.X(a), g.Y(0)), MU3, 1.8, '5 5'))
g.add(GF.L(g.P(0, 100), g.P(2, 100), MU3, 1.8, '5 5') + GF.L(g.P(0, 220), g.P(5, 220), MU3, 1.8, '5 5'))
g.text(-0.1, 100, '100', TX, 13, 'end').text(-0.1, 220, '220', TX, 13, 'end').text(2.5, 115, '<i>B</i>', TX, 17).text(5.15, 225, '<i>C</i>', TX, 17, 'start').text(2.5, 135, 'Waktu rehat', AM, 14)
S(s, 'CONTOH 10', 'Laju purata daripada graf',
  p('Siti mengikuti rombongan sekolah ke Kuala Lumpur. Bas sekolah yang dinaiki mereka bertolak dari sekolah (<i>O</i>) pada pukul 7:00 pagi. Dalam perjalanan, mereka berhenti di kawasan rehat (<i>B</i>) untuk menikmati sarapan pagi dan berehat. Selepas itu, mereka meneruskan perjalanan sehingga Kuala Lumpur (<i>C</i>). Graf menunjukkan pergerakan bas dari sekolah ke Kuala Lumpur. Hitung laju purata, dalam km/j, perjalanan itu.')
  + pen(s, [f'Laju purata = {fr("Jumlah jarak", "Jumlah masa")}', f'= {fr("220 km", "5 j")}', '= 44 km/j'], False),
  SV(g.svg(), 'Graf jarak-masa perjalanan bas dengan waktu rehat'))

# CONTOH 11 penyelesaian masalah
assert 42 / (50.4 / 60) == 50 and 42 / 0.8 == 52.5
S(s, 'CONTOH 11', 'Penyelesaian masalah',
  p('Haziq telah mengharumkan nama sekolah dalam Kejohanan Lumba Basikal Peringkat Negeri. Beliau mengambil masa selama 50 minit 24 saat untuk menghabiskan perlumbaan yang berjarak 42 kilometer. Hitung laju')
  + bul(s, ['(a) dalam km/j, basikal yang ditunggang oleh Haziq.', '(b) jika kelajuan pemenang tempat kedua ialah 0.8 km/min, hitung beza masa antaranya dengan Haziq.'])
  + work([('Memahami masalah', ['Jarak perlumbaan = 42 km, masa perlumbaan = 50 minit 24 saat. Hitung laju basikal Haziq dan beza masa antaranya dengan pemenang tempat kedua.'])], s, 1, 18),
  work([('Merancang strategi', [f'(a) Masa = {fr("Jarak", "Laju")} (b) Beza masa = Masa pemenang tempat kedua − masa Haziq']), ('Melaksanakan strategi', [f'(a) Laju basikal Haziq = {fr("Jarak", "Masa")} = {fr("42 km", f"50 min + ({fr(24, 60)}) min")}', f'= {fr("42 km", "50.4 min")} = {fr("42 km", f"({fr(50.4, 60)}) jam")}', f'= {fr("42 km", "0.84 jam")} = 50 km/j',
                                   f'(b) Masa basikal pemenang tempat kedua = {fr("Jarak", "Laju")} = {fr("42 km", "0.8 km/min")}', '= 52.5 min = 52 min 30 s', 'Beza masa = 52 min 30 s − 50 min 24 s = 2 min 6 s']),
        ('Membuat kesimpulan', ['(a) Laju basikal Haziq ialah 50 km/j.', '(b) Beza masa antara pemenang tempat kedua dengan Haziq ialah 2 minit 6 saat.'])], s, 1, 17))

# CONTOH 12
assert 90 * (3 + 20 / 60) == 300 and r2(300 / (23 / 6)) == '78.26'
S(s, 'CONTOH 12', 'Penyelesaian masalah',
  p(f'Encik Lee memandu kereta dengan purata laju 90 km/j dari Kuala Lumpur ke Johor Bahru. Perjalanan itu mengambil masa 3 jam 20 minit. Encik Lee mengambil masa {fr(1, 2)} jam lebih lama dalam perjalanan pulang dari Johor Bahru ke Kuala Lumpur. Hitung laju purata dalam km/j perjalanan pulang Encik Lee.')
  + work([('Memahami masalah', ['Purata laju = 90 km/j. Tempoh perjalanan pergi = 3 jam 20 minit.', f'Tempoh perjalanan pulang = {fr(1, 2)} jam lebih lama daripada masa pergi. Hitung laju purata perjalanan pulang Encik Lee.']),
          ('Merancang strategi', [f'Jarak = Laju × Masa, Laju purata = {fr("Jumlah jarak", "Jumlah masa")}'])], s, 1, 18),
  work([('Melaksanakan strategi', ['Jarak dari Kuala Lumpur ke Johor Bahru', f'= 90 km/j × (3 + {fr(20, 60)}) j = 90 km/j × {fr(10, 3)} j = 300 km', 'Laju purata semasa Encik Lee pulang',
                                   f'= {fr("300 km", f"3 j + ({fr("20 + 30", 60)}) j")} = {fr("300 km", f"{fr(23, 6)} j")}', '= 78.26 km/j']),
        ('Membuat kesimpulan', ['Laju purata perjalanan pulang Encik Lee ialah 78.26 km/j.'])], s, 1, 18))

# =====================================================================
# 9.2 PECUTAN
# =====================================================================
s = '9.2'
c = COL[s]
g = Gr((90, 60, 440, 380), (0, 8), (0, 12), 1, 2, xl='Masa (s)', yl='Laju (m/s)', fs=12)
g.seg((0, 0), (3, 10), GR, 4).seg((3, 10), (5, 10), AM, 4).seg((5, 10), (8, 0), RD := '#F87171', 4)
g.text(1.2, 7, 'pecutan', GR, 16, 'end').text(4, 10.8, 'laju seragam', AM, 15).text(6.9, 7, 'nyahpecutan', '#F87171', 16, 'start')
S(s, 'DEFINISI', 'Pecutan dan nyahpecutan',
  p('Pelari pecut akan bermula dari garisan permulaan dan berlepas dari blok permulaan sebaik sahaja bunyi tembakan pistol kedengaran. Laju larian semakin bertambah apabila mereka mula memecut ketika menuju ke garisan penamat.')
  + de(s, 'Peningkatan laju terhadap masa dinamakan <b>pecutan</b>. Pengurangan laju terhadap masa dinamakan <b>nyahpecutan</b>.')
  + p('Perubahan laju boleh dikenal pasti dengan menghitung perbezaan di antara laju akhir dan laju awal. Maka, pecutan dan nyahpecutan ialah kadar yang melibatkan laju dan masa.')
  + formula(f'Pecutan = {fr("Laju akhir − Laju awal", "Masa")}', c),
  SV(g.svg(), 'Graf laju-masa menunjukkan pecutan, laju seragam dan nyahpecutan'))

assert r2(90 / 3600 / 5) == '0.01' and 90 / 3600 == 0.025 and 18 / 6 == 3
S(s, 'CONTOH 13', 'Menghitung pecutan',
  p('Sebuah kereta lumba memecut daripada keadaan pegun dan mencapai kelajuan 90 km/j dalam masa 5 saat. Hitungkan pecutannya.')
  + work([('', ['Perubahan laju = 90 km/j − 0 km/j = 90 km/j', f'{fr("90 km", "1 j")} = {fr("90 km", "60 × 60 s")} = 0.025 km/s', f'Pecutan = {fr("0.025 km/s", "5 s")}', '= 0.005 km/s per saat atau km/s²'])], s, 1, 18)
  + note('Keadaan pegun ialah keadaan objek yang tidak bergerak. Oleh itu, kelajuan objek ialah sifar.', 'Perhatian:'),
  stack(work([('CONTOH 14', ['Sebuah motosikal bergerak daripada keadaan pegun dan memecut secara seragam sehingga mencapai kelajuan 18 m/s dalam masa 6 saat. Berapakah pecutan motosikal itu?']),
        ('Penyelesaian:', [f'Pecutan = {fr("(18 − 0) m/s", "6 s")}', f'= {fr("18 m/s", "6 s")}', '= 3 m/s²'])], s, 1, 19)
  , note('Pecutan seragam bermaksud kelajuan berubah dengan jumlah yang sama pada setiap saat. Jika sesuatu objek bergerak dengan laju seragam, pecutan ialah sifar.', 'Tip:')))

g = Gr((90, 60, 440, 330), (0, 6), (0, 24), 1, 4, xl='Masa (s)', yl='Laju (m/s)', fs=12)
g.seg((0, 24), (6, 0), '#F87171', 4)
for k in range(7):
    g.pt(k, 24 - 4 * k, '', '#F87171', r=4.5)
S(s, 'CONTOH 14 (sambungan)', 'Menghitung nyahpecutan',
  p('Selepas brek ditekan, kelajuan motosikal itu semakin perlahan dengan kadar seragam daripada 24 m/s sehingga berhenti dalam masa 6 saat. Berapakah pecutan motosikal itu?')
  + pen(s, [f'Pecutan = {fr("(0 − 24) m/s", "6 s")} = {fr("−24 m/s", "6 s")} = −4 m/s²', 'Maka, nyahpecutan motosikal itu ialah 4 m/s².'], False)
  + note('Pecutan = −4 m/s² atau Nyahpecutan = 4 m/s² (ditulis tanpa tanda negatif).', 'Perhatian:')
  + table(['Unit laju', 'Unit masa', 'Unit pecutan'], [['km/j', 'jam', 'km/j² atau kmj<sup>−2</sup> atau km/j per jam'], ['m/s', 'saat', 'm/s² atau ms<sup>−2</sup> atau m/s per saat']], c, 14),
  SV(g.svg(), 'Graf laju-masa nyahpecutan seragam'))

# penukaran unit pecutan
assert 360 / 1000 == 0.36 and abs(30 / (1 / 3) - 90) < 1e-9 and 30 / 1200 == 0.025 and 15 / 0.5 == 30 and abs(0.5 * 0.8 - 0.4) < 1e-9
S(s, 'CONTOH 15', 'Penukaran unit pecutan',
  p('Tukarkan 360 m/min per min kepada km/min per minit.')
  + pen(s, [f'{fr("360 m/min", "min")} = {fr("360 m", "min")} ÷ min = {fr("360 × 1 m", "min")} ÷ min',
            f'= {fr(f"360 × {fr(1, "1 000")} km", "min")} ÷ min = {fr("0.36 km", "min")} × {fr(1, "min")}', '= 0.36 km/min²'], False)
  + note('Unit km/jam² boleh ditulis sebagai kmj<sup>−2</sup>.', 'Tip:'),
  stack(work([('CONTOH 16', [f'Rani berbasikal selama {fr(1, 2)} jam dari rumahnya ke Festival Kebudayaan yang diadakan di bandar dengan perubahan laju 15 km/j. Perjalanan ke Festival Kebudayaan mengambil masa kurang 20% berbanding dengan masa balik dengan perubahan laju yang sama. Hitungkan beza pecutan antara pergi dengan balik.']),
        ('Penyelesaian:', [f'Pecutan semasa pergi = {fr("15 km/j", f"{fr(1, 2)} j")} = 30 km/j²', f'Masa berkurang = ({fr(20, 100)}) × {fr(1, 2)} j = 0.1 jam', 'Masa diambil semasa pulang = 0.5 j − 0.1 j = 0.4 j',
                           f'Pecutan semasa pulang = {fr("15 km/j", "0.4 j")} = 37.5 km/j²', 'Beza pecutan = 37.5 km/j² − 30 km/j² = 7.5 km/j²'])], s, 1, 17)
  , note('Kiraan ini menganggap masa pulang 20% kurang daripada masa pergi.', 'Nota:')))

S(s, 'CONTOH 17', 'Pecutan dalam unit berlainan',
  p('Kumar memandu dengan kelajuan 60 km/j. Dia menambah kelajuan keretanya kepada 90 km/j dalam masa 20 minit. Hitung pecutan dalam (a) km/j per jam (b) km/j per saat')
  + pen(s, ['(a) Perubahan laju = 90 km/j − 60 km/j = 30 km/j', f'20 minit = {fr(1, 3)} jam, Pecutan = {fr("30 km/j", f"({fr(1, 3)}) j")} = 90 km/j per jam',
            '(b) Masa = 20 minit = 20 × 60 s = 1 200 s', f'Pecutan = {fr("30 km/j", "1 200 s")} = 0.025 km/j per saat'], False),
  work([('Ingat', ['1 jam = 60 minit', '1 minit = 60 saat', f'20 minit = {fr(20, 60)} jam = {fr(1, 3)} jam'])], s))

# CONTOH 18 & 19
assert 3 * 6 + 80 == 98 and 50 * 0.7 == 35 and (35 - 50) / 25 == -0.6
S(s, 'CONTOH 18', 'Penyelesaian masalah',
  p('Mira memecut keretanya 3 km/j per saat semasa memotong sebuah kereta. Jika dia mula memandu dengan kelajuan 80 km/j, hitung kelajuannya selepas 6 saat.')
  + work([('Memahami masalah', ['Pecutan = 3 km/j per saat, mula memandu pada 80 km/j, masa = 6 saat. Hitung kelajuannya selepas 6 saat.']),
          ('Merancang strategi', ['Pecutan ialah peningkatan kelajuan terhadap masa.']),
          ('Melaksanakan strategi', [f'{fr("3 km/j", "s")} = {fr("Laju selepas 6 saat − 80 km/j", "6 s")}', f'{fr("3 km/j", "s")} × 6 s = Laju selepas 6 saat − 80 km/j', '18 km/j + 80 km/j = Laju selepas 6 saat = 98 km/j']),
          ('Membuat kesimpulan', ['Laju selepas 6 saat ialah 98 km/j.'])], s, 1, 16),
  work([('CONTOH 19', ['Sebuah motosikal yang sedang bergerak pada kelajuan 50 km/j memperlahankan kelajuannya sebanyak 30% daripada kelajuan awalnya, dalam masa 25 saat. Hitung pecutannya.']),
        ('Memahami masalah', ['Bergerak pada 50 km/j, pengurangan kelajuan 30%, selepas 25 saat. Hitung pecutannya.']),
        ('Merancang strategi', ['Pengurangan laju terhadap masa ialah nyahpecutan.']),
        ('Melaksanakan strategi', [f'Laju selepas 25 s = {fr(70, 100)} × 50 km/j = 35 km/j (100% − 30% = 70%)', f'Pecutan = {fr("(35 − 50) km/j", "25 s")} = −0.6 km/j per saat', 'Nyahpecutan = 0.6 km/j per saat']),
        ('Membuat kesimpulan', ['Pecutan motosikal ialah −0.6 km/j per saat, iaitu motosikal mengalami pengurangan kelajuan.'])], s, 1, 16))

# CONTOH 20
g = Gr((90, 60, 440, 380), (0, 32), (0, 28), 5, 4, xl='Masa (saat)', yl='Laju (m/s)', fs=12, skipy=(24,), skipx=(30,))
g.seg((0, 24), (30, 0), PK, 4).text(-0.6, 24, '<i>v</i>', TX, 17, 'end').text(30, -2.2, '30', TX, 14)
assert abs(0.8 * 30 - 24) < 1e-9 and abs(24 * 2.5 - 60) < 1e-9
S(s, 'CONTOH 20', 'Penyelesaian masalah',
  p('Gambar rajah di sebelah menunjukkan graf laju-masa bagi pergerakan sebuah lori mainan dalam tempoh 30 saat. Nyahpecutan bagi lori mainan itu ialah 0.8 m/s².')
  + bul(s, ['(a) Hitung laju, <i>v</i>, dalam m/saat.', '(b) Hitung jarak pergerakan lori mainan itu selepas 2.5 saat.']),
  SV(g.svg(), 'Graf laju-masa lori mainan dari v ke 0 dalam 30 saat'))

S(s, 'CONTOH 20 (sambungan)', 'Penyelesaian',
  work([('Memahami masalah', ['Pecutan = −0.8 m/s², tempoh = 30 saat. Hitung laju, <i>v</i> dan jarak selepas 2.5 saat.']),
          ('Merancang strategi', ['Jarak = Laju × Masa, Perubahan laju = Pecutan × Masa']),
          ('Melaksanakan strategi', [f'(a) −0.8 m/s² = {fr("0 − <i>v</i>", "30 s")}', '−0.8 m/s² × 30 s = 0 − <i>v</i>', '<i>v</i> = 24 m/s', '(b) Jarak = Laju × Masa = 24 m/s × 2.5 s = 60 m']),
          ('Membuat kesimpulan', ['(a) Laju pergerakan lori mainan ialah 24 m/s. (b) Jarak pergerakan lori mainan ialah 60 m.'])], s, 1, 16)
  + note('Jarak = Laju × Masa hanya tepat bagi laju seragam. Nilai 60 m ialah anggaran.', 'Nota:'),
  SV(g.svg(), 'Graf laju-masa lori mainan'))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pecut', 'slides.js')
HEAD = '/* Nota Bab 9 ikut buku teks Matematik T2 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
