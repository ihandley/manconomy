import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

async function signOut() {
  'use server'

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

async function updateProfile(formData: FormData) {
  'use server'

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const displayName = String(formData.get('display_name') ?? '').trim()

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: displayName || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    redirect(`/app?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/app?message=Profile updated')
}

export default async function AppPage({
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

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, display_name, created_at, updated_at')
    .eq('id', user.id)
    .single()

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-4">
          <h1 className="text-2xl font-semibold">Signed in</h1>
          <p>{user.email}</p>
          <p className="text-sm">Profile could not be loaded: {error.message}</p>

          <form action={signOut}>
            <button type="submit" className="rounded border px-3 py-2">
              Sign out
            </button>
          </form>
        </div>
      </div>
    )
  }

  const params = await searchParams
  const message = params.message

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4">
        <h1 className="text-2xl font-semibold">Signed in</h1>

        <p><strong>Auth email:</strong> {user.email}</p>
        <p><strong>Profile email:</strong> {profile.email}</p>
        <p><strong>Profile id:</strong> {profile.id}</p>

        <form action={updateProfile} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span>Display name</span>
            <input
              name="display_name"
              defaultValue={profile.display_name ?? ''}
              className="rounded border px-3 py-2"
            />
          </label>

          <button type="submit" className="rounded border px-3 py-2">
            Save profile
          </button>
        </form>

        {message ? <p className="text-sm">{message}</p> : null}

        <form action={signOut}>
          <button type="submit" className="rounded border px-3 py-2">
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}