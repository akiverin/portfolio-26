# MacBook wallpaper revision 3

Built-in image generation edit. Landscape input: ../burgundy-meadow-macbook-v2/source-native.png. Product and wallpaper reference: macbook-wallpaper-reference.png, supplied by the user.

Selected by the user for the live footer. Runtime exports use responsive WebP rather than the 8K PNG.

## Final prompt

undefined


## Saved outputs

- source-native.png: 1774 × 887, native imagegen output.
- andkiv-meadow-macbook-wallpaper-8k.png: 7680 × 3840, Lanczos upscale. Not native 8K; no synthetic detail recovery is claimed.

## Runtime exports

- src/assets/footer/macbook-meadow-1920.webp: 1920 × 960, 192,978 bytes.
- src/assets/footer/macbook-meadow-3840.webp: 3840 × 1920, 422,110 bytes.
- src/assets/footer/macbook-meadow-mobile.webp: centered portrait crop, 768 × 1152, 77,630 bytes.

WebP quality 85, method 6. A lazy-loaded picture selects the mobile crop at <=767px and responsive landscape sizes otherwise. The 8K upscale is retained as the review master and is not downloaded by the webpage.
