// Sound effects and music (themes per boss + per faction).
// Uses music.stringPlayable and the built-in sound effects.
// The themes are composed in heroic/imperial march style (original motifs).

namespace audio {

    let currentBgPlayer: music.Playable = null
    let muted = false

    export function setMuted(v: boolean) {
        muted = v
        if (muted) music.stopAllSounds()
    }

    export function isMuted() {
        return muted
    }

    // ====== Background music ======

    // Heroic march for the Alliance (Falcon-A player).
    // Original composition: rising D major arpeggio (A-D-F#-A) followed by a
    // stepwise descent (G-F#-E-D) and a triadic call-back. No relation to any
    // pre-existing film theme. Tempo 130 (set in playFactionTheme).
    const themeAlliance = "A4:2 D5:2 F#5:2 A5:4 - G5:2 F#5:2 E5:2 D5:4 - A4:2 D5:2 E5:2 F#5:2 D5:8"

    // Dark march for the Dominion (Sabre-I player).
    // Original composition: chromatic descent A-G#-G-F-E-Eb-D-C-B-A in A minor
    // with dotted-rhythm accents. The chromatic descending bass ("lament bass")
    // is a 17th-century stylistic convention in the public domain. Tempo 130.
    const themeDominion = "A4:3 G#4:1 G4:3 F4:1 - E4:4 Eb4:2 D4:2 - C4:4 B3:4 A3:8"

    // Boss themes (two are enough - rotated across bosses)
    const themeBossA = "D4:2 D4:2 D4:2 A3:2 F4:2 E4:2 D4:6 - D4:2 D4:2 D4:2 A3:2 F4:2 E4:2 D4:6"
    const themeBossB = "G4:1 G4:1 G4:1 G4:1 Eb4:2 - G4:1 G4:1 G4:1 G4:1 Bb4:2 - G4:1 G4:1 G4:1 G4:1 D5:2 -"

    const themeVictory = "C5:2 E5:2 G5:2 C6:4 - G5:2 C6:4 -"
    const themeGameOver = "G4:4 F#4:2 F4:2 E4:4 Eb4:2 D4:2 C#4:8"

    export function playFactionTheme(faction: gs.Faction) {
        if (muted) return
        music.stopAllSounds()
        const theme = faction == gs.Faction.Alliance ? themeAlliance : themeDominion
        const player = music.stringPlayable(theme, 130)
        music.play(player, music.PlaybackMode.LoopingInBackground)
    }

    export function playBossTheme(bossIndex: number, faction: gs.Faction) {
        if (muted) return
        music.stopAllSounds()
        const theme = (bossIndex % 2 == 0) ? themeBossA : themeBossB
        music.play(music.stringPlayable(theme, 110), music.PlaybackMode.LoopingInBackground)
    }

    export function playVictoryFanfare() {
        if (muted) return
        music.stopAllSounds()
        music.play(music.stringPlayable(themeVictory, 140), music.PlaybackMode.InBackground)
    }

    export function playGameOverFanfare() {
        if (muted) return
        music.stopAllSounds()
        music.play(music.stringPlayable(themeGameOver, 80), music.PlaybackMode.InBackground)
    }

    export function stop() {
        music.stopAllSounds()
    }

    // ====== Sound effects ======

    export function sfxLaserPlayer() {
        if (muted) return
        music.play(
            music.tonePlayable(880, 60),
            music.PlaybackMode.InBackground
        )
        music.play(
            music.tonePlayable(440, 40),
            music.PlaybackMode.InBackground
        )
    }

    export function sfxLaserEnemy() {
        if (muted) return
        music.play(music.tonePlayable(220, 80), music.PlaybackMode.InBackground)
    }

    export function sfxHitShield() {
        if (muted) return
        music.play(music.tonePlayable(660, 80), music.PlaybackMode.InBackground)
    }

    export function sfxHitArmor() {
        if (muted) return
        music.play(music.tonePlayable(330, 100), music.PlaybackMode.InBackground)
    }

    export function sfxExplosionSmall() {
        if (muted) return
        music.play(music.tonePlayable(160, 200), music.PlaybackMode.InBackground)
    }

    export function sfxExplosionBig() {
        if (muted) return
        music.play(music.tonePlayable(80, 400), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(120, 350), music.PlaybackMode.InBackground)
    }

    export function sfxRescue() {
        if (muted) return
        music.play(music.tonePlayable(660, 80), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(880, 80), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(1320, 120), music.PlaybackMode.InBackground)
    }

    export function sfxPowerup() {
        if (muted) return
        music.play(music.tonePlayable(523, 60), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(659, 60), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(784, 100), music.PlaybackMode.InBackground)
    }

    export function sfxBossWarning() {
        if (muted) return
        for (let i = 0; i < 3; i++) {
            music.play(music.tonePlayable(200, 200), music.PlaybackMode.InBackground)
            music.play(music.tonePlayable(180, 200), music.PlaybackMode.InBackground)
        }
    }

    export function sfxLevelUp() {
        if (muted) return
        music.play(music.tonePlayable(523, 80), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(659, 80), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(784, 80), music.PlaybackMode.InBackground)
        music.play(music.tonePlayable(1047, 200), music.PlaybackMode.InBackground)
    }

    export function sfxBombDrop() {
        if (muted) return
        music.play(music.tonePlayable(80, 500), music.PlaybackMode.InBackground)
    }
}
