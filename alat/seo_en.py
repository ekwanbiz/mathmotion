"""SEO carian English: tambah nama English (DLP) pada halaman bab yang ada versi English (bab_en.js)
dan pada halaman utama. Selamat dijalankan berulang kali. Jalankan dari akar repo: python3 alat/seo_en.py"""
import re, glob, os, json
MK = 'English (DLP):'
home_items = []
for bj in sorted(glob.glob('*/bab_en.js')):
    d = os.path.dirname(bj); js = open(bj).read()
    t = re.search(r"ting:\s*(\d)", js).group(1); n = re.search(r"no:\s*(\d+)", js).group(1); x = re.search(r"tajuk:\s*'([^']+)'", js).group(1)
    home_items.append((int(t), int(n), d, x))
    p = f'{d}/index.html'; s = open(p).read()
    if MK in s: continue
    en = f' {MK} Form {t} Maths Chapter {n} {x}: notes, slides, exercises, quizzes and games.'
    s = re.sub(r'(<meta name="description" content="[^"]*?)(">)', lambda m: m.group(1) + en + m.group(2), s, count=1)
    s = re.sub(r'(<meta property="og:description" content="[^"]*?)(">)', lambda m: m.group(1) + en + m.group(2), s, count=1)
    def fix(m):
        o = json.loads(m.group(1))
        o['alternateName'] = f'Form {t} Maths Chapter {n} {x} – Notes & Slides'
        o['inLanguage'] = ['ms', 'en']
        o['keywords'] = o.get('keywords', '') + f', form {t} maths notes, form {t} maths slides, {x.lower()}, maths exercises, maths games, DLP'
        return '<script type="application/ld+json">' + json.dumps(o, ensure_ascii=False) + '</script>'
    s = re.sub(r'<script type="application/ld\+json">(.*?)</script>', fix, s, count=1, flags=re.S)
    s = s.replace('</main><!--/seo-->', f'<p lang="en">{MK} Form {t} Mathematics Chapter {n} {x}. Notes in slide form, interactive simulations, exercises, worksheets, online quizzes and classroom games, following the KSSM DLP English textbook.</p></main><!--/seo-->', 1)
    open(p, 'w').write(s); print('ok', d)
# halaman utama
p = 'index.html'; s = open(p).read()
if MK not in s:
    en = f' {MK} Form 3 maths notes, slides and games in English.'
    s = re.sub(r'(<meta name="description" content="[^"]*?)(">)', lambda m: m.group(1) + en + m.group(2), s, count=1)
    li = ''.join(f'<li><a href="/{d}/">Form {t} Chapter {n} {x}</a></li>' for t, n, d, x in sorted(home_items))
    s = s.replace('<p><a href="/bank/">', f'<h2 lang="en">Form 3 Mathematics in English (DLP)</h2><ul lang="en">{li}</ul><p><a href="/bank/">', 1)
    open(p, 'w').write(s); print('ok home')
