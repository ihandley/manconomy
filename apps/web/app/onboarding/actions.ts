'use server'

import { redirect } from 'next/navigation'
import { ensureUserProfile } from '../../lib/auth/profile'
import { validateOnboardingForm } from '../../lib/auth/onboarding'
import { createClient } from '../../lib/supabase/server'

export type OnboardingActionState = {
  message: string | null
}

export async function completeOnboarding(
  _previousState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error: profileCreateError } = await ensureUserProfile(supabase, user)

  if (profileCreateError) {
    return { message: profileCreateError.message }
  }

  const { data: neighborhoods, error: neighborhoodsError } = await supabase
    .from('neighborhoods')
    .select('id')
    .eq('is_active', true)

  if (neighborhoodsError) {
    return { message: neighborhoodsError.message }
  }

  const validNeighborhoodIds = new Set(
    (neighborhoods ?? []).map((neighborhood) => neighborhood.id)
  )
  const validation = validateOnboardingForm(formData, validNeighborhoodIds)

  if (!validation.ok) {
    return { message: validation.message }
  }

  const now = new Date().toISOString()
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: validation.fields.displayName,
      neighborhood_id: validation.fields.neighborhoodId,
      onboarding_completed_at: now,
      updated_at: now,
    })
    .eq('id', user.id)

  if (error) {
    return { message: error.message }
  }

  redirect('/app')
}
