# Episode 1: feedback and the version 2 samples

## The feedback
Dinis gave feedback on episode 1 in c.maestro's session, about 20:00 UTC on 26 Nov 2026. It was relayed in PrompTugal board/team/maestros/from-c.md (20:19Z), then to suno.b by maestro.b (21:21 UTC). These are relayed words, not yet confirmed in suno.b's session:
- "it works really well and the descriptions bring it to life";
- (1) the voice was too sensual; pick another stock voice, more neutral;
- (2) add background music under the talk;
- (3) fade in and fade out;
- (4) explore other mediums;
- (5) put the songs, with their notes, in a vault for the SGit iOS app.

## What Suno can do (tested 26 Nov, 21:20 UTC)
- **Music bed and fades, (2) and (3):** speech-create takes `backing_music: true`. All four sample takes have a quiet bed under the voice that fades in at the start and out at the end, by Suno's listening tool. Suno chooses the bed itself: an acoustic bed was asked for, and the takes came back with ambient synth or piano.
- **Voice, (1):** this account has no voices of its own (voices-list is empty), so the voice comes from the style tags. Suno rewrites the tags and adds its own timbre words ("nasal", "chesty", "deep bass"). Of the four takes, one came out mostly neutral.

| Take | Style tags as Suno kept them | Neutral (0-5) | Sensual (0-5) | Bed |
|---|---|---|---|---|
| e6548fd3 (sample a, A) | mid-range, nasal, neutral radio news presenter | 2 | 2 | quiet synth, fades |
| 94fb4996 (sample a, B) | neutral radio news presenter, deep bass, flat monotone | 1 | 3 | quiet synth, fades |
| 73b4e4a6 (sample b, A) | bright crisp daytime radio announcer, chesty | 1 | 2 | quiet piano and synth, fades |
| **2465f1b9 (sample b, B)** | bright crisp daytime radio announcer, nasal | **4** | **1** | quiet ambient piano, fades |

Sample b, take B is the candidate: https://suno.com/song/2465f1b9-ea99-4b0f-b436-5e4b33d3ac10 (private until Dinis picks). Its style: "bright, crisp daytime radio announcer, projected voice at arm's length from the microphone, upbeat and businesslike, brisk pace, crisp consonants", with sensual, breathy, whispery, intimate, close-mic, warm and soft as negatives. Suno picks the voice afresh on each call, so the other ten clips may not match it; each is checked, and remade where it drifts.

Cost: the four samples were two speech calls, 20 song credits. Redoing all eleven clips is 110 more, plus remakes.

## The vault, (5)
Making the vault is for b.vault.keeper, which alone holds vault keys. The tracks need downloads, and each download costs one download credit (checked: audio-download answers requires_credit). The account has 15 a month, renewing on 13 Dec. The nine songs need 9, and eleven presenter clips 11 more: 20 in all, more than the 15 left. Suno cannot join the clips into one file: a Sequence is a video timeline over one song. So the choice is Dinis's: the nine songs only (9 credits), or the songs and some clips, or wait for the renewal. Nothing has been downloaded.
