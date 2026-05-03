/*
 * Work-sticky active-state machine.
 *
 * Watches each `.copy-slide` inside `.work-sticky` and, when one crosses the
 * viewport's centre band, marks it active. The active idx propagates to:
 *   - the sticky counter (left column) — `[aria-current="true"]`
 *   - the sticky image stack (right column) — `[data-active]` on the matching slot
 *   - the inactive copy slides — `[data-inactive]` for the fade+blur
 *   - the frame's #section-name and #page-counter (bypassing the global
 *     frame-observer, which is told to skip via [data-frame-skip] on the
 *     containing section)
 *
 * Reduced-motion users still get the active-state propagation (state, not
 * motion); only the inactive-blur class is suppressed.
 */

const root = document.querySelector<HTMLElement>('.work-sticky');

if (root) {
  const counterItems = Array.from(root.querySelectorAll<HTMLElement>('.counter li'));
  const slides = Array.from(root.querySelectorAll<HTMLElement>('.copy-slide'));
  const slots = Array.from(root.querySelectorAll<HTMLElement>('.img-slot'));
  const sectionEl = document.getElementById('section-name');
  const pageEl = document.getElementById('page-counter');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let active = 0;

  const setActive = (idx: number) => {
    if (idx === active) return;
    active = idx;

    for (let i = 0; i < counterItems.length; i++) {
      if (i === idx) counterItems[i].setAttribute('aria-current', 'true');
      else counterItems[i].removeAttribute('aria-current');
    }
    for (let i = 0; i < slots.length; i++) {
      if (i === idx) slots[i].setAttribute('data-active', 'true');
      else slots[i].removeAttribute('data-active');
    }
    if (!reduced) {
      for (let i = 0; i < slides.length; i++) {
        if (i === idx) slides[i].removeAttribute('data-inactive');
        else slides[i].setAttribute('data-inactive', 'true');
      }
    }

    const slide = slides[idx];
    if (sectionEl && slide.dataset.section) sectionEl.innerHTML = slide.dataset.section;
    if (pageEl && slide.dataset.page) pageEl.textContent = `Plate ${slide.dataset.page}`;
  };

  // Seed the initial inactive state — under normal motion all but the first
  // slide are blurred out before the user has scrolled.
  if (!reduced) {
    for (let i = 1; i < slides.length; i++) {
      slides[i].setAttribute('data-inactive', 'true');
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const idx = Number((e.target as HTMLElement).dataset.idx);
        if (Number.isFinite(idx)) setActive(idx);
      }
    },
    {
      // Thin band across the viewport centre — a slide becomes active when
      // its body crosses the band, regardless of slide height.
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0,
    },
  );

  for (const s of slides) io.observe(s);

  // When the user enters the section, seed the frame from the active slide so
  // the section label / page counter are correct on first paint.
  const seedIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const slide = slides[active];
          if (slide && sectionEl && slide.dataset.section)
            sectionEl.innerHTML = slide.dataset.section;
          if (slide && pageEl && slide.dataset.page)
            pageEl.textContent = `Plate ${slide.dataset.page}`;
        }
      }
    },
    { threshold: 0 },
  );
  seedIo.observe(root);
}
