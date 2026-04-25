export type QuizQuestion = {
  key: string
  step: number
  type: 'single' | 'multi' | 'scale'
  required?: boolean
  question: string
  subtitle?: string
  educationNote?: string // appears below question, teaches while asking
  options: { value: string; label: string; description?: string }[]
}

export const QUIZ_TOTAL_STEPS = 11

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    step: 2,
    key: 'primary_concerns_now',
    type: 'multi',
    question: "What's bothering you most right now?",
    options: [
      { value: 'fine_lines_wrinkles', label: 'Fine lines and wrinkles' },
      { value: 'thinner_less_firm', label: 'Skin feels thinner or less firm' },
      { value: 'dullness_loss_glow', label: 'Dullness or loss of glow' },
      { value: 'dark_spots_uneven_tone', label: 'Dark spots or uneven tone' },
      { value: 'sensitivity_irritation', label: 'Increased sensitivity or irritation' },
      { value: 'new_breakouts', label: "Breakouts that weren't there before" },
      { value: 'not_same_skin', label: 'Nothing specific, just not the same skin' },
    ],
  },
  {
    key: 'moment_of_change',
    step: 3,
    type: 'single',
    question: 'When did you start noticing these changes?',
    options: [
      { value: 'recent_6_months', label: 'Recently (last 6 months)' },
      { value: 'last_1_2_years', label: 'Over the last 1-2 years' },
      { value: 'gradual_over_time', label: 'Gradually over time' },
      {
        value: 'after_life_change',
        label: 'After a specific life change (pregnancy, stress, etc.)',
      },
    ],
  },
  {
    key: 'stopped_working',
    step: 4,
    type: 'single',
    question: "What used to work that doesn't anymore?",
    options: [
      { value: 'retinol_vitamin_a', label: 'Retinol / Vitamin A products' },
      { value: 'expensive_serums', label: 'Expensive serums' },
      { value: 'moisturizers_alone', label: 'Moisturizers alone' },
      { value: 'facials_treatments', label: 'Facials / treatments' },
      { value: 'nothing_worked', label: 'Nothing has really worked' },
    ],
  },
  {
    key: 'skin_response_now',
    step: 5,
    type: 'single',
    question: 'How does your skin react now?',
    options: [
      { value: 'easily_irritated', label: 'Easily irritated' },
      { value: 'dry_no_matter_what', label: 'Feels dry no matter what' },
      { value: 'dull_even_healthy', label: "Looks dull even when I'm healthy" },
      { value: 'breaks_out_unpredictably', label: 'Breaks out unpredictably' },
      { value: 'thinner_weaker', label: 'Feels thinner or weaker' },
    ],
  },
  {
    key: 'lifestyle_signals',
    step: 6,
    type: 'multi',
    question: 'Which of these feel true?',
    options: [
      { value: 'sleep_well_look_tired', label: 'I sleep well but still look tired' },
      { value: 'eat_well_no_reflection', label: "I eat well but my skin doesn't reflect it" },
      { value: 'stress_shows_in_skin', label: 'Stress shows up in my skin' },
      { value: 'alcohol_hits_harder', label: 'Alcohol affects my skin more than it used to' },
    ],
  },
  {
    key: 'age_range',
    step: 7,
    type: 'single',
    required: false,
    question: 'Which range are you in?',
    subtitle: 'Optional',
    options: [
      { value: 'under_35', label: 'Under 35' },
      { value: '35_40', label: '35-40' },
      { value: '40_45', label: '40-45' },
      { value: '45_50', label: '45-50' },
      { value: '50_plus', label: '50+' },
    ],
  },
]
