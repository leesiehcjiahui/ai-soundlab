# AI SoundLab setup · public session release

The frontend's new GitHub Pages address is [leesiehcjiahui.github.io/ai-soundlab](https://leesiehcjiahui.github.io/ai-soundlab/), with source in [leesiehcjiahui/ai-soundlab](https://github.com/leesiehcjiahui/ai-soundlab). See the [migration record](docs/2026-10-26/REPOSITORY-MIGRATION.md) for cutover status. The secured API is `https://ai-soundlab-proxy.ai-soundlab.workers.dev`. Node 22+ and Cloudflare Wrangler are required for development or deployment. The existing server-side key remains in Cloudflare.

## Local checks

```powershell
npm ci
npm run check
npm run test:runtime
node scripts/init-local.mjs
npm run dev
```

`init-local` creates ignored `proxy/.env` only when absent and never overwrites an existing file. Set `OPENAI_API_KEY` and `AI_ENABLED=true` there privately; keep `IP_HASH_SECRET` random and at least 32 characters. Never paste the key in chat or put it in a `VITE_` variable, source, GitHub, or a browser. `git check-ignore proxy/.env` confirms ignore status. Do not print the env file.

For local API use, run `npm run proxy:dev` in another terminal. The frontend's `VITE_PROXY_URL` is a public Worker URL, not a secret. All AI calls send bounded written answers only. Audio and names are never sent by app code; tell pupils not to include names or personal details in written answers.

## Hosted Worker and Pages

`proxy/wrangler.jsonc` carries the exact allowed origins and caps: 12 public requests/minute, 20/IP/minute, 200/day and 2,000/month. Input is capped at 8 KiB. Model responses are capped and time-limited. IP addresses are HMAC-hashed with a server secret for quota keys; no pupil answer or audio database is used. Quota rejection is visible and makes no OpenAI call. These limits are spend controls, not identity verification.

The two hosted secrets are `OPENAI_API_KEY` and `IP_HASH_SECRET`. To update them from the ignored local env after verifying the intended Cloudflare account:

```powershell
node scripts/upload-proxy-secrets.mjs
npm run proxy:deploy
```

The upload script transports secret values to Wrangler's stdin and redacts output. For manual upload, use `npx wrangler secret put OPENAI_API_KEY --config proxy/wrangler.jsonc` and similarly for `IP_HASH_SECRET`; enter values only at Wrangler's private prompt. The retired hosted `CLASS_CODE` secret was deleted after this release. Do not commit secrets.

The public GitHub Actions variable `VITE_PROXY_URL` points to the Worker. Pages source is GitHub Actions; merging a tested change triggers deployment. Before claiming a release is live, confirm the Actions run and load the published URL. `npm run test:live` makes two paid synthetic requests to the hosted API. `node scripts/hosted-security-gate.mjs` checks the hosted boundary without paid requests.

## Classroom use and limits

Pupils can complete all four simulations and write answers without AI. Check buttons submit written answers to AI; the nearby notice explains this without a separate checkbox. The five-question assessment is available immediately, including before completing any mission. Answers and reports remain in memory only and disappear on reload/closing the tab. No login, teacher mode, class code, Evidence Book, IndexedDB write, or export is used in this release. Existing data saved by older releases on a prior device is not read by this release; clear the browser's site data separately if desired. See the [0.5.0 learning-feedback revision](docs/2026-10-27/LEARNING-FEEDBACK-0.5.0.md) for the current prompts, output caps and Sound Detective listening flow.

Microphone permission is requested only when a pupil chooses recording. The ruler comparison needs a quiet baseline and a ruler-sound sample; the graph shows microphone signal, not direct ruler movement. Echo's optional recording is replayed locally with a synthetic reflected copy. Sound Travel and Echo show slowed models; displayed model times are explanatory, not instrument measurements. The AI reviews text, never listens to recordings or identifies their source. Practice scores are not official PBD judgments.

For a release check, test on a laptop and a physical phone: permissions, stop/playback, leaving-page microphone cleanup, both Travel listener drag and keyboard movement, Echo hard/soft trials, optional echo recording, stage AI, five-question assessment, and quota/error states. Obtain Science-teacher review of the current rubric; prior approval applied to an older feedback bank.
