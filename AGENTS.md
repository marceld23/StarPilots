# AGENTS.md

Notes for AI agents continuing work on this project. Collection of the most important findings and pitfalls from development so far.

## Project context

- **Repo layout**: README/AGENTS at the repo root, all MakeCode source under [`game/`](game/). Run every build command from inside `game/`.
- **Target**: MakeCode Arcade on the **ELECFREAKS Retro** (STM32F401-based)
- **Build via**: `cd game && yarn dlx makecode build -h stm32f401 [--deploy]` (Yarn 4, `yarn global add` does not work — `dlx` is the way)
- **Language**: the user communicates in German, but the codebase is now English-first. Comments stay in English. UI strings are localized via [i18n.ts](game/i18n.ts) (EN/DE switchable in Settings).
- **Asset workflow**: sprites can be edited visually in the VS Code Asset Explorer; the user is familiar with that.

## MakeCode Arcade pitfalls

### Palette colors (very important!)

The MakeCode Arcade default palette is **not** the intuitive standard palette:

| Hex | Index | Color | Hex RGB | Note |
| --- | --- | --- | --- | --- |
| `1` | 1 | White | `#ffffff` | |
| `2` | 2 | Red | `#ff2121` | |
| `3` | 3 | Pink | `#ff93c4` | |
| `4` | 4 | Orange | `#ff8135` | |
| `5` | 5 | Yellow | `#fff609` | |
| `6` | 6 | Teal | `#249ca3` | |
| `7` | 7 | Green | `#78dc52` | |
| `8` | 8 | Dark blue | `#003fad` | |
| `9` | 9 | Light blue / cyan | `#87f2ff` | |
| `a` | 10 | Purple | `#8e2ec4` | |
| `b` | 11 | **Gray-lavender** | `#a4839f` | **This is the only "gray"!** |
| `c` | 12 | Dark purple | `#5c406c` | |
| `d` | 13 | Cream / wheat | `#e5cdc4` | |
| `e` | 14 | **Brown (NOT gray!)** | `#91463d` | Trap! |
| `f` | 15 | Black | `#000000` | |

**Common mistake**: using `e` for "gray". That gives brown. Use `b` for gray.

The Dreadnought initially looked brown because `e` was used — the fix was to switch to `b`.

### Image literals (sprite pixel art)

- **Column count per row must match exactly**, otherwise the compiler rejects it
- Tokens are separated by spaces (`. . . 1 1 . .`), rows ended by line breaks
- For a 24×24 sprite: every row must be exactly 24 tokens
- For larger sprites (e.g. 48×32 bosses) manual maintenance is error-prone — **prefer programmatic generation** with `image.create(w, h)` + `fillRect/setPixel/drawRect`

### Which Math / API functions exist

Works in MakeCode Arcade Static TypeScript:
- `Math.idiv(a, b)`, `Math.percentChance(n)`, `Math.randomRange(min, max)`, `randint(min, max)`
- `Math.PI`, `Math.cos/sin/sqrt`, `Math.max/min/floor/abs`, `Math.clamp(min, max, v)`
- `Math.random()` (returns a float)
- `(value | 0)` for integer cast — safer replacement for `Math.floor()` in some cases

Does **not** work directly:
- `sprites.setDataNumber/readDataNumber/setDataString/readDataString` — instead use `sprite.data["key"] = value` directly (the `data` property is `any`)
- Strict TS null checks for `let foo: Image = null` — throws errors. Workaround: `let foo: Image = null as any` or `: any`
- String literal types (`"a" | "b"`) can be flaky — plain `string` is more robust

### Sprite custom data

```typescript
// Not: sprites.setDataNumber(s, "hp", 5)
// Instead:
s.data["hp"] = 5
const hp: number = s.data["hp"]
```

### Bootloader / deploy

- ELECFREAKS Retro in bootloader mode → mounts as USB drive **`ARCADE-F4`** (was `D:` in this session)
- After every flash the device auto-reboots and the drive disappears → to re-deploy, bootloader mode must be re-enabled
- Variant must be `stm32f401`, **not** the default `n3`

### Sound

- `music.stringPlayable(notes, tempo)` for melodies
- `music.tonePlayable(freq, ms)` for simple tones
- `music.PlaybackMode.LoopingInBackground` for looping BGM
- `music.setVolume(0-255)` (standard scale, not 0-100)
- `music.stopAllSounds()` for a hard stop

### Persistence

- `settings.writeNumber(key, value)` / `settings.readNumber(key)` for highscore, audio settings, brightness, language
- Data survives a power cycle

## Game flow architecture

Main state machine in [main.ts](game/main.ts) using enum `gs.Screen`:

```
Boot ──(any key)──▶ Title
                        ├──(A)──▶ Selection ──(A)──▶ LevelIntro ──(Timer)──▶ Playing
                        │                                                       │
                        ├──(MENU)──▶ Settings ──(MENU/B/A on Back)──▶ Title    │
                        │                                                       │
                        └──(B)──▶ Mute Toggle                       BossIntro ◀─┤
                                                                    │   (all enemies gone)
                                                                    ▼
                                                                 BossFight
                                                                    │
                                                                    ▼ (boss dead)
                                                              LevelComplete
                                                                    │
                                                                    ▼ (Timer)
                                                                LevelIntro (Lvl++)

Any screen + player death ──▶ GameOver ──(A)──▶ Title
```

The update loop in `game.onUpdate(...)` dispatches based on `gs.screen`. A UI renderable at z=100 draws the matching overlay (HUD or menu) per screen.

## Localization (i18n) — compile-time selection

All player-facing UI strings flow through `i18n.t("English text")`. The English string at the call site doubles as the lookup key.

The language is chosen **at build time**, not at runtime — the STM32F401 flash budget can't fit both string tables in one binary. Two modules implement the same `namespace i18n` API:

- `i18n.ts`: English build. `t()` is identity; calls return their input unchanged.
- `i18n.de.ts`: German build. `t()` consults a single `switch (key)` that returns the German translation, or falls back to the English input for any unknown key.

Only one of those two files may be listed in `pxt.json` at a time. To build German firmware, swap `"i18n.ts"` for `"i18n.de.ts"` in the `files` array, rebuild and flash.

To add or change a translation: edit `i18n.de.ts`. Adding new English UI strings does not require touching `i18n.de.ts` — they simply pass through unchanged in the German build (acceptable fallback).

Coverage tradeoff: not every English string is translated in `i18n.de.ts`. Menu navigation, settings, faction/ship select, upgrade/pause/game-over, boss names and short result labels are translated. Verbose help / intro / how-to text intentionally stays in English even in the German build — translating all of it pushed the binary past the flash limit. If you add German for those screens, expect to drop something else (or compress sprites) to make room.

To add another language, copy `i18n.de.ts` to e.g. `i18n.fr.ts`, replace the German strings, update `languageName()`, and swap the file reference in `pxt.json`.

## Important design decisions

- **Endless levels** instead of a fixed count (user request). Difficulty scales via formulas in [state.ts](game/state.ts).
- **Battery display** in [hw.ts:13](game/hw.ts#L13) is a placeholder — there's no universal battery API in the ELECFREAKS standard lib. Swap when a hardware extension is added.
- **The 2nd Alliance-side boss** is the "Razor Squadron" (4 elite Dominion fighters as a squadron boss). Confirmed by the user — don't change without asking.
- **Boss phases**: 3 phases based on HP (100-66%, 66-33%, < 33%). Phase logic lives in [bosses.ts](game/bosses.ts).
- **Ship models differ** between the two factions:
  - Falcon-A (Alliance starter): shield regenerates, shoots 4 lasers, no hull HP
  - Sabre-I (Dominion starter): armor without regen, shoots 2 lasers

## User feedback history

What the user explicitly called out (in order of requests):

1. "The Falcon-A doesn't look like a fighter." → Sprite redone from scratch with a long nose, blue cockpit, **4 proper diagonal wing-blades** in an X formation, red laser cannons at all 4 tips, 2 engines at the rear. Previously it was a plus sign with horizontal wings.
2. "Dreadnought doesn't look like one." → Rebuilt programmatically with a **wedge shape**, **bridge tower**, **two shield domes** and **3 main engines**.
3. "Dreadnought isn't gray." → Palette bug: `14`/`e` is brown, not gray. Fixed using `11`/`b`.
4. "Alliance-fighter enemies should look like Falcon-A." → Layout taken from the player Falcon-A, mirrored vertically (nose pointing down toward the player), shadow using `b` instead of `e`.
5. "Guardian and Shadow aren't visible." → Enlarged the figure, made the plasma blade clearly visible, added a star halo around the figure, increased spawn rate (55%) + shortened interval.
6. "Now they spawn too often." → Reduced to 25%, interval to 3.5-5.5s.
7. "Boss attacks too hard." → Fire interval lengthened (1500/1100/700 ms), bolt speed dropped from 130 to 90, spray reduced from 5 to 3 bolts.
8. "Boot splash should wait for a key press, not auto-skip." → Removed the 5s auto-skip; all arrow keys, A and B abort.

## Hardware pitfalls

### Vibration on ELECFREAKS Retro — kernel panic!

`pins.pinByCfg(DAL.CFG_PIN_VIBRATION)` (index 76) **must not** be used without hardware knowledge. In one attempt during this session the returned pin on the Retro either didn't exist or was shared with critical peripheral hardware → immediate kernel panic (continuous tone + bright screen + device unresponsive).

**Consequence**: `hw.vibrate()` is a no-op ([hw.ts:18](game/hw.ts#L18)). Hit feedback uses `scene.cameraShake(amplitude, durationMs)` instead.

**Before using `pinByCfg`** for any hardware feature, check:
1. Does the specific board actually define this config (in `codal.json` or its hardware datasheet)?
2. If unsure: do not use it — the device can only be recovered via bootloader mode + re-flash.

## Recommendations for follow-up work

- **Sabre-I player sprite** to be checked — probably also has brown shadows (`e` → `b`)
- **Crescent Frigate** and **Leviathan Cruiser** are programmatically generated using `c`/`d`/`12`/`13` — may need adjustment if the player tests the Dominion faction
- **Enemy sprites** (`enemySabreI`, `enemyMaulerI`, `enemyAegisI`, `enemyScoutR`, `enemyCrossB`) all use `e` for shadows — should be switched to `b` when the player expects gray
- **Sound themes** are original compositions in heroic/imperial march style (no copyrighted melodies) — keep IP in mind
- When adding new ships or features, **count sprite dimensions very carefully** or generate programmatically

## Quick reference: build/deploy

```bash
cd game

# Build only
yarn dlx makecode build -h stm32f401

# Build + Deploy (Retro must be mounted as ARCADE-F4)
yarn dlx makecode build -h stm32f401 --deploy

# Show available HW variants
yarn dlx makecode build -h list

# Check removable drives (Windows)
wmic logicaldisk where "DriveType=2" get DeviceID,VolumeName
```
