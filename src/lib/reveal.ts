/*
 * Scroll-driven reveal: elements tagged `.reveal` start out-of-focus and fade up
 * when they cross 15% into the viewport. The initial hidden state is set inline
 * by JS, not in CSS, so prefers-reduced-motion users (who skip this script) and
 * no-JS users see the elements normally instead of stuck-at-opacity-0.
 *
 * Per-element tweaks are read from data attributes:
 *   data-reveal-blur="10"   — initial blur in px (default 6)
 *   data-reveal-offset="16" — initial Y translation in px (default 24)
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  const els = document.querySelectorAll<HTMLElement>('.reveal, .reveal-slow');

  for (const el of els) {
    const blur = el.dataset.revealBlur ?? '6';
    const offset = el.dataset.revealOffset ?? '24';
    el.style.opacity = '0';
    el.style.transform = `translateY(${offset}px)`;
    el.style.filter = `blur(${blur}px)`;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = '';
          el.style.transform = '';
          el.style.filter = '';
          io.unobserve(el);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  for (const el of els) io.observe(el);
}
