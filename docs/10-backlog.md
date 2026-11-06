# Scoped delivery backlog

## Active voice milestones · 6 November 2026

Current user authorization supersedes historical implementation-blocked wording below. See [P1 evidence and NO-GO decision](2026-11-06/P1-VOICE-POC.md).

| Item | Status / acceptance trace |
|---|---|
| V1 bounded vertical POC | Implemented, off by default; AC01,03,04,06,07,09,11,12 local automated evidence only |
| V2 live speech and audible feedback | OPEN, blocks P1 GO; AC05,06,07,09,11; real BM/EN/mixed, noise, devices, budget/terms, sampled teacher review |
| V3 rollout to fields and assessment | BLOCKED by P1 GO; AC03–07 |
| V4 P2 authored bilingual static audio | NOT STARTED, blocks on P1; AC08,09,11; inventory/assets/terms/editorial review |
| V5 P3 interactive missions | NOT STARTED, blocks on P2; AC02,08,10,11; remove old recordings only after replacement regressions |


Issue IDs I01–I16 below are stable planning identifiers; GitHub issue numbers are mapped in [issue-index.md](issue-index.md). All engineering work is blocked until explicit phase approval. Priority P0 means critical path, not permission to execute. An issue becoming open or assigned does not grant approval. Each future PR must link its issue and relevant QA IDs.

## I01 — Verify registration, rules and school constraints

Phase: planning/teacher action. Priority: P0. Owner: teacher/owner. Estimate: 0.5–1h. Dependencies: none.

Scope: inspect actual form and organizer requirements; verify eligibility, team size, artifacts, cutoff times, judging rubric, presentation duration and device/language constraints. Register by internal 25 October 18:00 target if eligible.

Acceptance: record verified nonpersonal requirements and sources/date in evidence ledger; owner confirms acknowledgement retained privately; unknown upload cutoff explicitly resolved or still marked unknown. No agent claims registration on the owner's behalf. No development, school contact or messaging is implied.

## I02 — Approve bounded POC and target device

Phase: approval. Priority: P0. Owner: owner. Estimate: 15m. Dependencies: review README and gates; I01 constraints where available.

Scope: decide whether to authorize only the six-hour technical POC; confirm device, adult data and budget. No UI/product work implied.

Acceptance: quote actual approval in ledger with scope/date; or leave NOT APPROVED. No implementation starts from issue assignment alone. Evidence: approval entry and chosen hardware. QA: G0.

## I03 — POC capture, permission and lifecycle

Phase: POC, BLOCKED until I02. Priority: P0. Owner: Codex + teacher. Estimate: 1h. Dependencies: I02.

Scope: minimal diagnostic harness, real capture, gesture playback, cancel/stop/release and sample path on actual laptop and second device. Excludes mission UI.

Acceptance: QA01/QA02 and G1 evidence including permission denial/pending/no device, five cycles and stop within 1s. Record browser/device. No permanent recording. PR includes actual traces and limits.

## I04 — POC adult dataset, model and independent evaluation

Phase: POC, BLOCKED until I02. Priority: P0. Owner: Codex. Estimate: 3.5h within total POC cap. Dependencies: I03.

Scope: three object classes plus background/rejection, session-separated data, frozen thresholds and locked holdout per AI data plan; two-device noisy live trials. Excludes student model training and cloud AI.

Acceptance: G2/QA03 counts, matrix, coverage, per-class/device metrics, provenance and license candidates. No test leakage; disclose insufficient sample floors as incomplete gate. Wrong/uncertain model results preserved. No raw pupil data in Git.

## I05 — POC offline, latency and evidence report

Phase: POC, BLOCKED until I02. Priority: P0. Owner: Codex + teacher. Estimate: 1.5h within total POC cap. Dependencies: I03/I04.

Scope: bundle required model dependencies, sample-file inference, network boundary inspection, warm/cold timings, simple evidence save/reload, teacher M1 feasibility review.

Acceptance: G3/G4/QA10/QA12–14, POC report with NOT RUN/PASS/FAIL per gate, hashes, no-audio-upload observation and limitations. G5 pilot pending must be labelled. No claim that cached prerecorded predictions are inference.

## I06 — Review POC and approve or reject product phase

Phase: approval. Priority: P0. Owner: owner. Estimate: 30m. Dependencies: I05.

Scope: review actual measurements against G1–G5; choose go, conditional scope or no-go; update ADRs and schedule.

Acceptance: explicit product authorization or recorded no-go; any sample-first restriction and unvalidated device/pilot limitation documented. Passing POC alone is insufficient. No product engineering until this decision authorizes it.

## I07 — Select per-feature Product Design visual direction

Phase: design, execution requires owner authorization for visual work; no implementation. Priority: P0. Owner: Codex + owner. Estimate: 3–4h. Dependencies: framing and preferably I06 result.

Scope: three coherent visual options each covering four mission workspaces and teacher inset; owner selects one. Then state-by-state desktop/tablet/narrow specifications for F01–F09, accessibility and BM copy. No scaffold/server.

Acceptance: selected mockups and owner selection recorded; each task keeps its distinct layout; initial/active/error/uncertain states, keyboard and zoom specified. QA15/QA16/QA21 define future comparisons. Prose-only briefs do not close visual selection.

## I08 — Product shell, setup and M1

Phase: product, BLOCKED until I06 approval and I07 selection. Priority: P0. Owner: Codex. Estimate: 5–6h. Dependencies: I06/I07.

Scope: F01–F03, mission/evidence states, approved audio/model adapter, visible mode labels, safe vibration activity and uncertainty recovery. Reuse tested POC boundaries.

Acceptance: QA01/02/04/05/09/10 pass for M1; pupil can complete via sample and disagree with AI; physics explanation separated from model classification; no hidden mic capture. PR contains paired visual evidence against selected design.

## I09 — M2 spatial propagation inquiry

Phase: product, BLOCKED until I06 approval. Priority: P0. Owner: Codex + teacher. Estimate: 2h. Dependencies: I08.

Scope: F04 spatial placement, three-direction testing, prediction/revision and static/reduced-motion equivalent; explicitly illustrative propagation.

Acceptance: QA06/09/15, teacher science signoff, keyboard parity and persisted evidence. Excludes microphone localization and exact acoustic measurements. Screenshot plus completed evidence example required.

## I10 — M3 echo comparison bench

Phase: product, BLOCKED until I06 approval. Priority: P0. Owner: Codex + teacher. Estimate: 2h. Dependencies: I08.

Scope: F05 A/B matched samples, virtual condition selection, event timeline, daily-life reflection explanation and non-listening equivalent.

Acceptance: QA07/09/15, no overlapping playback, delayed-return reasoning, honest simulation label and teacher approval. Excludes live echo detection. Retain comparison evidence after replay.

## I11 — M4 quiet-zone planning board

Phase: product, BLOCKED until I06 approval. Priority: P0. Owner: Codex + teacher. Estimate: 2–3h. Dependencies: I08.

Scope: F06 contextual sound judgments, budgeted interventions, tradeoffs, undo and case-plan explanation.

Acceptance: QA08/09/15; at least two justified feasible actions; warning function retained; qualitative before/after label. No health thresholds or claims of measured attenuation. Teacher signs off all rule feedback.

## I12 — Notebook, report and teacher evidence view

Phase: product, BLOCKED until I06 approval. Priority: P0. Owner: Codex + teacher. Estimate: 2h. Dependencies: I08–I11.

Scope: F07/F08, local versioned evidence, resume/reset, anonymous printable report and current-device teacher table. No multi-device aggregation/account system.

Acceptance: QA10/11/19; four mission sections, original predictions and revisions retained, hints visible, no TP certification. Storage failure is explicit; print/export contains no raw audio or personal identifiers.

## I13 — Presenter mode and verified offline recovery

Phase: product, BLOCKED until I06 approval. Priority: P0. Owner: Codex. Estimate: 1–2h. Dependencies: I08–I12.

Scope: F09, mode-specific banners, demo data namespace, cache completeness/version check, prepared local backup and rapid fallback.

Acceptance: QA13/17/20; full four-mission run with network disabled after restart, sample inference verified, mic failure recovery ≤10s. No deployment/publication without separate consent.

## I14 — Curriculum, accessibility and permitted pilot QA

Phase: product validation, BLOCKED until I06 approval. Priority: P0. Owner: teacher + Codex. Estimate: 3–4h plus teacher/pupil availability. Dependencies: I08–I13.

Scope: QA01–QA22 appropriate to shipped features, BM and current-edition signoff, five-pair formative pilot if permitted, pre/post check and priority fixes. Do not retain pupil recordings.

Acceptance: no P0/P1; all results linked to build/model/content versions; actual prompt/time/evidence counts; documented accommodations and limitations. No fabricated pilot if pupils unavailable. Any unrun required check blocks its corresponding release claim.

## I15 — Competition pack, release review and rehearsals

Phase: product validation/presentation, BLOCKED until I06 approval; publication requires explicit consent. Priority: P0. Owner: teacher + Codex. Estimate: 2–3h plus teacher rehearsal. Dependencies: I01/I14.

Scope: verified build manifest, model card, actual metrics, abstract/poster/teacher guide in confirmed formats, 3/5-minute demo and labelled backup recording.

Acceptance: three rehearsals including ten-minute offline check; evidence integrity and rights review; owner release decision; all deliverables match official cutoff/format. Any hosted publication explicitly authorized. Never claim winning or official acceptance.

## I16 — Optional enrichment after core release gates

Phase: deferred, separately scoped. Priority: P2. Owner: owner + Codex. Estimate: not included. Dependencies: I14/I15 core accepted; new owner authorization.

Scope candidates: Chinese glossary, richer art, pupil training exercise or manually imported class summaries. Select at most one only after core stability; create a new bounded issue/ADR if data architecture changes.

Acceptance: chosen scope/time budget recorded, no regression in existing gates, accessibility/language checked. Out of competition MVP by default; never delay registration or core QA.
