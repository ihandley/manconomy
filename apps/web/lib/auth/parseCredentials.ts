// apps/web/lib/auth/parseCredentials.ts
export function parseCredentials(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  return { email, password }
}