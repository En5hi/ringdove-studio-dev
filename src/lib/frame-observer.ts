const sectionEl = document.getElementById('section-name');
const pageEl = document.getElementById('page-counter');

if (sectionEl && pageEl) {
  // Seed the frame's section + counter from the first plate on the page so the
  // initial paint is correct on every route (discipline pages, /404, etc.).
  // Elements that opt out via [data-frame-skip] manage the frame themselves —
  // the work-sticky block is the current example.
  const firstPlate = document.querySelector<HTMLElement>(
    '[data-section]:not([data-frame-skip])',
  );
  if (firstPlate) {
    // Use the attribute's presence rather than truthiness — a plate may
    // intentionally publish an empty section label (the hero, for one).
    if (firstPlate.dataset.section !== undefined)
      sectionEl.innerHTML = firstPlate.dataset.section;
    if (firstPlate.dataset.page) pageEl.textContent = `Plate ${firstPlate.dataset.page}`;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          const target = e.target as HTMLElement;
          const sec = target.dataset.section;
          const page = target.dataset.page;
          if (sec !== undefined) sectionEl.innerHTML = sec;
          if (page) pageEl.textContent = `Plate ${page}`;
        }
      }
    },
    { threshold: [0.45, 0.6, 0.75] },
  );

  document
    .querySelectorAll<HTMLElement>('[data-section]:not([data-frame-skip])')
    .forEach((el) => io.observe(el));
}
