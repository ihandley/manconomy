import type { User } from '@supabase/supabase-js'
import type { createClient } from '../supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User,
  email = user.email ?? ''
) {
  return supabase.from('profiles').upsert(
    {
      id: user.id,
      email,
    },
    {
      onConflict: 'id',
      ignoreDuplicates: true,
    }
  )
}
