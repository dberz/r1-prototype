import { QUIZ_QUESTIONS } from '@/features/quiz/questions'
import type { QuizInputs } from './engine'

/** Rebuild engine inputs from `quiz_answers` rows (answer_value matches API storage). */
export function mapStoredAnswersToQuizInputs(
  rows: { question_key: string; answer_value: string }[]
): QuizInputs | null {
  const m = new Map(rows.map((r) => [r.question_key, r.answer_value]))
  for (const q of QUIZ_QUESTIONS) {
    if (!m.has(q.key) || m.get(q.key) === '') return null
  }

  const get = (key: string) => m.get(key) as string
  const parseMulti = (key: string): string[] =>
    get(key)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

  return {
    ageBand: get('age_band'),
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
