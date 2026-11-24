# Site__Platform__Suno

suno.platform.sovereignweb.site: songs made with Suno's AI music model by Dinis Cruz and his team of AI agents, organised by song and by how far along each is, from idea to release. Played through Suno's own player. Unofficial: not affiliated with Suno.

## What is here

| Path | What it is |
|---|---|
| `site/` | The whole site: static files, no server, no cookies, no tracking. Published by GitHub Pages from `dev`. |
| `site/data/songs.json` | Every song, its versions and its two takes, its stage, brief and prompt. The pages read this. |
| `site/data/budget.json`, `docs/spend.md` | Suno credits: the monthly allowance, what is used, every spend. |
| `site/songs/<slug>/` | One page per song: brief, thinking, exact prompt, timings, versions, cost, feedback. |
| `site/designs/` | Five designs of the same songs (crate, poster, desk, radio, liner notes). |
| `site/lyrics/` | Lyrics, one text file per song (never lyrics that name people who have not agreed). |
| `site/factory/dinis-cruz/account-b/` | The keeper agent's own area: role, learnings, decisions, open work, how to restart it. |
| `site/decisions/requests/` | Requests for Dinis's decisions, sent to decisions.b by link. |
| `tools/` | `designs.py` and `pages.py` regenerate the designs, song pages, budget, playlist and area page. |
| `.github/` | The pipeline: signer check, build, link previews, quality, HTML validity, accessibility, deploy. |

## Build and check (before every push)

```
python3 tools/designs.py && python3 tools/pages.py   # only if you changed songs.json or a generator
node .github/ci/build.mjs                            # builds _site/
node .github/ci/share-check.mjs _site
node .github/ci/quality.mjs _site
npx --yes html-validate@8.24.0 --config .github/ci/htmlvalidate.json "_site/**/*.html"
node .github/ci/axe.mjs _site                        # needs playwright and @axe-core/playwright
```
The same checks run on every push to `dev`; a failing one stops the deploy.

## Changing it yourself

Most changes are edits on github.com to `site/data/songs.json` or a page's wording: see [docs/continue-yourself.md](docs/continue-yourself.md). Push to `dev` only, never `main`.

## Do not touch without the owner's yes

`site/policy/**`, `.github/**`, `site/CNAME`, `CLAUDE.md` (the site's policy, `site/policy/abp.json`). Never commit a key, a token or a private person's details. Agents sign every commit with their own published key; people's commits are checked by GitHub's verified signature.

## Who reviews

- Dinis Cruz (the owner) decides; his decisions reach agents through decisions.b's signed records.
- design.b.rounds reviews the design and accessibility in rounds (design.agents.sovereignweb.site).
- The keeper, suno.b@SovereignWebsite.dinis, keeps the site and makes the songs: its area is [site/factory/dinis-cruz/account-b/](site/factory/dinis-cruz/account-b/).

Code Apache-2.0; text CC BY 4.0. Songs and players are served by suno.com under Suno's terms.
