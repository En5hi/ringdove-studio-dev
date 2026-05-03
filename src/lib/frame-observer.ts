const sectionEl = document.getElementById('section-name');
const pageEl = document.getElementById('page-counter');

if (sectionEl && pageEl) {
  // Seed the frame's section + counter from the first plate on the page so the
  // initial paint is correct on every route (discipline pages, /404, etc.).
  const firstPlate = document.querySelector<HTMLElement>('[data-section]');
  if (firstPlate) {
    if (firstPlate.dataset.section) sectionEl.innerHTML = firstPlate.dataset.section;
    if (firstPlate.dataset.page) pageEl.textContent = `Plate ${firstPlate.dataset.page}`;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.45) {
          const target = e.target as HTMLElement;
          const sec = target.dataset.section;
          const page = target.dataset.page;
          if (sec) sectionEl.innerHTML = sec;
          if (page) pageEl.textContent = `Plate ${page}`;
        }
      }
    },
    { threshold: [0.45, 0.6, 0.75] },
  );

  document.querySelectorAll<HTMLElement>('[data-section]').forEach((el) => io.observe(el));
}
