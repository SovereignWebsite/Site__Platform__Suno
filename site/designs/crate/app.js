import { load, el, ladder, stageLine, mmss, day, time, playButton, compareButton } from '/assets/suno-lib.js';
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
