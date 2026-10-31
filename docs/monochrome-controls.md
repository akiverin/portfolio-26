# Monochrome interface

The portfolio uses independently implemented, neutral controls informed by the
interaction patterns on [apple.com](https://www.apple.com/) and the
[iPhone product page](https://www.apple.com/iphone/). No Apple code, graphics,
fonts or downloadable design-kit components are embedded.

The [official design resources](https://developer.apple.com/design/resources/)
provide platform mock-up kits. Their [license](https://developer.apple.com/support/downloads/terms/apple-design-resources/Apple-Design-Resources-License-20230621-English.pdf)
does not authorize embedding those resources into this website. Existing React,
native HTML and SCSS implement the controls without an additional UI dependency.

## Components

- `ActionButton`: primary fill, secondary outline, tertiary soft fill, text action
  and circular icon action. Four sizes: 28, 36, 44 and 56 px; touch targets have a
  44 px minimum. Optional leading/trailing icons remain supported.
- `ActionLink`: the same variants with native URL semantics, internal routing,
  new-tab support and an optional CSS chevron. Disabled links have no `href`.
- `SegmentedControl`: controlled native radio group with keyboard navigation.
- Native `details/summary`: disclosure example with plus/minus in the playground.
- `Button`: compatibility entry point for existing forms.

Use one primary action per group. Prefer a text link with a chevron for secondary
navigation, and labelled text for actions that do not require an icon. Menu,
password visibility, close, zoom and similar controls retain meaningful icons.

Controls inherit `--control-*` colors. `surface="light"` or `surface="dark"`
overrides a single control; containers can set the variables for an entire group.
The admin theme supplies both palettes. Medeo remains the self-hosted UI font.

There are no Film gradients, moving button highlights or hover translations.
Focus, disabled, loading, pressed, current-page and reduced-motion states remain
available. Loading retains the label's width. The ASCII scene computes neutral
luminance in its existing fragment shader; its fallback image is grayscale.
Scroll-driven parallax, pause/resume and rendering lifecycle remain unchanged.
The five custom SVG cursors fit within 24 × 24 px with preserved proportions;
their CSS hotspots scale with the artwork.

## Review

Open `/playground/buttons` for light/dark examples, states, icon placement,
sizes, disclosures and segmented controls. Run against the dev server:

```sh
rtk proxy node scripts/monochrome-ui-smoke.mjs
```

`UI_QA_URL` targets a production preview. The suite checks font requests,
neutral interface paint, responsive overflow, controls, native keyboard behavior,
touch sizes, authentication controls and a simulated admin modal/sidebar. The
admin simulation never signs into an account or saves data.
