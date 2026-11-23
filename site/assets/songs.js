// Renders site/data/songs.json: songs, their versions (one Suno generation each) and the two takes of each.
// Suno's player (suno.com/embed/<id>) loads only when a visitor presses Play.
(async () => {
  const list = document.getElementById('list');
  let data;
  try { data = await (await fetch('/data/songs.json', { cache: 'no-cache' })).json(); }
  catch { list.textContent = 'The songs could not be loaded.'; return; }
  const el = (tag, props = {}, kids = []) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const when = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
  const take = (t, name, title) => {
    const play = el('button', { type: 'button', textContent: 'Play' });
    const vote = el('button', { type: 'button', textContent: 'Vote', disabled: true, title: 'Voting opens soon' });
    const box = el('div', { className: 'take' }, [el('b', { textContent: name }), el('span', { textContent: mmss(t.duration_s) }), play, vote, el('a', { href: `https://suno.com/song/${t.id}`, textContent: 'On Suno', 'aria-label': `${title}, ${name}, on Suno` })]);
    play.setAttribute('aria-label', `Play ${title}, ${name}`); vote.setAttribute('aria-label', `Vote for ${title}, ${name}`);
    play.addEventListener('click', () => {
      box.append(el('iframe', { src: `https://suno.com/embed/${t.id}`, title: `${title}, ${name}, Suno player`, allow: 'autoplay; encrypted-media' }));
      play.disabled = true; play.textContent = 'Playing below';
    });
    return box;
  };
  const version = (v, title, heading) => el('div', {}, [
    el(heading, { textContent: `Version ${v.n}: ${v.label}` }),
    el('p', { className: 'vmeta', textContent: [when(v.made), v.model, v.style].filter(Boolean).join(' · ') }),
    el('div', { className: 'takes' }, v.takes.map((t, i) => take(t, `Take ${'AB'[i]}`, `${title}, version ${v.n}`))),
  ]);
  const stages = data.stages.map((s) => s.id);
  list.replaceChildren(...data.songs.map((s) => {
    const latest = s.versions[s.versions.length - 1], at = stages.indexOf(s.stage);
    const ladder = el('ol', { className: 'ladder', 'aria-label': `Stage: ${s.stage}` }, data.stages.map((st, i) =>
      el('li', { className: i < at ? 'done' : i === at ? 'now' : '', textContent: st.id, title: st.about })));
    const older = s.versions.slice(0, -1).reverse();
    return el('article', { className: 'songcard', id: s.slug }, [
      el('div', { className: 'songhead' }, [
        el('img', { src: `https://cdn1.suno.ai/image_${latest.takes[0].id}.jpeg`, alt: '', width: 120, height: 120, loading: 'lazy' }),
        el('div', {}, [el('h3', { textContent: s.title }), el('p', { className: 'about', textContent: s.about }), ladder]),
      ]),
      el('section', { className: 'latest' }, [version(latest, s.title, 'h4')]),
      el('details', { className: 'history' }, [
        el('summary', { textContent: `Earlier versions (${older.length})` }),
        el('ol', {}, older.map((v) => el('li', {}, [version(v, s.title, 'h4')]))),
      ]),
    ]);
  }));
})();
