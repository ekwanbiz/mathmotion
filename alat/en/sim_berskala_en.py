"""Jana versi English (DLP) simulasi Bab 4 Lukisan Berskala T3: simulasi/<id>_en.html.
Jalankan dari akar repo: python3 alat/en/sim_berskala_en.py"""
COMMON = [('<html lang="ms"', '<html lang="en"'), ('&#8592; Kembali', '&#8592; Back'), ('aria-label="Mod"', 'aria-label="Mode"'),
          ("' berturut-turut'", "' in a row'"), ("✓ Betul!", "✓ Correct!"), ('Seterusnya ▶', 'Next ▶'), ("Skor: ${S.score}/${S.tot}", "Score: ${S.score}/${S.tot}"),
          ("'<span class=\"no\">✗ Jawapan: '", "'<span class=\"no\">✗ Answer: '"), ('❓ Cabaran', '❓ Challenge'), ("'1 petak = 1 cm'", "'1 square = 1 cm'")]
T = {
'penukar-skala': [
 ('Penukar Skala · Bab 4', 'Scale Converter · Chapter 4'), ('📐 Tukar Skala', '📐 Change Scale'),
 ('aria-label="Kertas grid dengan lukisan berskala"', 'aria-label="Grid paper with a scale drawing"'),
 ("nm:'Rumah'", "nm:'House'"), ("nm:'Kereta'", "nm:'Car'"), ("nm:'Bas'", "nm:'Bus'"), ("nm:'Semut'", "nm:'Ant'"),
 ("'Terlalu besar untuk kertas ini!'", "'Too big for this paper!'"),
 ('">dikecilkan</span>', '">smaller than the object</span>'), ('<span class="ok">sama saiz</span>', '<span class="ok">the same size as the object</span>'), ('">dibesarkan</span>', '">bigger than the object</span>'),
 ('· Skala 1 : ${frs(n)}</b>', '· Scale 1 : ${frs(n)}</b>'),
 ('<span>Sebenar: <b class="o">', '<span>Actual: <b class="o">'), ('<span>Lukisan: <b>', '<span>Drawing: <b>'),
 ('<div class="eq">Lebar lukisan = ${nf(o.w)} cm ${op} = ${nf(dw)} cm<br>Tinggi lukisan = ${nf(o.h)} cm ${op} = ${nf(dh)} cm</div>', '<div class="eq">Width of drawing = ${nf(o.w)} cm ${op} = ${nf(dw)} cm<br>Height of drawing = ${nf(o.h)} cm ${op} = ${nf(dh)} cm</div>'),
 ('1 cm pada lukisan mewakili ${real(v)}. Lukisan ini ${kind}. Seret gelangsar untuk menukar skala.', '1 cm on the drawing represents ${real(v)}. This drawing is ${kind}. Drag the slider to change the scale.'),
 ('q=`Lebar sebenar ${o.nm.toLowerCase()} ialah ${rl(o.w)}. Skala 1 : ${frs(n)}. Berapakah lebar lukisannya?`', 'q=`The actual width of the ${o.nm.toLowerCase()} is ${rl(o.w)}. Scale 1 : ${frs(n)}. What is the width of its drawing?`'),
 ('q=`Lebar lukisan ${o.nm.toLowerCase()} ini ialah ${nf(dw)} cm dengan skala 1 : ${frs(n)}. Berapakah lebar sebenarnya?`', 'q=`The width of this drawing of the ${o.nm.toLowerCase()} is ${nf(dw)} cm with a scale of 1 : ${frs(n)}. What is its actual width?`'),
 ('q=`Lebar sebenar ${o.nm.toLowerCase()} ialah ${rl(o.w)} dan lebar lukisannya ${nf(dw)} cm. Apakah skala lukisan itu?`', 'q=`The actual width of the ${o.nm.toLowerCase()} is ${rl(o.w)} and the width of its drawing is ${nf(dw)} cm. What is the scale of the drawing?`'),
 ('Petua: ukuran lukisan = ukuran sebenar ÷ n · ukuran sebenar = ukuran lukisan × n. ', 'Tip: measurement of drawing = actual measurement ÷ n · actual measurement = measurement of drawing × n. '),
 ('<label for="sl">Skala</label>', '<label for="sl">Scale</label>'), ('aria-label="Pilih skala"', 'aria-label="Choose a scale"'),
],
'pelan-rumah': [
 ('Pelan Rumah · Bab 4', 'House Plan · Chapter 4'), ('📏 Ukur Pelan', '📏 Measure the Plan'),
 ('aria-label="Pelan rumah pada grid dengan pembaris maya"', 'aria-label="House plan on a grid with a virtual ruler"'),
 ("[['Ruang tamu',", "[['Living room',"), ("['Bilik tidur 1',", "['Bedroom 1',"), ("['Bilik tidur 2',", "['Bedroom 2',"), ("['Dapur',", "['Kitchen',"), ("['Bilik air',", "['Bathroom',"), ("['Ruang makan',", "['Dining room',"),
 ('`Skala 1 : ${S.n}`,C1,15', '`Scale 1 : ${S.n}`,C1,15'),
 ('📏 Pembaris: ${exact?nf(L):\'≈ \'+L.toFixed(2)} cm pada pelan</b>', '📏 Ruler: ${exact?nf(L):\'≈ \'+L.toFixed(2)} cm on the plan</b>'),
 ('<span>Sebenar ${exact', '<span>Actual ${exact'), ('<br>Luas sebenar = ${nf(rw)}', '<br>Actual area = ${nf(rw)}'),
 ('Seret titik ● kuning untuk mengukur. Ketik bilik untuk melihat ukuran dan luasnya. 1 cm pada pelan mewakili ${S.n} cm = ${nf(S.n/100)} m.', 'Drag the yellow ● points to measure. Tap a room to see its measurements and area. 1 cm on the plan represents ${S.n} cm = ${nf(S.n/100)} m.'),
 ('q=`Skala 1 : ${n}. Berapakah panjang sebenar dinding atas ${nm.toLowerCase()}?`', 'q=`Scale 1 : ${n}. What is the actual length of the top wall of the ${nm.toLowerCase()}?`'),
 ('q=`Skala 1 : ${n}. Berapakah panjang sebenar dinding kiri ${nm.toLowerCase()}?`', 'q=`Scale 1 : ${n}. What is the actual length of the left wall of the ${nm.toLowerCase()}?`'),
 ('q=`Skala 1 : ${n}. Berapakah luas sebenar lantai ${nm.toLowerCase()}?`', 'q=`Scale 1 : ${n}. What is the actual floor area of the ${nm.toLowerCase()}?`'),
 ('q=`Panjang sebenar dinding atas ${nm.toLowerCase()} ialah ${nf(rw)} m. Ukur pada pelan, kemudian tentukan skala pelan itu.`', 'q=`The actual length of the top wall of the ${nm.toLowerCase()} is ${nf(rw)} m. Measure on the plan, then determine the scale of the plan.`'),
 ('Guna pembaris maya (seret titik ●) untuk mengukur pada pelan. ', 'Use the virtual ruler (drag the ● points) to measure on the plan. '),
 ('`Pada pelan: ${nf(w)} cm', '`On the plan: ${nf(w)} cm'), ('`Pada pelan: ${nf(h)} cm', '`On the plan: ${nf(h)} cm'),
 ("`Skala 1 : ${S.n}`,hideSk?'Skala 1 : ?':`Skala 1 : ${S.n}`", "`Scale 1 : ${S.n}`,hideSk?'Scale 1 : ?':`Scale 1 : ${S.n}`"),
],
'lukis-grid': [
 ('Lukis pada Grid · Bab 4', 'Draw on Grid · Chapter 4'), ('aria-label="Pilih skala"', 'aria-label="Choose a scale"'),
 ('aria-label="Grid objek dan grid lukisan"', 'aria-label="Object grid and drawing grid"'),
 ('↶ Undur</button>', '↶ Undo</button>'), ('id="clr">Padam</button>', 'id="clr">Clear</button>'), ('id="baru">Bentuk baharu</button>', 'id="baru">New shape</button>'), ('id="semak">Semak ✓</button>', 'id="semak">Check ✓</button>'),
 ("'Skala 1 : 1/2 → setiap sisi lukisan = 2 × sisi objek'", "'Scale 1 : 1/2 → every side of the drawing = 2 × side of the object'"),
 ("'Skala 1 : 1/3 → setiap sisi lukisan = 3 × sisi objek'", "'Scale 1 : 1/3 → every side of the drawing = 3 × side of the object'"),
 ("'Skala 1 : 2 → setiap sisi lukisan = sisi objek ÷ 2'", "'Scale 1 : 2 → every side of the drawing = side of the object ÷ 2'"),
 ("'Skala 1 : 1 → lukisan sama saiz dengan objek'", "'Scale 1 : 1 → the drawing is the same size as the object'"),
 ("'Objek (1 petak = 1 cm)'", "'Object (1 square = 1 cm)'"), ('`Lukis di sini · skala ${SK[S.sk][0]}`', '`Draw here · scale ${SK[S.sk][0]}`'),
 ('<b class="t">Lukis lukisan berskala ${sk[0]}</b>', '<b class="t">Draw the scale drawing with a scale of ${sk[0]}</b>'),
 ('✓ Correct! Bentuk sama dan setiap sisi mengikut skala ${sk[0]}.', '✓ Correct! The shape is the same and every side follows the scale ${sk[0]}.'),
 ('id="tj">Tunjuk jawapan</button>', 'id="tj">Show answer</button>'),
 ('Ketik titik persilangan grid untuk meletakkan bucu satu demi satu. Ketik bucu pertama semula untuk menutup bentuk.', 'Tap the grid intersections to place the vertices one by one. Tap the first vertex again to close the shape.'),
 ('<div class="tip">Bucu: ${n}${a?` · sisi terakhir:', '<div class="tip">Vertices: ${n}${a?` · last side:'),
 ("' · bentuk ditutup, tekan Semak':' · ketik bucu pertama untuk menutup'", "' · shape closed, press Check':' · tap the first vertex to close'"),
 ("textContent='Letakkan sekurang-kurangnya 3 bucu dahulu.'", "textContent='Place at least 3 vertices first.'"),
 ('S.why=uw!==ww||uh!==wh?`Saiz belum tepat: lebar ${uw} cm × tinggi ${uh} cm, sepatutnya ${ww} cm × ${wh} cm.`:`Saiz betul tetapi bentuk berbeza. Semak setiap sisi dan bucu.`', 'S.why=uw!==ww||uh!==wh?`The size is not right yet: width ${uw} cm × height ${uh} cm, it should be ${ww} cm × ${wh} cm.`:`The size is right but the shape is different. Check every side and vertex.`'),
],
}
for sid, pairs in T.items():
    src = f'berskala/simulasi/{sid}.html'; s = open(src).read()
    for a, b in COMMON + pairs:
        if a not in s:
            if (a, b) in COMMON: continue
            raise SystemExit(f'{sid}: tak jumpa {a!r}')
        s = s.replace(a, b)
    open(f'berskala/simulasi/{sid}_en.html', 'w').write(s)
    print('ok', sid)
