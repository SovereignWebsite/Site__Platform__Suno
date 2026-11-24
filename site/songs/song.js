// One song's own page: the brief, the thinking, the exact prompt, how each take turned out (with timings), the
// versions, the lyrics, the credits it cost, and a feedback box kept in this browser.
import { load, el, ladder, stageLine, mmss, day, time, playButton } from '/assets/suno-lib.js';
import { vote, hasVoted, votesToday, note, saveNote, asText } from '/assets/local.js';
const slug = document.querySelector('main').dataset.slug, out = document.getElementById('song');
const d = await load(), s = d.songs.find((x) => x.slug === slug);
if (!s) { out.textContent = 'This song is not in the list.'; } else {
  const latest = s.versions[s.versions.length - 1];
  const slot = el('div', { className: 'slot', hidden: true });
  const sec = (title, kids, id) => el('section', { id }, [el('h2', { textContent: title }), ...kids]);
  const timeline = (t) => {
    if (!t.listen) return el('span');
    const total = t.duration_s, bar = el('div', { className: 'tl', role: 'img', 'aria-label': `Sections and stops of take: ${t.listen.sections.map(([a, b, n]) => `${n} ${mmss(a)} to ${mmss(b)}`).join('; ')}; stops at ${t.listen.stops.map(([x]) => mmss(x)).join(', ')}` });
    t.listen.sections.forEach(([a, b, n], i) => { const seg = el('span', { className: `seg s${i % 4}`, textContent: n }); seg.style.left = `${(a / total) * 100}%`; seg.style.width = `${((b - a) / total) * 100}%`; bar.append(seg); });
    t.listen.stops.forEach(([x]) => { const m = el('i', { className: 'stop' }); m.style.left = `${(x / total) * 100}%`; bar.append(m); });
    return el('div', {}, [bar, el('ul', { className: 'stops' }, t.listen.stops.map(([x, w]) => el('li', { textContent: `${mmss(x)}: ${w}` })))]);
  };
  const takeCard = (v, t, i) => {
    const name = `Take ${'AB'[i]}`, label = `${s.title}, version ${v.n}, ${name.toLowerCase()}`;
    const vb = el('button', { type: 'button', className: 'vote', textContent: hasVoted(t.id) ? 'Voted' : 'Vote', disabled: hasVoted(t.id) });
    const vmsg = el('span', { className: 'small', 'aria-live': 'polite' });
    vb.addEventListener('click', () => { const r = vote(s.slug, v.n, t.id); if (r.ok) { vb.textContent = 'Voted'; vb.disabled = true; vmsg.textContent = 'Saved in this browser.'; } else vmsg.textContent = r.why; });
    const L = t.listen;
    return el('div', { className: 'take' }, [
      el('h3', { textContent: `${name} · ${mmss(t.duration_s)}` }),
      L ? el('p', { textContent: L.summary }) : el('p', { className: 'small', textContent: 'Not yet listened to by Suno\'s listening tool.' }),
      ...(L ? [el('p', { className: 'small', textContent: `${L.bpm} bpm · ${L.key} · lead: ${L.lead.join(', ')} · melody ${L.melody_strength} of 5 · ${L.vocals ? 'with vocals' : 'no vocals'}` }), timeline(t)] : []),
      el('div', { className: 'row' }, [playButton(t, label, slot, `Load ${name}`), vb, el('a', { href: `https://suno.com/song/${t.id}`, textContent: 'On Suno' }), vmsg]),
    ]);
  };
  const prompt = (v) => v.prompt ? el('dl', { className: 'prompt' }, [
    el('dt', { textContent: 'Mode' }), el('dd', { textContent: v.prompt.mode || '' }),
    el('dt', { textContent: 'Style' }), el('dd', {}, [el('code', { textContent: v.prompt.style || '(not recorded)' })]),
    ...(v.prompt.negative_style ? [el('dt', { textContent: 'Styles to avoid' }), el('dd', {}, [el('code', { textContent: v.prompt.negative_style })])] : []),
    ...(v.prompt.suno_expanded ? [el('dt', { textContent: 'Suno expanded it to' }), el('dd', {}, [el('code', { textContent: v.prompt.suno_expanded })])] : []),
    ...(v.prompt.controls ? [el('dt', { textContent: 'Controls' }), el('dd', { textContent: v.prompt.controls })] : []),
    ...(v.prompt.duration_s ? [el('dt', { textContent: 'Target length' }), el('dd', { textContent: mmss(v.prompt.duration_s) })] : []),
    el('dt', { textContent: 'Model' }), el('dd', { textContent: v.model }),
    ...(v.prompt.lyrics_file ? [el('dt', { textContent: 'Lyrics' }), el('dd', {}, [el('a', { href: v.prompt.lyrics_file, textContent: 'as sent' })])] : []),
  ]) : el('p', { className: 'small', textContent: 'Prompt not recorded.' });
  const credits = s.versions.reduce((n, v) => n + (v.credits || 0), 0), unknown = s.versions.filter((v) => v.credits == null).length;
  const lyr = el('div');
  if (s.lyrics_note && !s.lyrics_by) lyr.append(el('p', { className: 'small', textContent: s.lyrics_note }));
  else if (s.instrumental) lyr.append(el('p', { className: 'small', textContent: 'Instrumental: no lyrics.' }));
  else fetch(`/lyrics/${s.slug}.txt`).then((r) => r.ok ? r.text() : Promise.reject()).then((t) => lyr.append(...(s.lyrics_note ? [el('p', { className: 'small', textContent: s.lyrics_note })] : []), el('pre', { textContent: t.split('\n').slice(3).join('\n') }))).catch(() => lyr.append(el('p', { className: 'small', textContent: 'Lyrics not available.' })));
  const ta = el('textarea', { id: 'fb', rows: 5, value: note(s.slug) });
  const saved = el('span', { className: 'small', 'aria-live': 'polite' });
  ta.addEventListener('input', () => { saved.textContent = saveNote(s.slug, ta.value) ? 'Saved in this browser.' : 'This browser does not allow saving.'; });
  const copy = el('button', { type: 'button', textContent: 'Copy my feedback' });
  copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(asText()); saved.textContent = 'Copied: paste it to the team.'; } catch { saved.textContent = 'Copy is blocked here: select the text below instead.'; outbox.hidden = false; outbox.textContent = asText(); } });
  const outbox = el('pre', { hidden: true });
  out.replaceChildren(
    el('header', { className: 'hero' }, [el('img', { src: latest.takes[0].cover, alt: `Cover of ${s.title}`, width: 160, height: 160 }),
      el('div', {}, [el('h1', { textContent: s.title }), el('p', { textContent: s.about }), el('p', { className: 'stageline', textContent: stageLine(s, d.stages) }), ladder(s, d.stages)])]),
    sec('Listen', [el('p', { className: 'small', textContent: `Newest: version ${latest.n}, ${latest.label}. One player: loading the other take replaces it.` }), el('div', { className: 'takes' }, latest.takes.map((t, i) => takeCard(latest, t, i))), slot], 'listen'),
    sec('The brief', [el('p', { className: 'small', textContent: s.brief?.asked_by || 'Not recorded.' }), ...(s.brief?.words ? [el('blockquote', { textContent: s.brief.words })] : []),
      ...(s.brief?.thinking?.length ? [el('h3', { textContent: 'The thinking' }), el('ol', {}, s.brief.thinking.map((x) => el('li', { textContent: x })))] : [])], 'brief'),
    sec('The prompt', [...(latest.brief ? [el('h3', { textContent: `What was asked for version ${latest.n}` }), el('p', { className: 'small', textContent: latest.brief.asked_by }), el('blockquote', { textContent: latest.brief.words }), el('ol', {}, latest.brief.thinking.map((x) => el('li', { textContent: x })))] : []), el('p', { className: 'small', textContent: `Exactly what was sent to Suno for version ${latest.n}. Ask for a revision on any line.` }), prompt(latest), ...(latest.result ? [el('h3', { textContent: 'How it turned out' }), el('p', { textContent: latest.result })] : [])], 'prompt'),
    sec('Lyrics', [lyr], 'lyrics'),
    sec(`Versions (${s.versions.length})`, [el('ol', { className: 'versions', reversed: true }, [...s.versions].reverse().map((v) => el('li', {}, [
      el('b', { textContent: `Version ${v.n}: ${v.label}` }), el('span', { className: 'small', textContent: ` · ${day(v.made)} ${time(v.made)} UTC · ${v.takes.map((t) => mmss(t.duration_s)).join(' and ')}${v.credits != null ? ` · ${v.credits} credits` : ''}` }),
      el('details', {}, [el('summary', { textContent: 'Prompt, result and takes' }), prompt(v), ...(v.result ? [el('p', { textContent: v.result })] : []), el('div', { className: 'row' }, v.takes.map((t, i) => playButton(t, `${s.title}, version ${v.n}, take ${'AB'[i]}`, slot, `Load take ${'AB'[i]}`)))])])))], 'versions'),
    sec('What it cost', [el('p', { textContent: `${credits} song credits for the versions made here${unknown ? `; ${unknown} earlier version${unknown === 1 ? '' : 's'} made on suno.com before this site, at about 10 credits each` : ''}. ` }, [el('a', { href: '/budget/', textContent: 'The whole budget' })])], 'cost'),
    sec('Your feedback', [el('p', { className: 'small', textContent: `Votes and notes stay in this browser for now (${votesToday()} of 3 votes used today); nothing is sent. Use "Copy my feedback" to pass them on.` }),
      el('label', { htmlFor: 'fb', textContent: `Notes on ${s.title}: what to keep, what to change, ideas for the next version` }), ta, el('div', { className: 'row' }, [copy, saved]), outbox], 'feedback'),
  );
}
