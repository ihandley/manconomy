import type { Transaction } from "@manconomy/types";

const sampleTransaction: Transaction = {
  id: "txn_1",
  type: "expense",
  name: "Groceries",
  amount: {
    amount: 84.12,
    currency: "USD",
  },
  category: "Food",
  occurredAt: new Date().toISOString(),
};

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Manconomy</h1>
      <p className="mt-4">First shared type is wired up.</p>

      <pre className="mt-6 rounded border p-4 text-sm overflow-x-auto">
        {JSON.stringify(sampleTransaction, null, 2)}
      </pre>
    </main>
  );
}