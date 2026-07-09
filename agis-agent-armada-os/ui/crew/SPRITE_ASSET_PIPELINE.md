# AGIS Sprite Asset Pipeline v1

## Goal

Replace generic CSS avatars with concept-matched character assets while keeping the existing engineering engine: walking, thinking, routing, reaction feed, process pipeline, and receipt gate.

## Current Phase 3 Implementation

1. Extract visual tokens from approved AGIS crew concept image.
2. Convert each character to lightweight WebP token.
3. Embed tokens into the HTML dashboard as data-URI sprites for local preview.
4. Keep movement engine and reaction engine unchanged.
5. Use CSS animation on the image tokens for walking/idle/thinking/warning/victory.

## Asset Strategy

Current local preview: embedded image tokens in HTML.

Next recommended production structure:

```text
agis-agent-armada-os/
└─ assets/
   └─ crew/
      ├─ agis.webp
      ├─ fable.webp
      ├─ navigator.webp
      ├─ shipwright.webp
      ├─ archaeologist.webp
      ├─ doctor.webp
      ├─ swordsman.webp
      ├─ cook.webp
      ├─ sniper.webp
      └─ clone.webp
```

## Next Fidelity Upgrade

For each agent, create transparent sprite sheets:

```text
idle_2f
walk_4f
talk_2f
warning_1f
victory_1f
```

## Acceptance Criteria

- The user can visually recognize each agent from the concept image.
- The dashboard still functions as an operational UI.
- Characters still walk between zones.
- Reactions still show in bubbles and feed.
- Mission routing still assigns owner/backup.

## Important Limitation

CSS-only characters are no longer sufficient for character fidelity. Future visual upgrades must use real image assets or sprite sheets.
