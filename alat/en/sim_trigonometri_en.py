"""Jana versi English (DLP) simulasi Bab 5 Nisbah Trigonometri T3: simulasi/<id>_en.html.
Istilah ikut buku teks English: hypotenuse, opposite side, adjacent side, sine/cosine/tangent, angle of elevation.
Jalankan dari akar repo: python3 alat/en/sim_trigonometri_en.py"""
COMMON = [('<html lang="ms"', '<html lang="en"'), ('&#8592; Kembali', '&#8592; Back'), ('aria-label="Mod"', 'aria-label="Mode"'),
          ("' berturut-turut'", "' in a row'"), ("✓ Betul!", "✓ Correct!"), ('Seterusnya ▶', 'Next ▶'), ("Skor: ${S.score}/${S.tot}", "Score: ${S.score}/${S.tot}"),
          ("'<span class=\"no\">✗ Jawapan: '", "'<span class=\"no\">✗ Answer: '"), ('❓ Cabaran', '❓ Challenge'), ('kos θ', 'cos θ'), ('kos ${a}°', 'cos ${a}°'),
          ('aria-label="Sudut theta"', 'aria-label="Angle theta"')]
T = {
'klinometer': [
 ('Klinometer · Bab 5', 'Clinometer · Chapter 5'), ('🌳 Ukur Tinggi', '🌳 Measure Height'),
 ('aria-label="Mengukur tinggi objek dengan klinometer"', 'aria-label="Measuring the height of an object with a clinometer"'),
 ("'mata '+EYE+' m'", "'eye '+EYE+' m'"), ("'tinggi = '+f2(S.H)+' m'", "'height = '+f2(S.H)+' m'"),
 ('<br>Tinggi = ${f2(x)} + ${EYE}', '<br>Height = ${f2(x)} + ${EYE}'),
 ('<b class="t">Sudut klinometer: ${S.a}°</b>', '<b class="t">Clinometer angle: ${S.a}°</b>'),
 ('✓ Garis penglihatan tepat ke puncak!', '✓ The line of sight is exactly on the top!'),
 ('Tinggi sebenar: ${f2(S.H)} m. Perbezaan kecil kerana sudut dibundarkan kepada darjah terdekat.', 'Actual height: ${f2(S.H)} m. There is a small difference because the angle is rounded off to the nearest degree.'),
 ("Seret ● atau gunakan gelangsar supaya garis penglihatan <b>tepat</b> mengenai puncak ${S.obj==='tiang'?'tiang bendera':S.obj}.", "Drag ● or use the slider so that the line of sight hits <b>exactly</b> the top of the ${ON[S.obj]}."),
 ('Sudut di antara garis mengufuk paras mata dengan garis penglihatan ke puncak dipanggil sudut dongakan. Ubah jarak dan lihat sudut berubah.', 'The angle between the horizontal line at eye level and the line of sight to the top is called the angle of elevation. Change the distance and see the angle change.'),
 ("Berapakah tinggi ${S.obj==='tiang'?'tiang bendera':S.obj} ini?", "What is the height of this ${ON[S.obj]}?"),
 ('✓ Sudut dongakan = ${S.a}°</div>Kira x = ${S.d} × tan ${S.a}°, kemudian tambah ${EYE} m.', '✓ Angle of elevation = ${S.a}°</div>Calculate x = ${S.d} × tan ${S.a}°, then add ${EYE} m.'),
 ("'Langkah 1: halakan klinometer tepat ke puncak (seret ●).'", "'Step 1: aim the clinometer exactly at the top (drag ●).'"),
 ('<label>Sudut <span id="vA">', '<label>Angle <span id="vA">'), ('aria-label="Sudut klinometer"', 'aria-label="Clinometer angle"'),
 ('<label>Jarak <span id="vD">', '<label>Distance <span id="vD">'), ('aria-label="Jarak dari objek"', 'aria-label="Distance from the object"'),
 ('>Tukar objek</button>', '>Change object</button>'), ('>Halakan tepat</button>', '>Aim exactly</button>'),
 ("let S={m:'ukur'", "const ON={pokok:'tree',bangunan:'building',tiang:'flagpole'};\nlet S={m:'ukur'"),
],
'segi-tiga-serupa': [
 ('Segi Tiga Serupa · Bab 5', 'Similar Triangles · Chapter 5'), ('🔍 Serupa', '🔍 Similar'), ('🔄 Kesan Sudut', '🔄 Angle Effect'), ('❓ Ramal', '❓ Predict'),
 ('aria-label="Segi tiga serupa"', 'aria-label="Similar triangles"'),
 ("'putus-putus: saiz asal'", "'dashed: original size'"),
 ('<b class="t">θ = ${S.th}°, skala × ${S.k.toFixed(1)}</b><table class="tbl"><tr><th>Segi tiga</th><th>bert.</th><th>bers.</th><th>hip.</th></tr>${row(\'Asal\',G0)}${row(\'Baharu\',G)}', '<b class="t">θ = ${S.th}°, scale × ${S.k.toFixed(1)}</b><table class="tbl"><tr><th>Triangle</th><th>opp.</th><th>adj.</th><th>hyp.</th></tr>${row(\'Original\',G0)}${row(\'New\',G)}'),
 ('<tr><th>Nisbah</th><th>Asal</th><th>Baharu</th></tr>', '<tr><th>Ratio</th><th>Original</th><th>New</th></tr>'),
 ('Seret ● untuk besarkan atau kecilkan. Sisi berubah, tetapi nisbah <b>kekal</b> selagi θ sama.', 'Drag ● to enlarge or reduce. The sides change, but the ratios <b>stay the same</b> as long as θ is the same.'),
 ("'hipotenus = 1 unit'", "'hypotenuse = 1 unit'"),
 ("'Saiz berubah, bentuk sama'", "'Size changes, same shape'"),
 ('Ramal dahulu, kemudian lihat rajah. ', 'Predict first, then look at the diagram. '),
 ("q:'Segi tiga dibesarkan 2 kali, θ tidak berubah. Nilai sin θ …',a:'Kekal sama',sh:'skala',why:'Semua sisi digandakan, jadi nisbah tidak berubah.'", "q:'The triangle is enlarged 2 times, θ does not change. The value of sin θ …',a:'Stays the same',sh:'skala',why:'All the sides are doubled, so the ratio does not change.'"),
 ("q:'Segi tiga dikecilkan separuh, θ tidak berubah. Nilai tan θ …',a:'Kekal sama',sh:'skala',why:'Sisi bertentangan dan bersebelahan dikecilkan dengan faktor yang sama.'", "q:'The triangle is reduced to half its size, θ does not change. The value of tan θ …',a:'Stays the same',sh:'skala',why:'The opposite side and the adjacent side are reduced by the same factor.'"),
 ("q:'θ bertambah dari 20° ke 60°. Nilai sin θ …',a:'Bertambah',sh:[20,60],why:'Hipotenus tetap, sisi bertentangan menjadi lebih panjang.'", "q:'θ increases from 20° to 60°. The value of sin θ …',a:'Increases',sh:[20,60],why:'The hypotenuse is fixed, the opposite side becomes longer.'"),
 ("q:'θ bertambah dari 25° ke 70°. Nilai cos θ …',a:'Berkurang',sh:[25,70],why:'Hipotenus tetap, sisi bersebelahan menjadi lebih pendek.'", "q:'θ increases from 25° to 70°. The value of cos θ …',a:'Decreases',sh:[25,70],why:'The hypotenuse is fixed, the adjacent side becomes shorter.'"),
 ("q:'θ bertambah dari 30° ke 55°. Nilai tan θ …',a:'Bertambah',sh:[30,55],why:'Sisi bertentangan bertambah, sisi bersebelahan berkurang.'", "q:'θ increases from 30° to 55°. The value of tan θ …',a:'Increases',sh:[30,55],why:'The opposite side increases, the adjacent side decreases.'"),
 ("q:'θ berkurang dari 70° ke 35°. Nilai cos θ …',a:'Bertambah',sh:[70,35],why:'Apabila θ berkurang, cos θ bertambah.'", "q:'θ decreases from 70° to 35°. The value of cos θ …',a:'Increases',sh:[70,35],why:'When θ decreases, cos θ increases.'"),
 ("q:'θ berkurang dari 65° ke 15°. Nilai sin θ …',a:'Berkurang',sh:[65,15],why:'Apabila θ berkurang, sin θ berkurang.'", "q:'θ decreases from 65° to 15°. The value of sin θ …',a:'Decreases',sh:[65,15],why:'When θ decreases, sin θ decreases.'"),
 ("q:'Segi tiga dibesarkan 3 kali, θ tidak berubah. Nilai cos θ …',a:'Kekal sama',sh:'skala',why:'Bagi sudut yang sama, nisbah sisi adalah tetap.'", "q:'The triangle is enlarged 3 times, θ does not change. The value of cos θ …',a:'Stays the same',sh:'skala',why:'For the same angle, the ratios of the sides are constant.'"),
 ("Seret ● di sepanjang lengkok. θ bertambah: sin ↑, kos ↓, tan ↑. ${a===45?'<b>tan 45° = 1</b>: sisi bertentangan = sisi bersebelahan.':a>45?'tan θ &gt; 1 apabila θ &gt; 45°.':'tan θ &lt; 1 apabila θ &lt; 45°.'}", "Drag ● along the arc. θ increases: sin ↑, cos ↓, tan ↑. ${a===45?'<b>tan 45° = 1</b>: opposite side = adjacent side.':a>45?'tan θ &gt; 1 when θ &gt; 45°.':'tan θ &lt; 1 when θ &lt; 45°.'}"),
 ("['Bertambah','Berkurang','Kekal sama']", "['Increases','Decreases','Stays the same']"),
 ('<label>Skala <span id="vK">', '<label>Scale <span id="vK">'), ('aria-label="Skala segi tiga"', 'aria-label="Scale of the triangle"'),
],
'sisi-sudut': [
 ('Sisi &amp; Sudut · Bab 5', 'Sides &amp; Angles · Chapter 5'), ('📐 Teroka', '📐 Explore'), ('⭐ Sudut Khas', '⭐ Special Angles'),
 ('aria-label="Segi tiga bersudut tegak"', 'aria-label="Right-angled triangle"'),
 ("{AC:'hipotenus',[R.opp]:'bertentangan',[R.adj]:'bersebelahan'}", "{AC:'hypotenuse',[R.opp]:'opposite',[R.adj]:'adjacent'}"),
 ("'hipotenus AC'", "'hypotenuse AC'"), ("'bertentangan '+R.opp", "'opposite '+R.opp"), ("'bersebelahan '+R.adj", "'adjacent '+R.adj"),
 ('θ = ${ang}° (sudut di ${S.at})', 'θ = ${ang}° (angle at ${S.at})'),
 ('Seret titik ● C. Bila θ bertambah: sin ↑, kos ↓, tan ↑. Tekan <b>Tukar sudut</b>: sisi bertentangan dan bersebelahan bertukar, hipotenus kekal.', 'Drag point ● C. When θ increases: sin ↑, cos ↓, tan ↑. Press <b>Change angle</b>: the opposite side and the adjacent side swap, the hypotenuse stays the same.'),
 ('<b class="t">Sudut khas 30°, 45°, 60°</b>Pilih satu sudut di bawah untuk melihat nilai tepatnya.<div class="tip">Nilai ini boleh ditulis tanpa kalkulator.</div>', '<b class="t">Special angles 30°, 45°, 60°</b>Choose an angle below to see its exact values.<div class="tip">These values can be written without a calculator.</div>'),
 ('Sisi segi tiga: <span class="opp">bertentangan ${sides[0]}</span>, <span class="adj">bersebelahan ${sides[1]}</span>, <span class="hip">hipotenus ${sides[2]}</span>', 'Sides of the triangle: <span class="opp">opposite ${sides[0]}</span>, <span class="adj">adjacent ${sides[1]}</span>, <span class="hip">hypotenuse ${sides[2]}</span>'),
 ("{hyp:'hipotenus',opp:'sisi bertentangan',adj:'sisi bersebelahan'}", "{hyp:'hypotenuse',opp:'opposite side',adj:'adjacent side'}"),
 ('<b class="t">Ketik ${NM[ask]} bagi θ</b><div class="tip">Ketik terus pada sisi segi tiga. ', '<b class="t">Tap the ${NM[ask]} of θ</b><div class="tip">Tap directly on a side of the triangle. '),
 ("k==='AC'?'hipotenus':k===R.opp?'bertentangan':'bersebelahan'", "k==='AC'?'hypotenuse':k===R.opp?'opposite':'adjacent'"),
 ("'Hipotenus bertentangan dengan sudut tegak (di B).'", "'The hypotenuse is opposite the right angle (at B).'"),
 ('`Sisi bertentangan tidak menyentuh bucu θ (${Q.at}).`', '`The opposite side does not touch the vertex of θ (${Q.at}).`'),
 ('`Sisi bersebelahan menyentuh bucu θ (${Q.at}), tetapi bukan hipotenus.`', '`The adjacent side touches the vertex of θ (${Q.at}), but it is not the hypotenuse.`'),
 ("'<span class=\"ok\">✓ Correct! '", "'<span class=\"ok\">✓ Correct! '"),
 ('aria-label="Sudut di A"', 'aria-label="Angle at A"'), ('Tukar sudut (θ di ${', 'Change angle (θ at ${'), ('>Sudut rawak</button>', '>Random angle</button>'),
 ('>Langkau</button>', '>Skip</button>'), ('>Mula semula skor</button>', '>Reset score</button>'),
],
}
for sid, pairs in T.items():
    s = open(f'trigonometri/simulasi/{sid}.html').read()
    for a, b in COMMON + pairs:
        if a not in s:
            if (a, b) in COMMON: continue
            raise SystemExit(f'{sid}: tak jumpa {a!r}')
        s = s.replace(a, b)
    open(f'trigonometri/simulasi/{sid}_en.html', 'w').write(s)
    print('ok', sid)
