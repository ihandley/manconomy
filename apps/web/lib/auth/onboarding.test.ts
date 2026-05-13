import { describe, expect, it } from 'vitest'
import { validateOnboardingForm } from './onboarding'

function createFormData(fields: Record<string, string>) {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    formData.set(key, value)
  })

  return formData
}

describe('validateOnboardingForm', () => {
  const validNeighborhoodIds = new Set(['neighborhood-1'])

  it('blocks missing display names', () => {
    expect(
      validateOnboardingForm(
        createFormData({
          display_name: ' ',
          neighborhood_id: 'neighborhood-1',
        }),
        validNeighborhoodIds
      )
    ).toEqual({ ok: false, message: 'Enter a display name.' })
  })

  it('blocks missing neighborhoods', () => {
    expect(
      validateOnboardingForm(
        createFormData({
          display_name: 'Ian',
          neighborhood_id: '',
        }),
        validNeighborhoodIds
      )
    ).toEqual({ ok: false, message: 'Choose a neighborhood.' })
  })

  it('blocks unavailable neighborhoods', () => {
    expect(
      validateOnboardingForm(
        createFormData({
          display_name: 'Ian',
          neighborhood_id: 'missing-neighborhood',
        }),
        validNeighborhoodIds
      )
    ).toEqual({
      ok: false,
      message: 'Choose one of the available neighborhoods.',
    })
  })

  it('returns trimmed values for valid submissions', () => {
    expect(
      validateOnboardingForm(
        createFormData({
          display_name: ' Ian ',
          neighborhood_id: 'neighborhood-1',
        }),
        validNeighborhoodIds
      )
    ).toEqual({
      ok: true,
      fields: {
        displayName: 'Ian',
        neighborhoodId: 'neighborhood-1',
      },
    })
  })
})
