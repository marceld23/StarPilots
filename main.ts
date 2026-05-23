// StarPilots - main module.
// Wires together game state, input handlers and update loops.

scene.setBackgroundColor(15)
gs.loadHighscore()
gs.loadUnlocks()
gs.loadDifficulty()
gs.loadMinigameProgress()
gs.loadMaxLevel()
hw.applyAllSettings()
ui.install()

let lastUpdateMs: number = game.runtime()
let stateTimer: number = 0

// ============= PAUSE LOGIC =============
interface SpriteVel { s: Sprite; vx: number; vy: number }
let pauseSavedVels: SpriteVel[] = []
let pauseSavedScreen: gs.Screen = gs.Screen.Playing

function togglePause() {
    if (gs.screen == gs.Screen.Paused) {
        resumeFromPause()
    } else if (gs.screen == gs.Screen.Playing || gs.screen == gs.Screen.BossFight || gs.screen == gs.Screen.BossIntro) {
        enterPause()
    }
}

function enterPause() {
    pauseSavedScreen = gs.screen
    pauseSavedVels = []
    const kinds = [SpriteKind.Player, SpriteKind.Enemy, SpriteKind.EnemyShot,
        SpriteKind.PlayerShot, SpriteKind.Boss, SpriteKind.Asteroid, SpriteKind.Rescue]
    for (const k of kinds) {
        for (const s of sprites.allOfKind(k)) {
            pauseSavedVels.push({ s: s, vx: s.vx, vy: s.vy })
            s.vx = 0
            s.vy = 0
        }
    }
    const p = player.getSprite()
    if (p) controller.moveSprite(p, 0, 0)
    // Fully stop sound while paused.
    audio.stop()
    ui.setPauseMenuIndex(0)
    gs.screen = gs.Screen.Paused
}

function resumeFromPause() {
    for (const sv of pauseSavedVels) {
        if (sv.s) {
            sv.s.vx = sv.vx
            sv.s.vy = sv.vy
        }
    }
    pauseSavedVels = []
    const p = player.getSprite()
    if (p) {
        const stats = ships.current()
        controller.moveSprite(p, stats.speed, Math.max(60, stats.speed * 0.75))
    }
    // Bring themes back (boss theme if boss is active, otherwise faction theme).
    if (bosses.isActive()) {
        // Boss theme is not re-triggered automatically on damageBoss; just play the
        // faction theme and let the boss theme kick back in on the next spawn.
        audio.playFactionTheme(gs.faction)
    } else {
        audio.playFactionTheme(gs.faction)
    }
    gs.screen = pauseSavedScreen
}

// ============= STATE TRANSITIONS =============
function goToBoot() {
    gs.screen = gs.Screen.Boot
    ui.initBoot()
}

function goToTitle() {
    gs.screen = gs.Screen.Title
    cleanupGameSprites()
    audio.stop()
}

function goToSettings() {
    gs.screen = gs.Screen.Settings
    ui.setResetConfirm(false)
    ui.setSettingsRow(0)
}

function goToHelp() {
    gs.screen = gs.Screen.Help
    ui.setHelpPage(0)
}

function goToDifficultySelect() {
    gs.screen = gs.Screen.DifficultySelect
    ui.setDifficultyIndex(gs.difficulty)
}

function goToFactionSelect() {
    gs.screen = gs.Screen.FactionSelect
    ui.setFactionIndex(0)
}

function goToShipSelect() {
    gs.faction = ui.getFactionIndex() == 0 ? gs.Faction.Alliance : gs.Faction.Dominion
    gs.screen = gs.Screen.ShipSelect
    // Pre-select the highest unlocked ship.
    let lastUnlocked = 0
    for (let i = 0; i < ships.countFor(gs.faction); i++) {
        if (gs.isUnlocked(gs.faction, i)) lastUnlocked = i
    }
    ui.setShipSelectIndex(lastUnlocked)
}

function startGame() {
    cleanupGameSprites()
    gs.reset()
    const factionShipIdx = ui.getShipSelectIndex()
    const globalIdx = ships.globalIndex(gs.faction, factionShipIdx)
    player.spawn(globalIdx)
    squadron.spawn()
    audio.playFactionTheme(gs.faction)
    goToLevelIntro()
}

function goToLevelIntro() {
    gs.screen = gs.Screen.LevelIntro
    stateTimer = 1500
}

function startLevel() {
    gs.screen = gs.Screen.Playing
    gs.recordLevel(gs.level)
    enemies.startLevel()
    pickups.startLevel()
}

function goToBossIntro() {
    gs.screen = gs.Screen.BossIntro
    ui.startBossIntro()
    // For level 11 (final boss) play a much longer, dramatic cutscene.
    stateTimer = (gs.level >= 11) ? 4500 : 1800
}

function startBossFight() {
    gs.screen = gs.Screen.BossFight
    bosses.spawn(onBossDefeated)
}

function onBossDefeated() {
    gs.screen = gs.Screen.LevelComplete
    audio.sfxLevelUp()
    stateTimer = 1500
}

// Whether a minigame follows after this level.
// Mission mapping per level:
// Lvl 3 -> Arena, Lvl 5 -> Sidescroller, Lvl 7 -> FPS, Lvl 9 -> Trench Run
// (Trench run sits right before Lvl 11 where the Wayfarer/Bounty-I is unlocked.)
function missionAfterLevel(lvl: number): number {
    if (lvl == 3) return 1
    if (lvl == 5) return 4
    if (lvl == 7) return 3
    if (lvl == 9) return 2
    return 0
}

function startMissionAfterLevel(lvl: number) {
    const m = missionAfterLevel(lvl)
    if (m == 1) goToArenaIntro()
    else if (m == 2) goToTrenchRunIntro()
    else if (m == 3) goToFpsIntro()
    else if (m == 4) goToSiderIntro()
    else nextLevel()
}

function goToTrenchRunIntro() {
    gs.screen = gs.Screen.CanyonRunIntro
    audio.stop()
}

function startTrenchRun() {
    cleanupGameSprites()
    gs.screen = gs.Screen.CanyonRun
    trench.start(onTrenchDone)
}

// When true: after the ShipUnlocked screen go straight to the next level
// instead of restarting the minigame (otherwise the trench run would replay).
let trenchUnlockedTopShip: boolean = false

function onTrenchDone() {
    trenchUnlockedTopShip = false
    if (trench.isSuccess()) {
        gs.markMinigameCompleted(1)
        // Reward: unlock the faction's top ship (Wayfarer / Bounty-I).
        const topIdx = ships.countFor(gs.faction) - 1
        if (gs.unlockShip(gs.faction, topIdx)) {
            trenchUnlockedTopShip = true
            ui.setUnlockedShip(topIdx)
        }
    }
    gs.screen = gs.Screen.CanyonRunResult
}

function exitTrenchResult() {
    trench.stop()
    if (gs.fromTestMode) { gs.fromTestMode = false; goToTestMenu(); return }
    cleanupGameSprites()
    const stats = ships.current()
    player.spawn(stats.index)
    audio.playFactionTheme(gs.faction)
    if (trenchUnlockedTopShip) {
        gs.screen = gs.Screen.ShipUnlocked
        return
    }
    nextLevel()
}

// ===== Arena =====
function goToArenaIntro() {
    gs.screen = gs.Screen.BladeArenaIntro
    audio.stop()
}

function startArena() {
    cleanupGameSprites()
    gs.screen = gs.Screen.BladeArena
    arena.start(onArenaDone)
}

function onArenaDone() {
    if (arena.isPlayerVictorious()) gs.markMinigameCompleted(0)
    gs.screen = gs.Screen.BladeArenaResult
}

function exitArenaResult() {
    arena.stop()
    if (gs.fromTestMode) { gs.fromTestMode = false; goToTestMenu(); return }
    cleanupGameSprites()
    const stats = ships.current()
    player.spawn(stats.index)
    audio.playFactionTheme(gs.faction)
    nextLevel()
}

// ===== FPS ground fight =====
function goToFpsIntro() {
    gs.screen = gs.Screen.FpsBattleIntro
    audio.stop()
}

function startFps() {
    cleanupGameSprites()
    gs.screen = gs.Screen.FpsBattle
    fps.start(onFpsDone)
}

function onFpsDone() {
    if (fps.isSuccess()) gs.markMinigameCompleted(2)
    gs.screen = gs.Screen.FpsBattleResult
}

function exitFpsResult() {
    fps.stop()
    if (gs.fromTestMode) { gs.fromTestMode = false; goToTestMenu(); return }
    cleanupGameSprites()
    const stats = ships.current()
    player.spawn(stats.index)
    audio.playFactionTheme(gs.faction)
    nextLevel()
}

// ===== Sidescroller =====
function goToSiderIntro() {
    gs.screen = gs.Screen.SidescrollerIntro
    audio.stop()
}

function startSider() {
    cleanupGameSprites()
    gs.screen = gs.Screen.Sidescroller
    sider.start(onSiderDone)
}

function onSiderDone() {
    if (sider.isSuccess()) gs.markMinigameCompleted(3)
    gs.screen = gs.Screen.SidescrollerResult
}

function exitSiderResult() {
    sider.stop()
    if (gs.fromTestMode) { gs.fromTestMode = false; goToTestMenu(); return }
    cleanupGameSprites()
    const stats = ships.current()
    player.spawn(stats.index)
    audio.playFactionTheme(gs.faction)
    nextLevel()
}

// ===== Test menu =====
function goToTestMenu() {
    cleanupGameSprites()
    audio.stop()
    gs.screen = gs.Screen.TestMenu
    ui.setTestMenuIndex(0)
}

// Helper: test-launch a minigame - faction defaults to Alliance, state is reset.
function setupForTest() {
    gs.fromTestMode = true
    gs.reset()
    gs.faction = ui.getFactionIndex() == 1 ? gs.Faction.Dominion : gs.Faction.Alliance
    // Ship: faction starter ship
    gs.shipId = ships.globalIndex(gs.faction, 0)
}

function selectTestItem(idx: number) {
    switch (idx) {
        case 0:  // Arena
            setupForTest()
            goToArenaIntro()
            break
        case 1:  // Trench Run
            setupForTest()
            goToTrenchRunIntro()
            break
        case 2:  // FPS
            setupForTest()
            goToFpsIntro()
            break
        case 3:  // Sidescroller
            setupForTest()
            goToSiderIntro()
            break
        case 4:  // Back
            goToTitle()
            break
    }
}

function goToShipPreview() {
    cleanupGameSprites()
    audio.stop()
    gs.screen = gs.Screen.ShipPreview
    ui.setPreviewIndex(0)
}

function goToUpgradeChoice() {
    gs.screen = gs.Screen.UpgradeChoice
    ui.setUpgradeChoice(0)
}

function applyUpgrade(choice: number) {
    const stats = ships.current()
    if (choice == 0) {
        // Defensive
        if (stats.hpType == 0) {
            gs.upgradeShieldBonus += 20
            gs.maxShield = ships.effectiveMaxShield()
            gs.shield = gs.maxShield
        } else {
            gs.upgradeArmorBonus += 25
            gs.maxArmor = ships.effectiveMaxArmor()
            gs.armor = gs.maxArmor
        }
    } else {
        // Offensive - per ship
        const shipName = stats.name
        if (shipName == "Scout-R") {
            gs.upgradeExtraBolts += 1
        } else if (shipName == "Hammer-B" || shipName == "Mauler-I") {
            gs.upgradeDamageBonus += 1
        } else if (shipName == "Cross-B") {
            gs.upgradeExtraBolts += 1
        } else if (shipName == "Vanguard-E" || shipName == "Aegis-I") {
            gs.upgradeExtraBolts += 1
        } else if (shipName == "Wayfarer" || shipName == "Bounty-I") {
            gs.upgradeFireCooldownReduction += 60
        } else {
            // Falcon-A, Sabre-I, Razor-I
            gs.upgradeFireCooldownReduction += 40
        }
    }
    audio.sfxPowerup()
}

function afterUpgrade() {
    // Check whether a new ship is unlocked (every 2 levels)
    const newLevel = gs.level + 1
    const unlockTriggers = [3, 5, 7, 9, 11]
    let unlockedSomething = false
    for (const trigger of unlockTriggers) {
        if (newLevel == trigger) {
            const factionCount = ships.countFor(gs.faction)
            for (let i = 0; i < factionCount; i++) {
                const globalIdx = ships.globalIndex(gs.faction, i)
                if (ships.config[globalIdx].unlockLevel == trigger) {
                    if (gs.unlockShip(gs.faction, i)) {
                        ui.setUnlockedShip(i)
                        gs.screen = gs.Screen.ShipUnlocked
                        unlockedSomething = true
                        return
                    }
                }
            }
        }
    }
    if (!unlockedSomething) {
        proceedAfterUnlock()
    }
}

function applyUnlockedShipChoice() {
    if (ui.getUnlockedSwitchChoice() == 1) {
        const newIdx = ships.globalIndex(gs.faction, ui.getUnlockedShip())
        player.clear()
        player.spawn(newIdx)
    }
    // Unlock came from the trench run -> go straight to the next level
    // (otherwise proceedAfterUnlock would re-start the trench run).
    if (trenchUnlockedTopShip) {
        trenchUnlockedTopShip = false
        nextLevel()
        return
    }
    proceedAfterUnlock()
}

// After unlock/upgrade: insert a minigame if applicable, otherwise next level directly.
function proceedAfterUnlock() {
    startMissionAfterLevel(gs.level)
}

function nextLevel() {
    gs.level++
    pickups.clearAll()
    audio.playFactionTheme(gs.faction)
    goToLevelIntro()
}

function gameOver() {
    gs.screen = gs.Screen.GameOver
    const isNew = gs.score > gs.highscore
    gs.saveHighscore()
    ui.setNewHighscore(isNew)
    audio.playGameOverFanfare()
    enemies.clearAll()
    pickups.clearAll()
    bosses.clear()
}

function cleanupGameSprites() {
    enemies.clearAll()
    pickups.clearAll()
    bosses.clear()
    player.clear()
    squadron.clear()
    // Defensive: empty all relevant sprite kinds completely.
    for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.Enemy)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.PlayerShot)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.Boss)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.Asteroid)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.Rescue)) s.destroy()
    for (const s of sprites.allOfKind(SpriteKind.Powerup)) s.destroy()
}

// ============= INPUT =============
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gs.screen) {
        case gs.Screen.Boot:
            goToTitle()
            break
        case gs.Screen.Title:
            // Title menu: 0=Start 1=Ship preview 2=Help 3=Settings 4=Test
            const idx = ui.getTitleMenuIndex()
            if (idx == 0) goToDifficultySelect()
            else if (idx == 1) goToShipPreview()
            else if (idx == 2) goToHelp()
            else if (idx == 3) goToSettings()
            else if (idx == 4) goToTestMenu()
            break
        case gs.Screen.Settings:
            if (ui.isResetConfirm()) {
                gs.resetProgress()
                ui.setResetConfirm(false)
                audio.sfxLevelUp()
            } else if (ui.getSettingsRow() == ui.SETTINGS_ROW_RESET) {
                ui.setResetConfirm(true)
            } else if (ui.getSettingsRow() == ui.SETTINGS_ROW_BACK) {
                goToTitle()
            }
            break
        case gs.Screen.Help:
            if (ui.isLastHelpPage()) {
                goToTitle()
            } else {
                ui.setHelpPage(ui.getHelpPage() + 1)
            }
            break
        case gs.Screen.DifficultySelect:
            gs.difficulty = ui.getDifficultyIndex() as gs.Difficulty
            gs.saveDifficulty()
            goToFactionSelect()
            break
        case gs.Screen.FactionSelect:
            goToShipSelect()
            break
        case gs.Screen.ShipSelect:
            if (gs.isUnlocked(gs.faction, ui.getShipSelectIndex())) {
                startGame()
            }
            break
        case gs.Screen.UpgradeChoice:
            applyUpgrade(ui.getUpgradeChoice())
            afterUpgrade()
            break
        case gs.Screen.ShipUnlocked:
            applyUnlockedShipChoice()
            break
        case gs.Screen.GameOver:
            goToTitle()
            break
        case gs.Screen.Paused:
            // Menu: 0 = Resume, 1 = Quit
            if (ui.getPauseMenuIndex() == 0) {
                resumeFromPause()
            } else {
                resumeFromPause()
                goToTitle()
            }
            break
        case gs.Screen.CanyonRunIntro:
            startTrenchRun()
            break
        case gs.Screen.CanyonRun:
            trench.fire()
            break
        case gs.Screen.CanyonRunResult:
            exitTrenchResult()
            break
        case gs.Screen.BladeArenaIntro:
            startArena()
            break
        case gs.Screen.BladeArena:
            arena.attack()
            break
        case gs.Screen.BladeArenaResult:
            exitArenaResult()
            break
        case gs.Screen.FpsBattleIntro:
            startFps()
            break
        case gs.Screen.FpsBattle:
            fps.fire()
            break
        case gs.Screen.FpsBattleResult:
            exitFpsResult()
            break
        case gs.Screen.SidescrollerIntro:
            startSider()
            break
        case gs.Screen.Sidescroller:
            sider.attack()
            break
        case gs.Screen.SidescrollerResult:
            exitSiderResult()
            break
        case gs.Screen.TestMenu:
            selectTestItem(ui.getTestMenuIndex())
            break
        case gs.Screen.ShipPreview:
            goToTitle()
            break
        case gs.Screen.Playing:
        case gs.Screen.BossFight:
        case gs.Screen.BossIntro:
            player.fire()
            break
    }
})

controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    if (gs.screen == gs.Screen.Playing || gs.screen == gs.Screen.BossFight || gs.screen == gs.Screen.BossIntro) {
        player.fire()
    } else if (gs.screen == gs.Screen.CanyonRun) {
        trench.fire()
    } else if (gs.screen == gs.Screen.BladeArena) {
        arena.attack()
    } else if (gs.screen == gs.Screen.FpsBattle) {
        fps.fire()
    } else if (gs.screen == gs.Screen.Sidescroller) {
        sider.attack()
    }
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    switch (gs.screen) {
        case gs.Screen.Boot:
            goToTitle()
            break
        case gs.Screen.Settings:
            if (ui.isResetConfirm()) {
                ui.setResetConfirm(false)
            } else {
                goToTitle()
            }
            break
        case gs.Screen.Help:
            goToTitle()
            break
        case gs.Screen.DifficultySelect:
            goToTitle()
            break
        case gs.Screen.Title:
            // From the title menu now: quick direct-access to Help
            goToHelp()
            break
        case gs.Screen.FactionSelect:
            goToDifficultySelect()
            break
        case gs.Screen.ShipSelect:
            goToFactionSelect()
            break
        case gs.Screen.Playing:
        case gs.Screen.BossFight:
        case gs.Screen.BossIntro:
            player.triggerSpecial()
            break
        case gs.Screen.Paused:
            resumeFromPause()
            goToTitle()
            break
        case gs.Screen.CanyonRunIntro:
            trench.stop()
            gs.screen = gs.Screen.CanyonRunResult
            break
        case gs.Screen.BladeArenaIntro:
            gs.screen = gs.Screen.BladeArenaResult
            break
        case gs.Screen.BladeArena:
            arena.jump()
            break
        case gs.Screen.FpsBattleIntro:
            gs.screen = gs.Screen.FpsBattleResult
            break
        case gs.Screen.SidescrollerIntro:
            gs.screen = gs.Screen.SidescrollerResult
            break
        case gs.Screen.Sidescroller:
            sider.jump()
            break
        case gs.Screen.TestMenu:
            goToTitle()
            break
        case gs.Screen.ShipPreview:
            goToTitle()
            break
    }
})

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gs.screen == gs.Screen.Boot) goToTitle()
    else if (gs.screen == gs.Screen.Title) ui.setTitleMenuIndex(ui.getTitleMenuIndex() - 1)
    else if (gs.screen == gs.Screen.Settings) ui.setSettingsRow(ui.getSettingsRow() - 1)
    else if (gs.screen == gs.Screen.DifficultySelect) ui.setDifficultyIndex(ui.getDifficultyIndex() - 1)
    else if (gs.screen == gs.Screen.ShipSelect) ui.setShipSelectIndex(ui.getShipSelectIndex() - 3)
    else if (gs.screen == gs.Screen.Paused) ui.setPauseMenuIndex(ui.getPauseMenuIndex() - 1)
    else if (gs.screen == gs.Screen.TestMenu) ui.setTestMenuIndex(ui.getTestMenuIndex() - 1)
    else if (gs.screen == gs.Screen.Sidescroller) sider.jump()
})

controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gs.screen == gs.Screen.Boot) goToTitle()
    else if (gs.screen == gs.Screen.Title) ui.setTitleMenuIndex(ui.getTitleMenuIndex() + 1)
    else if (gs.screen == gs.Screen.Settings) ui.setSettingsRow(ui.getSettingsRow() + 1)
    else if (gs.screen == gs.Screen.DifficultySelect) ui.setDifficultyIndex(ui.getDifficultyIndex() + 1)
    else if (gs.screen == gs.Screen.ShipSelect) ui.setShipSelectIndex(ui.getShipSelectIndex() + 3)
    else if (gs.screen == gs.Screen.Paused) ui.setPauseMenuIndex(ui.getPauseMenuIndex() + 1)
    else if (gs.screen == gs.Screen.TestMenu) ui.setTestMenuIndex(ui.getTestMenuIndex() + 1)
})

controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gs.screen == gs.Screen.Boot) goToTitle()
    else if (gs.screen == gs.Screen.Help) ui.setHelpPage(ui.getHelpPage() - 1)
    else if (gs.screen == gs.Screen.FactionSelect) ui.setFactionIndex(0)
    else if (gs.screen == gs.Screen.ShipSelect) ui.setShipSelectIndex(ui.getShipSelectIndex() - 1)
    else if (gs.screen == gs.Screen.Settings) ui.settingsAdjust(-1)
    else if (gs.screen == gs.Screen.UpgradeChoice) ui.setUpgradeChoice(0)
    else if (gs.screen == gs.Screen.ShipUnlocked) ui.setUnlockedSwitchChoice(0)
    else if (gs.screen == gs.Screen.ShipPreview) ui.setPreviewIndex(ui.getPreviewIndex() - 1)
})

controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gs.screen == gs.Screen.Boot) goToTitle()
    else if (gs.screen == gs.Screen.Help) ui.setHelpPage(ui.getHelpPage() + 1)
    else if (gs.screen == gs.Screen.FactionSelect) ui.setFactionIndex(1)
    else if (gs.screen == gs.Screen.ShipSelect) ui.setShipSelectIndex(ui.getShipSelectIndex() + 1)
    else if (gs.screen == gs.Screen.Settings) ui.settingsAdjust(+1)
    else if (gs.screen == gs.Screen.UpgradeChoice) ui.setUpgradeChoice(1)
    else if (gs.screen == gs.Screen.ShipUnlocked) ui.setUnlockedSwitchChoice(1)
    else if (gs.screen == gs.Screen.ShipPreview) ui.setPreviewIndex(ui.getPreviewIndex() + 1)
})

controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gs.screen == gs.Screen.Title) {
        goToSettings()
    } else if (gs.screen == gs.Screen.Settings) {
        goToTitle()
    } else if (gs.screen == gs.Screen.Playing
            || gs.screen == gs.Screen.BossFight
            || gs.screen == gs.Screen.BossIntro
            || gs.screen == gs.Screen.Paused) {
        // Toggle pause during gameplay
        togglePause()
    } else if (gs.screen != gs.Screen.Boot) {
        goToTitle()
    }
})

// ============= COLLISIONS =============

// Minigame modes have their own collision logic; don't override it here.
function inMinigame(): boolean {
    return gs.screen == gs.Screen.CanyonRun
        || gs.screen == gs.Screen.FpsBattle
        || gs.screen == gs.Screen.BladeArena
        || gs.screen == gs.Screen.Sidescroller
        || gs.screen == gs.Screen.CanyonRunIntro
        || gs.screen == gs.Screen.FpsBattleIntro
        || gs.screen == gs.Screen.BladeArenaIntro
        || gs.screen == gs.Screen.SidescrollerIntro
        || gs.screen == gs.Screen.CanyonRunResult
        || gs.screen == gs.Screen.FpsBattleResult
        || gs.screen == gs.Screen.BladeArenaResult
        || gs.screen == gs.Screen.SidescrollerResult
}

sprites.onOverlap(SpriteKind.PlayerShot, SpriteKind.Enemy, function (shot: Sprite, enemy: Sprite) {
    if (inMinigame()) return
    const dmg = (shot.data["dmg"] as number) || 1
    shot.destroy()
    enemies.damageEnemy(enemy, dmg)
})

sprites.onOverlap(SpriteKind.PlayerShot, SpriteKind.Boss, function (shot: Sprite, boss: Sprite) {
    if (inMinigame()) return
    const dmg = (shot.data["dmg"] as number) || 1
    shot.destroy()
    bosses.damageBoss(boss, dmg)
})

sprites.onOverlap(SpriteKind.PlayerShot, SpriteKind.Asteroid, function (shot: Sprite, ast: Sprite) {
    if (inMinigame()) return
    const dmg = (shot.data["dmg"] as number) || 1
    shot.destroy()
    pickups.damageAsteroid(ast, dmg)
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (p: Sprite, enemy: Sprite) {
    if (inMinigame()) return
    if (squadron.isWingman(p)) {
        squadron.damageWingman(p, enemies.getCollisionDamage(enemy))
        enemies.killEnemy(enemy, false)
        return
    }
    const dmg = enemies.getCollisionDamage(enemy)
    enemies.killEnemy(enemy, false)
    if (player.takeDamage(dmg)) gameOver()
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.EnemyShot, function (p: Sprite, shot: Sprite) {
    if (inMinigame()) return
    if (squadron.isWingman(p)) {
        squadron.damageWingman(p, 10)
        shot.destroy()
        return
    }
    shot.destroy()
    if (player.takeDamage(15)) gameOver()
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Asteroid, function (p: Sprite, ast: Sprite) {
    if (inMinigame()) return
    const dmg = pickups.hitByAsteroid(ast)
    if (player.takeDamage(dmg)) gameOver()
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Boss, function (p: Sprite, boss: Sprite) {
    if (inMinigame()) return
    if (player.takeDamage(50)) gameOver()
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Rescue, function (p: Sprite, r: Sprite) {
    if (inMinigame()) return
    pickups.rescuePickup(r)
})

// ============= UPDATE LOOP =============
game.onUpdate(function () {
    const now = game.runtime()
    const dt = now - lastUpdateMs
    lastUpdateMs = now

    if (gs.screen == gs.Screen.Boot) {
        ui.updateBoot(dt)
        return
    }

    // When paused, freeze the entire update loop incl. stateTimer.
    // Without this check the boss-intro timer would tick down during pause
    // and the transition to BossFight would never fire.
    if (gs.screen == gs.Screen.Paused) return

    ui.updateStars(dt)

    if (stateTimer > 0) {
        stateTimer -= dt
        if (stateTimer <= 0) {
            handleStateTimerExpired()
        }
    }

    switch (gs.screen) {
        case gs.Screen.Playing:
            player.update(dt)
            squadron.update()
            enemies.update()
            pickups.update()
            if (enemies.levelComplete()) {
                pickups.clearAll()
                goToBossIntro()
            }
            break
        case gs.Screen.BossFight:
            player.update(dt)
            squadron.update()
            bosses.update()
            break
        case gs.Screen.BossIntro:
            player.update(dt)
            squadron.update()
            break
        case gs.Screen.CanyonRun:
            trench.update(dt)
            break
        case gs.Screen.BladeArena:
            arena.update(dt)
            break
        case gs.Screen.FpsBattle:
            fps.update(dt)
            break
        case gs.Screen.Sidescroller:
            sider.update(dt)
            break
    }
})

function handleStateTimerExpired() {
    switch (gs.screen) {
        case gs.Screen.LevelIntro:
            startLevel()
            break
        case gs.Screen.BossIntro:
            startBossFight()
            break
        case gs.Screen.LevelComplete:
            goToUpgradeChoice()
            break
    }
}

// Kick off with the cool splash sequence.
goToBoot()
