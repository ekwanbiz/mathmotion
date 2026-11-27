"""Pembantu terjemah simulasi: jalankan(folder, T, extra_common=[]). Gagal jika teks tidak dijumpai."""
COMMON = [('<html lang="ms"', '<html lang="en"'), ('&#8592; Kembali', '&#8592; Back'), ('aria-label="Mod"', 'aria-label="Mode"'),
          ("' berturut-turut'", "' in a row'"), ("✓ Betul!", "✓ Correct!"), ('Seterusnya ▶', 'Next ▶'), ("Skor: ${S.score}/${S.tot}", "Score: ${S.score}/${S.tot}"),
          ("'<span class=\"no\">✗ Jawapan: '", "'<span class=\"no\">✗ Answer: '"), ('❓ Cabaran', '❓ Challenge'), ('</i>Cabaran</button>', '</i>Challenge</button>'),
          ('>Kedudukan rawak</button>', '>Random position</button>'), ('>Langkau</button>', '>Skip</button>'), ('>Mula semula skor</button>', '>Reset score</button>'),
          ('O ialah pusat bulatan. ', 'O is the centre of the circle. ')]
def jalankan(folder, T, extra=()):
    for sid, pairs in T.items():
        p = f'{folder}/simulasi/{sid}.html'
        s = open(p).read()
        for a, b in list(COMMON) + list(extra) + list(pairs):
            if a not in s:
                if (a, b) in COMMON or (a, b) in extra: continue
                raise SystemExit(f'{sid}: tak jumpa {a!r}')
            s = s.replace(a, b)
        open(p.replace('.html', '_en.html'), 'w').write(s)
        print('ok', sid)
