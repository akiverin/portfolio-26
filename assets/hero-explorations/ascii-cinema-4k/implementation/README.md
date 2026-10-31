# «Ясный проход»: исходники для живого Hero

## Production assets

- `src/assets/hero/clear-passage.webp`: generated landscape plate, **1672 × 941**, 292,058 bytes. No UI, text, mascot or baked ASCII characters. Kept at the generator's native output size; no upscale.
- `src/assets/hero/clear-passage-depth.webp`: matched grayscale depth map, **1672 × 941**, 24,058 bytes, lossless.

The source plate is sampled by the live ASCII renderer. It is not a screenshot of the Hero, so the HTML typography stays sharp and accessible while glyphs can change independently.

## Composition and depth convention

- Normalized coordinates use the top-left as `(0, 0)`.
- Sky is far, depth `0`; clean area for the centered headline is approximately `x = .34–.86, y = .12–.56`.
- Cave walls and foreground rocks are near, depth `.88–1.0`.
- Sea starts at horizon `y = .764`, depth `.16`, increasing to `.5` at the bottom.
- Distant coastal formations are around depth `.32`.
- The left foreground ledge supports the separate blue mascot near `(x = .34, y = .61)`.
- Depth boundaries are slightly feathered to avoid hard displacement seams. The map contains no texture noise.

## Reproduction

`clear-passage-source.png` preserves the generated source. `background-prompt.md` records the full built-in image_gen prompt. `clear-passage-depth-preview.png` is a human-readable preview of the technical map. The production WebP and map can be rebuilt using Pillow and NumPy:

```sh
rtk proxy python3 assets/hero-explorations/ascii-cinema-4k/implementation/prepare-assets.py
```

This script only encodes the generated plate and builds its technical depth map. It does not paint or retouch the generated scene.

## Mobile art direction

`clear-passage-mobile-source.png` is a separately generated portrait scene, not a desktop crop. The production image is `src/assets/hero/clear-passage-mobile.webp` (941 × 1672, 258,122 bytes); its matched `clear-passage-mobile-depth.webp` is lossless (25,200 bytes).

The mobile sky opening is large and calm through roughly `y = .55`; the cloud banks appear around its lower edges, and the sea horizon is at `y = .723`. The left foreground ledge is around `(x = .19, y = .635)`. The cave frame is intentionally thin at both sides, so portrait rendering should preserve the horizontal edges rather than aggressively crop them on tall phones. Use the portrait source at widths up to 767px. Depth convention is unchanged: near rocks `.88–1.0`, far sky `0`, sea `.16–.5`, distant coastal formations `.31`.

`mobile-background-prompt.md` records its full prompt; `prepare-mobile-assets.py` rebuilds only the portrait production files and technical depth map.
