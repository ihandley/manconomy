import type { User } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import { ensureUserProfile } from './profile'

function createProfileClient() {
  const upsert = vi.fn().mockResolvedValue({ error: null })
  const from = vi.fn(() => ({ upsert }))

  return {
    client: { from } as unknown as Parameters<typeof ensureUserProfile>[0],
    from,
    upsert,
  }
}

describe('ensureUserProfile', () => {
  it('creates a profile when missing', async () => {
    const { client, from, upsert } = createProfileClient()
    const user = {
      id: 'user-1',
      email: 'user@example.com',
    } as User

    const result = await ensureUserProfile(client, user)

    expect(result.error).toBeNull()
    expect(from).toHaveBeenCalledWith('profiles')
    expect(upsert).toHaveBeenCalledWith(
      {
        id: 'user-1',
        email: 'user@example.com',
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    )
  })

  it('is idempotent when the profile already exists', async () => {
    const { client, upsert } = createProfileClient()
    const user = {
      id: 'user-1',
      email: 'user@example.com',
    } as User

    await expect(ensureUserProfile(client, user)).resolves.toEqual({
      error: null,
    })

    expect(upsert).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        onConflict: 'id',
        ignoreDuplicates: true,
      })
    )
  })
})
