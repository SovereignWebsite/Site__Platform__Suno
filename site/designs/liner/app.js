import { load, el, ladder, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
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
    el('div', { className: 'panel' }, [el('h2', { textContent: s.title }), el('h3', { textContent: 'Session log' }), log, alt]),
    el('div', { className: 'spine' }, [ladder(s, d.stages)]),
    el('div', { className: 'panel' }, [el('img', { className: 'cover', src: s.versions[s.versions.length - 1].takes[0].cover, alt: `Cover of ${s.title}`, loading: 'lazy' }), el('h3', { textContent: 'Credits' }), credits, el('h3', { textContent: 'Style notes' }), el('ul', {}, styles.slice(-3).map((t) => el('li', { textContent: t })))]),
  ]));
}
