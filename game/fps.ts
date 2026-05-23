// FPS minigame: shoot Dominion troopers (Alliance player) or
// Alliance troopers (Dominion player) in a corridor.
// 6 fixed spawn positions; D-Pad moves the reticle, A shoots.

namespace fps {

    let reticle: Sprite = null
    let active: boolean = false
    let elapsedMs: number = 0
    let lastSpawnAt: number = 0
    let kills: number = 0
    let playerHp: number = 100
    let onDoneCallback: () => void = null

    const DURATION_MS = 40000
    const KILLS_REQUIRED = 6         // only 6 (was 8)
    const ENEMY_LIFETIME_MS = 5000   // 5s visibility (was 3.2)
    const ENEMY_FIRE_WINDOW_MS = 4000 // 4s until they fire (was 2.4)
    const ENEMY_BOLT_DAMAGE = 4      // very low damage (was 7)
    const ENEMY_BOLT_SPEED = 55      // slower (was 90)
    const HIT_RADIUS_SQ = 400        // huge hitbox (was 200, radius 14 -> 20)

    // 6 spawn positions (3 top, 3 bottom)
    const POSITIONS = [
        { x: 24, y: 36 }, { x: 80, y: 30 }, { x: 136, y: 36 },
        { x: 24, y: 70 }, { x: 80, y: 76 }, { x: 136, y: 70 }
    ]

    export function isActive() { return active }
    export function getKills() { return kills }
    export function getPlayerHp() { return playerHp }
    export function isSuccess() { return kills >= KILLS_REQUIRED }
    export function remainingSeconds() {
        return Math.max(0, Math.floor((DURATION_MS - elapsedMs) / 1000))
    }

    export function start(onDone: () => void) {
        active = true
        elapsedMs = 0
        lastSpawnAt = 0
        kills = 0
        playerHp = 100
        onDoneCallback = onDone

        reticle = sprites.create(art.reticle, SpriteKind.Player)
        reticle.setPosition(80, 55)
        controller.moveSprite(reticle, 140, 110)  // faster
        reticle.setStayInScreen(true)
        reticle.z = 110   // above foreground (z=100) so the reticle stays visible
    }

    export function stop() {
        active = false
        reticle = null
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
    }

    function spawnEnemy() {
        const pos = POSITIONS[randint(0, POSITIONS.length - 1)]
        // Make sure no enemy is already at this position
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            if (e.x == pos.x && e.y == pos.y) return  // skip - already taken
        }
        const isAlliance = gs.faction == gs.Faction.Alliance
        const img = isAlliance ? art.dominionTrooper() : art.allianceTrooper()
        const e = sprites.create(img, SpriteKind.Enemy)
        e.setPosition(pos.x, pos.y)
        e.data["spawnedAt"] = game.runtime()
        e.data["fired"] = false
        e.z = 40
        // Short spawn effect
        e.startEffect(effects.spray, 200)
    }

    export function fire() {
        if (!active || !reticle) return
        audio.sfxLaserPlayer()
        // Find the nearest enemy under the reticle (generous hitbox).
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            const dx = e.x - reticle.x
            const dy = e.y - reticle.y
            if (dx * dx + dy * dy <= HIT_RADIUS_SQ) {
                kills++
                gs.addScore(150)
                e.destroy(effects.fire, 300)
                return
            }
        }
    }

    export function update(dtMs: number) {
        if (!active) return
        elapsedMs += dtMs
        const now = game.runtime()

        // Spawn rate: slower, max 2 concurrent (was 3) - no overflow
        if (sprites.allOfKind(SpriteKind.Enemy).length < 2 && now - lastSpawnAt >= 1500) {
            lastSpawnAt = now
            spawnEnemy()
        }

        // Enemy logic: fire when their timer expires, disappear at end of lifetime
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            const age = now - e.data["spawnedAt"]
            const fired: boolean = !!e.data["fired"]
            if (!fired && age >= ENEMY_FIRE_WINDOW_MS) {
                e.data["fired"] = true
                fireEnemyBolt(e)
            }
            if (age >= ENEMY_LIFETIME_MS) {
                e.destroy(effects.spray, 200)
            }
        }

        // Enemy shots move toward the reticle and hit when they arrive.
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) {
            // Track reticle position (slow)
            const tx: number = s.data["targetX"]
            const ty: number = s.data["targetY"]
            const dx = tx - s.x
            const dy = ty - s.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 8) {
                if (reticle && Math.abs(reticle.x - tx) < 14 && Math.abs(reticle.y - ty) < 14) {
                    playerHp -= ENEMY_BOLT_DAMAGE
                    scene.cameraShake(3, 200)
                    audio.sfxHitArmor()
                }
                s.destroy(effects.spray, 100)
            }
        }

        // End condition
        if (playerHp <= 0 || elapsedMs >= DURATION_MS || kills >= KILLS_REQUIRED) {
            finish()
        }
    }

    function fireEnemyBolt(e: Sprite) {
        if (!reticle) return
        const bolt = (gs.faction == gs.Faction.Alliance) ? art.laserGreen : art.laserRed
        const s = sprites.create(bolt, SpriteKind.EnemyShot)
        s.setPosition(e.x, e.y + 4)
        s.data["targetX"] = reticle.x
        s.data["targetY"] = reticle.y
        const dx = reticle.x - e.x
        const dy = reticle.y - e.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        s.vx = (dx / dist) * ENEMY_BOLT_SPEED
        s.vy = (dy / dist) * ENEMY_BOLT_SPEED
        audio.sfxLaserEnemy()
    }

    function finish() {
        if (!active) return
        active = false
        reticle = null
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
        if (isSuccess()) gs.addScore(3000)
        const cb = onDoneCallback
        onDoneCallback = null
        if (cb) cb()
    }

    // ====== Rendering ======

    // Background layer (z=-40) -> drawn under sprites so the reticle stays visible.
    export function drawBackground() {
        if (!active) return
        screen.fill(15)
        const vpX = 80, vpY = 0
        const wallColor = 11
        const floorColor = 12
        for (let i = 0; i < 6; i++) {
            screen.drawLine(0 + i * 8, 100 - i * 15, vpX, vpY, wallColor)
            screen.drawLine(159 - i * 8, 100 - i * 15, vpX, vpY, wallColor)
        }
        for (let i = 1; i < 5; i++) {
            const t = i / 5
            const y = (100 * (1 - t)) | 0
            screen.fillRect(40 + i * 8, y, 80 - i * 16, 1, floorColor)
        }
    }

    // Foreground (z=100): blaster overlay + HUD above sprites.
    export function draw() {
        if (!active) return
        // Blaster overlay at the bottom-center
        screen.drawTransparentImage(art.blasterOverlay(), 50, 90)
        // HUD
        drawHud()
    }

    function drawHud() {
        // HP bar top-left
        const w = 50, h = 5
        screen.fillRect(2, 2, w + 2, h + 2, 15)
        screen.fillRect(3, 3, w, h, 13)
        const fill = Math.max(0, Math.idiv(w * playerHp, 100))
        if (fill > 0) screen.fillRect(3, 3, fill, h, 2)
        screen.print(i18n.t("HP"), w + 8, 3, 5, image.font5)
        // Kills + time top-right
        screen.print(i18n.t("KILLS") + " " + kills + "/" + KILLS_REQUIRED, 90, 2, 1, image.font5)
        screen.print(i18n.t("TIME") + " " + remainingSeconds() + i18n.t("s"), 100, 10, 5, image.font5)
        // Persistent control hint (during the first 8 seconds)
        if (elapsedMs < 8000) {
            if (Math.idiv(elapsedMs, 250) % 2 == 0) {
                screen.print(i18n.t("D-Pad aim, A shoot"), 4, 110, 5, image.font5)
            } else {
                screen.print(i18n.t("D-Pad aim, A shoot"), 4, 110, 7, image.font5)
            }
        }
    }
}
