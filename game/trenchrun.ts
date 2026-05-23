// Trench run minigame (Canyon-run cockpit shooter).
// Alliance: Citadel canyon - turrets + Sabre-I + end target "reactor vent"
// Dominion: Alliance canyon pursuit - Falcon-A + Scout-R + end target "command ship"

namespace trench {

    interface TrenchTarget {
        s: Sprite
        kind: number      // 0 = Sabre/Falcon, 1 = Turret, 2 = End target
        scale: number     // Scale (1 = small, 3 = near)
    }

    let reticle: Sprite = null
    let active: boolean = false
    let elapsedMs: number = 0
    let lastSpawnAt: number = 0
    let targetsDestroyed: number = 0
    let targetsMissed: number = 0
    let trenchHealth: number = 100
    let scrollOffset: number = 0
    let endTargetSpawned: boolean = false
    let endTargetHit: boolean = false
    let onDoneCallback: () => void = null

    const DURATION_MS = 60000
    const TARGETS_REQUIRED = 3         // only 3 - very relaxed
    const END_TARGET_PHASE_MS = 15000  // 15s window for the end target
    const HIT_BONUS = 22               // huge hitbox (was 14)
    const RETICLE_SPEED = 160          // very fast

    export function isActive(): boolean { return active }
    export function getTargetsDestroyed() { return targetsDestroyed }
    export function getTrenchHealth() { return trenchHealth }
    export function isEndTargetHit() { return endTargetHit }
    export function isSuccess() {
        // Success: enough targets + end target hit
        return targetsDestroyed >= TARGETS_REQUIRED && endTargetHit
    }
    export function elapsedSeconds() { return Math.floor(elapsedMs / 1000) }
    export function remainingSeconds() { return Math.max(0, Math.floor((DURATION_MS - elapsedMs) / 1000)) }

    export function start(onDone: () => void) {
        active = true
        elapsedMs = 0
        lastSpawnAt = 0
        targetsDestroyed = 0
        targetsMissed = 0
        trenchHealth = 100
        scrollOffset = 0
        endTargetSpawned = false
        endTargetHit = false
        onDoneCallback = onDone

        // Create reticle controlled by the player
        reticle = sprites.create(art.reticle, SpriteKind.Player)
        reticle.setPosition(80, 60)
        controller.moveSprite(reticle, RETICLE_SPEED, RETICLE_SPEED)
        reticle.setStayInScreen(true)
        reticle.z = 110   // above cockpit frame (z=100) so the reticle stays visible
    }

    export function stop() {
        active = false
        reticle = null
        // Full cleanup of all sprite kinds that may appear during the trench run.
        // Important: destroy all Player sprites so the reticle is guaranteed gone.
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
        for (const s of sprites.allOfKind(SpriteKind.PlayerShot)) s.destroy()
    }

    export function update(dtMs: number) {
        if (!active) return
        elapsedMs += dtMs
        scrollOffset += dtMs * 0.15

        // Spawn logic
        const phase1Done = elapsedMs >= DURATION_MS - END_TARGET_PHASE_MS
        if (!phase1Done) {
            // Spawn standard targets - one at a time, slower
            const spawnInterval = 2500
            if (elapsedMs - lastSpawnAt >= spawnInterval
                && sprites.allOfKind(SpriteKind.Enemy).length < 2) {
                lastSpawnAt = elapsedMs
                spawnRandomTarget()
            }
        } else {
            // End-target phase
            if (!endTargetSpawned) {
                endTargetSpawned = true
                spawnEndTarget()
            }
        }

        // Targets move, grow, past the player = missed
        for (const t of sprites.allOfKind(SpriteKind.Enemy)) {
            const lifeMs: number = t.data["lifeMs"] || 0
            t.data["lifeMs"] = lifeMs + dtMs
            // Move away from center (80, 30) toward the player below
            const ang: number = t.data["angle"]
            const speed: number = t.data["speed"]
            t.x += Math.cos(ang) * speed * dtMs / 1000
            t.y += Math.sin(ang) * speed * dtMs / 1000
            // Off-screen below = missed
            if (t.y > 110 || t.x < -10 || t.x > 170) {
                if (!t.data["isEnd"]) targetsMissed++
                t.destroy()
            }
        }

        // Time up?
        if (elapsedMs >= DURATION_MS) {
            finish()
        }
    }

    function spawnRandomTarget() {
        const isAlliance = gs.faction == gs.Faction.Alliance
        // 60% mobile ships, 40% static turrets (Alliance side only)
        const isTurret = isAlliance && Math.percentChance(40)
        if (isTurret) {
            spawnTurret()
        } else {
            spawnShip(isAlliance)
        }
    }

    function spawnTurret() {
        const t = sprites.create(art.canyonTurret, SpriteKind.Enemy)
        // Appears at the trench start (small, centered above)
        const sideLeft = Math.percentChance(50)
        t.setPosition(sideLeft ? 30 : 130, 22)
        t.data["kind"] = 1
        t.data["isEnd"] = false
        // Slow diagonal "forward" motion
        const targetX = sideLeft ? 5 : 155
        const dx = targetX - t.x
        const dy = 90 - t.y
        const ang = Math.atan2(dy, dx)
        t.data["angle"] = ang
        t.data["speed"] = 15       // very slow
        t.data["hp"] = 1
        t.z = 20
    }

    function spawnShip(isAlliance: boolean) {
        // Dominion player faces Falcon-A/Scout-R; Alliance player faces Sabre-I.
        const img = isAlliance
            ? (Math.percentChance(50) ? art.enemySabreI : art.razorIPlayer)
            : (Math.percentChance(50) ? art.enemyFalconA : art.enemyScoutR)
        const t = sprites.create(img, SpriteKind.Enemy)
        // Appears centered at the top, flies toward the player below
        const startX = randint(60, 100)
        t.setPosition(startX, 16)
        t.data["kind"] = 0
        t.data["isEnd"] = false
        const targetX = randint(20, 140)
        const dx = targetX - t.x
        const dy = 110 - t.y
        const ang = Math.atan2(dy, dx)
        t.data["angle"] = ang
        t.data["speed"] = 22       // very slow (was 38)
        t.data["hp"] = 1
        t.z = 20
    }

    function spawnEndTarget() {
        const isAlliance = gs.faction == gs.Faction.Alliance
        const img = isAlliance ? art.reactorVent : art.bossComet()
        const t = sprites.create(img, SpriteKind.Enemy)
        t.setPosition(80, 25)
        t.data["kind"] = 2
        t.data["isEnd"] = true
        t.data["angle"] = Math.PI / 2  // straight down
        t.data["speed"] = 8            // very slow, almost still
        t.data["hp"] = 1               // 1-shot
        t.z = 25
    }

    // Called from player.fire() while in trench-run mode
    export function fire() {
        if (!active || !reticle) return
        audio.sfxLaserPlayer()
        // Insta-hit with a generous hitbox bonus
        const rx = reticle.x
        const ry = reticle.y
        for (const t of sprites.allOfKind(SpriteKind.Enemy)) {
            const dx = t.x - rx
            const dy = t.y - ry
            const r = t.image.width / 2 + 8  // was +4 - bigger hitbox
            if (dx * dx + dy * dy <= r * r) {
                const hp: number = t.data["hp"] - 1
                t.data["hp"] = hp
                t.startEffect(effects.spray, 100)
                if (hp <= 0) {
                    const isEnd: boolean = t.data["isEnd"]
                    if (isEnd) {
                        endTargetHit = true
                        gs.addScore(2500)
                        scene.cameraShake(8, 800)
                    } else {
                        targetsDestroyed++
                        gs.addScore(100)
                    }
                    audio.sfxExplosionSmall()
                    t.destroy(effects.fire, 250)
                }
                return  // only one hit per shot
            }
        }
    }

    function finish() {
        if (!active) return
        active = false
        reticle = null
        // Sweep all trench sprites (reticle + targets + any shots)
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
        for (const s of sprites.allOfKind(SpriteKind.PlayerShot)) s.destroy()
        if (isSuccess()) {
            gs.addScore(5000)
        }
        const cb = onDoneCallback
        onDoneCallback = null
        if (cb) cb()
    }

    // ====== Rendering ======

    export function draw() {
        if (!active) return
        // Trench walls (parallax)
        drawWalls()
        // Cockpit frame on top
        screen.drawTransparentImage(art.cockpitFrame(), 0, 0)
        // HUD in the lower cockpit bar
        drawHud()
    }

    function drawWalls() {
        const wallColor1 = 11
        const wallColor2 = 12
        const off = scrollOffset | 0
        // Horizontal stripes on the sides (scroll downward)
        for (let y = 14; y < 100; y += 4) {
            const offsetY = (y + off) % 100
            // Left wall stripes (between strut and play area)
            const t = (y - 14) / 86
            const xLeft = Math.floor(20 * (1 - t * 0.6))
            screen.fillRect(xLeft + 1, offsetY + 14, 4, 1, wallColor2)
            // Right wall stripes
            const xRight = 160 - Math.floor(20 * (1 - t * 0.6))
            screen.fillRect(xRight - 5, offsetY + 14, 4, 1, wallColor2)
        }
        // Floor lines receding into the distance
        for (let y = 30; y < 95; y += 6) {
            const offsetY = (y + (off * 2)) % 95
            if (offsetY < 30) continue
            screen.fillRect(40, offsetY, 80, 1, wallColor1)
        }
    }

    function drawHud() {
        // Time bottom-left
        const timeStr = i18n.t("TIME") + " " + remainingSeconds() + i18n.t("s")
        screen.print(timeStr, 4, 102, 5, image.font5)
        // Targets bottom-center
        const targetStr = i18n.t("TARGETS") + " " + targetsDestroyed + "/" + TARGETS_REQUIRED
        screen.print(targetStr, 50, 102, 1, image.font5)
        // End-target indicator
        if (endTargetSpawned && !endTargetHit) {
            if (Math.idiv(game.runtime(), 200) % 2 == 0) {
                screen.print(i18n.t("END TARGET!"), 110, 102, 2, image.font5)
            }
        }
        if (endTargetHit) {
            screen.print(i18n.t("HIT!"), 110, 102, 5, image.font5)
        }
        // Control hint during the first 5 seconds
        if (elapsedMs < 5000) {
            screen.print(i18n.t("D-Pad aim, A shoot"), 4, 111, 7, image.font5)
        }
    }
}
