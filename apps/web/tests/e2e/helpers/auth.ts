// apps/web/tests/e2e/helpers/auth.ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, Page } from '@playwright/test'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function uniqueEmail(prefix = 'e2e') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
}

export async function signUpAndReachPhoneVerification(
  page: Page,
  options?: {
    emailPrefix?: string
    password?: string
  }
) {
  const password = options?.password ?? 'Password123!'
  const email = uniqueEmail(options?.emailPrefix)

  await page.goto('/signup')

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign up' }).click()

  await expect(page).toHaveURL(/\/verify-phone/)

  return { email, password }
}

export async function completePhoneVerification(page: Page) {
  await page.getByRole('button', { name: 'Mark phone verified' }).click()
  await expect(page).toHaveURL(/\/onboarding/)
}

export async function completeOnboarding(
  page: Page,
  options: {
    displayName?: string
    inviteCode?: string
  }
) {
  const displayName = options?.displayName ?? `E2E ${Date.now()}`
  const inviteCode = options.inviteCode ?? (await createE2eInviteCode())

  await page.getByLabel('Display name').fill(displayName)
  await page.getByLabel('Invite code').fill(inviteCode)
  await page.getByLabel('Neighborhood').selectOption({ index: 1 })
  await page.getByRole('button', { name: 'Finish onboarding' }).click()
  await expect(page).toHaveURL(/\/app/)

  return { displayName }
}

export async function logIn(
  page: Page,
  credentials: {
    email: string
    password: string
  }
) {
  await page.goto('/login')

  await page.getByLabel('Email').fill(credentials.email)
  await page.getByLabel('Password').fill(credentials.password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

export async function signUpAndReachApp(
  page: Page,
  options: {
    emailPrefix?: string
    password?: string
    displayName?: string
    inviteCode?: string
  }
) {
  const credentials = await signUpAndReachPhoneVerification(page, options)

  await completePhoneVerification(page)
  await completeOnboarding(page, {
    displayName: options?.displayName,
    inviteCode: options.inviteCode,
  })

  return credentials
}

async function createE2eInviteCode() {
  const supabaseUrl =
    getEnv('SUPABASE_URL') ?? getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'E2E invite setup requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  const supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  })
  const { data: neighborhood, error: neighborhoodError } = await supabase
    .from('neighborhoods')
    .select('id')
    .eq('slug', 'pilot-neighborhood')
    .single()

  if (neighborhoodError) {
    throw new Error(
      `Could not load E2E neighborhood: ${neighborhoodError.message}`
    )
  }

  const code = `E2E-${crypto.randomUUID()}`
  const { error } = await supabase.from('invite_codes').insert({
    code,
    neighborhood_id: neighborhood.id,
  })

  if (error) {
    throw new Error(`Could not create E2E invite code: ${error.message}`)
  }

  return code
}

function getEnv(name: string) {
  return (
    process.env[name] ??
    readEnvFile(join(process.cwd(), '../../.env'))[name] ??
    readEnvFile(join(process.cwd(), '.env'))[name]
  )
}

function readEnvFile(path: string) {
  try {
    return Object.fromEntries(
      readFileSync(path, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const [key, ...valueParts] = line.split('=')
          const value = valueParts.join('=').replace(/\s+#.*$/, '').trim()
          return [key, value]
        })
    )
  } catch {
    return {}
  }
}
