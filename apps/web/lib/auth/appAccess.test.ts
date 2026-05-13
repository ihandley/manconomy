import { describe, expect, it } from 'vitest'
import { hasAppAccess } from './appAccess'

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
