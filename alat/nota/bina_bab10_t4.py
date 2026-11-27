"""Bab 10 T4 Matematik Pengguna: Pengurusan Kewangan. Nota ikut buku teks (ayat buku, nombor dan nama ditukar).
SUBS folder kewangan dikekalkan (10.1.1, 10.1.2, 10.1.3; 10.1.3 digabung ke 10.1.2 melalui BAB.gabung). Contoh 1–6 ikut buku."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
import graf as GF
from graf import TR, PA, PU, AM, PK, GR, MU, MU3, TX

SUBS = [{"no": "10.1.1", "name": "Proses Kewangan", "col": "#38BDF8"}, {"no": "10.1.2", "name": "Pelan & Aliran Tunai", "col": "#34D399"}, {"no": "10.1.3", "name": "Menilai Pelan", "col": "#FBBF24"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())
F = fr


def rm(v):
    v = round(v, 2)
    s_ = f'{abs(v):,.2f}' if v != int(v) else f'{abs(int(v)):,}'
    return ('−' if v < 0 else '') + 'RM' + s_.replace(',', ' ')


def n(v):
    v = round(v, 2)
    return (f'{v:,.2f}' if v != int(v) else f'{int(v):,}').replace(',', ' ')


def plan(rows, cols=('(RM)',), fs=14, title='Pelan kewangan'):
    """rows: (label, [nilai...], jenis) jenis: '' biasa, 'b' jumlah (tebal), 'h' tajuk bahagian."""
    out = []
    for lab, vals, kind in rows:
        if kind == 'h':
            out.append([f'<b>{lab}</b>'] + [''] * len(cols))
        elif kind == 'b':
            out.append([f'<b>{lab}</b>'] + [f'<b>{n(v)}</b>' if v is not None else '' for v in vals])
        else:
            out.append([lab] + [n(v) if v is not None else '' for v in vals])
    return table([title] + list(cols), out, c, fs, False)


# =====================================================================
# 10.1.1 PROSES PENGURUSAN KEWANGAN
# =====================================================================
s = '10.1.1'
c = COL[s]
S(s, 'DEFINISI', 'Proses pengurusan kewangan',
  p('Perancangan dan pengurusan kewangan perlu diamalkan oleh setiap individu. Pengurusan kewangan secara berhemah akan membantu seseorang individu bebas daripada bebanan hutang.')
  + de(s, 'Pengurusan kewangan merupakan suatu proses yang melibatkan pengurusan wang daripada sumber pendapatan terhadap simpanan, perbelanjaan, perlindungan dan pelaburan.')
  + p('Terdapat lima langkah dalam proses pengurusan kewangan.'),
  steps(s, ['Menetapkan matlamat kewangan', 'Menilai kedudukan kewangan', 'Mewujudkan pelan kewangan', 'Melaksanakan pelan kewangan', 'Mengkaji semula dan menyemak kemajuan']))

S(s, 'KONSEP', 'Menetapkan matlamat kewangan',
  p('Menetapkan matlamat kewangan merupakan langkah pertama dalam proses pengurusan kewangan. Matlamat kewangan yang ditentukan mestilah mengikut keutamaan dan spesifik. Contohnya, seseorang individu yang hendak menyimpan RM12 000 dalam bank bagi tempoh masa tiga tahun sebelum berkahwin.')
  + table(['Matlamat kewangan jangka pendek', 'Matlamat kewangan jangka panjang'],
          [['Hendak dicapai kurang daripada setahun.', 'Mengambil masa lebih daripada lima tahun.'], ['Tidak melibatkan jumlah amaun yang besar.', 'Melibatkan jumlah amaun yang banyak.'],
           ['Contoh: pembelian komputer riba, kerusi sofa, telefon bimbit.', 'Contoh: simpanan untuk persaraan, pendidikan anak, pembelian rumah.']], c, 16, False),
  stack(p('Semasa menentukan matlamat kewangan, seseorang haruslah memberikan keutamaan perbelanjaan kepada <b>keperluan</b> daripada <b>kehendak</b>. Contohnya, keperluan asas seperti makanan, tempat tinggal dan pakaian perlu diutamakan.'),
        p('Kehendak ialah keinginan untuk menjalani kehidupan mewah. Perbelanjaan mengikut kehendak akan menyebabkan seseorang berbelanja lebih daripada pendapatan yang diperoleh.'),
        note('Berdisiplin dan konsisten untuk mengikuti perancangan kewangan yang ditetapkan akan membantu seseorang individu mencapai matlamat kewangan.', 'Tip:')))

S(s, 'KONSEP', 'Matlamat kewangan SMART',
  p('Matlamat kewangan yang jelas ialah satu aspek paling penting dalam perancangan kewangan. Matlamat kewangan yang berkonsep SMART akan membantu seseorang individu untuk mengawal perbelanjaan supaya dapat mencapai matlamat kewangan yang dikehendaki.')
  + p('Lima kunci komponen utama dalam strategi ini ialah:'),
  table(['', 'Komponen', 'Maksud'], [['S', '<i>Specific</i>', 'Khusus'], ['M', '<i>Measurable</i>', 'Boleh diukur'], ['A', '<i>Attainable</i>', 'Boleh dicapai'], ['R', '<i>Realistic</i>', 'Bersifat realistik'], ['T', '<i>Time-bound</i>', 'Tempoh masa']], c, 18))

assert 300 * 8 == 2400
S(s, 'CONTOH 1', 'Matlamat kewangan berpandukan konsep SMART',
  p('Encik Hafiz akan menyambut Hari Keluarga di Cherating dalam tempoh 8 bulan. Sambutan ini akan menelan perbelanjaan sebanyak RM2 400. Encik Hafiz perlu menyimpan RM300 sebulan daripada pendapatannya sebanyak RM3 000 sebulan untuk mencapai matlamat kewangan beliau. Adakah matlamat kewangan Encik Hafiz memenuhi pendekatan SMART?')
  + note('Oleh itu, Encik Hafiz mengamalkan matlamat kewangan berpandukan konsep SMART.', 'Kesimpulan:'),
  work([('Specific [Khusus]', ['Matlamat Encik Hafiz adalah untuk menyambut Hari Keluarga di Cherating. Beliau bukan sekadar ingin pergi bercuti tetapi menetapkan lokasi yang khusus.']),
        ('Measurable [Boleh diukur]', ['Beliau mengetahui jumlah wang yang diperlukan, iaitu RM2 400.']),
        ('Attainable [Boleh dicapai]', ['Boleh dicapai dengan menyimpan RM300 sebulan daripada pendapatan bulanan RM3 000.']),
        ('Realistic [Bersifat realistik]', ['Menyimpan RM300 sebulan selama 8 bulan untuk mencapai RM2 400 adalah bersifat realistik.']),
        ('Time-bound [Tempoh masa]', ['Matlamat kewangan Encik Hafiz mempunyai tempoh masa, iaitu lapan bulan.'])], s, 1, 15))

S(s, 'KONSEP', 'Menilai kedudukan kewangan dan mewujudkan pelan kewangan',
  p('Aset dan liabiliti menjadi kayu pengukur bagi menilai kedudukan kewangan. Contoh aset ialah wang tunai, simpanan, pelaburan hartanah, simpanan tetap, amanah saham atau saham syarikat. Liabiliti merupakan pinjaman bank, hutang kad kredit dan sebagainya.')
  + p('Pengurusan kehidupan berdasarkan pelan kewangan membantu seseorang memantau aliran tunai. Terdapat dua komponen penting dalam pelan kewangan, iaitu sumber pendapatan dan perbelanjaan.')
  + note('Sebagai panduan am, simpan wang untuk keperluan asas sekurang-kurangnya enam bulan.', 'Tip:'),
  stack(table(['', 'Jenis', 'Contoh'], [['Pendapatan<br>(aliran tunai masuk)', 'Aktif', 'Gaji, elaun, komisen'], ['', 'Pasif', 'Sewa yang diterima, faedah, dividen'],
                                        ['Perbelanjaan<br>(aliran tunai keluar)', 'Tetap', 'Sewa rumah, insurans, ansuran rumah dan kereta, bayaran kad kredit'], ['', 'Tidak tetap', 'Petrol, barangan dapur, bil elektrik, bil air']], c, 15, False),
        bul(s, ['Aliran tunai positif wujud jika jumlah pendapatan melebihi jumlah perbelanjaan.', 'Aliran tunai negatif wujud jika jumlah pendapatan kurang daripada jumlah perbelanjaan.'])))

# =====================================================================
# 10.1.2 PELAN KEWANGAN DAN ALIRAN TUNAI
# =====================================================================
s = '10.1.2'
c = COL[s]
assert 12000 / 3 / 12 > 333 and 20000 / 4 / 12 > 416
S(s, 'KONSEP', 'Langkah-langkah sebelum mewujudkan pelan kewangan',
  bul(s, ['Menentukan tujuan yang hendak dicapai bagi matlamat jangka pendek dan jangka panjang.', 'Membuat anggaran awal untuk mencapai setiap matlamat.', 'Mengira simpanan bulanan yang diperlukan untuk mencapai matlamat jangka pendek dan panjang.',
            'Menetapkan tempoh masa untuk mencapai setiap matlamat tersebut.', 'Menentukan strategi pendapatan yang akan membantu mencapai matlamat kewangan.', 'Menganalisis tabiat perbelanjaan.']),
  stack(p('Pengurusan kewangan yang cekap membantu seseorang menyusun strategi terhadap corak perbelanjaan supaya dapat mengumpul simpanan bulanan. Contoh matlamat kewangan seseorang individu:'),
        table(['Matlamat', 'Tahun mula', 'Tahun sasaran', 'Tempoh (tahun)', 'Jumlah (RM)', 'Simpanan sebulan (RM)'],
              [['Berkahwin', '2026', '2029', '3', '12 000', '333.33'], ['Memiliki kereta (wang pendahuluan)', '2027', '2031', '4', '20 000', '416.67']], c, 14)))

inc2, ex2 = 3200 + 800, 1500 + 700
assert inc2 - ex2 == 1800 and 3200 - ex2 * 1.6 == -320 and 3800 + 900 + 700 - 1300 - 650 == 3450
S(s, 'CONTOH 2', 'Menghitung aliran tunai bulanan',
  p('<b>CONTOH 2</b> Encik Derrick menerima pendapatan aktif sebanyak RM3 200 dan pendapatan pasif sebanyak RM800 dalam sebulan. Beliau juga mempunyai perbelanjaan tetap sebanyak RM1 500 dan perbelanjaan tidak tetap sebanyak RM700 sebulan. (a) Hitung aliran tunai bulanan Encik Derrick. Jelaskan jawapan anda. (b) Jelaskan aliran tunai Encik Derrick jika pendapatan pasif tidak wujud dan jumlah perbelanjaan meningkat sebanyak 60%.')
  + work([('Penyelesaian', ['(a) Jumlah pendapatan − Jumlah perbelanjaan = RM3 200 + RM800 − RM1 500 − RM700 = RM1 800 (Aliran tunai positif)',
                            'Aliran tunai positif adalah baik kerana Encik Derrick mempunyai lebihan untuk melabur atau menghadapi situasi kecemasan.',
                            '(b) Jumlah perbelanjaan baharu = RM2 200 × 1.6 = RM3 520', 'RM3 200 − RM3 520 = −RM320 (Aliran tunai negatif)', 'Aliran tunai negatif akan membebankan Encik Derrick dan mungkin menyebabkan beliau menggunakan kemudahan kad kredit.'])], s, 1, 14),
  stack(p('<b>CONTOH 3</b> Cik Janani bekerja sebagai seorang guru swasta dengan pendapatan RM3 800. Beliau juga mengajar tuisyen dan memperoleh RM900, dan menyewakan rumahnya sebanyak RM700 sebulan. Perbelanjaan tetap beliau RM1 300 dan perbelanjaan tidak tetap RM650 sebulan. Hitung aliran tunai bulanan Cik Janani. Jelaskan jawapan anda.'),
        work([('Penyelesaian', ['RM3 800 + RM900 + RM700 − RM1 300 − RM650 = RM3 450 (Aliran tunai positif)', 'Aliran tunai positif adalah baik kerana Cik Janani boleh menyimpan wang tersebut di bank dan menikmati faedah. Faedah ini merupakan pendapatan pasif.'])], s, 1, 15)))

S(s, 'KONSEP', 'Melaksanakan pelan kewangan',
  p('Pelaksanaan pelan kewangan menukarkan perancangan kewangan kepada tindakan yang boleh dilaksanakan.')
  + p('Seseorang individu haruslah sedia mengubah dan membuat perbandingan antara perbelanjaan bulanan yang dirancang dengan perbelanjaan sebenar. Hal ini memberikan peluang untuk mengenal pasti sebarang pembaziran.')
  + bul(s, ['Utamakan pembayaran perbelanjaan tetap seperti ansuran rumah, kad kredit dan ansuran kereta. Pembayaran lewat akan menyebabkan caj lewat bayar dikenakan.', 'Pastikan aliran tunai bulanan sentiasa positif. Jika wujud aliran tunai negatif, ambil tindakan cepat untuk mengubah corak perbelanjaan.']),
  stack(table(['Perbelanjaan Encik Razak', 'Dirancang (RM)', 'Sebenar (RM)'], [['Bil elektrik', '180', '230'], ['Makanan', '650', '900']], c, 17),
        p('Perbelanjaan Encik Razak menunjukkan pertambahan ke atas bil elektrik dan makanan daripada yang dirancang. Oleh itu, beliau perlu mengurangkan penggunaan tenaga elektrik sebanyak RM50 dan perbelanjaan makanan sebanyak RM250.')))

P4 = dict(suami=4000, isteri=3500, pasif=0)
inc4 = sum(P4.values())
sav4, em4 = inc4 * 0.10, 100
baki4 = inc4 - sav4 - em4
tetap4 = {'Pinjaman rumah': 1600, 'Ansuran kereta suami': 700, 'Premium insurans': 450}
tt4 = {'Taska': 450, 'Keperluan anak-anak': 500, 'Utiliti rumah': 400, 'Belanja petrol': 400, 'Bayaran tol': 120, 'Barangan dapur': 1100, 'Pemberian kepada ibu bapa': 500}
tt4s = dict(tt4, **{'Barangan dapur': 1000})
lb4 = baki4 - sum(tetap4.values()) - sum(tt4.values())
lb4s = baki4 - sum(tetap4.values()) - sum(tt4s.values())
assert inc4 == 7500 and sav4 == 750 and baki4 == 6650 and lb4 == 430 and lb4s == 530 and sav4 * 12 - 8500 == 500
rows4 = [('Gaji suami (gaji bersih)', [4000, 4000], ''), ('Gaji Puan Salina (gaji bersih)', [3500, 3500], ''), ('Pendapatan pasif', [0, 0], ''), ('Jumlah pendapatan bulanan', [inc4, inc4], 'b'),
         ('Tolak simpanan tetap bulanan (10%)', [sav4, sav4], ''), ('Tolak simpanan dana kecemasan', [em4, em4], ''), ('Baki pendapatan', [baki4, baki4], 'b')]
rows4 += [(k, [v, v], '') for k, v in tetap4.items()] + [('Jumlah perbelanjaan tetap bulanan', [sum(tetap4.values())] * 2, 'b')]
rows4 += [(k, [v, tt4s[k]], '') for k, v in tt4.items()] + [('Jumlah perbelanjaan tidak tetap', [sum(tt4.values()), sum(tt4s.values())], 'b'), ('Pendapatan lebihan', [lb4, lb4s], 'b')]
S(s, 'CONTOH 4', 'Pelan kewangan dan aliran tunai sebenar',
  p('Puan Salina ingin membeli kereta yang berharga RM60 000 dalam masa setahun. Beliau bercadang hendak membayar wang pendahuluan sebanyak RM8 500 daripada simpanan beliau. Sebelum ini, Puan Salina tidak mempunyai simpanan. Beliau memilih pinjaman kenderaan bank selama tujuh tahun kerana hanya mampu membayar ansuran bulanan untuk tempoh itu.')
  + p('(a) Bolehkah matlamat kewangan Puan Salina dicapai? (b) Adakah Puan Salina seseorang yang bijak mengurus kewangan? (c) Adakah Puan Salina menggunakan pendekatan SMART? Berikan justifikasi anda.')
  ,
  plan(rows4[:11], ('Pelan (RM)', 'Sebenar (RM)'), 14, 'Pelan kewangan keluarga Puan Salina'))

S(s, 'CONTOH 4 (sambungan)', 'Perbelanjaan tidak tetap dan aliran tunai',
  plan(rows4[11:], ('Pelan (RM)', 'Sebenar (RM)'), 14, 'Perbelanjaan tidak tetap bulanan')
  + note('Pendapatan lebihan = Baki pendapatan − Jumlah perbelanjaan tetap bulanan − Jumlah perbelanjaan tidak tetap bulanan', 'Ingat:'),
  stack(note('10% daripada pendapatan harus disimpan sebagai simpanan sebelum berbelanja. Aliran tunai positif merupakan simpanan tambahan.', 'Tip:'),
        p('Sikap jimat cermat Puan Salina membawa penurunan perbelanjaan barangan dapur sebanyak RM100, maka pendapatan lebihan sebenar ialah RM530.')))

S(s, 'CONTOH 4 (sambungan)', 'Penyelesaian',
  work([('(a)', ['Puan Salina boleh mencapai matlamat kewangan jangka pendek, iaitu membeli kereta dengan wang pendahuluan sebanyak RM8 500.', 'Simpanan bulanan RM750 × 12 (bulan) = RM9 000',
                 'Beliau masih mempunyai lebihan RM500 daripada keperluannya. Beliau juga mempunyai lebihan RM530 setiap bulan untuk menghadapi situasi kecemasan ataupun perbelanjaan di luar jangkaan.']),
        ('(b)', ['Beliau seorang yang bijak mengurus kewangan kerana beliau berbelanja untuk keperluan asas, mempunyai simpanan bulanan, mengutamakan perlindungan (insurans) dan tidak mempunyai hutang kad kredit.'])], s, 1, 17),
  work([('(c) Pendekatan SMART', ['Specific: membeli kereta yang berharga RM60 000', 'Measurable: membayar wang pendahuluan sebanyak RM8 500', 'Attainable: wang pendahuluan RM8 500 boleh dicapai dalam masa setahun',
                                  'Realistic: simpanan bulanan RM750 daripada pendapatan RM7 500 adalah 10% sahaja', 'Time-bound: dalam tempoh 1 tahun'])], s, 1, 17))

assert 4000 * 0.1 == 400
S(s, 'CONTOH 5', 'Mengkaji semula dan menyemak kemajuan',
  p('Kelebihan mengkaji semula dan menyemak kemajuan pelan kewangan dari semasa ke semasa adalah untuk memastikan aliran tunai sentiasa positif. Hal ini membantu mencapai matlamat kewangan seperti yang dirancang. Anda juga harus bersedia mengubah matlamat kewangan jika matlamat itu tidak realistik untuk pendapatan bulanan anda.')
  + p('<b>CONTOH 5</b> Suami Puan Salina dinaikkan pangkat dengan kenaikan gaji sebanyak 10%. Jumlah perbelanjaan lain mereka adalah tetap. Apakah kesan kenaikan gaji suami Puan Salina kepada matlamat kewangan Puan Salina? Contoh 4 dirujuk.'),
  stack(work([('Penyelesaian', [f'Kenaikan gaji suami = {F(10, 100)} × RM4 000 = RM400', 'Gaji baharu suami = RM4 000 + RM400 = RM4 400',
                                'Apabila gaji suami meningkat sebanyak 10%, jumlah wang simpanan bank boleh ditambah. Hal ini membantu pembelian kereta dalam jangka masa yang lebih singkat daripada setahun seperti yang dirancang, memandangkan perbelanjaan lain adalah tetap.'])], s, 1, 17),
        note('Pelan kewangan perlu dikaji dari semasa ke semasa. Jika strategi kewangan tidak diatur mengikut keadaan semasa, sukar untuk mencapai matlamat kewangan seperti yang dirancang.', 'Tip:')))

# =====================================================================
# 10.1.3 MENILAI KEBOLEHLAKSANAAN PELAN KEWANGAN
# =====================================================================
s = '10.1.3'
c = COL[s]
K0 = dict(gaji=4000, pasif=0)
t0 = {'Ansuran pinjaman perumahan': 900, 'Premium insurans': 400}
u0 = {'Makanan dan minuman': 700, 'Pendidikan anak-anak': 500, 'Belanja petrol': 380, 'Bil telefon': 320, 'Bil utiliti': 300, 'Melancong': 300}
baki0 = 4000 - 0 - 200
assert baki0 - sum(t0.values()) - sum(u0.values()) == 0
rows0 = [('Gaji Encik Kamal (gaji bersih)', [4000], ''), ('Pendapatan pasif', [0], ''), ('Jumlah pendapatan bulanan', [4000], 'b'), ('Tolak simpanan tetap bulanan', [0], ''), ('Tolak simpanan dana kecemasan', [200], ''), ('Baki pendapatan', [baki0], 'b')]
rows0 += [(k, [v], '') for k, v in t0.items()] + [('Jumlah perbelanjaan tetap bulanan', [sum(t0.values())], 'b')]
rows0 += [(k, [v], '') for k, v in u0.items()] + [('Jumlah perbelanjaan tidak tetap', [sum(u0.values())], 'b'), ('Pendapatan lebihan / kurangan', [0], 'b')]
S(s, 'KONSEP', 'Menilai kebolehlaksanaan pelan kewangan',
  p('Pelan kewangan bertujuan untuk mencapai matlamat kewangan jangka pendek dan jangka panjang. Untuk membina pelan kewangan, seseorang individu harus mengenal pasti sumber-sumber pendapatan dan perbelanjaannya.')
  + bul(s, ['Pelan kewangan yang cekap seharusnya mendahulukan simpanan sebanyak 10% daripada jumlah pendapatan sebelum melibatkan perbelanjaan tetap dan tidak tetap.', 'Pelan kewangan harus mengutamakan pembayaran perbelanjaan tetap seperti ansuran bulanan kereta, rumah dan baki kad kredit.',
            'Jika wujud aliran tunai negatif, betulkan pelan kewangan dengan mengurangkan perbelanjaan tidak tetap atau menambah sumber pendapatan.']),
  stack(note('Setiap perancangan kewangan harus dinilai dari semasa ke semasa. Contohnya, kadar inflasi semasa boleh menyebabkan kos taraf hidup meningkat dan seterusnya meningkatkan jumlah perbelanjaan.', 'Info:'),
        note('Jika perbelanjaan meningkat, ambil langkah menambahkan pendapatan, contohnya melalui pekerjaan sampingan atau pelaburan.', 'Tip:')))

S(s, 'CONTOH', 'Pelan kewangan Encik Kamal',
  p('Encik Kamal sebagai ejen insurans manakala isterinya seorang suri rumah. Mereka mempunyai tiga orang anak yang masih belajar. Encik Kamal ingin membeli komputer bernilai RM4 800 bagi urusan jualan insurans dalam masa setahun. Bolehkah Encik Kamal mencapai matlamatnya?'),
  plan(rows0[:9], ('(RM)',), 15, 'Pelan kewangan Encik Kamal'))

S(s, 'CONTOH', 'Bolehkah Encik Kamal mencapai matlamatnya?',
  plan(rows0[9:], ('(RM)',), 14, 'Perbelanjaan tidak tetap bulanan'),
  work([('Penyelesaian', ['Baki pendapatan − Jumlah perbelanjaan = RM3 800 − (RM1 300 + RM2 500) = RM0', 'Berdasarkan pelan kewangan, Encik Kamal tidak mempunyai simpanan untuk mencapai matlamat kewangan jangka pendek. Oleh itu, sukar bagi Encik Kamal mencapai matlamatnya.',
                          'Bantu Encik Kamal menyelesaikan masalah kewangan tanpa menggunakan dana kecemasan: (a) Adakah beliau menguruskan kewangan dengan cekap? (b) Berapakah simpanan bulanan yang harus disimpan? (c) Bagaimanakah pendapatan tambahan boleh diperoleh? (d) Wujudkan pelan kewangan baharu berdasarkan konsep SMART.'])], s, 1, 16))

t1 = dict(t0)
u1 = {'Makanan dan minuman': 650, 'Pendidikan anak-anak': 500, 'Belanja petrol': 300, 'Bil telefon': 150, 'Bil utiliti': 250, 'Melancong': 0, 'Pelaburan amanah saham': 250}
baki1 = 4000 - 400 - 200
assert baki1 - sum(t1.values()) - sum(u1.values()) == 0 and 4800 / 12 == 400 and 400 / 4000 == 0.1
rows1 = [('Jumlah pendapatan bulanan', [4000], 'b'), ('Tolak simpanan tetap bulanan (10%)', [400], ''), ('Tolak simpanan dana kecemasan', [200], ''), ('Baki pendapatan', [baki1], 'b'), ('Jumlah perbelanjaan tetap bulanan', [sum(t1.values())], 'b')]
rows1 += [(k, [v], '') for k, v in u1.items()] + [('Jumlah perbelanjaan tidak tetap', [sum(u1.values())], 'b'), ('Pendapatan lebihan', [0], 'b')]
S(s, 'CONTOH (sambungan)', 'Pelan kewangan baharu Encik Kamal',
  work([('(a) Adakah Encik Kamal menguruskan kewangan dengan cekap?', ['Tidak, kerana wujud perbelanjaan yang boleh dikurangkan seperti bil telefon serta makanan dan minuman, dan tidak ada pelaburan untuk masa depan.']),
        ('(b) Simpanan bulanan yang diperlukan', [f'{F("RM4 800", 12)} = RM400']),
        ('(c) Pendapatan tambahan', ['Menjual lebih banyak produk insurans dan memperkenalkan ejen-ejen baharu.']),
        ('(d) SMART', ['Specific: membeli komputer. Measurable: RM4 800, simpanan RM400 sebulan. Attainable dan Realistic: RM400 hanya 10% daripada pendapatan RM4 000. Time-bound: setahun.'])], s, 1, 14),
  stack(plan(rows1, ('(RM)',), 13, 'Pelan kewangan baharu Encik Kamal'), p('Simpanan RM400 sebulan membolehkan Encik Kamal mengumpul RM4 800 dalam setahun.')))

assert 600000 * 0.1 == 60000 and 60000 / 5 == 12000 and 12000 / 12 == 1000
S(s, 'CONTOH 6', 'Pelan kewangan jangka panjang',
  p('Pelan kewangan jangka panjang merupakan pelan kewangan yang melebihi lima tahun seperti pendidikan untuk anak, persaraan dan pembelian rumah. Aspek utama yang perlu diambil kira ialah kadar inflasi, kadar faedah dan kesihatan diri.')
  + p('Semasa membina pelan kewangan jangka panjang, adalah lebih baik jika kita mulakan tabungan lebih awal kerana amalan ini selamat dan dapat membantu kita mencapai matlamat kewangan dengan cepat.')
  + note('Kadar inflasi ialah keadaan ekonomi yang mengalami kenaikan dalam tingkat harga umum secara berterusan.', 'Info:'),
  stack(p('<b>CONTOH 6</b> Encik Faiz dan isterinya ingin membeli sebuah rumah dalam masa lima tahun. Jumlah pendapatan mereka berdua ialah RM9 000 dan jumlah perbelanjaan tetap dan tidak tetap ialah RM7 000. Mereka bercadang membeli rumah berharga RM600 000 dengan wang pendahuluan RM60 000. (a) Berapakah simpanan bulanan yang diperlukan? (b) Adakah Encik Faiz bijaksana dari segi pembelian rumah itu? Berikan justifikasi anda.'),
        work([('Penyelesaian', [f'(a) Simpanan tahunan = {F("RM60 000", "5 tahun")} = RM12 000', f'Simpanan bulanan = {F("RM12 000", "12 bulan")} = RM1 000',
                                '(b) Tidak. Walaupun Encik Faiz boleh membayar wang pendahuluan, ansuran bulanan rumah membebankan kerana jumlah perbelanjaan sudah tinggi. Simpanan RM1 000 sebulan tidak sukar memandangkan pendapatan RM9 000.'])], s, 1, 15)))

W = {'Gaji Encik Lim (gaji bersih)': 7000, 'Pendapatan pasif (sewa bulanan)': 500}
incW = sum(W.values())
savW = incW * 0.1
bakiW = incW - savW - 100
tW = {'Ansuran pinjaman rumah': 1500, 'Ansuran kereta': 800, 'Premium insurans': 600}
uW = {'Perbelanjaan dapur': 1400, 'Melancong': 600, 'Utiliti rumah': 350, 'Bil telefon': 300, 'Belanja petrol': 900, 'Gimnasium': 200}
uW2 = dict(uW, **{'Melancong': 450, 'Belanja petrol': 800})
assert incW == 7500 and savW == 750 and bakiW == 6650 and bakiW - sum(tW.values()) - sum(uW.values()) == 0
need = 180000 / 15 / 12
assert need == 1000 and need - savW == 250 and 600 * 0.25 == 150 and 150 + 100 == 250 and bakiW - sum(tW.values()) - sum(uW2.values()) == 250 and (750 + 250) * 12 * 15 == 180000
rowsW = [(k, [v, v], '') for k, v in W.items()] + [('Jumlah pendapatan bulanan', [incW, incW], 'b'), ('Tolak simpanan tetap bulanan (10%)', [savW, savW], ''), ('Tolak simpanan dana kecemasan', [100, 100], ''), ('Baki pendapatan', [bakiW, bakiW], 'b'),
                                                    ('Jumlah perbelanjaan tetap bulanan', [sum(tW.values())] * 2, 'b')]
rowsW += [(k, [v, uW2[k]], '') for k, v in uW.items()] + [('Jumlah perbelanjaan tidak tetap', [sum(uW.values()), sum(uW2.values())], 'b'), ('Pendapatan lebihan', [0, 250], 'b')]
S(s, 'KAJIAN KES', 'Membina pelan kewangan jangka panjang',
  p('Andaikan diri anda ialah perunding kewangan. Encik Lim bekerja sebagai pegawai pemasaran manakala isterinya seorang suri rumah dan mempunyai dua orang anak kecil. Encik Lim ingin menyimpan wang untuk pendidikan anak-anak sebanyak RM180 000 dalam masa 15 tahun dari sekarang. Bina pelan kewangan yang boleh mencapai matlamat Encik Lim.')
  + work([('Penyelesaian', [f'Simpanan tahunan = {F("RM180 000", "15 tahun")} = RM12 000', f'Simpanan bulanan = {F("RM12 000", "12 bulan")} = RM1 000', 'Tambahan simpanan yang diperlukan = RM1 000 − RM750 = RM250'])], s, 1, 16),
  plan(rowsW, ('Asal (RM)', 'Baharu (RM)'), 13, 'Pelan kewangan Encik Lim'))

S(s, 'KAJIAN KES (sambungan)', 'Cadangan dan kebolehlaksanaan pelan',
  work([('Cadangan', [f'1. Kurangkan perbelanjaan melancong sebanyak 25%: {F(25, 100)} × RM600 = RM150; perbelanjaan baharu = RM600 − RM150 = RM450', '2. Kurangkan perbelanjaan petrol sebanyak RM100 dengan berkongsi kereta dengan rakan sekerja.',
                      '3. Kedua-dua langkah menambah simpanan sebanyak RM150 + RM100 = RM250.']),
        ('Jumlah simpanan', ['Jumlah simpanan bagi 1 bulan = RM750 + RM250 = RM1 000', 'Jumlah simpanan bagi 15 tahun = RM1 000 × 12 × 15 = RM180 000',
                             'Pada hakikatnya, jumlah wang yang dikumpulkan adalah lebih kerana simpanan di bank menawarkan faedah.'])], s, 1, 16),
  stack(work([('Kebolehlaksanaan pelan bergantung pada faktor berikut', ['1. Kadar inflasi tidak melebihi kenaikan gaji.', '2. Sewa rumah yang diterima adalah tetap.', '3. Encik Lim sihat dan boleh meneruskan pekerjaan.',
                                                                         '4. Peningkatan perbelanjaan boleh diatasi dengan peningkatan gaji, sewa dan pekerjaan sambilan.', '5. Tidak ada perkara di luar jangkaan yang melibatkan kos yang tinggi.'])], s, 1, 16),
        note('Encik Lim juga boleh melabur wang yang dikumpul setiap tahun supaya memperoleh pendapatan pasif, iaitu dividen dan faedah.', 'Tip:')))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'kewangan', 'slides.js')
HEAD = '/* Nota Bab 10 ikut buku teks Matematik T4 KSSM. Dijana skrip; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
