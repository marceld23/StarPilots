// Sidescroller minigame: Guardian/Shadow against a wave of troops.
// Player on the left at floor height. Dominion / Alliance troopers come in from the right.
// D-Pad left/right: move, D-Pad up or B: jump, A: plasma blade swing.

namespace sider {

    let playerFighter: Sprite = null
    let active: boolean = false
    let elapsedMs: number = 0
    let lastSpawnAt: number = 0
    let kills: number = 0
    let playerHp: number = 100
    let lastSwingMs: number = 0
    let jumpUntil: number = 0
    let jumpStartMs: number = 0
    let onDoneCallback: () => void = null

    const DURATION_MS = 40000
    const KILLS_REQUIRED = 10
    const SWING_COOLDOWN_MS = 400
    const SWING_DAMAGE = 25        // 2-swing kills (enemy HP 45)
    const SWING_RANGE = 28
    const JUMP_DURATION_MS = 600
    const JUMP_COOLDOWN_MS = 1000
    const JUMP_HEIGHT = 22
    const FLOOR_Y = 90
    const ENEMY_SPEED = 28
    const ENEMY_DAMAGE = 10
    const CONTACT_DAMAGE_CD_MS = 800
    const BOLT_DAMAGE = 7
    const PLAYER_LEFT_EDGE = 8
    const PLAYER_RIGHT_EDGE = 100

    export function isActive() { return active }
    export function getKills() { return kills }
    export function getPlayerHp() { return playerHp }
    export function isSuccess() { return kills >= KILLS_REQUIRED && playerHp > 0 }
    export function remainingSeconds() {
        return Math.max(0, Math.floor((DURATION_MS - elapsedMs) / 1000))
    }

    export function start(onDone: () => void) {
        active = true
        elapsedMs = 0
        lastSpawnAt = 0
        kills = 0
        playerHp = 100
        lastSwingMs = 0
        jumpUntil = 0
        jumpStartMs = 0
        onDoneCallback = onDone

        // Player: Guardian for Alliance, Shadow for Dominion
        const isAlliance = gs.faction == gs.Faction.Alliance
        playerFighter = sprites.create(isAlliance ? art.guardianIdle() : art.shadowIdle(), SpriteKind.Player)
        playerFighter.setPosition(20, FLOOR_Y)
        controller.moveSprite(playerFighter, 70, 0)  // horizontal only
        playerFighter.setStayInScreen(true)
        playerFighter.z = 30
    }

    export function stop() {
        active = false
        if (playerFighter) { playerFighter.destroy(); playerFighter = null }
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
    }

    export function attack() {
        if (!active || !playerFighter) return
        const now = game.runtime()
        if (now - lastSwingMs < SWING_COOLDOWN_MS) return
        lastSwingMs = now
        const isAlliance = gs.faction == gs.Faction.Alliance
        playerFighter.setImage(isAlliance ? art.guardianSwing() : art.shadowSwing())
        control.runInParallel(function () {
            pause(200)
            if (playerFighter) playerFighter.setImage(isAlliance ? art.guardianIdle() : art.shadowIdle())
        })
        // Hit the nearest enemy in range
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            if (e.x - playerFighter.x > 0 && e.x - playerFighter.x <= SWING_RANGE
                && Math.abs(e.y - playerFighter.y) <= 20) {
                const hp: number = e.data["hp"] - SWING_DAMAGE
                e.data["hp"] = hp
                e.startEffect(effects.spray, 150)
                if (hp <= 0) {
                    kills++
                    gs.addScore(150)
                    e.destroy(effects.fire, 250)
                }
                break  // only one enemy per swing
            }
        }
        audio.sfxLaserPlayer()
    }

    export function jump() {
        if (!active || !playerFighter) return
        const now = game.runtime()
        if (now < jumpUntil) return
        if (now - jumpUntil < JUMP_COOLDOWN_MS - JUMP_DURATION_MS) return
        jumpUntil = now + JUMP_DURATION_MS
        jumpStartMs = now
        audio.sfxPowerup()
    }

    function spawnEnemy() {
        const isAlliance = gs.faction == gs.Faction.Alliance
        const img = isAlliance ? art.dominionTrooper() : art.allianceTrooper()
        const e = sprites.create(img, SpriteKind.Enemy)
        e.setPosition(160, FLOOR_Y)
        e.vx = -ENEMY_SPEED
        e.data["hp"] = 45             // 2-swing kills
        e.data["nextFire"] = game.runtime() + Math.randomRange(1500, 3000)
        e.data["nextContact"] = 0
        e.z = 20
    }

    export function update(dtMs: number) {
        if (!active || !playerFighter) return
        elapsedMs += dtMs
        const now = game.runtime()

        // Jump animation (parabola)
        if (now < jumpUntil) {
            const t = (now - jumpStartMs) / JUMP_DURATION_MS
            playerFighter.y = FLOOR_Y - Math.sin(t * Math.PI) * JUMP_HEIGHT
        } else if (playerFighter.y != FLOOR_Y) {
            playerFighter.y = FLOOR_Y
        }

        // Spawn logic: max 3 enemies at once, calmer pacing
        if (sprites.allOfKind(SpriteKind.Enemy).length < 3 && now - lastSpawnAt >= 1600) {
            lastSpawnAt = now
            spawnEnemy()
        }

        // Enemy logic: move left, fire when close
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            const dx = playerFighter.x - e.x
            const inContact = Math.abs(dx) < 14 && Math.abs(playerFighter.y - e.y) < 16
            // Contact damage ONLY when:
            // - in range
            // - player is not mid-jump (i-frames)
            // - cooldown expired (prevents 30 dmg/second)
            if (inContact && now >= jumpUntil && now >= e.data["nextContact"]) {
                playerHp -= ENEMY_DAMAGE
                e.data["nextContact"] = now + CONTACT_DAMAGE_CD_MS
                e.startEffect(effects.fire, 200)
                audio.sfxHitArmor()
                scene.cameraShake(3, 200)
                // Enemy gets knocked back hard
                e.x += 25
            }
            // Fire at the player
            if (now >= e.data["nextFire"] && e.x > playerFighter.x + 20 && e.x < 180) {
                e.data["nextFire"] = now + Math.randomRange(2500, 5000)
                const bolt = (gs.faction == gs.Faction.Alliance) ? art.laserGreen : art.laserRed
                const p = sprites.create(bolt, SpriteKind.EnemyShot)
                p.setPosition(e.x - 6, e.y - 4)
                p.vx = -90
                p.setFlag(SpriteFlag.AutoDestroy, true)
            }
            // Remove if off-screen
            if (e.x < -10) e.destroy()
        }

        // EnemyShot hits player
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) {
            if (Math.abs(s.x - playerFighter.x) < 8 && Math.abs(s.y - playerFighter.y) < 18) {
                if (now >= jumpUntil) {
                    playerHp -= BOLT_DAMAGE
                    audio.sfxHitArmor()
                    scene.cameraShake(2, 150)
                }
                s.destroy(effects.spray, 100)
            }
        }

        if (playerHp <= 0 || elapsedMs >= DURATION_MS || kills >= KILLS_REQUIRED) {
            finish()
        }
    }

    function finish() {
        if (!active) return
        active = false
        if (playerFighter) { playerFighter.destroy(); playerFighter = null }
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
        if (isSuccess()) gs.addScore(3000)
        const cb = onDoneCallback
        onDoneCallback = null
        if (cb) cb()
    }

    // ====== Rendering ======

    export function drawBackground() {
        if (!active) return
        // desert-style desert or hangar corridor.
        // Sky/wall on top
        screen.fillRect(0, 0, 160, FLOOR_Y + 12, 4)  // orange sky
        screen.fillRect(0, FLOOR_Y + 12, 160, 120 - FLOOR_Y - 12, 13)  // sandy ground
        // Horizon line + dunes
        for (let i = 0; i < 3; i++) {
            const dx = i * 60
            screen.fillRect(dx, FLOOR_Y + 6, 30, 6, 14)
            screen.fillRect(dx + 6, FLOOR_Y + 4, 20, 2, 14)
        }
        screen.fillRect(0, FLOOR_Y + 12, 160, 1, 12)
        // Background sun / circle
        screen.fillRect(120, 16, 12, 12, 5)
    }

    export function draw() {
        if (!active) return
        // HUD
        // HP bar
        const w = 50, h = 5
        screen.fillRect(2, 2, w + 2, h + 2, 15)
        screen.fillRect(3, 3, w, h, 13)
        const fill = Math.max(0, Math.idiv(w * playerHp, 100))
        if (fill > 0) screen.fillRect(3, 3, fill, h, 2)
        screen.print(i18n.t("HP"), w + 8, 3, 5, image.font5)
        // Kills + time
        screen.print(i18n.t("KILLS") + " " + kills + "/" + KILLS_REQUIRED, 90, 2, 1, image.font5)
        screen.print(i18n.t("TIME") + " " + remainingSeconds() + i18n.t("s"), 100, 10, 5, image.font5)
        // Control hint
        if (elapsedMs < 4000) {
            screen.print(i18n.t("Arrows=Move B=Jump A=Hit"), 0, 110, 7, image.font5)
        }
    }
}
