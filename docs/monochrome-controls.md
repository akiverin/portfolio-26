# Portfolio interface

The portfolio uses independently implemented controls and layouts informed by
[Apple product cards](https://www.apple.com/mac/),
[Apple Newsroom](https://www.apple.com/newsroom/),
[Apple TV](https://tv.apple.com/) and
[Apple's text-field guidance](https://developer.apple.com/design/human-interface-guidelines/text-fields).
No Apple artwork, fonts or design-kit components are embedded.

## Surfaces and layout

The ASCII Hero keeps its animated grayscale landscape and scroll parallax.
Its copy describes the actual service: websites, web applications and interfaces.
Content sections below it use white backgrounds, a shared 1200 px content width,
quiet dividers and responsive grids. The header uses blur without a dark fill.
The authenticated sidebar retains its black frame; the content viewport is white.

The About portrait is the user's provided 940 × 940 color image. Its caption sits
at the top; the main role and three additional roles are separate from the image. The original is
stored at `assets/about/andrey-sunset-source.png`; the 132,384-byte WebP is served
from `src/assets/about/andrey-sunset.webp` with lazy loading and explicit dimensions.

Project cards use a full-width preview, a prominent heading, a primary action and
supporting text links. Achievement cards use an editorial image/category/title/date
hierarchy. Both share `_cards.scss`; portrait and landscape media can fit inside
without cropping. Image inspection and external link semantics remain available.

Generic decorative icons and repeated editorial labels are removed. Grant and
scholarship marks still map the database's `icon` field to the actual organization
SVG in its original colors. Three cards are shown initially: a row on desktop and
a native horizontal scroller on smaller screens. Show all reveals the full grid;
sorting, aggregate support and period/monthly amounts use the existing records.
The compact education/experience selector preserves all four education and two
work entries, and shows one category at a time.

## Controls and forms

- `ActionButton` and `ActionLink`: filled, outlined, soft, text and icon variants;
  optional leading/trailing icons, loading, disabled, pressed and focus states.
- `SegmentedControl`: native radio semantics. The contact form uses its compact,
  full-width variant; touch segments remain at least 44 px tall.
- `Input`, `Textarea`, `Select`: shared outlined field surface, 52 px standard
  height and a clear focus ring. Select uses the native picker, type-ahead and
  mobile chooser rather than an animated custom menu.
- `AnimatedCheckbox`: compatibility name for a native labelled checkbox. The
  achievement date control uses it on the homepage and in the archive.
- `Pagination`: numbered controls with a current-page state, previous/next
  boundaries and a compact current/total layout on small screens.

The contact form has no entrance, hover, spring or success animations. It retains
validation, a 1200-character limit, errors, loading and reset behavior. Inputs and
segments are disabled during submission. Medeo remains the local UI font and the
five custom cursors fit within 24 × 24 px with scaled hotspots.

## Review

`/playground/buttons` shows light/dark controls. Against a running dev server:

```sh
rtk proxy node scripts/monochrome-ui-smoke.mjs
rtk proxy node scripts/forms-content-smoke.mjs
```

The first suite checks real routes, font requests, responsive overflow, shared
controls, authentication utilities and a simulated admin modal/sidebar. The second
mounts the real page/components with browser-only fixture records, verifies grant
marks, dates, sorting, cards, the color portrait, pagination and contact form states
at 1440/768/390/320 px. Form submission is simulated locally; no messages or account
changes are sent. `UI_QA_URL` can target a production preview for the first suite.
