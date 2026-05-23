// Hardware-specific helpers (battery, brightness, volume).
// The ELECFREAKS Retro currently has no standardized battery API in the
// base module. batteryLevel() returns a placeholder value.
// If an ELECFREAKS extension is installed, swap this out for e.g.
// elecfreaks.batteryLevel().

namespace hw {

    let simulatedBattery: number = 100
    let lastBatteryDecayMs: number = 0

    // ====== Vibration ======
    // DISABLED: the ELECFREAKS Retro has no dedicated vibration pin in its
    // MakeCode hardware config. Attempting to use CFG_PIN_VIBRATION caused
    // a kernel panic (bright screen + sustained tone) because the returned
    // pin was either undefined or shared with critical peripheral hardware.
    // The function is kept as a no-op so all callers keep compiling.
    export function vibrate(_durationMs: number) {
        // intentionally empty
    }

    // Returns battery level 0..100. Currently a placeholder (slowly decays);
    // replace this once a hardware API becomes available.
    export function batteryLevel(): number {
        const now = game.runtime()
        if (now - lastBatteryDecayMs > 30000) {
            lastBatteryDecayMs = now
            simulatedBattery = Math.max(5, simulatedBattery - 1)
        }
        return simulatedBattery
    }

    // ====== Brightness ======
    const SETTINGS_BRIGHTNESS = "sw_brightness"
    const SETTINGS_VOLUME = "sw_volume"

    export const BRIGHTNESS_STEPS = [35, 50, 75, 100]
    export const VOLUME_STEPS = [0, 25, 50, 75, 100]

    export function brightnessIndex(): number {
        const v = settings.readNumber(SETTINGS_BRIGHTNESS)
        if (v == null || isNaN(v)) return BRIGHTNESS_STEPS.length - 1
        const i = v | 0
        if (i < 0 || i >= BRIGHTNESS_STEPS.length) return BRIGHTNESS_STEPS.length - 1
        return i
    }

    export function setBrightnessIndex(i: number) {
        const idx = Math.clamp(0, BRIGHTNESS_STEPS.length - 1, i | 0)
        settings.writeNumber(SETTINGS_BRIGHTNESS, idx)
        applyBrightness()
    }

    export function brightnessPercent(): number {
        return BRIGHTNESS_STEPS[brightnessIndex()]
    }

    export function applyBrightness() {
        const p = brightnessPercent()
        // ScreenImage.setBrightness is available in MakeCode Arcade.
        // On boards without a backlight it is a no-op.
        screen.setBrightness(p)
    }

    // ====== Volume ======
    export function volumeIndex(): number {
        const v = settings.readNumber(SETTINGS_VOLUME)
        if (v == null || isNaN(v)) return VOLUME_STEPS.length - 1
        const i = v | 0
        if (i < 0 || i >= VOLUME_STEPS.length) return VOLUME_STEPS.length - 1
        return i
    }

    export function setVolumeIndex(i: number) {
        const idx = Math.clamp(0, VOLUME_STEPS.length - 1, i | 0)
        settings.writeNumber(SETTINGS_VOLUME, idx)
        applyVolume()
    }

    export function volumePercent(): number {
        return VOLUME_STEPS[volumeIndex()]
    }

    export function applyVolume() {
        const p = volumePercent()
        // music.setVolume expects 0..255
        music.setVolume(Math.idiv(p * 255, 100))
        audio.setMuted(p == 0)
    }

    export function applyAllSettings() {
        applyBrightness()
        applyVolume()
    }
}
