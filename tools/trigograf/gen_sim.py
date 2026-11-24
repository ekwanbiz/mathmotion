import os
D='/home/claude/mathmotion/trigograf/simulasi/'
HEAD='''<!doctype html>
<html lang="ms">
<head>
<meta charset="utf-8"><meta name="color-scheme" content="dark">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
<title>%s · Bab 6</title>
<style>
@font-face{font-family:'Inter';font-weight:400;font-display:swap;src:url('../../teras/fonts/inter-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Inter';font-weight:700;font-display:swap;src:url('../../teras/fonts/inter-latin-700-normal.woff2') format('woff2')}
:root{--bg:#0B1220;--sf:#131C2E;--sf2:#18233A;--sf3:#0E1626;--bd:#22304A;--bd2:#2E3F5E;--tx:#E6EDF7;--mu:#94A3B8;--mu2:#64748B;--pu:#A78BFA;--tr:#38BDF8;--am:#FBBF24;--gr:#34D399;--pk:#F472B6;--rd:#F87171;
 --surface:#131C2E;--border:#2E3F5E;--text:#E6EDF7;--muted:#94A3B8;
 font-family:Inter,"Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;color:var(--tx);background:var(--bg)}
*{box-sizing:border-box}
html,body{margin:0;height:100%%}
body{height:100vh;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);background-image:linear-gradient(#ffffff07 1px,transparent 1px),linear-gradient(90deg,#ffffff07 1px,transparent 1px);background-size:32px 32px}
button{font:inherit;color:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.wrap{flex:1;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;gap:10px;padding:12px 12px calc(12px + env(safe-area-inset-bottom));max-width:1200px;width:100%%;margin:0 auto}
.top{display:flex;gap:8px;align-items:center}
.top h1{flex:1;margin:0;font-size:19px;font-weight:800;color:var(--%s)}
.top .snd-btn{min-height:44px;border-radius:16px}
.stage{min-height:0;background:var(--sf3);border:1px solid var(--bd);border-radius:18px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.stage svg{width:100%%;height:100%%;display:block;touch-action:none;user-select:none;-webkit-user-select:none}
.info{background:var(--sf);border:1px solid var(--bd);border-radius:16px;padding:10px 14px;line-height:1.45;font-size:15px}
.info .row{display:flex;flex-wrap:wrap;gap:4px 16px;font-weight:700}
.info .tip{color:var(--mu);font-size:13px;margin-top:4px}
.ctrl{display:flex;flex-wrap:wrap;gap:8px}
.chip{flex:1;min-width:64px;background:var(--sf);border:2px solid var(--bd2);border-radius:13px;padding:11px 6px;font-weight:800;font-size:15px}
.chip.on{background:var(--%s);border-color:var(--%s);color:#0B1220}
.sl{flex:1 1 30%%;min-width:150px;background:var(--sf);border:1px solid var(--bd);border-radius:13px;padding:6px 12px;font-weight:800;font-size:14px}
.sl input{width:100%%;accent-color:var(--%s);height:26px}
@media (min-width:900px){.wrap{grid-template-columns:minmax(0,1fr) 340px;grid-template-rows:auto minmax(0,1fr) auto}.top{grid-column:1/3}.stage{grid-row:2/4}.info{grid-column:2}.ctrl{grid-column:2;align-content:start}}
</style>
</head>
<body>
<div id="backAL" style="padding:calc(14px + env(safe-area-inset-top)) 12px 0;position:relative;z-index:50;max-width:1200px;width:100%%;margin:0 auto"><a href="../#/teroka" style="display:inline-flex;align-items:center;gap:10px;background:#A78BFA;color:#140d2e;border-radius:14px;padding:12px 22px;font:900 17px Inter,system-ui,sans-serif;text-decoration:none;box-shadow:0 8px 22px #a78bfa44">&#8592; Kembali</a></div><script>if(window.top!==window.self)document.getElementById("backAL").style.display="none"</script>
<div class="wrap">
<div class="top"><h1>%s</h1><span id="sndslot"></span></div>
'''
TAIL='''<script src="../../teras/fx.js"></script>
<script>if(window.FX){document.getElementById('sndslot').innerHTML=FX.button()}</script>
<script>(function(){var p=function(e){e.preventDefault()};['gesturestart','gesturechange','gestureend'].forEach(function(t){document.addEventListener(t,p,{passive:false})});document.addEventListener('touchmove',function(e){if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});})();</script>
</body>
</html>
'''
COMMON='''const R=d=>d*Math.PI/180,S=d=>Math.sin(R(d)),C=d=>Math.cos(R(d));
const fm=(v,dp=4)=>{let r=+v.toFixed(dp);if(Object.is(r,-0)||Math.abs(r)<1e-9)r=0;return(r<0?'−':'')+Math.abs(r)};
const suk=t=>t%90===0?null:t<90?1:t<180?2:t<270?3:4,ROM=['','I','II','III','IV'];
const refA=t=>{const q=suk(t);return q===1?t:q===2?180-t:q===3?t-180:360-t};
const snd=n=>{if(window.FX)FX.play(n)};
const svg=document.getElementById('sv');
function svgPt(e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
'''
def write(fn, title, col, body, script):
    open(D+fn,'w').write(HEAD%(title,col,col,col,col,title)+body+'</div>\n<script>\n'+COMMON+script+'\n</script>\n'+TAIL)

# (a) bulatan unit
write('bulatan-unit.html','Bulatan Unit','pu','''<div class="stage"><svg id="sv" viewBox="0 0 400 400" role="img" aria-label="Bulatan unit: seret titik P"></svg></div>
<div class="info" id="info"></div>
<div class="ctrl"><button class="chip" id="m1">−1°</button><button class="chip" id="p1">+1°</button><button class="chip on" id="snap">Lompat 15°</button><button class="chip" id="khas">Sudut khas</button></div>
''','''
let th=50,snap=true;const CX=200,CY=200,RR=140;
const KH=[0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330];
function render(){
 const px=CX+RR*C(th),py=CY-RR*S(th),q=suk(th);
 let s='';
 const qcol=['','#34D399','#F472B6','#FBBF24','#38BDF8'];
 [[1,0],[2,90],[3,180],[4,270]].forEach(([k,a])=>{const on=q===k;s+=`<path d="M${CX} ${CY} L${CX+RR*C(a)} ${CY-RR*S(a)} A${RR} ${RR} 0 0 0 ${CX+RR*C(a+90)} ${CY-RR*S(a+90)} Z" fill="${qcol[k]}" opacity="${on?.16:.04}"/>`;
  const m=a+45;s+=`<text x="${CX+RR*.62*C(m)}" y="${CY-RR*.62*S(m)+(k<3?-28:28)}" fill="${qcol[k]}" opacity="${on?1:.5}" font-size="14" font-weight="800" text-anchor="middle" dominant-baseline="central">${['','Semua +','sin +','tan +','kos +'][k]}</text>`});
 s+=`<line x1="30" y1="${CY}" x2="370" y2="${CY}" stroke="#94A3B8" stroke-width="2"/><line x1="${CX}" y1="30" x2="${CX}" y2="370" stroke="#94A3B8" stroke-width="2"/>`;
 s+=`<circle cx="${CX}" cy="${CY}" r="${RR}" fill="none" stroke="#2E3F5E" stroke-width="3"/>`;
 let d='';const n=Math.max(2,Math.round(th/4));for(let k=0;k<=n;k++){const a=th*k/n;d+=(k?'L':'M')+(CX+30*C(a)).toFixed(1)+' '+(CY-30*S(a)).toFixed(1)}
 s+=`<path d="${d}" fill="none" stroke="#FBBF24" stroke-width="3"/>`;
 s+=`<line x1="${px}" y1="${py}" x2="${px}" y2="${CY}" stroke="#F472B6" stroke-width="3.5" stroke-dasharray="6 5"/><line x1="${CX}" y1="${CY}" x2="${px}" y2="${CY}" stroke="#34D399" stroke-width="4"/>`;
 s+=`<line x1="${CX}" y1="${CY}" x2="${px}" y2="${py}" stroke="#A78BFA" stroke-width="4.5" stroke-linecap="round"/>`;
 s+=`<text x="${Math.max(70,Math.min(330,px))}" y="${py+(py<=CY?-22:28)}" fill="#E6EDF7" font-size="14" font-weight="800" text-anchor="middle" paint-order="stroke" stroke="#0E1626" stroke-width="5">P(${fm(C(th),3)}, ${fm(S(th),3)})</text>`;
 s+=`<g class="h" style="cursor:grab"><circle cx="${px}" cy="${py}" r="24" fill="transparent"/><circle cx="${px}" cy="${py}" r="11" fill="#FBBF24" stroke="#0E1626" stroke-width="3"/></g>`;
 s+=`<text x="372" y="${CY-12}" fill="#94A3B8" font-size="14" font-weight="700" text-anchor="end">x</text><text x="${CX+10}" y="40" fill="#94A3B8" font-size="14" font-weight="700">y</text>`;
 svg.innerHTML=s;
 const t=Math.abs(C(th))<1e-9?'tidak tertakrif':fm(S(th)/C(th));
 const qs=q?`Sukuan ${ROM[q]} · sudut rujukan α = ${refA(th)}°`:'Pada paksi (bukan dalam mana-mana sukuan)';
 document.getElementById('info').innerHTML=`<div class="row"><span style="color:#FBBF24">θ = ${th}°</span><span style="color:#A78BFA">${qs}</span></div><div class="row"><span style="color:#F472B6">sin θ = ${fm(S(th))}</span><span style="color:#34D399">kos θ = ${fm(C(th))}</span><span style="color:#38BDF8">tan θ = ${t}</span></div><div class="tip">Seret titik kuning. sin θ = koordinat-y, kos θ = koordinat-x, tan θ = y ÷ x.</div>`;
 document.getElementById('snap').classList.toggle('on',snap);
}
let drag=false;
svg.addEventListener('pointerdown',e=>{if(!e.target.closest('.h'))return;e.preventDefault();drag=true;svg.setPointerCapture(e.pointerId)});
svg.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();const p=svgPt(e);let a=Math.atan2(-(p.y-CY),p.x-CX)*180/Math.PI;if(a<0)a+=360;a=snap?Math.round(a/15)*15:Math.round(a);if(a>=360)a=snap?0:359;if(a!==th){th=a;render()}});
const end=()=>{if(drag)snd('ketik');drag=false};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
document.getElementById('m1').onclick=()=>{th=(th+359)%360;render()};
document.getElementById('p1').onclick=()=>{th=(th+1)%360;render()};
document.getElementById('snap').onclick=()=>{snap=!snap;render()};
document.getElementById('khas').onclick=()=>{const i=KH.indexOf(th);th=KH[(i+1)%KH.length];snd('ketik');render()};
render();
''')

# (b) penjana graf
write('penjana-graf.html','Penjana Graf','tr','''<div class="stage"><svg id="sv" viewBox="0 0 820 360" role="img" aria-label="Putaran pada bulatan unit melukis graf"></svg></div>
<div class="info" id="info"></div>
<div class="ctrl"><button class="chip on" id="fs">sin</button><button class="chip" id="fc">kos</button><button class="chip" id="play">▶ Main</button><button class="chip" id="rs">Semula</button></div>
''','''
let th=0,fn='sin',max=0,timer=null;const CX=130,CY=180,RR=100,GX=270,GW=520,GS=GW/360;
const val=t=>fn==='sin'?S(t):C(t);
function render(){
 let s='';
 s+=`<line x1="20" y1="${CY}" x2="240" y2="${CY}" stroke="#94A3B8" stroke-width="2"/><line x1="${CX}" y1="60" x2="${CX}" y2="300" stroke="#94A3B8" stroke-width="2"/><circle cx="${CX}" cy="${CY}" r="${RR}" fill="none" stroke="#2E3F5E" stroke-width="3"/>`;
 for(let x=90;x<=360;x+=90)s+=`<line x1="${GX+x*GS}" y1="70" x2="${GX+x*GS}" y2="290" stroke="#1E2A40" stroke-width="1.5"/><text x="${GX+x*GS}" y="${CY+(x===180||x===360?-12:18)}" fill="#64748B" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central">${x}°</text>`;
 [1,-1].forEach(y=>{s+=`<line x1="${GX}" y1="${CY-y*RR}" x2="${GX+GW}" y2="${CY-y*RR}" stroke="#1E2A40" stroke-width="1.5"/><text x="${GX-8}" y="${CY-y*RR}" fill="#64748B" font-size="13" font-weight="700" text-anchor="end" dominant-baseline="central">${y>0?'1':'−1'}</text>`});
 s+=`<line x1="${GX}" y1="${CY}" x2="${GX+GW+12}" y2="${CY}" stroke="#94A3B8" stroke-width="2"/><line x1="${GX}" y1="60" x2="${GX}" y2="300" stroke="#94A3B8" stroke-width="2"/>`;
 let d='';for(let t=0;t<=max;t++)d+=(t?'L':'M')+(GX+t*GS).toFixed(1)+' '+(CY-RR*val(t)).toFixed(1);
 if(max>0)s+=`<path d="${d}" fill="none" stroke="${fn==='sin'?'#38BDF8':'#34D399'}" stroke-width="4" stroke-linecap="round"/>`;
 const px=CX+RR*C(th),py=CY-RR*S(th),gy=CY-RR*val(th),gx=GX+th*GS;
 if(fn==='sin')s+=`<line x1="${px}" y1="${py}" x2="${gx}" y2="${gy}" stroke="#F472B6" stroke-width="2" stroke-dasharray="5 5"/><line x1="${px}" y1="${py}" x2="${px}" y2="${CY}" stroke="#F472B6" stroke-width="3.5"/>`;
 else s+=`<line x1="${CX}" y1="${CY}" x2="${px}" y2="${CY}" stroke="#34D399" stroke-width="5"/><line x1="${gx}" y1="${CY}" x2="${gx}" y2="${gy}" stroke="#34D399" stroke-width="3" stroke-dasharray="5 5"/>`;
 s+=`<line x1="${CX}" y1="${CY}" x2="${px}" y2="${py}" stroke="#A78BFA" stroke-width="4" stroke-linecap="round"/>`;
 s+=`<circle cx="${gx}" cy="${gy}" r="7" fill="#FBBF24"/><g class="h" style="cursor:grab"><circle cx="${px}" cy="${py}" r="24" fill="transparent"/><circle cx="${px}" cy="${py}" r="10" fill="#FBBF24" stroke="#0E1626" stroke-width="3"/></g>`;
 s+=`<text x="${GX+GW}" y="48" fill="${fn==='sin'?'#38BDF8':'#34D399'}" font-size="20" font-weight="800" text-anchor="end">y = ${fn} x</text>`;
 svg.innerHTML=s;
 document.getElementById('info').innerHTML=`<div class="row"><span style="color:#FBBF24">x = ${th}°</span><span style="color:${fn==='sin'?'#F472B6':'#34D399'}">${fn} ${th}° = ${fm(val(th))}</span></div><div class="tip">Seret titik pada bulatan atau tekan Main. ${fn==='sin'?'Tinggi titik (koordinat-y)':'Jarak mengufuk (koordinat-x)'} dipindahkan ke graf. Kala = 360°, amplitud = 1.</div>`;
 document.getElementById('fs').classList.toggle('on',fn==='sin');document.getElementById('fc').classList.toggle('on',fn==='kos');
 document.getElementById('play').textContent=timer?'❚❚ Henti':'▶ Main';
}
function stop(){clearInterval(timer);timer=null}
let drag=false;
svg.addEventListener('pointerdown',e=>{if(!e.target.closest('.h'))return;e.preventDefault();stop();drag=true;svg.setPointerCapture(e.pointerId)});
svg.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();const p=svgPt(e);let a=Math.round(Math.atan2(-(p.y-CY),p.x-CX)*180/Math.PI);if(a<0)a+=360;if(th>300&&a<60)a=360;if(Math.abs(a-th)<120){th=a;max=Math.max(max,th);render()}});
svg.addEventListener('pointerup',()=>{drag=false});svg.addEventListener('pointercancel',()=>{drag=false});
document.getElementById('fs').onclick=()=>{fn='sin';render()};
document.getElementById('fc').onclick=()=>{fn='kos';render()};
document.getElementById('rs').onclick=()=>{stop();th=0;max=0;render()};
document.getElementById('play').onclick=()=>{if(timer){stop();render();return}if(th>=360){th=0;max=0}timer=setInterval(()=>{th=Math.min(360,th+3);max=Math.max(max,th);if(th>=360){stop();snd('menang')}render()},30);render()};
render();
''')

# (c) main a b c
write('main-abc.html','Main a, b, c','am','''<div class="stage"><svg id="sv" viewBox="0 0 820 400" role="img" aria-label="Graf y = a sin bx + c"></svg></div>
<div class="info" id="info"></div>
<div class="ctrl"><button class="chip on" id="f0">sin</button><button class="chip" id="f1">kos</button><button class="chip" id="f2">tan</button>
<label class="sl" style="color:#F472B6">a = <span id="va"></span><input type="range" id="ia" min="-4" max="4" step="0.5" value="2"></label>
<label class="sl" style="color:#38BDF8">b = <span id="vb"></span><input type="range" id="ib" min="0" max="4" step="1" value="2"></label>
<label class="sl" style="color:#A78BFA">c = <span id="vc"></span><input type="range" id="ic" min="-3" max="3" step="0.5" value="0"></label></div>
''','''
const BV=[0.5,1,2,3,4];let fn='sin';
const F={sin:S,kos:C,tan:d=>Math.tan(R(d))};
const L=60,Rr=800,T=20,B=380,Y0=-7,Y1=7,X=x=>L+x*(Rr-L-20)/360,Y=y=>B-(y-Y0)*(B-T)/(Y1-Y0);
const bs=b=>b===.5?'½':b===1?'':String(b);
function eq(a,b,c){let s=(a===1?'':a===-1?'−':fm(a)+' ')+fn+' '+bs(b)+'x';if(a===0)s='0';if(c)s+=(c>0?' + ':' − ')+Math.abs(c);return 'y = '+s}
function curve(f,col,w,dash){let d='',pen=false;for(let k=0;k<=720;k++){const x=k/2,y=f(x);if(!isFinite(y)||y<Y0-.5||y>Y1+.5){pen=false;continue}d+=(pen?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1);pen=true}return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash?' stroke-dasharray="7 6"':''}/>`}
function render(){
 const a=+document.getElementById('ia').value,b=BV[+document.getElementById('ib').value],c=+document.getElementById('ic').value;
 document.getElementById('va').textContent=fm(a);document.getElementById('vb').textContent=bs(b)||'1';document.getElementById('vc').textContent=fm(c);
 let s='';
 for(let y=Y0+1;y<Y1;y++){s+=`<line x1="${L}" y1="${Y(y)}" x2="${Rr}" y2="${Y(y)}" stroke="#1E2A40" stroke-width="1.2"/>`;if(y)s+=`<text x="${L-8}" y="${Y(y)}" fill="#64748B" font-size="13" font-weight="700" text-anchor="end" dominant-baseline="central">${fm(y)}</text>`}
 for(let x=45;x<=360;x+=45){s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${B}" stroke="#1E2A40" stroke-width="1.2"/>`;s+=`<text x="${X(x)}" y="${Y(0)+16}" fill="#64748B" font-size="13" font-weight="700" text-anchor="middle" dominant-baseline="central">${x}°</text>`}
 s+=`<line x1="${L}" y1="${Y(0)}" x2="${Rr}" y2="${Y(0)}" stroke="#94A3B8" stroke-width="2"/><line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#94A3B8" stroke-width="2"/>`;
 if(fn==='tan'){const K=180/b;for(let x=K/2;x<=360;x+=K)s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${B}" stroke="#F87171" stroke-width="2" stroke-dasharray="6 6"/>`}
 if(c)s+=`<line x1="${L}" y1="${Y(c)}" x2="${Rr}" y2="${Y(c)}" stroke="#A78BFA" stroke-width="2" stroke-dasharray="4 6"/>`;
 s+=curve(x=>F[fn](x),'#64748B',2.5,true);
 s+=curve(x=>a*F[fn](b*x)+c,'#FBBF24',4.5);
 s+=`<text x="${Rr-6}" y="${T+16}" fill="#FBBF24" font-size="22" font-weight="800" text-anchor="end" paint-order="stroke" stroke="#0E1626" stroke-width="6">${eq(a,b,c)}</text><text x="${Rr-6}" y="${T+42}" fill="#94A3B8" font-size="14" font-weight="700" text-anchor="end" paint-order="stroke" stroke="#0E1626" stroke-width="5">putus-putus: y = ${fn} x</text>`;
 svg.innerHTML=s;
 const K=(fn==='tan'?180:360)/b,A=Math.abs(a);
 const amp=fn==='tan'?'tiada (graf tan)':fm(A);
 const mm=fn==='tan'?'':`<span style="color:#34D399">maks = ${fm(A+c)}</span><span style="color:#F472B6">min = ${fm(-A+c)}</span>`;
 document.getElementById('info').innerHTML=`<div class="row"><span style="color:#F472B6">amplitud = ${amp}</span><span style="color:#38BDF8">kala = ${fm(K)}°</span>${mm}</div><div class="tip">a: amplitud |a| (a negatif → graf terbalik) · b: kala = ${fn==='tan'?'180°':'360°'} ÷ b · c: anjakan menegak.</div>`;
 ['sin','kos','tan'].forEach((f,i)=>document.getElementById('f'+i).classList.toggle('on',f===fn));
}
['ia','ib','ic'].forEach(id=>document.getElementById(id).addEventListener('input',render));
['sin','kos','tan'].forEach((f,i)=>document.getElementById('f'+i).onclick=()=>{fn=f;snd('ketik');render()});
render();
''')
print('ok')
