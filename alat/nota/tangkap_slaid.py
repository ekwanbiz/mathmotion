import os
import sys, json
from playwright.sync_api import sync_playwright
folder, tag = sys.argv[1], sys.argv[2]
subs = json.loads(sys.argv[3])
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/google-chrome')
    c=b.new_context(viewport={'width':1366,'height':768});pg=c.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(f'http://localhost:8765/{folder}/');pg.evaluate("localStorage.setItem('mathmotion-mode','gelap');localStorage.setItem('terokamath-peranan','guru');localStorage.setItem('terokamath-lang','"+os.environ.get('TMLANG','ms')+"')")
    for sub,N in subs:
        for n in range(1,N+1):
            pg.goto(f'http://localhost:8765/{folder}/#/nota/{sub}/{n}');pg.reload();pg.wait_for_timeout(500)
            pg.add_style_tag(content='.rv.hid,g.rv.hid{visibility:visible!important}')
            pg.wait_for_timeout(150)
            ov=pg.evaluate("(()=>{const m=document.getElementById('main');return m?m.scrollHeight-m.clientHeight:0})()")
            pg.screenshot(path=f'{tag}_{sub}_{n:02d}.png')
            if ov>2: print('OVERFLOW',sub,n,ov)
    print('errors',errs)
    b.close()
