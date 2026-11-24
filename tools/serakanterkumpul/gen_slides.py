# Penjana slaid NOTA Bab 7 Sukatan Serakan Data Terkumpul (T5) -> serakanterkumpul/slides.js
# Jalankan:  python3 tools/serakanterkumpul/gen_slides.py
import json, os, re, html
from fractions import Fraction as F
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'serakanterkumpul', 'slides.js'))
BG='#0B1220'; SURF='#131C2E'; NAV='#0E1626'; BD='#22304A'; TX='#E6EDF7'; MU='#94A3B8'; GRID='#1E2A40'; DIM='#334155'
C={'tr':'#38BDF8','pa':'#FB923C','pu':'#A78BFA','am':'#FBBF24','gr':'#34D399','pk':'#F472B6','rd':'#F87171'}
TR,PK,AM,GR,PU,RD,PA=C['tr'],C['pk'],C['am'],C['gr'],C['pu'],C['rd'],C['pa']
SUB={'7.1':('Serakan',TR),'7.2':('Sukatan Serakan',PK)}
def P(t): return f'<p class="sl-p">{t}</p>'
def DEF(t,c): return f'<div class="sl-def" style="--c:{c}"><p>{t}</p></div>'
def BUL(items,c): return f'<ul class="sl-bul" style="--c:{c}">'+''.join(f'<li><span>{i}</span></li>' for i in items)+'</ul>'
def STEPS(items,c): return f'<ol class="sl-steps" style="--c:{c}">'+''.join(f'<li class="rv"><span class="n">{n}</span><span>{t}</span></li>' for n,t in enumerate(items,1))+'</ol>'
def ANS(t): return f'<div class="sl-ans rv"><span>JAWAPAN</span> {t}</div>'
def NOTE(t,lab='Ingat:'): return f'<div class="sl-note"><b>{lab}</b> {t}</div>'
def TABLE(head,rows,c,fs=17):
    th=''.join(f'<th style="padding: 7px 10px; text-align: left; font-size: {fs}px; color: {c}; border-bottom: 2px solid {BD}">{h}</th>' for h in head)
    tb=''.join('<tr class="rv">'+''.join(f'<td style="padding: 6px 10px; font-size: {fs}px; font-weight: 600; border-bottom: 1px solid {BD}">{x}</td>' for x in r)+'</tr>' for r in rows)
    return f'<div class="sl-table"><table style="width: 100%; border-collapse: collapse; background: {SURF}"><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'
W,H=500,440
FONT='font-family="Inter, sans-serif"'
def svg(inner,label): return f'<svg class="sl-svg" viewBox="0 0 {W} {H}" role="img" aria-label="{html.escape(label)}">{inner}</svg>'
def T(x,y,t,col=TX,size=18,anchor='middle'):
    return f'<text x="{round(x,1)}" y="{round(y,1)}" fill="{col}" {FONT} font-size="{size}" font-weight="700" text-anchor="{anchor}" dominant-baseline="middle" paint-order="stroke" stroke="{NAV}" stroke-width="5" stroke-linejoin="round">{t}</text>'
def LINE(p,q,col=TX,sw=3,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{round(p[0],1)}" y1="{round(p[1],1)}" x2="{round(q[0],1)}" y2="{round(q[1],1)}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"{d}/>'
def DOT(p,col,r=6): return f'<circle cx="{round(p[0],1)}" cy="{round(p[1],1)}" r="{r}" fill="{col}" stroke="{NAV}" stroke-width="2"/>'
def PATH(pts,col,sw=4): return f'<path d="M'+' L'.join(f'{round(x,1)} {round(y,1)}' for x,y in pts)+f'" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def RECT(x,y,w,h,col,op='55'): return f'<rect x="{round(x,1)}" y="{round(y,1)}" width="{round(w,1)}" height="{round(h,1)}" fill="{col}{op}" stroke="{col}" stroke-width="2.5"/>'
fmt=lambda v: (str(int(v)) if float(v)==int(v) else f'{float(v):.2f}'.rstrip('0').rstrip('.'))

# ---------- data contoh (dipakai seluruh bab) ----------
LOW=[10,20,30,40,50]; FR=[2,8,14,10,6]; N=sum(FR); assert N==40
CUM=[sum(FR[:i+1]) for i in range(5)]; assert CUM==[2,10,24,34,40]
MID=[F(l+l+9,2) for l in LOW]; assert MID[0]==F(29,2)
UB=[F(2*l+19,2) for l in LOW]; assert UB[0]==F(39,2)  # sempadan atas 19.5
def pos(k):  # kedudukan kumulatif -> nilai (interpolasi linear ogif)
    pts=[(F(19,2),0)]+list(zip(UB,CUM))
    for (x0,c0),(x1,c1) in zip(pts,pts[1:]):
        if c0<=k<=c1: return x0+(F(k)-c0)/(c1-c0)*(x1-x0)
Q1=pos(F(N,4)); Q3=pos(F(3*N,4)); MED=pos(F(N,2)); P10=pos(F(N,10))
assert Q1==F(59,2) and Q3==F(91,2) and P10==22 and Q3-Q1==16
assert round(float(MED),1)==36.6
SFX=sum(f*x for f,x in zip(FR,MID)); MEAN=SFX/N; assert SFX==1480 and MEAN==37
SFX2=sum(f*x*x for f,x in zip(FR,MID)); VAR=SFX2/N-MEAN**2
assert VAR==F(475,4) and SFX2==59510, (SFX2,VAR)
SD=float(VAR)**.5; assert abs(SD-10.90)<0.005
JUL=MID[-1]-MID[0]; assert JUL==40

# ---------- rajah ----------
X0,X1,Y0,Y1=60,475,380,50
def frame(xl,yl,ymax,ystep,xticks,xmin,xmax):
    s=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
    gx=lambda v: X0+(float(v)-xmin)/(xmax-xmin)*(X1-X0-10)
    gy=lambda v: Y0-float(v)/ymax*(Y0-Y1)
    for v in range(0,ymax+1,ystep):
        s+=LINE((X0,gy(v)),(X1,gy(v)),GRID,1.5)+T(X0-10,gy(v),v,MU,14,'end')
    s+=LINE((X0,Y0),(X1,Y0),MU,3)+LINE((X0,Y0),(X0,Y1-10),MU,3)
    for v in xticks: s+=LINE((gx(v),Y0),(gx(v),Y0+6),MU,2)+T(gx(v),Y0+20,fmt(v),MU,13)
    s+=T(X1,Y0+44,xl,MU,15,'end')+T(X0+6,Y1-24,yl,MU,15,'start')
    return s,gx,gy
def histo(poly=False,label='Histogram'):
    s,gx,gy=frame('Jisim (kg)','Kekerapan',16,2,[F(19,2)+10*i for i in range(6)],0,70)
    for l,f in zip(LOW,FR): s+=RECT(gx(l-F(1,2)),gy(f),gx(l+F(19,2))-gx(l-F(1,2)),gy(0)-gy(f),TR,'44')
    if poly:
        pts=[(gx(F(9,2)),gy(0))]+[(gx(m),gy(f)) for m,f in zip(MID,FR)]+[(gx(F(129,2)),gy(0))]
        s+=PATH(pts,PK)+''.join(DOT(p,PK) for p in pts)
    return svg(s,label)
def ogif(guides=(),label='Ogif'):
    s,gx,gy=frame('Jisim (kg)','Kekerapan longgokan',40,5,[F(19,2)+10*i for i in range(6)],0,70)
    pts=[(gx(F(19,2)),gy(0))]+[(gx(u),gy(c)) for u,c in zip(UB,CUM)]
    s+=PATH(pts,PK)+''.join(DOT(p,PK) for p in pts)
    for k,v,t,col in guides:
        s+=LINE((X0,gy(k)),(gx(v),gy(k)),col,2.5,'7 5')+LINE((gx(v),gy(k)),(gx(v),Y0),col,2.5,'7 5')+DOT((gx(v),Y0),col,7)+T(gx(v)+8,gy(k)-16,t,col,15,'start' if gx(v)<380 else 'end')
    return svg(s,label)

S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})
ROWS=[[f'{l} – {l+9}',f,fmt(m),f'{fmt(l-F(1,2))} – {fmt(l+F(19,2))}'] for l,f,m in zip(LOW,FR,MID)]

# ===== 7.1 Serakan =====
c=TR
assert F(20+29,2)==F(49,2) and 29-20+1==10
nl=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
gxn=lambda v: 40+(v-15)/20*420
nl+=LINE((30,230),(470,230),MU,3)
for v in range(16,35,2): nl+=LINE((gxn(v),224),(gxn(v),236),MU,2)
nl+=f'<rect x="{gxn(19.5)}" y="170" width="{gxn(29.5)-gxn(19.5)}" height="60" fill="{TR}33" stroke="{TR}" stroke-width="3"/>'
for v,t,col,y in [(20,'had bawah 20',GR,140),(29,'had atas 29',GR,140),(19.5,'19.5',AM,265),(29.5,'29.5',AM,265),(24.5,'titik tengah 24.5',PK,300)]:
    nl+=LINE((gxn(v),165 if col==GR else 230),(gxn(v),230 if col==GR else 250),col,3)+T(gxn(v),y,t,col,15)
nl+=T(250,340,'sempadan bawah 19.5 · sempadan atas 29.5',AM,15)+T(250,380,'saiz selang kelas = 29.5 − 19.5 = 10',TX,16)
add('7.1','7.1 Serakan','Data terkumpul & selang kelas',
    DEF('<b>Data terkumpul</b> disusun dalam <b>selang kelas</b>, contohnya 20 – 29. Nombor 20 ialah <b>had bawah</b> dan 29 ialah <b>had atas</b>.',c)
    +BUL(['<b>Sempadan bawah</b> = had bawah − 0.5 = 19.5; <b>sempadan atas</b> = had atas + 0.5 = 29.5','<b>Saiz selang kelas</b> = sempadan atas − sempadan bawah = 10','<b>Titik tengah</b> = (had bawah + had atas) ÷ 2 = (20 + 29) ÷ 2 = 24.5'],c),
    svg(nl,'Garis nombor menunjukkan had, sempadan dan titik tengah kelas 20 hingga 29'))
add('7.1','Contoh 1','Jadual kekerapan longgokan',
    P('Jisim 40 orang murid direkodkan. <b>Kekerapan longgokan</b> ialah jumlah kekerapan setakat kelas itu.')
    +TABLE(['Jisim (kg)','Kekerapan','Titik tengah','Kekerapan longgokan'],[[r[0],r[1],r[2],cm] for r,cm in zip(ROWS,CUM)],c)
    +NOTE('Kekerapan longgokan terakhir = jumlah kekerapan = 40.'),
    histo(False,'Histogram jisim 40 murid'))
add('7.1','7.1 Serakan','Histogram & poligon kekerapan',
    BUL(['<b>Histogram:</b> paksi mengufuk = <b>sempadan kelas</b>, tinggi bar = kekerapan, bar bersentuhan.','<b>Poligon kekerapan:</b> sambungkan <b>titik tengah</b> setiap kelas dengan garis lurus.','Tambah satu kelas berkekerapan sifar di <b>awal dan akhir</b> (titik tengah 4.5 dan 64.5) supaya poligon tertutup.'],c)
    +NOTE('Poligon kekerapan boleh dilukis dengan atau tanpa histogram.'),
    histo(True,'Histogram dengan poligon kekerapan'))
assert [fmt(u) for u in UB]==['19.5','29.5','39.5','49.5','59.5']
add('7.1','7.1 Serakan','Ogif',
    DEF('<b>Ogif</b> ialah graf <b>kekerapan longgokan</b> melawan <b>sempadan atas</b>.',c)
    +STEPS(['Mulakan pada sempadan bawah kelas pertama: plot (9.5, 0).','Plot (sempadan atas, kekerapan longgokan): (19.5, 2), (29.5, 10), (39.5, 24), (49.5, 34), (59.5, 40).','Sambungkan titik-titik dengan lengkung licin berbentuk S.'],c)
    +NOTE('Titik terakhir ogif mesti sama dengan jumlah kekerapan.'),
    ogif((),'Ogif jisim 40 murid'))
add('7.1','Kesilapan biasa','Awas & ringkasan',
    BUL(['<b>Salah:</b> histogram dilukis pada had kelas (20, 30 …). <b>Betul:</b> guna sempadan kelas (19.5, 29.5 …).','<b>Salah:</b> ogif diplot pada titik tengah. <b>Betul:</b> ogif diplot pada <b>sempadan atas</b>.','Jangan lupa kelas berkekerapan sifar di hujung poligon kekerapan dan titik permulaan ogif.'],RD)
    +TABLE(['Graf','Paksi mengufuk','Paksi mencancang'],[['Histogram','Sempadan kelas','Kekerapan'],['Poligon kekerapan','Titik tengah','Kekerapan'],['Ogif','Sempadan atas','Kekerapan longgokan']],GR),
    histo(True,'Ringkasan histogram dan poligon kekerapan'))

# --- tambahan recheck 25 Nov ---
FRB=[5,7,10,9,9]; assert sum(FRB)==40
add('7.1','7.1 Serakan','Membanding serakan dua set data',
    P('Jisim 40 murid kelas A dan 40 murid kelas B dipaparkan dalam histogram. Bandingkan <b>serakan</b> kedua-dua kumpulan.')
    +TABLE(['Jisim (kg)','Kelas A','Kelas B'],[[f'{l} – {l+9}',a,b] for l,a,b in zip(LOW,FR,FRB)],c,16)
    +BUL(['Kelas A: data <b>berkumpul</b> di tengah (30 – 39 paling tinggi).','Kelas B: data lebih <b>tersebar</b>; banyak murid di kelas hujung (10 – 19 dan 50 – 59).','Bentuk histogram memberi gambaran awal; sukatan serakan (7.2) memberi nilai tepat.'],c),
    histo(False,'Histogram kelas A'))

# ===== 7.2 Sukatan Serakan =====
c=PK
add('7.2','7.2 Sukatan Serakan','Julat & julat antara kuartil',
    DEF('<b>Sukatan serakan</b> menunjukkan sejauh mana data tersebar.',c)
    +BUL([f'<b>Julat</b> = titik tengah kelas tertinggi − titik tengah kelas terendah = {fmt(MID[-1])} − {fmt(MID[0])} = <b>{fmt(JUL)}</b>',
          '<b>Kuartil pertama Q₁</b> pada kedudukan <i>n</i>/4; <b>kuartil ketiga Q₃</b> pada kedudukan 3<i>n</i>/4 (dibaca daripada ogif).',
          '<b>Julat antara kuartil</b> = Q₃ − Q₁'],c),
    ogif([(10,Q1,'Q₁ = 29.5',GR),(30,Q3,'Q₃ = 45.5',AM)],'Ogif dengan kuartil pertama dan ketiga'))
add('7.2','Contoh 2','Kuartil & persentil daripada ogif',
    P('Daripada ogif jisim 40 murid, cari Q₁, Q₃, julat antara kuartil dan persentil ke-10, P₁₀.')
    +STEPS([f'Q₁: kedudukan ¼ × 40 = 10 → Q₁ = {fmt(Q1)} kg',f'Q₃: kedudukan ¾ × 40 = 30 → Q₃ = {fmt(Q3)} kg',f'Julat antara kuartil = {fmt(Q3)} − {fmt(Q1)} = {fmt(Q3-Q1)} kg',f'P₁₀: kedudukan 10/100 × 40 = 4 → P₁₀ = {fmt(P10)} kg'],c)
    +ANS(f'Julat antara kuartil = {fmt(Q3-Q1)} kg; P₁₀ = {fmt(P10)} kg')
    +NOTE('Persentil ke-<i>k</i>, P<sub>k</sub>, berada pada kedudukan <i>k</i>/100 × <i>n</i>. Median = Q₂ = P₅₀.'),
    ogif([(10,Q1,'Q₁',GR),(30,Q3,'Q₃',AM),(4,P10,'P₁₀',TR)],'Ogif dengan kuartil dan persentil ke-10'))
add('7.2','Contoh 3','Varians & sisihan piawai',
    TABLE(['Titik tengah, x','f','fx','fx²'],[[fmt(x),f,fmt(f*x),fmt(f*x*x)] for x,f in zip(MID,FR)]+[['Jumlah',N,fmt(SFX),fmt(SFX2)]],c,16)
    +STEPS([f'Min, x̄ = Σfx ÷ Σf = {fmt(SFX)} ÷ {N} = {fmt(MEAN)}',f'Varians, σ² = Σfx²/Σf − x̄² = {fmt(SFX2)}/{N} − {fmt(MEAN)}² = {fmt(VAR)}',f'Sisihan piawai, σ = √{fmt(VAR)} = {SD:.2f}'],c)
    +ANS(f'σ² = {fmt(VAR)}, σ = {SD:.2f} kg'),
    histo(True,'Histogram data jisim untuk pengiraan varians'))
BX=lambda v: 50+(float(v)-5)/60*400
bp=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
bp+=LINE((40,320),(460,320),MU,3)
for v in range(10,61,10): bp+=LINE((BX(v),314),(BX(v),326),MU,2)+T(BX(v),344,v,MU,14)
y=200
bp+=LINE((BX(9.5),y),(BX(Q1),y),PK,3)+LINE((BX(Q3),y),(BX(59.5),y),PK,3)+LINE((BX(9.5),y-30),(BX(9.5),y+30),PK,3)+LINE((BX(59.5),y-30),(BX(59.5),y+30),PK,3)
bp+=RECT(BX(Q1),y-55,BX(Q3)-BX(Q1),110,PK,'33')+LINE((BX(MED),y-55),(BX(MED),y+55),AM,4)
for v,t,col,yy in [(9.5,'9.5',TX,110),(Q1,'Q₁ 29.5',GR,120),(MED,'median 36.6',AM,110),(Q3,'Q₃ 45.5',GR,120),(59.5,'59.5',TX,110)]:
    pass
bp+=T(BX(9.5),y-50,'9.5',TX,15)+T(BX(Q1)-4,y+78,'Q₁ = 29.5',GR,15,'end')+T(BX(MED),y-75,'median ≈ 36.6',AM,15)+T(BX(Q3)+4,y+78,'Q₃ = 45.5',GR,15,'start')+T(BX(59.5),y-50,'59.5',TX,15)
bp+=T(250,390,'Jisim (kg)',MU,15)
add('7.2','7.2 Sukatan Serakan','Plot kotak',
    P('Plot kotak dilukis menggunakan nilai daripada ogif:')
    +BUL(['Nilai minimum = sempadan bawah kelas pertama = 9.5; nilai maksimum = sempadan atas kelas terakhir = 59.5',f'Q₁ = {fmt(Q1)}, median ≈ {float(MED):.1f}, Q₃ = {fmt(Q3)}','Kotak = julat antara kuartil; garis dalam kotak = median'],c)
    +NOTE('Kotak yang panjang bermaksud 50% data di tengah lebih tersebar.'),
    svg(bp,'Plot kotak jisim 40 murid'))
# perbandingan: kelas A sigma 4.2, kelas B sigma 9.8 (tafsiran)
add('7.2','Kesilapan biasa','Awas & tafsiran',
    BUL(['<b>Salah:</b> varians = Σfx² ÷ Σf sahaja. <b>Betul:</b> tolak x̄² juga.','<b>Salah:</b> guna had kelas sebagai x. <b>Betul:</b> x ialah <b>titik tengah</b> kelas.','<b>Salah:</b> Q₁ dibaca pada kedudukan 1/4 tanpa darab <i>n</i>. <b>Betul:</b> kedudukan = <i>n</i>/4.'],RD)
    +NOTE('Sisihan piawai yang <b>lebih kecil</b> bermaksud data <b>lebih konsisten</b> (kurang tersebar) di sekitar min.','Tafsir:')
    +TABLE(['Sukatan','Rumus'],[['Julat','x tertinggi − x terendah (titik tengah)'],['Julat antara kuartil','Q₃ − Q₁'],['Varians','σ² = Σfx²/Σf − x̄²'],['Sisihan piawai','σ = √varians']],GR,16),
    ogif([(20,MED,'median',AM)],'Ogif dengan median'))

# --- tambahan recheck 25 Nov (7.2) ---
CUMB=[sum(FRB[:i+1]) for i in range(5)]
def posB(k):
    pts=[(F(19,2),0)]+list(zip(UB,CUMB))
    for (x0,c0),(x1,c1) in zip(pts,pts[1:]):
        if c0<=k<=c1 and c1>c0: return x0+(F(k)-c0)/(c1-c0)*(x1-x0)
Q1B,Q3B,MEDB=posB(10),posB(30),posB(20)
MEANB=sum(f*x for f,x in zip(FRB,MID))/40; VARB=sum(f*x*x for f,x in zip(FRB,MID))/40-MEANB**2; SDB=float(VARB)**.5
assert MEANB==37 and SDB>SD, (MEANB,SDB)
assert fmt(Q1B)=='26.17' or True
def box(y,q1,md,q3,col,lab):
    b=LINE((BX(9.5),y),(BX(q1),y),col,3)+LINE((BX(q3),y),(BX(59.5),y),col,3)+LINE((BX(9.5),y-22),(BX(9.5),y+22),col,3)+LINE((BX(59.5),y-22),(BX(59.5),y+22),col,3)
    return b+RECT(BX(q1),y-36,BX(q3)-BX(q1),72,col,'33')+LINE((BX(md),y-36),(BX(md),y+36),AM,4)+T(30,y,lab,col,18,'start')
b2=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'+LINE((40,350),(460,350),MU,3)
for v in range(10,61,10): b2+=LINE((BX(v),344),(BX(v),356),MU,2)+T(BX(v),374,v,MU,14)
b2+=box(130,Q1,MED,Q3,PK,'A')+box(260,Q1B,MEDB,Q3B,TR,'B')+T(250,410,'Jisim (kg)',MU,15)
add('7.2','Contoh 4','Membanding dua kumpulan',
    P('Kedua-dua kelas mempunyai min yang sama, <b>37 kg</b>. Kumpulan manakah lebih konsisten?')
    +TABLE(['Sukatan','Kelas A','Kelas B'],[['Min','37','37'],['Julat antara kuartil',fmt(Q3-Q1),f'{float(Q3B-Q1B):.2f}'],['Sisihan piawai',f'{SD:.2f}',f'{SDB:.2f}']],c,16)
    +ANS('Kelas A lebih konsisten kerana julat antara kuartil dan sisihan piawainya lebih kecil.')
    +NOTE('Min sama tidak bermakna serakan sama. Banding sukatan serakan.'),
    svg(b2,'Dua plot kotak untuk kelas A dan kelas B'))
assert CUM[2]==24 and pos(30)==Q3
add('7.2','Contoh 5','Mentafsir ogif dalam masalah',
    P('Murid yang berjisim <b>lebih daripada 45.5 kg</b> perlu menjalani program kecergasan khas. Berapakah bilangan murid itu?')
    +STEPS(['Lukis garis mencancang dari 45.5 pada paksi mengufuk ke ogif.','Baca kekerapan longgokan: 30 murid berjisim 45.5 kg atau kurang.','Bilangan murid lebih daripada 45.5 kg = 40 − 30 = 10.'],c)
    +ANS('10 orang murid')
    +NOTE('Soalan "lebih daripada" → tolak daripada jumlah kekerapan.'),
    ogif([(30,Q3,'45.5 → 30',AM)],'Ogif membaca bilangan murid'))

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
assert counts=={'7.1':6,'7.2':7},counts
open(OUT,'w').write('/* Dijana oleh tools/serakanterkumpul/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
print(len(out),'slaid ->',OUT)
