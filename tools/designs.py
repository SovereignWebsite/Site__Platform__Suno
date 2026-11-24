# Generates /designs/ and the five designs (HTML and app.js). Run: python3 tools/designs.py
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','site')
HOST='https://suno.platform.sovereignweb.site'
CSP="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn1.suno.ai https://cdn2.suno.ai; frame-src https://suno.com; connect-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'"
UNOFF='Unofficial: not made, run or endorsed by Suno, and not affiliated with Suno. Songs by Dinis Cruz and his team of AI agents. Covers are loaded from Suno; pressing Play loads Suno\'s player, which runs Suno\'s code.'
BASE='''*{box-sizing:border-box}body{margin:0}.skip{position:absolute;left:-999px}.skip:focus{left:1rem;top:1rem;z-index:9}
iframe{width:100%;height:240px;border:0;border-radius:6px;display:block}
.abbar{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.4rem 0}.abswitch{font:600 13px system-ui,sans-serif;padding:.3rem .7rem;border:2px solid currentColor;background:transparent;color:inherit;border-radius:6px;cursor:pointer;min-height:34px}.abswitch[aria-pressed="true"]{outline:3px solid currentColor;outline-offset:1px}.abnote{font:13px system-ui,sans-serif;margin:.2rem 0}
.draft{font:600 13px/1.5 system-ui,sans-serif;margin:.2rem 0 .8rem}
.sitefoot{font:15px/1.6 system-ui,sans-serif;max-width:60rem;margin:3rem auto 0;padding:1rem;border-top:1px solid rgba(127,127,127,.35)}
.sitefoot nav{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;margin-bottom:.5rem}.sitefoot a{color:inherit;font-weight:600;overflow-wrap:anywhere}
'''
def page(slug,title,desc,css,body,script=True,bg='#fff',fg='#111'):
    url=f'{HOST}/designs/{slug}/' if slug else f'{HOST}/designs/'
    d=f'{R}/designs/{slug}' if slug else f'{R}/designs'
    os.makedirs(d,exist_ok=True)
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
body{{background:{bg};color:{fg}}}
{BASE}{css}</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''
    foot=f'''<footer class="sitefoot">
<nav aria-label="About this site"><a href="/">Home</a><a href="/designs/">All designs</a><a href="/admin/">How this site was made</a><a href="/policy/">How this site is governed</a></nav>
Unofficial: not affiliated with Suno. A sovereign website, made with the <a href="https://sovereignwebsite.org/">open pattern</a>. Source: <a href="https://github.com/SovereignWebsite/Site__Platform__Suno">github.com/SovereignWebsite/Site__Platform__Suno</a>.
</footer>
'''+('<script type="module" src="app.js"></script>\n' if script else '')+'</body>\n</html>\n'
    open(f'{d}/index.html','w').write(head+body+foot)

# 1 CRATE
page('crate','Record crate','Our Suno songs as a record crate: each song a divider, each version a sleeve, takes A and B as the two sides. Unofficial.',
'''body{font:16px/1.5 Georgia,serif}
main{max-width:60rem;margin:0 auto;padding:1.5rem 1rem}
h1{font:700 clamp(1.8rem,5vw,2.8rem)/1.1 Georgia,serif;margin:.2rem 0}.unofficial{font:14px/1.5 system-ui,sans-serif;color:#5b4632;margin:.4rem 0 1rem}
.kicker{font:600 .8rem system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7a4b1f}
.crate{background:#6b4423;border-radius:10px;padding:1rem;margin:1.2rem 0;box-shadow:inset 0 -10px 0 #4e3018}
.divider{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;background:#f3e3c3;border-radius:6px 6px 0 0;padding:.5rem .8rem}
.divider h2{margin:0;font-size:1.3rem;color:#2b1a0b}
.ladder{display:flex;flex-wrap:wrap;gap:.2rem;list-style:none;margin:0;padding:0;font:12px system-ui,sans-serif}
.ladder li{padding:.05rem .5rem;border-radius:3px;background:#e8d3ab;color:#5b4632}.ladder .done{background:#c99b5a;color:#2b1a0b}.ladder .now{background:#2b1a0b;color:#f3e3c3;font-weight:700}
.sleeves{display:flex;gap:.4rem;overflow-x:auto;padding:.8rem .2rem;scroll-snap-type:x mandatory}
.sleeve{flex:0 0 auto;scroll-snap-align:start;border:0;padding:0;background:none;cursor:pointer;border-radius:4px;outline-offset:3px}
.sleeve img{display:block;width:96px;height:96px;object-fit:cover;border-radius:4px;box-shadow:0 3px 8px rgba(0,0,0,.45);transform:translateY(6px);transition:transform .15s}
.sleeve[aria-pressed="true"] img,.sleeve:hover img{transform:translateY(-6px)}
.sleeve span{display:block;font:600 11px system-ui,sans-serif;color:#f3e3c3;text-align:center;margin-top:.5rem}
.pulled{background:#fbf5e8;border-radius:6px;padding:.8rem;display:grid;grid-template-columns:140px 1fr;gap:1rem;color:#2b1a0b}
.pulled img{width:140px;height:140px;object-fit:cover;border-radius:4px}
.pulled h3{margin:0 0 .2rem}.pulled p{margin:0 0 .5rem;font:14px/1.5 system-ui,sans-serif;color:#5b4632}
.sides{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.side{border:1px solid #d9c39b;border-radius:6px;padding:.5rem;font:14px system-ui,sans-serif}
.pulled button{font:600 14px system-ui,sans-serif;background:#2b1a0b;color:#fbf5e8;border:0;border-radius:4px;padding:.35rem .8rem;cursor:pointer;min-height:32px;margin-top:.3rem}
.pulled button[aria-pressed="true"]{outline:3px solid #c99b5a}.stageline{font:600 12px system-ui,sans-serif;color:#2b1a0b}
@media (prefers-color-scheme:dark){body{background:#17110b!important;color:#f3e3c3!important}.unofficial,.kicker{color:#e0c9a0!important}.draft{color:#f3e3c3}.crate{background:#3b2512;box-shadow:inset 0 -10px 0 #26170a,0 0 60px rgba(255,190,110,.12)}.sitefoot a{color:#f3e3c3}}.cmpbox{grid-column:1/-1;display:grid;grid-template-columns:1fr;gap:.6rem}
@media (max-width:40rem){.pulled{grid-template-columns:90px 1fr}.pulled img{width:90px;height:90px}.sides,.cmpbox{grid-template-columns:1fr}}
''','''<main id="main">
<div class="kicker">Record crate</div>
<h1>Our songs, in the crate</h1>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p>Each divider is a song, with how far along it is. Flip through its sleeves (one per version, oldest first), pull one out, and drop the needle on side A or B: one player, so B replaces A.</p>
<div id="crates"></div>
</main>
''',bg='#f6efe2',fg='#2b1a0b')
open(f'{R}/designs/crate/app.js','w').write('''import { load, el, ladder, stageLine, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), box = document.getElementById('crates');
for (const s of d.byMaturity) {
  const pulled = el('div', { className: 'pulled' });
  const pull = (v, btn) => {
    sleeves.querySelectorAll('.sleeve').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    const cmp = el('div', { className: 'cmpbox', hidden: true });
    pulled.replaceChildren(
      el('img', { src: v.takes[0].cover, alt: '', width: 140, height: 140 }),
      el('div', {}, [el('h3', { textContent: `Version ${v.n}: ${v.label}` }), el('p', { textContent: `${day(v.made)}, ${time(v.made)} UTC · ${v.model}${v.style ? ' · ' + v.style : ''}` }), compareButton(v, s.title, cmp)]),
      el('div', { className: 'sides' }, v.takes.map((t, i) => el('div', { className: 'side' }, [el('b', { textContent: `Side ${'AB'[i]} · ${mmss(t.duration_s)} ` }), playButton(t, `${s.title}, version ${v.n}, side ${'AB'[i]}`, cmp, `Drop the needle on ${'AB'[i]}`)]))),
      cmp);
  };
  const sleeves = el('div', { className: 'sleeves', role: 'group', 'aria-label': `${s.title}: versions` }, s.versions.map((v) => {
    const b = el('button', { type: 'button', className: 'sleeve', 'aria-pressed': 'false', 'aria-label': `${s.title}, version ${v.n}: ${v.label}` }, [el('img', { src: v.takes[0].cover, alt: '', width: 96, height: 96, loading: 'lazy' }), el('span', { textContent: `v${v.n}` })]);
    b.addEventListener('click', () => pull(v, b)); return b; }));
  box.append(el('section', { className: 'crate', 'aria-label': s.title }, [el('div', { className: 'divider' }, [el('h2', { textContent: s.title }), ladder(s, d.stages), el('span', { className: 'stageline', textContent: stageLine(s, d.stages) })]), sleeves, pulled]));
  pull(s.versions[s.versions.length - 1], sleeves.lastElementChild);
}
''')

# 2 POSTER
page('poster','Gig poster','Our Suno songs as one gig poster: the most mature song headlines, versions are the tour dates. Unofficial.',
'''body{font:16px/1.4 system-ui,sans-serif}
main{max-width:46rem;margin:1.5rem auto;padding:1.5rem 1.2rem;background:#f2e8d0;color:#1a1a1a;border:6px solid #1a1a1a;box-shadow:10px 10px 0 #c8302b}
.top{font:800 .85rem/1 system-ui,sans-serif;letter-spacing:.3em;text-transform:uppercase;text-align:center;color:#9e1f1a}
h1{font:900 clamp(2.4rem,11vw,5.2rem)/.9 Impact,"Arial Narrow Bold","Helvetica Neue",sans-serif;text-transform:uppercase;text-align:center;margin:.3rem 0;letter-spacing:.01em}
.unofficial{text-align:center;font-size:13px;margin:.3rem 0 1rem}.lede{text-align:center;font-weight:600}
.bill{list-style:none;padding:0;margin:1rem 0;text-align:center}
.bill>li{border-top:3px solid #1a1a1a;padding:1rem 0}
.slot{font:800 .8rem system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#9e1f1a}
.act{font:900 clamp(1.6rem,7vw,3rem)/1 Impact,"Arial Narrow Bold",sans-serif;text-transform:uppercase;margin:.2rem 0}
.bill>li:not(:first-child) .act{font-size:clamp(1.3rem,5vw,2rem)}
.ladder{display:flex;justify-content:center;flex-wrap:wrap;gap:.3rem;list-style:none;padding:0;margin:.4rem 0;font:700 11px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em}
.ladder li{padding:.1rem .45rem;border:2px dashed #5a554c;color:#5a554c}.ladder .done{border-style:solid;border-color:#1a1a1a;color:#1a1a1a}.ladder .now{border-style:solid;background:#1a1a1a;color:#f2e8d0}
.dates{list-style:none;padding:0;margin:.6rem auto 0;max-width:30rem;text-align:left;font-size:14px}
.dates li{display:flex;flex-wrap:wrap;gap:.2rem .6rem;align-items:center;padding:.3rem 0;border-bottom:1px dashed #1a1a1a}
.dates .when{font-weight:800;min-width:6.5rem}.dates .what{flex:1 1 10rem}
button{font:800 12px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;background:#1a1a1a;color:#f2e8d0;border:0;padding:.35rem .6rem;cursor:pointer;min-height:32px}
button[disabled]{opacity:.6}.stage{display:grid;grid-template-columns:1fr;gap:.6rem;margin:.6rem 0}.stage[hidden]{display:none}
.played{flex-basis:100%}button[aria-pressed="true"]{background:#9e1f1a}
@media (prefers-color-scheme:dark){main{background:#141414;color:#f2e8d0;border-color:#f2e8d0;box-shadow:10px 10px 0 #9e1f1a}.top,.slot{color:#ff8a7a!important}.ladder li{border-color:#a9a294!important;color:#d8d0bf!important}.ladder .now{background:#f2e8d0!important;color:#141414!important}.dates li{border-color:#f2e8d0}button{background:#f2e8d0;color:#141414}}
@media (max-width:40rem){.stage{grid-template-columns:1fr}}
''','''<main id="main">
<div class="top">Live on this page</div>
<h1>Our Songs</h1>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p class="lede">Top of the bill: the song furthest along, and on a tie the newest. Each version is a tour date; load take A or B, one at a time.</p>
<ol class="bill" id="bill"></ol>
</main>
''',bg='#2a2a2a',fg='#f2e8d0')
open(f'{R}/designs/poster/app.js','w').write('''import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), bill = document.getElementById('bill');
const slots = ['Headliner', 'Special guest', 'Opening act'];
d.byMaturity.forEach((s, i) => {
  const stage = el('div', { className: 'stage', hidden: true });
  const dates = el('ol', { className: 'dates', 'aria-label': `${s.title}: tour dates` }, [...s.versions].reverse().map((v) => {
    const li = el('li', {}, [el('span', { className: 'when', textContent: `${day(v.made)} ${time(v.made)}` }), el('span', { className: 'what', textContent: `v${v.n} · ${v.label} · ${v.takes.map((t) => mmss(t.duration_s)).join(' / ')}` })]);
    const played = el('div', { className: 'played' });
    li.append(playButton(v.takes[0], `${s.title}, version ${v.n}, take A`, played, 'Take A'), playButton(v.takes[1], `${s.title}, version ${v.n}, take B`, played, 'Take B'), compareButton(v, s.title, stage), played);
    return li; }));
  bill.append(el('li', {}, [el('div', { className: 'slot', textContent: slots[i] || 'Also on' }), el('h2', { className: 'act', textContent: s.title }), ladder(s, d.stages), dates, stage]));
});
''')

# 3 DESK
page('desk','Mixing desk','Our Suno songs as mixing desks: one desk per song, a channel per version, takes as the left and right pair, the stage as the master meter. Unofficial.',
'''body{font:14px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}
main{max-width:64rem;margin:0 auto;padding:1.2rem 1rem}
h1{font:700 1.8rem/1.1 system-ui,sans-serif;margin:.2rem 0;color:#e9edf1}.unofficial{color:#aab4bf;margin:.3rem 0 1rem;font:13px system-ui,sans-serif}
p{color:#c5ced8;font-family:system-ui,sans-serif}
.desk{background:#23272c;border:1px solid #3a4047;border-radius:10px;margin:1.2rem 0;padding:.8rem}
.deskhead{display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;align-items:center;justify-content:space-between}
.deskhead h2{margin:0;color:#ffd166;font:700 1.1rem system-ui,sans-serif}
.meter{display:flex;flex-direction:row;gap:3px;list-style:none;padding:0;margin:0;font-size:10px;text-transform:uppercase}
.meter li{padding:.15rem .4rem;background:#2f353c;color:#b9c3ce;border-radius:2px}.meter .done{background:#2f6b45;color:#e9edf1}.meter .now{background:#ffd166;color:#23272c;font-weight:700}
.strips{display:flex;gap:6px;overflow-x:auto;padding:.8rem 0 .3rem}
.strip{flex:0 0 108px;background:#2d3238;border:1px solid #3a4047;border-radius:6px;padding:.4rem;display:flex;flex-direction:column;gap:.35rem;align-items:center;color:#d5dde5}
.strip img{width:84px;height:40px;object-fit:cover;border-radius:3px}
.ch{font-weight:700;color:#ffd166}.eq{font-size:10px;text-align:center;height:2.6em;overflow:hidden;color:#aab4bf}
.faders{display:flex;gap:10px;height:90px;align-items:flex-end}
.fader{width:14px;height:90px;background:#16191c;border-radius:7px;position:relative}
.fader i{position:absolute;left:-5px;width:24px;height:12px;background:#d5dde5;border-radius:2px}
.lr{display:flex;gap:4px}
button{font:700 11px ui-monospace,monospace;border:1px solid #556;background:#1b1e22;color:#e9edf1;border-radius:4px;padding:.25rem .4rem;cursor:pointer;min-height:28px;min-width:28px}
button[aria-pressed="true"]{background:#2f6b45}.mon{display:grid;grid-template-columns:1fr;gap:.6rem}.mon[hidden]{display:none}.mon figcaption{color:#ffd166}.abnote{color:#ffd166}
@media (prefers-color-scheme:light){.desk{box-shadow:0 0 0 6px #4a5059}}
@media (max-width:40rem){.mon{grid-template-columns:1fr}}
''','''<main id="main">
<h1>The mixing desk</h1>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p>One desk per song. Each channel is a version (newest on the left); L and R are its two takes, and the fader shows each take's length. The master meter shows the song's stage. Press L or R to load that take in the monitor; the newest channel is first.</p>
<div id="desks"></div>
</main>
''',bg='#16191c',fg='#e9edf1')
open(f'{R}/designs/desk/app.js','w').write('''import { load, el, ladder, mmss, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), box = document.getElementById('desks');
const max = Math.max(...d.songs.flatMap((s) => s.versions.flatMap((v) => v.takes.map((t) => t.duration_s))));
for (const s of d.byMaturity) {
  const mon = el('div', { className: 'mon', hidden: true, 'aria-live': 'polite' });
  const strips = el('div', { className: 'strips', role: 'group', 'aria-label': `${s.title}: channels` }, [...s.versions].reverse().map((v) => {
    const faders = el('div', { className: 'faders', 'aria-hidden': 'true' }, v.takes.map((t) => { const f = el('div', { className: 'fader' }); const k = el('i'); k.style.bottom = `${Math.round((t.duration_s / max) * 78)}px`; f.append(k); return f; }));
    const lr = el('div', { className: 'lr' }, v.takes.map((t, i) => playButton(t, `${s.title}, version ${v.n}, take ${'AB'[i]}`, mon, 'LR'[i])));
    lr.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { mon.hidden = false; }));
    const both = compareButton(v, s.title, mon); both.textContent = 'LR';
    lr.append(both);
    return el('div', { className: 'strip' }, [el('span', { className: 'ch', textContent: `CH ${v.n}` }), el('img', { src: v.takes[0].cover, alt: '', width: 84, height: 40, loading: 'lazy' }), el('span', { className: 'eq', textContent: v.label, title: v.style || v.label }), faders, el('span', { textContent: v.takes.map((t) => mmss(t.duration_s)).join(' ') }), lr]);
  }));
  box.append(el('section', { className: 'desk', 'aria-label': s.title }, [el('div', { className: 'deskhead' }, [el('h2', { textContent: s.title }), ladder(s, d.stages, 'meter')]), strips, mon]));
}
''')

# 4 RADIO
page('radio','Radio listings','Our Suno songs as a week of radio listings: each song a programme, each version an episode, the stage as the time slot. Unofficial.',
'''body{font:16px/1.45 Georgia,"Times New Roman",serif}
main{max-width:52rem;margin:0 auto;padding:1.5rem 1rem}
.mast{border-top:4px double #111;border-bottom:4px double #111;text-align:center;padding:.4rem 0}
h1{font:900 clamp(2rem,7vw,3.4rem)/1 Georgia,serif;margin:0;letter-spacing:-.01em}
.dateline{font:600 12px system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase}
.unofficial{font:13px system-ui,sans-serif;color:#555;margin:.6rem 0}
.prog{border-bottom:1px solid #111;padding:1rem 0}
.slotline{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.4rem;font:700 13px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#a0221c}
.prog h2{margin:.2rem 0;font-size:1.6rem}
.ladder{display:flex;flex-wrap:wrap;gap:0;list-style:none;padding:0;margin:.3rem 0 .6rem;font:600 11px system-ui,sans-serif;text-transform:uppercase}
.ladder li{padding:.1rem .5rem;border:1px solid #111;margin-right:-1px;color:#5e5e5e}.ladder .done{color:#111}.ladder .now{background:#111;color:#fff}
.eps{list-style:none;padding:0;margin:0;columns:2 20rem;column-gap:2rem}
.eps li{break-inside:avoid;padding:.35rem 0;border-top:1px dotted #999;font-size:15px}
.eps b{font-family:system-ui,sans-serif;font-size:13px;margin-right:.4rem}
.eps .tag{font:700 10px system-ui,sans-serif;background:#a0221c;color:#fff;padding:.05rem .3rem;margin-left:.3rem;text-transform:uppercase}
button{font:600 12px system-ui,sans-serif;background:none;border:1px solid #111;border-radius:2px;padding:.2rem .5rem;margin:.25rem .3rem 0 0;cursor:pointer;min-height:28px;color:#111}
button[aria-pressed="true"]{background:#111;color:#fff}.tuner{display:grid;grid-template-columns:1fr;gap:.6rem;margin-top:.6rem}.tuner[hidden]{display:none}
@media (max-width:40rem){.tuner{grid-template-columns:1fr}}
@media (prefers-color-scheme:dark){body{background:#0e1220!important;color:#e8e6dc!important}.mast{border-color:#e8e6dc}.slotline,.eps .tag{color:#ffb4a8}.eps .tag{background:#5a1712}.unofficial{color:#b8b6ad}.ladder li{border-color:#e8e6dc;color:#a9a79e}.ladder .done{color:#e8e6dc}.ladder .now{background:#e8e6dc;color:#0e1220}button{color:#e8e6dc;border-color:#e8e6dc}button[aria-pressed="true"]{background:#e8e6dc;color:#0e1220}.eps li{border-color:#555}}
''','''<main id="main">
<div class="mast"><div class="dateline">The listings</div><h1>Radio Our Songs</h1><div class="dateline">Episodes from 13 to 23 November 2026, all times UTC</div></div>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p>Each song is a programme and each version an episode. The further a song has come, the better its slot: late night for ideas and experiments, prime time once it is picked.</p>
<div id="progs"></div>
</main>
''',bg='#fdfcf7',fg='#111')
open(f'{R}/designs/radio/app.js','w').write('''import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), box = document.getElementById('progs');
const band = ['Late night', 'Late night', 'Evening', 'Prime time', 'Prime time'];
const hours = ['23:30', '00:30', '01:30', '02:30'];
let k = 0;
for (const s of d.byMaturity) {
  const at = `${band[s.level]}, ${s.level >= 3 ? ['20:00', '21:00'][k % 2] : hours[k % hours.length]}`; k++;
  const tuner = el('div', { className: 'tuner', hidden: true });
  const eps = el('ol', { className: 'eps', 'aria-label': `${s.title}: episodes` }, [...s.versions].reverse().map((v, i) => {
    const li = el('li', {}, [el('b', { textContent: `Ep ${v.n}` }), document.createTextNode(`${v.label} (${day(v.made)}, ${v.takes.map((t) => mmss(t.duration_s)).join(' or ')})`)]);
    if (i === 0) li.append(el('span', { className: 'tag', textContent: s.level >= 3 ? 'premiere' : 'latest' }));
    li.append(el('br'), playButton(v.takes[0], `${s.title}, episode ${v.n}, take A`, tuner, 'Listen A'), playButton(v.takes[1], `${s.title}, episode ${v.n}, take B`, tuner, 'Listen B'), compareButton(v, s.title, tuner));
    li.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { tuner.hidden = false; }));
    return li; }));
  box.append(el('section', { className: 'prog', 'aria-label': s.title }, [el('div', { className: 'slotline' }, [el('span', { textContent: at }), el('span', { textContent: `${s.versions.length} ${s.versions.length === 1 ? 'episode' : 'episodes'}` })]), el('h2', { textContent: s.title }), ladder(s, d.stages), eps, tuner]));
}
''')

# 5 LINER
page('liner','Liner notes','Our Suno songs as gatefold liner notes: the session log, the alternate takes, and the stage ladder across the spine. Unofficial.',
'''body{font:16px/1.55 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
main{max-width:62rem;margin:0 auto;padding:1.5rem 1rem}
h1{font-weight:400;font-size:clamp(1.8rem,5vw,2.6rem);margin:.2rem 0;letter-spacing:.02em}
.kicker{font:600 12px system-ui,sans-serif;letter-spacing:.25em;text-transform:uppercase;color:#64573f}
.unofficial{font:13px system-ui,sans-serif;color:#6f6557;margin:.4rem 0 1rem}
.gate{display:grid;grid-template-columns:1fr 2.2rem 1fr;background:#fffdf8;border:1px solid #d8d0c0;box-shadow:0 8px 24px rgba(60,40,10,.12);margin:1.6rem 0}
.panel{padding:1.1rem 1.2rem}.panel h2{margin:0;font-weight:400;font-size:1.6rem}.panel h3{font:600 12px system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7d6f5a;margin:1rem 0 .4rem}
.spine{background:#2f2a22;display:flex;align-items:center;justify-content:center}
.spine .ladder{writing-mode:vertical-rl;transform:rotate(180deg);list-style:none;margin:0;padding:.6rem 0;display:flex;gap:.6rem;font:600 11px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.15em;color:#bdb29e}
.spine .done{color:#d9cfbd}.spine .now{color:#ffcf6e}
.cover{width:100%;max-width:220px;aspect-ratio:1;object-fit:cover;display:block;margin:.6rem 0}
.log{list-style:none;padding:0;margin:0;counter-reset:n}.log li{padding:.45rem 0;border-top:1px solid #e7e0d2;font-size:15px}
.log .meta{display:block;font:13px system-ui,sans-serif;color:#7d6f5a}
button{font:600 12px system-ui,sans-serif;background:none;border:1px solid #7d6f5a;border-radius:999px;padding:.2rem .6rem;margin:.3rem .3rem 0 0;cursor:pointer;min-height:28px;color:#2f2a22}
button[aria-pressed="true"]{background:#2f2a22;color:#fffdf8}.stageline{font:600 13px system-ui,sans-serif;margin:.3rem 0}.alt{display:grid;grid-template-columns:1fr;gap:.6rem;margin-top:.6rem}.alt[hidden]{display:none}
.credits p{margin:.2rem 0;font-size:15px}.back{background:#2f2a22;color:#efe7d8;padding:1.2rem;border-radius:4px;margin-top:2rem}.back a{color:#ffcf6e}
@media (prefers-color-scheme:dark){body{background:#0d0c0a!important;color:#e9e2d3!important}.gate{background:#181613;border-color:#3a352d}.log li{border-color:#3a352d}.panel h3,.log .meta,.kicker,.unofficial{color:#c2b59c!important}button{color:#e9e2d3;border-color:#c2b59c}button[aria-pressed="true"]{background:#e9e2d3;color:#181613}.back{background:#000}.panel a{color:#ffcf6e}}
@media (max-width:44rem){.gate{grid-template-columns:1fr}.spine{padding:.4rem}.spine .ladder{writing-mode:horizontal-tb;transform:none;flex-wrap:wrap;justify-content:center}}
''','''<main id="main">
<div class="kicker">Liner notes</div>
<h1>Our songs: the sessions</h1>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p>One gatefold per song. On the left, the session log: every version with its date, and both alternate takes. On the right, the credits and style notes. The stage runs down the spine.</p>
<div id="gates"></div>
<section class="back" aria-label="How this was made"><h2>How this was made</h2><p>Words and prompts by the team and its agents; music by Suno. This page is static files: fork <a href="https://github.com/SovereignWebsite/Site__Platform__Suno">the repository</a>, put your own public Suno songs in <code>site/data/songs.json</code>, and turn on GitHub Pages.</p></section>
</main>
''',bg='#f1ece2',fg='#2f2a22')
open(f'{R}/designs/liner/app.js','w').write('''import { load, el, ladder, stageLine, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), box = document.getElementById('gates');
for (const s of d.byMaturity) {
  const alt = el('div', { className: 'alt', hidden: true });
  const log = el('ol', { className: 'log', 'aria-label': `${s.title}: session log` }, s.versions.map((v) => {
    const li = el('li', {}, [document.createTextNode(`${v.n}. ${v.label}`), el('span', { className: 'meta', textContent: `${day(v.made)}, ${time(v.made)} UTC · takes ${v.takes.map((t) => mmss(t.duration_s)).join(' and ')}` })]);
    li.append(playButton(v.takes[0], `${s.title}, session ${v.n}, take A`, alt, 'Take A'), playButton(v.takes[1], `${s.title}, session ${v.n}, take B`, alt, 'Take B'), compareButton(v, s.title, alt));
    li.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { alt.hidden = false; }));
    return li; }));
  const models = [...new Set(s.versions.map((v) => v.model))].join(', ');
  const styles = [...new Set(s.versions.map((v) => v.style).filter(Boolean))];
  const credits = el('div', { className: 'credits' }, [
    el('p', { textContent: s.lyrics_by ? `Words: ${s.lyrics_by}` : 'Words: the team' }), el('p', { textContent: `Music: Suno (${models})` }),
    el('p', { textContent: `Sessions: ${s.versions.length}, ${day(s.versions[0].made)} to ${day(s.versions[s.versions.length - 1].made)}` }),
    ...(s.lyrics_by ? [el('p', {}, [el('a', { href: `/lyrics/${s.slug}.txt`, textContent: 'Lyrics' })])] : [])]);
  box.append(el('article', { className: 'gate', 'aria-label': s.title }, [
    el('div', { className: 'panel' }, [el('h2', { textContent: s.title }), el('p', { className: 'stageline', textContent: stageLine(s, d.stages) }), el('h3', { textContent: 'Session log' }), log, alt]),
    el('div', { className: 'spine' }, [ladder(s, d.stages)]),
    el('div', { className: 'panel' }, [el('img', { className: 'cover', src: s.versions[s.versions.length - 1].takes[0].cover, alt: `Cover of ${s.title}`, loading: 'lazy' }), el('h3', { textContent: 'Credits' }), credits, el('h3', { textContent: 'Style notes' }), el('ul', {}, styles.slice(-3).map((t) => el('li', { textContent: t })))]),
  ]));
}
''')

# CHOOSER
cards=''.join(f'<li><a href="/designs/{s}/"><img src="/designs/thumbs/{s}.jpg" alt="" width="600" height="375" loading="lazy"><b>{n}</b></a><span>{t}</span></li>\n' for s,n,t in [
('crate','Record crate','Songs are dividers, versions are sleeves, takes are sides A and B.'),
('poster','Gig poster','The furthest-along song headlines; versions are the tour dates.'),
('desk','Mixing desk','A desk per song, a channel per version, L and R takes, the stage as the master meter.'),
('radio','Radio listings','Songs are programmes, versions are episodes, and the stage sets the time slot.'),
('liner','Liner notes','A gatefold per song: the session log, the alternate takes, the ladder down the spine.')])
page('','Designs','Five designs for this site, each telling how the songs grow from idea to release in its own form. Unofficial.',
'''body{font:17px/1.55 system-ui,sans-serif}main{max-width:62rem;margin:0 auto;padding:2rem 1rem}
h1{font-size:clamp(1.8rem,5vw,2.6rem);margin:.2rem 0}.unofficial{font-size:14px;color:#555}
.grid{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));gap:1.2rem}
.grid a{display:block;color:#1d4f38;text-decoration:none}
@media (prefers-color-scheme:dark){body{background:#141513!important;color:#ecebe6!important}.grid a{color:#7fc3a0}.grid span,.unofficial,.draft{color:#c9c8c0!important}main a{color:#7fc3a0}}.grid img{width:100%;height:auto;border:1px solid #ddd;border-radius:8px;display:block}
.grid b{display:block;margin:.5rem 0 .1rem;font-size:1.1rem;text-decoration:underline}.grid span{color:#444;font-size:15px}
''','''<main id="main">
<h1>Five designs</h1>
<p class="unofficial">'''+UNOFF+'''</p>
<p class="draft">Draft: first version, 23 November 2026, not yet signed off by Dinis Cruz. Dates, versions, lengths and styles are from the team's Suno library, read on 23 November 2026.</p>
<p>The same songs, versions and takes, told five ways. Each one shows where every song is on the way from idea to release, and lets you compare a version's two takes in one tap. The <a href="/">home page</a> is the plain version.</p>
<ul class="grid">
'''+cards+'''</ul>
</main>
''',script=False,bg='#fbfaf7',fg='#1d1d1b')
print('done')
