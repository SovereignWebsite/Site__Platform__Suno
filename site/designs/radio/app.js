import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
const d = await load(), box = document.getElementById('progs');
const slot = ['Late night, 02:00', 'Late night, 23:30', 'Evening, 19:00', 'Prime time, 21:00', 'Prime time, 20:00'];
for (const s of d.byMaturity) {
  const tuner = el('div', { className: 'tuner', hidden: true });
  const eps = el('ol', { className: 'eps', 'aria-label': `${s.title}: episodes` }, [...s.versions].reverse().map((v, i) => {
    const li = el('li', {}, [el('b', { textContent: `Ep ${v.n}` }), document.createTextNode(`${v.label} (${day(v.made)}, ${v.takes.map((t) => mmss(t.duration_s)).join(' or ')})`)]);
    if (i === 0) li.append(el('span', { className: 'tag', textContent: s.level >= 3 ? 'premiere' : 'new' }));
    li.append(el('br'), playButton(v.takes[0], `${s.title}, episode ${v.n}, take A`, tuner, 'Listen A'), playButton(v.takes[1], `${s.title}, episode ${v.n}, take B`, tuner, 'Listen B'), compareButton(v, s.title, tuner));
    li.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { tuner.hidden = false; }));
    return li; }));
  box.append(el('section', { className: 'prog', 'aria-label': s.title }, [el('div', { className: 'slotline' }, [el('span', { textContent: slot[s.level] }), el('span', { textContent: `${s.versions.length} episodes` })]), el('h2', { textContent: s.title }), ladder(s, d.stages), eps, tuner]));
}
