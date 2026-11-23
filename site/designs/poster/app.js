import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
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
