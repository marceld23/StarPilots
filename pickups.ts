// Asteroids and rescue pickups (Guardian/Shadow).
// Asteroids are obstacles that deal damage on collision.
// Asteroids with a Guardian (Alliance player) or Shadow (Dominion player) give bonus score and a bomb.

namespace pickups {

    let lastSpawnAt: number = 0
    let nextSpawnInterval: number = 4000

    export function startLevel() {
        lastSpawnAt = game.runtime()
        nextSpawnInterval = randint(3500, 5500)
    }

    export function clearAll() {
        for (const a of sprites.allOfKind(SpriteKind.Asteroid)) a.destroy()
        for (const r of sprites.allOfKind(SpriteKind.Rescue)) r.destroy()
    }

    export function update() {
        const now = game.runtime()
        if (now - lastSpawnAt >= nextSpawnInterval) {
            lastSpawnAt = now
            nextSpawnInterval = randint(3500, 5500)
            // 25% chance for a rescue asteroid (rare so it stays special)
            if (Math.percentChance(25)) {
                spawnRescue()
            } else {
                spawnAsteroid()
            }
        }

        // Off-screen cleanup is handled by AutoDestroy; lightly rotate asteroids.
        for (const a of sprites.allOfKind(SpriteKind.Asteroid)) {
            if (a.y > 130) a.destroy()
        }
        for (const r of sprites.allOfKind(SpriteKind.Rescue)) {
            if (r.y > 130) r.destroy()
        }
    }

    function spawnAsteroid() {
        const a = sprites.create(art.asteroid, SpriteKind.Asteroid)
        a.setPosition(randint(12, 148), -10)
        a.vy = randint(30, 55)
        a.vx = randint(-10, 10)
        a.data["hp"] = 4
        a.data["damage"] = 35
    }

    function spawnRescue() {
        // Both factions see Guardian AND Shadow. 50/50 chance.
        const isGuardian = Math.percentChance(50)
        const im = isGuardian ? art.asteroidGuardian : art.asteroidShadow
        const r = sprites.create(im, SpriteKind.Rescue)
        r.setPosition(randint(12, 148), -10)
        r.vy = randint(25, 40)
        r.vx = randint(-6, 6)
        r.data["isGuardian"] = isGuardian
        // Glow effect for visibility
        r.startEffect(effects.coolRadial, 600)
    }

    // Asteroid was hit by a player bolt
    export function damageAsteroid(a: Sprite, amount: number) {
        const hp = (a.data["hp"] as number) - amount
        a.data["hp"] = hp
        a.startEffect(effects.spray, 80)
        if (hp <= 0) {
            audio.sfxExplosionSmall()
            gs.addScore(10)
            a.destroy(effects.fire, 200)
        }
    }

    // Player touched an asteroid -> damage + asteroid destroyed
    export function hitByAsteroid(a: Sprite): number {
        const d: number = a.data["damage"] || 30
        audio.sfxExplosionSmall()
        a.destroy(effects.fire, 250)
        return d
    }

    // Player picked up a rescue asteroid.
    // Alliance ship: Guardian = +score, Shadow = -score. Dominion: reversed.
    export function rescuePickup(r: Sprite) {
        const isGuardian: boolean = !!r.data["isGuardian"]
        const isAlly = (isGuardian && gs.faction == gs.Faction.Alliance) ||
            (!isGuardian && gs.faction == gs.Faction.Dominion)

        if (isAlly) {
            // Friendly -> rescue (bonus score)
            gs.rescues++
            gs.addScore(250)
            if (gs.rescues % 3 == 0) {
                gs.addScore(250)
            }
            audio.sfxRescue()
            r.destroy(effects.confetti, 400)
        } else {
            // Hostile -> penalty (mission failed!)
            gs.addScore(-150)
            audio.sfxHitArmor()
            r.destroy(effects.fire, 400)
        }
    }
}
