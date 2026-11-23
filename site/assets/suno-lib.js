// Shared by the designs under /designs/: loads data/songs.json and makes the small pieces every design needs.
// Suno's player (suno.com/embed/<id>) is only created when a visitor asks for it.
export const el = (tag, props = {}, kids = []) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (k.startsWith('aria-') || k.startsWith('data-') || k === 'role') e.setAttribute(k, v); else e[k] = v; }
  e.append(...kids); return e;
};
export const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
export const day = (iso) => new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
export const time = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
export async function load() {
  const d = await (await fetch('/data/songs.json', { cache: 'no-cache' })).json();
  const ids = d.stages.map((s) => s.id);
  for (const s of d.songs) s.level = ids.indexOf(s.stage);
  d.byMaturity = [...d.songs].sort((a, b) => b.level - a.level);
  return d;
}
// The five-step ladder, with the song's stage marked: a <ol> each design styles its own way.
export function ladder(song, stages, className = 'ladder') {
  return el('ol', { className, 'aria-label': `${song.title}: stage ${song.stage}` }, stages.map((st, i) =>
    el('li', { className: i < song.level ? 'done' : i === song.level ? 'now' : 'todo', title: st.about, textContent: st.id })));
}
// A Play button that turns into Suno's player in `into` (or after itself).
export function playButton(take, label, into, text = 'Play') {
  const b = el('button', { type: 'button', textContent: text, 'aria-label': `Play ${label}` });
  b.addEventListener('click', () => {
    const f = el('iframe', { src: `https://suno.com/embed/${take.id}`, title: `${label}, Suno player`, allow: 'autoplay; encrypted-media' });
    (into || b.parentElement).append(f); b.disabled = true; b.textContent = 'Playing';
  });
  return b;
}
// One tap: both takes of a version side by side.
export function compareButton(version, title, into) {
  const b = el('button', { type: 'button', textContent: 'Compare A and B', 'aria-label': `Compare both takes of ${title}, version ${version.n}` });
  b.addEventListener('click', () => {
    into.replaceChildren(...version.takes.map((t, i) => el('figure', { className: 'cmp' }, [
      el('figcaption', { textContent: `Take ${'AB'[i]} · ${mmss(t.duration_s)}` }),
      el('iframe', { src: `https://suno.com/embed/${t.id}`, title: `${title}, version ${version.n}, take ${'AB'[i]}, Suno player`, allow: 'autoplay; encrypted-media' })])));
    into.hidden = false; into.scrollIntoView({ block: 'nearest' });
  });
  return b;
}
export const unofficial = () => el('p', { className: 'unofficial', textContent: 'Unofficial: not made, run or endorsed by Suno, and not affiliated with Suno. Songs and players are served by suno.com.' });
