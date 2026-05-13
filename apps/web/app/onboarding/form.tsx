'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import type { OnboardingActionState } from './actions'
import { completeOnboarding } from './actions'

type Neighborhood = {
  id: string
  name: string
  city: string | null
  state: string | null
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Finish onboarding'}
    </button>
  )
}

export function OnboardingForm({
  defaultDisplayName,
  defaultNeighborhoodId,
  neighborhoods,
}: {
  defaultDisplayName: string
  defaultNeighborhoodId: string
  neighborhoods: Neighborhood[]
}) {
  const initialState: OnboardingActionState = { message: null }
  const [state, formAction] = useActionState(completeOnboarding, initialState)

  return (
    <form
      action={formAction}
      noValidate
      className="flex w-full max-w-md flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">Set up your profile</h1>

      <label className="flex flex-col gap-1">
        <span>Display name</span>
        <input
          name="display_name"
          defaultValue={defaultDisplayName}
          required
          className="rounded border px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span>Neighborhood</span>
        <select
          name="neighborhood_id"
          defaultValue={defaultNeighborhoodId}
          required
          className="rounded border px-3 py-2"
        >
          <option value="">Choose a neighborhood</option>
          {neighborhoods.map((neighborhood) => {
            const location = [neighborhood.city, neighborhood.state]
              .filter(Boolean)
              .join(', ')

            return (
              <option key={neighborhood.id} value={neighborhood.id}>
                {location
                  ? `${neighborhood.name} (${location})`
                  : neighborhood.name}
              </option>
            )
          })}
        </select>
      </label>

      <SubmitButton />

      {state.message ? (
        <p role="alert" className="text-sm">
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
