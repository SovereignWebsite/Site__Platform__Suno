import { load, el, ladder, mmss, playButton, compareButton } from '/assets/suno-lib.js';
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
