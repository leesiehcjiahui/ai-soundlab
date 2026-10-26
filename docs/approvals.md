# Approval ledger

## 26 October 2026 · repository migration

Owner explicitly requested moving the project to the newly created public repository leesiehcjiahui/ai-soundlab. This authorizes copying the existing project history, changing the local Git origin, configuring destination CI/Pages and updating the existing Worker Origin allowlist for the new Pages URL. Existing OpenAI secrets remain server-side in the existing Cloudflare account. Destination GitHub authentication/access must be verified before push. Historical PRs/issues remain in the original repository.

## 26 October 2026 · public session product change

Owner requested Sound Travel listener dragging, audible in-app simulation, real-time model clock and simplified controls; Discover Vibration recording purpose and comparison; Echo audible defaults and optional own-recording echo; trial indicators above simulations. Owner then requested AI guidance in each Predict/Try/Explain section and a fixed five-question 10-point assessment, while explicitly removing Save, Evidence Book, teacher mode, class-code generation and teacher examples for public access. This authorizes the current implementation and deployment under the previously approved GitHub Pages/Cloudflare workflow. Use the existing server-side key only. New rubric approval and new physical device regression have not been reported.

## 25 October 2026 · current authorization

Owner's current Codex request (continuing Music App Proposal, 6adde4c9-cb6c-83ec-9c61-f24455714fd2): “Plan and then implement AI SoundLab”; “Immediately start with planning and repository docs, then implement staged POC”; “then proceed with complete product after gates pass”; “organize commits, tests, CI, deploy Pages.”

Authorized: update planning, bounded **secured OpenAI feedback POC**, dependency installation, tests, CI, branch/PR, then product after measured gates pass and Pages deployment subject to existing private visibility. Owner explicitly has an existing API key and will configure local `.env` when prompted; no new key or chat secret requested. This supersedes old TensorFlow POC scope and blanket planning-only lock. It does not select a visual direction, change repository visibility, prove eligibility, register the competition, or authorize pupil data collection.

Active plan: docs/2026-10-25/. Product remains conditional on its gates. Concept 1 is now selected (see follow-up below). Cloudflare authentication and hosted deployment are complete; see RELEASE-REPORT.md. Earlier ledger below is historical as of 24 October.

Follow-up, same chat, 25 October 2026: owner answered “Configured locally; run the two tests” and “Make source repository public for free Pages”. Existing local key use is authorized; repository public visibility and free Pages are now authorized, superseding the private-visibility preference above. No secrets may enter tracked history.

Visual follow-up, same chat, 25 October 2026: owner answered **“1”** to “Which of the three final concept images should I build: 1, 2, or 3? The earlier withdrawn draft is excluded.” Selected target is the corrected notebook image `docs/design/options/concept-1.png` (1448×1086), ImageGen result `exec-1649a781-a109-447a-b1c1-af4b3a1e3b54.png`. The withdrawn first draft is not selected. This resolves visual selection; it does not invent physical-device test results or teacher signoff. No duplicate product-phase permission is needed once active gates pass.

Gate follow-up, same chat, 25 October 2026: owner answered **“Both devices passed”** to five start/stop cycles, playback and leaving-page recording stop on teacher device and physical phone; owner answered **“Reviewed and approved”** to Science-teacher review of the bank, 12 results, Year 4 suitability and school DSKP edition. These are owner-reported validations, not agent-observed device measurements; exact models/browser versions and separate network-trace evidence were not supplied. Together with technical POC evidence and selected concept, this clears product development under the original conditional authorization. Hosted proxy setup, final release/device regression, competition eligibility and school pupil-pilot permission remain separate outstanding items. No pupil research or network-trace pass is invented.

Hosting follow-up: owner initially chose “Finish the frontend; keep hosted AI pending”, then explicitly reported “npx wrangler login and signed in to cloudflare, authentication completed”. This resumes the previously authorized protected-proxy deployment using the configured local key, server secrets and public endpoint URL. No provider key may be published to GitHub or the frontend.

26 October Product Design follow-up: owner requested “review design and make it more user friendly and organized,” authorized automated Chromium when the in-app capture tool failed, and selected **“2”** from the newly displayed set of three organization concepts. The new selected target is `docs/design/2026-10-26-organization/direction-2.png` (1487×1058), experiment workbench. This is a new visual selection for the same authorized product, superseding the earlier concept 1 layout. It does not authorize changing backend secrets, collecting pupil identities or claiming a new physical-device/pupil validation.

| Phase | Status | Evidence |
|---|---|---|
| Planning, repository setup and scoped issues | Authorized | User request, 24 October 2026, AISoundLab continuation |
| POC implementation and model training | NOT APPROVED | Await explicit owner instruction |
| Product implementation | NOT APPROVED | Requires POC review and explicit owner instruction |
| Visual direction | NOT SELECTED | Per-feature briefs prepared; no mockups generated |
| Deployment/public sharing | NOT APPROVED | Decide after release review |

Future entries must quote the actual owner approval and identify the permitted scope. Do not mark a gate passed based on this plan.
