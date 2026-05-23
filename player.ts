// Player logic: movement, shooting, shield/armor, special.
// Stats come from ships.config (see state.ts) + upgrades.

namespace player {

    let playerSprite: Sprite = null
    let lastFireTime: number = 0
    let invulnerableUntil: number = 0
    const INVUL_AFTER_HIT_MS = 600

    export function getSprite(): Sprite {
        return playerSprite
    }

    export function isAlive(): boolean {
        return playerSprite != null
    }

    export function spawn(shipId: number): Sprite {
        gs.shipId = shipId
        const stats = ships.current()
        const sprImg = art.shipSprite(shipId)
        const s = sprites.create(sprImg, SpriteKind.Player)
        s.setPosition(80, 100)
        controller.moveSprite(s, stats.speed, Math.max(60, stats.speed * 0.75))
        s.setStayInScreen(true)
        s.z = 10
        playerSprite = s

        // Stats from config + upgrades
        if (stats.hpType == 0) {
            // Shield (regenerates)
            gs.maxShield = ships.effectiveMaxShield()
            gs.shield = gs.maxShield
            gs.maxArmor = 0
            gs.armor = 0
        } else {
            // Armor (no regen)
            gs.maxShield = 0
            gs.shield = 0
            gs.maxArmor = ships.effectiveMaxArmor()
            gs.armor = gs.maxArmor
        }

        return s
    }

    export function clear() {
        if (playerSprite) {
            playerSprite.destroy()
            playerSprite = null
        }
    }

    export function fire() {
        if (!playerSprite) return
        const now = game.runtime()
        const cooldown = ships.effectiveFireCooldown()
        if (now - lastFireTime < cooldown) return
        lastFireTime = now

        const stats = ships.current()
        const boltImg = stats.boltColor == 2 ? art.laserRed : art.laserGreen
        const numBolts = ships.effectiveBolts()
        const dmg = ships.effectiveDamage()

        // Spread by bolt count
        if (numBolts == 1) {
            spawnPlayerBolt(playerSprite.x, playerSprite.y - 10, boltImg, dmg, stats.boltVel)
        } else if (numBolts == 2) {
            spawnPlayerBolt(playerSprite.x - 8, playerSprite.y - 8, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x + 8, playerSprite.y - 8, boltImg, dmg, stats.boltVel)
        } else if (numBolts == 3) {
            spawnPlayerBolt(playerSprite.x, playerSprite.y - 10, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x - 9, playerSprite.y - 6, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x + 9, playerSprite.y - 6, boltImg, dmg, stats.boltVel)
        } else if (numBolts >= 4) {
            // 4 or more: spread from the wingtips
            spawnPlayerBolt(playerSprite.x - 10, playerSprite.y - 8, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x - 4, playerSprite.y - 10, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x + 4, playerSprite.y - 10, boltImg, dmg, stats.boltVel)
            spawnPlayerBolt(playerSprite.x + 10, playerSprite.y - 8, boltImg, dmg, stats.boltVel)
            if (numBolts >= 5) {
                spawnPlayerBolt(playerSprite.x, playerSprite.y - 12, boltImg, dmg, stats.boltVel)
            }
        }

        audio.sfxLaserPlayer()
    }

    function spawnPlayerBolt(x: number, y: number, image: Image, damage: number, vy: number) {
        const p = sprites.create(image, SpriteKind.PlayerShot)
        p.setPosition(x, y)
        p.vy = -vy
        p.data["dmg"] = damage
        p.setFlag(SpriteFlag.AutoDestroy, true)
    }

    // Special action on B button (replaces the old bomb).
    // Effect depends on the ship (see ships.Stats.specialType).
    export function triggerSpecial() {
        if (!playerSprite) return
        if (!ships.isSpecialReady()) return  // cooldown still running
        gs.lastSpecialUseMs = game.runtime()

        const stats = ships.current()
        switch (stats.specialType) {
            case ships.SPECIAL_REPAIR:
                doRepair(stats.specialPower)
                break
            case ships.SPECIAL_REPAIR_BOOST:
                doRepair(stats.specialPower)
                doBoost(1000)
                break
            case ships.SPECIAL_WEAPON:
                doWeapon(stats)
                break
            case ships.SPECIAL_SEISMIC:
                doSeismic(stats.specialPower)
                break
        }
    }

    function doRepair(amount: number) {
        const stats = ships.current()
        if (stats.hpType == 0) {
            gs.shield = Math.min(gs.maxShield, gs.shield + amount)
        } else {
            gs.armor = Math.min(gs.maxArmor, gs.armor + amount)
        }
        audio.sfxPowerup()
        if (playerSprite) playerSprite.startEffect(effects.coolRadial, 600)
    }

    function doBoost(durationMs: number) {
        if (!playerSprite) return
        const stats = ships.current()
        gs.specialBoostUntil = game.runtime() + durationMs
        controller.moveSprite(playerSprite, stats.speed * 1.6, stats.speed * 1.2)
        playerSprite.startEffect(effects.trail, durationMs)
    }

    function doWeapon(stats: ships.Stats) {
        if (!playerSprite) return
        const isAlliance = stats.faction == gs.Faction.Alliance
        // Bombs (Mauler-I) and torpedoes are chunky; missiles are slim
        const isMissile = stats.specialLabel == "Mis"
        const projImg = isMissile
            ? (isAlliance ? art.missileRed : art.missileGreen)
            : (isAlliance ? art.torpedoRed : art.torpedoGreen)
        const vel = isMissile ? 240 : 160
        const count = stats.specialCount
        const dmg = stats.specialPower
        // Spread
        if (count == 1) {
            spawnSpecialBolt(playerSprite.x, playerSprite.y - 12, projImg, dmg, vel)
        } else if (count == 2) {
            spawnSpecialBolt(playerSprite.x - 9, playerSprite.y - 10, projImg, dmg, vel)
            spawnSpecialBolt(playerSprite.x + 9, playerSprite.y - 10, projImg, dmg, vel)
        } else if (count >= 3) {
            spawnSpecialBolt(playerSprite.x, playerSprite.y - 12, projImg, dmg, vel)
            spawnSpecialBolt(playerSprite.x - 10, playerSprite.y - 8, projImg, dmg, vel)
            spawnSpecialBolt(playerSprite.x + 10, playerSprite.y - 8, projImg, dmg, vel)
        }
        audio.sfxBombDrop()
    }

    function spawnSpecialBolt(x: number, y: number, image: Image, damage: number, vel: number) {
        const p = sprites.create(image, SpriteKind.PlayerShot)
        p.setPosition(x, y)
        p.vy = -vel
        p.data["dmg"] = damage
        p.setFlag(SpriteFlag.AutoDestroy, true)
        // Slight trail for special projectiles
        p.startEffect(effects.trail, 300)
    }

    function doSeismic(bossDamage: number) {
        // Bounty-I Seismic Charge: AOE over the whole screen.
        audio.sfxExplosionBig()
        scene.cameraShake(6, 700)
        const enemyList = sprites.allOfKind(SpriteKind.Enemy)
        for (const e of enemyList) {
            enemies.killEnemy(e, false)
        }
        const shots = sprites.allOfKind(SpriteKind.EnemyShot)
        for (const s of shots) s.destroy()
        const bossList = sprites.allOfKind(SpriteKind.Boss)
        for (const b of bossList) {
            bosses.damageBoss(b, bossDamage)
        }
        if (playerSprite) playerSprite.startEffect(effects.confetti, 500)
    }

    // Apply damage. Returns true when the player was destroyed.
    export function takeDamage(amount: number): boolean {
        if (!playerSprite) return true
        const now = game.runtime()
        if (now < invulnerableUntil) return false
        invulnerableUntil = now + INVUL_AFTER_HIT_MS

        const stats = ships.current()
        if (stats.hpType == 0) {
            gs.shield -= amount
            gs.shieldRegenCooldown = 2500
            audio.sfxHitShield()
            playerSprite.startEffect(effects.coolRadial, 250)
            scene.cameraShake(2, 150)
            if (gs.shield <= 0) {
                gs.shield = 0
                scene.cameraShake(4, 300)
                return die()
            }
        } else {
            gs.armor -= amount
            audio.sfxHitArmor()
            playerSprite.startEffect(effects.fire, 250)
            scene.cameraShake(3, 200)
            if (gs.armor <= 0) {
                gs.armor = 0
                scene.cameraShake(5, 400)
                return die()
            }
        }
        return false
    }

    function die(): boolean {
        if (!playerSprite) return true
        playerSprite.destroy(effects.fire, 800)
        playerSprite = null
        scene.cameraShake(6, 800)
        audio.sfxExplosionBig()
        return true
    }

    // Per frame: shield regen after hit cooldown + end of boost.
    export function update(dtMs: number) {
        if (!playerSprite) return
        const stats = ships.current()
        if (stats.hpType == 0 && gs.shield < gs.maxShield) {
            if (gs.shieldRegenCooldown > 0) {
                gs.shieldRegenCooldown -= dtMs
            } else {
                gs.shield = Math.min(gs.maxShield, gs.shield + dtMs * 0.012)
            }
        }
        // Reset speed boost
        if (gs.specialBoostUntil > 0 && game.runtime() >= gs.specialBoostUntil) {
            gs.specialBoostUntil = 0
            controller.moveSprite(playerSprite, stats.speed, Math.max(60, stats.speed * 0.75))
        }
    }
}
