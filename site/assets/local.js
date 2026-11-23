// Feedback and votes kept in this browser only (localStorage), until the site's feedback lane is switched on.
// Nothing here is sent anywhere. Every read and write is guarded: private windows and blocked storage just show empty.
const KEY = 'suno-platform-feedback-v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { votes: [], notes: {} }; } catch { return { votes: [], notes: {} }; } };
const write = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch { return false; } };
const today = () => new Date().toISOString().slice(0, 10);
export const votesToday = () => read().votes.filter((v) => v.day === today()).length;
export const hasVoted = (takeId) => read().votes.some((v) => v.take === takeId);
export function vote(song, version, take) {
  const d = read();
  if (d.votes.some((v) => v.take === take)) return { ok: false, why: 'You have already voted for this take.' };
  if (d.votes.filter((v) => v.day === today()).length >= 3) return { ok: false, why: 'Three votes a day: come back tomorrow.' };
  d.votes.push({ song, version, take, day: today(), at: new Date().toISOString() });
  return write(d) ? { ok: true } : { ok: false, why: 'This browser does not allow saving.' };
}
export const note = (slug) => read().notes[slug] || '';
export function saveNote(slug, text) { const d = read(); d.notes[slug] = text; return write(d); }
export function asText() {
  const d = read(), lines = ['Feedback for suno.platform.sovereignweb.site', `Written ${new Date().toISOString().slice(0, 16)} UTC`, ''];
  for (const v of d.votes) lines.push(`Vote: ${v.song}, version ${v.version}, take ${v.take} (${v.day})`);
  for (const [k, t] of Object.entries(d.notes)) if (t.trim()) lines.push('', `On ${k}:`, t.trim());
  return lines.join('\n');
}
export function clearAll() { try { localStorage.removeItem(KEY); } catch { /* nothing stored */ } }
