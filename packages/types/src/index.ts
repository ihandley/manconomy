export type Id = string;

export type CurrencyCode = "USD";

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: Id;
  type: TransactionType;
  name: string;
  amount: Money;
  category: string;
  occurredAt: string;
  notes?: string;
}

export interface BudgetCategory {
  id: Id;
  name: string;
  monthlyLimit?: Money;
}

export interface Account {
  id: Id;
  name: string;
  kind: "checking" | "savings" | "credit" | "cash" | "investment";
}