# Penjana slaid NOTA PERCUKAIAN (Tingkatan 5 Bab 4) -> percukaian/slides.js
# Jalankan:  python3 tools/percukaian/gen_slides.py
import json, os, re, html
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'percukaian', 'slides.js'))
BG='#0B1220'; SURF='#131C2E'; NAV='#0E1626'; BD='#22304A'; TX='#E6EDF7'; MU='#94A3B8'; GRID='#1E2A40'; DIM='#334155'
C={'tr':'#38BDF8','pa':'#FB923C','pu':'#A78BFA','am':'#FBBF24','gr':'#34D399','pk':'#F472B6','rd':'#F87171'}
TR,PK,AM,GR,PU,RD,PA=C['tr'],C['pk'],C['am'],C['gr'],C['pu'],C['rd'],C['pa']
SUB={'4.1.1':('Tujuan & Jenis Cukai',GR),'4.1.3':('Cukai Pendapatan',TR),'4.1.4':('Cukai Jalan, Pintu, Tanah & SST',AM)}
def P(t): return f'<p class="sl-p">{t}</p>'
def DEF(t,c): return f'<div class="sl-def" style="--c:{c}"><p>{t}</p></div>'
def BUL(items,c): return f'<ul class="sl-bul" style="--c:{c}">'+''.join(f'<li><span>{i}</span></li>' for i in items)+'</ul>'
def STEPS(items,c): return f'<ol class="sl-steps" style="--c:{c}">'+''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n,t in enumerate(items,1))+'</ol>'
def ANS(t): return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t,lab='Ingat:'): return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def TABLE(head,rows,c):
    th=''.join(f'<th style="padding: 8px 12px; text-align: left; font-size: 17px; color: {c}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb=''.join('<tr class="rv">'+''.join(f'<td style="padding: 7px 12px; font-size: 17px; font-weight: 600; border-bottom: 1px solid {BD}">{x}</td>' for x in r)+'</tr>' for r in rows)
    return f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'
W,H=500,440
FONT='font-family="Inter, sans-serif"'
def svg(inner,label): return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def T(x,y,t,col=TX,size=20,anchor='middle'):
    return f'<text x="{round(x,1)}" y="{round(y,1)}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="{anchor}" dominant-baseline="middle">{t}</text>'
def RECT(x,y,w,h,fill,stroke=BD,rx=12): return f'<rect x="{round(x,1)}" y="{round(y,1)}" width="{round(w,1)}" height="{round(h,1)}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def BG_(): return RECT(0,0,W,H,SURF)
def rm(v):
    s=f'{v:,.2f}'.replace(',','\u00a0')
    return 'RM'+(s[:-3] if s.endswith('.00') else s)

# kadar cukai pendapatan (jadual buku teks, kadar berperingkat)
BANDS=[(0,5000,0,0),(5000,20000,1,0),(20000,35000,3,150),(35000,50000,8,600),(50000,70000,14,1800),(70000,100000,21,4600),(100000,250000,24,10900)]
def tax(ci):
    for lo,hi,r,base in BANDS:
        if ci<=hi: return round(base+(ci-lo)*r/100,2)
for i in range(1,len(BANDS)):
    lo,hi,r,b=BANDS[i-1]; assert BANDS[i][3]==round(b+(hi-lo)*r/100,2)
def ARW(p,q,col=MU,sw=4):
    import math
    a=math.atan2(q[1]-p[1],q[0]-p[0]); h=12
    l=(q[0]-h*math.cos(a-0.45),q[1]-h*math.sin(a-0.45)); r=(q[0]-h*math.cos(a+0.45),q[1]-h*math.sin(a+0.45))
    return f'<line x1="{p[0]}" y1="{p[1]}" x2="{q[0]}" y2="{q[1]}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/><path d="M{l[0]:.1f} {l[1]:.1f} L{q[0]} {q[1]} L{r[0]:.1f} {r[1]:.1f}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def hbar(title,rows,foot,label,scale=None):
    # rows: [(label, [(nilai, teks dalam bar, warna)])]
    s=BG_()+T(250,34,title,TX,20); mx=scale or max(sum(v for v,_,_ in segs) for _,segs in rows)
    for i,(lab,segs) in enumerate(rows):
        y=90+i*120; x=40; s+=T(40,y,lab,TX,17,'start')
        for v,t,col in segs:
            w=420*v/mx
            if w>0: s+=RECT(x,y+18,w,56,col,col,8).replace('fill="'+col+'"','fill="'+col+'" fill-opacity=".3"')+(T(x+w/2,y+46,t,col,16) if w>60 else '')
            x+=w
    return svg(s+T(250,415,foot,MU,16),label)

def lainfig():
    s=BG_()
    cards=[('CKHT','untung jual rumah','LHDNM',TR),('Duti import','barang masuk','JKDM',AM),('Duti setem','surat perjanjian','LHDNM',PU),('Cukai','pelancong di hotel','JKDM',PK)]
    for i,(a,b,ag,col) in enumerate(cards):
        x=20+(i%2)*240; y=20+(i//2)*210
        s+=RECT(x,y,220,190,NAV,col)+T(x+110,y+55,a,col,22)+T(x+110,y+100,b,TX,16)+RECT(x+45,y+130,130,36,col,col,18).replace('fill="'+col+'"','fill="'+col+'" fill-opacity=".25"')+T(x+110,y+148,ag,col,16)
    s=s.replace(T(260+110,230+55,'Cukai',PK,22),T(260+110,230+42,'Cukai',PK,20)+T(260+110,230+68,'pelancongan',PK,20))
    return svg(s,'Cukai lain dan agensinya')
def alirfig():
    s=BG_()+T(250,30,'Langkah mengira cukai',TX,20)
    it=[('Pendapatan tahunan',TX),('− pelepasan',PU),('Pendapatan bercukai',TR),('kira ikut jadual',AM),('− rebat',PK),('Cukai perlu dibayar',GR)]
    for i,(t,col) in enumerate(it):
        y=58+i*63; s+=RECT(90,y,320,44,NAV,col)+T(250,y+22,t,col,18)
        if i<5: s+=ARW((250,y+46),(250,y+60))
    return svg(s,'Langkah mengira cukai pendapatan')
def c1fig():
    s=BG_()+T(250,34,'Pendapatan bercukai RM41 500',TX,20)
    w1=420*35000/41500
    s+=RECT(40,80,w1,60,TR,TR,8).replace('fill="'+TR+'"','fill="'+TR+'" fill-opacity=".3"')+T(40+w1/2,110,'35 000 pertama',TR,17)
    s+=RECT(40+w1,80,420-w1,60,AM,AM,8).replace('fill="'+AM+'"','fill="'+AM+'" fill-opacity=".3"')+T(40+w1+(420-w1)/2,110,'6 500',AM,16)
    s+=ARW((40+w1/2,146),(160,206))+ARW((40+w1+(420-w1)/2,146),(390,206))
    s+=RECT(60,212,200,70,NAV,TR)+T(160,236,'ikut jadual',MU,15)+T(160,262,'RM600',TR,22)
    s+=RECT(300,212,180,70,NAV,AM)+T(390,236,'8% × 6 500',MU,15)+T(390,262,'RM520',AM,22)
    s+=RECT(110,330,280,64,NAV,GR)+T(250,362,'Cukai = RM1 120',GR,22)
    return svg(s,'Pendapatan bercukai dipecah kepada 35000 pertama dan baki 6500')
def hbar0(*a):
    out=hbar(*a)
    return out.replace('</svg>',T(40,90+2*120+46,'RM0',GR,22,'start')+'</svg>')
S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})

# ===== 4.1.1 =====
c=GR
def piefig():
    s=BG_()+T(250,40,'Cukai → Hasil kerajaan → Rakyat',TX,20)
    items=[('Sekolah',TR,80,120),('Hospital',PK,250,120),('Jalan raya',AM,420,120),('Keselamatan',PU,80,330),('Subsidi',PA,250,330),('Kebajikan',GR,420,330)]
    s+=f'<circle cx="250" cy="225" r="58" fill="{NAV}" stroke="{AM}" stroke-width="5"/>'+T(250,225,'RM',AM,34)
    for t,col,x,y in items:
        s+=f'<line x1="250" y1="225" x2="{x}" y2="{y}" stroke="{DIM}" stroke-width="3"/>'+RECT(x-72,y-26,144,52,NAV,col)+T(x,y,t,col,17)
    s+=f'<circle cx="250" cy="225" r="58" fill="{NAV}" stroke="{AM}" stroke-width="5"/>'+T(250,225,'RM',AM,34)
    return svg(s,'Hasil cukai digunakan untuk sekolah, hospital, jalan raya dan kemudahan awam')
add('4.1.1','4.1 Percukaian','Apakah cukai?',
    DEF('<b>Cukai</b> ialah bayaran wajib yang dikenakan oleh kerajaan ke atas individu dan syarikat untuk membiayai perbelanjaan negara.',c)
    +BUL(['Cukai ialah <b>sumber utama hasil kerajaan</b>.','Membiayai pembangunan negara dan kemudahan awam.','Alat <b>kawalan ekonomi</b>: menggalakkan atau mengurangkan penggunaan sesuatu barang.','Membantu mengagihkan pendapatan dengan lebih adil.'],c),piefig())
def agfig():
    s=BG_()
    rows=[('LHDNM','Cukai pendapatan',TR),('JKDM','Cukai jualan & perkhidmatan',AM),('JPJ','Cukai jalan',PK),('PBT','Cukai pintu',PU),('Pejabat Tanah','Cukai tanah',GR)]
    for i,(a,t,col) in enumerate(rows):
        y=40+i*80
        s+=RECT(20,y,170,56,NAV,col)+T(105,y+28,a,col,18)+f'<line x1="196" y1="{y+28}" x2="250" y2="{y+28}" stroke="{DIM}" stroke-width="3"/>'+RECT(256,y,224,56,NAV,BD)+T(368,y+28,t,TX,16)
    return svg(s,'Agensi pemungut cukai')
add('4.1.1','4.1 Percukaian','Jenis cukai & agensi pemungut',
    TABLE(['Cukai','Dikenakan ke atas','Agensi'],[['Cukai pendapatan','Pendapatan individu / syarikat','LHDNM'],['Cukai jualan','Barang yang dikilangkan / diimport','JKDM'],['Cukai perkhidmatan','Perkhidmatan bercukai','JKDM'],['Cukai jalan','Kenderaan bermotor','JPJ'],['Cukai pintu','Rumah / bangunan','PBT'],['Cukai tanah','Pemilik tanah','Pejabat Tanah']],c),agfig())
add('4.1.1','4.1 Percukaian','Cukai lain yang perlu tahu',
    BUL(['<b>Cukai keuntungan harta tanah (CKHT)</b>: untung menjual harta tanah (LHDNM).','<b>Duti import / eksport</b>: barang masuk / keluar negara (JKDM).','<b>Duti setem</b>: dokumen perjanjian, contohnya jual beli rumah.','<b>Cukai pelancongan</b>: pelancong asing yang menginap di hotel.'],c)
    +NOTE('LHDNM = Lembaga Hasil Dalam Negeri Malaysia; JKDM = Jabatan Kastam Diraja Malaysia; JPJ = Jabatan Pengangkutan Jalan; PBT = Pihak Berkuasa Tempatan.'),lainfig())
add('4.1.1','Kesilapan biasa','Awas!',
    BUL(['<b>Salah:</b> cukai pintu dibayar kepada LHDNM. <b>Betul:</b> cukai pintu dibayar kepada PBT (majlis bandaraya / perbandaran / daerah).','<b>Salah:</b> cukai jalan dibayar kepada PBT. <b>Betul:</b> cukai jalan dibayar kepada JPJ.','Cukai tanah (Pejabat Tanah) berbeza dengan cukai pintu (PBT).','Lewat membayar cukai boleh dikenakan <b>penalti</b> atau tindakan undang-undang.'],RD)
    +NOTE('Membayar cukai ialah tanggungjawab setiap warganegara yang layak.','Ringkasan:'),'')

# ===== 4.1.3 =====
c=TR
def bandfig(ci=None):
    s=BG_()+T(250,30,'Kadar cukai berperingkat',TX,20)
    show=BANDS[:6]
    for i,(lo,hi,r,b) in enumerate(show):
        y=60+i*60; w=60+r*18
        s+=T(20,y+20,f'{lo//1000}k – {hi//1000}k',MU,16,'start')+RECT(150,y+2,w,36,[GR,TR,PU,AM,PA,PK][i],NAV,8)+T(150+w+10,y+20,f'{r}%',TX,18,'start')
    s+=T(250,425,'Setiap peringkat dikenakan kadarnya sendiri',MU,15)
    return svg(s,'Bar kadar cukai berperingkat')
add('4.1.3','4.1.3 Cukai Pendapatan','Pendapatan bercukai',
    DEF('<b>Pendapatan bercukai</b> = Jumlah pendapatan tahunan − Pengecualian cukai − <b>Pelepasan cukai</b>.',c)
    +BUL(['<b>Pelepasan cukai</b> ditolak daripada <b>pendapatan</b>, cth. individu RM9 000, KWSP, insurans.','<b>Rebat cukai</b> ditolak daripada <b>cukai</b>, cth. rebat individu RM400 (pendapatan bercukai ≤ RM35 000) dan zakat.','<b>Cukai pendapatan yang perlu dibayar</b> = Cukai dikira − Rebat.'],c),bandfig())
add('4.1.3','4.1.3 Cukai Pendapatan','Jadual kadar cukai (contoh buku teks)',
    TABLE(['Pendapatan bercukai (RM)','Pengiraan (RM)','Kadar','Cukai (RM)'],[['0 – 5 000','5 000 pertama','0%','0'],['5 001 – 20 000','5 000 pertama · 15 000 berikutnya','1%','0 · 150'],['20 001 – 35 000','20 000 pertama · 15 000 berikutnya','3%','150 · 450'],['35 001 – 50 000','35 000 pertama · 15 000 berikutnya','8%','600 · 1 200'],['50 001 – 70 000','50 000 pertama · 20 000 berikutnya','14%','1 800 · 2 800'],['70 001 – 100 000','70 000 pertama · 30 000 berikutnya','21%','4 600 · 6 300']],c)
    +NOTE('Kadar cukai berubah dari tahun ke tahun. Gunakan jadual yang diberikan dalam soalan.'),alirfig())
inc=60000; rel=9000+2500+4000+3000; ci=inc-rel
assert ci==41500 and tax(ci)==600+6500*0.08==1120
add('4.1.3','Contoh 1','Mengira cukai pendapatan',
    P('Pendapatan tahunan Encik Kamal ialah RM60 000. Pelepasan: individu RM9 000, gaya hidup RM2 500, KWSP RM4 000, insurans RM3 000. Hitung cukai pendapatannya.')
    +STEPS(['Jumlah pelepasan = 9 000 + 2 500 + 4 000 + 3 000 = RM18 500','Pendapatan bercukai = 60 000 − 18 500 = RM41 500','Cukai bagi RM35 000 pertama = RM600','Baki 41 500 − 35 000 = 6 500 × 8% = RM520','Jumlah cukai = 600 + 520 (tiada rebat RM400 kerana > RM35 000)'],c)+ANS('RM1 120'),c1fig())
inc=42000; rel=9000+3000+2000; ci=inc-rel; t=tax(ci)
assert ci==28000 and t==150+8000*0.03==390 and t-400<0
add('4.1.3','Contoh 2','Rebat cukai',
    P('Pendapatan bercukai Puan Lina ialah RM28 000. Dia layak rebat individu RM400. Berapakah cukai yang perlu dibayar?')
    +STEPS(['Cukai bagi RM20 000 pertama = RM150','Baki 28 000 − 20 000 = 8 000 × 3% = RM240','Cukai dikira = 150 + 240 = RM390','Rebat RM400 > RM390, maka cukai menjadi 0'],c)+ANS('RM0 (tiada cukai perlu dibayar)')
    +NOTE('Rebat ditolak daripada cukai. Jika rebat melebihi cukai, cukai yang perlu dibayar ialah RM0.'),hbar0('Cukai dikira vs rebat',[('Cukai dikira',[(390,'RM390',TR)]),('Rebat individu',[(400,'RM400',PK)]),('Cukai perlu dibayar',[(0,'',GR)])],'Rebat lebih besar → cukai RM0','Rebat melebihi cukai yang dikira'))
add('4.1.3','Kesilapan biasa','Awas!',
    BUL(['<b>Salah:</b> darab seluruh pendapatan bercukai dengan satu kadar (41 500 × 8%). <b>Betul:</b> kira ikut peringkat.','<b>Salah:</b> tolak rebat daripada pendapatan. <b>Betul:</b> rebat ditolak daripada <b>cukai</b>.','<b>Salah:</b> tolak pelepasan daripada cukai. <b>Betul:</b> pelepasan ditolak daripada <b>pendapatan</b>.'],RD)
    +NOTE('Pendapatan → tolak pelepasan → pendapatan bercukai → kira cukai ikut jadual → tolak rebat.','Ringkasan:'),'')

# ===== 4.1.4 =====
c=AM
# cukai jalan Semenanjung, kereta persendirian individu
def jalan(cc):
    if cc<=1000: return 20
    if cc<=1200: return 55
    if cc<=1400: return 70
    if cc<=1600: return 90
    if cc<=1800: return 200+(cc-1600)*0.40
    if cc<=2000: return 280+(cc-1800)*0.50
    if cc<=2500: return 380+(cc-2000)*1.00
    if cc<=3000: return 880+(cc-2500)*2.50
    return 2130+(cc-3000)*4.50
assert jalan(1798)==279.2 and jalan(1998)==379.0 and jalan(2500)==880 and jalan(3000)==2130
add('4.1.4','4.1.4 Cukai Jalan','Cukai jalan',
    DEF('<b>Cukai jalan</b> dikenakan ke atas kenderaan bermotor dan dibayar kepada <b>JPJ</b>. Kadarnya bergantung pada <b>kapasiti enjin (cc)</b>, jenis kenderaan dan wilayah.',c)
    +TABLE(['Kapasiti enjin (cc)','Kadar asas','Kadar progresif'],[['≤ 1 000','RM20','–'],['1 001 – 1 200','RM55','–'],['1 201 – 1 400','RM70','–'],['1 401 – 1 600','RM90','–'],['1 601 – 1 800','RM200','+ RM0.40 setiap cc > 1 600'],['1 801 – 2 000','RM280','+ RM0.50 setiap cc > 1 800'],['2 001 – 2 500','RM380','+ RM1.00 setiap cc > 2 000']],c)
    +NOTE('Kereta persendirian milik individu, Semenanjung Malaysia.','Jadual:'),'')
def ccfig():
    s=BG_()+T(250,34,'Kereta 1 798 cc',TX,20)
    X=lambda v:60+(v-1600)/200*380
    s+=f'<line x1="40" y1="170" x2="460" y2="170" stroke="{MU}" stroke-width="4"/>'
    for v in (1600,1700,1800): s+=f'<line x1="{X(v)}" y1="158" x2="{X(v)}" y2="182" stroke="{MU}" stroke-width="3"/>'+T(X(v),205,f'{v//1000}\u00a0{v%1000:03d}',MU,16)
    s+=RECT(X(1600),130,X(1798)-X(1600),26,AM,AM,6).replace('fill="'+AM+'"','fill="'+AM+'" fill-opacity=".4"')+T((X(1600)+X(1798))/2,108,'lebihan 198 cc',AM,18)
    s+=f'<circle cx="{X(1798):.1f}" cy="170" r="9" fill="{PK}"/>'+T(X(1798),238,'1\u00a0798',PK,17)
    s+=RECT(40,280,190,90,NAV,TR)+T(135,308,'Kadar asas',MU,15)+T(135,342,'RM200',TR,24)+T(250,325,'+',TX,30)
    s+=RECT(270,280,190,90,NAV,AM)+T(365,308,'198 × RM0.40',MU,15)+T(365,342,'RM79.20',AM,24)
    return svg(s+T(250,410,'Cukai jalan = RM279.20',GR,20),'Lebihan kapasiti enjin melebihi 1600 cc')
add('4.1.4','Contoh 1','Mengira cukai jalan',
    P('Kapasiti enjin kereta Encik Hafiz ialah 1 798 cc (Semenanjung). Hitung cukai jalan setahun.')
    +STEPS(['1 798 cc berada dalam julat 1 601 – 1 800 cc','Kadar asas = RM200','Lebihan = 1 798 − 1 600 = 198 cc × RM0.40 = RM79.20','Cukai jalan = 200 + 79.20'],c)+ANS('RM279.20'),ccfig())
nt=24000; kp=0.06*nt; assert kp==1440 and kp/2==720
lu=450; kt=0.35*lu; assert round(kt,2)==157.5
def housefig():
    s=BG_()+f'<path d="M110 200 L250 90 L390 200 Z" fill="{NAV}" stroke="{PU}" stroke-width="5" stroke-linejoin="round"/>'+RECT(140,200,220,150,NAV,PU,4)+RECT(225,270,50,80,PU,PU,4)
    s+=f'<rect x="40" y="350" width="420" height="50" rx="8" fill="{NAV}" stroke="{GR}" stroke-width="4"/>'+T(250,375,'Tanah → cukai tanah (Pejabat Tanah)',GR,16)+T(250,60,'Bangunan → cukai pintu (PBT)',PU,17)
    return svg(s,'Rumah dan tanah')
add('4.1.4','Contoh 2','Cukai pintu & cukai tanah',
    BUL(['<b>Cukai pintu</b> = Nilai tahunan × Kadar (%). Biasanya dibayar <b>dua kali setahun</b>.','<b>Cukai tanah</b> = Luas tanah × Kadar per unit luas. Dibayar setahun sekali.'],c)
    +STEPS(['Nilai tahunan RM24 000, kadar 6%: cukai pintu = 24 000 × 6% = RM1 440 setahun (RM720 setiap setengah tahun)','Luas tanah 450 m², kadar RM0.35 per m²: cukai tanah = 450 × 0.35 = RM157.50'],c)+ANS('Cukai pintu RM1 440; cukai tanah RM157.50'),housefig())
p=120.0; st=round(p*0.10,2); assert st==12.0
b=80.0; sv=round(b*0.06,2); assert sv==4.8 and b+sv==84.8
add('4.1.4','Contoh 3','Cukai jualan & perkhidmatan (SST)',
    BUL(['<b>Cukai jualan</b>: dikenakan ke atas barang, kadar 5% atau 10% (ada barang dikecualikan).','<b>Cukai perkhidmatan</b>: dikenakan ke atas perkhidmatan bercukai seperti restoran, hotel dan telekomunikasi.','Cukai = Harga × Kadar; Jumlah bayaran = Harga + Cukai.'],c)
    +STEPS(['Kasut RM120, cukai jualan 10%: 120 × 10% = RM12 → bayar RM132','Bil restoran RM80, cukai perkhidmatan 6%: 80 × 6% = RM4.80 → bayar RM84.80'],c)+ANS('RM132 dan RM84.80')
    +NOTE('Kadar cukai mungkin berubah ikut belanjawan. Gunakan kadar yang diberikan dalam soalan.'),hbar('Harga + cukai = jumlah bayaran',[('Kasut (cukai jualan 10%)',[(120,'RM120',TR),(12,'',AM)]),('Bil restoran (cukai perkhidmatan 6%)',[(80,'RM80',PU),(4.8,'',AM)])],'Hujung bar = cukai: RM12 dan RM4.80','Harga dan cukai jualan serta cukai perkhidmatan'))
add('4.1.4','Ringkasan','Awas & ringkasan',
    BUL(['<b>Salah:</b> 1 798 × RM0.40. <b>Betul:</b> hanya lebihan cc melebihi 1 600 didarab, kemudian tambah kadar asas.','Cukai pintu setahun ≠ bayaran setengah tahun (bahagi 2).','Cukai jualan dikira daripada harga barang, bukan daripada jumlah selepas cukai.'],RD)
    +TABLE(['Cukai','Rumus','Agensi'],[['Jalan','Kadar asas + lebihan cc × kadar','JPJ'],['Pintu','Nilai tahunan × kadar','PBT'],['Tanah','Luas × kadar','Pejabat Tanah'],['SST','Harga × kadar','JKDM']],c),'')

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
assert counts=={'4.1.1':4,'4.1.3':5,'4.1.4':5},counts
open(OUT,'w').write('/* Dijana oleh tools/percukaian/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
print(len(out),'slaid ->',OUT)
