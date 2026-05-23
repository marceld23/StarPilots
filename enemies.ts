// Enemy spawning and AI.
// Dominion enemies (Sabre-I, Mauler-I, Aegis-I) appear when the
// player flies a Falcon-A. Alliance enemies (Falcon-A, Scout-R, Cross-B) appear when
// the player flies a Sabre-I.

namespace enemies {

    export enum Type {
        SabreI,
        MaulerI,
        AegisI,
        FalconA,
        ScoutR,
        CrossB
    }

    interface EnemySpec {
        image: Image
        hp: number
        speed: number
        fireRateMs: number
        score: number
        pattern: string
        damageOnCollide: number
    }

    function specFor(t: Type): EnemySpec {
        const s = gs.enemyHpScale()
        switch (t) {
            case Type.SabreI:
                // Same silhouette as the player Sabre-I (Sabre-I is symmetric -> no mirroring needed)
                return { image: art.sabreIPlayer, hp: 1 * s, speed: gs.enemySpeed(), fireRateMs: 2200, score: 50, pattern: "straight", damageOnCollide: 25 }
            case Type.MaulerI:
                return { image: art.enemyMaulerI, hp: 3 * s, speed: gs.enemySpeed() - 8, fireRateMs: 1800, score: 100, pattern: "straight", damageOnCollide: 40 }
            case Type.AegisI:
                return { image: art.enemyAegisI, hp: 4 * s, speed: gs.enemySpeed() + 4, fireRateMs: 1200, score: 150, pattern: "sine", damageOnCollide: 30 }
            case Type.FalconA:
                return { image: art.enemyFalconA, hp: 2 * s, speed: gs.enemySpeed(), fireRateMs: 1800, score: 75, pattern: "straight", damageOnCollide: 25 }
            case Type.ScoutR:
                return { image: art.enemyScoutR, hp: 1 * s, speed: gs.enemySpeed() + 14, fireRateMs: 2400, score: 100, pattern: "sine", damageOnCollide: 25 }
            case Type.CrossB:
                return { image: art.enemyCrossB, hp: 4 * s, speed: gs.enemySpeed() - 6, fireRateMs: 1400, score: 150, pattern: "straight", damageOnCollide: 40 }
        }
        return { image: art.enemySabreI, hp: 1, speed: 40, fireRateMs: 2000, score: 50, pattern: "straight", damageOnCollide: 20 }
    }

    let lastSpawnAt: number = 0
    let spawnedThisLevel: number = 0
    let totalToSpawnThisLevel: number = 0
    let spawningActive: boolean = false

    export function startLevel() {
        lastSpawnAt = game.runtime()
        spawnedThisLevel = 0
        totalToSpawnThisLevel = gs.enemiesPerLevel()
        spawningActive = true
    }

    export function stopSpawning() {
        spawningActive = false
    }

    export function levelComplete(): boolean {
        if (spawningActive) return false
        return sprites.allOfKind(SpriteKind.Enemy).length == 0
    }

    export function clearAll() {
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) e.destroy()
        for (const s of sprites.allOfKind(SpriteKind.EnemyShot)) s.destroy()
        spawningActive = false
    }

    function pickEnemyType(): Type {
        if (gs.faction == gs.Faction.Alliance) {
            // Player is Falcon-A -> Dominion enemies
            const r = Math.percentChance(50)
                ? Type.SabreI
                : (Math.percentChance(60) ? Type.MaulerI : Type.AegisI)
            // Aegis-I only from level 2 onward
            if (r == Type.AegisI && gs.level < 2) return Type.SabreI
            // Mauler-I only from level 2 onward
            if (r == Type.MaulerI && gs.level < 2) return Type.SabreI
            return r
        } else {
            const r = Math.percentChance(50)
                ? Type.FalconA
                : (Math.percentChance(60) ? Type.ScoutR : Type.CrossB)
            if (r == Type.ScoutR && gs.level < 2) return Type.FalconA
            if (r == Type.CrossB && gs.level < 3) return Type.FalconA
            return r
        }
    }

    function spawn(type: Type) {
        const spec = specFor(type)
        const s = sprites.create(spec.image, SpriteKind.Enemy)
        const x = randint(20, 140)
        s.setPosition(x, -16)
        s.vy = spec.speed
        s.data["hp"] = spec.hp
        s.data["maxHp"] = spec.hp
        s.data["type"] = type
        s.data["fireRate"] = spec.fireRateMs
        s.data["nextFire"] = game.runtime() + Math.randomRange(500, spec.fireRateMs)
        s.data["score"] = spec.score
        s.data["damage"] = spec.damageOnCollide
        s.data["homeX"] = x
        s.data["pattern"] = spec.pattern
    }

    export function update() {
        const now = game.runtime()
        if (spawningActive && spawnedThisLevel < totalToSpawnThisLevel) {
            if (now - lastSpawnAt >= gs.spawnIntervalMs()) {
                lastSpawnAt = now
                spawn(pickEnemyType())
                spawnedThisLevel++
                if (spawnedThisLevel >= totalToSpawnThisLevel) {
                    spawningActive = false
                }
            }
        }

        // Movement patterns + fire
        const all = sprites.allOfKind(SpriteKind.Enemy)
        for (const e of all) {
            const pattern = e.data["pattern"]
            if (pattern == "sine") {
                const homeX = e.data["homeX"]
                e.x = homeX + Math.sin(game.runtime() / 300) * 30
            }
            if (e.y > 130) {
                e.destroy()
                continue
            }
            const nf = e.data["nextFire"]
            if (now >= nf && e.y > 0 && e.y < 80) {
                fireShot(e)
                e.data["nextFire"] = now + Math.randomRange(800, e.data["fireRate"])
            }
        }
    }

    function fireShot(e: Sprite) {
        const t: number = e.data["type"]
        const bolt = (t == Type.SabreI || t == Type.MaulerI || t == Type.AegisI)
            ? art.laserGreen : art.laserRed
        const p = sprites.create(bolt, SpriteKind.EnemyShot)
        p.setPosition(e.x, e.y + 12)
        p.vy = 120
        p.setFlag(SpriteFlag.AutoDestroy, true)
        audio.sfxLaserEnemy()
    }

    // Called from a bolt hit
    export function damageEnemy(e: Sprite, amount: number) {
        const hp = (e.data["hp"] as number) - amount
        e.data["hp"] = hp
        e.startEffect(effects.spray, 100)
        if (hp <= 0) {
            killEnemy(e, true)
        }
    }

    export function killEnemy(e: Sprite, awardScore: boolean) {
        if (awardScore) {
            const score: number = e.data["score"] || 50
            gs.addScore(score)
        }
        const isArmada: boolean = !!e.data["isArmada"]
        audio.sfxExplosionSmall()
        e.destroy(effects.fire, 300)
        if (isArmada) {
            bosses.notifyFleetShipKilled()
        }
    }

    export function getCollisionDamage(e: Sprite): number {
        const d: number = e.data["damage"]
        return (d && d > 0) ? d : 25
    }
}
