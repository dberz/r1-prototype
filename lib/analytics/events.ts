'use client'

import posthog from 'posthog-js'

type EventName =
  | 'quiz_started'
  | 'quiz_question_answered'
  | 'quiz_completed'
  | 'protocol_generated'
  | 'skin_photo_submitted'
  | 'consultation_confirmed'
  | 'results_viewed'
  | 'product_added_to_cart'
  | 'checkout_started'
  | 'estrogen_waitlist_signup'
  | 'dashboard_activated'
  | 'step_up_reminder_sent'

export function track(
  event: EventName,
  properties?: Record<string, string | number | boolean | null>
) {
  // Strip any accidental health data before sending
  const safe = { ...properties }
  const forbidden = [
    'hormone_stage',
    'hrt_status',
    'pregnancy_status',
    'estrogen_eligible',
    'email',
    'name',
  ]
  forbidden.forEach((key) => delete safe[key])

  if (typeof window !== 'undefined') {
    posthog.capture(event, safe)
  }
}
