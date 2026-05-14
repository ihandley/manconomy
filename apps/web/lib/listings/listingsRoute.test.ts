import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../app/api/listings/route";
import { createListingFromPayload } from "@/lib/listings/createListing";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/listings/createListing", () => ({
  createListingFromPayload: vi.fn(),
}));

const createClientMock = vi.mocked(createClient);
const createListingFromPayloadMock = vi.mocked(createListingFromPayload);

describe("POST /api/listings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the created listing from a valid JSON request", async () => {
    const supabase = { auth: { getUser: vi.fn() } };
    const payload = { title: "Cordless Drill" };
    const listing = {
      id: "listing-1",
      seller_id: "user-1",
      status: "active",
    };

    createClientMock.mockResolvedValue(supabase as never);
    createListingFromPayloadMock.mockResolvedValue({
      ok: true,
      listing,
    });

    const response = await POST(
      new Request("http://localhost/api/listings", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );

    await expect(response.json()).resolves.toEqual({ listing });
    expect(response.status).toBe(201);
    expect(createListingFromPayloadMock).toHaveBeenCalledWith(
      supabase,
      payload,
    );
  });

  it("returns a clear error for invalid JSON", async () => {
    createClientMock.mockResolvedValue({} as never);

    const response = await POST(
      new Request("http://localhost/api/listings", {
        method: "POST",
        body: "{",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      error: "Submit listing details as JSON.",
    });
    expect(response.status).toBe(400);
    expect(createListingFromPayloadMock).not.toHaveBeenCalled();
  });
});
