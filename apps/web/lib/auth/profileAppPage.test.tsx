import type { User } from '@supabase/supabase-js'
import { describe, expect, it, vi } from 'vitest'
import AppPage from '../../app/app/page'

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`)
  }),
}))

vi.mock('../supabase/server', () => ({
  createClient: mocks.createClient,
}))

vi.mock('next/navigation', () => ({
  redirect: mocks.redirect,
}))

describe('AppPage profile bootstrap', () => {
  it('creates a missing profile before profile access continues', async () => {
    const calls: string[] = []
    const user = {
      id: 'user-1',
      email: 'user@example.com',
    } as User
    const profile = {
      id: user.id,
      email: user.email,
      display_name: null,
      phone_verified_at: '2026-05-13T00:00:00.000Z',
      created_at: '2026-05-13T00:00:00.000Z',
      updated_at: '2026-05-13T00:00:00.000Z',
    }
    const upsert = vi.fn(async () => {
      calls.push('upsert')
      return { error: null }
    })
    const single = vi.fn(async () => {
      calls.push('single')
      return { data: profile, error: null }
    })
    const eq = vi.fn(() => ({ single }))
    const select = vi.fn(() => {
      calls.push('select')
      return { eq }
    })
    const from = vi.fn(() => ({
      upsert,
      select,
    }))
    const getUser = vi.fn(async () => ({ data: { user } }))

    mocks.createClient.mockResolvedValue({
      auth: { getUser },
      from,
    })

    const page = await AppPage({ searchParams: Promise.resolve({}) })

    expect(page).toBeTruthy()
    expect(upsert).toHaveBeenCalledWith(
      {
        id: user.id,
        email: user.email,
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    )
    expect(select).toHaveBeenCalledWith(
      'id, email, display_name, phone_verified_at, created_at, updated_at'
    )
    expect(calls).toEqual(['upsert', 'select', 'single'])
  })
})
