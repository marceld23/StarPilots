// Sprite art for StarPilots fighters.
// All ships are 24x24, bosses 48x32, asteroids 16x16, lasers 4x8.
// You can visually edit these sprites in the VS Code Asset Explorer.

namespace art {

    // ====== Player ships (nose pointing up) ======

    // Falcon-A (Alliance starter) - top-down view, delta-wing interceptor.
    // Long nose with blue cockpit bubble + red markings, single pair of swept-back
    // wings forming a solid arrowhead, twin cannons at the wing tips, twin engines
    // at the stern.
    export const falconAPlayer = img`
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 2 2 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 . . . . . .
        . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . . .
        . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . .
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . .
        . . 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 .
        . . . . . . . . 1 1 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 4 4 1 1 4 4 . . . . . . . .
        . . . . . . . . . . 4 5 5 5 5 4 . . . . . . . .
        . . . . . . . . . . . 4 5 5 4 . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Dominion Sabre-I - central armored cockpit with short angled wing-stubs.
    // Gray (palette-b) hull with black outline (f). The full-height side panels of
    // the previous design have been replaced with compact lateral wings that no
    // longer dominate the silhouette.
    export const sabreIPlayer = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . f f . . . . . . . . . . .
        . . . . . . . . . . f b b f . . . . . . . . . .
        . . . . . . . . . f b b b b f . . . . . . . . .
        . . . . . . . . f b b b b b b f . . . . . . . .
        . . . . . . . . f b 1 1 1 1 b f . . . . . . . .
        . . . . . . . . f 1 1 b b 1 1 f . . . . . . . .
        f f b b b b f f f 1 1 b b 1 1 f f f b b b b f f
        f f f f b b b f f 1 1 b b 1 1 f f b b b f f f f
        . f f f f f b b f 1 1 b b 1 1 f b b f f f f f .
        . . f f f f f b f 1 1 b b 1 1 f b f f f f f . .
        . . . . f f f f f 1 1 b b 1 1 f f f f f . . . .
        . . . . . . . . f 1 1 b b 1 1 f . . . . . . . .
        . . . . . . . . f b 1 1 1 1 b f . . . . . . . .
        . . . . . . . . f b b b b b b f . . . . . . . .
        . . . . . . . . . f b b b b f . . . . . . . . .
        . . . . . . . . . . f b b f . . . . . . . . . .
        . . . . . . . . . . . f f . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // ====== Enemies (Dominion) - when the player flies a Falcon-A ======
    // These face downward (nose pointing down).

    // Same silhouette as the player Sabre-I (the new design is symmetric, so no
    // vertical mirror is needed). Kept as a separate export so callers can
    // continue to distinguish player-side from enemy-side draws.
    export const enemySabreI = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . f f . . . . . . . . . . .
        . . . . . . . . . . f b b f . . . . . . . . . .
        . . . . . . . . . f b b b b f . . . . . . . . .
        . . . . . . . . f b b b b b b f . . . . . . . .
        . . . . . . . . f b 1 1 1 1 b f . . . . . . . .
        . . . . . . . . f 1 1 b b 1 1 f . . . . . . . .
        f f b b b b f f f 1 1 b b 1 1 f f f b b b b f f
        f f f f b b b f f 1 1 b b 1 1 f f b b b f f f f
        . f f f f f b b f 1 1 b b 1 1 f b b f f f f f .
        . . f f f f f b f 1 1 b b 1 1 f b f f f f f . .
        . . . . f f f f f 1 1 b b 1 1 f f f f f . . . .
        . . . . . . . . f 1 1 b b 1 1 f . . . . . . . .
        . . . . . . . . f b 1 1 1 1 b f . . . . . . . .
        . . . . . . . . f b b b b b b f . . . . . . . .
        . . . . . . . . . f b b b b f . . . . . . . . .
        . . . . . . . . . . f b b f . . . . . . . . . .
        . . . . . . . . . . . f f . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Sprite is not strictly symmetric (cockpit on top) - used both as the Dominion player
    // ship (cockpit/front on top, engine glow on bottom) and as an enemy.
    export const enemyMaulerI = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        f f f f . . . . . . . . . . . . . . . . f f f f
        f b b f . . . . . f f f f f f . . . . . f b b f
        f b b f . . . . f b b b b b b f . . . . f b b f
        f b b f . . . f b b 1 1 1 1 b b f . . . f b b f
        f b b f . . f b b 1 1 b b 1 1 b b f . . f b b f
        f b b f f f f b 1 1 b 9 9 b 1 1 b f f f f b b f
        f b b b b b b b 1 1 b b b b 1 1 b b b b b b b f
        f b b b b b b b 1 1 1 1 1 1 1 1 b b b b b b b f
        f b b f f f f b 1 1 1 1 1 1 1 1 b f f f f b b f
        f b b f . . f b b 1 1 1 1 1 1 b b f . . f b b f
        f b b f . . . f b b 1 1 1 1 b b f . . . f b b f
        f b b f . . . . f b b 1 1 b b f . . . . f b b f
        f b b f . . . . . f b b b b f . . . . . f b b f
        f b b f . . . . . . f b b f . . . . . . f b b f
        f b b f . . . . . . . f f . . . . . . . f b b f
        f b b f . . . . . . . . . . . . . . . . f b b f
        f 5 5 f . . . . . . . . . . . . . . . . f 5 5 f
        f 4 4 f . . . . . . . . . . . . . . . . f 4 4 f
        f 5 5 f . . . . . . . . . . . . . . . . f 5 5 f
        f f f f . . . . . . . . . . . . . . . . f f f f
        . 4 4 . . . . . . . . . . . . . . . . . . 4 4 .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Lower solar panel with engine glow (yellow/orange) - marks the back
    // (stern) when the ship is used as a Dominion player ship (flying upward).
    export const enemyAegisI = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . f f . . . . . . . . . . .
        . . . . . . . . . . f b b f . . . . . . . . . .
        . . . . . . . . . f b b b b f . . . . . . . . .
        b b . . . . . . f b 1 1 1 1 b f . . . . . . b b
        b b b . . . . f b 1 1 b b 1 1 b f . . . . b b b
        f b b b . . f b 1 1 b 9 9 b 1 1 b f . . b b b f
        f f b b b . f b 1 1 1 1 1 1 1 1 b f . b b b f f
        f f f b b b f b 1 1 1 1 1 1 1 1 b f b b b f f f
        b f f f b b f b 1 1 1 1 1 1 1 1 b f b b f f f b
        b b f f f f . f b b 1 1 1 1 b b f . f f f f b b
        b b b f f f . . f b b b b b b f . . f f f b b b
        b b b f f f . . . f b b b b f . . . f f f b b b
        b b f f f f . f b b 1 1 1 1 b b f . f f f f b b
        b f f f b b f b 1 1 1 1 1 1 1 1 b f b b f f f b
        f f f b b b f b 1 1 1 1 1 1 1 1 b f b b b f f f
        f f b b b . f b 1 1 1 1 1 1 1 1 b f . b b b f f
        f b b b . . f b 1 1 b b b b 1 1 b f . . b b b f
        b b b . . . . f b 1 1 b b 1 1 b f . . . . b b b
        b b . . . . . . f b 1 1 1 1 b f . . . . . . b b
        . . . . . . . . . f 5 5 5 5 f . . . . . . . . .
        . . . . . . . . . . f 4 4 f . . . . . . . . . .
        . . . . . . . . . . . 4 4 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // ====== Enemies (Alliance) - when the player flies a Sabre-I ======

    // Alliance Falcon-A as enemy (player = Sabre-I). Same delta-wing silhouette
    // as the player Falcon-A, but vertically mirrored (nose points DOWN toward
    // the player).
    export const enemyFalconA = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . 4 5 5 4 . . . . . . . . .
        . . . . . . . . . . 4 5 5 5 5 4 . . . . . . . .
        . . . . . . . . . . 4 4 1 1 4 4 . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 . . . . . . . . . .
        . . 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 .
        . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . .
        . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . .
        . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . . .
        . . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 . . . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 2 2 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Vertically mirrored: engines on top (= rear), cockpit on bottom (= front toward player).
    export const enemyScoutR = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . f 5 5 f . . . . . . . . . .
        . . . . . . . . . f 5 5 5 5 f . . . . . . . . .
        . . . . . . . . f 5 5 5 5 5 5 f . . . . . . . .
        . . . . . . . f 4 5 5 4 4 5 5 4 f . . . . . . .
        . f f f f . . f 4 4 4 1 1 4 4 4 f . . f f f f .
        f e e e e e f 1 1 1 1 1 1 1 1 1 1 f e e e e e f
        f f e e e e 1 1 1 1 1 1 1 1 1 1 1 1 e e e e f f
        . f f e e 1 1 1 1 1 1 1 1 1 1 1 1 1 1 e e f f .
        . . f f e 1 2 1 1 1 1 1 1 1 1 1 1 2 1 e f f . .
        . . . f f 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f f . . .
        . . . . f 1 1 1 1 1 1 1 1 1 1 1 1 1 1 f . . . .
        . . . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . . .
        . . . . . . 1 1 2 1 1 1 1 1 1 2 1 1 . . . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . . . 1 e e e e 1 . . . . . . . . .
        . . . . . . . . . 1 1 9 9 1 1 . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 2 2 1 . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 5 4 4 5 . . . . . . . . . .
        . . . . . . . . . . . 5 5 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Vertically mirrored: engines on top, cockpit on bottom (facing the player).
    export const enemyCrossB = img`
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . 5 5 . . . . . . . . . . .
        . . . . . . . . . . f 5 5 f . . . . . . . . . .
        . . . . . . . . . f 5 5 5 5 f . . . . . . . . .
        . . . . . . . . . f 4 5 5 4 f . . . . . . . . .
        . . . . . . . . . f 1 1 1 1 f . . . . . . . . .
        . . . . . . . . . f 2 1 1 2 f . . . . . . . . .
        . . . . . . . . . f 1 1 1 1 f . . . . . . . . .
        . . . . . . . . . f e 1 1 e f . . . . . . . . .
        f f f f f f f f f f e 1 1 e f f f f f f f f f f
        f e 1 1 1 1 1 e e f 1 1 1 1 f e e 1 1 1 1 1 e f
        f e e e e e e e e f e 1 1 e f e e e e e e e e f
        f f f f f f f f f f e 1 1 e f f f f f f f f f f
        . . . . . . . . . f 1 1 1 1 f . . . . . . . . .
        . . . . . . . . . f 2 1 1 2 f . . . . . . . . .
        . . . . . . . . . f 1 1 1 1 f . . . . . . . . .
        . . . . . . . . . f e 1 1 e f . . . . . . . . .
        . . . . . . . . . f e 1 1 e f . . . . . . . . .
        . . . . . . . . . . f 9 9 f . . . . . . . . . .
        . . . . . . . . . . f e e f . . . . . . . . . .
        . . . . . . . . . . f 1 1 f . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // ====== Bosses (programmatically generated, guaranteed consistent dimensions) ======
    // Created lazily on first access and cached.

    let _bossDreadnought: Image = null as any
    let _bossRazorSquadron: Image = null as any
    let _bossCrescent: Image = null as any
    let _bossLeviathan: Image = null as any

    function buildDreadnought(): Image {
        // Dreadnought (Imperial-class) in top-down view.
        // BOW (tip) points DOWN toward the player; stern with engines on top.
        // Distinctive features: wedge shape, bridge tower, TWO shield domes, 3 large engines.
        const w = 48, h = 32
        const im = image.create(w, h)
        const cx = w / 2  // 24

        // === Wedge-shaped hull ===
        // Stern (row 0-3) wide, then tapering to the bow tip (row h-1)
        const sternStartY = 4
        const bowY = h - 1
        for (let y = sternStartY; y <= bowY; y++) {
            const t = (y - sternStartY) / (bowY - sternStartY)  // 0 at the stern, 1 at the bow
            const halfW = Math.max(1, Math.floor((1 - t) * (w / 2 - 2)))
            if (halfW > 0) {
                // Inner surface gray (palette index 11 = #a4839f, "battleship gray")
                im.fillRect(cx - halfW, y, halfW * 2, 1, 11)
                // Black outline
                im.setPixel(cx - halfW, y, 15)
                im.setPixel(cx + halfW - 1, y, 15)
            }
        }
        // Stern block (top section is rectangular and wide)
        for (let y = 0; y < sternStartY; y++) {
            const halfW = w / 2 - 2
            im.fillRect(cx - halfW, y, halfW * 2, 1, 11)
            im.setPixel(cx - halfW, y, 15)
            im.setPixel(cx + halfW - 1, y, 15)
        }

        // === Three large main engines at the stern (row 0-2) ===
        // 3 large round engines + 2 smaller ones
        const engineSpacing = 8
        const enginePositions = [cx - engineSpacing, cx, cx + engineSpacing]
        for (const ex of enginePositions) {
            // Outer ring (orange)
            im.fillRect(ex - 2, 0, 5, 3, 4)
            // Inner ring (yellow)
            im.fillRect(ex - 1, 0, 3, 2, 5)
            // Core (light yellow / white)
            im.setPixel(ex, 0, 1)
        }
        // Two smaller engines between the large ones
        for (const ex of [cx - 4, cx + 4]) {
            im.fillRect(ex - 1, 0, 2, 2, 4)
            im.setPixel(ex, 0, 5)
        }

        // === Bridge tower in the rear third ===
        // Position: roughly y=8 to y=14, centered
        const towerX = cx - 4
        const towerY = 8
        const towerW = 8
        const towerH = 7
        // Tower base (lighter than the hull)
        im.fillRect(towerX, towerY, towerW, towerH, 1)
        im.drawRect(towerX, towerY, towerW, towerH, 15)
        // Window rows on the bridge
        for (let r = 0; r < 3; r++) {
            const fy = towerY + 2 + r * 2
            for (let fc = 0; fc < 3; fc++) {
                im.setPixel(towerX + 2 + fc * 2, fy, 9)
            }
        }

        // === TWO shield domes (sensor domes) on the tower ===
        // Very distinctive! Two small spheres atop the bridge tower
        const domeY = towerY - 2
        // Left dome
        im.fillRect(cx - 5, domeY, 3, 2, 1)
        im.setPixel(cx - 4, domeY + 1, 8)
        im.setPixel(cx - 5, domeY + 1, 15)
        im.setPixel(cx - 3, domeY + 1, 15)
        // Right dome
        im.fillRect(cx + 2, domeY, 3, 2, 1)
        im.setPixel(cx + 3, domeY + 1, 8)
        im.setPixel(cx + 2, domeY + 1, 15)
        im.setPixel(cx + 4, domeY + 1, 15)
        // Antennas / sensors on top of the domes
        im.setPixel(cx - 4, domeY - 1, 1)
        im.setPixel(cx + 3, domeY - 1, 1)

        // === Hangar bay (line beneath the bridge tower) ===
        // Dark stripe along the underside of the tower
        im.fillRect(towerX + 1, towerY + towerH, towerW - 2, 1, 15)

        // === Deck details: line markings on the hull ===
        // Small bright dots = windows/lights along the hull
        for (let y = 16; y < 26; y += 3) {
            const t = (y - sternStartY) / (bowY - sternStartY)
            const halfW = Math.max(1, Math.floor((1 - t) * (w / 2 - 2)))
            // Center stripe
            im.setPixel(cx, y, 5)
            // Port/starboard rows
            for (let dx = -halfW + 2; dx <= halfW - 2; dx += 5) {
                im.setPixel(cx + dx, y, 5)
            }
        }

        // === Bow detail: reinforcement at the tip ===
        im.setPixel(cx, bowY - 1, 15)
        im.setPixel(cx - 1, bowY - 1, 15)

        return im
    }

    function buildRazorSquadron(): Image {
        const w = 48, h = 24
        const im = image.create(w, h)
        // Four small Sabre-I fighters side by side
        const offsets = [3, 14, 25, 36]
        for (const ox of offsets) {
            // Left wing (hexagon)
            im.fillRect(ox, 4, 2, 6, 15)
            im.fillRect(ox + 1, 3, 2, 8, 11)
            im.setPixel(ox + 1, 2, 15)
            im.setPixel(ox + 1, 11, 15)
            // Right wing
            im.fillRect(ox + 7, 4, 2, 6, 15)
            im.fillRect(ox + 6, 3, 2, 8, 11)
            im.setPixel(ox + 7, 2, 15)
            im.setPixel(ox + 7, 11, 15)
            // Connecting beam
            im.fillRect(ox + 3, 6, 3, 2, 11)
            // Cockpit
            im.fillRect(ox + 3, 5, 3, 4, 1)
            im.setPixel(ox + 4, 6, 9)
        }
        return im
    }

    function buildCrescent(): Image {
        const w = 48, h = 30
        const im = image.create(w, h)
        const cx = w / 2
        // Upper sensor tower
        im.fillRect(cx - 1, 0, 2, 6, 1)
        im.fillRect(cx - 2, 6, 4, 2, 12)  // tan
        // Upper outrigger element
        im.fillRect(cx - 6, 8, 12, 3, 12)
        im.fillRect(cx - 5, 9, 10, 1, 1)
        // Vertical main body (long)
        im.fillRect(cx - 1, 11, 2, 10, 12)
        im.fillRect(cx - 1, 11, 2, 10, 12)
        // Lower main module (habitation section)
        im.fillRect(cx - 5, 20, 10, 6, 12)
        im.fillRect(cx - 4, 21, 8, 4, 1)
        // Window rows
        for (let i = 0; i < 4; i++) {
            im.setPixel(cx - 3 + i * 2, 22, 9)
            im.setPixel(cx - 3 + i * 2, 24, 9)
        }
        // Engine at the rear
        im.fillRect(cx - 3, 26, 6, 1, 4)
        im.fillRect(cx - 2, 27, 4, 1, 5)
        // Outline
        im.drawRect(cx - 5, 20, 10, 6, 15)
        im.drawRect(cx - 6, 8, 12, 3, 15)
        return im
    }

    function buildLeviathan(): Image {
        const w = 48, h = 26
        const im = image.create(w, h)
        const cy = h / 2
        // Elongated oval hull
        for (let y = 2; y < h - 2; y++) {
            const dy = y - cy
            const ratio = Math.max(0, 1 - (dy * dy) / (cy * cy))
            const ihw = (Math.sqrt(ratio) * (w / 2 - 2)) | 0
            if (ihw > 0) {
                im.fillRect(w / 2 - ihw, y, ihw * 2, 1, 12)  // tan hull
                im.setPixel(w / 2 - ihw, y, 15)
                im.setPixel(w / 2 + ihw - 1, y, 15)
            }
        }
        // Dome bumps on top
        for (let i = 0; i < 5; i++) {
            const x = 8 + i * 7
            im.fillRect(x, cy - 5, 4, 2, 1)
            im.setPixel(x + 1, cy - 4, 9)
        }
        // Engines at the rear (right)
        im.fillRect(w - 3, cy - 1, 3, 1, 5)
        im.fillRect(w - 2, cy, 2, 1, 4)
        // Bridge tower at the front
        im.fillRect(4, cy - 3, 3, 2, 1)
        return im
    }

    // ====== Additional bosses ======
    let _bossGravitron: Image = null as any
    let _bossEnvoy: Image = null as any
    let _bossComet: Image = null as any
    let _bossForktail: Image = null as any
    let _bossCitadel: Image = null as any

    function buildGravitron(): Image {
        // Gravitron cruiser - Dreadnought shape + 4 gravity globe towers
        const w = 48, h = 32
        const im = image.create(w, h)
        const cx = w / 2
        const sternStartY = 4
        const bowY = h - 1
        // Wedge shape (like Dreadnought)
        for (let y = sternStartY; y <= bowY; y++) {
            const t = (y - sternStartY) / (bowY - sternStartY)
            const halfW = Math.max(1, Math.floor((1 - t) * (w / 2 - 2)))
            if (halfW > 0) {
                im.fillRect(cx - halfW, y, halfW * 2, 1, 11)
                im.setPixel(cx - halfW, y, 15)
                im.setPixel(cx + halfW - 1, y, 15)
            }
        }
        for (let y = 0; y < sternStartY; y++) {
            const halfW = w / 2 - 2
            im.fillRect(cx - halfW, y, halfW * 2, 1, 11)
            im.setPixel(cx - halfW, y, 15)
            im.setPixel(cx + halfW - 1, y, 15)
        }
        // Engines
        for (const ex of [cx - 8, cx, cx + 8]) {
            im.fillRect(ex - 1, 0, 3, 2, 4)
            im.setPixel(ex, 0, 5)
        }
        // 4 gravity globe towers (the distinctive feature)
        const globePositions = [
            { x: cx - 14, y: 12 },
            { x: cx + 14, y: 12 },
            { x: cx - 10, y: 20 },
            { x: cx + 10, y: 20 }
        ]
        for (const gp of globePositions) {
            // Mast
            im.fillRect(gp.x, gp.y, 1, 3, 15)
            // Globe (sphere)
            im.fillRect(gp.x - 1, gp.y + 3, 3, 3, 9)
            im.setPixel(gp.x, gp.y + 4, 8)
            im.setPixel(gp.x - 1, gp.y + 3, 15)
            im.setPixel(gp.x + 1, gp.y + 3, 15)
            im.setPixel(gp.x - 1, gp.y + 5, 15)
            im.setPixel(gp.x + 1, gp.y + 5, 15)
        }
        // Bridge tower in the middle
        im.fillRect(cx - 3, 8, 6, 6, 1)
        im.drawRect(cx - 3, 8, 6, 6, 15)
        return im
    }

    function buildEnvoy(): Image {
        // Envoy-class Shuttle - 3 wings: 1 on top, 2 folded down
        const w = 40, h = 36
        const im = image.create(w, h)
        const cx = w / 2
        // Main body (rectangular, in the middle)
        im.fillRect(cx - 4, 6, 8, 20, 11)
        im.drawRect(cx - 4, 6, 8, 20, 15)
        // Cockpit window (bow at the bottom = where the player is looking)
        im.fillRect(cx - 3, 22, 6, 3, 9)
        // Upper wing (central fin on top)
        // Very long vertical "sword" pointing up
        im.fillRect(cx - 1, 0, 2, 8, 11)
        im.fillRect(cx - 2, 0, 4, 3, 11)
        im.setPixel(cx - 2, 0, 15)
        im.setPixel(cx + 1, 0, 15)
        im.drawRect(cx - 1, 0, 2, 8, 15)
        // Lower wings (V-shape, folded)
        // Left lower wing
        for (let i = 0; i < 12; i++) {
            const x = cx - 5 - i
            const y = 14 + i
            if (x >= 0 && y < h) {
                im.setPixel(x, y, 11)
                im.setPixel(x, y + 1, 11)
                im.setPixel(x, y + 2, 15)
            }
        }
        // Right lower wing
        for (let i = 0; i < 12; i++) {
            const x = cx + 4 + i
            const y = 14 + i
            if (x < w && y < h) {
                im.setPixel(x, y, 11)
                im.setPixel(x, y + 1, 11)
                im.setPixel(x, y + 2, 15)
            }
        }
        // Engines at the rear (top)
        im.fillRect(cx - 3, 4, 2, 2, 4)
        im.fillRect(cx + 1, 4, 2, 2, 4)
        return im
    }

    function buildComet(): Image {
        // Comet Corvette (blockade runner) - long slender hull + engine cluster at the rear
        const w = 48, h = 22
        const im = image.create(w, h)
        const cy = h / 2
        // Main body (elongated, slightly narrower at the front)
        for (let x = 4; x < w - 8; x++) {
            const t = x / (w - 8)
            const halfH = 2 + Math.floor(t * 3)  // widens toward the rear
            im.fillRect(x, cy - halfH, 1, halfH * 2, 1)
            im.setPixel(x, cy - halfH, 15)
            im.setPixel(x, cy + halfH - 1, 15)
        }
        // Bridge module (front, bottom)
        im.fillRect(8, cy - 4, 5, 2, 1)
        im.setPixel(10, cy - 3, 9)
        // Red stripes along the hull
        for (let x = 12; x < w - 12; x += 4) {
            im.setPixel(x, cy - 1, 2)
            im.setPixel(x, cy + 1, 2)
        }
        // Engine cluster at the rear (characteristic round 11-engine arrangement, simplified to 6)
        const enginesX = w - 6
        for (let i = 0; i < 3; i++) {
            const ey = cy - 4 + i * 4
            im.fillRect(enginesX, ey, 4, 3, 9)       // light blue glow
            im.fillRect(enginesX + 1, ey + 1, 2, 1, 1)  // white core
        }
        return im
    }

    function buildForktail(): Image {
        // Forktail Corvette - "fork" at the front (wide), narrow at the rear
        const w = 36, h = 36
        const im = image.create(w, h)
        const cx = w / 2
        // Narrow stern hull
        im.fillRect(cx - 2, 0, 4, 18, 12)
        im.drawRect(cx - 2, 0, 4, 18, 15)
        // Engines at the rear (top)
        im.fillRect(cx - 2, 0, 1, 2, 4)
        im.fillRect(cx + 1, 0, 1, 2, 4)
        // "Forktail" - wide fork at the front (bottom)
        im.fillRect(cx - 12, 22, 24, 8, 12)
        im.drawRect(cx - 12, 22, 24, 8, 15)
        // Center rail between stern and hammerhead
        im.fillRect(cx - 1, 18, 2, 4, 12)
        // Bridge
        im.fillRect(cx - 3, 24, 6, 4, 1)
        im.setPixel(cx - 1, 26, 9)
        im.setPixel(cx, 26, 9)
        // Tips of the fork (bow sensors)
        im.setPixel(cx - 12, 22, 1)
        im.setPixel(cx - 11, 21, 1)
        im.setPixel(cx + 12, 22, 1)
        im.setPixel(cx + 11, 21, 1)
        return im
    }

    function buildCitadel(): Image {
        // Citadel Sphere - planetary battle station with ribbed hull plates and
        // scattered weapon turrets. No continuous equator and no concave dish:
        // the silhouette reads as a generic armored sphere rather than the
        // famous moon-sized station.
        const w = 64, h = 64
        const im = image.create(w, h)
        const cx = 32, cy = 32, r = 30
        // Fill (circle)
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const dx = x - cx
                const dy = y - cy
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist <= r - 1) {
                    im.setPixel(x, y, 11)  // mostly gray
                }
            }
        }
        // Outline (black ring)
        for (let ang = 0; ang < Math.PI * 2; ang += 0.02) {
            const x = (cx + Math.cos(ang) * r) | 0
            const y = (cy + Math.sin(ang) * r) | 0
            if (x >= 0 && x < w && y >= 0 && y < h) {
                im.setPixel(x, y, 15)
            }
        }
        // Hull-plate seams at multiple latitudes (NOT a continuous equator).
        // Each band has a central gap so the lines don't read as one stripe.
        const seamRows = [cy - 18, cy - 9, cy + 6, cy + 16]
        for (const sy of seamRows) {
            for (let x = 2; x < w - 2; x++) {
                if (x > cx - 6 && x < cx + 6) continue   // gap in the centre
                const dx = x - cx
                const dy = sy - cy
                if (dx * dx + dy * dy < (r - 2) * (r - 2)) {
                    im.setPixel(x, sy, 12)
                }
            }
        }
        // Turret bumps: small darker squares with bright centres, scattered
        // across the sphere (no single dominant feature).
        const turrets = [
            { x: cx - 14, y: cy - 5 },
            { x: cx + 11, y: cy - 12 },
            { x: cx + 14, y: cy + 8 },
            { x: cx - 7, y: cy + 13 },
            { x: cx - 17, y: cy + 3 },
            { x: cx + 4, y: cy - 18 }
        ]
        for (const t of turrets) {
            const dx = t.x - cx, dy = t.y - cy
            if (dx * dx + dy * dy < (r - 3) * (r - 3)) {
                im.fillRect(t.x - 1, t.y - 1, 3, 3, 12)
                im.setPixel(t.x, t.y, 5)
            }
        }
        // Surface lights scattered across the hull
        for (let i = 0; i < 30; i++) {
            const ang = i * 1.7
            const rr = 5 + (i % 4) * 5
            const x = (cx + Math.cos(ang) * rr) | 0
            const y = (cy + Math.sin(ang) * rr) | 0
            if (x >= 0 && x < w && y >= 0 && y < h && im.getPixel(x, y) == 11) {
                im.setPixel(x, y, 1)
            }
        }
        return im
    }

    export function bossGravitron(): Image {
        if (!_bossGravitron) _bossGravitron = buildGravitron()
        return _bossGravitron
    }
    export function bossEnvoy(): Image {
        if (!_bossEnvoy) _bossEnvoy = buildEnvoy()
        return _bossEnvoy
    }
    export function bossComet(): Image {
        if (!_bossComet) _bossComet = buildComet()
        return _bossComet
    }
    export function bossForktail(): Image {
        if (!_bossForktail) _bossForktail = buildForktail()
        return _bossForktail
    }
    export function bossCitadel(): Image {
        if (!_bossCitadel) _bossCitadel = buildCitadel()
        return _bossCitadel
    }

    export function bossDreadnought(): Image {
        if (!_bossDreadnought) _bossDreadnought = buildDreadnought()
        return _bossDreadnought
    }
    export function bossRazorSquadron(): Image {
        if (!_bossRazorSquadron) _bossRazorSquadron = buildRazorSquadron()
        return _bossRazorSquadron
    }
    export function bossCrescent(): Image {
        if (!_bossCrescent) _bossCrescent = buildCrescent()
        return _bossCrescent
    }
    export function bossLeviathan(): Image {
        if (!_bossLeviathan) _bossLeviathan = buildLeviathan()
        return _bossLeviathan
    }

    // ====== Asteroids + rescue objects (Guardian/Shadow on rock chunks) ======

    export const asteroid = img`
        . . . . . d d d c c . . . . . .
        . . . d d c c d d d c . . . . .
        . . d c c c d d c c d d . . . .
        . d c d d c c c c c d c d . . .
        d c c c d d c c d d d c c d . .
        d c d d c c c d d c c c c c d .
        c c d d c c d d c c c d d c c c
        c d c c c d d c c d d c c d c c
        c d c d d c c c c c c c c c c c
        d c c c c c d d c c c c d d c c
        d c d d c c c c c d d c c c c d
        c c d d c c c d d c c c c d d c
        . d c c c d d c c c c c c c d .
        . . d c c c c c c c d d c d . .
        . . . d d c c d d c c c d . . .
        . . . . . d d d c c d . . . . .
    `

    // Guardian on a rock chunk - smaller stone, prominent figure with blue plasma blade.
    // The "8 8" around the body forms a glowing halo so it's clearly recognizable.
    export const asteroidGuardian = img`
        . . . . . . . 8 . . . . . . . .
        . . . . . . . 8 . . . . . . . .
        . . . . . . . 8 . . . . . . . .
        . . . . . . . 8 . . . . . . . .
        . . . . 8 8 . 8 . 8 8 . . . . .
        . . . . . 8 . 1 . 8 . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . . 1 1 1 . . . . . . .
        . . . . . 1 1 1 1 1 . . . . . .
        . . . . d 1 1 1 1 1 d . . . . .
        . . . d c 1 1 1 1 1 c d . . . .
        . . d c d c c c c c d c d . . .
        . d c d c d d c c d c d c d . .
        . . d c c c d d c c c c d . . .
        . . . d d c c d d c c d . . . .
        . . . . . d d c c d . . . . . .
    `

    // Shadow on a rock chunk - red plasma blade, dark cloak, red halo.
    export const asteroidShadow = img`
        . . . . . . . 2 . . . . . . . .
        . . . . . . . 2 . . . . . . . .
        . . . . . . . 2 . . . . . . . .
        . . . . . . . 2 . . . . . . . .
        . . . . 2 . . 2 . . 2 . . . . .
        . . . . . 2 . f . 2 . . . . . .
        . . . . . . f 2 f . . . . . . .
        . . . . . . f f f . . . . . . .
        . . . . . f f f f f . . . . . .
        . . . . d f f f f f d . . . . .
        . . . d c f f f f f c d . . . .
        . . d c d c c c c c d c d . . .
        . d c d c d d c c d c d c d . .
        . . d c c c d d c c c c d . . .
        . . . d d c c d d c c d . . . .
        . . . . . d d c c d . . . . . .
    `

    // ====== Laser shots ======

    export const laserGreen = img`
        7
        7
        6
        6
        7
        7
    `

    export const laserRed = img`
        2
        2
        4
        4
        2
        2
    `

    // Torpedo - thicker bolt with a tail (3x10), looks more powerful
    export const torpedoRed = img`
        . 2 .
        2 2 2
        2 4 2
        2 4 2
        2 4 2
        2 4 2
        4 5 4
        4 5 4
        . 5 .
        . 5 .
    `
    export const torpedoGreen = img`
        . 7 .
        7 7 7
        7 6 7
        7 6 7
        7 6 7
        7 6 7
        6 1 6
        6 1 6
        . 1 .
        . 1 .
    `

    // Missile - slim, very fast (2x10)
    export const missileRed = img`
        . 2 .
        2 2 2
        4 4 4
        4 5 4
        4 5 4
        4 5 4
        4 4 4
        2 2 2
        . 4 .
        . 5 .
    `
    export const missileGreen = img`
        . 7 .
        7 7 7
        6 6 6
        6 1 6
        6 1 6
        6 1 6
        6 6 6
        7 7 7
        . 6 .
        . 1 .
    `

    // Starfield background star (small)
    export const star = img`
        1
    `
    export const starBig = img`
        . 1 .
        1 1 1
        . 1 .
    `

    // ====== Powerup ======
    export const powerupShield = img`
        . . 8 8 8 8 . .
        . 8 9 9 9 9 8 .
        8 9 9 1 1 9 9 8
        8 9 1 1 1 1 9 8
        8 9 1 1 1 1 9 8
        8 9 9 1 1 9 9 8
        . 8 9 9 9 9 8 .
        . . 8 8 8 8 . .
    `

    export const powerupBomb = img`
        . . 4 4 4 . . .
        . 4 5 5 5 4 . .
        4 5 5 2 5 5 4 .
        4 5 2 2 2 5 4 f
        4 5 5 2 5 5 4 f
        . 4 5 5 5 4 . .
        . . 4 4 4 . . .
        . . . . . . . .
    `

    // ===========================================================
    // === Additional player ships (all 24x24, nose pointing up)
    // ===========================================================

    // Scout-R - slim arrow/dart shape, red stripes
    export const scoutRPlayer = img`
        . . . . . . . . . . . 2 2 . . . . . . . . . . .
        . . . . . . . . . . . 2 2 . . . . . . . . . . .
        . . . . . . . . . . 2 1 1 2 . . . . . . . . . .
        . . . . . . . . . . 2 9 9 2 . . . . . . . . . .
        . . . . . . . . . 2 1 9 9 1 2 . . . . . . . . .
        . . . . . . . . . 2 1 1 1 1 2 . . . . . . . . .
        . . . . . . . . 2 1 1 1 1 1 1 2 . . . . . . . .
        . . . . . . . 2 1 1 2 1 1 2 1 1 2 . . . . . . .
        . . . . . . 2 1 1 1 1 1 1 1 1 1 1 2 . . . . . .
        . . . . . 2 1 1 1 1 1 1 1 1 1 1 1 1 2 . . . . .
        . . . . 2 1 1 1 b b 1 1 1 1 b b 1 1 1 2 . . . .
        . . . 2 1 1 1 1 b b 1 1 1 1 b b 1 1 1 1 2 . . .
        . . . 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 . . .
        . . . 2 2 2 2 2 2 1 1 1 1 1 1 2 2 2 2 2 2 . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . . 1 b b b b 1 . . . . . . . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . . 4 4 1 1 4 4 . . . . . . . . .
        . . . . . . . . . 4 5 5 5 5 4 . . . . . . . . .
        . . . . . . . . . . 5 5 5 5 . . . . . . . . . .
        . . . . . . . . . . . 5 5 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Hammer-B - pod cockpit at the front + two parallel engine pylons at the rear
    export const hammerBPlayer = img`
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . 1 1 9 9 1 1 . . . . . . . . .
        . . . . . . . . . 1 9 9 9 9 1 . . . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . 1 1 2 1 1 1 1 2 1 1 . . . . . . .
        . . . . . . . 1 b b b 1 1 b b b 1 . . . . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . 1 b 1 b b b b 1 b 1 . . . . . . .
        . . . . . . 1 b b 1 1 1 1 1 1 b b 1 . . . . . .
        . . . . . 1 b b b 1 . . . . 1 b b b 1 . . . . .
        . . . . 1 b b b b 1 . . . . 1 b b b b 1 . . . .
        . . . . 1 b b b b 1 . . . . 1 b b b b 1 . . . .
        . . . . 1 b b b b 1 . . . . 1 b b b b 1 . . . .
        . . . . 1 b b b b 1 . . . . 1 b b b b 1 . . . .
        . . . . 1 1 1 1 1 1 . . . . 1 1 1 1 1 1 . . . .
        . . . . 4 4 4 4 4 4 . . . . 4 4 4 4 4 4 . . . .
        . . . . 4 5 5 5 5 4 . . . . 4 5 5 5 5 4 . . . .
        . . . . . 5 5 5 5 . . . . . . 5 5 5 5 . . . . .
        . . . . . . 5 5 . . . . . . . . 5 5 . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Cross-B - cross shape: long vertical main body + horizontal cross wing
    export const crossBPlayer = img`
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . 1 e e 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . 1 b 1 1 b 1 . . . . . . . . .
        . . . . . . . . . 1 b 1 1 b 1 . . . . . . . . .
        . . . . . . . . . 1 b 1 1 b 1 . . . . . . . . .
        . . . . . . . . . 1 b 2 2 b 1 . . . . . . . . .
        2 . . . . . . . . 1 1 1 1 1 1 . . . . . . . . 2
        1 1 . . . . . . 1 1 b b b b 1 1 . . . . . . 1 1
        1 b 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 b 1
        1 b b b b b b b b 1 1 1 1 1 1 b b b b b b b b 1
        1 1 1 1 1 1 1 1 1 1 b b b b 1 1 1 1 1 1 1 1 1 1
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . . . 1 b 2 2 b 1 . . . . . . . . .
        . . . . . . . . . 1 b 1 1 b 1 . . . . . . . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . . 4 4 1 1 4 4 . . . . . . . . .
        . . . . . . . . . 4 5 5 5 5 4 . . . . . . . . .
        . . . . . . . . . . 5 5 5 5 . . . . . . . . . .
        . . . . . . . . . . . 5 5 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Vanguard-E - engine nacelle with 3 large wings, Falcon-A successor
    export const vanguardEPlayer = img`
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . 1 1 1 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . . 1 9 9 1 . . . . . . . . . .
        . . . . . . . . . 1 1 1 1 1 1 . . . . . . . . .
        . . . . . . . . . 1 2 1 1 2 1 . . . . . . . . .
        2 . . . . . . . . 1 1 1 1 1 1 . . . . . . . . 2
        1 b . . . . . . 1 1 1 1 1 1 1 1 . . . . . . b 1
        . 1 b . . . . 1 1 1 1 1 1 1 1 1 1 . . . . b 1 .
        . . 1 b . . 1 1 1 1 1 1 1 1 1 1 1 1 . . b 1 . .
        . . . 1 b 1 1 1 1 1 1 b b 1 1 1 1 1 1 b 1 . . .
        . . . . 1 1 1 1 1 1 1 b b 1 1 1 1 1 1 1 . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . .
        . . . . . . . 1 1 1 1 1 1 1 1 1 1 . . . . . . .
        2 . . . . . 1 1 1 b 2 2 b 1 1 1 1 . . . . . . 2
        1 b . . . 1 1 1 1 1 1 1 1 1 1 1 1 1 . . . . b 1
        . 1 b . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . b 1 .
        . . 1 b 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 b b 1 . .
        . . . 1 1 1 1 1 1 1 1 4 4 1 1 1 1 1 1 1 1 . . .
        . . . . . . . . . 1 4 4 4 4 1 . . . . . . . . .
        . . . . . . . . . . 5 4 4 5 . . . . . . . . . .
        . . . . . . . . . . . 5 5 . . . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // Wayfarer YT-1300 - classic disc viewed from above:
    // TWO bow mandibles on top with a gap + COCKPIT POD on the right side.
    export const wayfarerPlayer = img`
        . . . 1 1 1 1 . . . . . . . . . . 1 1 1 1 . . .
        . . 1 1 b b 1 1 . . . . . . . . 1 1 b b 1 1 . .
        . . 1 b b b b 1 . . . . . . . . 1 b b b b 1 . .
        . . 1 b b b b 1 . . . . . . . . 1 b b b b 1 . .
        . . 1 b b b b 1 . . . . . . . . 1 b b b b 1 . .
        . . 1 b b b b 1 . . . . . . . . 1 b b b b 1 . .
        . 1 1 b b b b 1 1 . . . . . . 1 1 b b b b 1 1 .
        . 1 b b 1 1 1 1 1 1 . . . . 1 1 1 1 1 1 b b 1 .
        1 1 b b 1 1 1 b b b 1 1 1 1 b b b 1 1 1 b b 1 1
        1 b b 1 1 b b b 1 1 1 1 1 1 1 1 1 b b b 1 1 b 1
        1 b 1 1 b b 1 1 1 1 1 1 1 1 1 1 1 1 1 b b 1 1 b
        1 b 1 b b 1 1 1 1 1 b b b b 1 1 1 1 1 1 b b 1 b
        1 b 1 b 1 1 1 1 1 1 b 9 9 b 1 1 1 1 1 1 1 b 1 9
        1 b 1 1 1 1 1 1 1 1 b 9 9 b 1 1 1 1 1 1 b b 9 9
        1 b 1 1 1 1 1 1 1 1 b b b b 1 1 1 1 1 1 b b 9 9
        1 b 1 b 1 1 1 1 1 1 b b b b 1 1 1 1 1 1 1 b 1 9
        1 b 1 b b 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 b b 1 b
        1 b b 1 1 b b 1 1 1 1 1 1 1 1 1 1 1 b b b 1 b 1
        1 1 b b 1 1 1 b b b 1 1 1 1 b b b 1 1 1 b b 1 1
        . 1 b b b 1 1 1 1 1 1 1 1 1 1 1 1 1 1 b b b 1 .
        . 1 1 b b b 1 1 1 1 4 4 4 4 1 1 1 1 b b b 1 1 .
        . . 1 1 b b b 1 4 4 5 5 5 5 4 4 1 b b b 1 1 . .
        . . . 1 1 b b 4 4 5 5 5 5 5 5 4 4 b b 1 1 . . .
        . . . . . 1 1 1 4 5 5 5 5 5 5 4 1 1 1 . . . . .
    `

    // Razor-I - 4 tapered dagger wings around a cockpit ball
    export const razorIPlayer = img`
        f . . . . . . . . . . . . . . . . . . . . . . f
        f f . . . . . . . . . . . . . . . . . . . . f f
        f f f . . . . . . . . . . . . . . . . . . f f f
        b f f f . . . . . . . . . . . . . . . . f f f b
        b b f f f . . . . . . f f . . . . . . f f f b b
        b b b f f f . . . . f e e f . . . . f f f b b b
        b b b b f f f . . f e e e e f . . f f f b b b b
        b b b b b f f f f e e 1 1 e e f f f f b b b b b
        b b b b b b f f e e 1 1 1 1 e e f f b b b b b b
        b b b b b b f f e 1 1 1 1 1 1 e f f b b b b b b
        b b b b b b f e 1 1 1 9 9 1 1 1 e f b b b b b b
        f f f f f f f e 1 1 1 9 9 1 1 1 e f f f f f f f
        f f f f f f f e 1 1 1 9 9 1 1 1 e f f f f f f f
        b b b b b b f e 1 1 1 9 9 1 1 1 e f b b b b b b
        b b b b b b f f e 1 1 1 1 1 1 e f f b b b b b b
        b b b b b b f f e e 1 1 1 1 e e f f b b b b b b
        b b b b b f f f f e e 1 1 e e f f f f b b b b b
        b b b b f f f . . f e e e e f . . f f f b b b b
        b b b f f f . . . . f e e f . . . . f f f b b b
        b b f f f . . . . . . f f . . . . . . f f f b b
        b f f f . . . . . . . . . . . . . . . . f f f b
        f f f . . . . . . . . . . . . . . . . . . f f f
        f f . . . . . . . . . . . . . . . . . . . . f f
        f . . . . . . . . . . . . . . . . . . . . . . f
    `

    // Bounty-I Firespray-31 - compact disc shape with large engines
    export const bountyIPlayer = img`
        . . . . . . . . . . . 1 1 . . . . . . . . . . .
        . . . . . . . . . . 1 b b 1 . . . . . . . . . .
        . . . . . . . . . 1 b 6 6 b 1 . . . . . . . . .
        . . . . . . . 1 1 b 6 6 6 6 b 1 1 . . . . . . .
        . . . . . 1 1 b b 6 6 9 9 6 6 b b 1 1 . . . . .
        . . . . 1 b b 6 6 6 9 9 9 9 6 6 6 b b 1 . . . .
        . . . 1 b 6 6 6 6 6 9 9 9 9 6 6 6 6 6 b 1 . . .
        . . 1 b 6 6 6 6 6 6 6 1 1 6 6 6 6 6 6 6 b 1 . .
        . 1 b 6 6 6 6 6 6 6 6 b b 6 6 6 6 6 6 6 6 b 1 .
        1 b 6 6 6 6 6 6 6 6 6 b b 6 6 6 6 6 6 6 6 6 b 1
        1 b 6 6 6 6 6 6 6 6 6 b b 6 6 6 6 6 6 6 6 6 b 1
        1 b 6 6 6 6 6 6 6 6 b b b b 6 6 6 6 6 6 6 6 b 1
        1 b 6 6 6 6 6 6 6 6 b b b b 6 6 6 6 6 6 6 6 b 1
        1 b 6 6 6 6 6 6 6 b b b b b b 6 6 6 6 6 6 6 b 1
        . 1 b 6 6 6 6 6 6 b b b b b b 6 6 6 6 6 6 b 1 .
        . . 1 b 6 6 6 6 6 b b 1 1 b b 6 6 6 6 6 b 1 . .
        . . . 1 b 6 6 6 b b 1 1 1 1 b b 6 6 6 b 1 . . .
        . . . . 1 b b b b 1 1 4 4 1 1 b b b b 1 . . . .
        . . . . . 1 1 b b 4 4 5 5 4 4 b b 1 1 . . . . .
        . . . . . . . 4 4 5 5 5 5 5 5 4 4 . . . . . . .
        . . . . . . . 4 5 5 5 5 5 5 5 5 4 . . . . . . .
        . . . . . . . . 5 5 5 5 5 5 5 5 . . . . . . . .
        . . . . . . . . . 5 5 5 5 5 5 . . . . . . . . .
        . . . . . . . . . . . . . . . . . . . . . . . .
    `

    // ====== Faction emblems (32x32, programmatically generated) ======

    let _allianceEmblem: Image = null as any
    let _dominionEmblem: Image = null as any

    function buildRebelEmblem(): Image {
        // Alliance Starbird / Phoenix - 3 flames radiating outward
        const w = 32, h = 32
        const im = image.create(w, h)
        const cx = 16, cy = 16
        // Central point
        im.fillRect(cx - 1, cy - 1, 2, 2, 5)
        // 3 flame rays: top (90 deg), bottom-left (210 deg), bottom-right (330 deg)
        const angles = [-Math.PI / 2, Math.PI * 5 / 6, Math.PI / 6]
        for (const ang of angles) {
            for (let r = 0; r < 16; r++) {
                const x = cx + Math.cos(ang) * r
                const y = cy + Math.sin(ang) * r
                // Thickness increases slightly toward the end (flame)
                const thickness = 2 + Math.floor(r / 8)
                for (let dy = -thickness; dy <= thickness; dy++) {
                    for (let dx = -thickness; dx <= thickness; dx++) {
                        const px = (x + dx) | 0
                        const py = (y + dy) | 0
                        if (px < 0 || px >= w || py < 0 || py >= h) continue
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        if (dist > thickness) continue
                        // Brighter inside (yellow), orange/red on the outside
                        const col = (dist < thickness * 0.4) ? 5 : (dist < thickness * 0.8) ? 4 : 2
                        if (col > im.getPixel(px, py) || im.getPixel(px, py) == 0) {
                            im.setPixel(px, py, col)
                        }
                    }
                }
            }
        }
        return im
    }

    function buildEmpireEmblem(): Image {
        // Dominion Cog - 6-spoke gear wheel
        const w = 32, h = 32
        const im = image.create(w, h)
        const cx = 16, cy = 16
        // 6 spokes
        for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2 - Math.PI / 2
            for (let r = 4; r < 15; r++) {
                const x = (cx + Math.cos(ang) * r) | 0
                const y = (cy + Math.sin(ang) * r) | 0
                // Spoke thickness
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const px = x + dx
                        const py = y + dy
                        if (px < 0 || px >= w || py < 0 || py >= h) continue
                        im.setPixel(px, py, 11)
                    }
                }
            }
            // Tip at the spoke ends
            const tipX = (cx + Math.cos(ang) * 14) | 0
            const tipY = (cy + Math.sin(ang) * 14) | 0
            im.fillRect(tipX - 1, tipY - 1, 3, 3, 1)
        }
        // Central circle (filled)
        for (let dy = -5; dy <= 5; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                if (dx * dx + dy * dy <= 25) {
                    im.setPixel(cx + dx, cy + dy, 11)
                }
            }
        }
        // Inner dark circle
        for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
                if (dx * dx + dy * dy <= 9) {
                    im.setPixel(cx + dx, cy + dy, 15)
                }
            }
        }
        // Outer ring
        for (let ang = 0; ang < Math.PI * 2; ang += 0.1) {
            const x = (cx + Math.cos(ang) * 15) | 0
            const y = (cy + Math.sin(ang) * 15) | 0
            if (x >= 0 && x < w && y >= 0 && y < h) {
                im.setPixel(x, y, 1)
            }
        }
        return im
    }

    // ====== Trench run assets ======

    // Crosshair for the trench run mission (12x12)
    export const reticle = img`
        . . . . 2 2 2 2 . . . .
        . . . 2 . . . . 2 . . .
        . . 2 . . . . . . 2 . .
        . 2 . . . 5 5 . . . 2 .
        2 . . . 5 . . 5 . . . 2
        2 . . 5 . . . . 5 . . 2
        2 . . 5 . . . . 5 . . 2
        2 . . . 5 . . 5 . . . 2
        . 2 . . . 5 5 . . . 2 .
        . . 2 . . . . . . 2 . .
        . . . 2 . . . . 2 . . .
        . . . . 2 2 2 2 . . . .
    `

    // Turret (static) as a target in the trench (8x10)
    export const canyonTurret = img`
        . 11 11 11 11 .
        11 1 1 1 1 11
        11 1 2 2 1 11
        11 1 1 1 1 11
        . 11 1 1 11 .
        . . 11 11 . .
        . . 11 11 . .
        . 11 11 11 11 .
        11 11 11 11 11 11
        11 11 11 11 11 11
    `

    // Reactor Vent - final target of the Alliance mission (16x16)
    export const reactorVent = img`
        . . 11 11 11 11 11 11 11 11 11 11 11 11 . .
        . 11 11 15 15 15 15 15 15 15 15 15 15 11 11 .
        11 11 15 15 15 15 15 15 15 15 15 15 15 15 11 11
        11 15 15 15 15 15 15 15 15 15 15 15 15 15 15 11
        11 15 15 15 15 15 5 5 15 15 15 15 15 15 15 11
        11 15 15 15 15 5 4 4 5 15 15 15 15 15 15 11
        11 15 15 15 5 4 2 2 4 5 15 15 15 15 15 11
        11 15 15 15 5 4 2 2 4 5 15 15 15 15 15 11
        11 15 15 15 5 4 2 2 4 5 15 15 15 15 15 11
        11 15 15 15 5 4 2 2 4 5 15 15 15 15 15 11
        11 15 15 15 15 5 4 4 5 15 15 15 15 15 15 11
        11 15 15 15 15 15 5 5 15 15 15 15 15 15 15 11
        11 15 15 15 15 15 15 15 15 15 15 15 15 15 15 11
        11 11 15 15 15 15 15 15 15 15 15 15 15 15 11 11
        . 11 11 15 15 15 15 15 15 15 15 15 15 11 11 .
        . . 11 11 11 11 11 11 11 11 11 11 11 11 . .
    `

    // Cockpit frame (160x120 - programmatically generated, only covers the edges)
    let _cockpitFrame: Image = null as any

    function buildCockpitFrame(): Image {
        const w = 160, h = 120
        const im = image.create(w, h)
        // Upper bar (instrument panel)
        im.fillRect(0, 0, w, 14, 15)
        im.fillRect(0, 14, w, 1, 11)
        // Instruments: a few lights
        for (let i = 0; i < 8; i++) {
            const lx = 12 + i * 18
            im.fillRect(lx, 4, 4, 2, (i % 3 == 0) ? 2 : (i % 3 == 1) ? 7 : 5)
            im.fillRect(lx, 8, 4, 2, 11)
        }
        // Lower bar (HUD)
        im.fillRect(0, h - 20, w, 20, 15)
        im.fillRect(0, h - 21, w, 1, 11)
        // Left cockpit strut (diagonal)
        for (let y = 14; y < h - 20; y++) {
            const t = (y - 14) / (h - 20 - 14)
            const xWidth = Math.floor(20 * (1 - t * 0.6))  // narrows toward the bottom
            im.fillRect(0, y, xWidth, 1, 15)
            im.setPixel(xWidth, y, 11)
        }
        // Right cockpit strut
        for (let y = 14; y < h - 20; y++) {
            const t = (y - 14) / (h - 20 - 14)
            const xWidth = Math.floor(20 * (1 - t * 0.6))
            im.fillRect(w - xWidth, y, xWidth, 1, 15)
            im.setPixel(w - xWidth - 1, y, 11)
        }
        return im
    }

    export function cockpitFrame(): Image {
        if (!_cockpitFrame) _cockpitFrame = buildCockpitFrame()
        return _cockpitFrame
    }

    // ====== FPS troop assets ======

    let _dominionTrooper: Image = null as any
    let _allianceTrooper: Image = null as any
    let _blasterOverlay: Image = null as any

    function buildStormtrooper(): Image {
        const w = 16, h = 20
        const im = image.create(w, h)
        // Helmet (white with black visor)
        im.fillRect(4, 0, 8, 6, 1)
        im.drawRect(4, 0, 8, 6, 15)
        im.fillRect(5, 2, 6, 2, 15)  // visor
        im.setPixel(7, 5, 15)        // breath mask
        im.setPixel(8, 5, 15)
        // Chest armor
        im.fillRect(3, 6, 10, 8, 1)
        im.drawRect(3, 6, 10, 8, 15)
        // Belt
        im.fillRect(3, 10, 10, 1, 15)
        // Shoulder armor (darker)
        im.fillRect(2, 6, 2, 4, 11)
        im.fillRect(12, 6, 2, 4, 11)
        // Legs
        im.fillRect(4, 14, 3, 5, 1)
        im.drawRect(4, 14, 3, 5, 15)
        im.fillRect(9, 14, 3, 5, 1)
        im.drawRect(9, 14, 3, 5, 15)
        // Blaster (in front of the chest)
        im.fillRect(11, 8, 4, 2, 15)
        return im
    }

    function buildRebelSoldier(): Image {
        const w = 16, h = 20
        const im = image.create(w, h)
        // Helmet (olive-tan)
        im.fillRect(4, 0, 8, 5, 12)
        im.fillRect(5, 2, 6, 1, 5)  // stripe
        // Face
        im.fillRect(5, 4, 6, 2, 4)
        // Jumpsuit (orange)
        im.fillRect(3, 6, 10, 8, 4)
        im.drawRect(3, 6, 10, 8, 15)
        // Vest strap
        im.fillRect(3, 10, 10, 1, 12)
        // Arms
        im.fillRect(2, 6, 2, 6, 4)
        im.fillRect(12, 6, 2, 6, 4)
        // Legs
        im.fillRect(4, 14, 3, 5, 12)
        im.drawRect(4, 14, 3, 5, 15)
        im.fillRect(9, 14, 3, 5, 12)
        im.drawRect(9, 14, 3, 5, 15)
        // Blaster
        im.fillRect(11, 8, 4, 2, 15)
        return im
    }

    function buildBlasterOverlay(): Image {
        // Lower half of the screen - own weapon + hand
        const w = 60, h = 30
        const im = image.create(w, h)
        // Barrel (vertical)
        im.fillRect(28, 0, 4, 18, 15)
        im.fillRect(29, 0, 2, 16, 11)
        // Front sight
        im.fillRect(27, 0, 6, 2, 15)
        // Hand
        im.fillRect(24, 16, 12, 6, 4)
        im.drawRect(24, 16, 12, 6, 15)
        // Grip
        im.fillRect(26, 22, 8, 8, 15)
        im.fillRect(27, 23, 6, 6, 11)
        return im
    }

    export function dominionTrooper(): Image {
        if (!_dominionTrooper) _dominionTrooper = buildStormtrooper()
        return _dominionTrooper
    }
    export function allianceTrooper(): Image {
        if (!_allianceTrooper) _allianceTrooper = buildRebelSoldier()
        return _allianceTrooper
    }
    export function blasterOverlay(): Image {
        if (!_blasterOverlay) _blasterOverlay = buildBlasterOverlay()
        return _blasterOverlay
    }

    // ====== Guardian/Shadow arena assets ======

    let _guardianIdle: Image = null as any
    let _guardianSwing: Image = null as any
    let _shadowIdle: Image = null as any
    let _shadowSwing: Image = null as any

    function buildFighter(isGuardian: boolean, swinging: boolean, facesRight: boolean): Image {
        const w = 24, h = 36
        const im = image.create(w, h)
        const saberColor = isGuardian ? 8 : 2     // blue or red
        const robeOuter = isGuardian ? 12 : 15    // dark purple or black
        const robeInner = isGuardian ? 13 : 12    // cream or dark purple
        const faceColor = 4                   // skin tone
        const cx = w / 2

        // Legs
        im.fillRect(cx - 4, h - 8, 3, 8, robeOuter)
        im.fillRect(cx + 1, h - 8, 3, 8, robeOuter)
        // Main robe
        im.fillRect(cx - 5, 14, 10, 16, robeOuter)
        im.fillRect(cx - 4, 16, 8, 13, robeInner)
        // Robe folds
        for (let y = 18; y < 28; y += 3) {
            im.setPixel(cx - 3, y, robeOuter)
            im.setPixel(cx + 2, y, robeOuter)
        }
        // Head
        im.fillRect(cx - 3, 6, 6, 7, faceColor)
        im.fillRect(cx - 4, 5, 8, 2, robeOuter)  // hood/hat
        im.setPixel(cx - 2, 9, 15)               // eyes
        im.setPixel(cx + 1, 9, 15)
        // Shadow has red eyes
        if (!isGuardian) {
            im.setPixel(cx - 2, 9, 2)
            im.setPixel(cx + 1, 9, 2)
        }

        // Arm + plasma blade
        // Shoulder
        im.fillRect(facesRight ? cx + 3 : cx - 6, 14, 3, 2, robeOuter)
        // Forearm
        const elbowX = facesRight ? cx + 6 : cx - 7
        im.fillRect(elbowX - 1, 14, 3, 2, faceColor)

        // Saber: upright (idle) or horizontal (swing)
        if (swinging) {
            // Horizontal swing
            const startX = facesRight ? cx + 7 : 0
            const lenX = facesRight ? w - cx - 7 : cx - 4
            im.fillRect(startX, 14, lenX, 2, saberColor)
            // Hilt
            const hiltX = facesRight ? cx + 7 : cx - 5
            im.fillRect(hiltX, 14, 2, 2, 15)
            // Glow
            im.fillRect(startX, 13, lenX, 1, 1)
            im.fillRect(startX, 16, lenX, 1, 1)
        } else {
            // Vertical plasma blade pointing up
            const saberX = facesRight ? cx + 6 : cx - 6
            im.fillRect(saberX, 0, 1, 14, saberColor)
            im.setPixel(saberX - 1, 1, 1)  // glow
            im.setPixel(saberX + 1, 1, 1)
            // Hilt
            im.fillRect(saberX - 1, 13, 3, 2, 15)
        }

        return im
    }

    export function guardianIdle(): Image {
        if (!_guardianIdle) _guardianIdle = buildFighter(true, false, true)
        return _guardianIdle
    }
    export function guardianSwing(): Image {
        if (!_guardianSwing) _guardianSwing = buildFighter(true, true, true)
        return _guardianSwing
    }
    export function shadowIdle(): Image {
        if (!_shadowIdle) _shadowIdle = buildFighter(false, false, false)
        return _shadowIdle
    }
    export function shadowSwing(): Image {
        if (!_shadowSwing) _shadowSwing = buildFighter(false, true, false)
        return _shadowSwing
    }

    export function allianceEmblem(): Image {
        if (!_allianceEmblem) _allianceEmblem = buildRebelEmblem()
        return _allianceEmblem
    }

    export function dominionEmblem(): Image {
        if (!_dominionEmblem) _dominionEmblem = buildEmpireEmblem()
        return _dominionEmblem
    }

    // Mapping: global ship index -> sprite
    export function shipSprite(shipIndex: number): Image {
        switch (shipIndex) {
            case 0: return falconAPlayer
            case 1: return scoutRPlayer
            case 2: return hammerBPlayer
            case 3: return crossBPlayer
            case 4: return vanguardEPlayer
            case 5: return wayfarerPlayer
            case 6: return sabreIPlayer
            case 7: return enemyMaulerI       // Sabre is symmetric
            case 8: return razorIPlayer
            case 9: return enemyAegisI     // Sabre is symmetric
            case 10: return bountyIPlayer
        }
        return falconAPlayer
    }
}
