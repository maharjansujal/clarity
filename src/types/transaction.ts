export interface Transaction {
  id: string;
  title: string;
  user_id: string;
  type: "income" | "expense";
  amount: string; // Postgres NUMERIC comes back as string from pg
  category: string;
  description: string | null;
  date: string; // ISO string
  created_at: string;
}