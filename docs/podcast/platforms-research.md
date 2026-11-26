# Audio platforms: upload by API and stats by API

Research from public sources only. Every source below was read on **26 Nov 2026**. Where a page shows a publication or "last updated" date, it is given; "no date shown" means the page carries none. Anything I could not confirm from a page I read is marked **not confirmed**. Spotify is out of scope (one line at the end).

Question: where can a program publish Suno songs and an AI-voiced presenter show by API, and read back plays, listeners and likes by API, ideally near real time?

## Summary table

| Platform | Upload by API | Stats by API | Freshest granularity documented | AI audio allowed? |
|---|---|---|---|---|
| YouTube | Yes, `videos.insert` (OAuth 2.0) | Yes, Analytics API + Data API counters | Day (Analytics); live counters (Data API) | Yes, with disclosure when realistic |
| SoundCloud | Yes, `POST /tracks` (OAuth 2.1), Artist Pro needed for an app | Cumulative counters only on the track object | Snapshot when polled | Yes, but no impersonation or "AI Abuse" |
| Spreaker | Yes, `POST /v2/shows/SHOW-ID/episodes` (Bearer token) | Yes, plays, likes, listeners, sources, devices, geo | Day (`group=day`) | Yes, AI label required |
| Transistor | Yes, authorise upload, PUT, `POST /v1/episodes` (`x-api-key`) | Downloads per day | Day | No clause on AI uploads found |
| Buzzsprout | Yes, `POST /api/:podcast_id/episodes` + upload endpoints (token) | Downloads for one date, with app/device/place | Day | Not found (terms page not reachable) |
| Podbean | Yes, `/files/uploadAuthorize` then `POST /episodes` (OAuth) | Downloads daily or monthly; more on higher plans | Day, up to yesterday | AI allowed with duties, but **no music distribution** |
| Captivate | Yes, `POST /shows/:id/media` then `POST /episodes` (Bearer) | Yes, `/insights/...` with `interval` | `1d` in the examples | No AI clause found |
| RSS.com | Yes (Max plan) | **No** analytics endpoints (CSV export only) | n/a | Yes, with disclosure |
| Mixcloud | Yes, `POST https://upload-api.mixcloud.com/` (OAuth) | Not documented | n/a | Restricted (clause 6.4.7) |
| Audiomack | No public upload API | Plays in last 60 minutes per track | Rolling 60 minutes | Not found |
| Bandcamp | No (API for labels and merch partners) | Sales only | n/a | **Banned** if wholly or substantially AI |
| Libsyn | Not confirmed | "Stats API" mentioned for LibsynPro | Not confirmed | Not found |

## Music platforms

### YouTube (Data API v3 plus YouTube Analytics API)
- **Upload:** `POST https://www.googleapis.com/upload/youtube/v3/videos`, OAuth 2.0 with a scope such as `https://www.googleapis.com/auth/youtube.upload`. Max file 256GB; "If you don't specify a value for this property, the uploaded video's privacy status defaults to public." The page also says "Videos uploaded from unverified API projects are not restricted to private viewing mode." Source: [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert), last updated 2026-11-23.
- **Static image:** the endpoint accepts `video/*` or `application/octet-stream` only ([same page](https://developers.google.com/youtube/v3/docs/videos/insert)), so a song must first be rendered as a video file (still image plus audio). That rendering step is our inference, not a YouTube statement.
- **Quota:** "100 search.list calls, 100 videos.insert calls, and 10,000 units per day combined for all other endpoints"; "A video upload costs 1 unit." Source: [Getting started](https://developers.google.com/youtube/v3/getting-started), last updated 2026-11-12. Extra quota can be requested (same page).
- **Stats:** the Analytics API has metrics `views`, `estimatedMinutesWatched`, `averageViewDuration`, `likes`, `dislikes`, `comments`, `shares`, `subscribersGained` and more ([metrics](https://developers.google.com/youtube/analytics/metrics), last updated 2026-11-16). Time dimensions are `day` and `month`; no hour dimension. Data is returned only up to "the last day for which all metrics specified in the request are available", in Pacific time ([dimensions](https://developers.google.com/youtube/analytics/dimensions), last updated 2026-11-12). Exact delay in hours: **not confirmed**. For near real time, the Data API video resource carries `statistics.viewCount`, `likeCount`, `commentCount` that can be polled ([videos resource](https://developers.google.com/youtube/v3/docs/videos), last updated 2026-11-23).
- **Cost:** no price on the pages read; a Google Cloud project and quota apply. Price: **not confirmed**.
- **AI terms and disclosure label:** "We require creators to disclose AI-generated or altered content that seems realistic." The help page lists AI-generated music as needing disclosure, says a label may appear in the player for AI music, and "Labels may appear in the expanded description for non-music AI-generated audio". Source: [Disclosing altered or synthetic content](https://support.google.com/youtube/answer/14328491), no date shown. By API, set `status.containsSyntheticMedia`: "this property allows the channel owner to disclose that a video contains realistic Altered or Synthetic (A/S) content" ([videos resource](https://developers.google.com/youtube/v3/docs/videos)).
- **Monetisation caveat:** from 15 July 2025 the YouTube Partner Program calls this "inauthentic content": "mass-produced or repetitive content ... easily replicable at scale" (reported by [Search Engine Journal](https://searchenginejournal.com/youtube-targets-mass-produced-content-in-monetization-update/550337/), July 2025; YouTube's own page [answer/1311392](https://support.google.com/youtube/answer/1311392?hl=en) was in results but I did not read it in full). Affects earnings, not publishing.

### SoundCloud
- **Upload:** "Send a `POST` request with `multipart/form-data` to the /tracks endpoint", fields `track[title]`, `track[artist]`, `track[asset_data]`; up to 4 GB and 24 hours per upload. Source: [API Guide](https://developers.soundcloud.com/docs/api/guide), no date shown.
- **Auth:** OAuth 2.1 with PKCE; Authorization Code for user resources, Client Credentials for public resources; tokens last about one hour and "Each refresh token is single-use" ([API Guide](https://developers.soundcloud.com/docs/api/guide)).
- **New app registrations:** open, but only with a paid plan: "You need a SoundCloud Artist Pro subscription to register API applications and receive credentials." ([Get an API key](https://developers.soundcloud.com/docs/api/register-app), no date shown). Self-serve keys announced 18 May 2026 ([blog](https://developers.soundcloud.com/blog/vibe-coding-ai-agent-docs-self-serve-api-keys)); a CLI and the OpenAPI spec on GitHub announced 16 June 2026 ([blog](https://developers.soundcloud.com/blog/api-credentials-cli-openapi-github)). Artist Pro price: **not confirmed** (the page links to checkout without a figure).
- **Stats:** no analytics or insights endpoint in the [OpenAPI spec](https://github.com/soundcloud/api/blob/master/openapi/api.yaml) (downloaded 26 Nov 2026; paths are `/me`, `/tracks`, `/playlists`, `/users`, `/resolve` and similar). The track object carries cumulative `playback_count` ("Number of plays"), `likes_count`, `favoritings_count`, `reposts_count`, `comment_count`, `download_count`. So "by day" means polling and storing snapshots ourselves. Listener identities or per-hour plays by API: **not confirmed** (none found).
- **Rate limits:** about 100 requests a minute general; 1,500 stream requests per 24 hours; 3,000 searches an hour; "subject to change" ([Rate limits](https://developers.soundcloud.com/docs/api/rate-limits), no date shown).
- **AI terms:** current [Terms of Use](https://soundcloud.com/terms-of-use) (marked "Last Amended: December 1, 2026") forbid "using the output of generative artificial intelligence to impersonate a person (including a person's voice and likeness) without authorization" and say "You must not use AI to deceive, whether to game our systems, manipulate monetization, earnings, platform features, or users' perception of authenticity ("AI Abuse")". No ban on AI music as such was found. On training: "We will not use your content to train generative AI models that aim to replicate or synthesize your voice, music, or likeness without your explicit consent" (same page; wording first published 14 May 2025 per [TechCrunch](https://techcrunch.com/2025/05/14/soundcloud-backtracks-on-ai-related-terms-of-use-updates/)).
- **Disclosure label:** SoundCloud has a help article [Creators and the EU AI Act](https://help.soundcloud.com/hc/en-us/articles/53642308890651-Creators-and-the-EU-AI-Act) but it returned 403 to me, so its wording is **not confirmed**. Whether an AI flag can be set through the API: **not confirmed**.

### Audiomack
- **Upload:** no upload endpoint in the [Data API docs](https://www.audiomack.com/data-api/docs) (no date shown); only listings such as `GET /v1/user/uploads`. An Audiomack post says a new Upload API "will soon be open to approved apps, partners, and distributors" (search snippet only; the [post](https://audiomack.com/world/post/audiomack-s-new--and-greatly-improved-------upload-system-for-creators-is-here-) returned 404 to me). Public upload: **not confirmed**.
- **Auth:** OAuth 1.0a; access tokens "expire 1 year after they are created" ([docs](https://www.audiomack.com/data-api/docs)).
- **Stats:** `GET /v1/music/:id/metrics` returns event counts "for events happened within last 60 minutes" ([docs](https://www.audiomack.com/data-api/docs)). This is the most real-time stat found anywhere, but only useful once tracks get there by hand or via a distributor.
- **Rate limits, cost:** not confirmed. **AI terms:** not found on [Terms of Service](https://audiomack.com/about/terms-of-service) (no date shown). A distributor says fully AI releases "may not be accepted" ([Ditto](https://support.dittomusic.com/en/articles/10706240-why-is-my-release-not-live-on-audiomack), no date shown); that is not Audiomack's own wording.

### Mixcloud
- **Upload:** single `multipart/form-data` POST to `https://upload-api.mixcloud.com/` with `mp3` (up to 4.0GB) and `name`; Bearer token over HTTPS; apps registered at `/developers/create/` ([Developers](https://www.mixcloud.com/developers/), no date shown).
- **Stats:** no stats endpoint documented; play, favourite and repost counts exist (Pro can `hide_stats`) and a `listens` connection is listed without description (same page). **Not confirmed** as usable stats.
- **Rate limits:** "Every action in the API is rate limited", with `Retry-After` (same page). Pro price shown on the page as "$11.25 /" (period cut off): **not confirmed**.
- **AI terms:** [Terms](https://www.mixcloud.com/terms/) (no date shown), clause 6.4.7 restricts "any User Submission created wholly or in part with the aid of generative artificial intelligence (AI) technologies", prohibiting such submissions where they use or contain copyrighted content without rightsholder authorisation; clause 5.1.16 bars using the platform "for any purposes whatsoever connected with generative artificial intelligence (AI) technologies". Whether our own Suno output is acceptable is ambiguous: **not confirmed**.

### Bandcamp
- **Upload:** no. "Labels and merchandise fulfillment partners can interact with their accounts via the Bandcamp API"; APIs listed are Account, Sales Report and Merch Orders ([Developer](https://bandcamp.com/developer), no date shown).
- **AI terms:** "Music and audio that is generated wholly or in substantial part by AI is not permitted on Bandcamp." ([Keeping Bandcamp Human](https://blog.bandcamp.com/2026/01/13/keeping-bandcamp-human/), 13 Jan 2026). Ruled out.

## Podcast hosts (for the presenter show)

Note: these publish an RSS feed and count **downloads**, not plays or likes, except Spreaker which also has plays and likes on its own player.

### Spreaker
- **Upload:** `POST /v2/shows/SHOW-ID/episodes`; "The only required parameters are the `title` and `media_file`"; `Authorization: Bearer OAUTH-TOKEN`, owner credentials ([Episodes](https://developers.spreaker.com/api/episodes/), no date shown). How to register an app: **not confirmed** (the [Authentication](https://developers.spreaker.com/api/authentication/) page returned 403).
- **Stats:** plays, likes, followers, listeners, sources, devices, OS, geographics, per episode and per show, e.g. `/v2/episodes/EPISODE-ID/statistics/plays`, `/v2/shows/SHOW-ID/statistics/listeners`; `from`/`to` dates; `group` "can be `day`, `week`, or `month`"; metrics include `plays_count`, `plays_live_count`, `downloads_count`, `likes_count`, `listeners_count`; excludes listens under one minute ([Statistics](https://developers.spreaker.com/api/statistics/), no date shown). Freshness and plan needed: **not confirmed**. Rate limits: **not confirmed**.
- **AI terms and label:** suggested label "This episode includes AI-generated content"; "Even if only a portion is AI, it's best to disclose"; "Failing to disclose that the podcast contains AI-generated content may result in the account being suspended or closed." Ticking the box adds a visible tag and an AI flag in the RSS feed ([help article](https://help.spreaker.com/pt-BR/articles/12458456), 30 Sep 2026). Whether the flag can be set by API: **not confirmed**. Cost: **not confirmed**.

### Transistor
- **Upload:** `GET /v1/episodes/authorize_upload` (file up to 5GB), PUT to the returned `upload_url`, `POST /v1/episodes` (draft), then `PATCH /v1/episodes/:id/publish`; header `x-api-key` ([API docs](https://developers.transistor.fm/), no date shown).
- **Stats:** downloads per day per show (`GET /v1/analytics/:id`) and per episode (`GET /v1/analytics/episodes/:id`); no plays, likes or listeners. Rate limit "10 requests per 10 seconds", then 429 (same page).
- **Cost:** $19, $49, $99 a month; "API + MCP access" on every plan ([Pricing](https://transistor.fm/pricing/), no date shown).
- **AI terms:** the [Terms](https://transistor.fm/terms/) (no date found) cover only Transistor's own AI features ("Users are responsible for reviewing output before publishing"). A clause on uploading AI audio or synthetic voices: not found.

### Buzzsprout
- **Upload:** `POST /api/:podcast_id/episodes` with `"private": true`, then start upload, PUT bytes, complete, then `PATCH` to publish; `Authorization: Token token=YOUR_API_TOKEN` ([API README](https://github.com/buzzsprout/buzzsprout-api), no date shown).
- **Stats:** `GET /api/:podcast_id/downloads?date=YYYY-MM-DD` (episodes with downloads that day) and `GET /api/:podcast_id/:episode_id/downloads?date=...` (per download: app, device, country, region, city); "These endpoints do not accept a date range" ([Stats](https://github.com/buzzsprout/buzzsprout-api/blob/master/sections/stats.md)). Rate limit 60 a minute per token ([README](https://github.com/buzzsprout/buzzsprout-api)).
- **Cost:** $15, $25, $30 a month billed annually; 72 upload hours a year on the first two; free plan 2 hours a month, episodes kept 90 days ([Pricing](https://www.buzzsprout.com/pricing), no date shown). API on which plans: **not confirmed**.
- **AI terms:** not found (the terms URL linked from the home page returned 404).

### Podbean
- **Upload:** `GET /files/uploadAuthorize` (filename, content type, size), upload, then `POST /episodes` with `media_key` or `remote_media_url`; OAuth (authorisation code or client credentials) ([API docs](https://developers.podbean.com/podbean-api-docs/), build dated 23 Jul 2026).
- **Stats:** `/podcastStats/stats` with `period` 'd' or 'm', end date capped at yesterday; engagement stats on "paid plan and above"; daily listener reports "only available for the unlimited plan and above"; raw reports "business plan and above" (same docs). Rate limit: leaky bucket of 60, drained at 2 a second (same docs).
- **AI and music terms:** [Podcaster Master Terms](https://www.podbean.com/podbean-podcaster-terms) (last updated 18 Mar 2026): AI use allowed, "you are solely responsible for reviewing, verifying, and approving all AI-generated output before publication"; "Where applicable law or platform policies require disclosure that content was generated or assisted by AI, you are solely responsible for making such disclosures". But: "Podbean is not a music distribution tool. You must not use the Service for the purpose of distributing music tracks, DJ mixes, etc." Fine for the talk show, not for songs.

### Captivate
- **Upload:** `POST {{URL}}/shows/:id/media` (MP3, constant bit rate), then `POST {{URL}}/episodes` with `media_id`; authenticate with user ID and API token at `/authenticate/token`, then Bearer; host `api.captivate.fm` ([API docs, Postman](https://docs.captivate.fm/), no date shown).
- **Stats:** `/insights/{show}/overview`, `/total`, `/monthly`, `/averages`, and `POST /insights/{show}/range` with `"interval": "1d"`, `timezone` and breakdowns by episode, location, device (same docs). Whether hourly intervals work: **not confirmed**. Rate limits: not documented.
- **Cost:** $17, $44, $90 a month paid yearly; "all plans have access to all features" ([Pricing](https://www.captivate.fm/pricing), no date shown); API named explicitly: **not confirmed**.
- **AI terms:** [Terms](https://www.captivate.fm/terms) (last updated 30 Apr 2026) require rights to "the appearance, voice, name, likeness" of any identifiable person and to any music; no AI-specific clause found.

### RSS.com
- **Upload:** yes, audio and image upload, episodes, transcripts, chapters; `X-Api-Key`; "After about 15 writes in a row" returns 429; API "included on the Max plan" ([API Access](https://help.rss.com/en/support/solutions/articles/44002648949-api-access), modified "Fri, 6 Nov", year not shown; docs at [api.rss.com/v4/docs](https://api.rss.com/v4/docs)).
- **Stats:** the help article says the API has no analytics endpoints; export CSV from the dashboard (same page). Fails the stats test.
- **AI terms:** "You can use AI on RSS.com." and "When AI does the creative work your listeners came for, answer Yes to Does this episode include AI content?" ([AI-generated content](https://help.rss.com/en/support/solutions/articles/44002518955-ai-generated-content-in-podcasting), modified "Tue, 20 Oct", year not shown).

### Libsyn
- LibsynPro page mentions an "intuitive dashboard and powerful Stats API" ([LibsynPro](https://libsyn.com/libsynpro/), modified 12 Nov 2026). No public upload or stats documentation found: **not confirmed**. AI terms: not found.

### Spotify for Creators (out of scope)
- A Spotify Community thread says there is no public API to upload or publish episodes; publish via RSS instead ([thread](https://community.spotify.com/t5/Spotify-for-Developers/Request-for-Access-to-Upload-Podcasts-to-Spotify-from-External/td-p/7044523), community post, not official docs).

## Other disclosure rules worth knowing
- **YouTube:** realistic AI content must be disclosed; AI music listed as needing disclosure; settable by API via `status.containsSyntheticMedia` ([help](https://support.google.com/youtube/answer/14328491); [API](https://developers.google.com/youtube/v3/docs/videos)).
- **Spreaker:** AI label required, suspension risk if missing ([help](https://help.spreaker.com/pt-BR/articles/12458456), 30 Sep 2026).
- **RSS.com:** answer "Yes" to the AI content question ([help](https://help.rss.com/en/support/solutions/articles/44002518955-ai-generated-content-in-podcasting)).
- **Apple Podcasts** (where podcast hosts deliver the feed): a search summary says creators using AI-generated audio must disclose it prominently ([Apple guidelines](https://podcasters.apple.com/support/891-content-and-subscription-guidelines)); I did not read the page in full, so the exact wording is **not confirmed**.

## Recommendation (upload by API, live stats, allows AI audio)

1. **YouTube.** The only platform with full upload by API, per-video stats by day (views, watch time, likes, comments), live counters to poll, an API flag for AI disclosure, and an explicit allowance for disclosed AI music. Costs: render each song as a still-image video; daily stats lag by an unconfirmed delay; quota of 100 uploads a day.
2. **SoundCloud.** Clean track upload API and the right audience for songs; AI music allowed if not impersonating or gaming. Needs Artist Pro to get an app. Stats are cumulative counters only (plays, likes, reposts, comments), so we poll and diff them ourselves for hourly or daily curves.
3. **Spreaker** (for the presenter show). Upload by API plus the richest podcast stats API found (plays, likes, listeners, downloads by day, devices, places), and a clear AI-allowed-with-label policy. Runner-up: **Transistor** (API on every plan, simple downloads per day, no AI restriction found, but no likes or plays).

Not recommended: Podbean for songs (bans music distribution), Bandcamp (bans AI music), RSS.com (no stats API), Audiomack (no public upload API), Mixcloud (AI clause unclear, no stats API).

## Open questions
- YouTube Analytics: actual delay before a day's data appears (hours or days)? Not stated on the pages read.
- SoundCloud: Artist Pro price; wording of the EU AI Act help article (403); can an AI label be set through `POST /tracks`?
- Spreaker: how to register an OAuth app today, which plan unlocks the statistics endpoints, rate limits, data freshness, whether music tracks are allowed, whether the AI flag is settable by API.
- Captivate: is the API on every plan, does `interval` accept hours, any rate limit?
- Buzzsprout: current terms text (404) and which plans include the API.
- Mixcloud: does clause 6.4.7 accept fully AI music that uses no third-party copyright?
- Audiomack: when the Upload API opens and on what terms.
- Libsyn: is there a documented upload or stats API outside LibsynPro?
