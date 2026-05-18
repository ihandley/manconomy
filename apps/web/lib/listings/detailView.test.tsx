import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ListingDetail } from "./detail";
import {
  ListingDetailError,
  ListingDetailLoading,
  ListingDetailNotFound,
  ListingDetailView,
} from "./detailView";

const activeListing: ListingDetail = {
  id: "listing-1",
  sellerId: "seller-1",
  title: "Cordless Drill",
  description: "Works great.",
  listingType: "item",
  status: "active",
  category: "tools",
  condition: "good",
  askingCredits: 25,
  photoUrls: ["https://example.test/drill.jpg"],
  aiSuggestedPrice: 25,
  aiConfidence: 0.82,
  aiSeal: true,
  listedAt: "2026-05-13T00:00:00.000Z",
  sellerDisplayName: "Ian",
  neighborhoodName: "Old Town",
};

describe("ListingDetailView", () => {
  it("renders active listing fields and buyer trade CTA", () => {
    render(
      <ListingDetailView currentUserId="buyer-1" listing={activeListing} />,
    );

    expect(
      screen.getByRole("heading", { name: "Cordless Drill" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Works great.")).toBeInTheDocument();
    expect(screen.getByText("25 credits")).toBeInTheDocument();
    expect(screen.getByText("tools")).toBeInTheDocument();
    expect(screen.getByText("good")).toBeInTheDocument();
    expect(screen.getByText("Ian")).toBeInTheDocument();
    expect(screen.getByText("Old Town")).toBeInTheDocument();
    expect(screen.getByText("AI price checked")).toBeInTheDocument();
    expect(screen.getByText("Suggested price: 25 credits")).toBeInTheDocument();
    expect(screen.getByText("Confidence: 82%")).toBeInTheDocument();
    expect(document.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.test/drill.jpg",
    );
    expect(screen.getByRole("link", { name: "Request trade" })).toHaveAttribute(
      "href",
      "/app/listings/listing-1/request-trade",
    );
  });

  it("shows unavailable state and hides CTA for non-active listings", () => {
    render(
      <ListingDetailView
        currentUserId="buyer-1"
        listing={{ ...activeListing, status: "completed" }}
      />,
    );

    expect(
      screen.getByText("This listing is unavailable."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Request trade" }),
    ).not.toBeInTheDocument();
  });

  it("hides buyer CTA for the listing owner", () => {
    render(
      <ListingDetailView currentUserId="seller-1" listing={activeListing} />,
    );

    expect(
      screen.getByText(
        "This is your listing, so buyer trade actions are hidden.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Request trade" }),
    ).not.toBeInTheDocument();
  });

  it("renders not-found, error, loading, and photo fallback states", () => {
    const { rerender } = render(<ListingDetailNotFound />);
    expect(screen.getByText("Listing not found.")).toBeInTheDocument();

    rerender(<ListingDetailError message="database offline" />);
    expect(
      screen.getByText("Listing could not be loaded: database offline"),
    ).toBeInTheDocument();

    rerender(<ListingDetailLoading />);
    expect(document.querySelector(".h-64")).toBeInTheDocument();

    rerender(
      <ListingDetailView
        currentUserId="buyer-1"
        listing={{ ...activeListing, photoUrls: [], description: null }}
      />,
    );
    expect(screen.getByText("No photo")).toBeInTheDocument();
    expect(screen.getByText("No description provided.")).toBeInTheDocument();
  });
});
