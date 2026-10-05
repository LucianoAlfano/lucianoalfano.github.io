# Portfolio image setup

Place project images in an `images` folder and replace an image placeholder with:

```html
<div class="main-media project-photo reveal">
  <img src="images/wildspark-hero.webp" alt="Wildspark gameplay screen">
</div>
```

Add this CSS to the end of `style.css` if using real images:

```css
.project-photo { overflow: hidden; border-radius: 14px; border: 1px solid var(--line); }
.project-photo img { width: 100%; height: 100%; min-height: 500px; display: block; object-fit: cover; }
.gallery.project-photo img { min-height: 250px; }
```

Suggested names:
- images/wildspark-hero.webp
- images/wildspark-gameplay.webp
- images/wildspark-mobile.webp
- images/pcb-hero.webp
- images/pcb-schematic.webp
- images/pcb-layout.webp
- images/satellite-hero.webp
- images/satellite-cad.webp
- images/satellite-build.webp
- images/laser-fixture-hero.webp
- images/laser-fixture-cad.webp
- images/laser-fixture-result.webp
