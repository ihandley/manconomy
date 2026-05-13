import { redirect } from 'next/navigation'
import { hasAppAccess } from '../../lib/auth/appAccess'
import { ensureUserProfile } from '../../lib/auth/profile'
import { createClient } from '../../lib/supabase/server'

async function completePhoneVerification() {
  'use server'

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error: profileCreateError } = await ensureUserProfile(supabase, user)

  if (profileCreateError) {
    redirect(
      `/verify-phone?message=${encodeURIComponent(profileCreateError.message)}`
    )
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      phone_verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    redirect(`/verify-phone?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/app')
}

export default async function VerifyPhonePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error: profileCreateError } = await ensureUserProfile(supabase, user)

  if (profileCreateError) {
    redirect(
      `/verify-phone?message=${encodeURIComponent(profileCreateError.message)}`
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('phone_verified_at')
    .eq('id', user.id)
    .single()

  if (hasAppAccess(profile)) {
    redirect('/app')
  }

  const params = await searchParams
  const message = params.message

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-2xl font-semibold">Verify your phone</h1>

        <p>
          Phone verification is required before you can continue to the
          marketplace.
        </p>

        <form action={completePhoneVerification}>
          <button type="submit" className="rounded border px-3 py-2">
            Mark phone verified
          </button>
        </form>

        {message ? <p className="text-sm">{message}</p> : null}
      </div>
    </div>
  )
}
