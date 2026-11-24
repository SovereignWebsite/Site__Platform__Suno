// The styles map: every version of every song placed by tempo (bpm) and grouped by song, coloured by style family,
// with a line from each version to the one it grew from. Tempo is Suno's measurement where the listening tool was
// asked, otherwise the bpm written in the prompt; versions with neither sit in the "not given" lane.
import { load, el } from '/assets/suno-lib.js';
const d = await load(), out = document.getElementById('map');
const NS = 'http://www.w3.org/2000/svg';
const svg = (tag, attrs = {}, kids = []) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); e.append(...kids); return e; };
const FAM = [['brazil', 'Brazilian (samba, bossa, MPB)', /samba|bossa|batucada|mpb|brazil|cavaquinho/i, '#2f8a5a'], ['soul', 'Soul and R&B', /soul|r&b|motown|gospel/i, '#b5542c'], ['rock', 'Rock', /rock|britpop/i, '#4a63b8'], ['pop', 'Pop', /pop/i, '#a0458f'], ['other', 'Not stated', /.*/, '#777']];
const fam = (v) => FAM.find(([, , re]) => re.test(`${v.style || ''} ${v.prompt?.style || ''}`)) || FAM[4];
const bpmOf = (v) => { const m = v.takes.map((t) => t.listen?.bpm).find(Boolean); if (m) return { bpm: Math.round(m), how: 'measured' }; const w = `${v.prompt?.style || ''} ${v.style || ''}`.match(/(\d{2,3})\s*bpm/i); return w ? { bpm: +w[1], how: 'asked for' } : { bpm: null, how: 'not given' }; };
const rows = d.songs.map((s) => ({ s, vs: s.versions.map((v) => ({ v, f: fam(v), ...bpmOf(v) })) }));
const W = 940, L = 150, R = 30, rowH = 110, H = rows.length * rowH + 60, lo = 80, hi = 130, unknownX = L + 10;
const x = (b) => (b == null ? unknownX : L + 110 + ((b - lo) / (hi - lo)) * (W - L - R - 110));
const g = svg('svg', { viewBox: `0 0 ${W} ${H}`, role: 'group', 'aria-labelledby': 'maptitle', class: 'map' }, [svg('title', { id: 'maptitle' }, [document.createTextNode('Every version of every song by tempo and style; the table below has the same data')])]);
for (let b = lo; b <= hi; b += 10) g.append(svg('line', { x1: x(b), x2: x(b), y1: 20, y2: H - 30, class: 'grid' }), svg('text', { x: x(b), y: H - 10, 'text-anchor': 'middle', class: 'axis' }, [document.createTextNode(`${b} bpm`)]));
g.append(svg('text', { x: unknownX - 8, y: H - 10, 'text-anchor': 'start', class: 'axis' }, [document.createTextNode('tempo not given')]));
rows.forEach(({ s, vs }, r) => {
  const y0 = 40 + r * rowH;
  g.append(svg('text', { x: 8, y: y0 + 34, class: 'song' }, [document.createTextNode(s.title.length > 20 ? `${s.title.slice(0, 19)}…` : s.title)]));
  let k = 0; const pos = vs.map((p, i) => { if (p.bpm == null) { const j = k++; return { ...p, cx: unknownX + (j % 3) * 22, cy: y0 + 12 + Math.floor(j / 3) * 22 }; } return { ...p, cx: x(p.bpm), cy: y0 + 12 + (i % 4) * 18 }; });
  pos.forEach((p, i) => { if (i) g.append(svg('line', { x1: pos[i - 1].cx, y1: pos[i - 1].cy, x2: p.cx, y2: p.cy, class: 'edge' })); });
  pos.forEach((p) => {
    const a = svg('a', { href: `/songs/${s.slug}/`, 'aria-label': `${s.title}, version ${p.v.n}, ${p.bpm ?? 'tempo not given'} bpm, ${p.f[1]}` }, [svg('circle', { cx: p.cx, cy: p.cy, r: 8, fill: p.f[3], class: p.how === 'measured' ? 'measured' : '' }), svg('text', { x: p.cx, y: p.cy + 3.5, 'text-anchor': 'middle', class: 'vn' }, [document.createTextNode(String(p.v.n))])]);
    g.append(a);
  });
});
const legend = el('ul', { className: 'legend' }, FAM.map(([, label, , c]) => { const sw = el('span', { className: 'sw' }); sw.style.background = c; return el('li', {}, [sw, document.createTextNode(label)]); }));
const table = el('table', {}, [el('caption', { textContent: 'The same data as a table' }), el('thead', {}, [el('tr', {}, ['Song', 'Version', 'Tempo', 'Style family', 'Style'].map((h) => el('th', { scope: 'col', textContent: h })))]),
  el('tbody', {}, rows.flatMap(({ s, vs }) => vs.map((p) => el('tr', {}, [el('td', {}, [el('a', { href: `/songs/${s.slug}/`, textContent: s.title })]), el('td', { textContent: `${p.v.n}: ${p.v.label}` }), el('td', { textContent: p.bpm ? `${p.bpm} bpm (${p.how})` : 'not given' }), el('td', { textContent: p.f[1] }), el('td', { textContent: p.v.style || '' })]))))]);
out.replaceChildren(legend, el('div', { className: 'mapwrap', tabIndex: 0, role: 'region', 'aria-label': 'Styles map, scrolls sideways on small screens' }, [g]), el('p', { className: 'small', textContent: 'Each dot is a version (its number inside); lines join a song\'s versions in order; a ringed dot has a tempo measured by Suno\'s listening tool, the others the tempo asked for in the prompt. Press a dot for the song page.' }), el('div', { className: 'tablewrap', tabIndex: 0, role: 'region', 'aria-label': 'Table of versions, scrolls sideways on small screens' }, [table]));
