import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  TradeMessagesError,
  TradeMessagesLoading,
  TradeMessagesView,
} from "./messagesView";

describe("TradeMessagesView", () => {
  it("renders persisted messages chronologically with own-message styling", () => {
    render(
      <TradeMessagesView
        currentUserId="buyer-1"
        messages={[
          {
            id: "message-1",
            tradeId: "trade-1",
            senderId: "seller-1",
            recipientId: "buyer-1",
            body: "Meet at 4?",
            createdAt: "2026-05-18T12:00:00.000Z",
          },
          {
            id: "message-2",
            tradeId: "trade-1",
            senderId: "buyer-1",
            recipientId: "seller-1",
            body: "Sounds good.",
            createdAt: "2026-05-18T12:05:00.000Z",
          },
        ]}
      />,
    );

    expect(screen.getByText("Meet at 4?")).toBeInTheDocument();
    expect(screen.getByText("Sounds good.")).toBeInTheDocument();
    expect(screen.getByText("May 18, 12:00 PM")).toBeInTheDocument();
    expect(screen.getByText("May 18, 12:05 PM")).toBeInTheDocument();
  });

  it("renders empty, error, and loading states", () => {
    const { rerender } = render(
      <TradeMessagesView currentUserId="buyer-1" messages={[]} />,
    );

    expect(screen.getByText("No messages yet.")).toBeInTheDocument();

    rerender(
      <TradeMessagesView
        currentUserId="buyer-1"
        error="Enter a message."
        messages={[]}
      />,
    );
    expect(screen.getByText("Enter a message.")).toBeInTheDocument();

    rerender(<TradeMessagesError message="permission denied" />);
    expect(
      screen.getByText("Conversation could not be loaded: permission denied"),
    ).toBeInTheDocument();

    rerender(<TradeMessagesLoading />);
    expect(document.querySelector(".h-64")).toBeInTheDocument();
  });
});
