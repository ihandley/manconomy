import { describe, expect, it, vi } from 'vitest'
import { validateAndRedeemInviteCode } from './invite'

type RpcResponse = {
  data: unknown
  error: { message: string } | null
}

function createInviteClient(response: RpcResponse) {
  const rpc = vi.fn().mockResolvedValue(response)

  return {
    client: { rpc } as unknown as Parameters<
      typeof validateAndRedeemInviteCode
    >[0],
    rpc,
  }
}

describe('validateAndRedeemInviteCode', () => {
  it('redeems a valid code for the authenticated user', async () => {
    const { client, rpc } = createInviteClient({
      data: [{ id: 'invite-1', neighborhood_id: null }],
      error: null,
    })

    await expect(
      validateAndRedeemInviteCode(client, '  PILOT-123  ')
    ).resolves.toEqual({
      ok: true,
      invite: {
        id: 'invite-1',
        neighborhoodId: null,
      },
    })

    expect(rpc).toHaveBeenCalledWith('validate_and_redeem_invite_code', {
      invite_code: 'PILOT-123',
    })
  })

  it('fails unknown codes with a clear error', async () => {
    const { client } = createInviteClient({
      data: null,
      error: { message: 'Invite code not found.' },
    })

    await expect(validateAndRedeemInviteCode(client, 'missing')).resolves.toEqual(
      {
        ok: false,
        message: 'Invite code not found.',
      }
    )
  })

  it('fails expired codes with a clear error', async () => {
    const { client } = createInviteClient({
      data: null,
      error: { message: 'Invite code has expired.' },
    })

    await expect(validateAndRedeemInviteCode(client, 'expired')).resolves.toEqual(
      {
        ok: false,
        message: 'Invite code has expired.',
      }
    )
  })

  it('fails codes already used by another user', async () => {
    const { client } = createInviteClient({
      data: null,
      error: { message: 'Invite code has already been used.' },
    })

    await expect(validateAndRedeemInviteCode(client, 'used')).resolves.toEqual({
      ok: false,
      message: 'Invite code has already been used.',
    })
  })

  it('returns the invite neighborhood association when present', async () => {
    const { client } = createInviteClient({
      data: [{ id: 'invite-1', neighborhood_id: 'neighborhood-1' }],
      error: null,
    })

    await expect(
      validateAndRedeemInviteCode(client, 'neighborhood-code')
    ).resolves.toEqual({
      ok: true,
      invite: {
        id: 'invite-1',
        neighborhoodId: 'neighborhood-1',
      },
    })
  })

  it('does not accept a client-supplied user id', async () => {
    const { client, rpc } = createInviteClient({
      data: [{ id: 'invite-1', neighborhood_id: null }],
      error: null,
    })

    await validateAndRedeemInviteCode(client, 'pilot')

    expect(rpc).toHaveBeenCalledWith('validate_and_redeem_invite_code', {
      invite_code: 'pilot',
    })
  })
})
