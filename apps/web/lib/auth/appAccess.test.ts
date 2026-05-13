import { describe, expect, it } from 'vitest'
import { hasAppAccess, hasCompletedOnboarding } from './appAccess'

describe('hasAppAccess', () => {
  it('allows profiles with completed phone verification', () => {
    expect(
      hasAppAccess({ phone_verified_at: '2026-05-13T00:00:00.000Z' })
    ).toBe(true)
  })

  it('blocks profiles without completed phone verification', () => {
    expect(hasAppAccess({ phone_verified_at: null })).toBe(false)
    expect(hasAppAccess(null)).toBe(false)
  })
})

describe('hasCompletedOnboarding', () => {
  const completeProfile = {
    display_name: 'Ian',
    neighborhood_id: 'neighborhood-1',
    onboarding_completed_at: '2026-05-13T00:00:00.000Z',
    phone_verified_at: '2026-05-13T00:00:00.000Z',
  }

  it('allows phone-verified profiles with required onboarding fields', () => {
    expect(hasCompletedOnboarding(completeProfile)).toBe(true)
  })

  it('requires phone verification before onboarding can be complete', () => {
    expect(
      hasCompletedOnboarding({
        ...completeProfile,
        phone_verified_at: null,
      })
    ).toBe(false)
  })

  it('blocks profiles missing required onboarding fields', () => {
    expect(
      hasCompletedOnboarding({
        ...completeProfile,
        display_name: '',
      })
    ).toBe(false)
    expect(
      hasCompletedOnboarding({
        ...completeProfile,
        neighborhood_id: null,
      })
    ).toBe(false)
    expect(
      hasCompletedOnboarding({
        ...completeProfile,
        onboarding_completed_at: null,
      })
    ).toBe(false)
  })
})
