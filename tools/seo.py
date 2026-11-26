#!/usr/bin/env python3
"""TerokaMath · SEO: jana tag kepala (canonical, Open Graph, JSON-LD), teks statik untuk Google
dalam <div id="app"> (diganti oleh app sebaik JavaScript berjalan), sitemap.xml dan robots.txt.
Jalankan semula selepas tambah/ubah bab:  node tools/seo-meta.js > /tmp/meta.json && python3 tools/seo.py /tmp/meta.json"""
import json, sys, re, html, datetime, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://terokamath.com/'
OGIMG = SITE + 'icons/og.png'
E = lambda s: html.escape(str(s), quote=True)
J = lambda o: json.dumps(o, ensure_ascii=False).replace('</', '<\\/')
SEO_HEAD = re.compile(r'\n?<!--seo-->.*?<!--/seo-->', re.S)


def head_block(title, desc, url, ld):
    return ('\n<!--seo-->\n'
            f'<link rel="canonical" href="{url}">\n'
            '<meta property="og:type" content="website">\n<meta property="og:site_name" content="TerokaMath">\n<meta property="og:locale" content="ms_MY">\n'
            f'<meta property="og:title" content="{E(title)}">\n<meta property="og:description" content="{E(desc)}">\n'
            f'<meta property="og:url" content="{url}">\n<meta property="og:image" content="{OGIMG}">\n'
            '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
            '<meta name="twitter:card" content="summary_large_image">\n'
            f'<script type="application/ld+json">{J(ld)}</script>\n<!--/seo-->')


def patch(path, title, desc, url, ld, body):
    s = open(path, encoding='utf-8').read()
    s = SEO_HEAD.sub('', s)
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{E(desc)}">', s, count=1)
    i = s.index('<link rel="manifest"')
    s = s[:i].rstrip('\n') + head_block(title, desc, url, ld) + '\n' + s[i:]
    app = f'<div id="app"><!--seo--><main class="seo" style="max-width:880px;margin:32px auto;padding:0 20px;font-family:system-ui,sans-serif;line-height:1.6">{body}</main><!--/seo--></div>'
    s2 = re.sub(r'<div id="app">(?:<!--seo-->.*?<!--/seo-->)?</div>', lambda m: app, s, count=1, flags=re.S)
    assert s2 != s or app in s, path
    open(path, 'w', encoding='utf-8').write(s2)


def main(meta_path):
    M = json.load(open(meta_path, encoding='utf-8'))
    chs = sorted(M.items(), key=lambda kv: (kv[1]['ting'], kv[1]['no']))
    for cid, m in chs:
        t, n, tj = m['ting'], m['no'], m['tajuk']
        url = f'{SITE}{cid}/'
        subs = m['subs']; sims = m['sims']; d = m.get('desc') or {}
        title = f'Bab {n} {tj} · Matematik Tingkatan {t} · TerokaMath'
        desc = (f'Matematik Tingkatan {t} Bab {n} {tj} (KSSM): nota slaid, simulasi interaktif, latihan dan permainan kelas. '
                f'Subtopik: {", ".join(s[1] for s in subs)}.')
        if len(desc) > 300: desc = desc[:297].rsplit(' ', 1)[0] + '…'
        ld = {'@context': 'https://schema.org', '@type': 'LearningResource', 'name': f'Bab {n} {tj} – Matematik Tingkatan {t}',
              'description': desc, 'url': url, 'inLanguage': 'ms', 'isAccessibleForFree': True, 'educationalLevel': f'Tingkatan {t}',
              'learningResourceType': ['Nota slaid', 'Simulasi interaktif', 'Latihan', 'Permainan kelas'],
              'teaches': [s[1] for s in subs],
              'educationalAlignment': {'@type': 'AlignmentObject', 'alignmentType': 'educationalSubject', 'educationalFramework': 'KSSM', 'targetName': 'Matematik'},
              'image': OGIMG, 'isPartOf': {'@type': 'WebSite', 'name': 'TerokaMath', 'url': SITE}}
        li = ''.join(f'<li><b>{E(s[0])} {E(s[1])}</b>{" – " + E(d[s[0]]) if d.get(s[0]) else ""}</li>' for s in subs)
        body = (f'<p><a href="/">TerokaMath</a> › Tingkatan {t}</p><h1>Bab {n} {E(tj)} – Matematik Tingkatan {t}</h1>'
                f'<p>Bahan mengajar dan belajar Matematik KSSM Tingkatan {t} bagi Bab {n} {E(tj)}: nota dalam bentuk slaid, '
                f'simulasi interaktif{" (" + E(", ".join(sims)) + ")" if sims else ""}, latihan mengikut aras mudah, sederhana dan sukar, '
                'lembaran kerja, kuiz online serta permainan kelas. Guru boleh susun Pelan Mengajar dan jana RPH.</p>'
                f'<h2>Subtopik</h2><ul>{li}</ul><p><a href="/">Lihat semua bab Matematik Tingkatan 1 hingga 5</a></p>')
        patch(os.path.join(ROOT, cid, 'index.html'), title, desc, url, ld, body)

    # halaman utama
    groups = ''
    for t in range(1, 6):
        items = [(cid, m) for cid, m in chs if m['ting'] == t]
        if not items: continue
        groups += f'<h2>Matematik Tingkatan {t}</h2><ul>' + ''.join(f'<li><a href="/{cid}/">Bab {m["no"]} {E(m["tajuk"])}</a></li>' for cid, m in items) + '</ul>'
    hdesc = ('TerokaMath: simulasi Matematik KSSM Tingkatan 1 hingga 5 untuk guru dan murid. Nota slaid, simulasi interaktif, '
             'latihan, kuiz online, permainan kelas, Pelan Mengajar dan RPH bagi setiap bab. Percuma.')
    hld = {'@context': 'https://schema.org', '@type': 'WebSite', 'name': 'TerokaMath', 'url': SITE, 'inLanguage': 'ms', 'description': hdesc,
           'image': OGIMG, 'audience': {'@type': 'EducationalAudience', 'educationalRole': ['teacher', 'student']}}
    hbody = ('<h1>TerokaMath – Simulasi Matematik KSSM Tingkatan 1 hingga 5</h1><p>Teroka. Faham. Kuasai. ' + E(hdesc) + '</p>'
             + groups + '<p><a href="/bank/">Bank Soalan Matematik Tingkatan 1–3 (UASA)</a> · <a href="/game/">Game Matematik TerokaMath</a></p>')
    patch(os.path.join(ROOT, 'index.html'), 'TerokaMath – Simulasi Matematik KSSM Tingkatan 1 hingga 5', hdesc, SITE, hld, hbody)

    today = datetime.date.today().isoformat()
    urls = [SITE] + [f'{SITE}{cid}/' for cid, _ in chs] + [f'{SITE}bank/', f'{SITE}game/']
    open(os.path.join(ROOT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + ''.join(f'  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls) + '</urlset>\n')
    open(os.path.join(ROOT, 'robots.txt'), 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n')
    print(len(urls), 'URL dalam sitemap')


if __name__ == '__main__':
    main(sys.argv[1])
