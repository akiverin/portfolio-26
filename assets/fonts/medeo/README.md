# Medeo web fonts

Source: [DNFDEVS/medeo-font](https://github.com/DNFDEVS/medeo-font), pinned to
`a67da3062336585ebd9ab7a4553e0bad3a0cc64d` (RC4).

## License and provenance

The upstream [SIL Open Font License 1.1](https://github.com/DNFDEVS/medeo-font/blob/a67da3062336585ebd9ab7a4553e0bad3a0cc64d/OFL.txt)
permits personal/commercial website use, embedding, modification and redistribution.
Redistributed font files must retain the copyright notices and OFL; the font must
not be sold on its own. No Reserved Font Name is declared in the upstream license.
The website itself is not required to use the OFL.

Unmodified source WOFF2 files are in `source/`. Full upstream copyright/license,
authors and font history are shipped under `public/fonts/medeo/`; font metadata is
also retained in the generated files. `FONTLOG.txt` records the web modifications.
`manifest.json` records the source revision, output sizes, axes and SHA-256 hashes.

## Runtime integration

- Self-hosted WOFF2 files in `src/shared/styles/fonts/Medeo/`; no font CDN requests.
- Sans normal is preloaded once from `index.html`. Vite fingerprints the same URL
  used by CSS. Sans italic and Mono are requested only when used.
- `font-display: swap`, metric-adjusted Arial fallback, automatic optical sizing.
- Variable weight range 400–900, covering the site's current weights; Sans optical
  size range 14–32 is preserved. Latin, Cyrillic, combining marks, punctuation,
  currency, arrows and common symbols are retained. Other scripts use fallbacks.
- Medeo Sans is the global UI/Mantine font; Mono is used for code and metadata.
  The SVG wordmark remains outlined artwork. The ASCII landscape keeps its
  existing fixed-cell renderer font so its geometry remains stable.

| Font | Web bytes |
| --- | ---: |
| Sans variable | 277,060 |
| Sans italic variable | 294,908 |
| Mono variable | 62,592 |

The initial normal font is about 277 KB, replacing four normal Pretendard files
totaling 3,053,968 bytes (90.9% less). These are font payload sizes, not total page
transfer sizes. The old font source files are no longer imported or bundled.

## Rebuild

Use Python with `fonttools[woff]==4.68.0` installed, then run from the repository:

```sh
rtk proxy python assets/fonts/medeo/build-webfonts.py
```

The script narrows the weight axis, subsets glyphs while preserving OpenType
features and license/name metadata, verifies key Latin/Cyrillic glyphs and writes
the manifest. These are build-time tools only; no runtime dependency is added.

## Verification

`scripts/medeo-ui-smoke.mjs` checks actual custom font rendering in Chromium,
Cyrillic/bold loading, local network requests, responsive overflow and button
behavior against a local dev server. `UI_QA_URL` can target a production preview.
