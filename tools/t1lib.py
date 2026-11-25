# Pustaka slaid bersama untuk bab Tingkatan 1 (KP2027)
import json, os, re, html
from fractions import Fraction as F
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


def BOX(W_=W,H_=H): return f'<rect x="0" y="0" width="{W_}" height="{H_}" rx="20" fill="{SURF}" stroke="{BD}" stroke-width="2"/>'
def RECT(x,y,w,h,col,fill=None,sw=3,rx=8): return f'<rect x="{round(x,1)}" y="{round(y,1)}" width="{round(w,1)}" height="{round(h,1)}" rx="{rx}" fill="{fill or NAV}" stroke="{col}" stroke-width="{sw}"/>'
def CIRC(c,r,col,fill='none',sw=3,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ''
    return f'<circle cx="{round(c[0],1)}" cy="{round(c[1],1)}" r="{r}" fill="{fill}" stroke="{col}" stroke-width="{sw}"{d}/>'
def POLY(pts,col,fill='none',sw=4): return '<polygon points="'+' '.join(f'{round(x,1)},{round(y,1)}' for x,y in pts)+f'" fill="{fill}" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>'
def numline(vals,lo,hi,step=1,col=TR,label=''):
    """vals: [(nilai, teks, warna)]"""
    s=BOX(); x0,x1,y=40,460,230
    X=lambda v:x0+(v-lo)/(hi-lo)*(x1-x0)
    s+=LINE((x0-10,y),(x1+10,y),MU,3)
    v=lo
    while v<=hi+1e-9:
        s+=LINE((X(v),y-8),(X(v),y+8),MU,2)+T(X(v),y+30,('%g'%v).replace('-','−'),MU,16); v+=step
    for i,(v,t,c) in enumerate(vals):
        yy=y-50-(i%2)*45
        s+=LINE((X(v),y),(X(v),yy+14),c,2,'4 4')+DOT((X(v),y),c,8)+T(X(v),yy,t,c,18)
    return svg(s,label or 'Garis nombor')
S=[]
def add(sub,kicker,title,body,fig=''): S.append({'sub':sub,'kicker':kicker,'title':title,'body':body,'fig':fig})
def finish(SUB,OUT,expect,extra_ok=()):
    counts={}
    for s in S: counts[s['sub']]=counts.get(s['sub'],0)+1
    idx={}; out=[]
    for s in S:
        idx[s['sub']]=idx.get(s['sub'],0)+1
        out.append({'sub':s['sub'],'n':idx[s['sub']],'N':counts[s['sub']],'kicker':s['kicker'],'title':s['title'],'body':s['body'],'fig':s['fig'],'full':'' if s['fig'] else '<div class="sl-text" style="max-width:900px">'+s['body']+'</div>'})
    subs=[{'no':k,'name':v[0],'col':v[1]} for k,v in SUB.items()]
    body=json.dumps(out,ensure_ascii=False)
    ALLOWED={x.lower() for x in [BG,SURF,NAV,BD,TX,MU,GRID,DIM]+list(C.values())+list(extra_ok)}
    bad={h for h in re.findall(r'#[0-9a-fA-F]{6}',body) if h.lower() not in ALLOWED}
    assert not bad,bad
    assert 'NaN' not in body and 'None' not in body
    assert counts==expect,counts
    open(OUT,'w').write('/* Dijana oleh skrip tools. Jangan sunting dengan tangan. */\nwindow.SUBS='+json.dumps(subs,ensure_ascii=False)+';\nwindow.SLIDES='+body+';\n')
    print(len(out),'slaid ->',OUT)

def barmodel(rows, unit=None, title='', note='', label='Model bar'):
    """rows: [(nama, bil_unit, warna, teks_dalam_unit)]; unit: teks nilai satu unit (pilihan)"""
    s = BOX(); mx = max(r[1] for r in rows); cw = min(60, 290 / mx); x0 = 120; y = 60 if title else 40
    if title: s += T(250, 34, title, TX, 19)
    for nm, n, col, tx in rows:
        s += T(x0 - 14, y + 24, nm, col, 18, 'end')
        for k in range(n):
            s += RECT(x0 + k * cw, y, cw, 48, col, NAV, 3, 4)
            if tx: s += T(x0 + k * cw + cw / 2, y + 24, tx, col, 15)
        s += T(x0 + n * cw + 10, y + 24, f'{n} unit', MU, 15, 'start')
        y += 74
    if unit: s += T(250, y + 20, unit, AM, 20)
    if note: s += T(250, y + 56, note, GR, 19)
    return svg(s, label)
