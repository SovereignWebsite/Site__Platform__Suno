// The Suno credits: what the month allows, what has been used, what is left, and every spend.
import { el } from '/assets/suno-lib.js';
const b = await (await fetch('/data/budget.json', { cache: 'no-cache' })).json(), out = document.getElementById('budget');
const sc = b.song_credits, pct = Math.round((sc.used / sc.monthly_limit) * 100);
const days = Math.max(0, Math.ceil((new Date(`${b.renews_on}T00:00:00Z`) - new Date()) / 86400000));
const n = (x) => x.toLocaleString('en-GB');
const meter = el('div', { className: 'meter', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(sc.monthly_limit), 'aria-valuenow': String(sc.used), 'aria-label': 'Song credits used this month' }, [el('span')]);
meter.firstChild.style.width = `${Math.max(pct, 1)}%`;
out.replaceChildren(
  el('div', { className: 'tiles' }, [
    el('div', { className: 'tile' }, [el('b', { textContent: n(sc.left) }), el('span', { textContent: `song credits left of ${n(sc.monthly_limit)}` })]),
    el('div', { className: 'tile' }, [el('b', { textContent: n(Math.floor(sc.left / b.cost.generation)) }), el('span', { textContent: `more generations (two takes each, ${b.cost.generation} credits)` })]),
    el('div', { className: 'tile' }, [el('b', { textContent: n(b.download_credits.left) }), el('span', { textContent: 'full-quality downloads left (1 credit each)' })]),
    el('div', { className: 'tile' }, [el('b', { textContent: String(days) }), el('span', { textContent: `days until the credits renew (${b.renews_on})` })]),
  ]),
  el('p', { textContent: `${n(sc.used)} of ${n(sc.monthly_limit)} song credits used this month (${pct}%), ${b.plan}. Read from Suno on ${b.read_at.replace('T', ' ').replace('Z', ' UTC')}.` }), meter,
  el('h2', { textContent: 'Every spend' }),
  el('table', {}, [el('thead', {}, [el('tr', {}, ['When (UTC)', 'What', 'Song credits', 'Asked by'].map((h) => el('th', { scope: 'col', textContent: h })))]),
    el('tbody', {}, b.log.map((r) => el('tr', {}, [el('td', { textContent: r.when.replace('T', ' ').replace('Z', '') }), el('td', { textContent: r.what }), el('td', { textContent: String(r.song_credits) }), el('td', { textContent: r.asked_by || '' })])))]),
);
