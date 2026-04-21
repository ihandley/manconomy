// apps/web/lib/auth/parseCredentials.test.ts
import { describe, it, expect } from 'vitest'
import { parseCredentials } from './parseCredentials'

describe('parseCredentials', () => {
  it('trims email and returns password', () => {
    const formData = new FormData()
    formData.set('email', '  test@example.com  ')
    formData.set('password', 'secret')

    const result = parseCredentials(formData)

    expect(result.email).toBe('test@example.com')
    expect(result.password).toBe('secret')
  })

  it('handles missing values', () => {
    const formData = new FormData()

    const result = parseCredentials(formData)

    expect(result.email).toBe('')
    expect(result.password).toBe('')
  })
})