# Instructions for future Codex work

## Active repository · 26 October 2026

The owner requested migration to leesiehcjiahui/ai-soundlab. This is now the canonical repository and local origin. Pages is https://leesiehcjiahui.github.io/ai-soundlab/ . The original lauhoekeat repository is the legacy remote and retains historical PR/issue links. The Cloudflare Worker remains on the existing account; both Pages origins are explicitly allowed during migration. See docs/2026-10-26/REPOSITORY-MIGRATION.md for observed checks.

## Active product scope · 26 October 2026

The owner's latest request supersedes the older teacher/class-code/Evidence Book flows: public session-only app, AI guidance for Predict/Try/Explain in each mission, and a five-question 10-point practice assessment. No teacher mode, class code, Save or persistence. Source of truth: `docs/2026-10-26/PUBLIC-SESSION-RELEASE.md`, `SETUP.md` and current code. Earlier plans and approval rows below are historical. The release may use the previously authorized GitHub Pages and Cloudflare deployment workflow. Do not reuse the previous Science-teacher approval for the revised scoring rubrics.

## Active override · 25 October 2026

Current owner authorization is recorded in docs/approvals.md. Follow docs/2026-10-25/ as the active plan. POC implementation, tests, CI and deployment preparation are authorized. Product continuation is authorized only after the active POC gates pass. Owner explicitly authorized public source for free Pages in this chat. Student-facing UI requires owner visual selection; a plain diagnostic harness is permitted for POC. Do not enforce historical planning-only or TensorFlow-training requirements below against the newer explicit request. Never mark unrun live/device/teacher gates passed. Backend hosting is complete following owner Cloudflare setup; a question about ChatGPT hosting was clarified as uncertainty, not authorization to create a Sites backend.

Current product update: owner selected concept 1, reported both devices passed, and reported Science review approved. Product development is authorized and merged through PR #19 and published from main. Owner then completed Cloudflare sign-in; secured proxy is deployed at https://ai-soundlab-proxy.ai-soundlab.workers.dev . Follow RELEASE-REPORT.md for final deployment/QA status. Do not re-open already resolved approval questions. Physical device/version details, pupil pilot and organizer eligibility are still not independently verified.

26 October design update: the owner explicitly asked Product Design to review and organize the published app, then selected displayed **option 2** from the new three-image set in `docs/design/2026-10-26-organization/`. This new selection supersedes concept 1 for the current interface while preserving the original product authorization and security constraints. The owner authorized automated Chromium capture when the in-app browser capture could not initialize. See that folder's implementation decision and root `design-qa.md`. Publishing remains part of the original authorized GitHub Pages workflow.

## Historical instructions · 24 October 2026

This is a planning-only repository as of 24 October 2026. The owner has NOT approved development.

Before application changes, model training, dependency installation, prototype scaffolding or deployment, obtain explicit owner approval in the current conversation. An issue assignment, date reaching a milestone, planning document or agent message is not approval. Record the approval text, date, approved phase and chat reference in docs/approvals.md. Never invent or infer a past approval.

Owner approval for a POC permits only the bounded POC in docs/05-poc-gates.md. A passing POC does not authorize product work. Present measured evidence and wait for explicit approval to proceed. Product Design visual selection is a separate requirement before interface implementation; visual selection alone does not grant development permission.

Start with README.md, docs/02-evidence-assumptions.md, docs/11-codex-handoff.md and the scoped issue. Preserve decisions and evidence in GitHub. Use small branches and PRs with linked issue IDs. Do not deploy or publish artifacts without explicit authorization for that action. Keep the repository private unless the owner authorizes visibility change.

No real pupil names, school identifiers, pupil recordings, secrets or raw audio in Git. Use anonymous session codes. Do not silently replace failed AI with simulated predictions. Do not describe scores as calibrated probabilities, relative microphone levels as dB SPL, simulations as measured acoustics, or game completion as official PBD mastery.

Runtime correctness, offline operation, licenses, Malay content and curriculum alignment must be validated, not assumed. Update ADRs when evidence changes a decision. Read relevant Product Design skills before future visual exploration; show three visual options and obtain selection before UI implementation when required by the skill. Planning prose in this repository is not an approved visual reference.
