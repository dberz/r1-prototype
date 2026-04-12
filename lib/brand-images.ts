/**
 * Brand imagery — files live in /public/images (see Brand Spec v2 §11).
 * Source assets may also exist under /images at project root; deploy uses /public only.
 */
export const brandImages = {
  heroHomepage: '/images/hero-homepage.png',
  quizIllustration: '/images/quiz-illustration.png',
  product: '/images/product.png',
  protocolReveal: '/images/protocol-reveal.png',
  lifestyle: '/images/lifestyle.png',
} as const

export const brandImageAlts = {
  heroHomepage:
    'Editorial beauty photograph: warm light on luminous, composed skin—premium skincare aesthetic.',
  quizIllustration: '',
  product:
    'Still life: minimalist glass pump bottle on a soft cream surface with warm studio light.',
  protocolReveal:
    'Hands holding a printed card suggesting a personalized skincare protocol in warm light.',
  lifestyle:
    'Editorial lifestyle: calm morning at a clean counter with water—composed, intentional energy.',
} as const
