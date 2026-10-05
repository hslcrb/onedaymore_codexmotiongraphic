# One Day More Implementation Plan

> **For agentic workers:** Execute inline with superpowers:executing-plans. User explicitly delegated creative and implementation decisions; do not add approval stops.

**Goal:** Deliver a playable musical kinetic typography film.
**Architecture:** Deterministic Canvas timeline, media adapter, and responsive controls. Audio source supplies authoritative time.
**Tech Stack:** Vite, Canvas 2D, Web Audio, YouTube IFrame API.
**Spec:** ../specs/2026-10-04-one-day-more-design.md

## Global Constraints
One terminal command per invocation. Never access the prohibited prompt file. No original file >=20MB. No full song lyrics. Clearly label music sources.

## Review Focus
Blocked embeds, audio seeking while paused, switching tracks, narrow screens, reduced motion.

### Task 1: Timing contract
- [x] Create failing tests for chapter bounds, invalid seeks, paused time and end behavior.
- [x] Implement src/timeline.js; run node tests.
### Task 2: Artwork and soundtrack
- [x] Implement index.html, src/style.css, src/renderer.js, src/audio.js and src/main.js.
- [x] Implement visible official embed, local audio import and original instrumental alternative.
- [x] Verify loading, actual playback state and seek controls in browser. YouTube external streaming remains unverified in this environment.
### Task 3: Delivery
- [x] Build production assets; inspect mobile and desktop.
- [x] Add README with launch, music sources and controls. Open the result.
