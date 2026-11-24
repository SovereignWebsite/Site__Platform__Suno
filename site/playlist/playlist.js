// The playlist: one Suno player, an "Up next" queue you can drag to reorder (or move with buttons), a record of what
// you have listened to, and quick feedback on each track. Everything is kept in this browser only until the site's
// feedback lane is switched on; nothing is sent. Suno's player cannot tell this page when a song ends, so Next is a press.
import { load, el, mmss } from '/assets/suno-lib.js';
const d = await load(), out = document.getElementById('pl');
const KEY = 'suno-platform-playlist-v1';
const st = (() => { try { return Object.assign({ heard: {}, fb: {}, queue: [] }, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return { heard: {}, fb: {}, queue: [] }; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage blocked: works for this visit only */ } };
const all = d.songs.flatMap((s) => s.versions.flatMap((v) => v.takes.map((t, i) => ({ id: t.id, s, v, t, name: `${s.title} · v${v.n} take ${'AB'[i]}` }))));
const byId = new Map(all.map((x) => [x.id, x]));
let scope = 'latest', current = null;
const library = () => d.songs.flatMap((s) => (scope === 'all' ? s.versions : [s.versions[s.versions.length - 1]]).flatMap((v) => v.takes.map((t) => byId.get(t.id))));
if (!st.queue.length) st.queue = library().map((x) => x.id);
st.queue = st.queue.filter((id) => byId.has(id));
const frame = el('iframe', { title: 'Suno player', allow: 'autoplay; encrypted-media', hidden: true });
const now = el('p', { className: 'now', 'aria-live': 'polite', textContent: 'Press a track, or Play from the top.' });
const fbBox = el('div', { className: 'fbbox', hidden: true });
const queueEl = el('ol', { className: 'tracks', 'aria-label': 'Up next' });
const libEl = el('ul', { className: 'tracks lib', 'aria-label': 'All tracks' });
const play = (id) => {
  const x = byId.get(id); current = id; st.heard[id] = new Date().toISOString(); save();
  frame.hidden = false; frame.src = `https://suno.com/embed/${id}`; frame.title = `${x.name}, Suno player`;
  const pos = st.queue.indexOf(id);
  now.textContent = `Loaded${pos >= 0 ? ` ${pos + 1} of ${st.queue.length}` : ''}: ${x.name}. Press play in Suno's player.`;
  drawFeedback(); draw();
};
const step = (n) => { if (!st.queue.length) return; const i = st.queue.indexOf(current); play(st.queue[(i < 0 ? 0 : (i + n + st.queue.length) % st.queue.length)]); };
const move = (i, j) => { if (j < 0 || j >= st.queue.length) return; const [x] = st.queue.splice(i, 1); st.queue.splice(j, 0, x); save(); draw(); };
const btn = (t, f, label) => { const b = el('button', { type: 'button', textContent: t }); if (label) b.setAttribute('aria-label', label); b.addEventListener('click', f); return b; };
const mark = (id) => (st.fb[id]?.verdict === 'like' ? ' · liked' : st.fb[id]?.verdict === 'no' ? ' · not for me' : '') + (st.heard[id] ? ' · listened' : '');
let dragFrom = null;
const draw = () => {
  queueEl.replaceChildren(...st.queue.map((id, i) => {
    const x = byId.get(id);
    const li = el('li', { className: 'qitem', draggable: true, 'aria-current': id === current ? 'true' : 'false' }, [
      el('span', { className: 'grip', 'aria-hidden': 'true', textContent: '⋮⋮' }),
      el('button', { type: 'button', className: 'track' }, [el('img', { src: x.t.cover, alt: '', width: 40, height: 40, loading: 'lazy' }), el('span', { textContent: x.name + mark(id) }), el('span', { className: 'len', textContent: mmss(x.t.duration_s) })]),
      el('span', { className: 'moves' }, [btn('Up', () => move(i, i - 1), `Move ${x.name} up`), btn('Down', () => move(i, i + 1), `Move ${x.name} down`), btn('Remove', () => { st.queue.splice(i, 1); save(); draw(); }, `Remove ${x.name} from up next`)]),
    ]);
    li.querySelector('.track').addEventListener('click', () => play(id));
    li.addEventListener('dragstart', (e) => { dragFrom = i; e.dataTransfer.effectAllowed = 'move'; li.classList.add('dragging'); });
    li.addEventListener('dragend', () => li.classList.remove('dragging'));
    li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('over'); });
    li.addEventListener('dragleave', () => li.classList.remove('over'));
    li.addEventListener('drop', (e) => { e.preventDefault(); li.classList.remove('over'); if (dragFrom !== null) move(dragFrom, i); dragFrom = null; });
    return li;
  }));
  libEl.replaceChildren(...library().map((x) => el('li', {}, [
    el('span', { className: 'libname', textContent: x.name + mark(x.id) }),
    btn('Play now', () => play(x.id), `Play ${x.name} now`),
    btn('Play next', () => { st.queue = st.queue.filter((q) => q !== x.id); const at = Math.max(0, st.queue.indexOf(current) + 1); st.queue.splice(at, 0, x.id); save(); draw(); }, `Put ${x.name} next in up next`),
    btn('Add to end', () => { if (!st.queue.includes(x.id)) { st.queue.push(x.id); save(); draw(); } }, `Add ${x.name} to the end of up next`),
  ])));
};
const drawFeedback = () => {
  const x = byId.get(current); if (!x) return;
  const f = st.fb[current] || (st.fb[current] = { verdict: '', note: '' });
  const v = (val, text) => { const b = el('button', { type: 'button', textContent: text, 'aria-pressed': String(f.verdict === val) }); b.addEventListener('click', () => { f.verdict = f.verdict === val ? '' : val; f.at = new Date().toISOString(); save(); drawFeedback(); draw(); }); return b; };
  const ta = el('textarea', { id: 'pfb', rows: 3, value: f.note || '', placeholder: 'What to keep, what to change for the next version' });
  const ok = el('span', { className: 'small', 'aria-live': 'polite' });
  ta.addEventListener('input', () => { f.note = ta.value; f.at = new Date().toISOString(); save(); ok.textContent = 'Saved in this browser.'; });
  fbBox.hidden = false;
  fbBox.replaceChildren(el('h2', { textContent: `Your feedback on ${x.name}` }), el('div', { className: 'row' }, [v('like', 'I like this'), v('no', 'Not for me'), el('a', { href: `/songs/${x.s.slug}/`, textContent: 'Song page' })]), el('label', { htmlFor: 'pfb', textContent: 'A note for the next version' }), ta, ok);
};
const exportText = () => {
  const lines = ['Playlist feedback for suno.platform.sovereignweb.site', `Written ${new Date().toISOString().slice(0, 16)} UTC`, ''];
  for (const [id, f] of Object.entries(st.fb)) { const x = byId.get(id); if (x && (f.verdict || (f.note || '').trim())) lines.push(`${x.name}: ${f.verdict === 'like' ? 'liked' : f.verdict === 'no' ? 'not for me' : ''}${f.note ? `; ${f.note.trim()}` : ''}`); }
  lines.push('', `Listened to ${Object.keys(st.heard).filter((id) => byId.has(id)).length} of ${all.length} takes.`);
  return lines.join('\n');
};
const copyOut = el('pre', { hidden: true });
const copyMsg = el('span', { className: 'small', 'aria-live': 'polite' });
const scopeSel = el('select', { id: 'scope' }, [el('option', { value: 'latest', textContent: 'newest version of each song' }), el('option', { value: 'all', textContent: 'every version (all takes)' })]);
scopeSel.addEventListener('change', () => { scope = scopeSel.value; draw(); });
out.replaceChildren(
  el('div', { className: 'controls' }, [btn('Play from the top', () => st.queue.length && play(st.queue[0])), btn('Previous', () => step(-1)), btn('Next', () => step(1)),
    btn('Shuffle up next', () => { for (let i = st.queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [st.queue[i], st.queue[j]] = [st.queue[j], st.queue[i]]; } save(); draw(); }),
    btn('Reset up next', () => { st.queue = library().map((x) => x.id); save(); draw(); })]),
  now, frame, fbBox,
  el('h2', { textContent: 'Up next' }), el('p', { className: 'small', textContent: 'Drag a track to move it, or use Up and Down. Your order, what you have listened to and your feedback are kept in this browser only.' }), queueEl,
  el('div', { className: 'row' }, [btn('Copy my feedback', async () => { const t = exportText(); try { await navigator.clipboard.writeText(t); copyMsg.textContent = 'Copied: paste it to the team.'; } catch { copyOut.hidden = false; copyOut.textContent = t; copyMsg.textContent = 'Copy is blocked here: select the text below.'; } }), copyMsg]), copyOut,
  el('h2', { textContent: 'All tracks' }), el('div', { className: 'controls' }, [el('label', { htmlFor: 'scope', textContent: 'Show:' }), scopeSel]), libEl,
);
draw();
