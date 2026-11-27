"""Jana versi English (DLP) simulasi Bab 9 Straight Lines T3. Jalankan dari akar repo."""
import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sim_en import jalankan
X = [('aria-label="Satah Cartes dengan dua titik dan garis lurus"', 'aria-label="Cartesian plane with two points and a straight line"'), ('aria-label="Satah Cartes dengan garis lurus"', 'aria-label="Cartesian plane with a straight line"'),
     ('aria-label="Satah Cartes dengan dua garis lurus"', 'aria-label="Cartesian plane with two straight lines"'), ('>Rawak</button>', '>Random</button>')]
T = {
'dua-titik-persamaan': [
 ('Dua Titik → Persamaan · Bab 9', 'Two Points → Equation · Chapter 9'), ('📍 Dua Titik</button>', '📍 Two Points</button>'), ('✅ Titik pada Garis</button>', '✅ Point on a Line</button>'),
 ('id="tip">Seret titik A dan B pada grid.</div>', 'id="tip">Drag points A and B on the grid.</div>'), ("tip.textContent='Seret titik A dan B pada grid.'", "tip.textContent='Drag points A and B on the grid.'"),
 ('Garis mencancang</b>', 'Vertical line</b>'), ('x₂ − x₁ = 0, maka kecerunan tidak tertakrif. Persamaan garis mencancang ialah x = h.', 'x₂ − x₁ = 0, thus the gradient is undefined. The equation of a vertical line is x = h.'),
 ('</b> Gantikan A: ${N(A.y)}', '</b> Substitute A: ${N(A.y)}'), ('</b> Persamaan: <b class="cy">', '</b> Equation: <b class="cy">'),
 ('Dua titik → persamaan</b>', 'Two points → equation</b>'), ("['Cari kecerunan, m','Cari pintasan-y, c','Tulis persamaan']", "['Find the gradient, m','Find the y-intercept, c','Write the equation']"),
 ('w=`Garis: <b class="cy">x = ${N(A.x)}</b>', 'w=`Line: <b class="cy">x = ${N(A.x)}</b>'), ('w=`Garis: <b class="cy">${eqH(o.m,o.c)}</b><div class="box">Gantikan x = ', 'w=`Line: <b class="cy">${eqH(o.m,o.c)}</b><div class="box">Substitute x = '),
 ('(koordinat-y bagi P)</div>', '(y-coordinate of P)</div>'), ('Adakah P pada garis?</b>', 'Is P on the line?</b>'),
 ("'✓ P terletak pada garis: koordinatnya memuaskan persamaan.':'✗ P tidak terletak pada garis.'", "'✓ P lies on the line: its coordinates satisfy the equation.':'✗ P does not lie on the line.'"),
 ('>Langkah seterusnya ▶</button>', '>Next step ▶</button>'), ('id="ul">Ulang</button>', 'id="ul">Repeat</button>'), ('id="sn">Letak P pada garis</button>', 'id="sn">Put P on the line</button>'), ('id="rp">P rawak</button>', 'id="rp">Random P</button>'),
 ("tip.textContent='Seret titik P (atau A dan B) pada grid.'", "tip.textContent='Drag point P (or A and B) on the grid.'"),
],
'main-m-c': [
 ('Main m &amp; c · Bab 9', 'Play with m &amp; c · Chapter 9'), ('🔁 Bentuk Lain</button>', '🔁 Other Forms</button>'), ('🎯 Padankan</button>', '🎯 Match</button>'),
 ('aria-label="Kurangkan m"', 'aria-label="Decrease m"'), ('aria-label="Kecerunan m"', 'aria-label="Gradient m"'), ('aria-label="Tambah m"', 'aria-label="Increase m"'),
 ('aria-label="Kurangkan c"', 'aria-label="Decrease c"'), ('aria-label="Pintasan-y c"', 'aria-label="y-intercept c"'), ('aria-label="Tambah c"', 'aria-label="Increase c"'),
 ("'kanan '+t.run", "'right '+t.run"), ("(t.rise>0?'naik ':'turun ')", "(t.rise>0?'up ':'down ')"),
 ("m[0]>0?'naik dari kiri ke kanan':m[0]<0?'turun dari kiri ke kanan':'mengufuk (selari dengan paksi-x)'", "m[0]>0?'rises from left to right':m[0]<0?'falls from left to right':'is horizontal (parallel to the x-axis)'"),
 ('Persamaan garis lurus</b>', 'Equation of a straight line</b>'), ('<span>Kecerunan <span class="cm">', '<span>Gradient <span class="cm">'), ('<span>Pintasan-y <span class="cc">', '<span>y-intercept <span class="cc">'),
 ("<div class=\"tip\">Garis ${dir(m)}.${m[0]!==0?` Bagi setiap ${tri().run} unit ke kanan, garis ${tri().rise>0?'naik':'turun'} ${qt(q(Math.abs(tri().rise*2),2))} unit.`:''} Seret titik ● ungu (c) atau ● biru (m), atau guna gelangsar.", "<div class=\"tip\">The line ${dir(m)}.${m[0]!==0?` For every ${tri().run} units to the right, the line goes ${tri().rise>0?'up':'down'} ${qt(q(Math.abs(tri().rise*2),2))} units.`:''} Drag the purple ● (c) or the blue ● (m), or use the sliders."),
 ('Garis yang sama, tiga bentuk</b><div class="box">Kecerunan-pintasan:', 'The same line, three forms</b><div class="box">Gradient-intercept:'), ('<div class="box">Am: <span', '<div class="box">General: <span'),
 ('<div class="box">Pintasan: <span', '<div class="box">Intercept: <span'), ('<div class="tip">Pintasan-x = <b', '<div class="tip">x-intercept = <b'), ('</b>, pintasan-y = <b class="cc">${N(c)}</b>. Semak: m = −(pintasan-y) ÷ (pintasan-x).', '</b>, y-intercept = <b class="cc">${N(c)}</b>. Check: m = −(y-intercept) ÷ (x-intercept).'),
 ("'Garis mengufuk tidak memotong paksi-x, jadi tiada bentuk pintasan.':'Garis melalui asalan (0, 0), jadi tiada bentuk pintasan.'", "'A horizontal line does not cut the x-axis, so there is no intercept form.':'The line passes through the origin (0, 0), so there is no intercept form.'"),
 ('Padankan garis putus-putus</b>', 'Match the dashed line</b>'), ('Laraskan m dan c sehingga garis kuning bertindih dengan garis <b class="cp">merah jambu</b>.', 'Adjust m and c until the yellow line overlaps the <b class="cp">pink</b> line.'),
 ('<span>Garis anda: <span class="cy">', '<span>Your line: <span class="cy">'), ("'✓':'✗'} kecerunan</span>", "'✓':'✗'} gradient</span>"),
 ('Tepat! Persamaannya ialah ${eqH(T.m,T.c)}.', 'Exact! The equation is ${eqH(T.m,T.c)}.'), ('id="nx">Garis baharu ▶</button>', 'id="nx">New line ▶</button>'), ('id="hint">Petunjuk</button>', 'id="hint">Hint</button>'),
 ('`Garis sasaran memotong paksi-y di <b class="cc">(0, ${N(T.c)})</b> dan ${dir(T.m)}.`', '`The target line cuts the y-axis at <b class="cc">(0, ${N(T.c)})</b> and ${dir(T.m)}.`'), ('id="neg">Tukar tanda m</button>', 'id="neg">Change the sign of m</button>'),
],
'persilangan-selari': [
 ('Persilangan &amp; Selari · Bab 9', 'Intersection &amp; Parallel · Chapter 9'), ('✖️ Persilangan</button>', '✖️ Intersection</button>'), ('∥ Selari</button>', '∥ Parallel</button>'),
 ('<b class="t">Titik persilangan</b>', '<b class="t">Point of intersection</b>'), ('>Bersilang di (${qh(P.x)}', '>Intersect at (${qh(P.x)}'),
 ('Garis bertindih</b>', 'Overlapping lines</b>'), ('Kedua-dua persamaan sama: semua titik adalah sepunya.', 'Both equations are the same: all the points are common.'),
 ('`<b class="t">Garis selari</b>`', '`<b class="t">Parallel lines</b>`'), (': garis selari, tiada titik persilangan.</div>', ': the lines are parallel, there is no point of intersection.</div>'),
 ('Garis selari: m₁ = m₂</b>', 'Parallel lines: m₁ = m₂</b>'), ('L₂ selari dengan L₁ dan melalui Q(', 'L₂ is parallel to L₁ and passes through Q('),
 ("'Q terletak pada L₁, jadi L₂ bertindih dengan L₁.':'Kecerunan sama, pintasan-y berbeza: kedua-dua garis tidak akan bersilang.'} Seret titik Q.", "'Q lies on L₁, so L₂ overlaps L₁.':'Same gradient, different y-intercepts: the two lines will never intersect.'} Drag point Q."),
 ('id="sel">Garis selari (tiada persilangan)</button>', 'id="sel">Parallel lines (no intersection)</button>'), ('id="nx">Soalan baharu ▶</button>', 'id="nx">New question ▶</button>'), ('id="mk">Jadikan selari</button>', 'id="mk">Make parallel</button>'),
 ('Cari titik persilangan</b>', 'Find the point of intersection</b>'), ('Ketik titik persilangan pada grid, atau tekan "Garis selari" jika tiada persilangan. ', 'Tap the point of intersection on the grid, or press "Parallel lines" if there is no intersection. '),
 ('`Kedua-dua garis mempunyai kecerunan ${qh(Z.a.m)} tetapi pintasan-y berbeza, maka garis selari dan tiada titik persilangan.`', '`Both lines have a gradient of ${qh(Z.a.m)} but different y-intercepts, thus the lines are parallel and there is no point of intersection.`'),
 ("'<span class=\"no\">✗ Belum tepat</span>'", "'<span class=\"no\">✗ Not exact yet</span>'"),
],
}
jalankan('garislurus', T, X)
