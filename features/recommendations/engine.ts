export type QuizInputs = {
  ageBand: string
  hormoneStage: string
  hrtStatus: string
  skinSensitivity: 'low' | 'medium' | 'high'
  skinType: string
  vitaminAExperience:
    | 'none'
    | 'otc_retinol_weak'
    | 'otc_retinol_strong'
    | 'rx_retinoid'
  primaryConcerns: string[]
  primaryGoals: string[]
  pregnancyStatus: 'not_applicable' | 'pregnant' | 'nursing' | 'trying'
  sunExposure: string
  readyForStronger: boolean
  supportConfidence: string
}

export type ProtocolSuggestion = {
  protocolLevel: 'L1' | 'L2' | 'L3'
  ageTrack: 'under_40' | 'over_40'
  cautionFlags: string[]
  consultRequired: boolean
  estrogenFutureCandidate: boolean
  educationTrack: string
  stepUpMilestoneDays: number
  rationale: string
}

const OVER_40_BANDS = ['40-44', '45-49', '50-54', '55-60', '60+']

export function generateProtocolSuggestion(inputs: QuizInputs): ProtocolSuggestion {
  const cautionFlags: string[] = []
  let consultRequired = false
  let protocolLevel: 'L1' | 'L2' | 'L3' = 'L1'

  // Safety: pregnancy override
  if (['pregnant', 'nursing', 'trying'].includes(inputs.pregnancyStatus)) {
    cautionFlags.push('pregnancy_vitamin_a_restriction')
    consultRequired = true
    return {
      protocolLevel: 'L1',
      ageTrack: OVER_40_BANDS.includes(inputs.ageBand) ? 'over_40' : 'under_40',
      cautionFlags,
      consultRequired: true,
      estrogenFutureCandidate: false,
      educationTrack: 'pregnancy-safe',
      stepUpMilestoneDays: 180,
      rationale:
        'Pregnancy or nursing detected — protocol modified for safety. Vitamin A restricted. Consultation recommended.',
    }
  }

  // Determine starting level
  if (inputs.skinSensitivity === 'high' || inputs.vitaminAExperience === 'none') {
    protocolLevel = 'L1'
    if (inputs.skinSensitivity === 'high') {
      cautionFlags.push('high_sensitivity_slow_start')
      consultRequired = true
    }
  } else if (inputs.vitaminAExperience === 'otc_retinol_weak') {
    protocolLevel = inputs.readyForStronger ? 'L2' : 'L1'
  } else if (inputs.vitaminAExperience === 'otc_retinol_strong') {
    protocolLevel = inputs.skinSensitivity === 'low' ? 'L2' : 'L1'
  } else if (inputs.vitaminAExperience === 'rx_retinoid') {
    if (inputs.skinSensitivity === 'low' && inputs.readyForStronger) {
      protocolLevel = 'L3'
    } else if (inputs.skinSensitivity === 'medium') {
      protocolLevel = 'L2'
    } else {
      protocolLevel = 'L1'
    }
  }

  const isOver40 = OVER_40_BANDS.includes(inputs.ageBand)
  const ageTrack = isOver40 ? 'over_40' : 'under_40'

  const estrogenFutureCandidate =
    isOver40 && (inputs.hormoneStage !== 'premenopausal' || inputs.hrtStatus !== 'none')

  const educationTrack = estrogenFutureCandidate
    ? 'midlife-hormonal'
    : protocolLevel === 'L1'
      ? 'beginner-protocol'
      : 'intermediate-protocol'

  const rationale = buildRationale(inputs, protocolLevel, cautionFlags)

  return {
    protocolLevel,
    ageTrack,
    cautionFlags,
    consultRequired,
    estrogenFutureCandidate,
    educationTrack,
    stepUpMilestoneDays: 90,
    rationale,
  }
}

function buildRationale(
  inputs: QuizInputs,
  level: string,
  flags: string[]
): string {
  const parts = [
    `Starting level: ${level}.`,
    inputs.vitaminAExperience === 'none'
      ? 'No prior vitamin A experience — starting conservatively.'
      : `Prior vitamin A experience: ${inputs.vitaminAExperience}.`,
    inputs.skinSensitivity === 'high'
      ? 'High skin sensitivity noted — slow introduction recommended.'
      : '',
    flags.length ? `Caution flags: ${flags.join(', ')}.` : '',
  ].filter(Boolean)
  return parts.join(' ')
}
