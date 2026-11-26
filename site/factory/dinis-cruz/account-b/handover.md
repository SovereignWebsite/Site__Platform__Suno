# suno.b: hand-over for the next session

Written 26 Nov 2026 by suno.b (session https://claude.ai/code/session_01Kw9UwBWVj7sxLdmr1ZKwh4) so a fresh session continues with nothing lost. Read START.md first, then this.

## What Dinis likes and does not like (from his words in the session)
- Liked: Parada v1 ("parada is great"); the fado versions ("Great song"); the Portuguese guitar ("I really like how that Portuguese fado guitar is coming out"); the Suno playlists ("that playlist works really well"; he listens there more than on the site).
- Wants: the Portuguese guitar at the centre of everything, meeting other traditions (docs/experiments.md); Brazilian syncopation (bossa nova, samba-jazz, choro: "that bossa nova jazz feeling"), not a straight on-the-beat 4/4; a rich, continuous melody with no gaps; clean mixes.
- Did not like: too slow (Devagar, archived); gaps and a fuzzy mix (Contratempo, archived); too much funk drumming, an electric guitar melody, an over-the-top bass (Fado Funk, archived); "4/4 on the beat ... like a snare beat" (Contratempo em fado v4); melody gaps.
- He wants to make decisions easily: song pages with the brief, the exact prompt and the timings; the listening board; archiving at a word.

## How to get Suno to do it (learned)
- One generation = two takes = 10 song credits. Listening tool, publishing, playlists: free. Downloads (15 a month) and visuals (225 credits; a 10 s video clip with two takes is 150) only at Dinis's word ("let's not use those video credits for now").
- Building on a take (reference_audio_ids, simple mode) keeps its melody and its tempo and pulls back to its feel; to change tempo or groove, write the style from scratch (custom mode).
- Naming a style strongly (bossa, funk) makes Suno drop the Portuguese guitar; say "the Portuguese guitar is the only lead" and put the other style in the rhythm section only. Style influence 0.9, variety 1; negative styles for what to avoid.
- Instruments drift: always check each take with audio-listen (ask for JSON: lead, groove, melody continuity, mix, sections) and record the better take as "best".
- Suno ignores a drum-solo line in a section map; an extension of the chosen take is the way to add a section.
- Suno's player cannot be started or followed by another page, and its audio is refused to other sites; the board loads the next song after a song's length; the Suno playlists play straight through.

## Things in place
- Site: https://suno.platform.sovereignweb.site/ (repository SovereignWebsite/Site__Platform__Suno, dev). Generators: tools/designs.py, tools/pages.py. Data: site/data/songs.json (songs, versions, takes, best, liked, archived), budget.json, playlists.json.
- Suno playlists (public, best take per version, newest first, archived left out): newest 10 https://suno.com/playlist/6d4e3484-fe41-453b-b673-436a86812281 and newest 20 https://suno.com/playlist/de5af6a0-b2f5-4f98-b666-57d80e44b4f8 . To refresh: playlists-remove-clips all, then playlists-add-clips in order (adding appends at the end).
- The wake: scheduled task trig_01SkLEDVrZ8raGuw7AU1AajJ ("suno.b: a new song every 4 hours", cron 47 */4 * * * UTC), bound to the OLD session. On hand-over, create the same task for the new session (persistent to it) and delete the old one, or ask Dinis to.
- Suno connection: the claude.ai custom connector "Suno MCP" (api.suno.com/mcp), signed in as "Agent RiskMandate" (@agent903). Dinis's likes on this account are readable (library-list liked=true); likes from another account are not.
- Credits: no working limit (Dinis, 25 Nov: "the point here is to use all the credits"). 2,220 of 2,500 left on 25 Nov 21:44 UTC; renews 13 Dec 2026 22:14 UTC.

## Open
- Site__Agent__Suno: asked of factory.b on 25 Nov 22:00 UTC at Dinis's word; when it exists, publish the key there, move this area and docs/wake.md, docs/experiments.md there, then hand over.
- The suno feedback lane: waits on Dinis's sentence to feedback.b (site/decisions/requests/2026-11-24__suno-lane.json).
- Next experiment: docs/experiments.md #2 (bossa nova in the rhythm section only, Portuguese guitar the only lead).
- Deleting on Suno: advised Dinis to hold off; safe candidates are the archived songs' takes. Each wake checks for deleted takes.
- Kate's site and the CRM's vault pattern: Dinis asked to look at them for state; not yet done.
- Design rounds: M3 at design.b.rounds; levers for 4: Vote in every design, A/B buttons by the player, a sourced line on who Dinis is.
