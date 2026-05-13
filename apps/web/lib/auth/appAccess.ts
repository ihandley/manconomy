export type AppAccessProfile = {
  phone_verified_at: string | null
}

export function hasAppAccess(profile: AppAccessProfile | null | undefined) {
  return Boolean(profile?.phone_verified_at)
}

export type OnboardingProfile = AppAccessProfile & {
  display_name: string | null
  neighborhood_id: string | null
  onboarding_completed_at: string | null
}

export function hasCompletedOnboarding(
  profile: OnboardingProfile | null | undefined
) {
  return Boolean(
    profile?.phone_verified_at &&
    profile.display_name?.trim() &&
    profile.neighborhood_id &&
    profile.onboarding_completed_at
  )
}
