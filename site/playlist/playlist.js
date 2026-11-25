// The listening board: every take moves through New -> Listening -> Liked / OK / Not for me (archived, hidden).
// One Suno player; play the Listening column in order, or shuffle Liked on a loop. Drag cards between columns, or use
// each card's buttons (keyboard and phones). Kept in this browser only until the site's feedback lane is switched on.
import { load, el, mmss } from '/assets/suno-lib.js';
const d = await load(), out = document.getElementById('pl');
const KEY = 'suno-platform-board-v1';
const COLS = [['new', 'New', 'Not sorted yet, newest first: fresh songs from the pipeline land here.'], ['listening', 'Listening', 'Your queue, in your order.'], ['liked', 'Liked', 'Shuffle these on a loop.'], ['ok', 'OK', 'Fine, not a favourite.'], ['no', 'Not for me', 'Archived: hidden from the board, kept for the record.']];
const st = (() => { try { return Object.assign({ col: {}, order: {}, notes: {}, heard: {} }, JSON.parse(localStorage.getItem(KEY)) || {}); } catch { return { col: {}, order: {}, notes: {}, heard: {} }; } })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* storage blocked: this visit only */ } };
const all = d.all.flatMap((s) => s.versions.flatMap((v) => v.takes.map((t, i) => ({ id: t.id, s, v, t, side: 'AB'[i], made: v.made, sib: v.takes[1 - i]?.id, name: `${s.title} · v${v.n} take ${'AB'[i]}` })))).sort((a, b) => (a.made < b.made ? 1 : -1));
const byId = new Map(all.map((x) => [x.id, x]));
const colOf = (id) => st.col[id] || (byId.get(id)?.s.archived ? 'no' : 'new');
const list = (c) => { const ids = all.filter((x) => colOf(x.id) === c).map((x) => x.id); const o = st.order[c] || []; return [...o.filter((id) => ids.includes(id)), ...ids.filter((id) => !o.includes(id))]; };
const setCol = (id, c, at) => { const from = colOf(id); st.col[id] = c; st.order[from] = list(from).filter((x) => x !== id); const l = list(c).filter((x) => x !== id); l.splice(at ?? l.length, 0, id); st.order[c] = l; save(); draw(); };
let mode = 'listening', current = null, showArchive = false, seq = [], seqTimer = null;
// Newest first, archived songs left out; with "one take per version", each version's best take only.
const newest = (n, onePer) => d.songs.flatMap((s) => s.versions.map((v) => ({ s, v }))).sort((a, b) => b.v.made.localeCompare(a.v.made)).slice(0, onePer ? n : undefined)
  .flatMap(({ v }) => (onePer ? [v.best || v.takes[0].id] : v.takes.map((t) => t.id))).slice(0, n);
const stopSeq = () => { clearTimeout(seqTimer); seqTimer = null; seq = []; seqNote.textContent = ''; };
const runSeq = (i) => {
  clearTimeout(seqTimer); if (i >= seq.length) { seqNote.textContent = `Finished the ${seq.length}.`; seq = []; return; }
  mode = 'seq'; play(seq[i]);
  const x = byId.get(seq[i]), wait = (x.t.duration_s + 3) * 1000;
  seqNote.textContent = `Playing ${i + 1} of ${seq.length}. The next one loads by itself after ${mmss(x.t.duration_s)}; press play in Suno's player if it does not start.`;
  seqTimer = setTimeout(() => runSeq(i + 1), wait); seq.at = i;
};
const seqNote = el('p', { className: 'small', 'aria-live': 'polite' });
const frame = el('iframe', { title: 'Suno player', allow: 'autoplay; encrypted-media', hidden: true });
const now = el('p', { className: 'now', 'aria-live': 'polite', textContent: 'Press Play on a card, or play your Listening column.' });
const play = (id) => { const x = byId.get(id); current = id; st.heard[id] = new Date().toISOString(); save(); frame.hidden = false; frame.src = `https://suno.com/embed/${id}`; frame.title = `${x.name}, Suno player`; now.textContent = `Loaded: ${x.name}${mode === 'liked' ? ' (Liked, shuffled on a loop)' : ''}. Press play in Suno's player.`; draw(); };
let shuffled = [];
const next = (n = 1) => {
  if (mode === 'seq' && seq.length) { runSeq(Math.max(0, Math.min(seq.length - 1, (seq.at ?? 0) + n))); return; }
  const l = mode === 'liked' ? (shuffled.length ? shuffled : (shuffled = list('liked').sort(() => Math.random() - 0.5))) : list('listening');
  if (!l.length) { now.textContent = mode === 'liked' ? 'Nothing in Liked yet.' : 'Nothing in Listening: move cards there.'; return; }
  const i = l.indexOf(current); play(l[(i + n + l.length) % l.length]);
};
const b = (t, f, label, cls) => { const x = el('button', { type: 'button', textContent: t, className: cls || '' }); if (label) x.setAttribute('aria-label', label); x.addEventListener('click', f); return x; };
let drag = null;
const card = (id, c) => {
  const x = byId.get(id), note = el('textarea', { rows: 2, value: st.notes[id] || '', placeholder: 'A note for the next version' });
  note.setAttribute('aria-label', `Note on ${x.name}`);
  note.addEventListener('input', () => { st.notes[id] = note.value; save(); });
  const moves = COLS.filter(([k]) => k !== c).map(([k, label]) => b(label, () => { setCol(id, k); if (k === 'liked' && x.sib && colOf(x.sib) !== 'no') offer(x); }, `Move ${x.name} to ${label}`, 'mv'));
  const li = el('li', { className: 'card', draggable: true, 'aria-current': id === current ? 'true' : 'false' }, [
    el('div', { className: 'chead' }, [el('img', { src: x.t.cover, alt: '', width: 44, height: 44, loading: 'lazy' }), el('div', {}, [el('b', { textContent: x.s.title }), el('span', { className: 'small', textContent: ` v${x.v.n} take ${x.side} · ${mmss(x.t.duration_s)}${st.heard[id] ? ' · listened' : ''}` })])]),
    el('div', { className: 'row' }, [b('Play', () => play(id), `Play ${x.name}`, 'pl'), el('a', { href: `/songs/${x.s.slug}/`, textContent: 'Song page' })]),
    el('details', {}, [el('summary', { textContent: 'Move or note' }), el('div', { className: 'row' }, moves), note]),
  ]);
  li.addEventListener('dragstart', (e) => { drag = id; e.dataTransfer.effectAllowed = 'move'; li.classList.add('dragging'); });
  li.addEventListener('dragend', () => li.classList.remove('dragging'));
  return li;
};
const offerBox = el('div', { className: 'offer', hidden: true, 'aria-live': 'polite' });
const offer = (x) => { const s = byId.get(x.sib); offerBox.hidden = false; offerBox.replaceChildren(el('span', { textContent: `You liked take ${x.side}. Archive its sibling, ${s.name}? ` }), b('Archive it', () => { setCol(s.id, 'no'); offerBox.hidden = true; }), b('Keep it', () => { offerBox.hidden = true; })); };
const board = el('div', { className: 'board' });
const draw = () => {
  board.replaceChildren(...COLS.filter(([k]) => k !== 'no' || showArchive).map(([k, label, about]) => {
    const ids = list(k), ul = el('ol', { className: 'col-list' }, ids.map((id) => card(id, k)));
    const col = el('section', { className: `col col-${k}`, 'aria-label': `${label}, ${ids.length}` }, [el('h2', { textContent: `${label} (${ids.length})` }), el('p', { className: 'small', textContent: about }), ul]);
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', (e) => { e.preventDefault(); col.classList.remove('over'); if (!drag) return; const cards = [...ul.children]; const at = cards.findIndex((li) => e.clientY < li.getBoundingClientRect().top + li.offsetHeight / 2); const x = byId.get(drag); setCol(drag, k, at < 0 ? undefined : at); if (k === 'liked' && x.sib && colOf(x.sib) !== 'no') offer(x); drag = null; });
    return col;
  }));
  archBtn.textContent = showArchive ? 'Hide the archive' : `Show the archive (${list('no').length})`;
};
const archBtn = b('', () => { showArchive = !showArchive; draw(); });
const copyMsg = el('span', { className: 'small', 'aria-live': 'polite' }), copyOut = el('pre', { hidden: true });
const exportText = () => { const L = ['Listening board for suno.platform.sovereignweb.site', `Written ${new Date().toISOString().slice(0, 16)} UTC`, '']; for (const [k, label] of COLS) { const ids = list(k); if (k !== 'new' && ids.length) { L.push(`${label}:`); ids.forEach((id) => L.push(`- ${byId.get(id).name}${st.notes[id] ? `: ${st.notes[id].trim()}` : ''}`)); L.push(''); } } return L.join('\n'); };
const one = el('input', { type: 'checkbox', id: 'oneper', checked: true });
const seqBox = el('div', { className: 'seq' }, [
  el('h2', { textContent: 'Play the newest in sequence' }),
  el('div', { className: 'controls' }, [b('Play the newest 10', () => { seq = newest(10, one.checked); runSeq(0); }), b('Play the newest 20', () => { seq = newest(20, one.checked); runSeq(0); }), el('label', { htmlFor: 'oneper', className: 'chk' }, [one, document.createTextNode(' One take per version (the better one)')]), b('Stop', stopSeq)]),
  seqNote,
  el('p', { className: 'small', textContent: 'Suno\'s player does not let another page start it or tell it when a song ends, so here the next song loads after the last one\'s length, and you may need to press play each time. To play straight through without pressing, use the same lists as playlists on suno.com:' }),
  el('ul', { className: 'small', id: 'sunolists' }),
]);
fetch('/data/playlists.json', { cache: 'no-cache' }).then((r) => r.json()).then((pl) => document.getElementById('sunolists').replaceChildren(...pl.playlists.map((x) => el('li', {}, [el('a', { href: x.url, textContent: x.name }), document.createTextNode(`, on suno.com, one take per version`)])))).catch(() => {});
out.replaceChildren(
  seqBox,
  el('div', { className: 'controls' }, [b('Play Listening in order', () => { stopSeq(); mode = 'listening'; next(0); }), b('Shuffle Liked on a loop', () => { stopSeq(); mode = 'liked'; shuffled = []; next(1); }), b('Previous', () => next(-1)), b('Next', () => next(1)), archBtn]),
  now, frame, offerBox, board,
  el('div', { className: 'row' }, [b('Copy my board and notes', async () => { const t = exportText(); try { await navigator.clipboard.writeText(t); copyMsg.textContent = 'Copied: paste it to the team.'; } catch { copyOut.hidden = false; copyOut.textContent = t; copyMsg.textContent = 'Copy is blocked here: select the text below.'; } }), copyMsg]), copyOut,
);
draw();
