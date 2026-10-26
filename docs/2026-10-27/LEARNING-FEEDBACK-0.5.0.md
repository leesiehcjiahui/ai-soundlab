# Learning feedback revision · 27 October 2026

## Owner request and product decision

The owner requested removal of the school-grade statement, consent checkbox, challenge idea scores, detached science-answer examples and collapsed Science idea. They requested feedback explaining why the pupil's answer is correct or incorrect; a clear teaching section below every Explain activity; Assessment access without completing missions; and a useful purpose for Sound Detective recordings.

The four challenge panels now display the AI's explanation of the pupil's actual answer, without visible criterion scores or reference-answer blocks. Each Explain page ends with an always-visible, prominent science lesson containing a causal explanation, a key idea and a concrete example. Assessment can be opened from a fresh session and retains its total out of ten and strengths/improvement report. Each question shows explanatory AI feedback without a separate model-answer block or individual idea score.

The explicit Check button submits written answers. A short notice next to it says what is sent and asks pupils to leave out names; the separate consent checkbox and school-grade disclaimer have been removed at the owner's request. Session-only storage and audio staying on-device remain unchanged.

## Sound Detective use case

The pupil helps someone reduce a sound disturbance: record or choose a sound, replay it, describe its pattern (one short sound, continuous, or repeated), state a listening situation, and explain a useful/harmful effect and a safe action. The observation and situation reappear on Explain and are included with the explanation in AI requests. The recording is evidence the pupil listens to, not an AI sound-classification input. The unused signal graph is removed from this listening task; Discover Vibration still shows its microphone graph and two-recording comparison.

The supplied Pencil-Tap.m4a was used locally to verify import and playback, selecting a repeated pattern, writing a classroom-reading situation, and carrying that context through to Explain. It is not a vibration experiment and no raw audio was committed or uploaded to AI.

## Prompt and security

The previous model returned only booleans; the server converted missing criteria into rubric language. The new strict JSON schema adds a bounded feedback string. The prompt includes the fixed question, criteria, reference science and pupil text, then asks for a short explanation that acknowledges a valid idea, identifies a misconception or omission, and teaches the causal link. It accepts BM/EN answers without penalising grammar and explicitly fixes the output language to the UI language.

Guards cover prediction as a testable hypothesis, observed versus inferred evidence, all-direction propagation, material affecting reflection strength at equal same-air distance, partial absorption/reflection, no calibrated SPL claims and no unheard-audio identification. Responses are plain text in React. The server still calculates assessment marks from validated booleans and rejects missing/oversized/non-text feedback, extra properties and invalid provider responses.

The fixed model is unchanged. Output token caps rise to 450 per section and 1,600 for the five-question assessment so explanations fit; feedback is capped at 600 characters per item and written input remains bounded (2,200 characters for contextual section responses; 500 per assessment answer). The 8 KiB request cap, 20-second provider timeout, no retries, store:false, exact Origin allowlist, and atomic request quotas remain. More output per call increases potential token usage within the existing request quotas.

The schema approach follows [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Schema validation guarantees shape, not scientific accuracy; the new generated explanations still require teacher review for classroom use.

## Verification before deployment

- Typecheck, 50 unit/proxy tests, build and frontend credential scan pass.
- Local Worker route and 50-way atomic quota tests pass.
- Live synthetic stage checks cover the screenshot's hand answer, a correct BM vibration answer, wrong sound direction, Echo absorption versus speed and a contextual pencil-tap explanation. They explain the relevant misconception or valid cause.
- An initial mixed assessment produced feedback in the wrong UI language. The prompt was strengthened with an explicit output-language instruction. A fresh live mixed assessment then returned English explanations and a server-derived 6/10, correcting the hand and curtain misconceptions while explaining why the other three answers were correct.
- [Synthetic five-question responses](synthetic-assessment-feedback.json) preserve a final local live sample for review; they contain only authored test answers and generated feedback.
- Playwright, used because the Browser plugin is not available, passes Assessment from a fresh session, removal of the checkbox/score/reference blocks, all four lesson sections, supplied Pencil-Tap import/playback and context transfer, and 390px mobile width. No page or console errors were observed.

These are synthetic adult fixtures and automated viewport checks. They do not claim a new physical-phone or pupil-pilot pass.
