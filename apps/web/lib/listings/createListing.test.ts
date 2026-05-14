import type { User } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createListingFromPayload } from "./createListing";
import {
  LISTING_PHOTO_BUCKET,
  type ListingPhotoReference,
} from "./photoUpload";

function createUser(id = "user-1") {
  return {
    id,
    email: "test@example.com",
  } as User;
}

function createPhotoReference(
  overrides: Partial<ListingPhotoReference> = {},
): ListingPhotoReference {
  return {
    bucket: LISTING_PHOTO_BUCKET,
    path: "user-1/listing-photos/photo-id.jpg",
    contentType: "image/jpeg",
    size: 4,
    ...overrides,
  };
}

function createPayload(overrides: Record<string, unknown> = {}) {
  return {
    title: "Cordless Drill",
    description: "Reliable drill with two batteries and a charger.",
    category: "tools",
    condition: "good",
    credit_price: 25,
    photos: [createPhotoReference()],
    ...overrides,
  };
}

function createSupabaseClient({
  user = createUser(),
  profile = {
    neighborhood_id: "neighborhood-1",
    onboarding_completed_at: "2026-05-13T00:00:00.000Z",
  },
  insertedListing = {},
  profileError = null,
  insertError = null,
}: {
  user?: User | null;
  profile?: Record<string, unknown> | null;
  insertedListing?: Record<string, unknown>;
  profileError?: { message: string } | null;
  insertError?: { message: string } | null;
} = {}) {
  const getUser = vi.fn(async () => ({ data: { user } }));
  const maybeSingle = vi.fn(async () => ({
    data: profile,
    error: profileError,
  }));
  const profileEq = vi.fn(() => ({ maybeSingle }));
  const profileSelect = vi.fn(() => ({ eq: profileEq }));

  const single = vi.fn(async () => ({
    data: {
      id: "listing-1",
      seller_id: user?.id,
      neighborhood_id: profile?.neighborhood_id,
      status: "active",
      ...insertedListing,
    },
    error: insertError,
  }));
  const listingSelect = vi.fn(() => ({ single }));
  const insert = vi.fn(() => ({ select: listingSelect }));

  const from = vi.fn((table: string) => {
    if (table === "profiles") {
      return { select: profileSelect };
    }

    return { insert };
  });

  return {
    client: {
      auth: { getUser },
      from,
    } as unknown as Parameters<typeof createListingFromPayload>[0],
    from,
    insert,
    profileEq,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createListingFromPayload", () => {
  it("creates one active listing owned by the authenticated user", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-13T12:00:00.000Z"));
    const { client, insert } = createSupabaseClient();

    await expect(
      createListingFromPayload(
        client,
        createPayload({
          user_id: "spoofed-user",
          seller_id: "spoofed-seller",
          status: "draft",
          created_at: "2000-01-01T00:00:00.000Z",
        }),
      ),
    ).resolves.toEqual({
      ok: true,
      listing: {
        id: "listing-1",
        seller_id: "user-1",
        neighborhood_id: "neighborhood-1",
        status: "active",
      },
    });

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith({
      seller_id: "user-1",
      neighborhood_id: "neighborhood-1",
      title: "Cordless Drill",
      description: "Reliable drill with two batteries and a charger.",
      category: "tools",
      condition: "good",
      asking_credits: 25,
      photos: [createPhotoReference()],
      ai_suggested_price: null,
      ai_confidence: null,
      ai_seal: false,
      status: "active",
      published_at: "2026-05-13T12:00:00.000Z",
    });
    vi.useRealTimers();
  });

  it("persists valid AI draft metadata and marks accepted AI price listings", async () => {
    const { client, insert } = createSupabaseClient();

    await createListingFromPayload(
      client,
      createPayload({
        ai_suggested_price: 25,
        ai_confidence: 0.82,
      }),
    );

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        ai_suggested_price: 25,
        ai_confidence: 0.82,
        ai_seal: true,
      }),
    );
  });

  it("fails unauthenticated requests before reading profile or inserting", async () => {
    const { client, from } = createSupabaseClient({ user: null });

    await expect(
      createListingFromPayload(client, createPayload()),
    ).resolves.toEqual({
      ok: false,
      message: "Sign in to create a listing.",
      status: 401,
    });

    expect(from).not.toHaveBeenCalled();
  });

  it("fails users without completed onboarding neighborhood context", async () => {
    const { client, insert } = createSupabaseClient({
      profile: {
        neighborhood_id: null,
        onboarding_completed_at: null,
      },
    });

    await expect(
      createListingFromPayload(client, createPayload()),
    ).resolves.toEqual({
      ok: false,
      message: "Complete onboarding before creating a listing.",
      status: 403,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("returns validation errors without inserting invalid payloads", async () => {
    const { client, insert } = createSupabaseClient();

    await expect(
      createListingFromPayload(
        client,
        createPayload({
          title: " ",
          category: "clothing",
          condition: "mint",
          credit_price: -1,
          photos: [],
        }),
      ),
    ).resolves.toEqual({
      ok: false,
      message: "Enter a listing title.",
      status: 400,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects invalid category, condition, price, and photo references", async () => {
    const { client, insert } = createSupabaseClient();

    await expect(
      createListingFromPayload(client, createPayload({ category: "clothing" })),
    ).resolves.toMatchObject({
      ok: false,
      message: "Choose a supported listing category.",
    });

    await expect(
      createListingFromPayload(client, createPayload({ condition: "mint" })),
    ).resolves.toMatchObject({
      ok: false,
      message: "Choose a supported listing condition.",
    });

    await expect(
      createListingFromPayload(client, createPayload({ credit_price: 1.5 })),
    ).resolves.toMatchObject({
      ok: false,
      message: "Enter a non-negative whole-number credit price.",
    });

    await expect(
      createListingFromPayload(
        client,
        createPayload({
          photos: [
            createPhotoReference({
              path: "another-user/listing-photos/photo-id.jpg",
            }),
          ],
        }),
      ),
    ).resolves.toMatchObject({
      ok: false,
      message: "Use valid uploaded listing photo references.",
    });

    expect(insert).not.toHaveBeenCalled();
  });
});
