import type { TradeMessage } from "./messages";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function TradeMessagesView({
  currentUserId,
  error,
  messages,
}: {
  currentUserId: string;
  error?: string;
  messages: TradeMessage[];
}) {
  return (
    <section className="grid gap-4">
      {error ? <p className="rounded border p-3 text-sm">{error}</p> : null}

      <div className="grid gap-3 rounded border p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-foreground/70">No messages yet.</p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;

            return (
              <article
                key={message.id}
                className={
                  isOwnMessage
                    ? "justify-self-end rounded bg-foreground px-3 py-2 text-background"
                    : "justify-self-start rounded border px-3 py-2"
                }
              >
                <p className="whitespace-pre-wrap text-sm">{message.body}</p>
                <time
                  dateTime={message.createdAt}
                  className={
                    isOwnMessage
                      ? "mt-1 block text-xs text-background/70"
                      : "mt-1 block text-xs text-foreground/70"
                  }
                >
                  {timeFormatter.format(new Date(message.createdAt))}
                </time>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export function TradeMessagesError({ message }: { message: string }) {
  return (
    <section className="rounded border p-6 text-sm">
      Conversation could not be loaded: {message}
    </section>
  );
}

export function TradeMessagesLoading() {
  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <div className="h-5 w-28 rounded bg-foreground/10" />
        <div className="h-8 w-48 rounded bg-foreground/10" />
        <div className="h-64 rounded border bg-foreground/5" />
        <div className="h-24 rounded border bg-foreground/5" />
      </main>
    </div>
  );
}
