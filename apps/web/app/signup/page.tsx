import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

async function signUp(formData: FormData) {
  'use server'

  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  const user = data.user

  if (!user) {
    redirect('/login?message=Account created. You can now sign in.')
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email ?? email,
  })

  if (profileError) {
    redirect(
      `/signup?message=${encodeURIComponent(
        `User created, but profile creation failed: ${profileError.message}`
      )}`
    )
  }

  redirect('/login?message=Account created. You can now sign in.')
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/app')
  }

  const params = await searchParams
  const message = params.message

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form action={signUp} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>

        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            name="email"
            type="email"
            required
            className="rounded border px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            name="password"
            type="password"
            required
            className="rounded border px-3 py-2"
          />
        </label>

        <button type="submit" className="rounded border px-3 py-2">
          Sign up
        </button>

        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </p>

        {message ? <p className="text-sm">{message}</p> : null}
      </form>
    </div>
  )
}