// Menus, selection screens, HUD, game over.
// Uses scene.createRenderable for persistent overlays.

namespace ui {

    // Starfield background
    interface Star { x: number; y: number; speed: number; big: boolean }
    let stars: Star[] = []

    export function initStars() {
        stars = []
        for (let i = 0; i < 40; i++) {
            stars.push({
                x: randint(0, 159),
                y: randint(0, 119),
                speed: randint(20, 80),
                big: Math.percentChance(20)
            })
        }
    }

    export function updateStars(dtMs: number) {
        const dt = dtMs / 1000
        for (const s of stars) {
            s.y += s.speed * dt
            if (s.y > 120) {
                s.y = 0
                s.x = randint(0, 159)
            }
        }
    }

    function drawStars() {
        for (const s of stars) {
            if (s.big) {
                screen.setPixel(s.x, s.y, 1)
                screen.setPixel(s.x - 1, s.y, 1)
                screen.setPixel(s.x + 1, s.y, 1)
                screen.setPixel(s.x, s.y - 1, 1)
                screen.setPixel(s.x, s.y + 1, 1)
            } else {
                screen.setPixel(s.x, s.y, 1)
            }
        }
    }

    // Helper: center-print a string in font5 at a given y position.
    function printCenteredF5(s: string, y: number, col: number) {
        const w = s.length * image.font5.charWidth
        screen.print(s, (160 - w) / 2, y, col, image.font5)
    }

    // Global renderable that dispatches per gs.screen.
    let mainRenderable: scene.Renderable = null

    export function install() {
        scene.setBackgroundColor(15)
        initStars()
        if (mainRenderable) return
        mainRenderable = scene.createRenderable(-50, function () {
            // Stars are only drawn outside of minigames (they have their own backgrounds).
            if (gs.screen == gs.Screen.BladeArena) return
            if (gs.screen == gs.Screen.CanyonRun) return
            if (gs.screen == gs.Screen.FpsBattle) return
            drawStars()
        })
        // Minigame background layer at z=-40 (above stars, below sprites).
        scene.createRenderable(-40, function () {
            if (gs.screen == gs.Screen.BladeArena) {
                arena.drawBackground()
            } else if (gs.screen == gs.Screen.Sidescroller) {
                sider.drawBackground()
            } else if (gs.screen == gs.Screen.FpsBattle) {
                fps.drawBackground()
            }
        })
        // HUD overlay
        scene.createRenderable(100, function () {
            switch (gs.screen) {
                case gs.Screen.Boot: drawBoot(); break
                case gs.Screen.Title: drawTitle(); break
                case gs.Screen.Settings: drawSettings(); break
                case gs.Screen.Help: drawHelp(); break
                case gs.Screen.DifficultySelect: drawDifficultySelect(); break
                case gs.Screen.FactionSelect: drawFactionSelect(); break
                case gs.Screen.ShipSelect: drawShipSelect(); break
                case gs.Screen.LevelIntro: drawLevelIntro(); break
                case gs.Screen.Playing: drawHud(); break
                case gs.Screen.BossIntro: drawBossIntro(); break
                case gs.Screen.BossFight: drawHud(); bosses.drawHpBar(); break
                case gs.Screen.LevelComplete: drawLevelComplete(); break
                case gs.Screen.UpgradeChoice: drawUpgradeChoice(); break
                case gs.Screen.ShipUnlocked: drawShipUnlocked(); break
                case gs.Screen.GameOver: drawGameOver(); break
                case gs.Screen.Paused: drawHud(); drawPauseOverlay(); break
                case gs.Screen.CanyonRunIntro: drawTrenchIntro(); break
                case gs.Screen.CanyonRun: trench.draw(); break
                case gs.Screen.CanyonRunResult: drawTrenchResult(); break
                case gs.Screen.BladeArenaIntro: drawArenaIntro(); break
                case gs.Screen.BladeArena: arena.draw(); break
                case gs.Screen.BladeArenaResult: drawArenaResult(); break
                case gs.Screen.FpsBattleIntro: drawFpsIntro(); break
                case gs.Screen.FpsBattle: fps.draw(); break
                case gs.Screen.FpsBattleResult: drawFpsResult(); break
                case gs.Screen.SidescrollerIntro: drawSiderIntro(); break
                case gs.Screen.Sidescroller: sider.draw(); break
                case gs.Screen.SidescrollerResult: drawSiderResult(); break
                case gs.Screen.TestMenu: drawTestMenu(); break
                case gs.Screen.ShipPreview: drawShipPreview(); break
            }
            if (gs.screen != gs.Screen.Boot) {
                drawBattery()
            }
        })
    }

    // ====== BOOT SPLASH ======
    // Phase 1 (0-1500ms):    stars race radially outward (hyperspace).
    // Phase 2 (1500-3000ms): "STAR" logo flickers in.
    // Phase 3 (3000-5000ms): "FIGHTER" + tagline appear.
    interface WarpStar { angle: number; dist: number; speed: number }
    let warpStars: WarpStar[] = []
    let bootStartMs: number = 0

    export function initBoot() {
        bootStartMs = game.runtime()
        warpStars = []
        for (let i = 0; i < 60; i++) {
            warpStars.push({
                angle: Math.random() * Math.PI * 2,
                dist: Math.random() * 30,
                speed: 30 + Math.random() * 90
            })
        }
    }

    export function updateBoot(dtMs: number) {
        const dt = dtMs / 1000
        for (const s of warpStars) {
            s.dist += s.speed * dt
            if (s.dist > 110) {
                s.dist = 0
                s.angle = Math.random() * Math.PI * 2
                s.speed = 30 + Math.random() * 120
            }
        }
    }

    export function bootElapsedMs(): number {
        return game.runtime() - bootStartMs
    }

    function drawBoot() {
        // Black background (hyperspace)
        screen.fill(15)

        const t = bootElapsedMs()

        // Warp stars: long streaks scaled by speed
        for (const s of warpStars) {
            const cx = 80, cy = 60
            const x1 = cx + Math.cos(s.angle) * s.dist
            const y1 = cy + Math.sin(s.angle) * s.dist
            const trail = Math.min(20, s.dist * 0.25)
            const x0 = cx + Math.cos(s.angle) * Math.max(0, s.dist - trail)
            const y0 = cy + Math.sin(s.angle) * Math.max(0, s.dist - trail)
            // Color by distance: central blue-white, outer white
            const col = s.dist < 30 ? 9 : (s.dist < 60 ? 8 : 1)
            screen.drawLine(x0, y0, x1, y1, col)
        }

        // Phase 2+3: logo
        if (t > 1500) {
            // Flicker phase
            const showLogo = t > 2000 || Math.idiv(t, 90) % 2 == 0
            if (showLogo) {
                screen.print("STAR", 56, 38, 5, image.font12)
            }
            if (t > 2200 && showLogo) {
                // Double shadow for effect
                screen.print("STAR", 57, 39, 2, image.font12)
                screen.print("STAR", 56, 38, 5, image.font12)
            }
        }
        if (t > 3000) {
            screen.print("PILOTS", 48, 56, 2, image.font12)
        }
        if (t > 3500) {
            const tagline = i18n.t("A long time ago...")
            const tf = image.font8
            screen.print(tagline, (160 - tagline.length * tf.charWidth) / 2, 78, 1, tf)
        }
        // Credits
        if (t > 3800) {
            const credits = i18n.t("by Justus and Marcel")
            const cf = image.font5
            screen.print(credits, (160 - credits.length * cf.charWidth) / 2, 90, 13, cf)
        }
        // Hint once the logo animation is complete
        if (t > 4200) {
            if (Math.idiv(t, 400) % 2 == 0) {
                printCenteredF5(i18n.t("Press any key"), 104, 5)
            }
        }
    }

    // ====== BATTERY ======
    function drawBattery() {
        const lvl = hw.batteryLevel()
        // Top-right position (2 px margin)
        const w = 18, h = 7
        const x = 160 - w - 2
        const y = 2
        // Outer case
        screen.fillRect(x, y, w, h, 1)
        screen.fillRect(x + 1, y + 1, w - 2, h - 2, 15)
        // Plus pole bump
        screen.fillRect(x + w, y + 2, 2, h - 4, 1)
        // Fill
        const fillW = Math.idiv((w - 2) * lvl, 100)
        let col = 7   // green
        if (lvl < 50) col = 5  // yellow
        if (lvl < 20) col = 2  // red
        if (fillW > 0) screen.fillRect(x + 1, y + 1, fillW, h - 2, col)
        // Percentage text below
        const txt = "" + lvl + "%"
        screen.print(txt, x + w - txt.length * 4, y + h + 1, 1, image.font5)
    }

    // ====== TITLE ======
    // 5 entries: 0=Game, 1=Ship preview, 2=Help, 3=Settings, 4=Test
    let titleMenuIndex: number = 0
    export function setTitleMenuIndex(i: number) {
        titleMenuIndex = Math.clamp(0, 4, i)
    }
    export function getTitleMenuIndex() { return titleMenuIndex }

    function drawTitle() {
        screen.print("STARPILOTS", 28, 6, 5, image.font12)

        const items = [
            i18n.t("Start game"),
            i18n.t("Ship preview"),
            i18n.t("Help"),
            i18n.t("Settings"),
            i18n.t("Test mode")
        ]
        for (let i = 0; i < items.length; i++) {
            const y = 28 + i * 11
            const selected = (i == titleMenuIndex)
            screen.print(items[i], 26, y, selected ? 5 : 1)
            if (selected && Math.idiv(game.runtime(), 400) % 2 == 0) {
                screen.print(">", 18, y, 5)
            }
        }

        screen.print(i18n.t("BEST") + " " + gs.highscore + " (" + gs.difficultyName() + ")", 18, 90, 13, image.font5)
        screen.print(i18n.t("RANK") + " " + gs.rankName() + " (" + i18n.t("Lvl") + " " + gs.maxLevelReached + ")", 18, 99, 5, image.font5)
        if (gs.squadronUnlocked) {
            screen.print(i18n.t("Squadron Commander active!"), 8, 108, 5, image.font5)
        }
    }

    // ====== SETTINGS ======
    // 0=Volume 1=Brightness 2=Reset progress 3=Back
    // Language is selected at build time (see i18n.ts), not at runtime.
    export const SETTINGS_ROW_VOLUME = 0
    export const SETTINGS_ROW_BRIGHTNESS = 1
    export const SETTINGS_ROW_RESET = 2
    export const SETTINGS_ROW_BACK = 3
    const SETTINGS_ROW_COUNT = 4

    let settingsRow: number = 0
    let resetConfirm: boolean = false
    export function setSettingsRow(i: number) {
        if (resetConfirm) return   // no navigation while confirming
        settingsRow = Math.clamp(0, SETTINGS_ROW_COUNT - 1, i)
    }
    export function getSettingsRow() { return settingsRow }
    export function isResetConfirm() { return resetConfirm }
    export function setResetConfirm(v: boolean) { resetConfirm = v }

    export function settingsAdjust(delta: number) {
        if (resetConfirm) return
        if (settingsRow == SETTINGS_ROW_VOLUME) {
            hw.setVolumeIndex(hw.volumeIndex() + delta)
            audio.sfxRescue() // short feedback ping
        } else if (settingsRow == SETTINGS_ROW_BRIGHTNESS) {
            hw.setBrightnessIndex(hw.brightnessIndex() + delta)
        }
    }

    function drawSettings() {
        screen.print(i18n.t("SETTINGS"), 32, 4, 5, image.font12)

        const rows = [
            { label: i18n.t("Volume"), value: hw.volumePercent() + "%" },
            { label: i18n.t("Brightness"), value: hw.brightnessPercent() + "%" },
            { label: i18n.t("Reset progress"), value: "" },
            { label: i18n.t("Back"), value: "" }
        ]

        for (let i = 0; i < rows.length; i++) {
            const y = 22 + i * 13
            const selected = (i == settingsRow)
            const col = selected ? 5 : 1
            if (selected) {
                screen.print(">", 4, y, 5)
            }
            screen.print(rows[i].label, 14, y, col, image.font5)
            if (rows[i].value.length > 0) {
                screen.print(rows[i].value, 110, y, col, image.font5)
                if (selected) {
                    screen.print("<", 102, y, 5, image.font5)
                    screen.print(">", 138, y, 5, image.font5)
                }
            }
        }
        printCenteredF5(i18n.t("Up/Down L/R A=OK"), 104, 13)

        // Confirmation dialog over the menu
        if (resetConfirm) {
            screen.fillRect(10, 38, 140, 44, 15)
            screen.drawRect(10, 38, 140, 44, 2)
            screen.print(i18n.t("Really reset"), 22, 46, 2, image.font8)
            screen.print(i18n.t("progress?"), 50, 56, 2, image.font8)
            screen.print(i18n.t("A = Yes     B = No"), 24, 70, 5, image.font5)
        }
    }

    // ====== FACTION SELECT (Alliance vs Dominion, with emblems) ======
    let factionIndex: number = 0  // 0 = Alliance, 1 = Dominion
    export function setFactionIndex(i: number) { factionIndex = i }
    export function getFactionIndex() { return factionIndex }

    function drawFactionSelect() {
        printCenteredF5(i18n.t("CHOOSE YOUR SIDE"), 4, 1)
        screen.drawTransparentImage(art.allianceEmblem(), 12, 30)
        screen.drawTransparentImage(art.dominionEmblem(), 116, 30)
        screen.print(i18n.t("ALLIANCE"), 14, 66, 2)
        screen.print(i18n.t("DOMINION"), 110, 66, 13)
        if (factionIndex == 0) {
            screen.drawRect(10, 28, 36, 36, 5)
            screen.print(i18n.t("Free Worlds"), 50, 78, 8)
            screen.print(i18n.t("Alliance"), 50, 88, 8)
            screen.print(i18n.t("Pilots"), 50, 98, 8)
        } else {
            screen.drawRect(114, 28, 36, 36, 5)
            screen.print(i18n.t("Dominion"), 50, 78, 2)
            screen.print(i18n.t("Fleet of"), 50, 88, 2)
            screen.print(i18n.t("the Overlord"), 50, 98, 2)
        }
        printCenteredF5(i18n.t("< > A=OK B=Back"), 116, 5)
    }

    // ====== SHIP SELECT (grid of unlocked ships) ======
    let shipSelectIndex: number = 0  // Index WITHIN the chosen faction
    export function setShipSelectIndex(i: number) {
        const count = ships.countFor(gs.faction)
        if (i < 0) i = 0
        if (i >= count) i = count - 1
        shipSelectIndex = i
    }
    export function getShipSelectIndex() { return shipSelectIndex }

    function drawShipSelect() {
        const count = ships.countFor(gs.faction)
        screen.print(i18n.t("SHIP SELECT"), 28, 4, 5, image.font12)
        // Grid: 3 columns, 2 rows
        const cols = 3
        const cellW = 48
        const cellH = 40
        const gridX = (160 - cellW * cols) / 2
        const gridY = 22

        for (let i = 0; i < count; i++) {
            const col = i % cols
            const row = Math.idiv(i, cols)
            const x = gridX + col * cellW
            const y = gridY + row * cellH
            const globalIdx = ships.globalIndex(gs.faction, i)
            const stats = ships.config[globalIdx]
            const unlocked = gs.isUnlocked(gs.faction, i)
            const selected = (i == shipSelectIndex)
            // Selection frame
            if (selected) {
                screen.drawRect(x, y, cellW, cellH, 5)
            }
            // Ship sprite (scaled half-size: drawn as icon preview, not actual sprite)
            if (unlocked) {
                screen.drawTransparentImage(art.shipSprite(globalIdx), x + 12, y + 2)
            } else {
                // Locked: gray padlock symbol
                screen.fillRect(x + 18, y + 8, 12, 12, 11)
                screen.fillRect(x + 20, y + 4, 8, 6, 11)
                screen.print("L" + stats.unlockLevel, x + 14, y + 22, 1, image.font5)
            }
            // Name
            const nameW = stats.name.length * 4
            screen.print(stats.name, x + (cellW - nameW) / 2, y + cellH - 8, unlocked ? 1 : 13, image.font5)
        }
        // Footer hint
        printCenteredF5(i18n.t("A=Fly B=Back"), 116, 5)
    }

    // ====== UPGRADE CHOICE (after each level) ======
    let upgradeChoice: number = 0  // 0 = Defensive, 1 = Offensive
    export function setUpgradeChoice(i: number) { upgradeChoice = i }
    export function getUpgradeChoice() { return upgradeChoice }

    function drawUpgradeChoice() {
        screen.print(i18n.t("UPGRADE"), 36, 4, 5, image.font12)
        const doneMsg = i18n.t("Level $L cleared!").replace("$L", "" + gs.level)
        screen.print(doneMsg, 38, 22, 7, image.font5)
        const stats = ships.current()
        const isShield = (stats.hpType == 0)

        // Left card: Defensive
        const lx = 8, w = 70
        screen.drawRect(lx, 36, w, 60, upgradeChoice == 0 ? 5 : 13)
        screen.print(i18n.t("DEFENSIVE"), lx + 10, 40, 8)
        if (isShield) {
            screen.print(i18n.t("+20 Max"), lx + 6, 56, 1)
            screen.print(i18n.t("Shield"), lx + 6, 64, 1)
            screen.print(i18n.t("Full refill"), lx + 4, 78, 13, image.font5)
        } else {
            screen.print(i18n.t("+25 Max"), lx + 6, 56, 1)
            screen.print(i18n.t("Armor"), lx + 6, 64, 1)
            screen.print(i18n.t("Full refill"), lx + 4, 78, 13, image.font5)
        }

        // Right card: Offensive (English label from config)
        const rx = 82
        screen.drawRect(rx, 36, w, 60, upgradeChoice == 1 ? 5 : 13)
        screen.print(i18n.t("OFFENSIVE"), rx + 10, 40, 2)
        screen.print(stats.offensiveLabel, rx + 4, 56, 1, image.font5)
        screen.print("(" + stats.name + ")", rx + 4, 78, 13, image.font5)

        screen.print(i18n.t("< > A=OK"), 48, 116, 5)
    }


    // ====== SHIP UNLOCKED (every 2 levels) ======
    let unlockedShipIdx: number = 0
    let unlockedSwitchChoice: number = 0  // 0 = keep, 1 = switch
    export function setUnlockedShip(i: number) { unlockedShipIdx = i; unlockedSwitchChoice = 0 }
    export function setUnlockedSwitchChoice(i: number) { unlockedSwitchChoice = i }
    export function getUnlockedShip() { return unlockedShipIdx }
    export function getUnlockedSwitchChoice() { return unlockedSwitchChoice }

    // ====== PAUSE OVERLAY with menu ======
    let pauseMenuIndex: number = 0  // 0 = Resume, 1 = Quit
    export function setPauseMenuIndex(i: number) {
        pauseMenuIndex = Math.clamp(0, 1, i)
    }
    export function getPauseMenuIndex() { return pauseMenuIndex }

    function drawPauseOverlay() {
        // Pseudo-transparency: scanline pixel pattern
        for (let y = 0; y < 120; y += 2) {
            for (let x = (y % 4 == 0) ? 0 : 1; x < 160; x += 2) {
                screen.setPixel(x, y, 15)
            }
        }
        // Box
        const bx = 30, by = 32, bw = 100, bh = 64
        screen.fillRect(bx, by, bw, bh, 15)
        screen.drawRect(bx, by, bw, bh, 5)
        screen.print(i18n.t("PAUSE"), 62, by + 4, 5, image.font12)

        // Menu entries
        const items = [i18n.t("Resume"), i18n.t("Quit")]
        for (let i = 0; i < items.length; i++) {
            const y = by + 24 + i * 14
            const selected = (i == pauseMenuIndex)
            if (selected) {
                screen.fillRect(bx + 6, y - 2, bw - 12, 12, 5)
                screen.print(">", bx + 10, y, 15)
            }
            screen.print(items[i], bx + 22, y, selected ? 15 : 1)
        }
        // Shortcuts at bottom
        screen.print(i18n.t("Up/Down A=OK"), 36, by + bh - 8, 13, image.font5)
    }

    function drawShipUnlocked() {
        screen.print(i18n.t("NEW SHIP"), 32, 4, 5, image.font12)
        screen.print(i18n.t("UNLOCKED!"), 14, 20, 2, image.font12)
        const globalIdx = ships.globalIndex(gs.faction, unlockedShipIdx)
        const stats = ships.config[globalIdx]
        screen.drawTransparentImage(art.shipSprite(globalIdx), 68, 36)
        screen.print(stats.name, 80 - stats.name.length * 3, 66, 1)
        screen.print(i18n.t("Switch ship now?"), 16, 80, 13, image.font5)
        screen.drawRect(20, 92, 50, 16, unlockedSwitchChoice == 0 ? 5 : 13)
        screen.print(i18n.t("Keep"), 22, 98, 1, image.font5)
        screen.drawRect(90, 92, 50, 16, unlockedSwitchChoice == 1 ? 5 : 13)
        screen.print(i18n.t("Switch"), 95, 98, 2, image.font5)
    }

    // ====== LEVEL INTRO ======
    function drawLevelIntro() {
        screen.fillRect(0, 50, 160, 24, 15)
        screen.print(i18n.t("LEVEL") + " " + gs.level, 56, 56, 5, image.font12)
        if (gs.faction == gs.Faction.Alliance) {
            screen.print(i18n.t("Free Worlds Alliance"), 14, 100, 8)
        } else {
            screen.print(i18n.t("Dominion Fleet"), 14, 100, 2)
        }
    }

    // ====== HUD ======
    function drawHud() {
        // Score
        screen.print("" + gs.score, 2, 2, 5, image.font5)
        // Level / HI (below battery indicator)
        const levelStr = i18n.t("L") + gs.level
        screen.print(levelStr, 158 - levelStr.length * 4, 17, 1, image.font5)
        const hiStr = i18n.t("HI") + gs.highscore
        screen.print(hiStr, 158 - hiStr.length * 4, 23, 13, image.font5)

        // Shield / armor bar at bottom
        const barX = 2
        const barY = 113
        const barW = 60
        const barH = 5
        screen.fillRect(barX - 1, barY - 1, barW + 2, barH + 2, 15)
        screen.fillRect(barX, barY, barW, barH, 13)
        const stats = ships.current()
        if (stats.hpType == 0) {
            const fill = Math.idiv(barW * gs.shield, Math.max(1, gs.maxShield))
            screen.fillRect(barX, barY, fill, barH, 8)
            screen.print(i18n.t("S"), barX - 1, barY - 7, 8, image.font5)
        } else {
            const fill = Math.idiv(barW * gs.armor, Math.max(1, gs.maxArmor))
            screen.fillRect(barX, barY, fill, barH, 2)
            screen.print(i18n.t("A"), barX - 1, barY - 7, 2, image.font5)
        }
        // Ship name to the right of the bar
        screen.print(stats.name, 90, barY - 7, 1, image.font5)

        // Special cooldown indicator (replaces the old bombs counter)
        drawSpecialIndicator(stats)

        // Rescued count
        const rescuesStr = i18n.t("R:") + gs.rescues
        screen.print(rescuesStr, 130, 114, 5, image.font5)
    }

    function drawSpecialIndicator(stats: ships.Stats) {
        const x = 70
        const y = 112
        const w = 36
        const h = 6
        // Frame
        screen.fillRect(x - 1, y - 1, w + 2, h + 2, 15)
        screen.fillRect(x, y, w, h, 13)
        // Cooldown fill
        const ready = ships.isSpecialReady()
        const f = ships.specialReadyFraction()
        const fillW = Math.idiv(w * f, 1)
        const col = ready ? 7 : 4   // green = ready, orange = charging
        if (fillW > 0) screen.fillRect(x, y, fillW, h, col)
        // Label
        screen.print(stats.specialLabel, x + 2, y - 7, ready ? 7 : 1, image.font5)
        // Blink marker when ready
        if (ready && Math.idiv(game.runtime(), 300) % 2 == 0) {
            screen.print("!", x + w + 2, y - 1, 5, image.font5)
        }
    }

    // ====== BOSS INTRO ======
    let bossIntroStart: number = 0
    export function startBossIntro() {
        bossIntroStart = game.runtime()
        audio.sfxBossWarning()
    }
    function drawBossIntro() {
        drawHud()
        const t = game.runtime() - bossIntroStart
        const isFinal = (gs.level >= 11)

        // For the final boss: dramatic multi-phase cutscene
        if (isFinal) {
            // Phase 1 (0-1500): "URGENT MESSAGE" flashing
            // Phase 2 (1500-3000): faction message
            // Phase 3 (3000-4500): boss name
            if (t < 1500) {
                if (Math.idiv(t, 180) % 2 == 0) {
                    screen.fillRect(0, 30, 160, 30, 15)
                    screen.print(i18n.t("URGENT!"), 42, 36, 2, image.font12)
                    screen.print(i18n.t("MESSAGE"), 42, 50, 5, image.font5)
                }
            } else if (t < 3000) {
                screen.fillRect(0, 30, 160, 50, 15)
                screen.drawRect(0, 30, 160, 50, 5)
                if (gs.faction == gs.Faction.Alliance) {
                    screen.print(i18n.t("THE DOMINION HAS"), 18, 38, 1, image.font5)
                    screen.print(i18n.t("A NEW WEAPON!"), 18, 48, 1, image.font5)
                    screen.print(i18n.t("Destroy it!"), 26, 64, 5)
                } else {
                    screen.print(i18n.t("THE ALLIANCE HAS"), 12, 38, 1, image.font5)
                    screen.print(i18n.t("FORMED A FLEET!"), 8, 48, 1, image.font5)
                    screen.print(i18n.t("Wipe them out!"), 18, 64, 5)
                }
            } else {
                const name = bosses.bossName()
                // Boss name as large red text
                if (Math.idiv(t, 250) % 2 == 0) {
                    screen.fillRect(0, 50, 160, 30, 2)
                }
                screen.print(name, 80 - name.length * 3, 60, 5)
                screen.print(i18n.t("FINAL BOSS"), 32, 76, 5)
            }
        } else {
            // Normal boss intro
            if (Math.idiv(t, 200) % 2 == 0) {
                screen.fillRect(0, 50, 160, 22, 2)
                screen.print(i18n.t("WARNING!"), 46, 54, 5, image.font12)
            }
            const name = bosses.bossName()
            screen.print(name, 80 - name.length * 3, 76, 1)
        }
    }

    // ====== LEVEL COMPLETE ======
    function drawLevelComplete() {
        screen.fillRect(20, 40, 120, 40, 15)
        screen.drawRect(20, 40, 120, 40, 5)
        screen.print(i18n.t("LEVEL CLEARED!"), 26, 50, 7)
        screen.print(i18n.t("Score:") + " " + gs.score, 34, 62, 1)
        screen.print(i18n.t("Next: L") + (gs.level + 1), 30, 70, 5)
    }

    // ====== GAME OVER ======
    let gameOverNewHi: boolean = false
    export function setNewHighscore(v: boolean) { gameOverNewHi = v }

    function drawGameOver() {
        screen.fillRect(10, 24, 140, 80, 15)
        screen.drawRect(10, 24, 140, 80, 2)
        screen.print(i18n.t("GAME OVER"), 42, 32, 2, image.font12)
        screen.print(i18n.t("Level reached:") + " " + gs.level, 16, 52, 1)
        screen.print(i18n.t("Score:") + " " + gs.score, 26, 64, 5)
        screen.print(i18n.t("Rescues:") + " " + gs.rescues, 22, 74, 7)
        if (gameOverNewHi) {
            if (Math.idiv(game.runtime(), 300) % 2 == 0) {
                screen.print(i18n.t("NEW BEST!"), 34, 86, 5)
            }
        } else {
            screen.print(i18n.t("BEST:") + " " + gs.highscore, 36, 86, 13)
        }
        screen.print(i18n.t("A = Again"), 38, 96, 1)
    }

    // ====== DIFFICULTY SELECT ======
    let diffIndex: number = 0
    export function setDifficultyIndex(i: number) {
        diffIndex = Math.clamp(0, 3, i)
    }
    export function getDifficultyIndex() { return diffIndex }

    function drawDifficultySelect() {
        screen.print(i18n.t("DIFFICULTY"), 28, 4, 5, image.font12)
        const names = [i18n.t("Easy"), i18n.t("Normal"), i18n.t("Hard"), i18n.t("Veteran")]
        const desc = [i18n.t("Score x1.0"), i18n.t("Score x1.5"), i18n.t("Score x2.0"), i18n.t("Score x3.0 Start L3")]
        for (let i = 0; i < 4; i++) {
            const y = 28 + i * 18
            const selected = (i == diffIndex)
            if (selected) screen.drawRect(8, y - 2, 144, 16, 5)
            const col = selected ? 5 : 1
            screen.print(names[i], 14, y, col)
            screen.print(desc[i], 70, y + 1, selected ? 5 : 13, image.font5)
        }
        printCenteredF5(i18n.t("A=Pick B=Back"), 116, 5)
    }

    // ====== HELP SCREEN (5 pages) ======
    let helpPage: number = 0
    const HELP_PAGES = 5
    export function setHelpPage(i: number) {
        if (i < 0) i = 0
        if (i >= HELP_PAGES) i = HELP_PAGES - 1
        helpPage = i
    }
    export function getHelpPage() { return helpPage }
    export function isLastHelpPage() { return helpPage == HELP_PAGES - 1 }

    function drawHelp() {
        screen.print(i18n.t("HELP") + "  " + (helpPage + 1) + "/" + HELP_PAGES, 4, 2, 5, image.font5)
        switch (helpPage) {
            case 0: drawHelpControls(); break
            case 1: drawHelpShipTypes(); break
            case 2: drawHelpSpecial(); break
            case 3: drawHelpPickups(); break
            case 4: drawHelpProgression(); break
        }
        printCenteredF5(i18n.t("< > Page A=Next B=End"), 114, 13)
    }

    function drawHelpControls() {
        screen.print(i18n.t("CONTROLS"), 40, 10, 1, image.font12)
        screen.print(i18n.t("D-Pad"), 8, 34, 5, image.font5)
        screen.print(i18n.t("Move / Menu"), 58, 34, 1, image.font5)
        screen.print("A", 8, 50, 5, image.font5)
        screen.print(i18n.t("Shoot / OK"), 58, 50, 1, image.font5)
        screen.print("B", 8, 66, 5, image.font5)
        screen.print(i18n.t("Special action"), 58, 66, 1, image.font5)
        screen.print("MENU", 8, 82, 5, image.font5)
        screen.print(i18n.t("Pause in game"), 58, 82, 1, image.font5)
    }

    function drawHelpShipTypes() {
        screen.print(i18n.t("SHIP TYPES"), 28, 10, 1, image.font12)
        screen.drawTransparentImage(art.falconAPlayer, 8, 28)
        screen.print(i18n.t("Alliance"), 38, 30, 2)
        screen.print(i18n.t("Shield (regenerates)"), 38, 40, 8, image.font5)
        screen.print(i18n.t("fast recovery"), 38, 48, 13, image.font5)
        screen.drawTransparentImage(art.sabreIPlayer, 8, 64)
        screen.print(i18n.t("Dominion"), 38, 66, 13)
        screen.print(i18n.t("Armor (fixed)"), 38, 76, 2, image.font5)
        screen.print(i18n.t("no auto-heal"), 38, 84, 13, image.font5)
    }

    function drawHelpSpecial() {
        screen.print(i18n.t("SPECIAL (B)"), 30, 10, 1, image.font12)
        screen.print(i18n.t("Per ship type:"), 4, 28, 5)
        screen.print(i18n.t("Repair: Shield/Armor"), 8, 40, 8, image.font5)
        screen.print(i18n.t("  +healing"), 8, 48, 13, image.font5)
        screen.print(i18n.t("Boost: +Speed +Heal"), 8, 58, 6, image.font5)
        screen.print(i18n.t("Weapon: Torpedo/Bomb"), 8, 68, 2, image.font5)
        screen.print(i18n.t("Seismic: AOE wave"), 8, 78, 4, image.font5)
        screen.print(i18n.t("Cooldown bottom right!"), 4, 92, 5, image.font5)
    }

    function drawHelpPickups() {
        screen.print(i18n.t("PICKUPS"), 50, 10, 1, image.font12)
        screen.drawTransparentImage(art.asteroidGuardian, 8, 28)
        screen.print(i18n.t("Guardian (blue)"), 32, 32, 8)
        screen.print(i18n.t("Alliance: +250"), 32, 42, 13, image.font5)
        screen.print(i18n.t("Dominion: -150"), 32, 50, 2, image.font5)
        screen.drawTransparentImage(art.asteroidShadow, 8, 64)
        screen.print(i18n.t("Shadow (red)"), 32, 68, 2)
        screen.print(i18n.t("Dominion: +250"), 32, 78, 13, image.font5)
        screen.print(i18n.t("Alliance: -150"), 32, 86, 2, image.font5)
    }

    function drawHelpProgression() {
        screen.print(i18n.t("PROGRESSION"), 28, 10, 1, image.font12)
        screen.print(i18n.t("After level: pick upgrade"), 6, 28, 1, image.font5)
        screen.print(i18n.t("(Defensive or Offensive)"), 6, 36, 13, image.font5)
        screen.print(i18n.t("New ships: Lvl 3/5/7/9"), 6, 48, 5, image.font5)
        screen.print(i18n.t("Minigames: Lvl 3/5/7/9"), 6, 58, 1, image.font5)
        screen.print(i18n.t("Trench Run: top ship"), 6, 68, 2, image.font5)
        screen.print(i18n.t("All ships: Wingmen"), 6, 78, 6, image.font5)
        screen.print(i18n.t("Lvl 11: Final Boss"), 6, 88, 8, image.font5)
        screen.print(i18n.t("Every 10 lvl: new rank"), 6, 98, 13, image.font5)
    }

    // ====== TRENCH RUN INTRO ======
    function drawTrenchIntro() {
        screen.fill(15)
        screen.print(i18n.t("MISSION"), 50, 4, 5, image.font12)
        screen.print(i18n.t("CANYON RUN"), 38, 18, 2, image.font12)
        // Story block
        if (gs.faction == gs.Faction.Alliance) {
            screen.print(i18n.t("Hit the reactor"), 4, 36, 1, image.font5)
            screen.print(i18n.t("vent of the Citadel!"), 4, 44, 5, image.font5)
        } else {
            screen.print(i18n.t("Destroy the Alliance"), 4, 36, 1, image.font5)
            screen.print(i18n.t("command ship!"), 4, 44, 5, image.font5)
        }
        // Controls
        screen.print(i18n.t("CONTROLS:"), 4, 56, 7, image.font5)
        screen.print(i18n.t("D-Pad  move"), 4, 66, 1, image.font5)
        screen.print(i18n.t("       reticle"), 4, 74, 1, image.font5)
        screen.print(i18n.t("A      shoot"), 4, 84, 1, image.font5)
        screen.print(i18n.t("(Reticle on target, then A)"), 0, 92, 13, image.font5)
        // Footer
        screen.print(i18n.t("A=Start B=Skip"), 38, 108, 5, image.font5)
    }

    // ====== ARENA INTRO ======
    function drawArenaIntro() {
        screen.fill(15)
        screen.print(i18n.t("MISSION"), 50, 4, 5, image.font12)
        screen.print(i18n.t("PLASMA BLADE"), 28, 18, 2, image.font12)
        // Story
        if (gs.faction == gs.Faction.Alliance) {
            screen.print(i18n.t("Guardian vs Shadow - Duel!"), 4, 36, 8, image.font5)
            screen.print(i18n.t("Defeat the Shadow Lord"), 4, 44, 5, image.font5)
        } else {
            screen.print(i18n.t("Shadow vs Guardian - Duel!"), 4, 36, 2, image.font5)
            screen.print(i18n.t("Destroy the Guardian"), 4, 44, 5, image.font5)
        }
        // Controls
        screen.print(i18n.t("CONTROLS:"), 4, 56, 7, image.font5)
        screen.print(i18n.t("D-Pad     Move"), 4, 66, 1, image.font5)
        screen.print(i18n.t("A         Swing"), 4, 74, 1, image.font5)
        screen.print(i18n.t("B         Jump (Dodge)"), 4, 82, 1, image.font5)
        screen.print(i18n.t("Close to enemy = hit"), 0, 92, 13, image.font5)
        screen.print(i18n.t("A=Start B=Skip"), 38, 108, 5, image.font5)
    }

    // ====== ARENA RESULT ======
    function drawArenaResult() {
        screen.fill(15)
        if (arena.isPlayerVictorious()) {
            screen.print(i18n.t("VICTORY!"), 60, 14, 5, image.font12)
            screen.print(i18n.t("+3000 score bonus"), 22, 44, 5)
            screen.print(i18n.t("Honor and Peace!"), 18, 60, 7)
        } else {
            screen.print(i18n.t("DEFEAT"), 38, 14, 2, image.font12)
            screen.print(i18n.t("No bonus this time"), 24, 44, 1)
            screen.print(i18n.t("But the adventure goes on."), 4, 60, 13, image.font5)
        }
        screen.print(i18n.t("HP:") + " " + arena.getPlayerHp() + "/100", 50, 78, 1)
        screen.print(i18n.t("A = Continue"), 50, 102, 5)
    }

    // ====== FPS INTRO ======
    function drawFpsIntro() {
        screen.fill(15)
        screen.print(i18n.t("MISSION"), 50, 4, 5, image.font12)
        screen.print(i18n.t("GROUND FIGHT"), 36, 18, 2, image.font12)
        // Short story
        if (gs.faction == gs.Faction.Alliance) {
            screen.print(i18n.t("Take down 8 Dominion troopers!"), 4, 36, 5, image.font5)
        } else {
            screen.print(i18n.t("Take down 8 Alliance troopers!"), 0, 36, 5, image.font5)
        }
        // How-to instructions
        screen.print(i18n.t("HOW TO:"), 4, 50, 7, image.font5)
        screen.print(i18n.t("Move the RED reticle"), 0, 60, 1, image.font5)
        screen.print(i18n.t("over enemies with D-Pad."), 0, 68, 1, image.font5)
        screen.print(i18n.t("Press A to shoot."), 4, 76, 1, image.font5)
        screen.print(i18n.t("Enemies vanish after 3s -"), 0, 86, 13, image.font5)
        screen.print(i18n.t("aim fast + pull the trigger!"), 0, 94, 13, image.font5)
        screen.print(i18n.t("A=Start B=Skip"), 38, 108, 5, image.font5)
    }

    // ====== FPS RESULT ======
    function drawFpsResult() {
        screen.fill(15)
        const success = fps.isSuccess()
        if (success) {
            screen.print(i18n.t("SUCCESS!"), 56, 14, 5, image.font12)
            screen.print(i18n.t("+3000 score bonus"), 22, 44, 5)
            screen.print(i18n.t("Outpost secured"), 14, 60, 7)
        } else {
            screen.print(i18n.t("RETREATED"), 26, 14, 2, image.font12)
            screen.print(i18n.t("Not enough hits"), 28, 44, 1)
            screen.print(i18n.t("Next time!"), 36, 60, 13)
        }
        screen.print(i18n.t("Kills:") + " " + fps.getKills() + " " + i18n.t("/ HP:") + " " + fps.getPlayerHp(), 18, 78, 1)
        screen.print(i18n.t("A = Continue"), 50, 102, 5)
    }

    // ====== SIDESCROLLER INTRO ======
    function drawSiderIntro() {
        screen.fill(15)
        screen.print(i18n.t("MISSION"), 50, 4, 5, image.font12)
        screen.print(i18n.t("PATROL"), 36, 18, 2, image.font12)
        if (gs.faction == gs.Faction.Alliance) {
            screen.print(i18n.t("Guardian mission: repel"), 4, 36, 1, image.font5)
            screen.print(i18n.t("Dominion trooper wave"), 4, 44, 5, image.font5)
        } else {
            screen.print(i18n.t("Shadow mission: wipe out"), 4, 36, 1, image.font5)
            screen.print(i18n.t("Alliance troopers"), 4, 44, 5, image.font5)
        }
        screen.print(i18n.t("CONTROLS:"), 4, 58, 7, image.font5)
        screen.print(i18n.t("D-Pad L/R Move"), 4, 68, 1, image.font5)
        screen.print(i18n.t("A         Swing"), 4, 76, 1, image.font5)
        screen.print(i18n.t("B         Jump"), 4, 84, 1, image.font5)
        screen.print(i18n.t("15 kills in 40s = success"), 0, 96, 13, image.font5)
        screen.print(i18n.t("A=Start B=Skip"), 38, 108, 5, image.font5)
    }

    function drawSiderResult() {
        screen.fill(15)
        const success = sider.isSuccess()
        if (success) {
            screen.print(i18n.t("SUCCESS!"), 56, 14, 5, image.font12)
            screen.print(i18n.t("+3000 score bonus"), 22, 44, 5)
            screen.print(i18n.t("Wave repelled!"), 28, 60, 7)
        } else {
            screen.print(i18n.t("OVERRUN"), 38, 14, 2, image.font12)
            screen.print(i18n.t("Too many enemies!"), 28, 44, 1)
        }
        screen.print(i18n.t("Kills:") + " " + sider.getKills() + " " + i18n.t("/ HP:") + " " + sider.getPlayerHp(), 14, 78, 1)
        screen.print(i18n.t("A = Continue"), 50, 102, 5)
    }

    // ====== TEST MENU ======
    const TEST_ITEM_COUNT = 5
    let testMenuIndex: number = 0
    export function setTestMenuIndex(i: number) {
        if (i < 0) i = TEST_ITEM_COUNT - 1
        if (i >= TEST_ITEM_COUNT) i = 0
        testMenuIndex = i
    }
    export function getTestMenuIndex() { return testMenuIndex }
    export function getTestItemCount() { return TEST_ITEM_COUNT }

    // ====== SHIP PREVIEW ======
    // View-only: page through all ships, no gameplay.
    let previewIndex: number = 0
    export function setPreviewIndex(i: number) {
        const n = ships.config.length
        if (i < 0) i = n - 1
        if (i >= n) i = 0
        previewIndex = i
    }
    export function getPreviewIndex() { return previewIndex }

    function drawShipPreview() {
        screen.fill(15)
        const s = ships.config[previewIndex]
        screen.print(i18n.t("SHIP PREVIEW"), 24, 4, 5, image.font12)
        screen.print((previewIndex + 1) + "/" + ships.config.length, 130, 6, 13, image.font5)
        screen.drawTransparentImage(art.shipSprite(previewIndex), 72, 26)
        screen.print(s.name, 8, 56, 1)
        screen.print(s.faction == gs.Faction.Alliance ? i18n.t("Alliance") : i18n.t("Dominion"),
            8, 66, s.faction == gs.Faction.Alliance ? 2 : 13, image.font5)
        screen.print(i18n.t("From level") + " " + s.unlockLevel, 8, 76, 5, image.font5)
        screen.print(i18n.t("HP") + " " + s.maxHp + "  " + i18n.t("Speed") + " " + s.speed, 8, 86, 1, image.font5)
        screen.print(i18n.t("Bolts") + " " + s.bolts + "  " + i18n.t("Dmg") + " " + s.damage, 8, 94, 1, image.font5)
        screen.print(i18n.t("Special:") + " " + s.specialLabel, 8, 102, 7, image.font5)
        screen.print(i18n.t("< > A/B=Back"), 30, 112, 13, image.font5)
    }

    function drawTestMenu() {
        screen.fill(15)
        screen.print(i18n.t("TEST MENU"), 36, 4, 5, image.font12)
        screen.print(i18n.t("Launch minigames directly"), 4, 20, 13, image.font5)
        const items = [
            i18n.t("Arena (Guardian/Shadow)"),
            i18n.t("Canyon Run"),
            i18n.t("FPS Ground Fight"),
            i18n.t("Sidescroller"),
            i18n.t("Back to title")
        ]
        for (let i = 0; i < items.length; i++) {
            const y = 32 + i * 12
            const selected = (i == testMenuIndex)
            if (selected) {
                screen.fillRect(4, y - 2, 152, 11, 12)
                screen.print(">", 8, y, 5)
            }
            screen.print(items[i], 18, y, selected ? 5 : 1)
        }
        screen.print(i18n.t("Up/Down A=OK B=Back"), 4, 110, 13, image.font5)
    }

    // ====== TRENCH RUN RESULT ======
    function drawTrenchResult() {
        screen.fill(15)
        const success = trench.isEndTargetHit() && trench.getTargetsDestroyed() >= 8
        if (success) {
            screen.print(i18n.t("MISSION"), 50, 10, 5, image.font12)
            screen.print(i18n.t("ACCOMPLISHED!"), 32, 26, 7, image.font12)
            screen.print(i18n.t("+5000 score bonus"), 22, 50, 5)
            if (trench.isEndTargetHit()) {
                screen.print(i18n.t("End target hit!"), 22, 64, 1)
            }
        } else {
            screen.print(i18n.t("MISSION"), 50, 10, 5, image.font12)
            screen.print(i18n.t("MISSED"), 50, 26, 2, image.font12)
            screen.print(i18n.t("Adventure continues anyway"), 14, 52, 1)
        }
        screen.print(i18n.t("Targets:") + " " + trench.getTargetsDestroyed(), 50, 78, 13)
        screen.print(i18n.t("A = Continue"), 50, 102, 5)
    }
}
