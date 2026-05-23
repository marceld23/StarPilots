// Boss logic for both factions.
// Several standard bosses rotate over the levels + a final boss at level 11.

namespace bosses {

    export enum Type {
        // Dominion bosses (vs Alliance player)
        Dreadnought,
        RazorSquadron,
        Gravitron,
        Envoy,
        Citadel,             // Final boss for Alliance
        // Alliance bosses (vs Dominion player)
        Crescent,
        Leviathan,
        Comet,
        Forktail,
        AllianceArmada       // Final boss for Dominion
    }

    let bossSprite: Sprite = null
    let phase: number = 1
    let dir: number = 1
    let lastFireAt: number = 0
    let bossType: Type = Type.Dreadnought
    let onDefeatCallback: () => void = null

    // ===== Alliance Armada (multi-sprite boss) =====
    let fleetActive: boolean = false
    let fleetWave: number = 0
    let fleetShipsAliveInWave: number = 0
    let fleetTotalKilled: number = 0
    let fleetTotalShips: number = 0

    export function isActive(): boolean {
        return bossSprite != null || fleetActive
    }

    export function currentSprite(): Sprite {
        return bossSprite
    }

    export function isArmadaBoss(): boolean {
        return fleetActive
    }

    // Which boss appears at which level?
    // Lvl 11 is the final boss (Citadel Sphere / Alliance Armada) - only once.
    // Before and after that the regular bosses rotate through.
    function pickBossType(level: number): Type {
        if (gs.faction == gs.Faction.Alliance) {
            if (level == 11) return Type.Citadel
            const rotation = [Type.Dreadnought, Type.RazorSquadron, Type.Gravitron, Type.Envoy]
            return rotation[Math.floor((level - 1) / 2) % rotation.length]
        } else {
            if (level == 11) return Type.AllianceArmada
            const rotation = [Type.Crescent, Type.Leviathan, Type.Comet, Type.Forktail]
            return rotation[Math.floor((level - 1) / 2) % rotation.length]
        }
    }

    function imageFor(t: Type): Image {
        switch (t) {
            case Type.Dreadnought: return art.bossDreadnought()
            case Type.RazorSquadron: return art.bossRazorSquadron()
            case Type.Gravitron: return art.bossGravitron()
            case Type.Envoy: return art.bossEnvoy()
            case Type.Citadel: return art.bossCitadel()
            case Type.Crescent: return art.bossCrescent()
            case Type.Leviathan: return art.bossLeviathan()
            case Type.Comet: return art.bossComet()
            case Type.Forktail: return art.bossForktail()
        }
        return art.bossDreadnought()
    }

    export function spawn(onDefeat: () => void) {
        bossType = pickBossType(gs.level)
        onDefeatCallback = onDefeat
        phase = 1
        dir = 1
        lastFireAt = game.runtime()

        if (bossType == Type.AllianceArmada) {
            spawnFleetBoss()
            return
        }

        const img = imageFor(bossType)
        const s = sprites.create(img, SpriteKind.Boss)
        // Start higher than before (was -20) so the boss becomes visible faster.
        s.setPosition(80, -8)
        s.vy = 60
        let hp = gs.bossHp()
        // Final-boss bonus: Citadel Sphere has a lot more HP.
        if (bossType == Type.Citadel) hp = Math.floor(hp * 2.5)
        s.data["hp"] = hp
        s.data["maxHp"] = hp
        s.z = 5
        bossSprite = s
        audio.playBossTheme(bossType, gs.faction)
    }

    // === Alliance Armada: wave boss ===
    function spawnFleetBoss() {
        fleetActive = true
        fleetWave = 0
        fleetTotalKilled = 0
        fleetTotalShips = 11   // 4 + 3 + 4
        audio.playBossTheme(Type.AllianceArmada, gs.faction)
        spawnFleetWave()
    }

    function spawnFleetWave() {
        const positions: { x: number, y: number, img: Image }[] = []
        if (fleetWave == 0) {
            // 4 Falcon-A in V formation
            positions.push({ x: 40, y: -20, img: art.enemyFalconA })
            positions.push({ x: 70, y: -10, img: art.enemyFalconA })
            positions.push({ x: 90, y: -10, img: art.enemyFalconA })
            positions.push({ x: 120, y: -20, img: art.enemyFalconA })
        } else if (fleetWave == 1) {
            // 3 Scout-R
            positions.push({ x: 50, y: -15, img: art.enemyScoutR })
            positions.push({ x: 80, y: -10, img: art.enemyScoutR })
            positions.push({ x: 110, y: -15, img: art.enemyScoutR })
        } else {
            // 2 Cross-B + 2 Hammer-B (last wave)
            positions.push({ x: 35, y: -20, img: art.enemyCrossB })
            positions.push({ x: 65, y: -15, img: art.hammerBPlayer })
            positions.push({ x: 95, y: -15, img: art.hammerBPlayer })
            positions.push({ x: 125, y: -20, img: art.enemyCrossB })
        }
        fleetShipsAliveInWave = positions.length
        const hpPerShip = Math.max(4, Math.floor(gs.bossHp() / 12))
        for (const p of positions) {
            const e = sprites.create(p.img, SpriteKind.Enemy)
            e.setPosition(p.x, p.y)
            e.vy = 25
            e.data["hp"] = hpPerShip
            e.data["maxHp"] = hpPerShip
            e.data["fireRate"] = 1800
            e.data["nextFire"] = game.runtime() + Math.randomRange(500, 1800)
            e.data["score"] = 100
            e.data["damage"] = 25
            e.data["homeX"] = p.x
            e.data["pattern"] = "sine"
            e.data["isArmada"] = true
        }
    }

    // Called by enemies.killEnemy when a fleet ship dies.
    export function notifyFleetShipKilled() {
        if (!fleetActive) return
        fleetShipsAliveInWave--
        fleetTotalKilled++
        if (fleetShipsAliveInWave <= 0) {
            fleetWave++
            if (fleetWave > 2) {
                // All waves defeated
                fleetDefeat()
            } else {
                // Next wave after a short pause
                control.runInParallel(function () {
                    pause(800)
                    if (fleetActive) spawnFleetWave()
                })
            }
        }
    }

    function fleetDefeat() {
        fleetActive = false
        scene.cameraShake(8, 1200)
        audio.sfxExplosionBig()
        gs.addScore(1500 + gs.level * 100)
        const callback = onDefeatCallback
        onDefeatCallback = null
        control.runInParallel(function () {
            pause(1200)
            if (callback) callback()
        })
    }

    export function clear() {
        if (bossSprite) {
            bossSprite.destroy()
            bossSprite = null
        }
        fleetActive = false
        // Also remove all fleet ships
        for (const e of sprites.allOfKind(SpriteKind.Enemy)) {
            if (e.data["isArmada"]) e.destroy()
        }
    }

    export function damageBoss(b: Sprite, amount: number) {
        if (!b || b != bossSprite) return
        const hp = (b.data["hp"] as number) - amount
        b.data["hp"] = hp
        b.startEffect(effects.spray, 100)
        const maxHp: number = b.data["maxHp"]
        if (hp <= maxHp / 3) phase = 3
        else if (hp <= maxHp * 2 / 3) phase = 2
        if (hp <= 0) {
            defeat()
        }
    }

    function defeat() {
        if (!bossSprite) return
        scene.cameraShake(8, 1200)
        audio.sfxExplosionBig()
        for (let i = 0; i < 6; i++) {
            const off = i * 80
            control.runInParallel(function () {
                pause(off)
                if (bossSprite) {
                    bossSprite.startEffect(effects.fire, 200)
                }
            })
        }
        let bonus = 500 + gs.level * 100
        if (bossType == Type.Citadel) bonus = bonus * 3
        gs.addScore(bonus)
        const callback = onDefeatCallback
        onDefeatCallback = null
        const ref = bossSprite
        bossSprite = null
        control.runInParallel(function () {
            if (ref) ref.destroy(effects.fire, 1200)
            pause(1200)
            if (callback) callback()
        })
    }

    export function update() {
        if (fleetActive) {
            // Fleet waves: nothing to do, enemies are regular sprites.
            return
        }
        if (!bossSprite) return
        if (bossSprite.y < 28) {
            bossSprite.vy = 60
            bossSprite.vx = 0
            return
        }
        bossSprite.vy = 0

        const speed = (phase == 3) ? 45 : (phase == 2 ? 32 : 22)
        if (bossSprite.x < 30) dir = 1
        if (bossSprite.x > 130) dir = -1
        bossSprite.vx = speed * dir

        const now = game.runtime()
        let interval = (phase == 3) ? 700 : (phase == 2 ? 1100 : 1500)
        // Final boss fires more often.
        if (bossType == Type.Citadel) interval = Math.floor(interval * 0.7)
        if (now - lastFireAt >= interval) {
            lastFireAt = now
            fireBossPattern()
        }
    }

    function fireBossPattern() {
        if (!bossSprite) return
        const bolt = (gs.faction == gs.Faction.Alliance) ? art.laserGreen : art.laserRed
        const baseY = bossSprite.y + 16
        if (phase == 1) {
            spawnBossBolt(bossSprite.x, baseY, 0, 90, bolt)
        } else if (phase == 2) {
            spawnBossBolt(bossSprite.x - 14, baseY, -10, 90, bolt)
            spawnBossBolt(bossSprite.x + 14, baseY, 10, 90, bolt)
        } else {
            spawnBossBolt(bossSprite.x, baseY, 0, 100, bolt)
            spawnBossBolt(bossSprite.x - 14, baseY, -40, 90, bolt)
            spawnBossBolt(bossSprite.x + 14, baseY, 40, 90, bolt)
        }
        // Citadel Sphere fires an extra super-laser shot.
        if (bossType == Type.Citadel && phase >= 2) {
            spawnBossBolt(bossSprite.x, baseY + 4, 0, 70, art.torpedoGreen)
        }
        audio.sfxLaserEnemy()
    }

    function spawnBossBolt(x: number, y: number, vx: number, vy: number, image: Image) {
        const p = sprites.create(image, SpriteKind.EnemyShot)
        p.setPosition(x, y)
        p.vx = vx
        p.vy = vy
        p.setFlag(SpriteFlag.AutoDestroy, true)
    }

    // Draw HP bar
    export function drawHpBar() {
        if (fleetActive) {
            // HP bar shows progress through the fleet
            const w = 120, h = 4
            const x = 80 - w / 2, y = 4
            screen.fillRect(x - 1, y - 1, w + 2, h + 2, 15)
            screen.fillRect(x, y, w, h, 2)
            const ratio = (fleetTotalShips - fleetTotalKilled) / fleetTotalShips
            const fill = Math.max(0, Math.floor(w * ratio))
            screen.fillRect(x, y, fill, h, 7)
            screen.print(i18n.t("FLEET"), 2, 2, 1, image.font5)
            return
        }
        if (!bossSprite) return
        const hp: number = bossSprite.data["hp"]
        const max: number = bossSprite.data["maxHp"]
        const w = 120, h = 4
        const x = 80 - w / 2, y = 4
        screen.fillRect(x - 1, y - 1, w + 2, h + 2, 15)
        screen.fillRect(x, y, w, h, 2)
        const fill = Math.max(0, Math.idiv(w * hp, max))
        screen.fillRect(x, y, fill, h, 7)
        screen.print(i18n.t("BOSS"), 2, 2, 1, image.font5)
    }

    export function bossName(): string {
        switch (bossType) {
            case Type.Dreadnought: return i18n.t("Dreadnought")
            case Type.RazorSquadron: return i18n.t("Razor Squadron")
            case Type.Gravitron: return i18n.t("Gravitron Cruiser")
            case Type.Envoy: return i18n.t("Envoy Shuttle")
            case Type.Citadel: return i18n.t("CITADEL SPHERE")
            case Type.Crescent: return i18n.t("Crescent Frigate")
            case Type.Leviathan: return i18n.t("Leviathan Cruiser")
            case Type.Comet: return i18n.t("Comet Corvette")
            case Type.Forktail: return i18n.t("Forktail Corvette")
            case Type.AllianceArmada: return i18n.t("ALLIANCE ARMADA")
        }
        return i18n.t("Boss")
    }
}
