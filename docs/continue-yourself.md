# Carry on with this site yourself

For Dinis (the owner) or anyone with push on dev. No agent is needed for any of this. Edit on github.com (open the file, press the pencil, commit to dev); the site rebuilds in about a minute. Commits by a person are checked by GitHub's own verified signature.

## The songs: `site/data/songs.json`
- Move a song up the ladder: change its `"stage"` to `idea`, `experiment`, `shortlist`, `pre-release` or `released`. Every page and design follows.
- Pick a take: set the song's `"pick"` to the take's id.
- Add a song you made on suno.com: make it public there, copy the two ids from the song links (suno.com/song/<id>), and add an entry like the others: `slug`, `title`, `about`, `stage`, and one version with `n`, `made`, `label`, `model`, `style` and its two `takes` (`id`, `duration_s`, `cover`: `https://cdn2.suno.ai/image_<id>.jpeg` for new songs). A song page also needs a copy of `site/songs/parada/index.html` at `site/songs/<slug>/index.html` with `data-slug` changed.
- Add a new version of a song: append to its `versions`, oldest first, with the next `n`.
- Write the brief and the thinking: the song's `brief.words` and `brief.thinking` show on its page.
- Hide a song: remove its entry (the song stays on Suno).

## Lyrics: `site/lyrics/<slug>.txt`
Three header lines (title, credits, a blank), then the lyrics. Do not publish lyrics that name people who have not agreed.

## The budget: `site/data/budget.json`
Copy the numbers from suno.com (Account, Usage): `song_credits.used` and `left`, `download_credits.left`, `renews_on`, and `read_at`. Add a line to `log` for each spend. The working limit to 30 November is 100 song credits and 5 downloads (record 2026-11-23__asks-22-to-32).

## Wording
Any page under `site/` is plain HTML: change words directly. The draft notice ("Draft: first version ... not yet signed off by Dinis Cruz") is in `site/index.html` and on every design and song page (`site/designs/*/index.html`, `site/songs/*/index.html`): delete it when you sign the site off.

## Making songs without an agent
Make them on suno.com as usual, then add them as above. An agent is only needed to make songs through Suno's connection, read the listening analysis, or regenerate pages.

## What still needs someone else
- Voting and messages that reach the team: feedback.b's lane. It needs one sentence from you in feedback.b's session: "feedback.b: build the suno lane for suno.b".
- `site/policy/**`, `.github/**`, `site/CNAME`, `CLAUDE.md`: need your yes (site ABP).
