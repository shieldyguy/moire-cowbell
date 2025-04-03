# Moiré Cowbell Roadmap

## Overview
This mobile-first web app allows users to explore interactive moiré patterns through intuitive touch gestures. Users can manipulate overlaid patterns by dragging, pinching, rotating, and flicking to observe mesmerizing visual effects. The app emphasizes visual clarity, smooth interactions, and a minimal, design-forward UI.

## Functional Requirements

### Pattern Display
- Render large, high-resolution, fine-line SVG patterns.
- Patterns must be seamless and endlessly repeatable.
- Support multiple pattern types (horizontal, diagonal, concentric, etc.).
- Allow layering of two or more patterns for moiré effects.

### User Interaction
- Drag to translate patterns across the viewport.
- Pinch to zoom (scale) patterns in/out.
- Rotate patterns with two fingers.
- Flick patterns to throw them with inertia and friction.
- Double or triple tap gesture to toggle UI (e.g. show/hide pattern selector menu).
- Single tap to close the edit drawer.
- Swipe-down gesture to dismiss the edit drawer on mobile.

### Physics Simulation
- Momentum-based movement after flick gestures.
- Friction to naturally slow down thrown patterns.
- Optional loop/wrap-around behavior for infinite scrolling/rotation.

### Pattern Library
- Built-in pattern presets selectable from a simple UI.
- Patterns defined as tiling SVG elements or programmatic canvas graphics.

### UI/UX
- Minimal overlay UI that doesn't distract from visual exploration.
- Menu system (Edit Drawer) to select and swap patterns and adjust parameters.
- Responsive design optimized for mobile (but should scale to desktop gracefully).
- Optimized touch handling and drawer interactions for mobile devices.

## Non-Functional Requirements
- **Performance:** Maintain high frame rate (60fps target).
- **Scalability:** Easy to add more pattern types.
- **Maintainability:** Modular, well-structured codebase.
- **Accessibility:** Touch gestures must work on iOS and Android browsers.
- **Deployability:** Must be deployable on Vercel or similar platforms.

## Tech Stack

### Frontend Framework
- Svelte: Simple reactivity model, easy integration with SVG/Canvas, fast build and runtime performance.

### Animation & Gestures
- Interact.js: Gesture handling (drag, pinch, rotate).
- Svelte Motion: For smooth UI animations (e.g., drawer transitions).
- (Potentially GSAP for complex physics/animation if needed).

### SVG / Pattern Rendering
- SVG `<pattern>` elements for seamless tiling.
- Programmatic SVG generation.
- (Possibly `<canvas>` for performance-heavy custom patterns).

### Physics Engine
- Lightweight custom velocity/friction handling with `requestAnimationFrame`.
- (Or Matter.js if more complex physics abstraction is required later).

### Deployment
- Vercel: Zero-config deployment with GitHub integration.

## Architecture
```text
/src
  /components
    - PatternLayer.svelte         # Renders a single SVG pattern layer
    - EditDrawer.svelte           # UI for selecting patterns and adjusting parameters
    - ...                         # Other UI components
  /lib
    - patterns.ts                 # Pattern definitions, generation logic, available patterns
    - gestures.ts                 # Centralizes gesture logic (using Interact.js)
    - physics.ts                  # Handles motion, inertia, friction (if needed)
    - version.ts                  # Version helper
  /assets
    - patterns/                   # Static SVG pattern files (if any)
/App.svelte                       # Main application component
/main.ts                          # App entry point
```

## Milestones (High-Level)
1.  **Core Pattern Rendering:** Display single/multiple seamless SVG patterns.
2.  **Basic Interaction:** Implement drag, pinch (zoom), and rotate gestures.
3.  **Pattern Management:** UI for selecting patterns and adjusting parameters (spacing, thickness, rotation).
4.  **Physics & Feel:** Implement flick gestures with inertia and friction.
5.  **UI Polish:** Refine drawer interactions, animations, and overall responsiveness.
6.  **Deployment:** Set up deployment pipeline (Vercel).
7.  **Ongoing:** Add more patterns, potentially explore advanced features (see Bonus).

## Recent Changes & Fixes
- **Multi-touch Gestures:**
    - Added pinch-to-zoom for pattern scaling.
    - Implemented two-finger rotation.
    - Added scale and rotation constraints for better control.
- **Pattern Tiling & Rendering:**
    - Extended pattern rendering beyond viewport bounds for seamless interaction.
    - Improved pattern generation logic for better tiling.
    - Enhanced diagonal pattern rendering for continuous lines.
    - Fixed horizontal line pattern tiling artifacts: Modified line generation to center lines within the tile and avoid placing lines directly on pattern boundaries, eliminating visual seams.
    - Removed `noTile` property constraint from concentric circles pattern.
- **Mobile UI & UX:**
    - Added swipe-down gesture to dismiss edit drawer.
    - Implemented single-tap to close drawer (outside the drawer).
    - Optimized drawer interactions and touch handling for mobile devices.
    - Disabled scroll-to-zoom page behaviour.
- **Code Structure:**
    - Refactored pattern definitions and logic into `src/lib/patterns.ts`.
    - Introduced `src/lib/version.ts` for version management.

## Bonus Features (Ideas)
- **Goo Filter:** Apply an SVG `feGaussianBlur` and `feColorMatrix` filter combination to create a 'gooey' or 'blobby' visual effect where the elements of the two pattern layers appear to merge and separate fluidly during interaction. This could enhance the organic feel of the pattern manipulation.
- **More Pattern Types:** Explore generative or more complex mathematical patterns (e.g., Voronoi, reaction-diffusion).
- **Performance Optimization:** Investigate using `<canvas>` for highly complex patterns if SVG performance becomes an issue.
- **Save/Load State:** Allow users to save their favorite pattern combinations and settings.