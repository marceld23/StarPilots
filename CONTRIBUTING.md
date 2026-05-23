# Contributing

This is a kid-dad hobby project — pull requests and issues are welcome, but please understand the response cadence will not be quick.

## Quick start

The MakeCode source lives in [`game/`](game/). Build the firmware from inside that folder:

```bash
cd game
yarn dlx makecode build -h stm32f401
```

See the [README](README.md) for full setup instructions and [AGENTS.md](AGENTS.md) for an overview of the codebase architecture and the known MakeCode Arcade pitfalls.

## Filing an issue

- For **bugs**: include the hardware (ELECFREAKS Retro or another MakeCode Arcade board), the language build (EN or DE), and how to reproduce. Use the bug-report template.
- For **feature ideas**: explain what you'd like to see and why. Use the feature-request template.

## Sending a pull request

1. Fork the repo, create a branch, make your changes.
2. Verify **both** builds still pass:
   ```bash
   cd game
   yarn dlx makecode build -h stm32f401                # English build
   # then swap "i18n.ts" for "i18n.de.ts" in pxt.json:
   yarn dlx makecode build -h stm32f401                # German build
   # restore "i18n.ts" before committing
   ```
3. Open a pull request. Reference any related issue.

## Style

- Match the existing TypeScript style (4-space indent; follow neighbouring code where the style is unclear).
- All user-visible strings flow through `i18n.t("English text")`. If you add a new string, also add the German translation to [`game/i18n.de.ts`](game/i18n.de.ts) (or accept that it will fall through to English in the German build).
- Comments in English.
- Keep the binary size in mind — the STM32F401 has a tight flash budget. If a change pushes the build over, expect to be asked to trim something else.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Short version: be kind, stay on topic, remember a kid might be reading.
