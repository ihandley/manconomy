import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

async function login(formData: FormData) {
  'use server'

  const supabase = await createClient()

  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  redirect('/app')
}

export default async function LoginPage({
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
      <form action={login} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">Log in</h1>

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
          Log in
        </button>

        <p className="text-sm">
          Need an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>

        {message ? <p className="text-sm">{message}</p> : null}
      </form>
    </div>
  )
}