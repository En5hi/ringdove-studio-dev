const sectionEl = document.getElementById('section-name');
const pageEl = document.getElementById('page-counter');

if (sectionEl && pageEl) {
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
