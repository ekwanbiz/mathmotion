# Penjana slaid NOTA INSURANS (Tingkatan 5 Bab 3) -> insurans/slides.js
# Jalankan:  python3 tools/insurans/gen_slides.py
import json, os, re, html
from fractions import Fraction as F
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'insurans', 'slides.js'))
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
RDc,GRc,TRc=C['rd'],C['gr'],C['tr']
SUB={'3.1.1':('Risiko dan Jenis Insurans',C['pk']),'3.1.2':('Kadar dan Premium Insurans',C['tr']),'3.1.3':('Deduktibel dan Ko-insurans',C['gr'])}
S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})
def BOX(x,y,w,h,col,op=.2): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" fill="{col}" fill-opacity="{op}" stroke="{col}" stroke-width="3"/>'
def frame(): return f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
def money(v):
    s=f'{v:,.2f}'.replace(',',' ')
    return 'RM'+(s[:-3] if s.endswith('.00') else s)
def stack(title,segs,total_label):
    # segs: [(nilai, label, warna)] bar mendatar bertindan
    tot=sum(v for v,_,_ in segs); x=40; s=frame()+T(250,40,title,TX,21)
    for v,lab,col in segs:
        w=420*v/tot; s+=f'<rect x="{x:.1f}" y="120" width="{w:.1f}" height="90" rx="8" fill="{col}" fill-opacity=".35" stroke="{col}" stroke-width="3"/>'
        s+=T(x+w/2,165,money(v),col,18) if w>70 else ''
        x+=w
    y=260
    for v,lab,col in segs:
        s+=f'<rect x="60" y="{y-11}" width="22" height="22" rx="5" fill="{col}"/>'+T(94,y,f'{lab}: {money(v)}',TX,18,'start'); y+=40
    return svg(s+T(250,410,total_label,MU,17),title)

def ARW(p,q,col=MU,sw=4):
    import math
    a=math.atan2(q[1]-p[1],q[0]-p[0]); h=12
    l=(q[0]-h*math.cos(a-0.45),q[1]-h*math.sin(a-0.45)); r=(q[0]-h*math.cos(a+0.45),q[1]-h*math.sin(a+0.45))
    return LINE(p,q,col,sw)+f'<path d="M{l[0]:.1f} {l[1]:.1f} L{q[0]:.1f} {q[1]:.1f} L{r[0]:.1f} {r[1]:.1f}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def flow(title,items,label):
    # items: [(teks, warna)] kotak menegak dengan anak panah
    n=len(items); top=70; gap=(H-top-20)/n; s=frame()+T(250,36,title,TX,20)
    for i,(t,col) in enumerate(items):
        y=top+i*gap; s+=BOX(70,y,360,gap-30,col)+T(250,y+(gap-30)/2,t,TX,18)
        if i<n-1: s+=ARW((250,y+gap-28),(250,y+gap-4))
    return svg(s,label)
def flowh(title,items,ops,label):
    # aliran mendatar 3 kotak dengan operasi di antara
    s=frame()+T(250,40,title,TX,20)
    xs=[20,180,340]
    for i,(a,b,col) in enumerate(items):
        x=xs[i]; s+=BOX(x,170,140,110,col)+T(x+70,210,a,col,20)+T(x+70,245,b,MU,15)
    for i,o in enumerate(ops):
        x=xs[i]+140; s+=ARW((x+2,225),(x+38,225))+T(x+20,305,o,AM,17)
    return svg(s,label)

# ===== 3.1.1 Risiko dan Jenis Insurans =====
c=C['pk']
s=frame()+BOX(30,150,150,120,c)+T(105,195,'Pemegang',TX,19)+T(105,222,'polisi',TX,19)+BOX(320,150,150,120,GRc)+T(395,195,'Syarikat',TX,19)+T(395,222,'insurans',TX,19)
s+=LINE((185,180),(312,180),AM,4)+T(250,160,'premium',AM,18)+LINE((312,245),(185,245),GRc,4)+T(250,272,'pampasan',GRc,18)
s+=f'<path d="M300 172 L314 180 L300 188" fill="none" stroke="{AM}" stroke-width="4"/><path d="M199 237 L185 245 L199 253" fill="none" stroke="{GRc}" stroke-width="4"/>'
s+=T(250,70,'Risiko dipindahkan',RDc,22)+T(250,100,'kepada syarikat insurans',MU,18)+T(250,350,'Polisi = kontrak antara kedua-dua pihak',MU,17)
add('3.1.1','3.1 Risiko dan Perlindungan Insurans','Apakah risiko dan insurans?',
    DEF('<b>Risiko</b> ialah peluang berlakunya kerugian. <b>Insurans</b> memindahkan risiko kerugian daripada individu kepada syarikat insurans.',c)
    +BUL(['<b>Pemegang polisi</b> membayar <b>premium</b> kepada <b>syarikat insurans</b> (penanggung insurans).','<b>Polisi</b> ialah kontrak bertulis antara pemegang polisi dengan syarikat insurans.','Apabila berlaku kerugian, pemegang polisi membuat <b>tuntutan</b> dan menerima <b>pampasan</b>.'],c),svg(s,'Aliran premium dan pampasan'))
add('3.1.1','3.1 Istilah penting','Istilah dalam insurans',
    TABLE(['Istilah','Maksud'],[['Premium','Bayaran pemegang polisi kepada syarikat insurans'],['Nilai muka','Jumlah perlindungan yang dinyatakan dalam polisi'],['Tuntutan','Permohonan rasmi untuk mendapat pampasan'],['Pampasan','Bayaran syarikat insurans kepada pemegang polisi'],['Benefisiari','Orang yang menerima bayaran insurans hayat']],c),
    flow('Aliran sesuatu tuntutan',[('Bayar premium',AM),('Berlaku kerugian',RDc),('Buat tuntutan',c),('Terima pampasan',GRc)],'Aliran premium, kerugian, tuntutan dan pampasan'))
s=frame()+BOX(25,70,210,320,TRc)+T(130,105,'Insurans hayat',TRc,21)+BOX(265,70,210,320,AM)+T(370,105,'Insurans am',AM,21)
for i,t in enumerate(['Hayat sementara','Seumur hidup','Endowmen','Berkaitan pelaburan']): s+=T(130,160+i*52,t,TX,17)
for i,t in enumerate(['Motor','Kebakaran','Perubatan & kesihatan','Kemalangan diri','Perjalanan']): s+=T(370,155+i*46,t,TX,17)
add('3.1.1','3.1 Jenis insurans','Insurans hayat dan insurans am',
    BUL(['<b>Insurans hayat</b>: perlindungan jika meninggal dunia atau hilang upaya; bayaran kepada benefisiari.','<b>Insurans am</b>: melindungi harta, kesihatan dan liabiliti.','Insurans motor <b>pihak ketiga</b> wajib bagi setiap kenderaan.'],c),svg(s,'Jenis insurans hayat dan insurans am'))
def motorfig():
    s=frame()+T(250,34,'Apa yang dilindungi?',TX,20)
    cols=[('Pihak','ketiga'),('PK, kebakaran','& kecurian'),('Kompre-','hensif')]
    rows=['Pihak ketiga','Kebakaran / kecurian','Kemalangan kereta sendiri']
    ok=[[1,0,0],[1,1,0],[1,1,1]]
    for j,(a,b) in enumerate(cols):
        x=235+j*95; s+=T(x,78,a,c,14)+T(x,98,b,c,14)
    for i,r in enumerate(rows):
        y=150+i*95; s+=f'<rect x="20" y="{y-38}" width="460" height="76" rx="12" fill="{NAV}" stroke="{BD}" stroke-width="2"/>'
        words=r.split(' ',1) if len(r)>16 else [r]
        for k,w in enumerate(words): s+=T(105,y+(k-(len(words)-1)/2)*22,w,TX,16)
        for j in range(3):
            x=235+j*95; s+=T(x,y,'✓' if ok[j][i] else '✗',GRc if ok[j][i] else RDc,30)
    return svg(s,'Perlindungan tiga jenis polisi motor')
add('3.1.1','3.1 Insurans motor','Tiga jenis polisi motor',
    TABLE(['Polisi','Perlindungan'],[['Pihak ketiga','Kerosakan/kecederaan kepada pihak ketiga sahaja'],['Pihak ketiga, kebakaran dan kecurian','Pihak ketiga + kenderaan sendiri jika terbakar atau dicuri'],['Komprehensif','Semua di atas + kerosakan kenderaan sendiri akibat kemalangan']],c)
    +NOTE('Pihak pertama = pemegang polisi, pihak kedua = syarikat insurans, pihak ketiga = orang lain yang terlibat.'),motorfig())
add('3.1.1','Kesilapan biasa','Awas!',
    BUL(['<b>Salah:</b> premium ialah bayaran syarikat kepada pemegang polisi. <b>Betul:</b> premium dibayar <b>oleh</b> pemegang polisi.','Polisi pihak ketiga <b>tidak</b> membayar kerosakan kenderaan sendiri.','Insurans perjalanan, kebakaran dan perubatan ialah insurans <b>am</b>, bukan insurans hayat.'],RDc)
    +NOTE('Insurans tidak menghapuskan risiko; ia memindahkan kerugian kewangan kepada syarikat insurans.','Ringkasan:'),'')

# ===== 3.1.2 Kadar dan Premium =====
c=TRc
nm,kadar=150000,2.15; pr=nm/1000*kadar; assert abs(pr-322.5)<1e-9
add('3.1.2','3.1 Premium insurans hayat','Kadar premium per RM1 000',
    DEF('Premium insurans hayat dikira menggunakan <b>kadar premium per RM1 000 nilai muka</b>:<br><b>Premium = (nilai muka ÷ RM1 000) × kadar premium</b>',c)
    +BUL(['Kadar premium bergantung pada <b>umur</b>, <b>jantina</b>, <b>tabiat merokok</b> dan <b>tahap kesihatan</b>.','Risiko lebih tinggi → kadar premium lebih tinggi.'],c),
    stack('Contoh: nilai muka RM150 000',[(150000,'Nilai muka',TRc)],'150 unit RM1 000 × RM2.15 = RM322.50'))
add('3.1.2','Contoh 1','Premium insurans hayat',
    P('Encik Ali, 30 tahun, bukan perokok, mahu membeli polisi hayat bernilai muka RM150 000. Kadar premium tahunan ialah RM2.15 per RM1 000. Hitung premium tahunannya.')
    +STEPS(['Bilangan unit RM1 000 = 150 000 ÷ 1 000 = 150','Premium = 150 × RM2.15','= RM322.50 setahun'],c)+ANS('RM322.50 setahun'),
    flowh('Nilai muka → unit → premium',[('RM150 000','nilai muka',c),('150','unit RM1 000',PU),('RM322.50','setahun',GRc)],['÷ 1 000','× RM2.15'],'Nilai muka dibahagi 1000 kemudian didarab kadar'))
b=273.80+49*26; assert abs(b-1547.80)<1e-9; ncd=b*0.25; assert abs(ncd-386.95)<1e-9; assert abs(b-ncd-1160.85)<1e-9
def ncdfig():
    s=frame()+T(250,34,'NCD ikut tahun tanpa tuntutan',TX,20)
    v=[(1,'25%',25),(2,'30%',30),(3,'38.33%',38.33),(4,'45%',45),('5+','55%',55)]
    s+=LINE((50,370),(470,370),MU,3)
    for i,(t,lab,p) in enumerate(v):
        x=70+i*82; h=p*5
        s+=f'<rect x="{x}" y="{370-h:.1f}" width="56" height="{h:.1f}" rx="6" fill="{AM}" fill-opacity=".35" stroke="{AM}" stroke-width="3"/>'+T(x+28,370-h-18,lab,AM,16)+T(x+28,395,str(t),TX,17)
    return svg(s+T(250,424,'tahun berturut-turut tanpa tuntutan',MU,15),'Kadar NCD meningkat setiap tahun tanpa tuntutan')
add('3.1.2','3.1 Premium insurans motor','Polisi komprehensif',
    P('Contoh jadual tarif (Semenanjung, kereta hingga 1 400 cc):')
    +TABLE(['Perkara','Kadar'],[['RM1 000 pertama','RM273.80'],['Setiap RM1 000 berikutnya','RM26.00'],['Pihak ketiga, kebakaran & kecurian','75% premium komprehensif'],['Diskaun tanpa tuntutan (NCD)','25%, 30%, 38.33%, 45%, 55%']],c)
    +NOTE('NCD ialah diskaun kepada pemegang polisi yang tidak membuat tuntutan pada tahun sebelumnya.'),ncdfig())
add('3.1.2','Contoh 2','Premium polisi komprehensif',
    P('Kereta 1 300 cc di Semenanjung diinsuranskan RM50 000 dengan polisi komprehensif. NCD ialah 25%. Hitung premium yang perlu dibayar.')
    +STEPS(['RM1 000 pertama: RM273.80','Baki RM49 000: 49 × RM26 = RM1 274.00','Premium asas = 273.80 + 1 274 = RM1 547.80','NCD 25% = 0.25 × 1 547.80 = RM386.95','Premium = 1 547.80 − 386.95'],c)+ANS('RM1 160.85'),
    stack('Premium asas RM1 547.80',[(1160.85,'Dibayar',TRc),(386.95,'NCD 25%',AM)],'NCD menolak sebahagian premium asas'))
add('3.1.2','Kesilapan biasa','Awas!',
    BUL(['Bahagikan nilai muka dengan <b>1 000</b> dahulu, kemudian darab dengan kadar.','Untuk polisi motor, RM1 000 <b>pertama</b> dikira berasingan: baki = nilai − 1 000.','NCD ditolak daripada premium <b>asas</b>, bukan ditambah.'],RDc)
    +NOTE('Premium hayat = (nilai muka ÷ 1 000) × kadar · Premium motor = premium asas − NCD','Ringkasan:'),'')

# ===== 3.1.3 Deduktibel dan Ko-insurans =====
c=GRc
add('3.1.3','3.1 Deduktibel','Apakah deduktibel?',
    DEF('<b>Deduktibel</b> ialah jumlah kerugian yang perlu ditanggung sendiri oleh pemegang polisi sebelum syarikat insurans membayar pampasan.',c)
    +BUL(['Pampasan = kerugian − deduktibel','Jika kerugian ≤ deduktibel, syarikat <b>tidak</b> membayar apa-apa.','Contoh: kerugian RM3 500, deduktibel RM500 → pampasan RM3 000.'],c),
    stack('Kerugian RM3 500',[(500,'Deduktibel (pemegang polisi)',RDc),(3000,'Pampasan (syarikat)',GRc)],'Pampasan = 3 500 − 500 = RM3 000'))
req=0.8*400000; assert req==320000; pay=240000/req*40000-2000; assert pay==28000
def kofig():
    s=frame()+T(250,34,'Rumah bernilai RM400 000',TX,20)
    bars=[(400000,'Nilai boleh diinsuranskan',MU),(320000,'Perlu dibeli (80%)',AM),(240000,'Dibeli',RDc)]
    for i,(v,lab,col) in enumerate(bars):
        y=80+i*95; w=420*v/400000
        s+=T(40,y,lab,TX,16,'start')+f'<rect x="40" y="{y+16}" width="{w:.1f}" height="44" rx="8" fill="{col}" fill-opacity=".3" stroke="{col}" stroke-width="3"/>'+T(40+w-10,y+38,money(v),col,17,'end')
    s+=LINE((40+420*0.8,180),(40+420*0.8,350),AM,2,'6 5')
    return svg(s+T(250,385,'Dibeli < perlu dibeli',RDc,18)+T(250,414,'→ pampasan dikurangkan',MU,16),'Bandingan nilai rumah, insurans perlu dibeli dan dibeli')
add('3.1.3','3.1 Ko-insurans harta','Fasal ko-insurans',
    DEF('Polisi harta biasanya mensyaratkan pemegang polisi menginsuranskan sekurang-kurangnya <b>peratus ko-insurans</b> (cth. 80%) daripada nilai boleh diinsuranskan.',c)
    +BUL(['Jumlah insurans yang perlu dibeli = peratus ko-insurans × nilai boleh diinsuranskan.','Jika cukup: pampasan = kerugian − deduktibel.','Jika kurang: <b>pampasan = (jumlah insurans dibeli ÷ jumlah insurans perlu dibeli) × kerugian − deduktibel</b>'],c),kofig())
add('3.1.3','Contoh 1','Ko-insurans harta',
    P('Rumah bernilai boleh diinsuranskan RM400 000. Polisi: ko-insurans 80%, deduktibel RM2 000. Rumah diinsuranskan RM240 000. Berlaku kebakaran dengan kerugian RM40 000. Hitung pampasan.')
    +STEPS(['Perlu dibeli = 80% × 400 000 = RM320 000','RM240 000 < RM320 000 → insurans tidak mencukupi','Pampasan = (240 000 ÷ 320 000) × 40 000 − 2 000','= 30 000 − 2 000'],c)+ANS('RM28 000'),
    stack('Kerugian RM40 000',[(28000,'Pampasan',GRc),(12000,'Ditanggung pemilik',RDc)],'Pemilik menanggung 40 000 − 28 000 = RM12 000'))
med=0.8*(20500-500); assert med==16000
add('3.1.3','Contoh 2','Ko-insurans perubatan',
    P('Polisi perubatan Puan Lim: deduktibel RM500 dan ko-insurans 80/20. Kos rawatan ialah RM20 500. Berapakah bayaran syarikat insurans dan kos yang ditanggung Puan Lim?')
    +STEPS(['Selepas deduktibel: 20 500 − 500 = RM20 000','Syarikat bayar 80% × 20 000 = RM16 000','Puan Lim: 500 + 20% × 20 000 = 500 + 4 000'],c)+ANS('Syarikat RM16 000; Puan Lim RM4 500'),
    stack('Kos rawatan RM20 500',[(500,'Deduktibel',RDc),(4000,'20% Puan Lim',AM),(16000,'80% syarikat',GRc)],'Puan Lim tanggung RM4 500'))
add('3.1.3','Kesilapan biasa','Awas!',
    BUL(['Bandingkan dengan jumlah insurans yang <b>perlu dibeli</b> (80% × nilai), bukan dengan nilai harta.','Tolak deduktibel <b>selepas</b> mendarab nisbah ko-insurans.','Dalam ko-insurans perubatan, peratus dikira daripada kos <b>selepas</b> deduktibel.'],RDc)
    +NOTE('Pampasan maksimum tidak melebihi jumlah insurans yang dibeli.','Ringkasan:'),'')

counts={}
for s in S: counts[s['sub']]=counts.get(s['sub'],0)+1
idx={}; out=[]
for s in S:
    idx[s['sub']]=idx.get(s['sub'],0)+1
    nb=lambda t: re.sub(r'(\d) (?=\d{3}\b)', '\\1\u00a0', t)  # ruang tak putus dalam nombor (RM240 000)
    assert '<svg' not in s['body']
    out.append({'sub':s['sub'],'n':idx[s['sub']],'N':counts[s['sub']],'kicker':s['kicker'],'title':nb(s['title']),'body':nb(s['body']),'fig':s['fig'],'full':''})
subs=[{'no':k,'name':v[0],'col':v[1]} for k,v in SUB.items()]
body=json.dumps(out,ensure_ascii=False)
ALLOWED={x.lower() for x in [BG,SURF,NAV,BD,TX,MU,GRID,DIM]+list(C.values())}
bad={h for h in re.findall(r'#[0-9a-fA-F]{6}',body) if h.lower() not in ALLOWED}
assert not bad,bad
assert 'NaN' not in body and 'None' not in body
assert counts=={'3.1.1':5,'3.1.2':5,'3.1.3':5},counts
open(OUT,'w').write('/* Dijana oleh tools/insurans/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
print(len(out),'slaid ->',OUT)
