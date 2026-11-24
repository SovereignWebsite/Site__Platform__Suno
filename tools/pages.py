# Generates the song pages, /budget/, /playlist/ and the agent area page. Run: python3 tools/pages.py
import os,json
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'designs.py')).read()
exec(src[:src.index('# 1 CRATE')])
CSS=''':root{--bg:#fbfaf7;--fg:#1d1d1b;--muted:#55544f;--accent:#2f6b4f;--line:#e4e1d8;--card:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#141513;--fg:#ecebe6;--muted:#b4b2aa;--accent:#7fc3a0;--line:#2c2d29;--card:#1b1c1a}}
body{background:var(--bg)!important;color:var(--fg)!important;font:17px/1.6 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:48rem;margin:0 auto;padding:1.5rem 1rem 3rem}a{color:var(--accent)}
.crumbs{font-size:.9rem;display:flex;flex-wrap:wrap;gap:.3rem 1rem}.unofficial,.small{font-size:.88rem;color:var(--muted)}
.draft{font:600 13px/1.5 system-ui,sans-serif;margin:.2rem 0 .8rem}
h1{font-size:clamp(1.8rem,6vw,2.6rem);line-height:1.1;margin:.2rem 0 .5rem}h2{font-size:1.3rem;margin:2rem 0 .5rem;border-top:1px solid var(--line);padding-top:1rem}h3{font-size:1.05rem;margin:.6rem 0 .3rem}
button{font:inherit;font-size:.9rem;padding:.3rem .8rem;border-radius:6px;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;min-height:36px}
button[aria-pressed="true"],button[aria-current="true"]{background:var(--accent);color:var(--bg)}button[disabled]{opacity:.7;cursor:default}
.row{display:flex;flex-wrap:wrap;gap:.5rem .9rem;align-items:center;margin:.5rem 0}
.sitefoot{color:var(--fg)}
'''
def page2(path,title,desc,css,body,script):
    import html as _h; desc=_h.escape(desc,quote=True); title=_h.escape(title)
    url=f'{HOST}/{path}/'
    d=f'{R}/{path}'; os.makedirs(d,exist_ok=True)
    full=f'{title} · Suno, our songs (unofficial)'
    head=f'''<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Suno, our songs (unofficial)">
<meta property="og:locale" content="en_GB">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{HOST}/assets/share/card-1200x630.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Suno, our songs (unofficial)">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{full}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{HOST}/assets/share/card-1200x630.jpg">
<link rel="canonical" href="{url}">
<style>
{BASE}{CSS}{css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''
    foot='''<footer class="sitefoot">
<nav aria-label="About this site"><a href="/">Home</a><a href="/playlist/">Playlist</a><a href="/budget/">Budget</a><a href="/designs/">All designs</a><a href="/admin/">How this site was made</a><a href="/policy/">How this site is governed</a></nav>
Unofficial: not affiliated with Suno. A sovereign website, made with the <a href="https://sovereignwebsite.org/">open pattern</a>. Source: <a href="https://github.com/SovereignWebsite/Site__Platform__Suno">github.com/SovereignWebsite/Site__Platform__Suno</a>.
</footer>
<script type="module" src="'''+script+'''"></script>
</body>
</html>
'''
    open(f'{d}/index.html','w').write(head+body+foot)
TOP='''<nav class="crumbs" aria-label="Pages"><a href="/">All songs</a><a href="/playlist/">Playlist</a><a href="/budget/">Budget</a></nav>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz.</p>
'''
SONGCSS='''.hero{display:grid;grid-template-columns:160px minmax(0,1fr);gap:1.2rem;align-items:start;margin-top:1rem}.hero img{width:160px;height:160px;object-fit:cover;border-radius:10px}
.stageline{font-weight:600;font-size:.9rem;margin:.2rem 0}.ladder{display:flex;flex-wrap:wrap;gap:.25rem;list-style:none;padding:0;margin:.3rem 0;font-size:.78rem}
.ladder li{margin:0;padding:.1rem .5rem;border-radius:999px;border:1px solid var(--line);color:var(--muted)}.ladder .done{border-color:var(--accent);color:var(--accent)}.ladder .now{background:var(--accent);border-color:var(--accent);color:var(--bg);font-weight:600}
.takes{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}.take{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:.8rem}.take p{margin:.2rem 0 .4rem}
.tl{position:relative;height:30px;border-radius:6px;background:var(--line);overflow:hidden;margin:.4rem 0}
.seg{position:absolute;top:0;bottom:0;font-size:10px;line-height:30px;padding-left:4px;overflow:hidden;white-space:nowrap;color:#111;border-right:2px solid var(--bg)}
.s0{background:#cfe3d6}.s1{background:#e8d9b4}.s2{background:#d6d3ea}.s3{background:#ead0cc}
.stop{position:absolute;top:0;bottom:0;width:3px;background:#b3261e}.stops{font-size:.85rem;color:var(--muted);margin:.2rem 0;padding-left:1.1rem}
.slot iframe{margin-top:.6rem}.abnote{font-size:.9rem;margin:.6rem 0 0}
blockquote{margin:.5rem 0;padding:.4rem .9rem;border-left:3px solid var(--accent);font-style:italic}
.prompt{display:grid;grid-template-columns:9rem minmax(0,1fr);gap:.3rem .8rem;margin:.6rem 0}.prompt dt{font-weight:600;font-size:.9rem}.prompt dd{margin:0}.prompt code{font-size:.88rem;white-space:pre-wrap;overflow-wrap:anywhere}
pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:.8rem 1rem;font-size:.9rem}
.versions li{margin:.5rem 0}textarea{width:100%;font:inherit;padding:.5rem;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--fg);margin-top:.3rem}
@media (max-width:40rem){.hero{grid-template-columns:96px minmax(0,1fr)}.hero img{width:96px;height:96px}.takes{grid-template-columns:1fr}.prompt{grid-template-columns:1fr}}
'''
d=json.load(open(f'{R}/data/songs.json'))
for s in d['songs']:
    page2(f"songs/{s['slug']}",s['title'],f"{s['title']}: the brief, the prompt, how each take turned out, the versions and what it cost. "+s['about'].replace('"',"'"),SONGCSS,
          f'<main id="main" data-slug="{s["slug"]}">\n'+TOP+'<div id="song"><p>Loading the song.</p></div>\n</main>\n','/songs/song.js')
page2('budget','Budget','The Suno credits behind these songs: the monthly allowance, what has been used, what is left, and every spend.',
'''.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.8rem;margin:1rem 0}.tile{border:1px solid var(--line);background:var(--card);border-radius:10px;padding:.8rem}.tile b{display:block;font-size:1.8rem;line-height:1.1}.tile span{font-size:.88rem;color:var(--muted)}
.meter{height:14px;background:var(--line);border-radius:7px;overflow:hidden}.meter span{display:block;height:100%;background:var(--accent)}
table{width:100%;border-collapse:collapse;font-size:.9rem;margin:.5rem 0}th,td{text-align:left;padding:.4rem;border-bottom:1px solid var(--line);vertical-align:top}
''','<main id="main">\n'+TOP+'<h1>Budget</h1>\n<p>Songs cost Suno credits: 10 for each generation (two takes), measured on this account. Full-quality downloads, needed before a song can be released, are the scarce part.</p>\n<div id="budget"><p>Loading.</p></div>\n</main>\n','/budget/budget.js')
page2('playlist','Playlist','Every song in one playlist with one Suno player: play from the top, next, previous and shuffle.',
'''.controls{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:1rem 0}.controls select{font:inherit;font-size:.9rem;padding:.3rem;background:var(--card);color:var(--fg);border:1px solid var(--line);border-radius:6px}
.now{font-weight:600}.tracks{list-style:none;padding:0;margin:1rem 0}.tracks li{margin:.3rem 0}
.track{display:grid;grid-template-columns:40px minmax(0,1fr) 3.5rem;gap:.8rem;align-items:center;width:100%;text-align:left;border-color:var(--line);color:var(--fg)}.track img{width:40px;height:40px;object-fit:cover;border-radius:4px}.track .len{text-align:right;font-variant-numeric:tabular-nums}
.track[aria-current="true"]{border-color:var(--accent);background:var(--card);color:var(--fg);outline:2px solid var(--accent)}
''','<main id="main">\n'+TOP+'<h1>Playlist</h1>\n<p>All our songs with one player. Suno\'s player cannot tell this page when a song ends, so press Next to move on. Shuffle plays them in a new order.</p>\n<p class="small">A real mix (cross-fades, songs layered over each other) needs the audio files themselves; that takes full-quality downloads or stems from Suno, which cost download credits, so it waits for your yes.</p>\n<div id="pl"><p>Loading.</p></div>\n</main>\n','/playlist/playlist.js')
page2('factory/dinis-cruz/account-b','suno.b, agent area','suno.b keeps this site: its role, what it has learnt, the decisions it acted on, its open work and how to restart it.','ul.files li{margin:.3rem 0}',
'<main id="main">\n'+TOP+'<h1>suno.b</h1>\n<p>The agent that keeps this site and makes its songs with Suno, for Dinis Cruz (account B). Everything it knows that a restart would need is here.</p>\n<ul class="files">\n<li><a href="agent.json">agent.json</a>: role, session, key, active until, open work</li>\n<li><a href="now.md">now.md</a>: what is happening and what is open</li>\n<li><a href="role.md">role.md</a></li>\n<li><a href="learnings.md">learnings.md</a></li>\n<li><a href="decisions.md">decisions.md</a>: the records it acted on</li>\n<li><a href="messages.md">messages.md</a>: links and ids only</li>\n<li><a href="START.md">START.md</a>: how a fresh session picks up</li>\n<li><a href="/keys/suno-b.json">its public key</a></li>\n<li><a href="/decisions/requests/2026-11-24__suno-lane.json">its open decision request</a></li>\n</ul>\n</main>\n','/assets/suno-lib.js')
print('pages done')
