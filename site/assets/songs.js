// Renders site/data/songs.json: songs, their versions (one Suno generation each) and the two takes of each.
// One player slot per version with an A/B switch: Suno's player (suno.com/embed/<id>) loads only on press, and B replaces A.
(async () => {
  const list = document.getElementById('list');
  let data;
  try { data = await (await fetch('/data/songs.json', { cache: 'no-cache' })).json(); }
  catch { list.textContent = 'The songs could not be loaded.'; return; }
  const el = (tag, props = {}, kids = []) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) { if (k.startsWith('aria-') || k === 'role') e.setAttribute(k, v); else e[k] = v; }
    if (tag === 'img') e.referrerPolicy = 'no-referrer';
    e.append(...kids); return e;
  };
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const when = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';
  const abPlayer = (v, title) => {
    const slot = el('div', { className: 'slot' });
    const note = el('p', { className: 'vmeta', textContent: "Loads Suno's player, which runs Suno's code." });
    const btns = v.takes.map((t, i) => {
      const b = el('button', { type: 'button', className: 'ab', 'aria-pressed': 'false', 'aria-label': `Play ${title}, take ${'AB'[i]}, ${mmss(t.duration_s)}` }, [el('b', { textContent: `Take ${'AB'[i]}` }), el('span', { textContent: mmss(t.duration_s) })]);
      b.addEventListener('click', () => {
        btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        const f = slot.querySelector('iframe') || slot.appendChild(el('iframe', { allow: 'autoplay; encrypted-media' }));
        f.title = `${title}, take ${'AB'[i]}, Suno player`; f.src = `https://suno.com/embed/${t.id}`;
        note.textContent = `Take ${'AB'[i]} is loaded below: press play in Suno's player.`;
      });
      return b;
    });
    const vote = el('button', { type: 'button', className: 'vote', textContent: 'Vote', disabled: true });
    return el('div', { className: 'abwrap' }, [
      el('div', { className: 'abrow', role: 'group', 'aria-label': `${title}: takes` }, [...btns, vote, el('span', { className: 'soon', textContent: 'Voting opens soon' })]),
      note, slot,
      el('p', { className: 'vmeta' }, v.takes.map((t, i) => el('a', { href: `https://suno.com/song/${t.id}`, textContent: `Take ${'AB'[i]} on Suno`, className: 'onsuno' }))),
    ]);
  };
  const version = (v, s, heading) => el('div', {}, [
    el(heading, { textContent: `Version ${v.n} of ${s.versions.length}: ${v.label}` }),
    el('p', { className: 'vmeta', textContent: [when(v.made), v.model, v.style].filter(Boolean).join(' · ') }),
    abPlayer(v, `${s.title}, version ${v.n}`),
  ]);
  const stages = data.stages.map((x) => x.id);
  fetch('/data/budget.json', { cache: 'no-cache' }).then((r) => r.json()).then((b) => {
    const strip = document.getElementById('budgetline'); if (!strip) return;
    strip.replaceChildren(document.createTextNode(`Credits: ${b.song_credits.left.toLocaleString('en-GB')} of ${b.song_credits.monthly_limit.toLocaleString('en-GB')} left this month (about ${Math.floor(b.song_credits.left / b.cost.generation)} more generations), ${b.download_credits.left} downloads left, renews ${b.renews_on}. `), el('a', { href: '/budget/', textContent: 'Budget' }));
  }).catch(() => {});
  const archived = data.songs.filter((s) => s.archived); data.songs = data.songs.filter((s) => !s.archived);
  const arch = document.getElementById('archived');
  if (arch && archived.length) arch.replaceChildren(el('summary', { textContent: `Archived songs (${archived.length})` }), el('ul', {}, archived.map((s) => el('li', {}, [el('a', { href: `/songs/${s.slug}/`, textContent: s.title }), document.createTextNode(`: ${s.archived.why}`)]))));
  if (arch) arch.hidden = !archived.length;
  list.replaceChildren(...data.songs.map((s) => {
    const latest = s.versions[s.versions.length - 1], at = stages.indexOf(s.stage);
    const ladder = el('ol', { className: 'ladder', 'aria-label': 'Stage' }, data.stages.map((st, i) => {
      const li = el('li', { className: i < at ? 'done' : i === at ? 'now' : '', textContent: st.id, title: st.about });
      if (i === at) li.setAttribute('aria-current', 'step');
      return li; }));
    const older = s.versions.slice(0, -1).reverse();
    return el('article', { className: 'songcard', id: s.slug }, [
      el('div', { className: 'songhead' }, [
        el('img', { src: latest.takes[0].cover, alt: '', width: 120, height: 120, loading: 'lazy' }),
        el('div', {}, [el('h3', {}, [el('a', { href: `/songs/${s.slug}/`, textContent: s.title })]), el('p', { className: 'about', textContent: s.about }),
          el('p', { className: 'stageline', textContent: `Stage: ${s.stage}, ${at + 1} of ${stages.length} · version ${latest.n} of ${s.versions.length}` }), ladder,
          ...(s.lyrics_by ? [el('p', { className: 'vmeta' }, [el('a', { href: `/lyrics/${s.slug}.txt`, textContent: 'Read the lyrics' })])] : [])]),
      ]),
      el('section', { className: 'latest' }, [version(latest, s, 'h4')]),
      el('p', { className: 'vmeta' }, [el('a', { href: `/songs/${s.slug}/`, textContent: `The brief, the prompt, timings and feedback for ${s.title}` })]),
      ...(older.length ? [el('details', { className: 'history' }, [
        el('summary', { textContent: `Earlier versions (${older.length})` }),
        el('ol', {}, older.map((v) => el('li', {}, [version(v, s, 'h4')]))),
      ])] : []),
    ]);
  }));
})();
