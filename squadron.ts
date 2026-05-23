// Squadron Commander: 2 AI wingmen flanking the player.
// Becomes active automatically once gs.squadronUnlocked = true (all 4 minigames cleared).
// Wingmen are their own sprites (we reuse SpriteKind.Player and tag with data["isWingman"]).

namespace squadron {

    let leftWingman: Sprite = null
    let rightWingman: Sprite = null
    let lastFireMs: number = 0
    const FIRE_INTERVAL = 500
    const WINGMAN_HP = 30

    export function spawn() {
        if (!gs.squadronUnlocked) return
        if (leftWingman || rightWingman) clear()
        const playerSprite = player.getSprite()
        if (!playerSprite) return

        // Wingman sprite image: the faction's starter ship (smaller than the player ship?
        // We just use the same image, slightly offset).
        const wingmanImg = art.shipSprite(ships.firstFor(gs.faction))

        leftWingman = sprites.create(wingmanImg, SpriteKind.Player)
        leftWingman.setPosition(playerSprite.x - 22, playerSprite.y + 4)
        leftWingman.data["isWingman"] = true
        leftWingman.data["offsetX"] = -22
        leftWingman.data["hp"] = WINGMAN_HP
        leftWingman.z = 8

        rightWingman = sprites.create(wingmanImg, SpriteKind.Player)
        rightWingman.setPosition(playerSprite.x + 22, playerSprite.y + 4)
        rightWingman.data["isWingman"] = true
        rightWingman.data["offsetX"] = 22
        rightWingman.data["hp"] = WINGMAN_HP
        rightWingman.z = 8
    }

    export function clear() {
        if (leftWingman) { leftWingman.destroy(); leftWingman = null }
        if (rightWingman) { rightWingman.destroy(); rightWingman = null }
    }

    export function update() {
        if (!gs.squadronUnlocked) return
        const playerSprite = player.getSprite()
        if (!playerSprite) return

        // Wingmen follow the player with an offset.
        for (const w of [leftWingman, rightWingman]) {
            if (!w) continue
            const offsetX: number = w.data["offsetX"]
            // Smooth follow
            const targetX = playerSprite.x + offsetX
            const targetY = playerSprite.y + 4
            w.x += (targetX - w.x) * 0.2
            w.y += (targetY - w.y) * 0.2
            // Keep on screen
            if (w.x < 8) w.x = 8
            if (w.x > 152) w.x = 152
        }

        // Auto-fire when there are enemies nearby.
        const now = game.runtime()
        if (now - lastFireMs >= FIRE_INTERVAL) {
            lastFireMs = now
            fireFromWingmen()
        }
    }

    function fireFromWingmen() {
        for (const w of [leftWingman, rightWingman]) {
            if (!w) continue
            // Check whether enemies exist
            if (sprites.allOfKind(SpriteKind.Enemy).length == 0
                && sprites.allOfKind(SpriteKind.Boss).length == 0) continue
            const stats = ships.current()
            const bolt = stats.boltColor == 2 ? art.laserRed : art.laserGreen
            const p = sprites.create(bolt, SpriteKind.PlayerShot)
            p.setPosition(w.x, w.y - 10)
            p.vy = -150
            p.data["dmg"] = 1
            p.setFlag(SpriteFlag.AutoDestroy, true)
        }
    }

    // Wingman was hit
    export function damageWingman(w: Sprite, amount: number) {
        if (!w) return
        const hp = (w.data["hp"] as number) - amount
        w.data["hp"] = hp
        w.startEffect(effects.spray, 100)
        if (hp <= 0) {
            w.destroy(effects.fire, 400)
            if (w == leftWingman) leftWingman = null
            if (w == rightWingman) rightWingman = null
        }
    }

    export function isWingman(s: Sprite): boolean {
        return !!(s && s.data["isWingman"])
    }
}
