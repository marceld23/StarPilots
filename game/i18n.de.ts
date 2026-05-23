// Localization module - GERMAN BUILD.
//
// This file is the German variant of `i18n.ts`. To build a German firmware, edit
// `pxt.json` and swap "i18n.ts" for "i18n.de.ts" in the `files` array, then run
// `yarn dlx makecode build -h stm32f401 [--deploy]`.
//
// Only one of `i18n.ts` and `i18n.de.ts` may be listed in `pxt.json` at a time -
// they define the same `i18n.t()` function and PXT would otherwise reject the build
// with a duplicate-symbol error.
//
// Translation coverage: menu labels, settings, buttons, boss names and short result
// labels are translated. Longer help-screen / intro / howto text stays in English
// even in this build - including all of it pushes the binary past the STM32F401
// flash budget. Add or move entries below as needed; unknown strings fall through
// to their English original.

namespace i18n {
    export function t(key: string): string {
        return lookupDe(key)
    }

    export function languageName(): string {
        return "Deutsch"
    }

    function lookupDe(key: string): string {
        switch (key) {
            // Boot
            case "by Justus and Marcel": return "von Justus und Marcel"
            case "Press any key": return "Beliebige Taste"
            case "In a distant sector...": return "In einem fernen Sektor..."

            // Title menu
            case "Start game": return "Spiel starten"
            case "Ship preview": return "Schiffvorschau"
            case "Help": return "Hilfe"
            case "Settings": return "Einstellungen"
            case "Test mode": return "Test-Modus"
            case "BEST": return "REKORD"
            case "RANK": return "RANG"
            case "Squadron Commander active!": return "Squadron Commander aktiv!"

            // Settings
            case "SETTINGS": return "EINSTELLUNGEN"
            case "Volume": return "Lautstaerke"
            case "Brightness": return "Helligkeit"
            case "Reset progress": return "Fortschritt loeschen"
            case "Back": return "Zurueck"
            case "Up/Down L/R A=OK": return "Hoch/Runter L/R A=OK"
            case "Really reset": return "Fortschritt wirklich"
            case "progress?": return "loeschen?"
            case "A = Yes     B = No": return "A = Ja      B = Nein"

            // Faction select
            case "CHOOSE YOUR SIDE": return "WAEHLE DEINE SEITE"
            case "ALLIANCE": return "ALLIANZ"
            case "DOMINION": return "DOMINION"
            case "< > A=OK B=Back": return "< > A=OK B=Zurueck"

            // Ship select
            case "SHIP SELECT": return "SCHIFFSWAHL"
            case "A=Fly B=Back": return "A=Fliegen B=Zurueck"

            // Upgrade
            case "UPGRADE": return "AUFRUESTEN"
            case "Level $L cleared!": return "Level $L geschafft!"
            case "DEFENSIVE": return "DEFENSIV"
            case "OFFENSIVE": return "OFFENSIV"
            case "Shield": return "Schild"
            case "Armor": return "Panzerung"
            case "Full refill": return "Voll auffuellen"

            // Ship unlocked
            case "NEW SHIP": return "NEUES SCHIFF"
            case "UNLOCKED!": return "FREIGESCHALTET!"
            case "Switch ship now?": return "Schiff jetzt wechseln?"
            case "Keep": return "Behalten"
            case "Switch": return "Wechseln"

            // Pause
            case "Resume": return "Weiter"
            case "Quit": return "Beenden"
            case "Up/Down A=OK": return "Hoch/Runter A=OK"

            // Level intro
            case "Free Worlds Alliance": return "Freie Welten Allianz"
            case "Dominion Fleet": return "Dominion Flotte"

            // Boss intro
            case "URGENT!": return "DRINGEND!"
            case "MESSAGE": return "NACHRICHT"
            case "FINAL BOSS": return "FINALER BOSS"
            case "WARNING!": return "ACHTUNG!"

            // Level complete
            case "LEVEL CLEARED!": return "LEVEL GESCHAFFT!"
            case "Score:": return "Punkte:"
            case "Next: L": return "Naechstes: L"

            // Game over
            case "GAME OVER": return "SPIELENDE"
            case "Level reached:": return "Erreichtes Level:"
            case "Rescues:": return "Gerettete:"
            case "NEW BEST!": return "NEUER REKORD!"
            case "BEST:": return "REKORD:"
            case "A = Again": return "A = Nochmal"

            // Difficulty
            case "DIFFICULTY": return "SCHWIERIGKEIT"
            case "Easy": return "Leicht"
            case "Hard": return "Schwer"
            case "A=Pick B=Back": return "A=Wahl B=Zurueck"

            // Rank
            case "Recruit": return "Rekrut"

            // Help short labels
            case "HELP": return "HILFE"
            case "CONTROLS": return "STEUERUNG"
            case "SHIP TYPES": return "SCHIFFSTYPEN"
            case "Alliance": return "Allianz"
            case "Dominion": return "Dominion"
            case "PROGRESSION": return "FORTSCHRITT"

            // Canyon Run (trench)
            case "CANYON RUN": return "CANYON-FLUG"
            case "TIME": return "ZEIT"
            case "TARGETS": return "ZIELE"
            case "END TARGET!": return "ENDZIEL!"
            case "HIT!": return "TREFFER!"
            case "ACCOMPLISHED!": return "ERFOLGREICH!"
            case "MISSED": return "VERFEHLT"
            case "Targets:": return "Ziele:"
            case "A = Continue": return "A = Weiter"

            // Blade arena
            case "PLASMA BLADE": return "PLASMAKLINGE"
            case "VICTORY!": return "SIEG!"
            case "DEFEAT": return "NIEDERLAGE"

            // FPS
            case "GROUND FIGHT": return "BODENKAMPF"
            case "SUCCESS!": return "ERFOLG!"
            case "RETREATED": return "ZURUECKGEZOGEN"

            // Sider
            case "PATROL": return "PATROUILLE"
            case "OVERRUN": return "UEBERRANT"

            // Test menu
            case "TEST MENU": return "TEST-MENUE"
            case "Canyon Run": return "Canyon-Flug"
            case "FPS Ground Fight": return "FPS Bodenkampf"
            case "Back to title": return "Zurueck zum Titel"
            case "Up/Down A=OK B=Back": return "Hoch/Runter A=OK B=Zurueck"

            // Ship preview
            case "SHIP PREVIEW": return "SCHIFFVORSCHAU"
            case "From level": return "Ab Level"
            case "Special:": return "Spezial:"
            case "< > A/B=Back": return "< > A/B=Zurueck"

            // Bosses (Dominion against Alliance player)
            case "FLEET": return "FLOTTE"
            case "Dreadnought": return "Dreadnought"
            case "Razor Squadron": return "Razor-Geschwader"
            case "Gravitron Cruiser": return "Gravitron-Kreuzer"
            case "Envoy Shuttle": return "Envoy-Shuttle"
            case "CITADEL SPHERE": return "ZITADELLE"
            // Bosses (Alliance against Dominion player)
            case "Crescent Frigate": return "Crescent-Fregatte"
            case "Leviathan Cruiser": return "Leviathan-Kreuzer"
            case "Comet Corvette": return "Komet-Korvette"
            case "Forktail Corvette": return "Forktail-Korvette"
            case "ALLIANCE ARMADA": return "ALLIANZ-ARMADA"
        }
        return key
    }
}
