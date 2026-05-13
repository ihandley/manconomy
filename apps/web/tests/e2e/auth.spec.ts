import { test, expect } from '@playwright/test'
import { signUpAndReachApp } from './helpers/auth'

test('signed-out user visiting /app is redirected to /login', async ({ page }) => {
  await page.goto('/app')

  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
})

test('user can sign up and reach the authenticated app', async ({ page }) => {
  const { email } = await signUpAndReachApp(page)

  await expect(page.getByText(`Auth email: ${email}`)).toBeVisible()
  await expect(page.getByText(`Profile email: ${email}`)).toBeVisible()
})

test('signed-in user without phone verification is sent to verification', async ({ page }) => {
  const email = `e2e-unverified-${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('Password123!')
  await page.getByRole('button', { name: 'Sign up' }).click()

  await expect(page).toHaveURL(/\/verify-phone/)
  await expect(
    page.getByText('Phone verification is required before you can continue')
  ).toBeVisible()

  await page.goto('/app')

  await expect(page).toHaveURL(/\/verify-phone/)
})

test('authenticated user can sign out and is redirected back to login', async ({ page }) => {
  await signUpAndReachApp(page, { emailPrefix: 'e2e-signout' })

  await page.getByRole('button', { name: 'Sign out' }).click()

  await expect(page).toHaveURL(/\/login/)

  await page.goto('/app')
  await expect(page).toHaveURL(/\/login/)
})

test('authenticated user is redirected away from login and signup pages', async ({ page }) => {
  await signUpAndReachApp(page, { emailPrefix: 'e2e-redirects' })

  await page.goto('/login')
  await expect(page).toHaveURL(/\/app/)

  await page.goto('/signup')
  await expect(page).toHaveURL(/\/app/)
})

test('authenticated user can update their profile display name', async ({ page }) => {
  const displayName = `Ian Test ${Date.now()}`

  await signUpAndReachApp(page, { emailPrefix: 'e2e-profile' })

  await page.getByLabel('Display name').fill(displayName)
  await page.getByRole('button', { name: 'Save profile' }).click()

  await expect(page).toHaveURL(/\/app\?message=/)
  await expect(page.getByText('Profile updated')).toBeVisible()

  await page.reload()

  await expect(page.getByLabel('Display name')).toHaveValue(displayName)
})
