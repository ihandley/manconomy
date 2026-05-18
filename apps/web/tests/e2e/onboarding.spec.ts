import { expect, test } from '@playwright/test'
import {
  completeOnboarding,
  completePhoneVerification,
  logIn,
  signUpAndReachApp,
  signUpAndReachPhoneVerification,
} from './helpers/auth'

test('signup user verifies phone, completes onboarding, and reaches app', async ({
  page,
}) => {
  await signUpAndReachPhoneVerification(page, {
    emailPrefix: 'e2e-onboarding-flow',
  })

  await completePhoneVerification(page)
  await completeOnboarding(page, { inviteCode: 'E2E-INVITE-011' })

  await expect(
    page.getByRole('heading', { name: 'Neighborhood feed' })
  ).toBeVisible()
  await expect(
    page.getByText('No active listings in your neighborhood yet.')
  ).toBeVisible()

  await page.reload()

  await expect(page).toHaveURL(/\/app/)
  await expect(
    page.getByRole('heading', { name: 'Neighborhood feed' })
  ).toBeVisible()
})

test('completed onboarding skips onboarding on future login', async ({
  page,
}) => {
  const credentials = await signUpAndReachApp(page, {
    emailPrefix: 'e2e-onboarding-returning',
    inviteCode: 'E2E-INVITE-012',
  })

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login/)

  await logIn(page, credentials)

  await expect(page).toHaveURL(/\/app/)
  await expect(
    page.getByRole('heading', { name: 'Neighborhood feed' })
  ).toBeVisible()
})

test('onboarding validation blocks incomplete submission', async ({ page }) => {
  await signUpAndReachPhoneVerification(page, {
    emailPrefix: 'e2e-onboarding-validation',
  })
  await completePhoneVerification(page)

  await page.getByRole('button', { name: 'Finish onboarding' }).click()

  await expect(page).toHaveURL(/\/onboarding/)
  await expect(
    page.getByRole('alert').filter({ hasText: 'Enter a display name.' })
  ).toBeVisible()
})
