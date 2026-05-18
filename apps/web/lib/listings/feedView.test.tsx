import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingFeed, ListingFeedError, ListingFeedLoading } from "./feedView";
import ListingDetailPlaceholder from "../../app/app/listings/[id]/page";

describe("ListingFeed", () => {
  it("renders all required listing metadata and links to detail", () => {
    render(
      <ListingFeed
        listings={[
          {
            id: "listing-1",
            title: "Cordless Drill",
            listingType: "item",
            status: "active",
            category: "tools",
            condition: "good",
            askingCredits: 25,
            listedAt: "2026-05-13T00:00:00.000Z",
            thumbnailUrl: "https://example.test/drill.jpg",
            sellerDisplayName: "Ian",
            neighborhoodName: "Old Town",
          },
        ]}
      />,
    );

    const card = screen.getByRole("link", { name: /cordless drill/i });
    expect(card).toHaveAttribute("href", "/app/listings/listing-1");
    expect(screen.getByText("25 credits")).toBeInTheDocument();
    expect(screen.getByText("item")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("tools")).toBeInTheDocument();
    expect(screen.getByText("good")).toBeInTheDocument();
    expect(screen.getByText("Ian")).toBeInTheDocument();
    expect(screen.getByText("Old Town")).toBeInTheDocument();
    expect(screen.getByText("May 13, 2026")).toBeInTheDocument();
    expect(document.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.test/drill.jpg",
    );
  });

  it("renders empty state", () => {
    render(<ListingFeed listings={[]} />);

    expect(
      screen.getByText("No active listings in your neighborhood yet."),
    ).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(<ListingFeedError message="database offline" />);

    expect(
      screen.getByText("Listings could not be loaded: database offline"),
    ).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(<ListingFeedLoading />);

    expect(document.querySelectorAll(".h-28")).toHaveLength(3);
  });

  it("renders thumbnail fallback", () => {
    render(
      <ListingFeed
        listings={[
          {
            id: "listing-2",
            title: "Socket Set",
            listingType: "item",
            status: "active",
            category: null,
            condition: null,
            askingCredits: null,
            listedAt: "2026-05-14T00:00:00.000Z",
            thumbnailUrl: null,
            sellerDisplayName: null,
            neighborhoodName: null,
          },
        ]}
      />,
    );

    expect(screen.getByText("No photo")).toBeInTheDocument();
    expect(screen.getAllByText("Unspecified")).toHaveLength(2);
    expect(screen.getByText("Unknown seller")).toBeInTheDocument();
    expect(screen.getByText("Unknown neighborhood")).toBeInTheDocument();
  });

  it("renders the detail placeholder route targeted by feed cards", async () => {
    render(
      await ListingDetailPlaceholder({
        params: Promise.resolve({ id: "listing-1" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Listing detail" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Listing detail for listing-1 will be available here."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to feed" })).toHaveAttribute(
      "href",
      "/app",
    );
  });
});
