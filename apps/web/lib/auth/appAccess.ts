export type AppAccessProfile = {
  phone_verified_at: string | null
}

export function hasAppAccess(profile: AppAccessProfile | null | undefined) {
  return Boolean(profile?.phone_verified_at)
}
