// Guardian vs Shadow Arena - 1v1 plasma blade duel.
// Player controls their faction fighter (Guardian for Alliance, Shadow for Dominion).
// Opponent is the other one with a simple AI.
// D-Pad: move left/right, A: swing, B: jump (short invul).

namespace arena {

    let playerFighter: Sprite = null
    let enemyFighter: Sprite = null
    let active: boolean = false
    let playerHp: number = 100
    let enemyHp: number = 100
    let playerJumpUntil: number = 0   // i-frames via jump
    let playerJumpStartMs: number = 0
    let enemyJumpUntil: number = 0
    let enemyJumpStartMs: number = 0
    let lastPlayerSwingMs: number = 0
    let lastEnemySwingMs: number = 0
    let elapsedMs: number = 0
    let enemyAiNextActionMs: number = 0
    let onDoneCallback: () => void = null

    const DURATION_MS = 30000
    const SWING_COOLDOWN_MS = 450      // swing faster
    const SWING_DAMAGE = 22            // player swing significantly stronger (was 12)
    const ENEMY_SWING_DAMAGE = 6       // AI swing significantly weaker (was 10)
    const JUMP_DURATION_MS = 700       // longer i-frames
    const JUMP_COOLDOWN_MS = 900       // can jump again sooner
    const JUMP_HEIGHT = 22
    const ATTACK_RANGE = 32            // larger reach for the player
    const FLOOR_Y = 100  // shared y position of fighters

    export function isActive(): boolean { return active }
    export function getPlayerHp() { return playerHp }
    export function getEnemyHp() { return enemyHp }
    export function isPlayerVictorious() { return enemyHp <= 0 && playerHp > 0 }
    export function isPlayerDefeated() { return playerHp <= 0 }
    export function remainingSeconds() {
        return Math.max(0, Math.floor((DURATION_MS - elapsedMs) / 1000))
    }

    export function start(onDone: () => void) {
        active = true
        playerHp = 100
        enemyHp = 100
        elapsedMs = 0
        playerJumpUntil = 0
        enemyJumpUntil = 0
        playerJumpStartMs = 0
        enemyJumpStartMs = 0
        lastPlayerSwingMs = 0
        lastEnemySwingMs = 0
        enemyAiNextActionMs = game.runtime() + 1500
        onDoneCallback = onDone

        // Player is always the "good" fighter of the faction (Guardian for Alliance, Shadow for Dominion).
        const isAlliance = gs.faction == gs.Faction.Alliance
        playerFighter = sprites.create(isAlliance ? art.guardianIdle() : art.shadowIdle(), SpriteKind.Player)
        playerFighter.setPosition(40, FLOOR_Y)
        controller.moveSprite(playerFighter, 80, 0)  // horizontal only
        playerFighter.setStayInScreen(true)
        playerFighter.z = 20

        enemyFighter = sprites.create(isAlliance ? art.shadowIdle() : art.guardianIdle(), SpriteKind.Enemy)
        enemyFighter.setPosition(120, FLOOR_Y)
        enemyFighter.z = 20
    }

    export function stop() {
        active = false
        if (playerFighter) { playerFighter.destroy(); playerFighter = null }
        if (enemyFighter) { enemyFighter.destroy(); enemyFighter = null }
        // Cleanup
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
    }

    // Player actions
    export function attack() {
        if (!active || !playerFighter) return
        const now = game.runtime()
        if (now - lastPlayerSwingMs < SWING_COOLDOWN_MS) return
        lastPlayerSwingMs = now
        // Briefly switch sprite to "swing"
        const isAlliance = gs.faction == gs.Faction.Alliance
        playerFighter.setImage(isAlliance ? art.guardianSwing() : art.shadowSwing())
        control.runInParallel(function () {
            pause(200)
            if (playerFighter) playerFighter.setImage(isAlliance ? art.guardianIdle() : art.shadowIdle())
        })
        // Range check
        if (enemyFighter) {
            const dist = Math.abs(playerFighter.x - enemyFighter.x)
            if (dist <= ATTACK_RANGE) {
                applyDamageToEnemy(SWING_DAMAGE)
            }
        }
        audio.sfxLaserPlayer()
    }

    // Jump: short upward hop, invulnerable while airborne.
    export function jump() {
        if (!active || !playerFighter) return
        const now = game.runtime()
        if (now < playerJumpUntil) return
        if (now - playerJumpUntil < JUMP_COOLDOWN_MS - JUMP_DURATION_MS) return
        playerJumpUntil = now + JUMP_DURATION_MS
        playerJumpStartMs = now
        playerFighter.startEffect(effects.warmRadial, 200)
        audio.sfxPowerup()
    }

    function applyDamageToEnemy(amount: number) {
        const now = game.runtime()
        // Enemy mid-jump = invul.
        if (now < enemyJumpUntil) {
            if (enemyFighter) enemyFighter.startEffect(effects.warmRadial, 150)
            return
        }
        enemyHp -= amount
        if (enemyFighter) {
            enemyFighter.startEffect(effects.spray, 200)
            scene.cameraShake(2, 100)
        }
    }

    function applyDamageToPlayer(amount: number) {
        const now = game.runtime()
        // Player mid-jump = invul.
        if (now < playerJumpUntil) {
            if (playerFighter) playerFighter.startEffect(effects.warmRadial, 150)
            return
        }
        playerHp -= amount
        if (playerFighter) {
            playerFighter.startEffect(effects.fire, 200)
            scene.cameraShake(3, 150)
        }
        audio.sfxHitArmor()
    }

    export function update(dtMs: number) {
        if (!active) return
        elapsedMs += dtMs
        if (!enemyFighter || !playerFighter) return

        const now = game.runtime()

        // Jump animations: parabolic hop
        if (now < playerJumpUntil) {
            const t = (now - playerJumpStartMs) / JUMP_DURATION_MS
            const hopY = -Math.sin(t * Math.PI) * JUMP_HEIGHT
            playerFighter.y = FLOOR_Y + hopY
        } else if (playerFighter.y != FLOOR_Y) {
            playerFighter.y = FLOOR_Y
        }
        if (now < enemyJumpUntil) {
            const t = (now - enemyJumpStartMs) / JUMP_DURATION_MS
            const hopY = -Math.sin(t * Math.PI) * JUMP_HEIGHT
            enemyFighter.y = FLOOR_Y + hopY
        } else if (enemyFighter.y != FLOOR_Y) {
            enemyFighter.y = FLOOR_Y
        }

        // AI: move toward the player
        const dxToPlayer = playerFighter.x - enemyFighter.x
        const distToPlayer = Math.abs(dxToPlayer)
        if (distToPlayer > ATTACK_RANGE - 4) {
            enemyFighter.vx = dxToPlayer > 0 ? 50 : -50
        } else {
            enemyFighter.vx = 0
        }
        if (distToPlayer < 12) {
            enemyFighter.vx = -enemyFighter.vx
        }

        // AI: action (swing or jump)
        if (now >= enemyAiNextActionMs && distToPlayer <= ATTACK_RANGE) {
            // 40% chance to jump-dodge if the player just swung
            const playerJustSwung = now - lastPlayerSwingMs < 300
            if (playerJustSwung && Math.percentChance(40) && now >= enemyJumpUntil + JUMP_COOLDOWN_MS) {
                enemyJumpUntil = now + JUMP_DURATION_MS
                enemyJumpStartMs = now
                enemyFighter.startEffect(effects.warmRadial, 200)
                enemyAiNextActionMs = now + JUMP_DURATION_MS + 200
            } else if (now - lastEnemySwingMs >= SWING_COOLDOWN_MS) {
                lastEnemySwingMs = now
                const isAlliance = gs.faction == gs.Faction.Alliance
                enemyFighter.setImage(isAlliance ? art.shadowSwing() : art.guardianSwing())
                control.runInParallel(function () {
                    pause(200)
                    if (enemyFighter) enemyFighter.setImage(isAlliance ? art.shadowIdle() : art.guardianIdle())
                })
                applyDamageToPlayer(ENEMY_SWING_DAMAGE)
                audio.sfxLaserEnemy()
                // Longer pause between AI swings to give the player room to breathe
                enemyAiNextActionMs = now + SWING_COOLDOWN_MS + randint(700, 1400)
            }
        }

        // Don't let them walk into each other
        if (distToPlayer < 14 && now - lastPlayerSwingMs > 200) {
            playerFighter.x -= dxToPlayer > 0 ? 1 : -1
        }

        if (enemyHp <= 0 || playerHp <= 0 || elapsedMs >= DURATION_MS) {
            finish()
        }
    }

    function finish() {
        if (!active) return
        active = false
        const wasVictorious = enemyHp <= 0 && playerHp > 0
        if (playerFighter) { playerFighter.destroy(); playerFighter = null }
        if (enemyFighter) { enemyFighter.destroy(); enemyFighter = null }
        for (const s of sprites.allOfKind(SpriteKind.Player)) s.destroy()
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        if (wasVictorious) {
            gs.addScore(3000)
        }
        const cb = onDoneCallback
        onDoneCallback = null
        if (cb) cb()
    }

    // ====== Rendering ======

    // The planet surface is drawn by a separate renderable at z=-40 (see ui.install).
    // Here we just draw the HUD and foreground.
    export function draw() {
        if (!active) return
        // HP bars on top
        drawHpBar(4, 4, playerHp, 5, gs.faction == gs.Faction.Alliance ? 8 : 2)
        drawHpBar(80, 4, enemyHp, 5, gs.faction == gs.Faction.Alliance ? 2 : 8)

        // Labels
        screen.print(gs.faction == gs.Faction.Alliance ? i18n.t("GUARDIAN") : i18n.t("SHADOW"), 4, 12, 5, image.font5)
        screen.print(gs.faction == gs.Faction.Alliance ? i18n.t("SHADOW") : i18n.t("GUARDIAN"), 80, 12, 5, image.font5)

        // Timer
        const ts = remainingSeconds()
        screen.print("" + ts + i18n.t("s"), 70, 4, 5, image.font5)

        // Bottom hint
        screen.print(i18n.t("A=Swing B=Jump"), 22, 116, 13, image.font5)
    }

    // Called by ui.install at z=-40 to draw the planet surface.
    export function drawBackground() {
        if (!active) return
        // Dark sky on top, brown ground at the bottom
        screen.fillRect(0, 0, 160, 78, 12)
        screen.fillRect(0, 78, 160, 42, 14)
        // Horizon line
        screen.fillRect(0, 78, 160, 1, 4)
        // Mountains / rocks
        for (let i = 0; i < 4; i++) {
            const mx = i * 38 + 6
            screen.fillRect(mx, 70, 14, 8, 15)
            screen.fillRect(mx + 2, 68, 10, 2, 15)
        }
        // Ground lines for depth
        screen.fillRect(0, 90, 160, 1, 13)
        screen.fillRect(0, 102, 160, 1, 13)
        screen.fillRect(0, 114, 160, 1, 4)
        // Sparse stars on the horizon (tiny sky)
        for (let i = 0; i < 8; i++) {
            const sx = (i * 23 + 5) % 160
            const sy = (i % 3) * 8 + 6
            screen.setPixel(sx, sy, 1)
        }
    }

    function drawHpBar(x: number, y: number, hp: number, h: number, col: number) {
        const w = 60
        screen.fillRect(x - 1, y - 1, w + 2, h + 2, 15)
        screen.fillRect(x, y, w, h, 13)
        const fill = Math.max(0, Math.idiv(w * hp, 100))
        if (fill > 0) screen.fillRect(x, y, fill, h, col)
    }
}
