# Codex Handoff — AI SoundLab 2.0
Date: 2026-11-06 | Planning only. No code changes authorized by this handoff itself.

Repository: https://github.com/leesiehcjiahui/ai-soundlab
Source of truth: [Full enhancement plan](./2026-11-06-VOICE-SIMULATION-ENHANCEMENT-PLAN.md).

## Start task for Codex
Implement **P1 vertical POC ONLY** on a new feature branch, preserving current app design and core AI Assist.

1. Read AGENTS.md, README.md, docs/2026-10-27/LEARNING-FEEDBACK-0.5.0.md, docs/03-architecture.md, docs/05-poc-gates.md, docs/06-testing-matrix.md and full 2026-11-06 plan. Inspect actual proxy model ID and deployed contracts; no model migration in POC.
2. Run existing tests/build and record baseline and screenshots. Inventory recording code to preserve current release until P3. Branch e.g. feat/voice-answer-poc.
3. Add a minimal voice input button to ONE question while maintaining original text field. Explicit press-to-record, 30s maximum, cancel/stop and lifecycle cleanup. Submit ephemeral audio to secured Cloudflare Worker for STT (verify available model and endpoint against official docs). Show/edit transcript; never auto-submit.
4. Reuse existing AI Assist contract and scoring: submission of confirmed text -> existing AI explanatory feedback. Add compact on-demand TTS playback of EXACT feedback text, in selected BM/EN, with Play/Pause/Replay and text-only fallback. No autoplay.
5. Add bounded Worker STT/TTS routes: strict Origin, content types, byte and duration caps, max feedback text, privacy (no audio persistence/logging), separate quotas, anti-abuse controls, timeout/abort and error fallback. Secrets remain server-only; update env example only, not real secrets.
6. Unit/proxy/integration tests and real-browser microphone/speaker smoke on at least one desktop and mobile browser, BM/EN and noisy-mic fixture. Document what is automated versus manually verified. Verify existing CSS, 390px mobile view, keyboard and screen reader semantics.
7. Stop after POC. Open PR, include screenshots, test outputs, sample STT accuracy notes, cost estimates, risks and GO/NO-GO conclusion. Do NOT ship M1-M4 redesign, merge PR or deploy production without a subsequent instruction.

## Later phases, after POC approval
P2 prerecord reviewed questions/instructions/science lessons in BM and EN to static files; add optional playback.
P3 remove experiment sound recordings/imports, redesign vibration as ruler/instrument simulation; extend travel with vacuum; echo with soundproofing; detective with curated scenarios. Keep current mission structure and AI Assist.
P4 security, scientific, mobile, accessibility and cost regression then staged rollout.

Definition of done: Plan AC01–AC12 met, but P1 PR only claims its relevant subset. Explicitly distinguish planned from implemented. Ask user only if an actual blocking deployment credential or material product decision cannot be resolved from repo/docs.
