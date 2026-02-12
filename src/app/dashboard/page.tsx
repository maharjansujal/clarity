import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import TransactionList from "@/components/TransactionList";
import { pool } from "@/lib/db"; // your pg pool

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Fetch transactions for the current user
  const result = await pool.query(
    "SELECT * FROM transactions WHERE user_id = $1",
    [session.user.id]
  );
  const transactions = result.rows;

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <main className="min-h-screen p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {session.user?.email}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Total Income</p>
            <p className="text-xl font-bold mt-2">${totalIncome.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Total Expenses</p>
            <p className="text-xl font-bold mt-2">${totalExpenses.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
            <p className="text-sm text-slate-500">Balance</p>
            <p className="text-xl font-bold mt-2">${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Transactions List (client component) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
          <TransactionList />
        </div>
      </div>
    </main>
  );
}
