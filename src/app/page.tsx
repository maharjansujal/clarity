import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-800 dark:to-indigo-800 p-6">
      <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">
        Clarity
      </h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8 text-center max-w-md">
        Track your income and expenses. Understand your money better.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:opacity-90 transition"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
