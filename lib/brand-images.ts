/**
 * Brand imagery — source assets live in repo `/images`; served from `/public/images`.
 * Filenames map to export titles: hero, header bar, midlife problem, homepage support, inside-out abstract.
 *
 * Note: `r1-hero.png` and `r1-header.png` were copied from sources that are currently the same file;
 * replace one in `/public/images` if you want a thinner abstract texture in the header vs the hero photo.
 */
const paths = {
  heroHomepage: '/images/r1-hero.png',
  headerBar: '/images/r1-header.png',
  midlifeCloseUp: '/images/r1-midlife-close-up.png',
  homepageSupport: '/images/r1-homepage-support.png',
  insideOutVisual: '/images/r1-inside-out-visual.png',
} as const

export const brandImages = {
  ...paths,
  /** Quiz flow background — same asset as midlife editorial portrait. */
  quizIllustration: paths.midlifeCloseUp,
  /** Results hero — inside-out abstract visual. */
  protocolReveal: paths.insideOutVisual,
  /** Reserved for product still-life contexts. */
  product: paths.homepageSupport,
  /** Reserved for lifestyle editorial contexts. */
  lifestyle: paths.homepageSupport,
} as const

export const brandImageAlts = {
  heroHomepage:
    'R1 hero: warm editorial portrait and skincare moment—premium regenerative beauty.',
  headerBar: 'R1 header: soft tonal texture for navigation bar background.',
  midlifeCloseUp: 'R1 mid-life woman close-up: thoughtful, composed portrait in warm light.',
  homepageSupport:
    'R1 product and ritual: homepage supporting still life—formulas and daily ritual.',
  insideOutVisual: 'R1 inside-out abstract visual—biology and skincare as one system.',
  quizIllustration: 'R1 mid-life woman close-up: thoughtful, composed portrait in warm light.',
  protocolReveal: 'R1 inside-out abstract visual—biology and skincare as one system.',
  product:
    'R1 product and ritual: homepage supporting still life—formulas and daily ritual.',
  lifestyle:
    'R1 product and ritual: homepage supporting still life—formulas and daily ritual.',
} as const
