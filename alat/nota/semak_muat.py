import sys, json
from playwright.sync_api import sync_playwright
subs=json.loads(sys.argv[1]); F=sys.argv[2] if len(sys.argv)>2 else 'isomovebt'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome');pg=b.new_page(viewport={'width':1366,'height':768})
    pg.goto('http://localhost:8765/'+F+'/');pg.evaluate("localStorage.setItem('mathmotion-mode','gelap')")
    for sub,N in subs:
        for n in range(1,N+1):
            pg.goto(f'http://localhost:8765/{F}/#/nota/{sub}/{n}');pg.reload();pg.wait_for_timeout(400)
            pg.add_style_tag(content='.rv.hid,g.rv.hid{visibility:visible!important}');pg.wait_for_timeout(100)
            o=pg.evaluate("""(()=>{let m=0;document.querySelectorAll('*').forEach(e=>{const s=getComputedStyle(e);if(/(auto|scroll|hidden)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+2&&e.clientHeight>200)m=Math.max(m,e.scrollHeight-e.clientHeight)});return m})()""")
            if o: print(sub,n,'lebih',o,'px')
    b.close()
