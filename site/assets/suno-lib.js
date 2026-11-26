// Shared by the designs under /designs/: loads data/songs.json and makes the small pieces every design needs.
// Suno's player (suno.com/embed/<id>) is only created when a visitor asks for it.
export const el = (tag, props = {}, kids = []) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (k.startsWith('aria-') || k.startsWith('data-') || k === 'role') e.setAttribute(k, v); else e[k] = v; }
  if (tag === 'img') e.referrerPolicy = 'no-referrer';
  e.append(...kids); return e;
};
export const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
export const day = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
export const time = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
export async function load() {
  const d = await (await fetch('/data/songs.json', { cache: 'no-cache' })).json();
  d.all = d.songs; d.songs = d.all.filter((s) => !s.archived);
  const ids = d.stages.map((s) => s.id);
  for (const s of d.all) s.level = ids.indexOf(s.stage);
  const last = (s) => s.versions[s.versions.length - 1].made;
  d.byMaturity = [...d.songs].sort((a, b) => b.level - a.level || (last(b) > last(a) ? 1 : -1));
  return d;
}
// The five-step ladder, with the song's stage marked (aria-current="step"): a <ol> each design styles its own way.
export function ladder(song, stages, className = 'ladder') {
  return el('ol', { className, 'aria-label': 'Stage' }, stages.map((st, i) => {
    const li = el('li', { className: i < song.level ? 'done' : i === song.level ? 'now' : 'todo', title: st.about, textContent: st.id });
    if (i === song.level) li.setAttribute('aria-current', 'step');
    return li; }));
}
export const stageLine = (song, stages) => `Stage: ${song.stage}, ${song.level + 1} of ${stages.length} · ${song.versions.length} ${song.versions.length === 1 ? 'version' : 'versions'}`;
// A take button that loads Suno's player into a shared slot `into`: one player per slot, so a second take replaces the
// first in place and only one can play. The caption says which take is loaded and that Suno's player needs its own press.
export function playButton(take, label, into, text = 'Play') {
  const b = el('button', { type: 'button', textContent: text, className: 'takebtn', 'aria-pressed': 'false', 'aria-label': `Load ${label}` });
  (into._btns ||= []).push(b);
  b.addEventListener('click', () => {
    let cap = into.querySelector('.abnote'), f = into.querySelector('iframe');
    if (!f || !cap) { cap = el('p', { className: 'abnote' }); f = el('iframe', { allow: 'autoplay; encrypted-media' }); into.replaceChildren(cap, f); }
    f.src = `https://suno.com/embed/${take.id}`; f.title = `${label}, Suno player`;
    cap.textContent = `Loaded below: ${label}. Press play in Suno's player.`;
    into._btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    into.hidden = false;
  });
  return b;
}
// One tap to compare: one player slot with an A/B switch; B replaces A in place, so only one plays.
export function compareButton(version, title, into) {
  const b = el('button', { type: 'button', textContent: 'Compare A and B', 'aria-label': `Compare the two takes of ${title}, version ${version.n}` });
  b.addEventListener('click', () => {
    const slot = el('div', { className: 'abslot' });
    const note = el('p', { className: 'abnote', textContent: "Take A is loaded: press play in Suno's player, or switch to B." });
    const sw = version.takes.map((t, i) => {
      const x = el('button', { type: 'button', className: 'abswitch', 'aria-pressed': String(i === 0), textContent: `Take ${(t.side || 'AB'[i])} · ${mmss(t.duration_s)}` });
      x.addEventListener('click', () => { sw.forEach((y) => y.setAttribute('aria-pressed', String(y === x))); f.src = `https://suno.com/embed/${t.id}`; f.title = `${title}, version ${version.n}, take ${(t.side || 'AB'[i])}, Suno player`; note.textContent = `Take ${(t.side || 'AB'[i])} is loaded: press play in Suno's player.`; });
      return x; });
    const f = el('iframe', { src: `https://suno.com/embed/${version.takes[0].id}`, title: `${title}, version ${version.n}, take A, Suno player`, allow: 'autoplay; encrypted-media' });
    slot.append(f);
    (into._btns || []).forEach((x) => x.setAttribute('aria-pressed', 'false'));
    into.replaceChildren(el('div', { className: 'abbar', role: 'group', 'aria-label': `${title}, version ${version.n}: takes` }, [el('b', { textContent: `Version ${version.n}` }), ...sw]), note, slot);
    into.hidden = false; into.scrollIntoView({ block: 'nearest' });
  });
  return b;
}
export const unofficial = () => el('p', { className: 'unofficial', textContent: 'Unofficial: not made, run or endorsed by Suno, and not affiliated with Suno. Songs and players are served by suno.com.' });
