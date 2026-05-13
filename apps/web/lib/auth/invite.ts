import type { createClient } from '../supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

export type InviteRedemptionResult =
  | {
      ok: true
      invite: {
        id: string
        neighborhoodId: string | null
      }
    }
  | {
      ok: false
      message: string
    }

type RedeemedInvite = {
  id: string
  neighborhood_id: string | null
}

export async function validateAndRedeemInviteCode(
  supabase: SupabaseClient,
  code: string
): Promise<InviteRedemptionResult> {
  const inviteCode = code.trim()

  if (!inviteCode) {
    return { ok: false, message: 'Enter an invite code.' }
  }

  const { data, error } = await supabase.rpc(
    'validate_and_redeem_invite_code',
    {
      invite_code: inviteCode,
    }
  )

  if (error) {
    return { ok: false, message: error.message }
  }

  const redeemedInvite = Array.isArray(data)
    ? (data[0] as RedeemedInvite | undefined)
    : undefined

  if (!redeemedInvite) {
    return { ok: false, message: 'Invite code could not be redeemed.' }
  }

  return {
    ok: true,
    invite: {
      id: redeemedInvite.id,
      neighborhoodId: redeemedInvite.neighborhood_id,
    },
  }
}
