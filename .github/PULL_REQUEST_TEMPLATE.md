## What this changes

Brief description.

## Why

Motivation — what gameplay, bug, or improvement does this address?

## How to test

How a reviewer can verify this works (build / flash / which screen to look at).

## Checklist

- [ ] Both EN and DE builds pass — `cd game && yarn dlx makecode build -h stm32f401`, then swap `"i18n.ts"` for `"i18n.de.ts"` in `game/pxt.json` and rebuild
- [ ] No new user-visible strings without a German translation (or the fall-through to English is acceptable)
- [ ] Code comments in English
- [ ] Linked to a related issue (if applicable)
