// apps/web/tests/e2e/helpers/auth.ts
import { expect, Page } from '@playwright/test'

export async function signUpAndReachApp(page: Page, options?: {
  emailPrefix?: string
  password?: string
}) {
  const emailPrefix = options?.emailPrefix ?? 'e2e'
  const password = options?.password ?? 'Password123!'
  const email = `${emailPrefix}-${Date.now()}@example.com`

  await page.goto('/signup')

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign up' }).click()

  await expect(page).toHaveURL(/\/app/)

  return { email, password }
}