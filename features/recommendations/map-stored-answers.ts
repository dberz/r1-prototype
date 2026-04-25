import { QUIZ_QUESTIONS } from '@/features/quiz/questions'
import type { QuizInputs } from './engine'

/** Rebuild engine inputs from `quiz_answers` rows (answer_value matches API storage). */
export function mapStoredAnswersToQuizInputs(
  rows: { question_key: string; answer_value: string }[]
): QuizInputs | null {
  const m = new Map(rows.map((r) => [r.question_key, r.answer_value]))
  for (const q of QUIZ_QUESTIONS.filter((item) => item.required !== false)) {
    if (!m.has(q.key) || m.get(q.key) === '') {
      // Allow legacy sessions that used the previous question schema.
      if (!m.has('age_band') || !m.has('primary_concerns')) return null
      break
    }
  }

  const get = (key: string): string => m.get(key) ?? ''
  const getAny = (...keys: string[]): string => keys.map((k) => m.get(k) ?? '').find(Boolean) ?? ''
  const parseMulti = (key: string): string[] =>
    getAny(key)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

  // Backward-compatible if older quiz schema is present.
  const legacyAgeBand = getAny('age_band')
  if (legacyAgeBand) {
    return {
      ageBand: legacyAgeBand,
      hormoneStage: get('hormone_stage'),
      hrtStatus: get('hrt_status'),
      skinSensitivity: get('skin_sensitivity') as QuizInputs['skinSensitivity'],
      skinType: get('skin_type'),
      vitaminAExperience: get('vitamin_a_experience') as QuizInputs['vitaminAExperience'],
      primaryConcerns: parseMulti('primary_concerns'),
      primaryGoals: parseMulti('primary_goals'),
      pregnancyStatus: get('pregnancy_status') as QuizInputs['pregnancyStatus'],
      sunExposure: get('sun_exposure'),
      readyForStronger: get('ready_for_stronger') === 'ready',
      supportConfidence: get('support_preference'),
    }
  }

  // New diagnosis-first quiz schema -> deterministic mapping to existing engine.
  const ageRange = getAny('age_range')
  const moment = getAny('moment_of_change')
  const stoppedWorking = getAny('stopped_working')
  const skinResponse = getAny('skin_response_now')
  const concernsNow = parseMulti('primary_concerns_now')
  const lifestyle = parseMulti('lifestyle_signals')

  const ageBandMap: Record<string, string> = {
    under_35: '35-39',
    '35_40': '35-39',
    '40_45': '40-44',
    '45_50': '45-49',
    '50_plus': '50-54',
  }

  const mappedConcerns = concernsNow
    .flatMap((c) => {
      const concernMap: Record<string, string[]> = {
        fine_lines_wrinkles: ['fine_lines'],
        thinner_less_firm: ['firmness'],
        dullness_loss_glow: ['texture'],
        dark_spots_uneven_tone: ['pigmentation'],
        sensitivity_irritation: ['sensitivity'],
        new_breakouts: ['breakouts'],
        not_same_skin: ['texture'],
      }
      return concernMap[c] ?? []
    })
    .filter(Boolean)

  const hormoneStage: QuizInputs['hormoneStage'] =
    ageRange === '45_50' || ageRange === '50_plus' || moment === 'last_1_2_years'
      ? 'perimenopausal'
      : 'premenopausal'

  const skinSensitivity: QuizInputs['skinSensitivity'] =
    skinResponse === 'easily_irritated' || concernsNow.includes('sensitivity_irritation')
      ? 'high'
      : skinResponse === 'dry_no_matter_what' || skinResponse === 'breaks_out_unpredictably'
        ? 'medium'
        : 'low'

  const vitaminAExperience: QuizInputs['vitaminAExperience'] =
    stoppedWorking === 'retinol_vitamin_a'
      ? skinSensitivity === 'high'
        ? 'otc_retinol_weak'
        : 'otc_retinol_strong'
      : 'none'

  const primaryGoals = ['long_term_health', 'maintain_youthfulness', 'even_tone']
  if (mappedConcerns.includes('firmness') || mappedConcerns.includes('fine_lines')) {
    primaryGoals.push('reverse_aging')
  }
  if (mappedConcerns.includes('breakouts')) {
    primaryGoals.push('clear_skin')
  }

  return {
    ageBand: ageBandMap[ageRange] ?? '40-44',
    hormoneStage,
    hrtStatus: 'none',
    skinSensitivity,
    skinType: skinResponse === 'dry_no_matter_what' ? 'dry' : 'combination',
    vitaminAExperience,
    primaryConcerns: mappedConcerns.length ? mappedConcerns : ['texture'],
    primaryGoals: Array.from(new Set(primaryGoals)),
    pregnancyStatus: 'not_applicable',
    sunExposure: 'moderate',
    readyForStronger: lifestyle.length > 0 && skinSensitivity !== 'high',
    supportConfidence: 'guided',
  }
}
