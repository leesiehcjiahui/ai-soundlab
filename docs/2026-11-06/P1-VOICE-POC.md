# P1 voice interaction POC — verification and gate

Date: 6 November 2026 (Asia/Kuala_Lumpur). Baseline: `810d77a390ea98feae6dd5924dcf6bf0edae8da7`. Branch: `feat/voice-answer-poc`.

**Decision: NO-GO for rollout, P2 and P3.** The bounded one-question implementation and local automated checks are complete. Essential real-speech quality, physical-device and audible feedback consistency evidence is missing. No merge, production deployment, secret change or live provider request was performed.

## Discovery and scope

The enhancement plan matches current code. Its planning-only authorization is superseded by the current user request; older local-classifier/teacher/storage gates are historical. The deployed Worker configuration was not retrieved: source fixes reasoning to `gpt-4.1-mini-2025-04-14`; that model, existing stage rubric, assessment marking and visible authored science remain unchanged. README's statement that audio never leaves the device applies to legacy experiment recordings, not the new optional dictation path.

Only Vibration > Predict > reason has VoiceAnswerControl. It replaces the existing editable field value with a bounded transcript, focuses that field, and requires the existing Check answer action. Typing during a pending upload wins: its edits are retained and the stale transcript is discarded. Explicit start, stop, cancel, permission-pending cancellation, 30-second timer/sample cap, track cleanup and visibility/navigation cleanup are implemented. Unsupported Web Audio/microphone access falls back to typing.

Only validated feedback for that POC stage receives a speech grant. FeedbackAudioControl submits the exact visible feedback and locale, offers play/pause/replay, never autoplays, and cancels on unmount/language/background changes. Replays reuse the in-memory audio without a provider request. Signature issuance failure returns written feedback normally. The shared voice owner prevents simultaneous capture/playback in the POC.

Default frontend `VITE_VOICE_POC` is unset/false; Worker `VOICE_ENABLED` is explicitly false. No rollout to other fields or assessment is claimed. Legacy M1/M4 recording/import, model evidence and completion rules remain until P3 replacements pass. React/Vite, mission shell, styling tokens, four missions, learning stages, BM/EN, AI Assist and immediate assessment access are retained.

## Architecture and API contract

Credential boundary: browser -> existing Worker -> OpenAI. No new key is required by code. No process OPENAI_API_KEY or local proxy/.dev.vars exists in this checkout. Local provider responses use synthetic fixtures. Do not copy a production secret into frontend configuration.

`POST /api/transcribe`: exact `Content-Type: audio/wav`, raw canonical mono PCM16 little-endian WAV at 16 kHz. Header and actual RIFF/data sizes must agree; 1–480,000 samples, at most 960,044 bytes / 30 seconds. No compressed codec, multipart, URL, filename import or client-supplied duration accepted. The browser captures via Web Audio ScriptProcessorNode and encodes WAV, rather than trusting MediaRecorder duration metadata. This deprecated browser API is a POC compatibility risk requiring real-device validation or replacement by AudioWorklet before rollout. The Worker derives duration from sample count, wraps bytes into provider multipart, uses `gpt-transcribe` with `languages[]=ms,en`, and accepts a nonempty plain transcript <=400 characters. It never submits a science answer automatically.

`POST /api/speech`: exact JSON, <=4,096 bytes. Body is the returned `speechGrant` object with exactly `text,language,expires,nonce,signature`. HMAC binds exact feedback, locale, Origin and five-minute expiry. Arbitrary/modified/expired grants fail before quota/provider use. A Durable Object atomically consumes the nonce with quota reservation; one provider attempt per grant. A failed provider attempt consumes that grant too. Retry requires a fresh AI check (edit answer), while received audio may be replayed freely within the current view. The server fixes `gpt-4o-mini-tts`, `coral`, MP3 and a verbatim-reading instruction; it does not generate a second explanation. Provider audio must be nonempty, audio MIME, <=2 MB. Request identity consistency is verified; actual audible word-for-word correctness remains a human gate.

Existing `POST /api/stage-guidance` adds optional `speechGrant` only for vibration/predict when Worker voice is enabled. Scores, feedback and other fields retain their contracts. Existing clients ignore the additive property; old Worker responses leave voice playback absent.

Both routes inherit exact Origin checks, preflight content-type-only header allowlist, POST-only, AI-enabled and server-secret checks. Voice feature flag fails closed. Voice request upload, upstream request and response read share a 20-second abort deadline; browser requests cap at 25 seconds. No automatic retry. Errors are generic; typed answers and written feedback remain available. Responses use no-store/nosniff and explicit CORS. No audio, transcript or feedback is logged or persisted by these modules. Provider retention is governed by provider policies; ephemeral here does not claim provider zero retention.

STT and TTS each have independent atomic namespaces: 4 requests/global minute, 2/IP minute, 20/day and 100/month (UTC). Each permits one active lease/IP and four globally. Thirty-second lease expiry recovers crashes; finally releases normally. Daily salted HMAC IP identifiers, counters, short-lived leases and used random nonces are the only new Durable Object data; alarms clear expired leases/nonces. Origin is not authentication. Shared school NAT can exhaust these conservative caps. Existing text quotas remain separate and unchanged.

## Models, terms and cost review

Official docs fetched on 6 November 2026:

- [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text): gpt-transcribe is recommended; gpt-4o-mini-transcribe and other legacy transcription models retire 26 February 2027. gpt-transcribe supports multiple language hints. Account access and BM child accuracy were not tested.
- [Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech): gpt-4o-mini-tts Speech API retires 6 January 2027; suggested Realtime migration changes workflow and cannot silently replace this exact-text POC. Server disables this voice POC at that UTC date. The guide lists Malay but voices are optimized for English, and requires an AI voice disclosure, included in UI. Actual BM pronunciation remains NOT REVIEWED.
- [Pricing](https://developers.openai.com/api/docs/pricing): gpt-transcribe $0.0045/minute; legacy mini-transcribe $0.003/minute. Maximum 30-second STT is approximately $0.00225/request, $0.045/day at 20 calls and $0.225/month at 100 calls, excluding other services and any policy/minimum changes. These are estimates, not observed invoices. TTS lists $0.60/million input text tokens and $12/million output audio tokens; actual cost/latency has NOT been measured. Request counts, <=600 feedback characters, no retries, concurrency and deadline bound exposure, but this implementation does not claim a verified hard dollar ceiling on provider billing. Establish a measured TTS allowance and provider/project budget controls before GO.

Full classroom/privacy/usage-terms approval and permitted child speech evaluation fixtures remain outstanding. No student voice or identity was collected or committed. Prerecorded teaching, asset distribution terms and science editorial signoff belong to P2 and are not claimed here.

## Actual verification

Environment: Windows PowerShell, Node 24.14.0, npm lockfile install, installed Microsoft Edge in headless Chromium mode. Browser plugin not available; Playwright 1.65.0 used. Viewports 1366x900 and 390x844. This is mobile-sized desktop Chromium, not a physical phone.

| Gate/check | Observed result |
|---|---|
| Baseline npm ci | 82 packages installed; audit 0 vulnerabilities |
| Baseline npm run check | typecheck, 50/50 tests, build, credential scan PASS |
| Baseline npm run test:runtime | local routes and 50-way atomic quota: 7 accepted/43 rejected PASS |
| P1 npm run check | typecheck, 64/64 tests across 8 files, build, credential scan PASS |
| P1 npm audit --audit-level=high | 0 vulnerabilities (85 packages after Playwright) |
| P1 npm run test:runtime | Worker dry-run, existing routes/50-way quota plus single-use nonce, lease release, 1/IP and 4/global voice concurrency PASS |
| node scripts/voice-browser-gate.mjs | synthetic capture and provider fixtures: BM/EN/mixed transcripts, no auto-submit, editing, stale-edit protection, denied permission, network error, 30s timer via advanced browser clock, cancellation/navigation cleanup, exact outgoing TTS text, no autoplay, pause/resume/replay, locale stop, assessment accessible and 5 answer fields, 390px no horizontal overflow PASS |
| Browser health | identity/nonblank/no Vite overlay PASS; zero page errors, one expected console 502 from injected STT failure |
| Visual inspection | desktop and 390px screenshots inspected; original shell retained; voice button/notice fit |
| WAV/API security cases | actual sample duration/header/byte/MIME/Origin/schema rejection, bad/expired/tampered feedback grant, quotas, redacted errors, upstream and stalled-body timeout PASS (mocked provider) |
| Real BM, English, mixed child speech, quiet/noisy room | NOT RUN; fixture strings test transport, not recognition accuracy |
| Correct/partial/wrong scientific responses | existing rubric regression suite retained; no new live science-feedback evaluation or teacher signoff |
| Audible TTS exactness and Malay pronunciation | NOT RUN; request text match is not proof of spoken wording |
| Physical desktop mic/speaker and mobile Safari/Chrome | NOT RUN; fake browser audio input only |
| Full four-mission manual completion, assistive tech | NOT RUN this phase; existing domain/assessment tests pass; keyboard labels/roles implemented but no screen-reader certification |
| Production deployment and hosted new voice routes | NOT RUN; explicitly not authorized |

Evidence screenshots are committed under `evidence/`; the feature-off screenshot is from this branch with voice disabled, not a pre-edit HEAD capture. Browser source is committed and reproducible. No real classroom audio is included.

## Reproduce locally without secrets

1. `npm ci`, `npm run check`, `npm run test:runtime`, `npm audit --audit-level=high`.
2. In PowerShell: `$env:VITE_VOICE_POC='true'; npm run dev -- --port 5174`.
3. In another terminal: `node scripts/voice-browser-gate.mjs`. It intercepts all provider-bound routes, uses fake microphone samples and real browser audio playback of a synthesized test tone. Windows uses installed Edge; other platforms need `npx playwright install chromium` first. `VOICE_TEST_URL` and `VOICE_EVIDENCE_DIR` can override defaults. Default test outputs are ignored under work/voice-evidence.
4. Live testing must use a separately configured non-production Worker with Worker-only secrets and voice flag true; its frontend Origin must exactly match an approved allowlist entry. No such environment was created or deployed in this task. The test frontend on port 5174 uses mocked requests; it is not in the existing production allowlist.

## Next gate actions

1. Validate supported account access, usage/privacy terms and provider budget controls in an approved isolated test environment; benchmark gpt-transcribe vs the still-supported legacy mini-transcribe candidate using consented anonymous BM/EN/mixed samples. Record reference transcripts, errors, science terms, quiet/noisy conditions, latency and cost; never commit child audio.
2. Test real microphone and speaker cycles on desktop and physical mobile Safari/Chrome, including permission pending/denied, interruptions and audio text correspondence. Test all fixed synthetic correct/partial/wrong misconceptions through unchanged AI Assist. Have a science/language reviewer sign sampled feedback suitability.
3. Address deprecated ScriptProcessor and Speech API lifecycle, measured TTS spend cap, screen-reader and full mission browser regression before claiming P1 GO. Confirm deployment separately; no automatic shipping from a passing local suite.
4. Only after P1 essential gates pass may rollout to other answer fields/assessment and P2 begin. P2 inventory/recordings/review and P3 experiment replacements have not started. No gates were waived.
