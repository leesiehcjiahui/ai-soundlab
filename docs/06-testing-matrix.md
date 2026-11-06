# QA matrix and release criteria

## Current P1 verification · 6 November 2026

The blanket NOT RUN/historical no-app statuses below describe the original plan. Current P1 baseline, 64-test results, runtime security tests, mocked browser evidence and explicit unrun physical-device/quality gates are in [P1 verification](2026-11-06/P1-VOICE-POC.md#actual-verification). P1 remains NO-GO for expansion; no real child-speech, mobile-device or audible exactness pass is claimed.


Status of every row: NOT RUN. This document defines future tests; no application exists. Tests trace to features F01–F09 and gates G1–G5. Evidence belongs in docs/evidence/ after implementation with date, build SHA, model/content versions and environment. Never commit real pupil data or audio. Use fixtures only for repeatable UI logic; real-device tests establish actual acoustic behavior.

| ID | Area / trace | Method and representative cases | Pass criteria | Owner / stage |
|---|---|---|---|---|
| QA01 | Setup F01 / G1 | Real mic allow, deny, dismiss/pending, missing, busy, revoked mid-flow | Clear next action; sample path always available; no navigation dead end | Codex + teacher / POC, release |
| QA02 | Audio lifecycle F03 / G1 | Stop, cancel, route exit, tab hidden, 5 start/stop cycles | Tracks released ≤1s, stale results ignored, no overlapping streams | Codex / POC, release |
| QA03 | AI validity F03 / G2 | Independent event-level holdout, confusion/coverage/rejection metrics; 2-device noisy live set | All G2 thresholds; no train/test overlap; counts and failure cases visible | Codex / POC |
| QA04 | AI honesty F03,F09 | Force wrong/uncertain result, sample inference, fixed replay, simulated feedback | Correct label for each mode; pupil can disagree; no automatic science grading | Teacher + Codex / release |
| QA05 | Vibration M1 | Physical activity/video plus explanation path | Teacher verifies cause; signal envelope not represented as physical proof | Teacher / content signoff |
| QA06 | Propagation M2 | 3 directions; keyboard and pointer; revise | All-direction concept preserved; no direction-sensing claim; evidence saved | Teacher + Codex / feature |
| QA07 | Reflection M3 | A/B, repeated play, surface change, hearing-access path | No overlapping play; returning sound distinguished from second source; simulation label | Teacher + Codex / feature |
| QA08 | Noise M4 | Bell in different contexts; budget invalid; alarm removal; undo | Contextual explanation; two justified viable actions; warns against disabling alarms | Teacher + Codex / feature |
| QA09 | State / scoring | Unit tests for valid transitions, cancellation, duplicate submit, hint/revision retention | No impossible completion; predictions preserved; retries not punished for sensor error | Codex / CI after approval |
| QA10 | Storage F07 | Refresh, close/reopen, storage disabled/full, version migration, reset cancel/confirm | Accurate saved indicator; progress preserved or explicit recovery; erase removes local records | Codex / integration |
| QA11 | Report F07,F08 | Print preview and PDF print; long BM text; oral teacher note; anonymous export | Four evidence sections readable; no clipping/names/raw audio; no TP certification | Teacher + Codex / release |
| QA12 | Performance / G3 | ≥20 warm runs/device; cold load with connection recorded | G3 budgets, responsive stop, visible load status, no unresolved freeze | Codex / POC, release |
| QA13 | Offline F09 / G4 | Cache all assets; disable network; restart; run four missions and sample inference | No missing model/fonts/audio; ready indicator truthful; incomplete-cache recovery | Codex + teacher / POC, release |
| QA14 | Privacy / G4 | Inspect network while capturing; logs, local store and export; malicious text | No audio upload/raw audio persistence; no secret; pupil text never executed as HTML | Codex / POC, release |
| QA15 | Accessibility | Keyboard-only complete flow, visible focus, contrast, 200% zoom, reduced motion, screen reader status | Target WCAG 2.2 AA issues resolved in core flow; no drag/audio-only blocker | Codex + reviewer / release |
| QA16 | Responsive UI | 1366×768, 1024×768, 390px portrait; long labels; touch | Primary actions readable/reachable, no obstructing BIP/controls, no essential clipping | Codex / visual QA |
| QA17 | Device compatibility | Actual Windows teacher laptop Chrome and Edge, second school device; record versions | Full mic/inference path on primary and second device; limits published | Codex + teacher / POC, release |
| QA18 | Teaching usability / G5 | Five pairs if approved; time/prompt count; post-task explanation | G5 targets; structured observation; no fabricated pilot statistics | Teacher / pilot |
| QA19 | Curriculum / language | Correct school edition; BM review; all hints, labels, examples | Teacher signs traceability; no code/TP claims beyond evidence | Teacher / content freeze |
| QA20 | Demo resilience | Three complete rehearsals; ten minutes offline; mic fail at demo minute 1 | Recovery ≤10s, labels remain truthful, presenter controls work | Teacher / release |
| QA21 | Design fidelity | Selected mock and matching-state screenshot side by side | No material layout/copy/state deviations without rationale | Codex + owner / visual QA |
| QA22 | Artifact provenance | Asset and model bill of materials; license check; build manifest | Every distributed asset permitted and attributable; reproducible hashes | Codex + owner / release |

## Browser support policy

Primary support is the actual tested Windows laptop and current installed Chrome/Edge versions recorded at POC, not an unspecified “all browsers”. Second device should represent the school fleet. Safari/iPad and mobile live capture are optional until tested; a narrow responsive layout alone does not establish audio support. Add real-device QA before advertising them. Browser automation can mock capture for UI flow; it cannot certify real microphones or ambient-noise performance.

## Defects and signoff

P0: privacy breach, unsafe activity or irrecoverable data loss. P1: core mission blocked, materially incorrect science, false AI claims, demo unable to recover. P2: recoverable layout/usability problem. P3: cosmetic. Release requires zero open P0/P1; P2 needs an owner-accepted workaround and documented impact. Regression tests should target meaningful behavior, not duplicate component implementation.

Release checklist: owner product/deployment approvals; all must-have features complete; G2/G4 evidence current for shipped model; QA01–QA22 passed or explicitly documented/accepted conditional scope; teacher content and curriculum signoff; known limitations; immutable build/model hashes; verified offline backup; demo script and permitted evidence. No release by calendar alone. Any new model, preprocessing or threshold change reopens AI validation; changed cache manifests reopen offline testing.

## Evidence templates

POC report: date; approval reference; device/browser; dataset manifest and splits; model/policy hashes; counts; matrix/coverage/accuracy/rejection; timing definitions and raw summaries; network/offline proof; failed cases; limitations; recommendation; owner decision.

Test record: QA ID; build/model/content versions; tester; steps; expected/actual; pass/fail; screenshot/log reference; issue link; retest. Teacher signoff: edition/stream; language; scientific corrections; dated acceptance. Pilot record: anonymous pair code; task; elapsed time; prompt count; observed difficulty; revision; pre/post totals with denominator. No audio or identifiable quotes from children.
