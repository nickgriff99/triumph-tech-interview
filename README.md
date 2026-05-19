# Rock Solid Church — responsive mockup

Hi there! I have created the following single-page church landing wireframe using the requirements located with the Figma file provided.

## Requirements checklist

### Bootstrap (grid + components)

- **`index.html`** — `container` / `container-fluid`, `row` / `col-*`, `navbar`, `collapse`, `dropdown`, `card`, `btn`, `ratio`, `list-inline`, and related components.
- **CDN** — Bootstrap **5.3.3** CSS and JS bundle linked in `index.html`.

### Utility classes (spacing, alignment, responsiveness)

- **`index.html`** — utilities such as `py-5`, `mb-3`, `text-center`, `d-flex`, `justify-content-center`, `gap-2`, `fw-bold`, `d-none d-xl-inline-flex`, `flex-column flex-sm-row`, and similar classes throughout the page.

### Semantic HTML5

- **Landmarks & structure** — `header` / `nav`, `main`, `section` (with `aria-labelledby`), `article`, `footer`, `address`.
- **Accessibility** — skip link to `#main`, stable heading/section relationships.

### Custom CSS alongside Bootstrap

- **`css/styles.css`** — theme, layout polish, components, and motion.
- **`css/responsive.css`** — additional breakpoints and tweaks aligned with Bootstrap’s scale.
- Bootstrap continues to supply typography, spacing, and component defaults where utility/component classes are used.

### Animations, hovers, and UI state

- **`css/styles.css`** — `transition` on interactive elements; `@keyframes` (e.g. mission waves, nav dropdown treatment).
- **Scroll reveals** — `.scroll-fade` styles in CSS; **`js/main.js`** toggles `.is-visible` via `IntersectionObserver` (elements can re-hide when scrolled away unless `data-scroll-fade-once="true"`); respects reduced motion.
- **Hero** — pointer-driven background pan + scroll-linked fade on hero copy (`--hero-scroll`), both off when `prefers-reduced-motion: reduce`.
- **Bootstrap behavior** — navbar **collapse** / **dropdown** use standard Bootstrap JS; mobile nav closes after a menu link tap in **`js/main.js`** (custom collapse/dropdown choreography removed for maintainability).

### Slider library (Swiper)

- **`index.html`** — Swiper **11** `swiper-bundle` CSS and JS.
- **`js/main.js`** — `.volunteer-swiper`: touch/swipe, `grabCursor`, draggable **scrollbar**, responsive **`breakpoints`**.
- **Autoplay** — enabled in **`js/main.js`** (~4.5s between slides, pauses on hover, resumes after manual swipe); off when `prefers-reduced-motion: reduce`.

### Full responsiveness

- **Bootstrap** — `col-md-*`, `col-lg-*`, `navbar-expand-xl`, and related responsive utilities.
- **`css/responsive.css`** — e.g. rules aligned near Bootstrap `lg` (~992px).
- **Layout & carousel** — stacked hero CTAs (`flex-column` → `flex-sm-row`); Swiper `breakpoints` for the volunteer strip.

## Run locally

Open `index.html` in a browser (or serve the folder with any static server). Subpages: `pages/notavailableyet.html`, `pages/nosocials.html`.
