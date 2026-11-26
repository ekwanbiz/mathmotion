"""Jana versi English (DLP) simulasi Bab 1 Indeks T3: simulasi/<id>_en.html.
Jalankan dari akar repo: python3 alat/en/sim_indeks_en.py"""
import re
COMMON = [
 ('<html lang="ms"', '<html lang="en"'),
 ('&#8592; Kembali', '&#8592; Back'),
 ('href="../#/teroka"', 'href="../#/teroka"'),
]
T = {
'gandaan-separuh': [
 ('Gandaan &amp; Separuh · Bab 1','Doubling &amp; Halving · Chapter 1'),
 ('aria-label="Asas"','aria-label="Base"'),
 ('🦠 Asas 2','🦠 Base 2'),('🌿 Asas 3','🌿 Base 3'),
 ('Gandaan dan separuh: nilai asas kuasa t','Doubling and halving: value of base to the power t'),
 ('▶ Main dari awal','▶ Play from start'),('⏸ Henti','⏸ Stop'),
 ("'indeks t'","'index t'"),('`nilai ${S.b}^{t}`','`value of ${S.b}^{t}`'),
 ("'◀ separuh · ganda ▶'.replace('separuh',S.b===2?'÷ 2':'÷ 3').replace('ganda',S.b===2?'× 2':'× 3')",
  "'◀ half · double ▶'.replace('half',S.b===2?'÷ 2':'÷ 3').replace('double',S.b===2?'× 2':'× 3')"),
 ("'Bakteria membahagi dua':'Pokok bercabang tiga'","'Bacteria splitting in two':'Tree branching in three'"),
 ("'Satu bakteria membahagi kepada 2 setiap jam.':'Setiap dahan bercabang kepada 3 setiap minggu.'} Selepas <b>${t}</b> ${B===2?'jam':'minggu'}:",
  "'One bacterium divides into 2 every hour.':'Each branch splits into 3 every week.'} After <b>${t}</b> ${B===2?(t>1?'hours':'hour'):(t>1?'weeks':'week')}:"),
 ('Setiap langkah ke kanan: darab ${B}. Indeks = bilangan kali didarab.','Each step to the right: multiply by ${B}. Index = number of times multiplied.'),
 ('<b class="t">Indeks sifar</b>Belum ada pendaraban: hanya <b>1</b> ${B===2?\'bakteria\':\'dahan\'} asal.',
  '<b class="t">Zero index</b>No multiplication yet: only the <b>1</b> original ${B===2?\'bacterium\':\'branch\'}.'),
 ('Dari ${B}<sup>1</sup> = ${B}, bahagi dengan ${B} untuk mendapat','From ${B}<sup>1</sup> = ${B}, divide by ${B} to get'),
 ("Indeks negatif = ${B===2?'separuh':'pertiga'} berulang</b>Sekeping kek dibahagi ${B} sama besar, ambil satu bahagian, dan ulang <b>${n}</b> kali:",
  "Negative index = repeated ${B===2?'halving':'thirding'}</b>A cake is divided into ${B} equal parts, one part is taken, and this is repeated <b>${n}</b> ${n>1?'times':'time'}:"),
 ('Setiap langkah ke kiri: bahagi ${B}. Indeks negatif bukan nombor negatif, tetapi pecahan.','Each step to the left: divide by ${B}. A negative index is not a negative number, but a fraction.'),
],
'mesin-hukum': [
 ('Mesin Hukum Indeks · Bab 1','Laws of Indices Machine · Chapter 1'),
 ('aria-label="Mod"','aria-label="Mode"'),('⚙️ Mesin','⚙️ Machine'),('❓ Cabaran','❓ Challenge'),
 ('aria-label="Mesin hukum indeks"','aria-label="Laws of indices machine"'),
 ("n:'Darab'","n:'Multiply'"),("n:'Bahagi'","n:'Divide'"),("n:'Kuasa'","n:'Power'"),("n:'Sifar'","n:'Zero'"),("n:'Negatif'","n:'Negative'"),("n:'Pecahan'","n:'Fraction'"),
 ('Asas sama (${a}), jadi <b>tambah</b> indeks.','Same base (${a}), so <b>add</b> the indices.'),
 ('Asas sama (${a}), jadi <b>tolak</b> indeks.','Same base (${a}), so <b>subtract</b> the indices.'),
 ("'Indeks sifar: hasilnya 1.'","'Zero index: the result is 1.'"),
 ("'Kuasa bagi kuasa: <b>darab</b> indeks.'","'Power of a power: <b>multiply</b> the indices.'"),
 ('`Hukum bahagi: ${a}^{${m} − ${m}} = ${a}^{0}`','`Law of division: ${a}^{${m} − ${m}} = ${a}^{0}`'),
 ('`Tetapi ${val(a,m)} ÷ ${val(a,m)} = 1`','`But ${val(a,m)} ÷ ${val(a,m)} = 1`'),('`Maka ${a}^{0} = 1`','`Hence ${a}^{0} = 1`'),
 ('`Indeks negatif = <b>salingan</b>.`','`Negative index = <b>reciprocal</b>.`'),
 ('`Permudahkan indeks: ${m}/${n} = ${m/g}/${n/g}`','`Simplify the index: ${m}/${n} = ${m/g}/${n/g}`'),
 ('`Penyebut ${n} → punca kuasa ${n}: ${root}${a} = ${r0}`','`Denominator ${n} → root ${n}: ${root}${a} = ${r0}`'),
 ('`Pengangka ${m} → kuasa ${m}: ${r0}^{${m}} = ${pw(r0,m)}`','`Numerator ${m} → power ${m}: ${r0}^{${m}} = ${pw(r0,m)}`'),
 ("'MESIN '+L.n.toUpperCase()","L.n.toUpperCase()+' MACHINE'"),
 ('Semak dengan nilai:','Check with values:'),
 ('PILIH HUKUM','CHOOSE A LAW'),("'PUNCA (ⁿ√a)':'ASAS a'","'ROOT (ⁿ√a)':'BASE a'"),
 ('aria-label="Nilai m"','aria-label="Value of m"'),('aria-label="Nilai n"','aria-label="Value of n"'),('🎲 Rawak','🎲 Random'),
 ('Permudahkan atau nilaikan</b>Pilih jawapan yang betul di bawah.','Simplify or evaluate</b>Choose the correct answer below.'),
 ("Skor: ${S.score}/${S.tot}${S.streak>=3?' · 🔥 '+S.streak+' berturut-turut':''}","Score: ${S.score}/${S.tot}${S.streak>=3?' · 🔥 '+S.streak+' in a row':''}"),
 ("'CABARAN'","'CHALLENGE'"),
 ("✓ Betul!","✓ Correct!"),("✗ Jawapan: ","✗ Answer: "),('</b>Hukum: ${H(','</b>Law: ${H('),
 ('Seterusnya ▶','Next ▶'),
],
'pembina-kuasa': [
 ('Pembina Kuasa · Bab 1','Power Builder · Chapter 1'),
 ('aria-label="Hukum"','aria-label="Law"'),('✖ Darab','✖ Multiply'),('➗ Bahagi','➗ Divide'),('⬆ Kuasa','⬆ Power'),
 ('aria-label="Blok faktor bagi hukum indeks"','aria-label="Factor blocks for the laws of indices"'),
 ("'Kumpulan 1: a^{m}'","'Group 1: a^{m}'"),("'Kumpulan 2: a^{n}'","'Group 2: a^{n}'"),
 ('`${m} + ${n} = ${tot} faktor`','`${m} + ${n} = ${tot} factors`'),
 ('<b class="t">Hukum pendaraban</b>Asas sama → <b>tambah</b> indeks.','<b class="t">Law of multiplication</b>Same base → <b>add</b> the indices.'),
 ('Semak nilai:','Check the value:'),
 ('Seret bulatan ● di hujung baris untuk menambah atau mengurangkan faktor.','Drag the ● circle at the end of a row to add or remove factors.'),
 ("'Pengangka: a^{m}'","'Numerator: a^{m}'"),("'Penyebut: a^{n}'","'Denominator: a^{n}'"),
 ('`Batalkan ${k} pasang faktor sepunya`','`Cancel ${k} ${k>1?\'pairs\':\'pair\'} of common factors`'),
 ("'Tekan “Batalkan sepasang”'","'Press “Cancel a pair”'"),
 ('<b class="t">Hukum pembahagian</b>Asas sama → <b>tolak</b> indeks.','<b class="t">Law of division</b>Same base → <b>subtract</b> the indices.'),
 ('Setiap faktor ${a} di atas boleh dibatalkan dengan satu faktor ${a} di bawah (${a} ÷ ${a} = 1).','Each factor ${a} on top can be cancelled with one factor ${a} below (${a} ÷ ${a} = 1).'),
 ('Indeks sifar!</span> Semua faktor terbatal, jadi','Zero index!</span> All factors cancel, so'),
 ('Indeks negatif!</span> Faktor yang tinggal berada di penyebut:','Negative index!</span> The remaining factors are in the denominator:'),
 ('`${n} kumpulan × ${m} faktor = ${m*n} faktor`','`${n} groups × ${m} factors = ${m*n} factors`'),
 ('<b class="t">Hukum kuasa</b>Kuasa bagi kuasa → <b>darab</b> indeks.','<b class="t">Law of powers</b>Power of a power → <b>multiply</b> the indices.'),
 ('Seret ● biru untuk ubah <i>m</i> (faktor setiap kumpulan) dan ● kuning untuk ubah <i>n</i> (bilangan kumpulan).','Drag the blue ● to change <i>m</i> (factors in each group) and the yellow ● to change <i>n</i> (number of groups).'),
 ("lm=S.mode==='kuasa'?'faktor':'m',ln=S.mode==='kuasa'?'kumpulan':'n'","lm=S.mode==='kuasa'?'factors':'m',ln=S.mode==='kuasa'?'groups':'n'"),
 ('<div class="lab">ASAS</div>','<div class="lab">BASE</div>'),
 ('aria-label="Kurangkan m"','aria-label="Decrease m"'),('aria-label="Tambah m"','aria-label="Increase m"'),
 ('aria-label="Kurangkan n"','aria-label="Decrease n"'),('aria-label="Tambah n"','aria-label="Increase n"'),
 ('✂ Batalkan sepasang','✂ Cancel a pair'),('>Batal semua<','>Cancel all<'),('🎲 Nilai rawak','🎲 Random values'),
],
}
for sid, pairs in T.items():
    src = f'indeks/simulasi/{sid}.html'; s = open(src).read()
    for a, b in COMMON + pairs:
        if a not in s:
            if a.startswith('<html') or a.startswith('href'): continue
            raise SystemExit(f'{sid}: tak jumpa {a!r}')
        s = s.replace(a, b)
    open(f'indeks/simulasi/{sid}_en.html', 'w').write(s)
    print('ok', sid)
