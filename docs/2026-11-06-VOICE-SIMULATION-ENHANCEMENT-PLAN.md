# AI SoundLab 2.0 — Voice-enabled Interactive Science Lab
Status: APPROVED FOR DEVELOPMENT PLANNING ONLY | 2026-11-06
Repository: leesiehcjiahui/ai-soundlab
Implementation status: NOT STARTED

## 1. Product decisions (non-negotiable)
- Preserve existing visual design, navigation/sidebar, four missions, Predict–Try–Explain flow, final assessment, BM/EN selection, and existing AI Assist. No wholesale redesign, new authentication, teacher portal, or database.
- Remove science-experiment sound recording, importing environmental sound files, recorded-waveform comparisons, and related dead UI. Students must not record sound as experimental evidence.
- Permit OPTIONAL short microphone capture solely to dictate an answer (speech-to-text). Keep typed answer available everywhere. Display/edit transcription before sending to AI. Never interpret speech recognition as a scientific grade.
- Existing AI Assist remains the authoritative written explanation and evaluation. Offer Play/Pause/Replay of EXACT same returned text using on-demand text-to-speech (TTS); do not generate a second scientific answer in audio.
- Questions, instructions, and reviewed science lessons are fixed authored text, with preregenerated BM/EN audio assets served statically; fallback to text. AI feedback is dynamic, not prerecorded.
- No implementation until one vertical POC proves voice answer -> transcript confirmation -> existing AI Assist -> text + spoken feedback; then staged rollout.
- No claim that speech is stored permanently: audio must be ephemeral and sent to provider for transcription only after consent/explicit interaction; disclose this. Existing AI service already sends entered answer text to the proxy; do not misleadingly say audio never leaves the device.

## 2. Current baseline and integration
Current source areas to inspect first:
- src/lab/Lab.tsx: missions, phases, typed fields, AI Assist, assessment navigation.
- src/lab/AudioPanel.tsx, src/lab/DetectiveListening.tsx, src/lab/Simulations.tsx: existing recording and simulation paths.
- src/lab/StageGuidance.tsx, src/lab/Assessment.tsx, src/lab/LearningSummary.tsx: AI feedback and lesson placements.
- src/poc/audio.ts, src/lab/audio-file.ts: old record/import helpers; remove only after reference inventory.
- proxy/src/index.ts, proxy/src/stage-guidance.ts, proxy/src/teaching-feedback.ts, proxy/src/quota.ts, shared/contract.ts: server and typed contracts.
- tests and docs/2026-10-27/LEARNING-FEEDBACK-0.5.0.md: current validated behavior. Historical docs must be marked superseded, not silently treated as current.
Keep GitHub Pages + React/TypeScript/Vite frontend and Cloudflare Worker as the credential boundary. Maintain current origin allowlist, secret management, schema checks, quotas, timeout/error behaviour and text-only operation.

## 3. Student UX, minimal additions
Questions and teaching: small optional audio play/pause button; do not duplicate cards or clutter page. Language matches current BM/EN toggle.
Any answer field (including the five assessment answers): existing typing remains primary; add small 'Answer by voice' button. Explicit tap starts capture; visible recording indicator and Stop/Cancel; default maximum 30 seconds. After recording, show transcript in existing text field, never auto-submit; pupil corrects errors, then submits using existing check action. Prevent simultaneous record/playback, handle denied permissions and background tab changes. Add accessible keyboard labels, focus management, status messages. Voice output remains optional, muted by default (no autoplay).
AI Assist: retain existing feedback display/structure/lesson; append small Play/Pause/Replay control, loading and graceful text fallback. Speak only exact approved visible feedback and never a separate unreviewed model generation. Cancel playback on navigation/language change/retry. Do not use 'AI listened to your environmental sound' wording.
Assessment: voice only enters editable answer text; preserve scoring algorithm and all preexisting content.

## 4. AI and data flow
Static instruction/question/lesson script -> editorial approval -> one-time batch TTS generation per stable content-ID and locale -> versioned public/assets/voice/{locale}/{content-id}.{audio-ext} + manifest with textHash/version/duration. Static audio must be generated before deployment, not on each request.
Voice input: user click -> browser MediaRecorder (cap 30s, size/MIME allowlist, cancel) -> POST /api/transcribe via existing Cloudflare Worker -> approved transcription model -> return plain transcript -> show editable field -> user confirms -> existing AI Assist request -> validated written feedback -> on user Play click POST /api/speech with validated feedback text + locale + selected allowlisted voice -> approved TTS model -> short playable audio response -> ephemeral in-memory playback URL. Do not send arbitrary third-party URLs or permit open text-to-speech amplification beyond response-specific controls; prefer signed/one-time response token or server-side validation matching a recent AI feedback result, enforced quota. Treat audio as potentially personally identifying; do not log audio, names, or student answers. Avoid persistent audio storage/caches for dynamic responses.
Separate quotas for STT and TTS, maximum content lengths, rate limiting, MIME sniffing, CORS allowlist, API keys only in Worker, request size/time ceilings, concurrency guard, error handling and daily spend cap. Current global/IP quotas are not user authentication; document shared-network classroom limitations.
Model policy: do NOT blindly switch existing AI reasoning model; inspect current deployment and benchmark against synthetic science misconceptions. Candidate economical reasoning model: gpt-6-luna (official model ID as of 2026-11-06), but only migrate after performance, latency and Structured Outputs compatibility pass. STT candidates gpt-4o-mini-transcribe and gpt-transcribe; TTS candidate gpt-4o-mini-tts. Reverify availability, actual endpoint support, BM/EN children's speech accuracy, pronunciation, pricing and provider terms in official API docs at implementation time. Realtime bidirectional agent not required; turn-based workflow is safer for classroom learning.
References: https://developers.openai.com/api/docs/models ; https://developers.openai.com/api/docs/guides/speech-to-text ; https://developers.openai.com/api/docs/guides/text-to-speech

## 5. Mission upgrades (maintain current shell)
M1 Vibration: replace ruler-room-recording workflow with interactive ruler length/pitch and instrument comparison; controlled generated tone/playback permitted; label illustrative vs measured. Predict -> adjust length/strength -> compare high/low pitch and loud/soft -> describe cause. Do not incorrectly infer pitch from signal amplitude.
M2 Sound travel: preserve current 4-listener all-direction demonstration; add bell-jar vacuum model (air present vs near-zero vs ideal vacuum), and optional solids/liquids/gases concept. Vibrating bell can continue without sound traversing vacuum; do not claim bell stops vibrating. Simulation not a calibrated lab instrument.
M3 Echo: preserve hard/soft comparison; add virtual room-treatment challenge comparing reflection and absorption at controlled distance. Avoid equating absorption to altered speed of sound.
M4 Sound Detective: remove voice/file environmental-sound recording; instead choose authored scenario/sample sound (school, traffic, hospital, playground), classify helpful/harmful effect in context and propose practical mitigation. Feedback evaluates reasoning from typed/dictated text, not imaginary audio identification.
All new content reviewed against Year 4 KSSR Science; enrichment clearly labeled beyond core requirements. Bilingual content with matching prerecorded audio. Keep existing final assessment accessible from beginning as currently designed.

## 6. Milestones and stop/go gates
P0 Discovery: map current deployed model, AI Assist contracts, existing recorder references, simulation + test baseline, CI/Pages deployment. Confirm product shell screenshots desktop/mobile.
P1 Vertical POC (STOP/GO): one existing question with voice capture <30s, transcribe BM/EN, editable confirmation, existing AI feedback, TTS of exact feedback. No UI redesign. Test with real microphones in quiet/noisy conditions including mixed BM/EN, permission denied, mobile Safari/Chrome, slow network, navigation interruption. Compare costs. If failing, text-only remains and do not roll out.
P2 Audio content pipeline: fixed lessons/questions/instructions in BM/EN; editorial review and one-time voice assets, manifest and script version checks; fail-safe missing audio.
P3 Simulation upgrades: replace M1 and M4 recording dependencies; extend M2 vacuum and M3 room treatment, preserving mission completeness and assessment results. Maintain no-audio fallback.
P4 Hardening: API abuse/rate/cost/error checks, accessibility, curriculum review, visual regression, existing tests and real-device demos. Roll out after gate sign-off.

## 7. Acceptance criteria
AC01 Existing layout/sidebar/four mission stages/BM-EN/AI Assist/final assessment unchanged in intended behavior and recognizably same visual design.
AC02 No science recording or audio import buttons, file paths, recorder data or stale prompts remain reachable. Existing mission completion logic updated appropriately.
AC03 Typed answers still work, without microphone permission, for every mission and assessment.
AC04 Voice capture starts only on explicit input, visibly indicates state, caps duration/size, can cancel; no automatic answer submission.
AC05 BM/EN transcription text is editable, correct language selection; mixed-language and child voice quality is evaluated, with a documented fallback.
AC06 AI Assist uses confirmed text in existing endpoint and returns grounded feedback for correct, wrong and partially correct answers (science rubric regression).
AC07 Voice feedback reads same text and language, is on-demand, cancellable, not autoplay, and never blocks text feedback if TTS fails.
AC08 Fixed audio maps exactly to editorially approved text version in both locales; audio asset missing/unavailable means text remains fully accessible.
AC09 No API keys in frontend; audio is transient, logs redact student input, enforced file/length/type/Origin/rate limits, separate STT/TTS quotas and bounded cost.
AC10 Scientific simulation controls cause meaningful, causally correct visual/audio changes, labelled non-calibrated; includes vacuum, pitch, echo treatment and sound effects scenarios.
AC11 CI typecheck, lint (if configured), existing unit/proxy tests, added endpoint/contract tests, bundle security gates, hosted worker checks, desktop + 390px mobile snapshot review and manual mic/speaker device testing documented.
AC12 No unapproved changes to live secrets, production deployment, existing user content or historical release claims.

## 8. Verification fixtures
Include: correct BM ruler-vibration answer; misconception 'hand makes sound not ruler'; incorrect 'sound travels through empty vacuum'; difference between pitch and loudness; echo reflection vs absorption; English and BM wrong-language model reply; short hesitant child speech; 'pembaris'/'getaran'/'vakum' transcription; mixed language 'bunyi travel dalam air'; no mic permission; unsupported codecs; >30sec and oversize audio; simultaneous API calls; slow STT/TTS; duplicate play; mobile autoplay restrictions; input typed after transcription; visibility change; screen-reader labels; malicious HTML/transcript; quota exhaustion and proxy timeout.
Test model changes against prior benchmark before switching. Teacher reviews all fixed scientific scripts and sampled AI feedback.

## 9. Suggested change map
src/lab/VoiceAnswerControl.tsx (new); src/lab/FeedbackAudioControl.tsx (new); src/lab/TeachingAudioControl.tsx (new); src/lab/voice-manifest.ts (new); src/lab/Lab.tsx and assessment/fields integration; proxy routes modules for STT/TTS; shared audio contract; pre-generation CLI for authored scripts; new tests and QA screenshots. Only delete old recorder/audio-file modules after imports are removed and tests adjusted. Keep existing CSS styling tokens/components, avoid new visual framework.
Build default audio-off, feature flag for staged POC; backout returns text-only. Document explicit privacy notice near voice control.

## 10. Codex handoff and working agreement
Work from repository main HEAD. Read README, AGENTS.md, current docs and this plan, create a feature branch, capture baseline, and open a PR. POC first, stop and report evidence. Every subsequent phase should have tested code, docs, accessibility and security review, before merging; never deploy until owner-approved. Do not assume speculative model IDs/endpoints/prices. Commit implementation evidence and update docs/10-backlog.md with traceability to AC01-AC12. Never claim tests passed if they were not run.
