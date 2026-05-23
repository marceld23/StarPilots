# StarPilots

Top-down space shooter with sub-game-modes for the **ELECFREAKS Retro** (MakeCode Arcade hardware).
Pick a faction (Alliance / Dominion), a ship and a difficulty, fight through endless levels with alternating bosses, and run four different minigames in between.

> **Kid-dad project** — built together by Justus and Marcel. Not a commercial product: a small game we made for fun on a portable arcade handheld. Issues and pull requests welcome, but expect the response cadence of a hobby project.

## Quick Start

1. **Build**: `yarn dlx makecode build -h stm32f401`
2. **Bootloader mode**: plug in USB, hold Reset + press MENU — `ARCADE-F4` shows up as a USB drive
3. **Flash**: `yarn dlx makecode build -h stm32f401 --deploy`
4. **Play**:
   - Splash → press A → Title → Start → Difficulty → Faction → Ship → go
   - Controls: D-Pad to move, A to shoot, B for special, MENU to pause
   - Tester tip: pick **Test mode** on the title screen to launch minigames directly

## Features

- **Endless levels** with procedurally scaling difficulty
- **Four difficulties** with score multipliers (Easy 1×, Normal 1.5×, Hard 2×, Veteran 3×)
- **11 playable ships** (6 Alliance, 5 Dominion), unlocked progressively every 2 levels
- **5 boss types per faction** in rotation, plus a final boss (Citadel Sphere / Alliance Armada) at level 11
- **Four minigames** between levels: Blade arena, Canyon Run, FPS ground fight, sidescroller
- **Squadron Commander**: completing all 4 minigames at least once unlocks 2 AI wingmen in every subsequent run
- **Test mode** in the main menu to launch single minigames directly
- **Persistence**: highscore, ship unlocks, difficulty and minigame progress in the settings store
- **Pause function** during gameplay with a Resume/Quit menu
- **Help screen** (5 pages) on the main menu
- **Bilingual UI** (English / German), selected at compile time per build

## Controls

| Input | Action (in game) |
| --- | --- |
| **D-Pad** | Move ship / navigate menus |
| **A** | Shoot / confirm / skip splash |
| **B** | Special action (ship-dependent) — Repair / Boost / Torpedo / Bomb / Seismic |
| **MENU** | Pause |
| **B in pause menu** | Quit immediately |
| **MENU while paused** | Resume immediately |

Per-ship special actions are shown on the Help screen and in the HUD (cooldown bar at the bottom).

## Game flow

```
Splash (5s, any keypress skips)
   ↓
Title [Start / Help / Settings / Test mode]
   ↓ "Start"
Difficulty [Easy / Normal / Hard / Veteran]
   ↓
Faction select [Alliance / Dominion] (with emblems)
   ↓
Ship select (grid; locked entries grayed out with required level)
   ↓
Level loop:
   Level X intro → Playing (enemy waves) → Boss intro → Boss fight
       ↓
   Level cleared → Upgrade choice (Defensive / Offensive)
       ↓
   Every 2 levels: Ship-Unlocked screen (Keep / Switch)
       ↓
   Mission (Lvl 3 / 5 / 7 / 9) → one of the 4 minigames
       ↓
   continue with the next level
   ↓
Level 11: Final-boss cutscene → Final boss → Top ship unlocked
```

## Ships & stats

### Alliance
| Lvl | Ship | Speed | Shield | Lasers | Special |
|-----|------|-------|--------|--------|---------|
| 1 | Falcon-A | 90 | 100 | 4 | Repair +30 (7s CD) |
| 3 | Scout-R | 140 | 60 | 2 | Repair + Boost (6s CD) |
| 5 | Hammer-B | 65 | 160 | 2 (2× damage) | 2 torpedoes (3.5s CD) |
| 7 | Cross-B | 75 | 130 | 3 | 3-torpedo spread (4s CD) |
| 9 | Vanguard-E | 105 | 120 | 3 | 1 missile (3s CD) |
| 11 | Wayfarer | 100 | 220 | 4-quad | Repair +50 (8s CD) |

### Dominion
| Lvl | Ship | Speed | Armor | Lasers | Special |
|-----|------|-------|-------|--------|---------|
| 1 | Sabre-I | 100 | 150 | 2 | Repair +30 (7s CD) |
| 3 | Mauler-I | 65 | 220 | 2 (2× damage) | 2 bombs (4s CD) |
| 5 | Razor-I | 150 | 110 | 4 | Repair + Boost (6s CD) |
| 7 | Aegis-I | 115 | 240 | 4 | 2 missiles (3s CD) |
| 11 | Bounty-I | 95 | 250 | 4 | Seismic Charge (8s CD, AOE) |

## Bosses

### Alliance player (Dominion bosses)
- Lvl 1, 9: **Dreadnought** (Dominion flagship)
- Lvl 3: **Razor Squadron** (elite escort)
- Lvl 5: **Gravitron Cruiser** (with 4 gravity wells)
- Lvl 7: **Envoy Shuttle** (warlord-class transport)
- Lvl 11: **CITADEL SPHERE** (final boss, 2.5× HP, superlaser)

### Dominion player (Alliance bosses)
- Lvl 1, 9: **Crescent Frigate**
- Lvl 3: **Leviathan Cruiser**
- Lvl 5: **Comet Corvette** (blockade runner)
- Lvl 7: **Forktail Corvette**
- Lvl 11: **ALLIANCE ARMADA** (final boss, 3 waves totalling 11 ships)

## Minigames

These are inserted automatically between certain levels. Each minigame has an intro screen explaining the controls. Success = +3000 / +5000 bonus score (multiplied by difficulty).

### 1. Blade Arena (after Lvl 3)
- 1v1 plasma-blade duel on a planet surface (Guardian vs Shadow)
- **D-Pad** move, **A** swing, **B** jump (dodge with i-frames)
- 30s, enemy HP at 0 = victory
- Success: +3000 pts + minigame flag

### 2. Canyon Run (after Lvl 5)
- Cockpit view of the Citadel canyon (Alliance) or Alliance canyon pursuit (Dominion)
- **D-Pad** moves the reticle, **A** shoots
- 45s, 8 targets + end-target (reactor vent) hit = success
- Success: +5000 pts

### 3. FPS Ground Fight (after Lvl 7)
- First-person shooter in a corridor, 6 spawn positions
- **D-Pad** reticle, **A** shoot
- Enemies return fire after 1.7s — be fast or move the reticle off them
- 30s, 12 kills = success
- Success: +3000 pts

### 4. Sidescroller (after Lvl 9)
- Side-view platformer on a desert moon surface
- **D-Pad L/R** move, **A** plasma-blade swing, **B** jump
- Dominion / Alliance troopers come in from the right and fire bolts
- 30s, 10 kills = success
- Success: +3000 pts

## Squadron Commander

After clearing **all 4 minigames** at least once → **persistently** unlocked (settings flag `sw_squad`).
When active, 2 AI wingmen fly to the left and right of the player ship:
- Follow the player's position smoothly
- Auto-fire every 500ms when enemies/bosses are on screen
- Have their own 30 HP, die when hit enough (no respawn within the same level)

## Test mode

A **separate entry on the title menu** for development and quick testing without playing through:

### How to open
1. On the title screen, navigate **Up/Down** to `Test mode`
2. Press **A**

### What's available
| Entry | What happens |
|-------|--------------|
| Arena (Guardian/Shadow) | Drops directly into the plasma-blade fight |
| Canyon Run | Drops directly into the cockpit shooter |
| FPS Ground Fight | Drops directly into the FPS |
| Sidescroller | Drops directly into the platformer |
| Ship preview | Jumps into the faction/ship picker |
| Back to title | Leaves the test menu |

### How it works (technical)
- Launching a test minigame sets `gs.fromTestMode = true`
- `gs.reset()` resets score/level/upgrades
- Faction/ship are forced to defaults (Alliance, Falcon-A — or Dominion, Sabre-I if previously picked in faction select)
- When the minigame finishes (success, defeat, B-skip), the `exitXxxResult` handler runs
- It checks the flag and **routes back to the test menu** instead of the next level
- Therefore test mode **does not** touch normal game progress (highscore, unlocks, minigame flags)

### Notes
- `markMinigameCompleted(...)` is still set in test mode — so you can also unlock Squadron Commander via the test menu
- The **Ship preview entry** is a shortcut into the regular faction/ship select, useful for quick sprite design checks — afterwards the game continues normally

## Difficulty tiers

| Tier | Enemy HP | Speed | Boss HP | Score multi | Start Lvl |
|------|----------|-------|---------|-------------|-----------|
| Easy | 1.0× | 1.0× | 1.0× | 1.0× | 1 |
| Normal | 1.3× | 1.15× | 1.3× | 1.5× | 1 |
| Hard | 1.7× | 1.3× | 1.6× | 2.0× | 1 |
| Veteran | 2.2× | 1.5× | 2.0× | 3.0× | 3 |

The selected difficulty is persisted.

## Build & flash

**Prerequisites:** Node.js, Yarn 4 (or `npx`).

```bash
# Build for ELECFREAKS Retro (STM32F4)
yarn dlx makecode build -h stm32f401

# Build + Deploy (Retro must be mounted as ARCADE-F4)
yarn dlx makecode build -h stm32f401 --deploy
```

To put the Retro into bootloader mode: plug in USB, **hold Reset + press MENU** — it appears as USB drive `ARCADE-F4`. Then run the deploy command, or drag the `built/stm32f401/binary.uf2` file onto it.

### Other MakeCode Arcade hardware
| Hardware | Variant |
| --- | --- |
| ELECFREAKS Retro | `stm32f401` |
| Adafruit PyGamer / PyBadge | `samd51` |
| Meowbit / kitronik | `n3` |
| Brainpad Arcade | `n4` |
| RPi Pico Arcade | `rp2040` |

## Project layout

```
.
├── main.ts            State machine, input handlers, collisions, update loop
├── state.ts           Shared state, ship config, difficulty, persistence
├── i18n.ts            Localization - English build (identity passthrough)
├── i18n.de.ts         Localization - German build (alternative to i18n.ts)
├── assets.ts          Sprites (ships, bosses, emblems, cockpit, reticle, etc.)
├── audio.ts           Themes + sound effects
├── hw.ts              Battery stub, brightness, volume
├── ui.ts              All screens and renderables
├── player.ts          Player movement, lasers, special, shield/armor
├── enemies.ts         Enemy spawning + AI
├── pickups.ts         Asteroids + Guardian/Shadow pickups
├── bosses.ts          Bosses (incl. Citadel Sphere, Alliance Armada)
├── trenchrun.ts       Minigame: canyon-run cockpit shooter
├── arena.ts           Minigame: Guardian vs Shadow plasma-blade arena
├── fps.ts             Minigame: FPS in a corridor
├── sidescroller.ts    Minigame: side-view platformer
├── squadron.ts        Squadron Commander AI wingmen
└── pxt.json           MakeCode project definition
```

## Note on code identifiers

The display strings, boss names, ship names and internal code identifiers are all the original-IP-clean rebrand. Symbols such as `gs.Faction.Alliance`, `gs.Faction.Dominion`, `art.bossCitadel()`, `art.guardianIdle()`, `art.dominionTrooper()`, `bossType.AllianceArmada`, and asset variables like `falconAPlayer` / `sabreIPlayer` reflect the cleaned naming. Persisted settings keys (`"sw_unlock_r"`, `"sw_unlock_e"`, etc.) keep their old string values to preserve save-file compatibility — only the TS identifier holding the key was renamed.

## Localization

The UI ships in two languages, **selected at compile time**: English (default) or German. The STM32F401 flash budget can only fit one language table at a time, so the language is picked per build, not at runtime.

How it works:
- `i18n.ts` is the English module (identity passthrough — call sites already pass English text).
- `i18n.de.ts` is the German module (single `switch (key)` returning German translations; unknown keys fall back to English).
- [pxt.json](pxt.json) lists exactly one of the two in its `files` array.

### Build in German

1. Open [pxt.json](pxt.json).
2. In the `files` array, replace `"i18n.ts"` with `"i18n.de.ts"`.
3. Rebuild and flash:
   ```bash
   yarn dlx makecode build -h stm32f401 --deploy
   ```
4. To go back to English, swap the entry back.

Only one of the two files may be listed at a time; both define `i18n.t()` and PXT would otherwise reject the build with a duplicate-symbol error.

### Translation coverage

The German module covers menus, settings, buttons, boss names, and short result labels (`SIEG!`, `NIEDERLAGE`, etc.). The longer help-screen / minigame-intro / how-to text stays in English even in the German build — including the full translations there pushes the binary past the flash budget. Add or move entries in [i18n.de.ts](i18n.de.ts) if you need wider coverage and have room to spare.

### Adding another language

1. Copy [i18n.de.ts](i18n.de.ts) to e.g. `i18n.fr.ts`.
2. Replace the German strings in the `switch` cases with French translations.
3. Update `languageName()` to return `"Francais"`.
4. Swap `"i18n.ts"` for `"i18n.fr.ts"` in [pxt.json](pxt.json) and rebuild.

## Hardware notes

- **Battery display** in [hw.ts](hw.ts) is a placeholder (slowly decays) — the ELECFREAKS Retro has no standard API
- **Vibration** on `CFG_PIN_VIBRATION` causes a kernel panic on the Retro hardware (it shares a pin with critical peripherals); it's been disabled as a no-op
- **Palette index `e` (14) is brown**, not gray! For real gray always use `b` (11) (#a4839f, "battleship gray")

## Tips for playing

- **Shield ships** (Alliance) auto-heal after 2.5s without taking a hit — combine risky play with shield + special repair
- **Armor ships** (Dominion) do not regenerate — save special repair for emergencies
- **Bosses have 3 phases** (HP 100-66%, 66-33%, < 33%) with increasing aggression — fire your special in phase 3 to survive the bullet hell
- In **test mode** success still counts toward `markMinigameCompleted` — you can also unlock Squadron Commander without playing through a full run
- **Veteran mode** starts at level 3 — score multiplier 3×, worth it only once you've mastered the gameplay
- **Wrong Guardian/Shadow** on pickup deducts score — check the color before grabbing (Blue = Guardian for Alliance, Red = Shadow for Dominion)
- **Pause bug**: pausing during the boss intro was previously broken (the timer didn't freeze); if something still hangs, pressing MENU should still toggle pause

## Known limitations

- **Vibration** is disabled on Retro hardware (pin conflict). Hit feedback uses `scene.cameraShake` instead
- **Battery level** is a placeholder, not a real hardware reading
- **MakeCode Arcade palette** has only 16 colors — no true gradients or anti-aliasing
- **Sprites with inconsistent column counts in image literals** are rejected by the compiler — that's why the bosses are generated programmatically
- **Particle effects** (effects.fire/spray) persist ~300ms after `sprite.destroy(effect, ms)`; brief remnants may be visible between screens (defensive cleanup in all `stop()` functions mitigates this)
- **Pause** stops sound and freezes all sprites; on resume the faction music restarts (boss theme may be lost)

## Implementation history (major features)

The order in which the main features were built — handy if you want to trace the architecture or extend it:

1. **Foundation**: state machine, sprite assets, audio, player, enemies, bosses, pickups, UI
2. **Phase A**: difficulty tiers, 4 new bosses, German UI, help screen, pause-mute, final-boss cutscene
3. **Pause system**: update loop freezes in `Screen.Paused` (timer + sprites + audio)
4. **Ship system**: 11 playable ships, unlock progression every 2 levels, ship-specific special action (B button) with cooldown HUD
5. **Faction select**: faction emblems instead of direct ship picking
6. **Minigames**: Canyon Run (Lvl 5), Blade Arena (Lvl 3), FPS ground fight (Lvl 7), Sidescroller (Lvl 9)
7. **Test mode**: direct launch of all minigames from the title menu
8. **Squadron Commander**: unlocked after clearing all 4 minigames, persisted in settings, 2 AI wingmen with auto-fire
9. **English-first + compile-time i18n**: all UI strings now flow through `i18n.t()`. English (`i18n.ts`) is the default; swap to `i18n.de.ts` in `pxt.json` to build a German firmware
10. **Original-IP rebrand**: ship and boss names + faction names changed to original universe (StarPilots / Alliance / Dominion) — see "Note on code identifiers" above for symbols intentionally left untouched

## Roadmap

Ideas for future extensions:

- **More difficulty tiers** or per-area difficulty (enemies / boss / minigames separately)
- **Per-difficulty highscores** instead of one shared value with a multiplier
- **More bosses**: super-Dreadnought class, Eclipse-class, command flagship
- **More ships**: heavy interceptor, light bomber for each faction
- **Wingmen upgrades**: secondary special actions (e.g. wingmen draw fire)
- **Multiplayer**: ELECFREAKS Retro supports 2 controllers — 2-player co-op mode
- **More maps in the minigames**: forest moon for sidescroller, ice planet for arena
- **Story mode** with narrative text between levels
- **Additional languages**: French, Spanish, Japanese — the i18n hook is already there
- **Rename internal code identifiers** to match the new universe (currently a separate pass — see "Note on code identifiers")

## License

Private project. All ship, boss, faction and minigame names are original to this project. No trademarked names are intended to be referenced in the user-visible content.
