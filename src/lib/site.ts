export const SITE = {
  name: 'Ringdove',
  legalName: 'RINGDOVE SP. Z O.O.',
  url: 'https://ringdove.studio',
  description:
    'A craft-led design studio for product interfaces and audio plugin design. Two disciplines, one standard.',
  email: 'hello@ringdove.studio',
  location: 'Kraków, Poland',
  coords: '50.0647° N · 19.9450° E',
  colophon: 'Set in Times & Author · MMXXVI',
  side: {
    left: 'A design studio · Currently designing for Polyphon & Lattice · Open for Q3',
    right: 'Located in Kraków · CET · Working remotely · Issue Nº 04 · Spring 2026',
  },
  hero: {
    headline: 'Quiet design for digital products that <em>repay attention.</em>',
    floor: {
      left: 'A design studio',
      center: 'Two disciplines, one standard.',
      right: 'Est. MMXXIV',
    },
  },
  contact: {
    write: { sub: 'For new work or a quiet conversation.' },
    located: { sub: 'CET · Working remotely.' },
    currently: { headline: 'Open for Q3', sub: 'Two slots, both tracks.' },
  },
} as const;

export const ROMAN: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
};
