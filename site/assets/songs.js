// Renders site/data/songs.json. Suno's player (suno.com/embed/<id>) loads only when a visitor presses Play.
(async () => {
  const list = document.getElementById('list'), count = document.getElementById('count');
  const fam = document.getElementById('family'), stage = document.getElementById('stage');
  let data;
  try { data = await (await fetch('/data/songs.json', { cache: 'no-cache' })).json(); }
  catch { count.textContent = 'The song list could not be loaded.'; return; }
  for (const f of data.families) fam.add(new Option(f.name, f.name));
  const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const el = (tag, props = {}, kids = []) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
  const render = () => {
    const songs = data.songs.filter((s) => (!fam.value || s.family === fam.value) && (!stage.value || s.stage === stage.value));
    count.textContent = `${songs.length} of ${data.songs.length} songs`;
    list.replaceChildren(...songs.map((s, i) => {
      const play = el('button', { type: 'button', textContent: 'Play here' });
      const vote = el('button', { type: 'button', textContent: 'Vote', disabled: true, title: 'Voting opens soon' });
      const li = el('li', { className: 'song' }, [
        el('img', { src: `https://cdn1.suno.ai/image_${s.id}.jpeg`, alt: '', loading: 'lazy', width: 72, height: 72 }),
        el('h3', { textContent: s.title }),
        el('p', { className: 'meta', textContent: [s.stage, mmss(s.duration_s), s.model, s.style].filter(Boolean).join(' · ') }),
        el('div', { className: 'acts' }, [play, vote, el('a', { href: `https://suno.com/song/${s.id}`, textContent: 'Open on Suno' })]),
      ]);
      play.addEventListener('click', () => {
        if (li.querySelector('iframe')) return;
        li.append(el('iframe', { src: `https://suno.com/embed/${s.id}`, title: `${s.title}, Suno player`, allow: 'autoplay; encrypted-media', loading: 'lazy' }));
        play.disabled = true; play.textContent = 'Playing below';
      });
      return li;
    }));
  };
  fam.addEventListener('change', render); stage.addEventListener('change', render);
  render();
})();
