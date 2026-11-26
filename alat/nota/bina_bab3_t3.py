"""Bab 3 T3 Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang. Nota ikut buku teks (ayat buku, nombor dan nama ditukar)."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
from graf import TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "3.1", "name": "Simpanan & Pelaburan", "col": "#34D399"}, {"no": "3.2", "name": "Kredit & Hutang", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def R(v):
    return 'RM' + f'{v:,.2f}'.replace(',', ' ')


def R0(v):
    return 'RM' + f'{v:,.0f}'.replace(',', ' ')


def r2(v):
    return round(v + 1e-9, 2)


def kp(P_, r, n, t):
    return r2(P_ * (1 + r / n) ** (n * t))


FM = f'<i>I</i> = <i>Prt</i>'
MV = f'<i>MV</i> = <i>P</i>(1 + {fr("<i>r</i>", "<i>n</i>")})<sup><i>nt</i></sup>'

# =====================================================================
# 3.1 SIMPANAN DAN PELABURAN
# =====================================================================
s = '3.1'
c = COL[s]
S(s, 'DEFINISI', 'Simpanan',
  de(s, '<b>Simpanan</b> merujuk kepada wang lebihan yang disimpan di dalam peti besi, tabung atau laci. Wang lebihan juga boleh disimpan di bank yang akan memberi pulangan mengikut kadar faedah dan tempoh simpanan.')
  + p('Terdapat beberapa jenis cara simpanan yang lazim di bank.')
  + note('Agensi kaunseling dan pengurusan kredit menggalakkan setiap individu menabung 10% daripada pendapatan bulanan mereka.', 'Buletin:'),
  table(['Jenis akaun', 'Ciri'], [
      ['Akaun Simpanan', 'Pemegang akaun boleh menyimpan sebarang amaun mengikut kemampuannya. Kadar faedah adalah lebih rendah berbanding dengan akaun simpanan tetap. Wang simpanan boleh dikeluarkan pada bila-bila masa.'],
      ['Akaun Simpanan Tetap', 'Menyimpan sejumlah wang tertentu untuk satu tempoh masa tertentu seperti 3 bulan, 9 bulan atau 1 tahun. Kadar faedah lebih kompetitif. Wang simpanan tidak boleh dikeluarkan sehingga tempoh matang.'],
      ['Akaun Semasa', 'Boleh digunakan untuk tujuan peribadi atau perniagaan. Pembayaran kepada pihak lain melalui cek. Simpanan tidak dibayar faedah sebaliknya dikenakan caj perkhidmatan. Ada kemudahan overdraf.']], c, 16, center=False))

S(s, 'DEFINISI', 'Pelaburan',
  de(s, '<b>Pelaburan</b> ialah langkah alternatif untuk mendapatkan pulangan pada masa hadapan dalam bentuk pendapatan semasa dan keuntungan modal.')
  + p('Jenis-jenis pelaburan adalah seperti saham, amanah saham dan hartanah.')
  + note('Terdapat dua jenis pelabur iaitu pelabur agresif (melabur di pasaran saham) dan pelabur sederhana (membeli amanah saham, bon dan dana ekuiti).', 'Buletin:'),
  cards(card('SAHAM', 'Pemilik syarikat', 'Sesebuah syarikat akan menerbitkan saham bagi tujuan mengumpul modal. Pemegang saham akan menerima pulangan dalam bentuk dividen dan keuntungan modal.', TR),
        card('AMANAH SAHAM', 'Diurus pengurus profesional', 'Syarikat unit amanah mengumpulkan wang daripada para pelabur dan wang itu dilaburkan dalam portfolio pelaburan yang pelbagai.', PK),
        card('HARTANAH', 'Aset tidak alih', 'Pelaburan atas rumah kediaman, kedai, tanah dan sebagainya. Faktor: keadaan ekonomi, keupayaan menjana sewa, lokasi serta prospek hartanah.', AM)))

assert 5000 * 0.03 * 1 == 150
S(s, 'RUMUS', 'Faedah mudah',
  p('Faedah simpanan merupakan ganjaran yang dibayar oleh institusi kewangan seperti bank kepada penyimpan. Faedah boleh dibahagi kepada dua jenis iaitu <b>faedah mudah</b> dan <b>faedah kompaun</b>.')
  + de(s, '<b>Faedah mudah</b> ialah ganjaran yang diberikan kepada penyimpan mengikut suatu kadar tertentu ke atas jumlah wang simpanan (prinsipal) untuk suatu tempoh masa (dalam tahun) yang tertentu.')
  + formula(FM, c)
  + p('<i>I</i> ialah faedah (<i>interest</i>), <i>P</i> ialah prinsipal (<i>principal</i>), <i>r</i> ialah kadar faedah (<i>rate</i>) dan <i>t</i> ialah masa (<i>time</i>) dalam tahun.'),
  stack(work([('CONTOH 1', ['Encik Hafiz menyimpan sebanyak RM5 000 di Bank Murni dengan kadar faedah 3% setahun. Berapakah faedah yang diperoleh Encik Hafiz selepas 1 tahun?']),
                            ('Penyelesaian:', [f'3% daripada RM5 000 = RM5 000 × {fr(3, 100)} = RM150', 'Selepas 1 tahun, faedah yang diperoleh Encik Hafiz ialah RM150.'])], s, 1, 19),
                      note('Kadar diberi dalam bentuk peratus. Jadi, kita mesti bahagi dengan 100. Jika tempoh diberi dalam bulan, tukarkan kepada tahun dengan membahagikan dengan 12.', 'Tip:')))

assert 6000 * 0.04 * 3 == 720 and abs(12000 * 0.05 * 9 / 12 - 450) < 1e-9
S(s, 'CONTOH 2', 'Mengira faedah mudah',
  p('Puan Aini menyimpan RM6 000 di bank dengan kadar faedah 4% setahun bagi tempoh 3 tahun. Hitung jumlah faedah yang diperoleh Puan Aini bagi tempoh tersebut.')
  + work([('', ['<i>P</i> = 6 000, <i>r</i> = 4% = ' + fr(4, 100) + ' = 0.04, <i>t</i> = 3', f'Maka, faedah, {FM}', f'= RM6 000 × {fr(4, 100)} × 3', '= RM720'])], s, 1, 19)
  , work([('CONTOH 3', ['Cik Mei menyimpan sebanyak RM12 000 di Bank Murni dengan kadar faedah 5% setahun. Hitung jumlah faedah yang diperoleh Cik Mei selepas 9 bulan.']),
          ('Penyelesaian:', ['9 bulan = ' + fr(9, 12) + ' tahun', FM, f'= RM12 000 × {fr(5, 100)} × {fr(9, 12)}', '= RM450'])], s, 1, 19))

assert 9000 * 0.04 * 2 == 720 and abs(9000 * 0.04 * 3 - 1080) < 1e-9 and 6000 * 0.04 == 240 and 6000 * 0.05 == 300
S(s, 'CONTOH 4', 'Kesan tempoh dan kadar faedah',
  p('Perubahan dalam tempoh simpanan akan membawa pulangan yang berbeza.')
  + p('<b>CONTOH 4</b> Encik Nazrin menyimpan sebanyak RM9 000 di Bank Desa dengan kadar faedah 4% setahun. Hitung jumlah simpanan Encik Nazrin selepas (a) 2 tahun (b) 3 tahun')
  + table(['(a) 2 tahun', '(b) 3 tahun'], [[f'Faedah = RM9 000 × {fr(4, 100)} × 2 = RM720', f'Faedah = RM9 000 × {fr(4, 100)} × 3 = RM1 080'],
                                          ['Jumlah simpanan = RM9 000 + RM720 = RM9 720', 'Jumlah simpanan = RM9 000 + RM1 080 = RM10 080']], c, 16)
  + note('Semakin lama tempoh penyimpanan (di bank), maka semakin tinggi jumlah faedah yang akan diterima. Dengan ini secara langsung jumlah simpanan juga bertambah.', 'Kesimpulan:'),
  stack(p('<b>CONTOH 5</b> Puan Vanmathy menyimpan sebanyak RM6 000 di sebuah bank. Berapakah jumlah simpanan Puan Vanmathy selepas 1 tahun jika kadar faedah yang diberikan ialah (a) 4% setahun (b) 5% setahun'),
        table(['Kadar faedah', 'Jumlah faedah', 'Jumlah simpanan'], [['4%', f'RM6 000 × {fr(4, 100)} × 1 = RM240', 'RM6 240'], ['5%', f'RM6 000 × {fr(5, 100)} × 1 = RM300', 'RM6 300']], c, 16),
        note('Beza jumlah faedah yang diterima = RM300 − RM240 = RM60. Semakin tinggi kadar faedah, semakin tinggi pulangan.', 'Kesimpulan:')))

assert kp(9000, 0.04, 1, 2) == 9734.4
S(s, 'RUMUS', 'Faedah kompaun',
  de(s, '<b>Faedah kompaun</b> ialah faedah yang dihitung berdasarkan prinsipal asal dan juga faedah yang terkumpul daripada tempoh penyimpanan sebelumnya.')
  + p('Bagi faedah kompaun, kekerapan pengkompaunan ke atas prinsipal boleh berbeza. Contohnya, dikompaun setahun sekali ataupun 3 bulan sekali dan sebagainya.')
  + formula(MV, c)
  + note('<i>MV</i> = nilai matang, <i>P</i> = prinsipal, <i>r</i> = kadar faedah tahunan, <i>n</i> = bilangan kali faedah dikompaun dalam setahun, <i>t</i> = tempoh dalam tahun', 'Ingat:'),
  work([('Merujuk kepada Contoh 4(a)', ['Sekiranya Encik Nazrin diberikan faedah kompaun dengan pengkompaunan sekali setahun, jumlah simpanan beliau pada akhir tahun kedua:']),
        ('Tahun pertama', [f'Faedah = RM9 000 × {fr(4, 100)} = RM360', 'Jumlah simpanan = RM9 000 + RM360 = RM9 360']),
        ('Tahun kedua', ['Faedah dihitung berdasarkan RM9 360.', f'Faedah = RM9 360 × {fr(4, 100)} = RM374.40', 'Jumlah simpanan = RM9 360 + RM374.40 = RM9 734.40']),
        ('Dengan rumus', ['<i>P</i> = 9 000, <i>r</i> = 0.04, <i>n</i> = 1, <i>t</i> = 2', f'<i>MV</i> = RM9 000(1 + {fr("0.04", 1)})<sup>(1)(2)</sup> = RM9 734.40'])], s, 1, 18))

v6 = kp(20000, 0.06, 2, 2); v7a = kp(12000, 0.06, 4, 1); v7b = kp(12000, 0.06, 12, 1)
assert v6 == 22510.18 and v7a == 12736.36 and v7b == 12740.13
S(s, 'CONTOH 6', 'Mengira faedah kompaun',
  p('Pada awal tahun, Puan Liew menyimpan RM20 000 dalam akaun simpanan di bank dengan kadar faedah 6% setahun dan pengkompaunan setiap 6 bulan. Berapakah jumlah wang Puan Liew pada akhir tahun kedua?')
  + work([('', ['<i>P</i> = 20 000, <i>r</i> = 0.06, <i>n</i> = 2, <i>t</i> = 2', MV, f'= RM20 000(1 + {fr("0.06", 2)})<sup>(2)(2)</sup>', '= RM20 000(1.1255)', '= RM22 510.18'])], s, 1, 19)
  + note('Jumlah simpanan akan meningkat jika faedah terkumpul dikompaun dengan kerap.', 'Kuiz:'),
  work([('CONTOH 7', ['Sebuah bank menawarkan kadar faedah 6% setahun untuk simpanan dalam akaun simpanan tetap. Jika Iskandar menyimpan RM12 000 dalam akaun simpanan tetap, berapakah jumlah wang beliau pada akhir tahun pertama jika faedah dikompaun (a) suku tahun sekali (b) bulanan']),
        ('(a) <i>n</i> = 4', [f'<i>MV</i> = RM12 000(1 + {fr("0.06", 4)})<sup>(4)(1)</sup>', '= RM12 736.36']), ('(b) <i>n</i> = 12', [f'<i>MV</i> = RM12 000(1 + {fr("0.06", 12)})<sup>(12)(1)</sup>', '= RM12 740.13']),
        ('', ['Daripada Contoh 7, didapati bahawa semakin kerap pengkompaunan bertambah, maka nilai matang juga semakin bertambah.'])], s, 1, 18))

v8 = kp(8000, 0.05, 4, 3)
assert v8 == 9286.04 and 8000 * 0.05 * 3 == 1200 and r2(v8 - 8000 - 1200) == 86.04 and 750 / 25000 * 100 == 3
S(s, 'CONTOH 8', 'Faedah mudah berbanding faedah kompaun',
  p('Encik Charles menyimpan sebanyak RM8 000 dalam akaun simpanan di Bank Berjaya selama 3 tahun dengan kadar faedah 5% setahun. Apakah perbezaan di antara jumlah faedah mudah dengan faedah kompaun (dengan pengkompaunan 3 bulan sekali) bagi simpanan tersebut?')
  + note('Berdasarkan Contoh 8, faedah kompaun membawa pulangan yang lebih tinggi berbanding dengan faedah mudah.', 'Kesimpulan:'),
  work([('Faedah mudah', [f'Faedah, <i>I</i> = RM8 000 × {fr(5, 100)} × 3 = RM1 200']),
        ('Faedah kompaun', [f'<i>MV</i> = RM8 000(1 + {fr("0.05", 4)})<sup>(4)(3)</sup> = RM9 286.04', 'Jumlah faedah terkumpul = RM9 286.04 − RM8 000 = RM1 286.04']),
        ('', ['Maka, perbezaan jumlah faedah = RM1 286.04 − RM1 200 = RM86.04'])], s, 1, 19))

S(s, 'CONTOH 9', 'Perbankan Islam',
  stack(
        p('Malaysia mengamalkan perbankan Islam selain sistem perbankan konvensional. Perbankan Islam berdasarkan hukum Islam (syarak), risiko diuruskan mengikut prinsip perjanjian, mengikut prinsip keadilan, halal dan perkongsian keuntungan dan tanpa riba.'),
        note('Prinsip wadiah: harta atau wang yang diterima oleh penyimpan sebagai amanah untuk disimpan. Pihak bank bertanggungjawab atas keselamatan harta atau wang itu.', 'Buletin:')),
  stack(work([('CONTOH 9', ['Encik Osman menyimpan RM25 000 dalam akaun simpanan di bank Islam. Selepas satu tahun, beliau menerima hibah sebanyak RM750. Hitung peratus hibah yang diterima oleh Encik Osman.']),
              ('Penyelesaian:', [f'Peratus hibah = {fr("RM750", "RM25 000")} × 100% = 3%'])], s, 1, 19),
        note('Hibah ialah pemberian sukarela oleh bank. Kadar 3% ini sebagai rujukan sahaja pada masa akan datang kerana bukan bersifat tetap.', 'Nota:')))

ROI = f'Nilai pulangan pelaburan = {fr("Jumlah pulangan", "Nilai pelaburan awal")} × 100%'
assert 6 / 100 * (4000 * 1.50) == 360 and abs((1.80 - 1.50) * 4000 - 1200) < 1e-9 and abs(1560 / 6000 * 100 - 26) < 1e-9
S(s, 'RUMUS', 'Nilai pulangan pelaburan (ROI)',
  de(s, 'Nilai pulangan pelaburan merujuk kepada nilai pulangan atas setiap ringgit yang dilaburkan oleh pelabur. Dalam erti kata lain, nilai pulangan pelaburan juga merupakan nisbah keuntungan atau kerugian yang diperoleh daripada suatu pelaburan.')
  + p('Sesuatu pelaburan dianggap sebagai menguntungkan (pelaburan yang bijak) apabila nilai pelaburan semasa dan jumlah pulangan yang diterima adalah melebihi nilai pelaburan asal.')
  + formula(ROI, c),
  stack(cards(card('MENGUNTUNGKAN', 'Pelaburan yang bijak', 'Nilai pelaburan semasa dan jumlah pulangan melebihi nilai pelaburan asal.', GR),
              card('TIDAK MENGUNTUNGKAN', 'Rugi', 'Jumlah pulangan dan nilai pulangan semasa kurang daripada nilai pelaburan asal.', PK)),
        note('Amanah saham adalah alternatif pelaburan yang baik untuk pelaburan jangka masa sederhana (3 ke 5 tahun) dan jangka panjang (lebih daripada 5 tahun).', 'Ingat:')))

S(s, 'CONTOH 10', 'Pulangan atas pelaburan amanah saham',
  p('Pada 1 Januari 2018, Encik Faris melabur dalam amanah saham sebanyak 4 000 unit yang bernilai RM1.50 seunit. Bagi tahun kewangan berakhir pada 31 Disember 2018, amanah saham membayar dividen sebanyak 6%. Pada 1 Januari 2019 Encik Faris menjual semua unit saham yang dimiliki dengan harga RM1.80 seunit. Berapakah nilai pulangan pelaburan bagi Encik Faris?')
  + note('Pulangan amanah saham terdiri daripada dividen (lazimnya diterima pada akhir tahun kewangan), syer bonus dan keuntungan modal (peningkatan harga saham apabila saham dijual).', 'Buletin:'),
  work([('Penyelesaian:', ['Modal awal = 4 000 × RM1.50 = RM6 000', f'Dividen = {fr(6, 100)} × RM6 000 = RM360', 'Peningkatan harga saham = RM1.80 − RM1.50 = RM0.30', 'Keuntungan modal = RM0.30 × 4 000 unit = RM1 200',
                           'Jumlah pulangan = RM360 + RM1 200 = RM1 560', f'Nilai pulangan pelaburan = {fr("RM1 560", "RM6 000")} × 100% = 26%'])], s, 1, 20))

km11 = 1100000 - 400000 - 50000 - 12000 - 12000 - 15000 - 380000
assert km11 == 231000 and 180000 + km11 == 411000 and abs(411000 / 500000 * 100 - 82.2) < 1e-9
S(s, 'CONTOH 11', 'Pulangan atas pelaburan hartanah',
  p('Encik Kamal membeli satu lot kedai dengan harga RM500 000 pada 1 Januari 2017. Beliau telah membayar 10% daripada nilai belian lot kedai tersebut, iaitu sebanyak RM50 000. Lot kedai tersebut disewakan. Pada 31 Disember 2026 beliau menjual lot kedai tersebut dengan harga RM1 100 000. Jumlah pinjaman masih berhutang kepada pihak bank berjumlah RM400 000. Manakala, jumlah ansuran bulanan yang telah dilunaskan kepada pihak bank berjumlah RM380 000. Jumlah sewa yang diperoleh ialah sebanyak RM180 000. Hitung nilai pulangan pelaburan yang diperoleh Encik Kamal.')
  ,
  stack(table(['Caj lain', 'Amaun'], [['Kos guaman', 'RM12 000'], ['Duti setem (semasa urusan jual beli)', 'RM12 000'], ['Komisen ejen', 'RM15 000']], c, 15),
  work([('Penyelesaian:', ['Jumlah sewa = RM180 000', 'Keuntungan modal = RM1 100 000 − RM400 000 − RM50 000 − RM12 000 − RM12 000 − RM15 000 − RM380 000', '= RM231 000',
                           'Jumlah pulangan = RM180 000 + RM231 000 = RM411 000', f'Nilai pulangan pelaburan = {fr("RM411 000", "RM500 000")} × 100% = 82.2%'])], s, 1, 16)))

km12 = 750000 - 40000 - 600000 - 5000 - 3000 - 5000
assert km12 == 97000 and abs((80000 + km12) / 400000 * 100 - 44.25) < 1e-9
S(s, 'CONTOH 12', 'Penyelesaian masalah: hartanah',
  p('Encik Halim membeli sebuah rumah pada 1 Januari 2015 dengan harga RM400 000 dan menjelaskan 10% wang pendahuluan sebanyak RM40 000. Beliau mengharapkan pulangan sebanyak 35% dalam tempoh 20 tahun. Encik Halim menjual rumah tersebut pada harga RM750 000 setelah genap memiliki rumah tersebut selama 20 tahun. Jumlah pinjaman yang telah dilunaskan kepada pihak bank berjumlah RM600 000. Dalam tempoh tersebut, beliau berjaya memperoleh sewa sebanyak RM80 000. Apakah nilai pulangan pelaburan bagi Encik Halim selama 20 tahun? Adakah beliau mencapai hasratnya untuk mendapatkan pulangan sebanyak 35%?')
  ,
  stack(table(['Perbelanjaan lain', 'Amaun'], [['Duti setem (semasa urusan jual beli)', 'RM5 000'], ['Komisen ejen', 'RM3 000'], ['Kos guaman semasa urusan jual beli', 'RM5 000']], c, 15),
  work([('Penyelesaian:', ['Jumlah pulangan pelaburan = Sewa + Keuntungan modal', '= RM80 000 + (RM750 000 − RM40 000 − RM600 000 − RM5 000 − RM3 000 − RM5 000)', '= RM80 000 + RM97 000', '= RM177 000',
                           f'Nilai pulangan pelaburan = {fr("RM177 000", "RM400 000")} × 100% = 44.25%',
                           'Encik Halim berjaya memperoleh kadar pulangan sebanyak 44.25%. Kadar ini melebihi kadar pulangan yang diharapkan iaitu 35%.'])], s, 1, 16)))

S(s, 'KONSEP', 'Risiko, pulangan dan kecairan',
  p('Tiga faktor yang harus diambil kira oleh seseorang pelabur sebelum membuat pelaburan adalah seperti berikut.')
  + table(['Faktor', 'Maksud'], [['Potensi risiko pelaburan', 'Kemungkinan sesuatu ketidakpastian yang mungkin dialami daripada pelaburan yang dilakukan.'],
                                  ['Tahap pulangan', 'Keuntungan yang dinikmati oleh pelabur daripada aktiviti pelaburan yang dilakukan.'],
                                  ['Aspek kecairan', 'Berkaitan seberapa segera boleh ditunaikan daripada sesuatu pelaburan atau simpanan tersebut.']], c, 16, center=False),
  table(['Jenis pelaburan', 'Tahap risiko', 'Tahap pulangan', 'Tahap kecairan'], [['Simpanan', 'Bebas risiko', 'Rendah', 'Tinggi'], ['Simpanan tetap', 'Bebas risiko', 'Rendah', 'Tinggi'],
                                                                                  ['Saham syarikat', 'Tinggi', 'Tinggi', 'Sederhana'], ['Hartanah', 'Rendah', 'Tinggi', 'Rendah'], ['Unit amanah', 'Rendah', 'Sederhana', 'Tinggi']], c, 16))

pr = [1.50, 1.20, 1.25, 1.60, 1.50]
un = [3000 / x for x in pr]
assert [round(u) for u in un] == [2000, 2500, 2400, 1875, 2000] and round(sum(un)) == 10775 and round(15000 / 10775, 2) == 1.39
S(s, 'RUMUS', 'Strategi pemurataan',
  de(s, 'Strategi pemurataan merupakan satu teknik yang biasa diamalkan oleh pelabur yang melabur dalam saham dengan amaun yang tetap untuk tempoh yang tertentu seperti bulanan, suku bulanan, atau tahunan tanpa mengambil kira keadaan pasaran saham.')
  + p('Strategi pemurataan boleh membantu pelabur membeli saham dengan kos purata yang lebih rendah dan jumlah saham yang dimiliki juga lebih banyak berbanding dengan pembelian sekali gus.')
  + formula(f'Kos purata seunit saham = {fr("Jumlah pelaburan", "Bilangan unit saham yang dimiliki")}', c),
  cards(card('Membantu mengambil kesempatan', 'Perubahan harga seunit', 'Apabila harga saham rendah, lebih banyak unit saham dapat dibeli.', TR),
        card('Tidak dipengaruhi oleh emosi', 'Konsisten', 'Melabur secara berkala dan konsisten tanpa dipengaruhi oleh emosi yang mungkin berubah-ubah.', PK),
        card('Mengurangkan risiko kerugian', 'Berkala', 'Jumlah pelaburan secara berkala dapat mengurangkan risiko pelaburan.', AM)))

S(s, 'CONTOH 13', 'Membandingkan strategi pelaburan',
  p('Berikut ialah dua orang pelabur yang melabur dengan cara yang berbeza. Puan Rosnah melabur RM15 000 secara sekali gus dalam saham Syarikat Pelita pada bulan Januari. Puan Mei Lan melabur RM3 000 secara berkala dalam saham yang sama.')
  + table(['Bulan', 'Januari', 'Mac', 'Mei', 'Ogos', 'Disember'], [['Harga saham seunit (RM)', *[f'{x:.2f}' for x in pr]]], c, 16)
  + bul(s, ['(a) Kenal pasti kos purata seunit dan jumlah saham yang dimiliki oleh Puan Rosnah dan Puan Mei Lan.', '(b) Siapakah pelabur yang bijak? Berikan justifikasi anda.']),
  work([('(a) Puan Rosnah', [f'Jumlah saham = {fr("RM15 000", "RM1.50")} = 10 000 unit saham', 'Kos purata seunit saham = RM1.50']),
        ('Puan Mei Lan', ['Unit saham: 2 000 + 2 500 + 2 400 + 1 875 + 2 000 = 10 775 unit', f'Kos purata seunit saham = {fr("RM15 000", "10 775 unit")} = RM1.39']),
        ('(b)', ['Puan Mei Lan merupakan seorang pelabur yang bijak kerana mengamalkan strategi pemurataan yang boleh membantu beliau memiliki lebih banyak unit saham dengan kos purata seunit saham yang lebih rendah.'])], s, 1, 18))

roiA = (700 * 12 + 180000 * 0.04) / 300000 * 100
roiB = (300000 * 0.07) / 300000 * 100
roiC = (150000 * 0.01 + 150000 * 0.035) / 300000 * 100
assert abs(roiA - 5.2) < 1e-9 and abs(roiB - 7) < 1e-9 and abs(roiC - 2.25) < 1e-9
S(s, 'CONTOH 14', 'Penyelesaian masalah: pelabur bijak',
  p('Encik Rahim, Encik Lim dan Encik Kumar telah bersara dan masing-masing menerima wang persaraan daripada syarikatnya sebanyak RM300 000. Mereka bertiga berhasrat untuk melakukan pelaburan menggunakan cara pelaburan yang berbeza. Siapakah pelabur yang bijak?')
  + table(['Pelabur', 'Cara pelaburan'], [['Encik Rahim', 'Membeli sebuah pangsapuri kos sederhana bernilai RM120 000 secara tunai dan menyewakannya RM700 sebulan. Selebihnya disimpan dalam simpanan tetap dengan kadar faedah 4% setahun.'],
                                          ['Encik Lim', 'Melabur RM300 000 dalam Syarikat Manis dengan harga saham RM1.50 seunit. Pada tahun tersebut, syarikat itu mengisytiharkan dividen sebanyak 7%.'],
                                          ['Encik Kumar', 'Menyimpan RM150 000 dalam akaun simpanan dengan kadar faedah 1% setahun dan baki RM150 000 disimpan dalam akaun simpanan tetap dengan kadar faedah 3.5% setahun.']], c, 15, center=False),
  work([('Encik Rahim (tahap risiko rendah)', [f'Sewa = RM700 × 12 = RM8 400, Faedah = {fr(4, 100)} × RM180 000 = RM7 200', f'ROI = {fr("RM8 400 + RM7 200", "RM300 000")} × 100% = 5.2%']),
        ('Encik Lim (tahap risiko tinggi)', [f'Dividen = RM300 000 × {fr(7, 100)} = RM21 000', f'ROI = {fr("RM21 000", "RM300 000")} × 100% = 7%']),
        ('Encik Kumar (tahap risiko rendah)', [f'Faedah = RM1 500 + RM5 250 = RM6 750', f'ROI = {fr("RM6 750", "RM300 000")} × 100% = 2.25%']),
        ('', ['Encik Lim merupakan pelabur yang bijak kerana nilai pulangan pelaburan beliau adalah tinggi berbanding dengan Encik Rahim dan Encik Kumar. Encik Rahim dan Encik Kumar masing-masing mengambil langkah selamat dengan memilih pelaburan yang lebih rendah risikonya.'])], s, 1, 16))

# =====================================================================
# 3.2 PENGURUSAN KREDIT DAN HUTANG
# =====================================================================
s = '3.2'
c = COL[s]
S(s, 'DEFINISI', 'Kredit dan hutang',
  de(s, 'Dalam dunia kewangan, <b>kredit</b> bermaksud satu perjanjian kontrak antara pembekal (contohnya bank atau institusi kewangan) dengan pengguna, yang mana pengguna boleh meminjam wang daripada pembekal untuk sesuatu kegunaan atau pembelian dan bersetuju membayar balik dalam suatu tempoh tertentu.')
  + p('Kredit juga boleh bermaksud jumlah wang yang boleh dipinjam. Contohnya untuk kad kredit, jika had kad kredit ialah RM10 000, maka pemilik kad tersebut mempunyai kemampuan untuk membeli barang atau membuat transaksi sehingga RM10 000 dengan kad tersebut.')
  ,
  stack(de(s, '<b>Hutang</b> biasanya membawa maksud suatu amaun yang telah dipinjam tetapi belum dilunaskan. Jika suatu urus niaga dibuat dengan menggunakan kad kredit, maka kredit pada kad itu akan bertukar menjadi hutang.'),
        p(f'<b style="color:{c}">Menguruskan kredit dan hutang dengan bijaksana</b>'),
        bul(s, ['Pengguna kad kredit perlu menjelaskan bayaran hutang dalam tempoh yang ditetapkan oleh bank untuk menikmati tempoh tanpa faedah.', 'Membayar jumlah penuh yang tertera pada penyata kad kredit.',
                'Membayar tepat pada masanya.'])))

S(s, 'KONSEP', 'Kelebihan dan kekurangan kad kredit',
  p('Penggunaan kad kredit semakin lazim pada masa sekarang. Sebagai pengguna adalah penting untuk kita sedar dan memahami kelebihan dan kekurangan dalam menggunakan kad kredit.')
  + p('Akan tetapi, bukan semua individu layak untuk memiliki kad kredit. Terdapat beberapa syarat yang dipatuhi oleh seseorang pemohon: berumur 21 tahun ke atas, berpendapatan minimum RM24 000 setahun dan memenuhi syarat-syarat lain yang ditetapkan oleh pihak bank.'),
  table(['Kelebihan kad kredit', 'Kekurangan kad kredit'], [
      ['Pengguna kad kredit boleh menikmati sistem ganjaran dalam bentuk rebat tunai atau penebusan mata.', 'Dibebankan dengan caj-caj seperti yuran tahunan, caj kewangan (faedah) dan caj bayaran lewat.'],
      ['Tidak perlu membawa tunai yang banyak untuk berbelanja.', 'Berbelanja lebih daripada sepatutnya.'],
      ['Kaedah pembayaran yang mudah dan cepat.', 'Sesetengah kedai tidak menerima pembayaran melalui kad kredit.'],
      ['Kemudahan membeli barangan secara atas talian.', '']], c, 16, center=False))

assert 0.05 * 4800 == 240
S(s, 'KONSEP', 'Bayaran minimum dan caj kewangan',
  p('Pemilik kad kredit akan menerima satu penyata kewangan untuk kad kredit setiap bulan. Dalam penyata tersebut, terdapat butiran seperti had kredit, tarikh penyata, jumlah terkini, jumlah bayaran minimum, jenis-jenis caj dan sebagainya.')
  + p('Pemilik kad seharusnya membayar jumlah terkini (atau hutang kad kredit) dengan segera supaya tidak dikenakan sebarang caj kewangan. Tetapi bank memberi kelonggaran dengan membenarkan pengguna membayar dalam suatu tempoh tertentu yang dikenali sebagai <b>tempoh tanpa faedah</b>. Biasanya tempoh ini adalah selama 20 hari selepas tarikh penyata.'),
  stack(cards(card('BAYARAN MINIMUM', '5% daripada jumlah baki akhir', 'atau minimum RM50', TR),
              card('CAJ KEWANGAN', '15% hingga 18% setahun', 'dikenakan ke atas baki selepas tamat tempoh tanpa faedah dalam kadar harian', PK),
              card('CAJ BAYARAN LEWAT', 'Minimum RM10 atau 1%', 'daripada jumlah baki belum jelas, jika tiada sebarang bayaran dibuat dalam tempoh tanpa faedah', AM)),
        note('Jika anda membayar hanya sebahagian daripadanya, anda akan kehilangan tempoh tanpa faedah tersebut.', 'Tip:')))

f16b = r2(4560 * 0.18 * 15 / 365); f16c = r2(4800 * 0.18 * 15 / 365); l16 = r2((4800 + f16c) / 100)
assert f16b == 33.73 and f16c == 35.51 and l16 == 48.36 and r2(4560 + f16b) == 4593.73 and r2(4800 + f16c + l16) == 4883.87
S(s, 'CONTOH 15', 'Penggunaan kad kredit',
  p('Encik Azman menerima penyata kad kredit untuk bulan Januari 2019 dari Bank Sentosa. Penyata menunjukkan Encik Azman mempunyai jumlah terkini (baki tertunggak) RM4 800. Anggap bahawa Encik Azman tidak menggunakan kad kredit dalam bulan Februari. Kadar caj kewangan ialah 18% setahun.')
  + bul(s, ['(a) Berapakah bayaran minimum yang harus dibayar oleh Encik Azman?', '(b) Jika Encik Azman hanya membuat bayaran minimum untuk bulan Januari dan tarikh penyata ialah 15 hari daripada tarikh tamat tempoh tanpa faedah, apakah baki dalam penyata bulan Februari?',
            '(c) Jika Encik Azman terlupa membuat sebarang pembayaran untuk bulan Januari, apakah baki dalam penyata bulan Februari?']),
  work([('(a)', [f'5% daripada jumlah terkini = {fr(5, 100)} × RM4 800 = RM240', 'Jumlah ini melebihi RM50, jadi bayaran minimum ialah RM240.']),
        ('(b)', ['Baki belum dijelaskan = RM4 800 − RM240 = RM4 560', 'Tempoh dikenakan caj kewangan = 15 hari = (15 ÷ 365) tahun', 'Faedah = RM4 560 × [(18 ÷ 100) × (15 ÷ 365)] = RM33.73', 'Jumlah terkini dalam bulan Februari = RM4 560 + RM33.73 = RM4 593.73']),
        ('(c)', ['Faedah = RM4 800 × [(18 ÷ 100) × (15 ÷ 365)] = RM35.51', f'Caj bayar lewat = {fr(1, 100)} × (RM4 800 + RM35.51) = RM48.36', 'Jumlah terkini dalam bulan Februari = RM4 800 + RM35.51 + RM48.36 = RM4 883.87'])], s, 1, 16))

hp = r2(240 / 0.30); kc = r2(40 / 0.30); cj = r2(hp / 100)
assert hp == 800 and kc == 133.33 and cj == 8 and r2(hp + kc + cj) == 941.33 and r2(941.33 - 899) == 42.33
S(s, 'CONTOH 16', 'Penyelesaian masalah: membeli atas talian',
  p('Cik Chin ingin membeli satu beg tangan secara atas talian dan menjumpai dua promosi berikut: (a) Syarikat L di Singapura menawarkan harga promosi SGD240. Untuk tempahan daripada luar Singapura, caj kiriman SGD40 dikenakan. (b) Syarikat V di Malaysia menawarkan harga promosi RM899. Penghantaran adalah percuma untuk semua tempahan ke alamat tempatan.')
  + p('Cik Chin bercadang membuat pembayaran dengan kad kredit dan beliau faham bank akan mengenakan caj tambahan 1% ke atas setiap transaksi daripada luar negara. Andaikan kadar semasa pertukaran mata wang ialah RM1 = SGD0.30. Sebagai pengguna bijak, tawaran manakah yang Cik Chin harus pilih? Berikan justifikasi anda.'),
  work([('(a) Syarikat L', ['Harga promosi = SGD240 × (1 ÷ 0.30) = RM800.00', 'Caj kiriman = SGD40 × (1 ÷ 0.30) = RM133.33', f'Caj tambahan oleh bank = RM800.00 × {fr(1, 100)} = RM8.00', 'Harga sebenar yang akan dibayar = RM800.00 + RM133.33 + RM8.00 = RM941.33']),
        ('(b) Syarikat V', ['Harga sebenar yang akan dibayar = RM899']),
        ('', ['Walaupun harga promosi yang ditawarkan oleh Syarikat L adalah lebih murah, namun harga sebenar yang akan dibayar adalah lebih tinggi disebabkan caj-caj tambahan yang dikenakan untuk pembelian secara atas talian dari Syarikat L. Jadi, Cik Chin harus membeli dari Syarikat V kerana dapat berjimat RM42.33.'])], s, 1, 17))

AS = f'<i>A</i> = <i>P</i> + <i>Prt</i>'
assert 90000 * 0.9 == 81000 and abs(81000 * 0.035 * 5 - 14175) < 1e-6 and abs((81000 + 14175) / 60 - 1586.25) < 1e-9 and (15000 + 15000 * 0.05 * 5) / 60 == 312.5
S(s, 'RUMUS', 'Bayaran balik pinjaman: faedah sama rata',
  p('Setiap pinjaman akan dikenakan faedah ke atas pinjaman dari tarikh pinjaman itu dilakukan. Terdapat dua jenis kaedah pengiraan faedah pinjaman, iaitu faedah kadar sama rata dan faedah atas baki.')
  + de(s, 'Dalam kaedah <b>faedah sama rata</b>, kadar faedah akan dikira pada jumlah pinjaman asal sepanjang tempoh pinjaman. Jadi jumlah faedah yang dikenakan setiap bulan adalah tetap.')
  + formula(f'{AS} &nbsp;&nbsp; Ansuran bulanan = {fr("<i>A</i>", "bilangan bulan")}', c)
  ,
  stack(p('<i>A</i> = jumlah bayaran balik, <i>P</i> = prinsipal, <i>r</i> = kadar faedah setahun, <i>t</i> = tempoh pinjaman dalam tahun.'), de(s, '<b>Ansuran bulanan</b> ialah jumlah amaun yang dibayar oleh peminjam kepada pihak bank setiap bulan bagi menjelaskan baki pinjaman.'),
        note('Baki pinjaman wujud setelah menolak bayaran pendahuluan dan ditambah dengan jumlah faedah yang dikenakan.', 'Ingat:')))

S(s, 'CONTOH 17', 'Pinjaman kereta',
  p('Puan Yap membeli sebuah kereta bernilai RM90 000 secara kredit. Beliau membayar bayaran pendahuluan sebanyak 10% dan bakinya dibayar secara ansuran selama 5 tahun. Kadar faedah sama rata yang dikenakan oleh bank ialah 3.5% setahun. Berapakah jumlah bayaran balik dan bayaran ansuran bulanan oleh Puan Yap?')
  + note('Jumlah bayaran balik boleh dihitung dengan formula <i>A</i> = <i>P</i> + <i>Prt</i>.', 'Tip:'),
  work([
        ('Penyelesaian:', ['Bayaran pendahuluan = 10% × RM90 000 = RM9 000', 'Jumlah pinjaman = RM90 000 − RM9 000 = RM81 000', f'Faedah untuk 5 tahun = RM81 000 × {fr("3.5", 100)} × 5 = RM14 175', 'Jumlah bayaran balik = RM81 000 + RM14 175 = RM95 175',
                           f'Bayaran ansuran bulanan = {fr("RM95 175", "60 bulan")} = RM1 586.25 sebulan']),
        ], s, 1, 19))

S(s, 'CONTOH 18', 'Pinjaman peribadi',
  p('Encik Firdaus membuat pinjaman peribadi sebanyak RM15 000 dari Bank Mulia dengan kadar faedah 5% setahun. Tempoh bayaran balik pinjaman ialah selama 5 tahun. Berapakah ansuran bulanan yang perlu dibayar oleh Encik Firdaus?')
  + note('Jumlah bayaran balik boleh dihitung dengan formula <i>A</i> = <i>P</i> + <i>Prt</i>.', 'Tip:'),
  work([('Penyelesaian:', ['<i>A</i> = <i>P</i> + <i>Prt</i>', 'Pinjaman, <i>P</i> = RM15 000, <i>r</i> = 5%, <i>t</i> = 5 tahun', f'<i>A</i> = RM15 000 + (RM15 000 × {fr(5, 100)} × 5)', '= RM15 000 + RM3 750 = RM18 750',
                           f'Ansuran bulanan = {fr("RM18 750", "60 bulan")} = RM312.50'])], s, 1, 20))

b, rows, tot = 12000.0, [], 0
for k in range(3):
    f_ = r2(b * 0.05 / 12); tot += f_
    rows.append((b, f_, r2(b + f_), r2(b + f_ - 300))); b = r2(b + f_ - 300)
assert [x[1] for x in rows] == [50.0, 48.96, 47.91] and r2(tot) == 146.87 and rows[-1][3] == 11246.87
S(s, 'CONTOH 19', 'Faedah atas baki',
  p('Selain daripada faedah sama rata, bank juga menawarkan faedah atas baki untuk sesetengah jenis pinjaman. Dalam kaedah <b>faedah atas baki</b>, jumlah faedah setiap bulan yang dikenakan ke atas pinjaman bergantung kepada jumlah baki pinjaman pada bulan tersebut. Oleh kerana terdapat bayaran ansuran setiap bulan, jumlah baki pinjaman akan berkurangan, dan dengan itu, jumlah faedah untuk setiap bulan juga akan berkurangan.')
  + p('<b>CONTOH 19</b> Encik Harith membuat pinjaman peribadi sebanyak RM12 000 di Bank Mulia dengan kadar faedah 5% setahun atas baki. Bayaran ansuran bulanan ialah RM300. Hitung jumlah faedah yang perlu dibayar oleh Encik Harith bagi 3 bulan pertama.'),
  work([(f'Bulan {k + 1}', [f'Faedah = {R(b0)} × {fr(5, 100)} × {fr(1, 12)} = {R(f_)}', f'Baki selepas bayaran ansuran = {R(t_)} − RM300 = {R(e)}']) for k, (b0, f_, t_, e) in enumerate(rows)]
       + [('', ['Jumlah faedah bagi tiga bulan = RM50.00 + RM48.96 + RM47.91 = RM146.87'])], s, 1, 18))

aA = 45000 + 45000 * 0.04 * 9; aB = 45000 + 45000 * 0.045 * 5
assert aA == 61200 and aB == 55125 and r2(aA / 108) == 566.67 and r2(aB / 60) == 918.75
S(s, 'CONTOH 20', 'Penyelesaian masalah: memilih pinjaman',
  p('Cik Nadia mula berkhidmat sebagai seorang guru kerajaan, dengan pendapatan bulanan sebanyak RM3 000. Beliau membuat keputusan untuk membeli sebuah kereta baharu untuk berulang alik dari rumah ke tempat kerjanya. Beliau menghubungi dua buah bank untuk mendapatkan pinjaman sebanyak RM45 000. Selain itu, setiap bulan beliau juga memerlukan RM1 800 untuk menampung perbelanjaan lain. Kemukakan cadangan kepada Cik Nadia bank manakah yang sesuai dipilih untuk pinjaman keretanya. Nyatakan alasan anda.')
  ,
  stack(table(['Aspek pinjaman', 'Bank A', 'Bank B'], [['Jumlah pinjaman', 'RM45 000', 'RM45 000'], ['Tempoh bayaran', '9 tahun', '5 tahun'], ['Kadar faedah', '4%', '4.5%'], ['Penjamin', 'Tidak perlu', 'Perlu']], c, 18),
        note('Jangan meminjam wang daripada pemberi pinjaman wang tidak berlesen kerana mereka mengenakan caj faedah yang sangat tinggi dengan kompaun harian.', 'Tip:')))

S(s, 'CONTOH 20 (sambungan)', 'Penyelesaian',
  work([('Memahami masalah', ['Jumlah ansuran bulanan yang perlu dibayar oleh Cik Nadia dengan syarat tidak membebankannya.']),
        ('Merancang strategi', ['Menghitung faedah pinjaman. Menghitung jumlah ansuran bulanan yang perlu dibayar.'])], s, 1, 19),
  work([('Melaksanakan strategi', [f'Bank A: <i>A</i> = RM45 000 + RM45 000 × {fr(4, 100)} × 9 = RM61 200', f'Ansuran bulanan = {fr("RM61 200", "108 bulan")} = RM566.67',
                                   f'Bank B: <i>A</i> = RM45 000 + RM45 000 × {fr("4.5", 100)} × 5 = RM55 125', f'Ansuran bulanan = {fr("RM55 125", "60 bulan")} = RM918.75']),
        ('Membuat kesimpulan', ['Baki pendapatan Cik Nadia = RM3 000 − RM1 800 = RM1 200. Kedua-dua ansuran tidak melebihi baki ini.',
                                'Cik Nadia harus memilih Bank A kerana Bank A mengenakan faedah yang lebih rendah berbanding dengan Bank B. Namun tempoh bayaran yang berlainan menyebabkan amaun faedah yang dibayar adalah berbeza. Oleh itu, Cik Nadia boleh juga memilih Bank B.'])], s, 1, 16))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pengguna', 'slides.js')
HEAD = '/* Nota Bab 3 ikut buku teks Matematik T3 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
