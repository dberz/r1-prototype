export type QuizQuestion = {
  key: string
  step: number
  type: 'single' | 'multi' | 'scale'
  question: string
  subtitle?: string
  educationNote?: string // appears below question, teaches while asking
  options: { value: string; label: string; description?: string }[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    key: 'age_band',
    step: 1,
    type: 'single',
    question: "Let's start with where you are. How old are you?",
    subtitle: 'Age is one of the most important factors in designing your protocol.',
    options: [
      { value: '35-39', label: '35–39' },
      { value: '40-44', label: '40–44' },
      { value: '45-49', label: '45–49' },
      { value: '50-54', label: '50–54' },
      { value: '55-60', label: '55–60' },
      { value: '60+', label: '60+' },
    ],
  },
  {
    key: 'hormone_stage',
    step: 2,
    type: 'single',
    question: 'Where are you in your hormonal journey?',
    educationNote:
      'Estrogen decline begins in the late 30s and accelerates skin cell aging. Your protocol accounts for where you are.',
    options: [
      {
        value: 'premenopausal',
        label: 'Pre-menopausal',
        description: 'Regular cycles, no significant hormonal shifts yet',
      },
      {
        value: 'perimenopausal',
        label: 'Peri-menopausal',
        description: 'Irregular cycles, hormonal fluctuations',
      },
      {
        value: 'postmenopausal',
        label: 'Post-menopausal',
        description: 'Periods have stopped for 12+ months',
      },
      { value: 'not_sure', label: 'Not sure / prefer not to say' },
    ],
  },
  {
    key: 'hrt_status',
    step: 3,
    type: 'single',
    question: 'Are you currently on hormone replacement therapy (HRT)?',
    options: [
      { value: 'none', label: 'No' },
      { value: 'on_hrt', label: 'Yes' },
      { value: 'considering', label: 'Considering it' },
      { value: 'past', label: 'Was on it, stopped' },
    ],
  },
  {
    key: 'skin_sensitivity',
    step: 4,
    type: 'single',
    question: "How would you describe your skin's sensitivity?",
    educationNote:
      'Sensitivity determines how we introduce vitamin A — too fast and skin rebels.',
    options: [
      {
        value: 'low',
        label: 'Resilient',
        description: 'Rarely reacts to new products',
      },
      {
        value: 'medium',
        label: 'Moderate',
        description: 'Occasionally reacts; needs a gentle intro',
      },
      {
        value: 'high',
        label: 'Sensitive',
        description: 'Frequently reacts, flushes, or breaks out with new products',
      },
    ],
  },
  {
    key: 'skin_type',
    step: 5,
    type: 'single',
    question: "What's your skin type?",
    options: [
      {
        value: 'dry',
        label: 'Dry',
        description: 'Tight, sometimes flaky, rarely oily',
      },
      { value: 'normal', label: 'Normal/Balanced' },
      {
        value: 'combination',
        label: 'Combination',
        description: 'Oily T-zone, drier elsewhere',
      },
      {
        value: 'oily',
        label: 'Oily',
        description: 'Shiny throughout, prone to breakouts',
      },
    ],
  },
  {
    key: 'vitamin_a_experience',
    step: 6,
    type: 'single',
    question: 'Have you used retinol or vitamin A products before?',
    educationNote:
      'This is the most important factor in determining your starting level. Be honest — starting too strong causes irritation and puts people off.',
    options: [
      { value: 'none', label: 'No, never' },
      {
        value: 'otc_retinol_weak',
        label: 'Yes — drugstore/OTC retinol (low strength)',
      },
      {
        value: 'otc_retinol_strong',
        label: 'Yes — stronger OTC retinol or retinaldehyde',
      },
      {
        value: 'rx_retinoid',
        label: 'Yes — prescription retinoid (tretinoin, Retin-A, etc.)',
      },
    ],
  },
  {
    key: 'primary_concerns',
    step: 7,
    type: 'multi',
    question: 'What are your main skin concerns? Select all that apply.',
    options: [
      { value: 'fine_lines', label: 'Fine lines and wrinkles' },
      { value: 'firmness', label: 'Loss of firmness or elasticity' },
      { value: 'texture', label: 'Uneven texture or rough skin' },
      { value: 'pigmentation', label: 'Dark spots or pigmentation' },
      { value: 'breakouts', label: 'Breakouts or congestion' },
      { value: 'dullness', label: 'Dullness or loss of radiance' },
      { value: 'dryness', label: 'Dryness or dehydration' },
      { value: 'sensitivity', label: 'Redness or sensitivity' },
    ],
  },
  {
    key: 'pregnancy_status',
    step: 8,
    type: 'single',
    question: 'Are you currently pregnant, nursing, or trying to conceive?',
    subtitle: 'This affects which vitamin A products are safe for you.',
    options: [
      { value: 'not_applicable', label: 'No' },
      { value: 'pregnant', label: 'Yes, pregnant' },
      { value: 'nursing', label: 'Yes, nursing' },
      { value: 'trying', label: 'Trying to conceive' },
    ],
  },
  {
    key: 'sun_exposure',
    step: 9,
    type: 'single',
    question: 'How much daily sun exposure do you get?',
    educationNote:
      'UV exposure is the #1 driver of skin aging. SPF is non-negotiable in your protocol.',
    options: [
      { value: 'low', label: 'Low — mostly indoors' },
      { value: 'moderate', label: 'Moderate — some daily outdoor time' },
      { value: 'high', label: 'High — significant outdoor time or outdoor job' },
    ],
  },
  {
    key: 'ready_for_stronger',
    step: 10,
    type: 'single',
    question: 'How do you want to approach the protocol?',
    options: [
      {
        value: 'cautious',
        label: 'Slow and steady',
        description: 'Start gentle, build up gradually over 6+ months',
      },
      {
        value: 'ready',
        label: 'Ready to step up',
        description: "I've done this before and want results faster",
      },
    ],
  },
  {
    key: 'primary_goals',
    step: 11,
    type: 'multi',
    question: 'What do you most want to achieve? Pick your top priorities.',
    options: [
      { value: 'reverse_aging', label: 'Reverse visible signs of aging' },
      { value: 'maintain_youthfulness', label: 'Maintain my skin as I age' },
      { value: 'even_tone', label: 'Even skin tone and texture' },
      { value: 'clear_skin', label: 'Clearer, healthier-looking skin' },
      { value: 'long_term_health', label: 'Long-term skin health and resilience' },
      { value: 'simplify_routine', label: 'A simpler routine that actually works' },
    ],
  },
  {
    key: 'support_preference',
    step: 12,
    type: 'single',
    question: 'Finally — what kind of support matters most to you?',
    options: [
      {
        value: 'guided',
        label: 'Guided step-by-step',
        description: 'Tell me exactly what to do and when',
      },
      {
        value: 'informed',
        label: 'Informed but independent',
        description: "Give me the protocol and I'll manage it",
      },
      {
        value: 'expert_access',
        label: 'Expert access when I need it',
        description: 'I want to be able to ask questions when they come up',
      },
    ],
  },
]
