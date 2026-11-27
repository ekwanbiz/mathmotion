"""Bab 3 T5 Matematik Pengguna: Insurans. Nota ikut buku teks Matematik T5 KSSM (ayat buku, nombor dan nama ditukar;
kadar Tarif Motor dikekalkan kerana ia data rasmi). CONTOH 1–8 ikut buku. SUBS folder insurans dikekalkan (3.1.1–3.1.3)."""
import os, sys
from decimal import Decimal as D, ROUND_HALF_UP
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "3.1.1", "name": "Risiko dan Jenis Insurans", "col": "#38BDF8"}, {"no": "3.1.2", "name": "Kadar dan Premium Insurans", "col": "#34D399"}, {"no": "3.1.3", "name": "Deduktibel dan Ko-insurans", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def r2(v):
    return D(str(v)).quantize(D('0.01'), rounding=ROUND_HALF_UP)


def rm(v, dp=2):
    v = r2(v)
    s_ = f'{v:,.2f}' if dp else f'{v:,.0f}'
    if dp and s_.endswith('.00') and dp == 'auto':
        s_ = s_[:-3]
    return 'RM' + s_.replace(',', ' ')


def rm0(v):
    v = r2(v)
    s_ = f'{v:,.2f}'
    if s_.endswith('.00'):
        s_ = s_[:-3]
    return 'RM' + s_.replace(',', ' ')


def ps4(a, b, c_, d, s, fs=15):
    return work([('Memahami masalah', a), ('Merancang strategi', b), ('Melaksanakan strategi', c_), ('Membuat kesimpulan', d)], s, 2, fs)


# =====================================================================
# 3.1.1 RISIKO DAN JENIS INSURANS
# =====================================================================
s = '3.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Risiko',
  p('Kemalangan jalan raya yang mencederakan pemandu dan penumpang, kemusnahan harta benda disebabkan kebakaran, bil perubatan yang tinggi akibat penyakit kritikal dan sebagainya mungkin boleh berlaku dalam kehidupan kita. Hakikat bahawa diri kita terdedah kepada kerugian sedemikian dan ketidakpastian sama ada perkara tersebut akan berlaku menyebabkan wujudnya risiko.')
  + de(s, 'Risiko secara umumnya ialah kemungkinan berlakunya musibah yang tidak dapat dielakkan.'),
  stack(work([('Elemen penting dalam definisi risiko', ['(i) Risiko tidak dapat ditentukan', '(ii) Risiko yang melibatkan kerugian'])], s, 1, 18),
        p('Risiko yang mungkin dihadapi oleh seorang murid adalah seperti mengalami kemalangan ketika dalam perjalanan ke sekolah, mengalami kecederaan semasa perlawanan bola sepak atau terjatuh di tangga.'),
        note('Walaupun anda menjalani kehidupan dengan berhati-hati, risiko masih ada. Insurans memberikan satu perlindungan kewangan jika kejadian yang tidak diingini berlaku.', 'Info:')))

S(s, 'KONSEP', 'Insurans dan prinsip indemniti',
  de(s, 'Insurans bertujuan memindahkan risiko daripada individu kepada organisasi insurans. Syarikat insurans dikehendaki membayar ganti rugi atau pampasan bagi kerugian yang dilindungi seperti yang dinyatakan dalam polisi, sebagai balasan kepada bayaran premium yang dibuat oleh pemegang polisi.')
  + p('Insurans tidak boleh menghalang sesuatu kerugian daripada berlaku tetapi insurans berkepentingan untuk mengurangkan beban kewangan yang akan ditanggung oleh pemegang polisi apabila berlakunya kerugian.'),
  stack(table(['Istilah', 'Maksud'], [['Syarikat insurans', 'Pihak yang bersetuju untuk membayar pampasan atas kerugian yang telah diinsuranskan.'], ['Pemegang polisi', 'Pihak yang akan menuntut dan menerima pampasan atas kerugian yang dialami.'],
                                      ['Kontrak insurans', 'Suatu polisi sebagai bukti perjanjian antara syarikat insurans dengan pemegang polisi.'], ['Premium', 'Jumlah wang yang dibayar oleh pemegang polisi kepada syarikat insurans.']], c, 15, False),
        note('Prinsip indemniti: syarikat insurans akan membayar ganti rugi pada amaun yang tidak melebihi kerugian yang dialami. Pemegang polisi tidak boleh memperoleh keuntungan daripada insurans.', 'Ingat:')))

S(s, 'KONSEP', 'Insurans hayat dan insurans am',
  p('Insurans terbahagi kepada dua jenis insurans utama, iaitu insurans hayat dan insurans am. Kedua-dua insurans ini melindungi pelbagai risiko yang berbeza.')
  + work([('Insurans hayat', ['Menjamin pembayaran manfaat kewangan kepada pemegang polisi sekiranya berlaku kematian terhadap orang yang diinsuranskan atau bawah keadaan yang ditetapkan dalam kontrak.', 'Risiko yang dilindungi: kematian, penyakit kritikal, hilang upaya (keilatan).']),
          ('Insurans am', ['Memberikan perlindungan daripada sebarang kerugian atau kerosakan harta benda yang ditanggung, selain risiko yang dilindungi dalam insurans hayat.'])], s, 1, 17),
  table(['Jenis insurans am', 'Perlindungan'], [['Insurans motor', 'Kerugian atau kerosakan berkaitan penggunaan kenderaan berenjin (wajib bawah Akta Pengangkutan Jalan 1987).'], ['Insurans kebakaran', 'Kerugian akibat kebakaran, kilat dan letupan pada rumah kediaman atau bangunan perniagaan.'],
                                                ['Insurans perubatan dan kesihatan', 'Kos kemasukan ke hospital, pembedahan, penyakit kritikal, hilang upaya.'], ['Insurans kemalangan diri', 'Kecederaan, kecacatan, hilang upaya atau kematian akibat kemalangan.'],
                                                ['Insurans perjalanan', 'Kerugian dalam perjalanan seperti kehilangan bagasi, pasport, belanja perubatan.']], c, 14, False))

S(s, 'KONSEP', 'Insurans motor',
  table(['Perlindungan', 'Akta', 'Pihak ketiga', 'Pihak ketiga, kebakaran & kecurian', 'Komprehensif'],
        [['Liabiliti kepada pihak ketiga akibat kecederaan dan kematian', 'Ya', 'Ya', 'Ya', 'Ya'], ['Kerugian harta benda pihak ketiga', 'Tidak', 'Ya', 'Ya', 'Ya'],
         ['Kerugian kenderaan sendiri akibat kebakaran atau kecurian', 'Tidak', 'Tidak', 'Ya', 'Ya'], ['Kerugian dan kerosakan kenderaan sendiri akibat kemalangan', 'Tidak', 'Tidak', 'Tidak', 'Ya']], c, 14)
  + p('Polisi komprehensif memberikan perlindungan yang menyeluruh. Perlindungan tidak merangkumi tuntutan pemandu dan penumpang kenderaan seperti kecederaan dan kematian.'),
  stack(work([('Contoh situasi', ['Hakim memandu keretanya dengan membawa seorang penumpang, Zaki. Kereta Hakim hilang kawalan lalu melanggar kereta yang dipandu oleh Mei. Ketiga-tiga mereka cedera dan kedua-dua kereta rosak.',
                                  'Jika kereta Hakim diinsuranskan bawah polisi komprehensif, polisi ini melindungi kecederaan dan kerosakan kereta pihak ketiga (Mei) dan kerosakan kereta Hakim. Kos perubatan Hakim dan Zaki tidak dilindungi.'])], s, 1, 15),
        note('Dalam insurans motor, pihak pertama ialah pemandu (pemegang polisi), pihak kedua ialah syarikat insurans, pihak ketiga ialah mana-mana individu yang terlibat dalam kemalangan tidak termasuk penumpang.', 'Info:')))

S(s, 'KONSEP', 'Insurans berkelompok dan tujuan mendapatkan insurans',
  p('Tempoh perlindungan bagi kebanyakan polisi insurans am ialah satu tahun ataupun kurang.')
  + bul(s, ['<b>Insurans berkelompok kepada organisasi:</b> perlindungan kewangan kepada pekerja seperti kematian, hilang upaya, kemasukan hospital dan pembedahan.', '<b>Insurans berkelompok kepada murid:</b> contohnya skim Takaful Pelajar Sekolah Malaysia (TPSM) bagi murid sekolah kerajaan dan bantuan kerajaan.']),
  work([('Tujuan mendapatkan insurans', ['Sebagai bantuan kewangan kepada keluarga sekiranya anda hilang upaya, menghidapi penyakit kritikal atau meninggal dunia', 'Mengurus perbelanjaan hidup, hutang dan komitmen sekiranya anda tidak mampu bekerja',
                                         'Bayaran perbelanjaan perubatan rawatan yang tinggi', 'Sebagai pampasan terhadap kerugian yang dialami'])], s, 1, 17))

# =====================================================================
# 3.1.2 KADAR DAN PREMIUM INSURANS
# =====================================================================
s = '3.1.2'
c = COL[s]
S(s, 'CONTOH 1', 'Mentafsir jadual premium insurans perjalanan',
  p('Jadual menunjukkan harga premium bagi insurans perjalanan yang ditawarkan oleh Syarikat Insurans PQ Bhd. ke negara-negara Asia dan Eropah.')
  + table(['Bilangan hari', 'Pemegang polisi Asia', 'Eropah', 'Dengan pasangan Asia', 'Eropah', 'Keluarga Asia', 'Eropah'],
          [['1 – 5', '42', '56', '72', '102', '90', '138'], ['6 – 10', '61', '82', '110', '155', '140', '190'], ['11 – 18', '82', '130', '156', '250', '222', '310'], ['Premium tahunan (18 – 69 tahun)', '240', '290', '–', '–', '–', '–']], c, 14)
  ,
  stack(p('(a) Apakah faktor yang mempengaruhi perbezaan harga premium? (b) Mengapakah semakin panjang tempoh perjalanan, semakin tinggi harga premium? (c) Firdaus, seorang jurugambar, melawat banyak negara Eropah dalam setahun, antara 12 hingga 15 hari bagi setiap negara. Insurans manakah patut dibelinya?'),
  work([('Penyelesaian', ['(a) Destinasi, tempoh perjalanan dan bilangan orang yang diinsuranskan.', '(b) Tempoh perjalanan yang lebih panjang meningkatkan kebarangkalian kerugian berlaku pada pemegang polisi semasa berada di luar negara.',
                          '(c) Firdaus patut membeli insurans perjalanan premium tahunan bagi negara-negara Eropah (RM290) kerana ini lebih menjimatkan daripada membeli insurans RM130 bagi tempoh 11 hingga 18 hari setiap kali perjalanan.'])], s, 1, 16)))

RATE = {35: (2.10, 2.70, 1.44, 1.76), 36: (2.17, 2.79, 1.49, 1.83), 37: (2.25, 2.90, 1.55, 1.92), 38: (2.34, 3.03, 1.62, 2.01), 39: (2.46, 3.20, 1.70, 2.12), 40: (2.62, 3.44, 1.79, 2.24)}
pl = r2(D(150000) / 1000 * D('2.34'))
base, ci = r2(D(200000) / 1000 * D('1.55')), r2(D(80000) / 1000 * D('1.80'))
assert pl == D('351.00') and base == D('310.00') and ci == D('144.00') and base + ci == D('454.00')
S(s, 'RUMUS', 'Premium insurans hayat',
  p('Bagi insurans hayat, nilai premium yang dibayar bergantung pada nilai muka yang dipilih, umur, jantina dan sama ada merokok atau tidak. Pengiraan premium ini merujuk kepada jadual kadar premium bagi setiap RM<i>x</i> nilai muka.')
  + formula(f'Premium = {F("Nilai muka polisi", "RM<i>x</i>")} × Kadar premium per RM<i>x</i>', c)
  + note('Nilai muka polisi ialah jumlah wang yang dipilih oleh pemegang polisi untuk mendapatkan perlindungan insurans. Jumlah ini akan dibayar kepada waris jika berlakunya kematian atau kecacatan kekal pemegang polisi.', 'Info:'),
  stack(p('<b>CONTOH 2</b> Jadual kadar premium tahunan bagi setiap RM1 000 nilai muka insurans sementara boleh baharu tahunan yang ditawarkan oleh Syarikat Insurans XYZ:'),
        table(['Umur', 'Lelaki bukan perokok', 'Lelaki perokok', 'Perempuan bukan perokok', 'Perempuan perokok'], [[str(a)] + [f'{v:.2f}' for v in r] for a, r in RATE.items()], c, 14)))

S(s, 'CONTOH 2', 'Menghitung premium insurans hayat',
  p('(a) Mengapakah kadar premium semakin tinggi (i) apabila umur semakin meningkat? (ii) bagi seorang perokok?')
  + p('(b) Hitung premium tahunan bagi setiap situasi berikut. (i) Encik Lau ingin membeli polisi insurans bernilai RM150 000. Dia berumur 38 tahun, sihat dan tidak merokok. (ii) Puan Kavitha berumur 37 tahun, sihat dan tidak merokok, ingin membeli polisi bernilai RM200 000 dan menambah polisi penyakit kritikal yang memberikan perlindungan 40% nilai muka asas dengan kadar premium RM1.80 bagi setiap RM1 000.')
  + work([('(a)', ['(i) Jangka hayat setiap orang semakin pendek dengan penambahan umur.', '(ii) Kebarangkalian seorang perokok terdedah kepada risiko penyakit lebih tinggi berbanding seseorang yang mengamalkan gaya hidup sihat.'])], s, 1, 16),
  work([('(b)(i)', ['Berdasarkan jadual, kadar premium ialah RM2.34.', f'Premium tahunan Encik Lau = {F("RM150 000", "RM1 000")} × RM2.34 = RM351.00']),
        ('(b)(ii)', ['Berdasarkan jadual, kadar premium ialah RM1.55.', f'Perlindungan penyakit kritikal = {F(40, 100)} × RM200 000 = RM80 000', f'Premium tahunan = {F("RM200 000", "RM1 000")} × RM1.55 + {F("RM80 000", "RM1 000")} × RM1.80', '= RM310.00 + RM144.00 = RM454.00'])], s, 1, 16))

TARIF = [('1 400', '273.80', '120.60', '196.20', '67.50'), ('1 650', '305.50', '135.00', '220.00', '75.60'), ('2 200', '339.10', '151.20', '243.90', '85.20'), ('3 050', '372.60', '167.40', '266.50', '93.60'),
         ('4 100', '404.30', '181.80', '290.40', '101.70'), ('4 250', '436.00', '196.20', '313.00', '110.10'), ('4 400', '469.60', '212.40', '336.90', '118.20'), ('Melebihi 4 400', '501.30', '226.80', '359.50', '126.60')]
S(s, 'KONSEP', 'Premium insurans motor',
  p('Insurans motor dikira berdasarkan Tarif Motor yang menyediakan premium minimum. Jumlah premium bergantung pada jenis kenderaan, kegunaan kenderaan, kapasiti enjin, jenis dan jumlah perlindungan yang diinginkan.')
  + bul(s, ['Polisi komprehensif: bergantung pada kapasiti enjin dan nilai kenderaan yang ingin diinsuranskan.', 'Polisi pihak ketiga, kebakaran dan kecurian: kadar premium ialah 75% daripada premium asas polisi komprehensif.', 'Polisi pihak ketiga: hanya bergantung pada kapasiti enjin kenderaan.'])
  + work([('Premium asas polisi komprehensif (Semenanjung Malaysia)', ['Kadar bagi RM1 000 yang pertama + RM26 bagi setiap RM1 000 atau sebahagian daripadanya bagi nilai yang melebihi RM1 000 (Sabah dan Sarawak: RM20.30)'])], s, 1, 16),
  stack(table(['Kapasiti enjin tidak melebihi (cc)', 'Semenanjung komprehensif* (RM)', 'Semenanjung pihak ketiga (RM)', 'Sabah & Sarawak komprehensif* (RM)', 'Sabah & Sarawak pihak ketiga (RM)'], [list(r) for r in TARIF], c, 13),
        p('* Kadar bagi RM1 000 pertama daripada jumlah yang diinsuranskan. Sumber: Jadual Tarif Motor 2015')))

a3 = D('339.10')
b3 = D(26) * 49
asas = a3 + b3
ncd = r2(asas * D('0.30'))
kasar = asas - ncd
asas2 = r2(asas * D('0.75'))
ncd2 = r2(asas2 * D('0.30'))
tp, ncd3 = D('151.20'), r2(D('151.20') * D('0.30'))
assert asas == D('1613.10') and ncd == D('483.93') and kasar == D('1129.17') and asas2 == D('1209.83') and ncd2 == D('362.95') and asas2 - ncd2 == D('846.88') and tp - ncd3 == D('105.84')
S(s, 'CONTOH 3', 'Menghitung premium insurans motor',
  p('Encik Azman mempunyai sebuah kereta untuk digunakan di Semenanjung Malaysia. Maklumat kereta itu adalah seperti berikut.')
  + table(['Maklumat', ''], [['Jumlah yang ingin diinsuranskan', 'RM50 000'], ['Umur kenderaan', '6 tahun'], ['Kapasiti enjin', '1 800 cc'], ['NCD', '30%']], c, 16)
  + p('Hitung premium kasar bagi kereta Encik Azman untuk polisi komprehensif, polisi pihak ketiga, kebakaran dan kecurian, dan polisi pihak ketiga.')
  + note('Diskaun Tanpa Tuntutan (NCD) diberikan jika tiada tuntutan dibuat dalam tempoh perlindungan sebelum pembaharuan polisi.', 'Info:'),
  work([('Polisi komprehensif', [f'(a) RM1 000 yang pertama (rujuk jadual, 1 800 cc): RM339.10', f'(b) RM26 × {F("50 000 − 1 000", "1 000")} = RM26 × 49 = RM1 274.00', '(c) Premium asas = (a) + (b) = RM1 613.10', '(d) NCD 30% = 0.30 × RM1 613.10 = RM483.93', '(e) Premium kasar = (c) − (d) = RM1 129.17']),
        ('Polisi pihak ketiga, kebakaran dan kecurian', ['Premium asas = 0.75 × RM1 613.10 = RM1 209.83', 'NCD 30% = 0.30 × RM1 209.83 = RM362.95', 'Premium kasar = RM846.88']),
        ('Polisi pihak ketiga', ['Premium asas = RM151.20; NCD 30% = RM45.36', 'Premium kasar = RM105.84'])], s, 1, 15))

# =====================================================================
# 3.1.3 DEDUKTIBEL DAN KO-INSURANS
# =====================================================================
s = '3.1.3'
c = COL[s]
ded = 350
L4 = [('Mac', 3200), ('Julai', 300), ('Ogos', 500)]
pay4 = [(m, l, l > ded, l - ded if l > ded else None) for m, l in L4]
assert [p_[3] for p_ in pay4] == [2850, None, 150]
S(s, 'DEFINISI', 'Deduktibel',
  p('Terdapat beberapa peruntukan dalam kontrak insurans yang menyebabkan pemegang polisi mungkin menerima pampasan kurang daripada kerugian sebenar dan perlu menanggung sebahagian daripadanya, iaitu deduktibel dan ko-insurans.')
  + de(s, 'Deduktibel ialah suatu jumlah yang perlu ditanggung oleh pemegang polisi sebelum layak membuat tuntutan daripada syarikat insurans.')
  + p('Kebiasaannya deduktibel terdapat dalam kontrak insurans harta, insurans perubatan dan kesihatan, dan insurans motor. Peruntukan ini tidak terdapat dalam insurans hayat dan insurans liabiliti diri.'),
  stack(work([('CONTOH 4', [f'Puan Rohani membeli insurans motor yang mempunyai peruntukan deduktibel sebanyak RM350. Sepanjang tempoh insurans, dia mengalami tiga kali kemalangan pada bulan Mac, Julai dan Ogos dengan kerugian masing-masing RM3 200, RM300 dan RM500. Nyatakan sama ada dia boleh membuat tuntutan dan jumlah bayaran pampasan bagi setiap kerugian.'])], s, 1, 15),
        table(['Bulan', 'Kerugian (RM)', 'Boleh buat tuntutan?', 'Bayaran pampasan (RM)'], [[m, f'{l:,}'.replace(',', ' '), 'Boleh' if ok else 'Tidak', f'{l:,} − 350 = {v:,}'.replace(',', ' ') if ok else 'Tiada'] for m, l, ok, v in pay4], c, 15),
        p('Tuntutan boleh dibuat jika jumlah kerugian melebihi amaun deduktibel.')))

S(s, 'CONTOH 5', 'Deduktibel dalam insurans perubatan',
  p('Cher Lin mempunyai polisi insurans perubatan dengan deduktibel sebanyak RM25 000 setahun dengan had tahunan bernilai RM250 000. Pada tahun pertama, dia dimasukkan ke hospital untuk pembedahan apendiks dan dikenakan kos rawatan sebanyak RM9 500. Pada tahun berikutnya, dia perlu melakukan pembedahan jantung dengan kos rawatan sebanyak RM180 000. Nyatakan jumlah yang perlu ditanggung oleh Cher Lin dan jumlah yang dibayar oleh syarikat insurans bagi tahun pertama dan kedua.')
  + note('Dalam insurans motor, pemegang polisi menanggung deduktibel wajib RM400 jika kenderaan dipandu oleh individu yang tidak dinamakan dalam polisi, berumur bawah 21 tahun, pemegang lesen L atau lesen penuh kurang dari 2 tahun.', 'Info:'),
  work([('Tahun pertama', ['Kos rawatan = RM9 500', 'Kos rawatan kurang daripada amaun deduktibel.', 'Jumlah yang perlu ditanggung oleh Cher Lin = RM9 500']),
        ('Tahun kedua', ['Kos rawatan = RM180 000', 'Kos rawatan lebih daripada amaun deduktibel.', 'Jumlah yang perlu ditanggung oleh Cher Lin = RM25 000', 'Jumlah yang dibayar oleh syarikat insurans = RM180 000 − RM25 000 = RM155 000'])], s, 1, 18))
assert 180000 - 25000 == 155000

S(s, 'RUMUS', 'Ko-insurans dalam insurans harta',
  de(s, 'Ko-insurans ialah perkongsian bersama kerugian antara syarikat insurans dengan pemegang polisi.')
  + p('Pemegang polisi dikehendaki menginsuranskan hartanya pada suatu jumlah tertentu berdasarkan peratusan ko-insurans daripada nilai boleh insurans harta. Sekiranya peruntukan ini tidak dipenuhi, pemegang polisi perlu menanggung sebahagian daripada kerugian.')
  + formula('Jumlah insurans yang harus dibeli = Peratusan ko-insurans × Nilai boleh insurans harta', c),
  stack(table(['Keadaan', 'Bayaran pampasan'], [['Nilai yang diinsuranskan ≥ jumlah insurans yang harus dibeli', 'Jumlah kerugian − Deduktibel'],
                                               ['Nilai yang diinsuranskan &lt; jumlah insurans yang harus dibeli', f'{F("Jumlah insurans yang telah dibeli", "Jumlah insurans yang harus dibeli")} × Jumlah kerugian − Deduktibel'],
                                               ['Mengalami kerugian menyeluruh', 'Jumlah insurans yang telah dibeli − Deduktibel']], c, 15, False),
        note('Dengan adanya peruntukan deduktibel dan ko-insurans, premium yang dibayar akan menjadi rendah.', 'Info:')))

need = D(80) / 100 * 400000
pay_i = 30000 - 2500
part = D(200000) / need * 30000
pay_ii = part - 2500
pen = 30000 - part
assert need == 320000 and pay_i == 27500 and part == 18750 and pay_ii == 16250 and pen == 11250 and 240000 - 2500 == 237500 and 400000 - 237500 == 162500
S(s, 'CONTOH 6', 'Menyelesaikan masalah ko-insurans harta',
  p('Encik Ismail ingin membeli insurans kebakaran untuk rumahnya. Nilai boleh insurans rumah itu ialah RM400 000. Polisi itu mempunyai peruntukan ko-insurans untuk menginsuranskan 80% daripada nilai boleh insurans dan deduktibel sebanyak RM2 500.')
  + p('(a) Hitung jumlah insurans yang harus dibeli. (b) Rumah Encik Ismail mengalami kebakaran dan jumlah kerugiannya RM30 000. Hitung bayaran pampasan jika dia menginsuranskan rumahnya (i) pada jumlah insurans yang harus dibeli, (ii) dengan jumlah RM200 000. Seterusnya, hitung nilai penalti ko-insurans. (c) Rumah itu mengalami kerugian menyeluruh. Jika dia menginsuranskan rumahnya dengan jumlah RM240 000, hitung bayaran pampasan.')
  ,
  stack(work([('(a)', [f'Jumlah insurans yang harus dibeli = {F(80, 100)} × RM400 000 = RM320 000']), ('(b)(i)', ['Bayaran pampasan = RM30 000 − RM2 500 = RM27 500']),
        ('(b)(ii)', ['RM200 000 &lt; RM320 000', f'Bayaran pampasan = {F("RM200 000", "RM320 000")} × RM30 000 − RM2 500', '= RM18 750 − RM2 500 = RM16 250', 'Penalti ko-insurans = RM30 000 − RM18 750 = RM11 250']),
        ('(c)', ['Bayaran pampasan = RM240 000 − RM2 500 = RM237 500', 'Kerugian yang ditanggung Encik Ismail = RM400 000 − RM237 500 = RM162 500'])], s, 1, 15),
  note('Jumlah yang ditanggung oleh pemegang polisi akibat tidak memenuhi peruntukan ko-insurans dikenali sebagai penalti ko-insurans.', 'Info:')))

after = 15400 - 400
assert after == 15000 and after * 80 // 100 == 12000 and after * 20 // 100 + 400 == 3400
S(s, 'CONTOH 7', 'Ko-insurans dalam insurans kesihatan',
  p('Dalam kontrak insurans kesihatan, ko-insurans ditetapkan dalam fasal penyertaan peratusan. Pemegang polisi menanggung sebahagian daripada kos perubatan mengikut suatu kadar yang dipersetujui selepas mengambil kira peruntukan deduktibel. Contohnya, ko-insurans 80/20 bermaksud syarikat insurans menanggung 80% dan 20% ditanggung oleh pemegang polisi.')
  + p('<b>CONTOH 7</b> Puan Siti mempunyai polisi insurans perubatan utama dengan peruntukan deduktibel sebanyak RM400 dan fasal penyertaan peratusan ko-insurans 80/20. Hitung bayaran kos yang ditanggung oleh syarikat insurans dan Puan Siti jika kos perubatan yang dilindungi polisinya berjumlah RM15 400.'),
  stack(work([('Penyelesaian', ['Kos perubatan selepas deduktibel = RM15 400 − RM400 = RM15 000', f'Kos yang ditanggung oleh syarikat insurans = {F(80, 100)} × RM15 000 = RM12 000', f'Kos yang ditanggung oleh Puan Siti = {F(20, 100)} × RM15 000 + RM400 = RM3 400'])], s, 1, 17),
        note('Deduktibel ialah jumlah yang mesti dibayar dahulu oleh pemegang polisi. Ko-insurans ialah perkongsian kos dengan pemegang polisi menanggung peratusan tertentu daripada kerugian.', 'Beza:')))

S(s, 'CONTOH 8', 'Membandingkan pelan polisi insurans',
  p('Jesnita ingin membeli polisi insurans perubatan untuk dirinya. Dia membandingkan faedah pelan polisi daripada dua buah syarikat insurans, XX dan YY. Berdasarkan jadual, pelan polisi insurans yang manakah lebih baik untuk Jesnita? Justifikasikan jawapan anda.')
  + table(['Faedah', 'XX (RM)', 'YY (RM)'], [['Had tahunan keseluruhan', '60 000', '60 000'], ['Bilik hospital dan makanan', '180 (maksimum 365 hari setahun)', '220 (maksimum 200 hari setahun)'],
                                             ['Unit rawatan rapi', 'Mengikut caj yang dikenakan (maksimum 90 hari)', '450 (maksimum 90 hari)'], ['Elaun tunai harian di hospital kerajaan', '100 (maksimum 365 hari)', '60 (maksimum 200 hari)'], ['Premium tahunan', '520.50', '648.30']], c, 14, False),
  stack(work([('Penyelesaian', ['Pelan polisi XX adalah lebih baik kerana walaupun kedua-duanya memberikan had tahunan keseluruhan yang sama, iaitu RM60 000, premium tahunan XX lebih kecil.',
                                'Faedah XX juga lebih baik dari segi tempoh perlindungan, iaitu sepanjang tahun bagi bilik hospital dan makanan, dan elaun tunai harian di hospital kerajaan.',
                                'Tiada had bagi unit rawatan rapi kerana pampasan dibayar mengikut caj yang dikenakan, berbeza dengan YY yang mempunyai had RM450.'])], s, 1, 16),
        note('Ketahui jumlah perlindungan yang diperlukan, fahami skop perlindungan, bandingkan kadar premium dan manfaat, dan elakkan perlindungan yang tidak perlu.', 'Panduan:')))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'insurans', 'slides.js')
HEAD = '/* Nota Bab 3 T5 ikut buku teks Matematik T5 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
