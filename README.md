# MelaSquare

A mobile-friendly, browser-based town-square exploration experience.

## Run locally
Open `index.html` in a modern browser. No build step or package installation is currently required.

## Project structure
```text
MelaSquare/
├── index.html                 # App entry point
├── assets/
│   ├── audio/                 # Music, ambience, sound effects, voice
│   ├── fonts/                 # Licensed font files
│   ├── icons/                 # Favicons and UI icons
│   └── images/
│       ├── characters/        # Character art and sprites
│       ├── environments/     # Buildings, terrain, scenery
│       ├── props/             # Furniture and world objects
│       └── ui/                # Interface illustrations
├── src/
│   ├── components/            # Reusable UI/world components
│   ├── data/                  # Locations, shops, dialogue, config
│   ├── scripts/
│   │   └── main.js            # Exploration and interaction logic
│   └── styles/
│       └── main.css           # Global styles and responsive layout
└── docs/                      # Architecture, setup, asset guidelines
```

## Current controls
- Touch: use the on-screen joystick to move; drag the world to look around.
- Desktop: use WASD or arrow keys to move; drag the world to look around.

## Asset conventions
- Use lowercase kebab-case filenames, e.g. `town-square-evening.webp`.
- Group assets by purpose, not by file type alone.
- Prefer WebP/AVIF for images and compressed audio formats for sound.
- Keep source artwork separate from optimized runtime assets when needed.
- Record licenses and attribution for third-party assets.

## Current scope
The first milestone is a guest-accessible town square prototype. Authentication, persistence, additional locations, and production asset pipelines are not implemented yet.
