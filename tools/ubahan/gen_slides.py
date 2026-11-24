# Penjana slaid NOTA UBAHAN (Tingkatan 5 Bab 1 Ubahan) -> ubahan/slides.js
# Jalankan:  python3 tools/ubahan/gen_slides.py
import json, os, re, html
from fractions import Fraction as F
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', '..', 'ubahan', 'slides.js'))
BG='#0B1220'; SURF='#131C2E'; NAV='#0E1626'; BD='#22304A'; TX='#E6EDF7'; MU='#94A3B8'; GRID='#1E2A40'; DIM='#334155'
C={'tr':'#38BDF8','pa':'#FB923C','pu':'#A78BFA','am':'#FBBF24','gr':'#34D399','pk':'#F472B6','rd':'#F87171'}
TR,PK,AM,GR,PU,RD=C['tr'],C['pk'],C['am'],C['gr'],C['pu'],C['rd']
SUB={'1.1':('Ubahan Langsung',TR),'1.2':('Ubahan Songsang',PK),'1.3':('Ubahan Bergabung',AM)}
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

def flow():
    s=f'<rect x="0" y="0" width="{W}" height="{H}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
    def box(x,y,t,col): return f'<rect x="{x-60}" y="{y-38}" width="120" height="76" rx="16" fill="{NAV}" stroke="{col}" stroke-width="4"/>'+T(x,y,t,col,34)
    s+=box(110,120,'x',TR)+box(110,320,'z',PK)+box(390,220,'y',AM)
    s+=LINE((172,135),(326,205),TR,4)+LINE((172,305),(326,235),PK,4,'10 7')
    s+=T(250,140,'langsung',TR,18)+T(250,305,'songsang',PK,18)
    s+=T(250,410,'y = kx/z',AM,26)
    return svg(s,'Rajah ubahan separa: y berubah secara langsung dengan x dan secara songsang dengan z')
S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})

# ===== 1.1 Ubahan Langsung =====
c=TR
for x in (1,2,3,4): assert 3*x/x==3
add('1.1','1.1 Ubahan Langsung','Apakah ubahan langsung?',
    DEF('<b>y berubah secara langsung dengan x</b> jika nilai <i>y</i> bertambah apabila <i>x</i> bertambah dengan nisbah yang sama, iaitu <i>y</i>/<i>x</i> sentiasa tetap.',c)
    +BUL(['Ditulis <b>y ∝ x</b> (∝ dibaca “berubah secara langsung dengan”).','Persamaan: <b>y = kx</b>, dengan <i>k</i> ialah <b>pemalar</b>.','Jika <i>x</i> digandakan dua kali, <i>y</i> juga digandakan dua kali.'],c),
    graph(lambda x:3*x,4,12,c,'x','y',[(2,6,'(2, 6)')],'Graf y = 3x garis lurus melalui asalan'))
add('1.1','1.1 Ubahan Langsung','y ∝ xⁿ',
    P('Ubahan langsung juga boleh melibatkan kuasa <i>n</i> bagi <i>x</i>:')
    +TABLE(['Ayat','Simbol','Persamaan'],[['y berubah secara langsung dengan x','y ∝ x','y = kx'],['… dengan kuasa dua x','y ∝ x²','y = kx²'],['… dengan kuasa tiga x','y ∝ x³','y = kx³'],['… dengan punca kuasa dua x','y ∝ √x','y = k√x'],['… dengan punca kuasa tiga x','y ∝ ∛x','y = k∛x']],c),
    graph(lambda x:x*x,4,16,PK,'x','y',[(3,9,'(3, 9)')],'Graf y = x kuasa dua'))
# contoh 1: y ∝ x², y=12 bila x=2; cari y bila x=5
k=F(12,2**2); assert k==3; y=k*5**2; assert y==75
add('1.1','Contoh 1','Mencari pemalar k dan nilai y',
    P('Diberi <i>y</i> ∝ <i>x</i>² dan <i>y</i> = 12 apabila <i>x</i> = 2. Cari nilai <i>y</i> apabila <i>x</i> = 5.')
    +STEPS(['Tulis persamaan: <i>y</i> = <i>kx</i>²','Gantikan: 12 = <i>k</i> × 2² = 4<i>k</i>','<i>k</i> = 12 ÷ 4 = 3, maka <i>y</i> = 3<i>x</i>²','Apabila <i>x</i> = 5: <i>y</i> = 3 × 5² = 3 × 25'],c)+ANS('<i>y</i> = 75'),
    graph(lambda x:3*x,25,75,c,'x²','y',[(4,12,'(4, 12)'),(25,75,'(25, 75)')],'Graf y melawan x kuasa dua ialah garis lurus'))
k=F(6,2); assert k==3 and (F(15)/k)**2==25
add('1.1','Contoh 2','Mencari nilai x',
    P('Diberi <i>y</i> ∝ √<i>x</i> dan <i>y</i> = 6 apabila <i>x</i> = 4. Cari nilai <i>x</i> apabila <i>y</i> = 15.')
    +STEPS(['<i>y</i> = <i>k</i>√<i>x</i> → 6 = <i>k</i> × √4 = 2<i>k</i>','<i>k</i> = 3, maka <i>y</i> = 3√<i>x</i>','15 = 3√<i>x</i> → √<i>x</i> = 5','<i>x</i> = 5² = 25'],c)+ANS('<i>x</i> = 25')
    +NOTE('Graf <i>y</i> melawan <i>x</i>ⁿ sentiasa garis lurus yang melalui asalan, kecerunannya = <i>k</i>.'),
    graph(lambda x:3*x**0.5,25,15,c,'x','y',[(4,6,'(4, 6)'),(25,15,'(25, 15)')],'Graf y = 3 punca kuasa dua x'))
add('1.1','Kesilapan biasa','Awas!',
    BUL(['<b>Salah:</b> 12 = 2² + <i>k</i>. <b>Betul:</b> 12 = <i>k</i> × 2² (k didarab, bukan ditambah).','Cari nilai <i>k</i> dahulu sebelum mencari nilai baharu.','<i>y</i> ∝ <i>x</i>² bermaksud <i>y</i>/<i>x</i>² tetap, bukan <i>y</i>/<i>x</i>.'],RD)
    +NOTE('<i>y</i> ∝ <i>x</i>ⁿ ⇔ <i>y</i> = <i>kx</i>ⁿ ⇔ <i>y</i>/<i>x</i>ⁿ = <i>k</i>','Ringkasan:'),
    graph(lambda x:2*x,5,10,GR,'xⁿ','y',[(3,6,'k = 6/3 = 2')],'Kecerunan graf y melawan x kuasa n ialah k'))

# ===== 1.2 Ubahan Songsang =====
c=PK
for x in (1,2,3,4,6,12): assert x*(12/x)==12
add('1.2','1.2 Ubahan Songsang','Apakah ubahan songsang?',
    DEF('<b>y berubah secara songsang dengan x</b> jika nilai <i>y</i> berkurang apabila <i>x</i> bertambah, dan hasil darab <i>xy</i> sentiasa tetap.',c)
    +BUL(['Ditulis <b>y ∝ 1/x</b>.','Persamaan: <b>y = k/x</b> atau <b>xy = k</b>.','Jika <i>x</i> digandakan dua kali, <i>y</i> menjadi separuh.'],c),
    graph(lambda x:12/x if x>0 else 99,12,12,c,'x','y',[(2,6,'(2, 6)'),(4,3,'(4, 3)')],'Graf y = 12/x'))
add('1.2','1.2 Ubahan Songsang','y ∝ 1/xⁿ',
    TABLE(['Ayat','Simbol','Persamaan'],[['y berubah secara songsang dengan x','y ∝ 1/x','y = k/x'],['… dengan kuasa dua x','y ∝ 1/x²','y = k/x²'],['… dengan kuasa tiga x','y ∝ 1/x³','y = k/x³'],['… dengan punca kuasa dua x','y ∝ 1/√x','y = k/√x']],c)
    +NOTE('Graf <i>y</i> melawan 1/<i>x</i>ⁿ ialah garis lurus melalui asalan.'),
    graph(lambda u:12*u,1,12,c,'1/x','y',[(0.5,6,'x = 2, y = 6'),(0.25,3,'x = 4, y = 3')],'Graf y melawan 1/x ialah garis lurus melalui asalan'))
k=8*3**2; assert k==72 and F(72,6**2)==2
add('1.2','Contoh 1','Mencari k dan nilai y',
    P('Diberi <i>y</i> ∝ 1/<i>x</i>² dan <i>y</i> = 8 apabila <i>x</i> = 3. Cari <i>y</i> apabila <i>x</i> = 6.')
    +STEPS(['<i>y</i> = <i>k</i>/<i>x</i>² → 8 = <i>k</i>/3²','<i>k</i> = 8 × 9 = 72','<i>y</i> = 72/<i>x</i>²','Apabila <i>x</i> = 6: <i>y</i> = 72/36'],c)+ANS('<i>y</i> = 2'),
    graph(lambda x:72/x**2 if x>0 else 999,8,16,c,'x','y',[(3,8,'(3, 8)'),(6,2,'(6, 2)')],'Graf y = 72/x kuasa dua'))
k=12*5; assert k==60 and F(60,4)==15
add('1.2','Contoh 2','Masalah harian',
    P('Masa, <i>t</i> hari, untuk menyiapkan sebuah rumah berubah secara songsang dengan bilangan pekerja, <i>n</i>. 5 orang pekerja mengambil masa 12 hari. Berapa hari diperlukan oleh 4 orang pekerja?')
    +STEPS(['<i>t</i> = <i>k</i>/<i>n</i> → 12 = <i>k</i>/5','<i>k</i> = 60, maka <i>t</i> = 60/<i>n</i>','<i>t</i> = 60/4'],c)+ANS('15 hari'),
    graph(lambda x:60/x if x>0 else 999,10,30,c,'n','t',[(5,12,'(5, 12)'),(4,15,'(4, 15)')],'Graf t = 60/n'))
add('1.2','Kesilapan biasa','Awas!',
    BUL(['<b>Salah:</b> 8 = <i>k</i> × 3² untuk ubahan songsang. <b>Betul:</b> 8 = <i>k</i>/3².','Ubahan songsang: <i>x</i> bertambah, <i>y</i> berkurang, tetapi graf tidak menyentuh paksi.','Semak jawapan: <i>x</i>ⁿ<i>y</i> mestilah sama dengan <i>k</i>.'],RD)
    +NOTE('<i>y</i> ∝ 1/<i>x</i>ⁿ ⇔ <i>y</i> = <i>k</i>/<i>x</i>ⁿ ⇔ <i>x</i>ⁿ<i>y</i> = <i>k</i>','Ringkasan:'),
    graph(lambda x:12/x if x>0 else 99,12,12,PK,'x','y',[(3,4,'3 × 4 = 12'),(6,2,'6 × 2 = 12')],'Hasil darab xy tetap bagi ubahan songsang'))

# ===== 1.3 Ubahan Bergabung =====
c=AM
add('1.3','1.3 Ubahan Bergabung','Apakah ubahan bergabung?',
    DEF('<b>Ubahan bergabung</b> melibatkan satu pemboleh ubah yang berubah dengan dua atau lebih pemboleh ubah lain.',c)
    +TABLE(['Jenis','Ayat','Persamaan'],[['Ubahan bersama','y berubah secara langsung dengan x dan z','y = kxz'],['Ubahan bersama','y berubah secara langsung dengan x² dan z','y = kx²z'],['Ubahan separa','y berubah secara langsung dengan x dan secara songsang dengan z','y = kx/z'],['Ubahan separa','y berubah secara langsung dengan x dan secara songsang dengan z²','y = kx/z²']],c),
    flow())
k=F(24,2*3); assert k==4 and k*5*2==40
add('1.3','Contoh 1','Ubahan bersama',
    P('Diberi <i>y</i> ∝ <i>xz</i> dan <i>y</i> = 24 apabila <i>x</i> = 2 dan <i>z</i> = 3. Cari <i>y</i> apabila <i>x</i> = 5 dan <i>z</i> = 2.')
    +STEPS(['<i>y</i> = <i>kxz</i> → 24 = <i>k</i> × 2 × 3 = 6<i>k</i>','<i>k</i> = 4, maka <i>y</i> = 4<i>xz</i>','<i>y</i> = 4 × 5 × 2'],c)+ANS('<i>y</i> = 40'),
    graph(lambda u:4*u,10,40,c,'xz','y',[(6,24,'xz = 6, y = 24'),(10,40,'xz = 10, y = 40')],'Graf y melawan xz ialah garis lurus dengan kecerunan k = 4'))
k=F(10*2**2,5); assert k==8 and F(8*9,3**2)==8
add('1.3','Contoh 2','Ubahan separa',
    P('Diberi <i>y</i> ∝ <i>x</i>/<i>z</i>² dan <i>y</i> = 10 apabila <i>x</i> = 5 dan <i>z</i> = 2. Cari <i>y</i> apabila <i>x</i> = 9 dan <i>z</i> = 3.')
    +STEPS(['<i>y</i> = <i>kx</i>/<i>z</i>² → 10 = <i>k</i> × 5 / 2²','<i>k</i> = 10 × 4 ÷ 5 = 8','<i>y</i> = 8<i>x</i>/<i>z</i>²','<i>y</i> = 8 × 9 / 3² = 72/9'],c)+ANS('<i>y</i> = 8'),
    graph(lambda u:8*u,1.25,10,c,'x/z²','y',[(1.25,10,'(5/4, 10)'),(1,8,'(1, 8)')],'Graf y melawan x/z kuasa dua ialah garis lurus dengan kecerunan 8'))
k=F(150,3*5); assert k==10 and F(450,10*6)==F(15,2)
k2=F(120,4*3); assert k2==10 and F(600,10*5)==12
add('1.3','Contoh 3','Masalah harian',
    P('Upah, RM<i>U</i>, berubah secara langsung dengan bilangan pekerja, <i>p</i>, dan bilangan hari, <i>h</i>. 4 pekerja selama 3 hari dibayar RM120. Berapa hari 5 pekerja perlu bekerja untuk mendapat RM600?')
    +STEPS(['<i>U</i> = <i>kph</i> → 120 = <i>k</i> × 4 × 3','<i>k</i> = 10, maka <i>U</i> = 10<i>ph</i>','600 = 10 × 5 × <i>h</i> = 50<i>h</i>','<i>h</i> = 600 ÷ 50'],c)+ANS('12 hari'),
    graph(lambda u:10*u,60,600,c,'ph','U',[(12,120,'4 × 3 = 12 → RM120'),(60,600,'5 × 12 = 60 → RM600')],'Graf upah melawan hasil darab pekerja dan hari'))
assert F(4)*2/2==4 and 3*1==3 and F(1,4)*2==F(1,2)
add('1.3','1.3 Ubahan Bergabung','Kesan perubahan pemboleh ubah',
    P('Diberi <i>y</i> = <i>kx</i>/<i>z</i>. Apakah berlaku kepada <i>y</i> jika:')
    +TABLE(['Perubahan','Kesan pada y'],[['x digandakan dua, z tetap','y × 2'],['z digandakan dua, x tetap','y ÷ 2 (separuh)'],['x dan z kedua-duanya digandakan dua','y tidak berubah'],['x × 3, z tetap','y × 3']],c)
    +NOTE('Pemboleh ubah di <b>pengangka</b> menaikkan <i>y</i>; di <b>penyebut</b> menurunkan <i>y</i>.'),
    flow())
add('1.3','Ringkasan','Ringkasan bab',
    TABLE(['Ubahan','Simbol','Persamaan'],[['Langsung','y ∝ xⁿ','y = kxⁿ'],['Songsang','y ∝ 1/xⁿ','y = k/xⁿ'],['Bersama','y ∝ xz','y = kxz'],['Separa','y ∝ x/z','y = kx/z']],c)
    +BUL(['Langkah: tulis persamaan → cari <i>k</i> → gantikan nilai baharu.','Untuk ubahan langsung, pemboleh ubah di <b>pengangka</b>; untuk ubahan songsang, di <b>penyebut</b>.'],c),
    flow())

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
assert counts=={'1.1':5,'1.2':5,'1.3':6},counts
open(OUT,'w').write('/* Dijana oleh tools/ubahan/gen_slides.py. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
print(len(out),'slaid ->',OUT)
