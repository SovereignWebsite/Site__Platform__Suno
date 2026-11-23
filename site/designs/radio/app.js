import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
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
