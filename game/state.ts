// Shared game state and constants for StarPilots.

// Custom sprite kinds (Player and Enemy are already defined by the framework).
namespace SpriteKind {
    export const PlayerShot = SpriteKind.create()
    export const EnemyShot = SpriteKind.create()
    export const Boss = SpriteKind.create()
    export const Asteroid = SpriteKind.create()
    export const Rescue = SpriteKind.create()
    export const Powerup = SpriteKind.create()
}

namespace gs {
    // Factions. Values stay 0/1 for save-file compatibility.
    export enum Faction {
        Alliance = 0,
        Dominion = 1
    }

    export enum Screen {
        Boot,
        Title,
        Settings,
        Help,
        DifficultySelect,
        FactionSelect,
        ShipSelect,
        LevelIntro,
        Playing,
        BossIntro,
        BossFight,
        LevelComplete,
        UpgradeChoice,
        ShipUnlocked,
        GameOver,
        Paused,
        Victory,
        CanyonRun,         // Minigame: trench-run cockpit shooter
        CanyonRunIntro,    // Cutscene before the trench run
        CanyonRunResult,   // Result screen
        BladeArena,        // Minigame: Guardian vs Shadow plasma blade duel
        BladeArenaIntro,
        BladeArenaResult,
        FpsBattle,         // Minigame: FPS vs Dominion / Alliance troopers
        FpsBattleIntro,
        FpsBattleResult,
        Sidescroller,      // Minigame: side-view platformer
        SidescrollerIntro,
        SidescrollerResult,
        TestMenu,          // Debug/test menu for launching minigames directly
        ShipPreview        // View-only: page through all ships (no gameplay)
    }

    export enum Difficulty {
        Easy = 0,
        Normal = 1,
        Hard = 2,
        Veteran = 3
    }

    // Globals
    export let screen: Screen = Screen.Boot
    export let faction: Faction = Faction.Alliance
    export let shipId: number = 0  // Index into ships.config (see ships namespace)
    export let level: number = 1
    export let score: number = 0
    export let highscore: number = 0
    export let difficulty: Difficulty = Difficulty.Easy
    export let rescues: number = 0
    export let bombs: number = 0

    // Special action (B button) cooldown
    export let lastSpecialUseMs: number = 0
    export let specialBoostUntil: number = 0   // game.runtime() until speed-boost ends

    // Player stats (derived from ship config + upgrades)
    export let shield: number = 0
    export let armor: number = 0
    export let maxShield: number = 100
    export let maxArmor: number = 100
    export let shieldRegenCooldown: number = 0

    // Upgrade bonuses (stack across a run)
    export let upgradeShieldBonus: number = 0
    export let upgradeArmorBonus: number = 0
    export let upgradeFireCooldownReduction: number = 0
    export let upgradeExtraBolts: number = 0
    export let upgradeDamageBonus: number = 0
    export let upgradeBombBonus: number = 0

    // Unlock state per faction (bitmask: bit n = ship index n unlocked)
    export let unlockedAlliance: number = 1  // Bit 0 = Falcon-A always unlocked
    export let unlockedDominion: number = 1  // Bit 0 = Sabre-I always unlocked

    // Minigame progress (bitmask, bit 0=Arena 1=Trench 2=FPS 3=Sidescroller)
    export let minigamesCompleted: number = 0
    export let squadronUnlocked: boolean = false

    // When true: minigame was launched from test mode -> return to test menu after
    export let fromTestMode: boolean = false

    export const HIGHSCORE_KEY = "sw_fighter_hi"
    export const UNLOCK_ALLIANCE_KEY = "sw_unlock_r"
    export const UNLOCK_DOMINION_KEY = "sw_unlock_e"
    export const DIFFICULTY_KEY = "sw_diff"
    export const MINIGAMES_KEY = "sw_minig"
    export const SQUADRON_KEY = "sw_squad"
    export const MAX_LEVEL_KEY = "sw_maxlvl"

    // Highest level ever reached - persisted across runs, drives the rank system.
    export let maxLevelReached: number = 1

    export function reset() {
        level = startingLevel()
        score = 0
        rescues = 0
        bombs = 0
        shieldRegenCooldown = 0
        lastSpecialUseMs = 0
        specialBoostUntil = 0
        upgradeShieldBonus = 0
        upgradeArmorBonus = 0
        upgradeFireCooldownReduction = 0
        upgradeExtraBolts = 0
        upgradeDamageBonus = 0
        upgradeBombBonus = 0
    }

    export function loadHighscore() {
        const v = settings.readNumber(HIGHSCORE_KEY)
        highscore = (v == null || isNaN(v)) ? 0 : v
    }

    export function saveHighscore() {
        if (score > highscore) {
            highscore = score
            settings.writeNumber(HIGHSCORE_KEY, highscore)
        }
    }

    export function loadUnlocks() {
        const r = settings.readNumber(UNLOCK_ALLIANCE_KEY)
        unlockedAlliance = (r == null || isNaN(r)) ? 1 : r
        const e = settings.readNumber(UNLOCK_DOMINION_KEY)
        unlockedDominion = (e == null || isNaN(e)) ? 1 : e
    }

    export function saveUnlocks() {
        settings.writeNumber(UNLOCK_ALLIANCE_KEY, unlockedAlliance)
        settings.writeNumber(UNLOCK_DOMINION_KEY, unlockedDominion)
    }

    export function loadMinigameProgress() {
        const m = settings.readNumber(MINIGAMES_KEY)
        minigamesCompleted = (m == null || isNaN(m)) ? 0 : m
        const sq = settings.readNumber(SQUADRON_KEY)
        squadronUnlocked = !!(sq && sq > 0)
    }

    export function loadMaxLevel() {
        const v = settings.readNumber(MAX_LEVEL_KEY)
        maxLevelReached = (v == null || isNaN(v) || v < 1) ? 1 : v
    }

    export function recordLevel(lvl: number) {
        if (lvl > maxLevelReached) {
            maxLevelReached = lvl
            settings.writeNumber(MAX_LEVEL_KEY, maxLevelReached)
        }
    }

    // Rank based on highest level reached so far (new rank every 10 levels).
    export function rankName(): string {
        if (maxLevelReached < 11) return i18n.t("Recruit")
        if (maxLevelReached < 21) return i18n.t("Pilot")
        if (maxLevelReached < 31) return i18n.t("Lieutenant")
        if (maxLevelReached < 41) return i18n.t("Captain")
        if (maxLevelReached < 51) return i18n.t("Commander")
        return i18n.t("Admiral")
    }

    // Wipe the entire game progress (highscore, unlocks, minigames, wingmen,
    // rank). Volume/brightness/difficulty/language are preserved.
    export function resetProgress() {
        highscore = 0
        unlockedAlliance = 1
        unlockedDominion = 1
        minigamesCompleted = 0
        squadronUnlocked = false
        maxLevelReached = 1
        settings.writeNumber(HIGHSCORE_KEY, 0)
        settings.writeNumber(UNLOCK_ALLIANCE_KEY, 1)
        settings.writeNumber(UNLOCK_DOMINION_KEY, 1)
        settings.writeNumber(MINIGAMES_KEY, 0)
        settings.writeNumber(SQUADRON_KEY, 0)
        settings.writeNumber(MAX_LEVEL_KEY, 1)
    }

    export function markMinigameCompleted(idx: number) {
        const bit = 1 << idx
        if ((minigamesCompleted & bit) == 0) {
            minigamesCompleted = minigamesCompleted | bit
            settings.writeNumber(MINIGAMES_KEY, minigamesCompleted)
            // Once all 4 minigames done -> unlock Squadron Commander
            if (minigamesCompleted == 0xF && !squadronUnlocked) {
                squadronUnlocked = true
                settings.writeNumber(SQUADRON_KEY, 1)
            }
        }
    }

    export function isUnlocked(faction: Faction, shipIdx: number): boolean {
        const mask = (faction == Faction.Alliance) ? unlockedAlliance : unlockedDominion
        return (mask & (1 << shipIdx)) != 0
    }

    export function unlockShip(faction: Faction, shipIdx: number): boolean {
        const wasLocked = !isUnlocked(faction, shipIdx)
        if (faction == Faction.Alliance) {
            unlockedAlliance = unlockedAlliance | (1 << shipIdx)
        } else {
            unlockedDominion = unlockedDominion | (1 << shipIdx)
        }
        if (wasLocked) {
            saveUnlocks()
            // All ships of this faction unlocked? -> enable Wingmen (instead of new ships)
            if (allShipsUnlocked(faction) && !squadronUnlocked) {
                squadronUnlocked = true
                settings.writeNumber(SQUADRON_KEY, 1)
            }
        }
        return wasLocked
    }

    // Are all ships of a faction unlocked?
    export function allShipsUnlocked(faction: Faction): boolean {
        const count = faction == Faction.Alliance ? ships.ALLIANCE_COUNT : ships.DOMINION_COUNT
        const mask = faction == Faction.Alliance ? unlockedAlliance : unlockedDominion
        const full = (1 << count) - 1
        return (mask & full) == full
    }

    // ====== Difficulty multipliers ======
    export function loadDifficulty() {
        const v = settings.readNumber(DIFFICULTY_KEY)
        if (v == null || isNaN(v) || v < 0 || v > 3) {
            difficulty = Difficulty.Easy
        } else {
            difficulty = v as Difficulty
        }
    }

    export function saveDifficulty() {
        settings.writeNumber(DIFFICULTY_KEY, difficulty)
    }

    export function difficultyEnemyHpMul(): number {
        switch (difficulty) {
            case Difficulty.Easy: return 1.0
            case Difficulty.Normal: return 1.3
            case Difficulty.Hard: return 1.7
            case Difficulty.Veteran: return 2.2
        }
        return 1.0
    }
    export function difficultySpeedMul(): number {
        switch (difficulty) {
            case Difficulty.Easy: return 1.0
            case Difficulty.Normal: return 1.15
            case Difficulty.Hard: return 1.3
            case Difficulty.Veteran: return 1.5
        }
        return 1.0
    }
    export function difficultyBossHpMul(): number {
        switch (difficulty) {
            case Difficulty.Easy: return 1.0
            case Difficulty.Normal: return 1.3
            case Difficulty.Hard: return 1.6
            case Difficulty.Veteran: return 2.0
        }
        return 1.0
    }
    export function difficultyScoreMul(): number {
        switch (difficulty) {
            case Difficulty.Easy: return 1.0
            case Difficulty.Normal: return 1.5
            case Difficulty.Hard: return 2.0
            case Difficulty.Veteran: return 3.0
        }
        return 1.0
    }
    export function startingLevel(): number {
        return difficulty == Difficulty.Veteran ? 3 : 1
    }
    export function difficultyName(): string {
        switch (difficulty) {
            case Difficulty.Easy: return i18n.t("Easy")
            case Difficulty.Normal: return i18n.t("Normal")
            case Difficulty.Hard: return i18n.t("Hard")
            case Difficulty.Veteran: return i18n.t("Veteran")
        }
        return i18n.t("Easy")
    }

    // Always add score via addScore() so the multiplier applies.
    export function addScore(amount: number) {
        if (amount > 0) {
            score += Math.floor(amount * difficultyScoreMul())
        } else {
            score = Math.max(0, score + amount)
        }
    }

    // Scaling of difficulty over the level index + difficulty tier.
    export function spawnIntervalMs(): number {
        return Math.max(350, (1700 - level * 90) / difficultySpeedMul())
    }

    export function enemySpeed(): number {
        return Math.min(120, (28 + level * 3) * difficultySpeedMul())
    }

    export function enemyHpScale(): number {
        return Math.max(1, Math.floor((1 + Math.floor((level - 1) / 2)) * difficultyEnemyHpMul()))
    }

    export function bossHp(): number {
        // Dominion players use armor (no regen) and have less DPS early on
        // -> lower boss HP by 15% so the first endboss is doable.
        const factionMul = faction == Faction.Dominion ? 0.85 : 1.0
        return Math.floor((60 + level * 15) * difficultyBossHpMul() * factionMul)
    }

    export function enemiesPerLevel(): number {
        return Math.min(50, Math.floor((12 + level * 2) * (difficulty == Difficulty.Easy ? 1.0 : 1.2)))
    }
}

// Ship data model: stats for every playable ship.
namespace ships {
    // Special action on B button (see player.triggerSpecial).
    export const SPECIAL_WEAPON = 0       // Secondary weapon (torpedoes/missiles/bombs)
    export const SPECIAL_REPAIR = 1       // Refill shield/armor
    export const SPECIAL_REPAIR_BOOST = 2 // Repair + short speed boost
    export const SPECIAL_SEISMIC = 3      // AOE: wipe all enemies + boss damage

    export interface Stats {
        index: number          // Position in the config array (0..n)
        name: string
        faction: gs.Faction
        unlockLevel: number    // From which level this ship is unlocked (1 = start)
        speed: number          // controller.moveSprite speed
        maxHp: number          // Shield or armor
        hpType: number         // 0 = shield (regen), 1 = armor (no regen)
        fireCooldownMs: number
        bolts: number          // Number of parallel laser bolts
        boltVel: number        // Bolt velocity
        damage: number         // Damage per bolt
        boltColor: number      // 2=red 7=green (laser color)
        offensiveLabel: string // Label for the offensive upgrade
        // === SPECIAL (B button) ===
        specialType: number    // SPECIAL_WEAPON/REPAIR/REPAIR_BOOST/SEISMIC
        specialCooldownMs: number
        specialPower: number   // Heal amount (repair) or damage (weapon)
        specialCount: number   // Projectile count for weapon
        specialLabel: string   // HUD short label ("Rep", "Torp", "Miss", "Bomb", "Seism")
    }

    // Alliance ships (faction = 0)
    // Dominion ships (faction = 1)
    // Important: index 0 must be the starter ship for each faction (Falcon-A / Sabre-I).
    export const config: Stats[] = [
        // === ALLIANCE ===
        { index: 0, name: "Falcon-A",   faction: gs.Faction.Alliance, unlockLevel: 1,  speed: 90,  maxHp: 100, hpType: 0, fireCooldownMs: 220, bolts: 4, boltVel: 180, damage: 1, boltColor: 2, offensiveLabel: "Faster Lasers",
            specialType: SPECIAL_REPAIR, specialCooldownMs: 7000, specialPower: 30, specialCount: 0, specialLabel: "Rep" },
        { index: 1, name: "Scout-R",    faction: gs.Faction.Alliance, unlockLevel: 3,  speed: 140, maxHp: 60,  hpType: 0, fireCooldownMs: 160, bolts: 2, boltVel: 220, damage: 1, boltColor: 2, offensiveLabel: "+1 Laser",
            specialType: SPECIAL_REPAIR_BOOST, specialCooldownMs: 6000, specialPower: 20, specialCount: 0, specialLabel: "Bst" },
        { index: 2, name: "Hammer-B",   faction: gs.Faction.Alliance, unlockLevel: 5,  speed: 65,  maxHp: 160, hpType: 0, fireCooldownMs: 280, bolts: 2, boltVel: 160, damage: 2, boltColor: 2, offensiveLabel: "+1 Damage",
            specialType: SPECIAL_WEAPON, specialCooldownMs: 3500, specialPower: 3, specialCount: 2, specialLabel: "Trp" },
        { index: 3, name: "Cross-B",    faction: gs.Faction.Alliance, unlockLevel: 7,  speed: 75,  maxHp: 130, hpType: 0, fireCooldownMs: 260, bolts: 3, boltVel: 170, damage: 2, boltColor: 2, offensiveLabel: "+1 Torpedo",
            specialType: SPECIAL_WEAPON, specialCooldownMs: 4000, specialPower: 3, specialCount: 3, specialLabel: "Trp" },
        { index: 4, name: "Vanguard-E", faction: gs.Faction.Alliance, unlockLevel: 9,  speed: 105, maxHp: 120, hpType: 0, fireCooldownMs: 200, bolts: 3, boltVel: 200, damage: 2, boltColor: 2, offensiveLabel: "+1 Missile",
            specialType: SPECIAL_WEAPON, specialCooldownMs: 3000, specialPower: 4, specialCount: 1, specialLabel: "Mis" },
        { index: 5, name: "Wayfarer",   faction: gs.Faction.Alliance, unlockLevel: 11, speed: 100, maxHp: 220, hpType: 0, fireCooldownMs: 180, bolts: 4, boltVel: 200, damage: 2, boltColor: 2, offensiveLabel: "Faster Quads",
            specialType: SPECIAL_REPAIR, specialCooldownMs: 8000, specialPower: 50, specialCount: 0, specialLabel: "Rep" },
        // === DOMINION ===
        { index: 6, name: "Sabre-I",    faction: gs.Faction.Dominion, unlockLevel: 1, speed: 100, maxHp: 150, hpType: 1, fireCooldownMs: 200, bolts: 3, boltVel: 180, damage: 1, boltColor: 7, offensiveLabel: "Faster Lasers",
            specialType: SPECIAL_REPAIR, specialCooldownMs: 7000, specialPower: 30, specialCount: 0, specialLabel: "Rep" },
        { index: 7, name: "Mauler-I",   faction: gs.Faction.Dominion, unlockLevel: 3, speed: 65,  maxHp: 220, hpType: 1, fireCooldownMs: 280, bolts: 2, boltVel: 160, damage: 2, boltColor: 7, offensiveLabel: "+1 Damage",
            specialType: SPECIAL_WEAPON, specialCooldownMs: 4000, specialPower: 4, specialCount: 2, specialLabel: "Bmb" },
        { index: 8, name: "Razor-I",    faction: gs.Faction.Dominion, unlockLevel: 5, speed: 150, maxHp: 110, hpType: 1, fireCooldownMs: 160, bolts: 4, boltVel: 220, damage: 1, boltColor: 7, offensiveLabel: "Faster Lasers",
            specialType: SPECIAL_REPAIR_BOOST, specialCooldownMs: 6000, specialPower: 25, specialCount: 0, specialLabel: "Bst" },
        { index: 9, name: "Aegis-I",    faction: gs.Faction.Dominion, unlockLevel: 7, speed: 115, maxHp: 240, hpType: 1, fireCooldownMs: 200, bolts: 4, boltVel: 200, damage: 2, boltColor: 7, offensiveLabel: "+1 Missile",
            specialType: SPECIAL_WEAPON, specialCooldownMs: 3000, specialPower: 4, specialCount: 2, specialLabel: "Mis" },
        { index: 10,name: "Bounty-I",   faction: gs.Faction.Dominion, unlockLevel: 11, speed: 95,  maxHp: 250, hpType: 1, fireCooldownMs: 180, bolts: 4, boltVel: 200, damage: 2, boltColor: 7, offensiveLabel: "Faster Cannons",
            specialType: SPECIAL_SEISMIC, specialCooldownMs: 8000, specialPower: 25, specialCount: 0, specialLabel: "Sei" }
    ]

    // Index helpers
    export const ALLIANCE_FIRST = 0
    export const ALLIANCE_COUNT = 6
    export const DOMINION_FIRST = 6
    export const DOMINION_COUNT = 5

    export function firstFor(faction: gs.Faction): number {
        return faction == gs.Faction.Alliance ? ALLIANCE_FIRST : DOMINION_FIRST
    }
    export function countFor(faction: gs.Faction): number {
        return faction == gs.Faction.Alliance ? ALLIANCE_COUNT : DOMINION_COUNT
    }

    // Ship index WITHIN the faction (0..5 for Alliance, 0..4 for Dominion) -> global index
    export function globalIndex(faction: gs.Faction, factionShipIdx: number): number {
        return firstFor(faction) + factionShipIdx
    }

    // Global index -> faction-relative index
    export function factionIndex(globalIdx: number): number {
        const s = config[globalIdx]
        return globalIdx - firstFor(s.faction)
    }

    export function current(): Stats {
        return config[gs.shipId]
    }

    // Effective stats after upgrades
    export function effectiveMaxShield(): number {
        const s = current()
        if (s.hpType != 0) return 0
        return s.maxHp + gs.upgradeShieldBonus
    }
    export function effectiveMaxArmor(): number {
        const s = current()
        if (s.hpType != 1) return 0
        return s.maxHp + gs.upgradeArmorBonus
    }
    export function effectiveFireCooldown(): number {
        return Math.max(80, current().fireCooldownMs - gs.upgradeFireCooldownReduction)
    }
    export function effectiveBolts(): number {
        return current().bolts + gs.upgradeExtraBolts
    }
    export function effectiveDamage(): number {
        return current().damage + gs.upgradeDamageBonus
    }

    // Special cooldown status: 0..1 (1 = ready, 0 = just fired)
    export function specialReadyFraction(): number {
        const stats = current()
        const elapsed = game.runtime() - gs.lastSpecialUseMs
        const f = elapsed / stats.specialCooldownMs
        return Math.min(1, Math.max(0, f))
    }

    export function isSpecialReady(): boolean {
        return specialReadyFraction() >= 1
    }
}
