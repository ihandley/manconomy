export type OnboardingFields = {
  displayName: string
  neighborhoodId: string
}

export type OnboardingValidationResult =
  | {
      ok: true
      fields: OnboardingFields
    }
  | {
      ok: false
      message: string
    }

export function validateOnboardingForm(
  formData: FormData,
  validNeighborhoodIds: Set<string>
): OnboardingValidationResult {
  const displayName = String(formData.get('display_name') ?? '').trim()
  const neighborhoodId = String(formData.get('neighborhood_id') ?? '').trim()

  if (!displayName) {
    return { ok: false, message: 'Enter a display name.' }
  }

  if (!neighborhoodId) {
    return { ok: false, message: 'Choose a neighborhood.' }
  }

  if (!validNeighborhoodIds.has(neighborhoodId)) {
    return { ok: false, message: 'Choose one of the available neighborhoods.' }
  }

  return {
    ok: true,
    fields: {
      displayName,
      neighborhoodId,
    },
  }
}
