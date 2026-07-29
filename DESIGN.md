---
name: Project WatchTower
description: A restrained cartographic intelligence system for country-level evidence.
colors:
  void: "#080808"
  instrument-black: "#0f0f0f"
  paper-ink: "#e8e8e8"
  quiet-ink: "#737373"
  steel-signal: "#6b7f8f"
  hairline: "rgba(255,255,255,0.12)"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(4rem, 10vw, 9rem)"
    fontWeight: 600
    lineHeight: 0.82
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.14em"
rounded:
  control: "8px"
  surface: "14px"
  feature: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.paper-ink}"
    textColor: "{colors.void}"
    rounded: "{rounded.control}"
    padding: "14px 20px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.instrument-black}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    typography: "{typography.label}"
---

# Design System: Project WatchTower

## Overview

**Creative North Star: "The Cartographic Situation Room"**

WatchTower feels like a national atlas being read inside a quiet intelligence workspace: factual, geographically grounded, and exact without becoming theatrical. Maps, plots, measured lines, registration marks, and dossier metadata are structural devices. Large typography creates command; restrained supporting copy creates trust.

The interface is dense only where the evidence requires it. Marketing and entry surfaces use decisive open compositions, while operating surfaces favor scanability and familiar controls.

**Key Characteristics:**

- Near-black fields with pale cartographic ink.
- Real geographic material at meaningful scale.
- Condensed mission typography paired with neutral body copy and monospaced measurements.
- Hairline borders, registration ticks, and square locator marks.
- Steel-blue appears only for status, focus, or navigation emphasis.

## Colors

The palette is restrained: neutral ink and black carry the interface, with one desaturated steel signal for meaningful state.

### Primary

- **Paper Ink:** The principal text, coastline, and high-emphasis control color.

### Secondary

- **Steel Signal:** Reserved for focus, selected state, and sparse navigational emphasis.

### Neutral

- **Void:** The application ground and map-stage darkness.
- **Instrument Black:** Raised operating surfaces and control bodies.
- **Quiet Ink:** Supporting text and inactive metadata.
- **Hairline:** Dividers, plotting grids, and registration geometry.

**The Signal Rarity Rule.** Steel Signal marks state or direction; it never becomes ambient decoration.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow fallback)  
**Body Font:** Inter (with system sans-serif fallback)  
**Label/Mono Font:** JetBrains Mono (with system monospace fallback)

**Character:** Display type has the compressed authority of an atlas cover or infrastructure sign. Body copy stays neutral and readable. Monospace is reserved for coordinates, status, counts, and measurements.

### Hierarchy

- **Display** (600, fluid 4–9rem, 0.82): Welcome statements and major geographic titles only.
- **Headline** (600, fluid 2–4rem, 1): Major section identification.
- **Title** (600, 1.25–1.75rem, 1.15): Country and module names.
- **Body** (400, 1rem, 1.65): Explanatory content, capped near 70 characters per line.
- **Label** (500, 0.6875rem, 0.14em, uppercase): Instrument metadata and state.

**The Measurement Rule.** Monospace earns its place only when the text names state, location, quantity, or system metadata.

## Layout

Full-viewport atlas and welcome surfaces use an asymmetric field with strong margins, one dominant geographic artifact, and a clear reading edge. Dossier interfaces use bounded content widths and vertical evidence sections. Mobile layouts preserve the dominant artifact but collapse marginal metadata into compact rows. Spacing follows an 8px base rhythm with larger 24px and 40px separations between conceptual groups.

## Elevation & Depth

The system is flat by default. Depth comes from map imagery, tonal layering, and selective backdrop separation. Shadows are reserved for floating controls and flag-gallery surfaces; globe and briefing surfaces rely on borders and contrast.

**The Evidence Before Elevation Rule.** A surface should gain depth because it carries content or state, never merely to decorate an empty area.

## Shapes

Instrument controls use compact 8px corners. Reusable app surfaces use 14–18px rounding. Map annotations, registration marks, and briefing fields remain square or use clipped/notched corners. Pills are limited to genuinely compact status or mode controls.

## Components

### Buttons

- **Primary:** Pale ink field, dark text, compact 8px corners, monospaced action label.
- **Secondary:** Instrument-black field with a hairline border.
- **Hover / Focus:** Clear border or tonal change; keyboard focus remains visibly outlined.

### Cards / Containers

- **Corner Style:** 14–18px on app cards; square on cartographic briefing fields.
- **Background:** Instrument Black or translucent tonal overlays only when the content benefits from separation.
- **Shadow Strategy:** Structural shadow on floating flag controls; none on map annotations.
- **Border:** One hairline, never a heavy ornamental frame.

### Inputs / Fields

- **Style:** Dark operating surface, pale text, quiet placeholder, compact search icon.
- **Focus:** Brighter hairline and visible focus ring.

### Navigation

Navigation is sparse and contextual. Mode changes use compact labeled controls; country exploration always exposes a clear route into a dossier.

### Cartographic Stage

Geographic artifacts use hairline coastlines or terrain, low-contrast graticules, square locators, technical annotations, and restrained motion. The map is evidence, not wallpaper.

## Do's and Don'ts

### Do:

- **Do** give one geographic artifact enough scale to anchor the viewport.
- **Do** separate facts, status, and actions through alignment and linework.
- **Do** keep work-in-progress coverage explicit.
- **Do** preserve keyboard, touch, and reduced-motion paths.

### Don't:

- **Don't** center the welcome experience inside a generic glass hero card.
- **Don't** use glow, gradient text, or decorative dashboard widgets as substitutes for evidence.
- **Don't** let technical typography become costume on ordinary prose.
- **Don't** fabricate completion, customer, benchmark, or freshness claims.
