"""Bab 4 T5 Matematik Pengguna: Percukaian. Nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan nama ditukar;
jadual kadar rasmi (cukai pendapatan TT2020, cukai jalan, tarif elektrik) dikekalkan). CONTOH 1–13 ikut buku.
SUBS folder percukaian dikekalkan (4.1.1, 4.1.3, 4.1.4; digabung 4.1 melalui BAB.gabung)."""
import os, sys
from decimal import Decimal as D, ROUND_HALF_UP
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "4.1.1", "name": "Tujuan & Jenis Cukai", "col": "#38BDF8"}, {"no": "4.1.3", "name": "Cukai Pendapatan", "col": "#34D399"}, {"no": "4.1.4", "name": "Cukai Jalan, Pintu, Tanah & SST", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def q2(v):
    return D(str(v)).quantize(D('0.01'), rounding=ROUND_HALF_UP)


def RM(v):
    v = q2(v)
    neg = v < 0
    s_ = f'{abs(v):,.2f}'
    if s_.endswith('.00'):
        s_ = s_[:-3]
    return ('−' if neg else '') + 'RM' + s_.replace(',', ' ')


def RM2(v):
    v = q2(v)
    return 'RM' + f'{v:,.2f}'.replace(',', ' ')


BR = [(0, 5000, 0, 0), (5000, 20000, 1, 0), (20000, 35000, 3, 150), (35000, 50000, 8, 600), (50000, 70000, 14, 1800), (70000, 100000, 21, 4600), (100000, 250000, 24, 10900),
      (250000, 400000, D('24.5'), 46900), (400000, 600000, 25, 83650), (600000, 1000000, 26, 133650), (1000000, 2000000, 28, 237650), (2000000, 10 ** 12, 30, 517650)]


def taxparts(p):
    for lo, hi, r, base in BR:
        if lo < p <= hi or (p == 0 and lo == 0):
            return lo, D(str(r)), D(base), q2(D(p - lo) * D(str(r)) / 100)
    raise ValueError


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Membuat kesimpulan', d)], s, 2, fs)


# =====================================================================
# 4.1.1 TUJUAN DAN JENIS CUKAI
# =====================================================================
s = '4.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Tujuan percukaian',
  de(s, 'Percukaian ialah satu proses hasil (wang) dikumpul daripada individu atau syarikat untuk digunakan dalam pembangunan negara dengan menyediakan pelbagai kemudahan (misalnya pendidikan, kesihatan, keselamatan, kebajikan) demi kesejahteraan semua rakyat.')
  + p('Semua hasil cukai dikutip berdasarkan akta-akta yang diluluskan dalam parlimen. Lembaga Hasil Dalam Negeri (LHDN) dan Jabatan Kastam Diraja masing-masing bertanggungjawab atas pungutan cukai langsung dan cukai tidak langsung di Malaysia.'),
  table(['Tujuan percukaian', 'Huraian'], [['Sumber pendapatan kerajaan', 'Untuk mentadbir urus negara, membiayai projek pembangunan negara dan mengagih semula ketidakseimbangan pendapatan dalam masyarakat.'],
                                           ['Alat pelaksanaan polisi kerajaan', 'Contoh: pelepasan cukai untuk rawatan perubatan ibu bapa bagi mewujudkan masyarakat penyayang.'],
                                           ['Kawalan penjualan barangan atau perkhidmatan', 'Cukai dikenakan supaya rakyat mengurangkan pembelian barangan tertentu, misalnya cukai rokok, cukai arak dan cukai perjudian.'],
                                           ['Alat kewangan untuk menstabilkan ekonomi', 'Contoh: Cukai Keuntungan Harta Tanah dikenakan untuk mengurangkan aktiviti pelaburan hartanah yang keterlaluan.']], c, 15, False))

S(s, 'KONSEP', 'Penggunaan hasil cukai dan tanggungjawab pembayar cukai',
  p('Hasil cukai digunakan untuk pembangunan dalam bidang pendidikan, infrastruktur dan kemudahan awam, kesihatan, pertanian dan perindustrian, kebajikan, serta keselamatan dan pertahanan negara.')
  + p('Pembayaran cukai merupakan tanggungjawab rakyat yang wajib dilaksanakan. Rakyat perlu membayar cukai secara jujur dan mematuhi undang-undang supaya kerajaan tidak menanggung kerugian.')
  + note('Perancangan pembangunan negara akan terjejas jika negara kehilangan hasil cukai akibat sikap pembayar cukai yang tidak jujur dan tidak bertanggungjawab.', 'Ingat:'),
  table(['Jenis cukai', 'Pihak yang mengutip'], [['Cukai pendapatan', 'Lembaga Hasil Dalam Negeri (LHDN)'], ['Cukai jalan', 'Jabatan Pengangkutan Jalan (JPJ)'], ['Cukai pintu (cukai taksiran)', 'Pihak berkuasa tempatan (majlis perbandaran atau majlis daerah)'],
                                                 ['Cukai tanah', 'Pihak berkuasa negeri (Pejabat Tanah dan Galian)'], ['Cukai jualan dan perkhidmatan', 'Jabatan Kastam Diraja Malaysia (JKDM)']], c, 16, False))

S(s, 'KONSEP', 'Cukai pendapatan dan kesan pengelakan cukai',
  bul(s, ['Cukai yang dikenakan atas pendapatan yang diperoleh oleh seseorang individu bergaji atau sesebuah syarikat yang beroperasi di Malaysia.', 'Sistem Taksiran Sendiri digunakan: pembayar cukai perlu taksir sendiri, simpan rekod (7 tahun) dan membayar cukai.',
          'Laporkan semua pendapatan, pengecualian, potongan, pelepasan dan rebat dengan mengemukakan Borang Nyata Cukai Pendapatan (BNCP), termasuk secara elektronik melalui ezHasil.', 'Pembayaran boleh dibuat secara sekali gus kepada LHDN atau melalui potongan cukai bulanan (PCB).']),
  stack(table(['Pengelakan cukai', 'Hukuman (Akta Cukai Pendapatan 1967)'], [['Tidak memaklumkan layak dikenakan cukai', 'Denda RM200 hingga RM20 000 atau penjara tidak melebihi 6 bulan atau kedua-duanya'],
                                                                         ['Tidak melaporkan pendapatan sebenar dalam BNCP', 'Denda RM1 000 hingga RM10 000 dan penalti 200% atas cukai terkurang lapor'],
                                                                         ['Sengaja mengelak cukai atau membantu orang lain mengelak cukai', 'Denda RM1 000 hingga RM20 000 atau penjara tidak melebihi 3 tahun atau kedua-duanya dan penalti 300%']], c, 14, False),
        p('* Tertakluk kepada perubahan dari semasa ke semasa.')))

S(s, 'KONSEP', 'Cukai jalan, cukai pintu dan cukai tanah',
  work([('Cukai jalan', ['Cukai yang dikenakan terhadap pengguna jalan raya yang memiliki kenderaan termasuk motosikal dan kereta.', 'Kesan pengelakan: menggunakan kenderaan tanpa cukai jalan yang sah boleh didenda tidak melebihi RM2 000 (Akta Pengangkutan Jalan 1987).']),
        ('Cukai pintu', ['Cukai yang dikenakan kepada semua pegangan atau harta tanah untuk membiayai kos penyelenggaraan bandar seperti mengangkut sampah dan membersihkan longkang. Juga dikenali sebagai cukai taksiran.',
                         'Kesan pengelakan: notis Borang E dikeluarkan; jika masih gagal dalam 15 hari, waran tahanan Borang F dikeluarkan dan harta mudah alih boleh disita (Akta Kerajaan Tempatan 1976).'])], s, 1, 15),
  work([('Cukai tanah', ['Cukai yang dikenakan terhadap pemilik tanah pertanian, tanah perusahaan dan tanah bangunan. Ditafsirkan sebagai sewa bawah Seksyen 5 Kanun Tanah Negara 1965.',
                         'Kesan pengelakan: notis tuntutan Borang 6A dikeluarkan; jika masih gagal, tanah boleh dirampas atau dilucuthak (Kanun Tanah Negara 1965).'])], s, 1, 15)
  + note('Cukai petak dikenakan kepada hak milik strata (misalnya pangsapuri dan kondominium) bagi menggantikan cukai tanah.', 'Info:'))

S(s, 'KONSEP', 'Cukai jualan dan perkhidmatan',
  bul(s, ['Cukai Jualan dan Perkhidmatan mula dikuatkuasakan pada 1 September 2018, terdiri daripada cukai jualan dan cukai perkhidmatan.', 'Cukai jualan dikenakan sekali sahaja atas pelbagai barangan bercukai pada peringkat pengeluaran atau pengimportan.',
          'Cukai perkhidmatan dikenakan terhadap pengguna perkhidmatan bercukai tertentu seperti hotel, insurans, penyediaan makanan dan minuman, telekomunikasi dan kad kredit.', 'Pengutipan cukai perkhidmatan ialah tanggungjawab pembekal perkhidmatan bagi pihak kerajaan.'])
  + note('Cukai jualan dan perkhidmatan tidak dikenakan di wilayah bebas cukai antaranya Pulau Langkawi dan Pengkalan Kubor, Kelantan.', 'Info:'),
  table(['Pengelakan cukai jualan', 'Hukuman (Akta Cukai Jualan 2018)'], [['Kesalahan pertama', 'Denda 10 hingga 20 kali ganda amaun cukai atau penjara tidak melebihi 5 tahun atau kedua-duanya'],
                                                                     ['Kesalahan kedua atau berikutnya', 'Denda 20 hingga 40 kali ganda amaun cukai atau penjara tidak melebihi 7 tahun atau kedua-duanya'],
                                                                     ['Membantu menyediakan penyata cukai kurang benar', 'Denda RM2 000 hingga RM20 000 atau penjara tidak melebihi 3 tahun atau kedua-duanya']], c, 14, False))

# =====================================================================
# 4.1.3 CUKAI PENDAPATAN
# =====================================================================
s = '4.1.3'
c = COL[s]
S(s, 'RUMUS', 'Mengira cukai pendapatan',
  p('Cukai pendapatan yang perlu dibayar dikira melalui proses: hitung pendapatan bercukai → hitung cukai pendapatan → tolak rebat cukai.')
  + formula('Pendapatan bercukai = jumlah pendapatan tahunan − pengecualian cukai − pelepasan cukai', c)
  + formula('Cukai pendapatan = cukai dasar + cukai atas baki − rebat cukai', c),
  table(['Istilah', 'Maksud'], [['Jumlah pendapatan tahunan', 'Segala bentuk upah, gaji, bonus, dividen, faedah, sewa, royalti dan sebagainya. Elaun seperti elaun petrol, subsidi majikan dan manfaat perubatan tidak dikenakan cukai.'],
                                 ['Pengecualian cukai', 'Perbelanjaan dalam bentuk hadiah, derma dan sumbangan kepada kerajaan atau organisasi yang diluluskan, tertakluk kepada had tertentu.'],
                                 ['Pelepasan cukai', 'Perbelanjaan bagi kepentingan diri atau ahli keluarga yang tidak dikenakan cukai, antaranya caruman KWSP, rawatan perubatan dan yuran pengajian.'],
                                 ['Rebat cukai', '(a) RM400 jika pendapatan bercukai tidak melebihi RM35 000. (b) Bayaran zakat atau fitrah.']], c, 15, False))

rows = [['0 – 5 000', '5 000 pertama', '0', '0'], ['5 001 – 20 000', '5 000 pertama<br>15 000 berikutnya', '1', '0<br>150'], ['20 001 – 35 000', '20 000 pertama<br>15 000 berikutnya', '3', '150<br>450'],
        ['35 001 – 50 000', '35 000 pertama<br>15 000 berikutnya', '8', '600<br>1 200'], ['50 001 – 70 000', '50 000 pertama<br>20 000 berikutnya', '14', '1 800<br>2 800'], ['70 001 – 100 000', '70 000 pertama<br>30 000 berikutnya', '21', '4 600<br>6 300'],
        ['100 001 – 250 000', '100 000 pertama<br>150 000 berikutnya', '24', '10 900<br>36 000']]
S(s, 'KONSEP', 'Jadual kadar cukai pendapatan individu',
  p('Selepas pendapatan bercukai diperoleh, cukai pendapatan boleh ditentukan dengan merujuk jadual kadar cukai. Kadar cukai ditetapkan oleh kerajaan dan boleh berubah mengikut polisi kerajaan pada belanjawan tahunan.')
  + note('Cukai pendapatan merupakan sejenis cukai progresif yang mana kadar cukai semakin tinggi apabila pendapatan bertambah.', 'Info:')
  + p('Jadual di sebelah ialah sebahagian kadar cukai pendapatan individu untuk Tahun Taksiran 2020 (banjaran sehingga RM250 000).'),
  stack(table(['Pendapatan bercukai (RM)', 'Pengiraan (RM)', 'Kadar (%)', 'Cukai (RM)'], rows, c, 13), p('* Tertakluk kepada perubahan. Sumber: Portal Rasmi LHDN')))

inc1, ex1, don1, rel1 = 118600, 10200, 1500, 21800
pb1 = inc1 - ex1 - don1 - rel1
assert pb1 == 85100
pb2, z2 = 43250, 350
lo, r, base, top = taxparts(pb2)
t2 = base + top - z2
assert (lo, base, top, t2) == (35000, 600, D('660.00'), D('910.00'))
S(s, 'CONTOH 1', 'Pendapatan bercukai dan cukai pendapatan',
  p('<b>CONTOH 1</b> Encik Hakimi memperoleh pendapatan tahunan sebanyak RM118 600 termasuk elaun. Diberi bahawa elaun-elaun berjumlah RM10 200 adalah dikecualikan cukai. Dia memberi derma kepada perpustakaan berjumlah RM1 500. Jumlah pelepasannya ialah RM21 800. Hitung pendapatan bercukai Encik Hakimi.')
  + work([('Penyelesaian', ['Jumlah pendapatan tahunan = RM118 600 − RM10 200 = RM108 400', 'Pendapatan bercukai = jumlah pendapatan tahunan − pengecualian cukai − pelepasan cukai', '= RM108 400 − RM1 500 − RM21 800 = RM85 100'])], s, 1, 17),
  stack(p('<b>CONTOH 2</b> Faizal mempunyai pendapatan bercukai sebanyak RM43 250 pada tahun 2020. Dia telah membayar zakat berjumlah RM350. Hitung cukai pendapatan yang perlu dibayar oleh Faizal bagi tahun tersebut.'),
        work([('Penyelesaian', ['RM43 250 terletak pada banjaran RM35 001 – RM50 000 (kadar 8%).', 'Cukai bagi RM35 000 pertama = RM600 (cukai dasar)', 'Cukai atas baki berikutnya = (RM43 250 − RM35 000) × 8% = RM660', 'Rebat yang layak (zakat) = RM350',
                                'Cukai pendapatan = RM600 + RM660 − RM350 = RM910'])], s, 1, 16)))

inc3, don3 = 54380, 400
rel3 = [('Individu', 9000), ('Insurans hayat dan KWSP (had RM7 000)', 6200), ('Insurans perubatan (had RM3 000)', 1500), ('Yuran pengajian sendiri (had RM7 000)', 3500)]
pb3 = inc3 - don3 - sum(v for _, v in rel3)
lo, r, base, top = taxparts(pb3)
t3 = base + top - 400
assert pb3 == 33780 and top == D('413.40') and t3 == D('163.40')
S(s, 'CONTOH 3', 'Cukai pendapatan dengan rebat RM400',
  p('Encik Tan mempunyai jumlah pendapatan tahunan sebanyak RM54 380 pada tahun 2020. Beliau telah mendermakan RM400 kepada sebuah badan kebajikan yang diluluskan oleh kerajaan. Jadual menunjukkan pelepasan cukai yang dituntutnya. Hitung cukai pendapatan yang perlu dibayar dengan mengambil kira rebat cukai sekiranya layak.')
  + table(['Pelepasan cukai', 'Amaun (RM)'], [[a, f'{v:,}'.replace(',', ' ')] for a, v in rel3], c, 16),
  work([('Penyelesaian', ['Pendapatan bercukai = RM54 380 − RM400 − (RM9 000 + RM6 200 + RM1 500 + RM3 500)', '= RM33 780', 'RM33 780 terletak pada banjaran RM20 001 – RM35 000 (kadar 3%).', 'Cukai bagi RM20 000 pertama = RM150',
                          'Cukai atas baki berikutnya = (RM33 780 − RM20 000) × 3% = RM413.40', 'Rebat yang layak = RM400 (pendapatan bercukai &lt; RM35 000)', 'Cukai pendapatan = RM150 + RM413.40 − RM400 = RM163.40'])], s, 1, 17))

inc4, don4, pcb = 78000, 1200, 190
rel4 = 9000 + 7000 + 1500 + 1800
pb4 = inc4 - don4 - rel4
lo, r, base, top = taxparts(pb4)
t4 = base + top
assert pb4 == 57500 and top == D('1050.00') and t4 == D('2850.00') and pcb * 12 == 2280 and t4 - 2280 == 570
S(s, 'CONTOH 4', 'Potongan cukai bulanan (PCB)',
  p('Potongan Cukai Bulanan (PCB) ialah potongan pendapatan pekerja untuk bayaran cukai pendapatan tahun semasa. Jika cukai yang perlu dibayar &gt; PCB, bayaran cukai yang tidak mencukupi perlu dijelaskan kepada LHDN. Jika cukai &lt; PCB, lebihan potongan akan dipulangkan.')
  + p('<b>CONTOH 4</b> Gaji tahunan Encik Wong ialah RM78 000 pada tahun 2020. Dia menuntut pelepasan individu RM9 000, insurans hayat dan KWSP RM7 000, insurans perubatan RM1 500 dan perbelanjaan rawatan perubatan ibu RM1 800. Dia juga mendermakan RM1 200 kepada pusat kebajikan yang diluluskan. Setiap bulan gajinya dipotong RM190 untuk PCB. (a) Hitung cukai pendapatan yang perlu dibayar. (b) Adakah Encik Wong perlu membuat bayaran baki cukai pendapatan? Jelaskan.'),
  work([('(a)', ['Pendapatan bercukai = RM78 000 − RM1 200 − (RM9 000 + RM7 000 + RM1 500 + RM1 800) = RM57 500', 'Cukai bagi RM50 000 pertama = RM1 800', 'Cukai atas baki = (RM57 500 − RM50 000) × 14% = RM1 050',
                 'Rebat = RM0 (pendapatan bercukai &gt; RM35 000)', 'Cukai pendapatan = RM1 800 + RM1 050 = RM2 850']),
        ('(b)', ['Jumlah PCB = RM190 × 12 = RM2 280', 'Cukai yang perlu dibayar &gt; PCB, maka bayaran cukai tidak mencukupi = RM2 850 − RM2 280 = RM570', 'Encik Wong perlu membayar RM570 kepada LHDN.'])], s, 1, 16))

hs, ws, dn = 56000, 58000, 600
relH = {'Individu': 9000, 'Gaya hidup (had RM2 500)': 2500, 'Insurans hayat (had RM7 000)': 5900, 'Insurans perubatan (had RM3 000)': 2700}
relW = {'Individu': 9000, 'Gaya hidup (had RM2 500)': 2800, 'Insurans hayat (had RM7 000)': 6200, 'Insurans perubatan (had RM3 000)': 2400}
cap = {'Individu': 9000, 'Gaya hidup (had RM2 500)': 2500, 'Insurans hayat (had RM7 000)': 7000, 'Insurans perubatan (had RM3 000)': 3000}
relHc = {k: min(v, cap[k]) for k, v in relH.items()}
relWc = {k: min(v, cap[k]) for k, v in relW.items()}
pbJ = hs + ws - 2 * dn - sum(cap.values())
pbH = hs - dn - sum(relHc.values())
pbW = ws - dn - sum(relWc.values())
_, _, bJ, tJ = taxparts(pbJ)
_, _, bH, tH = taxparts(pbH)
_, _, bW, tW = taxparts(pbW)
TJ, TH, TW = bJ + tJ, bH + tH, bW + tW
assert pbJ == 91300 and TJ == D('9073.00') and pbH == 35300 and TH == D('624.00') and pbW == 37300 and TW == D('784.00')
S(s, 'CONTOH 5', 'Taksiran cukai bersama dan taksiran cukai berasingan',
  p('<b>Taksiran cukai bersama:</b> pendapatan isteri (atau suami) dijumlahkan dengan pendapatan suami (atau isteri). <b>Taksiran cukai berasingan:</b> suami dan isteri masing-masing membuat taksiran secara berasingan.')
  + p('<b>CONTOH 5</b> Pada tahun 2020, Encik Ravi dan isterinya mendapat gaji tahunan RM56 000 dan RM58 000. Mereka masing-masing mendermakan RM600 kepada badan kebajikan yang diluluskan. (a) Hitung jumlah cukai pendapatan dengan taksiran cukai bersama dan taksiran cukai berasingan. (b) Taksiran manakah lebih sesuai? Jelaskan.')
  ,
  stack(table(['Pelepasan', 'Encik Ravi', 'Isteri'], [[k, RM(relH[k]), RM(relW[k])] for k in relH], c, 15), note('Walaupun taksiran dibuat bersama, had tuntutan pelepasan tetap dikira sekali sahaja.', 'Info:'),
        p('Secara umumnya, taksiran cukai bersama boleh menyebabkan jumlah pelepasan menjadi berkurang kerana kebanyakan pelepasan mempunyai had tuntutan. Hal ini boleh menyebabkan pembayaran cukai meningkat.')))

S(s, 'CONTOH 5 (sambungan)', 'Membandingkan taksiran cukai bersama dan berasingan',
  table(['Perkara', 'Bersama', 'Ravi', 'Isteri'],
        [['Jumlah pendapatan', 'RM114 000', 'RM56 000', 'RM58 000'], ['Pengecualian (derma)', '− RM1 200', '− RM600', '− RM600'],
         ['Pelepasan', '− RM21 500', f'− {RM(sum(relHc.values()))}', f'− {RM(sum(relWc.values()))}'], ['Pendapatan bercukai', RM(pbJ), RM(pbH), RM(pbW)],
         ['Cukai dasar', 'RM4 600', 'RM600', 'RM600'], ['Cukai atas baki', f'RM21 300 × 21% = {RM(tJ)}', f'RM300 × 8% = {RM(tH)}', f'RM2 300 × 8% = {RM(tW)}'], ['Cukai pendapatan', RM(TJ), RM(TH), RM(TW)]], c, 15, False),
  p(f'(b) Taksiran cukai berasingan lebih sesuai kerana jumlah cukai {RM(TH + TW)} jauh lebih rendah berbanding {RM(TJ)} melalui taksiran cukai bersama.'))

# =====================================================================
# 4.1.4 CUKAI JALAN, PINTU, TANAH DAN SST
# =====================================================================
s = '4.1.4'
c = COL[s]
cj = 280 + (1860 - 1800) * D('0.50')
assert cj == D('310.00')
S(s, 'CONTOH 6', 'Mengira cukai jalan',
  p('<b>CONTOH 6</b> Encik Wan Ali memiliki sebuah motosikal kegunaan persendirian di Sarawak dengan kapasiti enjin 230 cc. Hitung cukai jalan untuk motosikalnya.')
  + table(['Motosikal (Sabah dan Sarawak)', 'Kadar asas'], [['151 cc – 200 cc', 'RM9.00'], ['201 cc – 250 cc', 'RM12.00'], ['251 cc – 500 cc', 'RM30.00']], c, 15)
  + work([('Penyelesaian', ['Cukai jalan motosikal (230 cc) = RM12.00'])], s, 1, 17),
  stack(p('<b>CONTOH 7</b> Aliya memiliki dua buah kereta persendirian di Melaka (998 cc dan 1 860 cc). Hitung cukai jalan kedua-dua keretanya.'),
        table(['Kereta persendirian (Semenanjung)', 'Kadar asas', 'Kadar progresif'], [['1 000 cc dan ke bawah', 'RM20.00', '–'], ['1 001 – 1 200 cc', 'RM55.00', '–'], ['1 201 – 1 400 cc', 'RM70.00', '–'], ['1 401 – 1 600 cc', 'RM90.00', '–'],
                                                                                       ['1 601 – 1 800 cc', 'RM200.00', '+ RM0.40 setiap cc melebihi 1 600 cc'], ['1 801 – 2 000 cc', 'RM280.00', '+ RM0.50 setiap cc melebihi 1 800 cc']], c, 13),
        work([('Penyelesaian', ['Cukai jalan kereta (998 cc) = RM20.00', 'Kereta 1 860 cc = RM280.00 + (1 860 − 1 800) × RM0.50 = RM310.00'])], s, 1, 15)))

assert D('0.04') * 7200 == 288 and q2(D('0.45') * 150) == D('67.50') and q2(D(260) * 3 * D('0.06')) == D('46.80')
S(s, 'CONTOH 8', 'Cukai pintu, cukai tanah dan cukai perkhidmatan',
  formula('Jumlah cukai pintu = kadar cukai pintu × nilai tahunan', c)
  + p('Nilai tahunan = anggaran sewa bulanan × 12 bulan, iaitu anggaran kasar sewa tahunan yang munasabah jika pegangan itu disewakan.')
  + work([('CONTOH 8', ['Mariani memiliki sebuah rumah kediaman di Kajang. Nilai tahunan ialah RM7 200 dan kadar cukai pintu ialah 4%. Hitung cukai pintu yang perlu dibayar untuk setiap setengah tahun.',
                        'Jumlah cukai pintu = 4% × RM7 200 = RM288 setahun', f'Cukai pintu setiap setengah tahun = {F("RM288", 2)} = RM144'])], s, 1, 16),
  stack(formula('Jumlah cukai tanah = kadar cukai tanah setiap unit keluasan × jumlah keluasan tanah', c),
        work([('CONTOH 9', ['Encik Hamid memiliki sebuah rumah berkeluasan 150 m². Kadar cukai tanah ialah RM0.45 setiap meter persegi. Hitung jumlah cukai tanah setiap tahun.', 'Jumlah cukai tanah = RM0.45 × 150 = RM67.50 setahun']),
              ('CONTOH 10', ['Kadar cukai perkhidmatan ialah 6%. Sofia menyewa bilik hotel dengan harga RM260 semalam selama tiga malam. Hitung cukai perkhidmatan yang perlu dibayar.', 'Cukai perkhidmatan = RM260 × 3 × 6% = RM46.80'])], s, 1, 15)))

pb11, z11 = 28450, 260
_, _, b11, t11 = taxparts(pb11)
assert b11 + t11 == D('403.50') and b11 + t11 - 660 < 0
S(s, 'CONTOH 11', 'Menyelesaikan masalah percukaian',
  p('Nurul mempunyai pendapatan bercukai sebanyak RM28 450 pada tahun 2020. Dia telah membayar zakat berjumlah RM260 pada tahun tersebut. (a) Berapakah jumlah rebat cukai Nurul? (b) Hitung cukai pendapatan yang perlu dibayar oleh Nurul.'),
  ps4(['Pendapatan bercukai = RM28 450', 'Rebat (zakat) = RM260'], ['(a) Tentukan rebat zakat dan rebat pendapatan bercukai &lt; RM35 000.', '(b) Hitung cukai pendapatan dengan merujuk jadual kadar cukai dan jumlah rebat.'],
      ['(a) Jumlah rebat = RM400 + RM260 = RM660', '(b) Cukai bagi RM20 000 pertama = RM150', 'Cukai atas baki = (RM28 450 − RM20 000) × 3% = RM253.50', 'RM150 + RM253.50 − RM660 = −RM256.50', 'Jadi, cukai yang perlu dibayar = RM0'],
      ['(a) RM660', '(b) RM0', 'Rebat yang berlebihan tidak akan dibayar balik kepada pembayar cukai.'], s, 15))

pb12 = 72000 - 800 - (9000 + 6500)
_, _, b12, t12 = taxparts(pb12)
assert pb12 == 55700 and t12 == D('798.00') and b12 + t12 - 600 == D('1998.00')
S(s, 'CONTOH 12', 'Pelepasan cukai dan rebat cukai',
  p('Encik Azlan mempunyai pendapatan tahunan RM72 000 pada tahun 2020. Pelepasan individu RM9 000, insurans hayat dan KWSP RM6 500, derma kepada perpustakaan RM800 dan bayaran zakat RM600. (a) Hitung pendapatan bercukai. (b) Hitung cukai pendapatan yang perlu dibayar. (c) Bincangkan perbezaan antara pelepasan cukai dengan rebat cukai.'),
  ps4(['Pendapatan tahunan = RM72 000', 'Pelepasan = RM9 000 + RM6 500', 'Pengecualian derma = RM800', 'Zakat = RM600'], ['(a) Tentukan pendapatan bercukai.', '(b) Hitung cukai dengan jadual kadar cukai dan rebat.', '(c) Bezakan maksud pelepasan dan rebat.'],
      ['(a) RM72 000 − RM800 − (RM9 000 + RM6 500) = RM55 700', '(b) Cukai bagi RM50 000 pertama = RM1 800', 'Cukai atas baki = (RM55 700 − RM50 000) × 14% = RM798', 'Cukai pendapatan = RM1 800 + RM798 − RM600 = RM1 998'],
      ['(a) RM55 700', '(b) RM1 998', '(c) Pelepasan cukai ditolak daripada pendapatan tahunan manakala rebat cukai ditolak daripada cukai pendapatan yang dikenakan.'], s, 15))

blk = [(200, D('0.218')), (100, D('0.334')), (300, D('0.516')), (80, D('0.546'))]
am = [q2(u * r_) for u, r_ in blk]
untaxed = sum(am[:3])
st = q2(am[3] * D('0.06'))
assert am == [D('43.60'), D('33.40'), D('154.80'), D('43.68')] and untaxed == D('231.80') and st == D('2.62')
S(s, 'CONTOH 13', 'Cukai perkhidmatan dalam bil elektrik',
  p('Encik Lee telah menggunakan 680 kWj elektrik pada bulan November. Penggunaan yang melebihi 600 kWj dalam sebulan dikenakan cukai perkhidmatan sebanyak 6%. Jadual menunjukkan bil elektrik rumah kediaman Encik Lee.')
  + table(['Blok tarif (kWj)', 'Blok prorata (kWj)', 'Kadar (RM)', 'Amaun (RM)'], [['200', '200', '0.218', '43.60'], ['100', '100', '0.334', i('x') if False else '<i>x</i>'], ['300', '300', '0.516', '<i>y</i>'], ['300', '80', '0.546', '<i>z</i>']], c, 15)
  + p('(a) Hitung nilai <i>x</i>, <i>y</i> dan <i>z</i>. (b) Hitung jumlah bayaran yang tidak dikenakan cukai perkhidmatan. (c) Hitung cukai perkhidmatan yang dikenakan.'),
  ps4(['Jumlah penggunaan elektrik = 680 kWj', 'Kadar cukai perkhidmatan = 6%'], ['Hitung amaun setiap blok, kemudian kenal pasti bahagian yang melebihi 600 kWj.'],
      ['(a) <i>x</i> = 100 × 0.334 = 33.40; <i>y</i> = 300 × 0.516 = 154.80; <i>z</i> = 80 × 0.546 = 43.68', '(b) RM43.60 + RM33.40 + RM154.80 = RM231.80', '(c) RM43.68 × 6% = RM2.62'],
      ['(a) <i>x</i> = 33.40, <i>y</i> = 154.80, <i>z</i> = 43.68', '(b) RM231.80', '(c) RM2.62'], s, 15))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'percukaian', 'slides.js')
HEAD = '/* Nota Bab 4 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
