# AI SoundLab · Misi Detektif Bunyi

[Open the app](https://leesiehcjiahui.github.io/ai-soundlab/) · [Setup](SETUP.md) · [Current release decision](docs/2026-10-26/PUBLIC-SESSION-RELEASE.md) · [Repository migration](docs/2026-10-26/REPOSITORY-MIGRATION.md)

A BM-first, optional-English Year 4 KSSR Science 6.1 practice app. Pupils investigate vibration, sound travelling in all directions, echoes, and the effects of familiar sounds. Each mission has Predict, Try, and Explain sections with optional AI feedback. A final five-question written assessment scores two science ideas per question and gives a 10-point practice report.

The app is public and needs no teacher mode, class code, login, or saved answer. Text and audio remain in the open browser session; only answers submitted for AI feedback are sent to the secured Cloudflare Worker. Recordings are never uploaded. The AI does not identify environmental sounds. Pupils label sounds themselves and reason about their effect.

The frontend is React, TypeScript and Vite on GitHub Pages. The Worker calls OpenAI with a server-side key, strict input schemas, exact Origin allowlist and global/IP request quotas. A public Origin is not authentication; caps bound exposure. See [architecture and release limits](docs/2026-10-26/PUBLIC-SESSION-RELEASE.md).

```powershell
npm ci
npm run check
npm run test:runtime
npm run dev
```

The prior PRD, POC evidence, teacher guide and historical designs remain in [docs/2026-10-25](docs/2026-10-25/README.md). Their class-code, teacher-mode and Evidence Book descriptions are historical; the current behavior is documented above and in the current release decision. Competition eligibility for a music teacher and organizer submission requirements still require official confirmation. This app's score is practice feedback, not an official PBD level.
