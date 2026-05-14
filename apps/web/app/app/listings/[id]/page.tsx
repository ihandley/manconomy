import Link from "next/link";

export default async function ListingDetailPlaceholder({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link href="/app" className="text-sm underline">
          Back to feed
        </Link>
        <h1 className="text-2xl font-semibold">Listing detail</h1>
        <p className="text-sm text-foreground/70">
          Listing detail for {id} will be available here.
        </p>
      </main>
    </div>
  );
}
