# Penjana slaid NOTA PEMODELAN (Tingkatan 5 Bab 8 Pemodelan Matematik) -> pemodelan/slides.js
# Jalankan:  python3 tools/pemodelan/gen_slides.py
import json, os, re, html
from fractions import Fraction as F
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'pemodelan', 'slides.js'))
BG='#0B1220'; SURF='#131C2E'; NAV='#0E1626'; BD='#22304A'; TX='#E6EDF7'; MU='#94A3B8'; GRID='#1E2A40'; DIM='#334155'
C={'tr':'#38BDF8','pa':'#FB923C','pu':'#A78BFA','am':'#FBBF24','gr':'#34D399','pk':'#F472B6','rd':'#F87171'}
TR,PK,AM,GR,PU,RD=C['tr'],C['pk'],C['am'],C['gr'],C['pu'],C['rd']
def P(t): return f'<p class="sl-p">{t}</p>'
def DEF(t,c): return f'<div class="sl-def" style="--c:{c}"><p>{t}</p></div>'
def BUL(items,c): return f'<ul class="sl-bul" style="--c:{c}">'+''.join(f'<li><span>{i}</span></li>' for i in items)+'</ul>'
def STEPS(items,c): return f'<ol class="sl-steps" style="--c:{c}">'+''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n,t in enumerate(items,1))+'</ol>'
def ANS(t): return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t,lab='Ingat:'): return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def TABLE(head,rows,c):
    th=''.join(f'<th style="padding: 10px 14px; text-align: left; font-size: 18px; color: {c}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb=''.join('<tr class="rv">'+''.join(f'<td style="padding: 9px 14px; font-size: 19px; font-weight: 600; border-bottom: 1px solid {BD}">{x}</td>' for x in r)+'</tr>' for r in rows)
    return f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'
W,H=500,440
FONT='font-family="Inter, sans-serif"'
def svg(inner,label): return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def T(x,y,t,col=TX,size=20,anchor='middle'):
    return f'<text x="{round(x,1)}" y="{round(y,1)}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="{anchor}" dominant-baseline="middle" paint-order="stroke" stroke="{NAV}" stroke-width="6" stroke-linejoin="round">{t}</text>'
def LINE(p,q,col=TX,sw=4,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{round(p[0],1)}" y1="{round(p[1],1)}" x2="{round(q[0],1)}" y2="{round(q[1],1)}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def DOT(p,col,r=7): return f'<circle cx="{round(p[0],1)}" cy="{round(p[1],1)}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2"/>'
def PATH(pts,col,sw=5): return f'<path d="M'+' L'.join(f'{round(x,1)} {round(y,1)}' for x,y in pts)+f'" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def axes(xl,yl):
    s=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
    for i in range(1,9):
        s+=LINE((60+i*48,50),(60+i*48,380),GRID,1.5)+LINE((60,380-i*40),(470,380-i*40),GRID,1.5)
    s+=LINE((60,380),(475,380),MU,3)+LINE((60,385),(60,40),MU,3)
    return s+T(470,408,xl,MU,18,'end')+T(60,26,yl,MU,18)+T(48,396,'O',MU,16)
def gx(v,xmax): return 60+v/xmax*400
def gy(v,ymax): return 380-v/ymax*320
def graph(fn,xmax,ymax,col,xl,yl,pts=(),label=''):
    s=axes(xl,yl); P_=[(gx(i*xmax/80,xmax),gy(fn(i*xmax/80),ymax)) for i in range(81) if fn(i*xmax/80)<=ymax*1.05]
    s+=PATH(P_,col)
    for (a,b,t) in pts:
        s+=LINE((gx(a,xmax),380),(gx(a,xmax),gy(b,ymax)),DIM,2,'6 5')+LINE((60,gy(b,ymax)),(gx(a,xmax),gy(b,ymax)),DIM,2,'6 5')+DOT((gx(a,xmax),gy(b,ymax)),AM)+(T(gx(a,xmax)-12,gy(b,ymax)-20,t,AM,17,'end') if gx(a,xmax)>360 else T(gx(a,xmax)+12,gy(b,ymax)-20,t,AM,17,'start'))
    return svg(s,label)
S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})

# ===== 1.1 Ubahan Langsung =====
import math
OR=C['pa']
SUB={'8.1.1':('Proses Pemodelan Matematik',TR),'8.1.2':('Menyelesaikan Masalah dengan Pemodelan',OR)}
LANGKAH=['Kenal pasti & definisikan masalah','Buat andaian & kenal pasti pemboleh ubah','Aplikasikan matematik','Tentusahkan & tafsirkan','Murnikan model','Laporkan dapatan']
LCOL=[TR,PU,OR,GR,PK,AM]
def cycle(hi=None,label='Kitaran proses pemodelan matematik'):
    s=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
    cx,cy,R=250,222,150
    pts=[(cx+R*math.sin(i*math.pi/3),cy-R*math.cos(i*math.pi/3)) for i in range(6)]
    s+=f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{DIM}" stroke-width="3" stroke-dasharray="8 7"/>'
    for i in range(6):
        a=(i+0.5)*math.pi/3; ax,ay=cx+R*math.sin(a),cy-R*math.cos(a); d=a+math.pi/2
        tip=(ax+9*math.sin(d),ay-9*math.cos(d)); l=(ax-9*math.sin(d)+7*math.sin(a),ay+9*math.cos(d)-7*math.cos(a)); r=(ax-9*math.sin(d)-7*math.sin(a),ay+9*math.cos(d)+7*math.cos(a))
        s+=f'<path d="M{tip[0]:.1f} {tip[1]:.1f} L{l[0]:.1f} {l[1]:.1f} L{r[0]:.1f} {r[1]:.1f}Z" fill="{MU}"/>'
    for i,(x,y) in enumerate(pts):
        on = hi is None or hi==i
        s+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{34 if hi==i else 28}" fill="{LCOL[i] if on else NAV}" stroke="{LCOL[i]}" stroke-width="4"/>'
        s+=T(x,y,str(i+1),NAV if on else LCOL[i],24)
    s+=T(cx,cy-14,'Pemodelan',TX,22)+T(cx,cy+16,'Matematik',TX,22)
    if hi is not None: s+=T(cx,418,LANGKAH[hi],LCOL[hi],19)
    return svg(s,label)
add('8.1.1','8.1 Pemodelan Matematik','Apakah pemodelan matematik?',
    DEF('<b>Pemodelan matematik</b> ialah proses mewakilkan masalah kehidupan sebenar dalam bentuk matematik (persamaan, fungsi, graf atau jadual) untuk memahami dan menyelesaikan masalah itu.',TR)
    +BUL(['<b>Model matematik</b> ialah hasilnya, contohnya <i>C</i> = 3<i>t</i> + 5.','Model membantu kita <b>meramal</b> dan <b>membuat keputusan</b>.','Model ialah <b>anggaran</b>, bukan gambaran yang tepat 100%.'],TR),
    cycle(None))
add('8.1.1','8.1.1 Proses pemodelan','Enam langkah proses pemodelan',
    STEPS(['<b>Kenal pasti & definisikan masalah</b> – apakah yang perlu dicari?','<b>Buat andaian & kenal pasti pemboleh ubah</b> – permudahkan keadaan.','<b>Aplikasikan matematik</b> – bina model dan selesaikan.','<b>Tentusahkan & tafsirkan</b> – adakah jawapan munasabah?','<b>Murnikan (perhalusi) model</b> – ubah andaian jika perlu.','<b>Laporkan dapatan</b> – nyatakan penyelesaian dengan jelas.'],TR)
    +NOTE('Proses ini ialah <b>kitaran</b>: jika model tidak sepadan dengan keadaan sebenar, kita kembali memperhalusi model.'),
    cycle(4,'Kitaran proses pemodelan – langkah perhalusi kembali ke langkah awal'))
def iofig():
    s=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'+T(250,40,'Pemboleh ubah dalam model',TX,20)
    def box(x,y,w,h,col,a,b):
        return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{col}" fill-opacity=".2" stroke="{col}" stroke-width="3"/>'+T(x+w/2,y+h/2-14,a,col,19)+T(x+w/2,y+h/2+16,b,MU,15)
    s+=box(20,150,140,110,TR,'t jam','tak bersandar')+box(180,150,140,110,OR,'C = 3t + 5','model')+box(340,150,140,110,PK,'RM C','bersandar')
    s+=LINE((162,205),(176,205),MU,4)+LINE((322,205),(336,205),MU,4)
    s+=f'<rect x="40" y="310" width="420" height="80" rx="14" fill="{NAV}" stroke="{PU}" stroke-width="3"/>'+T(250,336,'Andaian: kadar sewa tetap,',PU,17)+T(250,364,'tiada caj tambahan',PU,17)
    return svg(s,'Pemboleh ubah tak bersandar masuk ke model, keluar pemboleh ubah bersandar')
add('8.1.1','8.1.1 Andaian & pemboleh ubah','Membuat andaian dan memilih pemboleh ubah',
    BUL(['<b>Andaian</b> memudahkan masalah sebenar, contohnya kadar tetap, cuaca baik, tiada caj lain.','<b>Pemboleh ubah tak bersandar</b>: nilai yang kita pilih atau ubah (contoh: masa <i>t</i>).','<b>Pemboleh ubah bersandar</b>: nilai yang bergantung padanya (contoh: kos <i>C</i>).','Andaian yang berbeza boleh menghasilkan model yang berbeza.'],TR)
    +NOTE('Tulis andaian dengan jelas supaya model boleh disemak dan dimurnikan.'),iofig())
# contoh: sewa basikal RM5 + RM3 sejam
for t,c_ in ((1,8),(2,11),(4,17)): assert 3*t+5==c_
assert (26-5)/3==7
add('8.1.1','Contoh 1','Sewa basikal di taman',
    P('Sewa basikal: caj asas RM5 dan RM3 bagi setiap jam. Aina ada RM26. Berapa jam dia boleh menyewa?')
    +STEPS(['<b>Masalah:</b> cari bilangan jam maksimum dengan RM26.','<b>Andaian:</b> kadar tetap; tiada caj lain. Pemboleh ubah: masa <i>t</i> jam, kos RM<i>C</i>.','<b>Model:</b> <i>C</i> = 3<i>t</i> + 5 → 26 = 3<i>t</i> + 5 → <i>t</i> = 7','<b>Tentusahkan:</b> 3(7) + 5 = 26 ✓ munasabah.'],TR)+ANS('Aina boleh menyewa selama 7 jam.'),
    graph(lambda x:3*x+5,8,30,TR,'t (jam)','C (RM)',[(7,26,'(7, 26)')],'Graf kos C = 3t + 5'))
# tentusahkan: data sebenar vs model
data=[(0,5),(1,8),(2,11),(3,14.5),(4,17)]
for t,c_ in data: assert abs((3*t+5)-c_)<=0.5
add('8.1.1','8.1.1 Tentusahkan & murnikan','Adakah model sepadan dengan data?',
    P('Bandingkan nilai daripada model <i>C</i> = 3<i>t</i> + 5 dengan data sebenar:')
    +TABLE(['t (jam)','Data sebenar (RM)','Model (RM)'],[[str(t),f'{c_:g}',str(3*t+5)] for t,c_ in data],TR)
    +NOTE('Perbezaan kecil → model <b>boleh diterima</b>. Jika perbezaan besar, <b>perhalusi</b> andaian (contoh: tambah caj insurans).','Tafsir:'),
    graph(lambda x:3*x+5,5,20,TR,'t','C',[(3,14.5,'data (3, 14.5)')],'Data sebenar hampir dengan garis model'))
def refig():
    s=axes('n (helai)','C (RM)')
    s+=PATH([(gx(x,60),gy(15*x,1000)) for x in (0,60)],DIM,4).replace('stroke-linecap','stroke-dasharray="10 8" stroke-linecap')
    s+=PATH([(gx(x,60),gy(15*x+50,1000)) for x in (0,60)],OR)
    for x,y in ((10,200),(20,350)): s+=DOT((gx(x,60),gy(y,1000)),PK,8)
    s+=DOT((gx(50,60),gy(800,1000)),AM,8)+T(gx(50,60)-12,gy(800,1000)-22,'(50, 800)',AM,17,'end')
    s+=T(300,330,'model awal C = 15n',MU,16,'start')+T(150,150,'C = 15n + 50',OR,18,'start')
    return svg(s,'Model awal dan model yang dimurnikan')
add('8.1.1','Contoh 2','Murnikan dan laporkan',
    P('Kelab mencetak baju: RM15 sehelai. Model awal <i>C</i> = 15<i>n</i>. Bil sebenar: 10 helai RM200, 20 helai RM350. Bajet kelab RM800.')
    +STEPS(['<b>Tentusahkan:</b> model memberi RM150 dan RM300, sentiasa kurang RM50.','<b>Murnikan:</b> ada caj reka bentuk RM50 → <i>C</i> = 15<i>n</i> + 50','800 = 15<i>n</i> + 50 → 15<i>n</i> = 750 → <i>n</i> = 50','<b>Laporkan:</b> kelab boleh mencetak 50 helai baju dengan RM800.'],TR)+ANS('50 helai baju'),refig())
add('8.1.1','Kesilapan biasa','Awas & ringkasan',
    BUL(['<b>Salah:</b> terus mengira tanpa menyatakan andaian. Andaian mesti ditulis.','<b>Salah:</b> menganggap model sentiasa tepat. Model perlu <b>ditentusahkan</b>.','Jawapan mesti <b>munasabah</b>: bilangan orang tidak boleh 2.5, masa tidak boleh negatif.'],RD)
    +NOTE('Kenal pasti → Andaian → Aplikasi → Tentusahkan → Murnikan → Laporkan','Ringkasan:'),
    cycle(3,'Langkah tentusahkan dan tafsirkan'))

# ===== 8.1.2 =====
c=OR
add('8.1.2','8.1.2 Jenis model','Tiga model fungsi',
    TABLE(['Model','Bentuk','Ciri data'],[['Linear','y = mx + c','perbezaan pertama tetap'],['Kuadratik','y = ax² + bx + c','perbezaan kedua tetap'],['Eksponen','y = a(bˣ)','nisbah berturutan tetap']],c)
    +BUL(['Linear: kadar perubahan sama (contoh: tambang teksi).','Kuadratik: graf parabola (contoh: lontaran bola).','Eksponen: tumbuh/susut berganda (contoh: bakteria, faedah kompaun).'],c),
    svg(axes('x','y')+PATH([(gx(i/10,8),gy(1.5*i/10+1,16)) for i in range(81)],TR)+PATH([(gx(i/10,8),gy((i/10)**2/4,16)) for i in range(81)],PK)+PATH([(gx(i/10,8),gy(2**(i/10)/2,16)) for i in range(81) if 2**(i/10)/2<=16.5],AM)+T(440,170,'linear',TR,18)+T(400,250,'kuadratik',PK,18,'end')+T(370,70,'eksponen',AM,18,'end'),'Graf linear, kuadratik dan eksponen'))
assert 20*20+50==450 and (450-50)/20==20
add('8.1.2','Contoh 1 · Linear','Simpanan mingguan',
    P('Hafiz ada RM50 dan menyimpan RM20 setiap minggu. Selepas berapa minggu simpanannya menjadi RM450?')
    +STEPS(['Andaian: simpanan tetap setiap minggu, tiada pengeluaran.','Pemboleh ubah: <i>w</i> minggu, simpanan RM<i>S</i>.','Model linear: <i>S</i> = 20<i>w</i> + 50','450 = 20<i>w</i> + 50 → 20<i>w</i> = 400 → <i>w</i> = 20'],c)+ANS('20 minggu'),
    graph(lambda x:20*x+50,24,500,c,'w','S (RM)',[(20,450,'(20, 450)')],'Graf simpanan S = 20w + 50'))
h=lambda t:-5*t*t+20*t
assert h(2)==20 and h(4)==0 and h(1)==15
add('8.1.2','Contoh 2 · Kuadratik','Lontaran bola',
    P('Tinggi bola, <i>h</i> m, selepas <i>t</i> saat dimodelkan oleh <i>h</i> = −5<i>t</i>² + 20<i>t</i>. Cari tinggi maksimum dan bila bola mencecah tanah.')
    +STEPS(['Andaian: rintangan udara diabaikan.','Paksi simetri: <i>t</i> = −20 ÷ (2 × −5) = 2','<i>h</i>(2) = −5(4) + 40 = 20 m','Tanah: −5<i>t</i>² + 20<i>t</i> = 0 → −5<i>t</i>(<i>t</i> − 4) = 0 → <i>t</i> = 4'],c)+ANS('Tinggi maksimum 20 m; mencecah tanah selepas 4 saat.'),
    graph(h,4.5,25,PK,'t (s)','h (m)',[(2,20,'(2, 20)'),(4,0,'(4, 0)')],'Parabola h = −5t² + 20t'))
N=lambda t:200*2**t
assert N(5)==6400 and N(3)==1600
add('8.1.2','Contoh 3 · Eksponen','Pertumbuhan bakteria',
    P('Bilangan bakteria ialah 200 pada mulanya dan <b>berganda dua</b> setiap jam. Cari bilangan bakteria selepas 5 jam.')
    +STEPS(['Andaian: makanan dan ruang mencukupi.','Model eksponen: <i>N</i> = 200(2<sup><i>t</i></sup>)','<i>t</i> = 5: <i>N</i> = 200 × 2⁵ = 200 × 32'],c)+ANS('6 400 bakteria')
    +NOTE('Nisbah berturutan: 400 ÷ 200 = 800 ÷ 400 = 2 (tetap) → model eksponen.'),
    graph(N,5,7000,AM,'t (jam)','N',[(3,1600,'(3, 1600)'),(5,6400,'(5, 6400)')],'Graf eksponen N = 200 kali 2 kuasa t'))
V=lambda t:80000*0.85**t
add('8.1.2','Contoh 4 · Eksponen','Susut nilai kereta',
    P('Harga sebuah kereta baharu ialah RM80 000. Nilainya <b>susut 15%</b> setiap tahun. Cari nilai kereta selepas 3 tahun.')
    +STEPS(['Andaian: kadar susut tetap 15% setahun.','Nilai tinggal 85% setiap tahun (<i>b</i> = 0.85 &lt; 1) → <i>V</i> = 80 000(0.85<sup><i>t</i></sup>)','<i>t</i> = 3: <i>V</i> = 80 000 × 0.85³ = 80 000 × 0.614125','= RM49 130'],c)+ANS('RM49 130'),
    graph(V,8,90000,AM,'t (tahun)','V (RM)',[(3,49130,'(3, 49 130)')],'Graf susut nilai V = 80000 kali 0.85 kuasa t'))
A_=lambda x:x*(20-x)
add('8.1.2','Contoh 5 · Kuadratik','Luas kebun maksimum',
    P('Pak Mat ada 40 m pagar untuk memagar kebun segi empat tepat. Cari ukuran kebun supaya luasnya maksimum.')
    +STEPS(['Andaian: semua 40 m pagar digunakan.','Panjang <i>x</i> m → lebar = (40 − 2<i>x</i>) ÷ 2 = 20 − <i>x</i>','Model: <i>A</i> = <i>x</i>(20 − <i>x</i>) = −<i>x</i>² + 20<i>x</i>','Maksimum pada <i>x</i> = −20 ÷ (2 × −1) = 10 → <i>A</i> = 10 × 10 = 100'],c)+ANS('10 m × 10 m, luas maksimum 100 m²'),
    graph(A_,20,120,PK,'x (m)','A (m²)',[(10,100,'(10, 100)')],'Parabola A = x(20 − x)'))
d1=[3,7,11,15]; assert len({b-a for a,b in zip(d1,d1[1:])})==1
d2=[1,4,9,16,25]; f2=[b-a for a,b in zip(d2,d2[1:])]; assert len({b-a for a,b in zip(f2,f2[1:])})==1
d3=[5,15,45,135]; assert len({b/a for a,b in zip(d3,d3[1:])})==1
add('8.1.2','8.1.2 Memilih model','Data mana, model mana?',
    TABLE(['Data y (x = 1, 2, 3, …)','Ujian','Model'],[['3, 7, 11, 15','beza: 4, 4, 4','Linear'],['1, 4, 9, 16, 25','beza: 3, 5, 7, 9 → beza kedua 2, 2, 2','Kuadratik'],['5, 15, 45, 135','nisbah: 3, 3, 3','Eksponen']],c)
    +NOTE('Selepas memilih model, <b>tentusahkan</b> dengan satu lagi titik data, kemudian laporkan.'),'')
add('8.1.2','Kesilapan & ringkasan','Awas!',
    BUL(['<b>Salah:</b> data 5, 15, 45 dianggap linear kerana “bertambah”. Semak beza <b>dan</b> nisbah.','Dalam <i>y</i> = <i>a</i>(<i>b</i><sup><i>x</i></sup>), <i>a</i> ialah nilai awal (apabila <i>x</i> = 0).','Tafsir jawapan dalam konteks: masa negatif atau bilangan pecahan perlu ditolak/dibundarkan.'],RD)
    +TABLE(['Model','Contoh harian'],[['Linear','tambang, gaji, simpanan tetap'],['Kuadratik','lontaran, luas, keuntungan maksimum'],['Eksponen','populasi, faedah kompaun, susut nilai']],c),'')

counts={}
for s in S: counts[s['sub']]=counts.get(s['sub'],0)+1
idx={}; out=[]
for s in S:
    idx[s['sub']]=idx.get(s['sub'],0)+1
    out.append({'sub':s['sub'],'n':idx[s['sub']],'N':counts[s['sub']],'kicker':s['kicker'],'title':s['title'],'body':s['body'],'fig':s['fig'],'full':''})
subs=[{'no':k,'name':v[0],'col':v[1]} for k,v in SUB.items()]
body=json.dumps(out,ensure_ascii=False)
ALLOWED={x.lower() for x in [BG,SURF,NAV,BD,TX,MU,GRID,DIM]+list(C.values())}
bad={h for h in re.findall(r'#[0-9a-fA-F]{6}',body) if h.lower() not in ALLOWED}
assert not bad,bad
assert 'NaN' not in body and 'None' not in body
assert counts=={'8.1.1':7,'8.1.2':8},counts
open(OUT,'w').write('/* Dijana oleh tools/pemodelan/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
print(len(out),'slaid ->',OUT)
