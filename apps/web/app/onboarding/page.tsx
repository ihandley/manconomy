import { redirect } from 'next/navigation'
import { hasAppAccess, hasCompletedOnboarding } from '../../lib/auth/appAccess'
import { ensureUserProfile } from '../../lib/auth/profile'
import { createClient } from '../../lib/supabase/server'
import { OnboardingForm } from './form'

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error: profileCreateError } = await ensureUserProfile(supabase, user)

  if (profileCreateError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Set up your profile</h1>
          <p className="text-sm">
            Profile could not be created: {profileCreateError.message}
          </p>
        </div>
      </div>
    )
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      'display_name, neighborhood_id, onboarding_completed_at, phone_verified_at'
    )
    .eq('id', user.id)
    .single()

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Set up your profile</h1>
          <p className="text-sm">
            Profile could not be loaded: {error.message}
          </p>
        </div>
      </div>
    )
  }

  if (!hasAppAccess(profile)) {
    redirect('/verify-phone')
  }

  if (hasCompletedOnboarding(profile)) {
    redirect('/app')
  }

  const { data: neighborhoods, error: neighborhoodsError } = await supabase
    .from('neighborhoods')
    .select('id, name, city, state')
    .eq('is_active', true)
    .order('name')

  if (neighborhoodsError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Set up your profile</h1>
          <p className="text-sm">
            Neighborhoods could not be loaded: {neighborhoodsError.message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <OnboardingForm
        defaultDisplayName={profile.display_name ?? ''}
        defaultNeighborhoodId={profile.neighborhood_id ?? ''}
        neighborhoods={neighborhoods ?? []}
      />
    </div>
  )
}
