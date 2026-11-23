// A playlist of the newest version of every song (or every version): one Suno player, with previous, next and shuffle.
// Suno's player cannot tell this page when a song ends, so "next" is a press, not automatic.
import { load, el, mmss } from '/assets/suno-lib.js';
const d = await load(), out = document.getElementById('pl');
let all = false, order = [], at = -1;
const tracks = () => d.songs.flatMap((s) => (all ? s.versions : [s.versions[s.versions.length - 1]]).flatMap((v) => v.takes.map((t, i) => ({ s, v, t, name: `${s.title} · v${v.n} take ${'AB'[i]}` }))));
const frame = el('iframe', { title: 'Suno player', allow: 'autoplay; encrypted-media', hidden: true });
const now = el('p', { className: 'now', 'aria-live': 'polite', textContent: 'Press a track, or Play from the top.' });
const list = el('ol', { className: 'tracks' });
const go = (i) => { at = (i + order.length) % order.length; const x = order[at]; frame.hidden = false; frame.src = `https://suno.com/embed/${x.t.id}`; frame.title = `${x.name}, Suno player`; now.textContent = `Loaded ${at + 1} of ${order.length}: ${x.name}. Press play in Suno's player.`; draw(); };
const draw = () => list.replaceChildren(...order.map((x, i) => { const b = el('button', { type: 'button', className: 'track', 'aria-current': i === at ? 'true' : 'false' }, [el('img', { src: x.t.cover, alt: '', width: 40, height: 40, loading: 'lazy' }), el('span', { textContent: x.name }), el('span', { className: 'len', textContent: mmss(x.t.duration_s) })]); b.addEventListener('click', () => go(i)); return el('li', {}, [b]); }));
const reset = (shuffle) => { order = tracks(); if (shuffle) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } at = -1; draw(); };
const btn = (t, f) => { const b = el('button', { type: 'button', textContent: t }); b.addEventListener('click', f); return b; };
const scope = el('select', { id: 'scope' }, [el('option', { value: 'latest', textContent: 'newest version of each song' }), el('option', { value: 'all', textContent: 'every version (all takes)' })]);
scope.addEventListener('change', () => { all = scope.value === 'all'; reset(false); });
out.replaceChildren(el('div', { className: 'controls' }, [btn('Play from the top', () => go(0)), btn('Previous', () => go(at - 1)), btn('Next', () => go(at + 1)), btn('Shuffle', () => { reset(true); go(0); }), el('label', { htmlFor: 'scope', textContent: 'Tracks:' }), scope]), now, frame, list);
reset(false);
