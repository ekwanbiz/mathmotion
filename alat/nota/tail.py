# ---------- nombor slaid ----------
for sb in SUBS:
    L = [x for x in OUT if x['sub'] == sb['no']]
    for i, x in enumerate(L, 1):
        x['n'], x['N'] = i, len(L)
ORDER = ['sub', 'n', 'N', 'kicker', 'title', 'body', 'fig', 'full']
OUT2 = [{k: x[k] for k in ORDER} for x in OUT]
js = ('' + HEAD + '\nwindow.SUBS=' + json.dumps(SUBS, ensure_ascii=False)
      + ';\nwindow.SLIDES=' + json.dumps(OUT2, ensure_ascii=False) + ';\n')
open(OUTFILE, 'w').write(js)
print(len(OUT2), 'slaid;', {sb['no']: sum(1 for x in OUT2 if x['sub'] == sb['no']) for sb in SUBS})
