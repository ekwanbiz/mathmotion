const fs=require('fs'),vm=require('vm');
const out={};
for(const d of fs.readdirSync('.')){
  if(!fs.existsSync(d+'/bab.js')||!fs.existsSync(d+'/index.html'))continue;
  const stub=new Proxy({},{has:()=>true,get:(t,k)=>k in t?t[k]:(k==='window'?ctx:(k===Symbol.unscopables?undefined:(typeof globalThis[k]!=='undefined'?globalThis[k]:function(){return ''}))),set:(t,k,v)=>{t[k]=v;return true}});
  var ctx=vm.createContext({window:{},document:{},console});
  ctx.window=ctx;
  let r={};
  try{
    const code=fs.readFileSync(d+'/bab.js','utf8')+"\n;this.__r={BAB,SUBDESC:typeof SUBDESC!=='undefined'?SUBDESC:{},SIMLIST:typeof SIMLIST!=='undefined'?SIMLIST:[]};";
    vm.runInContext(code,ctx); r=ctx.__r;
  }catch(e){r.err='bab:'+e.message}
  const sl=fs.readFileSync(d+'/slides.js','utf8').match(/window\.SUBS\s*=\s*(\[[^\n]*?\]);/);
  r.SUBS=sl?JSON.parse(sl[1]):null;
  out[d]={ting:r.BAB&&r.BAB.ting,no:r.BAB&&r.BAB.no,tajuk:r.BAB&&r.BAB.tajuk,desc:r.SUBDESC,sims:(r.SIMLIST||[]).map(s=>s[1]),subs:(r.SUBS||[]).map(s=>[s.no,s.name]),err:r.err};
}
process.stdout.write(JSON.stringify(out));
