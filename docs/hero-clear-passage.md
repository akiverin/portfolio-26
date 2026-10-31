# Hero «Ясный проход»

The home page renders an interactive ASCII coastal passage, with live HTML typography and controls. The landscape is not an animated GIF, a video, or a screenshot of the interface.

## Scene

`src/widgets/HeroSection/ui/AsciiLandscape/` owns one WebGL canvas. A single full-screen quad samples a generated landscape plate, a depth texture and a small reusable digit atlas. Every cell has its own clock: digits crossfade at different times, water has a slow current and a restrained traveling light changes their intensity. Empty sky stays quiet behind the heading. The depth field controls the amount of **scroll-driven** displacement. Moving the mouse does not move the scene.

`HeroSection` owns the real heading, working project/contact links, an accessible pause control and a blue volumetric ASCII mascot matching the selected close-up reference. The Hero sits outside the bounded section wrapper, so it fills the available page viewport on wide screens as well as inside the authenticated frame. The existing header stays available for guests; the authenticated shell continues to provide navigation.

The mascot is a generated transparent WebP (`src/assets/hero/mascot-ascii-3d.webp`): its dense typographic surface and lighting preserve the three-dimensional reference appearance. A small masked light sweep and gentle float animate the figure; its surface numerals are baked into the image. The surrounding landscape digits are rendered live by WebGL. Mascot animation respects pause, offscreen state and reduced motion. Its source PNG and exact image_gen prompt are saved alongside the scene sources.

The header uses the outlined SVG logo from selected direction 07 (`src/assets/brand/logo-07-blue.svg`), preserving its symbol, lettering paths and ordinary dot above i. Only the symbol and wordmark colors are adapted to the blue Hero palette.

## Responsive assets

- Desktop landscape plate and depth map: `src/assets/hero/clear-passage.webp`, `clear-passage-depth.webp`.
- A separately generated portrait plate and depth map: `clear-passage-mobile.webp`, `clear-passage-mobile-depth.webp`.
- Portrait screens up to 1023px use the portrait composition; landscape screens use the wide composition. This preserves the cave framing instead of cropping away the passage on phones.
- The selected plate is also the static fallback while textures load, when WebGL is unavailable, or after context loss. The renderer rebuilds after context restoration.

Generated sources, full prompts, depth-map previews and their rebuilding script are kept under `assets/hero-explorations/ascii-cinema-4k/implementation/`. Production assets keep their native source resolution; the live glyph grid is generated at runtime independently of the source pixels.

## Motion and resource limits

- No React state updates per animation frame. One WebGL draw call per scene frame.
- At most 30 updates/second on desktop and 24 on coarse-pointer devices, with a three-million-pixel drawing-buffer budget and a capped device pixel ratio.
- Sustained slow frames lower the drawing resolution; the CSS size of glyphs stays consistent.
- The scheduler stops outside the viewport, while the document is hidden, on user pause and with `prefers-reduced-motion`. The mascot also pauses when the canvas stops.
- Both the document scroller and the authenticated `[data-page-scroll]` viewport are supported.
- Resize observers, media-query listeners, scroll handlers, timers and GPU resources are removed on teardown, including React StrictMode remounts and responsive source changes.
- Text remains selectable, readable by assistive technology and independent of canvas rendering. The decorative canvas and mascot are hidden from the accessibility tree.

## Validation

```sh
rtk proxy npm run ts-check
rtk proxy npm run lint
rtk proxy npm run stylelint
rtk proxy node scripts/hero-smoke.mjs
```

The browser script writes screenshots and `report.json` to `assets/hero-explorations/ascii-cinema-4k/implementation/qa/`. It checks real pixel changes and WebGL uniforms, scroll parallax and the absence of mouse-driven displacement, pause/resume, reduced motion, visibility, responsive layout, links, the authenticated scroll viewport, and loss/unavailability of WebGL. It uses an isolated browser context and a simulated store for the authenticated layout; it does not sign in to a real account.

Timing results from headless Chromium using SwiftShader measure that test environment. They are not a guarantee of hardware GPU frame rates on every device. Run the same checks against a production preview and inspect on target hardware when profiling a release.
