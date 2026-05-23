# Plan: Rollback Adventure-Modus → zurück zu "StarPilots"

> **Status:** Entscheidung getroffen. Adventure-Modus wird komplett entfernt, weil das Flash-Budget am Limit ist. Das Spiel bleibt ein **Arcade-Shooter mit Minispielen zwischen den Levels** — die Form, in der es zuverlässig läuft.

## 1. Begründung

- ELECFREAKS Retro (STM32F401) hat nur **~50–100 KB Flash-Headroom**.
- Adventure-Phase 3 hat den Build mehrfach gesprengt (596 / 228 / 20 Bytes over). Jede neue Phase (Combat, Shop, Quests, mehr Maps) hätte weitere Cuts erzwungen.
- Combat + Shop + Quests + zusätzliche Maps werden zusammen geschätzt **30–60 KB** kosten. Das wäre **mindestens 10–30 KB Overflow**.
- Konsequenz wäre, bestehende Arcade-Features (Boss-Sprites, Minispiele) zu strippen — genau das, was wir nicht wollen.
- Rückbau jetzt = wir gewinnen **30–50 KB** Headroom zurück und können die Arcade-Seite stattdessen polishen / erweitern.

## 2. Was bleibt erhalten (Arcade-Spiel)

Komplettes aktuelles Arcade-Erlebnis:

- **Arcade-Hauptspiel**: 11 Schiffe (6 Rebel + 5 Empire), 11 Level, faktionsspezifische Gegner & Bosse
- **4 Minispiele integriert** zwischen den Levels:
  - Level 3 → **Grabenflug** (Trench Run)
  - Level 5 → **Guardian/Shadow-Arena**
  - Level 7 → **FPS-Bodenkampf**
  - Level 9 → **Sidescroller**
- **Squadron Commander** (2 KI-Wingmen freischaltbar nach allen 4 Minispielen)
- **Schwierigkeitsstufen**: Leicht / Normal / Schwer / Veteran
- **Pause-System**, **Hilfe-Seiten**, **Einstellungen** (Lautstärke / Helligkeit)
- **Highscore** mit Schwierigkeits-Label
- **Test-Modus**: Direkt-Start aller Minispiele
- **Schiffvorschau**: reine Ansicht aller 11 Schiffe (vor Adventure-Refactor entfernt → wieder ins Hauptmenü holen)

## 3. Was entfernt wird

### Files komplett löschen
- `adventure.ts` (229 Zeilen)
- `maps.ts` (127 Zeilen)
- `npcs.ts` (9 Zeilen)
- `characters.ts` (60 Zeilen)
- `savegame.ts` (62 Zeilen)
- `advAssets.ts` (94 Zeilen)

Gesamt: ~580 Zeilen Adventure-Code raus.

### Stellen in bestehenden Files säubern
| Datei | Eingriff |
| --- | --- |
| `state.ts` | `Screen.Adventure*` Enums + `gs.adv*` Variablen entfernen (Zeilen 52–56, 107–118) |
| `main.ts` | `goToAdventureCharSelect`, `goToAdventureSlotSelect`, `startAdventure`, `exitAdventureToTitle`, Adventure-Routing in A/B-Handlern, `adventure.isActive()` aus `inMinigame()` (36 Stellen) |
| `ui.ts` | Titel-Menü 5 → 4 Items; Splash-Titel zurueck auf "STARPILOTS"; `drawAdvSlotSelect` / `drawAdvCharSelect` / `drawAdventureGameOver` entfernen (16 Stellen) |
| `pxt.json` | Projektname zurueck auf "StarPilots" |

### Title-Menü nach Rollback
```
STARPILOTS
> Spiel starten        (führt zu Faction- und Schiff-Auswahl wie vorher)
  Schiffvorschau       (reine Ansicht)
  Hilfe
  Einstellungen
  Test-Modus
```

(5 Einträge, Schiffvorschau wandert aus dem Test-Modus ins Hauptmenü.)

## 4. Erwarteter Flash-Gewinn

| Posten | Schätzung |
| --- | --- |
| 580 Zeilen Code raus | 25–40 KB |
| `gs.adv*` Felder + Strings/Sprites in `advAssets.ts` | 5–10 KB |
| Adventure-Tile-/Char-Sprites | 3–5 KB |
| **Gesamt** | **30–50 KB Headroom zurück** |

Ergibt nach Rollback voraussichtlich **70–130 KB Headroom** — genug für sinnvolle Arcade-Erweiterungen.

## 5. Vorgehen

### Phase R1 — Code rauschneiden (1 Iteration)
1. 6 Adventure-Files löschen
2. `state.ts`: Adventure-Block entfernen
3. `main.ts`: alle Adventure-Routings/Handler entfernen; Adventure-Klausel aus `inMinigame()`; A-Handler im Hauptmenü auf 4 Einträge zurückführen
4. `ui.ts`: `drawTitle` auf neue Item-Liste; Adventure-Draw-Funktionen löschen; Schiffvorschau im Hauptmenü
5. `pxt.json`: Name umbenennen

### Phase R2 — Build + Flash
- `yarn dlx makecode build -h stm32f401`
- UF2 nach `D:\` (ARCADE-F4)
- Auf Hardware: alle bestehenden Modi durchklicken (Arcade-Hauptspiel, alle Minispiele, Schiffvorschau, Hilfe, Settings, Test-Modus)

### Phase R3 — Sanity-Pass
- Title zeigt "STARPILOTS"
- Kein Adventure-Eintrag mehr im Menü
- Spiel startet wie vor Adventure-Refactor
- Schiffvorschau erreichbar
- Headroom (Build-Output) bestätigen

## 6. Was wir mit dem gewonnenen Headroom machen können (optional, Folge-Plan)

Mögliche zukünftige Arcade-Erweiterungen (jeweils eigene kleine Plan-Iteration):

| Idee | grobe Größe |
| --- | --- |
| Mehr Minispiel-Typen (z. B. Speeder-Race) | 8–15 KB |
| Story-Cutscenes zwischen Levels (3-4 Bildschirme Text + Bild) | 5–8 KB |
| Zusatzschiffe (Slave-1, Falcon-Variante) | 3–5 KB pro Schiff |
| Boss-Rush-Modus | 3–5 KB |
| Endless-Mode mit aufstufenden Gegnern | 3–5 KB |
| Charakter-Skill-Trees | 5–8 KB |
| Co-Op-Modus auf einem Gerät | sehr aufwendig, vermutlich zu groß |

Nichts davon ist Pflicht — wir entscheiden nach erfolgreichem Rollback was als Nächstes drankommt.

## 7. Was vom Adventure-Versuch gelernt wurde

(Damit der Aufwand nicht verloren ist:)

- **String-encoded Maps** sind ~80 % billiger als Number-Arrays in MakeCode (1 Byte/Tile statt 4–8 Byte). Falls in Zukunft Tilemaps kommen → diese Technik weiterverwenden.
- **NPCs als `SpriteKind.Enemy`** kollidieren mit dem globalen Player↔Enemy-Overlap-Handler. Bei zukünftigen Story-Sprites: eigene `SpriteKind` einführen.
- **Konsolidierte Sprite-Builder mit Cache** (wie `_charCache` in `advAssets.ts`) sparen merklich Flash bei mehreren Frames pro Charakter.
- **Boss-Themes:** 4 unique Musikstrings sind verzichtbar — 2 reichen, das hat Phase 3 gerettet.

## 8. Offene Punkte vor Start

Keine — Plan ist eindeutig, klassischer Rollback. Sobald du OK gibst, starte ich mit Phase R1.
