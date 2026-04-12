import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base — warmth over stark contrast (Brand Spec v2 §5)
        'brand-ivory': '#F8F4EF',
        'brand-cream': '#F2EDE6',
        'brand-porcelain': '#FAF7F2',
        // Neutrals
        'brand-mushroom': '#8B7E72',
        'brand-taupe': '#9C8E80',
        'brand-stone': '#C4B8AA',
        'brand-putty': '#D9D0C7',
        // Deep anchors — espresso + plum-charcoal (not stark black)
        'brand-espresso': '#2C1F14',
        'brand-plum': '#2A2228',
        'brand-chocolate': '#3D2E26',
        // Accents — muted bronze, brass, mauve, oxblood (sparingly)
        'brand-bronze': '#9A7A54',
        'brand-brass': '#A68B5B',
        'brand-mauve': '#B08A8A',
        /** @deprecated use brand-mauve */
        'brand-dusty-mauve': '#B08A8A',
        'brand-oxblood': '#6B3A3E',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /** Slightly editorial scale for hero / protocol */
        'display': ['clamp(2.25rem,5vw,3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        /** Restrained depth — premium surfaces */
        'brand-soft':
          '0 1px 0 rgba(44, 31, 20, 0.04), 0 12px 40px -8px rgba(42, 34, 40, 0.12)',
        'brand-card': '0 2px 8px -2px rgba(42, 34, 40, 0.06), 0 1px 0 rgba(44, 31, 20, 0.04)',
        'brand-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
      },
      backgroundImage: {
        'brand-wash':
          'linear-gradient(180deg, #FAF7F2 0%, #F8F4EF 42%, #F2EDE6 100%)',
        'brand-radial':
          'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(154, 122, 84, 0.09), transparent 55%)',
      },
    },
  },
  plugins: [],
}
export default config
