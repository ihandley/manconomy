// apps/web/tests/e2e/helpers/auth.ts
import { expect, Page } from '@playwright/test'

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
    inviteCode: string
  }
) {
  const displayName = options?.displayName ?? `E2E ${Date.now()}`

  await page.getByLabel('Display name').fill(displayName)
  await page.getByLabel('Invite code').fill(options.inviteCode)
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
    inviteCode: string
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
