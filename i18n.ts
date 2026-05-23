// Localization module - ENGLISH BUILD (default).
//
// To build the game in German instead, edit `pxt.json` and swap this file out:
//     "files": [
//         ...
//         "i18n.de.ts",   // <-- replace "i18n.ts" with "i18n.de.ts" for German
//         ...
//     ]
// Then re-run `yarn dlx makecode build -h stm32f401 [--deploy]`.
//
// Only one of `i18n.ts` and `i18n.de.ts` may be present in `pxt.json` at a time -
// they define the same `i18n.t()` function and PXT would otherwise complain about
// a duplicate symbol.
//
// Why two files instead of a runtime switch: the STM32F401 flash budget can only
// fit one language table at a time. Shipping both blows past the limit by ~16 KB.

namespace i18n {
    // English build: t() is identity - call sites already pass English text.
    export function t(key: string): string {
        return key
    }

    export function languageName(): string {
        return "English"
    }
}
