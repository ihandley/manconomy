import type { User } from "@supabase/supabase-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  generateListingDraftFromPhotos,
  validateListingDraftAiOutput,
  type ListingDraftAiClient,
} from "./aiDraft";
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

function createAiOutput(overrides: Record<string, unknown> = {}) {
  return {
    title: "Vintage Denim Jacket",
    description: "A clean denim jacket with light wear visible in the photos.",
    category: "clothing",
    condition: "good",
    credit_price: 35,
    ai_confidence: 0.82,
    ai_suggested_price: 35,
    ...overrides,
  };
}

function createSupabaseClient(user: User | null, downloadData: Blob | null) {
  const download = vi.fn(async () => ({
    data: downloadData,
    error: downloadData ? null : { message: "missing" },
  }));
  const from = vi.fn(() => ({ download }));
  const getUser = vi.fn(async () => ({
    data: { user },
  }));

  return {
    client: {
      auth: { getUser },
      storage: { from },
    } as unknown as Parameters<typeof generateListingDraftFromPhotos>[0],
    download,
    from,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generateListingDraftFromPhotos", () => {
  it("fails when the user is not authenticated", async () => {
    const { client, download } = createSupabaseClient(null, new Blob(["x"]));
    const aiClient = vi.fn();

    await expect(
      generateListingDraftFromPhotos(
        client,
        [createPhotoReference()],
        aiClient,
      ),
    ).resolves.toEqual({
      ok: false,
      message: "Sign in to generate a listing draft.",
      status: 401,
    });

    expect(download).not.toHaveBeenCalled();
    expect(aiClient).not.toHaveBeenCalled();
  });

  it("fails empty photo sets", async () => {
    const { client } = createSupabaseClient(createUser(), new Blob(["x"]));

    await expect(generateListingDraftFromPhotos(client, [])).resolves.toEqual({
      ok: false,
      message: "Add at least one listing photo before generating a draft.",
      status: 400,
    });
  });

  it("fails invalid photo references before reading storage", async () => {
    const { client, download } = createSupabaseClient(
      createUser(),
      new Blob(["x"]),
    );

    await expect(
      generateListingDraftFromPhotos(client, [
        createPhotoReference({
          path: "another-user/listing-photos/photo-id.jpg",
        }),
      ]),
    ).resolves.toEqual({
      ok: false,
      message: "Use valid uploaded listing photo references.",
      status: 400,
    });

    expect(download).not.toHaveBeenCalled();
  });

  it("returns a structured draft from valid uploaded photos", async () => {
    const { client, download, from } = createSupabaseClient(
      createUser(),
      new Blob(["image-bytes"]),
    );
    const photo = createPhotoReference();
    const aiClient: ListingDraftAiClient = vi.fn(async () =>
      createAiOutput({ unsafe_server_field: "ignored" }),
    );

    await expect(
      generateListingDraftFromPhotos(client, [photo], aiClient),
    ).resolves.toEqual({
      ok: true,
      draft: {
        title: "Vintage Denim Jacket",
        description:
          "A clean denim jacket with light wear visible in the photos.",
        category: "clothing",
        condition: "good",
        credit_price: 35,
        ai_confidence: 0.82,
        ai_suggested_price: 35,
        photos: [photo],
      },
    });

    expect(from).toHaveBeenCalledWith(LISTING_PHOTO_BUCKET);
    expect(download).toHaveBeenCalledWith(photo.path);
    expect(aiClient).toHaveBeenCalledWith([
      expect.objectContaining({
        ...photo,
        dataUrl: "data:image/jpeg;base64,aW1hZ2UtYnl0ZXM=",
      }),
    ]);
  });

  it("returns a controlled error when AI generation fails", async () => {
    const { client } = createSupabaseClient(createUser(), new Blob(["x"]));
    const aiClient = vi.fn(async () => {
      throw new Error("timeout");
    });

    await expect(
      generateListingDraftFromPhotos(
        client,
        [createPhotoReference()],
        aiClient,
      ),
    ).resolves.toEqual({
      ok: false,
      message: "Could not generate a listing draft right now.",
      status: 502,
    });
  });

  it("rejects invalid AI payloads", async () => {
    const { client } = createSupabaseClient(createUser(), new Blob(["x"]));

    await expect(
      generateListingDraftFromPhotos(
        client,
        [createPhotoReference()],
        async () => createAiOutput({ credit_price: -1 }),
      ),
    ).resolves.toEqual({
      ok: false,
      message: "The listing draft response was invalid.",
      status: 502,
    });
  });
});

describe("validateListingDraftAiOutput", () => {
  it("trims fields and ignores unexpected AI fields", () => {
    expect(
      validateListingDraftAiOutput(
        createAiOutput({
          title: "  Vintage Denim Jacket  ",
          server_owned_state: "published",
        }),
      ),
    ).toEqual({
      title: "Vintage Denim Jacket",
      description:
        "A clean denim jacket with light wear visible in the photos.",
      category: "clothing",
      condition: "good",
      credit_price: 35,
      ai_confidence: 0.82,
      ai_suggested_price: 35,
    });
  });
});
