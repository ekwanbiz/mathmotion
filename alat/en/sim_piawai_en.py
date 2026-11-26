"""Jana versi English (DLP) simulasi Bab 2 Bentuk Piawai T3: simulasi/<id>_en.html.
Jalankan dari akar repo: python3 alat/en/sim_piawai_en.py"""
COMMON = [('<html lang="ms"', '<html lang="en"'), ('&#8592; Kembali', '&#8592; Back'), ('aria-label="Mod"', 'aria-label="Mode"'),
          ("' berturut-turut'", "' in a row'"), ("✓ Betul!", "✓ Correct!"), ('Seterusnya ▶', 'Next ▶'), ('Nombor baharu', 'New number')]
T = {
'angka-bererti': [
 ('Angka Bererti · Bab 2', 'Significant Figures · Chapter 2'),
 ('👆 Tanda Bererti', '👆 Mark Significant'), ('🎯 Bundarkan', '🎯 Round Off'), ('aria-label="Jubin digit nombor"', 'aria-label="Digit tiles of the number"'),
 ("const PLACE={1:'puluh',2:'ratus',3:'ribu',4:'puluh ribu'};", "const PLACE={1:'ten',2:'hundred',3:'thousand',4:'ten thousand'};"),
 ("'Ketik digit yang <tspan fill=\"'+C2+'\">bererti</tspan>'", "'Tap the <tspan fill=\"'+C2+'\">significant</tspan> digits'"),
 ('`(betul kepada ${PLACE[N.place]} terdekat)`', '`(correct to the nearest ${PLACE[N.place]})`'),
 ("'Hijau: betul · Kuning: tertinggal · Merah: tidak bererti'", "'Green: correct · Yellow: missed · Red: not significant'"),
 ('`Ditanda: ${S.marks.filter(Boolean).length} digit`', '`Marked: ${S.marks.filter(Boolean).length} digit(s)`'),
 ('<b class="t">Digit manakah bererti?</b>Nombor: <b>${N.str}</b>${N.place?` (betul kepada ${PLACE[N.place]} terdekat)`', '<b class="t">Which digits are significant?</b>Number: <b>${N.str}</b>${N.place?` (correct to the nearest ${PLACE[N.place]})`'),
 ('• Digit bukan sifar: bererti<br>• Sifar di antara digit bukan sifar: bererti<br>• Sifar di hadapan: <b style="color:${BAD}">tidak</b> bererti<br>• Sifar di hujung perpuluhan: bererti',
  '• Non-zero digits: significant<br>• Zeros between non-zero digits: significant<br>• Zeros in front: <b style="color:${BAD}">not</b> significant<br>• Zeros at the end of a decimal: significant'),
 ("Skor: ${S.score}/${S.tot}", "Score: ${S.score}/${S.tot}"),
 ('`Nombor bulat ini betul kepada ${PLACE[N.place]} terdekat, jadi sifar selepas tempat ${PLACE[N.place]} tidak bererti.`', '`This whole number is correct to the nearest ${PLACE[N.place]}, so the zeros after the ${PLACE[N.place]}s place are not significant.`'),
 ("'Sifar di hadapan digit bukan sifar pertama tidak bererti; ia hanya menunjukkan kedudukan titik perpuluhan.'", "'The digit zero before the first non-zero digit is not a significant figure; it only shows the position of the decimal point.'"),
 ("'Sifar di hujung nombor perpuluhan adalah bererti kerana ia menunjukkan kejituan.'", "'The digit zero at the end of a decimal is a significant figure because it determines the level of accuracy.'"),
 ("'Sifar di antara digit bukan sifar adalah bererti.'", "'The digit zero between non-zero digits is a significant figure.'"),
 ("'Semua digit bukan sifar adalah bererti.'", "'All non-zero digits are significant figures.'"),
 ("'<span class=\"no\">✗ Belum tepat</span>'", "'<span class=\"no\">✗ Not yet right</span>'"),
 ("${N.place?' ('+PLACE[N.place]+' terdekat)':''} mempunyai <b>${k} angka bererti</b>", "${N.place?' (nearest '+PLACE[N.place]+')':''} has <b>${k} significant figure${k>1?'s':''}</b>"),
 ("'Seret ● pada garis nombor'", "'Drag ● on the number line'"),
 ("'Digit selepasnya diganti dengan sifar.':'Digit selepasnya digugurkan.'", "'The digits after it are replaced with zero.':'The digits after it are dropped.'"),
 ('<span>betul kepada <b>${P.n} angka bererti</b></span>', '<span>correct to <b>${P.n} significant figure${P.n>1?\'s\':\'\'}</b></span>'),
 ('Digit ke-${P.n}: <span style="color:${C2}">${X}</span> · digit seterusnya:', 'Significant digit ${P.n}: <span style="color:${C2}">${X}</span> · next digit:'),
 ('`${Y} ≥ 5 → tambah 1 pada digit ke-${P.n}`:`${Y} &lt; 5 → digit ke-${P.n} kekal`', '`${Y} ≥ 5 → add 1 to significant digit ${P.n}`:`${Y} &lt; 5 → significant digit ${P.n} remains unchanged`'),
 ('Nilai lebih dekat dengan <b style="color:${C2}">${res}</b>. Seret titik merah jambu melepasi tengah untuk melihat jawapan berubah.', 'The value is closer to <b style="color:${C2}">${res}</b>. Drag the pink point past the middle to see the answer change.'),
 ('>Semak ✓<', '>Check ✓<'), ("${S.hint?'Tutup':'Petunjuk'}", "${S.hint?'Close':'Hint'}"),
 ('<label for="nr">Angka bererti</label>', '<label for="nr">Significant figures</label>'),
 ('>Nombor bulat</button>', '>Whole number</button>'), ('>Perpuluhan</button>', '>Decimal</button>'),
],
'skala-alam': [
 ('Skala Alam · Bab 2', 'Scale of Nature · Chapter 2'),
 ('🔭 Zum Alam', '🔭 Zoom Nature'), ('↔️ Gerak Titik', '↔️ Move the Point'), ('❓ Cabaran', '❓ Challenge'), ('aria-label="Rajah skala alam"', 'aria-label="Scale of nature diagram"'),
 ("['Atom hidrogen (diameter)'", "['Hydrogen atom (diameter)'"), ("['Virus (diameter)'", "['Virus (diameter)'"), ("['Bakteria (panjang)'", "['Bacterium (length)'"),
 ("['Sel darah merah (diameter)'", "['Red blood cell (diameter)'"), ("['Rambut (diameter)'", "['Hair (diameter)'"), ("['Semut (panjang)'", "['Ant (length)'"),
 ("['Murid (tinggi)'", "['Student (height)'"), ("['Menara Berkembar Petronas (tinggi)'", "['Petronas Twin Towers (height)'"), ("['Gunung Kinabalu (tinggi)'", "['Mount Kinabalu (height)'"),
 ("['Bumi (diameter)'", "['Earth (diameter)'"), ("['Jarak Bumi ke Bulan'", "['Distance from the Earth to the Moon'"), ("['Matahari (diameter)'", "['Sun (diameter)'"),
 ("['Jarak Bumi ke Matahari'", "['Distance from the Earth to the Sun'"), ("['Satu tahun cahaya'", "['One light year'"), ("['Galaksi Bima Sakti (diameter)'", "['Milky Way Galaxy (diameter)'"),
 ('`n = ${n} positif: titik perpuluhan digerakkan ${n} tempat ke kanan.`:n<0?`n = −${-n} negatif: titik perpuluhan digerakkan ${-n} tempat ke kiri.`:\'n = 0: nombor itu sendiri ialah A.\'',
  '`n = ${n} is positive: the decimal point is moved ${n} place${n>1?\'s\':\'\'} to the right.`:n<0?`n = −${-n} is negative: the decimal point is moved ${-n} place${-n>1?\'s\':\'\'} to the left.`:\'n = 0: the number itself is A.\''),
 ('Seret ● pada skala atau tekan butang untuk zum. Nilai ialah anggaran.', 'Drag ● on the scale or press the buttons to zoom. The values are estimations.'),
 ("'Seret titik perpuluhan ● ke kiri atau ke kanan'", "'Drag the decimal point ● to the left or to the right'"),
 ("`${Math.abs(moves)} tempat ke ${moves>0?'kiri':'kanan'}`", "`${Math.abs(moves)} place${Math.abs(moves)>1?'s':''} to the ${moves>0?'left':'right'}`"),
 ("'✓ 1 ≤ A < 10: bentuk piawai!':(+A>=10?'A ≥ 10: gerak titik ke kiri':'A < 1: gerak titik ke kanan')", "'✓ 1 ≤ A < 10: standard form!':(+A>=10?'A ≥ 10: move the point to the left':'A < 1: move the point to the right')"),
 ("'Titik belum bergerak → n = 0.':`Titik bergerak ${Math.abs(n)} tempat ke ${n>0?'kiri → n = '+n:'kanan → n = −'+(-n)}.`", "'The point has not moved → n = 0.':`The point moves ${Math.abs(n)} place${Math.abs(n)>1?'s':''} to the ${n>0?'left → n = '+n:'right → n = −'+(-n)}.`"),
 ("' <span class=\"ok\">Ini bentuk piawai.</span>'", "' <span class=\"ok\">This is standard form.</span>'"),
 ('Setiap gerakan titik mengubah A, tetapi nilai A × 10<sup>n</sup> tetap sama dengan nombor asal.', 'Every move of the point changes A, but the value of A × 10<sup>n</sup> stays equal to the original number.'),
 ("'Pilih bentuk piawai bagi saiz ini':'Pilih nombor tunggal bagi saiz ini'", "'Choose the standard form for this size':'Choose the single number for this size'"),
 ("Skor: ${S.score}/${S.tot}", "Score: ${S.score}/${S.tot}"),
 ("'<span class=\"no\">✗ Jawapan: '", "'<span class=\"no\">✗ Answer: '"),
 ('>− Zum keluar</button>', '>− Zoom out</button>'), ('>Zum masuk +</button>', '>Zoom in +</button>'),
 ('>◀ Kiri</button>', '>◀ Left</button>'), ('>Kanan ▶</button>', '>Right ▶</button>'),
],
}
for sid, pairs in T.items():
    src = f'piawai/simulasi/{sid}.html'; s = open(src).read()
    for a, b in COMMON + pairs:
        if a not in s:
            if (a, b) in COMMON: continue
            raise SystemExit(f'{sid}: tak jumpa {a!r}')
        s = s.replace(a, b)
    open(f'piawai/simulasi/{sid}_en.html', 'w').write(s)
    print('ok', sid)
