import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../lib/supabase/server";

export default async function RequestTradePlaceholderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen justify-center p-6">
      <main className="flex w-full max-w-2xl flex-col gap-4">
        <Link href={`/app/listings/${id}`} className="text-sm underline">
          Back to listing
        </Link>
        <h1 className="text-2xl font-semibold">Request trade</h1>
        <p className="text-sm text-foreground/70">
          Trade request flow is coming next.
        </p>
      </main>
    </div>
  );
}
